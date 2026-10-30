// 高校編「力と運動方程式・要点」(ys-hs-m-force-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/3〜3/3 の部品と数値例（2 kg・右 5 N・左 3 N、5.0 kg → 49 N）をそのまま使う。
import {C,seg,fade,label,line,tex,ground} from './anim.mjs';
import {card,ball,FA,VA,box,table,T2,MG,Gt,Fc,stone,ice,cartF} from './yt1-hs-m-force-1-diagrams.mjs';
import {tug} from './yt1-hs-m-force-2-diagrams.mjs';

const K='hs-m-force-summary:';
const EXP=[['1 kg','2 N','2 m/s²'],['1 kg','4 N','4 m/s²'],['2 kg','4 N','2 m/s²']];
const expCols=[{h:'質量 m',color:C.ink,w:170},{h:'力 F',color:C.F,w:170},{h:'加速度 a',color:C.a,w:200}];

export const hsForceSummaryDiagrams={
 [K+'point']:(p)=>{
  let s=card(150,70,900,130,label('加速度 は 合力に 比例・質量に 反比例',600,148,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(400,245,400,175,T2('a=\\dfrac{F}{m}',600,345,{size:58}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'eq']:(p)=>{
  let s=card(380,60,440,140,T2('ma=F',600,135,{size:68}),1,C.F);
  s+=fade(seg(p,.3,.45),label('m：質量',300,300,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('a：加速度',600,300,{size:32,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('F：合力',900,300,{size:32,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=label('定義',600,60,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=ground(200,800,330)+cartF(380,330,{text:'1 kg',size:26})+FA(460,270,580,270,{text:'1 N',size:28,dy:-20,g:seg(p,.05,.25)});
  s+=card(760,150,380,150,label('加速度',950,205,{size:26,color:C.ink,anchor:'middle'})+label('1 m/s²',950,262,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'inertia']:(p)=>{
  const x=200+700*seg(p,.05,.95);
  let s=ice(60,1140,400)+stone(x,400)+VA(x+50,330,x+170,330)+label('v',x+110,315,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=card(250,80,700,110,label('力を 受けなければ 速度は 変わらない',600,148,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'inertia2']:(p)=>{
  let s=card(60,60,520,360,label('止まっている 物体',320,115,{size:30,color:C.ink,anchor:'middle',weight:700})+ground(110,530,330)+box(320,330,{w:110,h:80})+label('v ＝ 0 のまま',320,385,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,.02,.15));
  const x=700+300*seg(p,.35,.95);
  s+=card(620,60,520,360,label('動いている 物体',880,115,{size:30,color:C.ink,anchor:'middle',weight:700})+ground(660,1100,330)+box(Math.min(x,1040),330,{w:90,h:70})+VA(Math.min(x,1040)-20,230,Math.min(x,1040)+80,230)+label('同じ 速度の まま',880,385,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,.3,.45));
  s+=fade(seg(p,.75,.9),label('慣性の法則',600,470,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'exp']:(p)=>{
  let s=table({x:150,y:90,cols:expCols,rows:EXP,reveal:[seg(p,.02,.15),seg(p,.15,.3),seg(p,.5,.65)],hl:seg(p,.5,.65)>.5?[1,2]:seg(p,.15,.3)>.5?[0,1]:[]});
  s+=fade(seg(p,.2,.35),label('力 2倍 → a 2倍',920,170,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('質量 2倍 → a 半分',920,270,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(400,60,400,120,T2('ma=F',600,128,{size:58}),1,C.F);
  s+=card(250,230,700,160,label('実験を まとめた 法則',600,295,{size:38,color:C.hi,anchor:'middle',weight:700})+label('代数で 証明した 式 ではない',600,355,{size:28,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'tug']:(p)=>tug(5,3,{gr:seg(p,.3,.5),gl:seg(p,.45,.65)}),
 [K+'sum']:(p)=>{
  let s=fade(.45,tug(5,3,{y:470,labels:0}));
  s+=fade(seg(p,.05,.25),T2('F=5+(-3)=2\\ \\mathrm{N}',600,110,{size:50}));
  s+=card(400,190,400,100,label('5 ＋ 3 ＝ 8 N ではない',600,252,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.55,.7),C.a);
  return s;
 },
 [K+'calc']:(p)=>{
  let s=T2('a=\\dfrac{F}{m}',350,140,{size:52});
  s+=fade(seg(p,.1,.3),T2('=\\dfrac{2}{2}',350,290,{size:52,auto:false}));
  s+=card(620,150,480,140,tex('a=1\\ \\mathrm{m/s^2}',860,210,{size:48,auto:false,color:C.a})+label('右向き',860,265,{size:26,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'bal']:(p)=>{
  let s=tug(5,5,{y:420});
  s+=card(300,70,600,120,label('合力 0 → a ＝ 0 → 速度 そのまま',600,140,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'mg']:(p)=>{
  let s=ball(220,170,{r:24})+FA(220,198,220,330)+label('重力 mg',245,300,{size:28,color:C.F,weight:700});
  s+=card(480,80,600,130,T2(MG+'=5.0\\times 9.8',780,148,{size:50,auto:false}),seg(p,.3,.45));
  s+=card(580,260,400,110,T2('=49\\ \\mathrm{N}',780,318,{size:54,auto:false,color:Fc}),seg(p,.6,.75),C.F);
  return s;
 },
 [K+'fall']:(p)=>{
  let s=T2('ma='+MG,600,110,{size:58});
  s+=fade(seg(p,.25,.4),label('両辺を m で 割る',920,120,{size:26,color:C.hi}));
  s+=card(400,210,400,130,T2('a='+Gt,600,275,{size:62,auto:false}),seg(p,.4,.55),C.a);
  s+=fade(seg(p,.65,.8),label('質量に よらない',600,420,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis']:(p)=>{
  let s=ground(150,1050,420)+box(600,420,{text:'箱'});
  s+=card(250,90,700,150,label('よくある 間違い',600,145,{size:28,color:C.dim,anchor:'middle'})+label('動き続けるには 力が 要る？',600,205,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'fric']:(p)=>{
  // first half: no force, constant velocity; second half: friction acts and the box stops
  const u1=Math.min(p,.5)/.5,u2=seg(p,.5,.95),x=200+300*u1+250*(1-(1-u2)*(1-u2));
  let s=card(250,60,700,110,label('力 0 → 同じ 速度で 動き続ける',600,128,{size:34,color:C.v,anchor:'middle',weight:700}),seg(p,.02,.15),C.v);
  s+=ground(150,1050,420)+box(x,420,{text:'箱'});
  if(u2<.98)s+=VA(x+70,320,x+70+120*(1-u2),320);
  if(p>.5&&u2<.98)s+=FA(x-62,408,x-162,408,{w:8,head:20,g:seg(p,.5,.58)})+label('摩擦の 力',x-110,460,{size:26,color:C.F,anchor:'middle',weight:700});
  return s;
 },
 [K+'curl']:(p)=>{
  const x=180+800*seg(p,.05,.95);
  let s=ice(60,1140,400)+stone(x,400)+VA(x+50,330,x+170,330)+label('v',x+110,315,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.55),label('摩擦が とても 小さい → ほぼ 同じ 速さ',600,140,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'role']:(p)=>card(200,150,800,180,label('力の 役割',600,215,{size:30,color:C.ink,anchor:'middle'})+label('速度を 変えること',600,285,{size:46,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F),
 [K+'end']:(p)=>{
  let s=card(150,60,900,120,label('力 ＝ 速度を 変える 原因',600,135,{size:38,color:C.F,anchor:'middle',weight:700}),seg(p,.02,.15),C.F);
  s+=card(400,230,400,150,T2('ma=F',600,300,{size:62})+label('F ＝ 合力',600,355,{size:26,color:C.F,anchor:'middle'}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,200,label('なぜ そう なるかは',600,205,{size:32,color:C.ink,anchor:'middle'})+label('深く学ぶ版 で',600,275,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
