// 問題編 解説「2つの谷を持つエネルギー」（q-um-taylor、大学編 04 近似・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/04_近似.md の q-um-taylor（解説 19 行）。
// 画面：左に図（U–x グラフ・F–x グラフ・展開の表）、右に式と札の枠。誤答カードは右の枠の下。札の帯（y＜78）には図を描かない。
// 色（正本）：エネルギー U 橙、力 F 緑、近似の放物線・直線 黄、捨てた項（差）赤の薄い塗り、ずれ s 水色。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin} from './yt1-qx-common.mjs';

const K='qx-um-taylor:';
const CU=C.E,CF=C.F,YL=C.hi,RD='#ff6b6b',CS=C.x;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='つり合いの位置と安定性',G2='x＝2.1 m の本当の力と近似の力',G3='3次の係数と差の出どころ';
const ANS1=g=>answerTag(1,'A','',{g}),ANS2=g=>answerTag(2,'B','本当 −0.861 N、近似 −0.8 N',{g,maxW:480}),ANS3=g=>answerTag(3,'C','係数 2',{g});
const b2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
const U=x=>x**4/4-2*x*x,dU=x=>x**3-4*x,Fx=x=>-dU(x),par=x=>-4+4*(x-2)**2,spr=x=>-8*(x-2);
const UL=`{\\color{${CU}}U}`,FL=`{\\color{${CF}}F}`;
const UFORM=`${UL}=\\dfrac{x^4}{4}-2x^2`,FFORM=`${FL}=-\\dfrac{d${UL}}{dx}`;

// ---- U–x グラフ ----
function uGraph({x=60,y=460,w=490,h=320,g=1,curve=1}={}){
 const A=axes({x,y,w,h,xmin:-3.2,xmax:3.2,ymin:-5,ymax:6,xticks:[-3,-2,-1,1,2,3],yticks:[-4,-2,2,4],grid:true,g,xlabel:'x［m］',ylabel:'U［J］',xcolor:CS,ycolor:CU});
 return {A,svg:A.svg+(curve?A.plot(U,{from:-3.2,to:3.2,p:curve,color:CU,w:4.5,steps:240}):'')};
}
const tanAt=(A,x0,{len=.7,color=YL,w=3,g=1}={})=>fade(g,line(A.X(x0-len),A.Y(U(x0)-dU(x0)*len),A.X(x0+len),A.Y(U(x0)+dU(x0)*len),{color,w}));
// ---- F–x グラフ（x＝1.8〜2.25）----
function fGraph({x=60,y=460,w=490,h=300,g=1,curve=1,lin=1}={}){
 const A=axes({x,y,w,h,xmin:1.8,xmax:2.25,ymin:-2.6,ymax:1.6,xticks:[1.9,2,2.1,2.2],yticks:[-2,-1,1],grid:true,g,xlabel:'x［m］',ylabel:'F［N］',xcolor:CS,ycolor:CF});
 let s=A.svg;
 if(curve)s+=A.plot(Fx,{from:1.8,to:2.25,p:curve,color:CF,w:4.5});
 if(lin)s+=fade(lin,A.plot(spr,{from:1.8,to:2.12,color:YL,w:3.5,dash:'10 7'})+A.plot(spr,{from:2.12,to:2.22,color:YL,w:3.5,dash:'10 7'}));
 return {A,svg:s};
}
function fLens(A,{g=1,LX=470,LY=160,LR=68,k=7}={}){
 const cx=A.X(2.1),cy=A.Y(-.83),Z=(x,y)=>[LX+(x-cx)*k,LY+(y-cy)*k];
 const pts=fn=>Array.from({length:41},(_,i)=>{const u=2.1-.012+.024*i/40;return Z(A.X(u),A.Y(fn(u)));});
 let z=draw(pts(Fx),1,{color:CF,w:4})+draw(pts(spr),1,{color:YL,w:3,dash:'8 6'});
 const [ax,ay]=Z(A.X(2.1),A.Y(-.8)),[bx,by]=Z(A.X(2.1),A.Y(-.861));
 z+=poly([[ax-6,ay],[ax+6,ay],[bx+6,by],[bx-6,by]],{fill:RD,fo:.5})+dot(ax,ay,6,YL)+dot(bx,by,6,CF);
 let s=ring(cx,cy,12,{color:YL,w:2.5})+line(cx-9,cy-9,LX+LR*.7,LY+LR*.7,{color:YL,w:2});
 s+=`<clipPath id="qxtayLens"><circle cx="${LX}" cy="${LY}" r="${LR}"/></clipPath><circle cx="${LX}" cy="${LY}" r="${LR}" fill="#0e1830"/><g clip-path="url(#qxtayLens)">${z}</g>`+ring(LX,LY,LR,{color:YL,w:3.5});
 s+=label('差 0.061',LX,LY+LR+30,{size:24,color:RD,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- 展開の表 ----
const ROWS=[['0','−4','1','−4'],['1','0','1','0'],['2','8','2','8 ÷ 2 ＝ 4'],['3','12','6','12 ÷ 6 ＝ 2'],['4','6','24','6 ÷ 24 ＝ 1/4']];
function table({x=40,y=90,w=620,g=1,fill=[0,0,0,0,0],hl=0,rowH=48}={}){
 const cols=[x+50,x+210,x+360,x+510];
 let s=rect(x,y,w,64+rowH*5+14,{fill:'#131f38',fo:.96,stroke:C.faint,rx:14});
 [['k',C.ink],['k 回微分の値',CU],['k!',C.dim],['係数',YL]].forEach(([t,c],i)=>{s+=label(t,cols[i],y+44,{size:24,color:c,anchor:'middle',weight:700});});
 s+=line(x+16,y+62,x+w-16,y+62,{color:C.faint,w:2});
 ROWS.forEach((r,j)=>{const yy=y+64+rowH*j+rowH*.68;
  if(j===3&&hl)s+=fade(hl,rect(x+10,yy-rowH*.68+2,w-20,rowH-4,{fill:YL,fo:.12,stroke:YL,sw:2,rx:8}));
  s+=label(r[0],cols[0],yy,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=fade(fill[j]??0,r.slice(1).map((t,i)=>label(t,cols[i+1],yy,{size:26,color:[CU,C.dim,YL][i],anchor:'middle',weight:i===2?700:400})).join(''));
 });
 return fade(g,s);
}
// ---- 力の大きさの棒（0.8＋0.06＋0.001）----
function forceBar({x=80,y=330,w=520,g=1,a=1,b=1,c=1,tot=0}={}){
 const sc=w/.9,h=46;
 let s=label('x ＝ 2.1 の 力の 大きさ［N］',x,y-24,{size:24,color:C.dim});
 s+=fade(a,rect(x,y,.8*sc*a,h,{fill:YL,fo:.55,stroke:YL,rx:3})+label('0.8（ばね）',x+.4*sc,y+h+32,{size:24,color:YL,anchor:'middle',weight:700}));
 s+=fade(b,rect(x+.8*sc,y,.06*sc,h,{fill:RD,fo:.45,stroke:RD,rx:2})+label('0.06（3次）',x+.83*sc,y+h+66,{size:24,color:RD,anchor:'middle',weight:700}));
 s+=fade(c,rect(x+.86*sc,y,Math.max(2,.001*sc),h,{fill:CS,fo:.9,stroke:CS,rx:1})+label('0.001（4次）',x+.86*sc-6,y-10,{size:22,color:CS,anchor:'end'}));
 s+=fade(tot,line(x+.861*sc,y-10,x+.861*sc,y+h+10,{color:C.ink,w:2.5})+label('0.861',x+.861*sc+8,y+h+100,{size:28,color:C.ink,anchor:'middle',weight:700}));
 return fade(g,s);
}

export const ytQxUmTaylorDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約3秒）：左上に式 U＝x⁴/4−2x² と F＝−dU/dx。目盛りだけの U–x 座標（曲線は描かない）。
 [K+'q1']:(p)=>{
  let s=uGraph({x:420,w:560,g:seg(p,.25,.7),curve:0}).svg;
  s+=fade(seg(p,0,.25),T(UFORM,170,150,38))+fade(seg(p,.1,.35),T(FFORM,170,250,38));
  return s;
 },
 // 小問3（約3秒）：展開の表の枠（行 k＝0〜4、列「k 回微分の値」「k!」「係数」）を空欄で
 [K+'q3']:(p)=>table({x:290,g:seg(p,0,.4)}),

 // ===================== 問題の設定 =====================
 [K+'setup']:(p,ctx)=>{
  const b=b2(ctx,.6);
  let s=uGraph({curve:seg(p,.1,.7)}).svg;
  s+=panel(90,280,label('位置エネルギー',PC,140,{size:26,color:C.dim,anchor:'middle'})+T(UFORM,PC,210,40)
   +fade(seg(p,b,b+.1),line(PX+40,265,PX+PW-40,265,{color:C.faint,w:2})+label('力',PC,300,{size:26,color:C.dim,anchor:'middle'})+T(FFORM,PC,345,38)),seg(p,0,.08));
  return s;
 },
 // ===================== 小問1 =====================
 [K+'goal1']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=uGraph();
  let s=svg;
  const dd=`{\\color{${YL}}\\dfrac{d${UL}}{dx}}`;
  const fw=texWidth(`${FL}=-${dd}`,44,false),fx0=PC-fw/2+texWidth(`${FL}=-`,44,false);
  s+=panel(90,280,label('力',PC,140,{size:26,color:C.dim,anchor:'middle'})+T(`${FL}=-${dd}`,PC,210,44)+highlight(fx0-6,160,PC+fw/2-fx0+12,100,seg(p,b,b+.08))
   +fade(seg(p,b+.1,b+.2),label('U の 傾き',PC+20,290,{size:26,color:YL,anchor:'middle',weight:700}))
   +fade(seg(p,b+.3,b+.4),label('傾き 0 → 力 0',PC,340,{size:30,color:C.ink,anchor:'middle',weight:700})),seg(p,.03,.12),C.hi);
  s+=fade(seg(p,b+.3,b+.45),tanAt(A,-2)+tanAt(A,0)+tanAt(A,2));
  s+=goalTag(G1,{g:seg(p,.02,.12)});
  return s;
 },
 [K+'deriv']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=uGraph();
  let s=svg;
  [-2,0,2].forEach((x0,i)=>{const g=seg(p,b+.1+.1*i,b+.2+.1*i);s+=tanAt(A,x0,{g})+fade(g,dot(A.X(x0),A.Y(U(x0)),9,YL));});
  s+=panel(90,300,T(`${UL}'=x^3-4x`,PC,145,38)
   +fade(seg(p,.25,.35),T(`=x\\,(x^2-4)`,PC,215,38))
   +fade(seg(p,b,b+.1),line(PX+40,260,PX+PW-40,260,{color:C.faint,w:2})+label('U′ ＝ 0 に なるのは',PC,305,{size:26,color:C.dim,anchor:'middle'})+T(`x=0,\\ \\pm2`,PC,355,40,{color:YL})),1);
  s+=goalTag(G1);
  return s;
 },
 [K+'second']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=uGraph();
  let s=svg+[-2,0,2].map(x0=>tanAt(A,x0)+dot(A.X(x0),A.Y(U(x0)),9,YL)).join('');
  const gv=seg(p,b+.1,b+.2),gm=seg(p,b+.5,b+.6);
  s+=fade(gv,kindTag('谷：安定',A.X(-2),A.Y(-4)+48,{color:CF,size:22})+kindTag('谷：安定',A.X(2),A.Y(-4)+48,{color:CF,size:22}));
  s+=fade(gm,kindTag('山：不安定',A.X(0),A.Y(0)-88,{color:RD,size:22}));
  s+=panel(90,300,T(`${UL}''=3x^2-4`,PC,145,38)
   +fade(seg(p,b,b+.1),T(`${UL}''(\\pm2)=8>0`,PC,225,34)+label('谷',PC+170,232,{size:28,color:CF,weight:700}))
   +fade(seg(p,b+.45,b+.55),T(`${UL}''(0)=-4<0`,PC,305,34)+label('山',PC+170,312,{size:28,color:RD,weight:700})),1);
  s+=goalTag(G1);
  return s;
 },
 [K+'spring']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=uGraph();
  let s=svg+dot(A.X(2),A.Y(-4),9,YL);
  s+=fade(seg(p,.05,.3),A.plot(par,{from:.95,to:3.05,p:seg(p,.05,.3),color:YL,w:3.5,dash:'10 7'}));
  s+=fade(seg(p,.25,.35),label('放物線（黄）',A.X(2),A.Y(-4)+44,{size:24,color:YL,weight:700,anchor:'middle'}));
  s+=panel(90,330,label('谷 x ＝ 2 の 近く',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +T(`${UL}\\approx-4+4(x-2)^2`,PC,195,34)
   +fade(seg(p,b,b+.1),T(`${FL}\\approx-8\\,(x-2)`,PC,265,36))
   +fade(seg(p,b+.12,b+.22),label('½ × 2 ＝ 1 で、U″ が そのまま 残る',PC,318,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,b+.35,b+.45),kindTag('ばね定数 U″(2) ＝ 8 N/m',PC,382,{color:YL,size:24})),1);
  s+=goalTag(G1);
  return s;
 },
 [K+'ans1']:(p,ctx)=>{
  const b=b2(ctx,.35);
  const {A,svg}=uGraph();
  let s=svg+dot(A.X(2),A.Y(-4),9,YL)+A.plot(par,{from:.95,to:3.05,color:YL,w:3.5,dash:'10 7'});
  s+=panel(90,140,T(`${UL}\\approx-4+{\\color{${YL}}4}(x-2)^2`,PC,135,30)+label('ばね定数 U″(2) ＝ 8 N/m',PC,195,{size:24,color:YL,anchor:'middle',weight:700}),1);
  s+=wrongCard('B','ばね定数 4 N/m',['放物線の 係数 4（½ U″）を 使った','ばね定数は U″(2) ＝ 8'],{...WOPT,y:250,g:seg(p,b+.02,b+.08)});
  s+=goalTag(G1)+ANS1(seg(p,.03,.1));
  return s;
 },
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5;
  const {A,svg}=uGraph();
  let s=svg;
  const inD=seg(p,m+.01,m+.06),r8=2*Math.SQRT2;
  s+=fade(1-inD,kindTag('山：U″(0) ＝ −4',A.X(0),A.Y(0)-88,{color:RD,size:22}));
  s+=fade(inD,[-r8,r8].map(x0=>dot(A.X(x0),A.Y(0),9,C.dim)+tanAt(A,x0,{len:.25,color:C.dim,w:3})).join('')+label('U ＝ 0 の 点',A.X(0)+14,A.Y(0)-88,{size:22,color:C.dim,weight:700}));
  s+=panel(90,140,T(`${UL}''(0)=-4<0`,PC,140,30)+label('x ＝ 0 は 山（不安定）',PC,195,{size:24,color:RD,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[['C','x ＝ 0 が 谷','U″(0) ＝ −4 で 山（符号の 読み違え）'],['D','x ＝ ±2√2',['U ＝ 0 の 点を つり合いと した','（そこでの 傾きは 0 でない）']]],{win:[[0,m],[m,1]],opts:{...WOPT,y:250}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  const {A,svg}=fGraph({curve:seg(p,.1,.4),lin:seg(p,.3,.5)});
  let s=svg;
  s+=fade(seg(p,.2,.35),label('本当の 力 −U′',A.X(2.115),A.Y(1.25),{size:24,color:CF,weight:700}));
  s+=fade(seg(p,.4,.5),label('ばね −8(x−2)',A.X(2.115),A.Y(.8),{size:24,color:YL,weight:700}));
  s+=fade(seg(p,.1,.2),line(A.X(2.1),A.Y(1.6),A.X(2.1),A.Y(-2.6),{color:C.dim,w:2,dash:'6 6'}));
  s+=panel(90,200,label('x ＝ 2.1 m で',PC,140,{size:28,color:CS,anchor:'middle',weight:700})+label('本当の 力 と ばね近似の 力',PC,200,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.03,.12));
  s+=goalTag(G2,{g:seg(p,.02,.12)});
  return s;
 },
 [K+'approx']:(p)=>{
  const {A,svg}=fGraph();
  let s=svg+line(A.X(2.1),A.Y(1.6),A.X(2.1),A.Y(-2.6),{color:C.dim,w:2,dash:'6 6'});
  s+=fade(seg(p,.3,.4),dot(A.X(2.1),A.Y(-.8),9,YL)+label('−0.8',A.X(2.1)-14,A.Y(-.8)+34,{size:26,color:YL,weight:700,anchor:'end'}));
  s+=panel(90,250,label('ずれ 0.1 × ばね定数 8',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.25),T(`-8\\times0.1`,PC,210,40))
   +fade(seg(p,.3,.4),T(`={\\color{${YL}}-0.8\\ \\mathrm{N}}`,PC,280,42)),1);
  s+=goalTag(G2);
  return s;
 },
 [K+'true']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=fGraph();
  let s=svg+line(A.X(2.1),A.Y(1.6),A.X(2.1),A.Y(-2.6),{color:C.dim,w:2,dash:'6 6'})+dot(A.X(2.1),A.Y(-.8),8,YL);
  s+=fade(seg(p,b+.3,b+.4),dot(A.X(2.1),A.Y(-.861),9,CF)+fLens(A,{LX:250,LY:330}));
  s+=panel(90,330,T(`${FL}=-${UL}'`,PC,135,34)
   +fade(seg(p,.1,.2),T(`=-(2.1^3-4\\times2.1)`,PC,200,32))
   +fade(seg(p,b,b+.1),T(`=-(9.261-8.4)`,PC,265,32))
   +fade(seg(p,b+.2,b+.3),T(`={\\color{${CF}}-0.861\\ \\mathrm{N}}`,PC,335,38)),1);
  s+=goalTag(G2);
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const b=b2(ctx);
  const {A,svg}=fGraph({y:470,h:280});
  let s=svg+line(A.X(2.1),A.Y(1.6),A.X(2.1),A.Y(-2.6),{color:C.dim,w:2,dash:'6 6'})+dot(A.X(2.1),A.Y(-.8),8,YL)+dot(A.X(2.1),A.Y(-.861),8,CF);
  // 上の帯：x 軸と物体、左向き（谷の底 x＝2 の向き）の力
  const y0=120,X=A.X;
  s+=line(X(1.8),y0,X(2.25),y0,{color:C.dim,w:2.5})+[1.9,2,2.1,2.2].map(u=>line(X(u),y0-6,X(u),y0+6,{color:C.dim,w:2})).join('')+label('谷の 底',X(2),y0+30,{size:22,color:C.dim,anchor:'middle'});
  s+=rect(X(2.1)-16,y0-32,32,26,{fill:C.x,fo:.35,stroke:C.x,rx:4});
  s+=fade(seg(p,.05,.2),arrow(X(2.1)-18,y0-19,X(2.1)-120,y0-19,{color:CF,w:6,head:16})+label('F',X(2.1)-140,y0-12,{size:26,color:CF,weight:700,anchor:'end'}));
  s+=panel(115,250,label('どちらも 負',PC,170,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('→ 谷へ 戻す 向き',PC,225,{size:28,color:CF,anchor:'middle',weight:700})
   +line(PX+40,260,PX+PW-40,260,{color:C.faint,w:2})+label('本当 −0.861 N',PC,305,{size:26,color:CF,anchor:'middle',weight:700})+label('近似 −0.8 N',PC,345,{size:26,color:YL,anchor:'middle',weight:700}),seg(p,.0,.08));
  s+=goalTag(G2)+ANS2(seg(p,b+.05,b+.12));
  return s;
 },
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5;
  const {A,svg}=fGraph();
  let s=svg+line(A.X(2.1),A.Y(1.6),A.X(2.1),A.Y(-2.6),{color:C.dim,w:2,dash:'6 6'})+dot(A.X(2.1),A.Y(-.8),8,YL)+dot(A.X(2.1),A.Y(-.861),8,CF);
  s+=panel(115,100,T(`-8\\times0.1=-0.8,\\quad -0.861`,PC,168,30),1);
  s+=wrongSeq(p,ctx,[['A','近似 −0.4 N','ばね定数を 4 と した（½ U″）'],['C','＋0.861、＋0.8',['負号を 落とした','（力は 谷へ 戻す 向き）']],['D','本当 −0.8 N','差 0.061 を 無視した']],{win:[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.55,1]],opts:{...WOPT,y:235}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // ===================== 小問3 =====================
 [K+'goal3']:(p,ctx)=>{
  const b=b2(ctx);
  let s=table({g:seg(p,0,.12)});
  s+=panel(90,330,kindTag('k! ＝ 1 × 2 × … × k',PC,140,{color:C.dim,size:24,g:seg(p,b,b+.08)})
   +fade(seg(p,b+.05,b+.15),label('2! ＝ 2、3! ＝ 6、4! ＝ 24',PC,195,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,b+.3,b+.4),line(PX+40,235,PX+PW-40,235,{color:C.faint,w:2})+label('k 次の 係数',PC,280,{size:26,color:C.dim,anchor:'middle'})
    +label('＝ k 回微分の値 ÷ k!',PC,330,{size:30,color:YL,anchor:'middle',weight:700})),seg(p,.03,.12));
  s+=goalTag(G3,{g:seg(p,.02,.12)});
  return s;
 },
 [K+'table']:(p,ctx)=>{
  const b=b2(ctx);
  const fill=[seg(p,.03,.1),seg(p,.08,.15),seg(p,.13,.2),seg(p,.25,.35),seg(p,b+.3,b+.4)];
  let s=table({fill,hl:seg(p,b+.1,b+.2)});
  s+=panel(90,250,T(`${UL}'''=6x`,PC,140,36)
   +fade(seg(p,.3,.4),T(`${UL}'''(2)=12`,PC,200,36))
   +fade(seg(p,b,b+.1),T(`\\dfrac{12}{3!}=\\dfrac{12}{6}={\\color{${YL}}2}`,PC,285,38)),1,C.hi);
  s+=goalTag(G3);
  return s;
 },
 [K+'exact']:(p,ctx)=>{
  const b=b2(ctx,.35);
  let s=table({fill:[1,1,1,1,1],hl:1,rowH:44});
  s+=panel(90,140,label('谷底からの ずれ',PC,140,{size:26,color:C.dim,anchor:'middle'})+T(`{\\color{${CS}}s}=x-2`,PC,195,38,{}),1,CS);
  const e=`${UL}\\,{\\color{${YL}}=}\\,-4+4{\\color{${CS}}s}^2+2{\\color{${CS}}s}^3+\\dfrac{{\\color{${CS}}s}^4}{4}`;
  s+=fade(seg(p,b,b+.12),card(40,400,1120,105,T(e,520,455,40),1));
  s+=fade(seg(p,b+.4,b+.5),label('ちょうど（≈ でなく ＝）',1000,440,{size:26,color:YL,anchor:'middle',weight:700})+label('4次式なので 4次の 項まで',1000,478,{size:22,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,b+.4,b+.5),ring(520-texWidth(e,40,false)/2+texWidth(`${UL}\\,`,40,false)+12,448,24,{color:YL,w:3}));
  s+=goalTag(G3);
  return s;
 },
 [K+'cubic']:(p,ctx)=>{
  const b=b2(ctx);
  let s=card(40,95,620,140,T(`${UL}=-4+4s^2+{\\color{${RD}}2s^3}+\\dfrac{s^4}{4}`,350,165,36),1);
  s+=fade(seg(p,.1,.2),label('ばね近似で 捨てた 項',470,225,{size:22,color:RD,anchor:'middle'}));
  s+=panel(90,330,label('2s³ の 力',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.25),T(`-\\dfrac{d(2s^3)}{ds}=-6s^2`,PC,205,36))
   +fade(seg(p,b,b+.1),line(PX+40,255,PX+PW-40,255,{color:C.faint,w:2})+T(`s=0.1:\\ \\ -6\\times0.01`,PC,300,34))
   +fade(seg(p,b+.12,b+.22),T(`={\\color{${RD}}-0.06\\ \\mathrm{N}}`,PC,365,38)),1);
  s+=fade(seg(p,b+.3,b+.4),forceBar({y:320,w:520,c:0}));
  s+=fade(seg(p,b+.4,b+.5),label('差 0.061 の 大部分',360,490,{size:26,color:RD,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=card(40,95,620,140,T(`${UL}=-4+4s^2+2s^3+{\\color{${CS}}\\dfrac{s^4}{4}}`,350,165,36),1);
  s+=forceBar({y:320,w:520,c:seg(p,.05,.15),tot:seg(p,b+.2,b+.3)});
  s+=panel(90,250,T(`-\\dfrac{d}{ds}\\dfrac{s^4}{4}=-s^3`,PC,145,32)
   +fade(seg(p,.1,.2),T(`=-0.001\\ \\mathrm{N}`,PC,210,32))
   +fade(seg(p,b,b+.12),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+T(`0.8+0.06+0.001=0.861`,PC,295,30)),1);
  s+=goalTag(G3)+ANS3(seg(p,b+.55,b+.62));
  return s;
 },
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5;
  let s=table({fill:[1,1,1,1,1],hl:1,rowH:44});
  s+=panel(90,110,T(`c_3=\\dfrac{12}{3!}=2`,PC,148,32),1,C.hi);
  s+=wrongSeq(p,ctx,[['A','係数 12',['3! で 割り忘れた','（12s³ の 力 −36s² ＝ −0.36）']],['B','係数 6',['2! で 割った','（6s³ の 力 −18s² ＝ −0.18）']],['D','係数 0',['U‴(2) ÷ 3! ＝ 2 で 0 でない','差は 捨てた 項から 計算できる']]],{win:[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.55,1]],opts:{...WOPT,y:220}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // ===================== まとめ =====================
 [K+'sum']:(p)=>{
  let s='';
  const terms=[['4s^2',YL,'ばね定数 8','F ≈ −8s'],['2s^3',RD,'3次の 項','力 −6s²'],['\\dfrac{s^4}{4}',CS,'4次の 項','力 −s³']];
  const e=`${UL}=-4+{\\color{${YL}}4s^2}+{\\color{${RD}}2s^3}+{\\color{${CS}}\\dfrac{s^4}{4}}`;
  s+=fade(seg(p,0,.1),card(150,95,900,100,T(e,600,150,40),1));
  // 各項の位置（だいたい）から矢印を下ろす
  const w=texWidth(e,40,false),x0=600-w/2,pos=[texWidth(`${UL}=-4+`,40,false),texWidth(`${UL}=-4+4s^2+`,40,false),texWidth(`${UL}=-4+4s^2+2s^3+`,40,false)];
  const tw=[texWidth('4s^2',40,false),texWidth('2s^3',40,false),texWidth('\\dfrac{s^4}{4}',40,false)];
  const tx=[220,600,980];
  terms.forEach(([t,col,a,bb],i)=>{
   const g=seg(p,.12+.1*i,.22+.1*i),fx=x0+pos[i]+tw[i]/2;
   s+=fade(g,arrow(fx,195,tx[i],235,{color:col,w:3,head:12})+card(tx[i]-150,240,300,90,label(a,tx[i],278,{size:24,color:col,anchor:'middle',weight:700})+label(bb,tx[i],316,{size:26,color:C.ink,anchor:'middle',weight:700}),1,col));
  });
  s+=fade(seg(p,.2,.28),label('U″＞0 のとき',tx[0],360,{size:24,color:C.hi,anchor:'middle',weight:700}));
  {const bx=340,by=385,bw=520,sc=bw/.9,h=40,g=seg(p,.45,.55);
   s+=fade(g,label('x ＝ 2.1 の 力の 大きさ',bx-14,by+30,{size:24,color:C.dim,anchor:'end'})
    +rect(bx,by,.8*sc,h,{fill:YL,fo:.55,stroke:YL,rx:3})+rect(bx+.8*sc,by,.06*sc,h,{fill:RD,fo:.45,stroke:RD,rx:2})+rect(bx+.86*sc,by,2,h,{fill:CS,fo:.9,stroke:CS,rx:1})
    +T(`{\\color{${YL}}0.8}+{\\color{${RD}}0.06}+{\\color{${CS}}0.001}=0.861\\ \\mathrm{N}`,bx+bw/2,by+h+50,32));}
  s+=answerRow([[1,'A',''],[2,'B',''],[3,'C','係数 2']],{g:seg(p,.65,.75)});
  return s;
 },
};
