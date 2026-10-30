// 特別編 v3「疑問20連発」Q16「重力と加速は、見分けられる？」(ys-sp-gpsq-16) — 図。Stage 1200×515. ★★★★
// v2 パート4（s3・s4：エレベーターのクイズ）と v1 パート4（d4：等価原理・d5：床から天井へ光）を import して再利用。
import {C,seg,fade,mix,sceneT,qHud,qCard,nextQ,v1,v2,lower,clock,L,HI} from './yt1-sp-gpsq-D-common.mjs';

const N=16,K='sp-gpsq-16:';
const H=fn=>(p,ctx)=>fn(p,ctx)+qHud(N,{T:sceneT(p,ctx)});

export const spGpsq16Diagrams={
 // Q カード → 2つのエレベーターとクイズ（カウントダウンは cue の pause の間）
 [K+'q']:H((p,ctx)=>{
  const T=sceneT(p,ctx),a=1-seg(p,.2,.27);
  return qCard(N,'重力と加速は、見分けられる？',{g:a,T})+fade(seg(p,.2,.27),lower(v2('s3',(p-.18)/.82,ctx)));
 }),
 [K+'ans']:H((p,ctx)=>lower(v2('s4',p,ctx))),
 [K+'principle']:H((p,ctx)=>v1('d4',p,ctx)),
 // 橋：床から天井へ光（v1 d5）＋ 時計の「？」
 [K+'bridge']:H((p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=v1('d5',mix(.25,1,p),ctx);
  s+=clock(860,405,48,{T,rate:1,col:C.t,g:seg(p,.45,.6)});
  s+=fade(seg(p,.55,.7),L('時間は？',930,418,{size:34,color:HI,anchor:'start'}));
  return s+nextQ(p,T);
 }),
};
