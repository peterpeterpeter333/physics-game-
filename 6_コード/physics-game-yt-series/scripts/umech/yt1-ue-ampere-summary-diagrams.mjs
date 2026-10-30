// 大学編「アンペールの法則・上級・要点」(ys-ue-ampere-summary) — 図。Stage 1200×515.
// 詳しい動画 1/3・2/3・3/3 の図をそのまま呼び出す（同じ向き・同じ数値・同じ色：𝐁 橙、I・d𝐥 緑、𝐫̂ 桃、r・R・L 白）。
// よくある間違い・まとめ・締めのカードだけ ここで描く。
import {C,seg,fade,label} from './anim.mjs';
import {cs,T,card,CB,CI,Ic} from './yt1-ue-ampere-1-diagrams.mjs';
import {ytUeAmpere1Diagrams as M1} from './yt1-ue-ampere-1-diagrams.mjs';
import {ytUeAmpere2Diagrams as M2} from './yt1-ue-ampere-2-diagrams.mjs';
import {ytUeAmpere3Diagrams as M3} from './yt1-ue-ampere-3-diagrams.mjs';

const K='ue-ampere-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'ue-ampere-1'),u2=get(M2,'ue-ampere-2'),u3=get(M3,'ue-ampere-3');
const Bs=cs(CB,'B');

export const ytUeAmpereSummaryDiagrams={
 [K+'goal']:u1('piece'),
 [K+'law']:u1('law'),
 [K+'dir']:u1('dir'),
 [K+'ring']:u1('result'),
 [K+'line']:u2('res2'),
 [K+'coil']:u3('sum2'),
 [K+'tools']:u3('tools'),
 [K+'allsame']:u1('allsame'),
 [K+'circum']:u1('cancel2'),
 [K+'rect']:u3('rect'),
 [K+'reason']:u3('reason'),
 [K+'law3']:u3('divide'),
 [K+'num1']:u3('num1'),
 [K+'num2']:u3('num2'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})
   +label('辺の長さ L ＝',600,250,{size:34,color:C.ink,anchor:'middle'})+label('コイル全体の長さ？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'L']:u3('L'),
 [K+'anyL']:u3('anyL'),
 [K+'uniform']:u3('uniform'),
 [K+'summary']:(p)=>{
  const rows=[['実験に基づく法則','ビオ・サバールの法則',C.ink,null],['近似','長いコイルの外側の磁場 ≈ 0',C.ink,null],['導いた結果',null,C.hi,`${Bs}=\\dfrac{\\mu_0${Ic}}{2R},\\qquad ${Bs}=\\mu_0 n${Ic}`]];
  let s='';
  rows.forEach(([a,b,c,tx],i)=>{const y=60+i*135;
   s+=card(80,y,1040,112,label(a,120,y+66,{size:28,color:C.dim,weight:700})+(b?label(b,440,y+68,{size:32,color:c,weight:700}):T(tx,700,y+56,{size:34})),seg(p,.05+i*.2,.2+i*.2),i===2?C.hi:C.faint);});
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
