// 高校編「気体の法則・要点」(ys-hs-t-gas-summary) — 図。Stage 1200×515. 色は深く学ぶ版と同じ（P 緑、V 水色、T 黄緑）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp,mix} from './anim.mjs';
import {card,tag,T2,FA,TC,Tt,sceneT,PC,VC,Pt,Vt,P1,P2,V1,V2,T1,T2t,PA,LL,KK,E5,gasBox,syringe,boyleAxes,boyleRects,boyleCurve,boyleDots} from './yt1-hs-t-gas-1-diagrams.mjs';
import {cyl} from './yt1-hs-t-gas-2-diagrams.mjs';

const K='hs-t-gas-summary:';
const PVT=`\\dfrac{${Pt}${Vt}}{${Tt}}`;
const big=(p,g=1)=>card(250,30,700,210,T2(PVT,520,140,{size:56})+label('＝ 一定',720,150,{size:46,color:C.hi,anchor:'middle',weight:700}),g,C.hi);

export const hsTGasSummaryDiagrams={
 [K+'def']:(p)=>{
  let s=big(p,seg(p,.2,.4));
  s+=fade(seg(p,.5,.65),label('決まった 量の 気体',600,300,{size:30,color:C.ink,anchor:'middle',weight:700})+label('T は 絶対温度（K）',600,345,{size:30,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'P']:(p)=>{
  let s=`<polygon points="160,420 520,420 600,340 240,340" fill="${PC}" fill-opacity=".18" stroke="${PC}" stroke-width="2.5"/>`+label('面積 A',380,465,{size:26,color:C.ink,anchor:'middle',weight:700});
  for(const x of [280,380,480])s+=FA(x,180,x,370,{w:5,head:14,g:seg(p,.05,.25)});
  s+=fade(seg(p,.1,.25),label('垂直に 押す 力 F',380,160,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=card(660,130,440,200,T2(`${Pt}=\\dfrac{F}{A}`,880,220,{size:56})+label('単位 Pa ＝ N/m²',880,300,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.55),PC);
  return s;
 },
 [K+'two']:(p)=>{
  let s=fade(.5,big(1));
  s+=card(80,255,500,250,label('温度 一定',330,295,{size:30,color:TC,anchor:'middle',weight:700})+T2(`${Pt}${Vt}=`,300,385,{size:44})+label('一定',400,398,{size:36,color:C.hi,anchor:'middle',weight:700})+label('ボイルの 法則',330,475,{size:26,color:PC,anchor:'middle',weight:700}),seg(p,.05,.25),TC);
  s+=card(620,255,500,250,label('圧力 一定',870,295,{size:30,color:PC,anchor:'middle',weight:700})+T2(`\\dfrac{${Vt}}{${Tt}}=`,830,385,{size:44})+label('一定',940,398,{size:36,color:C.hi,anchor:'middle',weight:700})+label('シャルルの 法則',870,475,{size:26,color:TC,anchor:'middle',weight:700}),seg(p,.5,.7),PC);
  return s;
 },
 [K+'why']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:150,y:70,w:520,h:340,n:20,dist:220*t,seed:4,hit:1,wallR:C.dim});
  s+=card(720,150,420,170,label('圧力 ＝ 分子の 衝突を',930,215,{size:28,color:C.ink,anchor:'middle',weight:700})+label('時間で ならした 力',930,270,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,.3,.5),PC);
  return s;
 },
 [K+'why2']:(p,ctx)=>{
  const t=sceneT(p,ctx),w=mix(480,240,seg(p,.05,.4));
  let s=gasBox({x:120,y:90,w,h:300,n:12,dist:200*t,seed:6,hit:1,wallR:C.dim});
  s+=card(680,150,460,170,label('狭く する',910,210,{size:30,color:VC,anchor:'middle',weight:700})+label('→ 当たる 回数 増える',910,265,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 圧力 上がる',910,305,{size:28,color:PC,anchor:'middle',weight:700}),seg(p,.4,.6),PC);
  return s;
 },
 [K+'why3']:(p,ctx)=>{
  const t=sceneT(p,ctx),V=mix(3,4,seg(p,.4,.8));
  let s=cyl({x:300,V,dist:420*t,flame:1,hot:1,hit:1});
  s+=card(620,130,520,220,label('温める → 速く 強く 当たる',880,195,{size:28,color:'#ffb08a',anchor:'middle',weight:700})+label('圧力を 保つ には',880,250,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 体積が 増える',880,305,{size:30,color:VC,anchor:'middle',weight:700}),seg(p,.2,.4),C.faint);
  return s;
 },
 [K+'ex1']:(p,ctx)=>{
  const xp=mix(760,240+520/3,seg(p,.4,.85));
  let s=syringe({x0:240,x1:820,yc:330,h:150,xp,dist:200*sceneT(p,ctx),n:12,seed:7});
  s+=card(150,40,420,150,T2(`${P1}=${E5}${PA}`,360,90,{size:34})+T2(`${V1}=3.0${LL}`,360,150,{size:34}),seg(p,.05,.2),C.faint);
  s+=card(630,40,420,150,T2(`${V2}=1.0${LL}`,840,90,{size:34})+label('温度 一定',840,160,{size:26,color:TC,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'ex1b']:(p)=>{
  let s=boyleAxes()+boyleRects([.5,0,.5])+boyleCurve(1)+boyleDots([1,0,1]);
  s+=card(760,120,400,250,label('体積 1／3 → 圧力 3倍',960,190,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${P2}=3.0\\times10^{5}${PA}`,960,270,{size:36}),seg(p,.3,.5),C.hi);
  s+=fade(seg(p,.6,.75),label('PV ＝ 3.0 × 10⁵ Pa·L',960,330,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2']:(p,ctx)=>{
  const t=sceneT(p,ctx),V=mix(3,4,seg(p,.4,.8));
  let s=cyl({x:300,V,dist:(200+220*seg(p,.4,.8))*t,flame:seg(p,.35,.45),hot:p>.5?1:0});
  s+=card(620,80,500,180,T2(`${V1}=3.0${LL}`,870,130,{size:34})+T2(`${T1}=300${KK}\\ \\to\\ ${T2t}=400${KK}`,870,200,{size:34}),seg(p,.05,.2),C.faint);
  s+=fade(seg(p,.5,.65),label('圧力 一定',870,310,{size:28,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2b']:(p)=>{
  let s=fade(.6,T2(`\\dfrac{${V1}}{${T1}}=\\dfrac{${V2}}{${T2t}}`,600,100,{size:40}));
  s+=card(200,200,800,140,T2(`${V2}=3.0\\times\\dfrac{400}{300}=4.0${LL}`,600,270,{size:46}),seg(p,.2,.4),VC);
  return s;
 },
 [K+'mis']:(p)=>card(200,130,800,200,label('よく ある 間違い',600,195,{size:30,color:C.a,anchor:'middle',weight:700})+label('セ氏温度 の まま 計算',600,270,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.a),
 [K+'mis2']:(p)=>{
  let s=card(300,80,600,120,label('27℃ の 2倍 ＝ 54℃？',600,160,{size:42,color:C.dim,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.6,.75),line(380,145,820,145,{color:C.a,w:5}));
  return s;
 },
 [K+'mis3']:(p)=>{
  let s=label('27℃ ＝ 300 K',600,110,{size:40,color:TC,anchor:'middle',weight:700});
  s+=fade(seg(p,.25,.4),label('2倍 → 600 K',600,200,{size:40,color:TC,anchor:'middle',weight:700}));
  s+=card(300,270,600,120,label('600 − 273 ＝ 327℃',600,345,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'mis4']:(p)=>{
  // V vs absolute temperature through the origin
  const x0=200,y0=420,kx=1.6,ky=70,X=T=>x0+T*kx,Y=v=>y0-v*ky;
  let s=arrow(x0-10,y0,X(470),y0,{color:C.dim,w:2.5,head:14})+arrow(x0,y0+10,x0,Y(4.8),{color:C.dim,w:2.5,head:14});
  s+=label('絶対温度 T [K]',X(470)+10,y0+8,{size:24,color:TC,weight:700})+label('体積 V [L]',x0+16,Y(4.8)+8,{size:24,color:VC,weight:700});
  for(const T of [300,400])s+=line(X(T),y0-6,X(T),y0+6,{color:C.dim})+label(String(T),X(T),y0+32,{size:22,color:C.ink,anchor:'middle'});
  s+=label('0',x0,y0+32,{size:22,color:C.ink,anchor:'middle'});
  s+=draw([[X(0),Y(0)],[X(300),Y(3)]],1,{color:VC,w:3,dash:'8 8'})+draw([[X(300),Y(3)],[X(400),Y(4)]],1,{color:VC,w:4})+dot(X(300),Y(3),9,C.hi)+dot(X(400),Y(4),9,C.hi);
  s+=fade(seg(p,.3,.5),ring(X(0),Y(0),16,{color:C.hi,w:4})+label('−273℃ ＝ 0 K',X(0)+20,Y(0)-150,{size:24,color:TC,weight:700}));
  s+=card(880,220,300,150,T2(`${Vt}\\ \\propto\\ ${Tt}`,1030,280,{size:46})+label('0 は −273℃',1030,345,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),TC);
  return s;
 },
 [K+'mis5']:(p)=>{
  let s=card(200,90,800,130,label('圧力も 真空を 0 と した 値',600,170,{size:36,color:PC,anchor:'middle',weight:700}),seg(p,.05,.25),PC);
  s+=fade(seg(p,.5,.65),label('大気圧からの 上乗せ 分 → 大気圧を 足す',600,300,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'end']:(p)=>{
  let s=big(1);
  s+=fade(seg(p,.3,.45),label('T：絶対温度（K）',600,320,{size:32,color:TC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('P：真空を 0 と した 圧力',600,380,{size:32,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'atm']:(p)=>{
  let s=card(250,60,700,150,label('大気圧',600,110,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`\\approx ${E5}${PA}`,600,170,{size:44,color:PC,auto:false}),seg(p,.05,.2),PC);
  s+=rect(360,300,120,120,{fill:PC,fo:.15,stroke:PC,sw:3,rx:4})+label('1 cm²',420,450,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=FA(420,250,420,340,{w:7,head:18,g:seg(p,.5,.65)});
  s+=fade(seg(p,.55,.7),label('約 10 N（約 1 kg の 物の 重さ）',540,370,{size:30,color:C.F,weight:700}));
  return s;
 },
 [K+'both']:(p)=>{
  let s=fade(.5,big(1));
  s+=card(250,280,700,170,T2(`\\dfrac{${P1}${V1}}{${T1}}=\\dfrac{${P2}${V2}}{${T2t}}`,600,365,{size:52}),seg(p,.1,.3),C.hi);
  s+=fade(seg(p,.6,.75),label('ボイル・シャルルの 法則',600,490,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=card(80,60,480,200,label('前',320,100,{size:28,color:C.dim,anchor:'middle',weight:700})+T2(`${E5}${PA}`,320,150,{size:32,auto:false})+T2(`3.0${LL}\\quad 300${KK}`,320,210,{size:32,auto:false}),seg(p,.05,.2),C.faint);
  s+=card(640,60,480,200,label('後',880,100,{size:28,color:C.dim,anchor:'middle',weight:700})+T2(`2.0\\times10^{5}${PA}`,880,150,{size:32,auto:false})+T2(`${V2}=\\ ?\\quad 400${KK}`,880,210,{size:32}),seg(p,.2,.35),C.faint);
  s+=fade(seg(p,.2,.35),arrow(570,160,630,160,{color:C.hi,w:5,head:16}));
  s+=card(250,300,700,120,T2(`${V2}=2.0${LL}`,600,362,{size:48}),seg(p,.6,.8),C.hi);
  s+=fade(seg(p,.8,.95),label('PV／T ＝ 1000 で 一致',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis6']:(p)=>{
  let s=fade(.5,card(200,40,800,110,label('圧力も 真空を 0 と した 値',600,108,{size:34,color:PC,anchor:'middle',weight:700}),1,PC));
  s+=ring(380,320,100,{color:C.dim,w:4,fill:'#0f1a30'})+line(380,320,440,260,{color:C.a,w:5})+label('上乗せ 分 だけの 圧力計',380,460,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.6),label('＋ 大気圧',620,310,{size:36,color:PC,weight:700})+label('→ 式に 入れる 値',620,370,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'deep']:(p)=>card(250,170,700,150,label('なぜ？ は 深く 学ぶ 版で',600,260,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
