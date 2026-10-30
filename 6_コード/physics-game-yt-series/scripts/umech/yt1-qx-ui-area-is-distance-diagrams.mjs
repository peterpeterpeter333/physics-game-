// 問題編 解説「行って少し戻るロボット」（q-ui-area-is-distance、大学編 02 積分・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/02_積分.md の q-ui-area-is-distance（解説 18 行）。
// 配置：上に廊下とロボット（y≈84〜182）、下に v–t グラフ（左 x≈70〜600）、右に式と札の枠（x 670〜1190）。札の帯（y＜78）には図を描かない。
// 色：位置・変位 x 水色、速度 v 紫、時刻 t 金、面積（長方形）紫の薄い塗り、負の長方形は薄い赤、強調 黄、誤り 赤、✓ 緑。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,cueT,tAt,sentWin,isProblem} from './yt1-qx-common.mjs';

const K='qx-ui-area-is-distance:';
const RED='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cV=s=>`{\\color{${C.v}}${s}}`,cT=s=>`{\\color{${C.t}}${s}}`,cX=s=>`{\\color{${C.x}}${s}}`,cR=s=>`{\\color{${RED}}${s}}`;
// ---- 配置 ----
const PX=670,PW=520,PC=PX+PW/2;
const WOPT={x:PX,w:PW,size:26,whySize:22};
// v–t グラフ：t 0〜5（金）、v −2〜4（紫）
const GX=80,SX=94.5,GB=470,GH=250,VMIN=-2,VMAX=4.5;
const X=t=>GX+SX*t,Y=v=>GB-GH*(v-VMIN)/(VMAX-VMIN);
const PIECES=[[0,2,4],[2,3,1],[3,5,-1.5]];
// 廊下：1 m ＝ 52 px、出発点 x＝110
const CY=140,CX0=110,MS=52,M=m=>CX0+MS*m;
const L1=[CY+6,24],L2=[CY+34,24];   // 棒を並べる2本の帯（上：右へ、下：左へ）
const G1='0〜3 s に進んだ距離',G2='0〜5 s の変位',G3='0〜5 s の道のり';
const ANS1=g=>answerTag(1,'B','9 m',{g}),ANS2=g=>answerTag(2,'A','＋6 m',{g}),ANS3=g=>answerTag(3,'C','12 m',{g});

// ---- 部品 ----
function axesVT({g=1,ticks=1}={}){
 let s='';
 for(const v of [-2,-1,1,2,3,4])s+=line(X(0),Y(v),X(5.2),Y(v),{color:C.grid,w:1.5});
 for(const t of [1,2,3,4,5])s+=line(X(t),Y(-2),X(t),Y(4.3),{color:C.grid,w:1.5});
 s+=arrow(X(0)-10,Y(0),X(5.5),Y(0),{color:C.dim,w:2.5,head:14})+arrow(X(0),Y(-2)+10,X(0),Y(4.5)-18,{color:C.dim,w:2.5,head:14});
 if(ticks){
  for(const t of [1,2,3,4,5])s+=line(X(t),Y(0)-6,X(t),Y(0)+6,{color:C.t,w:2})+label(String(t),X(t),GB+28,{size:22,color:C.t,anchor:'middle'});
  for(const v of [-2,-1,1,2,3,4])s+=line(X(0)-6,Y(v),X(0)+6,Y(v),{color:C.v,w:2})+label(v<0?'−'+(-v):String(v),X(0)-12,Y(v)+8,{size:22,color:C.v,anchor:'end'});
  s+=label('0',X(0)-12,Y(0)+8,{size:22,color:C.dim,anchor:'end'});
  s+=label('t [s]',X(5.5)+6,Y(0)+30,{size:24,color:C.t,weight:700})+label('v [m/s]',X(0)+16,Y(4.5)-2,{size:22,color:C.v,weight:700});
 }
 return fade(g,s);
}
// 速度の階段（紫の線）。p で左から描く。hi＝区間ごとの光らせ方 [a,b,c]
function stepLine(p=1,{hi=[0,0,0],w=5}={}){
 const segs=[];
 PIECES.forEach(([a,b,v],i)=>{if(i>0)segs.push([[X(a),Y(PIECES[i-1][2])],[X(a),Y(v)],-1]);segs.push([[X(a),Y(v)],[X(b),Y(v)],i]);});
 const n=segs.length,shown=clamp(p)*n;let s='';
 segs.forEach(([A,B,i],k)=>{const u=clamp(shown-k);if(u<=0)return;const xe=mix(A[0],B[0],u),ye=mix(A[1],B[1],u);
  if(i>=0&&hi[i]>0)s+=line(A[0],A[1],xe,ye,{color:C.hi,w:14,opacity:.35*hi[i]});
  s+=line(A[0],A[1],xe,ye,{color:i<0?C.v:C.v,w:i<0?3:w,dash:i<0?'6 6':''});});
 return s;
}
// 長方形（区間 i）。g で塗り、neg なら薄い赤
function bar(i,{g=1,color,fo=.28,sw=2,dash=''}={}){
 if(g<=.001)return '';
 const [a,b,v]=PIECES[i],col=color??(v<0?RED:C.v);
 return fade(g,rect(X(a),Math.min(Y(0),Y(v)),X(b)-X(a),Math.abs(Y(v)-Y(0)),{fill:col,fo,stroke:col,sw,rx:2}));
}
const barC=i=>{const [a,b,v]=PIECES[i];return [(X(a)+X(b))/2,(Y(0)+Y(v))/2];};
// 区切りの点線（金）
const divLines=(g=1)=>fade(g,line(X(2),Y(-2),X(2),Y(4.4),{color:C.t,w:2.5,dash:'7 7'})+line(X(3),Y(-2),X(3),Y(4.4),{color:C.t,w:2.5,dash:'7 7'}));
// 廊下
function corridor({g=1,start=0,plus=1}={}){
 let s=rect(CX0-30,CY-2,M(10.4)-CX0+30,4,{fill:C.dim,fo:.9,stroke:'none',rx:2});
 for(let m=0;m<=10;m++)s+=line(M(m),CY-5,M(m),CY+2,{color:C.faint,w:2});
 if(plus)s+=arrow(M(9.7),CY-20,M(10.6),CY-20,{color:C.hi,w:3,head:12})+label('＋',M(10.6)-2,CY-30,{size:24,color:C.hi,anchor:'middle',weight:700});
 if(start)s+=fade(start,line(M(0),CY-46,M(0),CY+56,{color:C.hi,w:3})+label('出発点',M(0)-10,CY-22,{size:22,color:C.hi,anchor:'end',weight:700}));
 return fade(g,s);
}
// 掃除ロボット（位置 m［m］、向き dir）
function robot(m,{dir=1,g=1}={}){
 const x=M(m);
 let s=rect(x-24,CY-38,48,28,{fill:'#2a3346',fo:1,stroke:C.ink,sw:2.5,rx:10});
 s+=ring(x-13,CY-7,6,{color:C.dim,w:2.5,fill:C.bg})+ring(x+13,CY-7,6,{color:C.dim,w:2.5,fill:C.bg});
 s+=dot(x+dir*11,CY-26,4,C.hi);
 return fade(g,s);
}
// 廊下の棒：帯 lane の [m0,m1]
function laneBar(lane,m0,m1,{g=1,color=C.x,text='',fo=.35}={}){
 if(g<=.001)return '';
 const [y,h]=lane,x0=M(Math.min(m0,m1)),w=Math.abs(M(m1)-M(m0));
 return fade(g,rect(x0,y,w,h,{fill:color,fo,stroke:color,sw:2,rx:3})+(text?label(text,x0+w/2,y+h-4,{size:20,color:C.ink,anchor:'middle',weight:700}):''));
}
// グラフの長方形が廊下の棒へ移る（u：0→1）
function morph(i,lane,m0,m1,u,{text=''}={}){
 if(u<=.001||u>=.999)return '';
 const [a,b,v]=PIECES[i],r0=[X(a),Math.min(Y(0),Y(v)),X(b)-X(a),Math.abs(Y(v)-Y(0))],r1=[M(Math.min(m0,m1)),lane[0],Math.abs(M(m1)-M(m0)),lane[1]];
 const r=r0.map((q,k)=>mix(q,r1[k],u)),col=v<0?RED:(u<.5?C.v:C.x);
 return rect(r[0],r[1],r[2],r[3],{fill:col,fo:.3,stroke:col,sw:2,rx:3})+(text?label(text,r[0]+r[2]/2,r[1]+r[3]/2+8,{size:24,color:C.ink,anchor:'middle',weight:700}):'');
}
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
// 3つの長方形の中の数（8・1・−3）
function areaNums(g=[1,1,1],{third='−3'}={}){
 let s='';const tx=['8','1',third];
 [0,1,2].forEach(i=>{if(g[i]>0){const [cx,cy]=barC(i);s+=fade(g[i],label(tx[i],cx,cy+12,{size:i===1?28:36,color:C.ink,anchor:'middle',weight:700}));}});
 return s;
}
// 基本の画面（廊下＋グラフ）
function base({robotM=0,dir=1,start=0,bars=[0,0,0],nums=[0,0,0],third='−3',lanes={},hi=[0,0,0],div=1}={}){
 let s=corridor({start});
 if(lanes.a)s+=laneBar(L1,0,8,{g:lanes.a,text:'8'});
 if(lanes.b)s+=laneBar(L1,8,9,{g:lanes.b,text:'1'});
 if(lanes.c)s+=laneBar(L2,9,6,{g:lanes.c,color:RED,text:'−3'});
 s+=robot(robotM,{dir});
 s+=axesVT()+divLines(div);
 bars.forEach((g,i)=>{s+=bar(i,{g});});
 s+=stepLine(1,{hi});
 s+=areaNums(nums,{third});
 return s;
}

export const ytQxUiAreaIsDistanceDiagrams={
 // ===================== 問題アニメ（出題中の図、約4秒）=====================
 // 廊下と出発点に止まったロボット、右向きの「＋」。v–t グラフの軸（t 0〜5 金、v −2〜4 紫）と、速度の階段を左から描く。
 // 長方形の塗り・面積や距離の数・ロボットの移動は描かない。
 [K+'q0']:(p)=>{
  let s=fade(seg(p,0,.2),corridor()+robot(0));
  s+=axesVT({g:seg(p,.1,.32)});
  s+=stepLine(seg(p,.35,.95));
  return s;
 },

 // ===================== 問題の設定 =====================
 // 1. 出題中の図。「2回変わります」で t＝2、3 に金の点線。右に与えた速度の表。
 [K+'setup']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=corridor()+robot(0)+axesVT()+stepLine(1);
  s+=divLines(seg(p,b*.45,b*.75));
  s+=fade(seg(p,b*.6,b*.85),[0,1,2].map(i=>{const [a,c]=PIECES[i];return label(`区間${i+1}`,i===0?X(1.45):(X(a)+X(c))/2,Y(4.5)+4,{size:22,color:C.t,anchor:'middle',weight:700});}).join(''));
  s+=panel(86,300,label('与えられた 速度（右向きが ＋）',PC,130,{size:24,color:C.dim,anchor:'middle'})
   +label('0〜2 s：＋4 m/s',PC,190,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('2〜3 s：＋1 m/s',PC,245,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('3〜5 s：−1.5 m/s',PC,300,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),label('区間の 中では 一定',PC,355,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.1));
  s+=fade(seg(p,b+.05,b+.2),label('区間に 分けて 長方形を 作る',PC,440,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===================== 小問1 =====================
 // 2. 求めるもの。右に Δx＝vΔt と単位 (m/s)×s＝m
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=base({});
  s+=fade(seg(p,.03,.12),highlight(X(0)-6,Y(4.4),X(3)-X(0)+12,Y(-2)-Y(4.4)+4,1,C.hi));
  s+=panel(86,330,label('区間の 中で 速度が 一定',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,b+.05,b+.18),T(`${cX('\\Delta x')}=${cV('v')}\\,${cT('\\Delta t')}`,PC,215,52))
   +fade(seg(p,b+.15,b+.25),label('進んだ距離 ＝ 速度 × 時間',PC,280,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,b+.3,b+.42),T(`(${cV('\\mathrm{m/s}')})\\times${cT('\\mathrm{s}')}=${cX('\\mathrm{m}')}`,PC,360,38)),seg(p,b,b+.08));
  s+=goalTag(G1,{g:seg(p,.02,.1)});
  return s;
 },
 // 3. 0〜2 s の長方形：縦 4、横 2、中に 8。長方形が廊下の帯へ移り、長さ 8 の棒。ロボットが 8 m へ。
 [K+'r1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,u=seg(p,b+.12,b+.42);
  let s=corridor()+laneBar(L1,0,8,{g:u>=.999?1:0,text:'8'})+robot(8*seg(p,b+.3,b+.5));
  s+=axesVT()+divLines()+bar(0,{g:seg(p,.05,.18)})+stepLine(1,{hi:[seg(p,.05,.15)*(1-seg(p,b,b+.1)),0,0]});
  s+=fade(seg(p,.12,.25),label('4',X(0)+16,Y(4)+30,{size:28,color:C.v,weight:700}));
  s+=fade(seg(p,.2,.32),line(X(0),Y(0)+16,X(2),Y(0)+16,{color:C.t,w:3})+label('2',X(1),Y(0)+44,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.1),areaNums([1,0,0]));
  s+=morph(0,L1,0,8,u,{text:'8'});
  s+=panel(86,300,label('区間ごとに 速度 × 時間',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,b,b+.12),T(`${cV('4')}\\times${cT('2')}=${cX('8\\ \\mathrm{m}')}`,PC,210,46)),seg(p,0,.08));
  s+=goalTag(G1);
  return s;
 },
 // 4. 2〜3 s の長方形に 1。廊下で 8 の棒の先に 1 の棒。ロボットが 9 m へ。
 [K+'r2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,u=seg(p,b+.12,b+.42);
  let s=corridor()+laneBar(L1,0,8,{text:'8'})+laneBar(L1,8,9,{g:u>=.999?1:0,text:'1'})+robot(8+seg(p,b+.3,b+.5));
  s+=axesVT()+divLines()+bar(0)+bar(1,{g:seg(p,.05,.18)})+stepLine(1,{hi:[0,seg(p,.05,.15)*(1-seg(p,b,b+.1)),0]});
  s+=areaNums([1,seg(p,b,b+.1),0]);
  s+=morph(1,L1,8,9,u,{text:'1'});
  s+=panel(86,300,label('区間ごとに 速度 × 時間',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cV('4')}\\times${cT('2')}=${cX('8\\ \\mathrm{m}')}`,PC,210,46)
   +fade(seg(p,b,b+.12),T(`${cV('1')}\\times${cT('1')}=${cX('1\\ \\mathrm{m}')}`,PC,290,46)),1);
  s+=goalTag(G1);
  return s;
 },
 // 5. 8＋1＝9 m。答えの札 B（9 m）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=base({robotM:9,bars:[1,1,0],nums:[1,1,0],lanes:{a:1,b:1}});
  s+=fade(seg(p,.03,.15),line(M(0),CY+44,M(9),CY+44,{color:C.x,w:3})+label('9 m',M(4.5),CY+70,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=panel(86,300,label('区間ごとに 速度 × 時間',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cV('4')}\\times${cT('2')}=${cX('8\\ \\mathrm{m}')}`,PC,200,40)
   +T(`${cV('1')}\\times${cT('1')}=${cX('1\\ \\mathrm{m}')}`,PC,260,40)
   +fade(seg(p,.03,.15),line(PX+40,295,PX+PW-40,295,{color:C.faint,w:2})+T(`8+1=${cX('9\\ \\mathrm{m}')}`,PC,350,46)),1);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.08));
  return s;
 },
 // 6. 誤答 A：高さ 4・横 3 の長方形を赤の輪郭で重ね、2〜3 s ではみ出す部分を赤の斜線
 [K+'wrongA']:(p)=>{
  const g=seg(p,.05,.2);
  let s=base({robotM:9,bars:[1,1,0],nums:[1,1,0],lanes:{a:1,b:1}});
  s+=fade(g,`<svg x="${X(2)}" y="${Y(4)}" width="${X(3)-X(2)}" height="${Y(1)-Y(4)}" viewBox="${X(2)} ${Y(4)} ${X(3)-X(2)} ${Y(1)-Y(4)}" overflow="hidden">${hatch(X(2),Y(4),X(3)-X(2),Y(1)-Y(4))}</svg>`
   +rect(X(0),Y(4),X(3)-X(0),Y(0)-Y(4),{fill:'none',fo:0,stroke:RED,sw:4,rx:2}));
  s+=fade(g,label('はみ出し',(X(2)+X(3))/2,Y(4)-12,{size:22,color:RED,anchor:'middle',weight:700}));
  s+=wrongCard('A','12 m',['一番速い 4 m/s を 3 s 全体に 掛けた'],{...WOPT,y:300,mid:'4\\times3=12',g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 7. 誤答 C → D を1枚ずつ。C の間は高さ 2.5 の長方形（赤の点線）、D の間は速さ 4 と 1 を光らせる
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),wC=[0,W[0][1]],wD=[W[1]?W[1][0]:.55,1];
  const inC=seg(p,wC[0]+.01,wC[0]+.05)*(1-seg(p,wC[1]-.04,wC[1])),inD=seg(p,wD[0]+.01,wD[0]+.05);
  let s=base({robotM:9,bars:[1,1,0],nums:[1,1,0],lanes:{a:1,b:1}});
  s+=fade(inC,rect(X(0),Y(2.5),X(3)-X(0),Y(0)-Y(2.5),{fill:'none',fo:0,stroke:RED,sw:3.5,rx:2})+line(X(0),Y(2.5),X(3),Y(2.5),{color:RED,w:3.5,dash:'9 7'})
   +label('2.5',X(3)+10,Y(2.5)+8,{size:24,color:RED,weight:700}));
  s+=fade(inD,ring(X(1),Y(4),22,{color:C.hi,w:3})+ring(X(2.5),Y(1),22,{color:C.hi,w:3})+label('4',X(1),Y(4)-28,{size:26,color:C.hi,anchor:'middle',weight:700})+label('1',X(2.5),Y(1)-28,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['C','7.5 m',['区間の 長さが 違う ことを 無視した'],{mid:'(4+1)\\div2\\times3=7.5'}],['D','5 m',['時間を 掛けていない（単位は m/s のまま）'],{mid:'4+1=5'}]],{win:[wC,wD],opts:{...WOPT,y:300}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 8. 求めるもの：0〜5 s の変位。出発点に黄色の印
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=base({robotM:9,bars:[1,1,0],nums:[1,1,0],lanes:{a:1,b:1},start:seg(p,b,b+.1)});
  s+=fade(seg(p,b+.15,b+.3),arrow(M(0),CY-48,M(4),CY-48,{color:C.x,w:4,head:14})+label('向きの ついた 移動',M(4)+12,CY-40,{size:22,color:C.x,weight:700}));
  s+=panel(86,250,label('変位',PC,145,{size:32,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.12),label('出発点 → 今いる 所',PC,210,{size:28,color:C.ink,anchor:'middle'})+label('向きの ついた 移動（右が ＋）',PC,260,{size:26,color:C.dim,anchor:'middle'})),seg(p,.05,.15),C.x);
  s+=goalTag(G2,{g:seg(p,.02,.1)});
  return s;
 },
 // 9. 3〜5 s の速度の線を光らせる。ロボットが左を向き、左向きの矢印（紫）
 [K+'back']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,turn=seg(p,b,b+.08);
  let s=base({robotM:9,dir:turn>.5?-1:1,bars:[1,1,0],nums:[1,1,0],lanes:{a:1,b:1},start:1,hi:[0,0,seg(p,.03,.12)]});
  s+=fade(seg(p,.05,.15),label('−1.5',X(5)+10,Y(-1.5)+8,{size:26,color:C.v,weight:700}));
  s+=fade(seg(p,.1,.2),line(X(3),Y(0)+14,X(5),Y(0)+14,{color:C.t,w:3})+label('2',X(4),Y(0)+40,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=fade(turn,arrow(M(9)-30,CY-48,M(9)-130,CY-48,{color:C.v,w:5,head:16})+label('左へ',M(9)-150,CY-40,{size:24,color:C.v,anchor:'end',weight:700}));
  s+=panel(86,250,label('最後の 区間 3〜5 s',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cV('v=-1.5\\ \\mathrm{m/s}')}`,PC,205,42)+fade(seg(p,b,b+.12),label('マイナス ＝ 左向きに 戻る',PC,280,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.08));
  s+=goalTag(G2);
  return s;
 },
 // 10. 横軸の下の長方形（薄い赤）に −3、幅 2（金）。長方形が下の帯へ移り、9 の先から左へ 3 の棒。ロボットが 6 m へ。
 [K+'neg']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,u=seg(p,b+.1,b+.4);
  let s=corridor({start:1})+laneBar(L1,0,8,{text:'8'})+laneBar(L1,8,9,{text:'1'})+laneBar(L2,9,6,{g:u>=.999?1:0,color:RED,text:'−3'})+robot(9-3*seg(p,b+.28,b+.5),{dir:-1});
  s+=axesVT()+divLines()+bar(0)+bar(1)+bar(2,{g:seg(p,.05,.2)})+stepLine(1)+areaNums([1,1,seg(p,.3,.45)]);
  s+=line(X(3),Y(0)-14,X(5),Y(0)-14,{color:C.t,w:3})+label('2',X(4),Y(0)-22,{size:26,color:C.t,anchor:'middle',weight:700});
  s+=morph(2,L2,9,6,u,{text:'−3'});
  s+=panel(86,250,label('速度 × 時間',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.25),T(`${cV('(-1.5)')}\\times${cT('2')}=${cX('-3\\ \\mathrm{m}')}`,PC,210,44))
   +fade(seg(p,b,b+.1),label('横軸の 下の 長方形',PC,285,{size:28,color:RED,anchor:'middle',weight:700})),1);
  s+=goalTag(G2);
  return s;
 },
 // 11. i＝1,2,3 と vᵢΔtᵢ → 札「Σ：i 番目の項を全部足す」→ Σ vᵢΔtᵢ＝8＋1＋(−3)＝6 m。変位の矢印。答えの札 A
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,e=W[0][1];
  let s=base({robotM:6,dir:-1,start:1,bars:[1,1,1],nums:[1,1,1],lanes:{a:1,b:1,c:1}});
  const gi=[seg(p,.02,.08),seg(p,.07,.13),seg(p,.12,.18)];
  [0,1,2].forEach(i=>{const [a,c]=PIECES[i];s+=fade(gi[i],label(`i＝${i+1}`,(X(a)+X(c))/2,i===0?Y(0)-14:i===2?Y(0)-12:Y(PIECES[i][2])-12,{size:22,color:C.hi,anchor:'middle',weight:700}));});
  const rows=[['1','8'],['2','1'],['3','-3']];
  let pn=label('番号を 付けて 並べる',PC,125,{size:24,color:C.dim,anchor:'middle'});
  rows.forEach(([i,v],k)=>{pn+=fade(gi[k],T(`${cV(`v_${i}`)}${cT(`\\Delta t_${i}`)}=${cX(v)}`,PC,170+k*48,32));});
  pn+=fade(seg(p,.22,.3),rect(PX+30,300,PW-60,48,{fill:C.hi,fo:.1,stroke:C.hi,sw:2,rx:10})+label('Σ：i 番目の 項を 全部 足す',PC,333,{size:24,color:C.hi,anchor:'middle',weight:700}));
  pn+=fade(seg(p,.32,e),T(`\\sum_{i=1}^{3}${cV('v_i')}${cT('\\Delta t_i')}=8+1+(-3)`,PC,410,32));
  pn+=fade(seg(p,e-.08,e),T(`=${cX('6\\ \\mathrm{m}')}`,PC,470,38));
  s+=panel(86,414,pn,1);
  s+=fade(seg(p,e-.08,e),arrow(M(0),CY-48,M(6)-26,CY-48,{color:C.x,w:5,head:16})+label('変位 6 m',M(6)+28,CY-40,{size:24,color:C.x,weight:700}));
  s+=goalTag(G2)+ANS2(seg(p,b,b+.08));
  return s;
 },
 // 12. 誤答 B → C → D を1枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),s1=W[1]?W[1][0]:.5,mid=s1+(1-s1)*.42;
  const inB=seg(p,.01,.05)*(1-seg(p,s1-.04,s1)),inC=seg(p,s1+.01,s1+.05)*(1-seg(p,mid-.04,mid));
  let s=base({robotM:6,dir:-1,start:1,bars:[1,1,1],nums:[1,1,1],lanes:{a:1,b:1,c:1}});
  s+=arrow(M(0),CY-48,M(6)-26,CY-48,{color:C.x,w:5,head:16})+label('変位 6 m',M(6)+28,CY-40,{size:24,color:C.x,weight:700});
  s+=fade(inB,ring(barC(2)[0],barC(2)[1],34,{color:C.hi,w:3}));
  s+=fade(inC,line(X(3),Y(0)+16,X(4),Y(0)+16,{color:RED,w:4})+label('1 s？',X(3.5),Y(0)+44,{size:24,color:RED,anchor:'middle',weight:700}));
  s+=panel(86,190,label('符号を 付けて 足す',PC,130,{size:24,color:C.dim,anchor:'middle'})+T(`8+1+(-3)=${cX('6\\ \\mathrm{m}')}`,PC,200,38),1);
  s+=wrongSeq(p,ctx,[['B','＋12 m',['戻った 分も 足した（それは 道のり）'],{mid:'8+1+3=12'}],['C','＋7.5 m',['戻る 区間の 幅を 1 s と した'],{mid:'8+1-1.5=7.5'}],['D','＋3.5 m',['時間を 掛けていない'],{mid:'4+1-1.5=3.5'}]],{win:[[0,s1],[s1,mid],[mid,1]],opts:{...WOPT,y:300}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 13. 求めるもの：道のり。走った跡を黄色でなぞる（右へ 9 m、折り返して左へ 3 m、2本をずらす）
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,u1=seg(p,b+.02,b+.25),u2=seg(p,b+.25,b+.4);
  let s=corridor({start:1})+robot(6,{dir:-1});
  s+=fade(1-seg(p,b-.05,b),laneBar(L1,0,8,{text:'8'})+laneBar(L1,8,9,{text:'1'})+laneBar(L2,9,6,{color:RED,text:'−3'}));
  if(u1>0)s+=line(M(0),L1[0]+12,M(9*u1),L1[0]+12,{color:C.hi,w:6});
  if(u1>=.999)s+=line(M(9),L1[0]+12,M(9),L2[0]+12,{color:C.hi,w:4});
  if(u2>0)s+=line(M(9),L2[0]+12,M(9-3*u2),L2[0]+12,{color:C.hi,w:6})+(u2>=.999?arrow(M(6.6),L2[0]+12,M(6),L2[0]+12,{color:C.hi,w:6,head:14}):'');
  s+=axesVT()+divLines()+bar(0)+bar(1)+bar(2)+stepLine(1)+areaNums([1,1,1]);
  s+=panel(86,250,label('道のり',PC,145,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.12),label('実際に 走った 跡の 全長',PC,215,{size:28,color:C.ink,anchor:'middle'})+label('（戻った 分も 足す）',PC,265,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.15),C.hi);
  s+=goalTag(G3,{g:seg(p,.02,.1)});
  return s;
 },
 // 14. 跡に「9」「3」。横軸の下の長方形が上へ折り返り、黄色の輪郭で「3」
 [K+'fold']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,f=seg(p,b+.12,b+.4);
  let s=trail({n9:seg(p,.03,.15),n3:seg(p,.12,.24)});
  s+=axesVT()+divLines()+bar(0)+bar(1)+stepLine(1)+areaNums([1,1,0]);
  // 折り返し：高さ −1.5 → ＋1.5
  const v=mix(-1.5,1.5,f),y0=Y(0),y1=Y(v),col=f<.5?RED:C.hi;
  s+=rect(X(3),Math.min(y0,y1),X(5)-X(3),Math.abs(y1-y0),{fill:col,fo:.22,stroke:col,sw:f>.5?3.5:2,rx:2});
  if(f<.05)s+=label('−3',X(4),(Y(0)+Y(-1.5))/2+12,{size:36,color:C.ink,anchor:'middle',weight:700});
  if(f>.95)s+=label('3',X(4),(Y(0)+Y(1.5))/2+12,{size:36,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,b,b+.1)*(1-f),line(X(3)-10,Y(0),X(5)+10,Y(0),{color:C.hi,w:3,dash:'6 6'}));
  s+=panel(86,250,label('走った 跡',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +label('右へ 9 m、左へ 3 m',PC,200,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.12),label('グラフ：下の 長方形を',PC,260,{size:26,color:C.ink,anchor:'middle'})+label('上へ 折り返して 足す',PC,300,{size:26,color:C.ink,anchor:'middle'})),1);
  s+=goalTag(G3);
  return s;
 },
 // 15. 8＋1＋3＝12 m。答えの札 C（12 m）
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=trail({})+axesVT()+divLines()+bar(0)+bar(1)+stepLine(1)+areaNums([1,1,0])+foldedBar();
  s+=panel(86,250,label('大きさで 足す',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.03,.15),T(`8+1+${`{\\color{${C.hi}}3}`}=${cX('12\\ \\mathrm{m}')}`,PC,215,46)),1,C.hi);
  s+=goalTag(G3)+ANS3(seg(p,b,b+.08));
  return s;
 },
 // 16. 誤答 A → B → D を1枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),s1=W[1]?W[1][0]:.4,mid=s1+(1-s1)*.42;
  let s=trail({})+axesVT()+divLines()+bar(0)+bar(1)+stepLine(1)+areaNums([1,1,0])+foldedBar();
  s+=panel(86,190,label('道のり（大きさで 足す）',PC,130,{size:24,color:C.dim,anchor:'middle'})+T(`8+1+3=${cX('12\\ \\mathrm{m}')}`,PC,200,38),1);
  s+=wrongSeq(p,ctx,[['A','6 m',['符号を 付けて 足すのは 変位の 求め方'],{mid:'8+1-3=6'}],['B','9 m',['戻った 3 m も 走った 道の 一部'],{mid:'8+1=9'}],['D','10.5 m',['1.5 に 幅 2 s を 掛けていない'],{mid:'8+1+1.5=10.5'}]],{win:[[0,s1],[s1,mid],[mid,1]],opts:{...WOPT,y:300}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 17. 3つの長方形を順に光らせ、高さに「速度」、幅に「時間」。横に (m/s)×s＝m
 [K+'why']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=axesVT()+divLines()+bar(0)+bar(1)+bar(2)+stepLine(1)+areaNums([1,1,1]);
  const hs=[seg(p,.03,.12)*(1-seg(p,.2,.25)),seg(p,.2,.27)*(1-seg(p,.36,.41)),seg(p,.36,.43)];
  [0,1,2].forEach(i=>{const [a,c,v]=PIECES[i];const g=hs[i];if(g<=0)return;
   s+=fade(g,rect(X(a),Math.min(Y(0),Y(v)),X(c)-X(a),Math.abs(Y(v)-Y(0)),{fill:'none',fo:0,stroke:C.hi,sw:4,rx:2})
    +label('高さ＝速度',X(c)+8,v>0?(Y(0)+Y(v))/2+8:Y(v)+8,{size:22,color:C.v,weight:700})+label('幅＝時間',(X(a)+X(c))/2,v>0?Y(0)+26:Y(0)-12,{size:22,color:C.t,anchor:'middle',weight:700}));});
  s+=panel(86,330,label('長方形の 面積',PC,140,{size:26,color:C.dim,anchor:'middle'})
   ,seg(p,0,.08));
  s+=fade(seg(p,.1,.2),label('高さ（速度）× 幅（時間）',PC,205,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.38),T(`(${cV('\\mathrm{m/s}')})\\times${cT('\\mathrm{s}')}=${cX('\\mathrm{m}')}`,PC,285,40));
  // 2文目：「符号付きの速度のまま足すと変位」「大きさを足すと道のり」を句の区切りで
  const e=W[1]?W[1][1]:1,r2=((ctx?.cue?.reading??'').split('。')[1]??'').split('、').map(x=>x.replace(/\s/g,'').length),tot=(r2[0]??1)+(r2[1]??1),c2=b+(e-b)*(r2[0]??1)/tot;
  {const [a,c,v]=PIECES[2];s+=fade(seg(p,b,b+.08),label('符号付き',X(a)-10,(Y(0)+Y(v))/2+8,{size:22,color:RED,anchor:'end',weight:700}));}
  s+=fade(seg(p,b,b+.08),label('符号付きで 足す → 変位',PC,350,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,c2,c2+.08),label('大きさを 足す → 道のり',PC,395,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===================== まとめ =====================
 // 18. 長方形 8・1・−3 と廊下。符号付きの和 6 m → 変位の矢印（水色）、折り返した和 12 m → 走った跡（黄）
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,m=b+(1-b)*.38;
  const gA=seg(p,b,b+.08),gB=seg(p,m,m+.08);
  let s=corridor({start:1})+robot(6,{dir:-1});
  s+=fade(gA,arrow(M(0),CY-48,M(6)-26,CY-48,{color:C.x,w:5,head:16})+label('変位 6 m',M(6)+28,CY-40,{size:24,color:C.x,weight:700}));
  s+=fade(gB,line(M(0),L1[0]+12,M(9),L1[0]+12,{color:C.hi,w:6})+line(M(9),L1[0]+12,M(9),L2[0]+12,{color:C.hi,w:4})+line(M(9),L2[0]+12,M(6.4),L2[0]+12,{color:C.hi,w:6})+arrow(M(6.6),L2[0]+12,M(6),L2[0]+12,{color:C.hi,w:6,head:14})
   +label('道のり 12 m',M(6)-12,L2[0]+20,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=axesVT()+divLines()+bar(0)+bar(1)+bar(2)+stepLine(1)+areaNums([1,1,1]);
  s+=panel(86,120,label('区間ごとに 速度 × 時間 → 全部 足す',PC,135,{size:24,color:C.ink,anchor:'middle',weight:700})+T('8,\\ 1,\\ -3',PC,180,32),seg(p,.02,.1));
  s+=panel(220,120,label('符号を 付けて 足す → 変位',PC,262,{size:24,color:C.x,anchor:'middle',weight:700})+T(`8+1-3=${cX('6\\ \\mathrm{m}')}`,PC,312,34),gA,C.x);
  s+=panel(354,120,label('大きさで 足す → 道のり',PC,396,{size:24,color:C.hi,anchor:'middle',weight:700})+T(`8+1+3=${`{\\color{${C.hi}}12\\ \\mathrm{m}}`}`,PC,446,34),gB,C.hi);
  s+=fade(gA,line(PX,262,M(6)+118,CY-44,{color:C.x,w:2.5,dash:'6 6'}));
  s+=fade(gB,line(PX,396,M(9)+8,L2[0]+12,{color:C.hi,w:2.5,dash:'6 6'}));
  s+=answerRow([[1,'B','9 m'],[2,'A','＋6 m'],[3,'C','12 m']],{g:seg(p,.9,.97)});
  return s;
 },
};

// 斜線（クリップした範囲の中）
function hatch(x,y,w,h){let s='';for(let k=-h;k<w+h;k+=14)s+=line(x+k,y+h,x+k+h,y,{color:RED,w:2.5});return s;}
// 走った跡（右へ 9 m、左へ 3 m）と数
function trail({n9=1,n3=1}={}){
 let s=corridor({start:1})+robot(6,{dir:-1});
 s+=line(M(0),L1[0]+12,M(9),L1[0]+12,{color:C.hi,w:6})+line(M(9),L1[0]+12,M(9),L2[0]+12,{color:C.hi,w:4})+line(M(9),L2[0]+12,M(6.4),L2[0]+12,{color:C.hi,w:6})+arrow(M(6.6),L2[0]+12,M(6),L2[0]+12,{color:C.hi,w:6,head:14});
 s+=fade(n9,label('9',M(4.5),L1[0]-4,{size:24,color:C.hi,anchor:'middle',weight:700}));
 s+=fade(n3,label('3',M(6)-14,L2[0]+20,{size:24,color:C.hi,anchor:'end',weight:700}));
 return s;
}
// 上へ折り返した長方形（黄色の輪郭で 3）
function foldedBar(){return rect(X(3),Y(1.5),X(5)-X(3),Y(0)-Y(1.5),{fill:C.hi,fo:.22,stroke:C.hi,sw:3.5,rx:2})+label('3',X(4),(Y(0)+Y(1.5))/2+12,{size:36,color:C.hi,anchor:'middle',weight:700});}
