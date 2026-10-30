// 特別編 v3「疑問20連発」Q15（ys-sp-gpsq-15）どれだけ遅れるかは、計算できる？ — 図。Stage 1200×515。
// v2 パート3（yt1-sp-gps2-3）r30・r32・r33 を呼んで再利用（編集しない）。上に Q 点列。
// つまみ：v/c＝0.6 → 分母 0.8 など（v2 の検算どおり）。GPS 衛星 3.87 km/s → 1日に約 7.2 μs 遅れ（「約7マイクロ秒」）。
import {C,seg,fade,label,line,rect,dot,ring,arrow} from './anim.mjs';
import {HI,SLOW,FAST,B,T,sT,card,shift,qRow,qCard,nextQ,slowMark,bossFrame,bossPos,BOSS,cc,tug,xf} from './yt1-sp-gpsq-C-common.mjs';
import {clockFace,satellite} from './yt1-sp-gps-3-diagrams.mjs';
import {spGps2_3Diagrams as V2} from './yt1-sp-gps2-3-diagrams.mjs';

const N=15,K='sp-gpsq-15:';
const v2=k=>V2['sp-gps2-3:'+k];
const W=f=>(p,ctx)=>f(p,ctx)+qRow(N,{t:sT(p,ctx)});
const Wb=f=>(p,ctx)=>{const t=sT(p,ctx);return f(p,ctx)+qRow(N,{t,solve:seg(p,.05,.25)})+nextQ(seg(p,.3,.45),t);};

// v と c の意味（式の上の記号に丸と点線）
function vcCards(p,ctx){
 const X=600,Y=160,SZ=66,q=bossPos(X,Y,SZ);
 let s=bossFrame(X-q.W/2-60,40,q.W+120,230,{glow:.4})+T(BOSS,X,Y,{size:SZ});
 const items=[['v','v',['時計の 速さ'],C.v,330,seg(p,.04,.2)],['c',cc,['光の 速さ'],C.v,630,seg(p,.3,.5)]];
 for(const [key,src,txt,col,cx,g] of items){
  const [sx,sy]=q[key],cy=320;
  let o=ring(sx-(key==='v'?12:0),sy-SZ*.12+10,SZ*.42,{color:col,w:3})+line(sx,sy+SZ*.3+10,cx+120,cy,{color:col,w:2,dash:'5 5'});
  o+=card(cx,cy,240,150,T(src,cx+120,cy+52,{size:46})+txt.map((u,i)=>label(u,cx+120,cy+110+i*34,{size:26,color:C.ink,anchor:'middle',weight:700})).join(''),1,col);
  s+=fade(g,o);
 }
 return s;
}

export const spGpsq15Diagrams={
 // 15-1 Q カード＋動く時計（何秒遅れる？）
 [K+'q']:W((p,ctx)=>{
  const t=sT(p,ctx);
  let s=qCard(N,'どれだけ遅れるかは、計算できる？');
  s+=fade(seg(p,.2,.4),clockFace(540,410,62,{ang:t*.12})+slowMark(452,375,60)+label('？ 秒',640,425,{size:40,color:SLOW,weight:700}));
  return s;
 }),
 // 15-2 出せます：ボスの式（v2 r30）
 [K+'boss']:W(v2('r30')),
 // 15-3 v と c → つまみで v を光の速さへ（v2 r32 の後半）
 [K+'knob']:W(xf(vcCards,v2('r32'),.37,.40,{pb:[.55,1]})),
 // 15-4 三平方の定理から（v2 r33）→ 衛星の速さを入れると 1日に約 7 μs
 [K+'sat']:W(xf(v2('r33'),(p,ctx)=>{
  let s=satellite(170,130,1.3)+fade(seg(p,.05,.2),arrow(270,130,370,130,{color:C.v,w:4,head:14})+label('秒速 約3.9 km',320,180,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),arrow(430,130,500,130,{color:C.dim,w:4,head:14})+bossFrame(520,60,300,140,{glow:.3})+T(BOSS,670,140,{size:40}));
  s+=card(330,260,540,200,slowMark(420,290,130)+label('1日に 約',480,335,{size:28,color:C.dim,weight:700})+label('7 μs 遅れる',480,410,{size:52,color:SLOW,weight:700}),seg(p,.3,.45),SLOW);
  return s;
 },.52,.56,{pa:[0,1.4]})),
 // 15-5 橋：速さは解決 → 残るは「高さ」
 [K+'bridge']:Wb((p,ctx)=>{
  const t=sT(p,ctx);
  let s=shift(0,-56,tug(t,{leftTxt:'−7 μs/日',leftDone:1,lean:-10,rightGlow:seg(p,.4,.55)}));
  s+=fade(seg(p,.05,.2),label('解決 ✓',300,176,{size:32,color:SLOW,anchor:'middle',weight:700}));
  s+=card(640,48,420,130,B('残るは、もう一つの 犯人',850,100,{size:28,color:C.ink})+B('「高さ」',850,156,{size:40,color:FAST}),seg(p,.35,.5),FAST);
  return s;
 }),
};
