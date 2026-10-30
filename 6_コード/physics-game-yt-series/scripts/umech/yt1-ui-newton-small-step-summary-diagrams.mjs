// 大学編「運動方程式・初級・要点」(ys-ui-newton-small-step-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card,T} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUiNewton1Diagrams as N1} from './yt1-ui-newton-small-step-1-diagrams.mjs';
import {ytUiNewton2Diagrams as N2} from './yt1-ui-newton-small-step-2-diagrams.mjs';

const K='ui-newton-small-step-summary:';
const get=(M,id,k)=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const n1=k=>get(N1,'ui-newton-small-step-1',k),n2=k=>get(N2,'ui-newton-small-step-2',k);

export const ytUiNewtonSummaryDiagrams={
 [K+'goal']:n1('answer'),
 [K+'sum1']:n1('sum1'),
 [K+'law']:n1('law'),
 [K+'chain']:n2('sum1'),
 [K+'why']:n1('v0'),
 [K+'v0']:n1('v0'),
 [K+'v0b']:n1('v0b'),
 [K+'sum']:n1('sum'),
 [K+'num']:n1('num'),
 [K+'mass2']:n1('mass2'),
 [K+'dv']:n1('dv'),
 [K+'t4']:n2('t4'),
 [K+'xcol']:n2('xcol'),
 [K+'t2b']:n2('t2b'),
 [K+'wrong']:(p)=>card(220,100,760,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('力を 0 にすると、速度も 0 に戻る？',600,270,{size:36,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'off1']:n2('off1'),
 [K+'off2']:n2('off2'),
 [K+'off4']:n2('off4'),
 [K+'sum2']:n2('sum2'),
 [K+'sum3']:n2('sum3'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
