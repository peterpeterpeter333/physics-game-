// 大学編「仕事・中級・要点」(ys-um-work-energy-summary) — 図。Stage 1200×515.
// 詳しい動画（um-work-energy-1 / -2 / -3）の図を関数として再利用し、結論の表と締めのカードだけをここで描く。
// 色（詳しい動画と同じ）：力 F 緑、速度 v 紫、位置 x 水色、加速度 a 赤、仕事 W・運動エネルギー K 橙、強調 黄。
import {C,seg,fade,label,rect,tex,texWidth} from './anim.mjs';
import {ytUmWorkEnergy1Diagrams as E1} from './yt1-um-work-energy-1-diagrams.mjs';
import {ytUmWorkEnergy2Diagrams as E2} from './yt1-um-work-energy-2-diagrams.mjs';
import {ytUmWorkEnergy3Diagrams as E3} from './yt1-um-work-energy-3-diagrams.mjs';

const K='um-work-energy-summary:';
const e1=k=>E1['um-work-energy-1:'+k],e2=k=>E2['um-work-energy-2:'+k],e3=k=>E3['um-work-energy-3:'+k];
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cF=s=>`{\\color{${C.F}}{${s}}}`,cV=s=>`{\\color{${C.v}}{${s}}}`,cX=s=>`{\\color{${C.x}}{${s}}}`,cA=s=>`{\\color{${C.a}}{${s}}}`,cE=s=>`{\\color{${C.E}}{${s}}}`;
const TF=(s,x,maxW,size)=>{const w=texWidth(s,size,false);return tex(s,x,0,{size:w>maxW?size*maxW/w:size,auto:false});};

const ROWS=[
 [()=>TF(`${cF('F')}=m${cV('v')}\\dfrac{d${cV('v')}}{d${cX('x')}}`,470,520,42),'時刻 t が 消える'],
 [()=>TF(`${cE('W')}=\\tfrac12 m${cV('v')}_f^{\\,2}-\\tfrac12 m${cV('v')}_i^{\\,2}=\\Delta ${cE('K')}`,470,560,38),'導いた 結果'],
 [()=>label('F は 合力 ／ ½ は v を 積分した 足跡',470,12,{size:32,color:C.ink,anchor:'middle',weight:700}),'覚える数 ではない'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(80,y,1040,115,label(['①','②','③'][i],130,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58+(i===0?16:0)})">${f()}</g>`+label(note,960,y+70,{size:24,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUmWorkEnergySummaryDiagrams={
 [K+'intro']:e1('start'),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:e2('mdx'),
 [K+'r2']:e1('cond'),
 [K+'r3']:e3('graph2'),
 [K+'r4']:e3('sumA'),
 [K+'ex1']:e3('ex1'),
 [K+'ex2']:e3('ex2'),
 [K+'ex3']:e3('trap'),
 [K+'m1']:e3('wrong'),
 [K+'m2']:e3('cmp'),
 [K+'sum']:e3('sumB'),
 [K+'sum2']:e3('adv'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
