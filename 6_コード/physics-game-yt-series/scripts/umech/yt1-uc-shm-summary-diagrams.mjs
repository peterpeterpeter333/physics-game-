// 大学編「単振動・上級・要点」(ys-uc-shm-summary) — 図。Stage 1200×515.
// 詳しい動画 1/3・2/3・3/3 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・まとめ・締めのカードだけ ここで描く。
// 色：l・x 水色、θ 橙、周期 T 金、力（S・mg・F₀）緑、抵抗 b 赤、Ω・ω 桃、強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUcShm1Diagrams as U1} from './yt1-uc-shm-1-diagrams.mjs';
import {ytUcShm2Diagrams as U2} from './yt1-uc-shm-2-diagrams.mjs';
import {ytUcShm3Diagrams as U3} from './yt1-uc-shm-3-diagrams.mjs';

const K='uc-shm-summary:';
const u1=k=>U1['uc-shm-1:'+k],u2=k=>U2['uc-shm-2:'+k],u3=k=>U3['uc-shm-3:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const TH=cs(C.E,'\\theta');

// 4枚のカード：g の測定／糸の力／減衰／共振。gs＝各カードの不透明度。
const four=(gs,hi=[])=>{
 const box=(i,x,y,title,src,size)=>card(x,y,550,190,label(title,x+24,y+42,{size:26,color:C.dim,weight:700})
  +T(src,x+275,y+118,{size}),gs[i],hi.includes(i)?C.hi:C.faint);
 return box(0,40,20,'g を 測る',cs(C.hi,'g')+'=\\dfrac{4\\pi^2'+cs(C.x,'l')+'}{'+cs(C.t,'T')+'^2}',40)
  +box(1,610,20,'糸の 力',cs(C.F,'S')+'=mg(3\\cos'+TH+'-2\\cos'+TH+'_0)',36)
  +box(2,40,230,'減衰',cs(C.x,'x')+'=A\\,e^{-\\gamma t}\\cos('+cs(C.p,'\\omega_d')+'t+\\varphi)',36)
  +box(3,610,230,'共振',cs(C.hi,'A')+'=\\dfrac{'+cs(C.F,'F_0')+'}{\\sqrt{(k-m'+cs(C.p,'\\Omega')+'^2)^2+('+cs(C.a,'b')+cs(C.p,'\\Omega')+')^2}}',30);
};

export const ytUcShmSummaryDiagrams={
 [K+'goal']:(p)=>four([seg(p,.02,.25),0,0,0],[0]),
 [K+'goal1']:(p)=>four([1,seg(p,.02,.25),0,0],[1]),
 [K+'goal2']:(p)=>four([1,1,seg(p,.02,.2),seg(p,.45,.6)],[2,3]),
 [K+'divT']:u1('divT'),
 [K+'eom']:u1('eom'),
 [K+'sub2']:u1('sub2'),
 [K+'de4']:u2('de4'),
 [K+'choose']:u2('choose'),
 [K+'xsol']:u2('xsol'),
 [K+'box']:u3('box3'),
 [K+'formula']:(p,ctx)=>p<.45?u3('add')(Math.min(1,p/.45),ctx):u3('formula')((p-.45)/.55,ctx),
 [K+'num2']:u1('num2'),
 [K+'n2']:u1('n2'),
 [K+'n3']:u2('n3'),
 [K+'curve']:u3('curve'),
 [K+'trap']:u3('n4'),
 [K+'bal']:u3('bal'),
 [K+'weak']:u3('weak'),
 [K+'sum']:(p)=>four([1,1,1,1],[0,1,2,3]),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
