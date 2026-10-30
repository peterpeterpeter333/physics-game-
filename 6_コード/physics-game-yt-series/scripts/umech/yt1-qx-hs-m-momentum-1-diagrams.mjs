// 問題編 解説「壁ではね返るボール」(ys-qx-hs-m-momentum-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/108_運動量と力積.md の q-hs-m-momentum-1（解説 17 行）。
// 色（単元動画 ys-hs-m-momentum-1 と同じ）：運動量 p 桃、力 F 緑、速度 v 紫、時間 t 金、強調 黄。右向きが正。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,clamp,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,texWidth,poly} from './anim.mjs';
import {QX,card,goalTag,answerTag,wrongCard,wrongSeq,kindTag,pauseBadge,note,cueT,sentWin,voiceEnd,textW} from './yt1-qx-common.mjs';
import {posDir} from './yt1-hs-m-momentum-1-diagrams.mjs';

const K='qx-hs-m-momentum-1:';
const PC=C.p,VC=C.v,FC=C.F,TC=C.t,HI=C.hi;
const BALL='#8fa6c9',BALLF='#22324f';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const Pt=`{\\color{${PC}}p}`,DP=`\\Delta ${Pt}`,FM='F_{\\max}';
const G1='運動量の変化 Δp',G2='壁から受けた平均の力 F',G3='最大の力 Fmax';
const A1=g=>answerTag(1,'D','−3.6 kg·m/s',{g}),A2=g=>answerTag(2,'C','左向き 180 N',{g}),A3=g=>answerTag(3,'A','360 N',{g});
// 読みの中の語 mark が始まる所（cue の進み 0〜1）。1文の中で、誤答カードを切り替える所に使う。
function atMark(ctx,mark,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/[\s。]/g,''),i=r.indexOf(mark.replace(/\s/g,''));
 return i<0?fb:i/r.length*voiceEnd(ctx);
}

// ---- ボールと壁 ------------------------------------------------------------------------------------
const R=34;
function ball(x,y,{sq=0,g=1,m=1,lab='0.20 kg'}={}){
 const rx=R*(1-.28*sq),ry=R*(1+.18*sq);
 let s=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${BALLF}" stroke="${BALL}" stroke-width="3"/>`;
 if(m)s+=label(lab,x-24,y+R+34,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// 壁（ボールは左から当たる。面は x、壁の本体は右側）
function wallR(x,y1,y2,g=1){
 let s=rect(x,y1,26,y2-y1,{fill:'#3a4a66',fo:.85,stroke:'none',rx:2})+line(x,y1,x,y2,{color:C.dim,w:4});
 for(let q=y1+6;q<y2-10;q+=24)s+=line(x+4,q+14,x+22,q,{color:C.dim,w:2});
 return fade(g,s);
}
// 金の時計（接触の時間）
function clock(cx,cy,r,{g=1,u=1,txt='',anchor='end',tx,ty}={}){
 let s=ring(cx,cy,r,{color:TC,w:4,fill:'#1a1a10'});
 for(let i=0;i<8;i++){const a=Math.PI*2*i/8;s+=line(cx+r*.78*Math.sin(a),cy-r*.78*Math.cos(a),cx+r*Math.sin(a),cy-r*Math.cos(a),{color:TC,w:2.5});}
 const a=Math.PI*2*u;s+=line(cx,cy,cx+r*.75*Math.sin(a),cy-r*.75*Math.cos(a),{color:TC,w:4})+dot(cx,cy,5,TC);
 if(txt)s+=label(txt,tx??(anchor==='end'?cx-r-14:cx+r+14),ty??cy+9,{size:28,color:TC,anchor,weight:700});
 return fade(g,s);
}
// 出題中の動き：0〜2 s 右へ（10 m/s）、2〜3 s 接触（つぶれる）、3〜5 s 左へ（8.0 m/s）
const WX=760,BY=300,X0=200,XC=WX-R,SP=(XC-X0)/2;
function motion(t){
 if(t<2)return {x:X0+SP*t,ph:0,sq:0};
 if(t<3){const sq=Math.sin(Math.PI*(t-2));return {x:WX-R*(1-.28*sq),ph:1,sq};}
 return {x:XC-.8*SP*Math.min(t-3,2.3),ph:2,sq:0};
}
const VK=14;
function vArrow(x,dir,{g=1,txt=''}={}){
 const x1=x+dir*(R+12),x2=x1+dir*(dir>0?10:8)*VK,y=BY-74;
 return fade(g,arrow(x1,y,x2,y,{color:VC,w:5,head:16})+label(txt,(x1+x2)/2,y-16,{size:26,color:VC,anchor:'middle',weight:700}));
}
function setupScene(t,{inset=0}={}){
 const {x,ph,sq}=motion(t);
 let s=line(60,BY+R+6,WX,BY+R+6,{color:C.faint,w:2,dash:'6 8'});
 s+=wallR(WX,170,430);
 s+=ball(x,BY,{sq});
 if(ph===0)s+=vArrow(x,1,{txt:'右 10 m/s'});
 if(ph===2)s+=vArrow(x,-1,{txt:'左 8.0 m/s',g:seg(t,3,3.25)});
 s+=clock(690,135,30,{g:seg(t,1.95,2.15),u:clamp(t-2),txt:'接触 0.020 s'});
 s+=posDir(110,130);
 if(inset)s+=insetQ3(inset);
 return s;
}
// 右下の小さな枠「小問3」：|F|-t の三角形（底辺 0.020 s、頂点に Fmax？）
function insetQ3(g=1){
 const x=820,y=236,w=370,h=272,ox=876,oy=462,bw=200,bh=130;
 let s=card(x,y,w,h,'',1,C.dim)+label('小問3',x+w-18,y+38,{size:24,color:C.dim,anchor:'end',weight:700});
 s+=arrow(ox,oy,ox+bw+70,oy,{color:TC,w:3,head:12})+arrow(ox,oy,ox,oy-bh-50,{color:FC,w:3,head:12});
 s+=label('t',ox+bw+78,oy+8,{size:24,color:TC,weight:700})+label('|F|',ox+10,oy-bh-46,{size:24,color:FC,weight:700});
 s+=poly([[ox,oy],[ox+bw/2,oy-bh],[ox+bw,oy]],{fill:FC,fo:.25,stroke:FC,sw:3});
 s+=label('Fmax？',ox+bw/2,oy-bh-14,{size:24,color:FC,anchor:'middle',weight:700});
 s+=label('0.020 s',ox+bw,oy+30,{size:22,color:TC,anchor:'middle',weight:700});
 return fade(g,s);
}

// ---- 小問1：上下に並べたボールと、運動量の矢印 --------------------------------------------------------
const PK=70,YT=165,YB=355,BX=720;
function pairScene({pa=0,minus=0,hiPos=0,calc=0}={}){
 let s=wallR(BX+R,YT-70,YT+60)+wallR(BX+R,YB-70,YB+60);
 s+=label('はじめ（当たる前）',60,YT-50,{size:26,color:C.dim,weight:700})+label('あと（はね返った後）',60,YB-50,{size:26,color:C.dim,weight:700});
 s+=ball(BX-R-6,YT,{m:0})+ball(BX-R-6,YB,{m:0});
 const bx=BX-R-6;
 s+=arrow(bx-70,YT-54,bx+70,YT-54,{color:VC,w:5,head:16,g:1-pa*.6});
 s+=fade(1-pa*.6,label('10 m/s',bx-84,YT-46,{size:24,color:VC,anchor:'end',weight:700}));
 s+=arrow(bx+56,YB-54,bx-56,YB-54,{color:VC,w:5,head:16,g:1-pa*.6});
 s+=fade(1-pa*.6,label('8.0 m/s',bx-70,YB-46,{size:24,color:VC,anchor:'end',weight:700}));
 // 桃の運動量の矢印（ボールの下）
 const xs=BX-R-6;
 s+=fade(pa,arrow(xs,YT+58,xs+2.0*PK,YT+58,{color:PC,w:8,head:20})+label('＋2.0',xs+PK,YT+96,{size:28,color:PC,anchor:'middle',weight:700}));
 s+=fade(pa,arrow(xs,YB+58,xs-1.6*PK,YB+58,{color:PC,w:8,head:20})+label('−1.6',xs-.8*PK,YB+96,{size:28,color:PC,anchor:'middle',weight:700}));
 // 計算（左）
 if(calc){
  s+=fade(calc,T('0.20\\times 10=+2.0',60,YT+30,38,{anchor:'start'}));
  s+=fade(calc*(minus<.5?1:0),T('0.20\\times(-8.0)=-1.6',60,YB+30,38,{anchor:'start'}));
  s+=fade(calc*(minus<.5?0:1),T(`0.20\\times({\\color{${HI}}\\boxed{\\color{${C.ink}}-}}8.0)=-1.6`,60,YB+30,38,{anchor:'start',auto:false}));
 }
 s+=posDir(880,120,{g:1});
 if(hiPos)s+=fade(hiPos,rect(855,96,260,46,{fill:HI,fo:.12,stroke:HI,sw:2.5,rx:12}));
 return s;
}
// 根元をそろえた2本の矢印と Δp
const O=620,YV1=132,YV2=196,YV3=258;
function vecScene({align=1,dpg=0,split=0,hi16=0,eq=0}={}){
 let s='';
 const t1=O,t2=O;
 s+=label('はじめ',O-260,YV1+9,{size:26,color:C.dim,weight:700})+label('あと',O-260,YV2+9,{size:26,color:C.dim,weight:700});
 s+=arrow(t1,YV1,t1+2.0*PK,YV1,{color:PC,w:8,head:20})+label('＋2.0',t1+2.0*PK+16,YV1+10,{size:28,color:PC,weight:700});
 s+=arrow(t2,YV2,t2-1.6*PK,YV2,{color:PC,w:8,head:20})+label('−1.6',t2-1.6*PK-16,YV2+10,{size:28,color:PC,anchor:'end',weight:700});
 s+=fade(align,line(O,YV1-30,O,YV3+20,{color:C.faint,w:2,dash:'6 6'})+label('根元を そろえる',O,YV1-40,{size:22,color:C.dim,anchor:'middle'}));
 const xa=O+2.0*PK,xb=O-1.6*PK;
 s+=fade(dpg,line(xa,YV1+10,xa,YV3,{color:PC,w:2,dash:'5 6'})+line(xb,YV2+10,xb,YV3,{color:PC,w:2,dash:'5 6'}));
 if(!split)s+=arrow(xa,YV3,xa+(xb-xa)*seg(dpg,0,1),YV3,{color:PC,w:9,head:22,g:dpg>.02?1:0});
 else{
  s+=line(xa,YV3,O,YV3,{color:'#ffc9f1',w:9})+arrow(O,YV3,xb,YV3,{color:PC,w:9+5*hi16,head:22});
  s+=fade(hi16,rect(xb-14,YV3-22,O-xb+14,44,{fill:HI,fo:.18,stroke:HI,sw:3,rx:10}));
  s+=fade(split,label('止める分 2.0',(xa+O)/2,YV3+44,{size:24,color:'#ffc9f1',anchor:'middle',weight:700})+label('逆に動かす分 1.6',(O+xb)/2,YV3+44,{size:24,color:hi16>.5?HI:PC,anchor:'end',weight:700}));
 }
 if(!split)s+=fade(dpg,T(DP,(xa+xb)/2,YV3+44,34,{auto:false}));
 if(eq)s+=card(150,370,900,110,label('Δp ＝ あと − はじめ ＝ −1.6 − 2.0 ＝ −3.6 kg·m/s',600,436,{size:32,color:C.ink,anchor:'middle',weight:700}),eq,PC);
 return s;
}

// ---- 小問2：壁に触れているボールと式 ------------------------------------------------------------------
const W2=470,B2Y=300;
function contactScene({fArrow=0,minusTag=0,clockLine=0}={}){
 let s=wallR(W2,170,430)+ball(W2-R*(1-.28),B2Y,{sq:1,m:0})+label('0.20 kg',W2-R-60,B2Y+70,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=clock(230,150,34,{u:1,txt:'Δt ＝ 0.020 s',anchor:'start',tx:150,ty:222});
 if(fArrow){
  s+=fade(fArrow,arrow(W2-2*R+10,B2Y,W2-2*R-200,B2Y,{color:FC,w:9,head:24})+label('左向き 180 N',W2-2*R-95,B2Y-26,{size:28,color:FC,anchor:'middle',weight:700}));
 }
 if(minusTag)s+=kindTag('−（マイナス）＝ 左向き',250,420,{g:minusTag,color:HI});
 if(clockLine)s+=fade(clockLine,line(268,150,700,150,{color:TC,w:2.5,dash:'6 6'}));
 return s;
}
const RP={x:600,w:590};
function eqCard(inner,g=1,stroke=FC,{y=90,h=200}={}){return card(RP.x,y,RP.w,h,inner,g,stroke);}
const RX=RP.x+RP.w/2;

// ---- 小問3：|F|-t グラフ ---------------------------------------------------------------------------
const GX=120,GY=445,TS=18000,FS=250/360;   // 0.020 s → 360 px、360 N → 250 px
const gX=t=>GX+t*TS,gY=f=>GY-f*FS;
function graph({tri=1,fq=1,apex=0,strips=0,fill=1,area=0,rectg=0,diff=0,avg=0,assume=0}={}){
 let s=arrow(GX,GY,GX+480,GY,{color:TC,w:3,head:14})+arrow(GX,GY,GX,GY-350,{color:FC,w:3,head:14});
 s+=label('t [s]',GX+470,GY+40,{size:24,color:TC,anchor:'middle',weight:700})+label('力の大きさ |F| [N]',GX+16,GY-336,{size:24,color:FC,weight:700});
 s+=line(gX(.02),GY-6,gX(.02),GY+6,{color:C.dim,w:2})+label('0.020',gX(.02),GY+34,{size:24,color:TC,anchor:'middle',weight:700})+label('0',GX-14,GY+30,{size:22,color:C.dim,anchor:'end'});
 const P=[[gX(0),GY],[gX(.01),gY(360)],[gX(.02),GY]];
 if(strips>0){
  const n=24;let st='';
  for(let i=0;i<n;i++){if(i/n>strips)break;const tm=(i+.5)/n*.02,f=tm<.01?36000*tm:36000*(.02-tm);
   st+=rect(gX(i/n*.02)+1,gY(f),.02/n*TS-2,f*FS,{fill:FC,fo:.45,stroke:FC,sw:1,rx:1});}
  s+=fade(1-fill,st);
 }
 if(tri)s+=fade(tri,poly(P,{fill:FC,fo:.25*fill,stroke:FC,sw:3.5}));
 if(fq)s+=fade(fq,label('Fmax？',gX(.01),gY(360)-16,{size:28,color:FC,anchor:'middle',weight:700}));
 if(apex)s+=fade(apex,label('360 N',gX(.01),gY(360)-16,{size:30,color:HI,anchor:'middle',weight:700})+line(GX,gY(360),gX(.01),gY(360),{color:HI,w:2,dash:'6 6'})+label('360',GX-12,gY(360)+8,{size:22,color:HI,anchor:'end'}));
 if(area)s+=fade(area,label('3.6 N·s',gX(.01),GY-60,{size:28,color:C.ink,anchor:'middle',weight:700}));
 if(rectg){
  s+=fade(rectg,rect(gX(0),gY(180),.02*TS,180*FS,{fill:'none',fo:0,stroke:HI,sw:3.5,rx:0}));
  s+=fade(rectg,line(GX,gY(180),gX(0)-6,gY(180),{color:HI,w:2})+label('180',GX-12,gY(180)+8,{size:22,color:HI,anchor:'end'}));
 }
 if(diff){
  const c='#ffb36b';
  s+=fade(diff,poly([[gX(.005),gY(180)],[gX(.01),gY(360)],[gX(.015),gY(180)]],{fill:c,fo:.55,stroke:c,sw:2})
   +poly([[gX(0),GY],[gX(0),gY(180)],[gX(.005),gY(180)]],{fill:c,fo:.55,stroke:c,sw:2})+poly([[gX(.02),GY],[gX(.02),gY(180)],[gX(.015),gY(180)]],{fill:c,fo:.55,stroke:c,sw:2}));
  s+=fade(diff,label('はみ出す分 ＝ へこむ分',gX(.02)+16,gY(250),{size:24,color:c,weight:700}));
 }
 if(avg)s+=fade(avg,label('平均の力の大きさ 180 N',gX(.02)+16,gY(180)+10,{size:24,color:HI,weight:700}));
 if(assume)s+=kindTag('三角形と仮定',gX(.02)+110,gY(330),{g:assume,color:C.dim});
 return s;
}

export const qxHsMMomentum1Diagrams={
 // ================= 問題アニメ：出題中（7 秒＋静止）=================
 // 0〜2 s ボールが右へ（紫「右 10 m/s」）、2〜3 s 接触（つぶれる、速度の矢印を消す、金の時計「接触 0.020 s」）、
 // 3〜5 s 左へ（紫「左 8.0 m/s」）、5〜7 s 右下に「小問3」の小さな枠（|F|-t の三角形、Fmax？）と「映像を一時停止」。
 // 出さない：運動量の矢印、Δp、平均の力、同じ面積の長方形、壁がボールを押す力の矢印。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx);
  return setupScene(Math.min(t,5),{inset:seg(t,5,5.6)})+pauseBadge({g:seg(t,5,5.4),y:8});
 },
 // ================= 小問1 =================
 // 1. 出題中の図を再生（小問3 の枠は出さない）
 [K+'setup']:(p,ctx)=>{const t=cueT(ctx);return setupScene(Math.min(t,5.3))+pauseBadge({g:seg(t,5.3,5.6),y:8});},
 // 2. 求めるもの：Δp。はね返る前と後を上下に並べて止める
 [K+'goal1']:(p)=>pairScene()+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. ＋の矢印を光らせる → 桃の矢印 ＋2.0／−1.6、−8.0 の「−」を黄で囲む
 [K+'signs']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=pairScene({hiPos:seg(p,.08,.16)*(1-seg(p,b,b+.05)),pa:seg(p,b+.05,b+.2),calc:seg(p,b,b+.12),minus:seg(p,b+.3,b+.4)});
  return s+goalTag(G1);
 },
 // 4. 根元をそろえ、はじめの先からあとの先へ Δp（左向き 3.6）。答え D
 [K+'dp']:(p,ctx)=>{
  const a=atMark(ctx,'しょうもんいちの',.7);
  let s=vecScene({align:seg(p,0,.1),dpg:lin(p,.12,.35),eq:seg(p,.3,.42)});
  return s+goalTag(G1)+A1(seg(p,a,a+.06));
 },
 // 5. 誤答 A・B（1枚ずつ）
 [K+'wrongAB']:(p,ctx)=>{
  const b=atMark(ctx,'ビーの',.5);
  let s=vecScene({align:1,dpg:1});
  s+=wrongSeq(p,ctx,[['A','−0.40',['あとの速度を ＋8.0 とした'],{mid:'0.20\\times 8.0-0.20\\times 10=-0.40'}],['B','＋3.6',['はじめ − あと と 逆に 引いた'],{mid:'2.0-(-1.6)=+3.6'}]],{win:[[0,b],[b,1]],opts:{y:340,midSize:30}});
  return s+goalTag(G1)+A1(1);
 },
 // 6. Δp を「止める分 2.0」と「逆に動かす分 1.6」に分け、1.6 を光らせる。誤答 C
 [K+'wrongC']:(p,ctx)=>{
  let s=vecScene({align:1,dpg:1,split:seg(p,.03,.15),hi16:seg(p,.35,.45)});
  s+=wrongCard('C','−2.0','はね返った分を 入れていない',{y:370,g:seg(p,.08,.16)});
  return s+goalTag(G1)+A1(1);
 },
 // ================= 小問2 =================
 // 7. 求めるもの：平均の力 F。壁に触れているボールと時計
 [K+'goal2']:(p)=>contactScene()+goalTag(G2,{g:seg(p,.03,.15)}),
 // 8. FΔt＝Δp → 両辺を Δt で割って F＝Δp/Δt。時計から Δt へ線
 [K+'impulse']:(p,ctx)=>{
  const a=atMark(ctx,'エフイコールデルタピーわる',.6);
  let s=contactScene({clockLine:seg(p,a+.08,a+.18)});
  s+=eqCard(fade(1-seg(p,a,a+.05),T(`F\\Delta t=${DP}`,RX,215,46,{}))
   +fade(seg(p,a,a+.08),T(`F=\\dfrac{${DP}}{\\Delta t}`,RX,225,46,{}))
   +fade(seg(p,.15,.25)*(1-seg(p,a,a+.05)),label('力積 ＝ 運動量の変化',RX,126,{size:26,color:C.dim,anchor:'middle',weight:700}))
   +fade(seg(p,a,a+.08),label('両辺を Δt で 割る',RX,126,{size:26,color:C.dim,anchor:'middle',weight:700})),seg(p,.05,.15));
  return s+goalTag(G2);
 },
 // 9. −3.6÷0.020＝−180 N。緑の矢印「左向き 180 N」、「−＝左向き」。答え C
 [K+'force']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,a=atMark(ctx,'しょうもんにの',.8);
  let s=contactScene({fArrow:seg(p,b+.05,b+.18),minusTag:seg(p,b,b+.08)});
  const st=p<.05?0:p<.16?1:2,src=[`F=\\dfrac{${DP}}{\\Delta t}`,`F=\\dfrac{${DP}}{\\Delta t}=\\dfrac{-3.6}{0.020}`,`F=\\dfrac{${DP}}{\\Delta t}=\\dfrac{-3.6}{0.020}=-180\\ \\mathrm{N}`][st];
  s+=eqCard(T(src,RX,190,42,{}),1);
  return s+goalTag(G2)+A2(seg(p,a,a+.06));
 },
 // 10. 誤答 A・B（1枚ずつ、文ごと）
 [K+'wrong2AB']:(p,ctx)=>{
  let s=contactScene({fArrow:1});
  s+=eqCard(T(`F=\\dfrac{${DP}}{\\Delta t}=\\dfrac{-3.6}{0.020}=-180\\ \\mathrm{N}`,RX,190,42,{}),.5);
  s+=wrongSeq(p,ctx,[['A','左 20 N','Δp を −0.40 とした',{mid:'-0.40\\div 0.020=-20'}],['B','右 180 N','− は 左向き']],{opts:{x:RP.x,w:RP.w,y:305,size:26,midSize:30}});
  return s+goalTag(G2)+A2(1);
 },
 // 11. 誤答 D（掛けた、単位 kg·m）
 [K+'wrong2D']:(p)=>{
  let s=contactScene({fArrow:1});
  s+=eqCard(T(`F=\\dfrac{${DP}}{\\Delta t}=\\dfrac{-3.6}{0.020}=-180\\ \\mathrm{N}`,RX,190,42,{}),.5);
  s+=wrongCard('D','左 0.072 N','3.6×0.020（単位 kg·m）',{x:RP.x,w:RP.w,y:305,size:26,g:seg(p,.03,.1)});
  return s+goalTag(G2)+A2(1);
 },
 // ================= 小問3 =================
 // 12. 符号付きの画面を消し、|F|-t グラフ（三角形、Fmax？）と「三角形と仮定」
 [K+'goal3']:(p)=>graph({tri:seg(p,.05,.2),fq:seg(p,.2,.3),assume:seg(p,.45,.55)})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 13. 短冊を足して面積 → 力積の大きさ 3.6 N·s。½×0.020×Fmax＝3.6
 [K+'area']:(p,ctx)=>{
  const st=lin(p,.05,.35),fill=seg(p,.36,.42);
  let s=graph({strips:st,fill,area:seg(p,.42,.5)});
  s+=card(600,96,590,220,label('面積 ＝ 力積の大きさ 3.6 N·s',895,146,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('（＝ Δp の大きさ）',895,186,{size:24,color:PC,anchor:'middle',weight:700})
   +fade(seg(p,.55,.65),T(`\\dfrac{1}{2}\\times 0.020\\times F_{\\max}=3.6`,895,262,38,{})),seg(p,.4,.5),FC);
  s+=fade(seg(p,.55,.65),label('½ × 底辺 × 高さ',895,350,{size:24,color:C.dim,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 14. ½×0.020＝0.010 → Fmax＝3.6÷0.010＝360 N。頂点に 360 N。答え A
 [K+'fmax']:(p,ctx)=>{
  const a=atMark(ctx,'しょうもんさんの',.75);
  let s=graph({fq:1-seg(p,.4,.48),apex:seg(p,.45,.55),area:1});
  s+=card(600,96,590,220,T(`0.010\\times F_{\\max}=3.6`,895,160,38,{})
   +fade(seg(p,.25,.35),T(`F_{\\max}=\\dfrac{3.6}{0.010}=360\\ \\mathrm{N}`,895,250,38,{})),1,FC);
  return s+goalTag(G3)+A3(seg(p,a,a+.06));
 },
 // 15. 同じ面積の長方形（高さ 180）＝平均の力の大きさ。誤答 B
 [K+'rect']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=graph({fq:0,apex:1,rectg:seg(p,.05,.15),diff:seg(p,.18,.3),avg:seg(p,.3,.4)});
  s+=wrongCard('B','180 N','平均の力の大きさ',{x:640,w:550,y:370,g:seg(p,b,b+.05)});
  return s+goalTag(G3)+A3(1);
 },
 // 16. 誤答 C・D（1枚ずつ）
 [K+'wrong3CD']:(p,ctx)=>{
  const b=atMark(ctx,'ディーの',.5);
  let s=graph({fq:0,apex:1,rectg:1,area:1});
  s+=wrongSeq(p,ctx,[['C','90 N','½ を 逆に 使った',{mid:'180\\times\\tfrac{1}{2}=90'}],['D','3.6 N','面積（単位 N·s）を 力と した']],{win:[[0,b],[b,1]],opts:{x:640,w:550,y:308,midSize:30}});
  return s+goalTag(G3)+A3(1);
 },
 // ================= まとめ =================
 // 17. 左の枠：ボールと Δp → 平均の力。右の枠：|F| の三角形 → Fmax。「Δp＝FΔt」「向きは符号で」を黄で強調
 [K+'sum']:(p)=>{
  const gL=seg(p,.03,.15),gR=seg(p,.25,.37),gH=seg(p,.5,.62);
  let s=card(10,92,580,412,'',gL,PC);
  s+=fade(gL,`<g transform="translate(-40 40) scale(.62)">${wallR(560,170,430)+ball(560-R*(1-.28),300,{sq:1,m:0})+arrow(560-2*R+10,300,560-2*R-200,300,{color:FC,w:9,head:24})}</g>`);
  s+=fade(gL,label('左向き 180 N',200,175,{size:26,color:FC,anchor:'middle',weight:700})+line(200,185,200,212,{color:FC,w:2}));
  s+=fade(gL,T(`${DP}=-3.6`,300,345,36,{auto:false})+T(`F=-3.6\\div 0.020=-180\\ \\mathrm{N}`,300,410,32,{})+label('（左向き）',300,470,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=card(610,92,580,412,'',gR,FC);
  s+=fade(gR,poly([[700,330],[820,170],[940,330]],{fill:FC,fo:.25,stroke:FC,sw:3})+line(680,330,980,330,{color:TC,w:2.5})+label('|F| の 三角形',1060,200,{size:26,color:FC,anchor:'middle',weight:700})
   +label('面積 3.6',820,300,{size:24,color:C.ink,anchor:'middle',weight:700})+label('360 N',820,155,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=fade(gR,T(`F_{\\max}=360\\ \\mathrm{N}`,900,410,36,{}));
  s+=kindTag('Δp ＝ FΔt',300,40,{g:gH,color:HI,size:28})+kindTag('向きは 符号で',900,40,{g:gH,color:HI,size:28});
  return s;
 },
};
