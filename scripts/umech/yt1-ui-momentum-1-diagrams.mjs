// YouTube シリーズ「運動量・初級 1/1」(ys-ui-momentum-1) — 図。Stage 1200×515.
// 色：運動量 p 桃、力 F 緑、速度 v 紫、時間 t 金、運動エネルギー K 橙、強調 黄、外力・誤り 赤。右向きを正。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,ground,wall,cart,axes,spring,tex,texWidth} from './anim.mjs';
import {card,cross,check} from './yt1-ui-effective-component-1-diagrams.mjs';

const K='ui-momentum-1:';
const cP=s=>`{\\color{${C.p}}{${s}}}`,cK=s=>`{\\color{${C.E}}{${s}}}`,cA=s=>`{\\color{${C.hi}}{${s}}}`,cI=s=>`{\\color{${C.ink}}{${s}}}`;
const U=s=>`\\,\\mathrm{${s}}`;
const PMS=U('kg\\cdot m/s'),NS=U('N\\cdot s');
const EXT=C.a;

// ---- carts ---------------------------------------------------------------------------------
const CW=m=>m>=3?190:m>=2?150:110, CH=m=>m>=2?64:52;
function cartM(x,fy,m,{g=1,name=''}={}){return fade(g,cart(x,fy,{w:CW(m),h:CH(m),color:'#9aabc7',text:`${name}${name?' ':''}${m} kg`,size:24}));}
const midY=(fy,m)=>fy-16-CH(m)/2, topY=(fy,m)=>fy-16-CH(m);
const sgn=v=>v>0?'＋':v<0?'−':'';
const num=v=>`${v<0?'−':''}${Math.abs(v)}`;
// velocity arrow (purple) from the cart face in the direction of motion
function vArr(x,fy,m,v,{g=1,sc=40,text=true,above=false}={}){
 if(!v)return '';const y=midY(fy,m)+4,x0=x+Math.sign(v)*(CW(m)/2+8),x1=x0+v*sc;
 const t=above?label(`v ＝ ${num(v)} m/s`,x0,y-24,{size:24,color:C.v,anchor:v>0?'start':'end',weight:700}):label(`v ＝ ${num(v)} m/s`,v>0?x1+10:x1-10,y+9,{size:24,color:C.v,anchor:v>0?'start':'end',weight:700});
 return arrow(x0,y,x1,y,{color:C.v,w:6,head:18,g})+(text?fade(g,t):'');
}
// momentum arrow (pink) above the cart
function pArr(x,fy,m,p,{g=1,sc=34,text=true,dy=34}={}){
 if(!p)return '';const y=topY(fy,m)-dy,x0=x-Math.sign(p)*CW(m)/2,x1=x0+p*sc;
 return arrow(x0,y,x1,y,{color:C.p,w:7,head:20,g})+(text?fade(g,label(`p ＝ ${num(p)} kg·m/s`,p>0?x1+10:x1-10,y+9,{size:24,color:C.p,anchor:p>0?'start':'end',weight:700})):'');
}
function posDir(x=40,y=40,g=1){return fade(g,arrow(x,y,x+80,y,{color:C.hi,w:4,head:14})+label('右向きを正（＋）',x+94,y+8,{size:22,color:C.hi}));}
function dashRect(x,y,w,h,{color=C.hi,g=1,dash='12 9',sw=3}={}){return fade(g,`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${color}" fill-opacity=".05" stroke="${color}" stroke-width="${sw}" stroke-dasharray="${dash}"/>`);}
function forceArr(x0,y,x1,{g=1,text='',tdy=-16,color=C.F,w=7}={}){return arrow(x0,y,x1,y,{color,w,head:20,g})+(text?fade(g,label(text,(x0+x1)/2,y+tdy,{size:24,color,anchor:'middle',weight:700})):'');}
const col=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});

// ---- F–t graphs ----------------------------------------------------------------------------
function ft({x=110,y=420,w=520,h=300,xmax=3.4,ymax=5,ymin=0,xticks=[0.5,1,1.5,2,2.5,3],yticks=[1,2,3,4],g=1,xl='時刻 t [s]',yl='力 F [N]'}={}){
 return axes({x,y,w,h,xmax,ymax,ymin,xticks,yticks,grid:true,g,xlabel:xl,ylabel:yl,xcolor:C.t,ycolor:C.F});
}
function imp(A,t0,t1,F,{g=1,color=C.p,fo=.32}={}){
 if(g<=0.001)return '';const X0=A.X(t0),W=(A.X(t1)-X0)*clamp(g),y0=A.Y(0),y1=A.Y(F);
 return rect(X0,Math.min(y0,y1),W,Math.abs(y1-y0),{fill:color,fo,stroke:C.F,sw:3,rx:2});
}

// ---- layout constants ---------------------------------------------------------------------
const L1=210,L2=440; // lane floors in S2
const S3F=330;       // floor in S3
const S5F=290;       // floor in S5

// S2 lanes: upper = right-moving 2 kg (3 m/s), lower = left-moving
function laneUpper({g=1,dim=1}={}){return fade(g*dim,ground(40,620,L1)+cartM(250,L1,2)+vArr(250,L1,2,3)+pArr(250,L1,2,6));}
function laneLower({g=1}={}){return fade(g,ground(40,620,L2)+cartM(430,L2,2)+vArr(430,L2,2,-3)+pArr(430,L2,2,-6));}

// S5 two 1-kg carts
function twoCarts(xa,xb,{va=2,vb=-2,g=1,showV=true,showP=false}={}){
 let s=ground(60,1140,S5F)+cartM(xa,S5F,1,{name:'A'})+cartM(xb,S5F,1,{name:'B'});
 if(showV)s+=vArr(xa,S5F,1,va,{g,above:true})+vArr(xb,S5F,1,vb,{g,above:true});
 if(showP)s+=pArr(xa,S5F,1,va,{sc:40})+pArr(xb,S5F,1,vb,{sc:40});
 return s;
}
const XA=540,XB=660; // touching positions (A right face = B left face = 600)
function pushPair(g=1,{onA=true,onB=true,labA='B が A を押す',labB='A が B を押す'}={}){
 const y=topY(S5F,1)-16;let s='';
 if(onB)s+=forceArr(XB-40,y,XB+90,{g,color:C.F})+fade(g,label(labB,XB-30,y-22,{size:24,color:C.F,weight:700}));
 if(onA)s+=forceArr(XA+40,y,XA-90,{g,color:C.F})+fade(g,label(labA,XA+30,y-22,{size:24,color:C.F,anchor:'end',weight:700}));
 return s;
}

export const ytUiMomentum1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=ground(40,620,380)+cartM(130,380,1,{g:seg(p,0,.15)})+cartM(400,380,2,{g:seg(p,.05,.2)});
  s+=vArr(130,380,1,3,{g:seg(p,.15,.3),sc:30,text:false})+vArr(400,380,2,3,{g:seg(p,.2,.35),sc:30,text:false});
  s+=fade(seg(p,.2,.35),label('どちらも 右へ 3 m/s',300,200,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('止めにくい',400,270,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(680,90,490,300,label('前回の問い',925,140,{size:24,color:C.dim,anchor:'middle'})
   +label('同じ速さでも 重い台車ほど',925,205,{size:28,color:C.ink,anchor:'middle'})+label('止めにくい',925,250,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('この止めにくさを',925,315,{size:30,color:C.hi,anchor:'middle',weight:700})+label('表す量は？',925,360,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.25,.4),C.hi);
  return s;
 },
 [K+'carts']:(p)=>{
  const rows=[[1,3,'止めやすい',C.dim,160,0],[2,3,'止めにくい',C.hi,295,.2],[2,6,'もっと 止めにくい',C.hi,430,.55]];
  let s=posDir(40,40,seg(p,0,.1));
  for(const [m,v,t,c,fy,t0] of rows){const g=seg(p,t0,t0+.12);
   s+=fade(g,ground(60,720,fy)+cartM(200,fy,m))+vArr(200,fy,m,v,{g,sc:40});
   s+=fade(seg(p,t0+.1,t0+.22),label(t,1150,midY(fy,m)+10,{size:30,color:c,anchor:'end',weight:700}));
  }
  return s;
 },
 // ===== S2 運動量 =====
 [K+'def']:(p)=>{
  let s=card(60,90,500,300,label('止めにくさ',310,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.15),label('質量が 2倍 → 2倍',310,215,{size:30,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.15,.25),label('速度が 2倍 → 2倍',310,280,{size:30,color:C.v,anchor:'middle'}))
   +fade(seg(p,.28,.4),label('→ 掛け算にする',310,350,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.08));
  const g=seg(p,.42,.55);
  s+=fade(g,tex(`${cP('p')}=m v`,870,190,{size:96}));
  s+=fade(seg(p,.6,.72),label('p：運動量',720,300,{size:28,color:C.p,weight:700})+label('m：質量 [kg]',720,350,{size:28,color:C.ink})+label('v：速度 [m/s]',720,400,{size:28,color:C.v}));
  s+=fade(seg(p,.75,.88),label('← 定義（こう決める）',950,300,{size:24,color:C.hi}));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=posDir(40,40)+ground(40,620,L1)+cartM(250,L1,2)+vArr(250,L1,2,3,{g:seg(p,.05,.2)});
  s+=pArr(250,L1,2,6,{g:seg(p,.45,.6)});
  s+=card(660,70,510,330,
   tex(`${cP('p')}=m v`,915,130,{size:48})
   +fade(seg(p,.2,.35),tex(`=2${U('kg')}\\times 3${U('m/s')}`,915,210,{size:40}))
   +fade(seg(p,.45,.6),tex(cP(`=6${PMS}`),915,290,{size:44,auto:false}))
   +fade(seg(p,.62,.78),label('単位も掛ける：kg × m/s',915,365,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=posDir(40,40)+laneUpper({dim:mix(1,.55,seg(p,.1,.3))});
  s+=fade(seg(p,.1,.25),ground(40,620,L2)+cartM(430,L2,2))+vArr(430,L2,2,-3,{g:seg(p,.25,.4)})+pArr(430,L2,2,-6,{g:seg(p,.55,.7)});
  s+=card(660,70,510,330,
   label('右へ 3 m/s：p ＝ ＋6 kg·m/s',915,130,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.25,.4),label('左へ 3 m/s：v ＝ −3 m/s',915,200,{size:28,color:C.v,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),tex(`${cP('p')}=2\\times(-3)`,915,275,{size:40})+tex(cP(`=-6${PMS}`),915,345,{size:40,auto:false})));
  return s;
 },
 [K+'vector']:(p)=>{
  let s=posDir(40,40)+laneUpper({dim:.55})+laneLower();
  s+=card(660,70,510,330,
   tex(`${cP('\\mathbf{p}')}=m\\,{\\color{${C.v}}{\\mathbf{v}}}`,915,140,{size:60,auto:false})
   +fade(seg(p,.15,.3),label('𝐩 と 𝐯 は 同じ向き（ベクトル）',915,225,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.5,.65),label('一直線の上では',915,300,{size:26,color:C.dim,anchor:'middle'})+label('右向きを正とした 数：＋6、−6',915,350,{size:28,color:C.hi,anchor:'middle',weight:700})));
  return s;
 },
 [K+'ke']:(p)=>{
  let s=posDir(40,40)+laneUpper()+fade(.55,laneLower());
  s+=card(660,40,510,190,
   label('仕事の回：運動エネルギー',915,82,{size:24,color:C.dim,anchor:'middle'})
   +tex(`${cK('K')}=\\tfrac12 m v^2`,915,140,{size:40})
   +fade(seg(p,.4,.55),tex(`=\\tfrac12\\times2\\times3^2=${cK('9'+U('J'))}`,915,200,{size:34})),seg(p,0,.12),C.E);
  s+=fade(seg(p,.55,.7),tableKP(1,0));
  return s;
 },
 [K+'ke2']:(p)=>{
  let s=posDir(40,40)+laneUpper({dim:mix(1,.55,seg(p,0,.1))})+fade(mix(.55,1,seg(p,0,.1)),laneLower());
  s+=card(660,40,510,190,
   label('仕事の回：運動エネルギー',915,82,{size:24,color:C.dim,anchor:'middle'})
   +tex(`${cK('K')}=\\tfrac12 m v^2`,915,140,{size:40})+tex(`=\\tfrac12\\times2\\times3^2=${cK('9'+U('J'))}`,915,200,{size:34}),1,C.E);
  s+=tableKP(1,seg(p,.05,.2));
  s+=fade(seg(p,.2,.35),highlight(1015,378,150,52,1,C.E));
  s+=fade(seg(p,.35,.5),label('2乗 → 負にならない',1090,470,{size:24,color:C.E,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('単位も別：kg·m/s と J',830,505,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=posDir(40,40)+fade(.5,ground(40,620,L1)+cartM(200,L1,2)+vArr(200,L1,2,3,{sc:40}));
  s+=fade(seg(p,0,.12),ground(40,620,L2)+cartM(160,L2,1))+vArr(160,L2,1,6,{g:seg(p,.1,.3),sc:40});
  s+=card(660,110,510,280,label('確かめ',915,160,{size:26,color:C.hi,anchor:'middle'})
   +label('1 kg・右へ 6 m/s',915,225,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('運動量 p ＝ ？',915,295,{size:30,color:C.p,anchor:'middle'})+label('運動エネルギー K ＝ ？',915,350,{size:30,color:C.E,anchor:'middle'}),seg(p,.15,.3),C.hi);
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=posDir(40,40)+ground(40,620,L1)+cartM(200,L1,2)+vArr(200,L1,2,3,{sc:40})+ground(40,620,L2)+cartM(160,L2,1)+vArr(160,L2,1,6,{sc:40});
  const X=[730,890,1060];
  let t=col('',X[0],150)+col('2 kg・3 m/s',X[1],150,{size:24,color:C.dim})+col('1 kg・6 m/s',X[2],150,{size:24,color:C.dim});
  t+=fade(seg(p,.05,.2),col('p',X[0],230,{color:C.p,weight:700})+col('6 kg·m/s',X[1],230,{color:C.p})+col('6 kg·m/s',X[2],230,{color:C.p,weight:700}));
  t+=fade(seg(p,.25,.38),label('同じ',X[2],275,{size:24,color:C.hi,anchor:'middle',weight:700})+highlight(810,195,340,52,1,C.hi));
  t+=fade(seg(p,.5,.65),col('K',X[0],340,{color:C.E,weight:700})+col('9 J',X[1],340,{color:C.E})+col('18 J',X[2],340,{color:C.E,weight:700}));
  t+=fade(seg(p,.7,.82),label('違う',X[2],385,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=card(660,100,510,310,t);
  return s;
 },
 // ===== S3 力積 =====
 [K+'push']:(p)=>pushScene(p,{x:250,v:0,F:seg(p,.35,.55)})+s3card(p,[
   [label('2 kg の台車（止まっている）',915,140,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.2)],
   [label('右向きに 4 N（一定）',915,200,{size:28,color:C.F,anchor:'middle',weight:700}),seg(p,.4,.55)]]),
 [K+'accel']:(p)=>pushScene(p,{x:250,v:0,F:1})+s3card(p,[
   [label('2 kg の台車（止まっている）',915,140,{size:26,color:C.dim,anchor:'middle'}),1],
   [label('右向きに 4 N（一定）',915,200,{size:28,color:C.F,anchor:'middle'}),1],
   [tex(`a=\\dfrac{F}{m}=\\dfrac{4}{2}=2${U('m/s^2')}`,915,285,{size:40}),seg(p,.05,.2)],
   [label('1秒ごとに 速度が 2 m/s ずつ増える',915,375,{size:24,color:C.v,anchor:'middle'}),seg(p,.6,.75)]]),
 [K+'dv']:(p)=>{const u=seg(p,.05,.6),t=1.5*u,v=2*t;
  return pushScene(p,{x:250+50*(t/1.5)**2,v,F:1,t})+s3card(p,[
   [label('右向きに 4 N（一定）',915,140,{size:26,color:C.dim,anchor:'middle'}),1],
   [tex(`a=2${U('m/s^2')}`,915,200,{size:34}),1],
   [tex(`\\Delta v=a\\Delta t=2\\times1.5=3${U('m/s')}`,915,285,{size:36}),seg(p,.25,.45)],
   [label('止まっていたので v ＝ 3 m/s',915,375,{size:26,color:C.v,anchor:'middle',weight:700}),seg(p,.65,.8)]]);},
 [K+'derive']:(p)=>derive(p,0),
 [K+'derive2']:(p)=>derive(1,1)+deriveR(p,0),
 [K+'name']:(p)=>derive(1,1)+deriveR(1,1)+nameLines(p,0),
 [K+'check']:(p)=>derive(1,1)+deriveR(1,1)+nameLines(1,1)+checkLines(p),
 // ===== S4 面積 =====
 [K+'graph']:(p)=>{
  const A=ft({g:seg(p,0,.12)});let s=A.svg;
  s+=imp(A,0,1.5,4,{g:seg(p,.15,.45)});
  s+=fade(seg(p,.2,.35),line(A.X(1.5)+14,A.Y(0),A.X(1.5)+14,A.Y(4),{color:C.F,w:4})+label('4 N',A.X(1.5)+24,A.Y(2)+9,{size:26,color:C.F,weight:700}));
  s+=fade(seg(p,.35,.5),brace(A.X(0),A.X(1.5),A.Y(0)+44,{dir:1,color:C.t,text:'1.5 s',size:24}));
  s+=fade(seg(p,.55,.7),label('6 N·s',A.X(.75),A.Y(2)+12,{size:34,color:C.p,anchor:'middle',weight:700}));
  s+=card(760,110,410,260,label('長方形の面積',965,165,{size:26,color:C.dim,anchor:'middle'})
   +tex(`F\\Delta t=4\\times1.5`,965,235,{size:38})+tex(cP(`=6${NS}`),965,305,{size:40,auto:false})
   +label('＝ 力積',965,352,{size:26,color:C.p,anchor:'middle',weight:700}),seg(p,.55,.7),C.p);
  return s;
 },
 [K+'compare']:(p)=>{
  const A=axes({x:100,y:390,w:360,h:250,xmax:3.6,ymax:3,xticks:[1,2,3],yticks:[1,2],grid:true,xlabel:'位置 x [m]',ylabel:'力 F [N]',xcolor:C.x,ycolor:C.F,g:seg(p,0,.12)});
  let s=A.svg+rect(A.X(0),A.Y(2),A.X(3)-A.X(0),A.Y(0)-A.Y(2),{fill:C.E,fo:.32,stroke:C.F,sw:3,rx:2})+label('6 J',A.X(1.5),A.Y(1)+12,{size:32,color:C.E,anchor:'middle',weight:700});
  s+=fade(seg(p,0,.12),label('仕事の回：横軸 ＝ 位置',280,470,{size:26,color:C.x,anchor:'middle'})+label('面積 ＝ 仕事',280,505,{size:26,color:C.E,anchor:'middle',weight:700}));
  const B=axes({x:700,y:390,w:360,h:250,xmax:3.4,ymax:5,xticks:[1,2,3],yticks:[2,4],grid:true,xlabel:'時刻 t [s]',ylabel:'力 F [N]',xcolor:C.t,ycolor:C.F,g:seg(p,.45,.57)});
  s+=B.svg+imp(B,0,1.5,4,{g:seg(p,.55,.72)})+fade(seg(p,.65,.75),label('6 N·s',B.X(.75),B.Y(2)+12,{size:32,color:C.p,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.62),label('横軸を 時刻 に',880,470,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.72,.85),label('面積 ＝ 力積 ＝ Δp',880,505,{size:26,color:C.p,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.55),arrow(530,260,630,260,{color:C.dim,w:4,head:14}));
  return s;
 },
 [K+'predict']:(p)=>three(p,{show:[0,1,0],q:1}),
 [K+'shapes']:(p)=>three(p,{show:[seg(p,.05,.35),1,seg(p,.55,.85)],q:1-seg(p,0,.08),labels:[seg(p,.2,.35),1,seg(p,.7,.85)]}),
 [K+'same']:(p)=>three(p,{show:[1,1,1],labels:[1,1,1],same:seg(p,.05,.3),v:seg(p,.45,.65)}),
 [K+'stop']:(p)=>stopScene(p,{mode:0}),
 [K+'wall']:(p)=>stopScene(p,{mode:1}),
 [K+'cushion']:(p)=>stopScene(p,{mode:2}),
 // ===== S5 2台 =====
 [K+'two']:(p)=>{
  const xa=mix(250,300,seg(p,0,1)),xb=mix(950,900,seg(p,0,1));
  return posDir(40,40)+twoCarts(xa,xb,{g:seg(p,.1,.3)});
 },
 [K+'total']:(p)=>{
  const xa=mix(300,360,p),xb=mix(900,840,p);
  let s=posDir(40,40)+twoCarts(xa,xb);
  s+=card(170,360,860,140,
   fade(seg(p,.05,.2),label('A：1 × (＋2) ＝ ＋2',330,415,{size:28,color:C.p,anchor:'middle'}))
   +fade(seg(p,.2,.35),label('B：1 × (−2) ＝ −2',870,415,{size:28,color:C.p,anchor:'middle'}))
   +fade(seg(p,.5,.65),label('合計：＋2 ＋ (−2) ＝ 0 kg·m/s',600,475,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'collide']:(p)=>{
  const u=seg(p,0,.2),xa=mix(360,XA,u),xb=mix(840,XB,u);
  let s=posDir(40,40)+twoCarts(xa,xb,{showV:u<1,g:1-u});
  s+=pushPair(seg(p,.25,.45));
  s+=fade(seg(p,.6,.75),label('同じ大きさ・逆向き',600,110,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'law']:(p)=>{
  let s=posDir(40,40)+twoCarts(XA,XB,{showV:false})+pushPair(1)+label('同じ大きさ・逆向き',600,110,{size:32,color:C.hi,anchor:'middle',weight:700});
  s+=card(200,360,800,130,label('作用・反作用の法則',600,410,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('実験で確かめられた法則（詳しくは次のレベル）',600,462,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'impulses']:(p)=>{
  let s=posDir(40,40)+twoCarts(XA,XB,{showV:false})+pushPair(1)+label('同じ大きさ・逆向き',600,110,{size:32,color:C.hi,anchor:'middle',weight:700});
  s+=card(120,340,960,165,
   fade(seg(p,.05,.2),label('押し合う時間 Δt は 同じ',600,385,{size:26,color:C.t,anchor:'middle'}))
   +fade(seg(p,.2,.4),label('A が受ける：−FΔt',340,440,{size:28,color:C.p,anchor:'middle',weight:700})+label('B が受ける：＋FΔt',860,440,{size:28,color:C.p,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('足すと 0',600,485,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'frame']:(p)=>{
  let s=posDir(40,40)+twoCarts(XA,XB,{showV:false})+pushPair(1,{labA:'',labB:''});
  s+=dashRect(390,150,420,170,{g:seg(p,.05,.3)})+fade(seg(p,.2,.35),label('系（2台）',600,140,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('枠の中の力：打ち消し合う',600,380,{size:28,color:C.F,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),label('合計の運動量は 変わらない',600,430,{size:30,color:C.p,anchor:'middle',weight:700}));
  return s;
 },
 [K+'after']:(p)=>{
  let s=posDir(40,40)+twoCarts(XA,XB,{showV:false})+fade(1-seg(p,0,.15),pushPair(1,{labA:'',labB:''}));
  s+=dashRect(390,150,420,170)+label('系（2台）',600,140,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),label('くっついて 止まる：v ＝ 0',600,380,{size:28,color:C.v,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),label('合計：前 0 → 後 0',600,440,{size:32,color:C.p,anchor:'middle',weight:700})+highlight(440,405,320,54,1,C.hi));
  return s;
 },
 [K+'hand']:(p)=>{
  let s=posDir(40,40)+twoCarts(XA,XB,{showV:false});
  s+=dashRect(390,150,420,170)+label('系（2台）',600,140,{size:28,color:C.hi,anchor:'middle',weight:700});
  const y=midY(S5F,1)+4;
  s+=forceArr(250,y,XA-66,{g:seg(p,.05,.25),color:C.F})+fade(seg(p,.1,.25),label('手が押す力',300,y-28,{size:24,color:C.F,anchor:'middle',weight:700})+label('枠の外から → 外力',230,S5F+50,{size:24,color:EXT,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('打ち消す相手が 枠の中にない',600,390,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('合計の運動量が 変わる',600,445,{size:30,color:EXT,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cond']:(p)=>{
  let s=posDir(40,40)+twoCarts(XA,XB,{showV:false});
  s+=dashRect(390,150,420,170)+label('系（2台）',600,140,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.02,.15),rect(60,S5F,1080,26,{fill:EXT,fo:.18,stroke:EXT,sw:2,rx:4})+label('床（枠の外）：摩擦も 外力',950,S5F+60,{size:24,color:EXT,anchor:'middle',weight:700}));
  s+=card(120,380,560,120,label('合計の運動量が 変わらないのは',400,425,{size:26,color:C.ink,anchor:'middle'})
   +label('外力の力積を 無視できる間だけ',400,475,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'onlyA']:(p)=>{
  let s=posDir(40,40)+twoCarts(XA,XB,{showV:false});
  s+=dashRect(460,150,140,170,{g:seg(p,.05,.25)})+fade(seg(p,.1,.25),label('A だけ',530,350,{size:28,color:C.hi,anchor:'middle',weight:700}));
  const y=midY(S5F,1)+4;
  const yy=topY(S5F,1)-16;s+=forceArr(XA+40,yy,XA-90,{g:seg(p,.2,.4)})+fade(seg(p,.3,.45),label('B が押す力 → 外力',XA-100,yy+8,{size:24,color:EXT,anchor:'end',weight:700}));
  s+=fade(seg(p,.5,.65),label('A の運動量：＋2 → 0 kg·m/s',600,415,{size:30,color:C.p,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('まず：どこを囲んだか',600,460,{size:28,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=posDir(40,40)+ground(60,1140,250)+cartM(300,250,2)+vArr(300,250,2,3,{g:seg(p,.05,.2),sc:40})+cartM(820,250,1);
  s+=fade(seg(p,.1,.25),label('止まっている',820,140,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(250,300,700,190,label('確かめ',600,345,{size:26,color:C.hi,anchor:'middle'})
   +label('ぶつかって くっつく（外力は無視）',600,400,{size:28,color:C.ink,anchor:'middle'})
   +label('その後の 速度 v ＝ ？',600,455,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'quiz2ans']:(p)=>quiz2(p),
 // ===== S6 まとめ =====
 [K+'sum']:(p)=>summary(p,0),
 [K+'sum2']:(p)=>summary(1,p),
 [K+'door']:(p)=>door(p)+'',
 [K+'next']:(p)=>door(1)+card(760,120,410,260,label('次の問い',965,170,{size:24,color:C.dim,anchor:'middle'})
   +label('ドアを 回しやすくするのは',965,240,{size:28,color:C.ink,anchor:'middle'})+label('力の大きさ だけ？',965,300,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
};

// ---- S2 table: p and K for right/left ----------------------------------------------------
function tableKP(gRight,gLeft){
 const X=[760,930,1090],Y0=300;
 let t=col('',X[0],Y0)+col('p',X[1],Y0,{color:C.p,weight:700})+col('K',X[2],Y0,{color:C.E,weight:700});
 t+=col('右へ 3 m/s',X[0],Y0+55,{size:24,color:C.dim})+col('＋6 kg·m/s',X[1],Y0+55,{color:C.p})+col('9 J',X[2],Y0+55,{color:C.E});
 t+=fade(gLeft,col('左へ 3 m/s',X[0],Y0+110,{size:24,color:C.dim})+col('−6 kg·m/s',X[1],Y0+110,{color:C.p})+col('9 J',X[2],Y0+110,{color:C.E,weight:700}));
 return card(660,255,510,190,t);
}

// ---- S3 push scene ------------------------------------------------------------------------
function pushScene(p,{x=250,v=0,F=1,t=null}){
 let s=posDir(40,40)+ground(40,620,S3F)+cartM(x,S3F,2);
 const y=midY(S3F,2)+4,x1=x-CW(2)/2-6;
 s+=forceArr(x1-120,y,x1,{g:F,text:'F ＝ 4 N',tdy:-22});
 if(v>0.01)s+=vArr(x,S3F,2,v,{sc:30});
 else s+=fade(F<1?1:.9,label('v ＝ 0',x,topY(S3F,2)-20,{size:24,color:C.v,anchor:'middle'}));
 if(t!==null)s+=label(`t ＝ ${t.toFixed(1)} s`,330,440,{size:28,color:C.t,anchor:'middle',weight:700});
 return s;
}
function s3card(p,rows){return card(660,80,510,340,rows.map(([svg,g])=>fade(g,svg)).join(''),1);}

// ---- S3 derivation ------------------------------------------------------------------------
function derive(p,done){
 const X=80,sz=42;
 let s=fade(seg(p,.02,.12),tex('ma=F',X,110,{size:sz,anchor:'start'})+label('運動方程式（力が一定）',X+220,118,{size:22,color:C.dim}));
 s+=fade(seg(p,.2,.32),tex('ma\\,\\Delta t=F\\Delta t',X,200,{size:sz,anchor:'start'})+label('両辺に Δt を掛ける',X+290,208,{size:22,color:C.hi}));
 s+=fade(seg(p,.42,.55),tex(`m\\,${cA('(a\\Delta t)')}=F\\Delta t`,X,290,{size:sz,anchor:'start',auto:true}));
 s+=fade(seg(p,.55,.68),label('aΔt ＝ Δv',X+360,298,{size:24,color:C.hi,weight:700}));
 s+=fade(seg(p,.7,.85),tex('m\\Delta v=F\\Delta t',X,380,{size:sz,anchor:'start'}));
 return s;
}
function deriveR(p,done){
 return card(620,60,550,420,
  fade(seg(p,.02,.15),tex(`m\\Delta v=\\Delta(m v)=${cP('\\Delta p')}`,895,130,{size:38}))
  +fade(seg(p,.1,.25),label('質量 m が一定なら',895,180,{size:22,color:C.dim,anchor:'middle'}))
  +fade(seg(p,.5,.65),tex(`F\\Delta t=${cP('\\Delta p')}`,895,250,{size:50})+highlight(760,212,270,70,1,C.hi)),1);
}
function nameLines(p){
 return fade(seg(p,.02,.15),label('FΔt ＝ 力積',895,330,{size:28,color:C.F,anchor:'middle',weight:700}))
  +fade(seg(p,.4,.55),tex(`4${U('N')}\\times1.5${U('s')}=6${NS}`,895,385,{size:34}));
}
function checkLines(p){
 return fade(seg(p,.02,.18),tex(cP(`\\Delta p=6-0=6${PMS}`),895,440,{size:32,auto:false}))
  +fade(seg(p,.5,.65),label('N·s ＝ (kg·m/s²)·s ＝ kg·m/s',350,470,{size:26,color:C.hi,anchor:'middle'}));
}

// ---- S4 three rectangles with the same area -------------------------------------------------
function three(p,{show=[1,1,1],labels=[0,1,0],q=0,same=0,v=0}={}){
 const cfg=[[12,.5,'高く 細い'],[4,1.5,''],[2,3,'低く 広い']];
 let s='';
 cfg.forEach(([F,T,name],i)=>{
  const A=ft({x:100+i*380,y:400,w:230,h:280,xmax:3.4,ymax:13,xticks:[1,2,3],yticks:[2,4,6,8,10,12],xl:'t [s]',yl:'F [N]'});
  s+=A.svg+imp(A,0,T,F,{g:show[i]});
  const top=A.Y(F);
  s+=fade(labels[i]*show[i],label(`${F} N × ${T} s`,A.X(1.6),472,{size:24,color:C.ink,anchor:'middle'})+(name?label(name,A.X(1.6),503,{size:24,color:C.hi,anchor:'middle',weight:700}):''));
  s+=fade(show[i]*labels[i],label('6 N·s',A.X(T)+10,top-10,{size:26,color:C.p,weight:700}));
  s+=fade(same,highlight(A.X(0)-14,90,260,330,1,C.p));
  s+=fade(v,label('→ 3 m/s',A.X(1.6),i===0?260:180,{size:26,color:C.v,anchor:'middle',weight:700}));
  if(i===0&&q>0){s+=fade(q,draw([[A.X(0),A.Y(0)],[A.X(0),A.Y(10)]],1,{color:C.hi,w:0})+line(A.X(.5),A.Y(0),A.X(.5),A.Y(11),{color:C.hi,w:3,dash:'8 7'})+label('0.5 s',A.X(.5),A.Y(0)+62,{size:21,color:C.t,anchor:'middle'})+label('？ N',A.X(.5)+14,A.Y(8),{size:32,color:C.hi,weight:700}));}
 });
 return s;
}

// ---- S4 stopping ---------------------------------------------------------------------------
function stopScene(p,{mode}){
 const WX=880,fy=260,cush=mode===2;
 let s=posDir(40,40)+ground(40,WX,fy)+wall(WX,fy-190,fy);
 if(cush)s+=fade(seg(p,0,.15),rect(WX-70,fy-110,70,110,{fill:C.hi,fo:.25,stroke:C.hi,sw:2,rx:18})+label('クッション',WX-8,fy-122,{size:22,color:C.hi,anchor:'end'}));
 const x=mode===0?mix(260,420,seg(p,0,.8)):WX-(cush?70:0)-CW(2)/2-2;
 s+=cartM(x,fy,2);
 if(mode===0)s+=vArr(x,fy,2,3,{sc:40})+pArr(x,fy,2,6,{g:seg(p,.05,.2)});
 else{ // force from the wall/cushion on the cart: leftward, drawn from the cart's left face
  const y=midY(fy,2)+4,x0=x-CW(2)/2-6,L=cush?60:240,g=mode===1?seg(p,.2,.35):seg(p,.1,.25);
  s+=arrow(x0,y,x0-L,y,{color:C.F,w:cush?6:9,head:cush?16:24,g})+fade(g,cush?label('−12 N',x0-L-10,y+9,{size:26,color:C.F,anchor:'end',weight:700}):label('−600 N',x0-L/2,y-24,{size:26,color:C.F,anchor:'middle',weight:700}));
 }
 s+=card(40,300,520,200,label('止める（右へ 3 m/s → 0）',300,345,{size:24,color:C.dim,anchor:'middle'})
  +fade(mode===0?seg(p,.2,.4):1,tex(cP(`\\Delta p=0-6`),300,405,{size:38,auto:false}))
  +fade(mode===0?seg(p,.4,.55):1,tex(cP(`=-6${PMS}`),300,465,{size:38,auto:false})),1,C.p);
 const r1=mode===0?0:mode===1?seg(p,.05,.2):1,r2=cush?seg(p,.15,.3):0;
 s+=card(600,300,560,200,
  fade(r1,label('壁 0.01 s',625,352,{size:26,color:C.t})+tex(`F=-6\\div0.01=-600${U('N')}`,1140,350,{size:30,anchor:'end'}))
  +fade(mode===1?seg(p,.6,.75):r1,label('マイナス ＝ 左向き',1140,400,{size:22,color:C.F,anchor:'end'}))
  +fade(r2,label('クッション 0.5 s',625,457,{size:26,color:C.t})+tex(`F=-6\\div0.5=-12${U('N')}`,1140,455,{size:30,anchor:'end'})),mode===0?0:1);
 if(cush)s+=fade(seg(p,.5,.65),label('同じ Δp を 長い時間に広げる → 力が小さい（エアバッグ）',440,100,{size:24,color:C.hi,anchor:'middle'}));
 return s;
}

// ---- S5 quiz --------------------------------------------------------------------------------
function quiz2(p){
 const fy=250;
 let s=posDir(40,40)+ground(60,1140,fy);
 const u=seg(p,.0,.15);
 s+=cartM(mix(300,625,u),fy,2)+cartM(mix(820,755,u),fy,1);
 s+=fade(seg(p,.6,.75),vArr(755,fy,1,2,{sc:40})+label('一緒に',690,140,{size:24,color:C.v,anchor:'middle'}));
 s+=card(290,300,620,195,
  fade(seg(p,.05,.22),label('前：',320,352,{size:26,color:C.dim})+tex(`2\\times3+1\\times0=${cP('6'+PMS)}`,375,350,{size:32,anchor:'start'}))
  +fade(seg(p,.35,.5),label('後：',320,412,{size:26,color:C.dim})+tex(`(2+1)\\,v=${cP('6')}`,375,410,{size:32,anchor:'start'}))
  +fade(seg(p,.6,.75),tex(`v=6\\div3=2${U('m/s')}`,375,470,{size:32,anchor:'start'})+label('右向き',690,472,{size:24,color:C.v,weight:700})),1,C.p);
 return s;
}

// ---- S6 summary -------------------------------------------------------------------------------
function summary(p,q){
 const rows=[['運動量','p ＝ mv（向きを含む。kg·m/s）',C.p],['力積','FΔt ＝ Δp（F–t グラフの面積。N·s）',C.F],['系','外力の力積がない間だけ、合計の p は一定',C.hi]];
 let s='';
 rows.forEach(([h,b,c],i)=>{const g=i<2?seg(p,.05+i*.35,.2+i*.35):seg(q,.05,.2);
  s+=card(100,60+i*140,1000,115,label(h,170,128+i*140,{size:30,color:c,weight:700})+label(b,340,128+i*140,{size:30,color:C.ink}),g,c);});
 return s;
}
function door(p){
 const HX=180,HY=270,LEN=460;
 let s=label('上から見た ドア',HX-40,80,{size:24,color:C.dim});
 s+=wall(HX-10,HY-110,HY)+dot(HX,HY,12,C.ink)+label('ちょうつがい',HX,HY+50,{size:22,color:C.dim,anchor:'middle'});
 s+=rect(HX,HY-9,LEN,18,{fill:'#7a5a3c',fo:.8,stroke:'#c9a27a',sw:2,rx:4});
 const g1=seg(p,.2,.4),g2=seg(p,.45,.65);
 s+=arrow(HX+80,HY-100,HX+80,HY-16,{color:C.F,w:6,head:16,g:g1})+fade(g1,label('近くを押す',HX+80,HY-118,{size:24,color:C.F,anchor:'middle'}));
 s+=arrow(HX+LEN-30,HY-100,HX+LEN-30,HY-16,{color:C.F,w:6,head:16,g:g2})+fade(g2,label('遠くを押す',HX+LEN-30,HY-118,{size:24,color:C.F,anchor:'middle'}));
 s+=fade(seg(p,.5,.7),label('同じ大きさの力',HX+265,HY-160,{size:24,color:C.F,anchor:'middle'}));
 const R=LEN-20,a0=.08,a1=.42,P=a=>`${HX+R*Math.cos(a)} ${HY+R*Math.sin(a)}`;
 s+=fade(seg(p,.7,.85),`<path d="M${P(a0)} A ${R} ${R} 0 0 1 ${P(a1)}" fill="none" stroke="${C.hi}" stroke-width="4" stroke-dasharray="10 8"/>`+label('回りやすい',HX+R*Math.cos(a1)+24,HY+R*Math.sin(a1)+8,{size:26,color:C.hi,weight:700}));
 return s;
}
