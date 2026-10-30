// 問題編 解説「エンジンを止めたボート」（q-ui-rate-equation、大学 08 微分方程式・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/08_微分方程式.md の q-ui-rate-equation（解説 17 行）。
// 画面：左に v–t グラフ、右に説明の枠（表・式・拡大図）。誤答カードは右の列に1枚ずつ。出題中の図だけは、上にボート・下にグラフ。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色（この単元）：速度 v 紫、時刻 t 金、傾き（減る速さ）黄、刻みの折れ線 灰、本当の曲線 水色の太線、誤り 赤の点線。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,sentWin,voiceEnd,cueT,QC} from './yt1-qx-common.mjs';

const K='qx-ui-rate-equation:';
const RED=QC.bad,GR='#8d9ab0',CV=C.v,CT=C.t,CY=C.x,HI=C.hi;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const vT=t=>40*Math.exp(-.25*t);
const euler=(dt,tmax=2)=>{const n=Math.round(tmax/dt),pts=[[0,40]];let v=40;for(let i=1;i<=n;i++){v*=1-.25*dt;pts.push([i*dt,v]);}return pts;};
const G1='1秒刻みで追った 2秒後の速さ',G2='両方を満たす関数',G3='本当の 2秒後と 22.5 の関係';
const ANS1=g=>answerTag(1,'C','22.5 m/s',{g}),ANS2=g=>answerTag(2,'D','',{g}),ANS3=g=>answerTag(3,'A','',{g});
const PX=600,PW=580,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WR={x:PX,w:PW,size:26,whySize:22};
const s2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
// 文 i を「、」で区切った区間（読みのかなの長さで割り振る）
function clauseWin(ctx,i){
 const W=sentWin(ctx),[a,b]=W[Math.min(i,W.length-1)];
 const r=((ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean)[i])??'';
 const parts=r.split('、').filter(Boolean);if(parts.length<2)return [[a,b]];
 const tot=parts.reduce((s,x)=>s+x.length,0);let acc=0;
 return parts.map(x=>{const s0=a+(b-a)*acc/tot;acc+=x.length;return [s0,a+(b-a)*acc/tot];});
}

// ---- v–t グラフ ----
function graph({x=90,y=470,w=410,h=350,g=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:3.2,ymin:0,ymax:44,xticks:[1,2,3],yticks:[10,20,30,40],xlabel:'t [s]',ylabel:'',xcolor:CT,g,grid:true});
 return {A,svg:A.svg+fade(g,label('v [m/s]',A.X(0)+14,A.Y(44)-8,{size:24,color:CV,weight:700}))};
}
const curve=(A,{p=1,from=0,to=3.1,w=6,color=CY}={})=>A.plot(vT,{from,to,p,color,w});
// 小問3：t＝2 の二つの値（引き出し線つき）と「減らしすぎ」
function gapMarks(A,{gT=1,gE=1,gB=1}={}){
 const L=A.X(2.6);
 let s=fade(gE,dot(A.X(2),A.Y(22.5),8,GR)+line(A.X(2)+8,A.Y(22.5)+4,L,A.Y(12)-8,{color:GR,w:2})+label('1秒刻み ≈ 22.5',L+4,A.Y(12)+2,{size:22,color:GR,weight:700}));
 s+=fade(gT,dot(A.X(2),A.Y(vT(2)),8,CY)+line(A.X(2)+8,A.Y(vT(2))-4,L,A.Y(32)+6,{color:CY,w:2})+label('本当 ≈ 24.3',L+4,A.Y(32),{size:24,color:CY,weight:700}));
 s+=fade(gB,line(A.X(2)+14,A.Y(vT(2))+2,A.X(2)+14,A.Y(22.5)-2,{color:HI,w:5})+label('減らしすぎ',A.X(2)+24,A.Y(23.38)+9,{size:24,color:HI,weight:700}));
 return s;
}
const C3=A=>curve(A,{to:2});
const poly1=(A,pts,{p=1,color=GR,w=4,dash=''}={})=>draw(pts.map(([t,v])=>[A.X(t),A.Y(v)]),p,{color,w,dash});
const pt=(A,t,v,col,txt='',{dx=14,dy=-12,anchor='start',size=24}={})=>dot(A.X(t),A.Y(v),8,col)+(txt?label(txt,A.X(t)+dx,A.Y(v)+dy,{size,color:col,anchor,weight:700}):'');
// 点 (t0,v0) を通る傾き k の短い線分（黄）
const slope=(A,t0,v0,k,len=.5,o={})=>line(A.X(t0),A.Y(v0),A.X(t0+len),A.Y(v0+k*len),{color:HI,w:5,...o});

// ---- ボート（出題中の図）----
function boat(x,y,{g=1,smoke=0,tt=0}={}){
 let s=poly([[x-70,y-24],[x+60,y-24],[x+78,y-40],[x+70,y],[x-62,y]],{fill:'#2b3f5e',fo:1,stroke:C.ink,sw:2.5});
 s+=rect(x-40,y-58,62,34,{fill:'#3d5478',fo:1,stroke:C.ink,sw:2,rx:4})+rect(x-30,y-52,16,14,{fill:'#a8c4e8',fo:.7,stroke:'none',rx:2})+rect(x-6,y-52,16,14,{fill:'#a8c4e8',fo:.7,stroke:'none',rx:2});
 s+=rect(x-64,y-50,14,26,{fill:'#55607a',fo:1,stroke:C.dim,sw:2,rx:2});
 if(smoke>0)for(let i=0;i<4;i++){const ph=(tt*1.6+i/4)%1;s+=fade(smoke*(1-ph)*.8,ring(x-60-ph*40,y-60-ph*46,8+ph*14,{color:'#b9c2d0',w:2,fill:'#6b7486'}));}
 return fade(g,s);
}
const WATER=178;
function water(off=0){
 let s=rect(30,WATER,1140,26,{fill:'#4a6688',fo:.35,stroke:'none',rx:4});
 const pts=[];for(let x=30;x<=1170;x+=6)pts.push([x,WATER+3*Math.sin((x+off)/22)]);
 return s+draw(pts,1,{color:'#7d98b8',w:3});
}
// 出題中の図：上にボートと水面、下に v–t グラフ（出発点だけ）、右に式の枠
const BK=4.5;           // 画面の速さ：1 m/s あたり 4.5 px/s
const boatX=t=>t<2?120+BK*40*t:120+BK*40*2+BK*160*(1-Math.exp(-.25*(t-2)));
function setup(t,{gAx=1,gPt=1,gTag=0,gEq=0,pause=0}={}){
 const tt=Math.min(t,6);
 let s=water(boatX(tt)*.2)+boat(boatX(tt),WATER,{smoke:1-clamp((tt-1.2)/.8),tt});
 const A=axes({x:110,y:480,w:430,h:220,xmin:0,xmax:3.2,ymin:0,ymax:44,xticks:[1,2,3],yticks:[10,20,30,40],xlabel:'t [s]',ylabel:'',xcolor:CT,g:gAx,grid:true});
 s+=A.svg+fade(gAx,label('v [m/s]',A.X(0)+14,A.Y(44)-8,{size:24,color:CV,weight:700}));
 s+=fade(gPt,dot(A.X(0),A.Y(40),9,CV)+label('40',A.X(0)+16,A.Y(40)+8,{size:26,color:CV,weight:700}));
 s+=fade(gTag,rect(700,232,330,46,{fill:'#2a3346',fo:.95,stroke:C.dim,sw:2,rx:23})+label('速さが 減っていく',865,264,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=card(640,296,520,190,T('\\dfrac{dv}{dt}=-0.25\\,v',900,360,40)+T('e^{-0.5}\\approx0.607',900,445,36),gEq);
 if(pause)s+=pauseBadge({g:pause,x:560,y:92});
 return s;
}

// ---- 表（小問2）：候補／時刻／左の辺 dv/dt／右の辺 −0.25v ----
const TX={c:640,t:720,L:870,R:1040},TY0=210,TDY=34;
function table({g=1,head=0,D:dD=0,A:dA=0,Ax=0,lab=1}={}){
 let s=panel(88,250,'',g);
 s+=fade(g,label('候補',TX.c,128,{size:24,color:C.dim,anchor:'middle'})+label('時刻',TX.t,128,{size:24,color:C.dim,anchor:'middle'})
  +label('左の辺',TX.L,128,{size:24,color:C.dim,anchor:'middle'})+label('右の辺',TX.R,128,{size:24,color:C.dim,anchor:'middle'})
  +T('dv/dt',TX.L,168,28)+T('-0.25\\,v',TX.R,168,28)+line(PX+20,190,PX+PW-20,190,{color:C.faint,w:2}));
 s+=highlight(TX.L-80,104,160,82,head)+highlight(TX.R-90,104,180,82,head);
 const row=(i,c,tl,L,R,gg,col=C.ink,colR=col)=>fade(gg,(c?label(c,TX.c,TY0+i*TDY+8+TDY/2,{size:28,color:C.ink,anchor:'middle',weight:700}):'')
  +label(tl,TX.t,TY0+i*TDY+8,{size:22,color:CT,anchor:'middle'})+label(L,TX.L,TY0+i*TDY+8,{size:24,color:col,anchor:'middle',weight:700})+label(R,TX.R,TY0+i*TDY+8,{size:24,color:colR,anchor:'middle',weight:700}));
 s+=fade(g*lab,label('t＝0',TX.t,TY0+8,{size:22,color:CT,anchor:'middle'})+label('t＝2',TX.t,TY0+TDY+8,{size:22,color:CT,anchor:'middle'})
  +label('t＝0',TX.t,TY0+2*TDY+18,{size:22,color:CT,anchor:'middle'})+label('t＝2',TX.t,TY0+3*TDY+18,{size:22,color:CT,anchor:'middle'}));
 s+=fade(g*dD,label('D',TX.c,TY0+TDY/2+10,{size:28,color:CY,anchor:'middle',weight:700})+label('−10',TX.L,TY0+8,{size:24,color:C.ink,anchor:'middle',weight:700})+label('−10',TX.R,TY0+8,{size:24,color:C.ink,anchor:'middle',weight:700})
  +label('≈ −6.1',TX.L,TY0+TDY+8,{size:24,color:C.ink,anchor:'middle',weight:700})+label('≈ −6.1',TX.R,TY0+TDY+8,{size:24,color:C.ink,anchor:'middle',weight:700})
  +label('一致',TX.R+88,TY0+TDY/2+10,{size:22,color:C.F,anchor:'middle',weight:700}));
 s+=fade(g*dA,line(PX+20,TY0+TDY+20,PX+PW-20,TY0+TDY+20,{color:C.faint,w:1.5})+label('A',TX.c,TY0+2*TDY+TDY/2+20,{size:28,color:RED,anchor:'middle',weight:700})
  +label('−10',TX.L,TY0+2*TDY+18,{size:24,color:C.ink,anchor:'middle',weight:700})+label('−10',TX.R,TY0+2*TDY+18,{size:24,color:C.ink,anchor:'middle',weight:700})
  +label('−10',TX.L,TY0+3*TDY+18,{size:24,color:RED,anchor:'middle',weight:700})+label('−5',TX.R,TY0+3*TDY+18,{size:24,color:RED,anchor:'middle',weight:700}));
 s+=fade(g*Ax,label('×',TX.R+80,TY0+3*TDY+20,{size:34,color:RED,anchor:'middle',weight:700}));
 return s;
}

export const ytQxUiRateEquationDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6秒）：0〜2 s ボートが右へ（煙が消える＝エンジンを止める）。2〜5 s 遅くなりながら進む、「速さが減っていく」、グラフに出発点 40。
 // 5〜6 s 式 dv/dt＝−0.25v と e^(−0.5)≈0.607。6 s で「映像を一時停止」（ボートは止まっていない）。折れ線・傾き・曲線・答えは出さない。
 [K+'q1']:(p,ctx)=>{const t=6*p;return setup(t,{gAx:seg(p,0,.15),gPt:seg(p,.36,.46),gTag:seg(p,.36,.46)*(1-seg(p,.84,.9)),gEq:seg(p,.84,.95),pause:seg(p,.97,1)});},

 // ===================== 小問1 =====================
 // 1. 出題中の最後の静止画。「求めるもの」の札
 [K+'goal1']:(p)=>setup(6,{gEq:1,pause:1})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 「近似」タグ（1文目）。出発点 40 に黄の傾き、減る速さ＝0.25×v → 0.25×40＝10（2文目）
 [K+'step0']:(p,ctx)=>{
  const b=s2(ctx,.45),{A,svg}=graph();
  let s=svg+pt(A,0,40,CV,'40');
  s+=fade(seg(p,b+.05,b+.15),slope(A,0,40,-10,.55));
  s+=panel(88,400,kindTag('近似',PC,140,{g:seg(p,.03,.12)})
   +fade(seg(p,.08,.2),label('1秒の 間は、減る速さを',PC,200,{size:28,color:C.ink,anchor:'middle',weight:700})+label('一定と みなす',PC,240,{size:28,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.08),line(PX+40,275,PX+PW-40,275,{color:C.faint,w:2})+label('t＝0 の 減る速さ',PC,318,{size:26,color:HI,anchor:'middle',weight:700}))
   +fade(seg(p,b+.05,b+.15)*(1-seg(p,b+.3,b+.36)),T('0.25\\times v',PC,385,40)+highlight(PC+20,350,50,60,seg(p,b+.15,b+.25),CV))
   +fade(seg(p,b+.32,b+.4),T('0.25\\times{\\color{#b49bff}40}=10',PC,385,40))
   +fade(seg(p,b+.42,b+.5),label('（毎秒 10 m/s ずつ 減る ペース）',PC,450,{size:22,color:C.dim,anchor:'middle'})),1);
  return s+goalTag(G1);
 },
 // 3. 40→30（灰）、30 で新しい傾き 7.5、30→22.5。「毎回 0.75 倍」。答え C
 [K+'steps']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),[a1,b1]=cw[0],[a2,b2]=cw[1]??cw[0],b=s2(ctx,.75),{A,svg}=graph();
  const e=euler(1);
  let s=svg+pt(A,0,40,CV,'40');
  s+=fade(1-seg(p,a1+.1,a1+.18),slope(A,0,40,-10,.55));
  s+=poly1(A,e.slice(0,2),{p:seg(p,a1+.05,a1+.2)});
  s+=fade(seg(p,a1+.18,a1+.24),pt(A,1,30,GR,'≈ 30',{dx:10,dy:-14}));
  s+=fade(seg(p,a2,a2+.06)*(1-seg(p,a2+.18,a2+.24)),slope(A,1,30,-7.5,.55)+label('0.25×30 ＝ 7.5',A.X(1.15),A.Y(19),{size:24,color:HI,weight:700}));
  s+=fade(seg(p,a2,a2+.04),poly1(A,e.slice(1,3),{p:seg(p,a2+.1,a2+.24)}));
  s+=fade(seg(p,a2+.22,a2+.28),pt(A,2,22.5,GR,'≈ 22.5',{dx:10,dy:-14}));
  s+=panel(88,400,label('1秒ずつ 進む',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,a1+.04,a1+.12),label('1秒後',PX+50,200,{size:26,color:CT,weight:700})+T('v\\approx40-10=30',PC+50,195,36))
   +fade(seg(p,a2+.04,a2+.12),label('2秒後',PX+50,275,{size:26,color:CT,weight:700})+T('v\\approx30-7.5=22.5',PC+50,270,36))
   +fade(seg(p,a2+.26,a2+.34),line(PX+40,320,PX+PW-40,320,{color:C.faint,w:2})+label('毎回 0.75 倍',PC,375,{size:32,color:HI,anchor:'middle',weight:700})
    +label('（1 − 0.25 × 1 ＝ 0.75）',PC,425,{size:24,color:C.dim,anchor:'middle'})),1);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.08));
 },
 // 4. 誤答 A（30）→ 誤答 D（39.5）を1枚ずつ
 [K+'wrongAD']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),w1=cw[0],w2=[cw[1]?cw[1][0]:.5,1],{A,svg}=graph();
  const inA=seg(p,w1[0]+.01,w1[0]+.05)*(1-seg(p,w1[1]-.04,w1[1])),inD=seg(p,w2[0]+.01,w2[0]+.05);
  let s=svg+pt(A,0,40,CV,'40')+poly1(A,euler(1))+pt(A,1,30,GR,'≈ 30',{dx:10,dy:-14})+pt(A,2,22.5,GR,'≈ 22.5',{dx:10,dy:-14});
  s+=fade(inA,ring(A.X(1),A.Y(30),20,{color:RED,w:3}));
  s+=fade(inD,dot(A.X(2),A.Y(39.5),8,RED)+label('39.5',A.X(2)+14,A.Y(39.5)-8,{size:24,color:RED,weight:700}));
  s+=panel(88,170,label('1秒刻み',PC,128,{size:24,color:C.dim,anchor:'middle'})+label('40 → 30 → 22.5',PC,190,{size:34,color:C.ink,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[['A','30 m/s','1秒分しか 進めていない'],['D','39.5 m/s','0.25 は 減る量では なく 割合']],{win:[w1,w2],opts:{...WR,y:290}});
  return s+goalTag(G1)+ANS1(1);
 },
 // 5. 誤答 B（20）：傾き −10 の直線（赤の点線）が t＝2 で 20。2文目で、30 で傾きがゆるむ灰の折れ線と並べる
 [K+'wrongB']:(p,ctx)=>{
  const b=s2(ctx,.45),{A,svg}=graph();
  let s=svg+pt(A,0,40,CV,'40')+poly1(A,euler(1))+pt(A,2,22.5,GR,'≈ 22.5',{dx:10,dy:-14});
  s+=line(A.X(0),A.Y(40),mix(A.X(0),A.X(2),seg(p,.05,.25)),A.Y(mix(40,20,seg(p,.05,.25))),{color:RED,w:4,dash:'10 8'});
  s+=fade(seg(p,.22,.28),dot(A.X(2),A.Y(20),8,RED)+label('20',A.X(2)+14,A.Y(20)+22,{size:24,color:RED,weight:700}));
  const gb=seg(p,b,b+.08);
  s+=fade(gb,slope(A,0,40,-10,.45)+slope(A,1,30,-7.5,.45)+label('ゆるむ',A.X(1.2),A.Y(34),{size:24,color:HI,weight:700}));
  s+=fade(gb,panel(88,170,label('ルール',PC,128,{size:24,color:C.dim,anchor:'middle'})+label('遅くなれば ゆっくり 減る',PC,190,{size:32,color:HI,anchor:'middle',weight:700}),1,HI));
  s+=wrongCard('B','20 m/s','減る速さ 10 の まま 減らした',{...WR,y:290,g:seg(p,.03,.1)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 6. 誤答カードと折れ線を薄くする。条件の二つを右の枠に
 [K+'goal2']:(p)=>{
  const {A,svg}=graph(),dim=1-.7*seg(p,.02,.15);
  let s=svg+fade(dim,poly1(A,euler(1)))+pt(A,0,40,CV,'40');
  s+=fade(seg(p,.2,.3),ring(A.X(0),A.Y(40),20,{color:HI,w:3}));
  s+=panel(88,300,label('条件1　方程式',PC,140,{size:26,color:C.dim,anchor:'middle'})+T('\\dfrac{dv}{dt}=-0.25\\,v',PC,205,38)
   +line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+label('条件2　出発の 値',PC,295,{size:26,color:C.dim,anchor:'middle'})+T('t=0\\ \\text{で}\\ v=40',PC,345,34,{auto:false}),seg(p,.05,.18),HI);
  return s+goalTag(G2,{g:seg(p,.03,.12)});
 },
 // 7. 表の見出し（左の辺 dv/dt・右の辺 −0.25v）を黄で光らせる
 [K+'table']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),{A,svg}=graph();
  let s=svg+fade(.3,poly1(A,euler(1)))+pt(A,0,40,CV,'40');
  s+=table({g:seg(p,0,.1),head:seg(p,cw[0][0]+.05,cw[0][0]+.12)});
  return s+goalTag(G2);
 },
 // 8. 候補 D：曲線（水色）。①微分（−0.25 が前に降りる）→ ②表の D の行（左右とも −10、≈−6.1）
 [K+'checkD']:(p,ctx)=>{
  const ve=voiceEnd(ctx),{A,svg}=graph(),sw=ve*.72;
  let s=svg+fade(.3,poly1(A,euler(1)))+curve(A,{p:seg(p,.03,.2)})+pt(A,0,40,CV,'40');
  s+=fade(seg(p,.1,.16),label('D',A.X(2.6),A.Y(vT(2.6))-14,{size:28,color:CY,weight:700}));
  const cA=1-seg(p,sw,sw+.04),cB=seg(p,sw+.02,sw+.07);
  // ① 微分の段
  const L1='v=40\\,e^{-0.25t}',x1=PC-texWidth(L1,40)/2,ex=x1+texWidth('v=40\\,e',40),mv=seg(p,.2,.36);
  const L2a='\\dfrac{dv}{dt}=40\\times(',L2b='-0.25',L2c=')\\,e^{-0.25t}';
  const w2=texWidth(L2a+L2b+L2c,38),x2=PC-w2/2,dx=x2+texWidth(L2a,38);
  let d=label('候補 D を 微分',PC,130,{size:24,color:C.dim,anchor:'middle'})+T(L1,PC,190,40);
  d+=fade(seg(p,.18,.22)*(1-seg(p,.36,.38)),label('−0.25',mix(ex+4,dx,mv),mix(160,268,mv),{size:mix(22,32,mv),color:HI,weight:700}));
  d+=fade(seg(p,.36,.4),T(L2a+`{\\color{${HI}}${L2b}}`+L2c,PC,275,38));
  d+=fade(seg(p,.45,.55),T('=-0.25\\times(40\\,e^{-0.25t})=-0.25\\,v',PC,360,36)+label('中身の 倍率 −0.25 が 前に 出る',PC,440,{size:24,color:HI,anchor:'middle',weight:700}));
  s+=fade(cA,panel(88,400,d,1));
  s+=fade(cB,table({D:seg(p,sw+.05,sw+.12)}));
  return s+goalTag(G2);
 },
 // 9. 曲線の t＝0 の点 40 に丸。答え D
 [K+'ans2']:(p,ctx)=>{
  const {A,svg}=graph();
  let s=svg+fade(.3,poly1(A,euler(1)))+curve(A)+pt(A,0,40,CV,'40')+label('D',A.X(2.6),A.Y(vT(2.6))-14,{size:28,color:CY,weight:700});
  s+=ring(A.X(0),A.Y(40),22,{color:HI,w:4});
  s+=table({D:1});
  return s+goalTag(G2)+ANS2(seg(p,.45,.55));
 },
 // 10. 誤答 A：直線 40−10t（赤の点線）、表の A の行（t＝2 で −10 と −5、赤の ×）
 [K+'wrongA2']:(p)=>{
  const {A,svg}=graph();
  let s=svg+curve(A)+pt(A,0,40,CV,'40')+label('D',A.X(2.6),A.Y(vT(2.6))-14,{size:28,color:CY,weight:700});
  const gl=seg(p,.03,.2);
  s+=line(A.X(0),A.Y(40),A.X(mix(0,3.2,gl)),A.Y(40-10*mix(0,3.2,gl)),{color:RED,w:4,dash:'10 8'});
  s+=fade(seg(p,.15,.22),label('A',A.X(3.2)+8,A.Y(8)+8,{size:26,color:RED,weight:700}));
  s+=fade(seg(p,.3,.4),dot(A.X(2),A.Y(20),8,RED)+label('傾き −10',A.X(2)-14,A.Y(20)+30,{size:22,color:RED,weight:700,anchor:'end'}));
  s+=table({D:1,A:seg(p,.25,.35),Ax:seg(p,.55,.62)});
  s+=wrongCard('A','v＝40−10t','t＝0 だけ 一致。t＝2 で 合わない',{...WR,y:350,g:seg(p,.03,.1)});
  return s+goalTag(G2)+ANS2(1);
 },
 // 11. 解の家族（C×e^(−0.25t)、灰）と、t＝0 で 10 を通る1本。誤答 B → 誤答 C（39＋e^(−0.25t) は赤の点線）
 [K+'family']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),w1=cw[0],w2=[cw[1]?cw[1][0]:.5,1],{A,svg}=graph();
  const inB=seg(p,w1[0]+.01,w1[0]+.05)*(1-seg(p,w1[1]-.04,w1[1])),inC=seg(p,w2[0]+.01,w2[0]+.05);
  let s=svg;
  for(const c of [10,20,30])s+=A.plot(t=>c*Math.exp(-.25*t),{from:0,to:3.1,color:GR,w:c===10?4:3,p:seg(p,.02,.15)});
  s+=curve(A)+pt(A,0,40,CV,'40');
  s+=fade(inB,ring(A.X(0),A.Y(10),20,{color:RED,w:3})+label('B：出発 10',A.X(0)+26,A.Y(10)-14,{size:24,color:RED,weight:700}));
  s+=fade(inC,A.plot(t=>39+Math.exp(-.25*t),{from:0,to:3.1,color:RED,w:4,dash:'10 8'})+label('C',A.X(3.1)+6,A.Y(39.5)+8,{size:26,color:RED,weight:700}));
  s+=panel(88,170,label('家族は 掛ける 定数 C',PC,135,{size:28,color:HI,anchor:'middle',weight:700})+T('v=C\\,e^{-0.25t}',PC,200,38),seg(p,.05,.15),HI);
  s+=wrongSeq(p,ctx,[['B','v＝10 e の −0.25t 乗','方程式は 満たすが 出発が 10'],['C','v＝39＋e の −0.25t 乗','足した 39 の 分だけ 右の辺が 合わない']],{win:[w1,w2],opts:{...WR,y:290}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 12. 表・家族・カードを消す。水色の曲線と灰の折れ線（40→30→22.5）を重ねて残す
 [K+'goal3']:(p)=>{
  const {A,svg}=graph();
  let s=svg+C3(A)+poly1(A,euler(1))+pt(A,0,40,CV,'40')+gapMarks(A,{gT:0,gB:0});
  s+=fade(seg(p,.15,.25),label('本当の 解',A.X(1.5),A.Y(34),{size:24,color:CY,weight:700})+label('1秒刻み',A.X(1.05)-6,A.Y(26),{size:24,color:GR,weight:700,anchor:'end'}));
  s+=panel(88,240,label('1秒刻み：2秒後 ≈ 22.5',PC,150,{size:30,color:GR,anchor:'middle',weight:700})+label('本当の 2秒後 は？',PC,230,{size:32,color:CY,anchor:'middle',weight:700})
   +label('（曲線 v ＝ 40 e の −0.25t 乗）',PC,285,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.18),HI);
  return s+goalTag(G3,{g:seg(p,.03,.12)});
 },
 // 13. 曲線の t＝2 に金の縦線。v＝40×e^(−0.5)＝40×0.607≈24.3
 [K+'true2']:(p)=>{
  const {A,svg}=graph(),gl=seg(p,.05,.2);
  let s=svg+C3(A)+fade(.45,poly1(A,euler(1)))+pt(A,0,40,CV,'40');
  s+=line(A.X(2),A.Y(0),A.X(2),A.Y(mix(0,vT(2),gl)),{color:CT,w:4});
  s+=gapMarks(A,{gT:seg(p,.6,.7),gE:0,gB:0});
  s+=panel(88,330,label('本当の 解に t＝2',PC,135,{size:26,color:C.dim,anchor:'middle'})+T('v=40\\,e^{-0.25t}',PC,195,38)
   +fade(seg(p,.2,.32),T('=40\\,e^{-0.5}',PC,265,38))+fade(seg(p,.35,.47),T('=40\\times0.607',PC,330,38))+fade(seg(p,.5,.62),T('\\approx24.3\\ \\mathrm{m/s}',PC,395,38)),1);
  return s+goalTag(G3);
 },
 // 14. 1歩目の区間を拡大（灰の一定の傾き と だんだんゆるむ曲線、差を黄）。t＝2 の差に「減らしすぎ」。答え A
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx,.8),{A,svg}=graph(),e=euler(1),gf=seg(p,.05,.2);
  let s=svg;
  const top=Array.from({length:41},(_,i)=>{const t=2*i/40;return [A.X(t),A.Y(vT(t))];}),bot=[[A.X(2),A.Y(22.5)],[A.X(1),A.Y(30)],[A.X(0),A.Y(40)]];
  s+=fade(gf,poly([...top,...bot],{fill:HI,fo:.45}));
  s+=C3(A)+poly1(A,e)+pt(A,0,40,CV,'40')+gapMarks(A,{gB:seg(p,.45,.55)});
  // 右の枠：t＝0〜1 の拡大
  const zx=PX+40,zy=150,zw=PW-80,zh=230,Zt=t=>zx+zw*t/1.05,Zv=v=>zy+zh-zh*(v-29)/11.5;
  let z=label('1歩目（t＝0〜1）を 拡大',PC,122,{size:24,color:C.dim,anchor:'middle'});
  z+=line(zx,zy+zh,zx+zw,zy+zh,{color:C.dim,w:2})+line(zx,zy,zx,zy+zh,{color:C.dim,w:2});
  const zt=Array.from({length:31},(_,i)=>{const t=i/30;return [Zt(t),Zv(vT(t))];});
  z+=fade(gf,poly([...zt,[Zt(1),Zv(30)],[Zt(0),Zv(40)]],{fill:HI,fo:.45}));
  z+=draw(zt,1,{color:CY,w:5})+line(Zt(0),Zv(40),Zt(1),Zv(30),{color:GR,w:4});
  z+=label('一定の 傾き（灰）',Zt(.42),Zv(34.2)+44,{size:22,color:GR,anchor:'middle',weight:700})+label('だんだん ゆるむ（水色）',Zt(.5),Zv(35.3)-30,{size:22,color:CY,weight:700});
  s+=panel(88,330,z,1);
  s+=fade(seg(p,.3,.4),panel(430,76,label('各1秒の 最初の 傾きを 使い続ける',PC,478,{size:26,color:HI,anchor:'middle',weight:700}),1,HI));
  return s+goalTag(G3)+ANS3(seg(p,b,b+.08));
 },
 // 15. 0.1 s 刻み・0.01 s 刻みの折れ線（灰の細線）が曲線に重なっていく。右の枠に 22.5 → 24.1 → 24.25
 [K+'finer']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),{A,svg}=graph();
  const g1=seg(p,cw[0][0]+.04,cw[0][0]+.14),g2=seg(p,(cw[1]??[.3])[0]+.04,(cw[1]??[.3])[0]+.14);
  let s=svg+curve(A,{w:7,to:2})+poly1(A,euler(1))+pt(A,0,40,CV,'40');
  s+=poly1(A,euler(.1),{p:g1,w:2.5,color:'#c9d2e0'})+poly1(A,euler(.01),{p:g2,w:2,color:'#e9eef6'});
  const c2=cw[2]?cw[2][0]:.5,c3=cw[3]?cw[3][0]:.65;
  s+=panel(88,380,label('t＝2 の 値',PC,130,{size:24,color:C.dim,anchor:'middle'})
   +label('1 s 刻み',PX+70,190,{size:26,color:GR,weight:700})+label('≈ 22.5',PX+PW-90,190,{size:30,color:GR,weight:700,anchor:'end'})
   +fade(seg(p,c2,c2+.06),label('0.1 s 刻み',PX+70,245,{size:26,color:'#c9d2e0',weight:700})+label('≈ 24.1',PX+PW-90,245,{size:30,color:'#c9d2e0',weight:700,anchor:'end'}))
   +fade(seg(p,c3,c3+.06),label('0.01 s 刻み',PX+70,300,{size:26,color:'#e9eef6',weight:700})+label('≈ 24.25',PX+PW-90,300,{size:30,color:'#e9eef6',weight:700,anchor:'end'}))
   +fade(seg(p,c3+.1,c3+.18),line(PX+40,330,PX+PW-40,330,{color:C.faint,w:2})+label('本当の 解',PX+70,380,{size:26,color:CY,weight:700})+label('≈ 24.26',PX+PW-90,380,{size:30,color:CY,weight:700,anchor:'end'})
    +arrow(PX+PW-45,300,PX+PW-45,180,{color:HI,w:3,head:12,g:1})+label('上がって 近づく',PC,440,{size:26,color:HI,anchor:'middle',weight:700})),1);
  return s+goalTag(G3)+ANS3(1);
 },
 // 16. 誤答 B → 誤答 D を1枚ずつ
 [K+'wrongBD']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),w1=cw[0],w2=[cw[1]?cw[1][0]:.5,1],{A,svg}=graph();
  let s=svg+C3(A)+poly1(A,euler(1))+pt(A,0,40,CV,'40')+gapMarks(A);
  s+=panel(88,170,label('刻みを 細かくすると',PC,128,{size:24,color:C.dim,anchor:'middle'})+label('22.5 → 24.1 → 24.25 → 24.26',PC,190,{size:30,color:C.ink,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[['B','ちょうど 22.5 m/s','刻みは 近似。刻みで 値が 変わる'],['D','約 24.3 m/s・減らし足りない','向きが 逆。刻みは 減らしすぎ']],{win:[w1,w2],opts:{...WR,y:290}});
  return s+goalTag(G3)+ANS3(1);
 },
 // 17. 誤答 C（約 14.7）。声のあと、グラフに折れ線と曲線・「減らしすぎ」・表の D の行から曲線への線・答えの札3枚で静止
 [K+'wrongC3']:(p,ctx)=>{
  const ve=voiceEnd(ctx),fin=seg(p,ve+.02,ve+.1),{A,svg}=graph();
  let s=svg+C3(A)+poly1(A,euler(1))+pt(A,0,40,CV,'40')+gapMarks(A,{gB:fin});
  s+=fade(1-fin,dot(A.X(2),A.Y(14.74),8,RED)+line(A.X(2)+8,A.Y(14.74),A.X(2.3),A.Y(6),{color:RED,w:2})+label('約 14.7',A.X(2.3)+4,A.Y(6)+8,{size:24,color:RED,weight:700}));
  s+=fade(1-fin,wrongCard('C','約 14.7 m/s','指数 −0.5 は 2秒分で、1回だけ 掛ける',{...WR,y:150,mid:'40\\times0.607\\times0.607\\approx14.7'}));
  s+=fade(1-fin,goalTag(G3)+ANS3(1));
  // 最後の静止画
  s+=fade(fin,label('1秒刻み',A.X(1.05)-6,A.Y(26),{size:24,color:GR,weight:700,anchor:'end'}));
  s+=fade(fin,panel(125,100,label('表の D',PX+80,185,{size:26,color:C.dim,anchor:'middle'})+T('v=40\\,e^{-0.25t}',PC+40,175,38),1,CY)
   +line(PX,175,A.X(.3)+6,A.Y(vT(.3))-4,{color:CY,w:3,dash:'6 6'})+dot(A.X(.3),A.Y(vT(.3)),7,CY));
  s+=answerRow([[1,'C','22.5 m/s'],[2,'D',''],[3,'A','']],{g:fin});
  return s;
 },
};
