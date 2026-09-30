// YouTube シリーズ「空気抵抗・中級 2/2」(ys-um-drag-2) — 図。Stage 1200×515.
// 色（1/2・初級と同じ）：速度 v 紫、終端速度の線 黄、差 w 橙（微分方程式・中級の量 y と同じ色＝対応）、
// 力 緑、加速度 赤、時刻 t・τ 金。
// 数値：m＝2 kg、k＝4 kg/s → v∞＝5 m/s、τ＝0.5 s。v＝5(1−e^(−2t))、w＝5e^(−2t)。
//   t＝τ：3.16（63%）、2τ：4.32、3τ：4.75。差が半分 0.347 s。初級の表 1.0/1.8/2.44/2.95、式 0.91/1.65/2.26/2.75。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,draw,poly} from './anim.mjs';

const K='um-drag-2:';
const CF=C.F,CV=C.v,CA=C.a,CT=C.t,CH=C.hi,CD=C.dim,CW=C.E;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const swap=(p,a,b,t=.12)=>fade(1-seg(p,0,t),a)+fade(seg(p,t*.6,t+.1),b);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const W=cs(CW,'w'),W0=cs(CW,'w_0'),Wi=cs(CW,'w_i'),Wi1=cs(CW,'w_{i+1}');
const TAU=cs(CT,'\\tau');
const EQ='m\\dfrac{dv}{dt}=mg-kv';
const EQM='\\dfrac{dv}{dt}=g-\\dfrac{k}{m}\\,v';
const WDEF=W+'=v_\\infty-v';
const DW='\\dfrac{d'+W+'}{dt}';
const WEQ=DW+'=-\\dfrac{k}{m}\\,'+W;
const WEQT=DW+'=-\\dfrac{'+W+'}{'+TAU+'}';
const WSOL=W+'='+W0+'\\,e^{-t/'+TAU+'}';
const VSOL='v=v_\\infty\\left(1-e^{-t/'+TAU+'}\\right)';
const vex=t=>5*(1-Math.exp(-2*t)),wex=t=>5*Math.exp(-2*t);
const VN=n=>5*(1-Math.pow(.8,n));
const TH=.5*Math.log(2);

// ---- v–t graph with the gap w ---------------------------------------------------------------------
function vtA(g=1,{w=470}={}){return axes({x:110,y:450,w,h:330,xmax:1.6,ymax:6,xticks:[.5,1,1.5],yticks:[1,2,3,4,5],grid:true,g,xlabel:'t [s]',ylabel:'速度 v [m/s]',xcolor:CT,ycolor:CV});}
const vinf=(A,g=1,txt='v∞ ＝ 5 m/s')=>fade(g,line(A.X(0),A.Y(5),A.X(1.6),A.Y(5),{color:CH,w:3,dash:'10 7'})+label(txt,A.X(1.6)+8,A.Y(5)-12,{size:24,color:CH,weight:700,anchor:'end'}));
function gapFill(A,g=1,to=1.55){const n=60,top=[],bot=[];for(let i=0;i<=n;i++){const t=to*i/n;top.push([A.X(t),A.Y(5)]);bot.push([A.X(t),A.Y(vex(t))]);}return fade(g,poly([...top,...bot.reverse()],{fill:CW,fo:.22}));}
function gapBar(A,t,g=1,txt='w'){return fade(g,line(A.X(t),A.Y(vex(t)),A.X(t),A.Y(5),{color:CW,w:5})+label(txt,A.X(t)+10,A.Y((vex(t)+5)/2)+8,{size:24,color:CW,weight:700}));}
const vcurve=(A,p=1)=>A.plot(vex,{from:0,to:1.55,p,color:CV,w:5});
// w–t graph (decaying)
function wtA(g=1){return axes({x:110,y:450,w:470,h:330,xmax:1.6,ymax:6,xticks:[.5,1,1.5],yticks:[1,2,3,4,5],grid:true,g,xlabel:'t [s]',ylabel:'差 w [m/s]',xcolor:CT,ycolor:CW});}

// ---- bars (初級の表：v 紫、残り 橙) ----------------------------------------------------------------
const BX=230,BW=150,BY=[110,168,226,284];
function bars({gr=[1,1,1,1],hi=0}={}){
 let s=label('0',BX,85,{size:22,color:CD,anchor:'middle'})+label('5 m/s',BX+5*BW,85,{size:22,color:CH,anchor:'middle'})+line(BX+5*BW,95,BX+5*BW,330,{color:CH,w:3,dash:'8 6'});
 for(let n=0;n<4;n++){const v=VN(n),y=BY[n];
  s+=label(`t ＝ ${(n/10).toFixed(1)}`,60,y+23,{size:24,color:CT})+rect(BX,y,BW*v,32,{fill:CV,fo:.7,rx:4});
  s+=fade(gr[n],rect(BX+BW*v,y,BW*(5-v),32,{fill:CW,fo:.3,stroke:CW,sw:1.5,rx:4})+label(['5','4','3.2','2.56'][n],BX+BW*(v+5)/2,y+24,{size:22,color:CW,anchor:'middle',weight:700}));
  if(n)s+=fade(gr[n]*hi,label('× 0.8',BX+5*BW+60,y+4,{size:22,color:CH,anchor:'middle',weight:700}));
 }
 return s;
}

export const ytUmDrag2Diagrams={
 // ===== S1 =====
 [K+'recap']:(p)=>{
  let s=card(80,90,560,300,label('前回',360,140,{size:24,color:CD,anchor:'middle'})+tex(EQ,360,220,{size:46})+fade(seg(p,.4,.6),label('右の辺 ＝ 0',260,318,{size:26,color:CH,anchor:'middle'})+tex('v_\\infty=\\dfrac{mg}{k}',460,310,{size:44})),seg(p,0,.15));
  s+=card(700,90,420,300,label('例',910,140,{size:24,color:CD,anchor:'middle'})+label('m ＝ 2 kg、k ＝ 4 kg/s',910,210,{size:28,anchor:'middle'})+label('g ＝ 10 m/s²',910,260,{size:28,anchor:'middle'})+label('v∞ ＝ 5 m/s',910,325,{size:32,color:CH,anchor:'middle',weight:700}),seg(p,.55,.75));
  return s;
 },
 [K+'lastq']:(p)=>{
  const A=vtA(seg(p,0,.12));
  let s=A.svg+vinf(A,seg(p,0,.15))+dot(A.X(0),A.Y(0),8,CV);
  const G=[t=>5*(1-Math.exp(-4*t)),t=>5*Math.min(1,t/1.2),t=>5*(1-Math.exp(-1.6*t))];
  G.forEach((f,i)=>s+=A.plot(f,{from:0,to:1.55,p:seg(p,.1+i*.1,.35+i*.1),color:CV,w:3,dash:'4 10'}));
  s+=card(660,110,500,280,label('前回の最後の問い',910,160,{size:26,color:CD,anchor:'middle'})+label('どんな 曲線で',910,225,{size:30,color:CV,anchor:'middle',weight:700})+label('どれくらいの 時間で 近づく？',910,280,{size:28,color:CT,anchor:'middle',weight:700})+fade(seg(p,.55,.7),label('式で 解けないか？',910,345,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,.1,.25),CH);
  return s;
 },
 [K+'hint']:(p)=>bars({gr:[0,1,2,3].map(i=>seg(p,.15+i*.12,.25+i*.12)),hi:seg(p,.65,.8)})+label('初級の表：0.1 秒ごと',600,395,{size:26,color:CD,anchor:'middle'})+fade(seg(p,.7,.85),label('5 m/s までの 残りが 毎回 0.8 倍',600,450,{size:32,color:CH,anchor:'middle',weight:700})),
 [K+'ask']:(p)=>{
  let s=fade(.35,bars({hi:1}));
  s+=card(250,120,700,260,label('今回の問い',600,175,{size:26,color:CD,anchor:'middle'})+label('終端速度までの「差」に 注目すると',600,250,{size:30,color:CW,anchor:'middle',weight:700})+fade(seg(p,.35,.5),label('なぜ 式が 解ける？',600,320,{size:36,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 // ===== S2 差 w =====
 [K+'w']:(p)=>{
  const A=vtA();
  let s=A.svg+vinf(A)+fade(seg(p,0,.15),dot(A.X(.4),A.Y(vex(.4)),9,CV)+label('今の v',A.X(.4)+14,A.Y(vex(.4))+30,{size:24,color:CV,weight:700}));
  s+=gapBar(A,.4,seg(p,.2,.4));
  s+=card(660,110,500,280,label('終端速度までの 差',910,165,{size:28,color:CW,anchor:'middle',weight:700})+fade(seg(p,.2,.4),tex(WDEF,910,245,{size:50}))+fade(seg(p,.55,.7),label('あと 何 m/s 足りないか',910,335,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'wex']:(p)=>{
  const A=vtA();const t3=-Math.log(.4)/2; // v=3
  let s=A.svg+vinf(A)+dot(A.X(t3),A.Y(3),9,CV)+label('3',A.X(t3)-14,A.Y(3)+30,{size:24,color:CV,weight:700,anchor:'end'});
  s+=gapBar(A,t3,seg(p,.4,.6),'w ＝ 2');
  s+=card(660,110,500,280,tex(WDEF,910,170,{size:44})+label('v∞ ＝ 5 m/s（m ＝ 2、k ＝ 4）',910,240,{size:24,color:CD,anchor:'middle'})+fade(seg(p,.45,.65),tex(W+'=5-3=2\\ \\mathrm{m/s}',910,320,{size:44})),seg(p,0,.12));
  return s;
 },
 [K+'wends']:(p)=>{
  const A=vtA();
  let s=A.svg+vinf(A)+vcurve(A,seg(p,.2,.8))+gapBar(A,.001,seg(p,.05,.2),'w ＝ 5');
  s+=gapFill(A,seg(p,.5,.7));
  s+=card(660,110,500,280,label('v ＝ 0 → w ＝ 5',910,180,{size:32,color:CW,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('v → 5 に近づくほど',910,260,{size:28,color:CV,anchor:'middle'})+label('w → 0',910,320,{size:34,color:CW,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'dw']:(p)=>{
  const Y=v=>430-v*60;
  const u=seg(p,.4,.7),v=mix(2.7,3.0,u);
  let s=line(120,Y(5),470,Y(5),{color:CH,w:3,dash:'10 7'})+label('v∞ ＝ 5（定数）',470,Y(5)-14,{size:24,color:CH,weight:700,anchor:'end'});
  s+=line(150,Y(0),460,Y(0),{color:CD,w:2})+label('0',140,Y(0)+8,{size:22,color:CD,anchor:'end'});
  s+=rect(200,Y(v),70,Y(0)-Y(v),{fill:CV,fo:.6,rx:4})+label('v',235,Y(0)+32,{size:26,color:CV,anchor:'middle',weight:700});
  s+=rect(200,Y(5),70,Y(v)-Y(5),{fill:CW,fo:.35,stroke:CW,sw:2,rx:4})+fade(1-seg(p,.55,.7),label('w',300,Y((5+v)/2)+8,{size:28,color:CW,weight:700}));
  s+=fade(seg(p,.55,.75),label('v が ＋0.3',190,Y(v)+8,{size:22,color:CV,anchor:'end',weight:700})+label('w が −0.3',290,Y((5+v)/2)+8,{size:22,color:CW,weight:700}));
  s+=card(660,110,500,280,label('v ＋ w ＝ v∞（一定）',910,180,{size:30,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.35,.5),label('v が 増えた分だけ',910,260,{size:28,color:CV,anchor:'middle'})+label('w は ちょうど 減る',910,310,{size:28,color:CW,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'dw2']:(p)=>{
  let s=label('v∞ は 定数 → v と w は 逆向きに 同じだけ 変わる',600,100,{size:28,color:CD,anchor:'middle'});
  s+=fade(seg(p,.05,.3),tex(DW+'=-\\dfrac{dv}{dt}',600,250,{size:80}));
  s+=fade(seg(p,.55,.7),label('w の変化率 ＝ v の変化率の 符号を 変えたもの',600,420,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 差の式 =====
 [K+'recall']:(p)=>{
  let s=tex(EQ,600,90,{size:44,color:CD});
  s+=fade(seg(p,0,.2),tex(EQM,600,270,{size:66}));
  s+=fade(seg(p,.5,.7),highlight(560,205,340,125,1)+label('この右の辺を w で 書き直す',600,420,{size:30,color:CW,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gsub']:(p)=>{
  let s=tex('v_\\infty=\\dfrac{mg}{k}',600,120,{size:56});
  s+=fade(seg(p,.2,.4),label('両辺に k/m を 掛ける',600,215,{size:28,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.4,.6),tex('\\dfrac{k}{m}\\,v_\\infty=g',600,345,{size:66,color:CH}));
  s+=fade(seg(p,.4,.6),label('m と k が 約分で 消える',600,465,{size:26,color:CD,anchor:'middle'}));
  return s;
 },
 [K+'factor']:(p)=>{
  let s=tex(EQM,600,85,{size:38,color:CD});
  s+=fade(seg(p,.05,.25),tex('\\dfrac{dv}{dt}='+cs(CH,'\\dfrac{k}{m}v_\\infty')+'-\\dfrac{k}{m}\\,v',600,235,{size:50}));
  s+=fade(seg(p,.05,.25),label('g に 代入',1000,245,{size:24,color:CH}));
  s+=fade(seg(p,.5,.7),tex('\\dfrac{dv}{dt}=\\dfrac{k}{m}\\left(v_\\infty-v\\right)',600,390,{size:54}));
  s+=fade(seg(p,.5,.7),label('k/m を くくり出す',1000,400,{size:24,color:CH}));
  return s;
 },
 [K+'factor2']:(p)=>{
  let s=tex('\\dfrac{dv}{dt}=\\dfrac{k}{m}\\left(v_\\infty-v\\right)',600,100,{size:46,color:CD});
  s+=fade(seg(p,.05,.3),tex('\\dfrac{dv}{dt}=\\dfrac{k}{m}\\,'+W,600,290,{size:70}));
  s+=fade(seg(p,.05,.3),label('( ) の中 ＝ w',930,200,{size:26,color:CW,weight:700}));
  s+=fade(seg(p,.55,.7),label('加速度は 残りの 差に 比例',600,420,{size:32,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=tex('\\dfrac{dv}{dt}=\\dfrac{k}{m}\\,'+W,330,150,{size:56});
  s+=card(640,80,520,320,label('v ＝ 3 m/s のとき',900,135,{size:28,color:CV,anchor:'middle'})
   +label('w ＝ 2 m/s',900,190,{size:30,color:CW,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),label('k/m ＝ 4 ÷ 2 ＝ 2 /s',900,245,{size:28,anchor:'middle'}))
   +fade(seg(p,.4,.55),label('加速度 2 × 2 ＝ 4 m/s²',900,305,{size:30,color:CA,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('前回の 答えと 一致 ○',900,365,{size:28,color:CF,anchor:'middle',weight:700})),seg(p,0,.12),CH);
  return s;
 },
 [K+'weq']:(p)=>{
  let s=tex(DW+'=-\\dfrac{dv}{dt}',300,110,{size:44,color:CD})+tex('\\dfrac{dv}{dt}=\\dfrac{k}{m}\\,'+W,860,110,{size:44,color:CD});
  s+=fade(seg(p,.1,.35),tex(WEQ,600,280,{size:80}));
  s+=fade(seg(p,.6,.75),label('差 w の 変化率が、w 自身で 決まる',600,430,{size:30,color:CW,anchor:'middle',weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  let s=label('今回',250,135,{size:28,color:C.ink,weight:700,anchor:'middle'})+tex(WEQ,250,250,{size:58});
  s+=fade(seg(p,.05,.25),label('微分方程式の回',900,135,{size:28,color:CD,anchor:'middle'})+tex('\\dfrac{d'+cs(CW,'y')+'}{dt}=-k\\,'+cs(CW,'y'),900,250,{size:58}));
  s+=fade(seg(p,.2,.35),label('＝',575,262,{size:56,color:CH,anchor:'middle',weight:700})+label('同じ形',575,320,{size:28,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('y → w',450,420,{size:32,color:CW,anchor:'middle',weight:700})+label('k → k/m',750,420,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tau']:(p)=>{
  let s=tex(TAU+'=\\dfrac{m}{k}',330,160,{size:70});
  s+=label('k/m の 逆数',330,270,{size:26,color:CD,anchor:'middle'});
  s+=card(640,80,520,340,label('単位',900,130,{size:24,color:CD,anchor:'middle'})
   +fade(seg(p,.25,.45),tex('\\dfrac{\\mathrm{kg}}{\\mathrm{kg/s}}=\\mathrm{s}',900,215,{size:46,auto:false}))
   +fade(seg(p,.6,.75),label('例：τ ＝ 2 ÷ 4',900,305,{size:30,anchor:'middle'})+label('＝ 0.5 秒',900,360,{size:36,color:CT,anchor:'middle',weight:700})),seg(p,.15,.3));
  return s;
 },
 [K+'tau2']:(p)=>{
  let s=fade(seg(p,.05,.3),tex(WEQT,600,210,{size:84}));
  s+=fade(seg(p,.55,.7),label('τ ＝ この落下の 時間の 目盛り',600,410,{size:32,color:CT,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 差は同じ割合で縮む =====
 [K+'step']:(p)=>{
  let s=tex(Wi1+'\\approx '+Wi+'\\left(1-\\dfrac{\\Delta t}{'+TAU+'}\\right)',600,130,{size:58});
  s+=fade(seg(p,0,.2),label('一歩の式（微分方程式の回と 同じ）',600,230,{size:26,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.4,.6),tex('1-\\dfrac{0.1}{0.5}=0.8',600,340,{size:56,color:CH}));
  s+=fade(seg(p,.4,.6),label('Δt ＝ 0.1 s、τ ＝ 0.5 s',600,445,{size:26,color:CT,anchor:'middle'}));
  return s;
 },
 [K+'step2']:(p)=>bars({hi:1})+card(200,380,800,100,tex(Wi1+'\\approx 0.8\\,'+Wi,420,432,{size:40})+label('← 初級の表の 残り × 0.8',780,442,{size:28,color:CH,anchor:'middle',weight:700}),seg(p,.1,.3),CH),
 [K+'exp']:(p)=>{
  let s=label('刻みの 行き先 ＝ 指数関数',600,90,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.35),tex(WSOL,600,240,{size:96}));
  s+=fade(seg(p,.5,.7),label('微分方程式の回：y ＝ y₀ × (e の −kt 乗)',600,400,{size:28,color:CD,anchor:'middle'}));
  return s;
 },
 [K+'w0']:(p)=>{
  let s=tex(WSOL,600,100,{size:60});
  s+=fade(seg(p,.05,.25),label('静止から → w₀ ＝ v∞',600,200,{size:32,color:CW,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),tex('t=0:\\ e^{0}=1',600,300,{size:50}));
  s+=fade(seg(p,.65,.8),label('w ＝ v∞、つまり v ＝ 0 から 始まる',600,410,{size:32,color:CV,anchor:'middle',weight:700}));
  return s;
 },
 [K+'graph']:(p)=>{
  const A=vtA(seg(p,0,.12));
  let s=A.svg+vinf(A,seg(p,.05,.2))+vcurve(A,seg(p,.2,.5))+gapFill(A,seg(p,.55,.75));
  s+=card(660,110,500,280,fade(seg(p,.05,.2),label('上の 水平線：v∞',910,175,{size:28,color:CH,anchor:'middle',weight:700}))+fade(seg(p,.25,.4),label('紫の 曲線：v',910,245,{size:28,color:CV,anchor:'middle',weight:700}))+fade(seg(p,.55,.7),label('すき間：差 w',910,315,{size:30,color:CW,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'flip']:(p)=>{
  const u=seg(p,.1,.6);
  const A=vtA();
  // gap moves: show v-curve (fading) and the gap redrawn as a decaying w-curve
  let s=fade(1-u,A.svg+vinf(A)+vcurve(A)+gapFill(A));
  const B=wtA(u);
  s+=fade(u,B.svg+B.plot(wex,{from:0,to:1.55,color:CW,w:5})+poly([...Array.from({length:61},(_,i)=>[B.X(1.55*i/60),B.Y(wex(1.55*i/60))]),[B.X(1.55),B.Y(0)],[B.X(0),B.Y(0)]],{fill:CW,fo:.15}));
  s+=card(660,110,500,290,label('差 w だけを 取り出す',910,165,{size:28,color:CW,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('微分方程式の回の',910,235,{size:26,color:CD,anchor:'middle'})+label('減っていく 曲線と 同じ形',910,280,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('v は それを 上下 反転',910,350,{size:28,color:CV,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'half']:(p)=>{
  const B=wtA();
  let s=B.svg+B.plot(wex,{from:0,to:1.55,color:CW,w:5});
  [[2.5,1],[1.25,2]].forEach(([v,i])=>{const g=seg(p,.1+i*.2,.25+i*.2);s+=fade(g,line(B.X(0),B.Y(v),B.X(i*TH),B.Y(v),{color:CH,w:2,dash:'6 6'})+line(B.X(i*TH),B.Y(v),B.X(i*TH),B.Y(0),{color:CT,w:2,dash:'6 6'})+dot(B.X(i*TH),B.Y(v),8,CH)+label(['','0.35','0.69'][i],B.X(i*TH),B.Y(0)-10,{size:22,color:CT,anchor:'middle',weight:700})+label(String(v),B.X(0)+10,B.Y(v)-8,{size:22,color:CW,weight:700}));});
  s+=dot(B.X(0),B.Y(5),8,CW);
  s+=card(660,110,500,260,label('差が 半分に なる 時間は 一定',910,170,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),label('5 → 2.5 → 1.25 m/s',910,240,{size:32,color:CW,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('約 0.35 秒ごと',910,310,{size:32,color:CT,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S5 速度の式 =====
 [K+'vsol']:(p)=>{
  let s=tex('v=v_\\infty-'+W,600,100,{size:52,color:CD});
  s+=fade(seg(p,.1,.35),tex(VSOL,600,250,{size:80}));
  s+=fade(seg(p,.55,.7),label('τ ＝ m/k ＝ 0.5 s、v∞ ＝ 5 m/s',600,410,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  const A=vtA();
  let s=A.svg+vinf(A)+vcurve(A)+fade(seg(p,.1,.25),line(A.X(.5),A.Y(0),A.X(.5),A.Y(5.4),{color:CT,w:3,dash:'6 5'})+label('t ＝ τ',A.X(.5)+8,A.Y(5.4),{size:24,color:CT,weight:700}));
  s+=card(660,110,500,240,label('t ＝ τ ＝ 0.5 秒のとき',910,175,{size:28,color:CT,anchor:'middle'})+label('5 m/s の 何割？',910,255,{size:36,color:CH,anchor:'middle',weight:700}),seg(p,.1,.25),CH);
  return s;
 },
 [K+'tau63']:(p)=>{
  const A=vtA();
  let s=A.svg+vinf(A)+vcurve(A)+line(A.X(.5),A.Y(0),A.X(.5),A.Y(5.4),{color:CT,w:3,dash:'6 5'})+label('t ＝ τ',A.X(.5)+8,A.Y(5.4),{size:24,color:CT,weight:700});
  s+=fade(seg(p,.4,.55),dot(A.X(.5),A.Y(vex(.5)),10,CV)+label('3.16',A.X(.5)-12,A.Y(vex(.5))-6,{size:24,color:CV,weight:700,anchor:'end'}));
  s+=card(660,110,500,280,tex('e^{-1}\\approx 0.37',910,170,{size:40})
   +fade(seg(p,.2,.4),tex('v\\approx 5\\times 0.63\\approx 3.16\\ \\mathrm{m/s}',910,245,{size:38}))
   +fade(seg(p,.6,.75),label('終端速度の 約 63％',910,335,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,0,.12),CH);
  return s;
 },
 [K+'tau3']:(p)=>{
  const A=vtA();
  let s=A.svg+vinf(A)+vcurve(A);
  const P=[[.5,'τ','3.16'],[1,'2τ','4.32'],[1.5,'3τ','4.75']];
  P.forEach(([t,n,v],i)=>{const g=i?seg(p,.1+i*.25,.25+i*.25):1;s+=fade(g,line(A.X(t),A.Y(0),A.X(t),A.Y(vex(t)),{color:CT,w:2,dash:'6 5'})+label(n,A.X(t),A.Y(0)+62,{size:24,color:CT,anchor:'middle',weight:700})+dot(A.X(t),A.Y(vex(t)),9,CV)+label(v,A.X(t),A.Y(vex(t))+34,{size:22,color:CV,anchor:'middle',weight:700}));});
  s+=card(660,110,500,280,label('τ ：約 63％',910,170,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.35,.5),label('2τ：約 86％',910,225,{size:30,color:C.ink,anchor:'middle'}))+fade(seg(p,.6,.75),label('3τ：約 95％',910,280,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'early']:(p)=>{
  const A=vtA();
  let s=A.svg+vinf(A)+vcurve(A);
  s+=draw([[A.X(0),A.Y(0)],[A.X(.5),A.Y(5)]],seg(p,.1,.35),{color:CA,w:4,dash:'10 6'})+fade(seg(p,.3,.45),label('初めの傾き v∞/τ ＝ 10',A.X(.45),A.Y(1.2),{size:24,color:CA,weight:700}));
  s+=card(660,110,500,280,tex('\\dfrac{v_\\infty}{'+TAU+'}=\\dfrac{5}{0.5}=10',910,185,{size:44})
   +fade(seg(p,.4,.55),label('＝ g（自由落下の 加速度）',910,275,{size:28,color:CA,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),tex('v\\approx gt',910,345,{size:40})),seg(p,0,.12));
  return s;
 },
 // ===== table compare =====
 ...(()=>{
  const TX=[120,300,480,660],TY=[250,300,350,400];
  const T=['0.1','0.2','0.3','0.4'],TB=['1.0','1.8','2.44','2.95'],TF=['0.91','1.65','2.26','2.75'];
  const tab=(gB=1,gF=1)=>label('t [s]',TX[0],190,{size:24,color:CT,anchor:'middle',weight:700})+label('表',TX[1],190,{size:24,color:CV,anchor:'middle',weight:700})+label('式',TX[2],190,{size:24,color:CH,anchor:'middle',weight:700})+line(60,205,560,205,{color:C.faint,w:2})
   +T.map((t,i)=>label(t,TX[0],TY[i],{size:26,color:CT,anchor:'middle'})+fade(gB,label(TB[i],TX[1],TY[i],{size:28,color:CV,anchor:'middle',weight:700}))+fade(gF,label(TF[i],TX[2],TY[i],{size:28,color:CH,anchor:'middle',weight:700}))).join('')
   +label('v [m/s]',310,150,{size:22,color:CD,anchor:'middle'});
  const zoom=(gB=1,gF=1)=>{const A=axes({x:640,y:450,w:470,h:330,xmax:.45,ymax:3.3,xticks:[.1,.2,.3,.4],yticks:[1,2,3],grid:true,xlabel:'t [s]',ylabel:'v',xcolor:CT,ycolor:CV});
   return A.svg+fade(gF,A.plot(vex,{from:0,to:.44,color:CH,w:4}))+fade(gB,draw([0,1,2,3,4].map(n=>[A.X(n/10),A.Y(VN(n))]),1,{color:CV,w:3})+[0,1,2,3,4].map(n=>dot(A.X(n/10),A.Y(VN(n)),6,CV)).join(''));};
  return {
   [K+'table']:(p)=>{
    let s=card(80,90,480,300,label('初級の例',320,140,{size:26,color:CD,anchor:'middle'})+label('m ＝ 1 kg、k ＝ 2 kg/s',320,205,{size:28,anchor:'middle'})+fade(seg(p,.35,.5),label('v∞ ＝ 10 ÷ 2 ＝ 5 m/s',320,265,{size:28,color:CH,anchor:'middle'})+label('τ ＝ 1 ÷ 2 ＝ 0.5 s',320,320,{size:28,color:CT,anchor:'middle'})),seg(p,0,.15));
    s+=card(640,90,480,300,label('今回の例',880,140,{size:26,color:CD,anchor:'middle'})+label('m ＝ 2 kg、k ＝ 4 kg/s',880,205,{size:28,anchor:'middle'})+label('v∞ ＝ 5 m/s',880,265,{size:28,color:CH,anchor:'middle'})+label('τ ＝ 0.5 s',880,320,{size:28,color:CT,anchor:'middle'}),seg(p,.1,.25));
    s+=fade(seg(p,.65,.8),label('v∞ と τ が 同じ → 同じ 曲線',600,450,{size:32,color:CH,anchor:'middle',weight:700}));
    return s;
   },
   [K+'table2']:(p)=>tab(seg(p,.05,.3),seg(p,.35,.6))+zoom(seg(p,.05,.3),seg(p,.35,.6))+fade(seg(p,.7,.85),label('表が 少し 先回り',310,465,{size:28,color:CV,anchor:'middle',weight:700})),
   [K+'why']:(p)=>{
    let s=tab()+zoom();
    const A=axes({x:640,y:450,w:470,h:330,xmax:.45,ymax:3.3});
    s+=fade(seg(p,.1,.3),ring(A.X(0),A.Y(0),16,{color:CA,w:3})+label('始めの 大きな 加速度のまま 一歩',875,95,{size:24,color:CA,weight:700,anchor:'middle'}));
    s+=fade(seg(p,.55,.7),label('刻みを 細かく → 式の値に 近づく',310,465,{size:28,color:CH,anchor:'middle',weight:700}));
    return s;
   },
  };
 })(),
 ...(()=>{
  const q=(g=1)=>card(80,90,480,300,label('確かめ',320,140,{size:26,color:CD,anchor:'middle'})+label('m ＝ 2 kg のまま',320,210,{size:30,anchor:'middle'})+label('k ＝ 2 kg/s に 弱める',320,265,{size:30,color:CF,anchor:'middle',weight:700})+label('v∞ と τ は？',320,340,{size:34,color:CH,anchor:'middle',weight:700}),g,CH);
  return {
   [K+'quiz']:(p)=>q(seg(p,0,.2)),
   [K+'quizA']:(p)=>{
    const A=axes({x:640,y:450,w:470,h:330,xmax:3.2,ymax:11,xticks:[1,2,3],yticks:[5,10],grid:true,xlabel:'t [s]',ylabel:'速度 v [m/s]',xcolor:CT,ycolor:CV});
    let s=q()+A.svg+A.plot(t=>5*(1-Math.exp(-2*t)),{from:0,to:3.1,color:CV,w:3,dash:'6 6'})+label('k ＝ 4',A.X(3.1),A.Y(5)-10,{size:22,color:CV,anchor:'end'});
    s+=fade(seg(p,.05,.25),label('v∞ ＝ 2 × 10 ÷ 2 ＝ 10 m/s',320,440,{size:26,color:CH,anchor:'middle',weight:700}));
    s+=fade(seg(p,.2,.4),label('τ ＝ 2 ÷ 2 ＝ 1 s',320,485,{size:26,color:CT,anchor:'middle',weight:700}));
    s+=A.plot(t=>10*(1-Math.exp(-t)),{from:0,to:3.1,p:seg(p,.45,.8),color:CV,w:5})+fade(seg(p,.7,.85),label('k ＝ 2：速く、ゆっくり 近づく',A.X(3.1),A.Y(10)-14,{size:22,color:CV,anchor:'end',weight:700}));
    return s;
   },
  };
 })(),
 // ===== S6 =====
 ...(()=>{
  const c1=(g=1)=>card(100,60,1000,190,label('終端速度までの 差 w ＝ v∞ − v',600,110,{size:28,color:CW,anchor:'middle',weight:700})+tex(WEQT,420,190,{size:46})+label('微分方程式の回と 同じ形',850,200,{size:28,color:C.ink,anchor:'middle'}),g,CH);
  const c2=(g=1)=>card(100,275,1000,210,label('差は 同じ割合で 縮む',600,325,{size:28,color:C.ink,anchor:'middle'})+tex(VSOL,420,410,{size:44})+label('τ ＝ m/k：時間の 目盛り',860,405,{size:28,color:CT,anchor:'middle',weight:700})+label('（抵抗 kv の モデル）',860,450,{size:24,color:CD,anchor:'middle'}),g);
  return {
   [K+'sum1']:(p)=>c1(seg(p,0,.2)),
   [K+'sum2']:(p)=>c1()+c2(seg(p,0,.2)),
  };
 })(),
 [K+'nextq']:(p)=>{
  const u=smooth(clamp((p-.05)/.6)),y=mix(120,420,u*u);
  let s=line(260,110,260,450,{color:C.faint,w:2})+dot(260,y,20,'#2b3d63')+ring(260,y,20,{color:C.dim,w:3});
  s+=fade(seg(p,.2,.4),line(300,120,300,y,{color:C.x,w:4})+label('動いた 距離',312,(120+y)/2,{size:24,color:C.x}));
  s+=fade(seg(p,.3,.45),arrow(230,y-40,230,y+30,{color:CV,w:5})+label('速さ？',220,y-50,{size:24,color:CV,anchor:'end',weight:700}));
  s+=card(560,110,600,280,label('次の問い',860,160,{size:26,color:CD,anchor:'middle'})
   +label('時刻 t を 追う 代わりに',860,225,{size:28,color:CT,anchor:'middle'})
   +label('どこまで動いたら 速さは いくつか',860,285,{size:30,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('直接 つなぐ 式は？',860,350,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,.1,.25),CH);
  return s;
 },
};
