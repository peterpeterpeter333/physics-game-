// 深掘りショート 04（ys-deep-04）「虹は、なぜ丸い？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の形は yt1-sp-deep-common.mjs。値の検算は台本 docs/video-revision-20260924/ytseries/sp-deep-04.mjs の冒頭。
// 雨粒の中の光の道は、屈折率 n（赤 1.331、紫 1.343）で実際に計算する（dropRay：入る高さ b、反射 k 回）。
// 05 で使い回せるように export する：
//   dropRay(b,n,k)        単位円の雨粒（中心 0、半径 1、y は下向き）。光は左から右へ（向き (1,0)）、高さ y＝−b で入る。
//                         返り値 {pts:[入る点, 反射点…, 出る点], out:出る向き, theta:太陽と反対の向きからの角（度、正＝出る光が下向き）}
//   rainbowAngle(n,k)     k 回反射の光が集まる角（度）。赤 1回 42.37°、紫 1回 40.65°、赤 2回 50.37°、紫 2回 53.48°（k＝2 は |theta| の最小）
//   DROP / dropBody / dropRays   雨粒の図（舞台の上の位置・雨粒の円・光の道を描く）。oneBounceFigure は 1回反射の図そのもの
//   rainbowBand(cx,cy,rOut,width,{reverse})   虹の帯（外側 赤→内側 紫。reverse で逆）
//   landscape / frontScene / sideScene         景色（正面）・太陽の高さを変えられる正面の図・横から見た図
//   N_RED, N_VIOLET, RED, VIOLET, specColor
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,WATER,SURF,GLASS,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard,eye} from './yt1-sp-deep-common.mjs';

const K='deep04-',DEG=Math.PI/180;
const n1=v=>Number(v.toFixed(1));
export const N_RED=1.331,N_VIOLET=1.343;
export const RED='#ff4b3e',VIOLET='#a274ff';
const SPEC=['#ff4b3e','#ff9a3e','#ffe14a','#4fd27a','#3f8cff','#a274ff'];
const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
export const specColor=u=>{u=clamp(u)*(SPEC.length-1);const k=Math.min(SPEC.length-2,Math.floor(u)),f=u-k,a=hx(SPEC[k]),b=hx(SPEC[k+1]);return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*f).toString(16).padStart(2,'0')).join('');};
const rnd=i=>{const x=Math.sin(i*12.9898+4.1)*43758.5453;return x-Math.floor(x);};
const SKYG='#121b2e',HILL='#18243c',GROUND='#141d30';

// ================= 雨粒の中の光（計算） =================
const vdot=(a,b)=>a[0]*b[0]+a[1]*b[1];
function refract(d,N,eta){const Nn=vdot(d,N)<0?N:[-N[0],-N[1]],c=-vdot(Nn,d);let k=1-eta*eta*(1-c*c);if(k<0&&k>-1e-9)k=0;if(k<0)return null;const f=eta*c-Math.sqrt(k);return [eta*d[0]+f*Nn[0],eta*d[1]+f*Nn[1]];}
const reflect=(d,N)=>{const t=2*vdot(d,N);return [d[0]-t*N[0],d[1]-t*N[1]];};
export function dropRay(b,n=N_RED,k=1){
 b=clamp(b,-1,1);const i=Math.asin(b);let P=[-Math.cos(i),-b],d=refract([1,0],P,1/n);const pts=[P];
 for(let j=0;j<=k;j++){const s=-2*vdot(P,d);P=[P[0]+s*d[0],P[1]+s*d[1]];pts.push(P);if(j<k)d=reflect(d,P);}
 d=refract(d,P,n);
 return {pts,out:d,theta:Math.atan2(d[1],-d[0])/DEG};
}
export function rainbowAngle(n=N_RED,k=1){
 let best=k===1?-1:1e9,bb=0;
 for(let j=0;j<=20000;j++){const b=j/20000,t=Math.abs(dropRay(b,n,k).theta);if(k===1?t>best:t<best){best=t;bb=b;}}
 return {theta:best,b:bb};
}
const A_RED=rainbowAngle(N_RED,1),A_VIO=rainbowAngle(N_VIOLET,1); // 42.37°（b≈0.862）、40.65°（b≈0.856）
const A2_RED=rainbowAngle(N_RED,2).theta,A2_VIO=rainbowAngle(N_VIOLET,2).theta; // 50.37°、53.48°

// ================= 雨粒の図 =================
export const DROP={O:[600,290],R:200};
const toS=q=>[DROP.O[0]+DROP.R*q[0],DROP.O[1]+DROP.R*q[1]];
export function dropBody(g=1,{label:lb=1}={}){
 const {O,R}=DROP;
 return fade(g,ring(O[0],O[1],R,{color:SURF,w:4})+`<circle cx="${O[0]}" cy="${O[1]}" r="${R}" fill="${WATER}" fill-opacity=".2"/>`
  +`<path d="M${O[0]-R*.55} ${O[1]-R*.6} A${R*.8} ${R*.8} 0 0 1 ${O[0]+R*.1} ${O[1]-R*.85}" fill="none" stroke="#e8eef8" stroke-width="5" stroke-opacity=".35" stroke-linecap="round"/>`
  +fade(lb,label('雨粒',O[0]+R*.15,O[1]+20,{size:40,color:SURF,weight:700,anchor:'middle'})));
}
// 1本の光の道（舞台の点）。x0：入ってくる光の始まり、out：出た後の長さ
export function rayPts(b,n=N_RED,k=1,{x0=40,out=560}={}){
 const r=dropRay(b,n,k),P=r.pts.map(toS),E=P.at(-1);
 return {pts:[[x0,P[0][1]],...P,[E[0]+out*r.out[0],E[1]+out*r.out[1]]],ray:r};
}
// 何本もの光。rays：[{b,n,g,color,w,opacity,inside}]。inside＝雨粒の中の線の濃さ
export function dropRays(rays,{x0=40,out=560}={}){
 let s=`<clipPath id="d04st"><rect width="${W}" height="${H}"/></clipPath><g clip-path="url(#d04st)">`;
 for(const q of rays){const g=q.g??1;if(g<=0)continue;
  const {pts}=rayPts(q.b,q.n??N_RED,q.k??1,{x0:q.x0??x0,out:q.out??out});
  s+=draw(pts,g,{color:q.color??LIGHT,w:q.w??4,opacity:q.opacity??1});}
 return s+'</g>';
}
// 太陽の光（左から来る幅のある束）
function sunBeam(g=1,{y0=DROP.O[1]-DROP.R,y1=DROP.O[1]+DROP.R}={}){
 const {O,R}=DROP;let s='';
 for(let y=y0+12;y<y1;y+=36){const xs=O[0]-Math.sqrt(Math.max(0,R*R-(y-O[1])**2));s+=line(40,y,xs,y,{color:LIGHT,w:2,opacity:.28});}
 return fade(g,s+arrow(60,O[1]-R-40,220,O[1]-R-40,{color:LIGHT,w:5,head:20})+label('太陽の 光',60,O[1]-R-62,{size:36,color:LIGHT,weight:700}));
}
// 1回反射の図（05 の振り返り用）：雨粒・太陽の光・集まる向き（赤）
export function oneBounceFigure({g=1,many=1,hl=1}={}){
 const bs=Array.from({length:24},(_,j)=>(j+.5)/24);
 return dropBody(g)+sunBeam(g)+dropRays(bs.map(b=>({b,g:many,opacity:.35,w:3})))+dropRays([{b:A_RED.b,g:hl,color:HC,w:6}]);
}

// ================= 虹の帯・景色 =================
// 外側 赤 → 内側 紫（reverse：外側 紫）。a0〜a1（ラジアン、0＝右、π/2＝下）の範囲を g の割合だけ描く
export function rainbowBand(cx,cy,rOut,width,{a0=Math.PI,a1=2*Math.PI,g=1,reverse=false,opacity=1,N=12}={}){
 if(g<=0)return '';const a=a0+(a1-a0)*clamp(g),M=Math.max(8,Math.ceil(Math.abs(a-a0)/(2*DEG)));let s='';
 for(let k=0;k<N;k++){const u=(k+.5)/N,r=rOut-width*u,pts=[];for(let j=0;j<=M;j++){const b=a0+(a-a0)*j/M;pts.push([cx+r*Math.cos(b),cy+r*Math.sin(b)]);}
  s+=draw(pts,1,{color:specColor(reverse?1-u:u),w:width/N+1.4});}
 return fade(opacity,s);
}
const circlePts=(cx,cy,r,a0=0,a1=2*Math.PI,M=120)=>Array.from({length:M+1},(_,j)=>{const b=a0+(a1-a0)*j/M;return [cx+r*Math.cos(b),cy+r*Math.sin(b)];});
function rainStreaks(t,{x0=0,x1=W,y0=0,y1=H,n=60,opacity=.35,seed=1,slant=.12}={}){
 let s='';for(let i=0;i<n;i++){const x=x0+(x1-x0)*rnd(i+seed),L=y1-y0,y=y0+((rnd(i*7+seed)*L+t*260)%L);s+=line(x,y,x-24*slant,y+24,{color:'#9fb6da',w:2,opacity});}
 return s;
}
const hills=hz=>`<path d="M0 ${hz} Q110 ${hz-46} 240 ${hz-14} T520 ${hz-20} T800 ${hz-30} T1000 ${hz-8} L1000 ${H} L0 ${H} Z" fill="${HILL}"/>`;
// 正面の景色（地平線 hz、太陽の高さ e°、1° ＝ s px）。主虹（1回反射）と副虹（2回反射）
export const LAND={hz:450,e:15,s:7};
export function landscape({hz=LAND.hz,e=LAND.e,s=LAND.s,g=1,sec=0,dashed=0,rain=0,t=0,width=34}={}){
 const cx=W/2,cy=hz+e*s;
 let out=rect(0,hz,W,H-hz,{fill:GROUND,fo:1,stroke:'none',rx:0})+hills(hz);
 if(rain>0)out+=fade(rain,`<clipPath id="d04sky"><rect width="${W}" height="${hz-10}"/></clipPath><g clip-path="url(#d04sky)">`+rainStreaks(t,{x0:120,x1:900,y0:60,y1:hz,n:46,opacity:.22})+'</g>');
 out+=`<clipPath id="d04up"><rect width="${W}" height="${hz-2}"/></clipPath><g clip-path="url(#d04up)">`;
 out+=rainbowBand(cx,cy,A_RED.theta*s,width,{g,a0:Math.PI,a1:2*Math.PI});
 if(sec>0)out+=rainbowBand(cx,cy,A2_VIO*s,width*.9,{reverse:true,opacity:.45*sec});
 out+='</g>';
 if(dashed>0)out+=draw(circlePts(cx,cy,A_RED.theta*s-width/2,0,Math.PI),dashed,{color:'#c4cde0',w:4,dash:'14 12',opacity:.8});
 return out;
}
// 太陽の高さ e を変えられる正面の図（地平線 hz=300、1°＝7px）。full：地面の下の部分も帯で見せる、cover：地面で隠す
export const FV={hz:300,s:7,w:36};
export function frontScene({e=20,full=0,cover=1,center=0,shadow=0,radius=0,band=1,hidden=1,colors=0}={}){
 const {hz,s,w}=FV,cx=W/2,cy=hz+e*s,R=A_RED.theta*s;
 let out=fade(cover,rect(0,hz,W,H-hz,{fill:GROUND,fo:1,stroke:'none',rx:0})+hills(hz));
 out+=`<clipPath id="d04fu"><rect width="${W}" height="${hz-1}"/></clipPath><clipPath id="d04fd"><rect y="${hz+1}" width="${W}" height="${H}"/></clipPath>`;
 out+=`<g clip-path="url(#d04fu)">`+rainbowBand(cx,cy,R,w,{a0:0,a1:2*Math.PI,opacity:band})+'</g>';
 out+=`<g clip-path="url(#d04fd)">`+rainbowBand(cx,cy,R,w,{a0:0,a1:2*Math.PI,opacity:band*full})
  +fade(hidden*cover*band,draw(circlePts(cx,cy,R-w/2),1,{color:'#c4cde0',w:3,dash:'12 12',opacity:.7}))+'</g>';
 if(shadow>0){const sp=`<path d="M${cx-60} ${H} L${cx-20} ${cy+40} Q${cx} ${cy+26} ${cx+20} ${cy+40} L${cx+60} ${H} Z" fill="#05080f" fill-opacity=".75"/>`+`<circle cx="${cx}" cy="${cy+4}" r="30" fill="#05080f" fill-opacity=".85"/>`;out+=fade(shadow,sp);}
 if(center>0)out+=fade(center,dot(cx,cy,12,HC)+ring(cx,cy,24,{color:HC,w:4}));
 if(radius>0){const a=-60*DEG;out+=fade(radius,line(cx,cy,cx+R*Math.cos(a),cy+R*Math.sin(a),{color:HC,w:4,dash:'10 8'})+plate('42°',cx+R*.5*Math.cos(a)+28,cy+R*.5*Math.sin(a),{size:44,color:HC}));}
 return out;
}
// 太陽の高さの小さな図（左上）
function sunGauge(e,g=1){
 const ox=50,oy=186,r=80,a=e*DEG;
 let s=rect(24,24,276,180,{fill:'#131f38',fo:.92,stroke:C.faint,sw:2,rx:14})+line(ox-10,oy,ox+r+30,oy,{color:C.dim,w:3});
 s+=draw(circlePts(ox,oy,46,-a,0,20),1,{color:'#ffcf67',w:3});
 s+=line(ox,oy,ox+r*Math.cos(a),oy-r*Math.sin(a),{color:'#ffcf67',w:3,dash:'8 7'})+sun(ox+r*Math.cos(a),oy-r*Math.sin(a),14);
 s+=label('太陽の 高さ',290,70,{size:36,color:C.ink,anchor:'end',weight:700})+label(`${Math.round(e)}°`,290,150,{size:52,color:e>A_RED.theta?C.a:'#ffcf67',anchor:'end',weight:700});
 return fade(g,s);
}

// ================= 横から見た図 =================
export const SIDE={gy:640,px:240,eye:[252,498],el:30};
function sun(x,y,r=34){let s='';for(let k=0;k<12;k++){const a=k*30*DEG;s+=line(x+(r+8)*Math.cos(a),y+(r+8)*Math.sin(a),x+(r+20)*Math.cos(a),y+(r+20)*Math.sin(a),{color:'#ffcf67',w:4});}return s+dot(x,y,r,'#ffcf67');}
function person(x,gy,{color='#c4cde0',g=1,eyeMark=1}={}){
 const hy=gy-142;
 let s=line(x,hy+28,x,gy-56,{color,w:12})+line(x,gy-56,x-16,gy,{color,w:10})+line(x,gy-56,x+16,gy,{color,w:10})+line(x,hy+50,x+28,hy+96,{color,w:9})+line(x,hy+50,x-22,hy+96,{color,w:9});
 s+=dot(x,hy,28,color)+fade(eyeMark,dot(x+14,hy-4,7,'#0b1122'));
 return fade(g,s);
}
function sideGround(){return rect(0,SIDE.gy,W,H-SIDE.gy,{fill:GROUND,fo:1,stroke:'none',rx:0})+line(0,SIDE.gy,W,SIDE.gy,{color:'#5c6f90',w:3});}
const sideRain=(t,g=1)=>fade(g,rainStreaks(t,{x0:560,x1:900,y0:70,y1:SIDE.gy,n:44,opacity:.4,seed:3}));
const AX=[Math.cos(SIDE.el*DEG),Math.sin(SIDE.el*DEG)];                   // 軸の向き（太陽→目→太陽と反対の点）
const atY=(E,y)=>[E[0]+(y-E[1])/AX[1]*AX[0],y];
export const SUNP=[SIDE.eye[0]-220*AX[0],SIDE.eye[1]-220*AX[1]];           // 太陽（軸の上、目の左上）
const SHADOW=atY(SIDE.eye,SIDE.gy),ANTI=atY(SIDE.eye,860);                // 頭の影（498,640）、太陽と反対の点の印（879,860）
const drops=(list,g=1)=>fade(g*.6,list.map(([x,y])=>dropGlyph(x,y,9,0)).join(''));
function dropGlyph(x,y,r,glow){const col=glow>0?HC:'#8fb4ef';return `<path d="M${n1(x)} ${n1(y-1.8*r)} C${n1(x+.4*r)} ${n1(y-.9*r)} ${n1(x+r)} ${n1(y-.4*r)} ${n1(x+r)} ${n1(y+.15*r)} A${r} ${r} 0 0 1 ${n1(x-r)} ${n1(y+.15*r)} C${n1(x-r)} ${n1(y-.4*r)} ${n1(x-.4*r)} ${n1(y-.9*r)} ${n1(x)} ${n1(y-1.8*r)}Z" fill="${col}" fill-opacity="${glow>0?1:.7}"/>`;}
const RAIN_DROPS=Array.from({length:26},(_,i)=>[575+320*rnd(i+11),95+500*rnd(i*3+5)]);
// 横から見た図：人・太陽・雨。axis：太陽→頭→影→太陽と反対の点
export function sideScene({t=0,personG=1,sunG=1,rainG=1,axis=0,shadow=0,anti=0,center=0}={}){
 const E=SIDE.eye;
 let s=sideGround()+sideRain(t,rainG);
 if(shadow>0)s+=fade(shadow,`<ellipse cx="${n1((SIDE.px+SHADOW[0])/2)}" cy="${SIDE.gy+6}" rx="${n1((SHADOW[0]-SIDE.px)/2+20)}" ry="10" fill="#05080f" fill-opacity=".8"/>`+dot(SHADOW[0],SIDE.gy+4,14,'#05080f'));
 if(axis>0){s+=draw([SUNP,E,SHADOW],seg(axis,0,.6),{color:'#ffcf67',w:4,dash:'12 9'})+draw([SHADOW,ANTI],seg(axis,.6,1),{color:HC,w:4,dash:'12 9'});}
 s+=fade(sunG,sun(SUNP[0],SUNP[1]));
 s+=person(SIDE.px,SIDE.gy,{g:personG});
 if(anti>0)s+=fade(anti,dot(ANTI[0],ANTI[1],14,HC)+ring(ANTI[0],ANTI[1],26,{color:HC,w:4}));
 return s;
}

const antiLabel=g=>fade(g,plate('太陽と 反対の 点',ANTI[0]-40,900,{size:40,color:HC,anchor:'end'}));

// ================= 円すい（3D を斜めから見る） =================
// 軸 X（目→太陽と反対の点）、Y 上、Z 手前。psi：縦の軸のまわりに回して見る角。円の中心を画面の (cxS, cyS) に置く
const CONE={S:500,cy:450,cx:560};
function coneProj(psi){
 const X0=CONE.S*Math.cos(A_RED.theta*DEG),r=CONE.S*Math.sin(A_RED.theta*DEG),c=Math.cos(psi),sn=Math.sin(psi);
 const P=(X,Y,Z)=>[CONE.cx+(X-X0)*c+Z*sn,CONE.cy-Y];
 return {P,X0,r};
}
function coneFigure(psi,phi,{trace=0,surface=0,axisG=1,lineG=1,angleG=0,circleG=0,sunG=1}={}){
 const {P,X0,r}=coneProj(psi),E=P(0,0,0),Cc=P(X0,0,0),S=P(-170,0,0);
 let s=fade(sunG,sun(S[0],S[1],28));
 s+=fade(axisG,line(S[0],S[1],Cc[0]+60*Math.cos(psi),Cc[1],{color:'#ffcf67',w:4,dash:'12 9'}));
 // 描いた円（ellipse）
 if(trace>0){const pts=[];const M=120;for(let j=0;j<=M*trace;j++){const f=j/M*2*Math.PI;pts.push(P(X0,r*Math.cos(f),r*Math.sin(f)));}
  if(surface>0){for(let j=0;j<24;j++){const f=j/24*2*Math.PI;if(f>trace*2*Math.PI)break;const q=P(X0,r*Math.cos(f),r*Math.sin(f));s+=line(E[0],E[1],q[0],q[1],{color:LIGHT,w:2,opacity:.25*surface});}}
  s+=draw(pts,1,{color:HC,w:7});}
 if(circleG>0){s+=fade(circleG,draw(Array.from({length:121},(_,j)=>P(X0,r*Math.cos(j/120*2*Math.PI),r*Math.sin(j/120*2*Math.PI))),1,{color:HC,w:7}));}
 const q=P(X0,r*Math.cos(phi),r*Math.sin(phi));
 s+=fade(lineG,line(E[0],E[1],q[0],q[1],{color:LIGHT,w:6})+dropGlyph(q[0],q[1],13,1));
 if(angleG>0){const a1=Math.atan2(q[1]-E[1],q[0]-E[0]),pts=[];for(let j=0;j<=20;j++){const b=a1*j/20;pts.push([E[0]+120*Math.cos(b),E[1]+120*Math.sin(b)]);}
  s+=fade(angleG,draw(pts,1,{color:HC,w:5})+plate('42°',E[0]+150*Math.cos(a1/2)+10,E[1]+150*Math.sin(a1/2)+16,{size:44,color:HC}));}
 s+=eye(E[0],E[1],0,{size:40})+label('目',E[0]-10,E[1]+76,{size:40,weight:700,anchor:'middle'});
 s+=fade(axisG,dot(Cc[0],Cc[1],10,HC));
 return s;
}

// ================= 見る人の目と、色ごとの角 =================
const EYE2=[90,850],L2=900;
function colorAngles({white=1,split=0,labels=0,arcs=0,drops2=0}={}){
 let s=draw([EYE2,[930,EYE2[1]]],1,{color:'#ffcf67',w:4,dash:'12 9'})+label('太陽と 反対の 向き',560,EYE2[1]+56,{size:36,color:'#ffcf67',anchor:'middle'});
 const end=th=>[EYE2[0]+L2*Math.cos(th*DEG),EYE2[1]-L2*Math.sin(th*DEG)];
 const mid=(A_RED.theta+A_VIO.theta)/2;
 s+=fade(white*(1-split),line(...EYE2,...end(mid),{color:LIGHT,w:7}));
 s+=fade(split,line(...EYE2,...end(A_RED.theta),{color:RED,w:6})+line(...EYE2,...end(A_VIO.theta),{color:VIOLET,w:6}));
 const arc=(th,r,col)=>draw(Array.from({length:31},(_,j)=>{const b=-th*DEG*j/30;return [EYE2[0]+r*Math.cos(b),EYE2[1]+r*Math.sin(b)];}),1,{color:col,w:5});
 s+=fade(arcs,arc(A_RED.theta,300,RED)+arc(A_VIO.theta,220,VIOLET));
 const eR=end(A_RED.theta),eV=end(A_VIO.theta);
 s+=fade(drops2,dropGlyph(eR[0],eR[1],14,1).replace(HC,RED)+dropGlyph(eV[0]+6,eV[1]+20,14,1).replace(HC,VIOLET));
 s+=fade(labels,plate('赤 約42°',520,370,{size:44,color:RED,anchor:'end'})+plate('紫 約40°',640,480,{size:44,color:VIOLET}));
 s+=eye(EYE2[0],EYE2[1],-41*DEG,{size:40});
 return s;
}

// ================= 二人の目 =================
const TWO=[{px:180,name:'あなた',x:690},{px:370,name:'隣の人',x:880}];
function twoPeople({t=0,lines=0,each=0,names=1}={}){
 let s=sideGround()+sideRain(t,1);
 s+=sun(70,300,30)+arrow(120,330,200,376,{color:'#ffcf67',w:4,head:16});
 const up=Math.tan((A_RED.theta-SIDE.el)*DEG),dn=Math.tan((A_RED.theta+SIDE.el)*DEG);
 TWO.forEach((P,i)=>{const E=[P.px+12,SIDE.gy-144],D=[P.x,E[1]-(P.x-E[0])*up];
  const col=i===0?HC:'#6adfff';
  s+=person(P.px,SIDE.gy,{color:i===0?'#e8eef8':'#9fc6d8'});
  s+=fade(names,label(P.name,P.px,SIDE.gy+60,{size:38,color:col,anchor:'middle',weight:700}));
  s+=fade(lines,draw([E,atY(E,SIDE.gy)],1,{color:'#ffcf67',w:3,dash:'10 9',opacity:.8})+line(...E,...D,{color:col,w:5})+dropGlyph(D[0],D[1],13,1).replace(HC,col)+dot(D[0],D[1],28,col,.25));
  s+=fade(each,ring(D[0],D[1],40,{color:col,w:5}));
 });
 return s;
}

// ================= 年と人影 =================
function card(y,name,sub,g){return fade(g,rect(180,y,640,170,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:18})+dot(250,y+62,26,'#c4cde0')+`<path d="M206 ${y+150} q44 -70 88 0Z" fill="#c4cde0"/>`+label(name,320,y+72,{size:48,color:C.ink,weight:700})+label(sub,320,y+135,{size:38,color:C.dim}));}
// ガラスの球（水入り）
function glassSphere(g=1,{rays=0,q=0}={}){
 const cx=600,cy=430,R=230;
 let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${WATER}" fill-opacity=".25" stroke="${GLASS}" stroke-width="6"/>`+`<path d="M${cx-R*.6} ${cy-R*.55} A${R*.85} ${R*.85} 0 0 1 ${cx} ${cy-R*.88}" fill="none" stroke="#ffffff" stroke-width="7" stroke-opacity=".35" stroke-linecap="round"/>`;
 s+=rect(cx-70,cy+R-6,140,26,{fill:GLASS,fo:.5,stroke:GLASS,rx:6})+rect(cx-130,cy+R+20,260,22,{fill:GLASS,fo:.35,stroke:GLASS,rx:6});
 s+=label('水',cx+60,cy+90,{size:40,color:SURF,weight:700});
 for(let k=0;k<4;k++){const y=cy-R*.8+k*R*.4,xs=cx-Math.sqrt(R*R-(y-cy)**2);s+=fade(rays,draw([[40,y],[xs,y]],rays,{color:LIGHT,w:4}));}
 s+=fade(rays,label('太陽の 光',40,cy-R*.8-30,{size:36,color:LIGHT,weight:700}));
 s+=bigQ(170,820,q,160);
 return fade(g,s);
}

// ================= 飛行機の窓 =================
function planeWindow(g=1){
 const x0=230,y0=110,w=540,h=770;
 let s=rect(0,0,W,H,{fill:'#1a2234',fo:1,stroke:'none',rx:0});
 s+=`<clipPath id="d04win"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="230"/></clipPath><g clip-path="url(#d04win)">`;
 s+=rect(x0,y0,w,h,{fill:'#1b3529',fo:1,stroke:'none',rx:0});
 [[300,250,120,40],[620,330,160,50],[400,720,150,45],[650,800,110,35],[330,520,90,30]].forEach(([x,y,a,b])=>{s+=`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#e8eef8" fill-opacity=".18"/>`;});
 s+=rainbowBand(500,495,220,34,{a0:-Math.PI/2,a1:1.5*Math.PI,g});
 s+='</g>';
 s+=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="230" fill="none" stroke="#c9d6ea" stroke-width="14"/>`;
 s+=label('飛行機の 窓から',500,70,{size:40,color:C.ink,anchor:'middle',weight:700});
 return s;
}

// ================= cue ごとの図 =================
const B_MAX=A_RED.b;
const ONE_B=B_MAX;                                           // 9 の 1本：最も集まる所（b≈0.862）
const N_W=1.333,B_W=rainbowAngle(N_W).b,thW=b=>dropRay(b,N_W).theta; // 白い光（水 n＝1.333）：b≈0.861 で 42.08°
const NEAR=Array.from({length:10},(_,j)=>.75+.18*j/9);         // 折り返しの前後 b＝0.75〜0.93（39.8°〜42.1°〜40.1°）
// 当たる高さの目盛り（雨粒の左）。b＜0 なら印なし。range：折り返しの前後（0.75〜0.93）の括弧
function ruler(b,g=1,{range=0}={}){
 const x=360,Y=v=>DROP.O[1]-DROP.R*v;
 let s=line(x,Y(0),x,Y(1),{color:C.dim,w:4})+[0,.5,1].map(v=>line(x-12,Y(v),x+12,Y(v),{color:C.dim,w:3})).join('');
 s+=label('真ん中',x-24,Y(0)+12,{size:36,color:C.dim,anchor:'end'})+label('外側',x-24,Y(1)+12,{size:36,color:C.dim,anchor:'end'});
 if(b>=0)s+=`<polygon points="${x+14},${n1(Y(b))} ${x+40},${n1(Y(b)-13)} ${x+40},${n1(Y(b)+13)}" fill="${HC}"/>`+line(40,Y(b),x,Y(b),{color:HC,w:3,opacity:.6});
 if(range>0)s+=fade(range,rect(x-16,Y(.93),32,Y(.75)-Y(.93),{fill:HC,fo:.35,stroke:HC,sw:3,rx:6}));
 return fade(g,s);
}
// 出る角のメーター（太陽と反対の向き＝0°）。中心 (520,880)、半径 320
const DC=[520,880],DRr=320;
function dial(th,g=1,{needle=1,ticks=[0],readout=1,max=0,band=0}={}){
 const P=(a,r)=>[DC[0]+r*Math.cos(a*DEG),DC[1]-r*Math.sin(a*DEG)];
 let s=draw(Array.from({length:51},(_,i)=>P(i,DRr)),1,{color:C.dim,w:3})+line(DC[0],DC[1],DC[0]+DRr+10,DC[1],{color:'#ffcf67',w:3,dash:'10 8'});
 for(const a of ticks){const q1=P(a,DRr-14),q2=P(a,DRr+10),q=P(a,a===38?DRr-58:DRr+44);s+=line(...q1,...q2,{color:a===42?HC:C.ink,w:4})+label(`${a}°`,q[0],q[1]+12,{size:36,color:a===42?HC:C.ink,anchor:'middle',weight:700});}
 if(band>0)s+=fade(band,poly([DC,...Array.from({length:11},(_,i)=>P(39.8+2.3*i/10,DRr))],{fill:HC,fo:.45,stroke:HC,sw:2}));
 if(max>0)s+=fade(max,ring(...P(42.08,DRr),16,{color:HC,w:4}));
 const q=P(th,DRr-20);s+=fade(needle,line(DC[0],DC[1],q[0],q[1],{color:HC,w:7})+dot(DC[0],DC[1],10,HC));
 s+=fade(readout*needle,plate(`出る角 ${Math.round(th)}°`,880,560,{size:48,color:HC,anchor:'end'}));
 return fade(g,s);
}
const MORE=Array.from({length:40},(_,j)=>(j+.5)/40);         // 11 の たくさんの光
export const deep04Diagrams={
 // 1 疑問：虹は円の一部
 [K+'sky:arc']:(p,ctx)=>landscape({g:vseg(ctx,p,0,.45),dashed:vseg(ctx,p,.55,.9),rain:1,t:ctx.tg})+fade(vseg(ctx,p,.7,.95),plate('円の 一部',500,700,{size:44,color:HC,anchor:'middle'})),
 // 2 飛行機の窓から、丸い輪
 [K+'plane:ring']:(p,ctx)=>planeWindow(vseg(ctx,p,.45,.95))+fade(vseg(ctx,p,.8,1),plate('丸い 輪',500,520,{size:44,color:HC,anchor:'middle'})),
 // 3 ばらばらの雨粒なのに、なぜ円？
 [K+'drops:scatter']:(p,ctx)=>{const t=ctx.tg;
  let s=fade(.55,landscape({dashed:0,rain:0}));
  const g=vseg(ctx,p,.0,.4);
  for(let i=0;i<34;i++){const x=60+880*rnd(i+40),y=60+(360*rnd(i*5+9)+t*30)%380;s+=fade(g,dropGlyph(x,y,10,0));}
  s+=fade(vseg(ctx,p,.3,.5),plate('ばらばら',160,120,{size:40,color:'#8fb4ef'}));
  s+=fade(vseg(ctx,p,.55,.8),draw(circlePts(500,LAND.hz+LAND.e*LAND.s,A_RED.theta*LAND.s-17,Math.PI,2*Math.PI),1,{color:HC,w:5,dash:'14 10'})+plate('きれいな 円',500,380,{size:40,color:HC,anchor:'middle'}));
  s+=bigQ(500,760,vseg(ctx,p,.75,.95),200);
  return s;},
 // 4 見える条件：太陽を背に、前に雨
 [K+'side:cond']:(p,ctx)=>{const a=vseg(ctx,p,.05,.25),b=vseg(ctx,p,.25,.5),c=vseg(ctx,p,.6,.85);
  let s=sideScene({t:ctx.tg,personG:a,sunG:b,rainG:c});
  s+=fade(b,plate('背中に 太陽',40,250,{size:40,color:'#ffcf67'}));
  s+=fade(c,plate('前に 雨',730,60,{size:40,color:'#8fb4ef',anchor:'middle'}));
  return s;},
 // 5 虹の円の中心＝太陽と反対の点（頭の影の先）
 [K+'side:center']:(p,ctx)=>{const q=swin(ctx,p,0,.2,.6),ax=swin(ctx,p,1,0,.55),sh=swin(ctx,p,1,.45,.65),an=swin(ctx,p,1,.6,.85);
  let s=sideScene({t:ctx.tg,axis:ax,shadow:sh,anti:an});
  s+=fade(1-swin(ctx,p,0,0,.2),plate('背中に 太陽',40,250,{size:40,color:'#ffcf67'}))+fade(1-swin(ctx,p,0,0,.2),plate('前に 雨',730,60,{size:40,color:'#8fb4ef',anchor:'middle'}));
  s+=fade(q*(1-swin(ctx,p,1,.8,.9)),plate('虹の 円の 中心は？',500,90,{size:44,color:HC,anchor:'middle'}));
  s+=fade(swin(ctx,p,1,.85,1),plate('虹の 円の 中心 ＝ 太陽と 反対の 点',500,90,{size:42,color:HC,anchor:'middle'}));
  s+=fade(sh,plate('頭の 影',SHADOW[0]-24,SIDE.gy+64,{size:38,color:C.ink,anchor:'end'}));
  s+=antiLabel(an);
  return s;},
 // 6 デカルト 1637年
 [K+'desc:card']:(p,ctx)=>{const a=vseg(ctx,p,0,.35),b=vseg(ctx,p,.6,.95);
  let s=fade(a,label('1637年',500,200,{size:64,color:HC,anchor:'middle',weight:700}))+card(280,'デカルト','フランス',a);
  s+=rainbowBand(500,900,280,30,{g:b});
  s+=bigQ(500,860,seg(b,.5,1),150);
  return s;},
 // 7 ガラスの球（雨粒の模型）
 [K+'desc:sphere']:(p,ctx)=>{const a=vseg(ctx,p,0,.3),b=vseg(ctx,p,.3,.5),c=vseg(ctx,p,.6,.85),d=vseg(ctx,p,.85,1);
  let s=glassSphere(a,{rays:c,q:d});
  s+=fade(a,label('水を 入れた ガラスの 球',500,70,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('雨粒の 模型',600,130,{g:b,color:SURF,anchor:'middle'});
  s+=tag('実験',960,60,{anchor:'end',g:a});
  return s;},
 // 8 曲がり方の規則で、光の道を一本ずつ計算
 [K+'drop:calc']:(p,ctx)=>{const a=vseg(ctx,p,0,.25),r1=vseg(ctx,p,.45,.65),r2=vseg(ctx,p,.62,.8),r3=vseg(ctx,p,.78,.96);
  let s=dropBody(a)+sunBeam(a);
  s+=dropRays([{b:.3,n:N_W,g:r1},{b:.6,n:N_W,g:r2},{b:B_W,n:N_W,g:r3}]);
  s+=fade(vseg(ctx,p,.15,.35),plate('曲がり方の 規則',880,700,{size:40,color:HC,anchor:'end'})+plate('（比 約1.33）',880,760,{size:38,color:HC,anchor:'end'}));
  s+=tag('計算',960,60,{anchor:'end',g:a});
  s+=note('雨粒は 大きく 拡大',880,880,{g:a,anchor:'end'});
  return s;},
 // 9 入るとき曲がる・奥で跳ね返る・出るときまた曲がる
 [K+'drop:one']:(p,ctx)=>{
  const {pts}=rayPts(B_W,N_W),u=cueT(p,ctx)/voiceEnd(ctx);
  const segs=[[0,.3],[.3,.42],[.42,.62],[.62,.95]],Ls=[];for(let i=1;i<pts.length;i++)Ls.push(Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
  let s=dropBody(1)+sunBeam(1)+fade(1-vseg(ctx,p,0,.08),dropRays([{b:.3,n:N_W},{b:.6,n:N_W}]));
  for(let i=0;i<4;i++){const g=seg(u,...segs[i]);if(g>0)s+=draw([pts[i],pts[i+1]],g,{color:LIGHT,w:6});}
  const mk=(P,text,g,dx,dy,anc='start')=>fade(g,ring(P[0],P[1],24,{color:HC,w:5})+plate(text,P[0]+dx,P[1]+dy,{size:40,color:HC,anchor:anc}));
  s+=mk(pts[1],'曲がる',seg(u,.24,.32),-30,-40,'end');
  s+=mk(pts[2],'跳ね返る',seg(u,.48,.56),14,-68,'middle');
  s+=mk(pts[3],'また 曲がる',seg(u,.8,.88),40,20);
  s+=fade(seg(u,.88,.98),arrow(...pts[4].map((v,i)=>mix(pts[3][i],v,.5)),...pts[4].map((v,i)=>mix(pts[3][i],v,.75)),{color:LIGHT,w:6,head:22}));
  s+=note('雨粒は 大きく 拡大',880,880,{g:1-vseg(ctx,p,0,.2),anchor:'end'});
  return s;},
 // 10 当たる所で出る向きが変わる。当たる高さの目盛りと、出る角のメーター
 [K+'drop:scale']:(p,ctx)=>{const a=swin(ctx,p,0,.2,.6),b=swin(ctx,p,1,0,.5);
  let s=dropBody(1,{label:0})+sunBeam(1);
  s+=fade(1-vseg(ctx,p,0,.1),dropRays([{b:B_W,n:N_W}]));
  s+=ruler(-1,a)+dial(0,b,{needle:0});
  return s;},
 // 11 真ん中（b＝0）→ まっすぐ戻る、0°
 [K+'drop:b0']:(p,ctx)=>{const r=swin(ctx,p,0,.05,.8),n=swin(ctx,p,1,.3,.7);
  let s=dropBody(1,{label:0})+sunBeam(1)+ruler(0,1);
  s+=dropRays([{b:0,n:N_W,g:r,color:LIGHT,w:6}]);
  s+=fade(swin(ctx,p,0,.7,1),plate('まっすぐ 戻る',60,350,{size:40,color:LIGHT}));
  s+=dial(0,1,{needle:n,readout:n});
  return s;},
 // 12 外へずらすと 28°、38° と大きくなる
 [K+'drop:out']:(p,ctx)=>{const u1=vseg(ctx,p,.08,.5),u2=vseg(ctx,p,.58,.74),b=u2>0?mix(.5,.7,u2):mix(0,.5,u1);
  let s=dropBody(1,{label:0})+sunBeam(1)+ruler(b,1);
  s+=dropRays([{b:0,n:N_W,opacity:.3,w:3},...(b>=.5?[{b:.5,n:N_W,opacity:.3,w:3}]:[])]);
  s+=dropRays([{b,n:N_W,color:LIGHT,w:6}]);
  s+=dial(thW(b),1,{ticks:[0,...(b>=.499?[28]:[]),...(b>=.699?[38]:[])]});
  return s;},
 // 13 約42°で折り返し、38°、28°、14° へ戻る
 [K+'drop:turn']:(p,ctx)=>{const u1=swin(ctx,p,0,.1,.7),u2=swin(ctx,p,1,.1,.9);
  const path=[B_W,.95,.9901,1],k=u2*3,j=Math.min(2,Math.floor(k)),b=u2>0?mix(path[j],path[j+1],k-j):mix(.7,B_W,u1);
  let s=dropBody(1,{label:0})+sunBeam(1)+ruler(b,1);
  s+=dropRays([0,.5,.7].map(x=>({b:x,n:N_W,opacity:.3,w:3})));
  if(u2>0)s+=dropRays([{b:B_W,n:N_W,opacity:.45,w:3,color:HC}]);
  s+=dropRays([{b,n:N_W,color:LIGHT,w:6}]);
  const turn=swin(ctx,p,0,.65,.9);
  s+=dial(thW(b),1,{ticks:[0,28,38,...(u1>.98||u2>0?[42]:[]),...(u2>.66?[14]:[])],max:turn});
  s+=fade(turn,plate('42° で 折り返し',960,60,{size:40,color:HC,anchor:'end'}));
  return s;},
 // 14a 折り返しの前後：当たる所がずれても、ほとんど 42°
 [K+'drop:near']:(p,ctx)=>{const a=vseg(ctx,p,.25,.7),c=vseg(ctx,p,.7,.95);
  let s=dropBody(1,{label:0})+sunBeam(1)+ruler(-1,1,{range:a});
  s+=dropRays(NEAR.map((b,j)=>({b,n:N_W,color:HC,w:4,opacity:.8,g:clamp(a*NEAR.length-j)})));
  s+=dial(rainbowAngle(N_W).theta,1,{ticks:[0,14,28,38,42],band:c,needle:1-c});
  s+=fade(c,plate('ほとんど 42°',960,60,{size:40,color:HC,anchor:'end'}));
  return s;},
 // 14b だから 42° の向きに重なって明るい
 [K+'drop:glow']:(p,ctx)=>{const a=vseg(ctx,p,.05,.5),c=vseg(ctx,p,.55,.85);
  let s=dropBody(1,{label:0})+sunBeam(1)+ruler(-1,1,{range:1});
  s+=dropRays(MORE.map((b,j)=>({b,n:N_W,w:3,opacity:.4,g:clamp(a*MORE.length-j)})));
  s+=dropRays(NEAR.map(b=>({b,n:N_W,color:HC,w:4,opacity:.8})));
  s+=fade(c,`<circle cx="330" cy="760" r="110" fill="${HC}" fill-opacity=".10"/>`+plate('重なって 明るい',330,780,{size:44,color:HC,anchor:'middle'}));
  s+=dial(rainbowAngle(N_W).theta,1,{ticks:[0,14,28,38,42],band:1,needle:0});
  return s;},
 // 15 投げ上げたボール：高さと時間のグラフ（頂上で平ら）
 [K+'ball:graph']:(p,ctx)=>{const u=vseg(ctx,p,.05,.75),hl=vseg(ctx,p,.5,.8);
  const X=t=>140+720*t,Y=h=>800-560*h,hgt=t=>4*t*(1-t);
  let s=line(140,800,900,800,{color:C.dim,w:3})+line(140,800,140,180,{color:C.dim,w:3});
  s+=label('時間',890,850,{size:38,color:C.dim,anchor:'end'})+label('高さ',160,190,{size:38,color:C.dim});
  s+=fade(hl,rect(140,Y(1)-8,720,Y(.85)-Y(1)+16,{fill:HC,fo:.12,stroke:'none',rx:0}));
  s+=draw(Array.from({length:101},(_,i)=>[X(i/100),Y(hgt(i/100))]),u,{color:'#ffb36b',w:5});
  // 同じ時間ごとの点：頂上の近くでは高さがほとんど変わらない
  for(let i=0;i<=16;i++){const t=i/16;if(t>u+1e-6)break;s+=dot(X(t),Y(hgt(t)),9,'#ffb36b');s+=fade(hl,line(X(t),Y(hgt(t)),X(t),800,{color:'#ffb36b',w:1.5,opacity:.35}));}
  const t=u;s+=dot(X(t),Y(hgt(t)),20,'#e8eef8');
  s+=fade(hl,plate('ここに 長くいる',500,Y(1)-40,{size:44,color:HC,anchor:'middle'}));
  s+=note('点は 同じ時間ごと',160,895,{g:vseg(ctx,p,.3,.6)});
  return s;},
 // 12 その角度は、太陽と反対の点から約42°
 [K+'drop:angle']:(p,ctx)=>{
  const {pts,ray}=rayPts(B_W,N_W),X=pts.at(-2),Eo=[X[0]+470*ray.out[0],X[1]+470*ray.out[1]];
  const a=vseg(ctx,p,.1,.4),b=vseg(ctx,p,.45,.75),c=vseg(ctx,p,.7,.95);
  let s=dropBody(1,{label:0})+sunBeam(1);
  s+=dropRays(MORE.map(b=>({b,n:N_W,w:3,opacity:.4*(1-.7*a)})));
  s+=dropRays(NEAR.map(b=>({b,n:N_W,w:4,color:HC,opacity:.7})));
  s+=fade(vseg(ctx,p,0,.3),plate('デカルトの 計算',40,560,{size:40,color:C.ink}));
  s+=fade(a,eye(Eo[0],Eo[1],Math.atan2(-ray.out[1],-ray.out[0]),{size:40})+plate('目',Eo[0]-40,Eo[1]+76,{size:40,anchor:'middle'}));
  s+=draw([Eo,[920,Eo[1]]],b,{color:'#ffcf67',w:4,dash:'12 9'});
  s+=fade(seg(b,.5,1),label('太陽と 反対の 向き',560,Eo[1]+64,{size:38,color:'#ffcf67',anchor:'middle'}));
  const th=ray.theta*DEG,arc=Array.from({length:31},(_,j)=>{const q=-th*j/30;return [Eo[0]+150*Math.cos(q),Eo[1]+150*Math.sin(q)];});
  s+=draw(arc,c,{color:HC,w:6})+fade(c,plate('約 42°',Eo[0]+190*Math.cos(th/2)+10,Eo[1]-190*Math.sin(th/2)+20,{size:52,color:HC}));
  s+=tag('結果',960,60,{anchor:'end',g:c});
  return s;},
 // 13 42° 離れた方向の雨粒が光る
 [K+'side:bright']:(p,ctx)=>{const E=SIDE.eye,a=vseg(ctx,p,.25,.5),b=vseg(ctx,p,.55,.8),c=vseg(ctx,p,.75,.95);
  const up=(A_RED.theta-SIDE.el)*DEG,D=x=>[x,E[1]-(x-E[0])*Math.tan(up)],L=[D(640),D(760),D(870)];
  let s=sideScene({t:ctx.tg,axis:1,shadow:1,anti:1,rainG:.6});
  s+=drops(RAIN_DROPS);
  s+=antiLabel(a);
  s+=draw([E,D(900)],b,{color:HC,w:5});
  const arc=Array.from({length:31},(_,j)=>{const q=SIDE.el*DEG-(SIDE.el*DEG+up)*j/30;return [E[0]+130*Math.cos(q),E[1]+130*Math.sin(q)];});
  s+=draw(arc,b,{color:HC,w:5})+fade(seg(b,.5,1),plate('42°',E[0]+186,E[1]+40,{size:44,color:HC}));
  L.forEach(q=>{s+=fade(c,dot(q[0],q[1],30,HC,.35)+dropGlyph(q[0],q[1],11,1));});
  // 太陽の光 → 雨粒 → 目
  const q=L[1],S0=[q[0]-260*Math.cos(SIDE.el*DEG),q[1]-260*Math.sin(SIDE.el*DEG)];
  s+=fade(c,arrow(S0[0],S0[1],q[0]-24*Math.cos(SIDE.el*DEG),q[1]-24*Math.sin(SIDE.el*DEG),{color:'#ffcf67',w:4,head:16}));
  s+=fade(seg(c,.5,1),plate('明るく 光る',q[0],q[1]+90,{size:40,color:HC,anchor:'middle'}));
  return s;},
 // 14 同じ 42° の方向を全部集めると円
 [K+'cone:spin']:(p,ctx)=>{const u=vseg(ctx,p,.3,.8),psi=mix(30,40,vseg(ctx,p,.7,1))*DEG,phi=2*Math.PI*u; // φ＝0 は上の線
  const {P,X0,r}=coneProj(psi);
  let s=coneFigure(psi,phi,{trace:u,surface:1,angleG:vseg(ctx,p,.05,.25)*(1-vseg(ctx,p,.3,.4)),lineG:1});
  const Rt=P(X0,0,r);s+=fade(vseg(ctx,p,.85,1),plate('円',Math.max(Rt[0],P(X0,0,-r)[0])+30,CONE.cy+20,{size:64,color:HC}));
  s+=fade(vseg(ctx,p,0,.2),label('太陽',coneProj(psi).P(-170,0,0)[0],coneProj(psi).P(-170,0,0)[1]-60,{size:38,color:'#ffcf67',anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.1,.3),plate('太陽と 反対の 点',CONE.cx,CONE.cy+70,{size:38,color:HC,anchor:'middle'}));
  return s;},
 // 15 だから丸い。下は地面にさえぎられ、弧に見える
 [K+'front:arc']:(p,ctx)=>{const c=swin(ctx,p,1,.0,.45);
  let s=frontScene({e:20,full:1-c,cover:c,center:1,radius:1-swin(ctx,p,1,0,.2),hidden:1});
  s+=fade(1-swin(ctx,p,1,0,.2),plate('太陽と 反対の 点',540,FV.hz+20*FV.s+12,{size:38,color:HC}));
  s+=fade(swin(ctx,p,1,.3,.55),plate('地面に さえぎられる',500,820,{size:40,color:'#c4cde0',anchor:'middle'}));
  s+=fade(swin(ctx,p,1,.7,.9),plate('ふだんは 弧',500,110,{size:44,color:HC,anchor:'middle'}));
  s+=note('虹の 幅は 大きく 誇張',40,895,{g:1});
  return s;},
 // 16 太陽が 42° より高いと、円は全部地平線の下
 [K+'front:sun']:(p,ctx)=>{const e=mix(20,50,swin(ctx,p,1,.15,.85));
  let s=frontScene({e,full:0,cover:1,center:1,hidden:1});
  s+=sunGauge(e,swin(ctx,p,0,0,.3));
  s+=fade(swin(ctx,p,0,.4,.8)*(1-swin(ctx,p,1,0,.1)),plate('昼間は 太陽が 高い',640,80,{size:38,color:'#ffcf67',anchor:'middle'}));
  s+=fade(clamp((e-A_RED.theta)/2),plate('全部 地平線の 下',500,240,{size:44,color:C.a,anchor:'middle'}));
  s+=note('虹の 幅は 大きく 誇張',40,895,{g:1});
  return s;},
 // 17 色ごとの角：赤 約42°、紫 約40°
 [K+'color:angles']:(p,ctx)=>colorAngles({white:1,split:swin(ctx,p,0,.4,.9),arcs:swin(ctx,p,1,0,.3),labels:swin(ctx,p,1,.05,.6),drops2:swin(ctx,p,0,.6,1)}),
 // 18 外側が赤、内側が紫
 [K+'front:colors']:(p,ctx)=>{const a=vseg(ctx,p,.2,.55),b=vseg(ctx,p,.55,.9);
  const {hz,s:sc,w}=FV,cx=W/2,cy=hz+20*sc,R=A_RED.theta*sc,Rv=R-w;
  let s=frontScene({e:20,cover:1,center:1,hidden:1});
  const top=cy-R;
  s+=fade(a,arrow(cx+140,top-80,cx+12,top-6,{color:RED,w:5,head:18})+plate('外側：赤',cx+150,top-74,{size:44,color:RED}));
  s+=fade(b,arrow(cx,top+w+76,cx,top+w+8,{color:VIOLET,w:5,head:18})+plate('内側：紫',cx,top+w+112,{size:44,color:VIOLET,anchor:'middle'}));
  s+=note('虹の 幅は 大きく 誇張',40,895,{g:1});
  return s;},
 // 19 あなたの虹と隣の人の虹は別の雨粒
 [K+'two:eyes']:(p,ctx)=>{const a=swin(ctx,p,0,.05,.65),b=swin(ctx,p,1,.0,.6);
  let s=twoPeople({t:ctx.tg,lines:a,each:b});
  s+=fade(swin(ctx,p,0,.7,1),plate('別の 雨粒',785,300,{size:40,color:C.ink,anchor:'middle'}));
  s+=fade(swin(ctx,p,1,.5,.9),plate('見る人ごとに 一つずつ',40,800,{size:44,color:HC}));
  return s;},
 // 20 もう一本うすい虹
 [K+'next:double']:(p,ctx)=>{const g=vseg(ctx,p,.5,.9);
  return landscape({rain:1,t:ctx.tg,sec:g})+fade(seg(g,.4,1),plate('うすい 二本目',500,150,{size:40,color:'#c4cde0',anchor:'middle'}))+note('虹の 幅は 大きく 誇張',40,895);},
 // 22 赤の円は紫の円より一回り大きい → 外側が赤
 [K+'circles:two']:(p,ctx)=>{const cx=500,cy=470,sc=9,Rr=A_RED.theta*sc,Rv=A_VIO.theta*sc,a=vseg(ctx,p,.05,.3),b=vseg(ctx,p,.2,.42),c=vseg(ctx,p,.5,.72),d=vseg(ctx,p,.72,.95);
  let s=dot(cx,cy,10,HC)+label('太陽と 反対の 点',cx,cy+56,{size:36,color:HC,anchor:'middle'});
  s+=draw(circlePts(cx,cy,Rr,-Math.PI/2,1.5*Math.PI),a,{color:RED,w:7})+draw(circlePts(cx,cy,Rv,-Math.PI/2,1.5*Math.PI),b,{color:VIOLET,w:7});
  s+=fade(a*(1-d),plate('赤の円（約42°）',cx,cy-Rr-26,{size:40,color:RED,anchor:'middle'}))+fade(b*(1-d),plate('紫の円（約40°）',cx,cy-Rv+70,{size:40,color:VIOLET,anchor:'middle'}));
  s+=fade(c*(1-d),plate('赤の円が 一回り 大きい',cx,cy-120,{size:44,color:C.ink,anchor:'middle'}));
  s+=fade(d,rainbowBand(cx,cy,Rr+3,Rr-Rv+6,{a0:0,a1:2*Math.PI}));
  s+=fade(d,plate('外側：赤',cx,cy-Rr-26,{size:44,color:RED,anchor:'middle'})+plate('内側：紫',cx,cy-Rv+76,{size:44,color:VIOLET,anchor:'middle'}));
  return s;},
 // 25 色の並びが逆。間の空だけ暗い
 [K+'next:dark']:(p,ctx)=>{const a=swin(ctx,p,0,.3,.7),b=swin(ctx,p,0,.6,1),c=swin(ctx,p,1,.2,.7);
  const cy=LAND.hz+LAND.e*LAND.s,R1=A_RED.theta*LAND.s,R2=A2_VIO*LAND.s;
  let s=landscape({rain:1,t:ctx.tg,sec:1});
  s+=fade(c,`<clipPath id="d04dk"><rect width="${W}" height="${LAND.hz-2}"/></clipPath><g clip-path="url(#d04dk)"><circle cx="500" cy="${cy}" r="${n1(R1-34)}" fill="#e8eef8" fill-opacity=".12"/><path d="M0 0 H${W} V${LAND.hz} H0 Z M${n1(500-R2)} ${cy} A${n1(R2)} ${n1(R2)} 0 1 0 ${n1(500+R2)} ${cy} A${n1(R2)} ${n1(R2)} 0 1 0 ${n1(500-R2)} ${cy} Z" fill="#e8eef8" fill-opacity=".08" fill-rule="evenodd"/></g>`);
  s+=fade(a*(1-c),plate('一本目：外が 赤',500,cy-R1+110,{size:40,color:RED,anchor:'middle'}));
  s+=fade(b*(1-c),plate('二本目：外が 紫',500,cy-R2-34,{size:40,color:VIOLET,anchor:'middle'}));
  const q=[500-(R1+R2-34)/2*Math.cos(35*DEG),cy-(R1+R2-34)/2*Math.sin(35*DEG)];
  s+=fade(c,arrow(170,170,q[0]-6,q[1]-6,{color:HC,w:5,head:18})+plate('間の空が 暗い',40,140,{size:44,color:HC}));
  s+=note('虹の 幅は 大きく 誇張',40,895);
  return s;},
 // 26 なぜでしょうか？
 [K+'next:q']:(p,ctx)=>{const f=vseg(ctx,p,0,.5);
  const cy=LAND.hz+LAND.e*LAND.s,R1=A_RED.theta*LAND.s,R2=A2_VIO*LAND.s;
  let s=landscape({rain:1,t:ctx.tg,sec:1});
  s+=`<clipPath id="d04dk"><rect width="${W}" height="${LAND.hz-2}"/></clipPath><g clip-path="url(#d04dk)"><circle cx="500" cy="${cy}" r="${n1(R1-34)}" fill="#e8eef8" fill-opacity=".12"/><path d="M0 0 H${W} V${LAND.hz} H0 Z M${n1(500-R2)} ${cy} A${n1(R2)} ${n1(R2)} 0 1 0 ${n1(500+R2)} ${cy} A${n1(R2)} ${n1(R2)} 0 1 0 ${n1(500-R2)} ${cy} Z" fill="#e8eef8" fill-opacity=".08" fill-rule="evenodd"/></g>`;
  s+=finalCard(['二本目は、なぜ 色が逆？','間の空は、なぜ 暗い？'],f,{y:110,size:56});
  s+=bigQ(500,760,vseg(ctx,p,.3,.7),180);
  s+=note('虹の 幅は 大きく 誇張',40,895);
  return s;},
};
