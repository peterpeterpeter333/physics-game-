// 高校編「電力とジュール熱・要点」(ys-hs-e-power-summary) — 図。Stage 1200×515.
// 深く学ぶ版 1/2・2/2 の部品と色をそのまま使う（I 緑、V 紫、Q 桃、t 金、P・W・熱 橙、R 白）。
import {C,seg,fade,label,line,rect,arrow,clamp} from './anim.mjs';
import {card,tag,T2,sceneT,IC,VC,QC,PC,RC,BAD,It,Vt,Rt,Wt,Pt,tt,U,PVI,PRI,PVR,circuit,stove,dryer,packet,areaModel,compare,fcard,qtok} from './yt1-hs-e-power-1-diagrams.mjs';
import {rich,Rli,Ii,trow} from './yt1-hs-e-power-2-diagrams.mjs';

const K='hs-e-power-summary:';
const GOOD=C.F;
const defCard=(g=1)=>card(110,50,980,170,label('電力 P ＝ 1秒あたりに 変換される エネルギー',600,125,{size:34,color:PC,anchor:'middle',weight:700})+T2(`\\mathrm{W}=\\mathrm{J/s}`,600,190,{size:40}),g,PC);
function boxes(p,{n=5}={}){
 let s='';
 for(let i=0;i<n;i++)s+=packet(170+i*110,340,{g:seg(p,.05+i*.06,.15+i*.06),text:'V J'});
 s+=fade(seg(p,.4,.55),label('1秒に I 個',390,480,{size:28,color:IC,anchor:'middle',weight:700}));
 return s;
}

export const hsEPowerSummaryDiagrams={
 // ================= 結論 =================
 [K+'c']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=defCard(seg(p,.05,.25));
  s+=circuit({o:{L:150,R:530,T:340,B:480,bx:340,ex:340},t,flow:1,glow:seg(p,.3,.5),heat:seg(p,.3,.5),cur:0,batt:''});
  s+=stove(870,440,{on:seg(p,.3,.5),t,g:seg(p,.3,.5)});
  return s;
 },
 [K+'c2']:(p)=>{
  let s=defCard();
  s+=card(300,270,600,180,T2(PVI,600,380,{size:80}),seg(p,.05,.25),C.hi);
  return s;
 },
 // ================= なぜ掛け算 =================
 [K+'why']:(p)=>{
  let s=card(80,60,500,170,T2(Vt,150,165,{size:60})+label('1 C が 渡す エネルギー',190,140,{size:28,color:C.ink,weight:700})+label('J/C',190,195,{size:30,color:VC,weight:700}),seg(p,.05,.25),VC);
  s+=card(620,60,500,170,T2(It,690,165,{size:60})+label('1秒に 通る 電荷',730,140,{size:28,color:C.ink,weight:700})+label('C/s',730,195,{size:30,color:IC,weight:700}),seg(p,.45,.65),IC);
  return s;
 },
 [K+'why2']:(p)=>{
  let s=card(80,40,500,120,T2(Vt,150,115,{size:50})+label('1 C あたり J',190,112,{size:26,color:VC,weight:700}),1,VC);
  s+=card(620,40,500,120,T2(It,690,115,{size:50})+label('1秒あたり C',730,112,{size:26,color:IC,weight:700}),1,IC);
  s+=boxes(p);
  s+=card(800,250,340,160,label('1秒あたり',970,305,{size:28,color:C.ink,anchor:'middle',weight:700})+T2(`${Vt}\\times${It}`,970,375,{size:50}),seg(p,.6,.8),PC);
  return s;
 },
 [K+'why3']:(p)=>{
  let s=T2(`\\dfrac{\\mathrm{J}}{\\mathrm{C}}\\times\\dfrac{\\mathrm{C}}{\\mathrm{s}}`,600,160,{size:64})
  const c=seg(p,.35,.5);
  s=fade(1-c,s)+fade(c,T2(`\\dfrac{\\mathrm{J}}{\\cancel{\\mathrm{C}}}\\times\\dfrac{\\cancel{\\mathrm{C}}}{\\mathrm{s}}`,600,160,{size:64}));
  s+=card(350,280,500,150,T2(`=\\dfrac{\\mathrm{J}}{\\mathrm{s}}=\\mathrm{W}`,600,370,{size:60}),seg(p,.55,.75),PC);
  return s;
 },
 [K+'ex']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=stove(200,330,{on:1,t});
  s+=label('電気ストーブ',200,450,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=card(420,80,720,140,T2(`100${U('V')}\\times5.0${U('A')}=500${U('W')}`,780,165,{size:50}),seg(p,.05,.3),PC);
  s+=fade(seg(p,.55,.75),label('毎秒 500 J が 熱に',780,330,{size:38,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= 三つの形 =================
 [K+'three']:(p)=>{
  let s=T2(PVI,600,80,{size:50});
  s+=card(80,150,500,230,label('V ＝ RI を 代入',330,200,{size:28,color:C.dim,anchor:'middle',weight:700})+T2(PRI,330,315,{size:54}),seg(p,.05,.25),PC);
  s+=card(620,150,500,230,label('I ＝ V/R を 代入',870,200,{size:28,color:C.dim,anchor:'middle',weight:700})+T2(PVR,870,320,{size:54}),seg(p,.5,.7),PC);
  return s;
 },
 [K+'three2']:(p)=>{
  let s=card(100,110,1000,180,T2(`${Pt}=${Vt}${It}=${Rt}${It}^2=\\dfrac{${Vt}^2}{${Rt}}`,600,215,{size:60}),seg(p,.0,.2),C.hi);
  s+=fade(seg(p,.25,.45),label('同じ 電力の 別の 書き方',600,370,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=tag('代入した だけ（結果）',600,450,{g:seg(p,.5,.65),size:26});
  return s;
 },
 // ================= 使ったエネルギー =================
 [K+'w']:(p)=>{
  let s=fcard(300,90,600,170,`${Wt}=${Pt}${tt}`,{g:seg(p,.05,.25),size:72,col:PC});
  s+=fade(seg(p,.5,.7),label('電力量 ＝ 使った エネルギー',600,350,{size:36,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'dryer']:(p)=>{
  let s=dryer(220,190);
  s+=label('1200 W',190,370,{size:32,color:PC,anchor:'middle',weight:700})+label('10分 ＝ 600 秒',190,420,{size:30,color:C.t,anchor:'middle',weight:700});
  s+=fcard(450,90,690,130,`${Wt}=1200\\times600`,{g:seg(p,.05,.25),size:50,col:C.faint});
  s+=fcard(450,270,690,140,`=7.2\\times10^5${U('J')}`,{g:seg(p,.5,.7),size:56,col:PC});
  return s;
 },
 [K+'kwh']:(p)=>{
  let s=fcard(200,70,800,150,`1${U('kWh')}=3.6\\times10^6${U('J')}`,{g:seg(p,.05,.25),size:56,col:PC});
  s+=fade(seg(p,.25,.4),label('kWh も エネルギーの 単位',600,280,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fcard(200,320,800,150,`7.2\\times10^5${U('J')}=0.20${U('kWh')}`,{g:seg(p,.55,.75),size:52,col:PC});
  return s;
 },
 [K+'joule']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({t,flow:1,glow:1,heat:1,rlab:1});
  s+=card(600,110,540,250,label('ジュール熱',870,180,{size:36,color:PC,anchor:'middle',weight:700})+T2(`${Wt}=${Pt}${tt}`,870,280,{size:60}),seg(p,.05,.25),PC);
  return s;
 },
 // ================= よくある間違い =================
 [K+'myth']:(p)=>{
  let s=card(170,120,860,160,label('「抵抗が 大きいほど 必ず 熱い」',600,215,{size:38,color:C.ink,anchor:'middle',weight:700}),seg(p,.0,.15),BAD);
  s+=fade(seg(p,.4,.55),line(290,203,890,203,{color:BAD,w:6})+label('誤解',965,215,{size:34,color:BAD,anchor:'middle',weight:700}));
  return s;
 },
 [K+'samev']:(p)=>compare({rg:0,lbars:seg(p,.2,.55)}),
 [K+'samei']:(p)=>{
  let s=compare({ln:seg(p,.0,.2),lhl:1-seg(p,.45,.6),rg:seg(p,.45,.6),rbars:seg(p,.55,.85),rhl:seg(p,.45,.6),rn:seg(p,.8,.95)});
  s+=fade(seg(p,.1,.25),label('I ＝ 10 A',155,282,{size:22,color:IC,anchor:'middle'})+label('I ＝ 5 A',155,377,{size:22,color:IC,anchor:'middle'}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=fade(.25,compare({ln:1,rn:1}));
  s+=card(250,180,700,150,label('何が 一定かを 確かめてから 式を 選ぶ',600,268,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 // ================= 送電と案内 =================
 [K+'trans']:(p)=>{
  let s=card(120,60,960,150,label('送る 電力 ＝ 電圧 × 電流',600,150,{size:38,color:PC,anchor:'middle',weight:700}),seg(p,.05,.25),PC);
  s+=card(120,260,960,150,label('電圧 ↑ → 電流 ↓',600,350,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'trans2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=trow(100,{t,heat:seg(p,.25,.45),iw:14,itext:'I ＝ 100 A',ptext:'損失 20 %',pg:seg(p,.3,.5),col:BAD});
  s+=fade(seg(p,.5,.6),trow(320,{t,v:'10000 V',heat:.15,iw:3,itext:'I ＝ 10 A',ptext:'損失 0.2 %',pg:seg(p,.65,.8),col:GOOD}));
  s+=fade(seg(p,.05,.2),rich([['P',PC,'i'],['損',PC,'s'],[' ＝ ',C.ink],...Rli,[' ',C.ink],...Ii,['²',IC]],980,55,{size:36}));
  return s;
 },
 [K+'guide']:(p)=>{
  let s=card(170,110,860,250,label('なぜ 掛け算？',600,195,{size:40,color:C.ink,anchor:'middle',weight:700})+label('なぜ 高い 電圧で 送る？',600,275,{size:40,color:C.ink,anchor:'middle',weight:700}),seg(p,.0,.2),C.hi);
  s+=tag('深く学ぶ版で',600,430,{g:seg(p,.3,.5),size:30});
  return s;
 },
};
