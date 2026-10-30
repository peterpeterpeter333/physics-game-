// 大学編「ベクトル・上級・要点」(ys-um-vector-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図をそのまま呼び出す（同じ数値・同じ色）。締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmVector1Diagrams as V} from './yt1-um-vector-1-diagrams.mjs';

const K='um-vector-summary:';
const v=k=>{const f=V['um-vector-1:'+k];if(!f)throw new Error('missing '+k);return f;};

export const ytUmVectorSummaryDiagrams={
 [K+'goal']:v('lim'),
 [K+'v']:v('tangent'),
 [K+'a']:v('sum2'),
 [K+'why']:v('divres'),
 [K+'note']:v('note'),
 [K+'circ']:v('circ'),
 [K+'circv']:v('circv'),
 [K+'circa2']:v('circa2'),
 [K+'circa3']:v('circa3'),
 [K+'circgen']:v('circgen'),
 [K+'circcheck']:v('circcheck'),
 [K+'wrong']:v('circpred'),
 [K+'diff2']:v('circdiff2'),
 [K+'diff3']:v('circdiff2'),
 [K+'sum']:v('sum'),
 [K+'sum2']:v('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
