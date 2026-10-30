// 大学編「仕事・初級・要点」(ys-ui-work-constant-summary) — 図。Stage 1200×515.
// 詳しい動画（ui-work-constant-1 / -2）の図を関数として再利用し、結論の表と締めのカードだけをここで描く。
// 色（詳しい動画と同じ）：力 F 緑、距離 L・位置 x 水色、仕事 W・エネルギー 橙、負の仕事 赤、強調 黄。
import {C,seg,fade,label,rect,tex,texWidth} from './anim.mjs';
import {ytUiWork1Diagrams as W1} from './yt1-ui-work-constant-1-diagrams.mjs';
import {ytUiWork2Diagrams as W2} from './yt1-ui-work-constant-2-diagrams.mjs';

const K='ui-work-constant-summary:';
const w1=k=>W1['ui-work-constant-1:'+k],w2=k=>W2['ui-work-constant-2:'+k];
const two=(f,g,s)=>(p,ctx)=>p<s?f(p/s,ctx):g((p-s)/(1-s),ctx);
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cF=s=>`{\\color{${C.F}}{${s}}}`,cL=s=>`{\\color{${C.x}}{${s}}}`,cW=s=>`{\\color{${C.E}}{${s}}}`;
const TF=(s,x,maxW,size)=>{const w=texWidth(s,size,false);return tex(s,x,0,{size:w>maxW?size*maxW/w:size,auto:false});};

// the three results of this level, revealed one per cue (newest row framed in yellow)
const ROWS=[
 [()=>TF(`${cW('W')}=${cF('F')}${cL('L')}\\qquad \\mathrm{N\\cdot m}=${cW('\\mathrm{J}')}`,470,520,42),'定義（向きが そろうとき）'],
 [()=>label('逆向きの力 → 仕事は 負',470,12,{size:34,color:C.ink,anchor:'middle',weight:700}),'エネルギーを 取り出す'],
 [()=>label('斜めの力 → 進む向きの 成分だけ',470,12,{size:34,color:C.ink,anchor:'middle',weight:700}),'直角な成分は 仕事 0'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(80,y,1040,115,label(['①','②','③'][i],130,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,955,y+70,{size:24,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUiWorkConstantSummaryDiagrams={
 [K+'intro']:w1('recap'),
 [K+'c1']:(p)=>results(p,1),
 [K+'c1b']:(p)=>results(p,1,{fresh:false})+fade(seg(p,.2,.4),card(300,250,600,170,label('N·m ＝ ジュール J',600,320,{size:40,color:C.E,anchor:'middle',weight:700})+label('ニュートン × メートル',600,375,{size:28,color:C.dim,anchor:'middle'}),1,C.E)),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:w1('prop'),
 [K+'r2']:w1('side'),
 [K+'ex1']:w1('push'),
 [K+'ex2']:w1('unit2'),
 [K+'ex3']:w1('rect'),
 [K+'ex4']:w2('fricgraph'),
 [K+'ex5']:two(w2('slant'),w2('shadow'),.5),
 [K+'ex6']:w2('slantW'),
 [K+'m1']:w1('wall'),
 [K+'m2']:w1('wall0'),
 [K+'m3']:w1('tired2'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'sum2']:w1('energy'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
