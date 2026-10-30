// 問題編 解説「下向きの電場と 4 nC の点電荷」（q-um-electrostatic-potential-path、大学編 22 電位・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/22_電位.md の q-um-electrostatic-potential-path（解説 20 行）。
// 画面：前半は左に格子と道、右に説明の枠。後半は左に点電荷と円、右に電位のグラフ。札は yt1-qx-common.mjs。
// 色（正本）：電場 𝐄 水色、電位 V 紫、差・強調・縦の一歩 黄、横の一歩 桃、一歩 d𝐫・道 金、負・誤り 赤、正電荷 赤。
// 図のために決めた値：道の形（3次のベジェ曲線。道1 (0,0)(0.6,2.4)(2.8,1.6)(4,−2)、道2 (0,0)(1.2,−4)(2.6,0.4)(4,−2)、道3 (0,0)(−0.6,1.8)(4.8,1.8)(4,−2)）。
//   長さ（数値計算）道1 6.58≈6.6 m、道2 5.44≈5.4 m、道3 6.96≈7.0 m。
import {C,clamp,mix,seg,fade,move,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,cueT,sentWin,textW} from './yt1-qx-common.mjs';

const K='qx-um-electrostatic-potential-path:';
const EC=C.x,VC=C.v,HI=C.hi,PK=C.p,GD=C.t,NG='#ff6b6b',RED='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const VE=cs(EC,'\\mathbf{E}'),DR=cs(GD,'d\\mathbf{r}');
const PX=640,PW=540,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='V(R)−V(P)',G2='道によらない理由',G3='V(1 m)−V(3 m)';
const ANS1=g=>answerTag(1,'B','−10 V',{g}),ANS2=g=>answerTag(2,'B','',{g}),ANS3=g=>answerTag(3,'D','24.0 V',{g});

// ---- 前半の図：格子・電場・道 ----
const OX=110,OY=215,SC=80;
const S2=([x,y])=>[OX+SC*x,OY-SC*y];
const bz=(c,t)=>{const u=1-t;return [0,1].map(k=>u*u*u*c[0][k]+3*u*u*t*c[1][k]+3*u*t*t*c[2][k]+t*t*t*c[3][k]);};
const PATHS=[[[0,0],[0.6,2.4],[2.8,1.6],[4,-2]],[[0,0],[1.2,-4.0],[2.6,0.4],[4,-2]],[[0,0],[-0.6,1.8],[4.8,1.8],[4,-2]]];
const PCOL=[GD,'#d0d6e2','#8fa3c8'];
const pts=(c,n=80)=>Array.from({length:n+1},(_,i)=>S2(bz(c,i/n)));
function grid({g=1}={}){
 let s='';
 for(let x=-.5;x<=4.81;x+=.5){if(Math.abs(x-Math.round(x))>.01)continue;const [a,b]=S2([x,1.6]),[,d]=S2([x,-2.6]);s+=line(a,b,a,d,{color:C.grid,w:2});}
 for(let y=-2;y<=1;y++){const [a,b]=S2([-.5,y]),[c]=S2([4.8,y]);s+=line(a,b,c,b,{color:C.grid,w:2});}
 for(let x=0;x<=4;x++){const [a]=S2([x,0]);s+=label(String(x),a,S2([0,-2.6])[1]+26,{size:22,color:C.dim,anchor:'middle'});}
 for(let y=-2;y<=1;y++){const [,b]=S2([0,y]);s+=label(String(y).replace('-','−'),S2([-.5,0])[0]-10,b+8,{size:22,color:C.dim,anchor:'end'});}
 return fade(g,s);
}
function fieldDown({g=1,op=.8}={}){
 let s='';
 for(const x of [.5,1.5,2.5,3.5,4.5])for(const y0 of [1.4,-.8]){const [a,b]=S2([x,y0]);s+=arrow(a,b,a,b+52,{color:EC,w:3.5,head:12});}
 s+=label('5 N/C',S2([4.5,1.4])[0]+20,S2([0,1.4])[1]+8,{size:24,color:EC,weight:700})+T('\\mathbf{E}',S2([4.5,1.4])[0]+20,S2([0,1.4])[1]+40,26,{color:EC,anchor:'start'});
 return fade(g*op,s);
}
function ptLabels({g=1,ring1=0}={}){
 const [px,py]=S2([0,0]),[rx,ry]=S2([4,-2]);
 let s=dot(px,py,8,C.ink)+dot(rx,ry,8,C.ink)+label('P(0, 0)',px+12,py+34,{size:24,color:C.ink,weight:700})+label('R(4, −2)',rx+14,ry+30,{size:24,color:C.ink,weight:700});
 if(ring1)s+=fade(ring1,ring(px,py,20,{color:VC,w:4})+ring(rx,ry,20,{color:VC,w:4}));
 return fade(g,s);
}
function front({path=1,others=0,straight=0,fieldOp=.8,ring1=0}={}){
 let s=grid()+fieldDown({op:fieldOp});
 if(others)for(const i of [1,2])s+=fade(others,draw(pts(PATHS[i]),1,{color:PCOL[i],w:3.5,dash:i===2?'10 6':''}));
 s+=draw(pts(PATHS[0]),path,{color:GD,w:5});
 if(straight)s+=fade(straight,line(...S2([0,0]),...S2([4,-2]),{color:C.ink,w:3,dash:'6 7'}));
 return s+ptLabels({ring1});
}
// 道を n 個の一歩に分け、横（桃）と縦（黄）に
function steps(c,{n=14,g=1,hor=1,ver=1,chord=1,cross=0}={}){
 let s='';
 for(let i=0;i<n;i++){
  const a=bz(c,i/n),b=bz(c,(i+1)/n),[ax,ay]=S2(a),[bx,by]=S2(b),gi=seg(g,i/n*.7,i/n*.7+.3);
  s+=fade(gi*chord,line(ax,ay,bx,by,{color:GD,w:3}));
  s+=fade(gi*hor,line(ax,ay,bx,ay,{color:PK,w:4}));
  s+=fade(gi*ver,line(bx,ay,bx,by,{color:HI,w:4}));
 }
 if(cross){const a=bz(c,3/n),b=bz(c,4/n),[ax,ay]=S2(a),[bx]=S2(b);s+=fade(cross,label('×',(ax+bx)/2,ay+16,{size:44,color:NG,anchor:'middle',weight:700}));}
 return s;
}
// 縦の移動の和：上がった分（+h）と下がった分（−(h+2)）が打ち消し合い、−2 m が残る
function sumBars({x=PC,y0=270,k=50,h=1.37,up=1,down=1,cancel=0,rest=0,g=1,labels=1}={}){
 const Y=v=>y0-k*v;
 let s=line(x-170,Y(0),x+170,Y(0),{color:C.dim,w:2})+label('0',x-180,Y(0)+8,{size:22,color:C.dim,anchor:'end'});
 s+=fade(up*(1-cancel*.85),arrow(x-60,Y(0),x-60,Y(h),{color:HI,w:7,head:16}));
 s+=fade(down*(1-cancel*.85),line(x+10,Y(h),x+10,Y(0),{color:HI,w:7}));
 s+=fade(down,arrow(x+10,Y(0),x+10,Y(-2),{color:HI,w:7,head:16}));
 if(labels){s+=fade(up*(1-cancel),label('上がった 分',x-75,Y(h/2)+8,{size:24,color:HI,anchor:'end',weight:700}));
  s+=fade(down*(1-cancel),label('下がった 分',x+28,Y(h/2)+8,{size:24,color:HI,weight:700}));}
 s+=fade(cancel,line(x-90,Y(h)-6,x+40,Y(0)+6,{color:NG,w:3})+line(x-90,Y(0)+6,x+40,Y(h)-6,{color:NG,w:3}));
 s+=fade(rest,highlight(x-10,Y(0)-6,40,2*k+14,1,HI)+label('残り −2 m',x+42,Y(-1)+8,{size:28,color:HI,weight:700}));
 return fade(g,s);
}
// ---- 後半の図：点電荷と円、電位のグラフ ----
const CX=200,CYc=290,RM=50;
const onC=r=>{const a=(r===1?-140:-20)*Math.PI/180;return [CX+RM*r*Math.cos(a),CYc+RM*r*Math.sin(a)];};
function charge({g=1,rline=0,tags=0,qv=0}={}){
 let s=ring(CX,CYc,RM*3,{color:C.dim,w:2.5})+ring(CX,CYc,RM,{color:C.dim,w:2.5});
 s+=label('1 m',CX,CYc+RM+26,{size:22,color:C.dim,anchor:'middle'})+label('3 m',CX,CYc+RM*3-12,{size:22,color:C.dim,anchor:'middle'});
 s+=ring(CX,CYc,18,{color:RED,w:3,fill:'#3a1d2a'})+label('+',CX,CYc+9,{size:26,color:RED,anchor:'middle',weight:700});
 s+=label('Q＝4 nC',CX+30,CYc-70,{size:24,color:RED,anchor:'middle',weight:700});
 const [x1,y1]=onC(1),[x3,y3]=onC(3);
 s+=dot(x1,y1,7,C.ink)+dot(x3,y3,7,C.ink);
 if(rline)s+=fade(rline,line(CX,CYc,x1,y1,{color:C.ink,w:3})+label('r＝中心からの距離',CX,CYc+RM*3+40,{size:24,color:C.ink,anchor:'middle',weight:700}));
 const tag=(x,y,txt,col,left)=>{const w=textWq(txt),x0=left?x-12-w:x+12;return rect(x0,y-46,w,36,{fill:'#131f38',fo:.96,stroke:col,sw:2,rx:8})+label(txt,x0+10,y-20,{size:24,color:col,weight:700});};
 s+=tag(x1,y1,qv?'36.0 V':'V＝？',qv?VC:C.ink,1)+tag(x3,y3,qv?'12.0 V':'V＝？',qv?VC:C.ink,0);
 return fade(g,s);
}
const textWq=t=>textW(t,24)+22;
// グラフ：横 r（0〜4 m）、縦 V（0〜40 V）
const GX=580,GY=330,GW=500,GH=230,RX=r=>GX+GW*r/4,VY=v=>GY-GH*v/40;
const KQ=35.96;
function graph({g=1,curve=1,pts2=0,diff=0,inv2=0,inv2diff=0,legend=0}={}){
 let s=line(GX,GY,GX+GW+20,GY,{color:C.dim,w:2.5})+line(GX,GY,GX,GY-GH-20,{color:C.dim,w:2.5});
 for(const r of [1,2,3,4])s+=line(RX(r),GY,RX(r),GY+8,{color:C.dim,w:2})+label(String(r),RX(r),GY+32,{size:22,color:C.dim,anchor:'middle'});
 for(const v of [10,20,30,40])s+=line(GX-8,VY(v),GX,VY(v),{color:C.dim,w:2})+label(String(v),GX-14,VY(v)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('r [m]',GX+GW+30,GY+8,{size:24,color:C.dim})+label('V [V]',GX,GY-GH-32,{size:24,color:VC,anchor:'middle',weight:700});
 const cur=Array.from({length:121},(_,i)=>{const r=.9+3.1*i/120;return [RX(r),VY(KQ/r)];});
 s+=draw(cur,curve,{color:VC,w:4.5});
 if(inv2){const c2=Array.from({length:121},(_,i)=>{const r=.95+3.05*i/120;return [RX(r),VY(KQ/(r*r))];});s+=fade(inv2,draw(c2,1,{color:EC,w:3.5,dash:'10 8'}));}
 if(pts2)s+=fade(pts2,dot(RX(1),VY(KQ),8,VC)+dot(RX(3),VY(KQ/3),8,VC)+label('36.0',RX(1)+16,VY(KQ)-8,{size:24,color:VC,weight:700})+label('12.0',RX(3)-10,VY(KQ/3)+34,{size:24,color:VC,anchor:'end',weight:700}));
 if(diff)s+=fade(diff,line(RX(1),VY(KQ),RX(3)+30,VY(KQ),{color:HI,w:2,dash:'6 6'})+line(RX(3),VY(KQ/3),RX(3)+30,VY(KQ/3),{color:HI,w:2,dash:'6 6'})
  +line(RX(3)+30,VY(KQ),RX(3)+30,VY(KQ/3),{color:HI,w:6})+label('24.0 V',RX(3)+44,(VY(KQ)+VY(KQ/3))/2+8,{size:28,color:HI,weight:700}));
 if(inv2diff)s+=fade(inv2diff,dot(RX(1),VY(KQ),7,EC)+dot(RX(3),VY(KQ/9),7,EC)+line(RX(1)-30,VY(KQ),RX(1)-30,VY(KQ/9),{color:C.dim,w:5})
  +line(RX(1)-30,VY(KQ/9),RX(3),VY(KQ/9),{color:C.dim,w:2,dash:'5 6'})+label('32.0',RX(1)-40,(VY(KQ)+VY(KQ/9))/2+8,{size:26,color:C.dim,anchor:'end',weight:700}));
 if(legend)s+=fade(legend,label('電位 ∝ 1/r',RX(1.5),VY(38),{size:26,color:VC,weight:700})+label('電場 ∝ 1/r²',RX(1.5),VY(31),{size:26,color:EC,weight:700}));
 return fade(g,s);
}

export const ytQxUmElectrostaticPotentialPathDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約3秒）：格子・下向きの電場・P と R・曲がった道（金）が伸びる。縦横の分け方・電位の値は出さない。
 [K+'q1']:(p)=>move(260,0,grid({g:seg(p,0,.2)})+fieldDown({g:seg(p,.1,.35)})+ptLabels({g:seg(p,.25,.45)})+draw(pts(PATHS[0]),seg(p,.4,.95),{color:GD,w:5})),
 // 小問3：点電荷 Q＝4 nC、半径 1 m と 3 m の円、空欄の札「V＝？」。電位の値・グラフは出さない。
 [K+'q3']:(p)=>move(400,-10,charge({g:seg(p,0,.6)})),

 // ===================== 小問1 =====================
 [K+'intro']:(p)=>grid({g:seg(p,0,.1)})+fieldDown({g:seg(p,.05,.2)})+ptLabels({g:seg(p,.15,.3)})+draw(pts(PATHS[0]),seg(p,.3,.75),{color:GD,w:5}),
 [K+'goal1']:(p)=>front({ring1:seg(p,.3,.5)})+goalTag(G1,{g:seg(p,.03,.15)}),
 [K+'def']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=front();
  const a=bz(PATHS[0],.62),c=bz(PATHS[0],.68),[ax,ay]=S2(a),[cx,cy]=S2(c);
  s+=fade(seg(p,.03,.12),arrow(ax,ay,cx+(cx-ax)*.6,cy+(cy-ay)*.6,{color:GD,w:6,head:14})+label('d𝐫＝道の一歩',S2([2.95,.55])[0],S2([0,.55])[1],{size:24,color:GD,weight:700}));
  const [ex,ey]=S2([2.5,1.4]);
  s+=fade(seg(p,.08,.16),ring(ex,ey+26,34,{color:EC,w:3}));
  const dq=`V(R)-V(P)=${cs(NG,'-')}\\!\\int ${VE}\\cdot ${DR}`,dw=texWidth(dq,40,false),mx=PC-dw/2+texWidth('V(R)-V(P)=',40,false);
  s+=panel(90,250,fade(seg(p,.15,.25),T(dq,PC,180,40))
   +fade(seg(p,b,b+.08),highlight(mx+6,140,40,70,1,NG))
   +fade(seg(p,b+.05,b+.15),label('1 C あたり 電場が する 仕事 に 負号',PC,280,{size:24,color:C.ink,anchor:'middle',weight:700})),seg(p,.12,.2));
  return s+goalTag(G1);
 },
 [K+'split']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=front({path:1,fieldOp:.5});
  s+=steps(PATHS[0],{g:seg(p,.05,b-.05)});
  const [lx,ly]=S2([.2,1.75]);
  s+=fade(seg(p,b+.1,b+.2),label('横（桃）：電場と 直角 → 0',PX,140,{size:26,color:PK,weight:700})+label('縦（黄）：電場に 沿う',PX,190,{size:26,color:HI,weight:700}));
  return s+goalTag(G1);
 },
 [K+'sumy']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=front({path:1,fieldOp:.5});
  s+=steps(PATHS[0],{hor:.25,chord:.3});
  s+=panel(90,410,fade(seg(p,.02,.12),T(`${cs(EC,'(-5)')}\\times\\Delta y`,PC,140,38))
   +fade(seg(p,.05,.15),label('縦の 一歩 ごと',PC,185,{size:22,color:C.dim,anchor:'middle'}))
   +sumBars({x:PC-20,y0:300,k:48,up:seg(p,b,b+.1),down:seg(p,b+.1,b+.2),cancel:seg(p,b+.3,b+.4),rest:seg(p,b+.45,b+.55),labels:1}),seg(p,0,.08));
  return s+goalTag(G1);
 },
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=front({straight:seg(p,.25,.4),fieldOp:.5});
  s+=panel(90,330,T(`\\int ${VE}\\cdot ${DR}=(-5)\\times(-2)`,PC,145,34)
   +fade(seg(p,.1,.2),T(`=+10\\ \\mathrm{V}`,PC,205,36))
   +fade(seg(p,b,b+.1),line(PX+30,240,PX+PW-30,240,{color:C.faint,w:2})+label('負号を 付けて',PC,278,{size:24,color:C.dim,anchor:'middle'})+T(`V(R)-V(P)=${cs(NG,'-10\\ \\mathrm{V}')}`,PC,330,36))
   +fade(seg(p,.28,.4),label('まっすぐな 道（点線）：0×4＋(−5)×(−2)＝10',PC,395,{size:22,color:C.ink,anchor:'middle'})),1);
  return s+goalTag(G1)+ANS1(seg(p,b+.15,b+.23));
 },
 [K+'equi']:(p)=>{
  let s=front({fieldOp:.5});
  for(let y=1;y>=-2;y--){const [a,b]=S2([-.5,y]),[c]=S2([4.8,y]);s+=fade(seg(p,.05+(1-y)*.08,.15+(1-y)*.08),line(a,b,c,b,{color:VC,w:3,dash:'8 7'}));}
  s+=fade(seg(p,.4,.5),label('電位が 高い ↑',PX+20,150,{size:28,color:VC,weight:700})+label('電位が 低い ↓',PX+20,390,{size:28,color:VC,weight:700})
   +label('R は P より 2 m 下',PX+20,270,{size:28,color:C.ink,weight:700}));
  const [rx,ry]=S2([4,-2]),[px,py]=S2([0,0]);
  s+=fade(seg(p,.4,.5),line(rx+40,py,rx+40,ry,{color:HI,w:5})+line(px,py,rx+40,py,{color:HI,w:2,dash:'5 6'})+label('2 m',rx+52,(py+ry)/2+8,{size:24,color:HI,weight:700}));
  return s+goalTag(G1)+ANS1(1);
 },
 [K+'wrong1']:(p,ctx)=>{
  let s=front({fieldOp:.5});
  s+=wrongSeq(p,ctx,[['A','+10 V','負号を 落とした'],['C','−20 V','横の 4 m を 掛けた']],{opts:{...WOPT,y:150}});
  return s+goalTag(G1)+ANS1(1);
 },
 [K+'wrong1d']:(p)=>{
  let s=front({path:1,fieldOp:.5});
  s+=steps(PATHS[0],{chord:.3,cross:seg(p,.3,.45)});
  s+=wrongSeq(p,null,[['D','−30 V','直角な 横の 移動まで 数えた']],{win:[[0,1]],opts:{...WOPT,y:150}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>front({others:seg(p,.2,.5),fieldOp:.5})+goalTag(G2,{g:seg(p,.03,.15)})
  +fade(seg(p,.35,.5),label('道1',S2([1.3,1.55])[0],S2([0,1.55])[1],{size:24,color:PCOL[0],weight:700})+label('道2',S2([1.1,-1.5])[0],S2([0,-1.5])[1],{size:24,color:PCOL[1],weight:700})+label('道3',S2([3.7,1.25])[0],S2([0,1.25])[1],{size:24,color:PCOL[2],weight:700})),
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=front({others:1,fieldOp:.5});
  s+=label('道1',S2([1.3,1.55])[0],S2([0,1.55])[1],{size:24,color:PCOL[0],weight:700})+label('道2',S2([1.1,-1.5])[0],S2([0,-1.5])[1],{size:24,color:PCOL[1],weight:700})+label('道3',S2([3.7,1.25])[0],S2([0,1.25])[1],{size:24,color:PCOL[2],weight:700});
  let inner=label('縦の 移動の 和',PC,135,{size:26,color:C.dim,anchor:'middle'});
  const y0=180;
  [0,1,2].forEach(i=>{const x=PX+110+i*160,g=seg(p,.1+i*.1,.2+i*.1);
   inner+=fade(g,line(x-40,y0,x+40,y0,{color:C.dim,w:2})+arrow(x,y0,x,y0+120,{color:HI,w:8,head:18})+label(`道${i+1}`,x,y0+165,{size:26,color:PCOL[i],anchor:'middle',weight:700}));});
  inner+=fade(seg(p,.45,.55),label('どれも −2 m',PC,y0+215,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=panel(90,350,inner,1);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.08));
 },
 [K+'wrong2a']:(p)=>{
  const box=(x,title,line1,col,g,mark)=>fade(g,card(x,110,520,170,label(title,x+260,160,{size:30,color:col,anchor:'middle',weight:700})+label(line1,x+260,225,{size:24,color:C.ink,anchor:'middle'}),1,col)
   +(mark?fade(mark,rect(x-10,100,540,190,{fill:'none',fo:0,stroke:HI,sw:5,rx:18})):''));
  let s=box(40,'道に よらない','縦の 移動の 和が 両端で 決まる',HI,seg(p,0,.12),seg(p,.15,.3));
  s+=box(640,'電荷に よらない','q で 割ると 消える',C.dim,seg(p,.05,.17),0);
  s+=wrongSeq(p,null,[['A','q が 約分されるから','q の 約分は「電荷に よらない」理由']],{win:[[.25,1]],opts:{x:150,w:900,y:330}});
  return s+goalTag(G2)+ANS2(1);
 },
 [K+'wrong2cd']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=front({others:1,fieldOp:.5});
  const lens=[['道1','約 6.6 m'],['道2','約 5.4 m'],['道3','約 7.0 m']];
  s+=fade(seg(p,b+.05,b+.15),lens.map(([n,v],i)=>label(`${n}：${v}`,PX+40,370+i*40,{size:26,color:PCOL[i],weight:700})).join(''));
  s+=wrongSeq(p,ctx,[['C','∮ の 丸で いつも 0','丸は 閉じた 道の 印'],['D','道の 長さが 同じ','道の 長さは 道ごとに 違う']],{opts:{...WOPT,y:150}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>charge({g:seg(p,0,.25)})+goalTag(G3,{g:seg(p,.03,.15)}),
 [K+'kq']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=charge({rline:seg(p,.02,.12)});
  s+=card(470,100,710,330,fade(seg(p,.12,.22),T(`V=\\dfrac{kQ}{r}`,825,175,46,{color:VC}))
   +fade(seg(p,b,b+.1),T(`kQ=8.99\\times10^{9}\\times4\\times10^{-9}`,825,275,36))
   +fade(seg(p,b+.2,b+.3),T(`\\approx36.0\\ \\mathrm{V\\cdot m}`,825,350,36)),seg(p,.08,.15));
  return s+goalTag(G3);
 },
 [K+'vals']:(p)=>charge({rline:1-seg(p,0,.1),qv:seg(p,.05,.15)>.5?1:0})+graph({g:seg(p,.15,.3),curve:seg(p,.25,.55),pts2:seg(p,.55,.7)})+goalTag(G3),
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  return charge({qv:1})+graph({pts2:1,diff:seg(p,.1,.25)})+goalTag(G3)+ANS3(seg(p,b,b+.08));
 },
 [K+'wrong3']:(p,ctx)=>charge({qv:1})+graph({pts2:1,diff:1})+wrongSeq(p,ctx,[['A','36.0 V','3 m の 点を 引き忘れ'],['C','−24.0 V','引く 順が 逆']],{opts:{x:470,w:710,y:395,size:26,whySize:22}})+goalTag(G3)+ANS3(1),
 [K+'wrong3b']:(p)=>charge({qv:1})+graph({pts2:1,inv2:seg(p,.05,.2),inv2diff:seg(p,.2,.35)})
  +fade(seg(p,.05,.2),label('1/r²',RX(2.0),VY(13.5),{size:26,color:EC,weight:700}))
  +wrongSeq(p,null,[['B','32.0','1/r² で 計算（単位 V/m）']],{win:[[.3,1]],opts:{x:470,w:710,y:395,size:26,whySize:22}})+goalTag(G3)+ANS3(1),

 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,out=seg(p,0,.08);
  let s=fade(1-out,charge({qv:1}));
  s+=move(-400*out,0,graph({pts2:1-out,inv2:1,legend:seg(p,.05,.15)}));
  s+=fade(seg(p,b,b+.1),card(820,110,360,200,label('道に よらない',1000,160,{size:28,color:HI,anchor:'middle',weight:700})+label('→ 電位は',1000,215,{size:26,color:C.ink,anchor:'middle',weight:700})+label('位置だけで 決まる',1000,260,{size:26,color:C.ink,anchor:'middle',weight:700}),1,HI));
  s+=fade(seg(p,b+.1,b+.2),T(`V(R)-V(P)=-\\int ${VE}\\cdot ${DR}`,600,440,40));
  return s;
 },
};
