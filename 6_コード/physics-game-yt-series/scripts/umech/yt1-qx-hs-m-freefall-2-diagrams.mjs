// 問題編 解説「真上に投げたボールの最高点と、そのあと」(ys-qx-hs-m-freefall-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/104_落体の運動.md の q-hs-m-freefall-2（解説 18 行）。
// 色（01_共通の約束・単元動画と同じ）：変位 y 水色、速度 v 紫、加速度 a・g 赤、時間 t 金、強調 黄、誤り 赤（×）。
// 左：地面・縦の物差し（上向きに y、1 m＝5.8 px、0〜50 m、0 は投げた点）。右：v-t グラフ（t 0〜6.6 s、v −35〜35 m/s）。
// 投げ上げ：v＝30−10t、y＝30t−5t²。ボールの動きは実時間（1 s＝1 s）。
// 札は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。単元動画の部品（ball・Gt・Yt）と、1問目の partWin を読み込む。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,axes,tex,poly,clamp,mix,ground} from './anim.mjs';
import {Gt,Yt,ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {partWin} from './yt1-qx-hs-m-freefall-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongSeq,wrongCard,kindTag,pauseBadge,note,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-m-freefall-2:';
const G1='最高点の 速度と 加速度',G2='最高点の 高さ',G3='5 s 後の 速度';
const A1=g=>answerTag(1,'C','速度 0、加速度 −10 m/s²',{g}),A2=g=>answerTag(2,'D','45 m',{g}),A3=g=>answerTag(3,'B','−20 m/s',{g});
const V0=30,GG=10;
const vAt=t=>V0-GG*t,yAt=t=>V0*t-GG*t*t/2;
// ---- 地面・物差し・ボール -----------------------------------------------------------------------
const P={bx:300,y0:440,k:5.8,rx:400,vk:2.4};
const Ym=m=>P.y0-P.k*m;
function ruler({g=1,hi=-1,hiLab=''}={}){
 let s=line(P.rx,Ym(0),P.rx,Ym(50),{color:C.x,w:4});
 for(let m=0;m<=50;m+=5)s+=line(P.rx-(m%10?5:9),Ym(m),P.rx+(m%10?5:9),Ym(m),{color:C.x,w:2});
 for(let m=0;m<=50;m+=10)s+=label(`${m}`,P.rx+16,Ym(m)+8,{size:22,color:C.x,weight:700});
 s+=label('[m]',P.rx+16,Ym(50)-22,{size:20,color:C.x});
 if(hi>=0)s+=line(P.rx-16,Ym(hi),P.rx+16,Ym(hi),{color:C.hi,w:6})+(hiLab?label(hiLab,P.rx+60,Ym(hi)+9,{size:28,color:C.hi,weight:700}):'');
 return fade(g,s);
}
const yDir=(g=1,hl=0)=>fade(g,arrow(P.rx+150,Ym(12),P.rx+150,Ym(34),{color:hl>.5?C.hi:C.x,w:4+2*hl,head:14})+tex(Yt,P.rx+178,Ym(24)+4,{size:34,auto:false})+label('上向き 正',P.rx+120,Ym(6)+6,{size:22,color:hl>.5?C.hi:C.dim,weight:hl>.5?700:400}));
function base({g=1,hiR=-1,hiLab='',dir=1,dirHl=0}={}){
 return fade(g,ground(120,560,P.y0+28)+ruler({hi:hiR,hiLab})+(dir?yDir(dir,dirHl):''));
}
// 手（手のひらがボールの下）。(x,y)＝ボールの中心
function palm(x,y,g=1){
 return fade(g,line(x-6,y+24,x-90,y+70,{color:'#e9c7a6',w:16})+rect(x-30,y+12,60,18,{fill:'#e9c7a6',fo:1,stroke:'none',rx:9}));
}
// 速度（紫）と加速度（赤）の矢印。v＝その瞬間の速度
function vArrow(x,y,v,{g=1,lab=''}={}){
 if(Math.abs(v)<.3)return '';
 const d=v>0?-16:16;
 return arrow(x-34,y+d,x-34,y+d-P.vk*v,{color:C.v,w:5,head:14,g})+(lab?fade(g,label(lab,x-46,y+d-P.vk*v/2+8,{size:24,color:C.v,anchor:'end',weight:700})):'');
}
const aArrow=(x,y,{g=1,ringG=0}={})=>arrow(x+34,y-16,x+34,y+44,{color:C.a,w:5,head:14,g})+fade(ringG,ring(x+34,y+14,40,{color:C.hi,w:3}));
// t 秒のボール（矢印つき）
function flying(t,{va=1,aa=1,ringG=0,o=1}={}){
 const y=Ym(yAt(t));
 return fade(o,ball(P.bx,y,{r:13})+vArrow(P.bx,y,vAt(t),{g:va})+(aa?aArrow(P.bx,y,{g:aa,ringG}):''));
}
// ---- v-t グラフ -----------------------------------------------------------------------------------
function vt({g=1}={}){
 const A=axes({x:690,y:470,w:400,h:330,xmin:0,xmax:6.6,ymin:-35,ymax:35,xlabel:'t [s]',ylabel:'',xticks:[1,2,3,4,5,6],yticks:[-30,-20,-10,10,20,30],grid:true,g,xcolor:C.t,ycolor:C.v});
 A.svg+=fade(g,label('速度 v [m/s]',706,128,{size:24,color:C.v}));
 return A;
}
const vLine=(A,{p=1,color=C.v,w=4}={})=>A.plot(vAt,{from:0,to:6,p,color,w,steps:2});
const T=(src,x,y,o={})=>tex(src,x,y,{size:40,...o});
const half='\\tfrac12';
const dim=(o,s)=>fade(o,s);

export const qxHsMFreefall2Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約3秒＋静止）=================
 // 地面・物差し（0〜50 m、上向きに y）。手がボールを真上に投げ上げ、手を離れた瞬間で「映像を一時停止」。
 // 紫の初速度の矢印「30 m/s」は、この瞬間の値。右に v-t グラフの軸だけ。
 // 出さないもの：ボールの動き（離れた後）・赤の加速度の矢印・最高点・グラフの直線。
 [K+'q0']:(p)=>{
  const u=seg(p,.15,.8),x=mix(P.bx-110,P.bx,u),y=mix(P.y0+6,P.y0,u),rel=seg(p,.8,.86);
  let s=base()+vt().svg;
  s+=palm(x,y,1-seg(p,.86,1)*.3)+ball(x,y,{r:13});
  s+=vArrow(P.bx,P.y0,V0,{g:rel,lab:'30 m/s'});
  s+=fade(rel,label('投げた 瞬間の 値',P.bx-46,Ym(17),{size:22,color:C.dim,anchor:'end'}));
  s+=pauseBadge({g:rel,x:250});
  return s;
 },
 // ================= S1 小問1 =================
 // 1. 出題中の図を再生して静止。前提タグ、g＝10 m/s²
 [K+'setup']:(p,ctx)=>{
  const pp=clamp(cueT(ctx)/3);
  let s=qxHsMFreefall2Diagrams[K+'q0'](pp);
  s+=kindTag('前提',860,40,{text:'空気抵抗なし',g:seg(p,.55,.65)});
  s+=fade(seg(p,.7,.8),tex(Gt+'=10\\ \\mathrm{m/s^2}',1110,36,{size:30,auto:false}));
  return s;
 },
 // 2. 求めるもの：最高点の速度と加速度。物差しの上のほうに「最高点？」の点線
 [K+'goal1']:(p)=>{
  let s=qxHsMFreefall2Diagrams[K+'q0'](1);
  s+=fade(seg(p,.3,.45),line(P.bx-60,Ym(42),P.rx-12,Ym(42),{color:C.hi,w:2.5,dash:'8 8'})+label('最高点？',P.bx-70,Ym(42)+9,{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 上向き正。ボールを上げ下ろし（ここで初めて動かす）。紫の速度は上りで短く→最高点で消え→下りで下向きに長く。赤の加速度はずっと下向き。
 [K+'accel']:(p,ctx)=>{
  const t=clamp(cueT(ctx)-.3,0,6),W=sentWin(ctx),b=W[1]?W[1][0]:.3;
  let s=base({dirHl:seg(p,.03,.1)*(1-seg(p,b,b+.05))});
  s+=flying(t,{aa:seg(p,b,b+.06)});
  s+=fade(seg(p,b+.1,b+.2),label('上りでも 下りでも 下向き',P.rx+60,Ym(46),{size:26,color:C.a,weight:700}));
  s+=card(700,200,440,120,tex('a=-10\\ \\mathrm{m/s^2}',920,262,{size:46}),seg(p,b+.35,b+.45),C.a);
  s+=fade(seg(p,.02,.1),label('紫：速度　赤：加速度',920,380,{size:24,color:C.dim,anchor:'middle'}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 第1式 → v＝30−10t。グラフに 30 から −30 の直線。30、20、10、0。t＝3 の交点を黄
 [K+'vt']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,A=vt();
  let s=card(40,110,560,200,'',1,C.faint);
  s+=label('第1式',70,150,{size:24,color:C.dim});
  s+=T('v=v_0+at',320,180,{size:40});
  s+=fade(seg(p,.2,.3),T('v=30-10t',320,262,{size:46}));
  s+=A.svg+vLine(A,{p:lin(p,b,b+.35)});
  [30,20,10,0].forEach((v,i)=>{const g=seg(p,b+.1+i*.08,b+.16+i*.08);
   s+=fade(g,dot(A.X(i),A.Y(v),7,i===3?C.hi:C.v)+label(String(v),A.X(i)+(i===3?0:12),A.Y(v)+(i===3?-16:-12),{size:24,color:i===3?C.hi:C.v,anchor:i===3?'middle':'start',weight:700}));});
  s+=fade(seg(p,b+.4,b+.5),ring(A.X(3),A.Y(0),16,{color:C.hi,w:3})+label('3 s 後に 0',A.X(3)-14,A.Y(0)+72,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,b+.1,b+.2),label('毎秒 −10',360,370,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 5. 直線は t＝3 で折れずに突き抜ける（黄でなぞる）。ボールが最高点に来た所で映像を一時停止：紫は消え、赤だけ残る
 [K+'through']:(p,ctx)=>{
  const A=vt(),t=clamp(cueT(ctx)-.6,0,3),top=t>=3?1:0,tr=seg(p,.05,.4);
  let s=base({g:seg(p,0,.08),dir:0});
  s+=fade(seg(p,0,.08),flying(t,{ringG:top*seg(p,.55,.65)}));
  s+=A.svg+vLine(A)+fade(tr,vLine(A,{p:tr,color:C.hi,w:7}));
  s+=dot(A.X(t),A.Y(vAt(t)),8,C.ink);
  s+=fade(seg(p,.2,.3),ring(A.X(3),A.Y(0),16,{color:C.hi,w:3})+label('折れずに 突き抜ける',A.X(3)-14,A.Y(0)+72,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=pauseBadge({g:top*seg(p,.45,.55),x:250});
  s+=fade(top*seg(p,.55,.65),label('速度 0',P.bx-50,Ym(45)+9,{size:26,color:C.v,anchor:'end',weight:700})+label('加速度は 残る',P.bx-50,Ym(45)+44,{size:24,color:C.a,anchor:'end',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 6. 加速度も 0 なら止まり続ける（点線の想像図に赤の×）。小問1 の答え C
 [K+'ans1']:(p,ctx)=>{
  const A=vt(),W=sentWin(ctx),b=W[1]?W[1][0]:.6,y=Ym(45),gx=P.bx+262;
  let s=base({dir:0})+flying(3,{ringG:1})+A.svg+vLine(A)+ring(A.X(3),A.Y(0),16,{color:C.hi,w:3});
  s+=pauseBadge({x:250});
  const gh=seg(p,.05,.15);
  s+=fade(gh*(1-seg(p,b-.02,b+.04)*.6),ring(gx,y,13,{color:C.dim,w:2,dash:'4 4'})+ring(gx,y+70,13,{color:C.dim,w:2,dash:'4 4'})+line(gx,y+16,gx,y+54,{color:C.dim,w:2,dash:'4 4'})
   +label('a も 0 なら',gx,y+120,{size:22,color:C.dim,anchor:'middle'})+label('止まり 続ける？',gx,y+148,{size:22,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,b-.12,b-.04),label('×',gx,y+90,{size:72,color:'#ff6b6b',anchor:'middle',weight:700}));
  s+=goalTag(G1)+A1(seg(p,b+.12,b+.2));
  return s;
 },
 // 7. 誤答 A・B・D を1枚ずつ（読点の句ごと）
 [K+'wrong1']:(p,ctx)=>{
  const A=vt();
  let s=dim(.25,base({dir:0})+flying(3)+A.svg+vLine(A));
  s+=wrongSeq(p,ctx,[['A','0・0','止まって 見えても a は −10'],['B','0・＋10','上向き 正で a は 負'],['D','−10・0','速度と 加速度を 入れ替えた']],{win:partWin(ctx,[[0],[1],[2]]),opts:{x:200,w:800,y:200,size:30,whySize:26}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2 =================
 // 8. 求めるもの：最高点の高さ。物差しに「？ m」
 [K+'goal2']:(p)=>{
  const A=vt();
  let s=base()+fade(.6,ball(P.bx,Ym(45),{r:13}))+line(P.bx+20,Ym(45),P.rx-12,Ym(45),{color:C.dim,w:2,dash:'6 6'});
  s+=fade(seg(p,.3,.45),label('？ m',P.rx+60,Ym(45)+10,{size:32,color:C.hi,weight:700}));
  s+=A.svg+vLine(A);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9. 最高点は 3 s 後 → 第2式に t＝3。y＝30×3−½×10×3² → 90−45＝45 m。物差しの 45 m に黄の印
 [K+'height']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=base({hiR:seg(p,b+.3,b+.4)>.5?45:-1,hiLab:'45 m',dir:0})+fade(.6,ball(P.bx,Ym(45),{r:13}));
  s+=card(600,100,580,320,'',1,C.faint);
  s+=label('第2式',630,140,{size:24,color:C.dim});
  s+=T(Yt+'=v_0t+'+half+'at^2',890,170,{size:38});
  s+=fade(seg(p,.25,.35),label('t ＝ 3 s',1150,140,{size:26,color:C.t,anchor:'end',weight:700}));
  s+=fade(seg(p,b*.55,b*.55+.08),T(Yt+'=30\\times 3',800,255,{size:38,anchor:'middle'}));
  s+=fade(seg(p,b*.8,b*.8+.08),T('-'+half+'\\times 10\\times 3^2',1010,255,{size:38}));
  s+=fade(seg(p,b+.05,b+.15),T('=90-45',890,325,{size:40}));
  s+=fade(seg(p,b+.25,b+.35),T('=45\\ \\mathrm{m}',890,390,{size:44,color:C.x,auto:false}));
  s+=goalTag(G2);
  return s;
 },
 // 10. v-t グラフの 0〜3 s の三角形（水色）「45」。½×3×30＝45。小問2 の答え D
 [K+'tri']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7,A=vt();
  let s=A.svg;
  s+=fade(seg(p,.08,.2),poly([[A.X(0),A.Y(0)],[A.X(3),A.Y(0)],[A.X(0),A.Y(30)]],{fill:C.x,fo:.35,stroke:C.x,sw:2})+label('45',A.X(.9),A.Y(9)+10,{size:34,color:C.x,anchor:'middle',weight:700}));
  s+=vLine(A);
  s+=card(40,140,560,130,T(half+'\\times 3\\times 30=45\\ \\mathrm{m}',320,212,{size:44}),seg(p,.3,.42),C.x);
  s+=fade(seg(p,.3,.42),label('三角形の 面積 ＝ 上がった 高さ',320,320,{size:26,color:C.ink,anchor:'middle'}));
  s+=goalTag(G2)+A2(seg(p,b+.12,b+.2));
  return s;
 },
 // 11. 誤答 A（90 m）：高さ 30 の長方形を重ね、はみ出しを赤
 [K+'wrongA']:(p,ctx)=>{
  const A=vt();
  let s=A.svg+poly([[A.X(0),A.Y(0)],[A.X(3),A.Y(0)],[A.X(0),A.Y(30)]],{fill:C.x,fo:.35,stroke:C.x,sw:2})+vLine(A);
  const r=seg(p,.05,.15),tri=seg(p,.18,.28);
  s+=fade(r,rect(A.X(0),A.Y(30),A.X(3)-A.X(0),A.Y(0)-A.Y(30),{fill:'none',fo:0,stroke:C.dim,sw:3,rx:0}));
  s+=fade(tri,poly([[A.X(0),A.Y(30)],[A.X(3),A.Y(30)],[A.X(3),A.Y(0)]],{fill:'#ff6b6b',fo:.4,stroke:'#ff6b6b',sw:2}));
  s+=wrongCard('A','90 m',['速さ 30 の まま ／ 2 を 落とした'],{x:30,w:590,y:150,mid:'30\\times 3=90,\\quad 30^2\\div 10=90',midSize:30,g:seg(p,.03,.08)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 B（135 m）、誤答 C（75 m）を1枚ずつ
 [K+'wrongBC']:(p,ctx)=>{
  const A=vt();
  let s=A.svg+poly([[A.X(0),A.Y(0)],[A.X(3),A.Y(0)],[A.X(0),A.Y(30)]],{fill:C.x,fo:.35,stroke:C.x,sw:2})+vLine(A);
  s+=wrongSeq(p,ctx,[['B','135 m','90＋45（a を ＋10）',{mid:'30\\times 3+\\tfrac12\\times 10\\times 3^2'}],['C','75 m','90−5×3（t² を t に）',{mid:'30\\times 3-\\tfrac12\\times 10\\times 3'}]],{win:partWin(ctx,[[0],[1]]),opts:{x:30,w:590,y:150,midSize:30}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3 =================
 // 13. 求めるもの：5 s 後の速度。グラフの t＝5 に金の縦線
 [K+'goal3']:(p)=>{
  const A=vt();
  let s=base({dir:1});
  s+=A.svg+vLine(A);
  s+=fade(seg(p,.3,.45),line(A.X(5),A.Y(35),A.X(5),A.Y(-35),{color:C.t,w:4})+label('t ＝ 5 s',A.X(5)+10,A.Y(30),{size:26,color:C.t,weight:700}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. 第1式に t＝5：v＝30−10×5＝−20。t＝5 の点「−20」を黄。小問3 の答え B
 [K+'v5']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7,A=vt();
  let s=dim(1-seg(p,0,.1),base());
  s+=A.svg+vLine(A)+line(A.X(5),A.Y(35),A.X(5),A.Y(-35),{color:C.t,w:4});
  s+=card(40,120,560,240,'',seg(p,.05,.15),C.faint);
  s+=fade(seg(p,.05,.15),label('第1式（速度の 式）',70,160,{size:24,color:C.dim})+T('v=30-10t',320,215,{size:40}));
  s+=fade(seg(p,.25,.35),T('v=30-10\\times 5',320,280,{size:40}));
  s+=fade(seg(p,.45,.55),T('=-20\\ \\mathrm{m/s}',360,335,{size:42,color:C.hi,auto:false}));
  s+=fade(seg(p,.45,.55),dot(A.X(5),A.Y(-20),9,C.hi)+label('−20',A.X(5)+16,A.Y(-20)+8,{size:28,color:C.hi,weight:700}));
  s+=goalTag(G3)+A3(seg(p,b+.12,b+.2));
  return s;
 },
 // 15. マイナス＝下向きに動いている。最高点を過ぎて 2 s 落ちてきた（物差しのボールに紫の下向きの矢印「20」）
 [K+'minus']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,A=vt(),y5=Ym(25);
  let s=base();
  s+=fade(seg(p,b,b+.08),ball(P.bx,Ym(45),{r:13,o:.35})+line(P.bx,Ym(45)+16,P.bx,y5-16,{color:C.dim,w:2,dash:'5 6'})+label('2 s',P.bx+22,Ym(35)+8,{size:26,color:C.t,weight:700})+label('最高点',P.bx-26,Ym(45)+9,{size:22,color:C.dim,anchor:'end'}));
  s+=ball(P.bx,y5,{r:13})+vArrow(P.bx,y5,-20,{g:seg(p,.05,.15),lab:'20'});
  s+=fade(seg(p,.1,.2),label('下向きに 動いている',P.bx-50,y5+110,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.03,.1),label('5 s 後',P.bx+22,y5+8,{size:24,color:C.t,weight:700}));
  s+=A.svg+vLine(A)+dot(A.X(5),A.Y(-20),9,C.hi)+label('−20',A.X(5)+16,A.Y(-20)+8,{size:28,color:C.hi,weight:700});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 16. 誤答 A（＋20）・C（−50）・D（＋5）を1枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  const A=vt();
  let s=A.svg+vLine(A)+dot(A.X(5),A.Y(-20),9,C.hi)+label('−20',A.X(5)+16,A.Y(-20)+8,{size:28,color:C.hi,weight:700});
  s+=wrongSeq(p,ctx,[['A','＋20 m/s','下向きの マイナスを 落とした'],['C','−50 m/s','30 を 足し忘れた',{mid:'-10\\times 5=-50'}],['D','＋5 m/s','½ は 位置の 式だけに 付く',{mid:'30-\\tfrac12\\times 10\\times 5=5'}]],{win:partWin(ctx,[[0],[1],[2]]),opts:{x:30,w:590,y:150,midSize:30}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 17. 1 s 後と 5 s 後：グラフの 2 点を結ぶ。物差しの 25 m に横線、上向き 20 と下向き 20 の紫の矢印を並べる
 [K+'sym']:(p,ctx)=>{
  const w=partWin(ctx,[[0,1],[2],[3]]),A=vt(),y=Ym(25);
  const g1=seg(p,w[0][0]+.02,w[0][0]+.1),g2=seg(p,w[1][0],w[1][0]+.08),g3=seg(p,w[2][0],w[2][0]+.08);
  let s=base({dir:0});
  s+=A.svg+vLine(A);
  s+=fade(g1,dot(A.X(1),A.Y(20),9,C.hi)+dot(A.X(5),A.Y(-20),9,C.hi)+line(A.X(1),A.Y(20),A.X(5),A.Y(-20),{color:C.hi,w:3,dash:'8 7'})
   +label('1 s 後',A.X(1)+14,A.Y(20)-14,{size:24,color:C.hi,weight:700})+label('5 s 後',A.X(5)-14,A.Y(-20)+36,{size:24,color:C.hi,anchor:'end',weight:700})
   +ring(A.X(3),A.Y(0),12,{color:C.dim,w:2}));
  s+=fade(g2,line(140,y,P.rx+10,y,{color:C.hi,w:3,dash:'8 6'})+label('25 m',P.rx+60,y+9,{size:28,color:C.hi,weight:700}));
  const xL=P.bx-120,xR=P.bx-20;
  s+=fade(g2,ball(xL,y,{r:13})+ball(xR,y,{r:13})+label('1 s 後',xL,y+50,{size:22,color:C.t,anchor:'middle',weight:700})+label('5 s 後',xR,y+50,{size:22,color:C.t,anchor:'middle',weight:700}));
  s+=fade(g3,arrow(xL-36,y-16,xL-36,y-16-P.vk*20,{color:C.v,w:5,head:14})+label('＋20',xL-46,y-50,{size:24,color:C.v,anchor:'end',weight:700})
   +arrow(xR+42,y+16,xR+42,y+16+P.vk*20,{color:C.v,w:5,head:14})+label('−20',xR+54,y+60,{size:24,color:C.v,weight:700}));
  return s;
 },
 // 18. 最高点の静止画。赤の矢印を黄で囲む
 [K+'sum']:(p)=>{
  let s=base({dir:0})+flying(3,{ringG:seg(p,.1,.25)});
  s+=pauseBadge({x:250});
  s+=fade(seg(p,.05,.15),label('速度 0',P.bx-50,Ym(45)+9,{size:26,color:C.v,anchor:'end',weight:700}));
  s+=card(640,170,520,110,label('最高点で 0 ＝ 速度 だけ',900,238,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.1,.22),C.v);
  s+=card(640,310,520,110,label('加速度 ＝ ずっと 下向きに g',900,378,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.45,.57),C.hi);
  return s;
 },
};
