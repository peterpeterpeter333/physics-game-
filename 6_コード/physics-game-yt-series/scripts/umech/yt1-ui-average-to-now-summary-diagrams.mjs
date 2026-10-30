// 大学編「微分・初級・要点」(ys-ui-average-to-now-summary) — 図。Stage 1200×515.
// 詳しい動画（ui-average-to-now-a / -b）の図を関数として再利用し、結論・理由・締めのカードだけをここで描く。
// 色（anim.mjs C）：位置 x 水色、速さ v 紫、時刻・幅 t,h 金、強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUiAvgNowADiagrams as A} from './yt1-ui-average-to-now-a-diagrams.mjs';
import {ytUiAvgNowBDiagrams as B} from './yt1-ui-average-to-now-b-diagrams.mjs';

const K='ui-average-to-now-summary:';
const a=k=>A['ui-average-to-now-a:'+k],b=k=>B['ui-average-to-now-b:'+k];
const two=(f,g,s)=>p=>p<s?f(p/s):g((p-s)/(1-s));
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

export const ytUiAvgNowSummaryDiagrams={
 [K+'intro']:a('meter'),
 [K+'avg']:a('divide'),
 [K+'level']:a('level'),
 [K+'concl']:(p)=>{
  let s=label('結論',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(110,100,980,150,label('瞬間の速さ ＝ 幅を 0 へ 近づけたときの',600,160,{size:34,color:C.ink,anchor:'middle',weight:700})
   +label('平均の速さの 行き先',600,215,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.18),C.hi);
  s+=card(330,290,540,150,tex('v=\\dfrac{dx}{dt}',600,380,{size:56}),seg(p,.6,.75),C.v);
  return s;
 },
 [K+'why']:(p)=>{
  let s=label('なぜ 縮める？',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(110,100,980,110,label('平均 ＝ 区間全体を ならした 一つの値',600,170,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.18),C.v);
  s+=card(110,250,980,110,label('区間が 短いほど その瞬間だけの 速さに 近い',600,320,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'curve']:a('curve'),
 [K+'v15']:a('v15'),
 [K+'table']:a('table'),
 [K+'answer']:a('answer'),
 [K+'result']:b('parts'),
 [K+'limit']:b('limit'),
 [K+'zeroask']:b('zeroask'),
 [K+'merge']:b('merge'),
 [K+'checkbox']:b('checkbox'),
 [K+'check4']:b('check4'),
 [K+'notsub']:b('notsub'),
 [K+'sum']:b('sum'),
 [K+'meter']:b('meter'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
