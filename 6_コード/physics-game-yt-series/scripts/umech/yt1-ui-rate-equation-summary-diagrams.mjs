// 大学編「微分方程式・初級・要点」(ys-ui-rate-equation-summary) — 図。Stage 1200×515.
// 詳しい動画（ui-rate-equation-1 / -2）の図を関数として再利用し、結論の表と締めのカードだけをここで描く。
// 色（詳しい動画と同じ）：速さ v 紫、時刻 t 金、減る速さ 赤、y（抽象の量）橙、強調 黄。
import {C,seg,fade,label,rect,tex,texWidth} from './anim.mjs';
import {ytUiRate1Diagrams as R1} from './yt1-ui-rate-equation-1-diagrams.mjs';
import {ytUiRate2Diagrams as R2} from './yt1-ui-rate-equation-2-diagrams.mjs';

const K='ui-rate-equation-summary:';
const r1=k=>R1['ui-rate-equation-1:'+k],r2=k=>R2['ui-rate-equation-2:'+k];
const two=(f,g,s)=>(p,ctx)=>p<s?f(p/s,ctx):g((p-s)/(1-s),ctx);
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cV=s=>`{\\color{${C.v}}{${s}}}`,cT=s=>`{\\color{${C.t}}{${s}}}`,cY=s=>`{\\color{${C.E}}{${s}}}`;
const TF=(s,x,maxW,size)=>{const w=texWidth(s,size,false);return tex(s,x,0,{size:w>maxW?size*maxW/w:size,auto:false});};

// the three results of this level, revealed one per cue (newest row framed in yellow)
const ROWS=[
 [()=>TF(`\\dfrac{d${cV('v')}}{d${cT('t')}}=-k${cV('v')}`,470,420,40),'答えは 関数 v(t)'],
 [()=>TF(`e=2.718\\ldots`,470,420,44),'eᵗ：微分しても 自分自身'],
 [()=>TF(`${cV('v')}=C\\,e^{-k${cT('t')}}`,470,420,44),'C は 初期条件で 決まる'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(80,y,1040,115,label(['①','②','③'][i],130,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58+(i===0?6:0)})">${f()}</g>`+label(note,900,y+70,{size:28,color:C.ink,anchor:'middle',weight:700}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUiRateSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+card(250,150,700,220,label('減る速さは 今の量に比例',600,225,{size:36,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),label('→ 量そのものは？',600,305,{size:40,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.25),C.hi),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:r1('every'),
 [K+'r2']:r2('chain'),
 [K+'r3']:two(r2('fam3'),r2('ic2'),.5),
 [K+'ex1']:r1('ratio'),
 [K+'ex2']:r2('recap2'),
 [K+'ex3']:r2('fine5'),
 [K+'ex4']:r2('verify2'),
 [K+'ex5']:r2('val'),
 [K+'m1']:r1('cand'),
 [K+'m2']:r1('cmp'),
 [K+'m3']:r1('why'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
