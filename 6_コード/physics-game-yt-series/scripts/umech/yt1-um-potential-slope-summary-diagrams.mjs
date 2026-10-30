// 大学編「位置エネルギー・中級・要点」(ys-um-potential-slope-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。締めのカードだけ ここで描く。
import {C,seg,label,tex} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmPotentialSlope1Diagrams as S1} from './yt1-um-potential-slope-1-diagrams.mjs';
import {ytUmPotentialSlope2Diagrams as S2} from './yt1-um-potential-slope-2-diagrams.mjs';

const K='um-potential-slope-summary:';
const get=(M,id,k)=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const a=k=>get(S1,'um-potential-slope-1',k),b=k=>get(S2,'um-potential-slope-2',k);

export const ytUmPotentialSlopeSummaryDiagrams={
 [K+'goal']:b('cycle'),
 [K+'formula']:a('formula'),
 [K+'rule']:b('rule'),
 [K+'sum2']:b('sum2'),
 [K+'relU']:a('relU'),
 [K+'solve']:b('solve'),
 [K+'fric']:b('fricnum'),
 [K+'nums']:a('nums'),
 [K+'sub']:a('sub'),
 [K+'integ']:a('integ'),
 [K+'triNum']:a('triNum'),
 [K+'bars']:a('bars'),
 [K+'num']:b('num'),
 [K+'wrong']:(p)=>card(220,70,760,360,label('よくある間違い',600,120,{size:30,color:C.a,anchor:'middle',weight:700})+tex(`F={\\color{${C.hi}}-}\\dfrac{{\\color{${C.E}}dU}}{dx}`,600,250,{size:54})+label('この 負号は「力が いつも 負」？',600,385,{size:34,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'left']:b('left'),
 [K+'ans']:b('ans'),
 [K+'base']:b('base'),
 [K+'kinds']:a('kinds'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
