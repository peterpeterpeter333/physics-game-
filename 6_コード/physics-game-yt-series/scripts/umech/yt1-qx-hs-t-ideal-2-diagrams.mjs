// 問題編 解説「箱の中を往復する球」(ys-qx-hs-t-ideal-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/203_状態方程式.md の q-hs-t-ideal-2（解説 20 行）。
// 色（正本）：運動量 桃、力・力積 緑、速度 紫、長さ・道のり 水色、時間 金、強調 黄、誤り 赤（×）。球と分子は白。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 箱は上から見た図（左に箱、右に式・矢印・カード）。球の往復の速さは実際の時間に合わせない（時計も出さない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,clamp,mix,poly,draw} from './anim.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-t-ideal-2:';
const MC=QC.p,FC=QC.F,VCOL=QC.v,LC=QC.x,TCOL=QC.t,RED='#ff6b6b',BALL='#eef3fb';
const TX=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const G1='右の壁が受ける力積',G2='時間でならした力',G3='vₓ² の平均';
const A1=g=>answerTag(1,'D','＋1.2 N·s',{g}),A2=g=>answerTag(2,'C','1.5 N',{g}),A3=g=>answerTag(3,'B','10 m²/s²',{g});
const AVX=`\\overline{{\\color{${VCOL}}v_x}^{2}}`;
function at(ctx,s,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(s.replace(/\s/g,''));
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}
// 左右にカードを置くとき（箱は左、カードは右）
const WR={x:480,w:700,size:26,whySize:22};

// ---- 上から見た箱と、往復する球 ----------------------------------------------------------------------
export const BX={x0:90,x1:430,y0:95,y1:415,r:22};
const yc=(BX.y0+BX.y1)/2;
const TR=2.6;                                  // 1往復の秒数（画面の上で。実際の時間ではない）
// 時刻 t の球の中心と向き（t＝0 で左の壁、TR/2 で右の壁）
export function ballAt(t,Tr=TR){
 const W=BX.x1-BX.x0-2*BX.r,ph=((t/Tr)%1+1)%1,z=ph<.5?ph*2:2-ph*2;
 return {x:BX.x0+BX.r+W*z,dir:ph<.5?1:-1,ph};
}
function boxTop({g=1,dim=1,wallHi=0}={}){
 let s=rect(BX.x0,BX.y0,BX.x1-BX.x0,BX.y1-BX.y0,{fill:'#0f1a30',fo:.85,stroke:C.dim,sw:2.5,rx:4});
 s+=line(BX.x0,BX.y0,BX.x0,BX.y1,{color:C.dim,w:6})+line(BX.x1,BX.y0,BX.x1,BX.y1,{color:wallHi?C.hi:C.dim,w:6});
 if(dim)s+=line(BX.x0,BX.y1+24,BX.x1,BX.y1+24,{color:LC,w:2})+line(BX.x0,BX.y1+14,BX.x0,BX.y1+34,{color:LC,w:2})+line(BX.x1,BX.y1+14,BX.x1,BX.y1+34,{color:LC,w:2})
  +label('1.2 m',(BX.x0+BX.x1)/2,BX.y1+62,{size:28,color:LC,anchor:'middle',weight:700});
 return fade(g,s);
}
// 右の壁の光（d＝壁までの近さ 0〜1）
const flash=(o,{r=1}={})=>o<=0?'':fade(o,rect(BX.x1-5,BX.y0,10,BX.y1-BX.y0,{fill:C.hi,fo:.9,stroke:'none',rx:3})+`<path d="M${BX.x1+10} ${yc-40*r} q${22*r} ${40*r} 0 ${80*r}" fill="none" stroke="${C.hi}" stroke-width="5"/>`);
function ballScene(t,{g=1,tags=1,parr=1,flashOn=1,Tr=TR}={}){
 const {x,dir,ph}=ballAt(t,Tr);
 let s=boxTop();
 const dw=Math.abs(ph-.5);if(flashOn&&dw<.06)s+=flash(1-dw/.06);
 s+=dot(x,yc,BX.r,BALL);
 if(parr)s+=arrow(x-dir*45,yc-50,x+dir*45,yc-50,{color:MC,w:6,head:18,g:parr});
 if(tags)s+=fade(tags,label('0.20 kg',x,yc+56,{size:24,color:C.ink,anchor:'middle',weight:700})+label('3.0 m/s',x,yc+88,{size:24,color:VCOL,anchor:'middle',weight:700}));
 return fade(g,s);
}
const plusRight=(x=1040,y=130,g=1)=>fade(g,arrow(x-70,y,x+70,y,{color:C.ink,w:4,head:14})+label('右向きを 正',x,y+40,{size:24,color:C.ink,anchor:'middle',weight:700}));
// 球を止めて描く（x＝中心、dir＝運動量の向き、lab＝矢印の値）
function ballStill(x,{dir=1,lab='',g=1,tags=0,wallHi=0}={}){
 let s=boxTop({wallHi})+dot(x,yc,BX.r,BALL)+arrow(x-dir*45,yc-50,x+dir*45,yc-50,{color:MC,w:6,head:18});
 if(lab)s+=label(lab,x,yc-72,{size:28,color:MC,anchor:'middle',weight:700});
 if(tags)s+=label('0.20 kg',x,yc+56,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
const XR=BX.x1-BX.r-4;   // 右の壁にほぼ接する位置

// ---- 往復の道のり（右の壁 → 左の壁 → 右の壁）。u＝なぞった割合、redLeg＝片道を赤く ----------------------
function loop(u,{g=1,redLeg=0,lab=1}={}){
 const xa=XR,xb=BX.x0+BX.r+4,y1=yc-40,y2=yc+40,L1=xa-xb,arc=Math.PI*40,tot=2*L1+arc;
 const pts=[];const N=60;
 for(let i=0;i<=N;i++){const d=tot*i/N;
  if(d<=L1)pts.push([xa-d,y1]);else if(d<=L1+arc){const a=(d-L1)/40;pts.push([xb-40*Math.sin(a),yc-40*Math.cos(a)]);}else pts.push([xb+(d-L1-arc),y2]);}
 let s=draw(pts,u,{color:LC,w:6});
 if(redLeg)s+=fade(redLeg,line(xa,y1,xb,y1,{color:RED,w:8}));
 if(lab)s+=fade(seg(u,.85,1),label('往復 2.4 m',(xa+xb)/2,y2+48,{size:28,color:LC,anchor:'middle',weight:700}));
 return fade(g,s);
}

// ---- F–t グラフ（0.80 s ごとのとげ。幅は大きく誇張）。m＝とげ→長方形の変形 0〜1 -----------------------------
const FG={x:180,y:440,w:900,h:300,tmax:3.4,fmax:8.5};
const gX=t=>FG.x+FG.w*t/FG.tmax,gY=f=>FG.y-FG.h*f/FG.fmax;
const HITS=[.4,1.2,2.0,2.8],HW=.16,FMAX=1.2/HW;   // とげ：底辺 0.32 s・高さ 7.5（面積 1.2）
function ftGraph({m=0,g=1,hi=0,lab=0,avgLab=0,gap=0}={}){
 let s=arrow(FG.x-10,FG.y,FG.x+FG.w+30,FG.y,{color:C.dim,w:2.5,head:14})+arrow(FG.x,FG.y+10,FG.x,FG.y-FG.h-20,{color:C.dim,w:2.5,head:14});
 s+=label('時間 t',FG.x+FG.w+24,FG.y+40,{size:26,color:TCOL,anchor:'middle',weight:700})+label('壁が 受ける 力 F',FG.x+14,FG.y-FG.h-30,{size:26,color:FC,weight:700});
 HITS.forEach((c,i)=>{
  const sp=[[c-HW,0],[c-.001,FMAX],[c+.001,FMAX],[c+HW,0]],rc=[[c-.4,0],[c-.4,1.5],[c+.4,1.5],[c+.4,0]];
  const P=sp.map((q,k)=>[gX(mix(q[0],rc[k][0],m)),gY(mix(q[1],rc[k][1],m))]);
  const isHi=i===1&&hi>0;
  s+=poly(P,{fill:isHi?C.hi:FC,fo:isHi?.25+.5*hi:.7,stroke:isHi?C.hi:FC,sw:2});
 });
 if(lab)s+=fade(lab,label('面積 1.2 N·s',gX(1.2)+30,gY(FMAX*.55),{size:28,color:C.hi,weight:700}));
 if(gap)s+=fade(gap,line(gX(1.2),FG.y+16,gX(2.0),FG.y+16,{color:TCOL,w:3})+line(gX(1.2),FG.y+6,gX(1.2),FG.y+26,{color:TCOL,w:3})+line(gX(2.0),FG.y+6,gX(2.0),FG.y+26,{color:TCOL,w:3})+label('0.80 s',gX(1.6),FG.y+56,{size:26,color:TCOL,anchor:'middle',weight:700}));
 if(avgLab)s+=fade(avgLab,line(FG.x-8,gY(1.5),FG.x+8,gY(1.5),{color:FC,w:3})+label('1.5 N',FG.x-14,gY(1.5)+9,{size:26,color:FC,anchor:'end',weight:700})+label('高さ 1.5 N',gX(2.4)+20,gY(1.5)-16,{size:28,color:C.hi,weight:700}));
 return fade(g,s);
}

// ---- 小問3：4個の分子（vₓ の大きさ 2、2、4、4 m/s） -----------------------------------------------------
const MOLS=[{v:2,x:300,y:122},{v:2,x:620,y:272},{v:4,x:420,y:347},{v:4,x:800,y:197}];
const QB={x:150,y:96,w:900,h:324};
function fourMol(t,{g=1,sq=[0,0,0,0],tags=1,move=1}={}){
 let s=rect(QB.x,QB.y,QB.w,QB.h,{fill:'#0f1a30',fo:.85,stroke:C.dim,sw:2.5,rx:4});
 MOLS.forEach((m,i)=>{
  const W=QB.w-60,u=move?((m.x-QB.x-30)/W+m.v*.05*t*(i%2?1:-1)):((m.x-QB.x-30)/W);const z=((u%2)+2)%2,zz=z<1?z:2-z;
  const x=QB.x+30+W*zz,y=m.y;
  s+=dot(x,y,16,BALL);
  if(tags)s+=fade(tags,label(i===3?'4 m/s':String(m.v),x,y+48,{size:28,color:VCOL,anchor:'middle',weight:700}));
  if(sq[i])s+=fade(sq[i],label(`2乗 → ${m.v*m.v}`,x,y+80,{size:26,color:C.hi,anchor:'middle',weight:700}));
 });
 return fade(g,s);
}
// 止めた分子（小問3 の解説用。札の下に2乗した値）
function fourStill({sq=[0,0,0,0],g=1}={}){
 const xs=[240,480,720,960],y=200;
 let s='';
 xs.forEach((x,i)=>{const v=[2,2,4,4][i];
  s+=dot(x,y,18,BALL)+label(`vₓ ＝ ${v}`,x,y+56,{size:28,color:VCOL,anchor:'middle',weight:700});
  s+=fade(sq[i],label(`${v}² ＝ ${v*v}`,x,y+104,{size:30,color:C.hi,anchor:'middle',weight:700}));});
 return fade(g,s);
}
// 2本のレーン（速さ 2 と 4 の分子）。右の壁に当たるたびに光る（4 m/s は2倍の回数、光も大きい）
function lanes(t,{g=1}={}){
 let s='';
 [[2,170],[4,350]].forEach(([v,y])=>{
  const x0=150,x1=900,r=16,W=x1-x0-2*r,Tr=7.2/v,ph=((t/Tr)%1+1)%1,z=ph<.5?ph*2:2-ph*2,x=x0+r+W*z;
  const n=Math.floor(t/Tr+.5);
  s+=rect(x0,y-60,x1-x0,120,{fill:'#0f1a30',fo:.85,stroke:C.dim,sw:2,rx:4})+line(x1,y-60,x1,y+60,{color:C.dim,w:6});
  const d=Math.abs(ph-.5);if(d<.07){const o=1-d/.07,R=v===4?62:34;s+=fade(o,ring(x1+6,y,R,{color:C.hi,w:v===4?8:4})+rect(x1-5,y-60,10,120,{fill:C.hi,fo:.9,stroke:'none',rx:3}));}
  s+=dot(x,y,r,BALL);
  s+=label(`vₓ ＝ ${v} m/s`,x0+10,y-74,{size:26,color:VCOL,weight:700});
  s+=label(`当たった 回数 ${n}`,1085,y+10,{size:26,color:C.hi,anchor:'middle',weight:700});
 });
 return fade(g,s);
}

export const qxHsTIdeal2Diagrams={
 // ================= 問題アニメ：出題中（小問1・2、6 秒＋静止）=================
 // 上から見た箱（1.2 m）、球（0.20 kg・3.0 m/s）が往復し、右の壁に当たるたびに光る。運動量は桃の矢印（値なし）。右上に「右向きを正」。
 // 約2往復で、球が右へ向かう途中で静止。出さないもの：力積の値、F–t グラフ、戻るまでの時間、2乗した値。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx);
  return ballScene(t,{g:seg(p,0,.12)})+plusRight(1000,140,seg(p,.1,.22));
 },
 // 小問3 の出題（約3秒）：暗転して切り替え、4個の分子に vₓ の大きさの札「2」「2」「4」「4 m/s」
 [K+'q3']:(p,ctx)=>{
  const t=Math.min(cueT(ctx),2.2);
  return fourMol(t,{g:seg(p,.12,.35),tags:seg(p,.4,.7)})+fade(seg(p,.4,.7),label('札 ＝ 壁に 垂直な 速度成分 vₓ の 大きさ',600,460,{size:26,color:VCOL,anchor:'middle',weight:700}));
 },
 // ================= S1 小問1：壁が受ける力積 =================
 [K+'goal1']:(p,ctx)=>ballScene(6+cueT(ctx))+plusRight(1000,140)+goalTag(G1,{g:seg(p,.05,.2)}),
 // 2. 右向きを正。当たる前の運動量 0.20×3.0＝＋0.60
 [K+'pb']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3;
  let s=ballStill(XR-60,{dir:1,lab:seg(p,b+.2,b+.3)>.5?'＋0.60':'',tags:1})+plusRight(1060,120,1);
  s+=card(520,220,640,100,label('0.20 × 3.0 ＝ ＋0.60 kg·m/s',840,282,{size:34,color:MC,anchor:'middle',weight:700}),seg(p,b+.1,b+.2),MC);
  s+=fade(seg(p,b+.05,b+.15),label('当たる 前の 運動量',840,200,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 3. はね返ると −0.60（1文目）→ 2本の矢印を縦に並べ、後−前（2文目）
 [K+'pa']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35;
  let s=fade(1-seg(p,b-.03,b+.02),ballStill(XR-70,{dir:-1,lab:'−0.60'}));
  const o=seg(p,b,b+.06);
  let q=label('前',140,170,{size:30,color:C.ink,weight:700})+arrow(220,160,400,160,{color:MC,w:7,head:20})+label('＋0.60',310,135,{size:28,color:MC,anchor:'middle',weight:700});
  q+=label('後',140,290,{size:30,color:C.ink,weight:700})+arrow(400,280,220,280,{color:MC,w:7,head:20})+label('−0.60',310,255,{size:28,color:MC,anchor:'middle',weight:700});
  s+=fade(o,q);
  s+=fade(seg(p,b+.08,b+.16),label('後 − 前',820,150,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.2,b+.3),label('＝ −0.60 − 0.60',820,230,{size:36,color:MC,anchor:'middle',weight:700}));
  s+=card(600,270,440,84,label('＝ −1.2 kg·m/s',820,325,{size:38,color:MC,anchor:'middle',weight:700}),seg(p,b+.5,b+.58),MC);
  return s+goalTag(G1);
 },
 // 4. 球が受けた −1.2 N·s（左向きの緑）→ 作用・反作用で 壁は ＋1.2 N·s（右向きの緑）
 [K+'imp']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=boxTop({wallHi:1})+dot(XR,yc,BX.r,BALL);
  s+=fade(seg(p,.05,.15),arrow(XR-10,yc+70,XR-200,yc+70,{color:FC,w:7,head:20})+label('球が 受けた −1.2 N·s',255,yc+118,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.08),arrow(BX.x1+8,yc-70,BX.x1+200,yc-70,{color:FC,w:7,head:20})+label('壁が 受けた ＋1.2 N·s',BX.x1+40,yc-110,{size:28,color:FC,weight:700}));
  s+=kindTag('法則',840,400,{g:seg(p,b+.05,b+.12),text:'作用・反作用'});
  return s+goalTag(G1);
 },
 // 5. 答え D（1文目）。誤答 A（2文目）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=boxTop({wallHi:1})+dot(XR,yc,BX.r,BALL)+arrow(XR-10,yc+70,XR-200,yc+70,{color:FC,w:7,head:20})+label('球 −1.2',XR-100,yc+118,{size:26,color:FC,anchor:'middle',weight:700});
  s+=arrow(BX.x1+8,yc-70,BX.x1+200,yc-70,{color:FC,w:7,head:20})+label('壁 ＋1.2',BX.x1+100,yc-110,{size:28,color:FC,anchor:'middle',weight:700});
  s+=wrongCard('A','−1.2 N·s','球が 受けた 量（壁は 逆向き）',{...WR,y:300,g:seg(p,b,b+.06)});
  return s+goalTag(G1)+A1(seg(p,.03,.12));
 },
 // 6. 誤答 B（変化も 0）、C（mvₓ だけ）を1枚ずつ
 [K+'wrongBC']:(p,ctx)=>{
  let s=ballStill(XR-60,{dir:1,lab:'＋0.60'})+fade(.8,arrow(XR-15,yc+50,XR-105,yc+50,{color:MC,w:6,head:18})+label('−0.60',XR-60,yc+92,{size:28,color:MC,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['B','0 N·s','向きが 逆なので 変化は 0 でない'],['C','＋0.60 N·s','はね返りで 2倍に なる']],{opts:{...WR,y:250}});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2：平均の力 =================
 [K+'goal2']:(p,ctx)=>ballScene(cueT(ctx),{tags:1})+goalTag(G2,{g:seg(p,.05,.2)}),
 // 8. 往復 2.4 m を水色でなぞる → 2.4÷3.0＝0.80 s（金）
 [K+'trip']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=boxTop()+dot(XR,yc-40,BX.r,BALL)+loop(lin(p,.12,b-.02));
  s+=fade(seg(p,.05,.12),label('同じ 壁に 次に 当たるまで',820,170,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(560,250,520,100,label('2.4 ÷ 3.0 ＝ 0.80 s',820,314,{size:40,color:TCOL,anchor:'middle',weight:700}),seg(p,b,b+.08),TCOL);
  s+=fade(seg(p,b+.2,b+.3),label('0.80 秒 ごとに 当たる',820,400,{size:28,color:TCOL,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 9. F–t グラフ：0.80 s ごとに細いとげ（幅は大きく誇張）。1本のとげの面積 1.2 N·s
 [K+'spike']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=ftGraph({g:seg(p,.03,.12),gap:seg(p,.25,.35),hi:seg(p,b,b+.08),lab:seg(p,b+.1,b+.18)});
  s+=note('（とげの 幅は 大きく 誇張）',900,120,{g:seg(p,.15,.25)});
  return s+goalTag(G2);
 },
 // 10. とげが 0.80 s 幅の長方形へ（面積は同じ）。高さ 1.2÷0.80＝1.5 N
 [K+'avg']:(p)=>{
  let s=ftGraph({m:seg(p,.08,.4),hi:1-seg(p,.05,.1)});
  s+=fade(seg(p,.1,.2)*(1-seg(p,.4,.45)),label('面積は 同じ まま',900,140,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(640,110,480,84,label('1.2 ÷ 0.80 ＝ 1.5 N',880,166,{size:36,color:FC,anchor:'middle',weight:700}),seg(p,.45,.55),FC);
  s+=ftGraph({m:1,avgLab:seg(p,.55,.65),g:0.001});
  s+=fade(seg(p,.55,.65),line(FG.x-8,gY(1.5),FG.x+8,gY(1.5),{color:FC,w:3})+label('1.5 N',FG.x-14,gY(1.5)+9,{size:26,color:FC,anchor:'end',weight:700}));
  s+=fade(seg(p,.7,.8),label('これが 平均の 力',880,240,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 11. 答え C（1文目）。mvₓ²/L に代入する項を順に光らせる（2文目）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3,hl=k=>seg(p,b+.12*k,b+.12*k+.06)>.5;
  let s=fade(.6*(1-seg(p,b-.05,b)),ftGraph({m:1,avgLab:1}))+card(200,110,800,150,TX(`\\overline{{\\color{${FC}}F}}=\\dfrac{m{\\color{${VCOL}}v_x}^2}{${'{\\color{'+LC+'}L}'}}`,600,190,54),seg(p,b-.02,b+.04),C.faint);
  const num=`\\dfrac{{\\color{${hl(0)?C.hi:C.ink}}0.20}\\times{\\color{${hl(1)?C.hi:VCOL}}3.0}^2}{{\\color{${hl(2)?C.hi:LC}}1.2}}=1.5\\ \\mathrm{N}`;
  s+=card(250,290,700,150,TX(num,600,370,50),seg(p,b+.04,b+.1),FC);
  s+=fade(seg(p,b+.45,b+.55),label('グラフの 1.5 N と 一致',600,480,{size:28,color:FC,anchor:'middle',weight:700}));
  return s+goalTag(G2)+A2(seg(p,.03,.12));
 },
 // 12. 誤答 D（片道 0.40 s）。往復の線のうち片道だけを赤で
 [K+'wrongD']:(p)=>{
  let s=boxTop()+dot(XR,yc-40,BX.r,BALL)+loop(1,{redLeg:seg(p,.1,.2)});
  s+=fade(seg(p,.1,.2),label('片道 1.2 m',(XR+BX.x0+BX.r+4)/2,yc-56,{size:26,color:RED,anchor:'middle',weight:700}));
  s+=wrongCard('D','3.0 N','片道 0.40 s で 割った',{...WR,y:200,g:seg(p,.03,.1)});
  return s+goalTag(G2)+A2(1);
 },
 // 13. 誤答 B（1回の力積 0.60）、A（2乗しなかった）を1枚ずつ
 [K+'wrongBA']:(p,ctx)=>{
  let s=card(200,100,800,130,TX(`\\overline{{\\color{${FC}}F}}=\\dfrac{2m{\\color{${VCOL}}v_x}}{0.80}=\\dfrac{m{\\color{${VCOL}}v_x}^2}{${'{\\color{'+LC+'}L}'}}=1.5\\ \\mathrm{N}`,600,170,40),1,C.faint);
  s+=wrongSeq(p,ctx,[['B','0.75 N','1回の 力積を 0.60 と した'],['A','0.50 N','vₓ を 2乗しなかった（単位 kg/s）']],{opts:{y:290}});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3：vₓ² の平均 =================
 // 14. 暗転して、4個の分子と札「2、2、4、4」の図へ
 [K+'goal3']:(p,ctx)=>fourMol(cueT(ctx),{g:seg(p,.05,.2)})+goalTag(G3,{g:seg(p,.05,.2)}),
 // 15. 2乗した値 4、4、16、16 を順に → 合計 40
 [K+'sq']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const sq=[0,1,2,3].map(i=>seg(p,b+.08*i,b+.08*i+.05));
  let s=fourStill({sq});
  s+=fade(seg(p,.05,.15),label('1個ずつ 2乗 してから 平均',600,120,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(300,370,600,90,label('4 ＋ 4 ＋ 16 ＋ 16 ＝ 40',600,430,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,b+.38,b+.46),C.hi);
  return s+goalTag(G3);
 },
 // 16. 40÷4＝10。答え B（2文目）
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=fourStill({sq:[1,1,1,1]});
  s+=card(300,370,600,90,TX(`${AVX}=40\\div4=10\\ \\mathrm{m^2/s^2}`,600,422,40),seg(p,.03,.12),C.hi);
  return s+goalTag(G3)+A3(seg(p,b,b+.08));
 },
 // 17. 誤答 C（平均の速さ 3 を先に出して2乗）。2文目で「2乗の平均 10」「平均の2乗 9」を並べる
 [K+'wrongC']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=fade(.6*(1-seg(p,b-.05,b)),fourStill({sq:[1,1,1,1]}))+card(120,100,460,170,label('2乗の 平均',350,150,{size:30,color:C.ink,anchor:'middle',weight:700})+label('(4＋4＋16＋16)÷4 ＝ 10',350,220,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,b,b+.06),C.hi);
  s+=card(620,100,460,170,label('平均の 2乗',850,150,{size:30,color:C.ink,anchor:'middle',weight:700})+label('(2＋2＋4＋4)÷4 ＝ 3 → 3² ＝ 9',850,220,{size:28,color:C.dim,anchor:'middle',weight:700}),seg(p,b+.1,b+.16),C.faint);
  s+=fade(seg(p,b+.2,b+.26),label('≠',600,200,{size:48,color:RED,anchor:'middle',weight:700}));
  s+=wrongCard('C','9','平均の 速さ 3 を 先に 出して 2乗',{y:330,g:seg(p,.02,.08)});
  return s+goalTag(G3)+A3(1);
 },
 // 18. 誤答 A（2乗していない）、D（個数で割り忘れ）を1枚ずつ
 [K+'wrongAD']:(p,ctx)=>{
  let s=fade(.6,fourStill({sq:[1,1,1,1]}));
  s+=wrongSeq(p,ctx,[['A','3','2乗していない（単位 m/s）'],['D','40','個数で 割り忘れ']],{opts:{y:380}});
  return s+goalTag(G3)+A3(1);
 },
 // 19. 4 m/s の分子の壁は、2 m/s の分子の2倍の回数光り、1回の光も大きい
 [K+'why']:(p,ctx)=>{
  let s=lanes(tAt(ctx,K+'why'),{g:seg(p,.03,.12)});
  s+=fade(seg(p,.55,.65),label('強く 当たる × 何度も 戻る → 2乗',600,490,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p)=>{
  let s=card(80,80,480,170,label('衝突 1回の 力積',320,122,{size:26,color:C.dim,anchor:'middle',weight:700})+TX(`2m{\\color{${VCOL}}v_x}`,320,206,40),seg(p,.03,.12),FC);
  s+=card(640,80,480,170,label('戻るまでの 時間',880,122,{size:26,color:C.dim,anchor:'middle',weight:700})+TX(`\\dfrac{2{\\color{${LC}}L}}{{\\color{${VCOL}}v_x}}`,880,218,36),seg(p,.2,.3),TCOL);
  s+=fade(seg(p,.4,.5),arrow(600,258,600,292,{color:C.hi,w:4,head:14}));
  s+=card(250,300,700,170,TX(`{\\color{${FC}}P}=\\dfrac{Nm${AVX}}{{\\color{${LC}}V}}`,600,396,58),seg(p,.5,.62),C.hi);
  s+=answerRow([[1,'D','＋1.2 N·s'],[2,'C','1.5 N'],[3,'B','10 m²/s²']],{size:22,g:seg(p,.03,.12)});
  return s;
 },
};
