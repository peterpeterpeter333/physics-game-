// YouTube シリーズ「電流・中級 2/2」(ys-um-conduction-2) — 図。Stage 1200×515.
// 回路：電池は左の辺に縦に置き、長い線（＋極）が上。電流は＋極 → 上の導線 → 右 → 下の導線 → −極（時計回り）。電子は逆（反時計回り）。
// 合図（黄）は電池から導線に沿って両側へ進み、届いた場所の電子がその場で動き出す。
// 分岐点：左から入り、右上・右下へ分かれる。一周：上の辺に 2 Ω、右の辺に 4 Ω。電位を高さにした階段のグラフ（紫）。
// 部品は 1/2 の図（yt1-um-conduction-1-diagrams.mjs）から import する。ここで export するのは図の登録だけ。
// 色：電流 I 緑、電荷 Q 桃、電子 青、正電荷・＋極 赤、電場 𝐄 水色、電位・電圧 V 紫、エネルギー 橙、合図 黄、磁場 橙。
import {C,clamp,mix,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,axes} from './anim.mjs';
import {NEG,POS,EC,QC,IC,VEL,cs,T,card,L,U,It,ENSV,vE,tube,electronsIn,bulb,battery,xout,BG} from './yt1-um-conduction-1-diagrams.mjs';

const K='um-conduction-2:';
const VC=C.v,EN=C.E,SIG=C.hi,BC=C.E;
const Vt=cs(VC,'V');

// ---- polyline helpers ----------------------------------------------------------------------------------
function plen(pts){let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;}
function at(pts,f){
 let w=plen(pts)*clamp(f);
 for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(w<=d||i===pts.length-1){const u=d>0?clamp(w/d):0;return [mix(pts[i-1][0],pts[i][0],u),mix(pts[i-1][1],pts[i][1],u)];}w-=d;}
 return pts[pts.length-1];
}

// ---- S2: battery–switch–bulb loop with electrons and the travelling signal --------------------------------
const A={x1:110,x2:690,yt:110,yb:420,by:265,sy:210};
const TOP=[[A.x1,A.by-8],[A.x1,A.yt],[A.x2,A.yt],[A.x2,A.by-32]];      // from the + terminal to the bulb
const BOT=[[A.x1,A.by+10],[A.x1,A.yb],[A.x2,A.yb],[A.x2,A.by+32]];     // from the − terminal to the bulb
// electrons sit along both paths; they start drifting (a little) once the signal has passed them.
// On TOP the electrons drift back toward the battery (+ terminal), on BOT away from it (current is clockwise, electrons counter-clockwise).
function wireElectrons(front,{drift=0,hi=0}={}){
 let s='';
 for(const [pts,dir] of [[TOP,-1],[BOT,1]]){
  const Lp=plen(pts),n=Math.floor(Lp/30);
  for(let k=1;k<n;k++){
   const f0=k/n,passed=front>f0;
   const sh=passed?drift*(front-f0)/(1-f0+1e-6)*dir*14/Lp:0;
   const [x,y]=at(pts,clamp(f0+sh));
   s+=dot(x,y,6.5,NEG)+(passed&&hi?ring(x,y,11,{color:SIG,w:2}):'');
  }
 }
 return s;
}
function loopA({sw=0,front=0,drift=0,hi=0,lit=null,sig=1}={}){
 let s=draw(TOP,1,{color:C.dim,w:4})+draw(BOT,1,{color:C.dim,w:4});
 s+=battery(A.x1,A.by,{label:'電池'});
 // switch on the left wire just above the battery: open (tilted) → closed
 const sx=A.x1,sy=A.sy;
 s+=rect(sx-8,sy-58,16,66,{fill:C.bg,fo:1,stroke:C.bg,sw:0,rx:0})+dot(sx,sy,6,C.ink)+dot(sx,sy-50,6,C.ink)
  +line(sx,sy,sx-50*Math.sin(.6*(1-sw)),sy-50*Math.cos(.6*(1-sw)),{color:C.ink,w:4})+label('スイッチ',sx-22,sy-18,{size:22,color:C.dim,anchor:'end'});
 // signal: yellow line drawn behind the front, glowing head
 if(sig&&front>0){
  s+=draw(TOP,front,{color:SIG,w:6,opacity:.55})+draw(BOT,front,{color:SIG,w:6,opacity:.55});
  if(front<1){const [x1,y1]=at(TOP,front),[x2,y2]=at(BOT,front);s+=dot(x1,y1,13,SIG,.9)+dot(x2,y2,13,SIG,.9);}
 }
 s+=wireElectrons(front,{drift,hi});
 // bulb (with electrons inside the filament)
 s+=rect(A.x2-36,A.by-36,72,72,{fill:C.bg,fo:1,stroke:C.bg,sw:0,rx:30})+bulb(A.x2,A.by,lit??(front>=1?1:0));
 s+=dot(A.x2-10,A.by+14,4,NEG)+dot(A.x2+8,A.by+16,4,NEG);
 s+=label('電球',A.x2+44,A.by+8,{size:24,color:C.dim});
 return s;
}
const RX=790,RW=380,RCX=RX+RW/2;
const rcard=(y,h,inner,g=1,stroke=C.faint)=>card(RX,y,RW,h,inner,g,stroke);

// ---- S3: junction -------------------------------------------------------------------------------------------
const J={x:470,y:260};
function junction({g=1,inA='',upA='',dnA='',dnDim=0,box=0,in2=null}={}){
 let s=line(90,J.y,J.x,J.y,{color:C.dim,w:5})+line(J.x,J.y,760,110,{color:C.dim,w:5})+line(J.x,J.y,760,410,{color:C.dim,w:5});
 if(in2)s+=line(J.x,J.y,180,440,{color:C.dim,w:5});
 s+=dot(J.x,J.y,10,C.hi);
 const aIn=arrow(150,J.y-24,330,J.y-24,{color:IC,w:6,head:16}),
  aUp=arrow(560,J.y-78,690,J.y-146,{color:IC,w:6,head:16}),
  aDn=arrow(560,J.y+78,690,J.y+146,{color:IC,w:6,head:16,opacity:dnDim?.3:1});
 s+=aIn+aUp+aDn;
 if(inA)s+=label(inA,240,J.y-48,{size:32,color:IC,weight:700,anchor:'middle'});
 if(upA)s+=label(upA,700,J.y-170,{size:32,color:IC,weight:700});
 if(dnA)s+=label(dnA,700,J.y+200,{size:32,color:IC,weight:700,opacity:dnDim?.5:1});
 if(in2){s+=arrow(250,423,380,342,{color:IC,w:6,head:16})+label(in2,235,380,{size:32,color:IC,weight:700,anchor:'end'});}
 if(box>0)s+=fade(box,ring(J.x,J.y,62,{color:C.hi,w:3,dash:'9 7'}));
 return fade(g,s);
}

// ---- S4: series loop with 2 Ω and 4 Ω; potential staircase ---------------------------------------------
const B={x1:110,x2:560,yt:110,yb:420,by:265,r1a:250,r1b:400,r2a:190,r2b:340};
function zigH(x1,x2,y,color=C.ink){const pts=[[x1,y]];const n=6;for(let i=1;i<n*2;i++)pts.push([x1+(x2-x1)*i/(n*2),y+(i%2?-16:16)]);pts.push([x2,y]);return draw(pts,1,{color,w:4});}
function zigV(y1,y2,x,color=C.ink){const pts=[[x,y1]];const n=6;for(let i=1;i<n*2;i++)pts.push([x+(i%2?-16:16),y1+(y2-y1)*i/(n*2)]);pts.push([x,y2]);return draw(pts,1,{color,w:4});}
// the loop, traced in the current's direction from the bottom-left corner, in 7 pieces that match the graph
const PIECES=[
 [[B.x1,B.yb],[B.x1,B.by+36]],                       // u 0–0.5   wire
 [[B.x1,B.by+36],[B.x1,B.by-36]],                     // u 0.5–1.5 battery (− → +)
 [[B.x1,B.by-36],[B.x1,B.yt],[B.r1a,B.yt]],           // u 1.5–2.5 wire
 [[B.r1a,B.yt],[B.r1b,B.yt]],                         // u 2.5–3.5 2 Ω
 [[B.r1b,B.yt],[B.x2,B.yt],[B.x2,B.r2a]],             // u 3.5–4.5 wire
 [[B.x2,B.r2a],[B.x2,B.r2b]],                         // u 4.5–5.5 4 Ω
 [[B.x2,B.r2b],[B.x2,B.yb],[B.x1,B.yb]],              // u 5.5–6   wire
];
const UB=[0,.5,1.5,2.5,3.5,4.5,5.5,6];
function tracer(u){for(let i=0;i<7;i++)if(u<=UB[i+1]||i===6)return at(PIECES[i],(u-UB[i])/(UB[i+1]-UB[i]));}
const Vof=u=>u<.5?0:u<1.5?6*(u-.5):u<2.5?6:u<3.5?6-2*(u-2.5):u<4.5?4:u<5.5?4-4*(u-4.5):0;
function loopB({g=1,cur=1,hl=null,vals=1}={}){
 let s=line(B.x1,B.yt,B.r1a,B.yt,{color:C.dim,w:4})+line(B.r1b,B.yt,B.x2,B.yt,{color:C.dim,w:4})
  +line(B.x2,B.yt,B.x2,B.r2a,{color:C.dim,w:4})+line(B.x2,B.r2b,B.x2,B.yb,{color:C.dim,w:4})
  +line(B.x2,B.yb,B.x1,B.yb,{color:C.dim,w:4})+line(B.x1,B.yb,B.x1,B.by+10,{color:C.dim,w:4})+line(B.x1,B.by-8,B.x1,B.yt,{color:C.dim,w:4});
 s+=zigH(B.r1a,B.r1b,B.yt,hl==='r1'?C.hi:C.ink)+zigV(B.r2a,B.r2b,B.x2,hl==='r2'?C.hi:C.ink);
 s+=battery(B.x1,B.by,{label:''});
 if(hl==='bat')s+=rect(B.x1-44,B.by-40,88,80,{fill:C.hi,fo:.08,stroke:C.hi,sw:2.5,rx:10});
 if(vals){s+=label('6 V',B.x1-50,B.by+8,{size:28,color:VC,weight:700,anchor:'end'})
  +label('2 Ω',(B.r1a+B.r1b)/2,B.yt-32,{size:28,color:C.ink,weight:700,anchor:'middle'})
  +label('4 Ω',B.x2+30,(B.r2a+B.r2b)/2+10,{size:28,color:C.ink,weight:700});}
 if(cur>0)s+=fade(cur,arrow(430,B.yt+26,530,B.yt+26,{color:IC,w:5,head:14})+arrow(B.x2-26,370,B.x2-26,410,{color:IC,w:5,head:12})
  +arrow(480,B.yb-24,180,B.yb-24,{color:IC,w:5,head:14})+label('I',330,B.yb-40,{size:30,color:IC,weight:700,anchor:'middle'}));
 return fade(g,s);
}
const GA={x:690,y:445,w:440,h:250,xmax:6.3,ymax:7.3,xmin:0,ymin:0};
function graph({g=1,upto=0,labels=0,known=0,endMark=0}={}){
 const Ax=axes({...GA,yticks:[2,4,6],grid:true,g,ylabel:'電位 V [V]',ycolor:VC});
 let s=Ax.svg;
 if(upto>0)s+=Ax.plot(Vof,{from:0,to:Math.min(6,upto),color:VC,w:5,steps:240});
 const lab=(u,t,y,col=C.dim)=>label(t,Ax.X(u),GA.y+34,{size:22,color:col,anchor:'middle'});
 s+=fade(g,lab(1,'電池')+lab(3,'2 Ω')+lab(5,'4 Ω'));
 if(labels){
  if(upto>=1.5)s+=label('+6 V',Ax.X(1.25)+10,Ax.Y(2.2),{size:26,color:VC,weight:700});
  if(upto>=3.5)s+=label(known?'−2 V':'−2I',Ax.X(3)+14,Ax.Y(5.7),{size:26,color:C.hi,weight:700});
  if(upto>=5.5)s+=label(known?'−4 V':'−4I',Ax.X(5)+14,Ax.Y(2.7),{size:26,color:C.hi,weight:700});
 }
 if(endMark)s+=fade(endMark,ring(Ax.X(0),Ax.Y(0),11,{color:C.hi,w:3})+ring(Ax.X(6),Ax.Y(0),11,{color:C.hi,w:3})+label('出発点と同じ高さ',Ax.X(3),GA.y-14,{size:22,color:C.hi,anchor:'middle'}));
 return {s,Ax};
}

export const ytUmConduction2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=tube()+electronsIn({shift:40*p});
  s+=card(760,90,400,320,L('前回の結果',960,140,{size:24,color:C.dim})+T(`${It}=${ENSV}`,960,245,{size:58})
   +L('円柱の中の 電子を 数えた',960,340,{size:24,color:C.dim}),seg(p,0,.2),C.hi);
  return s;
 },
 [K+'slow']:(p)=>{
  let s=tube()+electronsIn({shift:40+6*p});
  s+=card(760,90,400,320,L('銅線・1 A・1 mm²',960,140,{size:24,color:C.dim})
   +L('1秒に 約 0.07 mm',960,225,{size:30,color:VEL,weight:700})
   +fade(seg(p,.4,.6),L('1 m 進むのに',960,300,{size:26})+L('約 4 時間',960,350,{size:32,color:C.t,weight:700})),1,VEL);
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=loopA({sw:1,front:1,lit:1,sig:0});
  s+=rcard(90,320,L('最後の問い',RCX,138,{size:24,color:C.dim})
   +L('電子は 遅いのに',RCX,200,{size:28,color:NEG,weight:700})+L('なぜ すぐ 点く？',RCX,245,{size:28,color:C.hi,weight:700})
   +fade(seg(p,.45,.65),L('分かれ道の 電流は？',RCX,330,{size:28,color:IC,weight:700})),seg(p,0,.2),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(80,90,500,320,L('問い 1',330,140,{size:24,color:C.dim})+L('遅い電子 と',330,215,{size:30,color:NEG,weight:700})+L('すぐ点く電球',330,265,{size:30,color:C.hi,weight:700})+L('どう つながる？',330,340,{size:28}),seg(p,0,.2),C.hi);
  s+=card(620,90,500,320,L('問い 2',870,140,{size:24,color:C.dim})+L('分かれ道の 電流の',870,230,{size:30,color:IC,weight:700})+L('決まりは？',870,290,{size:30,color:IC,weight:700}),seg(p,.4,.6),IC);
  return s;
 },
 // ===== S2 なぜすぐ点く？ =====
 [K+'full']:(p)=>{
  let s=loopA({sw:0,front:0});
  s+=rcard(90,320,L('スイッチを 入れる前',RCX,140,{size:24,color:C.dim})
   +fade(seg(p,.1,.3),dot(RX+50,212,8,NEG)+label('導線の中は 電子で',RX+72,221,{size:26,color:NEG,weight:700})+L('ぎっしり',RCX,265,{size:28,color:NEG,weight:700}))
   +fade(seg(p,.55,.75),L('電球の中にも いる',RCX,345,{size:26})),seg(p,0,.15));
  return s;
 },
 [K+'switch']:(p)=>{
  const front=lin(p,.2,.85);
  let s=loopA({sw:seg(p,.05,.15),front});
  s+=rcard(90,320,L('スイッチを 入れる',RCX,140,{size:24,color:C.dim})
   +fade(seg(p,.2,.4),L('電場の変化が 導線に沿って',RCX,210,{size:24})+L('伝わる',RCX,250,{size:26,color:SIG,weight:700}))
   +fade(seg(p,.55,.75),L('＝「動け」の 合図',RCX,330,{size:30,color:SIG,weight:700})),seg(p,0,.15),SIG);
  return s;
 },
 [K+'fast']:(p)=>{
  let s=loopA({sw:1,front:1});
  s+=rcard(90,320,L('合図の 速さ',RCX,140,{size:26,color:SIG,weight:700})
   +L('回路の作り・周りの物質で',RCX,210,{size:24})+L('変わる',RCX,248,{size:24})
   +fade(seg(p,.4,.6),L('光の速さと 同じくらいの 桁',RCX,330,{size:26,color:C.hi,weight:700})),1,SIG);
  return s;
 },
 [K+'ns']:(p)=>{
  let s=card(80,70,1040,380,'',1);
  s+=label('光',160,160,{size:30,color:SIG,weight:700})+label('1秒に 約 30万 km',260,160,{size:30,color:C.ink});
  s+=fade(seg(p,.25,.45),label('合図',160,260,{size:30,color:SIG,weight:700})+label('1 m を 10億分の 数秒',260,260,{size:30,color:C.ink}));
  s+=fade(seg(p,.6,.8),label('電子',160,370,{size:30,color:NEG,weight:700})+label('1 m を 約 4 時間',260,370,{size:30,color:NEG}));
  return s;
 },
 [K+'local']:(p)=>{
  const front=lin(p,.05,.9);
  let s=loopA({sw:1,front,drift:1,hi:1});
  s+=rcard(90,320,L('合図が 届いた場所',RCX,140,{size:24,color:SIG,weight:700})
   +dot(RX+60,212,6.5,NEG)+ring(RX+60,212,11,{color:SIG,w:2})+label('そこの電子が',RX+84,221,{size:26,color:NEG,weight:700})
   +L('その場で 動き出す',RCX,270,{size:28,color:C.ink,weight:700})
   +fade(seg(p,.55,.75),L('電球の中の 電子も すぐ',RCX,345,{size:26,color:C.hi})),1,SIG);
  return s;
 },
 [K+'notravel']:(p)=>{
  let s=loopA({sw:1,front:1,drift:1});
  // one electron at the battery's − terminal: after 4 hours it would move only about 1 m of wire
  const [x,y]=at(BOT,1/Math.floor(plen(BOT)/30));
  s+=ring(x,y,15,{color:C.a,w:3})+fade(seg(p,.1,.3),label('この電子が 電球まで？',x+26,y+48,{size:24,color:C.a,weight:700}));
  s+=rcard(90,320,L('旅 は 不要',RCX,140,{size:26,color:C.hi,weight:700})
   +L('約 4 時間 ＝',RCX,215,{size:26,color:NEG})+L('電子1個の 旅の 時間',RCX,255,{size:26,color:NEG})
   +fade(seg(p,.5,.7),L('合図の 時間 とは 別',RCX,335,{size:28,color:SIG,weight:700})),seg(p,.15,.35),C.hi);
  return s;
 },
 [K+'twospeed']:(p)=>{
  let s=card(90,90,480,320,L('速い',330,150,{size:30,color:SIG,weight:700})+L('合図',330,245,{size:44,color:SIG,weight:700})+L('10億分の 数秒 / m',330,335,{size:24,color:C.dim}),1,SIG);
  s+=card(630,90,480,320,L('遅い',870,150,{size:30,color:NEG,weight:700})+L('電子',870,245,{size:44,color:NEG,weight:700})+L('約 4 時間 / m',870,335,{size:24,color:C.dim}),seg(p,.2,.4),NEG);
  return s;
 },
 [K+'caveat']:(p)=>{
  let s=loopA({sw:1,front:1,drift:1});
  s+=rcard(90,320,L('ただし',RCX,140,{size:24,color:C.dim})
   +L('合図も 一瞬 ではない',RCX,215,{size:28,color:SIG,weight:700})
   +fade(seg(p,.45,.65),L('短い回路では',RCX,290,{size:26})+L('遅れが 目立たない',RCX,335,{size:26,color:C.hi,weight:700})),1,SIG);
  return s;
 },
 // ===== S3 分かれ道の電流 =====
 [K+'junction']:(p)=>{
  let s=junction({g:seg(p,0,.3)});
  s+=fade(seg(p,.4,.6),L('分岐点',J.x,J.y+60,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=junction({inA:'3 A',upA:'1 A',dnA:seg(p,.4,.5)>.5?'? A':''});
  s+=card(840,150,320,190,L('入る 3 A',1000,210,{size:28,color:IC,weight:700})+L('出る 1 A と ？',1000,275,{size:28,color:IC,weight:700}),seg(p,.1,.3));
  return s;
 },
 [K+'ans']:(p)=>{
  let s=junction({inA:'3 A',upA:'1 A',dnA:'2 A'});
  s+=card(840,150,320,190,L('入る ＝ 出る',1000,210,{size:28,color:C.ink,weight:700})+T(`3=1+2`,1000,285,{size:48,color:IC}),seg(p,.1,.3),IC);
  return s;
 },
 [K+'why']:(p)=>{
  let s=junction({inA:'3 A',upA:'1 A',dnA:'2 A',box:seg(p,.2,.45)});
  s+=fade(seg(p,.35,.55),label('小さく 囲む',J.x-30,J.y+100,{size:26,color:C.hi,weight:700,anchor:'end'}));
  s+=card(840,150,320,190,L('中の電荷は',1000,210,{size:26})+L('1秒に どれだけ 増える？',1000,265,{size:26,color:QC,weight:700}),seg(p,.5,.7),QC);
  return s;
 },
 [K+'balance']:(p)=>{
  let s=card(110,60,980,390,'',1,QC);
  s+=label('入る電流',210,190,{size:34,color:IC,weight:700})+label('−',395,190,{size:36,color:C.ink,anchor:'middle'})+label('出る電流',430,190,{size:34,color:IC,weight:700})
   +label('＝',650,190,{size:36,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.15,.35),T(`\\dfrac{d${cs(QC,'Q')}}{dt}`,760,180,{size:58})+label('中に たまる 電荷の 増え方',760,265,{size:24,color:QC,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),L('電荷は 湧かない・消えない（電荷の保存）',600,380,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'pile']:(p)=>{
  let s=junction({inA:'3 A',upA:'1 A',dnA:'0 A',dnDim:1,box:1});
  const n=Math.floor(1+9*lin(p,.1,.9));let q='';
  for(let i=0;i<n;i++){const a=i*2.4,r=12+4*i;q+=dot(J.x+Math.min(r,44)*Math.cos(a),J.y+Math.min(r,44)*Math.sin(a),6,QC);}
  s+=q;
  s+=card(840,130,320,230,L('もし 出るのが 1 A だけ',1000,185,{size:24})+T(`3-1=2`,1000,255,{size:44,color:IC})
   +L('毎秒 2 C たまる',1000,320,{size:28,color:QC,weight:700}),seg(p,.05,.25),QC);
  return s;
 },
 [K+'steady']:(p)=>{
  let s=card(110,60,980,390,'',1,C.hi);
  s+=L('定常状態',600,120,{size:30,color:C.hi,weight:700})+L('電流が一定 → どこの電荷も 時間で 変わらない',600,190,{size:28});
  s+=fade(seg(p,.4,.6),T(`\\dfrac{d${cs(QC,'Q')}}{dt}=0`,600,320,{size:64}));
  return s;
 },
 [K+'law1']:(p)=>{
  let s=card(110,50,980,410,'',1,IC);
  s+=L('入る電流の和 ＝ 出る電流の和',600,150,{size:40,color:IC,weight:700});
  s+=fade(seg(p,.3,.5),L('キルヒホッフの 第1法則',600,250,{size:32,color:C.ink,weight:700}));
  s+=fade(seg(p,.55,.75),L('正体 ＝ 電荷の 保存',600,350,{size:36,color:C.hi,weight:700}));
  return s;
 },
 [K+'notgauss']:(p)=>{
  // left: bookkeeping at a junction; right: closed surface and flux (Gauss)
  let s=card(60,70,480,380,L('分岐点',300,120,{size:28,color:IC,weight:700}),1,IC);
  s+=line(110,260,300,260,{color:C.dim,w:4})+line(300,260,450,180,{color:C.dim,w:4})+line(300,260,450,340,{color:C.dim,w:4})+ring(300,260,40,{color:C.hi,w:2.5,dash:'7 6'})
   +arrow(130,240,230,240,{color:IC,w:4,head:12})+arrow(360,206,420,174,{color:IC,w:4,head:12})+arrow(360,314,420,346,{color:IC,w:4,head:12});
  s+=L('1秒あたりの 出入りの 収支',300,410,{size:26,color:C.ink});
  let g='';for(let k=0;k<8;k++){const a=k*Math.PI/4;g+=arrow(900+34*Math.cos(a),260+34*Math.sin(a),900+105*Math.cos(a),260+105*Math.sin(a),{color:EC,w:3,head:11});}
  s+=card(660,70,480,380,L('ガウスの法則',900,120,{size:28,color:EC,weight:700})+fade(1,g)+ring(900,260,72,{color:C.dim,w:2.5,dash:'7 6'})+dot(900,260,14,POS)+label('+',900,268,{size:22,color:C.bg,anchor:'middle',weight:700})
   +L('閉じた面の中の 電荷 → 電気束',900,410,{size:26,color:C.ink}),seg(p,.3,.5),EC);
  s+=fade(seg(p,.6,.8),L('別の話',600,265,{size:30,color:C.a,weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=junction({inA:'2 A',in2:'4 A',upA:'1 A',dnA:'? A'});
  s+=card(840,150,320,190,L('確認',1000,205,{size:28,color:C.hi,weight:700})+L('もう1本は 何 A？',1000,275,{size:28,color:IC,weight:700}),seg(p,0,.2),C.hi);
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=junction({inA:'2 A',in2:'4 A',upA:'1 A',dnA:seg(p,.5,.6)>.5?'5 A':'? A'});
  s+=card(840,110,320,270,L('入る和',1000,160,{size:24,color:C.dim})+T(`2+4=6`,1000,215,{size:40,color:IC})
   +fade(seg(p,.4,.6),L('残り',1000,275,{size:24,color:C.dim})+T(`6-1=5`,1000,330,{size:40,color:IC})),1,IC);
  return s;
 },
 // ===== S4 一周の電圧 =====
 [K+'loop']:(p)=>{
  let s=loopB({g:seg(p,0,.25),cur:0});
  s+=card(700,110,440,260,L('直列の回路',920,165,{size:26,color:C.dim})+L('電池 6 V',920,230,{size:30,color:VC,weight:700})+L('抵抗 2 Ω と 4 Ω',920,295,{size:30,color:C.ink,weight:700}),seg(p,.3,.5));
  return s;
 },
 [K+'same']:(p)=>{
  let s=loopB({cur:seg(p,.1,.3)});
  s+=card(700,110,440,260,L('分かれ道 なし',920,170,{size:26,color:C.dim})+L('どこでも 同じ電流 I',920,235,{size:30,color:IC,weight:700})
   +fade(seg(p,.5,.7),L('I を 一周の見方で 求める',920,310,{size:26,color:C.hi,weight:700})),seg(p,.2,.4),IC);
  return s;
 },
 [K+'height']:(p)=>{
  const u=6*lin(p,.25,.95);
  let s=loopB();const {s:gs}=graph({g:seg(p,0,.2),upto:u});s+=gs;
  const [x,y]=tracer(u);s+=fade(seg(p,.2,.3),dot(x,y,11,C.hi));
  s+=fade(seg(p,.15,.3),label('出発点',B.x1+14,B.yb+36,{size:22,color:C.hi}));
  return s;
 },
 [K+'up']:(p)=>{
  const u=mix(.5,1.5,lin(p,.15,.7));
  let s=loopB({hl:'bat'});const {s:gs}=graph({upto:u,labels:1});s+=gs;
  const [x,y]=tracer(u);s+=dot(x,y,11,C.hi);
  s+=fade(seg(p,.2,.4),label('− → ＋',B.x1+30,B.by+85,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'down']:(p)=>{
  const u=mix(1.5,5.5,lin(p,.1,.9));
  let s=loopB({hl:u<3.6?'r1':'r2'});const {s:gs}=graph({upto:u,labels:1});s+=gs;
  const [x,y]=tracer(u);s+=dot(x,y,11,C.hi);
  s+=card(170,190,330,130,L('抵抗で 下がる',335,235,{size:24,color:C.dim})+T(`${Vt}=R${It}`,335,290,{size:40}),seg(p,0,.15));
  return s;
 },
 [K+'back']:(p)=>{
  const u=mix(5.5,6,lin(p,.05,.3));
  let s=loopB();const {s:gs}=graph({upto:u,labels:1,endMark:seg(p,.3,.45)});s+=gs;
  const [x,y]=tracer(u);s+=dot(x,y,11,C.hi);
  s+=card(170,170,330,150,L('上り下りの和',335,215,{size:24,color:C.dim})+T(`6-2${It}-4${It}=0`,335,280,{size:40}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'solve']:(p)=>{
  let s=loopB();const {s:gs}=graph({upto:6,labels:1,known:seg(p,.5,.6)>.5?1:0});s+=gs;
  s+=card(170,150,330,200,T(`6=6${It}`,335,215,{size:40})+fade(seg(p,.2,.4),T(`${It}=1\\,\\mathrm{A}`,335,295,{size:44,color:IC})),1,IC);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=loopB();const {s:gs}=graph({upto:6,labels:1,known:1});s+=gs;
  s+=card(170,150,330,200,L('下がる分の 合計',335,200,{size:24,color:C.dim})+T(`2+4=6\\,\\mathrm{V}`,335,275,{size:42,color:VC})+L('＝ 上がった分',335,330,{size:24,color:C.hi,weight:700}),seg(p,0,.2),VC);
  return s;
 },
 [K+'why2']:(p)=>{
  let s=loopB({cur:.4});const {s:gs}=graph({upto:6,labels:1,known:1,endMark:1});s+=gs;
  s+=card(150,140,370,220,L('電位の回（中級）',335,185,{size:22,color:C.dim})+T(`\\oint ${vE}\\cdot d\\mathbf{r}=0`,335,255,{size:40})
   +fade(seg(p,.45,.65),L('電位は 場所ごとに',335,310,{size:24,color:VC,weight:700})+L('一つの値',335,342,{size:24,color:VC,weight:700})),seg(p,0,.2),VC);
  return s;
 },
 [K+'energy']:(p)=>{
  let s=card(90,60,1020,390,L('1 C の 電荷の エネルギーの 収支',600,110,{size:28,color:EN,weight:700}),1,EN);
  const row=(y,a,b,col,g)=>fade(g,label(a,470,y,{size:30,color:C.ink,anchor:'end'})+label(b,520,y,{size:34,color:col,weight:700}));
  s+=row(190,'電池で 受け取る','＋6 J',EN,seg(p,.05,.2));
  s+=row(265,'2 Ω で 熱として 渡す','−2 J',EN,seg(p,.3,.45));
  s+=row(340,'4 Ω で 熱として 渡す','−4 J',EN,seg(p,.4,.55));
  s+=fade(seg(p,.65,.8),line(420,370,700,370,{color:C.dim,w:2})+label('合計 0 J',520,415,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'law2']:(p)=>{
  let s=card(110,50,980,410,'',1,VC);
  s+=L('一周の 電圧の 上り下りの和 ＝ 0',600,160,{size:38,color:VC,weight:700});
  s+=fade(seg(p,0,.25),L('キルヒホッフの 第2法則',600,260,{size:32,color:C.ink,weight:700}));
  s+=fade(seg(p,.4,.6),T(`6-2-4=0`,600,360,{size:44,color:VC}));
  return s;
 },
 [K+'caveat2']:(p)=>{
  // a loop with a changing magnetic field inside (⊙ marks growing)
  let s=draw([[140,110],[520,110],[520,430],[140,430],[140,110]],1,{color:C.dim,w:4});
  const k=.6+.4*Math.sin(6*p);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){const x=210+i*120,y=175+j*95;s+=ring(x,y,14*k+6,{color:BC,w:2.5})+dot(x,y,4,BC);}
  s+=label('磁場が 時間で 変わる',330,472,{size:24,color:BC,anchor:'middle',weight:700});
  s+=card(620,90,520,330,L('このときは',880,140,{size:24,color:C.dim})+T(`\\oint ${vE}\\cdot d\\mathbf{r}\\neq0`,880,215,{size:44})
   +fade(seg(p,.4,.6),L('誘導起電力も 加える',880,300,{size:30,color:C.hi,weight:700})+L('（電磁誘導の回）',880,350,{size:24,color:C.dim})),seg(p,0,.2),BC);
  return s;
 },
 // ===== S5 まとめと次の問い =====
 [K+'summary']:(p)=>{
  let s=loopA({sw:1,front:1,drift:1});
  s+=rcard(90,320,L('すぐ点く 理由',RCX,140,{size:26,color:C.hi,weight:700})
   +L('合図が 速く 伝わる',RCX,215,{size:28,color:SIG,weight:700})+L('＋',RCX,262,{size:28,color:C.dim})
   +L('そこの電子が その場で 動く',RCX,310,{size:26,color:NEG,weight:700}),1,C.hi);
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=card(70,50,510,290,L('第1法則（分岐点）',325,100,{size:26,color:IC,weight:700})+L('入る和 ＝ 出る和',325,175,{size:30,color:C.ink,weight:700})+L('正体：電荷の 保存',325,250,{size:28,color:C.hi,weight:700}),1,IC);
  s+=card(620,50,510,290,L('第2法則（一周）',875,100,{size:26,color:VC,weight:700})+L('上り下りの和 ＝ 0',875,175,{size:30,color:C.ink,weight:700})+L('一周0の電位・エネルギーの収支',875,250,{size:24,color:C.hi,weight:700}),seg(p,.2,.4),VC);
  s+=fade(seg(p,.55,.75),L('新しい法則 ではなく、保存則を 回路の言葉に 直したもの',600,410,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'flow']:(p)=>{
  let s=tube({x1:60,x2:620})+electronsIn({x1:60,x2:620,n:36,shift:40*p});
  s+=card(700,110,440,260,L('数えているのは',920,165,{size:26,color:C.dim})+T(`${It}=${ENSV}`,920,250,{size:52})+L('動く 電荷の 流れ',920,330,{size:28,color:IC,weight:700}),1,IC);
  return s;
 },
 [K+'magnet']:(p)=>{
  // two magnet poles with the field between them, and a current-carrying wire through the gap (seen from the side)
  let s=rect(250,70,300,70,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:8})+label('N',400,118,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=rect(250,380,300,70,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:8})+label('S',400,428,{size:34,color:C.ink,anchor:'middle',weight:700});
  for(let i=0;i<4;i++)s+=arrow(300+i*66,150,300+i*66,370,{color:BC,w:3,head:12,opacity:.8});
  s+=label('磁場',570,330,{size:26,color:BC,weight:700});
  s+=line(90,260,710,260,{color:C.dim,w:8})+arrow(120,232,300,232,{color:IC,w:5,head:14})+label('電流',120,212,{size:24,color:IC,weight:700});
  s+=card(760,110,400,280,L('初級',960,160,{size:24,color:C.dim})+L('電流が 流れる導線は',960,225,{size:26})+L('磁石の近くで 力を受ける',960,270,{size:26,color:C.hi,weight:700})
   +fade(seg(p,.5,.7),L('電流 ＝ 動く電荷の 集まり',960,345,{size:26,color:IC,weight:700})),seg(p,0,.2));
  return s;
 },
 [K+'next']:(p)=>{
  // a single positive charge moving through a magnetic field that points into the screen (⊗)
  let s='';
  for(let i=0;i<6;i++)for(let j=0;j<4;j++){const x=120+i*95,y=120+j*95;s+=line(x-9,y-9,x+9,y+9,{color:BC,w:2.5,opacity:.8})+line(x-9,y+9,x+9,y-9,{color:BC,w:2.5,opacity:.8});}
  s+=label('磁場（画面の奥向き）',120,470,{size:24,color:BC,weight:700});
  const x=mix(150,300,lin(p,0,1));
  s+=ring(x,280,18,{color:POS,w:3,fill:'#3a1d2a'})+label('+',x,288,{size:24,color:POS,anchor:'middle',weight:700});
  s+=arrow(x+24,280,x+130,280,{color:VEL,w:5,head:16})+T(cs(VEL,'\\mathbf{v}'),x+150,290,{size:32});
  s+=fade(seg(p,.3,.5),rect(x-6,184,110,44,{fill:C.bg,fo:.92,stroke:C.bg,sw:0,rx:8})+label('力は？',x+2,216,{size:30,color:C.F,weight:700})
   +rect(x+84,338,140,44,{fill:C.bg,fo:.92,stroke:C.bg,sw:0,rx:8})+label('軌道は？',x+94,370,{size:30,color:C.hi,weight:700}));
  s+=card(760,110,400,280,L('次の問い',960,160,{size:24,color:C.dim})+L('動く 電荷は 磁場の中で',960,225,{size:26})+L('どんな 力を 受け',960,275,{size:28,color:C.F,weight:700})+L('どんな 軌道を 描く？',960,325,{size:28,color:C.hi,weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
};
