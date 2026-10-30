// 高校編「力と運動方程式・深く学ぶ 1/3」(ys-hs-m-force-1) — 図。Stage 1200×515.
// 色：力 F 緑（太い矢印）、速度 v 紫、加速度 a 赤、時間 t 金、質量 m 白、強調 黄。
// 2/3・3/3・要点でも使う部品は export する。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,ground,block,cart,wall,spring} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
export {card,ball};

const K='hs-m-force-1:';
export const Fc='#83ecc0';
export const MG=`{\\color{${Fc}}mg}`, NN=`{\\color{${Fc}}N}`, Gt='{\\color{#ff8f9b}g}';
// ---- force arrow: green, thick ------------------------------------------------------------------
export function FA(x,y,X,Y,{text='',g=1,size=28,dx=0,dy=-16,anchor='middle',color=C.F,w=9,head=24}={}){
 let s=arrow(x,y,X,Y,{color,w,head,g});
 if(text&&g>.05)s+=fade(Math.min(1,g*1.4),label(text,(x+X)/2+dx,(y+Y)/2+dy,{size,color,anchor,weight:700}));
 return s;
}
export const VA=(x,y,X,Y,o={})=>arrow(x,y,X,Y,{color:C.v,w:5,head:16,...o});
// ---- objects ------------------------------------------------------------------------------------
export const box=(x,gy,{w=120,h=90,color='#c9a46a',text='',size=26,fo=.55}={})=>block(x,gy,w,h,{color,text,size,fo});
export const cartF=(x,gy,o={})=>cart(x,gy,{w:150,h:62,color:C.x,...o});
export function handR(x,y,{o=1}={}){ // a fist pushing to the right, knuckles at (x,y)
 return fade(o,rect(x-120,y-14,80,28,{fill:'#e9c7a6',fo:.9,stroke:'none',rx:10})+rect(x-48,y-26,48,52,{fill:'#e9c7a6',fo:1,stroke:'none',rx:14}));
}
export function stone(x,y,{o=1}={}){
 return fade(o,`<ellipse cx="${x}" cy="${y-14}" rx="44" ry="18" fill="#8c97ad"/>`+`<ellipse cx="${x}" cy="${y-24}" rx="40" ry="14" fill="#b6bfd0"/>`+rect(x-6,y-52,12,26,{fill:C.a,fo:1,stroke:'none',rx:3})+rect(x-6,y-52,34,10,{fill:C.a,fo:1,stroke:'none',rx:3}));
}
export const ice=(x1,x2,y)=>rect(x1,y,x2-x1,14,{fill:'#bfe9ff',fo:.35,stroke:'#bfe9ff',sw:1.5,rx:3});
export const T2=(src,x,y,o={})=>tex(src,x,y,{size:46,...o});
// a table inside a card: cols=[{h,color,w}], rows=[[...]] ; reveal = per-row opacity
export function table({x,y,cols,rows,reveal=null,hl=[],rh=56,g=1,size=30}={}){
 const W=cols.reduce((a,c)=>a+c.w,0);
 let s=card(x-12,y-10,W+24,rh*(rows.length+1)+16,'',g);
 let cx=x;cols.forEach(c=>{s+=fade(g,label(c.h,cx+c.w/2,y+rh*.62,{size:24,color:c.color,anchor:'middle',weight:700}));cx+=c.w;});
 s+=fade(g,line(x,y+rh,x+W,y+rh,{color:C.faint,w:2}));
 rows.forEach((r,i)=>{const yy=y+rh*(i+1),o=g*(reveal?reveal[i]:1);
  if(hl.includes(i))s+=fade(o,rect(x,yy+4,W,rh-8,{fill:C.hi,fo:.12,stroke:C.hi,sw:1.5,rx:8}));
  let cx=x;r.forEach((v,j)=>{s+=fade(o,label(v,cx+cols[j].w/2,yy+rh*.64,{size,color:cols[j].color,anchor:'middle',weight:700}));cx+=cols[j].w;});});
 return s;
}
// ---- projectile reminder (05) --------------------------------------------------------------------
function projMini({g=1,vx=1,F0=0}={}){
 const X=t=>130+t*150,Y=t=>110+5*t*t*7;
 let s=fade(g,ground(90,640,470)+rect(60,110,70,360,{fill:'#4a5570',fo:.8,stroke:'none',rx:4}));
 const pts=[];for(let i=0;i<=30;i++){const t=i/10;pts.push([X(t),Y(t)]);}
 s+=fade(g,draw(pts,1,{color:C.hi,w:2,dash:'6 8'}));
 for(let t=0;t<=3;t++){s+=fade(g,ball(X(t),Y(t),{r:13}))+VA(X(t)+16,Y(t),X(t)+86,Y(t),{g:vx*g});}
 s+=fade(vx*g,label('横の速度は 同じ長さ',380,90,{size:26,color:C.v,weight:700}));
 if(F0)s+=fade(F0,label('横には 力 なし',380,135,{size:26,color:C.F,weight:700}));
 return s;
}
// ---- experiment table rows (cart pulled with constant force) ----------------------------------
const EXP=[['1 kg','2 N','2 m/s²'],['1 kg','4 N','4 m/s²'],['2 kg','4 N','2 m/s²']];
const expCols=[{h:'質量 m',color:C.ink,w:150},{h:'力 F',color:C.F,w:150},{h:'加速度 a',color:C.a,w:180}];
function pullScene(m,F,{g=1,p=1,y=300}={}){ // cart pulled to the right by a spring scale
 const x=250+90*p*p;
 let s=fade(g,ground(60,560,y+10));
 s+=fade(g,cartF(x,y+8,{text:m,size:26,w:150}));
 if(F)s+=fade(g,FA(x+80,y-40,x+80+parseFloat(F)*32,y-40,{text:F,size:26,dy:-18}));
 return s;
}

export const hsForce1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>projMini({vx:seg(p,.1,.35),F0:seg(p,.45,.6)}),
 [K+'q2']:(p)=>{
  let s=fade(.35,projMini());
  s+=card(650,150,500,200,label('力が はたらくと',900,220,{size:30,color:C.F,anchor:'middle',weight:700})+label('速度は どう 変わる？',900,290,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'box']:(p)=>{
  const u=seg(p,.05,.45),st=seg(p,.55,.85),x=300+250*u+90*st;
  let s=ground(80,1120,420)+box(x,420,{text:'箱'});
  s+=handR(x-60-(st>0?40*st:0),375,{o:1-st});
  if(u>.05&&st<.95)s+=FA(x-60,330,x+10,330,{text:'押す',size:24,g:1-st,dy:-20});
  s+=fade(st,label('押すのを やめると 止まる',x,250,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'guess']:(p)=>{
  let s=fade(.35,ground(80,1120,420)+box(1000,420,{text:'箱'}));
  s+=card(250,120,700,190,label('動き続けるには',600,190,{size:30,color:C.ink,anchor:'middle'})+label('力が 要る？',600,260,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.65,.8),label('本当？',600,380,{size:34,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'curl']:(p)=>{
  const x=180+800*seg(p,.1,.95,);
  let s=ice(60,1140,400)+stone(x,400);
  s+=VA(x+50,330,x+150,330,{g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('v',x+100,315,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('手を 離したあとも ほとんど 同じ 速さ',600,120,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },
 // ================= S2 物体を1つ選ぶ =================
 [K+'pick']:(p)=>{
  let s=ground(80,1120,400)+cartF(600,400)+handR(515,350);
  s+=fade(seg(p,.4,.6),label('選ぶ物体：台車',600,170,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'circle']:(p)=>{
  let s=ground(80,1120,400)+cartF(600,400)+handR(515,350);
  s+=fade(seg(p,.05,.25),`<rect x="505" y="300" width="190" height="115" rx="24" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="10 9"/>`);
  s+=fade(seg(p,.4,.6),card(760,120,400,130,label('描くのは',960,170,{size:26,color:C.dim,anchor:'middle'})+label('台車が 受ける 力 だけ',960,220,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'hand']:(p)=>{
  let s=ground(80,1120,400)+cartF(600,400)+handR(515,350);
  s+=`<rect x="505" y="300" width="190" height="115" rx="24" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="10 9"/>`;
  s+=FA(530,270,650,270,{g:seg(p,.3,.5)});
  s+=fade(seg(p,.35,.5),label('手が 台車を 押す 力',590,235,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),card(780,140,360,120,label('力 ＝ 緑の',960,190,{size:26,color:C.ink,anchor:'middle'})+label('太い 矢印',960,232,{size:28,color:C.F,anchor:'middle',weight:700}),1,C.F));
  return s;
 },
 [K+'notdraw']:(p)=>{
  let s=ground(80,1120,400)+cartF(600,400)+handR(515,350);
  s+=`<rect x="505" y="300" width="190" height="115" rx="24" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="10 9"/>`;
  s+=FA(530,270,650,270);
  s+=label('手が 台車を 押す 力',590,235,{size:26,color:C.F,anchor:'middle',weight:700});
  const g=seg(p,.15,.35);
  s+=fade(g*.55,arrow(495,290,365,290,{color:C.F,w:9,head:24}));
  s+=fade(g,label('台車が 手を 押す 力',330,250,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),line(380,265,480,315,{color:C.a,w:5})+line(380,315,480,265,{color:C.a,w:5})+label('手が 受ける 力 → この図には 描かない',330,470,{size:26,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  let s=fade(.35,ground(80,1120,440)+cartF(600,440)+FA(530,350,650,350));
  s+=card(200,60,800,210,label('主語を そろえる：',600,125,{size:30,color:C.ink,anchor:'middle'})+label('「台車が 受ける」力 だけ',600,185,{size:38,color:C.hi,anchor:'middle',weight:700})+label('→ 同じ力を 二重に 数えない',600,240,{size:28,color:C.dim,anchor:'middle'}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'unit']:(p)=>{
  let s='';
  s+=card(300,90,600,200,label('力の 大きさの 単位',600,150,{size:30,color:C.ink,anchor:'middle'})+label('ニュートン N',600,225,{size:46,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.25),C.F);
  s+=fade(seg(p,.6,.75),label('1 N の 大きさは あとで 決める',600,330,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S3 慣性の法則 =================
 [K+'stone']:(p)=>{
  let s=ice(60,1140,400)+stone(500,400);
  s+=VA(550,330,700,330)+label('v',625,315,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=FA(450,370,450-22*seg(p,.3,.5),370,{w:6,head:14});
  s+=fade(seg(p,.35,.5),label('摩擦の 力：とても 小さい',300,450,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('氷：とても 滑らか',900,450,{size:26,color:'#bfe9ff',anchor:'middle'}));
  return s;
 },
 [K+'nearly']:(p)=>{
  let s=ice(60,1140,400);
  [0,1,2,3].forEach(i=>{const x=180+i*260,g=seg(p,.05+i*.15,.2+i*.15);s+=fade(g,stone(x,400,{o:i<3?.45:1})+VA(x+50,330,x+180,330)+label(`${i} s`,x,460,{size:24,color:C.t,anchor:'middle'}));});
  s+=fade(seg(p,.7,.85),label('速度の 矢印は ほぼ 同じ 長さ',600,120,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'law']:(p)=>card(150,80,900,250,label('慣性の法則',600,145,{size:34,color:C.hi,anchor:'middle',weight:700})+label('力を 受けなければ',600,210,{size:32,color:C.F,anchor:'middle',weight:700})+label('物体は 速度を 変えない',600,270,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi)+fade(seg(p,.6,.75),label('（摩擦も なく、力が 0 のとき）',600,380,{size:28,color:C.dim,anchor:'middle'})),
 [K+'law2']:(p)=>{
  let s=card(60,60,520,360,label('止まっている 物体',320,115,{size:30,color:C.ink,anchor:'middle',weight:700})+ground(110,530,330)+box(320,330,{w:110,h:80})+label('v ＝ 0 のまま',320,385,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2));
  const x=700+300*seg(p,.45,.95);
  s+=card(620,60,520,360,label('動いている 物体',880,115,{size:30,color:C.ink,anchor:'middle',weight:700})+ground(660,1100,330)+box(Math.min(x,1040),330,{w:90,h:70})+VA(Math.min(x,1040)-20,230,Math.min(x,1040)+80,230)+label('同じ 速度で まっすぐ',880,385,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,.4,.55));
  return s;
 },
 [K+'lawkind']:(p)=>{
  let s=card(200,90,800,140,label('法則',600,145,{size:30,color:C.hi,anchor:'middle',weight:700})+label('実験に 支えられた 原理',600,200,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(200,270,800,110,label('式から 証明したもの では ない',600,338,{size:32,color:C.dim,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'frame']:(p)=>{
  let s=ground(80,1120,380);
  for(let i=0;i<=10;i++)s+=fade(seg(p,.05+i*.03,.15+i*.03),line(120+i*96,384,120+i*96,402,{color:C.x,w:3})+label(`${i}`,120+i*96,432,{size:22,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.1,.3),label('x [m]',1110,470,{size:24,color:C.x,anchor:'end'}));
  s+=box(500,380,{w:100,h:80})+VA(560,280,680,280,{g:seg(p,.35,.5)});
  s+=fade(seg(p,.45,.6),card(250,90,700,110,label('速度は 地面に 固定した 目盛りで 測る',600,158,{size:30,color:C.ink,anchor:'middle',weight:700}),1,C.x));
  return s;
 },
 [K+'fric']:(p)=>{
  const u=seg(p,.05,.8),x=250+500*(1-(1-u)*(1-u));
  let s=ground(80,1120,420)+box(x,420,{text:'箱'});
  const vl=150*(1-u);
  if(vl>8)s+=VA(x+70,330,x+70+vl,330);
  if(u<.98)s+=FA(x-62,408,x-162,408,{w:8,head:20});
  s+=fade(seg(p,.25,.4),label('床が 箱を 押す 摩擦の 力（進む向きと 逆）',600,140,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('→ 速度が 減って 止まる',600,195,{size:28,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'role']:(p)=>{
  let s=card(200,80,800,130,label('力の 役割は 動かすこと？',600,158,{size:34,color:C.dim,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=fade(seg(p,.25,.35),line(380,145,820,145,{color:C.a,w:4}));
  s+=card(200,250,800,150,label('力の 役割',600,305,{size:30,color:C.ink,anchor:'middle'})+label('速度を 変えること',600,370,{size:44,color:C.F,anchor:'middle',weight:700}),seg(p,.45,.6),C.F);
  return s;
 },
 // ================= S4 実験で ma＝F =================
 [K+'exp']:(p)=>{
  let s=pullScene('','',{p:seg(p,.1,.9)});
  const x=250+90*seg(p,.1,.9)**2;
  s+=FA(x+80,260,x+200,260,{text:'一定の 力',size:26,dy:-22});
  s+=fade(seg(p,.4,.55),label('台車を 一定の 力で 引く',900,200,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'measure']:(p)=>{
  let s=card(120,90,460,280,label('加速度 a',350,150,{size:32,color:C.a,anchor:'middle',weight:700})+label('1秒ごとの',350,215,{size:28,color:C.ink,anchor:'middle'})+label('速度の 増え方',350,265,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.a);
  s+=card(620,90,460,280,label('力 F',850,150,{size:32,color:C.F,anchor:'middle',weight:700})+spring(720,900,230,{coils:7,color:C.F})+rect(900,205,90,50,{fill:C.F,fo:.25,rx:8})+label('ばねばかり で 測る',850,320,{size:28,color:C.ink,anchor:'middle'}),seg(p,.45,.6),C.F);
  return s;
 },
 ...Object.fromEntries([['f2',1],['f4',2],['m2',3]].map(([k,n])=>[K+k,(p)=>{
  const r=EXP[n-1];
  let s=pullScene(r[0],r[1],{p:seg(p,.05,.6),y:230});
  s+=fade(seg(p,.3,.45),label(`a ＝ ${r[2]}`,330,330,{size:32,color:C.a,anchor:'middle',weight:700}));
  const rev=[0,1,2].map(i=>i<n-1?1:i===n-1?seg(p,.3,.45):0);
  s+=table({x:620,y:80,cols:expCols,rows:EXP,reveal:rev,hl:n===2?[0,1]:n===3?[1,2]:[]});
  if(n===2)s+=fade(seg(p,.55,.7),label('力 2倍 → 加速度 2倍',860,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  if(n===3)s+=fade(seg(p,.55,.7),label('質量 2倍 → 加速度 半分',860,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 }])),
 [K+'sum']:(p)=>{
  let s=table({x:80,y:80,cols:expCols,rows:EXP,size:28});
  s+=fade(seg(p,.05,.2),label('力に 比例',840,110,{size:28,color:C.F,anchor:'middle',weight:700})+label('質量に 反比例',840,160,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(660,210,360,170,T2('a=\\dfrac{F}{m}',840,305,{size:58}),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'ma']:(p)=>{
  let s=T2('a=\\dfrac{F}{m}',600,75,{size:54});
  s+=fade(seg(p,.1,.25),label('両辺に m を 掛ける',900,85,{size:26,color:C.hi}));
  s+=fade(seg(p,.25,.45),T2('{\\color{#ffe28a}m}\\times a=\\dfrac{F}{m}\\times{\\color{#ffe28a}m}',600,225,{size:48}));
  s+=card(400,300,400,120,T2('ma=F',600,370,{size:64}),seg(p,.55,.7),C.F);
  s+=fade(seg(p,.7,.85),label('運動方程式',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mlaw']:(p)=>{
  let s=card(400,60,400,120,T2('ma=F',600,128,{size:58}),1,C.F);
  s+=card(150,230,420,170,label('代数で 証明した 式',360,300,{size:30,color:C.dim,anchor:'middle',weight:700})+label('ではない',360,350,{size:30,color:C.dim,anchor:'middle'}),seg(p,.1,.25));
  s+=card(630,230,420,170,label('実験を まとめた',840,300,{size:30,color:C.ink,anchor:'middle',weight:700})+label('法則',840,355,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'unitdef']:(p)=>{
  let s=label('定義',600,60,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.25),ground(200,800,330)+cartF(380,330,{text:'1 kg',size:26})+FA(460,270,580,270,{text:'1 N',size:28,dy:-20}));
  s+=card(760,150,380,150,label('加速度',950,205,{size:26,color:C.ink,anchor:'middle'})+label('1 m/s²',950,262,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  s+=fade(seg(p,.7,.85),label('1 N ＝ 1 kg に 1 m/s² を 生じさせる 力',600,440,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unitdef2']:(p)=>{
  let s=card(300,60,600,130,T2('1\\ \\mathrm{kg}\\times 1\\ \\mathrm{m/s^2}=1\\ \\mathrm{N}',600,128,{size:46,auto:false}),1,C.F);
  s+=fade(seg(p,.1,.25),label('ma ＝ F の 両辺の 数値が そろう',600,250,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(150,300,420,130,label('比例する こと',360,350,{size:28,color:C.ink,anchor:'middle'})+label('法則（実験）',360,400,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  s+=card(630,300,420,130,label('1 N の 大きさ',840,350,{size:28,color:C.ink,anchor:'middle'})+label('定義（決め方）',840,400,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.6,.75),C.F);
  return s;
 },
 // ================= S5 使ってみる =================
 [K+'calc1']:(p)=>{
  let s=ground(100,700,330)+cartF(330,330,{text:'2.0 kg',size:26})+FA(410,270,578,270,{text:'6.0 N',size:28,dy:-20,g:seg(p,.1,.3)});
  s+=card(760,140,380,150,label('加速度は？',950,230,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'calc2']:(p)=>{
  let s=T2('a=\\dfrac{F}{m}',600,75,{size:52});
  s+=fade(seg(p,.1,.3),T2('=\\dfrac{6.0}{2.0}',600,225,{size:52,auto:false}));
  s+=card(390,310,420,120,T2('=3.0\\ \\mathrm{m/s^2}',600,375,{size:54,auto:false,color:C.a}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'calc3']:(p)=>{
  const rows=[['0','0'],['1','3.0'],['2','6.0']];
  let s=table({x:640,y:90,cols:[{h:'t [s]',color:C.t,w:180},{h:'v [m/s]',color:C.v,w:220}],rows,reveal:[seg(p,.05,.2),seg(p,.2,.35),seg(p,.5,.65)]});
  [0,1,2].forEach(i=>{const x=150+i*160;s+=fade(seg(p,.05+i*.2,.2+i*.2),ground(x-60,x+60,400)+box(x,400,{w:70,h:56})+(i?VA(x-10,320,x-10+i*45,320):label('止まっている',x,320,{size:22,color:C.dim,anchor:'middle'})));});
  s+=fade(seg(p,.25,.4),label('1秒ごとに ＋3.0',350,190,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'proj']:(p)=>{
  let s=projMini({vx:1,F0:1});
  s+=card(680,150,440,130,T2('ma=0',900,215,{size:52})+label('横：F ＝ 0',900,262,{size:24,color:C.F,anchor:'middle'}),seg(p,.3,.45),C.F);
  s+=fade(seg(p,.65,.8),label('a ＝ 0',900,350,{size:40,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'proj2']:(p)=>{
  let s=projMini({vx:1,F0:1});
  s+=card(680,150,440,190,label('a ＝ 0',900,210,{size:36,color:C.a,anchor:'middle',weight:700})+label('→ 横の 速度は 変わらない',900,280,{size:28,color:C.v,anchor:'middle',weight:700}),1,C.v);
  s+=fade(seg(p,.5,.65),label('放物運動の 約束の 理由',900,400,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=ground(150,550,470)+ball(350,250);
  s+=VA(350,230,350,110,{g:seg(p,.1,.25)})+fade(seg(p,.1,.25),label('速度 v（上）',375,150,{size:26,color:C.v,weight:700}));
  s+=FA(350,272,350,400,{g:seg(p,.45,.6)})+fade(seg(p,.45,.6),label('重力 mg（下）',375,380,{size:26,color:C.F,weight:700}));
  s+=card(650,160,470,150,label('力の 向き と 速度の 向き',885,215,{size:28,color:C.ink,anchor:'middle'})+label('同じとは 限らない',885,270,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.7,.85),C.hi);
  return s;
 },
 [K+'dir2']:(p)=>{
  let s=ground(150,550,470)+ball(350,250)+VA(350,230,350,110)+label('速度 v（上）',375,150,{size:26,color:C.v,weight:700})+FA(350,272,350,400)+label('重力 mg（下）',375,380,{size:26,color:C.F,weight:700});
  s+=arrow(290,272,290,360,{color:C.a,w:5,head:16,g:seg(p,.1,.25)})+fade(seg(p,.1,.25),label('a',270,330,{size:28,color:C.a,anchor:'end',weight:700}));
  s+=card(650,120,470,130,label('加速度は 力と 同じ 向き（下）',885,195,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.15,.3),C.a);
  s+=card(650,280,470,120,label('上りで だんだん 遅くなる',885,350,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.6,.75),C.v);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(150,70,900,130,label('力が はたらく → 速度が 変わる',600,148,{size:36,color:C.F,anchor:'middle',weight:700}),seg(p,.02,.15),C.F);
  s+=card(350,230,500,190,T2('a=\\dfrac{F}{m}',600,330,{size:56}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=card(150,70,900,130,label('力が なければ 止まらない',600,148,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,.02,.15),C.v);
  s+=fade(seg(p,.4,.55),ground(250,950,420)+box(600,420,{text:'箱'})+VA(670,330,760,330)+label('v',715,315,{size:26,color:C.v,anchor:'middle',weight:700})+FA(538,408,438,408,{w:8,head:20})+label('止めたのは 摩擦の 力',600,250,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'kinds']:(p)=>{
  let s=card(100,90,480,260,label('法則（実験）',340,150,{size:32,color:C.hi,anchor:'middle',weight:700})+label('慣性の法則',340,220,{size:30,color:C.ink,anchor:'middle'})+T2('ma=F',340,290,{size:44}),seg(p,.05,.2),C.hi);
  s+=card(620,90,480,260,label('定義（決め方）',860,150,{size:32,color:C.F,anchor:'middle',weight:700})+label('1 N ＝ 1 kg に',860,220,{size:28,color:C.ink,anchor:'middle'})+label('1 m/s² を 生じさせる 力',860,270,{size:28,color:C.ink,anchor:'middle'}),seg(p,.5,.65),C.F);
  return s;
 },
 [K+'next']:(p)=>{
  let s=box(600,400,{text:'物体',w:130});
  s+=FA(535,330,400,330,{g:seg(p,.1,.25)})+FA(665,330,850,330,{g:seg(p,.2,.35)})+FA(600,300,600,180,{g:seg(p,.3,.45)})+FA(600,410,600,480,{g:seg(p,.4,.55),w:7,head:18});
  s+=fade(seg(p,.6,.75),label('力が 何本も',900,200,{size:32,color:C.F,weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.35,box(600,400,{text:'物体',w:130})+FA(535,330,400,330)+FA(665,330,850,330)+FA(600,300,600,180));
  s+=card(250,120,700,200,label('ma ＝ F の F には',600,190,{size:32,color:C.ink,anchor:'middle'})+label('何を 入れる？',600,265,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(200,110,800,230,label('次回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('力と運動方程式',600,255,{size:52,color:C.hi,anchor:'middle',weight:700})+label('深く学ぶ 2/3',600,315,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi),
};
