// 大学編「外積・初級・要点」(ys-ui-cross-product-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card,T} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUiCrossProduct1Diagrams as V1} from './yt1-ui-cross-product-1-diagrams.mjs';
import {ytUiCrossProduct2Diagrams as V2} from './yt1-ui-cross-product-2-diagrams.mjs';

const K='ui-cross-product-summary:';
const get=(M,id,k)=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const AxB=`{\\color{${C.x}}\\mathbf{A}}\\times{\\color{${C.F}}\\mathbf{B}}`,BxA=`{\\color{${C.F}}\\mathbf{B}}\\times{\\color{${C.x}}\\mathbf{A}}`;
const v1=k=>get(V1,'ui-cross-product-1',k),v2=k=>get(V2,'ui-cross-product-2',k);

export const ytUiCrossProductSummaryDiagrams={
 [K+'goal']:v2('notation'),
 [K+'size']:v2('build'),
 [K+'dir']:v2('loosen'),
 [K+'two']:v2('two'),
 [K+'along']:v1('along2'),
 [K+'sin']:v1('sin'),
 [K+'sym']:v1('sym'),
 [K+'area']:v2('area'),
 [K+'door']:v1('door'),
 [K+'door2']:v1('door2'),
 [K+'rect']:v2('door'),
 [K+'door3']:v1('door3'),
 [K+'wrench']:v2('wrench'),
 [K+'wrong']:(p)=>card(250,110,700,250,label('よくある間違い',600,180,{size:30,color:C.a,anchor:'middle',weight:700})+T(AxB+'\\;\\overset{?}{=}\\;'+BxA,600,270,{size:56,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'reverse']:v2('reverse'),
 [K+'reverse2']:v2('reverse2'),
 [K+'sum1']:v2('sum1'),
 [K+'sum2']:v2('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
