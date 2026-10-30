// 高校編「加速度・要点」(ys-hs-m1-acceleration-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/2・2/2 と同じ図・数値を使う（同じ絵を関数として呼ぶ）。
import {C,seg,fade,label,arrow,tex} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {hsAcceleration1Diagrams as A1} from './yt1-hs-m1-acceleration-1-diagrams.mjs';
import {hsAcceleration2Diagrams as A2} from './yt1-hs-m1-acceleration-2-diagrams.mjs';

const K='hs-m1-acceleration-summary:';
const a1=k=>A1['hs-m1-acceleration-1:'+k],a2=k=>A2['hs-m1-acceleration-2:'+k];

export const hsAccelerationSummaryDiagrams={
 [K+'define']:a1('define'),
 [K+'formula']:a1('formula'),
 [K+'graph']:a2('sum2'),
 [K+'slope']:a2('slope'),
 [K+'check']:(p)=>a1('per1')(1),
 [K+'table2']:(p)=>a2('result')(1),
 [K+'why']:(p)=>{
  let s=label('どちらも 速度が 0 → 20 m/s',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=card(110,120,980,120,label('4 s で',260,192,{size:32,color:C.t,anchor:'middle',weight:700})+label('20 ÷ 4 ＝ 5 m/s²',700,192,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.25),C.a);
  s+=card(110,280,980,120,label('10 s で',260,352,{size:32,color:C.t,anchor:'middle',weight:700})+label('20 ÷ 10 ＝ 2 m/s²',700,352,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.4,.55),C.a);
  s+=fade(seg(p,.7,.85),label('時間で 割って 1 s あたりに 直す',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'again']:(p)=>{
  let s=card(60,150,480,190,label('速さ',300,225,{size:36,color:C.v,anchor:'middle',weight:700})+label('道のり ÷ 時間',300,285,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.v);
  s+=arrow(560,245,640,245,{color:C.dim,w:4,g:seg(p,.3,.45)});
  s+=card(660,150,480,190,label('加速度',900,225,{size:36,color:C.a,anchor:'middle',weight:700})+label('速度の変化 ÷ 時間',900,285,{size:30,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.a);
  s+=fade(seg(p,.65,.8),label('同じ「1 s あたりに 直す」',600,430,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'car20']:a1('car20'),
 [K+'per1']:a1('per1'),
 [K+'unit']:a1('unit4'),
 [K+'brake']:a2('brake'),
 [K+'calc']:a2('calc'),
 [K+'decel']:a2('decel'),
 [K+'wrong']:(p)=>card(150,130,900,220,label('a ＜ 0 なら いつも 減速？',600,225,{size:42,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.4,.55),label('まちがい',600,295,{size:38,color:C.a,anchor:'middle',weight:700})),seg(p,.05,.2),C.a),
 [K+'left']:a2('left'),
 [K+'calc2']:(p)=>{
  let s=fade(seg(p,.03,.2),tex('a=\\dfrac{(-5)-(-2)}{1.0}',420,200,{size:52}));
  s+=fade(seg(p,.35,.5),tex('=-3\\,\\mathrm{m/s^2}',850,200,{size:52,auto:false,color:C.a}));
  s+=card(250,340,700,90,label('ブレーキの例と 同じ −3 m/s²',600,397,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.6,.75),C.a);
  return s;
 },
 [K+'speedup']:a2('speedup'),
 [K+'table']:a2('result'),
 [K+'sum']:(p)=>{
  let s=card(80,50,500,170,label('加速度',330,115,{size:36,color:C.a,anchor:'middle',weight:700})+label('＝ 1 s あたりの 速度の変化',330,175,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.a);
  s+=card(620,50,500,170,tex('a=\\dfrac{v-v_0}{t}',870,140,{size:52}),seg(p,.25,.4),C.a);
  s+=card(250,260,700,150,label('v-t グラフの 傾き ＝ 加速度',600,345,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'minus']:a2('rule'),
 [K+'deep']:(p)=>card(200,130,800,220,label('なぜ そうなるかは',600,215,{size:34,color:C.ink,anchor:'middle'})+label('深く学ぶ版で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
