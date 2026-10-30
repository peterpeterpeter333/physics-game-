// 大学編「近似とテイラー展開・上級・要点」(ys-um-taylor-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUmTaylor1Diagrams as T1} from './yt1-um-taylor-1-diagrams.mjs';
import {ytUmTaylor2Diagrams as T2} from './yt1-um-taylor-2-diagrams.mjs';

const K='um-taylor-summary:';
const t1=k=>T1['um-taylor-1:'+k],t2=k=>T2['um-taylor-2:'+k];
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

export const ytUmTaylorSummaryDiagrams={
 [K+'goal']:(p)=>{
  let s=card(80,70,500,320,label('k 次の係数',330,135,{size:30,color:C.ink,anchor:'middle',weight:700})+label('導いた結果',330,330,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.18));
  s+=fade(seg(p,.08,.22),T('c_k=\\dfrac{f^{(k)}(0)}{k!}',330,235,{size:46}));
  s+=card(620,70,500,320,label('谷底の力',870,135,{size:30,color:C.ink,anchor:'middle',weight:700})+label('ばねに見える',870,330,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  s+=fade(seg(p,.55,.7),T('F\\approx -U\'\'(a)\\,(x-a)',870,235,{size:40,color:C.F}));
  return s;
 },
 [K+'def']:t1('def'),
 [K+'formula']:t1('formula'),
 [K+'result']:t2('result'),
 [K+'general']:t1('general'),
 [K+'survive']:t1('high'),
 [K+'drop']:t2('drop'),
 [K+'force2']:t2('force2'),
 [K+'ex']:t2('ex'),
 [K+'ex3']:t2('ex3'),
 [K+'k']:(p)=>fade(seg(p,.02,.2),T('k=U\'\'(1)=6\\,\\mathrm{N/m}',600,200,{size:60}))+fade(seg(p,.3,.5),label('谷 x ＝ 1 の ばね定数',600,320,{size:30,color:C.hi,anchor:'middle',weight:700})),
 [K+'f11']:t2('f11'),
 [K+'f11b']:t2('f11b'),
 [K+'f15']:t2('f15'),
 [K+'hill0']:(p,c)=>t2('hill')(0,c),
 [K+'hill']:t2('hill'),
 [K+'flat4b']:t2('flat4b'),
 [K+'sum']:t2('sum'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
