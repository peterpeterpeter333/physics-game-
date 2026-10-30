// 大学編「積分・初級・要点」(ys-ui-area-is-distance-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。足りない まとめ・締めのカードだけ ここで描く。
// 色：距離・面積 x 水色、速さ v 紫、時間 t 金、Σ 黄、正しい 緑、誤り 赤。
import {C,seg,fade,label,tex} from './anim.mjs';
import {ytUiArea1Diagrams as A1,cV,cT,cX,card} from './yt1-ui-area-is-distance-1-diagrams.mjs';
import {ytUiArea2Diagrams as A2} from './yt1-ui-area-is-distance-2-diagrams.mjs';

const K='ui-area-is-distance-summary:';
const a1=k=>A1['ui-area-is-distance-1:'+k],a2=k=>A2['ui-area-is-distance-2:'+k];
const cH=s=>`{\\color{${C.hi}}{${s}}}`;

export const ytUiAreaSummaryDiagrams={
 [K+'rule']:a1('rule'),
 [K+'const']:a1('sum'),
 [K+'vary']:a1('sum2'),
 [K+'sigma']:a2('sig'),
 [K+'hw']:a2('hw'),
 [K+'prod']:a2('prod'),
 [K+'same']:a2('same'),
 [K+'steps3']:a1('steps3'),
 [K+'cutwhere']:a1('cutwhere'),
 [K+'pieces']:a1('piece3'),
 [K+'stack']:a1('same'),
 [K+'exact']:a2('exact'),
 [K+'approx']:a2('approx'),
 [K+'wrong']:a1('wrong'),
 [K+'wrong2']:(p)=>a1('wrong')(1),
 [K+'widths']:a1('widths'),
 [K+'sum']:(p)=>{
  let s=card(150,40,900,130,label('速さと時間のグラフ：線の下の 面積 ＝ 進んだ距離',600,118,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=card(150,200,430,120,label('高さ ＝ 速さ',365,250,{size:30,color:C.v,anchor:'middle',weight:700})+label('幅 ＝ 時間',365,295,{size:30,color:C.t,anchor:'middle',weight:700}),seg(p,.15,.3));
  s+=card(620,200,430,120,label('高さ × 幅 ＝ その区間の距離',835,270,{size:28,color:C.x,anchor:'middle',weight:700}),seg(p,.3,.45));
  s+=fade(seg(p,.5,.65),tex(cX('\\Delta x')+'\\approx'+cH('\\sum_i')+cV('v_i')+cT('\\,\\Delta t_i'),600,425,{size:58,auto:false,color:C.ink}));
  return s;
 },
 [K+'back']:(p)=>{
  let s=label('途中で 戻る区間 があるとき',600,90,{size:32,color:C.ink,anchor:'middle',weight:700});
  s+=card(110,140,460,250,label('変位',340,200,{size:34,color:C.x,anchor:'middle',weight:700})+label('符号をつけて 足す',340,265,{size:28,color:C.ink,anchor:'middle'})+label('横軸の下は マイナス',340,320,{size:28,color:C.a,anchor:'middle'}),seg(p,.1,.3));
  s+=card(630,140,460,250,label('道のり',860,200,{size:34,color:C.hi,anchor:'middle',weight:700})+label('大きさで 足す',860,265,{size:28,color:C.ink,anchor:'middle'})+label('下の長方形も プラス',860,320,{size:28,color:C.hi,anchor:'middle'}),seg(p,.45,.65),C.hi);
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
