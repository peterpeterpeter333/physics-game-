// 大学編「電磁誘導・中級・要点」(ys-um-induction-summary) — 図。Stage 1200×515.
// 詳しい動画 um-induction-1（1/3）・um-induction-2（2/3）・um-induction-3（3/3）の図をそのまま呼び出す（同じ数値・同じ色・同じ向き）。
// 結論の表・よくある間違い・締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：𝐄 水色、d𝐫 金、𝐁 橙、磁束 Φ 黄、起電力 ℰ 紫、電流 I 緑、ω 桃、v 紫。
import {C,seg,fade,label} from './anim.mjs';
import {CB,NC,EMF,PHI,cs,T,card,EM,LAW} from './yt1-um-induction-1-diagrams.mjs';
import {ytUmInduction1Diagrams as M1} from './yt1-um-induction-1-diagrams.mjs';
import {ytUmInduction2Diagrams as M2} from './yt1-um-induction-2-diagrams.mjs';
import {ytUmInduction3Diagrams as M3} from './yt1-um-induction-3-diagrams.mjs';

const K='um-induction-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const a=get(M1,'um-induction-1'),b=get(M2,'um-induction-2'),c=get(M3,'um-induction-3');
const om=cs(NC,'\\omega');
const GEN=`${EM}=N${cs(CB,'B')}A${om}\\sin ${om}t`;
const BLV=`|${EM}|=${cs(CB,'B')}\\ell ${cs(EMF,'v')}`;
const L=(s,x,o={})=>label(s,x,12,{size:28,color:C.ink,anchor:'start',weight:700,...o});

const ROWS=[
 [()=>T(LAW,330,14,{size:38})+L('固定した輪：一周の和 ＝ 起電力',540,{color:EMF}),'実験の法則'],
 [()=>T(GEN,330,14,{size:38})+L('磁場の中で 回る コイル',540,{color:C.ink}),'導いた結果'],
 [()=>T(BLV,330,14,{size:38})+L('一様な磁場の中を 動く 棒',540,{color:C.ink}),'導いた結果'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(40,y,1120,115,label(['①','②','③'][i],85,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,1070,y+70,{size:22,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUmInductionSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('一周の 電場の和が 0 に ならない とき',600,250,{size:34,color:C.ink,anchor:'middle',weight:700})
  +label('起電力は どう決まる？',600,320,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c1b']:(p)=>results(p,1,{fresh:false}),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:a('inc'),
 [K+'r2']:a('lenz'),
 [K+'r3']:a('work'),
 [K+'r4']:a('energy'),
 [K+'r5']:b('cancel'),
 [K+'r6']:c('area'),
 [K+'r6b']:c('flux'),
 [K+'ex1']:a('num2'),
 [K+'ex1b']:a('num3'),
 [K+'ex2']:b('num'),
 [K+'ex2b']:b('numamp'),
 [K+'ex3']:c('num2'),
 [K+'m1']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('起電力 ℰ は',600,250,{size:34,color:C.ink,anchor:'middle'})+label('2点の 電位差と 同じもの？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'m2']:a('vs'),
 [K+'m3']:a('vs2'),
 [K+'m4']:a('nopot'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
