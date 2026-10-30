// 大学編「電位・上級・要点」(ys-ue-potential-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色：𝐄 水色、電位 V 紫、∇V 桃、一歩 d𝐫 金、正電荷 赤、強調 黄、誤り 赤）。
// よくある間違い・まとめ・締めのカードだけ ここで描く。
import {C,seg,fade,label} from './anim.mjs';
import {EC,VC,cs,T,L,card,vE,V,dr,NABg} from './yt1-ue-potential-1-diagrams.mjs';
import {ytUePotential1Diagrams as M1} from './yt1-ue-potential-1-diagrams.mjs';
import {ytUePotential2Diagrams as M2} from './yt1-ue-potential-2-diagrams.mjs';

const K='ue-potential-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'ue-potential-1'),u2=get(M2,'ue-potential-2');

export const ytUePotentialSummaryDiagrams={
 [K+'goal']:u1('grad'),
 [K+'result']:u1('sum'),
 [K+'kq']:u2('sum1'),
 [K+'any']:u2('sum2'),
 [K+'limit']:u1('limit'),
 [K+'perp0']:u2('perp0'),
 [K+'radial']:u2('radial'),
 [K+'pt']:u1('pt'),
 [K+'num']:u1('num'),
 [K+'ey']:u1('ey'),
 [K+'mag']:u1('mag'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('V ＝ 0 なら 𝐄 ＝ 0？',600,250,{size:36,color:C.ink,anchor:'middle'})+label('𝐄 ＝ 0 なら V ＝ 0？',600,315,{size:36,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'sphere100']:u2('sphere100'),
 [K+'grounded']:u2('grounded'),
 [K+'v0e0']:u2('v0e0'),
 [K+'sum']:(p)=>{
  let s=card(60,60,520,270,L('電位 → 電場',320,115,{size:26,color:EC,weight:700})+T(`${vE}=-${NABg}`,320,230,{size:56}),1,EC);
  s+=card(620,60,520,270,L('電場 → 電位',880,115,{size:26,color:VC,weight:700})+T(`${cs(VC,'V_{\\mathrm B}')}-${cs(VC,'V_{\\mathrm A}')}=-\\int_{\\mathrm A}^{\\mathrm B}${vE}\\cdot${dr}`,880,230,{size:38}),seg(p,.2,.35),VC);
  s+=fade(seg(p,.55,.7),L('どちらも 一周の 線積分が 0 の 静電場で',600,420,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
