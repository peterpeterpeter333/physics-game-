// 大学編「過渡現象・上級・要点」(ys-ue-transient-summary) — 図。Stage 1200×515.
// 詳しい動画 ue-transient-1／-2 の図をそのまま呼び出す（同じ数値・同じ色・同じ向き）。結論の表と締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：電流 I 緑、電圧 V₀ 紫、電荷 q 桃、時間 t・τ 金、容量 C 黄、ω 桃。
import {C,seg,fade,label} from './anim.mjs';
import {QC,TC,IC,VC,CC,cs,T,card} from './yt1-um-circuit-time-1-diagrams.mjs';
import {ytUeTransient1Diagrams as A1} from './yt1-ue-transient-1-diagrams.mjs';
import {ytUeTransient2Diagrams as A2} from './yt1-ue-transient-2-diagrams.mjs';

const K='ue-transient-summary:';
const u1=k=>{const f=A1['ue-transient-1:'+k];if(!f)throw new Error('missing ue-transient-1:'+k);return f;};
const u2=k=>{const f=A2['ue-transient-2:'+k];if(!f)throw new Error('missing ue-transient-2:'+k);return f;};
const HI=C.hi;
const q_=cs(QC,'q'),I_=cs(IC,'I'),V0=cs(VC,'V_0'),C_=cs(CC,'C'),t_=cs(TC,'t'),TAU=cs(TC,'\\tau'),W=cs(C.p,'\\omega');
const ERC=`e^{-${t_}/R${C_}}`;
const TX=(s,x,y,o={})=>T(s,x,y,{color:C.ink,...o});

// tex(x) is the centre of the formula.
const ROWS=[
 ['RC',y=>TX(`${q_}=${C_}${V0}\\left(1-${ERC}\\right)`,400,y+58,{size:36})+TX(`${I_}=\\dfrac{${V0}}{R}\\,${ERC}`,800,y+58,{size:36})+label('指数',1050,y+68,{size:28,color:HI,weight:700})],
 ['RL',y=>TX(`L\\,\\dfrac{d${I_}}{d${t_}}=${V0}-R${I_}`,380,y+58,{size:36})+TX(`${TAU}=\\dfrac{L}{R}`,700,y+58,{size:36})+label('V₀/R へ 立ち上がる',820,y+68,{size:26,color:C.dim})],
 ['LC',y=>TX(`\\dfrac{d^2${q_}}{d${t_}^2}=-\\dfrac{${q_}}{L${C_}}`,380,y+60,{size:32})+TX(`${W}=\\dfrac{1}{\\sqrt{L${C_}}}`,700,y+60,{size:32})+label('振動',1050,y+68,{size:28,color:HI,weight:700})],
];
function results(p,n,{title='結論',fresh=true,hl=-1}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([h,f],i)=>{
  if(i>=n)return;
  const y=80+i*135,last=fresh&&i===n-1,g=last?seg(p,.03,.2):1,on=last||i===hl;
  s+=card(60,y,1080,115,label(['①','②','③'][i],105,y+70,{size:36,color:HI,anchor:'middle',weight:700})+label(h,140,y+68,{size:28,color:C.dim})+f(y),g,on?HI:C.faint);
 });
 return s;
}

export const ytUeTransientSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('同じ一周の式から：RC・RL は指数、LC は振動',600,280,{size:36,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u1('kirch'),
 // 元の図の上の札「（前回の 端子電圧）」は要点版では「前回」が通じないので、同じ位置・同じ時刻に札を描き直す。
 [K+'r2']:(p,ctx)=>u1('coil')(p,ctx)+fade(seg(p,.5,.65),card(20,8,560,52,label('電流が 入る側 ＋（端子電圧の 約束）',300,44,{size:24,color:C.ink,anchor:'middle'}),1)),
 [K+'r3']:u1('loop'),
 [K+'r4']:u1('divL'),
 [K+'r5']:u1('tau'),
 [K+'r6']:u2('sub'),
 [K+'r7']:u2('omega'),
 [K+'ex1']:u1('num'),
 [K+'ex2']:u1('numtau'),
 [K+'m1']:u1('compare'),
 [K+'m2']:u1('roles'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'sum2']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:HI,anchor:'middle',weight:700}),seg(p,.05,.25),HI),
};
