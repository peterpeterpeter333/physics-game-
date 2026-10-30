// 問題編 解説「3 kg の台車を止める・ぶつける」（q-ui-momentum、大学編 14 運動量・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/14_運動量.md の q-ui-momentum（解説 17 行）。
// 色（単元動画 ys-ui-momentum-1 と同じ）：運動量 p 桃、運動エネルギー K 橙、力 F 緑、速度 v 紫、時間 t 金、強調 黄。右向きが正。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。文字は 22px 以上。
import {C,clamp,mix,seg,fade,label,line,rect,dot,draw,arrow,ground,cart,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-ui-momentum:';
const CP=C.p,CV=C.v,CF=C.F,CT=C.t,CK=C.E,HI=C.hi;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}{${s}}}`;
const PMS='\\,\\mathrm{kg\\cdot m/s}';
const G1='運動量 p と運動エネルギー K',G2='平均の力 F',G3='くっついた後の速度';
const A1=g=>answerTag(1,'C','12 kg·m/s、24 J',{g}),A2=g=>answerTag(2,'D','−30 N',{g}),A3=g=>answerTag(3,'A','右へ 2.5 m/s',{g});
// 読みの中の語 mark が始まる所（cue の進み 0〜1）
function atMark(ctx,mark,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/[\s。]/g,''),i=r.indexOf(mark.replace(/\s/g,''));
 return i<0?fb:i/r.length*voiceEnd(ctx);
}

// ---- 台車と矢印 -------------------------------------------------------------------------------------
const CW=m=>m>=3?190:140,CH=m=>m>=3?64:52;
function cartM(x,fy,m,name,{g=1,w,h}={}){const W=w??CW(m),Hh=h??CH(m);return fade(g,cart(x,fy,{w:W,h:Hh,color:'#9aabc7',text:`${name} ${m} kg`,size:24}));}
const topY=(fy,m)=>fy-16-CH(m),midY=(fy,m)=>fy-16-CH(m)/2;
// 速度の矢印（紫）：台車の上（above）または前の面から
function vUp(x,y,v,{g=1,sc=28,txt}={}){
 if(Math.abs(v)<1e-3||g<=0)return '';const x1=x+v*sc;
 return fade(g,arrow(x,y,x1,y,{color:CV,w:6,head:18})+label(txt??`${Math.abs(v)} m/s`,(x+x1)/2,y-14,{size:24,color:CV,anchor:'middle',weight:700}));
}
// 運動量の矢印（桃）
function pArr(x,y,p,{g=1,sc=22,txt,w=8,side='end'}={}){
 if(Math.abs(p)<1e-3||g<=0)return '';const x1=x+p*sc;
 const t=txt===undefined?'':txt;
 const tl=!t?'':side==='end'?label(t,p>0?x1+12:x1-12,y+9,{size:26,color:CP,anchor:p>0?'start':'end',weight:700}):label(t,(x+x1)/2,y-16,{size:26,color:CP,anchor:'middle',weight:700});
 return fade(g,arrow(x,y,x1,y,{color:CP,w,head:20})+tl);
}
function posDir(x=40,y=110,g=1){return fade(g,arrow(x,y,x+80,y,{color:HI,w:4,head:14})+label('右向きが正（＋）',x+94,y+8,{size:22,color:HI}));}
function dashBox(x,y,w,h,{color=HI,g=1}={}){return fade(g,`<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="14" fill="${color}" fill-opacity=".05" stroke="${color}" stroke-width="3" stroke-dasharray="12 9"/>`);}
// クッション（右の壁に付いている。comp＝縮み 0〜1）。左の面の x を返す値も使う
const CU0=80;
function cushion(wx,fy,comp=0,{g=1,h=78}={}){
 const w=CU0*(1-.45*comp),x0=wx-w,y0=fy-h;
 let s=rect(wx,fy-h-40,22,h+40,{fill:'#3a4a66',fo:.9,stroke:'none',rx:2})+line(wx,fy-h-40,wx,fy,{color:C.dim,w:4});
 s+=rect(x0,y0,w,h,{fill:'#6f7f9c',fo:.35,stroke:'#9aabc7',sw:2.5,rx:12});
 const n=5,pts=[];for(let i=0;i<=n*2;i++)pts.push([x0+w*i/(n*2),y0+h/2+(i%2?16:-16)]);
 s+=draw(pts,1,{color:'#9aabc7',w:2.5});
 return fade(g,s);
}
const cuLeft=(wx,comp)=>wx-CU0*(1-.45*comp);
function stopTag(x,y,g=1){return fade(g,label('0.40 s で止める',x,y,{size:26,color:CT,anchor:'middle',weight:700}));}

// ===================== 小問1 の場面 =====================
const F1=330,X1=300;
function scene1({t=99,run=0,pa=0,ka=0,rows=0,badge=1}={}){
 const x=run?mix(110,X1,clamp(t/1.9)):X1;
 let s=ground(40,600,F1)+posDir(40,170)+cartM(x,F1,3,'台車1');
 const y=midY(F1,3);
 s+=vUp(x+95+10,y,4,{sc:28});
 if(badge)s+=pauseBadge({x:300,y:86,g:run?seg(t,1.9,2.2):1});
 s+=pArr(x-95,topY(F1,3)-26,12,{g:pa,sc:18,txt:'12 kg·m/s'});
 // 下の行：桃の矢印と橙の棒を並べ、単位を並べる
 if(ka){
  s+=fade(ka,label('K',60,418,{size:30,color:CK,weight:700})+rect(100,398,mix(0,24*9,ka),30,{fill:CK,fo:.55,stroke:CK,sw:2,rx:4})+label('24 J',100+24*9+14,423,{size:28,color:CK,weight:700}));
 }
 if(rows){
  s+=fade(rows,label('p',60,478,{size:30,color:CP,weight:700})+arrow(100,468,100+12*12,468,{color:CP,w:8,head:20})+label('12 kg·m/s',100+12*12+14,477,{size:26,color:CP,weight:700})
   +label('向きあり',540,477,{size:24,color:C.dim,anchor:'end'})+label('向きなし',540,423,{size:24,color:C.dim,anchor:'end'}));
 }
 return s;
}
const PX=640,PW=540,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:28,whySize:24};

// ===================== 小問2 の場面 =====================
const F2=280,WX2=590,X2S=130;
const CONTACT2=WX2-CU0-95;          // 台車の中心（前の面がクッションに触れる）
const STOPX2=WX2-CU0*(1-.45)-95;    // 縮み切って止まる位置
// 走る（100 px/s）→ 触れる直前で止める（一時停止）
const runX2=t=>Math.min(X2S+100*t,CONTACT2-4);
const tRun2=(CONTACT2-4-X2S)/100;
// 縮む動き（ゆっくり再生、dur 秒で一様に減速）
function compX2(u){u=clamp(u);return CONTACT2+(STOPX2-CONTACT2)*(1-(1-u)*(1-u));}
function scene2({x=STOPX2,comp=1,v=0,p=0,pTxt='',force=0,tag=0,badge=0,slow=0}={}){
 let s=ground(40,WX2+22,F2)+posDir(40,110)+cushion(WX2,F2,comp)+cartM(x,F2,3,'台車1');
 if(tag)s+=stopTag(WX2-90,F2+56,tag);
 const ty=topY(F2,3);
 if(v)s+=vUp(x,ty-22,4*v,{sc:28,txt:'4 m/s',g:1});
 if(p>0.02)s+=pArr(x-95,v?ty-58:ty-22,12*p,{sc:22,txt:pTxt,side:'mid'});
 if(force)s+=fade(force,arrow(x+95,ty-30,x+95-170,ty-30,{color:CF,w:8,head:22})+label('クッションが押す力',x+95-85,ty-58,{size:24,color:CF,anchor:'middle',weight:700}));
 if(badge)s+=pauseBadge({x:470,y:86,g:badge});
 if(slow)s+=note('ゆっくり再生',WX2-50,F2+100,{g:slow});
 return s;
}
// F–t グラフ（右）。FS：1 N あたりの px、ZY：F＝0 の高さ
const GX=700,TS=840;
function ftGraph({g=1,FS=6,ZY=150,wide=0,thin=0,lab=1,thinLab=0,same=0}={}){
 const X=t=>GX+t*TS,Y=f=>ZY-f*FS;
 let s=arrow(GX-10,ZY,GX+400,ZY,{color:CT,w:3,head:14})+arrow(GX,490,GX,96,{color:CF,w:3,head:14});
 s+=label('t [s]',GX+410,ZY+8,{size:24,color:CT,weight:700})+label('F [N]',GX+14,108,{size:24,color:CF,weight:700});
 if(wide){
  s+=fade(wide,rect(X(0),ZY,X(.4)-X(0),30*FS,{fill:CF,fo:.28,stroke:CF,sw:3,rx:0}));
  s+=fade(wide*lab,line(X(.4),ZY-6,X(.4),ZY+6,{color:CT,w:2.5})+label('0.40',X(.4),ZY-14,{size:24,color:CT,anchor:'middle',weight:700})
   +line(X(0),ZY+30*FS,X(0)-8,ZY+30*FS,{color:CF,w:2.5})+label('−30',X(0)-14,ZY+30*FS+8,{size:24,color:CF,anchor:'end',weight:700}));
  // 金の幅
  s+=fade(wide*lab,line(X(0),ZY+30*FS+22,X(.4),ZY+30*FS+22,{color:CT,w:4})+line(X(0),ZY+30*FS+12,X(0),ZY+30*FS+32,{color:CT,w:3})+line(X(.4),ZY+30*FS+12,X(.4),ZY+30*FS+32,{color:CT,w:3})
   +label('0.40 s',(X(0)+X(.4))/2,ZY+30*FS+56,{size:24,color:CT,anchor:'middle',weight:700}));
 }
 if(thin){
  s+=fade(thin,rect(X(0),ZY,X(.04)-X(0),300*FS,{fill:CF,fo:.5,stroke:HI,sw:3,rx:0}));
  s+=fade(thin*thinLab,line(X(0),ZY+300*FS,X(0)-8,ZY+300*FS,{color:CF,w:2.5})+label('−300',X(0)-14,ZY+300*FS+8,{size:24,color:CF,anchor:'end',weight:700})
   +label('0.040 s',X(.04)+12,ZY+300*FS-6,{size:24,color:CT,weight:700}));
 }
 if(same)s+=fade(same,label('面積 ＝ Δp ＝ −12 N·s（同じ）',X(.04)+20,ZY+130,{size:24,color:HI,weight:700}));
 return fade(g,s);
}

// ===================== 小問3 の場面 =====================
const F3=330,X3A=250,X3B=900,V1=100,V2=50;   // 画面の速さ：4 m/s → 100 px/s、2 m/s → 50 px/s
const TC3=((X3B-70)-(X3A+95))/(V1+V2);       // ぶつかるまでの秒
const XA3=X3A+V1*TC3,XB3=X3B-V2*TC3;          // ぶつかった時の中心
const XM=(XA3*3+XB3*1)/4;                     // 一体の重心（動かす基準）
const PS=18;                                  // 運動量の矢印 1 kg·m/s あたり px
function scene3({xa=X3A,xb=X3B,vel=1,p1=0,p2=0,box=0,push=0,cancel=0,ext=0,badge=0,merged=null}={}){
 let s=ground(40,1160,F3)+posDir(40,110);
 if(merged!==null){
  const dx=merged;
  s+=cartM(XA3+dx,F3,3,'台車1')+cartM(XB3+dx,F3,1,'台車2');
  return s;
 }
 s+=cartM(xa,F3,3,'台車1')+cartM(xb,F3,1,'台車2');
 const yv=topY(F3,3)-24;
 if(vel){s+=vUp(xa,yv,4,{sc:25,g:vel,txt:'4 m/s'})+vUp(xb,yv+12,-2,{sc:25,g:vel,txt:'2 m/s'});}
 const yp=topY(F3,3)-80;
 if(p1)s+=pArr(xa-95,yp,12,{g:p1,sc:PS,txt:'＋12'});
 if(p2)s+=pArr(xb+70,yp,-2,{g:p2,sc:PS,txt:'−2',w:8});
 if(box){const x0=Math.min(xa-95,xb-70)-26,x1=Math.max(xa+95,xb+70)+26;s+=dashBox(x0,118,x1-x0,F3-118+12,{g:box});}
 if(push){
  const xi=xa+95,y=topY(F3,3)-16;
  s+=fade(push,arrow(xi+4,y,xi+110,y,{color:CF,w:7,head:20})+arrow(xi-4,y,xi-110,y,{color:CF,w:7,head:20}));
  if(cancel)s+=fade(cancel,line(xi-120,y+20,xi+120,y-20,{color:HI,w:4})+label('打ち消し合う',xi,y-34,{size:24,color:HI,anchor:'middle',weight:700}));
 }
 if(ext)s+=kindTag('前提',1040,200,{g:ext,text:'外力なし'});
 if(badge)s+=pauseBadge({x:1000,y:86,g:badge});
 return s;
}

export const ytQxUiMomentumDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 s）：0〜2 s 台車1が右へ走り、左寄りで一時停止。2〜4 s 左下に小問2の場面（クッション、「0.40 s で止める」）。
 // 4〜6 s 右下に小問3の場面（台車1と、左へ 2 m/s の台車2）。間に「別々の場面」。値（運動量・エネルギー・力）は出さない。
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx);
  const FY=215,x=mix(110,300,clamp(t/1.9));
  let s=ground(40,1160,FY)+posDir(40,100)+cartM(x,FY,3,'台車1');
  s+=vUp(x+95+10,midY(FY,3),4,{sc:28});
  s+=pauseBadge({x:840,y:150,g:seg(t,1.9,2.2)});
  const g2=seg(t,2,2.6),g3=seg(t,4,4.6);
  // 左下：小問2の場面
  const iy=280,ih=225,FI=iy+ih-30;
  s+=fade(g2,card(20,iy,540,ih,label('小問2 の場面',40,iy+36,{size:24,color:C.dim,weight:700})
   +ground(40,470,FI)+cushion(470,FI,0,{h:62})+cartM(250,FI,3,'台車1',{w:150,h:52})+vUp(250,FI-16-52-20,4,{sc:22,txt:'4 m/s'})
   +stopTag(405,iy+36),1,C.dim));
  // 右下：小問3の場面
  s+=fade(g3,card(640,iy,540,ih,label('小問3 の場面',660,iy+36,{size:24,color:C.dim,weight:700})
   +ground(660,1160,FI)+cartM(760,FI,3,'台車1',{w:150,h:52})+vUp(760,FI-16-52-20,4,{sc:22,txt:'4 m/s'})
   +cartM(1070,FI,1,'台車2',{w:140,h:52})+vUp(1070,FI-16-52-20,-2,{sc:22,txt:'2 m/s'}),1,C.dim));
  s+=fade(g3,rect(530,iy-24,140,44,{fill:'#2a3346',fo:.98,stroke:C.ink,sw:2,rx:22})+label('別々の場面',600,iy+7,{size:24,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // 小問2（3 s）：台車1（右へ 4 m/s）と、前にクッション「0.40 s で止める」。台車はクッションに触れない（止めた後の様子・力は描かない）。
 [K+'q2']:(p,ctx)=>{
  const t=cueT(ctx);
  return scene2({x:mix(X2S,X2S+120,clamp(t/1.6)),comp:0,v:1,tag:seg(t,1.6,2.2),badge:seg(t,1.6,1.9)});
 },
 // 小問3（3 s）：台車1（右へ 4 m/s）と台車2（1 kg、左へ 2 m/s）。ぶつける前で止める。
 [K+'q3']:(p,ctx)=>{
  const t=Math.min(cueT(ctx),1.5);
  return scene3({xa:X3A+V1*t*.5,xb:X3B-V2*t*.5,badge:seg(cueT(ctx),1.5,1.8)});
 },

 // ===================== 小問1 =====================
 // 1. 走る台車1（左寄りで映像を一時停止）。右の枠「小問1／運動量と運動エネルギー」
 [K+'goal1']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=scene1({t,run:1});
  s+=panel(100,220,label('小問1',PC,148,{size:26,color:C.dim,anchor:'middle'})
   +label('台車1（3 kg、右へ 4 m/s）の',PC,205,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('運動量 と 運動エネルギー',PC,262,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 定義 p＝mv。3×4＝12 kg·m/s。台車の上に桃の矢印（右向き）
 [K+'p']:(p,ctx)=>{
  let s=scene1({pa:seg(p,.45,.6)});
  s+=panel(100,300,kindTag('定義',PC,150,{text:'p ＝ mv'})
   +fade(seg(p,.2,.35),T(`${cc(CP,'p')}=mv=3\\times4`,PC,225,40))
   +fade(seg(p,.4,.55),T(`=${cc(CP,'12'+PMS)}`,PC,295,40))
   +fade(seg(p,.6,.75),label('向き：右（＋）',PC,365,{size:28,color:CP,anchor:'middle',weight:700})),seg(p,.02,.12),CP);
  s+=goalTag(G1);
  return s;
 },
 // 3. K＝½mv²＝½×3×16＝24 J。橙の棒。2文目：桃の矢印と橙の棒を並べ、単位を並べる
 [K+'k']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=scene1({pa:1,ka:seg(p,b-.12,b-.02),rows:seg(p,b+.02,b+.12)});
  s+=panel(100,300,T(`${cc(CK,'K')}=\\tfrac{1}{2}mv^2`,PC,160,40)
   +fade(seg(p,.12,.25),T(`=\\tfrac{1}{2}\\times3\\times4^2=\\tfrac{1}{2}\\times3\\times16`,PC,232,34))
   +fade(seg(p,.28,.4),T(`=${cc(CK,'24\\,\\mathrm{J}')}`,PC,300,40))
   +fade(seg(p,b+.05,b+.15),label('速さを 2乗して ½ を付ける',PC,365,{size:26,color:HI,anchor:'middle',weight:700})),seg(p,.02,.1),CK);
  s+=fade(seg(p,b+.15,b+.25),card(PX,415,PW,90,label('運動量 p：kg·m/s',PX+30,456,{size:24,color:CP,weight:700})+label('運動エネルギー K：J',PX+30,490,{size:24,color:CK,weight:700})
   +label('別の 量',PX+PW-30,474,{size:28,color:HI,anchor:'end',weight:700}),1,C.faint));
  s+=goalTag(G1);
  return s;
 },
 // 4. 小問1 の答え C。誤答 A → B を一枚ずつ（右の枠の下）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),a=W[1]?W[1][0]:.3,b=atMark(ctx,'ビーの',.65);
  let s=scene1({pa:1,ka:1,rows:1});
  s+=panel(100,150,T(`${cc(CP,'p')}=${cc(CP,'12'+PMS)}`,PC,150,36)+T(`${cc(CK,'K')}=\\tfrac{1}{2}mv^2=${cc(CK,'24\\,\\mathrm{J}')}`,PC,215,36),1,C.faint);
  s+=wrongSeq(p,ctx,[['A','12 kg·m/s、48 J','K の ½ を落とした',{mid:'3\\times16=48'}],['B','6 kg·m/s、24 J','p に ½ はない',{mid:'\\tfrac{1}{2}\\times3\\times4=6'}]],{win:[[a,b],[b,1]],opts:{...WOPT,y:265}});
  s+=goalTag(G1)+A1(seg(p,.02,.08));
  return s;
 },
 // 5. 誤答 D（½mv）。前のカードを消してから
 [K+'wrong1D']:(p,ctx)=>{
  let s=scene1({pa:1,ka:1,rows:1});
  s+=panel(100,150,T(`${cc(CP,'p')}=${cc(CP,'12'+PMS)}`,PC,150,36)+T(`${cc(CK,'K')}=\\tfrac{1}{2}mv^2=${cc(CK,'24\\,\\mathrm{J}')}`,PC,215,36),1,C.faint);
  s+=wrongCard('D','12 kg·m/s、6 J',['½mv にした（v を 2乗していない）','単位も kg·m/s で、J ではない'],{...WOPT,y:265,mid:'\\tfrac{1}{2}\\times3\\times4=6',g:seg(p,.02,.08)});
  s+=goalTag(G1)+A1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 6. クッションの場面。台車1が走って、触れる直前で映像を一時停止。「0.40 s で止める」
 [K+'goal2']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=scene2({x:runX2(t),comp:0,v:1,tag:seg(p,.3,.45),badge:seg(t,tRun2,tRun2+.3)});
  s+=panel(100,220,label('小問2',PC,148,{size:26,color:C.dim,anchor:'middle'})
   +label('0.40 s で 止めたときの',PC,205,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('クッションの 平均の力',PC,262,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 7. 法則 FΔt＝Δp → F＝Δp÷Δt。2文目：台車がクッションに当たり、桃の矢印が縮んで消える。Δp＝0−12＝−12
 [K+'law']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const t=tAt(ctx,K+'law'),dur=ctx?.dur??10,t0=b*dur+.3,u=clamp((t-t0)/1.6);
  const x=t<t0?CONTACT2-4:compX2(u),pv=t<t0?1:(1-u);
  let s=scene2({x,tag:1,comp:t<t0?0:clamp((x-CONTACT2)/(STOPX2-CONTACT2)),p:seg(p,.05,.15)*pv,pTxt:pv>.98?'12 kg·m/s':'',slow:t>=t0&&t<t0+2.2?1:0});
  if(t>=t0+1.6)s+=fade(clamp((t-t0-1.6)/.3),label('p ＝ 0',CONTACT2-40,topY(F2,3)-50,{size:26,color:CP,anchor:'middle',weight:700}));
  s+=panel(100,300,kindTag('法則',PC,150,{text:'FΔt ＝ Δp'})
   +fade(seg(p,.12,.25),T(`${cc(CF,'F')}=\\dfrac{\\Delta ${cc(CP,'p')}}{\\Delta ${cc(CT,'t')}}`,PC,240,44))
   +fade(seg(p,b+.3,b+.42),T(`\\Delta ${cc(CP,'p')}=0-12=${cc(CP,'-12'+PMS)}`,PC,350,34)),seg(p,.02,.1),CF);
  s+=goalTag(G2);
  return s;
 },
 // 8. F＝−12÷0.40＝−30 N。左向きの緑の矢印、F–t グラフの横軸の下の長方形。2文目で答えの札 D
 [K+'force']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=scene2({force:seg(p,.05,.18)});
  s+=fade(seg(p,.1,.22),T(`${cc(CF,'F')}=\\dfrac{-12}{0.40}=${cc(CF,'-30\\,\\mathrm{N}')}`,320,390,40));
  s+=fade(seg(p,.4,.5),label('マイナス ＝ 左向き',320,470,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=ftGraph({wide:seg(p,.2,.35)});
  s+=goalTag(G2)+A2(seg(p,b,b+.06));
  return s;
 },
 // 9a. 誤答 A（＋30 N）。左の図の下に1枚
 [K+'wrong2A']:(p,ctx)=>{
  let s=scene2({force:1});
  s+=ftGraph({wide:1});
  s+=wrongCard('A','＋30 N','Δp が負なのに右向き',{x:40,w:560,y:330,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 9b. 誤答 B → C（前のカードを消してから、一枚ずつ）
 [K+'wrong2BC']:(p,ctx)=>{
  const b=atMark(ctx,'スィーの',.5);
  let s=scene2({force:1});
  s+=ftGraph({wide:1});
  s+=wrongSeq(p,ctx,[['B','−12 N','0.40 s で割っていない',{mid:'-12'}],['C','−4.8 N','割らずに 0.40 を掛けた',{mid:'-12\\times0.40=-4.8'}]],{win:[[0,b],[b,1]],opts:{x:40,w:560,y:300}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 10. 0.040 s で止めると −300 N。同じ面積の、高く細い長方形を並べる（縦の目盛りを縮めて入れる）
 [K+'short']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const z=seg(p,.05,.22),FS=mix(6,1.05,z),ZY=mix(150,130,z);
  let s=scene2({force:1});
  s+=fade(seg(p,.12,.25),T(`${cc(CF,'F')}=\\dfrac{-12}{0.040}=${cc(CF,'-300\\,\\mathrm{N}')}`,320,390,40));
  s+=fade(seg(p,b,b+.1),label('時間を 延ばすほど 力は 小さい',320,470,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=ftGraph({FS,ZY,wide:1,lab:1-z,thin:seg(p,.2,.32),thinLab:seg(p,.25,.35),same:seg(p,b,b+.1)});
  if(z>.5)s+=fade(z,label('0.40 s・−30 N',GX+.4*TS,ZY+60,{size:24,color:CF,anchor:'end',weight:700}));
  s+=goalTag(G2)+A2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 11. 台車1と台車2の場面（止めたまま）。右の上に「小問3」
 [K+'goal3']:(p)=>{
  let s=scene3({});
  s+=card(330,400,540,100,label('小問3：ぶつかって くっついた 後の 速度',600,460,{size:26,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 12. 台車2：速度 −2 m/s、運動量 1×(−2)＝−2。台車1：＋12
 [K+'p2']:(p)=>{
  let s=scene3({p2:seg(p,.45,.58),p1:seg(p,.6,.72)});
  s+=fade(seg(p,.15,.3),T(`${cc(CV,'v_2')}=${cc(CV,'-2\\,\\mathrm{m/s}')}`,330,440,36));
  s+=fade(seg(p,.45,.58),T(`${cc(CP,'p_2')}=1\\times(-2)=${cc(CP,'-2'+PMS)}`,820,440,36));
  s+=goalTag(G3);
  return s;
 },
 // 13. 2台を点線の枠で囲む。ぶつかる瞬間、向かい合う緑の矢印に打ち消し線。2文目：「外力なし」と「合計は変わらない」
 [K+'box']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const t=tAt(ctx,K+'box'),u=Math.min(t,TC3),hit=t>=TC3;
  let s=scene3({xa:X3A+V1*u,xb:X3B-V2*u,vel:hit?0:1,box:seg(p,.03,.12),push:hit?clamp((t-TC3)/.4):0,cancel:hit?clamp((t-TC3-.9)/.4):0,ext:seg(p,b,b+.08),badge:hit?clamp((t-TC3)/.3):0});
  s+=fade(seg(p,b+.12,b+.22),label('枠の中の 合計の 運動量は 変わらない',600,450,{size:30,color:CP,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 14a. 桃の矢印 ＋12 と −2 を継ぎ足す → 右向き 10。くっついた後は 4 kg
 [K+'total']:(p)=>{
  const j=seg(p,.1,.35);
  let s=scene3({xa:XA3,xb:XB3,vel:0,p1:0,p2:0,box:1,badge:1});
  const yp=topY(F3,3)-70,x0=XA3-95,tip=x0+12*PS;
  s+=pArr(x0,yp,12,{sc:PS,txt:'＋12',side:'mid'});
  const x2=mix(XB3+70,tip,j),y2=mix(yp,yp+16,j);
  s+=pArr(x2,y2,-2,{sc:PS})+label('−2',x2+10,y2+9,{size:26,color:CP,weight:700});
  s+=fade(seg(p,.35,.45),arrow(x0,yp+46,x0+10*PS,yp+46,{color:CP,w:10,head:22})+label('10',x0+10*PS+12,yp+55,{size:28,color:CP,weight:700}));
  s+=fade(seg(p,.25,.4),T(`12+(-2)=${cc(CP,'10'+PMS)}`,330,450,34));
  s+=fade(seg(p,.6,.72),label('くっついた後：3 ＋ 1 ＝ 4 kg',860,456,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 14b. 10÷4＝2.5 m/s。2台が一体になって右へ（紫 2.5 m/s）。答えの札 A
 [K+'ans3']:(p,ctx)=>{
  const t=cueT(ctx),dx=Math.min(t*62.5,260),stop=t*62.5>=260;
  let s=scene3({merged:dx});
  const yp=topY(F3,3)-80,x0=XA3-95+dx;
  s+=arrow(x0,yp,x0+10*PS,yp,{color:CP,w:10,head:22})+label('10 kg·m/s',x0+10*PS+12,yp+9,{size:26,color:CP,weight:700});
  s+=vUp(XM+dx,topY(F3,3)-24,2.5,{sc:40,txt:'2.5 m/s'});
  s+=T(`${cc(CV,'v')}=\\dfrac{10}{4}=${cc(CV,'2.5\\,\\mathrm{m/s}')}`,330,440,40);
  s+=fade(seg(p,.25,.4),label('右向き（＋）',820,452,{size:30,color:CV,anchor:'middle',weight:700}));
  if(stop)s+=pauseBadge({x:1000,y:86,g:clamp((t*62.5-260)/20)});
  s+=goalTag(G3)+A3(seg(p,atMark(ctx,'しょうもん さんの',.7),atMark(ctx,'しょうもん さんの',.7)+.06));
  return s;
 },
 // 15. 誤答 B → C（一枚ずつ、床の下）
 [K+'wrong3']:(p,ctx)=>{
  const b=atMark(ctx,'スィーの',.5);
  let s=scene3({merged:260})+pauseBadge({x:1000,y:86});
  const yp=topY(F3,3)-80,x0=XA3-95+260;
  s+=arrow(x0,yp,x0+10*PS,yp,{color:CP,w:10,head:22})+label('10 kg·m/s',x0+10*PS+12,yp+9,{size:26,color:CP,weight:700});
  s+=wrongSeq(p,ctx,[['B','3.5 m/s','12＋2＝14 と符号を付けずに足した',{mid:'(12+2)\\div4=3.5'}],['C','3.0 m/s','台車2の運動量を入れていない',{mid:'12\\div4=3.0'}]],{win:[[0,b],[b,1]],opts:{x:150,w:900,y:348,midSize:30}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 16. 誤答 D（質量の重みがない単純平均）
 [K+'wrong3D']:(p)=>{
  let s=scene3({merged:260})+pauseBadge({x:1000,y:86});
  const yp=topY(F3,3)-80,x0=XA3-95+260;
  s+=arrow(x0,yp,x0+10*PS,yp,{color:CP,w:10,head:22})+label('10 kg·m/s',x0+10*PS+12,yp+9,{size:26,color:CP,weight:700});
  s+=wrongCard('D','1.0 m/s','(4−2)÷2、質量の重みがない',{x:150,w:900,y:348,midSize:30,mid:'(4-2)\\div2=1.0',g:seg(p,.02,.08)});
  s+=goalTag(G3)+A3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 17. FΔt＝Δp と、点線の枠を並べる。右上に答えの札3枚
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s='';
  // 左：力積で運動量が変わる（台車とクッション、桃の矢印）
  s+=card(30,96,555,400,
   label('力積の 分だけ 変わる',307,140,{size:28,color:C.ink,anchor:'middle',weight:700})
   +T(`${cc(CF,'F')}\\Delta ${cc(CT,'t')}=\\Delta ${cc(CP,'p')}`,307,215,48)
   +ground(60,560,430)+cushion(540,430,0,{h:60})+cart(330,430,{w:150,h:52,color:'#9aabc7',text:'台車1',size:24})
   +arrow(255,330,255+12*14,330,{color:CP,w:8,head:20})+label('p',240,340,{size:28,color:CP,anchor:'end',weight:700})
   +arrow(400,352,280,352,{color:CF,w:7,head:20}),seg(p,.03,.15),CF);
  // 右：枠の中の合計は一定
  s+=card(615,96,555,400,
   label('外力が なければ 合計は 一定',892,140,{size:28,color:C.ink,anchor:'middle',weight:700})
   +ground(640,1150,430)+cart(800,430,{w:150,h:52,color:'#9aabc7',text:'台車1',size:24})+cart(955,430,{w:130,h:52,color:'#9aabc7',text:'台車2',size:24})
   +`<rect x="700" y="200" width="350" height="242" rx="14" fill="${HI}" fill-opacity=".05" stroke="${HI}" stroke-width="3" stroke-dasharray="12 9"/>`
   +T(cc(CP,'p_1+p_2'),830,250,36)+label('＝ 一定',900,262,{size:30,color:CP,weight:700}),seg(p,b,b+.12),HI);
  s+=answerRow([[1,'C',''],[2,'D','−30 N'],[3,'A','右へ 2.5 m/s']],{g:seg(p,.8,.9)});
  return s;
 },
};
