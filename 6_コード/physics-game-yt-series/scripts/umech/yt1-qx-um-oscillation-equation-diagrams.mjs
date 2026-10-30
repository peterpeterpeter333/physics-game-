// 問題編 解説「押し出しながら離したおもり」（q-um-oscillation-equation、大学編 09 振動の方程式・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/09_振動の方程式.md の q-um-oscillation-equation（解説 16 行）。
// 画面の配置：小問1 は左に x–t グラフ・右に説明の枠、小問2 は左に円と三角形・その右にグラフ、小問3 は表（誤答カードは表の下）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：位置 x 水色、速度 v 紫、ω 桃、時刻 t 金、強調 黄、誤り 赤。係数は p・q（単元動画の A・B）。
import {C,clamp,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,wall,ground,block,spring} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-um-oscillation-equation:';
const CX=C.x,CV=C.v,CT=C.t,CW=C.p,CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const XX=`{\\color{${CX}}x}`,WW=`{\\color{${CW}}\\omega}`,VV=`{\\color{${CV}}v}`;
const XDD=`\\dfrac{d^2${XX}}{dt^2}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='位置 x(t) の式',G2='振幅',G3='方程式の解';
const ANS1=g=>answerTag(1,'D',{tex:`x=-0.03\\cos5t+0.04\\sin5t`},{g});
const ANS2=g=>answerTag(2,'A','0.05 m',{g});
const ANS3=g=>answerTag(3,'C',{tex:`0.5\\cos5t-2\\sin5t`},{g});
const XT=t=>-.03*Math.cos(5*t)+.04*Math.sin(5*t);
// 読みの中で word が始まる所（cue の進み 0〜1）
function atWord(ctx,word,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0?fb:i/Math.max(1,r.length)*voiceEnd(ctx);
}

// ---- x–t グラフ（目盛りの文字は 22px で自前に描く）----
function graph({x0=100,y0=300,w=520,hpm=2000,tmax=2.6,g=1,tticks=[1,2],xticks=[.06,.03,-.03,-.06]}={}){
 const X=t=>x0+w*t/tmax,Y=v=>y0-v*hpm,top=Y(.065),bot=Y(-.065);
 let s=arrow(x0-8,y0,x0+w+24,y0,{color:C.dim,w:2.5,head:14})+arrow(x0,bot+6,x0,top-18,{color:C.dim,w:2.5,head:14});
 s+=label('t [s]',x0+w+30,y0+8,{size:24,color:CT})+label('x [m]',x0,top-28,{size:24,color:CX,anchor:'middle'});
 for(const u of tticks)s+=line(X(u),y0-6,X(u),y0+6,{color:C.dim})+label(String(u),X(u),y0+30,{size:22,color:C.dim,anchor:'middle'});
 for(const v of xticks)s+=line(x0-6,Y(v),x0+6,Y(v),{color:C.dim})+label(String(v).replace('-','−'),x0-12,Y(v)+8,{size:22,color:C.dim,anchor:'end'});
 const plot=(fn,{from=0,to=tmax,p=1,color=CX,w:lw=4,dash=''}={})=>draw(Array.from({length:161},(_,i)=>{const u=from+(to-from)*i/160;return [X(u),Y(fn(u))];}),p,{color,w:lw,dash});
 return {svg:fade(g,s),X,Y,plot};
}
// ---- ばねとおもり（d＝ずれ [m]）----
function rig(d,{ox=600,wx=300,y=190,sc=2000,bw=90,bh=60,x1=960,g=1,v=0}={}){
 const bx=ox+d*sc;
 let s=ground(wx-10,x1,y)+wall(wx,y-110,y)+spring(wx,bx-bw/2,y-bh/2,{coils:9,amp:12,color:C.dim,w:3})+block(bx,y,bw,bh,{color:C.x,text:'',fo:.22});
 s+=line(ox,y-bh-24,ox,y,{color:C.faint,w:2,dash:'7 7'});
 const ay=y+34;
 s+=arrow(wx+10,ay,x1,ay,{color:CX,w:3,head:14})+label('x',x1+10,ay+9,{size:28,color:CX,weight:700})+line(ox,ay-9,ox,ay+9,{color:CX,w:3})+label('x ＝ 0',ox,ay+36,{size:22,color:CX,anchor:'middle'});
 s+=line(bx,ay-9,bx,ay+9,{color:CX,w:3});
 if(v)s+=fade(v,arrow(bx,y-bh-14,bx+110,y-bh-14,{color:CV,w:6,head:16})+label('t ＝ 0 で 0.2 m/s',bx+55,y-bh-30,{size:24,color:CV,weight:700,anchor:'middle'}));
 return fade(g,s);
}
// 出題の図（rows：0〜1 の出方）
function setup({gr=1,v=1,pt=1,eq=1,g=1,lab=1}={}){
 let s=rig(-.03,{g:gr,v});
 s+=fade(gr*lab,label('x₀ ＝ −0.03 m',528,262,{size:22,color:CX,anchor:'end'}));
 const G=graph({x0:330,y0:395,w:600,hpm:1300,tmax:2.6,g:gr,xticks:[.06,-.06]});
 s+=G.svg+fade(pt,dot(G.X(0),G.Y(-.03),9,CX)+label('−0.03',G.X(0)+14,G.Y(-.03)+26,{size:22,color:CX,weight:700}));
 s+=card(820,95,340,70,T(`${XDD}=-25${XX}`,990,140,30),eq,C.hi);
 return fade(g,s);
}
// 小問1・2 のグラフ（説明の枠と並べる配置）
const GL=(o={})=>graph({x0:100,y0:300,w:480,hpm:2000,tmax:2.6,...o});
const tangent=(G,slope,len,color,g=1)=>fade(g,line(G.X(0),G.Y(-.03),G.X(len),G.Y(-.03+slope*len),{color,w:6}));
// 円と直角三角形（小問2）。cx,cy＝円の中心、R＝0.05 m
function circleTri({cx=180,cy=300,hpm=2000,g=1,tri=1,rad=0,link=1,G=null,lab=1}={}){
 const R=.05*hpm,px=cx+.04*hpm,py=cy+.03*hpm;
 let s=ring(cx,cy,R,{color:C.faint,w:2.5})+line(cx-R-16,cy,cx+R+16,cy,{color:C.grid,w:1.5})+line(cx,cy-R-16,cx,cy+R+16,{color:C.grid,w:1.5});
 if(tri){
  s+=fade(tri,line(cx,cy,px,cy,{color:CX,w:4})+line(px,cy,px,py,{color:CX,w:4})
   +draw([[px-14,cy],[px-14,cy+14],[px,cy+14]],1,{color:C.hi,w:2.5}));
  if(lab)s+=fade(tri,label('0.04',(cx+px)/2,cy-12,{size:22,color:CX,anchor:'middle',weight:700})+label('−0.03',px+10,(cy+py)/2+8,{size:22,color:CX,weight:700}));
 }
 s+=fade(rad,line(cx,cy,px,py,{color:C.hi,w:5})+label('0.05 m',cx-14,py+34,{size:24,color:C.hi,weight:700,anchor:'middle'}));
 s+=dot(px,py,9,CW);
 if(G)s+=fade(link,line(px,py,G.X(0),G.Y(-.03),{color:C.dim,w:2,dash:'5 6'}));
 return fade(g,s);
}
// 表（小問3）
const TX=[60,120,380,700,1050,1140],TY0=96,TH=50,RH=54;
const CAND=['\\sin25t','\\sin5t+0.1','0.5\\cos5t-2\\sin5t','(\\sin5t)^2'];
function table({g=1,fill={}}={}){
 let s=rect(TX[0],TY0,TX[5]-TX[0],TH+4*RH,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:10});
 const head=['候補','2回 微分','−25 × 元の式','一致？'];
 head.forEach((h,i)=>{s+=label(h,(TX[i+1]+TX[i+2])/2,TY0+34,{size:24,color:C.dim,anchor:'middle',weight:700});});
 s+=line(TX[0],TY0+TH,TX[5],TY0+TH,{color:C.faint,w:2});
 for(let i=1;i<5;i++)s+=line(TX[i],TY0,TX[i],TY0+TH+4*RH,{color:C.faint,w:1.5});
 ['A','B','C','D'].forEach((l,i)=>{const y=TY0+TH+RH*i+RH/2;
  if(i>0)s+=line(TX[0],TY0+TH+RH*i,TX[5],TY0+TH+RH*i,{color:C.grid,w:1.5});
  s+=label(l,(TX[0]+TX[1])/2,y+9,{size:26,color:C.ink,anchor:'middle',weight:700})+T(CAND[i],(TX[1]+TX[2])/2,y,28);
  const f=fill[l];if(f){
   s+=fade(f.g??1,T(f.d2,(TX[2]+TX[3])/2,y,f.size??28,{color:f.c2??C.ink})+(f.r?T(f.r,(TX[3]+TX[4])/2,y,f.size??28,{color:f.c3??C.ink}):'')
    +(f.ok===null?'':label(f.ok?'○':'×',(TX[4]+TX[5])/2,y+11,{size:32,color:f.ok?C.F:CD,anchor:'middle',weight:700})));
   if(f.hi)s+=highlight(TX[0]+4,y-RH/2+3,TX[5]-TX[0]-8,RH-6,f.hi,f.ok?C.F:CD);
  }
 });
 return fade(g,s);
}
const FILL={
 C:{d2:'-12.5\\cos5t+50\\sin5t',r:'-25(0.5\\cos5t-2\\sin5t)',ok:1},
 A:{d2:'-625\\sin25t',r:'-25\\sin25t',ok:0},
 B:{d2:'-25\\sin5t',r:`-25\\sin5t{\\color{${CD}}-2.5}`,ok:0},
 D:{d2:'50\\cos10t',r:'-25(\\sin5t)^2',ok:0},
};

export const ytQxUmOscillationEquationDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（5 s）：0〜2 s 床・ばね・おもり（x₀＝−0.03）・グラフの軸。2〜4 s 速度の矢印（紫）とグラフの t＝0 の点。4〜5 s 方程式の札。静止。
 [K+'q1']:(p,ctx)=>{const t=cueT(ctx);return setup({gr:seg(t,0,1.6),v:seg(t,2,2.8),pt:seg(t,2.6,3.4),eq:seg(t,4,4.6)});},

 // ===================== 小問1 =====================
 // 1. 出題の最後の画面。「求めるもの」と「p・q＝動画の A・B」
 [K+'goal1']:(p)=>{
  let s=setup({});
  s+=card(925,425,265,60,label('p・q ＝ 動画の A・B',1057,465,{size:24,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 文1：ω²＝25 → ω＝5。文2：cos 5t も sin 5t も2回微分で −25 倍（波を1本ずつ）→ 定数倍の和 p cos 5t＋q sin 5t も解（2026-10-16 PQ-012）
 [K+'form']:(p,ctx)=>{
  const G=GL(),W=sentWin(ctx),b=W[1]?W[1][0]:.3,d2=atWord(ctx,'にかいびぶん',b+.2*(1-b)),m=atWord(ctx,'そのていすう',b+.5*(1-b));
  let s=G.svg;
  s+=fade(seg(p,b,b+.06),G.plot(t=>.03*Math.cos(5*t),{color:CX,w:2.5})+label('cos 5t',G.X(.05),G.Y(.03)-14,{size:24,color:CX,weight:700}));
  s+=fade(seg(p,b+.06,b+.12),G.plot(t=>.03*Math.sin(5*t),{color:CX,w:2.5,dash:'8 7'})+label('sin 5t',G.X(1.5),G.Y(.03)-14,{size:24,color:CX,weight:700}));
  s+=panel(90,335,T(`${WW}^2=25\\ \\rightarrow\\ ${WW}=5`,PC,145,40)
   +fade(seg(p,b,b+.06),line(PX+40,185,PX+PW-40,185,{color:C.faint,w:2})+label('2回 微分すると −25 倍',PC,222,{size:24,color:C.dim,anchor:'middle',weight:700}))
   +fade(seg(p,d2,d2+.06),T(`(\\cos5t)''=-25\\cos5t`,PC,265,32))
   +fade(seg(p,d2+.05,d2+.11),T(`(\\sin5t)''=-25\\sin5t`,PC,310,32))
   +fade(seg(p,m,m+.06),T(`${XX}=p\\cos5t+q\\sin5t`,PC,362,36))
   +fade(seg(p,m+.08,m+.14),label('定数倍を 足しても 解',PC,408,{size:24,color:C.hi,anchor:'middle',weight:700})),1,C.faint);
  s+=card(925,440,265,56,label('p・q ＝ 動画の A・B',1057,477,{size:24,color:C.hi,anchor:'middle',weight:700}),1-seg(p,.15,.25),C.hi);
  s+=goalTag(G1);
  return s;
 },
 // 3. t＝0 の縦線（金）。cos の項 1×p、sin の項 0。点 −0.03 と p をつなぐ
 [K+'p']:(p,ctx)=>{
  const G=GL(),b=atWord(ctx,'いちは',.5);
  let s=G.svg+G.plot(t=>.03*Math.cos(5*t),{color:CX,w:2})+G.plot(t=>.03*Math.sin(5*t),{color:CX,w:2,dash:'8 7'});
  s=fade(1,s);
  s+=fade(seg(p,.03,.12),line(G.X(0),G.Y(.065),G.X(0),G.Y(-.065),{color:CT,w:4})+label('t ＝ 0',G.X(0)+10,G.Y(.065)+4,{size:24,color:CT,weight:700}));
  s+=fade(seg(p,b,b+.08),dot(G.X(0),G.Y(-.03),11,C.hi)+label('−0.03',G.X(0)+16,G.Y(-.03)+30,{size:24,color:C.hi,weight:700}));
  s+=panel(90,300,T(`${XX}(0)=p\\cdot\\cos0+q\\cdot\\sin0`,PC,150,32)
   +fade(seg(p,.25,.35),T(`=p\\cdot1+q\\cdot0=p`,PC,230,34))
   +fade(seg(p,b,b+.08),line(PX+40,275,PX+PW-40,275,{color:C.faint,w:2})+T(`p=-0.03`,PC,340,42,{color:C.hi})),1,C.faint);
  s+=goalTag(G1);
  return s;
 },
 // 4. 1回微分して速度。t＝0 で 5q＝0.2 → q＝0.04。グラフに傾き 0.2 の短い線（紫）
 [K+'q']:(p,ctx)=>{
  const G=GL(),b=atWord(ctx,'ごキューなので',.45),c=atWord(ctx,'ごキューイコール',.62);
  let s=G.svg+line(G.X(0),G.Y(.065),G.X(0),G.Y(-.065),{color:CT,w:3})+dot(G.X(0),G.Y(-.03),10,C.hi);
  s+=tangent(G,.2,.25,CV,seg(p,c,c+.1))+fade(seg(p,c,c+.1),label('傾き 0.2（＝ 速度）',G.X(.27),G.Y(.025)-6,{size:24,color:CV,weight:700}));
  s+=panel(90,330,T(`${VV}=-5p\\sin5t+5q\\cos5t`,PC,150,32)
   +fade(seg(p,b-.05,b+.05),label('t ＝ 0 で sin の 項は 0',PC,215,{size:24,color:C.dim,anchor:'middle'})+T(`${VV}(0)=5q`,PC,270,36))
   +fade(seg(p,c,c+.08),line(PX+40,305,PX+PW-40,305,{color:C.faint,w:2})+T(`5q=0.2\\ \\rightarrow\\ q=\\dfrac{0.2}{5}=0.04`,PC,370,34,{color:C.hi})),1,C.faint);
  s+=goalTag(G1);
  return s;
 },
 // 5. 足した波（太い水色）。t＝0 の点と傾きに丸。答えの札
 [K+'ans1']:(p,ctx)=>{
  const G=GL(),b=atWord(ctx,'しょうもん',.6);
  let s=G.svg+G.plot(XT,{p:seg(p,.03,.45),w:5});
  s+=tangent(G,.2,.25,CV)+dot(G.X(0),G.Y(-.03),10,C.hi);
  s+=fade(seg(p,.4,.5),ring(G.X(0),G.Y(-.03),22,{color:C.hi,w:3})+ring(G.X(.13),G.Y(-.004),22,{color:CV,w:3}));
  s+=panel(90,220,label('位置の 式',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(`${XX}=-0.03\\cos5t+0.04\\sin5t`,PC,205,30)
   +label('t＝0：x ＝ −0.03、傾き 0.2',PC,275,{size:24,color:C.ink,anchor:'middle'}),seg(p,.03,.12),C.hi);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.06));
  return s;
 },
 // 6. 誤答 A（傾き 1.0 の赤の短い線）→ 誤答 B
 [K+'wrongAB']:(p,ctx)=>{
  const G=GL(),m=atWord(ctx,'オメガを',.5),ve=voiceEnd(ctx),inA=seg(p,.01,.05)*(1-seg(p,m-.04,m));
  let s=G.svg+G.plot(XT,{w:5})+tangent(G,.2,.25,CV)+dot(G.X(0),G.Y(-.03),10,C.hi);
  s+=tangent(G,1,.08,CD,inA)+fade(inA,label('傾き 1.0（5倍）',G.X(.1),G.Y(.06)+4,{size:24,color:CD,weight:700}));
  s+=panel(90,150,T(`${XX}=-0.03\\cos5t+0.04\\sin5t`,PC,165,30),1,C.faint);
  s+=wrongSeq(p,ctx,[['A','…＋0.2 sin 5t','v₀ をそのまま使った。係数は v₀/ω'],['B','…＋1.0 sin 5t','v₀×ω。単位が m/s²']],{win:[[0,m],[m,1]],opts:{...WOPT,y:260}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 7. 誤答 C：係数を入れ替えた波（赤の点線）は t＝0 で ＋0.04
 [K+'wrongC']:(p)=>{
  const G=GL(),c=seg(p,.1,.3);
  let s=G.svg+G.plot(XT,{w:5})+dot(G.X(0),G.Y(-.03),10,C.hi);
  s+=fade(c,G.plot(t=>.04*Math.cos(5*t)-.03*Math.sin(5*t),{color:CD,w:3.5,dash:'9 7'})+dot(G.X(0),G.Y(.04),9,CD)+label('＋0.04',G.X(0)+14,G.Y(.04)-12,{size:24,color:CD,weight:700}));
  s+=panel(90,150,T(`${XX}=-0.03\\cos5t+0.04\\sin5t`,PC,165,30),1,C.faint);
  s+=wrongCard('C','0.04 cos 5t−0.03 sin 5t','係数を入れ替えた。位置は cos の項',{...WOPT,y:260,g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 8. 細い波・カードを消し、太い水色の波だけ
 [K+'goal2']:(p)=>{
  const G=GL();
  let s=G.svg+G.plot(XT,{w:5})+dot(G.X(0),G.Y(-.03),10,C.hi);
  s+=panel(90,220,label('小問2',PC,140,{size:28,color:C.dim,anchor:'middle'})+label('この 振動の 振幅 は？',PC,205,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('（波の 山の 高さ）',PC,260,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9. 円（波の左）。t＝0 の点（桃）から横 0.04、高さ −0.03 の2辺と直角の印。点の高さと波の値を線でつなぐ
 [K+'circle']:(p,ctx)=>{
  const G=graph({x0:330,y0:300,w:250,hpm:2000,tmax:1.5,tticks:[1],xticks:[]}),b=atWord(ctx,'ティーイコールゼロのてんは',.45);
  let s=G.svg+G.plot(XT,{w:5});
  s+=circleTri({tri:seg(p,b+.05,b+.2),G,link:seg(p,b+.2,b+.3)});
  s+=fade(seg(p,.05,.2),label('円を 回る 点',180,180,{size:24,color:CW,anchor:'middle',weight:700}));
  s+=panel(90,250,label('振幅 ＝ 円の 半径',PC,145,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.08),line(PX+40,185,PX+PW-40,185,{color:C.faint,w:2})+label('t ＝ 0 の 点',PC,235,{size:26,color:CW,anchor:'middle',weight:700})
    +label('横 0.04、高さ −0.03',PC,290,{size:28,color:CX,anchor:'middle',weight:700})),1,C.faint);
  s+=goalTag(G2);
  return s;
 },
 // 10. 3・4・5 の直角三角形。半径（黄）0.05 m と波の山の高さ 0.05 をつなぐ。答えの札
 [K+'ans2']:(p,ctx)=>{
  const G=graph({x0:330,y0:300,w:250,hpm:2000,tmax:1.5,tticks:[1],xticks:[.05]}),W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=G.svg+G.plot(XT,{w:5});
  s+=circleTri({rad:seg(p,.3,.42),G});
  const tp=(Math.PI/2+Math.atan2(.03,.04))/5;   // 波の山の時刻
  s+=fade(seg(p,.4,.5),line(180,G.Y(.05),G.X(tp),G.Y(.05),{color:C.hi,w:2.5,dash:'6 6'})+dot(G.X(tp),G.Y(.05),8,C.hi)+dot(180,G.Y(.05),7,C.hi));
  s+=panel(90,300,label('三平方',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +T(`\\sqrt{0.03^2+0.04^2}`,PC,205,38)+fade(seg(p,.15,.25),T(`=\\sqrt{0.0025}`,PC,275,36))
   +fade(seg(p,.25,.35),T(`=0.05\\ \\mathrm{m}`,PC,345,40,{color:C.hi})),1,C.faint);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.06));
  return s;
 },
 // 11. 誤答 B → C → D を1枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const G=graph({x0:330,y0:300,w:250,hpm:2000,tmax:1.5,tticks:[1],xticks:[.05]}),W=sentWin(ctx),m=atWord(ctx,'れいてんれいいちは',.25);
  let s=G.svg+G.plot(XT,{w:5})+circleTri({rad:1,G});
  s+=panel(90,140,T(`\\sqrt{0.03^2+0.04^2}=0.05\\ \\mathrm{m}`,PC,165,32),1,C.faint);
  s+=wrongSeq(p,ctx,[['B','0.07 m','2辺をそのまま足した。斜辺は短い'],['C','0.01 m','−0.03＋0.04 と符号付きで足した'],['D','0.2 m','速度の値。単位は m/s']],{win:[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]],opts:{...WOPT,y:250}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 12. 円・カードを消す。方程式と「解」の意味
 [K+'goal3']:(p)=>{
  let s=card(250,110,700,300,T(`${XDD}=-25${XX}`,600,215,56)
   +fade(seg(p,.4,.55),label('解 ＝ 入れると 両辺が 等しくなる 関数',600,335,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.03,.15));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 13. 表（候補／2回微分／−25×元の式／一致？）
 [K+'table']:(p)=>table({g:seg(p,.03,.15)})+fade(seg(p,.3,.45),label('2回 微分 ＝ −25 × 元の式 なら 解',600,420,{size:28,color:C.hi,anchor:'middle',weight:700}))+goalTag(G3),
 // 14. C の行：各項から 5 が2回前に出て −25 倍。一致に丸。答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=table({fill:{C:{...FILL.C,g:seg(p,.15,.3),hi:seg(p,b-.1,b)}}});
  s+=fade(seg(p,.3,.42),T(`\\cos5t\\ \\rightarrow\\ -5\\sin5t\\ \\rightarrow\\ -25\\cos5t`,600,410,30));
  s+=fade(seg(p,.42,.52),label('中身の 5 を 2回 掛ける → −25 倍',600,470,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3)+ANS3(seg(p,b,b+.06));
  return s;
 },
 // 15. A の行（−625 倍）→ B の行（−2.5 が合わない）。誤答カードは1枚ずつ
 [K+'wrongAB3']:(p,ctx)=>{
  const m=atWord(ctx,'サインごティープラス',.45);
  let s=table({fill:{C:FILL.C,A:{...FILL.A,g:seg(p,.03,.1),hi:seg(p,.03,.1)*(1-seg(p,m-.04,m))},B:{...FILL.B,g:seg(p,m,m+.06),hi:seg(p,m,m+.06)}}});
  s+=wrongSeq(p,ctx,[['A','sin 25t','ω²＝25 を ω＝25 とした。−625 倍'],['B','sin 5t＋0.1','定数 0.1 の分が合わない']],{win:[[0,m],[m,1]],opts:{y:370,w:900,x:150}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 16a. D の行。(sin 5t)²＝(1−cos 10t)/2 → 2回微分 50 cos 10t を一段ずつ（表の D の行の「2回 微分」も埋める）（2026-10-16 PQ-013）
 [K+'wrongD3']:(p,ctx)=>{
  const d2=atWord(ctx,'にかいびぶん',.55);
  let s=table({fill:{C:FILL.C,A:FILL.A,B:FILL.B,D:{...FILL.D,ok:null,r:'',g:seg(p,d2+.06,d2+.12)}}});
  s+=fade(seg(p,.02,.08),rect(150,372,900,118,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:12})
   +T(`(\\sin5t)^2=\\dfrac{1-\\cos10t}{2}`,420,431,30)
   +fade(seg(p,d2,d2+.06),arrow(610,431,690,431,{color:C.dim,w:3,head:12})+label('2回 微分',650,416,{size:22,color:C.dim,anchor:'middle'})
    +T(`50\\cos10t`,830,431,34,{color:C.hi})));
  return s+goalTag(G3)+ANS3(1);
 },
 // 16b. −25(sin 5t)² と比べて ×、誤答カード D。声のあと、まとめ（波・円・3・4・5）と答えの札3枚で静止
 [K+'wrongD3b']:(p,ctx)=>{
  const ve=voiceEnd(ctx),sum=seg(p,ve+.02,ve+.08),pre=1-sum;
  let s='';
  if(pre>0){
   let a=table({fill:{C:FILL.C,A:FILL.A,B:FILL.B,D:{...FILL.D,hi:seg(p,.03,.12)}}});
   a+=fade(1-seg(p,0,.05),rect(150,372,900,118,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:12})+T(`(\\sin5t)^2=\\dfrac{1-\\cos10t}{2}`,420,431,30)
    +arrow(610,431,690,431,{color:C.dim,w:3,head:12})+label('2回 微分',650,416,{size:22,color:C.dim,anchor:'middle'})+T(`50\\cos10t`,830,431,34,{color:C.hi}));
   a+=wrongCard('D','(sin 5t)²',['2回 微分は 50 cos 10t','−25(sin 5t)² と 一致しない'],{y:370,w:900,x:150,g:seg(p,.05,.1)});
   a+=goalTag(G3)+ANS3(1);
   s+=fade(pre,a);
  }
  if(sum>0){
   const G=graph({x0:400,y0:300,w:380,hpm:2000,tmax:2,tticks:[1,2],xticks:[.05,-.03]});
   let z=G.svg+G.plot(XT,{w:5})+tangent(G,.2,.25,CV)+dot(G.X(0),G.Y(-.03),10,C.hi);
   z+=circleTri({cx:200,rad:1,G});
   const tp=(Math.PI/2+Math.atan2(.03,.04))/5;
   z+=line(200,G.Y(.05),G.X(tp),G.Y(.05),{color:C.hi,w:2.5,dash:'6 6'})+dot(G.X(tp),G.Y(.05),8,C.hi);
   z+=card(880,130,300,250,label('t ＝ 0',1030,175,{size:24,color:CT,anchor:'middle',weight:700})+label('位置 −0.03 m',1030,225,{size:26,color:CX,anchor:'middle',weight:700})
    +label('傾き 0.2 m/s',1030,275,{size:26,color:CV,anchor:'middle',weight:700})+label('振幅 0.05 m',1030,340,{size:26,color:C.hi,anchor:'middle',weight:700}),1);
   z+=T(`${XX}=-0.03\\cos5t+0.04\\sin5t`,600,470,30);
   z+=answerRow([[1,'D',''],[2,'A','0.05 m'],[3,'C','']],{g:seg(p,ve+.1,ve+.16)});
   s+=fade(sum,z);
  }
  return s;
 },
};
