// 問題編 解説「ベランダのボールと、ばね」(ys-qx-hs-m-energy-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/107_仕事とエネルギー.md の q-hs-m-energy-2（解説 18 行）。
// 色（単元動画 ys-hs-m-energy-2 と同じ）：U 薄い橙、力 緑、高さ・伸び 水色、強調 黄（基準の線も黄）。
// 縮尺：高さ 1 m ＝ 85 px。U の棒は 20 J ＝ 85 px（mg＝20 N なので、棒の長さは高さの差と同じになる）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,lin,fade,label,line,rect,arrow,tex,texWidth,ground,wall,spring,axes,poly,clamp} from './anim.mjs';
import {UC,FA,ball} from './yt1-hs-m-energy-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,note,cueT,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-energy-2:';
const G1='地面での U（机基準）',G2='落ちる間に減る U',G3='ばねの U';
const A1=g=>answerTag(1,'B','−20 J',{g}),A2=g=>answerTag(2,'D','80 J',{g}),A3=g=>answerTag(3,'A','9.0 J',{g});
function wAt(ctx,word,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const HC=C.x;                          // 高さ h（水色）
const Ht=`{\\color{${HC}}h}`,Ut=`{\\color{${UC}}U}`;

// ---- 庭とベランダ ------------------------------------------------------------------------------
const GY=470,PM=85,yH=h=>GY-PM*h,DESK=yH(1),VER=yH(4);
// FULL：解説の S1・S2（右に式のカード）。Q：出題中の図とまとめ（左の枠に収める）
const FULL={rx:96,b0:116,b1:210,s1:310,bx:268,ax:345,d0:440,d1:540,x1:690,vb:590,gb:640};
const Q={rx:96,b0:116,b1:200,s1:290,bx:252,ax:330,d0:390,d1:490,x1:590,vb:540,gb:580};
function yard(L,{g=1,baseG=1,base=DESK,hiBase=0,ghost=0,fall=0,ballG=1,baseLab=1}={}){
 let s=ground(L.rx-10,L.x1+10,GY);
 // 高さの目盛り
 s+=line(L.rx,GY,L.rx,VER-20,{color:HC,w:3});
 for(const [h,t] of [[0,'0 m'],[1,'1.0 m'],[4,'4.0 m']])s+=line(L.rx-8,yH(h),L.rx+8,yH(h),{color:HC,w:3})+label(t,L.rx-14,yH(h)+8,{size:22,color:HC,anchor:'end',weight:700});
 // 建物とベランダ
 s+=rect(L.b0,VER-30,L.b1-L.b0,GY-VER+30,{fill:'#2a3550',fo:.9,stroke:'#4a5a7a',sw:2,rx:4});
 for(let k=0;k<3;k++)s+=rect(L.b0+18,VER+40+k*95,L.b1-L.b0-36,46,{fill:'#7fb6ff',fo:.18,stroke:'none',rx:3});
 s+=rect(L.b0,VER,L.s1-L.b0,10,{fill:'#8c96aa',fo:.95,stroke:'none',rx:2})+line(L.s1,VER,L.s1,VER-34,{color:'#8c96aa',w:3})+line(L.b1,VER-34,L.s1,VER-34,{color:'#8c96aa',w:3});
 s+=label('ベランダ',(L.b1+L.s1)/2,VER+40,{size:22,color:C.dim,anchor:'middle'});
 // 机
 s+=rect(L.d0,DESK,L.d1-L.d0,10,{fill:'#6f8db0',fo:.95,stroke:'none',rx:3})+line(L.d0+14,DESK+10,L.d0+14,GY,{color:'#6f8db0',w:5})+line(L.d1-14,DESK+10,L.d1-14,GY,{color:'#6f8db0',w:5});
 s+=label('机',(L.d0+L.d1)/2,GY-24,{size:24,color:C.dim,anchor:'middle',weight:700});
 // ボール
 s+=fade(ballG,ball(L.bx,VER-18,{r:18}));
 s+=fade(ballG,label('2.0 kg',L.bx-26,VER-8,{size:22,color:C.ink,anchor:'end',weight:700}));
 if(fall)s+=fade(fall,line(L.bx,VER+12,L.bx,GY-38,{color:C.dim,w:3,dash:'6 8'})+arrow(L.bx,GY-90,L.bx,GY-40,{color:C.dim,w:3,head:12}));
 if(ghost)s+=fade(ghost,`<circle cx="${L.bx}" cy="${GY-18}" r="18" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="5 5"/>`+label('地面',L.bx,GY+40,{size:22,color:C.ink,anchor:'middle',weight:700}));
 // 基準の線（左から右へ引く）
 const xe=L.rx+(L.x1-L.rx)*baseG;
 if(baseG>0){
  if(hiBase)s+=fade(hiBase,line(L.rx,base,xe,base,{color:C.hi,w:14,opacity:.25}));
  s+=line(L.rx,base,xe,base,{color:C.hi,w:4});
  if(baseLab)s+=fade(seg(baseG,.8,1),label('基準 0',L.x1+2,base-10,{size:24,color:C.hi,anchor:'end',weight:700}));
 }
 return fade(g,s);
}
// 高さの矢印（基準から）。h＝m
function hArrow(L,h,text,{g=1,base=DESK}={}){
 const y=base-PM*h;
 return fade(g,arrow(L.ax,base,L.ax,y,{color:HC,w:5,head:16})+label(text,L.ax+12,(base+y)/2+8,{size:26,color:HC,weight:700}));
}
// U の棒：ベランダ（vb）と地面（gb）。基準 base から測る
function uBars(L,{base=DESK,ver=0,gnd=0,vLab=1,gLab=1,hiG=0,hiV=0}={}){
 let s='';const w=36;
 const bar=(x,y0,y1,o,hi)=>{const top=Math.min(y0,y1),h=Math.abs(y1-y0);return fade(o,rect(x-w/2,top,w,h,{fill:UC,fo:.55,stroke:UC,sw:2,rx:3})+(hi?fade(hi,rect(x-w/2-6,top-6,w+12,h+12,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:6})):''));};
 const val=y=>Math.round((base-y)/PM*20);
 if(ver){const y=base+(VER-base)*ver;s+=bar(L.vb,base,y,1,hiV);if(vLab)s+=fade(seg(ver,.9,1),label(`${val(VER)} J`,L.vb,VER-14,{size:24,color:UC,anchor:'middle',weight:700}));}
 if(gnd){const y=base+(GY-base)*gnd;if(Math.abs(GY-base)>1)s+=bar(L.gb,base,y,1,hiG);if(gLab){const v=val(GY);s+=fade(seg(gnd,.9,1),label(v===0?'0 J':`−${-v} J`,L.gb,Math.abs(GY-base)>1?GY+32:base-14,{size:24,color:UC,anchor:'middle',weight:700}));}}
 return s;
}
const gCard=(x=1010,y=92,g=1)=>card(x,y,170,50,label('g＝10 m/s²',x+85,y+34,{size:24,color:C.ink,anchor:'middle',weight:700}),g);
// ---- ばね ----------------------------------------------------------------------------------------
// o：wx＝壁、nat＝自然の長さの端、px＝1 m あたりの長さ、ext＝伸び（0〜1 で 0〜0.30 m）
function spr({wx=60,nat=300,px=667,y=320,ext=0,F=0,g=1,kLab=1,ruler=1,hand=1,Fhi=0}={}){
 const e=nat+.30*px*ext;
 let s=wall(wx,y-70,y+60);
 s+=spring(wx,e,y,{coils:12,amp:16,color:C.dim,w:3});
 s+=rect(e-6,y-14,14,28,{fill:'#c9d3e4',fo:.9,stroke:'none',rx:4});
 if(hand)s+=rect(e+8,y-20,46,40,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:14})+rect(e+44,y-12,40,24,{fill:'#e9c7a6',fo:.85,stroke:'none',rx:8});
 if(kLab)s+=label('200 N/m',(wx+nat)/2,y-40,{size:24,color:C.ink,anchor:'middle',weight:700});
 if(ruler){
  s+=line(nat,y-60,nat,y+80,{color:C.faint,w:2,dash:'6 6'})+label('自然の 長さ',nat,y-74,{size:22,color:C.dim,anchor:'middle'});
  s+=fade(ruler,line(nat,y+70,nat+.30*px,y+70,{color:HC,w:3})+line(nat,y+58,nat,y+82,{color:HC,w:3})+line(nat+.30*px,y+58,nat+.30*px,y+82,{color:HC,w:3})
   +label('0',nat,y+110,{size:22,color:HC,anchor:'middle',weight:700})+label('0.30 m',nat+.30*px,y+110,{size:22,color:HC,anchor:'middle',weight:700}));
 }
 if(F>0&&ext>.02){const L=130*ext,x0=e+90;s+=fade(F,FA(x0,y,x0+L,y,{w:8,head:20})+label(`${Math.round(60*ext)} N`,x0+L+10,y+9,{size:26,color:C.F,weight:700}));
  if(Fhi)s+=fade(Fhi,rect(x0+L+2,y-22,80,44,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8}));}
 return fade(g,s);
}
// F-x グラフ（右）
const GA={x:760,y:440,w:380,h:290,xmax:.36,ymax:72};
function fxG({g=1,line1=1,tri=0,val=0,rect18=0,hi60=0}={}){
 const A=axes({...GA,xlabel:'x [m]',ylabel:'F [N]',xticks:[],yticks:[],grid:false,g,xcolor:HC,ycolor:C.F});
 let s=A.svg;
 s+=fade(g,line(A.X(.3),A.Y(0)-6,A.X(.3),A.Y(0)+6,{color:C.dim})+label('0.30',A.X(.3),A.Y(0)+34,{size:22,color:HC,anchor:'middle',weight:700})
  +line(A.X(0)-6,A.Y(60),A.X(0)+6,A.Y(60),{color:C.dim})+label('60',A.X(0)-12,A.Y(60)+8,{size:22,color:C.F,anchor:'end',weight:700}));
 if(rect18)s+=fade(rect18,rect(A.X(0),A.Y(60),A.X(.3)-A.X(0),A.Y(0)-A.Y(60),{fill:'none',fo:0,stroke:C.ink,sw:2.5,rx:0}).replace('/>',' stroke-dasharray="8 6"/>'));
 if(tri)s+=fade(tri,poly([[A.X(0),A.Y(0)],[A.X(.3),A.Y(60)],[A.X(.3),A.Y(0)]],{fill:UC,fo:.5,stroke:UC,sw:2}));
 if(line1>0)s+=fade(g,line(A.X(0),A.Y(0),A.X(.3*line1),A.Y(60*line1),{color:C.F,w:5}))+fade(g*seg(line1,.97,1),line(A.X(.3),A.Y(60),A.X(.3),A.Y(0),{color:C.dim,w:2,dash:'6 6'})+line(A.X(0),A.Y(60),A.X(.3),A.Y(60),{color:C.dim,w:2,dash:'6 6'}));
 if(val)s+=fade(val,label('9.0 J',A.X(.2),A.Y(16)+10,{size:34,color:C.ink,anchor:'middle',weight:700}));
 if(hi60)s+=fade(hi60,rect(A.X(0)-52,A.Y(60)-22,48,40,{fill:C.hi,fo:.15,stroke:C.hi,sw:3,rx:8}));
 return s;
}
// 右の式のカード
const eqCard=(inner,g=1,col=UC,y=96,h=96)=>card(710,y,480,h,inner,g,col);
const EX=950;

export const qxHsMEnergy2Diagrams={
 // ================= 問題アニメ：出題中（7 秒＋静止）=================
 // 0〜3 s 左の枠（高さの目盛り・ベランダのボール 2.0 kg・机・基準 0 の黄の線を左から右へ・g＝10）。3〜7 s 右の枠（ばね 200 N/m、手が 0.30 m ゆっくり引いて止まる）。
 [K+'q0']:(p,ctx)=>{
  const t=7*p;
  let s=card(10,82,600,428,'',seg(t,0,.3))+fade(seg(t,.1,.6),yard(Q,{baseG:lin(t,1.5,2.7)}));
  s+=gCard(420,92,seg(t,2.2,2.7));
  s+=card(622,82,568,428,'',seg(t,3,3.3))+fade(seg(t,3.1,3.5),spr({wx:660,nat:860,px:500,y:290,ext:seg(t,3.8,6.4),ruler:seg(t,6.2,6.6)}));
  return s;
 },
 // ================= S1 小問1 =================
 // 1. 左の枠を大きく。基準 0 の黄の線を光らせる。ばねの枠は小さく右下
 [K+'setup']:(p)=>{
  const hi=seg(p,.55,.7)*(1-seg(p,.9,1)*.0);
  let s=yard(FULL,{baseG:lin(p,.3,.55),hiBase:hi})+gCard(1010,92);
  s+=miniSpring(seg(p,.1,.25));
  return s;
 },
 // 2. 求めるもの。地面にボールを点線で
 [K+'goal1']:(p)=>yard(FULL,{ghost:seg(p,.4,.55)})+gCard(1010,92)+miniSpring(1-seg(p,.85,1))+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. U＝mgh（h を水色）。2文目で基準から地面へ下向きの矢印 −1.0 m
 [K+'h1']:(p,ctx)=>{
  const b=wAt(ctx,'じめんは',.45);
  let s=yard(FULL,{ghost:1});
  s+=eqCard(T(`${Ut}=mg${Ht}`,EX,148,44),seg(p,.03,.12));
  s+=fade(seg(p,.2,.3),label('h ＝ 基準から 測った 高さ',EX,232,{size:26,color:HC,anchor:'middle',weight:700}));
  s+=hArrow(FULL,-1,'−1.0 m',{g:seg(p,b+.1,b+.2)});
  s+=fade(seg(p,b+.3,b+.4),T(`${Ht}=-1.0\\ \\mathrm{m}`,EX,300,40));
  return s+goalTag(G1);
 },
 // 4. U＝2.0×10×(−1.0)＝−20 J。地面の横に下向きの棒 −20 J。答え B。2文目「−＝基準より下」
 [K+'ans1']:(p,ctx)=>{
  const a=wAt(ctx,'しょうもん',.35),b=wAt(ctx,'ふの',.5);
  let s=yard(FULL,{ghost:1})+hArrow(FULL,-1,'−1.0 m');
  s+=eqCard(T(`${Ut}=2.0\\times 10\\times(-1.0)`,EX,148,38),1);
  s+=fade(seg(p,.15,.22),T(`=-20\\ \\mathrm{J}`,EX,232,42));
  s+=uBars(FULL,{gnd:seg(p,.2,.3)});
  s+=card(760,300,380,64,label('− ＝ 基準より 下',950,342,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,b,b+.06),C.hi);
  return s+goalTag(G1)+A1(seg(p,a,a+.05));
 },
 // 5. 誤答 A・C（1枚ずつ）
 [K+'wrongAC']:(p,ctx)=>{
  let s=yard(FULL,{ghost:1})+hArrow(FULL,-1,'−1.0 m')+uBars(FULL,{gnd:1});
  s+=wrongSeq(p,ctx,[['A','＋20 J','h の 符号を 落とした'],['C','0 J','基準は 机。地面 ではない']],{opts:{x:710,w:480,y:130}});
  return s+goalTag(G1)+A1(1);
 },
 // 6. 誤答 D（地面基準のベランダの値）
 [K+'wrongD']:(p)=>{
  let s=yard(FULL,{ghost:1})+hArrow(FULL,-1,'−1.0 m')+uBars(FULL,{gnd:1});
  s+=wrongCard('D','80 J','地面基準の ベランダの 値',{x:710,w:480,y:130,mid:`2.0\\times 10\\times 4.0`,g:seg(p,.03,.1)});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2 =================
 // 7. 求めるもの：落ちる間に減る U。ベランダから地面へ落ちる点線
 [K+'goal2']:(p)=>yard(FULL,{fall:seg(p,.3,.5),ghost:seg(p,.45,.6)})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 8. 基準からベランダまで ＋3.0 m、ベランダの棒 60 J
 [K+'u60']:(p)=>{
  let s=yard(FULL,{fall:1,ghost:1})+hArrow(FULL,3,'＋3.0 m',{g:seg(p,.1,.25)});
  s+=eqCard(T(`${Ut}=2.0\\times 10\\times 3.0=60\\ \\mathrm{J}`,EX,148,34),seg(p,.4,.5));
  s+=uBars(FULL,{ver:seg(p,.5,.7)});
  return s+goalTag(G2);
 },
 // 9. 60−(−20)：「−(−」を黄で囲み ＋20 に。上向き 60 と下向き 20 を一本の物差しで 80。答え D
 [K+'ans2']:(p,ctx)=>{
  const a=wAt(ctx,'しょうもん',.6),f=seg(p,.3,.4),r=seg(p,.4,.55);
  let s=yard(FULL,{fall:1,ghost:1})+uBars(FULL,{ver:1,gnd:1});
  const tw=texWidth(`60-(-20)`,44),bx1=EX-tw/2+texWidth(`60`,44),bx2=EX-tw/2+texWidth(`60-(-`,44);
  let e=fade(1-f,T(`60-(-20)`,EX,148,44))+fade(seg(p,.15,.25)*(1-f),rect(bx1+2,118,bx2-bx1-6,60,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8}));
  e+=fade(f,T(`60+20=80\\ \\mathrm{J}`,EX,148,44));
  s+=eqCard(e,1,C.hi);
  s+=fade(seg(p,.03,.12),label('はじめ − あと',EX,232,{size:26,color:C.dim,anchor:'middle',weight:700}));
  const x=FULL.vb-44;
  s+=fade(r,line(x,VER,x,GY,{color:C.hi,w:4})+line(x-10,VER,x+10,VER,{color:C.hi,w:4})+line(x-10,GY,x+10,GY,{color:C.hi,w:4})+label('80 J',x-10,(VER+GY)/2-30,{size:28,color:C.hi,anchor:'end',weight:700}));
  return s+goalTag(G2)+A2(seg(p,a,a+.05));
 },
 // 10. 誤答 A・B（1枚ずつ）
 [K+'wrongAB']:(p,ctx)=>{
  let s=yard(FULL,{fall:1,ghost:1})+uBars(FULL,{ver:1,gnd:1});
  s+=wrongSeq(p,ctx,[['A','60 J','地面の U を 引いていない'],['B','40 J','60−20（符号を 落とした）']],{opts:{x:710,w:480,y:130}});
  return s+goalTag(G2)+A2(1);
 },
 // 11. 誤答 C。基準の線が地面へ下がり、棒が 80 J と 0 J に。物差しは 80 のまま
 [K+'wrongC']:(p,ctx)=>{
  const b=wAt(ctx,'じめんを',.35),u=seg(p,b,b+.25),base=DESK+(GY-DESK)*u;
  let s=yard(FULL,{fall:1,ghost:1,base});
  s+=uBars(FULL,{base,ver:1,gnd:1});
  const x=FULL.vb-44;
  s+=line(x,VER,x,GY,{color:C.hi,w:4})+line(x-10,VER,x+10,VER,{color:C.hi,w:4})+line(x-10,GY,x+10,GY,{color:C.hi,w:4})+label('80 J',x-10,(VER+GY)/2-30,{size:28,color:C.hi,anchor:'end',weight:700});
  s+=wrongCard('C','決まらない','差は 基準に よらない',{x:710,w:480,y:130,g:seg(p,.03,.1)});
  s+=card(760,290,380,70,T(`80-0=80\\ \\mathrm{J}`,950,326,38),seg(p,b+.25,b+.32),C.hi);
  return s+goalTag(G2)+A2(1);
 },
 // 12. 基準の線を机へ戻す。「ΔU は基準によらない」
 [K+'diff']:(p)=>{
  const u=1-seg(p,.05,.3),base=DESK+(GY-DESK)*u;
  let s=yard(FULL,{fall:1,ghost:1,base});
  s+=uBars(FULL,{base,ver:1,gnd:1});
  const x=FULL.vb-44;
  s+=line(x,VER,x,GY,{color:C.hi,w:4})+line(x-10,VER,x+10,VER,{color:C.hi,w:4})+line(x-10,GY,x+10,GY,{color:C.hi,w:4})+label('80 J',x-10,(VER+GY)/2-30,{size:28,color:C.hi,anchor:'end',weight:700});
  s+=eqCard(label('U の 値 は 基準で 変わる',EX,150,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.2),UC);
  s+=card(710,230,480,90,T(`\\Delta ${Ut}\\ \\text{は基準によらない}`,EX,276,36,{auto:false}),seg(p,.45,.55),C.hi);
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3 =================
 // 13. 左の枠を消し、ばねの枠を大きく
 [K+'goal3']:(p)=>spr({ext:0,ruler:0})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 14. ばねが伸びるにつれ、力の矢印が 0 → 60 N。右に F-x グラフ、原点から (0.30, 60) へ
 [K+'fx']:(p)=>{
  const e=seg(p,.12,.6);
  let s=spr({ext:e,F:1,ruler:seg(p,.55,.65)});
  s+=fxG({g:seg(p,.03,.12),line1:e});
  s+=fade(seg(p,.7,.8),label('三角形の 面積 ＝ 仕事',950,120,{size:26,color:UC,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 15a. 三角形を塗って 9.0 J。答え A
 [K+'ans3']:(p,ctx)=>{
  const a=wAt(ctx,'しょうもん',.55);
  let s=spr({ext:1,F:1,g:.5});
  s+=fxG({tri:seg(p,.05,.2),val:seg(p,.3,.38)});
  s+=card(60,96,560,90,T(`\\tfrac12\\times 0.30\\times 60=9.0\\ \\mathrm{J}`,340,146,38),seg(p,.1,.2),UC);
  return s+goalTag(G3)+A3(seg(p,a,a+.06));
 },
 // 15b. 式 U＝½kx² でも 9.0
 [K+'ans3b']:(p)=>{
  let s=spr({ext:1,F:1,g:.5*(1-seg(p,0,.1))});
  s+=fxG({tri:1,val:1});
  s+=card(60,96,560,90,T(`\\tfrac12\\times 0.30\\times 60=9.0\\ \\mathrm{J}`,340,146,38),1,UC);
  s+=card(20,200,640,110,T(`${Ut}=\\tfrac12 k{\\color{${HC}}x}^2=\\tfrac12\\times 200\\times 0.30^2=9.0`,340,256,34,{auto:false}),seg(p,.05,.15),C.hi);
  return s+goalTag(G3)+A3(1);
 },
 // 16. 誤答 B・C。点線の長方形 18 を描き、その半分が三角形
 [K+'wrongBC']:(p,ctx)=>{
  const c=wAt(ctx,'スィーの',.5),inB=1-seg(p,c,c+.04);
  let s=fxG({tri:1,val:1,rect18:seg(p,.05,.15)*inB});
  s+=fade(seg(p,.1,.18)*inB,label('長方形 18 J の 半分',950,120,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['B','18 J','½ を 落とした',{mid:`60\\times 0.30`}],['C','30 J','x を 2乗して いない（単位は N）',{mid:`\\tfrac12\\times 200\\times 0.30`}]],{win:[[0,c],[c,1]],opts:{x:30,w:640,y:130}});
  return s+goalTag(G3)+A3(1);
 },
 // 17. 誤答 D。縦軸の 60 を黄で
 [K+'wrongD3']:(p)=>{
  let s=fxG({tri:1,val:1,hi60:seg(p,.3,.45)});
  s+=wrongCard('D','60 J','力 kx＝60 N を 答えた',{x:30,w:640,y:130,g:seg(p,.03,.1)});
  return s+goalTag(G3)+A3(1);
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p)=>{
  let s=fade(seg(p,.03,.15),yard(Q,{fall:1,ghost:0,baseLab:0})+uBars(Q,{ver:1,gnd:1,vLab:0,gLab:0}));
  s+=fade(seg(p,.1,.2),label('60 J',Q.vb+26,VER+20,{size:24,color:UC,weight:700})+label('−20 J',Q.gb+24,GY-10,{size:24,color:UC,weight:700}));
  const x=Q.vb-36;
  s+=fade(seg(p,.15,.25),line(x,VER,x,GY,{color:C.hi,w:4})+line(x-10,VER,x+10,VER,{color:C.hi,w:4})+line(x-10,GY,x+10,GY,{color:C.hi,w:4})+label('差 80 J',x-10,250,{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.2,.3),T(`${Ut}=mg${Ht}`,450,110,34));
  const A=axes({x:740,y:390,w:360,h:230,xmax:.36,ymax:72,xlabel:'x',ylabel:'F',xticks:[],yticks:[],g:seg(p,.3,.4),xcolor:HC,ycolor:C.F});
  s+=A.svg+fade(seg(p,.35,.45),poly([[A.X(0),A.Y(0)],[A.X(.3),A.Y(60)],[A.X(.3),A.Y(0)]],{fill:UC,fo:.5,stroke:UC,sw:2})+line(A.X(0),A.Y(0),A.X(.3),A.Y(60),{color:C.F,w:4})+label('9.0 J',A.X(.2),A.Y(16)+10,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.5),T(`${Ut}=\\tfrac12 kx^2`,1020,110,34));
  s+=card(700,420,480,72,label('意味が あるのは ΔU（差）',940,466,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.65),C.hi);
  s+=answerRow([[1,'B','−20 J'],[2,'D','80 J'],[3,'A','9.0 J']],{g:seg(p,.7,.8)});
  return s;
 },
};
// 右下の小さなばねの枠（設定の確認用）
function miniSpring(g=1){
 if(g<=0)return '';
 let s=card(900,380,280,120,'',g);
 s+=fade(g,wall(925,410,470)+spring(925,1080,440,{coils:8,amp:10,color:C.dim,w:2.5})+rect(1078,430,10,20,{fill:'#c9d3e4',fo:.9,stroke:'none',rx:3})+label('ばね 200 N/m',1040,410,{size:22,color:C.ink,anchor:'middle',weight:700}));
 return s;
}
