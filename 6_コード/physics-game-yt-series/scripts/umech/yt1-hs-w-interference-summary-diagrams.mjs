// 高校編「干渉と回折・要点」(ys-hs-w-interference-summary) — 図。Stage 1200×515.
// 深 1/2 の水槽・時間グラフの部品を読み込む（同じ色・同じ数値）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex} from './anim.mjs';
import {card,tag,T2,LC,TCOL,Lt} from './yt1-hs-w-basics-1-diagrams.mjs';
import {allLines,tgraph,pathTo,tank,tankT,PP,QQ,STR,WEAK,TK,W1,W2} from './yt1-hs-w-interference-1-diagrams.mjs';

const K='hs-w-interference-summary:';
const CM='\\ \\mathrm{cm}';
const strip=(x,y0,y1,w,fr,cy)=>{let s=rect(x,y0,w,y1-y0,{fill:'#1a2438',fo:1,stroke:C.dim,rx:4});for(let y=y0+2;y<y1-2;y+=4){const I=Math.cos(Math.PI*(y-cy)/fr)**2;s+=rect(x,y,w,4.5,{fill:'#fff3b0',fo:.08+.85*I,stroke:'none',rx:0});}return s;};
const rule=(g1=1,g2=1)=>card(680,30,500,110,T2(`m${Lt}`,760,92,{size:44})+label('→ 強め合い',830,96,{size:30,color:STR,weight:700}),g1,STR)+card(680,160,500,110,T2(`\\left(m+\\tfrac12\\right)${Lt}`,800,222,{size:40})+label('→ 弱め合い',920,226,{size:30,color:WEAK,weight:700}),g2,WEAK);

export const hsWInterferenceSummaryDiagrams={
 // 結論
 [K+'c1']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.8});
  s+=card(720,40,440,110,label('ずれは 足し算',940,108,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'c2']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.35})+allLines({gs:seg(p,.1,.3),gw:seg(p,.5,.7)});
  s+=card(720,40,440,110,label('同位相の 波源',940,108,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  return s;
 },
 [K+'c3']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({});
  s+=rule(seg(p,.1,.25),seg(p,.4,.55));
  s+=fade(seg(p,.7,.85),card(680,290,500,80,T2('m=0,\\ 1,\\ 2,\\ \\cdots',930,340,{size:34,auto:false}),1,C.dim));
  return s;
 },
 // なぜ
 [K+'w0']:(p)=>{
  let s=card(200,50,800,120,T2('(+2)+(-2)=0',600,118,{size:50,auto:false}),seg(p,.6,.75),C.dim);
  s+=card(200,230,800,110,label('重ね合わせの 原理（実験で 確かめた 法則）',600,295,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.1,.25),C.F);
  return s;
 },
 [K+'w1']:(p)=>{
  let s=tgraph({tau:1,u:seg(p,.45,.85)});
  s+=fade(seg(p,.7,.85),label('1周期 遅れ',TK.x1+520,190,{size:26,color:TCOL,weight:700}));
  return s;
 },
 [K+'w2']:(p)=>{
  let s=tgraph({tau:1,u:1,gs:seg(p,.3,.5)});
  s+=fade(seg(p,.6,.75),label('強め合い',1080,330,{size:28,color:STR,anchor:'end',weight:700}));
  return s;
 },
 [K+'w3']:(p)=>{
  let s=tgraph({tau:.5,u:seg(p,.05,.35),gs:seg(p,.5,.65)});
  s+=fade(seg(p,.7,.85),label('打ち消し合う',1080,370,{size:28,color:WEAK,anchor:'end',weight:700}));
  return s;
 },
 // 数値例
 [K+'n1']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({gs:.35,gw:.35});
  s+=pathTo(PP,'P',{l1:'10 cm',l2:'14 cm',g:seg(p,.1,.25)});
  s+=card(680,30,500,100,T2(`14-10=4.0${CM}`,930,88,{size:40,auto:false}),seg(p,.6,.75),LC);
  return s;
 },
 [K+'n1b']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({hlS:4,dimOthers:.25});
  s+=pathTo(PP,'P',{l1:'10 cm',l2:'14 cm'});
  s+=card(680,30,500,100,T2(`14-10=4.0${CM}=2${Lt}`,930,88,{size:40}),1,LC);
  s+=tag('強め合い',930,190,{color:STR,g:seg(p,.4,.55),size:30});
  return s;
 },
 [K+'n2']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({hlW:3,dimOthers:.25});
  s+=pathTo(QQ,'Q',{l1:'10 cm',l2:'13 cm'});
  s+=card(680,30,500,100,T2(`13-10=3.0${CM}=1.5${Lt}`,930,88,{size:38}),seg(p,.3,.45),LC);
  s+=tag('弱め合い',930,190,{color:WEAK,g:seg(p,.7,.85),size:30});
  return s;
 },
 [K+'n3']:(p)=>{
  let s=fade(seg(p,.05,.2),rect(150,60,12,140,{fill:'#56627a',fo:1,stroke:C.dim,rx:2})+rect(150,216,12,48,{fill:'#56627a',fo:1,stroke:C.dim,rx:2})+rect(150,280,12,180,{fill:'#56627a',fo:1,stroke:C.dim,rx:2}));
  s+=fade(seg(p,.05,.2),line(156,208,980,150,{color:W1,w:3})+line(156,272,980,150,{color:W2,w:3})+label('スリット',156,40,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),strip(990,40,470,60,70,240)+label('スクリーン',1020,500,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('明暗の 縞',870,330,{size:30,color:STR,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n4']:(p)=>{
  let s=card(200,40,800,150,T2(`\\Delta {\\color{${LC}}y}=\\dfrac{${Lt}L}{d}`,600,125,{size:58,auto:false}),seg(p,.05,.2),STR);
  s+=fade(seg(p,.4,.55),label('d：スリットの 間隔',600,270,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('L：スクリーン までの 距離',600,330,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n5']:(p)=>{
  let s=card(80,30,1040,90,label('λ ＝ 600 nm、L ＝ 1.0 m、d ＝ 0.50 mm',600,88,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(80,150,700,140,T2('\\Delta y=\\dfrac{600\\times10^{-9}\\times1.0}{0.50\\times10^{-3}}',430,225,{size:40,auto:false}),seg(p,.25,.4),LC);
  s+=card(80,320,700,100,T2('=1.2\\ \\mathrm{mm}',430,382,{size:48,auto:false}),seg(p,.45,.6),STR);
  s+=fade(seg(p,.45,.6),strip(900,150,420,70,45,285));
  s+=tag('光は 波',935,470,{color:C.hi,g:seg(p,.7,.85),size:28});
  return s;
 },
 // よくある間違い
 [K+'m1']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.25})+allLines({gs:.6,gw:.6})+pathTo(PP,'P')+pathTo(QQ,'Q');
  s+=card(680,30,500,100,label('× 長さ そのもので 判断',930,92,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.25),C.a);
  return s;
 },
 [K+'m2']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.25})+allLines({gs:.6,gw:.6})+pathTo(PP,'P')+pathTo(QQ,'Q');
  s+=card(680,30,500,190,label('P：4.0 cm ＝ 2λ → 強め合い',930,95,{size:28,color:STR,anchor:'middle',weight:700})+label('Q：3.0 cm ＝ 1.5λ → 弱め合い',930,155,{size:28,color:WEAK,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(680,250,500,100,label('○ 波長の 何個分か',930,312,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.6,.75),C.F);
  return s;
 },
 [K+'m3']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({});
  s+=card(680,30,500,170,label('× 弱め合いで エネルギーが 消える',930,95,{size:28,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('○ 揺れる 場所が 偏る',930,160,{size:30,color:C.F,anchor:'middle',weight:700})),seg(p,.05,.2),C.dim);
  return s;
 },
 // まとめ
 [K+'e1']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({});
  s+=card(680,30,500,110,label('整数個 → 強め合い',930,98,{size:32,color:STR,anchor:'middle',weight:700}),seg(p,.1,.25),STR);
  s+=card(680,160,500,110,label('整数個 ＋ 半分 → 弱め合い',930,228,{size:30,color:WEAK,anchor:'middle',weight:700}),seg(p,.45,.6),WEAK);
  return s;
 },
 [K+'e2']:(p)=>{
  return card(200,110,800,230,label('なぜ そうなるかは',600,190,{size:30,color:C.dim,anchor:'middle'})+label('深く学ぶ版 1/2・2/2 で',600,270,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
 },
};
