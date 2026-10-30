// YouTube シリーズ「角運動量・上級 2/2」(ys-uc-angular-2) — 図。Stage 1200×515.
// 色：𝐫 水色、𝐯 紫、v⊥ 黄、𝐅 緑、𝐋 黄、掃く面積 黄の薄い塗り、太陽 金。真上から見た図（x 右、y 上、z 手前 ⊙）。
// 誇張した楕円（離心率 0.6）はケプラー方程式 M＝E−e sinE で動かす → 同じ時間の扇形は同じ面積。地球の軌道（e＝0.0167）は実寸の比。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';

const K='uc-angular-2:';
const CR=C.x,CV=C.v,CQ=C.hi,CL=C.hi,CN=C.p,CF=C.F,SUN='#ffcf67',AREA=C.hi;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const B=(c,n)=>cs(c,`\\mathbf{${n}}`);
const br=B(CR,'r'),bv=B(CV,'v'),bF=B(CF,'F'),bL=B(CL,'L'),bN=B(CN,'N'),bp=B(C.p,'p');
const vp=cs(CQ,'v_{\\perp}'),X='\\times ';
const top=(t='真上から見た図')=>label(t,30,40,{size:22,color:C.dim});
function outSym(x,y,r=22,color=CL,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
const sun=(x,y,r=22,lab=1)=>dot(x,y,r,SUN)+(lab?L('太陽',x,y+r+30,{size:22,color:SUN}):'');
const planet=(x,y,r=12,c=C.x)=>dot(x,y,r,c)+ring(x,y,r,{color:C.ink,w:2});
function rightMark(x,y,ux,uy,vx,vy,q=14,color=C.dim){return line(x+ux*q,y+uy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w:2})+line(x+vx*q,y+vy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w:2});}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function head(pts,color){const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1),H=15;
 return `<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-H*Math.cos(a)+H*.55*Math.sin(a)},${y2-H*Math.sin(a)-H*.55*Math.cos(a)} ${x2-H*Math.cos(a)-H*.55*Math.sin(a)},${y2-H*Math.sin(a)+H*.55*Math.cos(a)}" fill="${color}"/>`;}
function turnArc(cx,cy,r,a0,a1,{color=CL,w=4,g=1}={}){if(g<=0||Math.abs(a1-a0)<.03)return '';const pts=circPts(cx,cy,r,a0,a1,30);return fade(g,draw(pts,1,{color,w})+head(pts,color));}

// ---- exaggerated Kepler ellipse ---------------------------------------------------------------------------
function mkOrbit({cx=300,cy=280,a=230,e=.45}={}){
 const b=a*Math.sqrt(1-e*e),fx=cx+a*e,fy=cy;
 const Ean=t=>{const M=2*Math.PI*t;let E=M;for(let i=0;i<30;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E;};
 const pos=t=>{const E=Ean(t);return [cx+a*Math.cos(E),cy-b*Math.sin(E)];};
 const vel=(t,k=.36)=>{const E=Ean(t),d=1-e*Math.cos(E);return [k*(-a*Math.sin(E))/d,k*(-b*Math.cos(E))/d];};
 const path=(g=1,o={})=>fade(g,draw(Array.from({length:121},(_,i)=>{const u=2*Math.PI*i/120;return [cx+a*Math.cos(u),cy-b*Math.sin(u)];}),1,{color:C.faint,w:2,dash:'6 7',...o}));
 const wedge=(t0,t1,{fo=.35,color=AREA,g=1}={})=>{if(g<=0||t1<=t0)return '';const n=24,pts=[[fx,fy]];for(let i=0;i<=n;i++)pts.push(pos(t0+(t1-t0)*i/n));return fade(g,poly(pts,{fill:color,fo,stroke:color,sw:1.5}));};
 return {cx,cy,a,b,e,fx,fy,pos,vel,path,wedge};
}
const O=mkOrbit();
const OV=mkOrbit({cy:320,a:215}),KV=.55;
// arrow from planet toward sun of given length
function toSun(Ob,t,len=70,g=1,color=CF,off=14,side=0){const [x0,y0]=Ob.pos(t),dx=Ob.fx-x0,dy=Ob.fy-y0,l=Math.hypot(dx,dy),x=x0-dy/l*side,y=y0+dx/l*side;return fade(g,arrow(x+dx/l*off,y+dy/l*off,x+dx/l*(off+len),y+dy/l*(off+len),{color,w:5,head:14}));}
function rArrow(Ob,t,g=1,color=CR){const [x,y]=Ob.pos(t),dx=x-Ob.fx,dy=y-Ob.fy,l=Math.hypot(dx,dy);return fade(g,arrow(Ob.fx+dx/l*24,Ob.fy+dy/l*24,x-dx/l*14,y-dy/l*14,{color,w:5,head:14}));}
function vArrow(Ob,t,g=1,k=.36){const [x,y]=Ob.pos(t),[vx,vy]=Ob.vel(t,k);return fade(g,arrow(x,y,x+vx,y+vy,{color:CV,w:5,head:14}));}
function orbitBase(Ob,t,{path=1,pl=1,sunLab=1}={}){let s=Ob.path(path)+sun(Ob.fx,Ob.fy,20,sunLab);if(pl){const [x,y]=Ob.pos(t);s+=planet(x,y);}return s;}
// split velocity into radial and perpendicular parts at time t
function vSplit(Ob,t,{g=1,k=.36,labels=1}={}){
 const [x,y]=Ob.pos(t),[vx,vy]=Ob.vel(t,k),dx=x-Ob.fx,dy=y-Ob.fy,l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l;
 const vr=vx*ux+vy*uy,px=vx-vr*ux,py=vy-vr*uy;
 return fade(g,arrow(x,y,x+vr*ux,y+vr*uy,{color:CV,w:3,head:11,opacity:.6})+arrow(x,y,x+px,y+py,{color:CQ,w:6,head:15})
  +line(x+vr*ux,y+vr*uy,x+vx,y+vy,{color:C.faint,w:2,dash:'5 5'})+line(x+px,y+py,x+vx,y+vy,{color:C.faint,w:2,dash:'5 5'})
  +rightMark(x,y,ux,uy,px/Math.hypot(px,py),py/Math.hypot(px,py),12,C.dim)
  +(labels?T(vp,x+px*1.05+(px<0?-8:8),y+py*1.05-6,{size:30,anchor:px<0?'end':'start'}):''));
}

// ---- Earth orbit to scale ------------------------------------------------------------------------------------
const EO=mkOrbit({cx:300,cy:265,a:195,e:.0167});

function compFig(p,stage){
  const ox=150,oy=440,k=70;
  let s=top()+fade(.7,arrow(ox-20,oy,ox+330,oy,{color:C.faint,w:2,head:12})+arrow(ox,oy+20,ox,oy-345,{color:C.faint,w:2,head:12})+label('x',ox+338,oy+8,{size:22,color:C.dim})+label('y',ox+12,oy-335,{size:22,color:C.dim}));
  s+=sun(ox,oy,16,0)+L('太陽',ox-30,oy+34,{size:22,color:SUN});
  const px=ox+3*k,py=oy-4*k;
  s+=arrow(ox+10,oy-13,px-9,py+12,{color:CR,w:5,head:14})+T(br,ox+3*k/2-30,oy-4*k/2-10,{size:30,anchor:'end'})+planet(px,py,11);
  s+=fade(stage?1:seg(p,.3,.45),arrow(px+6,py+18,px+6-3*22,py+18+4*22,{color:CF,w:6,head:15})+T(bF,px+10,py+80,{size:30,anchor:'start'}));
  s+=L('(3, 4)',px+50,py-10,{size:22,color:CR});
  s+=card(560,60,600,400,T(`${br}=(3,\\ 4,\\ 0)`,860,115,{size:34})+T(`${bF}=(-3k,\\ -4k,\\ 0)`,860,175,{size:34})+L('k は 正の 数（𝐅 ＝ −k𝐫）',860,222,{size:22,color:C.dim})
   +fade(stage?seg(p,.05,.2):0,T(`z:\\ 3\\times(-4k)-4\\times(-3k)`,860,290,{size:34}))
   +fade(stage?seg(p,.35,.5):0,T(`=-12k+12k=0`,860,350,{size:36}))
   +fade(stage?seg(p,.65,.8):0,L('x、y 成分も 0（z 成分が どちらも 0）',860,420,{size:22,color:C.dim})),stage?1:seg(p,.02,.12));
  return s;
 }

export const ytUcAngular2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const t=.55+.5*p;
  let s=top()+orbitBase(O,t)+toSun(O,t,60,seg(p,.2,.35));
  s+=card(680,90,480,320,L('前回の 最後の 問い',920,140,{size:24,color:C.dim})
   +L('太陽の 引力 だけ',920,215,{size:32,weight:700})
   +fade(seg(p,.35,.5),L('何が 一定？',920,300,{size:40,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=card(150,40,900,210,L('1/2 で 導いた',600,82,{size:24,color:C.dim})+T(`\\dfrac{d${bL}}{dt}=${bN}`,600,185,{size:54}),seg(p,0,.1));
  s+=fade(seg(p,.5,.65),T(`${bN}=\\mathbf{0}\\ \\ \\Rightarrow`,520,340,{size:50})+L('𝐋 は 一定',760,352,{size:40,color:CL,weight:700}));
  return s;
 },
 [K+'goal']:(p)=>{
  const t=.05+.9*p;
  let s=top()+orbitBase(O,t);
  s+=O.wedge(-.04,.04,{g:seg(p,.4,.55)})+O.wedge(.46,.54,{g:seg(p,.55,.7)});
  s+=card(680,90,480,320,L('今回 導くこと',920,140,{size:24,color:C.dim})
   +L('引力が 太陽を 向く',920,205,{size:30,weight:700})+L('→ トルク 0',920,255,{size:30,color:CN,weight:700})
   +fade(seg(p,.4,.55),L('同じ 時間に',920,325,{size:30,color:AREA,weight:700})+L('同じ 面積を 掃く',920,375,{size:30,color:AREA,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'predict']:(p)=>{
  const t=.6+.8*p;
  let s=top()+orbitBase(O,t);
  const [nx,ny]=O.pos(0),[fx,fy]=O.pos(.5);
  s+=fade(seg(p,.1,.25),ring(nx,ny,20,{color:C.hi,w:3})+L('近い 点',nx+10,ny-36,{size:24,color:C.hi,weight:700})+ring(fx,fy,20,{color:C.hi,w:3})+L('遠い 点',fx,fy-36,{size:24,color:C.hi,weight:700}));
  s+=card(680,110,480,290,L('楕円の 軌道',920,165,{size:26,color:C.dim})+L('近い 点 と 遠い 点',920,230,{size:30,weight:700})
   +fade(seg(p,.3,.45),L('どちらが 速い？',920,310,{size:38,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 // ===== S2 中心力のトルクは0 =====
 [K+'central']:(p)=>{
  let s=top()+orbitBase(O,0,{pl:0});
  [.08,.3,.5,.72].forEach((t,i)=>{const g=seg(p,.08+i*.1,.18+i*.1);const [x,y]=O.pos(t);s+=fade(g,planet(x,y,10))+toSun(O,t,60,g);});
  s+=card(680,90,480,320,L('中心力',920,145,{size:34,color:CF,weight:700})
   +L('いつも 決まった 1点を 向く 力',920,210,{size:26})
   +fade(seg(p,.5,.65),L('太陽の 引力',920,290,{size:30,weight:700})+L('→ いつも 太陽の 中心へ',920,340,{size:28,color:CF})),seg(p,.02,.12));
  return s;
 },
 [K+'base']:(p)=>{
  const t=.3;
  let s=top()+orbitBase(O,t)+L('基準点',O.fx,O.fy-34,{size:22,color:C.ink});
  const [x,y]=O.pos(t);
  s+=rArrow(O,t,seg(p,.1,.25))+fade(seg(p,.1,.25),T(br,(x+O.fx)/2-14,(y+O.fy)/2+34,{size:32,anchor:'end'}));
  s+=toSun(O,t,90,seg(p,.5,.65),CF,14,16)+fade(seg(p,.5,.65),T(bF,x+40,y-6,{size:32,anchor:'start'}));
  s+=card(680,110,480,290,L('基準点 ＝ 太陽',920,165,{size:30,color:SUN,weight:700})
   +fade(seg(p,.1,.25),L('𝐫：太陽 → 惑星',920,240,{size:28,color:CR,weight:700}))
   +fade(seg(p,.5,.65),L('𝐅：その 逆向き',920,310,{size:28,color:CF,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'sin']:(p)=>{
  const t=.62;let s=top()+orbitBase(O,t);
  const [x,y]=O.pos(t),dx=x-O.fx,dy=y-O.fy,a=Math.atan2(-dy,dx);
  const l0=Math.hypot(dx,dy),nx=-dy/l0,ny=dx/l0,sg=ny>0?1:-1;
  s+=rArrow(O,t)+toSun(O,t,90);
  s+=fade(seg(p,.05,.2),line(x,y,x+dx/l0*80,y+dy/l0*80,{color:CR,w:2,dash:'6 6'})+draw(circPts(x,y,36,a,a+Math.PI*sg,24),1,{color:C.E,w:3})+L('180°',x+nx*sg*62,y+ny*sg*62+8,{size:24,color:C.E,weight:700}));
  s+=card(680,90,480,330,L('𝐫 と 𝐅 の 間の 角',920,140,{size:26,color:C.dim})+L('180°',920,195,{size:34,color:C.E,weight:700})
   +fade(seg(p,.3,.45),T(`\\sin 180^\\circ=0`,920,265,{size:40}))
   +fade(seg(p,.6,.75),T(`N=rF\\sin 180^\\circ=0`,920,350,{size:38})),seg(p,.02,.12));
  return s;
 },
 [K+'comp']:(p)=>compFig(p,0),
 [K+'comp2']:(p)=>compFig(p,1),
 [K+'notzero']:(p)=>{
  const t=.1+.55*p;
  let s=top()+orbitBase(O,t)+toSun(O,t,70)+rArrow(O,t,.6)+vArrow(O,t,.9);
  s+=card(680,110,480,290,L('力 ≠ 0',920,170,{size:34,color:CF,weight:700})+L('曲がり、速さも 変わる',920,230,{size:26})
   +fade(seg(p,.5,.65),L('太陽の まわりの トルク ＝ 0',920,320,{size:30,color:CN,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'other']:(p)=>{
  const t=.3;let s=top()+orbitBase(O,t);
  const [x,y]=O.pos(t),P=[O.cx-120,O.cy+120];
  s+=toSun(O,t,90);
  s+=fade(seg(p,.1,.25),ring(P[0],P[1],9,{color:C.ink,w:3,fill:C.bg})+L('ずらした 基準点',P[0],P[1]+36,{size:22})+arrow(P[0]+8,P[1]-8,x-8,y+10,{color:CR,w:5,head:14})+T(`${br}'`,(P[0]+x)/2-26,(P[1]+y)/2,{size:30,anchor:'end'}));
  s+=fade(seg(p,.45,.6),turnArc(P[0],P[1],70,1.05,.55,{color:CN,w:4})+L('回す 働き あり',P[0]+110,P[1]-10,{size:22,color:CN,anchor:'start'}));
  s+=card(680,110,480,290,L('基準点を ずらすと',920,165,{size:28,color:C.dim})
   +L('𝐫′ と 𝐅 は 平行で ない',920,235,{size:28,weight:700})
   +fade(seg(p,.45,.6),L('トルク ≠ 0',920,315,{size:34,color:CN,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'Lconst']:(p)=>{
  const t=.2+.6*p;
  let s=top()+orbitBase(O,t,{sunLab:0})+rArrow(O,t,.6)+vArrow(O,t,.8);
  s+=outSym(O.fx,O.fy+56,20,CL)+T(bL,O.fx+34,O.fy+66,{size:28,anchor:'start'});
  s+=card(680,110,480,290,L('太陽の まわり',920,165,{size:26,color:C.dim})+T(`${bL}`,880,240,{size:48})+L('一定',960,252,{size:36,color:CL,weight:700})
   +fade(seg(p,.35,.5),L('向きも 大きさも',920,330,{size:28,weight:700})),seg(p,.02,.12),CL);
  return s;
 },
 [K+'plane']:(p)=>{
  // oblique view of the orbital plane, 𝐋 standing up
  const cx=320,cy=320,a=230,b=70,e=.6,fx=cx+a*e,fy=cy;
  let s=label('斜めから見た図',30,40,{size:22,color:C.dim});
  s+=poly([[cx-300,cy+20],[cx+180,cy+110],[cx+330,cy-20],[cx-150,cy-110]],{fill:C.x,fo:.08,stroke:C.faint,sw:2});
  s+=draw(Array.from({length:121},(_,i)=>{const u=2*Math.PI*i/120;return [cx+a*Math.cos(u),cy-b*Math.sin(u)];}),1,{color:C.dim,w:2,dash:'6 6'});
  const u=2*Math.PI*(.2+.7*p);s+=planet(cx+a*Math.cos(u),cy-b*Math.sin(u),10);
  s+=dot(fx,fy,16,SUN);
  s+=fade(seg(p,.1,.25),arrow(fx,fy-18,fx,fy-210,{color:CL,w:6,head:16})+T(bL,fx+16,fy-190,{size:32,anchor:'start'}));
  s+=fade(seg(p,.4,.55),L('𝐋 に 垂直な 平面',cx-150,cy+80,{size:24,color:C.x,weight:700}));
  s+=card(720,110,440,290,L('𝐋 ⊥ 𝐫、𝐋 ⊥ 𝐯',940,170,{size:30,weight:700})
   +fade(seg(p,.4,.55),L('𝐋 の 向きが 一定',940,245,{size:28,color:CL,weight:700})+L('→ 1つの 平面の 中',940,305,{size:28,weight:700})),seg(p,.02,.12));
  return s;
 },
 // ===== S3 楕円では mr v⊥ =====
 [K+'size']:(p)=>{
  const t=.2;let s=top()+orbitBase(OV,t)+rArrow(OV,t)+vArrow(OV,t,1,KV);
  const [x,y]=OV.pos(t),dx=x-OV.fx,dy=y-OV.fy,a0=Math.atan2(-dy,dx),[vx,vy]=OV.vel(t,KV);let a1=Math.atan2(-vy,vx);while(a1-a0>Math.PI)a1-=2*Math.PI;while(a1-a0<-Math.PI)a1+=2*Math.PI;
  s+=line(x,y,x+dx/Math.hypot(dx,dy)*80,y+dy/Math.hypot(dx,dy)*80,{color:CR,w:2,dash:'6 6'});
  s+=fade(seg(p,.4,.55),draw(circPts(x,y,40,a0,a1,20),1,{color:C.E,w:3})+L('θ',x+40*Math.cos((a0+a1)/2)+12,y-40*Math.sin((a0+a1)/2)-6,{size:26,color:C.E,weight:700}));
  s+=card(680,110,480,290,T(`L=mrv\\sin\\theta`,920,190,{size:46})+fade(seg(p,.4,.55),L('θ：𝐫 と 𝐯 の 間の 角',920,290,{size:28,color:C.E,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'vperp']:(p)=>{
  const t=.2;let s=top()+orbitBase(OV,t)+rArrow(OV,t)+vArrow(OV,t,.5,KV)+vSplit(OV,t,{g:seg(p,.1,.3),k:KV});
  s+=card(680,110,480,290,T(`v\\sin\\theta=${vp}`,920,180,{size:44})+L('𝐫 に 直角な 速度の 成分',920,240,{size:24,color:CQ})
   +fade(seg(p,.5,.65),T(`L=mr\\,${vp}`,920,330,{size:48})),seg(p,.02,.12));
  return s;
 },
 [K+'circle']:(p)=>{
  const cx=300,cy=265,R=170,u=.4+1.2*p,x=cx+R*Math.cos(u),y=cy-R*Math.sin(u);
  let s=top()+ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'})+sun(cx,cy,20,0);
  s+=arrow(cx+22*Math.cos(u),cy-22*Math.sin(u),x-14*Math.cos(u),y+14*Math.sin(u),{color:CR,w:5,head:14});
  s+=arrow(x,y,x-90*Math.sin(u),y-90*Math.cos(u),{color:CV,w:5,head:14})+rightMark(x,y,-Math.cos(u),Math.sin(u),-Math.sin(u),-Math.cos(u),14,C.hi)+planet(x,y);
  s+=card(680,110,480,290,L('円の 軌道',920,160,{size:28,color:C.dim})+L('𝐯 ⊥ 𝐫 いつも',920,220,{size:30,weight:700})
   +T(`L=mrv`,920,295,{size:44})+fade(seg(p,.5,.65),L('r 一定 → 速さも 一定',920,365,{size:26,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'ellipse']:(p)=>{
  const t=.2;let s=top()+orbitBase(OV,t)+rArrow(OV,t)+vArrow(OV,t,.5,KV)+vSplit(OV,t,{g:1,k:KV});
  s+=card(680,110,480,290,L('楕円の 軌道',920,160,{size:28,color:C.dim})+L('𝐯 は 𝐫 に 直角とは 限らない',920,215,{size:26,weight:700})
   +fade(seg(p,.4,.55),T(`m r v`,820,300,{size:40})+line(770,315,870,280,{color:C.a,w:4})+L('→',900,310,{size:30})+T(`m r\\,${vp}`,1010,300,{size:40}))
   +fade(seg(p,.6,.75),L('一定 なのは こちら',1010,365,{size:22,color:CQ,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'ends']:(p)=>{
  let s=top()+orbitBase(O,0,{pl:0});
  [[0,'近い 点'],[.5,'遠い 点']].forEach(([t,n],i)=>{const g=seg(p,.1+i*.25,.25+i*.25);const [x,y]=O.pos(t),[vx,vy]=O.vel(t);
   s+=fade(g,rArrow(O,t,1)+arrow(x,y,x+vx,y+vy,{color:CV,w:5,head:14})+rightMark(x,y,i?1:-1,0,0,i?1:-1,14,C.hi)+planet(x,y)+L(n,x+(i?-10:20),y+(i?60:70),{size:22,color:C.hi,weight:700}));});
  s+=card(680,110,480,290,L('近い 点・遠い 点',920,165,{size:28,color:C.dim})+L('𝐯 ⊥ 𝐫',920,235,{size:36,weight:700})
   +fade(seg(p,.55,.7),T(`${vp}=v`,920,320,{size:44})),seg(p,.02,.12));
  return s;
 },
 [K+'answer']:(p)=>{
  let s=top()+orbitBase(O,0,{pl:0});
  [0,.5].forEach((t,i)=>{const [x,y]=O.pos(t),[vx,vy]=O.vel(t);s+=rArrow(O,t,1)+arrow(x,y,x+vx,y+vy,{color:CV,w:6,head:15})+planet(x,y);});
  const [nx,ny]=O.pos(0),[fx,fy]=O.pos(.5);
  s+=L('r 小',(nx+O.fx)/2,ny+30,{size:22,color:CR})+L('r 大',(fx+O.fx)/2,fy+30,{size:22,color:CR});
  s+=card(680,90,480,330,L('近い 点',830,150,{size:24,color:C.dim})+L('遠い 点',1010,150,{size:24,color:C.dim})
   +T(`r\\,v`,830,205,{size:40})+L('＝',920,215,{size:34})+T(`r\\,v`,1010,205,{size:40})
   +fade(seg(p,.4,.55),L('r が 小さい → v が 大きい',920,290,{size:28,weight:700}))
   +fade(seg(p,.6,.75),L('近い 点の ほうが 速い',920,365,{size:34,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 // ===== S4 面積速度 =====
 [K+'sweep']:(p)=>{
  const t0=.12,t1=t0+.05*seg(p,.2,.8);
  let s=top()+orbitBase(O,t1)+O.wedge(t0,t1,{fo:.45});
  const [x,y]=O.pos(t0);s+=fade(.5,planet(x,y,9));
  s+=card(680,110,480,290,L('短い 時間 dt に',920,170,{size:28,color:C.t,weight:700})+L('太陽と 惑星を 結ぶ 線が',920,230,{size:26})
   +fade(seg(p,.4,.55),L('掃く 面積 dA',920,310,{size:34,color:AREA,weight:700})),seg(p,.02,.12));
  return s;
 },
 // zoomed triangle: sun S, planet P, P + v dt
 [K+'tri']:(p)=>tri(p,0),
 [K+'bh']:(p)=>tri(p,1),
 [K+'area']:(p)=>{
  let s=tri(1,2,true);
  s+=card(680,90,480,330,L('三角形 ＝ ½ × 底辺 × 高さ',920,145,{size:26,color:C.dim})
   +fade(seg(p,.2,.35),T(`dA=\\tfrac12\\times r\\times ${vp}\\,dt`,920,240,{size:40}))
   +fade(seg(p,.55,.7),T(`dA=\\tfrac12\\,r\\,${vp}\\,dt`,920,340,{size:46})),seg(p,.02,.12));
  return s;
 },
 [K+'rate']:(p)=>{
  let s=T(`dA=\\tfrac12\\,r\\,${vp}\\,dt`,600,100,{size:46});
  s+=fade(seg(p,.1,.25),L('両辺を dt で 割る',600,180,{size:28,color:C.t,weight:700}));
  const e=`\\dfrac{dA}{dt}=\\tfrac12\\,r\\,${vp}`,w=texWidth(e,58,false);
  s+=fade(seg(p,.3,.45),T(e,600,300,{size:58}));
  s+=fade(seg(p,.6,.75),L('面積速度（1秒 あたりに 掃く 面積）',600,430,{size:30,color:AREA,weight:700}));
  return s;
 },
 [K+'Lm']:(p)=>{
  let s=T(`L=mr\\,${vp}`,600,90,{size:44});
  s+=fade(seg(p,.15,.3),T(`r\\,${vp}=\\dfrac{L}{m}`,600,200,{size:48}));
  const e=`\\dfrac{dA}{dt}=\\tfrac12\\,r\\,${vp}=\\dfrac{L}{2m}`,w=texWidth(e,58,false);
  s+=fade(seg(p,.5,.65),T(e,600,360,{size:58})+highlight(600-w/2-24,280,w+48,160,seg(p,.7,.85)));
  return s;
 },
 [K+'const']:(p)=>{
  const t=.0+1.0*p;
  let s=top()+orbitBase(O,t);
  const n=8,dt=.04;
  for(let i=0;i<n;i++){const t0=i/n-dt/2;const g=seg(p,i/n*.9,i/n*.9+.08);s+=O.wedge(t0,t0+dt,{fo:.4,g});}
  s+=card(680,80,480,350,L('L も m も 一定',920,122,{size:26,color:C.dim})+T(`\\dfrac{dA}{dt}=\\dfrac{L}{2m}`,900,215,{size:44})+L('一定',1060,225,{size:30,color:CL,weight:700})
   +fade(seg(p,.4,.55),L('同じ 時間 → 同じ 面積',920,310,{size:28,color:AREA,weight:700}))
   +fade(seg(p,.6,.75),L('ケプラーの 第2法則',920,375,{size:32,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'shapes']:(p)=>{
  let s=top()+orbitBase(O,0,{pl:0});
  s+=O.wedge(-.03,.03,{fo:.5,g:seg(p,.05,.2)})+O.wedge(.47,.53,{fo:.5,g:seg(p,.3,.45)});
  const [nx,ny]=O.pos(0),[fx,fy]=O.pos(.5);
  s+=fade(seg(p,.05,.2),L('短く 幅広い',nx-30,ny+120,{size:22,color:AREA,weight:700}))+fade(seg(p,.3,.45),L('長く 細い',fx+80,fy-40,{size:22,color:AREA,weight:700}));
  s+=card(680,110,480,290,L('同じ 時間 dt の 三角形',920,165,{size:26,color:C.dim})+L('形は 違う',920,235,{size:30,weight:700})
   +fade(seg(p,.55,.7),L('面積は 同じ',920,315,{size:38,color:AREA,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'any']:(p)=>{
  let s=card(150,50,900,190,L('使ったこと',600,100,{size:26,color:C.dim})+L('力が 中心を 向く（𝐍 ＝ 0）',600,175,{size:36,color:CF,weight:700}),seg(p,0,.1),CF);
  s+=fade(seg(p,.3,.45),card(150,280,900,180,L('使っていないこと',600,330,{size:26,color:C.dim})+L('力の 大きさが 距離で どう 変わるか',600,400,{size:32,color:C.ink,weight:700}),1));
  return s;
 },
 [K+'notyet']:(p)=>{
  let s=card(150,50,900,190,L('面積速度 一定',600,105,{size:30,color:AREA,weight:700})+L('中心力 なら いつも',600,175,{size:28}),seg(p,0,.1));
  s+=fade(seg(p,.2,.35),card(150,280,900,180,L('軌道が 楕円に なる こと',600,325,{size:30,weight:700})+L('引力 ∝ 1／距離² が 必要 → 慣性力と軌道・上級',600,400,{size:28,color:C.hi,weight:700}),1,C.hi));
  return s;
 },
 // ===== S5 地球で確かめる =====
 [K+'earth']:(p)=>{
  let s=label('地球の 軌道（実際の 比で 描くと ほぼ 円）',30,40,{size:22,color:C.dim})+EO.path(1)+sun(EO.fx,EO.fy,16,0);
  const [x,y]=EO.pos(0);s+=planet(x,y,11)+L('近い 点',x+10,y+50,{size:22,color:C.hi,weight:700});
  s+=fade(seg(p,.2,.35),arrow(EO.fx+18,EO.fy,x-13,y,{color:CR,w:4,head:12}))+fade(seg(p,.5,.65),arrow(x,y-14,x,y-120,{color:CV,w:5,head:14}));
  s+=card(620,90,540,330,L('太陽に 一番 近い とき',890,140,{size:26,color:C.dim})
   +fade(seg(p,.2,.35),T(`r=1.471\\times 10^{11}\\ \\mathrm{m}`,890,225,{size:40}))
   +fade(seg(p,.5,.65),T(`v=30.29\\ \\mathrm{km/s}`,890,320,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'far']:(p)=>{
  let s=label('地球の 軌道（実際の 比で 描くと ほぼ 円）',30,40,{size:22,color:C.dim})+EO.path(1)+sun(EO.fx,EO.fy,16,0);
  [[0,'近い 点',1],[.5,'遠い 点',-1]].forEach(([t,n,sg],i)=>{const [x,y]=EO.pos(t),g=i?seg(p,.05,.2):1;
   s+=fade(g,planet(x,y,11)+L(n,x+sg*10,y+50,{size:22,color:C.hi,weight:700})+arrow(EO.fx+sg*18,EO.fy,x+sg*-13,y,{color:CR,w:4,head:12})+arrow(x,y-sg*14,x,y-sg*(i?110:120),{color:CV,w:5,head:14})+rightMark(x,y,-sg,0,0,-sg,13,C.hi));});
  s+=card(620,90,540,330,L('太陽から 一番 遠い とき',890,140,{size:26,color:C.dim})
   +T(`r=1.521\\times 10^{11}\\ \\mathrm{m}`,890,225,{size:40})
   +fade(seg(p,.5,.65),L('どちらも 𝐯 ⊥ 𝐫',890,320,{size:32,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=L('r × v が 等しい',600,70,{size:30,color:C.hi,weight:700});
  s+=T(`1.471\\times 30.29=1.521\\times v`,600,170,{size:44});
  s+=fade(seg(p,.3,.45),T(`v=30.29\\times 1.471\\div 1.521`,600,290,{size:44}));
  s+=fade(seg(p,.6,.75),T(`\\approx 29.29\\ \\mathrm{km/s}`,600,410,{size:52}));
  return s;
 },
 [K+'data']:(p)=>{
  let s=card(150,60,900,150,L('r × v から 出した 値',600,105,{size:24,color:C.dim})+T(`29.29\\ \\mathrm{km/s}`,600,170,{size:44}),seg(p,0,.1));
  s+=fade(seg(p,.3,.45),card(150,260,900,150,L('観測から 求めた 遠い 点の 速さ',600,305,{size:24,color:C.dim})+T(`29.29\\ \\mathrm{km/s}`,600,370,{size:44})+L('一致',930,382,{size:34,color:CF,weight:700}),1,CF));
  return s;
 },
 [K+'hrate']:(p)=>{
  let s=L('近い 点で（v⊥ ＝ v）',600,70,{size:28,color:C.dim});
  s+=T(`\\dfrac{dA}{dt}=\\tfrac12\\,r\\,v`,600,170,{size:46});
  s+=fade(seg(p,.25,.4),T(`=\\tfrac12\\times 1.471\\times 10^{11}\\times 30290`,600,290,{size:42}));
  s+=fade(seg(p,.6,.75),T(`\\approx 2.23\\times 10^{15}\\ \\mathrm{m^2/s}`,600,410,{size:48}));
  return s;
 },
 [K+'ell']:(p)=>{
  let s=label('1周で 掃く 面積 ＝ 楕円の 面積',30,40,{size:22,color:C.dim})+fade(.9,EO.wedge(0,.999,{fo:.25}))+EO.path(1)+sun(EO.fx,EO.fy,16,0);
  s+=fade(seg(p,.2,.35),line(EO.cx-EO.a,EO.cy,EO.cx,EO.cy,{color:C.x,w:3})+L('a',EO.cx-EO.a/2,EO.cy-12,{size:26,color:C.x,weight:700})+line(EO.cx,EO.cy,EO.cx,EO.cy-EO.b,{color:C.v,w:3})+L('b',EO.cx+18,EO.cy-EO.b/2,{size:26,color:C.v,weight:700}));
  s+=card(620,90,540,330,L('長半径 a・短半径 b',890,140,{size:26,color:C.dim})
   +fade(seg(p,.2,.35),T(`a\\approx b\\approx 1.496\\times 10^{11}\\ \\mathrm{m}`,890,220,{size:34}))
   +fade(seg(p,.55,.7),T(`\\pi ab\\approx 7.03\\times 10^{22}\\ \\mathrm{m^2}`,890,320,{size:38})),seg(p,.02,.12));
  return s;
 },
 [K+'year']:(p)=>{
  let s=L('1年 ＝ 約 3.156 × 10⁷ s',600,70,{size:30,color:C.t,weight:700});
  s+=T(`\\dfrac{7.03\\times 10^{22}}{3.156\\times 10^{7}}\\approx 2.23\\times 10^{15}\\ \\mathrm{m^2/s}`,600,200,{size:46});
  s+=fade(seg(p,.4,.55),card(200,310,800,150,L('近い 点で 出した 面積速度',600,355,{size:24,color:C.dim})+T(`2.23\\times 10^{15}\\ \\mathrm{m^2/s}`,600,420,{size:40})+L('一致',900,430,{size:34,color:CF,weight:700}),1,CF));
  return s;
 },
 [K+'jan']:(p)=>{
  const t=-.12+.24*p;
  let s=label('地球の 軌道（真上から）',30,40,{size:22,color:C.dim})+EO.path(1)+sun(EO.fx,EO.fy,16,0);
  const [x,y]=EO.pos(t),[nx,ny]=EO.pos(0);
  s+=fade(seg(p,.1,.25),ring(nx,ny,20,{color:C.hi,w:3})+L('1月 初め',nx+30,ny+8,{size:24,color:C.hi,weight:700,anchor:'start'}));
  s+=planet(x,y,11);
  s+=card(680,110,480,290,L('一番 近い ＝ 1月の 初め',920,170,{size:28,weight:700})
   +fade(seg(p,.4,.55),L('北半球の 冬',920,250,{size:28,color:C.x,weight:700})+L('一番 速く 公転',920,310,{size:30,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'energy']:(p)=>{
  let s=card(150,50,900,150,L('位置エネルギー・上級',600,95,{size:24,color:C.dim})+T(`K+U`,600,160,{size:44})+L('一定',800,170,{size:30,color:C.E,weight:700}),seg(p,0,.1));
  s+=fade(seg(p,.3,.45),card(150,240,420,220,L('近い 点',360,285,{size:28,weight:700})+L('U が 低い',360,350,{size:28,color:C.E})+L('→ K が 大きい',360,410,{size:30,color:C.hi,weight:700}),1));
  s+=fade(seg(p,.45,.6),card(630,240,420,220,L('遠い 点',840,285,{size:28,weight:700})+L('U が 高い',840,350,{size:28,color:C.E})+L('→ K が 小さい',840,410,{size:30,color:C.dim,weight:700}),1));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  const t=.2+.5*p;
  let s=top()+orbitBase(O,t,{sunLab:0})+toSun(O,t,60)+outSym(O.fx,O.fy+56,20,CL);
  s+=card(680,90,480,330,L('中心力',920,140,{size:30,color:CF,weight:700})
   +L('中心の まわりの トルク ＝ 0',920,200,{size:26})
   +fade(seg(p,.2,.35),L('→ 𝐋 一定',920,265,{size:32,color:CL,weight:700}))
   +fade(seg(p,.5,.65),L('向き 一定 → 1つの 平面',920,340,{size:28,weight:700})),seg(p,.02,.12),CF);
  return s;
 },
 [K+'sum2']:(p)=>{
  const t=p;
  let s=top()+orbitBase(O,t)+O.wedge(-.03,.03,{fo:.4})+O.wedge(.47,.53,{fo:.4});
  s+=card(680,90,480,330,T(`m r\\,${vp}`,920,150,{size:40})+L('一定',1050,160,{size:28,color:CL,weight:700})
   +fade(seg(p,.2,.35),T(`\\dfrac{dA}{dt}=\\dfrac{L}{2m}`,920,245,{size:40})+L('一定',1060,255,{size:28,color:CL,weight:700}))
   +fade(seg(p,.5,.65),L('近い 所ほど 速く、遠い 所ほど 遅い',920,355,{size:24,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'bridge']:(p)=>{
  const t=.3+.3*p;
  let s=fade(1-seg(p,.4,.7),orbitBase(O,t,{sunLab:0}));
  const g=seg(p,.4,.7),px=600,py=60,l=300,ang=.35*Math.sin(2*Math.PI*1.2*p);
  s+=fade(g,line(px-80,py,px+80,py,{color:C.dim,w:4})+line(px,py,px+l*Math.sin(ang),py+l*Math.cos(ang),{color:C.ink,w:3})+dot(px+l*Math.sin(ang),py+l*Math.cos(ang),20,C.x));
  s+=fade(seg(p,.1,.25),L('回転',220,470,{size:32,color:CL,weight:700}))+fade(seg(p,.5,.65),L('→ 振動',900,470,{size:32,color:C.x,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  const px=300,py=60,l=320,ang=.4*Math.exp(-.6*p)*Math.sin(2*Math.PI*1.5*p);
  let s=line(px-90,py,px+90,py,{color:C.dim,w:4})+line(px,py,px+l*Math.sin(ang),py+l*Math.cos(ang),{color:C.ink,w:3})+dot(px+l*Math.sin(ang),py+l*Math.cos(ang),20,C.x);
  s+=fade(seg(p,.1,.25),label('糸の力',px+l*Math.sin(ang)*.5+16,py+l*.5,{size:22,color:C.dim}));
  s+=card(620,70,540,380,L('次の 問い（単振動・上級）',890,120,{size:24,color:C.dim})
   +L('振り子で 重力の 値を 測る',890,190,{size:28,weight:700})+L('糸の 力を 出す',890,245,{size:28,weight:700})
   +fade(seg(p,.3,.45),L('抵抗・周期的な 外力が 加わると',890,320,{size:26})+L('振動は どう 変わる？',890,385,{size:34,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
};

// zoomed sweep triangle. mode 0: sides 𝐫 and 𝐯dt ; 1: base r and height v⊥dt ; 2: area fill
function tri(p,mode,still=false){
 const S=[110,420],P=[470,300],ang=-1.15,vl=190; // v dt direction (screen) relative
 const dx=P[0]-S[0],dy=P[1]-S[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l;
 const Q=[P[0]+vl*Math.cos(ang),P[1]+vl*Math.sin(ang)];
 // perpendicular component of PQ to SP
 const qx=Q[0]-P[0],qy=Q[1]-P[1],along=qx*ux+qy*uy,H=[P[0]+along*ux,P[1]+along*uy];
 let s=label('dt の 間を 拡大',30,40,{size:22,color:C.dim});
 s+=poly([S,P,Q],{fill:AREA,fo:mode===2?.4:.18,stroke:'none'});
 s+=sun(S[0],S[1],18,0)+L('太陽',S[0],S[1]+48,{size:22,color:SUN});
 s+=arrow(S[0]+20*ux,S[1]+20*uy,P[0]-12*ux,P[1]-12*uy,{color:CR,w:5,head:14})+T(mode?'r':br,(S[0]+P[0])/2+6,(S[1]+P[1])/2+40,{size:32});
 s+=line(S[0],S[1],Q[0],Q[1],{color:C.faint,w:2,dash:'6 6'});
 s+=arrow(P[0],P[1],Q[0],Q[1],{color:CV,w:5,head:14})+T(`${bv}\\,dt`,Q[0]+14,Q[1]+30,{size:30,anchor:'start'});
 s+=planet(P[0],P[1],10)+fade(.6,planet(Q[0],Q[1],8));
 if(mode>=1){const g=still?1:seg(p,.1,.3);
  s+=fade(g,line(P[0],P[1],P[0]+ux*(along+40),P[1]+uy*(along+40),{color:CR,w:2,dash:'6 6'})
   +line(Q[0],Q[1],H[0],H[1],{color:CQ,w:5})+rightMark(H[0],H[1],-ux,-uy,(Q[0]-H[0])/Math.hypot(Q[0]-H[0],Q[1]-H[1]),(Q[1]-H[1])/Math.hypot(Q[0]-H[0],Q[1]-H[1]),12,C.hi)
   +T(`${vp}\\,dt`,(Q[0]+H[0])/2+20,(Q[1]+H[1])/2+16,{size:30,anchor:'start'})
   +L('底辺',(S[0]+P[0])/2-40,(S[1]+P[1])/2-14,{size:22,color:CR})+L('高さ',(Q[0]+H[0])/2+40,(Q[1]+H[1])/2+56,{size:22,color:CQ,anchor:'start'}));
 }
 if(!still){
  if(mode===0)s+=card(680,110,480,290,L('dt の 間に',920,165,{size:26,color:C.t,weight:700})+L('𝐯dt だけ 進む',920,225,{size:30,color:CV,weight:700})
   +fade(seg(p,.4,.55),L('𝐫 と 𝐯dt を 2辺とする',920,300,{size:26})+L('細い 三角形',920,350,{size:30,color:AREA,weight:700})),seg(p,.02,.12));
  if(mode===1)s+=card(680,110,480,290,L('底辺 ＝ r',920,170,{size:30,color:CR,weight:700})
   +fade(seg(p,.3,.45),L('高さ ＝ 𝐯dt の 𝐫 に 直角な 部分',920,245,{size:24})+T(`${vp}\\,dt`,920,325,{size:44})),seg(p,.02,.12));
 }
 return s;
}
