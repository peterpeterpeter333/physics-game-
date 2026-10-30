// 問題編 解説「屈折率 1.25 のプラスチック」(ys-qx-hs-w-light-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/304_光波.md の q-hs-w-light-1（解説 18 行）。
// 色（正本の 304 冒頭）：波長 λ・長さ 水色、振動数 f 桃、速さ v・c 紫、時刻 t 金、屈折率 n 白、光 淡い黄、強調 黄。プラスチック 薄い青。
// 図の寸法：空気の波長 200 px（500 nm）、プラスチックの波長 160 px（400 nm）。速さの矢印 c 250 px、v 200 px（1/1.25）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-w-light-1）の部品（色、hDisp・hPhase・passed）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,draw,arrow,tex,texWidth,clamp,mix} from './anim.mjs';
import {LIGHT,GLASS,GLINE,LC,FC,VCOL,TCOL,hDisp,hPhase,passed} from './yt1-hs-w-light-1-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin,cueT,tAt,isProblem,textW,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-w-light-1:';
const PI=Math.PI;
const F=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const ct=`{\\color{${VCOL}}c}`,vt=`{\\color{${VCOL}}v}`,ft=`{\\color{${FC}}f}`,Lt=`{\\color{${LC}}\\lambda}`,nt='n';
const E8='\\times10^{8}',MS='\\ \\mathrm{m/s}',NM='\\ \\mathrm{nm}',HZ='\\ \\mathrm{Hz}',MM='\\ \\mathrm{m}';
const G1='プラスチックの 中の 速さ v',G2='中の 振動数 f と 波長 λ',G3='振動数が 変わらない 理由';
const A1=g=>answerTag(1,'D','2.4×10⁸ m/s',{g}),A2=g=>answerTag(2,'B','6.0×10¹⁴ Hz、400 nm',{g}),A3=g=>answerTag(3,'A','',{g});
// 日本語のラベルの右に TeX を続けて、全体を x の中央に置く
function jt(jp,src,x,y,{size=28,color=C.ink,tsize,after=''}={}){
 const ts=tsize??size*1.15,w1=textW(jp,size),w2=texWidth(src,ts,false),w3=after?textW(after,size):0,x0=x-(w1+w2+w3+10)/2;
 return label(jp,x0,y,{size,color,weight:700})+F(src,x0+w1+10+w2/2,y-size*.36,ts,{color})+(after?label(after,x0+w1+w2+18,y,{size,color,weight:700}):'');
}
const dbl=(x1,x2,y,color,{w=3,head=12,g=1}={})=>arrow(x1,y,x2,y,{color,w,head,g})+arrow(x2,y,x1,y,{color,w,head,g});

// ---- 境界の図（左 空気・右 プラスチック）-----------------------------------------------------------
const XB=600,WY=300,AMP=50,LAM=200;
const HWQ={x0:40,xb:XB,x1:1160,y:WY,A:AMP,lam:LAM,n:1.25,T:1.6};
function media({g=1,labs=1}={}){
 let s=rect(XB,96,600,419,{fill:GLASS,fo:.22,stroke:'none',rx:0})+line(XB,96,XB,515,{color:GLINE,w:3});
 if(labs)s+=label('空気',40,492,{size:28,color:C.dim,weight:700})+label('プラスチック',1170,492,{size:28,color:GLINE,anchor:'end',weight:700})+label('n＝1.25',1170,446,{size:30,color:C.ink,anchor:'end',weight:700});
 return fade(g,s);
}
// 先頭が xf にある、左から来る波（境界から先は描かない）
function frontWave(xf,{g=1}={}){
 const pts=[];for(let x=40;x<=Math.min(xf,XB)+.1;x+=4)pts.push([x,WY-AMP*Math.sin(2*PI*(xf-x)/LAM)]);
 return fade(g,line(40,WY,XB,WY,{color:C.faint,w:2,dash:'6 8'}))+(pts.length>1?fade(g,draw(pts,1,{color:LIGHT,w:5})):'');
}
// 空気の波長の物差し（山から山）。txt＝上の文字
function lamBracket(xf,{g=1,txt='真空中で 500 nm',src=''}={}){
 const a=xf-LAM*1.25,b=xf-LAM*.25;if(a<40)return '';
 let s=line(a,WY-AMP-6,a,WY-AMP-40,{color:LC,w:2})+line(b,WY-AMP-6,b,WY-AMP-40,{color:LC,w:2})+dbl(a,b,WY-AMP-24,LC,{w:3});
 s+=src?jt(txt,src,(a+b)/2,WY-AMP-52,{size:26,color:LC}):label(txt,(a+b)/2,WY-AMP-52,{size:28,color:LC,anchor:'middle',weight:700});
 return fade(g,s);
}
const cGiven=(g=1)=>fade(g,arrow(60,140,220,140,{color:VCOL,w:5,head:16})+F(`${ct}=3.0${E8}${MS}`,240,150,32,{anchor:'start',color:VCOL}));
function setupPic(xf,{g=1,given=1}={}){
 return media({g})+frontWave(xf,{g})+lamBracket(xf,{g:g*given})+cGiven(g*given);
}
// 動き続ける波（左右とも）。right＝右側の波の濃さ
function fullWave(t,{g=1,right=1}={}){
 const L=[],R=[];for(let x=40;x<=1160;x+=4){const P=[x,WY-hDisp(x,t,HWQ)];if(x<=XB)L.push(P);if(x>=XB-4)R.push(P);}
 return fade(g,line(40,WY,1160,WY,{color:C.faint,w:2,dash:'6 8'})+draw(L,1,{color:LIGHT,w:5}))+fade(g*right,draw(R,1,{color:LIGHT,w:5}));
}
// 山の位置（hDisp が最大）
function crestsAt(t){const out=[];for(let m=-20;m<20;m++){
 const xL=HWQ.x0+HWQ.lam*(t/HWQ.T-.25-m);if(xL>=HWQ.x0&&xL<=XB)out.push(xL);
 const pb=t/HWQ.T-(XB-HWQ.x0)/HWQ.lam,xR=XB+HWQ.lam/HWQ.n*(pb-.25-m);if(xR>XB&&xR<=HWQ.x1)out.push(xR);}
 return out.sort((a,b)=>a-b);}
function bracketPair(t,side,{g=1,txt,y=WY-AMP-30}){
 const cs=crestsAt(t).filter(x=>side<0?x<XB-4&&x>60:x>XB+4&&x<1150);
 if(cs.length<2)return '';const [a,b]=side<0?cs.slice(-2):cs.slice(0,2);
 return fade(g,line(a,WY-AMP-6,a,y-20,{color:LC,w:2})+line(b,WY-AMP-6,b,y-20,{color:LC,w:2})+dbl(a,b,y,LC,{w:3})+label(txt,(a+b)/2,y-18,{size:28,color:LC,anchor:'middle',weight:700}));
}
// 門（黄）。カウンター付き（桃）
function gateG(x,y,{h=200,g=1,count=null,lab='門'}={}){
 let s=rect(x-4,y-h/2,8,h,{fill:C.hi,fo:.85,stroke:'none',rx:3})+rect(x-30,y-h/2-12,60,12,{fill:C.hi,fo:.85,stroke:'none',rx:4});
 if(lab)s+=label(lab,x,y+h/2+32,{size:26,color:C.hi,anchor:'middle',weight:700});
 if(count!==null)s+=rect(x-38,y-h/2-70,76,50,{fill:'#131f38',fo:.95,stroke:FC,sw:2.5,rx:10})+label(String(count),x,y-h/2-33,{size:32,color:FC,anchor:'middle',weight:700});
 return fade(g,s);
}

// ---- 速さの矢印（小問1）---------------------------------------------------------------------------
const AY=230;
function speedPic({g=1,c=1,v=1,wa=0,vlab=1,clab=1}={}){
 let s=rect(XB,120,600,190,{fill:GLASS,fo:.22,stroke:'none',rx:0})+line(XB,120,XB,310,{color:GLINE,w:3});
 s+=label('空気',60,160,{size:26,color:C.dim,weight:700})+label('プラスチック n＝1.25',1170,160,{size:26,color:GLINE,anchor:'end',weight:700});
 s+=arrow(XB-260,AY,XB-10,AY,{color:VCOL,w:7,head:20,g:c});
 if(clab)s+=fade(c,F(`${ct}=3.0${E8}${MS}`,XB-160,AY+52,28,{color:VCOL}));
 s+=arrow(XB+10,AY,XB+210,AY,{color:VCOL,w:7,head:20,g:v});
 if(vlab)s+=fade(v,F(`${vt}=2.4${E8}${MS}`,XB+160,AY+52,28,{color:VCOL}));
 if(wa){s+=arrow(XB+10,AY-40,XB+322,AY-40,{color:C.dim,w:6,head:18,g:wa})+fade(wa,label('A：3.75×10⁸ m/s',XB+330,AY-30,{size:24,color:C.dim,weight:700})+label('×',XB+180,AY-56,{size:40,color:QC.bad,anchor:'middle',weight:700}));}
 return fade(g,s);
}

// ---- 山の列と門（小問2）----------------------------------------------------------------------------
const GX=1040,WL=840,SP=60;
function crestRow(sh,{y=300,h=150,bracket=0,mark=0,g=1,space=0}={}){
 let s=line(40,y+h/2+6,1180,y+h/2+6,{color:C.faint,w:2});
 for(let i=-WL/SP-4;i<=WL/SP+4;i++){const X=GX-WL+SP*i+sh;if(X<40||X>1180)continue;
  const isM=i===0,passedG=X>GX+2,before=GX-WL+SP*i<GX-WL-1;
  const op=passedG?.3:before?.4:1,col=isM&&mark?C.hi:LIGHT;
  s+=fade(op,line(X,y-h/2,X,y+h/2,{color:col,w:isM&&mark?7:4}));}
 s+=gateG(GX,y,{h:h+40});
 if(bracket){const yb=y-h/2-46;
  s+=fade(bracket,line(GX-WL,yb-14,GX-WL,y+h/2,{color:VCOL,w:2,dash:'6 6'})+line(GX,yb-14,GX,y-h/2-24,{color:VCOL,w:2,dash:'6 6'})+dbl(GX-WL,GX,yb,VCOL,{w:4,head:14}));
  s+=fade(bracket,rect(GX-WL/2-190,yb-44,380,40,{fill:C.bg,fo:.9,stroke:'none',rx:8})+jt('門の 手前 ',`3.0${E8}\\ \\mathrm{m}`,GX-WL/2,yb-12,{size:26,color:VCOL}));}
 if(mark){const X=GX-WL+sh,nearG=X>GX-260;s+=fade(mark,label('1秒で 門に 着く 山',nearG?X-24:Math.max(X,150),y+h/2+40,{size:24,color:C.hi,anchor:nearG?'end':'middle',weight:700}));}
 return fade(g,s);
}
// ---- 定規（小問2 の答え）---------------------------------------------------------------------------
function rulers({g=1,div=1}={}){
 const x0=200;let s='';
 s+=label('空気',x0-30,190,{size:26,color:C.dim,anchor:'end',weight:700})+dbl(x0,x0+500,180,LC,{w:5,head:16})+label('500 nm',x0+520,190,{size:30,color:LC,weight:700});
 s+=label('プラスチック',x0-30,290,{size:26,color:GLINE,anchor:'end',weight:700})+dbl(x0,x0+400,280,LC,{w:5,head:16})+label('400 nm',x0+420,290,{size:30,color:LC,weight:700});
 s+=line(x0,150,x0,310,{color:C.faint,w:2,dash:'6 6'});
 s+=fade(div,arrow(x0+760,190,x0+760,270,{color:C.hi,w:4,head:14})+label('÷1.25',x0+790,240,{size:30,color:C.hi,weight:700}));
 return fade(g,s);
}
// ---- 境界の2点（小問3）----------------------------------------------------------------------------
const PT=1.6,PA=70;
const yOsc=(t,y0)=>y0-PA*Math.sin(2*PI*t/PT);
function springZ(x1,y1,x2,y2,{color=C.dim,w=3,n=8,amp=12}={}){
 const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux,pts=[[x1,y1]];
 for(let i=1;i<2*n;i++){const u=i/(2*n),a=i%2?amp:-amp;pts.push([x1+dx*u+nx*a,y1+dy*u+ny*a]);}pts.push([x2,y2]);
 return draw(pts,1,{color,w});
}
function twoPoints(t,{g=1,cx=600,y0=300,gap=180,moving=1,labs=1}={}){
 const xl=cx-gap/2,xr=cx+gap/2,yl=moving?yOsc(t,y0):y0,yr=yl;
 let s=rect(cx,110,cx+600-cx,400,{fill:GLASS,fo:.22,stroke:'none',rx:0})+line(cx,110,cx,510,{color:GLINE,w:3});
 s=fade(1,s);
 s+=line(xl,y0-PA-20,xl,y0+PA+20,{color:C.faint,w:2,dash:'4 6'})+line(xr,y0-PA-20,xr,y0+PA+20,{color:C.faint,w:2,dash:'4 6'});
 s+=springZ(xl,yl,xr,yr,{color:C.dim});
 s+=dot(xl,yl,16,LIGHT)+dot(xr,yr,16,C.hi);
 if(labs)s+=label('すぐ左',xl,y0+PA+60,{size:26,color:C.ink,anchor:'middle',weight:700})+label('すぐ右',xr,y0+PA+60,{size:26,color:C.hi,anchor:'middle',weight:700})
  +label('空気',cx-30,140,{size:24,color:C.dim,anchor:'end',weight:700})+label('プラスチック',cx+30,140,{size:24,color:GLINE,weight:700});
 return fade(g,s);
}
// 揺れの時間のグラフ（上：すぐ左、下：すぐ右）。tt＝描く所までの時刻（秒）
function traces(tt,{g=1,x0=530,x1=1150,ys=[180,370],vlines=0}={}){
 const span=6.4,k=(x1-x0)/span,amp=55;let s='';
 ys.forEach((y,i)=>{
  s+=line(x0,y,x1,y,{color:TCOL,w:2.5})+arrow(x1-4,y,x1+10,y,{color:TCOL,w:2.5,head:10})+line(x0,y-amp-10,x0,y+amp+10,{color:C.dim,w:2});
  s+=label(i?'すぐ右':'すぐ左',x0-16,y+8,{size:24,color:i?C.hi:C.ink,anchor:'end',weight:700});
  const pts=[];for(let u=0;u<=Math.min(tt,span)+1e-6;u+=.04)pts.push([x0+u*k,y-amp*Math.sin(2*PI*u/PT)]);
  if(pts.length>1)s+=draw(pts,1,{color:i?C.hi:LIGHT,w:4});
 });
 s+=label('時間',x1+4,ys[1]+amp+44,{size:24,color:TCOL,anchor:'end',weight:700});
 if(vlines)for(let m=0;m<4;m++){const u=PT*(m+.25);if(u>span)break;const X=x0+u*k;s+=fade(vlines,line(X,ys[0]-amp-14,X,ys[1]+amp+14,{color:C.hi,w:2.5,dash:'8 6'}));}
 return fade(g,s);
}

// 小問3：点が揺れ始めた時刻（push の cue の2文目の始まり）からの秒数。push と same で続けて使う
function pushStart(ctx){
 const sc=ctx?.scene;if(!sc?.captions||!sc.cues)return 0;
 const i=sc.cues.findIndex(c=>c.diagram===K+'push');if(i<0)return 0;
 const d=sc.captions[i].end-sc.captions[i].start,W=sentWin({cue:sc.cues[i],dur:d});
 return (W[1]?W[1][0]:.4)*d;
}
const pushT=ctx=>Math.max(0,tAt(ctx,K+'push')-pushStart(ctx));

export const qxHsWLight1Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約5秒＋静止）=================
 // 縦の境界、左 空気（真空中で 500 nm、c＝3.0×10⁸ m/s）、右 プラスチック（n＝1.25）。淡い黄の波が左から進み、先頭が境界に着いて止まる。
 // 右側の波の形と速さは描かない。
 [K+'q0']:(p)=>{
  const xf=mix(60,XB,clamp(p/.92));
  return setupPic(xf);
 },
 // ================= S1 小問1：速さ =================
 // 1. 出題中の図＋右上寄りに「速さ v ？」「振動数 f ？」「波長 λ ？」
 [K+'setup']:(p)=>{
  let s=setupPic(XB);
  const items=[['速さ',`${vt}`,VCOL],['振動数',`${ft}`,FC],['波長',`${Lt}`,LC]];
  items.forEach(([a,b,col],i)=>{const x=640+i*185,o=seg(p,.45+i*.07,.55+i*.07);
   s+=card(x,110,170,110,label(a,x+85,150,{size:26,color:col,anchor:'middle',weight:700})+F(b+'\\ ?',x+85,196,40),o,col);});
  return s;
 },
 // 2. 求めるもの：中の速さ v。n＝c/v（定義）
 [K+'goal1']:(p)=>{
  let s=fade(1-.75*seg(p,.25,.4),setupPic(XB));
  s+=card(300,140,600,250,F(`${nt}=\\dfrac{${ct}}{${vt}}`,600,250,64)+kindTag('定義',800,190),seg(p,.3,.45),C.ink);
  s+=fade(seg(p,.5,.65),label('真空の 速さ c が、物質の 中の 速さ v の 何倍か',600,360,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 一操作ずつ：×v → nv＝c → ÷n → v＝c/n。2文目で数を入れ、速さの矢印（c と、その 1/1.25 の v）
 [K+'solve']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,u=lin(p,0,b),o1=1-seg(p,b-.02,b+.04),o2=seg(p,b+.02,b+.08);
  let a='';
  a+=F(`${nt}=\\dfrac{${ct}}{${vt}}`,600,150,48);
  a+=fade(seg(u,.08,.2),F(`${nt}\\times${vt}=\\dfrac{${ct}}{${vt}}\\times${vt}`,600,250,46)+label('両辺に ×v',920,250,{size:26,color:C.hi,weight:700}));
  a+=fade(seg(u,.3,.42),line(704,272,734,226,{color:QC.bad,w:4})+line(760,272,790,226,{color:QC.bad,w:4}));
  a+=fade(seg(u,.45,.57),F(`${nt}\\,${vt}=${ct}`,600,340,46));
  a+=fade(seg(u,.6,.72),F(`${vt}=\\dfrac{${ct}}{${nt}}`,600,440,52)+label('両辺を ÷n',920,440,{size:26,color:C.hi,weight:700}));
  let s=fade(o1,a);
  s+=fade(o2,speedPic({c:1,v:seg(p,b+.3,b+.42)*1}));
  s+=fade(o2,F(`${vt}=\\dfrac{${ct}}{${nt}}=\\dfrac{3.0${E8}}{1.25}=2.4${E8}${MS}`,600,420,42));
  s+=fade(seg(p,b+.42,b+.52),label('v の 矢印 ＝ c の 1/1.25 の 長さ',XB,AY+110,{size:24,color:VCOL,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 小問1 の答え D。誤答 A（c に n を掛けた）：灰色の長い矢印に×
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=speedPic({wa:seg(p,b+.02,b+.1)});
  s+=fade(1-seg(p,b-.03,b),F(`${vt}=2.4${E8}${MS}`,600,420,42));
  s+=wrongCard('A','3.75×10⁸ m/s','c に n を 掛けた（物質の 中の ほうが 速くなる）',{g:seg(p,b+.02,b+.08)});
  s+=goalTag(G1)+A1(seg(p,b-.07,b-.01));
  return s;
 },
 // 5. 誤答 B・C を1枚ずつ
 [K+'wrongBC']:(p,ctx)=>{
  let s=speedPic({});
  s+=wrongSeq(p,ctx,[['B','1.25×10⁸ m/s','屈折率の 数を、そのまま 速さの 係数に した'],['C','3.0×10⁸ m/s','どこでも 同じ 速さと した']]);
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：振動数と波長 =================
 // 6. 求めるもの。左側の波に 500 nm＝5.0×10⁻⁷ m（1 nm＝10⁻⁹ m）
 [K+'goal2']:(p)=>{
  let s=media({})+frontWave(XB);
  s+=lamBracket(XB,{g:1-seg(p,.35,.42)});
  s+=lamBracket(XB,{g:seg(p,.42,.5),txt:'500 nm＝',src:`5.0\\times10^{-7}${MM}`});
  s+=fade(seg(p,.5,.6),note('（1 nm＝10⁻⁹ m）',320,140,{size:24}));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 7. 1秒に 3.0×10⁸ m 進む → 門の手前 3.0×10⁸ m までにある山が通る
 [K+'window']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,u=lin(p,b+.25,.94),sh=WL*u;
  let s=crestRow(sh,{bracket:seg(p,b+.02,b+.1),mark:seg(p,b+.12,b+.2)});
  s+=fade(seg(p,.03,.15),arrow(500,118,740,118,{color:VCOL,w:6,head:18})+jt('光は 1秒に ',`3.0${E8}\\ \\mathrm{m}`,620,106,{size:26,color:VCOL,after:' 進む'}));
  s+=card(40,96,180,58,label(u<.001?'時間 0':u<.999?'時間 …':'1秒後',130,134,{size:28,color:TCOL,anchor:'middle',weight:700}),seg(p,b+.2,b+.25),TCOL);
  s+=fade(seg(p,b+.1,b+.2),note('（縮尺は 省略して 描いています）',600,505));
  s+=goalTag(G2);
  return s;
 },
 // 8. 山は 5.0×10⁻⁷ m おき → 3.0×10⁸÷(5.0×10⁻⁷)：数の部分と10の部分に分けて 6.0×10¹⁴ 個。2文目で f＝6.0×10¹⁴ Hz
 [K+'count']:(p,ctx)=>{
  const b=1.2,u=p;
  let s=crestRow(0,{y:190,h:100,bracket:0,mark:0});
  const x1=GX-WL+SP*5,x2=x1+SP;
  s+=fade(seg(u,.02,.12),dbl(x1,x2,262,LC,{w:4,head:12})+F(`5.0\\times10^{-7}${MM}`,(x1+x2)/2,300,28,{color:LC}));
  s+=fade(seg(u,.02,.12),note('（山の 数は 省略して 描いています）',250,305));
  let e=fade(seg(u,.15,.25),F(`3.0${E8}\\div(5.0\\times10^{-7})`,600,350,40));
  e+=fade(seg(u,.35,.45),F(`3.0\\div5.0=0.60`,380,420,36)+F(`10^{8}\\div10^{-7}=10^{15}`,820,420,36));
  e+=fade(seg(u,.6,.7),F(`0.60\\times10^{15}={\\color{${FC}}6.0\\times10^{14}}`,600,490,40)+label('個',832,502,{size:30,color:FC,weight:700}));
  s+=e;
  s+=fade(seg(u,.8,.9),label('1秒に 600兆回',1040,500,{size:24,color:FC,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 8b. f＝6.0×10¹⁴ Hz
 [K+'count2']:(p)=>{
  let s=crestRow(0,{y:190,h:100});
  s+=F(`3.0${E8}\\div(5.0\\times10^{-7})=6.0\\times10^{14}`,600,350,38);
  s+=card(330,400,540,90,F(`${ft}=6.0\\times10^{14}${HZ}`,600,452,44,{color:FC}),seg(p,.05,.2),FC);
  s+=fade(seg(p,.25,.4),label('1秒に 600兆回',1040,450,{size:24,color:FC,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 9. 境界の左右に門。2つのカウンターが同じ数で増える。f は左右で同じ
 [K+'gates']:(p,ctx)=>{
  const t=tAt(ctx,K+'gates'),t0=0;
  let s=media({labs:1})+fullWave(t,{right:.35});
  const nC=passed(XB,t0,t,HWQ);
  s+=gateG(XB-44,WY,{h:230,count:nC,lab:''})+gateG(XB+44,WY,{h:230,count:nC,lab:''});
  s+=fade(seg(p,.05,.15),label('左の 門',XB-54,450,{size:24,color:C.hi,anchor:'end',weight:700})+label('右の 門',XB+54,450,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.62,.75),card(760,108,420,62,label('6.0×10¹⁴ Hz（左右で 同じ）',970,150,{size:26,color:FC,anchor:'middle',weight:700}),1,FC));
  s+=goalTag(G2);
  return s;
 },
 // 10. 右側の波を出す（間隔が詰まる）。λ＝v/f＝2.4×10⁸÷(6.0×10¹⁴)＝4.0×10⁻⁷ m＝400 nm
 [K+'lam']:(p,ctx)=>{
  const t=tAt(ctx,K+'gates');
  let s=media({})+fullWave(t,{right:.35+.65*seg(p,.02,.12)});
  s+=bracketPair(t,-1,{g:seg(p,.1,.2),txt:'500 nm'})+bracketPair(t,1,{g:seg(p,.6,.7),txt:'400 nm'});
  s+=card(40,96,1120,84,F(`${Lt}=\\dfrac{${vt}}{${ft}}=\\dfrac{2.4${E8}}{6.0\\times10^{14}}=4.0\\times10^{-7}${MM}=400${NM}`,600,140,36),seg(p,.15,.28),LC);
  s+=goalTag(G2);
  return s;
 },
 // 11. 小問2 の答え B。500 nm と 400 nm の物差し、÷1.25
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=rulers({g:seg(p,0,.06),div:seg(p,b+.2,b+.3)});
  s+=fade(seg(p,b+.35,b+.45),F(`500\\div1.25=400`,600,400,40)+label('速さと 同じく 1.25分の1',600,460,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(seg(p,b-.07,b-.01));
  return s;
 },
 // 12. 誤答 A・D を1枚ずつ（振動数が変わるとした）
 [K+'wrongAD']:(p,ctx)=>{
  let s=rulers({g:1});
  s+=wrongSeq(p,ctx,[['A','4.8×10¹⁴ Hz、500 nm','波長で なく 振動数が 変わると した'],['D','7.5×10¹⁴ Hz、400 nm','振動数も 変わると した']]);
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 13. 誤答 C：v＝fλ に f 同じ・λ 長い を入れると速くなる
 [K+'wrongC']:(p)=>{
  let s=rulers({g:1});
  s+=wrongCard('C','6.0×10¹⁴ Hz、625 nm',['波長に n を 掛けた','遅くなるはずが、真空より 速くなる（×）'],{y:330,mid:`6.0\\times10^{14}\\times625\\times10^{-9}=3.75\\times10^{8}\\ \\mathrm{m/s}`,midSize:28,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：理由 =================
 // 14. 求めるもの。境界を拡大、すぐ左の点が揺れ、すぐ右の点がつられて同じタイミングで揺れる
 [K+'push']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,t=pushT(ctx);
  let s=twoPoints(t,{g:seg(p,.02,.1)});
  s+=fade(seg(p,b+.1,b+.2),label('（境界の 近くを 拡大）',300,500,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. 二つの点の揺れを時間のグラフで上下に並べ、山の時刻がそろう。小問3 の答え A
 [K+'same']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const t=pushT(ctx),tg=cueT(ctx);
  let s=fade(1,`<g transform="translate(-420 0)">${twoPoints(t,{cx:600,labs:1})}</g>`);
  s+=rect(375,96,825,419,{fill:C.bg,fo:1,stroke:'none',rx:0});
  s+=traces(Math.min(6.4,tg*1.1),{vlines:seg(p,.25,.4)});
  s+=fade(seg(p,.3,.4),label('山の 時刻が そろう',825,500,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(seg(p,voiceEnd(ctx)-.06,voiceEnd(ctx)-.01));
  return s;
 },
 // 16. 誤答 B
 [K+'wrongB']:(p)=>{
  let s=fade(.35,traces(6.4,{vlines:1}));
  s+=wrongCard('B','色は 波長で 決まる','色を 決めるのは 振動数（波長は 物質の 中で 変わる）',{g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 17. 誤答 C・D を1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  let s=fade(.35,traces(6.4,{vlines:1}));
  s+=wrongSeq(p,ctx,[['C','速さが 変わらない','速さは 2.4×10⁸ m/s に 変わる'],['D','屈折率は 関係しない','理由に なっていない']]);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=`<g transform="translate(150 40) scale(.75)">${rect(XB,96,600,330,{fill:GLASS,fo:.22,stroke:'none',rx:0})+line(XB,96,XB,426,{color:GLINE,w:3})+fullWave(t)+gateG(XB-44,WY,{h:200,lab:''})+gateG(XB+44,WY,{h:200,lab:''})}</g>`;
  s=fade(seg(p,.02,.12),s);
  const rows=[['速さ','3.0×10⁸ m/s → 2.4×10⁸ m/s',VCOL],['振動数','6.0×10¹⁴ Hz（左右で 同じ）',FC],['波長','500 nm → 400 nm',LC]];
  let tb=card(150,370,900,140,'',1,C.dim);
  rows.forEach(([a,b,col],i)=>{const y=408+i*40;tb+=label(a,200,y,{size:26,color:col,weight:700})+label(b,360,y,{size:26,color:C.ink,weight:700})+label(i===1?'変わらない':'変わる',1010,y,{size:26,color:i===1?C.F:C.dim,anchor:'end',weight:700});});
  s+=fade(seg(p,.15,.3),tb);
  s+=answerRow([[1,'D','2.4×10⁸ m/s'],[2,'B','6.0×10¹⁴ Hz、400 nm'],[3,'A','']],{g:seg(p,.05,.15),size:22});
  return s;
 },
};
