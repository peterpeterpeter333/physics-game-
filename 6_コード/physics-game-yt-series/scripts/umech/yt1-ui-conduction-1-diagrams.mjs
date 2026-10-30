// YouTube シリーズ「電流・初級 1/1」(ys-ui-conduction-1) — 図。Stage 1200×515.
// 色：電荷 Q・通った電荷 桃、時間 t 金、電流 I 緑、正電荷 赤、電子 青、電場 𝐄 水色、電子の速度 𝐯 紫、電圧 V 紫（コンデンサの回と同じ）、磁場 橙。
// 導線：左右に伸びる管。断面（黄の楕円）を通った電荷を数える。「● 1つ ＝ 1 C」。
// コンデンサの回路（左の板・右の板・下の導線・電池）はコンデンサの回の図と同じ形・同じ色。
import {C,clamp,mix,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes} from './anim.mjs';
import {cs,card,T} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='ui-conduction-1:';
const POS=C.a,NEG='#7fb3ff',EC=C.x,QC=C.p,TC=C.t,IC=C.F,VC=C.v,VEL=C.v,BC=C.E;
const U=s=>`\\,\\mathrm{${s}}`;
const vE=cs(EC,'\\mathbf{E}'),vv=cs(VEL,'\\mathbf{v}');
const panel=(x,y,w,h,inner,g=1,stroke=C.faint)=>card(x,y,w,h,inner,g,stroke);

// ---- tokens ---------------------------------------------------------------------------------
const qtok=(x,y,op=1)=>fade(op,ring(x,y,13,{color:QC,w:2.5,fill:'#3a2140'})+dot(x,y,5,QC));
const electron=(x,y,{r=13,op=1}={})=>fade(op,ring(x,y,r,{color:NEG,w:2.5,fill:'#1b2a48'})+label('−',x,y+7,{size:22,color:NEG,anchor:'middle',weight:700}));
const plus=(x,y,{r=13,op=1}={})=>fade(op,ring(x,y,r,{color:POS,w:2.5,fill:'#3a1d2a'})+label('＋',x,y+8,{size:22,color:POS,anchor:'middle',weight:700}));
const TOK={q:qtok,e:(x,y)=>electron(x,y),p:(x,y)=>plus(x,y)};

// ---- wire, section, stream ------------------------------------------------------------------
const WX1=70,WX2=660,WY=250,GX=365;
const wire=(x1=WX1,x2=WX2,y=WY,g=1,hh=50)=>fade(g,rect(x1,y-hh,x2-x1,2*hh,{fill:'#8795ad',fo:.16,stroke:C.dim,sw:2.5,rx:hh-4}));
const section=(x=GX,y=WY,g=1,hh=50,text=true)=>fade(g,`<ellipse cx="${x}" cy="${y}" rx="20" ry="${hh}" fill="${C.hi}" fill-opacity=".14" stroke="${C.hi}" stroke-width="3"/>`
 +(text?label('断面',x,y-hh-16,{size:24,color:C.hi,anchor:'middle',weight:700}):''));
// tokens pass the section at times (k+.5)/r ; dir +1 = to the right
function stream(t,{r=2,speed=110,dir=1,kind='q',y=WY,x1=WX1,x2=WX2,gx=GX,g=1,dy=22}={}){
 let s='';
 for(let k=-40;k<60;k++){
  const x=gx+dir*speed*(t-(k+.5)/r);if(x<x1+20||x>x2-20)continue;
  const yy=y+[0,-dy,dy][((k%3)+3)%3];s+=TOK[kind](x,yy);
 }
 return fade(g,s);
}
const passed=(t,r=2)=>t<=0?0:Math.max(0,Math.floor(t*r-.5+1e-9)+1);
const legend=(x,y,g=1)=>fade(g,qtok(x,y-8)+label('1つ ＝ 1 C',x+24,y,{size:24,color:QC}));
const PX=730,PWD=430;
function counter(n,t,{g=1,y=110,h=260,title='通った電荷'}={}){
 const cx=PX+PWD/2;
 return panel(PX,y,PWD,h,label(title,cx,y+52,{size:26,color:C.dim,anchor:'middle'})+label(`${n} C`,cx,y+112,{size:44,color:QC,anchor:'middle',weight:700})
  +label('時間',cx,y+172,{size:26,color:C.dim,anchor:'middle'})+label(`${t.toFixed(1)} s`,cx,y+230,{size:40,color:TC,anchor:'middle',weight:700}),g,QC);
}

// ---- capacitor circuit (same geometry as ui-capacitance-1) ----------------------------------
const LX=360,RX=580,PW=64,PT=90,PB=372,CWY=440,BX=470;
const SLOT=k=>120+k*46,EL=LX-46,ER=RX+18;
const ePath=k=>[[EL,SLOT(k)],[LX-32,PB+10],[LX-32,CWY],[BX-10,CWY],[BX+10,CWY],[RX+32,CWY],[RX+32,PB+10],[ER,SLOT(k)]];
function along(pts,f){
 let L=0;const d=[];for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(s);L+=s;}
 let w=L*clamp(f);for(let i=1;i<pts.length;i++){if(w<=d[i-1]){const u=w/d[i-1];return [mix(pts[i-1][0],pts[i][0],u),mix(pts[i-1][1],pts[i][1],u)];}w-=d[i-1];}
 return pts[pts.length-1];
}
function plates(g=1){
 return fade(g,rect(LX-PW,PT,PW,PB-PT,{fill:'#8795ad',fo:.28,stroke:C.dim,sw:2.5,rx:4})+rect(RX,PT,PW,PB-PT,{fill:'#8795ad',fo:.28,stroke:C.dim,sw:2.5,rx:4}));
}
function battery(g=1){
 let s=draw([[LX-32,PB],[LX-32,CWY],[BX-10,CWY]],1,{color:C.dim,w:4})+draw([[BX+10,CWY],[RX+32,CWY],[RX+32,PB]],1,{color:C.dim,w:4});
 s+=line(BX-10,CWY-34,BX-10,CWY+34,{color:C.ink,w:5})+line(BX+10,CWY-18,BX+10,CWY+18,{color:C.ink,w:9});
 s+=label('＋',BX-32,CWY-22,{size:24,color:POS,anchor:'middle',weight:700})+label('−',BX+32,CWY-22,{size:26,color:NEG,anchor:'middle',weight:700});
 s+=label('電池',BX,CWY+54,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
function charges(moved,g=1){
 let s='';
 for(let k=0;k<6;k++){
  const f=clamp(moved-k),y=SLOT(k);
  s+=label('＋',LX-14,y+9,{size:26,color:POS,anchor:'middle',weight:700,opacity:f>0?1:.55});
  if(f<=0)s+=electron(EL,y,{r:12});
  else if(f<1){const [x,yy]=along(ePath(k),f);s+=electron(x,yy,{r:12});}
  else s+=electron(ER,y,{r:12});
 }
 return fade(g,s);
}
const circuit=(m,g=1)=>plates(g)+battery(g)+charges(m,g);
const eArrowsBottom=(g=1)=>fade(g,arrow(LX-20,CWY+26,BX-50,CWY+26,{color:NEG,w:4,head:13})+arrow(BX+50,CWY+26,RX+20,CWY+26,{color:NEG,w:4,head:13}));
function iArrows(g=1){
 let s=arrow(BX-26,CWY,LX-20,CWY,{color:IC,w:6,head:16})+arrow(LX-32,CWY-12,LX-32,PB+18,{color:IC,w:6,head:16});
 s+=arrow(RX+32,PB+14,RX+32,CWY-16,{color:IC,w:6,head:16})+arrow(RX+20,CWY,BX+30,CWY,{color:IC,w:6,head:16});
 return fade(g,s);
}

// ---- Q–t graph: Q = t²/2 (C, s); average 2 A over 4 s; at 3 s the current is 3 A ----------
const Qt=t=>t*t/2;
function qtGraph(g=1,curve=1){
 const A=axes({x:110,y:450,w:520,h:350,xmax:4.7,ymax:9.4,xticks:[1,2,3,4],yticks:[2,4,6,8],grid:true,g,xlabel:'t [s]',ylabel:'通った電荷 Q [C]',xcolor:TC,ycolor:QC});
 return {A,svg:A.svg+A.plot(Qt,{from:0,to:4.3,p:curve,color:QC,w:5})};
}
function lineThrough(A,t0,q0,k,a,b,{g=1,color=IC,w=4}={}){return draw([[A.X(a),A.Y(q0+k*(a-t0))],[A.X(b),A.Y(q0+k*(b-t0))]],g,{color,w});}

// ---- simple resistor circuit ------------------------------------------------------------------
const CL=150,CR=610,CT=140,CB=400,BATX=380;
function zig(x1,x2,y,color=C.ink){const pts=[[x1,y]];const n=6;for(let i=1;i<n*2;i++)pts.push([x1+(x2-x1)*i/(n*2),y+(i%2?-18:18)]);pts.push([x2,y]);return draw(pts,1,{color,w:4});}
function rCircuit({g=1,rs=[[320,440]],rlabel=['抵抗 R'],cur=0,batt='電池'}={}){
 let s='';const xs=rs.flat();
 const top=[[CL,CT]];for(const [a,b] of rs){top.push([a,CT]);}
 // wires between resistors on top
 s+=line(CL,CT,rs[0][0],CT,{color:C.dim,w:4});
 for(let i=0;i<rs.length-1;i++)s+=line(rs[i][1],CT,rs[i+1][0],CT,{color:C.dim,w:4});
 s+=line(rs[rs.length-1][1],CT,CR,CT,{color:C.dim,w:4});
 s+=rs.map(([a,b])=>zig(a,b,CT)).join('');
 s+=draw([[CR,CT],[CR,CB],[BATX+10,CB]],1,{color:C.dim,w:4})+draw([[BATX-10,CB],[CL,CB],[CL,CT]],1,{color:C.dim,w:4});
 s+=line(BATX+10,CB-34,BATX+10,CB+34,{color:C.ink,w:5})+line(BATX-10,CB-18,BATX-10,CB+18,{color:C.ink,w:9});
 s+=label('＋',BATX+32,CB-22,{size:24,color:POS,anchor:'middle',weight:700})+label('−',BATX-32,CB-22,{size:26,color:NEG,anchor:'middle',weight:700});
 s+=label(batt,BATX,CB+64,{size:26,color:C.dim,anchor:'middle'});
 s+=rs.map(([a,b],i)=>label(rlabel[i]??'',(a+b)/2,CT-40,{size:26,color:C.ink,anchor:'middle',weight:700})).join('');
 if(cur>0)s+=fade(cur,arrow(BATX+40,CB,CR-30,CB,{color:IC,w:6,head:16})+arrow(CR,CB-30,CR,CT+40,{color:IC,w:6,head:16})+arrow(CL,CT+40,CL,CB-40,{color:IC,w:6,head:16})
  +label('電流 I',CR+18,(CT+CB)/2+8,{size:26,color:IC,weight:700}));
 return fade(g,s);
}
function vBracket(a,b,text,g=1,y=CT+34){return fade(g,line(a,y,b,y,{color:VC,w:3})+line(a,y-10,a,y+10,{color:VC,w:3})+line(b,y-10,b,y+10,{color:VC,w:3})+label(text,(a+b)/2,y+38,{size:26,color:VC,anchor:'middle',weight:700}));}

export const ytUiConduction1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recall']:(p)=>{
  let s=circuit(6*seg(p,.05,.85));
  s+=fade(seg(p,.05,.25),label('コンデンサの回',PX+20,150,{size:26,color:C.dim})+label('電池が 電子を運ぶ',PX+20,205,{size:30,color:NEG,weight:700})
   +label('左の板 → 導線 → 右の板',PX+20,260,{size:26,color:C.ink}));
  return s;
 },
 [K+'question']:(p)=>{
  let s=wire()+stream(1+3*p);
  s+=panel(PX,120,PWD,250,label('電荷が 導線を流れる',PX+PWD/2,185,{size:30,color:C.ink,anchor:'middle'})
   +label('「流れの量」は',PX+PWD/2,250,{size:32,color:C.hi,anchor:'middle',weight:700})+label('どう測る？',PX+PWD/2,305,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.25,.45),C.hi);
  return s;
 },
 [K+'gate']:(p)=>{
  let s=wire()+stream(1+3*p)+section(GX,WY,seg(p,.1,.3));
  s+=legend(110,420,seg(p,.2,.4));
  s+=panel(PX,140,PWD,200,label('この断面を',PX+PWD/2,205,{size:30,color:C.ink,anchor:'middle'})
   +label('通り抜けた電荷を 数える',PX+PWD/2,265,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'rates']:(p)=>{
  const t=3*p;
  let s=wire(70,560,150,1,40)+section(315,150,1,40,false)+stream(t,{r:2,y:150,x1:70,x2:560,gx:315,dy:16});
  s+=wire(70,560,370,1,40)+section(315,370,1,40,false)+stream(t,{r:1,y:370,x1:70,x2:560,gx:315,dy:16});
  s+=label('4 秒で 8 C',600,160,{size:32,color:QC,weight:700})+label('8 秒で 8 C',600,380,{size:32,color:QC,weight:700});
  s+=fade(seg(p,.4,.6),label('強い流れ',860,160,{size:30,color:C.hi,weight:700})+label('弱い流れ',860,380,{size:30,color:C.dim,weight:700}));
  s+=fade(seg(p,.6,.8),label('同じ 8 C でも、かかった時間が違う',600,275,{size:26,color:C.ink}));
  return s;
 },
 [K+'speed']:(p)=>{
  let s=panel(90,90,480,330,label('速さ（微分の回）',330,150,{size:28,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{${cs(C.x,'\\Delta x')}}{${cs(TC,'\\Delta t')}}`,330,260,{size:60})
   +label('進んだ距離 ÷ 時間',330,370,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.2));
  s+=panel(630,90,480,330,label('流れの量',870,150,{size:28,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{${cs(QC,'\\Delta Q')}}{${cs(TC,'\\Delta t')}}`,870,260,{size:60})
   +label('通った電荷 ÷ 時間',870,370,{size:28,color:C.ink,anchor:'middle'}),seg(p,.5,.7),C.hi);
  return s;
 },
 // ===== S2 1秒あたりの電荷 =====
 [K+'count']:(p)=>{
  const t=4*lin(p,.08,.85);
  let s=wire()+section()+stream(t)+legend(110,420);
  s+=counter(passed(t),t);
  return s;
 },
 [K+'divide']:(p)=>{
  let s=wire()+section()+stream(4)+legend(110,420);
  s+=panel(PX,90,PWD,330,label('4 秒で 8 C',PX+PWD/2,150,{size:30,color:C.ink,anchor:'middle'})
   +T(`\\dfrac{${cs(QC,'8'+U('C'))}}{${cs(TC,'4'+U('s'))}}=${cs(IC,'2'+U('C/s'))}`,PX+PWD/2,245,{size:46})
   +fade(seg(p,.3,.5),label('1秒あたり 2 C',PX+PWD/2,330,{size:32,color:IC,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.8),label('＝ 電流',PX+PWD/2,385,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),IC);
  return s;
 },
 [K+'def']:(p)=>{
  let s=panel(170,80,860,360,label('電流（定義）',600,128,{size:30,color:IC,anchor:'middle',weight:700})
   +T(`\\dfrac{${cs(QC,'\\Delta Q')}}{${cs(TC,'\\Delta t')}}`,600,262,{size:72})
   +fade(seg(p,.05,.25),label('通った電荷',440,238,{size:28,color:QC,anchor:'end'})+label('かかった時間',440,310,{size:28,color:TC,anchor:'end'}))
   +fade(seg(p,.4,.6),label('1秒あたりに 断面を通る電荷',600,395,{size:30,color:C.ink,anchor:'middle'})),seg(p,0,.12),IC);
  return s;
 },
 [K+'same']:(p)=>{
  let s=panel(70,90,460,330,label('平均の速さ',300,150,{size:28,color:C.dim,anchor:'middle'})
   +T(`${cs(C.v,'\\bar v')}=\\dfrac{${cs(C.x,'\\Delta x')}}{${cs(TC,'\\Delta t')}}`,300,265,{size:56}),1);
  s+=panel(670,90,460,330,label('平均の電流',900,150,{size:28,color:IC,anchor:'middle',weight:700})
   +T(`${cs(IC,'\\bar I')}=\\dfrac{${cs(QC,'\\Delta Q')}}{${cs(TC,'\\Delta t')}}`,900,265,{size:56})
   +fade(seg(p,.55,.75),label('棒 ＝ 区間の平均の印',900,375,{size:26,color:C.dim,anchor:'middle'})),seg(p,.3,.5),IC);
  s+=fade(seg(p,.1,.3),label('同じ形',600,272,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  return panel(140,80,920,360,label('単位',600,135,{size:28,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{${cs(QC,U('C'))}}{${cs(TC,U('s'))}}=${cs(IC,U('C/s'))}`,380,225,{size:50})
   +fade(seg(p,.2,.4),T(`1${U('A')}=1${U('C/s')}`,810,225,{size:50,color:IC})+label('アンペア',810,300,{size:28,color:IC,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.75),T(`${cs(IC,'\\bar I')}=\\dfrac{${cs(QC,'8'+U('C'))}}{${cs(TC,'4'+U('s'))}}=${cs(IC,'2'+U('A'))}`,600,380,{size:46})),seg(p,0,.1),IC);
 },
 [K+'graph']:(p)=>{
  const {A,svg}=qtGraph(seg(p,0,.15),seg(p,.15,.6));
  let s=svg;
  s+=fade(seg(p,.55,.7),dot(A.X(4),A.Y(8),9,C.hi)+label('4 秒で 8 C',A.X(4)+18,A.Y(8)+34,{size:24,color:C.hi}));
  s+=panel(760,110,400,260,label('通った電荷の合計',960,170,{size:26,color:C.dim,anchor:'middle'})
   +label('あとほど 急に増える',960,235,{size:28,color:QC,anchor:'middle',weight:700})
   +label('＝ 流れが 強くなる',960,295,{size:28,color:C.ink,anchor:'middle'}),seg(p,.3,.5));
  return s;
 },
 [K+'secant']:(p)=>{
  const {A,svg}=qtGraph();let s=svg+dot(A.X(0),A.Y(0),8,C.hi)+dot(A.X(4),A.Y(8),9,C.hi);
  s+=lineThrough(A,0,0,2,0,4,{g:seg(p,.05,.35),w:5});
  s+=fade(seg(p,.35,.55),line(A.X(0),A.Y(0)+0,A.X(4),A.Y(0),{color:TC,w:4})+label('4 s',A.X(3.3),A.Y(0)-12,{size:24,color:TC,anchor:'middle',weight:700})
   +line(A.X(4)+16,A.Y(0),A.X(4)+16,A.Y(8),{color:QC,w:4})+label('8 C',A.X(4)+26,A.Y(4)+8,{size:24,color:QC,weight:700}));
  s+=panel(760,110,400,260,label('直線の傾き',960,170,{size:26,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{${cs(QC,'8'+U('C'))}}{${cs(TC,'4'+U('s'))}}=${cs(IC,'2'+U('A'))}`,960,250,{size:44})
   +label('＝ 平均の電流',960,330,{size:28,color:IC,anchor:'middle',weight:700}),seg(p,.4,.6),IC);
  return s;
 },
 [K+'tangent']:(p)=>{
  const {A,svg}=qtGraph();let s=svg;
  const h=mix(1,0.02,seg(p,.1,.7)),t1=3,t2=3+h,k=(Qt(t2)-Qt(t1))/h;
  s+=fade(1-seg(p,0,.15),lineThrough(A,0,0,2,0,4,{w:5}));
  s+=lineThrough(A,t1,Qt(t1),k,2.2,4.3,{g:seg(p,.05,.2),w:4});
  s+=dot(A.X(t1),A.Y(Qt(t1)),9,C.hi)+fade(seg(p,.05,.2)*(1-seg(p,.6,.75)),dot(A.X(t2),A.Y(Qt(t2)),8,C.hi));
  s+=fade(seg(p,.05,.2),label('幅を 縮める',A.X(3.1),A.Y(1.2),{size:24,color:C.hi,anchor:'middle'}));
  s+=panel(760,70,400,390,label('瞬間の電流',960,118,{size:28,color:IC,anchor:'middle',weight:700})
   +T(`${cs(IC,'I')}=\\dfrac{d${cs(QC,'Q')}}{d${cs(TC,'t')}}`,960,215,{size:50})
   +fade(seg(p,.7,.85),T(`${cs(C.v,'v')}=\\dfrac{d${cs(C.x,'x')}}{d${cs(TC,'t')}}`,960,345,{size:40})+label('と同じ考え',960,430,{size:24,color:C.dim,anchor:'middle'})),seg(p,.55,.75),IC);
  return s;
 },
 [K+'tangent2']:(p)=>{
  const {A,svg}=qtGraph();let s=svg+dot(A.X(3),A.Y(4.5),9,C.hi);
  s+=lineThrough(A,3,4.5,3,2.2,4.3,{w:4});
  s+=fade(seg(p,.1,.35),line(A.X(3),A.Y(4.5),A.X(4),A.Y(4.5),{color:TC,w:4})+label('1 s',A.X(3.5),A.Y(4.5)+30,{size:24,color:TC,anchor:'middle',weight:700})
   +line(A.X(4),A.Y(4.5),A.X(4),A.Y(7.5),{color:QC,w:4})+label('3 C',A.X(4)+12,A.Y(6)+8,{size:24,color:QC,weight:700}));
  s+=lineThrough(A,0,0,2,0,4,{g:seg(p,.6,.8)*.6,w:3,color:C.dim});
  s+=panel(760,100,400,300,label('3 秒の瞬間',960,160,{size:28,color:C.dim,anchor:'middle'})
   +label('3 A',960,235,{size:48,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.6,.8),label('4 秒間の平均は 2 A',960,320,{size:28,color:C.dim,anchor:'middle'})+label('→ 違う値',960,370,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.3,.5),IC);
  return s;
 },
 [K+'quiz']:(p)=>{
  return panel(250,90,700,330,label('確認',600,150,{size:28,color:C.dim,anchor:'middle'})
   +label('2 秒で 6 C が 断面を通った',600,230,{size:34,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.55),T(`${cs(IC,'\\bar I')}=\\;?\\;${U('A')}`,600,340,{size:56})),seg(p,0,.15),C.hi);
 },
 [K+'quizans']:(p)=>{
  return panel(250,90,700,330,label('確認',600,150,{size:28,color:C.dim,anchor:'middle'})
   +label('2 秒で 6 C が 断面を通った',600,230,{size:34,color:C.ink,anchor:'middle'})
   +T(`${cs(IC,'\\bar I')}=\\dfrac{${cs(QC,'6'+U('C'))}}{${cs(TC,'2'+U('s'))}}`,520,335,{size:46})
   +fade(seg(p,.4,.6),T(`=${cs(IC,'3'+U('A'))}`,680,335,{size:50})),0.999,C.hi);
 },
 [K+'density']:(p)=>{
  const t=1+3*p;
  let s=label('同じ速さ',70,70,{size:28,color:C.hi,weight:700});
  s+=wire(70,560,160,1,44)+section(315,160,1,44,false)+stream(t,{r:2,y:160,x1:70,x2:560,gx:315,dy:18});
  s+=wire(70,560,380,1,44)+section(315,380,1,44,false)+stream(t,{r:4,y:380,x1:70,x2:560,gx:315,dy:18});
  s+=fade(seg(p,.2,.4),label('1秒に 2 C',600,150,{size:30,color:QC,weight:700})+label('→ 2 A',800,150,{size:32,color:IC,weight:700}));
  s+=fade(seg(p,.4,.6),label('並ぶ電荷が 2倍',600,330,{size:28,color:C.ink})+label('1秒に 4 C',600,385,{size:30,color:QC,weight:700})+label('→ 4 A',800,385,{size:32,color:IC,weight:700}));
  return s;
 },
 // ===== S3 電子1個の電荷 =====
 [K+'electron']:(p)=>{
  let s=wire()+stream(1+3*p,{kind:'e',dir:-1,r:3,speed:90});
  s+=fade(seg(p,.1,.3),label('金属の導線',WX1+10,WY-70,{size:26,color:C.dim}));
  s+=panel(PX,120,PWD,260,label('電子 1個の電荷',PX+PWD/2,180,{size:28,color:C.dim,anchor:'middle'})
   +electron(PX+PWD/2-70,265,{r:30})+T(cs(NEG,'-e'),PX+PWD/2+50,265,{size:56}),seg(p,.45,.65),NEG);
  return s;
 },
 [K+'e']:(p)=>{
  return panel(140,80,920,360,T(cs(NEG,'-e'),300,210,{size:72})
   +fade(seg(p,.05,.25),T(`e\\approx1.6\\times10^{-19}${U('C')}`,720,195,{size:48}))
   +fade(seg(p,.2,.35),label('e は 正の数（電荷の大きさ）',720,265,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.75),label('前の − ＝ 負の電荷の印',720,360,{size:32,color:NEG,anchor:'middle',weight:700})+highlight(215,150,170,110,1,NEG)),seg(p,0,.1),NEG);
 },
 [K+'perC']:(p)=>{
  return panel(140,80,920,360,label('1 C は 電子何個分？',600,140,{size:30,color:C.ink,anchor:'middle'})
   +T(`\\dfrac{1${U('C')}}{1.6\\times10^{-19}${U('C')}}`,420,265,{size:50})
   +fade(seg(p,.4,.6),T(`\\approx6.25\\times10^{18}`,780,265,{size:50,color:NEG})+label('個',960,272,{size:32,color:NEG,weight:700})),seg(p,0,.1));
 },
 [K+'per2A']:(p)=>{
  let s=wire()+section()+stream(1+3*p,{kind:'e',dir:-1,r:4,speed:90,dy:26});
  s+=panel(PX,90,PWD,340,label('2 A ＝ 1秒に 2 C',PX+PWD/2,150,{size:30,color:IC,anchor:'middle',weight:700})
   +T(`2\\times6.25\\times10^{18}`,PX+PWD/2,230,{size:40})
   +fade(seg(p,.3,.5),T(`=1.25\\times10^{19}`,PX+PWD/2,305,{size:44,color:NEG}))
   +fade(seg(p,.45,.6),label('1秒に通る 電子の数',PX+PWD/2,385,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.15),IC);
  s+=label('電子の数は 図より ずっと多い',WX1+10,WY+100,{size:24,color:C.dim});
  return s;
 },
 // ===== S4 電流の向き =====
 [K+'posdir']:(p)=>{
  let s=wire()+stream(1+3*p,{kind:'p'});
  s+=panel(PX,110,PWD,260,label('約束（定義）',PX+PWD/2,170,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('正の電荷が 動く向き',PX+PWD/2,240,{size:30,color:POS,anchor:'middle',weight:700})
   +label('＝ 電流の正の向き',PX+PWD/2,300,{size:30,color:IC,anchor:'middle',weight:700}),seg(p,.25,.45),C.hi);
  return s;
 },
 [K+'posright']:(p)=>{
  let s=wire()+stream(4+3*p,{kind:'p'});
  s+=fade(seg(p,.05,.25),arrow(150,WY-110,300,WY-110,{color:POS,w:5,head:16})+label('正の電荷の動き',315,WY-102,{size:26,color:POS,weight:700}));
  s+=fade(seg(p,.35,.55),arrow(150,WY+110,300,WY+110,{color:IC,w:7,head:18})+label('電流 I',315,WY+118,{size:28,color:IC,weight:700}));
  s+=panel(PX,110,PWD,260,label('約束（定義）',PX+PWD/2,170,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('正の電荷が 動く向き',PX+PWD/2,240,{size:30,color:POS,anchor:'middle',weight:700})
   +label('＝ 電流の正の向き',PX+PWD/2,300,{size:30,color:IC,anchor:'middle',weight:700}),1,C.hi);
  return s;
 },
 [K+'elecleft']:(p)=>{
  let s=wire()+stream(1+3*p,{kind:'e',dir:-1});
  s+=fade(seg(p,.1,.3),arrow(300,WY-110,150,WY-110,{color:NEG,w:5,head:16})+label('電子の動き',315,WY-102,{size:26,color:NEG,weight:700}));
  s+=fade(seg(p,.5,.7),arrow(150,WY+110,300,WY+110,{color:IC,w:7,head:18})+label('電流 I',315,WY+118,{size:28,color:IC,weight:700}));
  s+=panel(PX,110,PWD,260,label('金属の中',PX+PWD/2,170,{size:28,color:C.dim,anchor:'middle'})
   +label('電子（負）が 左へ',PX+PWD/2,240,{size:30,color:NEG,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('→ 電流は 右向き',PX+PWD/2,300,{size:30,color:IC,anchor:'middle',weight:700})),seg(p,.05,.25),NEG);
  return s;
 },
 [K+'why']:(p)=>{
  const x=mix(GX+150,GX-150,seg(p,.3,.85));
  let s=wire()+section()+electron(x,WY,{r:15});
  s+=label('左側',GX-160,WY+100,{size:28,color:C.dim,anchor:'middle',weight:700})+label('右側',GX+160,WY+100,{size:28,color:C.dim,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.25),label('電子 1個が 右 → 左',GX,WY-110,{size:28,color:NEG,anchor:'middle',weight:700}));
  s+=panel(PX,140,PWD,200,label('両側の電荷は',PX+PWD/2,210,{size:30,color:C.ink,anchor:'middle'})+label('どう変わる？',PX+PWD/2,265,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'change']:(p)=>{
  let s=wire()+section()+electron(GX-150,WY,{r:15});
  s+=label('左側',GX-160,WY+100,{size:28,color:C.dim,anchor:'middle',weight:700})+label('右側',GX+160,WY+100,{size:28,color:C.dim,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.25),T(`${cs(POS,'+e')}`,GX+160,WY-80,{size:44})+label('−e を失う',GX+160,WY+145,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.45,.65),T(`${cs(NEG,'-e')}`,GX-160,WY-80,{size:44})+label('−e を受け取る',GX-160,WY+145,{size:26,color:C.ink,anchor:'middle'}));
  s+=panel(PX,140,PWD,200,label('左 −e，右 ＋e',PX+PWD/2,250,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.7,.85),C.hi);
  return s;
 },
 [K+'samechange']:(p)=>{
  const u=seg(p,.05,.5);
  let s=wire(70,560,140,1,40)+section(315,140,1,40,false)+electron(mix(430,200,u),140,{r:14});
  s+=wire(70,560,370,1,40)+section(315,370,1,40,false)+plus(mix(200,430,u),370,{r:14});
  s+=label('電子が 左へ',600,150,{size:28,color:NEG,weight:700})+label('正の電荷が 右へ',600,380,{size:28,color:POS,weight:700});
  const tally=(y,g)=>fade(g,label('左 −e',150,y,{size:26,color:NEG,anchor:'middle',weight:700})+label('右 ＋e',480,y,{size:26,color:POS,anchor:'middle',weight:700}));
  s+=tally(215,seg(p,.5,.65))+tally(445,seg(p,.5,.65));
  s+=fade(seg(p,.65,.8),label('同じ変化',900,265,{size:32,color:C.hi,anchor:'middle',weight:700})+arrow(820,300,980,300,{color:IC,w:7,head:18})+label('電流は 右向き',900,350,{size:28,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'arrows']:(p)=>{
  const Y=380;let s=wire(WX1,WX2,Y,1,46);
  for(let i=0;i<4;i++)s+=fade(.5,arrow(120+i*130,Y-30,200+i*130,Y-30,{color:EC,w:3,head:11}));
  s+=stream(1+3*p,{kind:'e',dir:-1,y:Y+10,gx:GX,dy:14});
  const row=(y,x1,x2,color,tx,name,g)=>fade(g,arrow(x1,y,x2,y,{color,w:6,head:18})+T(tx,110,y,{size:40})+label(name,560,y+9,{size:26,color,weight:700}));
  s+=row(80,190,470,EC,vE,'電場',seg(p,.05,.2));
  s+=row(160,470,190,VEL,vv,'電子の速度',seg(p,.5,.7));
  s+=panel(PX+80,60,PWD-80,210,label('電子は 負',PX+PWD/2+40,120,{size:28,color:NEG,anchor:'middle',weight:700})
   +label('電場と 逆向きの力',PX+PWD/2+40,175,{size:28,color:C.ink,anchor:'middle'})+label('→ 左へ 動く',PX+PWD/2+40,230,{size:28,color:VEL,anchor:'middle',weight:700}),seg(p,.25,.45));
  return s;
 },
 [K+'arrows2']:(p)=>{
  const Y=380;let s=wire(WX1,WX2,Y,1,46);
  for(let i=0;i<4;i++)s+=fade(.5,arrow(120+i*130,Y-30,200+i*130,Y-30,{color:EC,w:3,head:11}));
  s+=stream(4+3*p,{kind:'e',dir:-1,y:Y+10,gx:GX,dy:14});
  const row=(y,x1,x2,color,tx,name,g)=>fade(g,arrow(x1,y,x2,y,{color,w:6,head:18})+T(tx,110,y,{size:40})+label(name,560,y+9,{size:26,color,weight:700}));
  s+=row(80,190,470,EC,vE,'電場',1)+row(160,470,190,VEL,vv,'電子の速度',1);
  s+=row(240,190,470,IC,cs(IC,'I'),'電流',seg(p,.3,.5));
  s+=panel(PX+80,90,PWD-80,210,label('電流は',PX+PWD/2+40,150,{size:28,color:C.dim,anchor:'middle'})
   +label('電場と 同じ向き',PX+PWD/2+40,205,{size:30,color:IC,anchor:'middle',weight:700})+label('電子の速度と 逆',PX+PWD/2+40,260,{size:28,color:VEL,anchor:'middle'}),seg(p,.55,.75),IC);
  return s;
 },
 [K+'capq']:(p)=>{
  let s=circuit(1+4.5*seg(p,.0,.7))+eArrowsBottom(seg(p,.15,.35));
  s+=fade(seg(p,.15,.35),label('電子の動き',LX-40,CWY+36,{size:24,color:NEG,anchor:'end',weight:700}));
  s+=panel(PX,130,PWD,220,label('下の導線で 電子は 右へ',PX+PWD/2,195,{size:28,color:NEG,anchor:'middle',weight:700})
   +label('電流は どちら向き？',PX+PWD/2,270,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'capans']:(p)=>{
  let s=circuit(6)+eArrowsBottom(.45)+iArrows(seg(p,.05,.3));
  s+=fade(seg(p,.05,.3),label('電流 I',LX-110,CWY-40,{size:26,color:IC,weight:700}));
  s+=panel(PX,110,PWD,260,label('電流は 左向き',PX+PWD/2,170,{size:32,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),label('電池の ＋極から出て',PX+PWD/2,235,{size:28,color:C.ink,anchor:'middle'})+label('左の板へ 流れ込む',PX+PWD/2,285,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.65,.85),label('左の板が ＋ と合う',PX+PWD/2,345,{size:28,color:POS,anchor:'middle',weight:700})),seg(p,.05,.25),IC);
  s+=fade(seg(p,.65,.85),ring(LX-14,SLOT(2)+1,40,{color:POS,w:3}));
  return s;
 },
 // ===== S5 オームの法則 =====
 [K+'ohmcirc']:(p)=>{
  let s=rCircuit({g:seg(p,.3,.55),cur:seg(p,.6,.8)});
  s+=panel(PX,140,PWD,200,label('電流の大きさは',PX+PWD/2,210,{size:30,color:C.ink,anchor:'middle'})
   +label('何で 決まる？',PX+PWD/2,265,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  return s;
 },
 [K+'ohm']:(p)=>{
  let s=rCircuit({cur:1})+vBracket(320,440,'電圧 V',seg(p,.05,.25));
  s+=panel(PX,90,PWD,330,label('V と I が 比例',PX+PWD/2,150,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.55),T(`${cs(VC,'V')}=${cs(C.ink,'R')}${cs(IC,'I')}`,PX+PWD/2,245,{size:64}))
   +fade(seg(p,.5,.7),label('オームの法則',PX+PWD/2,330,{size:30,color:C.hi,anchor:'middle',weight:700})+label('実験で確かめられた法則（高校）',PX+PWD/2,380,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'unitR']:(p)=>{
  let s=rCircuit({cur:1})+vBracket(320,440,'電圧 V',1);
  s+=panel(PX,90,PWD,330,label('比例の係数 R ＝ 抵抗',PX+PWD/2,150,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.15,.35),label('単位 オーム',PX+PWD/2,210,{size:28,color:C.dim,anchor:'middle'})+T(`1\\,\\Omega=1${U('V/A')}`,PX+PWD/2,285,{size:50}))
   +fade(seg(p,.5,.7),label('1 A 流すのに 1 V 要る',PX+PWD/2,370,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'exq']:(p)=>{
  let s=rCircuit({rlabel:['3 Ω'],cur:1})+vBracket(320,440,'6 V',1);
  s+=panel(PX,130,PWD,240,label('抵抗 3 Ω に 6 V',PX+PWD/2,195,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),T(`${cs(IC,'I')}=\\;?\\;${U('A')}`,PX+PWD/2,300,{size:56})),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'exans']:(p)=>{
  let s=rCircuit({rlabel:['3 Ω'],cur:1})+vBracket(320,440,'6 V',1);
  s+=panel(PX,60,PWD,400,T(`${cs(VC,'V')}=R${cs(IC,'I')}`,PX+PWD/2,112,{size:42})
   +fade(seg(p,.1,.3),label('↓ I について 解く',PX+PWD/2,168,{size:24,color:C.dim,anchor:'middle'})+T(`${cs(IC,'I')}=\\dfrac{${cs(VC,'V')}}{R}`,PX+PWD/2,262,{size:44}))
   +fade(seg(p,.45,.65),T(`=\\dfrac{${cs(VC,'6'+U('V'))}}{3\\,\\Omega}=${cs(IC,'2'+U('A'))}`,PX+PWD/2,385,{size:42})),seg(p,0,.1),IC);
  return s;
 },
 [K+'bigR']:(p)=>{
  const bar=(y,w,g,text,r)=>fade(g,label(r,230,y+10,{size:34,color:C.ink,anchor:'end',weight:700})+rect(260,y-22,w,44,{fill:IC,fo:.4,stroke:IC,sw:2,rx:6})+label(text,270+w,y+10,{size:32,color:IC,weight:700}));
  let s=label('同じ 6 V',110,90,{size:30,color:VC,weight:700});
  s+=bar(190,400,1,'2 A','3 Ω')+bar(330,200,seg(p,.1,.35),'1 A','6 Ω');
  s+=panel(PX+40,140,PWD-40,220,T(`\\dfrac{${cs(VC,'6'+U('V'))}}{6\\,\\Omega}=${cs(IC,'1'+U('A'))}`,PX+PWD/2+20,215,{size:44})
   +fade(seg(p,.5,.7),label('抵抗が 大きいほど',PX+PWD/2+20,290,{size:26,color:C.ink,anchor:'middle'})+label('電流は 小さい',PX+PWD/2+20,335,{size:28,color:IC,anchor:'middle',weight:700})),seg(p,.2,.4),IC);
  return s;
 },
 [K+'partV']:(p)=>{
  const two=seg(p,.35,.55);
  let s=two<.5?fade(1-2*two,rCircuit({rlabel:['抵抗'],cur:1,batt:'電池 6 V'})+vBracket(320,440,'6 V',seg(p,.05,.2)))
   :fade(2*two-1,rCircuit({rs:[[230,330],[430,530]],rlabel:['抵抗 1','抵抗 2'],cur:1,batt:'電池 6 V'})+fade(seg(p,.5,.7),T(cs(VC,'V_1'),280,CT+60,{size:36})+T(cs(VC,'V_2'),480,CT+60,{size:36})));
  s+=panel(PX,110,PWD,270,label('V ＝ その抵抗の',PX+PWD/2,170,{size:28,color:VC,anchor:'middle',weight:700})+label('両端の電圧',PX+PWD/2,215,{size:28,color:VC,anchor:'middle',weight:700})
   +fade(seg(p,.55,.75),label('部品が増えると',PX+PWD/2,285,{size:26,color:C.ink,anchor:'middle'})+label('電池の電圧とは 別になりうる',PX+PWD/2,330,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12),VC);
  return s;
 },
 [K+'back']:(p)=>{
  const t=4*lin(p,.1,.8);
  let s=wire()+section()+stream(t)+legend(110,420);
  s+=counter(passed(t),t,{y:70,h:260});
  s+=fade(seg(p,.55,.75),T(`${cs(IC,'2'+U('A'))}\\times${cs(TC,'4'+U('s'))}=${cs(QC,'8'+U('C'))}`,PX+PWD/2,400,{size:40}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'summary']:(p)=>{
  const col=(x,title,color,body,g)=>card(x,110,340,300,label(title,x+170,165,{size:28,color,anchor:'middle',weight:700})+body,g,color);
  let s=col(60,'定義',IC,T(`${cs(IC,'\\bar I')}=\\dfrac{${cs(QC,'\\Delta Q')}}{${cs(TC,'\\Delta t')}}`,230,265,{size:44})+label('単位 A ＝ C/s',230,360,{size:24,color:IC,anchor:'middle'}),seg(p,.05,.25));
  s+=col(430,'約束',C.hi,label('電流の向き ＝',600,245,{size:28,color:C.ink,anchor:'middle'})+label('正の電荷が 動く向き',600,295,{size:28,color:POS,anchor:'middle',weight:700})+label('電子の動きとは 逆',600,360,{size:24,color:NEG,anchor:'middle'}),seg(p,.3,.5));
  s+=col(800,'実験の法則',VC,T(`${cs(VC,'V')}=R${cs(IC,'I')}`,970,265,{size:48})+label('抵抗で 成り立つ',970,360,{size:24,color:C.dim,anchor:'middle'}),seg(p,.6,.8));
  return s;
 },
 [K+'summary2']:(p)=>{
  const Y=300;let s=wire(WX1,WX2,Y,1,50)+stream(1+3*p,{kind:'e',dir:-1,y:Y});
  s+=arrow(420,Y-100,200,Y-100,{color:NEG,w:5,head:16})+label('電子の動き',440,Y-92,{size:26,color:NEG,weight:700});
  s+=fade(seg(p,.2,.4),arrow(200,Y+100,420,Y+100,{color:IC,w:7,head:18})+label('電流 I',440,Y+108,{size:28,color:IC,weight:700}));
  s+=panel(PX,150,PWD,160,label('電子と 電流は 逆向き',PX+PWD/2,240,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'magnet']:(p)=>{
  const Y=265;let s='';
  s+=rect(230,40,260,80,{fill:'#8795ad',fo:.35,stroke:C.dim,sw:2.5,rx:6})+label('N',360,95,{size:40,color:C.ink,anchor:'middle',weight:700});
  s+=rect(230,410,260,80,{fill:'#8795ad',fo:.35,stroke:C.dim,sw:2.5,rx:6})+label('S',360,465,{size:40,color:C.ink,anchor:'middle',weight:700});
  s+=label('磁石',520,95,{size:26,color:C.dim});
  s+=wire(60,660,Y,1,26)+fade(seg(p,.05,.25),arrow(120,Y,300,Y,{color:IC,w:6,head:16})+label('電流 I',120,Y-40,{size:26,color:IC,weight:700}));
  const wob=seg(p,.35,.5);
  s+=fade(wob,ring(430,Y,44,{color:C.hi,w:3,dash:'6 6'})+label('？',430,Y+14,{size:40,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(PX,140,PWD,220,label('電流が流れる導線は',PX+PWD/2,205,{size:28,color:C.ink,anchor:'middle'})+label('力を受けて 動く',PX+PWD/2,265,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s='';
  for(let i=0;i<6;i++){const x=110+i*95;s+=fade(.8,arrow(x,70,x,440,{color:BC,w:3,head:13}));}
  s+=label('磁場',640,90,{size:28,color:BC,weight:700});
  const x=mix(150,440,seg(p,.05,.6));
  s+=plus(x,260,{r:22})+fade(seg(p,.05,.2),arrow(x+30,260,x+120,260,{color:VEL,w:5,head:15}));
  s+=fade(seg(p,.3,.45),label('？',x,205,{size:44,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(PX,110,PWD,280,label('次の問い',PX+PWD/2,165,{size:26,color:C.dim,anchor:'middle'})
   +label('磁場の中で 動く電荷',PX+PWD/2,225,{size:30,color:C.ink,anchor:'middle'})
   +label('力は どちらを向き',PX+PWD/2,285,{size:30,color:C.hi,anchor:'middle',weight:700})+label('運動に 何をする？',PX+PWD/2,340,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.55),C.hi);
  return s;
 },
};
