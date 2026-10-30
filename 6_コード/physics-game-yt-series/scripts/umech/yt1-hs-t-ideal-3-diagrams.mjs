// 高校編「状態方程式・深く学ぶ 3/3」(ys-hs-t-ideal-3) — 図。Stage 1200×515.
// 色：圧力 P 緑、体積 V 水色、絶対温度 T 黄緑、速度 v 紫、運動エネルギー（½mv²）濃い橙、内部エネルギー U 薄い橙、強調 黄。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,texWidth,clamp,mix} from './anim.mjs';
import {card,tag,T2,TC,sceneT,gasBox,step,PC,VC,Pt,Vt,MOL,Q2,IDEAL,NA,thermo} from './yt1-hs-t-ideal-1-diagrams.mjs';
import {T3,VV,AV2,PVK,stepX} from './yt1-hs-t-ideal-2-diagrams.mjs';
import {KC,UC} from './yt1-hs-m-energy-1-diagrams.mjs';

const K='hs-t-ideal-3:';
const Ut=`{\\color{${UC}}U}`;
const TT=`{\\color{${TC}}T}`;
const PV=`{\\color{${PC}}P}{\\color{${VC}}V}`;
const IDL=`${PV}=nR${TT}`;
const E3=`\\dfrac{1}{3}Nm${AV2}=nR${TT}`;
const E12=`\\dfrac{1}{2}Nm${AV2}=\\dfrac{3}{2}nR${TT}`;
const E1n=`\\dfrac{1}{2}m${AV2}=\\dfrac{3}{2}\\cdot\\dfrac{n}{N}R${TT}`;
const KE=`{\\color{${KC}}\\dfrac{1}{2}m${AV2}}`;
const E1=`${KE}=\\dfrac{3}{2}\\cdot\\dfrac{R}{${NA}}${TT}`;
const VMS=`${AV2}=\\dfrac{3R${TT}}{M}`;
const UF=`${Ut}=\\dfrac{3}{2}nR${TT}`;
const big=(src,y,g,col,size=58,h=150)=>card(150,y,900,h,T3(src,600,y+h/2+14,{size}),g,col);
const twoEq=(g1=1,g2=1)=>card(150,40,900,140,T3(PVK,600,124,{size:54}),g1,C.dim)+card(150,230,900,140,T3(IDL,600,314,{size:54}),g2,C.dim);
// simple bar for energy amounts
function ebar(x,y,w,h,col,text,g=1){return fade(g,rect(x,y-h,w,h,{fill:col,fo:.55,stroke:col,sw:2,rx:6})+label(text,x+w/2,y+34,{size:26,color:C.ink,anchor:'middle',weight:700}));}
// diatomic molecule (two spheres) spinning
function diatom(x,y,ang,{g=1}={}){const dx=26*Math.cos(ang),dy=26*Math.sin(ang);return fade(g,line(x-dx,y-dy,x+dx,y+dy,{color:'#c9d2e3',w:5})+dot(x-dx,y-dy,16,'#ff9a7a')+dot(x+dx,y+dy,16,'#ff9a7a'));}

export const hsTIdeal3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>twoEq(seg(p,.05,.25),seg(p,.45,.65)),
 [K+'q2']:(p)=>{
  let s=fade(.3,twoEq());
  s+=Q2('二つを 並べると','温度 T の 正体が 分かる？',{g:seg(p,.05,.25)});
  return s;
 },
 [K+'recall']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('冷たい',330,60,{size:28,color:'#7fb6ff',anchor:'middle',weight:700})+gasBox({x:120,y:80,w:420,h:280,n:14,dist:60*t,seed:7,color:'#7fb6ff'});
  s+=label('熱い',870,60,{size:28,color:'#ff9a7a',anchor:'middle',weight:700})+gasBox({x:660,y:80,w:420,h:280,n:14,dist:330*t,seed:7,color:'#ff9a7a'});
  s+=card(200,390,800,100,label('温度 ＝ 分子の 運動の 激しさの 目安',600,452,{size:32,color:TC,anchor:'middle',weight:700}),seg(p,.1,.3),TC);
  return s;
 },
 // ================= S2 二つの式を等しくおく =================
 [K+'two']:(p)=>{
  let s=twoEq();
  s+=fade(seg(p,.05,.2),label('衝突から 導いた 結果',600,215,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('実験から まとめた 式',600,405,{size:24,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eq']:(p)=>{
  let s=fade(.5,twoEq());
  s+=fade(seg(p,.05,.2),arrow(1060,110,1060,300,{color:C.hi,w:4,head:14})+arrow(1060,300,1060,110,{color:C.hi,w:4,head:14})+label('＝',1100,228,{size:40,color:C.hi,weight:700}));
  s+=card(150,400,900,105,T3(E3,600,462,{size:44}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'x32']:(p)=>{
  let s=stepX(p,E3,E12,'両辺 × 3/2',{size:52});
  s+=fade(seg(p,.6,.75),label('½mv² の 形',300,490,{size:28,color:KC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'divN']:(p)=>stepX(p,E12,E1n,'両辺 ÷ N（分子 1個 あたり）',{size:50}),
 [K+'nN']:(p)=>{
  let s=fade(.6,T3(E1n,600,80,{size:36}));
  s+=card(150,140,420,130,T3(`N=n\\times ${NA}`,360,215,{size:42}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.25,.35),arrow(590,205,660,205,{color:C.hi,w:4,head:14}));
  s+=card(680,140,370,130,T3(`\\dfrac{n}{N}=\\dfrac{1}{${NA}}`,865,215,{size:44}),seg(p,.3,.45),C.hi);
  s+=card(150,320,900,150,T3(E1,600,405,{size:52}),seg(p,.6,.8),C.hi);
  return s;
 },
 [K+'result']:(p)=>{
  let s=card(150,60,900,170,T3(E1,600,160,{size:58}),1,C.hi);
  const w=texWidth(E1,58,false),wk=texWidth(KE,58,false);
  s+=fade(seg(p,.05,.2),rect(600-w/2-10,75,wk+20,140,{fill:'none',fo:0,stroke:KC,sw:3,rx:10})+label('分子 1個の 運動エネルギーの 平均',345,290,{size:26,color:KC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('R と アボガドロ定数：決まった 数',800,290,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('→ 絶対温度 T に 比例',800,350,{size:30,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=card(150,60,900,170,T3(E1,600,160,{size:58}),1,C.hi);
  s+=card(200,270,800,110,label('温度 ＝ 分子 1個の 運動エネルギーの 平均の 目安',600,338,{size:30,color:TC,anchor:'middle',weight:700}),seg(p,.05,.25),TC);
  s+=tag('モデルから 導いた 結果',600,440,{g:seg(p,.5,.65),size:26});
  return s;
 },
 [K+'num']:(p)=>{
  let s=fade(.6,T3(E1,600,75,{size:36}));
  s+=card(80,140,1040,140,T3(`1.5\\times\\dfrac{8.3}{6.0\\times10^{23}}\\times300`,600,220,{size:46}),seg(p,.05,.25),C.dim);
  s+=card(300,320,600,120,T3('\\approx6.2\\times10^{-21}\\ \\mathrm{J}',600,388,{size:52,color:KC}),seg(p,.5,.7),KC);
  s+=fade(seg(p,.5,.7),label('300 K',1070,390,{size:28,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 分子の速さ =================
 [K+'speedq']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:120,y:70,w:460,h:340,n:16,dist:300*t,seed:12});
  s+=fade(seg(p,.05,.2),label('ヘリウム',350,460,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(660,150,460,150,label('分子の 速さは？',890,240,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.1,.3),C.v);
  return s;
 },
 [K+'Nm']:(p)=>{
  let s=card(150,60,420,150,label('Nm',360,130,{size:44,color:C.ink,anchor:'middle',weight:700})+label('気体 全体の 質量',360,185,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.dim);
  s+=card(630,60,420,150,label('M',840,130,{size:44,color:C.ink,anchor:'middle',weight:700})+label('1 mol の 質量 [kg/mol]',840,185,{size:26,color:C.dim,anchor:'middle'}),seg(p,.35,.5),C.dim);
  s+=card(300,280,600,140,T3('Nm=n\\times M',600,360,{size:60}),seg(p,.6,.8),C.hi);
  return s;
 },
 [K+'sub']:(p)=>stepX(p,E3,`\\dfrac{1}{3}nM${AV2}=nR${TT}`,'Nm → n×M',{size:54}),
 [K+'divn']:(p)=>stepX(p,`\\dfrac{1}{3}nM${AV2}=nR${TT}`,`\\dfrac{1}{3}M${AV2}=R${TT}`,'両辺 ÷ n',{size:56}),
 [K+'x3']:(p)=>stepX(p,`\\dfrac{1}{3}M${AV2}=R${TT}`,`M${AV2}=3R${TT}`,'両辺 × 3',{size:58}),
 [K+'divM']:(p)=>stepX(p,`M${AV2}=3R${TT}`,VMS,'両辺 ÷ M',{size:60,col:C.v}),
 [K+'He']:(p)=>{
  let s=fade(.6,T3(VMS,600,85,{size:42}));
  s+=card(200,170,800,140,label('ヘリウム',330,252,{size:32,color:C.ink,anchor:'middle',weight:700})+T3('M=4.0\\times10^{-3}\\ \\mathrm{kg/mol}',700,240,{size:44}),seg(p,.05,.25),C.dim);
  s+=fade(seg(p,.55,.7),label('（4.0 g ＝ 0.0040 kg）',600,370,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=fade(.6,T3(VMS,600,75,{size:38}));
  s+=card(150,140,900,150,T3(`${AV2}=\\dfrac{3\\times8.3\\times300}{0.0040}`,600,228,{size:50}),seg(p,.05,.25),C.dim);
  s+=card(250,330,700,120,T3('\\approx1.87\\times10^{6}\\ \\mathrm{m^2/s^2}',600,398,{size:48,color:C.v}),seg(p,.5,.7),C.v);
  return s;
 },
 [K+'sqrt']:(p)=>{
  let s=fade(.6,T3(`${AV2}\\approx1.87\\times10^{6}\\ \\mathrm{m^2/s^2}`,600,75,{size:38}));
  s+=card(200,140,800,150,T3(`\\sqrt{${AV2}}\\approx1.4\\times10^{3}\\ \\mathrm{m/s}`,600,225,{size:52,color:C.v}),seg(p,.05,.25),C.v);
  s+=fade(seg(p,.5,.65),label('1秒に 約 1.4 km',600,360,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('分子の 速さの 目安（300 K）',600,430,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'t600']:(p)=>{
  let s=card(100,60,480,170,label('300 K',340,110,{size:30,color:TC,anchor:'middle',weight:700})+T3('\\approx1.4\\times10^{3}\\ \\mathrm{m/s}',340,180,{size:40,color:C.v}),1,C.dim);
  s+=card(620,60,480,170,label('600 K（2倍）',860,110,{size:30,color:TC,anchor:'middle',weight:700})+fade(seg(p,.5,.7),T3('\\approx1.9\\times10^{3}\\ \\mathrm{m/s}',860,180,{size:40,color:C.v})),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.2,.35),label('v² の 平均：2倍',600,300,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('速さの 目安：√2 倍（約 1.41 倍）',600,370,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(200,60,800,120,label('× 温度 2倍 → 速さ 2倍',600,135,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(200,230,800,200,label('2倍に なるのは 運動エネルギー',600,300,{size:32,color:KC,anchor:'middle',weight:700})+label('速さは √2 倍',600,380,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 // ================= S4 内部エネルギー =================
 [K+'Udef']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:120,y:70,w:460,h:340,n:16,dist:300*t,seed:12});
  s+=card(660,130,460,170,label('内部エネルギー',890,200,{size:32,color:UC,anchor:'middle',weight:700})+T3(Ut,890,260,{size:52}),seg(p,.05,.25),UC);
  s+=tag('仮定',890,370,{g:seg(p,.6,.75),size:26});
  return s;
 },
 [K+'mono']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:120,y:70,w:460,h:340,n:16,dist:300*t,seed:12});
  s+=card(640,70,500,140,label('単原子分子の 理想気体',890,130,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（ヘリウム など）',890,180,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.15),C.hi);
  s+=card(640,260,500,150,label('U ＝ 運動エネルギーの',890,320,{size:30,color:UC,anchor:'middle',weight:700})+label('合計 だけ',890,370,{size:30,color:UC,anchor:'middle',weight:700}),seg(p,.5,.65),UC);
  return s;
 },
 [K+'UN']:(p)=>{
  let s=card(150,90,900,170,T3(`${Ut}=N\\times${KE}`,600,190,{size:62}),seg(p,.1,.3),UC);
  s+=fade(seg(p,.4,.55),label('1個の 平均 × 個数',600,340,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'U32a']:(p)=>{
  let s=fade(.6,T3(PVK,600,70,{size:40}));
  s+=fade(seg(p,.05,.2),label('× 3/2',600,160,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=card(150,200,900,150,T3(`\\dfrac{3}{2}${PV}=\\dfrac{1}{2}Nm${AV2}=${Ut}`,600,288,{size:52}),seg(p,.15,.35),UC);
  s+=card(350,380,500,110,T3(`${Ut}=\\dfrac{3}{2}${PV}`,600,445,{size:48}),seg(p,.6,.8),UC);
  return s;
 },
 [K+'U32b']:(p)=>{
  let s=stepX(p,`${Ut}=\\dfrac{3}{2}${PV}`,UF,'PV ＝ nRT を 入れる',{size:64,col:UC});
  return s;
 },
 [K+'prop']:(p)=>{
  let s=card(250,60,700,160,T3(UF,600,155,{size:62}),1,UC);
  s+=fade(seg(p,.05,.2),label('U は 絶対温度 T に 比例',600,290,{size:34,color:TC,anchor:'middle',weight:700}));
  s+=card(200,340,800,110,label('n・T が 同じなら 体積・圧力に よらない',600,408,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.7),C.dim);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=fade(.6,T3(UF,600,75,{size:40}));
  s+=card(150,140,900,150,T3(`${Ut}=1.5\\times8.3\\times300`,600,228,{size:52}),seg(p,.05,.25),C.dim);
  s+=card(300,330,600,120,T3('\\approx3.7\\times10^{3}\\ \\mathrm{J}',600,398,{size:52,color:UC}),seg(p,.5,.7),UC);
  s+=fade(seg(p,.05,.2),label('1.0 mol・300 K',1100,100,{size:24,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=card(100,60,1000,150,T3('6.2\\times10^{-21}\\ \\mathrm{J}\\times6.0\\times10^{23}',600,145,{size:50}),seg(p,.05,.25),KC);
  s+=fade(seg(p,.05,.25),label('分子 1個',290,250,{size:26,color:KC,anchor:'middle',weight:700})+label('個数',870,250,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=card(300,300,600,120,T3('\\approx3.7\\times10^{3}\\ \\mathrm{J}',600,368,{size:52,color:UC}),seg(p,.5,.7),UC);
  return s;
 },
 [K+'exPV']:(p)=>{
  let s=card(100,60,1000,150,T3(`\\dfrac{3}{2}${PV}=1.5\\times99600\\times0.025`,600,148,{size:48}),seg(p,.05,.25),C.dim);
  s+=fade(seg(p,.05,.25),label('1本目の 動画の 気体（1.0 mol・300 K・25 L）',600,250,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(300,300,600,120,T3('\\approx3.7\\times10^{3}\\ \\mathrm{J}',600,368,{size:52,color:UC}),seg(p,.5,.7),UC);
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=ebar(300,420,160,140,UC,'300 K')+fade(seg(p,.1,.4),ebar(700,420,160,280*seg(p,.1,.4)+.01,UC,'600 K'));
  s+=label('3.7 × 10³ J',380,260,{size:28,color:UC,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.55),label('7.5 × 10³ J',780,120,{size:28,color:UC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('T 2倍 → U 2倍',1000,300,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 単原子だけ =================
 [K+'di']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s='';const pts=[[250,150],[420,300],[600,180],[780,320],[950,170]];
  pts.forEach(([x,y],i)=>{s+=diatom(x+40*Math.sin(t*1.3+i),y+30*Math.cos(t*1.1+i*2),t*3+i);});
  s+=fade(seg(p,.05,.2),label('酸素・窒素（2原子分子）',600,440,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('回転にも エネルギーを ためる',600,490,{size:28,color:'#ff9a7a',anchor:'middle',weight:700}));
  return s;
 },
 [K+'di2']:(p)=>{
  let s=card(250,60,700,150,T3(UF,600,150,{size:56}),1,C.a);
  s+=fade(seg(p,.05,.2),line(270,135,930,135,{color:C.a,w:5}));
  s+=fade(seg(p,.4,.55),label('2原子分子には 使えない',600,280,{size:34,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('（回転の 分、U は もっと 大きい）',600,350,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'di3']:(p)=>{
  let s=card(250,60,700,150,T3(IDL,600,150,{size:56}),1,C.F);
  s+=fade(seg(p,.05,.2),label('2原子分子にも 使える',600,280,{size:34,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('壁を 押すのは 飛んでいく 運動だけ',600,350,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cond']:(p)=>{
  let s=card(80,70,500,250,T3(IDL,330,150,{size:48})+label('理想気体',330,230,{size:30,color:C.F,anchor:'middle',weight:700})+label('（2原子分子も）',330,280,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.F);
  s+=card(620,70,500,250,T3(UF,870,150,{size:46})+label('単原子分子の',870,230,{size:30,color:UC,anchor:'middle',weight:700})+label('理想気体 だけ',870,280,{size:30,color:UC,anchor:'middle',weight:700}),seg(p,.25,.4),UC);
  s+=fade(seg(p,.6,.75),label('条件を 分けて 確かめる',600,400,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(150,60,900,170,T3(E1,600,160,{size:58}),seg(p,.02,.2),C.hi);
  s+=card(200,280,800,110,label('T ∝ 分子 1個の 運動エネルギーの 平均',600,348,{size:32,color:TC,anchor:'middle',weight:700}),seg(p,.3,.5),TC);
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('低い 温度',330,60,{size:28,color:'#7fb6ff',anchor:'middle',weight:700})+gasBox({x:120,y:80,w:420,h:300,n:14,dist:60*t,seed:7,color:'#7fb6ff'});
  s+=label('高い 温度',870,60,{size:28,color:'#ff9a7a',anchor:'middle',weight:700})+gasBox({x:660,y:80,w:420,h:300,n:14,dist:330*t,seed:7,color:'#ff9a7a'});
  s+=fade(seg(p,.4,.6),label('平均として 激しく 飛び回る',870,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(250,90,700,160,T3(UF,600,180,{size:62}),1,UC);
  s+=fade(seg(p,.2,.4),label('U は 温度だけで 決まる',600,330,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=Q2('火を 使わずに','気体の 温度を 上げられる？',{g:seg(p,.05,.25)});
  s+=fade(seg(p,.4,.6),thermo(1100,120,360,60+140*seg(p,.5,1)));
  return s;
 },
 [K+'bye']:(p)=>card(200,170,800,150,label('次の 単元：熱力学第一法則',600,260,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
