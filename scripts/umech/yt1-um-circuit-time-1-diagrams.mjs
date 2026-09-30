// YouTube シリーズ「過渡現象・中級 1/2」(ys-um-circuit-time-1) — 図。Stage 1200×515.
// 色（初級 回路の時間変化と同じ）：電圧・起電力 V・ℰ 紫、電荷 q 桃、電流 I 緑、時間 t 金、容量 C 黄、正電荷 赤、負電荷 青、磁場 橙。
//   空気抵抗の式：速度 v 紫、力 緑（空気抵抗・中級と同じ）。
// 回路（初級と同じ配置）：電池（長い線＝＋極が左）→ 下の導線を左へ → 左の辺を上へ → 抵抗（上の左）→ コンデンサの左の板（＋）。
//   右の板（−）→ 右の辺を下へ → 電池の−極。スイッチは下の導線の左。
// 数値：V₀＝6 V、R＝2 kΩ、C＝3 μF。V_C＝q/3、V_R＝6−q/3、I＝V_R/2（mA）。q(t)＝18(1−e^(−t/6)) μC（t は ms）。
// 部品（circuit, heights, qGraph など）は 2/2 の図からも import する。
import {C,clamp,mix,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,poly} from './anim.mjs';

const K='um-circuit-time-1:';
export const POS=C.a,NEG='#7fb3ff',QC=C.p,TC=C.t,IC=C.F,VC=C.v,CC=C.hi,BC=C.E,UC=C.E;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
export const U=s=>`\\,\\mathrm{${s}}`;
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const f1=v=>String(Number(v.toFixed(1)));
export const vc=q=>q/3, vr=q=>6-q/3, cur=q=>(6-q/3)/2;      // V, V, mA
export const qt=t=>18*(1-Math.exp(-t/6));                  // μC, t in ms
export const tq=q=>-6*Math.log(1-q/18);                     // ms
// TeX pieces
export const q_=cs(QC,'q'),I_=cs(IC,'I'),V0=cs(VC,'V_0'),C_=cs(CC,'C'),t_=cs(TC,'t'),R_='R';
export const DQ=`\\dfrac{d${q_}}{d${t_}}`;
export const QC_=`\\dfrac{${q_}}{${C_}}`;
export const KV=`${V0}=${R_}${I_}+${QC_}`;
export const ODE=`${R_}\\,${DQ}=${V0}-${QC_}`;
export const QINF=`${cs(QC,'q_\\infty')}=${C_}${V0}`;
export const DRAG='m\\dfrac{dv}{dt}=mg-kv';

// ---- circuit ----------------------------------------------------------------------------------
export const CL=80,CR=600,CT=140,CB=410,BATX=350,SWA=150,SWB=215,RA=180,RB=320,PL=440,PR=500;
export function zig(x1,x2,y,color=C.ink){const pts=[[x1,y]];const n=6;for(let i=1;i<n*2;i++)pts.push([x1+(x2-x1)*i/(n*2),y+(i%2?-18:18)]);pts.push([x2,y]);return draw(pts,1,{color,w:4});}
export function battery(x,y,{text='電池 6 V',g=1}={}){
 let s=line(x-10,y-34,x-10,y+34,{color:C.ink,w:5})+line(x+10,y-18,x+10,y+18,{color:C.ink,w:9});
 s+=label('＋',x-32,y-22,{size:24,color:POS,anchor:'middle',weight:700})+label('−',x+32,y-22,{size:26,color:NEG,anchor:'middle',weight:700});
 if(text)s+=label(text,x,y+62,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
function plateCharges(q){
 const n=clamp(Math.round(q/3),0,6);let s='';
 for(let k=0;k<n;k++){const y=CT-45+k*18;s+=label('＋',PL+13,y+8,{size:20,color:POS,anchor:'middle',weight:700})+label('−',PR-13,y+8,{size:22,color:NEG,anchor:'middle',weight:700});}
 return s;
}
// o: {q, sw (0 open .. 1 closed), I (0..1 arrow strength; negative = reversed), noBat (discharge: wire instead of battery)}
export function circuit({q=0,sw=1,I=0,vals=true,g=1,hiR=0,hiC=0,hiB=0,noBat=false,swLabel=true}={}){
 let s='';
 const W=(pts)=>draw(pts,1,{color:C.dim,w:4});
 s+=W([[SWA,CB],[CL,CB],[CL,CT],[RA,CT]]);
 s+=zig(RA,RB,CT);
 s+=W([[RB,CT],[PL-8,CT]])+W([[PR+8,CT],[CR,CT],[CR,CB],[noBat?SWB:BATX+10,CB]]);
 if(!noBat)s+=W([[SWB,CB],[BATX-10,CB]]);
 s+=rect(PL-8,CT-55,8,110,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+rect(PR,CT-55,8,110,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2});
 s+=plateCharges(q);
 const ang=mix(-0.55,0,clamp(sw)),L=SWB-SWA;
 s+=dot(SWA,CB,6,C.ink)+dot(SWB,CB,6,C.ink)+line(SWA,CB,SWA+L*Math.cos(ang),CB+L*Math.sin(ang),{color:C.ink,w:4});
 if(swLabel)s+=label('スイッチ',(SWA+SWB)/2,CB+44,{size:22,color:C.dim,anchor:'middle'});
 if(!noBat)s+=battery(BATX,CB,{text:vals?'電池 6 V':'電池 V₀'});
 s+=label(vals?'抵抗 2 kΩ':'抵抗 R',(RA+RB)/2,CT-38,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=label(vals?'コンデンサ 3 μF':'コンデンサ C',(PL+PR)/2,CT-70,{size:24,color:CC,anchor:'middle',weight:700});
 if(hiR)s+=highlight(RA-12,CT-28,RB-RA+24,56,hiR,IC);
 if(hiC)s+=highlight(PL-20,CT-64,PR-PL+40,128,hiC,QC);
 if(hiB)s+=highlight(BATX-50,CB-44,100,88,hiB,VC);
 const a=Math.abs(I);
 if(a>0.01){
  const w=3+4*clamp(a),o={color:IC,w,head:10+6*clamp(a)};
  const A=(x1,y1,x2,y2)=>I>0?arrow(x1,y1,x2,y2,o):arrow(x2,y2,x1,y1,o);
  s+=fade(Math.min(1,.35+a),(noBat?'':A(BATX-45,CB,SWB+14,CB))+A(CL,CB-50,CL,CT+50)+A(CL+14,CT,RA-14,CT)+A(CR,CT+50,CR,CB-50)+(noBat?A(CR-30,CB,SWB+40,CB):A(CR-30,CB,BATX+45,CB))
   +label('電流 I',CL+16,(CT+CB)/2+8,{size:24,color:IC,weight:700}));
 }
 return fade(g,s);
}
function vbr(a,b,y,text,color,g=1,dy=0){return fade(g,line(a,y,b,y,{color,w:3})+line(a,y-9,a,y+9,{color,w:3})+line(b,y-9,b,y+9,{color,w:3})+T(text,(a+b)/2,y+36+dy,{size:30}));}
export const brR=(t,g=1)=>vbr(RA,RB,CT+62,t,IC,g);
export const brC=(t,g=1,dy=0)=>vbr(PL-8,PR+8,CT+84,t,QC,g,dy);

// ---- potential staircase around the loop (電流の向きに一周) ----------------------------------------
// vr = resistor drop (V), nums: numbers or symbols, show: drawing progress 0..1
export function heights({vr:dR=4,g=1,nums=false,show=1,x0=700,base=440,k=48}={}){
 const Y=h=>base-k*h,dC=6-dR;
 let s=line(x0-10,base+4,x0-10,Y(7),{color:C.dim,w:2.5})+label('電位（高さ）',x0-4,Y(7)-12,{size:22,color:C.dim});
 const X=[x0,740,740,800,900,960,960,1140];
 s+=draw([[X[0],Y(0)],[X[1],Y(0)],[X[2],Y(6)]],seg(show,0,.3),{color:VC,w:5});
 s+=draw([[X[2],Y(6)],[X[3],Y(6)],[X[4],Y(dC)]],seg(show,.3,.6),{color:IC,w:5});
 s+=draw([[X[4],Y(dC)],[X[5],Y(dC)],[X[6],Y(0)],[X[7],Y(0)]],seg(show,.6,1),{color:QC,w:5});
 s+=fade(seg(show,.1,.3),label(nums?'電池 ＋6 V':'電池 ＋V₀',752,Y(1),{size:24,color:VC,weight:700}));
 s+=fade(seg(show,.4,.6),label(nums?`抵抗 −${f1(dR)} V`:'抵抗 −RI',850,Y(6)-16,{size:24,color:IC,weight:700,anchor:'middle'}));
 s+=fade(seg(show,.7,.9),label(nums?`コンデンサ −${f1(dC)} V`:'コンデンサ −q/C',972,Y(dC)>Y(1)-40?Y(1):Y(dC)+34,{size:24,color:QC,weight:700}));
 s+=fade(seg(show,.9,1),label('元の高さ',1140,base+34,{size:22,color:C.hi,anchor:'end',weight:700}));
 return fade(g,s);
}
// ---- q–t graph (t in ms) --------------------------------------------------------------------------
export function qAxes(g=1,{x=100,y=450,w=520,h=330}={}){return axes({x,y,w,h,xmax:33,ymax:21,xticks:[6,12,18,24,30],yticks:[6,12,18],grid:true,g,xlabel:'t [ms]',ylabel:'電荷 q [μC]',xcolor:TC,ycolor:QC});}
export function qGraph(g=1,curve=1,o={}){const A=qAxes(g,o);return {A,svg:A.svg+A.plot(qt,{from:0,to:31,p:curve,color:QC,w:5})};}
export const qinfLine=(A,g=1,txt='q∞ ＝ 18 μC')=>fade(g,line(A.X(0),A.Y(18),A.X(32),A.Y(18),{color:QC,w:2.5,dash:'10 8'})+label(txt,A.X(32),A.Y(18)-14,{size:24,color:QC,weight:700,anchor:'end'}));

// ---- the two equations, term by term, in aligned columns ------------------------------------------
const COLX=[300,410,500,590,670,750,830];
function eqRows({gTop=1,gBot=1,y1=160,y2=330,size=56}={}){
 const top=['m','\\dfrac{dv}{dt}','=','mg','-','k','v'];
 const bot=['R',DQ,'=',V0,'-',`\\dfrac{1}{${C_}}`,q_];
 let s=fade(gTop,top.map((t,i)=>tex(t,COLX[i],y1,{size})).join('')+label('空気抵抗',120,y1+10,{size:26,color:C.dim}));
 s+=fade(gBot,bot.map((t,i)=>T(t,COLX[i],y2,{size})).join('')+label('RC 回路',120,y2+10,{size:26,color:C.dim}));
 return s;
}
const colBox=(i,color,g,w=90)=>highlight(COLX[i]-w/2,95,w,300,g,color);

// ---- moving rod (recap of 電磁誘導 3/3) ------------------------------------------------------------
function rod(p){
 const x=mix(430,520,p);let s='';
 s+=line(150,140,660,140,{color:C.dim,w:5})+line(150,380,660,380,{color:C.dim,w:5});
 s+=draw([[150,140],[150,190]],1,{color:C.dim,w:5})+draw([[150,330],[150,380]],1,{color:C.dim,w:5});
 const pts=[[150,190]];for(let i=1;i<12;i++)pts.push([150+(i%2?-16:16),190+140*i/12]);pts.push([150,330]);s+=draw(pts,1,{color:C.ink,w:4});
 for(let i=0;i<4;i++)for(let j=0;j<2;j++){const bx=230+i*110,by=205+j*110;s+=ring(bx,by,13,{color:BC,w:2.5})+line(bx-8,by-8,bx+8,by+8,{color:BC,w:2.5})+line(bx-8,by+8,bx+8,by-8,{color:BC,w:2.5});}
 s+=line(x,125,x,395,{color:C.ink,w:9});
 s+=arrow(x+10,260,x+110,260,{color:VC,w:5,head:16})+label('v',x+120,268,{size:28,color:VC,weight:700});
 s+=arrow(x-22,330,x-22,190,{color:IC,w:5,head:14})+label('I',x-40,262,{size:28,color:IC,weight:700,anchor:'end'});
 s+=label('磁場 𝐁（奥向き）',400,470,{size:22,color:BC,anchor:'middle'});
 return s;
}

export const ytUmCircuitTime1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=rod(seg(p,.05,.9));
  s+=card(720,110,440,300,label('前回',940,160,{size:24,color:C.dim,anchor:'middle'})
   +T(`${cs(VC,'\\mathcal{E}')}=Bl${cs(VC,'v')}`,940,240,{size:52})
   +fade(seg(p,.55,.7),label('回路が 閉じていれば',940,320,{size:26,color:C.ink,anchor:'middle'})+label('電流が 流れる',940,365,{size:28,color:IC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=circuit({q:6*seg(p,.2,.9),I:.7,g:seg(p,0,.2)});
  s+=card(680,100,480,310,label('前回の最後の問い',920,150,{size:24,color:C.dim,anchor:'middle'})
   +label('起電力の回路に コンデンサ',920,210,{size:28,color:C.ink,anchor:'middle'})
   +label('電荷と電流は',920,265,{size:28,color:C.ink,anchor:'middle'})+label('時間とともに どう変わる？',920,310,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('式で 解けるか？',920,375,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'shokyu']:(p)=>{
  const {A,svg}=qGraph(seg(p,0,.15),seg(p,.1,.7));
  let s=svg;
  s+=card(680,90,480,330,label('初級で見たこと',920,140,{size:24,color:C.dim,anchor:'middle'})
   +T(KV,920,215,{size:46})
   +fade(seg(p,.45,.6),label('電荷 q が 増えるほど',920,300,{size:28,color:QC,anchor:'middle',weight:700})+label('電流 I は 減る',920,350,{size:28,color:IC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'promise']:(p)=>{
  const {A,svg}=qGraph();
  let s=svg+qinfLine(A,seg(p,.05,.25),'近づく先');
  s+=card(680,120,480,260,label('この 曲線の 式',920,190,{size:30,color:QC,anchor:'middle',weight:700})+label('→ 中級で 求める（約束）',920,260,{size:28,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('＝ 今回と 次回',920,325,{size:26,color:C.dim,anchor:'middle'})),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(200,90,800,330,label('今回の問い',600,145,{size:26,color:C.dim,anchor:'middle'})
   +label('回路の式を 微分方程式に 直すと',600,215,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.5),label('なぜ 空気抵抗の式と 同じ形に なる？',600,285,{size:34,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.7),tex(DRAG,600,370,{size:40})),seg(p,0,.15),C.hi);
  return s;
 },
 // ===== S2 回路と約束 =====
 [K+'circuit']:(p)=>{
  let s=circuit({q:0,sw:0,g:seg(p,0,.2)});
  s+=card(680,90,480,330,label('電池',740,160,{size:28,color:C.dim})+label('6 V',1120,160,{size:30,color:VC,anchor:'end',weight:700})
   +fade(seg(p,.4,.55),label('抵抗',740,240,{size:28,color:C.dim})+label('2 kΩ',1120,240,{size:30,color:C.ink,anchor:'end',weight:700}))
   +fade(seg(p,.6,.75),label('コンデンサ',740,320,{size:28,color:C.dim})+label('3 μF',1120,320,{size:30,color:CC,anchor:'end',weight:700}))
   +fade(seg(p,.8,.95),label('一列に つなぐ',920,385,{size:24,color:C.dim,anchor:'middle'})),seg(p,.15,.3));
  s+=highlight(BATX-50,CB-44,100,88,seg(p,.05,.25)*(1-seg(p,.4,.55)),VC);
  return s;
 },
 [K+'kilo']:(p)=>{
  let s=circuit({q:0,sw:0,hiR:seg(p,.05,.2)*(1-seg(p,.5,.6))});
  s+=card(680,90,480,330,T(`1${U('k\\Omega')}=1000\\,\\Omega`,920,170,{size:44})
   +label('キロ ＝ 1000',920,235,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.7),label('電池の中の抵抗',920,310,{size:26,color:C.dim,anchor:'middle'})+label('導線の抵抗 → 無視',920,355,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'t0']:(p)=>{
  const sw=seg(p,.25,.4);
  let s=circuit({q:0,sw,I:.8*seg(p,.38,.5)});
  s+=card(680,90,480,330,label('はじめ 電荷 q ＝ 0',920,160,{size:30,color:QC,anchor:'middle',weight:700})
   +T(`${t_}=0`,850,230,{size:40})+label('で スイッチ',1010,238,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.75),label('V₀、R、C は 一定',920,315,{size:30,color:C.hi,anchor:'middle',weight:700})+label('（時間で 変わらない）',920,360,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'dir']:(p)=>{
  const q=mix(0,9,seg(p,.5,.95));
  let s=circuit({q,I:.8*seg(p,.02,.35)});
  s+=fade(seg(p,.05,.2)*(1-seg(p,.4,.5)),ring(BATX-10,CB,26,{color:POS,w:3}));
  s+=card(680,110,480,280,label('＋極 → 抵抗 → 左の板',920,170,{size:28,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('左の板に ＋',920,245,{size:30,color:POS,anchor:'middle',weight:700})+label('右の板に −',920,300,{size:30,color:NEG,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'qdef']:(p)=>{
  let s=circuit({q:mix(6,9,seg(p,.3,.9)),I:.6,hiC:seg(p,.05,.2)});
  s+=card(680,90,480,330,label('q ＝ 左の板の電荷',920,150,{size:28,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('流れ込んだ分だけ 増える',920,215,{size:26,color:C.ink,anchor:'middle'})+T(`${I_}=${DQ}`,920,320,{size:58})),seg(p,0,.15),QC);
  return s;
 },
 [K+'vc']:(p)=>{
  let s=circuit({q:6,I:.6,vals:false})+brC(`${cs(VC,'V_C')}=${QC_}`,seg(p,.4,.6),44);
  s+=card(680,90,480,330,label('充電の途中の コンデンサの電圧',920,150,{size:24,color:C.dim,anchor:'middle'})
   +T(`${cs(VC,'V_C')}=${QC_}`,920,250,{size:60})
   +label('その時の 電荷 ÷ 容量',920,360,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.2),VC);
  return s;
 },
 [K+'vc0']:(p)=>{
  let s=circuit({q:0,I:.9})+brC(cs(VC,'0'+U('V')),seg(p,.05,.2))+brR(cs(VC,'6'+U('V')),seg(p,.45,.6));
  s+=card(680,110,480,280,label('スイッチを 入れた 瞬間',920,165,{size:26,color:C.dim,anchor:'middle'})
   +T(`${q_}=0\\ \\Rightarrow\\ ${cs(VC,'V_C')}=0`,920,235,{size:44})
   +fade(seg(p,.5,.7),label('初めから 6 V ではない',920,325,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S3 一周の電圧 =====
 [K+'kirch']:(p)=>{
  let s=circuit({q:6,I:.6,vals:false,g:.95});
  const loop=[[CL-26,CB+88],[CL-26,CT-26],[CR+26,CT-26],[CR+26,CB+88],[CL-26,CB+88]];
  s+=draw(loop,seg(p,.4,.9),{color:C.hi,w:3,dash:'10 8'});
  s+=card(680,90,480,330,label('電流・中級 2/2',920,145,{size:24,color:C.dim,anchor:'middle'})
   +label('キルヒホッフの 第2法則',920,200,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('一周の 上り下りの 和 ＝ 0',920,255,{size:28,color:C.hi,anchor:'middle'})
   +fade(seg(p,.45,.65),label('電位 ＝ 高さ',920,325,{size:28,color:VC,anchor:'middle',weight:700})+label('電流の向きに 一周たどる',920,370,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'up']:(p)=>{
  let s=circuit({q:6,I:.6,vals:false,hiB:seg(p,.05,.2)});
  s+=heights({show:mix(0,.3,seg(p,.1,.7))});
  return s;
 },
 [K+'down']:(p)=>{
  let s=circuit({q:6,I:.6,vals:false,hiR:seg(p,.05,.2)*(1-seg(p,.45,.55)),hiC:seg(p,.5,.65)});
  s+=heights({show:mix(.3,1,seg(p,.1,.85))});
  return s;
 },
 [K+'loop']:(p)=>{
  let s=circuit({q:6,I:.6,vals:false,g:1-seg(p,.05,.25)*.75});
  s+=heights({show:1,g:1-seg(p,.05,.2)*.6});
  s+=card(160,150,880,200,T(`${V0}-${R_}${I_}-${QC_}=0`,600,250,{size:60})+label('上がる − 下がる − 下がる ＝ 0',600,325,{size:24,color:C.dim,anchor:'middle'}),seg(p,.15,.35),C.hi);
  return s;
 },
 [K+'kv']:(p)=>{
  let s=T(`${V0}-${R_}${I_}-${QC_}=0`,600,110,{size:44,color:C.dim});
  s+=fade(seg(p,.05,.25),label(`両辺に ＋RI＋q/C`,600,195,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.25,.45),T(KV,600,300,{size:70}));
  s+=fade(seg(p,.6,.8),label('初級で 立てた式と 同じ',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=circuit({q:6,I:.6})+brC(cs(VC,'2'+U('V')),seg(p,.6,.8));
  s+=card(680,100,480,300,label('q ＝ 6 μC の瞬間',920,160,{size:30,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),T(`${cs(VC,'V_C')}=\\dfrac{${cs(QC,'6'+U('\\mu C'))}}{${cs(CC,'3'+U('\\mu F'))}}=${cs(VC,'2'+U('V'))}`,920,280,{size:42})),seg(p,0,.15),QC);
  s+=highlight(PL-20,CT-64,PR-PL+40,128,seg(p,.1,.3),QC);
  return s;
 },
 [K+'num2']:(p)=>{
  let s=circuit({q:6,I:.6})+brC(cs(VC,'2'+U('V')))+brR(cs(VC,'4'+U('V')),seg(p,.05,.25));
  s+=heights({vr:4,nums:true,show:1,g:seg(p,.3,.5)});
  return s;
 },
 [K+'numI']:(p)=>{
  let s=circuit({q:6,I:.6})+brC(cs(VC,'2'+U('V')))+brR(cs(VC,'4'+U('V')));
  s+=card(680,60,480,400,label('電流',920,110,{size:28,color:IC,anchor:'middle',weight:700})
   +T(`${I_}=\\dfrac{${cs(VC,'4'+U('V'))}}{2${U('k\\Omega')}}=${cs(IC,'2'+U('mA'))}`,920,200,{size:42})
   +fade(seg(p,.45,.65),T(`\\dfrac{1${U('V')}}{1${U('k\\Omega')}}=\\dfrac{1}{1000}${U('A')}`,920,315,{size:36})+T(`=${cs(IC,'1'+U('mA'))}`,920,405,{size:40})),seg(p,0,.15),IC);
  s+=highlight(RA-12,CT-28,RB-RA+24,56,seg(p,.1,.3),IC);
  return s;
 },
 // ===== S4 微分方程式にする =====
 [K+'subst']:(p)=>{
  let s=T(KV,600,95,{size:48});
  s+=fade(seg(p,.05,.25),T(`${I_}=${DQ}`,1000,95,{size:36})+label('を入れる',1000,160,{size:24,color:IC,anchor:'middle'}));
  s+=fade(seg(p,.3,.5),T(`${V0}=${R_}\\,${DQ}+${QC_}`,600,285,{size:66}));
  s+=fade(seg(p,.6,.8),label('未知数は 電荷 q だけ',600,430,{size:32,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'move']:(p)=>{
  let s=T(`${V0}=${R_}\\,${DQ}+${QC_}`,600,95,{size:46,color:C.dim});
  s+=fade(seg(p,.05,.25),label('両辺から q/C を 引く',600,190,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.3,.5),T(ODE,600,315,{size:74}));
  return s;
 },
 [K+'read']:(p)=>{
  let s=T(ODE,600,150,{size:74});
  s+=fade(seg(p,.05,.25),highlight(318,30,222,210,1,IC)+label('抵抗の電圧 RI',440,275,{size:28,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),highlight(582,30,300,210,1,VC)+label('電池 − コンデンサ',775,275,{size:28,color:VC,anchor:'middle',weight:700})+label('＝ 残りの電圧',775,318,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('この 残りが 抵抗に かかる',600,430,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'rhs']:(p)=>{
  let s=T(ODE,600,150,{size:74});
  s+=fade(seg(p,.05,.25),ring(818,140,72,{color:QC,w:3})+label('求めたい q が 右の辺に',818,260,{size:26,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.65),label('増える速さ dq/dt が 今の q で 決まる',600,360,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('微分方程式の回：',470,455,{size:26,color:C.dim,anchor:'end'})+T(`\\dfrac{d${cs(UC,'y')}}{d${t_}}=-k\\,${cs(UC,'y')}`,600,445,{size:32,color:C.dim}));
  return s;
 },
 [K+'start']:(p)=>{
  const {A,svg}=qGraph(1,seg(p,0,.3),{w:480});
  let s=svg+dot(A.X(0),A.Y(0),9,C.hi);
  const k=3; // μC per ms at t=0
  s+=draw([[A.X(0),A.Y(0)],[A.X(6),A.Y(18)]],seg(p,.45,.65),{color:IC,w:4,dash:'10 6'});
  s+=card(680,60,480,360,label('スイッチを 入れた 瞬間 q ＝ 0',920,105,{size:24,color:C.dim,anchor:'middle'})
   +T(`${DQ}=\\dfrac{${V0}}{R}`,920,190,{size:44})
   +fade(seg(p,.3,.5),T(`=\\dfrac{${cs(VC,'6'+U('V'))}}{2${U('k\\Omega')}}=${cs(IC,'3'+U('mA'))}`,920,310,{size:40}))
   +fade(seg(p,.65,.8),label('一番 大きな 電流 ＝ 一番 急',920,395,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),IC);
  return s;
 },
 [K+'later']:(p)=>{
  const {A,svg}=qGraph(1,1,{w:480});const t0=mix(0,tq(6),seg(p,.05,.6)),q0=qt(t0),sl=(18-q0)/6;
  let s=svg+draw([[A.X(Math.max(0,t0-4)),A.Y(q0-sl*Math.min(4,t0))],[A.X(t0+4),A.Y(q0+sl*4)]],1,{color:IC,w:4})+dot(A.X(t0),A.Y(q0),9,C.hi);
  s+=card(680,90,480,330,T(`${R_}\\,${DQ}=${V0}-${QC_}`,920,160,{size:40})
   +label('q が 増える → 残りが 減る',920,245,{size:28,color:C.ink,anchor:'middle'})
   +label('→ 増え方が 鈍る',920,290,{size:28,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.6,.8),label('q ＝ 6 μC：2 mA',920,370,{size:30,color:IC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S5 空気抵抗と同じ形 =====
 [K+'compare']:(p)=>eqRows({gTop:seg(p,.05,.3),gBot:seg(p,.35,.6)})+fade(seg(p,.35,.6),label('空気抵抗・中級',1060,170,{size:22,color:C.dim,anchor:'middle'})),
 [K+'map1']:(p)=>{
  let s=eqRows();
  s+=colBox(6,QC,seg(p,.1,.25),70)+colBox(1,QC,seg(p,.1,.25),120);
  s+=fade(seg(p,.1,.25),label('v ↔ q',830,440,{size:28,color:QC,anchor:'middle',weight:700}));
  s+=colBox(0,C.ink,seg(p,.5,.65),80)+fade(seg(p,.5,.65),label('m ↔ R',300,440,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'map2']:(p)=>{
  let s=eqRows();
  s+=colBox(6,QC,.5,70)+colBox(1,QC,.5,120)+colBox(0,C.ink,.5,80);
  s+=colBox(3,VC,seg(p,.05,.2),100)+fade(seg(p,.05,.2),label('mg ↔ V₀',590,440,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=colBox(5,CC,seg(p,.3,.45),70)+fade(seg(p,.3,.45),label('k ↔ 1/C',750,470,{size:28,color:CC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),card(900,190,270,120,T(`${QC_}=\\dfrac{1}{${C_}}\\,${q_}`,1035,255,{size:36}),1,CC));
  return s;
 },
 [K+'notmatch']:(p)=>{
  let s=fade(.35,eqRows());
  s+=card(250,110,700,300,label('対応するのは 式の形だけ',600,180,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('R は 質量のような',600,265,{size:28,color:C.ink,anchor:'middle'})+label('「動きにくさ」 ではない',600,315,{size:30,color:C.a,anchor:'middle',weight:700})
    +label('（R は 電流を 流れにくくする だけ）',600,370,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'predict']:(p)=>{
  const {A,svg}=qGraph(1,seg(p,0,.4),{w:480});
  let s=svg+fade(seg(p,.35,.5),label('？',A.X(31)+10,A.Y(18)+10,{size:40,color:C.hi,weight:700}));
  s+=card(680,110,480,280,label('同じ形 → 同じ手で',920,175,{size:28,color:C.ink,anchor:'middle'})
   +label('電荷は いくつに 近づく？',920,250,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'term']:(p)=>{
  let s=tex(DRAG,600,95,{size:46});
  s+=fade(seg(p,.1,.3),label('右の辺 ＝ 0',600,190,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),tex('mg-kv=0',400,290,{size:48})+label('→',600,300,{size:40,color:C.dim,anchor:'middle'})+tex('v_\\infty=\\dfrac{mg}{k}',800,290,{size:52}));
  s+=fade(seg(p,.6,.8),label('終端速度',800,410,{size:28,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'term2']:(p)=>{
  let s=T(ODE,600,85,{size:44,color:C.dim});
  s+=fade(seg(p,.05,.25),T(`${V0}-${QC_}=0`,330,215,{size:50})+label('右の辺 ＝ 0',330,300,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),T(`${QC_}=${V0}`,700,215,{size:50})+label('q について 解く',700,300,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),T(QINF,600,400,{size:64})+highlight(420,345,360,110,1,QC));
  return s;
 },
 [K+'termnum']:(p)=>{
  let s=circuit({q:18,I:0})+fade(seg(p,.4,.6),brC(cs(VC,'6'+U('V')))+brR(cs(VC,'0'+U('V'))));
  s+=card(680,90,480,330,T(`${cs(QC,'q_\\infty')}=${cs(CC,'3'+U('\\mu F'))}\\times${cs(VC,'6'+U('V'))}`,920,160,{size:38})
   +T(`=${cs(QC,'18'+U('\\mu C'))}`,920,235,{size:46})
   +fade(seg(p,.4,.6),label('コンデンサ 6 V、抵抗 0 V',920,315,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.7,.85),label('電流は 止まる',920,370,{size:30,color:IC,anchor:'middle',weight:700})),seg(p,0,.15),QC);
  return s;
 },
 [K+'cap']:(p)=>{
  const {A,svg}=qGraph(1,1,{w:480});
  let s=svg+qinfLine(A);
  s+=card(680,110,480,280,label('初級：板の電圧 ＝ 電池 で 止まる',920,175,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.5),label('＝ 式の 行き先',920,245,{size:32,color:C.hi,anchor:'middle',weight:700})+T(QINF,920,330,{size:46})),seg(p,0,.15),QC);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=circuit({q:12,I:.35});
  s+=card(680,120,480,260,label('確かめ',920,175,{size:26,color:C.dim,anchor:'middle'})
   +label('q ＝ 12 μC の 瞬間',920,240,{size:30,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),T(`${I_}=\\;?\\;${U('mA')}`,920,320,{size:48})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'quizA']:(p)=>{
  let s=circuit({q:12,I:.35})+fade(seg(p,.05,.2),brC(cs(VC,'4'+U('V'))))+fade(seg(p,.35,.5),brR(cs(VC,'2'+U('V'))));
  s+=card(680,50,480,420,T(`${cs(VC,'V_C')}=\\dfrac{${cs(QC,'12')}}{${cs(CC,'3')}}=${cs(VC,'4'+U('V'))}`,920,135,{size:40})
   +fade(seg(p,.3,.5),T(`${cs(VC,'V_R')}=6-4=${cs(VC,'2'+U('V'))}`,920,255,{size:40}))
   +fade(seg(p,.6,.8),T(`${I_}=\\dfrac{${cs(VC,'2'+U('V'))}}{2${U('k\\Omega')}}=${cs(IC,'1'+U('mA'))}`,920,380,{size:40})),seg(p,0,.12),IC);
  return s;
 },
 [K+'slow']:(p)=>{
  const {A,svg}=qGraph(1,1,{w:480});const t0=mix(0,24,seg(p,.05,.85)),q0=qt(t0),sl=(18-q0)/6;
  let s=svg+qinfLine(A)+draw([[A.X(Math.max(0,t0-4)),A.Y(q0-sl*Math.min(4,t0))],[A.X(t0+4),A.Y(q0+sl*4)]],1,{color:IC,w:4})+dot(A.X(t0),A.Y(q0),9,C.hi);
  s+=card(680,90,480,330,label('電流',920,145,{size:26,color:C.dim,anchor:'middle'})
   +label(`${sl.toFixed(2)} mA`,920,210,{size:44,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('終端速度に 近づくほど',920,300,{size:26,color:C.ink,anchor:'middle'})+label('加速度が 小さくなるのと 同じ',920,345,{size:26,color:C.v,anchor:'middle',weight:700})),seg(p,0,.15),IC);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=T(KV,330,130,{size:46})+label('＋',600,140,{size:40,color:C.dim,anchor:'middle'})+T(`${I_}=${DQ}`,830,130,{size:46});
  s+=fade(seg(p,.3,.5),label('↓',600,225,{size:40,color:C.hi,anchor:'middle'})+T(ODE,600,370,{size:66})+highlight(280,262,640,190,1,C.hi));
  return s;
 },
 [K+'sum2']:(p)=>{
  const col=(x,title,color,body,g)=>card(x,70,260,250,label(title,x+130,115,{size:24,color,anchor:'middle',weight:700})+body,g,color);
  let s=col(40,'電位の性質',VC,label('一周で 元の高さ',170,200,{size:24,color:C.ink,anchor:'middle'})+label('（第2法則）',170,250,{size:22,color:C.dim,anchor:'middle'}),seg(p,.02,.15));
  s+=col(330,'実験の法則',IC,T(`${R_}${I_}`,460,210,{size:44}),seg(p,.15,.3));
  s+=col(620,'定義から',QC,T(QC_,750,190,{size:40})+T(`${I_}=${DQ}`,750,270,{size:32}),seg(p,.3,.45));
  s+=col(910,'導いた結果',C.hi,T(`${R_}${DQ}`,1040,180,{size:30})+T(`=${V0}-${QC_}`,1040,250,{size:30}),seg(p,.6,.75));
  s+=fade(seg(p,.6,.75),label('仮定：V₀・R・C 一定、導線と電池の中の抵抗は 無視',600,400,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sum3']:(p)=>{
  let s=tex(DRAG,330,110,{size:40})+label('同じ形',600,118,{size:26,color:C.hi,anchor:'middle',weight:700})+T(ODE,870,110,{size:40});
  s+=fade(seg(p,.3,.5),tex('v_\\infty=\\dfrac{mg}{k}',330,260,{size:48})+label('右の辺 ＝ 0',600,268,{size:26,color:C.hi,anchor:'middle'})+T(QINF,870,260,{size:48}));
  s+=fade(seg(p,.55,.7),label('＝ 18 μC（6 V・3 μF）',870,370,{size:28,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'nextq']:(p)=>{
  // drag: v–t with the gap w (orange), like 空気抵抗・中級 2/2
  const A=axes({x:100,y:450,w:480,h:330,xmax:1.6,ymax:6,xticks:[.5,1,1.5],yticks:[1,3,5],grid:true,xlabel:'t [s]',ylabel:'速度 v [m/s]',xcolor:TC,ycolor:C.v});
  const vex=t=>5*(1-Math.exp(-2*t));
  let s=A.svg+line(A.X(0),A.Y(5),A.X(1.6),A.Y(5),{color:C.hi,w:3,dash:'10 7'})+label('v∞',A.X(1.6),A.Y(5)-12,{size:24,color:C.hi,weight:700,anchor:'end'})+A.plot(vex,{from:0,to:1.55,color:C.v,w:5});
  const top=[],bot=[];for(let i=0;i<=60;i++){const t=1.55*i/60;top.push([A.X(t),A.Y(5)]);bot.push([A.X(t),A.Y(vex(t))]);}
  s+=fade(seg(p,.1,.3),poly([...top,...bot.reverse()],{fill:UC,fo:.25}));
  s+=fade(seg(p,.1,.3),label('差 w',A.X(.3),A.Y(4.2),{size:26,color:UC,weight:700}));
  s+=card(680,110,480,280,label('空気抵抗・中級 2/2',920,160,{size:24,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{d${cs(UC,'w')}}{d${t_}}=-\\dfrac{${cs(UC,'w')}}{${cs(TC,'\\tau')}}`,920,240,{size:44})
   +fade(seg(p,.55,.7),label('同じ形なら 同じ手が 使える',920,340,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'nextq2']:(p)=>{
  const {A,svg}=qGraph(1,1,{w:480});
  let s=svg+qinfLine(A);
  const top=[],bot=[];for(let i=0;i<=60;i++){const t=31*i/60;top.push([A.X(t),A.Y(18)]);bot.push([A.X(t),A.Y(qt(t))]);}
  s+=fade(seg(p,.05,.25),poly([...top,...bot.reverse()],{fill:UC,fo:.25})+label('18 μC までの 差',A.X(.8),A.Y(16.4),{size:22,color:UC,weight:700}));
  s+=card(680,100,480,300,label('次の問い',920,150,{size:24,color:C.dim,anchor:'middle'})
   +label('差に 注目すると',920,215,{size:28,color:UC,anchor:'middle',weight:700})
   +label('どんな 曲線で 近づく？',920,275,{size:30,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('時定数は 何になる？',920,340,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25),C.hi);
  return s;
 },
};
