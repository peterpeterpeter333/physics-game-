// 問題編 解説「1500 J を受け取るエンジン」(ys-qx-hs-t-firstlaw-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/204_熱力学第一法則.md の q-hs-t-firstlaw-3（解説 20 行）。
// 色（正本の指定）：熱 Q₁・Q₂ 橙、仕事 薄い橙、U 橙（濃いめ）、圧力 P 緑、体積 V 水色、強調 黄、誤り 赤。
//   高温側 赤み・低温側 青は温度の慣習色（単元動画と同じ。量の色ではない）。
// 出題中の流れの図は、帯の太さを目盛りなしの模式にする（Q₂ の値が読み取れないように、太さの比を数値に合わせない）。
//   解説で Q₂＝900 J が出たあとは、帯の太さを 1500 : 600 : 900 の比にする。
import {C,seg,lin,fade,label,line,rect,dot,arrow,tex,clamp,mix,poly,draw} from './anim.mjs';
import {QH,WL,UO,PG,VA,OK,Qs,Ws,dUs,JJ,T2,wOut,row,markAt,ws} from './yt1-qx-hs-t-firstlaw-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-t-firstlaw-3:';
const s2=(ctx,fb=.5)=>{const W=sentWin(ctx);return W[1]?W[1][0]:fb;};
const HOTC='#ff9a7a', COLDC='#7fb6ff', BAD='#ff6b6b';
const Q1s=`{\\color{${QH}}Q_1}`, Q2s=`{\\color{${QH}}Q_2}`, es='e';
// ---- P–V グラフの1周（左）---------------------------------------------------------------------------
const CY={x:110,y:440,w:420,h:310};
const cx=u=>CY.x+CY.w*u, cy=u=>CY.y-CY.h*u;
const VL=.22,VR=.8,PH=.78,PL=.32;
const corners=[[VL,PH],[VR,PH],[VR,PL],[VL,PL]];
function cyAxes(){
 let s=arrow(CY.x-10,CY.y,CY.x+CY.w+30,CY.y,{color:C.dim,w:2.5,head:14})+arrow(CY.x,CY.y+10,CY.x,CY.y-CY.h-20,{color:C.dim,w:2.5,head:14});
 s+=label('体積 V',CY.x+CY.w+30,CY.y+40,{size:24,color:VA,anchor:'end',weight:700})+label('圧力 P',CY.x+10,CY.y-CY.h-28,{size:24,color:PG,weight:700});
 return s;
}
// u：点が進んだ割合（0〜1 で1周）。fill：囲まれた部分の塗り
function cycle(u,{fill=0,lab=0,start=0,g=1}={}){
 let s=cyAxes();
 if(fill)s+=fade(fill,rect(cx(VL),cy(PH),cx(VR)-cx(VL),cy(PL)-cy(PH),{fill:QH,fo:.35,stroke:'none',rx:0}));
 const seglen=[cx(VR)-cx(VL),cy(PL)-cy(PH),cx(VR)-cx(VL),cy(PL)-cy(PH)],tot=seglen.reduce((a,b)=>a+b,0);
 const cols=[HOTC,C.dim,COLDC,C.dim];
 // 全体の線（薄く）と、点が通った所（濃く）
 for(let i=0;i<4;i++){const [a,b]=[corners[i],corners[(i+1)%4]];s+=line(cx(a[0]),cy(a[1]),cx(b[0]),cy(b[1]),{color:cols[i],w:3,opacity:.35});}
 let d=clamp(u)*tot,px=cx(VL),py=cy(PH);
 for(let i=0;i<4&&d>0;i++){const [a,b]=[corners[i],corners[(i+1)%4]],k=Math.min(1,d/seglen[i]);
  const x1=mix(cx(a[0]),cx(b[0]),k),y1=mix(cy(a[1]),cy(b[1]),k);s+=line(cx(a[0]),cy(a[1]),x1,y1,{color:cols[i],w:5});px=x1;py=y1;d-=seglen[i];}
 const m=(cx(VL)+cx(VR))/2;
 s+=arrow(m-20,cy(PH),m+20,cy(PH),{color:HOTC,w:5,head:18,opacity:u>.15?1:.35})+arrow(m+20,cy(PL),m-20,cy(PL),{color:COLDC,w:5,head:18,opacity:u>.65?1:.35});
 s+=label('温めながら 膨張',m,cy(PH)-20,{size:24,color:HOTC,anchor:'middle',weight:700})+label('冷やしながら 圧縮',m,cy(PL)+42,{size:24,color:COLDC,anchor:'middle',weight:700});
 if(lab)s+=fade(lab,label('外への 仕事',m,(cy(PH)+cy(PL))/2-4,{size:26,color:C.ink,anchor:'middle',weight:700})+label('600 J',m,(cy(PH)+cy(PL))/2+30,{size:28,color:WL,anchor:'middle',weight:700}));
 if(start)s+=fade(start,dot(cx(VL),cy(PH),16,'none').replace('fill="none"',`fill="none" stroke="${C.hi}" stroke-width="4"`)+label('元の 状態',cx(VL)-40,cy(PH)-44,{size:24,color:C.hi,anchor:'middle',weight:700}));
 s+=dot(px,py,11,C.hi);
 return fade(g,s);
}
// ---- 流れの図 ---------------------------------------------------------------------------------------
// w：帯の太さ [入, 仕事, 捨てる]。flow：帯が伸びる割合（0〜1）。lab：数の札（null は描かない）
const WSCHEMA=[100,44,62], WTRUE=[105,42,63];
function flow({x=850,w=WSCHEMA,gIn=1,gW=1,gC=1,inLab='Q₁＝1500 J',wLab='仕事 600 J',cLab='Q₂＝？',cHi=0,cCol=QH,g=1,wHi=0,cut=1}={}){
 const top=96,eng=290,bot=440,r=56,[wi,ww,wc]=w,wc2=wc*cut;
 let s=rect(x-150,top,300,54,{fill:HOTC,fo:.22,stroke:HOTC,sw:2,rx:10})+label('高温側',x,top+37,{size:26,color:HOTC,anchor:'middle',weight:700});
 s+=rect(x-150,bot,300,54,{fill:COLDC,fo:.22,stroke:COLDC,sw:2,rx:10})+label('低温側',x,bot+37,{size:26,color:COLDC,anchor:'middle',weight:700});
 s+=fade(gIn,rect(x-wi/2,top+54,wi,eng-r-top-54+8,{fill:QH,fo:.6,stroke:'none',rx:0}));
 if(inLab)s+=fade(gIn,label(inLab,x-wi/2-14,top+120,{size:28,color:QH,anchor:'end',weight:700}));
 s+=fade(gW,poly([[x+r-6,eng-ww/2],[x+270,eng-ww/2],[x+270,eng-ww/2-14],[x+310,eng],[x+270,eng+ww/2+14],[x+270,eng+ww/2],[x+r-6,eng+ww/2]],{fill:WL,fo:.75}));
 if(wHi)s+=fade(wHi,rect(x+r-6,eng-ww/2-4,276,ww+8,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:4}));
 if(wLab)s+=fade(gW,label(wLab,x+190,eng-ww/2-16,{size:28,color:WL,anchor:'middle',weight:700}));
 if(wc2>.5)s+=fade(gC,rect(x-wc2/2,eng+r-8,wc2,bot-eng-r+8,{fill:QH,fo:.45,stroke:'none',rx:0}));
 if(cLab)s+=fade(gC,label(cLab,x+Math.max(wc2,10)/2+14,eng+r+56,{size:28,color:cHi?C.hi:cCol,weight:700}));
 s+=`<circle cx="${x}" cy="${eng}" r="${r}" fill="#26324a" stroke="${C.dim}" stroke-width="3"/>`+label('熱機関',x,eng+9,{size:26,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
const G1='Q₂',G2='e',G3='作れるか、その理由';
const A1=g=>answerTag(1,'C','900 J',{g}),A2=g=>answerTag(2,'B','0.40',{g}),A3=g=>answerTag(3,'A','',{g});
// 式の箱（右）
const box=(inner,{x=640,y=110,w=540,h=100,g=1,col=C.hi}={})=>card(x,y,w,h,inner,g,col);
const FX=320;   // 解説で流れの図を左に置くときの中心

export const qxHsTFirstlaw3Diagrams={
 // ================= 問題アニメ：出題（小問1〜3 共通）約7秒＋静止 =================
 // 0〜4 秒：点が1周、4 秒で囲まれた部分を塗って「外への仕事 600 J」。4〜7 秒：流れの図の帯が流れる。
 // Q₂ の値・効率・「第二法則」の札は描かない。帯の太さは模式（数の比に合わせない）。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=cycle(t/4,{fill:clamp((t-4)/.8),lab:clamp((t-4.3)/.8)});
  s+=flow({gIn:clamp((t-4.4)/.8),gW:clamp((t-5.2)/.8),gC:clamp((t-6)/.8)});
  s+=fade(clamp((t-6)/.8),note('（帯の 太さは 模式）',1100,480,{size:22}));
  return s;
 },
 // ================= S1 小問1：捨てる熱 =================
 [K+'goal1']:(p,ctx)=>{
  const hi=seg(p,.3,.45)*(.6+.4*Math.sin(cueT(ctx)*5)**2);
  let s=cycle(1,{fill:1,lab:1})+flow({cHi:hi>.5?1:0});
  s+=fade(seg(p,.3,.45),rect(850+31+6,290+56+20,170,50,{fill:C.hi,fo:.12,stroke:C.hi,sw:3,rx:8}));
  s+=goalTag(G1,{g:seg(p,.05,.2)});
  return s;
 },
 // 2. 点が1周して出発点に重なる。「元の状態」、ΔU＝0
 [K+'du0']:(p)=>{
  let s=cycle(seg(p,.03,.6),{fill:1,lab:1,start:seg(p,.55,.68)});
  s+=flow({g:1-seg(p,0,.12)});
  s+=card(640,140,240,80,T2(`${dUs}=0`,760,190,{size:42}),seg(p,.68,.8),UO);
  s+=fade(seg(p,.7,.8),label('温度も 戻る',760,256,{size:26,color:'#b8f06a',anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 3. Q₁ から Q₂ を引くと、右へ出る帯が残る。W外へ＝Q₁−Q₂
 [K+'sub']:(p,ctx)=>{
  const W=s2(ctx);
  let s=flow({x:FX,wLab:'',inLab:'Q₁',cLab:'Q₂',gW:seg(p,.3,.5),cHi:0});
  s+=fade(seg(p,.05,.15),label('入る 熱',FX-150,250,{size:24,color:QH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.25),arrow(FX+110,360,FX+110,420,{color:C.hi,w:4,head:14})+label('引く',FX+150,400,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.35,.5),label('残り',FX+190,250,{size:26,color:WL,anchor:'middle',weight:700}));
  s+=box(row(['@',`=${Q1s}-${Q2s}`],910,170,{size:50}),{g:seg(p,W,ws(ctx,.12))});
  s+=goalTag(G1);
  return s;
 },
 // 4. 式変形を一操作ずつ：Q₂ を左辺へ、W外へ を右辺へ
 [K+'rearr']:(p,ctx)=>{
  const a=markAt(ctx,'ダブリュー そとえを',.35),b=markAt(ctx,'キュー ツー イコール',.6);
  let s=flow({x:FX,wLab:'',inLab:'Q₁',cLab:'Q₂'});
  s+=box(row(['@',`=${Q1s}-${Q2s}`],910,160,{size:46}),{y:96,h:90,g:1});
  s+=fade(seg(p,.05,.12),label('両辺に Q₂ を 足す',910,240,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.12,.2),row(['@',`+${Q2s}=${Q1s}`],910,300,{size:46}));
  s+=fade(seg(p,a,a+.06),label('両辺から W外へ を 引く',910,370,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(640,395,540,90,row([`${Q2s}=${Q1s}-`,'@'],910,448,{size:46}),seg(p,b-.04,b+.04),C.hi);
  s+=goalTag(G1);
  return s;
 },
 // 5. 1500−600＝900 J。「Q₂＝？」が「900 J」に。答え C（2文目）
 [K+'calc']:(p,ctx)=>{
  const W=s2(ctx),r=seg(p,W*.6,W*.8);
  let s=flow({x:FX,wLab:'仕事 600 J',inLab:'1500 J',cLab:r>.5?'Q₂＝900 J':'Q₂＝？',cHi:r>.5?1:0});
  s+=box(row([`${Q2s}=1500-600=900${JJ}`],910,170,{size:44}),{g:seg(p,.05,.15)});
  s+=goalTag(G1)+A1(seg(p,W,ws(ctx,.1)));
  return s;
 },
 // 6. 第一法則で確かめ：ΔU＝(1500−900)＋(−600)＝0
 [K+'check']:(p,ctx)=>{
  const q=seg(p,.3,.4),w=seg(p,.5,.6);
  let s=flow({x:FX,w:WTRUE,wLab:'仕事 600 J',inLab:'1500 J',cLab:'Q₂＝900 J'});
  s+=box(T2(`${dUs}=${Qs}+${Ws}`,910,160,{size:46}),{y:96,h:90,col:UO});
  s+=fade(seg(p,.1,.2),T2(`=({\\color{${q>.5&&w<.5?C.hi:C.ink}}1500-900})+({\\color{${w>.5?C.hi:C.ink}}-600})`,910,270,{size:42}));
  s+=fade(q*(1-w),label('入った 熱 Q',800,330,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(w,label('された 仕事 W',1040,330,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.85),T2('=0',910,400,{size:46}));
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7. 誤答 A、B（1枚ずつ）
 [K+'wrongAB']:(p,ctx)=>{
  const a=markAt(ctx,'ビーは');
  let s=fade(.45,flow({x:600,w:WTRUE,wLab:'仕事 600 J',inLab:'1500 J',cLab:'Q₂＝900 J'}));
  s+=goalTag(G1)+A1(1);
  s+=wrongSeq(p,ctx,[['A','2100 J','熱と 仕事を 足した',{mid:'1500+600=2100'}],['B','600 J','捨てる 熱 ＝ 仕事 と した']],{win:[[0,a],[a,1]]});
  return s;
 },
 // 8. 誤答 D（0 なのは ΔU）
 [K+'wrongD']:(p)=>{
  let s=fade(.45,flow({x:600,w:WTRUE,wLab:'仕事 600 J',inLab:'1500 J',cLab:'Q₂＝900 J'}));
  s+=goalTag(G1)+A1(1);
  s+=wrongCard('D','0 J','0 なのは ΔU（内部エネルギーの 変化）',{g:seg(p,.03,.1)});
  return s;
 },
 // ================= S2 小問2：熱効率 =================
 [K+'goal2']:(p)=>{
  let s=flow({x:FX,w:WTRUE,wLab:'仕事 600 J',inLab:'1500 J',cLab:'Q₂＝900 J'});
  s+=goalTag(G2,{g:seg(p,.05,.2)});
  return s;
 },
 // 10. e＝W外へ÷Q₁（定義）。Q₁ のうち仕事の割合を黄で。600÷1500＝0.40
 [K+'eff']:(p,ctx)=>{
  const W=s2(ctx);
  let s=flow({x:FX,w:WTRUE,wLab:'仕事 600 J',inLab:'1500 J',cLab:'Q₂＝900 J',wHi:seg(p,.3,.45)});
  s+=fade(seg(p,.3,.45),rect(FX-52.5,150,42,92,{fill:C.hi,fo:.35,stroke:C.hi,sw:2,rx:0}));
  s+=box(row([`${es}=`,'@',`\\div ${Q1s}`],910,165,{size:48}),{g:seg(p,.05,.15)});
  s+=kindTag('定義',910,250,{g:seg(p,.12,.22)});
  s+=fade(seg(p,W,ws(ctx,.12)),T2('e=600\\div1500=0.40',910,350,{size:46}));
  s+=goalTag(G2);
  return s;
 },
 // 11. 答え B。2つの式を並べる
 [K+'ans2']:(p,ctx)=>{
  const W=s2(ctx);
  let s=card(100,110,1000,100,T2('e=600\\div1500=0.40',600,165,{size:46}),1,C.hi);
  s+=card(100,240,1000,120,T2(`e=1-\\dfrac{${Q2s}}{${Q1s}}=1-\\dfrac{900}{1500}=1-0.60=0.40`,600,305,{size:44}),seg(p,W,ws(ctx,.12)),C.hi);
  s+=fade(seg(p,ws(ctx,.4),ws(ctx,.5)),label('○ 同じ 0.40',600,430,{size:30,color:OK,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(seg(p,.04,.14));
  return s;
 },
 // 12. 誤答 A（捨てた熱の割合）
 [K+'wrongA']:(p)=>{
  let s=card(250,110,700,100,T2('e=600\\div1500=0.40',600,165,{size:44}),1,C.hi);
  s+=goalTag(G2)+A2(1);
  s+=wrongCard('A','0.60','捨てた 熱の 割合 Q₂/Q₁',{g:seg(p,.03,.1),mid:'900\\div1500=0.60'});
  return s;
 },
 // 13. 誤答 C、D（1枚ずつ）
 [K+'wrongCD']:(p,ctx)=>{
  const a=markAt(ctx,'ディーは');
  let s=card(250,110,700,100,T2('e=600\\div1500=0.40',600,165,{size:44}),1,C.hi);
  s+=goalTag(G2)+A2(1);
  s+=wrongSeq(p,ctx,[['C','0.67','Q₂ で 割った',{mid:'600\\div900\\approx0.67'}],['D','2.5','割る 向きが 逆（1 を 超える）',{mid:'1500\\div600=2.5'}]],{win:[[0,a],[a,1]]});
  return s;
 },
 // ================= S3 小問3：e＝1 は作れるか =================
 [K+'goal3']:(p)=>{
  let s=flow({x:FX,w:WTRUE,wLab:'仕事',inLab:'Q₁',cLab:'Q₂'});
  s+=box(row([`${Q2s}=0,\\ e=1\\ ?`],910,170,{size:46}),{g:seg(p,.2,.35)});
  s+=goalTag(G3,{g:seg(p,.05,.2)});
  return s;
 },
 // 15. Q₂ の帯を細くしていく。第一法則：勘定は合う ○
 [K+'first']:(p,ctx)=>{
  const W=s2(ctx),k=1-.9*seg(p,.05,.5);
  let s=flow({x:FX,w:[105,105-63*k,63],cut:k,wLab:'仕事',inLab:'Q₁',cLab:'Q₂'});
  s+=box(row(['@',`=${Q1s}`],910,170,{size:46}),{g:seg(p,.3,.42)});
  s+=card(640,250,540,80,label('○ 第一法則：勘定は 合う',910,302,{size:30,color:OK,anchor:'middle',weight:700}),seg(p,W,ws(ctx,.1)),OK);
  s+=goalTag(G3);
  return s;
 },
 // 16. 帯が 0 の手前で止まる。第二法則（法則）
 [K+'second']:(p,ctx)=>{
  const W=s2(ctx),k=.1;
  let s=flow({x:FX,w:[105,105-63*k,63],cut:k,wLab:'仕事',inLab:'Q₁',cLab:'Q₂'});
  s+=fade(seg(p,.1,.25),label('0 には できない',FX+120,410,{size:26,color:BAD,weight:700}));
  s+=card(640,110,540,140,label('熱を 全部 仕事に して',910,165,{size:28,color:C.ink,anchor:'middle',weight:700})+label('元に 戻る 機関は 作れない',910,215,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.22),C.dim);
  s+=card(700,290,420,80,label('熱力学 第二法則',910,342,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,W,ws(ctx,.1)),C.F);
  s+=kindTag('法則',910,420,{g:seg(p,ws(ctx,.1),ws(ctx,.2))});
  s+=goalTag(G3);
  return s;
 },
 // 17. 答え A。誤答 B（2文目）
 [K+'ans3']:(p,ctx)=>{
  const W=s2(ctx);
  let s=card(250,100,700,80,label('第一法則 ○ ／ 第二法則 × → 作れない',600,152,{size:30,color:C.ink,anchor:'middle',weight:700}),1,C.dim);
  s+=goalTag(G3)+A3(seg(p,.04,.14));
  s+=wrongCard('B','第一法則に 反する','W外へ ＝ Q₁ で 勘定は 合う',{g:seg(p,W,W+.05)});
  return s;
 },
 // 18. 誤答 C、D（1枚ずつ）
 [K+'wrongCD3']:(p,ctx)=>{
  const a=markAt(ctx,'ディーは');
  let s=card(250,100,700,80,label('第一法則 ○ ／ 第二法則 × → 作れない',600,152,{size:30,color:C.ink,anchor:'middle',weight:700}),1,C.dim);
  s+=goalTag(G3)+A3(1);
  s+=wrongSeq(p,ctx,[['C','作れる（勘定が 合う）','第二法則で 作れない'],['D','技術で 減らせる','技術 では なく 法則の 問題']],{win:[[0,a],[a,1]]});
  return s;
 },
 // 19. 低温側に 900 J の帯がたまっていく
 [K+'dump']:(p)=>{
  const f=seg(p,.05,.7);
  let s=flow({x:600,w:WTRUE,wLab:'仕事 600 J',inLab:'1500 J',cLab:'捨てた 900 J',cCol:COLDC});
  s+=rect(600-150,494-60*f,300,60*f,{fill:QH,fo:.5,stroke:'none',rx:4});
  s+=fade(seg(p,.6,.75),label('無くならず、低温側へ',920,470,{size:26,color:COLDC,weight:700}));
  return s;
 },
 // ================= S4 まとめ：流れの図 =================
 [K+'sum']:(p)=>{
  let s=flow({x:520,w:WTRUE,wLab:'仕事 W外へ',inLab:'受け取った 熱 Q₁',cLab:'捨てる 熱 Q₂（必ず ある）',g:seg(p,.03,.15)});
  s+=answerRow([[1,'C','900 J'],[2,'B','0.40'],[3,'A','']],{g:seg(p,.02,.12)});
  return s;
 },
};
