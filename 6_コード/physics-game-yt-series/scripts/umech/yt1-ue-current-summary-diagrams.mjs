// 大学編「電流・上級・要点」(ys-ue-current-summary) — 図。Stage 1200×515.
// 詳しい動画 ue-current-1／-2 の図をそのまま呼び出す（同じ数値・同じ色・同じ向き：𝐄 右、電子の力と平均の速度 左、𝐣・I 右）。結論の表と締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：電流 I・𝐣 緑、𝐄 水色、電圧 V 紫、σ・ρ・R 黄、熱・電力 P 橙。日本語の添字（送・損・線）は TeX に入れず label で書く。
import {C,seg,fade,label,rect} from './anim.mjs';
import {ytUeCurrent1Diagrams as A1,IC,EC,cs,T} from './yt1-ue-current-1-diagrams.mjs';
import {ytUeCurrent2Diagrams as A2} from './yt1-ue-current-2-diagrams.mjs';

const K='ue-current-summary:';
const u1=k=>{const f=A1['ue-current-1:'+k];if(!f)throw new Error('missing ue-current-1:'+k);return f;};
const u2=k=>{const f=A2['ue-current-2:'+k];if(!f)throw new Error('missing ue-current-2:'+k);return f;};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const L=(s,x,o={})=>label(s,x,12,{size:30,color:C.ink,anchor:'start',weight:700,...o});
const VC=C.v,SG=C.hi,HEAT=C.E;
const bj=cs(IC,'\\mathbf{j}'),bE=cs(EC,'\\mathbf{E}'),sg=cs(SG,'\\sigma');

const ROWS=[
 [()=>T(`${bj}=${sg}${bE}`,250,14,{size:42})+T(`${sg}=\\dfrac{ne^2\\tau}{m}`,480,14,{size:36})+L('ならしたモデル（仮定）から',620,{size:26,color:C.dim}),'導いた結果'],
 [()=>T(`${cs(SG,'R')}=\\dfrac{${cs(SG,'\\rho')}\\,l}{S}`,250,14,{size:40})+L('→',400)+T(`${cs(VC,'V')}=${cs(SG,'R')}${cs(IC,'I')}`,520,14,{size:42})+L('初級の実験の法則が 導ける',640,{size:26,color:C.dim}),'導線全体'],
 [()=>L('熱 P ＝ I²R',170,{color:HEAT})+L('送電の損失 P損 ＝ I²R線',420,{color:HEAT}),'ジュール熱'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(60,y,1080,115,label(['①','②','③'][i],110,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,1060,y+70,{size:24,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUeCurrentSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('オームの法則を 電子の衝突から導く',600,250,{size:34,color:C.ink,anchor:'middle',weight:700})
  +label('送電は なぜ 高電圧？',600,320,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u1('lat:hit'),
 [K+'r2']:u1('saw:double'),
 [K+'r3']:u1('eq:model2'),
 [K+'r4']:u1('eq:sign'),
 [K+'r5']:u1('j:sigma'),
 [K+'r6']:u1('r:rho'),
 [K+'r7']:u2('tx:answer'),
 [K+'ex1']:u2('num:set'),
 [K+'ex2']:u2('num:l10'),
 [K+'ex3']:u2('num:l100'),
 [K+'m1']:u2('tx:wrong'),
 [K+'m2']:u2('num:wrong'),
 [K+'m3']:u2('num:v10'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
