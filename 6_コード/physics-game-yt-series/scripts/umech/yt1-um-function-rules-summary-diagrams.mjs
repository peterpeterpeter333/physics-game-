// 大学編「微分の法則・中級・要点」(ys-um-function-rules-summary) — 図。Stage 1200×515.
// 中級 1/2・2/2 の図をそのまま呼ぶ（数値・色・記号も同じ。h は山の高さ）。締めのカードだけここで描く。
import {C,fade,seg,rect,label} from './anim.mjs';
import {ytUmFunctionRules1Diagrams as F1} from './yt1-um-function-rules-1-diagrams.mjs';
import {ytUmFunctionRules2Diagrams as F2} from './yt1-um-function-rules-2-diagrams.mjs';

const K='um-function-rules-summary:';
const f1=k=>F1['um-function-rules-1:'+k],f2=k=>F2['um-function-rules-2:'+k];
// 元の図の進行 p の一部分 [a,b] だけを、この cue の 0→1 に割り当てる
const part=(f,a,b)=>(p,ctx)=>f(a+(b-a)*p,ctx);
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

export const ytUmFunctionRulesSummaryDiagrams={
 [K+'goal']:f1('goal'),
 [K+'cmp1']:part(f1('cmp'),0,.38),
 [K+'cmp2']:part(f1('cmp'),.38,1),
 [K+'def']:f2('def'),
 [K+'sym']:f2('sym'),
 [K+'split']:f1('split'),
 [K+'split2']:f1('split2'),
 [K+'div3']:f1('div3'),
 [K+'ex']:f1('ex'),
 [K+'tbl2']:f1('tbl2'),
 [K+'tbl3']:f1('tbl3'),
 [K+'nums']:f1('nums'),
 [K+'nums2']:f1('nums2'),
 [K+'lim2']:f1('lim2'),
 [K+'exp2']:f1('exp2'),
 [K+'err1']:part(f2('error'),0,.5),
 [K+'calc']:f2('calc'),
 [K+'contrast']:f2('contrast'),
 [K+'sum']:f1('sum'),
 [K+'sum1']:f2('sum1'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
