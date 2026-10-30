// 大学編「コンデンサ・上級・要点」(ys-ue-capacitor-summary) — 図。Stage 1200×515.
// 詳しい動画 ue-capacitor-1（1/2）・ue-capacitor-2（2/2）の図をそのまま呼び出す（同じ回路の向き・同じ数値・同じ色）。
// 1/2 の qQ・dw の図（電場 𝐄 の札、𝐄 に逆らう 外力 の矢）はそのまま使う。
// 積分の結果と三角形を一枚にした図・まとめ・よくある間違い・締めのカードだけ ここで描く。
import {C,seg,fade,label} from './anim.mjs';
import {T,card,L,VQ,Ut,ut,Qt,qt,dq,Ct,Vt,Et,eps,WC} from './yt1-ue-capacitor-1-diagrams.mjs';
import {ytUeCapacitor1Diagrams as M1} from './yt1-ue-capacitor-1-diagrams.mjs';
import {ytUeCapacitor2Diagrams as M2} from './yt1-ue-capacitor-2-diagrams.mjs';

const K='ue-capacitor-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const a=get(M1,'ue-capacitor-1'),b=get(M2,'ue-capacitor-2');
const cap=(f,m)=>(p,ctx)=>f(Math.min(p,m),ctx);
const DC='#9ad6a0';

export const ytUeCapacitorSummaryDiagrams={
 [K+'goal']:cap(a('sum1'),.38),          // 1行目（U の式）だけ
 [K+'density']:a('sum1'),
 [K+'kappa']:b('cform'),
 [K+'table']:b('sum2'),
 [K+'qQ']:a('qQ'),
 [K+'dw']:a('dw'),
 // 短冊を足して三角形 → U＝∫(q/C)dq＝Q²/(2C)、½ ＝ 三角形の ½（1/2 の sum・anti・half の内容を一枚に）
 [K+'sum']:(p)=>{
  const {svg}=VQ({strips:1-seg(p,.35,.55),n:24,tri:seg(p,.3,.5)});
  let s=svg;
  s+=card(640,80,520,350,L('0 から Q まで 足す',900,125,{size:26,color:C.dim})
   +T(`${Ut}=\\int_0^{${Qt}}\\dfrac{${qt}}{${Ct}}\\,${dq}=\\dfrac{${Qt}^2}{2${Ct}}`,900,225,{size:38})
   +fade(seg(p,.55,.75),L('½ ＝ 三角形の ½',900,350,{size:32,color:WC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'onlyE']:a('onlyE'),
 [K+'cup']:b('cup'),
 [K+'num']:a('num'),
 [K+'unum']:a('unum'),
 [K+'match']:a('match'),
 [K+'q1']:b('q1'),
 [K+'q3']:b('q3'),
 [K+'v3']:b('v3'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('容量が κ 倍なら',600,250,{size:34,color:C.ink,anchor:'middle'})+label('エネルギーも いつも 増える？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'tboth']:b('tboth'),
 [K+'half']:b('half'),
 [K+'summary']:(p)=>{
  let s=card(80,80,640,350,L('導いた 結果',400,130,{size:28,color:C.hi,weight:700})
   +T(`${Ut}=\\tfrac12${Ct}${Vt}^2`,400,230,{size:48})
   +T(`${ut}=\\tfrac12${eps}${Et}^2`,400,340,{size:48}),seg(p,0,.2),C.hi);
  s+=card(770,80,350,350,L('実験で 決まる',945,130,{size:28,color:DC,weight:700})
   +T('\\kappa',945,250,{size:72})+L('物質ごとの 値',945,340,{size:26,color:C.dim}),seg(p,.35,.55),DC);
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
