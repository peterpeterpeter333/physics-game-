// 特別編 v3「疑問20連発」Q3 (ys-sp-gpsq-03) — 図。Stage 1200×515。★1。
// 「距離が分かると、なぜ場所が決まる？」 v2 パート1の塔と円の図（p15〜p20）を import して使う（編集しない）。
// 上の Q 点列のため、塔の図は 0.95 倍に縮めて下に寄せる（fit）。
import {C,seg,fade,label,scaleAt} from './anim.mjs';
import {spGps2_1Diagrams as V2} from './yt1-sp-gps2-1-diagrams.mjs';
import {qwrap,qcard,cueT,sub,fit} from './yt1-sp-gpsq-A-common.mjs';

const K='sp-gpsq-03:', N=3, P='sp-gps2-1:';
export const spGpsq03Diagrams={
 [K+'q']:qwrap(N,(p,ctx)=>qcard(N,['距離が 分かると、','なぜ 場所が 決まる？'],p,cueT(p,ctx)),{fadeIn:false}),
 [K+'one']:qwrap(N,fit(V2[P+'p16'])),
 // 2つ目の塔 → 2点、3つ目の塔 → 1点
 [K+'three']:qwrap(N,fit((p,ctx)=>{
  const k=seg(p,.56,.6);
  return fade(1-k,sub(V2[P+'p17'],0,.58)(p,ctx))+fade(k,sub(V2[P+'p18'],.56,1)(p,ctx));
 }),{fadeIn:false}),
 [K+'sat']:qwrap(N,fit(V2[P+'p19']),{fadeIn:false}),
 [K+'bridge']:qwrap(N,(p,ctx)=>scaleAt(600,40,.9,V2[P+'p20'](p,ctx)),{bridge:true}),
};
