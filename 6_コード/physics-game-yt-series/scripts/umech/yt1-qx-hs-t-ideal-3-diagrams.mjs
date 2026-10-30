// 問題編 解説「ヘリウムの内部エネルギーと分子の速さ」(ys-qx-hs-t-ideal-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/203_状態方程式.md の q-hs-t-ideal-3（解説 18 行）。
// 色（正本）：速度・速さ 紫、絶対温度 T 黄緑、エネルギー（U・運動エネルギー）橙、圧力（壁を押す力）緑、強調 黄、誤り 赤（×）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// ヘリウムの分子は白い1個の玉、酸素の分子は2個の玉を棒でつないだ形。酸素の飛ぶ向きの矢印はヘリウムより短く描く（長さは模式）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,clamp,mix,draw} from './anim.mjs';
import {thermo} from './yt1-hs-t-heat-1-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-t-ideal-3:';
const VCOL=QC.v,TC=QC.T,UC=QC.U,FC=QC.F,RED='#ff6b6b',WHITE='#eef3fb',OXY='#ff9a7a';
const TX=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const G1='U',G2='速さ2倍の温度',G3='使える式';
const A1=g=>answerTag(1,'A','約1.0×10⁴ J',{g}),A2=g=>answerTag(2,'D','1600 K',{g}),A3=g=>answerTag(3,'C','',{g});
const Ut=`{\\color{${UC}}U}`,Tt=`{\\color{${TC}}T}`,AV2=`\\overline{{\\color{${VCOL}}v}^{2}}`;
const UF=`${Ut}=\\dfrac{3}{2}nR${Tt}`;
function at(ctx,s,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(s.replace(/\s/g,''));
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}

// ---- 容器と分子 ----------------------------------------------------------------------------------------
const BX={x:80,y:100,w:420,h:300};
const N=10;
// 分子 i の位置と速度の向き（箱の壁ではね返る。t 秒、sp＝速さの倍率）
function molAt(i,t,sp=1,box=BX){
 const a=(i*2.399+.7)%(2*Math.PI),v=60*sp*(.8+.4*((i*37)%7)/7);
 const W=box.w-60,H=box.h-60,ux=((i*53)%11)/11,uy=((i*29)%13)/13;
 const tri=(z)=>{const q=((z%2)+2)%2;return q<1?q:2-q;};
 const zx=ux*2+v*Math.cos(a)*t/W,zy=uy*2+v*Math.sin(a)*t/H;
 const dx=Math.sign(Math.cos(a))*((((zx%2)+2)%2)<1?1:-1),dy=Math.sign(Math.sin(a))*((((zy%2)+2)%2)<1?1:-1);
 return {x:box.x+30+W*tri(zx),y:box.y+30+H*tri(zy),dx:dx*Math.abs(Math.cos(a)),dy:dy*Math.abs(Math.sin(a))};
}
const boxFrame=(g=1,box=BX)=>fade(g,rect(box.x,box.y,box.w,box.h,{fill:'#0f1a30',fo:.85,stroke:C.dim,sw:2.5,rx:6}));
// ヘリウム（白い玉＋紫の速さの矢印）
function heBox(t,{g=1,arr=1,n=N,box=BX,lab='He 2.0 mol'}={}){
 let s=boxFrame(1,box);
 for(let i=0;i<n;i++){const m=molAt(i,t,1,box);
  if(arr)s+=fade(arr,arrow(m.x,m.y,m.x+m.dx*46,m.y+m.dy*46,{color:VCOL,w:3.5,head:11}));
  s+=dot(m.x,m.y,10,WHITE);}
 if(lab)s+=label(lab,box.x+box.w/2,box.y+box.h+42,{size:30,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// 酸素（2個の玉を棒でつないだ形）。rot＝回転の速さ、rarr＝回転の矢印、varr＝飛ぶ向きの矢印（ヘリウムより短い）
function diatom(x,y,ang,{r=9,d=15}={}){const dx=d*Math.cos(ang),dy=d*Math.sin(ang);return line(x-dx,y-dy,x+dx,y+dy,{color:'#c9d2e3',w:5})+dot(x-dx,y-dy,r,OXY)+dot(x+dx,y+dy,r,OXY);}
const rotArrow=(x,y,R=28)=>`<path d="M${x+R} ${y} A${R} ${R} 0 1 1 ${x} ${y-R}" fill="none" stroke="${UC}" stroke-width="3.5"/>`+`<polygon points="${x},${y-R-7} ${x+10},${y-R} ${x},${y-R+7}" fill="${UC}"/>`;
function o2Box(t,{g=1,rarr=0,varr=0,n=N,box=BX,lab='O₂ 2.0 mol',rot=0}={}){
 let s=boxFrame(1,box);
 for(let i=0;i<n;i++){const m=molAt(i,t,.72,box),ang=i*.9+rot*t*(1+.3*(i%3));
  if(varr)s+=fade(varr,arrow(m.x,m.y,m.x+m.dx*30,m.y+m.dy*30,{color:VCOL,w:3.5,head:10}));
  s+=diatom(m.x,m.y,ang);
  if(rarr)s+=fade(rarr,rotArrow(m.x,m.y));}
 if(lab)s+=label(lab,box.x+box.w/2,box.y+box.h+42,{size:30,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
const TH={x:600,top:130,bot:330};
const therm=(g=1,text='127℃')=>fade(g,thermo(TH.x,TH.top,TH.bot,120,{color:TC,w:22})+label(text,TH.x,TH.bot+78,{size:32,color:TC,anchor:'middle',weight:700}));

// ---- グラフ（左：T と v² の平均＝直線、右：T と 速さの目安＝平方根の曲線）-------------------------------------
const GL={x:110,y:450,w:420,h:220},GR={x:690,y:450,w:420,h:220},TMAX=1900;
const gx=(G,T)=>G.x+G.w*T/TMAX;
const yLin=(G,T)=>G.y-G.h*T/1600,ySq=(G,T)=>G.y-G.h*Math.sqrt(T/1600);
function axes2(G,ylab,{g=1}={}){
 let s=arrow(G.x-8,G.y,G.x+G.w+24,G.y,{color:C.dim,w:2.5,head:12})+arrow(G.x,G.y+8,G.x,G.y-G.h-30,{color:C.dim,w:2.5,head:12});
 s+=label('T [K]',G.x+G.w+20,G.y+36,{size:24,color:TC,anchor:'middle',weight:700})+label(ylab,G.x+10,G.y-G.h-40,{size:24,color:VCOL,weight:700});
 for(const T of [400,800,1600])s+=line(gx(G,T),G.y-6,gx(G,T),G.y+6,{color:C.dim})+label(String(T),gx(G,T),G.y+30,{size:22,color:TC,anchor:'middle'});
 return fade(g,s);
}
function linGraph({g=1,u=1,pt=-1,lab=1}={}){
 let s=axes2(GL,lab?'v² の 平均':'');
 s+=draw([[GL.x,GL.y],[gx(GL,1800),yLin(GL,1800)]],u,{color:VCOL,w:4});
 if(pt>=0)s+=dot(gx(GL,pt),yLin(GL,pt),10,C.hi);
 return fade(g,s);
}
function sqGraph({g=1,u=1,pt=-1,red=0,lab=1}={}){
 let s=axes2(GR,lab?'速さの 目安':'');
 s+=draw(Array.from({length:61},(_,i)=>{const T=1800*i/60;return [gx(GR,T),ySq(GR,T)];}),u,{color:VCOL,w:4});
 if(pt>=0)s+=dot(gx(GR,pt),ySq(GR,pt),10,C.hi);
 if(red)s+=fade(red,dot(gx(GR,800),ySq(GR,800),11,RED)+line(gx(GR,800),ySq(GR,800),gx(GR,800),GR.y,{color:RED,w:2,dash:'6 5'})+label('約1.4倍',gx(GR,800)-16,ySq(GR,800)-18,{size:26,color:RED,anchor:'end',weight:700}));
 return fade(g,s);
}
// 橙の棒（下端 y0、高さ h）
const ebar=(x,y0,w,h,{col=UC,fo=.6,g=1}={})=>fade(g,rect(x,y0-h,w,h,{fill:col,fo,stroke:col,sw:2,rx:4}));

export const qxHsTIdeal3Diagrams={
 // ================= 問題アニメ：出題中（小問1・2、5 秒＋静止）=================
 // 0〜2 秒：容器が現れる。2〜5 秒：ヘリウムの分子（白い1個の玉、速さは紫の矢印）が飛び回る。札「He 2.0 mol」「127℃」。
 // 出さないもの：U の値と棒、温度と速さのグラフ、回転の矢印。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx),tm=Math.max(0,t-2);
  let s=boxFrame(seg(t/5,0,.3));
  s+=fade(seg(t/5,.38,.5),heBox(tm,{lab:''}));
  s+=fade(seg(t/5,.55,.68),label('He 2.0 mol',BX.x+BX.w/2,BX.y+BX.h+42,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=therm(seg(t/5,.7,.85));
  return s;
 },
 // 小問3 の出題（約3秒）：分子が酸素（2個の玉）に入れ替わる。ヘリウムの紫の矢印は消す。飛ぶ動きだけ（回転の矢印なし）。
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=fade(1-seg(p,.12,.28),heBox(3,{arr:1-seg(p,0,.12),lab:'He 2.0 mol'}))+fade(seg(p,.3,.45),o2Box(Math.min(t,2.4)));
  s+=therm(1);
  return s;
 },
 // ================= S1 小問1：内部エネルギー =================
 [K+'goal1']:(p,ctx)=>heBox(3+cueT(ctx))+therm()+goalTag(G1,{g:seg(p,.05,.2)}),
 // 2. 各分子の紫の矢印から小さな橙の棒が出て、一本の橙の棒 U に積み上がる。U＝(3/2)nRT。前提タグ
 [K+'ubar']:(p,ctx)=>{
  const t=3+cueT(ctx)*.4,u=lin(p,.1,.62);
  let s=heBox(t,{lab:'He 2.0 mol'});
  const SX=560,SY=400,PH=22;
  for(let i=0;i<N;i++){const m=molAt(i,t),k=clamp((u-i*.07)/.3),kk=k*k*(3-2*k);
   if(k<=0)continue;
   const x=mix(m.x,SX,kk),y=mix(m.y,SY-PH*(i+1)+2,kk);
   s+=rect(x,y,60,PH-3,{fill:UC,fo:.75,stroke:UC,sw:1.5,rx:3});}
  s+=fade(seg(p,.6,.7),label('U',SX+30,SY-PH*N-14,{size:34,color:UC,anchor:'middle',weight:700}));
  s+=card(680,120,480,130,TX(UF,920,198,50),seg(p,.6,.72),UC);
  s+=kindTag('前提',920,300,{g:seg(p,.68,.78),text:'単原子分子・理想気体'});
  return s+goalTag(G1);
 },
 // 3. 127＋273＝400。掛け算を一つずつ → 9960 ≈ 1.0×10⁴ J
 [K+'calc']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.25;
  let s=card(300,96,600,80,label('T ＝ 127 ＋ 273 ＝ 400 K',600,150,{size:36,color:TC,anchor:'middle',weight:700}),seg(p,.03,.1),TC);
  s+=fade(seg(p,b,b+.06),label('1.5 × 2.0 ＝ 3.0',380,240,{size:34,color:C.ink,weight:700}));
  s+=fade(seg(p,b+.12,b+.18),label('3.0 × 8.3 ＝ 24.9',380,300,{size:34,color:C.ink,weight:700}));
  s+=fade(seg(p,b+.24,b+.3),label('24.9 × 400 ＝ 9960',380,360,{size:34,color:C.ink,weight:700}));
  s+=card(330,390,540,84,label('≈ 1.0×10⁴ J',600,446,{size:40,color:UC,anchor:'middle',weight:700}),seg(p,b+.4,b+.48),UC);
  s+=fade(seg(p,b,b+.06),TX(UF,960,240,38));
  return s+goalTag(G1);
 },
 // 4. 答え A（1文目）。誤答 B（2文目）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35;
  let s=card(250,100,700,130,TX(`${UF}\\approx1.0\\times10^{4}\\ \\mathrm{J}`,600,178,44),1,C.faint);
  s+=wrongCard('B','6.6×10³ J','3/2 を 掛け忘れ（nRT ＝ PV）',{g:seg(p,b,b+.06)});
  return s+goalTag(G1)+A1(seg(p,.03,.12));
 },
 // 5. 誤答 C（n を 1.0 mol）、D（127℃ のまま）を1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  let s=card(250,100,700,130,TX(`${UF}\\approx1.0\\times10^{4}\\ \\mathrm{J}`,600,178,44),1,C.faint);
  s+=wrongSeq(p,ctx,[['C','5.0×10³ J','n を 1.0 mol と した'],['D','3.2×10³ J','127℃ の まま 入れた']]);
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2：速さを2倍に =================
 [K+'goal2']:(p,ctx)=>heBox(6+cueT(ctx))+therm()+goalTag(G2,{g:seg(p,.05,.2)}),
 // 7. v² の平均＝3RT/M。R と M に鍵の印 → 原点を通る直線のグラフ
 [K+'vms']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(640,90,480,110,TX(`${AV2}=\\dfrac{3R${Tt}}{M}`,880,160,44),seg(p,.03,.12),VCOL);
  s+=fade(seg(p,b,b+.06),label('R・M は 決まった 数',880,250,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=linGraph({g:seg(p,b+.1,b+.16),u:lin(p,b+.14,b+.4)});
  s+=fade(seg(p,b+.4,b+.48),label('T に 比例',GL.x+GL.w-10,yLin(GL,1000)+44,{size:26,color:VCOL,anchor:'end',weight:700}));
  return s+goalTag(G2);
 },
 // 8. 速さの目安は平方根 → 平方根の曲線のグラフ。2²＝4 を黄の枠
 [K+'sqrt']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=linGraph({});
  s+=sqGraph({g:seg(p,.03,.1),u:lin(p,.06,b)});
  s+=fade(seg(p,.1,.2),label('速さの 目安 ＝ √(v² の 平均)',900,128,{size:26,color:VCOL,anchor:'middle',weight:700}));
  s+=card(110,90,260,74,label('2² ＝ 4',240,140,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,b+.15,b+.22),C.hi);
  return s+goalTag(G2);
 },
 // 9. 点が T＝400 K から 1600 K へ。速さは2倍、v² の平均は4倍。2文目で答え D
 [K+'move']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,T=mix(400,1600,seg(p,.1,.45));
  let s=linGraph({pt:T})+sqGraph({pt:T});
  const o=seg(p,.45,.52);
  s+=fade(o,line(GL.x,yLin(GL,400),gx(GL,400),yLin(GL,400),{color:C.hi,w:2,dash:'6 5'})+line(GL.x,yLin(GL,1600),gx(GL,1600),yLin(GL,1600),{color:C.hi,w:2,dash:'6 5'})+label('× 4',GL.x+30,(yLin(GL,400)+yLin(GL,1600))/2+10,{size:30,color:C.hi,weight:700}));
  s+=fade(o,line(GR.x,ySq(GR,400),gx(GR,400),ySq(GR,400),{color:C.hi,w:2,dash:'6 5'})+line(GR.x,ySq(GR,1600),gx(GR,1600),ySq(GR,1600),{color:C.hi,w:2,dash:'6 5'})+label('× 2',GR.x+30,(ySq(GR,400)+ySq(GR,1600))/2+10,{size:30,color:C.hi,weight:700}));
  s+=card(420,96,360,70,label('400 × 4 ＝ 1600 K',600,142,{size:32,color:TC,anchor:'middle',weight:700}),seg(p,.3,.38),TC);
  return s+goalTag(G2)+A2(seg(p,b,b+.08));
 },
 // 10. 誤答 A（800 K では速さ √2 倍、約1.4倍）。曲線上の 800 K の点を赤
 [K+'wrongA']:(p)=>{
  let s=sqGraph({red:seg(p,.1,.2),pt:1600});
  s+=fade(.5,linGraph({lab:0}));
  s+=wrongCard('A','800 K','速さは √2 倍（約1.4倍）だけ',{x:60,w:560,y:84,g:seg(p,.02,.08)});
  return s+goalTag(G2)+A2(1);
 },
 // 11. 誤答 B（400×√2）、C（℃ の数値を2倍）を1枚ずつ
 [K+'wrongBC']:(p,ctx)=>{
  let s=fade(.5,linGraph({lab:0})+sqGraph({pt:1600,lab:0}));
  s+=wrongSeq(p,ctx,[['B','566 K','関係を 逆に した（400×√2）'],['C','254℃','℃ の 数値を 2倍']],{opts:{x:150,w:900,y:84}});
  return s+goalTag(G2)+A2(1);
 },
 // 12. 橙の棒「1個の運動エネルギーの平均」が4倍に伸びる。「∝ T」
 [K+'ke']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,h=mix(60,240,seg(p,.12,.45));
  let s=ebar(300,440,120,60,{fo:.35})+label('400 K',360,476,{size:26,color:TC,anchor:'middle',weight:700});
  s+=ebar(560,440,120,h)+label(h>230?'1600 K':'',620,476,{size:26,color:TC,anchor:'middle',weight:700});
  s+=fade(seg(p,.45,.52),label('× 4',720,440-h/2,{size:34,color:C.hi,weight:700}));
  s+=label('1個あたりの 運動エネルギーの 平均',490,110,{size:30,color:UC,anchor:'middle',weight:700});
  s+=card(820,200,280,90,label('∝ T',960,258,{size:40,color:TC,anchor:'middle',weight:700}),seg(p,b,b+.08),TC);
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3：2原子分子 =================
 [K+'goal3']:(p,ctx)=>o2Box(cueT(ctx))+therm()+goalTag(G3,{g:seg(p,.05,.2)}),
 // 14. 酸素の分子に回転の矢印（橙）。飛ぶ向きの紫の矢印も付けるが、ヘリウムより短い（長さは模式）
 [K+'rot']:(p,ctx)=>{
  const t=2.5+cueT(ctx);
  let s=o2Box(t,{rot:2.2,rarr:seg(p,.3,.4),varr:seg(p,.1,.2)});
  s+=fade(seg(p,.1,.2),label('飛ぶ 運動',780,170,{size:30,color:VCOL,anchor:'middle',weight:700})+arrow(700,210,860,210,{color:VCOL,w:4,head:14}));
  s+=fade(seg(p,.3,.4),label('回転',780,300,{size:30,color:UC,anchor:'middle',weight:700})+rotArrow(780,360,34));
  s+=note('（矢印の 長さは 模式。同じ 温度では 酸素の 分子の ほうが 遅い）',600,500,{g:seg(p,.12,.22)});
  return s+goalTag(G3);
 },
 // 15. 橙の棒 U に「回転の分」を上に足す。(3/2)nRT の線より上に出る
 [K+'ubig']:(p)=>{
  const y0=440,h0=200,h1=110*seg(p,.35,.6);
  let s=ebar(450,y0,140,h0)+label('飛ぶ 運動の 分',520,y0-h0/2+8,{size:24,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.15),line(380,y0-h0,700,y0-h0,{color:C.dim,w:2.5,dash:'8 6'})+TX(`\\dfrac{3}{2}nR${Tt}`,800,y0-h0+8,36));
  if(h1>1)s+=rect(450,y0-h0-h1,140,h1,{fill:'#ffd6a0',fo:.55,stroke:'#ffd6a0',sw:2,rx:4})+fade(seg(p,.5,.6),label('回転の 分',520,y0-h0-h1/2+8,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.7),arrow(640,y0-h0,640,y0-h0-h1,{color:C.hi,w:4,head:14})+label('U は もっと 大きい',660,y0-h0-h1/2-20,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.05,.15),label('U',520,y0+40,{size:32,color:UC,anchor:'middle',weight:700}));
  s+=card(80,110,330,80,TX(`${UF}`,245,160,32)+line(100,150,390,150,{color:RED,w:4}),seg(p,.1,.2),RED);
  return s+goalTag(G3);
 },
 // 16. 壁を押すのは飛ぶ運動だけ（緑の矢印はヘリウムと同じ長さ）→ 2文目で PV＝nRT に緑の○、前提タグ「薄い気体」
 [K+'pv']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,t=cueT(ctx);
  const B1={x:70,y:100,w:330,h:230},B2={x:600,y:100,w:330,h:230};
  let s=heBox(t,{box:B1,n:8,arr:0,lab:''})+o2Box(t,{box:B2,n:8,lab:'',rot:2.2});
  s+=label('He',B1.x+18,B1.y+38,{size:28,color:C.ink,weight:700})+label('O₂',B2.x+18,B2.y+38,{size:28,color:C.ink,weight:700});
  for(const B of [B1,B2])s+=fade(seg(p,.1,.2),arrow(B.x+B.w+6,B.y+B.h/2,B.x+B.w+96,B.y+B.h/2,{color:FC,w:7,head:20}));
  s+=fade(seg(p,.1,.2),label('壁を 押す 力（同じ 長さ）',600,390,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=card(380,410,440,80,TX(`{\\color{${FC}}P}{\\color{${QC.x}}V}=nR${Tt}`,620,460,40)+label('○',440,464,{size:40,color:FC,weight:700}),seg(p,b,b+.06),FC);
  s+=kindTag('前提',990,452,{g:seg(p,b+.1,b+.16),text:'薄い気体'});
  return s+goalTag(G3);
 },
 // 17. 答え C（1文目）。誤答 A・B・D を1枚ずつ（2文目）
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.25,d=(1-b)/3;
  let s=card(150,96,420,100,TX(`{\\color{${FC}}P}{\\color{${QC.x}}V}=nR${Tt}`,360,154,38),1,FC)+label('○ 使える',360,226,{size:28,color:FC,anchor:'middle',weight:700});
  s+=card(630,96,420,100,TX(UF,840,154,36),1,RED)+label('× 使えない（もっと 大きい）',840,226,{size:26,color:RED,anchor:'middle',weight:700});
  s+=wrongSeq(p,ctx,[['A','両方 使える','回転の 分を 忘れた'],['B','両方 使えない','PV＝nRT は 使える'],['D','U だけ 使える','条件が 逆']],{win:[[b,b+d],[b+d,b+2*d],[b+2*d,1]]});
  return s+goalTag(G3)+A3(seg(p,.03,.12));
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p)=>{
  let s=card(250,110,700,180,TX(`\\dfrac{1}{2}m${AV2}\\ \\propto\\ ${Tt}`,600,214,64),seg(p,.05,.18),UC);
  s+=fade(seg(p,.3,.42),label('絶対温度 ＝ 分子 1個の 運動エネルギーの 平均に 比例',600,350,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.68),label('式ごとに、成り立つ 条件を 確かめる',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'A','約1.0×10⁴ J'],[2,'D','1600 K'],[3,'C','']],{size:22,g:seg(p,.03,.12)});
  return s;
 },
};
