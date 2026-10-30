// 大学編「回路の時間変化・初級・要点」(ys-ui-circuit-time-summary) — 図。Stage 1200×515.
// 詳しい動画 ui-circuit-time-1／-2 の図をそのまま呼び出す（同じ数値・同じ色・同じ向き）。結論の表と締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：電圧 V 紫、電荷 q 桃、電流 I 緑、時間 t 金、容量 C 黄。
import {C,seg,fade,label} from './anim.mjs';
import {cs,card,T} from './yt1-ui-closed-bag-1-diagrams.mjs';
import {ytUiCircuitTime1Diagrams as A1} from './yt1-ui-circuit-time-1-diagrams.mjs';
import {ytUiCircuitTime2Diagrams as A2} from './yt1-ui-circuit-time-2-diagrams.mjs';

const K='ui-circuit-time-summary:';
const u1=k=>{const f=A1['ui-circuit-time-1:'+k];if(!f)throw new Error('missing ui-circuit-time-1:'+k);return f;};
const u2=k=>{const f=A2['ui-circuit-time-2:'+k];if(!f)throw new Error('missing ui-circuit-time-2:'+k);return f;};
const QC=C.p,TC=C.t,IC=C.F,VC=C.v,CC=C.hi,HI=C.hi;
const q_=cs(QC,'q'),I_=cs(IC,'I'),V0=cs(VC,'V_0'),C_=cs(CC,'C'),t_=cs(TC,'t');
const TX=(s,x,y,o={})=>T(s,x,y,{color:C.ink,...o});

const ROWS=[
 ['一周の電圧',y=>TX(`${V0}=R${I_}+\\dfrac{${q_}}{${C_}}`,470,y+58,{size:42})+label('電池の電圧が 2つに分かれる',760,y+68,{size:26,color:C.dim})],
 ['電流',y=>TX(`${I_}=\\dfrac{d${q_}}{d${t_}}`,420,y+58,{size:42})+label('電荷のグラフの傾き → 充電が進むと 0 へ',580,y+68,{size:26,color:C.dim})],
 ['コイル',y=>TX(`${cs(VC,'V')}=L\\,\\dfrac{d${I_}}{d${t_}}`,430,y+58,{size:42})+label('一定の電流なら 0 V',640,y+68,{size:28,color:HI,weight:700})],
];
function results(p,n,{title='結論',fresh=true,hl=-1}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([h,f],i)=>{
  if(i>=n)return;
  const y=80+i*135,last=fresh&&i===n-1,g=last?seg(p,.03,.2):1,on=last||i===hl;
  s+=card(60,y,1080,115,label(['①','②','③'][i],105,y+70,{size:36,color:HI,anchor:'middle',weight:700})+label(h,150,y+68,{size:28,color:C.dim})+f(y),g,on?HI:C.faint);
 });
 return s;
}

export const ytUiCircuitTimeSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('抵抗・コンデンサ・コイル：電圧は何で決まる？',600,280,{size:36,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u1('steps'),
 [K+'r2']:u1('sum'),
 [K+'r3']:u1('share'),
 [K+'r4']:u2('self'),
 [K+'ex1']:u1('circuit'),
 [K+'ex2']:u1('example'),
 [K+'ex3']:u1('numC'),
 [K+'ex4']:u1('numR'),
 [K+'ex5']:u1('meter'),
 [K+'m1']:u1('notsame'),
 [K+'m2']:u2('seg1'),
 [K+'m3']:u2('seg2'),
 [K+'m4']:u2('compare'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false,hl:0}),
 [K+'sum2']:(p)=>results(p,3,{title:'まとめ',fresh:false,hl:2}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:HI,anchor:'middle',weight:700}),seg(p,.05,.25),HI),
};
