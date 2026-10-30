// 高校編「ドップラー効果・要点」(ys-hs-w-doppler-summary) — 図。Stage 1200×515.
// 深く学ぶ版 1/3〜3/3 の図をそのまま使う（同じ言葉・記号・数値）。
import {C,seg,lin,fade,label} from './anim.mjs';
import {card,tag,T2,tSince,LC,TCOL,FC,VCOL,Lt,Tt,ft,HZ,MS,MM,SS,Vt,vst,vot,fp,eqRow,LB,
 dopplerScene,frameBy,FB,train,road,plate,hsWDoppler1Diagrams} from './yt1-hs-w-doppler-1-diagrams.mjs';
import {hsWDoppler2Diagrams} from './yt1-hs-w-doppler-2-diagrams.mjs';
import {hsWDoppler3Diagrams} from './yt1-hs-w-doppler-3-diagrams.mjs';

const K='hs-w-doppler-summary:';
const d1=k=>hsWDoppler1Diagrams['hs-w-doppler-1:'+k], d2=k=>hsWDoppler2Diagrams['hs-w-doppler-2:'+k], d3=k=>hsWDoppler3Diagrams['hs-w-doppler-3:'+k];

export const hsWDopplerSummaryDiagrams={
 // ---- 結論 ----
 [K+'c1']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'c1'),xs=-80+150*t;
  let s=road(t,{speed:150});
  s+=fade(seg(p,.15,.3)*(xs<600?1:0),label('近づく：高く 聞こえる',600,120,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(xs>=600?1:0,label('遠ざかる：低く 聞こえる',600,120,{size:32,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c2']:(p)=>d3('why')(p),
 [K+'c3']:(p)=>fade(.5,dopplerScene(0,{note:0}))+card(300,20,600,100,label('音の 速さ V は 変わらない',600,82,{size:32,color:VCOL,anchor:'middle',weight:700}),seg(p,.05,.2),VCOL),
 [K+'cond']:(p)=>{
  let s=fade(.4,dopplerScene(0,{note:0}));
  s+=card(150,30,900,170,label('空気は 静止・同じ 一直線上',600,90,{size:32,color:C.ink,anchor:'middle',weight:700})+label('動く 速さ ＜ 音の 速さ',600,155,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=tag('仮定',1080,60,{color:C.dim,g:seg(p,.3,.45)});
  return s;
 },
 // ---- なぜ ----
 [K+'w1']:(p)=>frameBy({u:lin(p,.1,.7),vt:seg(p,.1,.25),vst:seg(p,.4,.55),c2:seg(p,.7,.8)}),
 [K+'w2']:(p)=>dopplerScene(0,{front:seg(p,.1,.25),back:seg(p,.5,.65)}),
 [K+'w3']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'w3');
  let s=train(t,{sp:62});
  s+=card(150,380,900,110,label('間隔が 短い → 1秒に 届く 山が 増える → 高い',600,446,{size:30,color:FC,anchor:'middle',weight:700}),seg(p,.4,.55),FC);
  return s;
 },
 [K+'w4']:(p,ctx)=>d3('rel')(p,ctx&&{...ctx,scene:null}),
 // ---- 数値例 ----
 [K+'n1']:(p)=>{
  let s=card(200,40,800,120,T2(`${Vt}=340${MS},\\quad ${ft}=400${HZ}`,600,108,{size:46}),seg(p,.05,.2),C.dim);
  s+=card(250,250,700,130,T2(`${Lt}=340\\div 400=0.85${MM}`,600,322,{size:46}),seg(p,.5,.65),LC)+fade(seg(p,.55,.7),label('音源が 止まって いるとき',600,430,{size:26,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n2']:(p)=>frameBy({u:1,vt:1,vst:1,c2:1,gap:seg(p,.4,.6),nums:1})+card(250,4,700,132,T2(`20\\times 0.0025=0.050${MM}`,600,72,{size:44}),seg(p,.05,.2),VCOL),
 [K+'n3']:(p)=>{
  let s=card(200,60,800,140,T2(`${fp}=340\\div 0.80=425${HZ}`,600,140,{size:50}),seg(p,.05,.2),FC);
  s+=fade(seg(p,.5,.65),label('近づく → 高い',600,280,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n4']:(p)=>{
  let s=d2('num')(1);
  s+=card(420,222,440,80,T2(`340\\div 0.90\\approx 378${HZ}`,640,270,{size:36}),seg(p,.5,.65),FC);
  return s;
 },
 [K+'pass']:(p)=>d2('smooth')(p),
 [K+'n5']:(p)=>d3('count')(1),
 // ---- よくある間違い ----
 [K+'m1']:(p)=>d2('mis2')(p),
 [K+'m2']:(p)=>{
  let s=card(150,40,900,140,eqRow([...LB,`=\\dfrac{${Vt}+${vst}}{${ft}}`],600,122,{size:46}),seg(p,.05,.2),LC);
  s+=card(150,260,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}+${vst}}`,600,352,{size:50}),seg(p,.45,.6),FC);
  s+=fade(seg(p,.05,.2),label('遠ざかる 音源の 後ろ（広がる）',600,230,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'m3']:(p)=>d2('sum')(1),
 // ---- まとめ ----
 [K+'e1']:(p)=>d3('table')(1),
 [K+'e2']:(p)=>card(250,140,700,160,label('なぜ そうなるかは',600,205,{size:30,color:C.dim,anchor:'middle'})+label('深く学ぶ版で',600,265,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
