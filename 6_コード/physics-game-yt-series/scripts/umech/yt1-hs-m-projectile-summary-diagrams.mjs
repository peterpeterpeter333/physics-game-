// 高校編「放物運動・要点」(ys-hs-m-projectile-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/3・2/3・3/3 の図を借りる（数値例も同じ：g＝10、45 m・20 m/s → 3 s・60 m、25 m/s・cosθ＝0.8 → 20・15）。
import {C,seg,fade,label,tex,arrow} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {Gt,Yt,ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {hsProjectile1Diagrams as P1,hThrow,cliff,cliffPath,CL,T1} from './yt1-hs-m-projectile-1-diagrams.mjs';
import {hsProjectile2Diagrams as P2,slant} from './yt1-hs-m-projectile-2-diagrams.mjs';
import {hsProjectile3Diagrams as P3} from './yt1-hs-m-projectile-3-diagrams.mjs';

const K='hs-m-projectile-summary:';
const use=(D,key)=>(p)=>D[key](p);

export const hsProjectileSummaryDiagrams={
 // ================= S1 結論 =================
 [K+'point']:(p)=>{
  const u=seg(p,.05,.6);
  let s=slant({ts:[],path:u,ballAt:3*u});
  s+=card(760,110,400,170,label('投げた 物の 運動',960,170,{size:28,color:C.ink,anchor:'middle'})+label('横 ＋ 縦 に 分ける',960,235,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'two']:(p)=>{
  let s=hThrow({va:1,tl:0});
  s+=card(760,90,400,130,label('横',960,140,{size:26,color:C.dim,anchor:'middle'})+label('等速',960,195,{size:36,color:C.x,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(760,250,400,130,label('縦',960,300,{size:26,color:C.dim,anchor:'middle'})+label('落体（下向きに g）',960,355,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.35,.5));
  return s;
 },
 [K+'tie']:use(P1,'hs-m-projectile-1:tie'),
 // ================= S2 なぜ =================
 [K+'why']:use(P1,'hs-m-projectile-1:why'),
 [K+'photo']:(p)=>{
  let s=hThrow({drop:1,rows:seg(p,.2,.45)});
  s+=card(760,120,400,130,label('同時に 撮ると',960,175,{size:26,color:C.dim,anchor:'middle'})+label('縦の 位置が そろう',960,225,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  s+=card(760,280,400,100,label('実験で 確かめた 事実',960,340,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.65,.8));
  return s;
 },
 [K+'later']:use(P1,'hs-m-projectile-1:later'),
 // ================= S3 数値例 =================
 [K+'g10']:(p)=>{
  let s=fade(.6,cliff())+ball(CL.x0,CL.y0);
  s+=card(760,80,400,150,label('計算を 見やすく するため',960,130,{size:24,color:C.ink,anchor:'middle'})+tex(Gt+'=10\\ \\mathrm{m/s^2}',960,195,{size:44,auto:false}),seg(p,.02,.15),C.a);
  return s;
 },
 [K+'throw']:(p)=>{
  let s=cliff({hl:1})+arrow(CL.x0+16,CL.y0,CL.x0+90,CL.y0,{color:C.v,w:5,head:14})+ball(CL.x0,CL.y0);
  s+=fade(.5,card(760,80,400,150,label('計算を 見やすく するため',960,130,{size:24,color:C.ink,anchor:'middle'})+tex(Gt+'=10\\ \\mathrm{m/s^2}',960,195,{size:44,auto:false}),1,C.a));
  s+=card(760,260,400,110,label('45 m から 水平に 20 m/s',960,325,{size:26,color:C.v,anchor:'middle',weight:700}),seg(p,.1,.25),C.v);
  return s;
 },
 [K+'t3']:(p)=>{
  let s=T1('45=\\tfrac12\\times 10\\times t^2',600,90,{size:48});
  s+=fade(seg(p,.4,.55),T1('t^2=9',600,200,{size:50}));
  s+=card(420,260,360,130,T1('t=3\\ \\mathrm{s}',600,330,{size:56}),seg(p,.6,.75),C.t);
  return s;
 },
 [K+'x60']:use(P1,'hs-m-projectile-1:x60'),
 [K+'slant']:use(P2,'hs-m-projectile-2:ans'),
 [K+'comp']:use(P2,'hs-m-projectile-2:calc'),
 [K+'top']:use(P2,'hs-m-projectile-2:notzero'),
 [K+'range']:use(P3,'hs-m-projectile-3:ans2'),
 // ================= S4 よくある間違い =================
 [K+'mis']:(p)=>{
  let s=fade(.35,cliff()+cliffPath(20,{color:'#a9b6f0'})+cliffPath(40));
  s+=card(250,130,800,200,label('よくある 間違い',650,195,{size:28,color:C.a,anchor:'middle',weight:700})+label('速く 投げるほど 長く 浮く？',650,265,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'v40']:(p)=>{
  let s=P1['hs-m-projectile-1:x120'](p);
  s+=fade(seg(p,.2,.35),label('どちらも 3 s',965,400,{size:30,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 // 2026-10-07 点検：斜方投射の後なので「水平に投げるとき」と限定（深1/3 の key を元に札だけ変更）
 [K+'height']:(p)=>{
  let s=card(630,90,460,190,label('縦',860,140,{size:26,color:C.dim,anchor:'middle'})+T1(Yt+'=\\tfrac12'+Gt+'t^2',860,220,{size:52}),1,C.hi);
  s+=fade(.35,card(110,90,460,190,label('横',340,140,{size:26,color:C.dim,anchor:'middle'})+T1('x=v_0t',340,220,{size:56}),1,C.x));
  s+=card(150,330,900,130,label('水平に 投げるとき：落ちるまでの 時間 ← 高さ だけで 決まる',600,408,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  return s;
 },
 // ================= S5 まとめ =================
 [K+'sum']:use(P1,'hs-m-projectile-1:sum'),
 [K+'sum2']:(p)=>card(200,120,800,220,label('新しい 公式 ではなく',600,190,{size:30,color:C.dim,anchor:'middle'})+label('知っている 2つの 運動に 分ける',600,265,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'deep']:(p)=>card(200,120,800,220,label('なぜ そうなるかは',600,195,{size:30,color:C.ink,anchor:'middle'})+label('深く学ぶ版で',600,275,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi)+fade(seg(p,.5,.7),label('放物運動・深く学ぶ 1/3 〜 3/3',1080,470,{size:26,color:C.dim,anchor:'end'})),
};
