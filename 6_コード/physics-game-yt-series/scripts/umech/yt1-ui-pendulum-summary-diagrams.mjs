// 大学編「単振動・初級・要点」(ys-ui-pendulum-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
// 色：ずれ x 水色、力 F 緑、周期 T 金、U 橙、K 紫、合計・強調 黄。
import {C,seg,fade,label,rect,tex,line} from './anim.mjs';
import {ytUiPendulum1Diagrams as P1} from './yt1-ui-pendulum-1-diagrams.mjs';

const K='ui-pendulum-summary:';
const p1=k=>P1['ui-pendulum-1:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

// 結論の3枚：戻す力／周期／エネルギー。n＝今の cue で出す枚数。
const goal=(p,n)=>{
 const g=i=>i<n-1?1:i===n-1?seg(p,.05,.3):0;
 let s='';
 s+=card(40,50,360,340,label('戻す 力',220,110,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('ずれと 逆向き',220,330,{size:26,color:C.F,anchor:'middle',weight:700}),g(0));
 s+=fade(g(0),T(cs(C.F,'F')+'=-k\\,'+cs(C.x,'x'),220,215,{size:52}));
 s+=card(420,50,360,340,label('周期',600,110,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('（小さく 揺れる 間）',600,160,{size:22,color:C.dim,anchor:'middle'})
  +label('振幅に よらない',600,260,{size:26,color:C.t,anchor:'middle',weight:700})
  +label('振り子は 質量にも',600,315,{size:26,color:C.t,anchor:'middle',weight:700}),g(1));
 s+=card(800,50,360,340,label('エネルギー',980,110,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('の 和が 一定',980,275,{size:28,color:C.hi,anchor:'middle',weight:700})
  +label('端で 止まり 中央で 最速',980,335,{size:24,color:C.dim,anchor:'middle'}),g(2),n>=3?C.hi:C.faint);
 s+=fade(g(2),T(cs(C.v,'K')+'+'+cs(C.E,'U'),980,205,{size:48}));
 return s;
};

// よくある間違い：端と一番低い所の棒を並べる（U・K はそれぞれ変わり、和の 2 J だけが同じ）。
const pair=(x,name,u,k,g)=>{
 const base=380,sc=100; // 1 J ＝ 100px
 let s=line(x-120,base,x+120,base,{color:C.dim,w:3});
 s+=rect(x-95,base-u*sc,80,u*sc,{fill:C.E,fo:.55,rx:4})+label(u.toFixed(0)+' J',x-55,base-u*sc-12,{size:24,color:C.E,anchor:'middle',weight:700})+label('U',x-55,base+32,{size:26,color:C.E,anchor:'middle',weight:700});
 s+=rect(x+15,base-k*sc,80,k*sc,{fill:C.v,fo:.55,rx:4})+label(k.toFixed(0)+' J',x+55,base-k*sc-12,{size:24,color:C.v,anchor:'middle',weight:700})+label('K',x+55,base+32,{size:26,color:C.v,anchor:'middle',weight:700});
 s+=line(x-130,base-2*sc,x+130,base-2*sc,{color:C.hi,w:2.5,dash:'10 8'})+label('合計 2 J',x+140,base-2*sc+8,{size:24,color:C.hi});
 s+=label(name,x,base+78,{size:28,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
};
const trap2=(p)=>pair(330,'端',2,0,seg(p,.02,.2))+pair(820,'一番低い所',0,2,seg(p,.3,.5))
 +fade(seg(p,.6,.8),label('変わらないのは 和の 2 J だけ',600,80,{size:30,color:C.hi,anchor:'middle',weight:700}));

export const ytUiPendulumSummaryDiagrams={
 [K+'goal']:(p)=>goal(p,1),
 [K+'goal2']:(p)=>goal(p,2),
 [K+'goal3']:(p)=>goal(p,3),
 [K+'hooke']:p1('hooke'),
 [K+'tangent']:p1('tangent'),
 [K+'bottom']:p1('bottom'),
 [K+'iso']:p1('iso'),
 [K+'mass2']:p1('mass2'),
 [K+'ewhy']:p1('ewhy'),
 [K+'pT1']:p1('pT1'),
 [K+'pT2']:p1('pT2'),
 [K+'quiz2']:p1('quiz2'),
 [K+'eset']:p1('eset'),
 [K+'eend']:p1('eend'),
 [K+'ehalf']:p1('ehalf'),
 [K+'ev']:p1('ev'),
 [K+'ebars']:p1('ebars'),
 [K+'etrap']:p1('etrap'),
 [K+'etrap2']:trap2,
 [K+'sum2']:p1('sum2'),
 [K+'sum3']:p1('sum3'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
