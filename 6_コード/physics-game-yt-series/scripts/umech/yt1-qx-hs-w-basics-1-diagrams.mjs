// 問題編 解説「ロープの写真と、印の記録」(ys-qx-hs-w-basics-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/301_波の基本.md の q-hs-w-basics-1（解説 19 行）。
// 色（正本）：場所 x・波長 λ 水色、時刻 t・周期 T 金、振動数 f 桃、速さ（山の位置）紫、印 黄、振幅 A・物差し 白。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 上段：写真（山1〜4 の頂上は x＝100,360,620,880、λ＝260 px）。下段：印の記録（0〜4.0 s を x＝200〜1080、10 往復）。
// 印（黄）は x＝295（写真では中心の線の上）。右へ進む波なので、印のずれ ＝ −A sin(2πt/T)（記録の線と一致させる）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,tAt,cueT,sentWin,note} from './yt1-qx-common.mjs';

const K='qx-hs-w-basics-1:';
const PI=Math.PI;
const LC=C.x,TC=C.t,FC=C.p,VC=C.v,MK=C.hi,ROPE='#d6deec',WH=C.ink;
const G1='振幅 A と波長 λ',G2='周期 T と振動数 f',G3='黄色い印の動き方';
const A1=g=>answerTag(1,'D','A＝6.0 cm、λ＝1.5 m',{g}),A2=g=>answerTag(2,'B','T＝0.40 s、f＝2.5 Hz',{g}),A3=g=>answerTag(3,'A','その場で上下に往復',{g});
const T2=(s,x,y,o={})=>tex(s,x,y,{size:44,...o});

// ---- 写真（上段）---------------------------------------------------------------------------------
const PH={x0:40,x1:960,y:195,A:48,lam:260,c0:100,Td:2.4};
const CRESTS=[100,360,620,880],TROUGHS=[230,490,750],XM=295;
const disp=(x,t,o)=>o.A*Math.cos(2*PI*((x-o.c0)/o.lam-t/o.Td));
function ropePath(o,t,{color=ROPE,w=5,g=1}={}){
 const pts=[];for(let x=o.x0;x<=o.x1+.1;x+=4)pts.push([x,o.y-disp(x,t,o)]);
 return fade(g,draw(pts,1,{color,w}));
}
const markDot=(x,y,r=11)=>dot(x,y,r,MK)+ring(x,y,r,{color:C.bg,w:2});
const num=(x,y,n,{g=1,color=WH,r=16,size=24}={})=>fade(g,dot(x,y,r,C.bg)+ring(x,y,r,{color,w:2.5})+label(String(n),x,y+size*.36,{size,color,anchor:'middle',weight:700}));
// 水平の両矢印の物差し
function hRuler(x1,x2,y,col,{g=1,w=3,txt='',ty=-14,size=28,ticks=1}={}){
 let s=fade(g,arrow(x1,y,x2,y,{color:col,w,head:12})+arrow(x2,y,x1,y,{color:col,w,head:12}));
 if(ticks)s+=fade(g,line(x1,y-12,x1,y+12,{color:col,w:2})+line(x2,y-12,x2,y+12,{color:col,w:2}));
 if(txt)s+=fade(g,label(txt,(x1+x2)/2,y+ty,{size,color:col,anchor:'middle',weight:700}));
 return s;
}
function vRuler(x,y1,y2,col,{g=1,w=3}={}){
 return fade(g,arrow(x,y1,x,y2,{color:col,w,head:12})+arrow(x,y2,x,y1,{color:col,w,head:12}))+fade(g,line(x-12,y1,x+12,y1,{color:col,w:2})+line(x-12,y2,x+12,y2,{color:col,w:2}));
}
// 写真の部品。nums：山の番号の濃さ（数 or 4つの配列）、r12・r45：物差し、lam：λ の物差し、gaps：①②③、hiC：中心線の強調
function photo({g=1,nums=1,r12=1,r45=1,lam=0,gaps=0,gapBlink=0,hiC=0,xlab=1,xHi=0,r12lab=1,title=1}={}){
 const o=PH;let s='';
 s+=fade(g,line(o.x0,o.y,o.x1,o.y,{color:hiC>0?MK:C.faint,w:2+2*hiC,dash:'6 8'}));
 s+=ropePath(o,0,{g});
 s+=fade(g,markDot(XM,o.y-disp(XM,0,o)));
 const nn=[].concat(nums);CRESTS.forEach((x,i)=>{const a=nn.length>1?nn[i]??0:nn[0];if(a>0)s+=num(x,o.y-10,i+1,{g:g*a});});
 if(r12>0){const yt=o.y-o.A,yb=o.y+o.A;
  s+=fade(g*r12,line(880,yt,1015,yt,{color:WH,w:2,dash:'4 6'})+line(750,yb,1015,yb,{color:WH,w:2,dash:'4 6'}));
  s+=vRuler(1000,yt,yb,WH,{g:g*r12});
  s+=fade(g*r12*r12lab,label('12 cm',1016,o.y+9,{size:26,color:WH,weight:700}));}
 if(r45>0){const y=o.y+o.A+30;
  s+=fade(g*r45,line(100,o.y-o.A,100,y+12,{color:WH,w:2,dash:'4 6'})+line(880,o.y-o.A,880,y+12,{color:WH,w:2,dash:'4 6'}));
  s+=hRuler(100,880,y,WH,{g:g*r45,txt:'4.5 m',ty:32,size:26});
  const gg=[].concat(gaps);TROUGHS.forEach((x,i)=>{const a=gg.length>1?gg[i]??0:gg[0];if(a>0)s+=num(x,y,i+1,{g:g*a*(1-.6*gapBlink),color:LC,r:17,size:24});});}
 if(lam>0){const y=o.y-o.A-20;
  s+=fade(g*lam,line(100,o.y-o.A-4,100,y-12,{color:LC,w:2})+line(360,o.y-o.A-4,360,y-12,{color:LC,w:2}));
  s+=hRuler(100,360,y,LC,{g:g*lam,ticks:0});
  s+=fade(g*lam,tex('\\lambda',230,y-22,{size:36,color:LC,auto:false}));}
 if(xlab){if(xHi>0)s+=fade(g*xHi,rect(1050,282,138,38,{fill:LC,fo:.18,stroke:LC,sw:2.5,rx:10}));
  s+=fade(g*xlab,label('場所 x →',1180,310,{size:26,color:LC,anchor:'end',weight:700}));}
 if(title)s+=fade(g*title,label('ある瞬間の 写真',1190,108,{size:24,color:C.dim,anchor:'end',weight:700}));
 return s;
}
// ---- 記録（下段）--------------------------------------------------------------------------------
const RC={x0:200,pxs:220,y:405,A:36,T:.4,tmax:4};
const recX=t=>RC.x0+RC.pxs*t, recY=t=>RC.y+RC.A*Math.sin(2*PI*t/RC.T);   // 画面の上が＋なので y＝y0−(−A sin)
const PEAKS=Array.from({length:10},(_,i)=>.3+.4*i);
function record({g=1,u=1,nums=0,Tr=0,band=0,tHi=0,title=1}={}){
 let s='';
 s+=fade(g,line(RC.x0-10,RC.y,recX(4)+20,RC.y,{color:C.dim,w:2.5})+line(RC.x0,RC.y-RC.A-18,RC.x0,RC.y+RC.A+18,{color:C.dim,w:2.5}));
 s+=fade(g,line(recX(4),RC.y-8,recX(4),RC.y+8,{color:C.dim,w:2.5})+label('0',RC.x0,RC.y+RC.A+34,{size:22,color:C.dim,anchor:'middle'})+label('4.0 s',recX(4),RC.y+RC.A+34,{size:24,color:TC,anchor:'middle',weight:700}));
 if(tHi>0)s+=fade(g*tHi,rect(recX(4)+24,RC.y-24,104,38,{fill:TC,fo:.18,stroke:TC,sw:2.5,rx:10}));
 s+=fade(g,label('時刻 t',recX(4)+30,RC.y+5,{size:26,color:TC,weight:700}));
 if(title)s+=fade(g*title,label('黄色い印の',40,RC.y-8,{size:24,color:MK,weight:700})+label('記録',40,RC.y+24,{size:24,color:MK,weight:700}));
 if(band>0){s+=fade(g*band,rect(recX(0),RC.y-RC.A-24,recX(1)-recX(0),2*RC.A+48,{fill:MK,fo:.13,stroke:MK,sw:2,rx:6})+line(recX(1),RC.y-8,recX(1),RC.y+8,{color:C.dim,w:2.5})+label('1.0 s',recX(1),RC.y+RC.A+34,{size:22,color:TC,anchor:'middle'}));}
 const tt=RC.tmax*clamp(u);
 if(tt>0){const pts=[];const n=Math.max(2,Math.round(400*u));for(let i=0;i<=n;i++){const t=tt*i/n;pts.push([recX(t),recY(t)]);}s+=fade(g,draw(pts,1,{color:MK,w:4}));}
 const nn=Array.isArray(nums)?nums:PEAKS.map(()=>nums);
 PEAKS.forEach((t,i)=>{const a=nn[i]??0;if(a>0)s+=fade(g*a,label(String(i+1),recX(t),RC.y-RC.A-12,{size:22,color:WH,anchor:'middle',weight:700}));});
 if(Tr>0){const y=RC.y+RC.A+14;s+=fade(g*Tr,line(recX(.3),RC.y-RC.A,recX(.3),y+10,{color:TC,w:2,dash:'4 5'})+line(recX(.7),RC.y-RC.A,recX(.7),y+10,{color:TC,w:2,dash:'4 5'}));
  s+=hRuler(recX(.3),recX(.7),y,TC,{g:g*Tr,ticks:0})+fade(g*Tr,label('T',recX(.5),y+34,{size:30,color:TC,anchor:'middle',weight:700}));}
 return s;
}
// 全体（上段＋下段）
const full=(po={},ro={})=>photo(po)+record(ro);

// ---- 小問3：写真を大きく、ロープを動かす ---------------------------------------------------------------
const BIG={x0:40,x1:1140,y:225,A:65,lam:260,c0:100,Td:2.4};
const lerpO=e=>({x0:40,x1:mix(PH.x1,BIG.x1,e),y:mix(PH.y,BIG.y,e),A:mix(PH.A,BIG.A,e),lam:260,c0:100,Td:2.4});
function bigRope(t,{e=1,g=1,mark=1,ringG=0,track=0,trackHi=0,crest=0,crestHi=0,trace=0}={}){
 const o=lerpO(e);let s='';
 s+=fade(g,line(o.x0,o.y,o.x1,o.y,{color:C.faint,w:2,dash:'6 8'}));
 if(track>0)s+=fade(g*track,line(XM,o.y-o.A-28,XM,o.y+o.A+40,{color:trackHi>0?MK:C.dim,w:2+2*trackHi,dash:'5 6'}));
 if(trace>0)s+=fade(g*trace*.8,line(XM,o.y-o.A,XM,o.y+o.A,{color:MK,w:5}));
 s+=ropePath(o,t,{g});
 const ym=o.y-disp(XM,t,o);
 if(mark)s+=fade(g*mark,markDot(XM,ym,12));
 if(ringG>0)s+=fade(g*ringG,ring(XM,ym,24,{color:MK,w:3.5}));
 if(crest>0){const L=4*o.lam,d=((o.lam*t/o.Td)%L+L)%L,x=o.c0+d,edge=clamp(d/40)*clamp((L-d)/40);
  const y=o.y-o.A-14,col=VC;
  s+=fade(g*crest*edge,poly([[x-15,y-26],[x+15,y-26],[x,y-3]],{fill:col,fo:1})+(crestHi>0?ring(x,y-15,24,{color:VC,w:2+2*crestHi}):''));}
 return s;
}
const slowNote=(g=1)=>note('（動きは ゆっくり 描いています）',600,505,{g});

// ---- まとめ：小さい海の絵 ------------------------------------------------------------------------
function miniSea(t,{x=780,y=96,w=410,h=370,g=1}={}){
 let s=card(x,y,w,h,'',1,C.faint);
 s+=label('単元動画の 海の ボール',x+w/2,y+42,{size:22,color:C.dim,anchor:'middle',weight:700});
 const yc=y+200,A=14,lam=150,Td=2.2,f=X=>yc-A*Math.cos(2*PI*((X-x)/lam-t/Td));
 const pts=[];for(let X=x+14;X<=x+w-14;X+=4)pts.push([X,f(X)]);
 s+=poly([...pts,[x+w-14,y+h-70],[x+14,y+h-70]],{fill:'#4a90d9',fo:.28})+draw(pts,1,{color:'#7fb6ff',w:4});
 const bx=x+w/2,by=f(bx)-18;
 s+=line(bx,yc-60,bx,yc+30,{color:MK,w:2,dash:'5 6'})+dot(bx,by,18,'#ff9a7a')+ring(bx,by,18,{color:C.bg,w:2});
 s+=label('ボールは 上下に 揺れるだけ',x+w/2,y+h-28,{size:22,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}

// ---- 札と式のカード ------------------------------------------------------------------------------
const eqCard=(src,g=1,col=WH,{y=350,w=640,h=100,size=44}={})=>card(600-w/2,y,w,h,T2(src,600,y+h/2+4,{size}),g,col);

export const qxHsWBasics1Diagrams={
 // ================= 問題アニメ：出題（小問1・2、約6秒＋静止）=================
 // シャッターのように白い枠が一度光り、写真が現れる → 山の番号 1〜4（0.3 s おき）→ 12 cm・4.5 m の物差し → 下段の記録を左から描く（10 往復）。
 // 印は写真の中の1点として止めて描く（動かさない）。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx);
  const flash=seg(t,0,.12)*(1-seg(t,.3,.6)),ph=seg(t,.15,.5);
  let s=fade(flash,rect(20,92,1170,250,{fill:WH,fo:.22,stroke:WH,sw:5,rx:10}));
  s+=photo({g:ph,nums:[0,1,2,3].map(i=>seg(t,1+.3*i,1.2+.3*i)),r12:seg(t,2.2,2.5),r45:seg(t,2.6,2.9),title:ph});
  s+=record({g:seg(t,3,3.3),u:lin(t,3.3,5.7)});
  return s;
 },
 // ================= 問題アニメ：小問3（約3秒＋静止）=================
 // 同じ静止画のまま、黄色い印に黄色の小さな輪を2回点滅させる。印は動かさない。
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx),bl=seg(t,.3,.45)*(1-seg(t,.9,1.05))+seg(t,1.4,1.55)*(1-seg(t,2,2.15))+seg(t,2.5,2.65);
  let s=full();
  s+=fade(bl,ring(XM,PH.y-disp(XM,0,PH),24,{color:MK,w:3.5}));
  return s;
 },
 // ================= S1 小問1 =================
 // 1. 出題中の静止画。「写真」で場所 x、「記録」で時刻 t を光らせる
 [K+'setup']:(p)=>full({xHi:seg(p,.08,.16)*(1-seg(p,.3,.38))},{tHi:seg(p,.3,.38)*(1-seg(p,.55,.63))}),
 // 2. 求めるもの。記録を暗く、中心線を黄色、中心線から山1の頂上へ白い矢印
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=photo({nums:1-seg(p,b,b+.06),hiC:seg(p,b+.05,b+.15)})+record({g:1-.8*seg(p,.05,.2)});
  s+=arrow(100,PH.y,100,PH.y-PH.A+3,{color:WH,w:5,head:14,g:seg(p,b+.25,b+.4)});
  s+=fade(seg(p,b+.3,b+.4),label('振幅',114,PH.y-16,{size:24,color:WH,weight:700}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 12 cm の物差しを中心線で半分に折る → A＝6.0 cm。式は2文目で
 [K+'amp']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const fold=seg(p,.22,.38)*(1-seg(p,.44,.56)),halves=seg(p,.5,.6);
  let s=photo({nums:0,hiC:1-seg(p,0,.1),r12lab:1-seg(p,.4,.48)})+record({g:.2});
  s+=arrow(100,PH.y,100,PH.y-PH.A+3,{color:WH,w:5,head:14,g:1-seg(p,0,.08)});
  // 折る：下半分が中心の点のまわりに回って上半分に重なる
  const a=PI*fold,ex=1000+14+PH.A*Math.sin(a),ey=PH.y+PH.A*Math.cos(a);
  if(seg(p,.18,.22)>0)s+=fade(seg(p,.18,.22)*(1-halves),line(1014,PH.y,ex,ey,{color:MK,w:6}));
  s+=fade(halves,line(1000,PH.y-PH.A,1000,PH.y,{color:WH,w:7})+line(988,PH.y-PH.A/2,1012,PH.y-PH.A/2,{color:WH,w:3})+line(988,PH.y+PH.A/2,1012,PH.y+PH.A/2,{color:WH,w:3}));
  s+=fade(halves,label('A＝6.0 cm',1016,PH.y-16,{size:26,color:WH,weight:700})+label('6.0 cm',1016,PH.y+34,{size:24,color:C.dim,weight:700}));
  s+=eqCard('A=12\\div 2=6.0\\ \\mathrm{cm}',seg(p,b+.02,b+.12));
  s+=goalTag(G1);
  return s;
 },
 // 4. 山1と山2の頂上の間に水色の物差し λ
 [K+'lam']:(p)=>{
  let s=photo({nums:seg(p,.05,.2),lam:seg(p,.15,.35),r12lab:seg(p,.1,.18)})+record({g:.2});
  s+=fade(1-seg(p,0,.08),label('A＝6.0 cm',1016,PH.y-16,{size:26,color:WH,weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 5. 4.5 m の物差しに ①②③（「3つ」で三つ同時に光らせる）→ λ＝4.5÷3＝1.5 m
 [K+'lam2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  const gaps=[seg(p,.1,.16),seg(p,.2,.26),seg(p,.3,.36)],flash=seg(p,b-.12,b-.06)*(1-seg(p,b-.02,b+.04));
  let s=photo({lam:1,gaps})+record({g:.2});
  if(flash>0)TROUGHS.forEach(x=>{s+=fade(flash,ring(x,PH.y+PH.A+30,24,{color:MK,w:4}));});
  s+=eqCard('\\lambda=4.5\\div 3=1.5\\ \\mathrm{m}',seg(p,b+.02,b+.12),LC);
  s+=goalTag(G1);
  return s;
 },
 // 6. 小問1 の答え D。誤答 A
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=photo({lam:1,gaps:1})+record({g:.15});
  s+=goalTag(G1)+A1(seg(p,.05,.15));
  s+=wrongCard('A','A＝12 cm','山から谷までの 高さを、振幅と した',{g:seg(p,b+.01,b+.06)});
  return s;
 },
 // 7. 誤答 B・C（1枚ずつ）。①②③ をもう一度点滅
 [K+'wrongBC']:(p,ctx)=>{
  const bl=.5+.5*Math.cos(cueT(ctx)*6);
  let s=photo({lam:1,gaps:1,gapBlink:bl*seg(p,.05,.1)})+record({g:.15});
  s+=goalTag(G1)+A1(1);
  const W=sentWin(ctx),ve=W[W.length-1][1];
  s+=wrongSeq(p,ctx,[['B','λ＝1.1 m','山の数 4 で 割った（間の 数は 3）'],['C','λ＝4.5 m','4つ分の 山を、まとめて 1波長と した']],{win:[[0,ve*.5],[ve*.5,1]]});
  return s;
 },
 // ================= S2 小問2 =================
 // 8. 求めるもの。写真を暗く、記録を明るく
 [K+'goal2']:(p)=>{
  let s=photo({g:1-.75*seg(p,.1,.3)})+record({g:.15+.85*seg(p,.1,.3)});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9a. 周期＝1か所の揺れが1往復する時間。山と次の山の間に金の T
 [K+'period0']:(p)=>{
  let s=photo({g:.25})+record({Tr:seg(p,.3,.45)});
  s+=goalTag(G2);
  return s;
 },
 // 9b. 10個の山に 1〜10 を順に → T＝4.0÷10＝0.40 s
 [K+'period']:(p)=>{
  const nums=PEAKS.map((_,i)=>seg(p,.04+.04*i,.07+.04*i));
  let s=photo({g:.25})+record({nums,Tr:1});
  s+=card(250,140,700,96,T2(`{\\color{${TC}}T}=4.0\\div 10=0.40\\ \\mathrm{s}`,600,192),seg(p,.5,.58),TC);
  s+=goalTag(G2);
  return s;
 },
 // 10. 0〜1.0 s を黄色の帯で囲み、その中の山を数える → f＝1/T＝1÷0.40＝2.5 Hz
 [K+'freq']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=photo({g:.25})+record({nums:1,Tr:1-seg(p,0,.08),band:seg(p,.05,.15)});
  s+=fade(seg(p,.2,.3),label('1秒に 2.5 往復',recX(.5),505,{size:24,color:FC,anchor:'middle',weight:700}));
  [.3,.7].forEach((t,i)=>{s+=fade(seg(p,.22+.06*i,.26+.06*i),ring(recX(t),recY(t),14,{color:FC,w:3}));});
  s+=fade(seg(p,.34,.4),ring(recX(.95),RC.y,14,{color:FC,w:3}));
  s+=card(200,140,800,110,T2(`{\\color{${FC}}f}=\\dfrac{1}{{\\color{${TC}}T}}=1\\div 0.40=2.5\\ \\mathrm{Hz}`,600,198),seg(p,b+.02,b+.12),FC);
  s+=goalTag(G2);
  return s;
 },
 // 11. 小問2 の答え B。二つの計算を並べ、後者に「＝ f」。誤答 A
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=photo({g:.2})+record({nums:1,g:1-.75*seg(p,b+.06,b+.12)});
  const c=seg(p,b+.01,b+.08);
  s+=card(200,96,800,140,'',c,C.faint);
  s+=fade(c,label('4.0 ÷ 10 ＝ 0.40 s',420,150,{size:30,color:TC,anchor:'middle',weight:700})+label('＝ T',420,206,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=fade(c,label('10 ÷ 4.0 ＝ 2.5',780,150,{size:30,color:FC,anchor:'middle',weight:700})+label('＝ f（1秒あたりの 回数）',780,206,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(seg(p,.05,.15));
  s+=wrongCard('A','T＝2.5 s','1秒あたりの 回数を、周期と した',{g:seg(p,b+.1,b+.16)});
  return s;
 },
 // 12. 誤答 C・D（1枚ずつ）
 [K+'wrongCD']:(p,ctx)=>{
  let s=photo({g:.2})+record({nums:1,g:.25});
  s+=goalTag(G2)+A2(1);
  const W=sentWin(ctx),ve=W[W.length-1][1];
  s+=wrongSeq(p,ctx,[['C','T＝0.20 s','1往復を 2回と 数えた'],['D','T＝4.0 s','記録した 時間 全体を 周期と した']],{win:[[0,ve*.5],[ve*.5,1]]});
  return s;
 },
 // 13. 写真の λ と記録の T を同時に。横軸「場所 x」「時刻 t」を光らせる
 [K+'compare']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,hi=seg(p,b,b+.08)*(.6+.4*Math.cos(cueT(ctx)*5));
  let s=photo({g:1,lam:seg(p,.05,.15),xHi:hi,nums:0,r12:.4,r45:.4})+record({Tr:seg(p,.2,.3),tHi:hi});
  s+=goalTag(G2);
  return s;
 },
 // ================= S3 小問3 =================
 // 14. 求めるもの。記録を消し、写真を広げる。黄色い印に黄色の輪
 [K+'goal3']:(p)=>{
  const e=seg(p,.15,.45);
  let s=record({g:1-seg(p,.05,.2)});
  s+=fade(1-seg(p,.05,.15),photo({nums:0,r12:1,r45:1,xlab:1,title:1}));
  s+=fade(seg(p,.1,.15),bigRope(0,{e,ringG:seg(p,.5,.6)}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. ここで初めてロープを動かす。山1に紫の三角。印は上下だけ（黄色の縦の軌跡）。印の真下に縦の点線
 [K+'move']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,t=Math.max(0,tAt(ctx,K+'move')-1.0);
  let s=bigRope(t,{ringG:1-seg(p,.05,.15),crest:seg(p,.04,.12),track:seg(p,b,b+.1),trace:seg(p,b+.15,b+.3)});
  s+=slowNote(seg(p,.1,.2));
  s+=goalTag(G3);
  return s;
 },
 // 16. 小問3 の答え A。「山の位置」で紫の三角を光らせ、右向きの紫の矢印
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,t=tAt(ctx,K+'move')-1.0;
  let s=bigRope(t,{crest:1,crestHi:seg(p,b+.15,b+.25),track:1,trace:1});
  s+=arrow(520,120,860,120,{color:VC,w:6,head:18,g:seg(p,b+.25,b+.4)});
  s+=fade(seg(p,b+.3,b+.4),label('進むのは 山の 位置（振動の 模様）',690,108-6,{size:24,color:VC,anchor:'middle',weight:700}));
  s+=slowNote();
  s+=goalTag(G3)+A3(seg(p,.05,.15));
  return s;
 },
 // 17. 誤答 B・C（1枚ずつ）。印の真下の縦の点線を光らせる
 [K+'wrongBC3']:(p,ctx)=>{
  const t=tAt(ctx,K+'move')-1.0,W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=bigRope(t,{crest:1,track:1,trackHi:seg(p,b,b+.08),trace:1});
  s+=fade(seg(p,b,b+.08),label('印は 左右に ずれない',XM+24,BIG.y+BIG.A+34,{size:24,color:MK,weight:700}));
  s+=goalTag(G3)+A3(1);
  s+=wrongSeq(p,ctx,[['B','山と 一緒に 右へ 進む','媒質も 波と 一緒に 進むと 考えた'],['C','少しずつ 右へ 進む','ロープに 正味の 流れが あると 考えた']],{win:[[0,b*.5],[b*.5,1]]});
  return s;
 },
 // 18. 誤答 D。印の位置に、上下の黄色の両矢印（○）と、左右の灰色の両矢印（×）
 [K+'wrongD']:(p,ctx)=>{
  const t=tAt(ctx,K+'move')-1.0,W=sentWin(ctx),b=W[1]?W[1][0]:.5,o=seg(p,b,b+.1);
  let s=bigRope(t,{crest:1,track:1,trace:1});
  const ax=XM-90;
  s+=arrow(ax,BIG.y,ax,BIG.y-BIG.A,{color:MK,w:5,head:14,g:o})+arrow(ax,BIG.y,ax,BIG.y+BIG.A,{color:MK,w:5,head:14,g:o});
  s+=fade(o,label('○',ax-40,BIG.y+12,{size:38,color:C.F,anchor:'middle',weight:700}));
  const hy=BIG.y+BIG.A+42;
  s+=arrow(XM,hy,XM-70,hy,{color:C.dim,w:5,head:14,g:o})+arrow(XM,hy,XM+70,hy,{color:C.dim,w:5,head:14,g:o});
  s+=fade(o,label('×',XM+100,hy+10,{size:32,color:'#ff6b6b',anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(1);
  s+=wrongCard('D','右へ 押され、左へ 戻る','横波の 揺れる 向きを 取り違えた',{y:360,g:seg(p,.02,.08)});
  return s;
 },
 // ================= S4 まとめ =================
 // 19. 写真に A・λ、記録に T・f、上下に往復するだけの印。隅に単元動画の海のボール
 [K+'sum']:(p,ctx)=>{
  const t=cueT(ctx),o={x0:40,x1:740,y:170,A:45,lam:260,c0:100,Td:2.4},a=seg(p,.03,.15),b2=seg(p,.2,.32);
  let s=fade(a,line(o.x0,o.y,o.x1,o.y,{color:C.faint,w:2,dash:'6 8'})+line(XM,o.y-o.A-14,XM,o.y+o.A+14,{color:MK,w:2,dash:'5 6'}))+ropePath(o,t,{g:a});
  s+=fade(a,markDot(XM,o.y-disp(XM,t,o),11));
  s+=fade(a,label('A＝6.0 cm',200,264,{size:28,color:WH,weight:700})+label('λ＝1.5 m',430,264,{size:28,color:LC,weight:700}));
  const rx=t2=>200+135*t2,ry=t2=>370+30*Math.sin(2*PI*t2/.4);
  const pts=[];for(let i=0;i<=400;i++){const u=4*i/400;pts.push([rx(u),ry(u)]);}
  s+=fade(b2,line(190,370,rx(4)+16,370,{color:C.dim,w:2.5})+line(200,330,200,410,{color:C.dim,w:2.5})+draw(pts,1,{color:MK,w:3.5})+label('印の 記録',40,378,{size:24,color:MK,weight:700})+label('時刻 t',rx(4)+16,432,{size:24,color:TC,anchor:'end',weight:700}));
  s+=fade(b2,label('T＝0.40 s',200,460,{size:28,color:TC,weight:700})+label('f＝2.5 Hz',430,460,{size:28,color:FC,weight:700}));
  s+=miniSea(t,{g:seg(p,.4,.52)});
  s+=answerRow([[1,'D',''],[2,'B',''],[3,'A','']],{g:seg(p,.03,.15)});
  return s;
 },
};
