// 高校編「状態方程式・要点」(ys-hs-t-ideal-summary) — 図。深く学ぶ 1/3〜3/3 の部品を使う。
import {C,seg,fade,label,line,rect,arrow,tex} from './anim.mjs';
import {card,tag,T2,TC,sceneT,gasBox,hitCount,PC,VC,Pt,Vt,IDEAL,NA,PVT,RV} from './yt1-hs-t-ideal-1-diagrams.mjs';
import {T3,AV2,PVK} from './yt1-hs-t-ideal-2-diagrams.mjs';
import {KC,UC} from './yt1-hs-m-energy-1-diagrams.mjs';

const K='hs-t-ideal-summary:';
const Ut=`{\\color{${UC}}U}`, TT=`{\\color{${TC}}T}`;
const UF=`${Ut}=\\dfrac{3}{2}nR${TT}`;
const KE=`{\\color{${KC}}\\dfrac{1}{2}m${AV2}}`;
const big=(src,y,g,col,size=62,h=160)=>card(200,y,800,h,T3(src,600,y+h/2+22,{size}),g,col);

export const hsTIdealSummaryDiagrams={
 // ---- 結論
 [K+'w']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.45,gasBox({x:80,y:60,w:360,h:380,n:16,dist:200*t,seed:3,hit:1}));
  s+=fade(seg(p,.05,.2),label('圧力 P',620,100,{size:30,color:PC,anchor:'middle',weight:700}))+fade(seg(p,.12,.27),label('体積 V',820,100,{size:30,color:VC,anchor:'middle',weight:700}))+fade(seg(p,.19,.34),label('絶対温度 T',1030,100,{size:30,color:TC,anchor:'middle',weight:700}));
  s+=card(500,170,640,170,T3(IDEAL,820,268,{size:66}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'mol']:(p)=>{
  let s=card(200,60,800,150,T3(IDEAL,600,148,{size:56}),1,C.dim);
  s+=card(200,260,800,170,label('物質量 n [mol]',600,315,{size:30,color:C.ink,anchor:'middle',weight:700})+T3('6.0\\times10^{23}',420,385,{size:46})+label('個 ＝',580,400,{size:34,color:C.ink,anchor:'middle',weight:700})+T3('1\\ \\mathrm{mol}',720,385,{size:46}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'R']:(p)=>{
  let s=card(200,60,800,150,T3(IDEAL,600,148,{size:56}),1,C.dim);
  s+=card(250,260,700,170,label('気体定数',600,315,{size:30,color:C.ink,anchor:'middle',weight:700})+T3(`R\\approx ${RV}`,600,385,{size:48}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'ideal']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.4,gasBox({x:80,y:60,w:400,h:380,n:16,dist:200*t,seed:3,r:6}));
  s+=card(540,60,600,380,label('理想気体（モデル）',840,120,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),label('・分子の 大きさを 無視',590,210,{size:30,color:C.ink,weight:700}))
   +fade(seg(p,.35,.5),label('・分子どうしが 引き合う',590,280,{size:30,color:C.ink,weight:700})+label('力を 無視',620,330,{size:30,color:C.ink,weight:700})),seg(p,.05,.2),C.hi);
  s+=tag('仮定',840,400,{color:C.dim,g:seg(p,.6,.75),size:26});
  return s;
 },
 [K+'U']:(p)=>{
  let s=big(UF,60,seg(p,.05,.25),UC,66);
  s+=fade(seg(p,.4,.55),label('単原子分子の 理想気体',600,290,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('U は 絶対温度 T に 比例',600,370,{size:36,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 // ---- なぜ
 [K+'why1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('分子 12 個',330,50,{size:28,color:C.ink,anchor:'middle',weight:700})+gasBox({x:150,y:70,w:360,h:240,n:12,dist:200*t,seed:6,hit:1,wallR:C.dim});
  s+=label('分子 24 個',870,50,{size:28,color:C.hi,anchor:'middle',weight:700})+gasBox({x:690,y:70,w:360,h:240,n:24,dist:200*t,seed:6,hit:1,wallR:C.dim});
  s+=fade(seg(p,.2,.35),label('叩く 回数 2倍 → 圧力 2倍',600,360,{size:30,color:PC,anchor:'middle',weight:700}));
  s+=card(350,375,500,135,T3(`${PVT}\\propto n`,600,458,{size:46}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'why2']:(p)=>{
  let s=big(PVK,60,seg(p,.05,.25),C.hi,58,170);
  s+=fade(seg(p,.4,.55),label('衝突 1回の 力積 → 平均の 力 → 圧力',600,300,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('上の 線：平均',600,370,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'why3']:(p)=>{
  let s=fade(.6,T3(PVK,330,70,{size:34})+T3(IDEAL,870,70,{size:34}));
  s+=fade(seg(p,.05,.2),label('比べる',600,80,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=big(`${KE}=\\dfrac{3}{2}\\cdot\\dfrac{R}{${NA}}${TT}`,140,seg(p,.2,.4),C.hi,56,170);
  s+=fade(seg(p,.55,.7),label('温度 ∝ 分子 1個の 平均の 運動エネルギー',600,390,{size:30,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 // ---- 数値例
 [K+'ex']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:120,y:90,w:380,h:300,n:18,dist:200*t,seed:11});
  s+=label('V ＝ 25 L',310,440,{size:30,color:VC,anchor:'middle',weight:700});
  s+=card(600,80,500,240,T3('n=1.0\\ \\mathrm{mol}',850,140,{size:42})+T3(`${TT}=300\\ \\mathrm{K}`,850,205,{size:42})+fade(seg(p,.5,.65),T3(`${Pt}=\\ ?`,850,275,{size:46})),seg(p,.05,.2),C.dim);
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=fade(seg(p,.02,.15),label('V ＝ 25 L ＝ 0.025 m³',600,80,{size:32,color:VC,anchor:'middle',weight:700}));
  s+=card(150,130,900,170,T3(`${Pt}=\\dfrac{1.0\\times8.3\\times300}{0.025}`,600,228,{size:52}),seg(p,.15,.35),C.dim);
  s+=card(300,340,600,120,T3(`${Pt}=99600\\ \\mathrm{Pa}`,600,408,{size:50}),seg(p,.6,.8),PC);
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=card(200,90,800,150,T3(`${Pt}\\approx1.0\\times10^{5}\\ \\mathrm{Pa}`,600,175,{size:56}),1,PC);
  s+=fade(seg(p,.2,.4),label('≈ 大気圧',600,320,{size:38,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'exU']:(p)=>{
  let s=fade(.6,T3(UF,600,75,{size:40}));
  s+=card(150,140,900,150,T3(`${Ut}=1.5\\times8.3\\times300`,600,228,{size:52}),seg(p,.05,.25),C.dim);
  s+=card(300,330,600,120,T3('\\approx3.7\\times10^{3}\\ \\mathrm{J}',600,398,{size:52,color:UC}),seg(p,.5,.7),UC);
  return s;
 },
 [K+'exU2']:(p)=>{
  let s=card(100,60,480,170,label('300 K',340,110,{size:30,color:TC,anchor:'middle',weight:700})+T3('U\\approx3.7\\times10^{3}\\ \\mathrm{J}',340,180,{size:40,color:UC}),1,C.dim);
  s+=card(620,60,480,170,label('600 K（2倍）',860,110,{size:30,color:TC,anchor:'middle',weight:700})+fade(seg(p,.2,.4),T3('U\\approx7.5\\times10^{3}\\ \\mathrm{J}',860,180,{size:40,color:UC})),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.55,.7),label('分子の 速さ：2倍 ではなく √2 倍',600,320,{size:34,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 // ---- よくある間違い
 [K+'mis']:(p)=>{
  let s=card(150,80,900,170,T3(`${Pt}=\\dfrac{2490}{25}`,600,178,{size:56}),seg(p,.05,.25),C.a);
  s+=fade(seg(p,.1,.25),label('×',110,180,{size:60,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('25 L を そのまま 入れた',600,320,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=card(150,60,900,150,T3(`${Pt}=\\dfrac{2490}{25}=99.6\\ \\mathrm{Pa}`,600,148,{size:50}),1,C.a);
  s+=fade(seg(p,.05,.2),label('1000倍 ずれる',600,280,{size:38,color:C.hi,anchor:'middle',weight:700}));
  s+=card(250,330,700,110,T3('1\\ \\mathrm{L}=0.001\\ \\mathrm{m^3}',600,395,{size:46}),seg(p,.5,.7),VC);
  return s;
 },
 [K+'mis3']:(p)=>{
  let s=card(80,70,500,250,T3(IDEAL,330,150,{size:48})+label('理想気体',330,230,{size:30,color:C.F,anchor:'middle',weight:700})+label('（2原子分子も）',330,280,{size:26,color:C.dim,anchor:'middle'}),seg(p,.4,.55),C.F);
  s+=card(620,70,500,250,T3(UF,870,150,{size:46})+label('単原子分子の',870,230,{size:30,color:UC,anchor:'middle',weight:700})+label('理想気体 だけ',870,280,{size:30,color:UC,anchor:'middle',weight:700}),seg(p,.05,.2),UC);
  return s;
 },
 // ---- まとめ
 [K+'end']:(p)=>{
  let s=big(IDEAL,60,seg(p,.05,.25),C.hi,62,150);
  s+=card(200,270,800,110,label('温度 ＝ 分子の 運動エネルギーの 目安',600,338,{size:32,color:TC,anchor:'middle',weight:700}),seg(p,.45,.65),TC);
  return s;
 },
 [K+'deep']:(p)=>card(250,170,700,150,label('なぜ？ は 深く学ぶ版で',600,260,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
