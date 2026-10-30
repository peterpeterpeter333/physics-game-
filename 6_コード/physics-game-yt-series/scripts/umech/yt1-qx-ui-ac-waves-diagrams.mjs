// 問題編 解説「25 Hz の交流と、ひもの波」（q-ui-ac-waves、大学編 29 マクスウェル方程式・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/29_マクスウェル方程式.md の q-ui-ac-waves（解説 18 行）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色（正本・単元動画どおり）：電流 I 緑、電圧 V 紫、時間 t・周期 T 金、振動数 f 桃、位相差 橙、波長 λ・場所 x 水色、旗・強調 黄、ひもの印 赤。
// 単元動画（yt1-ui-ac-waves-1/2）の色の定数を import して使う。グラフ・円・ひもは、目盛りの文字を 22px 以上にするため、ここで描き直す。
// 図のために決めた値：電流 I＝sin(2π(t−0.01)/0.04)（山 t＝0.02 s）、電圧 V＝sin(2πt/0.04)（山 t＝0.01 s）。振幅は図の都合（値は出さない）。
//   ひもの波 y＝A sin 2π(t/T − x/λ)、λ＝2.5 m、T＝0.25 s。赤い印は x＝3 m。行15 は 0〜10.5 m の帯（1 秒で山が 10 m 進む。ゆっくり再生）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth} from './anim.mjs';
import {IC,VC,TC,WC,PH,cs,TAU} from './yt1-ui-ac-waves-1-diagrams.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,note,sentWin,cueT,tAt,isProblem} from './yt1-qx-common.mjs';

const K='qx-ui-ac-waves:';
const LC=C.x,FLAG=C.hi,MARK=C.a,ROPE='#c9d6ea',FC=WC;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const G1='周期 T',G2='位相差と、進んでいる方',G3='波の速さ v';
const ANS1=g=>answerTag(1,'B','0.04 s',{g}),ANS2=g=>answerTag(2,'C','π/2、電圧が進む',{g}),ANS3=g=>answerTag(3,'C','10 m/s',{g});
const tT=cs(TC,'T'),tf=cs(FC,'f'),tv=cs(C.v,'v'),tl=cs(LC,'\\lambda'),tDt=cs(PH,'\\Delta t'),tPh=cs(PH,'2\\pi');

// ---- 交流のグラフ（上に電流、下に電圧。横軸は時刻 t）----
const PER=.04;
const Ift=t=>Math.sin(TAU*(t-.01)/PER),Vft=t=>Math.sin(TAU*t/PER);
function acPair({x=130,w=700,yI=150,yV=260,amp=40,tmax=.065,pi=1,pv=1,gap=0,gapLab='0.01 s',dtLab=0,g=1,vPeak=0,dim=1}={}){
 const X=t=>x+w*t/tmax;
 let s='';
 const base=(y,name,col)=>arrow(x-6,y,x+w+26,y,{color:C.dim,w:2.5,head:12})+label(name,x-14,y+9,{size:24,color:col,anchor:'end',weight:700})
  +label('t',x+w+34,y+9,{size:26,color:TC,weight:700});
 s+=base(yI,'電流 I',IC)+base(yV,'電圧 V',VC);
 const pts=(f,y)=>Array.from({length:241},(_,i)=>{const t=tmax*i/240;return [X(t),y-amp*f(t)];});
 s+=draw(pts(Ift,yI),pi,{color:IC,w:5})+draw(pts(Vft,yV),pv,{color:VC,w:5});
 if(gap){
  const a=X(.01),b=X(.02),yr=yV+amp+26;
  s+=fade(gap,dot(a,yV-amp,9,VC)+dot(b,yI-amp,9,IC)+line(a,yV-amp,a,yr+8,{color:VC,w:2,dash:'6 6'})+line(b,yI-amp,b,yr+8,{color:IC,w:2,dash:'6 6'})
   +arrow((a+b)/2,yr,a,yr,{color:TC,w:4,head:12})+arrow((a+b)/2,yr,b,yr,{color:TC,w:4,head:12})
   +label(gapLab,b+14,yr+9,{size:26,color:TC,weight:700}));
  if(dtLab)s+=fade(dtLab,label('Δt ＝ 時間の ずれ',b+14,yr+44,{size:24,color:PH,weight:700}));
 }
 if(vPeak)s+=fade(vPeak,ring(X(.01),yV-amp,20,{color:C.hi,w:4})+label('電圧の 山が 先',X(.01)-24,yV-amp-26,{size:24,color:C.hi,weight:700,anchor:'start'}));
 return fade(g*dim,s);
}
// 「25 Hz」の札（桃）
const hzTag=(x,y,txt='25 Hz',g=1)=>fade(g,rect(x,y,textWidth(txt)+36,50,{fill:FC,fo:.14,stroke:FC,sw:2.5,rx:12})+label(txt,x+18,y+35,{size:30,color:FC,weight:700}));
function textWidth(s){let w=0;for(const ch of s)w+=ch===' '?.34:/[!-~]/.test(ch)?.64:1.02;return w*30;}

// ---- 位相の円：電流と電圧を、同じ速さで回る2点として ----
function phaseCircle(u,{cx=920,cy=280,R=110,g=1,arc=0,arcLab=''}={}){
 const P=a=>[cx+R*Math.cos(a),cy-R*Math.sin(a)];
 const ai=u-Math.PI/2,av=u;     // 電流は電圧より π/2 遅れた角
 const [ix,iy]=P(ai),[vx,vy]=P(av);
 let s=line(cx-R-20,cy,cx+R+20,cy,{color:C.faint,w:2})+line(cx,cy+R+20,cx,cy-R-20,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
 if(arc)s+=fade(arc,draw(Array.from({length:31},(_,i)=>{const a=ai+Math.PI/2*i/30;return [cx+R*.42*Math.cos(a),cy-R*.42*Math.sin(a)];}),1,{color:PH,w:6}));
 s+=line(cx,cy,ix,iy,{color:IC,w:3})+line(cx,cy,vx,vy,{color:VC,w:3})+dot(ix,iy,12,IC)+dot(vx,vy,12,VC);
 s+=label('I',ix+(ix>=cx?18:-18),iy+8,{size:26,color:IC,weight:700,anchor:ix>=cx?'start':'end'})+label('V',vx+(vx>=cx?18:-18),vy+8,{size:26,color:VC,weight:700,anchor:vx>=cx?'start':'end'});
 if(arcLab)s+=fade(arc,label(arcLab,cx,cy+R+50,{size:28,color:PH,anchor:'middle',weight:700}));
 return fade(g,s);
}

// ---- ひもの波：y＝A sin 2π(ph − x/λ)（ph＝t/T）----
const LAM=2.5;
function rope(ph,{x0=100,pxm=130,xmax=6,cy=290,amp=55,axis=1,g=1,ticks=[0,1,2,3,4,5,6],shift=0}={}){
 const RX=m=>x0+pxm*m;
 let s='';
 if(axis){const ay=cy+amp+40;
  s+=arrow(RX(0)-8,ay,RX(xmax)+30,ay,{color:C.dim,w:2.5,head:12})+label('場所 x [m]',RX(xmax)+20,ay-14,{size:24,color:LC,anchor:'end',weight:700});
  for(const m of ticks)s+=line(RX(m),ay-6,RX(m),ay+6,{color:LC,w:2})+label(String(m),RX(m),ay+32,{size:22,color:LC,anchor:'middle'});}
 s+=line(RX(0),cy,RX(xmax),cy,{color:C.faint,w:1.5,dash:'6 8'});
 s+=draw(Array.from({length:301},(_,i)=>{const x=xmax*i/300;return [RX(x),cy-amp*Math.sin(TAU*(ph-x/LAM)+shift)];}),1,{color:ROPE,w:5});
 s+=rect(RX(0)-30,cy-amp*Math.sin(TAU*ph+shift)-15,24,30,{fill:C.dim,fo:.5,rx:6});
 return {svg:fade(g,s),RX,Y:(x,p=ph)=>cy-amp*Math.sin(TAU*(p-x/LAM)+shift)};
}
const flag=(x,y,g=1)=>fade(g,line(x,y-10,x,y-70,{color:FLAG,w:3})+`<polygon points="${x},${y-70} ${x+34},${y-60} ${x},${y-50}" fill="${FLAG}"/>`);
// 時計（金）：1周 ＝ 1周期
function clock(cx,cy,r,u,{g=1,txt=''}={}){
 let s=ring(cx,cy,r,{color:TC,w:4,fill:'#1a1a10'});
 for(let i=0;i<4;i++){const a=TAU*i/4;s+=line(cx+r*.8*Math.sin(a),cy-r*.8*Math.cos(a),cx+r*Math.sin(a),cy-r*Math.cos(a),{color:TC,w:3});}
 const a=TAU*u;
 if(u>.01){const n=Math.max(2,Math.ceil(36*u)),pts=Array.from({length:n+1},(_,i)=>{const b=a*i/n;return [cx+r*.62*Math.sin(b),cy-r*.62*Math.cos(b)];});
  s+=draw([[cx,cy],...pts,[cx,cy]],1,{color:TC,w:0,fill:TC,opacity:.28});}
 s+=line(cx,cy,cx+r*.78*Math.sin(a),cy-r*.78*Math.cos(a),{color:TC,w:5})+dot(cx,cy,6,TC);
 if(txt)s+=label(txt,cx,cy+r+38,{size:26,color:TC,anchor:'middle',weight:700});
 return fade(g,s);
}

// ---- 1秒の帯に 25 往復 ----
function strip({g=1,first=0,firstLab='',div=0,x0=100,w=1000,cy=190,amp=24}={}){
 let s=rect(x0,cy-amp-20,w,2*amp+40,{fill:TC,fo:.10,stroke:TC,sw:2,rx:8});
 s+=draw(Array.from({length:1001},(_,i)=>{const u=i/1000;return [x0+w*u,cy-amp*Math.sin(TAU*25*u)];}),1,{color:IC,w:3});
 s+=brace(x0,x0+w,cy-amp-28,{dir:-1,color:TC,text:'1 秒',size:26});
 const cw=w/25;
 if(first)s+=fade(first,highlight(x0-2,cy-amp-16,cw+4,2*amp+32,1,C.hi)+(firstLab?label(firstLab,x0+cw/2,cy+amp+54,{size:26,color:firstLab.includes('0.04')?TC:C.hi,anchor:'start',weight:700}):''));
 if(div)s+=fade(div,label('25 往復',x0+w-10,cy+amp+54,{size:26,color:FC,anchor:'end',weight:700}));
 return fade(g,s);
}

// ---- 問題アニメの図：上に交流（25 Hz・0.01 s）、下にひも（波長 2.5 m・4 Hz・赤い印） ----
function quizFig(p,{t=0}={}){
 const pa=seg(p,.02,.42);
 let s=hzTag(880,95,'25 Hz',seg(p,0,.06));
 s+=acPair({x:130,w:700,yI:135,yV:235,amp:36,pi:pa,pv:pa,gap:seg(p,.45,.55)});
 // 後半（ひも）：4 秒目から
 const gr=seg(p,.57,.64),ph=.45*seg(p,.6,.86);
 const R=rope(ph,{x0:130,pxm:700/6,cy:385,amp:36,g:gr});
 s+=R.svg;
 s+=fade(gr,dot(R.RX(3),R.Y(3),11,MARK));
 s+=fade(seg(p,.7,.78),rect(880,300,250,50,{fill:LC,fo:.12,stroke:LC,sw:2.5,rx:12})+label('波長 2.5 m',900,335,{size:30,color:LC,weight:700}));
 s+=hzTag(880,362,'4 Hz',seg(p,.74,.82));
 s+=pauseBadge({g:seg(p,.87,.93),x:1005,y:440});
 return s;
}

export const ytQxUiAcWavesDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約7秒）：0〜4 s 交流のグラフを描き進め、0.01 s の金の両矢印。4〜7 s ひもの波が右へ少し進み、映像を一時停止。周期の値・速さは出さない。
 [K+'q1']:(p)=>quizFig(p),

 // ===================== 小問1 =====================
 // 1. 札「25 Hz」と電流のグラフ。求めるもの：周期 T
 [K+'goal1']:(p)=>{
  let s=hzTag(130,95,'25 Hz',seg(p,0,.1));
  const X=t=>140+940*t/.1,cy=300,amp=90;
  s+=arrow(130,cy,1110,cy,{color:C.dim,w:2.5,head:12})+label('t',1118,cy+9,{size:26,color:TC,weight:700})+label('電流 I',130,cy-amp-24,{size:24,color:IC,weight:700});
  s+=draw(Array.from({length:401},(_,i)=>{const t=.1*i/400;return [X(t),cy-amp*Math.sin(TAU*t/PER)];}),seg(p,.05,.6),{color:IC,w:5});
  s+=fade(seg(p,.55,.7),label('1往復に かかる 時間は？',610,470,{size:30,color:TC,anchor:'middle',weight:700}));
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. 定義。1秒の帯に山と谷の組を 25 個。札「25 Hz」に f＝振動数、1組の幅に T＝周期。÷25、そのあと T＝1/f
 [K+'Tdef']:(p)=>{
  let s=kindTag('定義',1120,110,{g:seg(p,0,.08)});
  s+=strip({g:seg(p,.02,.15),div:seg(p,.12,.22),first:seg(p,.32,.44),firstLab:'1組の 幅 ＝ T ＝ 周期'});
  s+=fade(seg(p,.2,.32),hzTag(130,295,'25 Hz')+label('f ＝ 振動数（1秒の 往復の 回数）',320,330,{size:26,color:FC,weight:700}));
  s+=fade(seg(p,.44,.56),label('1 秒 ÷ 25',1100,330,{size:34,color:C.ink,anchor:'end',weight:700}));
  s+=card(420,385,360,115,T(`${tT}=\\dfrac{1}{${tf}}`,600,440,46),seg(p,.62,.74),C.hi);
  return s+goalTag(G1);
 },
 // 3. 1÷25＝0.04。1個分の幅を黄で囲み「0.04 s」（金）。小問1 の答え B
 [K+'ans1']:(p)=>{
  let s=strip({first:1,firstLab:'0.04 s'});
  s+=card(300,330,600,130,T(`${tT}=\\dfrac{1}{25}=${cs(TC,'0.04\\ \\mathrm{s}')}`,600,395,46),seg(p,0,.1),C.hi);
  return s+goalTag(G1)+ANS1(seg(p,.4,.5));
 },
 // 4. 誤答 A → C（1枚ずつ）
 [K+'wrong1']:(p,ctx)=>{
  let s=fade(.5,strip({first:1,firstLab:'0.04 s'}));
  s+=wrongSeq(p,ctx,[['A','25 s','1秒の回数を 1回の時間と 取り違えた'],['C','0.4 s','1÷25 の 位取りを 誤った']]);
  return s+goalTag(G1)+ANS1(1);
 },
 // 5. 誤答 D（157 s）
 [K+'wrongD']:(p)=>{
  let s=fade(.5,strip({first:1,firstLab:'0.04 s'}));
  s+=wrongCard('D','157 s','ω＝2π×25（単位 rad/s）',{g:seg(p,.02,.08)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 6. 電流と電圧のグラフ、0.01 s の金の両矢印。求めるもの：位相差と、進んでいる方
 [K+'goal2']:(p)=>{
  let s=hzTag(960,95,'25 Hz');
  s+=acPair({x:150,w:760,yI:170,yV:320,amp:55,pi:seg(p,.02,.3),pv:seg(p,.02,.3),gap:seg(p,.3,.42)});
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 7. 円の上の2点（同じ速さで回る）。Δt＝時間のずれ → 位相差＝2π×(Δt÷T)（①図 → ②式）
 [K+'rule']:(p,ctx)=>{
  const cA=1-seg(p,.55,.6),cB=seg(p,.58,.64);
  const u=Math.PI/2+TAU*.8*seg(p,.05,.5);
  let a=acPair({x:130,w:500,yI:160,yV:300,amp:48,gap:1,dtLab:seg(p,.3,.4)});
  a+=phaseCircle(u,{cx:930,cy:270,R:115});
  a+=fade(seg(p,.1,.2),label('同じ 速さで 回る 2点',930,470,{size:26,color:C.dim,anchor:'middle',weight:700}));
  let s=fade(cA,a);
  let b=label('1周期の ずれ ＝ 角度で 2π',600,150,{size:30,color:PH,anchor:'middle',weight:700});
  b+=fade(seg(p,.66,.76),label('位相差 ＝',560,295,{size:44,color:PH,anchor:'end',weight:700})+T(`${tPh}\\times\\left(${tDt}\\div${tT}\\right)`,580,280,54,{color:PH,anchor:'start'}));
  b+=fade(seg(p,.78,.88),label('Δt：時間の ずれ',420,420,{size:28,color:PH,anchor:'middle',weight:700})+label('T：周期',800,420,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=fade(cB,b);
  return s+goalTag(G2);
 },
 // 8. 0.01÷0.04＝1/4、2π÷4＝π/2。円の上で2点の間の角に橙の弧
 [K+'calc2']:(p)=>{
  let s=phaseCircle(Math.PI*.75,{cx:280,cy:290,R:140,arc:seg(p,.5,.62),arcLab:'π/2（90°）'});
  s+=card(560,100,600,380,
   T(`\\dfrac{0.01}{0.04}=\\dfrac{1}{4}`,860,190,46)+label('周期の 4分の1',860,265,{size:26,color:TC,anchor:'middle',weight:700})
   +fade(seg(p,.45,.58),line(600,300,1120,300,{color:C.faint,w:2})+T(`${tPh}\\div 4=${cs(PH,'\\dfrac{\\pi}{2}')}`,860,385,48)),seg(p,0,.12),PH);
  return s+goalTag(G2);
 },
 // 9. 山が先の方が進んでいる。電圧の山（紫）を黄で示す。円の上で紫の点が先を回る。小問2 の答え C
 [K+'ans2']:(p)=>{
  const u=Math.PI*.75+1.2*seg(p,.1,.9);
  let s=acPair({x:130,w:520,yI:170,yV:320,amp:50,gap:1,vPeak:seg(p,.08,.2)});
  s+=phaseCircle(u,{cx:940,cy:280,R:115,arc:1});
  s+=fade(seg(p,.25,.38),label('紫（電圧）が 先を 回る',940,470,{size:26,color:VC,anchor:'middle',weight:700}));
  return s+goalTag(G2)+ANS2(seg(p,.7,.8));
 },
 // 10. 50 Hz と 25 Hz：同じ 0.01 s が半周期と4分の1周期。誤答 A
 [K+'wrongA2']:(p)=>{
  const x=180,w=760,tmax=.06,X=t=>x+w*t/tmax;
  const row=(cy,per,name,txt,g)=>{let r=arrow(x-6,cy,x+w+26,cy,{color:C.dim,w:2.5,head:12})+label(name,x-14,cy+9,{size:26,color:FC,anchor:'end',weight:700});
   r+=rect(X(0),cy-42,X(.01)-X(0),84,{fill:TC,fo:.18,stroke:TC,sw:2,rx:4});
   r+=draw(Array.from({length:241},(_,i)=>{const t=tmax*i/240;return [X(t),cy-38*Math.sin(TAU*t/per)];}),1,{color:IC,w:4});
   r+=label(txt,X(0),cy-50,{size:26,color:TC,weight:700});return fade(g,r);};
  let s=row(170,.04,'25 Hz','0.01 s ＝ 4分の1周期',seg(p,.02,.12))+row(288,.02,'50 Hz','0.01 s ＝ 半周期',seg(p,.1,.2));
  s+=wrongCard('A','π','周期を 0.02 s（50 Hz）とした',{g:seg(p,.25,.32),y:355});
  return s+goalTag(G2)+ANS2(1);
 },
 // 11. 誤答 B → D（1枚ずつ）
 [K+'wrongBD']:(p,ctx)=>{
  let s=fade(.55,acPair({x:150,w:760,yI:130,yV:240,amp:38,gap:1}));
  s+=wrongSeq(p,ctx,[['B','π/2、電流が進む','山が 先の 方が 進んでいる'],['D','0.25','1/4 に 2π を 掛けていない']]);
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 12. ひもの写真と赤い印。求めるもの：波の速さ v
 [K+'goal3']:(p)=>{
  const R=rope(0,{});
  let s=R.svg+dot(R.RX(3),R.Y(3),12,MARK);
  s+=fade(seg(p,.1,.2),rect(940,110,220,50,{fill:LC,fo:.12,stroke:LC,sw:2.5,rx:12})+label('波長 2.5 m',958,145,{size:30,color:LC,weight:700}));
  s+=hzTag(940,180,'4 Hz',seg(p,.15,.25));
  s+=fade(seg(p,.3,.4),label('ある瞬間の 写真',490,150,{size:26,color:C.dim,anchor:'middle'}));
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 13. 山に旗、λ＝波長 2.5 m（水色）、時計に T＝1周期。旗が1波長進むのと時計1周を合わせる。そのあと v＝λ/T
 [K+'flag']:(p)=>{
  const u=seg(p,.3,.72),ph=u;
  const R=rope(ph,{});
  const c0=LAM*.75;                                  // t＝0 で山の場所 x＝1.875 m
  let s=R.svg+fade(.6,dot(R.RX(3),R.Y(3),10,MARK));
  s+=fade(seg(p,.02,.12),flag(R.RX(c0+LAM*ph),R.Y(c0+LAM*ph)));
  s+=fade(seg(p,.08,.2)*(1-seg(p,.28,.32)),brace(R.RX(c0),R.RX(c0+LAM),R.Y(c0)-78,{dir:-1,color:LC,text:'λ ＝ 波長 2.5 m',size:26}));
  s+=fade(seg(p,.72,.8),arrow(R.RX(c0),150,R.RX(c0+LAM),150,{color:FLAG,w:4,head:14})+label('1波長',R.RX(c0+LAM/2),135,{size:26,color:FLAG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.72,.8)*.6,flag(R.RX(c0),R.Y(c0,0)));
  s+=clock(1050,200,70,u,{g:seg(p,.12,.24),txt:'T ＝ 1周期'});
  s+=card(930,350,240,110,T(`${tv}=\\dfrac{${tl}}{${tT}}`,1050,405,44),seg(p,.82,.9),C.hi);
  return s+goalTag(G3);
 },
 // 14. T＝1/4＝0.25 s、v＝2.5÷0.25＝10 m/s。小問3 の答え C
 [K+'ans3']:(p)=>{
  let s=card(200,110,800,330,'',seg(p,0,.08));
  s+=fade(seg(p,.05,.15),T(`${tT}=\\dfrac{1}{4}=${cs(TC,'0.25\\ \\mathrm{s}')}`,600,200,48));
  s+=fade(seg(p,.4,.5),T(`${tv}=\\dfrac{2.5}{0.25}=${cs(C.v,'10\\ \\mathrm{m/s}')}`,600,350,48));
  return s+goalTag(G3)+ANS3(seg(p,.72,.8));
 },
 // 15. 1秒に4波長：旗が 1 秒で 10 m 進む（ゆっくり再生）。v＝fλ＝4×2.5＝10 m/s
 [K+'fl']:(p)=>{
  const ph=4*seg(p,.08,.7),tt=ph/4;
  const R=rope(ph,{x0:110,pxm:95,xmax:10.5,cy:210,amp:40,ticks:[0,2.5,5,7.5,10],shift:Math.PI/2});
  let s=R.svg+flag(R.RX(LAM*ph),R.Y(LAM*ph));
  for(let k=0;k<4;k++)s+=fade(seg(p,.08+.155*k,.12+.155*k),brace(R.RX(LAM*k),R.RX(LAM*(k+1)),340,{dir:1,color:LC,text:`λ ${k+1}`,size:24}));
  s+=card(60,420,230,56,label(`t ＝ ${tt.toFixed(2)} s`,175,458,{size:28,color:TC,anchor:'middle',weight:700}),1,TC);
  s+=note('ゆっくり 再生',175,505);
  s+=card(360,415,640,90,T(`${tv}=${tf}${tl}=4\\times2.5=${cs(C.v,'10\\ \\mathrm{m/s}')}`,680,460,40),seg(p,.74,.84),C.hi);
  return s+goalTag(G3)+ANS3(1);
 },
 // 16. 誤答 A → B（1枚ずつ）
 [K+'wrong3']:(p,ctx)=>{
  let s=card(330,110,540,100,T(`${tv}=${tf}${tl}=4\\times2.5=10\\ \\mathrm{m/s}`,600,160,38),.6);
  s+=fade(seg(p,.05,.15),label('単位：m ÷ s ＝ m/s',600,270,{size:28,color:C.dim,anchor:'middle'}));
  s+=wrongSeq(p,ctx,[['A','0.625 m/s','2.5÷4（単位 m·s）'],['B','1.6 m/s','4÷2.5（単位 1/(m·s)）']]);
  return s+goalTag(G3)+ANS3(1);
 },
 // 17. 赤い印は上下に往復するだけ、旗は右へ進む。誤答 D
 [K+'wrongD3']:(p,ctx)=>{
  const t=cueT(ctx),ph=.15*t;                       // ゆっくり再生
  const R=rope(ph,{x0:110,pxm:115,xmax:7,cy:200,amp:50,axis:0});
  const c0=LAM*.75,cx=Math.min(6.8,c0+LAM*ph);
  let s=R.svg+dot(R.RX(3),R.Y(3),12,MARK)+line(R.RX(3),150-20,R.RX(3),250+20,{color:MARK,w:2,dash:'5 6'});
  s+=flag(R.RX(cx),R.Y(cx));
  s+=label('印：上下だけ',R.RX(3),305,{size:26,color:MARK,anchor:'middle',weight:700});
  s+=label('旗（山）：右へ 進む',960,110,{size:26,color:FLAG,anchor:'middle',weight:700});
  s+=wrongCard('D','0 m/s','点は 運ばれないが、形は 進む',{g:seg(p,.05,.12)});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 18. 4つの量のカード。右上に答えの札3枚
 [K+'sum']:(p)=>{
  const items=[['周期 T','1往復の 時間','時間の 目盛り','0.04 s',TC],['振動数 f','1秒の 往復の 回数','時間の 目盛り','25 Hz',FC],['位相差','山の ずれ（角度）','角度の ずれ','π/2',PH],['波の速さ v','山が 進む 速さ','形の 進み方','10 m/s',C.v]];
  const bw=262,gap=20,x0=600-(4*bw+3*gap)/2;
  let s='';
  items.forEach(([a,b,c,d,col],i)=>{const x=x0+i*(bw+gap),g=seg(p,.03+.15*i,.13+.15*i);
   s+=card(x,110,bw,300,L(a,x+bw/2,165,{size:30,color:col,weight:700})+L(b,x+bw/2,230,{size:24,color:C.dim})
    +line(x+20,265,x+bw-20,265,{color:C.faint,w:2})+L(c,x+bw/2,315,{size:28,color:C.hi,weight:700})+L(d,x+bw/2,375,{size:28,color:col,weight:700}),g,col);});
  return s+answerRow([[1,'B','0.04 s'],[2,'C','π/2'],[3,'C','10 m/s']],{g:seg(p,.75,.85)});
 },
};
