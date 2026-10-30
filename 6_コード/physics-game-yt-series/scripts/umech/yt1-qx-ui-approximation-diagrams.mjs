// 問題編 解説「ブランコの小さな揺れ」（q-ui-approximation、大学編 04 近似・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/04_近似.md の q-ui-approximation（解説 17 行）。
// 画面：左に図（ブランコ・半径1の円・相対誤差のグラフ）、右に説明の枠。誤答カードは右の枠の下。札の帯（y＜78）には図を描かない。
// 色（正本）：弧（角度 θ）青、高さ sinθ 赤（凡例「青＝弧 θ、赤＝高さ sinθ」）、つな・半径 水色、近似の曲線 黄、差 赤の薄い塗り。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,sentWin} from './yt1-qx-common.mjs';

const K='qx-ui-approximation:';
const BL='#5b8def',RD=C.a,CY=C.x,YL=C.hi,GR=C.F,DIFF='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const TH=`{\\color{${BL}}\\theta}`,SIN=`{\\color{${RD}}\\sin\\theta}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='弧の長さ s',G2='θ＝0.12 の相対誤差',G3='相対誤差 0.1％ 以内の θ';
const ANS1=g=>answerTag(1,'B','0.3 m',{g}),ANS2=g=>answerTag(2,'C','約 0.24％',{g}),ANS3=g=>answerTag(3,'D','約 0.077 rad',{g});
const LEG=(x=20,y=498,g=1)=>legend([['青＝弧 θ',BL],['赤＝高さ sinθ',RD]],x,y,{g,dir:'row'});
const TH0=.12;
// 文の区切り（2文目の始まり）
const b2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};

// ---- ブランコ（支点・つな・座板・円の一部・弧）----
function swing(th,{cx=300,py=100,Lp=340,g=1,arc=1,lenLab=0,angLab=0,sLab=0,circ=1,vert=1}={}){
 const P=a=>[cx+Lp*Math.sin(a),py+Lp*Math.cos(a)];
 let s='';
 s+=line(cx-70,py,cx+70,py,{color:C.dim,w:4});for(let q=cx-66;q<cx+70;q+=18)s+=line(q,py,q+11,py-12,{color:C.faint,w:2});
 if(circ)s+=fade(circ,draw(Array.from({length:41},(_,i)=>P(-.5+i/40)),1,{color:C.faint,w:2,dash:'5 8'}));
 if(vert)s+=line(cx,py,cx,py+Lp+30,{color:C.faint,w:2,dash:'7 7'});
 const [bx,by]=P(th);
 s+=line(cx,py,bx,by,{color:CY,w:4})+dot(cx,py,7,C.dim);
 s+=rect(bx-26,by-2,52,12,{fill:'#8a6a4a',fo:.9,stroke:'#c9a77f',sw:2,rx:4});
 if(arc&&th>.005){const Q=a=>[cx+(Lp+22)*Math.sin(a),py+(Lp+22)*Math.cos(a)];s+=fade(arc,draw(Array.from({length:21},(_,i)=>Q(th*i/20)),1,{color:BL,w:7}));}
 if(lenLab)s+=fade(lenLab,label('2.5 m',cx-18,py+Lp*.55,{size:28,color:CY,anchor:'end',weight:700}));
 if(angLab&&th>.01){const r=200;s+=fade(angLab,draw(Array.from({length:11},(_,i)=>[cx+r*Math.sin(th*i/10),py+r*Math.cos(th*i/10)]),1,{color:BL,w:4})
  +line(cx+r*Math.sin(th/2)+4,py+r*Math.cos(th/2),cx+68,py+r-22,{color:C.dim,w:1.5})+label('0.12 rad',cx+72,py+r-14,{size:28,color:BL,weight:700}));}
 if(sLab&&th>.01)s+=fade(sLab,label('弧 s',bx+34,by+44,{size:28,color:BL,weight:700}));
 return fade(g,s);
}
// ---- 半径1の円（角度は誇張）と、のばした弧・高さの棒、拡大鏡 ----
const THX=.5; // 図の角度（誇張）
function unitCircle({ox=120,oy=420,R=290,g=1,bars=1,lens=1,lensNum=0,lensG=1,labels=1,ex=1}={}){
 const P=a=>[ox+R*Math.cos(a),oy-R*Math.sin(a)];
 let s=draw(Array.from({length:41},(_,i)=>P(-.03+(Math.PI/2+.03)*i/40)),1,{color:C.faint,w:2,dash:'5 8'});
 s+=line(ox-10,oy,ox+R+40,oy,{color:C.dim,w:2})+line(ox,oy+10,ox,oy-R-30,{color:C.dim,w:2});
 const [px,py]=P(THX);
 s+=line(ox,oy,px,py,{color:CY,w:4})+dot(ox,oy,6,C.dim);
 if(labels)s+=label('1',(ox+px)/2-6,(oy+py)/2-12,{size:26,color:CY,weight:700,anchor:'end'});
 s+=draw(Array.from({length:31},(_,i)=>P(THX*i/30)),1,{color:BL,w:7});
 s+=line(px,py,px,oy,{color:RD,w:7})+dot(px,py,8,C.ink);
 if(labels){const [lx,ly]=P(THX*.55);s+=label('θ',lx+14,ly+4,{size:30,color:BL,weight:700})+label('sinθ',px-12,oy-30,{size:26,color:RD,weight:700,anchor:'end'});}
 if(ex)s+=note('角度は 大きく 誇張',ox,oy+38,{anchor:'start'});
 // のばした弧（青）と高さ（赤）を並べる
 const bx=ox+R+50,hb=R*THX,hr=R*Math.sin(THX),gc=[bx+22,oy-(hb+hr)/2];
 if(bars){
  s+=fade(bars,rect(bx,oy-hb,18,hb,{fill:BL,fo:.85,stroke:BL,rx:2})+rect(bx+26,oy-hr,18,hr,{fill:RD,fo:.85,stroke:RD,rx:2})
   +label('θ',bx+9,oy+34,{size:28,color:BL,weight:700,anchor:'middle'})+label('sinθ',bx+52,oy-hr/2+40,{size:24,color:RD,weight:700})
   +label('のばした 弧',bx+9,oy+64,{size:22,color:BL,anchor:'middle'}));
 }
 if(lens&&bars){
  const k=6,LX=bx+100,LY=oy-hb-80,LR=62,Z=(x,y)=>[LX+(x-gc[0])*k,LY+(y-gc[1])*k];
  let z=rect(...Z(bx,oy-hb),18*k,hb*k,{fill:BL,fo:.85,stroke:BL,rx:2})+rect(...Z(bx+26,oy-hr),18*k,hr*k,{fill:RD,fo:.85,stroke:RD,rx:2});
  const [, yb]=Z(0,oy-hb),[, yr]=Z(0,oy-hr);
  z+=line(LX-LR,yb,LX+LR,yb,{color:YL,w:2,dash:'5 5'})+rect(Z(bx+26,0)[0],yb,18*k,yr-yb,{fill:DIFF,fo:.35,stroke:'none',rx:0});
  let L=ring(gc[0],gc[1],14,{color:YL,w:2.5})+line(gc[0]+10,gc[1]-10,LX-LR*.7,LY+LR*.7,{color:YL,w:2});
  L+=`<clipPath id="qxuiaLens"><circle cx="${LX}" cy="${LY}" r="${LR}"/></clipPath><circle cx="${LX}" cy="${LY}" r="${LR}" fill="#0e1830"/><g clip-path="url(#qxuiaLens)">${z}</g>`+ring(LX,LY,LR,{color:YL,w:3.5});
  L+=label('差',LX+LR+10,LY+8,{size:26,color:DIFF,weight:700});
  if(lensNum)L+=fade(lensNum,label('0.000288',LX,LY-LR-12,{size:26,color:DIFF,anchor:'middle',weight:700}));
  s+=fade(lensG,L);
 }
 return fade(g,s);
}
// ---- 相対誤差のグラフ（θ²/6 を％で）----
function relGraph({x=90,y=450,w=480,h=300,g=1,curve=1,lineG=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:.16,ymin:0,ymax:.45,xticks:[.05,.1,.15],yticks:[.1,.2,.3,.4],grid:true,g,xlabel:'θ［rad］',ylabel:'相対誤差［％］',xcolor:BL,ycolor:C.ink});
 let s=A.svg;
 s+=fade(lineG*g,line(A.X(0),A.Y(.1),A.X(.16),A.Y(.1),{color:C.dim,w:3,dash:'10 7'})+label('0.1％',A.X(.16)+8,A.Y(.1)-10,{size:24,color:C.dim,weight:700}));
 if(curve)s+=A.plot(u=>100*u*u/6,{from:0,to:.16,p:curve,color:YL,w:4.5});
 return {A,svg:s};
}

export const ytQxUiApproximationDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約4秒）：座板が真下から 0.12 rad 振れて止まる。弧（青）、つなの長さ「2.5 m」、角「0.12 rad」。弧の長さの数値は出さない。
 [K+'q1']:(p)=>swing(TH0*seg(p,.08,.55),{cx:600,lenLab:seg(p,.55,.75),angLab:seg(p,.7,.9)}),
 // 小問2（約4秒）：半径1の円、弧 θ（青）と高さ sinθ（赤）、差の部分を拡大鏡で（数値なし）
 [K+'q2']:(p)=>unitCircle({ox:330,g:seg(p,0,.3),bars:seg(p,.3,.55),lensG:seg(p,.6,.85)})+LEG(40,498,seg(p,.2,.4)),
 // 小問3（約3.5秒）：横軸 θ［rad］、縦軸「相対誤差」の空の座標と 0.1％ の横線だけ
 [K+'q3']:(p)=>relGraph({x:320,w:560,g:seg(p,0,.4),curve:0,lineG:seg(p,.5,.8)}).svg,

 // ===================== 問題の設定 =====================
 [K+'setup']:(p,ctx)=>{
  const b=b2(ctx);
  let s=swing(TH0*seg(p,.08,.4),{lenLab:seg(p,.05,.2),angLab:seg(p,.4,.5),circ:.4+.6*seg(p,b,b+.1)});
  s+=panel(90,320,label('つなの 長さ',PC,145,{size:26,color:C.dim,anchor:'middle'})+label('2.5 m',PC,200,{size:40,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.35,.45),label('鉛直から 0.12 rad',PC,265,{size:32,color:BL,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.1),line(PX+40,300,PX+PW-40,300,{color:C.faint,w:2})+label('座板は 支点を 中心と する',PC,345,{size:26,color:C.ink,anchor:'middle'})+label('円の 上を 動く',PC,385,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 // ===================== 小問1 =====================
 [K+'goal1']:(p,ctx)=>{
  const b=b2(ctx);
  let s=swing(TH0,{lenLab:1,angLab:1,sLab:seg(p,.1,.2)});
  s+=panel(90,330,label('ラジアン',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,b,b+.08),T(`${TH}=\\dfrac{{\\color{${BL}}s}}{{\\color{${CY}}r}}`,PC,215,44)+label('弧の 長さ ÷ 半径',PC+150,222,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,b+.25,b+.33),label('両辺に r を 掛ける',PC,300,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,b+.4,b+.5),T(`{\\color{${BL}}s}={\\color{${CY}}r}\\,${TH}`,PC,375,50)+highlight(PC-90,335,180,72,1)),seg(p,.03,.12),C.hi);
  s+=goalTag(G1,{g:seg(p,.02,.12)});
  return s;
 },
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,u=seg(p,b,b+.25);
  let s=swing(TH0,{lenLab:1,angLab:1,sLab:1});
  // 半径の棒（水色）を 0.12 倍に縮めて、弧の下へ重ねる
  if(u>0){const len=mix(340,340*TH0,u),ang=mix(Math.PI/2,0,u),x0=300+mix(-24,0,u),y0=mix(100,456,u);
   s+=line(x0,y0,x0+len*Math.cos(ang),y0+len*Math.sin(ang),{color:CY,w:7});}
  s+=fade(seg(p,b+.25,b+.35),label('弧 ＝ 半径の 0.12 倍',270,480,{size:26,color:YL,anchor:'end',weight:700}));
  s+=panel(90,250,T(`{\\color{${BL}}s}={\\color{${CY}}r}\\,${TH}`,PC,150,40)
   +fade(seg(p,.05,.2),T(`=2.5\\times0.12`,PC,220,40))
   +fade(seg(p,.25,.4),T(`=0.3\\ \\mathrm{m}`,PC,290,44,{color:YL})),seg(p,0,.05),C.hi);
  const ga=W[1]?W[1][0]+(W[1][1]-W[1][0])*.6:.8;
  s+=goalTag(G1)+ANS1(seg(p,ga,ga+.06));
  return s;
 },
 [K+'wrongA']:(p,ctx)=>{
  const b=b2(ctx),cx=300,cy=290,R=150,tot=6.875;
  let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'5 8'})+dot(cx,cy,6,C.dim)+line(cx,cy,cx,cy+R,{color:CY,w:3});
  s+=label('2.5 m',cx-10,cy+R*.6,{size:24,color:CY,anchor:'end',weight:700});
  // 17.2 m の弧：真下から反時計回りに 6.875 rad（少しずつ外へずらして、重なりを見せる）
  const u=seg(p,b,b+.35),pts=Array.from({length:161},(_,i)=>{const a=tot*i/160,r=R+3.2*a;return [cx+r*Math.sin(a),cy+r*Math.cos(a)];});
  s+=draw(pts,u,{color:DIFF,w:5});
  s+=fade(seg(p,b,b+.08),label('円周 2π × 2.5 ≈ 15.7 m',cx,112,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.3,b+.4),label('17.2 m は 1周 より 長い',cx,505,{size:26,color:DIFF,anchor:'middle',weight:700}));
  s+=panel(90,120,label('0.12 rad を 度に 直すと',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(`0.12\\ \\mathrm{rad}\\approx6.9^\\circ`,PC,185,34),1);
  s+=wrongCard('A','17.2 m',['度の 数字 6.9 を s ＝ rθ に 入れた','入れて よいのは ラジアン だけ'],{...WOPT,y:235,mid:`2.5\\times6.9\\approx17.2`,g:seg(p,.02,.08)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.45,b=W[1]?W[1][0]:.7,hl=seg(p,b,b+.08);
  let s=swing(TH0,{lenLab:1,angLab:1,sLab:1});
  s+=panel(90,140,T(`{\\color{${BL}}s}={\\color{${CY}}r}\\,{\\color{${YL}}\\times}\\,${TH}`,PC,160,46)+fade(hl,label('掛け算',PC+150,170,{size:28,color:YL,weight:700}))+highlight(PC-110,118,220,80,hl),1,hl>.5?YL:C.faint);
  s+=wrongSeq(p,ctx,[['C','20.8 m','半径を 角度で 割った',{mid:`2.5\\div0.12\\approx20.8`}],['D','2.62 m','半径と 角度を 足した',{mid:`2.5+0.12=2.62`}]],{win:[[0,m],[m,1]],opts:{...WOPT,y:250}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // ===================== 小問2 =====================
 [K+'goal2']:(p,ctx)=>{
  const b=b2(ctx);
  let s=unitCircle({bars:0,lens:0,g:seg(p,0,.12)})+LEG(20,498,seg(p,.05,.15));
  s+=panel(90,280,label('sinθ を θ に 置き換える',PC,145,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),line(PX+40,185,PX+PW-40,185,{color:C.faint,w:2})+label('相対誤差',PC,235,{size:28,color:C.dim,anchor:'middle'})
    +T(`=\\dfrac{\\text{差}}{${TH}}`.replace('\\text{差}','{\\color{'+DIFF+'}\\theta-\\sin\\theta}'),PC,315,40)),seg(p,.03,.12),C.hi);
  s+=goalTag(G2,{g:seg(p,.02,.12)});
  return s;
 },
 [K+'circle']:(p,ctx)=>{
  const b=b2(ctx);
  let s=unitCircle({bars:seg(p,.15,.35),lensG:seg(p,.4,.55)})+LEG();
  s+=panel(90,200,label('差の 目安',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,b,b+.1),T(`${TH}-${SIN}\\approx\\dfrac{${TH}^3}{6}`,PC,215,40)+kindTag('目安',PC,272,{color:C.E})),1);
  s+=goalTag(G2);
  return s;
 },
 [K+'abs']:(p,ctx)=>{
  const b=b2(ctx);
  let s=unitCircle({lensNum:seg(p,.35,.45)})+LEG();
  s+=panel(90,330,T(`0.12^3=0.001728`,PC,150,34)
   +fade(seg(p,.15,.25),label('÷ 6',PC,205,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.25,.35),T(`\\dfrac{0.001728}{6}\\approx{\\color{${DIFF}}0.000288}`,PC,270,34))
   +fade(seg(p,b,b+.1),kindTag('絶対誤差',PC,370,{color:DIFF})+label('（差 そのもの）',PC,410,{size:22,color:C.dim,anchor:'middle'})),1);
  s+=goalTag(G2);
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=unitCircle({lensNum:1})+LEG();
  s+=panel(90,330,label('相対誤差 ＝ 差 ÷ θ',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{0.000288}{0.12}=0.0024`,PC,205,34)
   +fade(seg(p,.25,.35),T(`={\\color{${YL}}0.24\\,\\%}`,PC,275,40))
   +fade(seg(p,.4,.5),line(PX+40,315,PX+PW-40,315,{color:C.faint,w:2})+label('同じ 値：',PX+40,365,{size:22,color:C.dim})+T(`\\dfrac{${TH}^2}{6}=\\dfrac{0.0144}{6}=0.0024`,PC+50,365,28)),1,C.hi);
  s+=goalTag(G2)+ANS2(seg(p,b+.05,b+.12));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=card(60,100,1080,250,'',1);
  const cols=[200,450,720,980],heads=[['θ［rad］',BL],['sinθ',RD],['差 θ − sinθ',DIFF],['相対誤差',C.ink]],vals=['0.12','0.119712','0.000288','0.00240'];
  heads.forEach(([t,c],i)=>{s+=label(t,cols[i],155,{size:28,color:c,anchor:'middle',weight:700});});
  s+=line(90,180,1110,180,{color:C.faint,w:2});
  vals.forEach((v,i)=>{s+=fade(seg(p,.05+.08*i,.12+.08*i),label(v,cols[i],245,{size:34,color:C.ink,anchor:'middle',weight:i>=2?700:400}));});
  s+=fade(seg(p,.5,.6),label('電卓の 値',600,315,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.72),rect(250,380,700,80,{fill:'#132a22',fo:.95,stroke:GR,sw:2.5,rx:12})+label('✓',300,433,{size:40,color:GR,weight:700,anchor:'middle'})
   +label('目安 θ³/6 ≈ 0.000288 と 合う',620,432,{size:30,color:GR,anchor:'middle',weight:700}));
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,m=b+(1-b)*.55;
  let s=card(100,95,1000,140,label('相対誤差 ＝ 差 ÷ θ',300,170,{size:28,color:C.dim,anchor:'middle'})+T(`\\dfrac{0.000288}{0.12}=0.0024=0.24\\,\\%`,760,165,38),1);
  s+=wrongSeq(p,ctx,[['A','約 0.029％',['0.000288 を そのまま ％ に した','（θ で 割って いない）']],['B','約 2.4％','0.0024 を 2.4％ と した（10倍 ずれ）'],['D','0％','≈ を ＝ と 読んだ（差は 0 で ない）']],{win:[[0,W[0][1]],[b,m],[m,1]],opts:{y:265}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // ===================== 小問3 =====================
 [K+'goal3']:(p,ctx)=>{
  const b=b2(ctx);
  const {svg}=relGraph({g:seg(p,0,.12),curve:seg(p,b+.1,b+.4),lineG:seg(p,.1,.2)});
  let s=svg;
  s+=panel(90,330,label('相対誤差の 目安',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,b,b+.1),T(`\\dfrac{${TH}^3}{6}\\div${TH}`,PC,215,38))
   +fade(seg(p,b+.15,b+.25),T(`={\\color{${YL}}\\dfrac{${TH}^2}{6}}`,PC,305,44)),seg(p,.03,.12));
  s+=goalTag(G3,{g:seg(p,.02,.12)});
  return s;
 },
 [K+'ineq']:(p,ctx)=>{
  const b=b2(ctx);
  let s=relGraph().svg;
  s+=panel(90,330,kindTag('0.1％ ＝ 0.001',PC,140,{color:C.dim,g:seg(p,.03,.12)})
   +fade(seg(p,.05,.15),T(`\\dfrac{${TH}^2}{6}\\le0.001`,PC,220,40))
   +fade(seg(p,b,b+.1),label('両辺に 6 を 掛ける',PC,300,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,b+.15,b+.25),T(`${TH}^2\\le0.006`,PC,370,44)),1);
  s+=goalTag(G3);
  return s;
 },
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,xs=Math.sqrt(.006);
  const {A,svg}=relGraph();
  let s=svg;
  const gi=seg(p,.25,.35);
  s+=fade(gi,line(A.X(xs),A.Y(.1),A.X(xs),A.Y(0),{color:YL,w:2.5,dash:'6 5'})+dot(A.X(xs),A.Y(.1),11,YL)+ring(A.X(xs),A.Y(.1),20,{color:YL,w:3})
   +label('0.077 rad ≈ 4.4°',A.X(xs)-14,A.Y(.1)-34,{size:26,color:YL,anchor:'end',weight:700}));
  s+=panel(90,250,T(`${TH}^2\\le0.006`,PC,145,34)
   +fade(seg(p,.05,.15),label('平方根を とる',PC,195,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.12,.24),T(`${TH}\\le\\sqrt{0.006}\\approx{\\color{${YL}}0.077\\ \\mathrm{rad}}`,PC,265,34))
   +fade(seg(p,.3,.4),label('約 4.4°',PC,320,{size:28,color:C.ink,anchor:'middle',weight:700})),1,C.hi);
  s+=goalTag(G3)+ANS3(seg(p,b+.05,b+.12));
  return s;
 },
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,m=b+(1-b)*.45,xs=Math.sqrt(.006);
  const {A,svg}=relGraph();
  let s=svg+line(A.X(xs),A.Y(.1),A.X(xs),A.Y(0),{color:YL,w:2.5,dash:'6 5'})+dot(A.X(xs),A.Y(.1),11,YL)+label('0.077',A.X(xs),A.Y(0)+62,{size:24,color:YL,anchor:'middle',weight:700});
  s+=panel(90,110,T(`${TH}\\le\\sqrt{0.006}\\approx0.077\\ \\mathrm{rad}`,PC,150,32),1);
  s+=wrongSeq(p,ctx,[['A','約 0.18 rad',['絶対誤差で 決めた（θ³/6 ≦ 0.001）','％ で 決めるのは 相対誤差 θ²/6'],{mid:''}],['B','約 4.4 rad',['度の 数字 4.4 を','ラジアンの 数字と 取り違えた']],['C','約 0.006 rad',['θ² の 値を θ と 取り違えた','（平方根を とって いない）']]],{win:[[0,W[0][1]],[b,m],[m,1]],opts:{...WOPT,y:220}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 [K+'swing012']:(p)=>{
  const xs=Math.sqrt(.006);
  const {A,svg}=relGraph();
  let s=svg+line(A.X(xs),A.Y(.1),A.X(xs),A.Y(0),{color:YL,w:2,dash:'6 5'})+dot(A.X(xs),A.Y(.1),9,YL);
  const y12=100*TH0*TH0/6;
  s+=fade(seg(p,.05,.18),line(A.X(TH0),A.Y(y12),A.X(TH0),A.Y(0),{color:BL,w:2.5,dash:'6 5'})+dot(A.X(TH0),A.Y(y12),12,BL)
   +label('0.12 rad：0.24％',A.X(TH0)-16,A.Y(y12)-18,{size:26,color:BL,anchor:'end',weight:700}));
  s+=fade(seg(p,.25,.38),arrow(A.X(TH0)+26,A.Y(.1),A.X(TH0)+26,A.Y(y12)+10,{color:DIFF,w:4,head:14})+label('線より 上',A.X(TH0)+38,A.Y(.17),{size:24,color:DIFF,weight:700}));
  s+=panel(90,280,label('θ ＝ 0.12 rad では',PC,145,{size:28,color:BL,anchor:'middle',weight:700})
   +T(`0.24\\,\\%>0.1\\,\\%`,PC,215,42)
   +fade(seg(p,.45,.6),line(PX+40,260,PX+PW-40,260,{color:C.faint,w:2})+label('0.1％ の 正確さには',PC,310,{size:26,color:C.ink,anchor:'middle'})+label('この 揺れは 少し 大きすぎる',PC,350,{size:28,color:DIFF,anchor:'middle',weight:700})),1);
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // ===================== まとめ =====================
 [K+'sum']:(p)=>{
  const bw=360,gap=20,x0=600-(3*bw+2*gap)/2,y0=92,bh=330,xs=[0,1,2].map(i=>x0+i*(bw+gap));
  const gs=[seg(p,.02,.12),seg(p,.12,.22),seg(p,.22,.32)];
  let s='';
  // 左：ブランコの弧
  s+=card(xs[0],y0,bw,bh,swing(TH0,{cx:xs[0]+bw/2-40,py:y0+30,Lp:220,angLab:0,circ:.6})
   +T(`{\\color{${BL}}s}={\\color{${CY}}r}\\,${TH}=0.3\\ \\mathrm{m}`,xs[0]+bw/2,y0+bh-28,32),gs[0]);
  // 中：半径1の円
  s+=card(xs[1],y0,bw,bh,unitCircle({ox:xs[1]+30,oy:y0+215,R:170,bars:0,lens:0,labels:0,ex:0})
   +label('差 θ − sinθ ≈ θ³/6',xs[1]+bw/2,y0+268,{size:24,color:C.ink,anchor:'middle',weight:700})
   +label('相対 θ²/6 ＝ 0.24％',xs[1]+bw/2,y0+bh-20,{size:24,color:C.ink,anchor:'middle',weight:700}),gs[1]);
  // 右：相対誤差のグラフ
  const G=relGraph({x:xs[2]+60,y:y0+250,w:250,h:170,g:1});
  let r=G.svg.replace(/<text[^>]*>[^<]*<\/text>/g,'');
  const q=Math.sqrt(.006);
  r+=dot(G.A.X(q),G.A.Y(.1),8,YL)+label('0.077',G.A.X(q),G.A.Y(0)+30,{size:22,color:YL,anchor:'middle',weight:700})+label('0.1％',G.A.X(.16)-4,G.A.Y(.1)-10,{size:22,color:C.dim,anchor:'end'});
  r+=dot(G.A.X(TH0),G.A.Y(.24),9,BL);
  s+=card(xs[2],y0,bw,bh,r+label('0.12 は 線の 上',xs[2]+bw/2,y0+bh-22,{size:24,color:BL,anchor:'middle',weight:700}),gs[2]);
  // θ＝0.12 を同じ青の印で結ぶ
  const gl=seg(p,.4,.5);
  s+=fade(gl,line(xs[0]+40,y0+bh+40,xs[2]+bw-40,y0+bh+40,{color:BL,w:3,dash:'8 6'})+[0,1,2].map(i=>dot(xs[i]+bw/2,y0+bh+40,10,BL)).join('')
   +label('θ ＝ 0.12',xs[0]+bw/2-20,y0+bh+75,{size:24,color:BL,anchor:'end',weight:700}));
  s+=answerRow([[1,'B','0.3 m'],[2,'C','約 0.24％'],[3,'D','約 0.077 rad']],{g:seg(p,.6,.7),size:22});
  return s;
 },
};
