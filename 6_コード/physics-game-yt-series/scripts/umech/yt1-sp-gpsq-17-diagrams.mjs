// 特別編 v3「疑問20連発」Q17「高い所の時計は、なぜ速く進む？」(ys-sp-gpsq-17) — 図。Stage 1200×515. ★★★★
// v2 パート4（s6：波が天井で伸びる、s7：エレベーター＝塔）と v1 パート4（d10：高い所の時計は速く進む）を再利用。
import {C,seg,fade,mix,sceneT,qHud,qCard,nextQ,v1,v2,clock,tower,groundArc,lens,line,L,HI,XC} from './yt1-sp-gpsq-D-common.mjs';

const N=17,K='sp-gpsq-17:';
const H=fn=>(p,ctx)=>fn(p,ctx)+qHud(N,{T:sceneT(p,ctx)});

export const spGpsq17Diagrams={
 [K+'q']:H((p,ctx)=>{
  const T=sceneT(p,ctx);
  // behind the card: the tower with the two clocks (faint), so the question has a picture
  return fade(.35*seg(p,.3,.6),groundArc(470,{cx:300})+tower(300,470,90))+qCard(N,'高い所の時計は、なぜ速く進む？',{T});
 }),
 [K+'stretch']:H((p,ctx)=>v2('s6',p,ctx)),
 [K+'tower']:H((p,ctx)=>v2('s7',p,ctx)),
 [K+'clocks']:H((p,ctx)=>v1('d10',p,ctx)),
 // 橋：塔の上下の時計の差は、ほんのわずか → 虫めがねで「？」
 [K+'bridge']:H((p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=groundArc(455,{cx:300})+tower(300,455,110);
  s+=clock(160,380,46,{T,rate:1,name:'低い所'})+clock(160,150,46,{T,rate:1.0004,name:'高い所'});
  const inner=clock(720,250,120,{T,rate:1})+line(720,250,720+96*Math.sin(T*1.3+.03),250-96*Math.cos(T*1.3+.03),{color:C.a,w:2,opacity:.7});
  s+=lens(720,250,150,inner,{g:seg(p,.05,.25),id:'b17'});
  s+=fade(seg(p,.3,.45),L('差は ほんの わずか',720,40+20,{size:30,color:HI})+L('？',930,140,{size:80,color:HI}));
  return s+nextQ(p,T);
 }),
};
