// 大学編「ローレンツ力・中級・要点」(ys-um-magnetic-force-summary) — 図。Stage 1200×515.
// 詳しい動画 um-magnetic-force-1・2 の図をそのまま呼び出す（同じ数値・同じ色）。結論の表・間違いのカード・締めだけ ここで描く。
// 色（詳しい動画と同じ）：𝐯 紫、𝐁 橙、𝐅 緑、電荷 q 桃、半径 r 水色、誤り 赤。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUmMagneticForce1Diagrams as A1} from './yt1-um-magnetic-force-1-diagrams.mjs';
import {ytUmMagneticForce2Diagrams as A2} from './yt1-um-magnetic-force-2-diagrams.mjs';

const K='um-magnetic-force-summary:';
const SRC={1:A1,2:A2};
const u=(n,k)=>{const f=SRC[n]['um-magnetic-force-'+n+':'+k];if(!f)throw new Error('missing um-magnetic-force-'+n+':'+k);return f;};
// 一つの cue の中で、前半と後半に別の図を使う（それぞれ 0→1 に引き伸ばす）
const two=(f1,f2,cut=.5)=>(p,ctx)=>p<cut?f1(p/cut,ctx):f2((p-cut)/(1-cut),ctx);
const CV=C.v,CB=C.E,CF=C.F,CQ=C.p,CR=C.x,CI=C.hi,NG=C.a;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}'),bF=cs(CF,'\\mathbf{F}'),bE=cs(C.x,'\\mathbf{E}'),qq=cs(CQ,'q'),vv=cs(CV,'v'),BB=cs(CB,'B'),rr=cs(CR,'r'),aq=`|${qq}|`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

const ROWS=[
 ['法則',y=>T(`${bF}=${qq}\\,(${bE}+${bv}\\times${bB})`,420,y+58,{size:38})+label('実験に支えられた法則（𝐄＝0 で考える）',880,y+68,{size:24,color:C.dim,anchor:'middle'})],
 ['大きさ・向き',y=>T(`${aq}\\,${vv}\\,${BB}\\sin\\theta`,430,y+56,{size:42})+label('向き：𝐯×𝐁 に q の符号',760,y+50,{size:26,color:C.ink,anchor:'middle'})+T(`1\\,\\mathrm{T}=1\\,\\mathrm{N/(A\\cdot m)}`,760,y+92,{size:28,color:CB})],
 ['円の半径',y=>T(`${rr}=\\dfrac{m\\,${vv}}{${aq}\\,${BB}}`,460,y+72,{size:34})+label('1周の時間は 速さによらない',820,y+68,{size:28,color:CI,anchor:'middle',weight:700})],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([h,f],i)=>{
  if(i>=n)return;
  const y=80+i*135,last=fresh&&i===n-1,g=last?seg(p,.03,.2):1;
  s+=card(60,y,1080,115,label(['①','②','③'][i],105,y+70,{size:36,color:CI,anchor:'middle',weight:700})+label(h,150,y+68,{size:26,color:C.dim})+f(y),g,last?CI:C.faint);
 });
 return s;
}

export const ytUmMagneticForceSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('磁場の力を 外積で読む → 円の半径',600,280,{size:36,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:two(u(2,'power'),u(2,'const'),.55),
 [K+'r2']:u(2,'bottom'),
 [K+'r3']:u(2,'eq'),
 [K+'r4']:two(u(2,'div'),u(2,'solve'),.45),
 [K+'r5']:u(2,'cond'),
 [K+'ex1']:u(1,'example'),
 [K+'ex2']:two(u(1,'dir'),u(1,'sign'),.45),
 [K+'ex3']:u(1,'unitRead'),
 [K+'ex4']:two(u(1,'unitRead'),u(1,'unitRead2'),.5),
 [K+'ex5']:u(2,'proton'),
 [K+'ex6']:two(u(2,'num'),u(2,'r'),.6),
 [K+'ex7']:u(2,'period2'),
 [K+'m1']:(p)=>{
  let s=card(160,70,880,380,label('よくある間違い',600,125,{size:28,color:NG,anchor:'middle',weight:700}),seg(p,0,.12),NG);
  s+=fade(seg(p,.1,.3),T(`${rr}=\\dfrac{m\\,${vv}}{${qq}\\,${BB}}`,430,240,{size:52}));
  s+=fade(seg(p,.35,.55),label('q ＝ −e を そのまま 入れる',800,235,{size:28,color:CQ,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),label('→ 半径が 負？',600,380,{size:36,color:NG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m2']:u(2,'abs'),
 [K+'m3']:u(2,'ccw'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:CI,anchor:'middle',weight:700}),seg(p,.05,.25),CI),
};
