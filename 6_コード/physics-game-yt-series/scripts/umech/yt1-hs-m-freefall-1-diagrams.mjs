// 高校編「落体の運動・深く学ぶ 1/2」(ys-hs-m-freefall-1) — 図。Stage 1200×515.
// 色（anim.mjs C）：変位 y 水色、速度 v 紫、加速度 a・g 赤、時刻 t 金、強調 黄。g＝9.8 m/s²（この回）。
// 2/2・要点でも使う部品は export する（diagrams.mjs は object だけを読み込む）。
import {C,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,axes,tex,poly,ground} from './anim.mjs';
import {card,brace} from './yt1-hs-m1-velocity-1-diagrams.mjs';

const K='hs-m-freefall-1:';
// coloured letters for TeX (colorize() only knows x v a F t)
export const Gt='{\\color{#ff8f9b}g}', Yt='{\\color{#6adfff}y}', Ht='{\\color{#6adfff}h}';

// ---- objects ----------------------------------------------------------------------------------
export const ball=(x,y,{r=16,color=C.hi,o=1}={})=>dot(x,y,r,color,o)+ring(x,y,r,{color:'#fff7d6',w:1.5});
export const ironBall=(x,y,r=24)=>dot(x,y,r,'#8c97ad')+dot(x-r*.35,y-r*.35,r*.28,'#d5dbe6');
export const lightBall=(x,y,r=14)=>dot(x,y,r,'#ffd9a8')+ring(x,y,r,{color:'#fff1dc',w:1.5});
export function feather(x,y,s=1,rot=-25){
 const pts=[];for(let i=0;i<=24;i++){const u=i/24*2*Math.PI;pts.push([x+11*s*Math.sin(u),y-34*s*Math.cos(u)]);}
 return `<g transform="rotate(${rot} ${x} ${y})">`+poly(pts,{fill:'#f4f0ff',fo:.85,stroke:'#cfc6f0',sw:1.5})+line(x,y+44*s,x,y-34*s,{color:'#9d8fd0',w:2.5})+`</g>`;
}
export function hammer(x,y,s=1){
 return `<g transform="rotate(-20 ${x} ${y})">`+rect(x-5*s,y-6*s,10*s,62*s,{fill:'#b9895a',fo:1,stroke:'none',rx:3})+rect(x-26*s,y-24*s,52*s,22*s,{fill:'#8c97ad',fo:1,stroke:'#d5dbe6',sw:1.5,rx:4})+`</g>`;
}
export function hand(x,y,open=0){
 // a simple hand above (x,y): palm + fingers that open
 const a=open*28;
 return rect(x-26,y-62,52,34,{fill:'#e9c7a6',fo:1,stroke:'none',rx:12})
  +line(x-16,y-30,x-20-a*.6,y-6+a*.2,{color:'#e9c7a6',w:10})+line(x+16,y-30,x+20+a*.6,y-6+a*.2,{color:'#e9c7a6',w:10});
}

// ---- a vertical drop column: release at (x,top), 1 m = k px, g = 9.8 ---------------------------
export const DROP={x:230,top:60,k:8};
export const fall=(t,g=9.8)=>g*t*t/2;
export function dropColumn({x=DROP.x,top=DROP.top,k=DROP.k,n=3,g=1,tLabels=1,yLabels=0,now=-1,ghost=.4}={}){
 let s=fade(g,line(x,top-10,x,top+k*fall(3)+40,{color:C.faint,w:2,dash:'6 8'}));
 s+=fade(g,line(x-22,top,x+50,top,{color:C.dim,w:2,dash:'4 6'}));
 for(let i=0;i<=n;i++){const y=top+k*fall(i);
  s+=fade(g,ball(x,y,{o:i===n||now<0?1:ghost}));
  s+=fade(g*tLabels,label(`${i} s`,x-34,y+8,{size:24,color:C.t,anchor:'end'}));
  if(i>0)s+=fade(g*yLabels,label(`${['','4.9','19.6','44.1'][i]} m`,x+34,y+8,{size:24,color:C.x}));}
 return s;
}

// ---- v-t graph for free fall (g = 9.8) --------------------------------------------------------
export const vtAxes=(g=1,{x=110,y=440,w=520,h=350,xmax=3.4,ymax=34}={})=>axes({x,y,w,h,xmax,ymax,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks:[1,2,3],yticks:[10,20,30],grid:true,g,xcolor:C.t,ycolor:C.v});

// ---- table t / v / y ------------------------------------------------------------------------
const TB={x:560,y:70,cw:[150,190,190],rh:62};
function table(rows,{hl=-1,g=1}={}){
 const xs=[TB.x,TB.x+TB.cw[0],TB.x+TB.cw[0]+TB.cw[1],TB.x+TB.cw[0]+TB.cw[1]+TB.cw[2]];
 let s=card(TB.x-10,TB.y-10,xs[3]-TB.x+20,TB.rh*4+30,'',g);
 const head=[['t [s]',C.t],['v [m/s]',C.v],['y [m]',C.x]];
 head.forEach(([h,c],i)=>{s+=fade(g,label(h,(xs[i]+xs[i+1])/2,TB.y+40,{size:26,color:c,anchor:'middle',weight:700}));});
 s+=fade(g,line(TB.x,TB.y+TB.rh,xs[3],TB.y+TB.rh,{color:C.faint,w:2}));
 const data=[['1','9.8','4.9'],['2','19.6','19.6'],['3','29.4','44.1']];
 data.forEach((r,j)=>{const a=rows[j]??0;if(a<=0)return;const yy=TB.y+TB.rh*(j+1)+42;
  if(j===hl)s+=fade(a,rect(TB.x,yy-36,xs[3]-TB.x,TB.rh-8,{fill:C.hi,fo:.12,stroke:C.hi,sw:1.5,rx:8}));
  r.forEach((v,i)=>{s+=fade(a,label(v,(xs[i]+xs[i+1])/2,yy,{size:30,color:[C.t,C.v,C.x][i],anchor:'middle',weight:700}));});});
 return s;
}

const T1=(src,x,y,o={})=>tex(src,x,y,{size:46,...o});

export const hsFreefall1Diagrams={
 // ================= S1 前回の問い =================
 [K+'drop']:(p)=>{
  const u=seg(p,.28,.8);
  let s=ground(300,900,470)+hand(600,96,seg(p,.15,.25));
  s+=ball(600,mix(112,450,u*u));
  s+=fade(seg(p,.7,.85),label('加速度は？',820,260,{size:36,color:C.a,weight:700}));
  return s;
 },
 [K+'heavylight']:(p)=>{
  let s=ground(250,950,470);
  s+=ironBall(450,120,30)+lightBall(750,120,16);
  s+=fade(seg(p,.05,.2),label('重い球',450,200,{size:28,color:C.ink,anchor:'middle'})+label('軽い球',750,200,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('どちらが 先に 着く？',600,350,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'daily']:(p)=>{
  const u=seg(p,.05,.5),w=seg(p,.05,.95);
  let s=ground(250,950,470);
  s+=ironBall(450,mix(90,440,u*u),26)+feather(750,mix(90,230,w),1);
  s+=fade(seg(p,.05,.2),label('鉄の球',450,60,{size:26,color:C.ink,anchor:'middle'})+label('羽根',750,60,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('重いほど 速い？',600,330,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(90,140,460,210,label('落ちる 運動',320,240,{size:38,color:C.ink,anchor:'middle',weight:700})+label('（落体の運動）',320,295,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  s+=arrow(580,245,680,245,{color:C.dim,w:4,g:seg(p,.35,.5)});
  s+=card(710,110,420,270,label('3公式',920,170,{size:32,color:C.hi,anchor:'middle',weight:700})+tex('v=v_0+at',920,225,{size:30})+tex('x=v_0t+\\tfrac12at^2',920,285,{size:30})+tex('v^2-v_0^2=2ax',920,345,{size:30}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'series']:(p)=>{
  const items=[['1','落とす','手を 離すだけ'],['2','投げ上げる','真上に 投げる']];
  let s=fade(seg(p,0,.12),label('落体の運動 2回',600,80,{size:34,color:C.ink,anchor:'middle',weight:700}));
  items.forEach(([n,a,b],i)=>{const x=150+i*480,g=seg(p,.1+i*.3,.28+i*.3),on=i===0&&p>.3;
   s+=card(x,140,420,240,label(n,x+210,210,{size:50,color:C.hi,anchor:'middle',weight:700})+label(a,x+210,285,{size:38,color:C.ink,anchor:'middle',weight:700})+label(b,x+210,340,{size:26,color:C.dim,anchor:'middle'}),g,on?C.hi:C.faint);});
  s+=fade(seg(p,.2,.35),label('今回',360,128,{size:24,color:C.hi,anchor:'middle'}));
  return s;
 },
 // ================= S2 空気がなければ =================
 [K+'assume']:(p)=>{
  let s=card(200,70,800,330,label('仮定',600,135,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.15,.3),label('・空気抵抗を 無視する',300,220,{size:34,color:C.ink}));
  s+=fade(seg(p,.4,.55),label('・地面の近く（重力が 変わらない 範囲）',300,300,{size:34,color:C.ink}));
  return s;
 },
 [K+'air']:(p)=>{
  const y=mix(110,260,seg(p,.05,.9));
  let s=ground(350,850,470)+feather(600,y,1.2);
  for(let i=0;i<3;i++){const g=seg(p,.2+i*.08,.35+i*.08);s+=arrow(560+40*i,y+150,560+40*i,y+80,{color:C.F,w:3,head:12,g});}
  s+=fade(seg(p,.45,.6),label('空気が 押し返す',770,y+130,{size:28,color:C.F})+label('＝ 空気抵抗',770,y+170,{size:28,color:C.F,weight:700}));
  return s;
 },
 ...Object.fromEntries([['moon',0],['moon2',1]].map(([k,st])=>[K+k,(p)=>{
  const u=st?seg(p,.08,.55):0,y=mix(120,400,u*u);
  let s=`<path d="M 120 470 Q 600 400 1080 470 L 1080 515 L 120 515 Z" fill="#5a6378" fill-opacity=".9"/>`;
  s+=ring(320,455,22,{color:'#3e4659',w:3})+ring(860,450,14,{color:'#3e4659',w:3});
  s+=hammer(470,y)+feather(730,y,1);
  if(!st){
   s+=fade(seg(p,.25,.4),label('アポロ15号（1971年）',600,60,{size:30,color:C.ink,anchor:'middle',weight:700}));
   s+=fade(seg(p,.45,.6),label('ハンマー',470,210,{size:26,color:C.ink,anchor:'middle'})+label('羽根',730,210,{size:26,color:C.ink,anchor:'middle'}));
   s+=fade(seg(p,.6,.75),label('月面',150,440,{size:26,color:C.dim}));
  }else{
   s+=fade(seg(p,.02,.15),label('空気が ほとんど ない',600,60,{size:30,color:C.dim,anchor:'middle'}));
   s+=fade(seg(p,.6,.75),label('同時に 着地',600,250,{size:40,color:C.hi,anchor:'middle',weight:700}));
  }
  return s;
 }])),
 [K+'fact']:(p)=>{
  let s=card(150,70,900,170,label('空気抵抗が なければ',600,135,{size:30,color:C.ink,anchor:'middle'})+label('落ち方は 質量に よらない',600,200,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(330,290,540,110,label('実験で 確かめられた 事実',600,358,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.65));
  s+=fade(seg(p,.5,.65),label('（法則）',940,358,{size:26,color:C.hi}));
  return s;
 },
 [K+'gdef']:(p)=>{
  let s=ground(100,500,470)+ironBall(220,150,26)+lightBall(380,150,15);
  s+=arrow(220,200,220,320,{color:C.a,w:6,head:18,g:seg(p,.1,.3)})+arrow(380,200,380,320,{color:C.a,w:6,head:18,g:seg(p,.1,.3)});
  s+=fade(seg(p,.25,.4),label('同じ 加速度',300,370,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=card(580,120,540,230,label('重力加速度',850,185,{size:34,color:C.a,anchor:'middle',weight:700})+tex(Gt+'\\approx 9.8\\ \\mathrm{m/s^2}',850,280,{size:54,auto:false}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'gmean']:(p)=>{
  const vs=['0','9.8','19.6','29.4'];
  let s=fade(seg(p,0,.1),label('速度',170,90,{size:28,color:C.v,anchor:'middle',weight:700}));
  vs.forEach((v,i)=>{const g=seg(p,.08+i*.15,.2+i*.15),x=170+i*270;
   s+=fade(g,label(`${i} s`,x,150,{size:26,color:C.t,anchor:'middle'})+label(`${v} m/s`,x,215,{size:34,color:C.v,anchor:'middle',weight:700}));
   if(i>0)s+=fade(g,arrow(x-225,260,x-45,260,{color:C.a,w:4,head:12})+label('＋9.8',x-135,300,{size:28,color:C.a,anchor:'middle',weight:700}));});
  s+=card(250,350,700,110,label('1秒ごとに 速度が ＋9.8 m/s',600,418,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.7,.85),C.a);
  return s;
 },
 [K+'gsign']:(p)=>{
  let s=arrow(300,110,300,380,{color:C.a,w:7,head:22,g:seg(p,.05,.25)})+fade(seg(p,.15,.3),label('g',325,260,{size:40,color:C.a,weight:700})+label('下向き',325,310,{size:26,color:C.dim}));
  s+=card(520,90,600,140,label('g ＝ 大きさ',820,150,{size:34,color:C.a,anchor:'middle',weight:700})+label('いつも 正の数（9.8）',820,200,{size:28,color:C.ink,anchor:'middle'}),seg(p,.2,.35),C.a);
  s+=card(520,270,600,170,label('向きは 符号で 付ける',820,325,{size:30,color:C.ink,anchor:'middle',weight:700})+label('下を正 → a ＝ ＋g',820,375,{size:28,color:C.a,anchor:'middle'})+label('上を正 → a ＝ −g',820,418,{size:28,color:C.a,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },
 [K+'gnot']:(p)=>{
  let s=card(150,90,420,200,label('g は 力？',360,170,{size:36,color:C.dim,anchor:'middle',weight:700})+label('×',360,240,{size:44,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(630,90,420,200,label('g は 加速度',840,170,{size:36,color:C.a,anchor:'middle',weight:700})+label('単位 m/s²',840,235,{size:28,color:C.ink,anchor:'middle'}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'why']:(p)=>{
  let s=card(150,80,900,140,label('なぜ 質量に よらない？',600,165,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=arrow(600,235,600,285,{color:C.dim,w:4,head:14,g:seg(p,.25,.35)});
  s+=card(250,300,700,130,label('力と運動方程式の 単元で',600,350,{size:28,color:C.dim,anchor:'middle'})+tex('ma=F',600,400,{size:40}),seg(p,.3,.45),C.F);
  s+=fade(seg(p,.65,.8),label('今は 実験事実 として 使う',600,480,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 自由落下を3公式で =================
 [K+'free']:(p)=>{
  let s=hand(300,90,seg(p,.1,.25))+ball(300,mix(110,150,seg(p,.2,.35)));
  s+=fade(seg(p,.3,.45),label('自由落下',560,170,{size:40,color:C.ink,weight:700})+label('静かに 手を 離す',560,225,{size:28,color:C.dim}));
  s+=fade(seg(p,.6,.75),tex('v_0=0',650,330,{size:52}));
  s+=fade(seg(p,.6,.75),label('初速度',560,400,{size:26,color:C.v}));
  return s;
 },
 [K+'down']:(p)=>{
  let s=ball(300,110)+arrow(300,140,300,430,{color:C.x,w:4,head:16,g:seg(p,.05,.25)})+fade(seg(p,.15,.3),label('正',326,400,{size:30,color:C.x,weight:700})+label('下向き',326,440,{size:24,color:C.dim}));
  s+=card(560,120,520,250,tex('v_0=0',820,200,{size:50})+fade(seg(p,.5,.65),tex('a='+Gt,820,300,{size:50,auto:true})),seg(p,.3,.45));
  return s;
 },
 [K+'yaxis']:(p)=>{
  const yy=mix(110,330,seg(p,.2,.6));
  let s=line(200,110,400,110,{color:C.dim,w:2,dash:'4 6'})+fade(.35,ball(300,110))+ball(300,yy);
  s+=fade(seg(p,.05,.2),label('離した 点',420,118,{size:24,color:C.dim}));
  s+=arrow(250,110,250,yy,{color:C.x,w:5,head:14,g:seg(p,.3,.5)})+fade(seg(p,.45,.6),tex(Yt,215,(110+yy)/2+10,{size:48,auto:false}));
  s+=card(560,160,520,150,label('y ＝ 下へ 測った 変位',820,225,{size:32,color:C.x,anchor:'middle',weight:700})+label('（落ちた 距離）',820,275,{size:26,color:C.dim,anchor:'middle'}),seg(p,.55,.7),C.x);
  return s;
 },
 [K+'sub1']:(p)=>{
  let s=label('第1式',600,70,{size:28,color:C.dim,anchor:'middle'})+T1('v=v_0+at',600,150,{size:54});
  s+=fade(seg(p,.35,.5),label('v₀ ＝ 0',360,260,{size:34,color:C.v,anchor:'middle',weight:700})+arrow(400,230,520,170,{color:C.v,w:3,head:12}));
  s+=fade(seg(p,.6,.75),label('a ＝ g',840,260,{size:34,color:C.a,anchor:'middle',weight:700})+arrow(800,230,690,170,{color:C.a,w:3,head:12}));
  return s;
 },
 [K+'res1']:(p)=>{
  let s=label('第1式',600,70,{size:28,color:C.dim,anchor:'middle'});
  const k=seg(p,.05,.2);
  s+=fade(1-k,T1('v=0+'+Gt+'t',600,150,{size:54}))+fade(k,T1('v={\\color{#ff8f9b}\\cancel{\\color{#9aabc7}0}}+'+Gt+'t',600,150,{size:54}));
  s+=card(420,230,360,110,T1('v='+Gt+'t',600,290,{size:58}),seg(p,.25,.4),C.v);
  s+=fade(seg(p,.6,.75),label('速度は 時間に 比例',600,410,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'sub2']:(p)=>{
  let s=label('第2式',600,70,{size:28,color:C.dim,anchor:'middle'});
  const c=seg(p,.15,.35);
  s+=fade(1-c,T1('x=v_0t+\\tfrac12at^2',600,150,{size:54}));
  s+=fade(c,T1(Yt+'=v_0t+\\tfrac12at^2',600,150,{size:54}));
  s+=fade(seg(p,.1,.25),label('x → y',260,160,{size:30,color:C.x,weight:700}));
  s+=fade(seg(p,.45,.6),label('v₀ ＝ 0',420,270,{size:34,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('a ＝ g',780,270,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'res2']:(p)=>{
  let s=label('第2式',600,70,{size:28,color:C.dim,anchor:'middle'});
  const k=seg(p,.05,.25);
  s+=fade(1-k,T1(Yt+'=0\\cdot t+\\tfrac12'+Gt+'t^2',600,150,{size:54}))+fade(k,T1(Yt+'={\\color{#ff8f9b}\\cancel{\\color{#9aabc7}0\\cdot t}}+\\tfrac12'+Gt+'t^2',600,150,{size:54}));
  s+=card(400,230,400,120,T1(Yt+'=\\tfrac12'+Gt+'t^2',600,295,{size:58}),seg(p,.35,.5),C.x);
  return s;
 },
 [K+'use']:(p)=>{
  let s=card(140,80,920,160,T1('v='+Gt+'t',380,165,{size:52})+T1(Yt+'=\\tfrac12'+Gt+'t^2',820,165,{size:52}),seg(p,.02,.15));
  s+=card(250,290,700,130,label('新しい公式 ではない',600,345,{size:34,color:C.hi,anchor:'middle',weight:700})+label('3公式 ＋ 落下の条件（v₀ ＝ 0、a ＝ g）',600,395,{size:26,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.hi);
  return s;
 },
 // ================= S4 1秒ごとに確かめる =================
 ...Object.fromEntries([['tab1',1],['tab2',2],['tab3',3]].map(([k,n])=>[K+k,(p)=>{
  const g=seg(p,.05,.3);
  let s=dropColumn({n:n-1,yLabels:1,now:1})+fade(g,ball(DROP.x,DROP.top+DROP.k*fall(n)))+fade(g,label(`${n} s`,DROP.x-34,DROP.top+DROP.k*fall(n)+8,{size:24,color:C.t,anchor:'end'}));
  s+=fade(seg(p,.55,.7),label(`${['','4.9','19.6','44.1'][n]} m`,DROP.x+34,DROP.top+DROP.k*fall(n)+8,{size:24,color:C.x,weight:700}));
  const rows=[0,1,2].map(j=>j<n-1?1:j===n-1?seg(p,.2,.35):0);
  s+=table(rows,{hl:n-1});
  const f=[`\\tfrac12\\times 9.8\\times 1^2=4.9`,`\\tfrac12\\times 9.8\\times 2^2=19.6`,`\\tfrac12\\times 9.8\\times 3^2=44.1`][n-1];
  s+=fade(seg(p,.45,.6),tex(Yt+'='+f,845,415,{size:36,auto:false}));
  return s;
 }])),
 [K+'gaps']:(p)=>{
  let s=dropColumn({yLabels:0});
  const ys=[0,4.9,19.6,44.1].map(m=>DROP.top+DROP.k*m),d=['4.9','14.7','24.5'];
  for(let i=0;i<3;i++){const g=seg(p,.05+i*.15,.2+i*.15);
   s+=fade(g,line(DROP.x+60,ys[i]+4,DROP.x+60,ys[i+1]-4,{color:C.x,w:5})+line(DROP.x+50,ys[i]+4,DROP.x+70,ys[i]+4,{color:C.x,w:3})+line(DROP.x+50,ys[i+1]-4,DROP.x+70,ys[i+1]-4,{color:C.x,w:3}))
    +fade(g,label(`${d[i]} m`,DROP.x+84,(ys[i]+ys[i+1])/2+9,{size:26,color:C.x,weight:700}));}
  s+=card(600,140,500,190,label('1秒ごとの 区間',850,200,{size:28,color:C.dim,anchor:'middle'})+label('4.9 ： 14.7 ： 24.5',850,255,{size:32,color:C.x,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('＝ 1 ： 3 ： 5',850,305,{size:36,color:C.hi,anchor:'middle',weight:700})),seg(p,.45,.6));
  return s;
 },
 [K+'gaps2']:(p)=>{
  let s=dropColumn({yLabels:0});
  const ys=[0,4.9,19.6,44.1].map(m=>DROP.top+DROP.k*m),v=['9.8','19.6','29.4'];
  for(let i=1;i<=3;i++){const g=seg(p,.1+i*.12,.22+i*.12);s+=arrow(DROP.x+30,ys[i],DROP.x+30,ys[i]+12*i+18,{color:C.v,w:4,head:12,g})+fade(g,label(`${v[i-1]} m/s`,DROP.x+60,ys[i]+16,{size:24,color:C.v}));}
  s+=card(600,160,500,170,label('あとの 1秒ほど 長く落ちる',850,225,{size:30,color:C.ink,anchor:'middle',weight:700})+label('← 速度が 増えていく',850,280,{size:28,color:C.v,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },
 [K+'vt']:(p)=>{
  const A=vtAxes(seg(p,.02,.2));let s=A.svg;
  s+=A.plot(t=>9.8*t,{from:0,to:3.1,p:seg(p,.25,.55),color:C.v,w:4,steps:2});
  s+=fade(seg(p,.4,.55),[1,2,3].map(t=>dot(A.X(t),A.Y(9.8*t),7,C.v)).join(''));
  s+=card(720,140,420,170,tex('v='+Gt+'t',930,205,{size:48})+label('傾き 9.8 の 直線',930,275,{size:28,color:C.ink,anchor:'middle'}),seg(p,.55,.7),C.v);
  return s;
 },
 [K+'area']:(p)=>{
  const A=vtAxes();let s=A.svg+A.plot(t=>9.8*t,{from:0,to:3.1,color:C.v,w:4,steps:2});
  s+=fade(seg(p,.05,.25),poly([[A.X(0),A.Y(0)],[A.X(2),A.Y(0)],[A.X(2),A.Y(19.6)]],{fill:C.x,fo:.3,stroke:C.x,sw:2}));
  s+=fade(seg(p,.2,.35),label('19.6',A.X(2)+12,A.Y(19.6)+8,{size:24,color:C.v,weight:700}));
  s+=card(720,140,420,190,tex('\\tfrac12\\times 2\\times 19.6',930,205,{size:40,auto:false})+tex('=19.6\\ \\mathrm{m}',930,265,{size:42,auto:false,color:C.x}),seg(p,.35,.5),C.x);
  s+=fade(seg(p,.7,.85),label('表の 2秒後と 同じ',930,375,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'view']:(p)=>{
  const A=vtAxes();let s=A.svg+A.plot(t=>9.8*t,{from:0,to:3.1,color:C.v,w:4,steps:2});
  s+=poly([[A.X(0),A.Y(0)],[A.X(2),A.Y(0)],[A.X(2),A.Y(19.6)]],{fill:C.x,fo:.3,stroke:C.x,sw:2});
  s+=card(720,120,420,110,label('傾き ＝ 加速度 g',930,188,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(720,260,420,110,label('面積 ＝ 変位 y',930,328,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.3,.45),C.x);
  s+=fade(seg(p,.6,.75),label('前の単元と 同じ 見方',930,430,{size:28,color:C.hi,anchor:'middle'}));
  return s;
 },
 // ================= S5 距離から時間を求める =================
 [K+'cliff']:(p)=>{
  let s=rect(120,90,180,380,{fill:'#4a5570',fo:.8,stroke:'none',rx:4})+ground(100,700,470);
  s+=ball(330,90);
  s+=arrow(380,90,380,465,{color:C.x,w:4,head:14,g:seg(p,.2,.4)})+fade(seg(p,.3,.45),tex(Ht,410,290,{size:52,auto:false}));
  s+=card(640,140,480,160,label('何秒で 着く？',880,210,{size:38,color:C.hi,anchor:'middle',weight:700})+tex('t=\\ ?',880,265,{size:40}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'inv1']:(p)=>{
  let s=label('着いたとき y ＝ h',600,60,{size:30,color:C.x,anchor:'middle'});
  s+=T1(Ht+'=\\tfrac12'+Gt+'t^2',600,150,{size:54});
  s+=fade(seg(p,.35,.5),T1('{\\color{#ffe28a}2\\times}\\,'+Ht+'={\\color{#ffe28a}2\\times}\\,\\tfrac12'+Gt+'t^2',600,260,{size:50}));
  s+=fade(seg(p,.35,.5),label('両辺を 2倍',1000,270,{size:26,color:C.hi}));
  s+=card(420,330,360,110,T1('2'+Ht+'='+Gt+'t^2',600,390,{size:54}),seg(p,.6,.75),C.x);
  return s;
 },
 [K+'inv2']:(p)=>{
  let s=T1('2'+Ht+'='+Gt+'t^2',600,110,{size:50});
  s+=fade(seg(p,.1,.3),T1('\\dfrac{2'+Ht+'}{\\color{#ffe28a}'+'g}=\\dfrac{'+Gt+'t^2}{\\color{#ffe28a}g}',600,240,{size:50}));
  s+=fade(seg(p,.1,.3),label('両辺を g で 割る',960,250,{size:26,color:C.hi}));
  s+=card(420,300,360,165,T1('t^2=\\dfrac{2'+Ht+'}{'+Gt+'}',600,392,{size:54}),seg(p,.55,.7),C.t);
  return s;
 },
 [K+'inv3']:(p)=>{
  let s=T1('t^2=\\dfrac{2'+Ht+'}{'+Gt+'}',600,110,{size:50});
  s+=fade(seg(p,.1,.25),label('2乗すると 2h/g になる 数',600,200,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),label('時間は 正 → 正の 平方根',600,250,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(400,295,400,190,T1('t=\\sqrt{\\dfrac{2'+Ht+'}{'+Gt+'}}',600,398,{size:56}),seg(p,.55,.7),C.t);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=label('h ＝ 44.1 m',600,70,{size:32,color:C.x,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),tex('t^2=\\dfrac{2\\times 44.1}{9.8}=9',600,190,{size:50}));
  s+=card(450,270,300,110,tex('t=3\\ \\mathrm{s}',600,330,{size:52}),seg(p,.4,.55),C.t);
  s+=fade(seg(p,.65,.8),label('表の 3秒後（44.1 m）と 一致',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'x4']:(p)=>{
  let s=dropColumn({yLabels:1,tLabels:1});
  s+=card(560,100,580,110,label('4.9 m → 1 s',850,170,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(560,240,580,110,label('19.6 m（4倍）→ 2 s',850,310,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.45));
  s+=fade(seg(p,.65,.8),label('高さ 4倍 → 時間 2倍',850,420,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'back']:(p)=>{
  const u=seg(p,.1,.6),y=mix(110,440,u*u);
  let s=ground(250,950,470)+ironBall(450,y-14,30)+lightBall(750,y,16);
  s+=fade(seg(p,.02,.15),label('空気抵抗 なし',600,60,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.62,.78),label('同時に 着地',600,300,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'back2']:(p)=>{
  let s=ground(250,950,470)+ironBall(450,416,30)+feather(750,220,1.1);
  for(let i=0;i<3;i++)s+=arrow(710+40*i,370,710+40*i,310,{color:C.F,w:3,head:12,g:seg(p,.15,.35)});
  s+=fade(seg(p,.3,.45),label('日常の 差 ＝ 空気抵抗',600,80,{size:34,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=card(150,50,900,120,label('自由落下：v₀ ＝ 0、a ＝ g の 等加速度運動',600,122,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(150,210,420,130,T1('v='+Gt+'t',360,280,{size:52}),seg(p,.5,.62),C.v);
  s+=card(630,210,420,130,T1(Yt+'=\\tfrac12'+Gt+'t^2',840,280,{size:52}),seg(p,.6,.72),C.x);
  s+=fade(seg(p,.75,.88),label('g ≈ 9.8 m/s²（下向き）',600,410,{size:30,color:C.a,anchor:'middle'}));
  return s;
 },
 [K+'up']:(p)=>{
  // thrown straight up: height 20t-5t^2 (illustrative), 1 m = 16 px
  const tt=2*seg(p,.15,.75),h=Math.max(0,20*tt-5*tt*tt);
  let s=ground(350,850,470)+fade(.5,line(520,470-16*20,680,470-16*20,{color:C.dim,w:2,dash:'6 8'}));
  s+=ball(600,450-16*h);
  s+=fade(seg(p,.05,.15)*(1-seg(p,.35,.5)),arrow(650,420,650,340,{color:C.v,w:4,head:12}));
  s+=fade(seg(p,.4,.55),label('最高点',700,470-16*20+8,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'q']:(p)=>{
  let s=fade(.35,ground(350,850,470)+line(520,150,680,150,{color:C.dim,w:2,dash:'6 8'}))+ball(600,150);
  s+=card(150,230,900,160,label('最高点では',600,285,{size:30,color:C.ink,anchor:'middle'})+label('速度も 加速度も 0 ？',600,350,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('投げ上げ',600,260,{size:56,color:C.hi,anchor:'middle',weight:700})+label('上向きを 正にして 考える',600,315,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('落体の運動・深く学ぶ 2/2 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
