// 大学編「過渡現象・中級・要点」(ys-um-circuit-time-summary) — 図。Stage 1200×515.
// 詳しい動画 um-circuit-time-1／-2 の図をそのまま呼び出す（同じ数値・同じ色・同じ向き）。結論の表と締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：電荷 q 桃、差 u 橙、電流 I 緑、電圧 V 紫、時間 t・τ 金、容量 C 黄。
import {C,seg,fade,label} from './anim.mjs';
import {ytUmCircuitTime1Diagrams as A1,QC,TC,CC,VC,cs,T,card,ODE,QINF,q_,V0,C_,t_} from './yt1-um-circuit-time-1-diagrams.mjs';
import {ytUmCircuitTime2Diagrams as A2} from './yt1-um-circuit-time-2-diagrams.mjs';

const K='um-circuit-time-summary:';
const u1=k=>{const f=A1['um-circuit-time-1:'+k];if(!f)throw new Error('missing um-circuit-time-1:'+k);return f;};
const u2=k=>{const f=A2['um-circuit-time-2:'+k];if(!f)throw new Error('missing um-circuit-time-2:'+k);return f;};
const HI=C.hi;
const TAU=cs(TC,'\\tau'),Q0=cs(QC,'Q_0');
const TX=(s,x,y,o={})=>T(s,x,y,{color:C.ink,...o});

const ROWS=[
 ['回路の式',y=>TX(ODE,420,y+58,{size:38})+TX(QINF,700,y+58,{size:36})+label('空気抵抗と同じ形',860,y+68,{size:26,color:C.dim})],
 ['充電',y=>TX(`${TAU}=R${C_}`,320,y+58,{size:38})+TX(`${q_}=${C_}${V0}\\left(1-e^{-${t_}/R${C_}}\\right)`,610,y+58,{size:38})+label('1 − 指数',900,y+68,{size:28,color:HI,weight:700})],
 ['放電',y=>TX(`${q_}=${Q0}\\,e^{-${t_}/R${C_}}`,360,y+58,{size:38})+label('指数そのもの',900,y+68,{size:28,color:HI,weight:700})],
];
function results(p,n,{title='結論',fresh=true,hl=-1}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([h,f],i)=>{
  if(i>=n)return;
  const y=80+i*135,last=fresh&&i===n-1,g=last?seg(p,.03,.2):1,on=last||i===hl;
  s+=card(60,y,1080,115,label(['①','②','③'][i],105,y+70,{size:36,color:HI,anchor:'middle',weight:700})+label(h,135,y+68,{size:26,color:C.dim})+f(y),g,on?HI:C.faint);
 });
 return s;
}

export const ytUmCircuitTimeSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('RC 回路の電荷は、時間とともにどう変わる？',600,280,{size:36,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u1('down'),
 [K+'r2']:u1('loop'),
 [K+'r3']:u1('map2'),
 [K+'r4']:u2('ueq'),
 [K+'r5']:u2('dissign'),
 [K+'ex1']:u1('termnum'),
 [K+'ex2']:u2('ms'),
 [K+'ex3']:u2('tau63'),
 [K+'ex4']:u2('pairmarks'),
 [K+'m1']:u2('notend'),
 [K+'m2']:u2('criterion'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false,hl:0}),
 [K+'sum2']:(p)=>results(p,3,{title:'まとめ',fresh:false,hl:0}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:HI,anchor:'middle',weight:700}),seg(p,.05,.25),HI),
};
