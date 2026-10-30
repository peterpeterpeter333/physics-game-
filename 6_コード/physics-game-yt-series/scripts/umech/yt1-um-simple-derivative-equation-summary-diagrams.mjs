// 大学編「微分方程式・中級・要点」(ys-um-simple-derivative-equation-summary) — 図。Stage 1200×515.
// 詳しい動画（um-simple-derivative-equation-1 / -2）の図を関数として再利用し、結論の表と締めのカードだけをここで描く。
// 色（詳しい動画と同じ）：量 y 橙、時刻 t・刻み Δt 金、減る量 赤、強調 黄。
import {C,seg,fade,label,rect,tex,texWidth} from './anim.mjs';
import {ytUmSde1Diagrams as S1} from './yt1-um-simple-derivative-equation-1-diagrams.mjs';
import {ytUmSde2Diagrams as S2} from './yt1-um-simple-derivative-equation-2-diagrams.mjs';

const K='um-simple-derivative-equation-summary:';
const s1=k=>S1['um-simple-derivative-equation-1:'+k],s2=k=>S2['um-simple-derivative-equation-2:'+k];
const two=(f,g,s)=>(p,ctx)=>p<s?f(p/s,ctx):g((p-s)/(1-s),ctx);
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cY=s=>`{\\color{${C.E}}{${s}}}`,cT=s=>`{\\color{${C.t}}{${s}}}`;
const TF=(s,x,maxW,size)=>{const w=texWidth(s,size,false);return tex(s,x,0,{size:w>maxW?size*maxW/w:size,auto:false});};
const DT='\\Delta '+cT('t');

const ROWS=[
 [()=>TF(`\\dfrac{${cY('dy')}}{d${cT('t')}}=-k\\,${cY('y')}`,460,400,40),'負号＝減る向き、k は 1/s',6],
 [()=>TF(`${cY('y_{i+1}')}\\approx ${cY('y_i')}(1-k\\,${DT})`,460,420,42),'一歩の式（近似）',0],
 [()=>TF(`${cY('y')}=${cY('y_0')}\\,e^{-k${cT('t')}}`,460,400,44),'半分になる時間は 一定',0],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note,dy],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(80,y,1040,115,label(['①','②','③'][i],130,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58+dy})">${f()}</g>`+label(note,890,y+70,{size:28,color:C.ink,anchor:'middle',weight:700}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUmSdeSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+card(250,150,700,220,label('減り方は 残りに比例',600,225,{size:36,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),label('→ 一歩ずつ 刻んで 求める',600,305,{size:40,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.25),C.hi),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:s1('dy'),
 [K+'r2']:s1('factor'),
 [K+'r3']:s2('h2'),
 [K+'ex1']:s1('result'),
 [K+'ex2']:s2('s34'),
 [K+'ex3']:s2('finer'),
 [K+'ex4']:s2('check'),
 [K+'ex5']:s2('h3'),
 [K+'m1']:s1('plus'),
 [K+'m2']:s1('minus'),
 [K+'m3']:s1('mistake'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
