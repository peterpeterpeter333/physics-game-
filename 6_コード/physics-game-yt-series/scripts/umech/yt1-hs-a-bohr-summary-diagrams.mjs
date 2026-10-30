// 高校編「物質波とボーア模型・要点」(ys-hs-a-bohr-summary) — 図。Stage 1200×515.
// 深く学ぶ版と同じ部品・色（λ 水色、エネルギー 橙、n 黄、電子 青、原子核 赤）。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,mix} from './anim.mjs';
import {card,tag,electron,LC,VC,EC,NEG,POS,NC,RC,BAD,OK,cs,lam,vt,rt,nt,Et,U,TX,fcard,LAMMV,cross,okMark,nucleus,wave,span,ladder,ladderY,atomOrbit,ringWave,jt,photon,slitBase,eDots} from './yt1-hs-a-bohr-1-diagrams.mjs';

const K='hs-a-bohr-summary:';
const sceneT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
const RED='#ff5a5a';
const CIRC=`2\\pi ${rt}=${nt}${lam}`, QC=`m${vt}${rt}=\\dfrac{${nt}h}{2\\pi}`, EN=`${Et}=-\\dfrac{13.6${U('eV')}}{${nt}^2}`;
const LV=[{E:0,text:'0',color:C.dim},{E:-1.51,text:'n＝3　−1.51 eV'},{E:-3.40,text:'n＝2　−3.40 eV'},{E:-13.6,text:'n＝1　−13.6 eV'}];
const LO={x:120,w:240,ytop:70,ybot:450,Emax:0,Emin:-14};
const tw=(cx,cy,R,k,o={})=>atomOrbit(cx,cy,R,{el:0})+ringWave(cx,cy,R,k,{A:18,...o});

export const hsABohrSummaryDiagrams={
 // ---- 結論 ----
 [K+'c1']:(p,ctx)=>{const t=sceneT(p,ctx);return electron(200,330,{r:16})+wave(260,1000,330,120,26,{ph:t*.6})+fcard(330,60,540,170,LAMMV,{size:62,col:LC,g:seg(p,.3,.45)});},
 [K+'c2']:(p)=>slitBase({src:'e'})+eDots(2400*seg(p,.05,.7))+tag('仮説 → 実験で 確認',690,40,{color:C.hi,size:26,g:seg(p,.5,.65)}),
 [K+'c3']:(p)=>tw(300,262,170,3,{turns:seg(p,.05,.5)})+fcard(640,140,500,160,CIRC,{size:58,col:LC,g:seg(p,.45,.6)})+fade(seg(p,.6,.75),label('n：乗る 波の 個数',890,350,{size:28,color:NC,anchor:'middle',weight:700})),
 [K+'c4']:(p)=>ladder(LV,{...LO,g:seg(p,.05,.25)})+fcard(640,150,500,180,EN,{size:56,col:EC,g:seg(p,.4,.55)}),
 // ---- なぜ？ ----
 [K+'w1']:(p)=>{
  let s=tw(300,262,150,3)+okMark(300,450,1)+fade(1,label('整数個',300,60,{size:30,color:OK,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),atomOrbit(850,262,150,{el:0})+ringWave(850,262,150,3.5,{A:18})+ringWave(850,262,150,3.5,{A:18,from:2*Math.PI,color:C.p,w:3})+label('つながらない → 打ち消す',850,60,{size:30,color:BAD,anchor:'middle',weight:700}))+cross(850,450,20,seg(p,.35,.5));
  return s;
 },
 [K+'w2']:(p,ctx)=>{
  const t=sceneT(p,ctx),x0=140,x1=560,y=262,A=50;let s=rect(x0-14,y-80,14,160,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+rect(x1,y-80,14,160,{fill:'#56627a',fo:1,stroke:C.dim,rx:3});
  const pts=[];for(let x=x0;x<=x1;x+=3)pts.push([x,y-A*Math.sin(3*Math.PI*(x-x0)/(x1-x0))*Math.cos(2*Math.PI*t*.6)]);
  s+=`<polyline points="${pts.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#d6deec" stroke-width="5"/>`;
  s+=label('弦の 定常波',350,400,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),tw(880,262,140,3)+label('電子の 波',880,450,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=tag('ボーア模型の 仮定',880,60,{color:C.hi,size:26,g:seg(p,.55,.7)});
  return s;
 },
 [K+'w3']:(p)=>fcard(100,60,440,140,CIRC,{size:50,col:LC})+TX('+',600,140,{size:50})+fcard(660,60,440,140,LAMMV,{size:50,col:LC})+fade(seg(p,.3,.45),arrow(600,230,600,290,{color:C.hi,w:4,head:14}))+fcard(320,310,560,160,QC,{size:56,col:C.hi,g:seg(p,.4,.55)})+tag('量子条件',1000,390,{color:C.hi,g:seg(p,.6,.75)}),
 [K+'w4']:(p)=>{
  let s=card(80,90,480,300,label('クーロン力 ＝ 向心力',320,150,{size:28,color:C.F,anchor:'middle',weight:700})+TX(`\\dfrac{k e^2}{${rt}^2}=\\dfrac{m${vt}^2}{${rt}}`,320,240,{size:46})+label('＋ 量子条件',320,340,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  s+=fade(seg(p,.4,.55),TX(`${rt}\\propto ${nt}^2`,880,170,{size:56}))+fade(seg(p,.6,.75),TX(`${Et}\\propto -\\dfrac{1}{${nt}^2}`,880,320,{size:56,color:EC}));
  return s;
 },
 // ---- 数値例 ----
 [K+'n1']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';for(let k=6;k>=1;k--)s+=dot(330,250,100*k/6+10,'#8fa3c4',.1);
  s+=nucleus(330,250,{r:10})+span(220,440,400,{color:C.ink})+jt('原子 約',`10^{-10}${U('m')}`,350,446);
  s+=fade(seg(p,.05,.2),wave(620,1120,250,240,40,{ph:t*.4})+span(620,860,360,{color:LC})+TX(`${lam}\\approx1.2\\times10^{-10}${U('m')}`,740,400,{size:32}));
  s+=fade(seg(p,.05,.2),label('100 V の 電子',870,120,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n2']:(p)=>{
  let s='';[1,4,9].forEach((m,i)=>{const g=i===0?1:seg(p,.3+i*.15,.45+i*.15);s+=fade(g,ring(300,262,24*m,{color:[C.hi,'#ffd27a','#ffb36b'][i],w:3,dash:i?'8 6':''}));});
  s+=nucleus(300,262,{r:8});
  s+=card(620,100,520,280,TX(`${nt}=1:\\ ${rt}\\approx5.3\\times10^{-11}${U('m')}`,880,180,{size:36})+label('n＝2 → 4倍',880,260,{size:30,color:'#ffd27a',anchor:'middle',weight:700})+label('n＝3 → 9倍',880,320,{size:30,color:'#ffb36b',anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'n3']:(p)=>ladder(LV,{...LO})+fcard(640,150,500,180,EN,{size:52,col:EC})+fade(seg(p,.2,.35),rect(LO.x-10,ladderY(-3.4,LO)-24,LO.w+260,44,{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:10})),
 [K+'n4']:(p,ctx)=>{
  const t=sceneT(p,ctx),y3=ladderY(-1.51,LO),y2=ladderY(-3.40,LO);
  let s=ladder(LV,{...LO})+electron(250,mix(y3,y2,seg(p,.1,.4)),{r:13})+arrow(290,y3+6,290,y2-6,{color:C.hi,w:4,head:12,g:seg(p,.1,.25)});
  s+=fade(seg(p,.4,.55),wave(620,1120,300,70,16,{ph:t,color:RED,w:3})+photon(620+500*((t*.6)%1),300));
  s+=fade(seg(p,.4,.55),TX(`\\Delta ${Et}=1.89${U('eV')}`,870,400,{size:40,color:EC}));
  return s;
 },
 [K+'n5']:(p,ctx)=>{const t=sceneT(p,ctx);return fcard(150,40,900,170,`${lam}=\\dfrac{hc}{\\Delta ${Et}}=\\dfrac{1240}{1.89}\\approx656${U('nm')}`,{size:50,col:LC,g:seg(p,.05,.2)})+fade(seg(p,.45,.6),wave(200,1000,350,130,40,{ph:t*.5,color:RED,w:5})+label('656 nm：水素の 赤い 光',600,470,{size:30,color:RED,anchor:'middle',weight:700}));},
 // ---- よくある間違い ----
 [K+'m1']:(p)=>ladder(LV,{...LO,hl:2})+card(640,140,500,200,label('✕ −3.40 eV が',890,210,{size:32,color:BAD,anchor:'middle',weight:700})+label('光子の エネルギー',890,280,{size:32,color:BAD,anchor:'middle',weight:700}),seg(p,.1,.25),BAD),
 [K+'m2']:(p)=>{const y3=ladderY(-1.51,LO),y2=ladderY(-3.40,LO);return ladder(LV,{...LO})+fade(seg(p,.05,.2),line(100,y3,100,y2,{color:C.hi,w:6}))+card(650,140,510,200,label('○ 光子 ＝ 準位の 差',905,200,{size:32,color:OK,anchor:'middle',weight:700})+TX(`-1.51-(-3.40)=1.89${U('eV')}`,905,280,{size:36}),seg(p,.1,.25),OK);},
 [K+'m3']:(p)=>{
  let s=atomOrbit(330,262,150,{ang:.8})+cross(330,262,70,seg(p,.4,.55));
  s+=card(640,150,500,200,label('ボーア模型 ＝ 仮定を 置いた 模型',890,220,{size:28,color:C.hi,anchor:'middle',weight:700})+label('決まった 円を 回るのでは ない',890,290,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 // ---- まとめ ----
 [K+'s1']:(p,ctx)=>{const t=sceneT(p,ctx);return tw(230,262,140,3)+fade(seg(p,.2,.35),ladder(LV,{x:470,w:180,ytop:70,ybot:450,Emax:0,Emin:-14,size:22}))+fade(seg(p,.5,.65),wave(880,1160,262,70,16,{ph:t,color:RED,w:3})+label('光の 色',1020,340,{size:28,color:RED,anchor:'middle',weight:700}));},
 [K+'s2']:(p,ctx)=>{const t=sceneT(p,ctx);return fade(.5,tw(230,262,140,3))+card(470,170,640,170,label('なぜ そうなるかは',790,235,{size:30,color:C.ink,anchor:'middle'})+label('深く学ぶ版で',790,300,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);},
};
