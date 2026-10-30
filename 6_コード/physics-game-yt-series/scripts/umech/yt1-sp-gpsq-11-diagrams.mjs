// 特別編 v3「疑問20連発」Q11（ys-sp-gpsq-11）光の速さは、足し算できる？ — 図。Stage 1200×515。
// v2 パート3（yt1-sp-gps2-3）r4・r5、v1 パート3（yt1-sp-gps-3）c5 を呼んで再利用（編集しない）。上に Q 点列。
import {C,seg,fade,label,line,rect,dot,ring,arrow} from './anim.mjs';
import {HI,LIGHT,B,sT,card,shift,qRow,qCard,nextQ,person,train,photon,lightClock} from './yt1-sp-gpsq-C-common.mjs';
import {clockFace,spGps3Diagrams as V1} from './yt1-sp-gps-3-diagrams.mjs';
import {spGps2_3Diagrams as V2} from './yt1-sp-gps2-3-diagrams.mjs';

const N=11,K='sp-gpsq-11:';
const v1=k=>V1['sp-gps-3:'+k],v2=k=>V2['sp-gps2-3:'+k];
const W=f=>(p,ctx)=>f(p,ctx)+qRow(N,{t:sT(p,ctx)});
const Wb=f=>(p,ctx)=>{const t=sT(p,ctx);return f(p,ctx)+qRow(N,{t,solve:seg(p,.05,.25)})+nextQ(seg(p,.3,.45),t);};

export const spGpsq11Diagrams={
 // 11-1 Q カード → 上に畳んで、電車＋ボールの速さの足し算
 [K+'q']:W((p,ctx)=>{
  const to=seg(p,.3,.42),g2=seg(p,.36,.46),u=seg(p,.42,.95),tx=150+u*170;
  let s='';
  s+=fade(g2,line(30,440,1170,440,{color:C.dim,w:3})+label('ホーム',40,478,{size:24,color:C.dim})+person(80,440,{s:1.1})+train(tx,300,280,110));
  const gb=seg(p,.55,.6),bx=tx+290+seg(p,.57,.8)*420;
  s+=fade(gb,dot(bx,345,14,'#f4f4f4')+ring(bx,345,14,{color:C.dim,w:2}));
  s+=fade(seg(p,.46,.54),arrow(150,212,370,212,{color:C.v,w:6,head:18})+label('電車の 速さ',260,196,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.66),arrow(370,212,590,212,{color:C.v,w:6,head:18})+label('ボールの 速さ',480,250,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.68,.74),arrow(150,278,590,278,{color:HI,w:7,head:20})+label('ホームの 人に 見える 速さ',610,286,{size:28,color:HI,weight:700}));
  s+=card(900,60,270,110,B('光も',1035,104,{size:32,color:LIGHT})+B('足し算？',1035,150,{size:36,color:HI}),seg(p,.8,.88),HI);
  s+=qCard(N,'光の速さは、足し算できる？',{to});
  return s;
 }),
 // 11-2 答えはノー：追いかけても、向かっていっても、いつも 30万 km/s（v2 r4 を 20px 下げて）
 [K+'no']:W((p,ctx)=>shift(0,22,v2('r4')(p,ctx))+fade(seg(p,.02,.12),label('答え：ノー',40,64,{size:38,color:HI,weight:700}))),
 // 11-3 実験で確かめられた事実（v2 r5）
 [K+'fact']:W(v2('r5')),
 // 11-4 アインシュタインの決断：c は変えない、t が変わってよい（v1 c5）
 [K+'ein']:W(v1('c5')),
 // 11-5 橋：光時計と、？の時計
 [K+'bridge']:Wb((p,ctx)=>{
  const t=sT(p,ctx);
  let s=card(90,70,420,370,'',1,C.v)+lightClock(300,390,t,{L:240});
  s+=B('光の 速さ c は 変わらない',300,428,{size:26,color:C.v});
  s+=fade(seg(p,.1,.25),arrow(540,255,640,255,{color:HI,w:6,head:18}));
  s+=fade(seg(p,.15,.3),clockFace(840,240,110,{ang:t*.25})+label('？',840,180,{size:64,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),B('時計に、何が 起きる？',840,410,{size:32,color:HI}));
  return s;
 }),
};
