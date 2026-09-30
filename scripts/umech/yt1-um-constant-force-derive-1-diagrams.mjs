// YouTube シリーズ 運動方程式・中級 1/3（ステージ um-constant-force-derive 補0〜補5）— 図。Stage 1200×515.
// 色：位置 x・y・𝐫 水色、速度 v 紫、加速度 a・g 赤、力 F 緑、時刻 t 金、強調 黄、誤り 赤。
// 三つの球の図は g＝10 m/s²、1 m＝19 px の等倍：崖の上 (0, 20) から落とす①・横に 5 m/s ②、地面 x＝14 から真上に 15 m/s ③。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,ground,block,poly} from './anim.mjs';

const K='um-constant-force-derive-1:';
const BX='#9fb2d4';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const Y_=`{\\color{${C.x}}y}`,Z_=`{\\color{${C.x}}z}`,G_=`{\\color{${C.a}}g}`,R_=`{\\color{${C.x}}\\mathbf{r}}`,FB=`{\\color{${C.F}}\\mathbf{F}}`;
const XDD='\\dfrac{d^2x}{dt^2}',YDD=`\\dfrac{d^2${Y_}}{dt^2}`,ZDD=`\\dfrac{d^2${Z_}}{dt^2}`;
const box=(x,y,{w=120,h=90,text='2 kg',g=1}={})=>fade(g,block(x,y,w,h,{color:BX,text,size:26,fo:.25}));
const fArrow=(x,y,len,{g=1,text=''}={})=>fade(g,arrow(x,y,x+len,y,{color:C.F,w:6,head:18})+(text?label(text,x+len+12,y+9,{size:26,color:C.F,weight:700}):''));

// x–t graph of x = t² (初級の箱：2 kg に 4 N、静止・原点から)
const GT=(o={})=>axes({x:90,y:455,w:560,h:370,xmin:0,xmax:3.2,ymin:0,ymax:10,xlabel:'t [s]',ylabel:'x [m]',xticks:[1,2,3],yticks:[2,4,6,8],xcolor:C.t,ycolor:C.x,...o});
const sq=t=>t*t;

// ---- world picture of the three balls (g = 10) ----------------------------------------------
const PXM=19,WX=u=>200+30*(u+2),WY=v=>470-PXM*v;
const balls=[
 {n:'①',x:t=>0,y:t=>20-5*Math.min(t,2)**2,vx:t=>0,vy:t=>-10*Math.min(t,2),end:2},
 {n:'②',x:t=>5*Math.min(t,2),y:t=>20-5*Math.min(t,2)**2,vx:t=>5,vy:t=>-10*Math.min(t,2),end:2},
 {n:'③',x:t=>14,y:t=>{const s=Math.min(t,3);return 15*s-5*s*s;},vx:t=>0,vy:t=>15-10*Math.min(t,3),end:3},
];
function world({t=0,trace=1,g=1,acc=0,vel=0,pos=0,nums=1}={}){
 let s=ground(WX(-3),WX(17.5),WY(0));
 s+=rect(WX(-2.6),WY(20),WX(0)-WX(-2.6),WY(0)-WY(20),{fill:'#2a3550',fo:1,stroke:C.faint,sw:2,rx:2});
 balls.forEach((b,i)=>{
  if(trace){const T=Math.min(t,b.end);s+=draw(Array.from({length:81},(_,k)=>{const u=T*k/80;return [WX(b.x(u)),WY(b.y(u))];}),1,{color:C.dim,w:3,dash:'8 7'});}
 });
 if(pos){s+=fade(pos,dot(WX(0),WY(0),7,C.dim)+label('原点',WX(0)+8,WY(0)+34,{size:22,color:C.dim}));
  s+=fade(pos,arrow(WX(0),WY(0),WX(0)+2,WY(20)+14,{color:C.x,w:4,head:14})+arrow(WX(0),WY(0),WX(14)-14,WY(0),{color:C.x,w:4,head:14}));}
 balls.forEach((b,i)=>{const T=Math.min(t,b.end),bx=WX(b.x(T)),by=WY(b.y(T))-14;
  s+=ring(bx,by,14,{color:C.ink,w:2.5,fill:'#39475f'})+(nums?label(b.n,bx+(i===0?-44:i===1?20:22),by-14,{size:24,color:C.ink,weight:700}):'');
  if(acc)s+=fade(acc,arrow(bx,by+16,bx,by+16+70,{color:C.a,w:5,head:14})+label('g',bx+10,by+76,{size:26,color:C.a,weight:700}));
  if(vel){const vx=b.vx(T),vy=b.vy(T),k=8;
   if(Math.hypot(vx,vy)>.1)s+=fade(vel,arrow(bx,by,bx+k*vx,by-k*vy,{color:C.v,w:5,head:16}));}
 });
 return fade(g,s);
}

// x–t family used on the recap
const fam=(a,b)=>t=>a*Math.cos(2*t)+b*Math.sin(2*t);

// chain boxes (as 振動の方程式・中級)
function chain(p,{g1=1,g2=1,notes=1,y=150}={}){
 const bx=(x,t,c,g)=>fade(g,rect(x-120,y,240,100,{fill:'#131f38',fo:1,stroke:c,sw:3,rx:14})+label(t,x,y+62,{size:34,color:c,anchor:'middle',weight:700}));
 let s=bx(220,'加速度 a',C.a,1)+bx(600,'速度 v',C.v,g1)+bx(980,'位置 x',C.x,g2);
 s+=fade(g1,arrow(345,y+50,475,y+50,{color:C.dim,w:4,head:14})+label('1段目',410,y+30,{size:24,color:C.dim,anchor:'middle'}));
 s+=fade(g2,arrow(725,y+50,855,y+50,{color:C.dim,w:4,head:14})+label('2段目',790,y+30,{size:24,color:C.dim,anchor:'middle'}));
 s+=fade(g1*notes,label('出発点 v₀ が 要る',600,y+150,{size:28,color:C.v,anchor:'middle',weight:700}));
 s+=fade(g2*notes,label('出発点 x₀ が 要る',980,y+150,{size:28,color:C.x,anchor:'middle',weight:700}));
 return s;
}

export const ytUmConstantForceDerive1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const G=axes({x:80,y:450,w:600,h:380,xmin:0,xmax:6.4,ymin:-.27,ymax:.27,xlabel:'t',ylabel:'x',xcolor:C.t,ycolor:C.x});
  let s=G.svg;
  [[.2,0],[0,.15],[-.1,.2],[.05,-.2],[-.18,-.06]].forEach(([a,b],i)=>{s+=fade(seg(p,.05+.06*i,.2+.06*i),G.plot(fam(a,b),{color:C.faint,w:3}));});
  s+=G.plot(fam(.1,.2),{p:seg(p,.4,.75),color:C.hi,w:5});
  s+=card(730,90,430,280,tex('\\dfrac{d^2x}{dt^2}=-\\omega^2x',945,170,{size:44})
   +fade(seg(p,.5,.65),label('初めの位置 と',945,265,{size:28,color:C.ink,anchor:'middle'})+label('初めの速度 → 1本',945,315,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=card(150,40,900,420,label('前回の 最後の問い',600,90,{size:24,color:C.dim,anchor:'middle'})
   +tex('ma=F',600,200,{size:80})
   +fade(seg(p,.3,.45),label('「微分方程式」として 読むと',600,320,{size:34,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.5,.65),label('何が 決まる？',600,395,{size:42,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=ground(40,520,400)+box(210,400)+fArrow(270,355,110,{text:'4 N'});
  s+=fade(seg(p,.1,.25),tex('a=\\dfrac{4}{2}=2\\ \\mathrm{m/s^2}',280,150,{size:42}));
  const T=['0','0.5','1.0','1.5','2.0'],V=['0','1','2','3','4'],X=['0','0.25','1.00','2.25','4.00'];
  let tb=label('t [s]',680,95,{size:24,color:C.t,anchor:'middle',weight:700})+label('v [m/s]',850,95,{size:24,color:C.v,anchor:'middle',weight:700})+label('x [m]',1030,95,{size:24,color:C.x,anchor:'middle',weight:700})+line(600,112,1120,112,{color:C.faint,w:2});
  T.forEach((t,i)=>{const y=160+i*62,g=seg(p,.3+.1*i,.4+.1*i);tb+=fade(g,label(t,680,y,{size:28,color:C.t,anchor:'middle'})+label(V[i],850,y,{size:28,color:C.v,anchor:'middle',weight:700})+label(X[i],1030,y,{size:28,color:C.x,anchor:'middle',weight:700}));});
  s+=card(590,40,550,440,tb,seg(p,.2,.3));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=tex('ma=F',600,110,{size:80});
  s+=fade(seg(p,.15,.3),label('微分方程式として 読むと',600,215,{size:30,color:C.dim,anchor:'middle'}));
  s+=card(120,280,450,150,label('答えは',345,335,{size:28,color:C.ink,anchor:'middle'})+label('何に なる？',345,392,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  s+=card(630,280,450,150,label('1本に 決めるには',855,335,{size:28,color:C.ink,anchor:'middle'})+label('何が 要る？',855,392,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },

 // ===== S2 答えは関数 =====
 [K+'number']:(p)=>{
  let s=card(110,90,440,260,label('高校の 問い',330,140,{size:26,color:C.dim,anchor:'middle'})+label('「3秒後の 速度を',330,215,{size:32,color:C.ink,anchor:'middle'})+label('求めよ」',330,265,{size:32,color:C.ink,anchor:'middle'}),1);
  s+=fade(seg(p,.35,.5),arrow(580,220,690,220,{color:C.dim,w:4,head:16}));
  s+=card(720,90,380,260,label('答え',910,140,{size:26,color:C.dim,anchor:'middle'})+tex('v=\\square\\ \\mathrm{m/s}',910,230,{size:48})+label('1つの 数',910,310,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'machine']:(p)=>{
  let s=fade(seg(p,0,.2),arrow(60,250,250,250,{color:C.F,w:7,head:20})+label('力 F',110,215,{size:30,color:C.F,weight:700}));
  s+=fade(seg(p,.1,.3),rect(270,160,280,180,{fill:'#131f38',fo:1,stroke:C.hi,sw:3,rx:18})+tex('ma=F',410,262,{size:52}));
  s+=fade(seg(p,.35,.5),arrow(570,250,680,250,{color:C.dim,w:4,head:16}));
  const G=axes({x:720,y:420,w:380,h:300,xmin:0,xmax:3.2,ymin:0,ymax:10,xlabel:'t',ylabel:'x',xcolor:C.t,ycolor:C.x,g:seg(p,.45,.6)});
  s+=G.svg+G.plot(sq,{from:0,to:3,p:seg(p,.55,.85),color:C.x,w:5});
  s+=fade(seg(p,.7,.85),label('運動の 全歴史',910,475,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'history']:(p)=>{
  const G=GT();const T=mix(.4,2.8,seg(p,.1,.85)),X=sq(T);
  let s=G.svg+G.plot(sq,{from:0,to:3,color:C.x,w:5});
  s+=line(G.X(T),G.Y(0),G.X(T),G.Y(X),{color:C.t,w:3,dash:'7 6'})+line(G.X(0),G.Y(X),G.X(T),G.Y(X),{color:C.x,w:2,dash:'6 6'})+dot(G.X(T),G.Y(X),10,C.hi);
  s+=card(720,70,440,330,tex('x(t)',940,140,{size:52})
   +label(`t ＝ ${T.toFixed(1)} s`,940,220,{size:32,color:C.t,anchor:'middle',weight:700})
   +label(`x ＝ ${X.toFixed(2)} m`,940,275,{size:32,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('答え ＝ 関数',940,355,{size:34,color:C.hi,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'delta']:(p)=>{
  const G=GT();const t1=1,t2=2;
  let s=G.svg+G.plot(sq,{from:0,to:3,color:C.x,w:4});
  s+=fade(seg(p,.1,.25),dot(G.X(t1),G.Y(1),9,C.hi)+dot(G.X(t2),G.Y(4),9,C.hi)+line(G.X(t1),G.Y(1),G.X(t2),G.Y(4),{color:C.hi,w:3}));
  s+=fade(seg(p,.2,.35),line(G.X(t1),G.Y(1),G.X(t2),G.Y(1),{color:C.t,w:4})+label('Δt',(G.X(t1)+G.X(t2))/2,G.Y(1)+36,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),line(G.X(t2),G.Y(1),G.X(t2),G.Y(4),{color:C.x,w:4})+label('Δx',G.X(t2)+14,G.Y(2.5)+8,{size:28,color:C.x,weight:700}));
  s+=card(720,100,440,250,label('Δx：区間での 位置の 差',940,180,{size:30,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('Δt：その 経過時間',940,260,{size:30,color:C.t,anchor:'middle',weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'dxdt']:(p)=>{
  const G=GT();const t1=1,h=mix(1,.04,seg(p,.05,.6)),t2=t1+h;
  let s=G.svg+G.plot(sq,{from:0,to:3,color:C.x,w:4});
  const k=(sq(t2)-sq(t1))/h,L=.9;
  s+=line(G.X(t1-L),G.Y(1-k*L),G.X(t1+1.25),G.Y(1+k*1.25),{color:C.hi,w:3});
  s+=dot(G.X(t1),G.Y(1),9,C.hi)+dot(G.X(t2),G.Y(sq(t2)),8,C.hi);
  s+=card(700,70,470,340,tex('\\dfrac{\\Delta x}{\\Delta t}',800,160,{size:48})+arrow(860,160,930,160,{color:C.dim,w:3,head:12})+tex('\\dfrac{dx}{dt}=v',1040,160,{size:48})
   +fade(seg(p,.55,.7),label('d：Δ を 限りなく',935,290,{size:28,color:C.ink,anchor:'middle'})+label('小さくした 印',935,335,{size:28,color:C.ink,anchor:'middle'})),1);
  return s;
 },
 [K+'d2']:(p)=>{
  let s=tex('v=\\dfrac{dx}{dt}',600,95,{size:52})+label('位置を 1回 微分',950,105,{size:26,color:C.dim});
  const wa=texWidth('a=\\dfrac{dv}{dt}',52),wb=texWidth(`=${XDD}`,52),x0=600-(wa+wb+12)/2;
  s+=fade(seg(p,.25,.4),tex('a=\\dfrac{dv}{dt}',x0,250,{size:52,anchor:'start'})+label('速度を もう1回',950,260,{size:26,color:C.dim}));
  s+=fade(seg(p,.55,.7),tex(`=${XDD}`,x0+wa+12,250,{size:52,anchor:'start'}));
  s+=fade(seg(p,.7,.85),label('x を 2回 微分した もの',600,420,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notsq']:(p)=>{
  const e2='=\\dfrac{d}{dt}\\Bigl(\\dfrac{d}{dt}\\,x\\Bigr)',w1=texWidth(XDD,84),w2=texWidth(e2,56),x0=600-(w1+w2+24)/2;
  let s=tex(XDD,x0,200,{size:84,anchor:'start'});
  s+=fade(seg(p,.1,.25),tex(e2,x0+w1+24,200,{size:56,anchor:'start'}));
  s+=card(120,330,450,130,label('○ 時間で 2回 微分',345,382,{size:32,color:C.F,anchor:'middle',weight:700})+label('（回数の 印）',345,430,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.45),C.F);
  s+=card(630,330,450,130,label('x を 2乗 ではない',855,405,{size:32,color:C.a,anchor:'middle',weight:700})+ng(1020,408),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'ode']:(p)=>{
  let s=tex('ma=F',600,85,{size:56});
  s+=fade(seg(p,.1,.25),arrow(600,130,600,190,{color:C.dim,w:3,head:12})+label('a ＝ d²x/dt²',630,172,{size:24,color:C.dim}));
  const f=`m${XDD}=F`;
  s+=fade(seg(p,.2,.4),tex(f,600,285,{size:66}));
  s+=highlight(600-texWidth(f,66)/2+texWidth('m',66)-4,196,texWidth(XDD,66)+14,170,seg(p,.55,.7),C.x);
  s+=fade(seg(p,.6,.75),label('未知：位置の 関数 x(t)',600,445,{size:34,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'solve']:(p)=>{
  let s=tex(`m${XDD}=F`,600,95,{size:52});
  s+=card(120,180,960,120,label('微分方程式 ＝ 未知の 関数の 微分を 含む 式',600,252,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(120,330,960,120,label('解く ＝ 式を 満たす x(t) を 見つける',600,402,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'try']:(p)=>{
  let s=ground(40,520,400)+box(210,400)+fArrow(270,355,110,{text:'4 N'});
  s+=card(600,50,540,400,tex(`2\\,${XDD}=4`,870,125,{size:50})
   +fade(seg(p,.3,.45),tex('x=t^2',870,280,{size:56}))
   +fade(seg(p,.45,.6),label('満たす？',870,385,{size:38,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  s+=fade(seg(p,.35,.5),label('表から 見つけた 関数',870,222,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=tex('x=t^2',220,90,{size:48});
  s+=fade(seg(p,.05,.2),arrow(330,90,410,90,{color:C.dim,w:3,head:12})+label('微分',370,62,{size:22,color:C.dim,anchor:'middle'})+tex('\\dfrac{dx}{dt}=2t',560,90,{size:48}));
  s+=fade(seg(p,.2,.35),arrow(700,90,780,90,{color:C.dim,w:3,head:12})+label('微分',740,62,{size:22,color:C.dim,anchor:'middle'})+tex(`${XDD}=2`,930,90,{size:48}));
  const c1=`m${XDD}=2\\times 2=4`,cw1=texWidth(c1,54),cw2=texWidth('=F',54),cx0=600-(cw1+cw2+60)/2;
  s+=fade(seg(p,.45,.6),tex(c1,cx0,260,{size:54,anchor:'start'}));
  s+=fade(seg(p,.6,.75),tex('=F',cx0+cw1+24,260,{size:54,anchor:'start'})+ok(cx0+cw1+cw2+38,272));
  s+=fade(seg(p,.7,.85),label('単位：kg × m/s² ＝ N',600,420,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'table']:(p)=>{
  const G=GT();
  let s=G.svg+G.plot(sq,{from:0,to:3,color:C.x,w:4});
  [.5,1,1.5,2].forEach((t,i)=>{s+=fade(seg(p,.05+.07*i,.15+.07*i),dot(G.X(t),G.Y(sq(t)),9,C.v));});
  s+=fade(seg(p,.15,.3),label('表の 点',G.X(1.5)+18,G.Y(2.25)+30,{size:24,color:C.v,weight:700}));
  const T=2.7,X=7.29;
  s+=fade(seg(p,.45,.6),line(G.X(T),G.Y(0),G.X(T),G.Y(X),{color:C.t,w:3,dash:'7 6'})+line(G.X(0),G.Y(X),G.X(T),G.Y(X),{color:C.x,w:2,dash:'6 6'})+dot(G.X(T),G.Y(X),11,C.hi));
  s+=card(720,110,440,240,label('表に 無い 時刻',940,165,{size:26,color:C.dim,anchor:'middle'})+tex('2.7^2=7.29\\ \\mathrm{m}',940,245,{size:46})+label('t ＝ 2.7 s',940,320,{size:28,color:C.t,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },

 // ===== S3 ベクトルの式は束 =====
 [K+'vec']:(p)=>{
  const ox=120,oy=430,bx=380,by=200;
  let s=line(ox-20,oy,ox+420,oy,{color:C.faint,w:2})+line(ox,oy+20,ox,oy-330,{color:C.faint,w:2})+dot(ox,oy,7,C.dim);
  s+=fade(seg(p,.1,.25),arrow(ox,oy,bx-14,by+12,{color:C.x,w:5,head:16})+label('𝐫',(ox+bx)/2-34,(oy+by)/2,{size:34,color:C.x,weight:700}));
  s+=ring(bx,by,16,{color:C.ink,w:2.5,fill:'#39475f'});
  s+=fade(seg(p,.2,.35),arrow(bx,by+18,bx+50,by+120,{color:C.F,w:6,head:18})+label('𝐅',bx+62,by+120,{size:34,color:C.F,weight:700}));
  s+=fade(seg(p,.3,.5),tex(`m\\dfrac{d^2${R_}}{dt^2}=${FB}`,850,200,{size:66}));
  s+=fade(seg(p,.6,.75),label('𝐫：位置ベクトル',850,360,{size:32,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bundle']:(p)=>{
  let s=tex(`m\\dfrac{d^2${R_}}{dt^2}=${FB}`,230,250,{size:52})+label('1本',230,360,{size:30,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.1,.25),arrow(420,250,510,250,{color:C.dim,w:4,head:14}));
  const rows=[`m${XDD}=F_x`,`m${YDD}=F_{${Y_}}`,`m${ZDD}=F_{${Z_}}`];
  rows.forEach((r,i)=>{s+=fade(seg(p,.2+.12*i,.32+.12*i),tex(r,800,105+i*145,{size:44}));});
  s+=fade(seg(p,.6,.75),label('成分の 式 3本の 束',800,495,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ball']:(p)=>{
  const ox=110,oy=430,f=u=>[ox+60+u*520,oy-60-(1.6*u-1.6*u*u)*340];
  let s=arrow(ox-20,oy,ox+640,oy,{color:C.dim,w:2.5,head:14})+arrow(ox,oy+20,ox,oy-340,{color:C.dim,w:2.5,head:14});
  s+=label('x（水平 右向き）',ox+560,oy+40,{size:24,color:C.x,anchor:'middle'})+label('y（上向き）',ox+14,oy-340,{size:24,color:C.x});
  const u=mix(0,1,seg(p,.2,.9));
  s+=draw(Array.from({length:61},(_,i)=>f(u*i/60)),1,{color:C.dim,w:3,dash:'8 7'});
  const [bx,by]=f(u);s+=ring(bx,by,16,{color:C.ink,w:2.5,fill:'#39475f'});
  s+=card(820,120,340,200,label('空気抵抗は',990,190,{size:28,color:C.ink,anchor:'middle'})+label('無視',990,245,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'forces']:(p)=>{
  const ox=110,oy=430,bx=ox+320,by=oy-270;
  let s=arrow(ox-20,oy,ox+640,oy,{color:C.dim,w:2.5,head:14})+arrow(ox,oy+20,ox,oy-340,{color:C.dim,w:2.5,head:14});
  s+=label('x',ox+660,oy+8,{size:26,color:C.x})+label('y',ox+14,oy-340,{size:26,color:C.x});
  s+=ring(bx,by,16,{color:C.ink,w:2.5,fill:'#39475f'});
  s+=fade(seg(p,.1,.25),arrow(bx,by+18,bx,by+150,{color:C.F,w:7,head:20})+label('mg',bx+16,by+130,{size:32,color:C.F,weight:700}));
  s+=card(820,120,340,220,label('重力 mg だけ',990,190,{size:30,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('g：重力加速度',990,255,{size:26,color:C.a,anchor:'middle'})+label('約 9.8 m/s²',990,300,{size:28,color:C.a,anchor:'middle',weight:700})),seg(p,.15,.3));
  return s;
 },
 [K+'comps']:(p)=>{
  const ox=110,oy=430,bx=ox+320,by=oy-270;
  let s=arrow(ox-20,oy,ox+640,oy,{color:C.dim,w:2.5,head:14})+arrow(ox,oy+20,ox,oy-340,{color:C.dim,w:2.5,head:14});
  s+=label('x',ox+660,oy+8,{size:26,color:C.x})+label('y',ox+14,oy-340,{size:26,color:C.x});
  s+=ring(bx,by,16,{color:C.ink,w:2.5,fill:'#39475f'})+arrow(bx,by+18,bx,by+150,{color:C.F,w:7,head:20})+label('mg',bx+16,by+130,{size:32,color:C.F,weight:700});
  s+=card(800,70,370,380,label('上向きが 正',985,125,{size:26,color:C.dim,anchor:'middle'})+tex(`F_{${Y_}}=-mg`,985,195,{size:46})
   +fade(seg(p,.5,.65),label('水平の 力 なし',985,295,{size:26,color:C.dim,anchor:'middle'})+tex('F_x=0',985,365,{size:46})),1);
  return s;
 },
 [K+'rows']:(p)=>{
  let s=label('x の 列',330,70,{size:32,color:C.x,anchor:'middle',weight:700})+label('y の 列',870,70,{size:32,color:C.x,anchor:'middle',weight:700});
  s+=line(600,40,600,470,{color:C.faint,w:3})+line(60,100,1140,100,{color:C.faint,w:2});
  s+=label('力',330,165,{size:26,color:C.dim,anchor:'middle'})+label('力',870,165,{size:26,color:C.dim,anchor:'middle'});
  s+=tex('F_x=0',330,225,{size:44})+tex(`F_{${Y_}}=-mg`,870,225,{size:44});
  s+=fade(seg(p,.3,.5),tex(`m${XDD}=0`,330,370,{size:46}));
  s+=fade(seg(p,.55,.75),tex(`m${YDD}=-mg`,870,370,{size:46}));
  return s;
 },
 [K+'divide']:(p)=>{
  let s=label('x の 列',330,70,{size:32,color:C.x,anchor:'middle',weight:700})+label('y の 列',870,70,{size:32,color:C.x,anchor:'middle',weight:700});
  s+=line(600,40,600,470,{color:C.faint,w:3})+line(60,100,1140,100,{color:C.faint,w:2});
  s+=tex(`m${XDD}=0`,330,185,{size:42})+tex(`m${YDD}=-mg`,870,185,{size:42});
  s+=fade(seg(p,.05,.2),label('÷ m',330,285,{size:28,color:C.hi,anchor:'middle',weight:700})+label('÷ m',870,285,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.35),tex(`${XDD}=0`,330,380,{size:50}));
  s+=fade(seg(p,.25,.45),tex(`${YDD}=-${G_}`,870,380,{size:50}));
  s+=card(350,440,500,60,label('m が 消える → 重さに よらない',600,480,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'indep']:(p)=>{
  let s=card(80,60,480,260,label('横（x）',320,115,{size:30,color:C.x,anchor:'middle',weight:700})+tex(`${XDD}=0`,320,215,{size:46}),1,C.x);
  s+=card(640,60,480,260,label('縦（y）',880,115,{size:30,color:C.x,anchor:'middle',weight:700})+tex(`${YDD}=-${G_}`,880,215,{size:46}),1,C.x);
  s+=fade(seg(p,.15,.3),label('もう一方の 成分は 入らない',600,370,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),ring(330,445,26,{color:C.t,w:3})+line(330,445,330,428,{color:C.t,w:3})+line(330,445,344,452,{color:C.t,w:3})+label('時計 t は 共通 → 別々に 解ける',650,455,{size:30,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(80,70,480,360,label('法則',320,125,{size:30,color:C.F,anchor:'middle',weight:700})+tex('ma=F',320,225,{size:60})+label('実験に 支えられた',320,320,{size:28,color:C.ink,anchor:'middle'})+label('（初級で 扱った）',320,370,{size:24,color:C.dim,anchor:'middle'}),seg(p,0,.15),C.F);
  return s;
 },
 [K+'model']:(p)=>{
  let s=card(80,70,480,360,label('法則',320,125,{size:30,color:C.F,anchor:'middle',weight:700})+tex('ma=F',320,225,{size:60})+label('実験に 支えられた',320,320,{size:28,color:C.ink,anchor:'middle'})+label('（初級で 扱った）',320,370,{size:24,color:C.dim,anchor:'middle'}),1,C.F);
  s+=card(640,70,480,360,label('仮定：重力だけ',880,125,{size:30,color:C.hi,anchor:'middle',weight:700})+tex(`F_{${Y_}}=-mg`,880,225,{size:52})+label('この 問題の 力',880,320,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('空気抵抗 → ここが 変わる',880,375,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2),C.hi);
  return s;
 },

 // ===== S4 同じ式、違う運動 =====
 [K+'same']:(p)=>{
  let s=tex(`${YDD}=-${G_}`,600,95,{size:56});
  const mini=(x,up,g)=>{let q=up?ring(x,375,16,{color:C.ink,w:2.5,fill:'#39475f'})+arrow(x,352,x,272,{color:C.v,w:5,head:16}):line(x-40,272,x+20,272,{color:C.dim,w:6})+ring(x,296,16,{color:C.ink,w:2.5,fill:'#39475f'})+line(x,320,x,375,{color:C.dim,w:3,dash:'6 6'});return fade(g,q);};
  s+=card(140,180,420,280,label('手から 落とす',350,220,{size:28,color:C.ink,anchor:'middle',weight:700})+mini(350,0,1)+label('空中では 重力だけ',350,420,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  s+=card(640,180,420,280,label('真上に 投げ上げる',850,220,{size:28,color:C.ink,anchor:'middle',weight:700})+mini(850,1,1)+label('空中では 重力だけ',850,420,{size:24,color:C.dim,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=tex(`${YDD}=-${G_}`,600,110,{size:56});
  s+=card(230,230,740,150,label('同じ 式 → 同じ 動き？',600,318,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'three']:(p)=>{
  const t=3*seg(p,.15,.95);
  let s=world({t});
  s+=card(840,70,330,300,label('① 崖から 落とす',1005,130,{size:26,color:C.ink,anchor:'middle'})+label('② 横に 投げる',1005,200,{size:26,color:C.ink,anchor:'middle'})+label('③ 真上に 投げ上げる',1005,270,{size:26,color:C.ink,anchor:'middle'}),1);
  s+=fade(seg(p,.8,.95),label('動きは まるで 違う',1005,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'accel']:(p)=>{
  const t=mix(3,1,seg(p,0,.15));
  let s=world({t,acc:seg(p,.2,.35)});
  s+=card(840,70,330,300,label('どの 瞬間も',1005,130,{size:26,color:C.ink,anchor:'middle'})+label('加速度は',1005,180,{size:26,color:C.ink,anchor:'middle'})+label('下向きに 同じ g',1005,240,{size:30,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),tex(`${YDD}=-${G_}`,1005,320,{size:36})),seg(p,.2,.35));
  return s;
 },
 [K+'start']:(p)=>{
  let s=world({t:0,trace:0,pos:seg(p,.1,.25),vel:seg(p,.3,.45)});
  s+=fade(seg(p,.3,.45),label('① v₀ ＝ 0',WX(-2.6)-12,WY(20)+8,{size:24,color:C.v,weight:700,anchor:'end'}));
  s+=card(840,70,330,330,label('違うのは',1005,125,{size:26,color:C.ink,anchor:'middle'})+label('t ＝ 0 の',1005,170,{size:28,color:C.t,anchor:'middle',weight:700})
   +label('位置（矢印）',1005,235,{size:28,color:C.x,anchor:'middle',weight:700})+fade(seg(p,.3,.45),label('速度（矢印）',1005,290,{size:28,color:C.v,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('式は 出発点を 知らない',1005,360,{size:24,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'why2']:(p)=>{
  let s=label('方程式が 教えるのは 加速度だけ',600,60,{size:30,color:C.ink,anchor:'middle'});
  s+=chain(p,{g1:seg(p,.25,.4),g2:seg(p,.5,.65),notes:0});
  s+=fade(seg(p,.7,.85),label('2段 さかのぼる',600,410,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'two']:(p)=>{
  let s=label('方程式が 教えるのは 加速度だけ',600,60,{size:30,color:C.ink,anchor:'middle'});
  s+=chain(p,{g1:1,g2:1,notes:0});
  s+=fade(seg(p,.05,.2),label('出発点 v₀ が 要る',600,300,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label('出発点 x₀ が 要る',980,300,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=card(220,360,760,110,label('初めの 位置 と 初めの 速度 → 2つ',600,428,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'recipe']:(p)=>{
  const inp=(y,t,c,g)=>fade(g,rect(40,y,300,80,{fill:'#131f38',fo:1,stroke:c,sw:3,rx:14})+label(t,190,y+50,{size:28,color:c,anchor:'middle',weight:700})+arrow(345,y+40,420,250,{color:C.dim,w:3,head:12}));
  let s=inp(80,'① 力 F',C.F,seg(p,0,.12))+inp(210,'② 初めの 位置 x₀',C.x,seg(p,.25,.37))+inp(340,'③ 初めの 速度 v₀',C.v,seg(p,.32,.44));
  s+=fade(seg(p,.1,.22),rect(430,170,230,160,{fill:'#131f38',fo:1,stroke:C.hi,sw:3,rx:18})+tex('ma=F',545,262,{size:48}));
  s+=fade(seg(p,.5,.6),arrow(670,250,740,250,{color:C.dim,w:4,head:16}));
  const G=axes({x:780,y:410,w:340,h:280,xmin:0,xmax:3.2,ymin:0,ymax:10,xlabel:'t',ylabel:'x',xcolor:C.t,ycolor:C.x,g:seg(p,.55,.65)});
  s+=G.svg+G.plot(sq,{from:0,to:3,p:seg(p,.6,.85),color:C.x,w:5});
  s+=fade(seg(p,.75,.9),label('x(t)：運動の 全歴史',950,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S5 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(80,15,1040,175,label('ma＝F は 位置の 関数 x(t) を 探す 微分方程式',600,58,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`m${XDD}=F`,480,140,{size:38})+label('2 ＝ 2回 微分',820,148,{size:26,color:C.hi,anchor:'middle',weight:700}),1);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,15,1040,175,label('ma＝F は 位置の 関数 x(t) を 探す 微分方程式',600,58,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`m${XDD}=F`,480,140,{size:38})+label('2 ＝ 2回 微分',820,148,{size:26,color:C.hi,anchor:'middle',weight:700}),1);
  s+=card(80,200,1040,160,label('ベクトルの 式 ＝ 成分の 束（重力だけ）',600,238,{size:28,color:C.ink,anchor:'middle',weight:700})+tex(`${XDD}=0,\\qquad ${YDD}=-${G_}`,600,310,{size:38}),seg(p,.05,.2));
  s+=card(80,375,1040,110,label('1本に 決める：初めの 位置 と 初めの 速度',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'how']:(p)=>{
  let s=tex(`m${XDD}=F`,600,120,{size:66});
  s+=card(300,250,600,170,label('F が 一定 なら',600,310,{size:32,color:C.F,anchor:'middle',weight:700})+label('実際に どう 解く？',600,375,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.3),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s=ground(40,620,400)+box(200,400,{text:'m'})+fArrow(260,355,120,{text:'一定の 力'});
  s+=fade(seg(p,.2,.35),ring(470,200,40,{color:C.t,w:3})+line(470,200,470,172,{color:C.t,w:3})+line(470,200,492,212,{color:C.t,w:3})+label('3秒後',540,212,{size:30,color:C.t,weight:700}));
  s+=card(700,110,440,260,label('次の問い',920,160,{size:26,color:C.dim,anchor:'middle'})+tex('v=\\ ?',920,250,{size:60})+label('どう 求まる？',920,330,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
};
