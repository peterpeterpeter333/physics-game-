// 問題編 解説「屈折率 2.0 の物質から外へ」(ys-qx-hs-w-light-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/304_光波.md の q-hs-w-light-3（解説 18 行）。
// 色（正本の 304 冒頭）：角度 θ 橙、屈折率 n 白、光 淡い黄、強調 黄。物質（n＝2.0）薄い青。
// 図：横の境界（y＝300）。下が物質 n＝2.0、上が空気 n＝1.0。入射点 O＝(560,300)。
//   物質から出る光は左下から O へ、屈折光は右上、反射光は右下。空気から入る光は左上から O へ、屈折光は右下。
//   反射光の明るさは定性的（臨界角に近づくほど明るい）。角度は計算どおり（θc＝30°、入射 80° → 29.5°）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-w-light-1）の部品（色、屈折角の計算 refr、角の弧 arc）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {ANG,LIGHT,GLASS,GLINE,arc,refr} from './yt1-hs-w-light-1-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin,cueT,tAt,textW,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-w-light-3:';
const R=Math.PI/180;
const F=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const th=i=>`{\\color{${ANG}}\\theta_{${i}}}`,thc=`{\\color{${ANG}}\\theta_{\\mathrm{c}}}`,sinT=i=>`\\sin${th(i)}`,sinC=`\\sin${thc}`;
const SNELL=`n_1\\,${sinT(1)}=n_2\\,${sinT(2)}`;
const RED='#ff6b6b';
const G1='臨界角 θc',G2='入射角 45° の 光の 行き先',G3='80° で 入る 光の 行き先';
const A1=g=>answerTag(1,'B','30°',{g}),A2=g=>answerTag(2,'C','全反射',{g}),A3=g=>answerTag(3,'D','約 29.5° で 入る',{g});
const P_=(o,d,k)=>[o[0]+k*d[0],o[1]+k*d[1]];

// ---- 境界と媒質 ---------------------------------------------------------------------------------------
const YB=300,O=[560,YB],TC=30;
function media({g=1,labs=1}={}){
 let s=rect(0,YB,1200,515-YB,{fill:GLASS,fo:.24,stroke:'none',rx:0})+line(0,YB,1200,YB,{color:GLINE,w:3});
 if(labs)s+=label('空気  n＝1.0',30,YB-18,{size:26,color:C.dim,weight:700})+label('物質  n＝2.0',30,YB+42,{size:26,color:GLINE,weight:700});
 return fade(g,s);
}
const normalL=({g=1,hi=0,top=110,bot=505}={})=>fade(g,line(O[0],top,O[0],bot,{color:hi>0?C.hi:C.ink,w:2.5+2*hi,dash:'8 8'}));
// sin の表（右上）
const SINROWS=['sin30°＝0.50','sin45°≈0.71','sin80°≈0.98','sin21°≈0.36','sin29.5°≈0.49'];
function sinTable({g=1,hi=-1,hiG=0,x=905,y=92}={}){
 let s=card(x,y,280,196,'',1,C.dim);
 SINROWS.forEach((t,i)=>{const yy=y+34+i*36;
  if(i===hi&&hiG>0)s+=fade(hiG,rect(x+10,yy-27,260,36,{fill:C.hi,fo:.15,stroke:C.hi,sw:2.5,rx:8}));
  s+=label(t,x+22,yy,{size:25,color:i===hi&&hiG>.5?C.hi:C.ink,weight:700});});
 return fade(g,s);
}
// 光線（先端までの長さ u）。矢印は途中に
function ray(A,B,{u=1,g=1,color=LIGHT,w=6,op=1}={}){
 const E=[mix(A[0],B[0],u),mix(A[1],B[1],u)];
 if(u<=.01||g*op<=.01)return '';
 let s=line(...A,...E,{color,w});
 if(u>.3){const m0=[mix(A[0],B[0],u*.45),mix(A[1],B[1],u*.45)],m1=[mix(A[0],B[0],u*.6),mix(A[1],B[1],u*.6)];s+=arrow(...m0,...m1,{color,w,head:18});}
 return fade(g*op,s);
}
// 物質から出る光：入射角 a（法線＝下向きから）。屈折光（右上）と反射光（右下）
const inFromBelow=(a,L=220)=>[O[0]-L*Math.sin(a*R),O[1]+L*Math.cos(a*R)];
const reflBelow=(a,L=220)=>[O[0]+L*Math.sin(a*R),O[1]+L*Math.cos(a*R)];
const outAbove=(b,L=230)=>[O[0]+L*Math.sin(b*R),O[1]-L*Math.cos(b*R)];
const reflOp=a=>clamp(.2+.8*Math.pow(Math.min(1,a/TC),6));
const transOp=a=>a>TC+1e-6?0:clamp(1-.5*Math.pow(a/TC,8));
function exitRays(a,{g=1,u=1,trans=1,refl=1,marks=1,lab2=''}={}){
 const b=refr(a,2,1);let s=ray(inFromBelow(a),O,{u:Math.min(1,u*1.0)});
 if(u>=1){
  if(b!==null&&trans>0)s+=ray(O,outAbove(b),{op:trans*transOp(a)});
  if(refl>0)s+=ray(O,reflBelow(a),{op:refl*reflOp(a)});
  if(marks&&b!==null&&trans>0)s+=fade(trans*transOp(a),arc(O[0],O[1],95,90-b,90,{color:ANG,w:4})+(lab2?F(lab2,O[0]+34+120*Math.sin(b/2*R),O[1]-112*Math.cos(b/2*R),28,{color:ANG}):''));
 }
 return fade(g,s);
}
const inArc=(a,{g=1,r=80,text='',color=ANG}={})=>a<=.3?'':fade(g,arc(O[0],O[1],r,270-a,270,{color,w:4})+(text?F(text,O[0]-(r+34)*Math.sin(a/2*R),O[1]+(r+30)*Math.cos(a/2*R)+10,28,{color}):''));
// 空気から入る光：入射角 a（法線＝上向きから）。屈折光（右下）、反射光（右上）
const inFromAbove=(a,L=230)=>[O[0]-L*Math.sin(a*R),O[1]-L*Math.cos(a*R)];
const reflAbove=(a,L=200)=>[O[0]+L*Math.sin(a*R),O[1]-L*Math.cos(a*R)];
const intoBelow=(b,L=200)=>[O[0]+L*Math.sin(b*R),O[1]+L*Math.cos(b*R)];
const topArc=(a,{g=1,r=80,text=''}={})=>a<=.3?'':fade(g,arc(O[0],O[1],r,90,90+a,{color:ANG,w:4})+(text?F(text,O[0]-(r+40)*Math.sin(a/2*R),O[1]-(r+30)*Math.cos(a/2*R)+8,28,{color:ANG}):''));
const botArcR=(b,{g=1,r=95,text=''}={})=>b<=.3?'':fade(g,arc(O[0],O[1],r,270,270+b,{color:ANG,w:4})+(text?F(text,O[0]+(r+50)*Math.sin(b/2*R),O[1]+(r+30)*Math.cos(b/2*R)+10,28,{color:ANG}):''));

// 問題アニメの光（屈折・反射は描かない）
const Q1A=25;
function q1Pic({u=1,g=1}={}){return fade(g,media({})+normalL()+ray(inFromBelow(Q1A),O,{u}))+sinTable({g});}

// sin のグラフ（0°〜90°）。val＝描く水平線の値
function sinGraph({g=1,x0=700,y0=480,w=420,h=150,val=1.42,showVal=1}={}){
 const yy=v=>y0-(v/1.6)*h*1.55;
 let s=card(x0-60,y0-h*1.55-40,w+110,h*1.55+80,'',1,C.dim);
 s+=line(x0,y0,x0+w,y0,{color:C.dim,w:2})+line(x0,y0,x0,yy(1.55),{color:C.dim,w:2});
 const pts=[];for(let d=0;d<=90;d+=2)pts.push([x0+w*d/90,yy(Math.sin(d*R))]);s+=draw(pts,1,{color:ANG,w:4});
 s+=line(x0,yy(1),x0+w,yy(1),{color:RED,w:3})+label('1',x0-14,yy(1)+8,{size:24,color:RED,anchor:'end',weight:700});
 s+=label('0°',x0,y0+28,{size:22,color:C.dim,anchor:'middle'})+label('90°',x0+w,y0+28,{size:22,color:C.dim,anchor:'middle'})+label('sin',x0+12,yy(1.55)+6,{size:24,color:ANG,weight:700});
 if(showVal)s+=fade(showVal,line(x0,yy(val),x0+w,yy(val),{color:C.hi,w:3,dash:'10 6'})+label('1.42',x0-14,yy(val)+8,{size:24,color:C.hi,anchor:'end',weight:700})+label('交わらない',x0+w-6,yy(val)-12,{size:24,color:C.hi,anchor:'end',weight:700}));
 return fade(g,s);
}
// 全反射の条件 2 行
function conds({g=1,a=1,b=1,x=600,y=200,size=30}={}){
 return fade(g,fade(a,label('① n₁ ＞ n₂（屈折率の 大きい 側から 出る）',x,y,{size,color:C.ink,anchor:'middle',weight:700}))+fade(b,label('② 入射角 ＞ θc',x,y+56,{size,color:C.ink,anchor:'middle',weight:700})));
}

export const qxHsWLight3Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1）：物質の中から境界へ向かう光が O に着いて止まる。屈折光・反射光と角度の数値は描かない。右上に sin の表。
 [K+'q1']:(p)=>q1Pic({u:clamp(p/.85)}),
 // 小問2：小問1 の光の線を消してから、入射角 45° の光（橙の弧）が境界へ向かい、O で止まる（境界から先は描かない）
 [K+'q2']:(p)=>{
  const o=1-seg(p,.05,.3),u=clamp((p-.35)/.55);
  return media({})+normalL()+sinTable({})+fade(o,ray(inFromBelow(Q1A),O))+ray(inFromBelow(45),O,{u})+inArc(45,{g:seg(u,.9,1),text:'45^\\circ'});
 },
 // 小問3：小問2 の光の線と 45° の弧を消し、空気の側から入射角 80° の光が O へ向かって止まる（境界から先は描かない）
 [K+'q3']:(p)=>{
  const o=1-seg(p,.05,.3),u=clamp((p-.35)/.55);
  return media({})+normalL()+sinTable({})+fade(o,ray(inFromBelow(45),O)+inArc(45,{text:'45^\\circ'}))+ray(inFromAbove(80),O,{u})+topArc(80,{g:seg(u,.9,1),text:'80^\\circ'});
 },
 // ================= S1 小問1：臨界角 =================
 // 1. 出る光と入る光の矢印を並べて一瞬見せ、出る光だけを残す
 [K+'setup']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=q1Pic({});
  s+=fade(seg(p,b,b+.06)*(1-seg(p,.8,.9)),ray(inFromAbove(40),O,{color:C.dim,w:5})+label('入る',inFromAbove(40)[0]-10,inFromAbove(40)[1]-14,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.06),label('出る',inFromBelow(Q1A)[0]-40,inFromBelow(Q1A)[1]+4,{size:26,color:LIGHT,anchor:'end',weight:700}));
  return s;
 },
 // 2. 求めるもの。入射角を少しずつ大きくすると、屈折光が 90° に届く。そのときの入射角が θc（定義）
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,u=lin(p,b,Math.min(.95,b+.5)),a=mix(10,TC,u);
  let s=media({})+normalL()+exitRays(a,{lab2:th(2)});
  s+=inArc(a,{text:u>=.999?thc:th(1)});
  s+=fade(seg(p,b+.45,b+.55),label('屈折角 90°（境界に 沿う）',O[0]+140,O[1]-22,{size:26,color:ANG,weight:700})+kindTag('定義',1080,140));
  s+=fade(seg(p,.05,.15),label(`入射角 ${a.toFixed(0)}°`,900,230,{size:28,color:ANG,weight:700}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. スネルの法則で θ₂＝90°、sin90°＝1 → n₁ sinθc＝n₂
 [K+'snell']:(p)=>{
  let s=fade(.45,media({})+normalL()+exitRays(TC)+inArc(TC,{text:thc}));
  let e=F(SNELL,900,140,36);
  e+=fade(seg(p,.2,.32),F(`n_1\\,${sinC}=n_2\\,\\sin 90^\\circ`,900,205,36));
  e+=fade(seg(p,.4,.5),label('sin90°＝1',900,262,{size:28,color:C.hi,anchor:'middle',weight:700}));
  e+=fade(seg(p,.6,.72),F(`n_1\\,${sinC}=n_2`,900,320,40));
  s+=card(660,96,480,260,e,seg(p,.02,.1),C.F);
  s+=goalTag(G1);
  return s;
 },
 // 4. sinθc＝n₂/n₁＝1.0/2.0＝0.50 → 表の sin30° → θc＝30°。答え B
 [K+'crit']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7,u=lin(p,0,b);
  let s=media({})+normalL()+exitRays(TC)+inArc(TC,{text:u>.75?'30^\\circ':thc});
  s+=sinTable({hi:0,hiG:seg(u,.55,.68)});
  s+=card(640,300,540,200,F(`${sinC}=\\dfrac{n_2}{n_1}=\\dfrac{1.0}{2.0}=0.50`,910,365,34)+fade(seg(u,.72,.85),F(`${thc}=30^\\circ`,910,450,38)),seg(p,.02,.1),C.F);
  s+=goalTag(G1)+A1(seg(p,voiceEnd(ctx)-.06,voiceEnd(ctx)-.01));
  return s;
 },
 // 5. 誤答 A：60° は境界面から測った角。灰色の 60° に×、法線からの 30° に○
 [K+'wrongA']:(p)=>{
  let s=media({})+normalL()+exitRays(TC)+inArc(TC,{text:'30^\\circ'});
  s+=fade(seg(p,.1,.2),arc(O[0],O[1],150,180,240,{color:C.dim,w:4})+label('60°',O[0]-190,O[1]+60,{size:26,color:C.dim,anchor:'middle',weight:700})+label('×',O[0]-240,O[1]+60,{size:36,color:QC.bad,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.3),label('○',O[0]-30,O[1]+178,{size:36,color:C.F,anchor:'middle',weight:700}));
  s+=wrongCard('A','60°','境界面から 測った',{x:640,y:330,w:540,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 6. 誤答 C・D を1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  let s=fade(.5,media({})+normalL()+exitRays(TC)+inArc(TC,{text:'30^\\circ'}));
  s+=wrongSeq(p,ctx,[['C','45°','臨界角は n₂/n₁ で 決まる'],['D','臨界角は ない','出るときは 屈折角が 入射角より 大きい']]);
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：入射角 45° =================
 // 7a. 求めるもの。45° の図
 [K+'goal2']:(p)=>{
  let s=media({})+normalL()+ray(inFromBelow(45),O)+inArc(45,{text:'45^\\circ'});
  s+=goalTag(G2,{g:seg(p,.05,.2)});
  return s;
 },
 // 7b. 式 2.0×sin45°＝1.0×sinθ₂
 [K+'goal2b']:(p)=>{
  let s=media({})+normalL()+ray(inFromBelow(45),O)+inArc(45,{text:'45^\\circ'});
  s+=card(660,100,500,90,F(`2.0\\times\\sin45^\\circ=1.0\\times${sinT(2)}`,910,148,34),seg(p,.05,.15),C.F);
  s+=goalTag(G2);
  return s;
 },
 // 8. 2.0×0.71≈1.42。sin のグラフ（最大 1）と 1.42 の線は交わらない
 [K+'over']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=media({})+normalL()+ray(inFromBelow(45),O)+inArc(45,{text:'45^\\circ'});
  s+=card(660,100,500,90,F(`2.0\\times0.71\\approx1.42`,910,148,36),1,C.F);
  s+=sinGraph({g:seg(p,.3,.4),showVal:seg(p,b+.1,b+.2)});
  s+=fade(seg(p,b,b+.08),F(`${sinT(2)}=1.42\\ ?`,300,180,34));
  s+=goalTag(G2);
  return s;
 },
 // 9. 屈折光はなく、反射光だけ（全反射）。答え C
 [K+'tir']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=media({})+normalL()+ray(inFromBelow(45),O)+inArc(45,{text:'45^\\circ'});
  s+=ray(O,reflBelow(45),{u:seg(p,.1,.3)});
  s+=fade(seg(p,.25,.35),label('屈折光 なし',O[0]+150,O[1]-80,{size:28,color:RED,weight:700}));
  s+=card(760,330,240,64,label('全反射',880,374,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.45),C.hi);
  s+=goalTag(G2)+A2(seg(p,voiceEnd(ctx)-.06,voiceEnd(ctx)-.01));
  return s;
 },
 // 10. 45° ＞ θc＝30° で、全反射と先に判断できる
 [K+'compare']:(p)=>{
  let s=media({})+normalL()+ray(inFromBelow(45),O)+ray(O,reflBelow(45));
  s+=inArc(45,{r:110,text:'45^\\circ'})+fade(seg(p,.1,.25),inArc(30,{r:70,color:C.hi})+ray(inFromBelow(30,180),O,{color:C.hi,w:3,op:.7})+label('θc＝30°',O[0]-190,O[1]+215,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(760,110,360,74,F(`45^\\circ>{\\color{${ANG}}\\theta_{\\mathrm{c}}}=30^\\circ`,940,155,36),seg(p,.3,.42),C.hi);
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 11. 誤答 A
 [K+'wrongA2']:(p)=>{
  let s=fade(.5,media({})+normalL()+ray(inFromBelow(45),O)+ray(O,reflBelow(45))+inArc(45,{text:'45^\\circ'}));
  s+=wrongCard('A','約 21° で 出る','sin45° を 2.0 で 割った',{mid:`0.71\\div2.0\\approx0.36`,midSize:30,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 B・D を1枚ずつ
 [K+'wrongBD']:(p,ctx)=>{
  let s=fade(.5,media({})+normalL()+ray(inFromBelow(45),O)+ray(O,reflBelow(45))+inArc(45,{text:'45^\\circ'}));
  s+=wrongSeq(p,ctx,[['B','45° の まま 出る','屈折率の 違いを 無視した'],['D','境界に 沿って 進む','入射角が 30° ちょうどの とき']]);
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：空気から 80° =================
 // 13. 求めるもの。80° の図（空気の側から）。1.0×0.98＝2.0×sinθ₂ → ÷2.0 → sinθ₂＝0.49
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,u=lin(p,b,1);
  let s=media({})+normalL()+ray(inFromAbove(80),O)+topArc(80,{text:'80^\\circ'});
  let e=F(`1.0\\times0.98=2.0\\times${sinT(2)}`,910,345,32);
  e+=fade(seg(u,.35,.5),label('両辺を ÷2.0',1150,400,{size:24,color:C.hi,anchor:'end',weight:700}));
  e+=fade(seg(u,.5,.65),F(`${sinT(2)}=0.49`,910,450,36));
  s+=card(660,300,500,200,e,seg(p,b,b+.06),C.F);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. 表の sin29.5°≈0.49。屈折光 約 29.5°（法線に近づく）、反射光は弱く。答え D
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,bb=refr(80,1,2);
  let s=media({})+normalL()+ray(inFromAbove(80),O)+topArc(80,{text:'80^\\circ'})+sinTable({hi:4,hiG:seg(p,.03,.12)});
  s+=ray(O,intoBelow(bb),{u:seg(p,.12,.3)})+botArcR(bb,{g:seg(p,.28,.38),text:'29.5^\\circ'})+ray(O,reflAbove(80),{u:seg(p,.12,.3),op:.3});
  s+=fade(seg(p,.38,.5),label('法線に 近づく',O[0]+60,O[1]+200,{size:26,color:C.hi,weight:700}));
  s+=goalTag(G3)+A3(seg(p,voiceEnd(ctx)-.06,voiceEnd(ctx)-.01));
  return s;
 },
 // 15. 入射角を 0°→90° 近くまで動かしても、屈折角は 30° 付近まで。誤答 A（全反射する）
 [K+'sweep']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,u=lin(p,.03,b-.05),a=mix(5,89,u),bb=refr(a,1,2);
  let s=fade(1-.5*seg(p,b,b+.05),media({})+normalL()+ray(inFromAbove(a),O)+topArc(a)+ray(O,intoBelow(bb))+botArcR(bb)+fade(.5,line(O[0],O[1],...intoBelow(30,240),{color:C.hi,w:2,dash:'6 6'})));
  s+=fade(1-seg(p,b,b+.05),label(`入射角 ${a.toFixed(0)}°`,800,150,{size:28,color:ANG,weight:700})+label(`屈折角 ${bb.toFixed(1)}°`,800,196,{size:28,color:ANG,weight:700})+label('30° に 届かない',O[0]+150,O[1]+215,{size:24,color:C.hi,weight:700}));
  s+=wrongCard('A','全反射する','全反射は n の 大きい 側から 出るときだけ',{g:seg(p,b+.02,b+.08)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 16. 誤答 B・C を1枚ずつ
 [K+'wrongBC']:(p,ctx)=>{
  const bb=refr(80,1,2);
  let s=fade(.5,media({})+normalL()+ray(inFromAbove(80),O)+topArc(80,{text:'80^\\circ'})+ray(O,intoBelow(bb))+botArcR(bb,{text:'29.5^\\circ'}));
  s+=wrongSeq(p,ctx,[['B','法線から 離れる','入るときは 法線に 近づく'],['C','光が なくなる','屈折か 反射の どちらかは ある']]);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 17. 全反射の条件 2 行を順に
 [K+'conds']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=card(200,140,800,200,'',seg(p,.02,.1),C.hi)+label('全反射の 条件',600,190,{size:30,color:C.hi,anchor:'middle',weight:700,opacity:seg(p,.02,.1)});
  s+=conds({a:seg(p,b+.05,b+.15),b:seg(p,b+.4,b+.5),y:250});
  return s;
 },
 // 18. 臨界角 30° の図、45° で 1.42＞1（全反射）、80° で入って 29.5° の図を並べ、条件 2 行でつなぐ
 [K+'sum']:(p)=>{
  const mini=(inner,x,cap,i)=>fade(seg(p,i*.06,.04+i*.06),card(x,84,380,250,`<g transform="translate(${x+190-O[0]*.5} ${84+18-120*.5}) scale(.5)">${inner}</g>`,1,C.dim)+label(cap,x+190,322,{size:24,color:C.ink,anchor:'middle',weight:700}));
  const bb=refr(80,1,2);
  const m=o=>rect(O[0]-360,YB,720,215,{fill:GLASS,fo:.24,stroke:'none',rx:0})+line(O[0]-360,YB,O[0]+360,YB,{color:GLINE,w:3})+line(O[0],YB-230,O[0],YB+210,{color:C.ink,w:2.5,dash:'8 8'})+o;
  let s='';
  s+=mini(m(exitRays(TC,{marks:0})+inArc(TC,{text:'30^\\circ'})),20,'θc＝30°',0);
  s+=mini(m(ray(inFromBelow(45),O)+ray(O,reflBelow(45))+inArc(45,{text:'45^\\circ'})),410,'2.0×0.71≈1.42＞1（全反射）',1);
  s+=mini(m(ray(inFromAbove(80),O)+topArc(80,{text:'80^\\circ'})+ray(O,intoBelow(bb))+botArcR(bb,{text:'29.5^\\circ'})),800,'80° で 入って 約 29.5°',2);
  s+=fade(seg(p,.35,.45),card(150,350,900,150,conds({x:600,y:400,size:28}),1,C.hi));
  s+=answerRow([[1,'B','30°'],[2,'C','全反射'],[3,'D','約 29.5° で 入る']],{g:seg(p,.03,.12),size:24});
  return s;
 },
};
