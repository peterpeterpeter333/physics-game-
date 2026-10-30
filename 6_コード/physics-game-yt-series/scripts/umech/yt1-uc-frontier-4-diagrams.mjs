// YouTube シリーズ「慣性力と軌道・上級 4/4」(ys-uc-frontier-4) — 図。Stage 1200×515.
// 軌道 r＝p/(1＋e cosθ) は、太陽（焦点）を原点に、θ は x 軸から反時計回り。θ＝0（一番近い点）が右、θ＝π（一番遠い点）が左。
// 色：r 水色、u 青緑、θ 橙、e 桃、p 黄、太陽 金。電磁気の予告：電場 𝐄 水色、道の一歩 黄。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly} from './anim.mjs';

const K='uc-frontier-4:';
const SUN='#ffcf67',CR=C.x,CU='#7fe0c8',CANG=C.E,CE=C.p,CP=C.hi,CH=C.hi;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const top=(t='真上から見た図')=>label(t,30,40,{size:22,color:C.dim});
const u=cs(CU,'u'),h=cs(CH,'h'),th='\\theta',ee=cs(CE,'e'),pp=cs(CP,'p');
const D=(a,b='t')=>`\\dfrac{d${a}}{d${b}}`,DD=(a,b='t')=>`\\dfrac{d^2${a}}{d${b}^2}`;
const sun=(x,y,r=14)=>dot(x,y,r,SUN);
const planet=(x,y,r=10)=>dot(x,y,r,C.x)+ring(x,y,r,{color:C.ink,w:2});
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function rows(list,p,{x=600,y0=110,dy=110,size=40}={}){return list.map(([s,a,o={}],i)=>fade(a==null?1:seg(p,a,a+.12),T(s,o.x??x,o.y??(y0+i*dy),{size:o.size??size,opacity:o.dim?.45:1}))).join('');}
const note=(s,x,y,g=1,color=C.hi,size=26)=>fade(g,L(s,x,y,{size,color,weight:700}));

// ---- conic: r = p/(1+e cos th) around the sun at (sx,sy), S px per unit ---------------------------------
function conicPts(e,{sx,sy,S,p=1,th0=-Math.PI,th1=Math.PI,n=240,box=[0,40,1200,515]}){
 const pts=[];for(let i=0;i<=n;i++){const t=th0+(th1-th0)*i/n,d=1+e*Math.cos(t);if(d<=0.02)continue;const r=p/d;const x=sx+S*r*Math.cos(t),y=sy-S*r*Math.sin(t);if(x<box[0]||x>box[2]||y<box[1]||y>box[3])continue;pts.push([x,y]);}
 return pts;
}
function conic(e,o,{color=CR,w=3,p=1,prog=1,dash=''}={}){return draw(conicPts(e,{...o,th0:o.th0??-Math.PI,th1:o.th1??Math.PI}),prog,{color,w,dash});}
const OR={sx:430,sy:275,S:150};
function orbitAt(th,o=OR,e=.5){const r=1/(1+e*Math.cos(th));return [o.sx+o.S*r*Math.cos(th),o.sy-o.S*r*Math.sin(th),r];}
function orbitFig(p,{e=.5,o=OR,progress=1,planetTh=null,rline=1,axis=1}={}){
 let s='';
 if(axis)s+=line(o.sx-2.3*o.S,o.sy,o.sx+1.1*o.S,o.sy,{color:C.faint,w:1.5,dash:'4 6'});
 s+=conic(e,{...o,th0:0,th1:2*Math.PI},{prog:progress});
 s+=sun(o.sx,o.sy);
 if(planetTh!=null){const [x,y]=orbitAt(planetTh,o,e);if(rline)s+=line(o.sx,o.sy,x,y,{color:CR,w:2.5,opacity:.8});s+=planet(x,y);}
 return s;
}
// u–θ wave (small)
function wave(p,{x0=70,y0=270,w=420,hA=70,mark=null}={}){
 const X=q=>x0+w*q/(2*Math.PI),Y=v=>y0-hA*v;
 let s=arrow(x0-10,y0+hA*2,x0+w+30,y0+hA*2,{color:C.dim,w:2,head:12})+label('θ',x0+w+36,y0+hA*2+8,{size:24,color:CANG});
 s+=arrow(x0,y0+hA*2+10,x0,y0-hA*2,{color:C.dim,w:2,head:12})+T(u,x0,y0-hA*2-22,{size:28});
 s+=line(x0,y0,x0+w,y0,{color:CH,w:2,dash:'7 6'});
 s+=draw(Array.from({length:121},(_,i)=>{const q=2*Math.PI*i/120;return [X(q),Y(Math.cos(q))];}),clamp(p),{color:CU,w:4});
 [[0,'0'],[Math.PI,'π'],[2*Math.PI,'2π']].forEach(([q,t])=>{s+=label(t,X(q),y0+hA*2+30,{size:22,color:C.dim,anchor:'middle'});});
 if(mark!=null)s+=dot(X(mark),Y(Math.cos(mark)),9,C.hi);
 return {svg:s,X,Y};
}

export const ytUcFrontier4Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  const W=wave(seg(p,.05,.6));let s=W.svg;
  s+=card(620,90,550,330,L('前回の 最後の 問い',895,140,{size:24,color:C.dim})+L('u が θ について cos で 揺れると',895,215,{size:28,color:CU,weight:700})
   +fade(seg(p,.4,.55),L('r は どんな 曲線？',895,310,{size:38,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'recall']:(p)=>rows([[`w=${u}-\\dfrac{GM}{${h}^2}`,0,{y:140,size:48}],[`${DD('w',th)}=-w`,.35,{y:320,size:56}]],p)+note('前回（3/4）の 結果',600,50,1,C.dim,24),
 [K+'predict']:(p)=>{
  let s=card(150,80,900,340,L('u が cos で 揺れるとき、軌道は？',600,150,{size:30,weight:700}),seg(p,.02,.12),C.hi);
  ['円','楕円','別の 形'].forEach((t,i)=>{s+=fade(seg(p,.2+i*.12,.32+i*.12),rect(220+i*270,220,220,120,{fill:'#1b2a4a',fo:.9,stroke:C.faint,sw:2,rx:12})+L(t,330+i*270,292,{size:34,weight:700}));});
  s+=fade(seg(p,.7,.8),L('？',600,400,{size:30,color:C.hi,weight:700}));
  return s;
 },
 // ===== S2 解を書く =====
 [K+'sol']:(p)=>{
  let s=rows([[`${DD('w',th)}=-w`,0,{y:90,size:44}],[`w=A\\cos(\\theta-\\alpha)`,.15,{y:200,size:48}]],p);
  s+=fade(seg(p,.5,.62),T(`\\cos\\ \\xrightarrow{\\ \\ }\\ -\\sin\\ \\xrightarrow{\\ \\ }\\ -\\cos`,600,330,{size:44}));
  s+=fade(seg(p,.5,.62),L('1回 微分',500,290,{size:22,color:C.dim})+L('2回目',705,290,{size:22,color:C.dim}));
  s+=fade(seg(p,.7,.82),L('元の −1 倍に 戻る',600,440,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'phase']:(p)=>{
  const W=wave(1,{mark:0});let s=W.svg;
  s+=fade(seg(p,.3,.45),L('u が 最大 ＝ r が 最小',W.X(0)+20,W.Y(1)-24,{size:22,color:C.hi,weight:700,anchor:'start'}));
  s+=card(620,110,550,290,L('角度の 測り始めは 自由',895,165,{size:28,weight:700})+L('r が 一番 小さい 向きを θ ＝ 0',895,235,{size:26,color:CANG,weight:700})
   +fade(seg(p,.5,.65),T(`w=A\\cos\\theta`,895,330,{size:46})),seg(p,.02,.12));
  return s;
 },
 [K+'u']:(p)=>rows([[`${u}=\\dfrac{GM}{${h}^2}+A\\cos\\theta`,0,{y:110,size:46}],[`${u}=\\dfrac{GM}{${h}^2}\\left(1+${ee}\\cos\\theta\\right)`,.45,{y:300,size:50}]],p)+note('GM/h² で くくる',600,205,seg(p,.3,.42)),
 [K+'e']:(p)=>{
  let s=T(`${u}=\\dfrac{GM}{${h}^2}\\left(1+${ee}\\cos\\theta\\right)`,600,90,{size:40,opacity:.6});
  s+=T(`${ee}=\\dfrac{A\\,${h}^2}{GM}`,600,240,{size:56});
  s+=fade(seg(p,.4,.55),L('揺れの 大きさを 表す、単位の ない 数',600,360,{size:28,weight:700})+L('離心率',600,430,{size:38,color:CE,weight:700}));
  return s;
 },
 [K+'r']:(p)=>rows([[`${u}=\\dfrac{GM}{${h}^2}\\left(1+${ee}\\cos\\theta\\right)`,0,{y:100,size:40,dim:1}],[`r=\\dfrac{1}{${u}}=\\dfrac{${h}^2/GM}{1+${ee}\\cos\\theta}`,.3,{y:290,size:54}]],p)+note('逆数を 取る',600,190,seg(p,.15,.28)),
 [K+'p']:(p)=>{
  let s=T(`${pp}=\\dfrac{${h}^2}{GM}`,300,150,{size:48});
  s+=fade(seg(p,.15,.3),T(`r=\\dfrac{${pp}}{1+${ee}\\cos\\theta}`,800,150,{size:56}));
  s+=fade(seg(p,.25,.4),rect(595,60,410,185,{fill:C.hi,fo:.05,stroke:C.hi,sw:2.5,rx:12}));
  s+=fade(seg(p,.55,.7),T(`\\theta=90^\\circ:\\ \\cos\\theta=0\\ \\Rightarrow\\ r=${pp}`,600,330,{size:42}));
  s+=fade(seg(p,.7,.82),L('p は 長さ（太陽の 真上の 距離）',600,440,{size:28,color:CP,weight:700}));
  return s;
 },
 // ===== S3 数で描く =====
 [K+'n1']:(p)=>{
  let s=top('p ＝ 1、e ＝ 0.5')+orbitFig(p,{progress:0,planetTh:0});
  const [x,y]=orbitAt(0);s+=fade(seg(p,.5,.62),L('0.667',(OR.sx+x)/2,y+36,{size:24,color:CR,weight:700}));
  s+=card(720,90,450,330,L('θ ＝ 0',945,140,{size:28,color:CANG,weight:700})+T(`r=\\dfrac{1}{1+0.5}=\\dfrac{1}{1.5}`,945,240,{size:40})+fade(seg(p,.5,.62),T(`\\approx 0.667`,945,350,{size:44})),seg(p,.02,.12));
  return s;
 },
 [K+'n2']:(p)=>{
  let s=top('p ＝ 1、e ＝ 0.5')+orbitFig(p,{progress:0});
  const P0=orbitAt(0),P1=orbitAt(Math.PI/2),P2=orbitAt(Math.PI);
  s+=planet(P0[0],P0[1],8)+line(OR.sx,OR.sy,P0[0],P0[1],{color:CR,w:2.5});
  s+=fade(seg(p,.05,.2),line(OR.sx,OR.sy,P1[0],P1[1],{color:CR,w:2.5})+planet(P1[0],P1[1],8)+L('1',OR.sx+16,(OR.sy+P1[1])/2,{size:24,color:CR,weight:700,anchor:'start'}));
  s+=fade(seg(p,.45,.6),line(OR.sx,OR.sy,P2[0],P2[1],{color:CR,w:2.5})+planet(P2[0],P2[1],8)+L('2',(OR.sx+P2[0])/2,OR.sy+32,{size:24,color:CR,weight:700}));
  s+=card(720,90,450,330,L('θ ＝ 90°：r ＝ 1',945,160,{size:30,weight:700})+fade(seg(p,.45,.6),L('θ ＝ 180°',945,240,{size:28,color:CANG,weight:700})+T(`r=\\dfrac{1}{1-0.5}=2`,945,330,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'link']:(p)=>linkFig(p,0),
 [K+'closed']:(p)=>linkFig(p,1),
 [K+'ell1']:(p)=>ellFig(p,1),
 [K+'ell2']:(p)=>ellFig(p,2),
 [K+'ell3']:(p)=>ellFig(p,3),
 [K+'ell4']:(p)=>ellFig(p,4),
 [K+'ell5']:(p)=>ellFig(p,5),
 [K+'ell6']:(p)=>{
  let s=top('p ＝ 1、e ＝ 0.5')+orbitFig(p,{planetTh:2*Math.PI*p});
  const ths=[0,1.05,Math.PI/2,2.2,Math.PI,4,5.2];ths.forEach((t,i)=>{const [x,y]=orbitAt(t);s+=fade(seg(p,.05+i*.06,.12+i*.06),ring(x,y,9,{color:C.hi,w:3}));});
  s+=card(720,90,450,330,L('どの 角度の 点も 楕円に 乗る',945,150,{size:26,weight:700})+L('（一般の 証明は 省略）',945,200,{size:22,color:C.dim})
   +fade(seg(p,.45,.6),T(`r=\\dfrac{${pp}}{1+${ee}\\cos\\theta}`,945,290,{size:44})+L('太陽を 焦点と する 楕円',945,385,{size:28,color:CR,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'law1']:(p)=>{
  let s=top()+orbitFig(p,{planetTh:2*Math.PI*p});
  s+=card(720,90,450,330,L('ケプラーの 第1法則',945,150,{size:32,color:C.hi,weight:700})+L('運動方程式 ＋ 万有引力',945,240,{size:28,weight:700})+L('から 導いた',945,300,{size:28,color:C.F,weight:700}),seg(p,.02,.12),C.hi);
  return s;
 },
 // ===== S4 e で形が変わる =====
 [K+'e0']:(p)=>famFig(p,[0]),
 [K+'e09']:(p)=>famFig(p,[0,.5,.9],1),
 [K+'e1']:(p)=>famFig(p,[0,.5,.9,1],2),
 [K+'e12']:(p)=>famFig(p,[0,.5,.9,1,1.2],3),
 [K+'energy']:(p)=>energyFig(p,0),
 [K+'energy2']:(p)=>energyFig(p,1),
 // ===== S5 地球 =====
 [K+'earth']:(p)=>{
  const o={sx:300,sy:275,S:190},e=.0167;let s=top('地球の 軌道（実際の 比）')+conic(e,{...o,th0:0,th1:2*Math.PI})+sun(o.sx,o.sy);
  const P=orbitAt(2*Math.PI*p,o,e);s+=planet(P[0],P[1]);
  s+=card(640,110,530,290,L('地球の 軌道の 離心率',905,170,{size:28,weight:700})+T(`${ee}=0.0167`,905,260,{size:48})+L('ほとんど 円',905,350,{size:26,color:C.dim}),seg(p,.02,.12));
  return s;
 },
 [K+'ratio']:(p)=>rows([[`\\dfrac{${pp}/(1+${ee})}{${pp}/(1-${ee})}`,0,{y:150,size:50}],[`=\\dfrac{1-${ee}}{1+${ee}}`,.45,{y:330,size:54}]],p)+note('近い 点 ÷ 遠い 点',600,50,1,C.dim,24)+note('p が 消える',950,150,seg(p,.3,.42)),
 [K+'calc']:(p)=>rows([[`\\dfrac{1-0.0167}{1+0.0167}=\\dfrac{0.9833}{1.0167}`,0,{y:150,size:48}],[`\\approx 0.967`,.4,{y:330,size:56}]],p),
 [K+'obs']:(p)=>{
  let s=card(100,60,1000,150,L('理論（e ＝ 0.0167）',300,145,{size:26,color:C.dim})+T(`\\dfrac{1-${ee}}{1+${ee}}\\approx 0.967`,760,135,{size:44}),seg(p,0,.1));
  s+=card(100,260,1000,170,L('観測（×10¹¹ m）',300,355,{size:26,color:C.dim})+fade(seg(p,.1,.25),T(`\\dfrac{1.471}{1.521}\\approx 0.967`,760,345,{size:44})),seg(p,.05,.15),C.F);
  s+=fade(seg(p,.55,.7),L('一致',600,480,{size:34,color:C.F,weight:700}));
  return s;
 },
 [K+'small']:(p)=>{
  const o={sx:330,sy:275,S:190},e=.0167;let s=top('地球の 軌道（実際の 比）')+conic(e,{...o,th0:0,th1:2*Math.PI})+sun(o.sx,o.sy);
  const P0=orbitAt(0,o,e),P1=orbitAt(Math.PI,o,e);
  s+=line(o.sx,o.sy,P0[0],P0[1],{color:CR,w:3})+line(o.sx,o.sy,P1[0],P1[1],{color:CR,w:3})+planet(P0[0],P0[1],8)+planet(P1[0],P1[1],8);
  s+=L('近い 点',P0[0]-10,P0[1]+40,{size:22,color:C.hi})+L('遠い 点',P1[0]+20,P1[1]+40,{size:22,color:C.hi});
  s+=card(660,110,510,290,L('ほとんど 円',915,170,{size:30,weight:700})+fade(seg(p,.4,.55),L('それでも 距離は',915,250,{size:26})+L('約 3% 違う',915,320,{size:36,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 // ===== S6 =====
 [K+'three']:(p)=>{
  const list=[['第2法則','面積速度 一定','角運動量の 保存（2/4）'],['第3法則','T² ∝ r³','円の 軌道の 3行（1/4）'],['第1法則','楕円','u の 振動の 式の 解（4/4）']];
  let s=L('ケプラーの 3法則',600,55,{size:28,color:C.dim,weight:700});
  list.forEach(([a,b,c],i)=>{const x=60+i*370,g=seg(p,.05+i*.15,.17+i*.15);s+=fade(g,rect(x,100,340,320,{fill:'#131f38',fo:.96,stroke:C.hi,sw:2.5,rx:14})+L(a,x+170,165,{size:28,color:C.dim,weight:700})+L(b,x+170,240,{size:34,weight:700})+L(c,x+170,340,{size:22,color:C.F,weight:700}));});
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=card(60,80,330,300,L('ティコ',225,150,{size:30,weight:700})+L('約 20年の 観測',225,215,{size:24,color:C.dim}),seg(p,0,.1));
  s+=fade(seg(p,.1,.2),L('→',420,240,{size:40,color:C.dim}));
  s+=card(440,80,330,300,L('ケプラー',605,150,{size:30,weight:700})+L('3つの 規則',605,215,{size:24,color:C.dim}),seg(p,.1,.2));
  s+=fade(seg(p,.35,.45),L('←',800,240,{size:40,color:C.hi}));
  s+=card(820,80,330,300,L('1本の 力の 式',985,150,{size:28,color:C.F,weight:700})+tex('ma=F',985,235,{size:40})+T(`F=\\dfrac{GMm}{r^2}`,985,320,{size:34,color:C.F}),seg(p,.35,.45),C.F);
  s+=fade(seg(p,.6,.72),L('観測の 規則を、法則から 説明',600,450,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'frames']:(p)=>{
  let s=card(60,60,500,330,L('地上・太陽に 固定（慣性系）',310,110,{size:24,color:C.dim})+tex('ma=F',310,210,{size:46})+L('遠心力は 入れない',310,300,{size:24,color:C.dim}),seg(p,0,.1));
  s+=card(640,60,500,330,L('回る 観測者',890,110,{size:24,color:C.dim})+L('＋ 遠心力',890,200,{size:30,color:C.F,weight:700})+L('＋ コリオリ力',890,260,{size:30,color:C.F,weight:700})+L('（慣性力：相手 なし）',890,320,{size:22,color:C.dim}),seg(p,0,.1));
  s+=fade(seg(p,.55,.7),L('どの 観測者の 式かを 先に 決める',600,450,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'close']:(p)=>{
  let s=top()+orbitFig(p,{planetTh:2*Math.PI*p,rline:0});
  s+=card(720,90,450,330,L('力学',945,150,{size:28,color:C.dim})+tex('ma=F',945,240,{size:48})+L('1本 から 惑星の 軌道 まで',945,340,{size:26,color:C.hi,weight:700}),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  // curved path with steps in a field (left) and a surface with flux (right)
  let s=label('電磁気へ',30,40,{size:22,color:C.dim});
  for(let i=0;i<5;i++){const y=110+i*70;s+=arrow(40,y,500,y-40,{color:C.x,w:2,head:11,opacity:.45});}
  const path=Array.from({length:41},(_,i)=>{const q=i/40;return [80+380*q,420-260*q+70*Math.sin(Math.PI*q*1.6)];});
  s+=draw(path,seg(p,.05,.4),{color:C.hi,w:4});
  [8,18,28].forEach((k,i)=>{const [x1,y1]=path[k],[x2,y2]=path[k+4];s+=fade(seg(p,.3+i*.05,.4+i*.05),arrow(x1,y1,x2,y2,{color:C.hi,w:5,head:13}));});
  s+=fade(seg(p,.15,.3),L('曲がった 道で 電場が する 仕事',280,480,{size:24,color:C.hi,weight:700}));
  const sp=[[700,170],[900,120],[960,330],[760,380]];
  s+=fade(seg(p,.35,.5),poly(sp,{fill:C.x,fo:.12,stroke:C.x,sw:2.5})+[0,1,2].map(i=>arrow(760+i*70,330-i*55,880+i*70,250-i*55,{color:C.x,w:4,head:13})).join(''));
  s+=fade(seg(p,.4,.55),L('面を 貫く 電気束',840,450,{size:24,color:C.x,weight:700}));
  s+=card(1000,140,180,220,L('目盛りを',1090,215,{size:24,weight:700})+L('付けて',1090,260,{size:24,weight:700})+L('計算？',1090,310,{size:28,color:C.hi,weight:700}),seg(p,.6,.72),C.hi);
  return s;
 },
};

// ---- link between u-wave and orbit ----------------------------------------------------------------------
function linkFig(p,mode){
 const th=mode?2*Math.PI*seg(p,.05,.85):Math.PI*seg(p,.1,.7);
 const W=wave(1,{x0:60,w:400,hA:60,mark:th});let s=W.svg;
 s+=fade(.9,L('山',W.X(0)+22,W.Y(1)-14,{size:22,color:C.hi,anchor:'start'})+L('谷',W.X(Math.PI),W.Y(-1)+34,{size:22,color:C.hi}));
 const o={sx:960,sy:270,S:140};
 s+=conic(.5,{...o,th0:0,th1:mode?th:2*Math.PI},{color:CR,w:3})+sun(o.sx,o.sy);
 const [x,y]=orbitAt(th,o,.5);s+=line(o.sx,o.sy,x,y,{color:CR,w:2})+dot(x,y,9,C.hi);
 const [nx,ny]=orbitAt(0,o,.5),[fx,fy]=orbitAt(Math.PI,o,.5);
 s+=L('一番 近い',nx-14,ny-16,{size:22,color:C.hi,weight:700,anchor:'end'})+L('一番 遠い',fx+14,fy-16,{size:22,color:C.hi,weight:700,anchor:'start'});
 if(mode)s+=fade(seg(p,.6,.75),L('2π で 元に 戻る → 閉じた 曲線',600,490,{size:26,color:C.hi,weight:700}));
 else s+=fade(seg(p,.3,.45),L('u 大 ＝ r 小',600,490,{size:26,color:CU,weight:700}));
 return s;
}
// ---- ellipse check (p=1, e=0.5): sun at origin, a=4/3, center (-2/3,0), b^2=4/3 ----------------------------
function ellFig(p,step){
 const o={sx:470,sy:290,S:150},a=4/3,b=Math.sqrt(4/3),cx=o.sx-o.S*2/3;
 let s=top('p ＝ 1、e ＝ 0.5')+line(o.sx-2.3*o.S,o.sy,o.sx+1.1*o.S,o.sy,{color:C.faint,w:1.5,dash:'4 6'})+conic(.5,{...o,th0:0,th1:2*Math.PI})+sun(o.sx,o.sy)+L('太陽',o.sx,o.sy-24,{size:20,color:SUN});
 const near=o.sx+o.S*2/3,far=o.sx-o.S*2;
 s+=dot(near,o.sy,7,C.hi)+dot(far,o.sy,7,C.hi);
 if(step>=1)s+=fade(step===1?seg(p,.1,.25):1,line(far,o.sy+60,near,o.sy+60,{color:C.hi,w:2.5})+L('0.667 ＋ 2',(far+near)/2,o.sy+92,{size:22,color:C.hi}));
 if(step>=2)s+=fade(step===2?seg(p,.1,.25):1,dot(cx,o.sy,8,C.ink)+L('中心',cx,o.sy-16,{size:20})+line(cx,o.sy+30,o.sx,o.sy+30,{color:C.p,w:3})+L('2/3',(cx+o.sx)/2,o.sy+56,{size:22,color:C.p,weight:700}));
 if(step>=3)s+=fade(step===3?seg(p,.1,.25):1,line(cx,o.sy,cx,o.sy-o.S*b,{color:C.v,w:3})+L('b',cx-18,o.sy-o.S*b/2,{size:24,color:C.v,weight:700}));
 if(step>=4){const P=orbitAt(Math.PI/2,o,.5);s+=fade(step===4?seg(p,.1,.25):1,line(o.sx,o.sy,P[0],P[1],{color:CR,w:3})+dot(P[0],P[1],9,C.hi)+L('1',o.sx+14,(o.sy+P[1])/2,{size:24,color:CR,weight:700,anchor:'start'})+line(cx,P[1],P[0],P[1],{color:C.p,w:2,dash:'5 5'}));}
 let c='';
 if(step===1)c=L('長半径 a',945,150,{size:28,weight:700})+T(`a=\\dfrac{0.667+2}{2}=\\dfrac43`,945,260,{size:42});
 if(step===2)c=L('中心の ずれ',945,150,{size:28,weight:700})+T(`2-\\dfrac43=\\dfrac23`,945,260,{size:44})+L('（遠い 点の 側へ）',945,350,{size:24,color:C.dim});
 if(step===3)c=L('楕円の 性質を 使う',945,140,{size:24,color:C.dim})+T(`b^2=a^2(1-${ee}^2)`,945,210,{size:38})+fade(seg(p,.4,.55),T(`=\\dfrac{16}{9}\\times0.75=\\dfrac43`,945,320,{size:40}));
 if(step===4)c=L('楕円の 式',945,140,{size:24,color:C.dim})+T(`\\left(\\dfrac{X}{a}\\right)^2+\\left(\\dfrac{y}{b}\\right)^2=1`,945,220,{size:36})+fade(seg(p,.4,.55),L('X ＝ 2/3、y ＝ 1',945,330,{size:30,color:C.p,weight:700}));
 if(step===5)c=T(`\\left(\\dfrac{2/3}{4/3}\\right)^2=0.25`,945,150,{size:36})+fade(seg(p,.2,.32),T(`\\dfrac{1^2}{4/3}=0.75`,945,260,{size:36}))+fade(seg(p,.5,.62),T(`0.25+0.75=1`,945,360,{size:42}));
 s+=card(720,80,450,350,c,1);
 return s;
}
// ---- family of conics, p=1, sun at (760,265), S=55 ------------------------------------------------------
function famFig(p,es,stage=0){
 const o={sx:780,sy:270,S:55,box:[20,60,1190,500]};const cols=[C.ink,CR,C.v,C.hi,CE];const names=['0','0.5','0.9','1','1.2'];
 let s=label('p ＝ 1 で e を 変える',600,40,{size:22,color:C.dim,anchor:'middle'})+line(30,o.sy,1180,o.sy,{color:C.faint,w:1.5,dash:'4 6'})+sun(o.sx,o.sy);
 es.forEach((e,i)=>{const isNew=i===es.length-1&&stage>0;const g=isNew?seg(p,.05,.4):1;
  let th0=-Math.PI,th1=Math.PI;if(e>=1){const lim=Math.acos(-1/e);th0=-lim+.02;th1=lim-.02;}
  s+=fade(isNew?seg(p,.05,.2):1,draw(conicPts(e,{...o,th0,th1,n:400}),isNew?g:1,{color:cols[i],w:3}));
  const lx=e<1?o.sx-o.S/(1-e)-8:60,ly=e<1?o.sy-14:(e===1?100:440);
  s+=fade(isNew?seg(p,.3,.45):1,line(40,90+i*34,80,90+i*34,{color:cols[i],w:4})+L(`e ＝ ${names[i]}`,92,98+i*34,{size:22,color:cols[i],weight:700,anchor:'start'}));
 });
 let c='';
 if(stage===0)c=L('e ＝ 0',1030,150,{size:28,weight:700})+L('r ＝ p で 一定',1030,210,{size:26})+L('円',1030,280,{size:40,weight:700});
 if(stage===1)c=L('近い 点',1030,140,{size:24,color:C.dim})+T(`\\dfrac{${pp}}{1+${ee}}`,1030,200,{size:36})+L('遠い 点',1030,280,{size:24,color:C.dim})+T(`\\dfrac{${pp}}{1-${ee}}`,1030,340,{size:36});
 if(stage===2)c=L('e ＝ 1',1030,140,{size:28,color:C.hi,weight:700})+L('θ ＝ 180° で 分母 0',1030,210,{size:22})+L('放物線',1030,300,{size:34,color:C.hi,weight:700})+L('（閉じない）',1030,350,{size:22,color:C.dim});
 if(stage===3)c=L('e ＞ 1',1030,140,{size:28,color:CE,weight:700})+L('分母 0 の 角度が 2つ',1030,210,{size:22})+L('双曲線',1030,300,{size:34,color:CE,weight:700})+L('（一度 来て 去る）',1030,350,{size:22,color:C.dim});
 s+=card(900,90,260,300,c,seg(p,.02,.12));
 return s;
}
function energyFig(p,stage){
 const x0=90,y0=150,w=480,X=r=>x0+w*r/6,Y=v=>y0-180*v;
 let s=arrow(x0,y0,x0+w+30,y0,{color:C.dim,w:2,head:12})+label('r',x0+w+30,y0+34,{size:24,color:CR})+arrow(x0,y0+330,x0,y0-60,{color:C.dim,w:2,head:12})+label('U, E',x0+10,y0-70,{size:22,color:C.E});
 s+=draw(Array.from({length:101},(_,i)=>{const r=.55+5.45*i/100;return [X(r),Y(-1/r)];}),1,{color:C.E,w:4});
 s+=L('U ＝ −GMm/r',X(1.3)+30,Y(-1/1.3)+10,{size:22,color:C.E,weight:700,anchor:'start'});
 const lines=[[-.4,'E ＜ 0',C.hi],[0,'E ＝ 0',C.ink],[.25,'E ＞ 0',CE]];
 lines.forEach(([E,t,col],i)=>{const g=stage?seg(p,.1+i*.15,.22+i*.15):(i===0?seg(p,.3,.45):0);
  const xs=E<0?X(1/-E):x0+w;s+=fade(g,line(x0+30,Y(E),E<0?xs:x0+w,Y(E),{color:col,w:3,dash:E<0?'':'8 6'})+L(t,x0+w+34,Y(E)+8,{size:22,color:col,weight:700,anchor:'start'}));
  if(E<0)s+=fade(g,line(xs,Y(E)-14,xs,Y(E)+14,{color:col,w:3})+L('ここで 戻る',xs,Y(E)+40,{size:20,color:col}));});
 let c=L('全エネルギー E で 決まる',937,140,{size:26,weight:700})+fade(seg(p,.3,.45),L('E ＜ 0：遠くへ 逃げられない',937,210,{size:24,color:C.hi,weight:700})+L('→ 閉じた 楕円',937,255,{size:24,color:C.hi,weight:700}));
 if(stage)c=L('E ＜ 0：楕円',937,150,{size:28,color:C.hi,weight:700})+L('E ＝ 0：放物線',937,215,{size:28,weight:700})+L('E ＞ 0：双曲線',937,280,{size:28,color:CE,weight:700})+fade(seg(p,.55,.7),L('E と e を 結ぶ 式は',937,350,{size:22,color:C.dim})+L('ここでは 導かない',937,385,{size:22,color:C.dim}));
 s+=card(705,90,465,330,c,seg(p,.02,.12));
 return s;
}
