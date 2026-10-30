// 問題編 解説「崖の上から、横に投げる」(ys-qx-hs-m-projectile-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/105_放物運動.md の q-hs-m-projectile-1（解説 26 行）。
// 80＝5t² → t²＝16 → t＝4 s。x＝12×4＝48 m。24 m/s でも 4 s、x＝24×4＝96 m。
// 縮尺 1 m＝4 px（崖の上の小石が原点、地面は 80 m 下）。通り道は黄の点線、前の通り道（12 m/s）は薄い青紫の点線。床・壁の影は水色の楕円。
// 色：位置 x・y 水色、速度 v 紫、g・重力 赤、時刻 t 金、強調 黄。札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。
// 札の帯（y＜78）には図を描かない。図は左（x＜680）、説明の枠は右（x 700〜1190）。
// 単元動画（放物運動・深く学ぶ 1/3）と落体の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,ground} from './anim.mjs';
import {Gt,Yt,Ht,ball,lightBall} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {VXC,T1,fallY} from './yt1-hs-m-projectile-1-diagrams.mjs';
import {cross} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongCard,wrongSeq,sentWin,cueT} from './yt1-qx-common.mjs';

const K='qx-hs-m-projectile-1:';
const HC=C.hi, BAD='#ff6b6b', OLD='#a9b6f0';
const G1='地面に 着くまでの 時間',G2='着地点までの 横の 距離',G3='24 m/s での 着地までの 時間と 距離';
const A1=g=>answerTag(1,'B','4 s',{g}),A2=g=>answerTag(2,'C','48 m',{g}),A3=g=>answerTag(3,'A','4 s、96 m',{g});
const ansIn=(p,ctx)=>{const w=sentWin(ctx)[0][1];return seg(p,w*.6,w*.8);};
// ---- geometry: origin (stone at the cliff top), 1 m = 4 px, ground 80 m below -------------------
const Q={x0:230,y0:110,k:4,H:80,wall:640};
const GY=Q.y0+Q.k*Q.H+16;                 // ground line (446)
const X=(v0,t)=>Q.x0+Q.k*v0*t, Y=t=>Q.y0+Q.k*fallY(t);
const T_LAND=4;
const RX=700,RW=490,RC=RX+RW/2;          // right panel

function scene({g=1,height=1,wall=0,v0arrow=0,v0=12,stone=1,v0lab=1}={}){
 let s=fade(g,rect(100,Q.y0+16,Q.x0-100,GY-Q.y0-16,{fill:'#4a5570',fo:.85,stroke:'none',rx:4})+ground(Q.x0,680,GY));
 if(height)s+=fade(g*height,line(80,Q.y0+16,80,GY,{color:C.x,w:3})+line(70,Q.y0+16,90,Q.y0+16,{color:C.x,w:3})+line(70,GY,90,GY,{color:C.x,w:3})
  +label('80 m',70,(Q.y0+GY)/2+8,{size:26,color:C.x,anchor:'end',weight:700}));
 if(wall)s+=fade(g*wall,line(Q.wall,Q.y0-14,Q.wall,GY,{color:C.dim,w:4})+label('補助の 面（縦だけを 見る）',Q.wall-10,Q.y0-22,{size:22,color:C.dim,anchor:'end'}));
 if(v0arrow)s+=v0Arrow(v0,{g:v0arrow,lab:v0lab});
 if(stone)s+=ball(Q.x0,Q.y0);
 return s;
}
function v0Arrow(v0,{g=1,lab=1,text}={}){
 return arrow(Q.x0+18,Q.y0,Q.x0+18+4.2*v0,Q.y0,{color:VXC,w:5,head:14,g})
  +fade(g*lab,label(text??`${v0} m/s`,Q.x0+32+4.2*v0,Q.y0+9,{size:26,color:VXC,weight:700}));
}
const pathPts=(v0,tEnd=T_LAND)=>Array.from({length:49},(_,i)=>{const t=tEnd*i/48;return [X(v0,t),Y(t)];});
const path=(v0,p=1,{color=HC,w=3,dash='7 8'}={})=>draw(pathPts(v0),p,{color,w,dash});
const faintPath=(v0=12)=>path(v0,1,{color:C.faint,w:2,dash:'6 8'});
const floorDot=(x,o=1,col=C.x)=>fade(o,`<ellipse cx="${x.toFixed(1)}" cy="${GY-3}" rx="12" ry="6" fill="${col}"/>`);
const wallDot=(y,o=1,col=C.x)=>fade(o,`<ellipse cx="${Q.wall-3}" cy="${y.toFixed(1)}" rx="6" ry="12" fill="${col}"/>`);
const ray=(x,y)=>line(x,y,x,GY-4,{color:'#fff2b8',w:1.5,dash:'3 6'})+line(x,y,Q.wall-4,y,{color:'#fff2b8',w:1.5,dash:'3 6'});
const clock=(t,x,y,g=1)=>card(x,y,300,110,label('時刻',x+150,y+40,{size:24,color:C.dim,anchor:'middle'})+label(`t ＝ ${t.toFixed(1)} s`,x+150,y+88,{size:36,color:C.t,anchor:'middle',weight:700}),g,C.t);
const U=s=>`\\ \\mathrm{${s}}`;
const panel=(y,h,rows,g=1,stroke=C.faint)=>card(RX,y,RW,h,rows,g,stroke);
// 地面の目盛り 0、12、24、36、48（m）
function ticks(t,{o=1}={}){let s='';for(let i=0;i<=T_LAND&&i<=t+1e-6;i++)s+=fade(o,floorDot(X(12,i),.6)+line(X(12,i),GY+6,X(12,i),GY+16,{color:C.x,w:2})+label(String(12*i),X(12,i),GY+40,{size:22,color:C.x,anchor:'middle'}));return s;}
// 寸法線
const span=(x1,x2,y,txt,{color=C.x,g=1}={})=>fade(g,line(x1,y,x2,y,{color,w:3})+line(x1,y-10,x1,y+10,{color,w:3})+line(x2,y-10,x2,y+10,{color,w:3})+label(txt,(x1+x2)/2,y+32,{size:26,color,anchor:'middle',weight:700}));
// 式の画面（小問1）
function eqT4(p,{box16=0}={}){
 let s=T1('80=5t^2',330,130,{size:48});
 s+=fade(seg(p,.04,.15),label('両辺を 5 で 割る',330,190,{size:26,color:HC,anchor:'middle'}));
 s+=fade(seg(p,.12,.3),T1('t^2=16',330,265,{size:52}));
 if(box16)s+=fade(box16,rect(240,222,180,70,{fill:'none',fo:0,stroke:BAD,sw:4,rx:10}));
 s+=fade(seg(p,.45,.55),label('時間は 正',330,330,{size:26,color:HC,anchor:'middle'}));
 s+=card(170,360,320,110,T1('t=4'+U('s'),330,425,{size:56}),seg(p,.55,.68),C.t);
 return s;
}

export const qxHsMProjectile1Diagrams={
 // ================= 問題アニメ =================
 // 出題：崖・地面・高さ 80 m・崖の上の小石。紫の横向きの初速度の矢印が伸び「12 m/s」。通り道・着地点は描かない。
 [K+'q0']:(p)=>{
  let s=scene({height:seg(p,.05,.3),stone:1});
  const u=seg(p,.35,.8);
  s+=arrow(Q.x0+18,Q.y0,Q.x0+18+4.2*12*Math.max(u,.02),Q.y0,{color:VXC,w:5,head:14,g:seg(p,.35,.42)});
  s+=fade(seg(p,.75,.9),label('12 m/s',Q.x0+32+4.2*12,Q.y0+9,{size:26,color:VXC,weight:700}));
  s+=fade(seg(p,.1,.3),label('崖の 下の 地面は 水平',470,GY-20,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 // 小問3：同じ崖。矢印が 12 m/s から 24 m/s（2倍）へ伸びる。高さ 80 m は そのまま。通り道は描かない。
 [K+'q3']:(p)=>{
  const u=seg(p,.25,.7),v=12+12*u;
  let s=scene({stone:1});
  s+=arrow(Q.x0+18,Q.y0,Q.x0+18+4.2*v,Q.y0,{color:VXC,w:5,head:14});
  s+=fade(1-seg(p,.15,.25),label('12 m/s',Q.x0+32+4.2*12,Q.y0+9,{size:26,color:VXC,weight:700}));
  s+=fade(seg(p,.7,.85),label('24 m/s（2倍）',Q.x0+32+4.2*24,Q.y0+9,{size:26,color:VXC,weight:700}));
  s+=panel(150,150,label('高さ 80 m は そのまま',RC,205,{size:26,color:C.dim,anchor:'middle'})+label('横の 速さ だけ 2倍',RC,265,{size:32,color:HC,anchor:'middle',weight:700}),seg(p,.75,.9),HC);
  return s;
 },
 // ================= 小問1 =================
 // 1 出題中の図 → 右に札 → 後半で曲がった通り道。紫の矢印は投げた点に残し、落ちる小石には付けない
 [K+'setup']:(p)=>{
  const u=seg(p,.45,.92),t=T_LAND*u;
  let s=scene({v0arrow:1,stone:u<=0});
  s+=path(12,u);
  if(u>0)s+=ball(X(12,t),Y(t));
  s+=panel(120,170,label('高さ 80 m の 崖',RC,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('水平に 12 m/s',RC,240,{size:32,color:VXC,anchor:'middle',weight:700}),seg(p,.02,.15));
  return s;
 },
 // 2 図を薄くし、着地した小石の横に金の「？」。求めるもの
 [K+'goal1']:(p)=>{
  let s=fade(.4,scene({v0arrow:1,stone:0})+path(12,1))+ball(X(12,4),Y(4));
  s+=fade(seg(p,.25,.4),label('？',X(12,4)+30,Y(4)-30,{size:44,color:C.t,weight:700}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3 分けるのは位置の記録：x と y の2つの数（小石は1つのまま）
 [K+'split']:(p)=>{
  const px=X(12,2),py=Y(2);
  let s=scene({height:.4,stone:0})+faintPath()+ball(px,py);
  s+=arrow(Q.x0,Q.y0,Q.x0+360,Q.y0,{color:C.x,w:3,head:14,g:seg(p,.1,.25)})+fade(seg(p,.2,.3),label('x（横）',Q.x0+370,Q.y0+8,{size:26,color:C.x,weight:700}));
  s+=arrow(Q.x0,Q.y0,Q.x0,GY-20,{color:C.x,w:3,head:14,g:seg(p,.25,.4)})+fade(seg(p,.35,.45),label('y（縦・下が正）',Q.x0+14,GY-30,{size:24,color:C.x,weight:700}));
  s+=fade(seg(p,.5,.65),line(px,py,px,Q.y0,{color:C.x,w:2,dash:'5 6'})+line(px,py,Q.x0,py,{color:C.x,w:2,dash:'5 6'})+label('24 m',px+10,Q.y0-14,{size:24,color:C.x,anchor:'middle',weight:700})+label('20 m',Q.x0+10,py-10,{size:24,color:C.x,weight:700})+label('2 s 後',px+22,py+30,{size:22,color:C.t}));
  s+=panel(110,110,label('小石は 1つの まま',RC,178,{size:32,color:HC,anchor:'middle',weight:700}),seg(p,.05,.18),HC);
  s+=panel(250,170,label('位置を 2つの 数で 記録',RC,305,{size:28,color:C.ink,anchor:'middle',weight:700})+label('（x, y）＝（24 m, 20 m）',RC,375,{size:28,color:C.x,anchor:'middle',weight:700}),seg(p,.62,.75),C.x);
  s+=goalTag(G1);
  return s;
 },
 // 4 床と壁に影を映す。壁は補助の面
 [K+'shadow']:(p)=>{
  const t=T_LAND*seg(p,.15,.85);
  let s=scene({height:.4,wall:1,stone:0})+faintPath();
  s+=ray(X(12,t),Y(t))+floorDot(X(12,t))+wallDot(Y(t))+ball(X(12,t),Y(t));
  s+=panel(90,130,label('床',RC,130,{size:24,color:C.dim,anchor:'middle'})+label('横の 動きだけを 見る 面',RC,185,{size:28,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.18),C.x);
  s+=panel(250,170,label('壁',RC,292,{size:24,color:C.dim,anchor:'middle'})+label('縦の 動きだけを 見る 面',RC,345,{size:28,color:C.x,anchor:'middle',weight:700})+label('（補助の図・実物 では ない）',RC,395,{size:24,color:HC,anchor:'middle'}),seg(p,.4,.55),HC);
  s+=goalTag(G1);
  return s;
 },
 // 5 1 s ごとの跡を残す。2つの影と、金の時計一つ
 [K+'shadow2']:(p)=>{
  const t=T_LAND*seg(p,.08,.75);
  let s=scene({height:.4,wall:1,stone:0})+faintPath();
  for(let i=1;i<=T_LAND&&i<=t+1e-6;i++)s+=floorDot(X(12,i),.45)+wallDot(Y(i),.45)+dot(X(12,i),Y(i),6,HC);
  s+=ray(X(12,t),Y(t))+floorDot(X(12,t))+wallDot(Y(t))+ball(X(12,t),Y(t));
  s+=panel(90,100,label('床の 影',RC,124,{size:24,color:C.dim,anchor:'middle'})+label('横の 動き だけ',RC,170,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.02,.12),C.x);
  s+=panel(205,100,label('壁の 影',RC,239,{size:24,color:C.dim,anchor:'middle'})+label('縦の 動き だけ',RC,285,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.15,.25),C.x);
  s+=clock(t,RC-150,322,seg(p,.4,.5));
  s+=fade(seg(p,.5,.6),label('同じ 時刻 t',RC,472,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 6 壁の影だけを残し、落とした小石を並べる。縦の位置がそろう
 [K+'drop']:(p)=>{
  const t=T_LAND*seg(p,.08,.6),dx=Q.wall+40;
  let s=scene({height:.5,wall:1,stone:0});
  for(let i=1;i<=T_LAND&&i<=t+1e-6;i++){
   s+=wallDot(Y(i),.5)+fade(.5,lightBall(dx,Y(i),11));
   s+=fade(seg(p,.6,.75),line(Q.x0+10,Y(i),dx+20,Y(i),{color:HC,w:2,dash:'5 7'})+label(`${fallY(i)} m`,Q.wall-16,Y(i)-8,{size:22,color:C.x,anchor:'end',weight:700}));
  }
  s+=wallDot(Y(t))+lightBall(dx,Y(t),15);
  s+=fade(seg(p,.02,.12),label('落とした 小石',dx+24,Q.y0+6,{size:22,color:'#ffd9a8'}));
  s+=card(800,150,380,170,label('縦：自由落下（下が正）',990,195,{size:24,color:C.dim,anchor:'middle'})+T1(Yt+'=\\tfrac12'+Gt+'t^2',990,270,{size:48}),seg(p,.35,.5),C.x);
  s+=fade(seg(p,.75,.88),label('縦の 位置が そろう',990,370,{size:30,color:HC,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 7 y は投げた点から下へ測る → 地面で y＝80
 [K+'y80']:(p)=>{
  const t=T_LAND*seg(p,.05,.4),ax=Q.x0+24;
  let s=scene({height:.4,stone:0})+faintPath()+ball(X(12,t),Y(t));
  s+=fade(seg(p,.02,.12),label('y ＝ 0（投げた 点）',ax+14,Q.y0+40,{size:24,color:C.x,weight:700}));
  s+=arrow(ax,Q.y0,ax,Math.max(Y(t),Q.y0+1),{color:C.x,w:4,head:14});
  s+=fade(seg(p,.45,.6),line(Q.x0,GY,X(12,4)+60,GY,{color:HC,w:4})+label('地面：y ＝ 80',ax+14,GY+40,{size:28,color:HC,weight:700}));
  s+=panel(140,190,label('y は',RC,195,{size:26,color:C.dim,anchor:'middle'})+label('投げた 点から 下へ',RC,250,{size:30,color:C.x,anchor:'middle',weight:700})+label('落ちた 距離',RC,300,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.18),C.x);
  s+=goalTag(G1);
  return s;
 },
 // 8 図を消し、式だけの画面。y＝½gt² → 80＝½×10×t² → 80＝5t²
 [K+'sub']:(p)=>{
  let s=T1(Yt+'=\\tfrac12'+Gt+'t^2',600,135,{size:48});
  s+=fade(seg(p,.05,.2),label('地面：y ＝ 80、g ＝ 10 を 入れる',600,205,{size:28,color:HC,anchor:'middle'}));
  s+=fade(seg(p,.3,.5),T1('80=\\tfrac12\\times 10\\times t^2',600,290,{size:50}));
  s+=card(420,345,360,115,T1('80=5t^2',600,410,{size:54}),seg(p,.65,.8),C.t);
  s+=goalTag(G1);
  return s;
 },
 // 9 両辺を 5 で割る → t²＝16 → 時間は正 → t＝4 s
 [K+'t4']:(p)=>eqT4(p)+goalTag(G1),
 // 10 答えの札 B。t²＝16 を赤の枠で囲み、誤答カード C
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=eqT4(1,{box16:seg(p,b,b+.06)});
  s+=goalTag(G1)+A1(ansIn(p,ctx));
  s+=wrongCard('C','16 s','t² ＝ 16 で 止めた（16 の 単位は s²）',{x:600,y:210,w:580,g:seg(p,b+.02,b+.08)});
  return s;
 },
 // 11 崖と壁の図に戻る。壁の影の 1 s ごとの跡（5、20、45、80 m）の間隔が広がる。誤答カード A
 [K+'wrongA']:(p)=>{
  let s=scene({height:.4,wall:1,stone:0})+faintPath();
  const gaps=[5,15,25,35];
  for(let i=0;i<=T_LAND;i++){s+=wallDot(Y(i),.8);if(i>0)s+=label(`${fallY(i)} m`,Q.wall-16,Y(i)+8,{size:22,color:C.x,anchor:'end',weight:700});}
  s+=fade(seg(p,.05,.15),label('1 s ごとの 落下',Q.wall-80,Q.y0+12,{size:22,color:C.dim,anchor:'end'}));
  gaps.forEach((d,i)=>{const a=seg(p,.12+i*.1,.2+i*.1),y1=Y(i),y2=Y(i+1);
   s+=fade(a,line(Q.wall+12,y1+3,Q.wall+12,y2-3,{color:HC,w:5})+label(`${d} m`,Q.wall+22,(y1+y2)/2+8,{size:22,color:HC,weight:700}));});
  s+=fade(seg(p,.5,.6),label('間隔が 広がる ＝ 速さは 一定 でない',400,GY+50,{size:24,color:HC,anchor:'middle',weight:700}));
  s+=wrongCard('A','8 s',['80÷10','（縦の 速さ 10 m/s で 一定と した）'],{x:725,y:150,w:465,whySize:22,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 12 高さ 80 m（縦・水色）と 12 m/s（横・紫）を色分け。「80÷12≈6.7」に赤の×。誤答カード D
 [K+'wrongD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=scene({height:0,v0arrow:1,v0lab:0});
  s+=fade(seg(p,b,b+.08),arrow(80,Q.y0+16,80,GY,{color:C.x,w:6,head:16})+label('高さ 80 m',70,(Q.y0+GY)/2-8,{size:26,color:C.x,anchor:'end',weight:700})+label('（縦）',70,(Q.y0+GY)/2+26,{size:24,color:C.x,anchor:'end'}));
  s+=fade(seg(p,b+.1,b+.18),label('横の 速さ 12 m/s',Q.x0+32+4.2*12,Q.y0+9,{size:24,color:VXC,weight:700}));
  s+=card(760,100,380,110,T1('80\\div 12\\approx 6.7',970,165,{size:44})+cross(800,155,20,seg(p,.12,.22)),seg(p,.02,.12),BAD);
  s+=wrongCard('D','約 6.7 s','縦の 高さ ÷ 横の 速さ（別の 方向）',{x:700,y:250,w:490,whySize:22,g:seg(p,.06,.14)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= 小問2 =================
 // 13 通り道と着地した小石。地面の下に寸法線と「？ m」
 [K+'goal2']:(p)=>{
  let s=scene({height:.4,stone:0})+faintPath()+ball(X(12,4),Y(4));
  s+=span(Q.x0,X(12,4),GY+26,'？ m',{g:seg(p,.2,.35)});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 14 0〜4 s の各位置に同じ長さの紫の矢印。重力は縦だけ。横の速度：ずっと 12 m/s
 [K+'vx']:(p)=>{
  let s=scene({height:.4,stone:0})+faintPath();
  for(let i=0;i<=T_LAND;i++){const a=seg(p,.05+i*.08,.13+i*.08);
   s+=fade(a,ball(X(12,i),Y(i),{r:12}))+arrow(X(12,i)+14,Y(i),X(12,i)+14+4.2*12,Y(i),{color:VXC,w:4,head:12,g:a})
    +(i%2===0?fade(a,label('12',X(12,i)+14+2.1*12,Y(i)-14,{size:22,color:VXC,anchor:'middle',weight:700})):'');}
  const gx=X(12,2),gy0=Y(2);
  s+=arrow(gx,gy0+20,gx,gy0+100,{color:C.a,w:5,head:14,g:seg(p,.5,.62)})+fade(seg(p,.55,.65),label('重力：縦だけ',gx-14,gy0+90,{size:24,color:C.a,anchor:'end',weight:700}));
  s+=panel(150,150,label('横の 速度',RC,205,{size:26,color:C.dim,anchor:'middle'})+label('ずっと 12 m/s',RC,265,{size:34,color:VXC,anchor:'middle',weight:700}),seg(p,.7,.82),VXC);
  s+=goalTag(G2);
  return s;
 },
 // 15 床の影が等間隔に進み、目盛り 0〜48 m。着地点 48 m。x＝12×4＝48 m
 [K+'x48']:(p)=>{
  const t=T_LAND*seg(p,.04,.4);
  let s=scene({height:.4,stone:0})+faintPath()+ticks(t);
  s+=floorDot(X(12,t))+ball(X(12,t),Y(t));
  s+=fade(seg(p,.4,.5),dot(X(12,4),GY-3,10,HC)+label('48 m',X(12,4)+18,GY-22,{size:28,color:HC,weight:700}));
  s+=fade(seg(p,.04,.12),label('（m）',X(12,4)+44,GY+40,{size:22,color:C.x}));
  s+=panel(110,110,T1('x=12\\times 4=48'+U('m'),RC,175,{size:44}),seg(p,.3,.42),C.x);
  s+=goalTag(G2);
  return s;
 },
 // 16 答えの札 C。誤答カード A（192 m）、B（80 m）を1枚ずつ
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,m=b+(1-b)*.5;
  let s=scene({height:.4,stone:0})+faintPath()+ticks(4)+ball(X(12,4),Y(4))+dot(X(12,4),GY-3,10,HC)+label('48 m',X(12,4)+18,GY-22,{size:28,color:HC,weight:700})+label('（m）',X(12,4)+44,GY+40,{size:22,color:C.x});
  s+=wrongSeq(p,ctx,[['A','192 m',['12×16','（16 は t²、単位が m·s）']],['B','80 m',['崖の 高さ（縦）を','横の 距離と した']]],{win:[[b,m],[m,1]],opts:{x:700,y:150,w:490,whySize:24}});
  s+=goalTag(G2)+A2(ansIn(p,ctx));
  return s;
 },
 // 17 誤答カード D（24 m）。地面の目盛りが等間隔であることを黄で示す
 [K+'wrongD2']:(p)=>{
  let s=scene({height:.4,stone:0})+faintPath()+ticks(4)+ball(X(12,4),Y(4));
  const hi=seg(p,.3,.45);
  for(let i=0;i<T_LAND;i++)s+=fade(hi,line(X(12,i)+4,GY+56,X(12,i+1)-4,GY+56,{color:HC,w:5}));
  s+=fade(hi,label('等間隔',X(12,2),GY-20,{size:24,color:HC,anchor:'middle',weight:700}));
  s+=wrongCard('D','24 m',['½×12×4','（縦の 式の ½ を 横に 付けた）'],{x:700,y:150,w:490,whySize:24,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= 小問3 =================
 // 18 前の通り道・着地点・目盛りを消し、崖の上の小石と矢印だけ。矢印 12 → 24 m/s（2倍）
 [K+'goal3']:(p)=>{
  const u=seg(p,.15,.4),v=12+12*u;
  let s=scene({stone:1});
  s+=arrow(Q.x0+18,Q.y0,Q.x0+18+4.2*v,Q.y0,{color:VXC,w:5,head:14});
  s+=fade(1-seg(p,.1,.16),label('12 m/s',Q.x0+32+4.2*12,Q.y0+9,{size:26,color:VXC,weight:700}));
  s+=fade(seg(p,.38,.48),label('24 m/s（2倍）',Q.x0+32+4.2*24,Q.y0+9,{size:26,color:VXC,weight:700}));
  s+=panel(150,150,label('高さ 80 m は そのまま',RC,205,{size:26,color:C.dim,anchor:'middle'})+label('横の 速さ だけ 2倍',RC,265,{size:32,color:HC,anchor:'middle',weight:700}),seg(p,.3,.42),HC);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 19 通り道は描かず、壁だけ。12 m/s と 24 m/s の壁の影が重なって落ちる（横の位置は見せない）
 [K+'wall2']:(p)=>{
  const t=T_LAND*seg(p,.05,.65);
  let s=scene({height:.4,wall:1,stone:0});
  for(let i=1;i<=T_LAND&&i<=t+1e-6;i++)s+=wallDot(Y(i),.4);
  s+=`<ellipse cx="${Q.wall-3}" cy="${Y(t).toFixed(1)}" rx="9" ry="15" fill="${OLD}" fill-opacity=".8"/>`+wallDot(Y(t),.85)+ring(Q.wall-3,Y(t),22,{color:HC,w:3});
  s+=fade(seg(p,.05,.15),label('12 m/s の 影',Q.wall-30,Q.y0+60,{size:22,color:OLD,anchor:'end',weight:700})+label('24 m/s の 影',Q.wall-30,Q.y0+90,{size:22,color:C.x,anchor:'end',weight:700})+label('ぴったり 重なる',Q.wall-30,Q.y0+120,{size:22,color:HC,anchor:'end',weight:700}));
  s+=panel(100,150,label('縦の 式',RC,138,{size:24,color:C.dim,anchor:'middle'})+T1(Yt+'=\\tfrac12'+Gt+'t^2',RC,212,{size:46}),seg(p,.02,.14),C.x);
  s+=fade(seg(p,.25,.38),label('横の 速さが ない',RC,300,{size:30,color:VXC,anchor:'middle',weight:700}));
  s+=card(RX+45,340,RW-90,100,label('着地まで 4 s の まま',RC,402,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.7,.82),C.t);
  s+=goalTag(G3);
  return s;
 },
 // 20 式の画面。x＝12×4＝48 m の下に x＝24×4＝96 m。ちょうど2倍
 [K+'x96']:(p)=>{
  let s=card(300,110,600,110,T1('x=12\\times 4=48'+U('m'),600,175,{size:46}),.6,C.faint);
  s+=card(300,250,600,110,T1('x=24\\times 4=96'+U('m'),600,315,{size:46}),seg(p,.05,.2),C.x);
  s+=fade(seg(p,.55,.7),label('ちょうど 2倍',600,420,{size:34,color:HC,anchor:'middle',weight:700})+arrow(930,175,930,300,{color:HC,w:4,head:14})+label('×2',950,250,{size:30,color:HC,weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 21 答えの札 A。ここで初めて2本の通り道（12 m/s 薄い青紫、24 m/s 黄）。着地点 48・96 m、共通の 4 s
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=scene({height:.4,stone:0})+path(12,seg(p,.05,.3),{color:OLD,w:2.5,dash:'6 8'})+path(24,seg(p,.1,.35));
  s+=fade(seg(p,.3,.38),dot(X(12,4),GY-3,10,HC)+label('48 m',X(12,4),GY+36,{size:26,color:HC,anchor:'middle',weight:700})+dot(X(24,4),GY-3,10,HC)+label('96 m',X(24,4),GY+36,{size:26,color:HC,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.1),label('4 s',X(12,4)-20,Y(4)-40,{size:26,color:C.t,anchor:'middle',weight:700})+label('4 s',X(24,4)-20,Y(4)-40,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=panel(150,150,label('時間 4 s は 同じ',RC,205,{size:28,color:C.t,anchor:'middle',weight:700})+label('48 m → 96 m（×2）',RC,265,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,b+.1,b+.2),C.x);
  s+=goalTag(G3)+A3(ansIn(p,ctx));
  return s;
 },
 // 22 2本の通り道を並べる。札「遠くまで飛ぶ ↓ 長く浮いている？」
 [K+'look']:(p)=>{
  let s=scene({height:.4,stone:0})+path(12,1,{color:OLD,w:2.5,dash:'6 8'})+path(24,1);
  s+=fade(.9,label('12 m/s',X(12,4)-12,GY-24,{size:22,color:OLD,anchor:'end'})+label('24 m/s',X(24,4)-12,GY-24,{size:22,color:HC,anchor:'end'}));
  s+=panel(140,190,label('遠くまで 飛ぶ',RC,200,{size:28,color:C.ink,anchor:'middle'})+label('↓',RC,245,{size:28,color:C.dim,anchor:'middle'})+label('長く 浮いている？',RC,300,{size:34,color:HC,anchor:'middle',weight:700}),seg(p,.15,.3),HC);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 23 2つの小石を同時に落とし、着地で光らせる。札「延びるのは届く距離だけ」。誤答カード B
 [K+'land']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const t=T_LAND*seg(p,.03,Math.max(.1,b-.02)),glow=seg(p,b-.05,b+.03);
  let s=scene({height:.4,stone:0})+path(12,1,{color:OLD,w:2,dash:'6 8'})+path(24,1,{color:HC,w:2,dash:'6 8'});
  s+=ball(X(12,t),Y(t),{color:OLD})+ball(X(24,t),Y(t));
  if(glow>0)s+=fade(glow,ring(X(12,4),Y(4),30,{color:HC,w:4})+ring(X(24,4),Y(4),30,{color:HC,w:4})+label('同時に 着地（4 s）',(X(12,4)+X(24,4))/2,Y(4)-50,{size:28,color:HC,anchor:'middle',weight:700}));
  s+=panel(100,110,label('延びるのは',RC,140,{size:24,color:C.dim,anchor:'middle'})+label('届く 距離 だけ',RC,188,{size:34,color:C.x,anchor:'middle',weight:700}),seg(p,b+.05,b+.15),C.x);
  s+=wrongCard('B','8 s、192 m','「遠く」と「長く 空中」を 混同',{x:700,y:250,w:490,whySize:24,g:seg(p,b+.3,b+.38)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 24 誤答カード C、D を1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  let s=scene({height:.4,stone:0})+path(12,1,{color:OLD,w:2,dash:'6 8'})+path(24,1,{color:HC,w:2,dash:'6 8'})+ball(X(12,4),Y(4),{color:OLD})+ball(X(24,4),Y(4));
  s+=wrongSeq(p,ctx,[['C','2 s、48 m',['横の 速さは','縦の 落ち方に 入らない']],['D','4 s、48 m',['x ＝ v₀t の','v₀ が 2倍']]],{opts:{x:700,y:150,w:490,whySize:24}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= まとめ =================
 // 25 t＝√(2h/g)、√(2×80÷10)＝√16＝4 s
 [K+'root']:(p)=>{
  let s=card(110,90,440,240,label('落ちるまでの 時間',330,135,{size:26,color:C.dim,anchor:'middle'})+T1('t=\\sqrt{\\dfrac{2'+Ht+'}{'+Gt+'}}',330,250,{size:50}),seg(p,.02,.15),C.t);
  s+=fade(seg(p,.1,.22),label('（前の 単元の 式）',330,370,{size:24,color:C.dim,anchor:'middle'})+label('h：高さ 80 m',330,420,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),T1('\\sqrt{2\\times 80\\div 10}',860,150,{size:48}));
  s+=fade(seg(p,.55,.68),T1('=\\sqrt{16}',860,245,{size:48}));
  s+=card(690,300,340,115,T1('=4'+U('s'),860,365,{size:54}),seg(p,.72,.84),C.t);
  return s;
 },
 // 26 x＝v₀t と y＝½gt² を、金の t でつなぐ
 [K+'tie']:(p)=>{
  let s=card(150,90,900,90,label('放物運動 ＝ 横の 等速 ＋ 縦の 落体',600,148,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(110,205,440,140,label('横',330,240,{size:26,color:C.dim,anchor:'middle'})+T1('x=v_0t',330,305,{size:54}),seg(p,.15,.28),C.x);
  s+=card(650,205,440,140,label('縦',870,240,{size:26,color:C.dim,anchor:'middle'})+T1(Yt+'=\\tfrac12'+Gt+'t^2',870,305,{size:50}),seg(p,.3,.43),C.x);
  const u=seg(p,.5,.65);
  s+=fade(u,ring(600,420,36,{color:C.t,w:4})+label('t',600,432,{size:36,color:C.t,anchor:'middle',weight:700})
   +line(395,350,568,410,{color:C.t,w:3,dash:'6 6'})+line(805,350,632,410,{color:C.t,w:3,dash:'6 6'})
   +label('同じ 時刻',600,494,{size:28,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
};
