// YouTube シリーズ「過渡現象・上級 1/2」(ys-ue-transient-1) — 図。Stage 1200×515.
// 色（中級 過渡現象と同じ）：電流 I 緑、電圧 V₀ 紫、電荷 q 桃、差 u・差 I∞−I 橙、時間 t・τ 金、容量 C 黄、R・L 白、正 赤、負 青。
// RC の回路は中級の図（yt1-um-circuit-time-1-diagrams.mjs）の circuit を使う。RL の回路はここで描く（同じ配置で、コンデンサの位置にコイル）。
// 電流の正の向き：電池の＋極（長い線、左）→ 下の導線を左へ → 左の辺を上へ → 抵抗 → コイル → 右の辺を下へ → −極（時計回り）。
// 数値：RC I＝3e^(−t/6) mA（t は ms）。RL I＝0.5(1−e^(−t/10)) A（t は ms）、初めの傾き 50 A/s、I(10)＝0.316 A。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,poly} from './anim.mjs';
import {POS,NEG,QC,TC,IC,VC,CC,UC,cs,T,U,card,battery,zig,circuit as rcCircuit} from './yt1-um-circuit-time-1-diagrams.mjs';

const K='ue-transient-1:';
// ---- TeX pieces -----------------------------------------------------------------------------------
const q_=cs(QC,'q'),I_=cs(IC,'I'),V0=cs(VC,'V_0'),C_=cs(CC,'C'),t_=cs(TC,'t'),TAU=cs(TC,'\\tau'),u_=cs(UC,'u');
const QI=cs(QC,'q_\\infty'),II=cs(IC,'I_\\infty');
const RC_=`R${C_}`;
const DQ=`\\dfrac{d${q_}}{d${t_}}`,DI=`\\dfrac{d${I_}}{d${t_}}`,DU=`\\dfrac{d${u_}}{d${t_}}`;
const RCODE=`R\\,${DQ}=${V0}-\\dfrac{${q_}}{${C_}}`;
const ERC=`e^{-${t_}/${RC_}}`,ETAU=`e^{-${t_}/${TAU}}`,ERL=`e^{-R${t_}/L}`;
const LN=`\\ln|${u_}|`;
const GAPI=`(${II}-${I_})`;
const RLODE=`L\\,${DI}=${V0}-R${I_}`;
const ISOL=`${I_}=\\dfrac{${V0}}{R}\\left(1-${ERL}\\right)`;
const QSOL=`${q_}=${C_}${V0}\\left(1-${ERC}\\right)`;
const IRC=`${I_}=\\dfrac{${V0}}{R}\\,${ERC}`;

// ---- functions (t in ms) --------------------------------------------------------------------------
const Irc=t=>3*Math.exp(-t/6);            // mA
const Irl=t=>0.5*(1-Math.exp(-t/10));     // A
const qrc=t=>18*(1-Math.exp(-t/6));       // μC

// ---- RL circuit (same frame as the RC circuit of 中級) -------------------------------------------------
const CL=80,CR=600,CT=140,CB=410,BATX=350,SWA=150,SWB=215,RA=170,RB=300,LA=390,LB=550;
function coilPath(x1,x2,y,{color=C.ink,w=4,n=5}={}){const d=(x2-x1)/n;let s=`M${x1} ${y}`;for(let i=0;i<n;i++)s+=` a${d/2} ${d*.75} 0 0 1 ${d} 0`;return `<path d="${s}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;}
function diodeSym(xm,y,{color=C.ink,g=1}={}){ // anode on the right, cathode (bar) on the left: conducts right → left
 const s=poly([[xm+18,y-16],[xm+18,y+16],[xm-14,y]],{fill:color,fo:.9,stroke:color,sw:2})+line(xm-16,y-17,xm-16,y+17,{color,w:4});
 return fade(g,s);
}
// o: {I (−1..1 arrow strength, + = clockwise), sw (0 open..1 closed), vals, hiR, hiL, hiB, signs (coil terminal ± for dI/dt>0), spark, diode, flyback}
function rl({I=0,sw=1,vals=false,g=1,hiR=0,hiL=0,hiB=0,signs=0,spark=0,diode=0,flyback=0,labels=true}={}){
 let s='';
 const W=(pts)=>draw(pts,1,{color:C.dim,w:4});
 s+=W([[SWA,CB],[CL,CB],[CL,CT],[RA,CT]])+zig(RA,RB,CT)+W([[RB,CT],[LA,CT]]);
 s+=coilPath(LA,LB,CT,{color:C.ink,w:5});
 s+=W([[LB,CT],[CR,CT],[CR,CB],[BATX+10,CB]])+W([[SWB,CB],[BATX-10,CB]]);
 const ang=mix(-0.6,0,clamp(sw)),Ls=SWB-SWA;
 s+=dot(SWA,CB,6,C.ink)+dot(SWB,CB,6,C.ink)+line(SWA,CB,SWA+Ls*Math.cos(ang),CB+Ls*Math.sin(ang),{color:C.ink,w:4});
 if(labels){
  s+=label('スイッチ',(SWA+SWB)/2,CB+44,{size:22,color:C.dim,anchor:'middle'});
  s+=battery(BATX,CB,{text:vals?'電池 5 V':'電池 V₀'});
  s+=label(vals?'抵抗 10 Ω':'抵抗 R',(RA+RB)/2,CT-38,{size:24,color:C.ink,anchor:'middle',weight:700});
  s+=label(vals?'コイル 0.1 H':'コイル L',(LA+LB)/2,diode>0.01?CT+88:CT-48,{size:24,color:C.ink,anchor:'middle',weight:700});
 }else s+=battery(BATX,CB,{text:''});
 if(hiR)s+=highlight(RA-12,CT-28,RB-RA+24,56,hiR,IC);
 if(hiL)s+=highlight(LA-14,CT-30,LB-LA+28,60,hiL,C.ink);
 if(hiB)s+=highlight(BATX-50,CB-44,100,88,hiB,VC);
 if(signs)s+=fade(signs,label('＋',LA-6,CT+52,{size:30,color:POS,anchor:'middle',weight:700})+label('−',LB+6,CT+52,{size:32,color:NEG,anchor:'middle',weight:700}));
 if(diode){
  const yD=CT-95;
  s+=fade(diode,draw([[LA-20,CT],[LA-20,yD],[LB+20,yD],[LB+20,CT]],1,{color:C.dim,w:3})+dot(LA-20,CT,5,C.ink)+dot(LB+20,CT,5,C.ink)+diodeSym((LA+LB)/2,yD,{color:C.ink})+label('ダイオード',(LA+LB)/2,yD-26,{size:22,color:C.ink,anchor:'middle',weight:700}));
 }
 if(flyback){
  const yD=CT-95,o={color:IC,w:5,head:14};
  s+=fade(flyback,arrow(LA+20,CT+34,LB-20,CT+34,o)+arrow(LB+20,CT-20,LB+20,yD+18,o)+arrow((LA+LB)/2+60,yD+22,(LA+LB)/2-60,yD+22,o)+arrow(LA-20,yD+18,LA-20,CT-20,o));
 }
 if(spark){
  const x=(SWA+SWB)/2+18,y=CB-40;let z='';for(let k=0;k<6;k++){const a=k*Math.PI/3+.3;z+=line(x+10*Math.cos(a),y+10*Math.sin(a),x+30*Math.cos(a),y+30*Math.sin(a),{color:C.hi,w:4});}
  s+=fade(spark,z+label('火花',x+40,y-20,{size:24,color:C.hi,weight:700}));
 }
 const a=Math.abs(I);
 if(a>0.01){
  const w=3+4*clamp(a),o={color:IC,w,head:10+6*clamp(a)};
  const A=(x1,y1,x2,y2)=>I>0?arrow(x1,y1,x2,y2,o):arrow(x2,y2,x1,y1,o);
  s+=fade(Math.min(1,.35+a),A(BATX-45,CB,SWB+14,CB)+A(CL,CB-50,CL,CT+50)+A(CL+14,CT,RA-14,CT)+A(CR,CT+50,CR,CB-50)+A(CR-30,CB,BATX+45,CB)
   +label('電流 I',CL+16,(CT+CB)/2+8,{size:24,color:IC,weight:700}));
 }
 return fade(g,s);
}
// ---- graphs ---------------------------------------------------------------------------------------
function rlAxes({x=110,y=450,w=500,h=320,g=1}={}){return axes({x,y,w,h,xmax:52,ymax:.62,xticks:[10,20,30,40,50],yticks:[.1,.2,.3,.4,.5],grid:true,g,xlabel:'t [ms]',ylabel:'電流 I [A]',xcolor:TC,ycolor:IC});}
function rcIAxes({x=110,y=450,w=500,h=320,g=1}={}){return axes({x,y,w,h,xmax:33,ymax:3.5,xticks:[6,12,18,24,30],yticks:[1,2,3],grid:true,g,xlabel:'t [ms]',ylabel:'電流 I [mA]',xcolor:TC,ycolor:IC});}
const iinf=(A,g=1,txt='I∞ ＝ V₀/R')=>fade(g,line(A.X(0),A.Y(.5),A.X(52),A.Y(.5),{color:IC,w:2.5,dash:'10 8'})+label(txt,A.X(52),A.Y(.5)-14,{size:24,color:IC,weight:700,anchor:'end'}));
function gapI(A,t,g=1,txt='差'){const v=Irl(t);return fade(g,line(A.X(t),A.Y(v),A.X(t),A.Y(.5),{color:UC,w:5})+label(txt,A.X(t)+10,A.Y((v+.5)/2)+8,{size:24,color:UC,weight:700}));}
const tanLine=(A,g=1)=>fade(g,line(A.X(0),A.Y(0),A.X(11),A.Y(.55),{color:C.hi,w:3,dash:'8 6'}));
// ---- step list for the 6-step method ----------------------------------------------------------------
const STEPS=['① 零解を 確かめる','② u で 割る','③ ln|u| の 傾きと 見る','④ 時間で 積分','⑤ 指数へ 戻す','⑥ 初期値で 定数'];
function steps(active,g=1,done=-1){
 let s=rect(30,40,330,440,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+label('6段の 手順',195,82,{size:24,color:C.dim,anchor:'middle'});
 STEPS.forEach((t,i)=>{const y=140+i*62;const on=i===active,ok=i<=done;
  if(on)s+=rect(44,y-36,302,52,{fill:C.hi,fo:.12,stroke:C.hi,sw:2,rx:10});
  s+=label(t,56,y,{size:24,color:on?C.hi:ok?C.ink:C.dim,weight:on?700:400});});
 return fade(g,s);
}
// ---- potential staircase around the RL loop (along I) ----------------------------------------------
function stairs({show=1,g=1,x0=690,base=440,k=46,vr=3}={}){
 const Y=h=>base-k*h,dL=6-vr;let s='';
 s+=line(x0-10,base+4,x0-10,Y(7),{color:C.dim,w:2.5})+label('電位（高さ）',x0-4,Y(7)-12,{size:22,color:C.dim});
 const X=[x0,730,730,800,890,960,1050,1140];
 s+=draw([[X[0],Y(0)],[X[1],Y(0)],[X[2],Y(6)]],seg(show,0,.3),{color:VC,w:5});
 s+=draw([[X[2],Y(6)],[X[3],Y(6)],[X[4],Y(dL)]],seg(show,.3,.6),{color:IC,w:5});
 s+=draw([[X[4],Y(dL)],[X[5],Y(dL)],[X[6],Y(0)],[X[7],Y(0)]],seg(show,.6,1),{color:C.ink,w:5});
 s+=fade(seg(show,.1,.3),label('電池 ＋V₀',742,Y(1.2),{size:24,color:VC,weight:700}));
 s+=fade(seg(show,.4,.6),label('抵抗 −RI',850,Y(6)-16,{size:24,color:IC,weight:700,anchor:'middle'}));
 s+=fade(seg(show,.7,.9),label('コイル −L dI/dt',1000,Y(dL)-16,{size:24,color:C.ink,weight:700,anchor:'middle'}));
 s+=fade(seg(show,.9,1),label('元の高さ',1140,base+34,{size:22,color:C.hi,anchor:'end',weight:700}));
 return fade(g,s);
}

export const ytUeTransient1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=card(90,90,460,320,label('コイル',320,145,{size:30,color:C.ink,anchor:'middle',weight:700})+coilPath(220,420,250,{w:6})
   +line(150,250,220,250,{color:C.dim,w:4})+line(420,250,490,250,{color:C.dim,w:4})
   +fade(seg(p,.35,.55),label('電流の 変化に 応じる',320,360,{size:26,color:IC,anchor:'middle',weight:700})),seg(p,0,.15));
  s+=card(650,90,460,320,label('コンデンサ',880,145,{size:30,color:CC,anchor:'middle',weight:700})
   +rect(860,200,8,110,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+rect(892,200,8,110,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})
   +line(790,255,860,255,{color:C.dim,w:4})+line(900,255,970,255,{color:C.dim,w:4})
   +fade(seg(p,.5,.7),label('電荷の 変化で 電流が 流れる',880,360,{size:26,color:QC,anchor:'middle',weight:700})),seg(p,.15,.3));
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=rl({I:.6*seg(p,.05,.3)});
  s+=card(680,90,480,330,label('前回の最後の問い',920,140,{size:24,color:C.dim,anchor:'middle'})
   +label('抵抗と 組み合わせて',920,200,{size:28,color:C.ink,anchor:'middle'})+label('電源を 入れた 直後',920,245,{size:28,color:C.ink,anchor:'middle'})
   +label('電流は どう 立ち上がる？',920,305,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('L と C だけなら どうなる？',920,375,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(100,100,480,300,label('1/2 今回',340,160,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('RC を 最後まで 解いて 確かめる',340,235,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.25,.45),label('↓ 同じ 方法で',340,290,{size:24,color:C.dim,anchor:'middle'})+label('RL を 解く',340,345,{size:30,color:IC,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  s+=card(620,100,480,300,label('2/2 次回',860,160,{size:28,color:C.dim,anchor:'middle',weight:700})
   +label('L と C だけの 回路',860,250,{size:28,color:C.ink,anchor:'middle'}),seg(p,.6,.8));
  return s;
 },
 // ===== S2 RC =====
 [K+'recall']:(p)=>{
  let s=rcCircuit({q:9,I:.6,g:seg(p,0,.15)});
  s+=card(680,110,480,280,label('中級で 導いた式',920,165,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.6),T(RCODE,920,265,{size:42})),seg(p,.1,.25));
  return s;
 },
 [K+'recall2']:(p)=>{
  let s=T(`${u_}=${QI}-${q_}`,330,110,{size:48})+fade(seg(p,.15,.3),T(`${DU}=-\\dfrac{${u_}}{${TAU}}`,330,250,{size:56}))+fade(seg(p,.3,.45),T(`${TAU}=${RC_}`,330,385,{size:50}));
  s+=card(650,120,480,260,label('その解',890,175,{size:26,color:C.dim,anchor:'middle'})+T(`${u_}=${cs(UC,'u_0')}\\,${ETAU}`,890,250,{size:44})
   +fade(seg(p,.6,.75),label('導き方は 上級（約束）',890,335,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'zero']:(p)=>{
  let s=steps(0)+T(`${DU}=-\\dfrac{${u_}}{${RC_}}`,770,110,{size:52});
  s+=fade(seg(p,.25,.45),label('u ＝ 0（ずっと）を 入れる',770,215,{size:28,color:UC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),T(`0=0`,770,300,{size:56})+label('○',900,312,{size:40,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('満タン（q ＝ q∞）のまま の 解',770,410,{size:28,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ln']:(p)=>{
  let s=steps(seg(p,0,.4)<1?1:2);
  s+=T(`\\dfrac{1}{${u_}}\\,${DU}=-\\dfrac{1}{${RC_}}`,770,110,{size:50});
  s+=fade(seg(p,.05,.2),label('u ≠ 0 で 両辺を u で 割る',770,205,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),T(`\\dfrac{1}{${u_}}\\,${DU}=\\dfrac{d}{d${t_}}${LN}`,770,290,{size:44})+label('連鎖律',1080,300,{size:24,color:C.dim}));
  s+=fade(seg(p,.6,.8),T(`\\dfrac{d}{d${t_}}${LN}=-\\dfrac{1}{${RC_}}`,770,420,{size:52}));
  return s;
 },
 [K+'integ']:(p)=>{
  let s=steps(3)+T(`\\dfrac{d}{d${t_}}${LN}=-\\dfrac{1}{${RC_}}`,770,100,{size:44,color:C.dim});
  s+=fade(seg(p,.05,.3),T(`${LN}=-\\dfrac{${t_}}{${RC_}}+B`,770,250,{size:58}));
  s+=fade(seg(p,.45,.65),label('B：積分定数',770,370,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（容量 C と 区別して B）',770,420,{size:26,color:CC,anchor:'middle'}));
  return s;
 },
 [K+'exp']:(p)=>{
  let s=steps(4)+T(`${LN}=-\\dfrac{${t_}}{${RC_}}+B`,770,95,{size:42,color:C.dim});
  s+=fade(seg(p,.05,.3),T(`|${u_}|=e^{B}\\,${ERC}`,770,215,{size:52}));
  s+=fade(seg(p,.4,.55),label('符号も 含めて A ＝ ±（e の B 乗）',770,310,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),T(`${u_}=A\\,${ERC}`,770,410,{size:60}));
  return s;
 },
 [K+'init']:(p)=>{
  let s=steps(5)+T(`${u_}=A\\,${ERC}`,770,90,{size:44,color:C.dim});
  s+=fade(seg(p,.05,.25),T(`${t_}=0:\\quad ${u_}(0)=A\\times e^{0}=A`,770,200,{size:44}));
  s+=fade(seg(p,.5,.65),label('はじめ q ＝ 0 → u(0) ＝ q∞',770,295,{size:28,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.85),T(`A=${QI}=${C_}${V0}`,770,400,{size:56}));
  return s;
 },
 [K+'qsol']:(p)=>{
  let s=steps(-1,1,5)+T(`${q_}=${QI}-${u_}`,770,90,{size:44,color:C.dim});
  s+=fade(seg(p,.1,.35),T(QSOL,770,230,{size:58}));
  s+=fade(seg(p,.55,.7),card(500,320,540,120,label('中級で 使った 式を 導いた',770,392,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'Idiff']:(p)=>{
  let s=T(`${I_}=${DQ}=${C_}${V0}\\,\\dfrac{d}{d${t_}}\\left(1-${ERC}\\right)`,600,90,{size:46});
  s+=fade(seg(p,.25,.45),label('1 は 定数 → 微分で 0',360,215,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.75),T(`\\dfrac{d}{d${t_}}${ERC}=-\\dfrac{1}{${RC_}}\\,${ERC}`,600,330,{size:50}));
  return s;
 },
 [K+'Isol']:(p)=>{
  let s=T(`${I_}=${C_}${V0}\\left(-\\left(-\\dfrac{1}{${RC_}}\\right)\\right)${ERC}`,600,85,{size:44,color:C.dim});
  s+=fade(seg(p,.05,.25)*(1-seg(p,.3,.4)),T(`=\\dfrac{${C_}${V0}}{R${C_}}\\,${ERC}`,600,215,{size:52}));
  s+=fade(seg(p,.05,.25),label('マイナス × マイナス ＝ プラス',600,290,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.3,.4),T(`=\\dfrac{\\cancel{${C_}}${V0}}{R\\cancel{${C_}}}\\,${ERC}`,600,215,{size:52})+label('C が 約分',860,225,{size:24,color:CC,weight:700}));
  s+=fade(seg(p,.5,.7),T(IRC,600,410,{size:60}));
  return s;
 },
 [K+'verify']:(p)=>{
  let s=T(`${V0}\\overset{?}{=}R${I_}+\\dfrac{${q_}}{${C_}}`,600,75,{size:46});
  s+=fade(seg(p,.1,.3),label('RI ＝',330,180,{size:30,color:IC,anchor:'end',weight:700})+T(`${V0}\\,${ERC}`,470,175,{size:44}));
  s+=fade(seg(p,.25,.45),label('q/C ＝',330,270,{size:30,color:QC,anchor:'end',weight:700})+T(`${V0}\\left(1-${ERC}\\right)`,520,265,{size:44}));
  s+=fade(seg(p,.45,.6),line(270,310,800,310,{color:C.dim,w:2})+label('足す',820,318,{size:26,color:C.dim}));
  s+=fade(seg(p,.55,.75),label('e の項が 打ち消し →',420,395,{size:28,color:C.hi,anchor:'middle',weight:700})+T(`${V0}`,690,390,{size:54})+label('どの 時刻でも ○',900,400,{size:28,color:IC,weight:700}));
  s+=fade(seg(p,.8,.95),label('t ＝ 0 で q ＝ 0 も 満たす',600,470,{size:26,color:QC,anchor:'middle'}));
  return s;
 },
 [K+'rcnum']:(p)=>{
  const A=rcIAxes();
  let s=A.svg+A.plot(Irc,{from:0,to:31,p:seg(p,.05,.5),color:IC,w:5});
  s+=fade(seg(p,.05,.2),dot(A.X(0),A.Y(3),9,IC)+label('3 mA',A.X(0)+16,A.Y(3)+6,{size:24,color:IC,weight:700}));
  s+=fade(seg(p,.5,.65),line(A.X(6),A.Y(0),A.X(6),A.Y(Irc(6)),{color:TC,w:2,dash:'6 5'})+label('τ',A.X(6),A.Y(0)+58,{size:24,color:TC,anchor:'middle',weight:700})+dot(A.X(6),A.Y(Irc(6)),9,IC)+label('約 1.10 mA',A.X(6)+14,A.Y(Irc(6))-12,{size:24,color:IC,weight:700}));
  s+=card(680,90,480,330,T(`${I_}(0)=\\dfrac{6\\,\\mathrm{V}}{2\\,\\mathrm{k\\Omega}}=${cs(IC,'3\\,\\mathrm{mA}')}`,920,165,{size:36})
   +fade(seg(p,.3,.45),T(`${TAU}=${RC_}=${cs(TC,'6\\,\\mathrm{ms}')}`,920,250,{size:38}))
   +fade(seg(p,.55,.7),T(`${I_}(${TAU})=3\\times 0.368\\approx ${cs(IC,'1.10\\,\\mathrm{mA}')}`,920,345,{size:34})),seg(p,0,.12),IC);
  return s;
 },
 // ===== S3 RL の式 =====
 [K+'rl']:(p)=>{
  let s=rl({sw:0,g:seg(p,0,.2),hiL:seg(p,.1,.25)*(1-seg(p,.4,.5))});
  s+=card(680,90,480,330,label('仮定（理想的な 部品）',920,145,{size:26,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('V₀、R、L は 一定',920,210,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.45,.6),label('巻き線・電池の中の 抵抗 0',920,270,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('はじめ 電流 0、t ＝ 0 で スイッチ',920,340,{size:26,color:IC,anchor:'middle',weight:700})),seg(p,.15,.3));
  return s;
 },
 [K+'arrow']:(p)=>{
  let s=rl({I:.8*seg(p,.15,.45)});
  s+=fade(seg(p,.05,.2)*(1-seg(p,.4,.5)),ring(BATX-10,CB,26,{color:POS,w:3}));
  s+=card(680,110,480,280,label('電流 I の 正の向き',920,170,{size:28,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('＋極 → 抵抗 → コイル',920,245,{size:28,color:C.ink,anchor:'middle'})+label('→ −極（矢印の向き）',920,295,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.15),IC);
  return s;
 },
 [K+'kirch']:(p)=>{
  let s=rl({I:.6,labels:true});
  s+=card(660,90,500,330,label('原理：キルヒホッフの第2法則',910,150,{size:26,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('矢印の向きに 一周 たどると',910,230,{size:28,color:C.ink,anchor:'middle'})+label('電位は 元の高さに 戻る',910,285,{size:30,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('上り下りの 和 ＝ 0',910,365,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'up']:(p)=>{
  let s=rl({I:.6,hiB:seg(p,.0,.15)*(1-seg(p,.45,.55)),hiR:seg(p,.5,.65)});
  s+=stairs({show:mix(0,.6,seg(p,.05,.85))});
  return s;
 },
 [K+'coil']:(p)=>{
  let s=rl({I:.6,hiL:seg(p,0,.15)*(1-seg(p,.35,.45)),signs:seg(p,.45,.6)});
  s+=stairs({show:mix(.6,1,seg(p,.05,.4))});
  s+=fade(seg(p,.5,.65),card(20,8,560,52,label('電流が 入る側 ＋（前回の 端子電圧）',300,44,{size:24,color:C.ink,anchor:'middle'}),1));
  return s;
 },
 [K+'loop']:(p)=>{
  let s=stairs({g:.35});
  s+=fade(seg(p,.05,.3),T(`${V0}-R${I_}-L\\,${DI}=0`,380,200,{size:54}));
  s+=fade(seg(p,.35,.5),label('＋V₀',190,290,{size:26,color:VC,anchor:'middle',weight:700})+label('−RI',330,290,{size:26,color:IC,anchor:'middle',weight:700})+label('−L dI/dt',500,290,{size:26,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'move']:(p)=>{
  let s=T(`${V0}-R${I_}-L\\,${DI}=0`,600,100,{size:46,color:C.dim});
  s+=fade(seg(p,.05,.25),label('両辺に L dI/dt を 足す',600,195,{size:28,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.3,.55),T(RLODE,600,330,{size:66}));
  return s;
 },
 [K+'start']:(p)=>{
  const A=rlAxes();
  let s=A.svg+tanLine(A,seg(p,.55,.8))+fade(seg(p,.55,.8),label('傾き V₀/L',A.X(9.5),A.Y(.55)-10,{size:24,color:C.hi,weight:700,anchor:'end'}));
  s+=fade(seg(p,.5,.6),dot(A.X(0),A.Y(0),9,IC));
  s+=card(680,90,480,330,label('入れた 瞬間：I ＝ 0',920,150,{size:28,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.15,.35),T(`L\\,${DI}=${V0}-0`,920,225,{size:44}))
   +fade(seg(p,.5,.7),T(`${DI}=\\dfrac{${V0}}{L}`,920,355,{size:48})),seg(p,0,.12),IC);
  return s;
 },
 [K+'inf']:(p)=>{
  const A=rlAxes();
  let s=A.svg+tanLine(A,.5)+dot(A.X(0),A.Y(0),9,IC)+iinf(A,seg(p,.4,.6));
  s+=card(680,90,480,330,label('行き先：右の辺 ＝ 0',920,150,{size:28,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.1,.3),T(`0=${V0}-R${II}`,920,212,{size:40}))
   +fade(seg(p,.35,.55),T(`${II}=\\dfrac{${V0}}{R}`,920,325,{size:44}))
   +fade(seg(p,.7,.85),label('抵抗だけの 回路と 同じ',920,402,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.12),C.hi);
  return s;
 },
 [K+'factor']:(p)=>{
  let s=T(RLODE,600,85,{size:46,color:C.dim});
  s+=fade(seg(p,.05,.3),T(`=R\\left(\\dfrac{${V0}}{R}-${I_}\\right)`,640,215,{size:52})+label('R で くくる',1000,225,{size:26,color:C.hi}));
  s+=fade(seg(p,.5,.7),T(`=R\\,${GAPI}`,640,365,{size:56})+label('V₀/R ＝ I∞',1000,375,{size:26,color:IC,weight:700}));
  return s;
 },
 [K+'divL']:(p)=>{
  const A=rlAxes({x:100,w:460});
  let s=A.svg+iinf(A)+A.plot(Irl,{from:0,to:50,color:IC,w:5})+gapI(A,6,seg(p,.6,.75));
  s+=card(640,110,520,280,T(`L\\,${DI}=R\\,${GAPI}`,900,170,{size:38,color:C.dim})
   +fade(seg(p,.1,.25),label('両辺を L で 割る',900,235,{size:26,color:C.hi,anchor:'middle'}))
   +fade(seg(p,.25,.45),T(`${DI}=\\dfrac{R}{L}\\,${GAPI}`,900,320,{size:46})),seg(p,0,.12));
  return s;
 },
 [K+'diff']:(p)=>{
  let s=label('差 ＝ I∞ − I',600,70,{size:30,color:UC,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.3),T(`\\dfrac{d}{d${t_}}${GAPI}=-${DI}`,600,175,{size:50})+label('I∞ は 定数',990,185,{size:24,color:IC}));
  s+=fade(seg(p,.5,.75),T(`\\dfrac{d}{d${t_}}${GAPI}=-\\dfrac{R}{L}\\,${GAPI}`,600,340,{size:58}));
  return s;
 },
 [K+'tau']:(p)=>{
  let s=label('RC',250,110,{size:30,color:C.dim,anchor:'middle',weight:700})+T(`${DU}=-\\dfrac{${u_}}{${TAU}}`,250,215,{size:48});
  s+=label('RL',870,110,{size:30,color:C.dim,anchor:'middle',weight:700})+T(`\\dfrac{d}{d${t_}}${GAPI}=-\\dfrac{${GAPI}}{L/R}`,870,215,{size:40});
  s+=fade(seg(p,.1,.25),label('同じ 形',470,225,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.65),card(330,290,540,170,T(`${TAU}=\\dfrac{L}{R}`,510,385,{size:50})+label('RL の 時定数',740,395,{size:28,color:TC,anchor:'middle',weight:700}),1,TC));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=label('L/R の 単位',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.02,.25),T(`\\mathrm{H}=\\dfrac{\\mathrm{V\\cdot s}}{\\mathrm{A}},\\quad \\Omega=\\dfrac{\\mathrm{V}}{\\mathrm{A}}`,600,175,{size:50}));
  s+=fade(seg(p,.45,.7),T(`\\dfrac{\\mathrm{H}}{\\Omega}=\\dfrac{\\mathrm{V\\cdot s}/\\mathrm{A}}{\\mathrm{V}/\\mathrm{A}}=${cs(TC,'\\mathrm{s}')}`,600,345,{size:54}));
  return s;
 },
 // ===== S4 解と数 =====
 [K+'solve']:(p)=>{
  let s=steps(-1,1,5);
  s+=label('u の 代わりに 差 I∞ − I',770,80,{size:26,color:UC,anchor:'middle'});
  s+=fade(seg(p,.05,.3),T(`${GAPI}=\\left(${II}-${I_}(0)\\right)${ETAU}`,770,190,{size:46}));
  s+=fade(seg(p,.3,.45),label('はじめの 差 × e の −t/τ 乗',770,275,{size:26,color:UC,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('はじめ I(0) ＝ 0 → はじめの 差 ＝ I∞',770,345,{size:28,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.9),T(`${GAPI}=${II}\\,${ETAU}`,770,430,{size:50}));
  return s;
 },
 [K+'IsolRL']:(p)=>{
  let s=T(`${I_}=${II}-${II}\\,${ETAU}`,600,95,{size:48,color:C.dim});
  s+=fade(seg(p,.1,.35),T(ISOL,600,250,{size:66}));
  s+=fade(seg(p,.5,.65),label('I∞ ＝ V₀/R、τ ＝ L/R',600,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=label('確かめ',600,55,{size:26,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.3),T(`L\\,${DI}=L\\cdot\\dfrac{${V0}}{R}\\cdot\\dfrac{R}{L}\\,${ETAU}=${V0}\\,${ETAU}`,600,145,{size:42}));
  s+=fade(seg(p,.4,.55),T(`R${I_}=${V0}\\left(1-${ETAU}\\right)`,600,265,{size:44}));
  s+=fade(seg(p,.6,.8),T(`L\\,${DI}+R${I_}=${V0}`,600,385,{size:54})+label('○',870,395,{size:40,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  const A=rlAxes();
  let s=A.svg+iinf(A,seg(p,.4,.55),'I∞ ＝ 0.5 A');
  s+=card(680,90,480,330,T(`5\\,\\mathrm{V},\\ 10\\,\\Omega,\\ 0.1\\,\\mathrm{H}`,920,150,{size:38})
   +fade(seg(p,.3,.45),T(`${II}=\\dfrac{5}{10}=${cs(IC,'0.5\\,\\mathrm{A}')}`,920,240,{size:40}))
   +fade(seg(p,.6,.75),T(`${TAU}=\\dfrac{0.1}{10}=${cs(TC,'0.01\\,\\mathrm{s}')}=${cs(TC,'10\\,\\mathrm{ms}')}`,920,345,{size:36})),seg(p,0,.12));
  return s;
 },
 [K+'numtau']:(p)=>{
  const A=rlAxes();
  let s=A.svg+iinf(A,1,'I∞ ＝ 0.5 A')+A.plot(Irl,{from:0,to:50,p:seg(p,.0,.4),color:IC,w:5});
  s+=fade(seg(p,.35,.5),line(A.X(10),A.Y(0),A.X(10),A.Y(Irl(10)),{color:TC,w:2,dash:'6 5'})+dot(A.X(10),A.Y(Irl(10)),9,IC)+label('約 0.316 A',A.X(10)+14,A.Y(Irl(10))+30,{size:24,color:IC,weight:700}));
  s+=card(680,90,480,330,label('τ ＝ 10 ms のとき',920,150,{size:28,color:TC,anchor:'middle',weight:700})
   +fade(seg(p,.2,.4),T(`0.5\\times(1-0.368)`,920,240,{size:40}))
   +fade(seg(p,.4,.6),T(`\\approx ${cs(IC,'0.316\\,\\mathrm{A}')}`,920,320,{size:44}))
   +fade(seg(p,.65,.8),label('行き先の 約 63％',920,390,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12),C.hi);
  return s;
 },
 ...(()=>{
  const pair=(gu=1,gl=1,cu=1,cl=1)=>{
   const A=axes({x:120,y:215,w:440,h:150,xmax:33,ymax:3.6,xticks:[6,12,18,24,30],yticks:[3],grid:true,g:gu,xlabel:'t [ms]',ylabel:'RC の I [mA]',xcolor:TC,ycolor:IC});
   const B=axes({x:120,y:470,w:440,h:150,xmax:52,ymax:.62,xticks:[10,20,30,40,50],yticks:[.5],grid:true,g:gl,xlabel:'t [ms]',ylabel:'RL の I [A]',xcolor:TC,ycolor:IC});
   return fade(gu,A.svg+A.plot(Irc,{from:0,to:31,p:cu,color:IC,w:5}))+fade(gl,B.svg+B.plot(Irl,{from:0,to:50,p:cl,color:IC,w:5}));
  };
  return {
   [K+'compare']:(p)=>pair(seg(p,0,.15),seg(p,.3,.45),seg(p,.1,.4),seg(p,.45,.8))
    +card(720,90,440,330,fade(seg(p,.15,.3),label('RC：3 mA から 減る',940,180,{size:28,color:IC,anchor:'middle',weight:700}))+fade(seg(p,.5,.65),label('RL：0 から 0.5 A へ',940,290,{size:28,color:IC,anchor:'middle',weight:700})+label('立ち上がる',940,335,{size:28,color:IC,anchor:'middle',weight:700})),seg(p,0,.15)),
   [K+'roles']:(p)=>pair()+card(700,60,470,400,label('はじめ',815,115,{size:26,color:C.hi,anchor:'middle',weight:700})+label('十分 後',1055,115,{size:26,color:C.hi,anchor:'middle',weight:700})
    +line(935,190,935,275,{color:C.faint,w:2})+line(935,330,935,440,{color:C.faint,w:2})
    +label('コンデンサ',935,170,{size:24,color:CC,anchor:'middle',weight:700})
    +fade(seg(p,.05,.2),label('導線のよう',815,220,{size:24,color:C.ink,anchor:'middle'}))+fade(seg(p,.6,.75),label('切れた導線のよう',1055,220,{size:24,color:C.ink,anchor:'middle'}))
    +label('コイル',935,310,{size:24,color:C.ink,anchor:'middle',weight:700})
    +fade(seg(p,.3,.45),label('切れた導線のよう',815,360,{size:24,color:C.ink,anchor:'middle'}))+fade(seg(p,.65,.8),label('導線のよう',1055,360,{size:24,color:C.ink,anchor:'middle'})),1),
  };
 })(),
 ...(()=>{
  const rows=[['空気抵抗','m\\dfrac{dv}{dt}=mg-kv','\\tau=\\dfrac{m}{k}'],['RC',RCODE,`${TAU}=R${C_}`],['RL',RLODE,`${TAU}=\\dfrac{L}{R}`]];
  const table=(g=1,hi=0)=>{let s='';rows.forEach((r,i)=>{const y=120+i*130;s+=fade(seg(g,i*.25,i*.25+.35),label(r[0],140,y+10,{size:28,color:C.dim,anchor:'middle',weight:700})+T(r[1],520,y,{size:40})+T(r[2],960,y,{size:40}));});
   s+=fade(hi,highlight(364,345,56,70,1,C.hi)+highlight(364,85,56,70,1,C.hi)+label('L ↔ m',1080,470,{size:30,color:C.hi,anchor:'middle',weight:700}));return s;};
  return {
   [K+'table']:(p)=>table(seg(p,0,.8))+fade(seg(p,.85,.95),label('どれも 行き先 ×（1 − e の −t/τ 乗）',600,490,{size:26,color:C.hi,anchor:'middle'})),
   [K+'inertia']:(p)=>table(1,seg(p,.05,.25))+fade(seg(p,.45,.65),label('コイルの「電流の慣性」',560,490,{size:30,color:C.ink,anchor:'middle',weight:700})),
  };
 })(),
 // ===== S5 スイッチを切ると =====
 [K+'off']:(p)=>{
  let s=rl({I:.6*(1-seg(p,.5,.7)),sw:1-seg(p,.4,.55),vals:true});
  const A=axes({x:720,y:430,w:330,h:250,xmax:.2,ymax:.62,xticks:[.1],yticks:[.5],g:1,xlabel:'t [ms]',ylabel:'電流 I [A]',xcolor:TC,ycolor:IC});
  s+=A.svg+draw([[A.X(0),A.Y(.5)],[A.X(.02),A.Y(.5)]],1,{color:IC,w:5})+draw([[A.X(.02),A.Y(.5)],[A.X(.12),A.Y(0)],[A.X(.2),A.Y(0)]],seg(p,.55,.85),{color:IC,w:5});
  s+=fade(seg(p,.6,.8),label('0.1 ms で 0',A.X(.12)+8,A.Y(.25),{size:24,color:C.hi,weight:700}));
  return s;
 },
 [K+'offnum']:(p)=>{
  let s=rl({I:0,sw:0,vals:true,signs:0});
  s+=card(660,70,500,380,T(`\\dfrac{\\Delta ${I_}}{\\Delta ${t_}}\\approx\\dfrac{-0.5\\,\\mathrm{A}}{0.1\\,\\mathrm{ms}}`,910,150,{size:40})
   +fade(seg(p,.1,.3),T(`=-5000\\,\\mathrm{A/s}`,910,235,{size:40}))
   +fade(seg(p,.45,.65),T(`\\left|L\\,${DI}\\right|\\approx 0.1\\times5000`,910,320,{size:38}))
   +fade(seg(p,.65,.85),T(`=${cs(VC,'500\\,\\mathrm{V}')}`,910,400,{size:46})),seg(p,0,.12),VC);
  return s;
 },
 [K+'diode']:(p)=>{
  let s=rl({I:0,sw:0,vals:true,spark:seg(p,.05,.15)*(1-seg(p,.45,.55)),diode:seg(p,.5,.65),flyback:seg(p,.7,.85)});
  s+=card(680,90,480,330,label('5 V の 100倍',920,150,{size:30,color:VC,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),label('すき間の 空気を 破る → 火花',920,215,{size:26,color:C.hi,anchor:'middle'}))
   +fade(seg(p,.5,.65),label('コイルと 並列に ダイオード',920,295,{size:28,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('電流の 逃げ道',920,360,{size:30,color:IC,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 ...(()=>{
  const c1=(g=1)=>card(80,40,1040,210,label('一周の 電圧 → 行き先との 差 → 6段の 手順 → 指数',600,90,{size:28,color:C.hi,anchor:'middle',weight:700})
   +T(QSOL,330,180,{size:36})+T(ISOL,870,180,{size:36})
   +label('τ ＝ RC',330,235,{size:24,color:TC,anchor:'middle',weight:700})+label('τ ＝ L/R',870,235,{size:24,color:TC,anchor:'middle',weight:700}),g,C.hi);
  const c2=(g=1)=>card(80,275,1040,215,label('原理：一周で 電位は 戻る（キルヒホッフの第2法則）',600,325,{size:26,color:C.ink,anchor:'middle'})
   +label('定義・仮定：I ＝ dq/dt、q/C、L dI/dt、理想的な 部品',600,380,{size:26,color:C.ink,anchor:'middle'})
   +label('導いた 結果：指数の 解（代入で 確かめた）',600,440,{size:28,color:IC,anchor:'middle',weight:700}),g);
  return {[K+'sum1']:(p)=>c1(seg(p,0,.2)),[K+'sum2']:(p)=>c1()+c2(seg(p,0,.2))};
 })(),
 [K+'next']:(p)=>{
  const X1=180,X2=520,Y1=150,Y2=400;let s='';
  // simple LC: capacitor on the left side, coil on the right side (vertical)
  s+=draw([[X1,250],[X1,Y1],[X2,Y1],[X2,200]],1,{color:C.dim,w:4})+draw([[X2,350],[X2,Y2],[X1,Y2],[X1,300]],1,{color:C.dim,w:4});
  s+=rect(X1-55,246,110,8,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+rect(X1-55,296,110,8,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2});
  s+=`<g transform="rotate(90 ${X2} 200)">${coilPath(X2,X2+150,200,{w:5,n:5})}</g>`;
  s+=label('C',X1-80,285,{size:30,color:CC,anchor:'end',weight:700})+label('L',X2+50,285,{size:30,color:C.ink,weight:700});
  s+=fade(seg(p,.05,.2),label('抵抗なし',350,460,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(680,110,480,280,label('次の問い',920,165,{size:24,color:C.dim,anchor:'middle'})+label('L と C だけ',920,230,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('電荷は 減衰せずに',920,295,{size:28,color:QC,anchor:'middle'})+label('何を する？',920,345,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.3),C.hi);
  return s;
 },
};
