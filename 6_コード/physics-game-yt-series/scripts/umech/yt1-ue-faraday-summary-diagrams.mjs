// 大学編「電磁誘導・上級・要点」(ys-ue-faraday-summary) — 図。Stage 1200×515.
// 詳しい動画 ue-faraday-1（1/2）・ue-faraday-2（2/2）の図をそのまま呼び出す（同じ数値・同じ色・同じ向き）。
// 結論の表・よくある間違い・締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：電流 I 緑、起電力 ℰ・電圧 V 紫、鎖交磁束 Ψ・磁束 Φ 黄、エネルギー U 橙、時間 t 金。L はインダクタンスだけ（コイルの長さは ℓ）。
import {C,seg,fade,label} from './anim.mjs';
import {T,cs,card,CI,EMF,PHI,Ic,PS,BACK,UL} from './yt1-ue-faraday-1-diagrams.mjs';
import {ytUeFaraday1Diagrams as M1} from './yt1-ue-faraday-1-diagrams.mjs';
import {ytUeFaraday2Diagrams as M2} from './yt1-ue-faraday-2-diagrams.mjs';

const K='ue-faraday-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const a=get(M1,'ue-faraday-1'),b=get(M2,'ue-faraday-2');
const I1=cs(CI,'I_1'),I2=cs(CI,'I_2'),V1=cs(EMF,'V_1'),V2=cs(EMF,'V_2');
const VR=`\\dfrac{|${V2}|}{|${V1}|}=\\dfrac{N_2}{N_1}=\\dfrac{${I1}}{${I2}}`;
const L=(s,x,o={})=>label(s,x,12,{size:28,color:C.ink,anchor:'start',weight:700,...o});

const ROWS=[
 [()=>T(`${PS}=L${Ic}`,230,14,{size:38})+T(BACK,470,14,{size:34})+L('逆起電力',650,{color:EMF}),'定義＋法則'],
 [()=>T(UL,300,14,{size:40})+L('電流を増やす仕事 → 磁場に 蓄える',470,{color:C.E}),'仕事の積分'],
 [()=>T(VR,330,14,{size:32})+L('理想変圧器：電圧は巻数比、電流は逆',540,{color:C.ink,size:24}),'仮定から'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(40,y,1120,115,label(['①','②','③'][i],85,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,1065,y+70,{size:22,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUeFaradaySummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('コイルの「電流の慣性」と',600,250,{size:34,color:C.ink,anchor:'middle',weight:700})
  +label('導線でつながずに 渡す エネルギー',600,320,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:a('sub'),
 [K+'r2']:a('dU'),
 [K+'r3']:a('int2'),
 [K+'r4']:b('perturn'),
 [K+'r5']:b('ratio'),
 [K+'r6']:b('iratio'),
 [K+'ex1']:a('ex'),
 [K+'ex2']:a('ex2'),
 [K+'ex3']:a('enum'),
 [K+'ex4']:b('num'),
 [K+'ex5']:b('pnum'),
 [K+'m1']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('変圧器で 電圧を 上げれば',600,250,{size:34,color:C.ink,anchor:'middle'})+label('エネルギーも 増える？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'m2']:b('nofree'),
 [K+'m3']:b('down'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
