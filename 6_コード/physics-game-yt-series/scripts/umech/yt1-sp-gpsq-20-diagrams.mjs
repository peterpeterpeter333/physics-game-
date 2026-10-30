// 特別編 v3「疑問20連発」Q20「技術者は、アインシュタインを信じたか？」(ys-sp-gpsq-20) — 図。Stage 1200×515. ★★★★ 全体の締め。
// v1 パート4（f1・f2：1977年の試験衛星とスイッチ、f3・f5・f6：20日間・予言と測定の棒・補正開始、g2・g3：10.22999999543 → 10.23 MHz）と
// v2 パート4（s33：3枚のカードが地図に重なる、s36：ブラックホール）を再利用。
// 20-5 で Q1〜Q20 の点がすべて塗られる（いまの Q20 も水色に）。
import {C,seg,fade,sceneT,qHud,qCard,nextQ,v1,v2,lower,earth,L,HI,XC} from './yt1-sp-gpsq-D-common.mjs';

const N=20,K='sp-gpsq-20:';
const H=fn=>(p,ctx)=>fn(p,ctx)+qHud(N,{T:sceneT(p,ctx)});
// piecewise: [[from, key, src]] — show v1/v2 diagram `key` from `from` on, cross-fading over 0.06
function pieces(p,ctx,list){
 let s='';
 list.forEach(([a,src,key],i)=>{
  const b=list[i+1]?.[0]??1.0001;
  const g=(i?seg(p,a-.03,a+.03):1)*(list[i+1]?1-seg(p,b-.03,b+.03):1);
  if(g>.001)s+=fade(g,(src===1?v1:v2)(key,(p-a)/(b-a),ctx));
 });
 return s;
}

export const spGpsq20Diagrams={
 [K+'q']:H((p,ctx)=>{
  const T=sceneT(p,ctx);
  return fade(.35*seg(p,.3,.6),earth(860,760,320))+qCard(N,'技術者は、アインシュタインを信じたか？',{T});
 }),
 [K+'nts']:H((p,ctx)=>lower(pieces(p,ctx,[[0,1,'f1'],[.3,1,'f2']]),.95)),
 [K+'match']:H((p,ctx)=>lower(pieces(p,ctx,[[0,1,'f3'],[.26,1,'f5'],[.66,1,'f6']]),.95)),
 [K+'tune']:H((p,ctx)=>lower(pieces(p,ctx,[[0,1,'g2'],[.5,1,'g3']]),.95)),
 // 3枚のカード＋ Q1〜Q20 の点がすべて塗られる
 [K+'all']:(p,ctx)=>{
  const T=sceneT(p,ctx),d=seg(p,.78,.9);
  let s=v2('s33',p,ctx);
  s+=fade(d,L('20 / 20 解決',1182,64,{size:24,color:XC,anchor:'end'}));
  return s+qHud(N,{T,done:d});
 },
 [K+'bh']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  return '<g transform="translate(-40 0)">'+lower(v2('s36',p,ctx),.91)+'</g>'+qHud(N,{T,done:1})+nextQ(p,T,{x:1196,y:503});
 },
};
