// 大学編「積分・中級・要点」(ys-um-sum-to-integral-summary) — 図。Stage 1200×515.
// 詳しい動画 1/3・2/3・3/3 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 間違い・締めのカードだけ ここで描く。
// 色：面積・距離 x 水色、高さ f(x)・速度 紫、幅 dx・時間 金、∫・Σ・C 黄、正しい 緑、誤り 赤。
import {C,seg,fade,label,texWidth} from './anim.mjs';
import {ytUmSumInt1Diagrams as M1,card,T,cV,cT,cX,cH} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmSumInt2Diagrams as M2} from './yt1-um-sum-to-integral-2-diagrams.mjs';
import {ytUmSumInt3Diagrams as M3} from './yt1-um-sum-to-integral-3-diagrams.mjs';

const K='um-sum-to-integral-summary:';
const m1=k=>M1['um-sum-to-integral-1:'+k],m2=k=>M2['um-sum-to-integral-2:'+k],m3=k=>M3['um-sum-to-integral-3:'+k];

export const ytUmSumIntSummaryDiagrams={
 [K+'int']:m2('int'),
 [K+'piece']:m2('piece'),
 [K+'FbFa']:(p)=>{
  let s=card(150,70,900,120,label('微分すると f になる 関数 F（原始関数）',600,145,{size:32,color:C.ink,anchor:'middle'}),seg(p,.02,.15));
  s+=fade(seg(p,.45,.6),T(cH('\\int_a^b')+cV('f(x)')+'\\,'+cT('dx')+'='+cX('F(b)-F(a)'),600,340,{size:60}));
  return s;
 },
 [K+'grow']:m3('grow'),
 [K+'ftc']:m3('ftc'),
 [K+'honest']:m3('honest'),
 [K+'prim']:m3('prim'),
 [K+'shift']:m3('shift'),
 [K+'example']:m1('s4'),
 [K+'n16']:m1('n16'),
 [K+'intex']:m2('intex'),
 [K+'calc']:(p)=>{
  const a=cH('\\int_0^4')+cV('x')+'\\,'+cT('dx'),b='=\\dfrac{4^2}{2}-\\dfrac{0^2}{2}',c='=8-0='+cX('8');
  const wa=texWidth(a,56,false),wb=texWidth(b,56,false),wc=texWidth(c,56,false),x0=600-(wa+wb+wc+30)/2;
  let s=T(a,x0,210,{size:56,anchor:'start'});
  s+=fade(seg(p,.05,.25),T(b,x0+wa+15,210,{size:56,anchor:'start'}));
  s+=fade(seg(p,.3,.45),T(c,x0+wa+wb+30,210,{size:56,anchor:'start'}));
  s+=fade(seg(p,.55,.7),label('短冊を数えずに、同じ 8',600,390,{size:32,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=fade(seg(p,.02,.2),T(cH('\\int_2^4')+cV('x')+'\\,'+cT('dx')+'=\\dfrac{4^2}{2}=8',480,230,{size:60}));
  s+=fade(seg(p,.25,.4),label('まちがい',900,245,{size:40,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('下端 2 での値を 引き忘れている',600,400,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'right']:(p)=>{
  let s=T(cH('\\int_2^4')+cV('x')+'\\,'+cT('dx')+'=\\dfrac{4^2}{2}-\\dfrac{2^2}{2}=8-2='+cX('6'),600,210,{size:56});
  s+=fade(seg(p,.5,.65),label('上端の値 − 下端の値（下端を 必ず引く）',600,380,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check']:m3('check'),
 [K+'sum1']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.02,.2),T(cH('\\int_a^b')+cV('f(x)')+'\\,'+cT('dx')+'=\\lim_{n\\to\\infty}'+cH('\\sum_{i=1}^{n}')+cV('f(x_i)')+'\\,'+cT('\\Delta x'),600,200,{size:58}));
  s+=card(170,320,860,110,label('短冊 f(x)dx を、a から b まで 全部足せ',600,385,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'sum2']:m3('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
