// 問題編 解説「半径4倍の軌道」(ys-qx-hs-m-circular-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/109_円運動と万有引力.md の q-hs-m-circular-3（解説 17 行）。
// 地球と、半径 R・4R の円軌道（比のとおり、R＝50 px）。内側に衛星 P（7.9 km/s、1周 85 分）、外側に衛星 Q。地球の重力だけ。
// 色（単元動画と同じ）：半径 水色、速度 v 紫、加速度 a 赤、力（重力）緑、周期 T・時計 金、強調 黄。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp} from './anim.mjs';
import {earth} from './yt1-hs-m-circular-1-diagrams.mjs';
import {sat} from './yt1-qx-hs-m-circular-2-diagrams.mjs';
import {FA} from './yt1-hs-m-force-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,pauseBadge,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-circular-3:';
const G1='Q の速さ v',G2='Q の周期 T',G3='質量2倍での速さ';
const A1=g=>answerTag(1,'D','約4.0 km/s',{g}),A2=g=>answerTag(2,'A','約680 分',{g}),A3=g=>answerTag(3,'C','変わらない',{g});
const V=`{\\color{${C.v}}v}`,Rr=`{\\color{${C.x}}r}`,TT=`{\\color{${C.t}}T}`;
const TF=(src,x,y,o={})=>tex(src,x,y,{size:40,auto:false,...o});
const RX=905;
const rcard=(y,h,inner,g=1,stroke=C.faint)=>card(620,y,570,h,inner,g,stroke);

// ---- 地球・2つの軌道・P と Q ------------------------------------------------------------------------
const E3={x:300,y:295,R:50};
const SP=(phi,r)=>[E3.x+r*Math.cos(phi),E3.y-r*Math.sin(phi)];
const TU=phi=>[-Math.sin(phi),-Math.cos(phi)];
const PPH=Math.PI/2,QPH=-.35;
// 時計（金）。frac＝針の進み（0〜1）
function clock(x,y,{r=18,g=1,frac=.25}={}){
 const a=Math.PI/2-2*Math.PI*frac;
 return fade(g,ring(x,y,r,{color:C.t,w:3,fill:'#1a1a10'})+line(x,y,x,y-r*.7,{color:C.t,w:2.5})+line(x,y,x+r*.75*Math.cos(a),y-r*.75*Math.sin(a),{color:C.t,w:2.5})+dot(x,y,2.5,C.t));
}
// heavy＝質量2倍の衛星（大きさ2倍）
export function orbits({g=1,scale=1,pPh=PPH,pVel=1,pLab=1,pClock=1,q=1,qPh=QPH,qQ=0,qQhi=0,qVel=0,qLab=0,qClock=0,qClockQ=0,qClockLab=0,qGrav=0,heavy=0,heavyOnly=0}={}){
 let s=fade(g*scale,line(E3.x,E3.y,E3.x+E3.R,E3.y,{color:C.x,w:2.5})+label('R',E3.x+E3.R+8,E3.y+8,{size:24,color:C.x,weight:700})
  +line(E3.x,E3.y,E3.x-4*E3.R,E3.y,{color:C.x,w:2.5,dash:'6 6'})+line(E3.x-4*E3.R,E3.y-8,E3.x-4*E3.R,E3.y+8,{color:C.x,w:3})+label('4R',E3.x-2.6*E3.R,E3.y+28,{size:24,color:C.x,anchor:'middle',weight:700}));
 s+=fade(g,ring(E3.x,E3.y,E3.R,{color:C.x,w:2.5,dash:'5 5'})+ring(E3.x,E3.y,4*E3.R,{color:C.x,w:2.5,dash:'8 8'}));
 s+=fade(g,earth(E3.x,E3.y,E3.R-6));
 // P（内側）
 {const [x,y]=SP(pPh,E3.R),[ux,uy]=TU(pPh);
  if(pVel)s+=arrow(x,y,x+76*ux,y+76*uy,{color:C.v,w:5,head:14,g:g*pVel});
  if(pLab&&pVel)s+=fade(g*pLab*pVel,label('7.9 km/s',x+76*ux-6,y+76*uy-14,{size:24,color:C.v,anchor:'middle',weight:700}));
  s+=fade(g,sat(x,y,.7))+fade(g,label('P',x+16,y+30,{size:26,color:C.ink,weight:700}));
  if(pClock)s+=clock(E3.x-140,E3.y-130,{g:g*pClock,frac:.3})+fade(g*pClock,label('P：1周 85 分',E3.x-116,E3.y-122,{size:24,color:C.t,weight:700}));}
 // Q（外側）
 if(q){const [x,y]=SP(qPh,4*E3.R),[ux,uy]=TU(qPh);
  if(qGrav)s+=FA(x,y,x+(E3.x-x)*.3*(heavy?2:1)/2*1,y+(E3.y-y)*.3*(heavy?2:1)/2,{g:g*qGrav,w:7,head:16});
  if(qVel)s+=arrow(x,y,x+38*ux,y+38*uy,{color:C.v,w:5,head:12,g:g*qVel});
  if(qLab&&qVel)s+=fade(g*qLab*qVel,label('約4.0 km/s',x-10,y+44,{size:24,color:C.v,anchor:'middle',weight:700}));
  if(!heavyOnly)s+=fade(g*(1-heavy),sat(x,y,.7));
  if(heavy)s+=fade(g*heavy,sat(x,y,1.4)+label('2m',x,y+40,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(g,label('Q',x+24,y-20,{size:26,color:C.ink,weight:700}));
  if(qQ){if(qQhi)s+=fade(g*qQ*qQhi,ring(x+46,y+6,24,{color:C.hi,w:3}));s+=fade(g*qQ,label('？',x+46,y+16,{size:32,color:C.hi,anchor:'middle',weight:700}));}
  if(qClock){s+=clock(x-70,y+82,{g:g*qClock,frac:.7});
   s+=fade(g*qClock*qClockQ,label('？',x-44,y+92,{size:28,color:C.t,weight:700}));
   if(qClockLab)s+=fade(g*qClock*qClockLab,label('約680 分',x-46,y+92,{size:24,color:C.t,weight:700}));}
 }
 return s;
}
// 比の表（行＝量、列＝ P（r＝R）→ Q（r＝4R））
function ratioTable(rows,{y0=96,g=1,hiRow=-1}={}){
 let s=card(620,y0,570,56+rows.length*52,'',g,C.faint);
 s+=fade(g,label('P',900,y0+38,{size:26,color:C.dim,anchor:'middle',weight:700})+label('Q',1080,y0+38,{size:26,color:C.dim,anchor:'middle',weight:700}));
 rows.forEach(([lab,a,b,col,o],i)=>{const y=y0+90+i*52;
  if(i===hiRow)s+=fade(g*o,rect(636,y-34,538,46,{fill:C.hi,fo:.1,stroke:C.hi,sw:2,rx:8}));
  s+=fade(g*o,label(lab,700,y,{size:28,color:col,anchor:'middle',weight:700})+label(a,900,y,{size:28,color:C.ink,anchor:'middle'})+label('→',990,y,{size:28,color:C.dim,anchor:'middle'})+label(b,1080,y,{size:28,color:C.ink,anchor:'middle',weight:700}));});
 return s;
}

export const qxHsMCircular3Diagrams={
 // ================= 問題アニメ：出題中（5秒＋静止）=================
 // 0〜2 s：地球と半径 R・4R の水色の軌道、目盛り R・4R。2〜4 s：内側に P、紫の矢印 7.9 km/s、金の時計「P：1周 85 分」、P だけ少し進む。
 // 4〜5 s：外側に Q と「？」の札、映像を一時停止。Q の矢印・動き・時計、式、比の表、質量の違う衛星は出さない。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx),u=clamp((t-2)/2),pPh=PPH-.5+.5*(1-(1-u)**2);
  let s=orbits({g:seg(t,0,.6),scale:seg(t,.6,1.2),pPh,pVel:seg(t,2,2.4),pClock:seg(t,2.4,2.8),q:seg(t,4,4.3),qQ:seg(t,4.2,4.5)});
  s+=rcard(130,230,label('地球の 重力だけ',RX,185,{size:28,color:C.F,anchor:'middle',weight:700})+label('P：地表 すれすれ（r ＝ R）',RX,240,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('Q：中心から 4R',RX,295,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(t,1,1.5));
  s+=pauseBadge({g:seg(t,4.6,4.9),x:905,y:420});
  return s;
 },
 // 小問3 の図：Q を、同じ軌道のまま質量 2 倍の衛星に取りかえる（Q の速さ・周期は出さない）
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=orbits({heavy:seg(t,.6,1.4),qQ:seg(t,1.6,2)});
  s+=rcard(130,200,label('Q を 同じ 軌道の まま',RX,195,{size:28,color:C.ink,anchor:'middle',weight:700})+label('質量 2倍の 衛星に 取りかえる',RX,250,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('速さは どうなる？',RX,300,{size:28,color:C.v,anchor:'middle',weight:700}),seg(t,.3,.8));
  return s;
 },
 // ================= S1 小問1：Q の速さ =================
 // 1. 出題中の図。P の矢印 → 時計 → Q の「？」を順に光らせる
 [K+'setup']:(p,ctx)=>{
  const W=sentWin(ctx);
  let s=orbits({qQ:1,qQhi:seg(p,.6,.7)});
  const [px,py]=SP(PPH,E3.R);
  s+=fade(seg(p,.05,.12)*(1-seg(p,.28,.33)),ring(px-38,py-4,34,{color:C.hi,w:3}));
  s+=fade(seg(p,.3,.36)*(1-seg(p,.55,.6)),ring(E3.x-140,E3.y-130,26,{color:C.hi,w:3}));
  s+=rcard(130,230,label('地球の 重力だけ',RX,185,{size:28,color:C.F,anchor:'middle',weight:700})+label('P：地表 すれすれ（r ＝ R）',RX,240,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('Q：中心から 4R',RX,295,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.03,.15));
  return s;
 },
 // 2. 求めるもの：Q の速さ
 [K+'goal1']:(p)=>{
  let s=orbits({qQ:1,qQhi:1});
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 万有引力が向心力の役 → GMm/r²＝mv²/r → v²＝GM/r
 [K+'law']:(p)=>{
  let s=orbits({qQ:1,qGrav:seg(p,.03,.15)});
  s+=rcard(96,110,TF('\\dfrac{GMm}{'+Rr+'^2}=\\dfrac{m'+V+'^2}{'+Rr+'}',RX,152,{size:40}),seg(p,.15,.3),C.F);
  s+=fade(seg(p,.15,.3),label('万有引力 ＝ 向心力の 役',RX,240,{size:24,color:C.F,anchor:'middle',weight:700}));
  s+=rcard(270,110,TF(V+'^2=\\dfrac{GM}{'+Rr+'}',RX,326,{size:44}),seg(p,.55,.7),C.v);
  s+=goalTag(G1);
  return s;
 },
 // 4. 比の表：r 1→4、v² 1→1/4、v 1→1/2（√ を黄）
 [K+'ratio']:(p)=>{
  let s=orbits({qQ:1});
  s+=ratioTable([['r','1','4',C.x,seg(p,.05,.15)],['v²','1','1/4',C.v,seg(p,.3,.4)],['v','1','1/2',C.v,seg(p,.65,.75)]],{hiRow:2});
  s+=fade(seg(p,.7,.8),TF('\\sqrt{\\tfrac{1}{4}}=\\tfrac{1}{2}',RX,350,{size:40,color:C.hi}));
  s+=goalTag(G1);
  return s;
 },
 // 5. 7.9÷2＝3.95≈4.0。Q に紫の矢印（P の半分）。小問1 の答え D
 [K+'ans1']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=orbits({qQ:1-seg(p,.3,.4),qVel:seg(p,.3,.45),qLab:seg(p,.4,.5)});
  s+=rcard(96,110,TF('7.9\\div 2=3.95\\approx 4.0\\ \\mathrm{km/s}',RX,152,{size:40,color:C.v}),seg(p,.03,.15),C.v);
  s+=goalTag(G1)+A1(seg(p,ve*.5,ve*.5+.08));
  return s;
 },
 // 6. 誤答 A（7.9）、B（2.0）
 [K+'wrongAB']:(p,ctx)=>{
  let s=orbits({qVel:1,qLab:1,g:.45});
  s+=rcard(96,96,TF(V+'\\approx 4.0\\ \\mathrm{km/s}',RX,148,{size:40}),1,C.v);
  s+=wrongSeq(p,ctx,[['A','7.9 km/s','v の式に r が入る'],['B','2.0 km/s','7.9÷4（√ を忘れた）']],{opts:{x:620,w:570,y:230}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7. 誤答 C（16）。P と Q の紫の矢印を並べ、Q が短い
 [K+'wrongC']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=orbits({qVel:1,qLab:1,g:.45+.55*seg(p,b,b+.08)});
  s+=wrongCard('C','16 km/s','遠いほど遅い',{x:620,w:570,y:96,g:seg(p,.03,.1)});
  let cmp=label('P',700,330,{size:26,color:C.ink,weight:700})+arrow(740,320,740+152,320,{color:C.v,w:6,head:16})+label('7.9',920,330,{size:26,color:C.v,weight:700});
  cmp+=label('Q',700,400,{size:26,color:C.ink,weight:700})+arrow(740,390,740+76,390,{color:C.v,w:6,head:16})+label('約4.0',840,400,{size:26,color:C.v,weight:700});
  s+=rcard(270,170,cmp+label('遠いほど 遅い',1080,370,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,b,b+.08),C.v);
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：Q の周期 =================
 // 8. 求めるもの：Q の周期。Q の横に金の時計「？」
 [K+'goal2']:(p)=>{
  let s=orbits({qVel:1,qLab:1,qClock:seg(p,.2,.35),qClockQ:1});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9. T²∝r³。比の表 r³ 1→64、T² 1→64、T 1→8
 [K+'kepler']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=orbits({qVel:1,qLab:1,qClock:1,qClockQ:1});
  s+=rcard(96,80,TF(TT+'^2\\propto '+Rr+'^3',RX,140,{size:40}),seg(p,.03,.15),C.t);
  s+=ratioTable([['r','1','4',C.x,seg(p,b,b+.06)],['r³','1','64',C.x,seg(p,b+.1,b+.18)],['T²','1','64',C.t,seg(p,b+.22,b+.3)],['T','1','8',C.t,seg(p,b+.45,b+.55)]],{y0:190,hiRow:3});
  s+=goalTag(G2);
  return s;
 },
 // 10. 85×8＝680 分。小問2 の答え A。円周4倍・速さ½ → 4÷(1/2)＝8
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,ve=voiceEnd(ctx);
  let s=orbits({qVel:1,qLab:1,qClock:1,qClockQ:1-seg(p,.15,.25),qClockLab:seg(p,.2,.3)});
  s+=rcard(96,96,TF('85\\times 8=680',RX,148,{size:42,color:C.t})+label('分',RX+150,158,{size:30,color:C.t,weight:700}),seg(p,.03,.12),C.t);
  s+=rcard(220,200,label('1周の 長さ 2πr：4倍',RX,275,{size:28,color:C.x,anchor:'middle',weight:700})+label('速さ：½',RX,325,{size:28,color:C.v,anchor:'middle',weight:700})+label('時間：4 ÷ ½ ＝ 8倍',RX,385,{size:30,color:C.t,anchor:'middle',weight:700}),seg(p,b+.05,b+.15),C.t);
  s+=goalTag(G2)+A2(seg(p,Math.min(b,ve)*.7,Math.min(b,ve)*.7+.06));
  return s;
 },
 // 11. 誤答 B（340）、C（170）
 [K+'wrongBC']:(p,ctx)=>{
  let s=orbits({qVel:1,qLab:1,qClock:1,qClockLab:1,g:.45});
  s+=rcard(96,96,TF(TT+'^2\\propto '+Rr+'^3\\ \\rightarrow\\ \\times 8',RX,148,{size:38}),1,C.t);
  s+=wrongSeq(p,ctx,[['B','約340 分','T∝r とした'],['C','約170 分','T∝√r とした']],{opts:{x:620,w:570,y:230}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 D（85）
 [K+'wrongD']:(p)=>{
  let s=orbits({qVel:1,qLab:1,qClock:1,qClockLab:1,g:.45});
  s+=rcard(96,96,TF(TT+'^2\\propto '+Rr+'^3\\ \\rightarrow\\ \\times 8',RX,148,{size:38}),1,C.t);
  s+=wrongCard('D','約85 分','T は r で変わる',{x:620,w:570,y:230,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：質量2倍 =================
 // 13. Q の矢印と時計を消し、大きさ2倍の衛星「2m」
 [K+'goal3']:(p)=>{
  let s=orbits({heavy:seg(p,.35,.55),qQ:seg(p,.55,.65)});
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. GMm/r²＝mv²/r の両辺の m に打ち消し線 → v＝√(GM/r) に m はない
 [K+'cancel']:(p)=>{
  let s=orbits({heavy:1,qQ:1});
  const k=seg(p,.25,.4),st=`{\\color{${C.hi}}\\cancel{{\\color{${C.ink}}m}}}`,mm=k>.5?st:'m';
  s+=rcard(96,120,TF('\\dfrac{GM'+mm+'}{'+Rr+'^2}=\\dfrac{'+mm+V+'^2}{'+Rr+'}',RX,156,{size:42}),seg(p,.03,.12),C.F);
  s+=fade(seg(p,.25,.35),label('両辺の m が 消える',RX,250,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=rcard(280,120,TF(V+'=\\sqrt{\\dfrac{GM}{'+Rr+'}}',RX,340,{size:44}),seg(p,.55,.68),C.v);
  s+=fade(seg(p,.72,.82),label('m が 入って いない',RX,445,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 15. 速さは変わらない。小問3 の答え C。重い衛星と軽い衛星：重力 2倍、加速度 同じ
 [K+'same']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=orbits({q:0});
  const put=(ph,heavy)=>{const [x,y]=SP(ph,4*E3.R),k=.16,dx=E3.x-x,dy=E3.y-y;
   let o=FA(x,y,x+dx*k*(heavy?2:1),y+dy*k*(heavy?2:1),{w:7,head:16,g:seg(p,b+.05,b+.15)});
   o+=arrow(x,y,x+dx*.12,y+dy*.12,{color:C.a,w:5,head:12,g:seg(p,b+.2,b+.3)});
   o+=sat(x,y,heavy?1.4:.7)+label(heavy?'2m':'m',x+(heavy?36:26),y+(heavy?40:30),{size:24,color:C.ink,weight:700});
   return o;};
  s+=put(QPH,1)+put(QPH+.9,0);
  s+=rcard(96,96,label('速さ：変わらない',RX,154,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.03,.12),C.v);
  s+=rcard(220,170,label('重い 衛星：強く 引かれる（緑 2倍）',RX,275,{size:26,color:C.F,anchor:'middle',weight:700})+fade(seg(p,b+.2,b+.3),label('その分 加速しにくい（赤 同じ）',RX,340,{size:26,color:C.a,anchor:'middle',weight:700})),seg(p,b+.05,b+.15),C.F);
  s+=goalTag(G3)+A3(seg(p,b*.75,b*.75+.06));
  return s;
 },
 // 16. 誤答 B（2倍）、D（½倍）、A（√2倍）。1枚ずつ
 [K+'wrongBDA']:(p,ctx)=>{
  const W=sentWin(ctx),[a0,b0]=W[0],m=a0+(b0-a0)*.5;
  let s=orbits({heavy:1,g:.45});
  s+=rcard(96,96,TF(V+'=\\sqrt{\\dfrac{GM}{'+Rr+'}}',RX,144,{size:36}),1,C.v);
  s+=wrongSeq(p,ctx,[['B','2倍','加速しにくさを忘れた'],['D','½倍','引く力も2倍'],['A','√2倍','v² に m は入らない']],{win:[[a0,m],[m,b0],W[1]??[b0,1]],opts:{x:620,w:570,y:230}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 17. R と 4R の軌道に戻り、v ½・T 8倍・m は消える を矢印と時計に線で結ぶ
 [K+'sum']:(p)=>{
  let s=orbits({qVel:1,qLab:1,qClock:1,qClockLab:1,pClock:1});
  const [qx,qy]=SP(QPH,4*E3.R);
  s+=rcard(90,80,label('r 4倍 → v ½（約4.0 km/s）',RX,140,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.15),C.v);
  s+=rcard(182,80,label('r³ 64倍 → T 8倍（約680 分）',RX,232,{size:28,color:C.t,anchor:'middle',weight:700}),seg(p,.18,.28),C.t);
  s+=rcard(274,80,label('m は 消える（変わらない）',RX,324,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.31,.41));
  s+=fade(seg(p,.1,.2),line(620,130,qx-10,qy-30,{color:C.v,w:2,dash:'5 6'}));
  s+=fade(seg(p,.23,.33),line(620,222,qx-50,qy+80,{color:C.t,w:2,dash:'5 6'}));
  s+=rcard(372,90,TF(V+'^2\\propto\\dfrac{1}{'+Rr+'}\\qquad '+TT+'^2\\propto '+Rr+'^3',RX,420,{size:38}),seg(p,.45,.55),C.hi);
  s+=answerRow([[1,'D','約4.0 km/s'],[2,'A','約680 分'],[3,'C','変わらない']],{g:seg(p,.6,.7),size:22});
  return s;
 },
};
