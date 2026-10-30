// 問題編 解説「振動数を2倍にしたロープ」(ys-qx-hs-w-basics-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/301_波の基本.md の q-hs-w-basics-2（解説 20 行）。
// 色（正本）：場所 x・波長 λ 水色、時刻 t・周期 T 金、振動数 f 桃、速さ v 紫（山の目印も紫）、印・強調 黄、振幅・目盛り 白。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// ロープ：左端 x0＝150 を手で振る。4.0 Hz の図は λ＝300 px（100 px/m）。波は右へ進む。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,tAt,cueT,durOf,sentWin,voiceEnd,note,pauseBadge} from './yt1-qx-common.mjs';

const K='qx-hs-w-basics-2:';
const PI=Math.PI;
const LC=C.x,TC=C.t,FC=C.p,VC=C.v,HI=C.hi,ROPE='#d6deec',WH=C.ink,BAD='#ff6b6b',OK=C.F;
const G1='波長 λ',G2='8.0 Hz のときの v と λ',G3='t＝0.050 s の山の位置';
const A1=g=>answerTag(1,'C','3.0 m',{g}),A2=g=>answerTag(2,'A','12 m/s、1.5 m',{g}),A3=g=>answerTag(3,'D','x＝1.35 m',{g});
const T2=(s,x,y,o={})=>tex(s,x,y,{size:44,...o});
const vt=`{\\color{${VC}}v}`,ft=`{\\color{${FC}}f}`,Lt=`{\\color{${LC}}\\lambda}`,Tt=`{\\color{${TC}}T}`,xt=`{\\color{${LC}}x}`,tt=`{\\color{${TC}}t}`;

// ---- 手とロープ -----------------------------------------------------------------------------------
function hand(x0,y,{g=1}={}){return fade(g,rect(x0-50,y-24,44,48,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:14})+rect(x0-10,y-8,14,16,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:4}));}
// 先頭のある波（時刻 0 に手が中心から上へ振り始める）。o＝{x0,x1,y,A,lam,T}、v＝lam/T（px/s）
const wv=o=>o.lam/o.T;
function fdisp(x,t,o){const d=x-o.x0;if(t<=0||d>wv(o)*t)return 0;return o.A*Math.sin(2*PI*(t/o.T-d/o.lam));}
function frontRope(t,o,{g=1,w=5}={}){
 const pts=[];for(let x=o.x0;x<=o.x1+.1;x+=3)pts.push([x,o.y-fdisp(x,t,o)]);
 return fade(g,line(o.x0,o.y,o.x1,o.y,{color:C.faint,w:2,dash:'6 8'})+draw(pts,1,{color:ROPE,w}))+hand(o.x0,o.y-(t>0?o.A*Math.sin(2*PI*t/o.T):0),{g});
}
const frontX=(t,o)=>Math.min(o.x1,o.x0+wv(o)*Math.max(0,t));
// 先頭のある波の山の位置（左から）
function fcrests(t,o){const out=[];for(let k=0;k<200;k++){const d=o.lam*(t/o.T-.25-k);if(d<0)break;if(d<=Math.min(wv(o)*t,o.x1-o.x0))out.push(o.x0+d);}return out.sort((a,b)=>a-b);}
const tri=(x,y,col=VC,g=1)=>fade(g,poly([[x-14,y-24],[x+14,y-24],[x,y-2]],{fill:col,fo:1}));
function hRuler(x1,x2,y,col,{g=1,w=3,txt='',ty=-14,size=28,ticks=1}={}){
 let s=fade(g,arrow(x1,y,x2,y,{color:col,w,head:12})+arrow(x2,y,x1,y,{color:col,w,head:12}));
 if(ticks)s+=fade(g,line(x1,y-12,x1,y+12,{color:col,w:2})+line(x2,y-12,x2,y+12,{color:col,w:2}));
 if(txt)s+=fade(g,label(txt,(x1+x2)/2,y+ty,{size,color:col,anchor:'middle',weight:700}));
 return s;
}
const RO={x0:150,x1:1100,y:280,A:55,lam:300,T:1.2};
// 解説動画（PQ-036 の修正後）は「波の速さ v＝12 m/s」。問題アニメは「v＝12 m/s」のまま。
const vLab=(g=1,long=0)=>long?fade(g,label('波の速さ v＝12 m/s',60,124,{size:30,color:VC,weight:700})+arrow(355,114,435,114,{color:VC,w:4,head:12}))
 :fade(g,label('v＝12 m/s',60,124,{size:30,color:VC,weight:700})+arrow(245,114,325,114,{color:VC,w:4,head:12}));
const fLab=(txt,g=1,glow=0)=>fade(g,(glow>0?fade(glow,rect(40,372,150,46,{fill:FC,fo:.18,stroke:FC,sw:3,rx:12})):'')+label(txt,115,405,{size:30,color:FC,anchor:'middle',weight:700}));
// 出題の図（小問1）：時刻 t のロープ。目印は、t＝6.3 s に x＝750 にある山（k＝3）
function setupPic(t,{g=1,mk=1,long=0}={}){
 let s=frontRope(t,RO,{g});
 const d=wv(RO)*(t-.3)-900,x=RO.x0+d;
 if(d>=0&&x<=RO.x1)s+=tri(x,RO.y-RO.A-12,VC,g*mk*clamp((RO.x1-40-x)/60));
 s+=vLab(g,long)+fLab('f＝4.0 Hz',g);
 return s;
}
// ---- 1周期のコマ送り（波は先頭なし、山が手の所にある時刻を 0）-----------------------------------
const FR={x0:150,x1:1100,y:300,A:55,lam:300};
function frameRope(u,{g=1,mk=1,lam=0}={}){
 const o=FR,pts=[];for(let x=o.x0;x<=o.x1+.1;x+=3)pts.push([x,o.y-o.A*Math.cos(2*PI*(u-(x-o.x0)/o.lam))]);
 let s=fade(g,line(o.x0,o.y,o.x1,o.y,{color:C.faint,w:2,dash:'6 8'})+draw(pts,1,{color:ROPE,w:5}))+hand(o.x0,o.y-o.A*Math.cos(2*PI*u),{g});
 s+=tri(o.x0+o.lam*u,o.y-o.A-12,VC,g*mk);
 if(lam>0){const y=o.y-o.A-50;s+=fade(g*lam,line(o.x0,o.y-o.A-6,o.x0,y-12,{color:LC,w:2,dash:'4 5'})+line(o.x0+o.lam,o.y-o.A-36,o.x0+o.lam,y-12,{color:LC,w:2,dash:'4 5'}));
  s+=hRuler(o.x0,o.x0+o.lam,y,LC,{g:g*lam,ticks:0})+fade(g*lam,tex('\\lambda',o.x0+o.lam/2,y-22,{size:36,color:LC,auto:false}));}
 return s;
}
const timer=(txt,g=1)=>card(930,90,250,62,label(txt,1055,132,{size:28,color:TC,anchor:'middle',weight:700}),g,TC);
// ---- 1秒の早回し（12 m を 900 px、λ＝3 m）----------------------------------------------------------
const SEC={x0:150,y:280,A:45,pm:75};
function secRope(tau,{g=1,mk=1,arrow12=0,band=0,count=0,ruler=0,lab1=1}={}){
 const o=SEC,ts=tau+.0625,X=m=>o.x0+o.pm*m;let s='';
 const disp=m=>(ts<=0||m>12*ts)?0:o.A*Math.sin(2*PI*(ts/.25-m/3));
 const pts=[];for(let m=0;m<=13.0001;m+=.04)pts.push([X(m),o.y-disp(m)]);
 s+=fade(g,line(X(0),o.y,X(13),o.y,{color:C.faint,w:2,dash:'6 8'})+draw(pts,1,{color:ROPE,w:5}));
 s+=hand(o.x0,o.y-(ts>0?o.A*Math.sin(2*PI*ts/.25):0),{g});
 if(tau>=0)s+=tri(X(12*tau),o.y-o.A-12,VC,g*mk);
 if(arrow12>0){s+=fade(g*arrow12,arrow(X(0),o.y-o.A-56,X(12),o.y-o.A-56,{color:VC,w:5,head:16})+line(X(0),o.y-o.A-70,X(0),o.y-o.A-42,{color:VC,w:2}));
  s+=fade(g*arrow12,label('12 m',X(6),o.y-o.A-70,{size:30,color:VC,anchor:'middle',weight:700}));}
 if(band>0){const y=o.y+o.A+34;s+=fade(g*band,line(X(0),y-14,X(0),y+14,{color:WH,w:2})+line(X(12),y-14,X(12),y+14,{color:WH,w:2})+line(X(0),y,X(12),y,{color:WH,w:2}));
  [3,6,9].forEach((m,i)=>{s+=fade(g*clamp(band*3-i),line(X(m),y-12,X(m),y+12,{color:WH,w:2}));});}
 if(count>0)[3,6,9,12].forEach((m,i)=>{const a=clamp(count*4-(3-i));if(a>0)s+=fade(g*a,dot(X(m),o.y-o.A+24,16,C.bg)+ring(X(m),o.y-o.A+24,16,{color:WH,w:2.5})+label(String(i+1),X(m),o.y-o.A+33,{size:24,color:WH,anchor:'middle',weight:700}));});
 if(ruler>0)s+=hRuler(X(0),X(3),o.y+o.A+72,LC,{g:g*ruler,txt:'3.0 m',ty:36,size:28});
 if(lab1)s+=fade(g*lab1,label('（1秒を 早回し）',1180,500,{size:22,color:C.dim,anchor:'end'}));
 return s;
}
// ---- 小問2：2本のロープ -----------------------------------------------------------------------------
const R4={x0:150,x1:1100,y:190,A:36,lam:300,T:1.2},R8={x0:150,x1:1100,y:360,A:36,lam:150,T:.6};
function twoRopes(t,{g=1,front=1,rulers=0,bracket=0}={}){
 let s='';
 for(const [o,txt] of [[R4,'4.0 Hz'],[R8,'8.0 Hz']]){
  s+=frontRope(t,o,{g});
  s+=fade(g,label(txt,o.x0-20,o.y-o.A-34,{size:28,color:FC,anchor:'middle',weight:700}));
  const fx=frontX(t,o);
  if(t>0)s+=tri(fx,o.y-12,VC,g*front)+fade(g*front,label('12 m/s',Math.min(fx,1120),o.y-46,{size:26,color:VC,anchor:'middle',weight:700}));
 }
 if(rulers>0){
  const c4=fcrests(t,R4).filter(x=>x>=R4.x0+60),a=c4[0]??300;
  const c8=fcrests(t,R8).filter(x=>x>=a-1),b=c8[0]??a;
  s+=fade(g*rulers,line(a,R4.y-R4.A,a,R4.y+R4.A+30,{color:LC,w:2,dash:'4 5'})+line(a+300,R4.y-R4.A,a+300,R4.y+R4.A+30,{color:LC,w:2,dash:'4 5'}));
  s+=hRuler(a,a+300,R4.y+R4.A+22,LC,{g:g*rulers,txt:'3.0 m',ty:30,size:26,ticks:0});
  s+=fade(g*rulers,line(b,R8.y-R8.A,b,R8.y+R8.A+28,{color:LC,w:2,dash:'4 5'})+line(b+150,R8.y-R8.A,b+150,R8.y+R8.A+28,{color:LC,w:2,dash:'4 5'})+line(b+300,R8.y-R8.A,b+300,R8.y+R8.A+28,{color:LC,w:2,dash:'4 5'}));
  s+=hRuler(b,b+150,R8.y+R8.A+20,LC,{g:g*rulers,txt:'1.5 m',ty:30,size:26,ticks:0})+hRuler(b+150,b+300,R8.y+R8.A+20,LC,{g:g*rulers*bracket,txt:'1.5 m',ty:30,size:26,ticks:0});
  if(bracket>0)s+=fade(g*bracket,line(b,R8.y+R8.A+72,b+300,R8.y+R8.A+72,{color:LC,w:2.5,dash:'6 6'})+line(b,R8.y+R8.A+60,b,R8.y+R8.A+84,{color:LC,w:2})+line(b+300,R8.y+R8.A+60,b+300,R8.y+R8.A+84,{color:LC,w:2})+label('上の 3.0 m の 半分が 2つ',b+320,R8.y+R8.A+80,{size:24,color:LC,weight:700}));
 }
 return s;
}
// ---- 小問3：式と写真 -----------------------------------------------------------------------------
const FORM=(inner=null)=>`y=0.10\\sin 2\\pi\\left(${inner??`\\dfrac{${xt}}{3.0}-\\dfrac{${tt}}{0.25}`}\\right)`;
const INNER=`\\dfrac{${xt}}{3.0}-\\dfrac{${tt}}{0.25}`;
const FORM_BOX=`y=0.10\\sin 2\\pi\\left({\\color{${HI}}\\boxed{${INNER}}}\\right)`;
const PX=m=>150+300*m;
// 時刻 t の写真。cy＝中心線、A＝振幅 px
function photoQ(t,cy,{A=36,g=1,ticks=1,yl=1,ylab=1,tlab=1,ghost=0}={}){
 let s='';
 s+=fade(g,arrow(PX(0)-10,cy,PX(3)+40,cy,{color:C.dim,w:2.5,head:12})+label('x',PX(3)+56,cy+8,{size:26,color:LC,weight:700}));
 if(ticks)s+=fade(g,[0,1,2,3].map(m=>line(PX(m),cy-6,PX(m),cy+6,{color:C.dim,w:2})+label(m===0?'0':`${m}.0`,PX(m),cy+A+28,{size:22,color:C.dim,anchor:'middle'})).join('')+label('m',PX(3)+56,cy+A+28,{size:22,color:C.dim}));
 const pts=[];for(let m=0;m<=3.0001;m+=.01)pts.push([PX(m),cy-A*Math.sin(2*PI*(m/3-t/.25))]);
 s+=fade(g,draw(pts,1,{color:ROPE,w:4}));
 if(tlab)s+=fade(g*tlab,label(t===0?'t＝0':'t＝0.050 s',60,cy-A-6,{size:24,color:TC,weight:700}));
 const xc=3*(.25+t/.25)%3;
 if(ghost>0)s+=fade(g*ghost,line(PX(.75),cy-A-14,PX(.75),cy+A+4,{color:HI,w:2,dash:'5 6'}));
 if(yl>0){s+=fade(g*yl,line(PX(xc),cy-A-14,PX(xc),cy+A+4,{color:HI,w:4}));
  if(ylab)s+=fade(g*yl*ylab,label(`${xc.toFixed(2)} m`,PX(xc)+10,cy-A-10,{size:24,color:HI,weight:700}));}
 return s;
}
const P1=310,P2=440;
// 小さい sin のグラフ（頂上 π/2 に黄色の点）
function sinGraph({g=1,dotG=1}={}){
 const x0=120,w=420,y0=360,A=70,X=th=>x0+w*th/(2*PI);
 let s=fade(g,arrow(x0-10,y0,x0+w+30,y0,{color:C.dim,w:2.5,head:12})+line(x0,y0-A-20,x0,y0+A+20,{color:C.dim,w:2.5}));
 const pts=[];for(let i=0;i<=200;i++){const th=2*PI*i/200;pts.push([X(th),y0-A*Math.sin(th)]);}
 s+=fade(g,draw(pts,1,{color:ROPE,w:4})+label('sin',x0+16,y0-A-26,{size:24,color:C.dim})+line(X(PI/2),y0-6,X(PI/2),y0+6,{color:C.dim,w:2}));
 s+=fade(g,tex('\\dfrac{\\pi}{2}',X(PI/2),y0+40,{size:30,auto:false}));
 s+=fade(g*dotG,line(X(PI/2),y0-A,X(PI/2),y0,{color:HI,w:2,dash:'4 5'})+dot(X(PI/2),y0-A,11,HI)+label('頂上（山）',X(PI/2)+20,y0-A-14,{size:24,color:HI,weight:700}));
 return s;
}

export const qxHsWBasics2Diagrams={
 // ================= 問題アニメ：出題（小問1、6.3 秒＋静止）=================
 // 左端で手がロープを上下に振り、波が右へ伸びていく。山の一つに紫の目印。v＝12 m/s・f＝4.0 Hz。波長の物差しは付けない。手が上に来た瞬間で止まる。
 [K+'q1']:(p,ctx)=>setupPic(cueT(ctx)),
 // ================= 問題アニメ：小問2（3 秒＋静止）=================
 // 小問1の波形を消し、ロープの左端と手、v＝12 m/s だけ。f＝4.0 Hz が f＝8.0 Hz に替わり、数字が一度光る。ロープは端の近くだけ、真っすぐな線。
 [K+'q2']:(p,ctx)=>{
  const t=cueT(ctx),sw=seg(t,.9,1.2),glow=seg(t,1.2,1.4)*(1-seg(t,1.9,2.3));
  let s=line(RO.x0,RO.y,RO.x0+260,RO.y,{color:ROPE,w:5})+hand(RO.x0,RO.y);
  s+=vLab()+fLab('f＝4.0 Hz',1-sw)+fLab('f＝8.0 Hz',sw,glow);
  return s;
 },
 // ================= 問題アニメ：小問3（4 秒＋静止）=================
 // 暗転して切り替える。上に波の式、下に t＝0 の写真（横軸 x、0〜3 m の目盛り）。x＝0.75 m の山の頂上に黄色い縦線。0.050 s の写真は見せない。
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx),a=seg(t,.4,1),b=seg(t,1.3,1.9),c=seg(t,2.3,2.8);
  let s=fade(a,T2(FORM(),600,150,{size:48}))+note('（x・y は m、t は s）',600,226,{g:a});
  s+=fade(b,label('t＝0 の 写真',600,280,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=photoQ(0,370,{A:46,g:b,yl:c,tlab:0});
  return s;
 },
 // ================= S1 小問1 =================
 // 1. 出題中のロープと手、v・f。手が振れ、波が右へ進む
 [K+'setup']:(p,ctx)=>setupPic(6.3+tAt(ctx,K+'setup'),{long:1}),
 // 2. 求めるもの：波長 λ
 [K+'goal1']:(p,ctx)=>setupPic(6.3+tAt(ctx,K+'setup'),{mk:0,long:1})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. コマ送り：手が1往復する間に、紫の目印が1波長進む → v＝λ/T → v＝fλ（2文目は図を消して式）
 [K+'derive']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,u=lin(p,.06,b-.08),fig=1-seg(p,b,b+.06);
  let s=frameRope(u,{g:fig,lam:seg(p,b-.1,b-.03)});
  s+=timer(u<.01?'時間 0':u<.999?'時間 …':'時間 T',fig*seg(p,.02,.06));
  const ve=voiceEnd(ctx),L=Math.max(.2,ve-b),e1=seg(p,b+.02,b+.07),e2=seg(p,b+L*.35,b+L*.35+.06),e3=seg(p,b+L*.7,b+L*.7+.06);
  s+=card(240,110,720,300,'',e1,VC);
  s+=fade(e1*(1-e3),T2(`${vt}=\\dfrac{${Lt}}{${Tt}}`,600,190,{size:52}));
  s+=fade(e2*(1-e3),T2(`${Tt}=\\dfrac{1}{${ft}}`,540,320,{size:44})+label('を 入れる',640,330,{size:26,color:C.dim,weight:700}));
  s+=fade(e3,T2(`${vt}=\\dfrac{${Lt}}{1/${ft}}=${ft}${Lt}`,600,260,{size:56}));
  s+=goalTag(G1);
  return s;
 },
 // 4. v＝fλ の両辺を f で割る → λ＝v/f＝12÷4.0＝3.0 m
 [K+'divide']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=card(200,96,800,330,'',1,LC);
  s+=fade(1-seg(p,b-.04,b),T2(`${vt}=${ft}${Lt}`,600,180,{size:52}));
  s+=fade(seg(p,.12,.2)*(1-seg(p,b-.04,b)),T2(`\\dfrac{${vt}}{${ft}}=\\dfrac{\\cancel{${ft}}${Lt}}{\\cancel{${ft}}}`,600,320,{size:52}));
  s+=fade(seg(p,.1,.18)*(1-seg(p,b-.04,b)),label('両辺を f で 割る',880,250,{size:26,color:FC,weight:700,anchor:'middle'}));
  s+=fade(seg(p,b,b+.06),T2(`${Lt}=\\dfrac{${vt}}{${ft}}`,600,180,{size:52}));
  s+=fade(seg(p,b+.2,b+.28),T2(`=12\\div 4.0=3.0\\ \\mathrm{m}`,600,330,{size:52}));
  s+=goalTag(G1);
  return s;
 },
 // 5. 1秒を早回し：手が山を4個出し、最初の山は 12 m 先へ。12 m に4個 → 1個は 3.0 m
 [K+'second']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,tau=mix(-.0625,1,lin(p,.04,b-.06));
  const L=Math.max(.2,voiceEnd(ctx)-b);
  let s=secRope(tau,{arrow12:seg(p,b-.08,b-.02),band:seg(p,b+.02,b+L*.25),count:seg(p,b+L*.25,b+L*.55),ruler:seg(p,b+L*.7,b+L*.85)});
  s+=timer(tau<.999?(tau<=0?'時間 0':'時間 …'):'1秒後',seg(p,.02,.06));
  s+=goalTag(G1);
  return s;
 },
 // 6. 小問1 の答え C。誤答 A・B（1枚ずつ、2文目を半分ずつ）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,ve=W[W.length-1][1];
  let s=secRope(1,{arrow12:1,band:1,count:1,ruler:1,g:1-.5*seg(p,b,b+.05)});
  s+=goalTag(G1)+A1(seg(p,.05,.15));
  s+=wrongSeq(p,ctx,[['A','48 m','速さと 振動数を 掛けた（m/s × 1/s）'],['B','0.33 m','割る 向きを 逆に した（単位が m で ない）']],{win:[[b,b+(ve-b)/2],[b+(ve-b)/2,1]],opts:{y:360}});
  return s;
 },
 // 7. 誤答 D。「s」と「m」を並べて赤い ≠
 [K+'wrongD']:(p,ctx)=>{
  let s=secRope(1,{arrow12:1,band:1,count:1,ruler:1,g:.25});
  s+=card(420,100,360,110,'',seg(p,.25,.35),C.faint)+fade(seg(p,.25,.35),label('s',530,178,{size:52,color:TC,anchor:'middle',weight:700})+label('≠',600,178,{size:52,color:BAD,anchor:'middle',weight:700})+label('m',670,178,{size:52,color:LC,anchor:'middle',weight:700}));
  s+=goalTag(G1)+A1(1);
  s+=wrongCard('D','0.25 m','周期 0.25 s を 波長と した',{y:360,g:seg(p,.03,.1)});
  return s;
 },
 // ================= S2 小問2 =================
 // 8. 出題中の小問2 の画面（ロープの端と手、v＝12 m/s、f＝8.0 Hz）。求めるもの
 [K+'goal2']:(p)=>{
  let s=line(RO.x0,RO.y,RO.x0+260,RO.y,{color:ROPE,w:5})+hand(RO.x0,RO.y)+vLab(1,1)+fLab('f＝8.0 Hz');
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9. 上下に2本。まっさらなロープに 4.0 Hz・8.0 Hz の波が伸び、先頭の目印は同じ時刻に同じ x
 [K+'two']:(p,ctx)=>{
  const t=tAt(ctx,K+'two')-.4;
  let s=twoRopes(t);
  s+=goalTag(G2);
  return s;
 },
 // 10. λ＝12÷8.0＝1.5 m（1文目）→ 小問2 の答え A（2文目）→ 物差し 1.5 m と 3.0 m
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,t=durOf(ctx,K+'two')-.4,L=Math.max(.2,1-b);
  const eq=seg(p,.05,.15)*(1-seg(p,b+L*.2,b+L*.28));
  let s=twoRopes(t,{rulers:seg(p,b+L*.28,b+L*.4),bracket:seg(p,b+L*.5,b+L*.62)});
  s+=pauseBadge({x:420,g:seg(p,0,.06)});
  s+=card(330,418,540,84,T2(`${Lt}=12\\div 8.0=1.5\\ \\mathrm{m}`,600,462,{size:40}),eq,LC);
  s+=goalTag(G2)+A2(seg(p,b+.01,b+.08));
  return s;
 },
 // 11. 誤答 B・C（1枚ずつ）。図を消して、確かめの式だけを上に
 [K+'wrongBC2']:(p,ctx)=>{
  const t=durOf(ctx,K+'two')-.4,o=seg(p,0,.1);
  let s=fade(1-o,twoRopes(t,{rulers:1,bracket:1}));
  s+=card(300,110,600,90,T2(`8.0\\times 1.5=12\\ \\mathrm{m/s}`,600,158,{size:40}),o,OK)+fade(o,label('8.0 Hz のとき',600,236,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(1);
  s+=wrongSeq(p,ctx,[['B','24 m/s、3.0 m','速く 振ると 波が 速く なると 考えた'],['C','24 m/s、1.5 m','8.0 × 1.5 ＝ 12 で 合わない']]);
  return s;
 },
 // 12. 誤答 D
 [K+'wrongD2']:(p)=>{
  let s=card(300,110,600,90,T2(`8.0\\times 1.5=12\\ \\mathrm{m/s}`,600,158,{size:40}),1,OK)+label('8.0 Hz のとき',600,236,{size:24,color:C.dim,anchor:'middle',weight:700});
  s+=goalTag(G2)+A2(1);
  s+=wrongCard('D','12 m/s、6.0 m','振動数と 波長が 比例すると した',{mid:'8.0\\times 6.0=48\\ \\mathrm{m/s}\\ \\neq\\ 12\\ \\mathrm{m/s}',midSize:32,g:seg(p,.03,.1)});
  return s;
 },
 // ================= S3 小問3 =================
 // 13a. 求めるもの。波の式を大きく
 [K+'goal3a']:(p)=>{
  let s=T2(FORM(),600,150,{size:46})+note('（x・y は m、t は s）',600,222);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 13b. 横に sin のグラフ（頂上 π/2 に黄色の点）、中身を黄色の枠で囲み「＝1/4」
 [K+'goal3']:(p)=>{
  const bx=seg(p,.3,.38);
  let s=fade(1-bx,T2(FORM(),600,150,{size:46}))+fade(bx,T2(FORM_BOX,600,150,{size:46}));
  s+=note('（x・y は m、t は s）',600,222);
  s+=sinGraph({g:seg(p,.03,.1),dotG:seg(p,.15,.24)});
  s+=card(640,290,520,140,T2(`${INNER}=\\dfrac{1}{4}`,900,362,{size:46}),seg(p,.5,.6),HI);
  s+=goalTag(G3);
  return s;
 },
 // 14. t＝0 を代入（t の項に打ち消し線）→ x＝0.75 m。下に t＝0 の写真
 [K+'t0']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=card(150,84,900,150,'',1,HI);
  s+=T2(`\\dfrac{${xt}}{3.0}-\\cancel{\\dfrac{${tt}}{0.25}}=\\dfrac{1}{4}`,600,140,{size:40});
  s+=fade(seg(p,.05,.12),label('t＝0',940,150,{size:26,color:TC,weight:700}));
  s+=fade(seg(p,.4,.5),T2(`${xt}=0.75\\ \\mathrm{m}`,600,206,{size:36}));
  s+=photoQ(0,P1,{g:seg(p,b-.05,b+.05),yl:seg(p,b+.05,b+.15)});
  s+=goalTag(G3);
  return s;
 },
 // 15a. t/T＝0.050÷0.25＝0.20
 [K+'tnext0']:(p)=>{
  let s=card(150,84,900,150,'',1,HI);
  s+=fade(seg(p,.05,.15),T2(`\\dfrac{${tt}}{${Tt}}=0.050\\div 0.25=0.20`,600,140,{size:38}));
  s+=photoQ(0,P1,{ticks:0});
  s+=goalTag(G3);
  return s;
 },
 // 15b. x/3.0＝0.25＋0.20＝0.45 → x＝1.35 m。下に t＝0.050 s の写真
 [K+'tnext']:(p)=>{
  let s=card(150,84,900,150,'',1,HI);
  s+=T2(`\\dfrac{${tt}}{${Tt}}=0.050\\div 0.25=0.20`,600,140,{size:38});
  s+=fade(seg(p,.03,.12),T2(`\\dfrac{${xt}}{3.0}=0.25+0.20=0.45`,520,206,{size:34}));
  s+=fade(seg(p,.5,.6),T2(`\\Rightarrow\\ ${xt}=1.35\\ \\mathrm{m}`,900,206,{size:34}));
  s+=photoQ(0,P1,{ticks:0});
  s+=photoQ(.05,P2,{g:seg(p,.6,.7),yl:seg(p,.7,.8)});
  s+=goalTag(G3);
  return s;
 },
 // 16. 小問3 の答え D（1文目）。t が増えると −t/T が小さく、x/λ が大きく（2文目）。写真の上に右向きの矢印（○）
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3,o=seg(p,b+.02,b+.1);
  let s=card(150,84,900,150,'',1,HI);
  s+=fade(1-o,T2(`\\dfrac{${xt}}{3.0}=0.25+0.20=0.45\\ \\Rightarrow\\ ${xt}=1.35\\ \\mathrm{m}`,600,160,{size:36}));
  s+=fade(o,T2(`\\dfrac{${xt}}{3.0}`,400,160,{size:44})+T2(`-\\dfrac{${tt}}{0.25}`,640,160,{size:44})+T2(`=\\dfrac{1}{4}`,840,160,{size:44})+label('（一定）',930,170,{size:24,color:C.dim,weight:700}));
  const a1=seg(p,b+.15,b+.25),a2=seg(p,b+.3,b+.4);
  s+=arrow(720,130,720,195,{color:BAD,w:5,head:14,g:a1})+fade(a1,label('t が 増えて 小さく',720,226,{size:22,color:BAD,anchor:'middle',weight:700}));
  s+=arrow(470,195,470,130,{color:OK,w:5,head:14,g:a2})+fade(a2,label('x が 大きく',470,226,{size:22,color:OK,anchor:'middle',weight:700}));
  s+=photoQ(0,P1,{ticks:0})+photoQ(.05,P2);
  const ar=seg(p,b+.45,b+.55);
  s+=arrow(PX(1.35)+24,P2-36,PX(1.35)+180,P2-36,{color:OK,w:5,head:16,g:ar})+fade(ar,label('○ 右へ',PX(1.35)+196,P2-28,{size:26,color:OK,weight:700}));
  s+=goalTag(G3)+A3(seg(p,.05,.12));
  return s;
 },
 // 17. 誤答 A・B（1枚ずつ）。A：左向きの矢印に ×
 [K+'wrongAB3']:(p,ctx)=>{
  const W=sentWin(ctx),a=W[1]?W[1][0]:.5;
  let s=card(150,84,900,110,T2(FORM(),600,140,{size:40}),1,C.faint);
  const g=seg(p,.03,.1)*(1-seg(p,a-.04,a-.005));
  s+=arrow(700,262,500,262,{color:C.dim,w:5,head:16,g})+fade(g,label('×',600,250,{size:40,color:BAD,anchor:'middle',weight:700})+label('左へ',740,272,{size:24,color:C.dim,weight:700}));
  s+=goalTag(G3)+A3(1);
  s+=wrongSeq(p,ctx,[['A','0.15 m','−t/T の 符号から、左へ 進むと した'],['B','0.80 m','m と s を 足した']],{opts:{y:310}});
  return s;
 },
 // 18. 誤答 C。式の中の t を黄色く光らせる
 [K+'wrongC3']:(p,ctx)=>{
  const hi=seg(p,.1,.2)*(.55+.45*Math.cos(cueT(ctx)*5));
  let s=card(150,84,900,110,'',1,C.faint);
  s+=fade(1-hi,T2(FORM(),600,140,{size:40}))+fade(hi,T2(FORM(`\\dfrac{${xt}}{3.0}-\\dfrac{{\\color{${HI}}\\boldsymbol{t}}}{0.25}`),600,140,{size:40}));
  s+=goalTag(G3)+A3(1);
  s+=wrongCard('C','0.75 m','中身の t を 見落とした',{y:310,g:seg(p,.03,.1)});
  return s;
 },
 // 19. 確かめ：二本の黄色い縦線の間に紫の矢印 0.60 m。0.60÷0.050＝12 m/s と v＝fλ＝4.0×3.0＝12 m/s
 [K+'check']:(p)=>{
  let s=photoQ(0,P1,{ticks:0})+photoQ(.05,P2,{ghost:seg(p,.05,.15)});
  const y=P2-62,ag=seg(p,.08,.2);
  s+=arrow(PX(.75),y,PX(1.35),y,{color:VC,w:5,head:14,g:ag})+fade(ag,label('0.60 m',PX(1.05),y-10,{size:26,color:VC,anchor:'middle',weight:700}));
  const h12=seg(p,.6,.7);
  s+=card(150,84,900,150,'',seg(p,.15,.25),VC);
  s+=fade(seg(p,.2,.3),T2(`0.60\\div 0.050=${h12>.5?`{\\color{${HI}}12}`:'12'}\\ \\mathrm{m/s}`,600,135,{size:38}));
  s+=fade(seg(p,.45,.55),T2(`${vt}=${ft}${Lt}=4.0\\times 3.0=${h12>.5?`{\\color{${HI}}12}`:'12'}\\ \\mathrm{m/s}`,600,200,{size:38}));
  return s;
 },
 // 20. まとめ：2枚の写真、0.60 m の紫の矢印、v＝fλ＝4.0×3.0＝12 m/s。隅に単元動画の v＝fλ の札
 [K+'sum']:(p)=>{
  const a=seg(p,.03,.15);
  let s=fade(a,photoQ(0,P1,{ticks:0})+photoQ(.05,P2,{ghost:1}));
  const y=P2-62;
  s+=fade(a,arrow(PX(.75),y,PX(1.35),y,{color:VC,w:5,head:14})+label('0.60 m',PX(1.05),y-10,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=card(150,84,640,130,T2(`${vt}=${ft}${Lt}=4.0\\times 3.0=12\\ \\mathrm{m/s}`,470,156,{size:38}),seg(p,.2,.3),HI);
  s+=card(830,84,320,130,label('単元動画の 札',990,118,{size:22,color:C.dim,anchor:'middle',weight:700})+T2(`${vt}=${ft}${Lt}`,990,176,{size:44}),seg(p,.35,.45),VC);
  s+=answerRow([[1,'C',''],[2,'A',''],[3,'D','']],{g:seg(p,.03,.15)});
  return s;
 },
};
