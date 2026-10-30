// 単元「振り子と振動」 — pictures. Viewbox 1200×515.
// Colours: x cyan, v purple, a red, F green, t gold, energy orange. Length of the string is ℓ.
// Pendulum geometry: pivot (px,py), angle θ from the downward vertical, bob at (px+L sinθ, py+L cosθ).
import {C,clamp,mix,smooth,seg,lin,fmt,fade,label,line,rect,dot,ring,draw,poly,arrow,axes,ground,wall,spring,tex,texWidth} from './anim.mjs';

const DEG=Math.PI/180,TAU=2*Math.PI;
const bobAt=(px,py,L,th)=>[px+L*Math.sin(th),py+L*Math.cos(th)];
function ceiling(px,py,w=120){let s=line(px-w/2,py,px+w/2,py,{color:C.dim,w:4});for(let q=px-w/2+6;q<px+w/2;q+=18)s+=line(q,py,q+12,py-14,{color:C.faint,w:2});return s+dot(px,py,6,C.dim);}
function pendulum(px,py,L,th,{r=22,color=C.x,fo=.55,text='',tsize=22,ghost=false}={}){
 const [bx,by]=bobAt(px,py,L,th),o=ghost?.35:1;
 return fade(o,line(px,py,bx,by,{color:C.ink,w:3})+`<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${r}" fill="${color}" fill-opacity="${fo}" stroke="${color}" stroke-width="3"/>`+(text?label(text,bx,by+tsize*.36,{size:tsize,color:C.ink,anchor:'middle'}):''));
}
// Arc from the downward vertical (angle 0) to angle th, around (cx,cy).
function angArc(cx,cy,r,th0,th1,{color=C.t,w=3,p=1}={}){const n=40,pts=[];for(let i=0;i<=n;i++){const a=mix(th0,th1,i/n);pts.push([cx+r*Math.sin(a),cy+r*Math.cos(a)]);}return draw(pts,p,{color,w});}
function tangent(th){return [Math.cos(th),-Math.sin(th)];} // direction of increasing θ on screen
function tr(v,[x,y],L){return [x+v[0]*L,y+v[1]*L];}
// TeX pieces placed left to right; returns centres so boxes/strikes can be drawn over them.
function texRow(pieces,x,y,size,{anchor='start',gap=.25,opacity=1}={}){
 const ws=pieces.map(s=>texWidth(s,size)),total=ws.reduce((a,b)=>a+b,0)+gap*size*(pieces.length-1);
 let cx=anchor==='middle'?x-total/2:anchor==='end'?x-total:x;const pos=[];let svg='';
 pieces.forEach((s,i)=>{pos.push({x:cx,w:ws[i],c:cx+ws[i]/2});svg+=tex(s,cx+ws[i]/2,y,{size,opacity});cx+=ws[i]+gap*size;});
 return {svg,pos,total};
}
function fitTex(src,x,y,size,maxW,o={}){const w=texWidth(src,size);return tex(src,x,y,{...o,size:w>maxW?size*maxW/w:size});}
function box(x,y,w,h,g,color=C.hi){return fade(g,`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="8" fill="${color}" fill-opacity=".1" stroke="${color}" stroke-width="2.5"/>`);}
function rk4(f,y0,T,dt){const out=[y0.slice()];let y=y0.slice();const n=Math.round(T/dt);
 for(let i=0;i<n;i++){const t=i*dt,k1=f(t,y),k2=f(t+dt/2,y.map((v,j)=>v+dt/2*k1[j])),k3=f(t+dt/2,y.map((v,j)=>v+dt/2*k2[j])),k4=f(t+dt,y.map((v,j)=>v+dt*k3[j]));y=y.map((v,j)=>v+dt/6*(k1[j]+2*k2[j]+2*k3[j]+k4[j]));out.push(y.slice());}
 return {dt,out,at:t=>{const u=clamp(t/dt,0,out.length-1),i=Math.min(out.length-2,Math.floor(u)),r=u-i;return out[i].map((v,j)=>mix(v,out[i+1][j],r));}};}

// ---- intro ------------------------------------------------------------------------
const E_P=[330,40],E_L=300,E_TH0=40*DEG;
function energyBars(th,{x0=760,base=410,H=290,sum=false,g=1}){
 const tot=1-Math.cos(E_TH0),U=(1-Math.cos(th))/tot,K=(Math.cos(th)-Math.cos(E_TH0))/tot;let s='';
 const bw=90;
 s+=rect(x0,base-H*U,bw,H*U,{fill:C.E,fo:.55,rx:3});
 s+=rect(x0+140,base-H*K,bw,H*K,{fill:C.v,fo:.55,rx:3});
 s+=line(x0-20,base,x0+390,base,{color:C.dim,w:2.5});
 s+=label('位置',x0+bw/2,base+34,{size:24,color:C.E,anchor:'middle'})+tex('U',x0+bw/2,base+66,{size:30,color:C.E,auto:false});
 s+=label('運動',x0+140+bw/2,base+34,{size:24,color:C.v,anchor:'middle'})+tex('K',x0+140+bw/2,base+66,{size:30,color:C.v,auto:false});
 if(sum){
  const X=x0+280;
  s+=fade(g,rect(X,base-H*U,bw,H*U,{fill:C.E,fo:.55,rx:3})+rect(X,base-H,bw,H*K,{fill:C.v,fo:.55,rx:3})+label('合計',X+bw/2,base+34,{size:24,color:C.hi,anchor:'middle'})
   +line(x0-20,base-H,X+bw+20,base-H,{color:C.hi,w:3,dash:'10 7'}));
 }
 return s;
}
export const shmDiagrams={
 'sh-swing':(p)=>{
  const [px,py]=[600,45],L=330,th0=35*DEG;
  // A hand pulls the bob aside, then lets go; it swings through the middle to the other side.
  const pull=seg(p,0,.2),ph=TAU*1.25*lin(p,.25,1),th=p<.25?th0*pull:th0*Math.cos(ph);
  let s=ceiling(px,py)+angArc(px,py,L,-th0,th0,{color:C.faint,w:2})+line(px,py,px,py+L+40,{color:C.faint,w:2,dash:'6 8'});
  s+=pendulum(px,py,L,th,{r:26});
  if(p<.25){const [bx,by]=bobAt(px,py,L,th);s+=fade(1-seg(p,.2,.25),arrow(bx-10,by,bx+60,by,{color:C.hi,w:4,head:14})+label('引いて',bx+70,by+8,{size:24,color:C.hi}));}
  s+=fade(seg(p,.3,.4),label('放すと…',px+230,90,{size:28,color:C.hi}));
  return s+fade(seg(p,.6,.75),label('真ん中を通り過ぎて、反対側へ',px,480,{size:28,color:C.hi,anchor:'middle'}))+label('糸',px+95,200,{size:24,color:C.dim});
 },
 'sh-fo:two':(p)=>forces(p,1),'sh-fo:split':(p)=>forces(p,2),'sh-fo:arc':(p)=>forces(p,3),
 'sh-e:bottom':(p)=>{
  // Slow motion near the bottom: phase crawls through π/2 in the middle of the cue.
  const [px,py]=E_P,L=E_L,ph=p<.35?mix(0,TAU/4-.06,smooth(p/.35)):p<.7?mix(TAU/4-.06,TAU/4+.06,(p-.35)/.35):mix(TAU/4+.06,TAU/2,smooth((p-.7)/.3));
  const th=E_TH0*Math.cos(ph),om=-E_TH0*Math.sin(ph),[bx,by]=bobAt(px,py,L,th),tg=tangent(th);
  let s=ceiling(px,py)+angArc(px,py,L,-E_TH0,E_TH0,{color:C.faint,w:2})+line(px,py,px,py+L+40,{color:C.faint,w:2,dash:'6 8'})+pendulum(px,py,L,th,{r:24});
  const F=-Math.sin(th)*260,V=om*190;
  if(Math.abs(F)>2)s+=arrow(bx,by,...tr(tg,[bx,by],F),{color:C.F,w:6,head:16});
  const vb=[bx-Math.sin(th)*44,by-Math.cos(th)*44];if(Math.abs(V)>2)s+=arrow(...vb,...tr(tg,vb,V),{color:C.v,w:6,head:16});
  const near=p>.33&&p<.72?seg(p,.33,.4)*(1-seg(p,.66,.72)):0;
  s+=label('円に沿う力',760,150,{size:28,color:C.F})+tex(`${fmt(Math.abs(Math.sin(th))/Math.sin(E_TH0)*10,1)}`,1060,142,{size:36,color:C.F,auto:false});
  s+=label('速さ',760,230,{size:28,color:C.v})+tex(`${fmt(Math.abs(om)/E_TH0*10,1)}`,1060,222,{size:36,color:C.v,auto:false});
  s+=label('（端の力・真ん中の速さを 10 とする）',760,285,{size:22,color:C.dim});
  s+=fade(near,rect(730,330,420,120,{fill:C.hi,fo:.08,stroke:C.hi,rx:12})+label('真ん中：力 0、速さ 最大',940,380,{size:28,color:C.hi,anchor:'middle'})+label('止まらずに通り過ぎる',940,425,{size:26,color:C.hi,anchor:'middle'}));
  return s;
 },
 'sh-e:bars':(p)=>swingBars(p,false),
 'sh-e:bars2':(p)=>swingBars(p,false),
 'sh-e:sum':(p)=>swingBars(p,true),
 'sh-sin:graph':(p)=>sinGraph(p,false),
 'sh-sin:zoom':(p)=>sinGraph(p,true),
 'sh-sin:spring':(p)=>{
  const ph=TAU*2*lin(p,.05,1),u=Math.sin(ph);
  const [px,py]=[260,50],L=300,th=12*DEG*u,[bx,by]=bobAt(px,py,L,th);
  let s=ceiling(px,py)+line(px,py,px,py+L+30,{color:C.faint,w:2,dash:'6 8'})+pendulum(px,py,L,th,{r:22});
  s+=arrow(bx,by,...tr(tangent(th),[bx,by],-th/(12*DEG)*110),{color:C.F,w:6,head:16});
  s+=tex('-mg\\,\\theta',px,460,{size:38,color:C.F,auto:false})+label('振り子',px-90,120,{size:24,color:C.dim,anchor:'middle'});
  const wx=640,y0=290,x=900+90*u;
  s+=wall(wx,y0-80,y0+40)+ground(wx,1170,y0+40)+spring(wx,x-55,y0-20,{coils:8})+rect(x-55,y0-60,110,100,{fill:C.x,fo:.35,rx:8});
  s+=arrow(x,y0-90,x-u*110,y0-90,{color:C.F,w:6,head:16})+line(900,y0+50,900,y0+70,{color:C.dim,w:2});
  s+=tex('-kx',900,460,{size:38,color:C.F,auto:false})+label('ばね',900,120,{size:24,color:C.dim,anchor:'middle'});
  return s+fade(seg(p,.4,.6),label('ずれと逆向き、ずれに比例',600,40,{size:28,color:C.hi,anchor:'middle'}));
 },
};
function forces(p,stage){
 const [px,py]=[420,40],L=300,th=35*DEG,[bx,by]=bobAt(px,py,L,th),G=165;
 const rad=[Math.sin(th),Math.cos(th)],tg=[-Math.cos(th),Math.sin(th)]; // outward along string, restoring along arc
 let s=ceiling(px,py)+angArc(px,py,L,-45*DEG,45*DEG,{color:C.faint,w:2})+line(px,py,px,py+L+30,{color:C.faint,w:2,dash:'6 8'});
 s+=angArc(px,py,70,0,th,{color:C.t,w:3})+tex('\\theta',px+32,py+105,{size:30,color:C.t,auto:false});
 s+=pendulum(px,py,L,th,{r:24});
 const gT=stage===1?seg(p,.05,.35):1,gG=stage===1?seg(p,.4,.7):1;
 const dimOther=stage===3?1-.6*seg(p,.05,.3):1;
 const Tlen=G*Math.cos(th); // at the turning point the bob is at rest: T = mg cosθ
 s+=fade(dimOther,arrow(bx,by,bx-rad[0]*Tlen,by-rad[1]*Tlen,{color:C.F,w:6,head:18,g:gT}));
 s+=fade(gT*dimOther,label('張力',bx-rad[0]*Tlen+28,by-rad[1]*Tlen+6,{size:26,color:C.F})+tex('T',bx-rad[0]*Tlen+88,by-rad[1]*Tlen+4,{size:32,color:C.F,auto:false,anchor:'start'}));
 s+=arrow(bx,by,bx,by+G,{color:C.F,w:6,head:18,g:gG});
 s+=fade(gG,label('重力',bx+16,by+G-8,{size:26,color:C.F})+tex('mg',bx+44,by+G+28,{size:32,color:C.F,auto:false}));
 if(stage===1)s+=fade(seg(p,.7,.95),label('おもりに働く力は、この二つだけ',1160,90,{size:28,color:C.hi,anchor:'end'}));
 if(stage>=2){
  const g=stage===2?seg(p,.1,.5):1;
  const R=G*Math.cos(th),Tn=G*Math.sin(th),rT=[bx+rad[0]*R,by+rad[1]*R],tT=[bx+tg[0]*Tn,by+tg[1]*Tn];
  s+=fade(g*.8,line(...rT,bx,by+G,{color:C.F,w:2,dash:'6 6'})+line(...tT,bx,by+G,{color:C.F,w:2,dash:'6 6'}));
  s+=fade(dimOther,arrow(bx,by,...rT,{color:'#5fc79d',w:5,head:15,g}))+arrow(bx,by,...tT,{color:stage===3?C.hi:'#5fc79d',w:stage===3?7:5,head:16,g});
  s+=fade(g*dimOther,label('糸に沿う分',rT[0]+14,rT[1]+10,{size:24,color:'#5fc79d'}));
  s+=fade(g,label('円に沿う分',tT[0]-12,tT[1]+34,{size:24,color:stage===3?C.hi:'#5fc79d',anchor:'end'}));
  s+=fade(seg(p,stage===2?.45:0,stage===2?.7:.01),angArc(bx,by,52,0,th,{color:C.t,w:2.5})+tex('\\theta',bx+26,by+80,{size:26,color:C.t,auto:false}));
  if(stage===2)s+=fade(seg(p,.6,.9),label('重力を、二つの向きに分ける',1160,90,{size:28,color:C.hi,anchor:'end'}));
 }
 if(stage===3){
  const g=seg(p,.3,.55),g2=seg(p,.6,.85);
  s+=fade(g,rect(760,120,400,130,{fill:C.F,fo:.06,stroke:'#5fc79d',rx:12})+label('糸に沿う分',785,165,{size:24,color:'#5fc79d'})+label('張力と向きが逆。',785,203,{size:24,color:C.ink})+label('おもりを円の上に保つだけ',785,235,{size:24,color:C.ink}));
  s+=fade(g2,rect(760,280,400,160,{fill:C.hi,fo:.08,stroke:C.hi,rx:12})+label('円に沿う分',785,325,{size:24,color:C.hi})+tex('-mg\\sin\\theta',960,380,{size:42,color:C.hi,auto:false})+label('これが真ん中へ戻す',960,428,{size:24,color:C.hi,anchor:'middle'}));
 }
 return s;
}
function swingBars(p,sum){
 const [px,py]=E_P,L=E_L,ph=Math.PI+TAU*lin(p,0,1),th=E_TH0*Math.cos(ph),[bx,by]=bobAt(px,py,L,th);
 const yEnd=py+L*Math.cos(E_TH0),yBot=py+L;
 let s=ceiling(px,py)+angArc(px,py,L,-E_TH0,E_TH0,{color:C.faint,w:2})+pendulum(px,py,L,th,{r:24});
 s+=line(px-230,yBot+24,px+230,yBot+24,{color:C.faint,w:2,dash:'6 8'})+label('いちばん低い',px+240,yBot+32,{size:22,color:C.dim});
 s+=line(bx,by+24,bx,yBot+24,{color:C.E,w:3,dash:'4 5'})+label('高さ',bx-8,yBot+50,{size:22,color:C.E,anchor:'end'});
 const om=-E_TH0*Math.sin(ph),V=om*190;
 if(Math.abs(V)>2)s+=arrow(bx,by,...tr(tangent(th),[bx,by],V),{color:C.v,w:6,head:16});
 s+=energyBars(th,{sum,g:sum?seg(p,0,.25):0});
 if(!sum)s+=fade(seg(p,.2,.4),label('端：全部 U',650,60,{size:26,color:C.E})+label('真ん中：全部 K',650,100,{size:26,color:C.v}));
 if(sum)s+=fade(seg(p,.3,.5),label('合計は、いつも同じ高さ',1180,80,{size:28,color:C.hi,anchor:'end'}));
 return s;
}
function sinGraph(p,zoom){
 const z=zoom?mix(1.6,.25,seg(p,0,.4)):1.6;
 const ticks=z>.8?[0.5,1,1.5]:[0.1,0.2];
 const A=axes({x:110,y:450,w:600,h:380,xmax:z,ymax:z,xlabel:'θ',ylabel:'',xticks:ticks,yticks:ticks,grid:true,g:zoom?1:seg(p,0,.2),xcolor:C.t});
 let s=A.svg;
 const pa=zoom?1:seg(p,.15,.55),pb=zoom?1:seg(p,.35,.75);
 s+=A.plot(u=>u,{from:0,to:z,p:pa,color:C.t,w:4})+A.plot(u=>Math.sin(u),{from:0,to:z,p:pb,color:C.F,w:4});
 s+=fade(pa,tex('y=\\theta',A.X(z*.4)-12,A.Y(z*.4)-26,{size:30,color:C.t,auto:false,anchor:'end'}));
 s+=fade(pb,tex('y=\\sin\\theta',A.X(z*.9)+14,A.Y(Math.sin(z*.9))+52,{size:30,color:C.F,auto:false,anchor:'start'}));
 if(!zoom){
  const g=seg(p,.7,.95);
  s+=fade(g,line(A.X(1),A.Y(Math.sin(1)),A.X(1),A.Y(1),{color:C.a,w:4})+label('θ = 1 で 0.84：ずれが大きい',A.X(1)-12,A.Y(1.14),{size:22,color:C.a,anchor:'end'}));
  s+=fade(seg(p,.8,1),label('大きい角度では、',1150,170,{size:26,color:C.dim,anchor:'end'})+label('二本は離れていく',1150,210,{size:26,color:C.dim,anchor:'end'}));
  return s;
 }
 const g1=seg(p,.4,.6),g2=seg(p,.6,.8);
 s+=fade(g1,dot(A.X(.1),A.Y(.0998),8,C.hi)+line(A.X(.1),A.Y(0),A.X(.1),A.Y(.0998),{color:C.hi,w:2,dash:'5 6'}));
 s+=fade(g2,dot(A.X(.2),A.Y(.1987),8,C.hi));
 const tx=850,ty=150;
 s+=fade(g1,label('θ（ラジアン）',tx,ty,{size:24,color:C.t})+label('sin θ',tx+240,ty,{size:24,color:C.F})+line(tx,ty+14,tx+360,ty+14,{color:C.faint,w:2}));
 s+=fade(g1,tex('0.1',tx+60,ty+58,{size:34,auto:false})+tex('0.0998',tx+280,ty+58,{size:34,color:C.F,auto:false}));
 s+=fade(g2,tex('0.2',tx+60,ty+118,{size:34,auto:false})+tex('0.199',tx+280,ty+118,{size:34,color:C.F,auto:false}));
 s+=fade(seg(p,.75,.95),label('0.1 ラジアン ≈ 6°',tx,ty+200,{size:26,color:C.dim})+label('ほとんど重なる',tx,ty+250,{size:30,color:C.hi,weight:700}));
 return s;
}

// ---- middle -----------------------------------------------------------------------
const PEND_BIG=[3,'3 kg',30],PEND_SMALL=[.5,'0.5 kg',17];
Object.assign(shmDiagrams,{
 'sh-m:race':(p)=>{
  const ph=TAU*2*lin(p,.1,1),th=25*DEG*Math.cos(ph),L=300;let s='';
  [[330,PEND_BIG,'#a9b8d0'],[870,PEND_SMALL,'#d9b37a']].forEach(([px,[m,txt,r],col],i)=>{
   s+=ceiling(px,50)+line(px,50,px,50+L+40,{color:C.faint,w:2,dash:'6 8'})+pendulum(px,50,L,th,{r,color:col,fo:.7});
   s+=label(i?'軽い球':'重い球',px,445,{size:26,color:C.ink,anchor:'middle'})+label(txt,px,482,{size:24,color:C.dim,anchor:'middle'});
   const [mx,my]=bobAt(px,50,L/2,th);s+=tex('\\ell',mx-24,my+6,{size:30,color:C.x,auto:false});
  });
  return s+fade(seg(p,.55,.75),label('糸の長さが同じなら、そろって往復',600,40,{size:28,color:C.hi,anchor:'middle'}));
 },
 'sh-m:arc':(p)=>{
  const [px,py]=[340,50],L=300,th=1*seg(p,.05,.6),[bx,by]=bobAt(px,py,L,th);
  let s=ceiling(px,py)+line(px,py,px,py+L+30,{color:C.faint,w:2,dash:'6 8'});
  s+=angArc(px,py,L,0,Math.max(th,.001),{color:C.x,w:7});
  s+=angArc(px,py,60,0,Math.max(th,.001),{color:C.t,w:3})+fade(seg(p,.1,.2),tex('\\theta',px+18,py+100,{size:28,color:C.t,auto:false}));
  s+=pendulum(px,py,L,th,{r:22});
  const [mx,my]=bobAt(px,py,L/2,th);s+=tex('\\ell',mx+22,my-8,{size:32,color:C.ink,auto:false});
  const [ax,ay]=bobAt(px,py,L+34,th/2);s+=fade(seg(p,.15,.3),tex('s',ax,ay+8,{size:34,color:C.x,auto:false}));
  // Right: the string length ℓ and the unrolled arc s = ℓθ, side by side.
  const X0=730,W=300;
  s+=line(X0,170,X0+W,170,{color:C.ink,w:6})+label('糸の長さ',X0,140,{size:24,color:C.dim})+tex('\\ell',X0+W+30,178,{size:32,color:C.ink,auto:false});
  s+=line(X0,270,X0+W*th,270,{color:C.x,w:8})+label('弧の長さ',X0,240,{size:24,color:C.x})+tex('s',X0+W*th+30,278,{size:32,color:C.x,auto:false});
  s+=tex(`\\theta=${fmt(th,2)}`,X0+60,350,{size:34,color:C.t,auto:false,anchor:'start'});
  s+=fade(seg(p,.6,.75),label('θ = 1 のとき、弧の長さ ＝ 糸の長さ',X0-20,410,{size:24,color:C.hi}));
  return s+fade(seg(p,.75,.95),tex('s=\\ell\\,\\theta',X0+150,470,{size:44,color:C.x,auto:false}));
 },
 'sh-mc:both':(p)=>massCancel(p,1),'sh-mc:cancel':(p)=>massCancel(p,2),
 'sh-mc:spring':(p)=>{
  const size=46,rowA=['x\'\'','=','-','\\dfrac{k}{m}','x'],rowB=['\\theta\'\'','=','-','\\dfrac{g}{\\ell}','\\theta'];
  const A=texRow(rowA,420,120,size,{anchor:'start'}),B=texRow(rowB,420,280,size,{anchor:'start'});
  let s=fade(seg(p,0,.2),label('ばね',250,132,{size:28,color:C.dim,anchor:'end'})+A.svg)+fade(seg(p,.15,.35),label('振り子',250,292,{size:28,color:C.dim,anchor:'end'})+B.svg);
  const g=seg(p,.35,.55),a=A.pos[3],b=B.pos[3];
  s+=box(a.x-12,120-62,a.w+24,110,g)+box(b.x-12,280-62,b.w+24,110,g);
  s+=arrow(a.c,176,b.c,214,{color:C.hi,w:3,head:12,g});
  s+=fade(g,label('同じ場所',b.x+b.w+70,210,{size:24,color:C.hi}));
  const g2=seg(p,.65,.9);
  s+=fade(g2,rect(360,380,480,100,{fill:C.v,fo:.08,stroke:C.v,rx:14})+tex('\\omega^2=\\dfrac{g}{\\ell}',600,432,{size:46,color:C.ink}));
  s+=fade(g2,label('ω（オメガ）',880,420,{size:24,color:C.v})+label('1秒あたりに進む角度',880,455,{size:22,color:C.dim}));
  return s;
 },
 'sh-mt:circle':(p)=>{
  const cx=320,cy=250,R=160,ph=TAU*seg(p,.1,.8);
  let s=ring(cx,cy,R,{color:C.faint,w:2})+line(cx-R-30,cy,cx+R+30,cy,{color:C.faint,w:1.5})+line(cx,cy-R-30,cx,cy+R+30,{color:C.faint,w:1.5});
  const pts=[];for(let i=0;i<=80;i++){const a=ph*i/80;pts.push([cx+70*Math.cos(a),cy-70*Math.sin(a)]);}
  s+=draw(pts,1,{color:C.v,w:5});
  const X=cx+R*Math.cos(ph),Y=cy-R*Math.sin(ph);
  s+=line(cx,cy,X,Y,{color:C.ink,w:3})+dot(X,Y,12,C.hi)+line(X,Y,X,cy+R+50,{color:C.hi,w:1.5,dash:'5 6'});
  s+=line(cx-R,cy+R+50,cx+R,cy+R+50,{color:C.dim,w:2})+dot(X,cy+R+50,10,C.x)+label('影は往復する',cx+R+20,cy+R+58,{size:22,color:C.x});
  s+=label('進んだ角度',720,110,{size:26,color:C.v})+tex(`${fmt(ph,2)}`,1010,104,{size:36,color:C.v,auto:false,anchor:'start'});
  s+=fade(seg(p,.05,.2),label('1秒あたりに進む角度 ＝ ω',720,180,{size:26,color:C.ink}));
  const g=seg(p,.8,.95);
  s+=fade(g,label('1往復 ＝ ちょうど1周 ＝ 2π',720,260,{size:26,color:C.hi}));
  return s+fade(seg(p,.85,1),rect(740,310,380,100,{fill:C.v,fo:.08,stroke:C.v,rx:14})+tex('\\omega T=2\\pi',930,362,{size:46,auto:false}));
 },
 'sh-mt:num':(p)=>{
  const time=8*lin(p,.05,.95),g=9.8;let s='';
  [[380,1,90],[820,4,360]].forEach(([px,l,L])=>{
   const w=Math.sqrt(g/l),th=12*DEG*Math.cos(w*time),T=TAU/w;
   s+=ceiling(px,40)+pendulum(px,40,L,th,{r:18});
   s+=label(`ℓ = ${l} m`,px+(l===1?60:80),l===1?110:220,{size:26,color:C.ink});
   s+=label(`往復 ${Math.floor(time/T+1e-6)} 回`,px+(l===1?60:80),l===1?150:260,{size:24,color:C.t});
   s+=fade(seg(p,.2,.35),rect(px-115,440,230,54,{fill:C.t,fo:.1,stroke:C.t,rx:10})+label(`周期 ${T.toFixed(1)} s`,px,476,{size:26,color:C.t,anchor:'middle'}));
  });
  s+=label('時刻',40,60,{size:24,color:C.t})+tex(`${fmt(time,1)}\\,\\mathrm{s}`,100,54,{size:32,color:C.t,auto:false,anchor:'start'});
  return s+fade(seg(p,.7,.9),label('長さ 4倍 → 周期 2倍',1170,120,{size:28,color:C.hi,anchor:'end'}));
 },
 'sh-mt:large':(p)=>{
  const time=6*T0*lin(p,.05,.95);let s='';
  [[330,10],[870,60]].forEach(([px,amp])=>{
   const th=amp===60?BIG.at(time)[0]:10*DEG*Math.cos(W0*time);
   s+=ceiling(px,50)+angArc(px,50,280,-amp*DEG,amp*DEG,{color:C.faint,w:2})+line(px,50,px,360,{color:C.faint,w:2,dash:'6 8'})+pendulum(px,50,280,th,{r:20});
   s+=label(`${amp}° から放す`,px,420,{size:26,color:C.ink,anchor:'middle'});
  });
  s+=fade(seg(p,.1,.25),label('周期 2.0 s',330,462,{size:24,color:C.t,anchor:'middle'})+label('周期 約 2.15 s',870,462,{size:24,color:C.t,anchor:'middle'}));
  return s+fade(seg(p,.55,.8),label('大きく振ると、だんだん遅れる（約 7%）',600,500,{size:26,color:C.hi,anchor:'middle'}));
 },
});
const W0=Math.sqrt(9.8),T0=TAU/W0;
const BIG=rk4((t,[th,om])=>[om,-9.8*Math.sin(th)],[60*DEG,0],7*T0,.002);
function massCancel(p,stage){
 const size=48,pieces=['m','\\ell\\theta\'\'','=','-','m','g\\sin\\theta'];
 const R=texRow(pieces,600,80,size,{anchor:'middle'});
 let s=R.svg;
 const gm=stage===1?seg(p,.05,.3):1;
 [0,4].forEach(i=>{const q=R.pos[i];s+=box(q.x-8,80-44,q.w+16,70,gm);
  if(stage===2){const g=seg(p,.05,.35);s+=fade(g,line(q.x-10,80+22,q.x+q.w+10,80-40,{color:C.a,w:5}));}});
 if(stage===1)s+=fade(seg(p,.2,.4),label('動きにくさ',R.pos[0].c,150,{size:22,color:C.hi,anchor:'middle'})+label('引かれる強さ',R.pos[4].c,150,{size:22,color:C.hi,anchor:'middle'}));
 if(stage===2)s+=fade(seg(p,.35,.55),label('両辺を m で割る',R.pos[2].c,150,{size:24,color:C.a,anchor:'middle'}));
 const th=30*DEG,L=230;
 [[330,PEND_BIG,'#a9b8d0'],[870,PEND_SMALL,'#d9b37a']].forEach(([px,[m,txt,r],col],i)=>{
  const py=170,[bx,by]=bobAt(px,py,L,th),tg=[-Math.cos(th),Math.sin(th)];
  s+=ceiling(px,py,90)+line(px,py,px,py+L+20,{color:C.faint,w:2,dash:'6 8'})+pendulum(px,py,L,th,{r,color:col,fo:.7});
  s+=label(txt,bx+r+12,by-10,{size:24,color:C.dim});
  const Fl=m*45,al=70;
  const u=stage===2?seg(p,.45,.8):0;
  const len=mix(Fl,al,u),col2=u<.5?C.F:C.a;
  s+=arrow(bx,by,bx+tg[0]*len,by+tg[1]*len,{color:col2,w:6,head:16});
  const lx=px-(i?100:115),ly=470;
  if(stage===1)s+=fade(seg(p,.45,.7),label(i?'戻す力 小':'戻す力 大（6倍）',lx,ly,{size:24,color:C.F}));
  if(stage===1)s+=fade(seg(p,.7,.95),label(i?'動きにくさ 小':'動きにくさ 大（6倍）',lx,ly+32,{size:24,color:C.dim}));
  if(stage===2)s+=fade(seg(p,.7,.9),label('加速度 同じ',lx,ly,{size:24,color:C.a}));
 });
 if(stage===2)s+=fade(seg(p,.8,1),tex('\\ell\\theta\'\'=-g\\sin\\theta',600,305,{size:40,auto:false,color:C.hi}));
 return s;
}

// ---- advanced: forced, damped oscillation (m=1 kg, k=4 N/m, F0=1 N) --------------
const M=1,K=4,F0=1;
const forced=(b,Om,T)=>rk4((t,[x,v])=>[v,(F0*Math.cos(Om*t)-b*v-K*x)/M],[0,0],T,.005);
const ampOf=(b,Om)=>F0/Math.sqrt((K-M*Om*Om)**2+(b*Om)**2);
const SIM04=forced(.4,2,32);
function springBlock(x,{y=150,wx=110,eq=560,sc=60,F=null,V=null,label:lab=''}={}){
 const X=eq+sc*x;let s=wall(wx,y-70,y+30)+ground(wx,1150,y+30)+spring(wx,X-50,y-20,{coils:9})+rect(X-50,y-70,100,100,{fill:C.x,fo:.35,rx:8})+label('1 kg',X,y-10,{size:22,color:C.ink,anchor:'middle'});
 s+=line(eq,y+36,eq,y+52,{color:C.dim,w:2});
 if(F!==null&&Math.abs(F)>2)s+=arrow(X,y-90,X+F,y-90,{color:C.F,w:6,head:15});
 if(V!==null&&Math.abs(V)>2)s+=arrow(X,y+60,X+V,y+60,{color:C.v,w:6,head:15});
 return s;
}
Object.assign(shmDiagrams,{
 'sh-a:setup':(p)=>{
  const t=TAU*1.5*lin(p,0,1)/1,tt=t,x=1.25*Math.sin(2*tt)*.6,F=Math.cos(2*tt);
  let s=springBlock(x,{y:200,sc:70,F:F*90});
  s+=label('押す力',640,70,{size:24,color:C.F})+tex('F_0\\cos\\Omega t',760,64,{size:32,anchor:'start'});
  s+=fade(seg(p,.05,.2),label('ばね定数 k = 4 N/m',150,300,{size:24,color:C.dim}));
  // A swing beside it: the same restoring-force equation for small swings.
  const [px,py]=[1000,250],L=140,th=18*DEG*Math.sin(2*tt);
  s+=fade(seg(p,.2,.4),ceiling(px,py-10,80)+pendulum(px,py-10,L,th,{r:14})+label('ブランコ（小さく揺れる）',px,py+175,{size:22,color:C.dim,anchor:'middle'}));
  return s+fade(seg(p,.5,.7),label('同じ形の式で動く',1000,470,{size:24,color:C.hi,anchor:'middle'}))+fade(seg(p,.1,.3),label('Ω（大文字のオメガ）：押すリズム',120,470,{size:24,color:C.t}));
 },
 'sh-a:grow':(p)=>{
  const t=20*lin(p,.02,.95),x=t/4*Math.sin(2*t),v=Math.sin(2*t)/4+t/2*Math.cos(2*t);
  let s=springBlock(x,{y:95,sc:18,eq:500,F:Math.cos(2*t)*60});
  const A=axes({x:90,y:345,w:760,h:150,xmin:0,xmax:20,ymin:-5.5,ymax:5.5,xlabel:'',ylabel:'',xticks:[5,10,15,20],yticks:[],xcolor:C.t});
  // axes() puts the x-axis at y=0 (middle); show ±5 scale.
  s+=A.svg+label('時刻',A.X(20)+30,A.Y(0)+8,{size:22,color:C.t});
  s+=A.plot(u=>u/4,{from:0,to:Math.max(t,.01),color:C.faint,w:2,dash:'6 6'})+A.plot(u=>-u/4,{from:0,to:Math.max(t,.01),color:C.faint,w:2,dash:'6 6'});
  s+=A.plot(u=>u/4*Math.sin(2*u),{from:0,to:Math.max(t,.01),color:C.x,w:3,steps:600})+dot(A.X(t),A.Y(x),7,C.hi);
  s+=label('位置',A.X(0)-12,A.Y(5)+8,{size:22,color:C.x,anchor:'end'});
  const E=.5*K*x*x+.5*M*v*v,H=Math.min(330,E*6.2);
  s+=rect(960,470-H,90,H,{fill:C.E,fo:.55,rx:3})+line(930,470,1080,470,{color:C.dim,w:2.5})+label('揺れの',1005,Math.min(440,470-H-44),{size:22,color:C.E,anchor:'middle'})+label('エネルギー',1005,Math.min(466,470-H-14),{size:22,color:C.E,anchor:'middle'});
  return s+fade(seg(p,.1,.25),label('抵抗 0、Ω = 2',1150,40,{size:24,color:C.hi,anchor:'end'}));
 },
 'sh-a2:push':(p)=>{
  const t=10+6*lin(p,0,1),x=t/4*Math.sin(2*t),v=Math.sin(2*t)/4+t/2*Math.cos(2*t),F=Math.cos(2*t);
  let s=springBlock(x,{y:230,sc:26,eq:600,F:F*110,V:v*22});
  s+=label('押す力',80,120,{size:26,color:C.F})+label('速度',80,330,{size:26,color:C.v});
  s+=fade(seg(p,.1,.25),rect(740,40,420,90,{fill:C.hi,fo:.08,stroke:C.hi,rx:12})+label('力と速度が、ほぼ同じ向き',950,80,{size:26,color:C.hi,anchor:'middle'})+label('→ エネルギーが入る',950,115,{size:24,color:C.E,anchor:'middle'}));
  const E=.5*K*x*x+.5*M*v*v,H=Math.min(260,E*2.7);
  s+=rect(1060,470-H,70,H,{fill:C.E,fo:.55,rx:3})+line(1040,470,1150,470,{color:C.dim,w:2.5})+label('エネルギー',1095,500,{size:22,color:C.E,anchor:'middle'});
  return s+fade(seg(p,.6,.8),label('抵抗がなければ、際限なく育つ',560,470,{size:28,color:C.hi,anchor:'middle'}));
 },
 'sh-b:bal':(p)=>balance(p,1),'sh-b:bal2':(p)=>balance(p,2),
 'sh-b:sim':(p)=>{
  const tEnd=30*lin(p,.02,.9);
  const A=axes({x:90,y:300,w:900,h:190,xmin:0,xmax:30,ymin:-2,ymax:2,xlabel:'',ylabel:'',xticks:[10,20,30],yticks:[],xcolor:C.t});
  let s=A.svg+label('時刻 [s]',A.X(30)+30,A.Y(0)+40,{size:22,color:C.t})+label('位置',A.X(0)-12,A.Y(1.9)+8,{size:22,color:C.x,anchor:'end'});
  s+=line(A.X(0),A.Y(1.25),A.X(30),A.Y(1.25),{color:C.hi,w:2,dash:'8 7'})+line(A.X(0),A.Y(-1.25),A.X(30),A.Y(-1.25),{color:C.hi,w:2,dash:'8 7'});
  s+=label('1.25',A.X(30)+14,A.Y(1.25)+8,{size:24,color:C.hi})+label('−1.25',A.X(30)+14,A.Y(-1.25)+8,{size:24,color:C.hi});
  s+=fade(.5,A.plot(u=>clamp(u/4*Math.sin(2*u),-2.05,2.05),{from:0,to:Math.min(tEnd,8.2),color:C.dim,w:2,steps:300,dash:'3 5'}));
  s+=A.plot(u=>SIM04.at(u)[0],{from:0,to:Math.max(tEnd,.01),color:C.x,w:3,steps:900});
  s+=fade(seg(p,.05,.2),label('点線：抵抗 0（育ち続ける）',100,475,{size:22,color:C.dim}));
  return s+fade(seg(p,.1,.25),label('抵抗 b = 0.4、Ω = 2',640,475,{size:24,color:C.x}))+fade(seg(p,.7,.9),label('振幅 1.25 で一定になる',1150,40,{size:28,color:C.hi,anchor:'end'}));
 },
 'sh-c:sweep':(p)=>resCurve(p,1),'sh-c:bvary':(p)=>resCurve(p,2),
});
function balance(p,stage){
 const A=axes({x:130,y:440,w:700,h:360,xmax:2,ymax:8,xlabel:'振幅',ylabel:'',xticks:[0.5,1,1.5,2],yticks:[2,4,6,8],grid:true,g:stage===1?seg(p,0,.2):1,xcolor:C.x,ycolor:C.E});
 let s=A.svg;
 const gin=stage===1?seg(p,.15,.45):1,gout=stage===1?seg(p,.45,.8):1;
 s+=A.plot(a=>Math.PI*F0*a,{from:0,to:2,p:gin,color:C.F,w:5})+A.plot(a=>Math.PI*.4*2*a*a,{from:0,to:Math.min(2,Math.sqrt(8/(.8*Math.PI))),p:gout,color:C.a,w:5});
 s+=label('1往復で出入りするエネルギー',40,40,{size:24,color:C.E});
 s+=fade(gin,label('押す力が入れる',870,A.Y(5.9),{size:24,color:C.F})+label('振幅に比例',870,A.Y(5.9)+30,{size:22,color:C.F}));
 s+=fade(gout,label('抵抗が奪う',870,A.Y(8.2),{size:24,color:C.a})+label('振幅の二乗に比例',870,A.Y(8.2)+30,{size:22,color:C.a}));
 if(stage===2){
  const a=1.25*seg(p,.05,.6),Ein=Math.PI*a,Eout=.8*Math.PI*a*a;
  s+=line(A.X(a),A.Y(0),A.X(a),A.Y(Math.max(Ein,Eout)),{color:C.hi,w:2,dash:'5 6'});
  s+=dot(A.X(a),A.Y(Ein),9,C.F)+dot(A.X(a),A.Y(Eout),9,C.a);
  if(a<1.2)s+=arrow(A.X(a),A.Y(0)-16,A.X(a)+60,A.Y(0)-16,{color:C.hi,w:4,head:12})+label('入る方が多い → 育つ',A.X(a)+70,A.Y(0)-40,{size:22,color:C.hi});
  s+=fade(seg(p,.6,.8),dot(A.X(1.25),A.Y(1.25*Math.PI),13,C.hi)+label('つり合う：振幅 1.25',A.X(1.25)+16,A.Y(1.25*Math.PI)-22,{size:26,color:C.hi,weight:700}));
 }
 return s+label('b = 0.4、Ω = 2',1150,40,{size:22,color:C.dim,anchor:'end'});
}
function resCurve(p,stage){
 const A=axes({x:130,y:450,w:760,h:380,xmax:4,ymax:2.8,xlabel:'Ω',ylabel:'振幅',xticks:[1,2,3,4],yticks:[0.5,1,1.5,2,2.5],grid:true,g:stage===1?seg(p,0,.15):1,xcolor:C.t,ycolor:C.x});
 let s=A.svg;
 if(stage===1){
  const Om=4*lin(p,.1,.9);
  s+=A.plot(o=>ampOf(.4,o),{from:0,to:Math.max(Om,.01),color:C.x,w:4,steps:300})+dot(A.X(Om),A.Y(ampOf(.4,Om)),9,C.hi);
  s+=line(A.X(Om),A.Y(0),A.X(Om),A.Y(ampOf(.4,Om)),{color:C.hi,w:1.5,dash:'5 6'});
  [[1,'0.33'],[2,'1.25'],[3,'0.19']].forEach(([o,v])=>{const g=Om>=o?1:0;s+=fade(g,dot(A.X(o),A.Y(ampOf(.4,o)),7,C.x)+label(v,A.X(o)+(o===2?18:10),A.Y(ampOf(.4,o))-(o===2?6:14),{size:26,color:C.hi,weight:700}));});
  s+=tex(`\\Omega=${fmt(Om,2)}`,1000,110,{size:34,auto:false});
  return s+label('b = 0.4',1000,170,{size:24,color:C.x,anchor:'middle'});
 }
 const bs=[[.8,'#4fb8d6','0.8',.2],[.4,C.x,'0.4',.4],[.2,'#b6f0ff','0.2',.6]];
 bs.forEach(([b,col,txt,t0])=>{const g=seg(p,t0-.2,t0+.1);s+=A.plot(o=>Math.min(2.85,ampOf(b,o)),{from:0,to:4,p:g,color:col,w:4,steps:400});
  const pk=Math.sqrt(K/M-b*b/(2*M*M)),i=bs.findIndex(q=>q[0]===b),ly=345+i*40;s+=fade(g,dot(A.X(pk),A.Y(ampOf(b,pk)),7,col)+line(930,ly-8,970,ly-8,{color:col,w:5})+label(`b = ${txt} → ${ampOf(b,2).toFixed(2)}`,985,ly,{size:24,color:col}));});
 s+=line(A.X(2),A.Y(0),A.X(2),A.Y(2.7),{color:C.faint,w:2,dash:'6 6'});
 s+=label('Ω = 2 のときの振幅',930,300,{size:22,color:C.dim});
 s+=fade(seg(p,.55,.75),label('b を小さく → 山が高く、鋭く',1170,110,{size:26,color:C.hi,anchor:'end'}));
 return s+fade(seg(p,.75,.95),label('山の頂上は、Ω = 2 よりわずかに左',1170,160,{size:22,color:C.dim,anchor:'end'})+label('b がゼロでない限り、高さは有限',1170,200,{size:24,color:C.hi,anchor:'end'}));
}

// ---- followups: derive the amplitude --------------------------------------------
Object.assign(shmDiagrams,{
 'sh-r:rot':(p)=>rotating(p,1),'sh-r:rot2':(p)=>rotating(p,2),
 'sh-t:k':(p)=>table(p,1),'sh-t:bm':(p)=>table(p,2),'sh-t:sum':(p)=>table(p,3),'sh-t:eqs':(p)=>table(p,4),
 'sh-p:sq':(p)=>{
  const cols=[180,330,450,560,670,780,890,1000,1110],sz=38;let s='';
  const r1=['(PC+QD)^2','=','P^2C^2','+','2PQCD','+','Q^2D^2','=','F_0^2'],r2=['(PD-QC)^2','=','P^2D^2','-','2PQCD','+','Q^2C^2','=','0'];
  const g1=seg(p,0,.2),g2=seg(p,.15,.35);
  r1.forEach((t,i)=>{s+=fade(g1,fitTex(t,cols[i],100,sz,i===0?220:150,{auto:false,color:i===4?C.a:C.ink}));});
  r2.forEach((t,i)=>{s+=fade(g2,fitTex(t,cols[i],200,sz,i===0?220:150,{auto:false,color:i===4?C.a:C.ink}));});
  s+=fade(g1,label('コサインの列を二乗',30,40,{size:22,color:C.dim}))+fade(g2,label('サインの列を二乗',30,150,{size:22,color:C.dim}));
  const gs=seg(p,.35,.55);
  [100,200].forEach(y=>{s+=fade(gs,line(cols[3]-20,y+12,cols[4]+70,y-26,{color:C.a,w:4}));});
  s+=fade(gs,label('プラスとマイナスで消える',cols[4],270,{size:26,color:C.a,anchor:'middle'}));
  s+=fade(seg(p,.5,.6),line(60,300,1160,300,{color:C.dim,w:2}));
  const g3=seg(p,.6,.85);
  s+=fade(g3,label('足すと',60,380,{size:26,color:C.dim})+tex('(P^2+Q^2)(C^2+D^2)=F_0^2',640,380,{size:48,auto:false}));
  return s+fade(seg(p,.7,.9),label('P ＝ k − mΩ²　　Q ＝ bΩ',640,470,{size:24,color:C.dim,anchor:'middle'}));
 },
 'sh-p:tri':(p)=>{
  let s='';
  const g1=seg(p,0,.3),o1=[120,330],Cw=240,Dh=150;
  s+=fade(g1,poly([o1,[o1[0]+Cw,o1[1]],[o1[0]+Cw,o1[1]-Dh]],{fill:C.x,fo:.12,stroke:C.x,sw:3})+rect(o1[0]+Cw-18,o1[1]-18,18,18,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:0}));
  s+=fade(g1,tex('C',o1[0]+Cw/2,o1[1]+40,{size:32,auto:false})+tex('D',o1[0]+Cw+28,o1[1]-Dh/2+10,{size:32,auto:false})+label('振幅',o1[0]+Cw/2-60,o1[1]-Dh/2-24,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(g1,line(o1[0],o1[1],o1[0]+Cw,o1[1]-Dh,{color:C.hi,w:5}));
  s+=fade(seg(p,.15,.35),tex('\\sqrt{C^2+D^2}',o1[0]+Cw/2,o1[1]-Dh-50,{size:34,auto:false,color:C.hi}));
  const g2=seg(p,.3,.6),o2=[700,330],Pw=300,Qh=140;
  s+=fade(g2,poly([o2,[o2[0]+Pw,o2[1]],[o2[0]+Pw,o2[1]-Qh]],{fill:C.F,fo:.1,stroke:C.F,sw:3})+rect(o2[0]+Pw-18,o2[1]-18,18,18,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:0}));
  s+=fade(g2,tex('P=k-m\\Omega^2',o2[0]+Pw/2,o2[1]+42,{size:30,auto:false})+tex('Q=b\\Omega',o2[0]+Pw+70,o2[1]-Qh/2+10,{size:30,auto:false}));
  s+=fade(g2,line(o2[0],o2[1],o2[0]+Pw,o2[1]-Qh,{color:C.F,w:5}))+fade(seg(p,.45,.65),tex('\\sqrt{P^2+Q^2}',o2[0]+Pw/2-40,o2[1]-Qh-50,{size:34,auto:false,color:C.F}));
  const g3=seg(p,.65,.9);
  return s+fade(g3,rect(330,385,540,126,{fill:C.hi,fo:.06,stroke:C.hi,rx:14})+label('振幅',470,458,{size:30,color:C.hi,anchor:'middle'})+tex('=\\dfrac{F_0}{\\sqrt{P^2+Q^2}}',640,468,{size:34,auto:false}));
 },
 'sh-p:check':(p)=>{
  const Om=mix(1,2,seg(p,.1,.7)),P=K-M*Om*Om,Q=.4*Om,H=Math.hypot(P,Q),Aamp=F0/H,sc=90,o=[160,400];
  let s=poly([o,[o[0]+P*sc,o[1]],[o[0]+P*sc,o[1]-Q*sc]],{fill:C.F,fo:.12,stroke:C.F,sw:3})+line(o[0],o[1],o[0]+P*sc,o[1]-Q*sc,{color:C.F,w:5});
  s+=label('P',o[0]+P*sc/2,o[1]+34,{size:26,color:C.F,anchor:'middle'})+label('Q',o[0]+P*sc+14,o[1]-Q*sc/2+8,{size:26,color:C.F});
  s+=label('斜辺',o[0]+P*sc/2-20,o[1]-Q*sc/2-22,{size:22,color:C.F,anchor:'end'});
  const x0=620;
  s+=tex(`\\Omega=${fmt(Om,2)}`,x0,70,{size:34,auto:false,anchor:'start'});
  s+=tex(`P=4-\\Omega^2=${fmt(P,2)}`,x0,135,{size:32,auto:false,anchor:'start'})+tex(`Q=0.4\\,\\Omega=${fmt(Q,2)}`,x0,195,{size:32,auto:false,anchor:'start'});
  s+=tex(`\\sqrt{P^2+Q^2}=${fmt(H,2)}`,x0,260,{size:32,auto:false,anchor:'start',color:C.F});
  s+=label('振幅',x0,368,{size:28,color:C.hi})+tex(`=\\dfrac{1}{${fmt(H,2)}}=${fmt(Aamp,2)}`,x0+70,360,{size:36,auto:false,anchor:'start',color:C.hi});
  const bh=Aamp*140;
  s+=rect(1090,470-bh,60,bh,{fill:C.hi,fo:.4,rx:3})+line(1070,470,1170,470,{color:C.dim,w:2.5})+label('振幅',1120,500,{size:22,color:C.hi,anchor:'middle'});
  return s+fade(seg(p,.72,.9),label('P が 0 → 斜辺は Q だけ → 振幅が最大',600,480,{size:26,color:C.hi,anchor:'middle'}));
 },
});
function rotating(p,stage){
 const cx=300,cy=265,R=stage===1?160:100,ph=TAU*(stage===1?1:.6)*lin(p,.05,1)+(stage===1?0:.5);
 const X=cx+R*Math.cos(ph),Y=cy-R*Math.sin(ph);
 let s=ring(cx,cy,R,{color:C.faint,w:2})+line(cx-190,cy,cx+190,cy,{color:C.faint,w:1.5})+line(cx,cy-200,cx,cy+200,{color:C.faint,w:1.5});
 s+=arrow(cx,cy,X,Y,{color:C.x,w:5,head:16});
 if(stage===1){
  s+=line(X,Y,X,cy,{color:C.x,w:2,dash:'5 6'})+line(X,Y,cx,Y,{color:C.x,w:2,dash:'5 6'})+dot(X,cy,8,C.x)+dot(cx,Y,8,C.x);
  s+=label('横の影',X,cy+36,{size:22,color:C.x,anchor:'middle'})+label('縦の影',cx-14,Y+8,{size:22,color:C.x,anchor:'end'});
  const g=seg(p,.3,.5),vx=-Math.sin(ph),vy=Math.cos(ph);
  s+=arrow(X,Y,X+vx*110,Y-vy*110,{color:C.v,w:5,head:15,g});
  s+=fade(g,label('速度：90° 先を向く',540,470,{size:24,color:C.v}));
  s+=fade(seg(p,.1,.3),label('横の影',620,110,{size:24,color:C.dim})+tex('\\cos\\Omega t',840,104,{size:36,auto:false,color:C.x}));
  s+=fade(seg(p,.1,.3),label('縦の影',620,190,{size:24,color:C.dim})+tex('\\sin\\Omega t',840,184,{size:36,auto:false,color:C.x}));
  s+=fade(seg(p,.5,.7),label('微分',620,280,{size:24,color:C.v})+tex('\\cos\\ \\to\\ -\\sin',850,274,{size:36,auto:false,color:C.v}));
  s+=fade(seg(p,.65,.85),label('微分',620,350,{size:24,color:C.v})+tex('\\sin\\ \\to\\ \\cos',850,344,{size:36,auto:false,color:C.v}));
  return s;
 }
 const u=[Math.cos(ph),-Math.sin(ph)],v=[-u[1],u[0]].map(q=>q),vv=[Math.sin(ph)*-1,-Math.cos(ph)];
 // screen coords: velocity = position rotated +90° (counter-clockwise on screen)
 const vel=[-Math.sin(ph),-Math.cos(ph)],acc=[-Math.cos(ph),Math.sin(ph)];
 const g1=seg(p,.1,.35),g2=seg(p,.45,.7);
 s+=arrow(cx,cy,cx+vel[0]*140,cy+vel[1]*140,{color:C.v,w:5,head:15,g:g1})+arrow(cx,cy,cx+acc[0]*190,cy+acc[1]*190,{color:C.a,w:5,head:15,g:g2});
 s+=fade(g1,tex('x\'',cx+vel[0]*165,cy+vel[1]*165+10,{size:30}))+fade(g2,tex('x\'\'',cx+acc[0]*215,cy+acc[1]*215+10,{size:30}))+tex('x',X+u[0]*24,Y+u[1]*24+10,{size:30});
 s+=label('位置',620,110,{size:26,color:C.x});
 s+=fade(g1,label('一回微分：90° 回して',620,200,{size:26,color:C.v})+tex('\\times\\Omega',960,194,{size:36,auto:false,color:C.v,anchor:'start'}));
 s+=fade(g2,label('二回微分：180° 回して',620,290,{size:26,color:C.a})+tex('\\times\\Omega^2',990,284,{size:36,auto:false,color:C.a,anchor:'start'}));
 return s+fade(seg(p,.75,.95),label('二回微分 ＝ 逆向き、オメガ二乗倍',620,380,{size:26,color:C.hi})+tex('x\'\'=-\\Omega^2x',840,450,{size:40}));
}
function table(p,stage){
 let s='';
 // Left: the trial position and its derivatives.
 const lg=stage===1?seg(p,0,.25):1,lx=225;
 s+=fade(lg*(stage===4?1-seg(p,0,.3):1),
   fitTex('x=C\\cos\\Omega t+D\\sin\\Omega t',lx,110,30,420)
  +fitTex('x\'=\\Omega D\\cos\\Omega t-\\Omega C\\sin\\Omega t',lx,200,30,420)
  +fitTex('x\'\'=-\\Omega^2C\\cos\\Omega t-\\Omega^2D\\sin\\Omega t',lx,290,30,420));
 if(stage===4){
  const g=seg(p,.2,.5),g2=seg(p,.45,.75);
  s+=fade(g,label('P ＝',150,110,{size:30,color:C.hi})+tex('k-m\\Omega^2',300,104,{size:40,auto:false,color:C.hi})+label('Q ＝',150,190,{size:30,color:C.hi})+tex('b\\Omega',260,184,{size:40,auto:false,color:C.hi}));
  s+=fade(g2,rect(470,60,680,150,{fill:C.x,fo:.06,stroke:C.x,rx:14})+label('コサインの列',500,100,{size:24,color:C.dim})+tex('PC+QD=F_0',810,160,{size:48,auto:false}));
  s+=fade(seg(p,.6,.9),rect(470,250,680,150,{fill:C.v,fo:.06,stroke:C.v,rx:14})+label('サインの列',500,290,{size:24,color:C.dim})+tex('PD-QC=0',810,350,{size:48,auto:false}));
  return s+fade(seg(p,.8,1),label('分からない C と D に、式が二本',810,460,{size:26,color:C.hi,anchor:'middle'}));
 }
 const tx=[475,600,890,1180],col=[537,745,1035];
 const hg=stage===1?seg(p,.1,.3):1;
 s+=fade(hg,line(tx[0],70,tx[3],70,{color:C.dim,w:2})+line(tx[1],20,tx[1],stage>=3?470:330,{color:C.faint,w:2})+line(tx[2],20,tx[2],stage>=3?470:330,{color:C.faint,w:2})
  +label('コサインの列',col[1],55,{size:24,color:C.x,anchor:'middle'})+label('サインの列',col[2],55,{size:24,color:C.v,anchor:'middle'}));
 const rows=[['kx','kC','kD',1,.3],['bx\'','b\\Omega D','-b\\Omega C',2,0],['mx\'\'','-m\\Omega^2C','-m\\Omega^2D',2,.45]];
 rows.forEach(([term,cc,ss,st,t0],i)=>{
  if(stage<st)return;
  const y=130+i*85,g=stage===st?seg(p,t0,t0+.3):1,drop=(1-g)*-40;
  s+=fade(g,tex(term,col[0],y,{size:34}))+fade(g,tex(cc,col[1],y+drop,{size:34}))+fade(g,tex(ss,col[2],y+drop,{size:34}));
 });
 if(stage>=3){
  const g=seg(p,.05,.3),g2=seg(p,.35,.65);
  s+=fade(g,line(tx[0],345,tx[3],345,{color:C.dim,w:2.5})+label('右辺',col[0],395,{size:24,color:C.F,anchor:'middle'})+tex('F_0',col[1],392,{size:36})+tex('0',col[2],392,{size:36}));
  s+=fade(g,label('押す力 F₀ cos Ωt は、コサインだけ',30,390,{size:22,color:C.F}));
  s+=fade(g2,label('列ごとに合計が一致',col[1]+145,450,{size:26,color:C.hi,anchor:'middle'})+box(tx[1]+6,90,tx[2]-tx[1]-12,330,1,C.x)+box(tx[2]+6,90,tx[3]-tx[2]-12,330,1,C.v));
 }
 return s;
}
