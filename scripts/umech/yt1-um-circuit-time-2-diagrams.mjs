// YouTube シリーズ「過渡現象・中級 2/2」(ys-um-circuit-time-2) — 図。Stage 1200×515.
// 色（1/2 と同じ）：電荷 q・Q 桃、差 u 橙（空気抵抗の差 w・微分方程式の y と同じ色）、電流 I 緑、電圧 V 紫、時間 t・τ 金、容量 C 黄。
// 回路・グラフの部品は 1/2 の図（yt1-um-circuit-time-1-diagrams.mjs）から import する。
// 数値：τ＝RC＝6 ms。充電 q＝18(1−e^(−t/6)) μC、u＝18e^(−t/6)、I＝3e^(−t/6) mA。放電 q＝18e^(−t/6) μC、半分 4.16 ms。
// 放電の回路：電池を外して導線でつなぐ。電流は充電と逆向き（左の板 → 抵抗 → 左の辺を下へ → 下の導線 → 右の辺を上へ → 右の板）。
import {C,clamp,mix,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,poly} from './anim.mjs';
import {QC,TC,IC,VC,CC,UC,POS,NEG,cs,T,U,card,f1,qt,tq,q_,I_,V0,C_,t_,DQ,QC_,ODE,QINF,circuit,brR,brC,qAxes,qGraph,qinfLine,battery,zig} from './yt1-um-circuit-time-1-diagrams.mjs';

const K='um-circuit-time-2:';
const u_=cs(UC,'u'),TAU=cs(TC,'\\tau'),QI=cs(QC,'q_\\infty');
const DU=`\\dfrac{d${u_}}{d${t_}}`;
const UDEF=`${u_}=${QI}-${q_}`;
const UEQ=`${DU}=-\\dfrac{${u_}}{${TAU}}`;
const UEQRC=`${DU}=-\\dfrac{${u_}}{RC}`;
const USOL=`${u_}=${cs(UC,'u_0')}\\,e^{-${t_}/${TAU}}`;
const QSOL=`${q_}=${C_}${V0}\\left(1-e^{-${t_}/RC}\\right)`;
const DSOL=`${q_}=${cs(QC,'Q_0')}\\,e^{-${t_}/RC}`;
const DEQ=`R\\,${DQ}=-${QC_}`;
const ue=t=>18*Math.exp(-t/6), qd=t=>18*Math.exp(-t/6), Ie=t=>3*Math.exp(-t/6);

function gap(A,g=1,to=31){const top=[],bot=[];for(let i=0;i<=80;i++){const t=to*i/80;top.push([A.X(t),A.Y(18)]);bot.push([A.X(t),A.Y(qt(t))]);}return fade(g,poly([...top,...bot.reverse()],{fill:UC,fo:.25}));}
function gapBar(A,t,g=1,txt='u'){const q=qt(t);return fade(g,line(A.X(t),A.Y(q),A.X(t),A.Y(18),{color:UC,w:5})+label(txt,A.X(t)+10,A.Y((q+18)/2)+8,{size:24,color:UC,weight:700}));}
const G=(g=1,c=1)=>qGraph(g,c,{w:480});
function tauLines(A,ts,g=1,f=qt,labs=['τ','2τ','3τ','5τ']){let s='';ts.forEach((t,i)=>{s+=fade(g,line(A.X(t),A.Y(0),A.X(t),A.Y(f(t)),{color:TC,w:2,dash:'6 5'})+label(labs[i],A.X(t),A.Y(0)+58,{size:22,color:TC,anchor:'middle',weight:700})+dot(A.X(t),A.Y(f(t)),7,QC));});return s;}

export const ytUmCircuitTime2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=card(80,90,520,300,label('前回',340,140,{size:24,color:C.dim,anchor:'middle'})+T(ODE,340,225,{size:46})
   +fade(seg(p,.5,.7),label('行き先',200,330,{size:26,color:C.hi,anchor:'middle'})+T(QINF,400,320,{size:44})),seg(p,0,.15));
  s+=card(660,90,480,300,label('空気抵抗と 同じ形',900,140,{size:24,color:C.dim,anchor:'middle'})+tex('m\\dfrac{dv}{dt}=mg-kv',900,225,{size:40})
   +fade(seg(p,.5,.7),tex('v_\\infty=\\dfrac{mg}{k}',900,320,{size:40})),seg(p,.3,.45));
  return s;
 },
 [K+'lastq']:(p)=>{
  const {A,svg}=G();
  let s=svg+qinfLine(A)+gap(A,seg(p,.1,.3));
  s+=card(680,100,480,300,label('前回の最後の問い',920,150,{size:24,color:C.dim,anchor:'middle'})
   +label('18 μC までの 差に 注目',920,215,{size:28,color:UC,anchor:'middle',weight:700})
   +label('どんな 曲線で 近づく？',920,275,{size:30,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('時定数は 何？',920,340,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(200,90,800,330,label('今回の問い',600,145,{size:26,color:C.dim,anchor:'middle'})
   +T(`${TAU}=RC`,600,230,{size:60})
   +label('は 何を 決める？',600,305,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('充電と 放電は どう 違う？',600,375,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 // ===== S2 差 u =====
 [K+'u']:(p)=>{
  const {A,svg}=G();const t0=tq(6);
  let s=svg+qinfLine(A)+fade(seg(p,0,.15),dot(A.X(t0),A.Y(6),9,QC)+label('今の q',A.X(t0)+14,A.Y(6)+30,{size:24,color:QC,weight:700}));
  s+=gapBar(A,t0,seg(p,.2,.4));
  s+=card(680,110,480,280,label('行き先までの 差',920,165,{size:28,color:UC,anchor:'middle',weight:700})+fade(seg(p,.2,.4),T(UDEF,920,245,{size:50}))
   +fade(seg(p,.55,.7),label('満タンまで あと 何 μC 足りないか',920,335,{size:24,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'uex']:(p)=>{
  const {A,svg}=G();const t0=tq(6);
  let s=svg+qinfLine(A)+dot(A.X(t0),A.Y(6),9,QC)+label('6',A.X(t0)-12,A.Y(6)+8,{size:24,color:QC,weight:700,anchor:'end'})+gapBar(A,t0,1,'u ＝ 12');
  s+=card(680,110,480,280,label('u は 電荷（単位 C）',920,165,{size:28,color:UC,anchor:'middle',weight:700})+label('電圧 では ない',920,215,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.6),T(`${u_}=18-6=${cs(UC,'12'+U('\\mu C'))}`,920,310,{size:40})),seg(p,0,.12));
  return s;
 },
 [K+'du']:(p)=>{
  const Y=v=>430-v*16;const uu=seg(p,.3,.6),q=mix(6,9,uu);
  let s=line(120,Y(18),470,Y(18),{color:QC,w:3,dash:'10 7'})+label('q∞ ＝ 18（定数）',470,Y(18)-14,{size:24,color:QC,weight:700,anchor:'end'});
  s+=line(150,Y(0),460,Y(0),{color:C.dim,w:2})+label('0',140,Y(0)+8,{size:22,color:C.dim,anchor:'end'});
  s+=rect(200,Y(q),70,Y(0)-Y(q),{fill:QC,fo:.55,rx:4})+label('q',235,Y(0)+32,{size:26,color:QC,anchor:'middle',weight:700});
  s+=rect(200,Y(18),70,Y(q)-Y(18),{fill:UC,fo:.35,stroke:UC,sw:2,rx:4})+label('u',300,Y((18+q)/2)+8,{size:28,color:UC,weight:700});
  s+=fade(seg(p,.5,.7),label('q が ＋3',190,Y(q)+8,{size:22,color:QC,anchor:'end',weight:700})+label('u が −3',330,Y((18+q)/2)+40,{size:22,color:UC,weight:700}));
  s+=card(640,110,520,280,label('q ＋ u ＝ q∞（一定）',900,165,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.65,.8),T(`${DU}=-${DQ}`,900,290,{size:52})),seg(p,0,.12));
  return s;
 },
 [K+'v0']:(p)=>{
  let s=T(ODE,600,85,{size:44,color:C.dim})+fade(seg(p,.05,.2),highlight(605,28,160,115,1,UC)+label('ここを u で',790,95,{size:24,color:UC,weight:700}));
  s+=fade(seg(p,.3,.45),T(QINF,330,290,{size:52})+label('両辺を C で 割る →',600,300,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),T(`${V0}=\\dfrac{${QI}}{${C_}}`,880,290,{size:52}));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(`${V0}-${QC_}`,600,110,{size:50,color:C.dim});
  s+=fade(seg(p,.1,.3),label(`V₀ に q∞/C を 代入`,600,200,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.3,.5),T(`\\dfrac{${QI}}{${C_}}-${QC_}`,600,320,{size:66}));
  return s;
 },
 [K+'fac']:(p)=>{
  let s=T(`\\dfrac{${QI}}{${C_}}-${QC_}`,600,90,{size:44,color:C.dim});
  s+=fade(seg(p,.05,.25),T(`=\\dfrac{${QI}-${q_}}{${C_}}`,600,215,{size:56})+label('1/C を くくり出す',990,225,{size:24,color:C.hi}));
  s+=fade(seg(p,.5,.7),T(`=\\dfrac{${u_}}{${C_}}`,600,370,{size:62})+label('かっこの中 ＝ u',990,380,{size:26,color:UC,weight:700}));
  return s;
 },
 [K+'divR']:(p)=>{
  let s=T(`R\\,${DQ}=\\dfrac{${u_}}{${C_}}`,600,100,{size:52});
  s+=fade(seg(p,.2,.35),label('両辺を R で 割る',600,195,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),T(`${DQ}=\\dfrac{${u_}}{RC}`,600,305,{size:68}));
  s+=fade(seg(p,.7,.85),label('電流 は 残りの 差 に 比例',600,440,{size:32,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ueq']:(p)=>{
  let s=T(`${DU}=-${DQ}`,300,100,{size:42,color:C.dim})+T(`${DQ}=\\dfrac{${u_}}{RC}`,880,100,{size:42,color:C.dim});
  s+=fade(seg(p,.15,.4),T(UEQRC,600,280,{size:80}));
  s+=fade(seg(p,.6,.75),label('差 u の 変化率が、u 自身で 決まる',600,430,{size:30,color:UC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  let s=label('今回',250,130,{size:28,color:C.ink,weight:700,anchor:'middle'})+T(UEQRC,250,250,{size:56});
  s+=fade(seg(p,.05,.25),label('空気抵抗・中級 2/2',900,130,{size:26,color:C.dim,anchor:'middle'})+T(`\\dfrac{d${cs(UC,'w')}}{d${t_}}=-\\dfrac{${cs(UC,'w')}}{${TAU}}`,900,250,{size:56}));
  s+=fade(seg(p,.2,.35),label('＝',575,262,{size:56,color:C.hi,anchor:'middle',weight:700})+label('同じ形',575,320,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('w → u',450,425,{size:32,color:UC,anchor:'middle',weight:700})+label('τ → RC',750,425,{size:32,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 時定数 =====
 [K+'tau']:(p)=>{
  let s=T(`${TAU}=RC`,600,120,{size:72})+fade(seg(p,.05,.25),label('時定数',820,135,{size:32,color:TC,weight:700}));
  s+=fade(seg(p,.4,.6),T(UEQ,600,320,{size:78}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=label('RC の 単位',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.02,.15),T(`\\Omega\\times\\mathrm{F}=\\dfrac{\\mathrm{V}}{\\mathrm{A}}\\times\\dfrac{\\mathrm{C}}{\\mathrm{V}}`,420,180,{size:50}));
  s+=fade(seg(p,.25,.4),T(`=\\dfrac{\\mathrm{C}}{\\mathrm{A}}`,780,180,{size:54})+label('V が 約分',780,275,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),T(`=\\dfrac{\\mathrm{C}}{\\mathrm{C/s}}=\\mathrm{s}`,600,360,{size:54})+label('A ＝ 1 秒あたりの C',960,370,{size:24,color:IC,weight:700}));
  s+=fade(seg(p,.75,.9),label('RC は 時間を 表す量',600,470,{size:30,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'val']:(p)=>{
  let s=T(`RC=2${U('k\\Omega')}\\times 3${U('\\mu F')}`,600,120,{size:56});
  s+=fade(seg(p,.35,.55),card(260,220,680,210,label('k（キロ） ＝ 1000 倍 ＝ 10³',600,295,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('μ（マイクロ） ＝ 100万分の1 ＝ 10⁻⁶',600,365,{size:32,color:C.ink,anchor:'middle',weight:700}),1));
  return s;
 },
 [K+'ms']:(p)=>{
  let s=T(`RC=2\\times10^{3}\\times3\\times10^{-6}`,600,95,{size:48});
  s+=fade(seg(p,0,.15),T(`=6\\times10^{-3}\\,\\mathrm{s}=${cs(TC,'6'+U('ms'))}`,600,215,{size:54}));
  s+=fade(seg(p,.55,.7),card(330,300,540,150,label('× 6 秒（倍率の 掛け忘れ）',600,360,{size:32,color:C.a,anchor:'middle',weight:700})+label('1000 倍も 違う',600,410,{size:26,color:C.dim,anchor:'middle'}),1,C.a));
  return s;
 },
 [K+'check']:(p)=>{
  const {A,svg}=G();const t0=tq(6);
  let s=svg+qinfLine(A)+dot(A.X(t0),A.Y(6),9,QC)+gapBar(A,t0,1,'u ＝ 12');
  s+=card(680,90,480,330,label('q ＝ 6 μC のとき',920,145,{size:28,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.25,.45),T(`${I_}=\\dfrac{${u_}}{${TAU}}=\\dfrac{${cs(UC,'12'+U('\\mu C'))}}{${cs(TC,'6'+U('ms'))}}=${cs(IC,'2'+U('mA'))}`,920,245,{size:36}))
   +fade(seg(p,.65,.8),label('前回の 2 mA と 一致 ○',920,355,{size:28,color:IC,anchor:'middle',weight:700})),seg(p,0,.12),IC);
  return s;
 },
 // ===== S4 充電の曲線 =====
 [K+'step']:(p)=>{
  let s=T(`${cs(UC,'u_{i+1}')}\\approx ${cs(UC,'u_i')}\\left(1-\\dfrac{\\Delta ${t_}}{${TAU}}\\right)`,600,120,{size:58});
  s+=fade(seg(p,0,.2),label('一歩の式（空気抵抗・微分方程式の回と 同じ）',600,225,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.65),T(`1-\\dfrac{1\\,\\mathrm{ms}}{6\\,\\mathrm{ms}}\\approx 0.83`,600,340,{size:52,color:C.hi}));
  s+=fade(seg(p,.7,.85),label('残りは 毎回 約 0.83 倍',600,450,{size:28,color:UC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'exp']:(p)=>{
  let s=label('刻みの 行き先 ＝ 指数関数',600,90,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.35),T(USOL,600,240,{size:92}));
  s+=fade(seg(p,.5,.7),label('微分方程式の回：y ＝ y₀ × (e の −kt 乗)',600,400,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'u0']:(p)=>{
  let s=T(USOL,600,95,{size:56});
  s+=fade(seg(p,.05,.25),label('はじめ q ＝ 0 → u₀ ＝ q∞',600,200,{size:32,color:UC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),T(`${t_}=0:\\ e^{0}=1`,600,300,{size:50}));
  s+=fade(seg(p,.65,.8),label('u ＝ q∞、つまり q ＝ 0 から 始まる',600,410,{size:32,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'qsol']:(p)=>{
  let s=T(`${q_}=${QI}-${u_}`,600,95,{size:48,color:C.dim});
  s+=fade(seg(p,.15,.4),T(QSOL,600,260,{size:78}));
  s+=fade(seg(p,.55,.7),label('CV₀ ＝ 18 μC、RC ＝ 6 ms',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'graph']:(p)=>{
  const {A,svg}=G(seg(p,0,.12),seg(p,.2,.5));
  let s=svg+qinfLine(A,seg(p,.05,.2))+gap(A,seg(p,.55,.75));
  s+=card(680,110,480,280,fade(seg(p,.05,.2),label('上の 点線：18 μC',920,175,{size:28,color:QC,anchor:'middle',weight:700}))+fade(seg(p,.25,.4),label('桃色の 曲線：q',920,245,{size:28,color:QC,anchor:'middle',weight:700}))+fade(seg(p,.55,.7),label('すき間：差 u',920,315,{size:30,color:UC,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'predict']:(p)=>{
  const {A,svg}=G();
  let s=svg+qinfLine(A)+fade(seg(p,.1,.25),line(A.X(6),A.Y(0),A.X(6),A.Y(20),{color:TC,w:3,dash:'6 5'})+label('t ＝ τ',A.X(6)+8,A.Y(20),{size:24,color:TC,weight:700}));
  s+=card(680,110,480,240,label('t ＝ τ ＝ 6 ms のとき',920,175,{size:28,color:TC,anchor:'middle'})+label('18 μC の 何割？',920,255,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'tau63']:(p)=>{
  const {A,svg}=G();
  let s=svg+qinfLine(A)+line(A.X(6),A.Y(0),A.X(6),A.Y(20),{color:TC,w:3,dash:'6 5'})+label('t ＝ τ',A.X(6)+8,A.Y(20),{size:24,color:TC,weight:700});
  s+=fade(seg(p,.4,.55),dot(A.X(6),A.Y(qt(6)),10,QC)+label('11.4',A.X(6)+14,A.Y(qt(6))+30,{size:24,color:QC,weight:700}));
  s+=card(680,110,480,280,T(`e^{-1}\\approx 0.37`,920,170,{size:40})
   +fade(seg(p,.2,.4),T(`${q_}\\approx 18\\times 0.632\\approx ${cs(QC,'11.4'+U('\\mu C'))}`,920,245,{size:34}))
   +fade(seg(p,.6,.75),label('行き先の 約 63％',920,335,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12),C.hi);
  return s;
 },
 [K+'marks']:(p)=>{
  const {A,svg}=G();
  let s=svg+qinfLine(A)+tauLines(A,[6],1,qt,['τ']);
  s+=tauLines(A,[12],seg(p,.05,.2),qt,['2τ'])+tauLines(A,[18],seg(p,.3,.45),qt,['3τ'])+tauLines(A,[30],seg(p,.55,.7),qt,['5τ']);
  s+=card(680,90,480,330,label('τ （6 ms）：約 63％',920,150,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.05,.2),label('2τ（12 ms）：約 86％',920,215,{size:30,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.3,.45),label('3τ（18 ms）：約 95％',920,280,{size:30,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('5τ（30 ms）：約 99.3％',920,345,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'criterion']:(p)=>{
  const {A,svg}=G();
  let s=svg+qinfLine(A)+tauLines(A,[30],1,qt,['5τ']);
  s+=card(680,90,480,330,label('理想的な式：差は 有限の時間で',920,145,{size:24,color:C.dim,anchor:'middle'})+label('ちょうど 0 には ならない',920,185,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.65),label('「ほぼ 満タン」の 基準を 決める',920,255,{size:28,color:C.hi,anchor:'middle',weight:700})+label('例：5τ で 残り 1％ 未満',920,315,{size:30,color:UC,anchor:'middle',weight:700})+label('（18 μC の 0.7％ ＝ 約 0.12 μC）',920,365,{size:22,color:C.dim,anchor:'middle'})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'notend']:(p)=>{
  const {A,svg}=G();
  let s=svg+qinfLine(A)+gap(A,.9)+line(A.X(6),A.Y(0),A.X(6),A.Y(20),{color:TC,w:3,dash:'6 5'})+label('τ',A.X(6)+8,A.Y(20),{size:26,color:TC,weight:700});
  s+=gapBar(A,.001,seg(p,.4,.55),'18')+gapBar(A,6,seg(p,.5,.65),'6.6');
  s+=card(680,110,480,280,label('時定数 τ ＝',920,165,{size:28,color:TC,anchor:'middle',weight:700})
   +label('× 充電が 終わる 時間',920,225,{size:28,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('○ 差が 約 0.37 倍に 縮む 時間',920,295,{size:28,color:UC,anchor:'middle',weight:700})+label('18 → 6.6 μC',920,345,{size:26,color:UC,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'current']:(p)=>{
  const B=axes({x:110,y:450,w:480,h:330,xmax:33,ymax:3.5,xticks:[6,12,18,24,30],yticks:[1,2,3],grid:true,xlabel:'t [ms]',ylabel:'電流 I [mA]',xcolor:TC,ycolor:IC});
  let s=B.svg+B.plot(Ie,{from:0,to:31,p:seg(p,.05,.6),color:IC,w:5});
  s+=fade(seg(p,.05,.2),dot(B.X(0),B.Y(3),9,IC)+label('3 mA',B.X(0)+16,B.Y(3)+6,{size:24,color:IC,weight:700}));
  s+=fade(seg(p,.55,.7),line(B.X(6),B.Y(0),B.X(6),B.Y(Ie(6)),{color:TC,w:2,dash:'6 5'})+dot(B.X(6),B.Y(Ie(6)),9,IC)+label('約 1.1 mA',B.X(6)+14,B.Y(Ie(6))-12,{size:24,color:IC,weight:700}));
  s+=card(680,110,480,280,T(`${I_}=\\dfrac{${u_}}{${TAU}}`,920,190,{size:50})
   +fade(seg(p,.3,.5),label('u と 同じ 割合で 減る',920,290,{size:28,color:IC,anchor:'middle',weight:700})),seg(p,0,.15),IC);
  return s;
 },
 // ===== S5 放電 =====
 [K+'dis']:(p)=>{
  const u=seg(p,.35,.7);
  let s=u<.5?fade(1-u*2,circuit({q:18,I:0})):fade(u*2-1,circuit({q:18,I:0,noBat:true}));
  s+=card(680,110,480,280,label('放電',920,165,{size:32,color:QC,anchor:'middle',weight:700})
   +label('18 μC まで 充電したあと',920,230,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.55),label('電池を 外し',920,285,{size:28,color:VC,anchor:'middle',weight:700})+label('抵抗 だけと つなぐ',920,330,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'disdir']:(p)=>{
  const q=mix(18,9,seg(p,.2,.95));
  let s=circuit({q,I:-.7*seg(p,.05,.25),noBat:true});
  s+=card(680,110,480,280,label('左の板の ＋ が 抵抗を 通って',920,170,{size:26,color:C.ink,anchor:'middle'})+label('右の板へ 戻る',920,215,{size:28,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('電流の向き：充電と 逆',920,300,{size:30,color:IC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'diseq']:(p)=>{
  let s=T(`${V0}=R${I_}+${QC_}`,600,70,{size:38,color:C.dim});
  s+=fade(seg(p,.05,.25),label('電池なし → V₀ を 0 に',600,150,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.25,.45),T(`0=R${I_}+${QC_}`,600,235,{size:46}));
  s+=fade(seg(p,.55,.75),T(DEQ,600,400,{size:60})+label(`I ＝ dq/dt を 入れる`,960,405,{size:24,color:IC}));
  return s;
 },
 [K+'dissign']:(p)=>{
  let s=T(DEQ,600,100,{size:54});
  s+=fade(seg(p,.05,.25),label('q ＞ 0 → dq/dt ＜ 0',600,210,{size:32,color:QC,anchor:'middle',weight:700})+label('電荷は 減る',600,260,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),label('I ＜ 0 ＝ 充電と 逆向きの 電流',600,370,{size:32,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'dissol']:(p)=>{
  const B=axes({x:110,y:450,w:480,h:330,xmax:33,ymax:21,xticks:[6,12,18,24,30],yticks:[6,12,18],grid:true,xlabel:'t [ms]',ylabel:'電荷 q [μC]',xcolor:TC,ycolor:QC});
  let s=B.svg+line(B.X(0),B.Y(0),B.X(32),B.Y(0),{color:C.hi,w:4})+label('行き先 q ＝ 0',B.X(32),B.Y(0)-14,{size:24,color:C.hi,weight:700,anchor:'end'});
  s+=fade(seg(p,.05,.25)*(1-seg(p,.45,.6)),line(B.X(0),B.Y(0),B.X(0),B.Y(18),{color:UC,w:6})+label('差 ＝ q そのもの',B.X(0)+16,B.Y(10),{size:26,color:UC,weight:700}));
  s+=B.plot(qd,{from:0,to:31,p:seg(p,.45,.9),color:QC,w:5});
  s+=card(680,110,480,280,fade(seg(p,.4,.55),T(DSOL,920,200,{size:48}))
   +fade(seg(p,.55,.75),label('Q₀ ＝ 放電を 始めたときの 電荷',920,300,{size:24,color:QC,anchor:'middle'})+label('（ここでは 18 μC）',920,340,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15),QC);
  return s;
 },
 ...(()=>{
  const pair=(g1=1,g2=1,m1=0,m2=0)=>{
   const A=axes({x:90,y:440,w:420,h:300,xmax:33,ymax:21,xticks:[6,12,18],yticks:[6,12,18],grid:true,xlabel:'t [ms]',ylabel:'充電 q [μC]',xcolor:TC,ycolor:QC});
   const B=axes({x:660,y:440,w:420,h:300,xmax:33,ymax:21,xticks:[6,12,18],yticks:[6,12,18],grid:true,xlabel:'t [ms]',ylabel:'放電 q [μC]',xcolor:TC,ycolor:QC});
   let s=fade(g1,A.svg+A.plot(qt,{from:0,to:31,color:QC,w:5})+T(`1-e^{-${t_}/RC}`,A.X(24),A.Y(9),{size:34}));
   s+=fade(g2,B.svg+B.plot(qd,{from:0,to:31,color:QC,w:5})+T(`e^{-${t_}/RC}`,B.X(22),B.Y(14),{size:34}));
   const L1=['63％','86％','95％'],L2=['37％','14％','5％'];
   [6,12,18].forEach((t,i)=>{
    s+=fade(m1*seg(m1,i*.25,i*.25+.3),dot(A.X(t),A.Y(qt(t)),7,C.hi)+label(L1[i],A.X(t)+4,A.Y(qt(t))+(i?30:-12),{size:22,color:C.hi,weight:700,anchor:i?'middle':'end'}));
    s+=fade(m2*seg(m2,i*.25,i*.25+.3),dot(B.X(t),B.Y(qd(t)),7,C.hi)+label(L2[i],B.X(t)+8,B.Y(qd(t))-12,{size:22,color:C.hi,weight:700}));
   });
   return s;
  };
  return {
   [K+'pair']:(p)=>pair(seg(p,.05,.3),seg(p,.4,.65))+fade(seg(p,.2,.35),label('上る',450,150,{size:26,color:C.hi,weight:700}))+fade(seg(p,.6,.75),label('下る',1030,150,{size:26,color:C.hi,weight:700})),
   [K+'pairmarks']:(p)=>pair(1,1,seg(p,.02,.45)*1,seg(p,.5,.95)),
  };
 })(),
 [K+'half']:(p)=>{
  const B=axes({x:110,y:450,w:480,h:330,xmax:33,ymax:21,xticks:[6,12,18,24,30],yticks:[6,12,18],grid:true,xlabel:'t [ms]',ylabel:'電荷 q [μC]',xcolor:TC,ycolor:QC});
  const th=6*Math.log(2);
  let s=B.svg+B.plot(qd,{from:0,to:31,color:QC,w:5});
  [[9,1],[4.5,2]].forEach(([v,i])=>{const g=seg(p,.1+(i-1)*.4,.3+(i-1)*.4);s+=fade(g,line(B.X(0),B.Y(v),B.X(i*th),B.Y(v),{color:C.hi,w:2,dash:'6 6'})+line(B.X(i*th),B.Y(v),B.X(i*th),B.Y(0),{color:TC,w:2,dash:'6 6'})+dot(B.X(i*th),B.Y(v),8,C.hi)+label(String(v),B.X(i*th)+14,B.Y(v)-10,{size:22,color:QC,weight:700}));});
  s+=card(680,110,480,280,label('半分に なる 時間は 一定',920,170,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.1,.3),label('18 → 9 μC：約 4.2 ms',920,240,{size:30,color:QC,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.7),label('9 → 4.5 μC：約 4.2 ms',920,300,{size:30,color:QC,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'quiz']:(p)=>card(250,110,700,300,label('確かめ',600,165,{size:26,color:C.dim,anchor:'middle'})+label('抵抗を 4 kΩ に 替えると',600,235,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),label('時定数は？ 充電は 速い？ 遅い？',600,315,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi),
 [K+'quizA']:(p)=>{
  const {A,svg}=G();
  let s=svg+qinfLine(A)+A.plot(t=>18*(1-Math.exp(-t/12)),{from:0,to:31,p:seg(p,.3,.8),color:QC,w:4,dash:'10 7'});
  s+=fade(seg(p,.7,.85),label('4 kΩ',A.X(26),A.Y(12),{size:24,color:QC,weight:700})+label('2 kΩ',A.X(1),A.Y(14),{size:24,color:QC,weight:700}));
  s+=card(680,110,480,280,T(`${TAU}=4${U('k\\Omega')}\\times3${U('\\mu F')}=${cs(TC,'12'+U('ms'))}`,920,180,{size:36})
   +fade(seg(p,.3,.5),label('2倍 → 充電も 放電も',920,265,{size:28,color:C.ink,anchor:'middle'})+label('ゆっくり',920,315,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 ...(()=>{
  const c1=(g=1)=>card(100,50,1000,200,label('行き先までの 差 u ＝ q∞ − q',600,100,{size:28,color:UC,anchor:'middle',weight:700})+T(UEQ,420,185,{size:46})+label('τ ＝ RC：時間の 目盛り',850,195,{size:30,color:TC,anchor:'middle',weight:700}),g,C.hi);
  const c2=(g=1)=>card(100,270,1000,220,label('充電：1 − 指数',330,320,{size:26,color:QC,anchor:'middle',weight:700})+T(QSOL,330,400,{size:34})
   +label('放電：指数 そのもの',860,320,{size:26,color:QC,anchor:'middle',weight:700})+T(DSOL,860,400,{size:36})
   +label('（指数関数の 導き方は 上級）',600,470,{size:22,color:C.dim,anchor:'middle'}),g);
  return {[K+'sum1']:(p)=>c1(seg(p,0,.2)),[K+'sum2']:(p)=>c1()+c2(seg(p,0,.2))};
 })(),
 [K+'next1']:(p)=>{
  const A=axes({x:110,y:270,w:500,h:170,ymin:-1.2,ymax:1.2,xmax:4,g:1,xlabel:'t',ylabel:'電圧 V',xcolor:TC,ycolor:VC});
  let s=fade(1-seg(p,.3,.5),line(A.X(0),A.Y(.8),A.X(4),A.Y(.8),{color:VC,w:4})+label('一定（ここまで）',A.X(2),A.Y(.8)-16,{size:24,color:VC,anchor:'middle'}));
  s+=A.svg+A.plot(t=>Math.sin(2*Math.PI*t/1.6),{from:0,to:3.9,p:seg(p,.45,.9),color:VC,w:5});
  s+=card(700,110,450,280,label('電圧が 一定でなく',925,180,{size:28,color:C.ink,anchor:'middle'})+label('正弦波で 揺れ続けたら？',925,240,{size:30,color:VC,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  const A=axes({x:110,y:270,w:500,h:170,ymin:-1.2,ymax:1.2,xmax:4,xlabel:'t',ylabel:'電圧 V',xcolor:TC,ycolor:VC});
  let s=A.svg+A.plot(t=>Math.sin(2*Math.PI*t/1.6),{from:0,to:3.9,color:VC,w:5});
  const coil=(x,y)=>{let d=`M${x} ${y}`;for(let i=0;i<5;i++)d+=` a14 22 0 0 1 28 0`;return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="4"/>`;};
  s+=fade(seg(p,.1,.3),coil(170,420)+label('コイル',240,470,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.4),rect(462,385,8,70,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+rect(490,385,8,70,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+line(420,420,462,420,{color:C.dim,w:4})+line(498,420,540,420,{color:C.dim,w:4})+label('コンデンサ',480,480,{size:26,color:CC,anchor:'middle',weight:700}));
  s+=card(700,110,450,280,label('次の問い',925,165,{size:24,color:C.dim,anchor:'middle'})+label('コイルと コンデンサは',925,230,{size:28,color:C.ink,anchor:'middle'})+label('交流に どう 応じる？',925,290,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};
