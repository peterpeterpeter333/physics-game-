// 大学編「外積・上級・要点」(ys-um-cross-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card,T} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmCross1Diagrams as V1} from './yt1-um-cross-1-diagrams.mjs';
import {ytUmCross2Diagrams as V2} from './yt1-um-cross-2-diagrams.mjs';

const K='um-cross-summary:';
const get=(M,id,k)=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const v1=k=>get(V1,'um-cross-1',k),v2=k=>get(V2,'um-cross-2',k);

export const ytUmCrossSummaryDiagrams={
 [K+'three']:v1('three'),
 [K+'result']:v1('result'),
 [K+'recap']:v1('sum2'),
 [K+'write']:v1('write'),
 [K+'zero']:v1('zero'),
 [K+'xcomp']:v1('xcomp'),
 [K+'setup']:v2('setup'),
 [K+'force']:v2('force'),
 [K+'nx']:v2('nx'),
 [K+'ny']:v2('ny'),
 [K+'nz']:v2('nz'),
 [K+'nres']:v2('nres'),
 [K+'nperp']:v2('nperp'),
 [K+'msetup']:v2('msetup'),
 [K+'mz']:v2('mz'),
 [K+'mq']:v2('mq'),
 [K+'mpos']:v2('mpos'),
 [K+'sum']:v1('sum'),
 [K+'sum2']:(p)=>{
  let s=card(200,90,800,130,label('9 項 − 同じ向きの 3 項 ＝ 6 項',600,140,{size:30,color:C.hi,anchor:'middle',weight:700})+label('→ 成分の式',600,195,{size:30,color:C.ink,anchor:'middle'}),seg(p,.03,.18));
  s+=card(200,260,800,130,label('磁気力：',400,322,{size:30,color:C.ink,anchor:'middle',weight:700})+T('q\\,({\\color{'+C.v+'}{\\mathbf{v}}}\\times{\\color{'+C.E+'}{\\mathbf{B}}})',620,303,{size:40,anchor:'middle'})+label('q の符号は 最後に',600,372,{size:26,color:C.hi,anchor:'middle'}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
