// 問題編 解説「2 nC の点電荷：傾き、仕事、導体球」（q-ue-potential、大学編 22 電位・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/22_電位.md の q-ue-potential（解説 20 行）。
// 画面：左に図（斜めから見た3次元の座標／y–z 面の階段／導体球の断面）、右に説明の枠またはグラフ。札は yt1-qx-common.mjs。
// 色（正本）：電場 𝐄 水色、電位 V 紫、仕事 W 橙、差・強調 黄、負・誤り 赤、正電荷 赤、負電荷 青、一歩 d𝐫・道 金、鍵の印 橙。
// 図のために決めた値：1 m＝100 px（3次元の図）、x 軸は手前左下へ（奥行きを半分に縮めて描く）、R＝(0, −0.3, 0.4)、くねった道の形、
//   階段の角度（P 53.13° → R 126.87°、半径 2 → 1.5 → 1 → 0.5 m）、導体球の断面は半径 150 px。
import {C,clamp,mix,seg,fade,move,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,wrongSeq,wrongCard,cueT,tAt,sentWin,textW} from './yt1-qx-common.mjs';

const K='qx-ue-potential:';
const EC=C.x,VC=C.v,UC=C.E,HI=C.hi,GD=C.t,NG='#ff6b6b',RED='#ff6b6b',BLUE='#7fb3ff';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const PX=640,PW=540,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='P での 電場の z 成分',G2='Q の電場が q にする仕事',G3='中心の E と V';
const ANS1=g=>answerTag(1,'C','3.60 V/m',{g}),ANS2=g=>answerTag(2,'A','',{g}),ANS3=g=>answerTag(3,'C','電場 0、電位 180 V',{g});

// ---- 3次元の図 ----
const OX=260,OY=330,SC=90;
const P3=([x,y,z])=>[OX+SC*y-.5*SC*x,OY-SC*z+.4*SC*x];
const PP=P3([0,1.2,1.6]),RR=P3([0,-.3,.4]);
function axes3({g=1,lockX=0,lockY=0}={}){
 let s='';
 const ax=(a,b,lab,lx,ly)=>{const [x1,y1]=P3(a),[x2,y2]=P3(b);return line(...P3(a.map(v=>-v*.25)),x1,y1,{color:C.faint,w:2,dash:'5 6'})+arrow(x1,y1,x2,y2,{color:C.dim,w:3,head:12})+label(lab,x2+lx,y2+ly,{size:26,color:C.dim,anchor:'middle',weight:700});};
 s+=ax([0,0,0],[0,0,2.3],'z',0,-12)+ax([0,0,0],[0,2.5,0],'y',20,8)+ax([0,0,0],[2.2,0,0],'x',-14,22);
 const lock=(x,y,gg)=>fade(gg,rect(x-12,y-6,24,20,{fill:UC,fo:.85,stroke:UC,sw:2,rx:3})+draw(Array.from({length:13},(_,i)=>{const a=Math.PI*i/12;return [x+8*Math.cos(a),y-6-10*Math.sin(a)];}),1,{color:UC,w:3})
  +label('止める',x,y+40,{size:22,color:UC,anchor:'middle',weight:700}));
 if(lockX){const [x,y]=P3([1.9,0,0]);s+=lock(x-24,y-10,lockX);}
 if(lockY){const [x,y]=P3([0,2.1,0]);s+=lock(x,y-24,lockY);}
 return fade(g,s);
}
function qDot(x,y,{g=1,sign=1,r=16,text='',tx=0,ty=-26,anchor='middle'}={}){
 const col=sign>0?RED:BLUE;
 return fade(g,ring(x,y,r,{color:col,w:3,fill:sign>0?'#3a1d2a':'#1a2a4a'})+label(sign>0?'+':'−',x,y+r*.45,{size:r*1.4,color:col,anchor:'middle',weight:700})
  +(text?label(text,x+tx,y+ty,{size:24,color:col,anchor,weight:700}):''));
}
function pointP({g=1,dots=1,coords=1}={}){
 const [px,py]=PP,[zx,zy]=P3([0,0,1.6]),[yx,yy]=P3([0,1.2,0]);
 let s=fade(dots,line(px,py,zx,zy,{color:C.dim,w:2,dash:'4 6'})+line(px,py,yx,yy,{color:C.dim,w:2,dash:'4 6'})
  +label('1.6',zx-12,zy+8,{size:22,color:C.dim,anchor:'end'})+label('1.2',yx,yy+30,{size:22,color:C.dim,anchor:'middle'}));
 s+=dot(px,py,8,C.ink)+fade(coords,label('P(0, 1.2, 1.6)',px+16,py-14,{size:24,color:C.ink,weight:700}));
 return fade(g,s);
}
function base3({g=1,lockX=0,lockY=0,dots=1,coords=1,qText=1}={}){
 return fade(g,axes3({lockX,lockY})+qDot(OX,OY,{text:qText?'Q＝2 nC':'',tx:-24,ty:8,anchor:'end'})+pointP({dots,coords}));
}
const sphere=(r,{g=1,fo=.10,col=VC,w=2.5,dash=''}={})=>fade(g,`<circle cx="${OX}" cy="${OY}" r="${SC*r}" fill="${col}" fill-opacity="${fo}" stroke="${col}" stroke-width="${w}"${dash?` stroke-dasharray="${dash}"`:''}/>`);
// くねった道（P→R）
const wig=Array.from({length:81},(_,i)=>{const t=i/80,[ax,ay]=PP,[bx,by]=RR,nx=-(by-ay),ny=bx-ax,L=Math.hypot(nx,ny);const w=36*Math.sin(3*Math.PI*t)*Math.sin(Math.PI*t);return [mix(ax,bx,t)+w*nx/L+60*Math.sin(Math.PI*t),mix(ay,by,t)+w*ny/L-50*Math.sin(Math.PI*t)];});
// y–z 面の階段：P（r 2, 53.13°）→ R（r 0.5, 126.87°）
const DEG=Math.PI/180,A0=53.13,A1=126.87,RS=[2,1.5,1,.5],AS=[A0,A0+(A1-A0)/4,A0+(A1-A0)/2,A0+3*(A1-A0)/4,A1];
const pol=(r,a)=>[OX+SC*r*Math.cos(a*DEG),OY-SC*r*Math.sin(a*DEG)];
function stairs({arcs=1,rad=1,arcLab=0}={}){
 let s='';
 for(let i=0;i<4;i++){
  const r=RS[i],a=AS[i],b=AS[i+1];
  const pts=Array.from({length:21},(_,k)=>pol(r,mix(a,b,k/20)));
  s+=fade(arcs,draw(pts,1,{color:'#b8c4d8',w:5}));
  if(i<3){const [x1,y1]=pol(r,b),[x2,y2]=pol(RS[i+1],b);s+=fade(rad,line(x1,y1,x2,y2,{color:EC,w:11,opacity:.35})+line(x1,y1,x2,y2,{color:EC,w:5}));}
 }
 if(arcLab){const [x,y]=pol(2.35,(AS[0]+AS[1])/2);s+=fade(arcLab*arcs,label('直角 → 0',x+6,y,{size:24,color:'#b8c4d8',weight:700}));}
 return s;
}
// ---- 導体球 ----
const BX=250,BY=300,BR=150;
function ball({g=1,inE=0,outE=0,e0=0,lab=1}={}){
 let s='';
 if(outE)for(let i=0;i<12;i++){const a=2*Math.PI*i/12+.13,c=Math.cos(a),si=Math.sin(a);s+=fade(outE,arrow(BX+(BR+12)*c,BY+(BR+12)*si,BX+(BR+70)*c,BY+(BR+70)*si,{color:EC,w:3.5,head:12}));}
 s+=`<circle cx="${BX}" cy="${BY}" r="${BR}" fill="#1a2233" stroke="#b8c4d8" stroke-width="4"/>`;
 if(lab)s+=label('2 nC',BX+BR*.72,BY-BR*.82,{size:26,color:RED,weight:700});
 s+=inE;
 if(e0)s+=fade(e0,label('E＝0',BX,BY+12,{size:34,color:EC,anchor:'middle',weight:700}));
 return fade(g,s);
}
// グラフ：横 r（0〜0.4 m）、縦 V（0〜200 V）
const GX=560,GY=330,GW=500,GH=220,RX=r=>GX+GW*r/.4,VY=v=>GY-GH*v/200,KQ=17.98;
function vgraph({g=1,curve=1,pts=0,join=0,vals=0,slope0=0}={}){
 let s=line(GX,GY,GX+GW+16,GY,{color:C.dim,w:2.5})+line(GX,GY,GX,GY-GH-16,{color:C.dim,w:2.5});
 for(const r of [.1,.2,.3,.4])s+=line(RX(r),GY,RX(r),GY+8,{color:C.dim,w:2})+label(String(r),RX(r),GY+32,{size:22,color:C.dim,anchor:'middle'});
 for(const v of [50,100,150,200])s+=line(GX-8,VY(v),GX,VY(v),{color:C.dim,w:2})+label(String(v),GX-12,VY(v)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('r [m]',GX+GW+24,GY+8,{size:24,color:C.dim})+label('V [V]',GX,GY-GH-28,{size:24,color:VC,anchor:'middle',weight:700});
 const pts0=[[RX(0),VY(KQ/.1)],[RX(.1),VY(KQ/.1)],...Array.from({length:60},(_,i)=>{const r=.1+.3*(i+1)/60;return [RX(r),VY(KQ/r)];})];
 s+=draw(pts0,curve,{color:VC,w:4.5});
 s+=fade(seg(curve,.3,.5),label('外：1/r',RX(.25),VY(KQ/.25)-14,{size:22,color:C.dim}));
 if(pts)s+=fade(pts,dot(RX(0),VY(179.8),8,HI)+dot(RX(.1),VY(179.8),8,HI)+label('中心',RX(0)+6,VY(179.8)+34,{size:22,color:HI,weight:700})+label('表面',RX(.1),VY(179.8)+34,{size:22,color:HI,anchor:'middle',weight:700}));
 if(join)s+=fade(join,line(RX(0),VY(179.8),RX(.1),VY(179.8),{color:HI,w:5}));
 if(vals)s+=fade(vals,label('180 V',RX(.1)+16,VY(179.8)-14,{size:26,color:VC,weight:700}));
 if(slope0)s+=fade(slope0,label('傾き 0 → E＝0',RX(.01),VY(95),{size:26,color:HI,weight:700}));
 return fade(g,s);
}

export const ytQxUePotentialDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約3秒）：座標軸、原点の赤い点電荷「Q＝2 nC」、P と座標、各軸への点線。電場・電位・等電位面は出さない。
 [K+'q1']:(p)=>move(200,0,axes3({g:seg(p,0,.35)})+qDot(OX,OY,{g:seg(p,.25,.5),text:'Q＝2 nC',tx:-24,ty:8,anchor:'end'})+pointP({g:seg(p,.5,.75),dots:seg(p,.7,.95)})),
 // 小問2：P の横に青い丸「q＝−1 nC」、P から R（原点から 0.5 m）へくねった道が伸びて止まる。仕事・等電位面は出さない。
 [K+'q2']:(p)=>move(200,0,base3()+qDot(PP[0]+34,PP[1]+10,{sign:-1,g:seg(p,0,.25),text:'q＝−1 nC',tx:24,ty:8,anchor:'start'})
  +draw(wig,seg(p,.25,.85),{color:GD,w:4})+fade(seg(p,.8,.95),dot(...RR,7,C.ink)+label('R',RR[0]-14,RR[1]-8,{size:26,color:C.ink,anchor:'end',weight:700}))),
 // 小問3：暗転して前の図を消し、導体球の断面と「2 nC」だけ。
 [K+'q3']:(p)=>move(350,-10,ball({g:seg(p,.1,.6)})),

 // ===================== 小問1 =====================
 [K+'intro']:(p)=>axes3({g:seg(p,0,.12)})+qDot(OX,OY,{g:seg(p,.08,.2),text:'Q＝2 nC',tx:-24,ty:8,anchor:'end'})+pointP({g:seg(p,.18,.35)})
  +fade(seg(p,.5,.65),panel(150,110,T(`kQ\\approx17.98\\ \\mathrm{V\\cdot m}`,PC,215,40))),
 [K+'goal1']:(p)=>{
  const [px,py]=PP;
  let s=base3();
  s+=fade(seg(p,.25,.45),line(px,py-6,px,py-86,{color:C.dim,w:3,dash:'6 6'})+line(px-10,py-74,px,py-90,{color:C.dim,w:3})+line(px+10,py-74,px,py-90,{color:C.dim,w:3})+label('?',px+14,py-60,{size:28,color:C.dim,weight:700}));
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 [K+'partial']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,[px,py]=PP;
  let s=base3({lockX:seg(p,b,b+.08),lockY:seg(p,b+.04,b+.12)});
  s+=fade(seg(p,b+.15,b+.25),arrow(px,py,px,py-60,{color:GD,w:6,head:14})+label('z 方向の 一歩',px,py-74,{size:22,color:GD,anchor:'middle',weight:700}));
  s+=panel(110,200,label('電位が 下がる 向き ＝ 電場の 向き',PC,155,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.22),T(`E_z=-\\dfrac{\\partial V}{\\partial z}`,PC,240,46,{color:C.ink})),seg(p,.03,.1));
  return s+goalTag(G1);
 },
 [K+'dist']:(p)=>{
  const [px,py]=PP,[yx,yy]=P3([0,1.2,0]);
  let s=base3({dots:0});
  s+=sphere(2,{g:seg(p,.45,.7)});
  s+=fade(seg(p,.05,.2),line(OX,OY,yx,yy,{color:C.dim,w:4})+line(yx,yy,px,py,{color:C.dim,w:4})+label('1.2',(OX+yx)/2,yy+30,{size:24,color:C.dim,anchor:'middle',weight:700})+label('1.6',yx+12,(yy+py)/2+8,{size:24,color:C.dim,weight:700}));
  s+=fade(seg(p,.2,.35),line(OX,OY,px,py,{color:C.ink,w:4})+label('r＝2 m',(OX+px)/2-18,(OY+py)/2-6,{size:26,color:C.ink,anchor:'end',weight:700}));
  s+=panel(110,200,T(`r=\\sqrt{1.2^2+1.6^2}`,PC,190,38)+fade(seg(p,.25,.4),T(`=\\sqrt{4}=2\\ \\mathrm{m}`,PC,265,38)),seg(p,.03,.1));
  s+=fade(seg(p,.6,.75),label('紫：P を 通る 等電位面',PC,380,{size:24,color:VC,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 行5（2026-10-16 PQ-022 で2 cue に）【式だけの画面】
 // 5a. r＝√(x²＋y²＋z²)。2文目で x・y を止め、∂r/∂z＝2z/(2√…)＝z/r を一段ずつ（z/r を黄の枠）
 [K+'chainR']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,c1='#7fd4ff';
  let s=label('距離',300,150,{size:26,color:C.dim,anchor:'middle',weight:700})+T(`r=\\sqrt{x^2+y^2+z^2}`,640,150,42);
  s+=fade(seg(p,b,b+.06),label('x・y を 止めて、z だけ 動かす',600,235,{size:26,color:UC,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.1,b+.2),T(`\\dfrac{\\partial r}{\\partial z}=\\dfrac{2z}{2\\sqrt{x^2+y^2+z^2}}`,560,320,40));
  s+=fade(seg(p,b+.3,b+.4),T(`=${cs(c1,'\\dfrac{z}{r}')}`,600,445,46)+highlight(535,372,140,130,1,HI));
  return s+goalTag(G1);
 },
 // 5b. V＝kQ/r。r で微分した −kQ/r²（橙）に、z で動かしたときの z/r（水色）を掛けて、∂V/∂z＝−kQz/r³
 [K+'chain']:(p)=>{
  const c1='#7fd4ff',c2='#ffb36b';
  let s=T(`V=\\dfrac{kQ}{r}`,600,140,42);
  s+=fade(seg(p,.12,.25),label('r で 微分',330,215,{size:24,color:c2,anchor:'middle',weight:700})+T(`\\dfrac{dV}{dr}=${cs(c2,'-\\dfrac{kQ}{r^2}')}`,330,300,38));
  s+=fade(seg(p,.28,.4),label('z で 動かすと',870,215,{size:24,color:c1,anchor:'middle',weight:700})+T(`\\dfrac{\\partial r}{\\partial z}=${cs(c1,'\\dfrac{z}{r}')}`,870,300,38));
  s+=fade(seg(p,.45,.6),T(`\\dfrac{\\partial V}{\\partial z}=${cs(c2,'\\left(-\\dfrac{kQ}{r^2}\\right)')}\\times${cs(c1,'\\dfrac{z}{r}')}=-\\dfrac{kQz}{r^3}`,600,430,42));
  return s+goalTag(G1);
 },
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,cA=1-seg(p,b-.03,b),cB=seg(p,b-.01,b+.04),[px,py]=PP;
  let a=T(`\\dfrac{\\partial V}{\\partial z}=-\\dfrac{kQz}{r^3}=-\\dfrac{17.98\\times1.6}{${cs(HI,'8')}}`,600,200,44);
  a+=fade(seg(p,.05,.15),label('r³ ＝ 2³ ＝ 8',930,300,{size:28,color:HI,weight:700}));
  a+=fade(seg(p,.15,.3),T(`=-3.596`,600,340,44));
  let s=fade(cA,a);
  let f=base3({dots:0,coords:0})+sphere(2,{fo:.06})+label('P',PP[0]-14,PP[1]+28,{size:26,color:C.ink,anchor:'end',weight:700});
  f+=fade(seg(p,b+.05,b+.15),arrow(px,py,px,py-79,{color:EC,w:6,head:16})+label('3.60 V/m',px+14,py-50,{size:26,color:EC,weight:700}));
  f+=panel(140,150,label('負号を 付けて',PC,190,{size:24,color:C.dim,anchor:'middle'})+T(`E_z=-\\dfrac{\\partial V}{\\partial z}\\approx3.60\\ \\mathrm{V/m}`,PC,255,36,{color:EC}),seg(p,b,b+.06));
  s+=fade(cB,f);
  return s+goalTag(G1)+ANS1(seg(p,b+.3,b+.38));
 },
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,[px,py]=PP;
  let s=base3({dots:0,coords:0})+sphere(2,{fo:.06})+label('P',px-14,py+28,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=arrow(px,py,px,py-79,{color:EC,w:4,head:12})+label('3.60',px-10,py-40,{size:22,color:EC,anchor:'end',weight:700});
  s+=fade(seg(p,b,b+.1),arrow(px,py,px+59,py,{color:EC,w:4,head:12})+label('2.70',px+30,py+28,{size:22,color:EC,anchor:'middle',weight:700})
   +line(px+59,py,px+59,py-79,{color:C.dim,w:2,dash:'4 5'})+line(px,py-79,px+59,py-79,{color:C.dim,w:2,dash:'4 5'})
   +arrow(px,py,px+59,py-79,{color:EC,w:7,head:18})+label('4.50',px+70,py-70,{size:26,color:EC,weight:700})+label('z 成分 ではない',px+70,py-38,{size:24,color:NG,weight:700}));
  s+=wrongSeq(p,ctx,[['A','−3.60 V/m','負号の 付け忘れ'],['B','4.50 V/m','大きさを 答えた']],{opts:{...WOPT,y:200}});
  return s+goalTag(G1)+ANS1(1);
 },
 // 行8【式とカード】r³ の 3 に黄の丸
 [K+'wrong1d']:(p)=>{
  const f=`\\dfrac{\\partial V}{\\partial z}=-\\dfrac{kQz}{r^{${cs(HI,'3')}}}`,w=texWidth(f,52,false);
  let s=T(f,600,190,52);
  s+=fade(seg(p,.15,.3),ring(600+w/2-44,196,22,{color:HI,w:4}));
  s+=wrongCard('D','7.19','分母を r² に した（単位 V）',{x:250,w:700,y:320,g:seg(p,.05,.15)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>base3()+qDot(PP[0]+34,PP[1]+10,{sign:-1,g:seg(p,.05,.2),text:'−1 nC',tx:24,ty:8,anchor:'start'})
  +draw(wig,seg(p,.15,.55),{color:GD,w:4})+fade(seg(p,.5,.6),dot(...RR,7,C.ink)+label('R',RR[0]-14,RR[1]-8,{size:26,color:C.ink,anchor:'end',weight:700}))
  +goalTag(G2,{g:seg(p,.03,.15)}),
 [K+'stairs']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=axes3({g:.6})+qDot(OX,OY,{});
  s+=fade(1-seg(p,.1,.25),draw(wig,1,{color:GD,w:4}));
  s+=fade(seg(p,.15,.3),stairs({arcs:1-seg(p,b+.4,b+.55),rad:1,arcLab:seg(p,b+.05,b+.15)}));
  s+=dot(...PP,8,C.ink)+label('P',PP[0]+14,PP[1]-10,{size:26,color:C.ink,weight:700})+dot(...RR,7,C.ink)+label('R',RR[0]-14,RR[1]-8,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=panel(110,170,fade(seg(p,.15,.25),label('半径方向の 段（水色）',PC,165,{size:26,color:EC,anchor:'middle',weight:700}))
   +fade(seg(p,.25,.35),label('球面に 沿う 段（灰）',PC,225,{size:26,color:'#b8c4d8',anchor:'middle',weight:700})),seg(p,.1,.18));
  return s+goalTag(G2);
 },
 [K+'radial']:(p)=>{
  let s=axes3({g:.6})+qDot(OX,OY,{});
  s+=stairs({arcs:0,rad:1});
  s+=sphere(2,{g:seg(p,.15,.35),fo:.05,dash:'8 6'})+sphere(.5,{g:seg(p,.25,.45),fo:.05,dash:'6 5'});
  s+=dot(...PP,8,C.ink)+label('P',PP[0]+14,PP[1]-10,{size:26,color:C.ink,weight:700})+dot(...RR,7,C.ink)+label('R',RR[0]-14,RR[1]-8,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=panel(110,200,label('効くのは 半径方向だけ',PC,165,{size:26,color:EC,anchor:'middle',weight:700})
   +fade(seg(p,.5,.62),label('→ 両端の 距離だけで 決まる',PC,225,{size:26,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.77),label('→ 電位で 計算できる',PC,280,{size:26,color:VC,anchor:'middle',weight:700})),1);
  return s+goalTag(G2);
 },
 [K+'pot2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=axes3({g:.6})+qDot(OX,OY,{});
  s+=stairs({arcs:0,rad:1})+sphere(2,{fo:.05,dash:'8 6'})+sphere(.5,{fo:.05,dash:'6 5'});
  s+=dot(...PP,8,C.ink)+label('P',PP[0]+14,PP[1]-10,{size:26,color:C.ink,weight:700})+dot(...RR,7,C.ink)+label('R',RR[0]-14,RR[1]-8,{size:26,color:C.ink,anchor:'end',weight:700});
  const [lx,ly]=pol(2,25);
  s+=fade(seg(p,.05,.15),label('8.99 V',lx+10,ly,{size:26,color:VC,weight:700}));
  s+=fade(seg(p,.3,.4),label('35.96 V',OX+30,OY+80,{size:26,color:VC,weight:700})+line(OX+40,OY+58,OX+28,OY+40,{color:VC,w:2}));
  s+=panel(110,250,T(`V(P)=\\dfrac{17.98}{2}=8.99\\ \\mathrm{V}`,PC,170,32,{color:VC})
   +fade(seg(p,.3,.4),T(`V(R)=\\dfrac{17.98}{0.5}=35.96\\ \\mathrm{V}`,PC,250,32,{color:VC}))
   +fade(seg(p,b,b+.1),T(`\\Delta V=${cs(HI,'+26.97\\ \\mathrm{V}')}`,PC,325,34)),1);
  return s+goalTag(G2);
 },
 // 行13【式だけの画面】符号を一つずつ
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=T(`W=-q\\,\\Delta V`,600,130,44,{color:UC});
  s+=fade(seg(p,.08,.2),T(`=${cs(NG,'-')}\\,(${cs(BLUE,'-1\\times10^{-9}')})\\times(${cs(HI,'+26.97')})`,600,220,42));
  s+=fade(seg(p,.22,.32),label('（−）×（−）×（＋）→ ＋',600,300,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.47),T(`\\approx${cs(UC,'+2.70\\times10^{-8}\\ \\mathrm{J}')}`,600,390,46));
  return s+goalTag(G2)+ANS2(seg(p,b,b+.08));
 },
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.45,wB=[0,m],wC=[m,W[0][1]],wD=[W[1]?W[1][0]:.6,1];
  let s=axes3({g:.6})+qDot(OX,OY,{});
  s+=stairs({arcs:0,rad:1})+sphere(2,{fo:.05,dash:'8 6'})+sphere(.5,{fo:.05,dash:'6 5'});
  s+=dot(...PP,8,C.ink)+label('P',PP[0]+14,PP[1]-10,{size:26,color:C.ink,weight:700})+dot(...RR,7,C.ink)+label('R',RR[0]-14,RR[1]-8,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=wrongSeq(p,ctx,[['B','−2.70×10⁻⁸ J','W＝−qΔV の 負号を 落とした'],['C','6.74×10⁻⁸','kQ/r² の 差を 使った（単位 N）'],['D','求められない','道に よらない ことを 使っていない']],{win:[wB,wC,wD],opts:{...WOPT,y:150}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>ball({g:seg(p,0,.25)})+goalTag(G3,{g:seg(p,.03,.15)}),
 [K+'inside']:(p,ctx)=>{
  const t=cueT(ctx),u=seg(p,.05,.25),gone=seg(p,.3,.42);
  let inn=fade(u*(1-gone),arrow(BX-70,BY-40,BX+70,BY-40,{color:EC,w:6,head:16})+label('もし 電場が 残ると',BX,BY-70,{size:22,color:EC,anchor:'middle',weight:700}));
  const ex=BX+40-110*seg(p,.12,.36);
  inn+=fade(u*(1-seg(p,.4,.5)),qDot(ex,BY+40,{sign:-1,r:14})+arrow(ex-20,BY+40,ex-60,BY+40,{color:BLUE,w:3,head:10}));
  inn+=fade(seg(p,.2,.3)*(1-gone),label('電子が 動き 続ける',BX,BY+100,{size:22,color:BLUE,anchor:'middle',weight:700}));
  let s=ball({inE:inn,e0:seg(p,.45,.6),outE:seg(p,.6,.8)});
  s+=fade(seg(p,.45,.6),panel(150,150,label('静電平衡',PC,200,{size:26,color:C.dim,anchor:'middle'})+label('中の 電場 ＝ 0',PC,255,{size:30,color:EC,anchor:'middle',weight:700}),1));
  return s+goalTag(G3);
 },
 [K+'flat']:(p)=>ball({e0:1,outE:1})+vgraph({g:seg(p,.05,.15),curve:seg(p,.1,.4),pts:seg(p,.45,.55),join:seg(p,.55,.7)})+goalTag(G3),
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=ball({e0:1,outE:1})+vgraph({pts:1,join:1,vals:seg(p,.1,.25)});
  s+=fade(seg(p,.05,.2),card(GX-40,385,560,110,T(`V=\\dfrac{17.98}{0.10}\\approx180\\ \\mathrm{V}`,GX+240,445,34,{color:VC}),1));
  return s+goalTag(G3)+ANS3(seg(p,b+.15,b+.23));
 },
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.45,wA=[0,m],wB=[m,W[0][1]],wD=[W[1]?W[1][0]:.6,1];
  let s=ball({e0:1,outE:1})+vgraph({pts:1,join:1,vals:1});
  s+=wrongSeq(p,ctx,[['A','電場 0、電位 0','電位一定 と 電位 0 の 混同'],['B','1800 V/m、180 V','表面の 1800 V/m が 中まで 続くと した'],['D','1800 V/m、電位 0','電場も 電位も 取り違え']],{win:[wA,wB,wD],opts:{x:470,w:710,y:395,size:26,whySize:22}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,out=seg(p,0,.08);
  let s=fade(1-out,ball({e0:1,outE:1}));
  s+=move(-300*out,0,vgraph({pts:1,join:1,vals:1,slope0:seg(p,.08,.2)}));
  s+=fade(seg(p,.1,.22),card(820,110,360,200,label('電場 0',1000,160,{size:28,color:EC,anchor:'middle',weight:700})+label('＝ 電位が 変わらない',1000,215,{size:26,color:C.ink,anchor:'middle',weight:700})+label('≠ 電位 0',1000,265,{size:26,color:NG,anchor:'middle',weight:700}),1,EC));
  s+=fade(seg(p,b,b+.1),T(`\\mathbf{E}=-\\nabla V`,600,450,48,{color:EC}));
  return s;
 },
};
