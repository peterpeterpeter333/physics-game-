// 問題編 解説「4 V で 12 μC ためる板」（q-ui-capacitance、大学編 23 コンデンサ・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/23_コンデンサ.md の q-ui-capacitance（解説 18 行）。
// 配置：左に板と電池（横から見た図。左の板＝電池の＋極側で ＋Q、右の板 −Q）、右に q–電圧 のグラフ（自前の軸、目盛りの数字 24px）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：電圧 V 紫、電荷 q・Q 桃（正電荷 赤、電子 青）、容量 C 黄、エネルギー U・仕事 橙、電池の仕事 緑、誤り 赤、短冊（近似）灰。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,sentWin,cueT,tAt,durOf} from './yt1-qx-common.mjs';

const K='qx-ui-capacitance:';
const POS=C.a,NEG='#7fb3ff',QCOL=C.p,VCOL=C.v,CCOL=C.hi,UCOL=C.E,BCOL=C.F,BAD='#ff6b6b',GRAY=C.dim;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const um=s=>`\\,\\mathrm{${s}}`;
const Qt=cs(QCOL,'Q'),qt=cs(QCOL,'q'),Vt=cs(VCOL,'V'),Ct=cs(CCOL,'C'),Ut=cs(UCOL,'U');
const G1='電気容量 C（1 V あたりの電荷）',G2='蓄えられたエネルギー',G3='½ を掛ける理由';
const ANS1=g=>answerTag(1,'B','3 μF',{g}),ANS2=g=>answerTag(2,'C','24 μJ',{g}),ANS3=g=>answerTag(3,'C','',{g});

// ---- 板と電池（横から見た図）----
const P={L:170,R:314,W:16,T:130,B:370,WY:440,BX:250,N:6};
const LC=P.L+P.W/2,RC=P.R+P.W/2;
const slotY=k=>P.T+(P.B-P.T)*(k+.5)/P.N;
function platesBat({g=1,batLab=1}={}){
 let s=rect(P.L,P.T,P.W,P.B-P.T,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3})+rect(P.R,P.T,P.W,P.B-P.T,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3});
 s+=draw([[LC,P.B],[LC,P.WY],[P.BX-10,P.WY]],1,{color:C.dim,w:4})+draw([[P.BX+10,P.WY],[RC,P.WY],[RC,P.B]],1,{color:C.dim,w:4});
 s+=line(P.BX-10,P.WY-30,P.BX-10,P.WY+30,{color:C.ink,w:5})+line(P.BX+10,P.WY-16,P.BX+10,P.WY+16,{color:C.ink,w:9});
 s+=label('＋',P.BX-32,P.WY-14,{size:24,color:POS,anchor:'middle',weight:700})+label('−',P.BX+32,P.WY-14,{size:26,color:NEG,anchor:'middle',weight:700});
 s+=fade(batLab,label('電池 4 V',P.BX,P.WY+60,{size:26,color:VCOL,anchor:'middle',weight:700}));
 return fade(g,s);
}
const plusAt=(k,op=1)=>fade(op,label('＋',P.L+P.W+16,slotY(k)+9,{size:26,color:POS,anchor:'middle',weight:700}));
const minusAt=(k,op=1)=>fade(op,label('−',P.R-16,slotY(k)+9,{size:28,color:NEG,anchor:'middle',weight:700}));
const electron=(x,y)=>ring(x,y,11,{color:NEG,w:2.5,fill:'#1b2a48'})+label('−',x,y+7,{size:22,color:NEG,anchor:'middle',weight:700});
const ePath=k=>[[LC,slotY(k)],[LC,P.B],[LC,P.WY],[P.BX-10,P.WY],[P.BX+10,P.WY],[RC,P.WY],[RC,P.B],[RC,slotY(k)]];
function along(pts,f){
 const ls=pts.slice(1).map((q,i)=>Math.hypot(q[0]-pts[i][0],q[1]-pts[i][1])),tot=ls.reduce((a,b)=>a+b,0);let d=clamp(f)*tot;
 for(let i=0;i<ls.length;i++){if(d<=ls[i]||i===ls.length-1){const t=ls[i]>0?clamp(d/ls[i]):0;return [mix(pts[i][0],pts[i+1][0],t),mix(pts[i][1],pts[i+1][1],t)];}d-=ls[i];}
}
// prog 0→1：電子を1つずつ、左の板から導線を通って右の板へ。戻り値は運び終えた数も
function charging(prog,{g=1,batLab=1}={}){
 let s=platesBat({batLab}),done=0;
 for(let i=0;i<P.N;i++){
  const u=clamp(prog*P.N-i);
  if(u>0)s+=plusAt(i);
  if(u>=1){s+=minusAt(i);done++;}
  else if(u>0){const [x,y]=along(ePath(i),u);s+=electron(x,y);}
 }
 return {svg:fade(g,s),done};
}
const charged=(o={})=>charging(1,o).svg;
const QVlabels=(g=1)=>fade(g,label('Q ＝ 12 μC',350,215,{size:30,color:QCOL,weight:700})+label('V ＝ 4 V',350,265,{size:30,color:VCOL,weight:700}));

// ---- グラフ（自前の軸：目盛りの数字 24px）----
function graph({x0=640,y0=420,w=430,h=300,xmax=12,ymax=4,xt=[0,3,6,9,12],yt=[1,2,3,4],xlab='q [μC]',ylab='電圧 [V]',xcol=QCOL,ycol=VCOL,g=1,grid=0}={}){
 const X=q=>x0+w*q/xmax,Y=v=>y0-h*v/ymax;
 let s='';
 if(grid)for(const v of yt)s+=fade(grid,line(x0,Y(v),x0+w,Y(v),{color:C.grid,w:1.5}));
 s+=arrow(x0,y0,x0+w+30,y0,{color:C.dim,w:3,head:12})+arrow(x0,y0,x0,y0-h-30,{color:C.dim,w:3,head:12});
 for(const q of xt){s+=line(X(q),y0,X(q),y0+8,{color:C.dim,w:2})+label(String(q),X(q),y0+34,{size:24,color:xcol,anchor:'middle'});}
 for(const v of yt){s+=line(x0-8,Y(v),x0,Y(v),{color:C.dim,w:2})+label(String(v),x0-14,Y(v)+8,{size:24,color:ycol,anchor:'end'});}
 s+=label(xlab,x0+w+36,y0+8,{size:24,color:xcol,weight:700})+label(ylab,x0,y0-h-44,{size:24,color:ycol,anchor:'middle',weight:700});
 return {svg:fade(g,s),X,Y};
}
const GR=graph();
const endPt=(g=1)=>fade(g,dot(GR.X(12),GR.Y(4),9,C.hi)+label('(12 μC, 4 V)',GR.X(12)-14,GR.Y(4)-18,{size:24,color:C.hi,anchor:'end',weight:700}));
const vLine=(p=1,{w=5,color=VCOL}={})=>p<=.001?'':line(GR.X(0),GR.Y(0),GR.X(12*p),GR.Y(4*p),{color,w});
function strips(n,{g=1,color=GRAY,fo=.35}={}){
 let s='';const dq=12/n;
 for(let i=0;i<n;i++){const q=i*dq,v=q/3;if(v<=0)continue;s+=rect(GR.X(q),GR.Y(v),GR.X(q+dq)-GR.X(q),GR.Y(0)-GR.Y(v),{fill:color,fo,stroke:color,sw:1.5,rx:0});}
 return fade(g,s);
}
const triangle=(g=1,fo=.38)=>fade(g,poly([[GR.X(0),GR.Y(0)],[GR.X(12),GR.Y(0)],[GR.X(12),GR.Y(4)]],{fill:UCOL,fo,stroke:UCOL,sw:2}));
// 左の説明の枠（グラフの左）
const LX=24,LW=560,LCX=LX+LW/2;
const lcard=(y,h,inner,g=1,stroke=C.faint)=>card(LX,y,LW,h,inner,g,stroke);
const WL={x:LX,w:LW,size:26,whySize:22};

// ---- 小問1 の小さなグラフ（横 V、縦 Q）----
function qvSmall({g=1,pts=1,ln=1}={}){
 const A=graph({x0:120,y0:430,w:360,h:300,xmax:4,ymax:12,xt:[0,1,2,3,4],yt:[3,6,9,12],xlab:'V [V]',ylab:'Q [μC]',xcol:VCOL,ycol:QCOL,g,grid:1});
 let s=A.svg;
 s+=fade(ln*g,line(A.X(0),A.Y(0),A.X(4.3),A.Y(12.9),{color:QCOL,w:4,dash:'10 7'}));
 [[1,3],[2,6],[4,12]].forEach(([v,q],i)=>{s+=fade(g*seg(pts,i/3,(i+1)/3),dot(A.X(v),A.Y(q),9,C.hi));});
 return s;
}
// 12 μC の桃の棒を4つに区切る
function bar4({g=1,cut=1,lab3=1,volt=1,y=130}={}){
 const x0=200,w=800,h=70;
 let s=rect(x0,y,w,h,{fill:QCOL,fo:.30,stroke:QCOL,sw:2.5,rx:6});
 s+=label('12 μC',x0+w/2,y-14,{size:30,color:QCOL,anchor:'middle',weight:700});
 for(let i=1;i<4;i++)s+=fade(cut,line(x0+w*i/4,y-6,x0+w*i/4,y+h+6,{color:C.ink,w:3}));
 for(let i=0;i<4;i++){const cx=x0+w*(i+.5)/4;
  s+=fade(lab3*(i===0?1:.55),label('3 μC',cx,y+h/2+10,{size:28,color:i===0?C.ink:C.dim,anchor:'middle',weight:700}));
  s+=fade(volt,label('1 V',cx,y+h+40,{size:26,color:VCOL,anchor:'middle',weight:700}));}
 return fade(g,s);
}
const CEQ=`${Ct}=\\dfrac{${Qt}}{${Vt}}=\\dfrac{${cs(QCOL,'12'+um('\\mu C'))}}{${cs(VCOL,'4'+um('V'))}}=${cs(CCOL,'3'+um('\\mu F'))}`;

// 棒グラフ（電池の仕事 と コンデンサのエネルギー）
function bars({g=1,b1=1,b2=1,diff=1}={}){
 const x0=330,k=14,y1=150,y2=290,h=70;
 let s=label('電池',x0-20,y1+h/2+10,{size:30,color:BCOL,anchor:'end',weight:700})+label('コンデンサ',x0-20,y2+h/2+10,{size:30,color:UCOL,anchor:'end',weight:700});
 s+=line(x0,y1-20,x0,y2+h+20,{color:C.dim,w:3});
 s+=rect(x0,y1,48*k*b1,h,{fill:BCOL,fo:.45,stroke:BCOL,sw:2.5,rx:4});
 s+=fade(seg(b1,.8,1),label('48 μJ',x0+48*k+16,y1+h/2+10,{size:30,color:BCOL,weight:700}));
 s+=rect(x0,y2,24*k*b2,h,{fill:UCOL,fo:.5,stroke:UCOL,sw:2.5,rx:4});
 s+=fade(seg(b2,.8,1),label('24 μJ',x0+12*k,y2+h/2+10,{size:30,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(diff,rect(x0+24*k,y2,24*k,h,{fill:C.dim,fo:.08,stroke:C.dim,sw:2.5,rx:4})
  +line(x0+24*k,y2,x0+24*k,y2+h,{color:C.dim,w:2})+label('導線の熱など 24 μJ',x0+36*k,y2+h/2+10,{size:26,color:C.dim,anchor:'middle',weight:700})
  +line(x0+24*k,y1+h+6,x0+24*k,y2-6,{color:C.dim,w:2,dash:'6 6'})+line(x0+48*k,y1+h+6,x0+48*k,y2-6,{color:C.dim,w:2,dash:'6 6'}));
 return fade(g,s);
}

export const ytQxUiCapacitanceDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（7 秒）：0〜4 s 電子を1つずつ運ぶ → 4〜5 s「Q＝12 μC」「V＝4 V」→ 5〜7 s 右にグラフの枠と終点 (12 μC, 4 V) の点だけ。静止。
 [K+'q1']:(p)=>{
  let s=charging(seg(p,.02,.56)).svg;
  s+=QVlabels(seg(p,.58,.7));
  s+=graph({g:seg(p,.72,.86)}).svg;
  s+=endPt(seg(p,.86,.97));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題図の左側（板・電池・Q・V）。グラフの枠はまだ出さない
 [K+'intro']:(p)=>charged()+QVlabels(seg(p,.1,.3)),
 // 2. 求めるもの。右に「1 V あたり？」の問いの枠
 [K+'goal1']:(p)=>{
  let s=charged()+QVlabels();
  s+=card(640,140,520,230,label('電気容量 C',900,205,{size:32,color:CCOL,anchor:'middle',weight:700})
   +label('＝ 1 V あたりに たまる 電荷',900,265,{size:28,color:C.ink,anchor:'middle'})
   +label('（Q と V から 求める）',900,320,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.45),CCOL);
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 3. 横 V・縦 Q の小さなグラフ（1・2・4 V の点）と「実験事実」、2文目で C＝Q/V と「定義」
 [K+'ratio']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=qvSmall({g:seg(p,0,.08),pts:seg(p,.06,b-.08),ln:seg(p,b-.12,b-.02)});
  s+=kindTag('実験事実：比例',250,160,{g:seg(p,.12,.22),color:C.ink,size:24});
  s+=card(640,130,520,280,T(`${Ct}=\\dfrac{${Qt}}{${Vt}}`,900,290,64)
   +kindTag('定義',900,180,{size:24}),seg(p,b,b+.08),CCOL);
  s+=fade(seg(p,b+.15,b+.25),label('1 V あたりの 電荷',900,385,{size:26,color:C.ink,anchor:'middle'}));
  return s+goalTag(G1);
 },
 // 4. 12 μC の棒を4つに区切り、1つ分に 3 μC。C＝3 μF。2文目で答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=bar4({g:seg(p,0,.08),cut:seg(p,.08,.2),lab3:seg(p,.2,.32),volt:seg(p,.2,.32)});
  s+=fade(seg(p,.35,.5),T(CEQ,600,390,46));
  return s+goalTag(G1)+ANS1(seg(p,b,b+.08));
 },
 // 5. 誤答 A → C → D を1枚ずつ（上に C＝Q/V＝3 μF の式だけ）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],wA=[0,e0*.5],wC=[e0*.5,e0],wD=[W[1]?W[1][0]:.6,1];
  let s=T(CEQ,600,190,40);
  s+=wrongSeq(p,ctx,[['A','48 μF','掛けた（単位 μC·V）'],['C','0.33 μF','4÷12 と逆に割った'],['D','12 μF','電荷をそのまま容量に']],{win:[wA,wC,wD],opts:{y:300}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 6. 板（充電後）と、右にグラフの枠・終点
 [K+'goal2']:(p)=>charged()+QVlabels()+graph({g:seg(p,.15,.35)}).svg+endPt(seg(p,.3,.45))+goalTag(G2,{g:seg(p,.03,.15)}),
 // 7. 空の板に戻し、粒ずつ運び直す。q の数値と電圧の目盛りが一緒に増える。2文目で「電圧 ＝ q ÷ C」
 [K+'carry']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const prog=seg(p,.06,.9),{svg,done}=charging(prog,{batLab:0}),q=2*done,v=q/3;
  let s=svg+GR.svg+endPt();
  s+=label('q ＝ 途中までに たまった 電荷',40,108,{size:26,color:QCOL,weight:700});
  s+=label(`q ＝ ${q} μC`,350,215,{size:30,color:QCOL,weight:700});
  // 電圧の目盛り（紫）
  const mx=70,my0=370,mh=220,mY=u=>my0-mh*u/4;
  s+=rect(mx,mY(4),26,mh,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:4})+rect(mx,mY(v),26,my0-mY(v),{fill:VCOL,fo:.75,stroke:'none',rx:4});
  for(const u of [0,1,2,3,4])s+=line(mx+26,mY(u),mx+34,mY(u),{color:C.dim,w:2});
  s+=label('0 V',mx+40,mY(0)+8,{size:22,color:VCOL})+label('4 V',mx+40,mY(4)+16,{size:22,color:VCOL});
  s+=label('電圧',mx+13,mY(4)-14,{size:24,color:VCOL,anchor:'middle',weight:700});
  s+=fade(seg(p,b,b+.08),label('電圧 ＝ q ÷ C',860,500,{size:32,color:VCOL,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 8. 点 (3,1)(6,2)(9,3) と、原点から (12,4) までの紫の直線
 [K+'line']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=charged({batLab:1})+QVlabels()+GR.svg+endPt();
  [[3,1],[6,2],[9,3]].forEach(([q,v],i)=>{const g=seg(p,.05+i*.12,.13+i*.12);
   s+=fade(g,line(GR.X(q),GR.Y(0),GR.X(q),GR.Y(v),{color:C.dim,w:2,dash:'4 6'})+line(GR.X(0),GR.Y(v),GR.X(q),GR.Y(v),{color:C.dim,w:2,dash:'4 6'})+dot(GR.X(q),GR.Y(v),8,VCOL));});
  s+=vLine(seg(p,b+.02,b+.3));
  return s+goalTag(G2);
 },
 // 9. 細い短冊1本（電荷×電圧）→ 3 μC ずつ4本、和 18 μJ（灰）。左に説明の枠
 [K+'strips']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=GR.svg+vLine(1);
  // 1文目：細い短冊1本（q＝7 μC あたり）
  const one=seg(p,.08,.18)*(1-seg(p,b-.04,b));
  const q=7,dq=.5,v=q/3;
  s+=fade(one,rect(GR.X(q),GR.Y(v),GR.X(q+dq)-GR.X(q),GR.Y(0)-GR.Y(v),{fill:C.hi,fo:.5,stroke:C.hi,sw:2,rx:0})
   +label('電荷',GR.X(q+dq/2),GR.Y(0)+68,{size:24,color:QCOL,anchor:'middle',weight:700})+arrow(GR.X(q+dq)+60,GR.Y(v/2),GR.X(q+dq)+6,GR.Y(v/2),{color:VCOL,w:3,head:10})
   +label('電圧',GR.X(q+dq)+66,GR.Y(v/2)+8,{size:24,color:VCOL,weight:700}));
  s+=lcard(110,200,label('運ぶ 仕事',LCX,160,{size:28,color:UCOL,anchor:'middle',weight:700})
   +label('＝ 電荷 × その時の 電圧',LCX,215,{size:28,color:C.ink,anchor:'middle'})
   +label('＝ 細い 短冊の 面積',LCX,270,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.15)*(1-seg(p,b-.04,b)));
  // 2文目：4本の短冊と和
  const g4=seg(p,b,b+.1);
  s+=strips(4,{g:g4});
  [1,2,3].forEach(i=>{s+=fade(g4,label(`${i} V`,GR.X(3*i+1.5),GR.Y(i/3*3)-(i?12:10),{size:22,color:GRAY,anchor:'middle',weight:700}));});
  s+=lcard(110,250,label('3 μC ずつ、はじめの 電圧で',LCX,160,{size:26,color:C.dim,anchor:'middle'})
   +T(`3\\,\\mathrm{\\mu C}\\times(0+1+2+3)\\,\\mathrm{V}`,LCX,235,36,{color:GRAY})
   +T(`=18\\,\\mathrm{\\mu J}`,LCX,310,40,{color:GRAY}),seg(p,b+.08,b+.18));
  return s+goalTag(G2);
 },
 // 10. 短冊 8 本 → 16 本 → 三角形（橙）、½×12 μC×4 V＝24 μJ
 [K+'tri']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const a4=1-seg(p,.05,.12),a8=seg(p,.08,.15)*(1-seg(p,.25,.32)),a16=seg(p,.28,.35)*(1-seg(p,b-.06,b));
  let s=GR.svg;
  s+=strips(4,{g:a4})+strips(8,{g:a8})+strips(16,{g:a16});
  s+=fade(seg(p,.08,.15)*(1-seg(p,.25,.32)),label('8 本',LCX,250,{size:32,color:GRAY,anchor:'middle',weight:700}));
  s+=fade(seg(p,.28,.35)*(1-seg(p,b-.06,b)),label('16 本',LCX,250,{size:32,color:GRAY,anchor:'middle',weight:700}));
  s+=triangle(seg(p,b-.04,b+.06));
  s+=vLine(1);
  s+=lcard(110,250,label('直線の 下の 三角形',LCX,160,{size:28,color:UCOL,anchor:'middle',weight:700})
   +T(`\\dfrac{1}{2}\\times${cs(QCOL,'12'+um('\\mu C'))}\\times${cs(VCOL,'4'+um('V'))}`,LCX,245,36)
   +T(`=${cs(UCOL,'24'+um('\\mu J'))}`,LCX,320,40),seg(p,b+.02,b+.12),UCOL);
  s+=fade(seg(p,b+.2,b+.3),label('24 μJ',GR.X(9),GR.Y(1)+8,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 11. 小問2 の答え C。2文目で誤答 B（短冊4本を薄く重ねる）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=GR.svg+triangle(1)+vLine(1)+label('24 μJ',GR.X(9),GR.Y(1)+8,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=lcard(110,250,label('直線の 下の 三角形',LCX,160,{size:28,color:UCOL,anchor:'middle',weight:700})
   +T(`\\dfrac{1}{2}\\times${cs(QCOL,'12'+um('\\mu C'))}\\times${cs(VCOL,'4'+um('V'))}`,LCX,245,36)
   +T(`=${cs(UCOL,'24'+um('\\mu J'))}`,LCX,320,40),1-seg(p,b-.04,b),UCOL);
  s+=strips(4,{g:seg(p,b,b+.08),fo:.45});
  s+=wrongCard('B','18 μJ','短冊4本の和で止めた',{...WL,y:200,g:seg(p,b,b+.06)});
  return s+goalTag(G2)+ANS2(seg(p,.03,.12));
 },
 // 12. 誤答 A（点線の長方形、三角形より上の半分に赤い ×）→ 誤答 D
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),wA=[0,W[0][1]],wD=[W[1]?W[1][0]:.6,1];
  const inA=seg(p,.02,.08)*(1-seg(p,wA[1]-.04,wA[1]));
  let s=GR.svg+triangle(1)+vLine(1);
  s+=fade(inA,rect(GR.X(0),GR.Y(4),GR.X(12)-GR.X(0),GR.Y(0)-GR.Y(4),{fill:BAD,fo:.06,stroke:BAD,sw:3,rx:0}).replace('<rect','<rect stroke-dasharray="10 8"')
   +label('×',GR.X(4),GR.Y(2.67)+22,{size:64,color:BAD,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['A','48 μJ','長方形（4 V のまま）'],['D','12 μJ','½ を2回掛けた']],{win:[wA,wD],opts:{...WL,y:200}});
  return s+goalTag(G2)+ANS2(1);
 },
 // 13. 緑の棒「電池 48 μJ」と橙の棒「コンデンサ 24 μJ」、差に「導線の熱など」
 [K+'bars']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=bars({b1:seg(p,.05,b-.05),b2:seg(p,b,b+.15),diff:seg(p,b+.15,b+.28)});
  s+=fade(seg(p,.05,.15),label('4 V × 12 μC',330+24*14,128,{size:26,color:BCOL,anchor:'middle',weight:700}));
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 14. グラフ（直線と三角形）だけ。求めるもの「½ を掛ける理由」
 [K+'goal3']:(p)=>GR.svg+triangle(1)+vLine(1)+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 直線を下から上へ光らせ、三角形を強調。左に「電圧が 0 から増える三角形」
 [K+'why']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=GR.svg+triangle(1,.38+.22*seg(p,b,b+.1))+vLine(1);
  s+=vLine(seg(p,.08,b-.05),{w:10,color:C.hi});
  s+=fade(seg(p,.08,.2),label('0 V',GR.X(0)-22,GR.Y(0)-22,{size:26,color:C.hi,anchor:'end',weight:700}))+fade(seg(p,b-.12,b-.04),label('4 V',GR.X(12)+14,GR.Y(4)+30,{size:26,color:C.hi,weight:700}));
  s+=lcard(150,180,label('電圧が 0 から 増える',LCX,215,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('→ 三角形 → ½',LCX,280,{size:32,color:UCOL,anchor:'middle',weight:700}),seg(p,b,b+.1),UCOL);
  return s+goalTag(G3);
 },
 // 16. 三角形のカードに ○、答えの札。2文目で誤答 A（カードを差し替え）
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,go=1-seg(p,b-.04,b);
  let s=GR.svg+triangle(1)+vLine(1);
  s+=lcard(150,180,label('電圧が 0 から 増える',LCX,215,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('→ 三角形 → ½',LCX,280,{size:32,color:UCOL,anchor:'middle',weight:700})
   +fade(seg(p,.05,.15),ring(LX+LW-50,195,30,{color:C.F,w:5})),go,UCOL);
  s+=wrongCard('A','板が2枚あることと結びつけた',[],{...WL,x:16,w:590,y:200,g:seg(p,b,b+.06)});
  return s+goalTag(G3)+ANS3(seg(p,.03,.12));
 },
 // 17. 誤答 B → D を1枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  let s=GR.svg+triangle(1)+vLine(1);
  s+=wrongSeq(p,ctx,[['B','電荷は電池に戻らない',[]],['D','運ぶ仕事は打ち消し合わない',[]]],{opts:{...WL,x:16,w:590,y:200}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 18. 3枚のカード「定義：C＝Q/V」「実験事実：Q は V に比例」「導いた結果：24 μJ」→ 右上に答えの札を並べる
 [K+'sum']:(p)=>{
  const w=360,gap=30,x0=600-(3*w+2*gap)/2,y=150,h=250,xs=[0,1,2].map(i=>x0+i*(w+gap));
  let s='';
  s+=card(xs[0],y,w,h,kindTag('定義',xs[0]+w/2,y+55)+T(`${Ct}=\\dfrac{${Qt}}{${Vt}}`,xs[0]+w/2,y+160,52),seg(p,.03,.12),C.hi);
  s+=card(xs[1],y,w,h,kindTag('実験事実',xs[1]+w/2,y+55,{color:C.ink})+label('Q は V に 比例',xs[1]+w/2,y+170,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.15,.24),C.ink);
  const tx=xs[2]+60,ty=y+200;
  s+=card(xs[2],y,w,h,kindTag('導いた結果',xs[2]+w/2,y+55,{color:C.x})
   +poly([[tx,ty],[tx+110,ty],[tx+110,ty-80]],{fill:UCOL,fo:.4,stroke:UCOL,sw:2})
   +label('24 μJ',xs[2]+w-30,y+175,{size:36,color:UCOL,anchor:'end',weight:700}),seg(p,.27,.36),C.x);
  s+=answerRow([[1,'B','3 μF'],[2,'C','24 μJ'],[3,'C','']],{g:seg(p,.6,.72)});
  return s;
 },
};
