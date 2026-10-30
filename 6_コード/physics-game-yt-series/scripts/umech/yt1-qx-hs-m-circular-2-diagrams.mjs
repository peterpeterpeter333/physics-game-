// 問題編 解説「地球の半径の2倍を回る衛星」(ys-qx-hs-m-circular-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/109_円運動と万有引力.md の q-hs-m-circular-2（解説 18 行）。
// 地球（半径 R）と、中心から 2R の円軌道（大きさは比のとおり、R＝80 px）。地球の中心に固定した目盛りで見る。遠心力は使わない。
// 色（単元動画と同じ）：距離・半径 水色、速度 v 紫、加速度 a 赤、力（重力）緑、強調 黄。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-m-circular-1・2）の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp} from './anim.mjs';
import {earth,moon,arcPts} from './yt1-hs-m-circular-1-diagrams.mjs';
import {cannonScene,emScene,cross} from './yt1-hs-m-circular-2-diagrams.mjs';
import {FA} from './yt1-hs-m-force-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,pauseBadge,note,cueT,tAt,durOf,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-circular-2:';
const G1='2R での加速度の大きさ',G2='衛星の速さ v',G3='運動の正しい説明';
const A1=g=>answerTag(1,'C','2.45 m/s²',{g}),A2=g=>answerTag(2,'B','5.6×10³ m/s',{g}),A3=g=>answerTag(3,'D','',{g});
const V=`{\\color{${C.v}}v}`,A=`{\\color{${C.a}}a}`,Rr=`{\\color{${C.x}}r}`,RR=`{\\color{${C.x}}R}`,Ft=`{\\color{${C.F}}F}`;
const TF=(src,x,y,o={})=>tex(src,x,y,{size:40,auto:false,...o});
const RX=905;
const rcard=(y,h,inner,g=1,stroke=C.faint)=>card(620,y,570,h,inner,g,stroke);

// ---- 地球と軌道 -----------------------------------------------------------------------------------
export const E2={x:300,y:290,R:70};
const OR=2*E2.R;
const SP=(phi,r=OR)=>[E2.x+r*Math.cos(phi),E2.y-r*Math.sin(phi)];
const TU=phi=>[-Math.sin(phi),-Math.cos(phi)];
export function sat(x,y,s=1){return rect(x-13*s,y-9*s,26*s,18*s,{fill:'#c9d3e6',fo:1,stroke:'none',rx:3})+rect(x-34*s,y-6*s,18*s,12*s,{fill:'#4a7bd0',fo:1,stroke:'#9cc8ff',sw:1,rx:1})+rect(x+16*s,y-6*s,18*s,12*s,{fill:'#4a7bd0',fo:1,stroke:'#9cc8ff',sw:1,rx:1});}
// ruler：中心から左へ R・2R の目盛り。hiR／hi2R で光らせる、fadeR で R を薄く
function ruler({g=1,hiR=0,hi2R=0,fadeR=0}={}){
 const y=E2.y+0,x0=E2.x,x1=E2.x-E2.R,x2=E2.x-OR;
 let s=fade(g*(1-.6*fadeR),line(x0,y,x1,y,{color:hiR>.5?C.hi:C.x,w:3+3*hiR})+line(x1,y-8,x1,y+8,{color:C.x,w:3})+label('R',(x0+x1)/2,y-12,{size:26,color:hiR>.5?C.hi:C.x,anchor:'middle',weight:700}));
 s+=fade(g,line(x1,y,x2,y,{color:hi2R>.5?C.hi:C.x,w:3+3*hi2R,dash:'8 6'})+line(x2,y-8,x2,y+8,{color:C.x,w:3})+label('2R',x2-8,y-14,{size:26,color:hi2R>.5?C.hi:C.x,anchor:'middle',weight:700}));
 return s;
}
export function world({phi=Math.PI/4,g=1,sat1=1,vel=1,grav=1,gravHi=0,glab=0,labels=1,rul=1,hiR=0,hi2R=0,fadeR=0,orbitG=1,acc=0,velQ=0}={}){
 let s=fade(g*orbitG,ring(E2.x,E2.y,OR,{color:C.x,w:2.5,dash:'8 8'}));
 s+=fade(g,earth(E2.x,E2.y,E2.R));
 if(rul)s+=ruler({g:g*rul,hiR,hi2R,fadeR});
 if(labels)s+=fade(g*labels,label('R ＝ 6.4×10⁶ m',E2.x-150,OR+E2.y+32,{size:24,color:C.x,anchor:'middle',weight:700})+line(E2.x+20,E2.y+E2.R-4,E2.x+110,OR+E2.y+10,{color:C.a,w:1.5,dash:'4 5'})+label('地表 g ＝ 9.8 m/s²',E2.x+120,OR+E2.y+32,{size:24,color:C.a,anchor:'middle',weight:700}));
 if(sat1){
  const [x,y]=SP(phi),[ux,uy]=TU(phi);
  if(grav){const k=.42;
   if(gravHi)s+=fade(g*grav*gravHi,line(x,y,x+(E2.x-x)*k,y+(E2.y-y)*k,{color:C.hi,w:16,cap:'round',opacity:.45}));
   s+=FA(x,y,x+(E2.x-x)*k,y+(E2.y-y)*k,{g:g*grav,w:8,head:20});
   if(glab)s+=fade(g*glab*grav,label('地球の 重力だけ',x+24,y+46,{size:24,color:C.F,weight:700}));}
  if(acc)s+=arrow(x,y,x+(E2.x-x)*.12,y+(E2.y-y)*.12,{color:C.a,w:6,head:14,g:g*acc});
  if(vel)s+=arrow(x,y,x+100*ux,y+100*uy,{color:C.v,w:5,head:16,g:g*vel});
  if(velQ)s+=fade(g*velQ*vel,label('？',x+100*ux-14,y+100*uy-8,{size:34,color:C.v,anchor:'end',weight:700}));
  s+=fade(g,sat(x,y));
 }
 return s;
}
const PH=Math.PI/4;   // 衛星を止めて描く位置（右上）

export const qxHsMCircular2Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、6秒＋静止）=================
 // 0〜2 s：地球・半径 2R の水色の軌道・目盛り R・2R・g＝9.8・R＝6.4×10⁶ m。2〜5 s：衛星が回る（紫の速度の矢印は数値なし、緑の重力の矢印「地球の重力だけ」）。
 // 5〜6 s：右上で「映像を一時停止」。2R での加速度・v の数値・向心力の札・大砲の図は出さない。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx),u=clamp((t-2)/3),phi=-Math.PI/2+(PH+Math.PI/2+2*Math.PI)*(1-(1-u)**2);
  let s=world({phi,g:1,sat1:seg(t,1.6,2),vel:seg(t,2,2.4),grav:seg(t,2.2,2.6),glab:seg(t,2.4,2.8),labels:seg(t,.6,1.2),rul:seg(t,.3,.9),orbitG:seg(t,0,.6)});
  s+=rcard(130,250,label('人工衛星',RX,190,{size:28,color:C.ink,anchor:'middle',weight:700})+label('地球の 中心から 2R の 円軌道',RX,245,{size:28,color:C.x,anchor:'middle',weight:700})
   +label('速さは 一定',RX,300,{size:28,color:C.v,anchor:'middle',weight:700})+label('地球の 重力だけを 受ける',RX,350,{size:28,color:C.F,anchor:'middle',weight:700}),seg(t,1,1.6));
  s+=pauseBadge({g:seg(t,5.6,5.9),x:905,y:430});
  return s;
 },
 // ================= S1 小問1：2R での加速度 =================
 // 1. 出題中の図を再生。緑の重力の矢印を黄で縁取る
 [K+'setup']:(p,ctx)=>{
  const phi=PH-.25*Math.max(0,durOf(ctx,K+'setup')-cueT(ctx)-1);
  let s=world({phi,glab:1,gravHi:seg(p,.4,.55)});
  s+=rcard(130,250,label('人工衛星',RX,190,{size:28,color:C.ink,anchor:'middle',weight:700})+label('地球の 中心から 2R の 円軌道',RX,245,{size:28,color:C.x,anchor:'middle',weight:700})
   +label('速さは 一定',RX,300,{size:28,color:C.v,anchor:'middle',weight:700})+label('地球の 重力だけを 受ける',RX,350,{size:28,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=note('（動きは ゆっくり 描いています）',RX,505,{g:seg(p,.2,.3)});
  return s;
 },
 // 2. 求めるもの：2R での加速度の大きさ。衛星の位置に黄の丸
 [K+'goal1']:(p,ctx)=>{
  const ph=PH;
  let s=world({phi:ph,glab:0});
  const [x,y]=SP(ph);
  s+=fade(seg(p,.2,.35),ring(x,y,40,{color:C.hi,w:4}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 万有引力は距離の2乗に反比例 → 距離2倍で 1/4
 [K+'inv']:(p)=>{
  let s=world({phi:PH,glab:0,labels:0,hiR:seg(p,.45,.55),hi2R:seg(p,.55,.65)});
  s+=rcard(90,150,TF(Ft+'=\\dfrac{GMm}{{\\color{'+C.hi+'}\\boxed{{\\color{'+C.x+'}r}^2}}}',RX,172,{size:40}),seg(p,.03,.15),C.F);
  s+=rcard(250,170,label('距離 2倍',RX,300,{size:30,color:C.x,anchor:'middle',weight:700})+fade(seg(p,.65,.75),label('→ 2² ＝ 4',RX,350,{size:30,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.78,.88),label('→ 力も 加速度も 1/4',RX,398,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.5,.6),C.hi);
  s+=goalTag(G1);
  return s;
 },
 // 4. 地表と 2R の赤い矢印（1：1/4）。9.8÷4＝2.45。小問1 の答え C
 [K+'ans1']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=world({phi:PH,glab:0,labels:0,grav:.35});
  const sx=E2.x+E2.R*Math.cos(3*Math.PI/4),sy=E2.y-E2.R*Math.sin(3*Math.PI/4),[x,y]=SP(PH);
  s+=fade(seg(p,.03,.15),dot(sx,sy,7,C.hi))+arrow(sx,sy,sx+(E2.x-sx)*.75,sy+(E2.y-sy)*.75,{color:C.a,w:6,head:16,g:seg(p,.03,.15)});
  s+=arrow(x,y,x+(E2.x-x)*.15,y+(E2.y-y)*.15,{color:C.a,w:6,head:12,g:seg(p,.15,.25)});
  // 右：長さ 1：1/4 の比べ
  let r=label('地表',680,150,{size:26,color:C.dim,weight:700})+arrow(760,140,1000,140,{color:C.a,w:7,head:18})+label('9.8',1020,150,{size:28,color:C.a,weight:700});
  r+=fade(seg(p,.15,.25),label('2R',680,215,{size:26,color:C.dim,weight:700})+arrow(760,205,820,205,{color:C.a,w:7,head:14})+label('？',840,215,{size:28,color:C.a,weight:700,opacity:1-seg(p,.4,.5)}));
  r+=fade(seg(p,.45,.55),label('2.45',840,215,{size:28,color:C.a,weight:700}));
  s+=rcard(96,150,r,seg(p,.03,.12),C.a);
  s+=rcard(270,110,TF('9.8\\div 4=2.45\\ \\mathrm{m/s^2}',RX,328,{size:42,color:C.a}),seg(p,.3,.42),C.a);
  s+=goalTag(G1)+A1(seg(p,ve*.55,ve*.55+.08));
  return s;
 },
 // 5. 誤答 A（4.9）、B（9.8）
 [K+'wrongAB']:(p,ctx)=>{
  let s=world({phi:PH,glab:0,labels:0,grav:.35,g:.45});
  s+=rcard(96,100,TF('9.8\\div 2^2=2.45\\ \\mathrm{m/s^2}',RX,152,{size:40,color:C.a}),1,C.a);
  s+=wrongSeq(p,ctx,[['A','4.9','2倍 → 1/2 とした（逆2乗なら 1/4）'],['B','9.8','距離で変わることを忘れた']],{opts:{x:620,w:570,y:240}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 6. 誤答 D（0）
 [K+'wrongD']:(p)=>{
  let s=world({phi:PH,glab:0,labels:0,grav:.35,g:.45});
  s+=rcard(96,100,TF('9.8\\div 2^2=2.45\\ \\mathrm{m/s^2}',RX,152,{size:40,color:C.a}),1,C.a);
  s+=wrongCard('D','0','重力は遠くでもはたらく',{x:620,w:570,y:240,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：衛星の速さ =================
 // 7. 求めるもの：衛星の速さ v。紫の矢印に「？」
 [K+'goal2']:(p)=>{
  let s=world({phi:PH,glab:0,velQ:seg(p,.2,.35)});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 8. 重力による加速度 2.45 が向心加速度。a＝v²/r → v²＝ar。小さく月の確認の場面
 [K+'vsq']:(p)=>{
  let s=world({phi:PH,glab:0,grav:.4,acc:1});
  const [x,y]=SP(PH);
  s+=fade(seg(p,.03,.15),ring(x+(E2.x-x)*.06,y+(E2.y-y)*.06,26,{color:C.hi,w:3})+label('2.45 m/s²',x+26,y+56,{size:24,color:C.a,weight:700}));
  s+=card(620,90,570,180,ring(720,170,62,{color:C.faint,w:2,dash:'6 6'})+earth(720,170,20)+moon(720+62*Math.cos(1),170-62*Math.sin(1),11)+FA(720+62*Math.cos(1),170-62*Math.sin(1),720+30*Math.cos(1),170-30*Math.sin(1),{w:5,head:12})+label('単元動画：月の 確認',960,150,{size:24,color:C.dim,anchor:'middle',weight:700})+label('重力が 向心加速度を 作る',960,200,{size:24,color:C.ink,anchor:'middle'}),seg(p,.08,.2));
  s+=rcard(290,90,TF(A+'=\\dfrac{'+V+'^2}{'+Rr+'}',RX,342,{size:40}),seg(p,.35,.45),C.a);
  s+=fade(seg(p,.55,.62),label('両辺に r を 掛ける',RX,412,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=rcard(425,80,TF(V+'^2='+A+Rr,RX,468,{size:40}),seg(p,.65,.75),C.v);
  s+=goalTag(G2);
  return s;
 },
 // 9. r は軌道の半径 2R＝1.28×10⁷ m。地表までの R は薄く
 [K+'r']:(p)=>{
  let s=world({phi:PH,glab:0,grav:.4,acc:1,rul:1,fadeR:seg(p,.4,.55)});
  const [x,y]=SP(PH);
  s+=fade(1,draw([[E2.x,E2.y],[x,y]],seg(p,.05,.35),{color:C.x,w:6}));
  s+=fade(seg(p,.3,.42),label('r',(E2.x+x)/2-18,(E2.y+y)/2-10,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=rcard(96,110,label('軌道の 半径（地球の 半径 ではない）',RX,160,{size:26,color:C.x,anchor:'middle',weight:700}),seg(p,.1,.22),C.x);
  s+=rcard(230,120,TF(Rr+'=2'+RR+'=2\\times 6.4\\times 10^6',RX,275,{size:36})+TF('=1.28\\times 10^7\\ \\mathrm{m}',RX,325,{size:36,color:C.x}),seg(p,.4,.52),C.x);
  s+=goalTag(G2);
  return s;
 },
 // 10. v²＝2.45×1.28×10⁷≈3.14×10⁷ → √ → v≈5.6×10³ m/s。小問2 の答え B
 [K+'calc']:(p,ctx)=>{
  const Wn=sentWin(ctx),b=Wn[1]?Wn[1][0]:.5,ve=voiceEnd(ctx);
  let s=world({phi:PH,glab:0,grav:.4,acc:1});
  const [x,y]=SP(PH),[ux,uy]=TU(PH);
  s+=rcard(96,90,TF(V+'^2=2.45\\times 1.28\\times 10^7',RX,148,{size:38}),seg(p,.03,.12),C.v);
  s+=rcard(200,90,TF('=3.136\\times 10^7\\approx 3.14\\times 10^7',RX,252,{size:36}),seg(p,.15,.28));
  s+=rcard(306,110,TF(V+'={\\color{'+C.hi+'}\\sqrt{\\vphantom{1}{\\color{'+C.ink+'}3.14\\times 10^7}}}\\approx 5.6\\times 10^3\\ \\mathrm{m/s}',RX,368,{size:34}),seg(p,b+.03,b+.12),C.hi);
  s+=fade(seg(p,b+.2,b+.3),label('5.6×10³ m/s',x+100*ux-12,y+100*uy-12,{size:26,color:C.v,anchor:'end',weight:700}));
  s+=goalTag(G2)+A2(seg(p,ve*.8,ve*.8+.06));
  return s;
 },
 // 11. 誤答 A（r に R）。物差しの R を一瞬光らせる
 [K+'wrongA']:(p)=>{
  const fl=seg(p,.3,.4)*(1-seg(p,.6,.7));
  let s=world({phi:PH,glab:0,grav:.4,acc:1,g:.5,hiR:fl});
  s+=ruler({hiR:fl});
  s+=rcard(96,100,TF(V+'\\approx 5.6\\times 10^3\\ \\mathrm{m/s}',RX,152,{size:40}),1,C.v);
  s+=wrongCard('A','4.0×10³','r に R を入れた',{x:620,w:570,y:240,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 C（9.8 を使った）、D（√ を忘れた）。単位を並べる
 [K+'wrongCD']:(p,ctx)=>{
  const Wn=sentWin(ctx),[a]=Wn[0],m=a+(voiceEnd(ctx)-a)*.5;
  let s=world({phi:PH,glab:0,grav:.4,acc:1,g:.45});
  s+=rcard(96,100,TF(V+'\\approx 5.6\\times 10^3\\ \\mathrm{m/s}',RX,152,{size:40}),1,C.v);
  s+=wrongSeq(p,ctx,[['C','1.1×10⁴','a に 9.8 を使った'],['D','3.1×10⁷','√ を忘れた（単位 m²/s²）']],{win:[[a,m],[m,1]],opts:{x:620,w:570,y:220}});
  s+=fade(seg(p,m+.05,m+.12),label('v²：m²/s²',760,440,{size:28,color:C.dim,anchor:'middle',weight:700})+label('v：m/s',1050,440,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：運動の正しい説明 =================
 // 13. 求めるもの：運動の正しい説明
 [K+'goal3']:(p)=>{
  let s=world({phi:PH,glab:1,labels:0});
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. 受けるのは重力だけ。その重力が向心力の役。別の矢印を描き足そうとして ×
 [K+'role']:(p)=>{
  let s=world({phi:PH,glab:0,labels:0,gravHi:seg(p,.05,.2)});
  const [x,y]=SP(PH);
  s+=fade(seg(p,.4,.52),label('向心力の 役',x+24,y+70,{size:26,color:C.F,weight:700}));
  const g2=seg(p,.65,.75);
  s+=fade(g2,arrow(x+40,y-10,x+40+(E2.x-x)*.3,y-10+(E2.y-y)*.3,{color:C.F,w:6,head:16})+label('向心力？',x+80,y-20,{size:24,color:C.F,weight:700}));
  s+=cross(x+40+(E2.x-x)*.15,y-10+(E2.y-y)*.15,22,seg(p,.8,.88));
  s+=rcard(130,200,label('衛星が 受ける 力',RX,190,{size:28,color:C.dim,anchor:'middle'})+label('地球の 重力 だけ',RX,250,{size:34,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.4,.52),label('＝ 円の 中心へ 向かう 向心力の 役',RX,300,{size:26,color:C.ink,anchor:'middle',weight:700})),seg(p,.03,.15),C.F);
  s+=goalTag(G3);
  return s;
 },
 // 15. 重力を消すと接線の向きへ → 戻して大砲の図（落ちる分と地面の曲がりが同じ）。小問3 の答え D
 [K+'cannon']:(p,ctx)=>{
  const Wn=sentWin(ctx),b=Wn[1]?Wn[1][0]:.75,m=b*.45;
  const off=seg(p,.03,.1)*(1-seg(p,m-.04,m));
  const [x,y]=SP(PH),[ux,uy]=TU(PH);
  let s=fade(1-seg(p,m-.04,m),world({phi:PH,glab:0,labels:0,grav:1-off})+draw([[x,y],[x+150*ux,y+150*uy]],seg(p,.1,m*.85),{color:C.dim,w:3,dash:'6 7'})
   +fade(seg(p,.12,.2),label('重力が なければ',x+40,y-40,{size:24,color:C.dim,weight:700})));
  const gc=seg(p,m,m+.05);
  s+=fade(gc,`<g transform="translate(40 60) scale(.85)">${cannonScene({paths:[.62,.8,1.0],ps:[seg(p,m+.03,m+.15),seg(p,m+.15,m+.27),seg(p,m+.27,b)]})}</g>`);
  s+=rcard(160,180,label('落ちる 分 ＝ 地面の 曲がり',RX,225,{size:28,color:C.hi,anchor:'middle',weight:700})+label('→ 地球へ 落ち続けながら',RX,280,{size:28,color:C.ink,anchor:'middle'})+label('横に 進む',RX,320,{size:28,color:C.ink,anchor:'middle'}),seg(p,b-.1,b-.02),C.hi);
  s+=goalTag(G3)+A3(seg(p,b+.03,b+.1));
  return s;
 },
 // 16. 誤答 A（力の合計 0）
 [K+'wrongA3']:(p)=>{
  let s=world({phi:PH,glab:0,labels:0,g:.5});
  s+=wrongCard('A','力の合計 0','遠心力は使わない。合力は中心向き',{x:620,w:570,y:120,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 17. 誤答 B（向心力が別にある）、C（重力を受けない）
 [K+'wrongBC']:(p,ctx)=>{
  let s=world({phi:PH,glab:0,labels:0,g:.5});
  s+=wrongSeq(p,ctx,[['B','向心力が別にある','向心力は役割の名前'],['C','重力を受けない','なければ接線の向きへ飛ぶ']],{opts:{x:620,w:570,y:120}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 18. 図に戻り、2.45（緑→赤）、v≈5.6×10³（紫）を矢印に線で結ぶ。横に月。「落ち続けている」
 [K+'sum']:(p)=>{
  let s=world({phi:PH,glab:0,labels:0,acc:1});
  const [x,y]=SP(PH),[ux,uy]=TU(PH);
  s+=rcard(96,96,TF('9.8\\div 2^2=2.45',RX-40,152,{size:38,color:C.a})+label('緑 → 赤',RX+190,160,{size:24,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.15),C.a);
  s+=rcard(212,96,TF(V+'^2=2.45\\times 2'+RR+'\\ \\rightarrow\\ '+V+'\\approx 5.6\\times 10^3\\ \\mathrm{m/s}',RX,266,{size:32}),seg(p,.2,.3),C.v);
  s+=fade(seg(p,.1,.2),line(620,144,x+16,y+10,{color:C.a,w:2,dash:'5 6'}));
  s+=fade(seg(p,.25,.35),line(620,260,x+60*ux,y+60*uy,{color:C.v,w:2,dash:'5 6'}));
  s+=card(620,330,570,130,'',seg(p,.4,.5),C.hi)+fade(seg(p,.4,.5),moon(680,395,22)+sat(760,395)+label('月も 衛星も',920,385,{size:28,color:C.ink,anchor:'middle',weight:700})+label('落ち続けている',920,430,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'C','2.45 m/s²'],[2,'B','5.6×10³ m/s'],[3,'D','']],{g:seg(p,.55,.65),size:22});
  return s;
 },
};
