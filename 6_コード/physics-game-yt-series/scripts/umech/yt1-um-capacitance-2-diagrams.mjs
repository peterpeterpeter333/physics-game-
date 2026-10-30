// YouTube シリーズ「コンデンサ・中級 2/2」(ys-um-capacitance-2) — 図。Stage 1200×515.
// 板は横から見た図（縦の棒）。左の板＝＋Q（電池の＋極側）、右の板＝−Q。電場 𝐄 は＋の板 → −の板（右向き）。
// 部品は 1/2 の図（yt1-um-capacitance-1-diagrams.mjs）から import する。ここで export するのは図の登録だけ。
// 電子（青）の向き：＋の板 → 導線 → 電池の＋極（長い線）、電池の−極（短い太線）→ 導線 → −の板。
// 色：電場 𝐄 水色、電位・電圧 V 紫、電荷 Q・面密度 σ 桃（図の正電荷 赤、電子・負電荷 青）、面積 S 金、容量 C 黄、ε₀・d 白、強調 黄、誤り 赤。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,highlight} from './anim.mjs';
import {POS,NEG,EC,QC,VC,CC,SC,WC,cs,T,card,L,sig,Qt,St,Et,vE,Vt,Ct,eps,FULL,QES,G,plus,minus,plate,plates,fieldIn,battery,zero} from './yt1-um-capacitance-1-diagrams.mjs';

const K='um-capacitance-2:';
const hbar=(x1,x2,y,color=C.ink,w=3)=>line(x1,y,x2,y,{color,w})+line(x1,y-8,x1,y+8,{color,w})+line(x2,y-8,x2,y+8,{color,w});
const vbar=(x,y1,y2,color=C.ink,w=3)=>line(x,y1,x,y2,{color,w})+line(x-8,y1,x+8,y1,{color,w})+line(x-8,y2,x+8,y2,{color,w});
const dt=cs(C.ink,'d');
const QDES=`\\dfrac{${Qt}\\,${dt}}{${eps}${St}}`;          // Qd/(ε0 S)
const CRES=`\\dfrac{${eps}${St}}{${dt}}`;                   // ε0 S/d
const um=s=>`\\,\\mathrm{${s}}`;
// field arrows dimmed (background)
const dimField=(o={})=>fade(.35,fieldIn(o));
// potential slope drawn over the gap: purple line from the + plate (high) to the − plate (low)
function slope({g=1,lx=G.LX,rx=G.RX,yh=150,yl=360,lab=1,drop='Ed'}={}){
 if(g<=.001)return '';
 let s=line(lx,yh,rx,yh,{color:VC,w:2,dash:'6 8',opacity:.7})+line(rx,yl,rx+60,yl,{color:VC,w:2,dash:'6 8',opacity:.7});
 s+=draw([[lx,yh],[mix(lx,rx,g),mix(yh,yl,g)]],1,{color:VC,w:6});
 if(lab)s+=fade(seg(g,.7,1),vbar(rx+40,yh,yl,VC)+label(drop,rx+58,(yh+yl)/2+10,{size:30,color:VC,weight:700})
   +label('電位',lx-G.PW-12,yh+9,{size:26,color:VC,weight:700,anchor:'end'}));
 return s;
}
// electrons (blue dots) moving along the wires while charging
function electronFlow(p,{lx=G.LX,rx=G.RX,pb=G.PB,wy=460,n=3}={}){
 const bx=(lx+rx)/2,a=lx-G.PW/2,b=rx+G.PW/2;
 const pathL=[[a,pb],[a,wy],[bx-10,wy]],pathR=[[bx+10,wy],[b,wy],[b,pb]];
 const at=(path,u)=>{const ls=path.slice(1).map((q,i)=>Math.hypot(q[0]-path[i][0],q[1]-path[i][1]));let d=u*ls.reduce((x,y)=>x+y,0);
  for(let i=0;i<ls.length;i++){if(d<=ls[i]||i===ls.length-1){const t=ls[i]>0?clamp(d/ls[i]):0;return [mix(path[i][0],path[i+1][0],t),mix(path[i][1],path[i+1][1],t)];}d-=ls[i];}};
 let s='';
 for(let i=0;i<n;i++){const u=((p*2.2)+i/n)%1;const [x1,y1]=at(pathL,u),[x2,y2]=at(pathR,u);
  s+=dot(x1,y1,9,NEG)+dot(x2,y2,9,NEG);}
 return s;
}

export const ytUmCapacitance2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recall']:(p)=>{
  let s=plates({qlab:1})+fieldIn({k:1})+fade(seg(p,.4,.6),zero(250,240)+zero(780,240));
  s+=card(840,90,320,330,L('前回の結果',1000,128,{size:24,color:C.dim})
   +T(`${Et}=${QES}`,1000,225,{size:46})+fade(seg(p,.3,.5),L('間：一様',1000,320,{size:28,color:EC,weight:700}))
   +fade(seg(p,.5,.7),L('外：0',1000,375,{size:28,color:C.hi,weight:700})),seg(p,0,.2),EC);
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=plates({qlab:1})+fieldIn({k:1});
  s+=card(800,100,360,310,L('最後の問い',980,150,{size:24,color:C.dim})
   +L('電位差は？',980,220,{size:32,color:VC,weight:700})
   +fade(seg(p,.4,.6),L('1 V あたりの電荷',980,295,{size:28,color:CC,weight:700})+L('＝ 容量は？',980,345,{size:30,color:CC,weight:700})),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'recallC']:(p)=>{
  let s=card(90,90,480,330,L('初級：定義',330,145,{size:26,color:CC,weight:700})
   +T(`${Ct}=\\dfrac{${Qt}}{${Vt}}`,330,255,{size:64})+L('1 V あたりの電荷',330,365,{size:26,color:C.dim}),seg(p,0,.2),CC);
  s+=card(630,90,480,330,L('初級：値は 測って決めた',870,145,{size:26,color:C.dim,weight:700})
   +T(`\\dfrac{6\\,\\mu\\mathrm{C}}{3\\,\\mathrm{V}}=2\\,\\mu\\mathrm{F}`,870,250,{size:48})
   +fade(seg(p,.55,.75),L('電池につないで 測るしかない',870,360,{size:26,color:C.hi,weight:700})),seg(p,.4,.6));
  return s;
 },
 [K+'question']:(p)=>{
  let s=plates({qlab:1});
  s+=fade(seg(p,.1,.3),hbar(G.LX,G.RX,G.PB+45,C.ink)+L('d',(G.LX+G.RX)/2,G.PB+85,{size:28,weight:700})
   +label('面積 S',G.LX-G.PW-60,G.PT-20,{size:26,color:SC,weight:700}));
  s+=card(800,100,360,310,T(`${Ct}=\\;?`,980,190,{size:56})
   +L('S と d で 書ける？',980,275,{size:28,color:C.ink,weight:700})
   +fade(seg(p,.55,.75),L('Q は どこへ？',980,345,{size:30,color:QC,weight:700})),seg(p,.05,.25),C.hi);
  return s;
 },
 // ===== S2 電位差 V＝Ed =====
 [K+'potrecall']:(p)=>{
  return card(150,90,900,330,L('電位の回（中級）',600,145,{size:26,color:C.dim})
   +T(`${Vt}(\\mathrm{B})-${Vt}(\\mathrm{A})=-\\int_{\\mathrm{A}}^{\\mathrm{B}}${vE}\\cdot d\\mathbf{r}`,600,250,{size:58})
   +fade(seg(p,.45,.7),L('電場を 道に沿って 足して、マイナスを付ける',600,360,{size:28,color:C.hi,weight:700})),seg(p,0,.2),VC);
 },
 [K+'path']:(p)=>{
  let s=plates({qlab:1})+dimField();
  const y=250,x=mix(G.LX+14,G.RX-14,seg(p,.2,.8));
  s+=fade(seg(p,.1,.2),label('A',G.LX+8,y-22,{size:28,color:C.hi,weight:700})+label('B',G.RX-30,y-22,{size:28,color:C.hi,weight:700}));
  s+=draw([[G.LX+14,y],[x,y]],1,{color:C.hi,w:4,dash:'8 7'})+dot(x,y,11,C.hi);
  s+=fade(seg(p,.6,.8),hbar(G.LX,G.RX,G.PB+45,C.ink)+L('道の長さ d',(G.LX+G.RX)/2,G.PB+85,{size:28,weight:700}));
  s+=card(800,130,360,240,L('出発 A：＋の板',980,195,{size:28,color:POS,weight:700})+L('到着 B：−の板',980,255,{size:28,color:NEG,weight:700})
   +L('電場に沿って まっすぐ',980,320,{size:26,color:EC}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'step']:(p)=>{
  let s=plates({qlab:1})+dimField();
  const y=250;let st='';for(let i=0;i<5;i++){const x0=G.LX+14+i*38.4;st+=arrow(x0,y+30,x0+36,y+30,{color:C.hi,w:3.5,head:10});}
  s+=fade(seg(p,.05,.25),arrow(G.LX+40,y-30,G.RX-40,y-30,{color:EC,w:6,head:16})+label('𝐄',(G.LX+G.RX)/2-8,y-48,{size:28,color:EC,weight:700}));
  s+=fade(seg(p,.2,.4),st+label('d𝐫',G.LX+40,y+72,{size:26,color:C.hi,weight:700}));
  s+=card(800,110,360,290,L('同じ向き',980,165,{size:28,color:C.hi,weight:700})
   +fade(seg(p,.5,.7),T(`${vE}\\cdot d\\mathbf{r}=${Et}\\,dx`,980,250,{size:48}))
   +fade(seg(p,.65,.85),L('dx：歩幅',980,340,{size:26,color:C.dim})),seg(p,.2,.4),C.hi);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=plates({qlab:1})+dimField();
  const y=250;let st='';for(let i=0;i<5;i++){const x0=G.LX+14+i*38.4;st+=arrow(x0,y+30,x0+36,y+30,{color:C.hi,w:3.5,head:10});}
  s+=st+fade(seg(p,.1,.35),hbar(G.LX+14,G.RX-14,G.PB+35,C.hi)+L('歩幅の合計 ＝ d',(G.LX+G.RX)/2,G.PB+75,{size:28,color:C.hi,weight:700}));
  s+=card(800,130,360,240,L('電場に沿って 足すと',980,190,{size:26,color:C.dim})
   +fade(seg(p,.4,.6),T(`${Et}\\times ${dt}`,980,280,{size:56})),seg(p,.3,.5),EC);
  return s;
 },
 [K+'lower']:(p)=>{
  let s=plates({qlab:0})+dimField()+slope({g:seg(p,.35,.8)});
  s+=card(840,110,320,290,L('マイナスを付ける',1000,160,{size:26,color:C.dim})
   +T(`${Vt}_{-}-${Vt}_{+}=-${Et}${dt}`,1000,240,{size:44})
   +fade(seg(p,.5,.7),L('−の板が Ed 低い',1000,330,{size:28,color:VC,weight:700})),seg(p,0,.2),VC);
  return s;
 },
 [K+'vdef']:(p)=>{
  let s=plates({qlab:0})+dimField()+slope();
  s+=card(840,110,320,290,L('電圧 ＝ 電位差の大きさ',1000,160,{size:24,color:C.dim})
   +T(`${Vt}=${Et}${dt}`,1000,245,{size:64})
   +fade(seg(p,.5,.7),L('下がり幅 ＝ 強さ × 距離',1000,335,{size:26,color:C.hi,weight:700})),seg(p,0,.2),VC);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(150,70,900,180,T(`\\mathrm{\\dfrac{V}{m}}\\times\\mathrm{m}=\\mathrm{V}`,600,185,{size:50}),seg(p,0,.2),C.faint);
  s+=card(150,290,420,150,T(Vt,260,365,{size:64})+L('斜め：電圧',420,375,{size:30,color:VC,weight:700}),seg(p,.35,.55),VC);
  s+=card(630,290,420,150,T('\\mathrm{V}',740,365,{size:64})+L('立った：ボルト',900,375,{size:30,color:C.ink,weight:700}),seg(p,.55,.75));
  return s;
 },
 [K+'subst']:(p)=>{
  let s=card(100,60,1000,400,'',1,VC);
  s+=T(`${Vt}=${Et}\\,${dt}`,330,160,{size:60});
  s+=fade(seg(p,.1,.3),L('前回',700,172,{size:26,color:C.dim})+T(`${Et}=${QES}`,870,160,{size:50}));
  s+=fade(seg(p,.3,.5),arrow(860,225,720,300,{color:C.hi,w:4,head:14})+L('入れる',900,285,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.4,.6),T(`${Vt}=${QES}\\,${dt}=${QDES}`,440,350,{size:52}));
  s+=fade(seg(p,.7,.85),T(`${Vt}\\propto ${Qt}`,940,370,{size:50}));
  return s;
 },
 [K+'num1']:(p)=>{
  let s=plates({qlab:1})+fieldIn({k:1});
  s+=fade(seg(p,.1,.3),hbar(G.LX,G.RX,G.PB+45,C.ink)+L('d ＝ 1 mm',(G.LX+G.RX)/2,G.PB+85,{size:28,weight:700}));
  s+=card(800,110,360,290,T(`${dt}=0.001${um('m')}`,980,190,{size:44})
   +fade(seg(p,.45,.65),L('前回の電場',980,275,{size:26,color:C.dim})+T(`${Et}\\approx 3000${um('V/m')}`,980,335,{size:42})),seg(p,.05,.25),C.faint);
  return s;
 },
 [K+'num2']:(p)=>{
  let s=plates({qlab:1})+fieldIn({k:1})+fade(seg(p,.5,.7),battery()+label('3 V',(G.LX+G.RX)/2-60,442,{size:26,color:VC,weight:700,anchor:'end'}));
  s+=card(800,90,360,330,T(`${Vt}=${Et}${dt}`,980,150,{size:44})
   +T(`=3000\\times 0.001`,980,220,{size:40})+fade(seg(p,.2,.4),T(`=3${um('V')}`,980,295,{size:52}))
   +fade(seg(p,.55,.75),L('前回の Q で 3 V',980,375,{size:26,color:QC,weight:700})),seg(p,0,.15),VC);
  return s;
 },
 // ===== S3 Q が約分される =====
 [K+'def']:(p)=>{
  let s=card(100,70,1000,380,'',1,CC);
  s+=L('定義',600,115,{size:26,color:CC,weight:700});
  s+=T(`${Ct}=\\dfrac{${Qt}}{${Vt}}=${Qt}\\div ${Vt}`,600,222,{size:58});
  s+=fade(seg(p,.35,.55),T(`${Ct}=${Qt}\\div ${QDES}`,600,370,{size:56})+highlight(648,272,140,140,1,VC));
  return s;
 },
 [K+'divide']:(p)=>{
  let s=card(100,70,1000,380,'',1,CC);
  s+=T(`${Ct}=${Qt}\\div ${QDES}`,600,165,{size:50});
  s+=fade(seg(p,.1,.3),L('割る ＝ 逆数を掛ける',600,245,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.4,.6),T(`${Ct}=${Qt}\\times\\dfrac{${eps}${St}}{${Qt}\\,${dt}}`,600,388,{size:56}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=card(100,70,1000,380,'',1,C.hi);
  s+=T(`${Ct}=${Qt}\\times\\dfrac{${eps}${St}}{${Qt}\\,${dt}}`,600,215,{size:64});
  s+=fade(seg(p,.2,.4),L('消える 文字は？',600,370,{size:34,color:C.hi,weight:700}));
  return s;
 },
 [K+'cancel']:(p)=>{
  let s=card(100,70,1000,380,'',1,CC);
  const x=(c)=>`{\\color{${C.hi}}\\cancel{${c}}}`;
  const g=seg(p,.1,.35);
  s+=T(g>.5?`${Ct}=${x(Qt)}\\times\\dfrac{${eps}${St}}{${x(Qt)}\\,${dt}}`:`${Ct}=${Qt}\\times\\dfrac{${eps}${St}}{${Qt}\\,${dt}}`,600,202,{size:56});
  s+=fade(seg(p,.3,.45),L('分子と分母の Q を 約分',600,280,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.5,.7),T(`${Ct}=${CRES}`,600,392,{size:58})+highlight(478,296,244,140,1,CC));
  return s;
 },
 [K+'meaning']:(p)=>{
  const row=(y,a,b,note,g)=>fade(g,T(a,380,y,{size:44})+L('→',520,y+12,{size:36,color:C.dim})+T(b,640,y,{size:44})+L(note,860,y+10,{size:24,color:C.dim}));
  let s=card(150,60,900,400,'',1,QC);
  s+=L('Q を 2倍にすると',600,110,{size:28,color:QC,weight:700});
  s+=row(170,Qt,`2${Qt}`,'',seg(p,.05,.2));
  s+=row(230,Et,`2${Et}`,'E ∝ Q（前回）',seg(p,.2,.35));
  s+=row(290,Vt,`2${Vt}`,'V ＝ Ed',seg(p,.35,.5));
  s+=fade(seg(p,.55,.75),T(`\\dfrac{${Qt}}{${Vt}}\\quad\\to\\quad\\dfrac{2${Qt}}{2${Vt}}=\\dfrac{${Qt}}{${Vt}}`,520,385,{size:40})+L('比は そのまま',880,395,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'shape']:(p)=>{
  let s=T(`${Ct}=\\dfrac{${eps}\\,${St}}{${dt}}`,600,170,{size:90});
  s+=fade(seg(p,.2,.4),L('S：面積（形）',600,320,{size:28,color:SC,weight:700}));
  s+=fade(seg(p,.3,.5),L('d：間隔（形）',930,320,{size:28,color:C.ink,weight:700}));
  s+=fade(seg(p,.5,.7),L('ε₀：間の空間（真空）',260,320,{size:28,color:C.ink,weight:700}));
  s+=fade(seg(p,.7,.9),card(330,370,540,80,L('Q は 入っていない',600,422,{size:32,color:QC,weight:700}),1,QC));
  return s;
 },
 [K+'prop']:(p)=>{
  let s=card(90,90,480,330,L('初級：実験で分かった事実',330,140,{size:26,color:C.dim,weight:700})
   +T(`${Qt}\\propto ${Vt}`,330,255,{size:64}),seg(p,0,.2));
  s+=card(630,90,480,330,L('中級：式からも出る',870,140,{size:26,color:C.hi,weight:700})
   +T(`${Vt}=\\dfrac{${dt}}{${eps}${St}}\\,${Qt}`,870,258,{size:50})
   +fade(seg(p,.55,.75),L('d/(ε₀S) が 決まった比例係数',870,375,{size:26,color:C.ink})),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'unit1']:(p)=>{
  let s=card(80,90,1040,330,'',1,C.faint);
  s+=L('ε₀ S / d の単位',600,145,{size:26,color:C.dim});
  s+=T(`\\mathrm{\\dfrac{C^2}{N\\cdot m^2}}\\times\\mathrm{m^2}\\div\\mathrm{m}`,420,270,{size:50});
  s+=fade(seg(p,.5,.7),T(`=\\mathrm{\\dfrac{C^2}{N\\cdot m}}`,860,270,{size:50}));
  return s;
 },
 [K+'unit2']:(p)=>{
  let s=card(100,90,1000,330,'',1,C.faint);
  s+=T(`\\mathrm{\\dfrac{C^2}{N\\cdot m}}`,230,230,{size:50});
  s+=fade(seg(p,.05,.25),T(`=\\mathrm{\\dfrac{C^2}{J}}`,420,230,{size:50})+L('N·m ＝ J',420,330,{size:24,color:C.dim}));
  s+=fade(seg(p,.35,.55),T(`=\\mathrm{\\dfrac{C}{J/C}}`,630,230,{size:50})+T(`=\\mathrm{\\dfrac{C}{V}}`,830,230,{size:50})+L('J/C ＝ V',730,330,{size:24,color:C.dim}));
  s+=fade(seg(p,.65,.85),T(`=\\mathrm{F}`,990,230,{size:54})+L('ファラド',990,330,{size:26,color:CC,weight:700}));
  return s;
 },
 // ===== S4 数で確かめる =====
 [K+'numC']:(p)=>{
  let s=card(100,70,1000,380,'',1,CC);
  s+=T(`${St}=0.01${um('m^2')},\\quad ${dt}=0.001${um('m')}`,600,150,{size:44});
  s+=fade(seg(p,.35,.55),T(`${Ct}=\\dfrac{8.85\\times10^{-12}\\times 0.01}{0.001}`,600,310,{size:56}));
  return s;
 },
 [K+'numC2']:(p)=>{
  let s=card(100,70,1000,380,'',1,CC);
  s+=T(`${Ct}=\\dfrac{8.85\\times10^{-12}\\times 0.01}{0.001}`,600,150,{size:44});
  s+=fade(seg(p,.1,.3),T(`=8.85\\times10^{-11}${um('F')}`,600,245,{size:50}));
  s+=fade(seg(p,.4,.6),L('p（ピコ）＝ 10⁻¹²',330,355,{size:28,color:C.dim,weight:700}));
  s+=fade(seg(p,.55,.75),T(`=88.5${um('pF')}`,780,350,{size:58})+highlight(640,300,290,100,1,CC));
  return s;
 },
 [K+'small']:(p)=>{
  let s=card(110,90,470,330,L('初級のコンデンサ',345,145,{size:26,color:C.dim})+T(`2${um('\\mu F')}`,345,250,{size:64}),seg(p,0,.2));
  s+=card(620,90,470,330,L('この板（10 cm 四方・1 mm）',855,145,{size:26,color:C.dim})+T(`88.5${um('pF')}`,855,250,{size:64})
   +fade(seg(p,.4,.6),L('約 2万3千分の1',855,360,{size:30,color:C.hi,weight:700})),seg(p,.2,.4),CC);
  return s;
 },
 [K+'numQ']:(p)=>{
  let s=plates({lx:200,rx:420,qlab:1})+battery({lx:200,rx:420})+label('3 V',250,442,{size:26,color:VC,weight:700,anchor:'end'});
  s+=card(560,70,600,380,T(`${Qt}=${Ct}${Vt}`,860,130,{size:48})
   +fade(seg(p,.15,.35),T(`=88.5${um('pF')}\\times 3${um('V')}`,860,210,{size:44}))
   +fade(seg(p,.35,.55),T(`\\approx 2.66\\times10^{-10}${um('C')}`,860,290,{size:48}))
   +fade(seg(p,.6,.8),L('前回の Q の 正体',860,395,{size:30,color:QC,weight:700})),seg(p,0,.15),QC);
  return s;
 },
 [K+'check']:(p)=>{
  let s=card(100,70,1000,380,'',1,EC);
  s+=T(`${Et}=\\dfrac{${Vt}}{${dt}}=\\dfrac{3${um('V')}}{0.001${um('m')}}=3000${um('V/m')}`,600,175,{size:52});
  s+=fade(seg(p,.4,.6),L('前回',380,330,{size:26,color:C.dim})+T(`\\dfrac{${sig}}{${eps}}\\approx 3000${um('V/m')}`,600,330,{size:46})
   +L('一致',880,340,{size:32,color:C.hi,weight:700}));
  return s;
 },
 // ===== S5 間隔を2倍にする =====
 [K+'quiz']:(p)=>{
  let s=plates({lx:130,rx:300,qlab:0,n:7})+hbar(130,300,G.PB+45)+L('d ＝ 1 mm',215,G.PB+85,{size:26,weight:700});
  s+=fade(seg(p,.1,.3),plates({lx:470,rx:810,qlab:0,n:7})+hbar(470,810,G.PB+45)+L('2d ＝ 2 mm',640,G.PB+85,{size:26,weight:700}));
  s+=fade(seg(p,.1,.3),label('面積は 同じ',640,G.PT-25,{size:26,color:SC,weight:700,anchor:'middle'}));
  s+=card(900,150,260,200,L('確認',1030,205,{size:26,color:C.dim})+T(`${Ct}\\;\\to\\;?`,1030,285,{size:50}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'fix']:(p)=>{
  let s=plates({lx:200,rx:420,qlab:1})+fieldIn({lx:200,rx:420,k:1});
  s+=fade(1-seg(p,.1,.35),battery({lx:200,rx:420}));
  s+=fade(seg(p,.2,.4),label('電池を 外す',310,480,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(620,110,520,290,L('固定する：Q',880,195,{size:34,color:QC,weight:700})
   +fade(seg(p,.5,.7),L('変える：d',880,300,{size:34,color:C.ink,weight:700})),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'sameE']:(p)=>{
  const lx=200,rx=mix(420,640,seg(p,0,.25));
  let s=plates({lx,rx,qlab:1})+fieldIn({lx,rx,k:1});
  s+=hbar(lx,rx,G.PB+45)+L('2d',(lx+rx)/2,G.PB+85,{size:28,weight:700});
  s+=card(760,110,400,290,T(`${Et}=${QES}`,960,190,{size:50})
   +fade(seg(p,.3,.5),L('d が 入っていない',960,280,{size:28,color:C.ink,weight:700}))
   +fade(seg(p,.55,.75),L('同じ 3000 V/m',960,345,{size:30,color:EC,weight:700})),seg(p,.1,.3),EC);
  return s;
 },
 [K+'doubleV']:(p)=>{
  const lx=200,rx=640;
  let s=plates({lx,rx,qlab:0})+dimField({lx,rx});
  s+=fade(.85,line(lx,150,lx+220,260,{color:VC,w:4,dash:'10 8'})+label('d なら 3 V',lx+232,262,{size:24,color:VC}));
  s+=slope({lx,rx,yh:150,yl:370,g:seg(p,.15,.6),drop:'6 V'});
  s+=card(840,110,320,290,T(`${Vt}=${Et}\\,(2${dt})`,1000,190,{size:46})
   +fade(seg(p,.5,.7),T(`=6${um('V')}`,1000,275,{size:52})+L('2倍',1000,360,{size:30,color:C.hi,weight:700})),seg(p,.3,.5),VC);
  return s;
 },
 [K+'halfC']:(p)=>{
  let s=card(100,70,1000,380,'',1,CC);
  s+=T(`${Ct}=\\dfrac{${Qt}}{2${Vt}}`,300,190,{size:60});
  s+=fade(seg(p,.2,.4),T(`\\approx\\dfrac{88.5}{2}${um('pF')}\\approx 44.3${um('pF')}`,720,190,{size:50}));
  s+=fade(seg(p,.5,.7),T(`\\dfrac{${eps}${St}}{2${dt}}=\\dfrac{1}{2}\\times 88.5${um('pF')}`,600,350,{size:48})+L('一致',960,360,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'design']:(p)=>{
  let s=T(`${Ct}=\\dfrac{${eps}\\,${St}}{${dt}}`,600,210,{size:90});
  s+=fade(seg(p,.1,.3),L('S を 広く ↑',820,150,{size:28,color:SC,weight:700,anchor:'start'}));
  s+=fade(seg(p,.3,.5),L('d を 狭く ↓',820,300,{size:28,color:C.ink,weight:700,anchor:'start'}));
  s+=fade(seg(p,.55,.75),card(330,360,540,90,L('容量 C が 大きくなる',600,418,{size:32,color:CC,weight:700}),1,CC));
  return s;
 },
 [K+'mlcc']:(p)=>{
  // schematic: many thin layers stacked; electrodes alternately joined to the left (+) and right (−) terminals
  const x0=200,x1=700,y0=80,n=12,h=28;let s='';
  s+=rect(x0-30,y0-10,30,n*h+20,{fill:POS,fo:.25,stroke:POS,sw:2,rx:4})+rect(x1,y0-10,30,n*h+20,{fill:NEG,fo:.25,stroke:NEG,sw:2,rx:4});
  const g=seg(p,.05,.6);
  for(let i=0;i<n;i++){const gi=clamp(g*n-i);if(gi<=0)break;const y=y0+i*h+h/2,left=i%2===0;
   s+=fade(gi,left?line(x0,y,x1-40,y,{color:POS,w:5}):line(x0+40,y,x1,y,{color:NEG,w:5}));}
  s+=label('＋',x0-15,y0-22,{size:26,color:POS,anchor:'middle',weight:700})+label('−',x1+15,y0-22,{size:28,color:NEG,anchor:'middle',weight:700});
  s+=card(790,110,370,290,L('積層セラミック',975,165,{size:28,color:C.ink,weight:700})+L('コンデンサ（模式図）',975,205,{size:24,color:C.dim})
   +fade(seg(p,.5,.7),L('薄い層を 何百枚も',975,275,{size:26,color:C.ink})+L('S 大きく・d 小さく',975,330,{size:28,color:CC,weight:700})),seg(p,.2,.4),CC);
  return s;
 },
 [K+'dielectric']:(p)=>{
  let s=plates({qlab:1});
  s+=fade(seg(p,.1,.35),rect(G.LX+8,G.PT,G.RX-G.LX-16,G.PB-G.PT,{fill:'#c9b27a',fo:.18,stroke:'#c9b27a',sw:2,rx:4})
   +label('絶縁体',(G.LX+G.RX)/2,(G.PT+G.PB)/2+9,{size:28,color:C.ink,weight:700,anchor:'middle'}));
  s+=card(800,130,360,240,L('さらに 容量が増える',980,200,{size:28,color:CC,weight:700})
   +fade(seg(p,.55,.75),L('しくみは 上級で',980,285,{size:28,color:C.dim,weight:700})),seg(p,.3,.5),CC);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'summary']:(p)=>{
  const box=(x,title,tx,col,g)=>card(x,100,330,230,L(title,x+165,150,{size:26,color:col,weight:700})+T(tx,x+165,245,{size:48}),g,col);
  let s=box(60,'定義',`${Ct}=\\dfrac{${Qt}}{${Vt}}`,CC,seg(p,0,.2));
  s+=box(435,'電位の回から',`${Vt}=${Et}${dt}`,VC,seg(p,.3,.45));
  s+=box(810,'前回の結果',`${Et}=${QES}`,EC,seg(p,.55,.7));
  return s;
 },
 [K+'summary2']:(p)=>{
  const box=(x,title,tx,col)=>card(x,20,330,180,L(title,x+165,58,{size:24,color:col,weight:700})+T(tx,x+165,140,{size:38}),1,col);
  let s=box(60,'定義',`${Ct}=\\dfrac{${Qt}}{${Vt}}`,CC)+box(435,'電位の回から',`${Vt}=${Et}${dt}`,VC)+box(810,'前回の結果',`${Et}=${QES}`,EC);
  s+=fade(seg(p,.05,.25),L('↓',600,238,{size:36,color:C.dim}));
  s+=card(330,255,540,250,L('導いた結果（Q が 約分）',600,293,{size:26,color:C.hi,weight:700})+T(`${Ct}=${CRES}`,600,405,{size:52})
   +fade(seg(p,.55,.75),L('仮定：端を無視・真空',600,480,{size:24,color:C.dim})),seg(p,.15,.35),C.hi);
  return s;
 },
 [K+'back']:(p)=>{
  let s=card(90,120,440,250,L('初級',310,175,{size:28,color:C.dim,weight:700})+L('電池につないで 測る',310,260,{size:30,color:C.ink,weight:700}),seg(p,0,.2));
  s+=fade(seg(p,.25,.4),L('→',600,262,{size:48,color:C.dim}));
  s+=card(670,120,440,250,L('中級',890,175,{size:28,color:C.hi,weight:700})+T(`${Ct}=${CRES}`,890,275,{size:56}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'electrons']:(p)=>{
  let s=plates({qlab:1})+battery();
  s+=electronFlow(p);
  s+=fade(seg(p,.3,.5),arrow(G.LX-G.PW/2-40,G.PB-10,G.LX-G.PW/2-40,470,{color:NEG,w:4,head:14})
   +arrow(G.RX+G.PW/2+40,470,G.RX+G.PW/2+40,G.PB-10,{color:NEG,w:4,head:14}));
  s+=card(800,110,360,290,L('電子の流れ',980,165,{size:28,color:NEG,weight:700})
   +L('＋の板 → 電池の＋極',980,235,{size:26,color:C.ink})+L('電池の−極 → −の板',980,290,{size:26,color:C.ink})
   +fade(seg(p,.6,.8),L('導線の中の 電子',980,360,{size:26,color:NEG,weight:700})),seg(p,.15,.35),NEG);
  return s;
 },
 [K+'next']:(p)=>{
  // a piece of wire with electrons drifting to the left; a cross-section ring
  const y=260,x0=120,x1=720;let s=rect(x0,y-70,x1-x0,140,{fill:'#8795ad',fo:.18,stroke:C.dim,sw:2,rx:70});
  s+=fade(seg(p,.1,.3),ring(420,y,70,{color:C.hi,w:3,dash:'8 6'})+label('断面',420,y+105,{size:26,color:C.hi,anchor:'middle',weight:700}));
  const pts=[[180,230],[250,290],[320,245],[390,285],[470,235],[540,290],[610,250],[680,280],[220,265],[500,262],[640,225]];
  const sh=-((p*160)%70);
  for(const [x,yy] of pts){const xx=x0+((x-x0+sh+600)%(x1-x0-20))+10;s+=dot(xx,yy,8,NEG);}
  s+=card(800,110,360,290,L('次の問い',980,160,{size:26,color:C.dim})
   +T(`${cs(C.F,'I')}=\\;?`,980,235,{size:56})
   +fade(seg(p,.4,.6),L('電子の 数 と 速さ から',980,320,{size:28,color:C.hi,weight:700})),seg(p,.1,.3),C.hi);
  return s;
 },
};
