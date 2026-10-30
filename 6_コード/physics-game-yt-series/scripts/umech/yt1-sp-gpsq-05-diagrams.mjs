// 特別編 v3「疑問20連発」Q5 (ys-sp-gpsq-05) — 図。Stage 1200×515。★1。
// 「時間を少しまちがえると、どうなる？」 v2 パート1の物差しの図（p23・p24）を import して使う（0.95 倍に縮めて上の Q 点列をあける）。
import {C,seg,fade,label,line,rect,dot,arrow,mix} from './anim.mjs';
import {spGps2_1Diagrams as V2} from './yt1-sp-gps2-1-diagrams.mjs';
import {qwrap,qcard,cueT,fit,card,clock,phone,pin,ruler300,RX0,RW,RY,HC,TC,XC,BAD,RADIO} from './yt1-sp-gpsq-A-common.mjs';

const K='sp-gpsq-05:', N=5, P='sp-gps2-1:';
export const spGpsq05Diagrams={
 [K+'q']:qwrap(N,(p,ctx)=>qcard(N,['時間を 少し まちがえると、','どうなる？'],p,cueT(p,ctx)),{fadeIn:false}),
 [K+'us']:qwrap(N,fit(V2[P+'p23'])),
 // 時計が 100万分の1 秒 ずれる → 場所が 300 m ずれる（p23 の終わりの物差しを引き継ぐ）
 [K+'shift']:qwrap(N,fit((p,ctx)=>{
  const u=seg(p,.35,.7),xw=mix(RX0,RX0+RW,u);
  let s=card(200,20,800,100,label('100万分の1 秒',430,86,{size:36,color:TC,anchor:'middle',weight:700})+arrow(600,74,690,74,{color:C.ink,w:5,head:16})+label('300 m',830,90,{size:44,color:HC,anchor:'middle',weight:700}),1,HC);
  s+=ruler300()+line(RX0,RY,RX0+RW,RY,{color:RADIO,w:7,opacity:.5});
  s+=pin(RX0,RY-6,26,{col:XC,g:seg(p,0,.15)})+fade(seg(p,0,.15),label('本当の 場所',RX0+10,RY+100,{size:30,color:XC,anchor:'middle',weight:700}));
  s+=pin(xw,RY-6,26,{col:BAD,g:seg(p,.3,.4)})+fade(seg(p,.65,.75),label('ずれた 場所',RX0+RW-20,RY+100,{size:30,color:BAD,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.3),label('時計が 100万分の1 秒 ずれると…',600,RY+100,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=card(330,380,540,100,label('場所が 300 m ずれる',600,445,{size:40,color:HC,anchor:'middle',weight:700}),seg(p,.7,.82),HC);
  return s;
 }),{fadeIn:false}),
 [K+'ns']:qwrap(N,fit(V2[P+'p24'])),
 // 場所の正確さ ＝ 時計の正確さ
 [K+'same']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=card(80,50,420,300,pin(290,215,52)+label('場所の 正確さ',290,315,{size:36,color:XC,anchor:'middle',weight:700}),seg(p,0,.12),XC);
  s+=fade(seg(p,.3,.42),label('＝',600,225,{size:96,color:HC,anchor:'middle',weight:700}));
  s+=card(700,50,420,300,clock(910,160,80,{t})+label('時計の 正確さ',910,315,{size:36,color:TC,anchor:'middle',weight:700}),seg(p,.4,.52),TC);
  s+=card(180,385,840,100,label('100万分の1 秒 → 300 m',400,447,{size:30,color:C.ink,anchor:'middle',weight:700})+label('10億分の1 秒 → 30 cm',800,447,{size:30,color:HC,anchor:'middle',weight:700}),seg(p,.6,.72),C.faint);
  return s;
 }),
 // 橋：スマホの時計は、そこまで正確？
 [K+'bridge']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=phone(300,265,400,{dotOn:0})+clock(300,245,80,{t,g:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('スマホの 時計',300,385,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=card(560,120,560,170,label('10億分の1 秒まで',840,190,{size:34,color:TC,anchor:'middle',weight:700})+label('正確？',840,255,{size:48,color:HC,anchor:'middle',weight:700}),seg(p,.3,.45),HC);
  return s;
 },{bridge:true}),
};
