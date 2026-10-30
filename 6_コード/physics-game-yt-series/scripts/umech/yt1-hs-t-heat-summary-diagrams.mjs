// 高校編「熱と温度・要点」(ys-hs-t-heat-summary) — 図。深く学ぶ 1/2・2/2 の部品を使う。
import {C,seg,fade,label,line,rect,arrow,tex} from './anim.mjs';
import {card,tag,T2,FA,TC,QC,Tt,Qt,DT,HOT,COLD,WATER,sceneT,molBox,thermo,beaker} from './yt1-hs-t-heat-1-diagrams.mjs';
import {ironBlock,heatUp,QF} from './yt1-hs-t-heat-2-diagrams.mjs';

const K='hs-t-heat-summary:';
const big=(src,y,g,col,size=64)=>card(250,y,700,150,T2(src,600,y+80,{size}),g,col);

export const hsTHeatSummaryDiagrams={
 [K+'w']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('冷たい',330,60,{size:28,color:COLD,anchor:'middle',weight:700})+molBox({x:120,y:80,w:420,h:300,n:14,dist:60*t,speed:60,seed:7,color:COLD});
  s+=label('熱い',870,60,{size:28,color:HOT,anchor:'middle',weight:700})+molBox({x:660,y:80,w:420,h:300,n:14,dist:330*t,speed:330,seed:7,color:HOT});
  s+=fade(seg(p,.4,.55),label('温度 ＝ 分子の 運動の 激しさの 目安',600,450,{size:32,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'abs']:(p)=>{
  let s=card(150,60,900,130,label('絶対零度 −273℃ ＝ 0 K',600,140,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(150,240,900,150,T2(Tt+'=',330,320,{size:56,anchor:'start'})+label('セ氏温度の 数値 ＋ 273',460,338,{size:38,color:C.ink,weight:700}),seg(p,.5,.65),TC);
  s+=tag('定義',600,450,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'ex27']:(p)=>{
  let s=card(150,240,900,150,T2(Tt+'=',330,320,{size:56,anchor:'start'})+label('セ氏温度の 数値 ＋ 273',460,338,{size:38,color:C.ink,weight:700}),1,TC);
  s+=card(250,60,700,130,T2('27+273=300\\ \\mathrm{K}',600,125,{size:50,auto:false}),seg(p,.1,.3),TC);
  return s;
 },
 [K+'heat']:(p)=>{
  let s=rect(120,170,260,170,{fill:HOT,fo:.3,stroke:HOT,sw:2,rx:12})+label('高温',250,268,{size:34,color:HOT,anchor:'middle',weight:700});
  s+=rect(820,170,260,170,{fill:COLD,fo:.3,stroke:COLD,sw:2,rx:12})+label('低温',950,268,{size:34,color:COLD,anchor:'middle',weight:700});
  s+=FA(400,255,800,255,{color:QC,w:10,head:28,g:seg(p,.05,.35)});
  s+=fade(seg(p,.05,.2),T2(Qt,600,200,{size:50}));
  s+=fade(seg(p,.25,.4),label('温度差で 移る エネルギー（J）',600,420,{size:32,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'qmc']:(p)=>big(QF,150,seg(p,.1,.3),QC,80),
 [K+'c']:(p)=>{
  let s=card(150,60,900,160,label('比熱',300,150,{size:34,color:C.ink,anchor:'middle',weight:700})+tex('c',370,145,{size:46})+label('1 g を 1 K 上げるのに 必要な 熱',720,150,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(250,280,700,140,label('水：',380,365,{size:34,color:C.ink,anchor:'middle',weight:700})+T2('c=4.2\\ \\mathrm{J/(g\\cdot K)}',650,350,{size:46,auto:false}),seg(p,.55,.7),WATER);
  return s;
 },
 [K+'why']:(p)=>{
  let s=fade(seg(p,.05,.2),label('c',380,110,{size:44,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),arrow(420,100,560,100,{color:C.hi,w:4,head:14})+label('× m',490,80,{size:28,color:C.hi,anchor:'middle',weight:700})+label('mc',620,110,{size:44,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),arrow(670,100,810,100,{color:C.hi,w:4,head:14})+label('× ΔT',740,80,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=big(QF,220,seg(p,.6,.75),QC,72);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=beaker(220,440,170,150,{water:WATER,fo:.35,text:'水 100 g'})+thermo(340,170,400,40+100*seg(p,.3,.8));
  s+=card(450,120,700,150,T2('100\\times4.2\\times10=4200\\ \\mathrm{J}',800,195,{size:42,auto:false}),seg(p,.4,.6),QC);
  s+=fade(seg(p,.2,.35),label('＋10 K',320,150,{size:30,color:TC,anchor:'end',weight:700}));
  return s;
 },
 [K+'fe']:(p)=>{
  let s=ironBlock(220,440,{w:180,h:90,text:'鉄 100 g'})+thermo(360,100,400,40+260*seg(p,.55,.9));
  s+=card(450,90,700,200,T2(`${DT}=4200\\div(100\\times0.45)`,800,160,{size:40})+fade(seg(p,.5,.65),T2('\\approx 93\\ \\mathrm{K}',800,240,{size:46,auto:false,color:TC})),seg(p,.1,.3),TC);
  s+=fade(seg(p,.05,.2),label('（鉄の 比熱は 代表値）',800,340,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sea']:(p)=>{
  let s=rect(80,330,520,120,{fill:WATER,fo:.45,stroke:'none',rx:0})+rect(600,300,520,150,{fill:'#8a6a48',fo:.6,stroke:'none',rx:0});
  s+=label('海（水）',340,400,{size:30,color:C.ink,anchor:'middle',weight:700})+label('陸',860,385,{size:30,color:C.ink,anchor:'middle',weight:700});
  const sw=Math.sin(2*Math.PI*p*1.5);
  s+=thermo(340,90,300,105+15*sw)+thermo(860,90,270,100+70*sw);
  s+=fade(seg(p,.4,.55),label('気温差：小',380,150,{size:26,color:TC,weight:700})+label('気温差：大',900,150,{size:26,color:HOT,weight:700}));
  s+=fade(seg(p,.1,.25),label('c が 大きい → 温度が 変わりにくい',340,495,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mix']:(p)=>{
  let s=beaker(200,320,150,140,{water:HOT,fo:.3,text:'80℃・100 g'})+beaker(470,320,170,170,{water:COLD,fo:.35,text:'20℃・200 g'});
  s+=arrow(590,260,700,290,{color:C.dim,w:4,head:14,g:seg(p,.3,.5)});
  s+=fade(seg(p,.3,.5),beaker(880,420,240,200,{water:'#b98fb8',fo:.3,text:''}));
  s+=card(250,420,500,80,label('失った 熱 ＝ 得た 熱',500,472,{size:30,color:QC,anchor:'middle',weight:700}),seg(p,.05,.2),QC);
  s+=fade(seg(p,.7,.85),label('40℃',880,330,{size:50,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mix2']:(p)=>{
  let s=card(150,40,900,110,label('熱い 水：失った 熱',600,80,{size:24,color:HOT,anchor:'middle',weight:700})+T2('100\\times4.2\\times40=16800\\ \\mathrm{J}',600,125,{size:34,auto:false}),seg(p,.03,.15),HOT);
  s+=card(150,170,900,110,label('冷たい 水：得た 熱',600,210,{size:24,color:COLD,anchor:'middle',weight:700})+T2('200\\times4.2\\times20=16800\\ \\mathrm{J}',600,255,{size:34,auto:false}),seg(p,.1,.25),COLD);
  const X=c=>200+c*10,y=400;
  s+=fade(seg(p,.45,.6),line(X(10),y,X(90),y,{color:C.dim,w:4})+[20,40,50,80].map(c=>line(X(c),y-10,X(c),y+10,{color:C.dim,w:2})+label(`${c}℃`,X(c),y+42,{size:24,color:c===40?C.hi:c===50?C.dim:C.ink,anchor:'middle',weight:700})).join('')+label('200 g',X(20),y-24,{size:24,color:COLD,anchor:'middle',weight:700})+label('100 g',X(80),y-24,{size:24,color:HOT,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),arrow(X(50),y-40,X(41),y-40,{color:C.hi,w:4,head:14})+label('量の 多い 側へ 寄る',X(50)+20,y-60,{size:24,color:C.hi,weight:700}));
  return s;
 },
 [K+'mis']:(p)=>{
  let s=card(200,60,800,110,T2(`${DT}=35`,440,115,{size:46})+label('✕ 最後の 温度',780,127,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(200,230,800,110,T2(`${DT}=35-20=15\\ \\mathrm{K}`,480,285,{size:44})+label('○ 差',870,297,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.55,.7),C.F);
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=card(200,80,800,120,T2('35-20=15',600,140,{size:46,auto:false})+label('℃',880,150,{size:30,color:C.dim}),1);
  s+=card(200,240,800,120,T2('308-293=15',600,300,{size:46,auto:false,color:TC})+label('K',900,310,{size:30,color:C.dim}),seg(p,.15,.3),TC);
  s+=fade(seg(p,.5,.65),label('差 なので 同じ 数',600,430,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis3']:(p)=>{
  let s=card(150,60,900,120,label('✕ 熱い 物は 熱を たくさん 持っている',600,135,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(150,220,900,190,label('○ 持っているのは 内部エネルギー',600,290,{size:34,color:'#ffd6a0',anchor:'middle',weight:700})+label('熱は 移る 途中の エネルギー',600,360,{size:34,color:QC,anchor:'middle',weight:700}),seg(p,.45,.6),C.F);
  return s;
 },
 [K+'end']:(p)=>{
  let s=card(150,40,900,90,label('温度 ＝ 分子の 運動の 激しさ',600,98,{size:32,color:TC,anchor:'middle',weight:700}),seg(p,.03,.15),TC);
  s+=card(150,160,900,90,label('熱 ＝ 温度差で 移る エネルギー',600,218,{size:32,color:QC,anchor:'middle',weight:700}),seg(p,.25,.4),QC);
  s+=card(150,280,900,130,T2(QF,600,345,{size:60}),seg(p,.5,.65),QC);
  return s;
 },
 [K+'deep']:(p)=>card(300,150,600,170,label('なぜ そう なるかは',600,215,{size:34,color:C.ink,anchor:'middle',weight:700})+label('深く 学ぶ 版で',600,280,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
