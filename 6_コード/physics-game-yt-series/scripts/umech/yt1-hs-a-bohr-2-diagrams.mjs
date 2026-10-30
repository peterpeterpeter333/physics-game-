// 高校編「物質波とボーア模型・深く学ぶ 2/3」(ys-hs-a-bohr-2) — 図。Stage 1200×515.
// 弦の定常波を輪に曲げる → 円周 2πr＝nλ（仮定）→ 量子条件 mvr＝nh/(2π)（結果）→ n＝1 の数値例。
// 色は 1/3 と同じ：λ 水色、v 紫、n 黄、r 白、電子 青、原子核 赤。2周目の波は桃（1周目と区別）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp,mix} from './anim.mjs';
import {card,tag,electron,LC,VC,PC,EC,NEG,POS,NC,RC,BAD,OK,cs,lam,pt,vt,rt,nt,U,TX,fcard,LAMDEF,LAMMV,cross,okMark,nucleus,wave,span,ladder,atomOrbit,ringWave,jt} from './yt1-hs-a-bohr-1-diagrams.mjs';

const K='hs-a-bohr-2:';
const PI=Math.PI;
const sceneT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
const W2=C.p;
const CIRC=`2\\pi ${rt}=${nt}${lam}`, QC=`m${vt}${rt}=\\dfrac{${nt}h}{2\\pi}`;
// ---- string → ring morph ----------------------------------------------------------------------------
// string of length Ls (px) centred at (cx,cy); u＝0 straight, u＝1 closed circle (radius Ls/2π). k = wavelengths along the length.
function bent(u,{cx=600,cy=300,Ls=760,k=3,A=26,ph=0,g=1,color=LC,w=4,stand=false,posts=0}={}){
 const pts=[],base=[];const N=300;
 const th=2*PI*Math.max(u,1e-4),R=Ls/th; // arc angle and radius; arc symmetric about the bottom point (cx, cy)
 for(let i=0;i<=N;i++){const s=i/N,a=-PI/2+th*(s-.5);
  const bx=cx+R*Math.cos(a),by=cy-R-R*Math.sin(a)+0; // centre at (cx, cy-R), bottom point at (cx, cy)
  const nx=Math.cos(a),ny=-Math.sin(a); // outward normal (screen coords: y up negative)
  const amp=stand?A*Math.sin(k*PI*s)*Math.cos(2*PI*ph):A*Math.sin(2*PI*(k*s-ph));
  const ox=bx,oy=by;base.push([ox,oy]);
  pts.push([ox-nx*amp,oy-ny*amp]);}
 // flip so the straight string lies horizontally (u≈0 → R huge, arc ≈ horizontal line at y=cy)
 let s=fade(g*.6,draw(base,1,{color:C.faint,w:2,dash:'6 7'}))+fade(g,draw(pts,1,{color,w}));
 if(posts){const [x0,y0]=base[0],[x1,y1]=base[N];s+=fade(g*posts,rect(x0-8,y0-60,16,120,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+rect(x1-8,y1-60,16,120,{fill:'#56627a',fo:1,stroke:C.dim,rx:3}));}
 return s;
}
function stringSW(ph,{n=3,g=1,nodes=1}={}){
 const x0=220,x1=980,y=270,A=70;let s=fade(g,rect(x0-16,y-110,16,220,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+rect(x1,y-110,16,220,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+line(x0,y,x1,y,{color:C.faint,w:2,dash:'6 8'}));
 const pts=[];for(let x=x0;x<=x1;x+=3)pts.push([x,y-A*Math.sin(n*PI*(x-x0)/(x1-x0))*Math.cos(2*PI*ph)]);
 s+=fade(g,draw(pts,1,{color:'#d6deec',w:5}));
 if(nodes)for(let k=0;k<=n;k++)s+=fade(g*nodes,dot(x0+(x1-x0)*k/n,y,10,C.hi));
 return s;
}
// two turns of a k-wave on a circle: turn 1 cyan, turn 2 pink
function twoTurns(cx,cy,R,k,{p1=1,p2=0,A=18,g=1}={}){
 let s=ringWave(cx,cy,R,k,{A,turns:p1,g});
 if(p2>0)s+=ringWave(cx,cy,R,k,{A,turns:p2,from:2*PI,g,color:W2,w:3}).replace(/stroke-width="3"/,'stroke-width="3" stroke-dasharray="8 6"');
 return s;
}
const stepNote=(t,y,g,col=C.hi)=>fade(g,label(t,600,y,{size:28,color:col,anchor:'middle',weight:700})+arrow(600,y+14,600,y+52,{color:col,w:4,head:14}));

export const hsABohr2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  return atomOrbit(330,262,170,{ang:t*.6})+ringWave(330,262,170,5.5,{A:16,g:seg(p,.05,.2)})
   +card(640,150,500,210,label('電子の 波が 安定する',890,225,{size:30,color:C.ink,anchor:'middle'})+label('条件は？',890,305,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
 },
 [K+'recap']:(p)=>fcard(160,110,380,170,LAMDEF,{size:62,col:LC,g:seg(p,.05,.2)})+fcard(660,110,380,170,LAMMV,{size:62,col:LC,g:seg(p,.45,.6)})+fade(seg(p,.45,.6),label('光より ずっと 遅い 電子',850,330,{size:26,color:C.dim,anchor:'middle'})),
 [K+'plan']:(p,ctx)=>stringSW(sceneT(p,ctx)*.6,{g:seg(p,.3,.45)})+fade(seg(p,.5,.65),label('手がかり：弦の 定常波',600,450,{size:32,color:C.hi,anchor:'middle',weight:700})),
 // ================= S2 ボーア模型 =================
 [K+'m1']:(p)=>{
  let s=nucleus(450,262,{r:22,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('原子核（＋）',450,330,{size:28,color:POS,anchor:'middle',weight:700}));
  s+=electron(800,262,{r:16,op:seg(p,.4,.55)})+fade(seg(p,.4,.55),label('電子（−）',800,330,{size:28,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('水素原子',600,120,{size:34,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m2']:(p,ctx)=>{
  const t=sceneT(p,ctx),a=.5+t*.5;
  let s=atomOrbit(400,262,190,{ang:a,orb:seg(p,.05,.25)});
  s+=fade(seg(p,.25,.4),line(400,262,400+190*Math.cos(2.4),262-190*Math.sin(2.4),{color:RC,w:3})+label('r',400+95*Math.cos(2.4)-24,262-95*Math.sin(2.4)+10,{size:32,color:RC,weight:700}));
  s+=card(720,170,420,150,label('ボーア模型',930,262,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'m3']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=atomOrbit(400,262,190,{ang:.5+t*.5});
  s+=tag('仮定',930,170,{color:C.hi,size:30,g:seg(p,.05,.2)});
  s+=card(720,220,420,150,label('模型としての 円軌道',930,285,{size:28,color:C.ink,anchor:'middle',weight:700})+label('（限界は 3本目の 最後）',930,335,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  return s;
 },
 // ================= S3 弦を輪にする =================
 [K+'s1']:(p,ctx)=>stringSW(sceneT(p,ctx)*.6,{nodes:seg(p,.4,.55)})+fade(seg(p,.5,.65),label('両端を 固定した 弦：決まった 波長だけ',600,450,{size:30,color:C.ink,anchor:'middle',weight:700})),
 [K+'s2']:(p,ctx)=>{
  let s=stringSW(sceneT(p,ctx)*.6);
  for(let k=0;k<3;k++)s+=fade(seg(p,.1+k*.12,.2+k*.12),line(220+k*253,380,220+(k+1)*253-6,380,{color:LC,w:4})+label('半波長',220+k*253+126,415,{size:24,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('長さ ＝ 半波長 × 整数',600,475,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s3']:(p,ctx)=>{
  const u=seg(p,.12,.75),t=sceneT(p,ctx);
  let s=bent(u,{cx:600,cy:440,Ls:760,k:3,A:22,ph:t*.3,posts:1-seg(p,.05,.15)});
  s+=fade(seg(p,.75,.88),label('固定：波長の 整数個',1150,120,{size:26,color:LC,anchor:'end',weight:700})+label('変わる：端 → 1周して つながる',1150,165,{size:26,color:C.hi,anchor:'end',weight:700}));
  return s;
 },
 [K+'s4']:(p)=>{
  const tp=seg(p,.05,.6);
  let s=atomOrbit(400,262,170,{el:0})+ringWave(400,262,170,3,{A:22,turns:tp});
  s+=fade(seg(p,.6,.72),ring(570,262,26,{color:OK,w:3})+okMark(640,262,1));
  s+=card(760,160,380,180,label('波長 3個',950,230,{size:32,color:LC,anchor:'middle',weight:700})+label('1周で ぴったり つながる',950,295,{size:26,color:OK,anchor:'middle',weight:700}),seg(p,.6,.75),OK);
  return s;
 },
 [K+'s5']:(p)=>{
  let s=atomOrbit(400,262,170,{el:0})+twoTurns(400,262,170,3.5,{p1:seg(p,.03,.35),p2:seg(p,.38,.7)});
  s+=fade(seg(p,.1,.25),label('1周目',150,70,{size:26,color:LC,weight:700}))+fade(seg(p,.4,.55),label('2周目',150,110,{size:26,color:W2,weight:700}));
  s+=card(760,160,380,180,label('波長 3.5個',950,230,{size:32,color:LC,anchor:'middle',weight:700})+label('逆向きに ずれて 打ち消す',950,295,{size:26,color:BAD,anchor:'middle',weight:700}),seg(p,.7,.82),BAD);
  return s;
 },
 [K+'s6']:(p)=>{
  let s=atomOrbit(300,262,150,{el:0})+ringWave(300,262,150,3,{A:20})+okMark(300,450,seg(p,.1,.25));
  s+=fade(seg(p,.1,.25),atomOrbit(850,262,150,{el:0})+twoTurns(850,262,150,3.5,{p1:1,p2:1,A:20}))+cross(850,450,20,seg(p,.1,.25));
  s+=fade(seg(p,.4,.55),label('整数個',300,60,{size:30,color:OK,anchor:'middle',weight:700})+label('整数個 でない',850,60,{size:30,color:BAD,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s7']:(p)=>{
  let s=atomOrbit(330,262,160,{el:0,ocol:C.ink,dash:''})+ringWave(330,262,160,3,{A:20});
  for(let k=0;k<3;k++){const a=2*PI*(k+.25)/3;s+=fade(seg(p,.5+k*.08,.58+k*.08),label(String(k+1),330+215*Math.cos(a),262-215*Math.sin(a)+10,{size:30,color:NC,anchor:'middle',weight:700}));}
  s+=fcard(640,90,500,150,CIRC,{size:58,col:LC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.3,.45),label('円周',740,290,{size:26,color:C.ink,anchor:'middle',weight:700})+label('n：乗る 波の 個数',990,290,{size:26,color:NC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),TX(`${nt}=1,\\ 2,\\ 3,\\ \\dots`,890,370,{size:40}));
  return s;
 },
 [K+'s8']:(p)=>{
  let s=fcard(350,70,500,150,CIRC,{size:58,col:LC});
  s+=tag('仮定（ボーア模型）',600,280,{color:C.hi,size:28,g:seg(p,.05,.2)});
  s+=card(200,330,800,120,label('そう 決めて → 結果を 実験と 比べる',600,402,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6));
  return s;
 },
 // ================= S4 量子条件を導く =================
 [K+'k1']:(p)=>fcard(150,100,400,150,CIRC,{size:54,col:LC})+fcard(650,100,400,150,LAMMV,{size:54,col:LC,g:seg(p,.2,.35)})+fade(seg(p,.5,.65),label('λ に 入れる',850,310,{size:30,color:C.hi,anchor:'middle',weight:700})+arrow(760,300,430,300,{color:C.hi,w:4,head:14})),
 [K+'k2']:(p)=>fade(.7,TX(CIRC,600,80,{size:40}))+stepNote('λ を h/(mv) に 置きかえる',150,seg(p,.05,.2))+fcard(300,230,600,170,`2\\pi ${rt}=${nt}\\cdot{\\color{${C.hi}}\\dfrac{h}{m${vt}}}=\\dfrac{${nt}h}{m${vt}}`,{size:52,col:LC,g:seg(p,.3,.45)}),
 [K+'k3']:(p)=>{
  const c=seg(p,.35,.5);
  let s=fade(.7,TX(`2\\pi ${rt}=\\dfrac{${nt}h}{m${vt}}`,600,80,{size:40}));
  s+=stepNote('両辺に mv を 掛ける',150,seg(p,.05,.2));
  s+=fcard(300,230,600,170,c<.5?`2\\pi ${rt}\\times m${vt}=\\dfrac{${nt}h}{m${vt}}\\times m${vt}`:`2\\pi ${rt}\\times m${vt}=\\dfrac{${nt}h}{\\cancel{m${vt}}}\\times \\cancel{m${vt}}`,{size:46,col:C.hi,g:seg(p,.2,.35)});
  s+=fade(seg(p,.6,.75),TX(`2\\pi m${vt}${rt}=${nt}h`,600,470,{size:50}));
  return s;
 },
 [K+'k4']:(p)=>fade(.7,TX(`2\\pi m${vt}${rt}=${nt}h`,600,80,{size:40}))+stepNote('両辺を 2π で 割る',150,seg(p,.05,.2))+fcard(320,230,560,170,QC,{size:58,col:C.hi,g:seg(p,.3,.45)})+tag('量子条件（導いた 結果）',600,460,{color:C.hi,size:28,g:seg(p,.6,.75)}),
 [K+'k5']:(p)=>{
  let s=TX(QC,600,130,{size:70});
  s+=fade(seg(p,.05,.2),line(445,190,560,190,{color:PC,w:3})+label('運動量',502,228,{size:26,color:PC,anchor:'middle',weight:700})+label('半径',590,228,{size:26,color:RC,anchor:'middle',weight:700}));
  const st=seg(p,.5,.65);
  s+=fade(st,label('n＝1、2、3 → 1倍、2倍、3倍',600,330,{size:30,color:NC,anchor:'middle',weight:700}));
  s+=fade(st,TX(`\\dfrac{h}{2\\pi}\\times1,\\quad \\dfrac{h}{2\\pi}\\times2,\\quad \\dfrac{h}{2\\pi}\\times3,\\ \\dots`,600,420,{size:40}));
  return s;
 },
 [K+'k6']:(p)=>{
  let s=fade(.7,TX(QC,600,70,{size:42}));
  const x0=300,y0=440,dx=150,dy=90;
  s+=fade(1,line(x0-40,y0,x0+dx*4.2,y0,{color:C.dim,w:2.5})+line(x0-40,y0,x0-40,y0-dy*3.6,{color:C.dim,w:2.5}));
  s+=fade(1,TX(`m${vt}${rt}`,x0-60,y0-dy*3.6-6,{size:32,anchor:'end'}));
  for(let n=1;n<=3;n++){const g=seg(p,.05+n*.12,.15+n*.12);s+=fade(g,line(x0+dx*(n-1),y0-dy*n,x0+dx*n,y0-dy*n,{color:NC,w:6})+label(`n＝${n}`,x0+dx*(n-.5),y0-dy*n-16,{size:26,color:NC,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.6,.75),label('間の 値は とれない',1000,250,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 数で確かめる =================
 [K+'c1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=atomOrbit(330,262,170,{ang:.5+t*.5})+ringWave(330,262,170,1,{A:22,g:seg(p,.05,.2)});
  s+=fade(seg(p,.2,.35),line(330,262,330+170*Math.cos(2.5),262-170*Math.sin(2.5),{color:RC,w:3}));
  s+=card(600,120,560,220,TX(`${nt}=1`,880,190,{size:46})+TX(`${rt}=5.3\\times10^{-11}${U('m')}`,880,265,{size:44}),seg(p,.15,.3),C.ink);
  s+=fade(seg(p,.6,.75),label('（この 値は 3本目で 計算）',880,400,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'c2']:(p)=>fade(.5,atomOrbit(220,262,130,{el:0,ocol:C.ink,dash:''})+ringWave(220,262,130,1,{A:20}))+fcard(420,90,740,150,`2\\pi\\times5.3\\times10^{-11}\\approx3.3\\times10^{-10}${U('m')}`,{size:44,col:C.ink,g:seg(p,.05,.2)})+fcard(520,290,540,130,`${lam}\\approx3.3\\times10^{-10}${U('m')}`,{size:48,col:LC,g:seg(p,.5,.65)}),
 [K+'c3']:(p)=>fade(.7,TX(LAMMV,600,85,{size:44}))+stepNote('両辺に v を 掛けて、λ で 割る',170,seg(p,.05,.2))+fcard(380,250,440,170,`${vt}=\\dfrac{h}{m${lam}}`,{size:62,col:VC,g:seg(p,.3,.45)}),
 [K+'c4']:(p)=>fade(.7,TX(`${vt}=\\dfrac{h}{m${lam}}`,600,80,{size:40}))+fcard(60,170,1080,180,`${vt}=\\dfrac{6.6\\times10^{-34}}{9.1\\times10^{-31}\\times3.3\\times10^{-10}}\\approx2.2\\times10^{6}${U('m/s')}`,{size:44,col:VC,g:seg(p,.05,.2)}),
 [K+'c5']:(p)=>{
  let s=card(150,60,900,380,'',seg(p,.02,.1));
  const row=(y,a,b,c,col,g)=>fade(g,label(a,330,y,{size:28,color:col,anchor:'middle',weight:700})+TX(b,640,y-8,{size:36,color:VC})+TX(c,900,y-8,{size:36,color:LC}));
  s+=fade(seg(p,.02,.1),label('速さ',640,120,{size:26,color:VC,anchor:'middle',weight:700})+label('波長',900,120,{size:26,color:LC,anchor:'middle',weight:700})+line(180,145,1020,145,{color:C.faint,w:2}));
  s+=row(220,'n＝1 の 電子','2.2\\times10^{6}','3.3\\times10^{-10}',C.ink,seg(p,.02,.1));
  s+=row(330,'100 V の 電子','5.9\\times10^{6}','1.2\\times10^{-10}',C.ink,seg(p,.45,.6));
  s+=fade(seg(p,.1,.25),label('光の 約 1/140',640,270,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('遅い ほど 波長は 長い',600,490,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c6']:(p)=>{
  let s='';[[200,1,90],[600,2,110],[1000,3,130]].forEach(([x,n,R],i)=>{const g=seg(p,.05+i*.2,.2+i*.2);
   s+=fade(g,ring(x,250,R,{color:C.faint,w:2,dash:'6 7'})+nucleus(x,250,{r:12}))+ringWave(x,250,R,n,{A:16,g})+fade(g,label(`n＝${n}：波 ${n}個`,x,450,{size:28,color:NC,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.7,.85),label('（円の 大きさの 比は 3本目で）',600,500,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'a1']:(p)=>atomOrbit(300,262,160,{el:0})+ringWave(300,262,160,3,{A:20})+fcard(600,140,520,160,CIRC,{size:58,col:LC,g:seg(p,.1,.25)}),
 [K+'a2']:(p)=>{
  let s=fade(.5,atomOrbit(300,262,160,{el:0})+ringWave(300,262,160,3,{A:20}));
  s+=card(600,120,520,220,label('✕ どんな 半径でも 回れる',860,200,{size:30,color:BAD,anchor:'middle',weight:700})+label('波が つながる 半径 だけ',860,280,{size:30,color:OK,anchor:'middle',weight:700}),seg(p,.05,.2),BAD);
  return s;
 },
 [K+'a3']:(p)=>{
  let s=fcard(80,120,480,140,QC,{size:48,col:C.hi});
  s+=fade(seg(p,.2,.35),arrow(580,190,660,190,{color:C.hi,w:4,head:14})+label('軌道が 飛び飛び',800,200,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),arrow(800,230,800,300,{color:EC,w:4,head:14})+label('エネルギーも 飛び飛び？',800,350,{size:32,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'a4']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(seg(p,.02,.15),bent(0,{cx:300,cy:262,Ls:420,k:2,A:40,ph:t*.5,stand:true,posts:1}));
  s+=fade(seg(p,.02,.15),label('弦',300,380,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),atomOrbit(850,262,130,{el:0})+ringWave(850,262,130,3,{A:18})+label('電子の 波',850,450,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label('＝ 同じ 波の 条件',575,140,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'x1']:(p,ctx)=>{
  const t=sceneT(p,ctx),a=.6+t*.4,ex=330+170*Math.cos(a),ey=262-170*Math.sin(a);
  let s=atomOrbit(330,262,170,{ang:a});
  s+=arrow(ex,ey,ex+(330-ex)*.4,ey+(262-ey)*.4,{color:C.F,w:7,head:18,g:seg(p,.1,.25)});
  s+=fade(seg(p,.1,.25),label('クーロン力',330,480,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=card(640,90,500,320,label('量子条件 ＋ クーロン力',890,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('半径は？',890,250,{size:40,color:RC,anchor:'middle',weight:700})+label('エネルギーは？',890,330,{size:40,color:EC,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'x2']:(p)=>ladder([{E:0,text:'0 eV',color:C.dim},{E:-1.51,text:'−1.51 eV'},{E:-3.40,text:'−3.40 eV'}],{x:200,w:360,ytop:90,ybot:440,Emax:0,Emin:-4})+card(760,150,400,210,label('どこから',960,225,{size:30,color:C.ink,anchor:'middle'})+label('来る？',960,305,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi),
 [K+'bye']:()=>ladder([{E:0,text:'0 eV',color:C.dim},{E:-1.51,text:'−1.51 eV'},{E:-3.40,text:'−3.40 eV'}],{x:200,w:360,ytop:90,ybot:440,Emax:0,Emin:-4})+card(760,150,400,210,label('次回',960,225,{size:30,color:C.ink,anchor:'middle'})+label('計算する',960,305,{size:44,color:C.hi,anchor:'middle',weight:700}),1,C.hi),
 [K+'m2b']:(p,ctx)=>{
  const t=sceneT(p,ctx),a=.5+t*.5,ex=400+190*Math.cos(a),ey=262-190*Math.sin(a);
  let s=atomOrbit(400,262,190,{ang:a});
  s+=arrow(ex,ey,ex+(400-ex)*.42,ey+(262-ey)*.42,{color:C.F,w:7,head:18,g:seg(p,.05,.2)});
  s+=card(720,150,420,200,label('原子核が 引く 力',930,215,{size:28,color:C.F,anchor:'middle',weight:700})+label('＝ 中心向きの 力',930,270,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（円運動の 単元）',930,320,{size:24,color:C.dim,anchor:'middle'}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'s2b']:(p,ctx)=>{
  const t=sceneT(p,ctx),x0=220,x1=980,y=270;
  let s=fade(1,rect(x0-16,y-110,16,220,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+rect(x1,y-110,16,220,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+line(x0,y,x1,y,{color:C.faint,w:2,dash:'6 8'}));
  const k=2.6,fade1=1-.8*seg(p,.35,.8);
  for(let j=0;j<3;j++){const pts=[];for(let x=x0;x<=x1;x+=4){const u=(x-x0)/(x1-x0);pts.push([x,y-60*fade1*Math.sin(k*PI*u+j*2.1+t*2)]);}s+=fade(seg(p,.05+j*.08,.15+j*.08)*(.9-j*.2),draw(pts,1,{color:[LC,W2,C.hi][j],w:3}));}
  s+=fade(seg(p,.05,.2),label('長さに 合わない 波',600,100,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('重なって 打ち消し合う → 残らない',600,450,{size:30,color:BAD,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s5b']:(p)=>{
  let s=atomOrbit(400,262,170,{el:0});
  const amp=18*(1-.85*seg(p,.3,.8));
  s+=ringWave(400,262,170,3.5,{A:amp,turns:1})+ringWave(400,262,170,3.5,{A:amp,turns:1,from:2*PI,color:W2,w:3});
  s+=card(760,160,380,180,label('何周も 重なる',950,230,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 全体として 消える',950,295,{size:28,color:BAD,anchor:'middle',weight:700}),seg(p,.4,.55),BAD);
  return s;
 },
 [K+'k4b']:(p)=>fcard(100,60,440,140,CIRC,{size:50,col:LC})+TX('+',600,140,{size:50})+fcard(660,60,440,140,LAMMV,{size:50,col:LC})+fade(seg(p,.3,.45),arrow(600,230,600,290,{color:C.hi,w:4,head:14}))+fcard(320,310,560,160,QC,{size:56,col:C.hi,g:seg(p,.4,.55)}),
 [K+'c4b']:(p)=>fade(.7,TX(QC,600,80,{size:40}))+fade(seg(p,.05,.2),label('左辺',600,175,{size:30,color:C.ink,anchor:'middle',weight:700}))+fcard(60,210,1080,150,`m${vt}${rt}=9.1\\times10^{-31}\\times2.2\\times10^{6}\\times5.3\\times10^{-11}\\approx1.06\\times10^{-34}`,{size:36,col:C.ink,g:seg(p,.05,.2)}),
 [K+'c4c']:(p)=>fade(.7,TX(QC,600,80,{size:40}))+fade(.6,TX(`m${vt}${rt}\\approx1.06\\times10^{-34}`,330,190,{size:38}))+fade(seg(p,.05,.2),label('右辺',150,330,{size:30,color:C.ink,anchor:'middle',weight:700}))+fcard(220,260,700,140,`\\dfrac{h}{2\\pi}\\approx1.05\\times10^{-34}`,{size:46,col:C.ink,g:seg(p,.05,.2)})+fade(seg(p,.55,.7),okMark(480,455,1)+label('ほぼ 等しい',600,465,{size:30,color:OK,anchor:'middle',weight:700})),
};

