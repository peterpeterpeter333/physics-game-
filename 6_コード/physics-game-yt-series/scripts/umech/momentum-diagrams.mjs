// 単元「運動量と力積」 — pictures. Viewbox 1200×515.
// Colours: momentum pink (C.p), velocity purple, force green, time gold, energy orange/purple.
// Collisions are simulated: during contact both momenta change continuously and the
// white total arrow stays exactly the same length (internal forces cancel).
import {C,clamp,mix,smooth,seg,lin,fmt,fade,label,line,rect,dot,draw,poly,arrow,axes,ground,cart,spring,tex} from './anim.mjs';

const P2='#ffc9f1';          // second body's momentum (lighter pink)
const CA=C.x,CB='#c8d3ea';     // cart colours
const KC=C.v;

// --- 1-D collision with coefficient of restitution e (contact impulse spread smoothly over tau).
function collide({m1=2,m2=1,u1=3,u2=0,e=.5,gap=3.2,tau=.2},t){
 const w=u1-u2,tc=gap/w,J=m1*m2*(1+e)*w/(m1+m2);
 const S=s=>s*s*(3-2*s),IS=s=>s*s*s-s*s*s*s/2; // S and its integral
 let x1,x2,v1,v2;
 if(t<=tc){x1=u1*t;x2=gap+u2*t;v1=u1;v2=u2;}
 else{const s=Math.min(1,(t-tc)/tau),I=IS(s)*tau;
  const x1c=u1*tc,x2c=gap+u2*tc,dt=Math.min(t-tc,tau);
  x1=x1c+u1*dt-J/m1*I;x2=x2c+u2*dt+J/m2*I;v1=u1-J/m1*S(s);v2=u2+J/m2*S(s);
  if(t>tc+tau){x1+=v1*(t-tc-tau);x2+=v2*(t-tc-tau);}}
 return {x1,x2,v1,v2,contact:t>tc&&t<tc+tau,F:t>tc&&t<tc+tau?J/tau*6*((t-tc)/tau)*(1-(t-tc)/tau):0};
}
// x1 = front (bumper tip) of cart A, x2 = back face of cart B, in metres.
function carts(st,{X0=420,PX=45,y=470,wA=140,wB=100,tA='2 kg',tB='1 kg',vel=true,bump=.8}={}){
 const XA=X0+PX*st.x1,XB=X0+PX*(st.x2+bump);
 const bumpL=Math.max(4,Math.min(PX*bump,XB-XA+PX*bump));
 let s=cart(XA-PX*bump-wA/2,y,{w:wA,color:CA,text:tA})+cart(XB+wB/2,y,{w:wB,color:CB,text:tB});
 // bumper on A's front: a short spring that squeezes while touching
 s+=rect(XA-PX*bump,y-56,bumpL,24,{fill:C.hi,fo:.35,rx:6,sw:2,stroke:C.hi});
 if(vel){
  const vA=st.v1,vB=st.v2,cA=XA-PX*bump-wA/2,cB=XB+wB/2;
  if(Math.abs(vA)>.05)s+=arrow(cA,y-100,cA+vA*30,y-100,{color:C.v,w:4,head:12})+label(`${vA<0?'−':''}${fmt(Math.abs(vA),1)} m/s`,cA+vA*30+(vA>0?8:-8),y-92,{size:22,color:C.v,anchor:vA>0?'start':'end'});
  else s+=label('0 m/s',cA,y-92,{size:22,color:C.v,anchor:'middle'});
  if(Math.abs(vB)>.05)s+=arrow(cB,y-130,cB+vB*30,y-130,{color:C.v,w:4,head:12})+label(`${fmt(vB,1)} m/s`,cB+vB*30+8,y-122,{size:22,color:C.v});
  else s+=label('0 m/s',cB,y-122,{size:22,color:C.v,anchor:'middle'});
 }
 return {svg:s,left:XA-PX*bump-wA,right:XB+wB,contact:XA};
}
// Momentum panel: one row per body plus the total (white), all from the same origin.
function pRows(rows,{X0=640,SC=28,y0=50,dy=52,title=true}={}){
 let s=line(X0,y0-26,X0,y0+dy*(rows.length-1)+22,{color:C.faint,w:2});
 rows.forEach(([name,val,col],i)=>{const y=y0+i*dy;
  s+=label(name,X0-330,y+8,{size:22,color:col});
  if(Math.abs(val)>.03)s+=arrow(X0,y,X0+val*SC,y,{color:col,w:i===rows.length-1?8:6,head:16});
  else s+=dot(X0,y,7,col);
  s+=label((val<-.03?'−':'')+fmt(Math.abs(val),1),X0+(val>=0?Math.max(val*SC,6)+14:val*SC-14),y+8,{size:22,color:col,anchor:val>=0?'start':'end',weight:700});
 });
 return s;
}

// ---------------------------------------------------------------- intro
function stopScene(p){
 // Two carts at 3 m/s; from the line both feel the same 6 N backwards.
 const T=3.2*lin(p,.04,.92),L0=120,PX=100,brake=1;
 const lane=(m,y,w)=>{
  const a=6/m,tb=T-brake,stopT=3/a;let x,v;
  if(tb<=0){x=3*T;v=3;}else if(tb<stopT){x=3*brake+3*tb-a*tb*tb/2;v=3-a*tb;}else{x=3*brake+9/(2*a);v=0;}
  const cx=L0+PX*x;let s=ground(60,1140,y)+cart(cx,y,{w,color:m===2?CA:'#7fc8ea',text:`${m} kg`});
  if(v>.05)s+=arrow(cx+w/2+6,y-50,cx+w/2+6+v*28,y-50,{color:C.v,w:4,head:12});
  if(tb>0&&v>.05)s+=arrow(cx-w/2-6,y-40,cx-w/2-70,y-40,{color:C.F,w:6,head:16})+label('6 N',cx-w/2-40,y-58,{size:22,color:C.F,anchor:'middle'});
  if(tb>=stopT)s+=label(`${fmt(stopT,0)} s で止まる`,cx+w/2+20,y-30,{size:24,color:C.t,weight:700});
  return s;};
 let s=lane(2,230,110)+lane(4,460,150);
 const bx=L0+PX*3*brake;
 s+=line(bx,60,bx,470,{color:C.F,w:2,dash:'6 7'})+label('ここから同じ力で止める',bx+10,60,{size:22,color:C.F});
 return s+label(`時刻 ${fmt(T,1)} s`,60,60,{size:24,color:C.t});
}
function compareScene(p){
 const T=1.6*lin(p,.05,.95);let s='';
 [[2,3,CA,150],[1,6,'#7fc8ea',315],[2,-3,CA,480]].forEach(([m,v,col,y],i)=>{
  const g=seg(p,i*.2,i*.2+.15),x0=v>0?230:980,cx=x0+v*55*T,w=m===2?120:90;
  s+=fade(g,ground(60,1140,y)+cart(cx,y,{w,color:col,text:`${m} kg`})
   +label(`${v>0?'':'−'}${Math.abs(v)} m/s`,v>0?cx-w/2-12:cx+w/2+12,y-26,{size:22,color:C.v,anchor:v>0?'end':'start'})
   +arrow(cx,y-96,cx+m*v*20,y-96,{color:C.p,w:7,head:18})+label(`p = ${m*v<0?'−':''}${Math.abs(m*v)}`,cx+m*v*20+(v>0?12:-12),y-88,{size:24,color:C.p,anchor:v>0?'start':'end',weight:700}));
 });
 return s+fade(seg(p,.75,.95),label('運動量は向きを持つ矢印',1150,40,{size:26,color:C.hi,anchor:'end'}));
}
// Two carts at rest pushed apart by a spring: F = 4 N for 0.5 s.
function pushState(T){
 const t0=.3,dt=.5,F=4;
 const s=clamp(T-t0,0,dt),after=Math.max(0,T-t0-dt);
 const vA=-F/2*s,vB=F/1*s;
 const xA=-F/2*s*s/2+vA*after,xB=F*s*s/2+vB*after;
 return {xA,xB,vA,vB,pushing:T>t0&&T<t0+dt,pA:2*vA,pB:vB,t:T};
}
function pushScene(p,stage){
 const T=1.4*lin(p,.05,.9),st=pushState(T),PX=120,y=470;
 const cA=500+PX*st.xA,cB=680+PX*st.xB,wA=140,wB=100;
 let s=ground(60,1140,y);
 // spring fixed on A, natural length 110 px
 const sx=cA+wA/2,len=Math.min(110,cB-wB/2-sx);
 s+=spring(sx,sx+len,y-44,{coils:6,amp:12,color:C.dim,w:3});
 s+=cart(cA,y,{w:wA,color:CA,text:'A 2 kg'})+cart(cB,y,{w:wB,color:CB,text:'B 1 kg'});
 if(st.pushing){s+=arrow(cA-wA/2-4,y-44,cA-wA/2-104,y-44,{color:C.F,w:6,head:16})+label('4 N',cA-wA/2-54,y-62,{size:22,color:C.F,anchor:'middle'});
  s+=arrow(cB+wB/2+4,y-44,cB+wB/2+104,y-44,{color:C.F,w:6,head:16})+label('4 N',cB+wB/2+54,y-62,{size:22,color:C.F,anchor:'middle'});}
 if(Math.abs(st.vA)>.02)s+=arrow(cA,y-100,cA+st.vA*60,y-100,{color:C.v,w:4,head:12})+label(`−${fmt(Math.abs(st.vA),1)} m/s`,cA+st.vA*60-8,y-92,{size:22,color:C.v,anchor:'end'});
 if(Math.abs(st.vB)>.02)s+=arrow(cB,y-100,cB+st.vB*60,y-100,{color:C.v,w:4,head:12})+label(`+${fmt(st.vB,1)} m/s`,cB+st.vB*60+8,y-92,{size:22,color:C.v});
 const pt=clamp((T-.3)/.5);
 s+=label(`押している時間 ${fmt(.5*pt,2)} s`,60,40,{size:24,color:C.t});
 if(stage===1)return s+fade(seg(p,.55,.8),label('いつも同じ大きさ・逆向き',1150,40,{size:26,color:C.hi,anchor:'end'}));
 s+=pRows([['A の運動量',st.pA,C.p],['B の運動量',st.pB,P2],['合計',st.pA+st.pB,C.ink]],{X0:700,SC:50,y0:110,dy:55});
 return s+fade(seg(p,.8,1),label('B は A の 2 倍の速さ',1150,300,{size:26,color:C.hi,anchor:'end',weight:700}));
}
// Sticking collision 2 kg @3 m/s → 1 kg at rest.
const HIT={m1:2,m2:1,u1:3,u2:0,e:0,gap:3.2,tau:.45};
function hitScene(p,stage){
 const T=3.4*lin(p,.04,.9),st=collide(HIT,T);
 const c=carts(st,{X0:470,PX:45});
 let s=ground(60,1140,470)+c.svg;
 s+=pRows([['A 2 kg の運動量',2*st.v1,C.p],['B 1 kg の運動量',st.v2,P2],['合計',2*st.v1+st.v2,C.ink]],{X0:640,SC:26,y0:45,dy:50});
 if(stage===2){
  const g=seg(p,.02,.15),L=c.left-24,R=c.right+24;
  s+=fade(g,rect(L,300,R-L,190,{fill:C.hi,fo:.04,stroke:C.hi,sw:2.5,rx:14})+label('一組（系）',L+10,292,{size:22,color:C.hi}));
  if(st.contact){const Fm=Math.min(1,st.F/60);
   s+=arrow(c.contact-4,420,c.contact-4-80*Fm-8,420,{color:C.F,w:5,head:14})+arrow(c.contact+4,440,c.contact+4+80*Fm+8,440,{color:C.F,w:5,head:14});}
  s+=fade(g,label('内側の力：打ち消し合う',640,215,{size:24,color:C.F,anchor:'middle'}));
  // floor friction on the wheels, drawn outside the box
  const fr=(x,v)=>Math.abs(v)>.05?arrow(x,500,x-Math.sign(v)*44,500,{color:C.a,w:3,head:10}):'';
  s+=fade(seg(p,.4,.6),fr((c.left+c.contact)/2,st.v1)+fr(c.right-50,st.v2)+label('床の摩擦（外からの力）',1150,505,{size:22,color:C.a,anchor:'end'}));
 }
 return s;
}
function extScene(p){
 const A=axes({x:140,y:440,w:760,h:330,xmax:.04,ymax:180,xlabel:'時刻 t [s]',ylabel:'力 F [N]',xticks:[.01,.02,.03],yticks:[50,100,150],grid:true,xcolor:C.t,ycolor:C.F});
 const t1=.01,t2=.03,Fb=t=>t<t1||t>t2?0:150*Math.sin(Math.PI*(t-t1)/(t2-t1))*1.047; // area ≈ 2.0
 let s=A.svg;
 const g=seg(p,.05,.4);
 const pts=[[A.X(t1),A.Y(0)]];for(let i=0;i<=60;i++){const t=mix(t1,t2,i/60);pts.push([A.X(t),A.Y(Fb(t))]);}pts.push([A.X(t2),A.Y(0)]);
 s+=fade(g,poly(pts,{fill:C.F,fo:.3}))+A.plot(Fb,{from:0,to:.04,p:g,color:C.F,w:4,steps:200});
 s+=fade(seg(p,.3,.5),label('押し合う力の力積 2.0',A.X(.031)+10,A.Y(120),{size:24,color:C.F}));
 const gf=seg(p,.45,.7);
 s+=fade(gf,rect(A.X(t1),A.Y(1)-3,A.X(t2)-A.X(t1),6,{fill:C.a,fo:.9,rx:0,sw:0}));
 s+=fade(gf,`<ellipse cx="${A.X(.02)}" cy="${A.Y(0)}" rx="${(A.X(t2)-A.X(t1))/2+24}" ry="26" fill="none" stroke="${C.a}" stroke-width="2.5"/>`);
 s+=fade(gf,label('摩擦 1 N × 0.02 s = 0.02',A.X(.031)+10,A.Y(40),{size:24,color:C.a}));
 return s+fade(seg(p,.75,.95),rect(920,10,250,110,{fill:C.hi,fo:.08,stroke:C.hi,rx:12})+label('0.02 は 6 の',1045,55,{size:24,color:C.hi,anchor:'middle'})+label('わずか 0.3 %',1045,97,{size:24,color:C.hi,anchor:'middle',weight:700}));
}
export const momentumDiagrams={
 'mo-p:stop':stopScene,
 'mo-p:compare':compareScene,
 'mo-push:force':p=>pushScene(p,1),
 'mo-push:grow':p=>pushScene(p,2),
 'mo-hit:run':p=>hitScene(p,1),
 'mo-hit:box':p=>hitScene(p,2),
 'mo-ext':extScene,
};

// ---------------------------------------------------------------- middle: ball on a wall, F–t area
function ballScene(p){
 // wall on the left; right is positive. Contact 0.3 (animation seconds) of the 2.4 s shown.
 const T=2.4*lin(p,.04,.95),tc=1,tau=.35,Wx=140,R=26,PX=22;
 let x,v;
 if(T<tc){v=-20;x=Wx+R+PX*20*(tc-T);}
 else if(T<tc+tau){const s=(T-tc)/tau;v=-20+40*smooth(s);x=Wx+R-10*Math.sin(Math.PI*s);}
 else{v=20;x=Wx+R+PX*20*(T-tc-tau);}
 const Y=330,contact=T>tc&&T<tc+tau,sq=contact?1-.35*Math.sin(Math.PI*(T-tc)/tau):1;
 let s=rect(Wx-40,110,40,340,{fill:C.dim,fo:.35,rx:2,sw:0})+ground(60,1140,Y+R+4);
 s+=`<ellipse cx="${x.toFixed(1)}" cy="${Y}" rx="${(R*sq).toFixed(1)}" ry="${(R/sq).toFixed(1)}" fill="${C.x}" fill-opacity=".35" stroke="${C.x}" stroke-width="3"/>`;
 s+=label('0.15 kg',x,Y-R-14,{size:22,color:C.x,anchor:'middle'});
 if(Math.abs(v)>.5)s+=arrow(x,Y-80,x+v*9,Y-80,{color:C.v,w:6,head:16})+label(`${v>0?'+':'−'}${fmt(Math.abs(v),0)} m/s`,x+v*9+(v>0?12:-12),Y-72,{size:24,color:C.v,anchor:v>0?'start':'end'});
 if(contact)s+=arrow(Wx+2,Y+60,Wx+2+150*Math.sin(Math.PI*(T-tc)/tau),Y+60,{color:C.F,w:7,head:18})+label('壁が押す力',Wx+10,Y+100,{size:22,color:C.F});
 s+=arrow(900,80,1000,80,{color:C.dim,w:3,head:12})+label('右向きを正',1010,88,{size:22,color:C.dim});
 return s+fade(seg(p,.8,1),label('p：−3.0 → +3.0',1150,200,{size:28,color:C.p,anchor:'end',weight:700}));
}
const TAU=.01,F0=6*Math.PI/(2*TAU); // sine pulse with area 6.0 → peak ≈ 942 N
const Fh=t=>t<0||t>TAU?0:F0*Math.sin(Math.PI*t/TAU);
const ftAx=(g=1,xmax=.012,ymax=1000)=>axes({x:150,y:440,w:680,h:350,xmax,ymax,xlabel:'時刻 t [s]',ylabel:'力 F [N]',xticks:xmax<.02?[.005,.01]:[.05,.1],yticks:ymax>500?[500]:[20,40,60],grid:true,g,xcolor:C.t,ycolor:C.F});
function hillScene(p){
 const A=ftAx(seg(p,0,.2));
 let s=A.svg+A.plot(Fh,{from:0,to:.0115,p:seg(p,.2,.8),color:C.F,w:5,steps:200});
 s+=fade(seg(p,.35,.55),label('急に大きくなる',A.X(.0025)-10,A.Y(700),{size:22,color:C.F,anchor:'end'}));
 return s+fade(seg(p,.7,.9),label('離れるとき 0',A.X(.0105),A.Y(120),{size:22,color:C.F})+label('当たる',A.X(0),A.Y(0)+62,{size:22,color:C.t,anchor:'middle'}));
}
function stripScene(p){
 const A=ftAx();let s=A.svg;
 const n=10,w=TAU/n;let acc=0;
 for(let i=0;i<n;i++){const g=seg(p,.05+i*.065,.1+i*.065);if(g<=0)continue;const tm=(i+.5)*w,h=Fh(tm);acc+=h*w*g;
  s+=fade(g,rect(A.X(i*w)+1,A.Y(h),A.X((i+1)*w)-A.X(i*w)-2,A.Y(0)-A.Y(h),{fill:C.p,fo:.45,rx:0,sw:1.5,stroke:C.p}));}
 s+=A.plot(Fh,{from:0,to:.0115,color:C.F,w:4,steps:200});
 const i3=3,tm=(i3+.5)*w;
 s+=fade(seg(p,.12,.3),label('短冊1本 = F × Δt',A.X(0)+14,A.Y(960),{size:22,color:C.p})+arrow(A.X(0)+60,A.Y(900),A.X(1.5*w),A.Y(Fh(1.5*w))-6,{color:C.p,w:3,head:12}));
 // running total of Δp
 s+=line(990,440,1170,440,{color:C.dim,w:2});
 const H=acc/6*300;s+=rect(1035,440-H,90,H,{fill:C.p,fo:.5,rx:3,sw:2,stroke:C.p})+label(`Δp = ${acc.toFixed(1)}`,1080,440-H-14,{size:24,color:C.p,anchor:'middle',weight:700});
 return s+label('足していく',1080,480,{size:22,color:C.dim,anchor:'middle'});
}
function rectScene(p,stage){
 // stage 1: hard wall (0.010 s, 600 N); stage 2: stretch to 0.10 s → 60 N at constant area.
 const u=stage===1?0:seg(p,.1,.75),W=mix(.01,.1,u),H=6/W;
 const A=axes({x:150,y:440,w:720,h:350,xmax:.12,ymax:1000,xlabel:'時刻 t [s]',ylabel:'力 F [N]',xticks:[.01,.05,.1],yticks:[60,600],grid:true,xcolor:C.t,ycolor:C.F});
 let s=A.svg;
 if(stage===1){const g=seg(p,.05,.35);s+=fade(g*.7,poly([[A.X(0),A.Y(0)],...Array.from({length:41},(_,i)=>{const t=TAU*i/40;return [A.X(t),A.Y(Fh(t))];}),[A.X(TAU),A.Y(0)]],{fill:C.F,fo:.15,stroke:C.F,sw:2}));}
 const gr=stage===1?seg(p,.3,.6):1;
 s+=fade(gr,rect(A.X(0),A.Y(H),A.X(W)-A.X(0),A.Y(0)-A.Y(H),{fill:C.p,fo:.45,rx:0,sw:2.5,stroke:C.p}));
 s+=fade(gr,label(`平均 ${fmt(H,0)} N`,A.X(W)+14,A.Y(H)+8,{size:26,color:C.F,weight:700}));
 s+=fade(gr,label(`幅 ${fmt(W,3)} s`,A.X(W/2),A.Y(0)+62,{size:22,color:C.t,anchor:'middle'}));
 s+=fade(gr,rect(930,80,240,100,{fill:C.p,fo:.08,stroke:C.p,rx:12})+label('面積 = 6.0',1050,122,{size:26,color:C.p,anchor:'middle',weight:700})+label('（Δp は同じ）',1050,160,{size:22,color:C.p,anchor:'middle'}));
 s+=fade(gr,label(stage===1?'硬い壁':'柔らかいマット',1050,240,{size:28,color:C.hi,anchor:'middle'}));
 if(stage===2)s+=fade(seg(p,.1,.3),line(A.X(0),A.Y(600),A.X(.01),A.Y(600),{color:C.F,w:2,dash:'6 6'}))+fade(seg(p,.75,.95),label('力は 1/10',1050,300,{size:30,color:C.hi,anchor:'middle',weight:700}));
 return s;
}
Object.assign(momentumDiagrams,{
 'mo-ball:hit':ballScene,
 'mo-ft:hill':hillScene,
 'mo-ft:strips':stripScene,
 'mo-ft:hard':p=>rectScene(p,1),
 'mo-ft:soft':p=>rectScene(p,2),
});

// ---------------------------------------------------------------- advanced: restitution
const BOUNCE={m1:2,m2:1,u1:3,u2:0,e:.5,gap:3.2,tau:.3};
function barsScene(p){
 const T=3.4*lin(p,.04,.9),st=collide(BOUNCE,T);
 const c=carts(st,{X0:330,PX:45,y:250});
 let s=ground(60,1140,250)+c.svg;
 const y0=490,SC=30,p1=2*st.v1,p2=st.v2;
 s+=line(200,y0,1100,y0,{color:C.dim,w:2});
 const bar=(x,v,col,name)=>rect(x,y0-v*SC,110,v*SC,{fill:col,fo:.5,rx:3,sw:2,stroke:col})+label(fmt(v,1),x+55,y0-v*SC-10,{size:22,color:col,anchor:'middle',weight:700})+label(name,x+55+80,y0-10,{size:22,color:col});
 s+=bar(230,p1,C.p,'p₁')+bar(460,p2,P2,'p₂');
 // stacked total
 s+=rect(760,y0-p1*SC,110,p1*SC,{fill:C.p,fo:.5,rx:0,sw:0})+rect(760,y0-(p1+p2)*SC,110,p2*SC,{fill:P2,fo:.5,rx:0,sw:0});
 s+=rect(760,y0-6*SC,110,6*SC,{fill:'none',fo:0,stroke:C.ink,sw:2.5,rx:3})+label('合計 6',890,y0-6*SC+8,{size:24,color:C.ink,weight:700});
 return s;
}
function unknownScene(p){
 // three outcomes that all satisfy 6 = 2v1' + v2'
 const outs=[[2,2],[1.5,3],[1,4]],E=[0,.5,1];
 let s=tex("6=2v_1'+v_2'",600,50,{size:40});
 s+=label('分からないのは 2 つ、式は 1 本',600,110,{size:24,color:C.hi,anchor:'middle'});
 outs.forEach(([a,b],i)=>{
  const g=seg(p,.05+i*.28,.15+i*.28);if(g<=0)return;
  const T=3.4*lin(p,.05+i*.28,.3+i*.28),y=240+i*110,st=collide({...BOUNCE,e:E[i]},T);
  const c=carts(st,{X0:330,PX:40,y,vel:false,wA:110,wB:80});
  s+=fade(g,ground(200,1000,y)+c.svg+label(`v₁′ = ${a}, v₂′ = ${b}`,1010,y-20,{size:22,color:C.v})+label(`2×${a}+${b} = 6`,1010,y+8,{size:22,color:C.p}));
 });
 return s;
}
function relScene(p){
 const T=3.4*lin(p,.04,.8),st=collide(BOUNCE,T);
 const c=carts(st,{X0:330,PX:45,y:330});
 let s=ground(60,1140,330)+c.svg;
 const before=T<3.2/3,after=T>3.2/3+BOUNCE.tau;
 s+=fade(seg(p,.05,.2),rect(80,390,500,100,{fill:C.v,fo:.07,stroke:C.v,rx:12})+label('近づく速さ',100,430,{size:24,color:C.v})+label('3 − 0 = 3 m/s',100,470,{size:26,color:C.ink,weight:700}));
 if(after)s+=fade(seg(p,.45,.6),rect(620,390,500,100,{fill:C.v,fo:.07,stroke:C.v,rx:12})+label('離れる速さ',640,430,{size:24,color:C.v})+label('3.0 − 1.5 = 1.5 m/s',640,470,{size:26,color:C.ink,weight:700}));
 s+=fade(seg(p,.7,.9),tex('e=\\frac{1.5}{3}=0.5',600,70,{size:40})+label('反発係数',400,80,{size:26,color:C.hi,anchor:'end'}));
 return s+(before?'':'');
}
function threeScene(p){
 const T=3.4*lin(p,.04,.9);let s='';
 [[0,'くっつく'],[.5,'中間'],[1,'よく弾む']].forEach(([e,word],i)=>{const y=160+i*150,st=collide({...BOUNCE,e},T);
  const c=carts(st,{X0:330,PX:40,y,wA:120,wB:86,vel:false});
  const after=T>3.2/3+BOUNCE.tau;
  s+=ground(200,960,y)+c.svg+label(`e = ${e}`,40,y-40,{size:28,color:C.hi,weight:700})+label(word,40,y-6,{size:22,color:C.dim});
  s+=after?label(`後：${fmt(st.v1,1)} と ${fmt(st.v2,1)} m/s`,975,y-20,{size:22,color:C.v}):label('前：3 と 0 m/s',975,y-20,{size:22,color:C.v});
 });
 return s;
}
function kbars(x,y0,parts,SC,{name='',g=1,val=true}={}){
 let s='',acc=0;parts.forEach(([v,col])=>{s+=rect(x,y0-(acc+v)*SC,90,v*SC,{fill:col,fo:.5,rx:0,sw:0});acc+=v;});
 return fade(g,s+(val?label(`${fmt(acc,2)} J`,x+45,y0-acc*SC-12,{size:24,color:C.E,anchor:'middle',weight:700}):'')+(name?label(name,x+45,y0+30,{size:22,color:C.dim,anchor:'middle'}):''));
}
function solveScene(p){
 const T=3.4*lin(p,.04,.75),st=collide(BOUNCE,T);
 const c=carts(st,{X0:250,PX:40,y:260,wA:120,wB:86});
 let s=ground(60,760,260)+c.svg;
 const y0=470,SC=26,K1=.5*2*st.v1*st.v1,K2=.5*st.v2*st.v2;
 s+=line(820,y0,1170,y0,{color:C.dim,w:2})+line(820,y0-9*SC,1170,y0-9*SC,{color:C.faint,w:2,dash:'6 6'})+label('9 J',1170,y0-9*SC-10,{size:22,color:C.dim,anchor:'end'});
 s+=kbars(900,y0,[[K1,C.x],[K2,CB]],SC,{name:'運動エネルギー'});
 s+=label(`p₁ + p₂ = ${fmt(2*st.v1,1)} + ${fmt(st.v2,1)} = 6`,60,370,{size:26,color:C.p,weight:700});
 s+=rect(820,60,22,22,{fill:C.x,fo:.5,rx:3,sw:0})+label('2 kg の K',850,79,{size:22,color:C.x})+rect(990,60,22,22,{fill:CB,fo:.5,rx:3,sw:0})+label('1 kg の K',1020,79,{size:22,color:CB});
 const lost=9-K1-K2;
 s+=fade(seg(p,.75,.95),label(`減った ${fmt(lost,2)} J → 音・熱・変形`,60,430,{size:26,color:C.hi}));
 return s;
}
function kCompare(p){
 const y0=440,SC=30;let s=line(120,y0,1100,y0,{color:C.dim,w:2})+line(120,y0-9*SC,1100,y0-9*SC,{color:C.faint,w:2,dash:'6 6'})+label('衝突前 9 J',1100,y0-9*SC-12,{size:22,color:C.dim,anchor:'end'});
 [[0,2,2],[.5,1.5,3],[1,1,4]].forEach(([e,a,b],i)=>{const g=seg(p,.05+i*.2,.2+i*.2),x=200+i*300,u=g;
  s+=fade(g,label(`e = ${e}`,x+45,y0+34,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=kbars(x,y0,[[.5*2*a*a*u,C.x],[.5*b*b*u,CB]],SC,{g,val:u>.97});
  s+=fade(g,label('p = 6',x+45+120,y0-20,{size:24,color:C.p,anchor:'middle',weight:700}));
 });
 return s+fade(seg(p,.75,.95),label('e = 1 のときだけ 9 J が残る',610,60,{size:30,color:C.hi,anchor:'middle',weight:700}));
}
Object.assign(momentumDiagrams,{
 'mo-e:bars':barsScene,
 'mo-unknown':unknownScene,
 'mo-rel':relScene,
 'mo-three':threeScene,
 'mo-solve:run':solveScene,
 'mo-kcmp':kCompare,
});
