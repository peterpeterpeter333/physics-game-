// 深掘りショート 03（ys-deep-03）「白い光は、なぜ虹色に分かれる？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の形は yt1-sp-deep-common.mjs。値の検算は台本 docs/video-revision-20260924/ytseries/sp-deep-03.mjs の冒頭。
// このファイルで作った部品（共通部品には無いもの）：プリズムの光の道の計算（tracePrism：2つの面で屈折、ベクトルの屈折の式）、
//   色の扇（drawFan）、色の帯のグラデーション（specGrad・specColor）、虹の弧（rainbowArc）、雨粒（drop）。
// 色の広がり（プリズムの角度の差）は見やすくするため大きく誇張する：描く屈折率 赤 1.45〜紫 1.66（本物のガラスは 約1.51〜1.53）。画面に「大きく誇張」と注記。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,WATER,SURF,GLASS,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard,snellR} from './yt1-sp-deep-common.mjs';

const K='deep03-',DEG=Math.PI/180;
const RED='#ff4b3e',VIO='#a274ff';
const SPEC=[[255,75,62],[255,143,58],[255,225,74],[79,210,122],[63,180,255],[63,108,255],[162,116,255]]; // 赤 橙 黄 緑 青 藍 紫
const NAMES=['赤','橙','黄','緑','青','藍','紫'];
const hex=c=>'#'+c.map(v=>Math.round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('');
export function specColor(u){u=clamp(u)*6;const i=Math.min(5,Math.floor(u)),f=u-i;return hex(SPEC[i].map((v,k)=>mix(v,SPEC[i+1][k],f)));}
const SC=SPEC.map(hex);
// vertical：下が赤、上が紫（頂点が下のプリズムで、紫が一番上に届くのと同じ向き）
function specGrad(id,vertical=false){
 let s=`<defs><linearGradient id="${id}" x1="0" y1="${vertical?1:0}" x2="${vertical?0:1}" y2="0">`;
 for(let k=0;k<=24;k++)s+=`<stop offset="${(k/24).toFixed(3)}" stop-color="${specColor(k/24)}"/>`;
 return s+'</linearGradient></defs>';
}
const tv=(ctx,p)=>cueT(p,ctx)/voiceEnd(ctx);

// ================= プリズムの光の道 =================
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],mul=(a,k)=>[a[0]*k,a[1]*k],dp=(a,b)=>a[0]*b[0]+a[1]*b[1],cr=(a,b)=>a[0]*b[1]-a[1]*b[0];
const unit=a=>{const l=Math.hypot(a[0],a[1]);return [a[0]/l,a[1]/l];};
const rotv=(a,t)=>[a[0]*Math.cos(t)-a[1]*Math.sin(t),a[0]*Math.sin(t)+a[1]*Math.cos(t)];
// 正三角形のプリズム（頂点が上、rot で回す。画面の座標なので正の角は時計回り）
export function prismV({c,s,rot=0}){const R=s/Math.sqrt(3);return [-90,150,30].map(a=>{const t=a*DEG+rot;return [c[0]+R*Math.cos(t),c[1]+R*Math.sin(t)];});}
function hitPoly(P,d,V,skip=-1){
 let best=null;
 for(let i=0;i<V.length;i++){if(i===skip)continue;const A=V[i],B=V[(i+1)%V.length],e=sub(B,A),den=cr(d,e);if(Math.abs(den)<1e-9)continue;
  const ap=sub(A,P),t=cr(ap,e)/den,u=cr(ap,d)/den;if(t>1e-6&&u>=-1e-9&&u<=1+1e-9&&(!best||t<best.t))best={t,i,Q:add(P,mul(d,t))};}
 return best;
}
function outN(V,i){const A=V[i],B=V[(i+1)%V.length],e=sub(B,A);let nn=unit([e[1],-e[0]]);const cx=V.reduce((s,v)=>s+v[0],0)/V.length,cy=V.reduce((s,v)=>s+v[1],0)/V.length;if(dp(nn,sub(A,[cx,cy]))<0)nn=mul(nn,-1);return nn;}
// ベクトルの屈折の式：n1 sin(入る角) ＝ n2 sin(出る角)
function refract(d,nOut,n1,n2){const nf=dp(d,nOut)<0?nOut:mul(nOut,-1),ci=-dp(nf,d),eta=n1/n2,k=1-eta*eta*(1-ci*ci);if(k<0)return null;return unit(add(mul(d,eta),mul(nf,eta*ci-Math.sqrt(k))));}
export function tracePrism(P,d,pr,n){
 const V=prismV(pr),h1=hitPoly(P,d,V);if(!h1)return null;
 const d1=refract(d,outN(V,h1.i),1,n);if(!d1)return null;
 const h2=hitPoly(h1.Q,d1,V,h1.i);if(!h2)return null;
 const d2=refract(d1,outN(V,h2.i),n,1);if(!d2)return null;
 return {Q1:h1.Q,Q2:h2.Q,d1,d2};
}
// 光を、プリズムの入る面の真ん中に当てる向き ang（下向きが正）。始まりは x＝0
function srcFor(pr,ang){const V=prismV(pr),Mi=[(V[0][0]+V[1][0])/2,(V[0][1]+V[1][1])/2],D=[Math.cos(ang),Math.sin(ang)];return [sub(Mi,mul(D,Mi[0]/D[0])),D];}
const ANG_IN=20*DEG; // 日光は少し下向きに入り、頂点が下のプリズムで上へ曲がる
const NR=1.45,NV=1.66; // 描くための屈折率（赤・紫）。大きく誇張
const nOf=u=>mix(NR,NV,u);
// 色の光線を N 本（u＝0 赤 … 1 紫）。end：{x}（縦の線まで）または {len}
export function fanRays(P,d,pr,{N=29,x,len=400}={}){
 const out=[];for(let k=0;k<N;k++){const u=k/(N-1),r=tracePrism(P,d,pr,nOf(u));if(!r)continue;
  const L=x!=null?(x-r.Q2[0])/r.d2[0]:len;out.push({u,...r,E:add(r.Q2,mul(r.d2,L))});}
 return out;
}
// 扇を描く。g＝プリズムから先へ伸びる進み。inside＝ガラスの中の色の線
function drawFan(rays,{g=1,inside=1,fo=.9}={}){
 if(g<=0&&inside<=0)return '';
 let s='';
 if(inside>0)s+=fade(inside,poly([rays[0].Q1,rays[0].Q2,rays[rays.length-1].Q2],{fill:'#e8eef8',fo:.55,stroke:'none'}));
 if(g>0)for(let k=0;k+1<rays.length;k++){const a=rays[k],b=rays[k+1],Ea=add(a.Q2,mul(sub(a.E,a.Q2),g)),Eb=add(b.Q2,mul(sub(b.E,b.Q2),g));
  s+=poly([a.Q2,Ea,Eb,b.Q2],{fill:specColor((a.u+b.u)/2),fo,stroke:specColor((a.u+b.u)/2),sw:1});}
 return s;
}
const prismShape=(pr,{g=1,fo=.12}={})=>fade(g,poly(prismV(pr),{fill:GLASS,fo,stroke:GLASS,sw:4}));
const beam=(P,Q,g=1,w=9)=>g>0?draw([P,add(P,mul(sub(Q,P),g))],1,{color:'#ffffff',w}):'';

// ================= 大きなプリズムの図（1・2・12・16） =================
const MP={c:[380,480],s:340,rot:Math.PI},[M_S,M_D]=srcFor(MP,ANG_IN),MY=M_S[1],M_X=900;
const MR=fanRays(M_S,M_D,MP,{x:M_X});
const M_Q1=MR[0].Q1;
function mainScene({b=1,fan=1,labels=1,dim=0,names=1,screen=1}={}){
 let s='';
 s+=fade(screen,line(M_X,150,M_X,600,{color:'#5c6f90',w:6}));
 s+=beam(M_S,M_Q1,b,10)+prismShape(MP)+drawFan(MR,{g:fan,inside:seg(fan,0,.1)});
 s+=fade(labels,label('白い光',40,MY-34,{size:40,color:LIGHT,weight:700})+label('プリズム',MP.c[0]-120,MP.c[1]+130,{size:40,color:GLASS,anchor:'end',weight:700}));
 const E0=MR[0].E,E1=MR[MR.length-1].E;
 s+=fade(names*seg(fan,.85,1),label('赤',M_X+16,E0[1]+16,{size:44,color:RED,weight:700})+label('紫',M_X+16,E1[1]+16,{size:44,color:VIO,weight:700}));
 if(dim>0)s=fade(1-.7*dim,s);
 return s;
}

// ================= 暗い部屋（4・5・6） =================
const RMP={c:[400,430],s:220,rot:Math.PI},[RMS,RMD]=srcFor(RMP,ANG_IN),R_WIN=130,R_TOP=110,R_BOT=560,R_WALL=M_X,RH=RMS[1]+R_WIN*RMD[1]/RMD[0];
const RMR=fanRays(RMS,RMD,RMP,{x:R_WALL});
const RMH=fanRays(RMS,RMD,RMP,{x:R_WALL,N:3})[1]; // 予想：全部の色が同じだけ曲がる（真ん中の屈折率ひとつ）
function roomScene({dark=1,win=1,b=1,pr=1,fan=0,panel=0,pred=0,band=0,hyp=0,angles=0,dim=0,year=1}={}){
 let s='';
 // 部屋（明るい → 暗い）
 s+=fade(1-dark,rect(R_WIN,R_TOP,R_WALL-R_WIN,R_BOT-R_TOP,{fill:'#4a5a7a',fo:.55,stroke:'none',rx:0}));
 s+=line(R_WIN,R_TOP,R_WALL,R_TOP,{color:'#5c6f90',w:4})+line(R_WIN,R_BOT,R_WALL,R_BOT,{color:'#5c6f90',w:4});
 // 窓の壁と穴
 s+=rect(R_WIN-14,R_TOP,28,RH-12-R_TOP,{fill:'#8a7a62',fo:1,stroke:'none',rx:0})+rect(R_WIN-14,RH+12,28,R_BOT-RH-12,{fill:'#8a7a62',fo:1,stroke:'none',rx:0});
 s+=fade(1-win,rect(R_WIN-14,RH-13,28,26,{fill:'#8a7a62',fo:1,stroke:'none',rx:0}));
 s+=fade(win,ring(R_WIN,RH,20,{color:HC,w:4}));
 s+=line(R_WALL,R_TOP,R_WALL,R_BOT,{color:'#8a7a62',w:8});
 s+=fade(win,label('小さな 穴',R_WIN+30,R_TOP+50,{size:36,color:HC,weight:700}));
 s+=label('窓',R_WIN+24,R_BOT-20,{size:36,color:'#c4b496'})+label('壁',R_WALL-18,R_BOT-20,{size:36,color:'#c4b496',anchor:'end'});
 // 日光
 if(b>0){
  s+=draw([RMS,[R_WIN,RH]],seg(b,0,.3),{color:'#ffffff',w:10});
  s+=fade(seg(b,0,.3),label('日光',10,RH-44,{size:38,color:LIGHT,weight:700}));
  s+=draw([[R_WIN,RH],RMR[0].Q1],seg(b,.3,1),{color:'#ffffff',w:10});}
 s+=prismShape(RMP,{g:pr});
 s+=fade(pr,label('プリズム',RMP.c[0]-110,RMP.c[1]+110,{size:38,color:GLASS,anchor:'middle',weight:700}));
 if(hyp>0){s+=fade(hyp,draw([RMH.Q1,RMH.Q2],1,{color:'#ffffff',w:6})+draw([RMH.Q2,add(RMH.Q2,mul(sub(RMH.E,RMH.Q2),seg(hyp,0,.7)))],1,{color:'#ffffff',w:6,dash:'14 10'}));
  s+=fade(seg(hyp,.6,1),ring(R_WALL-8,RMH.E[1],16,{color:'#ffffff',w:4,dash:'6 5'}));}
 s+=drawFan(RMR,{g:fan,inside:seg(fan,0,.1)});
 if(angles>0){const E0=RMR[0].E,E1=RMR[RMR.length-1].E;
  s+=fade(angles,plate('赤は 小さく 曲がる',R_WALL-30,470,{size:38,color:RED,anchor:'end'})+plate('紫は 大きく 曲がる',R_WALL-30,132,{size:38,color:VIO,anchor:'end'}));}
 if(panel>0){
  const y0=590;
  let q=rect(40,y0,860,250,{fill:'#131f38',fo:.95,stroke:C.faint,sw:2,rx:14})+label('壁を 正面から 見ると',60,y0+50,{size:36,color:C.dim});
  q+=fade(pred,ring(230,y0+135,46,{color:LIGHT,w:4,dash:'10 8'})+tag('予想',230,y0+225,{text:'穴と 同じ 丸',anchor:'middle'}));
  const bh=230*seg(band,0,.6);
  q+=specGrad('d03band',true)+fade(seg(band,0,.15),`<rect x="470" y="${(y0+10).toFixed(1)}" width="50" height="${bh.toFixed(1)}" rx="10" fill="url(#d03band)"/>`);
  q+=fade(seg(band,.6,1),tag('結果',545,y0+140,{text:'細長い 帯'}));
  s+=fade(panel,q);
 }
 s+=tag('実験',960,60,{anchor:'end'});
 s+=fade(year,label('1666年ごろ',40,60,{size:40,color:C.ink,weight:700})+label('ニュートン',290,60,{size:40,color:HC,weight:700}));
 if(dim>0)s=fade(1-.7*dim,s);
 return s;
}

// ================= 決定的な実験（7・8・9・10a） =================
const CP1={c:[220,420],s:200,rot:Math.PI},[C_S,C_D]=srcFor(CP1,ANG_IN),C_BX=470;
const CR=fanRays(C_S,C_D,CP1,{x:C_BX});
const RR=CR[0]; // 赤
const DR=Math.atan2(cr(C_D,RR.d2),dp(C_D,RR.d2)); // 赤が曲がった角（下向きが正。ここでは上へ曲がるので負）
const A_IN=Math.atan2(C_D[1],C_D[0]),A_R=Math.atan2(RR.d2[1],RR.d2[0]);
const HOLE=RR.E; // 板の穴
// 2つ目のプリズム：1つ目を、赤の進む向きに合わせて回して置く（入る角が同じ → 同じだけ曲がる）
const C_L=330; // 赤の Q2 から、2つ目の入り口までの道のり（1つ目の Q1 に当たる点）
const Q1b=add(RR.Q2,mul(RR.d2,C_L));
const CP2={c:add(Q1b,rotv(sub(CP1.c,RR.Q1),DR)),s:CP1.s,rot:CP1.rot+DR};
const R2=tracePrism(sub(Q1b,mul(RR.d2,60)),RR.d2,CP2,NR);
const R2E=add(R2.Q2,mul(R2.d2,230));
function crucialScene({fan=1,board=1,red=1,p2=1,out=0,predict=0,result=0,arcs=0,dim=0,labels=1}={}){
 let s='';
 s+=beam(C_S,CR[0].Q1,1,9)+prismShape(CP1)+drawFan(CR,{g:fan,inside:1});
 // 板と穴
 s+=fade(board,rect(C_BX,60,16,HOLE[1]-11-60,{fill:'#8a7a62',fo:1,stroke:'none',rx:0})+rect(C_BX,HOLE[1]+11,16,600-HOLE[1]-11,{fill:'#8a7a62',fo:1,stroke:'none',rx:0}));
 s+=fade(board*labels,label('板の 小さな 穴',C_BX+30,110,{size:36,color:HC,weight:700})+line(C_BX+60,124,HOLE[0]+14,HOLE[1]-14,{color:HC,w:3}));
 // 穴を抜けた赤
 s+=draw([HOLE,Q1b],red,{color:RED,w:8});
 s+=fade(red*labels,label('赤だけ',HOLE[0]+36,HOLE[1]+70,{size:40,color:RED,weight:700}));
 s+=prismShape(CP2,{g:p2});
 s+=fade(p2*labels,label('1つ目',CP1.c[0],CP1.c[1]+175,{size:38,color:GLASS,anchor:'middle',weight:700})+label('2つ目',CP2.c[0]+10,CP2.c[1]+160,{size:38,color:GLASS,anchor:'middle',weight:700}));
 if(p2>0)s+=fade(p2,draw([R2.Q1,R2.Q2],1,{color:RED,w:6}));
 // 予想：別の色に？（点線）
 if(predict>0){[3,4,6].forEach((k,j)=>{const d=rotv(R2.d2,(-.18+.17*j)),E=add(R2.Q2,mul(d,210));
   s+=fade(seg(predict,.1+.15*j,.4+.15*j),draw([R2.Q2,E],1,{color:SC[k],w:6,dash:'14 10'}));});
  s+=fade(seg(predict,.6,.9),label('？',R2E[0]+10,R2E[1]+190,{size:80,color:HC,weight:700}));}
 if(out>0){s+=draw([R2.Q2,R2E],out,{color:RED,w:8});
  s+=fade(seg(out,.8,1),arrow(...add(R2.Q2,mul(R2.d2,150)),...add(R2.Q2,mul(R2.d2,200)),{color:RED,w:6,head:22}));}
 if(arcs>0){
  // 曲がった角：入る向きの延長（点線）と出る向きの間
  const X1=lineX(C_S,C_D,RR.Q2,RR.d2),X2=lineX(Q1b,RR.d2,R2.Q2,R2.d2);
  s+=fade(arcs,draw([X1,add(X1,mul(C_D,170))],1,{color:C.dim,w:3,dash:'10 8'})+arc(X1,A_IN,A_R,130,HC));
  s+=fade(seg(arcs,.4,1),draw([X2,add(X2,mul(RR.d2,170))],1,{color:C.dim,w:3,dash:'10 8'})+arc(X2,A_R,A_R+DR,130,HC));
  s+=fade(seg(arcs,.2,.6),plate('赤の 角度',440,X1[1]+120,{size:36,color:HC,anchor:'end'}));
  s+=fade(seg(arcs,.6,1),plate('同じ 角度',X2[0]+150,X2[1]+30,{size:36,color:HC}));
 }
 s+=tag('実験',960,60,{anchor:'end'});
 if(dim>0)s=fade(1-.75*dim,s);
 return s;
}
function lineX(P,d,Q,e){const den=cr(d,e),t=cr(sub(Q,P),e)/den;return add(P,mul(d,t));}
function arc(O,a0,a1,r,col){const pts=[];for(let k=0;k<=24;k++){const a=a0+(a1-a0)*k/24;pts.push([O[0]+r*Math.cos(a),O[1]+r*Math.sin(a)]);}return draw(pts,1,{color:col,w:5});}

// ================= 白い光の中に全部の色（10b） =================
const XP={c:[280,730],s:200,rot:Math.PI},[X_S,X_D]=srcFor(XP,ANG_IN),XY=X_S[1];
const XR=fanRays(X_S,X_D,XP,{x:740});
function mixScene({zoom=1,inner=1,sep=0}){
 let s='';
 s+=draw([[40,130],[960,130]],1,{color:'#ffffff',w:22})+label('白い光',40,80,{size:40,color:LIGHT,weight:700});
 s+=fade(zoom,rect(420,104,160,52,{fill:'none',fo:0,stroke:HC,sw:4,rx:8})+line(420,156,160,230,{color:HC,w:3,dash:'8 8'})+line(580,156,840,230,{color:HC,w:3,dash:'8 8'}));
 let q=rect(160,220,680,170,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:14});
 SC.forEach((c,k)=>{q+=fade(seg(inner,k/9,k/9+.3),line(190,245+(6-k)*20,810,245+(6-k)*20,{color:c,w:8}));});
 s+=fade(zoom,q)+fade(seg(inner,.6,1),label('中には、はじめから 全部の 色',500,445,{size:40,color:HC,anchor:'middle',weight:700}));
 // プリズムで並べ分ける：7色の線が束になって入り、色ごとに分かれて出る
 if(sep>0){
  let b='';
  SC.forEach((c,k)=>{const o=(k-3)*2.2;b+=line(X_S[0],X_S[1]+o,XR[0].Q1[0],XR[0].Q1[1]+o,{color:c,w:3,opacity:.9});});
  b+=draw([X_S,XR[0].Q1],1,{color:'#ffffff',w:7,opacity:.6});
  b+=prismShape(XP);
  b+=drawFan(XR,{g:seg(sep,.2,.9)});
  b+=fade(seg(sep,.8,1),label('並べ分けた だけ',880,850,{size:40,color:HC,anchor:'end',weight:700}));
  s+=fade(seg(sep,0,.2),b);
  s+=fade(seg(sep,.2,.4),note('色の 広がりは 大きく誇張',40,895));
 }
 return s;
}

// ================= レンズで白に戻す（11） =================
const LP={c:[230,560],s:220,rot:Math.PI},[L_S,L_D]=srcFor(LP,ANG_IN),LX=560,LF=[830,0];
const LRAYS=fanRays(L_S,L_D,LP,{x:LX});
LF[1]=(LRAYS[0].E[1]+LRAYS[LRAYS.length-1].E[1])/2;
function lensScene(t,{conv=0,white=0}){
 let s=beam(L_S,LRAYS[0].Q1,1,9)+prismShape(LP)+drawFan(LRAYS,{g:1,inside:1});
 if(conv>0)for(let k=0;k+1<LRAYS.length;k++){const a=LRAYS[k].E,b=LRAYS[k+1].E,Fa=[mix(a[0],LF[0],conv),mix(a[1],LF[1],conv)],Fb=[mix(b[0],LF[0],conv),mix(b[1],LF[1],conv)];
  s+=poly([a,Fa,Fb,b],{fill:specColor((k+.5)/(LRAYS.length-1)),fo:.85,stroke:specColor((k+.5)/(LRAYS.length-1)),sw:1});}
 const y0=LRAYS[LRAYS.length-1].E[1]-60,y1=LRAYS[0].E[1]+60,cy=(y0+y1)/2;
 s+=`<ellipse cx="${LX}" cy="${cy.toFixed(1)}" rx="30" ry="${((y1-y0)/2).toFixed(1)}" fill="#bcd4ff" fill-opacity=".22" stroke="${GLASS}" stroke-width="5"/>`;
 s+=label('レンズ',LX,y1+55,{size:40,color:GLASS,anchor:'middle',weight:700});
 s+=line(LF[0]+14,LF[1]-120,LF[0]+14,LF[1]+120,{color:'#5c6f90',w:6});
 if(white>0){s+=fade(white,`<circle cx="${LF[0]+6}" cy="${LF[1].toFixed(1)}" r="${(20+10*white).toFixed(1)}" fill="#ffffff" fill-opacity=".35"/>`+dot(LF[0]+6,LF[1],14,'#ffffff'));
  s+=fade(seg(white,.3,1),plate('白に 戻る',LF[0]+20,LF[1]-160,{size:44,color:'#ffffff',anchor:'middle'}));}
 s+=fade(seg(conv,0,.3),label('1点に 集める',LX+40,y1+120,{size:40,color:HC,weight:700}));
 s+=note('色の 広がりは 大きく誇張',40,895);
 return s;
}

// ================= 速さと曲がり方（13） =================
const SO=[470,420],S_I=50*DEG;
function speedScene(v,{ray=1,bars=1,rule=0,prev=1}={}){
 let s=rect(0,SO[1],W,230,{fill:WATER,fo:.2,stroke:'none',rx:0})+line(0,SO[1],W,SO[1],{color:SURF,w:4});
 s+=label('空気',40,SO[1]-30,{size:38,color:C.dim,weight:700})+label('水・ガラス',40,SO[1]+60,{size:38,color:SURF,weight:700});
 s+=line(SO[0],SO[1]-300,SO[0],SO[1]+220,{color:C.dim,w:3,dash:'10 8'});
 const A=[SO[0]-330*Math.sin(S_I),SO[1]-330*Math.cos(S_I)],r=Math.asin(Math.sin(S_I)*v),B=[SO[0]+215*Math.sin(r)/Math.cos(r),SO[1]+215];
 s+=draw([A,SO],seg(ray,0,.5),{color:LIGHT,w:7})+draw([SO,B],seg(ray,.5,1),{color:LIGHT,w:7});
 s+=fade(seg(ray,.5,1),draw([SO,[SO[0]+215*Math.tan(S_I),SO[1]+215]],1,{color:C.dim,w:3,dash:'6 10'}));
 s+=fade(seg(ray,.8,1),arc2(SO,Math.PI/2-S_I,Math.PI/2-r,120,HC));
 s+=fade(bars,label('速さ',40,700,{size:36,color:C.dim})
  +label('空気',40,770,{size:38,color:C.ink,weight:700})+rect(240,732,560,48,{fill:LIGHT,fo:.85,stroke:LIGHT,rx:6})+label('1',820,770,{size:40,color:LIGHT,weight:700})
  +label('水・ガラス',40,850,{size:38,color:SURF,weight:700})+rect(240,812,560*v,48,{fill:WATER,fo:.85,stroke:SURF,rx:6})+label(v.toFixed(2),250+560*v,850,{size:40,color:SURF,weight:700}));
 s+=fade(rule,plate('遅いほど 大きく 曲がる',52,SO[1]+180,{size:40,color:HC,anchor:'start'}));
 s+=fade(prev,plate('前の 動画で 見た',960,60,{size:36,color:C.dim,anchor:'end'}));
 return s;
}
function arc2(O,a0,a1,r,col){const pts=[];for(let k=0;k<=20;k++){const a=a0+(a1-a0)*k/20;pts.push([O[0]+r*Math.cos(a),O[1]+r*Math.sin(a)]);}return draw(pts,1,{color:col,w:5});}

// ================= 赤と紫の速さ（14） =================
const VR=1/1.331,VVI=1/1.343; // 0.7513、0.7446
const BX=60,BS=760; // 空気の速さ 1 ＝ 760px
const wave=(x0,x1,y,lam,amp,col)=>{const pts=[];for(let x=x0;x<=x1;x+=3)pts.push([x,y-amp*Math.sin(2*Math.PI*(x-x0)/lam)]);return draw(pts,1,{color:col,w:5});};
function barsScene({grow=1,waves=0,zoom=0,txt=0}){
 let s=label('空気の中の 速さを 1 と すると',40,70,{size:36,color:C.dim});
 s+=line(BX+BS,120,BX+BS,500,{color:C.dim,w:3,dash:'10 8'})+label('1',BX+BS+16,150,{size:38,color:C.dim});
 const row=(y,name,col,v,lam,wl)=>label(name,40,y,{size:44,color:col,weight:700})
  +fade(waves,wave(110,300,y-14,lam,16,col)+label(wl,320,y,{size:36,color:col}))
  +rect(BX,y+30,BS*v*grow,52,{fill:col,fo:.8,stroke:col,rx:6});
 s+=row(190,'赤',RED,VR,96,'波長 長い')+row(390,'紫',VIO,VVI,52,'波長 短い');
 if(zoom>0){
  // 棒の先を拡大（1 あたり 20000px）
  const zx=v=>80+(v-.735)*20000;
  let q=fade(seg(zoom,0,.3),rect(BX+BS*.735-6,206,BS*.017+12,290,{fill:'none',fo:0,stroke:HC,sw:3,rx:6})+line(BX+BS*.735,496,60,580,{color:HC,w:3,dash:'8 8'})+line(BX+BS*.752,496,860,580,{color:HC,w:3,dash:'8 8'}));
  q+=fade(seg(zoom,.2,.45),rect(60,580,800,270,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:14})
   +rect(62,612,(zx(VR)-62)*seg(zoom,.3,.7),58,{fill:RED,fo:.8,stroke:RED,rx:4})
   +rect(62,712,(zx(VVI)-62)*seg(zoom,.3,.7),58,{fill:VIO,fo:.8,stroke:VIO,rx:4}));
  q+=fade(seg(zoom,.7,1),line(zx(VVI),700,zx(VVI),780,{color:C.ink,w:3,dash:'6 6'})+arrow(zx(VVI)+6,741,zx(VR)-4,741,{color:HC,w:5,head:16})+arrow(zx(VR)-4,741,zx(VVI)+6,741,{color:HC,w:5,head:16}));
  s+=q+fade(seg(zoom,.3,.6),note('棒の 先を 大きく 拡大',60,900));
 }
 s+=fade(txt,plate('紫の ほうが わずかに 遅い',840,830,{size:40,color:HC,anchor:'end'}));
 return s;
}

// ================= 数（15） =================
function numScene(a,b,c,d){
 let s=label('水の中で 比べる',40,70,{size:40,color:C.ink,weight:700})+tag('今の値',960,60,{anchor:'end'});
 s+=note('比 ＝ 空気の中の 速さ ÷ 水の中の 速さ',40,140);
 s+=fade(a,rect(40,190,820,130,{fill:RED,fo:.1,stroke:RED,sw:3,rx:16})+label('赤の 比',80,275,{size:48,color:RED,weight:700})+label('1.331',820,282,{size:72,color:RED,anchor:'end',weight:700}));
 s+=fade(b,rect(40,350,820,130,{fill:VIO,fo:.1,stroke:VIO,sw:3,rx:16})+label('紫の 比',80,435,{size:48,color:VIO,weight:700})+label('1.343',820,442,{size:72,color:VIO,anchor:'end',weight:700}));
 s+=fade(c,label('差',60,590,{size:44,color:HC,weight:700})+label('1.343 − 1.331 ＝ 0.012',150,590,{size:46,color:HC,weight:700}));
 s+=fade(d,label('0.012 ÷ 1.331 ≈ 0.9 %',150,680,{size:46,color:HC,weight:700})+rect(150,730,420,96,{fill:'#131f38',fo:.95,stroke:HC,sw:4,rx:16})+label('約 1 %',360,800,{size:60,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ================= 色の帯（17・18・19） =================
function band(x0,y0,w,h,id,{smooth=1,divs=7,divG=1,names=0,blocks=0}={}){
 let s=specGrad(id)+`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="8" fill="url(#${id})" opacity="${smooth.toFixed(3)}"/>`;
 if(blocks>0){for(let k=0;k<7;k++)s+=fade(blocks,rect(x0+w*k/7,y0,w/7,h,{fill:SC[k],fo:1,stroke:'none',rx:0}));}
 if(divG>0&&divs>1)for(let k=1;k<divs;k++)s+=fade(divG,line(x0+w*k/divs,y0-12,x0+w*k/divs,y0+h+12,{color:C.bg,w:6}));
 if(names>0)NAMES.forEach((nm,k)=>{s+=fade(seg(names,k/9,k/9+.3),label(nm,x0+w*(k+.5)/7,y0+h+56,{size:40,color:SC[k],anchor:'middle',weight:700}));});
 return s;
}

// ================= 雨と虹（20・21） =================
const RBC=[500,690],RBR=390;
function rainbowArc(g,{cx=RBC[0],cy=RBC[1],R=RBR,wd=13}={}){
 let s='';for(let k=0;k<7;k++){const r=R-k*wd,pts=[];const a0=Math.PI+.15,a1=2*Math.PI-.15;for(let j=0;j<=60;j++){const a=a0+(a1-a0)*j/60;pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
  s+=draw(pts,g,{color:SC[k],w:wd+1,opacity:.75});}
 return s;
}
const drop=(x,y,r,col='#8ec0ff')=>`<path d="M${x} ${y-r*1.6} C${x+r*.35} ${y-r*.9} ${x+r} ${y-r*.4} ${x+r} ${y+r*.15} A${r} ${r} 0 0 1 ${x-r} ${y+r*.15} C${x-r} ${y-r*.4} ${x-r*.35} ${y-r*.9} ${x} ${y-r*1.6}Z" fill="${col}" fill-opacity=".35" stroke="${col}" stroke-width="4"/>`;
// ばらばらの雨粒（大きさ・位置ばらばら）
const DROPS=[[90,330,16],[230,470,24],[160,620,12],[330,580,20],[420,400,14],[600,360,22],[700,520,13],[780,300,18],[860,450,26],[540,620,15],[280,760,22],[680,780,17],[120,840,20],[820,700,12],[450,860,14]];
const drops=g=>g>0?DROPS.map(([x,y,r],k)=>fade(seg(g,k/22,k/22+.35),drop(x,y,r,'#8ec0ff'))).join(''):'';
// 弧を延ばした円（点線）：定規で描いたような円
function perfectCircle(g,{label:lb=1,dim=0}={}){
 if(g<=0)return '';
 const pts=[];for(let k=0;k<=96;k++){const a=Math.PI+.15-2*Math.PI*k/96*g;pts.push([RBC[0]+(RBR-45)*Math.cos(a),RBC[1]+(RBR-45)*Math.sin(a)]);}
 let s=draw(pts,1,{color:HC,w:4,dash:'14 10',opacity:1-dim});
 if(lb)s+=fade(seg(g,.4,.8),plate('きれいな 円',500,RBC[1]+20,{size:48,color:HC,anchor:'middle'}));
 return s;
}
function rain(t,g=1){
 let s='';for(let k=0;k<70;k++){const x=(k*137.5)%1000,sp=180+(k*53)%90,y=((k*211)%920+t*sp)%960-20;s+=line(x,y,x-4,y+22,{color:'#8ec0ff',w:3,opacity:.45});}
 return fade(g,s);
}

// ================= cue ごとの図 =================
export const deep03Diagrams={
 // 1 プリズムで白い光が虹色に分かれる
 [K+'prism:split']:(p,ctx)=>{const b=vseg(ctx,p,0,.25),f=vseg(ctx,p,.45,.8);
  return mainScene({b,fan:f,names:vseg(ctx,p,.6,.8)})+fade(vseg(ctx,p,.5,.7),note('色の 広がりは 大きく誇張',40,895));},
 // 2 この色は、どこから？
 [K+'prism:q']:(p,ctx)=>mainScene({})+note('色の 広がりは 大きく誇張',40,895)+bigQ(600,760,vseg(ctx,p,.2,.6),200)+fade(vseg(ctx,p,.4,.8),label('どこから 来た？',40,700,{size:48,color:C.ink,weight:700})),
 // 3 昔の考え：ガラスが色を付ける
 [K+'old:idea']:(p,ctx)=>{const a=swin(ctx,p,0,0,.4),b=swin(ctx,p,0,.4,.9),c=swin(ctx,p,1,0,.45),d=swin(ctx,p,1,.45,.9);
  let s=tag('仮説',40,60,{text:'昔の 考え'});
  s+=fade(a,draw([[40,280],[380,280]],a,{color:'#ffffff',w:16})+label('白い光',40,240,{size:40,color:LIGHT,weight:700}));
  s+=fade(a,rect(380,170,180,220,{fill:GLASS,fo:.15,stroke:GLASS,sw:4,rx:8})+label('ガラス',470,440,{size:40,color:GLASS,anchor:'middle',weight:700}));
  if(b>0){s+=draw([[560,280],[960,280]],b,{color:'#ffffff',w:16});
   for(let k=0;k<24;k++){const x=575+k*16;if(x>560+400*b)break;s+=dot(x,280+((k*37)%3-1)*5,6,SC[(k*3)%7]);}
   s+=fade(seg(b,.5,1),label('色が 付く？',760,230,{size:44,color:HC,anchor:'middle',weight:700}));}
  s+=fade(c,rect(40,520,820,130,{fill:'#131f38',fo:.95,stroke:'#e8eef8',sw:3,rx:16})+label('白い光',80,600,{size:44,color:'#ffffff',weight:700})+label('＝ 純粋な もの',300,600,{size:44,color:C.ink,weight:700}));
  s+=fade(d,rect(40,690,820,130,{fill:'#131f38',fo:.95,stroke:'#ffb36b',sw:3,rx:16})+label('色',80,770,{size:44,color:'#ffb36b',weight:700})+label('＝ 加わった 汚れ',300,770,{size:44,color:C.ink,weight:700}));
  return s;},
 // 4 暗い部屋・窓の穴・日光・プリズム
 [K+'room:setup']:(p,ctx)=>{const t=tv(ctx,p);
  return roomScene({year:seg(t,0,.15),dark:seg(t,.22,.38),win:seg(t,.4,.55),b:seg(t,.55,.95),pr:seg(t,.75,.92)});},
 // 5a 予想：全部の色が同じだけ曲がるなら、穴と同じ丸
 [K+'room:predict']:(p,ctx)=>roomScene({hyp:vseg(ctx,p,.15,.6),panel:vseg(ctx,p,.45,.6),pred:vseg(ctx,p,.55,.85)}),
 // 5b ところが細長い帯。色ごとに曲がる角度が違う
 [K+'room:band']:(p,ctx)=>roomScene({hyp:1-swin(ctx,p,0,0,.25),fan:swin(ctx,p,0,.1,.5),panel:1,pred:1,band:swin(ctx,p,0,.3,1),angles:swin(ctx,p,1,.2,.7)})+fade(swin(ctx,p,0,.3,.5),note('色の 広がりは 大きく誇張',40,895)),
 // 6 決定的な実験
 [K+'room:crucial']:(p,ctx)=>{const g=vseg(ctx,p,.3,.6);
  return roomScene({fan:1,angles:1,dim:g})+fade(g,scaleAt(500,700,.9+.1*g,rect(140,630,720,130,{fill:'#131f38',fo:.96,stroke:'#edf4ff',sw:4,rx:65})+label('決定的な 実験',500,718,{size:60,color:'#edf4ff',anchor:'middle',weight:700})));},
 // 7 赤だけを取り出して 2つ目のプリズムへ
 [K+'cruc:red']:(p,ctx)=>{const t=tv(ctx,p);return crucialScene({fan:seg(t,0,.25),board:seg(t,.25,.45),red:seg(t,.45,.7),p2:seg(t,.7,.9)});},
 // 8 予想：別の色に変わる？
 [K+'cruc:predict']:(p,ctx)=>crucialScene({predict:vseg(ctx,p,.45,1)})+tag('予想',40,850,{text:'別の 色に 変わる？',g:vseg(ctx,p,.5,.8)}),
 // 9 結果：赤のまま、角度も赤のまま
 [K+'cruc:result']:(p,ctx)=>crucialScene({out:swin(ctx,p,0,0,.6),arcs:swin(ctx,p,1,.1,.8)})+tag('結果',40,850,{text:'赤の まま',g:swin(ctx,p,0,.4,.9)})+fade(swin(ctx,p,1,.1,.5),note('角度は 大きく誇張',40,780)),
 // 10a 色はガラスが作ったのではない
 [K+'cruc:not']:(p,ctx)=>{const g=vseg(ctx,p,0,.4),x=vseg(ctx,p,.5,.85);
  return crucialScene({out:1,arcs:1,dim:g})+fade(g,rect(100,640,760,120,{fill:'#131f38',fo:.96,stroke:C.dim,sw:3,rx:16})+label('ガラスが 色を 作る',480,722,{size:52,color:C.ink,anchor:'middle',weight:700}))
   +fade(x,line(130,700,130+700*x,700,{color:C.a,w:8}));},
 // 10b 白い光の中に全部の色。プリズムは並べ分けるだけ
 [K+'mix:inside']:(p,ctx)=>mixScene({zoom:vseg(ctx,p,0,.15),inner:vseg(ctx,p,.1,.5),sep:vseg(ctx,p,.55,.95)}),
 // 11 レンズで集めると白に戻る
 [K+'lens:back']:(p,ctx)=>lensScene(cueT(p,ctx),{conv:vseg(ctx,p,.3,.75),white:vseg(ctx,p,.7,.9)}),
 // 12 なぜ色ごとに曲がり方が違う？
 [K+'why:q']:(p,ctx)=>mainScene({dim:vseg(ctx,p,.1,.4)})+bigQ(600,780,vseg(ctx,p,.2,.6),200),
 // 13 遅くなり方で曲がり方が決まる
 [K+'why:speed']:(p,ctx)=>{const t=tv(ctx,p),w=seg(t,.55,.7)*(1-seg(t,.88,1.05));
  return speedScene(mix(.75,.6,w),{ray:seg(t,.15,.45),bars:seg(t,.3,.5),rule:seg(t,.7,.85)})+fade(seg(t,.5,.6),note('速さを 変えて 比べた 例',40,905));},
 // 14 赤と紫で、遅くなり方がほんの少し違う
 [K+'why:bars']:(p,ctx)=>barsScene({grow:swin(ctx,p,0,.1,.7),waves:swin(ctx,p,1,0,.35),zoom:swin(ctx,p,1,.3,.85),txt:swin(ctx,p,1,.8,1)}),
 // 15 赤 1.331、紫 1.343、差は約1%
 [K+'why:num']:(p,ctx)=>numScene(swin(ctx,p,0,.25,.5),swin(ctx,p,0,.6,.85),swin(ctx,p,1,0,.4),swin(ctx,p,1,.4,.9)),
 // 16 紫は赤より大きく曲がり、扇のように広がる
 [K+'why:fan']:(p,ctx)=>{const t=tv(ctx,p);
  let s=mainScene({b:1,fan:seg(t,.15,.7),names:1});
  const E0=MR[0].E,E1=MR[MR.length-1].E;
  s+=fade(seg(t,.35,.55),draw([M_Q1,add(M_Q1,mul(M_D,(M_X-M_Q1[0])/M_D[0]))],1,{color:C.dim,w:3,dash:'10 8'}));
  s+=fade(seg(t,.4,.6),plate('紫は 大きく 曲がる',M_X-40,E1[1]-50,{size:40,color:VIO,anchor:'end'}));
  s+=fade(seg(t,.75,.95),plate('扇のように 広がる',640,760,{size:44,color:HC,anchor:'middle'}));
  s+=note('角度の 差は 大きく誇張',40,895);
  return s;},
 // 17 7色？ 本当は境目がない
 [K+'seven:smooth']:(p,ctx)=>{const a=swin(ctx,p,0,0,.3),m=swin(ctx,p,0,.5,.85),c=swin(ctx,p,1,0,.5),z=swin(ctx,p,1,.4,.9);
  let s=fade(a,band(60,200,880,150,'d03b17',{smooth:m,blocks:1-m,divG:1-m}));
  s+=fade(a*(1-m),label('7色？',500,140,{size:52,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(m,.6,1),plate('境目は ない',500,150,{size:48,color:HC,anchor:'middle'}));
  s+=fade(c,arrow(80,410,920,410,{color:C.ink,w:5,head:22})+label('赤',60,470,{size:40,color:RED,weight:700})+label('紫',900,470,{size:40,color:VIO,anchor:'end',weight:700})+label('なめらかに つながる',500,470,{size:40,color:C.ink,anchor:'middle',weight:700}));
  if(z>0){const zx0=60+880*.36,zx1=60+880*.52;
   s+=fade(z,rect(zx0,195,zx1-zx0,160,{fill:'none',fo:0,stroke:HC,sw:4,rx:6})+line(zx0,355,60,600,{color:HC,w:3,dash:'8 8'})+line(zx1,355,860,600,{color:HC,w:3,dash:'8 8'}));
   let g=`<defs><linearGradient id="d03z" x1="0" y1="0" x2="1" y2="0">`;for(let k=0;k<=12;k++)g+=`<stop offset="${(k/12).toFixed(3)}" stop-color="${specColor(.36+.16*k/12)}"/>`;g+='</linearGradient></defs>';
   s+=fade(seg(z,.3,.7),g+`<rect x="60" y="600" width="800" height="200" rx="12" fill="url(#d03z)"/>`+note('拡大しても 境目は ない',60,860));}
  return s;},
 // 18 7色はニュートンが決めた。ドレミの7つの音
 [K+'seven:doremi']:(p,ctx)=>{const a=swin(ctx,p,0,.1,.6),b=swin(ctx,p,1,0,.45),c=swin(ctx,p,1,.45,.9);
  let s=band(60,180,880,130,'d03b18',{smooth:1,divG:a,names:a});
  s+=fade(swin(ctx,p,0,.5,.9),label('7色 ＝ ニュートンが 決めた',40,100,{size:44,color:HC,weight:700}));
  s+=fade(b,label('音楽の 7つの 音',40,560,{size:40,color:C.ink,weight:700}));
  ['ド','レ','ミ','ファ','ソ','ラ','シ'].forEach((nt,k)=>{s+=fade(seg(b,.2+k*.08,.4+k*.08),rect(60+k*114,600,100,100,{fill:'#131f38',fo:.95,stroke:C.dim,sw:3,rx:14})+label(nt,110+k*114,666,{size:44,color:C.ink,anchor:'middle',weight:700}));});
  s+=fade(c,plate('7つの 音に なぞらえて、7つの 色',40,800,{size:40,color:HC,anchor:'start'}));
  s+=fade(c,note('…と 言われている',40,880));
  return s;},
 // 19 国や時代で数え方が違う
 [K+'seven:count']:(p,ctx)=>{const g=[vseg(ctx,p,0,.3),vseg(ctx,p,.25,.55),vseg(ctx,p,.5,.8)];
  let s='';
  [[7,120],[6,350],[5,580]].forEach(([n,y],i)=>{s+=fade(g[i],label(`${n}色`,40,y+72,{size:48,color:C.ink,weight:700})+band(180,y,680,110,`d03b19${n}`,{smooth:1,divs:n,divG:1}));});
  s+=fade(vseg(ctx,p,.6,.9),note('区切り方の 例',40,800));
  return s;},
 // 20 雨粒がプリズムの代わり
 [K+'next:rain']:(p,ctx)=>{let s=rain(ctx.tg??cueT(p,ctx),1);
  s+=rainbowArc(vseg(ctx,p,.5,.95));
  const a=vseg(ctx,p,.3,.6),b=vseg(ctx,p,.55,.85);
  s+=fade(a,drop(110,130,44)+label('雨粒',110,235,{size:40,color:'#8ec0ff',anchor:'middle',weight:700}));
  s+=fade(b,label('＝',230,145,{size:56,color:C.ink,anchor:'middle',weight:700})+prismShape({c:[340,120],s:110,rot:0})+label('プリズムの 代わり',290,235,{size:40,color:HC,weight:700}));
  return s;},
 // 21 ばらばらの雨粒なのに、定規で描いたような円
 [K+'next:circle']:(p,ctx)=>{const t=ctx.tg??cueT(p,ctx),a=swin(ctx,p,0,.05,.6),c=swin(ctx,p,1,.3,.95);
  let s=rain(t,1)+drops(a)+rainbowArc(1);
  s+=fade(seg(a,.5,1)*(1-seg(c,0,.2)),plate('ばらばら',40,560,{size:44,color:'#8ec0ff',anchor:'start'}));
  s+=perfectCircle(c);
  return s;},
 // 22 虹はなぜ丸い？
 [K+'next:q']:(p,ctx)=>{const t=ctx.tg??cueT(p,ctx);
  let s=rain(t,1)+drops(.6)+rainbowArc(1)+perfectCircle(1,{label:0,dim:.5});
  s+=bigQ(500,640,vseg(ctx,p,.2,.5),200);
  s+=finalCard(['虹は なぜ、いつも','丸い 形？'],vseg(ctx,p,.5,.8),{y:40,size:60});
  return s;},
};
