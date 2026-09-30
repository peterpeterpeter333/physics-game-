// YouTube シリーズ「積分・中級 1/3」(ys-um-sum-to-integral-1) — 図。Stage 1200×515.
// 色：高さ f(xᵢ)（例では速度）紫、幅 Δx（例では時間）金、面積・合計（距離）水色、番号 i 黄、欠け 赤、正しい値 緑。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,poly,draw} from './anim.mjs';

const K='um-sum-to-integral-1:';
export const cc=(col,s)=>`{\\color{${col}}{${s}}}`;
export const cV=s=>cc(C.v,s),cT=s=>cc(C.t,s),cX=s=>cc(C.x,s),cH=s=>cc(C.hi,s),cI=s=>cc(C.ink,s);
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

// graph of f(x)=x on 0..4. mode: 0 = physics labels (時刻 t, 速度 v), 1 = math labels (x, f(x)); in between = crossfade
export function G({mode=1,g=1,x=100,y=445,w=500,h=340,xmax=4.6,ymax=4.8,yticks=[1,2,3,4],xticks=[1,2,3,4]}={}){
 const A=axes({x,y,w,h,xmax,ymax,xticks,yticks,grid:true,g,xlabel:'',ylabel:''});
 const lx=x+w+36,ly=A.Y(0)+8,tx=A.X(0),ty=y-h-44;
 let s=A.svg;
 s+=fade(g*(1-mode),label('時刻 t [s]',lx-40,ly+44,{size:24,color:C.t})+label('速度 v [m/s]',tx,ty,{size:24,color:C.v,anchor:'middle'}));
 s+=fade(g*mode,label('x',lx,ly,{size:28,color:C.t})+label('f(x)',tx,ty,{size:28,color:C.v,anchor:'middle'}));
 return {...A,svg:s};
}
export const fline=(A,p=1,o={})=>A.plot(x=>x,{from:0,to:4.35,p,color:C.v,w:4,...o});
// left-end strips for n equal parts of [0,4]; each strip grows upward with g (or gi(i) per strip)
export function strips(A,n,{g=1,gi=null,fo=.3,color=C.x,sw=null,hl=-1,from=0,to=4}={}){
 const d=(to-from)/n;let s='';
 for(let i=0;i<n;i++){
  const u=gi?gi(i):g;if(u<=0.001)continue;
  const x0=from+i*d,hgt=x0*clamp(u),X0=A.X(x0),X1=A.X(x0+d);
  const top=A.Y(hgt),bot=A.Y(0);
  const col=i===hl?C.hi:color;
  s+=rect(X0,top,X1-X0,bot-top,{fill:col,fo:i===hl?.35:fo,stroke:col,sw:sw??(n>20?1:2),rx:1});
  if(hgt<1e-6)s+=line(X0,bot,X1,bot,{color:col,w:4});
 }
 return s;
}
// right-end strips (for 2/3)
export function stripsR(A,n,{g=1,fo=.25,color=C.E}={}){
 const d=4/n;let s='';
 for(let i=0;i<n;i++){const x0=i*d,hgt=(x0+d)*clamp(g);s+=rect(A.X(x0),A.Y(hgt),A.X(x0+d)-A.X(x0),A.Y(0)-A.Y(hgt),{fill:color,fo,stroke:color,sw:n>20?1:2,rx:1});}
 return s;
}
// red missing triangles above left-end strips
export function gaps(A,n,{g=1,color=C.a,fo=.55}={}){
 const d=4/n;let s='';
 for(let i=0;i<n;i++){const x0=i*d;s+=poly([[A.X(x0),A.Y(x0)],[A.X(x0+d),A.Y(x0)],[A.X(x0+d),A.Y(x0+d)]],{fill:color,fo:fo*g,stroke:color,sw:g>0.01?1.5:0});}
 return fade(g,s);
}
export const bigTri=(A,{g=1,color=C.x,fo=.3,dash=''}={})=>fade(g,poly([[A.X(0),A.Y(0)],[A.X(4),A.Y(0)],[A.X(4),A.Y(4)]],{fill:color,fo,stroke:dash?'none':color,sw:2})+(dash?draw([[A.X(0),A.Y(0)],[A.X(4),A.Y(4)],[A.X(4),A.Y(0)]],1,{color,w:3,dash}):''));
// tick marks dividing [0,4] into n parts on the x axis
function divTicks(A,n,g=1,color=C.t){let s='';for(let i=0;i<=n;i++){const X=A.X(4*i/n);s+=line(X,A.Y(0)-12,X,A.Y(0)+12,{color,w:3});}return fade(g,s);}
// width marker: a thick gold bar on the axis and a label just above the axis inside the strip
export const widthMark=(A,x0,x1,text,g=1)=>fade(g,line(A.X(x0),A.Y(0),A.X(x1),A.Y(0),{color:C.t,w:7})+label(text,(A.X(x0)+A.X(x1))/2,A.Y(0)-12,{size:24,color:C.t,anchor:'middle',weight:700}));
const badge=(x,y,t,col=C.hi,g=1)=>fade(g,ring(x,y,17,{color:col,w:2.5,fill:'#0b1122'})+label(t,x,y+8,{size:22,color:col,anchor:'middle',weight:700}));
const ok=C.F,bad=C.a;
const Sn=n=>8-8/n;

export const ytUmSumInt1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=card(90,90,450,300,label('前回（微分・中級）',315,145,{size:26,color:C.dim,anchor:'middle'})
   +T(cX('x')+'='+cT('t')+'^2',315,215,{size:50})
   +arrow(315,250,315,300,{color:C.dim,w:4})+label('各時刻の 傾き',420,285,{size:24,color:C.dim,anchor:'middle'})
   +T('2'+cT('t'),315,355,{size:50,color:C.v}),seg(p,0,.2));
  return s;
 },
 [K+'question']:(p)=>{
  let s=card(90,90,450,300,label('前回（微分・中級）',315,145,{size:26,color:C.dim,anchor:'middle'})
   +label('位置の式',315,220,{size:32,color:C.x,anchor:'middle',weight:700})
   +arrow(315,250,315,300,{color:C.dim,w:4})+label('傾き（速度）の式',315,355,{size:32,color:C.v,anchor:'middle',weight:700}));
  s+=card(660,90,450,300,label('今回（積分・中級）',885,145,{size:26,color:C.hi,anchor:'middle'})
   +label('速度の式',885,220,{size:32,color:C.v,anchor:'middle',weight:700})
   +arrow(885,250,885,300,{color:C.hi,w:4})+label('進んだ距離の式 ？',885,355,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.15,.35),C.hi);
  s+=fade(seg(p,.4,.55),label('逆向き',600,250,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'example']:(p)=>{
  const A=G({mode:0,g:seg(p,0,.15)});let s=A.svg+fline(A,seg(p,.1,.45));
  s+=fade(seg(p,.35,.5),T(cV('v')+'='+cT('t'),A.X(1.6),A.Y(3.9),{size:44}));
  const rows=[0,1,2,3,4];let t=label('t [s]',730,200,{size:26,color:C.t})+label('v [m/s]',730,270,{size:26,color:C.v});
  rows.forEach((v,i)=>{t+=label(String(v),860+i*62,200,{size:28,color:C.t,anchor:'middle'})+label(String(v),860+i*62,270,{size:28,color:C.v,anchor:'middle'});});
  s+=card(710,140,460,170,t,seg(p,.5,.65));
  s+=fade(seg(p,.7,.85),label('1秒ごとに ＋1 m/s',940,370,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'triangle']:(p)=>{
  const A=G({mode:0});let s=A.svg+bigTri(A,{g:seg(p,.1,.3)})+fline(A);
  s+=fade(seg(p,.2,.35),label('面積 ＝ 進んだ距離',940,170,{size:30,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),widthMark(A,0,4,'4 s')+label('4 m/s',A.X(4)+14,A.Y(2)+8,{size:24,color:C.v}));
  s+=fade(seg(p,.55,.75),T('\\tfrac12\\times'+cT('4')+'\\times'+cV('4')+'='+cX('8\\,\\mathrm{m}'),940,280,{size:48}));
  return s;
 },
 [K+'curve']:(p)=>{
  const A=G({mode:0}),fc=t=>.15*t*t+.4*t;
  let s=A.svg+fade(1-seg(p,.05,.3),bigTri(A)+fline(A));
  const pts=[[A.X(0),A.Y(0)]];for(let i=0;i<=60;i++){const t=4*i/60;pts.push([A.X(t),A.Y(fc(t))]);}pts.push([A.X(4),A.Y(0)]);
  s+=fade(seg(p,.15,.35),poly(pts,{fill:C.x,fo:.18})+A.plot(fc,{from:0,to:4.3,color:C.v,w:4}));
  s+=fade(seg(p,.3,.45),label('曲がったグラフ',940,160,{size:30,color:C.v,anchor:'middle'})+label('？ m',A.X(2.9),A.Y(.9),{size:34,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('三角形の公式 ✕',940,230,{size:30,color:bad,anchor:'middle',weight:700}));
  s+=card(720,290,440,120,label('どんなグラフにも使える',940,338,{size:28,color:C.ink,anchor:'middle'})+label('手順 を 記号で',940,385,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 // ===== S2 部品と範囲 =====
 [K+'piece']:(p)=>{
  const A=G({mode:0});let s=A.svg+fade(.35,bigTri(A,{fo:.12}))+fline(A);
  const g=seg(p,.05,.25);
  s+=fade(g,rect(A.X(2),A.Y(2),A.X(3)-A.X(2),A.Y(0)-A.Y(2),{fill:C.x,fo:.4,stroke:C.x,sw:2.5,rx:1}));
  s+=fade(seg(p,.3,.45),line(A.X(2)-14,A.Y(2),A.X(2)-14,A.Y(0),{color:C.v,w:5})+label('高さ',A.X(2)-24,A.Y(1)+8,{size:26,color:C.v,anchor:'end',weight:700}));
  s+=widthMark(A,2,3,'幅',seg(p,.55,.7));
  s+=card(720,120,440,250,label('部品 ＝ 細い長方形 1本',940,175,{size:30,color:C.x,anchor:'middle',weight:700})+label('（短冊）',940,215,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.45),label('高さ：その場所での値',760,280,{size:28,color:C.v}))+fade(seg(p,.55,.7),label('幅：その区間の長さ',760,335,{size:28,color:C.t})),seg(p,.05,.2));
  return s;
 },
 [K+'unit']:(p)=>{
  const A=G({mode:0});let s=A.svg+fade(.35,bigTri(A,{fo:.12}))+fline(A);
  s+=rect(A.X(2),A.Y(2),A.X(3)-A.X(2),A.Y(0)-A.Y(2),{fill:C.x,fo:.4,stroke:C.x,sw:2.5,rx:1});
  s+=line(A.X(2)-14,A.Y(2),A.X(2)-14,A.Y(0),{color:C.v,w:5})+label('高さ',A.X(2)-24,A.Y(1)+8,{size:26,color:C.v,anchor:'end',weight:700})+widthMark(A,2,3,'幅');
  s+=fade(seg(p,.05,.3),T(cV('\\mathrm{\\dfrac{m}{s}}')+'\\times'+cT('\\mathrm{s}')+'='+cX('\\mathrm{m}'),940,210,{size:56}));
  s+=fade(seg(p,.25,.4),label('高さ（速度）',790,300,{size:24,color:C.v,anchor:'middle'})+label('幅（時間）',950,300,{size:24,color:C.t,anchor:'middle'})+label('距離',1090,300,{size:24,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),label('短冊 1本 ＝ その区間で進む距離の',940,390,{size:28,color:C.x,anchor:'middle'})+label('見積もり',940,432,{size:30,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fx']:(p)=>{
  const m=seg(p,.1,.4),A=G({mode:m});let s=A.svg+fline(A);
  s+=fade(seg(p,.35,.5),T(cV('f(x)')+'='+cT('x'),A.X(1.6),A.Y(3.9),{size:40}));
  s+=card(720,130,440,260,
   label('横軸の変数',760,185,{size:26,color:C.dim})+T(cT('x'),1080,178,{size:40})
   +label('その場所の高さ',760,245,{size:26,color:C.dim})+T(cV('f(x)'),1080,238,{size:40})
   +fade(seg(p,.6,.75),label('例：x ＝ 時刻 [s]',760,315,{size:26,color:C.t})+label('　　f(x) ＝ x ＝ 速度 [m/s]',760,358,{size:26,color:C.v})),seg(p,.1,.3));
  return s;
 },
 [K+'range']:(p)=>{
  const A=G();let s=A.svg+fline(A);
  s+=fade(seg(p,.05,.25),rect(A.X(0),A.Y(4.6),A.X(4)-A.X(0),A.Y(0)-A.Y(4.6),{fill:C.hi,fo:.06,stroke:'none'}));
  s+=fade(seg(p,.35,.5),line(A.X(0),A.Y(0),A.X(0),A.Y(4.5),{color:C.hi,w:3,dash:'8 8'})+label('a',A.X(0)+14,A.Y(4.3),{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.6),line(A.X(4),A.Y(0),A.X(4),A.Y(4.5),{color:C.hi,w:3,dash:'8 8'})+label('b',A.X(4)+14,A.Y(4.3),{size:30,color:C.hi,weight:700}));
  s+=card(720,130,440,240,label('足し合わせる範囲',940,180,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('左端 a（下端）',760,245,{size:28,color:C.hi}))+fade(seg(p,.45,.6),label('右端 b（上端）',760,295,{size:28,color:C.hi}))
   +fade(seg(p,.7,.85),label('例：a ＝ 0、b ＝ 4',760,345,{size:28,color:C.t})),seg(p,.05,.2));
  return s;
 },
 [K+'split']:(p)=>{
  const A=G();let s=A.svg+fline(A);
  s+=fade(seg(p,.05,.2),brace(A.X(0),A.X(4),A.Y(4.5)-10,{dir:-1,text:'全体の長さ b − a',color:C.t,size:24}));
  s+=divTicks(A,4,seg(p,.35,.5));
  s+=card(720,150,440,200,label('同じ幅の n 個に 分ける',940,215,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.6,.75),label('n ＝ 区間の個数',940,290,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'dx']:(p)=>{
  const A=G();let s=A.svg+fline(A)+divTicks(A,4);
  s+=widthMark(A,1,2,'Δx',seg(p,.4,.55));
  s+=fade(seg(p,.05,.3),T(cT('\\Delta x')+'=\\dfrac{'+cT('b-a')+'}{n}',940,220,{size:66}));
  s+=fade(seg(p,.3,.45),label('全体の長さ',1000,300,{size:24,color:C.t,anchor:'start'})+label('÷ 個数',1000,340,{size:24,color:C.dim,anchor:'start'}));
  return s;
 },
 [K+'dxnum']:(p)=>{
  const u=seg(p,.45,.6),A=G();let s=A.svg+fline(A)+fade(1-u,divTicks(A,4))+fade(u,divTicks(A,8));
  s+=card(700,120,480,300,
   label('n ＝ 4',720,200,{size:26,color:C.dim})+T(cT('\\Delta x')+'=\\dfrac{4-0}{4}='+cT('1'),822,195,{size:40,anchor:'start'})
   +fade(seg(p,.45,.6),label('n ＝ 8',720,305,{size:26,color:C.dim})+T(cT('\\Delta x')+'=\\dfrac{4-0}{8}='+cT('0.5'),822,300,{size:40,anchor:'start'}))
   +fade(seg(p,.75,.9),label('n を増やす → 幅は 狭く',940,395,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=label('確認',600,90,{size:30,color:C.hi,anchor:'middle',weight:700});
  const X=v=>200+(v-1)*200;
  s+=line(X(.7),250,X(5.3),250,{color:C.dim,w:3});
  for(let v=1;v<=5;v++)s+=line(X(v),238,X(v),262,{color:C.dim,w:3})+label(String(v),X(v),298,{size:26,color:C.t,anchor:'middle'});
  s+=fade(seg(p,.2,.4),Array.from({length:9},(_,i)=>line(X(1+i*.5),232,X(1+i*.5),268,{color:C.t,w:3})).join('')+label('8 等分',600,200,{size:28,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),brace(X(1),X(1.5),330,{dir:1,text:'幅 ？',color:C.hi,size:28}));
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=label('確認',600,70,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.02,.25),T(cT('\\Delta x')+'=\\dfrac{5-1}{8}='+cT('0.5'),600,175,{size:56})+label('○',880,185,{size:40,color:ok,weight:700}));
  s+=card(250,280,700,170,T('\\dfrac{8}{4}=2',400,370,{size:50})+label('✕',490,378,{size:38,color:bad,weight:700})
   +label('長さ 1 あたりの',540,350,{size:28,color:C.dim})+label('区間の個数（幅ではない）',540,400,{size:28,color:C.dim}),seg(p,.4,.55),bad);
  return s;
 },
 // ===== S3 高さを測る点 =====
 [K+'which']:(p)=>{
  const A=G();let s=A.svg+divTicks(A,4)+fline(A);
  s+=fade(seg(p,.05,.2),rect(A.X(1),A.Y(4.5),A.X(2)-A.X(1),A.Y(0)-A.Y(4.5),{fill:C.hi,fo:.07,stroke:'none'}));
  [[1,'左端'],[1.5,'真ん中'],[2,'右端']].forEach(([x,t],i)=>{const g=seg(p,.25+i*.1,.35+i*.1);s+=fade(g,dot(A.X(x),A.Y(x),9,C.hi)+line(A.X(x),A.Y(x),A.X(x),A.Y(0),{color:C.hi,w:2,dash:'6 6'}));});
  s+=fade(seg(p,.55,.7),arrow(A.X(1)+6,A.Y(1)-30,A.X(2)-6,A.Y(2)-30,{color:C.v,w:4,head:14})+label('区間の中でも変わる',A.X(1.2),A.Y(3.3),{size:24,color:C.v,anchor:'middle'}));
  s+=card(720,150,440,190,label('高さは、区間の',940,215,{size:30,color:C.ink,anchor:'middle'})+label('どこで測る？',940,275,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'xi']:(p)=>{
  const A=G();let s=A.svg+divTicks(A,4)+fline(A);
  const u=[.35,.6,.25,.7];
  [0,1,2,3].forEach(i=>{const g=seg(p,.1+i*.08,.2+i*.08),x=i+u[i];s+=badge(A.X(i+.5),A.Y(0)+62,String(i+1),C.hi,g)+fade(g,dot(A.X(x),A.Y(0),8,C.t)+label(`x${'₁₂₃₄'[i]}`,A.X(x),A.Y(0)-16,{size:24,color:C.t,anchor:'middle'}));});
  s+=card(720,140,440,230,label('i ＝ 区間の番号',760,200,{size:30,color:C.hi,weight:700})+label('1 から n まで',760,245,{size:26,color:C.dim})
   +fade(seg(p,.5,.65),label('xᵢ ＝ i 番目の区間から',760,310,{size:28,color:C.t})+label('選んだ 1点',760,350,{size:28,color:C.t})),seg(p,.05,.2));
  return s;
 },
 [K+'left']:(p)=>{
  const A=G();let s=A.svg+divTicks(A,4)+fline(A);
  const u=[.35,.6,.25,.7],m=seg(p,.05,.3);
  [0,1,2,3].forEach(i=>{const x=i+u[i]*(1-m);s+=badge(A.X(i+.5),A.Y(0)+62,String(i+1))+dot(A.X(x),A.Y(0),8,C.t);
  });
  s+=card(720,120,440,300,label('代表点 ＝ 各区間の 左端',940,180,{size:30,color:C.t,anchor:'middle',weight:700})+label('（ここでの約束）',940,225,{size:26,color:C.dim,anchor:'middle'})
   +[0,1,2,3].map(i=>fade(seg(p,.45+i*.1,.55+i*.1),T(cT(`x_${i+1}=${i}`),830+(i%2)*220,300+Math.floor(i/2)*65,{size:38}))).join(''),seg(p,.1,.25));
  return s;
 },
 [K+'heights']:(p)=>{
  const A=G();let s=A.svg+divTicks(A,4)+fline(A);
  s+=strips(A,4,{gi:i=>seg(p,.2+i*.1,.3+i*.1)});
  [0,1,2,3].forEach(i=>{s+=badge(A.X(i+.5),A.Y(0)+62,String(i+1))+dot(A.X(i),A.Y(0),8,C.t);
   const g=seg(p,.3+i*.1,.4+i*.1);s+=fade(g,dot(A.X(i),A.Y(i),8,C.v)+label(String(i),A.X(i+.5),A.Y(i)-12,{size:28,color:C.v,anchor:'middle',weight:700}));});
  s+=card(720,150,440,190,label('高さ ＝',860,232,{size:32,color:C.ink,anchor:'end'})+T(cV('f(x_i)'),875,220,{size:44,anchor:'start'})+fade(seg(p,.6,.75),label('f(x) ＝ x なので 0、1、2、3',940,300,{size:26,color:C.v,anchor:'middle'})),seg(p,.02,.15));
  return s;
 },
 // ===== S4 Σ で1行に =====
 [K+'one']:(p)=>{
  const A=G();let s=A.svg+fline(A)+strips(A,4,{hl:seg(p,.05,.2)>.5?2:-1});
  s+=fade(seg(p,.1,.25),line(A.X(2)-12,A.Y(2),A.X(2)-12,A.Y(0),{color:C.v,w:5})+widthMark(A,2,3,'Δx'));
  s+=fade(seg(p,.2,.4),T(cV('f(x_i)')+'\\,'+cT('\\Delta x'),940,210,{size:64}));
  s+=fade(seg(p,.35,.5),label('高さ',860,290,{size:24,color:C.v,anchor:'middle'})+label('幅',1040,290,{size:24,color:C.t,anchor:'middle'})+label('短冊 1本',940,340,{size:28,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),label('番号順に 並べて 足す',940,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'long']:(p)=>{
  const A=G({x:90,y:470,w:330,h:230,xmax:4.6,yticks:[2,4],xticks:[2,4]});let s=A.svg+fline(A)+strips(A,4);
  const term=i=>cV(`f(x_${i})`)+'\\,'+cT('\\Delta x');
  s+=fade(seg(p,.05,.3),T(term(1)+'+'+term(2)+'+',500,120,{size:42,anchor:'start'}));
  s+=fade(seg(p,.25,.5),T('\\cdots+'+term('n'),560,215,{size:42,anchor:'start'}));
  s+=fade(seg(p,.6,.75),label('同じ形の項が n 個',760,330,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sigma']:(p)=>{
  const A=G({x:90,y:470,w:330,h:230,xmax:4.6,yticks:[2,4],xticks:[2,4]});let s=A.svg+fline(A)+strips(A,4);
  s+=fade(1-seg(p,.05,.25),T(cV('f(x_1)')+cT('\\Delta x')+'+\\cdots+'+cV('f(x_n)')+cT('\\Delta x'),800,120,{size:36}));
  s+=fade(seg(p,.2,.45),T(cX('S_n')+'='+cH('\\sum_{i=1}^{n}')+cV('f(x_i)')+'\\,'+cT('\\Delta x'),800,250,{size:62}));
  s+=fade(seg(p,.5,.65),T(cX('S_n'),640,420,{size:40})+label('：n 本の短冊の 合計',668,430,{size:28,color:C.x}));
  return s;
 },
 [K+'sigma2']:(p)=>{
  let s=T(cX('S_n')+'='+cH('\\sum_{i=1}^{n}')+cV('f(x_i)')+'\\,'+cT('\\Delta x'),560,240,{size:80});
  s+=fade(seg(p,.05,.25),highlight(450,258,110,56,1)+arrow(420,410,480,322,{color:C.hi,w:3,head:12})+label('i ＝ 1：始まりの番号',160,440,{size:28,color:C.hi}));
  s+=fade(seg(p,.5,.7),highlight(472,78,66,56,1)+arrow(700,95,548,105,{color:C.hi,w:3,head:12})+label('n：終わりの番号 ＝ 短冊の本数',710,105,{size:28,color:C.hi}));
  return s;
 },
 [K+'ivar']:(p)=>{
  let s=T(cX('S_n')+'='+cH('\\sum_{i=1}^{n}')+cV('f(x_i)')+'\\,'+cT('\\Delta x'),600,170,{size:64});
  s+=card(170,280,860,90,label('i：数えるための番号 → 足し終わると 残らない',600,337,{size:28,color:C.hi,anchor:'middle'}),seg(p,.05,.2));
  s+=card(170,395,860,90,label('Sn：n 本の合計 ＝ まだ 有限個の和',600,452,{size:28,color:C.x,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'s4terms']:(p)=>{
  const A=G();let s=A.svg+fline(A)+divTicks(A,4);
  const act=i=>seg(p,.12+i*.18,.2+i*.18);
  const k=Math.floor((p-.12)/.18);s+=strips(A,4,{hl:k>=0&&k<4?k:-1});
  [0,1,2,3].forEach(i=>{s+=badge(A.X(i+.5),A.Y(0)+62,String(i+1));
   s+=fade(act(i),label(`i ＝ ${i+1}`,730,150+i*75,{size:28,color:C.hi})+T(cV(String(i))+'\\times'+cT('1'),940,142+i*75,{size:40})+label(`＝ ${i}`,1040,150+i*75,{size:30,color:C.x}));});
  s+=fade(seg(p,.02,.12),label('n ＝ 4、Δx ＝ 1',940,100,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'s4']:(p)=>{
  const A=G();let s=A.svg+strips(A,4)+bigTri(A,{g:seg(p,.45,.6),fo:0,color:ok,dash:'10 8'})+fline(A);
  s+=fade(seg(p,.05,.25),T(cX('S_4')+'=0+1+2+3='+cX('6\\,\\mathrm{m}'),930,180,{size:42}));
  s+=fade(seg(p,.45,.6),label('正しい値 8 m',940,280,{size:30,color:ok,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),label('8 − 6 ＝ 2 m 小さい',940,360,{size:32,color:bad,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 n を増やすと =====
 [K+'gap']:(p)=>{
  const A=G();let s=A.svg+strips(A,4)+fline(A);
  [0,1,2,3].forEach(i=>{const g=seg(p,.35+i*.08,.45+i*.08);s+=fade(g,dot(A.X(i),A.Y(i),9,C.hi)+dot(A.X(i+1),A.Y(i+1),7,C.v));});
  s+=card(720,140,440,220,label('v は 増え続ける',940,200,{size:30,color:C.v,anchor:'middle'})+fade(seg(p,.35,.5),label('左端 ＝ 区間で 一番低い',940,280,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'gap2']:(p)=>{
  const A=G();let s=A.svg+strips(A,4)+gaps(A,4,{g:seg(p,.1,.3)})+fline(A);
  s+=fade(seg(p,.45,.6),T('\\tfrac12\\times1\\times1=0.5',940,190,{size:44})+label('三角形 1つ',940,250,{size:26,color:C.a,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),T('0.5\\times4='+cc(C.a,'2'),940,340,{size:48})+label('欠けの合計',940,400,{size:26,color:C.a,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  const A=G();let s=A.svg+strips(A,4)+gaps(A,4)+fline(A);
  s+=card(720,150,440,220,label('n を増やすと',940,210,{size:32,color:C.ink,anchor:'middle'})+label('合計 Sn は？',940,270,{size:34,color:C.x,anchor:'middle',weight:700})+label('予想してみよう',940,335,{size:26,color:C.hi,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'n8']:(p)=>{
  const A=G(),u=seg(p,.05,.3);let s=A.svg+fade(1-u,strips(A,4)+gaps(A,4))+fade(u,strips(A,8)+gaps(A,8))+fline(A);
  s+=fade(seg(p,.25,.45),label('Δx ＝ 0.5',760,140,{size:28,color:C.t})+label('高さ 0、0.5、1、…、3.5',760,185,{size:26,color:C.v}));
  s+=card(740,230,400,190,label('n',800,280,{size:28,color:C.dim,anchor:'middle'})+T(cX('S_n')+'\\,[\\mathrm{m}]',1000,272,{size:34})
   +label('4',800,330,{size:30,color:C.ink,anchor:'middle'})+label('6',1000,330,{size:30,color:C.x,anchor:'middle'})
   +fade(seg(p,.6,.75),label('8',800,385,{size:30,color:C.ink,anchor:'middle'})+label('7',1000,385,{size:32,color:C.x,anchor:'middle',weight:700})));
  return s;
 },
 [K+'n16']:(p)=>{
  const A=G(),u=seg(p,.05,.3);let s=A.svg+fade(1-u,strips(A,8)+gaps(A,8))+fade(u,strips(A,16)+gaps(A,16))+fline(A);
  s+=bigTri(A,{g:seg(p,.6,.75),fo:0,color:ok,dash:'10 8'});
  s+=card(740,120,400,300,label('n',800,170,{size:28,color:C.dim,anchor:'middle'})+T(cX('S_n')+'\\,[\\mathrm{m}]',1000,162,{size:34})
   +[[4,6],[8,7]].map(([n,v],i)=>label(String(n),800,220+i*55,{size:30,color:C.ink,anchor:'middle'})+label(String(v),1000,220+i*55,{size:30,color:C.x,anchor:'middle'})).join('')
   +fade(seg(p,.2,.35),label('16',800,330,{size:30,color:C.ink,anchor:'middle'})+label('7.5',1000,330,{size:32,color:C.x,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('→ 8 へ 下から',940,395,{size:28,color:ok,anchor:'middle',weight:700})));
  return s;
 },
 [K+'gapn']:(p)=>{
  // one missing triangle, enlarged
  const x0=180,y0=420,L=240;
  let s=poly([[x0,y0],[x0+L,y0],[x0+L,y0-L]],{fill:C.a,fo:.45,stroke:C.a,sw:2.5});
  s+=draw([[x0-60,y0+60],[x0+L+50,y0-L-50]],1,{color:C.v,w:4});
  s+=line(x0,y0,x0,y0+30,{color:C.dim,w:2});
  s+=fade(seg(p,.05,.25),label('傾き 1',x0+L+30,y0-L-10,{size:26,color:C.v}));
  s+=fade(seg(p,.25,.4),brace(x0,x0+L,y0+14,{dir:1,text:'底辺 Δx',color:C.t,size:26}));
  s+=fade(seg(p,.35,.5),line(x0+L+18,y0,x0+L+18,y0-L,{color:C.t,w:5})+label('高さ Δx',x0+L+30,y0-L/2+8,{size:26,color:C.t}));
  s+=fade(seg(p,.4,.55),T(cT('\\Delta x')+'=\\dfrac{4}{n}',870,150,{size:52}));
  s+=fade(seg(p,.65,.85),label('1つの面積',870,245,{size:26,color:C.a,anchor:'middle'})+T('\\tfrac12\\times\\left(\\dfrac{4}{n}\\right)^{2}',870,370,{size:52}));
  return s;
 },
 [K+'gapn2']:(p)=>{
  let s=fade(seg(p,.02,.2),T('n\\times\\tfrac12\\times\\left(\\dfrac{4}{n}\\right)^{2}='+cc(C.a,'\\dfrac{8}{n}'),600,110,{size:50})+label('欠けの合計',1000,120,{size:26,color:C.a}));
  const w2=texWidth(cX('S_n')+'=8-\\dfrac{8}{n}',62,false);s+=fade(seg(p,.3,.5),T(cX('S_n')+'=8-\\dfrac{8}{n}',600,255,{size:62})+highlight(600-w2/2-24,168,w2+48,150,1));
  s+=fade(seg(p,.6,.8),T('n=4:\\;8-2='+cX('6'),600,405,{size:46})+label('○ 表と一致',870,415,{size:28,color:ok,weight:700}));
  return s;
 },
 [K+'n100']:(p)=>{
  const A=G(),u=seg(p,.02,.2);let s=A.svg+fade(1-u,strips(A,16)+gaps(A,16))+fade(u,strips(A,100,{fo:.35})+gaps(A,100))+fline(A,1,{w:3});
  s+=card(720,110,440,170,label('n ＝ 100',760,160,{size:28,color:C.ink})+T(cX('S_{100}')+'=8-0.08='+cX('7.92'),940,235,{size:40}),seg(p,.05,.2));
  s+=card(720,310,440,150,T(cX('S_n')+'\\approx 8',860,395,{size:48})+label('ちょうど 8 ではない',1070,352,{size:24,color:C.hi,anchor:'end'})+label('（有限の n）',1070,430,{size:24,color:C.dim,anchor:'end'}),seg(p,.4,.55),C.hi);
  return s;
 },
 // ===== S6 まとめ =====
 [K+'sum1']:(p)=>{
  const rows=[['範囲を決める','a 〜 b',C.hi],['n 等分する','Δx ＝ (b − a)/n',C.t],['代表点（左端）の高さ','f(xᵢ)',C.v],['掛けて Σ で足す','Sn ＝ Σ f(xᵢ)Δx',C.x]];
  let s=label('まとめ',600,70,{size:30,color:C.hi,anchor:'middle',weight:700});
  rows.forEach(([a,b,col],i)=>{s+=card(150,100+i*95,900,78,label(`${i+1}．${a}`,190,150+i*95,{size:28,color:C.ink})+label(b,1010,150+i*95,{size:30,color:col,anchor:'end',weight:700}),seg(p,.05+i*.18,.15+i*.18));});
  return s;
 },
 [K+'sum2']:(p)=>{
  const A=axes({x:130,y:440,w:620,h:320,xmin:0,xmax:70,ymin:5,ymax:8.6,xticks:[4,8,16,32,64],yticks:[6,7,8],grid:true,xlabel:'n',ylabel:'',xcolor:C.dim,ycolor:C.x,g:seg(p,0,.15)});
  let s=A.svg+fade(seg(p,0,.15),T(cX('S_n')+'\\,[\\mathrm{m}]',A.X(0),A.Y(8.6)-50,{size:30}))+fade(seg(p,.1,.25),line(A.X(0),A.Y(8),A.X(70),A.Y(8),{color:ok,w:3,dash:'10 8'})+label('8',A.X(70)+10,A.Y(8)+8,{size:24,color:ok}));
  [4,8,16,32,64].forEach((n,i)=>{s+=fade(seg(p,.15+i*.08,.25+i*.08),dot(A.X(n),A.Y(Sn(n)),9,C.x));});
  s+=card(830,170,330,190,label('左端の約束',995,225,{size:26,color:C.dim,anchor:'middle'})+label('正しい値より 小さい',995,280,{size:26,color:C.x,anchor:'middle'})+label('下から 近づく',995,330,{size:28,color:ok,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'next']:(p)=>{
  const A=G({x:90,y:470,w:330,h:230,xmax:4.6,yticks:[2,4],xticks:[2,4]});
  const n=Math.round(Math.pow(2,2+4*seg(p,.05,.5)));
  let s=A.svg+strips(A,n,{fo:.35})+fline(A,1,{w:3})+label(`n ＝ ${n}`,A.X(2),A.Y(4.6),{size:26,color:C.hi,anchor:'middle'});
  s+=card(520,140,640,240,label('次の問い',840,195,{size:26,color:C.dim,anchor:'middle'})+label('n を 限りなく 増やした 行き先 を',840,265,{size:32,color:C.ink,anchor:'middle'})+label('どんな記号で 書く？',840,325,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};
