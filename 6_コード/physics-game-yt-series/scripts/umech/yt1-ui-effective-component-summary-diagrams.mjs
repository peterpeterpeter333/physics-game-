// 大学編「内積・初級・要点」(ys-ui-effective-component-summary) — 図。Stage 1200×515.
// 詳しい動画（ui-effective-component-1 / -2 / -3）の図を関数として再利用し、結論の表と締めのカードだけをここで描く。
// 色：力 F・矢印 A 緑、移動 Δr・矢印 B 水色、影 黄、仕事 W 橙、負 赤（詳しい動画と同じ）。ベクトルは太字。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUiEffComp1Diagrams as E1} from './yt1-ui-effective-component-1-diagrams.mjs';
import {ytUiEffComp2Diagrams as E2} from './yt1-ui-effective-component-2-diagrams.mjs';
import {ytUiEffComp3Diagrams as E3} from './yt1-ui-effective-component-3-diagrams.mjs';

const K='ui-effective-component-summary:';
const e1=k=>E1['ui-effective-component-1:'+k],e2=k=>E2['ui-effective-component-2:'+k],e3=k=>E3['ui-effective-component-3:'+k];
const two=(f,g,s)=>p=>p<s?f(p/s):g((p-s)/(1-s));
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bf=(c,s)=>`{\\color{${c}}{\\mathbf{${s}}}}`;

// the three results of this level, revealed one per cue (newest row framed in yellow)
const ROWS=[
 [()=>label('仕事に効くのは 進む向きの成分（影）だけ',560,12,{size:32,color:C.ink,anchor:'middle',weight:700}),''],
 [()=>tex(`${bf(C.F,'A')}\\cdot${bf(C.x,'B')}=AB\\cos\\theta`,520,0,{size:44}),'影の長さ × 長さ'],
 [()=>label('同じ向き AB ／ 直角 0 ／ 逆向き −AB',520,12,{size:32,color:C.ink,anchor:'middle',weight:700}),'向きのない数'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(80,y,1040,115,label(['①','②','③'][i],130,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+(note?label(note,990,y+70,{size:26,color:C.dim,anchor:'middle'}):''),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUiEffCompSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('力の向きと仕事・影を掛ける掛け算',600,280,{size:34,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'c4']:e3('work'),
 [K+'r1']:e1('nochange'),
 [K+'r2']:two(e2('shadow6'),e2('upshadow'),.5),
 [K+'r3']:e3('formula'),
 [K+'ex1']:e1('calc20'),
 [K+'ex2']:e1('zero'),
 [K+'ex3']:e1('comp68'),
 [K+'ex4']:e2('calc12'),
 [K+'ex5']:e3('check'),
 [K+'ex6']:e2('graphpts'),
 [K+'m1']:e2('wrong20'),
 [K+'m2']:e2('toomuch'),
 [K+'m3']:e3('fric'),
 [K+'m4']:e3('fricW'),
 [K+'m5']:e3('fricmiss'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
