// 高校編「磁場と電磁誘導・深く学ぶ 1/4」(ys-hs-e-magnet-1) — 図。Stage 1200×515.
// 色：電流 I 緑(C.F)、磁場 𝐁 橙(C.E)、力 𝐅 緑（太い矢印）、起電力 ℰ 紫(C.v)、磁束 Φ 黄(C.hi)、法線 桃(C.p)、時間 t 金(C.t)、
//     方位磁針の N 極 赤・S 極 灰、電子 青、磁石の N 極 赤・S 極 青。⊙＝画面の手前向き、⊗＝奥向き（丸付き）。
// 向き（検算済み。x 右・y 上・z 手前）：⊙ のまわりの磁場は画面で反時計回り、⊗ は時計回り。
// 2/4・3/4・4/4・要点でも使う部品は export する。部品の一部は大学編（ui-current-field-1・ui-magnetic-force-1・ui-induction-1/2）から写した。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,poly} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {tag,T2} from './yt1-hs-m-energy-1-diagrams.mjs';
import {FA} from './yt1-hs-m-force-1-diagrams.mjs';
export {card,tag,T2,FA};

const K='hs-e-magnet-1:';
export const BC=C.E, IC=C.F, FC=C.F, EMF=C.v, PHI=C.hi, NC=C.p, TC=C.t, NEG='#7fb3ff', CN='#ff6b6b', CS='#c9d3e3', NP='#e05252', SP='#4f7fe0', SURF='#c9d6ee', BAD=C.a;
export const RAD=Math.PI/180;
export const n2=v=>Number(v.toFixed(2));
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const vB=cs(BC,'\\mathbf{B}'), vF=cs(FC,'\\mathbf{F}');
export const Bt=cs(BC,'B'), It=cs(IC,'I'), Ft=cs(FC,'F'), Phit=cs(PHI,'\\Phi'), EMt=cs(EMF,'\\mathcal{E}'), tt=cs(TC,'t');
export const U=s=>`\\,\\mathrm{${s}}`;
// ---- symbols -------------------------------------------------------------------------------------
export function outSym(x,y,r=20,color=IC,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#101a30'})+dot(x,y,r*.3,color));}
export function inSym(x,y,r=20,color=IC,g=1){const d=r*.6;return fade(g,ring(x,y,r,{color,w:4,fill:'#101a30'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
export const sym=(kind,x,y,r,color=IC,g=1)=>kind==='out'?outSym(x,y,r,color,g):inSym(x,y,r,color,g);
export function wireTop(x,y,kind='out',{g=1,text='I',r=22,dx=8,dy=-2}={}){
 return fade(g,sym(kind,x,y,r,IC)+(text?label(text,x+r+dx,y-r+dy,{size:30,color:IC,weight:700}):''));
}
export function head(x,y,dx,dy,{color=BC,L=18}={}){
 const m=Math.hypot(dx,dy)||1,ux=dx/m,uy=dy/m,bx=x-L*ux,by=y-L*uy;
 return `<polygon points="${n2(x)},${n2(y)} ${n2(bx-L*.5*uy)},${n2(by+L*.5*ux)} ${n2(bx+L*.5*uy)},${n2(by-L*.5*ux)}" fill="${color}"/>`;
}
// circle of field around (cx,cy); sense +1 = counter-clockwise on screen, −1 = clockwise.
export function fieldCircle(cx,cy,R,sense=1,{g=1,color=BC,w=3.5,nh=4,phase=45,L=18,dash=''}={}){
 if(g<=0)return '';
 let s=ring(cx,cy,R,{color,w,dash});
 for(let i=0;i<nh;i++){const t=(phase+360*i/nh)*RAD;const x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);s+=head(x,y,-Math.sin(t)*sense,-Math.cos(t)*sense,{color,L});}
 return fade(g,s);
}
// compass: angle a (radians, 0 = right, π/2 = up on screen) is where the N end points.
export function compass(x,y,a,{r=24,g=1,hl=0}={}){
 const ux=Math.cos(a),uy=-Math.sin(a),px=-uy,py=ux,L=r*.86,wd=r*.3;
 let s=ring(x,y,r,{color:hl?C.hi:C.dim,w:hl?4:2.5,fill:'#172238'});
 s+=`<polygon points="${n2(x+L*ux)},${n2(y+L*uy)} ${n2(x+wd*px)},${n2(y+wd*py)} ${n2(x-wd*px)},${n2(y-wd*py)}" fill="${CN}"/>`;
 s+=`<polygon points="${n2(x-L*ux)},${n2(y-L*uy)} ${n2(x+wd*px)},${n2(y+wd*py)} ${n2(x-wd*px)},${n2(y-wd*py)}" fill="${CS}"/>`;
 s+=dot(x,y,3,'#172238');
 return fade(g,s);
}
export const angLerp=(a,b,u)=>{let d=((b-a)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI;return a+d*u;};
export const NORTH=Math.PI/2;
const CANG=[0,45,90,135,180,225,270,315];
// compasses on a circle around a wire; turn: 0 = all north, 1 = along the circle (sense)
export function compassRing({turn=0,sense=1,g=1,R=150,cx=330,cy=262,r=24}={}){
 let s='';
 CANG.forEach(d=>{const t=d*RAD,x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);s+=compass(x,y,angLerp(NORTH,t+sense*Math.PI/2,turn),{r});});
 return fade(g,s);
}
export function northRose(x,y,g=1){return fade(g,arrow(x,y+26,x,y-30,{color:C.dim,w:3,head:14})+label('北',x,y-40,{size:24,color:C.dim,anchor:'middle'}));}
// uniform field rows pointing right (dir=1) or left (dir=−1)
export function fieldRows(x0,x1,ys,{g=1,len=62,gap=115,opacity=.8,w=4,dir=1}={}){
 let s='';for(const y of ys)for(let x=x0;x+len<=x1;x+=gap)s+=dir>0?arrow(x,y,x+len,y,{color:BC,w,head:14}):arrow(x+len,y,x,y,{color:BC,w,head:14});
 return fade(g*opacity,s);
}
export const Qcard=(a,b,{g=1,x=650,y=120,w=500,h=230,bsize=38}={})=>card(x,y,w,h,label(a,x+w/2,y+80,{size:30,color:C.ink,anchor:'middle'})+label(b,x+w/2,y+160,{size:bsize,color:C.hi,anchor:'middle',weight:700}),g,C.hi);
// ---- bar magnet (horizontal) ------------------------------------------------------------------------
// dir=+1: N on the right. (cx,cy) centre, half length hl.
export function barMagnet(cx,cy,{hl=130,hh=30,dir=1,g=1,size=32}={}){
 const L=dir>0?['S',SP]:['N',NP],R=dir>0?['N',NP]:['S',SP];
 return fade(g,rect(cx-hl,cy-hh,hl,2*hh,{fill:L[1],fo:.6,stroke:L[1],rx:4})+rect(cx,cy-hh,hl,2*hh,{fill:R[1],fo:.6,stroke:R[1],rx:4})
  +label(L[0],cx-hl/2,cy+size*.36,{size,color:C.ink,anchor:'middle',weight:700})+label(R[0],cx+hl/2,cy+size*.36,{size,color:C.ink,anchor:'middle',weight:700}));
}
// field of a bar magnet modelled by two poles at cx±a (N at +a)
const MG={cx:340,cy:285,a:105};
export function magField(x,y,o=MG){
 const N=[o.cx+o.a,o.cy],Sp=[o.cx-o.a,o.cy];
 const f=(p,q)=>{const dx=x-p[0],dy=y-p[1],r3=Math.pow(dx*dx+dy*dy,1.5)+1e-9;return [q*dx/r3,q*dy/r3];};
 const a=f(N,1),b=f(Sp,-1);return [a[0]+b[0],a[1]+b[1]];
}
const inMag=(x,y,o=MG)=>x>o.cx-140&&x<o.cx+140&&y>o.cy-40&&y<o.cy+40;
export function magCompasses({g=1,turn=1}={}){
 const P=[[340,120],[175,165],[505,165],[70,285],[610,285],[175,405],[505,405],[340,450]];
 let s='';P.forEach(([x,y])=>{const [bx,by]=magField(x,y);s+=compass(x,y,angLerp(NORTH,Math.atan2(-by,bx),turn),{r:30});});
 return fade(g,s);
}
export function magArrows({g=1,x0=60,x1=650,y0=70,y1=470,step=78}={}){
 let s='';
 for(let x=x0;x<=x1;x+=step)for(let y=y0;y<=y1;y+=step){if(inMag(x,y)||Math.hypot(x-445,y-285)<40||Math.hypot(x-235,y-285)<40)continue;
  const [bx,by]=magField(x,y),m=Math.hypot(bx,by),L=mix(18,58,clamp(Math.sqrt(m*4.0e3))),ux=bx/m,uy=by/m;
  s+=arrow(x-ux*L/2,y-uy*L/2,x+ux*L/2,y+uy*L/2,{color:BC,w:3.5,head:12});}
 return fade(g,s);
}
export function magLines({g=1,p=1}={}){
 let s='';
 const starts=[-78,-52,-26,0,26,52,78].map(d=>[445+42*Math.cos(d*RAD),285-42*Math.sin(d*RAD)]);
 for(const [x0,y0] of starts){
  let x=x0,y=y0;const pts=[[x,y]];
  for(let i=0;i<900;i++){const [bx,by]=magField(x,y),m=Math.hypot(bx,by);x+=4*bx/m;y+=4*by/m;pts.push([x,y]);
   if(x<-40||x>720||y<-40||y>560)break; if(inMag(x,y))break;}
  s+=draw(pts,p,{color:BC,w:3,opacity:.85});
  const k=Math.floor(pts.length*.33);if(p>.4&&k>2&&pts[k][0]>0&&pts[k][0]<700&&pts[k][1]>10&&pts[k][1]<505)s+=head(pts[k][0],pts[k][1],pts[k][0]-pts[k-2][0],pts[k][1]-pts[k-2][1],{color:BC,L:16});
 }
 // mirror below / above is already included by the start points; draw the straight line to the right
 return fade(g,s);
}
// ---- U-shaped magnet: N pole on the left, S on the right → field to the right in the gap -----------
export function uMagnet(cx,cy,{gap=420,h=300,g=1,field=1,rows=[-90,-30,30,90],len=58,step=105}={}){
 const xl=cx-gap/2,xr=cx+gap/2,pw=70;
 let s=rect(xl-pw,cy-h/2,pw,h,{fill:NP,fo:.55,stroke:NP,rx:6})+rect(xr,cy-h/2,pw,h,{fill:SP,fo:.55,stroke:SP,rx:6});
 s+=label('N',xl-pw/2,cy+12,{size:36,color:C.ink,anchor:'middle',weight:700})+label('S',xr+pw/2,cy+12,{size:36,color:C.ink,anchor:'middle',weight:700});
 s+=fade(field,fieldRows(xl+22,xr-12,rows.map(r=>cy+r),{len,gap:step,opacity:.75}));
 return fade(g,s);
}
// ---- right hand around a vertical wire (oblique view) — from ui-current-field-1 -----------------------
function ellipseArc(cx,cy,rx,ry,a0,a1,n=40){return Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});}
export function fieldEllipse(cx,cy,rx,ry,{g=1,sense=1}={}){
 let s=draw(ellipseArc(cx,cy,rx,ry,180,360),1,{color:BC,w:3.5,opacity:.55})+draw(ellipseArc(cx,cy,rx,ry,0,180),1,{color:BC,w:4});
 s+=head(cx+sense*14,cy+ry,sense,0,{color:BC,L:20})+fade(.7,head(cx-sense*14,cy-ry,-sense,0,{color:BC,L:18}));
 return fade(g,s);
}
export function hand(hx,{g=1,fingers=1}={}){
 const skin='#e2b48f',edge='#8a5a3c';
 let s=rect(hx-92,212,70,150,{fill:skin,fo:1,stroke:edge,sw:2.5,rx:26});
 let f='';
 for(let i=0;i<4;i++){const y=236+i*32;
  f+=draw(ellipseArc(hx,y,62,17,160,20,30),1,{color:edge,w:27});
  f+=draw(ellipseArc(hx,y,62,17,160,20,30),1,{color:skin,w:22});
  const [tx,ty]=ellipseArc(hx,y,62,17,20,20,1)[0];f+=dot(tx,ty,11,skin);}
 s+=fade(fingers,f);
 s+=draw([[hx-40,228],[hx-22,170],[hx-14,138]],1,{color:edge,w:30})+draw([[hx-40,228],[hx-22,170],[hx-14,138]],1,{color:skin,w:25});
 return fade(g,s);
}
export function wireV(x,{g=1,top=40,bot=480,ay=[230,90],text=true}={}){
 return fade(g,line(x,top,x,bot,{color:IC,w:7})+arrow(x,ay[0],x,ay[1],{color:IC,w:7,head:22})+(text?label('I',x+18,ay[1]+20,{size:30,color:IC,weight:700}):''));
}
function screwFig(x,g=1,turn=1){
 let s=line(x,40,x,480,{color:IC,w:5,opacity:.4});
 const top=150,bot=380;
 s+=poly([[x-22,bot],[x+22,bot],[x+22,top+40],[x,top],[x-22,top+40]],{fill:'#5a6680',fo:1,stroke:C.ink,sw:2});
 for(let y=top+44;y<bot;y+=18)s+=line(x-22,y+6,x+22,y-6,{color:C.ink,w:1.5});
 s+=`<ellipse cx="${x}" cy="${bot+6}" rx="46" ry="14" fill="#46526e" stroke="${C.ink}" stroke-width="2.5"/>`;
 s+=fade(turn,fieldEllipse(x,300,95,26));
 return fade(g,s);
}
// ---- desk experiment, seen from above: wire north–south over a compass ---------------------------------
const DK={x:330,y:290,r:72};
function desk({on=0,dir=1,g=1,swing=1,bArrow=0}={}){
 let s=northRose(110,120)+label('真上から 見た図',60,52,{size:22,color:C.dim});
 s+=label('西',70,300,{size:24,color:C.dim,anchor:'middle'})+label('東',600,300,{size:24,color:C.dim,anchor:'middle'});
 const a=NORTH+dir*on*swing*60*RAD;
 s+=compass(DK.x,DK.y,a,{r:DK.r});
 s+=line(DK.x,30,DK.x,500,{color:IC,w:6,opacity:.55+.4*on});
 if(on>0)s+=fade(on,(dir>0?arrow(DK.x,200,DK.x,90,{color:IC,w:7,head:22}):arrow(DK.x,90,DK.x,200,{color:IC,w:7,head:22}))+label('I',DK.x+18,150,{size:30,color:IC,weight:700}));
 s+=fade(on,label(dir>0?'電流：北向き':'電流：南向き',DK.x+40,470,{size:26,color:IC,weight:700}));
 if(bArrow)s+=fade(bArrow,arrow(DK.x-10,DK.y+105,DK.x-170,DK.y+105,{color:BC,w:7,head:22})+T(vB,DK.x-185,DK.y+115,{size:34,anchor:'end'}));
 return fade(g,s);
}
// ---- loop cross-section --------------------------------------------------------------------------------
const LP={x:520,y:262,rx:62,ry:160};
function loopEllipse({g=1,heads=1}={}){
 let s=draw(ellipseArc(LP.x,LP.y,LP.rx,LP.ry,90,270),1,{color:IC,w:5,opacity:.45});// back half (left)
 s+=draw(ellipseArc(LP.x,LP.y,LP.rx,LP.ry,-90,90),1,{color:IC,w:6});// front half (right)
 if(heads)s+=head(LP.x+LP.rx,LP.y+8,0,1,{color:IC,L:22})+fade(.6,head(LP.x-LP.rx,LP.y-8,0,-1,{color:IC,L:20}));
 return fade(g,s);
}
function crossSec({g=1,circ=0,inside=0}={}){
 const yt=LP.y-LP.ry,yb=LP.y+LP.ry;
 let s=fieldCircle(LP.x,yt,72,1,{g:circ,nh:4,phase:0})+fieldCircle(LP.x,yb,72,-1,{g:circ,nh:4,phase:0});
 s+=outSym(LP.x,yt,22)+inSym(LP.x,yb,22);
 s+=label('手前向き',LP.x+100,yt+8,{size:24,color:IC,weight:700})+label('奥向き',LP.x+100,yb+8,{size:24,color:IC,weight:700});
 if(inside)s+=fade(inside,arrow(LP.x-90,LP.y,LP.x+110,LP.y,{color:BC,w:12,head:30})+highlight(LP.x-110,LP.y-50,240,100,1,BC));
 return fade(g,s);
}
function coilFig({g=1,field=1,poles=0,x0=360,x1=700,cy=262,ry=110,turns=7}={}){
 let s='';
 const dx=(x1-x0)/(turns-1);
 for(let i=0;i<turns;i++){const x=x0+i*dx;s+=draw(ellipseArc(x,cy,26,ry,90,270),1,{color:IC,w:4,opacity:.4});}
 if(field){let f='';
  for(const dy of [-60,0,60])f+=arrow(x0-40,cy+dy,x1+60,cy+dy,{color:BC,w:dy===0?7:5,head:22});
  for(const sgn of [-1,1]){const pts=[];for(let i=0;i<=40;i++){const a=Math.PI*i/40;pts.push([(x0+x1)/2+((x1-x0)/2+90)*Math.cos(a),cy+sgn*(ry+30+80*Math.sin(a))]);}
   f+=draw(pts,1,{color:BC,w:3.5,opacity:.8});const k=20;f+=head(pts[k][0],pts[k][1],pts[k][0]-pts[k-2][0],pts[k][1]-pts[k-2][1],{color:BC,L:18});}
  s+=fade(field,f);}
 for(let i=0;i<turns;i++){const x=x0+i*dx;s+=draw(ellipseArc(x,cy,26,ry,-90,90),1,{color:IC,w:5});}
 s+=head(x0+26,cy+10,0,1,{color:IC,L:20});
 s+=label('I',x0+40,cy+60,{size:28,color:IC,weight:700});
 if(poles)s+=fade(poles,label('N',x1+90,cy-14,{size:40,color:NP,anchor:'middle',weight:700})+label('S',x0-90,cy-14,{size:40,color:SP,anchor:'middle',weight:700}));
 return fade(g,s);
}
function electrons(t,{y=270,x0=120,x1=1080,n=9,g=1}={}){
 let s='';const L=x1-x0;
 for(let i=0;i<n;i++){const x=x1-((i*L/n+t*90)%L);s+=ring(x,y,14,{color:NEG,w:2.5,fill:'#1b2a48'})+label('−',x,y+7,{size:22,color:NEG,anchor:'middle',weight:700});}
 return fade(g,s);
}
const crossX=(x,y,r=26,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:BAD,w:6})+line(x-r,y+r,x+r,y-r,{color:BAD,w:6}));
const sceneT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;

export const hsEMagnet1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  const on=seg(p,.55,.75);
  let s=desk({on,dir:1});
  s+=fade(seg(p,.6,.8),label('針が 振れる',600,170,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p)=>fade(.35,desk({on:1}))+Qcard('電流は、熱の ほかに','何を 作っている？',{g:seg(p,.05,.25),x:620,y:120,w:540}),
 [K+'exp']:(p)=>{
  let s=desk({on:0,g:seg(p,0,.15)});
  s+=fade(seg(p,.2,.4),label('導線の 真下に 方位磁針',820,180,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('N 極（赤）は 北',820,240,{size:28,color:CN,anchor:'middle',weight:700}));
  return s;
 },
 [K+'on']:(p)=>{
  const on=seg(p,.1,.3)*(1-seg(p,.7,.88));
  let s=desk({on,dir:1});
  s+=fade(seg(p,.15,.35)*(1-seg(p,.7,.8)),label('電流 ON → 西へ 振れる',830,180,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('電流 OFF → 北に 戻る',830,180,{size:28,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rev']:(p)=>{
  const on=seg(p,.1,.35);
  let s=desk({on,dir:-1});
  s+=fade(seg(p,.3,.5),label('電流を 逆に → 東へ 振れる',830,180,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'like']:(p)=>{
  let s=compass(250,250,NORTH+50*RAD*seg(p,.1,.3),{r:62})+barMagnet(300,400,{hl:80,hh:24,dir:1,size:26});
  s+=label('磁石を 近づける',250,40,{size:26,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.35,.5),compass(780,250,NORTH+60*RAD,{r:62})+line(780,90,780,420,{color:IC,w:6})+arrow(780,200,780,110,{color:IC,w:7,head:22})+label('電流を 流す',780,40,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),label('＝ 同じ はたらき？',515,480,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S2 磁場は、向きの地図 =================
 [K+'magnet']:(p)=>barMagnet(340,285)+magCompasses({turn:seg(p,.25,.6)})+fade(seg(p,.6,.8),card(740,150,400,150,label('N 極の 向きは',940,210,{size:28,color:C.ink,anchor:'middle'})+label('場所ごとに 違う',940,265,{size:32,color:CN,anchor:'middle',weight:700}),1,C.faint)),
 [K+'map']:(p)=>{
  let s=barMagnet(340,285)+fade(1-.6*seg(p,.15,.4),magCompasses())+magArrows({g:seg(p,.15,.45)});
  s+=card(720,110,450,240,label('各場所の',945,170,{size:28,color:C.ink,anchor:'middle'})+label('向きと 強さの 地図',945,230,{size:34,color:BC,anchor:'middle',weight:700})+fade(seg(p,.7,.85),label('＝ 磁場',945,300,{size:40,color:C.hi,anchor:'middle',weight:700})),seg(p,.4,.6),BC);
  return s;
 },
 [K+'weather']:(p)=>{
  // left: wind arrows around a low; right: magnet field arrows
  let s=card(40,40,530,430,'',1,C.faint)+label('天気図（風）',305,85,{size:26,color:C.dim,anchor:'middle'});
  const cx=305,cy=280;s+=label('低',cx,cy+12,{size:34,color:C.ink,anchor:'middle',weight:700});
  for(const R of [80,150])for(let d=0;d<360;d+=(R>100?40:60)){const t=d*RAD,x=cx+R*Math.cos(t),y=cy-R*.75*Math.sin(t);
   const ux=-Math.sin(t)-.35*Math.cos(t),uy=-Math.cos(t)*.75+.35*Math.sin(t)*.75,m=Math.hypot(ux,uy),L=R>100?32:46;
   s+=arrow(x-ux/m*L/2,y-uy/m*L/2,x+ux/m*L/2,y+uy/m*L/2,{color:'#bfe9ff',w:3.5,head:12});}
  s+=fade(seg(p,.35,.55),card(630,40,530,430,'',1,C.faint)+label('磁場',895,85,{size:26,color:C.dim,anchor:'middle'})
   +`<g transform="translate(700 150) scale(.62) translate(-60 -70)">${barMagnet(340,285)+magArrows()}</g>`);
  s+=fade(seg(p,.6,.8),label('矢印の 向き ＝ N 極の 向き　長さ ＝ 強さ',600,505,{size:26,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'noflow']:(p)=>{
  let s=barMagnet(340,285)+magArrows();
  s+=card(720,120,440,220,label('矢印に 沿って',940,185,{size:28,color:C.ink,anchor:'middle'})+label('何かが 流れている',940,240,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),C.faint);
  s+=crossX(940,230,70,seg(p,.4,.6));
  s+=fade(seg(p,.55,.75),label('風とは 違う',940,390,{size:30,color:BAD,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ba']:(p)=>card(110,60,980,230,label('場',600,130,{size:44,color:C.hi,anchor:'middle',weight:700})+label('場所ごとに 向きや 大きさが 決まっているもの',600,215,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi)
  +fade(seg(p,.55,.75),label('磁場 ＝ 磁石の 力の 場',600,380,{size:40,color:BC,anchor:'middle',weight:700}))+tag('定義',600,460,{g:seg(p,.6,.75)}),
 [K+'symbol']:(p)=>{
  let s=card(200,60,800,330,'',seg(p,0,.15),BC);
  s+=fade(seg(p,.05,.25),T(vB,330,200,{size:110})+label('磁場',330,330,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),label('（磁束密度）',650,150,{size:32,color:BC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('単位：T（テスラ）',650,240,{size:38,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('T の 中身は 次の回',650,320,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'lines']:(p)=>{
  let s=barMagnet(340,285)+fade(.35,magArrows())+magLines({p:seg(p,.05,.5)});
  s+=card(740,120,420,230,label('磁力線',950,180,{size:34,color:BC,anchor:'middle',weight:700})+label('向きを 描いた 線',950,240,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.6,.75),label('糸 では ない',950,305,{size:30,color:BAD,anchor:'middle',weight:700})),seg(p,.4,.55),C.faint);
  return s;
 },
 // ================= S3 直線電流のまわり =================
 [K+'top']:(p)=>{
  let s=wireTop(330,262,'out',{g:seg(p,.05,.25),r:26});
  s+=card(640,90,500,320,'',seg(p,.3,.45),C.faint);
  s+=fade(seg(p,.35,.55),outSym(710,180,24)+label('画面の 手前向き',760,190,{size:30,color:C.ink}));
  s+=fade(seg(p,.6,.8),inSym(710,310,24)+label('画面の 奥向き',760,320,{size:30,color:C.ink}));
  return s;
 },
 [K+'ring']:(p)=>wireTop(330,262,'out',{r:26})+compassRing({g:seg(p,.05,.3)})+fade(seg(p,.55,.75),label('N 極は どちら？',870,250,{size:38,color:C.hi,anchor:'middle',weight:700})),
 [K+'turn']:(p)=>{
  const u=seg(p,.05,.4);
  let s=fieldCircle(330,262,150,1,{g:seg(p,.45,.65),nh:4,phase:22.5,w:3})+wireTop(330,262,'out',{r:26})+compassRing({turn:u});
  s+=fade(seg(p,.55,.75),label('反時計回り',870,250,{size:40,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'law']:(p)=>{
  let s=fieldCircle(330,262,150,1,{nh:4,phase:22.5,w:3})+wireTop(330,262,'out',{r:26})+compassRing({turn:1});
  s+=card(620,110,540,220,label('直線電流の まわり：',890,175,{size:28,color:C.ink,anchor:'middle'})+label('円の 向きの 磁場',890,245,{size:40,color:BC,anchor:'middle',weight:700}),seg(p,.05,.25),BC);
  s+=tag('法則（実験）',890,400,{g:seg(p,.55,.7)});
  return s;
 },
 [K+'far']:(p)=>{
  let s=wireTop(330,262,'out',{r:22});
  const one=(R,L,g)=>{let q=ring(330,262,R,{color:BC,w:1.5,dash:'5 8'});for(let d=0;d<360;d+=45){const t=d*RAD,x=330+R*Math.cos(t),y=262-R*Math.sin(t),ux=-Math.sin(t),uy=-Math.cos(t);q+=arrow(x-ux*L/2,y-uy*L/2,x+ux*L/2,y+uy*L/2,{color:BC,w:5,head:16});}return fade(g,q);};
  s+=one(95,64,seg(p,.05,.3))+one(205,32,seg(p,.3,.55));
  s+=fade(seg(p,.55,.75),label('近い：強い（長い 矢印）',870,200,{size:30,color:BC,anchor:'middle',weight:700})+label('遠い：弱い（短い 矢印）',870,280,{size:30,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'in']:(p)=>{
  const u=seg(p,.45,.8);
  let s=fieldCircle(330,262,150,-1,{g:seg(p,.75,.9),nh:4,phase:22.5,w:3})+wireTop(330,262,'in',{r:26,g:seg(p,0,.2)})+compassRing({turn:u,sense:-1});
  s+=fade(seg(p,.1,.3),label('丸に バツ ＝ 奥向き',870,180,{size:30,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('時計回り',870,280,{size:40,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notrad']:(p)=>{
  let s=label('放射状？',250,60,{size:28,color:C.dim,anchor:'middle'})+wireTop(250,262,'out',{r:20,text:''});
  for(let d=0;d<360;d+=45){const t=d*RAD;s+=arrow(250+34*Math.cos(t),262-34*Math.sin(t),250+130*Math.cos(t),262-130*Math.sin(t),{color:BC,w:3.5,head:14,opacity:.6});}
  s+=crossX(250,262,120,seg(p,.1,.3));
  s+=fade(seg(p,.45,.65),label('ぐるりと 回る',850,60,{size:28,color:C.ink,anchor:'middle',weight:700})+fieldCircle(850,262,120,1,{nh:4,phase:45})+fieldCircle(850,262,70,1,{nh:3,phase:90})+wireTop(850,262,'out',{r:20,text:''}));
  return s;
 },
 // ================= S4 右手の約束 =================
 [K+'hand']:(p)=>{
  let s=wireV(330)+hand(330,{g:seg(p,.05,.3),fingers:0});
  s+=fade(seg(p,.35,.55),label('親指 ＝ 電流 I の 向き',560,130,{size:30,color:IC,weight:700}));
  return s;
 },
 [K+'curl']:(p)=>{
  let s=wireV(330)+hand(330,{fingers:seg(p,.05,.3)})+fieldEllipse(330,410,110,30,{g:seg(p,.35,.6)});
  s+=label('親指 ＝ 電流 I の 向き',560,130,{size:30,color:IC,weight:700});
  s+=fade(seg(p,.5,.7),label('指先の 回る 向き ＝ 磁場 𝐁',560,330,{size:30,color:BC,weight:700}));
  return s;
 },
 [K+'screw']:(p)=>{
  let s=screwFig(330,1,seg(p,.1,.35));
  s+=fade(seg(p,.1,.3),arrow(420,250,420,140,{color:IC,w:5,head:16}));
  s+=fade(seg(p,.3,.5),label('回す 向き ＝ 磁場',560,330,{size:30,color:BC,weight:700}));
  s+=fade(seg(p,.1,.3),label('進む 向き ＝ 電流',560,180,{size:30,color:IC,weight:700}));
  s+=tag('右ねじの法則',800,450,{g:seg(p,.65,.8),size:26});
  return s;
 },
 [K+'check']:(p)=>{
  let s=`<g transform="translate(40 40) scale(.8)">${wireV(330)+hand(330)+fieldEllipse(330,410,110,30)}</g>`;
  s+=fade(seg(p,.1,.3),arrow(470,250,600,250,{color:C.dim,w:4,head:16})+label('真上から',535,225,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.2,.45),fieldCircle(860,262,140,1,{nh:4,phase:22.5,w:3})+wireTop(860,262,'out',{r:26}));
  s+=fade(seg(p,.5,.7),compassRing({turn:1,cx:860,R:140,r:20}));
  s+=fade(seg(p,.6,.8),label('反時計回り',860,500,{size:30,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>wireTop(400,262,'in',{r:28})+ring(400,262,150,{color:C.faint,w:2,dash:'6 8'})+fade(seg(p,.3,.5),label('どちら回り？',850,250,{size:40,color:C.hi,anchor:'middle',weight:700})),
 [K+'quiz2']:(p)=>{
  let s=fieldCircle(400,262,150,-1,{g:seg(p,.05,.3),nh:4,phase:22.5,w:3.5})+wireTop(400,262,'in',{r:28});
  s+=fade(seg(p,.05,.25),label('親指を 奥へ',850,170,{size:30,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.45),label('時計回り',850,250,{size:42,color:BC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),compassRing({turn:1,sense:-1,cx:400,R:150,r:22})+label('方位磁針と 一致',850,330,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'electron']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=rect(80,230,1040,80,{fill:'#d89a5e',fo:.12,stroke:'#d89a5e',sw:2,rx:38});
  s+=electrons(t,{g:seg(p,.3,.5)});
  s+=fade(seg(p,.05,.25),arrow(450,150,750,150,{color:IC,w:8,head:26})+label('電流 I',600,120,{size:30,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.55),arrow(750,400,450,400,{color:NEG,w:6,head:20})+label('電子の 動く 向き',600,460,{size:28,color:NEG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'electron2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.35,rect(80,230,1040,80,{fill:'#d89a5e',fo:.12,stroke:'#d89a5e',sw:2,rx:38})+electrons(t));
  s+=card(150,60,900,150,label('親指 ＝ 電流の 向き',600,150,{size:40,color:IC,anchor:'middle',weight:700}),seg(p,.5,.7),IC);
  s+=fade(seg(p,.05,.25),label('電子の 向きを 親指に → 磁場が 逆',600,440,{size:32,color:BAD,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 輪にして、コイルへ =================
 [K+'loop']:(p)=>{
  let s=loopEllipse({g:seg(p,0,.25)});
  s+=fade(seg(p,.4,.65),outSym(LP.x,LP.y-LP.ry,22)+inSym(LP.x,LP.y+LP.ry,22));
  s+=fade(seg(p,.4,.65),label('断面',LP.x+90,LP.y+8,{size:28,color:C.dim}));
  return s;
 },
 [K+'loop2']:(p)=>fade(.25,loopEllipse())+crossSec({circ:seg(p,.45,.75)}),
 [K+'inside']:(p)=>{
  let s=fade(.25,loopEllipse())+crossSec({circ:1,inside:seg(p,.3,.6)});
  s+=fade(seg(p,.1,.3),label('上の 導線から：右向き',820,200,{size:26,color:BC,weight:700})+label('下の 導線から：右向き',820,330,{size:26,color:BC,weight:700}));
  s+=fade(seg(p,.6,.8),label('強め合う',820,265,{size:34,color:C.hi,weight:700}));
  return s;
 },
 [K+'coil']:(p)=>{
  let s=coilFig({field:seg(p,.2,.5)});
  s+=tag('電磁石',1000,120,{g:seg(p,.45,.6),size:30});
  s+=fade(seg(p,.7,.85),label('電流 OFF → 消える',1000,330,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'coilN']:(p)=>{
  let s=coilFig({poles:seg(p,.05,.3)});
  s+=fade(seg(p,.35,.55),barMagnet(1010,170,{hl:70,hh:24,size:26})+label('同じ はたらき',1010,240,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),label('電流を 逆に →',1010,330,{size:26,color:C.dim,anchor:'middle'})+label('N と S が 入れ替わる',1010,375,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'probe']:(p)=>{
  let s=fieldCircle(330,262,150,1,{nh:4,phase:22.5,w:3})+wireTop(330,262,'out',{r:26})+compassRing({turn:1,g:1-seg(p,.45,.7)});
  s+=fade(seg(p,.05,.25),label('方位磁針 ＝ 向きを 示す 道具',870,200,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('針が なくても 磁場は ある',870,290,{size:32,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'use']:(p)=>{
  let s=coilFig({field:1-.7*seg(p,.15,.3)+.7*seg(p,.35,.5),poles:1});
  s+=fade(seg(p,.05,.25),label('ON / OFF できる',1010,170,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('モーター',1010,280,{size:30,color:C.ink,anchor:'middle',weight:700})+label('スピーカー',1010,330,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=fieldCircle(330,262,150,1,{nh:4,phase:22.5,w:3})+wireTop(330,262,'out',{r:26})+compassRing({turn:1});
  s+=card(640,140,500,220,label('電流は まわりに',890,210,{size:30,color:C.ink,anchor:'middle'})+label('磁場を 作る',890,285,{size:44,color:BC,anchor:'middle',weight:700}),seg(p,.1,.3),BC);
  return s;
 },
 [K+'back']:(p)=>{
  let s=desk({on:1,dir:1,bArrow:seg(p,.25,.5)});
  s+=fade(seg(p,.25,.45),label('真下の 磁場：西向き',830,180,{size:30,color:BC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.85),label('だから 針は 西へ',830,260,{size:30,color:CN,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=`<g transform="translate(30 50) scale(.75)">${wireV(330)+hand(330)+fieldEllipse(330,410,110,30)}</g>`;
  s+=card(520,80,640,130,label('親指 ＝ 電流、指 ＝ 磁場',840,160,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),IC);
  s+=card(520,260,640,130,label('磁場 ＝ 向きと 強さの 地図',840,340,{size:34,color:BC,anchor:'middle',weight:700}),seg(p,.5,.7),BC);
  return s;
 },
 [K+'next']:(p)=>{
  let s=uMagnet(330,262,{g:seg(p,.2,.45)});
  s+=fade(seg(p,.45,.6),outSym(330,262,24)+label('I',360,282,{size:30,color:IC,weight:700}));
  s+=fade(seg(p,.7,.85),label('力？',330,118,{size:42,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>uMagnet(330,262)+outSym(330,262,24)+label('I',360,282,{size:30,color:IC,weight:700})+label('力？',330,118,{size:42,color:C.hi,anchor:'middle',weight:700})
  +Qcard('力の','向きと 大きさは？',{g:seg(p,.05,.25),x:680,y:140,w:460,h:220}),
 [K+'bye']:(p)=>card(300,150,600,180,label('次回：深く学ぶ 2/4',600,230,{size:38,color:C.hi,anchor:'middle',weight:700})+label('磁場の 中の 電流が 受ける 力',600,290,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi),
};
