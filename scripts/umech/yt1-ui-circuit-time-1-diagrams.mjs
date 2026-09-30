// YouTube シリーズ「回路の時間変化・初級 1/2」(ys-ui-circuit-time-1) — 図。Stage 1200×515.
// 色：電圧 V 紫、電荷 q 桃、電流 I 緑、時間 t 金、容量 C 黄、正電荷 赤、負電荷 青（コンデンサ・電流の回と同じ）。
// 回路：電池（長い線＝＋極が左）→ 下の導線を左へ → 左の辺を上へ → 抵抗（上の左）→ コンデンサの左の板（＋）。
//   右の板（−）→ 右の辺を下へ → 電池の−極。スイッチは下の導線の左。
// 補助線①：6 V の棒。コンデンサの分（下・桃）＋抵抗の分（上・緑）。②：q–t グラフの接線と電流計の針を同じ緑。
// 数値：R＝1 MΩ、C＝2 μF、V₀＝6 V。V_C＝q/2、V_R＝6−q/2、I＝V_R（μA）。q(t)＝12(1−e^(−t/2)) μC。
import {C,clamp,mix,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes} from './anim.mjs';
import {cs,card,T} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='ui-circuit-time-1:';
const POS=C.a,NEG='#7fb3ff',QC=C.p,TC=C.t,IC=C.F,VC=C.v,CC=C.hi,BC=C.E;
const U=s=>`\\,\\mathrm{${s}}`;
const panel=(x,y,w,h,inner,g=1,stroke=C.faint)=>card(x,y,w,h,inner,g,stroke);
const vc=q=>q/2, vr=q=>6-q/2, cur=q=>6-q/2;           // V, V, μA
const qt=t=>12*(1-Math.exp(-t/2));                     // μC
const tq=q=>-2*Math.log(1-q/12);                        // s
const f1=v=>String(Number(v.toFixed(1)));

// ---- circuit ----------------------------------------------------------------------------------
const CL=80,CR=600,CT=140,CB=410,BATX=350,SWA=150,SWB=215,RA=180,RB=320,PL=440,PR=500;
function zig(x1,x2,y,color=C.ink){const pts=[[x1,y]];const n=6;for(let i=1;i<n*2;i++)pts.push([x1+(x2-x1)*i/(n*2),y+(i%2?-18:18)]);pts.push([x2,y]);return draw(pts,1,{color,w:4});}
function coilLoops(x1,x2,y,{n=8,ry=70,rx=16,color=C.ink,w=4}={}){const d=(x2-x1)/n;let s='';for(let i=0;i<n;i++){const cx=x1+(i+.5)*d;s+=`<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${color}" stroke-width="${w}"/>`;}return s;}
function coilSym(x1,x2,y,{n=5,color=C.ink,w=4,r}={}){const d=(x2-x1)/n,rr=r??d/2;let s=`<path d="M${x1} ${y}`;for(let i=0;i<n;i++)s+=` a${d/2} ${rr} 0 0 1 ${d} 0`;return s+`" fill="none" stroke="${color}" stroke-width="${w}"/>`;}
function battery(x,y,{text='電池 6 V',g=1}={}){
 let s=line(x-10,y-34,x-10,y+34,{color:C.ink,w:5})+line(x+10,y-18,x+10,y+18,{color:C.ink,w:9});
 s+=label('＋',x-32,y-22,{size:24,color:POS,anchor:'middle',weight:700})+label('−',x+32,y-22,{size:26,color:NEG,anchor:'middle',weight:700});
 if(text)s+=label(text,x,y+62,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
function plateCharges(q){
 const n=clamp(Math.round(q/2),0,6);let s='';
 for(let k=0;k<n;k++){const y=CT-45+k*18;s+=label('＋',PL+13,y+8,{size:20,color:POS,anchor:'middle',weight:700})+label('−',PR-13,y+8,{size:22,color:NEG,anchor:'middle',weight:700});}
 return s;
}
// o: {q, sw (0 open .. 1 closed), I (0..1 arrow strength), noR, labels, vals}
function circuit({q=0,sw=1,I=0,noR=false,vals=true,g=1,hiR=0,hiC=0}={}){
 let s='';
 const W=(pts)=>draw(pts,1,{color:C.dim,w:4});
 s+=W([[SWA,CB],[CL,CB],[CL,CT],[RA,CT]]);
 s+=noR?W([[RA,CT],[RB,CT]]):zig(RA,RB,CT);
 s+=W([[RB,CT],[PL-8,CT]])+W([[PR+8,CT],[CR,CT],[CR,CB],[BATX+10,CB]])+W([[SWB,CB],[BATX-10,CB]]);
 // plates
 s+=rect(PL-8,CT-55,8,110,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+rect(PR,CT-55,8,110,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2});
 s+=plateCharges(q);
 // switch
 const ang=mix(-0.55,0,clamp(sw)),L=SWB-SWA;
 s+=dot(SWA,CB,6,C.ink)+dot(SWB,CB,6,C.ink)+line(SWA,CB,SWA+L*Math.cos(ang),CB+L*Math.sin(ang),{color:C.ink,w:4});
 s+=label('スイッチ',(SWA+SWB)/2,CB+44,{size:22,color:C.dim,anchor:'middle'});
 s+=battery(BATX,CB);
 if(!noR)s+=label(vals?'抵抗 1 MΩ':'抵抗 R',(RA+RB)/2,CT-38,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=label(vals?'コンデンサ 2 μF':'コンデンサ C',(PL+PR)/2,CT-70,{size:24,color:CC,anchor:'middle',weight:700});
 if(hiR)s+=highlight(RA-12,CT-28,RB-RA+24,56,hiR,IC);
 if(hiC)s+=highlight(PL-20,CT-64,PR-PL+40,128,hiC,QC);
 if(I>0.01){
  const w=3+4*clamp(I),o={color:IC,w,head:10+6*clamp(I)};
  s+=fade(Math.min(1,.35+I),arrow(BATX-45,CB,SWB+14,CB,o)+arrow(CL,CB-50,CL,CT+50,o)+arrow(CL+14,CT,RA-14,CT,o)+arrow(CR,CT+50,CR,CB-50,o)+arrow(CR-30,CB,BATX+45,CB,o)
   +label('電流 I',CL+16,(CT+CB)/2+8,{size:24,color:IC,weight:700}));
 }
 return fade(g,s);
}
function vbr(a,b,y,text,color,g=1,dy=0){return fade(g,line(a,y,b,y,{color,w:3})+line(a,y-9,a,y+9,{color,w:3})+line(b,y-9,b,y+9,{color,w:3})+T(text,(a+b)/2,y+36+dy,{size:30}));}
const brR=(t,g=1)=>vbr(RA,RB,CT+62,t,IC,g);
const brC=(t,g=1,dy=0)=>vbr(PL-8,PR+8,CT+84,t,QC,g,dy);

// ---- 6 V bar (補助線①) -------------------------------------------------------------------------
function bar(v,{x=720,base=450,k=52,w=76,g=1,nums=true,lab=true}={}){
 const hc=k*v,hr=k*(6-v);let s='';
 s+=rect(x,base-hc,w,hc,{fill:QC,fo:.55,stroke:QC,sw:2,rx:3})+rect(x,base-6*k,w,hr,{fill:IC,fo:.5,stroke:IC,sw:2,rx:3});
 s+=line(x-18,base,x-18,base-6*k,{color:VC,w:3})+line(x-26,base,x-10,base,{color:VC,w:3})+line(x-26,base-6*k,x-10,base-6*k,{color:VC,w:3});
 s+=label('6 V',x-30,base-3*k+9,{size:28,color:VC,anchor:'end',weight:700});
 if(lab){
  if(hr>30)s+=label(nums?`抵抗 ${f1(6-v)} V`:'抵抗の分',x+w+14,base-hc-hr/2+9,{size:26,color:IC,weight:700});
  if(hc>30)s+=label(nums?`コンデンサ ${f1(v)} V`:'コンデンサの分',x+w+14,base-hc/2+9,{size:26,color:QC,weight:700});
 }
 return fade(g,s);
}
// ---- ammeter (補助線②) -------------------------------------------------------------------------
function meter(I,{cx=930,cy=250,r=120,g=1,title=true}={}){
 const A=v=>Math.PI*(1-v/6)*0.9+Math.PI*.05; // 0 → left, 6 → right (upper half)
 let s=ring(cx,cy,r+18,{color:C.dim,w:3,fill:'#131f38'});
 const arc=Array.from({length:61},(_,i)=>{const a=A(6*i/60);return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
 s+=draw(arc,1,{color:C.dim,w:3});
 for(const v of [0,2,4,6]){const a=A(v);s+=line(cx+(r-14)*Math.cos(a),cy-(r-14)*Math.sin(a),cx+r*Math.cos(a),cy-r*Math.sin(a),{color:C.dim,w:3})+label(String(v),cx+(r-38)*Math.cos(a),cy-(r-38)*Math.sin(a)+8,{size:22,color:C.dim,anchor:'middle'});}
 const a=A(clamp(I,0,6));
 s+=line(cx,cy,cx+(r-8)*Math.cos(a),cy-(r-8)*Math.sin(a),{color:IC,w:6})+dot(cx,cy,9,IC);
 s+=label(`${f1(I)} μA`,cx,cy+60,{size:34,color:IC,anchor:'middle',weight:700});
 if(title)s+=label('電流計',cx,cy-r-34,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
// ---- q–t graph --------------------------------------------------------------------------------
function qGraph(g=1,curve=1,{to=8}={}){
 const A=axes({x:100,y:450,w:520,h:340,xmax:8.6,ymax:13.8,xticks:[2,4,6,8],yticks:[4,8,12],grid:true,g,xlabel:'t [s]',ylabel:'電荷 q [μC]',xcolor:TC,ycolor:QC});
 return {A,svg:A.svg+A.plot(qt,{from:0,to,p:curve,color:QC,w:5})};
}
function tangentAt(A,t0,{g=1,half=1.3,w=4}={}){const q0=qt(t0),k=(12-q0)/2;const a=Math.max(0,t0-half),b=t0+half;return draw([[A.X(a),A.Y(q0+k*(a-t0))],[A.X(b),A.Y(q0+k*(b-t0))]],g,{color:IC,w});}
function slopeTri(A,t0,g=1){const q0=qt(t0),k=(12-q0)/2;return fade(g,line(A.X(t0),A.Y(q0),A.X(t0+1),A.Y(q0),{color:TC,w:3})+line(A.X(t0+1),A.Y(q0),A.X(t0+1),A.Y(q0+k),{color:IC,w:3})
 +label('1 s',A.X(t0+.5),A.Y(q0)+28,{size:22,color:TC,anchor:'middle',weight:700})+label(`${f1(k)} μC`,A.X(t0+1)+10,A.Y(q0+k/2)+8,{size:22,color:IC,weight:700}));}

// ---- potential (height) around the loop -------------------------------------------------------
function heights(v,{g=1,nums=true,show=1}={}){
 const x0=690,base=430,k=46,Y=h=>base-k*h;
 let s=line(x0-10,base+4,x0-10,Y(6.8),{color:C.dim,w:2.5})+label('電位（高さ）',x0-4,Y(6.8)-14,{size:22,color:C.dim});
 const pts=[[x0,Y(0)],[720,Y(0)],[720,Y(6)],[800,Y(6)],[880,Y(6-v.r)],[960,Y(6-v.r)],[960,Y(0)],[1140,Y(0)]];
 s+=draw(pts.slice(0,3),seg(show,0,.3),{color:VC,w:5})+draw(pts.slice(2,5),seg(show,.3,.6),{color:IC,w:5})+draw(pts.slice(4,8),seg(show,.6,1),{color:QC,w:5});
 s+=fade(seg(show,.1,.3),label(nums?'電池 ＋6 V':'電池で 上がる',732,Y(.9),{size:22,color:VC,weight:700}));
 s+=fade(seg(show,.4,.6),label(nums?`抵抗 −${f1(v.r)} V`:'抵抗で 下がる',830,Y(6)-16,{size:22,color:IC,weight:700}));
 s+=fade(seg(show,.7,.9),label(nums?`コンデンサ −${f1(6-v.r)} V`:'コンデンサで 下がる',975,Y(.9),{size:22,color:QC,weight:700}));
 s+=fade(seg(show,.9,1),label('元の高さ',1140,base+34,{size:22,color:C.hi,anchor:'end',weight:700}));
 return fade(g,s);
}

export const ytUiCircuitTime1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recall']:(p)=>{
  const item=(x,sym,name,g,color=C.ink)=>fade(g,sym+label(name,x,330,{size:28,color,anchor:'middle',weight:700}));
  let s='';
  s+=item(260,zig(190,330,260),'抵抗',seg(p,.1,.25));
  s+=item(600,rect(578,205,8,110,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+rect(614,205,8,110,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+line(520,260,578,260,{color:C.dim,w:4})+line(622,260,680,260,{color:C.dim,w:4}),'コンデンサ',seg(p,.2,.35),CC);
  s+=item(940,coilSym(870,1010,262,{n:5,r:26}),'コイル',seg(p,.3,.45));
  s+=fade(seg(p,.5,.7),label('電流は 時間とともに どう変わる？',600,430,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('前回の最後の問い',600,110,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=zig(190,330,260)+label('抵抗',260,330,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=rect(578,205,8,110,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+rect(614,205,8,110,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+line(520,260,578,260,{color:C.dim,w:4})+line(622,260,680,260,{color:C.dim,w:4})+label('コンデンサ',600,330,{size:28,color:CC,anchor:'middle',weight:700});
  s+=fade(mix(1,.3,seg(p,.4,.6)),coilSym(870,1010,262,{n:5,r:26})+label('コイル',940,330,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=highlight(160,160,560,220,seg(p,.1,.3),C.hi)+fade(seg(p,.1,.3),label('今回',440,145,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('次の本',940,405,{size:28,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'recallcap']:(p)=>{
  let s=circuit({q:12*seg(p,.05,.6),noR:true,vals:false,I:.8*(1-seg(p,.45,.65))});
  s+=panel(700,110,460,270,label('コンデンサの回',930,165,{size:26,color:C.dim,anchor:'middle'})
   +label('電荷が たまり',930,225,{size:30,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('板の電圧 ＝ 電池の電圧',930,285,{size:28,color:VC,anchor:'middle',weight:700})+label('で 止まる',930,335,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'circuit']:(p)=>{
  let s=circuit({q:0,sw:0,g:seg(p,0,.2)});
  s+=highlight(RA-14,CT-66,RB-RA+28,100,seg(p,.3,.45)*(1-seg(p,.55,.7)),C.hi);
  s+=panel(700,90,460,330,label('電池',760,160,{size:28,color:C.dim})+label('6 V',1100,160,{size:30,color:VC,anchor:'end',weight:700})
   +label('抵抗',760,240,{size:28,color:C.dim})+label('1 MΩ',1100,240,{size:30,color:C.ink,anchor:'end',weight:700})
   +label('コンデンサ',760,320,{size:28,color:C.dim})+label('2 μF',1100,320,{size:30,color:CC,anchor:'end',weight:700})
   +fade(seg(p,.7,.9),label('（コンデンサの回と同じ）',930,380,{size:22,color:C.dim,anchor:'middle'})),seg(p,.15,.3));
  return s;
 },
 [K+'mega']:(p)=>{
  const sw=seg(p,.6,.75);
  let s=circuit({q:0,sw,I:.9*seg(p,.72,.85)});
  s+=panel(700,90,460,330,T(`1${U('M\\Omega')}=1000000\\,\\Omega`,930,165,{size:40})
   +label('メガ ＝ 100万',930,225,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('はじめ 電荷 q ＝ 0',930,300,{size:28,color:QC,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),T(`${cs(TC,'t')}=0`,850,370,{size:36})+label('で スイッチを入れる',1010,378,{size:24,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'question']:(p)=>{
  let s=circuit({q:4*p,I:.8});
  s+=panel(700,120,460,260,label('電流は 時間とともに',930,190,{size:30,color:C.ink,anchor:'middle'})
   +label('どう変わる？',930,245,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.45,.65),label('まず：電池の 6 V は',930,310,{size:26,color:C.dim,anchor:'middle'})+label('どう分かれる？',930,350,{size:28,color:VC,anchor:'middle',weight:700})),seg(p,.05,.25),C.hi);
  return s;
 },
 // ===== S2 電圧の分かれ方 =====
 [K+'height']:(p)=>{
  let s=circuit({q:4,I:.6,g:.9});
  const loop=[[CL-26,CB+80],[CL-26,CT-26],[CR+26,CT-26],[CR+26,CB+80],[CL-26,CB+80]];
  s+=draw(loop,seg(p,.3,.8),{color:C.hi,w:3,dash:'10 8'});
  s+=panel(700,120,460,260,label('電位の回',930,180,{size:26,color:C.dim,anchor:'middle'})
   +label('電位 ＝ 高さの地図',930,235,{size:30,color:VC,anchor:'middle',weight:700})
   +fade(seg(p,.55,.75),label('一周して 元の場所',930,300,{size:28,color:C.ink,anchor:'middle'})+label('→ 高さも 元に戻る',930,345,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'steps']:(p)=>{
  let s=circuit({q:4,I:.6});
  s+=panel(660,50,510,440,'',1)+heights({r:4},{nums:false,show:seg(p,.05,.9)});
  return s;
 },
 [K+'sum']:(p)=>{
  let s=circuit({q:4,I:.6});
  s+=brR(cs(VC,'V_R'),seg(p,.05,.2))+brC(cs(VC,'V_C'),seg(p,.1,.25));
  s+=panel(660,50,510,440,'',1)+heights({r:4},{nums:false,show:1,g:1-seg(p,.35,.5)});
  s+=fade(seg(p,.45,.6),T(`${cs(VC,'V_R')}+${cs(VC,'V_C')}=${cs(VC,'6'+U('V'))}`,915,210,{size:48})
   +label('いつでも',915,290,{size:28,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.7,.85),label('導線の抵抗は 無視（仮定）',915,390,{size:24,color:C.dim,anchor:'middle'})));
  return s;
 },
 [K+'example']:(p)=>{
  let s=circuit({q:4,I:.6});
  s+=brC(cs(VC,'2'+U('V')),seg(p,.05,.2))+brR(cs(VC,'?'),seg(p,.1,.25)*(1-seg(p,.55,.65)))+brR(cs(VC,'4'+U('V')),seg(p,.6,.75));
  s+=panel(660,50,510,440,'',1)+heights({r:4},{nums:true,show:1,g:seg(p,.55,.75)});
  s+=fade(seg(p,.25,.45)*(1-seg(p,.5,.6)),T(`${cs(VC,'6'+U('V'))}-${cs(VC,'2'+U('V'))}=${cs(VC,'4'+U('V'))}`,915,270,{size:46}));
  return s;
 },
 [K+'bar']:(p)=>{
  let s=circuit({q:4,I:.6})+brC(cs(VC,'2'+U('V')))+brR(cs(VC,'4'+U('V')));
  s+=bar(2,{x:760,g:seg(p,.05,.25),lab:false});
  s+=fade(seg(p,.25,.45),label('抵抗 4 V',856,450-52*4,{size:28,color:IC,weight:700})+label('＝ 電流と同じ緑',856,450-52*4+38,{size:24,color:IC}));
  s+=fade(seg(p,.5,.7),label('コンデンサ 2 V',856,450-52+4,{size:28,color:QC,weight:700})+label('＝ 電荷と同じ桃',856,450-52+42,{size:24,color:QC}));
  return s;
 },
 [K+'parts']:(p)=>{
  let s=circuit({q:4,I:.6,vals:false});
  s+=brR(`${cs(VC,'V_R')}=R${cs(IC,'I')}`,seg(p,.05,.25))+brC(`${cs(VC,'V_C')}=\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,seg(p,.5,.7),44);
  s+=panel(680,70,480,380,label('抵抗',920,125,{size:26,color:IC,anchor:'middle',weight:700})
   +T(`${cs(VC,'V_R')}=R${cs(IC,'I')}`,920,190,{size:50})+label('オームの法則（実験の法則）',920,245,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.7),label('コンデンサ',920,300,{size:26,color:QC,anchor:'middle',weight:700})+T(`${cs(VC,'V_C')}=\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,920,370,{size:46})
    +label('容量の定義 C ＝ Q/V から',920,430,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=panel(120,30,960,460,'',1);
  s+=T(`${cs(VC,'6'+U('V'))}=${cs(VC,'V_R')}+${cs(VC,'V_C')}`,600,100,{size:46});
  s+=fade(seg(p,.15,.35),T(`${cs(VC,'6'+U('V'))}=R${cs(IC,'I')}+\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,600,215,{size:50}));
  s+=fade(seg(p,.5,.7),T(`${cs(VC,'V_0')}=R${cs(IC,'I')}+\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,600,365,{size:58})+highlight(380,300,440,130,1,C.hi));
  s+=fade(seg(p,.5,.7),label('V₀ ＝ 電池の電圧',600,470,{size:26,color:VC,anchor:'middle'}));
  return s;
 },
 [K+'numC']:(p)=>{
  let s=circuit({q:4,I:.6})+brC(cs(VC,'2'+U('V')))+brR(cs(VC,'4'+U('V')));
  s+=panel(660,90,500,330,label('コンデンサの電荷',910,150,{size:28,color:QC,anchor:'middle',weight:700})
   +T(`${cs(QC,'q')}=${cs(CC,'C')}\\,${cs(VC,'V_C')}`,910,230,{size:46})
   +fade(seg(p,.3,.5),T(`=${cs(CC,'2'+U('\\mu F'))}\\times${cs(VC,'2'+U('V'))}`,910,310,{size:42}))
   +fade(seg(p,.6,.8),T(`=${cs(QC,'4'+U('\\mu C'))}`,910,385,{size:46})),seg(p,0,.15),QC);
  s+=highlight(PL-20,CT-64,PR-PL+40,128,seg(p,.6,.8),QC);
  return s;
 },
 [K+'numR']:(p)=>{
  let s=circuit({q:4,I:.6})+brC(cs(VC,'2'+U('V')))+brR(cs(VC,'4'+U('V')));
  s+=panel(660,60,500,400,label('電流',910,110,{size:28,color:IC,anchor:'middle',weight:700})
   +T(`${cs(IC,'I')}=\\dfrac{${cs(VC,'V_R')}}{R}=\\dfrac{${cs(VC,'4'+U('V'))}}{1${U('M\\Omega')}}=${cs(IC,'4'+U('\\mu A'))}`,910,200,{size:40})
   +fade(seg(p,.45,.65),T(`\\dfrac{1${U('V')}}{1000000\\,\\Omega}=\\dfrac{1}{1000000}${U('A')}`,910,320,{size:34})
    +T(`=1${U('\\mu A')}`,910,410,{size:40,color:IC})),seg(p,0,.15),IC);
  s+=highlight(RA-12,CT-28,RB-RA+24,56,seg(p,.1,.3),IC);
  return s;
 },
 // ===== S3 電流はグラフの傾き =====
 [K+'inflow']:(p)=>{
  const q=mix(3,5,seg(p,.05,.9));
  let s=circuit({q,I:.7});
  s+=highlight(PL-20,CT-64,PR-PL+40,128,seg(p,.15,.35),QC);
  s+=panel(680,100,480,300,label('左の板へ 流れ込む',920,165,{size:30,color:IC,anchor:'middle',weight:700})
   +label('→ ＋ の電荷が 増える',920,215,{size:28,color:POS,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('同じだけ 右の板から 流れ出す',920,295,{size:26,color:IC,anchor:'middle'})+label('→ − の電荷が 増える',920,345,{size:28,color:NEG,anchor:'middle',weight:700})),seg(p,.1,.3));
  return s;
 },
 [K+'rate']:(p)=>{
  let s=circuit({q:4,I:.6});
  s+=panel(680,70,480,380,label('電流の回',920,125,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cs(IC,'I')}=\\dfrac{d${cs(QC,'Q')}}{d${cs(TC,'t')}}`,920,195,{size:42})
   +fade(seg(p,.3,.5),label('充電の電流',920,275,{size:28,color:IC,anchor:'middle',weight:700})
    +T(`${cs(IC,'I')}=\\dfrac{d${cs(QC,'q')}}{d${cs(TC,'t')}}`,920,360,{size:54})
    +label('q が 1秒あたりに 増える速さ',920,432,{size:24,color:C.ink,anchor:'middle'})),seg(p,0,.15),IC);
  return s;
 },
 [K+'graph']:(p)=>{
  const {A,svg}=qGraph(seg(p,0,.2),seg(p,.2,.9));
  let s=svg;
  s+=panel(720,120,440,240,label('横軸 時刻 t',940,190,{size:30,color:TC,anchor:'middle',weight:700})+label('縦軸 電荷 q',940,250,{size:30,color:QC,anchor:'middle',weight:700})
   +label('充電の様子',940,310,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.25));
  return s;
 },
 [K+'tangent']:(p)=>{
  const {A,svg}=qGraph();const t0=tq(4);
  let s=svg+dot(A.X(t0),A.Y(4),9,C.hi)+fade(seg(p,.05,.2),label('q ＝ 4 μC',A.X(t0)+16,A.Y(4)+66,{size:24,color:QC,weight:700}));
  s+=tangentAt(A,t0,{g:seg(p,.2,.45),half:1.6});
  s+=slopeTri(A,t0,seg(p,.5,.7));
  s+=panel(720,140,440,220,label('接する直線の傾き',940,205,{size:28,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{${cs(IC,'4'+U('\\mu C'))}}{${cs(TC,'1'+U('s'))}}`,940,295,{size:46}),seg(p,.6,.8),IC);
  return s;
 },
 [K+'meter']:(p)=>{
  const {A,svg}=qGraph();const t0=tq(4);
  let s=svg+dot(A.X(t0),A.Y(4),9,C.hi)+tangentAt(A,t0,{half:1.6})+slopeTri(A,t0,1);
  s+=meter(4,{cx:940,cy:250,r:120,g:seg(p,.1,.3)});
  s+=fade(seg(p,.45,.65),label('傾き ＝ 針',940,470,{size:28,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.25),T(`${cs(IC,'4'+U('\\mu C/s'))}=${cs(IC,'4'+U('\\mu A'))}`,370,75,{size:36}));
  return s;
 },
 // ===== S4 充電が進むと =====
 [K+'start']:(p)=>{
  let s=circuit({q:0,I:1})+brC(cs(VC,'0'+U('V')),seg(p,.1,.3))+brR(cs(VC,'6'+U('V')),seg(p,.5,.7));
  s+=bar(0,{x:760,g:seg(p,.3,.5)});
  s+=fade(seg(p,.05,.25),label('スイッチを入れた瞬間',760,70,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'startI']:(p)=>{
  const {A,svg}=qGraph(1,seg(p,0,.3),{to:8});
  let s=svg+dot(A.X(0),A.Y(0),9,C.hi)+tangentAt(A,0,{g:seg(p,.35,.55),half:1.4})+slopeTri(A,0,seg(p,.45,.6));
  s+=meter(6,{cx:940,cy:230,r:110,g:seg(p,.05,.25)});
  s+=fade(seg(p,.05,.25),T(`\\dfrac{${cs(VC,'6'+U('V'))}}{1${U('M\\Omega')}}=${cs(IC,'6'+U('\\mu A'))}`,940,440,{size:36}));
  s+=fade(seg(p,.6,.8),label('一番 急',A.X(1.5)+14,A.Y(9.4),{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=circuit({q:4*seg(p,.1,.9),I:.8});
  s+=panel(700,130,460,240,label('電荷が たまっていくと',930,200,{size:30,color:QC,anchor:'middle',weight:700})
   +label('電流は どうなる？',930,265,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('増える？ 減る？ 一定？',930,325,{size:26,color:C.dim,anchor:'middle'})),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'later']:(p)=>{
  const q=mix(4,8,seg(p,.05,.4));
  let s=circuit({q,I:cur(q)/6})+brC(cs(VC,f1(vc(q))+U('V')))+brR(cs(VC,f1(vr(q))+U('V')));
  s+=bar(vc(q),{x:760});
  s+=fade(seg(p,.55,.75),label(`電流 ${f1(cur(q))} μA`,760,490,{size:28,color:IC,weight:700}));
  s+=fade(seg(p,.05,.2),label(`q ＝ ${f1(q)} μC`,760,70,{size:28,color:QC,weight:700}));
  return s;
 },
 [K+'share']:(p)=>{
  const q=mix(0,11,lin(p,.05,.9));
  let s=bar(vc(q),{x:230,base:460,k:58,w:100});
  s+=meter(cur(q),{cx:880,cy:250,r:130});
  s+=label(`q ＝ ${f1(q)} μC`,230,50,{size:28,color:QC,weight:700});
  s+=fade(seg(p,.1,.3),label('合計は 6 V のまま',600,470,{size:26,color:VC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'flatten']:(p)=>{
  const {A,svg}=qGraph();const t0=mix(0,6,lin(p,.05,.9)),q0=qt(t0);
  let s=svg+tangentAt(A,t0,{half:1.2})+dot(A.X(t0),A.Y(q0),9,C.hi);
  s+=meter((12-q0)/2,{cx:950,cy:230,r:110});
  s+=fade(seg(p,.5,.7),label('傾きが 小さくなる',950,450,{size:28,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notsame']:(p)=>{
  const {A,svg}=qGraph();const t0=tq(8);
  let s=svg+dot(A.X(t0),A.Y(8),9,C.hi);
  s+=fade(seg(p,.1,.3),arrow(A.X(t0),A.Y(0),A.X(t0),A.Y(8)+10,{color:QC,w:5,head:14})+label('高さ ＝ 電荷 q',A.X(t0)+14,A.Y(3),{size:24,color:QC,weight:700}));
  s+=tangentAt(A,t0,{g:seg(p,.45,.65),half:1.4})+fade(seg(p,.45,.65),label('傾き ＝ 電流 I',A.X(t0+1.5),A.Y(qt(t0)+2*1.5)-14,{size:24,color:IC,weight:700}));
  s+=panel(720,120,440,260,label('電荷は 増え続ける',940,190,{size:28,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('電流は 減っていく',940,250,{size:28,color:IC,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.85),label('電流 ＝ 高さではなく 傾き',940,320,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.25));
  return s;
 },
 [K+'final']:(p)=>{
  const {A,svg}=qGraph();
  let s=svg+fade(seg(p,.05,.25),line(A.X(0),A.Y(12),A.X(8.5),A.Y(12),{color:QC,w:2.5,dash:'10 8'}));
  s+=panel(720,90,440,340,label('やがて',940,145,{size:26,color:C.dim,anchor:'middle'})
   +label('コンデンサ → 6 V',940,200,{size:28,color:VC,anchor:'middle',weight:700})+label('電流 → 0',940,250,{size:28,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.45,.65),T(`${cs(QC,'q')}\\to${cs(CC,'2'+U('\\mu F'))}\\times${cs(VC,'6'+U('V'))}`,940,325,{size:34})+T(`=${cs(QC,'12'+U('\\mu C'))}`,940,395,{size:40})),seg(p,.05,.25));
  return s;
 },
 [K+'finalcap']:(p)=>{
  let s=circuit({q:12,I:0})+brC(cs(VC,'6'+U('V')))+brR(cs(VC,'0'+U('V')));
  s+=bar(6,{x:760,g:seg(p,.05,.25)});
  s+=panel(860,340,300,120,label('板の電圧 ＝ 電池',1010,390,{size:26,color:C.hi,anchor:'middle',weight:700})+label('→ 止まる',1010,436,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.55),C.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=circuit({q:10,I:1/6});
  s+=panel(680,120,480,260,label('確認',920,175,{size:26,color:C.dim,anchor:'middle'})
   +label('電荷 q ＝ 10 μC のとき',920,240,{size:30,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),T(`${cs(IC,'I')}=\\;?\\;${U('\\mu A')}`,920,320,{size:48})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=circuit({q:10,I:1/6})+fade(seg(p,.05,.2),brC(cs(VC,'5'+U('V'))))+fade(seg(p,.4,.55),brR(cs(VC,'1'+U('V'))));
  s+=panel(660,50,500,420,T(`${cs(VC,'V_C')}=\\dfrac{${cs(QC,'10'+U('\\mu C'))}}{${cs(CC,'2'+U('\\mu F'))}}=${cs(VC,'5'+U('V'))}`,910,135,{size:38})
   +fade(seg(p,.35,.55),T(`${cs(VC,'V_R')}=${cs(VC,'6'+U('V'))}-${cs(VC,'5'+U('V'))}=${cs(VC,'1'+U('V'))}`,910,260,{size:36}))
   +fade(seg(p,.65,.85),T(`${cs(IC,'I')}=\\dfrac{${cs(VC,'1'+U('V'))}}{1${U('M\\Omega')}}=${cs(IC,'1'+U('\\mu A'))}`,910,380,{size:38})),seg(p,0,.12),IC);
  return s;
 },
 [K+'selfrate']:(p)=>{
  const box=(x,y,tx,sub,color,g)=>fade(g,rect(x-170,y-72,340,144,{fill:'#131f38',fo:.96,stroke:color,sw:2.5,rx:14})+T(tx,x,y-14,{size:34})+label(sub,x,y+56,{size:22,color,anchor:'middle'}));
  let s='';
  s+=box(300,110,`${cs(QC,'q')}\\ \\uparrow`,'電荷が 増える',QC,seg(p,.02,.15));
  s+=box(900,110,`${cs(VC,'V_C')}=\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}\\ \\uparrow`,'コンデンサの電圧',VC,seg(p,.12,.25));
  s+=box(900,400,`${cs(VC,'V_R')}=${cs(VC,'6'+U('V'))}-${cs(VC,'V_C')}\\ \\downarrow`,'抵抗の電圧',IC,seg(p,.22,.35));
  s+=box(300,400,`${cs(IC,'I')}=\\dfrac{d${cs(QC,'q')}}{d${cs(TC,'t')}}\\ \\downarrow`,'増える速さ',IC,seg(p,.32,.45));
  s+=fade(seg(p,.1,.2),arrow(480,110,720,110,{color:C.dim,w:4,head:14}))+fade(seg(p,.2,.3),arrow(900,190,900,320,{color:C.dim,w:4,head:14}))
   +fade(seg(p,.3,.4),arrow(720,400,480,400,{color:C.dim,w:4,head:14}))+fade(seg(p,.4,.5),arrow(300,320,300,190,{color:C.dim,w:4,head:14}));
  s+=fade(seg(p,.6,.8),label('変化の速さが 今の量で決まる',600,262,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'later2']:(p)=>{
  const {A,svg}=qGraph();
  let s=svg+line(A.X(0),A.Y(12),A.X(8.5),A.Y(12),{color:QC,w:2.5,dash:'10 8'});
  s+=panel(720,140,440,220,label('この曲線の式',940,210,{size:30,color:QC,anchor:'middle',weight:700})
   +label('→ 中級で 求める',940,280,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3));
  return s;
 },
 // ===== S5 まとめと次の問い =====
 [K+'summary']:(p)=>{
  const col=(x,title,color,body,g)=>card(x,90,340,330,label(title,x+170,145,{size:28,color,anchor:'middle',weight:700})+body,g,color);
  let s=col(60,'電位の性質',VC,label('一周で 元の高さ',230,225,{size:28,color:C.ink,anchor:'middle'})+T(`${cs(VC,'V_0')}=R${cs(IC,'I')}+\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,230,330,{size:38}),seg(p,.02,.2));
  s+=col(430,'実験の法則',IC,T(`R${cs(IC,'I')}`,600,245,{size:54})+label('オームの法則',600,340,{size:26,color:C.dim,anchor:'middle'}),seg(p,.4,.55));
  s+=col(800,'定義から',QC,T(`\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,970,250,{size:54})+label('容量 C ＝ Q/V',970,340,{size:26,color:C.dim,anchor:'middle'}),seg(p,.6,.75));
  return s;
 },
 [K+'summary2']:(p)=>{
  const col=(x,w,title,color,body,g)=>card(x,90,w,330,label(title,x+w/2,145,{size:28,color,anchor:'middle',weight:700})+body,g,color);
  let s=col(100,440,'定義',IC,T(`${cs(IC,'I')}=\\dfrac{d${cs(QC,'q')}}{d${cs(TC,'t')}}`,320,255,{size:52})+label('電荷のグラフの 傾き',320,350,{size:26,color:C.ink,anchor:'middle'}),seg(p,.02,.2));
  s+=col(660,440,'導いた結果',C.hi,label('充電が進むと',880,230,{size:28,color:C.ink,anchor:'middle'})+label('抵抗の電圧と 電流は',880,285,{size:28,color:IC,anchor:'middle',weight:700})+label('減っていく',880,340,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.65));
  return s;
 },
 [K+'coil']:(p)=>{
  let s=draw([[120,370],[266,370]],1,{color:C.dim,w:4})+draw([[634,370],[780,370]],1,{color:C.dim,w:4});
  s+=coilLoops(250,650,300,{n:8});
  s+=fade(seg(p,.1,.3),label('コイル',450,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('導線を 何回も巻いた部品',470,470,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.4,.6),arrow(130,400,230,400,{color:IC,w:5,head:14})+label('電流 I',130,440,{size:24,color:IC,weight:700}));
  s+=fade(seg(p,.6,.8),arrow(230,300,690,300,{color:BC,w:6,head:18})+label('磁場',700,250,{size:26,color:BC,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=draw([[120,370],[266,370]],1,{color:C.dim,w:4})+draw([[634,370],[780,370]],1,{color:C.dim,w:4});
  s+=coilLoops(250,650,300,{n:8})+arrow(230,300,690,300,{color:BC,w:6,head:18});
  s+=fade(seg(p,.05,.2),line(120,395,120,425,{color:VC,w:3})+line(780,395,780,425,{color:VC,w:3})+line(120,410,780,410,{color:VC,w:3})+label('両端の電圧 ？',450,455,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=panel(830,130,340,250,label('次の問い',1000,185,{size:26,color:C.dim,anchor:'middle'})+label('コイルの電圧は',1000,250,{size:28,color:C.ink,anchor:'middle'})+label('何で決まる？',1000,305,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.4),C.hi);
  return s;
 },
 [K+'later8']:(p)=>{
  const {A,svg}=qGraph();const t4=tq(4),t8=tq(8);
  let s=svg+dot(A.X(t4),A.Y(4),8,C.dim)+tangentAt(A,t4,{half:1.2,w:3,g:.45});
  s+=fade(.8,label('4 μC/s',A.X(t4)+26,A.Y(4)+44,{size:22,color:C.dim}));
  s+=dot(A.X(t8),A.Y(8),9,C.hi)+tangentAt(A,t8,{g:seg(p,.05,.3),half:1.4})+slopeTri(A,t8,seg(p,.3,.5));
  s+=panel(720,120,440,260,label('q ＝ 8 μC の点',940,180,{size:28,color:QC,anchor:'middle',weight:700})
   +T(`${cs(IC,'2'+U('\\mu C/s'))}=${cs(IC,'2'+U('\\mu A'))}`,940,260,{size:40})
   +fade(seg(p,.55,.75),label('4 μC の点の 半分',940,335,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.2,.4),IC);
  return s;
 },
 [K+'answer']:(p)=>{
  const It=t=>6*Math.exp(-t/2);
  const A=axes({x:110,y:450,w:560,h:330,xmax:8.6,ymax:6.9,xticks:[2,4,6,8],yticks:[2,4,6],grid:true,g:seg(p,0,.15),xlabel:'t [s]',ylabel:'電流 I [μA]',xcolor:TC,ycolor:IC});
  let s=A.svg+A.plot(It,{from:0,to:8.3,p:seg(p,.15,.7),color:IC,w:5});
  s+=fade(seg(p,.2,.35),dot(A.X(0),A.Y(6),9,C.hi)+label('直後が 一番大きい',A.X(0)+22,A.Y(6)+6,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.7,.85),label('0 に近づく',A.X(6.6),A.Y(.4)-24,{size:24,color:IC,anchor:'middle',weight:700}));
  s+=panel(760,140,400,220,label('抵抗 ＋ コンデンサ',960,205,{size:26,color:C.dim,anchor:'middle'})
   +label('電流は 時間とともに',960,260,{size:28,color:C.ink,anchor:'middle'})+label('減っていく',960,310,{size:30,color:IC,anchor:'middle',weight:700}),seg(p,.3,.5),IC);
  return s;
 },

};
