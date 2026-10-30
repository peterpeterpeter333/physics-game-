// 問題編 解説「8 V の点から 2 V の点へ」（q-ui-electric-potential、大学編 22 電位・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/22_電位.md の q-ui-electric-potential（解説 17 行）。
// 画面：左に電場と P・Q の図、右に説明の枠。誤答カードは右側に1枚ずつ。札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。
// 色（正本）：電場 𝐄 水色、電位 V 紫、位置エネルギー U・仕事 W 橙、差・強調 黄、負の値・誤り 赤、正電荷 赤、負電荷 青、力 緑、電荷の量 q 桃。
// 図のために決めた値：坂の高さ 1 V＝20 px、位置エネルギーの棒 1 J＝4 px。
import {C,clamp,mix,seg,fade,move,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,wrongSeq,cueT,tAt,sentWin,textW,isProblem} from './yt1-qx-common.mjs';

const K='qx-ui-electric-potential:';
const EC=C.x,VC=C.v,UC=C.E,HI=C.hi,NG='#ff6b6b',RED='#ff6b6b',BLUE='#7fb3ff',FC=C.F,QC=C.p;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const PX=690,PW=490,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='電場の強さ E',G2='+3 C の ΔU（P→Q）',G3='−3 C が押される向きと、電場の仕事';
const ANS1=g=>answerTag(1,'C','2 V/m',{g}),ANS2=g=>answerTag(2,'A','−18 J',{g}),ANS3=g=>answerTag(3,'D','P の向き、+18 J',{g});

// ---- 基本の図 ----
const PXp=200,QXp=620,LY=330,MPX=140;   // P・Q の位置（1 m＝140 px）
const xAt=m=>PXp+MPX*m;
const yV=V=>290-20*V;                    // 坂の高さ（V→y）
const CY=430;                            // 電荷の丸の高さ
function fieldArrows({g=1,op=1}={}){
 let s='';
 for(const y of [125,185,245])for(let i=0;i<4;i++){const x=120+i*150;s+=arrow(x,y,x+100,y,{color:EC,w:4,head:14});}
 return fade(g*op,s);
}
function base({arrows=1,arrOp=1,pts=1,vals=1,dim=1,dimLab='3 m',vEq=0}={}){
 let s=fieldArrows({g:arrows,op:arrOp});
 s+=fade(arrows,T('\\mathbf{E}',678,124,30,{color:EC}));
 s+=fade(dim,line(PXp,LY,QXp,LY,{color:C.dim,w:2})+line(PXp,LY-10,PXp,LY+10,{color:C.dim,w:2})+line(QXp,LY-10,QXp,LY+10,{color:C.dim,w:2})
  +(dimLab?label(dimLab,(PXp+QXp)/2,LY-12,{size:26,color:C.ink,anchor:'middle',weight:700}):''));
 s+=fade(pts,dot(PXp,LY,9,C.ink)+dot(QXp,LY,9,C.ink)+label('P',PXp-22,LY+10,{size:30,color:C.ink,anchor:'end',weight:700})+label('Q',QXp+22,LY+10,{size:30,color:C.ink,weight:700}));
 s+=fade(vals,label(vEq?'V＝8 V':'8 V',PXp,LY-30,{size:28,color:VC,anchor:'middle',weight:700})+label('2 V',QXp,LY-30,{size:28,color:VC,anchor:'middle',weight:700}));
 return s;
}
// 電位を高さにした坂（紫）。P の上から Q の上へ下る。
function slope({g=1,poles=1,drop=0,steps=0,eq=0}={}){
 let s=fade(poles*.7,line(PXp,yV(8),PXp,LY-58,{color:VC,w:2,dash:'4 6'})+line(QXp,yV(2),QXp,LY-58,{color:VC,w:2,dash:'4 6'}));
 s+=line(PXp,yV(8),QXp,yV(2),{color:VC,w:6});
 s+=label('電位の 坂',PXp+40,yV(8)-14,{size:24,color:VC,weight:700});
 if(drop)s+=fade(drop,line(PXp,yV(8),QXp+40,yV(8),{color:HI,w:2,dash:'6 6'})+line(QXp+40,yV(8),QXp+40,yV(2),{color:HI,w:5})
  +line(QXp+30,yV(2),QXp+50,yV(2),{color:HI,w:3})+label('6 V',QXp+28,(yV(8)+yV(2))/2+8,{size:28,color:HI,anchor:'end',weight:700}));
 if(steps)for(let k=0;k<3;k++){
  const g2=seg(steps,k/3,(k+1)/3),x0=xAt(k),x1=xAt(k+1),y0=yV(8-2*k),y1=yV(6-2*k);
  s+=fade(g2,line(x0,y0,x1,y0,{color:HI,w:2,dash:'5 5'})+line(x1,y0,x1,y1,{color:HI,w:5})+label('2 V',x1-8,y0+22,{size:24,color:HI,anchor:'end',weight:700})
   +label('1 m',(x0+x1)/2,LY+34,{size:24,color:C.ink,anchor:'middle',weight:700})+line(x1,LY-8,x1,LY+8,{color:C.dim,w:2}));
 }
 if(eq)for(let i=0;i<7;i++){const x=PXp+70*i;s+=fade(seg(eq,i/8,(i+2)/8),line(x,100,x,LY+60,{color:VC,w:2,dash:'3 7'}));}
 return fade(g,s);
}
// 電荷の丸
function chargeDot(x,y,{sign=1,g=1,text='',tside='left',r=20}={}){
 const col=sign>0?RED:BLUE;
 let s=ring(x,y,r,{color:col,w:3,fill:sign>0?'#3a1d2a':'#1a2a4a'})+label(sign>0?'+':'−',x,y+r*.45,{size:r*1.4,color:col,anchor:'middle',weight:700});
 if(text)s+=label(text,tside==='left'?x-r-10:x+r+10,y+9,{size:26,color:col,anchor:tside==='left'?'end':'start',weight:700});
 return fade(g,s);
}
// 位置エネルギーの棒（橙）。電荷の右に、下から上へ。
function ubar(x,J,{g=1,text='',ghost=0,lost=0}={}){
 const b=505,h=4*J;
 let s=ghost?rect(x,b-h,26,h,{fill:UC,fo:.08,stroke:UC,sw:2,rx:3}):rect(x,b-h,26,h,{fill:UC,fo:.75,stroke:UC,sw:2,rx:3});
 if(lost>0){const h2=4*lost;s+=rect(x,b-h-h2,26,h2,{fill:'none',fo:0,stroke:NG,sw:2.5,rx:3});}
 if(text)s+=label(text,x+13,b-h-4*lost-10,{size:26,color:UC,anchor:'middle',weight:700});
 return fade(g,s);
}
const fieldDim=.25;

// 行13（2 cue）：1つ目で −3 C が Q→P へ動き ΔU、2つ目で W＝−ΔU
function work3(p,q){
 const mv=seg(p,.03,.45),x=mix(QXp,PXp,mv);
 let s=base({arrOp:fieldDim,dimLab:''});
 s+=slope();
 s+=chargeDot(x,CY,{sign:-1,text:''})+arrow(x-26,CY,x-136,CY,{color:FC,w:7,head:20});
 const w1=`${cs(UC,'W')}=-\\Delta ${cs(UC,'U')}`,w2=`=${cs(UC,'+18\\ \\mathrm{J}')}`,ww1=texWidth(w1,38,false),ww2=texWidth(w2,38,false),x0=PC-(ww1+ww2+10)/2;
 s+=panel(90,300,fade(seg(p,.15,.3),T(`\\Delta ${cs(UC,'U')}=(${cs(QC,'-3')})\\times(${cs(VC,'8')}-${cs(VC,'2')})`,PC,150,34))
  +fade(seg(p,.35,.5),T(`=(${cs(QC,'-3')})\\times(${cs(VC,'+6')})=${cs(NG,'-18\\ \\mathrm{J}')}`,PC,215,34))
  +fade(seg(p,.6,.75),label('位置エネルギーは 減る',PC,268,{size:24,color:C.dim,anchor:'middle'}))
  +fade(seg(q,.05,.2),line(PX+30,298,PX+PW-30,298,{color:C.faint,w:2})+T(w1,x0,345,38,{anchor:'start'}))
  +fade(seg(q,.35,.5),T(w2,x0+ww1+10,345,38,{anchor:'start'})),seg(p,.05,.12));
 return s+goalTag(G3);
}

export const ytQxUiElectricPotentialDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約4秒）：0〜2 s 電場の矢印、2〜4 s P・Q・電位の値・3 m。電荷・坂・等電位線・力・計算は出さない。
 [K+'q1']:(p)=>move(230,0,base({arrows:seg(p,0,.45),pts:seg(p,.5,.65),vals:seg(p,.6,.8),dim:seg(p,.75,.95)})),
 // 小問2：P の少し下に赤い丸「+3 C」だけ
 [K+'q2']:(p)=>move(230,0,base()+chargeDot(PXp,CY,{sign:1,text:'+3 C',g:seg(p,.1,.7)})),
 // 小問3：Q の少し下に青い丸「−3 C」だけ（力の矢印は出さない）
 [K+'q3']:(p)=>move(230,0,base()+chargeDot(QXp,CY,{sign:-1,text:'−3 C',g:seg(p,.1,.7)})),

 // ===================== 小問1 =====================
 [K+'intro']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=base({arrows:seg(p,0,.12),pts:seg(p,.08,.18),vals:seg(p,.12,.3),dim:seg(p,b,b+.1)});
  // 2文目：電場の向きに 3 m 先（黄の矢印で P→Q）
  s+=fade(seg(p,b+.05,b+.15),arrow(PXp+14,LY+40,QXp-14,LY+40,{color:HI,w:4,head:14}));
  return s;
 },
 [K+'goal1']:(p)=>{
  const fl=seg(p,.25,.4)*(1-seg(p,.65,.85));
  let s=base({arrOp:1});
  s+=fade(fl,(()=>{let t='';for(const y of [125,185,245])for(let i=0;i<4;i++){const x=120+i*150;t+=line(x,y,x+90,y,{color:EC,w:12,opacity:.35});}return t;})());
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 [K+'slope']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=base({arrOp:mix(1,fieldDim,seg(p,.02,.15))});
  s+=slope({g:seg(p,.08,.3),drop:seg(p,b,b+.15)});
  s+=goalTag(G1);
  return s;
 },
 [K+'perm']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=base({arrOp:fieldDim,dimLab:seg(p,0,.08)>.5?'':'3 m'});
  s+=slope({drop:1-seg(p,0,.08),steps:seg(p,.06,b-.05),eq:seg(p,b+.15,b+.45)});
  s+=panel(90,280,label('1 m あたりの 下がり幅',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,b,b+.08),T(`E=6\\div3`,PC,215,46,{color:C.ink}))
   +fade(seg(p,b+.1,b+.2),T(`=2\\ \\mathrm{V/m}`,PC,300,46,{color:EC})),seg(p,.03,.12));
  s+=fade(seg(p,b+.3,b+.42),label('紫の点線：1 V ごと',PC,410,{size:24,color:VC,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=base({arrOp:fieldDim,dimLab:''});
  s+=slope({steps:1,eq:1});
  s+=panel(90,280,label('1 m あたりの 下がり幅',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +T(`E=6\\div3`,PC,215,46,{color:C.ink})+T(`=2\\ \\mathrm{V/m}`,PC,300,46,{color:EC}),1);
  s+=fade(seg(p,.05,.2),card(PX,385,PW,90,T(`\\mathrm{V/m}=\\mathrm{N/C}`,PC,432,38,{color:HI}),1,HI));
  s+=goalTag(G1)+ANS1(seg(p,b,b+.08));
  return s;
 },
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5,wA=[0,m],wB=[m,W[0][1]],wD=[W[1]?W[1][0]:.6,1];
  let s=base({arrOp:fieldDim,dimLab:''});
  s+=slope({steps:1});
  s+=wrongSeq(p,ctx,[['A','6 V/m','距離で 割り忘れた'],['B','0.5 V/m','3÷6 と 逆に 割った'],['D','3.3 V/m','和 10 V を 割った']],{win:[wA,wB,wD],opts:{...WOPT,y:150}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  let s=base();
  s+=chargeDot(PXp,CY,{sign:1,text:'+3 C',g:seg(p,.15,.3)});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 [K+'uqv']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,sym=seg(p,.03,.15);
  let s=base({vEq:sym>.5,vals:1});
  s+=chargeDot(PXp,CY,{sign:1,text:''});
  s+=fade(sym,label('q＝+3 C',PXp-30,CY+9,{size:26,color:QC,anchor:'end',weight:700}));
  s+=panel(90,250,label('電位 ＝ 1 C あたりの 位置エネルギー',PC,135,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.28),T(`${cs(UC,'U')}=${cs(QC,'q')}${cs(VC,'V')}`,PC,215,52)),seg(p,.1,.2));
  s+=ubar(PXp+40,24,{g:seg(p,b,b+.1),text:'3×8＝24 J'});
  s+=ubar(QXp+40,6,{g:seg(p,b+.15,b+.25),text:'3×2＝6 J',ghost:1});
  s+=goalTag(G2);
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,mv=seg(p,.05,.35),x=mix(PXp,QXp,mv),J=mix(24,6,mv);
  let s=base({vals:1});
  s+=fade(seg(p,0,.05),label('始点',PXp,LY+50,{size:24,color:C.dim,anchor:'middle'}))+fade(seg(p,0,.05),label('終点',QXp,LY+50,{size:24,color:C.dim,anchor:'middle'}));
  s+=chargeDot(x,CY+20,{sign:1,text:''});
  s+=ubar(x+40,J,{lost:mv>.98?18:0});
  s+=fade(seg(p,.35,.42),label('−18 J',x+76,505-4*15,{size:28,color:NG,weight:700}));
  s+=panel(90,250,label('変化 ＝ 終点 − 始点',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.12,.24),T(`\\Delta ${cs(UC,'U')}=${cs(QC,'q')}\\,(${cs(VC,'V_Q')}-${cs(VC,'V_P')})`,PC,200,38))
   +fade(seg(p,.26,.38),T(`=${cs(QC,'3')}\\times(${cs(VC,'2')}-${cs(VC,'8')})`,PC,260,38))
   +fade(seg(p,.4,.5),T(`=${cs(NG,'-18\\ \\mathrm{J}')}`,PC,315,40)),1);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.08));
  return s;
 },
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),wB=[0,W[0][1]],s2=W[1]?W[1][0]:.5,m=s2+(1-s2)*.5,wC=[s2,m],wDD=[m,1];
  let s=base({vals:1});
  s+=chargeDot(QXp,CY+20,{sign:1,text:''})+ubar(QXp+40,6,{lost:18});
  s+=wrongSeq(p,ctx,[['B','+18 J','始点−終点と 逆に 引いた'],['C','−6','電荷を 掛け忘れ（単位 V）'],['D','+6','掛け忘れ＋順も 逆']],{win:[wB,wC,wDD],opts:{...WOPT,y:150}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>{
  let s=base({arrOp:mix(1,fieldDim,seg(p,.2,.35))});
  s+=slope({g:seg(p,.2,.4),poles:1});
  s+=chargeDot(QXp,CY,{sign:-1,text:'−3 C',g:seg(p,.12,.25)});
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 [K+'force3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=base({arrOp:fieldDim});
  s+=slope();
  s+=chargeDot(QXp,CY,{sign:-1,text:''});
  s+=fade(seg(p,.05,.18),arrow(QXp+30,CY-50,QXp+130,CY-50,{color:EC,w:5,head:16})+T('\\mathbf{E}',QXp+152,CY-50,28,{color:EC}));
  s+=fade(seg(p,.15,.3),arrow(QXp-26,CY,QXp-136,CY,{color:FC,w:7,head:20})+label('力',QXp-80,CY+40,{size:28,color:FC,anchor:'middle',weight:700}));
  // 坂の上で、上りへ押される
  const ux=PXp-QXp,uy=yV(8)-yV(2),L=Math.hypot(ux,uy),ax=QXp-60,ay=yV(2)-3*20-14;
  s+=fade(seg(p,b+.05,b+.18),arrow(ax,ay,ax+ux/L*120,ay+uy/L*120,{color:FC,w:5,head:16})+label('上りへ 押される',ax-50,ay-36,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.12),label('電位が 高い',PXp-20,yV(8)+8,{size:24,color:VC,anchor:'end',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 [K+'work3']:(p)=>work3(p,0),
 [K+'work3b']:(p)=>work3(1,p),
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=base({arrOp:fieldDim,dimLab:''});
  s+=slope();
  s+=chargeDot(PXp,CY,{sign:-1,text:''})+arrow(PXp+26,CY-8,PXp+136,CY-8,{color:FC,w:7,head:20})+label('力',PXp+80,CY-26,{size:26,color:FC,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),arrow(QXp,CY+50,PXp+60,CY+50,{color:C.dim,w:5,head:16})+label('動いた 向き',(PXp+QXp)/2+60,CY+40,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label('同じ 向き → 正の 仕事',PXp+250,CY-26,{size:26,color:HI,anchor:'start',weight:700}));
  s+=panel(90,190,T(`${cs(UC,'W')}=-\\Delta ${cs(UC,'U')}=${cs(UC,'+18\\ \\mathrm{J}')}`,PC,190,38),1);
  s+=goalTag(G3)+ANS3(seg(p,b,b+.08));
  return s;
 },
 [K+'wrong3a']:(p,ctx)=>{
  let s=base({arrOp:fieldDim,dimLab:''});
  s+=slope();
  s+=chargeDot(PXp,CY,{sign:-1,text:''});
  s+=wrongSeq(p,ctx,[['A','右へ、−18 J','どの 電荷も 坂を 下ると 考えた'],['B','P の向き、−18 J','W と ΔU の 符号の 取り違え']],{opts:{...WOPT,y:150}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 [K+'wrong3c']:(p)=>{
  let s=base({arrOp:fieldDim,dimLab:''});
  s+=slope();
  s+=chargeDot(QXp,CY,{sign:-1,text:''});
  const g=seg(p,.15,.3);
  s+=fade(g,arrow(QXp+26,CY,QXp+130,CY,{color:C.dim,w:6,head:18}));
  s+=fade(seg(p,.25,.38),label('×',QXp+78,CY+14,{size:56,color:NG,anchor:'middle',weight:700}));
  s+=wrongSeq(p,null,[['C','右向き、+18 J','負の 電荷も 電場の 向きと 考えた']],{win:[[0,1]],opts:{...WOPT,y:150}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,t=cueT(ctx);
  // 左：坂の地図（正は下る、負は上る）
  const x0=80,x1=520,y0=170,y1=330,sl=u=>[mix(x0,x1,u),mix(y0,y1,u)];
  let s=card(40,90,540,410,'',seg(p,0,.08));
  s+=fade(seg(p,0,.1),label('電位の 坂',310,135,{size:28,color:VC,anchor:'middle',weight:700})+line(x0,y0,x1,y1,{color:VC,w:6})
   +label('高い',x0,y0-22,{size:24,color:VC,anchor:'middle'})+label('低い',x1,y1+40,{size:24,color:VC,anchor:'middle'}));
  const up=seg(p,.12,.45),dn=seg(p,.12,.45);
  const [rx,ry]=sl(mix(.15,.85,dn)),[bx,by]=sl(mix(.85,.15,up));
  s+=fade(seg(p,.1,.18),chargeDot(rx,ry-24,{sign:1,r:18})+chargeDot(bx,by+26,{sign:-1,r:18}));
  s+=fade(seg(p,.2,.3),label('正の 電荷：下る',x0+20,420,{size:26,color:RED,weight:700})+label('負の 電荷：上る',x0+20,465,{size:26,color:BLUE,weight:700}));
  // 右：電場の矢印の地図
  s+=card(620,90,560,410,'',seg(p,.25,.35));
  s+=fade(seg(p,.25,.38),label('電場の 矢印の 地図',900,135,{size:28,color:EC,anchor:'middle',weight:700})
   +(()=>{let t='';for(const y of [190,250])for(let i=0;i<3;i++){const x=680+i*160;t+=arrow(x,y,x+110,y,{color:EC,w:4,head:14});}return t;})());
  s+=fade(seg(p,.38,.5),chargeDot(780,340,{sign:1,r:18})+arrow(806,340,900,340,{color:FC,w:6,head:16})+label('正：𝐄 の 向き',760,410,{size:24,color:RED,anchor:'middle',weight:700}));
  s+=fade(seg(p,.38,.5),chargeDot(1060,340,{sign:-1,r:18})+arrow(1034,340,940,340,{color:FC,w:6,head:16})+label('負：𝐄 と 逆',1060,410,{size:24,color:BLUE,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.1),label('電位 ＝ 1 C あたりの エネルギー',900,470,{size:26,color:HI,anchor:'middle',weight:700}));
  return s;
 },
};
