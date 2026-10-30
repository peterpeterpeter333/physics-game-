// 大学編「振動の方程式・初級・要点」(ys-ui-oscillation-equation-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
// 色：位置 x 水色、加速度 赤、力 F 緑、周期 T 金、ω 桃、強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUiOscillationEquation1Diagrams as O1} from './yt1-ui-oscillation-equation-1-diagrams.mjs';
import {ytUiOscillationEquation2Diagrams as O2} from './yt1-ui-oscillation-equation-2-diagrams.mjs';

const K='ui-oscillation-equation-summary:';
const o1=k=>O1['ui-oscillation-equation-1:'+k],o2=k=>O2['ui-oscillation-equation-2:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const W=cs(C.p,'\\omega');
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

const goal=(p,second)=>{
 let s=card(80,60,500,330,label('ばねの 方程式',330,125,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('加速度は ずれに 比例して 中心向き',330,340,{size:24,color:C.dim,anchor:'middle'}),second?1:seg(p,.02,.18));
 s+=fade(second?1:seg(p,.3,.45),T(cs(C.a,'\\dfrac{d^2x}{dt^2}')+'=-'+W+'^2\\,'+cs(C.x,'x'),330,235,{size:50}));
 s+=card(620,60,500,330,label('周期',870,125,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('振幅に よらない',870,340,{size:28,color:C.hi,anchor:'middle',weight:700}),second?seg(p,.05,.25):0,C.hi);
 s+=fade(second?seg(p,.15,.35):0,T(cs(C.t,'T')+'=\\dfrac{2\\pi}{'+W+'}',870,235,{size:56}));
 return s;
};

export const ytUiOscillationEquationSummaryDiagrams={
 [K+'goal']:(p)=>goal(p,0),
 [K+'goal2']:(p)=>goal(p,1),
 [K+'chain2']:o1('chain2'),
 [K+'hooke']:o1('hooke'),
 [K+'sub']:o1('sub'),
 [K+'omega']:o1('omega'),
 [K+'read']:o1('read'),
 [K+'repeat']:o1('repeat'),
 [K+'sum1']:o2('sum1'),
 [K+'num1']:o1('num1'),
 [K+'num2']:o1('num2'),
 [K+'Tpi']:o2('Tpi'),
 [K+'spT']:o2('spT'),
 [K+'two2']:o2('two'),
 [K+'force2']:o2('force2'),
 [K+'isochron']:o2('isochron'),
 [K+'two']:o1('two'),
 [K+'ex1']:o1('ex1'),
 [K+'ex2']:o1('ex2'),
 [K+'summary']:o1('sum2'),
 [K+'summary2']:o2('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
