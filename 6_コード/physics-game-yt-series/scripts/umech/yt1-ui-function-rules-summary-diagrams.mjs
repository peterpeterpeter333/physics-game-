// 大学編「微分の法則・初級・要点」(ys-ui-function-rules-summary) — 図。Stage 1200×515.
// 初級 1/2・2/2 の図をそのまま呼ぶ（数値・色も同じ）。締めのカードだけここで描く。
import {C,fade,seg,rect,label} from './anim.mjs';
import {ytUiFunctionRules1Diagrams as F1} from './yt1-ui-function-rules-1-diagrams.mjs';
import {ytUiFunctionRules2Diagrams as F2} from './yt1-ui-function-rules-2-diagrams.mjs';

const K='ui-function-rules-summary:';
const f1=k=>F1['ui-function-rules-1:'+k],f2=k=>F2['ui-function-rules-2:'+k];
// 元の図の進行 p の一部分 [a,b] だけを、この cue の 0→1 に割り当てる
const part=(f,a,b)=>(p,ctx)=>f(a+(b-a)*p,ctx);
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

export const ytUiFunctionRulesSummaryDiagrams={
 [K+'machine']:f1('machine'),
 [K+'chain']:f1('chain'),
 [K+'prod']:f1('prod'),
 [K+'mulv']:f2('mulv'),
 [K+'ladder']:f2('sum2'),
 [K+'mult']:f1('mult'),
 [K+'gen']:f1('gen'),
 [K+'arc']:f2('sum3'),
 [K+'machine1']:f1('machine1'),
 [K+'gear1']:f1('gear1'),
 [K+'gear2']:f1('gear2'),
 [K+'gear2b']:f1('gear2b'),
 [K+'gears']:f1('gears'),
 [K+'num2']:f1('num2'),
 [K+'nine']:f1('nine'),
 [K+'mis1']:part(f1('rule'),0,.3),
 [K+'mis2']:part(f1('rule'),.3,1),
 [K+'outin']:f2('sum1'),
 [K+'sum']:f1('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
