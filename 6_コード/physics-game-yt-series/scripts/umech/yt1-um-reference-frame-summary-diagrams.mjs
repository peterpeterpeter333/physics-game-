// 大学編「慣性力と軌道・中級・要点」(ys-um-reference-frame-summary) — 図。Stage 1200×515.
// 詳しい動画 1/3・2/3・3/3 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・まとめ・締めのカードだけ ここで描く。
// 色：位置・r 水色、速度 v 紫、加速度 a・A 赤、力 F 緑（慣性力は緑の破線）、ω 桃、強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytReferenceFrameM1Diagrams as M1} from './yt1-um-reference-frame-1-diagrams.mjs';
import {ytReferenceFrameM2Diagrams as M2} from './yt1-um-reference-frame-2-diagrams.mjs';
import {ytReferenceFrameM3Diagrams as M3} from './yt1-um-reference-frame-3-diagrams.mjs';

const K='um-reference-frame-summary:';
const m1=k=>M1['um-reference-frame-1:'+k],m2=k=>M2['um-reference-frame-2:'+k],m3=k=>M3['um-reference-frame-3:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

// 結論の3枚：加速する観測者／円運動と遠心力／月の検算。gs＝各カードの不透明度、sub＝2段目。
const three=(gs,sub=[1,1,1],hi=[])=>{
 const box=(i,x,title,inner)=>card(x,40,360,400,label(title,x+180,100,{size:30,color:C.ink,anchor:'middle',weight:700})+inner,gs[i],hi.includes(i)?C.hi:C.faint);
 return box(0,40,'加速する観測者',
   T("m"+cs(C.a,"a'")+'='+cs(C.F,'F')+'-m'+cs(C.a,'A'),220,200,{size:44})
   +fade(sub[0],label('−mA ＝ 慣性力',220,295,{size:28,color:C.F,anchor:'middle',weight:700})+label('ほかの物体から',220,360,{size:24,color:C.dim,anchor:'middle'})+label('受ける力ではない',220,395,{size:24,color:C.dim,anchor:'middle'})))
  +box(1,420,'円運動',
   T(cs(C.a,'a')+'=\\dfrac{'+cs(C.v,'v')+'^2}{'+cs(C.x,'r')+'}='+cs(C.x,'r')+cs(C.p,'\\omega')+'^2',600,200,{size:42})
   +fade(sub[1],label('導いた結果',600,295,{size:28,color:C.a,anchor:'middle',weight:700})+label('回る台の上では',600,360,{size:24,color:C.dim,anchor:'middle'})+label('遠心力 mrω²',600,395,{size:26,color:C.F,anchor:'middle',weight:700})))
  +box(2,800,'月の検算',
   T('\\dfrac{9.8}{60^2}\\approx'+cs(C.x,'r')+cs(C.p,'\\omega')+'^2',980,200,{size:40})
   +fade(sub[2],label('約 0.0027 m/s²',980,295,{size:28,color:C.hi,anchor:'middle',weight:700})+label('リンゴと同じ重力が',980,360,{size:24,color:C.dim,anchor:'middle'})+label('距離の2乗で弱まる',980,395,{size:24,color:C.dim,anchor:'middle'})));
};

export const ytUmReferenceFrameSummaryDiagrams={
 [K+'goal']:(p)=>three([seg(p,.02,.25),0,0],[seg(p,.55,.75),0,0],[0]),
 [K+'goal2']:(p)=>three([1,seg(p,.02,.2),0],[1,seg(p,.45,.65),0],[1]),
 [K+'goal3']:(p)=>three([1,1,seg(p,.02,.2)],[1,1,seg(p,.4,.6)],[2]),
 [K+'d2']:m1('d2'),
 [K+'result']:m1('result'),
 [K+'notReal']:m1('notReal'),
 [K+'arc']:m2('arcapprox'),
 [K+'vr']:m2('result'),
 [K+'ex2']:m1('ex2'),
 [K+'cf']:m2('cf'),
 [K+'left']:m3('left'),
 [K+'calc']:m3('match'),
 [K+'rh']:m3('rh2'),
 [K+'iss2']:m3('iss2'),
 [K+'float']:m3('float'),
 [K+'sum']:(p)=>three([1,1,1],[1,1,1],[0,1,2]),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
