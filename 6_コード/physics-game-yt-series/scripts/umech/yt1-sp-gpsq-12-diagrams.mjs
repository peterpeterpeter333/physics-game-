// 特別編 v3「疑問20連発」Q12（ys-sp-gpsq-12）光の速さが変わらないと、なぜ時計が遅れる？ — 図。Stage 1200×515。
// v1 パート3（yt1-sp-gps-3）c9・c10・c11、v2 パート3（yt1-sp-gps2-3）r14 を呼んで再利用（編集しない）。上に Q 点列。
import {C,seg,fade,label,line,rect,dot,ring,arrow} from './anim.mjs';
import {HI,LIGHT,SLOW,B,sT,card,qRow,qCard,nextQ,lightClock,slowMark,xf} from './yt1-sp-gpsq-C-common.mjs';
import {clockFace,spGps3Diagrams as V1} from './yt1-sp-gps-3-diagrams.mjs';
import {spGps2_3Diagrams as V2} from './yt1-sp-gps2-3-diagrams.mjs';

const N=12,K='sp-gpsq-12:';
const v1=k=>V1['sp-gps-3:'+k],v2=k=>V2['sp-gps2-3:'+k];
const W=f=>(p,ctx)=>f(p,ctx)+qRow(N,{t:sT(p,ctx)});
const Wb=f=>(p,ctx)=>{const t=sT(p,ctx);return f(p,ctx)+qRow(N,{t,solve:seg(p,.05,.25)})+nextQ(seg(p,.3,.45),t);};

export const spGpsq12Diagrams={
 // 12-1 Q カード＋動く時計（遅れる）
 [K+'q']:W((p,ctx)=>{
  const t=sT(p,ctx);
  let s=qCard(N,'光の速さが変わらないと、なぜ時計が遅れる？');
  s+=fade(seg(p,.2,.4),clockFace(540,410,62,{ang:t*.12})+arrow(630,410,720,410,{color:C.v,w:5,head:16})+label('v',735,418,{size:28,color:C.v,weight:700})+slowMark(452,375,60));
  return s;
 }),
 // 12-2 光時計を、電車の中から見る（v1 c9）
 [K+'in']:W(v1('c9')),
 // 12-3 ホームから見ると斜め（v1 c10 → c11）
 [K+'out']:W(xf(v1('c10'),v1('c11'),.55,.59)),
 // 12-4 長い道 → 1カチッ に時間がかかる（v2 r14）
 [K+'slow']:W(v2('r14')),
 // 12-5 橋：頭の中の実験 → 本当に？
 [K+'bridge']:Wb((p,ctx)=>{
  const t=sT(p,ctx);
  let s=`<ellipse cx="320" cy="250" rx="230" ry="190" fill="#131f38" fill-opacity=".96" stroke="${C.dim}" stroke-width="2"/>`;
  s+=dot(150,470,14,'#131f38')+ring(150,470,14,{color:C.dim,w:2})+dot(110,500,8,'#131f38')+ring(110,500,8,{color:C.dim,w:2});
  s+=lightClock(320,330,t,{L:160})+B('頭の 中の 実験',320,385,{size:26,color:C.dim});
  s+=fade(seg(p,.1,.25),label('✓',470,140,{size:52,color:C.F,anchor:'middle',weight:700}));
  s+=card(640,140,480,170,B('本当に、',880,205,{size:34,color:C.ink})+B('そんなことが 起きている？',880,265,{size:36,color:HI}),seg(p,.4,.55),HI);
  return s;
 }),
};
