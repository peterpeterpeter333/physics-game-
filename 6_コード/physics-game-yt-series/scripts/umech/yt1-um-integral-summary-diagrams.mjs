// 大学編「積分・上級・要点」(ys-um-integral-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
// 色：面積 x 水色、f 紫、幅 h・時間 金、強調 黄、加速度 a 赤、正しい 緑、誤り 赤。
import {C,seg,fade,label} from './anim.mjs';
import {card,T,cV,cX,cH,cT} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmIntegral1Diagrams as U1} from './yt1-um-integral-1-diagrams.mjs';
import {ytUmIntegral2Diagrams as U2} from './yt1-um-integral-2-diagrams.mjs';

const K='um-integral-summary:';
const u1=k=>U1['um-integral-1:'+k],u2=k=>U2['um-integral-2:'+k];

export const ytUmIntegralSummaryDiagrams={
 [K+'goal']:(p)=>{
  let s=fade(seg(p,.02,.2),T(cX("A'(x)")+'='+cV('f(x)'),600,150,{size:64}));
  s+=card(150,250,420,130,label('中級',360,300,{size:26,color:C.dim,anchor:'middle'})+label('図で 納得',360,350,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.45));
  s+=card(630,250,420,130,label('上級',840,300,{size:26,color:C.dim,anchor:'middle'})+label('はさみうちで 証明',840,350,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'result']:u1('result'),
 [K+'power']:(p)=>{
  const t=cT('t');
  let s=card(120,70,460,320,T(cH('\\int')+t+'^{\\,n}\\,'+cT('dt')+'=\\dfrac{'+t+'^{\\,n+1}}{n+1}+'+cH('C'),350,190,{size:42})+label('微分で 検算できる',350,310,{size:26,color:C.F,anchor:'middle'}),seg(p,.02,.15));
  s+=card(620,70,460,320,label('例外 n ＝ −1',850,140,{size:28,color:C.a,anchor:'middle',weight:700})+T(cH('\\int')+'\\dfrac{1}{'+t+'}\\,'+cT('dt')+'='+cX('\\ln|t|')+'+'+cH('C'),850,230,{size:42})+label('（t ≠ 0）',850,310,{size:24,color:C.t,anchor:'middle'}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'twice']:u2('sum2'),
 [K+'curve']:u1('curve'),
 [K+'rects']:u1('rects'),
 [K+'ineq']:u1('divide2'),
 [K+'squeeze']:u1('squeeze'),
 [K+'squeeze2']:u1('squeeze2'),
 [K+'ex']:u1('ex'),
 [K+'ex2']:u1('ex2'),
 [K+'shrink2']:u1('shrink2'),
 [K+'check2']:u1('check2'),
 [K+'check3']:u1('check3'),
 [K+'cart']:u2('ic'),
 [K+'wrong']:u2('wrong'),
 [K+'t2']:u2('t2'),
 [K+'why']:u2('why'),
 [K+'sum']:u1('sum'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
