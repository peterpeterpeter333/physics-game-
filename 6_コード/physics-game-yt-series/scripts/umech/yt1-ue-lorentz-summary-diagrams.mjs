// 大学編「ローレンツ力・上級・要点」(ys-ue-lorentz-summary) — 図。Stage 1200×515.
// 詳しい動画 ue-lorentz-1・2 の図をそのまま呼び出す（同じ数値・同じ色）。結論の表・間違いのカード・締めだけ ここで描く。
// 色（詳しい動画と同じ）：𝐯 紫、𝐁 橙、𝐅 緑、電流 I 緑、𝐥 水色、電荷 q 桃、半径 r 水色、周期 T 金、ピッチ p 黄、誤り 赤。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUeLorentz1Diagrams as A1} from './yt1-ue-lorentz-1-diagrams.mjs';
import {ytUeLorentz2Diagrams as A2} from './yt1-ue-lorentz-2-diagrams.mjs';

const K='ue-lorentz-summary:';
const SRC={1:A1,2:A2};
const u=(n,k)=>{const f=SRC[n]['ue-lorentz-'+n+':'+k];if(!f)throw new Error('missing ue-lorentz-'+n+':'+k);return f;};
// 一つの cue の中で、前半と後半に別の図を使う（それぞれ 0→1 に引き伸ばす）
const two=(f1,f2,cut=.5)=>(p,ctx)=>p<cut?f1(p/cut,ctx):f2((p-cut)/(1-cut),ctx);
const CV=C.v,CB=C.E,CF=C.F,CI=C.F,CQ=C.p,CR=C.x,CT=C.t,CP=C.hi,CL=C.x,HI=C.hi,NG=C.a;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const bB=cs(CB,'\\mathbf{B}'),bF=cs(CF,'\\mathbf{F}'),bl=cs(CL,'\\mathbf{l}'),II=cs(CI,'I'),BB=cs(CB,'B'),aq=`|${cs(CQ,'q')}|`,vpe=cs(CV,'v_{\\perp}'),vpa=cs(CV,'v_{\\parallel}');
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

const ROWS=[
 ['らせん',y=>T(`${cs(CR,'r')}=\\dfrac{m\\,${vpe}}{${aq}\\,${BB}}`,330,y+66,{size:32})+T(`${cs(CT,'T')}=\\dfrac{2\\pi m}{${aq}\\,${BB}}`,620,y+66,{size:32})+T(`${cs(CP,'p')}=${vpa}\\,${cs(CT,'T')}`,900,y+60,{size:36})],
 ['導線の力',y=>T(`${bF}=${II}\\,${bl}\\times${bB}`,420,y+58,{size:42})+label('電子でも同じ式，直角なら',760,y+68,{size:26,color:C.ink,anchor:'middle'})+T(`F=${BB}\\,${II}\\,l`,1010,y+58,{size:36})],
 ['モーター',y=>label('コイルの2辺に 逆向きの力 →',530,y+68,{size:28,color:C.ink,anchor:'middle'})+T(`N\\,${II}\\,A\\,${BB}`,830,y+60,{size:40,color:HI})+label('トルク',960,y+68,{size:26,color:HI})],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([h,f],i)=>{
  if(i>=n)return;
  const y=80+i*135,last=fresh&&i===n-1,g=last?seg(p,.03,.2):1;
  s+=card(60,y,1080,115,label(['①','②','③'][i],105,y+70,{size:36,color:HI,anchor:'middle',weight:700})+label(h,150,y+68,{size:26,color:C.dim})+f(y),g,last?HI:C.faint);
 });
 return s;
}

export const ytUeLorentzSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('1個の粒子の らせん → 導線全体の力',600,280,{size:36,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:two(u(1,'split'),u(1,'par'),.45),
 [K+'r2']:two(u(1,'clock'),u(1,'helix'),.5),
 [K+'r3']:two(u(2,'sum'),u(2,'result'),.6),
 [K+'r4']:u(2,'elec2'),
 [K+'ex1']:u(1,'data'),
 [K+'ex2']:u(1,'p'),
 [K+'ex3']:two(u(2,'ex2'),u(2,'ex3'),.55),
 [K+'ex4']:two(u(2,'coil'),u(2,'side'),.45),
 [K+'ex5']:two(u(2,'torque'),u(2,'niab'),.5),
 [K+'m1']:(p)=>{
  let s=card(160,70,880,380,label('よくある間違い',600,125,{size:28,color:NG,anchor:'middle',weight:700}),seg(p,0,.12),NG);
  s+=fade(seg(p,.15,.35),label('モーターは 仕事をする',600,220,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),label('→ 磁気力が 電荷に 仕事をしている？',600,320,{size:32,color:NG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m2']:u(2,'work'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:HI,anchor:'middle',weight:700}),seg(p,.05,.25),HI),
};
