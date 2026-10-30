// 大学編「慣性モーメント・初級・要点」(ys-ui-inertia-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUiInertia1Diagrams as M1} from './yt1-ui-inertia-1-diagrams.mjs';

const K='ui-inertia-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'ui-inertia-1');

export const ytUiInertiaSummaryDiagrams={
 [K+'goal']:u1('sum3'),
 [K+'cog']:u1('sum1'),
 [K+'rot']:u1('sum2'),
 [K+'why1']:u1('move'),
 [K+'omega']:u1('omega'),
 [K+'why2']:u1('kin2'),
 [K+'seesaw']:u1('seesaw'),
 [K+'three']:u1('three'),
 [K+'plug']:u1('plug'),
 [K+'two']:u1('two'),
 [K+'two2']:u1('two2'),
 [K+'inertia']:u1('inertia'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('つり合う点は',600,250,{size:34,color:C.ink,anchor:'middle'})+label('いつも 真ん中？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'mid']:u1('mid'),
 [K+'heavy']:u1('heavy'),
 [K+'mass']:u1('mass'),
 [K+'sum']:(p)=>u1('sum3')(.3+.7*p),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
