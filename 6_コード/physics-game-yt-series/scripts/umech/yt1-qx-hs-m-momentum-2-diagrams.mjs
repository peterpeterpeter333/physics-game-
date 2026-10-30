// 問題編 解説「向かい合う台車の合体」(ys-qx-hs-m-momentum-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/108_運動量と力積.md の q-hs-m-momentum-2（解説 19 行）。
// 色（単元動画 ys-hs-m-momentum-2 と同じ）：運動量 p 桃、力 F 緑（台車1が受ける力は濃い緑、台車2が受ける力は薄い緑）、速度 v 紫、時間 t 金、
//   運動エネルギー K 濃い橙（台車2の分は薄い橙）、熱・変形・音に移った分は灰色の箱、強調 黄。右向きが正。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,clamp,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,poly,ground,cart,draw} from './anim.mjs';
import {QX,card,goalTag,answerTag,wrongCard,wrongSeq,kindTag,pauseBadge,cueT,sentWin,voiceEnd,textW} from './yt1-qx-common.mjs';
import {posDir} from './yt1-hs-m-momentum-1-diagrams.mjs';
import {KC} from './yt1-hs-m-energy-1-diagrams.mjs';

const K='qx-hs-m-momentum-2:';
const PC=C.p,VC=C.v,FC=C.F,F2='#5fc39b',TC=C.t,HI=C.hi,K2='#ffc58a',GRAY='#7d8799';
const B1='#8fa6c9',B2='#c9a46a';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const G1='くっついた後の速度 u',G2='減った K の合計',G3='運動量の合計が変わらない理由';
const A1=g=>answerTag(1,'B','右 2.5 m/s',{g}),A2=g=>answerTag(2,'D','13.5 J',{g}),A3=g=>answerTag(3,'C','力積が同じ大きさ・逆向き',{g});
function atMark(ctx,mark,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/[\s。]/g,''),i=r.indexOf(mark.replace(/\s/g,''));
 return i<0?fb:i/r.length*voiceEnd(ctx);
}

// ---- 台車とレール ---------------------------------------------------------------------------------
const GY=430,W1=180,W2=120;
const cart1=(x,gy=GY,{g=1,w=W1,h=70,size=26}={})=>fade(g,cart(x,gy,{w,h,color:B1,text:'台車1',size}));
const cart2=(x,gy=GY,{g=1,w=W2,h=60,size=24}={})=>fade(g,cart(x,gy,{w,h,color:B2,text:'台車2',size}));
const rail=(gy=GY,x0=40,x1=1160)=>ground(x0,x1,gy);
const mlab=(t,x,gy=GY,o={})=>label(t,x,gy+40,{size:24,color:C.ink,anchor:'middle',weight:700,...o});
// 出題中の動き：0〜5 s 近づく（台車1 右 4.0、台車2 左 2.0）、5 s でくっつく
const VK=28,XS1=330,XS2=900,KX=14;
const pos=t=>{const u=Math.min(t,5);return [XS1+4*KX*u,XS2-2*KX*u];};
const XC1=610,XC2=760,XJ=700;   // くっついた所（接する点 XJ）
function vArrow(x,v,y,{g=1,txt=''}={}){
 const x1=x-v*VK/2,x2=x+v*VK/2;
 return fade(g,arrow(x1,y,x2,y,{color:VC,w:5,head:16})+label(txt,(x1+x2)/2,y-16,{size:26,color:VC,anchor:'middle',weight:700}));
}
function setupScene(t,{badge=0,masses=1}={}){
 const [x1,x2]=pos(t),hit=t>=5;
 let s=rail()+cart1(x1)+cart2(x2);
 if(masses)s+=mlab('3.0 kg',x1)+mlab('1.0 kg',x2);
 if(!hit)s+=vArrow(x1,4,GY-110,{txt:'右 4.0 m/s'})+vArrow(x2,-2,GY-110,{txt:'左 2.0 m/s'});
 else s+=rect(XJ-14,GY-56,28,14,{fill:HI,fo:.9,stroke:'none',rx:3});
 s+=posDir(90,120);
 if(badge)s+=pauseBadge({g:badge,y:8});
 return s;
}
// くっついた2台（止めた図）
function joined({g=1,box=0,q=0,masses=1}={}){
 let s=rail()+cart1(XC1)+cart2(XC2)+rect(XJ-14,GY-56,28,14,{fill:HI,fo:.9,stroke:'none',rx:3});
 if(masses)s+=mlab('3.0 kg',XC1)+mlab('1.0 kg',XC2);
 if(box)s+=fade(box,`<rect x="${XC1-W1/2-26}" y="${GY-120}" width="${W1+W2+52}" height="190" rx="22" fill="none" stroke="${HI}" stroke-width="3" stroke-dasharray="10 9"/>`);
 if(q)s+=fade(q,label('u ＝ ？',XJ,GY-140,{size:34,color:VC,anchor:'middle',weight:700}));
 return fade(g,s);
}

// ---- 運動量の矢印（衝突前）と、つなぐ足し算 -----------------------------------------------------------
const PK=20;
function beforeScene({pa=1,ring2=0,sum=0,eq=0,eq2=0}={}){
 let s=rail()+cart1(XS1)+cart2(XS2)+mlab('3.0 kg',XS1)+mlab('1.0 kg',XS2);
 const yp=GY-120;
 s+=fade(pa,arrow(XS1-60,yp,XS1-60+12*PK,yp,{color:PC,w:8,head:20})+label('＋12',XS1+60,yp-18,{size:28,color:PC,anchor:'middle',weight:700}));
 s+=fade(pa,arrow(XS2+20,yp,XS2+20-2*PK,yp,{color:PC,w:8,head:18})+label('−2.0',XS2-26,yp-18,{size:28,color:PC,weight:700}));
 s+=fade(pa*ring2,ring(XS2-16,yp-27,17,{color:HI,w:3}));
 // つなぐ足し算（左上）
 const x0=100,ya=130,yb=158,yc=212;
 s+=fade(sum,arrow(x0,ya,x0+12*PK,ya,{color:PC,w:7,head:18})+label('＋12',x0+6*PK,ya-14,{size:24,color:PC,anchor:'middle',weight:700}));
 s+=fade(seg(sum,.3,.7),arrow(x0+12*PK,yb,x0+10*PK,yb,{color:PC,w:7,head:16})+label('−2.0',x0+12*PK+12,yb+8,{size:24,color:PC,weight:700}));
 s+=fade(seg(sum,.6,1),line(x0,ya-10,x0,yc+10,{color:C.faint,w:2,dash:'5 6'})+line(x0+10*PK,yb+10,x0+10*PK,yc,{color:C.faint,w:2,dash:'5 6'})
  +arrow(x0,yc,x0+10*PK,yc,{color:PC,w:10,head:22})+label('＋10',x0+5*PK,yc+40,{size:28,color:PC,anchor:'middle',weight:700}));
 s+=card(560,96,630,140,T('3.0\\times 4.0+1.0\\times(-2.0)',875,146,36)+fade(eq2,T('=12-2.0=10\\ \\mathrm{kg\\cdot m/s}',875,206,36)),eq,PC);
 return s;
}
function afterScene({pa=1,eq=1,eq2=0,va=0,cardg=1}={}){
 let s=rail()+cart1(XC1)+cart2(XC2)+rect(XJ-14,GY-56,28,14,{fill:HI,fo:.9,stroke:'none',rx:3});
 s+=fade(1,label('4.0 kg（一体）',XJ,GY+40,{size:24,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(pa,arrow(XJ-100,GY-150,XJ-100+10*PK,GY-150,{color:PC,w:8,head:20})+label('＋10',XJ,GY-164,{size:28,color:PC,anchor:'middle',weight:700}));
 if(va)s+=vArrow(XJ,2.5,GY-104,{g:va,txt:'右 2.5 m/s'});
 if(cardg)s+=card(560,96,630,140,T('4.0\\,u=10',875,146,38,{auto:false})+fade(eq2,T('u=2.5\\ \\mathrm{m/s}',875,206,38,{auto:false})),cardg*eq,VC);
 return s;
}

// ---- 小問2：左に衝突前と後、右に K の棒 ---------------------------------------------------------------
const LGY1=230,LGY2=430;
function leftPanel(g=1){
 let s=label('衝突前',40,110,{size:26,color:C.dim,weight:700})+rail(LGY1,40,580)+cart1(170,LGY1,{w:150,h:60,size:22})+cart2(440,LGY1,{w:100,h:52,size:20});
 s+=vArrow(170,3,LGY1-96,{txt:'4.0 m/s'})+vArrow(440,-2,LGY1-96,{txt:'2.0 m/s'});
 s+=label('衝突後',40,310,{size:26,color:C.dim,weight:700})+rail(LGY2,40,580)+cart1(250,LGY2,{w:150,h:60,size:22})+cart2(375,LGY2,{w:100,h:52,size:20});
 s+=vArrow(312,2.5,LGY2-96,{txt:'2.5 m/s'});
 return fade(g,s);
}
const BX1=780,BX2=1080,BB=440,KK=10,BW=96;
function chart({g=1,b1=0,b2=0,lab1=0,pos2=0,after=0,ghost=0,move=0,boxg=0,boxHi=0}={}){
 let s=card(620,90,570,415,'',g,KC);
 s+=fade(g,line(650,BB,1170,BB,{color:C.dim,w:2.5})+label('衝突前',BX1,BB+40,{size:26,color:C.ink,anchor:'middle',weight:700})+label('衝突後',BX2,BB+40,{size:26,color:C.ink,anchor:'middle',weight:700}));
 // 衝突前：24 J（台車1）の上に 2.0 J（台車2）
 const h1=24*KK*b1,h2=2*KK*b2;
 if(b1>0)s+=rect(BX1-BW/2,BB-h1,BW,h1,{fill:KC,fo:.65,stroke:KC,sw:2,rx:3});
 if(b2>0)s+=rect(BX1-BW/2,BB-24*KK-h2,BW,h2,{fill:K2,fo:.8,stroke:K2,sw:2,rx:3});
 s+=fade(lab1,label('台車1 24 J',BX1+BW/2+12,BB-120,{size:24,color:KC,weight:700}));
 s+=fade(lab1*seg(b2,.5,1),label('台車2 2.0 J',BX1+BW/2+12,BB-240,{size:24,color:K2,weight:700}));
 s+=fade(seg(b2,.8,1),label('26 J',BX1,BB-26*KK-14,{size:28,color:KC,anchor:'middle',weight:700}));
 if(pos2)s+=kindTag('向きによらず正',BX1+130,BB-196,{g:pos2,color:HI,size:22});
 // 衝突後：12.5 J
 const ha=12.5*KK*after;
 if(after>0)s+=rect(BX2-BW/2,BB-ha,BW,ha,{fill:KC,fo:.65,stroke:KC,sw:2,rx:3})+fade(seg(after,.8,1),label('12.5 J',BX2,BB-ha-14,{size:28,color:KC,anchor:'middle',weight:700}));
 // 26 との差 13.5 J（点線）→ 灰色の箱へ
 const gx=BX2-BW/2,gy0=BB-26*KK,gh=13.5*KK;
 if(ghost>0){
  const dx=-0*move,dy=-150*move,sc=1-.45*move;
  s+=fade(ghost*(1-seg(move,.85,1)),`<g transform="translate(${gx+BW/2+dx} ${gy0+dy}) scale(${sc}) translate(${-BW/2} 0)">`+rect(0,0,BW,gh,{fill:GRAY,fo:.35,stroke:GRAY,sw:2,rx:3})+'</g>'+`<rect x="${gx}" y="${gy0}" width="${BW}" height="${gh}" fill="none" stroke="${GRAY}" stroke-width="2" stroke-dasharray="6 6"/>`);
  s+=fade(ghost,label('13.5 J',gx-12,gy0+gh/2+10,{size:28,color:C.ink,anchor:'end',weight:700}));
 }
 if(boxg)s+=fade(boxg,rect(950,98,232,68,{fill:'#2a3346',fo:.95,stroke:boxHi>.5?HI:GRAY,sw:2+3*boxHi,rx:12})+label('変形・音・熱',1066,142,{size:26,color:C.ink,anchor:'middle',weight:700}));
 return s;
}

// ---- 小問3：押し合う2台（拡大）と F-t グラフ -----------------------------------------------------------
const ZG=250,ZX1=500,ZX2=670,ZW1=200,ZW2=140;
function pushScene({forces=1,clock=1,ext=0,box=1,g=1}={}){
 let s=rail(ZG,180,1020)+cart1(ZX1,ZG,{w:ZW1,h:74,size:28})+cart2(ZX2,ZG,{w:ZW2,h:62,size:26});
 if(box)s+=fade(box,`<rect x="${ZX1-ZW1/2-20}" y="${ZG-112}" width="${ZW1+ZW2+40}" height="132" rx="20" fill="none" stroke="${HI}" stroke-width="3" stroke-dasharray="10 9"/>`);
 if(forces){
  s+=fade(forces,arrow(ZX1-ZW1/2,ZG-50,ZX1-ZW1/2-150,ZG-50,{color:FC,w:8,head:22})+label('台車1が受ける力',ZX1-ZW1/2-160,ZG-74,{size:24,color:FC,anchor:'middle',weight:700}));
  s+=fade(forces,arrow(ZX2+ZW2/2,ZG-50,ZX2+ZW2/2+150,ZG-50,{color:F2,w:8,head:22})+label('台車2が受ける力',ZX2+ZW2/2+160,ZG-74,{size:24,color:F2,anchor:'middle',weight:700}));
 }
 if(clock){
  const cx=600,cy=112,r=24;let c=ring(cx,cy,r,{color:TC,w:4,fill:'#1a1a10'})+line(cx,cy,cx,cy-r*.75,{color:TC,w:4})+line(cx,cy,cx+r*.6,cy,{color:TC,w:3})+dot(cx,cy,4,TC);
  c+=label('Δt（共通）',cx-34,cy+9,{size:24,color:TC,anchor:'end',weight:700});
  s+=fade(clock,c);
 }
 if(ext){
  for(const [x,top] of [[ZX1-80,ZG-90],[ZX2+40,ZG-78]]){
   s+=fade(ext,arrow(x,top,x,top-60,{color:FC,w:6,head:16})+label('N',x<600?x-12:x+12,top-46,{size:24,color:FC,anchor:x<600?'end':'start',weight:700}));
   s+=fade(ext,arrow(x,ZG+4,x,ZG+64,{color:FC,w:6,head:16})+label('mg',x+12,ZG+58,{size:24,color:FC,weight:700}));
  }
  s+=kindTag('外力の力積 0',1060,130,{g:ext,color:HI,size:26});
 }
 return fade(g,s);
}
// F-t グラフ：台車2 の山が上（＋）、台車1 の山が下（−）
const FX=300,FY=400,FWd=520,FH=62;
function ftGraph({g=1,up=1,down=1,cancel=0,eq=0}={}){
 let s=arrow(FX,FY,FX+FWd+40,FY,{color:TC,w:3,head:12})+arrow(FX,FY+FH+20,FX,FY-FH-26,{color:FC,w:3,head:12});
 s+=label('t',FX+FWd+50,FY+8,{size:24,color:TC,weight:700})+label('F',FX-14,FY-FH-16,{size:24,color:FC,anchor:'end',weight:700});
 const n=40,pts=sgn=>Array.from({length:n+1},(_,i)=>{const u=i/n;return [FX+60+400*u,FY-sgn*FH*Math.sin(Math.PI*u)**2];});
 if(up>0)s+=fade(up,poly(pts(1),{fill:F2,fo:.35*(1-.6*cancel),stroke:F2,sw:3})+label('台車2：＋4.5',FX+260,FY-FH-8,{size:24,color:F2,anchor:'middle',weight:700}));
 if(down>0)s+=fade(down,poly(pts(-1),{fill:FC,fo:.35*(1-.6*cancel),stroke:FC,sw:3})+label('台車1：−4.5',FX+260,FY+FH+30,{size:24,color:FC,anchor:'middle',weight:700}));
 if(eq)s+=fade(eq,T('\\Delta {\\color{#ff9ce6}p}_1+\\Delta {\\color{#ff9ce6}p}_2=0',FX+FWd+220,FY+12,36,{auto:false}));
 return fade(g,s);
}

export const qxHsMMomentum2Diagrams={
 // ================= 問題アニメ：出題中（6 秒＋静止）=================
 // 0〜5 s 2台が近づく（紫の速度の矢印と数値つき）、5 s でぶつかってくっつく（速度の矢印を消す）、5〜6 s「映像を一時停止」。
 // 出さない：衝突後の速度の矢印と動き、運動量の矢印、押し合う力の矢印、K の棒グラフ。
 [K+'q0']:(p,ctx)=>{const t=cueT(ctx);return setupScene(t,{badge:seg(t,5,5.3)});},
 // ================= 小問1 =================
 // 1. 出題中の図を再生し、くっついた瞬間で一時停止
 [K+'setup']:(p,ctx)=>{const t=cueT(ctx);return setupScene(t,{badge:seg(t,5,5.3)});},
 // 2. 求めるもの：u。一体の台車の上に紫の「？」
 [K+'goal1']:(p)=>joined({q:seg(p,.3,.45)})+pauseBadge({x:840,y:8})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. 2台を点線で囲む。「p の合計：前＝後」
 [K+'group']:(p,ctx)=>{
  const W=sentWin(ctx),b=atMark(ctx,'このしょうとつ',.4);
  let s=joined({q:1,box:seg(p,b,b+.08)});
  s+=card(330,96,540,70,label('p の合計：前 ＝ 後',600,142,{size:32,color:PC,anchor:'middle',weight:700}),seg(p,b+.15,b+.25),PC);
  return s+pauseBadge({x:840,y:8})+goalTag(G1);
 },
 // 4. 衝突前に戻し、桃の矢印 ＋12 と −2.0（−を黄で囲む）。つないで足すと ＋10
 [K+'before']:(p,ctx)=>{
  const a=atMark(ctx,'じゅうにマイナス',.65);
  let s=beforeScene({pa:seg(p,.12,.25),ring2:seg(p,.42,.5),sum:lin(p,a-.05,a+.15),eq:seg(p,.25,.35),eq2:seg(p,a,a+.06)});
  return s+goalTag(G1);
 },
 // 5. 一体の台車（4.0 kg）に ＋10、4.0u＝10 → u＝2.5、紫の矢印「右 2.5 m/s」。答え B
 [K+'after']:(p,ctx)=>{
  const a=atMark(ctx,'みぎむきに',.55),b=atMark(ctx,'しょうもんいちの',.8);
  let s=afterScene({pa:seg(p,.05,.15),eq:seg(p,.2,.3),eq2:seg(p,a-.05,a+.03),va:seg(p,a,a+.08)});
  return s+goalTag(G1)+A1(seg(p,b,b+.06));
 },
 // 6. 誤答 A・C（1枚ずつ）
 [K+'wrongAC']:(p,ctx)=>{
  const c=atMark(ctx,'スィーの',.5);
  let s=afterScene({pa:0,va:1,cardg:0});
  s+=wrongSeq(p,ctx,[['A','3.5 m/s','(12＋2.0)÷4.0（向きを忘れた）'],['C','3.3 m/s','10÷3.0（一体の 4.0 kg で割る）']],{win:[[0,c],[c,1]],opts:{y:96,size:28}});
  return s+goalTag(G1)+A1(1);
 },
 // 7. 誤答 D
 [K+'wrongD']:(p)=>{
  let s=afterScene({pa:0,va:1,cardg:0});
  s+=wrongCard('D','1.0 m/s','速度の平均（質量を見ていない）',{y:96,g:seg(p,.03,.1),mid:'\\{4.0+(-2.0)\\}\\div 2=1.0',midSize:30});
  return s+goalTag(G1)+A1(1);
 },
 // ================= 小問2 =================
 // 8. 求めるもの：減った K。右に橙の棒グラフの枠
 [K+'goal2']:(p)=>leftPanel()+chart({g:seg(p,.2,.35)})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 9. ½mv² の v² を黄で囲む。「v²≧0 → K は負にならない」
 [K+'kdef']:(p)=>{
  let s=leftPanel(.5)+chart();
  s+=card(650,110,510,170,T(`{\\color{${KC}}K}=\\dfrac{1}{2}m{\\color{${HI}}\\boxed{{\\color{${VC}}v}^2}}`,905,190,44,{auto:false}),seg(p,.05,.15),KC);
  s+=kindTag('v² ≧ 0 → K は 負に ならない',905,330,{g:seg(p,.45,.55),color:HI,size:24});
  return s+goalTag(G2);
 },
 // 10. 衝突前の棒：24 J、その上に 2.0 J → 26 J。台車2の棒に「向きによらず正」
 [K+'kbefore']:(p,ctx)=>{
  const a=atMark(ctx,'だいしゃにが',.45);
  let s=leftPanel()+chart({b1:seg(p,.1,a-.05),lab1:seg(p,.1,.2),b2:seg(p,a+.05,a+.3),pos2:seg(p,a+.25,a+.35)});
  return s+goalTag(G2);
 },
 // 11. 衝突後の棒 12.5 J。差 13.5 J が灰色の「変形・音・熱」の箱へ。答え D
 [K+'kafter']:(p,ctx)=>{
  const a=atMark(ctx,'へったりょうは',.45),b=atMark(ctx,'しょうもんにの',.8);
  let s=leftPanel()+chart({b1:1,b2:1,lab1:1,after:seg(p,.05,a-.05),ghost:seg(p,a,a+.08),move:lin(p,a+.15,b-.02),boxg:seg(p,a+.12,a+.2)});
  return s+goalTag(G2)+A2(seg(p,b,b+.06));
 },
 // 12. 誤答 A。灰色の箱を黄で縁取る
 [K+'wrong2A']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=chart({b1:1,b2:1,lab1:1,after:1,ghost:1,move:1,boxg:1,boxHi:seg(p,b,b+.05)});
  s+=wrongCard('A','0 J','K の保存を 付け加えた',{x:30,w:570,y:200,g:seg(p,.03,.1)});
  return s+goalTag(G2)+A2(1);
 },
 // 13. 誤答 B・C（1枚ずつ）
 [K+'wrong2BC']:(p,ctx)=>{
  const c=atMark(ctx,'スィーの',.4);
  let s=chart({b1:1,b2:1,lab1:1,after:1,ghost:1,move:1,boxg:1});
  s+=wrongSeq(p,ctx,[['B','12.5 J','衝突後の K を 答えた'],['C','9.5 J','24−2.0−12.5（K を 負に した）']],{win:[[0,c],[c,1]],opts:{x:30,w:570,y:200}});
  return s+goalTag(G2)+A2(1);
 },
 // ================= 小問3 =================
 // 14. 求めるもの：理由。2台を点線で囲む
 [K+'goal3']:(p)=>pushScene({forces:0,clock:0,box:seg(p,.3,.45)})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 押し合う力（緑、同じ長さ・逆向き）と、共通の時計 Δt
 [K+'pair']:(p,ctx)=>{
  const a=atMark(ctx,'おしあう',.7);
  return pushScene({forces:seg(p,.1,.25),clock:seg(p,a,a+.08)})+goalTag(G3);
 },
 // 16. 下に F-t グラフ：上の山（台車2）と下の山（台車1）が同じ形、打ち消し合う。Δp₁＋Δp₂＝0。答え C
 [K+'cancel']:(p,ctx)=>{
  const b=atMark(ctx,'しょうもんさんの',.75);
  let s=pushScene()+ftGraph({up:seg(p,.05,.18),down:seg(p,.15,.28),cancel:seg(p,.4,.55),eq:seg(p,.45,.58)});
  return s+goalTag(G3)+A3(seg(p,b,b+.06));
 },
 // 17. 外力：mg と N（同じ長さ）。「外力の力積 0」
 [K+'external']:(p)=>pushScene({ext:seg(p,.1,.3)})+ftGraph({g:.35,cancel:1,eq:1})+goalTag(G3)+A3(1),
 // 18. 誤答 A・B・D（1枚ずつ）
 [K+'wrong3']:(p,ctx)=>{
  const b=atMark(ctx,'ビーは',.3),W=sentWin(ctx),d=W[1]?W[1][0]:.6;
  let s=pushScene({ext:1});
  s+=wrongSeq(p,ctx,[['A','K が変わらない','K は 13.5 J 減った'],['B','台車1の p が不変','保存は 組の合計'],['D','力がはたらかない','はたらくが、打ち消し合う']],{win:[[0,b],[b,d],[d,1]],opts:{y:330}});
  return s+goalTag(G3)+A3(1);
 },
 // ================= まとめ =================
 // 19. 衝突前後の台車と、p の合計（保存）・K（減る）。Δp₁＋Δp₂＝0 を黄で強調
 [K+'sum']:(p)=>{
  const gL=seg(p,.03,.15),gR=seg(p,.25,.37),gH=seg(p,.5,.62);
  let s=card(10,90,580,415,'',gL,PC);
  s+=fade(gL,label('衝突前',40,135,{size:24,color:C.dim,weight:700})+rail(220,40,560)+cart1(170,220,{w:140,h:56,size:22})+cart2(430,220,{w:96,h:48,size:20})
   +arrow(110,128,110+12*14,128,{color:PC,w:6,head:16})+label('＋12',200,118,{size:22,color:PC,anchor:'middle',weight:700})
   +arrow(460,128,432,128,{color:PC,w:6,head:14})+label('−2.0',470,136,{size:22,color:PC,weight:700}));
  s+=fade(gL,label('衝突後',40,290,{size:24,color:C.dim,weight:700})+rail(380,40,560)+cart1(250,380,{w:140,h:56,size:22})+cart2(368,380,{w:96,h:48,size:20})
   +arrow(230,292,230+10*14,292,{color:PC,w:6,head:16})+label('＋10',300,282,{size:22,color:PC,anchor:'middle',weight:700}));
  s+=fade(gL,T('+12+(-2.0)=+10=4.0\\times 2.5',300,440,30));
  s+=fade(gL,label('p の合計：保存',300,488,{size:26,color:PC,anchor:'middle',weight:700}));
  s+=card(610,90,580,415,'',gR,KC);
  s+=fade(gR,line(660,400,1140,400,{color:C.dim,w:2})+rect(760-40,400-26*7,80,26*7,{fill:KC,fo:.6,stroke:KC,sw:2,rx:3})+rect(1000-40,400-12.5*7,80,12.5*7,{fill:KC,fo:.6,stroke:KC,sw:2,rx:3})
   +rect(1000-40,400-26*7,80,13.5*7,{fill:'none',fo:0,stroke:GRAY,sw:2,rx:3})+label('26 J',760,400-26*7-12,{size:24,color:KC,anchor:'middle',weight:700})+label('12.5 J',1000,400-12.5*7-12,{size:24,color:KC,anchor:'middle',weight:700})
   +label('13.5 J 減',1060,400-20*7,{size:22,color:GRAY,weight:700})+label('衝突前',760,430,{size:22,color:C.ink,anchor:'middle'})+label('衝突後',1000,430,{size:22,color:C.ink,anchor:'middle'}));
  s+=fade(gR,label('K：26 → 12.5（13.5 J 減）',900,140,{size:26,color:KC,anchor:'middle',weight:700})+label('K：減る',900,488,{size:26,color:KC,anchor:'middle',weight:700}));
  s+=kindTag('Δp₁ ＋ Δp₂ ＝ 0',600,40,{g:gH,color:HI,size:30});
  return s;
 },
};
