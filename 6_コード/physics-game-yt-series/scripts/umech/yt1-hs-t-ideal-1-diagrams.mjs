// 高校編「状態方程式・深く学ぶ 1/3」(ys-hs-t-ideal-1) — 図。Stage 1200×515.
// 色（構成表の案・気体の法則と同じ）：圧力 P 緑、体積 V 水色、絶対温度 T 黄緑、物質量 n・個数 N・R は白、強調 黄。
// 2/3・3/3・要点でも使う部品は export する（気体の箱・式の一歩は気体の法則 1/2 の部品を読み込む）。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,clamp,mix} from './anim.mjs';
import {card,tag,T2,FA,TC,QC,Tt,sceneT,thermo} from './yt1-hs-t-heat-1-diagrams.mjs';
import {gasBox,hitCount,step,PC,VC,Pt,Vt,MOL} from './yt1-hs-t-gas-1-diagrams.mjs';
export {card,tag,T2,FA,TC,QC,Tt,sceneT,thermo,gasBox,hitCount,step,PC,VC,Pt,Vt,MOL};

const K='hs-t-ideal-1:';
const lt=(p,ctx)=>ctx&&typeof ctx.t==='number'?ctx.t:p*8; // time since this cue started
export const PVT=`\\dfrac{${Pt}${Vt}}{${Tt}}`;
export const IDEAL=`${Pt}${Vt}=nR${Tt}`;
export const NA='N_{\\mathrm{A}}';
export const RV='8.3\\ \\mathrm{J/(mol\\cdot K)}';
const M=(s)=>`\\mathrm{${s}}`;
// question card (two lines)
export const Q2=(a,b,o={})=>card(200,130,800,210,label(a,600,200,{size:34,color:C.ink,anchor:'middle'})+label(b,600,280,{size:44,color:C.hi,anchor:'middle',weight:700}),o.g??1,C.hi);
// "PV/T ＝ 一定" (TeX + Japanese label side by side)
export const pvtConst=(x,y,{size=56,g=1}={})=>fade(g,T2(`${PVT}=`,x-40,y,{size,anchor:'end'})+label('一定',x-20,y+size*.35,{size:size*.8,color:C.hi,weight:700}));
// a 10 cm cube (1 L) drawn in oblique projection
function cube(x,y,s,{color=VC,fo=.15,d=.45}={}){
 const o=s*d;
 return `<polygon points="${x},${y} ${x+s},${y} ${x+s+o},${y-o} ${x+o},${y-o}" fill="${color}" fill-opacity="${fo*1.4}" stroke="${color}" stroke-width="2"/>`
  +`<polygon points="${x+s},${y} ${x+s+o},${y-o} ${x+s+o},${y+s-o} ${x+s},${y+s}" fill="${color}" fill-opacity="${fo*.8}" stroke="${color}" stroke-width="2"/>`
  +rect(x,y,s,s,{fill:color,fo,stroke:color,sw:2,rx:0});
}
// a kerosene-tank-like container
function tank(x,y,{g=1}={}){
 let s=rect(x,y,190,250,{fill:'#c84b4b',fo:.55,stroke:'#ff9a8a',sw:3,rx:16});
 s+=rect(x+20,y-28,70,30,{fill:'#c84b4b',fo:.55,stroke:'#ff9a8a',sw:3,rx:8})+rect(x+120,y-20,40,22,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:4});
 s+=label('約 25 L',x+95,y+140,{size:30,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// pencil
const pencil=(x,y)=>rect(x,y,16,120,{fill:'#ffcf67',fo:.8,stroke:'#ffe6a8',sw:1.5,rx:3})+`<polygon points="${x},${y+120} ${x+16},${y+120} ${x+8},${y+140}" fill="#e9c7a6"/>`;
// three (P,V,T) states with PV/T = 1000
const ST=[['1.0\\times10^{5}','3.0','300'],['1.0\\times10^{5}','4.0','400'],['2.0\\times10^{5}','2.0','400']];
function stateTable(p,{g=1,y=70}={}){
 let s=fade(g,label('圧力 P [Pa]',300,y,{size:26,color:PC,anchor:'middle',weight:700})+label('体積 V [L]',560,y,{size:26,color:VC,anchor:'middle',weight:700})+label('温度 T [K]',780,y,{size:26,color:TC,anchor:'middle',weight:700})+label('PV/T',1000,y,{size:26,color:C.hi,anchor:'middle',weight:700}));
 ST.forEach(([P,V,T],i)=>{const yy=y+70+i*70,a=g*seg(p,.1+.2*i,.25+.2*i);
  s+=fade(a,T2(P,300,yy,{size:36,auto:false,color:PC})+T2(V,560,yy,{size:36,auto:false,color:VC})+T2(T,780,yy,{size:36,auto:false,color:TC})+T2('1000',1000,yy,{size:36,auto:false,color:C.hi}));});
 s+=fade(g,line(170,y+22,1100,y+22,{color:C.faint,w:2}));
 return s;
}

export const hsTIdeal1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.45,gasBox({x:330,y:60,w:540,h:300,n:22,dist:220*t,seed:2,hit:1}));
  s+=card(300,370,600,130,pvtConst(640,452,{size:52}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.3,gasBox({x:330,y:60,w:540,h:300,n:22,dist:220*t,seed:2,hit:1}));
  s+=Q2('その 一定の 値は','何で 決まる？',{g:seg(p,.05,.25)});
  return s;
 },
 [K+'ex']:(p)=>{
  let s=label('圧力 P [Pa]',300,70,{size:26,color:PC,anchor:'middle',weight:700})+label('体積 V [L]',560,70,{size:26,color:VC,anchor:'middle',weight:700})+label('温度 T [K]',780,70,{size:26,color:TC,anchor:'middle',weight:700})+label('PV/T',1000,70,{size:26,color:C.hi,anchor:'middle',weight:700})+line(170,92,1100,92,{color:C.faint,w:2});
  s+=fade(seg(p,.05,.2),T2(ST[0][0],300,140,{size:36,auto:false,color:PC})+T2(ST[0][1],560,140,{size:36,auto:false,color:VC})+T2(ST[0][2],780,140,{size:36,auto:false,color:TC}));
  s+=card(150,250,900,170,T2(`${PVT}=\\dfrac{1.0\\times10^{5}\\times3.0}{300}=1000\\ \\mathrm{Pa\\cdot L/K}`,600,345,{size:42}),seg(p,.4,.6),C.hi);
  s+=fade(seg(p,.65,.8),T2('1000',1000,140,{size:36,auto:false,color:C.hi}));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=stateTable(p,{g:1});
  s+=card(250,330,700,120,label('同じ 気体なら ずっと 1000',600,402,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'guess']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('分子 12 個',330,60,{size:28,color:C.ink,anchor:'middle',weight:700})+gasBox({x:150,y:80,w:360,h:260,n:12,dist:200*t,seed:6});
  s+=fade(seg(p,.1,.3),label('分子 24 個',870,60,{size:28,color:C.hi,anchor:'middle',weight:700})+gasBox({x:690,y:80,w:360,h:260,n:24,dist:200*t,seed:6}));
  s+=fade(seg(p,.05,.2),label('体積・温度は 同じ',600,390,{size:28,color:C.dim,anchor:'middle',weight:700}));
  s+=card(350,420,500,80,label('圧力は 何倍？',600,472,{size:36,color:PC,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'guess2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('分子 12 個',330,60,{size:28,color:C.ink,anchor:'middle',weight:700})+gasBox({x:150,y:80,w:360,h:260,n:12,dist:200*t,seed:6});
  s+=label('分子 24 個',870,60,{size:28,color:C.hi,anchor:'middle',weight:700})+gasBox({x:690,y:80,w:360,h:260,n:24,dist:200*t,seed:6});
  s+=label('体積・温度は 同じ',600,390,{size:28,color:C.dim,anchor:'middle',weight:700});
  s+=card(350,420,500,80,label('圧力は 何倍？',600,472,{size:36,color:PC,anchor:'middle',weight:700}),1,C.hi);
  return s;
 },
 // ================= S2 分子2倍で圧力2倍 =================
 [K+'box2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('分子 12 個',330,60,{size:28,color:C.ink,anchor:'middle',weight:700})+gasBox({x:150,y:80,w:360,h:260,n:12,dist:200*t,seed:6});
  s+=label('分子 24 個',870,60,{size:28,color:C.hi,anchor:'middle',weight:700})+gasBox({x:690,y:80,w:360,h:260,n:24,dist:200*t,seed:6});
  s+=fade(seg(p,.35,.5),thermo(570,120,320,90)+thermo(630,120,320,90));
  s+=card(250,390,700,100,label('同じ 温度 → 運動の 激しさも 同じ',600,452,{size:32,color:TC,anchor:'middle',weight:700}),seg(p,.45,.65),TC);
  return s;
 },
 [K+'hits']:(p,ctx)=>{
  const t=sceneT(p,ctx),c=lt(p,ctx),t0=t-c;
  let s=gasBox({x:150,y:80,w:360,h:260,n:12,dist:200*t,seed:6,hit:1,wallR:C.dim});
  s+=gasBox({x:690,y:80,w:360,h:260,n:24,dist:200*t,seed:6,hit:1,wallR:C.dim});
  const a=hitCount({w:360,n:12,seed:6,d0:200*t0,d1:200*t}),b=hitCount({w:360,n:24,seed:6,d0:200*t0,d1:200*t});
  s+=fade(seg(p,.02,.12),label('右の 壁に 当たった 回数',600,45,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.2),label(`${a} 回`,330,400,{size:36,color:C.hi,anchor:'middle',weight:700})+label(`${b} 回`,870,400,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('約 2倍',600,470,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.35,gasBox({x:150,y:80,w:360,h:260,n:12,dist:200*t,seed:6,hit:1})+gasBox({x:690,y:80,w:360,h:260,n:24,dist:200*t,seed:6,hit:1}));
  s+=card(160,120,880,250,label('1回に 押す 強さ：同じ',600,185,{size:32,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.2,.35),label('当たる 回数：2倍',600,245,{size:32,color:C.ink,anchor:'middle',weight:700}))+fade(seg(p,.5,.65),label('→ 圧力 2倍',600,325,{size:44,color:PC,anchor:'middle',weight:700})),seg(p,.02,.15),PC);
  return s;
 },
 [K+'ptn']:(p)=>{
  let s=card(300,90,600,190,T2(`${Pt}\\propto N`,600,190,{size:72}),seg(p,.05,.25),PC);
  s+=fade(seg(p,.3,.45),label('N：分子の 数',600,340,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('体積・温度が 同じ とき',600,420,{color:C.dim,g:seg(p,.5,.65),size:26});
  return s;
 },
 [K+'pvt']:(p)=>{
  let s=fade(.55,T2(`${Pt}\\propto N`,600,70,{size:40}));
  s+=fade(seg(p,.05,.2),label('V・T は 同じ',600,140,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(300,170,600,190,T2(`${PVT}\\propto N`,600,283,{size:66}),seg(p,.15,.35),C.hi);
  s+=fade(seg(p,.6,.75),label('一定の 値を 決めるのは 分子の 数',600,430,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'exp']:(p)=>{
  let s=card(300,90,600,190,T2(`${PVT}\\propto N`,600,203,{size:66}),1,C.hi);
  s+=tag('分子の 絵から 導いた 結果',600,350,{g:seg(p,.05,.2),size:28});
  s+=tag('実験でも 確かめられている',600,430,{color:C.F,g:seg(p,.5,.65),size:28});
  return s;
 },
 // ================= S3 モルで数える =================
 [K+'many']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:80,y:40,w:1040,h:330,n:Math.round(mix(20,160,seg(p,.05,.5))),dist:120*t,seed:9,r:5,frame:false});
  s+=card(300,390,600,100,label('数え きれない ほど 多い',600,452,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'dozen']:(p)=>{
  let s='';for(let i=0;i<12;i++)s+=fade(seg(p,.02+.03*i,.06+.03*i),pencil(150+i*30,140));
  s+=fade(seg(p,.4,.55),rect(130,120,380,190,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:16}));
  s+=fade(seg(p,.45,.6),label('12 本',320,360,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),arrow(560,215,700,215,{color:C.hi,w:5,head:16}));
  s+=card(730,150,360,130,label('1 ダース',910,232,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'mol']:(p)=>{
  let s=card(120,70,480,150,T2('6.0\\times10^{23}',290,145,{size:46,auto:false})+label('個',450,160,{size:34,color:C.ink,weight:700}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.2,.35),arrow(620,145,730,145,{color:C.hi,w:5,head:16}));
  s+=card(760,70,320,150,T2('1\\ \\mathrm{mol}',920,145,{size:56,auto:false,color:C.hi}),seg(p,.25,.4),C.hi);
  s+=card(200,280,800,170,label('アボガドロ定数',600,335,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${NA}=6.0\\times10^{23}\\ /\\mathrm{mol}`,600,405,{size:48,auto:false}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'dozenmap']:(p)=>{
  let s=card(100,60,480,200,label('対応する',340,115,{size:30,color:C.F,anchor:'middle',weight:700})+label('まとめて 数える 単位',340,190,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  s+=card(620,60,480,200,label('対応しない',860,115,{size:30,color:C.a,anchor:'middle',weight:700})+label('1 mol の 質量',860,190,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  s+=fade(seg(p,.6,.75),label('ヘリウム 1 mol：約 4.0 g',860,330,{size:28,color:C.ink,anchor:'middle'})+label('酸素 1 mol：約 32 g',860,385,{size:28,color:C.ink,anchor:'middle'})+label('物質ごとに 違う',860,450,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n']:(p)=>{
  let s=card(300,70,600,200,T2(`n=\\dfrac{N}{${NA}}`,600,192,{size:68,auto:false}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.25,.4),label('物質量 n [mol]',600,330,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('分子の 数 N を アボガドロ定数で 割る',600,385,{size:28,color:C.dim,anchor:'middle'}));
  s+=tag('定義',600,460,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'nN']:(p)=>{
  let s=card(120,70,440,170,T2('N',220,155,{size:70,auto:false})+label('個数',400,175,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(640,70,440,170,T2('n',740,150,{size:70,auto:false})+label('物質量（mol）',920,175,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.15,.3),C.dim);
  s+=card(250,300,700,130,label('× n は 分子 1個の 質量',600,380,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.55,.7),C.a);
  return s;
 },
 [K+'ex12']:(p)=>{
  let s=fade(.6,T2(`n=\\dfrac{N}{${NA}}`,600,90,{size:44,auto:false}));
  s+=card(120,170,960,150,T2('n=\\dfrac{1.2\\times10^{24}}{6.0\\times10^{23}}=2.0\\ \\mathrm{mol}',600,262,{size:50,auto:false}),seg(p,.1,.3),C.hi);
  s+=fade(seg(p,.6,.75),label('10²⁴ ÷ 10²³ ＝ 10',600,400,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S4 PV＝nRT =================
 [K+'prop']:(p)=>{
  let s=fade(.55,T2(`${PVT}\\propto N`,330,110,{size:44}));
  s+=fade(seg(p,.1,.25),label('N ＝ n × アボガドロ定数',330,230,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),arrow(560,110,680,110,{color:C.hi,w:5,head:16}));
  s+=card(700,40,420,150,T2(`${PVT}\\propto n`,910,128,{size:52}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'R']:(p)=>{
  let s=card(300,50,600,170,T2(`${PVT}=nR`,600,155,{size:64}),seg(p,.05,.25),C.hi);
  s+=card(250,270,700,170,label('気体定数',600,320,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`R\\approx ${RV}`,600,390,{size:50,auto:false}),seg(p,.45,.65),C.dim);
  return s;
 },
 [K+'Rexp']:(p)=>{
  let s=card(250,50,700,170,label('気体定数',600,100,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`R\\approx ${RV}`,600,170,{size:50,auto:false}),1,C.dim);
  s+=tag('実験で 測った 値',600,290,{color:C.F,g:seg(p,.05,.2),size:28});
  s+=fade(seg(p,.45,.6),label('薄い 気体なら 種類に よらず 同じ',600,390,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mulT']:(p)=>{
  let s=step(p,`${PVT}=nR`,IDEAL,'両辺 × T',{size:66,col:TC});
  s+=fade(seg(p,.6,.75),label('理想気体の 状態方程式',600,490,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ideal']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.4,gasBox({x:80,y:60,w:400,h:380,n:16,dist:200*t,seed:3,r:6}));
  s+=card(540,60,600,380,label('理想気体（モデル）',840,120,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('・分子の 大きさを 無視',590,210,{size:30,color:C.ink,weight:700}))
   +fade(seg(p,.45,.6),label('・分子どうしが 引き合う',590,280,{size:30,color:C.ink,weight:700})+label('力を 無視',620,330,{size:30,color:C.ink,weight:700})),seg(p,.05,.2),C.hi);
  s+=tag('仮定',840,400,{color:C.dim,g:seg(p,.6,.75),size:26});
  return s;
 },
 [K+'real']:(p)=>{
  let s=card(200,70,800,150,T2(IDEAL,600,150,{size:62}),1,C.hi);
  s+=card(200,280,800,150,label('実際の 気体も',600,335,{size:30,color:C.ink,anchor:'middle',weight:700})+label('薄ければ よく 従う',600,395,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,.1,.3),C.F);
  return s;
 },
 [K+'boyle']:(p)=>{
  const k=p>.1?1:0;
  let s=fade(1-k,T2(IDEAL,600,90,{size:62}))+fade(k,T2(`${Pt}${Vt}=\\boxed{n}R\\boxed{${Tt}}`,600,90,{size:62,auto:false}));
  s+=fade(seg(p,.1,.25),label('n・T を 固定',830,180,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),arrow(600,200,600,260,{color:C.hi,w:4,head:14}));
  s+=card(300,280,600,110,T2(`${Pt}${Vt}=`,520,340,{size:52,anchor:'end'})+label('一定',540,358,{size:44,color:C.hi,weight:700}),seg(p,.35,.5),PC);
  s+=fade(seg(p,.6,.75),label('ボイルの 法則',600,450,{size:34,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'charles']:(p)=>{
  const k=p>.1?1:0;
  let s=fade(1-k,T2(IDEAL,600,90,{size:62}))+fade(k,T2(`\\boxed{${Pt}}${Vt}=\\boxed{n}R${Tt}`,600,90,{size:62,auto:false}));
  s+=fade(seg(p,.1,.25),label('n・P を 固定',830,180,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),arrow(600,200,600,250,{color:C.hi,w:4,head:14}));
  s+=card(300,265,600,140,T2(`\\dfrac{${Vt}}{${Tt}}=\\dfrac{nR}{${Pt}}`,600,352,{size:52}),seg(p,.35,.5),VC);
  s+=fade(seg(p,.6,.75),label('一定 → シャルルの 法則',600,460,{size:34,color:VC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'combine']:(p)=>{
  let s=card(80,70,300,120,label('ボイル',230,145,{size:34,color:PC,anchor:'middle',weight:700}),seg(p,.02,.15),PC);
  s+=card(450,70,300,120,label('シャルル',600,145,{size:34,color:VC,anchor:'middle',weight:700}),seg(p,.1,.25),VC);
  s+=card(820,70,300,120,label('分子の 数',970,145,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.2,.35),C.dim);
  for(const x of [230,600,970])s+=fade(seg(p,.4,.55),arrow(x,200,mix(x,600,.6),300,{color:C.hi,w:4,head:14}));
  s+=card(300,320,600,140,T2(IDEAL,600,395,{size:62}),seg(p,.5,.7),C.hi);
  return s;
 },
 // ================= S5 単位と数値例 =================
 [K+'unitL']:(p)=>{
  let s=T2(IDEAL,600,80,{size:56});
  s+=fade(seg(p,.05,.2),rect(440,30,110,80,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8}));
  s+=fade(seg(p,.2,.35),arrow(495,120,495,190,{color:C.hi,w:4,head:14}));
  s+=card(250,210,500,130,T2('\\mathrm{Pa}\\times\\mathrm{m^3}',500,280,{size:52,auto:false}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.5,.65),label('圧力 × 体積',500,400,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'unitL2']:(p)=>{
  const k=p>.45?1:0;
  let s=fade(.6,T2('\\mathrm{Pa}\\times\\mathrm{m^3}',600,70,{size:40,auto:false}));
  s+=fade(seg(p,.05,.2),label('1 Pa ＝ 1 N/m²',600,140,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(200,165,800,165,fade(1-k,T2('\\dfrac{\\mathrm{N}}{\\mathrm{m^2}}\\times\\mathrm{m^3}',600,272,{size:46,auto:false}))+fade(k,T2('\\dfrac{\\mathrm{N}}{\\color{#ff8f9b}\\cancel{\\color{#edf4ff}\\mathrm{m^2}}}\\times{\\color{#ff8f9b}\\cancel{\\color{#edf4ff}\\mathrm{m^2}}}\\cdot\\mathrm{m}',600,272,{size:46,auto:false})),seg(p,.15,.3),C.hi);
  s+=card(300,360,600,110,T2('=\\mathrm{N\\cdot m}=\\mathrm{J}',600,415,{size:52,auto:false,color:QC}),seg(p,.65,.8),QC);
  return s;
 },
 [K+'unitR']:(p)=>{
  const k=seg(p,.35,.5);
  let s=fade(.6,T2(IDEAL,600,70,{size:40}));
  s+=card(150,125,900,175,fade(1-k,T2('\\mathrm{mol}\\times\\dfrac{\\mathrm{J}}{\\mathrm{mol\\cdot K}}\\times\\mathrm{K}',600,232,{size:50,auto:false}))+fade(k,T2('{\\color{#ff8f9b}\\cancel{\\color{#edf4ff}\\mathrm{mol}}}\\times\\dfrac{\\mathrm{J}}{{\\color{#ff8f9b}\\cancel{\\color{#edf4ff}\\mathrm{mol}}}\\cdot{\\color{#ff8f9b}\\cancel{\\color{#edf4ff}\\mathrm{K}}}}\\times{\\color{#ff8f9b}\\cancel{\\color{#edf4ff}\\mathrm{K}}}',600,232,{size:50,auto:false})),seg(p,.05,.2),C.hi);
  s+=card(350,330,500,120,T2('=\\mathrm{J}',600,395,{size:56,auto:false,color:QC}),seg(p,.55,.7),QC);
  s+=fade(seg(p,.75,.9),label('両辺とも J',960,395,{size:30,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m3']:(p)=>{
  let s=fade(seg(p,.02,.2),cube(170,170,200,{})+label('10 cm',270,410,{size:26,color:C.ink,anchor:'middle',weight:700})+label('1 L',270,280,{size:40,color:VC,anchor:'middle',weight:700}));
  s+=card(560,120,560,140,T2('1\\ \\mathrm{L}=0.001\\ \\mathrm{m^3}',840,190,{size:50,auto:false}),seg(p,.3,.5),VC);
  s+=fade(seg(p,.6,.75),label('（1 m³ ＝ 1000 L）',840,320,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ex25']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:120,y:90,w:380,h:300,n:18,dist:200*t,seed:11});
  s+=fade(seg(p,.05,.2),label('V ＝ 25 L',310,440,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=card(600,80,500,240,T2('n=1.0\\ \\mathrm{mol}',850,140,{size:42,auto:false})+fade(seg(p,.2,.35),T2(`${Tt}=300\\ \\mathrm{K}`,850,205,{size:42,auto:false}))+fade(seg(p,.2,.35),label('（27℃）',1040,215,{size:24,color:C.dim,anchor:'middle'}))+fade(seg(p,.55,.7),T2(`${Pt}=\\ ?`,850,275,{size:46,auto:false})),seg(p,.05,.2),C.dim);
  return s;
 },
 [K+'tank']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:120,y:90,w:380,h:300,n:18,dist:200*t,seed:11});
  s+=label('V ＝ 25 L',310,440,{size:30,color:VC,anchor:'middle',weight:700});
  s+=tank(800,160,{g:seg(p,.1,.3)});
  s+=fade(seg(p,.35,.5),label('灯油タンク 1個分 くらい',895,470,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'solve']:(p)=>{
  let s=step(p,IDEAL,`${Pt}=\\dfrac{nR${Tt}}{${Vt}}`,'両辺 ÷ V',{size:56,col:VC});
  return s;
 },
 [K+'sub']:(p)=>{
  let s=fade(.6,T2(`${Pt}=\\dfrac{nR${Tt}}{${Vt}}`,600,80,{size:40}));
  s+=fade(seg(p,.05,.2),label('T ＝ 300 K',360,190,{size:34,color:TC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('V ＝ 25 L ＝ 0.025 m³',800,190,{size:34,color:VC,anchor:'middle',weight:700}));
  s+=card(150,260,900,160,T2(`${Pt}=\\dfrac{1.0\\times8.3\\times300}{0.025}`,600,352,{size:52}),seg(p,.55,.75),PC);
  return s;
 },
 [K+'calc']:(p)=>{
  let s=fade(.6,T2(`${Pt}=\\dfrac{1.0\\times8.3\\times300}{0.025}`,600,80,{size:40}));
  s+=card(200,170,800,120,T2(`${Pt}=\\dfrac{2490}{0.025}`,600,242,{size:48}),seg(p,.05,.25),C.dim);
  s+=card(250,330,700,120,T2(`${Pt}=99600\\ \\mathrm{Pa}`,600,390,{size:54}),seg(p,.5,.7),PC);
  return s;
 },
 [K+'atm']:(p)=>{
  let s=card(200,60,800,150,T2(`${Pt}\\approx 1.0\\times10^{5}\\ \\mathrm{Pa}`,600,135,{size:58}),seg(p,.02,.2),PC);
  s+=fade(seg(p,.25,.4),label('≈ 大気圧',600,270,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=card(170,320,860,150,label('1.0 mol・300 K・25 L・約 1.0 × 10⁵ Pa',600,380,{size:32,color:C.ink,anchor:'middle',weight:700})+label('次の 単元でも 使う 気体',600,435,{size:28,color:C.dim,anchor:'middle'}),seg(p,.55,.7),C.dim);
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(150,60,900,150,T2(`${Pt}=\\dfrac{2490}{25}=99.6\\ \\mathrm{Pa}`,600,148,{size:50}),seg(p,.05,.25),C.a);
  s+=fade(seg(p,.1,.25),label('×',110,150,{size:60,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('体積を L の まま 入れた',600,270,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=card(300,320,600,110,label('1000倍 ずれる',600,390,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=fade(.6,pvtConst(640,80,{size:40}));
  s+=card(80,140,1040,140,T2('1000\\ \\mathrm{Pa\\cdot L/K}=1000\\times0.001\\ \\mathrm{Pa\\cdot m^3/K}',600,210,{size:42,auto:false}),seg(p,.15,.35),C.dim);
  s+=card(350,320,500,120,T2('=1.0\\ \\mathrm{J/K}',600,380,{size:54,auto:false,color:C.hi}),seg(p,.6,.8),C.hi);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=fade(.6,T2(`${PVT}=nR`,600,85,{size:44}));
  s+=card(150,160,900,140,T2('n=\\dfrac{1.0}{8.3}\\approx0.12\\ \\mathrm{mol}',600,242,{size:52,auto:false}),seg(p,.05,.25),C.hi);
  s+=card(200,340,800,110,label('一定の 値 ＝ 物質量 n × R',600,408,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:330,y:50,w:540,h:300,n:18,dist:220*t,seed:2,hit:1,wallR:C.dim});
  s+=card(250,380,700,100,label('分子が 壁を 叩く → 圧力',600,442,{size:34,color:PC,anchor:'middle',weight:700}),seg(p,.1,.3),PC);
  return s;
 },
 [K+'next2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.3,gasBox({x:330,y:50,w:540,h:300,n:18,dist:220*t,seed:2,hit:1}));
  s+=Q2('分子 1個の 質量と 速さから','圧力を 計算 できる？',{g:seg(p,.05,.25)});
  return s;
 },
 [K+'bye']:(p)=>card(200,170,800,150,label('次の 動画：衝突から 圧力を 組み立てる',600,260,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
