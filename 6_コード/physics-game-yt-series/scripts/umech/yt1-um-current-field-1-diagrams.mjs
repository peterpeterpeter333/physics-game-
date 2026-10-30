// YouTube シリーズ「アンペールの法則・中級 1/2」(ys-um-current-field-1) — 図。Stage 1200×515.
// 色：磁場 𝐁 橙(C.E)、電流 I 緑(C.F)、一歩 Δ𝐫ᵢ・d𝐫 金(C.t)、沿う部分 黄(C.hi)、直角な部分 桃(C.p)、負 赤(C.a)、半径 r 白。
// 向き：上から見た図・正面図とも ⊙＝画面の手前向き、⊗＝奥向き。⊙ の電流 → 𝐁 は画面上で反時計回り（初級 26 と同じ）。
// 斜めから見た図（輪・右ねじ）：手前側（画面の下側）が右へ進む ＝ 上から見て反時計回り。親指（正の向き）は上 ＝ 上から見て手前 ⊙。
// 部品は export して 2/2 でも使う（関数・定数の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,move,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,highlight} from './anim.mjs';

const K='um-current-field-1:';
export const CB=C.E,CI=C.F,DC=C.t,AL=C.hi,PP=C.p,NG=C.a,CR=C.ink,EC=C.x;
export const RAD=Math.PI/180;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const cross=(x,y,sz=16,color=C.a,w=4)=>line(x-sz,y-sz,x+sz,y+sz,{color,w})+line(x-sz,y+sz,x+sz,y-sz,{color,w});
const n2=v=>Number(v.toFixed(2));
// TeX pieces
export const vB=cs(CB,'\\mathbf{B}'),dr=cs(DC,'d\\mathbf{r}'),Bi=cs(CB,'\\mathbf{B}_i'),Dri=cs(DC,'\\Delta\\mathbf{r}_i'),Ic=cs(CI,'I');
export const LAW=`\\oint_C ${vB}\\cdot${dr}=\\mu_0${Ic}`;
export const OINT=`\\oint_C ${vB}\\cdot${dr}`;

// ---- symbols ---------------------------------------------------------------------------------------
export function outSym(x,y,r=20,color=CI,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#101a30'})+dot(x,y,r*.3,color));}
export function inSym(x,y,r=20,color=CI,g=1){const d=r*.6;return fade(g,ring(x,y,r,{color,w:4,fill:'#101a30'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
export function wire(x,y,kind='out',{g=1,text='I',r=20,color=CI,size=28,tdx=null,tdy=null}={}){
 const s=(kind==='out'?outSym(x,y,r,color):inSym(x,y,r,color))+(text?label(text,x+(tdx??r+8),y+(tdy??-r-2),{size,color,weight:700}):'');
 return fade(g,s);
}
// arrowhead at (x,y) pointing along screen direction (dx,dy)
export function head(x,y,dx,dy,{color=CB,L=18}={}){
 const m=Math.hypot(dx,dy)||1,ux=dx/m,uy=dy/m,bx=x-L*ux,by=y-L*uy;
 return `<polygon points="${n2(x)},${n2(y)} ${n2(bx-L*.5*uy)},${n2(by+L*.5*ux)} ${n2(bx+L*.5*uy)},${n2(by-L*.5*ux)}" fill="${color}"/>`;
}
// circle with arrowheads; sense +1 = counter-clockwise on screen, −1 = clockwise.
export function circ(cx,cy,R,sense=1,{g=1,color=CB,w=3.5,nh=4,phase=45,L=18,dash='',opacity=1}={}){
 if(g<=0)return '';
 let s=ring(cx,cy,R,{color,w,dash});
 for(let i=0;i<nh;i++){const t=(phase+360*i/nh)*RAD;const x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);s+=head(x,y,-Math.sin(t)*sense,-Math.cos(t)*sense,{color,L});}
 return fade(g*opacity,s);
}
// field of a straight current at (wx,wy) (kind out = ⊙ → ccw). returns screen vector of 𝐁 at (x,y), length k/ρ.
export function bvec(wx,wy,x,y,{k=9000,kind='out'}={}){
 const mx=x-wx,my=-(y-wy),r=Math.hypot(mx,my)||1,s=kind==='out'?1:-1;
 const bx=-my/r*s,by=mx/r*s;// math coords, unit
 const L=k/r;return [bx*L,-by*L];
}
export function bArrow(x,y,vx,vy,{g=1,w=4.5,headL=15,text='',tsize=28,color=CB}={}){
 return fade(g,arrow(x,y,x+vx,y+vy,{color,w,head:headL})+(text?T(text,x+vx+(vx>=0?8:-8),y+vy-10,{size:tsize,anchor:vx>=0?'start':'end',color}):''));
}

// ---- the closed path C around the wire (top view) -------------------------------------------------
export const W={x:330,y:262};
export const rho=t=>150+40*Math.cos(2*t+.6)+14*Math.sin(3*t);
export const loopPt=(t,c=W)=>[c.x+rho(t)*Math.cos(t),c.y-rho(t)*Math.sin(t)];
export const loopPts=(n=180,c=W)=>Array.from({length:n+1},(_,k)=>loopPt(2*Math.PI*k/n,c));
export const NS=14;
export const stepEnds=(i,c=W)=>[loopPt(2*Math.PI*i/NS,c),loopPt(2*Math.PI*(i+1)/NS,c)];
export const HI=4;// highlighted step (𝐁 makes 40° with the step)
// o: path (draw progress), label C, steps (g), arrows (g), hl (g), B (g at step mids), rev (flip step arrows), fill (membrane)
export function loopC({c=W,path=1,lab=1,steps=0,hl=0,B=0,Bhl=0,rev=0,fill=0,col=C.ink,wireG=1,field=0,dimSteps=0,stepCol=DC}={}){
 let s='';
 if(field)s+=circ(c.x,c.y,85,1,{g:field*.45,w:2.5,nh:3,phase:60})+circ(c.x,c.y,215,1,{g:field*.35,w:2.5,nh:5,phase:20});
 if(fill)s+=fade(fill,`<polygon points="${loopPts(120,c).map(q=>`${n2(q[0])},${n2(q[1])}`).join(' ')}" fill="${C.x}" fill-opacity=".13" stroke="none"/>`);
 s+=draw(loopPts(180,c),path,{color:col,w:3.5,opacity:steps>0?1-.7*steps:1});
 s+=fade(lab*path,T('C',c.x+rho(.35)*Math.cos(.35)+26,c.y-rho(.35)*Math.sin(.35)-14,{size:34,anchor:'start'}));
 for(let i=0;i<NS;i++){
  let [a,b]=stepEnds(i,c);if(rev>.5)[a,b]=[b,a];
  const op=(hl>0&&i!==HI)?1-.45*dimSteps:1;
  s+=fade(steps*op,arrow(a[0],a[1],b[0],b[1],{color:stepCol,w:4.5,head:14}));
  if(B>0&&i!==HI){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,[vx,vy]=bvec(c.x,c.y,mx,my,{k:7000});s+=fade(B*op,arrow(mx,my,mx+vx,my+vy,{color:CB,w:3,head:11,opacity:.85}));}
 }
 if(hl>0){const [a,b]=stepEnds(HI,c);s+=fade(hl,arrow(a[0],a[1],b[0],b[1],{color:DC,w:7,head:17})+T(Dri,(a[0]+b[0])/2+8,(a[1]+b[1])/2-30,{size:30,anchor:'start'}));}
 if(Bhl>0){const [a,b]=stepEnds(HI,c),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,[vx,vy]=bvec(c.x,c.y,mx,my,{k:11000});s+=bArrow(mx,my,vx,vy,{g:Bhl,w:5,text:Bi,tsize:30});}
 s+=wire(c.x,c.y,'out',{g:wireG});
 return s;
}
// the highlighted step enlarged: step horizontal, 𝐁 at the true relative angle, split into along / perpendicular parts
export function stepAngle(c=W){const [a,b]=stepEnds(HI,c),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,[vx,vy]=bvec(c.x,c.y,mx,my);
 const as=Math.atan2(-(b[1]-a[1]),b[0]-a[0]),ab=Math.atan2(-vy,vx);return ab-as;}
export function zoom(x0,y0,{g=1,gB=1,gA=0,gP=0,neg=false,L=250,BL=170,lab=true,alab=0,plab=0}={}){
 const al=neg?Math.PI-.62:stepAngle();
 const bx=BL*Math.cos(al),by=-BL*Math.sin(al),ax=BL*Math.cos(al),col=neg?NG:AL;
 let s=line(x0-40,y0,x0+L+30,y0,{color:C.faint,w:2,dash:'7 7'});
 s+=arrow(x0,y0+30,x0+L,y0+30,{color:DC,w:6,head:16})+(lab?T(Dri,x0+L+12,y0+42,{size:30,anchor:'start'}):'');
 s+=fade(gB,arrow(x0,y0,x0+bx,y0+by,{color:CB,w:5,head:16})+(lab?T(Bi,x0+bx+(bx>=0?10:-10),y0+by-6,{size:30,anchor:bx>=0?'start':'end'}):''));
 s+=fade(gA,line(x0,y0,x0+ax,y0,{color:col,w:14,cap:'butt',opacity:.45})+arrow(x0,y0,x0+ax,y0,{color:col,w:5,head:14})+line(x0+bx,y0+by,x0+ax,y0,{color:col,w:2,dash:'6 6'}));
 s+=fade(gP,arrow(x0+ax,y0,x0+ax,y0+by,{color:PP,w:4,head:13,opacity:.9}));
 s+=fade(alab*gA,label('沿う部分',x0+ax/2,y0+78,{size:24,color:col,anchor:'middle',weight:700}));
 s+=fade(plab*gP,label('直角な部分',x0+ax+14,y0+by/2+8,{size:24,color:PP,weight:700}));
 return fade(g,s);
}

// ---- oblique view: loop (ellipse) in a horizontal plane, wire vertical ---------------------------------
export function ellArc(cx,cy,rx,ry,a0,a1,n=48){return Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});}
// ccw seen from above: front half (screen-lower, angles 0..180 in screen coords) runs to the right.
export function obLoop(cx,cy,rx,ry,{g=1,color=DC,w=4,sense=1,membrane=0,heads=1}={}){
 let s='';
 if(membrane)s+=fade(membrane,`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.x}" fill-opacity=".16" stroke="none"/>`);
 s+=draw(ellArc(cx,cy,rx,ry,180,360),1,{color,w,opacity:.6})+draw(ellArc(cx,cy,rx,ry,0,180),1,{color,w});
 if(heads)s+=head(cx+sense*16,cy+ry,sense,0,{color,L:20})+fade(.75,head(cx-sense*16,cy-ry,-sense,0,{color,L:18}));
 return fade(g,s);
}
export function obWire(x,{g=1,top=40,bot=490,cy=300,ry=40,arrowY=[200,90],text='I',front=true}={}){
 // lower part is drawn before the loop (behind), upper part after — call twice with front flag
 return fade(g,front?line(x,top,x,cy-ry+4,{color:CI,w:7})+arrow(x,arrowY[0],x,arrowY[1],{color:CI,w:7,head:22})+(text?label(text,x+18,arrowY[1]+18,{size:30,color:CI,weight:700}):'')
  :line(x,cy-ry+4,x,bot,{color:CI,w:7,opacity:.55}));
}

// ---- helpers for S5 -------------------------------------------------------------------------------------
export const L5={x:290,y:262,R:150};
export const WIRES5=[{x:245,y:215,kind:'out',I:'5 A'},{x:350,y:320,kind:'in',I:'2 A'},{x:560,y:120,kind:'out',I:'4 A'}];
function loop5({g=1,heads=1,col=C.ink,w=3.5,signCol=0}={}){
 let s='';
 if(signCol>0){
  // colour the loop by the sign of 𝐁_outside · (ccw step), outside wire = WIRES5[2] (⊙)
  const o=WIRES5[2],n=90;
  for(let k=0;k<n;k++){const t0=2*Math.PI*k/n,t1=2*Math.PI*(k+1)/n,tm=(t0+t1)/2;
   const px=L5.x+L5.R*Math.cos(tm),py=L5.y-L5.R*Math.sin(tm);
   const mx=px-o.x,my=-(py-o.y),bx=-my,by=mx;const tx=-Math.sin(tm),ty=Math.cos(tm);const d=bx*tx+by*ty;
   s+=fade(signCol,line(L5.x+L5.R*Math.cos(t0),L5.y-L5.R*Math.sin(t0),L5.x+L5.R*Math.cos(t1),L5.y-L5.R*Math.sin(t1),{color:d>=0?AL:NG,w:9,cap:'butt'}));}
 }
 s+=circ(L5.x,L5.y,L5.R,1,{color:col,w,nh:heads?4:0,phase:35,L:18});
 return fade(g,s);
}
function wires5({g=[1,1,1],sign=0,dimOut=0,lab=1}={}){
 let s='';
 WIRES5.forEach((q,i)=>{
  const op=i===2?1-.6*dimOut:1;
  s+=fade((g[i]??1)*op,wire(q.x,q.y,q.kind,{text:q.I,size:26,tdx:26,tdy:-18,r:20})+(i===2?'':''));
 });
 if(sign>0){s+=fade(sign,label('＋',WIRES5[0].x-30,WIRES5[0].y+8,{size:30,color:AL,anchor:'end',weight:700})+label('−',WIRES5[1].x-30,WIRES5[1].y+8,{size:32,color:NG,anchor:'end',weight:700}));}
 return s;
}
// coil cut along its axis: top row ⊗, bottom row ⊙
const CO={x0:60,x1:660,yt:130,yb:330,dx:20};
function coilCut({g=1,rect0=0,Lg=0,count=0}={}){
 let s=rect(CO.x0-10,CO.yt-26,CO.x1-CO.x0+20,CO.yb-CO.yt+52,{fill:'#24324e',fo:.35,stroke:C.faint,sw:1.5,rx:10});
 const xs=[];for(let x=CO.x0+10;x<=CO.x1-10;x+=CO.dx)xs.push(x);
 xs.forEach(x=>{s+=inSym(x,CO.yt,8,CI)+outSym(x,CO.yb,8,CI);});
 s+=label('⊗ 奥向き',CO.x1+18,CO.yt+8,{size:24,color:CI})+label('⊙ 手前向き',CO.x1+18,CO.yb+8,{size:24,color:CI});
 // rectangle loop around the bottom row between xa..xb (20 wires)
 const xa=xs[6]-10,xb=xs[25]+10;
 if(rect0>0){s+=fade(rect0,draw([[xa,CO.yb-40],[xa,CO.yb+44],[xb,CO.yb+44],[xb,CO.yb-40],[xa,CO.yb-40]],1,{color:C.ink,w:3.5})
  +head((xa+xb)/2+10,CO.yb+44,1,0,{color:C.ink,L:18})+head((xa+xb)/2-10,CO.yb-40,-1,0,{color:C.ink,L:18})+head(xb,CO.yb,0,-1,{color:C.ink,L:16})+head(xa,CO.yb+2,0,1,{color:C.ink,L:16}));}
 if(Lg>0)s+=fade(Lg,line(xa,CO.yb+80,xb,CO.yb+80,{color:C.dim,w:2.5})+line(xa,CO.yb+70,xa,CO.yb+90,{color:C.dim,w:2.5})+line(xb,CO.yb+70,xb,CO.yb+90,{color:C.dim,w:2.5})+label('L ＝ 0.1 m',(xa+xb)/2,CO.yb+114,{size:26,color:C.ink,anchor:'middle',weight:700}));
 if(count>0){xs.slice(6,26).forEach((x,k)=>{s+=fade(clamp(count*20-k),ring(x,CO.yb,13,{color:AL,w:3}));});}
 return fade(g,s);
}

// ---- small pictures ------------------------------------------------------------------------------------
function topWire({g=1,circles=1,rQ=0,x=330,y=262}={}){
 let s=circ(x,y,80,1,{g:circles,nh:3,phase:60})+circ(x,y,150,1,{g:circles*.8,nh:4,phase:20})+circ(x,y,220,1,{g:circles*.6,nh:5,phase:40,w:3});
 s+=wire(x,y,'out');
 if(rQ>0){s+=fade(rQ,line(x+22,y,x+150,y,{color:CR,w:3,dash:'10 7'})+label('r',x+115,y-12,{size:30,color:CR,weight:700,anchor:'middle'})+dot(x+150,y,7,C.hi)+label('B ＝ ？',x+160,y+50,{size:30,color:CB,weight:700}));}
 return fade(g,s);
}
function sphere(cx,cy,R,{g=1,arrows=1}={}){
 let s=`<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R}" fill="${C.x}" fill-opacity=".08" stroke="${C.dim}" stroke-width="2.5"/>`+`<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R*.3}" fill="none" stroke="${C.faint}" stroke-width="2" stroke-dasharray="6 6"/>`;
 s+=dot(cx,cy,10,'#ff6b6b');
 if(arrows)for(let k=0;k<8;k++){const t=k*45*RAD;s+=arrow(cx+(R-30)*Math.cos(t),cy-(R-30)*Math.sin(t),cx+(R+18)*Math.cos(t),cy-(R+18)*Math.sin(t),{color:EC,w:3.5,head:12});}
 return fade(g,s);
}
export {sphere,topWire};

export const ytUmCurrentField1Diagrams={
 // ===== S1 前回の問い =====
 [K+'intro']:(p)=>{
  let s=fade(seg(p,0,.2),label('前回の最後の問い',700,60,{size:26,color:C.dim}));
  s+=topWire({g:seg(p,.05,.35),rQ:seg(p,.45,.65)});
  s+=card(700,90,450,270,label('受ける側',790,150,{size:28,color:C.dim,anchor:'middle'})+T(`\\mathbf{F}=q\\mathbf{v}\\times${vB}`,790,210,{size:30,color:C.dim})
   +arrow(880,180,960,180,{color:C.hi,w:4,head:14})+label('作る側',1060,150,{size:28,color:C.hi,anchor:'middle',weight:700})+T(`${Ic}\\;\\to\\;${vB}`,1060,210,{size:36})
   +fade(seg(p,.55,.75),label('距離 r で どう決まる？',925,300,{size:30,color:CB,anchor:'middle',weight:700})),seg(p,.15,.35),C.faint);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=label('初級 26',700,60,{size:24,color:C.dim});
  s+=topWire({circles:seg(p,.15,.6)});
  s+=card(700,110,450,200,label('電流 手前向き（⊙）',925,175,{size:28,color:CI,anchor:'middle',weight:700})+label('→ 磁場は 反時計回り',925,240,{size:30,color:CB,anchor:'middle',weight:700}),seg(p,.3,.5),C.faint);
  return s;
 },
 [K+'recall2']:(p)=>{
  let s=label('初級 26',60,50,{size:24,color:C.dim});
  const x=330,y=262,R=160;
  s+=ring(x,y,R,{color:C.faint,w:2,dash:'6 8'})+wire(x,y,'out');
  s+=line(x+20*Math.cos(.6),y-20*Math.sin(.6),x+R*Math.cos(.6),y-R*Math.sin(.6),{color:CR,w:3,dash:'10 7'})+label('r',x+90*Math.cos(.6)-12,y-90*Math.sin(.6)-12,{size:30,color:CR,weight:700});
  const n=10,gs=seg(p,.05,.5);
  for(let k=0;k<n;k++){const t0=(2*Math.PI*k/n)+.2,t1=t0+2*Math.PI/n*.8;const a=[x+R*Math.cos(t0),y-R*Math.sin(t0)],b=[x+R*Math.cos(t1),y-R*Math.sin(t1)];
   s+=fade(clamp(gs*n-k),arrow(a[0],a[1],b[0],b[1],{color:DC,w:4,head:12})+arrow(a[0]+(a[0]-x)*.18,a[1]+(a[1]-y)*.18,a[0]+(a[0]-x)*.18+(b[0]-a[0])*1.05,a[1]+(a[1]-y)*.18+(b[1]-a[1])*1.05,{color:CB,w:3.5,head:12}));}
  s+=T(cs(DC,'\\Delta\\ell'),x-R-40,y+10,{size:30,anchor:'end',opacity:gs});
  s+=card(700,90,450,280,T(`${cs(CB,'B')}\\times${cs(DC,'\\Delta\\ell')}`,925,160,{size:40})+label('一周 足すと',925,225,{size:26,color:C.dim,anchor:'middle'})+T(`${cs(CB,'B')}\\times 2\\pi r`,925,285,{size:44})
   +fade(seg(p,.7,.85),label('くぐる電流に 比例',925,345,{size:30,color:CI,anchor:'middle',weight:700})),seg(p,.4,.6),C.faint);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(120,70,960,110,label('今回',200,138,{size:30,color:C.hi,weight:700})+label('一周の和の 式・比例の係数・符号の約束',330,138,{size:30,color:C.ink}),seg(p,.05,.25),C.hi);
  s+=card(120,220,960,110,label('次回',200,288,{size:30,color:C.dim,weight:700})+label('距離 r で B が どう決まるか',330,288,{size:30,color:C.dim}),seg(p,.5,.7),C.faint);
  s+=fade(seg(p,.2,.4),T(LAW,600,430,{size:46}));
  return s;
 },
 // ===== S2 一周の線積分 =====
 [K+'loop']:(p)=>{
  let s=loopC({path:seg(p,.2,.75),field:seg(p,0,.2)});
  s+=card(700,110,450,200,label('閉じた道 C',925,175,{size:32,color:C.ink,anchor:'middle',weight:700})+label('一周して 元の点に 戻る',925,235,{size:28,color:C.dim,anchor:'middle'})+label('円でなくてよい',925,280,{size:26,color:C.dim,anchor:'middle'}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'steps']:(p)=>{
  let s=loopC({field:1,steps:seg(p,.05,.4),hl:seg(p,.45,.6),dimSteps:seg(p,.45,.6),Bhl:seg(p,.6,.8)});
  s+=card(700,110,450,210,label('i 番目の 一歩',925,170,{size:28,color:C.dim,anchor:'middle'})+T(`${Dri}`,860,245,{size:40})+T(`${Bi}`,1000,245,{size:40})
   +label('一歩の矢印',860,300,{size:24,color:DC,anchor:'middle'})+label('そこの磁場',1000,300,{size:24,color:CB,anchor:'middle'}),seg(p,.4,.6),C.faint);
  return s;
 },
 [K+'split']:(p)=>{
  let s=loopC({field:.6,steps:1,hl:1,dimSteps:1,Bhl:1});
  s+=card(680,40,490,440,zoom(740,280,{gA:seg(p,.1,.3),gP:seg(p,.25,.45),alab:1,plab:1})
   +fade(seg(p,.55,.75),T(`${Bi}\\cdot${Dri}`,925,408,{size:36})+label('＝ 沿う部分 × 一歩の長さ',925,458,{size:26,color:AL,anchor:'middle',weight:700})),1,C.faint);
  return s;
 },
 [K+'perp']:(p)=>{
  const al=stepAngle(),ax=170*Math.cos(al),by=-170*Math.sin(al);
  let s=card(40,40,540,360,zoom(110,240,{gA:1,gP:1,alab:1})+fade(seg(p,.05,.2),cross(110+ax,240+by/2,13,PP))
   +label('直角な部分 → 入らない',310,375,{size:26,color:PP,anchor:'middle',weight:700}),1,PP);
  s+=card(620,40,540,360,zoom(930,240,{gA:1,gP:1,neg:true,lab:false,L:200,alab:1})+label('沿う部分が 逆向き → 負',890,375,{size:26,color:NG,anchor:'middle',weight:700}),seg(p,.45,.6),NG);
  return s;
 },
 [K+'notwork']:(p)=>{
  let s=loopC({field:.6,steps:1,hl:1,dimSteps:.5,Bhl:1});
  s+=card(700,90,450,280,label('この和は',925,150,{size:28,color:C.dim,anchor:'middle'})+label('仕事 ではない',925,205,{size:34,color:NG,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),label('磁場の力は 仕事をしない',925,265,{size:26,color:C.dim,anchor:'middle'})+label('足し方だけ 線積分から 借りる',925,325,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.25),NG);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=loopC({field:.4,steps:1,B:seg(p,0,.3)});
  s+=card(680,60,480,370,T(`\\sum_i ${Bi}\\cdot${Dri}`,920,140,{size:42})+label('一歩が 有限 → 近似',920,205,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.55),arrow(920,230,920,285,{color:C.hi,w:4,head:14})+label('限りなく 短く',945,265,{size:24,color:C.hi}))
   +fade(seg(p,.5,.7),T(OINT,920,345,{size:46})+label('行き先は ＝ で 結ぶ',920,405,{size:26,color:C.dim,anchor:'middle'})),seg(p,.1,.3),C.faint);
  return s;
 },
 [K+'oint']:(p)=>{
  let s=T(OINT,420,190,{size:84});
  const w=texWidth(OINT,84,false);
  s+=fade(seg(p,.05,.25),ring(420-w/2+26,150,40,{color:C.hi,w:3})+label('一周の 印（電位の回と 同じ）',140,330,{size:28,color:C.hi,weight:700}));
  s+=card(760,110,390,210,label('単位',955,170,{size:26,color:C.dim,anchor:'middle'})+T(`\\mathrm{T}\\times\\mathrm{m}=\\mathrm{T\\cdot m}`,955,250,{size:40}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'notwind']:(p)=>{
  let s='';
  // 𝐁 everywhere on a grid (independent of the path)
  for(let i=0;i<6;i++)for(let j=0;j<4;j++){const x=110+i*90,y=90+j*115;const d=Math.hypot(x-W.x,y-W.y);if(d<55)continue;const [vx,vy]=bvec(W.x,W.y,x,y,{k:5200});s+=fade(seg(p,.05,.35),arrow(x-vx/2,y-vy/2,x+vx/2,y+vy/2,{color:CB,w:3.5,head:12}));}
  s+=draw(loopPts(),1,{color:C.ink,w:3,dash:'10 8'})+wire(W.x,W.y,'out');
  s+=card(700,90,450,300,label('磁場',925,150,{size:26,color:CB,anchor:'middle',weight:700})+label('各点に ある 矢印',925,195,{size:28,color:C.ink,anchor:'middle'})
   +label('道 C',925,260,{size:26,color:C.ink,anchor:'middle',weight:700})+label('数えるために 選んだ 線',925,305,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.75),label('道に沿って 流れる のではない',925,360,{size:24,color:NG,anchor:'middle',weight:700})),seg(p,.3,.5),C.faint);
  return s;
 },
 // ===== S3 アンペールの法則 =====
 [K+'law']:(p)=>{
  let s=loopC({field:.35,fill:seg(p,.2,.5),wireG:1});
  s+=fade(seg(p,.25,.45),label('C を 縁とする面',W.x,W.y+75,{size:26,color:EC,anchor:'middle',weight:700}));
  s+=card(700,110,450,220,label('一周の和',925,170,{size:30,color:C.ink,anchor:'middle',weight:700})+label('↕',925,215,{size:30,color:C.dim,anchor:'middle'})+label('面を 貫く 電流',925,265,{size:30,color:CI,anchor:'middle',weight:700}),seg(p,.4,.6),C.faint);
  return s;
 },
 [K+'formula']:(p)=>{
  let s=T(LAW,600,170,{size:80});
  const W0=texWidth(LAW,80,false),l=600-W0/2,wl=texWidth(OINT,80,false),wI=texWidth(Ic,80,false);
  s+=fade(seg(p,.1,.3),highlight(l-8,95,wl+16,130,1,C.hi)+label('一周の和',l+wl/2,280,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),highlight(l+W0-wI-10,95,wI+20,130,1,CI)+label('面を 貫く 電流の 合計',l+W0-wI/2,330,{size:28,color:CI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'surface']:(p)=>{
  const cx=330,cy=300,rx=210,ry=60;
  let s=obWire(cx,{front:false,cy,ry});
  s+=obLoop(cx,cy,rx,ry,{color:C.ink,membrane:seg(p,.1,.4)});
  s+=obWire(cx,{cy,ry});
  s+=dot(cx,cy,7,CI);
  s+=fade(seg(p,.2,.4),label('輪に 張った 膜',cx+rx-20,cy+ry+44,{size:26,color:EC,anchor:'middle',weight:700}));
  s+=label('C',cx-rx-30,cy+8,{size:32,color:C.ink,anchor:'end'});
  s+=card(700,110,450,200,label('I ＝ 膜を',925,180,{size:30,color:CI,anchor:'middle',weight:700})+label('突き抜ける 電流',925,235,{size:30,color:CI,anchor:'middle',weight:700}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'mu']:(p)=>{
  let s=T(LAW,600,110,{size:52});
  s+=card(150,200,900,260,label('初級の「比例する」の 比例の係数',600,255,{size:28,color:C.dim,anchor:'middle'})
   +T(`\\mu_0\\approx 4\\pi\\times10^{-7}\\ \\mathrm{T\\cdot m/A}`,600,340,{size:48})
   +fade(seg(p,.4,.6),label('定めた 定数 ＝ 真空の 透磁率',600,420,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.3),C.faint);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=label('単位を 確かめる',80,70,{size:28,color:C.dim});
  const y=210,sz=56,p1=`\\mu_0${Ic}:\\ `,p2=`\\frac{\\mathrm{T\\cdot m}}{\\mathrm{A}}`,p3=`\\times\\mathrm{A}`,p4=`=\\mathrm{T\\cdot m}`;
  const w1=texWidth(p1,sz,false),w2=texWidth(p2,sz,false),w3=texWidth(p3,sz,false),wA=texWidth('\\mathrm{A}',sz,false);
  let x=260;s+=T(p1,x,y,{size:sz,anchor:'start'});x+=w1;const xf=x;s+=T(p2,x,y,{size:sz,anchor:'start'});x+=w2+8;const x3=x;s+=T(p3,x,y,{size:sz,anchor:'start'});x+=w3+14;
  s+=fade(seg(p,.2,.4),cross(xf+w2/2,y+34,17,C.hi,3)+cross(x3+w3-wA/2+8,y-6,17,C.hi,3));
  s+=fade(seg(p,.35,.5),T(p4,x,y,{size:sz,anchor:'start'}));
  s+=fade(seg(p,.55,.75),T(`${OINT}:\\ \\mathrm{T\\cdot m}`,440,390,{size:52})+label('一致',860,398,{size:36,color:C.hi,weight:700,anchor:'middle'}));
  return s;
 },
 [K+'steady']:(p)=>{
  let s=T(LAW,600,110,{size:52});
  s+=card(120,190,460,240,label('この形で 使える',350,250,{size:28,color:C.dim,anchor:'middle'})+label('定常電流',350,315,{size:36,color:CI,anchor:'middle',weight:700})+label('時間で 変わらない 電流',350,375,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),CI);
  s+=card(620,190,460,240,label('電場が 時間で 変わるとき',850,250,{size:26,color:C.dim,anchor:'middle'})+label('項が 加わる',850,315,{size:34,color:C.hi,anchor:'middle',weight:700})+label('マクスウェル方程式の 回',850,375,{size:26,color:C.dim,anchor:'middle'}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'principle']:(p)=>{
  let s=T(LAW,600,110,{size:52});
  s+=card(120,190,460,220,label('実験に 支えられた',350,270,{size:32,color:C.hi,anchor:'middle',weight:700})+label('法則',350,330,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=card(620,190,460,220,label('電流の 小さな部分の',850,255,{size:26,color:C.dim,anchor:'middle'})+label('磁場を 足して 確かめる',850,305,{size:26,color:C.dim,anchor:'middle'})+label('→ 上級',850,365,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'gauss']:(p)=>{
  let s=card(60,40,520,440,sphere(320,200,110,{})+T(`\\displaystyle\\mathop{\\iint\\mkern-23.5mu\\bigcirc\\mkern2mu}\\nolimits_S ${cs(EC,'\\mathbf{E}')}\\cdot d\\mathbf{A}=\\frac{Q}{\\varepsilon_0}`,320,380,{size:38})+label('閉じた面 ・ 中の 電荷',320,450,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.25),C.faint);
  const cx=880,cy=210,rx=160,ry=45;
  s+=card(620,40,540,440,obWire(cx,{front:false,cy,ry,bot:320})+obLoop(cx,cy,rx,ry,{color:C.ink,membrane:.9})+obWire(cx,{cy,ry,top:60,arrowY:[150,70]})
   +T(LAW,880,380,{size:38})+label('閉じた線 ・ 縁の面を 貫く 電流',880,450,{size:26,color:C.dim,anchor:'middle'}),seg(p,.45,.65),C.faint);
  return s;
 },
 // ===== S4 向きの約束 =====
 [K+'dir']:(p)=>{
  const rv=seg(p,.35,.55);
  let s=loopC({field:0,steps:1,rev:rv});
  s+=card(700,110,450,230,T(`\\sum_i ${Bi}\\cdot${Dri}`,925,180,{size:40})+fade(rv,label('逆に たどる',925,245,{size:28,color:C.dim,anchor:'middle'})+label('→ 符号だけ 反転',925,300,{size:30,color:NG,anchor:'middle',weight:700})),seg(p,.05,.25),C.faint);
  return s;
 },
 [K+'rule']:(p)=>{
  const cx=320,cy=320,rx=200,ry=55;
  let s=obLoop(cx,cy,rx,ry,{color:DC,w:5});
  s+=fade(seg(p,.05,.25),label('4本の指 ＝ たどる向き',cx,cy+ry+56,{size:28,color:DC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),arrow(cx,cy,cx,70,{color:C.hi,w:8,head:24})+label('親指 ＝ 正の向き',cx+24,110,{size:28,color:C.hi,weight:700}));
  s+=card(700,110,450,220,label('親指の向きに',925,180,{size:28,color:C.ink,anchor:'middle'})+label('貫く電流 ＝ 正',925,240,{size:34,color:CI,anchor:'middle',weight:700})+label('逆向き ＝ 負（引く）',925,295,{size:26,color:NG,anchor:'middle'}),seg(p,.6,.8),C.faint);
  return s;
 },
 [K+'ccw']:(p)=>{
  let s=circ(330,262,190,1,{color:DC,w:4,nh:6,phase:15,L:20});
  s+=label('反時計回りに たどる',330,40,{size:26,color:DC,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.35),outSym(260,250,26,C.hi)+label('親指：手前',260,312,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),wire(410,230,'out',{text:'正',size:28,tdx:34,tdy:-20})+wire(410,330,'in',{text:'負',size:28,tdx:34,tdy:-20,color:CI}));
  s+=card(700,110,450,220,label('⊙ 手前向き → 正',925,190,{size:32,color:CI,anchor:'middle',weight:700})+label('⊗ 奥向き → 負',925,260,{size:32,color:NG,anchor:'middle',weight:700}),seg(p,.55,.75),C.faint);
  return s;
 },
 [K+'screw']:(p)=>{
  const x=330,top=110,bot=350;
  let s=poly([[x-24,bot],[x+24,bot],[x+24,top+40],[x,top],[x-24,top+40]],{fill:'#5a6680',fo:1,stroke:C.ink,sw:2});
  for(let y=top+44;y<bot;y+=18)s+=line(x-24,y+6,x+24,y-6,{color:C.ink,w:1.5});
  s+=`<ellipse cx="${x}" cy="${bot+6}" rx="48" ry="14" fill="#46526e" stroke="${C.ink}" stroke-width="2.5"/>`;
  s+=fade(seg(p,.05,.3),obLoop(x,300,120,32,{color:DC,w:4}));
  s+=fade(seg(p,.3,.5),arrow(x+70,150,x+70,70,{color:C.hi,w:5,head:18})+label('ゆるんで 手前（上）へ',x+90,90,{size:26,color:C.hi,weight:700}));
  s+=card(700,110,450,200,label('上から見て 反時計回り',925,175,{size:28,color:DC,anchor:'middle',weight:700})+label('→ 手前（⊙）へ 進む',925,240,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'check']:(p)=>{
  let s=circ(330,262,150,1,{g:seg(p,.05,.3),nh:4,phase:45,w:4})+circ(330,262,190,1,{g:seg(p,.3,.5),color:DC,nh:5,phase:10,w:3,dash:'9 7'})+wire(330,262,'out');
  s+=fade(seg(p,.05,.3),label('𝐁：反時計回り',330,70,{size:26,color:CB,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),label('たどる向き：反時計回り',330,490,{size:26,color:DC,anchor:'middle',weight:700}));
  s+=card(700,90,450,300,label('沿う → 左辺 ＞ 0',925,160,{size:30,color:AL,anchor:'middle',weight:700})+fade(seg(p,.55,.7),label('⊙ は 正 → μ₀I ＞ 0',925,230,{size:30,color:CI,anchor:'middle',weight:700}))
   +fade(seg(p,.75,.9),label('一致',925,320,{size:40,color:C.hi,anchor:'middle',weight:700})),seg(p,.4,.55),C.faint);
  return s;
 },
 // ===== S5 貫く電流を数える =====
 [K+'ex']:(p)=>{
  let s=loop5({g:seg(p,0,.2)})+wires5({g:[seg(p,.15,.35),seg(p,.35,.55),seg(p,.6,.8)]});
  s+=fade(seg(p,.6,.8),label('輪の外',WIRES5[2].x,WIRES5[2].y+60,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=loop5({})+wires5({})+label('輪の外',WIRES5[2].x,WIRES5[2].y+60,{size:24,color:C.dim,anchor:'middle'});
  s+=card(760,160,380,180,T(`${Ic}=\\ ?`,950,260,{size:60,color:C.hi}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'ans']:(p)=>{
  let s=loop5({})+wires5({sign:seg(p,.05,.3),dimOut:seg(p,.6,.8)});
  s+=fade(seg(p,.6,.8),cross(WIRES5[2].x,WIRES5[2].y,26,NG)+label('数えない',WIRES5[2].x,WIRES5[2].y+62,{size:26,color:NG,anchor:'middle',weight:700}));
  s+=card(740,170,410,170,T(`${Ic}=5-2=3\\ \\mathrm{A}`,945,265,{size:46}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'outside']:(p)=>{
  const o=WIRES5[2];
  let s=circ(o.x,o.y,120,1,{g:seg(p,0,.25)*.7,nh:4,phase:200,w:2.5})+circ(o.x,o.y,260,1,{g:seg(p,0,.25)*.55,nh:6,phase:180,w:2.5})+circ(o.x,o.y,400,1,{g:seg(p,0,.25)*.4,nh:8,phase:190,w:2.5});
  s+=loop5({signCol:seg(p,.3,.55),heads:1})+wire(o.x,o.y,'out',{text:'4 A',size:26,tdx:26,tdy:-18});
  s+=card(760,300,400,190,label('沿う所：正',960,350,{size:28,color:AL,anchor:'middle',weight:700})+label('逆らう所：負',960,400,{size:28,color:NG,anchor:'middle',weight:700})+fade(seg(p,.7,.85),label('一周の和 ＝ 0',960,460,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.45,.65),C.faint);
  return s;
 },
 [K+'value']:(p)=>{
  let s=T(LAW,600,100,{size:50});
  s+=card(160,180,880,280,T(`\\mu_0${Ic}=4\\pi\\times10^{-7}\\times 3`,600,265,{size:48})+fade(seg(p,.4,.6),T(`\\approx 3.8\\times10^{-6}\\ \\mathrm{T\\cdot m}`,600,375,{size:50,color:C.hi})),seg(p,.05,.25),C.faint);
  return s;
 },
 [K+'totalonly']:(p)=>{
  let s=loop5({})+wires5({dimOut:1});
  [[0.5],[2.2],[3.6],[5.2]].forEach(([t],k)=>{const x=L5.x+L5.R*Math.cos(t),y=L5.y-L5.R*Math.sin(t);s+=fade(seg(p,.3+k*.08,.45+k*.08),dot(x,y,8,C.hi)+label('B＝？',x+(Math.cos(t)>0?16:-16),y-(Math.sin(t)>0?14:-30),{size:24,color:CB,anchor:Math.cos(t)>0?'start':'end',weight:700}));});
  s+=card(760,140,390,220,label('分かったのは',955,205,{size:28,color:C.dim,anchor:'middle'})+label('一周の和 だけ',955,265,{size:34,color:C.hi,anchor:'middle',weight:700})+label('各点の B は まだ',955,320,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.25),C.faint);
  return s;
 },
 [K+'coil']:(p)=>{
  let s=label('初級 26：n ＝ N / l（1 m あたりの巻数）',60,50,{size:26,color:C.dim});
  s+=coilCut({g:seg(p,.2,.5)});
  return s;
 },
 [K+'count']:(p)=>{
  let s=coilCut({rect0:seg(p,.05,.2),Lg:seg(p,.15,.3),count:seg(p,.25,.5)});
  s+=card(850,40,320,70,label('n ＝ 200 /m',1010,86,{size:28,color:C.ink,anchor:'middle',weight:700}),1,C.faint);
  s+=fade(seg(p,.45,.6),label('nL ＝ 20 本',520,CO.yt+72,{size:30,color:AL,anchor:'middle',weight:700}));
  s+=card(850,150,320,110,T(`${Ic}=20\\times 2\\ \\mathrm{A}`,1010,195,{size:32})+T(`=40\\ \\mathrm{A}`,1010,240,{size:32,color:C.hi}),seg(p,.65,.85),C.hi);
  return s;
 },
 [K+'coilnote']:(p)=>{
  let s=coilCut({rect0:1,Lg:1,count:1,g:.25});
  s+=card(180,120,840,260,label('巻数 ＝ 長さ × n で 数える',600,200,{size:32,color:C.hi,anchor:'middle',weight:700})+label('この数え方で 長いコイルの 中の 磁場を 導く',600,275,{size:26,color:C.ink,anchor:'middle'})+label('→ 上級',600,335,{size:30,color:C.dim,anchor:'middle',weight:700}),seg(p,.05,.25),C.faint);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'summary']:(p)=>{
  let s=loopC({field:.4,steps:1,hl:1,dimSteps:.4,Bhl:1,c:{x:250,y:262}});
  s+=card(560,120,610,240,label('沿う部分 × 長さ を 一周 足す',865,185,{size:28,color:AL,anchor:'middle',weight:700})+T(`\\sum_i ${Bi}\\cdot${Dri}\\ \\to\\ ${OINT}`,865,280,{size:38}),seg(p,.1,.3),C.faint);
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=T(LAW,600,160,{size:72});
  s+=card(200,280,800,170,label('定常電流 ・ I は 右手の約束で 符号を 付けた',600,345,{size:28,color:C.ink,anchor:'middle'})+label('面を 貫く 電流の 合計',600,400,{size:30,color:CI,anchor:'middle',weight:700}),seg(p,.2,.4),C.faint);
  return s;
 },
 [K+'next']:(p)=>{
  let s=topWire({rQ:seg(p,.3,.5)});
  s+=card(700,100,450,260,T(LAW,925,170,{size:34})+fade(seg(p,.4,.6),arrow(925,210,925,260,{color:C.hi,w:4,head:14})+T(`${cs(CB,'B')}(r)=\\ ?`,925,315,{size:44,color:C.hi})),seg(p,.1,.3),C.faint);
  s+=fade(seg(p,.6,.8),label('1行で 出せるか？',925,420,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
};
