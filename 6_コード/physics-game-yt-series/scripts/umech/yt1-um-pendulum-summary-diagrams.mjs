// 大学編「単振動・中級・要点」(ys-um-pendulum-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
// 色：θ 橙、l 水色、力 F（mg と成分）緑、加速度 赤、ω 桃、周期 T 金、強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUmPendulum1Diagrams as P1} from './yt1-um-pendulum-1-diagrams.mjs';

const K='um-pendulum-summary:';
const p1=k=>P1['um-pendulum-1:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const TH=cs(C.E,'\\theta');

const goal=(p,second)=>{
 let s=card(60,50,520,340,label('振り子の 運動方程式',320,110,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('両辺の m が 消える',320,330,{size:26,color:C.hi,anchor:'middle',weight:700}),second?1:seg(p,.02,.18));
 s+=fade(second?1:seg(p,.25,.45),T('ml\\,\\dfrac{d^2'+TH+'}{dt^2}=-'+cs(C.F,'mg\\sin')+TH,320,220,{size:46}));
 s+=card(620,50,520,340,label('小さな 振れ',880,110,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('大きく 振ると 少し 長い',880,362,{size:26,color:C.a,anchor:'middle',weight:700}),second?seg(p,.02,.2):0,C.hi);
 s+=fade(second?seg(p,.08,.28):0,T('\\sin'+TH+'\\approx'+TH,880,155,{size:36}));
 s+=fade(second?seg(p,.3,.5):0,T(cs(C.t,'T')+'=2\\pi\\sqrt{\\dfrac{'+cs(C.x,'l')+'}{g}}',880,272,{size:44}));
 return s;
};

export const ytUmPendulumSummaryDiagrams={
 [K+'goal']:(p)=>goal(p,0),
 [K+'goal2']:(p)=>goal(p,1),
 [K+'angle2']:p1('angle2'),
 [K+'tension']:p1('tension'),
 [K+'d2']:p1('d2'),
 [K+'eom']:p1('eom'),
 [K+'cancel']:(p,ctx)=>p<.45?p1('cancel')(Math.min(1,p/.45),ctx):p1('cancel2')((p-.45)/.55,ctx),
 [K+'small']:p1('small'),
 [K+'map']:p1('map'),
 [K+'period']:p1('period'),
 [K+'calc']:p1('calc'),
 [K+'quiz2']:p1('quiz2'),
 [K+'trap']:p1('big'),
 [K+'gap']:p1('gap'),
 [K+'weak']:p1('weak'),
 [K+'numeric']:p1('numeric'),
 [K+'table']:p1('table'),
 [K+'cond']:p1('cond'),
 [K+'sum1']:p1('sum1'),
 [K+'sum2']:p1('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
