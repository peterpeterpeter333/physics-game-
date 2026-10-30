// 問題編 解説「電池を外してから広げると、エネルギーは？」(ys-qx-hs-e-capacitor-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/405_コンデンサー.md の q-hs-e-capacitor-2（解説 22 行）。
// 色（正本）：電荷 q・Q 桃、電圧 V 紫、容量 C 黄、エネルギー U 橙、力 緑、正電荷 赤、電子（負）青。強調は黄の枠だけ。右下に凡例。
// 左に回路（上下の板・電池。下の板は固定、上の板を持ち上げて間隔を2倍に）、右に q–V グラフ（横 途中の電荷 q 0〜25 μC、縦 電圧 0〜12 V）。
// 板の ＋・− の印は 8 個（電荷の値の目盛りではない）。
import {C,seg,lin,fade,label,line,rect,arrow,tex,mix,poly,clamp} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,legend,kindTag,note,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-e-capacitor-2:';
const QC=C.p,VC=C.v,CC=C.hi,UC=C.E,FC=C.F,POS=C.a,NEG='#7fb3ff',HI=C.hi,DIM=C.dim,INK=C.ink,BAD='#ff6b6b';
const Ct=`{\\color{${CC}}C}`,Qt=`{\\color{${QC}}Q}`,Vt=`{\\color{${VC}}V}`,Ut=`{\\color{${UC}}U}`;
const U=s=>`\\,\\mathrm{${s}}`;
const TX=(src,x,y,o={})=>tex(src,x,y,{size:44,auto:false,...o});
const G1='エネルギー U',G2='広げたあとの U',G3='一定とみてよい量';
const A1=g=>answerTag(1,'B','50 μJ',{g}),A2=g=>answerTag(2,'C','100 μJ',{g}),A3=g=>answerTag(3,'D','電荷 Q',{g});
const LEG=(g=1)=>legend([['容量 C 黄',CC],['正 赤',POS],['負 青',NEG]],790,503,{g,dir:'row'});
const frame=(x,y,w,h,g=1,col=HI)=>fade(g,rect(x,y,w,h,{fill:col,fo:0,stroke:col,sw:3.5,rx:10}));
const sw=(ctx,i,d=.5)=>{const W=sentWin(ctx);return W[i]?W[i][0]:d;};
const wAt=(ctx,word,d=.5)=>{const r=(ctx?.cue?.reading??'').replace(/[\s。]/g,''),i=r.indexOf(word.replace(/\s/g,''));return i<0?d:i/Math.max(1,r.length)*voiceEnd(ctx);};

// ================= 回路 =================
const O={L:40,R:300,TH:20,Bt:380,WX:380,ym:330,g0:90};
// n：印の数（0〜8）。lift：間隔 1→2 倍（0〜1）。dsc：導線を外す（0〜1）。clab：「C＝4.0 μF」。qlab：板の電荷の札。hiQ：電荷の札の枠。xmark：外れた所の ×
function circ({g=1,n=8,lift=0,dsc=0,clab=1,qlab=0,hiQ=0,xmark=0,gapLab=0,volt=1}={}){
 const {L,R,TH,Bt,WX,ym}=O,gap=O.g0*(1+lift),Tb=Bt-gap,yT=Tb-TH/2,yB=Bt+TH/2;
 let s=rect(L,Tb-TH,R-L,TH,{fill:'#8795ad',fo:.3,stroke:DIM,sw:2.5,rx:4})+rect(L,Bt,R-L,TH,{fill:'#8795ad',fo:.3,stroke:DIM,sw:2.5,rx:4});
 // 導線（上の板 → 右 → 下へ電池の＋極。外すと、板の側の端が離れる）
 const end=mix(ym-12,yT+12,dsc);
 s+=line(R,yT,WX,yT,{color:DIM,w:4})+line(WX,yT,WX,end,{color:DIM,w:4});
 if(dsc>0)s+=fade(dsc,rect(WX-5,end-5,10,10,{fill:DIM,fo:1,stroke:'none',rx:5})+line(WX,ym-12,WX,ym-24,{color:DIM,w:4})+rect(WX-5,ym-29,10,10,{fill:DIM,fo:1,stroke:'none',rx:5}));
 s+=line(WX,ym+12,WX,yB,{color:DIM,w:4})+line(WX,yB,R,yB,{color:DIM,w:4});
 s+=line(WX-34,ym-12,WX+34,ym-12,{color:INK,w:5})+line(WX-18,ym+12,WX+18,ym+12,{color:INK,w:10});
 s+=label('＋',WX+46,ym-4,{size:22,color:POS,anchor:'middle',weight:700})+label('−',WX-48,ym+30,{size:26,color:NEG,anchor:'middle',weight:700});
 s+=fade(volt,label('5.0 V',WX+30,ym+48,{size:30,color:VC,weight:700}));
 if(xmark)s+=fade(xmark,label('×',WX+28,(end+ym-29)/2+12,{size:40,color:BAD,anchor:'middle',weight:700}));
 for(let k=0;k<8;k++){const op=clamp(n-k);if(op<=0)break;const x=L+20+31*k;
  s+=fade(op,label('＋',x,Tb+24,{size:24,color:POS,anchor:'middle',weight:700})+label('−',x,Bt-6,{size:26,color:NEG,anchor:'middle',weight:700}));}
 if(clab)s+=fade(clab,TX(`${Ct}=4.0${U('\\mu F')}`,(L+R)/2,478,{size:34}));
 if(qlab)s+=fade(qlab,label('＋20 μC',(L+R)/2,Tb-TH-14,{size:28,color:QC,anchor:'middle',weight:700})+label('−20 μC',(L+R)/2,Bt+TH+34,{size:28,color:QC,anchor:'middle',weight:700}));
 if(hiQ){const w=130;s+=frame((L+R)/2-w/2,Tb-TH-46,w,42,hiQ)+frame((L+R)/2-w/2,Bt+TH+4,w,42,hiQ);}
 if(gapLab)s+=fade(gapLab,label('間隔 ×2',(L+R)/2,(Tb+Bt)/2+10,{size:28,color:INK,anchor:'middle',weight:700}));
 return fade(g,s);
}
const qLabXY=()=>[(O.L+O.R)/2,O.Bt-2*O.g0-O.TH-14];   // 広げた後の「＋20 μC」の札

// ================= q–V グラフ =================
const GR={x:600,y:400,w:480,h:240,qm:25,vm:12};
const gX=q=>GR.x+GR.w*q/GR.qm,gY=v=>GR.y-GR.h*v/GR.vm;
function axes2({g=1,v10=0}={}){
 const {x,y,w,h}=GR;
 let s=arrow(x-10,y,x+w+26,y,{color:DIM,w:2.5,head:14})+arrow(x,y+10,x,y-h-26,{color:DIM,w:2.5,head:14});
 for(const q of [10,20])s+=line(gX(q),y-6,gX(q),y+6,{color:DIM})+label(String(q),gX(q),y+32,{size:22,color:DIM,anchor:'middle'});
 for(const v of [5,10])s+=line(x-6,gY(v),x+6,gY(v),{color:DIM})+label(v===5?'5.0':'10',x-12,gY(v)+8,{size:22,color:DIM,anchor:'end'});
 s+=label('電圧 V（V）',x-14,y-h-6,{size:24,color:VC,anchor:'end',weight:700})+label('途中の 電荷 q（μC）',x+w/2,y+60,{size:24,color:QC,anchor:'middle',weight:700});
 return fade(g,s);
}
const tri=(V,{g=1,col=UC,fo=.38,stroke=UC}={})=>fade(g,poly([[gX(0),gY(0)],[gX(20),gY(0)],[gX(20),gY(V)]],{fill:col,fo,stroke,sw:2.5}));
const vline=(V,p=1,{col=VC,w=5}={})=>p>0?line(gX(0),gY(0),gX(20*p),gY(V*p),{color:col,w}):'';
function strips(n,k,{g=1,hl=-1}={}){let s='';const d=20/n;for(let i=0;i<Math.min(n,k);i++){const q0=i*d,v=q0/4;if(v<=0)continue;
 s+=rect(gX(q0),gY(v),gX(q0+d)-gX(q0),gY(0)-gY(v),{fill:UC,fo:i===hl?.8:.4,stroke:i===hl?HI:UC,sw:n>20?.8:2,rx:1});}return fade(g,s);}
const rectQV=(g=1)=>fade(g,`<rect x="${gX(0)}" y="${gY(5)}" width="${gX(20)-gX(0)}" height="${gY(0)-gY(5)}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-dasharray="10 8"/>`);
const hatch=(g=1)=>{let s=`<clipPath id="qxc2h"><polygon points="${gX(0)},${gY(0)} ${gX(0)},${gY(5)} ${gX(20)},${gY(5)}"/></clipPath><g clip-path="url(#qxc2h)">`;
 for(let x=gX(0)-120;x<gX(20);x+=18)s+=line(x,gY(0),x+120,gY(5),{color:BAD,w:2.5});return fade(g,s+'</g>'+poly([[gX(0),gY(0)],[gX(0),gY(5)],[gX(20),gY(5)]],{fill:BAD,fo:.12,stroke:BAD,sw:2}));};
const ptLab=(V,txt,g=1)=>fade(g,rect(gX(20)-7,gY(V)-7,14,14,{fill:QC,fo:1,stroke:'none',rx:7})+label(txt,gX(20)+14,gY(V)+8,{size:24,color:INK,weight:700}));
// グラフの左上（直線より上の空き）のカード
const GC={x:620,w:380};
const gcard=(y,h,inner,g=1,col=C.faint)=>card(GC.x,y,GC.w,h,inner,g,col);
// 右の列（グラフを消したとき）
const RX=540,RW=640;

export const qxHsECapacitor2Diagrams={
 // ================= 問題アニメ =================
 // 出題：4.0 μF・5.0 V の回路。上の板に ＋、下の板に − が増えていき、増え方が止まる。3 秒で静止。
 [K+'q0']:(p)=>'<g transform="translate(330 -30)">'+circ({g:seg(p,0,.15),n:8*Math.sin(Math.PI/2*lin(p,.2,.85))})+'</g>'+LEG(seg(p,0,.15)),
 // 小問2（小問2・3 共通）：「C＝4.0 μF」を消す → 導線を外す → 上の板をゆっくり持ち上げて間隔を2倍に（＋・− の数は同じ）。「間隔 ×2」。静止。
 [K+'q2']:(p)=>'<g transform="translate(330 -30)">'+circ({clab:1-seg(p,0,.12),dsc:seg(p,.15,.3),lift:seg(p,.33,.9),gapLab:seg(p,.88,.98)})+'</g>'+LEG(),

 // ================= S1 小問1 =================
 // 1. 充電した回路。求めるもの：エネルギー U
 [K+'goal1']:(p)=>circ()+goalTag(G1,{g:seg(p,.03,.15)})+LEG(),
 // 2. 板に ＋20 μC・−20 μC。Q＝CV＝4.0×5.0＝20 μC
 [K+'charge']:(p,ctx)=>{
  const b=sw(ctx,1,.3);
  let s=circ({qlab:seg(p,b+.3,b+.4)});
  s+=card(RX,150,RW,110,TX(`${Qt}=${Ct}${Vt}=4.0\\times5.0=20${U('\\mu C')}`,RX+RW/2,218,{size:42}),seg(p,b,b+.1),QC);
  return s+goalTag(G1)+LEG();
 },
 // 3. 右に q–V グラフ。原点から (20 μC, 5.0 V) まで直線
 [K+'graph']:(p)=>{
  let s=circ({qlab:1})+axes2({g:seg(p,.03,.15)})+vline(5,lin(p,.2,.75))+ptLab(5,'(20 μC, 5.0 V)',seg(p,.72,.82));
  return s+goalTag(G1)+LEG();
 },
 // 4. 細い縦の帯（コンデンサーの電圧 V×Δq）を一本ずつ積み、三角形を埋める。長方形 QV の半分が三角形
 [K+'strips']:(p,ctx)=>{
  const b=sw(ctx,1,.5),k=Math.floor(mix(0,10.99,lin(p,.08,b-.02))),k2=lin(p,b,b+.25);
  let s=circ({qlab:1})+axes2()+ptLab(5,'(20 μC, 5.0 V)');
  s+=fade(1-k2,strips(10,k,{hl:k>=6?6:-1}))+fade(k2,strips(40,40))+tri(5,{g:seg(p,b+.25,b+.35),fo:.3});
  s+=vline(5);
  // 2026-10-16（PQ-045）：「そのときのコンデンサーの電圧」と明示する
  s+=fade(seg(p,.15,.25)*(1-k2),card(622,108,420,106,label('V：そのときの コンデンサーの 電圧',832,146,{size:22,color:VC,anchor:'middle',weight:700})+TX(`${Vt}\\times\\Delta q`,832,192,{size:38}),1,C.faint));
  s+=rectQV(seg(p,b+.4,b+.5))+fade(seg(p,b+.45,b+.55),gcard(140,70,label('長方形 QV の 半分',GC.x+GC.w/2,186,{size:30,color:INK,anchor:'middle',weight:700})));
  return s+goalTag(G1)+LEG();
 },
 // 5. 三角形を橙で塗り「½×20 μC×5.0 V＝50 μJ」。小問1 の答え B
 [K+'ans1']:(p,ctx)=>{
  const b=sw(ctx,1,.65);
  let s=circ({qlab:1})+axes2()+tri(5,{fo:.38+.3*seg(p,.05,.2)})+vline(5)+ptLab(5,'(20 μC, 5.0 V)');
  s+=gcard(130,140,TX(`${Ut}=\\tfrac12${Qt}${Vt}`,GC.x+GC.w/2,180,{size:38})+fade(seg(p,.2,.35),TX(`=\\tfrac12\\times20\\times5.0=50${U('\\mu J')}`,GC.x+GC.w/2,242,{size:32})),seg(p,.03,.12),UC);
  return s+goalTag(G1)+A1(seg(p,b,b+.08))+LEG();
 },
 // 6. 誤答 A：100 μJ（長方形 QV、½ を落とした）。長方形の上半分を赤い斜線
 [K+'wrongA1']:(p)=>{
  let s=circ({qlab:1})+axes2()+tri(5)+vline(5)+rectQV(1)+hatch(seg(p,.15,.3));
  s+=wrongCard('A','100 μJ','長方形 QV（½ を落とした）',{x:GC.x,w:GC.w,y:125,g:seg(p,.03,.1)});
  return s+goalTag(G1)+A1(1)+LEG();
 },
 // 7. 誤答 C：10 μJ（V の2乗を忘れた、μC）→ 誤答 D：25 μJ（½ を2回掛けた）
 [K+'wrongCD1']:(p,ctx)=>{
  const m=wAt(ctx,'ディーは',.5);
  let s=circ({qlab:1})+axes2()+tri(5)+vline(5);
  s+=wrongSeq(p,ctx,[['C','10 μJ','V の2乗を忘れた（μC）',{mid:`\\tfrac12\\times4.0\\times5.0=10`}],['D','25 μJ','½ を2回掛けた',{mid:`\\tfrac12\\times\\tfrac12\\times20\\times5.0=25`}]],{win:[[0,m],[m,1]],opts:{x:GC.x,w:GC.w,y:122,midSize:28}});
  return s+goalTag(G1)+A1(1)+LEG();
 },
 // ================= S2 小問2 =================
 // 8. 「C＝4.0 μF」を消し、三角形を灰色にして「広げる前」。導線が外れ、上の板が持ち上がる
 [K+'goal2']:(p)=>{
  let s=circ({clab:1-seg(p,.05,.15),qlab:1-seg(p,.05,.15),dsc:seg(p,.2,.35),lift:seg(p,.4,.9)});
  s+=axes2()+tri(5,{col:DIM,stroke:DIM,fo:.25})+vline(5,1,{col:DIM,w:4})+fade(seg(p,.1,.2),label('広げる前',gX(10),gY(1.2),{size:26,color:DIM,anchor:'middle',weight:700}));
  return s+goalTag(G2,{g:seg(p,.03,.15)})+LEG();
 },
 // 9. 外れた導線の端に ×。板の ＋と− の数は変わらない
 [K+'nowire']:(p)=>{
  let s=circ({clab:0,dsc:1,lift:1,xmark:seg(p,.1,.2)});
  s+=fade(seg(p,.25,.35),label('導線が 外れている',O.WX-14,O.ym-58,{size:24,color:BAD,anchor:'end',weight:700}));
  s+=axes2()+tri(5,{col:DIM,stroke:DIM,fo:.25})+vline(5,1,{col:DIM,w:4})+label('広げる前',gX(10),gY(1.2),{size:26,color:DIM,anchor:'middle',weight:700});
  return s+goalTag(G2)+LEG();
 },
 // 10. 板の電荷の札 ＋20 μC・−20 μC を黄の枠で囲む
 [K+'qconst']:(p)=>{
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:seg(p,.05,.15),hiQ:seg(p,.3,.4)});
  s+=fade(seg(p,.3,.4),label('逃げない',O.WX-14,O.ym-58,{size:26,color:QC,anchor:'end',weight:700}));
  s+=axes2()+tri(5,{col:DIM,stroke:DIM,fo:.25})+vline(5,1,{col:DIM,w:4})+label('広げる前',gX(10),gY(1.2),{size:26,color:DIM,anchor:'middle',weight:700});
  return s+goalTag(G2)+LEG();
 },
 // 11. C＝ε₀A/d の d に ×2。4.0 μF → 2.0 μF（グラフを消して右に式）
 [K+'cap']:(p,ctx)=>{
  const b=wAt(ctx,'ディーがにばい',.45);
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:1,hiQ:1});
  s+=card(RX,130,RW,150,TX(`${Ct}=\\dfrac{\\varepsilon_0A}{d}`,RX+RW/2-30,215,{size:52})+fade(seg(p,b,b+.08),label('d ×2',RX+RW/2+90,240,{size:34,color:HI,weight:700})),seg(p,.03,.12),C.faint);
  s+=card(RX,300,RW,110,TX(`4.0${U('\\mu F')}\\ \\rightarrow\\ 2.0${U('\\mu F')}`,RX+RW/2,368,{size:44,color:CC}),seg(p,b+.15,b+.25),CC);
  return s+goalTag(G2)+LEG();
 },
 // 12. ½QV・½CV²・Q²/(2C) を並べ、Q²/(2C) を黄の枠で囲む
 [K+'three']:(p)=>{
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:1,hiQ:1});
  s+=card(RX,130,RW,90,label('Q 一定：20 μC',RX+RW/2,188,{size:32,color:QC,anchor:'middle',weight:700}),1,QC);
  const xs=[RX+110,RX+320,RX+530],F=[`\\tfrac12${Qt}${Vt}`,`\\tfrac12${Ct}${Vt}^2`,`\\dfrac{${Qt}^2}{2${Ct}}`];
  F.forEach((f,i)=>{s+=fade(seg(p,.1+i*.1,.2+i*.1),TX(f,xs[i],330,{size:44}));});
  s+=frame(xs[2]-80,262,160,120,seg(p,.5,.6));
  return s+goalTag(G2)+LEG();
 },
 // 13. 20²÷(2×2.0)＝100 μJ（一つずつ）。小問2 の答え C
 [K+'ans2']:(p,ctx)=>{
  const b=sw(ctx,1,.65);
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:1});
  let f=TX(`${Ut}=\\dfrac{${Qt}^2}{2${Ct}}`,RX+RW/2,205,{size:44});
  f+=fade(seg(p,.08,.18),TX(`=\\dfrac{20^2}{2\\times2.0}`,RX+RW/2,322,{size:44}));
  f+=fade(seg(p,.22,.32),TX(`=100${U('\\mu J')}`,RX+RW/2,398,{size:48,color:UC}));
  f+=fade(seg(p,.35,.45),label('50 μJ の 2倍',RX+RW/2,442,{size:28,color:INK,anchor:'middle',weight:700}));
  s+=card(RX,118,RW,346,f,1,UC);
  return s+goalTag(G2)+A2(seg(p,b,b+.08))+LEG();
 },
 // 14. V＝Q/C＝20÷2.0＝10 V。q–V グラフに、底辺 20 μC のまま高さ 10 V の三角形を、前の三角形と重ねて
 [K+'check']:(p,ctx)=>{
  const b=sw(ctx,1,.55);
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:1});
  s+=axes2()+tri(10,{g:seg(p,b,b+.12),fo:.38})+vline(10,lin(p,b-.15,b),{w:5});
  s+=tri(5,{col:DIM,stroke:DIM,fo:.3})+vline(5,1,{col:DIM,w:4})+label('広げる前',gX(13),gY(1.2),{size:24,color:INK,anchor:'middle',weight:700});
  s+=ptLab(10,'(20 μC, 10 V)',seg(p,b-.05,b+.05));
  s+=card(605,92,300,140,TX(`${Vt}=\\dfrac{${Qt}}{${Ct}}=\\dfrac{20}{2.0}=10${U('V')}`,755,150,{size:28})
   +fade(seg(p,b+.15,b+.25),TX(`\\tfrac12\\times20\\times10=100${U('\\mu J')}`,755,212,{size:28,color:UC})),seg(p,.05,.15),VC);
  return s+goalTag(G2)+A2(1)+LEG();
 },
 // 15. 誤答 A：25 μJ（V 一定とした、電池は外れている）
 [K+'wrongA2']:(p)=>{
  const gg=1-seg(p,0,.06);
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:1})+fade(gg,axes2()+tri(10)+vline(10)+tri(5,{col:DIM,stroke:DIM,fo:.3})+vline(5,1,{col:DIM,w:4}));
  s+=wrongCard('A','25 μJ',['V 一定とした（電池は外れている）'],{x:RX,w:RW,y:150,g:seg(p,.05,.12),mid:`\\tfrac12\\times2.0\\times5.0^2=25`,midSize:32});
  return s+goalTag(G2)+A2(1)+LEG();
 },
 // 16. 誤答 B：50 μJ（手が仕事をする）→ 誤答 D：200 μJ（C を 1.0 μF にした）
 [K+'wrongBD2']:(p,ctx)=>{
  const m=wAt(ctx,'ディーは',.5);
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:1});
  s+=wrongSeq(p,ctx,[['B','50 μJ','手が仕事をする'],['D','200 μJ','C を 1.0 μF にした',{mid:`\\dfrac{20^2}{2\\times1.0}=200`}]],{win:[[0,m],[m,1]],opts:{x:RX,w:RW,y:150,midSize:32}});
  return s+goalTag(G2)+A2(1)+LEG();
 },
 // 17. 板を持ち上げる手と、下へ引き戻す緑の力の矢印。「手の仕事＝＋50 μJ」
 [K+'hand']:(p)=>{
  const Tb=O.Bt-2*O.g0,cx=(O.L+O.R)/2;
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:0});
  s+=fade(seg(p,.05,.15),arrow(cx,Tb-26,cx,Tb-96,{color:INK,w:6,head:18})+label('手',cx+26,Tb-66,{size:30,color:INK,weight:700}));
  s+=fade(seg(p,.15,.25),[O.L+50,O.R-50].map(x=>arrow(x,Tb+30,x,Tb+90,{color:FC,w:5,head:16})).join('')+label('引き合う 力',cx,Tb+130,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=card(RX,140,RW,120,TX(`100-50=50${U('\\mu J')}`,RX+RW/2,212,{size:44,color:UC}),seg(p,.3,.4),UC);
  s+=card(RX,290,RW,110,label('手の 仕事 ＝ ＋50 μJ',RX+RW/2,358,{size:36,color:UC,anchor:'middle',weight:700}),seg(p,.5,.6),UC);
  return s+goalTag(G2)+A2(1)+LEG();
 },
 // ================= S3 小問3 =================
 // 18. 求めるもの：一定とみてよい量
 [K+'goal3']:(p)=>circ({clab:0,dsc:1,lift:1,xmark:1,qlab:1})+goalTag(G3,{g:seg(p,.05,.18)})+LEG(),
 // 19. 外れた導線の × と板の 20 μC を矢印で結ぶ。札「Q 一定 → Q²/(2C)」。小問3 の答え D
 [K+'ans3']:(p,ctx)=>{
  const b=sw(ctx,1,.6),[qx,qy]=qLabXY();
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:1,hiQ:seg(p,.15,.25)});
  s+=fade(seg(p,.05,.2),arrow(O.WX+20,O.ym-85,qx+80,qy-6,{color:HI,w:4,head:16}));
  s+=card(RX,150,RW,110,label('Q 一定',RX+150,218,{size:36,color:QC,anchor:'middle',weight:700})+label('→',RX+270,218,{size:34,color:INK,anchor:'middle',weight:700})+TX(`\\dfrac{${Qt}^2}{2${Ct}}`,RX+420,212,{size:44}),seg(p,.3,.4),HI);
  return s+goalTag(G3)+A3(seg(p,b,b+.08))+LEG();
 },
 // 20. 誤答 A：電圧 V（電池は外れている）→ 誤答 B：容量 C（d が2倍で C は半分）
 [K+'wrongAB3']:(p,ctx)=>{
  const m=wAt(ctx,'ビーは',.5);
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:1});
  s+=card(RX,130,RW,90,label('Q 一定 → Q²/(2C)',RX+RW/2,188,{size:32,color:QC,anchor:'middle',weight:700}),1,HI);
  s+=wrongSeq(p,ctx,[['A','電圧 V','電池は外れている'],['B','容量 C','d が2倍で C は半分']],{win:[[0,m],[m,1]],opts:{x:RX,w:RW,y:250}});
  return s+goalTag(G3)+A3(1)+LEG();
 },
 // 21. 誤答 C：エネルギー U（手が仕事をする）。表「つないだまま：V 一定…」「外して：Q 一定…」
 [K+'wrongC3']:(p,ctx)=>{
  const b=sw(ctx,1,.5);
  let s=circ({clab:0,dsc:1,lift:1,xmark:1,qlab:1});
  s+=wrongCard('C','エネルギー U','手が仕事をする',{x:RX,w:RW,y:100,g:seg(p,.03,.1)});
  const row=(y,a,bb,c,col)=>label(a,RX+20,y,{size:26,color:INK,weight:700})+label(bb,RX+215,y,{size:26,color:col,weight:700})+TX(c,RX+520,y-8,{size:30});
  s+=card(RX,240,RW,170,row(298,'つないだ まま','V 一定',`\\tfrac12${Ct}${Vt}^2=25${U('\\mu J')}`,VC)+row(372,'外して','Q 一定',`\\dfrac{${Qt}^2}{2${Ct}}=100${U('\\mu J')}`,QC),seg(p,b,b+.1),C.faint);
  return s+goalTag(G3)+A3(1)+LEG();
 },
 // ================= S4 まとめ =================
 // 22. 広げる前の三角形（20 μC・5.0 V・50 μJ）と後の三角形（20 μC・10 V・100 μJ）を並べ、「Q 一定 → Q²/(2C)」
 [K+'sum']:(p)=>{
  const panel=(x,V,ttl,val,g)=>{const x0=x+70,y0=400,sx=12,sy=24,qx=x0+20*sx,vy=y0-V*sy;
   let a=arrow(x0-6,y0,x0+300,y0,{color:DIM,w:2.5,head:12})+arrow(x0,y0+6,x0,y0-250,{color:DIM,w:2.5,head:12});
   a+=poly([[x0,y0],[qx,y0],[qx,vy]],{fill:UC,fo:.4,stroke:UC,sw:2.5})+line(x0,y0,qx,vy,{color:VC,w:4.5});
   a+=label('20 μC',qx,y0+30,{size:24,color:QC,anchor:'middle',weight:700})+label(V===5?'5.0 V':'10 V',qx+12,vy+8,{size:24,color:VC,weight:700});
   a+=label(ttl,x+210,136,{size:28,color:INK,anchor:'middle',weight:700})+label(val,x0+170,y0-36,{size:30,color:UC,anchor:'middle',weight:700});
   return card(x,100,400,400,a,g,C.faint);};
  let s=panel(30,5,'広げる前','50 μJ',seg(p,.05,.15))+panel(450,10,'広げた後（Q 一定）','100 μJ',seg(p,.2,.3));
  s+=card(870,200,310,170,label('Q 一定',1025,250,{size:32,color:QC,anchor:'middle',weight:700})+TX(`\\to\\ \\dfrac{${Qt}^2}{2${Ct}}`,1025,330,{size:42}),seg(p,.4,.5),HI);
  return s+answerRow([[1,'B',''],[2,'C',''],[3,'D','']],{g:seg(p,.6,.7)});
 },
};
