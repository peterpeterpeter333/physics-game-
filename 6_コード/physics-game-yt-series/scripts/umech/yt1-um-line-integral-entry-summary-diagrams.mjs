// 大学編「線積分と面積分・中級・要点」(ys-um-line-integral-entry-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmLineIntegralEntry1Diagrams as M1} from './yt1-um-line-integral-entry-1-diagrams.mjs';
import {ytUmLineIntegralEntry2Diagrams as M2} from './yt1-um-line-integral-entry-2-diagrams.mjs';

const K='um-line-integral-entry-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'um-line-integral-entry-1'),u2=get(M2,'um-line-integral-entry-2');

export const ytUmLineIntegralEntrySummaryDiagrams={
 [K+'goal']:u2('name'),
 [K+'qE']:u2('out'),
 [K+'dep']:u2('summary2'),
 [K+'why']:u1('perp'),
 [K+'piece']:u1('piece'),
 [K+'lim']:u2('lim'),
 [K+'rev']:u2('rev2'),
 [K+'sum4']:u1('sum4'),
 [K+'rev3']:u2('rev3'),
 [K+'field']:u2('field'),
 [K+'n4']:u2('n4'),
 [K+'n8']:u2('n8'),
 [K+'pA']:u2('pA2'),
 [K+'pB']:u2('pB'),
 [K+'compare']:u2('compare'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('q と同じように',600,250,{size:34,color:C.ink,anchor:'middle'})+label('𝐄 も 積分の外に 出す？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'out']:u2('out'),
 [K+'ans']:u2('ans'),
 [K+'sum']:u2('summary'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
