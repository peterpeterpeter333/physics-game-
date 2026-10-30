// 大学編「外積・中級・要点」(ys-um-cross-product-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card,T} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmCrossProduct1Diagrams as V1} from './yt1-um-cross-product-1-diagrams.mjs';
import {ytUmCrossProduct2Diagrams as V2} from './yt1-um-cross-product-2-diagrams.mjs';

const K='um-cross-product-summary:';
const get=(M,id,k)=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const v1=k=>get(V1,'um-cross-product-1',k),v2=k=>get(V2,'um-cross-product-2',k);

export const ytUmCrossProductSummaryDiagrams={
 [K+'goal']:v1('rule'),
 [K+'minus']:v1('minus'),
 [K+'cycle']:v2('sum1'),
 [K+'info']:v1('info'),
 [K+'arrow']:v1('arrow'),
 [K+'yz']:v2('yz'),
 [K+'yz2']:v2('yz2'),
 [K+'torque']:v2('torque'),
 [K+'door']:v2('door'),
 [K+'door2']:v2('door2'),
 [K+'door3']:v2('door3'),
 [K+'forder']:v2('forder'),
 [K+'quizans']:v1('quizans'),
 [K+'sum1']:v1('sum1'),
 [K+'sum2']:(p)=>{
  let s=label('まとめ',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(250,110,700,110,label('表 ＋ 分配法則 → 右ねじなしで計算',600,175,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.03,.18));
  s+=card(250,250,700,110,label('トルク：',470,315,{size:32,color:C.p,anchor:'middle',weight:700})+T('{\\color{'+C.x+'}{\\mathbf{r}}}',560,295,{size:40})+label('が先、',640,315,{size:32,color:C.p,anchor:'middle',weight:700})+T('{\\color{'+C.F+'}{\\mathbf{F}}}',705,295,{size:40})+label('が後',780,315,{size:32,color:C.p,anchor:'middle',weight:700}),seg(p,.4,.55),C.p);
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
