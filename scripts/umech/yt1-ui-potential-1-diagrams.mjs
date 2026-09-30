// YouTube シリーズ「位置エネルギー・初級 1/1」(ys-ui-potential-1) — 図。Stage 1200×515.
// 色：力 F 緑、高さ・位置・距離 水色、仕事・エネルギー U/K 橙、負の仕事 赤、速さ v 紫、強調（差・固定するもの）黄。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,ground,cart,tex,texWidth} from './anim.mjs';
import {box,card,cross,check} from './yt1-ui-effective-component-1-diagrams.mjs';

const K='ui-potential-1:';
const NEG=C.a,AL=C.hi,PP=C.p;
const cU=s=>`{\\color{${C.E}}{${s}}}`,cN=s=>`{\\color{${NEG}}{${s}}}`,cF=s=>`{\\color{${C.F}}{${s}}}`,cH=s=>`{\\color{${C.x}}{${s}}}`,cA=s=>`{\\color{${AL}}{${s}}}`;

// ---- lift scene: floor at FY, SC px per metre, box centred at BX whose bottom is at height h ----
const FY=470,SC=110,BX=400,BW=96,BH=70;
const Yh=h=>FY-SC*h;
function ruler({x=150,g=1,max=3,color=C.x,units='m',zero=0,values=null,vcolor=C.E,title='',vtitle=''}={}){
 let s=line(x,Yh(0),x,Yh(max)-10,{color,w:3});
 for(let i=0;i<=max;i++){
  s+=line(x-8,Yh(i),x+8,Yh(i),{color,w:3})+label(`${String(i-zero).replace('-','−')} ${units}`,x-14,Yh(i)+8,{size:22,color,anchor:'end'});
  if(values)s+=label(values[i],x+16,Yh(i)+8,{size:22,color:typeof vcolor==='function'?vcolor(i):vcolor,weight:700});
 }
 if(title)s+=label(title,x,Yh(max)-24,{size:22,color,anchor:'middle'});
 return fade(g,s);
}
function liftBox(h,{bx=BX}={}){return box(bx+BW/2,Yh(h),{w:BW,h:BH});}
const bcy=h=>Yh(h)-BH/2; // box centre y
function handArrow(h,{g=1,bx=BX,text='手 20 N'}={}){const x=bx-BW/2-26;return arrow(x,bcy(h)+40,x,bcy(h)-40,{color:C.F,w:7,head:20,g})+fade(g,label(text,x-12,bcy(h)+10,{size:24,color:C.F,anchor:'end',weight:700}));}
function gravArrow(h,{g=1,bx=BX,text='重力 20 N'}={}){const x=bx+BW/2+26;return arrow(x,bcy(h)-40,x,bcy(h)+40,{color:C.F,w:7,head:20,g})+fade(g,label(text,x+12,bcy(h)+10,{size:24,color:C.F,weight:700}));}
function liftBase({g=1}={}){return fade(g,ground(150,620,FY))+ruler({g});}
const R=640; // right panel x

// ---- path grid: A at the floor, SP px per metre ----
const AX=170,AY=450,SP=66;
const P=(u,v)=>[AX+SP*u,AY-SP*v];
function grid({g=1,umax=5,vmax=5}={}){
 let s='';
 for(let u=0;u<=umax;u++)s+=line(P(u,0)[0],P(0,0)[1],P(u,0)[0],P(0,vmax)[1],{color:C.grid,w:1.5});
 for(let v=0;v<=vmax;v++)s+=line(P(0,v)[0],P(0,v)[1],P(umax,v)[0],P(umax,v)[1],{color:C.grid,w:1.5});
 s+=ground(AX-60,P(umax,0)[0]+40,AY);
 return fade(g,s);
}
function AB({g=1}={}){
 const [ax,ay]=P(0,0),[bx,by]=P(4,3);
 return fade(g,dot(ax,ay,10,C.ink)+label('A',ax-18,ay-12,{size:30,color:C.ink,anchor:'end',weight:700})+dot(bx,by,10,C.ink)+label('B',bx+18,by-10,{size:30,color:C.ink,weight:700}));
}
const PATH1=[[0,0],[4,3]],PATH2=[[0,0],[4,0],[4,3]],PATH3=[[0,0],[0,5],[4,5],[4,3]];
const COL1=AL,COL2=PP,COL3=C.v;
const pts=a=>a.map(([u,v])=>P(u,v));
function gravField({x=560,y=110,g=1}={}){ // uniform gravity: identical arrows
 let s='';for(let i=0;i<3;i++)for(let j=0;j<2;j++)s+=arrow(x+i*44,y+j*70,x+i*44,y+j*70+46,{color:C.F,w:4,head:12});
 return fade(g,s+label('重力',x+44,y-16,{size:22,color:C.F,anchor:'middle'}));
}
function rightAngle(x,y,sz=18,color=C.ink){return draw([[x+sz,y],[x+sz,y-sz],[x,y-sz]],1,{color,w:2.5});}

// ---- top view for friction ----
const TX=170,TY=330,TS=100; // A at (TX,TY), 1 m = TS px, "up" in the picture = away from us on the floor
const T=(u,v)=>[TX+TS*u,TY-TS*v];
function topFloor({g=1}={}){
 const [x0,y0]=T(-.6,2.7),[x1,y1]=T(4.6,-1.2);
 return fade(g,rect(x0,y0,x1-x0,y1-y0,{fill:'#2a3550',fo:.35,stroke:C.faint,sw:2,rx:10})+label('上から見た 床',x0+14,y1-14,{size:22,color:C.dim}));
}
function topAB({g=1}={}){
 const [ax,ay]=T(0,0),[bx,by]=T(4,0);
 return fade(g,dot(ax,ay,10,C.ink)+label('A',ax-18,ay+10,{size:30,color:C.ink,anchor:'end',weight:700})+dot(bx,by,10,C.ink)+label('B',bx+18,by+10,{size:30,color:C.ink,weight:700}));
}
function topBox(u,v){const [x,y]=T(u,v);return rect(x-26,y-26,52,52,{fill:'#7a5a3c',fo:.7,stroke:'#c9a27a',sw:3,rx:5});}
function fricAt(u,v,dx,dy,{g=1,len=48,ox=0,oy=0}={}){ // friction opposite to motion (dx,dy) in metres-direction
 let [x,y]=T(u,v);x+=ox;y+=oy;const L=Math.hypot(dx,dy);return arrow(x,y,x-len*dx/L,y+len*dy/L,{color:C.F,w:5,head:14,g});
}
const DET=[[0,0],[0,2],[4,2],[4,0]];

// ---- energy flow (hand → height → motion) ----
function flow(p,{y=250,gs=[1,1,1,1,1]}={}){
 const bx=(x,t1,t2,col,g)=>card(x-150,y-80,300,160,label(t1,x,y-22,{size:26,color:C.ink,anchor:'middle'})+label(t2,x,y+38,{size:36,color:col,anchor:'middle',weight:700}),g,col);
 let s=bx(190,'手の 仕事','60 J',C.E,gs[0]);
 s+=arrow(345,y,445,y,{color:C.E,w:6,head:18,g:gs[1]});
 s+=bx(600,'高さに 蓄える','U ＋60 J',C.E,gs[2]);
 s+=arrow(755,y,855,y,{color:C.E,w:6,head:18,g:gs[3]});
 s+=bx(1010,'落ちると','K 60 J',C.E,gs[4]);
 return s;
}

export const ytUiPotential1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const h=3*seg(p,.05,.6);
  let s=liftBase()+liftBox(h)+handArrow(h,{g:seg(p,0,.1)});
  s+=arrow(BX+90,bcy(h)+30,BX+90,bcy(h)-10,{color:C.v,w:4,head:12,g:seg(p,.05,.15)})+fade(seg(p,.05,.15),label('ゆっくり',BX+104,bcy(h)+18,{size:22,color:C.v}));
  s+=card(R,90,500,130,label('手の 仕事',R+130,170,{size:28,color:C.ink,anchor:'middle'})+label('＋',R+330,172,{size:44,color:C.E,anchor:'middle',weight:700}),seg(p,.3,.42));
  s+=card(R,250,500,130,label('運動エネルギー',R+160,330,{size:28,color:C.ink,anchor:'middle'})+label('増えない',R+390,332,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.62,.75));
  return s;
 },
 [K+'question']:(p)=>{
  let s=liftBase()+liftBox(3);
  s+=fade(seg(p,.1,.3),label('？',BX+120,Yh(3)-10,{size:64,color:AL,weight:700}));
  s+=card(R,150,500,190,label('持ち上げた 仕事は',R+250,225,{size:32,color:C.ink,anchor:'middle'})+label('どこに 蓄えられた？',R+250,295,{size:36,color:AL,anchor:'middle',weight:700}),seg(p,.25,.45),AL);
  return s;
 },
 [K+'lift']:(p)=>{
  const h=1.5*seg(p,.2,.8);
  let s=liftBase()+fade(seg(p,.1,.25),rect(BX-BW/2,Yh(3)-BH,BW,BH,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:6})+label('ここまで',BX+BW/2+14,Yh(3)-BH/2+8,{size:22,color:C.dim}))+liftBox(h);
  s+=fade(seg(p,.1,.25),label('2 kg',BX,Yh(h)-BH/2+9,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=card(R,90,500,300,label('質量',R+40,160,{size:28,color:C.dim})+label('m ＝ 2 kg',R+200,160,{size:30,color:C.ink,weight:700})
   +label('高さ',R+40,235,{size:28,color:C.dim})+label('h ＝ 3 m',R+200,235,{size:30,color:C.x,weight:700})
   +fade(seg(p,.55,.7),label('重力加速度',R+40,310,{size:28,color:C.dim})+label('g ＝ 10 m/s²',R+200,310,{size:30,color:C.ink,weight:700}))
   +label('ゆっくり 持ち上げる',R+250,368,{size:24,color:C.v,anchor:'middle'}),seg(p,0,.15));
  return s;
 },
 [K+'weight']:(p)=>{
  const h=1.5;
  let s=liftBase()+fade(.5,rect(BX-BW/2,Yh(3)-BH,BW,BH,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:6}))+liftBox(h)+label('2 kg',BX,Yh(h)-BH/2+9,{size:24,color:C.ink,anchor:'middle',weight:700});
  s+=gravArrow(h,{g:seg(p,.05,.3),text:'重力 mg'});
  s+=card(R,110,500,220,tex('mg',R+90,190,{size:52,auto:false,anchor:'start'})+fade(seg(p,.45,.65),tex('=2\\times10='+cF('20\\,\\mathrm{N}'),R+100+texWidth('mg',52,false),190,{size:44,auto:false,anchor:'start'}))
   +label('下向き',R+250,290,{size:28,color:C.F,anchor:'middle',weight:700}),seg(p,.2,.35));
  return s;
 },
 [K+'hand']:(p)=>{
  const h=1.5;
  let s=liftBase()+fade(.5,rect(BX-BW/2,Yh(3)-BH,BW,BH,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:6}))+liftBox(h)+label('2 kg',BX,Yh(h)-BH/2+9,{size:24,color:C.ink,anchor:'middle',weight:700});
  s+=gravArrow(h)+handArrow(h,{g:seg(p,.1,.3)});
  s+=card(R,90,500,190,label('上向き 20 N ＋ 下向き 20 N',R+250,160,{size:28,color:C.F,anchor:'middle',weight:700})+label('→ 速さが 変わらない',R+250,225,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,.25,.4));
  s+=card(R,310,500,130,label('動き始め・止める瞬間の',R+250,360,{size:24,color:C.dim,anchor:'middle'})+label('わずかな差は 無視',R+250,410,{size:26,color:C.ink,anchor:'middle'}),seg(p,.62,.75));
  return s;
 },
 [K+'handW']:(p)=>{
  const h=1.5+1.5*seg(p,0,.3);
  let s=liftBase()+liftBox(h)+handArrow(h);
  s+=fade(seg(p,.2,.35),arrow(BX+BW/2+40,Yh(0),BX+BW/2+40,Yh(3),{color:C.x,w:4,head:14})+label('3 m',BX+BW/2+54,Yh(1.5)+8,{size:26,color:C.x,weight:700}));
  s+=card(R,110,520,240,label('手の 仕事',R+260,170,{size:28,color:C.ink,anchor:'middle'})
   +tex(cF('20\\,\\mathrm{N}')+'\\times'+cH('3\\,\\mathrm{m}'),R+260,245,{size:44,auto:false})
   +fade(seg(p,.55,.7),tex('='+cU('60\\,\\mathrm{J}'),R+260,315,{size:48,auto:false})),seg(p,.25,.4),C.E);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=tex('\\mathrm{J}=\\mathrm{N}\\times\\mathrm{m}',600,90,{size:48,auto:false});
  s+=fade(seg(p,.3,.5),tex('\\mathrm{N}=\\mathrm{kg\\,m/s^2}',600,190,{size:48,auto:false}));
  s+=fade(seg(p,.55,.75),tex('\\mathrm{J}=\\mathrm{kg\\,m/s^2}\\times\\mathrm{m}='+cU('\\mathrm{kg\\,m^2/s^2}'),600,290,{size:48,auto:false}));
  s+=fade(seg(p,.8,.95),tex('2\\,\\mathrm{kg}\\times10\\,\\mathrm{m/s^2}\\times3\\,\\mathrm{m}='+cU('60\\,\\mathrm{kg\\,m^2/s^2}')+'='+cU('60\\,\\mathrm{J}'),600,410,{size:40,auto:false}));
  return s;
 },
 [K+'gravW']:(p)=>{
  let s=liftBase()+liftBox(3)+handArrow(3)+gravArrow(3,{g:seg(p,0,.15)});
  s+=arrow(BX+BW/2+130,Yh(0),BX+BW/2+130,Yh(3)+20,{color:C.x,w:4,head:14})+label('動き',BX+BW/2+144,Yh(1.5)+8,{size:24,color:C.x});
  s+=card(R,80,500,330,label('手',R+90,160,{size:30,color:C.F,anchor:'middle',weight:700})+tex(cU('+60\\,\\mathrm{J}'),R+330,152,{size:44,auto:false})
   +fade(seg(p,.1,.3),label('重力',R+90,240,{size:30,color:C.F,anchor:'middle',weight:700})+tex(cN('-60\\,\\mathrm{J}'),R+330,232,{size:44,auto:false}))
   +fade(seg(p,.5,.65),line(R+40,275,R+460,275,{color:C.dim,w:2})+label('合計',R+90,330,{size:30,color:C.ink,anchor:'middle',weight:700})+tex('0',R+330,322,{size:44,auto:false}))
   +fade(seg(p,.7,.85),label('→ 速さは 変わらない',R+250,390,{size:26,color:C.v,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'drop']:(p)=>{
  const u=seg(p,.2,.75),h=3*(1-u*u);
  let s=liftBase()+fade(seg(p,.2,.3)*.4,rect(BX-BW/2,Yh(3)-BH,BW,BH,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:6}))+liftBox(h)+gravArrow(h,{text:'重力 20 N'});
  s+=fade(seg(p,.05,.15),label('手を 放す',BX-BW/2-20,Yh(3)-BH/2+8,{size:24,color:C.ink,anchor:'end'}));
  s+=fade(seg(p,.4,.55),arrow(BX-BW/2-40,Yh(3),BX-BW/2-40,Yh(0),{color:C.x,w:4,head:14})+label('3 m',BX-BW/2-54,Yh(1.2),{size:26,color:C.x,anchor:'end',weight:700}));
  s+=card(R,110,500,200,label('重力の 仕事',R+250,175,{size:28,color:C.ink,anchor:'middle'})+tex('20\\times3='+cU('+60\\,\\mathrm{J}'),R+250,255,{size:46,auto:false}),seg(p,.55,.7),C.E);
  s+=fade(seg(p,.6,.7),label('下向きの力 × 下向きの動き',R+250,350,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'back']:(p)=>{
  let s=flow(p,{gs:[seg(p,.35,.5),seg(p,.4,.55),seg(p,.45,.6),seg(p,.5,.65),seg(p,0,.15)]});
  s+=fade(seg(p,0,.15),label('床に 着く直前',1010,130,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('落ちると 戻ってくる',600,440,{size:32,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'defU']:(p)=>{
  let s=label('位置エネルギー',600,90,{size:40,color:C.E,anchor:'middle',weight:700})+tex(cU('U'),790,80,{size:48,auto:false,anchor:'start'});
  s+=fade(seg(p,.1,.2),label('高さによって 蓄えられる エネルギー',600,150,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(250,200,700,220,tex(cU('\\Delta U')+'=-'+cF('W_{\\mathrm{g}}'),600,280,{size:60,auto:false})
   +tex(cF('W_{\\mathrm{g}}'),470,362,{size:36,auto:false})+label('：重力が した 仕事',500,372,{size:26,color:C.F}),seg(p,.4,.55),AL);
  s+=fade(seg(p,.6,.75),label('（決め方 ＝ 定義）',600,470,{size:26,color:AL,anchor:'middle'}));
  return s;
 },
 [K+'mgh']:(p)=>{
  let s=tex(cF('W_{\\mathrm{g}}')+'='+cN('-60\\,\\mathrm{J}'),600,90,{size:48,auto:false});
  s+=fade(seg(p,.1,.3),tex(cU('\\Delta U')+'=-('+cN('-60\\,\\mathrm{J}')+')='+cU('+60\\,\\mathrm{J}'),600,190,{size:48,auto:false}));
  s+=fade(seg(p,.55,.75),tex(cU('\\Delta U')+'=mg'+cH('h'),600,310,{size:60,auto:false})+highlight(600-texWidth('\\Delta U=mgh',60,false)/2-20,262,texWidth('\\Delta U=mgh',60,false)+40,90,1,C.E));
  s+=fade(seg(p,.7,.85),tex('=2\\times10\\times'+cH('3')+'='+cU('60\\,\\mathrm{J}'),600,420,{size:42,auto:false}));
  return s;
 },
 // ===== S2 0の基準 =====
 [K+'which']:(p)=>{
  let s=liftBase()+liftBox(3);
  s+=fade(seg(p,.05,.2),label('U ＝ ？',BX+BW/2+24,Yh(3)-BH/2+10,{size:32,color:C.E,weight:700}));
  s+=card(R,150,500,190,label('どこを 0 と するか',R+250,225,{size:32,color:C.ink,anchor:'middle'})+label('決めないと 決まらない',R+250,290,{size:30,color:AL,anchor:'middle',weight:700}),seg(p,.45,.6),AL);
  return s;
 },
 [K+'floor']:(p)=>{
  let s=fade(1,ground(150,620,FY))+ruler({values:['0 J','20 J','40 J','60 J'],title:'床が 0',g:1})+liftBox(3);
  s+=fade(seg(p,.05,.2),label('U ＝ 0',BX+BW/2+130,Yh(0)-10,{size:26,color:C.E,weight:700}));
  s+=fade(seg(p,.4,.6),label('U ＝ 60 J',BX+BW/2+24,Yh(3)-BH/2+10,{size:32,color:C.E,weight:700}));
  s+=card(R+60,150,440,160,tex(cU('U')+'=mg'+cH('h'),R+280,215,{size:48,auto:false})+label('h は 床からの 高さ',R+280,280,{size:24,color:C.x,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },
 [K+'desk']:(p)=>{
  const DX=470;
  let s=ground(150,690,FY)+ruler({values:['0 J','20 J','40 J','60 J'],title:'床が 0'})+liftBox(3);
  s+=fade(seg(p,.05,.25),rect(BX+BW/2+40,Yh(1)-12,200,12,{fill:'#7a5a3c',fo:.8,stroke:'#c9a27a',sw:2,rx:3})+line(BX+BW/2+60,Yh(1),BX+BW/2+60,FY,{color:'#c9a27a',w:6})+line(BX+BW/2+220,Yh(1),BX+BW/2+220,FY,{color:'#c9a27a',w:6})+label('机',BX+BW/2+140,Yh(.5)+8,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),line(BX-BW/2,Yh(1),DX+230,Yh(1),{color:AL,w:2,dash:'8 6'}));
  s+=ruler({x:DX+300,g:seg(p,.25,.45),zero:1,values:['','0 J','20 J','40 J'],title:'机が 0',color:C.x});
  s+=fade(seg(p,.5,.65),arrow(BX-BW/2-24,Yh(1),BX-BW/2-24,Yh(3),{color:C.x,w:4,head:12})+label('2 m',BX-BW/2-36,Yh(2)+8,{size:26,color:C.x,anchor:'end',weight:700}));
  s+=card(880,110,300,150,tex(cU('U')+'=2\\times10\\times'+cH('2'),1030,165,{size:38,auto:false})+fade(seg(p,.75,.9),tex('='+cU('40\\,\\mathrm{J}'),1030,230,{size:44,auto:false})),seg(p,.6,.72));
  return s;
 },
 [K+'negative']:(p)=>{
  const DX=470;
  let s=ground(150,690,FY)+ruler({values:['0 J','20 J','40 J','60 J'],title:'床が 0'})+liftBox(3);
  s+=rect(BX+BW/2+40,Yh(1)-12,200,12,{fill:'#7a5a3c',fo:.8,stroke:'#c9a27a',sw:2,rx:3})+line(BX+BW/2+60,Yh(1),BX+BW/2+60,FY,{color:'#c9a27a',w:6})+line(BX+BW/2+220,Yh(1),BX+BW/2+220,FY,{color:'#c9a27a',w:6})+label('机',BX+BW/2+140,Yh(.5)+8,{size:24,color:C.ink,anchor:'middle'});
  s+=ruler({x:DX+300,zero:1,values:['−20 J','0 J','20 J','40 J'],vcolor:i=>i===0?NEG:C.E,title:'机が 0',color:C.x});
  s+=fade(seg(p,.05,.2),ring(DX+300,Yh(0),16,{color:NEG,w:3}));
  s+=card(R+220,150,320,210,label('マイナス ＝',R+380,210,{size:28,color:NEG,anchor:'middle',weight:700})+label('基準より 低い所',R+380,265,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.7,.85),label('おかしくない',R+380,325,{size:28,color:C.F,anchor:'middle',weight:700})),seg(p,.4,.55),NEG);
  return s;
 },
 [K+'diff']:(p)=>{
  // two rulers side by side; the same difference highlighted in yellow
  const x1=260,x2=720;
  let s=fade(seg(p,.05,.25),line(x1-120,Yh(0),x2+180,Yh(0),{color:C.faint,w:2,dash:'6 6'})+line(x1-120,Yh(3),x2+180,Yh(3),{color:C.faint,w:2,dash:'6 6'})+label('床',x1-130,Yh(0)+8,{size:24,color:C.dim,anchor:'end'})+label('3 m',x1-130,Yh(3)+8,{size:24,color:C.dim,anchor:'end'}));
  s+=ruler({x:x1,values:['0 J','20 J','40 J','60 J'],title:'床が 0'})+ruler({x:x2,zero:1,values:['−20 J','0 J','20 J','40 J'],vcolor:i=>i===0?NEG:C.E,title:'机が 0'});
  const bar=(x,g)=>fade(g,rect(x+110,Yh(3),26,SC*3,{fill:AL,fo:.35,stroke:AL,sw:2,rx:4}));
  s+=bar(x1,seg(p,.25,.4))+bar(x2,seg(p,.5,.65));
  s+=fade(seg(p,.25,.4),tex(cU('60')+'-'+cU('0')+'='+cA('60'),x1+250,Yh(1.5)+10,{size:36,auto:false}));
  s+=fade(seg(p,.5,.65),tex(cU('40')+'-('+cN('-20')+')='+cA('60'),x2+280,Yh(1.5)+10,{size:36,auto:false}));
  s+=fade(seg(p,.75,.9),label('値は 変わる ・ 差は 同じ 60 J',600,40,{size:30,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'free']:(p)=>{
  let s=card(90,90,480,300,label('速さを 決めるのは',330,160,{size:28,color:C.ink,anchor:'middle'})+label('差 60 J',330,240,{size:44,color:AL,anchor:'middle',weight:700})+label('（落ちて得る K）',330,310,{size:26,color:C.E,anchor:'middle'}),seg(p,0,.15),AL);
  s+=card(630,90,480,300,label('0 の 基準',870,160,{size:28,color:C.ink,anchor:'middle'})+label('自由に 選べる',870,240,{size:40,color:C.x,anchor:'middle',weight:700})+label('（計算しやすい 所に 決める 約束）',870,310,{size:24,color:C.dim,anchor:'middle'}),seg(p,.45,.6),C.x);
  s+=fade(seg(p,.65,.8),tex(cU('U')+'=mg('+cH('h')+'-'+cH('h_0')+')',600,450,{size:40,auto:false})+label('h₀ ： 0 と 決めた 高さ',880,462,{size:22,color:C.x}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(140,60,920,150,label('机を 基準に して、床から 3 m まで 持ち上げる',600,120,{size:30,color:C.ink,anchor:'middle'})+label('U の 増加は？',600,180,{size:32,color:AL,anchor:'middle',weight:700}),seg(p,0,.15),AL);
  const ch=['40 J','60 J','20 J','−60 J'];
  ch.forEach((c,i)=>{s+=card(140+i*235,270,210,110,label(c,245+i*235,340,{size:36,color:C.E,anchor:'middle',weight:700}),seg(p,.35+i*.08,.45+i*.08));});
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=card(140,60,920,150,label('机を 基準に して、床から 3 m まで 持ち上げる',600,120,{size:30,color:C.ink,anchor:'middle'})+label('U の 増加は？',600,180,{size:32,color:AL,anchor:'middle',weight:700}),1,AL);
  const ch=['40 J','60 J','20 J','−60 J'];
  ch.forEach((c,i)=>{const ok=i===1;s+=fade(ok?1:mix(1,.3,seg(p,.05,.2)),card(140+i*235,270,210,110,label(c,245+i*235,340,{size:36,color:C.E,anchor:'middle',weight:700}),1,ok?AL:C.faint));});
  s+=fade(seg(p,.05,.2),check(400,330,16,C.F));
  s+=fade(seg(p,.35,.55),tex(cU('40')+'-('+cN('-20')+')='+cA('60\\,\\mathrm{J}')+'=mg'+cH('h'),600,470,{size:38,auto:false}));
  return s;
 },
 // ===== S3 道によらない =====
 [K+'AB']:(p)=>{
  const [ax,ay]=P(0,0),[bx,by]=P(4,3);
  let s=grid()+AB({g:seg(p,.05,.25)});
  s+=fade(seg(p,.3,.45),line(ax,ay+30,bx,ay+30,{color:C.x,w:3})+label('右へ 4 m',(ax+bx)/2,ay+60,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),line(bx+30,ay,bx+30,by,{color:C.x,w:3})+label('上へ 3 m',bx+44,(ay+by)/2+8,{size:24,color:C.x,weight:700}));
  s+=gravField({x:620,y:130,g:seg(p,.6,.75)})+fade(seg(p,.6,.75),label('下向き 20 N',664,300,{size:24,color:C.F,anchor:'middle',weight:700}));
  s+=card(820,150,340,150,label('A → B',990,205,{size:30,color:C.ink,anchor:'middle',weight:700})+label('重力の 仕事は？',990,265,{size:28,color:AL,anchor:'middle'}),seg(p,.75,.9),AL);
  return s;
 },
 [K+'paths']:(p)=>{
  let s=grid()+AB();
  const lab=(t,x,y,c,g)=>fade(g,label(t,x,y,{size:26,color:c,weight:700}));
  s+=draw(pts(PATH1),seg(p,.05,.2),{color:COL1,w:5})+lab('① 坂',P(2,1.5)[0]+10,P(2,1.5)[1]+30,COL1,seg(p,.1,.2));
  s+=draw(pts(PATH2),seg(p,.22,.38),{color:COL2,w:5})+lab('② 右 → 上',P(1.4,0)[0],P(2.2,0)[1]-16,COL2,seg(p,.3,.38));
  s+=draw(pts(PATH3),seg(p,.4,.6),{color:COL3,w:5})+lab('③ 5 m まで 上がって 下りる',P(0,5)[0]+20,P(0,5)[1]-16,COL3,seg(p,.5,.6));
  s+=card(760,190,400,150,label('重力の 仕事は',960,250,{size:28,color:C.ink,anchor:'middle'})+label('道で 変わる？',960,305,{size:32,color:AL,anchor:'middle',weight:700}),seg(p,.7,.85),AL);
  return s;
 },
 [K+'pathR']:(p)=>{
  let s=grid()+AB()+draw(pts(PATH2),1,{color:COL2,w:3,opacity:.35});
  const u=2+2*seg(p,.05,.4),[x,y]=P(u,0);
  s+=draw(pts([[0,0],[u,0]]),1,{color:COL2,w:6});
  s+=rect(x-22,y-40,44,40,{fill:'#7a5a3c',fo:.7,stroke:'#c9a27a',sw:2,rx:4});
  s+=arrow(x,y-20,x,y+50,{color:C.F,w:6,head:16})+label('重力',x+14,y+44,{size:22,color:C.F,weight:700});
  s+=arrow(x+26,y-20,x+90,y-20,{color:C.x,w:4,head:12,g:seg(p,.1,.25)})+fade(seg(p,.1,.25),label('動き',x+96,y-12,{size:22,color:C.x}));
  s+=fade(seg(p,.35,.5),rightAngle(x,y-20,16,AL));
  s+=card(760,150,400,210,label('横に 動く 間',960,210,{size:28,color:C.ink,anchor:'middle'})+label('重力 と 動きが 直角',960,265,{size:28,color:AL,anchor:'middle',weight:700})+fade(seg(p,.7,.85),label('→ 仕事 0',960,325,{size:34,color:C.E,anchor:'middle',weight:700})),seg(p,.3,.45),AL);
  return s;
 },
 [K+'pathR2']:(p)=>{
  let s=grid()+AB();
  const v=3*seg(p,.05,.35);
  s+=draw(pts([[0,0],[4,0]]),1,{color:COL2,w:6})+label('0',P(2,0)[0],P(2,0)[1]-14,{size:28,color:C.E,anchor:'middle',weight:700});
  s+=draw(pts([[4,0],[4,v]]),1,{color:COL2,w:6});
  s+=fade(seg(p,.3,.45),label('−60 J',P(4,1.5)[0]+16,P(4,1.5)[1]+10,{size:30,color:NEG,weight:700}));
  s+=card(760,150,400,210,tex('20\\times3',960,215,{size:40,auto:false})+label('上向きに 動く／重力は 下向き',960,270,{size:22,color:C.dim,anchor:'middle'})+fade(seg(p,.55,.7),tex('0+('+cN('-60')+')='+cN('-60\\,\\mathrm{J}'),960,330,{size:40,auto:false})),seg(p,.1,.25));
  return s;
 },
 [K+'pathU']:(p)=>{
  let s=grid()+AB()+draw(pts(PATH3),1,{color:COL3,w:3,opacity:.35});
  s+=draw(pts([[0,0],[0,5]]),seg(p,.02,.2),{color:COL3,w:6})+fade(seg(p,.15,.25),label('上り 5 m',P(0,2.5)[0]-14,P(0,2.5)[1]-20,{size:24,color:C.x,anchor:'end'})+label('−100 J',P(0,2.5)[0]-14,P(0,2.5)[1]+14,{size:28,color:NEG,anchor:'end',weight:700}));
  s+=draw(pts([[0,5],[4,5]]),seg(p,.3,.45),{color:COL3,w:6})+fade(seg(p,.4,.5),label('横 0',P(2,5)[0],P(2,5)[1]-14,{size:28,color:C.E,anchor:'middle',weight:700}));
  s+=draw(pts([[4,5],[4,3]]),seg(p,.5,.62),{color:COL3,w:6})+fade(seg(p,.58,.68),label('下り 2 m',P(4,4)[0]+16,P(4,4)[1]-6,{size:24,color:C.x})+label('＋40 J',P(4,4)[0]+16,P(4,4)[1]+26,{size:28,color:C.E,weight:700}));
  s+=card(760,300,400,130,tex(cN('-100')+'+0+'+cU('40')+'='+cN('-60\\,\\mathrm{J}'),960,370,{size:38,auto:false}),seg(p,.75,.88));
  return s;
 },
 [K+'stairs']:(p)=>{
  let s=grid()+AB()+draw(pts(PATH1),1,{color:COL1,w:3,opacity:.5});
  const n=p<.45?4:8,g=p<.45?seg(p,.05,.2):seg(p,.45,.55);
  let st='';
  for(let i=0;i<n;i++){
   const u0=4*i/n,u1=4*(i+1)/n,v0=3*i/n,v1=3*(i+1)/n;
   st+=line(...P(u0,v0),...P(u1,v0),{color:C.dim,w:4})+line(...P(u1,v0),...P(u1,v1),{color:C.x,w:6});
  }
  s+=fade(g,st);
  s+=fade(seg(p,.2,.35),label('横の段：仕事 0',720,120,{size:26,color:C.dim,weight:700}));
  // vertical steps collected into one 3 m column on the right
  const cx=760,g2=seg(p,.65,.85);
  s+=fade(g2,line(cx,AY,cx,AY-SP*3,{color:C.x,w:8})+label('縦の段を つなぐ ＝ 3 m',cx+24,AY-SP*1.5+8,{size:26,color:C.x,weight:700}));
  s+=fade(seg(p,.25,.4),label('縦の段：重力に 逆らう',720,170,{size:26,color:C.x,weight:700}));
  return s;
 },
 [K+'stairs2']:(p)=>{
  let s=grid()+AB()+draw(pts(PATH1),1,{color:COL1,w:5});
  let st='';for(let i=0;i<8;i++){const u0=i/2,u1=(i+1)/2,v0=3*i/8,v1=3*(i+1)/8;st+=line(...P(u0,v0),...P(u1,v0),{color:C.dim,w:3})+line(...P(u1,v0),...P(u1,v1),{color:C.x,w:4});}
  s+=fade(.6,st);
  s+=card(720,110,440,130,tex('0+(-20)\\times3='+cN('-60\\,\\mathrm{J}'),940,178,{size:38,auto:false}),seg(p,0,.15));
  s+=card(720,280,440,150,label('ベクトルの回',940,330,{size:24,color:C.dim,anchor:'middle'})+label('道に 沿って 区間ごとに 足す',940,385,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6));
  return s;
 },
 [K+'same']:(p)=>{
  let s=grid()+AB();
  s+=draw(pts(PATH1),1,{color:COL1,w:5})+draw(pts(PATH2),1,{color:COL2,w:5})+draw(pts(PATH3),1,{color:COL3,w:5});
  s+=card(700,70,460,130,label('①②③ どれも',930,120,{size:26,color:C.ink,anchor:'middle'})+label('−60 J ＝ 高さの差 だけ',930,175,{size:30,color:AL,anchor:'middle',weight:700}),seg(p,0,.15),AL);
  s+=card(700,240,460,210,gravField({x:760,y:300})+label('地面近く：',1020,310,{size:24,color:C.dim,anchor:'middle'})+label('大きさ・向きが',1020,360,{size:24,color:C.ink,anchor:'middle'})+label('どこでも 同じ',1020,405,{size:24,color:C.ink,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 // ===== S4 摩擦は違う =====
 [K+'fric']:(p)=>{
  const u=4*seg(p,.35,.85);
  let s=topFloor();
  s+=fade(seg(p,.05,.2),line(...T(0,0),...T(4,0),{color:COL1,w:3,dash:'8 6'}));
  s+=topBox(u,0)+topAB({g:seg(p,.05,.2)})+fricAt(u,0,1,0,{g:seg(p,.2,.3)})+fade(seg(p,.2,.3),label('摩擦 1 N',T(u,0)[0]-40,T(u,0)[1]+50,{size:22,color:C.F,anchor:'middle',weight:700}));
  s+=card(820,90,340,170,label('摩擦 1 N',990,150,{size:28,color:C.F,anchor:'middle',weight:700})+label('いつも 動きと 逆',990,210,{size:26,color:C.ink,anchor:'middle'}),seg(p,.15,.3));
  return s;
 },
 [K+'fric2']:(p)=>{
  let s=topFloor()+topAB();
  s+=draw(pts2([[0,0],[4,0]]),seg(p,.02,.2),{color:COL1,w:5})+fade(seg(p,.15,.25),label('4 m',T(2,0)[0],T(2,0)[1]+36,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=draw(pts2(DET),seg(p,.45,.7),{color:COL3,w:5})+fade(seg(p,.65,.75),label('2 m',T(0,1)[0]-14,T(0,1)[1]+8,{size:24,color:C.x,anchor:'end'})+label('4 m',T(2,2)[0],T(2,2)[1]-14,{size:24,color:C.x,anchor:'middle'})+label('2 m',T(4,1)[0]+14,T(4,1)[1]+8,{size:24,color:C.x}));
  s+=card(820,110,340,110,label('まっすぐ 4 m',990,155,{size:24,color:C.ink,anchor:'middle'})+label('−4 J',990,200,{size:32,color:NEG,anchor:'middle',weight:700}),seg(p,.2,.32),COL1);
  s+=card(820,260,340,110,label('回り道 8 m',990,305,{size:24,color:C.ink,anchor:'middle'})+label('−8 J',990,350,{size:32,color:NEG,anchor:'middle',weight:700}),seg(p,.72,.85),COL3);
  return s;
 },
 [K+'fric3']:(p)=>{
  let s=topFloor()+topAB()+draw(pts2(DET),1,{color:COL3,w:4});
  const legs=[[0,.5,0,1],[0,1.5,0,1],[1,2,1,0],[3,2,1,0],[4,1.5,0,-1],[4,.5,0,-1]];
  legs.forEach(([u,v,dx,dy],i)=>{const g=seg(p,.05+i*.08,.15+i*.08);const [x,y]=T(u,v);const ox=dx?0:(u<2?-22:22),oy=dx?-22:0;s+=fade(g,arrow(x,y,x+34*dx,y-34*dy,{color:C.x,w:3,head:10}))+fricAt(u,v,dx,dy,{g,len:40,ox,oy})+fade(g,label('−',x+(dx?0:(u<2?-50:50)),y+(dx?-44:10),{size:30,color:NEG,anchor:'middle',weight:700}));});
  s+=card(820,120,340,230,label('どの区間も マイナス',990,180,{size:26,color:NEG,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('打ち消す 区間が',990,245,{size:26,color:C.ink,anchor:'middle'})+label('ない',990,295,{size:30,color:C.ink,anchor:'middle',weight:700})),seg(p,.4,.55),NEG);
  return s;
 },
 [K+'loop']:(p)=>{
  // left: gravity up and down; right: friction there and back (top view)
  let s=card(60,60,520,400,'',1)+card(620,60,520,400,'',1);
  s+=label('重力（上って 下りる）',320,105,{size:26,color:C.F,anchor:'middle',weight:700});
  const gx=220,y0=400,y1=190;
  s+=ground(110,530,y0);
  s+=arrow(gx,y0-10,gx,y1,{color:C.x,w:5,head:16,g:seg(p,.05,.2)})+fade(seg(p,.1,.2),label('上り',gx-14,(y0+y1)/2-10,{size:24,color:C.x,anchor:'end'})+label('−60 J',gx-14,(y0+y1)/2+24,{size:28,color:NEG,anchor:'end',weight:700}));
  s+=arrow(gx+80,y1,gx+80,y0-10,{color:C.x,w:5,head:16,g:seg(p,.2,.35)})+fade(seg(p,.25,.35),label('下り',gx+96,(y0+y1)/2-10,{size:24,color:C.x})+label('＋60 J',gx+96,(y0+y1)/2+24,{size:28,color:C.E,weight:700}));
  s+=fade(seg(p,.35,.5),label('1周 ＝ 0',320,440,{size:32,color:C.E,anchor:'middle',weight:700}));
  s+=label('摩擦（行って 帰る）',880,105,{size:26,color:C.F,anchor:'middle',weight:700});
  const fy1=230,fy2=320,fx0=700,fx1=1060;
  s+=fade(seg(p,.55,.65),dot(fx0,(fy1+fy2)/2,8,C.ink)+label('A',fx0-14,(fy1+fy2)/2+10,{size:26,color:C.ink,anchor:'end'})+dot(fx1,(fy1+fy2)/2,8,C.ink)+label('B',fx1+14,(fy1+fy2)/2+10,{size:26,color:C.ink}));
  s+=arrow(fx0+10,fy1,fx1-10,fy1,{color:C.x,w:5,head:16,g:seg(p,.55,.65)})+fade(seg(p,.6,.7),label('行き −4 J',880,fy1-20,{size:26,color:NEG,anchor:'middle',weight:700}));
  s+=arrow(fx1-10,fy2,fx0+10,fy2,{color:C.x,w:5,head:16,g:seg(p,.68,.78)})+fade(seg(p,.72,.8),label('帰り −4 J',880,fy2+44,{size:26,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.82,.92),label('1周 ＝ −8 J',880,440,{size:32,color:NEG,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 位置の貯金 U =====
 [K+'assign']:(p)=>{
  let s=grid();
  const [ox,oy]=P(0,0);
  s+=dot(ox,oy,11,AL)+label('O',ox-18,oy-12,{size:30,color:AL,anchor:'end',weight:700})+label('U ＝ 0',ox-18,oy-50,{size:24,color:AL,anchor:'end',weight:700});
  const ptsU=[[2,0,'0 J'],[1,1,'20 J'],[3,2,'40 J'],[4,3,'60 J'],[1,4,'80 J'],[4.6,1,'20 J']];
  ptsU.forEach(([u,v,t],i)=>{const g=seg(p,.35+i*.08,.45+i*.08),[x,y]=P(u,v);s+=fade(g,dot(x,y,8,C.E)+label(t,x+12,y-10,{size:24,color:C.E,weight:700}));});
  s+=card(760,110,400,220,label('基準の 点 O を 決める',960,170,{size:28,color:AL,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('各点に 一つの 数',960,240,{size:30,color:C.E,anchor:'middle',weight:700})+label('（床からの 高さで 決まる）',960,290,{size:22,color:C.dim,anchor:'middle'})),seg(p,.15,.3),AL);
  return s;
 },
 [K+'assign2']:(p)=>{
  let s=grid();
  const [ox,oy]=P(0,0),[px,py]=P(4,3);
  s+=dot(ox,oy,11,AL)+label('O',ox-18,oy-12,{size:30,color:AL,anchor:'end',weight:700})+dot(px,py,10,C.E)+label('P',px+18,py-10,{size:30,color:C.E,weight:700});
  s+=draw(pts(PATH1),seg(p,.25,.45),{color:COL1,w:5})+draw(pts(PATH2),seg(p,.35,.55),{color:COL2,w:5})+draw(pts(PATH3),seg(p,.45,.65),{color:COL3,w:5});
  s+=card(700,90,460,150,tex(cU('U_{\\mathrm P}')+'=-'+cF('W_{\\mathrm{g}}(\\mathrm{O}\\to\\mathrm{P})'),930,160,{size:40,auto:false})+label('O を 0 と する',930,215,{size:22,color:C.dim,anchor:'middle'}),seg(p,0,.15),C.E);
  s+=card(700,280,460,190,label('どの道でも',930,335,{size:26,color:C.ink,anchor:'middle'})+label('P の U ＝ ＋60 J',930,395,{size:34,color:C.E,anchor:'middle',weight:700})+fade(seg(p,.8,.92),label('場所だけで 決まる 貯金',930,440,{size:24,color:AL,anchor:'middle',weight:700})),seg(p,.6,.72));
  return s;
 },
 [K+'nofric']:(p)=>{
  let s=topFloor()+topAB();
  s+=draw(pts2([[0,0],[4,0]]),1,{color:COL1,w:5})+draw(pts2(DET),1,{color:COL3,w:5});
  s+=label('−4 J',T(2,0)[0],T(2,0)[1]+36,{size:26,color:NEG,anchor:'middle',weight:700})+label('−8 J',T(2,2)[0],T(2,2)[1]-14,{size:26,color:NEG,anchor:'middle',weight:700});
  s+=card(820,110,340,230,label('B の U は？',990,170,{size:30,color:C.E,anchor:'middle',weight:700})+label('4 J？ 8 J？',990,235,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.35,.5),label('一つに 決まらない',990,300,{size:26,color:NEG,anchor:'middle',weight:700})+cross(1130,225,16)),seg(p,.1,.25),NEG);
  return s;
 },
 [K+'conservative']:(p)=>{
  let s=card(150,60,900,150,label('保存力',600,125,{size:44,color:AL,anchor:'middle',weight:700})+label('仕事が 道によらない 力',600,185,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.2),AL);
  s+=card(150,260,420,170,label('重力',360,330,{size:36,color:C.F,anchor:'middle',weight:700})+label('U を 持てる',360,395,{size:28,color:C.E,anchor:'middle'})+check(500,322,18,C.F),seg(p,.45,.6));
  s+=card(630,260,420,170,label('摩擦',840,330,{size:36,color:C.F,anchor:'middle',weight:700})+label('U を 作れない',840,395,{size:28,color:NEG,anchor:'middle'})+cross(980,322,16),seg(p,.6,.75));
  return s;
 },
 [K+'logic']:(p)=>{
  const row=(y,tag,col,body,g)=>card(80,y,1040,110,label(tag,190,y+66,{size:28,color:col,anchor:'middle',weight:700})+body,g,col);
  let s=row(40,'決めた',AL,tex(cU('\\Delta U')+'=-'+cF('W_{\\mathrm{g}}'),520,95,{size:40,auto:false})+label('0 の 基準',880,106,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=row(190,'仮定',C.dim,label('一様な 重力（地面近く、g ＝ 10 m/s²）',680,256,{size:28,color:C.ink,anchor:'middle'}),seg(p,.3,.45));
  s+=row(340,'導いた',C.E,label('道によらない',470,406,{size:28,color:C.ink,anchor:'middle'})+tex(cU('\\Delta U')+'=mg'+cH('h'),830,395,{size:40,auto:false}),seg(p,.5,.65));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=flow(p,{y:200,gs:[seg(p,0,.1),seg(p,.05,.15),seg(p,.1,.2),seg(p,.3,.4),seg(p,.35,.45)]});
  s+=card(250,340,700,120,label('0 の 基準は 自由',450,410,{size:28,color:C.x,anchor:'middle',weight:700})+label('意味が あるのは 差',760,410,{size:28,color:AL,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'carts']:(p)=>{
  const y=360;
  let s=ground(60,1140,y+2);
  const u=seg(p,.05,.9),x1=180+240*u,x2=180+240*u;
  s+=cart(x1,y-190,{w:110,h:50,color:C.x,text:'1 kg'})+line(60,y-190+2,1140,y-190+2,{color:C.dim,w:2});
  s+=cart(x2+10,y,{w:190,h:90,color:C.x,text:'5 kg'});
  s+=arrow(x1+70,y-240,x1+170,y-240,{color:C.v,w:5,head:16})+label('同じ 速さ',x1+180,y-232,{size:24,color:C.v});
  s+=arrow(x2+120,y-60,x2+220,y-60,{color:C.v,w:5,head:16})+label('同じ 速さ',x2+230,y-52,{size:24,color:C.v});
  s+=fade(seg(p,.5,.65),label('止めにくい',x2+10,y+60,{size:30,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=label('止めにくさ ＝ ？',600,200,{size:52,color:AL,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.5),label('次は 運動量・初級',600,300,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
};
function pts2(a){return a.map(([u,v])=>T(u,v));}
