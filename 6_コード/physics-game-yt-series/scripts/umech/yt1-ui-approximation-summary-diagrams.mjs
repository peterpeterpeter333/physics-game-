// 大学編「近似とテイラー展開・初級・要点」(ys-ui-approximation-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
// 色：弧 θ 水色(C.x)、高さ sinθ 赤(C.a)、半径 橙(C.E)、差・強調 黄(C.hi)。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUiApprox1Diagrams as A1} from './yt1-ui-approximation-1-diagrams.mjs';
import {ytUiApprox2Diagrams as A2} from './yt1-ui-approximation-2-diagrams.mjs';

const K='ui-approximation-summary:';
const a1=k=>A1['ui-approximation-1:'+k],a2=k=>A2['ui-approximation-2:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

export const ytUiApproxSummaryDiagrams={
 [K+'goal']:(p)=>{
  let s=card(110,70,440,320,label('角度を ラジアンで 測る',330,140,{size:30,color:C.ink,anchor:'middle',weight:700})+T('\\theta=\\dfrac{'+cs(C.x,'s')+'}{'+cs(C.E,'r')+'}',330,265,{size:56}),seg(p,.02,.18));
  s+=card(650,70,440,320,label('小さな角では',870,140,{size:30,color:C.ink,anchor:'middle',weight:700})+T(cs(C.a,'\\sin\\theta')+'\\approx'+cs(C.x,'\\theta'),870,265,{size:60}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'def']:a1('def'),
 [K+'full']:a1('full'),
 [K+'colors']:a2('colors'),
 [K+'compare']:a1('compare'),
 [K+'shorter']:a2('shorter'),
 [K+'zoom10']:a2('zoom10'),
 [K+'slope1']:a2('slope1'),
 [K+'t01']:a2('t01'),
 [K+'rel']:a2('rel'),
 [K+'check01']:a2('check01'),
 [K+'table']:a2('table'),
 [K+'caution']:a2('caution'),
 [K+'radian']:a2('radian'),
 [K+'radian2']:(p)=>a2('radian')(.5+.5*p),
 [K+'notequal']:a2('notequal'),
 [K+'summary']:a2('summary'),
 [K+'summary2']:a2('summary2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
