// 特別編 v3「疑問20連発」Q19「綱引きの勝者は、どっち？」(ys-sp-gpsq-19) — 図。Stage 1200×515. ★★★★
// v2 パート4（s20・s21：綱引き、s22：地図の点が滑る、s23：技術者たち）を再利用。
// s21 は最後に「予想は？」のカードが出る（v2 の台本用）ので、その手前まで（p×0.68）だけ使う。
import {C,seg,fade,sceneT,qHud,qCard,nextQ,v2,lower,line,L} from './yt1-sp-gpsq-D-common.mjs';

const N=19,K='sp-gpsq-19:';
const H=fn=>(p,ctx)=>fn(p,ctx)+qHud(N,{T:sceneT(p,ctx)});

export const spGpsq19Diagrams={
 [K+'q']:H((p,ctx)=>{
  const T=sceneT(p,ctx);
  return fade(.3*seg(p,.3,.6),line(60,440,1140,440,{color:C.dim,w:3})+line(140,352,1060,352,{color:'#c9a46a',w:7}))+qCard(N,'綱引きの勝者は、どっち？',{T});
 }),
 [K+'tug']:H((p,ctx)=>lower(v2('s20',p,ctx))),
 [K+'win']:H((p,ctx)=>lower(v2('s21',p*.68,ctx))),
 [K+'drift']:H((p,ctx)=>v2('s22',p,ctx)),
 [K+'bridge']:H((p,ctx)=>{
  const T=sceneT(p,ctx);
  return v2('s23',p,ctx)+nextQ(p,T);
 }),
};
