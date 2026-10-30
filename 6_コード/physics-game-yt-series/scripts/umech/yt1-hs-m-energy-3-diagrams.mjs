// 高校編「仕事とエネルギー・深く学ぶ 3/3」(ys-hs-m-energy-3) — 図。Stage 1200×515.
// 1.0 kg・20 m の落下（U 薄い橙・K 濃い橙の積み上げ棒、合計 200 J）、ΔK＝−ΔU、v＝√(2gh)、道の形、コースター 45 m、摩擦と熱。g＝10。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,ground,axes} from './anim.mjs';
import {card,ball,WC,KC,UC,Wt,Kt,Ut,MG,Gt,Ht,T2,FA,VA,box,tag} from './yt1-hs-m-energy-1-diagrams.mjs';

const K='hs-m-energy-3:';
const DK=`\\Delta ${Kt}`, DU=`\\Delta ${Ut}`;
// ---- drop column: ball at height h (m) above ground ----------------------------------------------
const DX=230,DG=465,DK_=18; const yh=h=>DG-DK_*h;
function dropCol({h=20,g=1,ruler=1,marks=[[20,'20 m']],trail=0}={}){
 let s=fade(g,ground(DX-120,DX+120,DG));
 if(ruler)s+=fade(g,line(DX-90,DG,DX-90,yh(20),{color:C.x,w:2})+marks.map(([m,t])=>line(DX-100,yh(m),DX-80,yh(m),{color:C.x,w:2})+label(t,DX-106,yh(m)+8,{size:22,color:C.x,anchor:'end'})).join(''));
 if(trail)s+=fade(g*.5,line(DX,yh(20),DX,yh(h),{color:C.faint,w:2,dash:'5 6'}));
 s+=fade(g,ball(DX,yh(h)-16,{r:16}));
 return s;
}
// ---- stacked energy bar: U (light, bottom) + K (dark, top); total 200 J --------------------------
function stack(x,base,U,Kv,{k=1.4,w=110,g=1,lab=1,total=1,title=''}={}){
 let s='';
 s+=fade(g,rect(x-w/2,base-U*k,w,U*k,{fill:UC,fo:.6,stroke:UC,sw:2,rx:4}));
 s+=fade(g,rect(x-w/2,base-(U+Kv)*k,w,Kv*k,{fill:KC,fo:.7,stroke:KC,sw:2,rx:4}));
 if(lab){
  if(U>8)s+=fade(g,label(`U ${Math.round(U)}`,x,base-U*k/2+8,{size:22,color:C.bg,anchor:'middle',weight:700}));
  if(Kv>8)s+=fade(g,label(`K ${Math.round(Kv)}`,x,base-U*k-Kv*k/2+8,{size:22,color:C.bg,anchor:'middle',weight:700}));
 }
 if(total)s+=fade(g,line(x-w/2-20,base-200*k,x+w/2+20,base-200*k,{color:C.hi,w:2,dash:'6 6'}));
 if(title)s+=fade(g,label(title,x,base+32,{size:22,color:C.ink,anchor:'middle'}));
 return s;
}
const bars=(hs,{x0=520,dx=170,base=440,g=1,hl=-1}={})=>hs.map((h,i)=>stack(x0+dx*i,base,10*h,200-10*h,{g,title:`高さ ${h} m`})+(i===hl?fade(g,rect(x0+dx*i-75,base-300,150,345,{fill:'none',fo:0,stroke:C.hi,sw:2,rx:10})):'')).join('')+fade(g,line(x0-90,base,x0+dx*(hs.length-1)+90,base,{color:C.dim,w:3})+label('200 J',x0-100,base-200*1.4+8,{size:22,color:C.hi,anchor:'end',weight:700}));
// ---- coaster track -------------------------------------------------------------------------------
const CB=470,CK=7; // base y, px per metre
const trackH=x=>x<=150?45:x<=560?45*(1+Math.cos(Math.PI*(x-150)/410))/2:x<=860?25*(1-Math.cos(Math.PI*(x-560)/300))/2:25-8*(1-Math.cos(Math.PI*Math.min(1,(x-860)/240)))/2;
const trackPts=()=>{const p=[];for(let x=80;x<=1100;x+=10)p.push([x,CB-CK*trackH(x)]);return p;};
function coaster({g=1,at=null,marks=0}={}){
 let s=fade(g,line(60,CB,1120,CB,{color:C.dim,w:2})+draw(trackPts(),1,{color:C.dim,w:5}));
 if(at!==null)s+=fade(g,rect(at-22,CB-CK*trackH(at)-30,44,26,{fill:C.hi,fo:.9,stroke:C.hi,rx:6}));
 if(marks){
  s+=fade(g*marks,line(110,CB,110,CB-CK*45,{color:C.x,w:2})+label('45 m',100,CB-CK*22+8,{size:22,color:C.x,anchor:'end'}));
  s+=fade(g*marks,line(860,CB,860,CB-CK*25,{color:C.x,w:2,dash:'5 5'})+label('25 m',872,CB-CK*12+8,{size:22,color:C.x}));
 }
 return s;
}
// ---- incline -------------------------------------------------------------------------------------
function incline({g=1,u=.4,N=0,mv=0,mg=0}={}){
 const A=[150,440],B=[650,440],T=[150,160]; // right triangle, slope from T to B
 let s=fade(g,poly([A,B,T],{fill:'#3a4a66',fo:.5,stroke:C.dim,sw:2}));
 const L=Math.hypot(B[0]-T[0],B[1]-T[1]),ux=(B[0]-T[0])/L,uy=(B[1]-T[1])/L,nx=uy,ny=-ux; // normal pointing up-right
 const px=T[0]+ux*L*u,py=T[1]+uy*L*u,cx=px+nx*28,cy=py+ny*28;
 s+=fade(g,`<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${(Math.atan2(uy,ux)*180/Math.PI).toFixed(1)})"><rect x="-34" y="-28" width="68" height="56" rx="8" fill="#c9a46a" fill-opacity=".7"/></g>`);
 if(N)s+=FA(cx+nx*30,cy+ny*30,cx+nx*130,cy+ny*130,{text:'垂直抗力',size:24,dx:60,dy:0,g:g*N});
 if(mv)s+=fade(g*mv,arrow(cx+ux*50-nx*40,cy+uy*50-ny*40,cx+ux*170-nx*40,cy+uy*170-ny*40,{color:C.x,w:4,head:14})+label('動き',cx+ux*150-nx*80,cy+uy*150-ny*80,{size:22,color:C.x}));
 if(mg)s+=FA(cx,cy,cx,cy+110,{text:'mg',size:24,dx:-30,dy:20,g:g*mg});
 return s;
}

export const hsEnergy3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  const u=seg(p,.1,.7),h=20-10*u*u;
  let s=dropCol({h,trail:1});
  s+=card(560,120,560,200,label('高さ の エネルギー U',840,180,{size:30,color:UC,anchor:'middle',weight:700})+label('速さ の エネルギー K',840,230,{size:30,color:KC,anchor:'middle',weight:700})+label('どう 受け渡す？',840,290,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'g10']:(p)=>card(250,120,700,230,label('計算を 見やすく するため',600,190,{size:30,color:C.ink,anchor:'middle'})+tex(Gt+'=10\\ \\mathrm{m/s^2}',600,280,{size:56,auto:false}),seg(p,0,.15),C.a)+fade(seg(p,.6,.75),label('（本当は 約 9.8）',600,410,{size:28,color:C.dim,anchor:'middle'})),
 [K+'start']:(p)=>{
  let s=dropCol({h:20});
  s+=fade(seg(p,0,.15),label('1.0 kg',DX+30,yh(20)-30,{size:24,color:C.ink,weight:700}));
  s+=card(560,100,560,200,tex(Ut+'=1.0\\times 10\\times 20=200\\ \\mathrm{J}',840,170,{size:38,auto:false})+tex(Kt+'=0',840,245,{size:42,auto:false}),seg(p,.3,.45),UC);
  return s;
 },
 [K+'guess']:(p)=>{
  let s=dropCol({h:0,trail:1});
  s+=card(560,100,560,200,tex(Ut+'=0',840,170,{size:44,auto:false})+tex(Kt+'=\\ ?',840,245,{size:48,auto:false}),seg(p,0,.15),C.hi);
  return s;
 },
 // ================= S2 K＋U は変わらない =================
 [K+'two']:(p)=>{
  let s=dropCol({h:10,trail:1})+FA(DX+40,yh(10)-16,DX+40,yh(10)+70,{text:'mg',size:24,dx:14,dy:10,anchor:'start'});
  s+=card(520,90,600,110,label('重力が する 仕事',820,158,{size:34,color:WC,anchor:'middle',weight:700}),seg(p,0,.15),WC);
  s+=card(520,240,280,120,label('① U から',660,312,{size:30,color:UC,anchor:'middle',weight:700}),seg(p,.4,.55),UC);
  s+=card(840,240,280,120,label('② K から',980,312,{size:30,color:KC,anchor:'middle',weight:700}),seg(p,.55,.7),KC);
  return s;
 },
 [K+'w1']:(p)=>{
  let s=dropCol({h:10,trail:1});
  s+=card(520,90,600,120,label('① 位置エネルギー から',820,165,{size:32,color:UC,anchor:'middle',weight:700}),seg(p,0,.15),UC);
  s+=card(520,250,600,130,label('重力が 仕事を した 分',820,305,{size:28,color:WC,anchor:'middle',weight:700})+label('→ U が 減る',820,355,{size:30,color:UC,anchor:'middle',weight:700}),seg(p,.4,.55),UC);
  return s;
 },
 [K+'du']:(p)=>{
  let s=card(250,70,700,120,label('ΔU ＝ あと − はじめ',600,145,{size:40,color:UC,anchor:'middle',weight:700}),seg(p,0,.15),UC);
  s+=fade(seg(p,.3,.45),label('減る とき：ΔU ＜ 0',600,260,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=card(330,320,540,120,label('減った 量 ＝ −ΔU',600,395,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'w1b']:(p)=>card(300,140,600,170,label('重力が した 仕事',600,200,{size:30,color:WC,anchor:'middle',weight:700})+T2(Wt+'=-'+DU,600,265,{size:56}),seg(p,0,.15),UC),
 [K+'w2']:(p)=>{
  let s=card(520,90,600,120,label('② 運動エネルギー から',820,165,{size:32,color:KC,anchor:'middle',weight:700}),seg(p,0,.12),KC);
  s+=dropCol({h:10,trail:1});
  s+=card(520,250,600,170,label('深く学ぶ 1/3：仕事 ＝ K の 増えた 量',820,300,{size:24,color:C.dim,anchor:'middle'})+T2(Wt+'='+DK,820,370,{size:56}),seg(p,.4,.55),KC);
  return s;
 },
 [K+'eq']:(p)=>{
  let s=fade(seg(p,0,.15),T2(Wt+'=-'+DU,360,110,{size:46})+T2(Wt+'='+DK,840,110,{size:46}));
  s+=fade(seg(p,.25,.4),arrow(420,150,560,240,{color:C.hi,w:3,head:12})+arrow(780,150,640,240,{color:C.hi,w:3,head:12}));
  s+=card(390,260,420,130,T2(DK+'=-'+DU,600,330,{size:58}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'move']:(p)=>{
  let s=T2(DK+'=-'+DU,600,100,{size:52});
  s+=fade(seg(p,.1,.25),label('−ΔU を 左辺へ → 符号が 変わる',600,190,{size:28,color:C.hi,anchor:'middle'}));
  s+=card(360,250,480,130,T2(DK+'+'+DU+'=0',600,320,{size:58}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'cons']:(p)=>{
  let s=T2(DK+'+'+DU+'=0',600,90,{size:46});
  s+=fade(seg(p,.15,.3),label('合計の 変化 が 0',600,175,{size:30,color:C.ink,anchor:'middle'}));
  s+=card(330,230,540,140,T2(Kt+'+'+Ut,520,305,{size:60})+label('＝ 一定',720,318,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'name']:(p)=>{
  let s=card(200,90,800,200,label('力学的エネルギー 保存則',600,165,{size:44,color:C.hi,anchor:'middle',weight:700})+T2(Kt+'+'+Ut,540,240,{size:44})+label('＝ 一定',680,252,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=tag('定義 ＋ 法則 から 導いた 結果',600,370,{g:seg(p,.45,.6)});
  return s;
 },
 [K+'cond']:(p)=>{
  let s=card(200,100,800,180,label('条件',600,160,{size:30,color:C.dim,anchor:'middle'})+label('仕事を するのが 重力・ばね の 力 だけ',600,225,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=tag('仮定',600,350,{color:C.dim,g:seg(p,.4,.55)});
  return s;
 },
 [K+'cond2']:(p)=>{
  let s=fade(.4,card(200,60,800,110,label('仕事を するのが 重力・ばね の 力 だけ',600,128,{size:30,color:C.hi,anchor:'middle',weight:700}),1));
  s+=card(150,220,420,150,label('手で 押す',360,280,{size:30,color:C.F,anchor:'middle',weight:700})+label('→ K＋U が 増える',360,335,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.F);
  s+=card(630,220,420,150,label('摩擦',840,280,{size:30,color:C.F,anchor:'middle',weight:700})+label('→ K＋U が 減る',840,335,{size:26,color:C.ink,anchor:'middle'}),seg(p,.35,.5),C.F);
  return s;
 },
 [K+'bar']:(p)=>dropCol({h:20,marks:[[20,'20 m']]})+bars([20],{x0:600})+fade(seg(p,.2,.35),label('濃い 橙 ＝ K、薄い 橙 ＝ U',900,110,{size:26,color:C.ink,anchor:'middle',weight:700})),
 [K+'bar5']:(p)=>{
  const u=seg(p,.05,.4),h=20-5*u*u;
  let s=dropCol({h,trail:1,marks:[[20,'20 m'],[15,'15 m']]});
  s+=bars([20,15],{x0:500,dx:190,g:1,hl:1});
  s+=card(840,90,340,100,tex(Ut+'=1.0\\times 10\\times 15',1010,130,{size:26,auto:false})+tex('=150\\ \\mathrm{J}',1010,170,{size:30,auto:false,color:UC}),seg(p,.4,.55),UC);
  return s;
 },
 [K+'bar5b']:(p)=>{
  let s=dropCol({h:15,trail:1,marks:[[20,'20 m'],[15,'15 m']]});
  s+=bars([20,15],{x0:500,dx:190,hl:1});
  s+=card(840,90,340,100,tex(Kt+'=200-150',1010,130,{size:26,auto:false})+tex('=50\\ \\mathrm{J}',1010,170,{size:30,auto:false,color:KC}),seg(p,0,.15),KC);
  s+=fade(seg(p,.55,.7),label('合計 200 J の まま',1010,250,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bar0']:(p)=>{
  const u=seg(p,.02,.35),h=15-15*u*u;
  let s=dropCol({h,trail:1,marks:[[20,'20 m'],[15,'15 m']]});
  s+=bars([20,15,0],{x0:520,dx:180,hl:2});
  s+=fade(seg(p,.5,.65),label('答え：K ＝ 200 J',1010,140,{size:30,color:KC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 落ちる速さを求める =================
 [K+'e1']:(p)=>{
  let s=label('減った U',360,80,{size:26,color:UC,anchor:'middle',weight:700})+label('増えた K',820,80,{size:26,color:KC,anchor:'middle',weight:700});
  s+=card(250,120,700,140,T2(MG+Ht+'=\\tfrac12 mv^2',600,195,{size:60}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.05,.2),label('静止 から 高さ h 落ちる',600,340,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'e2']:(p)=>{
  let s=T2('{\\color{#ffe28a}m}'+'{\\color{#83ecc0}g}'+Ht+'=\\tfrac12 {\\color{#ffe28a}m}v^2',600,100,{size:52,auto:true});
  s+=fade(seg(p,.1,.25),label('両辺を m で 割る',920,110,{size:26,color:C.hi}));
  s+=card(400,220,400,140,T2(Gt+Ht+'=\\tfrac12 v^2',600,295,{size:58}),seg(p,.4,.55),C.hi);
  s+=fade(seg(p,.6,.75),label('m が 消える',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e3']:(p)=>{
  let s=T2(Gt+Ht+'=\\tfrac12 v^2',600,100,{size:52});
  s+=fade(seg(p,.1,.25),label('両辺を 2倍',900,110,{size:26,color:C.hi}));
  s+=card(400,210,400,140,T2('v^2=2'+Gt+Ht,600,285,{size:58}),seg(p,.35,.5),C.v);
  return s;
 },
 [K+'e4']:(p)=>{
  let s=T2('v^2=2'+Gt+Ht,600,100,{size:52});
  s+=fade(seg(p,.1,.25),label('速さ ＞ 0 → 平方根',920,110,{size:26,color:C.hi}));
  s+=card(380,200,440,150,T2('v=\\sqrt{2'+Gt+Ht+'}',600,280,{size:62}),seg(p,.35,.5),C.v);
  s+=tag('導いた 結果',600,420,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'e5']:(p)=>{
  let s=dropCol({h:0,trail:1});
  s+=card(520,90,620,130,T2('v=\\sqrt{2\\times 10\\times 20}=\\sqrt{400}',830,155,{size:40,auto:false}),seg(p,0,.15),C.v);
  s+=card(620,260,420,110,T2('v=20\\ \\mathrm{m/s}',830,315,{size:50}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'e6']:(p)=>{
  let s=card(120,100,460,240,label('落体の運動 の 回',350,160,{size:28,color:C.dim,anchor:'middle'})+tex('20=\\tfrac12\\times 10\\times t^2',350,220,{size:34})+tex('t=2\\ \\mathrm{s},\\ v='+Gt+'t=20\\ \\mathrm{m/s}',350,285,{size:30}),seg(p,0,.15),C.t);
  s+=card(620,100,460,240,label('エネルギー',850,160,{size:28,color:C.dim,anchor:'middle'})+tex('v=\\sqrt{2'+Gt+Ht+'}=20\\ \\mathrm{m/s}',850,245,{size:36}),seg(p,.3,.45),KC);
  s+=fade(seg(p,.6,.75),label('一致',600,420,{size:44,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'nom']:(p)=>{
  let s=T2('v=\\sqrt{2'+Gt+Ht+'}',600,90,{size:50})+fade(seg(p,.05,.2),label('m が ない',830,100,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),ground(250,950,440)+dot(450,330,30,'#8c97ad')+label('重い 球',450,270,{size:24,color:C.ink,anchor:'middle'})+ball(750,330,{r:14})+label('軽い 球',750,270,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('同じ 速さ',600,400,{size:34,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notime']:(p)=>{
  let s=card(200,110,800,220,label('エネルギーで 考えると',600,180,{size:30,color:C.ink,anchor:'middle'})+label('時間 t を 使わずに 速さ が 分かる',600,255,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 // ================= S4 道の形によらない =================
 [K+'path']:(p)=>{
  const top=110,bot=440;
  let s=ground(80,1120,bot+4)+line(70,top,1130,top,{color:C.faint,w:2,dash:'6 6'})+label('20 m',60,(top+bot)/2,{size:24,color:C.x,anchor:'end'})+line(70,top,70,bot,{color:C.x,w:2});
  s+=fade(seg(p,0,.15),line(200,top,200,bot,{color:C.dim,w:4}));
  s+=fade(seg(p,.15,.3),line(400,top,700,bot,{color:C.dim,w:4}));
  const cv=[];for(let i=0;i<=30;i++){const u=i/30;cv.push([800+300*u,top+(bot-top)*(.5-.5*Math.cos(Math.PI*u))]);}
  s+=fade(seg(p,.3,.45),draw(cv,1,{color:C.dim,w:4}));
  s+=fade(seg(p,.55,.7),[200,700,1100].map(x=>label('20 m/s',x,bot+40,{size:26,color:C.v,anchor:'middle',weight:700})).join(''));
  s+=fade(seg(p,.1,.2),label('摩擦 なし',600,80,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'normal']:(p)=>{
  let s=incline({u:.45,N:seg(p,.05,.25),mv:seg(p,.05,.2),mg:seg(p,.6,.75)});
  s+=card(720,120,440,140,label('垂直抗力 ⊥ 動き',940,180,{size:30,color:C.F,anchor:'middle',weight:700})+T2(Wt+'=0',940,235,{size:42}),seg(p,.3,.45),C.F);
  s+=card(720,300,440,100,label('仕事を するのは 重力 だけ',940,360,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'drop']:(p)=>card(200,130,800,200,label('速さ は 道の 形 に よらない',600,200,{size:36,color:C.ink,anchor:'middle',weight:700})+label('落差 だけで 決まる',600,270,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi),
 [K+'coaster']:(p)=>coaster({at:150,marks:seg(p,.2,.4)})+fade(seg(p,.4,.55),label('静かに 出発（摩擦 なし）',360,90,{size:26,color:C.ink,weight:700})),
 [K+'c1']:(p)=>{
  const x=150+410*seg(p,.02,.4);
  let s=coaster({at:x,marks:1});
  s+=card(640,70,520,130,tex('v^2=2\\times 10\\times 45=900',900,120,{size:34,auto:false})+tex('v=30\\ \\mathrm{m/s}',900,175,{size:38,auto:false,color:C.v}),seg(p,.35,.5),C.v);
  s+=fade(seg(p,.4,.55),label('最下点',560,CB+34,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c2']:(p)=>{
  const x=560+300*seg(p,.02,.4);
  let s=coaster({at:x,marks:1});
  s+=fade(.5,label('最下点 30 m/s',560,CB+34,{size:22,color:C.v,anchor:'middle'}));
  s+=card(640,40,520,120,label('落差 45 − 25 ＝ 20 m',900,90,{size:28,color:C.x,anchor:'middle',weight:700})+tex('v=20\\ \\mathrm{m/s}',900,138,{size:36,auto:false,color:C.v}),seg(p,.35,.5),C.v);
  return s;
 },
 [K+'c3']:(p)=>{
  let s=coaster({at:560,marks:1});
  s+=fade(seg(p,.05,.2),ring(560,CB-20,40,{color:C.hi,w:3}));
  s+=card(620,40,540,130,label('U が 最小 の 所',890,95,{size:28,color:UC,anchor:'middle',weight:700})+label('→ K・速さ が 最大',890,145,{size:30,color:KC,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ================= S5 摩擦があると =================
 [K+'fric']:(p)=>{
  const x=300+300*seg(p,.02,.6);
  let s=ground(100,1000,400)+rect(100,400,900,10,{fill:'#7a6a50',fo:.6,stroke:'none',rx:0});
  s+=box(x,400,{w:110,h:80})+VA(x+70,330,x+150,330)+FA(x-20,388,x-140,388,{text:'摩擦',size:24,dy:-14,w:8});
  s+=card(700,110,440,130,label('動き と 逆向き',920,160,{size:28,color:C.ink,anchor:'middle'})+T2(Wt+'<0',920,212,{size:42}),seg(p,.35,.5),WC);
  return s;
 },
 [K+'fric2']:(p)=>{
  const base=430,k=1.2;
  let s=line(250,base,950,base,{color:C.dim,w:3});
  s+=stack(400,base,150,50,{k,title:'はじめ'});
  s+=fade(seg(p,.05,.25),stack(700,base,50,90,{k,title:'あと',total:0}));
  s+=fade(seg(p,.05,.25),line(630,base-200*k,770,base-200*k,{color:C.hi,w:2,dash:'6 6'})+label('減った',840,base-170*k,{size:26,color:C.a,weight:700}));
  s+=card(800,90,360,110,label('消えた？',980,160,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'heat']:(p)=>{
  let s=ground(100,1000,400)+rect(100,400,900,10,{fill:'#7a6a50',fo:.6,stroke:'none',rx:0})+box(600,400,{w:110,h:80});
  const g=seg(p,.05,.3);
  for(let i=0;i<4;i++){const x=520+i*55;const pts=[];for(let k=0;k<=12;k++)pts.push([x+8*Math.sin(k*1.1),390-k*10]);s+=fade(g*.9,draw(pts,1,{color:WC,w:3}));}
  s+=fade(g,label('少し 温まる',600,220,{size:28,color:WC,anchor:'middle',weight:700}));
  s+=card(760,100,400,150,label('減った K＋U',960,160,{size:28,color:C.ink,anchor:'middle'})+label('→ 内部エネルギー（熱）',960,215,{size:28,color:WC,anchor:'middle',weight:700}),seg(p,.45,.6),WC);
  return s;
 },
 [K+'heat2']:(p)=>card(200,120,800,210,label('熱 まで 含めれば',600,190,{size:32,color:C.ink,anchor:'middle'})+label('エネルギーは 減っていない',600,265,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi)+fade(seg(p,.55,.7),label('熱の 分野で くわしく',600,410,{size:28,color:C.dim,anchor:'middle'})),
 [K+'bank']:(p)=>{
  let s=card(180,140,300,200,label('口座 U',330,200,{size:30,color:UC,anchor:'middle',weight:700})+label('位置エネルギー',330,260,{size:24,color:C.ink,anchor:'middle'}),seg(p,0,.12),UC);
  s+=card(720,140,300,200,label('口座 K',870,200,{size:30,color:KC,anchor:'middle',weight:700})+label('運動エネルギー',870,260,{size:24,color:C.ink,anchor:'middle'}),seg(p,0,.12),KC);
  s+=fade(seg(p,.4,.55),arrow(500,220,700,220,{color:C.hi,w:5,head:18})+arrow(700,280,500,280,{color:C.hi,w:5,head:18})+label('重力：移しかえる だけ',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bank2']:(p)=>{
  let s=card(150,90,420,220,label('お金',360,150,{size:30,color:C.dim,anchor:'middle',weight:700})+label('自由に 出し入れ',360,220,{size:30,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=card(630,90,420,220,label('K＋U が 一定',840,150,{size:30,color:C.hi,anchor:'middle',weight:700})+label('重力・ばね だけが',840,210,{size:26,color:C.ink,anchor:'middle'})+label('仕事を する とき',840,255,{size:26,color:C.ink,anchor:'middle'}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.6,.75),label('たとえと 違う 点',600,390,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  const u=seg(p,.05,.7),h=20-20*u*u;
  let s=dropCol({h,trail:1});
  s+=stack(700,440,10*h,200-10*h);
  s+=card(820,120,350,150,label('U が 減った 分',995,175,{size:26,color:UC,anchor:'middle',weight:700})+label('K が 増える',995,225,{size:28,color:KC,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=dropCol({h:0,trail:1})+stack(700,440,0,200);
  s+=card(820,120,350,170,tex(Kt+'=200\\ \\mathrm{J}',995,175,{size:38,auto:false})+tex('v=20\\ \\mathrm{m/s}',995,240,{size:38,auto:false,color:C.v}),seg(p,0,.15),KC);
  return s;
 },
 [K+'next']:(p)=>{
  let s=ground(80,1120,430);
  s+=fade(seg(p,0,.15),rect(150,280,260,130,{fill:'#6f8db0',fo:.7,stroke:'none',rx:10})+rect(410,320,90,90,{fill:'#6f8db0',fo:.9,stroke:'none',rx:8})+ring(220,415,20,{color:C.dim,w:4,fill:C.bg})+ring(440,415,20,{color:C.dim,w:4,fill:C.bg})+label('トラック',325,260,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.3),ring(760,400,28,{color:C.dim,w:4})+ring(900,400,28,{color:C.dim,w:4})+line(760,400,830,350,{color:C.dim,w:4})+line(830,350,900,400,{color:C.dim,w:4})+label('自転車',830,300,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),VA(510,240,610,240)+VA(930,340,1030,340)+label('同じ 速さ',600,160,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('止めにくさ が 違う',600,110,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(250,120,700,200,label('この「勢い」は',600,190,{size:32,color:C.ink,anchor:'middle'})+label('エネルギー とは 別の 量？',600,265,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の単元',600,175,{size:28,color:C.dim,anchor:'middle'})+label('運動量と力積',600,260,{size:56,color:C.p,anchor:'middle',weight:700})+label('「勢い」を 量に する',600,315,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('運動量と力積・深く学ぶ 1/2 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
