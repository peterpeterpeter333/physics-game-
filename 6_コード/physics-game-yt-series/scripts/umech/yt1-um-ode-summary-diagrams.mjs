// 大学編「微分方程式・上級・要点」(ys-um-ode-summary) — 図。Stage 1200×515.
// 詳しい動画（um-ode-1 / -2）の図を関数として再利用し、結論の表と締めのカードだけをここで描く。
// 色（詳しい動画と同じ）：速さ v 紫、時刻 t・半分になる時間 T 金、ln の量 水色、強調 黄。
import {C,seg,fade,label,rect,tex,texWidth} from './anim.mjs';
import {ytUmOde1Diagrams as O1} from './yt1-um-ode-1-diagrams.mjs';
import {ytUmOde2Diagrams as O2} from './yt1-um-ode-2-diagrams.mjs';

const K='um-ode-summary:';
const o1=k=>O1['um-ode-1:'+k],o2=k=>O2['um-ode-2:'+k];
const two=(f,g,s)=>(p,ctx)=>p<s?f(p/s,ctx):g((p-s)/(1-s),ctx);
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cV=s=>`{\\color{${C.v}}{${s}}}`,cT=s=>`{\\color{${C.t}}{${s}}}`;
const TF=(s,x,maxW,size)=>{const w=texWidth(s,size,false);return tex(s,x,0,{size:w>maxW?size*maxW/w:size,auto:false});};

const ROWS=[
 [()=>TF(`${cV('v')}=0`,450,400,44),'零解：割る前に 確かめる',0],
 [()=>TF(`${cV('v')}=${cV('v_0')}\\,e^{-k${cT('t')}}`,450,400,44),'ln|v| の傾き → 積分 → 指数へ',0],
 [()=>TF(`${cT('T')}=\\dfrac{\\ln 2}{k}`,450,400,40),'出発の量に よらない',4],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note,dy],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(80,y,1040,115,label(['①','②','③'][i],130,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58+dy})">${f()}</g>`+label(note,880,y+70,{size:28,color:C.ink,anchor:'middle',weight:700}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUmOdeSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+card(250,150,700,220,tex(`\\dfrac{d${cV('v')}}{d${cT('t')}}=-k${cV('v')}`,600,235,{size:52,auto:false})
   +fade(seg(p,.35,.55),label('刻まずに 式から 解く',600,320,{size:36,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.25),C.hi),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:o1('chain2'),
 [K+'r2']:o1('rewrite'),
 [K+'r3']:o1('integ'),
 [K+'r4']:o1('exp'),
 [K+'r5']:o1('init'),
 [K+'r6']:two(o2('half'),o2('half2'),.45),
 [K+'r7']:two(o2('ln'),o2('solve'),.45),
 [K+'ex1']:o2('ex'),
 [K+'ex2']:o2('four'),
 [K+'ex3']:o2('fine'),
 [K+'ex4']:o2('num'),
 [K+'m1']:o1('div'),
 [K+'m2']:two(o1('zero2'),o1('lost'),.55),
 [K+'m4']:o1('short2'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
