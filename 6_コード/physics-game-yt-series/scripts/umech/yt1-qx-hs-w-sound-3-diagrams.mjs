// 問題編 解説「やまびこと、長さ 0.75 m の弦」(ys-qx-hs-w-sound-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/302_音波.md の q-hs-w-sound-3（解説 17 行）。
// 色（正本の指定）：λ・L・距離 d 水色、t 金、f 桃、v・V 紫、節・密 黄、強調 黄。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には、中央の V の枠のほかは描かない。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,poly,clamp} from './anim.mjs';
import {T2,LC,TCOL,FC,VCOL,ROPE,MK,airS,denseD,span} from './yt1-hs-w-sound-1-diagrams.mjs';
import {card,goalTag,answerTag,answerTagW,wrongCard,wrongSeq,kindTag,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-w-sound-3:';
const PI=Math.PI;
const G1='崖までの 距離 d',G2='弦の 振動数 f',G3='空気中の 波長';
const A1=g=>answerTag(1,'D','255 m',{g}),A2=g=>answerTag(2,'A','272 Hz',{g}),A3=g=>answerTag(3,'C','1.25 m',{g});
const LABEL=(t,x,y,col,o={})=>label(t,x,y,{size:28,color:col,anchor:'middle',weight:700,...o});
const W1='#8fd3ff',W2='#ff9fd2';
// ---- やまびこ ------------------------------------------------------------------------------------------
const EY=430,PX=150,CX=975,MY=322;   // 人の口の高さ MY、崖の面 CX
function person(x,y,{g=1,color='#d6deec'}={}){return fade(g,dot(x,y-118,16,color)+line(x,y-100,x,y-48,{color,w:6})+line(x,y-48,x-16,y,{color,w:6})+line(x,y-48,x+16,y,{color,w:6})+line(x,y-86,x+26,y-104,{color,w:6})+line(x,y-86,x-22,y-58,{color,w:6}));}
function cliff(x,y,g=1){return fade(g,poly([[x,y],[x+20,y-240],[x+70,y-300],[x+180,y-310],[x+180,y]],{fill:'#56627a',fo:.9,stroke:C.dim,sw:2}));}
const D0=CX-PX-25;
function arcs(cx,r,dir,g=1){let s='';for(let j=0;j<3;j++){const rr=r-j*30;if(rr<10)continue;const a=Math.min(.5,Math.asin(Math.min(1,(EY-6-MY)/rr)));
 const a0=dir>0?-a:PI-a,a1=dir>0?a:PI+a;
 s+=fade(g*(.9-j*.25),`<path d="M${cx+rr*Math.cos(a0)} ${MY+rr*Math.sin(a0)} A ${rr} ${rr} 0 0 1 ${cx+rr*Math.cos(a1)} ${MY+rr*Math.sin(a1)}" fill="none" stroke="${ROPE}" stroke-width="3"/>`);}
 return `<g clip-path="url(#qxs3clip)">${s}</g>`;}
const CLIP=`<defs><clipPath id="qxs3clip"><rect x="0" y="0" width="${CX}" height="${EY}"/></clipPath></defs>`;
// u：0〜1 で行って帰る（0.5 で崖）
function fronts(u,g=1){if(u<=0||u>=1)return '';const x0=PX+25;
 return CLIP+(u<.5?arcs(x0,D0*u*2,1,g):arcs(2*CX-x0,D0*(2-u*2)+D0,-1,g));}
function echo({g=1,clock=null,clockG=1}={}){
 let s=fade(g,line(60,EY,1140,EY,{color:C.dim,w:3}))+person(PX,EY,{g})+cliff(960,EY,g);
 s+=fade(g,label('人',PX,EY+34,{size:24,color:C.dim,anchor:'middle',weight:700})+label('崖',1050,EY+34,{size:24,color:C.dim,anchor:'middle',weight:700}));
 if(clock!==null)s+=card(40,96,240,60,LABEL(`時計 ${clock.toFixed(1)} s`,160,137,TCOL),g*clockG,TCOL);
 return s;
}
const Vcard=(g=1)=>card(450,4,300,64,label('V ＝ 340 m/s',600,47,{size:28,color:VCOL,anchor:'middle',weight:700}),g,VCOL);
const GOY=250,BKY=300;
const goLine=(g=1,w=5)=>fade(g,arrow(PX+30,GOY,CX-20,GOY,{color:W1,w,head:16})+label('行き',560,GOY-14,{size:26,color:W1,anchor:'middle',weight:700}));
const backLine=(g=1,y=BKY,w=5)=>fade(g,arrow(CX-20,y,PX+30,y,{color:W2,w,head:16})+label('帰り',560,y+34,{size:26,color:W2,anchor:'middle',weight:700}));
// ---- 弦（両端固定） --------------------------------------------------------------------------------------
const SX0=250,SX1=850;
function posts(y,{x0=SX0,x1=SX1,g=1,h=90}={}){return fade(g,rect(x0-16,y-h,16,2*h,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+rect(x1,y-h,16,2*h,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+line(x0,y,x1,y,{color:C.faint,w:2,dash:'6 8'}));}
function str(n,c,y,{x0=SX0,x1=SX1,A=70,g=1,color=ROPE,w=5,from=x0,to=x1,dash=''}={}){const pts=[];for(let x=from;x<=to+.1;x+=4)pts.push([x,y-A*c*Math.sin(n*PI*(x-x0)/(x1-x0))]);return fade(g,draw(pts,1,{color,w,dash}));}
function nodes(n,y,{x0=SX0,x1=SX1,g=1,mid=1}={}){let s='';for(let k=0;k<=n;k++){if(!mid&&k>0&&k<n)continue;s+=dot(x0+(x1-x0)*k/n,y,11,MK);}return fade(g,s);}
const SW=2*PI/1.25;
function string2(t,{y=280,g=1,A=70,freeze=null,x0=SX0,x1=SX1,mid=1,postsH=90}={}){
 const c=freeze??Math.cos(SW*t);
 return posts(y,{x0,x1,g,h:postsH})+str(2,c,y,{x0,x1,A,g})+nodes(2,y,{x0,x1,g,mid});
}
// ---- 空気の粒（弦の右） ------------------------------------------------------------------------------------
const hash=(i,r)=>{const z=Math.sin(i*12.9898+r*78.233)*43758.5453;return z-Math.floor(z);};
const AO={x0:480,x1:1160,rows:[200,228,256,284,312],n:28,lam:220,A:12};
function airR(ph,{o=AO,g=1,dense=1,front=true}={}){
 let s='';
 for(const d of denseD(ph,{o,front})){const x=o.x0+d;s+=fade(g*dense,rect(x-24,o.rows[0]-18,48,o.rows.at(-1)-o.rows[0]+36,{fill:C.hi,fo:.14,stroke:C.hi,sw:1.5,rx:10})+label('密',x,o.rows[0]-28,{size:22,color:C.hi,anchor:'middle',weight:700}));}
 o.rows.forEach((y,r)=>{for(let i=0;i<o.n;i++){const bx=o.x0+(o.x1-o.x0)*i/(o.n-1)+(r%2?5:-5)+(hash(i,r)-.5)*6,by=y+(hash(i,r+9)-.5)*8;
  s+=fade(g,dot(bx+airS(bx-o.x0,ph,{o,A:o.A,front}),by,6,'#a9d8ff'));}});
 return s;
}
const SS3={x0:110,x1:410,y:256};
function strAir(t,{g=1,dense=1,freeze=null}={}){
 const ph=Math.max(0,t)/1.25;
 return string2(t,{...SS3,A:44,g,postsH:70,freeze})+airR(ph,{g,dense});
}
// ---- 縮尺を引いた帯（1秒で 340 m） -------------------------------------------------------------------------
const BX0=150,BX1=1030,BY=260,GAP=30;
function band(u,{g=1,lab340=0,mark=1,zoom=0}={}){
 const xf=BX0+(BX1-BX0)*u;
 let s=fade(g,rect(BX0,BY-44,1150-BX0,88,{fill:'#16223b',fo:1,stroke:C.faint,rx:8})+rect(BX0-60,BY-34,52,68,{fill:'#26324a',fo:1,stroke:C.dim,rx:8})+label('弦',BX0-34,BY+70,{size:22,color:C.dim,anchor:'middle'}));
 let ls='';for(let x=xf;x>BX0+2;x-=GAP)ls+=line(x,BY-36,x,BY+36,{color:C.hi,w:x===xf?6:3,opacity:x===xf?1:.75});
 s+=fade(g,ls);
 if(mark&&u>.01)s+=fade(g,dot(xf,BY-50,9,MK)+label('最初の 密',Math.min(xf,1080),BY-66,{size:24,color:MK,anchor:'middle',weight:700}));
 if(u>.01)s+=fade(g,arrow(BX0,BY+70,xf,BY+70,{color:VCOL,w:5,head:16}));
 if(lab340)s+=fade(g*lab340,label('340 m',BX1+16,BY+80,{size:30,color:VCOL,weight:700}));
 if(zoom){const zx=BX0+GAP*9;
  s+=fade(g*zoom,rect(zx-8,BY-42,GAP+16,84,{fill:'none',fo:0,stroke:LC,sw:3,rx:6})
   +line(zx-8,BY+42,420,382,{color:LC,w:2,dash:'5 6'})+line(zx+GAP+8,BY+42,780,382,{color:LC,w:2,dash:'5 6'})
   +rect(420,382,360,100,{fill:'#16223b',fo:1,stroke:LC,sw:3,rx:10})
   +line(480,392,480,472,{color:C.hi,w:5})+line(720,392,720,472,{color:C.hi,w:5}))
   +span(480,720,450,'1.25 m',LC,g*zoom,28,-14);}
 return s;
}
// ---- 物差しの比べ（1 m＝400 px） ------------------------------------------------------------------------
function rulers({g=1,air=1,hi=0}={}){
 const x0=300;
 let s=fade(g,label('弦の 上',x0-20,170,{size:26,color:C.ink,anchor:'end',weight:700}))+span(x0,x0+300,170,'0.75 m',LC,g,28,-14);
 s+=fade(g*air,label('空気中',x0-20,270,{size:26,color:C.ink,anchor:'end',weight:700}))+span(x0,x0+500,270,'1.25 m',LC,g*air,28,-14);
 if(hi)s+=fade(g*hi,rect(x0+510,240,130,50,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8}));
 return s;
}

export const qxHsWSound3Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1）：人が手をたたき、波面が崖まで進んで戻る。時計が 1.5 s で止まる。道の線・物差しは描かない。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx),u=clamp((t-.5)/4.5);
  let s=echo({clock:1.5*u,clockG:seg(t,0,.3)})+fronts(u)+Vcard();
  s+=fade(seg(t,.3,.4)*(1-seg(t,1,1.3)),LABEL('パン',PX+70,MY-70,C.ink));
  s+=fade(seg(t,4.9,5.2),LABEL('やまびこ',PX+90,MY-70,C.hi));
  return s;
 },
 // 小問2：暗転。両端固定の弦が、両端と真ん中が節の形で揺れ、最後は形を止める。物差し・波長は描かない。
 [K+'q2']:(p,ctx)=>{
  const t=cueT(ctx),a=seg(t,.2,.8);
  let s=posts(280)+str(2,Math.cos(SW*t)*a,280)+nodes(2,280);
  s+=LABEL('L ＝ 0.75 m',550,430,LC)+card(880,96,300,60,LABEL('v ＝ 204 m/s',1030,136,VCOL),1,VCOL);
  return s;
 },
 // 小問3：小問2の弦の横に空気の粒。弦の揺れで空気が押され、密と疎が出ていく。空気中の波長の物差しは描かない。
 [K+'q3']:(p,ctx)=>strAir(cueT(ctx))+Vcard(),
 // ================= S1 小問1 =================
 // 1. 左にやまびこ、右に弦の静止画を小さく並べ、V。すぐ左半分を画面いっぱいに広げる
 [K+'setup']:(p)=>{
  const z=seg(p,.4,.7),k=.5+.5*z,dx=10*(1-z),dy=150*(1-z);
  let s=`<g transform="translate(${dx} ${dy}) scale(${k})">${echo()}</g>`;
  s+=fade(1-z,card(620,140,560,300,'',1,C.faint)+`<g transform="translate(560 200) scale(.6)">${string2(0,{freeze:1})}</g>`);
  s+=Vcard();
  return s;
 },
 // 2. 求めるもの。波面の動きをもう一度、行きと帰りの線、「340×1.5＝510 m」
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,u=lin(p,.05,b+.15);
  let s=echo({clock:1.5*u})+fronts(u);
  s+=goLine(seg(p,b+.05,b+.15))+backLine(seg(p,b+.15,b+.25));
  s+=card(380,96,440,64,T2('340\\times 1.5=510\\ \\mathrm{m}',600,138,{size:34,auto:false,color:W1}),seg(p,b+.3,b+.4),LC);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 「行って帰って」で2本の線を順に光らせる。2文目：510 m を半分に折って1本の長さに
 [K+'fold']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,f=seg(p,b+.05,b+.3);
  let s=echo({clock:1.5});
  const h1=seg(p,.1,.2)*(1-seg(p,.3,.35)),h2=seg(p,.3,.4)*(1-seg(p,b-.05,b));
  s+=goLine(1,5+4*h1)+backLine(1-.6*f,BKY-(BKY-GOY)*f,5+4*h2);
  s+=card(380,96,440,64,T2('340\\times 1.5=510\\ \\mathrm{m}',600,138,{size:34,auto:false,color:W1}),1-seg(p,b,b+.05),LC);
  s+=fade(seg(p,.1,.2)*(1-seg(p,b,b+.05)),LABEL('往復',560,360,C.ink));
  s+=fade(seg(p,b+.3,b+.4),LABEL('崖までは その 半分',560,360,C.hi));
  s+=goalTag(G1);
  return s;
 },
 // 4. d＝Vt/2＝510÷2＝255 m。人から崖まで 255 m の物差し。小問1 の答え D
 [K+'ans1']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=echo({clock:1.5})+fade(.4,goLine());
  s+=card(300,96,600,74,T2('d=\\dfrac{Vt}{2}=510\\div 2=255\\ \\mathrm{m}',600,140,{size:32,auto:false,color:LC}),seg(p,.03,.15),LC);
  s+=span(PX,960,370,'255 m',LC,seg(p,.2,.35),30,-14);
  s+=goalTag(G1)+A1(seg(p,ve-.08,ve));
  return s;
 },
 // 5. 誤答 A（510 m）、C（128 m）、B（227 m）を1枚ずつ
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]/2;
  let s=fade(.5,echo({clock:1.5}))+span(PX,960,370,'255 m',LC,.5,30,-14);
  s+=wrongSeq(p,ctx,[['A','510 m','往復の道のりのまま'],['C','128 m','2で割ったあと、さらに2で割った'],['B','227 m','速さを時間で割った']],{win:[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]],opts:{x:260,w:680,y:330}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2 =================
 // 6. 弦の場面。求めるもの。両端の黄の点を光らせ「固定 → 節」
 [K+'goal2']:(p,ctx)=>{
  const t=tAt(ctx,K+'goal2'),W=sentWin(ctx),b=W[1]?W[1][0]:.5,h=seg(p,b,b+.06);
  let s=posts(280)+str(2,Math.cos(SW*t),280)+nodes(2,280,{mid:0});
  s+=fade(h,ring(SX0,280,20,{color:C.hi,w:4})+ring(SX1,280,20,{color:C.hi,w:4})+LABEL('固定 → 節',SX0,420,C.hi)+LABEL('固定 → 節',SX1,420,C.hi));
  s+=card(880,96,300,60,LABEL('v ＝ 204 m/s',1030,136,VCOL),1,VCOL);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 7a. 真ん中の節、二つのふくらみに ①②
 [K+'half']:(p,ctx)=>{
  const t=tAt(ctx,K+'goal2');
  let s=posts(280)+str(2,Math.cos(SW*t),280)+nodes(2,280,{mid:0})+fade(seg(p,.05,.2),dot(550,280,13,MK)+ring(550,280,20,{color:C.hi,w:4}));
  s+=fade(seg(p,.3,.45),LABEL('①',400,170,C.ink,{size:34})+LABEL('②',700,170,C.ink,{size:34}));
  s+=card(880,96,300,60,LABEL('v ＝ 204 m/s',1030,136,VCOL),1,VCOL);
  s+=goalTag(G2);
  return s;
 },
 // 7b. 弦の形を弦の外まで点線で続けて1つの波に。1波長の物差し λ＝L＝0.75 m
 [K+'half2']:(p,ctx)=>{
  const c=Math.cos(SW*tAt(ctx,K+'goal2'))*(1-seg(p,.05,.2))+seg(p,.05,.2);
  let s=posts(280)+str(2,c,280)+nodes(2,280);
  s+=fade(seg(p,.2,.35),LABEL('①',400,170,C.ink,{size:34})+LABEL('②',700,170,C.ink,{size:34}));
  s+=str(2,c,280,{from:SX0-150,to:SX0,dash:'8 8',color:C.dim,w:3,g:seg(p,.2,.35)})+str(2,c,280,{from:SX1,to:SX1+150,dash:'8 8',color:C.dim,w:3,g:seg(p,.2,.35)});
  s+=span(SX0,SX1,410,'',LC,seg(p,.4,.55))+fade(seg(p,.45,.6),T2('\\lambda=L=0.75\\ \\mathrm{m}',550,460,{size:34,auto:false,color:LC}));
  s+=card(880,96,300,60,LABEL('v ＝ 204 m/s',1030,136,VCOL),1,VCOL);
  s+=goalTag(G2);
  return s;
 },
 // 8. v＝204 m/s を光らせ、f＝v/λ＝204÷0.75＝272 Hz
 [K+'f']:(p)=>{
  let s=posts(280)+str(2,1,280)+nodes(2,280)+span(SX0,SX1,410,'',LC)+T2('\\lambda=L=0.75\\ \\mathrm{m}',550,460,{size:34,auto:false,color:LC});
  s+=card(880,96,300,60,LABEL('v ＝ 204 m/s',1030,136,VCOL),1,seg(p,.03,.15)>.5?C.hi:VCOL);
  s+=card(250,90,540,80,T2('f=\\dfrac{v}{\\lambda}=204\\div 0.75=272\\ \\mathrm{Hz}',520,138,{size:32,auto:false,color:FC}),seg(p,.3,.45),FC);
  s+=goalTag(G2);
  return s;
 },
 // 9. f＝nv/(2L)＝2×204÷(2×0.75)＝272 Hz。n に「半波長の数」。小問2 の答え A
 [K+'ans2']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=posts(280)+str(2,1,280)+nodes(2,280)+fade(.6,LABEL('①',400,170,C.ink,{size:34})+LABEL('②',700,170,C.ink,{size:34}));
  s+=card(150,90,760,84,T2('f=\\dfrac{nv}{2L}=\\dfrac{2\\times 204}{2\\times 0.75}=272\\ \\mathrm{Hz}',530,140,{size:32,auto:false,color:FC}),seg(p,.03,.15),FC);
  s+=kindTag('n ＝ 半波長の数',1030,140,{color:C.ink,g:seg(p,.2,.35)});
  s+=fade(seg(p,.2,.35),LABEL('n ＝ 2',550,450,C.ink));
  s+=goalTag(G2)+A2(seg(p,ve-.08,ve));
  return s;
 },
 // 10a. 上下に弦の形：上 ふくらみ1つ（λ＝1.5 m、136 Hz）、下 ふくらみ2つ（272 Hz）。誤答 B
 [K+'wrongB2']:(p)=>{
  let s=shapes(1);
  s+=wrongCard('B','136 Hz','いちばん単純な形の振動数',{g:seg(p,.05,.12),mid:'204\\div 1.5=136',midSize:28});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 10b. 誤答 C（544 Hz：半波長2個を波長2個と数えた）
 [K+'wrongC2']:(p)=>{
  let s=shapes(1);
  s+=wrongCard('C','544 Hz','半波長2個を、波長2個と数えた',{g:seg(p,.03,.1),mid:'204\\div 0.375=544',midSize:28});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 11. 誤答 D（453 Hz）。204 m/s（弦）と 340 m/s（空気）を並べる
 [K+'wrongD2']:(p)=>{
  let s=card(200,110,370,100,LABEL('204 m/s（弦）',385,170,VCOL,{size:32}),seg(p,.1,.2),VCOL)+card(630,110,370,100,LABEL('340 m/s（空気）',815,170,VCOL,{size:32}),seg(p,.15,.25),C.faint);
  s+=fade(seg(p,.5,.6),LABEL('弦の 上の 波の 速さは 弦で 決まる',600,270,C.hi));
  s+=wrongCard('D','453 Hz','空気中の音の速さを使った',{g:seg(p,.03,.1),mid:'340\\div 0.75\\approx 453',midSize:28});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3 =================
 // 12. 求めるもの。弦の横の空気の粒が押され、密が出ていく。「1秒に 272回」
 [K+'goal3']:(p,ctx)=>{
  const t=tAt(ctx,K+'goal3'),W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=strAir(t-1);
  s+=card(880,96,300,60,LABEL('1秒に 272回',1030,136,FC),seg(p,b+.1,b+.2),FC);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 13. 境目に縦の点線。f＝272 Hz（同じ）、v＝204 m/s・V＝340 m/s（違う）
 [K+'same']:(p,ctx)=>{
  const t=tAt(ctx,K+'goal3'),W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=strAir(t-1);
  s+=fade(seg(p,.03,.12),line(445,110,445,350,{color:C.dim,w:3,dash:'8 8'})+label('弦',260,140,{size:26,color:C.dim,anchor:'middle',weight:700})+label('空気',800,140,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.2),LABEL('f ＝ 272 Hz',260,390,FC)+LABEL('f ＝ 272 Hz',800,390,FC)+LABEL('同じ',530,390,FC,{size:26}));
  s+=fade(seg(p,b+.1,b+.2),LABEL('v ＝ 204 m/s',260,440,VCOL)+LABEL('V ＝ 340 m/s',800,440,VCOL)+LABEL('違う',530,440,VCOL,{size:26}));
  s+=goalTag(G3);
  return s;
 },
 // 14. 縮尺を引いた帯。1秒を早回しで密を出す。最初の密に黄の印、紫の矢印 340 m。2文目：密と密の間に 1.25 m
 [K+'band']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,u=lin(p,.03,b-.03);
  let s=band(u,{lab340:seg(p,b-.06,b),mark:1-seg(p,b,b+.05),zoom:seg(p,b+.05,b+.15)});
  s+=card(20,90,240,60,LABEL(`時間 ${u>=.999?'1.0':u.toFixed(1)} s`,140,131,TCOL),1,TCOL);
  s+=card(900,90,280,60,LABEL(`密 ${Math.round(272*u)} 個`,1040,131,FC),1,FC);
  s+=card(400,90,400,60,T2('340\\div 272=1.25\\ \\mathrm{m}',600,132,{size:32,auto:false,color:LC}),seg(p,b+.25,b+.35),LC);
  s+=note('（密の 数は 省略して 描いています）',1000,505,{g:seg(p,.03,.1)});
  s+=goalTag(G3);
  return s;
 },
 // 15. 小問3 の答え C。弦の上の 0.75 m と空気中の 1.25 m を上下に並べる。誤答 A
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1];
  let s=rulers();
  s+=wrongCard('A','0.75 m','弦の上の波長を使った',{g:seg(p,e+.02,e+.08)});
  s+=goalTag(G3)+A3(seg(p,e-.06,e));
  return s;
 },
 // 16. 誤答 D（1.5 m）、誤答 B（2.5 m）を1枚ずつ
 [K+'wrongDB3']:(p,ctx)=>{
  let s=rulers();
  s+=wrongSeq(p,ctx,[['D','1.5 m','弦のいちばん単純な形の波長'],['B','2.5 m','136 Hz で計算した',{mid:'340\\div 136=2.5',midSize:28}]]);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p)=>{
  let s=card(20,100,560,300,'',seg(p,.03,.12),C.faint);
  s+=fade(seg(p,.03,.12),`<g transform="translate(36 80) scale(.46)">${echo()+goLine()+backLine()}</g>`+T2('d=340\\times 1.5\\div 2=255\\ \\mathrm{m}',300,370,{size:28,auto:false,color:LC}));
  s+=card(600,100,580,300,'',seg(p,.15,.25),C.faint);
  s+=fade(seg(p,.15,.25),`<g transform="translate(560 70) scale(.62)">${posts(280)+str(2,1,280)+nodes(2,280)}</g>`+T2('f=204\\div 0.75=272\\ \\mathrm{Hz}',890,320,{size:28,auto:false,color:FC}));
  s+=fade(seg(p,.3,.4),T2('\\lambda=340\\div 272=1.25\\ \\mathrm{m}',890,370,{size:28,auto:false,color:LC}));
  s+=ansRow(seg(p,.6,.7));
  return s;
 },
};
function shapes(g=1){
 const a=SX0,b=SX1;
 let s=posts(150,{h:55,g})+str(1,1,150,{A:45,g})+nodes(1,150,{g});
 s+=posts(270,{h:55,g})+str(2,1,270,{A:45,g})+nodes(2,270,{g});
 s+=fade(g,label('いちばん 単純な 形',b+40,130,{size:24,color:C.dim,weight:700})+label('λ ＝ 1.5 m、136 Hz',b+40,166,{size:26,color:FC,weight:700})+label('半波長 2個',b+40,250,{size:24,color:C.dim,weight:700})+label('λ ＝ 0.75 m、272 Hz',b+40,286,{size:26,color:FC,weight:700}));
 return s;
}
function ansRow(g){
 const it=[[1,'D','255 m'],[2,'A','272 Hz'],[3,'C','1.25 m']];
 let x=1190,s='';for(const [n,l,v] of [...it].reverse()){s+=answerTag(n,l,v,{g,right:x,size:24});x-=answerTagW(n,l,v,{size:24})+10;}
 return s;
}
