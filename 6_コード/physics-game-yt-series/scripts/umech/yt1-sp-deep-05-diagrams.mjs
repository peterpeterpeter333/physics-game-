// 深掘りショート 05（ys-deep-05）「二本目の虹は、なぜ色が逆？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の形は yt1-sp-deep-common.mjs。値の検算は台本 docs/video-revision-20260924/ytseries/sp-deep-05.mjs の冒頭。
// 雨粒の光の道は、このファイルの trace() で、スネルの規則と反射をベクトルで1回ずつ計算して描く（04 の図には頼らない）。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,WATER,SURF,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard} from './yt1-sp-deep-common.mjs';
import {strawScene,waveFronts} from './yt1-sp-deep-01-diagrams.mjs';

const K='deep05-',DEG=Math.PI/180;
const N_RED=1.331,N_VIO=1.343,N_WHITE=1.333;
const RED='#ff4b3e',VIO='#a274ff',BLUE='#3f8cff';
const f1=v=>Number(v.toFixed(1));

// ================= 色 =================
const STOPS=[[0,[255,75,62]],[.2,[255,154,60]],[.38,[255,226,74]],[.56,[76,211,106]],[.78,[63,140,255]],[1,[162,116,255]]];
function spec(u){u=clamp(u);for(let k=1;k<STOPS.length;k++){const [a,A]=STOPS[k-1],[b,B]=STOPS[k];if(u<=b){const v=(u-a)/(b-a);return `rgb(${A.map((x,j)=>Math.round(x+(B[j]-x)*v)).join(',')})`;}}return 'rgb(162,116,255)';}

// ================= 雨粒の光の道（計算） =================
// k 回反射の虹の光の入る角：cos²i ＝ (n²−1)/((k+1)²−1)
const rainbowI=(n,k)=>Math.acos(Math.sqrt((n*n-1)/((k+1)**2-1)));
// 太陽と反対の点からの角（k＝1,2）。最小偏角を数値で探す
function bowAngle(n,k){let best=1e9;for(let i=0;i<=90;i+=.01){const r=Math.asin(Math.sin(i*DEG)/n)/DEG,Dv=k*180+2*i-2*(k+1)*r;if(Dv<best)best=Dv;}return k===1?180-best:k===2?best-180:360-best;}
export const ANG={r1:bowAngle(N_RED,1),v1:bowAngle(N_VIO,1),r2:bowAngle(N_RED,2),v2:bowAngle(N_VIO,2),w1:bowAngle(N_WHITE,1),w2:bowAngle(N_WHITE,2)};
// 42.37, 40.65, 50.37, 53.48, 42.0, 50.9
const dotp=(a,b)=>a[0]*b[0]+a[1]*b[1];
function refract(d,N,eta){const ci=-dotp(N,d),k=1-eta*eta*(1-ci*ci);if(k<0)return null;const c=eta*ci-Math.sqrt(k);return [eta*d[0]+c*N[0],eta*d[1]+c*N[1]];}
// 光（左から右へ、向き (1,0)）を、雨粒（中心 O、半径 R）の高さ O.y＋b に入れ、中で k 回跳ね返して出す。
// 返す：pts（入る前の点・入る点・跳ね返る点…・出る点・出た後の点）、leaks（跳ね返る点で外へ出る光の [点, 向き]）、exit（出る向き）、ang（太陽と反対の向きからの角、度）
export function trace(O,R,b,n,k,{lin=420,lout=300}={}){
 const P0=[O[0]-Math.sqrt(R*R-b*b),O[1]+b];
 let d=[1,0],P=P0;const pts=[[P0[0]-lin,P0[1]],P0],leaks=[];
 d=refract(d,[(P[0]-O[0])/R,(P[1]-O[1])/R],1/n);
 for(let j=0;j<=k;j++){
  const s=-2*dotp([P[0]-O[0],P[1]-O[1]],d),Q=[P[0]+s*d[0],P[1]+s*d[1]],m=[(Q[0]-O[0])/R,(Q[1]-O[1])/R];
  pts.push(Q);
  if(j<k){const out=refract(d,[-m[0],-m[1]],n);if(out)leaks.push([Q,out]);const c=dotp(d,m);d=[d[0]-2*c*m[0],d[1]-2*c*m[1]];P=Q;}
  else{const e=refract(d,[-m[0],-m[1]],n);pts.push([Q[0]+lout*e[0],Q[1]+lout*e[1]]);
   return {pts,leaks,exit:e,E:Q,ang:Math.atan2(e[1],-e[0])/DEG};}
 }
}
// 虹の光の道：出た光が下（見る人の側）へ向かう向き（b の符号）を選ぶ
export function bowRay(O,R,n,k,opt){
 const b=R*Math.sin(rainbowI(n,k));
 const a=trace(O,R,-b,n,k,opt),c=trace(O,R,b,n,k,opt);
 return a.exit[1]>0?a:c;
}
const dropBody=(O,R,g=1)=>fade(g,`<circle cx="${O[0]}" cy="${O[1]}" r="${R}" fill="${WATER}" fill-opacity=".16"/>`+ring(O[0],O[1],R,{color:SURF,w:4}));
// 光の道を描く（g：描いていく進み）。widths：区間ごとの太さ（跳ね返るたびに細くする用）
function rayPath(tr,g,{color=LIGHT,w=6,widths,opac,arrows=true,from=1}={}){
 if(g<=0)return '';
 const P=tr.pts,L=[];let tot=0;for(let j=1;j<P.length;j++){const l=Math.hypot(P[j][0]-P[j-1][0],P[j][1]-P[j-1][1]);L.push(l);tot+=l;}
 let s='',acc=0;const goal=g*tot;
 for(let j=1;j<P.length;j++){const l=L[j-1];if(acc>=goal)break;if(j<from){acc+=l;continue;}const u=Math.min(1,(goal-acc)/l);
  const A=P[j-1],B=[mix(P[j-1][0],P[j][0],u),mix(P[j-1][1],P[j][1],u)];
  s+=line(A[0],A[1],B[0],B[1],{color,w:widths?widths[j-1]:w,opacity:opac?opac[j-1]:1});
  if(arrows&&(j===1||j===P.length-1)&&u>.75){const a=j===1?.55:.45;s+=arrow(mix(A[0],P[j][0],a-.12),mix(A[1],P[j][1],a-.12),mix(A[0],P[j][0],a+.08),mix(A[1],P[j][1],a+.08),{color,w:widths?widths[j-1]:w,head:20,opacity:opac?opac[j-1]:1});}
  acc+=l;}
 return s;
}
// 角の弧（点 E で、向き a0 から a1 へ、半径 r）。角は画面の向き（ラジアン）
function arcAt(E,a0,a1,r,{color=HC,w=4}={}){const pts=[];for(let k=0;k<=24;k++){const a=a0+(a1-a0)*k/24;pts.push([E[0]+r*Math.cos(a),E[1]+r*Math.sin(a)]);}return draw(pts,1,{color,w});}
// 出た光と「太陽の光と同じ向きを逆にたどる線」（左向き）の間の角
function exitAngle(tr,g,{r=100,text,len=230,size=44,tx,ty}={}){
 if(g<=0)return '';
 const E=tr.E,a1=Math.atan2(tr.exit[1],tr.exit[0]);
 let s=fade(seg(g,0,.4),line(E[0],E[1],E[0]-len,E[1],{color:C.dim,w:3,dash:'12 9'}));
 s+=fade(seg(g,.3,.7),arcAt(E,Math.PI,a1,r));
 const am=(Math.PI+a1)/2;
 s+=fade(seg(g,.5,1),plate(text??`約${Math.round(tr.ang)}°`,tx??E[0]+(r+34)*Math.cos(am),ty??E[1]+(r+34)*Math.sin(am)+14,{size,color:HC,anchor:'middle'}));
 return s;
}
const sunArrow=(x,y,g=1,text='太陽の光')=>fade(g,label(text,x,y,{size:38,color:LIGHT,weight:700}));
const ringsAt=(tr,g,{n,color=HC})=>fade(g,tr.pts.slice(2,2+n).map(q=>ring(q[0],q[1],24,{color,w:5})).join(''));

// ================= 空の図（太陽と反対の点を中心に、1° ＝ KPX px） =================
const KPX=12,SC=[500,860],HOR=800;
const arcD=(r,cx=SC[0],cy=SC[1])=>`M${f1(cx-r)} ${cy} A${f1(r)} ${f1(r)} 0 0 1 ${f1(cx+r)} ${cy}`;
const circD=(r,cx=SC[0],cy=SC[1])=>`M${f1(cx-r)} ${cy} A${f1(r)} ${f1(r)} 0 1 0 ${f1(cx+r)} ${cy} A${f1(r)} ${f1(r)} 0 1 0 ${f1(cx-r)} ${cy} Z`;
// 虹の帯：角 a（u＝0 の色）〜 b（u＝1 の色）。赤＝0、紫＝1
function bow(aRed,aVio,{op=1,N=14,g=1}={}){
 if(g<=0)return '';
 let s='';const w=Math.abs(aRed-aVio)*KPX/N+1.6;
 for(let j=0;j<N;j++){const u=(j+.5)/N,r=mix(aRed,aVio,u)*KPX;s+=`<path d="${arcD(r)}" fill="none" stroke="${spec(u)}" stroke-width="${f1(w)}" stroke-opacity="${f1(op)}"/>`;}
 return fade(g,s);
}
const R1o=ANG.r1*KPX,R1i=ANG.v1*KPX,R2i=ANG.r2*KPX,R2o=ANG.v2*KPX;
// 空の図。in1：1本目の内側を明るく、out2：2本目の外側を明るく、band：間を暗く、center：太陽と反対の点
function sky({g1=1,g2=1,in1=0,out2=0,band=0,center=0,id='a'}={}){
 let s=`<clipPath id="d05sk${id}"><rect x="0" y="0" width="${W}" height="${HOR}"/></clipPath><g clip-path="url(#d05sk${id})">`;
 s+=rect(0,0,W,HOR,{fill:'#16233d',fo:1,stroke:'none',rx:0});
 if(in1>0)s+=`<path d="${circD(R1o)}" fill="${LIGHT}" fill-opacity="${f1(.16*in1*100)/100}"/>`;
 if(out2>0)s+=`<path d="M0 0 H${W} V${HOR} H0 Z ${circD(R2i)}" fill-rule="evenodd" fill="${LIGHT}" fill-opacity="${f1(.12*out2*100)/100}"/>`;
 if(band>0)s+=`<path d="${circD(R2i)} ${circD(R1o)}" fill-rule="evenodd" fill="#000" fill-opacity="${f1(.4*band*100)/100}"/>`;
 s+=bow(ANG.r1,ANG.v1,{op:.95,g:g1})+bow(ANG.r2,ANG.v2,{op:.5,g:g2});
 s+='</g>';
 s+=rect(0,HOR,W,H-HOR,{fill:'#142019',fo:1,stroke:'none',rx:0})+line(0,HOR,W,HOR,{color:'#3c5a48',w:3});
 if(center>0)s+=fade(center,dot(SC[0],SC[1],12,HC)+label('太陽と反対の点',SC[0]+30,SC[1]+14,{size:36,color:HC,weight:700}));
 return s;
}
// 中心から角 a（度）の円の上の点（左右 phi：真上から右へ、度）
const onCircle=(a,phi)=>[SC[0]+a*KPX*Math.sin(phi*DEG),SC[1]-a*KPX*Math.cos(phi*DEG)];
function radius(a,phi,g,{color=HC,text,size=40,w=5}={}){
 if(g<=0)return '';
 const P=onCircle(a,phi),M=onCircle(a*.55,phi);
 return draw([SC,P],g,{color,w})+fade(seg(g,.6,1),plate(text??`${Math.round(a)}°`,M[0]+(phi<0?-14:14),M[1],{size,color,anchor:phi<0?'end':'start'}));
}

// ================= 雨粒の大きな図（4〜7） =================
const BO=[560,390],BR=250;
const TR1=bowRay(BO,BR,N_WHITE,1,{lin:600,lout:330});
const TR2=bowRay(BO,BR,N_WHITE,2,{lin:600,lout:360});
const TR3=bowRay(BO,BR,N_WHITE,2,{lin:600,lout:300});
function bigDrop(){return dropBody(BO,BR)+label('雨粒',BO[0]+BR*.72+20,BO[1]+BR*.72+60,{size:40,color:SURF,weight:700,anchor:'start'});}

// ================= 二つの雨粒（8・9・17） =================
const PO1=[270,350],PO2=[730,350],PR=150;
const P1W=bowRay(PO1,PR,N_WHITE,1,{lin:300,lout:170}),P2W=bowRay(PO2,PR,N_WHITE,2,{lin:200,lout:170});
const P1R=bowRay(PO1,PR,N_RED,1,{lin:300,lout:150}),P1V=bowRay(PO1,PR,N_VIO,1,{lin:300,lout:150});
const P2R=bowRay(PO2,PR,N_RED,2,{lin:200,lout:170}),P2V=bowRay(PO2,PR,N_VIO,2,{lin:200,lout:170});
// 回る向きの矢印（雨粒の中心のまわり、tr の向きに合わせる）
function spinArrow(O,tr,g,{r=62,color=HC}={}){
 if(g<=0)return '';
 const a=tr.pts[1],b=tr.pts[2],cr=(a[0]-O[0])*(b[1]-O[1])-(a[1]-O[1])*(b[0]-O[0]),dir=cr>0?1:-1; // 1：画面で時計回り
 const a0=dir>0?-Math.PI*.95:Math.PI*.95,a1=a0+dir*Math.PI*1.5*g,pts=[];for(let k=0;k<=30;k++){const t=a0+(a1-a0)*k/30;pts.push([O[0]+r*Math.cos(t),O[1]+r*Math.sin(t)]);}
 const e=pts[pts.length-1],q=pts[pts.length-3];
 return draw(pts,1,{color,w:7})+arrow(q[0],q[1],e[0]+(e[0]-q[0])*.6,e[1]+(e[1]-q[1])*.6,{color,w:7,head:24});
}
function pairDrops({g1=1,g2=1,ray=1,white=1,colors=0,spin=0,spinG=1,titles=1,hlEntry=0}={}){
 let s=fade(g1,dropBody(PO1,PR))+fade(g2,dropBody(PO2,PR));
 s+=fade(titles*g1,label('一度 跳ね返る',PO1[0],150,{size:40,anchor:'middle',weight:700}))+fade(titles*g2,label('二度 跳ね返る',PO2[0],150,{size:40,anchor:'middle',weight:700}));
 s+=fade(white*g1,rayPath(P1W,ray,{w:5}))+fade(white*g2,rayPath(P2W,ray,{w:5}));
 if(colors>0){
  const inc=(tr)=>line(tr.pts[0][0],tr.pts[0][1],tr.pts[1][0],tr.pts[1][1],{color:LIGHT,w:5});
  s+=fade(colors*g1,inc(P1R)+rayPath(P1R,1,{color:RED,w:4,arrows:false,from:2})+rayPath(P1V,1,{color:VIO,w:4,arrows:false,from:2}));
  s+=fade(colors*g2,inc(P2R)+rayPath(P2R,1,{color:RED,w:4,arrows:false,from:2})+rayPath(P2V,1,{color:VIO,w:4,arrows:false,from:2}));
 }
 s+=fade(g1*spinG,spinArrow(PO1,P1W,spin))+fade(g2*spinG,spinArrow(PO2,P2W,spin));
 if(hlEntry>0)s+=fade(hlEntry,ring(P1W.pts[1][0],P1W.pts[1][1],22,{color:HC,w:5})+ring(P2W.pts[1][0],P2W.pts[1][1],22,{color:HC,w:5}));
 return s;
}

// ================= 角の物差し（9） =================
const RX=a=>80+(a-39)*48,RY=790;
function ruler(g,{p1=1,p2=0,outer=0,hl=0}={}){
 if(g<=0)return '';
 let s=line(RX(39),RY,RX(55.5),RY,{color:C.dim,w:4})+arrow(RX(55),RY,RX(56.3),RY,{color:C.dim,w:4,head:18});
 for(let a=40;a<=55;a+=5)s+=line(RX(a),RY-10,RX(a),RY+10,{color:C.dim,w:3});
 s+=label('太陽と反対の点からの角',RX(55.5),RY-112,{size:36,color:C.dim,anchor:'end'});
 const mk=(a,col,txt,up,gg)=>fade(gg,dot(RX(a),RY,13,col)+label(txt,RX(a),up?RY-28:RY+58,{size:38,color:col,anchor:'middle',weight:700}));
 s+=mk(ANG.v1,VIO,'紫 40°',false,p1)+mk(ANG.r1,RED,'赤 42°',true,p1);
 s+=mk(ANG.r2,RED,'赤 50°',true,p2)+mk(ANG.v2,VIO,'紫 53°',false,p2);
 s+=fade(p1,label('一本目',(RX(ANG.v1)+RX(ANG.r1))/2,RY+112,{size:36,color:C.ink,anchor:'middle'}));
 s+=fade(p2,label('二本目',(RX(ANG.v2)+RX(ANG.r2))/2,RY+112,{size:36,color:C.ink,anchor:'middle'}));
 s+=fade(outer,label('外側 →',RX(55.5),RY-28,{size:38,color:HC,anchor:'end',weight:700}));
 if(hl>0)s+=fade(hl,ring(RX(ANG.v2),RY,26,{color:HC,w:5})+ring(RX(ANG.r1),RY,26,{color:HC,w:5}));
 return fade(g,s);
}

// ================= 向きの扇（10・11）：出ていく向きを1か所に集める =================
// 雨粒の上のどこに当たるか（b）を変えて、出る向きの角を全部計算する
function fanAngles(n,k,M=40){const out=[];for(let j=1;j<M;j++){const b=j/M;out.push(trace([0,0],1,k===1?-b:b,n,k).ang);}return out;}
const FAN1=fanAngles(N_WHITE,1),FAN2=fanAngles(N_WHITE,2).filter(a=>a<=110);
function fan(kind,g,{lit=0,limit=0}={}){
 // 出る向きの扇：原点 FO から、左向きを 0° とし、下へ角をとる
 const FO=[760,230],L=540,angs=kind===1?FAN1:FAN2,lim=kind===1?ANG.w1:ANG.w2;
 let s='';
 if(lit>0){const a0=kind===1?0:lim,a1=kind===1?lim:110,pts=[FO];for(let k=0;k<=30;k++){const a=(a0+(a1-a0)*k/30)*DEG;pts.push([FO[0]-L*Math.cos(a),FO[1]+L*Math.sin(a)]);}
  s+=fade(lit,poly(pts,{fill:LIGHT,fo:.14,stroke:'none'}));}
 const nn=Math.ceil(angs.length*g);
 for(let j=0;j<nn;j++){const a=angs[j]*DEG;s+=line(FO[0],FO[1],FO[0]-L*.92*Math.cos(a),FO[1]+L*.92*Math.sin(a),{color:LIGHT,w:3,opacity:.75});}
 s+=line(FO[0],FO[1],FO[0]-L,FO[1],{color:C.dim,w:3,dash:'12 9'});
 if(limit>0){const a=lim*DEG;s+=fade(limit,line(FO[0],FO[1],FO[0]-L*1.05*Math.cos(a),FO[1]+L*1.05*Math.sin(a),{color:HC,w:6})+arcAt(FO,Math.PI,Math.PI-a,150)
  +plate(`${Math.round(kind===1?42:51)}°`,FO[0]-185*Math.cos(a/2),FO[1]+185*Math.sin(a/2)+16,{size:44,color:HC,anchor:'middle'}));}
 s+=dot(FO[0],FO[1],9,LIGHT);
 return s;
}

// ================= プリズム（16） =================
function prism(g){
 if(g<=0)return '';
 const A=[430,240],B=[260,560],Cc=[600,560];
 let s=poly([A,B,Cc],{fill:'#c9d6ea',fo:.18,stroke:'#c9d6ea',sw:4});
 const P=[330,430],Q=[520,450];
 s+=line(40,500,P[0],P[1],{color:LIGHT,w:8})+line(P[0],P[1],Q[0],Q[1],{color:LIGHT,w:6,opacity:.8});
 for(let j=0;j<12;j++){const u=j/11,a=(10+u*26)*DEG;s+=line(Q[0],Q[1],Q[0]+380*Math.cos(a),Q[1]+380*Math.sin(a),{color:spec(u),w:6});}
 s+=label('白い光',40,470,{size:38,color:LIGHT,weight:700})+label('赤',912,512,{size:38,color:RED,weight:700})+label('紫',845,720,{size:38,color:VIO,weight:700});
 s+=note('色の広がりは 大きく誇張',40,880);
 return fade(g,s);
}
// 青空（18・19）
function blueSky(g=1){
 const id='d05bs';
 let s=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f5fbf"/><stop offset="1" stop-color="#7fb6f0"/></linearGradient><radialGradient id="d05sun"><stop offset="0" stop-color="#fffbe0" stop-opacity="1"/><stop offset=".35" stop-color="#fff1b8" stop-opacity=".6"/><stop offset="1" stop-color="#fff1b8" stop-opacity="0"/></radialGradient></defs>`;
 s+=rect(0,0,W,HOR,{fill:`url(#${id})`,fo:1,stroke:'none',rx:0})+`<circle cx="160" cy="150" r="150" fill="url(#d05sun)"/>`+dot(160,150,46,'#fffbe0');
 s+=rect(0,HOR,W,H-HOR,{fill:'#24402e',fo:1,stroke:'none',rx:0});
 return fade(g,s);
}

// ================= 太陽の側（14） =================
function sunSide({ring3=0,glare=1,photo=0}={}){
 const S=[500,470],k=7.5;
 let s=`<defs><radialGradient id="d05gl"><stop offset="0" stop-color="#fffbe0" stop-opacity="1"/><stop offset=".25" stop-color="#fff1b8" stop-opacity=".55"/><stop offset="1" stop-color="#fff1b8" stop-opacity="0"/></radialGradient></defs>`;
 s+=rect(0,0,W,HOR,{fill:'#1b2a48',fo:1,stroke:'none',rx:0});
 // 3回反射の虹：太陽から 赤 42.5°・紫 38.1°（外が赤）。実際はとてもうすい
 if(ring3>0){const N=12;for(let j=0;j<N;j++){const u=(j+.5)/N,r=mix(42.47,38.11,u)*k;s+=fade(ring3,ring(S[0],S[1],r,{color:spec(u),w:4.2}));}}
 s+=fade(glare,`<circle cx="${S[0]}" cy="${S[1]}" r="${300}" fill="url(#d05gl)"/>`)+dot(S[0],S[1],50,'#fffbe0');
 s+=rect(0,HOR,W,H-HOR,{fill:'#142019',fo:1,stroke:'none',rx:0})+line(0,HOR,W,HOR,{color:'#3c5a48',w:3});
 s+=label('太陽',S[0],S[1]+100,{size:40,color:'#3a3220',anchor:'middle',weight:700});
 return s;
}


// ================= 51° の折り返し（6）：当たる高さ b を動かし、出る角の針が 51° で折り返す =================
const FDO=[250,330],FDR=170,DO=[880,240],DL=470;
const B0=.6,B1=.999,bAt=u=>mix(B0,B1,u),U_FOLD=(.95-B0)/(B1-B0);
const foldTr=u=>trace(FDO,FDR,bAt(u)*FDR,N_WHITE,2,{lin:320,lout:240});
const dialPt=(a,L=DL)=>[DO[0]-L*Math.cos(a*DEG),DO[1]+L*Math.sin(a*DEG)];
function foldScene(u,{fold=0,big=0,gather=0,needle=1}={}){
 const tr=foldTr(u);
 let s=dropBody(FDO,FDR)+label('雨粒',60,590,{size:38,color:SURF,weight:700});
 s+=rayPath(tr,1,{w:5});
 s+=plate('当たる 高さを 変える',40,70,{size:40,color:LIGHT,anchor:'start'});
 // 出る向きの針（1か所に集めて描く）
 s+=line(DO[0],DO[1],DO[0]-400,DO[1],{color:C.dim,w:3,dash:'12 9'})+label('太陽と反対の向き',DO[0]-10,DO[1]-24,{size:36,color:C.dim,anchor:'end'});
 const N=48;for(let j=0;j<=N;j++){const v=j/N;if(v>u)break;const a=foldTr(v).ang,P=dialPt(a,DL*.95);s+=line(DO[0],DO[1],P[0],P[1],{color:LIGHT,w:2.5,opacity:.4});}
 const a=tr.ang,P=dialPt(a);
 s+=fade(needle,line(DO[0],DO[1],P[0],P[1],{color:LIGHT,w:7})+plate(`出る角 ${Math.round(a)}°`,960,140,{size:44,color:LIGHT,anchor:'end'}))+dot(DO[0],DO[1],10,LIGHT);
 if(fold>0){const Q=dialPt(ANG.w2,DL*1.04);s+=fade(fold,line(DO[0],DO[1],Q[0],Q[1],{color:HC,w:5}))+fade(fold*(1-gather),plate('ここで 折り返す',Q[0]-10,Q[1]+60,{size:40,color:HC,anchor:'middle'}));}
 if(gather>0)s+=fade(gather,plate('ここに 集まる',dialPt(ANG.w2,DL*1.04)[0]-10,dialPt(ANG.w2,DL*1.04)[1]+60,{size:40,color:HC,anchor:'middle'}));
 if(big>0)s+=fade(big,arcAt(DO,Math.PI,Math.PI-ANG.w2*DEG,150)+plate('約51°',DO[0]-210,DO[1]+100,{size:48,color:HC,anchor:'middle'}));
 return s;
}
// ================= 色ごとの出る向き（8〜10）：1回反射と2回反射を左右に並べる =================
const CO1=[330,250],CO2=[800,250],CRR=120;
const C1R=bowRay(CO1,CRR,N_RED,1,{lin:330,lout:380}),C1V=bowRay(CO1,CRR,N_VIO,1,{lin:330,lout:380}),C1W=bowRay(CO1,CRR,N_WHITE,1,{lin:330,lout:380});
const C2R=bowRay(CO2,CRR,N_RED,2,{lin:170,lout:380}),C2V=bowRay(CO2,CRR,N_VIO,2,{lin:170,lout:380}),C2W=bowRay(CO2,CRR,N_WHITE,2,{lin:170,lout:380});
// 紫が赤からどちらへずれたか：赤の線の先から紫の側へ向く矢印
function shiftArrow(tr,tv,g,text,{tx,ty}={}){
 if(g<=0)return '';
 const n=tr.pts.length,Er=tr.pts[n-1],Ev=tv.pts[n-1],Ar=[mix(tr.E[0],Er[0],.82),mix(tr.E[1],Er[1],.82)];
 const e=tr.exit;let q=[-e[1],e[0]];const dv=[Ev[0]-Er[0],Ev[1]-Er[1]];if(q[0]*dv[0]+q[1]*dv[1]<0)q=[-q[0],-q[1]];
 return fade(g,arrow(Ar[0]-q[0]*14,Ar[1]-q[1]*14,Ar[0]+q[0]*62,Ar[1]+q[1]*62,{color:HC,w:6,head:20})+plate(text,tx??Ar[0]+q[0]*70,ty??Ar[1]+q[1]*70+50,{size:40,color:HC,anchor:'middle'}));
}
function colorDrop(O,W,Rr,Vv,{g=1,white=1,colors=0,spin=0,title,ref=1}={}){
 if(g<=0)return '';
 let s=dropBody(O,CRR)+label(title,O[0],80,{size:40,anchor:'middle',weight:700});
 s+=fade(white,rayPath(W,1,{w:5}));
 if(colors>0){s+=fade(colors,line(Rr.pts[0][0],Rr.pts[0][1],Rr.pts[1][0],Rr.pts[1][1],{color:LIGHT,w:5})+rayPath(Rr,seg(colors,0,1),{color:RED,w:4,arrows:false,from:2})+rayPath(Vv,seg(colors,0,1),{color:VIO,w:4,arrows:false,from:2}));
  const n=Rr.pts.length,er=Rr.pts[n-1],ev=Vv.pts[n-1];
  s+=fade(seg(colors,.8,1),label('赤',er[0]+(er[0]<ev[0]?-30:12),er[1]+(er[1]<ev[1]?-8:34),{size:36,color:RED,weight:700})+label('紫',ev[0]+(ev[0]<er[0]?-34:10),ev[1]+(ev[1]<er[1]?-8:36),{size:36,color:VIO,weight:700}));}
 s+=fade(ref,line(W.E[0],W.E[1],W.E[0]-180,W.E[1],{color:C.dim,w:3,dash:'10 8'}));
 s+=spinArrow(O,W,spin,{r:48});
 return fade(g,s);
}

// ================= cue ごとの図 =================
export const deep05Diagrams={
 // 1 二本の虹
 [K+'sky:two']:(p,ctx)=>sky({g1:vseg(ctx,p,0,.35),g2:vseg(ctx,p,.5,.85)})
   +fade(vseg(ctx,p,.5,.85),plate('もう一本',500,170,{size:40,color:C.ink,anchor:'middle'})),
 // 2 内側の虹は外が赤、外側の虹は外が紫
 [K+'sky:order']:(p,ctx)=>{
  const a=swin(ctx,p,0,.2,.45),b=swin(ctx,p,0,.6,.85),c=swin(ctx,p,1,.2,.6);
  let s=sky();
  const P1=onCircle(ANG.r1,32),P2=onCircle(ANG.v2,-32);
  s+=fade(a,arrow(P1[0]+70,P1[1]-110,P1[0]+8,P1[1]-12,{color:RED,w:6,head:22})+plate('外が 赤',P1[0]+70,P1[1]-124,{size:40,color:RED,anchor:'middle'}));
  s+=fade(b,arrow(P2[0]-60,P2[1]-100,P2[0]-6,P2[1]-12,{color:VIO,w:6,head:22})+plate('外が 紫',P2[0]-60,P2[1]-114,{size:40,color:VIO,anchor:'middle'}));
  s+=fade(a,label('内側の虹',500,560,{size:40,color:C.ink,anchor:'middle',weight:700}))+fade(b,label('外側の虹',500,195,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('並びが 逆',500,700,{g:c,color:HC,anchor:'middle',size:42});
  return s;},
 // 3 二本の間の空は少し暗い
 [K+'sky:dark']:(p,ctx)=>{const d=vseg(ctx,p,.45,.8);
  return sky({band:.6*d})+fade(vseg(ctx,p,.55,.85),plate('少し 暗い',500,318,{size:40,color:C.ink,anchor:'middle'}));},
 // 4 前回：一度跳ね返る光の道
 [K+'drop:one']:(p,ctx)=>{const g=vseg(ctx,p,.3,.9);
  return bigDrop()+sunArrow(40,TR1.pts[0][1]-24,vseg(ctx,p,0,.3))+rayPath(TR1,g)+ringsAt(TR1,seg(g,.5,.65),{n:1})
   +fade(seg(g,.55,.8),plate('一度 跳ね返る',960,200,{size:40,color:HC,anchor:'end'}))+tag('前回',960,60,{anchor:'end',color:C.dim});},
 // 5 二度跳ね返る光の道
 [K+'drop:two']:(p,ctx)=>{const g=vseg(ctx,p,.25,.95),o=1-vseg(ctx,p,0,.2);
  return bigDrop()+fade(o,rayPath(TR1,1)+sunArrow(40,TR1.pts[0][1]-24))+sunArrow(40,TR2.pts[0][1]-24,vseg(ctx,p,.1,.3))+rayPath(TR2,g)
   +ringsAt(TR2,seg(g,.35,.5),{n:1})+ringsAt(TR2,seg(g,.55,.7),{n:2})
   +fade(seg(g,.6,.85),plate('二度 跳ね返る',960,90,{size:40,color:HC,anchor:'end'}));},
 // 6a 二度跳ね返った光も、当たる高さを変えると出る角が 51° で折り返し、そこに集まる
 [K+'drop:fold']:(p,ctx)=>{const u=vseg(ctx,p,.05,.8);
  return foldScene(u,{fold:seg(u,U_FOLD-.02,U_FOLD+.06),gather:vseg(ctx,p,.82,.97),needle:1-vseg(ctx,p,.86,.98)});},
 // 6b その角度は約51° → 一回り大きな円
 [K+'drop:angle']:(p,ctx)=>{const x=swin(ctx,p,1,0,.25);
  let s=fade(1-x,foldScene(1,{fold:1,gather:1,needle:0,big:swin(ctx,p,0,.4,.85)}));
  s+=fade(x,sky({center:1,id:'b'})+radius(ANG.w1,-38,1,{color:C.dim,text:'42°',size:38,w:4})+radius(51,30,swin(ctx,p,1,.25,.7),{text:'51°',size:44}));
  s+=fade(swin(ctx,p,1,.6,.95),plate('一回り 大きな 円',500,150,{size:42,color:HC,anchor:'middle'}));
  return s;},
 // 7 跳ね返るたびに外へ逃げる → うすい
 [K+'leak:drop']:(p,ctx)=>{const g=swin(ctx,p,0,0,.6),lk=swin(ctx,p,0,.35,.9),w2=swin(ctx,p,1,.2,.7);
  let s=bigDrop()+sunArrow(40,TR3.pts[0][1]-24)+rayPath(TR3,Math.max(g,.0001)*1,{widths:[10,10,6.5,4,3.2],opac:[1,1,.8,.55,.45]});
  TR3.leaks.forEach(([Q,d],j)=>{const a=seg(lk,j*.35,j*.35+.5);s+=fade(a,arrow(Q[0],Q[1],Q[0]+140*d[0],Q[1]+140*d[1],{color:LIGHT,w:6,head:22,opacity:.85}));});
  s+=fade(seg(lk,.2,.6),plate('一部が 外へ',700,70,{size:40,color:LIGHT,anchor:'start'}));
  s+=fade(w2,plate('だんだん 弱くなる',40,860,{size:40,color:HC,anchor:'start'}));
  s+=fade(w2,note('線の太さは 目安',40,790));
  return s;},
 // 8 1回反射：よく曲がる紫は内側（40°）、赤は 42°
 [K+'turn:one']:(p,ctx)=>{const c=vseg(ctx,p,.15,.5);
  let s=colorDrop(CO1,C1W,C1R,C1V,{white:1-c,colors:c,title:'一度 跳ね返る'})+sunArrow(40,130,vseg(ctx,p,0,.15));
  s+=shiftArrow(C1R,C1V,vseg(ctx,p,.6,.85),'紫は 内側へ',{tx:250,ty:560});
  s+=ruler(vseg(ctx,p,.55,.75),{p1:vseg(ctx,p,.6,.85)});
  return s;},
 // 9 2回反射は反対回り → 大きく曲がるほど外側
 [K+'turn:pair']:(p,ctx)=>{const g2=swin(ctx,p,0,0,.3),sp=swin(ctx,p,0,.4,.9),c2=swin(ctx,p,1,.2,.6);
  let s=colorDrop(CO1,C1W,C1R,C1V,{white:0,colors:1,spin:sp,title:'一度 跳ね返る'})+shiftArrow(C1R,C1V,1,'紫は 内側へ',{tx:250,ty:560});
  s+=colorDrop(CO2,C2W,C2R,C2V,{g:g2,white:1-c2,colors:c2,spin:sp,title:'二度 跳ね返る'});
  s+=fade(swin(ctx,p,0,.75,1)*(1-c2),tag('反対回り',560,460,{color:HC,anchor:'middle',size:42}));
  s+=shiftArrow(C2R,C2V,swin(ctx,p,1,.6,.9),'紫は 外側へ',{tx:700,ty:600});
  s+=ruler(1,{p1:1});
  return s;},
 // 10 紫が外側 53°・赤が内側 50° → 並びが逆
 [K+'turn:color']:(p,ctx)=>{const p2=swin(ctx,p,0,.3,.7),o=swin(ctx,p,0,.75,1),r=swin(ctx,p,1,.2,.6);
  let s=colorDrop(CO1,C1W,C1R,C1V,{white:0,colors:1,spin:1,title:'一度 跳ね返る'})+shiftArrow(C1R,C1V,1,'紫は 内側へ',{tx:250,ty:560});
  s+=colorDrop(CO2,C2W,C2R,C2V,{white:0,colors:1,spin:1,title:'二度 跳ね返る'})+shiftArrow(C2R,C2V,1,'紫は 外側へ',{tx:700,ty:600});
  s+=ruler(1,{p1:1,p2,outer:o,hl:o});
  s+=tag('並びが 逆',720,520,{g:r,color:HC,anchor:'middle',size:42});
  return s;},
 // 10 一度跳ね返った光は 42° より内側だけ → 内側の空が明るい
 [K+'fan:one']:(p,ctx)=>{const x=swin(ctx,p,1,0,.25);
  let s=fade(1-x,fan(1,swin(ctx,p,0,0,.55),{lit:swin(ctx,p,0,.6,.9),limit:swin(ctx,p,0,.45,.75)})
   +plate('出ていく 向き',40,70,{size:40,color:LIGHT,anchor:'start'})+label('一度 跳ね返った光',40,130,{size:38,color:C.ink})
   +fade(swin(ctx,p,0,.65,.95),plate('この 内側だけ',120,620,{size:42,color:HC,anchor:'start'})));
  s+=fade(x,sky({in1:swin(ctx,p,1,.35,.85),g2:0,id:'c',center:1})+radius(42,-30,1,{text:'42°',size:40})
   +fade(swin(ctx,p,1,.55,.95),plate('明るい',500,620,{size:42,color:HC,anchor:'middle'})));
  return s;},
 // 11 二度跳ね返った光は 51° より外側だけ
 [K+'fan:two']:(p,ctx)=>{const x=vseg(ctx,p,.62,.8);
  let s=fade(1-x,fan(2,vseg(ctx,p,0,.4),{lit:vseg(ctx,p,.5,.65),limit:vseg(ctx,p,.3,.55)})
   +plate('出ていく 向き',40,70,{size:40,color:LIGHT,anchor:'start'})+label('二度 跳ね返った光',40,130,{size:38,color:C.ink})
   +fade(vseg(ctx,p,.45,.62),plate('この 外側だけ',80,820,{size:42,color:HC,anchor:'start'})));
  s+=fade(x,sky({in1:1,out2:vseg(ctx,p,.7,1),id:'d',center:1})+radius(51,30,1,{text:'51°',size:40}));
  return s;},
 // 12 42° と 51° の間は暗い帯
 [K+'band:dark']:(p,ctx)=>{const d=swin(ctx,p,0,.3,.9);
  let s=sky({in1:1,out2:1,band:swin(ctx,p,1,.1,.6),center:1,id:'e'})+radius(42,-30,1,{text:'42°',size:40})+radius(51,30,1,{text:'51°',size:40});
  s+=fade(d,`<path d="${circD(R2i)} ${circD(R1o)}" fill-rule="evenodd" fill="none" stroke="${HC}" stroke-width="3" stroke-dasharray="10 8"/>`);
  s+=fade(swin(ctx,p,1,.4,.9),plate('暗い 帯',500,318,{size:42,color:HC,anchor:'middle'}));
  return s;},
 // 13 アレキサンダーの暗帯
 [K+'band:name']:(p,ctx)=>{
  let s=sky({in1:1,out2:1,band:1,center:1,id:'f'})+plate('暗い 帯',500,318,{size:42,color:HC,anchor:'middle'});
  s+=fade(vseg(ctx,p,.05,.35),plate('2世紀ごろ',60,120,{size:40,color:C.ink,anchor:'start'}));
  s+=tag('アレキサンダーの 暗帯',500,560,{g:vseg(ctx,p,.5,.75),color:HC,anchor:'middle',size:44});
  return s;},
 // 14a 三度跳ね返った光の虹は太陽の側
 [K+'third:sun']:(p,ctx)=>sunSide({ring3:vseg(ctx,p,.5,.9)})+fade(vseg(ctx,p,.0,.3),plate('太陽の側を 向く',40,70,{size:40,color:C.ink,anchor:'start'}))
   +fade(vseg(ctx,p,.55,.9),plate('三度 跳ね返った 光の虹',500,880,{size:40,color:HC,anchor:'middle'}))+fade(vseg(ctx,p,.6,.9),note('とても うすい 虹を 濃く 描いた',960,70,{anchor:'end'})),
 // 14b まぶしさに隠れる → 2011年に写真
 [K+'third:photo']:(p,ctx)=>{const ph=vseg(ctx,p,.5,.85);
  let s=sunSide({ring3:1})+plate('三度 跳ね返った 光の虹',500,880,{size:40,color:HC,anchor:'middle'})+note('とても うすい 虹を 濃く 描いた',960,70,{anchor:'end'});
  s+=fade(vseg(ctx,p,.05,.3),plate('まぶしい',500,350,{size:42,color:C.ink,anchor:'middle'}));
  s+=fade(ph,rect(60,170,880,640,{fill:'none',fo:0,stroke:C.ink,sw:6,rx:18})+tag('写真',80,240,{color:C.ink}));
  s+=fade(vseg(ctx,p,.75,.95),plate('2011年',100,770,{size:48,color:HC,anchor:'start'}));
  return s;},
 // 15 振り返り：ストロー（01）
 [K+'recap:straw']:(p,ctx)=>fade(swin(ctx,p,0,0,.5),strawScene({look:true}))+fade(swin(ctx,p,0,0,.6),tag('振り返り',960,60,{anchor:'end',color:C.dim})),
 // 16 遅くなるから曲がる（光の列）→ 色で少し違うから虹色（プリズム）
 [K+'recap:slow']:(p,ctx)=>{const x=swin(ctx,p,1,0,.2),t=cueT(p,ctx);
  let s=fade(1-x,rect(0,430,W,H-430,{fill:WATER,fo:.2,stroke:'none',rx:0})+line(0,430,W,430,{color:SURF,w:4})+waveFronts(t+5,{arrows:1,showLabel:0})
   +plate('遅くなるから 曲がる',40,70,{size:42,color:HC,anchor:'start'}));
  s+=prism(x)+fade(x,plate('色で 少し 違う',40,70,{size:42,color:HC,anchor:'start'}));
  return s;},
 // 17 一度 42°・二度 51° → 空の二本の虹
 [K+'recap:bows']:(p,ctx)=>{const x=swin(ctx,p,1,0,.25);
  let s=fade(1-x,pairDrops({spin:0,titles:1})+fade(swin(ctx,p,0,.15,.4),plate('42°',PO1[0],610,{size:48,color:HC,anchor:'middle'}))+fade(swin(ctx,p,0,.6,.85),plate('51°',PO2[0],610,{size:48,color:HC,anchor:'middle'})));
  s+=fade(x,sky({id:'g'})+fade(swin(ctx,p,1,.3,.7),plate('一つの 曲がり方の 規則',500,620,{size:42,color:HC,anchor:'middle'})));
  return s;},
 // 18 青空
 [K+'next:sky']:(p,ctx)=>{const x=vseg(ctx,p,0,.35);
  return fade(1-x,sky({id:'h'}))+blueSky(x)+fade(vseg(ctx,p,.6,.9),plate('まだ 説明していない 色',500,520,{size:42,color:C.ink,anchor:'middle'}));},
 // 20 青空と夕焼けは同じ理由
 [K+'next:dusk']:(p,ctx)=>{const d=vseg(ctx,p,.25,.5);
  let s=blueSky(1)+fade(d,`<defs><linearGradient id="d05dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a5a"/><stop offset=".55" stop-color="#d0603a"/><stop offset="1" stop-color="#ffb05a"/></linearGradient></defs>`+rect(510,0,490,HOR,{fill:'url(#d05dk)',fo:1,stroke:'none',rx:0})+dot(760,HOR-10,60,'#ffd48a')+rect(510,HOR,490,H-HOR,{fill:'#2a2418',fo:1,stroke:'none',rx:0})+rect(490,0,20,H,{fill:C.bg,fo:1,stroke:'none',rx:0}));
  s+=fade(vseg(ctx,p,.1,.3),plate('晴れた 空の 青',245,70,{size:38,color:C.ink,anchor:'middle'}))+fade(d,plate('夕焼けの 赤',755,70,{size:38,color:C.ink,anchor:'middle'}));
  s+=fade(vseg(ctx,p,.65,.9),plate('同じ 一つの 理由',500,560,{size:46,color:HC,anchor:'middle'}));
  return s;},
 // 21 空は、なぜ青い？
 [K+'next:q']:(p,ctx)=>blueSky(1)+bigQ(500,720,vseg(ctx,p,.1,.4),200)+finalCard(['空は、','なぜ 青い？'],vseg(ctx,p,.55,.85),{y:300,size:60}),
};
