// 大学編「微分・中級・要点」(ys-um-average-rate-summary) — 図。Stage 1200×515.
// 詳しい動画（um-average-rate-1 / -2）の図を関数として再利用し、結論と締めのカードだけをここで描く。
// 色（anim.mjs C）：位置 x 水色、速度・傾き v 紫、時刻・幅 t,h 金、強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUmAvgRate1Diagrams as R1} from './yt1-um-average-rate-1-diagrams.mjs';
import {ytUmAvgRate2Diagrams as R2} from './yt1-um-average-rate-2-diagrams.mjs';

const K='um-average-rate-summary:';
const r1=k=>R1['um-average-rate-1:'+k],r2=k=>R2['um-average-rate-2:'+k];
const Hc=`{\\color{${C.t}}h}`;
const Q=`\\dfrac{(t+${Hc})^2-t^2}{${Hc}}`; // the difference quotient (same as um-average-rate-2)
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

export const ytUmAvgRateSummaryDiagrams={
 [K+'intro']:r1('plan'),
 [K+'rate']:r1('slope'),
 [K+'concl']:(p)=>{
  let s=label('結論',600,52,{size:28,color:C.dim,anchor:'middle'});
  s+=card(110,70,980,225,label('x ＝ t² の 差商',600,108,{size:26,color:C.dim,anchor:'middle'})+tex(`\\dfrac{dx}{dt}=\\lim_{h\\to 0}${Q}`,600,228,{size:46}),seg(p,.02,.18),C.hi);
  s+=card(330,315,540,150,tex('\\dfrac{dx}{dt}=2t',600,405,{size:46}),seg(p,.55,.7),C.v);
  return s;
 },
 [K+'func']:r2('func'),
 [K+'why']:r1('cancel'),
 [K+'expand']:r1('expand'),
 [K+'h01']:r1('h01'),
 [K+'ex']:r1('ex'),
 [K+'both']:r2('both'),
 [K+'limeq']:r2('limeq'),
 [K+'t12']:r2('t12'),
 [K+'notval']:r2('notval'),
 [K+'neg3']:r2('neg3'),
 [K+'graphs']:r2('graphs'),
 [K+'sum']:r2('sum'),
 [K+'back']:r2('back'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
