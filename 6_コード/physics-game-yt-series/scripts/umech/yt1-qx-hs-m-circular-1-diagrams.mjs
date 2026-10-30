// 問題編 解説「台の上で回るおもり」(ys-qx-hs-m-circular-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/109_円運動と万有引力.md の q-hs-m-circular-1（解説 18 行）。
// 真上から見た円（半径 0.50 m、速さ 3.0 m/s、反時計回り）。台に固定した目盛りで見る。遠心力は使わない。
// 色（単元動画と同じ）：半径・弧 水色、速度 v 紫、加速度 a 赤、角速度 ω 桃、周期 T 金、Δ𝐯・強調 黄。
// 動きは見やすいように、実際（1周 約1.05 s）よりゆっくり回す（注記を出す）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-m-circular-1）の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp} from './anim.mjs';
import {orbit,P,U,arcPts,ball,rightMark} from './yt1-hs-m-circular-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,pauseBadge,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-circular-1:';
const G1='角速度 ω',G2='加速度の大きさ a',G3='加速度の向き';
const A1=g=>answerTag(1,'A','6.0 rad/s',{g}),A2=g=>answerTag(2,'D','18 m/s²',{g}),A3=g=>answerTag(3,'B','中心の向き',{g});
const W=`{\\color{${C.p}}\\omega}`,R=`{\\color{${C.x}}r}`,V=`{\\color{${C.v}}v}`,A=`{\\color{${C.a}}a}`,TT=`{\\color{${C.t}}T}`;
const TF=(src,x,y,o={})=>tex(src,x,y,{size:40,auto:false,...o});
const RX=905;   // 右の枠の中央
const rcard=(y,h,inner,g=1,stroke=C.faint)=>card(620,y,570,h,inner,g,stroke);

// ---- 真上から見た台と円 --------------------------------------------------------------------------
export const O1={x:300,y:300,R:150,LV:110};
const RAD_PHI=Math.PI*1.25;   // 「0.50 m」を書く半径の向き（左下）
export function table1({phi=0,vel=1,vlab=1,rlab=1,acc=0,g=1,str=1}={}){
 let s=orbit({o:O1,phi:null,circle:0,g});
 s+=fade(g,ring(O1.x,O1.y,O1.R,{color:C.x,w:3}));
 if(rlab){const [x,y]=P(RAD_PHI,O1);
  s+=fade(g*rlab,line(O1.x,O1.y,x,y,{color:C.x,w:2.5,dash:'6 6'})+label('0.50 m',(O1.x+x)/2+12,(O1.y+y)/2+30,{size:24,color:C.x,anchor:'start',weight:700}));}
 if(phi!==null){
  const [x,y]=P(phi,O1),[ux,uy]=U(phi);
  if(str)s+=fade(g*str,line(O1.x,O1.y,x,y,{color:C.dim,w:2}));
  if(acc)s+=arrow(x,y,x+(O1.x-x)*.6,y+(O1.y-y)*.6,{color:C.a,w:6,head:16,g:g*acc});
  if(vel)s+=arrow(x,y,x+O1.LV*ux,y+O1.LV*uy,{color:C.v,w:5,head:16,g:g*vel});
  if(vlab&&vel){const tx=x+O1.LV*ux,ty=y+O1.LV*uy;s+=fade(g*vlab*vel,label('3.0 m/s',tx+(ux>=0?12:-12),ty+(uy>0?26:-10),{size:24,color:C.v,anchor:ux>=0?'start':'end',weight:700}));}
  s+=fade(g,ball(x,y,{r:15}));
 }
 s+=fade(g,dot(O1.x,O1.y,6,C.dim));
 return s;
}
const slow=(g=1)=>note('（動きは ゆっくり 描いています）',RX,505,{g});
const WV=1.0;   // 画面で回す角速度（rad/s、見やすい速さ）

// ---- 小問3：2点 P・Q と速度の矢印 -----------------------------------------------------------------
const DP=.45,DPMIN=.12,PP=-DP,PQ=DP,TAIL={x:760,y:335};
// （2026-10-16 PQ-029）dp：P・Q の角度の半分（近づける動き）。grow：Δ𝐯 を先から先へ伸ばす割合。tipHi：[P の先, Q の先] を光らせる。
//   移した Δ𝐯 は、向きを見るため、近づけても長さを最初の長さにそろえて描く（注記を出す）。
const DV0=2*O1.LV*Math.sin(DP);
function pqScene({pts=1,vel=0,mv=0,ghost=.35,dv=0,move=0,red=0,note1=0,g=1,dp=DP,grow=1,tipHi=[0,0]}={}){
 let s=table1({phi:null,rlab:0,g});
 const L=O1.LV,Pp=P(-dp,O1),Pq=P(dp,O1),uP=U(-dp),uQ=U(dp);
 const at=(b,u,m)=>{const x=b[0]+(TAIL.x-b[0])*m,y=b[1]+(TAIL.y-b[1])*m;return [x,y,x+L*u[0],y+L*u[1]];};
 if(vel){
  if(mv>0)[[Pp,uP],[Pq,uQ]].forEach(([b,u])=>{s+=fade(g*vel*ghost,arrow(b[0],b[1],b[0]+L*u[0],b[1]+L*u[1],{color:C.v,w:4,head:14}));});
  [[Pp,uP],[Pq,uQ]].forEach(([b,u])=>{const [x,y,X,Y]=at(b,u,mv);s+=arrow(x,y,X,Y,{color:C.v,w:5,head:16,g:g*vel});});
  if(mv>.95)s+=fade(g*vel,dot(TAIL.x,TAIL.y,6,C.ink)+label('根元を そろえる',TAIL.x,TAIL.y+42,{size:24,color:C.dim,anchor:'middle'})
   +label('P の 速度',TAIL.x+L*uP[0]+22,TAIL.y+L*uP[1]+4,{size:24,color:C.v,weight:700})+label('Q の 速度',TAIL.x+L*uQ[0]-22,TAIL.y+L*uQ[1]+4,{size:24,color:C.v,anchor:'end',weight:700}));
 }
 if(pts)s+=fade(g*pts,ball(Pp[0],Pp[1],{r:12})+ball(Pq[0],Pq[1],{r:12})+label('P',Pp[0]+18,Pp[1]+28,{size:28,color:C.ink,weight:700})+label('Q',Pq[0]+18,Pq[1]-10,{size:28,color:C.ink,weight:700}));
 if(note1)s+=note('（単元動画の 点A・点B）',300,505,{g:g*note1});
 const tP=[TAIL.x+L*uP[0],TAIL.y+L*uP[1]],tQ=[TAIL.x+L*uQ[0],TAIL.y+L*uQ[1]];
 if(tipHi[0])s+=fade(g*tipHi[0],ring(tP[0],tP[1],13,{color:C.hi,w:4}));
 if(tipHi[1])s+=fade(g*tipHi[1],ring(tQ[0],tQ[1],13,{color:C.hi,w:4}));
 if(dv){
  const M=P(0,O1),len=DV0;
  const x0=tP[0]+(M[0]-tP[0])*move,y0=tP[1]+(M[1]-tP[1])*move,x1=x0+((tQ[0]-tP[0])*(1-move)+(-len)*move)*grow,y1=y0+(tQ[1]-tP[1])*(1-move)*grow;
  const col=red>.5?C.a:C.hi;
  s+=arrow(x0,y0,x1,y1,{color:col,w:6,head:16,g:g*dv});
  s+=fade(g*dv*(1-red)*Math.max(1-seg(move,0,.1),seg(move,.85,1)),tex('\\Delta\\boldsymbol{v}',(x0+x1)/2,y0-26,{size:32,color:C.hi,auto:false}));
  if(move>.98)s+=fade(g*seg(move,.98,1),line(M[0],M[1],O1.x,O1.y,{color:C.hi,w:2,dash:'5 7'}));
  if(red)s+=fade(g*red,label('加速度',(x0+x1)/2,y0-22,{size:26,color:C.a,anchor:'middle',weight:700}));
 }
 return s;
}

export const qxHsMCircular1Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、6秒＋静止）=================
 // 0〜2 s：真上から見た台・中心の釘・糸・水色の円（半径に 0.50 m）。2〜6 s：おもりが反時計回りに回り、紫の矢印 3.0 m/s が接線の向き。
 // おもりが円の右側に来た所で「映像を一時停止」。ω・a の数値、加速度の矢印、Δ𝐯、周期の時計は出さない。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx),u=clamp((t-2)/4),phi=Math.PI/2+1.5*Math.PI*(1-(1-u)**2);
  let s=fade(seg(t,0,.6),table1({phi,vel:seg(t,1,1.6),vlab:seg(t,1.2,1.8),rlab:seg(t,.4,1)}));
  s+=rcard(130,250,label('なめらかで 水平な 台',RX,190,{size:28,color:C.dim,anchor:'middle'})+label('真上から 見た 図',RX,240,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('半径 0.50 m',RX,300,{size:30,color:C.x,anchor:'middle',weight:700})+label('速さ 3.0 m/s（一定）',RX,350,{size:30,color:C.v,anchor:'middle',weight:700}),seg(t,.3,.9));
  s+=pauseBadge({g:seg(t,5.85,6),x:905,y:430});
  return s;
 },
 // ================= S1 小問1：角速度 =================
 // 1. 出題中の図を再生（ゆっくり回る）
 [K+'setup']:(p,ctx)=>{
  const phi=WV*tAt(ctx,K+'setup');
  let s=table1({phi,vlab:1,rlab:1});
  s+=rcard(130,250,label('なめらかな 台',RX,190,{size:28,color:C.dim,anchor:'middle'})+label('糸に つないだ おもり',RX,240,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('半径 0.50 m',RX,300,{size:30,color:C.x,anchor:'middle',weight:700})+label('速さ 3.0 m/s',RX,350,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=slow(seg(p,.3,.45));
  return s;
 },
 // 2. 求めるもの：角速度 ω。中心の角に桃の弧
 [K+'goal1']:(p,ctx)=>{
  const phi=WV*tAt(ctx,K+'setup');
  let s=table1({phi,vlab:1,rlab:1});
  const ph=((phi%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
  s+=fade(seg(p,.2,.35),line(O1.x,O1.y,O1.x+O1.R,O1.y,{color:C.dim,w:2,dash:'5 6'}));
  if(ph>.05)s+=fade(seg(p,.2,.35),poly([[O1.x,O1.y],...arcPts(O1.x,O1.y,46,0,ph,40)],{fill:C.p,fo:.35}));
  s+=rcard(130,200,label('1秒 あたりに 回る 角度',RX,195,{size:28,color:C.ink,anchor:'middle'})+label('角速度',RX-40,270,{size:32,color:C.ink,anchor:'middle',weight:700})+TF(W,RX+50,262,{size:46}),seg(p,.25,.4),C.p);
  s+=goalTag(G1,{g:seg(p,.03,.15)})+slow();
  return s;
 },
 // 3. 1秒間に進む弧 rω が速さ → v＝rω。両辺を r で割って ω＝v/r
 [K+'arc']:(p,ctx)=>{
  const Wn=sentWin(ctx),b=Wn[1]?Wn[1][0]:.55;
  const ph0=-.3,u=seg(p,.05,b*.85),ph=ph0+6.0*u;
  let s=table1({phi:ph,vlab:0,rlab:1});
  s+=fade(1,draw(arcPts(O1.x,O1.y,O1.R,ph0,ph,90),1,{color:C.x,w:9,opacity:.6}));
  s+=fade(1,line(O1.x,O1.y,...P(ph0,O1),{color:C.dim,w:2,dash:'5 6'}));
  if(u>.01)s+=poly([[O1.x,O1.y],...arcPts(O1.x,O1.y,40,ph0,ph,60)],{fill:C.p,fo:.35});
  s+=fade(seg(p,b*.5,b*.65),TF(R+W,...P(ph0+3.0,{...O1,R:O1.R+40}),{size:34}))+fade(seg(p,b*.5,b*.65),TF(W,O1.x-56,O1.y+8,{size:30}));
  s+=fade(seg(p,.08,.2),label('1秒間に 進む 弧',RX,128,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=rcard(150,110,TF(V+'='+R+W,RX,212,{size:46}),seg(p,b*.75,b*.9),C.v);
  s+=fade(seg(p,b+.02,b+.1),label('両辺を r で 割る',RX,310,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=rcard(335,130,TF(W+'=\\dfrac{'+V+'}{'+R+'}',RX,402,{size:48}),seg(p,b+.12,b+.24),C.p);
  s+=goalTag(G1)+slow(seg(p,.05,.15));
  return s;
 },
 // 4. 3.0÷0.50＝6.0 rad/s。小問1 の答え A
 [K+'ans1']:(p,ctx)=>{
  const ve=voiceEnd(ctx),ph=5.7;
  let s=table1({phi:ph,vlab:1,rlab:1});
  s+=fade(.35,draw(arcPts(O1.x,O1.y,O1.R,-.3,ph,90),1,{color:C.x,w:9}));
  s+=rcard(110,120,TF(W+'=\\dfrac{'+V+'}{'+R+'}=\\dfrac{3.0}{0.50}',RX,172,{size:44}),1,C.p);
  s+=rcard(260,110,TF('='+'6.0\\ \\mathrm{rad/s}',RX,318,{size:46,color:C.p}),seg(p,.15,.3),C.p);
  s+=goalTag(G1)+A1(seg(p,ve*.5,ve*.5+.08));
  return s;
 },
 // 5. 周期 T＝2πr/v＝π/3≈1.05 s。2π÷(π/3)＝6.0 で一致
 [K+'period']:(p)=>{
  const u=seg(p,.05,.5),ph=5.7+2*Math.PI*u;
  let s=table1({phi:ph,vlab:0,rlab:1});
  s+=fade(1,draw(arcPts(O1.x,O1.y,O1.R,5.7,ph,90),1,{color:C.t,w:6,opacity:.75}));
  s+=fade(seg(p,.05,.15)*(1-seg(p,.55,.6)),label(u<.999?'1周 …':'1周',O1.x,O1.y+40,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=rcard(90,196,TF(TT+'=\\dfrac{2\\pi '+R+'}{'+V+'}=\\dfrac{2\\pi\\times 0.50}{3.0}',RX,140,{size:36})+fade(seg(p,.25,.35),TF('=\\dfrac{\\pi}{3}\\approx 1.05\\ \\mathrm{s}',RX,236,{size:36,color:C.t})),seg(p,.02,.12),C.t);
  s+=rcard(300,110,TF('2\\pi\\div\\dfrac{\\pi}{3}=6.0',RX-40,356,{size:40,color:C.p})+fade(seg(p,.7,.8),label('✓ 一致',RX+200,364,{size:28,color:C.F,anchor:'middle',weight:700})),seg(p,.55,.65),C.p);
  s+=note('（丸める前の π/3 で 計算）',RX,445,{g:seg(p,.6,.7)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 6. 誤答 B（r×v）、D（r÷v）。1枚ずつ
 [K+'wrongBD']:(p,ctx)=>{
  let s=table1({phi:5.7,vlab:1,rlab:1,g:.45});
  s+=rcard(100,100,TF(W+'=\\dfrac{'+V+'}{'+R+'}=6.0\\ \\mathrm{rad/s}',RX,160,{size:40}),1,C.p);
  s+=wrongSeq(p,ctx,[['B','1.5 rad/s','r×v（単位 m²/s）'],['D','0.17 rad/s','r÷v（単位 s）']],{opts:{x:620,w:570,y:240}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7. 誤答 C（速さの値そのまま）
 [K+'wrongC']:(p)=>{
  let s=table1({phi:5.7,vlab:1,rlab:1,g:.45});
  s+=rcard(100,100,TF(W+'=\\dfrac{'+V+'}{'+R+'}=6.0\\ \\mathrm{rad/s}',RX,160,{size:40}),1,C.p);
  s+=wrongCard('C','3.0 rad/s','速さの値をそのまま使った',{x:620,w:570,y:240,g:seg(p,.03,.1)});
  s+=fade(seg(p,.5,.62),label('m/s と rad/s は 別の 量',RX,420,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：加速度の大きさ =================
 // 8. 求めるもの：加速度の大きさ
 [K+'goal2']:(p,ctx)=>{
  const phi=WV*tAt(ctx,K+'goal2');
  let s=table1({phi,vlab:1,rlab:1});
  s+=goalTag(G2,{g:seg(p,.03,.15)})+slow();
  return s;
 },
 // 9. 速さ一定でも、矢印の向きが回る → 速度は変化。右に根元をそろえた速度の矢印
 [K+'turn']:(p,ctx)=>{
  const phi=WV*tAt(ctx,K+'goal2'),L=O1.LV,cx=RX,cy=272;
  let s=table1({phi,vlab:1,rlab:1});
  let f=card(620,90,570,350,'',1,C.v)+label('速度の 矢印（根元を そろえる）',cx,140,{size:24,color:C.dim,anchor:'middle'});
  for(let k=1;k<=5;k++){const [ux,uy]=U(phi-.5*k);f+=fade(.5-k*.08,arrow(cx,cy,cx+L*ux,cy+L*uy,{color:C.v,w:3,head:12}));}
  const [ux,uy]=U(phi);f+=arrow(cx,cy,cx+L*ux,cy+L*uy,{color:C.v,w:6,head:18})+dot(cx,cy,6,C.ink);
  f+=fade(seg(p,.2,.35),ring(cx,cy,L,{color:C.v,w:1.5,dash:'5 7'}));
  f+=label('長さ 3.0 の まま',cx,cy+L+46,{size:24,color:C.v,anchor:'middle',opacity:seg(p,.2,.35)});
  s+=fade(seg(p,.03,.15),f);
  s+=fade(seg(p,.55,.7),label('速さ 一定 ≠ 速度 一定',RX,482,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 10. a＝v²/r＝3.0²÷0.50＝18 m/s²。小問2 の答え D
 [K+'acc']:(p,ctx)=>{
  const phi=WV*tAt(ctx,K+'goal2'),ve=voiceEnd(ctx);
  let s=table1({phi,vlab:1,rlab:1,acc:seg(p,.15,.3)});
  s+=rcard(96,110,TF(A+'=\\dfrac{'+V+'^2}{'+R+'}',RX,155,{size:46}),seg(p,.03,.12),C.a);
  s+=rcard(222,96,TF('3.0^2=9.0',RX,270,{size:42}),seg(p,.3,.4));
  s+=rcard(334,110,TF('9.0\\div 0.50=18\\ \\mathrm{m/s^2}',RX,392,{size:42,color:C.a}),seg(p,.45,.56),C.a);
  s+=goalTag(G2)+A2(seg(p,ve*.78,ve*.78+.07))+slow();
  return s;
 },
 // 11. rω² でも 0.50×6.0²＝18
 [K+'rw2']:(p,ctx)=>{
  const phi=WV*tAt(ctx,K+'goal2'),Ry=`{\\color{${C.hi}}\\boxed{{\\color{${C.x}}r}}}`;
  let s=table1({phi,vlab:1,rlab:1,acc:1});
  s+=rcard(96,140,TF('\\dfrac{'+V+'^2}{'+R+'}=\\dfrac{('+R+W+')^2}{'+R+'}='+R+W+'^2',RX,166,{size:42}),seg(p,.03,.15),C.a);
  s+=fade(seg(p,.03,.15),label('v ＝ rω を 入れる',RX,262,{size:24,color:C.dim,anchor:'middle'}));
  s+=rcard(290,150,TF(Ry+W+'^2=0.50\\times 6.0^2',RX,335,{size:38})+TF('=0.50\\times 36=18',RX,400,{size:38}),seg(p,.35,.5),C.a);
  s+=goalTag(G2)+A2(1)+slow();
  return s;
 },
 // 12. 誤答 A（0）、B（36）、C（4.5）。1枚ずつ（2文目を B・C で半分ずつ）
 [K+'wrongABC']:(p,ctx)=>{
  const phi=WV*tAt(ctx,K+'goal2'),Wn=sentWin(ctx),[a,b]=Wn[1]??[.5,1],m=a+(b-a)*.5;
  let s=table1({phi,vlab:1,rlab:1,acc:1,g:.45});
  s+=rcard(96,100,TF(A+'=\\dfrac{'+V+'^2}{'+R+'}=18\\ \\mathrm{m/s^2}',RX,152,{size:40}),1,C.a);
  s+=wrongSeq(p,ctx,[['A','0','向きが変われば速度は変化'],['B','36','ω² だけ（単位 1/s²）'],['C','4.5','v²×r（単位 m³/s²）']],{win:[Wn[0],[a,m],[m,1]],opts:{x:620,w:570,y:240}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：加速度の向き =================
 // 13. 求めるもの：加速度の向き
 [K+'goal3']:(p)=>{
  let s=table1({phi:0,vlab:0,rlab:0});
  s+=fade(seg(p,.2,.35),label('加速度は どちら向き？',RX,260,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. 2点 P・Q の速度の矢印を、根元をそろえて並べる
 [K+'pq']:(p)=>{
  let s=pqScene({pts:seg(p,.05,.2),vel:seg(p,.25,.4),mv:seg(p,.5,.85),note1:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('加速度の 向き ＝ Δ𝐯 の 向き',RX,128,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 15.（2026-10-16 PQ-029 で2 cue に分けた）P の速度の矢印の先 → Q の速度の矢印の先へ Δ𝐯 を引く。始点・終点を順に光らせ、矢印を伸ばす
 [K+'dv']:(p)=>{
  const hP=seg(p,.05,.15),hQ=seg(p,.3,.4);
  let s=pqScene({pts:1,vel:1,mv:1,tipHi:[hP,hQ],dv:seg(p,.45,.5),grow:seg(p,.45,.75)});
  s+=rcard(395,100,fade(hP,label('始点：P での 速度の 先',RX,435,{size:26,color:C.ink,anchor:'middle',weight:700}))
   +fade(hQ,label('終点：Q での 速度の 先',RX,477,{size:26,color:C.ink,anchor:'middle',weight:700})),seg(p,.03,.12));
  s+=fade(seg(p,.75,.85),label('Δ𝐯 ＝ Q の 速度 − P の 速度',RX,140,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 15b. Δ𝐯 を P と Q の真ん中へ移す → P と Q を近づける（Δ𝐯 の向きは中心向きのまま）→ 赤の加速度。小問3 の答え B
 [K+'dv2']:(p,ctx)=>{
  const Wn=sentWin(ctx),b=Wn[1]?Wn[1][0]:.8;
  const mvv=seg(p,.03,b*.35),ap=seg(p,b*.4,b*.8),dp=DP+(DPMIN-DP)*(1-(1-ap)**2);
  let s=pqScene({pts:1,vel:1,mv:1,dv:1,move:mvv,red:seg(p,b*.85,b),dp});
  s+=fade(seg(p,b*.4,b*.48),label('P と Q を 近づける',300,505,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=note('（向きを 見るため、Δ𝐯 の 長さは そろえて 描いています）',RX,130,{g:seg(p,b*.4,b*.48)});
  s+=fade(seg(p,b*.82,b),label('円の 中心を 向く',RX,470,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(seg(p,b+.03,b+.1));
  return s;
 },
 // 16. 誤答 A（接線の向き）、C（外向き）。その向きの矢印を図に描く
 [K+'wrongAC']:(p,ctx)=>{
  const Wn=sentWin(ctx),b=Wn[1]?Wn[1][0]:.5,M=P(0,O1);
  let s=pqScene({pts:1,vel:1,mv:1,dv:1,move:1,red:1,g:.5,dp:DPMIN});
  s+=fade(seg(p,.03,.1)*(1-seg(p,b-.03,b)),arrow(M[0],M[1],M[0],M[1]-110,{color:C.dim,w:5,head:16})+label('×',M[0]+18,M[1]-90,{size:34,color:'#ff6b6b',weight:700}));
  s+=fade(seg(p,b,b+.06),arrow(M[0],M[1],M[0]+110,M[1],{color:C.dim,w:5,head:16})+label('×',M[0]+70,M[1]-16,{size:34,color:'#ff6b6b',weight:700}));
  s+=wrongSeq(p,ctx,[['A','接線の向き','Δ𝐯 の向きを見る'],['C','外向き','台から見ると中心向き']],{opts:{x:620,w:570,y:96}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 17. 誤答 D（向きはない）
 [K+'wrongD']:(p)=>{
  let s=pqScene({pts:1,vel:1,mv:1,dv:1,move:1,red:1,g:.5,dp:DPMIN});
  s+=wrongCard('D','向きはない','加速度は 18 m/s²',{x:620,w:570,y:96,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 18. 円に戻り、ω＝6.0・a＝18（中心向きの赤）を図の矢印に線で結ぶ。「中心向き、v²/r」
 [K+'sum']:(p,ctx)=>{
  const phi=.6,[x,y]=P(phi,O1);
  let s=table1({phi,vlab:1,rlab:1,acc:1});
  s+=rcard(96,96,TF(W+'=3.0\\div 0.50=6.0',RX,152,{size:40}),seg(p,.05,.15),C.p);
  s+=rcard(212,96,TF(A+'=3.0^2\\div 0.50=18',RX,268,{size:40}),seg(p,.2,.3),C.a);
  s+=fade(seg(p,.1,.2),line(620,144,O1.x+6,O1.y-10,{color:C.p,w:2,dash:'5 6'}));
  s+=fade(seg(p,.25,.35),line(620,260,(x+O1.x)/2+40,(y+O1.y)/2,{color:C.a,w:2,dash:'5 6'}));
  s+=rcard(330,120,label('中心向き、',RX-90,400,{size:34,color:C.hi,anchor:'middle',weight:700})+TF('\\dfrac{'+V+'^2}{'+R+'}',RX+70,394,{size:46}),seg(p,.4,.5),C.hi);
  s+=answerRow([[1,'A','6.0 rad/s'],[2,'D','18 m/s²'],[3,'B','中心の向き']],{g:seg(p,.55,.65),size:22});
  return s;
 },
};
