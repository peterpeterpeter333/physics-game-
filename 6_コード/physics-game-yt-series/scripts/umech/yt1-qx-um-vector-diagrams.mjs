// 問題編 解説「だ円を回る小球」（q-um-vector、大学編 05 ベクトル・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/05_ベクトル.md の q-um-vector（解説 18 行、行8 を 2 cue に分割）。
// 画面の配置（正本どおり）：左〜中央にだ円の図（真上から）、右に式と札。小問3 とまとめは左に円、右にだ円。札の帯（y＜78）には図を描かない。
// 色：位置 𝐫 水色、速度 𝐯 紫、加速度 𝐚 赤、強調 黄、連鎖律の外側 緑、誤り 赤。
// 縮尺（図のために決めた）：1 m＝85 px、速度 1 m/s＝22 px、加速度 1 m/s²＝18 px。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,pauseBadge,note,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-um-vector:';
const CX=C.x,CV=C.v,CA=C.a,CH=C.hi,CG=C.F,CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}${s}}`;
const bR=cc(CX,'\\mathbf{r}'),bV=cc(CV,'\\mathbf{v}'),bA=cc(CA,'\\mathbf{a}'),tt=cc(C.t,'t');
const PX=640,PW=540,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='t＝π/4 の 𝐯 と速さ',G2='t＝π/4 の 𝐚',G3='正しい説明';
const ANS1=g=>answerTag(1,'B','(−6, 0, 0) m/s、6 m/s',{g}),ANS2=g=>answerTag(2,'D','(0, −4, 0) m/s²',{g}),ANS3=g=>answerTag(3,'A','',{g});
const Q=Math.PI/4;
const VS=22,AS=18;

// ---- だ円（真上から）----
function E({cx=300,cy=300,k=85}={}){
 const S=(x,y)=>[cx+k*x,cy-k*y];
 const pos=t=>[3*Math.cos(2*t),Math.sin(2*t)],vel=t=>[-6*Math.sin(2*t),2*Math.cos(2*t)],acc=t=>[-12*Math.cos(2*t),-4*Math.sin(2*t)];
 return {S,pos,vel,acc,cx,cy,k};
}
const EL=E();
function ellBase(G=EL,{g=1,axes=1,ticks=1,fixed=0,path=1}={}){
 const {S,k}=G;let s='';
 if(axes){const a=S(-3.4,0),b=S(3.5,0),c=S(0,-1.3),d=S(0,1.45);
  s+=arrow(a[0],a[1],b[0],b[1],{color:C.dim,w:2.5,head:13})+arrow(c[0],c[1],d[0],d[1],{color:C.dim,w:2.5,head:13});
  s+=label('x',b[0]+8,b[1]+8,{size:24,color:C.dim})+label('y',d[0]+12,d[1]+8,{size:24,color:C.dim});}
 if(ticks){for(const x of [-3,3]){const p=S(x,0);s+=line(p[0],p[1]-6,p[0],p[1]+6,{color:C.dim})+label(String(x).replace('-','−'),p[0]+(x>0?20:-20),p[1]+30,{size:22,color:C.dim,anchor:'middle'});}
  for(const y of [-1,1]){const p=S(0,y);s+=line(p[0]-6,p[1],p[0]+6,p[1],{color:C.dim})+label(String(y).replace('-','−'),p[0]-22,p[1]+(y>0?30:-10),{size:22,color:C.dim,anchor:'end'});}}
 if(path)s+=fade(path,draw(Array.from({length:121},(_,i)=>S(3*Math.cos(2*Math.PI*i/120),Math.sin(2*Math.PI*i/120))),1,{color:C.faint,w:4}));
 if(fixed){const p=S(-3.3,-1.25);s+=fade(fixed,rect(p[0]-6,p[1]-4,150,36,{fill:C.dim,fo:.12,stroke:C.dim,sw:2,rx:16})+label('座標軸は 固定',p[0]+69,p[1]+21,{size:22,color:C.dim,anchor:'middle',weight:700}));}
 return fade(g,s);
}
function ball(G,t,{g=1,r=0,v=0,a=0,vLab='',aLab='',rLab=1,vScale=VS}={}){
 const {S,pos,vel,acc}=G,P=S(...pos(t)),O=S(0,0);let s='';
 if(r)s+=fade(r,arrow(O[0],O[1],P[0],P[1],{color:CX,w:4,head:15})+(rLab?T(bR,(O[0]+P[0])/2+16,(O[1]+P[1])/2-6,28,{anchor:'start'}):''));
 if(a){const A=acc(t);s+=fade(a,arrow(P[0],P[1],P[0]+AS*A[0],P[1]-AS*A[1],{color:CA,w:6,head:18})+(aLab?label(aLab,P[0]+AS*A[0]+12,P[1]-AS*A[1]+4,{size:24,color:CA,weight:700}):''));}
 if(v){const V=vel(t);s+=fade(v,arrow(P[0],P[1],P[0]+vScale*V[0],P[1]-vScale*V[1],{color:CV,w:6,head:18})+(vLab?label(vLab,P[0]+vScale*V[0]/2,P[1]-vScale*V[1]/2-16,{size:24,color:CV,anchor:'middle',weight:700}):''));}
 s+=ring(P[0],P[1],14,{color:C.ink,w:3,fill:'#2a3346'});
 return fade(g,s);
}
// 円（小問3・まとめ）：半径 R m、ω＝2 rad/s（比べるための図）
function circ(cx,cy,R,th,{g=1,arrows=1,k=110}={}){
 const P=[cx+k*R*Math.cos(th),cy-k*R*Math.sin(th)];let s='';
 s+=ring(cx,cy,k*R,{color:C.faint,w:4})+dot(cx,cy,5,C.dim);
 if(arrows){s+=arrow(cx,cy,P[0],P[1],{color:CX,w:4,head:14});
  const vx=-Math.sin(th),vy=Math.cos(th);s+=arrow(P[0],P[1],P[0]+70*vx,P[1]-70*vy,{color:CV,w:5,head:16});
  s+=arrow(P[0],P[1],P[0]-(P[0]-cx)*.55,P[1]-(P[1]-cy)*.55,{color:CA,w:5,head:16});}
 s+=ring(P[0],P[1],12,{color:C.ink,w:3,fill:'#2a3346'});
 return fade(g,s);
}
// 速さのメーター（0〜7 m/s、2 と 6 に目盛り）
function meter(x,y,w,sp,{g=1,stopLab=''}={}){
 const X=u=>x+w*u/7;let s=rect(x,y-14,w,28,{fill:'#131f38',fo:1,stroke:C.dim,sw:2,rx:8});
 for(const u of [0,2,4,6])s+=line(X(u),y+14,X(u),y+24,{color:C.dim,w:2})+label(String(u),X(u),y+48,{size:22,color:C.dim,anchor:'middle'});
 s+=rect(X(2),y-14,X(6)-X(2),28,{fill:CV,fo:.15,stroke:'none',rx:4});
 s+=rect(x,y-10,X(sp)-x,20,{fill:CV,fo:.8,stroke:'none',rx:4})+line(X(sp),y-24,X(sp),y+24,{color:C.ink,w:4});
 s+=label('速さ',x-14,y+8,{size:24,color:CV,anchor:'end',weight:700})+label(`${sp.toFixed(1)} m/s`,X(sp),y-32,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=label('m/s',x+w+12,y+48,{size:22,color:C.dim});
 if(stopLab)s+=label(stopLab,X(sp),y+80,{size:22,color:CH,anchor:'middle',weight:700});
 return fade(g,s);
}
const speedAt=t=>Math.hypot(-6*Math.sin(2*t),2*Math.cos(2*t));
const eqPanel=(y,h,rows,g=1,stroke=C.faint)=>panel(y,h,rows.map(([s,yy,size,o])=>fade(o??1,T(s,PC,yy,size??36))).join(''),g,stroke);
const R0=`${bR}=(3\\cos 2${tt},\\ \\sin 2${tt},\\ 0)`;
const V0=`${bV}=(-6\\sin 2${tt},\\ 2\\cos 2${tt},\\ 0)`;

export const ytQxUmVectorDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約3秒）：だ円の道と座標軸 → t＝π/4 の小球（上端）→ 位置の矢印 𝐫。小球は回さない。𝐯・𝐚・速さのメーターは出さない。
 [K+'q1']:(p)=>{
  const G=E({cx:600,cy:290,k:110});
  let s=ellBase(G,{g:seg(p,0,.15),path:seg(p,.05,.4)});
  s+=fade(seg(p,.4,.55),ball(G,Q,{r:seg(p,.6,.85)})+label('t ＝ π/4 s の 瞬間',G.S(0,1)[0]+40,G.S(0,1)[1]-24,{size:24,color:C.t,weight:700}));
  return s;
 },

 // ===================== 問題の設定 =====================
 [K+'setup']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=ellBase(EL,{fixed:seg(p,b,b+.08)})+ball(EL,Q,{r:1});
  s+=panel(110,230,label('位置',PC,160,{size:26,color:C.dim,anchor:'middle'})+T(R0,PC,230,34)
   +fade(seg(p,.25,.4),label('横 3、縦 1 の だ円',PC,300,{size:28,color:CH,anchor:'middle',weight:700})),1,CX);
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=ellBase(EL,{fixed:1})+ball(EL,Q,{r:1});
  s+=panel(110,300,label('t ＝ π/4 の 速度 と 速さ',PC,160,{size:28,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),line(PX+30,195,PX+PW-30,195,{color:C.faint,w:2})+label('矢印の 微分 ＝ 成分ごとの 微分',PC,245,{size:26,color:C.ink,anchor:'middle'})
    +T(`${bV}=\\dfrac{d${bR}}{d${tt}}=\\left(\\dfrac{dx}{d${tt}},\\,\\dfrac{dy}{d${tt}},\\,\\dfrac{dz}{d${tt}}\\right)`,PC,340,30)),1,CH);
  s+=goalTag(G1,{g:seg(p,.02,.12)});
  return s;
 },
 // 3. x 成分：中身 2t に黄の枠。内側 ×2（黄）、外側 3 cos u → −3 sin u（緑）→ −6 sin 2t
 [K+'dx']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1];
  let s=card(40,100,1120,400,'',1);
  s+=label('x 成分',140,160,{size:28,color:C.dim,anchor:'middle',weight:700});
  s+=T(`x=3\\cos(\\,{\\color{${CH}}\\boxed{2${tt}}}\\,)`,600,170,46);
  s+=fade(seg(p,.25,.4),card(120,230,420,140,label('外側（cos の 微分）',330,270,{size:24,color:CG,anchor:'middle',weight:700})+T(`3\\cos u\\ \\to\\ -3\\sin u`,330,330,34,{color:CG}),1,CG));
  s+=fade(seg(p,.45,.6),card(660,230,420,140,label('内側（中身の 倍率）',870,270,{size:24,color:CH,anchor:'middle',weight:700})+T(`u=2${tt}\\ \\to\\ \\times 2`,870,330,34,{color:CH}),1,CH));
  s+=fade(seg(p,.6,.66),label('×',600,315,{size:44,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,e*.85,e*.95),T(`\\dfrac{dx}{d${tt}}=-3\\sin 2${tt}\\times 2={\\color{${CV}}-6\\sin 2${tt}}`,600,445,40));
  s+=goalTag(G1);
  return s;
 },
 // 4. y 成分：sin 2t → 2 cos 2t。𝐯＝(−6 sin 2t, 2 cos 2t, 0)
 [K+'dy']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=card(40,100,1120,400,'',1);
  s+=label('x 成分',140,160,{size:26,color:C.dim,anchor:'middle'})+T(`\\dfrac{dx}{d${tt}}=-6\\sin 2${tt}`,600,160,36,{opacity:.7});
  s+=label('y 成分',140,255,{size:28,color:C.dim,anchor:'middle',weight:700})+fade(seg(p,.05,.2),T(`\\dfrac{dy}{d${tt}}=\\dfrac{d}{d${tt}}\\sin 2${tt}=2\\cos 2${tt}`,600,255,38));
  s+=fade(seg(p,b,b+.1),line(100,320,1100,320,{color:C.faint,w:2})+T(V0,600,410,46));
  s+=goalTag(G1);
  return s;
 },
 // 5. t＝π/4：2t＝π/2、𝐯＝(−6, 0, 0)、速さ 6 m/s。上端で左向きの紫の矢印、接線（灰の点線）。答えの札 B
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7,{S}=EL,top=S(0,1);
  let s=ellBase(EL)+fade(seg(p,.35,.45),line(top[0]-220,top[1],top[0]+220,top[1],{color:C.dim,w:2,dash:'8 7'})+label('接線',top[0]+228,top[1]+8,{size:22,color:C.dim}));
  s+=ball(EL,Q,{v:seg(p,.3,.45),vLab:'6 m/s'});
  s+=eqPanel(90,330,[[`2${tt}=\\dfrac{\\pi}{2}:\\ \\sin=1,\\ \\cos=0`,150,32,seg(p,.03,.12)],[`${bV}=(-6,\\,0,\\,0)\\ \\mathrm{m/s}`,240,38,seg(p,.15,.25)],
   [`|${bV}|=6\\ \\mathrm{m/s}`,320,38,seg(p,.3,.4)]],1,CV);
  s+=goalTag(G1)+ANS1(seg(p,b+.12,b+.2));
  return s;
 },
 // 6. 誤答 A → C → D（A の間、t＝0 の速度を右端に小さく）
 [K+'wrong1']:(p,ctx)=>{
  const ve=.85,w1=[0,ve/3],w2=[ve/3,2*ve/3],w3=[2*ve/3,1];
  const inA=seg(p,.01,.05)*(1-seg(p,w1[1]-.04,w1[1]));
  let s=ellBase(EL)+ball(EL,Q,{v:1,vLab:'6 m/s'});
  s+=fade(inA,ball(EL,0,{v:1,vLab:''})+label('t ＝ 0',EL.S(3,0)[0]-20,EL.S(3,0)[1]+40,{size:22,color:CV,anchor:'middle',weight:700}));
  s+=panel(90,100,T(`${bV}=(-6,\\,0,\\,0)\\ \\mathrm{m/s}`,PC,148,34),1,CV);
  s+=wrongSeq(p,ctx,[['A','(0, 2, 0) m/s','t ＝ 0 の 速度（2t ＝ 0 を 入れた）'],['C','(−3, 0, 0) m/s','中身の 倍率 2 を 掛け忘れた'],['D','(0, 1, 0)','その 瞬間の 位置 𝐫（単位は m）']],{win:[w1,w2,w3],opts:{...WOPT,y:220}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=ellBase(EL)+ball(EL,Q,{v:1,vLab:'6 m/s'});
  s+=panel(110,280,label('t ＝ π/4 の 加速度',PC,160,{size:28,color:CA,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),line(PX+30,195,PX+PW-30,195,{color:C.faint,w:2})+label('速度を もう一度 成分ごとに 微分',PC,245,{size:26,color:C.ink,anchor:'middle'})
    +T(`${bA}=\\dfrac{d${bV}}{d${tt}}`,PC,330,44)),1,CA);
  s+=goalTag(G2,{g:seg(p,.02,.12)});
  return s;
 },
 // 8a. 𝐚＝(−12 cos 2t, −4 sin 2t, 0)
 [K+'acc']:(p)=>{
  let s=card(40,100,1120,400,'',1);
  s+=T(V0,600,165,38,{opacity:.75});
  s+=fade(seg(p,.05,.15),label('x 成分',150,265,{size:26,color:C.dim,anchor:'middle',weight:700})+T(`-6\\sin 2${tt}\\ \\to\\ -12\\cos 2${tt}`,600,262,38));
  s+=fade(seg(p,.45,.55),label('y 成分',150,345,{size:26,color:C.dim,anchor:'middle',weight:700})+T(`2\\cos 2${tt}\\ \\to\\ -4\\sin 2${tt}`,600,342,38));
  s+=fade(seg(p,.7,.8),T(`${bA}=(-12\\cos 2${tt},\\ -4\\sin 2${tt},\\ 0)`,600,440,42));
  s+=goalTag(G2);
  return s;
 },
 // 8b. ＝−4(3 cos 2t, sin 2t, 0) → 括弧の中を 𝐫 に置き換え、𝐚＝−4𝐫。横に「4＝2²」
 [K+'acc2']:(p)=>{
  let s=card(40,100,1120,400,'',1);
  s+=T(`${bA}=(-12\\cos 2${tt},\\ -4\\sin 2${tt},\\ 0)`,600,165,38);
  s+=fade(seg(p,.05,.2),T(`=-4\\,{\\color{${CX}}\\boxed{(3\\cos 2${tt},\\ \\sin 2${tt},\\ 0)}}`,600,265,40));
  s+=fade(seg(p,.25,.35),label('＝ 位置 𝐫',960,270,{size:28,color:CX,weight:700}));
  s+=fade(seg(p,.45,.6),T(`${bA}=-4\\,${bR}`,600,400,58)+label('4 ＝ 2²',880,405,{size:30,color:CH,weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 9. 上端で下向き（中心向き）の赤い矢印「4 m/s²」。答えの札 D
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=ellBase(EL)+ball(EL,Q,{v:.4,a:seg(p,.2,.35),aLab:'4 m/s²'});
  s+=eqPanel(90,280,[[`${bA}=-4\\,${bR}`,150,36,1],[`=-4\\,(0,\\,1,\\,0)`,215,34,seg(p,.05,.15)],[`=(0,\\,-4,\\,0)\\ \\mathrm{m/s^2}`,290,38,seg(p,.15,.25)]],1,CA);
  s+=fade(seg(p,.4,.5),label('中心 向き',PC,345,{size:28,color:CA,anchor:'middle',weight:700}));
  s+=goalTag(G2)+ANS2(seg(p,b+.12,b+.2));
  return s;
 },
 // 10. 誤答 A → B。文2で「2回 微分 → 2² ＝ 4 倍」
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],b=W[1]?W[1][0]:.6,m=e*.5;
  let s=ellBase(EL)+ball(EL,Q,{v:.4,a:1,aLab:'4 m/s²'});
  s+=panel(90,110,label('2回 微分 → 2 × 2 ＝ 2² ＝ 4 倍',PC,155,{size:28,color:CH,anchor:'middle',weight:700}),seg(p,b,b+.08),CH);
  s+=wrongSeq(p,ctx,[['A','(0, −1, 0) m/s²','倍率 2 を 一度も 掛けていない'],['B','(0, −2, 0) m/s²','倍率 2 を 1回 だけ 掛けた']],{win:[[0,m],[m,1]],opts:{...WOPT,y:230}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 11. 誤答 C（(0, 0, 0)）。上端の前後で 𝐯 の矢印が回るアニメ
 [K+'wrong2c']:(p,ctx)=>{
  const t0=cueT(ctx),ph=(t0%3)/3,t=Q+.35*Math.sin(2*Math.PI*ph);
  let s=ellBase(EL)+ball(EL,t,{v:1,a:1});
  s+=fade(seg(p,.45,.55),label('速度の 向きは 変わり続ける',300,470,{size:26,color:CV,anchor:'middle',weight:700}));
  s+=wrongCard('C','(0, 0, 0) m/s²',['速さが 一瞬 変わらないので 𝐚 も 0 と した','（向きの 変化を 見落とした）'],{...WOPT,y:110,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 12. 左に円（𝐚＝−ω²𝐫）、右にだ円（𝐚＝−4𝐫）。文2で「同じ 形」
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,G=E({cx:820,cy:270,k:100});
  let s=circ(230,270,1,Math.PI/3,{k:120})+label('等速円運動（単元動画）',230,445,{size:24,color:C.dim,anchor:'middle'});
  s+=ellBase(G,{ticks:0})+ball(G,Q*.55,{r:1,a:1,rLab:0})+label('この だ円',820,445,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,b,b+.1),T(`${bA}=-\\omega^2${bR}`,230,495,36)+T(`${bA}=-4\\,${bR}`,820,495,36)+label('同じ 形',525,495,{size:28,color:CH,anchor:'middle',weight:700}));
  s+=goalTag(G3,{g:seg(p,.02,.12)});
  return s;
 },
 // 13. 速さの2乗。だ円を一周（実時間、周期 π s）、速さのメーター
 [K+'speed']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,t=cueT(ctx);
  let s=ellBase(EL)+ball(EL,t,{v:1});
  s+=panel(90,210,label('速さも 一定？',PC,140,{size:28,color:CV,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),T(`|${bV}|^2=36\\sin^2 2${tt}+4\\cos^2 2${tt}`,PC,225,32)),1,CV);
  s+=meter(PX+60,400,PW-110,speedAt(t),{g:seg(p,.05,.15)});
  s+=goalTag(G3);
  return s;
 },
 // 14. 右端（t＝0）の 2 m/s と、上端（t＝π/4）の 6 m/s を比べる
 [K+'compare']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=ellBase(EL)+ball(EL,0,{v:seg(p,b,b+.1),vLab:'2 m/s'})+ball(EL,Q,{v:seg(p,b+.2,b+.3),vLab:'6 m/s'});
  s+=fade(seg(p,b,b+.1),label('t ＝ 0',EL.S(3,0)[0]-20,EL.S(3,0)[1]+40,{size:22,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.2,b+.3),label('t ＝ π/4',EL.S(0,1)[0]+30,EL.S(0,1)[1]+40,{size:22,color:C.t,weight:700}));
  s+=panel(90,330,T(`|${bV}|^2=36\\sin^2 2${tt}+4\\cos^2 2${tt}`,PC,150,30)
   +fade(seg(p,.05,.15),label('係数 36 と 4 が 違う',PC,215,{size:26,color:CH,anchor:'middle',weight:700})+label('→ 一つの 数に まとまらない',PC,255,{size:26,color:CH,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.1),label('t ＝ 0：2 m/s',PC,320,{size:28,color:CV,anchor:'middle',weight:700}))
   +fade(seg(p,b+.2,b+.3),label('t ＝ π/4：6 m/s',PC,375,{size:28,color:CV,anchor:'middle',weight:700})),1,CV);
  s+=goalTag(G3);
  return s;
 },
 // 15. 一周：𝐚（赤）はいつも中心向き、メーターは動き続ける。答えの札 A
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,t=cueT(ctx);
  let s=ellBase(EL)+ball(EL,t,{v:1,a:1})+dot(EL.cx,EL.cy,6,CA);
  s+=panel(90,190,label('𝐚 は いつも 中心 向き',PC,150,{size:28,color:CA,anchor:'middle',weight:700})
   +label('でも 速さは 2〜6 m/s で 変わる',PC,215,{size:28,color:CV,anchor:'middle',weight:700}),1);
  s+=meter(PX+60,400,PW-110,speedAt(t));
  s+=goalTag(G3)+ANS3(seg(p,b+.15,b+.25));
  return s;
 },
 // 16. 誤答 B（速さ一定）→ C（d𝐯/dt＝0）。上端で映像を一時停止：メーターは最大で一瞬変化 0、赤い矢印は残る
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,inC=seg(p,b,b+.06);
  let s=ellBase(EL)+ball(EL,Q,{v:1,a:1,aLab:inC>.5?'|𝐚| ＝ 4 m/s²':''});
  s+=fade(inC,pauseBadge({x:300,y:86}));
  s+=meter(PX+60,420,PW-110,6)+fade(inC,label('上端で 速さの 変化は 一瞬 0',PC,500,{size:22,color:CH,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['B','速さ 一定',['円 だけで 成り立つ 性質','（この だ円では 2〜6 m/s）']],['C','d𝐯/dt ＝ 0',['速さの 変化 0 と 混同','（t ＝ π/4 で |𝐚| ＝ 4 m/s²）']]],{opts:{...WOPT,y:100}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 17. 誤答 D：t＝π/8 で映像を一時停止。𝐫 と 𝐯 の角（90° より大きい）を黄で。𝐫·𝐯＝−8
 [K+'wrong3d']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,t8=Math.PI/8,tr=cueT(ctx)-.6,t=Math.min(tr,t8),stop=tr>=t8?1:0;
  let s=ellBase(EL)+ball(EL,t,{r:1,v:1,rLab:1});
  if(stop){const P=EL.S(...EL.pos(t8)),r=EL.pos(t8),v=EL.vel(t8),a1=Math.atan2(r[1]*85,r[0]*85),a2=Math.atan2(v[1],v[0]),R=34;
   const pts=Array.from({length:25},(_,i)=>{const a=a1+Math.PI+(a2-a1-Math.PI)*i/24;return [P[0]+R*Math.cos(a),P[1]-R*Math.sin(a)];});
   s+=fade(seg(p,b,b+.08),draw(pts,1,{color:CH,w:4})+label('約 143°',P[0]+6,P[1]-48,{size:24,color:CH,weight:700}));
   s+=pauseBadge({x:300,y:86});}
  s+=fade(seg(p,b,b+.08),panel(90,130,label('t ＝ π/8',PC,130,{size:24,color:C.t,anchor:'middle',weight:700})+T(`${bR}\\cdot${bV}=-9+1=-8\\neq0`,PC,190,34),1,CH));
  s+=wrongCard('D','いつも 直角',['円 だけの 性質','（t ＝ π/8 で 𝐫·𝐯 ＝ −8）'],{...WOPT,y:250,g:seg(p,.03,.1)});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 18. 左に円、右にだ円。性質ごとに ✓ と ×
 [K+'sum']:(p)=>{
  const G=E({cx:860,cy:190,k:62});
  let s=circ(250,190,1,Math.PI/3,{k:80})+label('円',250,300,{size:26,color:C.dim,anchor:'middle',weight:700});
  s+=ellBase(G,{ticks:0,axes:0})+ball(G,Q*.55,{r:1,a:1,rLab:0})+label('だ円',860,300,{size:26,color:C.dim,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.15),T(`${bR}\\ \\to\\ ${bV}\\ \\to\\ ${bA}`,555,150,32)+label('成分ごとに 微分',555,200,{size:24,color:C.dim,anchor:'middle'}));
  const rows=[['𝐚 ＝ −ω²𝐫（中心 向き）',1,'',345],['速さ 一定',0,'2〜6 m/s',405],['𝐫 と 𝐯 が 直角',0,'t ＝ π/8 で 𝐫·𝐯 ＝ −8',465]];
  rows.forEach(([txt,ok,why,y],i)=>{const g=seg(p,.2+.12*i,.3+.12*i);
   s+=fade(g,label(txt,555,y,{size:26,color:C.ink,anchor:'middle',weight:700})+label('✓',250,y,{size:32,color:CG,anchor:'middle',weight:700})
    +label(ok?'✓':'×',860,y,{size:32,color:ok?CG:CD,anchor:'middle',weight:700})+(why?label(why,900,y,{size:22,color:C.dim}):''));});
  s+=answerRow([[1,'B',''],[2,'D','(0, −4, 0) m/s²'],[3,'A','']],{g:seg(p,.75,.85)});
  return s;
 },
};
