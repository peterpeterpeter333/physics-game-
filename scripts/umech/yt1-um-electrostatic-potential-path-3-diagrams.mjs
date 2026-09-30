// YouTube シリーズ「電位・中級 3/3」(ys-um-electrostatic-potential-path-3) — 図。Stage 1200×515.
// E＝−dV/dx（一様：V＝−4x → E＝4 V/m）、点電荷 V＝kQ/r（差の商で傾き −1/r²）、Q＝1 nC の数値、U＝qV、使えない場合。
// 部品は 1/3・2/3 から使う。色：電場 𝐄 水色、電位 V 紫、電荷 桃、位置エネルギー 橙、強調 黄、負 赤、傾き 金。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,axes,highlight} from './anim.mjs';
import {EC,VC,QP,WC,AL,NG,DC,FC,QC,cs,T,card,cross,L,vE,q,dr,Wt,Vt,IAB,charge,PL,P,plane,AB} from './yt1-um-electrostatic-potential-path-1-diagrams.mjs';

const K='um-electrostatic-potential-path-3:';
const VB=Vt('V_{\\mathrm{B}}'),VA=Vt('V_{\\mathrm{A}}'),INT=`${IAB}${vE}\\cdot${dr}`;
const V=Vt('V'),E=cs(EC,'E'),Qc=cs(QP,'Q'),kQ=`k${Qc}`;
const kx=cs(C.x,'x'),dx=`d${cs(C.x,'x')}`;
// V–x graph of the uniform example
function vxGraph({g=1,tan=0,o={x:110,y:430,w:420,h:300}}={}){
 const A=axes({x:o.x,y:o.y-o.h*.0,w:o.w,h:o.h,xmin:0,xmax:3.4,ymin:-13,ymax:1.5,xticks:[1,2,3],yticks:[-4,-8,-12],xlabel:'x [m]',ylabel:'V [V]',g,xcolor:C.x,ycolor:VC});
 let s=A.svg+fade(g,A.plot(u=>-4*u,{from:0,to:3.2,color:VC,w:5}));
 s+=fade(tan,draw([[A.X(1),A.Y(-4)],[A.X(2),A.Y(-4)],[A.X(2),A.Y(-8)]],1,{color:DC,w:3})+label('1 m',A.X(1.5),A.Y(-4)-10,{size:22,color:DC,anchor:'middle'})+label('−4 V',A.X(2)+10,A.Y(-6)+8,{size:22,color:DC}));
 return s;
}
// point charge picture
function pcharge(cx,cy,{g=1,E=1,rings=0,R=[70,130,190]}={}){
 let s='';
 s+=fade(rings,R.map(r=>ring(cx,cy,r,{color:VC,w:2,dash:'6 7'})).join(''));
 for(let k=0;k<12;k++){const a=k*Math.PI/6+.26;s+=fade(E,arrow(cx+Math.cos(a)*26,cy-Math.sin(a)*26,cx+Math.cos(a)*170,cy-Math.sin(a)*170,{color:EC,w:3,head:11,opacity:.6}));}
 s+=ring(cx,cy,20,{color:QC,w:3,fill:'#3a1d2a'})+label('+',cx,cy+9,{size:28,color:QC,anchor:'middle',weight:700})+label('Q',cx+26,cy-20,{size:26,color:QP,weight:700});
 return fade(g,s);
}
// V(r)=kQ/r (Q=1 nC → 8.99/r) and E(r)=8.99/r² graph
function vrGraph({g=1,Eg=0,pts=0,sec=0,o={x:110,y:440,w:470,h:330}}={}){
 const A=axes({x:o.x,y:o.y,w:o.w,h:o.h,xmin:0,xmax:4.2,ymin:0,ymax:11,xticks:[1,2,3,4],yticks:[2,4,6,8,10],xlabel:'r [m]',ylabel:'V [V]・E [V/m]',g});
 let s=A.svg+fade(g,A.plot(r=>8.99/r,{from:.82,to:4.1,color:VC,w:5}));
 s+=fade(Eg,A.plot(r=>8.99/(r*r),{from:.905,to:4.1,color:EC,w:4}));
 s+=fade(pts,dot(A.X(1),A.Y(8.99),7,VC)+dot(A.X(2),A.Y(4.495),7,VC)+label('8.99',A.X(1)+12,A.Y(8.99)-8,{size:22,color:VC,weight:700})+label('4.50',A.X(2)+12,A.Y(4.495)-8,{size:22,color:VC,weight:700}));
 s+=fade(sec,draw([[A.X(1),A.Y(8.99)],[A.X(2),A.Y(4.495)]],1,{color:DC,w:3,dash:'8 6'}));
 s+=fade(Eg,line(A.X(2.4),A.Y(10.2)-8,A.X(2.7),A.Y(10.2)-8,{color:VC,w:4})+label('V ＝ kQ/r',A.X(2.8),A.Y(10.2),{size:24,color:VC,weight:700})+line(A.X(2.4),A.Y(8.8)-8,A.X(2.7),A.Y(8.8)-8,{color:EC,w:4})+label('E ＝ kQ/r²',A.X(2.8),A.Y(8.8),{size:24,color:EC,weight:700}));
 return {svg:s,A};
}
const kQr=`${V}=\\dfrac{${kQ}}{r}`;

export const ytUmElectrostaticPotentialPath3Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=T(`${VB}-${VA}=-${INT}`,600,150,{size:66});
  s+=card(250,300,700,130,L('仕事 → 位置エネルギー → 電荷で割る',600,375,{size:28,color:C.ink}),seg(p,.3,.45),C.faint);
  return s;
 },
 [K+'lastq']:(p)=>{
  const c=(x,t1,t2,g)=>card(x,110,340,250,L(t1,x+170,200,{size:26})+L(t2,x+170,270,{size:30,color:C.hi,weight:700}),g,C.hi);
  return c(50,'電位の 地図 →','電場？',seg(p,0,.15))+c(430,'点電荷の 電位は','どんな形？',seg(p,.3,.45))+c(810,'この作り方が','使えない のは？',seg(p,.55,.7));
 },
 [K+'ask']:(p)=>{
  let s=card(100,90,1000,170,L('電位の 坂 から 電場 を 読む',600,160,{size:32,color:C.hi,weight:700})+L('点電荷の 電位は なぜ 1/r ？',600,225,{size:32,color:VC,weight:700}),1,C.hi);
  s+=fade(seg(p,.4,.6),T(`${V}\\;\\longrightarrow\\;${vE}\\ ?`,600,370,{size:60}));
  return s;
 },
 // ===== S2 坂から電場へ =====
 [K+'step']:(p)=>{
  let s=T(`d${V}=-${E}\\,${dx}`,600,130,{size:72});
  s+=fade(seg(p,.2,.4),label('x 方向に 小さな 一歩 dx',600,260,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('（前回の 対応表）',600,320,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'divide']:(p)=>{
  let s=T(`d${V}=-${E}\\,${dx}`,600,80,{size:50});
  s+=fade(seg(p,.1,.3),T(`\\dfrac{d${V}}{${dx}}=-${E}`,600,220,{size:60})+label('両辺 ÷ dx',860,225,{size:24,color:C.dim}));
  s+=fade(seg(p,.5,.7),T(`${E}=-\\dfrac{d${V}}{${dx}}`,600,390,{size:66})+label('× (−1)',860,395,{size:24,color:C.dim}));
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=card(80,90,500,300,L('電気',330,145,{size:26,color:C.dim})+T(`${E}=-\\dfrac{d${V}}{${dx}}`,330,265,{size:60}),1,EC);
  s+=card(620,90,500,300,L('力学',870,145,{size:26,color:C.dim})+T(`${cs(FC,'F')}=-\\dfrac{d${Wt('U')}}{${dx}}`,870,265,{size:60}),seg(p,.35,.5),FC);
  s+=fade(seg(p,.6,.75),L('同じ形：傾きに 負号',600,450,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=vxGraph({tan:seg(p,.3,.5)});
  s+=card(640,90,510,320,T(`${V}=-4${kx}`,895,155,{size:44})+fade(seg(p,.3,.45),T(`\\dfrac{d${V}}{${dx}}=-4\\ \\mathrm{V/m}`,895,245,{size:40}))+fade(seg(p,.6,.75),T(`${E}=${cs(EC,'4\\ \\mathrm{V/m}')}`,895,350,{size:46})),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'back']:(p)=>{
  let s=plane({})+AB({});
  s+=card(680,120,470,240,T(`${E}=4\\ \\mathrm{V/m}`,915,190,{size:44})+T(`=4\\ \\mathrm{N/C}`,915,270,{size:44})+fade(seg(p,.4,.55),L('出発点の 電場',915,335,{size:26,color:EC,weight:700})),seg(p,.02,.15),EC);
  return s;
 },
 [K+'elem']:(p)=>{
  let s=card(60,90,500,330,L('初級：まっすぐな 坂',310,145,{size:26,color:C.dim})+draw([[120,190],[500,360]],1,{color:VC,w:5})+L('強さ ＝ 下がり幅 ÷ 距離',310,400,{size:26,color:C.ink,weight:700}),1,C.faint);
  const f=u=>200+150/(u*1.6+.3);// a curved slope
  const pts=Array.from({length:60},(_,i)=>{const u=i/59;return [660+u*420,f(u)*1.0];});
  let cv=draw(pts,1,{color:VC,w:5});
  const u0=.3,x0=660+u0*420,y0=f(u0),h=.005,sl=(f(u0+h)-f(u0))/(h*420);
  cv+=fade(seg(p,.5,.7),line(x0-80,y0-80*sl,x0+80,y0+80*sl,{color:DC,w:3})+dot(x0,y0,7,DC));
  s+=card(620,90,520,330,L('曲がった 坂',880,145,{size:26,color:C.dim})+cv+fade(seg(p,.6,.75),L('その点での 傾き',880,400,{size:26,color:DC,weight:700})),seg(p,.35,.5),C.faint);
  return s;
 },
 [K+'flat']:(p)=>{
  const X=u=>120+u*560,Y=v=>420-v*260;
  const fV=u=>u<.35?.9:u<.65?.9-(u-.35)/.3*.75:.15;
  let s=draw(Array.from({length:101},(_,i)=>[X(i/100),Y(fV(i/100))]),1,{color:VC,w:5})+line(X(0),Y(0),X(1)+20,Y(0),{color:C.dim,w:2});
  s+=label('V',X(0)-16,Y(.9)+8,{size:26,color:VC,anchor:'end',weight:700});
  s+=fade(seg(p,.1,.3),label('急 → 電場 強い',X(.5)+20,Y(.52),{size:26,color:EC,weight:700})+arrow(X(.45),Y(.35)+40,X(.6),Y(.35)+40,{color:EC,w:5,head:14}));
  s+=fade(seg(p,.45,.65),label('平ら → 電場 0',X(.17),Y(.9)-24,{size:24,color:C.hi,anchor:'middle',weight:700})+label('平ら → 電場 0',X(.83),Y(.15)-24,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=card(760,140,380,200,L('電場 ＝ 電位の',950,210,{size:28})+L('坂の 急さ',950,270,{size:34,color:C.hi,weight:700}),seg(p,.7,.85),C.hi);
  return s;
 },
 [K+'3d']:(p)=>{
  let s=card(150,100,900,220,L('x、y、z の 各方向の 傾き を 並べる',600,180,{size:30,color:C.ink,weight:700})+L('（偏微分 → 上級）',600,250,{size:28,color:C.dim}),1,C.faint);
  s+=fade(seg(p,.3,.5),L('ここでは x 方向 だけ',600,400,{size:28,color:C.x,weight:700}));
  return s;
 },
 // ===== S3 点電荷の電位 =====
 [K+'setup']:(p)=>{
  let s=pcharge(330,265,{E:seg(p,.05,.35)});
  s+=card(660,110,480,250,L('ガウスの法則・中級 2/2',900,165,{size:24,color:C.dim})+T(`${E}=\\dfrac{${kQ}}{r^2}`,900,260,{size:56})+L('向き：中心から 外向き',900,335,{size:26,color:EC,weight:700}),seg(p,.25,.4),C.faint);
  return s;
 },
 [K+'base']:(p)=>{
  let s=pcharge(330,265,{});
  s+=fade(seg(p,.1,.3),arrow(500,265,640,265,{color:C.dim,w:3,head:12})+label('無限に 遠く',570,240,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(680,120,470,240,L('基準：無限に 遠い所',915,185,{size:28})+T(`${V}=0`,915,275,{size:54}),seg(p,.3,.45),VC);
  return s;
 },
 [K+'answer']:(p)=>{
  let s=pcharge(330,265,{rings:seg(p,.3,.6),E:.35});
  s+=card(680,110,470,260,T(kQr,915,215,{size:64})+fade(seg(p,.5,.65),L('r の 2乗 でなく 1乗',915,325,{size:28,color:C.hi,weight:700})),seg(p,.05,.2),VC);
  return s;
 },
 [K+'why']:(p)=>{
  let s=card(80,90,500,300,T(`${E}\\;\\propto\\;\\dfrac{1}{r^2}`,330,190,{size:54})+fade(seg(p,.15,.35),L('↓ 足し上げる',330,280,{size:28,color:C.hi,weight:700}))+fade(seg(p,.25,.45),T(`${V}\\;\\propto\\;\\dfrac{1}{r}`,330,355,{size:46})),1,C.faint);
  s+=card(620,90,500,300,L('次数が 1つ 上がる',870,170,{size:30,color:C.hi,weight:700})+fade(seg(p,.55,.7),L('万有引力の 位置エネルギー',870,260,{size:26})+L('も 1/r（同じ理由）',870,310,{size:26})),seg(p,.3,.45),C.faint);
  return s;
 },
 [K+'verify']:(p)=>{
  let s=T(kQr,600,110,{size:60});
  s+=fade(seg(p,.2,.4),T(`${E}=-\\dfrac{d${V}}{dr}\\;\\overset{?}{=}\\;\\dfrac{${kQ}}{r^2}`,600,300,{size:58}));
  s+=fade(seg(p,.55,.7),L('傾きで 確かめる',600,450,{size:28,color:DC,weight:700}));
  return s;
 },
 [K+'dq1']:(p)=>{
  // graph of 1/r with a secant from r to r+h
  const A=axes({x:100,y:440,w:470,h:330,xmin:0,xmax:3.2,ymin:0,ymax:2.2,xticks:[],yticks:[],xlabel:'r',ylabel:'1/r'});
  let s=A.svg+A.plot(r=>1/r,{from:.47,to:3.1,color:VC,w:5});
  const r=1,h=.9;
  s+=fade(seg(p,.2,.4),dot(A.X(r),A.Y(1/r),7,C.ink)+dot(A.X(r+h),A.Y(1/(r+h)),7,C.ink)+line(A.X(r),A.Y(1/r),A.X(r+h),A.Y(1/(r+h)),{color:DC,w:3})
   +label('r',A.X(r),A.Y(0)+30,{size:24,color:C.ink,anchor:'middle'})+label('r＋h',A.X(r+h),A.Y(0)+30,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(640,100,510,300,L('差の商',895,155,{size:26,color:DC,weight:700})+T(`\\dfrac{\\dfrac{1}{r+h}-\\dfrac{1}{r}}{h}`,895,280,{size:50}),seg(p,.3,.45),C.faint);
  return s;
 },
 [K+'dq2']:(p)=>{
  let s=T(`\\dfrac{1}{r+h}-\\dfrac{1}{r}=\\dfrac{r-(r+h)}{r(r+h)}`,600,100,{size:48});
  s+=fade(seg(p,.1,.3),T(`=\\dfrac{${cs(NG,'-h')}}{r(r+h)}`,600,230,{size:48}));
  s+=fade(seg(p,.5,.7),T(`\\div h\\;\\Rightarrow\\;-\\dfrac{1}{r(r+h)}`,600,380,{size:52}));
  return s;
 },
 [K+'dq3']:(p)=>{
  let s=T(`-\\dfrac{1}{r(r+${cs(DC,'h')})}`,600,130,{size:58});
  s+=fade(seg(p,.1,.3),label('h → 0',600,250,{size:30,color:DC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),T(`\\longrightarrow\\;-\\dfrac{1}{r^2}`,600,370,{size:62}));
  return s;
 },
 [K+'E']:(p)=>{
  let s=T(`\\dfrac{d${V}}{dr}=-\\dfrac{${kQ}}{r^2}`,600,100,{size:52});
  s+=fade(seg(p,.2,.4),T(`${E}=-\\dfrac{d${V}}{dr}=\\dfrac{${kQ}}{r^2}`,600,260,{size:60}));
  s+=card(300,360,600,110,L('ガウスの法則の回の 電場に 戻った',600,425,{size:28,color:EC,weight:700}),seg(p,.55,.7),EC);
  return s;
 },
 [K+'inf']:(p)=>{
  let s=T(kQr,600,110,{size:56});
  s+=fade(seg(p,.1,.3),T(`r\\to\\infty\\;\\Rightarrow\\;\\dfrac{${kQ}}{r}\\to0`,600,260,{size:52}));
  s+=card(300,350,600,110,L('基準（無限遠で V ＝ 0）も 満たす',600,415,{size:28,color:VC,weight:700}),seg(p,.5,.65),VC);
  return s;
 },
 [K+'eps']:(p)=>{
  let s=T(`k=\\dfrac{1}{4\\pi\\varepsilon_0}`,330,150,{size:54})+label('（ε₀ はガウスの回で定義）',330,260,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.35,.55),T(`${V}=\\dfrac{${kQ}}{r}=\\dfrac{${Qc}}{4\\pi\\varepsilon_0 r}`,820,160,{size:54}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=pcharge(300,265,{E:.4});
  s+=card(620,110,530,260,T(`${Qc}=1\\ \\mathrm{nC}=10^{-9}\\ \\mathrm{C}`,885,180,{size:40})+fade(seg(p,.35,.5),T(`${kQ}\\approx8.99\\ \\mathrm{V\\cdot m}`,885,290,{size:46})),1,C.faint);
  return s;
 },
 [K+'num2']:(p)=>{
  const G=vrGraph({pts:seg(p,.05,.35)});
  let s=G.svg;
  s+=card(660,110,490,260,T(`r=1\\ \\mathrm{m}:\\ ${Vt('8.99\\ \\mathrm{V}')}`,905,180,{size:40})+T(`r=2\\ \\mathrm{m}:\\ ${Vt('4.50\\ \\mathrm{V}')}`,905,260,{size:40})+fade(seg(p,.55,.7),L('距離 2倍 → 電位 半分',905,330,{size:26,color:C.hi,weight:700})),seg(p,.1,.25),C.faint);
  return s;
 },
 [K+'avg']:(p)=>{
  const G=vrGraph({pts:1,sec:seg(p,.05,.3)});
  let s=G.svg;
  s+=card(660,110,490,260,L('1 m → 2 m の 平均',905,165,{size:26,color:DC,weight:700})+T(`\\dfrac{8.99-4.50}{1\\ \\mathrm{m}}\\approx4.50\\ \\mathrm{V/m}`,905,255,{size:36})+fade(seg(p,.55,.7),L('平均の 電場 約 4.50 V/m',905,335,{size:26,color:EC,weight:700})),seg(p,.15,.3),C.faint);
  return s;
 },
 [K+'local']:(p)=>{
  const G=vrGraph({pts:1,sec:.5,Eg:seg(p,.05,.3)});
  let s=G.svg;const A=G.A;
  s+=fade(seg(p,.2,.4),dot(A.X(1),A.Y(8.99),6,EC)+dot(A.X(2),A.Y(2.2475),7,EC)+label('2.25',A.X(2)+12,A.Y(2.2475)+26,{size:22,color:EC,weight:700}));
  s+=card(660,90,490,300,T(`r=1\\ \\mathrm{m}:\\ ${cs(EC,'8.99\\ \\mathrm{V/m}')}`,905,160,{size:36})+T(`r=2\\ \\mathrm{m}:\\ ${cs(EC,'2.25\\ \\mathrm{V/m}')}`,905,230,{size:36})
   +fade(seg(p,.55,.7),L('2.25 ＜ 平均 4.50 ＜ 8.99',905,320,{size:28,color:C.hi,weight:700})),seg(p,.1,.25),C.faint);
  return s;
 },
 [K+'graph']:(p)=>{
  const G=vrGraph({Eg:1});
  let s=G.svg;
  s+=card(660,110,490,260,L('電位 V：1/r で ゆるやか',905,175,{size:26,color:VC,weight:700})+L('電場 E：1/r² で 急に',905,235,{size:26,color:EC,weight:700})+fade(seg(p,.5,.65),L('電場 ＝ 電位の 坂の 急さ',905,310,{size:28,color:C.hi,weight:700})),seg(p,.05,.2),C.faint);
  return s;
 },
 // ===== S4 U = qV =====
 [K+'U']:(p)=>{
  let s=T(`${Wt('U')}=${q}${V}`,600,110,{size:66});
  s+=fade(seg(p,.4,.6),T(`=\\dfrac{${kQ}${q}}{r}`,600,270,{size:66}));
  s+=fade(seg(p,.4,.6),label('点電荷の まわり',900,280,{size:26,color:C.dim}));
  return s;
 },
 [K+'same']:(p)=>{
  const cx=200,cy=280;
  let s=ring(cx,cy,20,{color:QC,w:3,fill:'#3a1d2a'})+label('+',cx,cy+9,{size:28,color:QC,anchor:'middle',weight:700})+label('Q',cx,cy-34,{size:24,color:QP,anchor:'middle',weight:700});
  const X=seg(p,.3,.8);const qx=cx+130+X*120;
  s+=charge(qx,cy,{text:'q'});
  s+=fade(seg(p,.3,.5),arrow(qx+26,cy,qx+110,cy,{color:FC,w:5,head:14}));
  s+=card(620,90,520,320,L('同じ 符号',880,145,{size:28,color:C.hi,weight:700})+T(`${Wt('U')}>0`,880,220,{size:48})+L('近いほど 大きい',880,290,{size:26})+fade(seg(p,.4,.55),L('U が 減る向き → 反発',880,355,{size:28,color:FC,weight:700})),1,C.faint);
  return s;
 },
 [K+'opp']:(p)=>{
  const cx=200,cy=280;
  let s=ring(cx,cy,20,{color:QC,w:3,fill:'#3a1d2a'})+label('+',cx,cy+9,{size:28,color:QC,anchor:'middle',weight:700})+label('Q',cx,cy-34,{size:24,color:QP,anchor:'middle',weight:700});
  const X=seg(p,.3,.8);const qx=cx+250-X*110;
  s+=charge(qx,cy,{text:'q',neg:true});
  s+=fade(seg(p,.3,.5),arrow(qx-26,cy,qx-100,cy,{color:FC,w:5,head:14}));
  s+=card(620,90,520,320,L('違う 符号',880,145,{size:28,color:C.hi,weight:700})+T(`${Wt('U')}<0`,880,220,{size:48})+L('近いほど 低い（谷）',880,290,{size:26})+fade(seg(p,.4,.55),L('谷へ 向かう → 引き合う',880,355,{size:28,color:FC,weight:700})),1,C.faint);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=T(`${Wt('U')}=${q}${V}=(-10^{-9})\\times8.99`,600,110,{size:50});
  s+=fade(seg(p,.2,.4),T(`\\approx${cs(NG,'-8.99\\times10^{-9}\\ \\mathrm{J}')}`,600,240,{size:54}));
  s+=fade(seg(p,.05,.2),label('Q ＝ 1 nC から 1 m、q ＝ −1 nC',600,370,{size:26,color:QP,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pull']:(p)=>{
  let s=T(`${cs(NG,'-8.99\\times10^{-9}\\ \\mathrm{J}')}\\;\\longrightarrow\\;0`,600,110,{size:50});
  s+=fade(seg(p,.1,.3),label('無限に 遠く 引き離す',600,210,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(250,280,700,150,L('外から する 仕事',600,335,{size:28})+T(`\\approx${Wt('8.99\\times10^{-9}\\ \\mathrm{J}')}`,600,400,{size:44}),seg(p,.35,.5),WC);
  return s;
 },
 [K+'sign']:(p)=>{
  let s=card(60,80,520,380,L('対応する',320,135,{size:28,color:C.hi,weight:700})+L('・高さ ↔ 電位',320,205,{size:26})+L('・坂の急さ ↔ 電場の強さ',320,265,{size:26})+L('・正の電荷 → 下る向き',320,325,{size:26}),1,C.hi);
  s+=card(620,80,520,380,L('対応しない',880,135,{size:28,color:NG,weight:700})+L('・負の電荷 → 上る向き',880,205,{size:26})+L('・電位は 高さでなく',880,265,{size:26})+L('1 C あたりの エネルギー',880,310,{size:26}),seg(p,.4,.55),NG);
  return s;
 },
 // ===== S5 使えないとき =====
 [K+'fail1']:(p)=>{
  let s=card(150,100,900,200,L('ここまで：電荷が 止まっている',600,170,{size:30})+T(`\\oint_C${vE}\\cdot${dr}=0`,600,245,{size:44}),1,C.faint);
  s+=fade(seg(p,.5,.65),L('使えない のは どんなとき？',600,400,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'fail2']:(p)=>{
  // a coil loop with a magnet moving in
  const cx=330,cy=270;
  let s=`<ellipse cx="${cx}" cy="${cy}" rx="150" ry="60" fill="none" stroke="${C.F}" stroke-width="5"/>`;
  const k=seg(p,0,1),my=110-40*k;
  s+=rect(cx-30,my-80,60,70,{fill:'#ff8f9b',fo:.5,stroke:'#ff8f9b',rx:6})+rect(cx-30,my-10,60,70,{fill:'#6f9dff',fo:.5,stroke:'#6f9dff',rx:6});
  s+=label('N',cx,my-35,{size:24,color:C.ink,anchor:'middle',weight:700})+label('S',cx,my+35,{size:24,color:C.ink,anchor:'middle',weight:700});
  for(let i=0;i<8;i++){const a=i*Math.PI/4+.4,x=cx+150*Math.cos(a),y=cy+60*Math.sin(a),tx=-150*Math.sin(a),ty=60*Math.cos(a),n=Math.hypot(tx,ty);s+=fade(seg(p,.3,.5),arrow(x,y,x+tx/n*40,y+ty/n*40,{color:EC,w:4,head:12}));}
  s+=card(660,110,490,260,L('磁場が 時間で 変わる',905,175,{size:28,color:C.E,weight:700})+fade(seg(p,.4,.55),T(`\\oint_C${vE}\\cdot${dr}\\neq0`,905,265,{size:44}))+fade(seg(p,.6,.75),L('一周の 仕事が 0 でない',905,335,{size:26,color:NG,weight:700})),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'fail3']:(p)=>{
  let s=card(150,90,900,210,L('一周して 同じ点に 戻っても 値が 残る',600,165,{size:30})+L('→ 位置だけの 電位 V は 同じ形では 置けない',600,240,{size:30,color:NG,weight:700}),1,NG);
  s+=fade(seg(p,.5,.65),cross(600,400,30,NG)+T(`${V}(\\mathbf{r})`,720,400,{size:44}));
  return s;
 },
 [K+'fail4']:(p)=>{
  let s=card(200,110,800,250,L('→ 電磁誘導の回',600,190,{size:34,color:C.hi,weight:700})+L('発電機が 電流を 押し出す',600,270,{size:28})+L('＝ この 一周の 仕事',600,320,{size:28,color:C.E,weight:700}),seg(p,.02,.15),C.hi);
  return s;
 },
 // ===== S6 まとめ =====
 [K+'sum1']:(p)=>{
  let s=card(60,90,520,300,L('電場 ＝ 電位の 坂',320,150,{size:28,color:EC,weight:700})+T(`${E}=-\\dfrac{d${V}}{${dx}}`,320,275,{size:54}),1,EC);
  s+=card(620,90,520,300,L('点電荷',880,150,{size:28,color:VC,weight:700})+T(kQr,880,260,{size:54})+L('1/r² を 足し上げ → 1/r',880,350,{size:24,color:C.hi,weight:700}),seg(p,.4,.55),VC);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=T(`${Wt('U')}=${q}${V}`,600,110,{size:62});
  s+=card(200,240,800,170,L('電位が 使えるのは',600,300,{size:28})+T(`\\oint_C${vE}\\cdot${dr}=0`,600,370,{size:44}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.55,.7),label('静電場',1015,380,{size:28,color:EC,weight:700}));
  return s;
 },
 [K+'next1']:(p)=>{
  let s=plane({})+AB({g:0});
  const a=P([.5,1]),b=P([3,1]);
  s+=fade(seg(p,.1,.3),dot(...a,7,C.ink)+dot(...b,7,C.ink)+line(a[0],a[1]+40,b[0],b[1]+40,{color:C.ink,w:3})+label('d',(a[0]+b[0])/2,a[1]+70,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=card(680,120,470,240,T(`${V}=${E}d`,915,200,{size:60})+fade(seg(p,.45,.6),L('下がり幅 ＝ 強さ × 距離',915,300,{size:26,color:C.hi,weight:700})),seg(p,.2,.35),C.faint);
  return s;
 },
 [K+'next']:(p)=>{
  const x1=260,x2=460,y1=110,y2=420;
  let s=rect(x1-14,y1,14,y2-y1,{fill:QC,fo:.6,stroke:QC,rx:3})+rect(x2,y1,14,y2-y1,{fill:'#6f9dff',fo:.6,stroke:'#6f9dff',rx:3});
  s+=label('+Q',x1-7,y1-14,{size:26,color:QC,anchor:'middle',weight:700})+label('−Q',x2+7,y1-14,{size:26,color:'#6f9dff',anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.35),[160,240,320].map(y=>arrow(x1+10,y,x2-10,y,{color:EC,w:4,head:12})).join('')+label('？',(x1+x2)/2,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=card(620,110,520,280,L('板の 間の 電場 と 電位差は？',880,190,{size:28,color:C.ink,weight:700})+fade(seg(p,.5,.65),L('1 V あたり どれだけ',880,270,{size:30,color:C.hi,weight:700})+L('ためられる？',880,320,{size:30,color:C.hi,weight:700})),seg(p,.3,.45),C.hi);
  return s;
 },
};
