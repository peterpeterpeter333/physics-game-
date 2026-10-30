// 問題編 解説「ばねにつるした小さなおもり」（q-ui-function-rules、大学編 03 微分の法則・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/03_微分の法則.md の q-ui-function-rules（解説 18 行）。
// 画面：左におもり（ばね）と円、右に歯車と式。札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：位置 x 水色、速度 v 紫、加速度 a 赤、時刻 t 金、角振動数 ω 桃。内側の歯車（中身の倍率）黄、外側の歯車 緑（凡例を出す）。誤り 赤。
// おもりの動きは実時間（x＝0.2 sin 5t、ω＝5 rad/s、周期 2π/5≈1.26 s）。0.2 m＝110 px。速度 1.0 m/s＝90 px、加速度 2.5 m/s²＝70 px。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,pauseBadge,legend,note,cueT,tAt,durOf,sentWin,voiceEnd,isProblem} from './yt1-qx-common.mjs';

const K='qx-ui-function-rules:';
const CX=C.x,CV=C.v,CA=C.a,CT=C.t,CW=C.p,CIN=C.hi,COUT=C.F,CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const Xs=`{\\color{${CX}}x}`,Vs=`{\\color{${CV}}v}`,As=`{\\color{${CA}}a}`,Ts=`{\\color{${CT}}t}`,Us=`{\\color{${CIN}}u}`;
const XF=`${Xs}=0.2\\sin 5${Ts}`;
const G1='t＝0 の速度 v',G2='振幅 0.2 に 5 を掛ける理由',G3='x＝0.1 m での加速度 a';
const ANS1=g=>answerTag(1,'D','1.0 m/s',{g}),ANS2=g=>answerTag(2,'A','',{g}),ANS3=g=>answerTag(3,'B','−2.5 m/s²',{g});
const W5=5,PER=2*Math.PI/W5;
const U01=Math.PI/6;                 // x＝0.1 m（上向きに通る瞬間）
const RC=x0=>x0;
const LEG=(g=1)=>legend([['黄＝内側の倍率',CIN],['緑＝外側の倍率',COUT]],560,500,{g,dir:'row',size:22});
const WOPT={x:520,w:670,size:26,whySize:22,y:345};

// ---- おもり（ばね）と円 ------------------------------------------------------------------------
const O={sx:110,cy:290,rp:110,ccx:330};
function vspring(x,y1,y2,{coils=8,amp=14,color=C.dim}={}){
 const pts=[[x,y1],[x,y1+8]],L=y2-y1-16;
 for(let i=0;i<=coils*2;i++)pts.push([x+(i===0||i===coils*2?0:(i%2?amp:-amp)),y1+8+L*i/(coils*2)]);
 pts.push([x,y2]);return draw(pts,1,{color,w:3});
}
// u：円の点の角（u＝5t）。vel/acc/pos：矢印の濃さ。vLab/aLab/pLab：矢印の札。
function osc(u,{g=1,circle=1,vel=0,acc=0,pos=0,vLab='',aLab='',pLab='',ghostAcc=0,tan=0,rLab=1,plus=1,dimAll=0}={}){
 const {sx,cy,rp,ccx}=O,sn=Math.sin(u),cs=Math.cos(u),by=cy-rp*sn,px=ccx+rp*cs;
 let s='';
 s+=line(60,92,160,92,{color:C.dim,w:4});for(let q=64;q<160;q+=18)s+=line(q,92,q+10,82,{color:C.faint,w:2});
 s+=line(40,cy,470,cy,{color:C.faint,w:2,dash:'7 7'})+label('x＝0',452,cy+32,{size:24,color:C.dim});
 if(plus)s+=arrow(482,cy-14,482,cy-96,{color:C.dim,w:3,head:12})+label('＋',462,cy-74,{size:28,color:C.dim,anchor:'end',weight:700});
 s+=vspring(sx,92,by-20);
 if(circle){
  s+=line(ccx,cy-rp-14,ccx,cy+rp+14,{color:C.faint,w:2});
  s+=ring(ccx,cy,rp,{color:C.dim,w:3});
  s+=line(ccx,cy,px,by,{color:C.ink,w:3});
  if(rLab)s+=label('0.2',(ccx+px)/2+14*sn,(cy+by)/2+14*cs+8,{size:24,color:C.ink,anchor:'middle'});
  s+=line(px,by,sx+22,by,{color:C.faint,w:2,dash:'5 6'});
  s+=dot(ccx,by,8,CX)+dot(px,by,10,C.hi);
  if(tan){const L=90;s+=fade(tan,arrow(px,by,px-L*sn,by-L*cs,{color:CV,w:5,head:14}));}
 }
 s+=ring(sx,by,20,{color:CX,w:3,fill:'#123049'});
 if(pos){s+=fade(pos,arrow(sx-45,cy,sx-45,by,{color:CX,w:5,head:Math.min(16,Math.abs(by-cy)*.5)})+(pLab?label(pLab,18,cy+34,{size:24,color:CX,weight:700}):''));}
 if(vel){const L=90*cs;if(Math.abs(L)>6)s+=fade(vel,arrow(sx+38,by,sx+38,by-L,{color:CV,w:6,head:16})+(vLab?label(vLab,sx+50,by-L/2+8,{size:24,color:CV,weight:700}):''));}
 if(acc){const L=-140*sn;if(Math.abs(L)>6)s+=fade(acc,arrow(sx+38,by,sx+38,by-L,{color:CA,w:6,head:16})+(aLab?label(aLab,sx+50,by-L/2+8,{size:24,color:CA,weight:700}):''));}
 if(ghostAcc){const by2=cy-rp,L=-140,gx=sx+110;s+=fade(ghostAcc*.55,ring(gx,by2,20,{color:CX,w:2,dash:'5 5'})+arrow(gx+34,by2,gx+34,by2-L,{color:CA,w:5,head:14})+label('x＝0.2 なら',gx+46,by2+28,{size:22,color:CA}));}
 return fade(g,s);
}

// ---- 歯車 ----------------------------------------------------------------------------------------
function gear(cx,cy,r,teeth,ang,color,g=1){
 const pts=[];const N=teeth*4;
 for(let i=0;i<N;i++){const a=ang+i*2*Math.PI/N,rr=(i%4<2)?r:r*.8;pts.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)]);}
 return fade(g,poly(pts,{fill:color,fo:.22,stroke:color,sw:3})+ring(cx,cy,r*.28,{color,w:3,fill:C.bg})+line(cx,cy,cx+r*.62*Math.cos(ang),cy+r*.62*Math.sin(ang),{color,w:4}));
}
const badge=(x,y,text,color,g=1,w=170,glow=0)=>fade(g,rect(x-w/2,y-28,w,56,{fill:'#1a2440',fo:1,stroke:color,sw:2+3*glow,rx:12})+label(text,x,y+10,{size:28,color,anchor:'middle',weight:700}));
// 二段の歯車：t →［黄］→ u →［緑］→ x。b1/b2：倍率の札、h1/h2：歯車を外す（0〜1）、x2：二つの倍率の間の「×」
function gears({y=205,ang=0,b1=0,b2=0,t1='×5',t2='×0.2 cos u',f1='t → u＝5t',f2='u → 0.2 sin u',out='x',outColor=CX,h1=0,h2=0,glow1=0,glow2=0,mul=0,g=1}={}){
 const X1=700,X2=940,r=46;
 let s='';
 s+=label('t',610,y+11,{size:34,color:CT,anchor:'middle',weight:700})+arrow(628,y,X1-r-6,y,{color:C.dim,w:3,head:12});
 s+=fade(1-h1*.85,gear(X1,y,r,8,ang*1.0,CIN));
 s+=arrow(X1+r+6,y,800,y,{color:C.dim,w:3,head:12})+label('u',820,y+11,{size:34,color:CIN,anchor:'middle',weight:700})+arrow(840,y,X2-r-6,y,{color:C.dim,w:3,head:12});
 s+=fade(1-h2*.85,gear(X2,y,r,8,-ang*1.6,COUT));
 s+=arrow(X2+r+6,y,1050,y,{color:C.dim,w:3,head:12})+label(out,1070,y+11,{size:34,color:outColor,anchor:'start',weight:700});
 s+=fade(1-h1*.7,label(f1,X1,y+r+40,{size:24,color:CIN,anchor:'middle',weight:700}));
 s+=fade(1-h2*.7,label(f2,X2,y+r+40,{size:24,color:COUT,anchor:'middle',weight:700}));
 s+=badge(X1,y+r+90,t1,CIN,b1*(1-h1),150,glow1)+badge(X2,y+r+90,t2,COUT,b2*(1-h2),Math.max(170,t2.length*14+30),glow2);
 s+=fade(mul,label('×',(X1+X2)/2-12,y+r+100,{size:40,color:C.ink,anchor:'middle',weight:700}));
 if(h1)s+=fade(h1,line(X1-40,y-40,X1+40,y+40,{color:CD,w:5})+line(X1-40,y+40,X1+40,y-40,{color:CD,w:5}));
 if(h2)s+=fade(h2,line(X2-40,y-40,X2+40,y+40,{color:CD,w:5})+line(X2-40,y+40,X2+40,y-40,{color:CD,w:5}));
 return fade(g,s);
}
const gearAng=(t,a=0,b=1e9)=>-1.2*smooth(clamp((t-a)/1.6))+(t>b?0:0);

// ---- まとめのおもり（小さな図） -----------------------------------------------------------------
function miniBob(x,cy,dy,{arrowLen=0,color=CV,lab='',sub=''}={}){
 let s=line(x-60,cy,x+60,cy,{color:C.faint,w:2,dash:'6 6'})+ring(x,cy-dy,18,{color:CX,w:3,fill:'#123049'});
 if(arrowLen)s+=arrow(x+34,cy-dy,x+34,cy-dy-arrowLen,{color,w:5,head:14})+label(lab,x+46,cy-dy-arrowLen/2+8,{size:24,color,weight:700});
 if(sub)s+=label(sub,x,cy+60,{size:24,color:C.dim,anchor:'middle'});
 return s;
}

// 実時間の u（同じ場面で cue をまたぐ）
const uAt=(ctx,key)=>W5*tAt(ctx,key);

export const ytQxUiFunctionRulesDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約3.8秒）：おもりと円が実時間で 3 往復（u＝0→6π）。中心を上向きに通る瞬間で映像を一時停止。歯車は枠だけ（倍率は出さない）。
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx),u=W5*t;
  let s=osc(u,{rLab:1});
  s+=gears({ang:-u*.25,b1:0,b2:0});
  s+=note('半径 0.2 の円を回る点の影',330,470);
  s+=pauseBadge({g:seg(p,.97,1),x:330,y:92});
  return s;
 },
 // 小問3（約2.6秒）：おもりが x＝0.1 m を上向きに通る瞬間（u＝4π＋π/6）で映像を一時停止し、位置の矢印（水色）だけを描く。
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx),u=W5*t,stop=seg(p,.96,1);
  let s=osc(u,{rLab:1,pos:stop,pLab:stop>.5?'x＝0.1 m':''});
  s+=gears({ang:-u*.25,b1:0,b2:0});
  s+=note('半径 0.2 の円を回る点の影',330,470);
  s+=pauseBadge({g:stop,x:330,y:92});
  return s;
 },

 // ===================== 問題の設定 =====================
 // 1. 左におもりと円（実時間）、右に式 x＝0.2 sin 5t。
 [K+'setup']:(p,ctx)=>{
  const u=uAt(ctx,K+'setup');
  let s=osc(u);
  s+=card(540,110,640,170,label('おもりの 位置',860,155,{size:26,color:C.dim,anchor:'middle'})+T(XF,860,225,52),seg(p,.03,.12));
  s+=fade(seg(p,.5,.6),label('速度 v ＝ ？',700,360,{size:32,color:CV,anchor:'middle',weight:700})+label('加速度 a ＝ ？',1010,360,{size:32,color:CA,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.65),label('→ 微分で 求める',860,430,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },

 // ===================== 小問1 =====================
 // 2. 求めるもの。左は t＝0 の瞬間（中心を通る）で一時停止。右に v＝dx/dt。
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=osc(0)+pauseBadge({x:330,y:92,g:seg(p,.02,.1)})+label('t＝0',330,470,{size:28,color:CT,anchor:'middle',weight:700});
  s+=T(XF,860,140,44);
  s+=fade(seg(p,b,b+.1),T(`${Vs}=\\dfrac{d${Xs}}{d${Ts}}`,860,290,60)+label('位置の 傾き',860,400,{size:28,color:CV,anchor:'middle',weight:700}));
  s+=goalTag(G1,{g:seg(p,.02,.1)});
  return s;
 },
 // 3. 中身 5t に黄の枠と u。一段目の歯車（黄）に ×5、歯車が回る。
 [K+'inner']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,t=cueT(ctx),tb=b*(ctx?.dur??6);
  const w=texWidth(XF,40,false),x0=860-w/2,w5=texWidth(`5${Ts}`,40,false);
  let s=osc(0)+pauseBadge({x:330,y:92})+label('t＝0',330,470,{size:28,color:CT,anchor:'middle',weight:700});
  s+=T(XF,860,115,40);
  s+=highlight(x0+w-w5-8,85,w5+16,58,seg(p,.04,.14),CIN)+fade(seg(p,.08,.18),label('u',x0+w-w5/2,165,{size:28,color:CIN,anchor:'middle',weight:700}));
  s+=gears({y:225,ang:gearAng(t,tb),b1:seg(p,b+.25,b+.4),b2:0,g:seg(p,b-.05,b+.05),h2:0});
  s+=LEG(seg(p,b,b+.1));
  s+=goalTag(G1);
  return s;
 },
 // 4. 二段目の歯車（緑）に ×0.2 cos u。
 [K+'outer']:(p,ctx)=>{
  const t=cueT(ctx),W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=osc(0)+pauseBadge({x:330,y:92})+label('t＝0',330,470,{size:28,color:CT,anchor:'middle',weight:700});
  s+=T(XF,860,115,40);
  s+=gears({y:225,ang:-1.2-1.2*smooth(clamp(t/1.6)),b1:1,b2:seg(p,b+.1,b+.25),glow2:seg(p,b+.1,b+.25)});
  s+=fade(seg(p,b,b+.1),label('傾き',640,445,{size:26,color:C.dim,anchor:'middle'})+T(`0.2\\sin ${Us}\\ \\to\\ 0.2\\cos ${Us}`,880,440,36));
  s+=LEG();
  s+=goalTag(G1);
  return s;
 },
 // 5. 歯車をかみ合わせ、倍率は掛け算。v＝0.2 cos u × 5 → v＝1.0 cos 5t
 [K+'chain']:(p,ctx)=>{
  const t=cueT(ctx),W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=osc(0)+pauseBadge({x:330,y:92})+label('t＝0',330,470,{size:28,color:CT,anchor:'middle',weight:700});
  s+=T(XF,860,115,40);
  s+=gears({y:225,ang:-2.4-1.5*smooth(clamp(t/2)),b1:1,b2:1,mul:seg(p,.08,.2),glow1:seg(p,.1,.2),glow2:seg(p,.1,.2)});
  s+=fade(seg(p,b,b+.1),T(`${Vs}=0.2\\cos ${Us}\\times 5`,860,420,38));
  s+=fade(seg(p,b+.3,b+.42),T(`${Vs}=1.0\\cos 5${Ts}`,860,480,40,{color:CV}));
  s+=LEG(1-seg(p,b-.05,b));
  s+=goalTag(G1);
  return s;
 },
 // 6. cos 0＝1 → v(0)＝1.0 m/s。左のおもりに上向きの速度の矢印。小問1 の答え D。
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=osc(0,{vel:seg(p,.3,.42),vLab:'1.0 m/s',tan:seg(p,.3,.42)})+pauseBadge({x:330,y:92})+label('t＝0',330,470,{size:28,color:CT,anchor:'middle',weight:700});
  s+=card(540,110,640,330,T(`${Vs}=1.0\\cos 5${Ts}`,860,175,40)
   +fade(seg(p,.05,.15),T(`\\cos 0=1`,860,260,40))
   +fade(seg(p,.2,.32),T(`${Vs}(0)=1.0\\ \\mathrm{m/s}`,860,370,50,{color:CV})),1);
  s+=goalTag(G1)+ANS1(seg(p,b+.02,b+.1));
  return s;
 },
 // 7. 誤答 A（黄の歯車を外す）→ B（緑の歯車を外す）。
 [K+'wrongAB']:(p,ctx)=>{
  const ve=voiceEnd(ctx),wA=[0,ve*.5],wB=[ve*.5,1];
  const inA=seg(p,.01,.05)*(1-seg(p,wA[1]-.04,wA[1])),inB=seg(p,wB[0]+.01,wB[0]+.05);
  let s=osc(0,{vel:1,vLab:'1.0 m/s'})+pauseBadge({x:330,y:92})+label('t＝0',330,470,{size:28,color:CT,anchor:'middle',weight:700});
  s+=gears({y:150,ang:-3.9,b1:1,b2:1,h1:inA,h2:inB});
  s+=wrongSeq(p,ctx,[['A','0.2 m/s','中身の 倍率 5 を 掛け忘れた（黄の 歯車を 外した）'],['B','5 m/s','振幅 0.2 を 掛け忘れた（緑の 歯車を 外した）']],{win:[wA,wB],opts:{...WOPT,y:330,whySize:22}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 8. 誤答 C：t＝0 の位置 0 と取り違えた。円の点は一番横（真上へ走る所）、おもりの矢印が一番長い。
 [K+'wrongC']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const glow=seg(p,b,b+.08);
  let s=osc(0,{vel:1,vLab:'1.0 m/s',tan:1})+pauseBadge({x:330,y:92})+label('t＝0',330,470,{size:28,color:CT,anchor:'middle',weight:700});
  s+=fade(glow,ring(O.ccx+O.rp,O.cy,22,{color:C.hi,w:4})+label('円の 一番 横',O.ccx+O.rp-30,O.cy-24,{size:22,color:C.hi,anchor:'end',weight:700}));
  s+=card(540,110,640,180,label('t＝0 の 位置',700,165,{size:26,color:C.dim,anchor:'middle'})+T(`${Xs}(0)=0`,700,235,40)
   +label('t＝0 の 速度',1020,165,{size:26,color:C.dim,anchor:'middle'})+T(`${Vs}(0)=1.0`,1020,235,40,{color:CV}),1);
  s+=fade(glow,label('中心を 通る 瞬間 ＝ 速度が 最大',860,320,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=wrongCard('C','0 m/s','t＝0 の 位置 x(0)＝0 と 取り違えた',{...WOPT,y:360,g:seg(p,.02,.08)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 9. 歯車の ×0.2 cos u と ×5 を光らせる。小問2 の答え A。
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,ve=voiceEnd(ctx);
  let s=osc(0,{vel:1,vLab:'1.0 m/s'})+pauseBadge({x:330,y:92})+label('t＝0',330,470,{size:28,color:CT,anchor:'middle',weight:700});
  s+=gears({y:160,ang:-3.9,b1:1,b2:1,mul:seg(p,b+.2,b+.3),glow2:seg(p,b+.05,b+.15),glow1:seg(p,b+.2,b+.3)});
  s+=fade(seg(p,b+.05,b+.15),label('sin の 傾き cos',940,420,{size:26,color:COUT,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.2,b+.3),label('中身 5t の 傾き 5',700,420,{size:26,color:CIN,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.3,b+.4),T(`0.2\\cos ${Us}\\times 5`,820,480,36));
  s+=LEG(1-seg(p,b,b+.05));
  s+=goalTag(G2,{g:seg(p,.02,.08)})+ANS2(seg(p,ve-.08,ve-.02));
  return s;
 },
 // 10. 円を大きく。半径 0.2、1秒に 5 rad（ω＝5）。接線向きの速さ 0.2×5＝1.0。縦の成分＝おもりの速度（実時間で回る）。
 [K+'circle']:(p,ctx)=>{
  const t=tAt(ctx,K+'circle'),u=W5*t,W=sentWin(ctx),b=W[1]?W[1][0]:.3;
  const cx=330,cy=300,R=150,sn=Math.sin(u),cs=Math.cos(u),px=cx+R*cs,py=cy-R*sn,bx=70;
  let s=line(cx-R-20,cy,cx+R+20,cy,{color:C.faint,w:2})+line(cx,cy-R-14,cx,cy+R+14,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
  s+=line(cx,cy,px,py,{color:C.ink,w:3})+label('0.2',(cx+px)/2+16*sn,(cy+py)/2+16*cs+8,{size:26,color:C.ink,anchor:'middle',weight:700});
  // 角の弧（1回転を超えたら一番外の 2π 内だけ）
  const um=((u%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
  if(um>.05){const n=30,pts=Array.from({length:n+1},(_,i)=>{const a=um*i/n;return [cx+50*Math.cos(a),cy-50*Math.sin(a)];});s+=draw(pts,1,{color:CW,w:4});}
  s+=line(px,py,bx+22,py,{color:C.faint,w:2,dash:'5 6'})+ring(bx,py,18,{color:CX,w:3,fill:'#123049'});
  const L=100,vx=-L*sn,vy=-L*cs;
  const ga=seg(p,b,b+.1);
  s+=fade(ga,arrow(px,py,px+vx,py+vy,{color:CV,w:6,head:16})+line(px+vx,py+vy,px,py+vy,{color:CV,w:2,dash:'5 5'}));
  if(Math.abs(vy)>8)s+=fade(ga,arrow(bx+34,py,bx+34,py+vy,{color:CV,w:6,head:14}));
  s+=dot(px,py,11,C.hi);
  s+=card(560,110,620,370,label('角度が 1秒に 5 rad 進む',870,160,{size:28,color:CW,anchor:'middle',weight:700})
   +T(`{\\color{${CW}}\\omega}=5\\ \\mathrm{rad/s}`,870,225,36)
   +fade(seg(p,b,b+.1),line(600,262,1140,262,{color:C.faint,w:2})+label('円を 回る 点の 速さ',870,305,{size:26,color:C.dim,anchor:'middle'})+T(`0.2\\times5=1.0\\ \\mathrm{m/s}`,870,365,40,{color:CV}))
   +fade(seg(p,b+.3,b+.42),label('縦の 成分 ＝ おもりの 速度',870,440,{size:26,color:CV,anchor:'middle',weight:700})),seg(p,.02,.1));
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 11. 誤答 B（5 は振幅ではない）→ C（足し算）→ D（sin 5t と 5 sin t は別：2本のグラフ）。
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],b2=W[1]?W[1][0]:.5,m=b2+(1-b2)*.42;
  const wB=[0,b2+.02],wC=[b2+.02,m+.02],wD=[m+.02,1];
  const inB=seg(p,.01,.05)*(1-seg(p,b2,b2+.03)),inC=seg(p,b2+.01,b2+.04)*(1-seg(p,m,m+.03)),inD=seg(p,m+.01,m+.04);
  let s='';
  // B：左に円（振幅 0.2、ω＝5）
  s+=fade(inB,(()=>{const cx=330,cy=280,R=160;let q=ring(cx,cy,R,{color:C.dim,w:3})+line(cx,cy,cx+R,cy,{color:C.ink,w:4})
    +label('半径（振幅） 0.2',cx+R/2,cy+50,{size:26,color:C.ink,anchor:'middle',weight:700});
    const n=30,pts=Array.from({length:n+1},(_,i)=>{const a=1.1*i/n;return [cx+60*Math.cos(a),cy-60*Math.sin(a)];});
    q+=draw(pts,1,{color:CW,w:4})+label('1秒に 5 rad（ω）',cx+70,cy-90,{size:26,color:CW,weight:700});return q;})());
  // C：二つの倍率は掛け算
  s+=fade(inC,T(`0.2\\cos ${Us}\\ {\\color{${CD}}+}\\ 5`,330,200,40)+label('×',330,290,{size:30,color:C.dim,anchor:'middle'})
   +T(`0.2\\cos ${Us}\\ \\times\\ 5`,330,360,40)+label('二段の 倍率は 掛け算',330,440,{size:26,color:C.hi,anchor:'middle',weight:700}));
  // D：2本のグラフ
  if(inD>0){
   const A1=axes({x:60,y:250,w:440,h:140,xmin:0,xmax:2.6,ymin:-1.1,ymax:1.1,xlabel:'',xticks:[],yticks:[],xcolor:CT});
   const A2=axes({x:60,y:470,w:440,h:140,xmin:0,xmax:2.6,ymin:-5.5,ymax:5.5,xlabel:'',xticks:[],yticks:[],xcolor:CT});
   s+=fade(inD,A1.svg+A1.plot(t=>Math.sin(5*t),{color:CX,w:3.5})+label('sin 5t',515,130,{size:26,color:CX,weight:700})
    +label('揺れが 速い',515,165,{size:22,color:C.dim})
    +A2.svg+A2.plot(t=>5*Math.sin(t),{color:CD,w:3.5})+label('5 sin t',515,360,{size:26,color:CD,weight:700})+label('揺れが 大きい',515,395,{size:22,color:C.dim}));
  }
  s+=wrongSeq(p,ctx,[['B','5 は 振幅',['振幅は 0.2、5 は 角振動数','（1秒に 角度が 進む 量）']],['C','足し合わせる','二段の 倍率は 掛け算'],['D','5 を 外に 出す','sin 5t と 5 sin t は 別の 関数']],{win:[wB,wC,wD],opts:{...WOPT,x:720,w:470,y:300}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 12. 左のおもりが x＝0.1 を上向きに通る瞬間で一時停止。位置の矢印（水色）。右に a＝dv/dt。
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=osc(U01,{pos:seg(p,.1,.2),pLab:'x＝0.1'})+pauseBadge({x:330,y:92,g:seg(p,.02,.1)});
  s+=T(`${Vs}=1.0\\cos 5${Ts}`,860,140,40);
  s+=fade(seg(p,b,b+.1),T(`${As}=\\dfrac{d${Vs}}{d${Ts}}`,860,290,60)+label('速度を もう一度 微分',860,400,{size:28,color:CA,anchor:'middle',weight:700}));
  s+=goalTag(G3,{g:seg(p,.02,.1)});
  return s;
 },
 // 13. 同じ二段の歯車：緑に ×(−1.0 sin u)、黄に ×5。a＝−1.0×5 sin 5t＝−5.0 sin 5t
 [K+'acc']:(p,ctx)=>{
  const t=cueT(ctx),W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=osc(U01,{pos:1,pLab:'x＝0.1'})+pauseBadge({x:330,y:92});
  s+=gears({y:150,ang:-1.2*smooth(clamp(t/1.6)),f2:'u → 1.0 cos u',out:'v',outColor:CV,b2:seg(p,.05,.18),t2:'×(−1.0 sin u)',b1:seg(p,.3,.42),mul:seg(p,.4,.5)});
  s+=fade(seg(p,b,b+.1),T(`${As}=-1.0\\times5\\sin 5${Ts}`,860,400,36));
  s+=fade(seg(p,b+.2,b+.3),T(`=-5.0\\sin 5${Ts}`,900,470,38,{color:CA}));
  s+=LEG(1-seg(p,b-.05,b));
  s+=goalTag(G3);
  return s;
 },
 // 14. −5.0 sin 5t＝−25×0.2 sin 5t。0.2 sin 5t に水色の枠 → x。a＝−25x、25＝5²＝ω²。
 [K+'a25']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=osc(U01,{pos:1,pLab:'x＝0.1'})+pauseBadge({x:330,y:92});
  const e2=`=-25\\times0.2\\sin 5${Ts}`,wf=texWidth(e2,42,false),xs=texWidth(`=-25\\times`,42,false),x0=860-wf/2;
  s+=T(`${As}=-5.0\\sin 5${Ts}`,860,140,42);
  s+=fade(seg(p,.1,.2),T(e2,860,240,42));
  s+=highlight(x0+xs+2,205,wf-xs+8,62,seg(p,.3,.4),CX)+fade(seg(p,.32,.42),label('＝ x',x0+wf+22,250,{size:30,color:CX,weight:700}));
  s+=fade(seg(p,b,b+.1),T(`${As}=-25${Xs}`,860,360,56,{color:CA}));
  s+=fade(seg(p,b+.25,b+.35),T(`{\\color{${CW}}25=5^2=\\omega^2}`,860,460,40));
  s+=goalTag(G3);
  return s;
 },
 // 15. x＝0.1 を代入 → a＝−2.5 m/s²。左のおもりに下向きの加速度の矢印。小問3 の答え B。
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=osc(U01,{pos:1,pLab:'x＝0.1',acc:seg(p,.35,.45),aLab:'2.5 m/s²'})+pauseBadge({x:330,y:92});
  s+=T(`${As}=-25${Xs}`,860,140,48,{color:CA});
  s+=fade(seg(p,.05,.15),T(`=-25\\times{\\color{${C.hi}}0.1}`,860,250,46));
  s+=fade(seg(p,.25,.35),T(`=-2.5\\ \\mathrm{m/s^2}`,860,360,50,{color:CA}));
  s+=goalTag(G3)+ANS3(seg(p,b+.02,b+.1));
  return s;
 },
 // 16. 位置の矢印（上）と加速度の矢印（下）を光らせ、一時停止を解く。おもりは中心へ引き戻される（実時間、整数周期で同じ位置に戻って再び一時停止）。
 [K+'back']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,dur=ctx?.dur??6,t=cueT(ctx),t0=b*dur;
  const nP=Math.max(1,Math.floor((dur-t0-.6)/PER)),run=clamp(t-t0,0,nP*PER),moving=t>t0&&t<t0+nP*PER;
  const u=U01+W5*run,blink=.5+.5*Math.sin(t*6),gl=seg(p,.05,.12)*(1-seg(p,b-.03,b));
  let s=osc(u,{pos:1,acc:1,pLab:moving?'':'x＝0.1',aLab:moving?'':'2.5 m/s²'});
  if(gl>0)s+=fade(gl*blink,rect(O.sx-75,O.cy-140,150,180,{fill:C.hi,fo:.06,stroke:C.hi,sw:2.5,rx:10}));
  s+=pauseBadge({x:330,y:92,g:moving?0:1});
  s+=T(`${As}=-25${Xs}`,860,140,48,{color:CA});
  s+=fade(seg(p,.05,.15),label('マイナス ＝ 位置と 逆向き',860,250,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.1),label('中心へ 引き戻される',860,340,{size:32,color:CA,anchor:'middle',weight:700})+label('（上へ 進めば 減速して 折り返す）',860,395,{size:26,color:C.dim,anchor:'middle'}));
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 17. 誤答 A → C → D（D のとき x＝0.2 での矢印を薄く並べる）。
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],b2=W[1]?W[1][0]:.4,m=b2+(1-b2)*.4;
  const wA=[0,e1],wC=[b2,m],wD=[m,1],inD=seg(p,wD[0]+.01,wD[0]+.05);
  let s=osc(U01,{pos:1,pLab:'x＝0.1',acc:1,aLab:'2.5 m/s²',ghostAcc:inD,circle:1-inD})+pauseBadge({x:330,y:92});
  s+=card(540,100,640,150,T(`${As}=-25${Xs}`,860,160,40,{color:CA})+T(`=-25\\times0.1=-2.5`,860,220,34),1);
  s+=wrongSeq(p,ctx,[['A','−0.5 m/s²','−5×0.1（5 を 1回 だけ）'],['C','＋2.5 m/s²','符号を 落とした'],['D','−5 m/s²','−25×0.2（振幅を 使った）']],{win:[wA,wC,wD],opts:{...WOPT,y:300}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 18. 3段の式 x →(×5)→ v →(×5)→ a＝−25x。左に t＝0 と x＝0.1 のおもり。最後に答えの札を並べる。
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s='';
  const ex=840,ys=[150,290,430];
  s+=card(600,100,480,100,T(XF,ex,ys[0]+8,38),seg(p,0,.03));
  s+=fade(seg(p,.1,.18),arrow(ex,205,ex,240,{color:C.dim,w:3,head:12})+label('× 5（中身の 微分）',ex+20,232,{size:24,color:CIN,weight:700}));
  s+=card(600,245,480,90,T(`${Vs}=1.0\\cos 5${Ts}`,ex,ys[1]+8,38),seg(p,.15,.22));
  s+=fade(seg(p,b,b+.08),arrow(ex,340,ex,375,{color:C.dim,w:3,head:12})+label('× 5（もう一度）',ex+20,367,{size:24,color:CIN,weight:700}));
  s+=card(600,380,480,125,T(`${As}=-25${Xs}`,ex,ys[2]+2,40,{color:CA})+label('25 倍・逆向き',ex,ys[2]+56,{size:22,color:CA,anchor:'middle'}),seg(p,b+.05,b+.12));
  // 左の小さな図
  const g1=seg(p,.22,.3),g2=seg(p,b+.12,b+.2);
  s+=fade(g1,miniBob(140,330,0,{arrowLen:90,color:CV,lab:'1.0 m/s',sub:'t＝0（中心）'}));
  s+=fade(g2,miniBob(400,420,55,{arrowLen:-70,color:CA,lab:'2.5 m/s²',sub:''})+label('x＝0.1',400,470,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(g1,line(600,290,300,290,{color:CV,w:2,dash:'6 6'}));
  s+=fade(g2,line(600,440,550,412,{color:CA,w:2,dash:'6 6'}));
  s+=answerRow([[1,'D','1.0 m/s'],[2,'A',''],[3,'B','−2.5 m/s²']],{g:seg(p,.82,.9)});
  return s;
 },
};
