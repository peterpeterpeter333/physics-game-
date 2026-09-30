// YouTube 1分動画「微分」— pictures. Stage 1200×515. Colours: x cyan, v purple, t gold (anim.mjs C).
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';

// ---- speedometer --------------------------------------------------------------------------
function meter(cx,cy,r,kmh,{readout='',needle=1}={}){
 const MAX=60,ang=v=>(210-240*clamp(v/MAX))*Math.PI/180,P=(v,rr)=>[cx+rr*Math.cos(ang(v)),cy-rr*Math.sin(ang(v))];
 let s=ring(cx,cy,r+14,{color:C.faint,w:3,fill:'#10182c'});
 s+=draw(Array.from({length:61},(_,i)=>P(i,r)),1,{color:C.dim,w:4});
 for(let v=0;v<=MAX;v+=10){const [x1,y1]=P(v,r-6),[x2,y2]=P(v,r-26),[lx,ly]=P(v,r-52);s+=line(x1,y1,x2,y2,{color:C.dim,w:3})+label(String(v),lx,ly+8,{size:22,color:C.dim,anchor:'middle'});}
 const [nx,ny]=P(kmh,r-30);s+=fade(needle,line(cx,cy,nx,ny,{color:C.a,w:6})+dot(cx,cy,10,C.a));
 s+=label('km/h',cx,cy+50,{size:22,color:C.dim,anchor:'middle'});
 if(readout){const w=Math.max(200,readout.length*20);s+=rect(cx-w/2,cy+r+30,w,52,{fill:'#0d1526',fo:1,stroke:C.v,sw:2,rx:10})+label(readout,cx,cy+r+66,{size:28,color:C.v,anchor:'middle',weight:700});}
 return s;
}

// ---- the x–t graph of x = 5t² (left half) ----------------------------------------------
const xt=t=>5*t*t;
function graph({g=1,curve=1,dim=1}={}){
 const A=axes({x:110,y:450,w:520,h:340,xmax:2.3,ymax:26,xlabel:'時刻 t [s]',ylabel:'位置 x [m]',xticks:[1,2],yticks:[5,10,15,20,25],grid:true,g,xcolor:C.t,ycolor:C.x});
 return {A,svg:fade(dim,A.svg+A.plot(xt,{from:0,to:2.2,p:curve,color:C.x,w:4}))};
}
const P1=(A)=>[A.X(1),A.Y(5)];
function pt(A,t,g=1,color=C.hi,text=''){const x=A.X(t),y=A.Y(xt(t));return fade(g,dot(x,y,9,color)+(text?label(text,x+14,y+30,{size:22,color}):''));}
// straight line through (t1,x1),(t2,x2) extended a little on both sides
function secant(A,t1,t2,{g=1,color=C.v,w=4,ext=.35}={}){
 const k=(xt(t2)-xt(t1))/(t2-t1),a=t1-ext,b=Math.min(2.25,t2+ext);
 return draw([[A.X(a),A.Y(xt(t1)+k*(a-t1))],[A.X(b),A.Y(xt(t1)+k*(b-t1))]],g,{color,w});
}
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

export const ytDerivDiagrams={
 'yd1:meter':(p)=>{
  const wob=36+3*Math.sin(p*9);
  let s=meter(300,240,130,wob,{readout:'いま ？ km/h'});
  s+=fade(seg(p,.12,.3),label('速さ ＝ 距離 ÷ 時間',720,190,{size:38,color:C.ink}));
  s+=fade(seg(p,.45,.62),label('一瞬だけでは',720,270,{size:30,color:C.dim})+tex('\\dfrac{0\\,\\mathrm{m}}{0\\,\\mathrm{s}}=\\;?',880,370,{size:56,auto:false,color:C.ink}));
  s+=fade(seg(p,.7,.85),label('割り算ができない',720,480,{size:30,color:C.a,weight:700}));
  return s;
 },
 'yd1:graph':(p)=>{
  const {A,svg}=graph({g:seg(p,0,.15),curve:seg(p,.1,.45)});
  let s=svg+fade(seg(p,.35,.5),tex('x=5t^2',910,160,{size:60}));
  s+=fade(seg(p,.45,.6),label('x：位置 [m]',800,250,{size:28,color:C.x})+label('t：時刻 [s]',800,300,{size:28,color:C.t}));
  s+=pt(A,1,seg(p,.62,.75),C.hi,'t = 1 s，x = 5 m')+pt(A,2,seg(p,.72,.85),C.hi,'');
  s+=fade(seg(p,.72,.85),label('t = 2 s，x = 20 m',A.X(2)-12,A.Y(20)-18,{size:22,color:C.hi,anchor:'end'}));
  return s;
 },
 'yd1:avg':(p)=>{
  const {A,svg}=graph();const [x1,y1]=P1(A),x2=A.X(2),y2=A.Y(20);
  let s=svg+pt(A,1)+pt(A,2);
  const gt=seg(p,.05,.3),gx=seg(p,.3,.55);
  s+=line(x1,y1,mix(x1,x2,gt),y1,{color:C.t,w:6})+fade(gt,label('① Δt ＝ 1 s',(x1+x2)/2,y1+36,{size:26,color:C.t,anchor:'middle'}));
  s+=line(x2,y1,x2,mix(y1,y2,gx),{color:C.x,w:6})+fade(gx,label('② Δx ＝ 15 m',x2+14,(y1+y2)/2+8,{size:26,color:C.x}));
  s+=card(790,110,380,330,
   label('平均の速さ',980,155,{size:28,color:C.v,anchor:'middle',weight:700})
   +tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',980,240,{size:50})
   +fade(seg(p,.62,.78),tex('=\\dfrac{15\\,\\mathrm{m}}{1\\,\\mathrm{s}}=15\\,\\mathrm{m/s}',980,370,{size:40,auto:false,color:C.v})),seg(p,.55,.65));
  return s;
 },
 'yd1:secant':(p)=>{
  const {A,svg}=graph();let s=svg+pt(A,1)+pt(A,2)+secant(A,1,2,{g:seg(p,.05,.35)});
  s+=fade(seg(p,.3,.45),label('傾き ＝ 平均の速さ 15 m/s',720,170,{size:30,color:C.v}));
  s+=fade(seg(p,.45,.6),line(A.X(1),A.Y(0),A.X(2),A.Y(0),{color:C.t,w:8})+label('1秒間を ならした値',720,235,{size:30,color:C.t}));
  s+=fade(seg(p,.7,.85),ring(A.X(1),A.Y(5),20,{color:C.a,w:3})+label('1秒ちょうどの速さは？',720,320,{size:32,color:C.a,weight:700}));
  return s;
 },
 'yd1:predict':(p)=>{
  const {A,svg}=graph();const h=1-.45*smooth(clamp(p/.6));
  let s=svg+secant(A,1,2,{color:C.faint})+pt(A,1)+pt(A,1+h,1,C.hi)+arrow(A.X(1+h)+20,A.Y(xt(1+h))-26,A.X(1+h)-50,A.Y(xt(1+h))-60,{color:C.hi,w:4,g:seg(p,.1,.4)});
  s+=card(720,150,440,220,label('区間を短くすると',940,215,{size:32,color:C.ink,anchor:'middle'})+label('平均の速さは？',940,270,{size:32,color:C.v,anchor:'middle',weight:700})+label('予想してみよう',940,335,{size:26,color:C.hi,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 'yd1:shrink':(p)=>{
  const {A,svg}=graph();
  const lg=p<.08?0:p<.38?smooth((p-.08)/.3):p<.48?1:p<.78?1+smooth((p-.48)/.3):2,h=Math.pow(10,-lg);
  let s=svg+pt(A,1)+pt(A,1+h,1,C.hi)+secant(A,1,1+h);
  const rows=[[1,'15'],[.1,'10.5'],[.01,'10.05']],show=[1,seg(p,.3,.4),seg(p,.7,.8)];
  let t='';rows.forEach(([w,v],i)=>{t+=fade(show[i],label(`幅 ${w} s`,760,210+i*70,{size:30,color:C.t})+label('→',905,210+i*70,{size:30,color:C.dim})+label(`${v} m/s`,1140,210+i*70,{size:32,color:C.v,anchor:'end',weight:700}));});
  s+=card(720,130,450,260,label('平均の速さ',945,172,{size:24,color:C.dim,anchor:'middle'})+t);
  s+=fade(seg(p,.82,.95),label('ある値へ 近づく',945,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 'yd1:algebra':(p)=>{
  // formula is the main subject; a small time strip shows what h is
  let s=line(120,90,520,90,{color:C.dim,w:3})+dot(200,90,8,C.hi)+dot(440,90,8,C.hi)+label('t = 1',200,128,{size:24,color:C.t,anchor:'middle'})+label('t = 1 + h',440,128,{size:24,color:C.t,anchor:'middle'})
   +brace(200,440,62,{dir:-1,text:'幅 h',color:C.t,size:26});
  const r1=seg(p,.02,.12),r2=seg(p,.22,.32),r3=seg(p,.45,.55),r4=seg(p,.68,.78);
  s+=fade(r1,tex('\\Delta x=5(1+h)^2-5\\cdot 1^2',420,190,{size:44,anchor:'start'})+label('進んだ距離',1150,190,{size:24,color:C.x,anchor:'end'}));
  s+=fade(r2,tex('=10h+5h^2',510,262,{size:44,anchor:'start'}));
  s+=fade(r3,tex('\\bar v=\\dfrac{10h+5h^2}{h}',420,370,{size:44,anchor:'start'})+label('h で割る ＝ 1秒あたりに直す',1150,375,{size:26,color:C.hi,anchor:'end'}));
  s+=fade(r4,tex('=10+5h',510,475,{size:50,anchor:'start'})+highlight(495,440,texWidth('=10+5h',50)+30,66,1));
  return s;
 },
 'yd1:limit':(p)=>{
  const {A,svg}=graph();const h=Math.pow(10,-3*smooth(clamp(p/.6))),g2=seg(p,.55,.7);
  let s=svg+pt(A,1)+pt(A,1+h,1,C.hi)+fade(1-g2*.6,secant(A,1,1+h))+fade(g2,secant(A,1,1.001,{color:C.hi,w:5,ext:.6}));
  s+=card(700,110,470,300,
   tex('\\bar v=10+5h',935,175,{size:50})
   +label(`h ＝ ${h<.0015?'0.001':fmt(h,3)}`,760,250,{size:28,color:C.t})
   +rect(760,275,380*(10/(10+5*h))*.9,26,{fill:C.v,fo:.6,rx:6})+rect(760+380*(10/(10+5*h))*.9,275,380*(5*h/(10+5*h))*.9,26,{fill:C.a,fo:.8,rx:6})
   +label('10',760,330,{size:22,color:C.v})+label('5h → 小さく',1140,330,{size:22,color:C.a,anchor:'end'})
   +fade(g2,label('近づく先 ＝ 10 m/s',935,390,{size:32,color:C.hi,anchor:'middle',weight:700})));
  s+=fade(seg(p,.72,.88),label('✕ h ＝ 0 を入れて割る',820,452,{size:24,color:C.a})+label('○ 近づく先を使う',820,490,{size:24,color:C.F}));
  return s;
 },
 'yd1:dxdt':(p)=>{
  let s=meter(300,220,120,36,{readout:'10 m/s ＝ 36 km/h'});
  s+=card(640,110,520,300,
   tex('v=\\dfrac{dx}{dt}',900,215,{size:70})
   +label('Δx ÷ Δt の、幅を縮めた 近づく先',900,300,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.55),label('t ＝ 1 s では 10 m/s',900,370,{size:32,color:C.v,anchor:'middle',weight:700})),seg(p,0,.15));
  s+=fade(seg(p,.6,.75),label('針が指していた値',300,500,{size:24,color:C.hi,anchor:'middle'}));
  return s;
 },
 'yd1:next':(p)=>{
  const A=axes({x:130,y:450,w:460,h:320,xmax:2.3,ymax:26,xlabel:'時刻 t [s]',ylabel:'速さ v [m/s]',xticks:[1,2],yticks:[10,20],grid:true,g:seg(p,0,.2),xcolor:C.t,ycolor:C.v});
  let s=A.svg+A.plot(t=>10*t,{from:0,to:2.2,p:seg(p,.1,.45),color:C.v,w:4});
  s+=card(660,140,500,230,label('次の問い',910,195,{size:26,color:C.dim,anchor:'middle'})+label('速さが 変わる割合（加速度）も',910,260,{size:30,color:C.ink,anchor:'middle'})+label('同じ方法で 求められる？',910,315,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};
