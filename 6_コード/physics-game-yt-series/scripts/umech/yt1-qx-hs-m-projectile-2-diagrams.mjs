// 問題編 解説「斜めに蹴り上げたボール」(ys-qx-hs-m-projectile-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/105_放物運動.md の q-hs-m-projectile-2（解説 18 行）。
// v₀＝50 m/s、cosθ＝0.6、sinθ＝0.8 → vₓ＝30、vᵧ＝40 m/s。上向き正、g＝10。x＝30t、y＝40t−5t²（最高点 t＝4 s・80 m、着地 t＝8 s・240 m）。
// 色：速度 紫（横の成分 濃い紫、縦の成分 薄い紫。単元動画 2/3 と同じ）、加速度 g 赤、時刻 金、θ 橙、位置 水色、強調 黄。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。図は左（x＜690）、説明の枠は右（x 700〜1190）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,ground} from './anim.mjs';
import {ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {VXC,VYC,T1} from './yt1-hs-m-projectile-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongSeq,sentWin,pauseBadge,QC} from './yt1-qx-common.mjs';

const K='qx-hs-m-projectile-2:';
const HC=C.hi, AC=C.a, TH=C.E;
const VX='{\\color{'+VXC+'}v_x}', VY='{\\color{'+VYC+'}v_y}', Tt='{\\color{'+C.t+'}t}';
const G1='vₓ と vᵧ',G2='最高点の 時刻と 速さ',G3='着地点までの 水平距離';
const A1=g=>answerTag(1,'B',{tex:`${VX}=30,\\ ${VY}=40`},{g}),A2=g=>answerTag(2,'C','4 s、30 m/s',{g}),A3=g=>answerTag(3,'A','240 m',{g});
const endIn=(p,ctx)=>{const W=sentWin(ctx),a=W[W.length-1];return seg(p,a[0]+(a[1]-a[0])*.55,a[0]+(a[1]-a[0])*.8);};
const RX=700,RW=490,RC=RX+RW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(RX,y,RW,h,inner,g,stroke);

// ---- the velocity triangle: origin (ox,oy), 1 m/s = sc px ----------------------------------------
const TR={ox:170,oy:440,sc:6};
const TX=TR.ox+30*TR.sc, TY=TR.oy-40*TR.sc;          // (350, 200)
function arc(g=1,hi=0){const r=70,a1=Math.atan2(40,30);const pts=Array.from({length:21},(_,i)=>{const a=-a1*i/20;return [TR.ox+r*Math.cos(a),TR.oy+r*Math.sin(a)];});
 return fade(g,draw(pts,1,{color:TH,w:3+3*hi})+tex('\\theta',TR.ox+r+20,TR.oy-24,{size:34,color:TH,auto:false}));}
function tri({g=1,v0=1,v0lab=1,num=0,vx=0,vy=0,ang=1,box=0,hiX=0,hiY=0,hiV=0,ground:gr=1,ballOn=1}={}){
 let s='';
 if(gr)s+=fade(g,ground(60,640,TR.oy+14));
 if(box)s+=fade(g*box,rect(TX-20,TR.oy-20,20,20,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:0}));
 if(hiX)s+=fade(hiX,line(TR.ox,TR.oy,TX,TR.oy,{color:HC,w:16,opacity:.35}));
 if(hiY)s+=fade(hiY,line(TX,TR.oy,TX,TY,{color:HC,w:16,opacity:.35}));
 if(hiV)s+=fade(hiV,line(TR.ox,TR.oy,TX,TY,{color:HC,w:16,opacity:.35}));
 s+=arrow(TR.ox,TR.oy,TX,TY,{color:C.v,w:6,head:18,g:g*v0});
 s+=arrow(TR.ox,TR.oy,TX,TR.oy,{color:VXC,w:5,head:16,g:g*vx});
 s+=arrow(TX,TR.oy,TX,TY,{color:VYC,w:5,head:16,g:g*vy});
 if(ang)s+=arc(g*ang);
 if(v0lab)s+=fade(g*v0*v0lab,num?label('50',(TR.ox+TX)/2-40,(TR.oy+TY)/2-10,{size:32,color:C.v,anchor:'end',weight:700})
   :tex('\\boldsymbol{v}_0',(TR.ox+TX)/2-50,(TR.oy+TY)/2-24,{size:40,color:C.v,auto:false})+label('50 m/s',(TR.ox+TX)/2-40,(TR.oy+TY)/2+26,{size:26,color:C.v,anchor:'end',weight:700}));
 if(ballOn)s+=ball(TR.ox,TR.oy,{r:14});
 return s;
}
const cosCard=(g=1)=>panel(110,90,label('cosθ ＝ 0.6、sinθ ＝ 0.8',RC,166,{size:32,color:TH,anchor:'middle',weight:700}),g,TH);

// ---- the path: 1 m = 2.4 px, velocity arrows 1 m/s = 2 px ------------------------------------------
const P={x0:90,y0:426,k:2.4,s:1.5};
const PGY=P.y0+14;
const xS=t=>30*t, yS=t=>40*t-5*t*t, vyS=t=>40-10*t;
const PX=t=>P.x0+P.k*xS(t), PY=t=>P.y0-P.k*yS(t);
const pathPts=(t0=0,t1=8)=>Array.from({length:81},(_,i)=>{const t=t0+(t1-t0)*i/80;return [PX(t),PY(t)];});
const pathLine=(p=1,{color=HC,w=3,dash='7 8',t0=0,t1=8}={})=>draw(pathPts(t0,t1),p,{color,w,dash});
const pground=(g=1)=>fade(g,ground(40,700,PGY));
function vArrows(t,{g=1,vx=1,vy=1,lab=1,labx=1,a=0}={}){
 const x=PX(t),y=PY(t),v=vyS(t);let s='';
 s+=arrow(x,y,x+P.s*30,y,{color:VXC,w:4,head:12,g:g*vx});
 if(Math.abs(v)>1e-6)s+=arrow(x,y,x,y-P.s*v,{color:VYC,w:4,head:12,g:g*vy});
 if(lab){if(labx)s+=fade(g*vx*lab,label('30',x+P.s*30+8,y+8,{size:22,color:VXC,weight:700}));
  if(Math.abs(v)>1e-6&&Number.isInteger(t))s+=fade(g*vy*lab,label(String(v),x-10,y-P.s*v+4,{size:22,color:VYC,anchor:'end',weight:700}));}
 if(a)s+=arrow(x,y+18,x,y+62,{color:AC,w:4,head:12,g:g*a});
 return s;
}

export const qxHsMProjectile2Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約3.5秒＋静止）=================
 // 地面とボール。紫の 𝐯₀（50 m/s）が斜め上へ伸び、橙の θ。横に cosθ・sinθ の札。成分の矢印・通り道は描かない。
 [K+'q0']:(p)=>{
  const u=seg(p,.05,.5);
  let s=fade(1,ground(60,640,TR.oy+14))+ball(TR.ox,TR.oy,{r:14});
  if(u>0)s+=arrow(TR.ox,TR.oy,TR.ox+(TX-TR.ox)*u,TR.oy+(TY-TR.oy)*u,{color:C.v,w:6,head:18*Math.min(1,u*3)});
  s+=fade(seg(p,.45,.6),tex('\\boldsymbol{v}_0',(TR.ox+TX)/2-50,(TR.oy+TY)/2-24,{size:40,color:C.v,auto:false})+label('50 m/s',(TR.ox+TX)/2-40,(TR.oy+TY)/2+26,{size:26,color:C.v,anchor:'end',weight:700}));
  s+=arc(seg(p,.55,.7));
  s+=cosCard(seg(p,.7,.85));
  return s;
 },
 // ================= 小問1 =================
 // 1 出題中の図を再生して静止。紫の 𝐯₀ と橙の θ を順に光らせる
 [K+'setup']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=tri({hiV:seg(p,.12,.2)*(1-seg(p,b-.06,b)),ang:1});
  s+=fade(seg(p,b,b+.08),arc(1,1));
  s+=cosCard(1);
  return s;
 },
 // 2 求めるもの：vₓ と vᵧ
 [K+'goal1']:(p)=>tri({})+cosCard(1)+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3 𝐯₀ を横と縦の2本に分ける。直角の印。斜辺に v₀＝50
 [K+'split']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=tri({vx:seg(p,.12,.3),vy:seg(p,.3,.48),box:seg(p,b,b+.08),v0lab:0});
  s+=fade(seg(p,.15,.3),label('横の 成分',(TR.ox+TX)/2,TR.oy+48,{size:24,color:VXC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.32,.48),label('縦の 成分',TX+18,(TR.oy+TY)/2,{size:24,color:VYC,weight:700}));
  s+=fade(seg(p,b,b+.08),tex('v_0=50',(TR.ox+TX)/2-56,(TR.oy+TY)/2-18,{size:36,color:C.v,auto:false})+label('直角',TX-30,TR.oy-30,{size:22,color:C.dim,anchor:'end'}));
  s+=panel(110,150,label('横 ＋ 縦 ＝ 𝐯₀',RC,170,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（矢印を つなぐと 斜めの 矢印）',RC,220,{size:22,color:C.dim,anchor:'middle'}),seg(p,.45,.58));
  s+=goalTag(G1);
  return s;
 },
 // 4（点検 PQ-027 で直した）横の辺÷斜辺が cosθ、縦の辺÷斜辺が sinθ。
 //   文1：横の辺と斜辺を光らせて「横÷斜辺」、続いて縦の辺と斜辺で「縦÷斜辺」。辺の名前は「横の辺」「縦の辺」「斜辺」。
 //   文2：斜辺の50に掛ける札。辺の名前を「50 cosθ」「50 sinθ」に入れ替える。
 [K+'cossin']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,m=b*.5;
  const hc=seg(p,.04,.12)*(1-seg(p,m-.04,m)),hs=seg(p,m,m+.06)*(1-seg(p,b-.05,b));
  let s=tri({vx:1,vy:1,box:1,v0lab:0,hiX:hc,hiY:hs,hiV:Math.max(hc,hs)});
  s+=fade(1,tex('v_0=50',(TR.ox+TX)/2-56,(TR.oy+TY)/2-18,{size:36,color:C.v,auto:false}));
  const sw=seg(p,b+.12,b+.2);
  s+=fade(seg(p,.04,.12),label('斜辺',(TR.ox+TX)/2-50,(TR.oy+TY)/2+30,{size:24,color:C.v,anchor:'end',weight:700}));
  s+=fade(seg(p,.04,.12)*(1-sw),label('横の辺',(TR.ox+TX)/2,TR.oy+48,{size:26,color:VXC,anchor:'middle',weight:700}));
  s+=fade(seg(p,m,m+.06)*(1-sw),label('縦の辺',TX+18,(TR.oy+TY)/2+10,{size:26,color:VYC,weight:700}));
  s+=fade(sw,label('50 cosθ',(TR.ox+TX)/2,TR.oy+48,{size:28,color:VXC,anchor:'middle',weight:700}));
  s+=fade(sw,label('50 sinθ',TX+18,(TR.oy+TY)/2+10,{size:28,color:VYC,weight:700}));
  s+=panel(110,110,label('横の辺 ÷ 斜辺 ＝ cosθ',RC,155,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,m,m+.06),label('縦の辺 ÷ 斜辺 ＝ sinθ',RC,197,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.04,.12));
  s+=panel(240,110,label('50 × cosθ ＝ 横の辺',RC,285,{size:28,color:VXC,anchor:'middle',weight:700})
   +fade(seg(p,b+.2,b+.28),label('50 × sinθ ＝ 縦の辺',RC,327,{size:28,color:VYC,anchor:'middle',weight:700})),seg(p,b,b+.08),HC);
  s+=goalTag(G1);
  return s;
 },
 // 5 vₓ＝50×0.6＝30、vᵧ＝50×0.8＝40。小問1 の答え B
 [K+'ans1']:(p,ctx)=>{
  let s=tri({vx:1,vy:1,box:1,v0lab:0,hiX:seg(p,.05,.12)*(1-seg(p,.3,.36)),hiY:seg(p,.32,.4)*(1-seg(p,.6,.66))});
  s+=tex('v_0=50',(TR.ox+TX)/2-56,(TR.oy+TY)/2-18,{size:36,color:C.v,auto:false});
  s+=fade(seg(p,.2,.28),label('30',(TR.ox+TX)/2,TR.oy+48,{size:30,color:VXC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.58),label('40',TX+18,(TR.oy+TY)/2+10,{size:30,color:VYC,weight:700}));
  s+=panel(110,110,T1(`${VX}=50\\times 0.6=30`,RC,175,{size:42}),seg(p,.05,.15),VXC);
  s+=panel(240,110,T1(`${VY}=50\\times 0.8=40`,RC,305,{size:42}),seg(p,.33,.43),VYC);
  s+=fade(seg(p,.55,.65),label('（単位は m/s）',RC,390,{size:22,color:C.dim,anchor:'middle'}));
  s+=goalTag(G1)+A1(endIn(p,ctx));
  return s;
 },
 // 6 三平方の定理：30²＋40²＝50²（900＋1600＝2500）
 [K+'pyth']:(p)=>{
  let s=tri({vx:1,vy:1,box:1,v0lab:1,num:1});
  s+=label('30',(TR.ox+TX)/2,TR.oy+48,{size:30,color:VXC,anchor:'middle',weight:700})+label('40',TX+18,(TR.oy+TY)/2+10,{size:30,color:VYC,weight:700});
  s+=panel(110,110,T1('30^2+40^2=50^2',RC,175,{size:44}),seg(p,.05,.18));
  s+=panel(240,110,T1('900+1600=2500',RC,305,{size:44}),seg(p,.4,.55),HC);
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7 誤答 A・C・D を1枚ずつ
 [K+'wrong1']:(p,ctx)=>{
  let s=tri({vx:1,vy:1,box:1,v0lab:1,num:1});
  s+=label('30',(TR.ox+TX)/2,TR.oy+48,{size:30,color:VXC,anchor:'middle',weight:700})+label('40',TX+18,(TR.oy+TY)/2+10,{size:30,color:VYC,weight:700});
  s+=wrongSeq(p,ctx,[['A','40・30','横に sin を 使った'],['C','50・50','斜めの 速さを そのまま'],['D','30・20',['矢印の 長さは','引き算で 分けられない']]],{opts:{x:RX,y:140,w:RW}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= 小問2 =================
 // 8 通り道を描き、頂点に「？」
 [K+'goal2']:(p)=>{
  const u=seg(p,.1,.7);
  let s=pground()+pathLine(u)+ball(PX(8*u),PY(8*u),{r:12});
  s+=fade(seg(p,.6,.75),label('？',PX(4),PY(4)-28,{size:40,color:HC,anchor:'middle',weight:700}));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9 1 s ごとの位置に、横の矢印（ずっと 30）と縦の矢印（40、30、20、10）。赤の加速度はずっと下向き
 [K+'vel']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=pground()+pathLine(1,{color:C.faint,w:2,dash:'6 8'});
  [0,1,2,3].forEach((t,i)=>{s+=ball(PX(t),PY(t),{r:11})+vArrows(t,{labx:t===0?1:0,vx:seg(p,.05+i*.06,.12+i*.06),vy:seg(p,b+i*.07,b+.07+i*.07),a:t>0?seg(p,b+.3,b+.4):0});});
  s+=fade(seg(p,b+.3,b+.4),label('加速度 g（下向き）',PX(2)+20,PY(2)+100,{size:22,color:AC,weight:700}));
  s+=panel(110,90,label('横：ずっと 30 m/s',RC,166,{size:30,color:VXC,anchor:'middle',weight:700}),seg(p,.25,.35),VXC);
  s+=panel(230,110,label('縦：投げ上げ',RC,268,{size:24,color:C.dim,anchor:'middle'})+T1(`${VY}=40-10${Tt}`,RC,315,{size:40}),seg(p,b+.05,b+.15),VYC);
  s+=goalTag(G2);
  return s;
 },
 // 10 40−10t＝0 → t＝4。t＝4 で縦の矢印が消える
 [K+'t4']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,u=seg(p,.05,.5),t=4*u;
  let s=pground()+pathLine(1,{color:C.faint,w:2,dash:'6 8'});
  s+=ball(PX(t),PY(t),{r:12})+vArrows(t,{lab:1});
  s+=fade(seg(p,.45,.55),line(PX(4)-90,PY(4),PX(4)+90,PY(4),{color:C.faint,w:2,dash:'6 8'})+label('最高点：縦の 速度 0',PX(4),PY(4)-60,{size:24,color:HC,anchor:'middle',weight:700}));
  s+=panel(110,110,T1(`40-10${Tt}=0`,RC,175,{size:44}),seg(p,b,b+.1),C.t);
  s+=panel(240,100,T1(`${Tt}=4\\ \\mathrm{s}`,RC,300,{size:46}),seg(p,b+.25,b+.35),C.t);
  s+=goalTag(G2);
  return s;
 },
 // 11 最高点で映像を一時停止（ボールは止まっていない）。横の矢印 30 だけが残る。小問2 の答え C
 [K+'ans2']:(p,ctx)=>{
  let s=pground()+pathLine(1,{color:C.faint,w:2,dash:'6 8'});
  s+=ball(PX(4),PY(4),{r:12})+vArrows(4,{lab:1});
  s+=fade(seg(p,.1,.2),rect(PX(4)-12,PY(4)-24,P.s*30+60,48,{fill:'none',fo:0,stroke:HC,sw:3,rx:10}));
  s+=pauseBadge({g:seg(p,.02,.1),x:420});
  s+=panel(110,110,label('最高点での 速さ',RC,150,{size:24,color:C.dim,anchor:'middle'})+label('＝ 横の 30 m/s',RC,195,{size:32,color:VXC,anchor:'middle',weight:700}),seg(p,.2,.32),VXC);
  s+=fade(seg(p,.3,.4),label('（ボールは 止まって いない）',RC,270,{size:22,color:C.dim,anchor:'middle'}));
  s+=goalTag(G2)+A2(endIn(p,ctx));
  return s;
 },
 // 12 誤答 A・B・D を1枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  let s=pground()+pathLine(1,{color:C.faint,w:2,dash:'6 8'})+ball(PX(4),PY(4),{r:12})+vArrows(4,{lab:1});
  s+=wrongSeq(p,ctx,[['A','4 s、0','横の 30 が 残る'],['B','3 s、30','30÷10（横の 成分で 割った）'],['D','5 s、0','50÷10（斜めの 速さで 割った）']],{opts:{x:RX,y:140,w:RW}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= 小問3 =================
 // 13 地面に水色の寸法線と「？ m」
 [K+'goal3']:(p)=>{
  let s=pground()+pathLine(1)+ball(PX(8),PY(8),{r:12});
  s+=fade(seg(p,.2,.35),line(PX(0),PGY+28,PX(8),PGY+28,{color:C.x,w:3})+line(PX(0),PGY+18,PX(0),PGY+38,{color:C.x,w:3})+line(PX(8),PGY+18,PX(8),PGY+38,{color:C.x,w:3})+label('？ m',(PX(0)+PX(8))/2,PGY+62,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14 頂点で左右を折り重ねて対称を示す。t＝8、320−320＝0
 [K+'t8']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,f=seg(p,.08,.35),ax=PX(4);
  let s=pground()+pathLine(1,{color:C.faint,w:2,dash:'6 8'});
  s+=draw(pathPts(0,4),1,{color:HC,w:4});
  const sc=1-2*f;   // 1 → −1 : the left half is folded onto the right half
  s+=`<g transform="translate(${ax} 0) scale(${sc.toFixed(3)} 1) translate(${-ax} 0)">${draw(pathPts(0,4),1,{color:'#ffd9a8',w:3,dash:'5 6'})}</g>`;
  s+=fade(seg(p,.02,.1),line(ax,PY(4)-30,ax,PGY,{color:C.dim,w:2,dash:'4 6'}));
  s+=fade(seg(p,.3,.4),label('上り 4 s',PX(2)-30,PY(2)-24,{size:24,color:C.t,anchor:'end',weight:700})+label('下り 4 s',PX(6)+30,PY(6)-24,{size:24,color:C.t,weight:700})+label('左右 対称',ax,PY(4)-46,{size:24,color:HC,anchor:'middle',weight:700}));
  s+=panel(110,90,T1(`${Tt}=4\\times 2=8\\ \\mathrm{s}`,RC,168,{size:40}),seg(p,.35,.45),C.t);
  s+=panel(220,150,T1('40\\times 8-5\\times 8^2',RC,272,{size:38})+T1('=320-320=0',RC,330,{size:38}),seg(p,b,b+.1));
  s+=goalTag(G3);
  return s;
 },
 // 15 床の影が 0 m から 240 m まで等間隔の点で進む。着地点 240 m。小問3 の答え A
 [K+'ans3']:(p,ctx)=>{
  const t=8*seg(p,.04,.55);
  let s=pground()+pathLine(1,{color:C.faint,w:2,dash:'6 8'});
  for(let i=0;i<=8&&i<=t+1e-6;i++){const x=PX(i);s+=fade(.7,`<ellipse cx="${x}" cy="${PGY-3}" rx="10" ry="5" fill="${C.x}"/>`)+line(x,PGY+6,x,PGY+16,{color:C.x,w:2})+label(String(30*i),x,PGY+40,{size:22,color:C.x,anchor:'middle'});}
  s+=fade(seg(p,.04,.12),label('（m）',PX(8)+34,PGY+40,{size:22,color:C.x}));
  s+=ball(PX(t),PY(t),{r:12});
  s+=fade(seg(p,.55,.62),dot(PX(8),PGY-3,9,HC)+label('240 m',PX(8),PGY-44,{size:26,color:HC,anchor:'middle',weight:700}));
  s+=panel(110,110,T1('x=30\\times 8=240\\ \\mathrm{m}',RC,175,{size:42}),seg(p,.3,.42),C.x);
  s+=goalTag(G3)+A3(endIn(p,ctx));
  return s;
 },
 // 16 誤答 B・C・D を1枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  let s=pground()+pathLine(1,{color:C.faint,w:2,dash:'6 8'});
  for(let i=0;i<=8;i++){const x=PX(i);s+=line(x,PGY+6,x,PGY+16,{color:C.x,w:2})+label(String(30*i),x,PGY+40,{size:22,color:C.x,anchor:'middle'});}
  s+=dot(PX(8),PGY-3,9,HC)+label('240 m',PX(8),PGY-24,{size:26,color:HC,anchor:'middle',weight:700});
  s+=wrongSeq(p,ctx,[['B','120 m','最高点までの 4 s だけ'],['C','400 m','50×8（斜めの 速さ）'],['D','320 m','40×8（縦の 成分）']],{opts:{x:RX,y:140,w:RW}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= まとめ =================
 // 17 最高点の静止画：赤の下向きの矢印と横の紫の矢印を並べる
 [K+'sum1']:(p)=>{
  let s=pground()+pathLine(1,{color:C.faint,w:2,dash:'6 8'})+ball(PX(4),PY(4),{r:12});
  s+=arrow(PX(4)+14,PY(4),PX(4)+14+P.s*30,PY(4),{color:VXC,w:5,head:14,g:seg(p,.1,.2)})+fade(seg(p,.1,.2),label('横の 速度 30',PX(4)+P.s*30+28,PY(4)+8,{size:24,color:VXC,weight:700}));
  s+=arrow(PX(4),PY(4)+18,PX(4),PY(4)+80,{color:AC,w:5,head:14,g:seg(p,.02,.12)})+fade(seg(p,.02,.12),label('加速度 g（ずっと 下向き）',PX(4)-14,PY(4)+70,{size:24,color:AC,anchor:'end',weight:700}));
  s+=panel(110,150,label('最高点で 0 に なるのは',RC,165,{size:26,color:C.dim,anchor:'middle'})+label('縦の 速度 だけ',RC,220,{size:34,color:VYC,anchor:'middle',weight:700}),seg(p,.5,.62),VYC);
  return s;
 },
 // 18 x＝30t と y＝40t−5t² を、金の t でつなぐ
 [K+'sum2']:(p)=>{
  let s=card(150,90,900,90,label('斜めの 初速度 ＝ 横の 等速 ＋ 縦の 投げ上げ',600,148,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(110,205,440,140,label('横（等速）',330,240,{size:26,color:C.dim,anchor:'middle'})+T1(`x=30${Tt}`,330,305,{size:50}),seg(p,.15,.28),C.x);
  s+=card(650,205,440,140,label('縦（投げ上げ）',870,240,{size:26,color:C.dim,anchor:'middle'})+T1(`y=40${Tt}-5${Tt}^2`,870,305,{size:46}),seg(p,.3,.43),C.x);
  const u=seg(p,.5,.65);
  s+=fade(u,ring(600,420,36,{color:C.t,w:4})+label('t',600,432,{size:36,color:C.t,anchor:'middle',weight:700})
   +line(395,350,568,410,{color:C.t,w:3,dash:'6 6'})+line(805,350,632,410,{color:C.t,w:3,dash:'6 6'})
   +label('同じ 時刻',600,494,{size:28,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
};
