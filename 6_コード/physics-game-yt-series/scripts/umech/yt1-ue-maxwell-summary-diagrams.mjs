// 大学編「マクスウェル方程式・上級・要点」(ys-ue-maxwell-summary) — 図。Stage 1200×515.
// 詳しい動画 ue-maxwell-1〜4 の図をそのまま呼び出す（同じ向き・同じ数値・同じ色：𝐄 水色、𝐁 橙）。
// よくある間違い・まとめ・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-ue-maxwell-3-diagrams.mjs';
import {ytUeMaxwell1Diagrams as M1} from './yt1-ue-maxwell-1-diagrams.mjs';
import {ytUeMaxwell2Diagrams as M2} from './yt1-ue-maxwell-2-diagrams.mjs';
import {ytUeMaxwell3Diagrams as M3} from './yt1-ue-maxwell-3-diagrams.mjs';
import {ytUeMaxwell4Diagrams as M4} from './yt1-ue-maxwell-4-diagrams.mjs';

const K='ue-maxwell-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'ue-maxwell-1'),u2=get(M2,'ue-maxwell-2'),u3=get(M3,'ue-maxwell-3'),u4=get(M4,'ue-maxwell-4');

function sumCard(p,q){
 const rows=[['定義','ε₀＝1/(4πk)'],['加えた項','変位電流（電荷保存に合う。証明ではない）'],['仮定','真空・なめらかな場・x 方向へ進む平面波'],
  ['導いた結果','波動方程式、c＝1/√(μ₀ε₀)'],['実験との比較','c と 測られた光の速さの一致']];
 let s='';
 rows.forEach(([h,t],i)=>{const y=28+i*94;const g=i<3?seg(p,.05+i*.12,.15+i*.12):(i===3?seg(q,.02,.3):seg(q,.45,.7));
  if(g<=0)return;s+=card(100,y,1000,80,label(h,140,y+50,{size:28,color:C.dim,weight:700})+label(t,380,y+51,{size:30,color:i>=3?C.hi:C.ink,weight:700}),g,i>=3?C.hi:C.faint);});
 return s;
}

export const ytUeMaxwellSummaryDiagrams={
 [K+'goal']:u1('setup'),
 [K+'add']:u1('add'),
 [K+'pair']:u2('pair'),
 [K+'wave']:u3('name'),
 [K+'c']:u3('c'),
 [K+'EB']:u4('3d'),
 [K+'contra']:u1('contra'),
 [K+'same']:u1('same'),
 [K+'status']:u1('status'),
 [K+'sum']:u2('sum1'),
 [K+'order']:u3('order'),
 [K+'divide']:u3('divide'),
 [K+'mult']:u3('mult'),
 [K+'sqrt']:u3('sqrt'),
 [K+'light']:u3('light'),
 [K+'hertz']:u3('hertz'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})
   +label('電磁波の曲線は、何かが',600,250,{size:34,color:C.ink,anchor:'middle'})+label('上下に揺れながら 飛んでいる？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'notmove']:u4('notmove'),
 [K+'summary']:(p)=>sumCard(p,0),
 [K+'summary2']:(p)=>sumCard(1,p),
 [K+'map']:u4('map'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
