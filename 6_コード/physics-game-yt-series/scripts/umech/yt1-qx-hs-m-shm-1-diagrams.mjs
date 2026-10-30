// 問題編 解説「硬いばねのおもり」(ys-qx-hs-m-shm-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/110_単振動.md の q-hs-m-shm-1（解説 18 行）。
// 水平なばね（壁は左、自然の長さの位置 x＝0、右が正）。k＝200 N/m、m＝0.50 kg、A＝0.20 m（0.20 m ↔ 200 px）。
// 色（単元動画と同じ）：位置 x 水色、力 F 緑、速度 v 紫、加速度 a 赤、エネルギー 橙（K 濃い、U 薄い、合計の線 黄）、強調 黄。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 単元動画（yt1-hs-m-shm-1 / yt1-hs-m-energy-1）の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,arrow,tex,ground,wall,spring} from './anim.mjs';
import {FA,KC,UC,T2} from './yt1-hs-m-shm-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongCard,wrongSeq,pauseBadge,note,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-shm-1:';
const PI=Math.PI;
const G1='x＝＋0.20 での力 F',G2='中心での速さ v',G3='離した瞬間の v と a';
const A1=g=>answerTag(1,'B','−40 N',{g}),A2=g=>answerTag(2,'C','4.0 m/s',{g}),A3=g=>answerTag(3,'A','v＝0、左 80 m/s²',{g});
const WY={y:392};                                  // 誤答カードは目盛りの下
// 答えを声で言う所（その cue の最後の文の終わりぎわ）
const ansG=(p,ctx,back=.16)=>{const v=voiceEnd(ctx);return seg(p,v-back,v-back+.06);};

// ---- the rig: wall, spring, block on the floor, x axis --------------------------------------------
const R={wall:110,X0:480,y:240,px:1000,bw:120,bh:80};
const X=x=>R.X0+x*R.px;
const TICKS=[[-.2,'−0.20'],[-.1,'−0.10'],[0,'0'],[.1,'＋0.10'],[.2,'＋0.20']];
function hand(bx,o=1){return fade(o,rect(bx+R.bw/2,R.y-14,90,28,{fill:'#e9c7a6',fo:.9,stroke:'none',rx:10})+rect(bx+R.bw/2-4,R.y-26,40,52,{fill:'#e9c7a6',fo:1,stroke:'none',rx:14}));}
function rig({x=.2,g=1,axis=1,hd=0,labs=0,F=null,Fg=0,Ftxt=null,v=0,Vg=0,Vtxt=null,a=0,Ag=0,Atxt=null,hiTick=null,hiG=0,plus=0,disp=0}={}){
 const bx=X(x),top=R.y-R.bh/2,bot=R.y+R.bh/2,ay=bot+40;
 let s=fade(g,wall(R.wall,R.y-80,bot)+ground(R.wall,800,bot));
 s+=fade(g*.8,line(R.X0,R.y-64,R.X0,bot,{color:C.faint,w:2,dash:'6 6'}));
 s+=fade(g,spring(R.wall,bx-R.bw/2,R.y,{coils:11,amp:16,color:C.dim,w:3}));
 s+=fade(g,rect(bx-R.bw/2,top,R.bw,R.bh,{fill:'#c9a46a',fo:.6,stroke:'#c9a46a',rx:8}));
 if(labs){
  s+=fade(g*labs,label('200 N/m',(R.wall+bx-R.bw/2)/2,R.y-40,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(g*labs,label('0.50 kg',bx,R.y+9,{size:22,color:C.ink,anchor:'middle',weight:700}));
 }
 if(axis){
  s+=fade(g*axis,arrow(X(-.25),ay,X(.29),ay,{color:C.x,w:2.5,head:14})+label('x [m]',X(.29)+14,ay+8,{size:24,color:C.x,weight:700}));
  for(const [u,t] of TICKS)s+=fade(g*axis,line(X(u),ay-8,X(u),ay+8,{color:C.x,w:2.5})+label(t,X(u),ay+34,{size:22,color:C.x,anchor:'middle'}));
  if(hiTick!==null&&hiG)s+=fade(g*hiG,rect(X(hiTick)-44,ay+8,88,36,{fill:C.hi,fo:.12,stroke:C.hi,sw:3,rx:8}));
 }
 if(plus)s+=fade(g*plus,arrow(820,ay-34,890,ay-34,{color:C.ink,w:3,head:12})+label('＋',855,ay-46,{size:26,color:C.ink,anchor:'middle',weight:700}));
 if(disp){const yd=ay+70;s+=fade(g*disp,line(X(0),yd-10,X(0),yd+10,{color:C.x,w:2}))+arrow(X(0),yd,X(0)+(bx-X(0))*disp,yd,{color:C.x,w:6,head:16,g});
  s+=fade(g*seg(disp,.6,1),label('ずれ x（右向き）',bx+16,yd+9,{size:24,color:C.x,weight:700}));}
 const f=F===null?-200*x:F;
 if(Fg&&Math.abs(f)>3){const L=f*4,yy=top-26;s+=FA(bx,yy,bx+L,yy,{g:g*Fg,w:8,head:Math.min(22,Math.abs(L)*.6)});
  const t=Ftxt===null?`${Math.abs(f).toFixed(0)} N`:Ftxt;if(t)s+=fade(g*Fg,label(t,bx+L+(L<0?-12:12),yy+9,{size:24,color:C.F,anchor:L<0?'end':'start',weight:700}));}
 if(Vg&&Math.abs(v)>.4){const L=v*40,yy=top-72;s+=fade(g*Vg,arrow(bx,yy,bx+L,yy,{color:C.v,w:6,head:Math.min(18,Math.abs(L)*.6)}));
  if(Vtxt)s+=fade(g*Vg,label(Vtxt,bx+L+(L<0?-12:12),yy+9,{size:24,color:C.v,anchor:L<0?'end':'start',weight:700}));}
 if(Ag&&Math.abs(a)>.5){const L=a*2,yy=top-66;s+=fade(g*Ag,arrow(bx,yy,bx+L,yy,{color:C.a,w:6,head:18}));
  if(Atxt)s+=fade(g*Ag,label(Atxt,bx+L-12,yy+9,{size:24,color:C.a,anchor:'end',weight:700}));}
 if(hd)s+=hand(bx,g*hd);
 return s;
}
// x(φ)＝0.20 cosφ, v＝−4.0 sinφ（ω＝20 rad/s）
const xo=ph=>.2*Math.cos(ph),vo=ph=>-4*Math.sin(ph);
// ---- energy bar（U 薄い・下、K 濃い・上、合計 4.0 J の線 黄）------------------------------------
const EB={base:330,k:50};          // 4.0 J ↔ 200 px
function ebar(x,U,Kv,{w=110,g=1,title='',lab=1,uTxt=null,kTxt=null}={}){
 const b=EB.base,k=EB.k;
 let s=fade(g,rect(x-w/2,b-4.6*k,w,4.6*k,{fill:'#1a2742',fo:.5,stroke:C.faint,sw:2,rx:6}));
 if(U>.01)s+=fade(g,rect(x-w/2,b-U*k,w,U*k,{fill:UC,fo:.65,stroke:UC,sw:2,rx:4}));
 if(Kv>.01)s+=fade(g,rect(x-w/2,b-(U+Kv)*k,w,Kv*k,{fill:KC,fo:.75,stroke:KC,sw:2,rx:4}));
 if(lab){
  if(U>.6)s+=fade(g,label(uTxt??'U',x,b-U*k/2+9,{size:24,color:C.bg,anchor:'middle',weight:700}));
  if(Kv>.6)s+=fade(g,label(kTxt??'K',x,b-U*k-Kv*k/2+9,{size:24,color:C.bg,anchor:'middle',weight:700}));
 }
 s+=fade(g,line(x-w/2-16,b-4*k,x+w/2+16,b-4*k,{color:C.hi,w:3,dash:'8 6'}));
 if(title)s+=fade(g,label(title,x,b+32,{size:24,color:C.ink,anchor:'middle',weight:700}));
 return s;
}
const ekey=(x,y,g=1)=>fade(g,rect(x,y-18,22,22,{fill:KC,fo:.8,stroke:'none',rx:4})+label('K 運動',x+30,y,{size:22,color:KC,weight:700})
 +rect(x,y+14,22,22,{fill:UC,fo:.8,stroke:'none',rx:4})+label('U 位置',x+30,y+32,{size:22,color:UC,weight:700})
 +line(x-4,y+60,x+26,y+60,{color:C.hi,w:3,dash:'8 6'})+label('K＋U',x+30,y+68,{size:22,color:C.hi,weight:700}));
// 式の札（右）
const V0=label('v＝0',X(.2),108,{size:28,color:C.v,anchor:'middle',weight:700});
const fcard=(y,h,inner,g=1,stroke=C.hi)=>card(790,y,400,h,inner,g,stroke);

export const qxHsMShm1Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約5秒＋静止）=================
 // 0〜2 s：壁・ばね・おもり・目盛り・札・「＋」。2〜4 s：手が x＝0 → ＋0.20 へゆっくり引く。4〜5 s：手で持ったまま「映像を一時停止」。
 // 力・速度・加速度の矢印、エネルギーの棒、離した後の動きは描かない。
 [K+'q0']:(p)=>{
  const u=seg(p,.4,.8),x=.2*u;
  let s=rig({x,g:seg(p,0,.15),labs:seg(p,.12,.3),plus:seg(p,.2,.35),hd:seg(p,.3,.4)});
  s+=pauseBadge({g:seg(p,.82,.9)});
  return s;
 },
 // ================= S1 小問1：離した瞬間の力 =================
 // 1. 出題中の図（x＝＋0.20 で止めておく）
 [K+'setup']:(p)=>rig({x:.2,labs:1,plus:1,hd:1}),
 // 2. 求めるもの：x＝＋0.20 での力 F。目盛りの＋0.20 を黄で
 [K+'goal1']:(p)=>rig({x:.2,labs:1,plus:1,hd:1-seg(p,.75,.95),hiTick:.2,hiG:seg(p,.3,.45)})+goalTag(G1,{g:seg(p,.02,.12)}),
 // 3. F＝−kx、「−」を黄で。ずれの矢印（水色・右向き）と「力は逆向き」
 [K+'law']:(p)=>{
  const hi=seg(p,.4,.55);
  let s=rig({x:.2,labs:1,disp:lin(p,.5,.7)});
  const eq=`F=${hi>.5?`{\\color{${C.hi}}\\boldsymbol{-}}`:'-'}k\\,x`;
  s+=fcard(96,170,T2(eq,990,170,{size:56})+fade(seg(p,.72,.85),label('力は ずれと 逆向き',990,236,{size:28,color:C.F,anchor:'middle',weight:700})),seg(p,.05,.2));
  s+=goalTag(G1);
  return s;
 },
 // 4. F＝−200×0.20＝−40 N。緑の左向きの矢印「40 N」。小問1 の答え B
 [K+'num1']:(p,ctx)=>{
  let s=rig({x:.2,labs:1,disp:1,Fg:seg(p,.45,.6)});
  let eq=fade(1-seg(p,.12,.17),T2(`F=-k\\,x`,990,150,{size:48}));
  eq+=fade(seg(p,.19,.26),T2(`F=-200\\times 0.20`,990,150,{size:44}));
  eq+=fade(seg(p,.35,.45),T2(`=-40\\ \\mathrm{N}`,990,225,{size:48}));
  s+=fcard(96,170,eq,1);
  s+=goalTag(G1)+A1(ansG(p,ctx));
  return s;
 },
 // 5. 誤答 A（＋40 N）。5b. 誤答 C（−4.0 N）。行5 を2 cue に分けたので1枚ずつ（点検 PQ-030）
 [K+'wrongAC']:(p,ctx)=>{
  let s=rig({x:.2,labs:1,Fg:1});
  s+=fcard(96,170,T2(`F=-200\\times 0.20`,990,150,{size:44})+T2(`=-40\\ \\mathrm{N}`,990,225,{size:48}),1);
  s+=wrongCard('A','＋40 N','− を落とした（ずれと同じ向き）',{...WY,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 [K+'wrongC']:(p,ctx)=>{
  let s=rig({x:.2,labs:1,Fg:1});
  s+=fcard(96,170,T2(`F=-200\\times 0.20`,990,150,{size:44})+T2(`=-40\\ \\mathrm{N}`,990,225,{size:48}),1);
  s+=wrongCard('C','−4.0 N','力の式を −½kx² と取り違えた（½kx² はエネルギー）',{...WY,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 6. 誤答 D（0 N）。紫の速度の矢印はなく、緑の矢印だけがある状態を黄で囲む
 [K+'wrongD']:(p)=>{
  const hi=seg(p,.35,.5);
  let s=rig({x:.2,labs:1,Fg:1});
  s+=fade(hi,rect(430,100,370,192,{fill:C.hi,fo:.06,stroke:C.hi,sw:3,rx:12})+label('速度 v＝0',715,134,{size:24,color:C.v,anchor:'middle',weight:700}));
  s+=fade(hi,label('力は ある',540,134,{size:24,color:C.F,anchor:'middle',weight:700}));
  s+=wrongCard('D','0 N','力を決めるのは ずれ x',{...WY,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：中心での速さ =================
 // 7. 求めるもの：中心での速さ。目盛りの 0 を黄で。右に棒グラフの枠
 [K+'goal2']:(p)=>{
  let s=rig({x:.2,labs:1,hiTick:0,hiG:seg(p,.3,.45),Fg:1});
  s+=ebar(980,4,0,{g:seg(p,.45,.6),title:'エネルギー'})+ekey(1080,150,seg(p,.5,.65));
  s+=goalTag(G2,{g:seg(p,.02,.12)});
  return s;
 },
 // 8. おもりが左へ動き、緑が縮み紫が伸びる。U が減った分 K が増え、合計の線は動かない
 [K+'energy']:(p)=>{
  const ph=PI/2*seg(p,.08,.8),x=xo(ph),v=vo(ph),U=4*(x/.2)**2;
  let s=rig({x,labs:1,Fg:1,Ftxt:'',v,Vg:1,hiTick:0,hiG:.6});
  s+=ebar(980,U,4-U,{title:'エネルギー'})+ekey(1080,150);
  s+=fade(seg(p,.82,.95),label('合計は 一定',980,96,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 9. 端の棒 U＝4.0 J、中心の棒 K＝4.0 J。式を一操作ずつ（主役は式）
 [K+'calc']:(p,ctx)=>{
  const W=sentWin(ctx);
  let s=ebar(170,4,0,{title:'端',uTxt:'U＝4.0 J',w:150})+ebar(380,0,4,{title:'中心',kTxt:'K＝4.0 J',w:150,g:seg(p,.3,.4)});
  const rows=[[`U=\\tfrac12\\times 200\\times 0.20^2=4.0\\ \\mathrm{J}`,.04],[`\\tfrac12\\times 0.50\\times v^2=4.0`,.36],[`0.25\\,v^2=4.0`,.6],[`v^2=16`,.78]];
  let eq='';rows.forEach(([t,a],i)=>{eq+=fade(seg(p,a,a+.08),T2(t,850,140+i*92,{size:i===0?38:42}));});
  s+=card(520,90,660,400,eq,1,C.hi);
  s+=goalTag(G2);
  return s;
 },
 // 10. √16＝4.0。中心で緑の矢印が消え、紫の矢印「4.0 m/s」が最長。小問2 の答え C
 [K+'ans2']:(p,ctx)=>{
  let s=rig({x:0,labs:1,v:-4,Vg:seg(p,.15,.3),Vtxt:'4.0 m/s',hiTick:0,hiG:.6});
  s+=fade(seg(p,.15,.3),label('F＝0',X(0),176,{size:24,color:C.F,anchor:'middle',weight:700}));
  s+=fcard(96,150,T2(`v=\\sqrt{16}=4.0\\ \\mathrm{m/s}`,990,180,{size:40}),seg(p,.02,.15));
  s+=goalTag(G2)+A2(ansG(p,ctx));
  return s;
 },
 // 11. 誤答 A（0 m/s）。1文目：中心で止める考え。2文目：中心では F＝0・a＝0・v 最大 → 通り過ぎると力が右向きになり減速
 [K+'wrongA2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3,m=b+(1-b)*.45;
  const ph=PI/2+.7*seg(p,m,.92),x=xo(ph);
  let s=rig({x,labs:1,v:vo(ph),Vg:1,Fg:1,Ftxt:'',hiTick:0,hiG:seg(p,b,b+.05)*(1-seg(p,m,m+.05))});
  const c1=seg(p,b,b+.05)*(1-seg(p,m-.02,m+.03)),c2=seg(p,m+.05,m+.12);
  s+=card(800,96,390,104,label('中心 x＝0 では',995,136,{size:24,color:C.ink,anchor:'middle',weight:700})+label('F＝0・a＝0、v は 最大',995,176,{size:26,color:C.hi,anchor:'middle',weight:700}),c1,C.hi);
  s+=card(800,96,390,104,label('通り過ぎると',995,136,{size:24,color:C.ink,anchor:'middle',weight:700})+label('F は 右向き → 減速',995,176,{size:26,color:C.F,anchor:'middle',weight:700}),c2,C.F);
  s+=wrongCard('A','0 m/s','中心で 止まる とした',{...WY,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 B（約5.7 m/s）、誤答 D（16 m/s）。1枚ずつ
 [K+'wrongBD']:(p,ctx)=>{
  let s=fade(.5,ebar(170,4,0,{title:'端',uTxt:'U＝4.0 J',w:150})+ebar(380,0,4,{title:'中心',kTxt:'K＝4.0 J',w:150}));
  s+=card(520,90,660,270,T2(`\\tfrac12\\times 0.50\\times v^2=4.0`,850,160,{size:40})+T2(`v^2=16,\\quad v=4.0\\ \\mathrm{m/s}`,850,260,{size:40}),.6,C.hi);
  s+=wrongSeq(p,ctx,[['B','約5.7 m/s','kx²＝8.0 J とした（½ を忘れた）'],['D','16 m/s','√ を忘れた（単位 m²/s²）']],{opts:WY});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：離した瞬間の v と a =================
 // 13. おもりを x＝＋0.20 に戻す。求めるもの：離した瞬間の v と a
 [K+'goal3']:(p)=>rig({x:.2,labs:1,Fg:seg(p,.3,.45)})+goalTag(G3,{g:seg(p,.02,.12)}),
 // 14. v＝0（紫の欄）。a＝F/m に −40 と 0.50 → −80。赤の左向きの矢印「80 m/s²」を緑の力の矢印と並べる
 [K+'acc']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35;
  let s=rig({x:.2,labs:1,Fg:1,a:-80,Ag:seg(p,.82,.92),Atxt:'80 m/s²'});
  s+=fade(seg(p,.05,.15),V0);
  let eq=fade(seg(p,b,b+.06),T2(`a=\\dfrac{F}{m}`,990,168,{size:44}));
  eq+=fade(seg(p,b+.25,b+.33),T2(`=\\dfrac{-40}{0.50}=-80\\ \\mathrm{m/s^2}`,990,252,{size:38}));
  s+=fcard(100,206,eq,seg(p,b-.02,b+.05));
  s+=goalTag(G3);
  return s;
 },
 // 15. 「速度 0・加速度 最大」の札。小問3 の答え A
 [K+'ans3']:(p,ctx)=>{
  let s=rig({x:.2,labs:1,Fg:1,a:-80,Ag:1,Atxt:'80 m/s²'});
  s+=V0;
  s+=card(820,130,330,80,label('速度 0・加速度 最大',985,182,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.58),C.hi);
  s+=goalTag(G3)+A3(seg(p,.1,.2));
  return s;
 },
 // 16. 誤答 B（v＝0、a＝0）、誤答 C（v 最大、a＝0）。1枚ずつ
 [K+'wrong3BC']:(p,ctx)=>{
  let s=rig({x:.2,labs:1,Fg:1,a:-80,Ag:1,Atxt:'80 m/s²'})+V0;
  s+=wrongSeq(p,ctx,[['B','v＝0、a＝0','端から速度が変わり始める'],['C','v 最大、a＝0','それは中心の様子']],{opts:WY});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 17. 誤答 D（右 80 m/s²）
 [K+'wrong3D']:(p)=>{
  let s=rig({x:.2,labs:1,Fg:1,a:-80,Ag:1,Atxt:'80 m/s²'})+V0;
  s+=wrongCard('D','右 80 m/s²','a は F と同じ向き（左）',{...WY,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ：5つの位置を一列に =================
 [K+'sum']:(p)=>{
  const X5=x=>600+x*2000,yb=270,ay=330;
  let s=line(80,yb+28,1120,yb+28,{color:C.dim,w:3});
  s+=arrow(X5(-.25),ay,X5(.25),ay,{color:C.x,w:2.5,head:14})+label('x [m]',X5(.25)+12,ay+8,{size:22,color:C.x,weight:700});
  [-.2,-.1,0,.1,.2].forEach((x,i)=>{
   const o=seg(p,.03+i*.06,.1+i*.06),bx=X5(x),F=-200*x,v=-4*Math.sqrt(Math.max(0,1-(x/.2)**2));
   s+=fade(o,line(bx,ay-8,bx,ay+8,{color:C.x,w:2.5})+label(TICKS[i][1],bx,ay+34,{size:22,color:C.x,anchor:'middle'}));
   s+=fade(o,rect(bx-35,yb-28,70,56,{fill:'#c9a46a',fo:.55,stroke:'#c9a46a',rx:8}));
   if(Math.abs(F)>1)s+=FA(bx,yb-50,bx+F*2,yb-50,{g:o,w:7,head:16});else s+=fade(o,label('F＝0',bx,yb-42,{size:22,color:C.F,anchor:'middle',weight:700}));
   if(Math.abs(v)>.05)s+=fade(o,arrow(bx,yb-96,bx+v*22,yb-96,{color:C.v,w:6,head:14}));else s+=fade(o,label('v＝0',bx,yb-88,{size:22,color:C.v,anchor:'middle',weight:700}));
  });
  s+=note('（5つの 位置の おもりを 並べて 描いています）',40,118,{g:seg(p,.3,.4),anchor:'start'});
  // 右端と中心の説明
  const gR=seg(p,.45,.55),gC=seg(p,.6,.7);
  s+=card(760,90,430,62,label('F＝−40 N、a＝−80 m/s²、v＝0',975,131,{size:24,color:C.ink,anchor:'middle',weight:700}),gR,C.F);
  s+=fade(gR,line(X5(.2),152,X5(.2)+0,yb-110,{color:C.hi,w:2,dash:'5 5'}));
  s+=card(250,436,700,62,label('F＝0、v＝4.0 m/s（½kA²＝½mv²）',600,477,{size:26,color:C.ink,anchor:'middle',weight:700}),gC,C.v);
  s+=fade(gC,line(X5(0),ay+44,X5(0),436,{color:C.hi,w:2,dash:'5 5'}));
  return s;
 },
};
