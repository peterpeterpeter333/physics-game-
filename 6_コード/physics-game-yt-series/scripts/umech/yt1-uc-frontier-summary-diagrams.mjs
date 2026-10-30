// 大学編「慣性力と軌道・上級・要点」(ys-uc-frontier-summary) — 図。Stage 1200×515.
// 詳しい動画 1/4〜4/4 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・まとめ・締めのカードだけ ここで描く。
// 色：r 水色、θ 橙、周期 T 金、力 F 緑（慣性力は緑の破線）、ω 桃、強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUcFrontier1Diagrams as F1} from './yt1-uc-frontier-1-diagrams.mjs';
import {ytUcFrontier2Diagrams as F2} from './yt1-uc-frontier-2-diagrams.mjs';
import {ytUcFrontier3Diagrams as F3} from './yt1-uc-frontier-3-diagrams.mjs';
import {ytUcFrontier4Diagrams as F4} from './yt1-uc-frontier-4-diagrams.mjs';

const K='uc-frontier-summary:';
const f1=k=>F1['uc-frontier-1:'+k],f2=k=>F2['uc-frontier-2:'+k],f3=k=>F3['uc-frontier-3:'+k],f4=k=>F4['uc-frontier-4:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const TH=cs(C.E,'\\theta');

// 結論の3枚：回る観測者／円の軌道（第3法則）／一般の軌道（第1法則）。gs＝各カードの不透明度、sub＝2段目。
const three=(gs,sub=[1,1,1],hi=[])=>{
 const box=(i,x,title,inner)=>card(x,40,360,400,label(title,x+180,100,{size:30,color:C.ink,anchor:'middle',weight:700})+inner,gs[i],hi.includes(i)?C.hi:C.faint);
 return box(0,40,'回る観測者',
   label('遠心力',220,175,{size:28,color:C.F,anchor:'middle',weight:700})+T('m'+cs(C.x,'r')+cs(C.p,'\\omega')+'^2',220,240,{size:44})
   +fade(sub[0],label('動く物体には',220,320,{size:24,color:C.dim,anchor:'middle'})+label('コリオリ力も',220,360,{size:28,color:C.F,anchor:'middle',weight:700})+label('どちらも 慣性力',220,410,{size:24,color:C.dim,anchor:'middle'})))
  +box(1,420,'円の軌道',
   T(cs(C.t,'T')+'^2=\\dfrac{4\\pi^2'+cs(C.x,'r')+'^3}{GM}',600,215,{size:44})
   +fade(sub[1],label('ケプラー第3法則',600,320,{size:28,color:C.hi,anchor:'middle',weight:700})+label('万有引力と ma＝F から',600,380,{size:24,color:C.dim,anchor:'middle'})))
  +box(2,800,'一般の軌道',
   T(cs(C.x,'r')+'=\\dfrac{p}{1+e\\cos'+TH+'}',980,215,{size:44})
   +fade(sub[2],label('e＝0 で円',980,310,{size:26,color:C.ink,anchor:'middle'})+label('0＜e＜1 で楕円',980,355,{size:28,color:C.hi,anchor:'middle',weight:700})+label('ケプラー第1法則',980,405,{size:24,color:C.dim,anchor:'middle'})));
};

export const ytUcFrontierSummaryDiagrams={
 [K+'goal']:(p)=>three([seg(p,.02,.25),0,0],[seg(p,.55,.75),0,0],[0]),
 [K+'goal2']:(p)=>three([1,seg(p,.1,.3),seg(p,.5,.7)],[1,0,0],[1,2]),
 [K+'goal3']:(p)=>three([1,1,1],[1,seg(p,.5,.7),seg(p,.05,.3)],[1,2]),
 [K+'notReal']:f1('notReal'),
 [K+'line3']:f1('line3'),
 [K+'colR']:f2('colR'),
 [K+'h']:f2('h'),
 [K+'result']:f3('result'),
 [K+'shm']:f3('shm'),
 [K+'p']:f4('p'),
 [K+'geoR']:f1('geoR'),
 [K+'n2']:(p,ctx)=>p<.4?f4('n1')(p/.4,ctx):f4('n2')((p-.4)/.6,ctx),
 [K+'obs']:f4('obs'),
 [K+'trap']:f2('predict'),
 [K+'a4']:f2('a4'),
 [K+'c3']:f2('c3'),
 [K+'three']:f4('three'),
 [K+'frames']:f4('frames'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
