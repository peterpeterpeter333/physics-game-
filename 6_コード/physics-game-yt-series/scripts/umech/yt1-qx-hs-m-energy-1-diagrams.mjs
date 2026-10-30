// 問題編 解説「斜めに引かれる台車」(ys-qx-hs-m-energy-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/107_仕事とエネルギー.md の q-hs-m-energy-1（解説 19 行）。
// 色（単元動画 ys-hs-m-energy-1 と同じ）：仕事・エネルギー 橙（K 濃い橙）、力 緑、速度 紫、距離 水色、強調 黄。角の印は白の細線。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,lin,fade,label,line,rect,arrow,tex,texWidth,ground,cart,axes,clamp} from './anim.mjs';
import {WC,KC,FA,VA} from './yt1-hs-m-energy-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,pauseBadge,note,cueT,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-energy-1:';
const W2='#b9f5dc';                     // 力の成分（薄い緑）
const G1='16 N の力がした仕事 W',G2='4.0 m 後の速さ v',G3='垂直抗力がした仕事';
const A1=g=>answerTag(1,'A','32 J',{g}),A2=g=>answerTag(2,'C','5.0 m/s',{g}),A3=g=>answerTag(3,'B','0 J',{g});
// 読みの中で word が始まる所（cue の進み 0〜1）。字幕に合わせて札を出すのに使う。
function wAt(ctx,word,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});

// ---- 台車の図 ----------------------------------------------------------------------------------
const GY=420,VK=28;           // 床の高さ、速度の矢印 1 m/s あたりの長さ
function arcP(cx,cy,r,a0,a1,{color=C.ink,w=2.5}={}){
 const P=a=>[cx+r*Math.cos(a*Math.PI/180),cy-r*Math.sin(a*Math.PI/180)],[x0,y0]=P(a0),[x1,y1]=P(a1);
 return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 0 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
}
const sq=(x,y,dx,dy,col=C.ink)=>`<path d="M${x+dx} ${y} L${x+dx} ${y+dy} L${x} ${y+dy}" fill="none" stroke="${col}" stroke-width="2.5"/>`;
// o：X0＝物差しの 0 の位置、PX＝1 m あたりの長さ、xm＝台車の位置（m）、v＝速度の札（'' なら出さない）
function rig({X0=250,PX=150,xm=0,v='',vlab='',vg=1,F=1,Fo=1,N=1,No=1,mv=1,ang=1,ruler=1,comp=0,hx=0,vf=0,hiF=0,hiR=0,hiAng=0,mark4=0,floor=1,fric=1,g=1,Nhi=0}={}){
 const cx=X0+xm*PX,ax=cx+40,ay=GY-78,L=180,ex=ax+L*.5,ey=ay-L*.866;
 let s='';
 if(floor)s+=ground(Math.max(10,X0-200),Math.min(1190,X0+4*PX+290),GY);
 if(fric&&floor)s+=note('摩擦 なし',Math.min(1100,X0+4*PX+200),GY+44,{g:fric});
 if(ruler){
  let r=line(X0,GY+34,X0+4*PX,GY+34,{color:C.x,w:3});
  for(let i=0;i<=4;i++)r+=line(X0+i*PX,GY+24,X0+i*PX,GY+44,{color:C.x,w:3})+label(i?`${i}.0`:'0',X0+i*PX,GY+74,{size:22,color:C.x,anchor:'middle',weight:700});
  r+=label('m',X0+4*PX+34,GY+74,{size:22,color:C.x,weight:700});
  if(hiR)r+=fade(hiR,rect(X0-14,GY+18,4*PX+28,68,{fill:C.hi,fo:.08,stroke:C.hi,sw:3,rx:10}));
  if(mark4)r+=fade(mark4,line(X0+4*PX,GY-120,X0+4*PX,GY+46,{color:C.hi,w:3,dash:'8 6'})+rect(X0+4*PX-30,GY+50,60,34,{fill:C.hi,fo:.15,stroke:C.hi,sw:3,rx:8}));
  s+=fade(ruler,r);
 }
 s+=cart(cx,GY,{w:150,h:62,color:'#9fb3d1',text:'4.0 kg',size:24});
 if(mv)s+=fade(mv,arrow(cx+90,GY-30,cx+165,GY-30,{color:C.ink,w:4,head:14})+label('動き',cx+174,GY-21,{size:22,color:C.ink,weight:700}));
 if(N)s+=fade(No,FA(cx-45,GY-80,cx-45,GY-190,{g:N})+fade(N,label('垂直抗力',cx-45,GY-204,{size:24,color:C.F,anchor:'middle',weight:700})));
 if(Nhi)s+=fade(Nhi,rect(cx-62,GY-200,34,124,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:10}));
 if(v)s+=fade(vg,VA(cx+110,GY-130,cx+110+VK*parseFloat(v),GY-130)+label(v,cx+118+VK*parseFloat(v),GY-122,{size:26,color:C.v,weight:700})+(vlab?label(vlab,cx+110,GY-154,{size:22,color:C.v,weight:700}):''));
 // 斜めの力
 if(ang)s+=fade(ang*(1-hx),line(ax,ay,ax+140,ay,{color:C.ink,w:2,dash:'6 6'}))+fade(ang,arcP(ax,ay,54,0,60,{color:hiAng>.5?C.hi:C.ink})+label('60°',ax+66,ay-22,{size:26,color:hiAng>.5?C.hi:C.ink,weight:700}));
 if(comp){
  s+=fade(comp,line(ax+L*.5,ay,ex,ey,{color:W2,w:2.5,dash:'7 7'})+line(ax,ay-L*.866,ex,ey,{color:W2,w:2.5,dash:'7 7'}));
  s+=fade(comp*(1-hx),line(ax,ay,ax+L*.5,ay,{color:W2,w:4,dash:'8 6'}));
  s+=fade(comp*(1-.7*vf),line(ax,ay,ax,ay-L*.866,{color:W2,w:4,dash:'8 6'}));
 }
 if(hx)s+=arrow(ax,ay,ax+L*.5,ay,{color:hiAng>.5?C.hi:C.F,w:8,head:20,g:hx})+fade(hx,label('8.0 N',ax+L*.5+14,ay+9,{size:26,color:C.F,weight:700}));
 if(F)s+=fade(Fo,FA(ax,ay,ex,ey,{g:F,w:8,head:22})+fade(F,label('16 N',ex+14,ey+8,{size:28,color:C.F,weight:700})));
 if(hiF)s+=fade(hiF,`<line x1="${ax}" y1="${ay}" x2="${ex}" y2="${ey}" stroke="${C.hi}" stroke-width="20" stroke-opacity=".22" stroke-linecap="round"/>`);
 return fade(g,s);
}
// 出題中の図の時間の流れ（t 秒、0〜7）
function q0At(t){
 let xm,move=0;
 if(t<2)xm=-1.5+1.5*(t/2);
 else if(t<4.5)xm=0;
 else{const u=clamp((t-4.5)/2);xm=3*u+u*u;move=u>0&&u<1?1:0;}
 const F=seg(t,2.1,2.6),ang=seg(t,2.4,2.9),N=seg(t,2.7,3.2),mv=seg(t,3.0,3.5),ruler=seg(t,4.0,4.5);
 const vg=t<4.5?1:1-seg(t,4.5,4.7);
 const badge=t>=2&&t<4.5?seg(t,2,2.15)*(1-seg(t,4.4,4.5)):seg(t,6.5,6.65);
 return {xm,F,ang,N,mv,ruler,vg,badge};
}
function q0Pic(t,{X0=250,PX=150}={}){
 const o=q0At(t);
 return rig({X0,PX,xm:o.xm,v:'3.0 m/s',vg:o.vg,F:o.F,N:o.N,mv:o.mv,ang:o.ang,ruler:o.ruler})+pauseBadge({g:o.badge});
}
// S1・S2 の基本の図（台車は物差しの 0、紫の矢印は出発時の値）
const base=(o={})=>rig({v:'3.0 m/s',vlab:'出発時',...o});
const small=(o={})=>rig({X0:150,PX:95,v:'3.0 m/s',vlab:'出発時',fric:0,...o});
// ---- F-x グラフ（右）------------------------------------------------------------------------
function fxGraph({g=1,fill=1,val=1,hi=0}={}){
 const A=axes({x:660,y:440,w:420,h:300,xmax:4.8,ymax:10.5,xlabel:'x [m]',ylabel:'F [N]',xticks:[1,2,3,4],yticks:[8],grid:true,g,xcolor:C.x,ycolor:C.F});
 let s=A.svg;
 s+=fade(g,line(A.X(0),A.Y(8),A.X(4),A.Y(8),{color:C.F,w:5}));
 const w=(A.X(4)-A.X(0))*fill;
 s+=fade(g*seg(fill,0,.05),rect(A.X(0),A.Y(8),w,A.Y(0)-A.Y(8),{fill:WC,fo:.45,stroke:WC,sw:2,rx:2}));
 s+=fade(g*val,label('32 J',(A.X(0)+A.X(4))/2,(A.Y(0)+A.Y(8))/2+12,{size:40,color:C.ink,anchor:'middle',weight:700}));
 if(hi)s+=fade(hi,rect(A.X(0)-6,A.Y(8)-6,A.X(4)-A.X(0)+12,A.Y(0)-A.Y(8)+12,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:6}));
 return s;
}
// ---- K の棒（右、濃い橙）--------------------------------------------------------------------
const BX=1010,BB=462,BK=5.2;
function kBar({frame=1,k18=0,k32=0,blink=0,lab=1,addK=0}={}){
 let s=card(905,150,210,355,'',frame,KC)+fade(frame,label('運動エネルギー K',1010,494,{size:22,color:KC,anchor:'middle',weight:700}));
 s+=fade(frame,line(925,BB,1095,BB,{color:C.dim,w:3}));
 const h18=18*BK*k18,h32=32*BK*k32;
 if(k18>0)s+=fade(1-.6*blink,rect(BX-45,BB-h18,90,h18,{fill:KC,fo:.6,stroke:KC,sw:2,rx:3}));
 if(k18>.9&&lab)s+=label('18 J',BX,BB-h18/2+9,{size:26,color:C.bg,anchor:'middle',weight:700});
 if(k32>0)s+=rect(BX-45,BB-18*BK-h32,90,h32,{fill:WC,fo:.4,stroke:KC,sw:2,rx:3});
 if(k32>.9&&lab)s+=label('＋32 J',BX,BB-18*BK-h32/2+9,{size:26,color:C.ink,anchor:'middle',weight:700});
 if(k32>.98&&lab)s+=label('50 J',BX,BB-50*BK-12,{size:28,color:C.hi,anchor:'middle',weight:700});
 if(addK)s+=fade(addK,rect(BX-60,BB-50*BK-44,120,50*BK+52,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:10})+label('足すのは K',BX,136,{size:26,color:C.hi,anchor:'middle',weight:700}));
 return s;
}
const WKE=`{\\color{${WC}}W}=\\tfrac12 mv^2-\\tfrac12 mv_0^2`;

export const qxHsMEnergy1Diagrams={
 // ================= 問題アニメ：出題中（7 秒＋静止）=================
 // 0〜2 s 台車が 3.0 m/s で来る → 0 の位置で一時停止、16 N・60°・垂直抗力・動き → 物差し → 再開（速度の表示は消す）→ 4.0 m で一時停止。
 [K+'q0']:(p,ctx)=>q0Pic(7*p),
 // ================= S1 小問1 =================
 // 1. 出題中の図を再生し、終わりに台車を 0 の位置（出発時 3.0 m/s）へ戻す
 [K+'setup']:(p,ctx)=>{
  const t=Math.min(7,cueT(ctx)),back=seg(p,.78,.86);
  return fade(1-back,q0Pic(t))+fade(back,base());
 },
 // 2. 求めるもの。16 N の矢印と物差しを黄で縁取る
 [K+'goal1']:(p)=>base({hiF:seg(p,.3,.45),hiR:seg(p,.5,.65)})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. 斜めの力を、動く向きと垂直な向きに分ける（点線）
 [K+'split']:(p)=>{
  let s=base({comp:seg(p,.45,.7),No:.35,mv:1});
  s+=fade(seg(p,.6,.75),label('動く 向き',560,GY-160,{size:24,color:W2,weight:700})+label('垂直な 向き',140,GY-230,{size:24,color:W2,anchor:'end',weight:700}));
  return s+goalTag(G1);
 },
 // 4. 動く向きの成分 Fcosθ＝16×0.50＝8.0 N。60° と水平の辺を黄に
 [K+'comp']:(p,ctx)=>{
  const b=wAt(ctx,'じゅうろくかける',.5);
  let s=base({comp:1,hx:seg(p,.1,.25),vf:seg(p,.1,.25),hiAng:seg(p,.15,.25)>.5?1:0,No:.35});
  s+=card(620,96,560,90,fade(1-seg(p,b,b+.06),T(`F\\cos\\theta`,900,150,40))+fade(seg(p,b,b+.06),T(`F\\cos\\theta=16\\times 0.50=8.0\\ \\mathrm{N}`,900,150,38)),seg(p,.05,.15),C.F);
  return s+goalTag(G1);
 },
 // 5. 【図＋グラフ】F-x グラフの長方形 8.0×4.0＝32 J。答え A
 [K+'ans1']:(p,ctx)=>{
  const a=wAt(ctx,'しょうもん',.6);
  let s=small({comp:1,hx:1,vf:1,No:.35,Fo:.6});
  s+=fxGraph({g:seg(p,.02,.12),fill:lin(p,.12,.4),val:seg(p,.38,.46)});
  s+=fade(seg(p,.3,.4),T(`8.0\\times 4.0=32\\ \\mathrm{J}`,880,110,36));
  return s+goalTag(G1)+A1(seg(p,a,a+.06));
 },
 // 6. 誤答 B・C（1枚ずつ）。C の間、垂直成分の点線を光らせて「動く向きではない」
 [K+'wrongBC']:(p,ctx)=>{
  const c=wAt(ctx,'スィーの',.5),inC=seg(p,c,c+.05),bl=inC*(.5+.5*Math.sin(cueT(ctx)*7)**2);
  let s=small({comp:1,hx:1,vf:1-inC,No:.35,Fo:.6});
  const ax=150+40,ay=GY-78;
  s+=fade(bl,line(ax,ay,ax,ay-156,{color:C.hi,w:8}));
  s+=fade(inC,label('動く 向き では ない',ax,ay-182,{size:24,color:C.hi,weight:700}));
  s+=wrongSeq(p,ctx,[['B','64 J','cos60° を 掛け忘れた',{mid:`16\\times 4.0`}],['C','約56 J','動く 向きの 成分に sin60° を 使った',{mid:`16\\times 0.87\\times 4.0`}]],{win:[[0,c],[c,1]],opts:{x:600,w:580,y:130,whySize:24}});
  return s+goalTag(G1)+A1(1);
 },
 // 7. 誤答 D（4.0 m 動いた後の K）
 [K+'wrongD']:(p)=>{
  let s=small({comp:1,hx:1,vf:1,No:.35,Fo:.6});
  s+=wrongCard('D','50 J','動いた 後の K と 取り違えた',{x:600,w:580,y:130,g:seg(p,.03,.1)});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2 =================
 // 8. 求めるもの：4.0 m 後の速さ。物差しの 4.0 m を黄で
 [K+'goal2']:(p)=>base({mark4:seg(p,.3,.45),Fo:.6})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 9. W＝½mv²−½mv₀²。½mv₀² を黄で囲む。右に K の棒の枠
 [K+'wke']:(p,ctx)=>{
  const b=wAt(ctx,'ダブリュー',.4);
  let s=small({mark4:1,Fo:.6});
  s+=card(380,96,490,96,T(WKE,625,148,40),seg(p,b-.05,b+.05),WC);
  const w=texWidth(WKE,40),t=texWidth(`\\tfrac12 mv_0^2`,40),tx=625+w/2-t/2;
  s+=fade(seg(p,b+.2,b+.3),rect(tx-t/2-5,114,t+14,68,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8})+label('はじめの K',tx,224,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=kBar({frame:seg(p,.75,.88)});
  return s+goalTag(G2);
 },
 // 10. 18 J の棒が伸び、その上に 32 J が積み上がって 50 J
 [K+'bars']:(p,ctx)=>{
  const b=wAt(ctx,'しごとさんじゅうに',.55);
  let s=small({mark4:1,Fo:.6});
  s+=card(380,96,490,96,T(`\\tfrac12\\times 4.0\\times 3.0^2=18\\ \\mathrm{J}`,625,148,38),seg(p,.03,.12),KC);
  s+=kBar({k18:seg(p,.15,b),k32:seg(p,b,b+.2)});
  s+=fade(seg(p,b,b+.1),label('仕事 32 J が 加わる',625,236,{size:26,color:WC,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 11. 【式 → 図】½×4.0×v²＝50 → 2.0v²＝50 → v²＝25 → v＝5.0。4.0 m の台車に 5.0 m/s（0 の 3.0 m/s と並べる）。答え C
 [K+'ans2']:(p,ctx)=>{
  const sw=wAt(ctx,'ハヤサは',.6),a=wAt(ctx,'しょうもん',.8),eq=1-seg(p,sw+.02,sw+.08),pic=seg(p,sw+.06,sw+.12);
  const rows=[`\\tfrac12\\times 4.0\\times v^2=50`,`2.0\\,v^2=50`,`v^2=25`,`v=5.0\\ \\mathrm{m/s}`];
  let e='';rows.forEach((r,i)=>{e+=fade(seg(p,.03+i*sw/4.6,.08+i*sw/4.6),T(r,600,140+i*82,44));});
  let s=fade(eq,card(250,90,700,350,e,1,C.v));
  let q=rig({X0:200,PX:140,xm:0,F:0,N:0,mv:0,ang:0,v:'3.0 m/s',vlab:'出発時',fric:0,g:.45});
  q+=rig({X0:200,PX:140,xm:4,F:0,N:0,mv:0,ang:0,v:'5.0 m/s',floor:0,ruler:0,vlab:'4.0 m 後'});
  s+=fade(pic,q);
  return s+goalTag(G2)+A2(seg(p,a,a+.06));
 },
 // 12. 誤答 A（18 J を足し忘れた）。棒の 18 J を点滅
 [K+'wrongA2']:(p,ctx)=>{
  const bl=seg(p,.1,.2)*(.5+.5*Math.sin(cueT(ctx)*6));
  let s=kBar({k18:1,k32:1,blink:bl});
  s+=card(60,96,780,96,T(`2.0\\,v^2=18+32=50`,450,148,40),1,KC);
  s+=wrongCard('A','4.0 m/s','18 J を 足し忘れた',{x:60,w:780,y:240,mid:`2.0\\,v^2=32`,g:seg(p,.03,.1)});
  return s+goalTag(G2)+A2(1);
 },
 // 13. 誤答 B・D（1枚ずつ）。2文目で「足すのは K」
 [K+'wrongBD2']:(p,ctx)=>{
  const d=wAt(ctx,'ディーの',.3),b2=wAt(ctx,'たしてよい',.65);
  let s=kBar({k18:1,k32:1,addK:seg(p,b2,b2+.06)});
  s+=card(60,96,780,96,T(`2.0\\,v^2=18+32=50`,450,148,40),1,KC);
  s+=wrongSeq(p,ctx,[['B','7.0 m/s','速さを 足した',{mid:`3.0+4.0`}],['D','約6.4 m/s','仕事を 64 J と した',{mid:`2.0\\,v^2=18+64`}]],{win:[[0,d],[d,1]],opts:{x:60,w:780,y:240}});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3 =================
 // 14. 求めるもの：垂直抗力の仕事。上向きの垂直抗力を黄で縁取る
 [K+'goal3']:(p)=>s3({Nhi:seg(p,.3,.45)})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 垂直抗力・重力と、動きの間に直角の印
 [K+'perp']:(p,ctx)=>{
  const b=wAt(ctx,'したむき',.4);
  return s3({ra:seg(p,.1,.25),mg:seg(p,b,b+.1),ramg:seg(p,b+.1,b+.2)})+goalTag(G3);
 },
 // 16. 動く向きの成分は 0 → 仕事 0。答え B
 [K+'ans3']:(p,ctx)=>{
  const a=wAt(ctx,'しょうもん',.6);
  return s3({ra:1,mg:1,ramg:1,zero:seg(p,.05,.3),z0:seg(p,.35,.5)})+goalTag(G3)+A3(seg(p,a,a+.06));
 },
 // 17. 誤答 A・C（1枚ずつ）
 [K+'wrongAC3']:(p,ctx)=>{
  const c=wAt(ctx,'スィーは',.5);
  let s=s3({ra:1,mg:1,ramg:1,z0:1,X0:110});
  s+=wrongSeq(p,ctx,[['A','32 J','力ごとに 仕事は 違う'],['C','正の 値','向きを 見ていない']],{win:[[0,c],[c,1]],opts:{x:640,w:540,y:120}});
  return s+goalTag(G3)+A3(1);
 },
 // 18. 誤答 D。横に小さく、動きと逆向きの力（これなら負）
 [K+'wrongD3']:(p,ctx)=>{
  const b=wAt(ctx,'ふになるのは',.45),g2=seg(p,b,b+.08);
  let s=s3({ra:1,mg:1,ramg:1,z0:1,X0:110});
  s+=wrongCard('D','負の 値','垂直なら 0',{x:640,w:540,y:100,g:seg(p,.03,.1)});
  // 逆向きの力の小さな図
  let m=rect(640,262,540,200,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
  m+=line(680,420,1140,420,{color:C.dim,w:3})+rect(850,360,110,56,{fill:'#9fb3d1',fo:.3,stroke:'#9fb3d1',rx:8});
  m+=arrow(980,388,1080,388,{color:C.ink,w:4,head:14})+label('動き',1030,374,{size:22,color:C.ink,anchor:'middle',weight:700});
  m+=FA(840,388,720,388,{w:8,head:20})+label('逆向きの 力',780,350,{size:24,color:C.F,anchor:'middle',weight:700});
  m+=label('これなら 負',910,310,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(g2,m);
  return s+goalTag(G3)+A3(1);
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p)=>{
  let s=rig({X0:150,PX:95,v:'',F:1,comp:1,hx:1,vf:1,N:1,mv:1,fric:0,ruler:.6});
  const rows=[
   [`8.0\\ \\mathrm{N}\\times 4.0\\ \\mathrm{m}=32\\ \\mathrm{J}`,WC,.05],
   [`K:\\ 18+32=50\\ \\mathrm{J}`,KC,.17],
   [`v=5.0\\ \\mathrm{m/s}`,C.v,.29],
  ];
  rows.forEach(([r,col,a],i)=>{s+=card(620,96+i*86,560,70,T(r,900,136+i*86,34),seg(p,a,a+.08),col);
   if(i)s+=fade(seg(p,a,a+.08),label('↓',600,128+i*86,{size:28,color:C.dim,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.05,.13),line(190+95,GY-78,620,131,{color:WC,w:2,dash:'6 6'}));
  s+=card(620,360,560,62,label('垂直抗力：直角 → 0 J',900,401,{size:28,color:C.F,anchor:'middle',weight:700}),seg(p,.41,.49),C.F);
  s+=fade(seg(p,.41,.49),line(105,GY-190,620,391,{color:C.F,w:2,dash:'6 6'}));
  s+=card(760,436,280,66,T(`W=\\Delta K`,900,472,40,{color:C.hi,auto:false}),seg(p,.55,.63),C.hi);
  s+=answerRow([[1,'A','32 J'],[2,'C','5.0 m/s'],[3,'B','0 J']],{g:seg(p,.7,.8)});
  return s;
 },
};
// S3 の図：台車は 2.0 m の所。垂直抗力は台車の上の点 P から上へ、動きは P から右へ（直角の印）
function s3({X0=250,Nhi=0,ra=0,mg=0,ramg=0,zero=0,z0=0}={}){
 const PX=150,cx=X0+2*PX,px=cx-10,py=GY-90;
 let s=rig({X0,PX,xm:2,F:0,ang:0,N:0,mv:0,fric:0,ruler:0});
 s+=FA(px,py,px,py-110,{w:8,head:22})+label('垂直抗力',px-14,py-70,{size:24,color:C.F,anchor:'end',weight:700});
 if(Nhi)s+=fade(Nhi,rect(px-18,py-126,36,128,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:10}));
 s+=arrow(px,py,px+150,py,{color:C.ink,w:4,head:14})+label('動き',px+150,py-14,{size:22,color:C.ink,anchor:'middle',weight:700});
 if(ra)s+=fade(ra,sq(px,py,18,-18,C.hi));
 if(mg){const gx=cx+60;s+=FA(gx,GY-47,gx,GY+70,{g:mg,w:8,head:22})+fade(mg,label('重力 mg',gx+16,GY+60,{size:24,color:C.F,weight:700}));
  if(ramg)s+=fade(ramg,line(gx,GY-47,gx+110,GY-47,{color:C.ink,w:2,dash:'6 6'})+sq(gx,GY-47,18,18,C.hi));}
 if(zero){ // 動く向きに分けると、水平の成分の長さは 0
  s+=fade(zero,line(px,py-110,px,py,{color:W2,w:2.5,dash:'7 7'})+label('動く 向きの 成分 ＝ 0',px+30,py-120,{size:24,color:W2,weight:700}));
  s+=fade(zero,`<circle cx="${px}" cy="${py}" r="9" fill="${C.hi}"/>`);
 }
 if(z0){
  s+=fade(z0,rect(px-170,py-210,150,44,{fill:C.hi,fo:.12,stroke:C.hi,sw:2.5,rx:10})+label('仕事 0',px-95,py-179,{size:26,color:C.hi,anchor:'middle',weight:700}));
  if(mg)s+=fade(z0,rect(cx-115,GY+24,150,44,{fill:C.hi,fo:.12,stroke:C.hi,sw:2.5,rx:10})+label('仕事 0',cx-40,GY+55,{size:26,color:C.hi,anchor:'middle',weight:700}));
 }
 return s;
}
