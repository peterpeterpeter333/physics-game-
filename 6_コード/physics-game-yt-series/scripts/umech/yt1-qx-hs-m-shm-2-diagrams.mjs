// 問題編 解説「重いおもりの往復の時間」(ys-qx-hs-m-shm-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/110_単振動.md の q-hs-m-shm-2（解説 19 行）。
// 水平なばね（壁は左、自然の長さの位置 x＝0、右が正）。k＝50 N/m、m＝2.0 kg、A＝0.30 m、ω＝5.0 rad/s、T≈1.26 s。
// 円と影：真上から見た等速円運動（反時計回り、角 ωt は右から測る）。点の真下に、おもり（点と水色の点線で結ぶ）。
//   画面では動きを遅く描く（注記を出す）。実際の ω は 5.0 rad/s。
// 小問3（行14〜16）：正本は「上下に並べる」だが、円と影の対応を見せるため、半径 0.30 と 0.15 の組を左右に並べた。
// 色（単元動画と同じ）：位置 x 水色、速度 v 紫、ω・角 桃、t・T 金、力 F 緑、強調 黄。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,ground,wall,spring} from './anim.mjs';
import {T2} from './yt1-hs-m-shm-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongCard,wrongSeq,pauseBadge,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-shm-2:';
const PI=Math.PI,TAU=2*PI;
const W=`{\\color{${C.p}}\\omega}`,TT=`{\\color{${C.t}}T}`,PI2='2\\pi';
const G1='角振動数 ω',G2='周期 T',G3='0.15 m のときの T と中心の速さ';
const A1=g=>answerTag(1,'C','5.0 rad/s',{g}),A2=g=>answerTag(2,'A','1.3 s',{g}),A3=g=>answerTag(3,'D','T 同じ、0.75 m/s',{g});
const ansG=(p,ctx,back=.16)=>{const v=voiceEnd(ctx);return seg(p,v-back,v-back+.06);};
const WV=1.6;                                   // 画面の角速度（rad/s、ゆっくり描く）
const slow=(g=1,x=600,y=505)=>note('（動きは ゆっくり 描いています）',x,y,{g});

// ---- spring rig（o で配置を変える）---------------------------------------------------------------
const OQ={wall:110,X0:480,y:230,px:600,bw:110,bh:76,ticks:[[-.3,'−0.30'],[-.15,'−0.15'],[0,'0'],[.15,'＋0.15'],[.3,'＋0.30']],floor:800,lab:26,mlab:24};
const OE={wall:150,X0:430,y:410,px:400,bw:80,bh:56,ticks:[[-.3,'−0.30'],[0,'0'],[.3,'＋0.30']],floor:640,lab:24,mlab:22};
function hand(o,bx,g=1){return fade(g,rect(bx+o.bw/2,o.y-12,80,24,{fill:'#e9c7a6',fo:.9,stroke:'none',rx:10})+rect(bx+o.bw/2-4,o.y-22,36,44,{fill:'#e9c7a6',fo:1,stroke:'none',rx:12}));}
function rig(o,{x=.3,g=1,axis=1,labs=0,hd=0,v=0,Vg=0,Vtxt='',vpx=60,mini=0}={}){
 const bx=o.X0+x*o.px,top=o.y-o.bh/2,bot=o.y+o.bh/2,ay=bot+26;
 let s=fade(g,wall(o.wall,o.y-o.bh/2-20,bot)+ground(o.wall,o.floor,bot));
 s+=fade(g*.8,line(o.X0,top-14,o.X0,bot,{color:C.faint,w:2,dash:'6 6'}));
 s+=fade(g,spring(o.wall,bx-o.bw/2,o.y,{coils:mini?7:10,amp:mini?8:14,color:C.dim,w:mini?2:3}));
 s+=fade(g,rect(bx-o.bw/2,top,o.bw,o.bh,{fill:'#c9a46a',fo:.6,stroke:'#c9a46a',rx:8}));
 if(labs){s+=fade(g*labs,label('50 N/m',(o.wall+bx-o.bw/2)/2,o.y-o.bh/2+4,{size:o.lab,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(g*labs,label('2.0 kg',bx,o.y+8,{size:o.mlab,color:C.ink,anchor:'middle',weight:700}));}
 if(axis){s+=fade(g*axis,arrow(o.X0-(.36*o.px),ay,o.X0+.38*o.px,ay,{color:C.x,w:2.5,head:12})+label('x [m]',o.X0+.38*o.px+10,ay+8,{size:22,color:C.x,weight:700}));
  for(const [u,t] of o.ticks)s+=fade(g*axis,line(o.X0+u*o.px,ay-7,o.X0+u*o.px,ay+7,{color:C.x,w:2.5})+label(t,o.X0+u*o.px,ay+30,{size:22,color:C.x,anchor:'middle'}));}
 if(Vg&&Math.abs(v)>.05){const L=v*vpx,yy=top-22;s+=fade(g*Vg,arrow(bx,yy,bx+L,yy,{color:C.v,w:6,head:Math.min(16,Math.abs(L)*.5)}));
  if(Vtxt)s+=fade(g*Vg,label(Vtxt,bx+L+(L<0?-10:10),yy+8,{size:22,color:C.v,anchor:L<0?'end':'start',weight:700}));}
 if(hd)s+=hand(o,bx,g*hd);
 return s;
}
// ---- circle (top view) above the rig, the point at angle th, dotted line down to the block ------------
function circ(o,{A=.3,cy=210,th=0,g=1,link=1,arc=0,arcLab='',ang=0,Wlab=0}={}){
 const cx=o.X0,R=A*o.px,px=cx+R*Math.cos(th),py=cy-R*Math.sin(th);
 let s=fade(g,ring(cx,cy,R,{color:C.x,w:2.5,dash:'8 7'})+dot(cx,cy,4,C.dim));
 if(arc>0){const n=Math.max(2,Math.ceil(40*arc)),pts=Array.from({length:n+1},(_,i)=>{const a=TAU*arc*i/n;return [cx+(R+14)*Math.cos(a),cy-(R+14)*Math.sin(a)];});
  s+=fade(g,draw(pts,1,{color:C.p,w:4}));if(arcLab)s+=fade(g*seg(arc,.85,1),label(arcLab,cx+R+40,cy-R*.6,{size:28,color:C.p,weight:700}));}
 if(ang&&th>.05){const n=20,pts=Array.from({length:n+1},(_,i)=>{const a=th*i/n;return [cx+34*Math.cos(a),cy-34*Math.sin(a)];});s+=fade(g*ang,draw(pts,1,{color:C.p,w:3})+line(cx,cy,px,py,{color:C.faint,w:2}));}
 if(link)s+=fade(g*link*.9,line(px,py,px,o.y-o.bh/2,{color:C.x,w:2,dash:'4 6'}));
 s+=fade(g,dot(px,py,10,C.x)+ring(px,py,10,{color:C.ink,w:2}));
 if(Wlab)s+=fade(g*Wlab,label('ω',cx-R*.75,cy-R*.8,{size:28,color:C.p,weight:700}));
 return s;
}
// θ(t)：右端から反時計回り
const xOf=(A,th)=>A*Math.cos(th);
// ---- gold clock --------------------------------------------------------------------------------------
function clock(x,y,{r=40,txt='',g=1,turn=0,size=26}={}){
 let s=ring(x,y,r,{color:C.t,w:3,fill:'#1a2234'});
 for(let i=0;i<12;i++){const a=i*PI/6;s+=line(x+(r-7)*Math.sin(a),y-(r-7)*Math.cos(a),x+(r-2)*Math.sin(a),y-(r-2)*Math.cos(a),{color:C.t,w:2});}
 const a=TAU*turn;s+=line(x,y,x+(r-12)*Math.sin(a),y-(r-12)*Math.cos(a),{color:C.t,w:3})+dot(x,y,3,C.t);
 if(txt)s+=label(txt,x,y+r+30,{size,color:C.t,anchor:'middle',weight:700});
 return fade(g,s);
}
const VX=822;                                   // ω² と k/m の位置（左寄せの式）
const pane=(y,h,inner,g=1,stroke=C.hi)=>card(700,y,490,h,inner,g,stroke);
const WR={x:690,w:500,y:170};                  // 誤答カード（右の枠の位置）
// 回っている円と影（行4〜7 を同じ時間で続ける）
function spin(ctx,{g=1,Wlab=0}={}){
 const th=WV*tAt(ctx,K+'circle'),x=xOf(.3,th);
 return rig(OE,{x,g,labs:1})+circ(OE,{th,g,Wlab});
}

// ---- two pairs (A＝0.30 left, A＝0.15 right) --------------------------------------------------------
const PL={wall:90,X0:320,y:410,px:320,bw:64,bh:48,ticks:[[-.3,'−0.30'],[0,'0'],[.3,'＋0.30']],floor:470,lab:22,mlab:20};
const PR={wall:650,X0:880,y:410,px:320,bw:64,bh:48,ticks:[[-.15,'−0.15'],[.15,'＋0.15']],floor:1030,lab:22,mlab:20};
function pairs(th,{g=1,v=0,clk=0,clkTxt=0,turn=0,sp=0}={}){
 let s='';
 for(const [o,A,lab] of [[PL,.3,'A＝0.30 m'],[PR,.15,'A＝0.15 m']]){
  const vv=-A*5*Math.sin(th);
  s+=rig(o,{x:xOf(A,th),g,v:vv,Vg:v,vpx:60})+circ(o,{A,cy:240,th,g});
  s+=fade(g,label(lab,o.X0-A*o.px-18,248,{size:24,color:C.x,anchor:'end',weight:700}));
  if(clk)s+=clock(o.X0+(o===PL?230:150),230,{r:36,txt:clkTxt?'1.3 s':'',g:g*clk,turn,size:24});
 }
 if(sp){s+=card(40,96,380,52,label('0.30×5.0＝1.5 m/s',230,131,{size:26,color:C.v,anchor:'middle',weight:700}),sp,C.v);
  s+=card(790,96,380,52,label('0.15×5.0＝0.75 m/s',980,131,{size:26,color:C.v,anchor:'middle',weight:700}),sp,C.v);}
 return s;
}

export const qxHsMShm2Diagrams={
 // ================= 問題アニメ =================
 // 出題（約5秒＋静止）：0〜2 s 壁・ばね・おもり・目盛り・札・π≈3.14。2〜3 s 手が ＋0.30 まで引いて止める。
 //   3〜5 s 右下の小さな枠「小問3」：同じばねとおもりを2組上下に（0.30 m 引く／0.15 m 引く、静止）。
 //   離した後の往復、円と影、ω・周期・速さの数値は描かない。
 [K+'q0']:(p)=>{
  const u=seg(p,.4,.6);
  let s=rig(OQ,{x:.3*u,g:seg(p,0,.15),labs:seg(p,.12,.3),hd:seg(p,.3,.4)});
  s+=fade(seg(p,.15,.3),label('π ≈ 3.14',1170,120,{size:28,color:C.ink,anchor:'end',weight:700}));
  const gq=seg(p,.62,.75),M1={...OQ,wall:780,X0:880,y:400,px:300,bw:44,bh:34,floor:990},M2={...M1,y:470};
  s+=card(760,330,430,180,'',gq,C.dim)+fade(gq,label('小問3',780,362,{size:24,color:C.ink,weight:700}));
  s+=rig(M1,{x:.3,g:gq,axis:0,mini:1})+rig(M2,{x:.15,g:gq,axis:0,mini:1});
  s+=fade(gq,label('0.30 m 引く',1020,408,{size:22,color:C.x,weight:700})+label('0.15 m 引く',1020,478,{size:22,color:C.x,weight:700}));
  return s;
 },
 // 小問3 の図（約2.5秒＋静止）：同じばねとおもりを上下に2組。上は 0.30 m、下は 0.15 m 引いた状態で止める
 [K+'q3']:(p)=>{
  const u=seg(p,.1,.7),U={...OQ,y:150,bh:64,bw:96,ticks:OQ.ticks},L={...OQ,y:350,bh:64,bw:96};
  let s=rig(U,{x:.3*u,labs:1,hd:1})+rig(L,{x:.15*u,labs:1,hd:1});
  s+=fade(seg(p,.7,.85),label('0.30 m 引く',1170,158,{size:28,color:C.x,anchor:'end',weight:700})+label('0.15 m 引く',1170,358,{size:28,color:C.x,anchor:'end',weight:700}));
  return s;
 },
 // ================= S1 小問1：角振動数 =================
 [K+'setup']:(p)=>rig(OE,{x:.3,labs:1,hd:1})+fade(seg(p,.1,.25),label('π ≈ 3.14',1170,120,{size:28,color:C.ink,anchor:'end',weight:700})),
 [K+'goal1']:(p)=>rig(OE,{x:.3,labs:1,hd:1-seg(p,.7,.9)})+goalTag(G1,{g:seg(p,.02,.12)}),
 // 3. ma＝−kx → a＝−(k/m)x（k/m を黄で囲み 50÷2.0＝25）→ a＝−25x
 [K+'eom']:(p)=>{
  let s=rig(OE,{x:.3,labs:1});
  const KM=`{\\color{${C.hi}}\\boxed{{\\color{${C.ink}}\\dfrac{k}{m}}}}`;
  let eq=fade(seg(p,.04,.12),T2(`m\\,a=-k\\,x`,900,132,{size:40}));
  eq+=fade(seg(p,.3,.38),T2(`a=-${KM}\\,x`,900,222,{size:40}));
  eq+=fade(seg(p,.5,.58),T2(`\\dfrac{k}{m}=\\dfrac{50}{2.0}=25`,900,318,{size:34}));
  eq+=fade(seg(p,.72,.8),T2(`a=-25\\,x`,900,396,{size:42}));
  s+=pane(92,336,eq,seg(p,.02,.1));
  s+=fade(seg(p,.2,.3),label('両辺を m で割る',1180,172,{size:22,color:C.dim,anchor:'end'}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 円と影：影がおもりと重なって動く。a＝−ω²x と a＝−(k/m)x を並べ、ω² と k/m を線で結ぶ
 [K+'circle']:(p,ctx)=>{
  const g=seg(p,.03,.12);
  let s=spin(ctx,{g:1,Wlab:g});
  let eq=fade(seg(p,.15,.25),tex(`a=-${W}^2\\,x`,730,145,{size:40,anchor:'start'})+label('円の 影',1100,152,{size:24,color:C.dim,anchor:'middle',weight:700}));
  eq+=fade(seg(p,.4,.5),tex(`a=-\\dfrac{k}{m}\\,x`,730,262,{size:40,anchor:'start'})+label('ばねの おもり',1100,270,{size:24,color:C.dim,anchor:'middle',weight:700}));
  eq+=fade(seg(p,.55,.65),line(VX,168,VX,222,{color:C.hi,w:4})+label('↕ そろえる',1100,211,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=pane(92,250,eq,seg(p,.12,.2));
  s+=fade(seg(p,.75,.88),label('ω² ＝ k/m なら 同じ 動き',945,380,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=slow(seg(p,.05,.15),945,470);
  s+=goalTag(G1);
  return s;
 },
 // 5. ω²＝25 → ω＝√25＝5.0 rad/s（√ を黄で）。小問1 の答え C
 [K+'omega']:(p,ctx)=>{
  let s=spin(ctx,{Wlab:1});
  const RT=seg(p,.3,.36)>.5?`{\\color{${C.hi}}\\sqrt{\\color{${C.ink}}25}}`:'\\sqrt{25}';
  let eq=T2(`${W}^2=25`,945,160,{size:42});
  eq+=fade(seg(p,.28,.36),T2(`${W}=${RT}=5.0\\ \\mathrm{rad/s}`,945,260,{size:40}));
  s+=pane(92,240,eq,1);
  s+=slow(1,945,470);
  s+=goalTag(G1)+A1(ansG(p,ctx));
  return s;
 },
 // 6. 誤答 A（25）、B（0.20）。1枚ずつ
 [K+'wrongAB']:(p,ctx)=>spin(ctx,{Wlab:1})+wrongSeq(p,ctx,[['A','25','ω² のまま（単位 1/s²）'],['B','0.20','√(m/k)（単位 s）']],{opts:WR})+goalTag(G1)+A1(1),
 // 7. 誤答 D（1.3）
 [K+'wrongD']:(p,ctx)=>spin(ctx,{Wlab:1})+wrongCard('D','1.3','周期 T と取り違えた',{...WR,g:seg(p,.03,.1)})+goalTag(G1)+A1(1),
 // ================= S2 小問2：周期 =================
 // 8. 求めるもの：周期 T。金の時計（点は右端で止めておく）
 [K+'goal2']:(p)=>rig(OE,{x:.3,labs:1})+circ(OE,{th:0})+clock(1000,230,{r:52,txt:'T ＝ ？',g:seg(p,.3,.45),size:30})+goalTag(G2,{g:seg(p,.02,.12)}),
 // 9. 点が1周する間に影が1往復。回った角に桃の弧「2π」、時計に「T」→ T＝2π/ω
 [K+'period']:(p,ctx)=>{
  const u=lin(p,.08,.72),th=TAU*u;
  let s=rig(OE,{x:xOf(.3,th),labs:1})+circ(OE,{th,arc:u,arcLab:'2π'});
  s+=clock(1000,200,{r:52,turn:u,txt:u>=.999?'T':'',size:30});
  s+=fade(seg(p,.32,.42),label('影は 1往復',1000,330,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=card(760,370,430,90,T2(`${TT}=\\dfrac{${PI2}}{${W}}`,975,418,{size:40}),seg(p,.8,.9),C.hi);
  s+=slow(seg(p,.05,.15),1000,505);
  s+=goalTag(G2);
  return s;
 },
 // 10. 6.28÷5.0≈1.26 → T≈1.3 s（≈ を黄で）。小問2 の答え A
 [K+'Tnum']:(p,ctx)=>{
  let s=rig(OE,{x:.3,labs:1})+circ(OE,{th:0});
  const AP=seg(p,.45,.52)>.5?`{\\color{${C.hi}}\\boxed{\\approx}}`:'\\approx';
  let eq=T2(`${TT}=\\dfrac{${PI2}}{${W}}`,945,150,{size:40});
  eq+=fade(seg(p,.05,.14),T2(`=\\dfrac{6.28}{5.0}\\approx 1.26\\ \\mathrm{s}`,945,240,{size:36}));
  eq+=fade(seg(p,.4,.48),T2(`${TT}${AP}1.3\\ \\mathrm{s}`,945,325,{size:42}));
  s+=pane(92,280,eq,1);
  s+=clock(620,150,{r:40,txt:'≈1.3 s',g:seg(p,.4,.5)});
  s+=goalTag(G2)+A2(ansG(p,ctx));
  return s;
 },
 // 11. T＝2π√(m/k)：√(2.0/50)＝√0.04＝0.20、2π×0.20≈1.26。一致
 [K+'Tcheck']:(p)=>{
  let s='';
  let eq=T2(`${TT}=${PI2}\\sqrt{\\dfrac{m}{k}}`,600,150,{size:42});
  eq+=fade(seg(p,.25,.35),T2(`\\sqrt{\\dfrac{2.0}{50}}=\\sqrt{0.04}=0.20`,600,250,{size:38}));
  eq+=fade(seg(p,.5,.6),T2(`${PI2}\\times 0.20\\approx 1.26\\ \\mathrm{s}`,600,340,{size:40}));
  s+=card(250,92,700,320,eq,1,C.hi);
  s+=fade(seg(p,.75,.85),label('○ 2π/ω と 一致',600,450,{size:30,color:C.F,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 B（0.80 s）、C（31 s）
 [K+'wrongBC']:(p,ctx)=>{
  let s=rig(OE,{x:.3,labs:1})+circ(OE,{th:0});
  s+=card(700,92,490,70,T2(`${TT}=\\dfrac{${PI2}}{${W}}\\approx 1.3\\ \\mathrm{s}`,945,138,{size:32}),.8,C.hi);
  s+=wrongSeq(p,ctx,[['B','0.80 s','ω÷2π（単位 1/s）'],['C','31 s','2π×ω（単位 1/s）']],{opts:{...WR,y:190}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 13. 誤答 D（0.25 s）
 [K+'wrongD2']:(p)=>{
  let s=rig(OE,{x:.3,labs:1})+circ(OE,{th:0});
  s+=card(700,92,490,70,T2(`${TT}=\\dfrac{${PI2}}{${W}}\\approx 1.3\\ \\mathrm{s}`,945,138,{size:32}),.8,C.hi);
  s+=wrongCard('D','0.25 s','√ を忘れた（単位 s²）',{...WR,y:190,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：振幅を半分に =================
 // 14. 半径 0.30 と 0.15 の円とおもりを並べる（どちらも右端で止めておく）
 [K+'goal3']:(p)=>pairs(0,{g:seg(p,.05,.2)})+goalTag(G3,{g:seg(p,.02,.12)}),
 // 15. 2つの点が同じ ω で同時に1周、2つの影も同時に1往復。時計はどちらも 1.3 s
 [K+'sameT']:(p)=>{
  const u=lin(p,.1,.8),th=TAU*u;
  let s=pairs(th,{clk:seg(p,.05,.12),clkTxt:u>=.999,turn:u});
  s+=slow(seg(p,.05,.15),600,112);
  s+=goalTag(G3);
  return s;
 },
 // 16. 中心を通るとき：紫の矢印 1.5 m/s と 0.75 m/s（長さ 2：1）。映像を一時停止。小問3 の答え D
 [K+'speed']:(p,ctx)=>{
  const u=seg(p,0,.25),th=PI/2*u;
  let s=pairs(th,{v:seg(p,.22,.3),sp:seg(p,.3,.4)});
  s+=pauseBadge({g:seg(p,.25,.3)});
  s+=goalTag(G3)+A3(ansG(p,ctx));
  return s;
 },
 // 17. 誤答 A・B。「道のり ½、速さ ½、時間は同じ」
 [K+'wrongAB3']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.5;
  let s=card(150,96,900,80,label('道のり ½ 、 速さ ½ → 時間は 同じ',600,148,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,b,b+.06),C.hi);
  s+=wrongSeq(p,ctx,[['A','周期半分・1.5 m/s','速さも振幅で変わる'],['B','周期半分・0.75 m/s','T に A は入らない']],{opts:{y:220}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 18. 誤答 C
 [K+'wrongC3']:(p)=>{
  let s=card(150,96,900,80,label('道のり ½ 、 速さ ½ → 時間は 同じ',600,148,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=wrongCard('C','どちらも変わらない','Aω は A に比例',{y:220,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p,ctx)=>{
  const O={...OE,X0:330,wall:60,floor:520},th=WV*cueT(ctx),x=xOf(.3,th),v=-1.5*Math.sin(th);
  let s=rig(O,{x,labs:1,v,Vg:1,vpx:60})+circ(O,{th});
  const bx=O.X0+x*O.px,px=O.X0+120*Math.cos(th),py=210-120*Math.sin(th);
  const g1=seg(p,.05,.15),g2=seg(p,.25,.35),g3=seg(p,.45,.55);
  s+=card(640,92,550,86,T2(`\\dfrac{k}{m}=25\\to ${W}=5.0\\to ${TT}=\\dfrac{${PI2}}{5.0}\\approx 1.3\\ \\mathrm{s}`,915,140,{size:28}),g1,C.p);
  s+=fade(g1,line(640,135,px+12,py,{color:C.p,w:2,dash:'5 5'}));
  s+=card(640,200,550,70,T2(`A${W}:\\ 1.5\\ \\to\\ 0.75\\ \\mathrm{m/s}`,915,240,{size:32}),g2,C.v);
  s+=fade(g2,line(640,235,bx+20,O.y-O.bh/2-22,{color:C.v,w:2,dash:'5 5'}));
  s+=card(640,292,550,120,T2(`${TT}=${PI2}\\sqrt{\\dfrac{m}{k}}`,915,340,{size:36})+label('振幅 A に よらない',915,396,{size:28,color:C.hi,anchor:'middle',weight:700}),g3,C.hi);
  s+=slow(seg(p,.05,.15),915,470);
  return s;
 },
};
