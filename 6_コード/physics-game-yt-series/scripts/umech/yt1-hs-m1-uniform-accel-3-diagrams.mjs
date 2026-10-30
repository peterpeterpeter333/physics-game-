// 高校編「等加速度運動・深く学ぶ 3/3」(ys-hs-m1-uniform-accel-3) — 図。Stage 1200×515.
// 色：変位 水色、速度 v 紫、加速度 a 赤、時刻 t 金、強調・操作 黄。
import {C,seg,fade,label,line,rect,dot,arrow,tex,texWidth,poly,mix} from './anim.mjs';
import {card,thing} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {vtAxes,areaUnder,rcard,threeCards,F1,F2,F3} from './yt1-hs-m1-uniform-accel-1-diagrams.mjs';
import {hsUA2Diagrams as U2,trapPic} from './yt1-hs-m1-uniform-accel-2-diagrams.mjs';
import {symAxes,sv,SV0,ST} from './yt1-hs-m1-uniform-accel-1-diagrams.mjs';

const K='hs-m1-uniform-accel-3:';
const RX=950,Y='#ffe28a';
const u2=k=>U2['hs-m1-uniform-accel-2:'+k];

// road 0..30 m for the bicycle
function road(p,{pos=0,vG=1,aG=1,xG=0,ghost=false,y=300,vtext='v₀ ＝ 10 m/s',atext='a ＝ −2 m/s²',dist=25}={}){
 const X=m=>120+m*30;let s=line(X(0)-20,y,X(30)+30,y,{color:C.dim,w:3})+label('x [m]',X(30)+40,y-20,{size:22,color:C.x,anchor:'middle'});
 for(let m=0;m<=30;m+=5)s+=line(X(m),y-8,X(m),y+8,{color:C.dim,w:2})+label(String(m),X(m),y+36,{size:22,color:C.dim,anchor:'middle'});
 s+=thing(pos,y,X);
 s+=arrow(X(pos),y-90,X(pos)+170,y-90,{color:C.v,w:6,head:18,g:vG})+fade(vG,label(vtext,X(pos)+190,y-82,{size:26,color:C.v,weight:700}));
 s+=arrow(X(pos)+150,y-150,X(pos)+40,y-150,{color:C.a,w:5,head:16,g:aG})+fade(aG,label(atext,X(pos)+170,y-142,{size:26,color:C.a,weight:700}));
 if(xG)s+=arrow(X(0),y+80,X(dist),y+80,{color:C.x,w:6,head:18,g:xG})+fade(xG,label(`変位 ${dist} m`,X(dist/2),y+118,{size:28,color:C.x,anchor:'middle',weight:700})+thing(dist,y,X,C.dim));
 return s;
}
const step=(rows,p,{x=600,y0=110,dy=95,size=50,start=.05,gap=.22,auto=true}={})=>rows.map((r,i)=>fade(seg(p,start+i*gap,start+i*gap+.12),tex(r,x,y0+i*dy,{size,auto}))).join('');

export const hsUA3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:u2('next'),
 [K+'bike']:(p)=>{
  let s=road(p,{vG:seg(p,.1,.25),aG:seg(p,.3,.45)});
  s+=fade(seg(p,.6,.75),label('何 m 先で 止まる？',600,470,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'twostep']:(p)=>{
  let s=card(80,140,440,170,label('① 第1式',300,195,{size:30,color:C.ink,anchor:'middle',weight:700})+label('止まるまでの 時間 t',300,255,{size:28,color:C.t,anchor:'middle'}),seg(p,.05,.2));
  s+=arrow(540,225,650,225,{color:C.dim,w:4,g:seg(p,.3,.4)});
  s+=card(680,140,440,170,label('② 第2式',900,195,{size:30,color:C.ink,anchor:'middle',weight:700})+label('t を 入れて x',900,255,{size:28,color:C.x,anchor:'middle'}),seg(p,.35,.5));
  s+=fade(seg(p,.7,.85),label('2段階 かかる',600,410,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'idea']:(p)=>card(200,120,800,240,label('t を 最初から 含まない 式',600,210,{size:40,color:C.t,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('→ 第3式',600,290,{size:40,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi),
 // ================= S2 台形をもう一度 =================
 [K+'trap']:(p)=>{
  const {s:b}=trapPic(p,{trap:seg(p,.05,.3)});
  return b+rcard(150,label('分けずに',RX,180,{size:30,color:C.ink,anchor:'middle'})+label('台形の 公式で',RX,230,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.4,.55),C.x);
 },
 [K+'formula']:(p)=>{
  const {s:b,A}=trapPic(p,{trap:1});
  const X0=A.X(0),X1=A.X(ST),Y0=A.Y(0);
  let s=b+fade(seg(p,.45,.6),line(X0+4,Y0,X0+4,A.Y(SV0),{color:C.hi,w:6})+line(X1-4,Y0,X1-4,A.Y(sv(ST)),{color:C.hi,w:6})+label('底',X0+22,A.Y(SV0/2),{size:26,color:C.hi,weight:700})+label('底',X1-22,A.Y(2),{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.65,.8),arrow(X0,Y0-36,X1,Y0-36,{color:C.t,w:3,head:12})+label('高さ t',(X0+X1)/2,Y0-48,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=rcard(150,label('(上底 ＋ 下底)',RX,180,{size:30,color:C.ink,anchor:'middle'})+label('× 高さ ÷ 2',RX,230,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.2));
  return s;
 },
 [K+'x']:(p)=>{
  const {s:b}=trapPic(p,{trap:1});
  return b+rcard(200,tex('x=\\dfrac{(v+v_0)\\,t}{2}',RX,215,{size:50}),seg(p,.05,.2),C.hi)+fade(seg(p,.5,.65),label('端の 速度の 平均 × 時間',RX,350,{size:26,color:C.ink,anchor:'middle'}));
 },
 [K+'avg']:(p)=>{
  const {s:b,A}=trapPic(p,{trap:.5});
  const m=(SV0+sv(ST))/2,X0=A.X(0),X1=A.X(ST);
  let s=b+fade(seg(p,.35,.5),line(X0,A.Y(m),X1,A.Y(m),{color:C.hi,w:4,dash:'10 7'})+label('真ん中',X1+16,A.Y(m)+8,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.55,.7),poly([[X0,A.Y(SV0)],[X0,A.Y(m)],[(X0+X1)/2,A.Y(m)]],{fill:C.hi,fo:.25,stroke:C.hi,sw:1.5})+poly([[(X0+X1)/2,A.Y(m)],[X1,A.Y(sv(ST))],[X1,A.Y(m)]],{fill:C.a,fo:.25,stroke:C.a,sw:1.5}));
  s+=rcard(170,label('速度は 一定の 割合で 変わる',RX,180,{size:26,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.65),label('平均 ＝ (v ＋ v₀) ÷ 2',RX,235,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.7,.85),label('はみ出し ＝ 足りない ぶん',RX,340,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'double']:(p)=>{
  let s=tex('x=\\dfrac{(v+v_0)\\,t}{2}',600,120,{size:52});
  s+=fade(seg(p,.1,.25),label('両辺を 2倍',900,130,{size:26,color:C.hi}));
  s+=card(330,250,540,120,tex('2x=(v+v_0)\\,t',600,315,{size:56}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ================= S3 t を消す =================
 [K+'still']:(p)=>{
  let s=tex('2x=(v+v_0)\\,t',600,170,{size:64});
  const W=texWidth('2x=(v+v_0)\\,t',64);s+=fade(seg(p,.1,.25),`<circle cx="${600+W/2-10}" cy="${160}" r="36" fill="none" stroke="${Y}" stroke-width="3"/>`);
  s+=fade(seg(p,.2,.35),label('まだ t が 残っている',600,290,{size:32,color:C.t,anchor:'middle',weight:700}));
  s+=card(300,340,600,100,label('使うのは 第1式',600,402,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'at']:(p)=>{
  let s=tex(F1,600,90,{size:46});
  s+=fade(seg(p,.1,.25),tex('at=v-v_0',600,200,{size:60})+label('移項',870,210,{size:26,color:C.hi}));
  s+=card(250,290,700,150,label('t は a と 組で',600,345,{size:30,color:C.ink,anchor:'middle'})+tex('{\\color{#ffe28a}at}\\ \\to\\ v-v_0',600,405,{size:46}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'mula']:(p)=>{
  let s=tex('2x=(v+v_0)\\,t',600,90,{size:48});
  s+=fade(seg(p,.1,.25),tex('{\\color{#ffe28a}a}\\times 2x=(v+v_0)\\,t\\times{\\color{#ffe28a}a}',600,210,{size:48})+label('両辺に a',960,220,{size:26,color:C.hi}));
  s+=card(330,300,540,120,tex('2ax=(v+v_0)\\,at',600,365,{size:52}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'subst']:(p)=>{
  let s=tex('2ax=(v+v_0)\\,{\\color{#ffe28a}at}',600,100,{size:50});
  s+=fade(seg(p,.1,.25),arrow(760,130,700,195,{color:Y,w:3,head:12})+label('at ＝ v − v₀',800,170,{size:26,color:C.hi}));
  s+=card(250,230,700,120,tex('2ax=(v+v_0)({\\color{#ffe28a}v-v_0})',600,295,{size:52}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.6,.75),label('t が 消えた',600,420,{size:34,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 ...Object.fromEntries([['exp1',0],['exp2',1],['cancel',2]].map(([k,st])=>[K+k,(p)=>{
  let s=tex('(v+v_0)(v-v_0)',600,80,{size:50});
  const a=st?1:seg(p,.3,.45),b=st===1?seg(p,.3,.45):st>1?1:0,c=st===2?seg(p,.05,.3):0;
  s+=fade(st?1:seg(p,.05,.2),label(st?'':'v を 掛ける',300,180,{size:26,color:C.v,anchor:'middle'}));
  s+=fade(a,tex('v^2',300,250,{size:52})+tex('-vv_0',470,250,{size:52}));
  s+=fade(b,tex('+vv_0',700,250,{size:52})+tex('-v_0^2',880,250,{size:52}));
  if(st===1)s+=fade(seg(p,.05,.2),label('v₀ を 掛ける',790,180,{size:26,color:C.v,anchor:'middle'}));
  if(st===2){s+=fade(c,line(415,265,530,232,{color:C.a,w:4})+line(645,265,760,232,{color:C.a,w:4}));
   s+=fade(seg(p,.25,.4),label('打ち消し合う',585,320,{size:28,color:C.a,anchor:'middle',weight:700}));
   s+=card(380,360,440,110,tex('v^2-v_0^2',600,420,{size:56}),seg(p,.5,.65),C.hi);}
  return s;
 }])),
 [K+'result']:(p)=>{
  let s=tex('2ax=v^2-v_0^2',600,110,{size:50});
  s+=card(330,200,540,140,tex(F3,600,275,{size:62}),seg(p,.2,.35),C.hi);
  s+=fade(seg(p,.5,.65),label('第3式',600,400,{size:38,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'azero']:(p)=>{
  let s=card(200,90,800,120,label('a で 割って いない',600,165,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(200,250,800,180,label('a ＝ 0 のとき v ＝ v₀',600,315,{size:32,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.6,.75),tex('0=0',600,385,{size:52,auto:false})),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'notlaw']:(p)=>card(150,110,900,260,label('第1式 ＋ 台形の面積',600,190,{size:36,color:C.ink,anchor:'middle',weight:700})+tex(F3,600,265,{size:52})+fade(seg(p,.45,.6),label('導いた 結果（新しい 法則 ではない）',600,335,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.03,.18),C.hi),
 // ================= S4 何メートル先で止まる？ =================
 [K+'bike2']:(p)=>{
  let s=road(p,{y:330});
  s+=card(150,30,900,90,label('v₀ ＝ 10 m/s',320,88,{size:30,color:C.v,anchor:'middle',weight:700})+fade(seg(p,.3,.45),label('a ＝ −2 m/s²',600,88,{size:30,color:C.a,anchor:'middle',weight:700}))+fade(seg(p,.6,.75),label('止まる：v ＝ 0',880,88,{size:30,color:C.v,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'plug']:(p)=>{
  let s=tex(F3,600,80,{size:44});
  s+=fade(seg(p,.05,.25),tex('0^2-10^2=2\\times(-2)\\times x',600,200,{size:52}));
  s+=fade(seg(p,.55,.7),tex('-100=-4x',600,320,{size:56}));
  return s;
 },
 [K+'solve']:(p)=>{
  let s=tex('-100=-4x',600,80,{size:50});
  s+=fade(seg(p,.05,.2),label('両辺を −4 で 割る',600,150,{size:26,color:C.hi,anchor:'middle'}));
  s+=card(400,180,400,110,tex('x=25',600,240,{size:58}),seg(p,.2,.35),C.x);
  s+=fade(seg(p,.5,.65),label('25 m 先で 止まる',600,370,{size:36,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sign']:(p)=>road(p,{y:250,xG:seg(p,.05,.3)})+fade(seg(p,.5,.65),label('右へ 進みながら 遅くなる',600,470,{size:30,color:C.ink,anchor:'middle',weight:700})),
 [K+'check']:(p)=>{
  let s=tex(F1,600,80,{size:44});
  s+=fade(seg(p,.1,.25),tex('0=10-2t',600,200,{size:56}));
  s+=card(400,270,400,110,tex('t=5\\,\\mathrm{s}',600,330,{size:56}),seg(p,.5,.65),C.t);
  return s;
 },
 [K+'check2']:(p)=>{
  let s=tex(F2,600,80,{size:44});
  s+=fade(seg(p,.05,.2),tex('10\\times5+\\tfrac12\\times(-2)\\times5^2',600,190,{size:50,auto:false}));
  s+=fade(seg(p,.4,.55),tex('=50-25=25\\,\\mathrm{m}',600,290,{size:52,auto:false}));
  s+=fade(seg(p,.7,.85),label('同じ 答え',600,400,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'graph']:(p)=>{
  const A=vtAxes(1,{xmax:5.6,ymax:11.4,xticks:[1,2,3,4,5],yticks:[2,4,6,8,10]});
  const f=t=>10-2*t;let s=A.svg+areaUnder(A,f,0,5,{color:C.x,fo:.3,g:seg(p,.3,.5)})+A.plot(f,{from:0,to:5,p:seg(p,.05,.3),color:C.v,w:5,steps:2});
  s+=fade(seg(p,.5,.65),label('底辺 5 s',A.X(1.5),A.Y(0)-16,{size:24,color:C.t,anchor:'middle',weight:700})+label('高さ 10 m/s',A.X(0)+16,A.Y(10)-12,{size:24,color:C.v,weight:700}));
  s+=rcard(110,label('5 × 10 ÷ 2 ＝ 25',RX,180,{size:34,color:C.x,anchor:'middle',weight:700}),seg(p,.6,.75),C.x);
  return s;
 },
 // ================= S5 使い分け =================
 [K+'three']:(p)=>threeCards(p,{g:[seg(p,.05,.15),seg(p,.15,.25),seg(p,.25,.35)],y:130}),
 [K+'missing']:(p)=>threeCards(p,{y:130,g:[1,1,1]})
  +fade(seg(p,.05,.2),label('x が ない',230,345,{size:30,color:C.x,anchor:'middle',weight:700}))
  +fade(seg(p,.35,.5),label('v が ない',600,345,{size:30,color:C.v,anchor:'middle',weight:700}))
  +fade(seg(p,.65,.8),label('t が ない',970,345,{size:30,color:C.t,anchor:'middle',weight:700})),
 [K+'choose']:(p)=>threeCards(p,{y:60,g:[1,1,1]})+card(150,300,900,150,label('出てこない 文字（与えられず、聞かれてもいない）',600,360,{size:28,color:C.ink,anchor:'middle'})+label('→ その文字が ない 式を 使う',600,415,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi),
 [K+'car']:(p)=>{
  const items=[['v₀ ＝ 20 m/s',C.v],['a ＝ −5 m/s²',C.a],['v ＝ 0（止まる）',C.v],['x ＝ ？',C.hi],['t：出てこない',C.dim]];
  let s='';items.forEach(([t,c],i)=>{s+=card(110+(i%3)*340,90+Math.floor(i/3)*150,320,110,label(t,270+(i%3)*340,155+Math.floor(i/3)*150,{size:30,color:c,anchor:'middle',weight:700}),seg(p,.05+i*.12,.15+i*.12),i===3?C.hi:C.faint);});
  return s;
 },
 [K+'car2']:(p)=>{
  let s=label('t が 出てこない → 第3式',600,70,{size:30,color:C.t,anchor:'middle',weight:700});
  s+=fade(seg(p,.25,.4),tex('0-400=2\\times(-5)\\times x',600,190,{size:52}));
  s+=fade(seg(p,.5,.6),tex('-400=-10x',600,290,{size:52}));
  s+=card(400,350,400,110,tex('x=40\\,\\mathrm{m}',600,410,{size:56}),seg(p,.7,.82),C.x);
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(150,60,900,170,label('a ＝ ＋5 の まま 入れると',600,115,{size:30,color:C.a,anchor:'middle'})+tex('0-400=10x',600,180,{size:48}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.35,.5),tex('x=-40\\,\\mathrm{m}',600,300,{size:56}));
  s+=fade(seg(p,.55,.7),label('後ろへ 進んだ？ → おかしい',600,410,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wrong2']:(p)=>{
  const X=m=>200+m*16;const y=300;let s=line(X(0)-20,y,X(50)+20,y,{color:C.dim,w:3})+label('正の向き →',X(50),y+40,{size:24,color:C.x,anchor:'end'});
  s+=thing(0,y,X)+arrow(X(0),y-80,X(0)+220,y-80,{color:C.v,w:6,head:18,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('進む向き',X(0)+110,y-100,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=arrow(X(0)+400,y-80,X(0)+260,y-80,{color:C.a,w:6,head:18,g:seg(p,.25,.4)})+fade(seg(p,.25,.4),label('減速の a',X(0)+330,y-100,{size:26,color:C.a,anchor:'middle',weight:700}));
  s+=card(250,370,700,100,label('右向き正 → a ＝ −5 m/s²',600,432,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'rest']:(p)=>{
  const items=[['v₀ ＝ 0（静止）',C.v],['a ＝ 4 m/s²',C.a],['x ＝ 50 m',C.x],['v ＝ ？',C.hi],['t：出てこない',C.dim]];
  let s='';items.forEach(([t,c],i)=>{s+=card(110+(i%3)*340,90+Math.floor(i/3)*150,320,110,label(t,270+(i%3)*340,155+Math.floor(i/3)*150,{size:30,color:c,anchor:'middle',weight:700}),seg(p,.05+i*.08,.12+i*.08),i===3?C.hi:C.faint);});
  s+=fade(seg(p,.7,.85),label('→ 第3式',940,395,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rest2']:(p)=>{
  let s=tex(F3,600,70,{size:42});
  s+=fade(seg(p,.05,.2),tex('v^2-0=2\\times4\\times50=400',600,190,{size:52}));
  s+=card(380,280,440,110,tex('v=20\\,\\mathrm{m/s}',600,340,{size:56}),seg(p,.55,.7),C.v);
  s+=fade(seg(p,.55,.7),label('v は 正',600,440,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S6 まとめと次の問い =================
 [K+'sum']:(p)=>threeCards(p,{y:110,g:[seg(p,.05,.2),seg(p,.15,.3),seg(p,.25,.4)]})+card(250,370,700,90,label('加速度の 定義 ＋ v-t グラフの 面積',600,427,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi),
 [K+'sum2']:(p)=>threeCards(p,{y:110,g:[1,1,1]})
  +fade(seg(p,.05,.2),label('定義の 並べ替え',230,355,{size:28,color:C.hi,anchor:'middle',weight:700}))
  +fade(seg(p,.35,.5),label('台形の 面積',600,355,{size:28,color:C.hi,anchor:'middle',weight:700}))
  +fade(seg(p,.6,.75),label('t を 消す',970,355,{size:28,color:C.hi,anchor:'middle',weight:700})),
 [K+'univ']:(p)=>card(200,120,800,230,label('大学編では',600,190,{size:30,color:C.dim,anchor:'middle'})+label('v-t グラフの 面積 → 積分',600,270,{size:42,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.2),C.x),
 [K+'ball']:(p)=>{
  let s=line(150,40,350,40,{color:C.dim,w:3});
  const n=Math.floor(6*seg(p,.1,.6)+1e-6);
  for(let i=0;i<=n;i++){const y=60+9*i*i+6*i;s+=dot(250,y,14,C.hi,i===n?1:.35);}
  s+=card(480,150,640,200,label('手を離した ボール',800,220,{size:30,color:C.ink,anchor:'middle'})+label('加速度 a は？',800,295,{size:44,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'heavy']:(p)=>{
  let s=line(150,60,700,60,{color:C.dim,w:3});
  s+=dot(300,mix(110,420,0),30,C.dim)+label('重い',300,mix(110,420,0)+8,{size:22,color:C.bg,anchor:'middle',weight:700});
  s+=dot(550,mix(110,420,0),14,C.hi)+label('軽い',590,mix(110,420,0)+8,{size:22,color:C.hi});
  s+=card(760,170,400,170,label('落ち方は',960,235,{size:32,color:C.ink,anchor:'middle'})+label('違う？',960,300,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(200,110,800,230,label('次の単元',600,175,{size:28,color:C.dim,anchor:'middle'})+label('落体の運動',600,260,{size:56,color:C.a,anchor:'middle',weight:700})+label('落ちる 加速度を 調べる',600,315,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
};
