// 高校編「速度・要点」(ys-hs-m1-velocity-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/2・2/2 と同じ図・数値を使う（同じ絵を関数として呼ぶ）。
import {C,seg,fade,label,tex} from './anim.mjs';
import {hsVelocity1Diagrams as V1,card,strip,SM,SX0,PA} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {hsVelocity2Diagrams as V2,xtAxes,xtLine,slopeTri,L1} from './yt1-hs-m1-velocity-2-diagrams.mjs';

const K='hs-m1-velocity-summary:';
const v1=k=>V1['hs-m1-velocity-1:'+k],v2=k=>V2['hs-m1-velocity-2:'+k];

export const hsVelocitySummaryDiagrams={
 [K+'speed']:(p)=>{
  let s=label('100 m を 20 s',SM(100),110,{size:26,color:C.x,anchor:'end'})+label('Aさん',SX0,110,{size:26,color:PA,weight:700});
  s+=strip(190,100,{n:20,color:PA,hl:seg(p,.3,.4)>.5?0:-1});
  s+=fade(seg(p,.4,.55),label('1 s ぶん ＝ 5 m',SM(2.5),260,{size:28,color:C.hi}));
  s+=card(250,330,700,110,label('速さ ＝ 1 s あたりの 道のり',600,400,{size:38,color:C.v,anchor:'middle',weight:700}),seg(p,.6,.75),C.v);
  return s;
 },
 [K+'formula']:v1('define'),
 [K+'velocity']:v2('sign'),
 [K+'graph']:(p)=>{
  const A=xtAxes();let s=A.svg+xtLine(A,L1,{p:seg(p,.05,.35)});
  s+=slopeTri(A,L1,0,2,{g:seg(p,.35,.55),dt:'2 s',dx:'6 m'});
  s+=card(740,140,420,170,label('傾き 6 ÷ 2 ＝ 3',950,205,{size:32,color:C.ink,anchor:'middle',weight:700})+label('速度 ＋3 m/s',950,265,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.55,.7),C.v);
  return s;
 },
 [K+'why']:v1('difftime'),
 [K+'unfair']:v1('difftime'),
 [K+'align']:v1('idea'),
 [K+'race']:v1('race'),
 [K+'oneA']:v1('oneA'),
 [K+'oneB']:v1('oneB'),
 [K+'compare']:v1('compare'),
 [K+'average']:v1('same5'),
 [K+'trip']:v1('trip'),
 [K+'wrong']:(p)=>card(120,140,960,170,label('(60 ＋ 40) ÷ 2 ＝ 50',420,240,{size:42,color:C.dim,anchor:'middle'})+label('まちがい',870,240,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a),
 [K+'right']:v1('calc'),
 [K+'pull']:v1('pull'),
 [K+'check']:(p)=>card(170,140,860,200,label('確かめ',600,200,{size:28,color:C.dim,anchor:'middle'})+label('48 km/h × 5 時間 ＝ 240 km',600,270,{size:40,color:C.v,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('＝ 往復の道のり 120 ＋ 120',600,320,{size:26,color:C.x,anchor:'middle'})),seg(p,.05,.2),C.v),
 [K+'rule']:v1('back'),
 [K+'sum']:(p)=>{
  let s=card(80,50,500,170,label('速さ',330,115,{size:36,color:C.v,anchor:'middle',weight:700})+label('＝ 道のり ÷ かかった時間',330,175,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.v);
  s+=card(620,50,500,170,label('速度 v',870,115,{size:36,color:C.v,anchor:'middle',weight:700})+label('＝ 向きの付いた 速さ',870,175,{size:28,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.v);
  s+=card(250,250,700,210,label('x-t グラフの 傾き ＝ 速度',600,310,{size:36,color:C.hi,anchor:'middle',weight:700})+tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',600,395,{size:40}),seg(p,.7,.85),C.hi);
  return s;
 },
 [K+'minus']:v2('answer'),
 [K+'deep']:(p)=>card(200,130,800,220,label('なぜ そうなるかは',600,215,{size:34,color:C.ink,anchor:'middle'})+label('深く学ぶ版で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
