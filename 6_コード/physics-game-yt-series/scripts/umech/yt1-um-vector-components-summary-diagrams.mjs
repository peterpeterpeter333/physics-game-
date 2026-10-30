// 大学編「ベクトル・中級・要点」(ys-um-vector-components-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図をそのまま呼び出す（同じ数値・同じ色）。締めのカードだけ ここで描く。
import {C,seg,fade,label} from './anim.mjs';
import {card,T} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmVectorComponents1Diagrams as V} from './yt1-um-vector-components-1-diagrams.mjs';

const K='um-vector-components-summary:';
const v=k=>{const f=V['um-vector-components-1:'+k];if(!f)throw new Error('missing '+k);return f;};

export const ytUmVectorComponentsSummaryDiagrams={
 [K+'goal']:v('bundle'),
 [K+'len']:v('formula'),
 [K+'unit']:(p)=>{
  const vB='{\\color{'+C.E+'}{\\mathbf{B}}}',hB='{\\color{'+C.E+'}{\\hat{\\mathbf{B}}}}';
  let s=card(120,40,960,190,T(hB+'=\\dfrac{'+vB+'}{|'+vB+'|}',330,135,{size:50})+label('全部の成分 ÷ 長さ',780,148,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.03,.15));
  s+=fade(seg(p,.15,.3),T('\\dfrac{(0,\\,3,\\,4)}{5}=(0,\\,0.6,\\,0.8)',600,300,{size:40}));
  s+=card(120,350,960,120,label('零ベクトル (0, 0, 0)：長さ 0 → 割れない',600,422,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.55,.68),C.a);
  return s;
 },
 [K+'pos']:v('pos2'),
 [K+'why']:v('eq'),
 [K+'ma']:v('ma'),
 [K+'ball']:v('ball'),
 [K+'ball2']:v('ball2'),
 [K+'rows']:v('rows'),
 [K+'rows2']:v('rows2'),
 [K+'rows3']:v('rows3'),
 [K+'path2']:v('path2'),
 [K+'wrong']:v('pos'),
 [K+'pos2']:v('pos2'),
 [K+'pos3']:v('pos3'),
 [K+'shift']:v('shift'),
 [K+'shift2']:v('shift2'),
 [K+'sum']:v('summary'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
