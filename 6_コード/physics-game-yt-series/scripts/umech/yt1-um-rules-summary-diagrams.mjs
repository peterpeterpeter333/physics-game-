// 大学編「微分の法則・上級・要点」(ys-um-rules-summary) — 図。Stage 1200×515.
// 上級 1/2・2/2 の図をそのまま呼ぶ（数値・色・記号も同じ。h は山の高さ）。締めのカードだけここで描く。
import {C,fade,seg,rect,label} from './anim.mjs';
import {ytUmRules1Diagrams as F1} from './yt1-um-rules-1-diagrams.mjs';
import {ytUmRules2Diagrams as F2} from './yt1-um-rules-2-diagrams.mjs';

const K='um-rules-summary:';
const f1=k=>F1['um-rules-1:'+k],f2=k=>F2['um-rules-2:'+k];
// 元の図の進行 p の一部分 [a,b] だけを、この cue の 0→1 に割り当てる
const part=(f,a,b)=>(p,ctx)=>f(a+(b-a)*p,ctx);
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

export const ytUmRulesSummaryDiagrams={
 [K+'proof']:f1('proof'),
 [K+'tools1']:part(f1('sum2'),0,.38),
 [K+'tools2']:part(f1('sum2'),.38,1),
 [K+'lim']:f2('lim'),
 [K+'name']:f2('name'),
 [K+'rewrite3']:f1('rewrite3'),
 [K+'eq']:f1('eq'),
 [K+'step']:f2('step'),
 [K+'north']:f2('sum'),
 [K+'recap2']:f2('recap2'),
 [K+'walk']:f2('walk'),
 [K+'calc']:f2('calc'),
 [K+'numchk']:f2('numchk'),
 [K+'direct']:f2('direct'),
 [K+'direct2']:f2('direct2'),
 [K+'wrong1']:part(f2('wrong'),0,.45),
 [K+'wrong2']:part(f2('wrong'),.45,1),
 [K+'sum1']:f1('sum2'),
 [K+'sum2']:f2('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
