// 大学編「位置エネルギー・初級・要点」(ys-ui-potential-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUiPotential1Diagrams as P1} from './yt1-ui-potential-1-diagrams.mjs';

const K='ui-potential-summary:';
const u=k=>{const f=P1['ui-potential-1:'+k];if(!f)throw new Error('missing ui-potential-1:'+k);return f;};

export const ytUiPotentialSummaryDiagrams={
 [K+'goal']:u('back'),
 [K+'defU']:u('defU'),
 [K+'cons']:u('conservative'),
 [K+'why']:u('same'),
 [K+'stairs']:u('stairs'),
 [K+'assign']:u('assign'),
 [K+'nofric']:u('nofric'),
 [K+'lift']:u('lift'),
 [K+'weight']:u('weight'),
 [K+'hand']:u('hand'),
 [K+'handW']:u('handW'),
 [K+'mgh']:u('mgh'),
 [K+'drop']:u('drop'),
 [K+'back']:u('back'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('U の 値そのものに 意味が ある？',600,250,{size:34,color:C.ink,anchor:'middle'})+label('マイナスの U は おかしい？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'floor']:u('floor'),
 [K+'negative']:u('negative'),
 [K+'diff']:u('diff'),
 [K+'free']:u('free'),
 [K+'sum']:u('sum'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
