// 大学編「仕事・上級・要点」(ys-uc-work-summary) — 図。Stage 1200×515.
// 詳しい動画（uc-work-1 / -2 / -3）の図を関数として再利用し、冒頭・結論の表と締めのカードだけをここで描く。
// 色（詳しい動画と同じ）：力 𝐅 緑、速度 𝐯 紫、加速度 𝐚 赤、仕事 W・運動エネルギー K・仕事率 P 橙、強調 黄。ベクトルは太字。
import {C,seg,fade,label,rect,tex,texWidth} from './anim.mjs';
import {ytUcWork1Diagrams as U1} from './yt1-uc-work-1-diagrams.mjs';
import {ytUcWork2Diagrams as U2} from './yt1-uc-work-2-diagrams.mjs';
import {ytUcWork3Diagrams as U3} from './yt1-uc-work-3-diagrams.mjs';

const K='uc-work-summary:';
const u1=k=>U1['uc-work-1:'+k],u2=k=>U2['uc-work-2:'+k],u3=k=>U3['uc-work-3:'+k];
const two=(f,g,s)=>(p,ctx)=>p<s?f(p/s,ctx):g((p-s)/(1-s),ctx);
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bF=`{\\color{${C.F}}{\\mathbf{F}}}`,bV=`{\\color{${C.v}}{\\mathbf{v}}}`,cE=s=>`{\\color{${C.E}}{${s}}}`;
const TF=(s,x,maxW,size)=>{const w=texWidth(s,size,false);return tex(s,x,0,{size:w>maxW?size*maxW/w:size,auto:false});};

const ROWS=[
 [()=>TF(`${cE('W')}=\\int ${bF}\\cdot${bV}\\,dt`,470,520,40),'d𝐫 ＝ 𝐯 dt'],
 [()=>TF(`\\frac{d${cE('K')}}{dt}=${bF}\\cdot${bV}\\ \\Rightarrow\\ \\Delta ${cE('K')}=${cE('W')}`,470,560,40),'曲がった道でも'],
 [()=>TF(`${cE('P')}=${bF}\\cdot${bV}\\qquad ${bF}\\perp${bV}\\Rightarrow ${cE('P')}=0`,470,560,40),'速さを 変えない'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(80,y,1040,115,label(['①','②','③'][i],130,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58+(i===0?6:i===1?8:0)})">${f()}</g>`+label(note,960,y+70,{size:24,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUcWorkSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+card(250,150,700,220,label('道を 時刻で たどる',600,225,{size:36,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),label('曲がった道でも W ＝ ΔK ？',600,305,{size:40,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.25),C.hi),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:two(u2('lanes'),u2('dot'),.45),
 [K+'r2']:two(u2('dK'),u2('dK2'),.5),
 [K+'r3']:u2('right'),
 [K+'r4']:u2('no'),
 [K+'ex1']:u2('K0'),
 [K+'ex2']:u2('top'),
 [K+'ex3']:u2('work'),
 [K+'ex4']:u2('color'),
 [K+'m1']:u3('perp'),
 [K+'m2']:u3('perp2'),
 [K+'m3']:u3('diff'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
