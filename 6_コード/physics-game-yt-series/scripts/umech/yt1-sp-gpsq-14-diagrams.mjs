// 特別編 v3「疑問20連発」Q14（ys-sp-gpsq-14）原子時計を飛行機で一周させたら？ — 図。Stage 1200×515。
// v1 パート3（yt1-sp-gps-3）c28・c33、v2 パート3（yt1-sp-gps2-3）r26〜r28 を呼んで再利用（編集しない）。上に Q 点列。
import {C,seg,fade,label,line,rect,dot,ring,arrow} from './anim.mjs';
import {HI,SLOW,B,sT,card,shift,qRow,qCard,nextQ,plane,P,bossFrame,BOSS,T,xf} from './yt1-sp-gpsq-C-common.mjs';
import {clockFace,earth,spGps3Diagrams as V1} from './yt1-sp-gps-3-diagrams.mjs';
import {spGps2_3Diagrams as V2} from './yt1-sp-gps2-3-diagrams.mjs';

const N=14,K='sp-gpsq-14:';
const v1=k=>V1['sp-gps-3:'+k],v2=k=>V2['sp-gps2-3:'+k];
const W=f=>(p,ctx)=>f(p,ctx)+qRow(N,{t:sT(p,ctx)});
const Wb=f=>(p,ctx)=>{const t=sT(p,ctx);return f(p,ctx)+qRow(N,{t,solve:seg(p,.05,.25)})+nextQ(seg(p,.3,.45),t);};

export const spGpsq14Diagrams={
 // 14-1 Q カード＋時計を乗せた旅客機
 [K+'q']:W((p,ctx)=>{
  const t=sT(p,ctx),x=150+((t*110)%900);
  let s=qCard(N,'原子時計を飛行機で一周させたら？',{y:160});
  s+=fade(seg(p,.2,.4),line(80,420,1120,420,{color:C.faint,w:2,dash:'6 10'})+plane(x,420-8*Math.sin(t*1.4),0,{col:'#ffd27a',s:1.8})+clockFace(x-10,360,26,{ang:t*.2}));
  return s;
 }),
 // 14-2 1971年、東回りと西回り（v1 c28）→ クイズ（v2 r26。p はそのまま渡して、カウントダウンを pause に合わせる）
 [K+'quiz']:W((p,ctx)=>{
  const u=seg(p,.46,.49);
  return (u<1?fade(1-u,v1('c28')(Math.min(1,p/.5),ctx)+fade(seg(p,.02,.12),label('1971年',1150,470,{size:30,color:C.t,anchor:'end',weight:700}))):'')+(u>0?fade(u,v2('r26')(p,ctx)):'');
 }),
 // 14-3 答え：東回り −59 ns、西回り ＋273 ns（v2 r27 を 16px 下げて）
 [K+'ans']:W((p,ctx)=>shift(0,16,v2('r27')(p,ctx))),
 // 14-4 北極の上から：東回りは地面よりさらに速い（v2 r28）
 [K+'why']:W(v2('r28')),
 // 14-5 予言と一致（v1 c33）→ 橋：どれだけ遅れるかは計算できる？
 [K+'bridge']:Wb(xf(v1('c33'),(p,ctx)=>{
  let s=bossFrame(300,110,600,210,{glow:.4})+label('？',600,250,{size:110,color:HI,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),B('どれだけ 遅れる？ 計算で 出せる？',600,390,{size:34,color:HI}));
  return s;
 },.53,.57)),
};
