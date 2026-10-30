// 問題編 解説「立方体の体積を見積もる」（q-um-approximation、大学編 04 近似・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/04_近似.md の q-um-approximation（解説 17 行）。
// 画面：左に図（曲線 y＝x³ か、立方体の分解図）、右に式と札の枠。誤答カードは右の枠の下。札の帯（y＜78）には図を描かない。
// 色（正本）：曲線 水色、接線・近似 黄、捨てた項（差）赤の薄い塗り。立方体：元の箱 水色、板 黄、棒 赤の薄い塗り、角 赤。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin} from './yt1-qx-common.mjs';

const K='qx-um-approximation:';
const CY=C.x,YL=C.hi,RD='#ff6b6b',ROD=C.a,GR=C.F;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='接線近似の値',G2='2次まで足した値',G3='2次近似の差と出どころ';
const ANS1=g=>answerTag(1,'A','9.2 cm³',{g}),ANS2=g=>answerTag(2,'B','9.26 cm³',{g}),ANS3=g=>answerTag(3,'C','0.001 cm³',{g});
const b2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
const f=x=>x*x*x,tan1=x=>8+12*(x-2),quad=x=>8+12*(x-2)+6*(x-2)**2;

// ---- 曲線 y＝x³（x＝1.85〜2.2）----
function curveGraph({x=90,y=460,w=520,h=320,g=1,yt=1,draw0=1}={}){
 const A=axes({x,y,w,h,xmin:1.85,xmax:2.2,ymin:6,ymax:10.8,xticks:[2,2.1],yticks:yt?[8,9,10]:[],grid:true,g,xlabel:'x［cm］',ylabel:'f(x)［cm³］',xcolor:CY,ycolor:C.E});
 return {A,svg:A.svg+(draw0?A.plot(f,{from:1.85,to:2.2,p:draw0,color:CY,w:4.5}):'')};
}
const tanLine=(A,g=1,{from=1.87,to=2.2}={})=>fade(g,A.plot(tan1,{from,to,color:YL,w:3.5}));
// x＝2.1 の差を見せる拡大鏡（k 倍）
function lens(A,{g=1,LX=470,LY=170,LR=70,k=9,quadG=0,nums=1}={}){
 const cx=A.X(2.1),cy=A.Y(9.23),Z=(x,y)=>[LX+(x-cx)*k,LY+(y-cy)*k];
 const pts=fn=>Array.from({length:41},(_,i)=>{const u=2.1-.012+.024*i/40;return Z(A.X(u),A.Y(fn(u)));});
 let z=draw(pts(f),1,{color:CY,w:4})+draw(pts(tan1),1,{color:YL,w:3});
 if(quadG)z+=fade(quadG,draw(pts(quad),1,{color:YL,w:3,dash:'8 6'}));
 const [ax,ay]=Z(A.X(2.1),A.Y(9.2)),[bx,by]=Z(A.X(2.1),A.Y(9.261));
 z+=poly([[ax-6,ay],[ax+6,ay],[bx+6,by],[bx-6,by]],{fill:RD,fo:.45})+dot(ax,ay,6,YL)+dot(bx,by,6,CY);
 let s=ring(cx,cy,12,{color:YL,w:2.5})+line(cx+9,cy-9,LX-LR*.7,LY+LR*.7,{color:YL,w:2});
 s+=`<clipPath id="qxumaLens"><circle cx="${LX}" cy="${LY}" r="${LR}"/></clipPath><circle cx="${LX}" cy="${LY}" r="${LR}" fill="#0e1830"/><g clip-path="url(#qxumaLens)">${z}</g>`+ring(LX,LY,LR,{color:YL,w:3.5});
 if(nums)s+=fade(nums,label('9.261',LX+LR+10,LY-18,{size:24,color:CY,weight:700})+label('9.2',LX+LR+10,LY+30,{size:24,color:YL,weight:700}));
 return fade(g,s);
}
// ---- 立方体（斜投影）。厚み h は誇張して描く ----
const AA=2,HH=.42,SC=72,DZ=.42;
function boxSVG(P,[x0,x1],[y0,y1],[z0,z1],{fill,fo=.3,stroke,sw=2}){
 const F=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]].map(q=>P(...q));
 const R=[[x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]].map(q=>P(...q));
 const Tp=[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]].map(q=>P(...q));
 const st=stroke??fill;
 return poly(R,{fill,fo:fo*.7,stroke:st,sw})+poly(Tp,{fill,fo:fo*.85,stroke:st,sw})+poly(F,{fill,fo,stroke:st,sw});
}
// parts: 'base','plate','rod','corner'。e＝分解の量（cm）。hi＝{rod:1,...} で緑の枠
function cube({ox=150,oy=440,g=1,e=0,base=1,plates=1,rods=1,corner=1,grow=1,hiRod=0,hiPlate=0,hiCorner=0,single=0,ex=1}={}){
 const P=(x,y,z)=>[ox+SC*(x+DZ*z),oy-SC*(y+DZ*z)];
 const a=AA,h=HH*grow;
 const parts=[
  // [x範囲, y範囲, z範囲, 種類, 分解の向き]
  [[0,a],[0,a],[0,a],'base',[0,0,0]],
  [[0,a],[a,a+h],[0,a],'plate',[0,1,0]],
  [[a,a+h],[0,a],[0,a],'plate',[1,0,0]],
  [[a,a+h],[a,a+h],[0,a],'rod',[1,1,0]],
  [[0,a],[0,a],[-h,0],'plate',[0,0,-1]],
  [[0,a],[a,a+h],[-h,0],'rod',[0,1,-1]],
  [[a,a+h],[0,a],[-h,0],'rod',[1,0,-1]],
  [[a,a+h],[a,a+h],[-h,0],'corner',[1,1,-1]],
 ];
 let s='';
 for(const [X,Y,Z,kind,[nx,ny,nz]] of parts){
  const vis={base,plate:plates,rod:rods,corner}[kind];if(!vis)continue;
  if(kind!=='base'&&h<.005)continue;
  const sx=X.map(v=>v+e*nx),sy=Y.map(v=>v+e*ny),sz=Z.map(v=>v+2.2*e*nz);
  let st;
  if(single)st=kind==='base'?{fill:CY,fo:.12,stroke:CY}:{fill:'#7fb8d8',fo:.35,stroke:'#7fb8d8',sw:1.5};
  else st={base:{fill:CY,fo:.12,stroke:CY},plate:{fill:YL,fo:.35,stroke:YL},rod:{fill:ROD,fo:.3,stroke:ROD},corner:{fill:RD,fo:.55,stroke:RD}}[kind];
  s+=fade(vis,boxSVG(P,sx,sy,sz,st));
  const hi=kind==='rod'?hiRod:kind==='plate'?hiPlate:kind==='corner'?hiCorner:0;
  if(hi)s+=fade(hi,boxSVG(P,sx,sy,sz,{fill:GR,fo:0,stroke:GR,sw:4}));
 }
 if(!single&&base)s+=fade(base,boxSVG(P,[0,a],[0,a],[0,a],{fill:CY,fo:0,stroke:CY,sw:2.5}));
 if(single)s+=fade(single,boxSVG(P,[0,a],[0,a],[0,a],{fill:CY,fo:0,stroke:CY,sw:2.5}).replace(/stroke-width="2.5"/g,'stroke-width="2.5" stroke-dasharray="7 6"'));
 if(ex&&h>.05)s+=note('厚みは 大きく 誇張',ox+SC*(a+h+DZ*a)/2+20,oy-SC*(a+h+DZ*a)-30);
 return {svg:fade(g,s),P};
}

export const ytQxUmApproximationDiagrams={
 // ===================== 問題アニメ（約4秒）=====================
 // 上（左）：y＝x³ の曲線と x＝2、2.1 の目盛り。右：一辺 2 cm の立方体が 2.1 cm に広がる（一色の薄い塗り）。接線・数値なし。
 [K+'q1']:(p)=>{
  const {svg}=curveGraph({x:80,w:460,yt:0,g:seg(p,0,.25),draw0:seg(p,.1,.45)});
  let s=svg;
  s+=fade(seg(p,.15,.35),label('y ＝ x³',300,150,{size:30,color:CY,weight:700}));
  const c=cube({ox:760,oy:430,single:1,grow:seg(p,.55,.9),plates:1,rods:1,corner:1,g:seg(p,.3,.5)});
  s+=c.svg;
  s+=fade(seg(p,.35,.5),label('一辺 2 cm',800,490,{size:26,color:CY,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.95),label('→ 一辺 2.1 cm',880,490,{size:26,color:'#7fb8d8',anchor:'start',weight:700}));
  return s;
 },

 // ===================== 問題の設定 =====================
 [K+'setup']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=curveGraph({x:80,w:460,yt:0});
  let s=svg+label('y ＝ x³',300,150,{size:30,color:CY,weight:700});
  s+=fade(seg(p,b+.2,b+.3),dot(A.X(2),A.Y(8),10,YL)+label('(2, 8)',A.X(2)-14,A.Y(8)-16,{size:24,color:YL,anchor:'end',weight:700}));
  s+=cube({ox:760,oy:430,single:1,grow:seg(p,b,b+.2)}).svg;
  s+=label('一辺 2 cm',800,490,{size:26,color:CY,anchor:'middle',weight:700});
  s+=fade(seg(p,b+.15,b+.25),label('→ 一辺 2.1 cm',880,490,{size:26,color:'#7fb8d8',weight:700}));
  s+=fade(seg(p,0,.1),T(`f(x)=x^3`,1080,140,40,{color:C.ink}));
  return s;
 },
 // ===================== 小問1 =====================
 [K+'goal1']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=curveGraph();
  let s=svg+dot(A.X(2),A.Y(8),9,YL)+tanLine(A,seg(p,b,b+.2));
  s+=panel(90,300,label('x ＝ 2 での 接線',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.32),T(`f(x)\\approx f(2)+f'(2)\\,(x-2)`,PC,215,32,{color:YL}))
   +fade(seg(p,b+.1,b+.22),line(PX+40,265,PX+PW-40,265,{color:C.faint,w:2})+label('値も 傾きも 曲線と 同じ',PC,315,{size:28,color:C.ink,anchor:'middle',weight:700})
    +label('→ 近くで よく 合う',PC,360,{size:26,color:YL,anchor:'middle'})),seg(p,.03,.12),C.hi);
  s+=goalTag(G1,{g:seg(p,.02,.12)});
  return s;
 },
 [K+'slope']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=curveGraph();
  let s=svg+dot(A.X(2),A.Y(8),9,YL)+tanLine(A);
  s+=fade(seg(p,.1,.2),label('値 8',A.X(2)+14,A.Y(8)+34,{size:26,color:YL,weight:700}));
  s+=fade(seg(p,b+.3,b+.4),label('傾き 12',A.X(2.15)+10,A.Y(tan1(2.15))+40,{size:26,color:YL,weight:700}));
  s+=panel(90,300,T(`f(2)=2^3=8`,PC,150,36)
   +fade(seg(p,b,b+.1),T(`f'(x)=3x^2`,PC,230,36))
   +fade(seg(p,b+.2,b+.3),T(`f'(2)=3\\times4={\\color{${YL}}12}`,PC,310,36)),1);
  s+=goalTag(G1);
  return s;
 },
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  const {A,svg}=curveGraph();
  let s=svg+dot(A.X(2),A.Y(8),9,YL)+tanLine(A);
  s+=fade(seg(p,.3,.4),line(A.X(2.1),A.Y(6),A.X(2.1),A.Y(9.2),{color:YL,w:2,dash:'6 5'})+dot(A.X(2.1),A.Y(9.2),9,YL)+label('9.2',A.X(2.1)-14,A.Y(9.2)-14,{size:28,color:YL,anchor:'end',weight:700}));
  const e=`8+12\\times{\\color{${YL}}0.1}`;
  s+=panel(90,250,T(`f(2.1)\\approx f(2)+f'(2)\\times0.1`,PC,140,28)
   +fade(seg(p,.05,.15),T(e,PC,210,40)+highlight(PC+texWidth(e,40,false)/2-58,180,62,56,seg(p,.12,.2)))
   +fade(seg(p,.22,.32),T(`={\\color{${YL}}9.2}`,PC,285,44)),1,C.hi);
  s+=goalTag(G1)+ANS1(seg(p,b+.05,b+.12));
  return s;
 },
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,m=b+(1-b)*.42;
  const {A,svg}=curveGraph();
  let s=svg+dot(A.X(2),A.Y(8),9,YL)+tanLine(A)+dot(A.X(2.1),A.Y(9.2),7,YL)+dot(A.X(2.1),A.Y(9.261),7,CY);
  s+=lens(A,{LX:250,LY:180});
  s+=fade(seg(p,.05,.15),label('差 0.061',250,290,{size:26,color:RD,anchor:'middle',weight:700}));
  s+=panel(90,110,T(`8+12\\times0.1=9.2`,PC,150,34),1);
  s+=wrongSeq(p,ctx,[['B','9.261','本当の 値 2.1³（近似の 値 では ない）'],['C','8.6',['傾きを 3x ＝ 6 と した','（正しくは 3x² ＝ 12）']],['D','8.0','f(2) だけ（傾き × 幅を 足し忘れた）']],{win:[[0,W[0][1]],[b,m],[m,1]],opts:{...WOPT,y:220}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 [K+'cube1']:(p,ctx)=>{
  const b=b2(ctx),e=.35*seg(p,.03,.2);
  const c=cube({ox:150,oy:430,e,hiPlate:seg(p,b,b+.08)});
  let s=c.svg;
  s+=panel(90,330,label('増える 部分',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.2),label('板 3枚',PX+70,190,{size:28,color:YL,weight:700})+label('4 × 0.1 が 3枚',PX+230,190,{size:24,color:C.dim}))
   +fade(seg(p,.2,.3),label('棒 3本',PX+70,240,{size:28,color:ROD,weight:700}))
   +fade(seg(p,.3,.4),label('角 1個',PX+70,290,{size:28,color:RD,weight:700}))
   +fade(seg(p,b,b+.1),line(PX+40,320,PX+PW-40,320,{color:C.faint,w:2})+T(`{\\color{${YL}}3\\times4\\times0.1=1.2}`,PC,365,32)
    +label('＝ 接線の 12 × 0.1',PC,405,{size:26,color:YL,anchor:'middle',weight:700})),1);
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // ===================== 小問2 =====================
 [K+'goal2']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=curveGraph();
  let s=svg+dot(A.X(2),A.Y(8),9,YL)+tanLine(A);
  // 曲線と接線の間（赤の薄い塗り）
  const pts=[];for(let i=0;i<=30;i++){const u=2+.2*i/30;pts.push([A.X(u),A.Y(f(u))]);}for(let i=30;i>=0;i--){const u=2+.2*i/30;pts.push([A.X(u),A.Y(tan1(u))]);}
  s+=fade(seg(p,.1,.2)*(.6+.4*Math.sin(p*20)**2),poly(pts,{fill:RD,fo:.4}));
  s+=fade(seg(p,.15,.25),label('曲がりの 分',A.X(2.1)-20,A.Y(10.2),{size:26,color:RD,anchor:'end',weight:700}));
  s+=panel(90,280,label('曲線の 曲がり',PC,150,{size:28,color:RD,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),label('↓',PC,200,{size:28,color:C.dim,anchor:'middle'})+label('2回微分 で 表す',PC,250,{size:28,color:C.ink,anchor:'middle',weight:700})
    +label('→ 2次の 項を 足す',PC,310,{size:26,color:YL,anchor:'middle'})),seg(p,.03,.12));
  s+=goalTag(G2,{g:seg(p,.02,.12)});
  return s;
 },
 [K+'second']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=curveGraph();
  let s=svg+dot(A.X(2),A.Y(8),9,YL)+tanLine(A);
  s+=panel(90,330,T(`x^3`,PX+80,150,38)+fade(seg(p,.05,.12),arrow(PX+120,140,PX+175,140,{color:C.dim,w:3,head:12})+T(`3x^2`,PX+230,150,38))
   +fade(seg(p,.12,.2),arrow(PX+285,140,PX+340,140,{color:C.dim,w:3,head:12})+T(`6x`,PX+390,150,38,{color:YL}))
   +fade(seg(p,.25,.35),T(`f''(2)=6\\times2=12`,PC,230,36))
   +fade(seg(p,b,b+.1),label('2 で 割る',PC,290,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,b+.12,b+.22),T(`c_2=\\dfrac{12}{2}={\\color{${YL}}6}`,PC,365,38)),1);
  s+=goalTag(G2);
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  const {A,svg}=curveGraph();
  let s=svg+dot(A.X(2),A.Y(8),9,YL)+tanLine(A,.5);
  s+=fade(seg(p,.05,.25),A.plot(quad,{from:1.87,to:2.2,color:YL,w:3.5,dash:'10 7'})+label('2次まで',A.X(1.9),A.Y(quad(1.9))-20,{size:24,color:YL,weight:700}));
  s+=lens(A,{LX:250,LY:180,quadG:seg(p,.05,.25),nums:0});
  s+=panel(90,280,T(`6\\times0.1^2=6\\times0.01`,PC,145,34)
   +fade(seg(p,.15,.25),T(`={\\color{${YL}}0.06}`,PC,210,38))
   +fade(seg(p,b,b+.1),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+T(`9.2+0.06={\\color{${YL}}9.26}`,PC,315,40)),1,C.hi);
  s+=goalTag(G2)+ANS2(seg(p,b+.3,b+.37));
  return s;
 },
 [K+'rods']:(p)=>{
  const c=cube({ox:150,oy:430,e:.35,hiRod:seg(p,.05,.15)*(.6+.4*Math.abs(Math.sin(p*12)))});
  let s=c.svg;
  s+=panel(90,300,label('棒 3本',PC,140,{size:30,color:ROD,anchor:'middle',weight:700})
   +fade(seg(p,.1,.2),T(`3\\times2\\times0.1\\times0.1=0.06`,PC,210,32))
   +fade(seg(p,.25,.35),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+label('2次の 項',PC,295,{size:24,color:C.dim,anchor:'middle'})+T(`6\\times0.1^2=0.06`,PC,350,34,{color:YL})+label('同じ',PX+PW-50,350,{size:26,color:GR,anchor:'middle',weight:700})),1,GR);
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5;
  let s=card(100,95,1000,140,T(`c_2=\\dfrac{12}{2}=6`,330,165,36)+T(`9.2+6\\times0.1^2=9.26`,780,165,36),1);
  s+=wrongSeq(p,ctx,[['A','9.32','2 で 割り忘れた',{mid:`9.2+12\\times0.01`}],['C','9.22','6 で 割った（6 で 割るのは 3次の 項）',{mid:`9.2+2\\times0.01`}],['D','9.8','幅 0.1 を 2乗 して いない',{mid:`9.2+6\\times0.1`}]],{win:[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]],opts:{y:265}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // ===================== 小問3 =====================
 [K+'goal3']:(p,ctx)=>{
  const b=b2(ctx);
  const c=cube({ox:150,oy:430,e:.35});
  let s=c.svg;
  s+=panel(90,250,label('本当の 値 − 2次近似',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,b,b+.1),T(`9.261-9.26`,PC,215,40))
   +fade(seg(p,b+.15,b+.25),T(`={\\color{${RD}}0.001}`,PC,290,44)),seg(p,.03,.12));
  s+=goalTag(G3,{g:seg(p,.02,.12)});
  return s;
 },
 [K+'corner']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const c=cube({ox:150,oy:430,e:.35,hiCorner:seg(p,.03,.1)});
  let s=c.svg;
  // 角の拡大
  const [qx,qy]=c.P(AA+HH/2+.35,AA+HH/2+.35,-.77-HH/2),LX=530,LY=190,LR=75;
  s+=fade(seg(p,.05,.15),ring(qx-8,qy+8,22,{color:YL,w:2.5})+line(qx+10,qy-4,LX-LR*.7,LY+LR*.7,{color:YL,w:2})
   +ring(LX,LY,LR,{color:YL,w:3.5,fill:'#0e1830'})+boxSVG((x,y,z)=>[LX-42+60*(x+.45*z),LY+42-60*(y+.45*z)],[0,1],[0,1],[0,1],{fill:RD,fo:.55})
   +label('0.1³ ＝ 0.001',LX,LY+LR+36,{size:26,color:RD,anchor:'middle',weight:700}));
  s+=panel(90,290,T(`9.261-9.26={\\color{${RD}}0.001}`,PC,145,34)
   +fade(seg(p,.1,.2),T(`=0.1^3`,PC,210,38))
   +fade(seg(p,b,b+.1),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+label('捨てた 3次の 項',PC,290,{size:24,color:C.dim,anchor:'middle'})+T(`(x-2)^3`,PC,345,34,{color:RD})),1,RD);
  s+=goalTag(G3)+ANS3(seg(p,b+.4,b+.48));
  return s;
 },
 [K+'third']:(p,ctx)=>{
  const b=b2(ctx);
  const c=cube({ox:150,oy:430,e:.35,hiCorner:1});
  let s=c.svg;
  s+=panel(90,330,T(`f'''(x)=6`,PC,145,34)
   +fade(seg(p,.1,.2),T(`c_3=\\dfrac{6}{6}=1`,PC,220,36))
   +fade(seg(p,b,b+.1),line(PX+40,270,PX+PW-40,270,{color:C.faint,w:2})+T(`1\\times0.1^3={\\color{${RD}}0.001}`,PC,330,38))
   +fade(seg(p,b+.15,b+.25),label('＝ 角の 立方体',PC,385,{size:26,color:RD,anchor:'middle',weight:700})),1);
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,m=b+(1-b)*.45;
  let s=card(100,95,1000,140,T(`(2+h)^3=8+12h+6h^2+{\\color{${RD}}h^3}`,600,155,36)+label('h ＝ 0.1 なら 差は h³ ＝ 0.001',600,210,{size:24,color:C.dim,anchor:'middle'}),1);
  s+=wrongSeq(p,ctx,[['A','0.01','x² の 例（差 ＝ 幅の 2乗）を 当てはめた'],['B','0.061','接線近似の 差（2次の 項 0.06 で 埋まる）'],['D','0','x³ は 3次式（3次の 項まで 要る）']],{win:[[0,W[0][1]],[b,m],[m,1]],opts:{y:265}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 [K+'half']:(p,ctx)=>{
  const b=b2(ctx),u=seg(p,.15,.4);
  const base=440,H=300,x1=180,x2=420,bw=110;
  let s=line(80,base,600,base,{color:C.dim,w:2.5});
  s+=label('捨てた 3次の 項',340,110,{size:26,color:C.dim,anchor:'middle'});
  s+=rect(x1-bw/2,base-H,bw,H,{fill:RD,fo:.45,stroke:RD,rx:4})+label('幅 0.1',x1,base+34,{size:26,color:C.ink,anchor:'middle',weight:700})+label('0.001',x1,base-H-12,{size:26,color:RD,anchor:'middle',weight:700});
  const h2=mix(H,H/8,u);
  s+=fade(seg(p,.05,.15),rect(x2-bw/2,base-h2,bw,h2,{fill:RD,fo:.45,stroke:RD,rx:4})+label('幅 0.05',x2,base+34,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.38,.45),label('0.000125',x2,base-h2-12,{size:26,color:RD,anchor:'middle',weight:700})+label('1/8',x2+bw/2+20,base-h2/2-60,{size:30,color:YL,weight:700}));
  s+=panel(90,300,T(`0.1^3=0.001`,PC,150,36)
   +fade(seg(p,.1,.2),T(`0.05^3=0.000125`,PC,225,36))
   +fade(seg(p,.3,.4),T(`=0.001\\div8`,PC,295,36,{color:YL}))
   +fade(seg(p,b,b+.1),label('x ＝ 2 の 近くほど よく 合う',PC,360,{size:26,color:C.ink,anchor:'middle',weight:700})),1);
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const b=b2(ctx);
  const c=cube({ox:120,oy:400,e:.35,ex:0});
  let s=fade(seg(p,0,.1),c.svg);
  const terms=[['8',CY,'元の 箱'],['12\\times0.1',YL,'板 3枚'],['6\\times0.1^2',ROD,'棒 3本'],['1\\times0.1^3',RD,'角 1個']];
  let x=560,y=170;
  const ws=terms.map(([t])=>texWidth(t,34,false));
  terms.forEach(([t,col,nm],i)=>{
   const g=seg(p,.08+.08*i,.16+.08*i);
   if(i>0)s+=fade(g,T('+',x+14,y,34));
   const xx=x+(i>0?32:0);
   s+=fade(g,T(`{\\color{${col}}${t}}`,xx+ws[i]/2,y,34)+label(nm,xx+ws[i]/2,y+50,{size:22,color:col,anchor:'middle',weight:700}));
   x=xx+ws[i]+8;
  });
  s+=fade(seg(p,b,b+.1),card(560,260,600,110,T(`9.2\\ \\to\\ 9.26\\ \\to\\ 9.261`,860,320,40),1));
  s+=fade(seg(p,b+.1,b+.2),label('1次　　　2次　　　本当',860,400,{size:24,color:C.dim,anchor:'middle'}));
  s+=answerRow([[1,'A','9.2 cm³'],[2,'B','9.26 cm³'],[3,'C','0.001 cm³']],{g:seg(p,.6,.7),size:24});
  return s;
 },
};
