// 大学編「近似とテイラー展開・中級・要点」(ys-um-approximation-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUmApprox1Diagrams as U1} from './yt1-um-approximation-1-diagrams.mjs';
import {ytUmApprox2Diagrams as U2} from './yt1-um-approximation-2-diagrams.mjs';

const K='um-approximation-summary:';
const u1=k=>U1['um-approximation-1:'+k],u2=k=>U2['um-approximation-2:'+k];
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

export const ytUmApproxSummaryDiagrams={
 [K+'goal']:(p)=>{
  let s=card(80,70,500,320,label('直線（1次）',330,135,{size:30,color:C.ink,anchor:'middle',weight:700})+label('値と傾きを合わせる ＝ 接線',330,320,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.18));
  s+=card(620,70,500,320,label('多項式（2次・3次…）',870,135,{size:30,color:C.ink,anchor:'middle',weight:700})+label('曲がりまで合わせる',870,320,{size:26,color:C.hi,anchor:'middle'}),seg(p,.4,.55),C.hi);
  s+=fade(seg(p,.1,.25),T('f(a)+f\'(a)(x-a)',330,235,{size:36}));
  s+=fade(seg(p,.5,.65),T('c_0+c_1x+c_2x^2+\\cdots',870,235,{size:36}));
  return s;
 },
 [K+'tangent']:u1('sum1'),
 [K+'form']:u2('form'),
 [K+'taylor']:u2('sum1'),
 [K+'sincoef']:u2('sincoef'),
 [K+'c0']:u2('c0'),
 [K+'c1']:u2('c1'),
 [K+'c2b']:u2('c2b'),
 [K+'cos1']:u2('cos1'),
 [K+'cos2']:u2('cos2'),
 [K+'cosf']:u2('cosf'),
 [K+'coscalc']:u2('coscalc'),
 [K+'coserr']:u2('coserr'),
 [K+'far']:(p,c)=>u2('e2')(.08,c),
 [K+'e2']:u2('e2'),
 [K+'e2b']:u2('e2b'),
 [K+'caution']:u2('caution'),
 [K+'sum2']:u2('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
