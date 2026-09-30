// YouTube シリーズ「運動量・中級 1/2」(ys-um-momentum-change-1) — 図。Stage 1200×515.
// 色：運動量 p 桃、力 F 緑、速度 v 紫、時間 t 金、エネルギー（仕事・K・U）橙、位置 x 水色、強調 黄、誤り・外へ出る 赤。
// 数値：壁の力（例）F(t)＝3600·u(1−u) N、u＝t/0.010、頂上 900 N、面積 6.0 N·s。
//   5本（幅 0.002 s、真ん中）324,756,900,756,324 → 6.12。10本 → 6.03。p＝0.15×20＝3.0。台車 2 kg・4 N → p＝4t。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,wall,cart,poly} from './anim.mjs';

const K='um-momentum-change-1:';
const CF=C.F,CV=C.v,CT=C.t,CH=C.hi,CD=C.dim,CE=C.E,CP=C.p,CR=C.a;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cP=s=>`{\\color{${CP}}{${s}}}`,cE=s=>`{\\color{${CE}}{${s}}}`,cH=s=>`{\\color{${CH}}{${s}}}`;
const U=s=>`\\,\\mathrm{${s}}`;
const PMS=U('kg\\cdot m/s'),NS=U('N\\cdot s');
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:CR,weight:700,anchor:'middle'}));
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:CF,weight:700,anchor:'middle'}));
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
function dashRect(x,y,w,h,{color=CH,g=1,dash='12 9',sw=3}={}){return fade(g,`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${color}" fill-opacity=".05" stroke="${color}" stroke-width="${sw}" stroke-dasharray="${dash}"/>`);}

// ---- ball / wall -------------------------------------------------------------------------------
function ball(x,y,{r=26,g=1,sq=0}={}){const rx=r*(1-.35*sq),ry=r*(1+.2*sq);return fade(g,`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#2b3d63" stroke="${CD}" stroke-width="3"/>`+dot(x-8,y-8,6,'#5a73a6'));}
const WX=150,WY=260; // wall face x, ball centre y in the wall scenes
function wallL(g=1){return fade(g,wall(WX,WY-150,WY+120));}
function posDir(x,y,g=1,txt='跳ね返る向きが 正（＋）'){return fade(g,arrow(x,y,x+80,y,{color:CH,w:4,head:14})+label(txt,x+94,y+8,{size:22,color:CH}));}
function vArrow(x,y,v,{g=1,sc=6,text=''}={}){const x1=x+v*sc;return arrow(x,y,x1,y,{color:CV,w:6,head:18,g})+(text?fade(g,label(text,(x+x1)/2,y-18,{size:24,color:CV,anchor:'middle',weight:700})):'');}

// ---- F–t graph of the wall force (example waveform) ----------------------------------------------
const T=0.010,Fb=t=>t<=0||t>=T?0:3600*(t/T)*(1-t/T);
function ftA({x=110,y=440,w=560,h=320,g=1,ymax=1000,xmax=.012}={}){
 const A=axes({x,y,w,h,xmax,ymax,xticks:[],yticks:[300,600,900],grid:true,g,xlabel:'t [s]',ylabel:'力 F [N]',xcolor:CT,ycolor:CF});
 let s=A.svg+fade(g,['0.002','0.004','0.006','0.008','0.010'].map((t,i)=>line(A.X((i+1)*.002),A.Y(0)-6,A.X((i+1)*.002),A.Y(0)+6,{color:CD})+label(t,A.X((i+1)*.002),A.Y(0)+32,{size:21,color:CD,anchor:'middle'})).join(''));
 return {...A,svg:s};
}
const curve=(A,p=1,o={})=>A.plot(Fb,{from:0,to:T,p,color:CF,w:5,...o});
function areaFill(A,g=1,color=CP,fo=.3){if(g<=0.001)return '';const pts=[[A.X(0),A.Y(0)]];for(let i=0;i<=80;i++){const t=T*i/80;pts.push([A.X(t),A.Y(Fb(t))]);}pts.push([A.X(T),A.Y(0)]);return fade(g,poly(pts,{fill:color,fo}));}
function strips(A,n,{g=1,hl=-1,fo=.28,vals=0}={}){
 let s='';const w=T/n;
 for(let i=0;i<n;i++){const gi=clamp(g*n-i);if(gi<=0)continue;const tm=(i+.5)*w,F=Fb(tm);
  s+=fade(gi,rect(A.X(i*w),A.Y(F),A.X(w)-A.X(0),A.Y(0)-A.Y(F),{fill:i===hl?CH:CP,fo:i===hl?.35:fo,stroke:i===hl?CH:CF,sw:2,rx:0}));
  if(vals)s+=fade(vals*gi,label(String(Math.round(F)),A.X(tm),A.Y(F)-12,{size:22,color:CF,anchor:'middle',weight:700}));
 }
 return s;
}

// ---- small helpers --------------------------------------------------------------------------------
function rows(x,y0,dy,items){return items.map(([svg,g],i)=>fade(g,svg(x,y0+i*dy))).join('');}

// ---- rocket ----------------------------------------------------------------------------------------
function rocket(x,y,{g=1}={}){ // nose to the right, body centre (x,y)
 return fade(g,poly([[x-110,y-34],[x+60,y-34],[x+120,y],[x+60,y+34],[x-110,y+34]],{fill:'#9aabc7',fo:.35,stroke:CD,sw:3})
  +poly([[x-110,y-34],[x-150,y-64],[x-150,y-34]],{fill:'#9aabc7',fo:.35,stroke:CD,sw:2})+poly([[x-110,y+34],[x-150,y+64],[x-150,y+34]],{fill:'#9aabc7',fo:.35,stroke:CD,sw:2})
  +ring(x+30,y,12,{color:CD,w:3,fill:C.bg}));
}
function gas(x0,y,u,{n=7,g=1,arrows=true,spread=520}={}){ // puffs leaving to the left from x0; u = progress
 let s='';
 for(let i=0;i<n;i++){const ph=(u*1.4+i/n)%1,x=x0-ph*spread,yy=y+((i*37)%5-2)*12,a=clamp(1.2-ph);
  s+=fade(g*a,dot(x,yy,9,'#c9a27a'));
  if(arrows)s+=fade(g*a,arrow(x-12,yy,x-58,yy,{color:CP,w:4,head:12}));
 }
 return s;
}

export const ytUmMomentumChange1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=axes({x:90,y:430,w:470,h:300,xmin:-1.2,xmax:1.2,ymax:1.6,g:seg(p,0,.15),xlabel:'x',ylabel:'U',xcolor:C.x,ycolor:CE});
  let s=A.svg+A.plot(x=>x*x,{from:-1.2,to:1.2,p:seg(p,.05,.35),color:CE,w:5});
  const x0=.8,y0=x0*x0,sl=2*x0;
  s+=fade(seg(p,.3,.45),line(A.X(x0-.35),A.Y(y0-.35*sl),A.X(x0+.3),A.Y(y0+.3*sl),{color:CH,w:3,dash:'8 6'}));
  s+=fade(seg(p,.3,.45),dot(A.X(x0),A.Y(y0),9,CE));
  s+=arrow(A.X(x0),A.Y(y0)+36,A.X(x0)-110,A.Y(y0)+36,{color:CF,w:6,head:16,g:seg(p,.4,.55)})+fade(seg(p,.45,.55),label('力',A.X(x0)-120,A.Y(y0)+44,{size:24,color:CF,anchor:'end',weight:700}));
  s+=card(640,90,520,320,label('前回（位置エネルギー）',900,140,{size:24,color:CD,anchor:'middle'})
   +fade(seg(p,.2,.35),tex('F=-\\dfrac{dU}{dx}',900,225,{size:52}))
   +fade(seg(p,.4,.55),label('傾きに 負号 → U が 減る向き',900,295,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('摩擦（道で 仕事が 変わる）',900,352,{size:26,color:CR,anchor:'middle',weight:700})+label('→ U は 作れない',900,390,{size:26,color:CR,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'lastq']:(p)=>card(200,70,800,370,label('前回の最後の問い',600,120,{size:26,color:CD,anchor:'middle'})
   +fade(seg(p,.1,.25),label('位置で 力を積む → 仕事',600,200,{size:34,color:CE,anchor:'middle',weight:700}))
   +fade(seg(p,.4,.55),label('時間で 力を積むと',600,285,{size:34,color:CT,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('何が 変わる？',600,355,{size:40,color:CH,anchor:'middle',weight:700})),seg(p,0,.1),CH),
 [K+'work']:(p)=>{
  const A=axes({x:110,y:430,w:520,h:300,xmax:4,ymax:4,g:seg(p,0,.15),xlabel:'位置 x',ylabel:'力 F',xcolor:C.x,ycolor:CF});
  const f=x=>1+.9*Math.sin(x*1.1)+.35*x;
  let s=A.svg+A.plot(f,{from:0,to:3.6,p:seg(p,.05,.3),color:CF,w:5});
  const pts=[[A.X(.4),A.Y(0)]];for(let i=0;i<=60;i++){const x=.4+2.8*i/60;pts.push([A.X(x),A.Y(f(x))]);}pts.push([A.X(3.2),A.Y(0)]);
  s+=fade(seg(p,.3,.5),poly(pts,{fill:CE,fo:.3}));
  s+=fade(seg(p,.35,.5),line(A.X(1.6),A.Y(0),A.X(1.6),A.Y(f(1.6)),{color:CH,w:3})+label('F dx',A.X(1.6)+8,A.Y(f(1.6))-14,{size:24,color:CH,weight:700}));
  s+=card(700,110,460,260,label('仕事の回',930,160,{size:24,color:CD,anchor:'middle'})
   +fade(seg(p,.45,.6),tex(`W=\\int F\\,dx=${cE('\\Delta K')}`,930,240,{size:44}))
   +fade(seg(p,.7,.85),label('位置で積む → 運動エネルギー',930,320,{size:26,color:CE,anchor:'middle',weight:700})),seg(p,.4,.55),CE);
  return s;
 },
 [K+'shokyu']:(p)=>{
  const A=axes({x:110,y:430,w:500,h:300,xmax:2.4,ymax:6,xticks:[.5,1,1.5,2],yticks:[2,4],grid:true,g:seg(p,0,.15),xlabel:'t [s]',ylabel:'力 F [N]',xcolor:CT,ycolor:CF});
  let s=A.svg+fade(seg(p,.1,.35),rect(A.X(0),A.Y(4),A.X(1.5)-A.X(0),A.Y(0)-A.Y(4),{fill:CP,fo:.3,stroke:CF,sw:3,rx:2}));
  s+=fade(seg(p,.3,.45),label('6 N·s',A.X(.75),A.Y(2)+12,{size:34,color:CP,anchor:'middle',weight:700}));
  s+=card(690,110,470,260,label('初級：一定の力',925,160,{size:24,color:CD,anchor:'middle'})
   +fade(seg(p,.35,.5),tex(`F\\Delta t=4\\times1.5=6${NS}`,925,235,{size:38}))
   +fade(seg(p,.6,.75),tex(`=${cP('\\Delta p')}`,925,310,{size:46})),seg(p,.2,.35),CP);
  return s;
 },
 [K+'but']:(p)=>{
  const u=seg(p,0,.4),back=seg(p,.45,.8),touch=p>.38&&p<.48?1:0;
  const x=p<.43?mix(620,WX+26,u):mix(WX+26,560,back);
  let s=wallL()+ball(x,WY,{sq:touch});
  if(p<.38)s+=vArrow(x+40,WY,-12,{sc:6});
  if(p>.5)s+=vArrow(x+40,WY,12,{sc:6,g:seg(p,.5,.6)});
  const A=ftA({x:760,y:430,w:330,h:260,g:seg(p,.35,.5)});
  s+=A.svg.replace(/<text[^>]*>[0-9.]+<\/text>/g,'')+curve(A,seg(p,.4,.7));
  s+=fade(seg(p,.6,.8),label('一定ではない',925,120,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ask']:(p)=>{
  const A=ftA({x:110,y:440,w:520,h:300});
  let s=fade(.35,A.svg+curve(A));
  s+=card(560,110,600,280,label('今回の問い',860,160,{size:26,color:CD,anchor:'middle'})
   +label('時間で 変わる 力を',860,230,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('時間で 積むと',860,280,{size:32,color:CT,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('運動量は どう変わる？',860,350,{size:36,color:CP,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 // ===== S2 運動量と F＝dp/dt =====
 [K+'def']:(p)=>{
  let s=ball(220,300,{g:seg(p,0,.15)})+vArrow(256,300,20,{sc:9,g:seg(p,.1,.3),text:'v ＝ 20 m/s'});
  s+=arrow(194,220,194+3.0*80,220,{color:CP,w:8,head:22,g:seg(p,.65,.8)})+fade(seg(p,.7,.85),label('p ＝ 3.0 kg·m/s',194+120,196,{size:26,color:CP,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('0.15 kg',220,360,{size:24,color:CD,anchor:'middle'}));
  s+=card(640,80,520,340,tex(`${cP('p')}=m v`,900,150,{size:60})
   +fade(seg(p,.1,.25),label('運動量 ＝ 質量 × 速度',900,210,{size:26,color:CD,anchor:'middle'}))
   +fade(seg(p,.4,.55),tex('=0.15\\times20',900,285,{size:44}))
   +fade(seg(p,.6,.75),tex(cP(`=3.0${PMS}`),900,365,{size:46,auto:false})),seg(p,0,.12),CP);
  return s;
 },
 [K+'vec']:(p)=>{
  let s=card(80,70,1040,150,tex(`${cP('\\mathbf{p}')}=m\\,\\mathbf{v}`,380,145,{size:66})
   +fade(seg(p,.1,.3),label('太字 ＝ ベクトル（向きを持つ）',800,155,{size:28,color:C.ink,anchor:'middle'})),1,CP);
  const y=380,X=v=>600+v*80;
  s+=fade(seg(p,.45,.6),line(X(-5),y,X(5),y,{color:CD,w:3})+[-4,-3,-2,-1,0,1,2,3,4].map(v=>line(X(v),y-8,X(v),y+8,{color:CD,w:2})+label(String(v),X(v),y+36,{size:21,color:CD,anchor:'middle'})).join('')+arrow(X(4.4),y,X(5.3),y,{color:CH,w:3,head:14})+label('正の向き',X(5.3),y-20,{size:22,color:CH,anchor:'end'}));
  s+=arrow(X(0),y-40,X(3),y-40,{color:CP,w:7,head:18,g:seg(p,.6,.75)})+fade(seg(p,.65,.8),label('＋3.0',X(3)+12,y-32,{size:26,color:CP,weight:700}));
  s+=arrow(X(0),y-80,X(-3),y-80,{color:CP,w:7,head:18,g:seg(p,.75,.9)})+fade(seg(p,.8,.95),label('−3.0',X(-3)-12,y-72,{size:26,color:CP,anchor:'end',weight:700}));
  s+=fade(seg(p,.8,.95),label('kg·m/s（符号つきの数）',X(0),y+80,{size:24,color:CD,anchor:'middle'}));
  return s;
 },
 [K+'newton']:(p)=>newtonCard(seg(p,0,.45),seg(p,.4,1)),
 [K+'newton2']:(p)=>newtonCard(1,p),
 [K+'derive']:(p)=>derivation(p,0,0),
 [K+'derive2']:(p)=>derivation(1,p,0),
 [K+'derive3']:(p)=>derivation(1,1,p),
 [K+'meaning']:(p)=>{
  let s=tex(`F=\\dfrac{d${cP('p')}}{dt}`,600,170,{size:90});
  s+=brace(470,730,250,{dir:1,color:CH,g:seg(p,.2,.4)});
  s+=fade(seg(p,.3,.5),label('運動量が 1秒あたりに',600,330,{size:34,color:CP,anchor:'middle',weight:700})+label('どれだけ 変わるか',600,385,{size:34,color:CP,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('力 ＝ 運動量の 変化率',600,470,{size:28,color:CF,anchor:'middle'}));
  return s;
 },
 [K+'cart']:(p)=>cartGraph(p,0),
 [K+'unit']:(p)=>cartGraph(1,p),
 // ===== S3 どこを囲むか =====
 [K+'cond']:(p)=>{
  let s=card(160,70,880,120,label('質量 m が 変わらない',600,125,{size:34,color:C.ink,anchor:'middle',weight:700})+label('（d(mv)/dt ＝ m dv/dt に 使った 条件）',600,168,{size:24,color:CD,anchor:'middle'}),1,CH);
  s+=ball(600,330,{g:seg(p,.3,.45)})+dashRect(510,255,180,150,{g:seg(p,.45,.65)});
  s+=fade(seg(p,.6,.8),label('どこを 1つの 物体として 囲むか',600,460,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rocket']:(p0)=>{const p=seg(p0,.3,1);
  const x=mix(640,720,p),y=250;
  let s=rocket(x,y,{g:seg(p,0,.15)})+gas(x-150,y,p,{g:seg(p,.1,.25),arrows:false,spread:460});
  s+=dashRect(x-170,y-95,310,190,{g:seg(p,.3,.5)})+fade(seg(p,.4,.55),label('本体だけを 囲む',x-15,y-110,{size:26,color:CH,anchor:'middle',weight:700}));
  const m=mix(1,.7,seg(p,.55,1));
  s+=fade(seg(p,.55,.7),label('枠の中の 質量 m：',700,420,{size:28,color:C.ink,anchor:'end'})+rect(720,398,220*m,30,{fill:CD,fo:.5,stroke:CD,rx:4})+label('減っていく',960,422,{size:26,color:CR,weight:700}));
  s+=arrow(x+130,y,x+200,y,{color:CV,w:5,head:14,g:seg(p,.1,.25)});
  return s;
 },
 [K+'leak']:(p)=>{
  const x=720,y=250;
  let s=rocket(x,y)+gas(x-150,y,p,{g:1,arrows:true,spread:460})+dashRect(x-170,y-95,310,190)+label('本体だけを 囲む',x-15,y-110,{size:26,color:CH,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),label('ガスが 運動量を 持って 枠の外へ',330,420,{size:28,color:CP,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('力とは 別に、枠から 持ち出される',800,470,{size:28,color:CR,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wrong']:(p)=>{
  const x=720,y=200;
  let s=fade(.5,rocket(x,y)+gas(x-150,y,.4,{spread:460})+dashRect(x-170,y-95,310,190));
  s+=card(170,320,860,170,tex('F=\\dfrac{d(mv)}{dt}',360,405,{size:48})+label('を 本体だけに そのまま',720,390,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),label('→ 持ち出し分を 数え落とす',720,445,{size:28,color:CR,anchor:'middle',weight:700})),seg(p,0,.15),CR);
  s+=ng(215,410,seg(p,.4,.55));
  return s;
 },
 [K+'closed']:(p)=>closedScene(p,0),
 [K+'closed2']:(p)=>closedScene(1,p),
 [K+'back']:(p)=>{
  let s=ball(300,260)+dashRect(210,185,180,150)+label('0.15 kg は 変わらない',300,390,{size:26,color:C.ink,anchor:'middle'});
  s+=ok(300,440,seg(p,.1,.25));
  s+=card(520,110,620,280,label('この回：ボール 1個（質量 一定）',830,160,{size:26,color:CD,anchor:'middle'})
   +fade(seg(p,.35,.5),tex(`F=\\dfrac{d${cP('p')}}{dt}`,700,260,{size:50})+tex('ma=F',980,260,{size:46})+label('も',850,268,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('そのまま 使える',830,345,{size:30,color:CF,anchor:'middle',weight:700})),seg(p,.1,.3),CF);
  return s;
 },
 // ===== S4 刻々と変わる力 =====
 [K+'wall']:(p)=>{
  const u=seg(p,.1,.7);const x=mix(760,WX+26,u);
  let s=wallL()+posDir(200,80,seg(p,.3,.45))+ball(x,WY);
  s+=vArrow(x+40,WY,-20,{sc:5,g:seg(p,0,.15)*(1-seg(p,.65,.7)),text:'−20 m/s'});
  s+=fade(seg(p,.1,.25),label('0.15 kg',x+20,WY-44,{size:24,color:CD,anchor:'start'}));
  s+=card(700,330,460,140,label('壁と 触れている 時間',930,380,{size:26,color:CD,anchor:'middle'})+label('0.010 秒',930,440,{size:40,color:CT,anchor:'middle',weight:700}),seg(p,.65,.8),CT);
  return s;
 },
 [K+'curve']:(p)=>{
  const A=ftA({g:seg(p,0,.15)});
  let s=A.svg+curve(A,seg(p,.25,.6));
  s+=fade(seg(p,.65,.8),line(A.X(T/2),A.Y(900),A.X(T/2)+60,A.Y(900)-30,{color:CF,w:2})+label('頂上 900 N',A.X(T/2)+66,A.Y(900)-26,{size:26,color:CF,weight:700}));
  s+=card(780,110,380,200,label('壁が ボールを 押す力',970,160,{size:26,color:CF,anchor:'middle',weight:700})+label('（例として 与えた 形）',970,205,{size:24,color:CD,anchor:'middle'})+label('0 → 大きく → 0',970,265,{size:28,color:C.ink,anchor:'middle'}),seg(p,.1,.25),CF);
  return s;
 },
 [K+'grav']:(p)=>{
  const A=ftA();
  let s=A.svg+curve(A)+label('頂上 900 N',A.X(T/2)+66,A.Y(900)-26,{size:26,color:CF,weight:700});
  s+=card(780,110,380,260,label('ボールの 重力',970,160,{size:26,color:CD,anchor:'middle'})
   +fade(seg(p,.1,.25),label('約 1.5 N',970,220,{size:36,color:CF,anchor:'middle',weight:700}))
   +fade(seg(p,.35,.5),label('壁の力より ずっと小さい',970,280,{size:24,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('→ 無視する（仮定）',970,330,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  s+=fade(seg(p,.2,.35),line(A.X(0),A.Y(1.5*5),A.X(T),A.Y(1.5*5),{color:CF,w:3,dash:'6 5'}));
  return s;
 },
 [K+'which']:(p)=>{
  const A=ftA();const t=T*mix(.1,.9,seg(p,.1,.9)),F=Fb(t);
  let s=A.svg+curve(A);
  s+=line(A.X(t),A.Y(0),A.X(t),A.Y(1000),{color:CH,w:2,dash:'8 6'})+dot(A.X(t),A.Y(F),9,CH);
  s+=label(`F ＝ ${Math.round(F)} N`,A.X(t)+14,A.Y(F)-14,{size:26,color:CF,weight:700});
  s+=card(780,110,380,220,tex(`F=\\dfrac{d${cP('p')}}{dt}`,970,180,{size:44})+label('F に どの値を？',970,255,{size:30,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('1つに 決まらない',970,300,{size:26,color:CR,anchor:'middle',weight:700})),1,CH);
  return s;
 },
 [K+'dt']:(p)=>{
  const A=ftA();
  let s=fade(.35,A.svg+curve(A));
  s+=card(560,80,600,360,tex(`F=\\dfrac{d${cP('p')}}{dt}`,860,160,{size:56})
   +fade(seg(p,.15,.3),label('両辺に dt を 掛ける',860,235,{size:26,color:CH,anchor:'middle'}))
   +fade(seg(p,.3,.5),tex(`d${cP('p')}=F\\,dt`,860,310,{size:60}))
   +fade(seg(p,.6,.75),label('短い時間 dt の 運動量の 変化',860,390,{size:26,color:CP,anchor:'middle',weight:700})),1,CP);
  return s;
 },
 [K+'slice']:(p)=>{
  const A=ftA();
  let s=A.svg+curve(A)+strips(A,5,{g:seg(p,.1,.6)});
  s+=fade(seg(p,.2,.4),brace(A.X(0),A.X(.002),A.Y(324)-12,{dir:-1,color:CT,text:'0.002 s',size:22}));
  s+=card(780,110,380,200,label('5本の 短冊',970,165,{size:30,color:CP,anchor:'middle',weight:700})+label('幅 0.002 秒',970,220,{size:26,color:CT,anchor:'middle'})
   +fade(seg(p,.6,.75),label('1本の中：力 ≈ 一定',970,270,{size:26,color:C.ink,anchor:'middle'})),seg(p,.05,.2),CP);
  return s;
 },
 [K+'piece']:(p)=>{
  const A=ftA();
  let s=A.svg+curve(A)+strips(A,5,{hl:seg(p,.05,.2)>.5?1:-1});
  const x=A.X(.003);
  s+=fade(seg(p,.1,.25),label('i 番目',x,A.Y(0)+62,{size:22,color:CH,anchor:'middle',weight:700}));
  s+=card(780,90,380,330,label('短冊 1本',970,140,{size:26,color:CD,anchor:'middle'})
   +fade(seg(p,.15,.35),tex(`\\Delta ${cP('p')}_i\\approx F_i\\,\\Delta t_i`,970,220,{size:44}))
   +fade(seg(p,.45,.6),label('高さ Fᵢ × 幅 Δtᵢ',970,285,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('初級の FΔt が',970,340,{size:26,color:CH,anchor:'middle'})+label('短冊 1本ぶん',970,380,{size:26,color:CH,anchor:'middle',weight:700})),1,CH);
  return s;
 },
 [K+'num1']:(p)=>{
  const A=ftA();
  let s=A.svg+curve(A,1,{dash:'6 6'})+strips(A,5,{vals:seg(p,.05,.4)});
  s+=card(760,90,400,340,label('5本の 和',960,140,{size:26,color:CD,anchor:'middle'})
   +fade(seg(p,.45,.6),tex('(324+756+900',960,200,{size:32})+tex('+756+324)\\times0.002',960,250,{size:32}))
   +fade(seg(p,.7,.85),tex(cP(`=6.12${NS}`),960,330,{size:44,auto:false})),1,CP);
  return s;
 },
 [K+'num2']:(p)=>{
  const A=ftA();const g10=seg(p,0,.3);
  let s=A.svg+fade(1-g10,strips(A,5))+fade(g10,strips(A,10))+curve(A);
  s+=card(760,90,400,340,label('刻みを 細かく',960,140,{size:26,color:CD,anchor:'middle'})
   +label('5本',860,205,{size:28,color:C.ink,anchor:'middle'})+label('6.12',1060,205,{size:30,color:CP,anchor:'middle',weight:700})
   +fade(seg(p,.1,.3),label('10本',860,260,{size:28,color:C.ink,anchor:'middle'})+label('6.03',1060,260,{size:30,color:CP,anchor:'middle',weight:700}))
   +fade(seg(p,.4,.55),label('もっと細かく',860,315,{size:26,color:C.ink,anchor:'middle'})+label('→ 6.0',1060,315,{size:30,color:CP,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('≈ の行き先が ＝',960,390,{size:28,color:CH,anchor:'middle',weight:700})),1,CP);
  return s;
 },
 // ===== S5 力積＝グラフの面積 =====
 [K+'integral']:(p)=>{
  const A=ftA();
  let s=A.svg+fade(1-seg(p,0,.3),strips(A,10))+areaFill(A,seg(p,.1,.4))+curve(A);
  s+=card(760,90,400,300,label('刻みを 限りなく 細かく',960,140,{size:24,color:CD,anchor:'middle'})
   +fade(seg(p,.3,.5),tex(`\\Delta ${cP('p')}=\\int_{0}^{0.010}F\\,dt`,960,235,{size:44}))
   +fade(seg(p,.6,.75),label('接触の 始め → 終わり',960,330,{size:26,color:CT,anchor:'middle'})),1,CP);
  return s;
 },
 [K+'area']:(p)=>{
  const A=ftA();
  let s=A.svg+areaFill(A)+curve(A)+fade(seg(p,.4,.55),label('6.0 N·s',A.X(T/2),A.Y(350),{size:36,color:CP,anchor:'middle',weight:700}));
  s+=card(760,90,400,300,tex(`\\Delta ${cP('p')}=\\int_{0}^{0.010}F\\,dt`,960,160,{size:40})
   +fade(seg(p,.1,.3),label('グラフの下の 面積',960,240,{size:28,color:C.ink,anchor:'middle'})+label('＝ 力積',960,290,{size:34,color:CP,anchor:'middle',weight:700})),1,CP);
  return s;
 },
 [K+'unit2']:(p)=>{
  const A=ftA();
  let s=A.svg+areaFill(A)+curve(A)+label('6.0 N·s',A.X(T/2),A.Y(350),{size:36,color:CP,anchor:'middle',weight:700});
  s+=card(740,70,420,380,label('ボールの 運動量の 変化',950,120,{size:24,color:CD,anchor:'middle'})
   +tex(cP(`\\Delta p=+6.0${PMS}`),950,185,{size:40,auto:false})
   +fade(seg(p,.1,.25),label('正の向き（跳ね返る向き）に',950,240,{size:24,color:CH,anchor:'middle'}))
   +fade(seg(p,.45,.6),tex('\\mathrm{N\\cdot s}=\\mathrm{kg\\cdot m/s^2}\\times\\mathrm{s}',950,315,{size:32,auto:false}))
   +fade(seg(p,.65,.8),tex(cP('=\\mathrm{kg\\cdot m/s}'),950,390,{size:40,auto:false})),1,CP);
  return s;
 },
 [K+'const']:(p)=>{
  const A=ftA({x:90,y:440,w:480,h:270});
  let s=A.svg+areaFill(A)+curve(A)+label('刻々と 変わる力：積分',330,500,{size:26,color:CF,anchor:'middle'});
  const B=axes({x:700,y:440,w:380,h:270,xmax:2.2,ymax:6,xticks:[.5,1,1.5,2],yticks:[2,4],grid:true,g:seg(p,.05,.2),xlabel:'t [s]',ylabel:'F [N]',xcolor:CT,ycolor:CF});
  s+=B.svg+fade(seg(p,.15,.35),rect(B.X(0),B.Y(4),B.X(1.5)-B.X(0),B.Y(0)-B.Y(4),{fill:CP,fo:.3,stroke:CF,sw:3,rx:2})+label('FΔt',B.X(.75),B.Y(2)+10,{size:30,color:CP,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('一定の力：長方形',890,500,{size:26,color:CF,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),label('初級の力積 ＝ いちばん簡単な場合',600,50,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'compare']:(p)=>compare(seg(p,0,.6),seg(p,.55,1)),
 [K+'compare2']:(p)=>compare(1,p),
 [K+'quiz']:(p)=>quizScene(p,0),
 [K+'quizA']:(p)=>quizScene(1,p),
 // ===== S6 まとめ =====
 [K+'sum1']:(p)=>summary(p,0),
 [K+'sum2']:(p)=>summary(1,p),
 [K+'nextq']:(p)=>{
  let s=wallL()+posDir(200,80)+ball(WX+26,WY);
  s+=vArrow(WX+220,WY-40,-20,{sc:7,g:seg(p,0,.15)})+fade(seg(p,0,.15),label('前 −20 m/s',WX+220,WY-58,{size:24,color:CV,anchor:'middle',weight:700}));
  s+=vArrow(WX+80,WY+40,20,{sc:7,g:seg(p,.1,.25)})+fade(seg(p,.1,.25),label('後 ＋20 m/s',WX+220,WY+84,{size:24,color:CV,anchor:'middle',weight:700}));
  s+=card(560,80,600,360,label('次の問い',860,130,{size:24,color:CD,anchor:'middle'})
   +label('跳ね返るボール',860,195,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),label('運動量は 速度で見ると いくら 変わる？',860,265,{size:28,color:CP,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),label('壁は 平均 どれだけの 力で 押した？',860,340,{size:28,color:CF,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
};

// ---- S2 Newton ---------------------------------------------------------------------------------
function newtonCard(p,q){
 let s=card(80,70,1040,160,label('ニュートン：運動の 第2法則（文章）',600,115,{size:26,color:CD,anchor:'middle'})
  +fade(seg(p,.1,.35),label('「運動の 変化は、加えた 力に 比例する」',600,185,{size:36,color:C.ink,anchor:'middle',weight:700})),seg(p,0,.1));
 s+=fade(seg(q,.02,.2),label('運動の量 ＝ 質量 × 速度 ＝ p',600,290,{size:32,color:CP,anchor:'middle',weight:700}));
 s+=fade(seg(q,.45,.65),tex(`F=\\dfrac{d${cP('p')}}{dt}`,470,400,{size:66}));
 s+=fade(seg(q,.5,.7),label('力 ＝ 運動量の 時間変化率',840,410,{size:30,color:CF,anchor:'middle'}));
 return s;
}
// ---- S2 derivation --------------------------------------------------------------------------------
function derivation(p,q,r){
 const X=150,sz=40,Y=[95,200,305,405];
 let s=tex(`F=\\dfrac{d${cP('p')}}{dt}`,X,Y[0],{size:sz,anchor:'start'});
 s+=fade(seg(p,.05,.2),label('ma ＝ F とは？',1000,Y[0]+8,{size:28,color:CH,anchor:'middle',weight:700}));
 s+=fade(seg(p,.4,.6),tex(`=\\dfrac{d(m v)}{dt}`,X+130,Y[1],{size:sz,anchor:'start'})+label('p ＝ mv を 入れる',X+420,Y[1]+8,{size:24,color:CD}));
 s+=fade(seg(q,.05,.2),label('m が 途中で 変わらない（定数）',X+420,Y[2]-10,{size:24,color:CH,weight:700}));
 s+=fade(seg(q,.3,.5),tex(`=m\\,\\dfrac{dv}{dt}`,X+130,Y[2],{size:sz,anchor:'start'}));
 s+=fade(seg(q,.55,.7),label('→ m を 微分の外へ',X+420,Y[2]+26,{size:24,color:CD}));
 s+=fade(seg(r,.1,.3),tex('=ma',X+130,Y[3],{size:sz,anchor:'start'})+label('dv/dt ＝ a',X+420,Y[3]+8,{size:24,color:CD}));
 s+=card(720,380,460,110,label('m 一定なら',950,420,{size:24,color:CD,anchor:'middle'})+label('F ＝ dp/dt と ma ＝ F は 同じ',950,465,{size:26,color:CF,anchor:'middle',weight:700}),seg(r,.45,.6),CF);
 return s;
}
// ---- S2 p–t graph of the 2 kg cart -----------------------------------------------------------------
function cartGraph(p,q){
 const A=axes({x:110,y:440,w:430,h:320,xmax:2,ymax:8,xticks:[.5,1,1.5],yticks:[2,4,6],grid:true,g:seg(p,0,.12),xlabel:'t [s]',ylabel:'運動量 p [kg·m/s]',xcolor:CT,ycolor:CP});
 let s=A.svg+A.plot(t=>4*t,{from:0,to:1.5,p:seg(p,.1,.5),color:CP,w:5});
 s+=fade(seg(p,.3,.45),line(A.X(0),A.Y(0),A.X(1),A.Y(0),{color:CT,w:4})+line(A.X(1),A.Y(0),A.X(1),A.Y(4),{color:CP,w:4})+label('1 s',A.X(.5),A.Y(0)-10,{size:22,color:CT,anchor:'middle'})+label('＋4',A.X(1)+10,A.Y(2),{size:24,color:CP,weight:700}));
 s+=fade(seg(p,.55,.7),dot(A.X(1.5),A.Y(6),9,CP)+label('6',A.X(1.5)+14,A.Y(6)-10,{size:26,color:CP,weight:700}));
 s+=card(650,80,510,200,label('初級：2 kg の台車を 4 N で押す',905,125,{size:24,color:CD,anchor:'middle'})
  +fade(seg(p,.35,.5),label('1秒ごとに ＋4 kg·m/s',905,190,{size:30,color:CP,anchor:'middle',weight:700}))
  +fade(seg(p,.55,.7),label('傾き dp/dt ＝ 4 ＝ 力 4 N',905,245,{size:26,color:CF,anchor:'middle'})),seg(p,.05,.2),CP);
 s+=card(650,300,510,170,label('単位',905,340,{size:24,color:CD,anchor:'middle'})
  +fade(seg(q,.1,.3),tex('\\dfrac{\\mathrm{kg\\cdot m/s}}{\\mathrm{s}}=\\mathrm{kg\\cdot m/s^2}',905,400,{size:34,auto:false}))
  +fade(seg(q,.5,.65),tex(`=${`{\\color{${CF}}{\\mathrm{N}}}`}`,905,450,{size:38,auto:false})),seg(q,0,.12));
 return s;
}
// ---- S3 closed system -------------------------------------------------------------------------------
function closedScene(p,q){
 const x=820,y=220;
 let s=rocket(x,y)+gas(x-150,y,.5,{spread:500});
 s+=dashRect(120,100,x+150-120,240,{g:seg(p,.05,.3)});
 s+=fade(seg(p,.2,.35),label('本体 ＋ 噴き出した ガス 全部',560,90,{size:26,color:CH,anchor:'middle',weight:700}));
 s+=card(120,370,620,120,label('閉じた系：同じ 粒子の 集まり',430,412,{size:26,color:C.ink,anchor:'middle'})
  +label('外力の和 ＝ 全体の 運動量の 変化率',430,460,{size:28,color:CF,anchor:'middle',weight:700}),seg(p,.35,.55),CF);
 if(q>0){
  const fx=790,fy=470;
  s+=card(780,360,380,140,label('初級：2台を 枠で 囲む',970,395,{size:22,color:CD,anchor:'middle'})
   +cart(900,fy,{w:90,h:40,color:'#9aabc7',text:'A',size:22})+cart(1030,fy,{w:90,h:40,color:'#9aabc7',text:'B',size:22})
   +dashRect(840,405,250,80,{sw:2}),seg(q,.3,.5),CH);
 }
 return s;
}
// ---- S5 compare work / impulse -----------------------------------------------------------------------
function compare(p,q){
 const f=u=>1+.9*Math.sin(u*1.1)+.35*u;
 const mk=(x0,xl,xc,fill,name,g)=>{const A=axes({x:x0,y:330,w:360,h:220,xmax:4,ymax:4,g,xlabel:xl,ylabel:'力 F',xcolor:xc,ycolor:CF});
  const pts=[[A.X(.4),A.Y(0)]];for(let i=0;i<=60;i++){const u=.4+2.8*i/60;pts.push([A.X(u),A.Y(f(u))]);}pts.push([A.X(3.2),A.Y(0)]);
  return A.svg+fade(g,poly(pts,{fill,fo:.32})+A.plot(f,{from:0,to:3.6,color:CF,w:5})+label(name,A.X(1.8),A.Y(1)+10,{size:30,color:fill,anchor:'middle',weight:700}));};
 let s=mk(90,'位置 x',C.x,CE,'ΔK',seg(p,0,.15))+mk(720,'時間 t',CT,CP,'Δp',seg(p,.3,.45));
 s+=fade(seg(p,.1,.25),label('位置で 積む',270,390,{size:28,color:C.x,anchor:'middle',weight:700}));
 s+=fade(seg(p,.4,.55),label('時間で 積む',900,390,{size:28,color:CT,anchor:'middle',weight:700}));
 s+=fade(seg(p,.65,.8),label('違うのは 横軸だけ',480,36,{size:30,color:CH,anchor:'middle',weight:700})+highlight(465,312,110,44,1,CH)+highlight(1095,312,100,44,1,CH));
 s+=fade(seg(q,.1,.3),tex(`\\int F\\,dx=${cE('\\Delta K')}`,270,445,{size:34})+label('エネルギーの 変化',270,500,{size:26,color:CE,anchor:'middle'}));
 s+=fade(seg(q,.3,.5),tex(`\\int F\\,dt=${cP('\\Delta p')}`,900,445,{size:34})+label('運動量の 変化',900,500,{size:26,color:CP,anchor:'middle'}));
 return s;
}
// ---- S5 quiz -------------------------------------------------------------------------------------------
function quizScene(p,q){
 const A=axes({x:110,y:430,w:480,h:300,xmax:.25,ymax:60,xticks:[],yticks:[25,50],grid:true,g:seg(p,0,.12),xlabel:'t [s]',ylabel:'力 F [N]',xcolor:CT,ycolor:CF});
 let s=A.svg+fade(seg(p,0,.12),[.1,.2].map(t=>line(A.X(t),A.Y(0)-6,A.X(t),A.Y(0)+6,{color:CD})+label(String(t),A.X(t),A.Y(0)+32,{size:21,color:CD,anchor:'middle'})).join(''));
 const tri=[[A.X(0),A.Y(0)],[A.X(.1),A.Y(50)],[A.X(.2),A.Y(0)]];
 s+=draw(tri,seg(p,.1,.35),{color:CF,w:5});
 s+=fade(q>0?seg(q,.05,.25):0,poly(tri,{fill:CP,fo:.32}));
 s+=fade(seg(p,.3,.45),label('50 N',A.X(.1)+14,A.Y(50)-8,{size:26,color:CF,weight:700}));
 s+=card(660,90,500,340,label('確かめ',910,140,{size:26,color:CH,anchor:'middle'})
  +label('高さ 50 N・幅 0.2 秒の 三角形',910,200,{size:26,color:C.ink,anchor:'middle'})
  +label('Δp ＝ ？',910,265,{size:36,color:CP,anchor:'middle',weight:700})
  +fade(seg(q,.1,.3),tex('\\tfrac12\\times0.2\\times50',910,335,{size:38}))
  +fade(seg(q,.4,.55),tex(cP(`=5.0${PMS}`),910,400,{size:40,auto:false})),seg(p,.2,.35),CH);
 return s;
}
// ---- S6 summary ------------------------------------------------------------------------------------------
function summary(p,q){
 const R=[['運動量','p ＝ mv（向きを持つ。kg·m/s）',CP,seg(p,.05,.2)],['運動の法則','F ＝ dp/dt（m 一定なら ma ＝ F）',CF,seg(p,.3,.45)],['囲み方','質量の出入りに 注意（閉じた系）',CH,seg(p,.6,.75)],
  ['変わる力','短冊 FᵢΔtᵢ を 足して 極限',CT,seg(q,.05,.2)],['力積','Δp ＝ ∫F dt（F–t グラフの 面積）',CP,seg(q,.3,.45)]];
 return R.map(([h,b,c,g],i)=>card(90,20+i*98,1020,84,label(h,130,72+i*98,{size:28,color:c,weight:700})+label(b,340,72+i*98,{size:28,color:C.ink}),g,c)).join('');
}
