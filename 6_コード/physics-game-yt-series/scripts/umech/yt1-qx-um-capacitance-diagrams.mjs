// 問題編 解説「広い板、狭い間隔」（q-um-capacitance、大学編 23 コンデンサ・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/23_コンデンサ.md の q-um-capacitance（解説 20 行 → 22 cue）。
// 配置：左に板の断面（左の板＝電池の＋極側で ＋Q、右の板 −Q、𝐄 は右向き）、右に説明の枠。誤答カードは右の枠の下に1枚ずつ。
// 間隔は大きく誇張して描く（0.5 mm を 120 px、1.5 mm を 360 px）。行3〜5 は重ね合わせを見せるため、間隔を 240 px にして描く。
// 色：電場 𝐄 水色、電位・電圧 V 紫、電荷 Q・σ 桃（正電荷 赤、負電荷 青）、面積 S 金、容量 C 黄、ε₀・d 白、強調 黄、誤り 赤。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin,cueT} from './yt1-qx-common.mjs';

const K='qx-um-capacitance:';
const POS=C.a,NEG='#7fb3ff',EC=C.x,QCOL=C.p,VCOL=C.v,CCOL=C.hi,SCOL=C.t,BAD='#ff6b6b';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const um=s=>`\\,\\mathrm{${s}}`;
const sig=cs(QCOL,'\\sigma'),Qt=cs(QCOL,'Q'),St=cs(SCOL,'S'),Et=cs(EC,'E'),Vt=cs(VCOL,'V'),Ct=cs(CCOL,'C'),eps='\\varepsilon_0';
const G1='電気容量 C',G2='板の間の E',G3='間隔 1.5 mm での電圧';
const ANS1=g=>answerTag(1,'D','354 pF',{g}),ANS2=g=>answerTag(2,'A','1.2×10⁴ V/m',{g}),ANS3=g=>answerTag(3,'C','18 V',{g});
const PX=700,PW=480,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WR={x:PX,w:PW,size:26,whySize:22};

// ---- 板の断面と電池 ----
const F={LIN:240,PW:22,T:130,B:360,WY:440,BX:300,PXMM:220};
const rin=gp=>F.LIN+gp;
function plates({gp=110,g=1,signs=1,rightOp=1,n=6}={}){
 const R=rin(gp);
 let s=rect(F.LIN-F.PW,F.T,F.PW,F.B-F.T,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3});
 s+=fade(rightOp,rect(R,F.T,F.PW,F.B-F.T,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3}));
 for(let i=0;i<n;i++){const y=F.T+(F.B-F.T)*(i+.5)/n;
  s+=fade(signs,label('＋',F.LIN-F.PW/2,y+9,{size:24,color:POS,anchor:'middle',weight:700}));
  s+=fade(signs*rightOp,label('−',R+F.PW/2,y+11,{size:34,color:NEG,anchor:'middle',weight:700}));}
 return fade(g,s);
}
// 電池と導線。det＝0〜1 で導線が板から外れる（板の下 0〜28 px のすき間）
function battery({gp=110,g=1,det=0,lab=1}={}){
 const a=F.LIN-F.PW/2,b=rin(gp)+F.PW/2,gap=28*det;
 let s=draw([[a,F.B+gap],[a,F.WY],[F.BX-10,F.WY]],1,{color:C.dim,w:4})+draw([[F.BX+10,F.WY],[b,F.WY],[b,F.B+gap]],1,{color:C.dim,w:4});
 if(det>.05)s+=dot(a,F.B+gap,5,C.dim)+dot(b,F.B+gap,5,C.dim);
 s+=line(F.BX-10,F.WY-30,F.BX-10,F.WY+30,{color:C.ink,w:5})+line(F.BX+10,F.WY-16,F.BX+10,F.WY+16,{color:C.ink,w:9});
 s+=label('＋',F.BX-30,F.WY-16,{size:24,color:POS,anchor:'middle',weight:700})+label('−',F.BX+30,F.WY-16,{size:26,color:NEG,anchor:'middle',weight:700});
 s+=fade(lab,label('電池 6 V',F.BX+48,F.WY+44,{size:26,color:VCOL,weight:700}));
 return fade(g,s);
}
function dimLine(gp,txt,{g=1,y=112}={}){
 const R=rin(gp);
 return fade(g,line(F.LIN,y,R,y,{color:C.ink,w:2.5})+line(F.LIN,y-9,F.LIN,y+9,{color:C.ink,w:2.5})+line(R,y-9,R,y+9,{color:C.ink,w:2.5})
  +label(txt,(F.LIN+R)/2,y-12,{size:26,color:C.ink,anchor:'middle',weight:700}));
}
const sLab=(g=1)=>fade(g,label('S ＝ 0.02 m²',F.LIN-F.PW-14,200,{size:26,color:SCOL,anchor:'end',weight:700}));
const exag=(g=1)=>note('（間隔は 大きく 誇張）',40,505,{g,anchor:'start'});
const mmTxt=gp=>`d ＝ ${(gp/F.PXMM).toFixed(1)} mm`;
// 板の間の一様な電場（矢印の長さ 90 px は一定。間隔が広がると列が増える）
function fieldIn(gp,{g=1,rows=[170,245,320]}={}){
 if(g<=.001)return '';
 let s='';const ncol=Math.max(1,Math.floor(gp/105));
 for(let k=0;k<ncol;k++){
  const cx=F.LIN+gp*(k+.5)/ncol;for(const y of rows)s+=arrow(cx-40,y,cx+40,y,{color:EC,w:4,head:13});}
 return fade(g,s);
}
// 電位の坂（紫）：左の板から右の板へ下がる。傾きは一定（6 V あたり 60 px）
function slope(gp,{g=1,volts=6,lab='',y0=160}={}){
 if(g<=.001)return '';
 const R=rin(gp),drop=10*volts;
 let s=line(F.LIN,y0,R,y0+drop,{color:VCOL,w:6})+line(R,y0,R+40,y0,{color:VCOL,w:2,dash:'6 6'})+line(R,y0+drop,R+40,y0+drop,{color:VCOL,w:2,dash:'6 6'});
 s+=line(R+30,y0,R+30,y0+drop,{color:VCOL,w:3})+line(R+22,y0,R+38,y0,{color:VCOL,w:3})+line(R+22,y0+drop,R+38,y0+drop,{color:VCOL,w:3});
 if(lab)s+=label(lab,R+46,y0+drop/2+10,{size:28,color:VCOL,weight:700});
 s+=label('電位',F.LIN-F.PW-12,y0+8,{size:24,color:VCOL,anchor:'end',weight:700});
 return fade(g,s);
}
const base=(gp=110,o={})=>plates({gp})+battery({gp,det:o.det??0})+dimLine(gp,mmTxt(gp))+sLab()+exag();

// ---- 重ね合わせ（行3〜5）：間隔 240 px ----
const GS=240,RS=rin(GS);
const REG=[F.LIN-F.PW-80,F.LIN+GS/2,RS+F.PW+80];   // 左の外・板の間・右の外 の中心
function plusArrows(g=1,ys=[175,295]){let s='';for(const y of ys){s+=arrow(REG[0]+40,y,REG[0]-40,y,{color:EC,w:4,head:13})+arrow(REG[1]-40,y,REG[1]+40,y,{color:EC,w:4,head:13})+arrow(REG[2]-40,y,REG[2]+40,y,{color:EC,w:4,head:13});}return fade(g,s);}
function minusArrows(g=1,ys=[215,335]){const c='#9fd9ff';let s='';for(const y of ys){s+=arrow(REG[0]-40,y,REG[0]+40,y,{color:c,w:4,head:13})+arrow(REG[1]-40,y,REG[1]+40,y,{color:c,w:4,head:13})+arrow(REG[2]+40,y,REG[2]-40,y,{color:c,w:4,head:13});}return fade(g,s);}
function sumArrows(g=1){let s='';for(const y of [200,300])s+=arrow(REG[1]-85,y,REG[1]+85,y,{color:EC,w:6,head:16});
 s+=label('σ/ε₀',REG[1],258,{size:28,color:EC,anchor:'middle',weight:700})+label('0',REG[0],262,{size:40,color:C.hi,anchor:'middle',weight:700})+label('0',REG[2],262,{size:40,color:C.hi,anchor:'middle',weight:700});return fade(g,s);}

export const ytQxUmCapacitanceDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（3 秒）：板の断面・電池・S・d。静止。電場の矢印・値は出さない。
 [K+'q1']:(p)=>plates({g:seg(p,0,.3)})+battery({g:seg(p,.15,.45)})+sLab(seg(p,.45,.7))+dimLine(110,'d ＝ 0.5 mm',{g:seg(p,.6,.85)})+exag(seg(p,.6,.85)),
 // 小問3（5 秒）：暗転から出題図 → 導線が外れる → 右の板が右へ動き 0.5 → 1.5 mm。広がったところで静止。
 [K+'q3']:(p)=>{
  const det=seg(p,.18,.36),w=seg(p,.45,.88),gp=110+220*w;
  const say=seg(p,.2,.32)*(1-seg(p,.42,.48));
  let s=plates({gp})+battery({gp,det,lab:1-say})+sLab()+exag();
  s+=dimLine(gp,mmTxt(gp));
  s+=fade(say,label('電池を 外す',F.BX+48,F.WY+44,{size:26,color:C.hi,weight:700}));
  return fade(seg(p,0,.12),s);
 },

 // ===================== 小問1 =====================
 [K+'intro']:(p)=>base(),
 [K+'goal1']:(p)=>base()+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. ＋の板だけ（右の板は 20%）。σ の札 → σ/(2ε₀)。両側に同じ長さの外向きの矢印
 [K+'one']:(p,ctx)=>{
  let s=plates({gp:GS,rightOp:.2});
  s+=plusArrows(seg(p,.25,.45));
  s+=panel(100,290,label('σ ＝ 1 m² あたりの 電荷',PC,150,{size:28,color:QCOL,anchor:'middle',weight:700})
   +fade(seg(p,.3,.42),label('1枚の 広い板の 電場',PC,210,{size:24,color:C.dim,anchor:'middle'})+T(`\\dfrac{${sig}}{2${eps}}`,PC,305,48)),seg(p,.03,.15));
  s+=fade(seg(p,.55,.7),label('板に 垂直、距離に よらない',PC,440,{size:26,color:EC,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 4. −の板の矢印を重ね、板の間は σ/ε₀、外側は 0
 [K+'two']:(p,ctx)=>{
  const mix_=seg(p,.45,.6);
  let s=plates({gp:GS,rightOp:mix(.2,1,seg(p,0,.15))});
  s+=plusArrows(1-mix_)+minusArrows(seg(p,.1,.3)*(1-mix_))+sumArrows(mix_);
  s+=fade(seg(p,.15,.3)*(1-mix_),label('＋の板',REG[1],150,{size:24,color:POS,anchor:'middle',weight:700})+label('−の板',REG[1],375,{size:24,color:NEG,anchor:'middle',weight:700}));
  s+=panel(100,260,label('重ね 合わせ',PC,150,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.62),label('板の 間',PX+110,240,{size:26,color:C.ink,anchor:'middle',weight:700})+T(`\\dfrac{${sig}}{${eps}}`,PX+330,240,44))
   +fade(seg(p,.65,.75),label('外側',PX+110,320,{size:26,color:C.ink,anchor:'middle',weight:700})+label('0',PX+330,330,{size:40,color:C.hi,anchor:'middle',weight:700})),1);
  return s+goalTag(G1);
 },
 // 5. σ＝Q/S → E＝Q/(ε₀S) → V＝Ed＝Qd/(ε₀S)。板の間に電位の坂
 [K+'pot']:(p)=>{
  let s=plates({gp:GS})+fade(mix(1,.35,seg(p,.5,.6)),sumArrows(1));
  s+=dimLine(GS,'d');
  s+=slope(GS,{g:seg(p,.55,.7),volts:6,lab:'V',y0:150});
  const l1=seg(p,.03,.12),l2=seg(p,.2,.3),l3=seg(p,.45,.55);
  s+=panel(100,380,fade(l1,T(`${sig}=\\dfrac{${Qt}}{${St}}`,PC,175,40))
   +fade(l2,T(`${Et}=\\dfrac{${Qt}}{${eps}${St}}`,PC,285,40))
   +fade(l3,T(`${Vt}=${Et}d=\\dfrac{${Qt}d}{${eps}${St}}`,PC,400,40)),1);
  return s+goalTag(G1);
 },
 // 6. C＝Q/V に入れて Q を約分 → C＝ε₀S/d（黄の枠）
 [K+'cap']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,cn=seg(p,.3,.38);
  const Qc=cn>.5?`{\\color{${BAD}}\\cancel{${Qt}}}`:Qt;
  let s=T(`${Ct}=\\dfrac{${Qt}}{${Vt}}=\\dfrac{${Qc}}{${Qc}d/(${eps}${St})}`,600,180,48,{opacity:1});
  s+=fade(seg(p,.38,.48),T(`${Ct}=\\dfrac{${eps}${St}}{d}`,600,350,56)+highlight(600-135,265,270,160,1,C.hi));
  s+=fade(seg(p,b,b+.1),label('板の形（S と d）と ε₀ だけ',600,480,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 7. 0.5 mm＝5×10⁻⁴ m を枠で → 計算を一行ずつ
 [K+'calc']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=fade(seg(p,.03,.12),T(`d=0.5\\,\\mathrm{mm}=5\\times10^{-4}\\,\\mathrm{m}`,600,140,40)+highlight(600-230,100,460,66,1,C.hi));
  s+=fade(seg(p,b,b+.08),T(`${Ct}=\\dfrac{8.85\\times10^{-12}\\times0.02}{5\\times10^{-4}}`,600,270,42));
  s+=fade(seg(p,b+.3,b+.4),T(`=3.54\\times10^{-10}\\,\\mathrm{F}=${cs(CCOL,'354\\,\\mathrm{pF}')}`,600,400,42));
  return s+goalTag(G1);
 },
 // 8. 答えの札 D。2文目で誤答 A
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=panel(100,170,T(`${Ct}=\\dfrac{${eps}${St}}{d}=${cs(CCOL,'354\\,\\mathrm{pF}')}`,PC,190,40),1,C.hi);
  s+=base();
  s+=wrongCard('A','708 pF','電場を1枚分 σ/(2ε₀) にした',{...WR,y:300,g:seg(p,b,b+.06)});
  return s+goalTag(G1)+ANS1(seg(p,.03,.12));
 },
 // 9. 誤答 B → C
 [K+'wrong1']:(p,ctx)=>{
  let s=panel(100,170,T(`${Ct}=\\dfrac{${eps}${St}}{d}=${cs(CCOL,'354\\,\\mathrm{pF}')}`,PC,190,40),1,C.hi);
  s+=base();
  s+=wrongSeq(p,ctx,[['B','0.221 pF','ε₀d/S と逆にした'],['C','0.354 pF','mm を m に直していない']],{opts:{...WR,y:300}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 10. 板の間だけに一様な矢印、外側には何もない
 [K+'goal2']:(p)=>base()+fieldIn(110,{g:seg(p,.15,.35)})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 11. 電位の坂（下がり幅 6 V、長さ d を黄で）。E＝V/d
 [K+'field']:(p,ctx)=>{
  let s=base()+fade(mix(1,.35,seg(p,.05,.15)),fieldIn(110));
  s+=slope(110,{g:seg(p,.05,.25),volts:6,lab:'6 V'});
  s+=fade(seg(p,.3,.45),highlight(F.LIN-10,88,140,40,1,C.hi));
  s+=panel(100,200,label('坂の 下がり幅 ＝ E × d',PC,160,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.7),T(`${Et}=\\dfrac{${Vt}}{d}`,PC,240,48)),seg(p,.1,.2));
  return s+goalTag(G2);
 },
 // 12. 6÷(5×10⁻⁴)＝1.2×10⁴ V/m
 [K+'field2']:(p)=>{
  let s=base()+fade(.35,fieldIn(110))+slope(110,{volts:6,lab:'6 V'});
  s+=panel(100,200,T(`${Et}=\\dfrac{${Vt}}{d}`,PC,160,40)
   +fade(seg(p,.1,.3),T(`=\\dfrac{6}{5\\times10^{-4}}=${cs(EC,'1.2\\times10^{4}\\,\\mathrm{V/m}')}`,PC,250,36)),1);
  return s+goalTag(G2);
 },
 // 13. 二通りの計算を左右に並べて「一致」。2文目で答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=card(40,110,540,280,label('電位の 坂から',310,160,{size:26,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{${Vt}}{d}=\\dfrac{6}{5\\times10^{-4}}`,310,240,38)+T(`=${cs(EC,'1.2\\times10^{4}\\,\\mathrm{V/m}')}`,310,330,38),1);
  s+=card(620,110,540,280,label('電荷から',890,160,{size:26,color:C.dim,anchor:'middle'})
   +T(`${Qt}=${Ct}${Vt}\\approx2.12\\times10^{-9}\\,\\mathrm{C}`,890,220,30)
   +T(`\\dfrac{${Qt}}{${eps}${St}}=${cs(EC,'1.2\\times10^{4}\\,\\mathrm{V/m}')}`,890,320,36),seg(p,.05,.2));
  s+=fade(seg(p,.35,.5),label('一致',600,450,{size:34,color:C.hi,anchor:'middle',weight:700})+label('＝',600,265,{size:44,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G2)+ANS2(seg(p,b,b+.08));
 },
 // 14. 誤答 B → C → D（D のとき外側の 0 を示す）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],wB=[0,e0*.5],wC=[e0*.5,e0],wD=[W[1]?W[1][0]:.6,1],inD=seg(p,wD[0]+.01,wD[0]+.06);
  let s=base()+fieldIn(110);
  s+=fade(inD,label('外側 0',90,290,{size:28,color:C.hi,anchor:'middle',weight:700})+label('外側 0',470,290,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(100,150,T(`${Et}=${cs(EC,'1.2\\times10^{4}\\,\\mathrm{V/m}')}`,PC,185,38),1);
  s+=wrongSeq(p,ctx,[['B','6.0×10³','1枚分だけ'],['C','3.0×10⁻³','掛けた（単位 V·m）'],['D','0','外側の 0 を当てはめた']],{win:[wB,wC,wD],opts:{...WR,y:280}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 15. 出題図の後半の前の状態（電池につないだまま、0.5 mm）
 [K+'goal3']:(p)=>base()+goalTag(G3,{g:seg(p,.03,.15)}),
 // 16. 導線が外れる。＋−の印の数はそのまま。「Q を固定」
 [K+'fixQ']:(p)=>{
  const det=seg(p,.1,.35);
  let s=plates()+battery({det})+dimLine(110,mmTxt(110))+sLab()+exag();
  s+=panel(110,170,label('電荷の 逃げ場が ない',PC,170,{size:28,color:C.ink,anchor:'middle'})
   +label('Q を 固定',PC,235,{size:36,color:QCOL,anchor:'middle',weight:700}),seg(p,.4,.55),QCOL);
  return s+goalTag(G3);
 },
 // 17. 右の板が離れる。矢印の長さは同じで列が増える。E＝Q/(ε₀S) に d がない
 [K+'widen']:(p)=>{
  const w=seg(p,.1,.55),gp=110+220*w;
  let s=plates({gp})+battery({gp,det:1})+dimLine(gp,mmTxt(gp))+sLab()+exag()+fieldIn(gp);
  s+=panel(100,220,T(`${Et}=\\dfrac{${Qt}}{${eps}${St}}`,PC,190,48)
   +fade(seg(p,.55,.7),label('d が 入って いない',PC,285,{size:28,color:C.hi,anchor:'middle',weight:700})),1,mix(0,1,seg(p,.55,.7))>.5?C.hi:C.faint);
  s+=fade(seg(p,.65,.8),label('1.2×10⁴ V/m の まま',PC,380,{size:28,color:EC,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 18. 坂が3倍に伸び、下がり幅 6 V → 18 V。2文目で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  const gp=330,ext=seg(p,.05,.35);
  let s=plates({gp})+battery({gp,det:1})+dimLine(gp,mmTxt(gp))+sLab()+exag()+fade(.35,fieldIn(gp));
  const g6=1-seg(p,.05,.12);
  s+=fade(g6,slope(110,{volts:6,lab:'6 V'}));
  s+=fade(seg(p,.05,.12),slope(110+220*ext,{volts:6+12*ext,lab:ext>.95?'18 V':''}));
  s+=panel(100,170,T(`${Vt}=${Et}d`,PC,150,36)+fade(seg(p,.3,.45),T(`=1.2\\times10^{4}\\times1.5\\times10^{-3}=${cs(VCOL,'18\\,\\mathrm{V}')}`,PC,225,28)),1);
  return s+goalTag(G3)+ANS3(seg(p,b,b+.08));
 },
 // 19. 表：C 354 → 118 pF、Q 一定、V 6 → 18 V
 [K+'table']:(p)=>{
  const x0=200,y0=130,cw=[220,280,280],rh=80,rows=[['','0.5 mm','1.5 mm'],['C','354 pF','118 pF'],['Q','同じ','同じ'],['V','6 V','18 V']];
  const cols=[CCOL,QCOL,VCOL];
  let s='';
  rows.forEach((r,i)=>{const y=y0+i*rh,g=i===0?1:seg(p,.1+.18*(i-1),.2+.18*(i-1));
   let xx=x0;r.forEach((c,j)=>{const w=cw[j];
    s+=fade(g,rect(xx,y,w,rh,{fill:i===0?'#1a2744':'#131f38',fo:.95,stroke:C.faint,sw:2,rx:0})
     +label(c,xx+w/2,y+rh/2+10,{size:i===0?26:30,color:i===0?C.dim:j===0?cols[i-1]:C.ink,anchor:'middle',weight:700}));xx+=w;});});
  s+=fade(seg(p,.62,.75),T(`\\dfrac{${Qt}}{${Ct}}=${cs(VCOL,'18\\,\\mathrm{V}')}`,1080,330,40));
  return s+goalTag(G3)+ANS3(1);
 },
 // 20–21. 誤答 A → B（行19 の1文目）→ D（2文目）。広げた後の図
 [K+'wrong3']:(p,ctx)=>{
  let s=plates({gp:330})+battery({gp:330,det:1})+dimLine(330,mmTxt(330))+sLab()+exag()+fade(.35,fieldIn(330))+slope(330,{volts:18,lab:'18 V'});
  s+=wrongSeq(p,ctx,[['A','6 V','電圧一定と考えた'],['B','54 V','電場も3倍にした']],{opts:{...WR,y:200},keepLast:false});
  return s+goalTag(G3)+ANS3(1);
 },
 [K+'wrong3b']:(p,ctx)=>{
  let s=plates({gp:330})+battery({gp:330,det:1})+dimLine(330,mmTxt(330))+sLab()+exag()+fade(.35,fieldIn(330))+slope(330,{volts:18,lab:'18 V'});
  s+=wrongCard('D','2 V','電圧も 1/3 にした',{...WR,y:200,g:seg(p,.02,.08)});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=fade(seg(p,.03,.15),label('何を 固定するかで、変わる 量が 違う',600,170,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.08),T(`${Ct}=\\dfrac{${eps}${St}}{d}`,600,320,64)+highlight(600-150,225,300,180,1,C.hi));
  s+=fade(seg(p,b+.1,b+.2),label('いつも 板の 形だけで 決まる',600,460,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'D','354 pF'],[2,'A','1.2×10⁴ V/m'],[3,'C','18 V']],{g:seg(p,.7,.8),size:24});
  return s;
 },
};
