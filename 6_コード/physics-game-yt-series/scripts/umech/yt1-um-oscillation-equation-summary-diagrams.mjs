// 大学編「振動の方程式・中級・要点」(ys-um-oscillation-equation-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
// 色：cos の項・初めの位置 水色、sin の項・初めの速度 紫、ω 桃、和・強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUmOscillationEquation1Diagrams as O1} from './yt1-um-oscillation-equation-1-diagrams.mjs';

const K='um-oscillation-equation-summary:';
const o1=k=>O1['um-oscillation-equation-1:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const W=cs(C.p,'\\omega');
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

export const ytUmOscillationEquationSummaryDiagrams={
 [K+'goal']:(p)=>{
  let s=fade(seg(p,.02,.18),T('\\dfrac{d^2x}{dt^2}=-'+W+'^2x',600,95,{size:46}));
  const items=[[cs(C.v,'\\sin '+W+'t'),C.v,'解'],[cs(C.x,'\\cos '+W+'t'),C.x,'解'],[cs(C.x,'A\\cos '+W+'t')+'+'+cs(C.v,'B\\sin '+W+'t'),C.hi,'足しても 解']];
  const xs=[230,520,890],ws=[240,240,420];
  items.forEach(([f,c,l],i)=>{s+=card(xs[i]-ws[i]/2,190,ws[i],200,T(f,xs[i],265,{size:36})+label(l,xs[i],355,{size:28,color:c,anchor:'middle',weight:700}),seg(p,.35+.15*i,.5+.15*i),c);});
  return s;
 },
 [K+'goal2']:o1('formula'),
 [K+'order']:o1('order'),
 [K+'sin']:o1('sin'),
 [K+'linear']:o1('linear'),
 [K+'factor']:o1('factor'),
 [K+'v0']:(p)=>p<.45?o1('pos')(p/.45):o1('v0')((p-.45)/.55),
 [K+'why2']:o1('why2'),
 [K+'nums']:o1('nums'),
 [K+'AB']:o1('AB'),
 [K+'check']:o1('check'),
 [K+'amp']:o1('amp'),
 [K+'compare']:o1('compare'),
 [K+'three']:o1('three'),
 [K+'three2']:(p)=>o1('three')(1),
 [K+'fixed']:o1('fixed'),
 [K+'sum1']:o1('sum1'),
 [K+'sum2']:o1('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
