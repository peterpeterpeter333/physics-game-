// 問題編 解説「斜めに押したレンチ」（q-ui-cross-product、大学編 07 外積・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/07_外積.md の q-ui-cross-product（解説 15 行）。
// 画面：左に真上から見たレンチ（机は灰）、右に説明の枠。誤答カードは右の枠の下に1枚ずつ。札の帯（y＜78）には図を描かない。
// 色（この単元）：柄 𝐫 水色、力 𝐅 緑、柄に平行な部分 灰、柄に直角な部分 黄、トルク 黄、平行四辺形 薄い黄、角の円弧 白、誤り 赤。
// 図のために決めた値：力の矢印の長さ 1 N＝9 px、柄 0.3 m＝340 px（どちらも見やすさのため。比は問題文と無関係）。
import {C,clamp,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,legend,note,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-ui-cross-product:';
const CR=C.x,CF=C.F,CPAR=C.dim,CPER=C.hi,CN=C.hi,CD='#ff6b6b';
const RAD=Math.PI/180,TH=30*RAD,FN=20,KN=8;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const bR=`{\\color{${CR}}\\mathbf{r}}`,bF=`{\\color{${CF}}\\mathbf{F}}`;
// 右の説明の枠と、その下の誤答カード
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,y:318,size:26,whySize:22};
const G1='トルクの大きさ',G2='𝐫×𝐅 の向き',G3='𝐅×𝐫 の大きさと向き';
const ANS1=g=>answerTag(1,'D','3 N·m',{g}),ANS2=g=>answerTag(2,'A','⊙',{g}),ANS3=g=>answerTag(3,'B','3 N·m、⊗',{g});
const LEG=(g=1)=>legend([['黄 ＝ 回すのに 効く 量',C.hi]],900,494,{g});

// ---- レンチ（真上から）----
const O0={cx:90,cy:350,L:300};
function hexagon(cx,cy,r,rot){return Array.from({length:6},(_,i)=>{const a=rot+i*Math.PI/3;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});}
// ボルト：pop＞0 で手前に浮き出る（影が大きい）、pop＜0 で奥へ沈む（影が小さい）
function bolt(cx,cy,{pop=0}={}){
 const s=1+.14*pop,sh=Math.max(0,9+11*pop),rs=40*(1+.28*pop);
 let o=fade(.55,ring(cx+sh,cy+sh,rs,{color:'none',w:0,fill:'#05080f'}));
 o+=poly(hexagon(cx,cy,32*s,0),{fill:'#5a6680',fo:1,stroke:C.ink,sw:2.5});
 o+=ring(cx,cy,12*s,{color:C.ink,w:2.5,fill:'#2a3346'});
 return o;
}
function desk(g=1,{x=20,y=88,w=640,h=420}={}){return fade(g,rect(x,y,w,h,{fill:'#1b2538',fo:1,stroke:'#2c3a55',sw:2,rx:10})+label('机（真上から 見た 図）',x+14,y+h-14,{size:22,color:C.dim}));}
function wrenchBody({cx,cy,L},g=1){
 return fade(g,rect(cx+36,cy-15,L-30,30,{fill:'#2c3854',fo:1,stroke:C.dim,sw:2.5,rx:14})+ring(cx,cy,54,{color:C.dim,w:4,fill:'#2c3854'}));
}
const tipOf=({cx,cy,L})=>[cx+L,cy];
const fEnd=(o,f=1)=>{const [tx,ty]=tipOf(o);return [tx+KN*FN*Math.cos(TH)*f,ty-KN*FN*Math.sin(TH)*f];};
// 𝐫（柄に沿う水色の矢印）
function rArrow(o,{g=1,glow=0,lab=1}={}){
 const {cx,cy,L}=o;
 let s=arrow(cx,cy,cx+L-6,cy,{color:CR,w:6+4*glow,head:18,g});
 if(lab)s+=fade(g*lab,T(bR,cx+L*.45,cy+50,38)+label('0.3 m',cx+L*.45+30,cy+60,{size:26,color:CR,weight:700}));
 return s;
}
function fArrow(o,{g=1,lab=1,dim=0}={}){
 const [tx,ty]=tipOf(o),[fx,fy]=fEnd(o);
 let s=arrow(tx,ty,fx,fy,{color:CF,w:6,head:20,g,opacity:1-.55*dim});
 if(lab)s+=fade(g*lab*(1-.55*dim),T(bF,fx+8,fy-22,38)+label('20 N',fx+34,fy-12,{size:26,color:CF,weight:700}));
 return s;
}
// 柄と 𝐅 の間の白の円弧「30°」（柄の延長は点線）
function angArc(o,{g=1,r=58}={}){
 const [tx,ty]=tipOf(o);
 const pts=Array.from({length:21},(_,i)=>{const a=TH*i/20;return [tx+r*Math.cos(a),ty-r*Math.sin(a)];});
 return fade(g,line(tx,ty,tx+200,ty,{color:C.dim,w:2,dash:'5 7'})+draw(pts,1,{color:C.ink,w:3})+label('30°',tx+r+12,ty-8,{size:26,color:C.ink,weight:700}));
}
// 回す向きの円弧（ccw：𝐫→𝐅、cw：𝐅→𝐫）。先端の点を中心に半径 r
function turnArc(o,{dir=1,g=1,r=95,color=C.ink,w=4}={}){
 if(g<=.001)return '';
 const [tx,ty]=tipOf(o),a0=dir>0?0:TH,a1=dir>0?TH:0,n=24;
 const pts=Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n*g;return [tx+r*Math.cos(a),ty-r*Math.sin(a)];});
 const [x2,y2]=pts[n],[x1,y1]=pts[n-2],an=Math.atan2(y2-y1,x2-x1),h=16;
 const head=`<polygon points="${x2+Math.cos(an)*4},${y2+Math.sin(an)*4} ${x2-h*Math.cos(an)+h*.55*Math.sin(an)},${y2-h*Math.sin(an)-h*.55*Math.cos(an)} ${x2-h*Math.cos(an)-h*.55*Math.sin(an)},${y2-h*Math.sin(an)+h*.55*Math.cos(an)}" fill="${color}"/>`;
 return draw(pts.slice(0,n-1),1,{color,w})+head;
}
// 力の分解：平行（灰）・直角（黄）
function parts(o,{g=1,gPar=1,gPer=1,dash=1,parGlow=0,perGlow=0,push=0}={}){
 const [tx,ty]=tipOf(o),[fx,fy]=fEnd(o),px=fx,qy=fy;
 let s=fade(g*dash,line(fx,fy,px,ty,{color:C.dim,w:2,dash:'6 6'})+line(fx,fy,tx,qy,{color:C.dim,w:2,dash:'6 6'}));
 const sh=-26*push; // 平行な部分を柄に沿って押し込む
 s+=fade(g*gPar,arrow(tx+sh,ty,px+sh,ty,{color:CPAR,w:7+4*parGlow,head:20}));
 s+=fade(g*gPer,arrow(tx,ty,tx,qy,{color:CPER,w:7+4*perGlow,head:20}));
 return s;
}
const outSym=(x,y,r=22,color=CN,g=1)=>fade(g,ring(x,y,r,{color,w:4,fill:'#2a2410'})+dot(x,y,r*.28,color));
const inSym=(x,y,r=22,color=CN,g=1)=>{const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#2a2410'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));};
// 全体：rot＝回りかける角（度、反時計回り＋）
function scene(o=O0,{deskG=1,rG=1,fG=1,arcG=1,rot=0,pop=0,rGlow=0,fDim=0,rLab=1,fLab=1,inner=''}={}){
 let s=desk(deskG);
 let w=wrenchBody(o)+rArrow(o,{g:rG,glow:rGlow,lab:rLab})+fArrow(o,{g:fG,lab:fLab,dim:fDim})+angArc(o,{g:arcG})+inner;
 if(Math.abs(rot)>.01)w=`<g transform="rotate(${(-rot).toFixed(2)} ${o.cx} ${o.cy})">${w}</g>`;
 s+=w+bolt(o.cx,o.cy,{pop});
 return s;
}

export const ytQxUiCrossProductDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約5秒）：0〜2 s 机・ボルト・柄と 𝐫（0.3 m）、2〜4 s 𝐅（20 N）と 30°、4〜5 s 左下に右ねじの札。静止。分解・回す向き・⊙⊗ は出さない。
 [K+'q1']:(p)=>{
  const o={cx:400,cy:320,L:340};
  let s=desk(seg(p,0,.12),{x:150,y:60,w:900,h:445});
  s+=fade(seg(p,.05,.2),wrenchBody(o)+bolt(o.cx,o.cy));
  s+=rArrow(o,{g:seg(p,.2,.4),lab:seg(p,.3,.4)});
  s+=fArrow(o,{g:seg(p,.4,.65),lab:seg(p,.6,.72)})+angArc(o,{g:seg(p,.65,.8)});
  s+=fade(seg(p,.82,.98),rect(170,400,560,52,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:10})+label('右ねじ：反時計回り → ゆるんで 手前に 出る',190,435,{size:24,color:C.ink}));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題の静止画。求めるもの・凡例。右の枠に与えた量
 [K+'goal1']:(p)=>{
  let s=scene();
  s+=panel(90,210,label('与えた 量',PC,135,{size:24,color:C.dim,anchor:'middle'})
   +label('柄の 長さ r ＝ 0.3 m',PC,185,{size:28,color:CR,anchor:'middle',weight:700})
   +label('力 F ＝ 20 N',PC,230,{size:28,color:CF,anchor:'middle',weight:700})
   +label('柄と 力の 角 ＝ 30°',PC,275,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=LEG(seg(p,.1,.25))+goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 平行（灰）と直角（黄）に分ける。1文目の後半：灰を押し込む（回らない）「回さない」。2文目：黄が光り、ボルトが少し回りかける
 [K+'split']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const sp=seg(p,.05,.25),push=Math.sin(Math.PI*clamp((p-.3)/(b-.32)))*(p<b?1:0);
  const k=clamp((p-b-.04)/.4),rot=7*Math.sin(Math.PI*k),gl=seg(p,b,b+.05);
  let s=scene(O0,{rot,inner:parts(O0,{g:sp,push,perGlow:gl,parGlow:0})});
  const [tx,ty]=tipOf(O0),[fx]=fEnd(O0);
  s+=fade(seg(p,.32,.4)*(1-seg(p,b-.02,b+.04)*.4),label('回さない',(tx+fx)/2,ty+46,{size:26,color:CPAR,anchor:'middle',weight:700}));
  s+=fade(gl,label('回す',tx-18,ty-62,{size:26,color:CPER,anchor:'end',weight:700}));
  s+=panel(90,210,label('力を 二つに 分ける',PC,138,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.15,.25),label('柄に 平行な 部分 → 回さない',PC,200,{size:26,color:CPAR,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.08),label('柄に 直角な 部分 → 回す',PC,255,{size:26,color:CPER,anchor:'middle',weight:700})),1);
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 3. 𝐅・灰・黄の直角三角形。30° の向かいの辺（黄）＝F sinθ＝20×0.5＝10 N
 [K+'perp']:(p)=>{
  const [tx,ty]=tipOf(O0),[fx,fy]=fEnd(O0);
  let s=scene(O0,{inner:fade(seg(p,.05,.2),poly([[tx,ty],[fx,ty],[fx,fy]],{fill:C.hi,fo:.08}))+parts(O0,{perGlow:seg(p,.1,.2)})});
  s+=fade(seg(p,.12,.25),label('F sinθ',tx-14,(ty+fy)/2+8,{size:26,color:CPER,anchor:'end',weight:700}));
  s+=panel(90,210,label('直角な 部分（30° の 向かいの 辺）',PC,135,{size:24,color:C.dim,anchor:'middle'})
   +T(`F\\sin\\theta=20\\times0.5`,PC,200,40,{color:C.ink})
   +fade(seg(p,.45,.6),T(`={\\color{${C.hi}}10\\ \\mathrm{N}}`,PC,262,42)),1,C.hi);
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 4. N＝r F sinθ＝0.3×10＝3 N·m。「柄の長さ」で 𝐫、「直角な部分」で黄を光らせる。「D です」で答えの札
 [K+'torque']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7,e=W[0][1];
  const gR=seg(p,.12,.18)*(1-seg(p,.3,.35)),gP=seg(p,.3,.36)*(1-seg(p,.5,.55));
  let s=scene(O0,{rGlow:gR,inner:parts(O0,{perGlow:gP})});
  const [tx,ty]=tipOf(O0),[,fy]=fEnd(O0);
  s+=label('10 N',tx-14,(ty+fy)/2+8,{size:26,color:CPER,anchor:'end',weight:700});
  s+=panel(90,210,label('トルク ＝ 柄の 長さ × 直角な 部分',PC,135,{size:24,color:C.dim,anchor:'middle'})
   +T(`N=rF\\sin\\theta`,PC,195,38)
   +fade(seg(p,.38,.5),T(`=0.3\\times10={\\color{${C.hi}}3\\ \\mathrm{N\\cdot m}}`,PC,262,38)),1,C.hi);
  s+=LEG()+goalTag(G1)+ANS1(seg(p,b+.02,b+.1));
  return s;
 },
 // 5. 誤答 A（6）→ B（約5.2、灰を光らせる）を1枚ずつ
 [K+'wrongAB']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,inB=seg(p,b+.01,b+.05),bl=.5+.5*Math.sin(cueT(ctx)*6);
  let s=scene(O0,{inner:parts(O0,{parGlow:inB*bl})});
  s+=panel(90,210,label('小問1',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(`N=rF\\sin\\theta=0.3\\times10=3\\ \\mathrm{N\\cdot m}`,PC,205,30),1);
  s+=wrongSeq(p,ctx,[['A','6 N·m','0.3×20。平行な 部分まで 数えた'],['B','約 5.2 N·m','cos30° を 使った。cos は 平行な 部分']],{opts:WOPT});
  s+=LEG()+goalTag(G1)+ANS1(1);
  return s;
 },
 // 6. 誤答 C（10、単位 N）
 [K+'wrongC']:(p)=>{
  let s=scene(O0,{inner:parts(O0)});
  s+=panel(90,210,label('小問1',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(`N=rF\\sin\\theta=0.3\\times10=3\\ \\mathrm{N\\cdot m}`,PC,205,30),1);
  s+=wrongCard('C','10 N·m','0.3 m を 掛け忘れた。単位が N のまま',{...WOPT,g:seg(p,.02,.08)});
  s+=LEG()+goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 7. 分解を消し、𝐫 と 𝐅 だけ。求めるもの：𝐫×𝐅 の向き
 [K+'goal2']:(p)=>{
  let s=scene(O0,{inner:fade(1-seg(p,0,.15),parts(O0))});
  s+=panel(90,180,label('小問2',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(`${bR}\\times${bF}`,PC,200,46)+label('の 矢印の 向きは？',PC,250,{size:26,color:C.ink,anchor:'middle'}),seg(p,.1,.25));
  s+=LEG()+goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 8. 画面の中の向き（右、𝐅 の向き）に灰の点線の矢印 → 消す。かわりに ⊙ と ⊗ の候補をボルトの横に
 [K+'cands']:(p)=>{
  const o=O0,[tx,ty]=tipOf(o),[fx,fy]=fEnd(o);
  const gIn=seg(p,.08,.2)*(1-seg(p,.42,.5)),gX=seg(p,.28,.34)*(1-seg(p,.42,.5));
  let s=scene();
  s+=fade(gIn,arrow(o.cx,o.cy+90,o.cx+200,o.cy+90,{color:C.dim,w:4,head:16})+line(o.cx,o.cy+90,o.cx+180,o.cy+90,{color:C.dim,w:4,dash:'8 8'}));
  s+=fade(gIn,arrow(fx+20,fy-10,fx+20+90*Math.cos(TH),fy-10-90*Math.sin(TH),{color:C.dim,w:4,head:16}));
  s+=fade(gX,label('✗',o.cx+232,o.cy+102,{size:36,color:CD,anchor:'middle',weight:700})+label('✗',fx+70,fy-60,{size:36,color:CD,anchor:'middle',weight:700}));
  const gC=seg(p,.5,.62);
  s+=fade(gC,outSym(o.cx-30,o.cy-120,24,C.ink)+label('手前',o.cx-30,o.cy-156,{size:22,color:C.ink,anchor:'middle'})+label('か',o.cx+18,o.cy-112,{size:24,color:C.dim,anchor:'middle'})
   +inSym(o.cx+66,o.cy-120,24,C.ink)+label('奥',o.cx+66,o.cy-156,{size:22,color:C.ink,anchor:'middle'}));
  s+=panel(90,200,label('外積の 矢印は',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +label('𝐫 にも 𝐅 にも 垂直',PC,190,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(gC,label('→ 画面の 手前 か 奥',PC,250,{size:28,color:C.hi,anchor:'middle',weight:700})),1);
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 9. 𝐫 から 𝐅 へ反時計回りの白の円弧 → ボルトが手前に浮き出る（影が大きく）→ ⊙ の候補が光り、ボルトの上に黄の ⊙
 [K+'ccw']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,o=O0;
  const pop=seg(p,b+.05,b+.3),gl=seg(p,b+.3,b+.4);
  let s=scene(o,{pop,inner:turnArc(o,{dir:1,g:seg(p,.12,.4),r:110})});
  const [tx,ty]=tipOf(o);
  s+=fade(seg(p,.35,.45),label('反時計回り',tx+120,ty+42,{size:26,color:C.ink,weight:700,anchor:'middle'}));
  s+=outSym(o.cx-30,o.cy-120,24,gl>.5?C.hi:C.ink)+label('手前',o.cx-30,o.cy-156,{size:22,color:C.ink,anchor:'middle'})+fade(1-gl*.6,inSym(o.cx+66,o.cy-120,24,C.ink)+label('奥',o.cx+66,o.cy-156,{size:22,color:C.ink,anchor:'middle'}));
  s+=fade(gl,ring(o.cx-30,o.cy-120,34,{color:C.hi,w:3}));
  s+=outSym(o.cx,o.cy,20,CN,seg(p,b+.38,b+.48));
  s+=panel(90,210,label('𝐫 → 𝐅（小さい 方の 角）',PC,140,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.45),label('反時計回り',PC,190,{size:28,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.08),label('右ねじは ゆるんで 手前に 出る',PC,240,{size:26,color:C.dim,anchor:'middle'}))
   +fade(gl,label('→ ⊙',PC,282,{size:30,color:C.hi,anchor:'middle',weight:700})),1);
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 10. 答えの札 A（⊙）→ 誤答 B・C・D を1枚ずつ（2文目の中で）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3,o=O0;
  let s=scene(o,{pop:1,inner:turnArc(o,{dir:1,r:110})})+outSym(o.cx,o.cy,20,CN);
  s+=panel(90,210,label('𝐫 → 𝐅 は 反時計回り',PC,150,{size:28,color:C.ink,anchor:'middle',weight:700})+label('右ねじは 手前に 出る → ⊙',PC,215,{size:28,color:C.hi,anchor:'middle',weight:700}),1);
  const e=1,m1=b+(e-b)*.5,m2=b+(e-b)*.75;
  s+=wrongSeq(p,ctx,[['B','⊗','時計回りと 読んだ'],['C','柄の 向き','外積は 𝐫 にも 𝐅 にも 垂直'],['D','力の 向き','力の 向きと 混同した']],{win:[[b,m1],[m1,m2],[m2,1]],opts:WOPT});
  s+=LEG()+goalTag(G2)+ANS2(seg(p,.03,.1));
  return s;
 },

 // ===================== 小問3 =====================
 // 11. 誤答カードと ⊙ を消す。求めるもの：𝐅×𝐫 の大きさと向き
 [K+'goal3']:(p)=>{
  const o=O0,g0=1-seg(p,0,.15);
  let s=scene(o,{pop:g0,inner:fade(g0,turnArc(o,{dir:1,r:110}))})+outSym(o.cx,o.cy,20,CN,g0);
  s+=panel(90,180,label('小問3',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(`${bF}\\times${bR}`,PC,200,46)+label('の 大きさと 向きは？',PC,250,{size:26,color:C.ink,anchor:'middle'}),seg(p,.1,.25));
  s+=LEG()+goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 12. 𝐅 から 𝐫 へ時計回りの円弧 → ボルトが奥へ沈む（影が小さく）→ ボルトの上に黄の ⊗
 [K+'cw']:(p)=>{
  const o=O0,sink=seg(p,.4,.65);
  let s=scene(o,{pop:-sink,inner:turnArc(o,{dir:-1,g:seg(p,.08,.35),r:110})});
  const [tx,ty]=tipOf(o);
  s+=fade(seg(p,.3,.4),label('時計回り',tx+120,ty+42,{size:26,color:C.ink,weight:700,anchor:'middle'}));
  s+=inSym(o.cx,o.cy,20,CN,seg(p,.62,.72));
  s+=panel(90,210,label('𝐅 → 𝐫',PC,140,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.4),label('時計回り',PC,190,{size:28,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.55),label('ねじは 締まって 奥へ',PC,240,{size:26,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.62,.72),label('→ ⊗',PC,282,{size:30,color:C.hi,anchor:'middle',weight:700})),1);
  s+=LEG()+goalTag(G3);
  return s;
 },
 // 13. 平行四辺形（薄い黄）：底辺 0.3、高さ 20 sin30°＝10、面積 3。𝐅×𝐫＝−𝐫×𝐅。「B です」で答えの札
 [K+'para']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,o=O0;
  const [tx,ty]=tipOf(o),dx=KN*FN*Math.cos(TH),dy=KN*FN*Math.sin(TH);
  const gP=seg(p,.03,.18);
  let inner=fade(gP,poly([[o.cx,o.cy],[tx,ty],[tx+dx,ty-dy],[o.cx+dx,o.cy-dy]],{fill:C.hi,fo:.18,stroke:C.hi,sw:2}));
  inner+=fade(gP*.8,line(o.cx,o.cy,o.cx+dx,o.cy-dy,{color:CF,w:3,dash:'7 7'})+line(o.cx+dx,o.cy-dy,tx+dx,ty-dy,{color:CR,w:3,dash:'7 7'}));
  const hx=o.cx+dx;
  inner+=fade(seg(p,.15,.28),line(hx,o.cy,hx,o.cy-dy,{color:C.hi,w:4})+label('高さ 20 sin30° ＝ 10',(o.cx+tx)/2+dx/2,o.cy-dy-16,{size:24,color:C.hi,weight:700,anchor:'middle'}));
  let s=scene(o,{pop:-1,inner,rLab:0});
  s+=fade(seg(p,.15,.28),label('底辺 0.3',(o.cx+tx)/2,ty+50,{size:24,color:CR,anchor:'middle',weight:700}));
  s+=inSym(o.cx,o.cy,20,CN);
  s+=panel(90,210,label('平行四辺形の 面積',PC,135,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.25,.35),T(`0.3\\times10={\\color{${C.hi}}3\\ \\mathrm{N\\cdot m}}`,PC,195,38))
   +fade(seg(p,.4,.5),T(`${bF}\\times${bR}=-\\,${bR}\\times${bF}`,PC,262,38)),1,C.hi);
  s+=LEG()+goalTag(G3)+ANS3(seg(p,b+.02,b+.1));
  return s;
 },
 // 14. ⊙ の3と ⊗ の3を並べる。誤答 A（大きさ 0）
 [K+'wrongA3']:(p,ctx)=>{
  const o=O0;
  let s=scene(o,{pop:-1})+inSym(o.cx,o.cy,20,CN);
  const gS=seg(p,.05,.2);
  s+=panel(90,210,fade(gS,T(`${bR}\\times${bF}`,PX+130,140,32)+outSym(PX+130,205,26,CN)+label('3 N·m',PX+130,272,{size:28,color:C.hi,anchor:'middle',weight:700})
   +T(`${bF}\\times${bR}`,PX+390,140,32)+inSym(PX+390,205,26,CN)+label('3 N·m',PX+390,272,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('同じ 長さ',PC,200,{size:22,color:C.ink,anchor:'middle'})+label('逆向き',PC,232,{size:22,color:C.ink,anchor:'middle'})),1);
  s+=wrongCard('A','大きさ 0',['1本の 外積は 0 ではない。逆向きに なるだけ'],{...WOPT,g:seg(p,.05,.12)});
  s+=LEG()+goalTag(G3)+ANS3(1);
  return s;
 },
 // 15. 誤答 C → D を1枚ずつ。声の後（間）でまとめ：レンチに戻り、黄の 10 N と柄 0.3 m → 3 N·m、反時計回り → ⊙、時計回り → ⊗。答えの札を一列に
 [K+'wrongCD']:(p,ctx)=>{
  const ve=voiceEnd(ctx),sw=seg(p,ve+.01,ve+.06),o=O0;
  let s=fade(1-sw,scene(o,{pop:-1})+inSym(o.cx,o.cy,20,CN)
   +panel(90,210,T(`${bR}\\times${bF}`,PX+130,140,32)+outSym(PX+130,205,26,CN)+label('3 N·m',PX+130,272,{size:28,color:C.hi,anchor:'middle',weight:700})
   +T(`${bF}\\times${bR}`,PX+390,140,32)+inSym(PX+390,205,26,CN)+label('3 N·m',PX+390,272,{size:28,color:C.hi,anchor:'middle',weight:700}),1)
   +wrongSeq(p,ctx,[['C','3 N·m、⊙','入れ替えると 向きは 逆'],['D','6 N·m、⊗','平行四辺形は 同じ。大きさは 変わらない']],{win:[[0,ve*.5],[ve*.5,1]],opts:WOPT})
   +LEG()+goalTag(G3)+ANS3(1));
  // まとめ
  const q=k=>seg(p,ve+.06+k*.07,ve+.12+k*.07);
  const [tx,ty]=tipOf(o),[,fy]=fEnd(o);
  let m=desk(1)+wrenchBody(o)+rArrow(o)+parts(o,{gPar:0,dash:0})+label('10 N',tx-14,(ty+fy)/2+8,{size:26,color:CPER,anchor:'end',weight:700})+fArrow(o,{dim:.6,lab:0})+bolt(o.cx,o.cy);
  m+=fade(q(1),turnArc(o,{dir:1,r:100,color:C.ink}))+fade(q(2),turnArc(o,{dir:-1,r:150,color:C.dim}));
  const rows=[[150,'柄 0.3 m × 10 N','3 N·m',C.hi],[265,'反時計回り（𝐫×𝐅）','⊙',C.ink],[380,'時計回り（𝐅×𝐫）','⊗',C.dim]];
  rows.forEach(([y,a,v,col],i)=>{
   m+=fade(q(i),card(PX+20,y-42,PW-20,84,label(a,PX+44,y+9,{size:24,color:col,weight:700})+label('→',PX+PW-150,y+10,{size:28,color:C.dim,anchor:'middle'})+label(v,PX+PW-22,y+12,{size:32,color:C.hi,anchor:'end',weight:700}),1));
  });
  m+=fade(q(0),line(tx,(ty+fy)/2,PX+20,150,{color:C.hi,w:2.5,dash:'6 6'}))+fade(q(1),line(tx+100*Math.cos(TH/2),ty-100*Math.sin(TH/2),PX+20,265,{color:C.ink,w:2.5,dash:'6 6'}))+fade(q(2),line(tx+150*Math.cos(TH/2),ty-150*Math.sin(TH/2),PX+20,380,{color:C.dim,w:2.5,dash:'6 6'}));
  m+=answerRow([[1,'D','3 N·m'],[2,'A','⊙'],[3,'B','3 N·m、⊗']],{g:q(3),size:24});
  s+=fade(sw,m);
  return s;
 },
};
