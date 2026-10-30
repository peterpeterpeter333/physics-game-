// 特別編 v3「疑問20連発」Q6 (ys-sp-gpsq-06) — 図。Stage 1200×515。★1。
// 「スマホの安い時計で、なぜ大丈夫？」 v2 パート1（p27・p29・p31）と v1 パート1（e38）の図を import して使う（編集しない）。
import {C,seg,fade,label} from './anim.mjs';
import {spGps2_1Diagrams as V2} from './yt1-sp-gps2-1-diagrams.mjs';
import {spGps1Diagrams as V1} from './yt1-sp-gps-1-diagrams.mjs';
import {qwrap,qcard,cueT,fit,clock} from './yt1-sp-gpsq-A-common.mjs';

const K='sp-gpsq-06:', N=6, P='sp-gps2-1:';
export const spGpsq06Diagrams={
 // Q カード ＋ 小さな水晶の時計（点線 ＝ 正しい時刻、実線の針がずれていく）
 [K+'q']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx),off=.4+.45*t;
  const ex=clock(160,300,68,{t,off,ghost:true,g:seg(p,.3,.45)})+fade(seg(p,.3,.45),label('水晶の 時計',160,410,{size:24,color:C.ink,anchor:'middle',weight:700})+label('点線 ＝ 正しい 時刻',160,445,{size:22,color:C.dim,anchor:'middle'}));
  return qcard(N,['スマホの 安い 時計で、','なぜ 大丈夫？'],p,t,{extra:ex});
 },{fadeIn:false}),
 [K+'admit']:qwrap(N,V2[P+'p27']),
 [K+'four']:qwrap(N,fit(V2[P+'p29'],.9)),
 [K+'borrow']:qwrap(N,fit(V1['sp-gps-1:e38'],.93)),
 [K+'bridge']:qwrap(N,V2[P+'p31'],{bridge:true}),
};
