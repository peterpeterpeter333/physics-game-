// 特別編 v3「疑問20連発」Q18「高さによる時間の差は、本当に測れる？」(ys-sp-gpsq-18) — 図。Stage 1200×515. ★★★★
// v2 パート4（s11・s12：スカイツリー、s15：1 cm、s17：頭と足 80年、s18：2万 km の衛星）を再利用。
import {C,seg,fade,sceneT,qHud,qCard,nextQ,v2,groundArc,clock,L} from './yt1-sp-gpsq-D-common.mjs';

const N=18,K='sp-gpsq-18:';
const H=fn=>(p,ctx)=>fn(p,ctx)+qHud(N,{T:sceneT(p,ctx)});
// first sentence of the 1 cm cue ends at about this fraction of the cue (set from the voice timing)
const CM=.36;

export const spGpsq18Diagrams={
 [K+'q']:H((p,ctx)=>{
  const T=sceneT(p,ctx);
  return fade(.35*seg(p,.3,.6),groundArc(470,{cx:300}))+qCard(N,'高さによる時間の差は、本当に測れる？',{T});
 }),
 [K+'tree']:H((p,ctx)=>v2('s11',p,ctx)),
 [K+'result']:H((p,ctx)=>v2('s12',p,ctx)),
 [K+'body']:H((p,ctx)=>{
  const a=1-seg(p,CM-.03,CM+.03),b=seg(p,CM-.03,CM+.03);
  return fade(a,v2('s15',p/CM,ctx))+fade(b,v2('s17',(p-CM)/(1-CM),ctx));
 }),
 [K+'bridge']:H((p,ctx)=>{
  const T=sceneT(p,ctx);
  return v2('s18',p,ctx)+fade(seg(p,.5,.65),L('綱引きは？',960,392,{size:30,color:C.hi,anchor:'end'}))+nextQ(p,T);
 }),
};
