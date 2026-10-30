// 問題編 解説「体の中で減る薬」（q-um-simple-derivative-equation、大学 08 微分方程式・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/08_微分方程式.md の q-um-simple-derivative-equation（解説 18 行）。
// 画面：左に y–t グラフ、右に説明の枠。誤答カードは右の列に1枚ずつ。出題中の図だけは、左に人の形・中央にグラフ・右に式。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色（この単元）：量 y 水色、時刻 t・半減の時間 金、傾き 黄、刻みの折れ線 灰、本当の曲線 水色の太線、誤り 赤の点線。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,sentWin,voiceEnd,QC} from './yt1-qx-common.mjs';

const K='qx-um-simple-derivative-equation:';
const RED=QC.bad,GR='#8d9ab0',CY=C.x,CT=C.t,HI=C.hi;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const yT=t=>200*Math.exp(-.1*t),LN2=Math.log(2),TH=LN2/.1;
const steps=(dt,tmax)=>{const n=Math.round(tmax/dt),pts=[[0,200]];let y=200;for(let i=1;i<=n;i++){y*=1-.1*dt;pts.push([i*dt,y]);}return pts;};
const G1='一歩の式で 2分後の量',G2='Δt＝10 分の一歩',G3='200→100 と 100→50 の時間';
const ANS1=g=>answerTag(1,'B','160 mg',{g}),ANS2=g=>answerTag(2,'C','',{g}),ANS3=g=>answerTag(3,'D','',{g});
const PX=600,PW=580,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WR={x:PX,w:PW,size:26,whySize:22};
const s2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
function clauseWin(ctx,i){
 const W=sentWin(ctx),[a,b]=W[Math.min(i,W.length-1)];
 const r=((ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean)[i])??'';
 const parts=r.split('、').filter(Boolean);if(parts.length<2)return [[a,b]];
 const tot=parts.reduce((s,x)=>s+x.length,0);let acc=0;
 return parts.map(x=>{const s0=a+(b-a)*acc/tot;acc+=x.length;return [s0,a+(b-a)*acc/tot];});
}

// ---- y–t グラフ（小問1・2：t 0〜11、小問3：t 0〜21）----
function graph({x=90,y=470,w=410,h=350,g=1,long=0}={}){
 const A=long?axes({x,y,w,h,xmin:0,xmax:21,ymin:0,ymax:220,xticks:[5,10,15,20],yticks:[50,100,150,200],xlabel:'t [分]',ylabel:'',xcolor:CT,g,grid:true})
  :axes({x,y,w,h,xmin:0,xmax:11,ymin:0,ymax:255,xticks:[2,4,6,8,10],yticks:[50,100,150,200,250],xlabel:'t [分]',ylabel:'',xcolor:CT,g,grid:true});
 return {A,svg:A.svg+fade(g,label('y [mg]',A.X(0)+14,(long?A.Y(220):A.Y(255))-8,{size:24,color:CY,weight:700}))};
}
const curve=(A,{p=1,from=0,to=10.8,w=6,color=CY}={})=>A.plot(yT,{from,to,p,color,w});
const pl=(A,pts,{p=1,color=GR,w=4,dash=''}={})=>draw(pts.map(([t,v])=>[A.X(t),A.Y(v)]),p,{color,w,dash});
const pt=(A,t,v,col,txt='',{dx=14,dy=-12,anchor='start',size=24}={})=>dot(A.X(t),A.Y(v),8,col)+(txt?label(txt,A.X(t)+dx,A.Y(v)+dy,{size,color:col,anchor,weight:700}):'');
const start=A=>pt(A,0,200,CY,'200',{dx:12,dy:-12});

// ---- 出題中の図：人の形と体の中の点、グラフ（出発点だけ）、式の枠 ----
const DOTS=Array.from({length:40},(_,i)=>{const a=Math.sin(i*12.9898)*43758.5453,b=Math.sin(i*78.233)*12543.21;return [118+((a-Math.floor(a))*84),200+((b-Math.floor(b))*180),(i*7)%40];});
function person(gone=0,{g=1}={}){
 let s=ring(160,140,36,{color:C.dim,w:3,fill:'#1b2438'});
 s+=rect(104,186,112,210,{fill:'#1b2438',fo:1,stroke:C.dim,sw:3,rx:40});
 s+=line(135,396,128,470,{color:C.dim,w:10})+line(185,396,192,470,{color:C.dim,w:10});
 s+=line(106,215,70,330,{color:C.dim,w:10})+line(214,215,250,330,{color:C.dim,w:10});
 const nGone=Math.round(16*gone);
 for(const [x,y,r] of DOTS){const gg=r<nGone?0:1;if(gg)s+=dot(x,y,5.5,CY);}
 return fade(g,s);
}
function setup(p,{gP=1,gone=1,gAx=1,gPt=1,gEq=1}={}){
 let s=person(gone,{g:gP});
 const A=axes({x:350,y:470,w:360,h:330,xmin:0,xmax:21,ymin:0,ymax:220,xticks:[5,10,15,20],yticks:[50,100,150,200],xlabel:'t [分]',ylabel:'',xcolor:CT,g:gAx,grid:true});
 s+=A.svg+fade(gAx,label('y [mg]',A.X(0)+14,A.Y(220)-8,{size:24,color:CY,weight:700}));
 s+=fade(gPt,dot(A.X(0),A.Y(200),9,CY)+label('200',A.X(0)+14,A.Y(200)-12,{size:24,color:CY,weight:700}));
 s+=card(800,96,380,250,T('\\dfrac{dy}{dt}=-0.1\\,y',990,170,40,{auto:false})+label('k ＝ 0.1 /分',990,255,{size:32,color:C.ink,anchor:'middle',weight:700})
  +label('t＝0 で 200 mg',990,310,{size:26,color:C.dim,anchor:'middle'}),gEq);
 s+=card(800,366,380,120,label('（参考）動画の例 k ＝ 0.2 /s：',990,412,{size:22,color:C.dim,anchor:'middle'})+label('半分まで 約 3.47 s',990,455,{size:24,color:C.dim,anchor:'middle',weight:700}),gEq,C.faint);
 return s;
}

// 行8（true10・true10b）の画面
function true10Scene({gc=1,gf=1,g74=1,gt=1,gk=1,g2=1}={}){
 const {A,svg}=graph();
 let s=svg;
 const top=Array.from({length:41},(_,i)=>{const t=10*i/40;return [A.X(t),A.Y(yT(t))];});
 s+=fade(gf,poly([...top,[A.X(10),A.Y(0)],[A.X(0),A.Y(200)]],{fill:HI,fo:.3}));
 s+=pl(A,[[0,200],[10,0]])+curve(A,{p:gc})+start(A)+pt(A,10,0,GR);
 s+=fade(g74,dot(A.X(10),A.Y(yT(10)),8,CY)+label('本当は 約 74 mg',A.X(10)-6,A.Y(yT(10))+40,{size:24,color:CY,weight:700,anchor:'end'}));
 s+=fade(g2,pl(A,steps(2,10),{color:'#c9d2e0',w:3})+label('2分刻み',A.X(4.3),A.Y(160),{size:22,color:'#c9d2e0',weight:700}));
 s+=panel(88,330,label('このモデルの 本当の 解',PC,132,{size:26,color:CY,anchor:'middle',weight:700})
  +fade(gt,T(`y=200\\,e^{-0.1t}`,PC,185,34,{color:CY}))
  +fade(g74,label('10分後も 約 74 mg 残る',PC,240,{size:26,color:CY,anchor:'middle',weight:700}))
  +fade(gk,line(PX+40,265,PX+PW-40,265,{color:C.faint,w:2})+label('k Δt ＝ 0.1 × 10 ＝ 1',PC,310,{size:30,color:RED,anchor:'middle',weight:700})+label('0 mg は 刻みを 粗くしすぎた 近似',PC,355,{size:26,color:RED,anchor:'middle',weight:700}))
  +fade(g2,label('k Δt ＝ 0.2（2分刻み）なら 曲線に 近い',PC,400,{size:22,color:'#c9d2e0',anchor:'middle',weight:700})),1);
 return s+goalTag(G2);
}

export const ytQxUmSimpleDerivativeEquationDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6秒）：0〜2 s 人の形と水色の点。2〜5 s 点が少しずつ消える、グラフに出発点 200。5〜6 s 式・k の札・参考の札。静止。
 // 傾きの矢印・一歩の折れ線・本当の曲線・半分になる時間は出さない。
 [K+'q1']:(p)=>setup(p,{gP:seg(p,0,.2),gone:seg(p,.34,.82),gAx:seg(p,.3,.45),gPt:seg(p,.42,.52),gEq:seg(p,.84,.97)}),

 // ===================== 小問1 =====================
 // 1. 出題中の最後の静止画。「求めるもの」
 [K+'goal1']:(p)=>setup(1)+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 「近似」タグ。出発点に傾き −ky（黄の矢印）、一歩進む灰の線分、yᵢ・yᵢ₊₁ の札を先に置き、そのあと式と「≈」の光
 [K+'euler']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),b=cw[1]?cw[1][0]:.45,{A,svg}=graph();
  let s=svg+start(A);
  s+=fade(seg(p,.08,.18),arrow(A.X(0),A.Y(200),A.X(1.6),A.Y(200-20*1.6),{color:HI,w:5,head:16})+label('傾き −ky',A.X(1.7)+6,A.Y(176),{size:24,color:HI,weight:700}));
  s+=pl(A,[[0,200],[2,160]],{p:seg(p,.2,.32)});
  s+=fade(seg(p,b,b+.06),line(A.X(0)+6,A.Y(200)-6,A.X(.8),A.Y(228),{color:C.dim,w:2})+T('y_i',A.X(.8)+18,A.Y(232),30,{auto:false,color:CY})+label('（今の 量）',A.X(.8)+40,A.Y(232)+8,{size:24,color:CY,weight:700}));
  s+=fade(seg(p,b+.06,b+.12),dot(A.X(2),A.Y(160),8,GR)+line(A.X(2)+6,A.Y(160)+6,A.X(3.4),A.Y(128),{color:C.dim,w:2})+T('y_{i+1}',A.X(3.4)+28,A.Y(122),30,{auto:false,color:GR})+label('（一歩後の 量）',A.X(3.4)+60,A.Y(122)+8,{size:24,color:GR,weight:700}));
  s+=fade(seg(p,b,b+.06),line(A.X(0),A.Y(0)+14,A.X(2),A.Y(0)+14,{color:CT,w:4})+label('Δt',A.X(1),A.Y(0)-10,{size:24,color:CT,anchor:'middle',weight:700}));
  const fx='y_{i+1}\\approx y_i\\,(1-k\\,\\Delta t)',fw=texWidth(fx,40,false),ax=PC-fw/2+texWidth('y_{i+1}',40,false);
  s+=panel(88,390,kindTag('近似',PC,140,{g:seg(p,.03,.12)})
   +fade(seg(p,.06,.16),label('短い Δt の 間は',PC,200,{size:28,color:C.ink,anchor:'middle',weight:700})+label('傾き −ky を 一定と みなす',PC,240,{size:28,color:HI,anchor:'middle',weight:700}))
   +fade(seg(p,b+.15,b+.25),line(PX+40,275,PX+PW-40,275,{color:C.faint,w:2})+label('一歩の 式',PC,318,{size:24,color:C.dim,anchor:'middle'})+T(fx,PC,385,40,{auto:false})
    +highlight(ax-2,350,46,62,seg(p,b+.3,b+.38)))
   +fade(seg(p,b+.38,b+.46),label('≈ は 近似',ax+20,450,{size:24,color:HI,anchor:'middle',weight:700})),1);
  return s+goalTag(G1);
 },
 // 3. 1−0.1×2＝0.8 → 200×0.8＝160。灰の線分が t＝2 で 160。答え B
 [K+'calc1']:(p,ctx)=>{
  const b=s2(ctx,.7),{A,svg}=graph();
  let s=svg+start(A)+pl(A,[[0,200],[2,160]])+fade(seg(p,.4,.5),pt(A,2,160,GR,'y ≈ 160',{dx:12,dy:-12}));
  s+=panel(88,300,label('k ＝ 0.1、Δt ＝ 2',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.15),T('1-0.1\\times2=0.8',PC,215,40,{auto:false}))+fade(seg(p,.25,.35),T('200\\times0.8=160\\ \\mathrm{mg}',PC,300,40,{auto:false})),1);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.08));
 },
 // 4. 誤答 A（180）→ 誤答 C（240、上向きの赤の点線）
 [K+'wrongAC']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),w1=cw[0],w2=[cw[1]?cw[1][0]:.5,1],{A,svg}=graph();
  const inA=seg(p,w1[0]+.01,w1[0]+.05)*(1-seg(p,w1[1]-.04,w1[1])),inC=seg(p,w2[0]+.01,w2[0]+.05);
  let s=svg+start(A)+pl(A,[[0,200],[2,160]])+pt(A,2,160,GR,'≈ 160',{dx:12,dy:22});
  s+=fade(inA,dot(A.X(2),A.Y(180),8,RED)+label('180',A.X(2)+12,A.Y(180)-8,{size:24,color:RED,weight:700}));
  s+=fade(inC,line(A.X(0),A.Y(200),A.X(2),A.Y(240),{color:RED,w:4,dash:'10 8'})+dot(A.X(2),A.Y(240),8,RED)+label('240',A.X(2)+12,A.Y(240)+8,{size:24,color:RED,weight:700}));
  s+=panel(88,170,label('一歩の 式',PC,128,{size:24,color:C.dim,anchor:'middle'})+T('200\\times(1-0.1\\times2)=160',PC,195,34,{auto:false}),1);
  s+=wrongSeq(p,ctx,[['A','180 mg','Δt＝2 を 掛け忘れ、1分分だけ 減らした'],['C','240 mg','負号を 落とし、増える 式に した']],{win:[w1,w2],opts:{...WR,y:290}});
  return s+goalTag(G1)+ANS1(1);
 },
 // 5. 誤答 D（40）：t＝2 の縦の線を、減った 40（赤の薄い帯）と残り 160（水色の帯）に色分け
 [K+'wrongD1']:(p)=>{
  const {A,svg}=graph(),g=seg(p,.05,.2);
  let s=svg+start(A)+pl(A,[[0,200],[2,160]])+pt(A,2,160,GR);
  s+=fade(g,rect(A.X(2)-12,A.Y(160),24,A.Y(0)-A.Y(160),{fill:CY,fo:.45,stroke:CY,rx:3})+rect(A.X(2)-12,A.Y(200),24,A.Y(160)-A.Y(200),{fill:RED,fo:.3,stroke:RED,rx:3})
   +line(A.X(0),A.Y(200),A.X(2)+30,A.Y(200),{color:C.faint,w:2,dash:'5 6'})
   +label('減った 40',A.X(2)+22,A.Y(180)+8,{size:24,color:RED,weight:700})+label('残り 160',A.X(2)+22,A.Y(80),{size:24,color:CY,weight:700}));
  s+=panel(88,170,label('2分後',PC,128,{size:24,color:C.dim,anchor:'middle'})+label('200 ＝ 160（残り）＋ 40（減った）',PC,192,{size:28,color:C.ink,anchor:'middle',weight:700}),1);
  s+=wrongCard('D','40 mg','減った 量と 残りを 取り違えた',{...WR,y:290,g:seg(p,.03,.1)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 6. カードを消す。2 分の一歩は薄く残す
 [K+'goal2']:(p)=>{
  const {A,svg}=graph();
  let s=svg+start(A)+fade(1-.6*seg(p,.02,.15),pl(A,[[0,200],[2,160]])+pt(A,2,160,GR));
  s+=panel(88,240,label('一歩の 式',PC,140,{size:24,color:C.dim,anchor:'middle'})+T('y_{i+1}\\approx y_i\\,(1-k\\,\\Delta t)',PC,205,38,{auto:false})
   +label('Δt ＝ 2 → 10 分 に する',PC,285,{size:30,color:CT,anchor:'middle',weight:700}),seg(p,.05,.18),HI);
  return s+goalTag(G2,{g:seg(p,.03,.12)});
 },
 // 7. 出発点の黄の傾きに沿って 10 分進む灰の線分が、t＝10 で 0 に落ちる
 [K+'step10']:(p)=>{
  const {A,svg}=graph();
  let s=svg+start(A)+fade(.4,pl(A,[[0,200],[2,160]]));
  s+=fade(seg(p,.02,.1),arrow(A.X(0),A.Y(200),A.X(1.6),A.Y(168),{color:HI,w:5,head:16}));
  s+=pl(A,[[0,200],[10,0]],{p:seg(p,.1,.4)})+fade(seg(p,.38,.45),pt(A,10,0,GR,'0',{dx:0,dy:-16,anchor:'middle'}));
  s+=panel(88,300,label('k ＝ 0.1、Δt ＝ 10',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.28),T('1-0.1\\times10=0',PC,215,40,{auto:false}))+fade(seg(p,.35,.48),T('200\\times0=0\\ \\mathrm{mg}',PC,300,40,{auto:false})),1);
  return s+goalTag(G2);
 },
 // 8a. 本当の曲線（水色）が t＝10 で 0 の上（約 74 mg）に残る。差を黄。右の枠に本当の解 200e^(−0.1t)（2026-10-16 PQ-011）
 // 8b. 「kΔt＝1」で刻みを粗くしすぎた近似。2 分刻み（kΔt＝0.2）の折れ線と並べる
 [K+'true10']:(p)=>true10Scene({gc:seg(p,.03,.45),gf:seg(p,.45,.7),g74:seg(p,.6,.72),gt:seg(p,.06,.16),gk:0,g2:0}),
 [K+'true10b']:(p)=>true10Scene({gk:seg(p,.02,.1),g2:seg(p,.35,.5)}),
 // 9. 答え C
 [K+'ans2']:(p)=>{
  const {A,svg}=graph();
  let s=svg+pl(A,[[0,200],[10,0]])+curve(A)+start(A)+pt(A,10,0,GR,'0',{dx:0,dy:-16,anchor:'middle'})+dot(A.X(10),A.Y(yT(10)),8,CY)+label('本当は 約 74 mg',A.X(10)-6,A.Y(yT(10))+40,{size:24,color:CY,weight:700,anchor:'end'});
  s+=panel(88,240,label('一歩の 式（Δt＝10）',PC,140,{size:26,color:C.dim,anchor:'middle'})+label('0 mg',PC,200,{size:34,color:GR,anchor:'middle',weight:700})
   +label('ただし kΔt ＝ 1 で 刻みが 粗すぎ',PC,262,{size:26,color:RED,anchor:'middle',weight:700}),1);
  return s+goalTag(G2)+ANS2(seg(p,.35,.5));
 },
 // 10. 誤答 A → 誤答 B
 [K+'wrongAB2']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),w1=cw[0],w2=[cw[1]?cw[1][0]:.5,1],{A,svg}=graph();
  let s=svg+pl(A,[[0,200],[10,0]])+curve(A)+start(A)+pt(A,10,0,GR)+dot(A.X(10),A.Y(yT(10)),8,CY)+label('約 74 mg',A.X(10)-6,A.Y(yT(10))+40,{size:24,color:CY,weight:700,anchor:'end'});
  s+=panel(88,170,label('一歩の 式 ＝ 始めの 傾きの まま 進む 近似',PC,140,{size:24,color:C.ink,anchor:'middle',weight:700})+label('本当の y は 0 に 近づくだけ',PC,195,{size:26,color:CY,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[['A','0 mg・正確な 式','一歩の 式は 近似。Δt が 大きいほど ずれる'],['B','0 mg・10分で すべて 出る',['本当は 10分後も 約 74 mg 残る','0 は 刻みの 粗さ']]],{win:[w1,w2],opts:{...WR,y:290}});
  return s+goalTag(G2)+ANS2(1);
 },
 // 11. 誤答 D（100 mg）
 [K+'wrongD2']:(p)=>{
  const {A,svg}=graph();
  let s=svg+pl(A,[[0,200],[10,0]])+curve(A)+start(A)+pt(A,10,0,GR)+dot(A.X(10),A.Y(yT(10)),8,CY);
  s+=fade(seg(p,.1,.2),dot(A.X(10),A.Y(100),8,RED)+label('100 ?',A.X(10)-12,A.Y(100)+8,{size:24,color:RED,weight:700,anchor:'end'}));
  s+=panel(88,170,label('Δt＝10 の 一歩の 式',PC,128,{size:24,color:C.dim,anchor:'middle'})+T('200\\times(1-0.1\\times10)=0',PC,195,34,{auto:false}),1);
  s+=wrongCard('D','100 mg',['一歩の 式で 計算していない','半分の 時間は 約 6.9 分'],{...WR,y:290,g:seg(p,.03,.1)});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 12. 折れ線・カードを消し、水色の曲線だけ。100 と 50 の高さに横の点線
 [K+'goal3']:(p)=>{
  const {A,svg}=graph({long:1});
  let s=svg+curve(A,{to:20.5})+start(A);
  s+=fade(seg(p,.15,.3),line(A.X(0),A.Y(100),A.X(20.5),A.Y(100),{color:C.dim,w:2,dash:'6 7'})+line(A.X(0),A.Y(50),A.X(20.5),A.Y(50),{color:C.dim,w:2,dash:'6 7'})
   +label('100',A.X(0)-12,A.Y(100)+8,{size:22,color:CY,anchor:'end',weight:700})+label('50',A.X(0)-12,A.Y(50)+8,{size:22,color:CY,anchor:'end',weight:700}));
  s+=panel(88,240,label('200 → 100 に かかる 時間',PC,165,{size:30,color:CT,anchor:'middle',weight:700})+label('100 → 50 に かかる 時間',PC,230,{size:30,color:CT,anchor:'middle',weight:700}),seg(p,.05,.18),HI);
  return s+goalTag(G3,{g:seg(p,.03,.12)});
 },
 // 13a. 曲線の横に y＝200×e^(−0.1t)
 [K+'curve']:(p)=>{
  const {A,svg}=graph({long:1});
  let s=svg+pl(A,steps(2,20),{color:'#c9d2e0',w:2.5,p:seg(p,.05,.3)})+fade(seg(p,.25,.4),pl(A,steps(.5,20),{color:'#e9eef6',w:2}))+curve(A,{to:20.5})+start(A);
  s+=fade(seg(p,.05,.2),label('刻みを 細かく →',A.X(9),A.Y(150),{size:24,color:'#c9d2e0',weight:700}));
  s+=panel(88,240,label('近づく 曲線',PC,140,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.5,.65),T('y=200\\,e^{-0.1t}',PC,225,48)),1);
  return s+goalTag(G3);
 },
 // 13b. e の右上の kt に黄の枠。「残る割合は kt だけで決まる」
 [K+'curve2']:(p)=>{
  const {A,svg}=graph({long:1});
  let s=svg+curve(A,{to:20.5})+start(A);
  s+=panel(88,395,label('近づく 曲線',PC,140,{size:26,color:C.dim,anchor:'middle'})+T(`y=200\\,e^{{\\color{${HI}}\\boxed{-0.1t}}}`,PC,225,48)
   +fade(seg(p,.15,.3),label('残る 割合',PC,320,{size:26,color:C.dim,anchor:'middle'})+T(`\\dfrac{y}{200}=e^{{\\color{${HI}}-kt}}`,PC,385,40))
   +fade(seg(p,.4,.55),label('肩の kt だけで 決まる',PC,455,{size:28,color:HI,anchor:'middle',weight:700})),1);
  return s+goalTag(G3);
 },
 // 14. 小さな枠で、動画の曲線（k＝0.2、横軸 秒）と「3.47 s で半分」「kt＝0.2×3.47≈0.69」
 [K+'video']:(p)=>{
  const {A,svg}=graph({long:1});
  let s=svg+curve(A,{to:20.5})+start(A);
  const zx=PX+50,zy=150,zw=PW-100,zh=200,Zt=u=>zx+zw*u/11,Zy=v=>zy+zh-zh*v/220;
  let z=label('動画の 例（k ＝ 0.2 /s）',PC,125,{size:24,color:C.dim,anchor:'middle'});
  z+=line(zx,zy+zh,zx+zw,zy+zh,{color:C.dim,w:2})+line(zx,zy,zx,zy+zh,{color:C.dim,w:2})+label('秒',zx+zw+8,zy+zh+8,{size:22,color:CT});
  z+=draw(Array.from({length:61},(_,i)=>{const u=10.5*i/60;return [Zt(u),Zy(200*Math.exp(-.2*u))];}),seg(p,.05,.25),{color:C.v,w:4});
  const u2=LN2/.2;
  z+=fade(seg(p,.25,.35),line(zx,Zy(100),Zt(u2),Zy(100),{color:CT,w:4})+dot(Zt(u2),Zy(100),7,C.v)+label('3.47 s で 半分',Zt(u2)+12,Zy(100)-10,{size:24,color:CT,weight:700}));
  s+=panel(88,400,z+fade(seg(p,.5,.62),label('kt ＝ 0.2 × 3.47 ≈ 0.69',PC,420,{size:30,color:HI,anchor:'middle',weight:700})),1);
  return s+goalTag(G3);
 },
 // 15. 動画の曲線を横に 2 倍に引き伸ばすと重なる（k が半分 → 時間は 2 倍）。続けて 200→100 と 100→50 の横幅（金）、どちらも約 6.9 分
 [K+'stretch']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),c2=cw[1]?cw[1][0]:.55,{A,svg}=graph({long:1});
  const st=1+seg(p,.08,.35),gv=1-seg(p,.4,.5);
  let s=svg+curve(A,{to:20.5});
  s+=fade(gv,A.plot(u=>200*Math.exp(-.2*u/st),{from:0,to:20.5,color:C.v,w:4,dash:'10 7'})+label('動画の 曲線（k ＝ 0.2）',A.X(3.2*st)+10,A.Y(200*Math.exp(-.2*3.2))-6,{size:22,color:C.v,weight:700}));
  s+=start(A);
  const w1=seg(p,.4,.5),w2=seg(p,c2+.02,c2+.12);
  s+=fade(w1,line(A.X(0),A.Y(100),A.X(TH),A.Y(100),{color:CT,w:6})+dot(A.X(TH),A.Y(100),7,CY)+label('約 6.9 分',A.X(TH/2),A.Y(100)+30,{size:24,color:CT,anchor:'middle',weight:700}));
  s+=fade(w2,line(A.X(TH),A.Y(50),A.X(2*TH),A.Y(50),{color:CT,w:6})+dot(A.X(2*TH),A.Y(50),7,CY)+label('約 6.9 分',A.X(1.5*TH),A.Y(50)+30,{size:24,color:CT,anchor:'middle',weight:700}));
  s+=panel(88,340,label('k が 半分 → 時間は 2 倍',PC,145,{size:30,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.38,.48),T('kt=0.1\\times t=0.69',PC,220,38,{auto:false})+T('t\\approx6.9\\ \\text{分}',PC,290,38,{auto:false}))
   +fade(w2,line(PX+40,330,PX+PW-40,330,{color:C.faint,w:2})+label('100 → 50 も 約 6.9 分',PC,385,{size:30,color:CT,anchor:'middle',weight:700})),1);
  return s+goalTag(G3);
 },
 // 16. 2つの金の横幅を重ねて同じ長さ。答え D
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx,.6),{A,svg}=graph({long:1}),mv=seg(p,.1,.35);
  let s=svg+curve(A,{to:20.5})+start(A);
  s+=line(A.X(0),A.Y(100),A.X(TH),A.Y(100),{color:CT,w:6})+label('約 6.9 分',A.X(TH/2),A.Y(100)+30,{size:24,color:CT,anchor:'middle',weight:700});
  s+=line(A.X(TH),A.Y(50),A.X(2*TH),A.Y(50),{color:CT,w:6})+label('約 6.9 分',A.X(1.5*TH),A.Y(50)+30,{size:24,color:CT,anchor:'middle',weight:700});
  // 重ねて比べる（下の帯に二本を並べる）
  const by=A.Y(0)-20;
  s+=fade(mv,line(A.X(0),by-14,A.X(TH),by-14,{color:CT,w:6})+line(A.X(0),by+2,A.X(TH),by+2,{color:CT,w:6})+label('同じ 長さ',A.X(TH)+12,by+2,{size:24,color:CT,weight:700}));
  s+=panel(88,280,label('量が 減っても',PC,145,{size:28,color:C.ink,anchor:'middle',weight:700})+label('減る 割合 k は 変わらない',PC,195,{size:30,color:HI,anchor:'middle',weight:700})
   +line(PX+40,235,PX+PW-40,235,{color:C.faint,w:2})+label('半分に なる 時間は いつも 約 6.9 分',PC,290,{size:26,color:CT,anchor:'middle',weight:700}),1);
  return s+goalTag(G3)+ANS3(seg(p,b,b+.08));
 },
 // 17. 誤答 A（約 1.7 分）
 [K+'wrongA3']:(p)=>{
  const {A,svg}=graph({long:1});
  let s=svg+curve(A,{to:20.5})+start(A)+line(A.X(0),A.Y(100),A.X(TH),A.Y(100),{color:CT,w:6})+line(A.X(TH),A.Y(50),A.X(2*TH),A.Y(50),{color:CT,w:6});
  s+=panel(88,170,label('動画 k ＝ 0.2 → 3.47',PC,135,{size:28,color:C.ink,anchor:'middle',weight:700})+label('k ＝ 0.1（半分）→ 約 6.9（2 倍）',PC,190,{size:28,color:CT,anchor:'middle',weight:700}),1);
  s+=wrongCard('A','約 1.7 分','k が 半分なら T は 2 倍',{...WR,y:290,g:seg(p,.03,.1)});
  return s+goalTag(G3)+ANS3(1);
 },
 // 18. 誤答 B → 誤答 C（傾き −20 の直線、赤の点線が t＝5 で 100）。声のあと、まとめの静止画
 [K+'wrongBC3']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),w1=cw[0],w2=[cw[1]?cw[1][0]:.5,1],ve=voiceEnd(ctx),fin=seg(p,ve+.02,ve+.1),{A,svg}=graph({long:1});
  const inC=seg(p,w2[0]+.01,w2[0]+.05);
  let s=svg+curve(A,{to:20.5})+start(A)+line(A.X(0),A.Y(100),A.X(TH),A.Y(100),{color:CT,w:6})+line(A.X(TH),A.Y(50),A.X(2*TH),A.Y(50),{color:CT,w:6});
  s+=fade(inC*(1-fin),line(A.X(0),A.Y(200),A.X(10),A.Y(0),{color:RED,w:4,dash:'10 8'})+dot(A.X(5),A.Y(100),8,RED)+label('5 分',A.X(5)+10,A.Y(100)+28,{size:24,color:RED,weight:700}));
  s+=fade(1-fin,panel(88,170,label('半分に なる 時間',PC,135,{size:26,color:C.dim,anchor:'middle'})+label('200→100：約 6.9 分　100→50：約 6.9 分',PC,190,{size:26,color:CT,anchor:'middle',weight:700}),1));
  s+=fade(1-fin,wrongSeq(p,ctx,[['B','6.9 分、3.5 分','量が 半分でも 時間は 縮まない'],['C','5 分','初めの 20 mg/分の まま 一定に 減らした']],{win:[w1,w2],opts:{...WR,y:290}})+goalTag(G3)+ANS3(1));
  // まとめの静止画：2 分の一歩（200→160）、10 分で 0 に落ちる折れ線（赤）、水色の曲線、6.9 分の横幅を金の印でつなぐ
  s+=fade(fin,pl(A,[[0,200],[2,160]],{w:5})+pt(A,2,160,GR,'160',{dx:10,dy:-10})+line(A.X(0),A.Y(200),A.X(10),A.Y(0),{color:RED,w:4,dash:'10 8'})
   +label('10 分で 0（粗すぎ）',A.X(10)+8,A.Y(0)-14,{size:22,color:RED,weight:700})
   +dot(A.X(TH),A.Y(100),7,CY)+dot(A.X(2*TH),A.Y(50),7,CY)+label('6.9 分',A.X(TH/2),A.Y(100)-14,{size:22,color:CT,anchor:'middle',weight:700})+label('6.9 分',A.X(1.5*TH),A.Y(50)-14,{size:22,color:CT,anchor:'middle',weight:700})
   +line(A.X(TH),A.Y(100),A.X(TH),A.Y(50),{color:CT,w:2,dash:'4 5'}));
  s+=fade(fin,panel(150,300,label('小問1　一歩の 式（Δt＝2）',PC,200,{size:24,color:C.dim,anchor:'middle'})+label('200 × 0.8 ＝ 160 mg',PC,240,{size:28,color:GR,anchor:'middle',weight:700})
   +label('小問2　Δt＝10 は kΔt＝1 で 粗すぎ',PC,300,{size:24,color:C.dim,anchor:'middle'})+label('0 mg（本当は 約 74 mg）',PC,340,{size:28,color:RED,anchor:'middle',weight:700})
   +label('小問3　半分に なる 時間',PC,395,{size:24,color:C.dim,anchor:'middle'})+label('どちらも 約 6.9 分',PC,432,{size:28,color:CT,anchor:'middle',weight:700}),1));
  s+=answerRow([[1,'B','160 mg'],[2,'C',''],[3,'D','']],{g:fin});
  return s;
 },
};
