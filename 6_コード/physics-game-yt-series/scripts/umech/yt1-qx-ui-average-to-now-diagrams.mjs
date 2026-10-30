// 問題編 解説「坂を下りはじめた台車」（q-ui-average-to-now、大学 01 微分・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/01_微分.md の q-ui-average-to-now（解説 20 行）。
// 画面：左に x–t グラフ、右に式と札。札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：位置 x 水色、速度 v 紫（触れる直線も紫）、時刻 t 金、幅 h 黄、誤り 赤、正しい確かめ ✓ 緑。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,texWidth,highlight,axes,cart,mix,clamp} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,pauseBadge,sentWin,QC} from './yt1-qx-common.mjs';

const K='qx-ui-average-to-now:';
const Hc=`{\\color{${C.hi}}h}`;
const RED=QC.bad,OK=C.F;
const fx=t=>3*t*t;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const ok=(x,y)=>label('✓',x,y,{size:34,color:OK,anchor:'middle',weight:700});
const G1='2〜2.5 s の平均の速さ',G2='t＝2 s ちょうどの瞬間の速さ',G3='小問2 の値の決め方';
const ANS1=g=>answerTag(1,'C','13.5 m/s',{g}),ANS2=g=>answerTag(2,'B','12 m/s',{g}),ANS3=g=>answerTag(3,'A','',{g});
const WOPT={x:610,w:580,size:26,whySize:22};
// 文の中の「、」で区切った区間（cue の進み 0〜1）
function clauseWin(ctx,i){
 const W=sentWin(ctx),[a,b]=W[Math.min(i,W.length-1)];
 const r=((ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean)[i])??'';
 const parts=r.split('、').filter(Boolean);if(parts.length<2)return [[a,b]];
 const tot=parts.reduce((s,x)=>s+x.length,0);let acc=0;
 return parts.map(x=>{const s0=a+(b-a)*acc/tot;acc+=x.length;return [s0,a+(b-a)*acc/tot];});
}
const s2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};

// ---- x–t グラフ（左）----
function graph({x=80,y=480,w=420,h=340,g=1,ticks=true,xt=[1,2,3],yt=[10,20,30],xmax=3.2,ymax=30}={}){
 const A=axes({x,y,w,h,xmax,ymax,xticks:ticks?xt:[],yticks:ticks?yt:[],xlabel:'t [s]',ylabel:'x [m]',xcolor:C.t,ycolor:C.x,g});
 return {A,svg:A.svg+fade(g,A.plot(fx,{from:0,to:Math.min(3.15,Math.sqrt(ymax/3)*.995),color:C.x,w:4}))};
}
const P=(A,t,col=C.hi,r=8)=>dot(A.X(t),A.Y(fx(t)),r,col);
const L=(A,t0,k,a,b,o={})=>line(A.X(a),A.Y(fx(t0)+k*(a-t0)),A.X(b),A.Y(fx(t0)+k*(b-t0)),{w:3,...o});
const chord=(A,t1,t2,a,b,o={})=>L(A,t1,(fx(t2)-fx(t1))/(t2-t1),a,b,o);
function guides(A,t,{tl='',xl='',g=1}={}){
 const X=A.X(t),Y=A.Y(fx(t));
 return fade(g,line(X,Y,X,A.Y(0),{color:C.faint,w:2,dash:'6 6'})+line(A.X(0),Y,X,Y,{color:C.faint,w:2,dash:'6 6'})
  +(tl?label(tl,X,A.Y(0)+34,{size:22,color:C.t,anchor:'middle',weight:700}):'')+(xl?label(xl,A.X(0)-12,Y+8,{size:22,color:C.x,anchor:'end',weight:700}):''));
}
function tri(A,hh,{g=1,dxl='',dtl='',col=C.x,thick=5}={}){
 const x1=A.X(2),y1=A.Y(12),x2=A.X(2+hh),y2=A.Y(fx(2+hh));
 return fade(g,line(x1,y1,x2,y1,{color:C.t,w:5})+line(x2,y1,x2,y2,{color:col,w:thick})
  +(dtl?label(dtl,(x1+x2)/2,y1+32,{size:24,color:C.t,anchor:'middle',weight:700}):'')
  +(dxl?label(dxl,x2+12,(y1+y2)/2+8,{size:24,color:col,weight:700}):''));
}
const strike=(x1,y1,x2,y2,g=1)=>fade(g,line(x1,y1,x2,y2,{color:RED,w:4}));
const slopeLab=(A,txt,col=C.v)=>label(txt,A.X(2.95)+10,A.Y(fx(2)+13.5*.95)+30,{size:24,color:col,weight:700});
// 基本のグラフ（2点・三角形・直線 13.5）
function baseGraph({chordG=1,tri0=1}={}){
 const {A,svg}=graph();
 let s=svg+P(A,2)+P(A,2.5);
 if(tri0)s+=tri(A,.5,{dxl:'Δx ＝ 6.75 m'})+label('Δt ＝ 0.5 s',A.X(2.25),A.Y(12)+34,{size:24,color:C.t,anchor:'middle',weight:700});
 s+=fade(chordG,chord(A,2,2.5,1.85,2.95,{color:C.v,w:3})+slopeLab(A,'傾き 13.5'));
 return {A,svg:s};
}

// ---- 出題中の図：坂を下る台車と x–t グラフ ----
const SX0=80,SY0=135,SX1=820,SY1=215;
function slope(u){
 const ang=Math.atan2(SY1-SY0,SX1-SX0)*180/Math.PI;
 let s=line(SX0,SY0+4,SX1,SY1+4,{color:C.dim,w:4});
 for(let q=SX0+20;q<SX1;q+=34){const yy=SY0+4+(SY1-SY0)*(q-SX0)/(SX1-SX0);s+=line(q,yy+2,q-12,yy+16,{color:C.faint,w:2});}
 const cx=mix(SX0+40,SX1-40,u),cy=mix(SY0,SY1,(cx-SX0)/(SX1-SX0));
 s+=`<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${ang.toFixed(2)})">${cart(0,0,{w:84,h:34,color:C.x})}</g>`;
 // x の向き（坂に沿って、坂の下側）
 const ux=(SX1-SX0),uy=(SY1-SY0),n=Math.hypot(ux,uy),ex=ux/n,ey=uy/n,ox=SX0+60,oy=SY0+40;
 s+=arrow(ox,oy,ox+170*ex,oy+170*ey,{color:C.x,w:3,head:12})+label('x',ox+182*ex,oy+182*ey+10,{size:26,color:C.x,weight:700});
 return s;
}
// opts: cartU（0〜1 の動き）、ringG（t＝2 の輪と問い）、eqG（右の式）、badge（一時停止）
function setupFig({cartU=.5,ringG=1,eqG=1,badge=0,g=1}={}){
 const {A,svg}=graph({x:150,y:462,w:600,h:200,ticks:false,ymax:28});
 let s=slope(cartU)+fade(g,svg);
 s+=fade(g,line(A.X(2),A.Y(0)-6,A.X(2),A.Y(0)+6,{color:C.t,w:2})+line(A.X(2.5),A.Y(0)-6,A.X(2.5),A.Y(0)+6,{color:C.t,w:2})
  +label('2',A.X(2),A.Y(0)+30,{size:22,color:C.t,anchor:'middle'})+label('2.5',A.X(2.5),A.Y(0)+30,{size:22,color:C.t,anchor:'middle'}));
 s+=fade(g,chord(A,2,2.5,1.85,2.65,{color:C.v,w:3,opacity:.6})+tri(A,.5,{dtl:'Δt',dxl:'Δx',thick:4})+P(A,2.5)+P(A,2));
 s+=fade(ringG,ring(A.X(2),A.Y(12),20,{color:C.hi,w:3})+label('t ＝ 2 の 瞬間の 速さ は？',A.X(2)-30,A.Y(12)-34,{size:26,color:C.hi,anchor:'end',weight:700}));
 s+=fade(eqG,T('x=3t^2',1000,330,52));
 if(badge)s+=pauseBadge({g:badge,x:1000,y:96});
 return s;
}

// 0 ÷ 0 の確かめ（単元動画と同じ形。数は 5・12・100）
function zeroRows(p,b){
 const Y=[220,320,420];let s='';
 s+=fade(seg(p,.04,.16),T('0\\div0=\\square',330,Y[0],48,{auto:false,color:C.hi})+label('⇔',600,Y[0]+12,{size:40,color:C.dim,anchor:'middle'})+T('\\square\\times0=0',870,Y[0],48,{auto:false,color:C.hi}));
 const span=1-b;
 [['5',b+.04],['12',b+.04+span*.18],['100',b+.04+span*.36]].forEach(([n,a],i)=>{const x=270+i*330,W=texWidth(`${n}\\times0=0`,40,false);
  s+=fade(seg(p,a,a+.06),T(`${n}\\times0=0`,x,Y[1]+10,40,{auto:false})+ok(x+W/2+24,Y[1]+22));});
 s+=card(230,Y[2]-36,740,72,label('□ に何を入れても 合う → 一つに 決まらない',600,Y[2]+11,{size:30,color:RED,anchor:'middle',weight:700}),seg(p,b+span*.6,b+span*.7),RED);
 return s;
}
// 数直線 12 … 13.5 と、黄色の 3h の棒
function hline(hh,{x0=650,x1=1150,y=300,g=1}={}){
 const X=v=>x0+(x1-x0)*(v-11.8)/(13.8-11.8);
 let s=line(x0,y,x1,y,{color:C.dim,w:3});
 for(const v of [12,12.5,13,13.5])s+=line(X(v),y-8,X(v),y+8,{color:C.dim,w:2})+label(String(v),X(v),y+38,{size:22,color:v===12?C.v:C.dim,anchor:'middle',weight:v===12?700:400});
 s+=line(X(12),y-50,X(12),y+12,{color:C.v,w:3,dash:'8 6'});
 const v=12+3*hh;
 s+=rect(X(12),y-14,X(v)-X(12),28,{fill:C.hi,fo:.75,stroke:C.hi,rx:3});
 if(X(v)-X(12)>40)s+=label('3h',(X(12)+X(v))/2,y-24,{size:26,color:C.hi,anchor:'middle',weight:700});
 s+=dot(X(v),y,9,C.v);
 return fade(g,s);
}
const hOf=u=>0.5*Math.pow(0.02,clamp(u)); // 0.5 → 0.01

export const ytQxUiAverageToNowDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約6秒）：グラフと2点・三角形が出て、台車が坂を下り始め、だんだん速く中ほどまで。t＝2 の輪と問い、右に x＝3t²。
 // 台車が中ほどに来た所で「映像を一時停止」（台車は止まっていない）。触れる直線・幅を縮める動き・傾きの数値は出さない。
 [K+'q0']:(p)=>{
  const q=clamp(p/.75);
  return setupFig({cartU:.5*q*q,g:seg(p,0,.15),ringG:seg(p,.55,.7),eqG:seg(p,.12,.25),badge:seg(p,.76,.86)});
 },

 // ===================== 問題の設定 =====================
 // 1. 出題中と同じ図。冒頭で x＝3t²、「瞬間の速さ」で t＝2 の輪と問い。求めるもの札。
 [K+'setup']:(p,ctx)=>{
  const b=s2(ctx,.45),q=clamp(p/.6);
  return setupFig({cartU:.5*q*q,g:1,eqG:seg(p,.02,.12),ringG:seg(p,b+.12,b+.24),badge:seg(p,.62,.7)})+goalTag('t＝2 s の瞬間の速さ',{g:seg(p,.03,.12)});
 },

 // ===================== 小問1 =====================
 // 2. x(2.5)＝3×2.5² → ＝3×6.25 → ＝18.75 m。「18.75メートル」で縦軸への点線と 18.75
 [K+'x25']:(p,ctx)=>{
  const b=s2(ctx,.35),sp=1-b;
  const {A,svg}=graph({yt:[30]});let s=svg+P(A,2)+P(A,2.5)+guides(A,2.5,{xl:'18.75',g:seg(p,b+sp*.75,b+sp*.85)});
  s+=label('2',A.X(2),A.Y(0)+34,{size:22,color:C.t,anchor:'middle',weight:700})+label('2.5',A.X(2.5)+6,A.Y(0)+34,{size:22,color:C.t});
  s+=fade(seg(p,.03,.15),label('2 s → 2.5 s の 平均',630,130,{size:30,color:C.ink,weight:700}));
  const X0=640,dx=texWidth('x(2.5)',44);
  s+=fade(seg(p,b+sp*.05,b+sp*.2),T('x(2.5)=3\\times2.5^2',X0,220,44,{anchor:'start'}));
  s+=fade(seg(p,b+sp*.4,b+sp*.5),T('=3\\times6.25',X0+dx,300,44,{anchor:'start'}));
  s+=fade(seg(p,b+sp*.72,b+sp*.82),T('=18.75\\,\\mathrm{m}',X0+dx,380,44,{anchor:'start',auto:false,color:C.x}));
  return s+goalTag(G1,{g:seg(p,.02,.1)});
 },
 // 3. 前の式は上に小さく。x(2)＝3×4＝12 m、Δx＝18.75−12 → ＝6.75 m。縦の辺を太く「Δx＝6.75 m」「進んだ距離」
 [K+'dx']:(p,ctx)=>{
  const b=s2(ctx,.4),sp=1-b;
  const {A,svg}=graph({yt:[30]});let s=svg+guides(A,2.5,{xl:'18.75'})+guides(A,2,{xl:'12',g:seg(p,.1,.22)})+P(A,2)+P(A,2.5);
  s+=label('2',A.X(2),A.Y(0)+34,{size:22,color:C.t,anchor:'middle',weight:700})+label('2.5',A.X(2.5)+6,A.Y(0)+34,{size:22,color:C.t});
  s+=T('x(2.5)=18.75\\,\\mathrm{m}',640,120,32,{anchor:'start',opacity:.7});
  s+=fade(seg(p,.04,.16),T('x(2)=3\\times4=12\\,\\mathrm{m}',640,200,42,{anchor:'start'}));
  s+=fade(seg(p,b+sp*.2,b+sp*.35),T('\\Delta x=18.75-12',640,290,42,{anchor:'start'}));
  s+=fade(seg(p,b+sp*.7,b+sp*.8),T('=6.75\\,\\mathrm{m}',640+texWidth('\\Delta x',42),370,42,{anchor:'start',auto:false,color:C.x}));
  s+=tri(A,.5,{g:seg(p,b+sp*.7,b+sp*.8),dxl:'Δx ＝ 6.75 m',thick:7});
  s+=fade(seg(p,b+sp*.75,b+sp*.85),label('進んだ距離',A.X(2.5)+14,A.Y(15.4)+40,{size:24,color:C.x}));
  return s+goalTag(G1);
 },
 // 4. Δt＝0.5 s。v̄＝Δx/Δt＝6.75/0.5 → ＝6.75×2（0.5 で割る＝2倍）→ ＝13.5 m/s。直線を延ばし「傾き 13.5」
 [K+'divide']:(p,ctx)=>{
  const b=s2(ctx,.4),sp=1-b;
  const {A,svg}=graph();let s=svg+P(A,2)+P(A,2.5)+tri(A,.5,{dxl:'Δx ＝ 6.75 m'});
  s+=fade(seg(p,.04,.15),label('Δt ＝ 0.5 s',A.X(2.25),A.Y(12)+34,{size:24,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),T('\\bar v=\\dfrac{\\Delta x}{\\Delta t}=\\dfrac{6.75}{0.5}',640,170,44,{anchor:'start'}));
  const dx=texWidth('\\bar v',44)+4;
  s+=fade(seg(p,b+sp*.1,b+sp*.25),T('=6.75\\times2',640+dx,280,44,{anchor:'start'})+label('0.5 で割る ＝ 2倍',930,292,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,b+sp*.7,b+sp*.8),T('=13.5\\,\\mathrm{m/s}',640+dx,370,44,{anchor:'start',auto:false,color:C.v}));
  s+=fade(seg(p,b+sp*.72,b+sp*.85),chord(A,2,2.5,1.85,2.95,{color:C.v,w:3})+slopeLab(A,'傾き 13.5'));
  return s+goalTag(G1);
 },
 // 5. 答えの札 C。誤答 A（6.75）→ B（3.375）を1枚ずつ
 [K+'ans1']:(p,ctx)=>{
  const {A,svg}=baseGraph();let s=svg;
  s+=card(600,95,590,110,T('\\bar v=\\dfrac{6.75}{0.5}=13.5\\,\\mathrm{m/s}',895,150,36,{auto:false}),1,C.v);
  const cw=clauseWin(ctx,1),wA=cw[0],wB=[cw[1]?cw[1][0]:.75,1];
  const gA=seg(p,wA[0]+.01,wA[0]+.05)*(1-seg(p,wA[1]-.03,wA[1])),gB=seg(p,wB[0]+.01,wB[0]+.05);
  s+=wrongCard('A','6.75 m/s','0.5 で 割り忘れた',{...WOPT,y:240,g:gA,mid:'6.75'});
  s+=wrongCard('B','3.375 m/s','0.5 を 掛けてしまった',{...WOPT,y:240,g:gB,mid:'6.75\\times0.5=3.375'});
  return s+goalTag(G1)+ANS1(seg(p,.03,.1));
 },
 // 6. B を消して誤答 D（18.75÷2.5）。「2秒の位置を引いていない」で原点〜t＝2.5 の赤の点線
 [K+'wrongD']:(p,ctx)=>{
  const b=s2(ctx,.5);
  const {A,svg}=baseGraph();let s=svg;
  const gl=seg(p,b+.02,b+.12);
  s+=fade(gl,line(A.X(0),A.Y(0),A.X(2.75),A.Y(7.5*2.75),{color:RED,w:4,dash:'10 7'})+dot(A.X(0),A.Y(0),7,RED)
   +label('傾き 7.5',A.X(1.55),A.Y(7.5*1.55)-16,{size:24,color:RED,anchor:'end',weight:700}));
  s+=wrongCard('D','7.5 m/s','区間の 差を とっていない',{...WOPT,y:110,g:seg(p,.02,.08),mid:'18.75\\div2.5=7.5'});
  s+=fade(seg(p,b+.15,b+.25),card(600,320,590,110,label('2秒の 位置 12 を 引いていない',895,362,{size:26,color:C.ink,anchor:'middle',weight:700})
   +label('（0 s からの 平均の 傾き）',895,405,{size:24,color:C.dim,anchor:'middle'}),1,RED));
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 7. 13.5 は 2〜2.5 s の平均。「だんだん速く」で短い接線（黄）、「小さいはず」で札
 [K+'steep']:(p,ctx)=>{
  const b=s2(ctx,.42),sp=1-b;
  const {A,svg}=graph();let s=svg;
  [[.8,.05],[1.6,.15],[2.4,.25]].forEach(([t,a])=>{s+=fade(seg(p,b+sp*a,b+sp*(a+.1)),L(A,t,6*t,t-.42,t+.42,{color:C.hi,w:6})+dot(A.X(t),A.Y(fx(t)),5,C.hi));});
  s+=fade(seg(p,b+sp*.38,b+sp*.48),label('右へ 行くほど 急',A.X(1.15),A.Y(21),{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(.45,chord(A,2,2.5,1.75,2.75,{color:C.v,w:3}))+P(A,2)+P(A,2.5);
  s+=card(600,100,590,130,label('13.5 m/s',895,152,{size:34,color:C.v,anchor:'middle',weight:700})+label('＝ 2〜2.5 s の 平均',895,200,{size:28,color:C.ink,anchor:'middle'}),seg(p,.03,.15));
  s+=card(600,270,590,140,label('2秒 ちょうどの 速さ',895,325,{size:30,color:C.ink,anchor:'middle',weight:700})+label('＜ 13.5 の はず',895,380,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,b+sp*.75,b+sp*.85),C.hi);
  return s+goalTag(G2,{g:seg(p,.02,.1)});
 },
 // 8. 幅を文字 h で。横軸の 2〜2＋h に黄色の太線、式 x(2＋h)＝3(2＋h)²。「2乗」で正方形を 4・2h・2h・h² に分ける
 [K+'square']:(p,ctx)=>{
  const b=s2(ctx,.42),sp=1-b;
  const {A,svg}=graph({x:80,y:480,w:400,h:330,xt:[1,2]});let s=svg+P(A,2)+P(A,2.5);
  s+=fade(seg(p,.05,.18),line(A.X(2),A.Y(0)-12,A.X(2.5),A.Y(0)-12,{color:C.hi,w:7})+label('2 ＋ h',A.X(2.5)+8,A.Y(0)+34,{size:22,color:C.hi,anchor:'middle',weight:700})
   +label('h',(A.X(2)+A.X(2.5))/2,A.Y(0)-24,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.12,.25),label('幅 h（0 ではない 正の数）',560,125,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,b+sp*.05,b+sp*.18),T(`x(2+${Hc})=3(2+${Hc})^2`,560,195,40,{anchor:'start'}));
  const u=140,hh=56,x0=620,y0=255,g1=seg(p,b+sp*.5,b+sp*.6),g2=seg(p,b+sp*.6,b+sp*.7),g3=seg(p,b+sp*.7,b+sp*.8),g4=seg(p,b+sp*.8,b+sp*.9);
  s+=fade(g1,rect(x0,y0,u+hh,u+hh,{fill:'none',fo:0,stroke:C.dim,sw:3,rx:0})+label('2 ＋ h',x0-12,y0+(u+hh)/2+8,{size:24,color:C.ink,anchor:'end'}));
  s+=fade(g2,rect(x0,y0,u,u,{fill:C.x,fo:.25,rx:0})+label('4',x0+u/2,y0+u/2+10,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(g3,rect(x0+u,y0,hh,u,{fill:C.hi,fo:.3,rx:0})+rect(x0,y0+u,u,hh,{fill:C.hi,fo:.3,rx:0})+label('2h',x0+u+hh/2,y0+u/2+10,{size:24,color:C.hi,anchor:'middle'})+label('2h',x0+u/2,y0+u+hh/2+10,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(g4,rect(x0+u,y0+u,hh,hh,{fill:C.a,fo:.35,rx:0})+label('h²',x0+u+hh/2,y0+u+hh/2+10,{size:24,color:C.a,anchor:'middle'}));
  s+=fade(g4,T(`(2+${Hc})^2`,880,300,38,{anchor:'start'})+T(`=4+4${Hc}+${Hc}^2`,880,370,38,{anchor:'start'}));
  return s+goalTag(G2);
 },
 // 9. 式だけの画面。展開 → −12 → 12 に打ち消し線 → ＝12h＋3h²
 [K+'expand']:(p,ctx)=>{
  const b=s2(ctx,.42),sp=1-b,x1=90,sz=46;let s='';
  s+=T(`3(2+${Hc})^2=3(4+4${Hc}+${Hc}^2)`,x1,130,40,{anchor:'start'});
  s+=fade(seg(p,.1,.25),T(`=12+12${Hc}+3${Hc}^2`,x1+texWidth(`3(2+${Hc})^2`,40),210,40,{anchor:'start'})+label('3 を 配る',760,222,{size:26,color:C.dim}));
  const r1=`\\Delta x=12+12${Hc}+3${Hc}^2-12`,y1=320;
  s+=fade(seg(p,b+sp*.05,b+sp*.2),T(r1,x1,y1,sz,{anchor:'start'})+label('− 2秒の位置 12',x1+texWidth(r1,sz)+40,y1+10,{size:26,color:C.hi,weight:700}));
  const a=x1+texWidth('\\Delta x=',sz),w12=texWidth('12',sz),bb=x1+texWidth(r1,sz)-w12,g=seg(p,b+sp*.4,b+sp*.5);
  s+=strike(a-4,y1+18,a+w12+4,y1-30,g)+strike(bb-4,y1+18,bb+w12+4,y1-30,g);
  s+=fade(seg(p,b+sp*.72,b+sp*.84),T(`=12${Hc}+3${Hc}^2`,x1+texWidth('\\Delta x',sz),420,sz,{anchor:'start'})+label('残る（進んだ距離）',x1+texWidth(`\\Delta x=12${Hc}+3${Hc}^2`,sz)+40,432,{size:26,color:C.x,weight:700}));
  return s+goalTag(G2);
 },
 // 10. v̄＝(12h＋3h²)/h。「0ではないので」で札。約分して v̄＝12＋3h（黄の枠）
 [K+'cancel']:(p,ctx)=>{
  const b=s2(ctx,.42),sp=1-b;
  let s=T(`\\Delta x=12${Hc}+3${Hc}^2`,90,120,34,{anchor:'start',opacity:.75});
  s+=fade(seg(p,.05,.2),T(`\\bar v=\\dfrac{12${Hc}+3${Hc}^2}{${Hc}}`,90,225,46,{anchor:'start'}));
  s+=fade(seg(p,b+sp*.1,b+sp*.25),card(600,175,500,80,label('h ≠ 0 なので 割ってよい',850,226,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  const st=`{\\color{${RED}}\\cancel{\\color{${C.hi}}h}}`,cg=seg(p,b+sp*.45,b+sp*.55);
  const f1=cg>.5?`\\dfrac{12${st}}{${st}}=12`:`\\dfrac{12${Hc}}{${Hc}}=12`,f2=cg>.5?`\\dfrac{3${Hc}^{2}}{${st}}=3${Hc}`:`\\dfrac{3${Hc}^2}{${Hc}}=3${Hc}`;
  s+=fade(seg(p,b+sp*.3,b+sp*.42),T(f1,200,370,42)+T(f2,470,370,42));
  const R=`\\bar v=12+3${Hc}`,W=texWidth(R,56);
  s+=fade(seg(p,b+sp*.65,b+sp*.78),T(R,880,370,56)+highlight(880-W/2-20,322,W+40,90,1));
  s+=fade(seg(p,b+sp*.78,b+sp*.9),label('幅 h の 平均の速さ［m/s］',880,460,{size:26,color:C.v,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 11. グラフを戻し、表で h＝0.5 → 13.5（緑の枠「小問1 の 13.5 と一致 ✓」）、続けて 0.1、0.01
 [K+'check']:(p,ctx)=>{
  const b=s2(ctx,.6);
  const {A,svg}=baseGraph({tri0:0});let s=svg;
  s+=T(`\\bar v=12+3${Hc}`,895,120,42);
  const rows=[['0.5','12 ＋ 1.5','13.5'],['0.1','12 ＋ 0.3','12.3'],['0.01','12 ＋ 0.03','12.03']];
  const ve=sentWin(ctx).at(-1)[1];
  s+=card(600,155,590,260,label('h',660,195,{size:26,color:C.hi,anchor:'middle',weight:700})+label('12 ＋ 3h',820,195,{size:26,color:C.ink,anchor:'middle'})+label('平均',1060,195,{size:26,color:C.v,anchor:'middle',weight:700})+line(620,212,1170,212,{color:C.faint,w:2})
   +rows.map(([h,m,v],i)=>{const y=262+i*62,g=i===0?seg(p,.05,.2):seg(p,ve+(i-1)*.08,ve+(i-1)*.08+.06);return fade(g,label(h,660,y,{size:30,color:C.hi,anchor:'middle'})+label(m,820,y,{size:28,color:C.ink,anchor:'middle'})+label(`＝ ${v}`,1060,y,{size:30,color:C.v,anchor:'middle',weight:700}));}).join(''));
  s+=fade(seg(p,b,b+.08),highlight(610,232,570,46,1,OK)+label('小問1 の 13.5 と 一致 ✓',895,460,{size:30,color:OK,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 12. 右の点を t＝2.5 → 2.01 へ。直線が触れる直線（薄い点線）へ回り、h と平均の札が連動、数直線の 3h の棒が縮む
 [K+'shrink']:(p)=>{
  const u=seg(p,.1,.8),hh=hOf(u),{A,svg}=graph();
  let s=svg+fade(.4,L(A,2,12,1.4,2.95,{color:C.v,w:2.5,dash:'8 6'}))+chord(A,2,2+hh,1.4,2.95,{color:C.v,w:3})+P(A,2)+P(A,2+hh,C.hi,7);
  s+=T(`\\bar v=12+3${Hc}`,895,120,46);
  s+=card(620,160,550,76,label(`h ＝ ${hh.toFixed(2)} s`,650,210,{size:30,color:C.hi,weight:700})+label(`平均 ＝ ${(12+3*hh).toFixed(2)}`,1140,210,{size:30,color:C.v,anchor:'end',weight:700}),1);
  s+=hline(hh,{y:340});
  s+=fade(seg(p,.84,.94),label('12 だけが 残る',895,450,{size:32,color:C.v,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 13. 左：v̄＝12＋3h と数直線 → 近づく値 12。右：瞬間の速さ 12 m/s の札。「dx/dt」の前に d の札、そのあと v＝dx/dt＝12 m/s
 [K+'limit']:(p,ctx)=>{
  const b=s2(ctx,.55);
  let s=T(`\\bar v=12+3${Hc}`,320,125,46);
  s+=hline(.01,{x0:80,x1:560,y:220});
  s+=fade(seg(p,.03,.14),label('h を 0 に 近づけると',320,305,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(320,322,320,372,{color:C.hi,w:4,head:14}));
  s+=fade(seg(p,.1,.22),label('平均の 速さが 近づく 値',320,415,{size:30,color:C.v,anchor:'middle',weight:700})+label('12',320,470,{size:40,color:C.v,anchor:'middle',weight:700}));
  const gc=seg(p,b*.6,b*.6+.1);
  s+=card(640,345,520,130,label('2秒 ちょうどの 瞬間の 速さ',900,395,{size:28,color:C.ink,anchor:'middle',weight:700})+label('12 m/s',900,450,{size:38,color:C.v,anchor:'middle',weight:700}),gc,C.v);
  s+=arrow(370,455,630,425,{color:C.v,w:3,head:12,g:gc});
  s+=fade(seg(p,b,b+.08),card(640,100,520,62,label('dx・dt の d ＝ 幅を 0 に 近づけた 印',900,140,{size:24,color:C.dim,anchor:'middle'}),1,C.dim));
  s+=fade(seg(p,b+.12,b+.22),T('v=\\dfrac{dx}{dt}=12\\,\\mathrm{m/s}',900,250,50));
  return s+goalTag(G2);
 },
 // 14. 触れる直線（紫の太線）。「B です」で答えの札。凡例 12・13.5・15、「13.5」「15」で × 誤答 C・D を1つずつ
 [K+'tangent']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,sp=1-b;
  const {A,svg}=graph();let s=svg;
  s+=fade(.8,chord(A,2,3,1.6,3.05,{color:C.dim,w:2,dash:'12 6'})+chord(A,2,2.5,1.6,3.05,{color:C.dim,w:2,dash:'4 6'}));
  s+=fade(seg(p,.03,.15),L(A,2,12,1.1,3.05,{color:C.v,w:5}))+P(A,2);
  s+=fade(seg(p,.1,.22),label('t ＝ 2 で 触れる 直線',A.X(2.15),A.Y(5),{size:24,color:C.v,anchor:'start',weight:700}));
  const gL=seg(p,b,b+.06),gC=seg(p,b+sp*.08,b+sp*.16),gD=seg(p,b+sp*.3,b+sp*.38);
  s+=card(600,110,590,230,
    line(625,160,690,160,{color:C.v,w:5})+label('12：触れる 直線（瞬間）',705,169,{size:26,color:C.v,weight:700})
   +line(625,225,690,225,{color:C.dim,w:2,dash:'4 6'})+label('13.5：2〜2.5 s の 平均',705,234,{size:26,color:C.dim})
   +fade(gC,label('× 誤答 C',1170,234,{size:26,color:RED,anchor:'end',weight:700}))
   +line(625,290,690,290,{color:C.dim,w:2,dash:'12 6'})+label('15：2〜3 s の 平均',705,299,{size:26,color:C.dim})
   +fade(gD,label('× 誤答 D',1170,299,{size:26,color:RED,anchor:'end',weight:700})),gL);
  return s+goalTag(G2)+ANS2(seg(p,b-.1,b-.03));
 },
 // 15. 凡例を消す。t＝2 で触れる直線（傾き 12）。「割った値」で原点〜t＝2 の赤の直線「傾き 6」。誤答カード 小問2 A。最後に紫の札
 [K+'origin']:(p,ctx)=>{
  const b=s2(ctx,.5),cw=clauseWin(ctx,0),ga=seg(p,(cw.at(-1)[0]),(cw.at(-1)[0])+.08);
  const {A,svg}=graph();let s=svg+guides(A,2,{xl:'12'});
  s+=L(A,2,12,1.2,3.05,{color:C.v,w:4})+label('傾き 12',A.X(2.75)+10,A.Y(12+12*.75)+8,{size:24,color:C.v,weight:700});
  s+=fade(ga,line(A.X(0),A.Y(0),A.X(3.05),A.Y(6*3.05),{color:RED,w:4})+dot(A.X(0),A.Y(0),7,RED)+label('傾き 6',A.X(2.8),A.Y(6*2.8)+34,{size:24,color:RED,anchor:'middle',weight:700}));
  s+=P(A,2);
  s+=wrongCard('小問2 A','6 m/s','＝ 0〜2 s の 平均',{...WOPT,y:100,g:seg(p,.02,.08),mid:'12\\,\\mathrm{m}\\div2\\,\\mathrm{s}=6\\,\\mathrm{m/s}'});
  const sp=1-b;
  s+=card(600,320,590,90,label('瞬間の 速さ 12 とは 別',895,377,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,b+sp*.65,b+sp*.75),C.v);
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 16. 答えの札 A。中央に緑の枠（決め方）。「幅を0にして割ったのではなく」で赤の枠
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx,.3),sp=1-b;
  let s=card(100,100,1000,220,label('幅 h の 平均を 式に 書き',600,152,{size:32,color:C.ink,anchor:'middle',weight:700})+T(`\\bar v=12+3${Hc}`,600,215,42)
   +label('h を 0 に 近づけた とき、近づく 値 12',600,290,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.18),OK);
  s+=card(250,360,700,90,label('幅を 0 に して 割ったのでは ない',600,417,{size:32,color:RED,anchor:'middle',weight:700}),seg(p,b+sp*.1,b+sp*.2),RED);
  return s+goalTag(G3,{g:seg(p,.02,.1)})+ANS3(seg(p,.03,.1));
 },
 // 17. 誤答 B：0÷0＝□ ⇔ □×0＝0。「どんな数を入れても」で 5・12・100 ✓。赤の枠
 [K+'zero']:(p,ctx)=>{
  const b=s2(ctx,.4);
  let s=wrongCard('B','幅を 0 に して 0 m ÷ 0 s',[],{x:250,w:700,y:92,size:28,g:seg(p,.02,.08)});
  return s+zeroRows(p,b)+goalTag(G3)+ANS3(1);
 },
 // 18. B のカードと 0÷0 を消し、グラフ。原点〜t＝2 の赤の直線（傾き 6）、誤答カード 小問3 D から矢印。紫の触れる直線と並べる
 [K+'wrong3D']:(p,ctx)=>{
  const b=s2(ctx,.5);
  const {A,svg}=graph();let s=svg+guides(A,2,{xl:'12'});
  s+=L(A,2,12,1.2,3.05,{color:C.v,w:4})+label('傾き 12',A.X(2.75)+10,A.Y(12+12*.75)+8,{size:24,color:C.v,weight:700});
  const gl=seg(p,.06,.16);
  s+=fade(gl,line(A.X(0),A.Y(0),A.X(3.05),A.Y(6*3.05),{color:RED,w:4})+dot(A.X(0),A.Y(0),7,RED)+label('傾き 6',A.X(2.8),A.Y(6*2.8)+34,{size:24,color:RED,anchor:'middle',weight:700}));
  s+=P(A,2);
  s+=wrongCard('小問3 D','位置を t で 割り直す','（0〜2 s の 平均）',{...WOPT,y:100,g:seg(p,.02,.08),mid:'12\\div2=6'});
  s+=fade(seg(p,b,b+.08),line(640,212,640,300,{color:RED,w:3})+arrow(640,300,A.X(3.05)+14,A.Y(6*3.05)+10,{color:RED,w:3,head:14}));
  s+=card(600,320,590,90,label('瞬間の 速さ は 決まらない',895,377,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,b+.2,b+.28),C.v);
  return s+goalTag(G3)+ANS3(1);
 },
 // 19. 1〜2 s（9）と 2〜2.5 s（13.5）の直線（赤）、触れる直線（紫 12）。誤答カード C、11.25≠12、黄の札
 [K+'middle']:(p,ctx)=>{
  const b=s2(ctx,.6),sp=1-b;
  const {A,svg}=graph();let s=svg;
  s+=fade(seg(p,.03,.12),chord(A,1,2,.55,2.35,{color:RED,w:3})+P(A,1,RED,7)+label('9',A.X(.7),A.Y(3-9*.3)-14,{size:26,color:RED,anchor:'middle',weight:700}));
  s+=fade(seg(p,.14,.24),chord(A,2,2.5,1.8,2.85,{color:RED,w:3})+P(A,2.5,RED,7)+label('13.5',A.X(2.5)-14,A.Y(18.75)-12,{size:26,color:RED,anchor:'end',weight:700}));
  s+=fade(seg(p,.3,.4),L(A,2,12,1.3,3.05,{color:C.v,w:5})+label('12',A.X(3.05)+8,A.Y(12+12*1.05)+8,{size:26,color:C.v,weight:700}))+P(A,2);
  s+=wrongCard('C','前後の 平均の 真ん中',[],{...WOPT,y:95,g:seg(p,.03,.1),mid:'(9+13.5)\\div2=11.25'});
  s+=fade(seg(p,b,b+.06),T('11.25\\neq12',895,290,50,{auto:false,color:RED}));
  s+=card(600,345,590,110,label('幅のある 平均を 組み合わせても',895,387,{size:26,color:C.ink,anchor:'middle'})+label('瞬間の 速さ は 求められない',895,432,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,b+sp*.55,b+sp*.65),C.hi);
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 20. 左：h が 0.50 → 0.01、直線が触れる直線に重なる。右：v̄＝12＋3h と数直線。合流して v＝dx/dt＝12 m/s。黄の一文。答えの札3枚
 [K+'summary']:(p)=>{
  const u=seg(p,.05,.5),hh=hOf(u),{A,svg}=graph({x:90,y:425,w:440,h:290});
  let s=svg+fade(.4,L(A,2,12,1.4,2.95,{color:C.v,w:2.5,dash:'8 6'}))+chord(A,2,2+hh,1.4,2.95,{color:C.v,w:3})+P(A,2)+P(A,2+hh,C.hi,7);
  s+=label(`h ＝ ${hh.toFixed(2)}`,A.X(.25),A.Y(24),{size:28,color:C.hi,weight:700});
  s+=T(`\\bar v=12+3${Hc}`,900,130,44);
  s+=hline(hh,{x0:650,x1:1150,y:225});
  const g=seg(p,.52,.62);
  s+=card(690,315,420,90,T('v=\\dfrac{dx}{dt}=12\\,\\mathrm{m/s}',900,365,42),g,C.v);
  s+=arrow(A.X(2.9),A.Y(22),680,355,{color:C.v,w:3,head:12,g})+arrow(900,270,900,307,{color:C.v,w:3,head:12,g});
  s+=fade(seg(p,.66,.76),label('幅 h を 0 に 近づけた とき、平均が 近づく 値 ＝ 瞬間の 速さ',600,500,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'C','13.5 m/s'],[2,'B','12 m/s'],[3,'A','']],{g:seg(p,.8,.9)});
  return s;
 },
};
