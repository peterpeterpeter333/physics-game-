// 大学編「微分・上級・要点」(ys-um-derivative-summary) — 図。Stage 1200×515.
// 詳しい動画（um-derivative-1 / -2 / -3）の図を関数として再利用し、結論の表と締めのカードだけをここで描く。
// 色（anim.mjs C）：位置 x 水色、速度 v 紫、加速度 a 赤、時刻・幅 t,h 金、角度 橙、強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUmDerivative1Diagrams as D1} from './yt1-um-derivative-1-diagrams.mjs';
import {ytUmDerivative2Diagrams as D2} from './yt1-um-derivative-2-diagrams.mjs';
import {ytUmDerivative3Diagrams as D3} from './yt1-um-derivative-3-diagrams.mjs';

const K='um-derivative-summary:';
const d1=k=>D1['um-derivative-1:'+k],d2=k=>D2['um-derivative-2:'+k],d3=k=>D3['um-derivative-3:'+k];
const two=(f,g,s)=>p=>p<s?f(p/s):g((p-s)/(1-s));
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

// the three results of this level, revealed one per cue (n = how many rows are shown; the newest row is framed in yellow)
const ROWS=[
 [()=>tex("(t^n)'=nt^{n-1}",560,0,{size:44}),'n は 正の整数'],
 [()=>tex("(\\sin t)'=\\cos t,\\quad(\\cos t)'=-\\sin t",560,0,{size:40}),'角は ラジアン'],
 [()=>label('尖った点（x ＝ |t| の t ＝ 0）',560,12,{size:32,color:C.ink,anchor:'middle',weight:700}),'微分できない'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(80,y,1040,115,label(['①','②','③'][i],130,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,1000,y+70,{size:26,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUmDerivativeSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('べき関数・sin と cos・微分できない点',600,280,{size:34,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'c4']:d3('d2'),
 [K+'r1']:d1('gen3'),
 [K+'r2']:d2('diff3'),
 [K+'r3']:two(d2('ineq'),d2('squeeze'),.5),
 [K+'r4']:d3('absm'),
 [K+'quiz']:d1('quiz'),
 [K+'ans1']:d1('ans1'),
 [K+'ans2']:d1('ans2'),
 [K+'ans3']:d1('ans3'),
 [K+'mistake']:d3('abs'),
 [K+'abs']:two(d3('absr'),d3('absl'),.5),
 [K+'zoom2']:d3('zoom2'),
 [K+'cont']:d3('cont'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
