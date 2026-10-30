// 特別編 v3「疑問20連発」Q1 (ys-sp-gpsq-01) — 図。Stage 1200×515。★1。
// 「スマホは何も送っていないのに、なぜ場所が分かる？」 v1 パート1の図（地図と青い点、宇宙の図）を import して使う（編集しない）。
// 上の Q 点列・Q カード・「次の疑問 →」は yt1-sp-gpsq-A-common.mjs。
import {C,seg,fade,label,ring,arrow} from './anim.mjs';
import {spGps1Diagrams as V1} from './yt1-sp-gps-1-diagrams.mjs';
import {qwrap,qcard,sub,fit,cueT,card,cross,clock,sat,phone,HC,TC,XC,OK,pin} from './yt1-sp-gpsq-A-common.mjs';

const K='sp-gpsq-01:', N=1;
export const spGpsq01Diagrams={
 [K+'q']:qwrap(N,(p,ctx)=>qcard(N,['スマホは 何も 送っていないのに、','なぜ 場所が 分かる？'],p,cueT(p,ctx)),{fadeIn:false}),
 // 地図の青い点（v1 a1）→ 宇宙から聞くだけ（v1 a2）
 [K+'map']:qwrap(N,fit((p,ctx)=>{
  const k=seg(p,.42,.5);
  return fade(1-k,sub(V1['sp-gps-1:a1'],0,.46)(p,ctx))+fade(k,sub(V1['sp-gps-1:a2'],.44,1)(p,ctx));
 })),
 // 測っているのは「場所」ではなく「時間」
 [K+'time']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx);
  let A=pin(320,250,48)+label('場所',320,370,{size:52,color:XC,anchor:'middle',weight:700});
  let s=card(120,60,400,360,fade(1-.5*seg(p,.22,.32),A),seg(p,0,.1),C.faint)+cross(320,240,70,seg(p,.22,.32));
  let B=clock(880,200,95,{t})+label('時間',880,370,{size:52,color:TC,anchor:'middle',weight:700});
  s+=card(680,60,400,360,B,seg(p,.4,.5),TC);
  s+=fade(seg(p,.62,.72),ring(880,200,112,{color:OK,w:7}));
  s+=fade(seg(p,.45,.6),label('電波が 届くまでに かかった 時間',880,470,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.18),label('スマホが 測っているのは？',320,470,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 }),
 // 橋：時間を測るだけで、場所まで？
 [K+'bridge']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=clock(260,230,110,{t,g:seg(p,0,.15)})+fade(seg(p,0,.15),label('時間',260,410,{size:40,color:TC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.35),arrow(420,230,760,230,{color:C.ink,w:6,head:22})+label('？',590,190,{size:72,color:HC,anchor:'middle',weight:700}));
  s+=pin(930,290,56,{g:seg(p,.3,.5)})+fade(seg(p,.3,.5),label('場所',930,410,{size:40,color:XC,anchor:'middle',weight:700}));
  return s;
 },{bridge:true}),
};
