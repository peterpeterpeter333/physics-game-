// 単元1 運動方程式 — pictures. Viewbox 1200×515. Colours: x cyan, v purple, a red, F green, t gold.
import {C,clamp,mix,smooth,seg,lin,fmt,fade,label,line,rect,dot,ring,draw,poly,arrow,brace,highlight,axes,ground,block,tex} from './anim.mjs';

// ---- intro: a box pushed on ice -------------------------------------------------
const ICE_Y=420;
function ice(){return rect(60,ICE_Y,1080,26,{fill:'#9fd8ff',fo:.12,rx:4,sw:0})+line(60,ICE_Y,1140,ICE_Y,{color:'#9fd8ff',w:3})+label('氷（摩擦なし）',1130,ICE_Y+60,{size:22,color:C.dim,anchor:'end'});}
function pushedBox(x,v,{force=true,ghost=false,vscale=40,tag=''}={}){
 const o=ghost?.45:1;
 return fade(o,block(x,ICE_Y,150,110,{color:C.x,text:'2 kg',size:30}))
  +(force?arrow(x-200,ICE_Y-55,x-78,ICE_Y-55,{color:C.F,w:7,text:'',opacity:o})+fade(o,label('押す力 4 N',x-205,ICE_Y-80,{size:26,color:C.F})):'')
  +(v>0.01?arrow(x-50,ICE_Y-150,x-50+v*vscale,ICE_Y-150,{color:C.v,w:7,opacity:o})+fade(o,label(`${fmt(v)} m/s`,x-50+v*vscale+12,ICE_Y-141,{size:26,color:C.v})):'')
  +(tag?fade(o,label(tag,x,ICE_Y+60,{size:22,color:C.t,anchor:'middle'})):'');
}
export const newtonDiagrams={
 'nw-ice':(p)=>{const t=3*p,x=290+70*t*t;return ice()+pushedBox(x,2*t)+label(`時刻 ${fmt(t)} s`,80,60,{size:26,color:C.t});},
 'nw-ice:steps':(p)=>{
  // One row per second (a strobe photo): position grows, velocity grows by the same +2 each time.
  let s='';
  [0,1,2,3].forEach(i=>{const g=seg(p,i*.2,i*.2+.18);if(g<=0)return;const y=95+i*105,x=230+42*i*i,v=2*i;
   s+=fade(g,line(170,y+8,1120,y+8,{color:C.faint,w:2})+label(`${i} s`,80,y-8,{size:28,color:C.t})+rect(x-45,y-52,90,60,{fill:C.x,fo:.3,rx:6})
    +(v?arrow(x+50,y-22,x+50+v*38,y-22,{color:C.v,w:6})+label(`${v} m/s`,x+62+v*38,y-12,{size:24,color:C.v}):label('0 m/s',x+60,y-12,{size:24,color:C.v}))
    +(i?label('+2',1100,y-12,{size:30,color:C.t,anchor:'end',weight:700}):''));});
  return s+fade(seg(p,.8,1),label('1秒ごとに、速度が同じだけ増える',640,480,{size:30,color:C.hi,anchor:'middle'}));
 },
 // ---- velocity built from 0.5 s steps; the bars become the v–t graph ----
 'nw-v:first':(p)=>vSteps(p,1),
 'nw-v:stack':(p)=>vSteps(p,2),
 'nw-v:line':(p)=>vSteps(p,3),
 'nw-v:strip':(p)=>vSteps(p,4),
 'nw-x':(p)=>{
  const A=axes({x:150,y:450,w:760,h:360,xmax:2.2,ymax:4.6,xlabel:'時刻 t [s]',ylabel:'位置 x [m]',xticks:[0.5,1,1.5,2],yticks:[1,2,3,4],grid:true,g:seg(p,0,.15),xcolor:C.t,ycolor:C.x});
  const T=[0,.5,1,1.5,2],X=T.map(t=>t*t);let s=A.svg;
  T.forEach((t,i)=>{if(!i)return;const g=seg(p,.12+i*.14,.24+i*.14);
   s+=fade(g,line(A.X(T[i-1]),A.Y(X[i-1]),A.X(t),A.Y(X[i-1]),{color:C.faint,w:2,dash:'6 6'})+line(A.X(t),A.Y(X[i-1]),A.X(t),mix(A.Y(X[i-1]),A.Y(X[i]),g),{color:C.t,w:5})+label(`+${fmt(X[i]-X[i-1],2)}`,A.X(t)+12,(A.Y(X[i-1])+A.Y(X[i]))/2+8,{size:22,color:C.t}))+fade(g,dot(A.X(t),A.Y(X[i]),8,C.x));});
  s+=dot(A.X(0),A.Y(0),8,C.x)+A.plot(t=>t*t,{from:0,to:2.1,p:seg(p,.8,1),color:C.x,w:4});
  return s+fade(seg(p,.85,1),label('増え方が、だんだん大きくなる',980,120,{size:26,color:C.hi,anchor:'end'}));
 },
 'nw-off':(p)=>{
  const t=4*lin(p,0,.92),on=t<2,x=280+40*(on?t*t:4+4*(t-2)),v=on?2*t:4;
  const fa=on?1:1-seg(t,2,2.3);
  return ice()+pushedBox(x,v,{force:fa>.05})+label(`時刻 ${fmt(t)} s`,80,60,{size:26,color:C.t})
   +tex(on?'a=2':'a=0',820,70,{size:40})+tex(`v=${fmt(v)}`,1000,70,{size:40})
   +fade(seg(t,2,2.4),label('力なし：加速度 0、速度はそのまま',600,150,{size:28,color:C.hi,anchor:'middle'}));
 },
 'nw-chain':(p)=>{
  const boxes=[['力と質量','F,\\ m',C.F],['加速度','a',C.a],['速度','v',C.v],['位置','x',C.x]],W=190,gap=120,x0=600-(4*W+3*gap)/2;
  let s='';
  boxes.forEach(([jp,sym,col],i)=>{const g=seg(p,i*.16,i*.16+.14),x=x0+i*(W+gap);
   s+=fade(g,rect(x,150,W,120,{fill:col,fo:.12,stroke:col,rx:14})+label(jp,x+W/2,190,{size:26,color:col,anchor:'middle'})+tex(sym,x+W/2,240,{size:40}));
   if(i>0){const ga=seg(p,i*.16-.05,i*.16+.08);s+=arrow(x-gap+8,210,x-8,210,{color:C.dim,w:4,g:ga,head:14});
    s+=fade(ga,label(i===1?'÷ m':'足していく',x-gap/2,190-14,{size:20,color:C.dim,anchor:'middle'}));}});
  const gi=seg(p,.7,.9);
  [[2,'最初の速度','v_0'],[3,'最初の位置','x_0']].forEach(([i,jp,sym])=>{const x=x0+i*(W+gap)+W/2;s+=arrow(x,390,x,280,{color:C.t,w:4,g:gi,head:14})+fade(gi,label(jp,x,440,{size:22,color:C.t,anchor:'middle'})+tex(sym,x,480,{size:32}));});
  return s+fade(seg(p,.88,1),label('これだけで、この先の動きがすべて決まる',600,80,{size:30,color:C.hi,anchor:'middle'}));
 },
};
function vSteps(p,stage){
 const A=axes({x:150,y:450,w:760,h:360,xmax:2.2,ymax:4.6,xlabel:'時刻 t [s]',ylabel:'速度 v [m/s]',xticks:[0.5,1,1.5,2],yticks:[1,2,3,4],grid:true,g:stage===1?seg(p,0,.25):1,xcolor:C.t,ycolor:C.v});
 let s=A.svg;const unit=A.Y(0)-A.Y(1),bw=46;
 const barAlpha=stage>=3?1-.7*seg(p,0,.3)*(stage===3?1:0)-(stage>3?.7:0):1;
 for(let i=1;i<=4;i++){
  // stage 1 builds bar 1; stage 2 builds bars 2..4 one block at a time.
  let blocks=i;let grow=1;
  if(stage===1){if(i>1)continue;grow=seg(p,.3,.75);}
  if(stage===2&&i>1){const g=seg(p,(i-2)*.3,(i-2)*.3+.28);if(g<=0){continue;}grow=g;}
  const x=A.X(i*.5)-bw/2;
  for(let b=0;b<blocks;b++){const last=b===blocks-1,h=last?unit*grow:unit;
   s+=fade(barAlpha,rect(x,A.Y(b)-h,bw,h,{fill:last&&stage<=2?C.t:C.v,fo:last&&stage<=2?.45:.35,rx:3,sw:1.5}));}
  if(stage<=2&&grow>.05)s+=fade(grow*barAlpha,label('+1',x+bw/2,A.Y(i-1)-unit*grow-12,{size:22,color:C.t,anchor:'middle',weight:700}));
 }
 if(stage===1)s+=fade(seg(p,.6,.9),tex('\\Delta v=a\\,\\Delta t=2\\times0.5=1',620,40,{size:34}));
 if(stage===2)s+=fade(seg(p,.85,1),label('2 s 後に 4 m/s',A.X(2)+40,A.Y(4)+8,{size:24,color:C.v}));
 if(stage>=3){
  const g=stage===3?seg(p,.2,.55):1;
  [0,.5,1,1.5,2].forEach(t=>{s+=fade(g,dot(A.X(t),A.Y(2*t),8,C.v));});
  s+=A.plot(t=>2*t,{from:0,to:2.15,p:stage===3?seg(p,.45,.75):1,color:C.v,w:4});
  const gt=stage===3?seg(p,.7,.95):0;
  if(gt>0)s+=fade(gt,line(A.X(1),A.Y(2),A.X(1.5),A.Y(2),{color:C.t,w:4})+line(A.X(1.5),A.Y(2),A.X(1.5),A.Y(3),{color:C.a,w:4})+label('0.5 s',A.X(1.25),A.Y(2)+30,{size:21,color:C.t,anchor:'middle'})+label('+1',A.X(1.5)+10,A.Y(2.5)+8,{size:21,color:C.a})+label('傾き',930,160,{size:28,color:C.hi,anchor:'end'})+tex('=\\frac{1}{0.5}=2=a',1045,150,{size:34}));
 }
 if(stage===4){
  const T=[0,.5,1,1.5,2];
  T.slice(1).forEach((t,i)=>{const t0=T[i],g=seg(p,i*.12,i*.12+.14),col=i%2?C.x:'#4fb8d6';
   s+=fade(g*.9,poly([[A.X(t0),A.Y(0)],[A.X(t0),A.Y(2*t0)],[A.X(t),A.Y(2*t)],[A.X(t),A.Y(0)]],{fill:col,fo:i===2?.5:.22,stroke:i===2?C.hi:'none',sw:2.5}));});
  const g=seg(p,.55,.8);
  s+=fade(g,line(A.X(1),A.Y(2.5),A.X(1.5),A.Y(2.5),{color:C.hi,w:3,dash:'7 6'})+label('平均 2.5',A.X(1.5)+14,A.Y(2.5)+8,{size:22,color:C.hi}));
  s+=fade(seg(p,.75,1),tex('2.5\\times0.5=1.25\\ \\mathrm{m}',1010,300,{size:34}));
 }
 return s;
}

// ---- middle: areas under a–t and v–t graphs --------------------------------------
function aAxes(g=1){return axes({x:150,y:430,w:760,h:300,xmax:3.4,ymax:3,xlabel:'時刻 t [s]',ylabel:'加速度 a',xticks:[1,2,3],yticks:[1,2],grid:true,g,xcolor:C.t,ycolor:C.a});}
function vAxes(g=1,ymax=10){return axes({x:150,y:450,w:760,h:360,xmax:3.4,ymax,xlabel:'時刻 t [s]',ylabel:'速度 v',xticks:[1,2,3],yticks:ymax===10?[2,4,6,8]:[2,4,6],grid:true,g,xcolor:C.t,ycolor:C.v});}
Object.assign(newtonDiagrams,{
 'md-a:line':(p)=>{const A=aAxes(seg(p,0,.3));return A.svg+A.plot(()=>2,{from:0,to:3.3,p:seg(p,.3,.8),color:C.a,w:5})+fade(seg(p,.7,1),tex('a=2',A.X(3.3)+20,A.Y(2)+10,{size:36,anchor:'start'}));},
 'md-a:area':(p)=>{const A=aAxes(),u=seg(p,0,.55),T=3*u;
  return A.svg+rect(A.X(0),A.Y(2),A.X(T)-A.X(0),A.Y(0)-A.Y(2),{fill:C.v,fo:.35,rx:0,sw:0})+A.plot(()=>2,{from:0,to:3.3,color:C.a,w:5})+tex('a=2',A.X(3.3)+20,A.Y(2)+10,{size:36,anchor:'start'})
   +fade(seg(p,.4,.6),tex(`2\\times${fmt(T,1)}=${fmt(2*T,1)}`,A.X(T/2),A.Y(1)+12,{size:36}))
   +fade(seg(p,.6,.8),label('増えた速度 6 m/s',A.X(1.5),A.Y(2)-30,{size:28,color:C.v,anchor:'middle'}))
},
 'md-a:name':(p)=>newtonDiagrams['md-a:area'](1)+fade(seg(p,.05,.3),label('面積を求める ＝ 積分',1100,90,{size:30,color:C.hi,anchor:'end',weight:700}))+fade(seg(p,.5,.75),tex('\\int a\\,dt=\\Delta v',1000,150,{size:38})),
 'md-shift':(p)=>{const A=vAxes(seg(p,0,.2));let s=A.svg;
  [0,2,4].forEach((c0,i)=>{const g=seg(p,.15+i*.2,.35+i*.2);s+=A.plot(t=>2*t+c0,{from:0,to:3.1,p:g,color:[C.v,'#9580e8','#7d69c9'][i],w:4})+fade(g,tex(`C=${c0}`,A.X(3.1)+16,A.Y(2*3.1+c0)+10,{size:28,anchor:'start'}));
   if(i>0)s+=arrow(A.X(.4),A.Y(.8),A.X(.4),A.Y(.8+c0),{color:C.t,w:3,g,head:12});});
  return s+fade(seg(p,.75,1),label('傾きはどれも 2。ずれ方 C は、最初の速度で決まる',600,50,{size:26,color:C.hi,anchor:'middle'}));},
 'md-v:line':(p)=>mdV(p,1),'md-v:split':(p)=>mdV(p,2),'md-v:rect':(p)=>mdV(p,3),'md-v:tri':(p)=>mdV(p,4),
 'md-check':(p)=>{const A=vAxes(1,8),T=2,v0=3;let s=A.svg;
  s+=fade(seg(p,0,.3),rect(A.X(0),A.Y(v0),A.X(T)-A.X(0),A.Y(0)-A.Y(v0),{fill:C.x,fo:.3,rx:0,sw:0})+tex('3\\times2=6',A.X(1),A.Y(1.5)+10,{size:34}));
  s+=fade(seg(p,.3,.6),poly([[A.X(0),A.Y(v0)],[A.X(T),A.Y(v0)],[A.X(T),A.Y(v0+4)]],{fill:C.t,fo:.35})+tex('\\tfrac12\\times2\\times4=4',A.X(T)+30,A.Y(v0+2)+10,{size:30,anchor:'start'}));
  s+=A.plot(t=>v0+2*t,{from:0,to:2.6,color:C.v,w:4});
  return s+fade(seg(p,.65,.9),label('合わせて 10 m',1100,90,{size:34,color:C.hi,anchor:'end',weight:700}));},
 'md-assume':(p)=>{const A=aAxes(1);const f=t=>t<1.5?2:.8;let s=A.svg+A.plot(f,{from:0,to:3.3,p:seg(p,0,.5),color:C.a,w:5,steps:400});
  s+=fade(seg(p,.4,.6),label('途中で力が変わる',A.X(1.5)+20,A.Y(2)-24,{size:24,color:C.a}));
  const g=seg(p,.6,.85);
  return s+fade(g,rect(640,40,520,110,{fill:C.a,fo:.1,stroke:C.a,rx:12})+tex('v=v_0+at',900,90,{size:40})+line(740,85,1060,85,{color:C.a,w:5}))+fade(g,label('そのままでは使えない',900,138,{size:24,color:C.a,anchor:'middle'}));},
});
function mdV(p,stage){
 const A=vAxes(stage===1?seg(p,0,.25):1),v0=3,a=2,T=3;let s=A.svg;
 const line1=A.plot(t=>v0+a*t,{from:0,to:3.25,p:stage===1?seg(p,.2,.6):1,color:C.v,w:4});
 if(stage>=2){
  const u=stage===2?seg(p,0,.45):1;
  const tt=T*u;
  if(stage===2)s+=poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(v0)],[A.X(tt),A.Y(v0+a*tt)],[A.X(tt),A.Y(0)]],{fill:C.x,fo:.22});
  const d=stage===2?seg(p,.55,.85):1;
  s+=line(A.X(0),A.Y(v0),mix(A.X(0),A.X(T),d),A.Y(v0),{color:C.hi,w:3,dash:'8 6'});
  const rA=stage===3?.22+.25*seg(p,0,.3):stage===4?.12:.22,tA=stage===4?.25+.25*seg(p,0,.3):stage===3?.1:.22;
  if(stage>=3||d>=.99){
   s+=rect(A.X(0),A.Y(v0),A.X(T)-A.X(0),A.Y(0)-A.Y(v0),{fill:C.x,fo:rA,rx:0,sw:0});
   s+=poly([[A.X(0),A.Y(v0)],[A.X(T),A.Y(v0)],[A.X(T),A.Y(v0+a*T)]],{fill:C.t,fo:tA});
  }
  s+=line(A.X(T),A.Y(0),A.X(T),A.Y(v0+a*T),{color:C.t,w:2,dash:'5 6'});
  if(stage===2)s+=fade(seg(p,.7,1),label('長方形',A.X(1.5),A.Y(1.2),{size:28,color:C.x,anchor:'middle'})+label('三角形',A.X(2.2),A.Y(v0+2.6),{size:28,color:C.t,anchor:'middle'}));
 }
 s+=line1+fade(stage===1?seg(p,.5,.8):1,tex('v_0',A.X(0)-40,A.Y(v0)+10,{size:34})+dot(A.X(0),A.Y(v0),7,C.v));
 if(stage===1){const g=seg(p,.65,.95);s+=fade(g,line(A.X(1),A.Y(v0+a),A.X(2),A.Y(v0+a),{color:C.t,w:3})+line(A.X(2),A.Y(v0+a),A.X(2),A.Y(v0+2*a),{color:C.a,w:3})+label('1',A.X(1.5),A.Y(v0+a)+28,{size:22,color:C.t,anchor:'middle'})+tex('a',A.X(2)+22,A.Y(v0+1.5*a)+10,{size:32}));}
 if(stage===3){const g=seg(p,.3,.7);s+=fade(g,tex('v_0',A.X(T)+34,A.Y(v0/2)+10,{size:30})+tex('t',A.X(T/2),A.Y(0)+62,{size:30}))+fade(seg(p,.55,.9),tex('v_0\\times t',A.X(T/2),A.Y(v0/2)+12,{size:42}));}
 if(stage===4){
  // A copy of the triangle turns over and completes a rectangle: the triangle is half.
  const g=seg(p,.25,.6),X0=A.X(0),X1=A.X(T),Yb=A.Y(v0),Yt=A.Y(v0+a*T);
  s+=fade(.25+.75*g,poly([[X0,Yb],[X0,mix(Yb,Yt,g)],[X1,Yt]],{fill:C.t,fo:.12,stroke:C.t,sw:2}));
  s+=fade(seg(p,.35,.6),tex('at',X0-44,(Yb+Yt)/2+10,{size:30})+tex('t',(X0+X1)/2,Yt-24,{size:30}));
  s+=fade(seg(p,.6,.9),tex('\\tfrac12\\times t\\times at=\\tfrac12at^2',A.X(2.3),A.Y(v0+a*2.3)+120,{size:36}));
 }
 return s;
}

// ---- advanced: derivatives, prediction, projectile --------------------------------
function mini(x,title,col,fn,ymin,ymax,g){const A=axes({x,y:430,w:280,h:230,xmax:2,ymin,ymax,xlabel:'t',ylabel:'',g,xcolor:C.t});return {A,svg:A.svg+fade(g,label(title,x+140,150,{size:26,color:col,anchor:'middle'}))+A.plot(fn,{color:col,w:4})};}
Object.assign(newtonDiagrams,{
 'ad-chain':(p)=>{
  const g=seg(p,0,.2),X=mini(60,'位置 x',C.x,t=>t*t,0,4.4,g),V=mini(460,'速度 v',C.v,t=>2*t,0,4.4,g),Aa=mini(860,'加速度 a',C.a,()=>2,0,4.4,g);
  const u=.1+1.8*lin(p,.2,.95),sx=2*u,sv=2;
  let s=X.svg+V.svg+Aa.svg;
  // tangent on x(t) whose slope is the height traced on v(t); same on v(t) → a(t)
  const tan=(A,f,sl,col)=>line(A.X(u-.45),A.Y(f(u)-.45*sl),A.X(u+.45),A.Y(f(u)+.45*sl),{color:col,w:3});
  s+=fade(seg(p,.15,.3),tan(X.A,t=>t*t,sx,C.hi)+dot(X.A.X(u),X.A.Y(u*u),7,C.hi)+dot(V.A.X(u),V.A.Y(sx),8,C.hi)+tan(V.A,t=>2*t,sv,C.hi)+dot(Aa.A.X(u),Aa.A.Y(2),8,C.hi));
  s+=arrow(360,290,440,290,{color:C.dim,w:4,g,head:14})+arrow(760,290,840,290,{color:C.dim,w:4,g,head:14});
  return s+fade(g,label('傾き',400,270,{size:22,color:C.dim,anchor:'middle'})+label('傾き',800,270,{size:22,color:C.dim,anchor:'middle'}))+fade(seg(p,.6,.9),label('傾きを求める ＝ 微分',600,70,{size:30,color:C.hi,anchor:'middle'}));
 },
 'ad-predict':(p)=>{
  // Euler steps from the current state: position + velocity → next moment.
  const dt=.12,g=9.8,sc=38,ox=110,oy=450;let x=0,y=0,vx=6,vy=9;const pts=[[ox,oy]];let s=ground(60,1140,oy+4);
  const N=Math.floor(1+lin(p,0,.85)*16);
  for(let i=0;i<N;i++){const X=ox+x*sc,Y=oy-y*sc;
   if(i===N-1||i%3===0)s+=arrow(X,Y,X+vx*sc*dt*1.6,Y-vy*sc*dt*1.6,{color:C.v,w:4,head:12,opacity:i===N-1?1:.4});
   x+=vx*dt;vy-=g*dt;y+=vy*dt;pts.push([ox+x*sc,oy-y*sc]);if(y<0)break;}
  s+=draw(pts.slice(0,-1),1,{color:C.x,w:3,dash:'2 9'});
  pts.slice(0,-1).forEach(q=>{s+=dot(q[0],q[1],5,C.x);});
  const last=pts.at(-2);s+=dot(last[0],last[1],13,C.hi);
  return s+label('今の位置 ＋ 今の速度 → 次の瞬間 → …',600,60,{size:28,color:C.hi,anchor:'middle'})+fade(seg(p,.85,1),label('一本の道すじが決まる',1100,120,{size:28,color:C.x,anchor:'end'}));
 },
 'ad-split':(p)=>{
  const ox=260,oy=420,th=55*Math.PI/180,L=260;let s=ground(80,1120,oy+22);
  s+=ring(ox,oy,20,{color:C.hi,w:3,fill:'#3a3320'});
  s+=arrow(ox,oy,ox+L*Math.cos(th),oy-L*Math.sin(th),{color:C.v,w:6,g:seg(p,0,.3),text:'最初の速度',tsize:24});
  s+=fade(seg(p,.25,.5),line(ox+L*Math.cos(th),oy-L*Math.sin(th),ox+L*Math.cos(th),oy,{color:C.v,w:2,dash:'6 6'})+line(ox+L*Math.cos(th),oy-L*Math.sin(th),ox,oy-L*Math.sin(th),{color:C.v,w:2,dash:'6 6'})+tex('v_{0x}',ox+L*Math.cos(th)/2,oy+58,{size:30})+tex('v_{0y}',ox-60,oy-L*Math.sin(th)/2+10,{size:30}));
  s+=arrow(ox,oy,ox,oy+0.1,{});
  s+=arrow(ox+20,oy,ox+20,oy+100*seg(p,.5,.75)+.1,{color:C.F,w:6,text:'重力 mg',tsize:24,tdx:14,tdy:-6});
  return s+fade(seg(p,.7,1),rect(700,120,420,170,{fill:C.F,fo:.08,stroke:C.F,rx:14})+label('横の力：0',910,185,{size:32,color:C.F,anchor:'middle'})+label('縦の力：下向き mg',910,250,{size:32,color:C.F,anchor:'middle'}));
 },
 'ad-shadow':(p)=>{
  const ox=150,oy=450,sc=40,vx=6,vy=9.8,g=9.8,T=2*vy/g,t=T*lin(p,0,.9),x=vx*t,y=vy*t-g*t*t/2,X=ox+x*sc,Y=oy-y*sc;
  let s=line(ox,oy,ox+560,oy,{color:C.dim,w:2.5})+line(ox,oy,ox,oy-230,{color:C.dim,w:2.5})+label('横',ox+570,oy+8,{size:24,color:C.dim})+label('縦',ox-10,oy-240,{size:24,color:C.dim,anchor:'end'});
  s+=draw(Array.from({length:81},(_,i)=>{const u=T*i/80;return [ox+vx*u*sc,oy-(vy*u-g*u*u/2)*sc];}),1,{color:C.faint,w:2,dash:'4 8'});
  s+=draw(Array.from({length:81},(_,i)=>{const u=t*i/80;return [ox+vx*u*sc,oy-(vy*u-g*u*u/2)*sc];}),1,{color:C.x,w:4});
  for(let k=0;k<=Math.floor(t/.25);k++)s+=dot(ox+vx*.25*k*sc,oy,5,C.x);
  s+=line(X,Y,X,oy,{color:C.x,w:1.5,dash:'5 6'})+line(X,Y,ox,Y,{color:C.v,w:1.5,dash:'5 6'})+dot(X,oy,9,C.x)+dot(ox,Y,9,C.v)+dot(X,Y,13,C.hi);
  return s+label('横の影：同じ間隔で進む',760,150,{size:26,color:C.x})+label('縦の影：上がって、戻る',760,210,{size:26,color:C.v})+tex(`t=${fmt(t,2)}`,1050,300,{size:34});
 },
 'ad-drag':(p)=>{
  const ox=130,oy=450,sc=36,g=9.8;const path=(k)=>{let x=0,y=0,vx=8,vy=10;const out=[[ox,oy]];for(let i=0;i<400&&y>=0;i++){const v=Math.hypot(vx,vy),dt=.01;vx+=-k*v*vx*dt;vy+=(-g-k*v*vy)*dt;x+=vx*dt;y+=vy*dt;out.push([ox+x*sc,oy-y*sc]);}return out;};
  const vac=path(0),dr=path(.08),n=Math.max(2,Math.floor(dr.length*lin(p,0,.8)));
  let s=ground(60,1140,oy+4)+draw(vac,1,{color:C.dim,w:3,dash:'8 8'})+draw(dr.slice(0,n),1,{color:C.x,w:4})+dot(dr[n-1][0],dr[n-1][1],12,C.hi);
  return s+label('空気抵抗なし',vac.at(-1)[0]-20,oy-40,{size:24,color:C.dim,anchor:'end'})+fade(seg(p,.5,.8),label('空気抵抗あり：力が速度で変わる',600,70,{size:28,color:C.x,anchor:'middle'}));
 },
});
