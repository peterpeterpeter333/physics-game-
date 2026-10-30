// 高校編「落体の運動・要点」(ys-hs-m-freefall-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/2・2/2 の部品を借りる（数値例は 2/2 と同じ：v₀＝20 m/s、g＝10 m/s²）。
import {C,mix,seg,fade,label,line,rect,dot,ring,arrow,tex,ground} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {Gt,Yt,ball,ironBall,lightBall,feather,hammer,hand,hsFreefall1Diagrams} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {upColumn,vtAxes2,vAt} from './yt1-hs-m-freefall-2-diagrams.mjs';

const K='hs-m-freefall-summary:';
const T=(src,x,y,o={})=>tex(src,x,y,{size:46,...o});

export const hsFreefallSummaryDiagrams={
 // ================= S1 結論 =================
 [K+'point']:(p)=>{
  const u=seg(p,.15,.7),y=mix(110,440,u*u);
  let s=ground(150,650,470)+ironBall(280,y-14,30)+lightBall(500,y,16);
  s+=fade(seg(p,.05,.15),label('重い球',280,70,{size:26,color:C.ink,anchor:'middle'})+label('軽い球',500,70,{size:26,color:C.ink,anchor:'middle'}));
  s+=card(720,150,420,160,label('質量に よらず',930,210,{size:30,color:C.ink,anchor:'middle'})+label('同じ 加速度',930,270,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.55,.7),C.a);
  return s;
 },
 [K+'g']:(p)=>card(250,110,700,250,label('重力加速度',600,185,{size:34,color:C.a,anchor:'middle',weight:700})+tex(Gt+'\\approx 9.8\\ \\mathrm{m/s^2}',600,285,{size:58,auto:false}),seg(p,.05,.25),C.a)+fade(seg(p,.5,.65),label('向きは 下',600,430,{size:30,color:C.dim,anchor:'middle'})),
 [K+'gmean']:(p)=>hsFreefall1Diagrams['hs-m-freefall-1:gmean'](p),
 [K+'rule']:(p)=>{
  let s=card(150,60,900,120,label('3公式 ＋ a ＝ ±g',600,135,{size:38,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(150,220,420,150,label('下向きを 正',360,270,{size:28,color:C.dim,anchor:'middle'})+T('a=+'+Gt,360,330,{size:48}),seg(p,.25,.4),C.a);
  s+=card(630,220,420,150,label('上向きを 正',840,270,{size:28,color:C.dim,anchor:'middle'})+T('a=-'+Gt,840,330,{size:48}),seg(p,.6,.75),C.a);
  return s;
 },
 // ================= S2 なぜ =================
 [K+'why']:(p)=>{
  let s=card(150,70,900,140,label('なぜ 新しい公式が いらない？',600,155,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.2),C.hi);
  s+=card(250,260,700,130,label('どの物体でも 加速度は 同じ g で 一定',600,335,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'moon']:(p)=>{
  const u=seg(p,.3,.75),y=mix(120,400,u*u);
  let s=`<path d="M 120 470 Q 600 400 1080 470 L 1080 515 L 120 515 Z" fill="#5a6378" fill-opacity=".9"/>`;
  s+=hammer(470,y)+feather(730,y,1);
  s+=fade(seg(p,.02,.15),label('アポロ15号（月面）',600,60,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.78,.9),label('同時に 着地',600,250,{size:40,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),label('実験で 確かめた 事実',1080,140,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'air']:(p)=>{
  let s=ground(250,950,470)+ironBall(450,416,30)+feather(750,220,1.1);
  for(let i=0;i<3;i++)s+=arrow(710+40*i,370,710+40*i,310,{color:C.F,w:3,head:12,g:seg(p,.15,.35)});
  s+=fade(seg(p,.3,.45),label('日常の 差 ＝ 空気抵抗',600,80,{size:34,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'free']:(p)=>{
  let s=hand(150,90,1)+ball(150,140)+arrow(150,175,150,330,{color:C.x,w:4,head:14,g:seg(p,.02,.15)})+fade(seg(p,.05,.2),label('正（下向き）',175,300,{size:24,color:C.x}));
  s+=fade(seg(p,.05,.2),label('v₀ ＝ 0、a ＝ g',650,90,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=card(380,150,540,110,label('第1式',470,215,{size:24,color:C.dim,anchor:'middle'})+T('v='+Gt+'t',700,210,{size:50}),seg(p,.3,.45),C.v);
  s+=card(380,290,540,130,label('第2式',470,365,{size:24,color:C.dim,anchor:'middle'})+T(Yt+'=\\tfrac12'+Gt+'t^2',700,360,{size:50}),seg(p,.6,.75),C.x);
  return s;
 },
 // ================= S3 数値例 =================
 [K+'g10']:(p)=>{
  let s=card(150,90,560,160,label('計算を 見やすく するため',430,150,{size:26,color:C.ink,anchor:'middle'})+tex(Gt+'=10\\ \\mathrm{m/s^2}',430,215,{size:46,auto:false}),seg(p,.02,.2),C.a);
  s+=ground(800,1100,470)+ball(950,440)+arrow(950,410,950,280,{color:C.v,w:6,head:18,g:seg(p,.45,.6)})+fade(seg(p,.5,.65),label('20 m/s',975,330,{size:30,color:C.v,weight:700}));
  return s;
 },
 [K+'vdec']:(p)=>{
  let s=upColumn({va:seg(p,.05,.3),hl:seg(p,.6,.75)>.5?2:-1});
  s+=fade(seg(p,.05,.2),tex('v=20-10t',840,90,{size:46}));
  const vs=[20,10,0,-10,-20];
  vs.forEach((v,i)=>{s+=fade(seg(p,.15+i*.08,.25+i*.08),label(`${i} s：${v<0?'−'+(-v):v} m/s`,840,155+52*i,{size:30,anchor:'middle',color:i===2?C.hi:C.v,weight:700}));});
  s+=fade(seg(p,.65,.8),label('v ＝ 0 → 最高点（2 s）',840,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'height']:(p)=>{
  let s=upColumn({tl:1,yl:1,hl:2});
  s+=fade(seg(p,.05,.2),T(Yt+'=v_0t-\\tfrac12'+Gt+'t^2',840,90,{size:44}));
  s+=fade(seg(p,.25,.4),T('=20\\times 2-\\tfrac12\\times 10\\times 2^2',840,200,{size:40,auto:false}));
  s+=card(660,260,360,110,T('=20\\ \\mathrm{m}',840,320,{size:52,auto:false,color:C.x}),seg(p,.55,.7),C.x);
  return s;
 },
 [K+'third']:(p)=>{
  let s=upColumn({tl:1,yl:1,hl:2});
  s+=fade(seg(p,.05,.2),label('第3式（x を y に）',840,70,{size:26,color:C.dim,anchor:'middle'})+T('v^2-v_0^2=2a'+Yt,840,135,{size:44}));
  s+=fade(seg(p,.25,.4),T('0-400=-20'+Yt,840,240,{size:46,auto:false}));
  s+=card(660,290,360,110,T(Yt+'=20\\ \\mathrm{m}',840,350,{size:50,auto:false}),seg(p,.55,.7),C.x);
  return s;
 },
 [K+'sym']:(p)=>{
  let s=upColumn({va:1,tl:1,yl:1});
  s+=card(600,120,500,110,label('1 s と 3 s：高さ 15 m',850,188,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.2),C.x);
  s+=card(600,270,500,110,label('速度 ＋10 と −10',850,338,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.45,.6),C.v);
  s+=fade(seg(p,.7,.85),label('同じ高さ → 速さ 10 で そろう',850,440,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'back']:(p)=>{
  let s=upColumn({tl:1});
  const X0=560,W=560,y=230,sc=W/4;
  s+=fade(seg(p,.05,.2),line(X0,y,X0+W,y,{color:C.dim,w:3})+[0,1,2,3,4].map(i=>line(X0+sc*i,y-10,X0+sc*i,y+10,{color:C.dim,w:2})+label(`${i}`,X0+sc*i,y+40,{size:24,color:C.t,anchor:'middle'})).join('')+label('t [s]',X0+W+20,y+8,{size:24,color:C.t}));
  s+=fade(seg(p,.3,.45),rect(X0,y-60,sc*2,40,{fill:C.v,fo:.3,stroke:C.v,rx:6})+label('上り 2 s',X0+sc,y-32,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),rect(X0+sc*2,y-60,sc*2,40,{fill:'#7f8fd8',fo:.3,stroke:'#7f8fd8',rx:6})+label('下り 2 s',X0+sc*3,y-32,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('4 s 後に 投げた所へ',X0+W/2,y+120,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'vt']:(p)=>{
  const A=vtAxes2(seg(p,.02,.2));let s=A.svg;
  s+=A.plot(vAt,{from:0,to:4,p:seg(p,.2,.55),color:C.v,w:4,steps:2});
  s+=fade(seg(p,.4,.55),ring(A.X(2),A.Y(0),14,{color:C.hi,w:3}));
  s+=card(720,140,420,170,tex('v=20-10t',930,205,{size:44})+label('傾き ずっと −10',930,275,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.55,.7),C.v);
  return s;
 },
 // ================= S4 よくある間違い =================
 [K+'mis']:(p)=>{
  let s=fade(.35,ground(350,850,470))+line(520,130,680,130,{color:C.dim,w:2,dash:'6 8'})+ball(600,130);
  s+=card(200,220,800,170,label('よくある 間違い',600,275,{size:28,color:C.dim,anchor:'middle'})+label('「最高点では 加速度も 0」',600,345,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.25),C.a);
  s+=fade(seg(p,.6,.75),label('×',1040,330,{size:60,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'only']:(p)=>{
  let s=upColumn({va:1,hl:2});
  const r=[['1 s','10'],['2 s','0'],['3 s','−10']];
  r.forEach(([a,b],i)=>{const g=seg(p,.15+i*.12,.27+i*.12);s+=card(600+175*i,140,150,110,label(a,675+175*i,185,{size:24,color:C.t,anchor:'middle'})+label(b,675+175*i,230,{size:34,color:C.v,anchor:'middle',weight:700}),g,i===1?C.hi:C.faint);
   if(i>0)s+=fade(g,label('−10',588+175*i,290,{size:26,color:C.a,anchor:'middle',weight:700}));});
  s+=card(600,330,500,100,label('0 になるのは 速度だけ',850,392,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.02,.15),C.v);
  return s;
 },
 [K+'ifzero']:(p)=>{
  let s=ground(150,550,470)+line(240,130,460,130,{color:C.faint,w:2,dash:'6 8'})+ball(350,130);
  s+=fade(seg(p,.3,.5),label('止まったまま？',350,90,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(620,130,500,200,label('もし a ＝ 0 なら',870,195,{size:32,color:C.ink,anchor:'middle',weight:700})+label('→ 落ちてこない',870,270,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'always']:(p)=>{
  let s=upColumn({va:1,aa:seg(p,.05,.3)});
  s+=card(600,160,500,170,label('加速度',850,220,{size:28,color:C.ink,anchor:'middle'})+label('ずっと 下向きに g',850,285,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.3,.45),C.a);
  return s;
 },
 // ================= S5 まとめ =================
 [K+'sum']:(p)=>{
  let s=card(150,90,900,140,label('落体：a ＝ ±g の 等加速度運動',600,175,{size:38,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(250,280,700,110,label('上向きを 正 → a ＝ −g',600,348,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(150,90,420,170,label('最高点で 0',360,150,{size:28,color:C.ink,anchor:'middle'})+label('速度 だけ',360,215,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.02,.2),C.v);
  s+=card(630,90,420,170,label('加速度',840,150,{size:28,color:C.ink,anchor:'middle'})+label('変わらない',840,215,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'deep']:(p)=>card(200,120,800,220,label('なぜ そうなるかは',600,200,{size:32,color:C.ink,anchor:'middle'})+label('深く学ぶ版で',600,275,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi)+fade(seg(p,.4,.6),label('落体の運動・深く学ぶ 1/2・2/2',1080,470,{size:26,color:C.dim,anchor:'end'})),
};
