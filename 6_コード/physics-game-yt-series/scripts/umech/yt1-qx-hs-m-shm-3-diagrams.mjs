// 問題編 解説「長い振り子の周期」(ys-qx-hs-m-shm-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/110_単振動.md の q-hs-m-shm-3（解説 19 行）。
// 振り子：l＝2.45 m、m＝0.50 kg、g＝9.8 m/s²、T≈2π√(l/g)＝π≈3.14 s。角 θ は真下から測り、右に振れると正。
//   揺れは実時間（ω＝2.0 rad/s）で描く。角は見やすいように大きめ（0.40 rad）に描き、注記を出す。
// 小問2（行9〜13）：糸の長さを 1：4 の比で並べて描く（元の振り子 100 px、長い振り子 400 px）。
// 色（単元動画と同じ）：x・弧 水色、力 mg 緑（円弧方向の成分 黄）、角 θ 橙、ω 桃、t・T 金、強調 黄、誤り 赤。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex} from './anim.mjs';
import {T2,FA} from './yt1-hs-m-shm-1-diagrams.mjs';
import {ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongCard,wrongSeq,pauseBadge,note,cueT,tAt,durOf,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-shm-3:';
const PI=Math.PI,TAU=2*PI;
const TT=`{\\color{${C.t}}T}`,W=`{\\color{${C.p}}\\omega}`,TH=`{\\color{${C.E}}\\theta}`;
const G1='周期 T',G2='m 2倍・l 4倍の周期',G3='式を使ってよい条件';
const A1=g=>answerTag(1,'A','3.1 s',{g}),A2=g=>answerTag(2,'D','6.3 s',{g}),A3=g=>answerTag(3,'B','',{g});
const ansG=(p,ctx,back=.16)=>{const v=voiceEnd(ctx);return seg(p,v-back,v-back+.06);};
const AMP=.4,OM=2.0,TP=PI;                       // 画面の振れ（rad）、ω＝2.0 rad/s、T＝π s
const big=(g=1,x=600,y=505)=>note('（角は 見やすいように 大きめに 描いています）',x,y,{g});

// ---- pendulum ------------------------------------------------------------------------------------------
const P0={x:330,y:92,L:260,r:22};
function pend(th,{o=P0,g=1,vert=1,ang=0,xarc=0,mg=0,split=0,comps=0,labs=0,m='0.50 kg',Lt='2.45 m',two=0,mgLen=130,hiTan=0}={}){
 const bx=o.x+o.L*Math.sin(th),by=o.y+o.L*Math.cos(th);
 let s=fade(g,line(o.x-110,o.y,o.x+110,o.y,{color:C.dim,w:4}));
 for(let q=o.x-100;q<o.x+110;q+=22)s+=fade(g,line(q,o.y,q+12,o.y-12,{color:C.faint,w:2}));
 if(vert)s+=fade(g*vert,line(o.x,o.y,o.x,o.y+o.L+36,{color:C.faint,w:1.5,dash:'5 6'}));
 const arcP=(r,a1,a2,n=24)=>Array.from({length:n+1},(_,i)=>{const a=a1+(a2-a1)*i/n;return [o.x+r*Math.sin(a),o.y+r*Math.cos(a)];});
 if(xarc&&Math.abs(th)>.01)s+=fade(g*xarc,draw(arcP(o.L,0,th,30),1,{color:C.x,w:6})+label('x',o.x+(o.L+28)*Math.sin(th/2),o.y+(o.L+28)*Math.cos(th/2)+10,{size:28,color:C.x,anchor:'middle',weight:700}));
 if(ang&&Math.abs(th)>.01)s+=fade(g*ang,draw(arcP(64,0,th,16),1,{color:C.E,w:3})+label('θ',o.x+88*Math.sin(th/2),o.y+88*Math.cos(th/2)+9,{size:28,color:C.E,anchor:'middle',weight:700}));
 s+=fade(g,line(o.x,o.y,bx,by,{color:C.ink,w:2.5}));
 if(labs)s+=fade(g*labs,label(Lt,o.x+.5*o.L*Math.sin(th)-14,o.y+.5*o.L*Math.cos(th),{size:24,color:C.ink,anchor:'end',weight:700}));
 if(mg){const G=mgLen;s+=FA(bx,by,bx,by+G,{g:g*mg,w:7,head:18})+fade(g*mg,label('mg',bx+14,by+G-6,{size:26,color:C.F,weight:700}));
  if(split){const ux=Math.sin(th),uy=Math.cos(th),tx=-Math.cos(th),ty=Math.sin(th),c=G*Math.cos(th),sn=G*Math.sin(th);
   s+=fade(g*split,line(bx+tx*-80,by+ty*-80,bx+tx*120,by+ty*120,{color:C.faint,w:2,dash:'4 6'})+line(bx,by,bx+ux*170,by+uy*170,{color:C.faint,w:2,dash:'4 6'}));
   if(comps){s+=arrow(bx,by,bx+ux*c,by+uy*c,{color:'#b9f5dc',w:4,head:13,g:g*comps});
    s+=arrow(bx,by,bx+tx*sn,by+ty*sn,{color:hiTan?C.hi:C.F,w:7,head:16,g:g*comps});
    s+=fade(g*comps*.8,line(bx+ux*c,by+uy*c,bx,by+G,{color:C.dim,w:1.5,dash:'4 5'})+line(bx+tx*sn,by+ty*sn,bx,by+G,{color:C.dim,w:1.5,dash:'4 5'}));
    s+=fade(g*comps,label('mg sinθ',bx+tx*sn-12,by+ty*sn-14,{size:26,color:hiTan?C.hi:C.F,anchor:'end',weight:700}));}}}
 if(two){s+=fade(g,ball(bx,by-o.r*.95,{r:o.r})+ball(bx,by+o.r*.95,{r:o.r}));}
 else s+=fade(g,ball(bx,by,{r:o.r}));
 if(labs&&m)s+=fade(g*labs,label(m,bx+o.r+12,by+(two?o.r*.95:0)+8,{size:24,color:C.ink,weight:700}));
 return s;
}
const swing=t=>AMP*Math.cos(OM*t);
// ---- clock ---------------------------------------------------------------------------------------------
function clock(x,y,{r=44,txt='',g=1,turn=0,size=26}={}){
 let s=ring(x,y,r,{color:C.t,w:3,fill:'#1a2234'});
 for(let i=0;i<12;i++){const a=i*PI/6;s+=line(x+(r-7)*Math.sin(a),y-(r-7)*Math.cos(a),x+(r-2)*Math.sin(a),y-(r-2)*Math.cos(a),{color:C.t,w:2});}
 const a=TAU*turn;s+=line(x,y,x+(r-12)*Math.sin(a),y-(r-12)*Math.cos(a),{color:C.t,w:3})+dot(x,y,3,C.t);
 if(txt)s+=label(txt,x,y+r+30,{size,color:C.t,anchor:'middle',weight:700});
 return fade(g,s);
}
const givens=(g=1)=>fade(g,label('g ＝ 9.8 m/s²',1180,120,{size:26,color:C.ink,anchor:'end',weight:700})+label('π ≈ 3.14',1180,160,{size:26,color:C.ink,anchor:'end',weight:700}));
const pane=(y,h,inner,g=1,stroke=C.hi)=>card(640,y,550,h,inner,g,stroke);
// 揺れを止める時刻（行2）：setup から数えて、右端に来る最初の時刻
const tStop=ctx=>Math.ceil((durOf(ctx,K+'setup',6)+1.2)/TP)*TP;
// ---- 小問2 の2つの振り子（1：4）-----------------------------------------------------------------------
const PS={x:230,y:90,L:100,r:18},PLg={x:600,y:86,L:400,r:18};
function pair({g=1,longG=1,clkL='',clkR='',cR=1,mgG=0}={}){
 let s=pend(0,{o:PS,g,labs:1,vert:0});
 s+=pend(0,{o:PLg,g:g*longG,labs:1,vert:0,m:'1.0 kg',Lt:'9.8 m',two:1});
 if(clkL)s+=clock(PS.x+200,180,{r:40,txt:clkL,g});
 if(clkR)s+=clock(PLg.x+100,200,{r:44,txt:clkR,g:g*longG*cR});
 return s;
}
const WR={x:640,w:550,y:300},WP={x:800,w:390,y:300,whySize:22};

export const qxHsMShm3Diagrams={
 // ================= 問題アニメ =================
 // 出題（5秒＋静止）：0〜2 s 天井・糸・おもり・札・g・π。2〜3 s おもりを小さい角まで寄せて止める（θ 橙、弧 x 水色）。
 //   3〜5 s 右の小さな枠「小問2」：おもり2個（1.0 kg）・糸 9.8 m の振り子を静止で。揺れ・周期・式は出さない。
 [K+'q0']:(p)=>{
  const th=.22*seg(p,.4,.6),o={x:330,y:100,L:290,r:22};
  let s=pend(th,{o,g:seg(p,0,.15),labs:seg(p,.12,.3),ang:seg(p,.55,.65),xarc:seg(p,.55,.65)});
  s+=givens(seg(p,.15,.3));
  const gq=seg(p,.62,.75),om={x:930,y:226,L:240,r:15};
  s+=card(760,186,430,320,'',gq,C.dim)+fade(gq,label('小問2',780,218,{size:24,color:C.ink,weight:700}));
  s+=pend(0,{o:om,g:gq,labs:1,vert:0,m:'1.0 kg',Lt:'9.8 m',two:1});
  return s;
 },
 // 小問2 の図：元の振り子と、おもり2個・糸4倍の振り子を、糸の長さ 1：4 で並べる（静止）
 [K+'q2']:(p)=>{
  let s=pend(0,{o:PS,labs:1,vert:0,g:seg(p,0,.3)});
  s+=pend(0,{o:PLg,labs:1,vert:0,m:'1.0 kg',Lt:'9.8 m',two:1,g:seg(p,.3,.6)});
  s+=fade(seg(p,.6,.8),label('もとの 振り子',PS.x,PS.y+PS.L+70,{size:24,color:C.dim,anchor:'middle',weight:700})+label('質量 2倍・糸 4倍',PLg.x+190,300,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=givens(1);
  return s;
 },
 // ================= S1 小問1：周期 =================
 [K+'setup']:(p,ctx)=>pend(swing(cueT(ctx)),{labs:1,ang:1})+givens(seg(p,.1,.25))+big(seg(p,.1,.2)),
 // 2. 求めるもの：周期 T。金の時計「？」。片側の端で映像を一時停止
 [K+'goal1']:(p,ctx)=>{
  const t=tAt(ctx,K+'setup'),ts=tStop(ctx),stop=t>=ts;
  let s=pend(swing(Math.min(t,ts)),{labs:1,ang:1})+givens(1)+big(1);
  s+=clock(820,250,{r:52,txt:'T ＝ ？',g:seg(p,.2,.35),size:30});
  s+=pauseBadge({g:stop?1:0});
  s+=goalTag(G1,{g:seg(p,.02,.12)});
  return s;
 },
 // 3. mg を糸の方向と円弧の方向に分ける。円弧の方向の成分「mg sinθ」が真下へ戻す向き
 [K+'force']:(p)=>{
  let s=pend(AMP,{labs:1,ang:1,mg:seg(p,.05,.15),split:seg(p,.2,.3),comps:seg(p,.3,.42),hiTan:seg(p,.55,.6)>.5?1:0});
  s+=card(760,110,420,90,T2(`F=-mg\\sin${TH}`,970,165,{size:40}),seg(p,.62,.72),C.hi);
  s+=fade(seg(p,.55,.65),label('真下へ 戻す 向き',970,240,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=pauseBadge()+big(1);
  s+=goalTag(G1);
  return s;
 },
 // 4. sinθ≈θ（≈ を黄で囲み「小さい角のとき」）、x＝lθ の弧、戻す力 ≈−(mg/l)x
 [K+'small']:(p)=>{
  let s=pend(AMP,{labs:1,ang:1,xarc:seg(p,.35,.45)});
  const AP=`{\\color{${C.hi}}\\boxed{\\approx}}`;
  let eq=T2(`\\sin${TH}${AP}${TH}`,915,150,{size:42})+label('小さい 角の とき',915,200,{size:24,color:C.E,anchor:'middle',weight:700});
  eq+=fade(seg(p,.35,.45),T2(`x=l\\,${TH}`,915,265,{size:40}));
  eq+=fade(seg(p,.65,.75),T2(`F\\approx-\\dfrac{mg}{l}\\,x`,915,355,{size:40}));
  s+=pane(96,320,eq,seg(p,.02,.1));
  s+=pauseBadge({x:330})+big(1,330,505);
  s+=goalTag(G1);
  return s;
 },
 // 5. m で割る（m に打ち消し線）→ a≈−(g/l)x、ばねの a＝−(k/m)x と並べて ω²＝g/l → T≈2π√(l/g)。主役は式
 [K+'omega']:(p,ctx)=>{
  const W2=sentWin(ctx);
  const cancel=seg(p,.12,.2);
  let s='';
  s+=fade(seg(p,.02,.08)*(1-cancel),T2(`m\\,a\\approx-\\dfrac{mg}{l}\\,x`,420,150,{size:40}));
  s+=fade(cancel,T2(`{\\color{#ff6b6b}\\cancel{\\color{${C.ink}}m}}\\,a\\approx-\\dfrac{{\\color{#ff6b6b}\\cancel{\\color{${C.ink}}m}}g}{l}\\,x`,420,150,{size:40})+label('両辺を m で割る',620,150,{size:22,color:C.dim}));
  s+=fade(seg(p,.22,.3),T2(`a\\approx-\\dfrac{g}{l}\\,x`,420,250,{size:44}));
  s+=fade(seg(p,.32,.4),T2(`a=-\\dfrac{k}{m}\\,x`,860,250,{size:34})+label('ばね',860,196,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.55),T2(`${W}^2=\\dfrac{g}{l}`,640,340,{size:40}));
  s+=card(390,395,500,100,T2(`${TT}\\approx 2\\pi\\sqrt{\\dfrac{l}{g}}`,640,448,{size:42}),seg(p,.7,.8),C.hi);
  s+=goalTag(G1);
  return s;
 },
 // 6. √(2.45/9.8)＝√0.25＝0.50、2π×0.50＝π≈3.14 → 時計 T≈3.1 s。小問1 の答え A
 [K+'Tnum']:(p,ctx)=>{
  let s=pend(AMP,{labs:1,ang:1});
  let eq=T2(`\\dfrac{l}{g}=\\dfrac{2.45}{9.8}=0.25`,915,145,{size:36});
  eq+=fade(seg(p,.25,.33),T2(`\\sqrt{0.25}=0.50`,915,230,{size:38}));
  eq+=fade(seg(p,.45,.53),T2(`${TT}\\approx 2\\pi\\times 0.50=\\pi\\approx 3.14\\ \\mathrm{s}`,915,310,{size:32}));
  s+=pane(96,250,eq,1);
  s+=clock(915,420,{r:36,txt:'',g:seg(p,.6,.7)})+fade(seg(p,.6,.7),label('T ≈ 3.1 s',975,430,{size:30,color:C.t,weight:700}));
  s+=goalTag(G1)+A1(ansG(p,ctx));
  return s;
 },
 // 7. 誤答 B（13 s）、C（1.6 s）
 [K+'wrongBC']:(p,ctx)=>pend(AMP,{labs:1,ang:1})+card(640,96,550,80,T2(`${TT}\\approx 2\\pi\\sqrt{\\dfrac{l}{g}}\\approx 3.1\\ \\mathrm{s}`,915,138,{size:30}),.8,C.hi)
  +wrongSeq(p,ctx,[['B','13 s','2π√(g/l)（単位 1/s）'],['C','1.6 s','2π×(l/g)（単位 s²）']],{opts:{...WR,y:200}})+goalTag(G1)+A1(1),
 // 8. 誤答 D（15 s）。単位を黄で（1/s・s²・m は、どれも s でない）
 [K+'wrongD']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.5;
  let s=pend(AMP,{labs:1,ang:1})+card(640,96,550,80,T2(`${TT}\\approx 2\\pi\\sqrt{\\dfrac{l}{g}}\\approx 3.1\\ \\mathrm{s}`,915,138,{size:30}),.8,C.hi);
  s+=wrongCard('D','15 s','2π×l（単位 m）',{...WR,y:200,g:seg(p,.03,.1)});
  s+=card(640,340,550,70,label('単位：1/s ・ s² ・ m → どれも 秒 でない',915,384,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,b,b+.06),C.hi);
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：m 2倍・l 4倍 =================
 // 9. 横に、おもり2個・糸 4倍の振り子（揺らさない）。元の振り子の横に T≈3.1 s、長い振り子に「？」
 [K+'goal2']:(p)=>pair({longG:seg(p,.1,.3),clkL:'T ≈ 3.1 s',clkR:'T ＝ ？'})+goalTag(G2,{g:seg(p,.02,.12)}),
 // 10. 質量は式に入らない：mg（2倍）と「動かしにくさ m」（2倍）が打ち消す
 [K+'mass']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.4;
  let s=pair({clkL:'T ≈ 3.1 s'});
  const bx=PLg.x,by=PLg.y+PLg.L;
  s+=card(800,100,390,90,T2(`${TT}\\approx 2\\pi\\sqrt{\\dfrac{l}{g}}`,995,146,{size:36}),seg(p,.02,.1),C.hi);
  s+=fade(seg(p,.12,.22),label('式の 中に m が ない',995,222,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=FA(bx-70,by-60,bx-70,by+20,{g:seg(p,b,b+.08),w:7,head:16})+fade(seg(p,b,b+.08),label('mg 2倍',bx-84,by-10,{size:24,color:C.F,anchor:'end',weight:700}));
  s+=fade(seg(p,b+.15,b+.23),label('動かしにくさ m 2倍',bx+40,by-60,{size:24,color:C.ink,weight:700}));
  s+=card(800,280,390,110,label('引く力 2倍 ÷ 動かしにくさ 2倍',995,325,{size:22,color:C.ink,anchor:'middle',weight:700})+label('→ 加速度は 同じ',995,368,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,b+.35,b+.43),C.hi);
  s+=goalTag(G2);
  return s;
 },
 // 11. l/g＝9.8/9.8＝1.0、√1.0＝1.0、2π≈6.28 → T≈6.3 s。小問2 の答え D
 [K+'ans2']:(p,ctx)=>{
  let s=pair({clkL:'T ≈ 3.1 s',clkR:'T ≈ 6.3 s',cR:seg(p,.7,.8)});
  let eq=T2(`\\dfrac{l}{g}=\\dfrac{9.8}{9.8}=1.0`,995,135,{size:32});
  eq+=fade(seg(p,.25,.33),T2(`\\sqrt{1.0}=1.0`,995,205,{size:32}));
  eq+=fade(seg(p,.45,.53),T2(`${TT}\\approx 2\\pi\\times 1.0\\approx 6.3\\ \\mathrm{s}`,995,265,{size:30}));
  s+=card(800,92,390,200,eq,1,C.hi);
  s+=fade(seg(p,.1,.2),label('√ の中 4倍 → T 2倍',995,330,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(ansG(p,ctx));
  return s;
 },
 // 12. 誤答 A（3.1 s）、B（8.9 s）
 [K+'wrongAB2']:(p,ctx)=>pair({clkL:'T ≈ 3.1 s',clkR:'T ≈ 6.3 s'})+wrongSeq(p,ctx,[['A','3.1 s','l が4倍なら T は2倍'],['B','8.9 s','質量を入れた（√(2×4) 倍）']],{opts:WP})+goalTag(G2)+A2(1),
 // 13. 誤答 C（13 s）
 [K+'wrongC2']:(p)=>pair({clkL:'T ≈ 3.1 s',clkR:'T ≈ 6.3 s'})+wrongCard('C','13 s','T は √l に比例（4倍ではない）',{...WP,g:seg(p,.03,.1)})+goalTag(G2)+A2(1),
 // ================= S3 小問3：使ってよい条件 =================
 // 14. 長い振り子を消し、もとの振り子だけ。求めるもの：式を使ってよい条件
 [K+'goal3']:(p)=>pend(AMP,{labs:1,ang:1})+card(640,110,550,100,T2(`${TT}\\approx 2\\pi\\sqrt{\\dfrac{l}{g}}`,915,160,{size:40}),seg(p,.2,.3),C.hi)+big(1,330,505)+goalTag(G3,{g:seg(p,.02,.12)}),
 // 15. θ と sinθ の表。60° の行を赤で
 [K+'table']:(p)=>table(p,{rows:[seg(p,.05,.15),seg(p,.3,.4),seg(p,.5,.6)],red:seg(p,.65,.75)})+goalTag(G3),
 // 16. 「小さい振れ」を黄で。小問3 の答え B
 [K+'ans3']:(p,ctx)=>table(1,{red:1,small:seg(p,.1,.25)})+goalTag(G3)+A3(ansG(p,ctx)),
 // 17. 誤答 A・D
 [K+'wrongAD3']:(p,ctx)=>table(1,{red:1,small:1,g:.5})+wrongSeq(p,ctx,[['A','おもりが軽いとき','m は式から消える'],['D','糸が短いとき','条件は角の大きさ']],{opts:{y:404}})+goalTag(G3)+A3(1),
 // 18. 誤答 C。表の 60° の行を指す
 [K+'wrongC3']:(p)=>table(1,{red:1,small:1,g:.5,point:seg(p,.4,.5)})+wrongCard('C','いつでも','等時性は小さい振れだけ',{y:404,g:seg(p,.03,.1)})+goalTag(G3)+A3(1),
 // ================= S4 まとめ =================
 [K+'sum']:(p,ctx)=>{
  const th=swing(cueT(ctx));
  let s=pend(th,{labs:1,ang:1});
  const bx=P0.x+P0.L*Math.sin(th),by=P0.y+P0.L*Math.cos(th);
  const g1=seg(p,.05,.15),g2=seg(p,.22,.32),g3=seg(p,.4,.5),g4=seg(p,.6,.7);
  s+=card(640,92,550,64,label('l/g ＝ 0.25 → T ≈ 3.1 s',915,134,{size:28,color:C.t,anchor:'middle',weight:700}),g1,C.t);
  s+=fade(g1,line(640,124,P0.x+60,P0.y+90,{color:C.t,w:2,dash:'5 5'}));
  s+=card(640,172,550,64,label('l 4倍 → T 2倍 → 6.3 s',915,214,{size:28,color:C.x,anchor:'middle',weight:700}),g2,C.x);
  s+=fade(g2,line(640,204,P0.x+20,P0.y+150,{color:C.x,w:2,dash:'5 5'}));
  s+=card(640,252,550,64,label('sinθ ≈ θ → 小さい 振れ だけ',915,294,{size:28,color:C.E,anchor:'middle',weight:700}),g3,C.E);
  s+=fade(g3,line(640,284,P0.x+40,P0.y+70,{color:C.E,w:2,dash:'5 5'}));
  s+=card(640,334,550,124,T2(`${TT}\\approx 2\\pi\\sqrt{\\dfrac{l}{g}}`,915,374,{size:34})+label('質量 m が ない',915,440,{size:26,color:C.hi,anchor:'middle',weight:700}),g4,C.hi);
  s+=fade(g4,line(640,390,bx+24,by,{color:C.hi,w:2,dash:'5 5'}));
  s+=big(1,330,505);
  return s;
 },
};
// ---- θ と sinθ の表（行15〜18）--------------------------------------------------------------------------
function table(p,{rows=[1,1,1],red=0,small=0,g=1,point=0}={}){
 const x0=200,w=800,y0=96,rh=58;
 let s=card(x0,y0,w,rh*4+20,'',1,C.dim);
 const cols=[[x0+150,'角'],[x0+400,'θ [rad]'],[x0+650,'sinθ']];
 for(const [x,t] of cols)s+=label(t,x,y0+42,{size:28,color:t==='角'?C.ink:C.E,anchor:'middle',weight:700});
 const R=[['10°','0.175','0.174'],['30°','0.524','0.500'],['60°','1.047','0.866']];
 R.forEach((r,i)=>{const y=y0+42+rh*(i+1),o=rows[i]??1;
  if(i===2&&red)s+=fade(o*red,rect(x0+20,y-38,w-40,52,{fill:C.a,fo:.14,stroke:C.a,sw:2.5,rx:10}));
  if(i===0&&small)s+=fade(o*small,rect(x0+20,y-38,w-40,52,{fill:C.hi,fo:.12,stroke:C.hi,sw:2.5,rx:10}));
  r.forEach((t,j)=>{s+=fade(o,label(t,cols[j][0],y,{size:30,color:i===2&&red?'#ff9a9a':C.ink,anchor:'middle',weight:700}));});
 });
 if(small)s+=fade(small,label('小さい 振れ',x0+w+20,y0+42+rh+8,{size:26,color:C.hi,weight:700}));
 s+=fade(seg(typeof p==='number'?p:1,.8,.95)*(rows[2]??1),label('大きい角では sinθ＜θ → 本当の 戻す 力は 近似より 弱く、周期は 長く',x0+w/2,y0+rh*4+60,{size:26,color:C.a,anchor:'middle',weight:700}));
 if(point)s+=fade(point,arrow(x0+w+110,y0+42+rh*3-8,x0+w+10,y0+42+rh*3-8,{color:C.a,w:5,head:16}));
 return fade(g,s);
}
