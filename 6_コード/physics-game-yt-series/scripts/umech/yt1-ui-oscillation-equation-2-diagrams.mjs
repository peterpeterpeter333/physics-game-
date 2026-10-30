// YouTube シリーズ 振動の方程式・初級 2/2（ステージ ui-oscillation-equation 本3・本4）— 図。Stage 1200×515.
// 色：位置・影 x 水色、速度 v 紫、加速度 a 赤、力 F 緑、時刻・周期 t,T 金、角度（中身）橙、ω 桃、強調 黄。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,wall,ground,block,spring} from './anim.mjs';

const K='ui-oscillation-equation-2:';
const CW=C.p,CU=C.E;
const W=`{\\color{${CW}}\\omega}`;
const XDD=`\\dfrac{d^2x}{dt^2}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const P=(cx,cy,R,th)=>[cx+R*Math.cos(th),cy-R*Math.sin(th)];
const TAU=2*Math.PI;

// ---- spring + block (same drawing as 1/2) ----------------------------------------------------
function rig(d,{ox=600,y=400,sc=1500,wx=180,x0lab=1,xArr=0,fArr=0,fk=1,g=1,bw=110,bh=90,mtext='m',x1=1150,bcol=C.x}={}){
 const bx=ox+d*sc;
 let s=ground(wx-10,x1,y)+wall(wx,y-bh-60,y);
 s+=spring(wx,bx-bw/2,y-bh/2,{coils:10,amp:14,color:C.dim,w:3});
 s+=block(bx,y,bw,bh,{color:bcol,text:mtext,size:26,fo:.22});
 if(x0lab)s+=line(ox,y-bh-40,ox,y+10,{color:C.dim,w:2,dash:'7 7'});
 const L=-d*sc*fk;
 if(xArr&&Math.abs(d)>.004)s+=fade(xArr,arrow(ox,y-bh-24,bx,y-bh-24,{color:C.x,w:5,head:14}));
 if(fArr&&Math.abs(d)>.004)s+=fade(fArr,arrow(bx,y-bh-8,bx+L,y-bh-8,{color:C.F,w:6,head:16})+label('F',bx+L+(L<0?-12:12),y-bh+2,{size:26,color:C.F,anchor:L<0?'end':'start',weight:700}));
 return fade(g,s);
}
// ---- circle + shadow: point at angle u, shadow on a vertical line at x0, optional trace --------
function shadow(u,{cx=230,cy=280,R=140,x0=470,trace=0,u0=.5,x1=1150,tsc=45,vel=0,g=1,arc=0,lab=1}={}){
 const [px,py]=P(cx,cy,R,u);
 let s=line(cx-R-24,cy,cx+R+24,cy,{color:C.faint,w:2})+line(cx,cy+R+24,cx,cy-R-24,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
 if(arc&&u>u0+.02)s+=draw(Array.from({length:61},(_,i)=>P(cx,cy,48,u0+(u-u0)*i/60)),1,{color:CU,w:4});
 s+=line(cx,cy,px,py,{color:C.ink,w:3})+dot(px,py,11,C.hi);
 s+=line(px,py,x0,py,{color:C.faint,w:2,dash:'6 6'});
 s+=line(x0,cy-R-16,x0,cy+R+16,{color:C.dim,w:2})+dot(x0,py,10,C.x);
 if(lab)s+=label('x',x0-14,cy-R-24,{size:26,color:C.x,anchor:'end'});
 if(vel){const L=R*.7,vx=-Math.sin(u)*L,vy=-Math.cos(u)*L;s+=fade(vel,arrow(px,py,px+vx,py+vy,{color:C.v,w:5,head:14})+arrow(x0,py,x0,py+vy,{color:C.v,w:5,head:14}));}
 if(trace){const X=v=>x0+30+(v-u0)*tsc;
  s+=line(x0,cy,x1,cy,{color:C.faint,w:2})+label('t →',x1,cy+36,{size:24,color:C.t,anchor:'end'});
  s+=draw(Array.from({length:201},(_,i)=>{const v=u0+(u-u0)*i/200;return [X(v),cy-R*Math.sin(v)];}),1,{color:C.x,w:4});
  s+=dot(X(u),py,8,C.x);}
 return fade(g,s);
}
// sin graph over the "inside" u
function sinAxes({x=90,y=440,w=980,h=300,umax=4.6*Math.PI,g=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:umax,ymin:-1.25,ymax:1.25,xlabel:'中身',ylabel:'',xticks:[],yticks:[],xcolor:CU,g});
 return A;
}
function tangent(A,u,{half=.9,color=C.hi,g=1}={}){const y0=Math.sin(u),k=Math.cos(u);return draw([[A.X(u-half),A.Y(y0-k*half)],[A.X(u+half),A.Y(y0+k*half)]],g,{color,w:4});}

export const ytUiOscillationEquation2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=rig(.1*Math.cos(2*4*Math.PI*p),{y:480,bh:70});
  s+=card(200,20,800,260,tex(`${XDD}=-${W}^2x`,600,95,{size:50})+tex(`${W}=\\sqrt{\\dfrac{k}{m}}`,600,215,{size:38}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'sol']:(p)=>{
  let s=shadow(.5+TAU*.9*p,{trace:1,cy:300,R:130,x1:1150,tsc:50});
  s+=fade(seg(p,.05,.2),tex(`x=A\\sin(${W}t+\\varphi)`,820,80,{size:44}));
  s+=fade(seg(p,.5,.65),label('A：振幅　ω：角振動数',820,140,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=shadow(.5+TAU*(.3+.5*p),{cy:300,R:130,trace:0});
  s+=card(560,120,560,200,label('何秒で 一周する？',840,195,{size:38,color:C.hi,anchor:'middle',weight:700})+tex('T=\\;?',840,270,{size:48}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  const t=4*Math.PI*p;
  let s=rig(.1*Math.cos(2*t),{sc:1000,y:200,bh:70,ox:600,mtext:'0.1 m'})+rig(.2*Math.cos(2*t),{sc:1000,y:420,bh:70,ox:600,mtext:'0.2 m'});
  s+=card(840,40,330,90,label('大きく 揺らすと？',1005,96,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },

 // ===== S2 円運動の影で一周を見る =====
 [K+'shadow']:(p)=>{
  let s=shadow(.5+TAU*.8*p,{trace:1,cy:280,R:140,tsc:48});
  s+=fade(seg(p,.1,.25),label('半径 A',120,110,{size:26,color:C.ink})+label('影の高さ ＝ x',490,110,{size:26,color:C.x}));
  return s;
 },
 [K+'angle']:(p)=>{
  const u=.5+1.6*seg(p,.05,.7);
  let s=shadow(u,{cx:300,cy:270,R:170,x0:560,arc:1,u0:0});
  const [lx,ly]=P(300,270,78,u/2);s+=label('ωt ＋ φ',lx+6,ly+10,{size:24,color:CU});
  s+=card(680,110,470,240,label('回った角度 ＝ 中身',915,180,{size:32,color:CU,anchor:'middle',weight:700})+label('1秒に ω ずつ 進む',915,260,{size:32,color:CW,anchor:'middle',weight:700}),seg(p,0,.15));
  return s;
 },
 [K+'turn']:(p)=>{
  const cx=320,cy=270,R=170,u=TAU*seg(p,.05,.8);
  let s=ring(cx,cy,R,{color:C.dim,w:3})+line(cx,cy,cx+R+30,cy,{color:C.faint,w:2});
  s+=draw(Array.from({length:121},(_,i)=>P(cx,cy,R,u*i/120)),1,{color:CU,w:7});
  const [px,py]=P(cx,cy,R,u);s+=line(cx,cy,px,py,{color:C.ink,w:3})+dot(px,py,11,C.hi);
  s+=fade(seg(p,.3,.45),label('半周 ＝ π',cx-R-20,cy-R+10,{size:30,color:CU,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('一周 ＝ 2π',cx,cy+R+60,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=card(680,150,460,160,label('角度 ＝ 弧の長さ（ラジアン）',910,215,{size:28,color:C.ink,anchor:'middle'})+label('半径 1 の円周 ＝ 2π',910,270,{size:28,color:C.dim,anchor:'middle'}),seg(p,0,.15));
  return s;
 },
 [K+'back']:(p)=>{
  const u0=.7,u=u0+TAU*seg(p,.05,.6);
  let s=shadow(u,{cx:260,cy:280,R:150,x0:520,vel:1,arc:0,u0});
  const [qx,qy]=P(260,280,150,u0);s+=ring(qx,qy,20,{color:C.hi,w:3,dash:'5 5'});
  s+=card(680,110,470,260,label('一周すると',915,170,{size:28,color:C.dim,anchor:'middle'})
   +label('同じ 場所・同じ 向き',915,235,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('影も 同じ高さ・同じ速度',915,310,{size:30,color:C.x,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'graph']:(p)=>{
  const A=sinAxes({y:420,h:280}),u0=1.1;
  let s=A.svg+A.plot(Math.sin,{from:0,to:4.5*Math.PI,p:seg(p,0,.3),color:C.x,w:4});
  s+=fade(seg(p,.3,.45),dot(A.X(u0),A.Y(Math.sin(u0)),9,C.hi)+tangent(A,u0));
  s+=fade(seg(p,.5,.65),dot(A.X(u0+TAU),A.Y(Math.sin(u0)),9,C.hi)+tangent(A,u0+TAU));
  s+=fade(seg(p,.55,.7),brace(A.X(u0),A.X(u0+TAU),A.Y(1.2)-20,{dir:-1,text:'中身 ＋ 2π',size:28,color:CU}));
  s+=fade(seg(p,.72,.85),label('同じ値・同じ傾き',A.X(u0+TAU)+40,A.Y(Math.sin(u0))+50,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'trap']:(p)=>{
  const A=sinAxes({x:470,y:410,w:640,h:260,umax:2.3*Math.PI}),u0=.7,u1=Math.PI-u0;
  let s=A.svg+A.plot(Math.sin,{from:0,to:2.2*Math.PI,color:C.x,w:4});
  s+=dot(A.X(u0),A.Y(Math.sin(u0)),9,C.hi)+tangent(A,u0,{half:.6})+fade(seg(p,.25,.4),dot(A.X(u1),A.Y(Math.sin(u1)),9,C.a)+tangent(A,u1,{half:.6,color:C.a}));
  s+=fade(seg(p,.25,.4),line(A.X(u0),A.Y(Math.sin(u0)),A.X(u1),A.Y(Math.sin(u1)),{color:C.dim,w:2,dash:'6 6'})+label('同じ高さ',(A.X(u0)+A.X(u1))/2,A.Y(Math.sin(u0))+36,{size:24,color:C.dim,anchor:'middle'}));
  // circle: two points with the same height, velocities opposite in the vertical
  const cx=210,cy=280,R=140,[ax,ay]=P(cx,cy,R,u0),[bx,by]=P(cx,cy,R,u1);
  s+=ring(cx,cy,R,{color:C.dim,w:3})+line(cx-R-20,cy,cx+R+20,cy,{color:C.faint,w:2});
  const L=100;s+=dot(ax,ay,10,C.hi)+arrow(ax,ay,ax-Math.sin(u0)*L,ay-Math.cos(u0)*L,{color:C.v,w:5,head:14});
  s+=fade(seg(p,.25,.4),dot(bx,by,10,C.a)+arrow(bx,by,bx-Math.sin(u1)*L,by-Math.cos(u1)*L,{color:C.v,w:5,head:14}));
  s+=fade(seg(p,.55,.7),label('上へ',ax+18,ay-60,{size:26,color:C.v})+label('下へ',bx-10,by+80,{size:26,color:C.v,anchor:'end'})+label('向きが 逆 → まだ 一周ではない',600,480,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'period']:(p)=>{
  const A=axes({x:90,y:430,w:1040,h:300,xmin:0,xmax:4.6*Math.PI,ymin:-1.25,ymax:1.25,xlabel:'t',ylabel:'x',xticks:[],yticks:[],xcolor:C.t,ycolor:C.x});
  const u0=.7;let s=A.svg+A.plot(Math.sin,{from:0,to:4.5*Math.PI,color:C.x,w:4});
  [0,1,2].forEach(i=>{s+=fade(seg(p,.15+.15*i,.3+.15*i),dot(A.X(u0+TAU*i),A.Y(Math.sin(u0)),9,C.hi));});
  s+=fade(seg(p,.5,.65),brace(A.X(u0),A.X(u0+TAU),A.Y(1.2)-16,{dir:-1,text:'周期 T',size:30,color:C.t})+brace(A.X(u0+TAU),A.X(u0+2*TAU),A.Y(1.2)-16,{dir:-1,text:'T',size:30,color:C.t}));
  s+=fade(seg(p,.7,.85),label('同じ位置・同じ速度 に戻るまでの時間',600,490,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S3 周期の式を作る =====
 [K+'wt']:(p)=>{
  let s='';const x0=140,sc=130;
  s+=line(x0,150,x0+6*sc,150,{color:C.dim,w:3});
  for(let i=0;i<=4;i++)s+=fade(seg(p,.05+.08*i,.12+.08*i),line(x0+i*sc,138,x0+i*sc,162,{color:C.dim,w:3})+label(`${i} s`,x0+i*sc,120,{size:22,color:C.t,anchor:'middle'})+(i<4?label('＋ω',x0+i*sc+sc/2,200,{size:26,color:CW,anchor:'middle'}):''));
  s+=fade(seg(p,.4,.55),label('T 秒で 角度は ωT 進む',600,290,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),tex(`${W}T=2\\pi`,600,400,{size:64})+label('一周',780,410,{size:28,color:C.hi}));
  return s;
 },
 [K+'T']:(p)=>{
  let s=tex(`${W}T=2\\pi`,600,90,{size:52});
  s+=fade(seg(p,.1,.25),label('両辺を ω で 割る',600,170,{size:28,color:C.hi,anchor:'middle'}));
  const f=`T=\\dfrac{2\\pi}{${W}}`;
  s+=fade(seg(p,.25,.4),tex(f,600,320,{size:72})+highlight(600-texWidth(f,72)/2-30,205,texWidth(f,72)+60,220,seg(p,.4,.55)));
  s+=fade(seg(p,.6,.75),label('一周の角度 ÷ 1秒に進む角度',600,475,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pi']:(p)=>{
  const cx=260,cy=270,R=160,tt=2*seg(p,.35,.9),u=Math.PI*tt;
  let s=ring(cx,cy,R,{color:C.dim,w:3})+line(cx,cy,cx+R+30,cy,{color:C.faint,w:2});
  if(u>.01)s+=draw(Array.from({length:121},(_,i)=>P(cx,cy,R,u*i/120)),1,{color:CU,w:6});
  const [px,py]=P(cx,cy,R,u);s+=line(cx,cy,px,py,{color:C.ink,w:3})+dot(px,py,11,C.hi);
  s+=label(`t ＝ ${tt.toFixed(1)} s`,cx,cy+R+50,{size:28,color:C.t,anchor:'middle'});
  s+=tex(`${W}=\\pi\\ \\mathrm{rad/s}`,850,90,{size:44});
  s+=fade(seg(p,.1,.3),tex(`T=\\dfrac{2\\pi}{\\pi}=2\\,\\mathrm{s}`,850,220,{size:52}));
  s+=fade(seg(p,.55,.7),label('1秒で 半周',850,350,{size:30,color:CU,anchor:'middle'}))+fade(seg(p,.85,.95),label('2秒で 一周',850,410,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'freq']:(p)=>{
  let s=card(90,90,480,300,label('ω ＝ π rad/s',330,160,{size:34,color:CW,anchor:'middle',weight:700})+label('1秒に 進む 角度',330,225,{size:28,color:C.ink,anchor:'middle'})+label('（π回 ではない）',330,290,{size:26,color:C.a,anchor:'middle'}),1,CW);
  s+=card(630,90,480,300,label('1秒あたりの 往復の回数',870,160,{size:30,color:C.t,anchor:'middle',weight:700})+tex('\\dfrac{1}{T}=\\dfrac{1}{2\\,\\mathrm{s}}',870,250,{size:44})+label('＝ 0.5 回/s',870,340,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.4,.55),C.t);
  return s;
 },
 [K+'prev']:(p)=>{
  let s=rig(.1*Math.cos(2*3*Math.PI*p),{y:470,bh:70});
  s+=card(200,40,800,200,label('m ＝ 1 kg，　k ＝ 4 N/m',600,100,{size:32,color:C.ink,anchor:'middle'})+tex(`${W}=\\sqrt{\\dfrac{4}{1}}=2\\ \\mathrm{rad/s}`,600,180,{size:42}),1);
  s+=fade(seg(p,.5,.65),label('T ＝ ？',1080,160,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'Tpi']:(p)=>{
  let s=tex(`T=\\dfrac{2\\pi}{2}`,450,200,{size:64});
  s+=fade(seg(p,.2,.4),tex('=\\pi\\ \\mathrm{s}',680,200,{size:64}));
  s+=fade(seg(p,.5,.7),label('≈ 3.14 s',600,380,{size:48,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cos']:(p)=>{
  const A=axes({x:100,y:400,w:680,h:230,xmin:0,xmax:7,ymin:-.13,ymax:.13,xlabel:'t [s]',ylabel:'x [m]',xticks:[1,2,3,4,5,6],yticks:[.1,-.1],xcolor:C.t,ycolor:C.x});
  let s=A.svg+A.plot(t=>.1*Math.cos(2*t),{from:0,to:6.6,p:seg(p,.1,.6),color:C.x,w:4});
  s+=dot(A.X(0),A.Y(.1),10,C.hi)+fade(seg(p,.05,.2),label('0.1 m で そっと 離す',A.X(0)+24,A.Y(.1)-18,{size:24,color:C.hi}));
  s+=card(880,90,300,300,tex('x=0.1\\cos 2t',1030,150,{size:34})+label('＝',1030,215,{size:28,color:C.dim,anchor:'middle'})+tex('0.1\\sin\\!\\left(2t+\\tfrac{\\pi}{2}\\right)',1030,280,{size:32})+label('φ ＝ π/2',1030,355,{size:26,color:CU,anchor:'middle'}),seg(p,.4,.55));
  return s;
 },
 [K+'cosback']:(p)=>{
  const A=axes({x:100,y:400,w:680,h:230,xmin:0,xmax:7,ymin:-.13,ymax:.13,xlabel:'t [s]',ylabel:'x [m]',xticks:[1,2,3,4,5,6],yticks:[.1,-.1],xcolor:C.t,ycolor:C.x});
  let s=A.svg+A.plot(t=>.1*Math.cos(2*t),{from:0,to:6.6,color:C.x,w:4})+dot(A.X(0),A.Y(.1),9,C.hi);
  s+=fade(seg(p,.1,.3),dot(A.X(Math.PI),A.Y(.1),11,C.hi)+line(A.X(Math.PI),A.Y(.1),A.X(Math.PI),A.Y(-.13),{color:C.t,w:2,dash:'6 6'})+label('t ＝ π',A.X(Math.PI),A.Y(-.13)+34,{size:24,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),brace(A.X(0),A.X(Math.PI),A.Y(.13)-10,{dir:-1,text:'T ＝ π s',size:26,color:C.t}));
  s+=card(880,90,300,300,tex('\\cos 2\\pi=1',1030,160,{size:38,auto:false})+label('x ＝ 0.1 m',1030,240,{size:28,color:C.x,anchor:'middle',weight:700})+label('速度 0 で 戻る',1030,310,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },

 // ===== S4 ばねの周期 =====
 [K+'spT']:(p)=>{
  let s=tex(`T=\\dfrac{2\\pi}{${W}}`,200,120,{size:52});
  s+=fade(seg(p,.1,.25),arrow(330,120,400,120,{color:C.dim,w:3,head:12})+tex(`\\dfrac{2\\pi}{\\sqrt{k/m}}`,530,120,{size:52}));
  s+=fade(seg(p,.45,.6),label('分母の k/m を ひっくり返す',600,270,{size:30,color:C.hi,anchor:'middle'}));
  const f='T=2\\pi\\sqrt{\\dfrac{m}{k}}';
  s+=fade(seg(p,.6,.75),tex(f,600,400,{size:64})+highlight(600-texWidth(f,64)/2-30,310,texWidth(f,64)+60,180,seg(p,.75,.9)));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=tex('\\sqrt{\\dfrac{m}{k}}:\\ \\sqrt{\\dfrac{\\mathrm{kg}}{\\mathrm{N/m}}}=\\sqrt{\\dfrac{\\mathrm{kg}}{\\mathrm{kg/s^2}}}=\\sqrt{\\mathrm{s}^2}=\\mathrm{s}',600,200,{size:50,auto:false});
  s+=fade(seg(p,.4,.55),label('N/m ＝ kg/s²',600,340,{size:30,color:C.F,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('周期の単位 ＝ 秒',600,430,{size:36,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 [K+'heavy']:(p)=>{
  const t=2*Math.PI*p*1.0;
  let s=rig(.1*Math.cos(2*t),{y:200,bh:70,mtext:'1 kg',ox:560,x1:820})+rig(.1*Math.cos(t),{y:430,bh:70,mtext:'4 kg',ox:560,x1:820,bcol:C.E,bw:130});
  s+=label('T ＝ π s',1000,170,{size:30,color:C.t,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.4),label('T ＝ 2π s',1000,400,{size:30,color:C.t,anchor:'middle',weight:700})+tex('2\\pi\\sqrt{\\tfrac{4}{4}}',1000,460,{size:32,auto:false}));
  s+=fade(seg(p,.6,.75),label('周期 2倍',1000,300,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  let s=tex('a=\\dfrac{F}{m}',600,110,{size:64});
  s+=card(120,230,440,200,label('1 kg',340,290,{size:30,color:C.x,anchor:'middle',weight:700})+label('同じ力 → 加速度 大',340,350,{size:28,color:C.a,anchor:'middle'}),seg(p,.2,.35));
  s+=card(640,230,440,200,label('4 kg',860,290,{size:30,color:C.E,anchor:'middle',weight:700})+label('同じ力 → 加速度 小',860,350,{size:28,color:C.a,anchor:'middle'})+label('なかなか 速くならない',860,400,{size:26,color:C.dim,anchor:'middle'}),seg(p,.4,.55));
  return s;
 },
 [K+'quiz']:(p)=>card(220,90,760,300,label('確かめ',600,150,{size:26,color:C.dim,anchor:'middle'})
   +label('m ＝ 1 kg のまま，　k ＝ 16 N/m（4倍 硬い）',600,230,{size:32,color:C.ink,anchor:'middle'})
   +label('周期 T は？',600,320,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi),
 [K+'quiz2']:(p)=>{
  let s=tex('\\sqrt{\\dfrac{m}{k}}=\\sqrt{\\dfrac{1}{16}}=\\dfrac{1}{4}',600,120,{size:52,auto:false});
  s+=fade(seg(p,.35,.55),tex('T=2\\pi\\times\\dfrac{1}{4}=\\dfrac{\\pi}{2}\\ \\mathrm{s}\\approx1.57\\,\\mathrm{s}',600,290,{size:52,auto:false}));
  s+=fade(seg(p,.7,.85),label('周期は 半分',600,440,{size:38,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S5 振幅によらない周期 =====
 [K+'noA']:(p)=>{
  let s=tex('T=2\\pi\\sqrt{\\dfrac{m}{k}}',600,170,{size:80});
  s+=card(350,320,500,110,label('振幅 A が 入っていない',600,388,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'predict']:(p)=>{
  let s=rig(.1,{sc:1000,y:200,bh:70,ox:560,mtext:'0.1 m',x1:900,xArr:1})+rig(.2,{sc:1000,y:430,bh:70,ox:560,mtext:'0.2 m',x1:900,xArr:1});
  s+=card(930,150,250,200,label('道のり 2倍',1055,215,{size:28,color:C.ink,anchor:'middle'})+label('時間は？',1055,290,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'two']:(p)=>{
  const t=3*Math.PI*p;
  let s=rig(.1*Math.cos(2*t),{sc:1000,y:200,bh:70,ox:560,mtext:'0.1 m',x1:1150})+rig(.2*Math.cos(2*t),{sc:1000,y:430,bh:70,ox:560,mtext:'0.2 m',x1:1150});
  s+=label('ω ＝ 2 rad/s（どちらも）',1150,40,{size:26,color:CW,anchor:'end'});
  return s;
 },
 [K+'force2']:(p)=>{
  let s=rig(.1,{sc:1000,y:200,bh:70,ox:560,mtext:'0.1 m',x1:1150,fArr:seg(p,.05,.2),fk:.8})+rig(.2,{sc:1000,y:430,bh:70,ox:560,mtext:'0.2 m',x1:1150,fArr:seg(p,.05,.2),fk:.8});
  s+=fade(seg(p,.4,.55),label('力 2倍 → 加速度 2倍',960,120,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'linear']:(p)=>{
  let s=tex(`${XDD}=-${W}^2\\,x`,600,110,{size:56});
  s+=fade(seg(p,.3,.45),label('x を 2x に すると',600,230,{size:30,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),tex(`\\dfrac{d^2(2x)}{dt^2}=-${W}^2\\,(2x)`,600,350,{size:56}));
  s+=fade(seg(p,.7,.85),label('両辺とも 2倍 → これも成り立つ',600,475,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  const A=axes({x:100,y:330,w:1000,h:230,xmin:0,xmax:7,ymin:-.23,ymax:.23,xlabel:'t [s]',ylabel:'x [m]',xticks:[1,2,3,4,5,6],yticks:[.2,.1,-.1,-.2],xcolor:C.t,ycolor:C.x});
  let s=A.svg+A.plot(t=>.1*Math.cos(2*t),{from:0,to:6.8,color:C.x,w:4})+A.plot(t=>.2*Math.cos(2*t),{from:0,to:6.8,p:seg(p,.05,.4),color:C.E,w:4});
  s+=label('0.1 m',A.X(6.8)+10,A.Y(.1*Math.cos(13.6))+8,{size:22,color:C.x})+fade(seg(p,.3,.4),label('0.2 m',A.X(6.8)+10,A.Y(.2*Math.cos(13.6))+8,{size:22,color:C.E}));
  const t1=3.0;s+=fade(seg(p,.45,.6),line(A.X(t1),A.Y(.1*Math.cos(2*t1)),A.X(t1),A.Y(.2*Math.cos(2*t1)),{color:C.hi,w:3})+dot(A.X(t1),A.Y(.1*Math.cos(2*t1)),7,C.x)+dot(A.X(t1),A.Y(.2*Math.cos(2*t1)),7,C.E)+label('どの時刻でも 2倍',A.X(t1)-16,A.Y(.2*Math.cos(2*t1))-14,{size:24,color:C.hi,anchor:'end'}));
  s+=card(150,410,900,90,label('道のり 2倍 × 速さ 2倍 → 時間は 同じ',600,468,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'isochron']:(p)=>{
  const t=3*Math.PI*p;
  let s=rig(.1*Math.cos(2*t),{sc:1000,y:170,bh:60,ox:560,mtext:'0.1',x1:900})+rig(.2*Math.cos(2*t),{sc:1000,y:360,bh:60,ox:560,mtext:'0.2',x1:900,bcol:C.E});
  const c=Math.abs(Math.cos(2*t));s+=fade(clamp(1-c*6),label('同時に 中心',730,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(clamp((c-.9)*10),label('同時に 端',730,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(930,150,250,170,label('等時性',1055,215,{size:36,color:C.hi,anchor:'middle',weight:700})+label('周期は 振幅に よらない',1055,275,{size:22,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'limit']:(p)=>{
  let s=card(120,80,960,150,label('力が ずれに ちょうど 比例（F ＝ −kx）',600,145,{size:32,color:C.F,anchor:'middle',weight:700})+label('→ 周期は 振幅に よらない',600,200,{size:30,color:C.hi,anchor:'middle'}),1,C.F);
  s+=card(120,280,960,150,label('大きく 揺らして 比例が くずれると',600,345,{size:30,color:C.ink,anchor:'middle'})+label('→ 周期も 変わってくる',600,400,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.35,.5),C.a);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=shadow(.5+TAU*seg(p,0,.9),{cx:200,cy:270,R:130,x0:400,arc:1,u0:.5,lab:0});
  s+=fade(seg(p,.1,.25),label('中身が 2π 進むと 元に戻る',800,130,{size:30,color:CU,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),tex(`${W}T=2\\pi`,800,240,{size:52}));
  s+=fade(seg(p,.6,.75),tex(`T=\\dfrac{2\\pi}{${W}}`,800,390,{size:60}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=tex('T=2\\pi\\sqrt{\\dfrac{m}{k}}',600,130,{size:66});
  s+=card(150,280,420,120,label('重いほど ゆっくり',360,352,{size:32,color:C.E,anchor:'middle',weight:700}),seg(p,.3,.45));
  s+=card(630,280,420,120,label('振幅に よらない',840,352,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'tools']:(p)=>{
  const items=[['微分',C.v],['積分',C.t],['ベクトル',C.x],['微分方程式',C.hi]];let s='';
  items.forEach(([t,c],i)=>{const x=180+i*280;s+=fade(seg(p,.05+.1*i,.2+.1*i),rect(x-115,150,230,100,{fill:'#131f38',fo:1,stroke:c,sw:3,rx:14})+label(t,x,212,{size:32,color:c,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.6,.75),label('力学に使う 数学の道具が そろった',600,380,{size:36,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=tex('F=ma',600,130,{size:84});
  s+=card(150,250,900,210,label('次の問い：F ＝ ma が 本当に 決めているのは？',600,310,{size:30,color:C.dim,anchor:'middle'})
   +label('位置？',330,400,{size:40,color:C.x,anchor:'middle',weight:700})+label('速度？',600,400,{size:40,color:C.v,anchor:'middle',weight:700})+label('別のもの？',870,400,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
};
