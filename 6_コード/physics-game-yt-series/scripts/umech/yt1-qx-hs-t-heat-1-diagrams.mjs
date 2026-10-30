// 問題編 解説「同じ温度の、やかんとコップ」(ys-qx-hs-t-heat-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/201_熱と温度.md の q-hs-t-heat-1（解説 20 行）。
// 色（正本の指定）：温度 T 黄緑、熱・エネルギー 橙、質量 白、強調 黄、誤り 赤。分子の点は単元動画と同じ「熱い＝赤みの橙」。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-t-heat-1）の部品（温度計・ビーカー・分子の箱・丸窓・湯気）を読み込んで使う（そのファイルは編集しない）。
// 出題中の図には、分子の拡大・エネルギーの棒・絶対温度の目盛りを描かない（答えにつながるため）。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,clamp,mix} from './anim.mjs';
import {TC,Tt,HOT,COLD,WATER,thermo,beaker,steam,molBox,lens,T2} from './yt1-hs-t-heat-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin,voiceEnd,cueT,tAt} from './yt1-qx-common.mjs';

const K='qx-hs-t-heat-1:';
const EC=C.E,OK=C.F,BAD='#ff6b6b';
const G1='1個あたりの激しさと合計',G2='小問1 の理由',G3='昼の絶対温度と上がり幅';
const A1=g=>answerTag(1,'C','激しさ同じ・合計 約10倍',{g}),A2=g=>answerTag(2,'A','',{g}),A3=g=>answerTag(3,'D','290 K、30 K',{g});
// ナレーションの読みの中で、語 word が読まれ始める所（cue の進み 0〜1。読みのかなの長さで見積もる）
function at(ctx,word,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0?fb:i/Math.max(1,r.replace(/。/g,'').length)*voiceEnd(ctx);
}
// ---- 器 -------------------------------------------------------------------------------------------
const WAT=WATER;
// やかん（中が見える断面の絵）。底の中央 (x,gy)。
function kettle(x,gy,{g=1,lv=.72}={}){
 const bw=250,tw=170,h=170,yt=gy-h,xL=y=>x-(bw/2-(bw-tw)/2*(gy-y)/h),xR=y=>2*x-xL(y);
 const yw=gy-h*lv;
 let s=`<polygon points="${xL(yw)},${yw} ${xR(yw)},${yw} ${xR(gy)},${gy} ${xL(gy)},${gy}" fill="${WAT}" fill-opacity=".38"/>`;
 s+=`<path d="M${xL(yt)} ${yt} L${xL(gy)} ${gy} L${xR(gy)} ${gy} L${xR(yt)} ${yt}" fill="none" stroke="#c9d2e0" stroke-width="4" stroke-linejoin="round"/>`;
 s+=line(xL(yt)-6,yt,x-28,yt,{color:'#c9d2e0',w:5})+line(x+28,yt,xR(yt)+6,yt,{color:'#c9d2e0',w:5});   // ふた（中央に口）
 s+=`<path d="M${xR(gy-50)} ${gy-50} L${xR(gy-50)+70} ${gy-140} L${xR(gy-50)+82} ${gy-136}" fill="none" stroke="#c9d2e0" stroke-width="5" stroke-linecap="round"/>`; // 注ぎ口
 s+=`<path d="M${x-70} ${yt} Q${x-70} ${yt-70} ${x} ${yt-70} Q${x+70} ${yt-70} ${x+70} ${yt}" fill="none" stroke="#c9d2e0" stroke-width="7"/>`;  // 取っ手
 return fade(g,s);
}
// コップ（ガラス）。底の中央 (x,gy)。
function cup(x,gy,{g=1,lv=.72}={}){
 const bw=74,tw=100,h=120,yt=gy-h,xL=y=>x-(bw/2+(tw-bw)/2*(gy-y)/h),xR=y=>2*x-xL(y),yw=gy-h*lv;
 let s=`<polygon points="${xL(yw)},${yw} ${xR(yw)},${yw} ${xR(gy)},${gy} ${xL(gy)},${gy}" fill="${WAT}" fill-opacity=".38"/>`;
 s+=`<path d="M${xL(yt)} ${yt} L${xL(gy)} ${gy} L${xR(gy)} ${gy} L${xR(yt)} ${yt}" fill="none" stroke="#c9d2e0" stroke-width="4" stroke-linejoin="round"/>`;
 return fade(g,s);
}
const massTag=(t,x,y,g=1)=>card(x-70,y-30,140,52,label(t,x,y+5,{size:28,color:C.ink,anchor:'middle',weight:700}),g,C.ink);
// 配置：やかん（左）とコップ（右）
const PK={x:300,gy:470},PC={x:850,gy:470};
const thK={x:320,top:160,bot:420},thC={x:865,top:230,bot:420};
const LV=170;   // 50℃ の液の高さ（px）。目盛りは描かない
// 器と温度計。ins＝温度計を差す（0→1）、rise＝液が上がる（0→1）、t50＝「50℃」の札、hi＝目盛りを黄で光らせる
function vessels({g=1,ins=1,rise=1,t50=1,hi=0,mass=1,dimTh=0}={}){
 let s=kettle(PK.x,PK.gy)+cup(PC.x,PC.gy);
 s+=fade(mass,massTag('3.0 kg',110,300)+massTag('300 g',1010,420));
 const dy=(1-ins)*-160;
 const th=(o,lab)=>{const lev=rise*LV,col=hi>.5?C.hi:TC;
  return `<g transform="translate(0 ${dy.toFixed(1)})">${thermo(o.x,o.top,o.bot,lev,{color:col})}</g>`
   +fade(t50,label('50℃',o.x,o.top-16,{size:30,color:hi>.5?C.hi:TC,anchor:'middle',weight:700}));};
 s+=fade(ins*(1-dimTh*.6),th(thK,1)+th(thC,0));
 return fade(g,s);
}
// 丸窓（拡大）。n＝点の数、t＝秒
const NW=4;   // 丸窓の点の数（コップ）。やかんは小問1 で 10倍の 40 個
const LK={x:620,y:270,R:110},LCP={x:1060,y:270,R:110};
function windowAt(o,n,t,{g=1,seed=1,extra=0,nExtra=30}={}){
 const a=o.R*.7;
 let inner=molBox({x:o.x-a,y:o.y-a,w:2*a,h:2*a,n,dist:150*t,speed:150,seed,r:7,color:HOT,frame:false});
 if(extra)inner+=molBox({x:o.x-a,y:o.y-a,w:2*a,h:2*a,n:nExtra,dist:150*t,speed:150,seed,r:7,color:HOT,frame:false,g:extra});
 return fade(g,lens(o.x,o.y,o.R,inner,{color:C.dim}));
}
const link=(x1,y1,o,g=1)=>fade(g,line(x1,y1,o.x-o.R*.95,o.y+o.R*.3,{color:C.dim,w:2,dash:'6 6'}));
const speedArrow=(o,g=1)=>fade(g,arrow(o.x-50,o.y+o.R+34,o.x+50,o.y+o.R+34,{color:C.v,w:5,head:14})+label('平均の 激しさ',o.x,o.y+o.R+76,{size:24,color:C.v,anchor:'middle',weight:700}));
// 橙の小さな棒（1個ぶん）を3つずつ積む。base＝下端、rows＝段の数
function stack(cx,base,rows,{g=1,grow=1,bw=34,bh=22}={}){
 let s='';const shown=rows*grow;
 for(let r=0;r<rows;r++){const o=clamp(shown-r);if(o<=0)break;
  for(let c=0;c<3;c++)s+=rect(cx-1.5*bw-4+c*(bw+4),base-(r+1)*(bh+4),bw,bh,{fill:EC,fo:.65*o,stroke:EC,sw:1.5,rx:4,opacity:o});}
 return fade(g,s);
}
// 空の絵（小問3）：朝と昼
function skies({g=1,tags=1}={}){
 const P=(x,c1,c2,sunY,sunC,title)=>{
  let s=`<defs><linearGradient id="sky${x}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`;
  s+=`<rect x="${x}" y="110" width="440" height="290" rx="16" fill="url(#sky${x})"/>`;
  s+=dot(x+(sunY>300?370:300),sunY,32,sunC)+rect(x,370,440,30,{fill:'#2b3b55',fo:1,stroke:'none',rx:0});
  s+=label(title,x+40,160,{size:30,color:'#0b1122',weight:700});
  return s;};
 let s=P(120,'#2c4370','#e9a87a',350,'#ffd27a','')+P(640,'#4f8fd6','#a9d3ff',170,'#fff2a8','');
 s+=fade(tags,card(170,300,200,64,label('朝 −13℃',270,343,{size:32,color:TC,anchor:'middle',weight:700}),1,TC)
  +card(690,300,200,64,label('昼 17℃',790,343,{size:32,color:TC,anchor:'middle',weight:700}),1,TC));
 return fade(g,s);
}
// 2本の温度計（左 セ氏、右 絶対温度）。目盛りの幅は同じ。0 の位置が 273 ずれる
const XS={l:300,r:600};
const yC=c=>455-(c+20)*7.6;   // −20℃ → 455、25℃ → 113
function scales2({lev=17,hi17=0,line17=0,band=0,bandK=0,labs=[[-13,260],[0,273],[17,290]],g=1}={}){
 let s=label('セ氏（℃）',XS.l,100,{size:26,color:C.ink,anchor:'middle',weight:700})+label('絶対温度（K）',XS.r,100,{size:26,color:TC,anchor:'middle',weight:700});
 for(const x of [XS.l,XS.r])s+=thermo(x,yC(26),yC(-20),yC(-20)-yC(lev),{color:TC});
 for(let c=-20;c<=25;c+=5){s+=line(XS.l+14,yC(c),XS.l+30,yC(c),{color:C.dim,w:2})+line(XS.r-30,yC(c),XS.r-14,yC(c),{color:C.dim,w:2});}
 for(const [c,k] of labs){const h=c===17&&hi17>.5;
  s+=line(XS.l+14,yC(c),XS.l+36,yC(c),{color:h?C.hi:C.ink,w:3})+label(`${c<0?'−'+(-c):c}℃`,XS.l-26,yC(c)+9,{size:26,color:h?C.hi:C.ink,anchor:'end',weight:700});
  s+=line(XS.r-36,yC(c),XS.r-14,yC(c),{color:h?C.hi:TC,w:3})+label(`${k} K`,XS.r+28,yC(c)+9,{size:26,color:h?C.hi:TC,weight:700});}
 if(line17)s+=fade(line17,line(XS.l+42,yC(17),XS.r-42,yC(17),{color:C.hi,w:3,dash:'8 7'}));
 if(band)s+=fade(band,rect(XS.l+40,yC(17),60,yC(-13)-yC(17),{fill:C.hi,fo:.35,stroke:C.hi,sw:2,rx:4})+label('30 目盛り',XS.l+70,yC(-13)+34,{size:22,color:C.hi,anchor:'middle',weight:700}));
 if(bandK)s+=fade(bandK,rect(XS.r-100,yC(17),60,yC(-13)-yC(17),{fill:C.hi,fo:.35,stroke:C.hi,sw:2,rx:4})+label('30 K',XS.r-70,yC(-13)+34,{size:26,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
// まとめ：単元動画のコップと浴槽
function cupBath(t,{g=1}={}){
 let s=beaker(230,440,110,140,{water:HOT,fo:.3,text:'コップ 1杯'})+steam(230,300,t);
 s+=rect(480,300,620,140,{fill:HOT,fo:.3,stroke:'none',rx:4})+`<path d="M470 260 L470 440 L1110 440 L1110 260" fill="none" stroke="${C.dim}" stroke-width="3"/>`+label('浴槽 1杯',790,476,{size:26,color:C.ink,anchor:'middle',weight:700})+steam(790,280,t);
 return fade(g,s);
}

export const qxHsTHeat1Diagrams={
 // ================= 問題アニメ：出題中（小問1・2）=================
 // 0〜2 s：やかん（3.0 kg）とコップ（300 g）が並ぶ。2〜4 s：温度計を差し、黄緑の液が同時に上がって 50℃ で止まる。約5 s で静止。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx)||p*5;
  return vessels({g:seg(t,0,.6),mass:seg(t,.6,1.2),ins:seg(t,2,2.6),rise:seg(t,2.6,3.9),t50:seg(t,3.9,4.3)});
 },
 // ================= 問題アニメ：小問3（暗転して空の絵、約3 s で静止）=================
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx)||p*3;
  return skies({g:seg(t,.2,1.2),tags:seg(t,1.4,2.2)});
 },
 // ================= S1 小問1：1個あたりと合計 =================
 // 1. 出題中の図で始める。求めるもの
 [K+'goal1']:(p)=>vessels()+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 温度＝1個あたりの激しさの目安（定義）。「1個あたり」を黄で光らせる
 [K+'def']:(p,ctx)=>{
  const h=seg(p,at(ctx,'いっこ'),at(ctx,'いっこ')+.08);
  let s=vessels({dimTh:0});
  const lab=`<tspan fill="${TC}">温度 ＝ </tspan><tspan fill="${h>.5?C.hi:TC}">1個あたり</tspan><tspan fill="${TC}">の 激しさの 目安</tspan>`;
  s+=card(420,92,540,64,`<text x="690" y="135" font-size="30" font-weight="700" text-anchor="middle">${lab}</text>`,seg(p,.05,.18),TC);
  s+=kindTag('定義',1030,125,{g:seg(p,.15,.28)});
  return s+goalTag(G1);
 },
 // 3. 50℃ で2本の温度計を光らせる。丸窓（拡大）の分子の点は、速いものも遅いものもある（尾の長さが違う）。
 //    下の矢印は「平均の 激しさ」（2つの窓で同じ長さ）。2文目で「分子ごとに 速さは ばらばら」
 [K+'same']:(p,ctx)=>{
  const t=cueT(ctx),h=seg(p,at(ctx,'ごじゅう'),at(ctx,'ごじゅう')+.06)*(1-seg(p,.6,.7));
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=vessels({hi:h,mass:1-seg(p,.25,.35)});
  const w=seg(p,.3,.42);
  s+=link(PK.x+60,PK.gy-80,LK,w)+windowAt(LK,NW,t,{g:w,seed:11});
  s+=link(PC.x+40,PC.gy-60,LCP,w)+windowAt(LCP,NW,t,{g:w,seed:12});
  s+=speedArrow(LK,seg(p,.42,.52))+speedArrow(LCP,seg(p,.42,.52));
  s+=card(640,90,380,56,label('分子ごとに 速さは ばらばら',830,128,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,b,b+.06),C.dim);
  return s+goalTag(G1);
 },
 // 4. 分子の数：3000 g ÷ 300 g ＝ 10。やかんの丸窓の点を増やす
 [K+'count']:(p,ctx)=>{
  const t=tAt(ctx,K+'same')+0,grow=seg(p,.55,.75);
  let s=vessels({dimTh:1,mass:0});
  s+=link(PK.x+60,PK.gy-80,LK)+windowAt(LK,NW,t,{seed:11,extra:grow,nExtra:10*NW});
  s+=link(PC.x+40,PC.gy-60,LCP)+windowAt(LCP,NW,t,{seed:12});
  s+=card(400,90,420,64,T2('3000\\ \\mathrm{g}\\div 300\\ \\mathrm{g}=10',610,122,{size:34,auto:false}),seg(p,.3,.42),C.ink);
  s+=card(LK.x-75,LK.y+LK.R+10,150,52,label('約10倍',LK.x,LK.y+LK.R+46,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.75,.85),C.hi);
  s+=note('（点の数は 模式）',LK.x,LK.y+LK.R+92,{g:seg(p,.75,.85)});
  return s+goalTag(G1);
 },
 // 5. 点が橙の棒になって積み上がる。やかん側はコップ側の約10倍
 [K+'total']:(p,ctx)=>{
  const t=tAt(ctx,K+'same'),o=seg(p,.05,.2),W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=vessels({dimTh:1,mass:0});
  s+=fade(1-o,link(PK.x+60,PK.gy-80,LK)+windowAt(LK,10*NW,t,{seed:11})+link(PC.x+40,PC.gy-60,LCP)+windowAt(LCP,NW,t,{seed:12}));
  const grow=seg(p,.18,b);
  s+=stack(LK.x,450,10,{g:o,grow})+stack(LCP.x,450,1,{g:o,grow:clamp(grow*10)});
  s+=fade(o,label('やかんの 合計',LK.x,488,{size:24,color:EC,anchor:'middle',weight:700})+label('コップの 合計',LCP.x,488,{size:24,color:EC,anchor:'middle',weight:700}));
  s+=note('（棒 1つ ＝ 1個ぶん）',LCP.x,400,{g:o});
  s+=card(720,110,400,64,label('合計：やかんが 約10倍',920,152,{size:30,color:EC,anchor:'middle',weight:700}),seg(p,b,b+.06),EC);
  return s+goalTag(G1);
 },
 // 6. 小問1 の答え C
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx);
  let s=vessels({dimTh:1,mass:0})+stack(LK.x,450,10)+stack(LCP.x,450,1);
  s+=label('やかんの 合計',LK.x,488,{size:24,color:EC,anchor:'middle',weight:700})+label('コップの 合計',LCP.x,488,{size:24,color:EC,anchor:'middle',weight:700});
  s+=card(720,110,400,64,label('合計：やかんが 約10倍',920,152,{size:30,color:EC,anchor:'middle',weight:700}),1,EC);
  return s+goalTag(G1)+A1(seg(p,W[0][1]-.12,W[0][1]-.04));
 },
 // 7. 誤答 A・B（1枚ずつ）
 [K+'wrongAB']:(p,ctx)=>{
  const b=at(ctx,'ビーは');
  let s=fade(.3,vessels({dimTh:1,mass:0})+stack(LK.x,450,10)+stack(LCP.x,450,1));
  s+=wrongSeq(p,ctx,[['A','激しさも 合計も 約10倍','1個あたりと 合計を 混同'],['B','激しさも 合計も 同じ','分子の 数の 違いを 無視']],{win:[[0,b],[b,1]],opts:{y:300}});
  return s+goalTag(G1)+A1(1);
 },
 // 8. 誤答 D
 [K+'wrongD']:(p)=>{
  let s=fade(.3,vessels({dimTh:1,mass:0})+stack(LK.x,450,10)+stack(LCP.x,450,1));
  s+=wrongCard('D','激しさは コップが 約10倍','同じ 50℃ なら 平均の 激しさは 同じ',{y:300,g:seg(p,.02,.08)});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2：理由 =================
 // 9. 求めるもの：小問1 の理由
 [K+'goal2']:(p)=>fade(.6,vessels())+goalTag(G2,{g:seg(p,.03,.15)}),
 // 10. 温度＝1個あたり（黄緑）と 合計＝1個ぶん×個数（橙）を左右に並べる。答え A
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=fade(1-seg(p,b-.03,b+.03),fade(.6,vessels()));
  const L=seg(p,b,b+.06),R=seg(p,at(ctx,'ごうけいは'),at(ctx,'ごうけいは')+.06);
  s+=card(80,100,500,220,label('温度 ＝ 1個あたり',330,150,{size:32,color:TC,anchor:'middle',weight:700})+molBox({x:270,y:180,w:120,h:120,n:1,dist:150*cueT(ctx),speed:150,seed:5,r:9,color:HOT,frame:true}),L,TC);
  s+=card(620,100,500,220,label('合計 ＝ 1個ぶん × 個数',870,150,{size:32,color:EC,anchor:'middle',weight:700})+stack(870,300,3),R,EC);
  return s+goalTag(G2)+A2(seg(p,W[0][1]-.12,W[0][1]-.04));
 },
 // 11. 誤答 B・D（1枚ずつ）
 [K+'wrongBD']:(p,ctx)=>{
  const b=at(ctx,'ディーは');
  let s=fade(.35,card(80,100,500,220,label('温度 ＝ 1個あたり',330,150,{size:32,color:TC,anchor:'middle',weight:700}),1,TC)+card(620,100,500,220,label('合計 ＝ 1個ぶん × 個数',870,150,{size:32,color:EC,anchor:'middle',weight:700})+stack(870,300,3),1,EC));
  s+=wrongSeq(p,ctx,[['B','温度 ＝ 合計','温度は 合計では ない'],['D','質量が 大きいほど 激しい','同じ 温度なら 平均の 激しさは 同じ']],{win:[[0,b],[b,1]],opts:{y:345}});
  return s+goalTag(G2)+A2(1);
 },
 // 12. 誤答 C。やかんの中の橙の棒の「熱」に ×、「内部エネルギー」に ○
 [K+'wrongC']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=kettle(250,460)+stack(250,440,5,{bw:30,bh:18});
  const x1=fade(seg(p,.15,.25),label('熱',560,250,{size:40,color:EC,weight:700})+line(550,215,610,260,{color:BAD,w:6})+line(610,215,550,260,{color:BAD,w:6}));
  s+=fade(1-seg(p,b,b+.05)*.6,x1);
  s+=fade(seg(p,b+.02,b+.08),label('内部エネルギー',575,330,{size:36,color:EC,weight:700})+ring(545,318,22,{color:OK,w:5}));
  s+=wrongCard('C','熱を たくさん 持つ','ためているのは 内部エネルギー',{x:640,y:110,w:520,g:seg(p,.03,.1)});
  return s+goalTag(G2)+A2(1);
 },
 // 13. 熱＝温度差によって移る途中のエネルギー（定義）。「移る途中」で矢印を黄で光らせる
 [K+'heat']:(p,ctx)=>{
  const h=seg(p,at(ctx,'うつる'),at(ctx,'うつる')+.06);
  let s=rect(120,180,260,180,{fill:HOT,fo:.3,stroke:HOT,sw:2,rx:12})+label('高温の 物',250,282,{size:32,color:HOT,anchor:'middle',weight:700});
  s+=rect(820,180,260,180,{fill:COLD,fo:.3,stroke:COLD,sw:2,rx:12})+label('低温の 物',950,282,{size:32,color:COLD,anchor:'middle',weight:700});
  const u=(cueT(ctx)*.5)%1;
  s+=arrow(410,270,790,270,{color:h>.5?C.hi:EC,w:10+4*h,head:28,g:seg(p,.05,.15)});
  s+=fade(seg(p,.05,.15),dot(430+340*u,270,10,h>.5?C.hi:EC));
  s+=fade(seg(p,.05,.15),label('熱',600,240,{size:34,color:EC,anchor:'middle',weight:700}));
  s+=fade(h,label('移る 途中',600,330,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=kindTag('定義',600,430,{g:seg(p,.1,.2)});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3：絶対温度と温度の差 =================
 // 14. 暗転して切り替え。空の絵と気温の札
 [K+'goal3']:(p)=>skies()+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 2本の温度計。T＝セ氏の数値＋273 → 17 から 290 へ点線、17＋273＝290
 [K+'abs']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=scales2({hi17:seg(p,b,b+.04),line17:seg(p,b+.04,b+.12)});
  s+=card(760,110,410,110,T2(`${Tt}=`,820,170,{size:44,anchor:'start'})+label('セ氏の 数値 ＋ 273',902,180,{size:26,color:C.ink,weight:700}),seg(p,.05,.15),TC);
  s+=note('（目盛りの 幅は 同じ）',965,250,{g:seg(p,.2,.3)});
  s+=card(760,290,410,90,T2('17+273=290\\ \\mathrm{K}',965,333,{size:38,auto:false}),seg(p,b+.1,b+.18),C.hi);
  return s+goalTag(G3);
 },
 // 16. −13 から 17 までの 30 目盛りを黄で塗り、右の 260〜290 にも写す。−(−13) を光らせる
 [K+'diff']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,hl=seg(p,.12,.2);
  let s=scales2({band:seg(p,.05,.15),bandK:seg(p,b,b+.08)});
  s+=card(760,110,410,110,T2(`17{\\color{${hl>.5?C.hi:C.ink}}-(-13)}=30`,965,165,{size:40,auto:false}),seg(p,.05,.12),C.hi);
  s+=card(760,290,410,90,label('K でも 30 K',965,347,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,b+.06,b+.14),C.hi);
  return s+goalTag(G3);
 },
 // 17. 小問3 の答え D
 [K+'ans3']:(p)=>{
  let s=scales2({band:1,bandK:1,line17:1});
  s+=card(760,110,410,110,T2('17+273=290\\ \\mathrm{K}',965,165,{size:38,auto:false}),1,C.hi);
  s+=card(760,290,410,90,label('上がり幅 30 K',965,347,{size:34,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  return s+goalTag(G3)+A3(seg(p,.4,.55));
 },
 // 18. 誤答 A。差の式で 2つの 273 に打ち消し線
 [K+'wrongA']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,k=seg(p,b+.08,b+.16);
  let s=wrongCard('A','303 K','差にも 273 を 足した',{y:110,g:seg(p,.03,.1)});
  const e0='290-260=(17+273)-(-13+273)=30',e1='290-260=(17+\\cancel{273})-(-13+\\cancel{273})=30';
  s+=card(100,290,1000,110,T2(k>.5?e1:e0,600,345,{size:38,auto:false}),seg(p,b,b+.06),C.hi);
  s+=fade(k,label('0 の 位置の ずれは 引き算で 消える',600,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G3)+A3(1);
 },
 // 19. 誤答 B・C（1枚ずつ）
 [K+'wrongBC']:(p,ctx)=>{
  const b=at(ctx,'スィーは');
  let s=fade(.35,card(100,290,1000,110,T2('290-260=(17+\\cancel{273})-(-13+\\cancel{273})=30',600,345,{size:38,auto:false}),1,C.hi));
  s+=wrongSeq(p,ctx,[['B','260 K','朝の 温度を 答えた'],['C','4 K','−13 の − を 落とした',{mid:'17-13=4',midSize:32}]],{win:[[0,b],[b,1]],opts:{y:96}});
  return s+goalTag(G3)+A3(1);
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=cupBath(t,{g:seg(p,.02,.12)});
  s+=card(120,100,460,64,label('温度：1個あたりの 激しさ',350,142,{size:28,color:TC,anchor:'middle',weight:700}),seg(p,.1,.2),TC);
  s+=card(620,100,460,64,label('合計：分子の 数にも よる',850,142,{size:28,color:EC,anchor:'middle',weight:700}),seg(p,.3,.4),EC);
  s+=answerRow([[1,'C',''],[2,'A',''],[3,'D','']],{g:seg(p,.6,.7)});
  return s;
 },
};
