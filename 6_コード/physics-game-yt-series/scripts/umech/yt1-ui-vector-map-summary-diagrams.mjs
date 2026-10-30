// 大学編「ベクトル・初級・要点」(ys-ui-vector-map-summary) — 図。Stage 1200×515.
// 詳しい動画 1/3・2/3・3/3 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・まとめ・締めのカードだけ ここで描く。
// 色：𝐀 桃(C.p)、x 成分 水色(C.x)、y 成分 紫(C.v)、強調 黄、誤り 赤。
import {C,seg,fade,label} from './anim.mjs';
import {card,T} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUiVectorMap1Diagrams as V1} from './yt1-ui-vector-map-1-diagrams.mjs';
import {ytUiVectorMap2Diagrams as V2} from './yt1-ui-vector-map-2-diagrams.mjs';
import {ytUiVectorMap3Diagrams as V3} from './yt1-ui-vector-map-3-diagrams.mjs';

const K='ui-vector-map-summary:';
const v1=k=>V1['ui-vector-map-1:'+k],v2=k=>V2['ui-vector-map-2:'+k],v3=k=>V3['ui-vector-map-3:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const vA=cs(C.p,'\\mathbf{A}'),vB=cs(C.p,'\\mathbf{B}');
const Ax2=cs(C.x,'A_x^{2}'),Ay2=cs(C.v,'A_y^{2}');

// three rule cards; nums=1 shows the worked numbers of 𝐀＝(3, −2), 𝐁＝(−1, 4)
function rules(p,nums){
 let s='';
 s+=card(80,40,1040,130,label('成分の 符号 ＝ 向き',330,118,{size:32,color:C.ink,anchor:'middle',weight:700})
  +(nums?T(`${vA}=(${cs(C.x,'3')},\\,${cs(C.v,'-2')})`,820,105,{size:42}):label('マイナス ＝ 左・下',820,118,{size:30,color:C.hi,anchor:'middle'})),seg(p,.03,.15));
 s+=card(80,190,1040,130,label('長さ ＝ 三平方',330,268,{size:32,color:C.ink,anchor:'middle',weight:700})
  +(nums?T(`|${vA}|=\\sqrt{13}\\approx3.6`,820,255,{size:42}):T(`|${vA}|=\\sqrt{${Ax2}+${Ay2}}`,820,255,{size:42})),seg(p,nums?.25:.3,nums?.37:.42));
 s+=card(80,340,1040,130,label('足し算・引き算 ＝ 成分ごと',330,418,{size:32,color:C.ink,anchor:'middle',weight:700})
  +(nums?T(`${vA}+${vB}=(2,\\,2)`,820,405,{size:42}):label('x は x、y は y どうし',820,418,{size:30,color:C.hi,anchor:'middle'})),seg(p,nums?.5:.62,nums?.62:.75),C.hi);
 return s;
}

export const ytUiVectorMapSummaryDiagrams={
 [K+'goal']:v1('arrow'),
 [K+'notation']:v1('general'),
 [K+'rules']:(p)=>rules(p,0),
 [K+'field']:v3('map'),
 [K+'why']:v1('anyarrow'),
 [K+'why2']:v2('chain'),
 [K+'ex']:v1('pair'),
 [K+'len']:v1('pyth3'),
 [K+'add']:v2('sum'),
 [K+'sub']:v2('tips'),
 [K+'wrong']:v1('lenq'),
 [K+'tri']:v1('triangle'),
 [K+'measure']:v1('measure'),
 [K+'length']:v2('length'),
 [K+'neverneg']:v1('neverneg'),
 [K+'sum']:(p)=>rules(p,1),
 [K+'sum2']:v2('summary2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
