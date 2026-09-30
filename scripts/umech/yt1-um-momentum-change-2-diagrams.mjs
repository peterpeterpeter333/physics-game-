// YouTube シリーズ「運動量・中級 2/2」(ys-um-momentum-change-2) — 図。Stage 1200×515.
// 色：運動量 p 桃、力 F 緑、速度 v 紫、時間 t 金、強調 黄、誤り 赤。ベクトルは太字。跳ね返る向き（右）が正。
// 数値：跳ね返り Δv＝40、Δp＝6.0、F平均＝600 N（0.010 s）／60 N（0.10 s）。1/2 の例の波形 F＝3600u(1−u)、頂上 900 N。
//   止める Δp＝3.0 → 300 N（0.010 s）／30 N（0.10 s）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,wall,cart,poly} from './anim.mjs';

const K='um-momentum-change-2:';
const CF=C.F,CV=C.v,CT=C.t,CH=C.hi,CD=C.dim,CP=C.p,CR=C.a;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cP=s=>`{\\color{${CP}}{${s}}}`;
const U=s=>`\\,\\mathrm{${s}}`;
const PMS=U('kg\\cdot m/s');
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:36,color:CR,weight:700,anchor:'middle'}));
function dashRect(x,y,w,h,{color=CH,g=1,dash='12 9',sw=3}={}){return fade(g,`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${color}" fill-opacity=".05" stroke="${color}" stroke-width="${sw}" stroke-dasharray="${dash}"/>`);}
// "F平均" as text: F (green) + small 平均
function Favg(x,y,{size=40,anchor='start'}={}){const w=size*.62+size*.9;const x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
 return label('F',x0,y,{size,color:CF,weight:700,anchor:'start'})+label('平均',x0+size*.62,y+size*.2,{size:Math.max(22,size*.5),color:CF,anchor:'start'});}

// ---- ball / wall ----------------------------------------------------------------------------
function ball(x,y,{r=26,g=1}={}){return fade(g,ring(x,y,r,{color:CD,w:3,fill:'#2b3d63'})+dot(x-8,y-8,6,'#5a73a6'));}
const WX=150,WY=250;
function wallL(g=1){return fade(g,wall(WX,WY-140,WY+120));}
function posDir(x,y,g=1,txt='跳ね返る向きが 正（＋）'){return fade(g,arrow(x,y,x+80,y,{color:CH,w:4,head:14})+label(txt,x+94,y+8,{size:22,color:CH}));}
function vArrow(x,y,v,{g=1,sc=6,text='',tdy=-18}={}){const x1=x+v*sc;return arrow(x,y,x1,y,{color:CV,w:6,head:18,g})+(text?fade(g,label(text,(x+x1)/2,y+tdy,{size:24,color:CV,anchor:'middle',weight:700})):'');}

// ---- F–t graphs ------------------------------------------------------------------------------
const T=0.010,Fb=t=>t<=0||t>=T?0:3600*(t/T)*(1-t/T);
function ftA({x=110,y=440,w=560,h=320,g=1,ymax=1000}={}){
 const A=axes({x,y,w,h,xmax:.012,ymax,xticks:[],yticks:[300,600,900],grid:true,g,xlabel:'t [s]',ylabel:'力 F [N]',xcolor:CT,ycolor:CF});
 return {...A,svg:A.svg+fade(g,['0.002','0.004','0.006','0.008','0.010'].map((t,i)=>line(A.X((i+1)*.002),A.Y(0)-6,A.X((i+1)*.002),A.Y(0)+6,{color:CD})+label(t,A.X((i+1)*.002),A.Y(0)+32,{size:21,color:CD,anchor:'middle'})).join(''))};
}
const curve=(A,p=1)=>A.plot(Fb,{from:0,to:T,p,color:CF,w:5});
function areaFill(A,g=1){if(g<=0.001)return '';const pts=[[A.X(0),A.Y(0)]];for(let i=0;i<=80;i++){const t=T*i/80;pts.push([A.X(t),A.Y(Fb(t))]);}pts.push([A.X(T),A.Y(0)]);return fade(g,poly(pts,{fill:CP,fo:.3}));}
function box(A,t0,t1,F,{g=1,color=CP,fo=.28,stroke=CF,dash=''}={}){if(g<=.001)return '';const w=(A.X(t1)-A.X(t0))*clamp(g);
 return dash?fade(g,`<rect x="${A.X(t0)}" y="${A.Y(F)}" width="${w}" height="${A.Y(0)-A.Y(F)}" fill="${color}" fill-opacity="${fo}" stroke="${stroke}" stroke-width="3" stroke-dasharray="${dash}"/>`):rect(A.X(t0),A.Y(F),w,A.Y(0)-A.Y(F),{fill:color,fo,stroke,sw:3,rx:0});}
// same scale graph for 0.010 s vs 0.10 s
function wideA({g=1,ymax=700,yt=[60,300,600],x=110,w=640}={}){
 const A=axes({x,y:440,w,h:330,xmax:.12,ymax,xticks:[],yticks:yt,grid:true,g,xlabel:'t [s]',ylabel:'力 F [N]',xcolor:CT,ycolor:CF});
 return {...A,svg:A.svg+fade(g,[['0.010',.01],['0.05',.05],['0.10',.1]].map(([s,t])=>line(A.X(t),A.Y(0)-6,A.X(t),A.Y(0)+6,{color:CD})+label(s,A.X(t),A.Y(0)+32,{size:21,color:CD,anchor:'middle'})).join(''))};
}

// ---- egg -------------------------------------------------------------------------------------
function egg(x,y,{broken=false,g=1}={}){
 let s=`<ellipse cx="${x}" cy="${y}" rx="30" ry="40" fill="#f3e6c8" fill-opacity=".9" stroke="#c9b48a" stroke-width="3"/>`;
 if(broken)s+=draw([[x-26,y-4],[x-12,y+8],[x-2,y-6],[x+10,y+8],[x+26,y-4]],1,{color:CR,w:4});
 return fade(g,s);
}
function eggPanels(p,{showDp=0,showDt=0}={}){
 const u=seg(p,0,.35),y=mix(120,300,u);
 let s=rect(90,350,380,50,{fill:'#6b7280',fo:.6,stroke:CD,rx:4})+label('コンクリート',280,440,{size:26,color:CD,anchor:'middle'});
 s+=rect(730,330,380,70,{fill:CV,fo:.25,stroke:CV,rx:24})+label('布団',920,440,{size:26,color:CV,anchor:'middle'});
 s+=egg(280,u<1?y:310,{broken:u>=1})+egg(920,u<1?y:300);
 s+=fade(seg(p,.35,.5),label('割れる',280,200,{size:32,color:CR,anchor:'middle',weight:700})+label('割れにくい',920,200,{size:32,color:CF,anchor:'middle',weight:700}));
 s+=fade(showDp,label('止まるまでの Δp：同じ',600,70,{size:30,color:CP,anchor:'middle',weight:700}));
 s+=fade(showDt,label('Δt：短い',280,490,{size:28,color:CT,anchor:'middle',weight:700})+label('Δt：長い → 力が 小さい',920,490,{size:28,color:CT,anchor:'middle',weight:700}));
 return s;
}

// ---- number lines ----------------------------------------------------------------------------
function vLine(y,{g=1,unit=15}={}){const X=v=>600+v*unit;
 return {X,svg:fade(g,line(X(-26),y,X(26),y,{color:CD,w:3})+[-20,-10,0,10,20].map(v=>line(X(v),y-8,X(v),y+8,{color:CD,w:2})+label(String(v),X(v),y+36,{size:22,color:CD,anchor:'middle'})).join('')+arrow(X(24),y,X(29),y,{color:CH,w:3,head:14})+label('＋',X(29)+8,y+8,{size:26,color:CH,weight:700}))};}

export const ytUmMomentumChange2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=ftA({g:seg(p,0,.12)});
  let s=A.svg+areaFill(A,seg(p,.15,.35))+curve(A)+fade(seg(p,.3,.45),label('6.0 N·s',A.X(T/2),A.Y(350),{size:34,color:CP,anchor:'middle',weight:700}));
  s+=card(740,100,420,260,label('前回',950,150,{size:24,color:CD,anchor:'middle'})
   +fade(seg(p,.1,.25),tex(`\\Delta ${cP('p')}=\\int F\\,dt`,950,230,{size:46}))
   +fade(seg(p,.5,.65),label('面積 ＝ 力積 ＝ Δp',950,310,{size:28,color:CP,anchor:'middle',weight:700})),seg(p,0,.12),CP);
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=wallL()+posDir(200,70)+ball(WX+26,WY)+vArrow(WX+220,WY-40,-20,{sc:7,text:'前 −20 m/s',tdy:-20})+vArrow(WX+80,WY+40,20,{sc:7,text:'後 ＋20 m/s',tdy:44});
  s+=card(560,80,600,360,label('前回の最後の問い',860,130,{size:24,color:CD,anchor:'middle'})
   +fade(seg(p,.1,.25),label('運動量は 速度で見ると いくら 変わる？',860,215,{size:28,color:CP,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),label('壁は 平均 どれだけの 力で 押した？',860,300,{size:28,color:CF,anchor:'middle',weight:700})),seg(p,0,.12),CH);
  return s;
 },
 [K+'egg']:(p)=>eggPanels(p,{showDp:seg(p,.7,.85)}),
 [K+'ask']:(p)=>fade(.3,eggPanels(1,{showDp:1}))+card(250,110,700,280,label('今回の問い',600,160,{size:26,color:CD,anchor:'middle'})
   +label('同じ 運動量の 変化でも',600,230,{size:32,color:CP,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('なぜ 時間を延ばすと',600,295,{size:32,color:CT,anchor:'middle',weight:700})+label('力が 小さくなる？',600,350,{size:34,color:CH,anchor:'middle',weight:700})),seg(p,0,.12),CH),
 // ===== S2 跳ね返りの Δp =====
 [K+'setup']:(p)=>{
  const u=seg(p,0,.45),b=seg(p,.5,.9);const x=p<.48?mix(700,WX+26,u):mix(WX+26,700,b);
  let s=wallL()+posDir(200,70,seg(p,.6,.75))+ball(x,WY)+fade(seg(p,0,.1),label('0.15 kg',x,WY+60,{size:24,color:CD,anchor:'middle'}));
  if(p<.45)s+=vArrow(x+36,WY,-20,{sc:5,text:'20 m/s'});
  if(p>.55)s+=vArrow(x+36,WY,20,{sc:5,text:'20 m/s'});
  return s;
 },
 [K+'vi']:(p)=>{
  let s=wallL()+posDir(200,70)+ball(WX+26,WY);
  s+=vArrow(WX+280,WY-50,-20,{sc:8,g:seg(p,0,.2),text:'前：−20 m/s',tdy:-22});
  s+=vArrow(WX+120,WY+50,20,{sc:8,g:seg(p,.25,.45),text:'後：＋20 m/s',tdy:46});
  s+=card(760,140,400,200,label('速度の 変化',960,195,{size:28,color:CD,anchor:'middle'})+label('Δv ＝ ？',960,275,{size:44,color:CV,anchor:'middle',weight:700}),seg(p,.55,.7),CH);
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(200,90,800,170,label('速さだけ見ると',600,140,{size:26,color:CD,anchor:'middle'})+tex('20-20=0',600,210,{size:54}),1,CR);
  s+=ng(880,215,seg(p,.2,.35));
  s+=fade(seg(p,.3,.45),label('向きが 逆になったことを 見落とす',600,330,{size:32,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('0 なら、壁は 何もしていない ことに',600,410,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'numline']:(p)=>{
  const N=vLine(260,{g:seg(p,0,.15)});let s=N.svg+label('速度 v [m/s]',600,330,{size:24,color:CV,anchor:'middle'});
  s+=fade(seg(p,.1,.25),dot(N.X(-20),260,10,CV)+label('前',N.X(-20),220,{size:26,color:CV,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),dot(N.X(20),260,10,CV)+label('後',N.X(20),220,{size:26,color:CV,anchor:'middle',weight:700}));
  s+=arrow(N.X(-20),180,N.X(20),180,{color:CV,w:7,head:20,g:seg(p,.2,.45)});
  s+=fade(seg(p,.4,.55),label('長さ 40',600,160,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=card(250,370,700,120,tex(`\\Delta v=20-(-20)=40${U('m/s')}`,600,432,{size:44}),seg(p,.55,.7),CV);
  return s;
 },
 [K+'dp']:(p)=>{
  let s=card(80,90,560,260,label('跳ね返り',360,140,{size:26,color:CD,anchor:'middle'})
   +tex(`\\Delta ${cP('p')}=m\\,\\Delta v`,360,200,{size:44})
   +fade(seg(p,.1,.3),tex('=0.15\\times40',360,260,{size:44}))
   +fade(seg(p,.3,.5),tex(cP(`=6.0${PMS}`),360,320,{size:46,auto:false})),1,CP);
  const A=ftA({x:800,y:420,w:300,h:240,g:seg(p,.55,.7)});
  s+=fade(seg(p,.55,.7),A.svg.replace(/<text[^>]*>0\.0[0-9]+<\/text>/g,'')+areaFill(A)+curve(A)+label('6.0 N·s',A.X(T/2),A.Y(300),{size:28,color:CP,anchor:'middle',weight:700})+label('前回の 山の面積',950,470,{size:24,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('同じ',700,300,{size:32,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pp']:(p)=>{
  const X=v=>600+v*80,y=180;
  let s=line(X(-4),y,X(4),y,{color:CD,w:3})+[-3,-2,-1,0,1,2,3].map(v=>line(X(v),y-8,X(v),y+8,{color:CD,w:2})+label(String(v),X(v),y+36,{size:22,color:CD,anchor:'middle'})).join('')+label('運動量 p [kg·m/s]',X(4)+14,y+8,{size:22,color:CP});
  s+=fade(seg(p,0,.15),dot(X(-3),y,10,CP)+label('前 −3.0',X(-3),y-24,{size:24,color:CP,anchor:'middle',weight:700})+dot(X(3),y,10,CP)+label('後 ＋3.0',X(3),y-24,{size:24,color:CP,anchor:'middle',weight:700}));
  s+=arrow(X(-3),y-60,X(3),y-60,{color:CP,w:6,head:18,g:seg(p,.1,.3)})+fade(seg(p,.25,.4),label('差 6.0',600,y-74,{size:28,color:CH,anchor:'middle',weight:700}));
  s+=card(90,300,500,180,label('力を 時間で 積む',340,345,{size:26,color:CF,anchor:'middle',weight:700})+tex(`\\int F\\,dt=6.0`,340,420,{size:40}),seg(p,.5,.65),CF);
  s+=card(610,300,500,180,label('速度の 差を取る',860,345,{size:26,color:CV,anchor:'middle',weight:700})+tex('m\\,\\Delta v=0.15\\times40=6.0',860,420,{size:36}),seg(p,.6,.75),CV);
  s+=fade(seg(p,.75,.9),label('＝',600,405,{size:40,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>quiz1(p,0),
 [K+'quizA']:(p)=>quiz1(1,p),
 // ===== S3 平均の力 =====
 [K+'avgQ']:(p)=>{
  const A=ftA({g:seg(p,0,.15)});
  let s=A.svg+areaFill(A)+curve(A)+label('6.0 N·s',A.X(T/2),A.Y(300),{size:30,color:CP,anchor:'middle',weight:700});
  s+=card(740,110,420,220,label('壁の力',950,160,{size:26,color:CD,anchor:'middle'})+label('刻々と 変わる',950,215,{size:30,color:CF,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('→ 平均の力 を考える',950,280,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,.1,.25),CH);
  return s;
 },
 [K+'avgdef']:(p)=>avgScene(p,0,0),
 [K+'avgcalc']:(p)=>avgScene(1,p,0),
 [K+'formula']:(p)=>avgScene(1,1,p),
 [K+'peak']:(p)=>{
  const A=ftA({w:460});
  let s=A.svg+areaFill(A,.5)+box(A,0,T,600,{g:1,color:CH,fo:.06,stroke:CH,dash:'10 7'})+curve(A);
  s+=label('平均 600 N',A.X(T)+14,A.Y(600)+8,{size:24,color:CH,weight:700});
  s+=fade(seg(p,.05,.2),line(A.X(T/2),A.Y(900),A.X(T/2)+60,A.Y(900)-30,{color:CF,w:2})+label('頂上 900 N',A.X(T/2)+66,A.Y(900)-26,{size:26,color:CF,weight:700}));
  s+=card(760,190,400,200,label('いちばん大きな力は',960,245,{size:26,color:C.ink,anchor:'middle'})+label('力の 波形 にもよる',960,300,{size:30,color:CF,anchor:'middle',weight:700})+label('（平均は Δp と Δt で 決まる）',960,350,{size:22,color:CD,anchor:'middle'}),seg(p,.4,.55),CF);
  return s;
 },
 [K+'bat']:(p)=>{
  const A=axes({x:110,y:440,w:560,h:320,xmax:1.2,ymax:1.2,g:1,xlabel:'t',ylabel:'力 F',xcolor:CT,ycolor:CF});
  const f=u=>u<=0||u>=1?0:Math.sin(Math.PI*u)*(0.75+0.25*Math.sin(u*23))*(1+.3*Math.sin(u*7));
  const pts=[[A.X(0),A.Y(0)]];for(let i=0;i<=120;i++){const u=i/120;pts.push([A.X(u),A.Y(f(u))]);}pts.push([A.X(1),A.Y(0)]);
  let s=A.svg+fade(seg(p,.3,.5),poly(pts,{fill:CP,fo:.3}))+A.plot(f,{from:0,to:1,p:seg(p,0,.3),color:CF,w:4,steps:240});
  s+=fade(seg(p,.1,.25),label('力の中身は 複雑',A.X(.5),A.Y(1.15),{size:26,color:CF,anchor:'middle',weight:700}));
  s+=card(740,140,420,220,label('でも 面積（力積）が',950,200,{size:28,color:CP,anchor:'middle',weight:700})+label('分かれば',950,245,{size:28,color:CP,anchor:'middle',weight:700})+label('→ Δp が 分かる',950,310,{size:32,color:CH,anchor:'middle',weight:700}),seg(p,.5,.65),CP);
  return s;
 },
 [K+'soft']:(p)=>wideScene(p,{hard:1,soft:0,q:seg(p,.3,.5)}),
 [K+'softA']:(p)=>wideScene(p,{hard:1,soft:seg(p,.05,.35),ans:seg(p,.3,.45),tenth:seg(p,.65,.8)}),
 [K+'two']:(p)=>wideScene(p,{hard:1,soft:1,ans:1,labels:seg(p,.05,.3),same:seg(p,.6,.8)}),
 [K+'swap']:(p)=>wideScene(p,{hard:1,soft:1,ans:1,labels:1,same:1,swap:seg(p,.05,.3),shokyu:seg(p,.55,.75)}),
 // ===== S4 止める・受け止める =====
 [K+'stop']:(p)=>stopBall(p,0),
 [K+'stopA']:(p)=>stopBall(1,p),
 [K+'stopF']:(p)=>{
  const A=wideA({g:seg(p,0,.12),ymax:350,yt:[30,150,300]});
  let s=A.svg+box(A,0,.01,300,{g:seg(p,.1,.3)})+box(A,0,.1,30,{g:seg(p,.5,.75)});
  s+=fade(seg(p,.2,.35),label('硬い手：300 N × 0.010 s',A.X(.012)+10,A.Y(300)+8,{size:24,color:CF,weight:700}));
  s+=fade(seg(p,.65,.8),label('手を引く：30 N × 0.10 s',A.X(.05),A.Y(30)-16,{size:24,color:CF,anchor:'middle',weight:700}));
  s+=card(800,110,360,200,label('止める',980,160,{size:24,color:CD,anchor:'middle'})+tex(cP(`\\Delta p=3.0${PMS}`),980,225,{size:34,auto:false})+label('面積は どちらも 3.0',980,285,{size:24,color:CP,anchor:'middle'}),seg(p,.05,.2),CP);
  return s;
 },
 [K+'egg2']:(p)=>eggPanels(1,{showDp:seg(p,.05,.25),showDt:seg(p,.5,.7)}),
 [K+'airbag']:(p)=>{
  const R=[['エアバッグ',.05],['柔道の 受け身',.2],['クッション・布団',.35]];
  let s=R.map(([t,g],i)=>card(100,80+i*110,440,90,label(t,320,135+i*110,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,g,g+.12),CT)).join('');
  s+=fade(seg(p,.45,.6),arrow(570,245,660,245,{color:CH,w:5,head:18}));
  s+=card(690,120,470,250,label('同じ Δp を',925,180,{size:30,color:CP,anchor:'middle',weight:700})+label('長い時間に 広げる',925,235,{size:30,color:CT,anchor:'middle',weight:700})+label('→ 体にかかる 力が 小さい',925,310,{size:30,color:CF,anchor:'middle',weight:700}),seg(p,.5,.65),CH);
  return s;
 },
 [K+'fix']:(p)=>{
  let s=Favg(120,260,{size:70})+tex(`=\\dfrac{\\Delta ${cP('p')}}{\\Delta t}`,260,245,{size:80,anchor:'start'});
  s+=fade(seg(p,.05,.25),arrow(620,170,480,190,{color:CP,w:4,head:14})+label('Δp：変えられない',640,170,{size:30,color:CP,weight:700})+label('（止まる以上 決まる）',640,210,{size:24,color:CD}));
  s+=fade(seg(p,.4,.55),arrow(620,320,480,300,{color:CT,w:4,head:14})+label('Δt：変えられるのは ここだけ',640,330,{size:30,color:CT,weight:700}));
  s+=arrow(300,430,560,430,{color:CT,w:6,head:18,g:seg(p,.55,.75)})+fade(seg(p,.6,.75),label('Δt を 延ばす → 力が 小さい',580,438,{size:28,color:CF,weight:700}));
  return s;
 },
 [K+'quiz2']:(p)=>quiz2(p,0),
 [K+'quiz2A']:(p)=>quiz2(1,p),
 // ===== S5 まとめ =====
 [K+'sum1']:(p)=>summary(p,0),
 [K+'sum2']:(p)=>summary(1,p),
 [K+'vec']:(p)=>{
  let s=fade(1,wall(260,90,470));
  const bx=286,by=280;
  s+=draw([[560,120],[bx,by]],seg(p,0,.25),{color:CV,w:3,dash:'8 7'})+draw([[bx,by],[560,440]],seg(p,.2,.45),{color:CV,w:3,dash:'8 7'});
  s+=ball(bx,by,{g:seg(p,.15,.3)});
  // vector triangle
  const ox=780,oy=160,a=110,b=90;
  s+=arrow(ox,oy,ox-a,oy+b,{color:CP,w:6,head:16,g:seg(p,.3,.45)})+fade(seg(p,.35,.5),label('𝐩前',ox-a-12,oy+b+8,{size:26,color:CP,anchor:'end',weight:700}));
  s+=arrow(ox,oy,ox+a,oy+b,{color:CP,w:6,head:16,g:seg(p,.4,.55)})+fade(seg(p,.45,.6),label('𝐩後',ox+a+12,oy+b+8,{size:26,color:CP,weight:700}));
  s+=arrow(ox-a,oy+b+8,ox+a,oy+b+8,{color:CH,w:6,head:16,g:seg(p,.55,.7)})+fade(seg(p,.6,.75),label('Δ𝐩（壁に 垂直）',ox,oy+b+48,{size:26,color:CH,anchor:'middle',weight:700}));
  s+=card(600,340,560,140,tex(`\\Delta\\mathbf{${cP('p')}}=\\int\\mathbf{F}\\,dt`,880,395,{size:44})+label('成分ごとに 使う',880,455,{size:26,color:C.ink,anchor:'middle'}),seg(p,.65,.8),CP);
  return s;
 },
 [K+'upper']:(p)=>{
  let s=cart(420,300,{w:150,h:64,color:'#9aabc7',text:'A',size:26})+cart(620,300,{w:150,h:64,color:'#9aabc7',text:'B',size:26});
  s+=dashRect(320,190,400,140,{g:seg(p,.05,.2)});
  s+=arrow(515,240,450,240,{color:CF,w:5,head:14,g:seg(p,.1,.25)})+arrow(525,240,590,240,{color:CF,w:5,head:14,g:seg(p,.1,.25)});
  s+=fade(seg(p,.15,.3),label('作用・反作用',520,170,{size:26,color:CF,anchor:'middle',weight:700}));
  s+=card(780,150,380,220,label('合計の 運動量が',970,210,{size:28,color:CP,anchor:'middle',weight:700})+label('変わらないこと',970,255,{size:28,color:CP,anchor:'middle',weight:700})+label('→ 上級で 導く',970,320,{size:30,color:CH,anchor:'middle',weight:700}),seg(p,.4,.55),CH);
  return s;
 },
 [K+'turn']:(p)=>spin(p)+fade(seg(p,.1,.25),label('まっすぐ 進む → 運動量',600,70,{size:28,color:CP,anchor:'middle',weight:700}))+fade(seg(p,.55,.7),label('回るものの 止めにくさは？',600,480,{size:30,color:CH,anchor:'middle',weight:700})),
 [K+'nextq']:(p)=>{
  let s=fade(.8,spin(1,{x:330}));
  s+=fade(seg(p,.4,.55),dot(330,280,9,CH)+label('中心？',330,262,{size:22,color:CH,anchor:'middle'})+dot(450,200,9,CH)+label('ここ？',470,188,{size:22,color:CH}));
  s+=card(620,90,540,340,label('次の問い',890,140,{size:24,color:CD,anchor:'middle'})
   +label('回転にも「勢い」はある？',890,210,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('測るには まず',890,280,{size:28,color:C.ink,anchor:'middle'})+label('どの点のまわりか を決める',890,325,{size:30,color:CH,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('―― なぜ？',890,390,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,0,.12),CH);
  return s;
 },
};

// ---- helpers --------------------------------------------------------------------------------
function quiz1(p,q){
 let s=card(150,70,900,170,label('確かめ',600,115,{size:26,color:CH,anchor:'middle'})+label('2.0 kg の物体：3.0 m/s → 8.0 m/s',600,170,{size:32,color:C.ink,anchor:'middle',weight:700})+label('Δp ＝ ？',600,220,{size:30,color:CP,anchor:'middle',weight:700}),seg(p,0,.15),CH);
 s+=fade(seg(q,.05,.25),tex(`\\Delta ${cP('p')}=2.0\\times(8.0-3.0)=${cP('10'+PMS)}`,600,305,{size:42}));
 s+=fade(seg(q,.4,.55),label('5.0：質量の 掛け忘れ',380,400,{size:26,color:CR,anchor:'middle'})+ng(220,405));
 s+=fade(seg(q,.6,.75),label('16：後の 運動量 そのもの',820,400,{size:26,color:CR,anchor:'middle'})+ng(640,405));
 return s;
}
function avgScene(p,q,r){
 const A=ftA({w:460});
 let s=A.svg+areaFill(A)+curve(A);
 s+=box(A,0,T,600,{g:seg(p,.15,.45),color:CH,fo:.12,stroke:CH,dash:'10 7'});
 s+=fade(seg(p,.4,.55),label('同じ 面積の 長方形',A.X(T)+14,A.Y(600)-10,{size:24,color:CH,weight:700}));
 s+=fade(seg(p,.55,.7),label('高さ ＝ 平均の力',A.X(T)+14,A.Y(600)+24,{size:24,color:CH}));
 s+=card(760,230,400,210,
  fade(seg(q,.05,.25),Favg(800,300,{size:40})+tex('=\\dfrac{6.0}{0.010}',900,290,{size:38,anchor:'start'}))
  +fade(seg(q,.35,.55),tex(`=600${U('N')}`,960,380,{size:44}))
  ,seg(q,0,.1),CF);
 s+=card(760,60,400,150,fade(seg(r,.05,.25),Favg(820,150,{size:44})+tex(`=\\dfrac{\\Delta ${cP('p')}}{\\Delta t}`,940,138,{size:48,anchor:'start'})),seg(r,0,.1),CH);
 s+=fade(seg(r,.5,.65),label('面積 ÷ 幅 ＝ 平均の高さ',960,480,{size:24,color:C.ink,anchor:'middle'}));
 return s;
}
function wideScene(p,{hard=0,soft=0,q=0,ans=0,tenth=0,labels=0,same=0,swap=0,shokyu=0}={}){
 const A=wideA();
 let s=A.svg+box(A,0,.01,600,{g:hard})+box(A,0,.1,60,{g:soft});
 s+=fade(hard,label('600 N × 0.010 s',A.X(.012)+10,A.Y(600)+8,{size:24,color:CF,weight:700}));
 s+=fade(q*(1-soft),line(A.X(.1),A.Y(0),A.X(.1),A.Y(650),{color:CH,w:3,dash:'8 6'})+label('0.10 s なら？',A.X(.1)-10,A.Y(650)+8,{size:26,color:CH,anchor:'end',weight:700}));
 s+=fade(labels*soft,label('60 N × 0.10 s',A.X(.06),A.Y(60)-16,{size:24,color:CF,anchor:'middle',weight:700}));
 s+=fade(labels,label('細く 高い',A.X(.012)+10,A.Y(600)+40,{size:24,color:CH})+label('低く 広い',A.X(.06),A.Y(60)-50,{size:24,color:CH,anchor:'middle'}));
 s+=card(800,90,360,250,
  fade(ans,Favg(830,160,{size:36})+tex('=\\dfrac{6.0}{0.10}',920,150,{size:34,anchor:'start'})+tex(`=60${U('N')}`,980,225,{size:40}))
  +fade(tenth,label('Δp 同じ → 力は 1/10',980,295,{size:26,color:CH,anchor:'middle',weight:700}))
  +fade(same*(1-swap),label('面積：どちらも 6.0',980,295,{size:26,color:CP,anchor:'middle',weight:700}))
  +fade(swap,label('幅 ↑ → 高さ ↓',980,295,{size:28,color:CH,anchor:'middle',weight:700})),ans,CF);
 s+=fade(shokyu,card(830,360,330,120,label('初級：同じ面積の',995,405,{size:24,color:CD,anchor:'middle'})+label('長方形の 数値版',995,448,{size:26,color:C.ink,anchor:'middle',weight:700}),1));
 return s;
}
function stopBall(p,q){
 const HX=170;
 let s=posDir(200,70)+fade(1,rect(HX-50,WY-70,50,140,{fill:'#c9a27a',fo:.5,stroke:'#c9a27a',rx:20})+label('手',HX-25,WY+100,{size:26,color:CD,anchor:'middle'}));
 const x=mix(700,HX+26,seg(p,0,.5));
 s+=ball(x,WY);
 if(p<.5)s+=vArrow(x+36,WY,-20,{sc:5,text:'−20 m/s'});
 else s+=fade(seg(p,.5,.65),label('止まる：v ＝ 0',HX+120,WY-50,{size:26,color:CV,weight:700}));
 s+=card(640,300,520,190,label('受け止めて 止める',900,345,{size:26,color:CD,anchor:'middle'})
  +fade(1-seg(q,0,.1),label('Δp ＝ ？',900,415,{size:36,color:CP,anchor:'middle',weight:700}))+fade(seg(q,.05,.25),tex(cP(`\\Delta p=0-(-3.0)=3.0${PMS}`),900,410,{size:36,auto:false}))
  +fade(seg(q,.55,.7),label('跳ね返りの 6.0 とは 別',900,465,{size:26,color:CH,anchor:'middle',weight:700})),seg(p,.55,.7),CP);
 return s;
}
function quiz2(p,q){
 let s=card(150,70,900,170,label('確かめ',600,115,{size:26,color:CH,anchor:'middle'})+label('Δp ＝ 12 kg·m/s、Δt ＝ 0.020 s',600,170,{size:32,color:C.ink,anchor:'middle',weight:700})+label('平均の力 ＝ ？',600,220,{size:30,color:CF,anchor:'middle',weight:700}),seg(p,0,.15),CH);
 s+=fade(seg(q,.05,.25),Favg(360,320,{size:44})+tex(`=\\dfrac{12}{0.020}=600${U('N')}`,470,305,{size:44,anchor:'start'}));
 s+=fade(seg(q,.35,.5),label('12 × 0.020 ＝ 0.24 は 誤り',600,410,{size:28,color:CR,anchor:'middle'})+ng(330,415));
 s+=fade(seg(q,.6,.75),label('面積 ÷ 幅 ＝ 高さ',600,470,{size:28,color:CH,anchor:'middle',weight:700}));
 return s;
}
function summary(p,q){
 const R=[['Δp','正の向きを決め、符号つきで 後 − 前',CP,seg(p,.05,.2)],['跳ね返り','−20 → ＋20：Δv ＝ 40、Δp ＝ 6.0',CV,seg(p,.4,.55)],
  ['平均の力','F平均 ＝ Δp/Δt（面積 ÷ 幅）',CF,seg(q,.05,.2)],['時間を延ばす','同じ Δp なら 力が 小さい',CT,seg(q,.4,.55)]];
 return R.map(([h,b,c,g],i)=>card(90,40+i*115,1020,95,label(h,130,98+i*115,{size:30,color:c,weight:700})+label(b,360,98+i*115,{size:30,color:C.ink}),g,c)).join('');
}
function spin(p,{x=300}={}){
 const y=280,R=110,a=p*2.2;
 let s=ring(x,y,R,{color:CD,w:4,fill:'#1b2a48'})+line(x,y,x+R*Math.cos(a),y+R*Math.sin(a),{color:CD,w:3})+dot(x,y,7,CD);
 const P=t=>`${x+(R+30)*Math.cos(t)} ${y+(R+30)*Math.sin(t)}`;
 s+=`<path d="M${P(-2.6)} A ${R+30} ${R+30} 0 0 1 ${P(-.6)}" fill="none" stroke="${CP}" stroke-width="5"/>`;
 const t1=-.6,hx=x+(R+30)*Math.cos(t1),hy=y+(R+30)*Math.sin(t1);
 s+=arrow(hx-14,hy-16,hx+4,hy+2,{color:CP,w:5,head:16});
 s+=label('回る 円盤',x,y+R+50,{size:24,color:CD,anchor:'middle'});
 if(x===300){s+=ball(820,280)+arrow(860,280,1020,280,{color:CP,w:6,head:18})+label('p',940,262,{size:26,color:CP,weight:700});}
 return s;
}
