// 単元2 空気抵抗 — pictures. Viewbox 1200×515.
// Model used in all three films (matches um-drag's check problem): m = 2 kg, g ≈ 10, k = 4 kg/s
// → v∞ = mg/k = 5 m/s, τ = m/k = 0.5 s, v(t) = 5(1 − e^(−2t)) from rest.
import {C,clamp,mix,seg,lin,fmt,fade,label,line,rect,dot,draw,poly,arrow,axes,tex,highlight} from './anim.mjs';

const G=10,M=2,K=4,VINF=M*G/K,TAU=M/K;
const vRest=t=>VINF*(1-Math.exp(-t/TAU));
const yRest=t=>VINF*t-VINF*TAU*(1-Math.exp(-t/TAU));
const vFrom=(v0,t)=>VINF+(v0-VINF)*Math.exp(-t/TAU);
const KP=5; // px per newton for force arrows on the package
const n2=v=>Number(v.toFixed(2));
const W=C.hi; // colour of the "残り" w bars

// A package hanging under a parachute; (cx,cy) is the centre of the box.
function pkg(cx,cy,{o=1}={}){
 return fade(o,`<path d="M${cx-78} ${cy-100} Q${cx} ${cy-200} ${cx+78} ${cy-100} Z" fill="#c9d6ea" fill-opacity=".18" stroke="#c9d6ea" stroke-width="2.5"/>`
  +line(cx-78,cy-100,cx-30,cy-26,{color:C.dim,w:1.5})+line(cx+78,cy-100,cx+30,cy-26,{color:C.dim,w:1.5})+line(cx,cy-150,cx,cy-26,{color:C.dim,w:1.5,opacity:.6})
  +rect(cx-34,cy-26,68,54,{fill:C.x,fo:.3,rx:6})+label('2 kg',cx,cy+9,{size:22,color:C.ink,anchor:'middle'}));
}
// Air streaks moving up past the falling package (camera follows the package).
function streaks(cx,phase,{top=40,bot=480,o=.6}={}){
 let s='';const H=bot-top;
 [-150,-120,120,150].forEach((dx,i)=>{for(let k=0;k<4;k++){const y=top+(((k*H/4+i*37-phase)%H)+H)%H;s+=line(cx+dx,y,cx+dx,y+34,{color:C.faint,w:3,opacity:o});}});
 return s;
}
function gravArrow(cx,cy,g=1){return arrow(cx+8,cy,cx+8,cy+20*KP,{color:C.F,w:6,g})+fade(g,label('重力 20 N',cx+22,cy+20*KP-6,{size:22,color:C.F}));}
function dragArrow(cx,cy,F,{text=true,g=1}={}){
 const L=F*KP,y0=cy-150;
 return (L>2?arrow(cx,y0,cx,y0-L*g,{color:C.F,w:6}):'')+(text?fade(g,label(`抵抗 ${fmt(F,1)} N`,cx+16,y0-Math.max(L,20)+22,{size:22,color:C.F})):'');
}
// Right-hand comparison: gravity bar (fixed) vs resistance bar (grows with v); the gap is the net force.
function forceBars(v,{x=620,y=170,g=1,show=['v','g','r','n']}={}){
 const s20=13,gv=20*s20,r=K*v*s20;let s='';
 if(show.includes('v'))s+=label('速度',x,y-60,{size:24,color:C.v})+rect(x+80,y-82,Math.min(v,8.5)*50,28,{fill:C.v,fo:.5,rx:4,sw:0})+label(`${fmt(v,1)} m/s`,x+90+Math.min(v,8.5)*50,y-60,{size:24,color:C.v});
 if(show.includes('g'))s+=label('重力',x,y+18,{size:24,color:C.F})+rect(x+80,y-4,gv,28,{fill:C.F,fo:.45,rx:4,sw:0})+label('20 N',x+90+gv,y+18,{size:22,color:C.F});
 if(show.includes('r'))s+=label('抵抗',x,y+78,{size:24,color:C.F})+rect(x+80,y+56,r,28,{fill:C.F,fo:.2,stroke:C.F,rx:4,sw:2})+label(`${fmt(K*v,1)} N`,x+90+r,y+78,{size:22,color:C.F});
 if(show.includes('n')){const d=gv-r;
  if(Math.abs(d)>3)s+=rect(x+80+Math.min(r,gv),y+100,Math.abs(d),16,{fill:C.hi,fo:.6,rx:3,sw:0})+label(d>0?'合力（下向き）':'合力（上向き）',x+80+Math.min(r,gv)+Math.abs(d)/2,y+146,{size:22,color:C.hi,anchor:'middle'});
  else s+=label('合力 0',x+80+gv,y+146,{size:24,color:C.hi,anchor:'middle',weight:700});}
 return fade(g,s);
}
function raindrop(cx,cy,r=26,o=1){return fade(o,`<path d="M${cx} ${cy-r*1.6} C${cx+r} ${cy-r*.3} ${cx+r} ${cy+r} ${cx} ${cy+r} C${cx-r} ${cy+r} ${cx-r} ${cy-r*.3} ${cx} ${cy-r*1.6} Z" fill="${C.x}" fill-opacity=".45" stroke="${C.x}" stroke-width="2"/>`);}

export const dragDiagrams={
 // ------------------------------- intro -------------------------------
 'dg-rain':(p)=>{
  const u=seg(p,.1,.75);let s='';
  s+=label('空気がないと',300,60,{size:28,color:C.dim,anchor:'middle'})+label('実際の雨',860,60,{size:28,color:C.dim,anchor:'middle'});
  s+=line(600,40,600,480,{color:C.faint,w:2,dash:'6 8'});
  s+=raindrop(300,140)+raindrop(860,140);
  s+=arrow(300,180,300,180+230*u,{color:C.v,w:8,g:u>0?1:0})+fade(u,label(`${fmt(198*u,0)} m/s`,330,190+230*u,{size:30,color:C.v}));
  s+=arrow(860,180,860,180+22*u+.1,{color:C.v,w:8,head:14})+fade(u,label('数 m/s',890,215,{size:30,color:C.v}));
  s+=fade(seg(p,.7,.9),label('（時速 約 710 km）',330,450,{size:24,color:C.dim}))+fade(seg(p,.8,1),label('空気の抵抗がブレーキになる',860,330,{size:26,color:C.hi,anchor:'middle'}));
  return s+label('高さ 2000 m から落ちると',40,500,{size:22,color:C.dim});
 },
 'dg-fall:grav':(p)=>{
  const cx=300,cy=mix(-60,330,seg(p,0,.3)),g=seg(p,.35,.65);
  return pkg(cx,cy)+gravArrow(cx,cy,g)+fade(seg(p,.5,.8),tex('mg=2\\times10=20\\ \\mathrm{N}',860,120,{size:36}))
   +forceBars(0,{show:['g'],y:240,g:seg(p,.6,.9)});
 },
 'dg-fall:drag':(p)=>{
  const cx=300,cy=330,t=1.1*lin(p,.1,1),v=vRest(t);
  return streaks(cx,yRest(t)*60)+pkg(cx,cy)+gravArrow(cx,cy)+dragArrow(cx,cy,K*v)
   +forceBars(v,{show:['v','g','r']})
   +fade(seg(p,.55,.8),rect(700,390,380,80,{fill:C.F,fo:.08,stroke:C.F,rx:12})+label('抵抗',790,442,{size:28,color:C.F,anchor:'middle'})+tex('=k\\times v',910,440,{size:38}));
 },
 'dg-fall:k':(p)=>{
  // A "what-if" dial: set the speed to 1 m/s, then to 2.5 m/s, and read k·v.
  const cx=300,cy=330,v=seg(p,.05,.3)*1+seg(p,.5,.75)*1.5;
  let s=streaks(cx,p*260*v/2.5)+pkg(cx,cy)+gravArrow(cx,cy)+dragArrow(cx,cy,K*v)+forceBars(v,{show:['v','g','r']});
  s+=fade(seg(p,0,.15),tex('k=4',1100,40,{size:34,anchor:'end',auto:false,color:C.ink}));
  s+=fade(seg(p,.25,.4),tex('4\\times1=4\\ \\mathrm{N}',870,400,{size:32,auto:false,color:C.F}));
  s+=fade(seg(p,.7,.85),tex('4\\times2.5=10\\ \\mathrm{N}',870,465,{size:32,auto:false,color:C.F}));
  return s;
 },
 'dg-bal':(p)=>{
  const cx=300,cy=330,t=mix(.6,3,seg(p,0,.7)),v=vRest(t);
  let s=streaks(cx,yRest(t)*60)+pkg(cx,cy)+gravArrow(cx,cy)+dragArrow(cx,cy,K*v)+forceBars(v);
  return s+fade(seg(p,.65,.85),tex('4\\times5=20',870,420,{size:38,auto:false,color:C.F})+label('重力と同じ',870,470,{size:24,color:C.hi,anchor:'middle'}));
 },
 'dg-strobe:a':(p)=>strobe(p,1),
 'dg-strobe:b':(p)=>strobe(p,2),
 'dg-vt':(p)=>{
  const A=axes({x:140,y:455,w:760,h:370,xmax:3.2,ymax:6.5,xlabel:'時刻 t [s]',ylabel:'速度 v [m/s]',xticks:[1,2,3],yticks:[1,2,3,4,5,6],grid:true,xcolor:C.t,ycolor:C.v});
  let s=A.svg+line(A.X(0),A.Y(5),A.X(3.2),A.Y(5),{color:C.hi,w:3,dash:'10 8'});
  s+=fade(seg(p,.05,.2),label('5 m/s',A.X(3.2)+14,A.Y(5)+8,{size:24,color:C.hi}));
  const q=seg(p,.1,.8);s+=A.plot(vRest,{from:0,to:3.2,p:q,color:C.v,w:5});
  const t=3.2*q;s+=dot(A.X(t),A.Y(vRest(t)),9,C.v);
  s+=fade(seg(p,.3,.5),A.plot(u=>G*u,{from:0,to:.6,color:C.dim,w:2,dash:'6 6'})+label('はじめは自由落下と同じ傾き',A.X(.62)+10,A.Y(6)+8,{size:22,color:C.dim}));
  return s+fade(seg(p,.8,1),label('近づくが、こえない',A.X(3.2),A.Y(5)-40,{size:26,color:C.hi,anchor:'end',weight:700}));
 },
 'dg-rain:end':(p)=>{
  let s=raindrop(250,280,34);
  const g=seg(p,0,.4);
  s+=arrow(250,300,250,300+120*g+.1,{color:C.F,w:6})+fade(g,label('重力',270,410,{size:22,color:C.F}));
  s+=arrow(250,215,250,215-120*g-.1,{color:C.F,w:6})+fade(g,label('抵抗（速さの二乗に近い）',270,110,{size:22,color:C.F}));
  const gb=seg(p,.35,.75);
  s+=label('落ちてくる速さ',640,120,{size:26,color:C.dim});
  s+=label('空気なし',640,200,{size:24,color:C.dim})+rect(760,178,380*gb,30,{fill:C.v,fo:.25,rx:4,sw:0})+fade(gb,label('約 198 m/s',760+380*gb,245,{size:24,color:C.dim,anchor:'end'}));
  s+=label('実際',640,310,{size:24,color:C.v})+rect(760,288,18*gb,30,{fill:C.v,fo:.7,rx:4,sw:0})+fade(gb,label('数 m/s で頭打ち',795,310,{size:24,color:C.v}));
  return s+fade(seg(p,.8,1),label('つり合う速さで、それ以上速くならない',850,440,{size:26,color:C.hi,anchor:'middle',weight:700}));
 },
 // ------------------------------- middle -------------------------------
 'dg-rhs:line':(p)=>rhs(p,1),
 'dg-rhs:flow':(p)=>rhs(p,2),
 'dg-gap:bars':(p)=>gap(p,1),
 'dg-gap:num':(p)=>gap(p,2),
 'dg-shrink:ratio':(p)=>{
  const Ts=[0,.5,1,1.5,2];let s=line(120,460,1120,460,{color:C.dim,w:2.5});
  Ts.forEach((t,i)=>{const w=VINF*Math.exp(-t/TAU),x=200+i*200,h=w*70,g=seg(p,i*.15,i*.15+.15);
   s+=fade(g,rect(x-30,460-h,60,h,{fill:W,fo:.55,rx:3,sw:0})+label(`${t} s`,x,495,{size:24,color:C.t,anchor:'middle'})+label(fmt(w,2),x,460-h-14,{size:24,color:W,anchor:'middle'}));
   if(i){const gr=seg(p,i*.15+.05,i*.15+.2),xp=x-200,y0=460-VINF*Math.exp(-Ts[i-1]/TAU)*70,y1=460-h;
    s+=arrow(xp+36,y0,x-36,y1,{color:C.dim,w:2.5,head:12,g:gr})+fade(gr,label('×0.37',x-100,Math.min(y0,y1)+(y1-y0)/2-18,{size:24,color:C.hi,anchor:'middle',weight:700}));}});
  s+=label('残り w',120,60,{size:28,color:W});
  return s+fade(seg(p,.8,1),label('同じ時間ごとに、同じ割合で縮む',1120,60,{size:28,color:C.hi,anchor:'end',weight:700}));
 },
 'dg-shrink:sync':(p)=>sync(p,1),
 'dg-shrink:pct':(p)=>sync(p,2),
 // ------------------------------- advanced -------------------------------
 'dg-parts':(p)=>{
  const A=axes({x:120,y:455,w:620,h:370,xmax:2.6,ymax:6.5,xlabel:'時刻 t [s]',ylabel:'速度 v [m/s]',xticks:[1,2],yticks:[1,2,3,4,5,6],grid:true,xcolor:C.t,ycolor:C.v});
  let s=A.svg;const g1=seg(p,0,.3),g2=seg(p,.25,.55),g3=seg(p,.5,.85);
  s+=draw([[A.X(0),A.Y(5)],[A.X(2.6),A.Y(5)]],g1,{color:C.v,w:4,dash:'10 7'});
  const top=Array.from({length:61},(_,i)=>{const t=2.6*i/60;return [A.X(t),A.Y(5)];}),bot=Array.from({length:61},(_,i)=>{const t=2.6*(60-i)/60;return [A.X(t),A.Y(vRest(t))];});
  s+=fade(g2,poly([...top,...bot],{fill:W,fo:.3}));
  s+=A.plot(vRest,{from:0,to:2.6,p:g3,color:C.v,w:5});
  s+=fade(g1,line(800,110,860,110,{color:C.v,w:4,dash:'10 7'})+tex('v_\\infty',880,120,{size:36,anchor:'start'})+label('水平な線',960,120,{size:22,color:C.dim}));
  s+=fade(g2,rect(800,180,60,28,{fill:W,fo:.4,rx:3,sw:0})+tex('(v_0-v_\\infty)e^{-t/\\tau}',880,205,{size:30,anchor:'start'})+label('消えていく差',880,255,{size:22,color:W}));
  s+=fade(g3,line(800,320,860,320,{color:C.v,w:5})+tex('v',880,330,{size:36,anchor:'start'})+label('足したもの',920,330,{size:22,color:C.dim}));
  return s+fade(seg(p,.8,1),tex('v_0=0',860,400,{size:32,anchor:'start'})+label('→ 下から近づく',960,408,{size:24,color:C.hi}));
 },
 'dg-down':(p)=>{
  const cx=300,cy=370,t=1.2*lin(p,.45,1),v=vFrom(8,t),F=K*v;
  let s=streaks(cx,(VINF*t+3*TAU*(1-Math.exp(-t/TAU)))*60)+pkg(cx,cy)+gravArrow(cx,cy)+dragArrow(cx,cy,F);
  const net=(F-20)*KP;s+=net>3?arrow(cx+130,cy,cx+130,cy-net,{color:C.hi,w:7})+label('合力',cx+146,cy-net/2+8,{size:22,color:C.hi}):'';
  s+=forceBars(v,{y:180});
  return s+fade(seg(p,.05,.25),tex('4\\times8=32',870,470,{size:34,auto:false,color:C.F}));
 },
 'dg-family:draw':(p)=>family(p,1),
 'dg-family:check':(p)=>family(p,2),
 'dg-fv:line':(p)=>fv(p,1),
 'dg-fv:cross':(p)=>fv(p,2),
};
function strobe(p,stage){
 // Positions every 0.25 s from rest, as a vertical strobe column; bars show each gap.
 const dt=.25,N=12,top=40,sc=33,x=230;let s=label('0.25 秒ごとの位置',x,26,{size:22,color:C.dim,anchor:'middle'});
 const shown=stage===1?Math.floor(mix(1,6,seg(p,0,.8))):Math.floor(mix(6,N,seg(p,0,.7)));
 s+=line(x,top,x,top+sc*yRest(N*dt)+10,{color:C.faint,w:2});
 for(let i=0;i<=shown;i++){const y=top+sc*yRest(i*dt);s+=dot(x,y,7,C.x);
  if(i){const y0=top+sc*yRest((i-1)*dt),gap=yRest(i*dt)-yRest((i-1)*dt),L=gap*230;s+=rect(x+40,(y0+y)/2-4,L,8,{fill:C.x,fo:.6,rx:2,sw:0});
   if(i===shown&&i>2)s+=label(`${fmt(gap,2)} m`,x+50+L,(y0+y)/2+8,{size:22,color:C.x});}}
 const yc=top+sc*yRest(shown*dt);s+=dot(x,yc,11,C.hi);
 const P=880;
 if(stage===1){
  s+=fade(seg(p,.05,.25),label('合力 0',P,110,{size:30,color:C.F,anchor:'middle'}));
  s+=fade(seg(p,.25,.45),label('↓',P,160,{size:30,color:C.dim,anchor:'middle'})+label('加速度 0',P,210,{size:30,color:C.a,anchor:'middle'}));
  s+=fade(seg(p,.45,.65),label('↓',P,260,{size:30,color:C.dim,anchor:'middle'})+label('速度が変わらない',P,310,{size:30,color:C.v,anchor:'middle',weight:700}));
  const g=seg(p,.7,.9);s+=fade(g,label('止まる',P,420,{size:30,color:C.dim,anchor:'middle'})+line(P-70,430,P+70,395,{color:C.a,w:5}));
 }
 if(stage===2){
  const g=seg(p,.7,.9),y1=top+sc*yRest(7*dt),y2=top+sc*yRest(N*dt);
  s+=fade(g,rect(x+30,y1-10,330,y2-y1+20,{fill:C.hi,fo:.06,stroke:C.hi,rx:10})+label('同じ幅',x+380,(y1+y2)/2+8,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.8,1),label('毎秒 5 m のまま落ち続ける',880,110,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,0,.2),label('初めは間隔が広がる',880,220,{size:24,color:C.dim,anchor:'middle'}));
 }
 return s;
}
function rhsAxes(){return axes({x:140,y:470,w:760,h:380,xmax:6.6,ymin:-6,ymax:22,xlabel:'速度 v',ylabel:'右辺 20 − 4v [N]',xticks:[1,2,3,4,5,6],yticks:[5,10,15,20],grid:true,xcolor:C.v,ycolor:C.F});}
function rhs(p,stage){
 const A=rhsAxes(),f=v=>20-4*v;let s=A.svg;
 s+=A.plot(f,{from:0,to:6.4,p:stage===1?seg(p,.05,.5):1,color:C.F,w:5});
 if(stage===1){
  const v=mix(0,5,seg(p,.5,.95));s+=dot(A.X(v),A.Y(f(v)),10,C.hi)+line(A.X(v),A.Y(f(v)),A.X(v),A.Y(0),{color:C.hi,w:2,dash:'5 6'});
  s+=fade(seg(p,.5,.6),tex(`20-4\\times${fmt(v,1)}=${fmt(f(v),1)}`,960,90,{size:32,anchor:'end',auto:false,color:C.ink}));
  s+=fade(seg(p,.9,1),label('v = 5 でゼロ',A.X(5)+18,A.Y(0)-40,{size:24,color:C.hi}));
 }
 if(stage===2){
  s+=dot(A.X(5),A.Y(0),11,C.hi);
  const gp=seg(p,.05,.35),gn=seg(p,.3,.55);
  s+=fade(gp,poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(20)],[A.X(5),A.Y(0)]],{fill:C.F,fo:.12})+label('プラス：速度が増える',A.X(.4),A.Y(4),{size:22,color:C.F}));
  s+=fade(gn,poly([[A.X(5),A.Y(0)],[A.X(6.4),A.Y(0)],[A.X(6.4),A.Y(f(6.4))]],{fill:C.a,fo:.2})+label('マイナス：減る',A.X(6.6),A.Y(0)+100,{size:22,color:C.a,anchor:'end'}));
  const ya=A.Y(0)+62;
  [.6,1.8,3,4.1].forEach((v,i)=>{s+=arrow(A.X(v)-30,ya,A.X(v)+30,ya,{color:C.v,w:5,head:14,g:seg(p,.35+i*.06,.5+i*.06)});});
  s+=arrow(A.X(6.2)+30,ya,A.X(6.2)-30,ya,{color:C.v,w:5,head:14,g:seg(p,.6,.72)});
  s+=fade(seg(p,.7,.95),tex('v_\\infty=\\dfrac{mg}{k}=5',A.X(5)+30,A.Y(12),{size:38,anchor:'start'}));
 }
 return s;
}
function vtLeft(tmax=2.6){return axes({x:100,y:455,w:520,h:360,xmax:tmax,ymax:6.3,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks:[.5,1,1.5,2],yticks:[1,2,3,4,5,6],grid:true,xcolor:C.t,ycolor:C.v});}
function gap(p,stage){
 const A=vtLeft();let s=A.svg+line(A.X(0),A.Y(5),A.X(2.6),A.Y(5),{color:C.hi,w:2.5,dash:'10 8'})+label('v∞ = 5',A.X(2.6)-10,A.Y(5)-14,{size:22,color:C.hi,anchor:'end'});
 s+=A.plot(vRest,{from:0,to:2.6,color:C.v,w:4});
 const Ts=[0,.5,1,1.5,2];
 const base=450,bx=i=>760+i*90;
 s+=fade(stage===1?seg(p,.5,.7):1,line(730,base,1170,base,{color:C.dim,w:2})+label('残り w',730,70,{size:26,color:W})+label('t [s]',1175,base+58,{size:22,color:C.t,anchor:'end'}));
 Ts.forEach((t,i)=>{
  const v=vRest(t),w=VINF-v,g=stage===1?seg(p,.05+i*.08,.2+i*.08):1,u=stage===1?seg(p,.5+i*.07,.7+i*.07):1;
  s+=fade(g*(stage===2?.4:1),line(A.X(t),A.Y(v),A.X(t),A.Y(5),{color:W,w:8,cap:'butt'}));
  // copy flies to the right panel and becomes a bar standing on the baseline
  if(u>0){const x=mix(A.X(t),bx(i),u),yb=mix(A.Y(v),base,u),h=(A.Y(v)-A.Y(5))*mix(1,48/((A.Y(0)-A.Y(1))),u);
   s+=line(x,yb,x,yb-h,{color:W,w:mix(8,40,u),cap:'butt',opacity:.8})+fade(u,label(`${t}`,bx(i),base+30,{size:22,color:C.t,anchor:'middle'}));}
 });
 if(stage===1)s+=fade(seg(p,.8,1),tex('w=v_\\infty-v',950,130,{size:36}));
 if(stage===2){
  s+=tex('w=v_\\infty-v',950,130,{size:36});
  const t=p<.4?mix(.1,.458,seg(p,0,.4)):p<.7?.458:mix(.458,1.3,seg(p,.7,1)),v=vRest(t),X=A.X(t);
  s+=line(X,A.Y(0),X,A.Y(v),{color:C.v,w:10,cap:'butt'})+line(X,A.Y(v),X,A.Y(5),{color:W,w:10,cap:'butt'})+dot(X,A.Y(v),9,C.ink);
  s+=label(`v = ${fmt(v,1)}`,X+16,A.Y(v/2)+8,{size:24,color:C.v})+label(`w = ${fmt(5-v,1)}`,X+16,A.Y((v+5)/2)+30,{size:24,color:W});
  s+=fade(seg(p,.25,.45),tex('v+w=5',950,230,{size:38,auto:false,color:C.ink})+label('足すといつも 5',950,280,{size:24,color:C.hi,anchor:'middle'}));
 }
 return s;
}
function sync(p,stage){
 const A=vtLeft(2.2);let s=A.svg+line(A.X(0),A.Y(5),A.X(2.2),A.Y(5),{color:C.hi,w:2.5,dash:'10 8'})+label('v∞ = 5',A.X(2.2)-10,A.Y(5)-14,{size:22,color:C.hi,anchor:'end'});
 const t=stage===1?(p<.3?mix(0,.5,seg(p,0,.3)):p<.5?.5:mix(.5,1,seg(p,.5,.8))):mix(1,2,seg(p,.6,1));
 s+=A.plot(vRest,{from:0,to:t,color:C.v,w:5})+dot(A.X(t),A.Y(vRest(t)),9,C.v);
 // w bar on the right, shrinking in step with the clock
 const base=450,bx=800,w=VINF-vRest(t),h=w*60;
 s+=line(700,base,900,base,{color:C.dim,w:2})+label('残り w',bx,70,{size:26,color:W,anchor:'middle'});
 s+=rect(bx-40,base-VINF*60,80,VINF*60,{fill:'none',fo:0,stroke:C.faint,rx:3,sw:2});
 s+=rect(bx-40,base-h,80,h,{fill:W,fo:.6,rx:3,sw:0})+label(fmt(w,2),bx+56,base-h+8,{size:26,color:W});
 s+=tex(`t=${fmt(t,2)}\\ \\mathrm{s}`,1160,130,{size:30,anchor:'end'});
 const marks=[[.5,'63%','37%'],[1,'86%','14%']];
 marks.forEach(([tm,pv,pw],i)=>{
  const g=stage===1?seg(p,i?.8:.3,i?.9:.4):1,v=vRest(tm);
  s+=fade(g,dot(A.X(tm),A.Y(v),8,C.ink)+line(A.X(tm),A.Y(v),A.X(tm),A.Y(0),{color:C.faint,w:2,dash:'4 6'}));
  if(stage===2){const gp=seg(p,.05+i*.25,.25+i*.25);s+=fade(gp,label(pv,A.X(tm)+10,A.Y(v)+34+i*6,{size:26,color:C.v,weight:700})+label(`${tm} s：残り ${pw}`,1160,250+i*50,{size:24,color:W,anchor:'end'}));}
 });
 if(stage===1)s+=fade(seg(p,.3,.4),label('0.5 s 後 1.84',1160,250,{size:24,color:W,anchor:'end'}))+fade(seg(p,.8,.9),label('1 s 後 0.68',1160,300,{size:24,color:W,anchor:'end'}));
 if(stage===2)s+=fade(seg(p,.75,1),label('消えるのは「残り」',1160,380,{size:26,color:C.hi,anchor:'end',weight:700}));
 return s;
}
function family(p,stage){
 const A=axes({x:120,y:460,w:620,h:390,xmax:2.6,ymax:11,xlabel:'時刻 t [s]',ylabel:'速度 v [m/s]',xticks:[1,2],yticks:[5],grid:true,xcolor:C.t,ycolor:C.v});
 let s=A.svg+line(A.X(0),A.Y(5),A.X(2.6),A.Y(5),{color:C.hi,w:2.5,dash:'10 8'})+label('5',A.X(2.6)+12,A.Y(5)+8,{size:24,color:C.hi});
 const V0=[8,10,2,0],cols=[C.v,'#d4c2ff','#9580e8','#7d69c9'];
 V0.forEach((v0,i)=>{const g=stage===1?(i===0?seg(p,0,.4):seg(p,.45+(i-1)*.15,.6+(i-1)*.15)):1;
  s+=A.plot(t=>vFrom(v0,t),{from:0,to:2.6,p:g,color:cols[i],w:i===0?5:3.5})+fade(g,tex(`v_0=${v0}`,A.X(0)-14,A.Y(v0)+(v0===0?-14:8),{size:24,anchor:'end',auto:false,color:cols[i]}));});
 if(stage===1)s+=fade(seg(p,.85,1),label('上からも下からも、5 へ',1150,380,{size:26,color:C.hi,anchor:'end',weight:700}));
 if(stage===2){
  const g1=seg(p,.05,.4),g2=seg(p,.45,.85);
  V0.forEach(v0=>{s+=fade(g1,dot(A.X(0),A.Y(v0),9,C.hi));});
  s+=fade(g1,rect(790,60,380,150,{fill:C.hi,fo:.05,stroke:C.hi,rx:12})+tex('t=0',980,100,{size:30})+tex('e^{0}=1\\ \\Rightarrow\\ v=v_0',980,165,{size:30}));
  s+=fade(g2,highlight(A.X(1.8),A.Y(5)-30,A.X(2.6)-A.X(1.8),60,1)+rect(790,260,380,150,{fill:C.hi,fo:.05,stroke:C.hi,rx:12})+label('時間がたつと',980,300,{size:24,color:C.t,anchor:'middle'})+tex('e^{-t/\\tau}\\to0\\ \\Rightarrow\\ v\\to v_\\infty',980,365,{size:28}));
 }
 return s;
}
function fv(p,stage){
 const A=axes({x:150,y:460,w:700,h:390,xmax:7,ymax:32,xlabel:'速さ v [m/s]',ylabel:'力 [N]',xticks:[1,2,3,4,5,6,7],yticks:[10,20,30],grid:true,xcolor:C.v,ycolor:C.F});
 let s=A.svg+draw([[A.X(0),A.Y(20)],[A.X(7),A.Y(20)]],stage===1?seg(p,0,.2):1,{color:C.dim,w:3,dash:'10 7'})+fade(stage===1?seg(p,.1,.25):1,label('重力 mg = 20 N',A.X(7)+10,A.Y(20)+8,{size:22,color:C.dim}));
 s+=A.plot(v=>K*v,{from:0,to:7,p:stage===1?seg(p,.15,.45):1,color:C.F,w:5})+fade(stage===1?seg(p,.35,.5):1,tex('kv',A.X(7)+10,A.Y(28)+8,{size:32,anchor:'start',auto:false,color:C.F})+label('直線のモデル',A.X(7)+10,A.Y(28)+40,{size:22,color:C.F}));
 const cq=1.25,vq=Math.sqrt(32/cq);
 s+=A.plot(v=>cq*v*v,{from:0,to:vq,p:stage===1?seg(p,.5,.85):1,color:C.hi,w:5})+fade(stage===1?seg(p,.75,.95):1,tex('cv^2',A.X(vq)+12,A.Y(32)+26,{size:32,anchor:'start',auto:false,color:C.hi})+label('二乗のモデル',A.X(vq)+12,A.Y(32)+58,{size:22,color:C.hi}));
 if(stage===2){
  [[5,C.F,.05],[4,C.hi,.4]].forEach(([v,col,a])=>{const g=seg(p,a,a+.3);
   s+=fade(g,dot(A.X(v),A.Y(20),11,col)+line(A.X(v),A.Y(20),A.X(v),A.Y(0),{color:col,w:3,dash:'6 6'})+label(v===5?'終端 5 m/s':'終端 4 m/s',A.X(v)+(v===5?14:-14),v===5?A.Y(13):A.Y(25),{size:24,color:col,anchor:v===5?'start':'end',weight:700}));});
  s+=fade(seg(p,.75,1),label('抵抗が重力に届く速さ ＝ 終端速度',600,40,{size:26,color:C.hi,anchor:'middle'}));
 }
 return s;
}
