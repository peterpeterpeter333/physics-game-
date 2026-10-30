// 問題編 解説「広く、遠くすると、容量は？」(ys-qx-hs-e-capacitor-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/405_コンデンサー.md の q-hs-e-capacitor-1（解説 21 行）。
// 色（正本）：電荷 Q 桃、電圧 V 紫、電場 𝐄 水色、容量 C 黄、正電荷 赤、電子（負）青、面積 A・間隔 d 白。強調は黄の枠だけ。右下に凡例。
// 小問1：左に回路（上下の板・電池）、中に表、右に Q–V グラフ（横 電圧 0〜6 V、縦 電荷 0〜20 μC）。板の ＋・− は 1個＝1.5 μC。
// 小問2：下の板の位置をそろえて、前（幅 160・間隔 50）と後（幅 320・間隔 200）を並べる。右に C＝ε₀A/d（A は四角、d は丸の枠）。
// 小問3：20 cm 四方の板を斜めから見た図（間隔は大きく誇張）。右に単位の換算と計算。
// 単元動画（yt1-hs-e-capacitor-1）の板の組（pair）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,arrow,tex,mix,poly,clamp} from './anim.mjs';
import {pair} from './yt1-hs-e-capacitor-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,legend,kindTag,note,sentWin,voiceEnd,isProblem} from './yt1-qx-common.mjs';

const K='qx-hs-e-capacitor-1:';
const QC=C.p,VC=C.v,CC=C.hi,EC=C.x,POS=C.a,NEG='#7fb3ff',HI=C.hi,DIM=C.dim,INK=C.ink;
const Ct=`{\\color{${CC}}C}`,Qt=`{\\color{${QC}}Q}`,Vt=`{\\color{${VC}}V}`,Et=`{\\color{${EC}}E}`;
const U=s=>`\\,\\mathrm{${s}}`;
const TX=(src,x,y,o={})=>tex(src,x,y,{size:44,auto:false,...o});
const G1='片方の板の電荷 Q',G2='容量の倍率',G3='容量 C（F）';
const A1=g=>answerTag(1,'B','15 μC',{g}),A2=g=>answerTag(2,'A','1/2 倍',{g}),A3=g=>answerTag(3,'D',{tex:`1.8\\times10^{-10}${U('F')}`},{g});
const LEG=(g=1)=>legend([['容量 C 黄',CC],['正 赤',POS],['負 青',NEG]],790,503,{g,dir:'row'});
const frame=(x,y,w,h,g=1,col=HI)=>fade(g,rect(x,y,w,h,{fill:col,fo:0,stroke:col,sw:3.5,rx:10}));
const sw=(ctx,i,d=.5)=>{const W=sentWin(ctx);return W[i]?W[i][0]:d;};
// 読みの中で word が始まる所（cue の進み）。誤答カードの切り替えを声に合わせる。
const wAt=(ctx,word,d=.5)=>{const r=(ctx?.cue?.reading??'').replace(/[\s。]/g,''),i=r.indexOf(word.replace(/\s/g,''));return i<0?d:i/Math.max(1,r.length)*voiceEnd(ctx);};
const plusS=(x,y,op=1,size=24)=>fade(op,label('＋',x,y+8,{size,color:POS,anchor:'middle',weight:700}));
const minusS=(x,y,op=1,size=26)=>fade(op,label('−',x,y+9,{size,color:NEG,anchor:'middle',weight:700}));

// ================= 小問1：回路・表・グラフ =================
const O={L:20,R:250,T:130,TH:20,B:300,WX:300};
const yT=O.T+O.TH/2,yB=O.B+O.TH/2;
// n：板の印の数（0〜10、小数は薄く出る）。volt：電池の札。qlab：板の電荷の札
function circ({g=1,n=0,volt='',voltG=1,hlT=0,qlab=0}={}){
 const {L,R,T,TH,B,WX}=O,ym=(yT+yB)/2;
 let s=rect(L,T,R-L,TH,{fill:'#8795ad',fo:.3,stroke:DIM,sw:2.5,rx:4})+rect(L,B,R-L,TH,{fill:'#8795ad',fo:.3,stroke:DIM,sw:2.5,rx:4});
 s+=line(R,yT,WX,yT,{color:DIM,w:4})+line(WX,yT,WX,ym-12,{color:DIM,w:4})+line(WX,ym+12,WX,yB,{color:DIM,w:4})+line(WX,yB,R,yB,{color:DIM,w:4});
 s+=line(WX-34,ym-12,WX+34,ym-12,{color:INK,w:5})+line(WX-18,ym+12,WX+18,ym+12,{color:INK,w:10});
 s+=label('＋',WX-48,ym-6,{size:24,color:POS,anchor:'middle',weight:700})+label('−',WX-48,ym+30,{size:26,color:NEG,anchor:'middle',weight:700});
 if(volt)s+=fade(voltG,label(volt,WX+40,ym+11,{size:30,color:VC,weight:700}));
 for(let k=0;k<10;k++){const op=clamp(n-k);if(op<=0)break;const x=L+11.5+23*k;s+=plusS(x,T+TH+16,op)+minusS(x,B-16,op);}
 if(hlT)s+=frame(L-7,T-7,R-L+14,TH+14,hlT);
 if(qlab)s+=fade(qlab,label('＋15 μC',(L+R)/2,T-14,{size:28,color:QC,anchor:'middle',weight:700})+label('−15 μC',(L+R)/2,B+TH+36,{size:28,color:QC,anchor:'middle',weight:700}));
 return fade(g,s);
}
// 表：rows の光り hl=[r1,r2]、Q÷V の欄 ratio、各行の値 rv=[a,b]、セルの強調 cell=[[行,列,g],…]
const TB={x:458,y:95,cw:[128,134,124],rh:56};
const tbx=i=>TB.x+TB.cw.slice(0,i).reduce((a,b)=>a+b,0)+TB.cw[i]/2;
function table({g=1,hl=[0,0],ratio=0,rv=[0,0],cell=[]}={}){
 const W=TB.cw.reduce((a,b)=>a+b),{x,y,rh}=TB,cols=ratio>0?W:W-TB.cw[2];
 let s=card(x,y,cols+(W-cols)*ratio,rh*3+16,'',1,C.faint);
 s+=label('電圧 V',tbx(0),y+42,{size:26,color:VC,anchor:'middle',weight:700})+label('電荷 Q',tbx(1),y+42,{size:26,color:QC,anchor:'middle',weight:700});
 s+=fade(ratio,label('Q ÷ V',tbx(2),y+42,{size:26,color:CC,anchor:'middle',weight:700}));
 const R=[['2.0 V','6.0 μC'],['4.0 V','12 μC']];
 R.forEach((r,i)=>{const yy=y+rh*(i+1)+42;
  if(hl[i]>0)s+=fade(hl[i],rect(x+8,yy-38,cols-16,52,{fill:HI,fo:.1,stroke:HI,sw:2,rx:10}));
  s+=label(r[0],tbx(0),yy,{size:28,color:INK,anchor:'middle'})+label(r[1],tbx(1),yy,{size:28,color:INK,anchor:'middle'});
  s+=fade(rv[i],label('3.0',tbx(2),yy,{size:30,color:CC,anchor:'middle',weight:700}));});
 for(const [r,c,gg] of cell)if(gg>0)s+=frame(tbx(c)-TB.cw[c]/2+10,y+rh*(r+1)+6,TB.cw[c]-20,48,gg);
 return fade(g,s);
}
// Q–V グラフ（横 電圧、縦 電荷）
const GR={x:905,y:400,w:250,h:250,xm:6,ym:20};
const gX=v=>GR.x+GR.w*v/GR.xm,gY=q=>GR.y-GR.h*q/GR.ym;
function graph({g=1,pts=[0,0],ln=0,ext=0,q15=0}={}){
 const {x,y,w,h}=GR;
 let s=arrow(x-10,y,x+w+26,y,{color:DIM,w:2.5,head:14})+arrow(x,y+10,x,y-h-26,{color:DIM,w:2.5,head:14});
 for(const v of [2,4,6])s+=line(gX(v),y-6,gX(v),y+6,{color:DIM})+label(String(v),gX(v),y+32,{size:22,color:DIM,anchor:'middle'});
 for(const q of [5,10,15,20])s+=line(x-6,gY(q),x+6,gY(q),{color:DIM})+label(String(q),x-12,gY(q)+8,{size:22,color:DIM,anchor:'end'});
 s+=label('電荷 Q（μC）',x+14,y-h-8,{size:24,color:QC,weight:700})+label('電圧 V（V）',x+w/2+10,y+66,{size:24,color:VC,anchor:'middle',weight:700});
 if(ln>0)s+=line(gX(0),gY(0),gX(4.6*ln),gY(3*4.6*ln),{color:CC,w:4.5});
 if(ext>0){const v=mix(4.6,5,ext);s+=line(gX(4.6),gY(13.8),gX(v),gY(3*v),{color:CC,w:4,dash:'8 7'});
  s+=fade(seg(ext,.6,1),line(gX(5),gY(0),gX(5),gY(15),{color:VC,w:2.5,dash:'6 6'})+line(gX(0),gY(15),gX(5),gY(15),{color:QC,w:2.5,dash:'6 6'}));}
 if(q15>0)s+=fade(q15,label('5.0',gX(5),y+32,{size:22,color:VC,anchor:'middle',weight:700})+label('15 μC',gX(0)+10,gY(15)-12,{size:26,color:QC,weight:700})
  +rect(gX(5)-7,gY(15)-7,14,14,{fill:QC,fo:1,stroke:'none',rx:7}));
 [[2,6],[4,12]].forEach(([v,q],i)=>{if(pts[i]>0)s+=fade(pts[i],rect(gX(v)-8,gY(q)-8,16,16,{fill:QC,fo:1,stroke:'none',rx:8}));});
 return fade(g,s);
}
// 小問1 の図の全体（問題アニメの最後の状態が基本）
const S1=(o={})=>circ({n:8,volt:'4.0 V',...o.c})+table({...o.t})+graph({pts:[1,1],...o.g});
// 表の下（x 440〜860、y 290〜470）の式の場所
const MID={x:440,w:430};

// ================= 小問2：前後の板 =================
const BOT=410;                                   // 下の板の上の面の y（前・後でそろえる）
const pr=(cx,w,d,o={})=>pair(cx,BOT-d-26,w,d,{field:0,vbar:0,n:0,...o});
function dBr(x,d,txt,{g=1,col=INK,side='left'}={}){
 const y1=BOT-d,y2=BOT,dx=side==='left'?-1:1,tx=x+dx*14;
 return fade(g,line(x,y1,x,y2,{color:col,w:2.5})+line(x-8,y1,x+8,y1,{color:col,w:2.5})+line(x-8,y2,x+8,y2,{color:col,w:2.5})
  +label(txt,tx,(y1+y2)/2+9,{size:26,color:col,anchor:side==='left'?'end':'start',weight:700}));
}
// 定数の札（画面の上）。hiEps：ε₀ を光らせる。hiM：単位の m を枠で囲む
function consts({g=1,hiEps=0,hiM=0}={}){
 let s=card(110,84,980,58,'',1,C.faint);
 s+=TX(`${Ct}=\\varepsilon_0A/d`,215,124,{size:34});
 s+=label('（動画で 結果として 示した 式）',300,122,{size:22,color:DIM});
 s+=TX(`\\varepsilon_0\\approx8.85\\times10^{-12}\\ \\mathrm{C^2/(N\\cdot m^2)}`,870,124,{size:32});
 if(hiEps)s+=frame(668,90,92,46,hiEps);
 if(hiM)s+=frame(1000,90,80,46,hiM);
 return fade(g,s);
}
const BEF={cx:260,w:160,d:50},AFT={cx:760,w:320,d:200};
function befAft({g=1,aft=1,labs=1}={}){
 let s=pr(BEF.cx,BEF.w,BEF.d)+dBr(BEF.cx-BEF.w/2-26,BEF.d,'d',{g:labs});
 s+=fade(labs,label('A',BEF.cx,BOT-BEF.d-26-14,{size:28,color:INK,anchor:'middle',weight:700})+label('前',BEF.cx,BOT+64,{size:30,color:DIM,anchor:'middle',weight:700}));
 s+=fade(aft,arrow(400,300,500,300,{color:DIM,w:4,head:16})+pr(AFT.cx,AFT.w,AFT.d)+dBr(AFT.cx+AFT.w/2+26,AFT.d,'間隔 ×4',{side:'right'})
  +label('面積 ×2',AFT.cx,BOT-AFT.d-26-14,{size:28,color:INK,anchor:'middle',weight:700})+label('後',AFT.cx,BOT+64,{size:30,color:DIM,anchor:'middle',weight:700}));
 return fade(g,s);
}
// 式 C＝ε₀A/d（A は四角、d は丸の枠）。fA,fD：枠。mA,mD：枠の横の札
const FX=950;
function formula({g=1,fA=0,fD=0,mA='',mAg=0,mD='',mDg=0,y=150,h=170,whole='',wholeG=0}={}){
 let s=card(640,y,540,h,'',1,C.faint);
 const cy=y+h/2;
 s+=TX(`${Ct}=`,FX-120,cy+14,{size:58});
 s+=TX(`\\varepsilon_0`,FX-22,cy-24,{size:54})+TX(`A`,FX+36,cy-24,{size:54});
 s+=line(FX-60,cy,FX+70,cy,{color:INK,w:4});
 s+=TX(`d`,FX+5,cy+56,{size:54});
 if(fA)s+=fade(fA,rect(FX+12,cy-72,50,58,{fill:'none',fo:0,stroke:INK,sw:3,rx:2}));
 if(fD)s+=fade(fD,`<ellipse cx="${FX+5}" cy="${cy+40}" rx="28" ry="30" fill="none" stroke="${INK}" stroke-width="3"/>`);
 if(mA)s+=fade(mAg,label(mA,FX+78,cy-30,{size:32,color:HI,weight:700}));
 if(mD)s+=fade(mDg,label(mD,FX+44,cy+54,{size:32,color:HI,weight:700}));
 if(whole)s+=fade(wholeG,label(whole,FX+130,cy+12,{size:34,color:HI,weight:700}));
 return fade(g,s);
}
// 動く板の組（左）：幅 w・間隔 d・V の棒の高さ vh
const work=(w,d,vh,o={})=>pair(300,BOT-d-26,w,d,{field:1,vbar:1,vh,n:6,...o});

// ================= 小問3：斜めから見た 20 cm 四方の板 =================
const P3={x:150,W:270,dx:110,dy:72,yt:250,yb:360,th:12};
function slab(y,{g=1,fill='#8795ad'}={}){
 const {x,W,dx,dy,th}=P3;
 return fade(g,poly([[x,y],[x+W,y],[x+W+dx,y-dy],[x+dx,y-dy]],{fill,fo:.35,stroke:DIM,sw:2.5})
  +poly([[x,y],[x+W,y],[x+W,y+th],[x,y+th]],{fill,fo:.5,stroke:DIM,sw:2})+poly([[x+W,y],[x+W+dx,y-dy],[x+W+dx,y-dy+th],[x+W,y+th]],{fill,fo:.45,stroke:DIM,sw:2}));
}
function plates3({g=1,labs=1,aLab=0}={}){
 const {x,W,dx,dy,yt,yb,th}=P3;
 let s=slab(yb)+slab(yt);
 s+=fade(labs,line(x,yb+th+24,x+W,yb+th+24,{color:INK,w:2.5})+line(x,yb+th+16,x,yb+th+32,{color:INK,w:2.5})+line(x+W,yb+th+16,x+W,yb+th+32,{color:INK,w:2.5})
  +label('20 cm',x+W/2,yb+th+58,{size:28,color:INK,anchor:'middle',weight:700})
  +label('20 cm',x+W+dx/2+26,yt-dy/2-8,{size:28,color:INK,weight:700})
  +line(x-22,yt+th,x-22,yb,{color:INK,w:2.5})+line(x-30,yt+th,x-14,yt+th,{color:INK,w:2.5})+line(x-30,yb,x-14,yb,{color:INK,w:2.5})
  +label('2.0 mm',x-30,(yt+th+yb)/2+9,{size:26,color:INK,anchor:'end',weight:700}));
 s+=note('（間隔は 大きく誇張）',x+W/2+40,yb+th+100,{g:labs});
 if(aLab>0)s+=fade(aLab,label('A＝0.040 m²',x+W/2+dx/2,yt-dy/2+10,{size:28,color:HI,anchor:'middle',weight:700}));
 return fade(g,s);
}
const RX=600,RW=580;
const MB=`{\\color{${HI}}\\boxed{\\mathrm{m}}}`;

export const qxHsECapacitor1Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1）：回路・表・空の Q–V グラフ。電池の札 2.0 V → 4.0 V のたびに ＋と− が同じ数だけ増え、表の行が光り、点を1つ打つ。3 秒で静止。
 [K+'q0']:(p)=>{
  const n=lin(p,.2,.45)*4+lin(p,.58,.82)*4,v2=seg(p,.5,.56);
  let s=circ({n,volt:'2.0 V',voltG:seg(p,.12,.2)*(1-v2)})+fade(v2,label('4.0 V',O.WX+40,(yT+yB)/2+11,{size:30,color:VC,weight:700}));
  s+=fade(seg(p,0,.12),table({hl:[seg(p,.3,.4)*(1-seg(p,.52,.6)),seg(p,.72,.8)*(1-seg(p,.92,1))]}));
  s+=fade(seg(p,0,.12),graph({pts:[seg(p,.4,.48),seg(p,.82,.9)]}));
  return s+LEG(seg(p,0,.12));
 },
 // 小問2：暗転して前後の板。面積 ×2・間隔 ×4。定数の札。2 秒で静止（倍率の答えは出さない）。
 [K+'q2']:(p)=>consts({g:seg(p,0,.25)})+befAft({g:seg(p,.1,.4),aft:seg(p,.4,.75),labs:seg(p,.2,.5)})+LEG(seg(p,0,.25)),
 // 小問3：暗転して 20 cm 四方・2.0 mm の板（斜めから）。定数の札。2 秒で静止（m に直した値・容量は出さない）。
 [K+'q3']:(p)=>consts({g:seg(p,0,.25)})+plates3({g:seg(p,.1,.45),labs:seg(p,.4,.8)})+LEG(seg(p,0,.25)),

 // ================= S1 小問1 =================
 // 1. 出題の図。求めるもの：片方の板の電荷 Q。上の板を黄の枠で囲む
 [K+'goal1']:(p)=>S1({c:{hlT:seg(p,.3,.45)}})+goalTag(G1,{g:seg(p,.03,.15)})+LEG(),
 // 2. 表の右に Q÷V の欄。各行の Q と V を順に光らせて 3.0
 [K+'ratio']:(p,ctx)=>{
  const b=sw(ctx,1,.45),m=(b+1)/2;
  const c1=seg(p,b+.02,b+.08)*(1-seg(p,m-.04,m)),c2=seg(p,m+.02,m+.08)*(1-seg(p,.96,1));
  let s=circ({n:8,volt:'4.0 V',hlT:1-seg(p,0,.1)})+graph({pts:[1,1]});
  s+=table({ratio:seg(p,.05,.2),rv:[seg(p,m-.08,m-.02),seg(p,.88,.94)],cell:[[0,1,c1],[0,0,c1],[1,1,c2],[1,0,c2]],hl:[c1*.6,c2*.6]});
  s+=card(MID.x,300,MID.w,96,TX(`${Qt}\\div${Vt}`,MID.x+MID.w/2,358,{size:46}),seg(p,.05,.2),CC);
  return s+goalTag(G1)+LEG();
 },
 // 3. 1 V あたり 3.0 μC。「定義」タグと C＝Q/V＝3.0 μF、単位 C/V＝F。グラフに原点からの直線
 [K+'def']:(p,ctx)=>{
  const b=sw(ctx,1,.45);
  let s=circ({n:8,volt:'4.0 V'})+table({ratio:1,rv:[1,1]})+graph({pts:[1,1],ln:seg(p,.05,.4)});
  s+=fade(seg(p,.1,.25),label('1 V あたり 3.0 μC',MID.x+MID.w/2,322,{size:30,color:QC,anchor:'middle',weight:700}));
  s+=kindTag('定義',MID.x+50,382,{g:seg(p,b,b+.08)});
  s+=fade(seg(p,b,b+.08),TX(`${Ct}=\\dfrac{${Qt}}{${Vt}}=3.0${U('\\mu F')}`,MID.x+MID.w/2+50,392,{size:40}));
  s+=fade(seg(p,b+.2,b+.3),TX(`\\mathrm{C/V}=\\mathrm{F}`,MID.x+MID.w/2,462,{size:34})+label('単位',MID.x+90,460,{size:24,color:DIM,anchor:'middle',weight:700}));
  return s+goalTag(G1)+LEG();
 },
 // 4. 直線を点線で 5.0 V まで延ばし、縦軸に 15 μC。板に ＋15 μC・−15 μC。Q＝CV＝3.0×5.0＝15 μC。小問1 の答え B
 [K+'ans1']:(p,ctx)=>{
  const b=sw(ctx,1,.6),v5=seg(p,.03,.1);
  let s=circ({n:8+2*seg(p,.25,.45),volt:'4.0 V',voltG:1-v5,qlab:seg(p,.45,.55)})+fade(v5,label('5.0 V',O.WX+40,(yT+yB)/2+11,{size:30,color:VC,weight:700}));
  s+=table({ratio:1,rv:[1,1]})+graph({pts:[1,1],ln:1,ext:seg(p,.1,.4),q15:seg(p,.35,.45)});
  s+=card(MID.x,300,MID.w,150,TX(`${Qt}=${Ct}${Vt}`,MID.x+MID.w/2,350,{size:42})+fade(seg(p,.15,.3),TX(`=3.0\\times5.0=15${U('\\mu C')}`,MID.x+MID.w/2,420,{size:38})),1,QC);
  return s+goalTag(G1)+A1(seg(p,b,b+.08))+LEG();
 },
 // 5. 誤答 C：30 μC（Q は片方の板の電荷）。(+15)+(−15)＝0 を小さく
 [K+'wrongC1']:(p)=>{
  let s=circ({n:10,volt:'5.0 V',qlab:1})+table({ratio:1,rv:[1,1]})+graph({pts:[1,1],ln:1,ext:1,q15:1});
  s+=wrongCard('C','30 μC','Q は片方の板の電荷',{x:MID.x,w:MID.w,y:295,g:seg(p,.03,.1),mid:`(+15)+(-15)=0`,midSize:30});
  return s+goalTag(G1)+A1(1)+LEG();
 },
 // 6. 誤答 A：0.60 μC（C÷V、μF/V）→ 誤答 D：1.7 μC（V÷C）
 [K+'wrongAD1']:(p,ctx)=>{
  const m=wAt(ctx,'ディーは',.4);
  let s=circ({n:10,volt:'5.0 V',qlab:1})+table({ratio:1,rv:[1,1]})+graph({pts:[1,1],ln:1,ext:1,q15:1});
  s+=wrongSeq(p,ctx,[['A','0.60 μC','C÷V（μF/V）',{mid:`3.0\\div5.0=0.60`}],['D','1.7 μC','V÷C を計算',{mid:`5.0\\div3.0\\approx1.7`}]],{win:[[0,m],[m,1]],opts:{x:MID.x,w:MID.w,y:295,midSize:30}});
  return s+goalTag(G1)+A1(1)+LEG();
 },
 // ================= S2 小問2 =================
 // 7. 暗転して前後の板の図。求めるもの：容量の倍率
 [K+'goal2']:(p)=>consts()+befAft()+goalTag(G2,{g:seg(p,.05,.18)})+LEG(),
 // 8. 前の板に「A：板の面積」「d：板の間隔」→ ε₀ の札を光らせる → 近似タグ → C＝ε₀A/d（A 四角・d 丸）
 [K+'formula']:(p,ctx)=>{
  const b=sw(ctx,1,.55);
  let s=consts({hiEps:seg(p,.2,.28)*(1-seg(p,.45,.5))});
  s+=befAft({aft:1-seg(p,0,.08),labs:1});
  s+=fade(seg(p,.04,.14),label('A：板の面積',BEF.cx,200,{size:26,color:INK,anchor:'middle',weight:700})+label('d：板の間隔',BEF.cx,240,{size:26,color:INK,anchor:'middle',weight:700}));
  s+=formula({g:seg(p,.25,.35),fA:seg(p,b,b+.08),fD:seg(p,b+.15,b+.23)});
  s+=kindTag('近似',910,380,{g:seg(p,.35,.45),text:'板の間の電場は一様'});
  return s+goalTag(G2)+LEG();
 },
 // 9. 板が横に広がり、電荷の印がまばらになる（V の棒が下がる）。A の枠に ×2、容量 ×2
 [K+'area']:(p,ctx)=>{
  const b=sw(ctx,1,.55),u=seg(p,.06,.4);
  let s=consts()+work(mix(160,320,u),50,mix(40,20,seg(p,.2,.45)));
  s+=fade(seg(p,.3,.42),label('電荷が まばら → 電圧が 下がる',910,365,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=formula({fA:1,fD:1,mA:'×2',mAg:seg(p,b,b+.08),whole:'容量 ×2',wholeG:0});
  s+=fade(seg(p,b+.15,b+.25),label('容量 ×2',910,425,{size:32,color:CC,anchor:'middle',weight:700}));
  return s+goalTag(G2)+LEG();
 },
 // 10. 板が離れ、V の棒が高くなる（電場は同じ）。d の枠に ×4、式全体に ÷4
 [K+'gap']:(p,ctx)=>{
  const b=sw(ctx,1,.6),u=seg(p,.08,.45),w0=mix(320,160,seg(p,0,.06));
  let s=consts()+work(w0,mix(50,200,u),mix(40,160,u));
  s+=fade(seg(p,.25,.4),label('電場は 同じ → 電圧が 上がる',910,365,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.42),TX(`${Vt}=${Et}d`,570,330,{size:40}));
  s+=formula({fA:1,fD:1,mA:'×2',mAg:1,mD:'×4',mDg:seg(p,b-.1,b-.02)});
  s+=fade(seg(p,b+.1,b+.2),label('容量 ÷4',910,425,{size:32,color:CC,anchor:'middle',weight:700}));
  return s+goalTag(G2)+LEG();
 },
 // 11. ×2 と ÷4 を一つずつ掛けて 1/2 倍。小問2 の答え A
 [K+'ans2']:(p,ctx)=>{
  const b=sw(ctx,1,.55);
  let s=consts()+work(320,200,80);
  s+=formula({fA:1,fD:1,mA:'×2',mAg:1,mD:'×4',mDg:1});
  s+=card(640,335,540,105,TX(`2\\div4=\\dfrac{1}{2}`,860,400,{size:42})+label('倍',985,402,{size:32,color:INK,weight:700}),seg(p,.05,.2),CC);
  return s+goalTag(G2)+A2(seg(p,b,b+.08))+LEG();
 },
 // 12. 誤答 B：2 倍（d の ÷4 を忘れた）→ 誤答 C：8 倍（d は分母）
 [K+'wrongBC2']:(p,ctx)=>{
  const m=wAt(ctx,'ごとうスィー',.45);
  let s=consts()+work(320,200,80)+formula({fA:1,fD:1,mA:'×2',mAg:1,mD:'×4',mDg:1});
  s+=wrongSeq(p,ctx,[['B','2 倍','d の ÷4 を忘れた'],['C','8 倍','d は分母']],{win:[[0,m],[m,1]],opts:{x:640,w:540,y:335}});
  return s+goalTag(G2)+A2(1)+LEG();
 },
 // 13. 誤答 D：変わらない（容量は板の形で決まる）
 [K+'wrongD2']:(p)=>{
  let s=consts()+work(320,200,80)+formula({fA:1,fD:1,mA:'×2',mAg:1,mD:'×4',mDg:1});
  s+=wrongCard('D','変わらない','容量は板の形で決まる',{x:640,w:540,y:335,g:seg(p,.03,.1)});
  return s+goalTag(G2)+A2(1)+LEG();
 },
 // ================= S3 小問3 =================
 // 14. 暗転して 20 cm 四方の板。求めるもの：容量 C（F）
 [K+'goal3']:(p)=>consts()+plates3()+goalTag(G3,{g:seg(p,.05,.18)})+LEG(),
 // 15a. ε₀ の単位の m を黄の枠で囲む。「m に そろえる」
 [K+'unitm']:(p)=>{
  let s=consts({hiM:seg(p,.15,.3)})+plates3();
  s+=card(RX+80,200,RW-80,80,label('長さを m に そろえる',RX+80+(RW-80)/2,252,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,.4,.55),HI);
  return s+goalTag(G3)+LEG();
 },
 // 15b. 20 cm＝0.20 m、2.0 mm＝2.0×10⁻³ m（単位の m を黄の枠で）
 [K+'unit']:(p,ctx)=>{
  const m=wAt(ctx,'にてんゼロミリ',.45);
  let s=consts({hiM:1})+plates3();
  const g1=seg(p,.12,.2),g2=seg(p,m+.1,m+.18),cx=RX+80+(RW-80)/2;
  s+=card(RX+80,170,RW-80,90,fade(1-g1,TX(`20${U('cm')}=0.20${U('m')}`,cx,228,{size:40}))+fade(g1,TX(`20${U('cm')}=0.20\\,${MB}`,cx,228,{size:40})),seg(p,.03,.12),C.faint);
  s+=card(RX+80,285,RW-80,90,fade(1-g2,TX(`2.0${U('mm')}=2.0\\times10^{-3}${U('m')}`,cx,343,{size:40}))+fade(g2,TX(`2.0${U('mm')}=2.0\\times10^{-3}\\,${MB}`,cx,343,{size:40})),seg(p,m,m+.1),C.faint);
  return s+goalTag(G3)+LEG();
 },
 // 16. 面積 0.20×0.20＝0.040 m²（板に A＝0.040 m²）
 [K+'areaA']:(p)=>{
  let s=consts()+plates3({aLab:seg(p,.45,.6)});
  s+=card(RX+80,155,RW-80,85,TX(`20${U('cm')}=0.20${U('m')}`,RX+80+(RW-80)/2,210,{size:36}),.55,C.faint);
  s+=card(RX+80,255,RW-80,85,TX(`2.0${U('mm')}=2.0\\times10^{-3}${U('m')}`,RX+80+(RW-80)/2,310,{size:36}),.55,C.faint);
  s+=card(RX+80,355,RW-80,95,TX(`A=0.20\\times0.20=0.040${U('m^2')}`,RX+80+(RW-80)/2,415,{size:38}),seg(p,.05,.2),HI);
  return s+goalTag(G3)+LEG();
 },
 // 17. 容量 C＝8.85×10⁻¹²×0.040÷(2.0×10⁻³)（分母のかっこを黄の枠）→ 1.77×10⁻¹⁰（小さく）→ ≈1.8×10⁻¹⁰ F。小問3 の答え D
 [K+'calc3']:(p,ctx)=>{
  const b=sw(ctx,1,.75);
  let s=consts({g:.5})+plates3({g:.35,aLab:1});
  let f=TX(`${Ct}=\\varepsilon_0A/d`,890,198,{size:40});
  f+=fade(seg(p,.08,.2),TX(`=\\dfrac{8.85\\times10^{-12}\\times0.040}{(2.0\\times10^{-3})}`,890,298,{size:40}));
  f+=frame(798,284,224,50,seg(p,.25,.35));
  f+=fade(seg(p,.45,.55),TX(`=1.77\\times10^{-10}`,890,372,{size:30,color:DIM}));
  f+=fade(seg(p,.55,.65),TX(`\\approx1.8\\times10^{-10}${U('F')}`,890,432,{size:42,color:CC}));
  s+=card(600,148,580,330,f,1,C.faint);
  return s+goalTag(G3)+A3(seg(p,b,b+.06))+LEG();
 },
 // 18. 誤答 A：1.8×10⁻¹³ F（d を mm のまま）→ 誤答 B：1.8×10⁻⁶ F（A を cm² のまま）
 [K+'wrongAB3']:(p,ctx)=>{
  const m=wAt(ctx,'ビーは',.45);
  let s=consts({g:.5})+plates3({aLab:1});
  s+=card(600,150,580,110,TX(`${Ct}\\approx1.8\\times10^{-10}${U('F')}`,890,218,{size:44}),1,CC);
  s+=wrongSeq(p,ctx,[['A','1.8×10⁻¹³ F','d を mm のまま',{mid:`\\dfrac{8.85\\times10^{-12}\\times0.040}{2.0}`}],['B','1.8×10⁻⁶ F','A を cm² のまま',{mid:`\\dfrac{8.85\\times10^{-12}\\times400}{2.0\\times10^{-3}}`}]],{win:[[0,m],[m,1]],opts:{x:600,w:580,y:275,midSize:28}});
  return s+goalTag(G3)+A3(1)+LEG();
 },
 // 19. 誤答 C：4.4×10⁻¹³ F（A と d を逆にした）
 [K+'wrongC3']:(p)=>{
  let s=consts({g:.5})+plates3({aLab:1});
  s+=card(600,150,580,110,TX(`${Ct}\\approx1.8\\times10^{-10}${U('F')}`,890,218,{size:44}),1,CC);
  s+=wrongCard('C','4.4×10⁻¹³ F','A と d を逆にした',{x:600,w:580,y:275,g:seg(p,.03,.1),mid:`\\dfrac{\\varepsilon_0 d}{A}`,midSize:30});
  return s+goalTag(G3)+A3(1)+LEG();
 },
 // 20. ≈180 pF。右下に単元動画の「一辺 11 km の板（1 F）」を小さく
 [K+'pico']:(p,ctx)=>{
  const b=sw(ctx,1,.35);
  let s=consts({g:.5})+plates3({aLab:1});
  s+=card(600,150,580,170,TX(`${Ct}\\approx1.8\\times10^{-10}${U('F')}`,890,210,{size:40})+fade(seg(p,.05,.18),TX(`\\approx180${U('pF')}`,890,285,{size:52,color:CC})),1,CC);
  s+=fade(seg(p,b,b+.1),card(760,360,420,90,rect(785,385,40,40,{fill:'#8795ad',fo:.35,stroke:DIM,sw:2,rx:2})+label('一辺 11 km の板（1 F）',845,415,{size:26,color:DIM,weight:700}),1,C.faint));
  return s+goalTag(G3)+A3(1)+LEG();
 },
 // ================= S4 まとめ =================
 // 21. Q–V の直線（傾き 3.0 μF、5.0 V で 15 μC）、C＝ε₀A/d の A と d の枠（×2、÷4）、20 cm 四方の板の 約180 pF
 [K+'sum']:(p)=>{
  let s='';
  // 1) Q–V
  const g1=seg(p,.05,.15),x0=70,y0=400,X=v=>x0+v*48,Y=q=>y0-q*14;
  let a=arrow(x0-6,y0,x0+300,y0,{color:DIM,w:2.5,head:12})+arrow(x0,y0+6,x0,y0-250,{color:DIM,w:2.5,head:12});
  a+=line(X(0),Y(0),X(5.4),Y(16.2),{color:CC,w:4.5})+rect(X(5)-7,Y(15)-7,14,14,{fill:QC,fo:1,stroke:'none',rx:7});
  a+=line(X(5),Y(0),X(5),Y(15),{color:VC,w:2,dash:'6 6'})+line(X(0),Y(15),X(5),Y(15),{color:QC,w:2,dash:'6 6'});
  a+=label('5.0 V',X(5),y0+30,{size:22,color:VC,anchor:'middle',weight:700})+label('15 μC',X(0)+8,Y(15)-12,{size:24,color:QC,weight:700});
  a+=label('傾き 3.0 μF',X(3.2),Y(4)+30,{size:26,color:CC,anchor:'middle',weight:700})+label('電荷 Q',x0+14,y0-252,{size:22,color:QC,weight:700});
  s+=card(30,100,360,400,a+label('1 V あたりの 電荷',210,480,{size:26,color:INK,anchor:'middle',weight:700}),g1,C.faint);
  // 2) 式
  const g2=seg(p,.25,.35);
  let f=TX(`${Ct}=`,520,280,{size:52})+TX(`\\varepsilon_0`,600,244,{size:48})+TX(`A`,652,244,{size:48})+line(570,262,690,262,{color:INK,w:4})+TX(`d`,625,316,{size:48});
  f+=rect(632,196,44,52,{fill:'none',fo:0,stroke:INK,sw:3,rx:2})+`<ellipse cx="625" cy="302" rx="26" ry="28" fill="none" stroke="${INK}" stroke-width="3"/>`;
  f+=label('×2',690,236,{size:28,color:HI,weight:700})+label('÷4',660,322,{size:28,color:HI,weight:700});
  f+=label('広く、近いほど 大きい',600,440,{size:26,color:INK,anchor:'middle',weight:700});
  s+=card(410,100,380,400,f,g2,C.faint);
  // 3) 20 cm 四方
  const g3=seg(p,.45,.55);
  let q=`<g transform="translate(820 60) scale(.62)">${slab(360)+slab(250)}</g>`;
  q+=label('20 cm 四方・2.0 mm',1000,350,{size:24,color:INK,anchor:'middle',weight:700})+TX(`\\approx180${U('pF')}`,1000,430,{size:44,color:CC});
  s+=card(810,100,380,400,q,g3,C.faint);
  return s+answerRow([[1,'B',''],[2,'A',''],[3,'D','']],{g:seg(p,.6,.7)});
 },
};
