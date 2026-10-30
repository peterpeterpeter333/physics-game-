// 大学編「位置エネルギー・上級・要点」(ys-uc-potential-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUcPotential1Diagrams as P1} from './yt1-uc-potential-1-diagrams.mjs';
import {ytUcPotential2Diagrams as P2} from './yt1-uc-potential-2-diagrams.mjs';

const K='uc-potential-summary:';
const get=(M,id,k)=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const a=k=>get(P1,'uc-potential-1',k),b=k=>get(P2,'uc-potential-2',k);
// 山頂の近くに玉があると「山」の字に重なるので、字を少し上へ
const liftHill=f=>(p,ctx)=>f(p,ctx).replace(/(<text[^>]*?)y="([\d.]+)"([^>]*>山<\/text>)/,(m,a,y,c)=>`${a}y="${(+y-18).toFixed(2)}"${c}`);

export const ytUcPotentialSummaryDiagrams={
 [K+'goal']:a('graph'),
 [K+'mg']:a('mg'),
 [K+'thm']:a('thm'),
 [K+'read']:b('sum'),
 [K+'sign']:a('sign2'),
 [K+'move']:a('move'),
 [K+'rule']:b('rule'),
 [K+'land']:b('land'),
 [K+'eline']:b('eline'),
 [K+'cross']:b('cross'),
 [K+'range']:(p,ctx)=>b('range')(p,ctx).replace(/(<text[^>]*?)y="([\d.]+)"([^>]*>動ける 範囲)/,(m,a,y,c)=>`${a}y="${(+y+46).toFixed(2)}"${c}`), // 「動ける 範囲」を線の下へ（「谷」と重ならないように）
 [K+'turn']:b('turn'),
 [K+'v1']:b('v1'),
 [K+'v2']:b('v2'),
 [K+'h1']:liftHill(b('h1')),
 [K+'h2']:liftHill(b('h2')),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('力が 0 の 点なら、いつも 安定？',600,275,{size:36,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'lesson']:b('lesson'),
 [K+'sum']:b('sum'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
