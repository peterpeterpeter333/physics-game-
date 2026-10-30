// 問題編 解説「近づく列車の警笛」(ys-qx-hs-w-doppler-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/303_ドップラー効果.md の q-hs-w-doppler-1（解説 22 行）。
// 出題中の図に合わせ、列車は右から左へ進み、聞き手は左に止まって立つ（元の単元動画とは左右が逆）。
// 色（01_共通の約束）：波長 λ 水色、周期 T・時間 金、振動数 f 桃、速さ V・vs 紫（山の進み VT も紫）、列車の進み vsT 赤、強調 黄。
// 円の図は、列車の速さを 0.25V に大げさに描く（注記を出す）。コマ送りの1次元の図は実際の比 40/340 で描く。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-w-doppler-1）の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,clamp} from './anim.mjs';
import {T2,LC,TCOL,FC,VCOL,Tt,ft,HZ,SS,MM,SC,WF,Vt,vst,fp,eqRow,LF,listener,fronts,crestEdges,plate,dbl} from './yt1-hs-w-doppler-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongSeq,wrongCard,tAt,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-w-doppler-1:';
const OK=C.F,BAD='#ff6b6b';
const G1='前方の波長 λ前',G2='聞こえる振動数 f′',G3='680 Hz になる理由';
const A1=g=>answerTag(1,'C','0.50 m',{g}),A2=g=>answerTag(2,'A','680 Hz',{g}),A3=g=>answerTag(3,'D','前方の波長が縮み、1秒に届く山の数が増える',{g});
// ---- the train (faces left; (x,y) is where the sound comes from) ---------------------------------
export function locomotive(x,y,{s=1,g=1}={}){
 const W=150*s,H=52*s,x0=x-W/2,y0=y-H/2;
 let o=rect(x0+W+8*s,y0+6*s,110*s,H-6*s,{fill:'#c9d3e4',fo:.9,stroke:'#9aa8c0',sw:2,rx:8*s});   // the car behind
 o+=`<polygon points="${x0+18*s},${y0} ${x0+W},${y0} ${x0+W},${y0+H} ${x0},${y0+H} ${x0},${y0+22*s}" fill="#e8eef8" fill-opacity=".97" stroke="#b9c6da" stroke-width="2"/>`;
 o+=rect(x0,y0+H-16*s,W,8*s,{fill:SC,fo:.9,stroke:'none',rx:2});
 o+=rect(x0+16*s,y0+8*s,26*s,16*s,{fill:'#7fb6ff',fo:.75,stroke:'none',rx:3});
 o+=rect(x0+56*s,y0+8*s,22*s,16*s,{fill:'#7fb6ff',fo:.6,stroke:'none',rx:3})+rect(x0+92*s,y0+8*s,22*s,16*s,{fill:'#7fb6ff',fo:.6,stroke:'none',rx:3});
 o+=rect(x-10*s,y0-12*s,30*s,12*s,{fill:'#ffcf67',fo:1,stroke:'none',rx:4});   // horn (yellow)
 for(const dx of [22,62,112,150,210])o+=ring(x0+dx*s,y0+H+6*s,9*s,{color:C.dim,w:3,fill:C.bg});
 return fade(g,o);
}
// 線路（横長）
function track(y,{x0=40,x1=1160,g=1}={}){let s=line(x0,y,x1,y,{color:C.dim,w:3});for(let x=x0+10;x<x1;x+=34)s+=line(x,y+5,x+16,y+5,{color:C.faint,w:4});return fade(g,s);}
// ---- wavefront picture: the train moves LEFT, listener on the left -------------------------------
export const WQ={y:270,Vd:150,Td:.55,k:-.25};
const qX=(t,xs0)=>xs0+WQ.k*WQ.Vd*t;
const exagg=(g=1)=>plate('（図は、列車の速さを 大げさに 描いています）',600,505,{size:22,color:C.dim,weight:400,g});
function waveScene(t,{xs0,g=1,circles=1,front=0,frontW=3,centres=0,note:nt=1,tmin=-10}={}){
 let s=track(WQ.y+42);
 s+=circles>0?fronts(t,{o:WQ,k:WQ.k,xs0,tmin,g:circles}):'';
 s+=locomotive(qX(t,xs0),WQ.y);
 if(centres){const yc=WQ.y+64;const n1=Math.floor(t/WQ.Td+1e-9);let c='';for(let n=Math.ceil(tmin/WQ.Td);n<=n1;n++){const te=n*WQ.Td,cx=qX(te,xs0);if(WQ.Vd*(t-te)<700&&cx<1220&&cx>150)c+=dot(cx,yc,7,SC);}s+=fade(centres,c);}
 s+=listener(100,WQ.y-40,{lab:''});
 if(front){const e=crestEdges(t,{o:WQ,k:WQ.k,xs0,side:-1,count:2}).sort((a,b)=>a-b);
  if(e.length===2)s+=fade(front,dbl(e[0],e[1],WQ.y+100,LC,{w:frontW})+plate('詰まる',(e[0]+e[1])/2,WQ.y+140,{color:LC}));}
 if(nt)s+=exagg(nt);
 return fade(g,s);
}
const Vcard=(g=1)=>card(450,4,300,64,label('V ＝ 340 m/s',600,47,{size:28,color:VCOL,anchor:'middle',weight:700}),g,VCOL);
// 出題中の図：列車が右から来て、画面の中ほどで止まる（円は描かない）
const XS_STOP=640;
function setupLabels(xs,g=1){
 return fade(g,plate('600 Hz',xs,WQ.y-74,{size:28,color:FC})+arrow(xs-60,WQ.y-120,xs-190,WQ.y-120,{color:VCOL,w:5,head:16})+plate('40 m/s',xs+30,WQ.y-112,{size:26,color:VCOL}));
}
// ---- frame by frame (to scale: vs/V＝40/340) ------------------------------------------------------
export const FQ={y:345,x0:1030,VT:720,k:40/340};
export function frameQ({u=1,c2=0,vt=0,vs=0,gap=0,nums=0,g=1,lis=1,t0=0,labs=1,gapHi=0}={}){
 const X0=FQ.x0,yA=FQ.y,xc=X0-FQ.VT*u,xs=X0-FQ.k*FQ.VT*u;
 let s=line(60,yA+46,1150,yA+46,{color:C.faint,w:2});
 s+=line(xc,yA-80,xc,yA+40,{color:WF,w:6})+(labs?label('山1',xc,yA-92,{size:26,color:WF,anchor:'middle',weight:700}):'');
 if(c2)s+=fade(c2,line(xs,yA-80,xs,yA+40,{color:WF,w:6})+(labs?label('山2',xs-34,yA-92,{size:26,color:WF,anchor:'middle',weight:700}):''));
 s+=locomotive(xs,yA,{s:.7});
 s+=dot(X0,yA+46,7,C.dim);
 if(t0)s+=fade(t0,label('時刻 0 に 出した 場所',X0,yA+88,{size:24,color:TCOL,anchor:'middle',weight:700}));
 const ya=yA-140,yb=yA+86;
 if(vt&&u>.01){s+=fade(vt,line(X0,ya-14,X0,ya+14,{color:VCOL,w:2}))+arrow(X0,ya,xc,ya,{color:VCOL,w:5,head:16,g:vt});
  if(labs)s+=fade(vt*seg(u,.6,.9),nums?label('0.567 m',(X0+xc)/2,ya-16,{size:28,color:VCOL,anchor:'middle',weight:700}):tex(`${Vt}${Tt}`,(X0+xc)/2,ya-26,{size:36}));}
 if(vs&&u>.01){s+=arrow(X0,yb,xs,yb,{color:SC,w:5,head:12,g:vs});
  if(labs)s+=fade(vs*seg(u,.6,.9),nums?label('0.067 m',(X0+xs)/2,yb+44,{size:26,color:SC,anchor:'middle',weight:700}):tex(`{\\color{${SC}}v_s}${Tt}`,(X0+xs)/2,yb+36,{size:34}));}
 if(gap){s+=fade(gap,dbl(xc,xs,yb,LC,{w:4+4*gapHi,head:14}));
  if(labs)s+=fade(gap,nums?label('0.50 m',(xc+xs)/2,yb+44,{size:30,color:LC,anchor:'middle',weight:700}):eqRow(LF,(xc+xs)/2,yb+36,{size:40}));}
 if(lis)s+=listener(110,yA-40,{lab:'聞き手',s:.75});
 return fade(g,s);
}
// ---- crests passing a gate at the listener (moving left) ----------------------------------------
export function gate(t,{sp=50,v=110,lx=260,y=300,g=1,x0=60,x1=1150,glab=1}={}){
 let s='';const off=((-v*t)%sp+sp)%sp;
 for(let x=x0+off;x<x1;x+=sp)s+=line(x,y-70,x,y+70,{color:WF,w:4});
 s+=listener(lx,y-40,{lab:''});
 s+=rect(lx-62,y-118,12,210,{fill:C.hi,fo:.85,stroke:'none',rx:3})+rect(lx+50,y-118,12,210,{fill:C.hi,fo:.85,stroke:'none',rx:3});
 s+=rect(lx-74,y-132,148,18,{fill:C.hi,fo:.85,stroke:'none',rx:4});
 if(glab)s+=label('門',lx,y-146,{size:28,color:C.hi,anchor:'middle',weight:700});
 return fade(g,s);
}
// f′ ＝ f × V/(V−vs) with the denominator boxed (hl)
function fFormula(cx,y,{size=50,hl=0,g=1}={}){
 const boxed=col=>`${fp}=${ft}\\times\\dfrac{${Vt}}{{\\color{${col}}\\boxed{${Vt}{\\color{${C.ink}}\\mathbin{-}}${vst}}}}`;
 return fade(g,fade(1-hl,tex(boxed('#131f38'),cx,y,{size}))+fade(hl,tex(boxed(C.hi),cx,y,{size})));
}
// ---- a row of crests in front of the listener; the window [x, x+L] is "the 340 m in front" ---------
export const WIN={x:150,L:940,y:320,sp:940/24};
function crestRow(sh,{bracket=1,mark=0,g=1}={}){
 const {x,L,y,sp}=WIN;let s=line(60,y+60,1180,y+60,{color:C.faint,w:2});
 for(let i=1;i<=30;i++){const X=x+sp*i-sh;if(X<60||X>1180)continue;
  const inW=x+sp*i<=x+L+1,passed=X<x-2,isM=i===24;
  const col=isM&&mark?C.hi:WF,op=passed?.35:inW?1:.4;
  s+=fade(op,line(X,y-60,X,y+50,{color:col,w:isM&&mark?7:4}));}
 s+=listener(x-50,y-40,{lab:'',s:.8})+label('聞き手',x-50,y+90,{size:24,color:C.dim,anchor:'middle',weight:700});
 if(bracket){s+=fade(bracket,line(x,y-110,x,y+60,{color:VCOL,w:2,dash:'6 6'})+line(x+L,y-110,x+L,y+60,{color:VCOL,w:2,dash:'6 6'})+dbl(x,x+L,y-90,VCOL,{w:4,head:14}));
  s+=plate('聞き手の 手前 340 m',x+L/2,y-104,{size:28,color:VCOL,g:bracket});}
 if(mark)s+=fade(mark,label('340 m 先に いた 山',Math.max(x+sp*24-sh,x+40),y+128,{size:24,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
// ---- the two rulers (rows 8–9) ------------------------------------------------------------------
function rulers(p,{hiRed=0}={}){
 const P=1100,x0=150,a=.567*P,b=.5*P;
 let s='';
 s+=fade(seg(p,.03,.18),label('止まっていれば',x0,118,{size:26,color:C.dim,weight:700})+dbl(x0,x0+a,150,C.dim,{w:4})+label('340 ÷ 600 ≈ 0.57 m',x0+a+20,160,{size:28,color:C.dim,weight:700}));
 s+=fade(seg(p,.35,.5),label('列車の 前方',x0,228,{size:26,color:LC,weight:700})+dbl(x0,x0+b,260,LC,{w:5})+label('0.50 m',x0+b+20,270,{size:30,color:LC,weight:700}));
 s+=fade(seg(p,.35,.5),line(x0,130,x0,280,{color:C.faint,w:2,dash:'6 6'})+line(x0+b,240,x0+b,170,{color:SC,w:2,dash:'5 5'}));
 s+=fade(seg(p,.55,.7),line(x0+b,196,x0+a,196,{color:SC,w:6+6*hiRed})+label('縮んだ分 0.067 m（列車の 進み）',x0+a+20,214,{size:24,color:SC,weight:700}));
 return s;
}
// ---- the table (rows 18–21). op＝各行の濃さ [1行目, 2行目, 3行目] ----------------------------------
function table(op=[1,1,1],{hi3=0,y0=106}={}){
 const rows=[['前方の 波長','0.57 m','0.50 m','変わった',LC],['1秒に 届く 山の 数','600個','680個','変わった',FC],['音の 速さ V','340 m/s','340 m/s','変わらない',VCOL]];
 let s=card(60,y0,1080,232,'',1,C.dim);
 s+=label('止まった 列車',640,y0+42,{size:24,color:C.dim,anchor:'middle',weight:700})+label('近づく 列車',820,y0+42,{size:24,color:C.dim,anchor:'middle',weight:700});
 rows.forEach(([a,b,c,d,col],i)=>{const y=y0+100+i*56,o=op[i]??0;
  if(i===2&&hi3)s+=fade(hi3*o,rect(76,y-38,1048,52,{fill:C.hi,fo:.10,stroke:C.hi,sw:2.5,rx:10}));
  s+=fade(o,label(a,100,y,{size:28,color:col,weight:700})+label(b,640,y,{size:28,color:C.ink,anchor:'middle'})+label(c,820,y,{size:28,color:C.ink,anchor:'middle',weight:700})+label(d,1010,y,{size:26,color:i<2?OK:C.dim,anchor:'middle',weight:700}));});
 return s;
}

export const qxHsWDoppler1Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約5秒＋静止）=================
 // 線路、右から左へ進む列車（警笛 黄）、600 Hz（桃）、左向きの紫の矢印と 40 m/s、左端に止まって立つ聞き手と「止まっている」、上の中央に V＝340 m/s。
 // 山の円は描かない（前方で間隔が詰まる様子は答えにつながる）。列車が画面の中ほどに来た所で止まる。
 [K+'q0']:(p)=>{
  const xs=1060+(XS_STOP-1060)*(1-(1-clamp(p/.9))**2);
  let s=track(WQ.y+42)+locomotive(xs,WQ.y)+setupLabels(xs);
  s+=listener(100,WQ.y-40,{lab:''})+label('聞き手',100,WQ.y+120,{size:24,color:C.dim,anchor:'middle',weight:700})+label('止まっている',100,WQ.y+154,{size:24,color:C.dim,anchor:'middle'});
  s+=Vcard();
  return s;
 },
 // ================= S1 小問1：前方の波長 =================
 // 1. 出題中の図から始め、山の円が広がる。600 Hz・40 m/s は円が出ると同時に消える。終わりぎわに「詰まる」
 [K+'setup']:(p)=>{
  const tw=6*p,o=seg(p,.3,.45),xs=qX(tw,XS_STOP);
  let s=waveScene(tw,{xs0:XS_STOP,circles:o,front:seg(p,.72,.85),note:o});
  s+=setupLabels(xs,1-o);
  s+=fade(1-o,label('聞き手',100,WQ.y+120,{size:24,color:C.dim,anchor:'middle',weight:700})+label('止まっている',100,WQ.y+154,{size:24,color:C.dim,anchor:'middle'}));
  s+=plate('山 ＝ 空気が 押し縮められた 所（円で 描く）',340,112,{size:24,color:WF,g:seg(p,.35,.5)});
  s+=Vcard();
  return s;
 },
 // 2. 求めるもの：前方の波長。前方の「詰まる」を水色で光らせる
 [K+'goal1']:(p,ctx)=>{
  const tw=6+.5*cueT(ctx),hi=seg(p,.3,.45);
  let s=waveScene(tw,{xs0:XS_STOP,front:1,frontW:3+3*hi});
  const e=crestEdges(tw,{o:WQ,k:WQ.k,xs0:XS_STOP,side:-1,count:2}).sort((a,b)=>a-b);
  if(e.length===2)s+=fade(hi*(.55+.45*Math.sin(cueT(ctx)*5)**2),rect(e[0]-8,WQ.y+84,e[1]-e[0]+16,32,{fill:LC,fo:.25,stroke:LC,sw:3,rx:8}));
  s+=plate('山 ＝ 空気が 押し縮められた 所（円で 描く）',340,112,{size:24,color:WF});
  s+=Vcard(1-seg(p,0,.12));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 周期 T＝1/600 s。コマ送りの1次元の図へ
 [K+'T']:(p)=>{
  let s=frameQ({u:0,t0:seg(p,.5,.65)});
  s+=card(470,4,330,96,T2(`${Tt}=\\dfrac{1}{600}${SS}`,635,58,{size:36}),seg(p,.05,.2),TCOL);
  s+=fade(seg(p,.55,.7),plate('山1 を 出す',FQ.x0-70,FQ.y-140,{size:26,color:WF}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 1周期のあいだに、山1は VT、列車は vsT 進んで、山2を出す
 [K+'adv']:(p)=>{
  const u=lin(p,.12,.62);
  let s=frameQ({u,vt:seg(p,.08,.2),vs:seg(p,.3,.45),c2:seg(p,.68,.82)});
  s+=fade(seg(p,.62,.75),label('VT ＝ 音の 速さ × 時間 ＝ 山1が 進んだ 距離',40,120,{size:24,color:VCOL,weight:700})+label('vsT ＝ 列車が 進んだ 距離',1160,505,{size:24,color:SC,anchor:'end',weight:700}));
  s+=card(890,4,300,64,label(`時間 ${u<.999?'…':'T'}`,1040,47,{size:28,color:TCOL,anchor:'middle',weight:700}),seg(p,0,.1),TCOL);
  s+=goalTag(G1);
  return s;
 },
 // 5. 前方の波長はその差。λ前＝VT−vsT → 共通の T を光らせて、T でくくる
 [K+'diff']:(p)=>{
  let s=frameQ({vt:1,vs:1,c2:1,gap:seg(p,.05,.2)});
  const tT=seg(p,.5,.58)>.5?C.hi:TCOL;
  s+=card(450,4,740,100,fade(1-seg(p,.66,.7),eqRow([...LF,`=${Vt}{\\color{${tT}}T}-${vst}{\\color{${tT}}T}`],820,58,{size:42}))+fade(seg(p,.7,.78),eqRow([...LF,`=(${Vt}-${vst})${Tt}`],820,58,{size:42})),seg(p,.15,.3),LC);
  s+=fade(seg(p,.7,.8),label('T で くくる',1100,140,{size:24,color:TCOL,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 6. T＝1/f を代入 → (340−40)/600＝0.50 m。図の文字が数に変わる
 [K+'num']:(p)=>{
  const o3=seg(p,.75,.88);
  let s=frameQ({vt:1,vs:1,c2:1,gap:1,nums:o3>.5?1:0});
  let eq=fade(1-seg(p,.05,.11),eqRow([...LF,`=(${Vt}-${vst})${Tt}`],820,60,{size:40}));
  eq+=fade(seg(p,.12,.2)*(1-seg(p,.4,.46)),eqRow([...LF,`=\\dfrac{${Vt}-${vst}}{${ft}}`],820,64,{size:38}));
  eq+=fade(seg(p,.47,.55),eqRow([...LF,`=\\dfrac{340-40}{600}=\\dfrac{300}{600}=0.50${MM}`],820,64,{size:36}));
  s+=card(450,4,740,112,eq,1,LC);
  s+=fade(seg(p,.05,.15)*(1-seg(p,.42,.5)),label('T＝1/f を 代入',1100,150,{size:24,color:TCOL,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 7. 小問1 の答え C
 [K+'ans1']:(p)=>{
  let s=frameQ({vt:1,vs:1,c2:1,gap:1,nums:1,gapHi:seg(p,.1,.3)});
  s+=goalTag(G1)+A1(seg(p,.05,.2));
  return s;
 },
 // 8. 物差しを上下に並べる（止まっていれば 0.57 m → 0.50 m）。誤答 A
 [K+'still']:(p)=>{
  let s=rulers(p);
  s+=goalTag(G1)+A1(1);
  s+=wrongCard('A','0.57 m','音源が 動いても 波長は 変わらない、と した',{g:seg(p,.72,.82)});
  return s;
 },
 // 9. 誤答 B（後方の波長）、誤答 D（列車の進み）。1枚ずつ。D の間、赤い太線を点滅
 [K+'wrongBD']:(p,ctx)=>{
  const W=sentWin(ctx),inD=seg(p,W[1]?W[1][0]:.5,(W[1]?W[1][0]:.5)+.03),bl=inD*(.5+.5*Math.sin(cueT(ctx)*7));
  let s=rulers(1,{hiRed:bl});
  s+=goalTag(G1)+A1(1);
  s+=wrongSeq(p,ctx,[['B','0.63 m','前方なのに V＋vs を 使った（後方の 波長）'],['D','0.067 m','1周期に 列車が 進む 距離を、波長と した']]);
  return s;
 },
 // 10. 縮んだ理由：山の出発点が前へずれた（音が遅くなったのではない）
 [K+'shift']:(p,ctx)=>{
  const t=.8*cueT(ctx);
  let s=waveScene(t,{xs0:900,centres:seg(p,.05,.2)});
  s+=plate('赤い 点 ＝ 山を 出した 場所',800,WQ.y+100,{size:26,color:SC,g:seg(p,.1,.25)});
  s+=card(150,90,420,70,label('○ 出発点が 前へ ずれた',360,137,{size:30,color:OK,anchor:'middle',weight:700}),seg(p,.15,.3),OK);
  s+=card(630,90,420,70,label('× 音が 遅くなった',840,137,{size:30,color:BAD,anchor:'middle',weight:700}),seg(p,.55,.7),BAD);
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：聞こえる振動数 =================
 // 11a. 求めるもの：聞こえる振動数。門の図へ（山が門を通る）
 [K+'gate0']:(p,ctx)=>{
  let s=gate(tAt(ctx,K+'gate0'));
  s+=goalTag(G2,{g:seg(p,.05,.2)});
  return s;
 },
 // 11b. 聞き手のところを山が通る速さは V のまま
 [K+'gate']:(p,ctx)=>{
  const t=tAt(ctx,K+'gate0');
  let s=gate(t);
  s+=arrow(700,130,500,130,{color:VCOL,w:6,head:18,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('V ＝ 340 m/s の まま',730,140,{size:30,color:VCOL,weight:700}));
  s+=fade(seg(p,.3,.45),label('山の 間隔 0.50 m',800,450,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('（動きは ゆっくり 描いています）',800,495,{size:22,color:C.dim,anchor:'middle'}));
  s+=goalTag(G2);
  return s;
 },
 // 12. 1秒の間に通る山 ＝ 聞き手の手前 340 m までにある山
 [K+'window']:(p)=>{
  const u=lin(p,.5,.92),sh=WIN.L*u;
  let s=crestRow(sh,{bracket:seg(p,.18,.32),mark:seg(p,.4,.5)});
  s+=fade(seg(p,.03,.15),arrow(780,130,580,130,{color:VCOL,w:6,head:18})+label('山は 1秒に 340 m 進む',800,140,{size:28,color:VCOL,weight:700}));
  s+=card(30,90,190,60,label(u<.999?`時間 ${u<.01?'0':'…'}`:'1秒後',125,130,{size:28,color:TCOL,anchor:'middle',weight:700}),seg(p,.45,.52),TCOL);
  s+=fade(seg(p,.9,.97),plate('340 m の 中の 山が 全部 通った',600,505,{size:26,color:C.hi}));
  s+=goalTag(G2);
  return s;
 },
 // 13. 340 m の中に 0.50 m おき → 680 個
 [K+'count']:(p)=>{
  let s=crestRow(0,{bracket:1,mark:0});
  const x1=WIN.x+WIN.sp*3,x2=WIN.x+WIN.sp*4;
  s+=fade(seg(p,.05,.2),dbl(x1,x2,WIN.y+96,LC,{w:4,head:12})+label('0.50 m',(x1+x2)/2,WIN.y+136,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('（山の 数は 省略して 描いています）',850,WIN.y+136,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(450,4,500,84,T2(`340\\div 0.50=680`,700,56,{size:40}),seg(p,.5,.62),FC);
  s+=fade(seg(p,.7,.82),plate('1秒に 680個 の 山が 聞き手を 通る',600,505,{size:28,color:FC}));
  s+=goalTag(G2);
  return s;
 },
 // 14. 600 Hz → 680 Hz。聞こえる振動数＝1秒に届く山の数。小問2 の答え A
 [K+'hear']:(p,ctx)=>{
  const t=tAt(ctx,K+'hear'),W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=fade(.25,gate(t,{y:400,glab:0}));
  s+=card(250,100,700,120,T2(`600${HZ}\\ \\rightarrow\\ 680${HZ}`,600,170,{size:50}),seg(p,.03,.15),FC);
  s+=label('警笛の 振動数',435,258,{size:24,color:C.dim,anchor:'middle',opacity:seg(p,.08,.2)})+label('聞こえる 振動数',770,258,{size:24,color:FC,anchor:'middle',opacity:seg(p,.08,.2)});
  s+=fade(seg(p,.25,.37),plate('聞こえる 振動数 ＝ 1秒に 届く 山の 数',600,320,{size:28,color:FC}));
  s+=goalTag(G2)+A2(seg(p,b,b+.08));
  return s;
 },
 // 15. 式でも f′＝f×V/(V−vs)＝600×340/300＝680 Hz。一致
 [K+'formula']:(p)=>{
  let s=card(150,90,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}-${vst}}`,600,170,{size:46}),seg(p,.03,.15),C.hi);
  s+=card(150,260,900,130,T2(`600\\times\\dfrac{340}{300}=680${HZ}`,600,330,{size:46}),seg(p,.35,.5),FC);
  s+=fade(seg(p,.7,.85),label('門で 数えた 680個 と 一致',600,450,{size:28,color:OK,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 16. 分母 300＜340 → f′＞f。誤答 B（分母を V＋vs）
 [K+'denom']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(150,86,900,140,fFormula(600,160,{size:42,hl:seg(p,.03,.15)}),1,C.hi);
  s+=fade(seg(p,.1,.25),label('分母 300 ＜ 340　→　f′ ＞ f（高く 聞こえる）',600,262,{size:28,color:FC,anchor:'middle',weight:700}));
  s+=wrongCard('B','537 Hz','分母を V＋vs に した（遠ざかる ときの 式）→ 近づくのに 低くなる',{y:290,mid:`600\\times\\dfrac{340}{340+40}\\approx 537\\ \\mathrm{Hz}`,midSize:30,g:seg(p,b,b+.06)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 17. 誤答 C（600 Hz のまま）、誤答 D（640 Hz：Hz と m/s を足した）
 [K+'wrongCD']:(p,ctx)=>{
  let s=card(150,86,900,140,fFormula(600,160,{size:42,hl:0}),.45,C.hi);
  s+=wrongSeq(p,ctx,[['C','600 Hz','1秒に 届く 山の 数が 増えた ことを 見落とした'],['D','640 Hz','Hz と m/s を 足した']],{opts:{y:290}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：理由 =================
 // 18. 求めるもの：680 Hz になる理由。表の1・2行目を順に
 [K+'reason']:(p,ctx)=>{
  const W=sentWin(ctx),a=W[1]?W[1][0]:.3;
  let s=fade(seg(p,.04,.12),table([seg(p,a+.02,a+.14),seg(p,a+.22,a+.34),0]));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 19. 3行目「音の速さ V 変わらない」。小問3 の答え D
 [K+'reason2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=table([1,1,seg(p,.03,.15)]);
  s+=goalTag(G3)+A3(seg(p,b,b+.08));
  return s;
 },
 // 20. 誤答 A（380 m/s）、誤答 C（300 m/s）。表の3行目を光らせる
 [K+'wrongAC']:(p,ctx)=>{
  let s=table([1,1,1],{hi3:seg(p,.05,.2)});
  s+=wrongSeq(p,ctx,[['A','380 m/s で 届く','音源の 速さは 足されない'],['C','300 m/s に 下がる','空気は 止まっている']],{opts:{y:356,size:26,whySize:24}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 21. 誤答 B（大きい音は高く聞こえる）
 [K+'wrongB']:(p)=>{
  let s=table([1,1,1]);
  s+=wrongCard('B','大きい 音は 高く 聞こえる','大きさと 高さは 別の 量',{y:356,size:26,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=card(10,8,640,350,'',seg(p,.03,.15),LC)+fade(seg(p,.03,.15),`<g transform="translate(8 -12) scale(.55)">${frameQ({vt:1,vs:1,c2:1,gap:1,lis:0,labs:0})}</g>`);
  s+=fade(seg(p,.03,.15),tex(`${Vt}${Tt}`,376,92,{size:30})+tex(`{\\color{${SC}}v_s}${Tt}`,566,270,{size:28}));
  s+=fade(seg(p,.03,.15),label('λ前 ＝ 0.50 m',330,330,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=card(670,8,520,350,'',seg(p,.25,.4),FC)+fade(seg(p,.25,.4),`<g transform="translate(670 -20) scale(.6)">${gate(t,{lx:300,x0:40,x1:840,glab:0})}</g>`);
  s+=fade(seg(p,.25,.4),label('1秒に 680個 の 山',930,330,{size:28,color:FC,anchor:'middle',weight:700}));
  s+=card(150,375,900,130,T2(`${fp}=600\\times\\dfrac{340}{300}=680${HZ}`,600,444,{size:44}),seg(p,.45,.6),C.hi);
  return s;
 },
};
