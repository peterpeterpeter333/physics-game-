// 問題編 解説「数え率から半減期を出す」（q-um-ode、大学 08 微分方程式・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/08_微分方程式.md の q-um-ode（解説 17 行）。
// 画面：左に数え率–時刻のグラフ（行4〜5 は ln のグラフ）、右に説明の枠。誤答カードは右の列に1枚ずつ。
// 出題中の図だけは、左に試料・検出器・時計、右にグラフと ln の札。札の帯（y＜78）には図を描かない。
// 色（この単元）：数え率・N 水色、時刻・半減期 T 金、傾き 黄、一歩の近似 灰、本当の曲線 水色の太線、誤り 赤の点線。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,sentWin,voiceEnd,cueT,QC} from './yt1-qx-common.mjs';

const K='qx-um-ode:';
const RED=QC.bad,GR='#8d9ab0',CY=C.x,CT=C.t,HI=C.hi;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const LAM=Math.log(1.25)/2,TH=Math.log(2)/LAM,rT=t=>1000*Math.exp(-LAM*t);
const G1='λ',G2='半減期 T',G3='18.6 時間後の数え率';
const ANS1=g=>answerTag(1,'D','約 0.11 /時',{g}),ANS2=g=>answerTag(2,'B','約 6.2 時',{g}),ANS3=g=>answerTag(3,'A','毎秒 約 125 回',{g});
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
// ---- 数え率–時刻のグラフ ----
function graph({x=110,y=470,w=390,h=350,g=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:21,ymin:0,ymax:1100,xticks:[5,10,15,20],yticks:[250,500,750,1000],xlabel:'t [時]',ylabel:'',xcolor:CT,g,grid:true});
 return {A,svg:A.svg+fade(g,label('数え率 [回/秒]',A.X(0)+14,A.Y(1100)-8,{size:24,color:CY,weight:700}))};
}
// ln（数え率）のグラフ
function lnGraph({x=110,y=470,w=390,h=350,g=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:21,ymin:4.6,ymax:7.2,xticks:[5,10,15,20],yticks:[5,6,7],xlabel:'t [時]',ylabel:'',xcolor:CT,g,grid:true});
 return {A,svg:A.svg+fade(g,label('ln（数え率）',A.X(0)+14,A.Y(7.2)-8,{size:24,color:CY,weight:700}))};
}
const curve=(A,{p=1,to=20.5,w=6}={})=>A.plot(rT,{from:0,to,p,color:CY,w});
const pts2=(A,g=1)=>fade(g,dot(A.X(0),A.Y(1000),9,CY)+label('1000',A.X(0)+14,A.Y(1000)-12,{size:24,color:CY,weight:700})
 +dot(A.X(2),A.Y(800),9,CY)+label('800',A.X(2)+14,A.Y(800)-10,{size:24,color:CY,weight:700}));
const DNDT='\\dfrac{dN}{dt}=-\\lambda N',SOL='N=N_0\\,e^{-\\lambda t}';

// ---- 出題中の図 ----
const PARTS=Array.from({length:14},(_,i)=>[(i*0.37)%1,0.2+((i*0.61)%1)*0.6]);
function detector(rate,t,{g=1,gone=0}={}){
 let s=rect(70,150,90,80,{fill:'#2a3346',fo:1,stroke:C.dim,sw:3,rx:10})+label('試料',115,260,{size:24,color:C.dim,anchor:'middle'});
 s+=rect(250,120,150,140,{fill:'#1b2438',fo:1,stroke:C.dim,sw:3,rx:12})+label('検出器',325,290,{size:24,color:C.dim,anchor:'middle'});
 s+=rect(265,155,120,60,{fill:'#0b1122',fo:1,stroke:C.faint,sw:2,rx:6})+label(String(rate),325,195,{size:30,color:CY,anchor:'middle',weight:700})+label('回/秒',325,240,{size:22,color:C.dim,anchor:'middle'});
 const n=Math.round(PARTS.length*(1-gone));
 PARTS.slice(0,n).forEach(([ph,dy],i)=>{const u=(t*1.3+ph)%1;s+=dot(mix(165,250,u),150+80*dy+(u-.5)*10*(i%2?1:-1),4,HI,1-u*.6);});
 return fade(g,s);
}
function clock(h,{g=1,cx=200,cy=400,r=60}={}){
 let s=ring(cx,cy,r,{color:CT,w:4,fill:'#1a1a10'});
 for(let i=0;i<12;i++){const a=2*Math.PI*i/12;s+=line(cx+r*.82*Math.sin(a),cy-r*.82*Math.cos(a),cx+r*Math.sin(a),cy-r*Math.cos(a),{color:CT,w:2});}
 const a=2*Math.PI*h/12;
 if(h>.01){const n=12,pp=Array.from({length:n+1},(_,i)=>{const b=a*i/n;return [cx+r*.6*Math.sin(b),cy-r*.6*Math.cos(b)];});s+=draw([[cx,cy],...pp,[cx,cy]],1,{color:CT,w:0,fill:CT,opacity:.3});}
 s+=line(cx,cy,cx+r*.75*Math.sin(a),cy-r*.75*Math.cos(a),{color:CT,w:5})+dot(cx,cy,6,CT)+label(`経過 ${h.toFixed(1)} 時間`,cx+r+18,cy+8,{size:24,color:CT,weight:700});
 return fade(g,s);
}
function setup(p){
 const t=6*p,h=2*seg(p,.36,.8),rate=h>=1.999?800:1000;
 let s=detector(rate,t,{g:seg(p,0,.12),gone:.3*seg(p,.36,.8)})+clock(h,{g:seg(p,.3,.4)});
 const {A,svg}=graph({x:560,w:330,g:seg(p,.05,.2)});
 s+=svg+fade(seg(p,.15,.3),dot(A.X(0),A.Y(1000),9,CY)+label('1000',A.X(0)+14,A.Y(1000)-12,{size:24,color:CY,weight:700}));
 s+=fade(seg(p,.8,.86),dot(A.X(2),A.Y(800),9,CY)+label('800（2.0 時）',A.X(2)+14,A.Y(800)+30,{size:24,color:CY,weight:700}));
 s+=card(980,140,200,150,T('\\ln 2=0.693',1080,195,30)+T('\\ln 1.25=0.223',1080,255,30),seg(p,.86,.97));
 return s;
}

export const ytQxUmOdeDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6秒）：0〜2 s 光の点、表示 1000、グラフの 0 時に点。2〜5 s 時計が 2 時間分進み、点が少し減って表示 800、2.0 時に点。
 // 5〜6 s ln の札。静止。点を結ぶ曲線・ln の直線・半減期の横線は出さない。
 [K+'q1']:(p)=>setup(p),

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>setup(1)+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 「前提」タグ。0 時の点に N₀ の札 → dN/dt＝−λN → 変数分離で N＝N₀ e^(−λt)
 [K+'model']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),b=cw[1]?cw[1][0]:.5,{A,svg}=graph();
  let s=svg+pts2(A);
  s+=fade(seg(p,.05,.15),line(A.X(0)+8,A.Y(1000)+8,A.X(3),A.Y(620),{color:C.dim,w:2})+T('N_0',A.X(3)+24,A.Y(610),30,{color:CY})+label('＝ はじめの 核の 数',A.X(3)+48,A.Y(610)+8,{size:22,color:CY,weight:700}));
  s+=panel(88,400,kindTag('前提',PC,140,{g:seg(p,.03,.12),text:'1個が 壊れる 確率 λΔt'})
   +fade(seg(p,.15,.25),T(DNDT,PC,215,40))
   +fade(seg(p,b,b+.08),arrow(PC,250,PC,282,{color:C.dim,w:3,head:12,g:1})+label('変数分離 → 積分',PC,312,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,b+.08,b+.18),T(SOL,PC,375,44,{color:CY})),1);
  return s+goalTag(G1);
 },
 // 3. 2点 1000 と 800 を結ぶ金の矢印に「×0.8」。e^(−2λ)＝0.8
 [K+'ratio']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),{A,svg}=graph();
  let s=svg+pts2(A);
  s+=fade(seg(p,.25,.35),arrow(A.X(0)+12,A.Y(1000)+6,A.X(2)-10,A.Y(800)-6,{color:CT,w:4,head:14,g:1})+label('× 0.8',A.X(2)+60,A.Y(950),{size:26,color:CT,weight:700}));
  s+=panel(88,330,label('数え率 ∝ N',PC,140,{size:28,color:CY,anchor:'middle',weight:700})+T(SOL,PC,205,36)
   +fade(seg(p,.3,.42),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+label('2 時間で 0.8 倍',PC,295,{size:26,color:CT,anchor:'middle',weight:700}))
   +fade(seg(p,(cw[2]??[.6])[0],(cw[2]??[.6])[0]+.1),T('e^{-2\\lambda}=0.8',PC,370,44)),1);
  return s+goalTag(G1);
 },
 // 4. ln を両辺にかぶせる（−2λ＝ln 0.8＝−ln 1.25 → 2λ＝0.223）。そのあと縦軸を ln（数え率）に切り替え、2点が直線上に並ぶ
 [K+'ln']:(p,ctx)=>{
  const ve=voiceEnd(ctx),sw=ve*.85,cA=1-seg(p,sw,sw+.05),cB=seg(p,sw+.03,sw+.08);
  const {A,svg}=graph(),L=lnGraph();
  let s=fade(cA,svg+pts2(A));
  s+=fade(cB,L.svg+dot(L.A.X(0),L.A.Y(Math.log(1000)),9,CY)+dot(L.A.X(2),L.A.Y(Math.log(800)),9,CY)
   +L.A.plot(t=>Math.log(rT(t)),{from:0,to:20.5,color:CY,w:4,p:seg(p,sw+.06,1)})+label('ln をとると 直線',L.A.X(9),L.A.Y(6.4),{size:24,color:CY,weight:700}));
  s+=panel(88,400,T('e^{-2\\lambda}=0.8',PC,145,38)
   +fade(seg(p,.15,.25),label('両辺の ln をとる',PC,200,{size:24,color:C.dim,anchor:'middle'})+T('-2\\lambda=\\ln 0.8=-\\ln 1.25',PC,255,36))
   +fade(seg(p,.4,.5),T('2\\lambda=\\ln 1.25=0.223',PC,340,40,{color:HI}))
   +fade(seg(p,.5,.6),label('肩の 数を 取り出した',PC,420,{size:24,color:C.dim,anchor:'middle'})),1);
  return s+goalTag(G1);
 },
 // 5. ln のグラフの傾き（黄）−0.11 /時。λ＝0.223÷2＝0.1115≈0.11 /時。答え D
 [K+'ans1']:(p,ctx)=>{
  const b=s2(ctx,.6),L=lnGraph();
  let s=L.svg+L.A.plot(t=>Math.log(rT(t)),{from:0,to:20.5,color:CY,w:4})+dot(L.A.X(0),L.A.Y(Math.log(1000)),9,CY)+dot(L.A.X(2),L.A.Y(Math.log(800)),9,CY);
  const t0=8,t1=13;
  s+=fade(seg(p,.05,.15),line(L.A.X(t0),L.A.Y(Math.log(rT(t0))),L.A.X(t1),L.A.Y(Math.log(rT(t0))),{color:HI,w:3,dash:'6 6'})+line(L.A.X(t1),L.A.Y(Math.log(rT(t0))),L.A.X(t1),L.A.Y(Math.log(rT(t1))),{color:HI,w:3,dash:'6 6'})
   +label('傾き −0.11 /時',L.A.X(t1)+10,L.A.Y(Math.log(rT(10)))+10,{size:24,color:HI,weight:700}));
  s+=panel(88,300,label('2λ ＝ 0.223',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.22),T('\\lambda=0.223\\div2=0.1115',PC,215,38))+fade(seg(p,.25,.37),T('\\approx 0.11\\ /\\text{時}',PC,290,40,{color:HI})),1);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.08));
 },
 // 6. 元のグラフに戻す。一歩の近似の直線（灰）と本当の曲線の差を黄。誤答 A
 [K+'wrongA1']:(p)=>{
  const {A,svg}=graph(),g=seg(p,.05,.25);
  const top=[[0,1000],[10,0]],cv=Array.from({length:41},(_,i)=>{const t=10*i/40;return [A.X(t),A.Y(rT(t))];});
  let s=svg+fade(seg(p,.2,.35),poly([...cv,[A.X(10),A.Y(0)]],{fill:HI,fo:.3}));
  s+=curve(A,{p:g})+draw(top.map(([t,v])=>[A.X(t),A.Y(v)]),seg(p,.1,.3),{color:GR,w:4})+pts2(A);
  s+=fade(seg(p,.2,.3),label('一歩の 近似（灰）',A.X(5.2)+8,A.Y(500)+10,{size:22,color:GR,weight:700}));
  s+=panel(88,170,label('一歩の 式（Δt＝2 時間）',PC,128,{size:24,color:C.dim,anchor:'middle'})+T('1-2\\lambda=0.8\\ \\Rightarrow\\ \\lambda=0.10',PC,195,34),1);
  s+=wrongCard('A','約 0.10 /時','一歩の 式を 長い Δt で 使った',{...WR,y:290,g:seg(p,.03,.1)});
  return s+goalTag(G1)+ANS1(1);
 },
 // 7. 誤答 B → 誤答 C。C の間は式 −λN の負号を光らせる
 [K+'wrongBC1']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),w1=cw[0],w2=[cw[1]?cw[1][0]:.5,1],{A,svg}=graph();
  const inC=seg(p,w2[0]+.01,w2[0]+.05);
  let s=svg+curve(A)+pts2(A);
  const e=DNDT,w=texWidth(e,40,false),x0=PC-w/2+texWidth('\\dfrac{dN}{dt}=',40,false);
  s+=panel(88,170,T(e,PC,160,40)+highlight(x0-6,120,34,70,inC*(.6+.4*Math.sin(cueT(ctx)*6)),RED)+fade(inC,label('負号 ＝ 減る 向き',PC+150,215,{size:22,color:RED,weight:700,anchor:'middle'})),1);
  s+=wrongSeq(p,ctx,[['B','約 0.22 /時',['2.0 で 割り忘れた','単位が /時 に ならない']],['C','約 −0.11 /時','λ は 正。減る 向きは 式の 負号']],{win:[w1,w2],opts:{...WR,y:290}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 8. ln のグラフ・カードを消し、元のグラフに曲線（水色の太線）
 [K+'goal2']:(p)=>{
  const {A,svg}=graph();
  let s=svg+curve(A,{p:seg(p,.05,.4)})+pts2(A);
  s+=panel(88,200,label('数え率が 半分に なる 時間',PC,165,{size:30,color:CT,anchor:'middle',weight:700})+label('＝ 半減期 T',PC,225,{size:30,color:CT,anchor:'middle',weight:700}),seg(p,.05,.18),HI);
  return s+goalTag(G2,{g:seg(p,.03,.12)});
 },
 // 9. 1000 と 500 の高さに横の点線。e^(−λT)＝1/2 → λT＝ln 2
 [K+'half']:(p)=>{
  const {A,svg}=graph();
  let s=svg+curve(A)+pts2(A);
  s+=fade(seg(p,.05,.2),line(A.X(0),A.Y(500),A.X(20.5),A.Y(500),{color:C.dim,w:2,dash:'6 7'})+label('500',A.X(0)-12,A.Y(500)+8,{size:22,color:CY,anchor:'end',weight:700}));
  s+=panel(88,280,label('半分に なる とき',PC,140,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.1,.25),T('e^{-\\lambda T}=\\dfrac{1}{2}',PC,215,42))
   +fade(seg(p,.45,.6),T('\\lambda T=\\ln 2',PC,310,44,{color:HI})),1);
  return s+goalTag(G2);
 },
 // 10. T＝0.693÷0.1116≈6.2 時。1000→500 の横幅（金）。答え B
 [K+'ans2']:(p,ctx)=>{
  const b=s2(ctx,.7),{A,svg}=graph(),gw=seg(p,.4,.55);
  let s=svg+curve(A)+pts2(A)+line(A.X(0),A.Y(500),A.X(20.5),A.Y(500),{color:C.dim,w:2,dash:'6 7'});
  s+=fade(gw,line(A.X(0),A.Y(500),A.X(TH),A.Y(500),{color:CT,w:6})+dot(A.X(TH),A.Y(500),8,CY)+label('T ≈ 6.2 時',A.X(TH/2),A.Y(500)+32,{size:26,color:CT,anchor:'middle',weight:700}));
  s+=panel(88,280,label('丸める 前の λ ＝ 0.1116',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.22),T('T=\\dfrac{\\ln 2}{\\lambda}=\\dfrac{0.693}{0.1116}',PC,220,38))+fade(seg(p,.3,.42),T('\\approx 6.2\\ \\text{時}',PC,310,42,{color:CT})),1);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.08));
 },
 // 11. 誤答 A：0 時から傾き一定の直線（赤の点線）が 5 時で 500
 [K+'wrongA2']:(p)=>{
  const {A,svg}=graph(),gl=seg(p,.05,.25);
  let s=svg+curve(A)+pts2(A)+line(A.X(0),A.Y(500),A.X(TH),A.Y(500),{color:CT,w:6})+label('T ≈ 6.2 時',A.X(TH/2),A.Y(500)+32,{size:24,color:CT,anchor:'middle',weight:700});
  s+=line(A.X(0),A.Y(1000),A.X(mix(0,5,gl)),A.Y(1000-100*mix(0,5,gl)),{color:RED,w:4,dash:'10 8'});
  s+=fade(seg(p,.22,.3),dot(A.X(5),A.Y(500),8,RED)+label('5 時',A.X(5)+4,A.Y(500)-14,{size:24,color:RED,weight:700}));
  s+=panel(88,170,label('最初の 減り方：2 時間で 200 回',PC,135,{size:26,color:C.ink,anchor:'middle',weight:700})+label('減り方は 次第に ゆるむ',PC,190,{size:26,color:CY,anchor:'middle',weight:700}),1);
  s+=wrongCard('A','約 5.0 時','最初の 減り方の まま 一定に 減らした',{...WR,y:290,g:seg(p,.03,.1)});
  return s+goalTag(G2)+ANS2(1);
 },
 // 12. 37％（370）と 50％（500）の横線、横幅 9.0 時・6.2 時。誤答 C → 誤答 D
 [K+'wrongCD2']:(p,ctx)=>{
  const {A,svg}=graph(),T1=1/LAM,g=seg(p,.03,.15);
  let s=svg+curve(A)+pts2(A);
  s+=line(A.X(0),A.Y(500),A.X(TH),A.Y(500),{color:CT,w:6})+label('6.2 時',A.X(TH/2),A.Y(500)-12,{size:22,color:CT,anchor:'middle',weight:700});
  s+=fade(g,line(A.X(0),A.Y(370),A.X(T1),A.Y(370),{color:C.dim,w:5})+dot(A.X(T1),A.Y(370),7,CY)+label('9.0 時（37％）',A.X(.5),A.Y(370)+30,{size:22,color:C.dim,weight:700}));
  s+=panel(88,170,label('1/e ≈ 37％ まで：1/λ ≈ 9.0 時',PC,135,{size:26,color:C.dim,anchor:'middle',weight:700})+label('50％ まで：T ＝ ln 2/λ ≈ 6.2 時',PC,190,{size:26,color:CT,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[['C','約 9.0 時','1/λ は 1/e（約 37％）までの 時間'],['D','約 0.077 時','ln 2 × λ。割るのが 正しい']],{opts:{...WR,y:290}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 13. 37％ の線とカードを消す。18.6 時に金の縦線
 [K+'goal3']:(p)=>{
  const {A,svg}=graph(),g=seg(p,.1,.3);
  let s=svg+curve(A)+pts2(A);
  s+=line(A.X(18.6),A.Y(0),A.X(18.6),A.Y(mix(0,1000,g)),{color:CT,w:3,dash:'8 6'})+fade(g,label('18.6 時',A.X(18.6),A.Y(1000)-12,{size:24,color:CT,anchor:'middle',weight:700}));
  s+=panel(88,200,label('18.6 時間後の 数え率 は？',PC,195,{size:32,color:CY,anchor:'middle',weight:700}),seg(p,.05,.18),HI);
  return s+goalTag(G3,{g:seg(p,.03,.12)});
 },
 // 14. 0〜18.6 時を T の金の目盛り3つで区切る
 [K+'thirds']:(p)=>{
  const {A,svg}=graph();
  let s=svg+curve(A)+pts2(A)+line(A.X(18.6),A.Y(0),A.X(18.6),A.Y(1000),{color:CT,w:3,dash:'8 6'});
  for(let i=0;i<3;i++){const g=seg(p,.1+.12*i,.2+.12*i);s+=fade(g,line(A.X(TH*i)+2,A.Y(0)-14,A.X(TH*(i+1))-2,A.Y(0)-14,{color:CT,w:6})+line(A.X(TH*(i+1)),A.Y(0)-28,A.X(TH*(i+1)),A.Y(0),{color:CT,w:3})+label('T',A.X(TH*(i+.5)),A.Y(0)-26,{size:24,color:CT,anchor:'middle',weight:700}));}
  s+=panel(88,240,label('何回分の 半減期？',PC,140,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.3,.45),T('\\dfrac{18.6}{6.21}\\approx 3',PC,225,44))
   +fade(seg(p,.5,.62),label('T の ほぼ 3回分',PC,300,{size:30,color:CT,anchor:'middle',weight:700})),1);
  return s+goalTag(G3);
 },
 // 15. 1000→500→250→125 の階段。横幅がどれも同じ T。答え A
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx,.6),{A,svg}=graph(),st=seg(p,.05,.4);
  let s=svg+curve(A)+pts2(A);
  const lv=[1000,500,250,125];
  for(let i=1;i<4;i++){const g=seg(st,(i-1)/3,i/3);
   s+=fade(g,line(A.X(TH*(i-1)),A.Y(lv[i-1]),A.X(TH*(i-1)),A.Y(lv[i]),{color:HI,w:3,dash:'5 5'})+line(A.X(TH*(i-1)),A.Y(lv[i]),A.X(TH*i),A.Y(lv[i]),{color:CT,w:5})
    +dot(A.X(TH*i),A.Y(lv[i]),8,CY)+label(String(lv[i]),A.X(TH*i)+10,A.Y(lv[i])-12,{size:24,color:CY,weight:700})+label('T',A.X(TH*(i-.5)),A.Y(lv[i])+28,{size:22,color:CT,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.4,.5),label('同じ T',A.X(14),A.Y(700),{size:26,color:CT,weight:700}));
  s+=panel(88,280,label('半減期 3回分',PC,140,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.1,.25),T('1000\\times\\left(\\dfrac{1}{2}\\right)^3',PC,225,40))
   +fade(seg(p,.3,.42),T('=125\\ \\text{回/秒}',PC,310,40,{color:CY})),1);
  return s+goalTag(G3)+ANS3(seg(p,b,b+.08));
 },
 // 16. 誤答 B → 誤答 D
 [K+'wrongBD3']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),w1=cw[0],w2=[cw[1]?cw[1][0]:.5,1],{A,svg}=graph();
  let s=svg+curve(A)+pts2(A);
  const lv=[1000,500,250,125];
  for(let i=1;i<4;i++)s+=line(A.X(TH*(i-1)),A.Y(lv[i]),A.X(TH*i),A.Y(lv[i]),{color:CT,w:5})+dot(A.X(TH*i),A.Y(lv[i]),7,CY);
  s+=label('125',A.X(TH*3)+10,A.Y(125)-12,{size:24,color:CY,weight:700});
  s+=panel(88,170,label('18.6 時 ＝ 半減期 3回分',PC,135,{size:26,color:C.ink,anchor:'middle',weight:700})+T('1000\\times(1/2)^3=125',PC,192,34),1);
  s+=wrongSeq(p,ctx,[['B','約 250 回','半減期 2回分と 数えた'],['D','約 333 回','3倍の 時間で 1/3 では ない。(1/2)³']],{win:[w1,w2],opts:{...WR,y:290}});
  return s+goalTag(G3)+ANS3(1);
 },
 // 17. 誤答 C：文1 で傾き一定の直線（赤の点線）が 10 時で 0。文2 で曲線に「平均の 数え率」の札、有限の時間では 0 にならない（2026-10-16 PQ-010）。
 //     声のあと、ln の直線 → λ → T → 階段 を矢印でつないで静止
 [K+'wrongC3']:(p,ctx)=>{
  const ve=voiceEnd(ctx),fin=seg(p,ve+.02,ve+.1),{A,svg}=graph(),b=s2(ctx,.45),gl=seg(p,.05,Math.max(.12,b-.08)),gm=seg(p,b,b+.08);
  let s=svg+curve(A)+pts2(A);
  const lv=[1000,500,250,125];
  for(let i=1;i<4;i++)s+=line(A.X(TH*(i-1)),A.Y(lv[i]),A.X(TH*i),A.Y(lv[i]),{color:CT,w:5})+dot(A.X(TH*i),A.Y(lv[i]),7,CY)+fade(fin,label(String(lv[i]),A.X(TH*i)+10,A.Y(lv[i])-12,{size:22,color:CY,weight:700}));
  s+=fade(1-fin,line(A.X(0),A.Y(1000),A.X(mix(0,10,gl)),A.Y(1000-100*mix(0,10,gl)),{color:RED,w:4,dash:'10 8'})+fade(seg(gl,.9,1),dot(A.X(10),A.Y(0),8,RED)+label('10 時で 0',A.X(10)+6,A.Y(0)-14,{size:24,color:RED,weight:700})));
  // 文2：曲線に「平均の 数え率」の札（2026-10-16 PQ-010）
  s+=fade((1-fin)*gm,line(A.X(8.6),A.Y(rT(8.6))-4,A.X(9.6),A.Y(rT(8.6))-40,{color:CY,w:2})+label('平均の 数え率',A.X(9.6)+4,A.Y(rT(8.6))-44,{size:24,color:CY,weight:700}));
  s+=fade(1-fin,panel(88,170,label('指数関数 ＝ 平均の 数え率',PC,135,{size:26,color:C.dim,anchor:'middle'})+label('有限の 時間では 0 に ならない',PC,190,{size:28,color:CY,anchor:'middle',weight:700}),gm)
   +wrongCard('C','0 回',['一定の 量ずつ 減らした','平均の 数え率は 0 に ならない'],{...WR,y:290})+goalTag(G3)+ANS3(1));
  // 最後の静止画：三つの答えをつなぐ
  const box=(y,txt,col)=>card(PX+20,y,PW-40,64,label(txt,PC,y+42,{size:24,color:col,anchor:'middle',weight:700}),1,col);
  s+=fade(fin,box(96,'ln の 直線：傾き −0.11 /時',CY)+arrow(PC,162,PC,190,{color:C.dim,w:3,head:12,g:1})
   +box(192,'λ ≈ 0.11 /時',HI)+arrow(PC,258,PC,286,{color:C.dim,w:3,head:12,g:1})
   +box(288,'T ＝ ln 2 / λ ≈ 6.2 時',CT)+arrow(PC,354,PC,382,{color:C.dim,w:3,head:12,g:1})
   +box(384,'T の 3回分：1000→500→250→125',CY));
  s+=answerRow([[1,'D','0.11 /時'],[2,'B','6.2 時'],[3,'A','125 回/秒']],{g:fin,size:24});
  return s;
 },
};
