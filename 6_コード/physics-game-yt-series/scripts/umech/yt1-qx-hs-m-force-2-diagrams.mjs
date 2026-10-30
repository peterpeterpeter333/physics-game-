// 問題編 解説「上がるエレベーターの荷物」(ys-qx-hs-m-force-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/106_力と運動方程式.md の q-hs-m-force-2（解説 17 行）。
// 色（単元動画と同じ）：力 F（mg・垂直抗力 N）緑の太い矢印、加速度 a 赤、速度 v 紫、強調 黄。上向きが正。
// エレベーターは箱を画面に止めて描き、昇降路の壁の目印が下へ流れることで「上がっている」ことを示す。
// 力の矢印の長さは 1 N ＝ 2.6 px（mg 29.4 N、N 35.4 N の差 6.0 N が見える長さ）。出題中の図では N と mg を同じ長さの「？」にする。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。答えの札は右上に積む（y＝8, 70, 132）。
import {C,seg,lin,fade,label,line,rect,arrow,tex,clamp} from './anim.mjs';
import {FA,T2,MG,NN} from './yt1-hs-m-force-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,pauseBadge,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-force-2:';
const G1='加速中の垂直抗力 N',G2='等速中の垂直抗力 N',G3='N＝mg になる理由';
const ATAG=[['B','35.4 N'],['D','29.4 N'],['A','']];
const ans=(n,g=1)=>ATAG.slice(0,n).map(([l,v],i)=>answerTag(i+1,l,v,{y:8+62*i,g:i===n-1?g:1})).join('');
function at(ctx,marker,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),m=marker.replace(/\s/g,''),i=r.indexOf(m);
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}
const PN=2.6;                      // px per newton
const L0=29.4*PN;                  // mg の長さ（出題中の図の「？」の矢印もこの長さ）
// ---- one elevator panel, drawn at canonical coordinates (x 0 ＝ centre, y 0 ＝ top), placed by translate/scale --------
// mode: 'acc'（はじめ、赤の加速度）・'vel'（その後、紫の速度）・''（動きの表示なし）。s＝昇降路の目印のずれ（px、上がった距離）
function panel({mode='',s=0,title='',forces=1,nLen=L0,nLab='？',mgLab='？',nHi=0,mgHi=0,sel=1,selHi=0,boxDim=0,accHi=0,a0=0,plus=0,plusHi=0,diffHi=0,mgGlow=0,ts=1}={}){
 let o='';const z=n=>n*ts;
 // shaft walls with markers flowing down
 o+=line(-135,40,-135,420,{color:C.faint,w:3})+line(135,40,135,420,{color:C.faint,w:3});
 const off=((s%70)+70)%70;
 for(let y=40+off-70;y<420;y+=70){if(y<40)continue;o+=line(-135,y,-115,y,{color:C.dim,w:3})+line(115,y,135,y,{color:C.dim,w:3});}
 let box=line(0,40,0,70,{color:C.dim,w:3})+rect(-105,70,210,290,{fill:'#1a2540',fo:1,stroke:C.dim,sw:3,rx:6})+line(-105,360,105,360,{color:C.dim,w:5});
 o+=fade(1-.6*boxDim,box);
 o+=rect(-60,290,120,70,{fill:'#c9a46a',fo:.55,stroke:'#c9a46a',rx:6})+label('3.0 kg',0,334,{size:z(26),color:C.ink,anchor:'middle',weight:700});
 if(sel)o+=fade(sel,`<rect x="-76" y="274" width="152" height="102" rx="14" fill="none" stroke="${selHi>.5?C.hi:C.dim}" stroke-width="${selHi>.5?3.5:2.5}" stroke-dasharray="9 8"/>`);
 if(forces){
  const nTop=290-nLen;
  if(nHi)o+=fade(nHi,line(-30,290,-30,nTop,{color:C.hi,w:20}));
  if(mgHi)o+=fade(mgHi,line(30,360,30,360+L0,{color:C.hi,w:20}));
  o+=FA(-30,290,-30,nTop,{g:forces,w:8,head:20});
  o+=FA(30,360,30,360+L0,{g:forces,w:8,head:20});
  if(diffHi)o+=fade(diffHi,line(-30,290-L0,-30,nTop+14,{color:C.hi,w:14})+label('6.0 N',14,nTop+18,{size:z(24),color:C.hi,weight:700}));
  o+=fade(forces,label(`N ${nLab}`,-46,nTop+20,{size:z(26),color:C.F,anchor:'end',weight:700}));
  o+=fade(forces,label(`mg ${mgLab}`,46,360+L0/2+10,{size:z(26),color:mgGlow>.5?C.hi:C.F,weight:700}));
 }
 const ax=-205;
 if(mode==='acc'){
  if(accHi)o+=fade(accHi,line(ax,290,ax,190,{color:C.hi,w:18}));
  o+=arrow(ax,290,ax,190,{color:C.a,w:6,head:18})+label('2.0 m/s²',ax,326,{size:z(24),color:C.a,anchor:'middle',weight:700});
 }
 if(mode==='vel'){
  o+=arrow(ax,290,ax,190,{color:C.v,w:6,head:18})+label('2.0 m/s',ax,326,{size:z(24),color:C.v,anchor:'middle',weight:700});
  if(a0)o+=fade(a0,label('a＝0',ax,166,{size:z(28),color:C.a,anchor:'middle',weight:700}));
 }
 if(plus){
  if(plusHi)o+=fade(plusHi,line(180,270,180,190,{color:C.hi,w:16}));
  o+=fade(plus,arrow(180,270,180,190,{color:C.ink,w:4,head:14})+label('＋',180,304,{size:z(28),color:C.ink,anchor:'middle',weight:700}));
 }
 if(title)o+=label(title,0,28,{size:z(28),color:C.ink,anchor:'middle',weight:700});
 return o;
}
const place=(cx,top,k,svg,g=1)=>fade(g,`<g transform="translate(${cx} ${top}) scale(${k})">${svg}</g>`);
// 加速：s＝½·a·t²（目印のずれ、見た目のための縮尺）、等速：s＝v·t
const sAcc=t=>.5*60*t*t,sVel=t=>60*t;
// 出題中の図（時刻 t 秒、0〜6）
function setupAt(t){
 const one=1-seg(t,3,3.5),two=seg(t,3.2,3.7),run=clamp(t-3.6,0,1.9);
 let s=place(600,70,1,panel({forces:seg(t,2,2.6),plus:seg(t,.6,1.2)}),seg(t,0,.6)*one);
 s+=place(330,70,1,panel({mode:'acc',s:sAcc(run),title:'はじめ',plus:1}),two);
 s+=place(870,70,1,panel({mode:'vel',s:sVel(run),title:'その後',plus:1}),two);
 s+=pauseBadge({g:seg(t,5.5,5.8),x:600,y:86});
 return s;
}
// 式の札（右）
const eqCard=(inner,g=1,{x=620,y=140,w=560,h=230,col=C.F}={})=>card(x,y,w,h,`<g transform="translate(0 44)">${inner}</g>`,g,col);
const R=(src,y,o={})=>T2(src,900,y,{size:44,...o});
const WO={x:610,w:570,y:345};   // 誤答カードは右側（左の図と重ねない）

export const qxHsMForce2Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、6 秒＋静止）=================
 // 0〜2 s：エレベーターの箱と荷物（3.0 kg）、点線の囲み、上向きの「＋」。2〜3 s：下向き mg・上向き N を同じ長さの「？」で。
 // 3〜6 s：左右に分け、左「はじめ」赤の加速度 2.0 m/s²、右「その後」紫の速度 2.0 m/s。昇降路の目印が流れて上がる。そろったら一時停止。
 [K+'q0']:(p)=>setupAt(6*p),
 // ================= S1 力を選ぶ =================
 // 1. 出題中の図（左右2場面）。上向きの「＋」を黄で光らせる
 [K+'setup']:(p,ctx)=>{
  const t=Math.min(5.9,3.6+cueT(ctx)),run=clamp(t-3.6,0,1.9),hi=seg(p,.35,.45)*(.6+.4*Math.sin(cueT(ctx)*5)**2);
  let s=place(330,70,1,panel({mode:'acc',s:sAcc(run),title:'はじめ',plus:1,plusHi:hi}));
  s+=place(870,70,1,panel({mode:'vel',s:sVel(run),title:'その後',plus:1,plusHi:hi}));
  return s+pauseBadge({g:seg(t,5.5,5.8),x:600,y:86});
 },
 // 2a. 荷物だけを選ぶ（囲みを黄、箱を薄く）。「mg」「垂直抗力 N」で矢印を順に光らせる
 [K+'forces']:(p,ctx)=>{
  const a=at(ctx,'じゅうりょくエムジー',.4),b=at(ctx,'すいちょく',.6);
  let s=place(600,70,1,panel({selHi:seg(p,.04,.12),boxDim:seg(p,.04,.15),plus:1,mgHi:seg(p,a,a+.05)*(1-seg(p,b,b+.05)),nHi:seg(p,b,b+.05)}));
  s+=fade(seg(p,.04,.15),label('荷物だけを 選ぶ',840,200,{size:28,color:C.hi,weight:700}));
  return s;
 },
 // 2b. mg＝3.0×9.8＝29.4 N。mg の「？」が 29.4 N に
 [K+'mg']:(p)=>{
  const v=seg(p,.55,.62);
  let s=place(600,70,1,panel({boxDim:1,selHi:1,plus:1,mgLab:v>.5?'29.4 N':'？',mgHi:seg(p,.05,.15)*(1-seg(p,.7,.8))}));
  s+=card(800,190,380,74,T2(`${MG}=3.0\\times 9.8=29.4\\ \\mathrm{N}`,990,236,{size:32}),seg(p,.1,.2),C.F);
  return s;
 },
 // ================= S2 小問1：加速中 =================
 // 3. 左の場面（はじめ）を大きく。求めるもの。赤の加速度の矢印を黄で縁取る
 [K+'goal1']:(p)=>place(320,70,1,panel({mode:'acc',s:0,title:'はじめ',plus:1,boxDim:.5,mgLab:'29.4 N',accHi:seg(p,.35,.5)}))+goalTag(G1,{g:seg(p,.03,.15)}),
 // 4. ma＝F の F は合力 → N＋(−mg)＝ma → N−mg＝ma
 [K+'eq']:(p,ctx)=>{
  const a=at(ctx,'ごうりょく',.45),b=at(ctx,'エヌマイナス',.7);
  let s=place(320,70,1,panel({mode:'acc',title:'はじめ',plus:1,boxDim:.5,mgLab:'29.4 N'}));
  let o=R('ma=F',170)+fade(seg(p,a,a+.05),label('合力',990,226,{size:26,color:C.F,anchor:'middle',weight:700})+line(990,198,990,206,{color:C.F,w:2}));
  o+=fade(seg(p,a+.08,a+.14)*(1-seg(p,b-.02,b+.02)),R(`${NN}+(-${MG})=ma`,282,{size:40}));
  o+=fade(seg(p,b,b+.05),R(`${NN}-${MG}=ma`,282,{size:44}));
  s+=eqCard(o,seg(p,.03,.1));
  return s+goalTag(G1);
 },
 // 5. N＝mg＋ma（−mg を右辺へ）→ 29.4＋3.0×2.0 → 35.4 N。N の矢印が 6.0 N 分伸びる。答え B
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,c=at(ctx,'さんじゅうご',.8),d=at(ctx,'しょうもんいちの',.85);
  const grow=seg(p,c,c+.06),nLen=L0+6*PN*grow;
  let s=place(320,70,1,panel({mode:'acc',title:'はじめ',plus:1,boxDim:.5,mgLab:'29.4 N',nLen,nLab:grow>.9?'35.4 N':'？'}));
  let o=fade(1-seg(p,.12,.16),R(`${NN}-${MG}=ma`,160));
  o+=fade(seg(p,.14,.2),R(`${NN}=${MG}+ma`,160));
  o+=fade(seg(p,.05,.12)*(1-seg(p,b-.04,b)),label('−mg を 右辺へ',900,230,{size:26,color:C.dim,anchor:'middle',weight:700}));
  o+=fade(seg(p,b+.02,b+.08),R('=29.4+3.0\\times 2.0',238,{size:40}));
  o+=fade(seg(p,c,c+.05),R('=35.4\\ \\mathrm{N}',300,{size:44}));
  s+=eqCard(o,1,{h:250});
  return s+goalTag(G1)+ans(1,seg(p,d,d+.05));
 },
 // 6. 誤答 A（29.4 N）、誤答 C（23.4 N）を1枚ずつ
 [K+'wrongAC']:(p,ctx)=>{
  const b=at(ctx,'スィーの',.5);
  let s=place(320,70,1,panel({mode:'acc',title:'はじめ',plus:1,boxDim:.5,mgLab:'29.4 N',nLen:L0+6*PN,nLab:'35.4 N'}));
  s+=eqCard(R(`${NN}=${MG}+ma=35.4\\ \\mathrm{N}`,180,{size:38}),1,{h:150});
  s+=wrongSeq(p,ctx,[['A','29.4 N','加速中なのに N＝mg と した'],['C','23.4 N','mg−ma と 符号を 逆に した']],{win:[[0,b],[b,1]],opts:WO});
  return s+goalTag(G1)+ans(1);
 },
 // 7. 誤答 D（6.0 N）。N と mg の差の部分を黄で
 [K+'wrongD']:(p)=>{
  let s=place(320,70,1,panel({mode:'acc',title:'はじめ',plus:1,boxDim:.5,mgLab:'29.4 N',nLen:L0+6*PN,nLab:'35.4 N',diffHi:seg(p,.15,.3)}));
  s+=eqCard(R(`${NN}=${MG}+ma=35.4\\ \\mathrm{N}`,180,{size:38}),1,{h:150});
  s+=wrongCard('D','6.0 N','合力 ma＝6.0 を N と した',{...WO,g:seg(p,.03,.08)});
  return s+goalTag(G1)+ans(1);
 },
 // ================= S3 小問2：等速中 =================
 // 8. 右の場面（その後）を大きく。求めるもの
 [K+'goal2']:(p,ctx)=>place(320,70,1,panel({mode:'vel',s:sVel(cueT(ctx)),title:'その後',plus:1,boxDim:.5,mgLab:'29.4 N'}))+goalTag(G2,{g:seg(p,.03,.15)})+ans(1),
 // 9.（PQ-051）上向きに一定の速さ → 速度は変わらない → a＝0。紫の矢印は同じ長さのまま、荷物が上がっていく
 [K+'a0']:(p,ctx)=>{
  const t=cueT(ctx)+8;
  let s=place(320,70,1,panel({mode:'vel',s:sVel(t),title:'その後',plus:1,boxDim:.5,mgLab:'29.4 N',a0:seg(p,.55,.65)}));
  s+=fade(seg(p,.1,.2),label('速度の 矢印は 上向き・同じ 長さの まま',620,200,{size:28,color:C.v,weight:700}));
  return s+goalTag(G2)+ans(1);
 },
 // 10. N−mg＝ma の ma に 0 → N＝mg。N と mg の矢印が同じ長さに、29.4 N。答え D
 [K+'ans2']:(p,ctx)=>{
  const t=cueT(ctx)+16,c=at(ctx,'エヌは',.6),d=at(ctx,'しょうもんにの',.85),eq=seg(p,c,c+.05);
  let s=place(320,70,1,panel({mode:'vel',s:sVel(t),title:'その後',plus:1,boxDim:.5,mgLab:'29.4 N',a0:1,nLen:L0,nLab:eq>.5?'29.4 N':'？'}));
  let o=fade(1-seg(p,.12,.16),R(`${NN}-${MG}=ma`,160));
  o+=fade(seg(p,.14,.2),R(`${NN}-${MG}=0`,160));
  o+=fade(seg(p,c,c+.05),R(`${NN}=${MG}=29.4\\ \\mathrm{N}`,250,{size:40}));
  s+=eqCard(o,1,{h:200});
  return s+goalTag(G2)+ans(2,seg(p,d,d+.05));
 },
 // 11. 誤答 A（35.4 N）：速度 2.0 m/s を加速度 2.0 m/s² として使った。単位の違いを黄で
 [K+'wrongA2']:(p)=>{
  let s=place(320,70,1,panel({mode:'vel',title:'その後',plus:1,boxDim:.5,mgLab:'29.4 N',a0:1,nLab:'29.4 N'}));
  s+=card(620,150,560,150,label('2.0 m/s',760,210,{size:34,color:C.v,anchor:'middle',weight:700})+label('≠',900,210,{size:34,color:C.ink,anchor:'middle',weight:700})+label('2.0 m/s²',1040,210,{size:34,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('速度',760,264,{size:26,color:C.hi,anchor:'middle',weight:700})+label('加速度',1040,264,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.15),C.dim);
  s+=wrongCard('A','35.4 N','速度を 加速度として 使った',{...WO,g:seg(p,.03,.08)});
  return s+goalTag(G2)+ans(2);
 },
 // 12. 誤答 B（23.4 N）、誤答 C（6.0 N）を1枚ずつ
 [K+'wrongBC2']:(p,ctx)=>{
  let s=place(320,70,1,panel({mode:'vel',title:'その後',plus:1,boxDim:.5,mgLab:'29.4 N',a0:1,nLab:'29.4 N'}));
  s+=eqCard(R(`${NN}=${MG}=29.4\\ \\mathrm{N}`,180,{size:38}),1,{h:150});
  s+=wrongSeq(p,ctx,[['B','23.4 N','上に 動くと N が 減る と した'],['C','6.0 N','m×v（単位 kg·m/s）']],{opts:WO});
  return s+goalTag(G2)+ans(2);
 },
 // ================= S4 小問3：理由 =================
 // 13. 求めるもの：N＝mg になる理由
 [K+'goal3']:(p)=>place(320,70,1,panel({mode:'vel',title:'その後',plus:1,boxDim:.5,mgLab:'29.4 N',a0:1,nLab:'29.4 N'}))+goalTag(G3,{g:seg(p,.03,.15)})+ans(2),
 // 14. 「a＝0 → 縦の合力 0 → N＝mg」を矢印に線で結ぶ。答え A
 [K+'ans3']:(p,ctx)=>{
  const d=at(ctx,'しょうもんさんの',.75);
  let s=place(320,70,1,panel({mode:'vel',title:'その後',plus:1,boxDim:.5,mgLab:'29.4 N',a0:1,nLab:'29.4 N',nHi:seg(p,.35,.5)*.6,mgHi:seg(p,.35,.5)*.6}));
  const rows=[['a＝0',C.a,.05],['縦の 合力 0',C.F,.2],['N＝mg',C.F,.35]];
  rows.forEach(([t,col,a],i)=>{s+=card(640,190+i*90,300,64,label(t,790,232+i*90,{size:30,color:col,anchor:'middle',weight:700}),seg(p,a,a+.08),col);
   if(i<2)s+=fade(seg(p,a+.1,a+.16),label('↓',790,272+i*90,{size:26,color:C.dim,anchor:'middle'}));});
  s+=fade(seg(p,.4,.5),line(640,402,330,330,{color:C.hi,w:2,dash:'6 6'})+line(640,222,140,240,{color:C.hi,w:2,dash:'6 6'}));
  return s+goalTag(G3)+ans(3,seg(p,d,d+.05));
 },
 // 15. 誤答 B（大きな上向きの力が要る）
 [K+'wrongB3']:(p)=>{
  let s=place(320,70,1,panel({mode:'vel',title:'その後',plus:1,boxDim:.5,mgLab:'29.4 N',a0:1,nLab:'29.4 N'}));
  s+=card(640,200,300,64,label('N＝mg',790,242,{size:30,color:C.F,anchor:'middle',weight:700}),1,C.F);
  s+=wrongCard('B','大きな 上向きの 力が 要る','力が 決めるのは 速度ではなく 加速度',{...WO,g:seg(p,.03,.08)});
  return s+goalTag(G3)+ans(3);
 },
 // 16. 誤答 C（力がはたらかない）、誤答 D（重力が小さくなる）。mg の 29.4 N を黄で
 [K+'wrongCD3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,gl=seg(p,b+.05,b+.1);
  let s=place(320,70,1,panel({mode:'vel',title:'その後',plus:1,boxDim:.5,mgLab:'29.4 N',a0:1,nLab:'29.4 N',mgHi:gl*.7,mgGlow:gl}));
  s+=card(640,200,300,64,label('N＝mg',790,242,{size:30,color:C.F,anchor:'middle',weight:700}),1,C.F);
  s+=wrongSeq(p,ctx,[['C','力が はたらかない','2本の 力の 合力が 0'],['D','重力が 小さくなる','mg は 動き方に よらない']],{opts:WO});
  return s+goalTag(G3)+ans(3);
 },
 // ================= S5 まとめ =================
 // 左：N＞mg と赤の矢印、右：N＝mg と紫の矢印。式を矢印と線で結ぶ。「F＝合力」「N＝mg は a＝0 のとき」を黄で
 [K+'sum']:(p)=>{
  let s=place(250,100,.82,panel({ts:1.22,mode:'acc',title:'はじめ',sel:0,boxDim:.5,mgLab:'29.4',nLen:L0+6*PN,nLab:'35.4'}),seg(p,.02,.1));
  s+=place(1000,100,.82,panel({ts:1.22,mode:'vel',title:'その後',sel:0,boxDim:.5,mgLab:'29.4',nLab:'29.4'}),seg(p,.02,.1));
  s+=card(450,214,300,64,T2(`${NN}-${MG}=3.0\\times 2.0`,600,254,{size:28}),seg(p,.1,.18),C.a);
  s+=fade(seg(p,.1,.18),label('→ N＝35.4 N',600,312,{size:28,color:C.F,anchor:'middle',weight:700})+line(450,246,340,300,{color:C.dim,w:2,dash:'6 6'}));
  s+=card(450,336,300,64,T2(`${NN}-${MG}=0`,600,376,{size:30}),seg(p,.2,.28),C.v);
  s+=fade(seg(p,.2,.28),label('→ N＝29.4 N',600,434,{size:28,color:C.F,anchor:'middle',weight:700})+line(750,368,870,330,{color:C.dim,w:2,dash:'6 6'}));
  s+=fade(seg(p,.45,.55),label('F ＝ 合力',600,140,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.7),label('N＝mg は a＝0 の とき',600,494,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+answerRow([[1,'B','35.4 N'],[2,'D','29.4 N'],[3,'A','']]);
 },
};
