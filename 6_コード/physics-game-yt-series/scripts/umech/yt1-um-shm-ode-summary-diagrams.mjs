// 大学編「振動の方程式・上級・要点」(ys-um-shm-ode-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
// 色：ずれ s・位置 水色、力 F 緑、U″(a)・強調 黄、ω 桃、エネルギー 橙。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUmShmOde1Diagrams as O1} from './yt1-um-shm-ode-1-diagrams.mjs';

const K='um-shm-ode-summary:';
const o1=k=>O1['um-shm-ode-1:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

// 詳しい動画の通し番号（④・③）を、要点版では「例」に置き換える（その札だけを同じ色の四角で隠して書き直す）。
const relabel=(p,x,y,w,t,lx,ly,size)=>fade(seg(p,.02,.12),rect(x,y,w,36,{fill:'#131f38',fo:1,stroke:'none',sw:0})+label(t,lx,ly,{size,color:C.dim,anchor:'middle'}));

const goal=(p,second)=>{
 let s=card(80,60,500,330,label('安定な 谷の近くの 小さな揺れ',330,125,{size:28,color:C.ink,anchor:'middle',weight:700})
  +label('何であれ 単振動',330,340,{size:28,color:C.hi,anchor:'middle',weight:700}),second?1:seg(p,.02,.18),C.hi);
 s+=fade(second?1:seg(p,.55,.7),T(cs(C.p,'\\omega')+'^2=\\dfrac{'+cs(C.hi,"U''(a)")+'}{m}',330,235,{size:50}));
 s+=card(620,60,500,330,label('摩擦が 無ければ',870,125,{size:28,color:C.ink,anchor:'middle',weight:700})
  +label('エネルギーは 一定',870,340,{size:28,color:C.E,anchor:'middle',weight:700}),second?seg(p,.4,.55):0,C.E);
 s+=fade(second?seg(p,.5,.65):0,T(cs(C.E,'K+U')+'=\\tfrac12 kA^2',870,235,{size:48}));
 return s;
};

export const ytUmShmOdeSummaryDiagrams={
 [K+'goal']:(p)=>goal(p,0),
 [K+'goal2']:(p)=>goal(p,1),
 [K+'valley2']:o1('valley2'),
 [K+'omega']:o1('omega'),
 [K+'every']:o1('every'),
 [K+'sum']:o1('sum'),
 [K+'one']:o1('one'),
 [K+'const']:o1('const'),
 [K+'num']:o1('num'),
 [K+'num2']:o1('num2'),
 [K+'num3']:o1('num3'),
 [K+'num4']:o1('num4'),
 [K+'num6']:o1('num6'),
 [K+'flat']:(p)=>o1('flat')(p)+relabel(p,700,126,430,'成り立たない 例',915,150,28),
 [K+'flat2']:o1('flat2'),
 [K+'flat3']:o1('flat3'),
 [K+'hill2']:o1('hill2'),
 [K+'fric']:(p)=>o1('fric')(p)+relabel(p,676,116,468,'成り立たない 例：摩擦・空気抵抗',910,140,26),
 [K+'sum1']:o1('sum1'),
 [K+'sum2']:o1('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
