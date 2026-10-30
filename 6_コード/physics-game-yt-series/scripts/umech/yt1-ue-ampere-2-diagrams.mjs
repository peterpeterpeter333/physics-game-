// YouTube シリーズ「アンペールの法則・上級 2/3」(ys-ue-ampere-2) — 図。Stage 1200×515.
// 色：𝐁・d𝐁 橙、電流 I・欠片 d𝐥 緑、ŝ 桃、距離 r・s 白、一歩 d𝐫 金、強調 黄。
// 直線の図：導線は画面の横（y＝WY）、電流は右向き、P は真上（WX0, WY−RP）。x は右が正、P の真下が x＝0。
//   d𝐥×ŝ の z 成分＝dx·(r/s)＞0 → P ではどの欠片も ⊙（手前）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,texWidth,highlight,axes} from './anim.mjs';
import {CB,CI,RAD,RH,EC,HI,BAD,INK,DIM,cs,T,card,outSym,inSym,wire,head,circ,L,TF,mixed,turn,rightMark,bOut,bIn,dl,Bs,Bv,dBv,dBs,Ic,ringWire,O as O1} from './yt1-ue-ampere-1-diagrams.mjs';

const K='ue-ampere-2:';
const SC=C.t;
const sh=cs(RH,'\\hat{\\mathbf{s}}'),dr=cs(SC,'d\\mathbf{r}');
const WY=400,WX0=330,RP=210,PX=WX0,PY=WY-RP;// wire line y, P position
const UX=RP;// 1 r = RP px
function wireLine({g=1,ticks=0,xlab=1}={}){
 let s=arrow(30,WY,640,WY,{color:CI,w:5,head:18})+label('I',625,WY-16,{size:28,color:CI,weight:700});
 if(ticks)for(let i=0;i<12;i++){const x=55+i*50;s+=fade(ticks,line(x,WY-10,x,WY+10,{color:INK,w:2}));}
 if(xlab)s+=label('x',650,WY+34,{size:26,color:DIM})+line(WX0,WY+6,WX0,WY+18,{color:DIM,w:2})+label('x＝0',WX0,WY+46,{size:22,color:DIM,anchor:'middle'});
 return fade(g,s);
}
function Pt(g=1){return fade(g,dot(PX,PY,8,INK)+label('P',PX-30,PY-18,{size:30,color:INK,weight:700,anchor:'end'}));}
function rLine(g=1){return fade(g,line(PX,PY,PX,WY,{color:INK,w:2.5,dash:'9 7'})+label('r',PX+10,(PY+WY)/2+8,{size:30,color:INK,weight:700})+rightMark(PX,WY,[1,0],[0,-1],{s:14}));}
// piece at screen x xs (length 60)
function piece(xs,{g=1,lab=1,xl=0,hl=1}={}){
 return fade(g,(hl?rect(xs-38,WY-17,76,34,{fill:HI,fo:.12,stroke:HI,sw:2,rx:8}):'')+arrow(xs-30,WY,xs+30,WY,{color:CI,w:9,head:16})+(lab?T(dl,xs,WY+44,{size:28}):'')+(xl?label('x',xs,WY-18,{size:24,color:C.x,anchor:'middle',weight:700}):''));
}
function _unused(xs,{g=1,lab=1,xl=0}={}){
 return fade(g,rect(xs-38,WY-17,76,34,{fill:HI,fo:.12,stroke:HI,sw:2,rx:8})+arrow(xs-30,WY,xs+30,WY,{color:CI,w:9,head:16})+(lab?T(dl,xs,WY+44,{size:28}):'')+(xl?label('x',xs,WY-18,{size:24,color:C.x,anchor:'middle',weight:700}):''));
}
function sLine(xs,{g=1,lab=1}={}){const mx=(xs+PX)/2,my=(WY+PY)/2;return fade(g,line(xs,WY,PX,PY,{color:INK,w:2.5,dash:'4 6'})+(lab?label('s',mx+(xs<PX?-22:14),my-6,{size:30,color:INK,weight:700}):''));}
function sHat(xs,{g=1,lab=1}={}){const d=Math.hypot(PX-xs,PY-WY),ux=(PX-xs)/d,uy=(PY-WY)/d;return fade(g,arrow(xs,WY,xs+ux*85,WY+uy*85,{color:RH,w:5,head:14})+(lab?T(sh,xs+ux*85+(xs<PX?-26:26),WY+uy*85+6,{size:30}):''));}
function theta(xs,{g=1}={}){if(g<=.001)return '';const a1=Math.atan2(PY-WY,PX-xs)/RAD;const pts=Array.from({length:21},(_,i)=>{const a=(a1*i/20)*RAD;return [xs+46*Math.cos(a),WY+46*Math.sin(a)];});
 return fade(g,draw(pts,1,{color:HI,w:3})+label('θ',xs+(xs<PX?54:30),WY-34,{size:26,color:HI,weight:700}));}
function bP(g=1,lab=1){return fade(g,bOut(PX,PY,22)+(lab?T(dBv,PX+30,PY-18,{size:28,anchor:'start'}):''));}
const XL=170,XR=520;
// contribution curve f(u)=1/(1+u²)^{3/2}
const fcon=u=>Math.pow(1+u*u,-1.5);
function graph({g=1,shade=0,x=90,y=440,w=520,h=290}={}){
 const A=axes({x,y,w,h,xmin:-4,xmax:4,ymin:0,ymax:1.15,xticks:[],yticks:[]});
 let s=A.svg;
 if(shade>0){const pts=[[A.X(-1),A.Y(0)]];for(let i=0;i<=40;i++){const u=-1+2*i/40;pts.push([A.X(u),A.Y(fcon(u))]);}pts.push([A.X(1),A.Y(0)]);
  s+=fade(shade,`<polygon points="${pts.map(q=>q.join(',')).join(' ')}" fill="${HI}" fill-opacity=".3" stroke="none"/>`);}
 s+=A.plot(fcon,{color:CB,w:5,p:g});
 for(const [u,t] of [[-1,'−r'],[0,'0'],[1,'r']])s+=line(A.X(u),A.Y(0)-6,A.X(u),A.Y(0)+6,{color:DIM})+label(t,A.X(u),A.Y(0)+32,{size:22,color:DIM,anchor:'middle'});
 s+=label('x',A.X(4)+36,A.Y(0)+8,{size:24,color:DIM})+label('寄与の 大きさ',A.X(0)+14,A.Y(1.15)-36,{size:22,color:CB});
 return s;
}
const EQ=(src,x,y,o={})=>T(src,x,y,{size:44,...o});
const Bint=`${Bs}=\\dfrac{\\mu_0${Ic}r}{4\\pi}\\int_{-\\infty}^{\\infty}\\dfrac{dx}{s^3}`;
const Fx=`F(x)=\\dfrac{x}{r^2 s}`;

export const ytUeAmpere2Diagrams={
 // ===== S1 =====
 [K+'prev']:(p)=>{
  let s=ringWire({c:{x:300,y:262},R:150})+bOut(300,262,26);
  s+=card(640,110,500,280,L('前回：円形電流の 中心',890,165,{size:26,color:DIM})+TF(`${Bs}=\\dfrac{\\mu_0${Ic}}{2R}`,890,280,{size:54,box:true,frac:true}),seg(p,.1,.3));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=wireLine({ticks:seg(p,.05,.3),xlab:0})+Pt()+rLine();
  s+=card(680,90,470,320,L('前回の 最後の 問い',915,140,{size:24,color:DIM})+L('直線電流の 欠片を 足すと',915,215,{size:28,color:INK})
   +T(`${Bs}\\overset{?}{=}\\dfrac{\\mu_0${Ic}}{2\\pi r}`,915,320,{size:50}),seg(p,.1,.3),HI);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(60,60,500,380,L('中級の 道',310,110,{size:26,color:DIM})+L('一周の 和 ＋ 対称性',310,170,{size:28,color:INK,weight:700})+wire(310,300,'out',{text:''})+circ(310,300,90,1,{w:3,nh:4}),1);
  s+=card(640,60,500,380,L('今回の 道',890,110,{size:26,color:DIM})+L('欠片を 足す（ビオ・サバール）',890,170,{size:28,color:HI,weight:700}),seg(p,.4,.55),HI);
  s+=fade(seg(p,.5,.7),arrow(680,330,1100,330,{color:CI,w:5,head:16})+Array.from({length:8},(_,i)=>line(700+i*50,320,700+i*50,340,{color:INK,w:2})).join('')+dot(890,230,7,INK));
  return s;
 },
 [K+'why']:(p)=>{
  let s=card(60,60,500,300,L('欠片を 足す',310,110,{size:26,color:DIM})+T(`\\dfrac{\\mu_0${Ic}}{2\\pi r}\\ ?`,310,230,{size:48}),1);
  s+=card(640,60,500,300,L('一周の 和 ＋ 対称性',890,110,{size:26,color:DIM})+T(`\\dfrac{\\mu_0${Ic}}{2\\pi r}`,890,230,{size:48}),1);
  s+=fade(seg(p,.2,.4),L('同じなら → 2つの 法則は 食い違わない',600,420,{size:30,color:HI,weight:700}));
  s+=fade(seg(p,.6,.75),L('中級の 約束「足して 確かめる」の 実行',600,475,{size:26,color:INK}));
  return s;
 },
 // ===== S2 設定と向き =====
 [K+'setup']:(p)=>{
  let s=wireLine({g:seg(p,.05,.3),xlab:0});
  s+=card(700,110,450,260,L('設定',925,160,{size:26,color:DIM})+L('十分に 長い まっすぐな 導線',925,230,{size:26,color:INK})+L('電流 I：右向き',925,300,{size:30,color:CI,weight:700}),seg(p,.2,.4));
  return s;
 },
 [K+'P']:(p)=>{
  let s=wireLine({xlab:seg(p,.6,.8)})+Pt(seg(p,.05,.2))+rLine(seg(p,.25,.45));
  s+=card(700,110,450,260,L('調べる 点 P',925,160,{size:26,color:DIM})+L('導線から 距離 r の 真上',925,230,{size:28,color:INK,weight:700})+fade(seg(p,.6,.8),L('P の 真下：x ＝ 0',925,300,{size:28,color:C.x,weight:700})),1);
  return s;
 },
 [K+'piece']:(p)=>{
  let s=wireLine({ticks:1})+Pt()+rLine()+piece(XL,{g:seg(p,.1,.3),xl:1});
  s+=card(700,110,450,260,L('位置 x の 欠片',925,160,{size:26,color:DIM})+T(dl,925,240,{size:52})+L('右向き・長さ dx',925,320,{size:28,color:CI,weight:700}),seg(p,.2,.4));
  return s;
 },
 [K+'r']:(p)=>{
  let s=wireLine({ticks:1})+Pt()+piece(XL,{xl:1})+piece(XR,{lab:0,g:.6});
  s+=rLine();s+=fade(seg(p,.2,.4),highlight(PX-24,PY+10,60,RP-20,1,INK));
  s+=card(700,110,450,260,L('距離 r',925,160,{size:30,color:INK,weight:700})+L('導線 → P',925,230,{size:28,color:INK})+fade(seg(p,.4,.6),L('どの 欠片でも 同じ',925,300,{size:28,color:HI,weight:700})),1);
  return s;
 },
 [K+'s']:(p)=>{
  let s=wireLine({ticks:1})+Pt()+rLine()+piece(XL,{xl:1})+sLine(XL,{g:seg(p,.1,.3)});
  s+=fade(seg(p,.25,.4),piece(XR,{lab:0})+sLine(XR,{lab:0}));
  s+=card(700,90,450,320,L('距離 s：欠片 → P',925,140,{size:26,color:INK,weight:700})+L('欠片ごとに 変わる',925,205,{size:26,color:HI})
   +fade(seg(p,.55,.7),T(`s=\\sqrt{x^2+r^2}`,925,300,{size:46})+L('三平方の 定理',925,370,{size:24,color:DIM})),1);
  return s;
 },
 [K+'shat']:(p)=>{
  let s=wireLine({ticks:1})+Pt()+rLine()+piece(XL,{xl:1})+sLine(XL)+sHat(XL,{g:seg(p,.1,.3)});
  s+=card(700,110,450,260,mixed([`$${sh}$`,'：欠片 → P'],925,170,{size:28,color:RH,weight:700})+L('長さ 1 の 矢印',925,240,{size:28,color:INK})
   +fade(seg(p,.5,.7),mixed(['前回の',`$${cs(RH,'\\hat{\\mathbf{r}}')}$`,'と 同じ 役目'],925,310,{size:26,color:DIM})),1);
  return s;
 },
 [K+'dirL']:(p)=>{
  let s=wireLine({ticks:1})+Pt()+rLine(.5)+piece(XL)+sLine(XL,{lab:0})+sHat(XL);
  const a1=Math.atan2(PY-WY,PX-XL)/RAD;s+=turn(XL,WY,0,a1,{r:60,g:seg(p,.4,.55)});
  s+=bP(seg(p,.6,.75));
  s+=card(700,90,450,320,L('P より 左の 欠片',925,140,{size:26,color:DIM})
   +mixed([`$${sh}$`,'：右上向き'],925,205,{size:28,color:RH,weight:700})
   +fade(seg(p,.4,.55),mixed([`$${dl}$`,'（右）→',`$${sh}$`,'（右上）'],925,270,{size:26,color:HI}))
   +fade(seg(p,.6,.75),L('右ねじは 手前 → ⊙',925,345,{size:30,color:CB,weight:700})),1);
  return s;
 },
 [K+'dirR']:(p)=>{
  let s=wireLine({ticks:1})+Pt()+rLine(.5)+piece(XR)+sLine(XR,{lab:0})+sHat(XR)+bP(1);
  const a1=Math.atan2(PY-WY,PX-XR)/RAD;s+=turn(XR,WY,0,a1+360*(a1>0?-1:0),{r:56,g:seg(p,.4,.55)});
  s+=card(700,90,450,320,L('P より 右の 欠片',925,140,{size:26,color:DIM})
   +mixed([`$${sh}$`,'：左上向き'],925,205,{size:28,color:RH,weight:700})
   +fade(seg(p,.4,.55),mixed([`$${dl}$`,'（右）→',`$${sh}$`,'（左上）'],925,270,{size:26,color:HI}))
   +fade(seg(p,.6,.75),L('やはり 手前 → ⊙',925,345,{size:30,color:CB,weight:700})),1);
  return s;
 },
 [K+'allout']:(p)=>{
  let s=wireLine({ticks:1})+Pt()+rLine(.4);
  for(let i=0;i<9;i++){const xs=70+i*65;s+=fade(seg(p,.05+i*.04,.12+i*.04),sLine(xs,{lab:0})+piece(xs,{lab:0,hl:0}));}
  s+=bOut(PX,PY,28);
  s+=card(700,90,450,320,L('どの 欠片でも',925,140,{size:26,color:DIM})+mixed([`$${dBv}$`,'は 手前（⊙）'],925,205,{size:30,color:CB,weight:700})
   +fade(seg(p,.5,.65),L('右ねじ：右向きの 電流の',925,280,{size:26,color:INK})+L('上側は 手前 → 一致',925,330,{size:28,color:HI,weight:700})),1);
  return s;
 },
 // ===== S3 積分を立てる =====
 [K+'dB']:(p)=>{
  let s=wireLine({ticks:1})+Pt()+rLine(.5)+piece(XL,{xl:1})+sLine(XL)+sHat(XL)+theta(XL,{g:seg(p,.5,.65)})+bP(1,0);
  s+=card(680,90,480,320,L('欠片 1つの 大きさ',920,140,{size:26,color:DIM})+EQ(`${dBs}=\\dfrac{\\mu_0${Ic}}{4\\pi}\\,\\dfrac{dx\\,\\sin\\theta}{s^2}`,920,260,{size:42}),1);
  return s;
 },
 [K+'sin']:(p)=>{
  let s=wireLine({ticks:1})+Pt()+piece(XL,{xl:1})+theta(XL);
  // right triangle: piece → foot of r → P
  s+=fade(seg(p,.2,.4),`<polygon points="${XL},${WY} ${PX},${WY} ${PX},${PY}" fill="${HI}" fill-opacity=".12" stroke="${HI}" stroke-width="2.5"/>`);
  s+=rLine()+sLine(XL);
  s+=card(680,90,480,320,L('直角三角形',920,140,{size:26,color:DIM})+EQ(`\\sin\\theta=\\dfrac{r}{s}`,920,250,{size:50})+fade(seg(p,.55,.7),L('高さ ÷ 斜辺',920,350,{size:28,color:HI,weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'s3']:(p)=>{
  let s=card(80,40,1040,170,EQ(`${dBs}=\\dfrac{\\mu_0${Ic}}{4\\pi}\\,\\dfrac{dx\\cdot\\dfrac{r}{s}}{s^2}`,600,135,{size:44}),1);
  s+=fade(seg(p,.35,.55),EQ(`=\\dfrac{\\mu_0${Ic}}{4\\pi}\\,\\dfrac{r\\,dx}{s^3}`,600,320,{size:50}));
  s+=fade(seg(p,.6,.75),L('s² × s ＝ s³',600,450,{size:30,color:HI,weight:700}));
  return s;
 },
 [K+'graph']:(p)=>{
  let s=graph({g:seg(p,.05,.5)});
  s+=card(680,90,480,320,L('欠片の 寄与',920,140,{size:26,color:DIM})+EQ(`${dBs}\\propto\\dfrac{1}{s^3}`,920,240,{size:46})
   +fade(seg(p,.4,.6),L('真下（x ＝ 0）が 最大',920,320,{size:28,color:CB,weight:700}))+fade(seg(p,.6,.75),L('遠いほど 急に 小さい',920,375,{size:26,color:INK})),1);
  return s;
 },
 [K+'int']:(p)=>{
  let s=graph({shade:0});
  s+=card(660,90,500,320,L('全部 足す',910,140,{size:26,color:DIM})+EQ(Bint,910,260,{size:44})+fade(seg(p,.5,.7),L('x ＝ −∞ から ∞ まで',910,370,{size:28,color:HI,weight:700})),1);
  return s;
 },
 [K+'const']:(p)=>{
  const g1=seg(p,.1,.3)>.5,g2=seg(p,.5,.7)>.5;
  const src=`${Bs}=${g1?`{\\color{${HI}}{\\dfrac{\\mu_0 I r}{4\\pi}}}`:`\\dfrac{\\mu_0${Ic}r}{4\\pi}`}\\int_{-\\infty}^{\\infty}\\dfrac{dx}{${g2?cs(RH,'s^3'):'s^3'}}`;
  let s=card(80,50,1040,220,EQ(src,600,170,{size:56}),1);
  s+=fade(seg(p,.1,.3),L('黄：欠片に よらない → 積分の 外',600,330,{size:30,color:HI,weight:700}));
  s+=fade(seg(p,.5,.7),L('桃：s は 欠片ごとに 変わる → 積分の 中',600,400,{size:30,color:RH,weight:700}));
  return s;
 },
 // ===== S4 原始関数 =====
 [K+'F']:(p)=>{
  let s=TF(Fx,600,130,{size:60,box:true,frac:true});
  s+=fade(seg(p,.2,.35),T(`s=\\sqrt{x^2+r^2}`,600,270,{size:40}));
  s+=fade(seg(p,.5,.65),L('見つけ方：置換積分 ／ ここでは 微分して 確かめる',600,380,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'ds']:(p)=>{
  let s=L('まず s を 微分',600,80,{size:28,color:DIM});
  s+=EQ(`s=(x^2+r^2)^{\\frac12}`,600,170,{size:48});
  s+=fade(seg(p,.4,.6),EQ(`\\dfrac{ds}{dx}=${cs(HI,'\\tfrac12')}\\,(x^2+r^2)^{-\\frac12}\\times ${cs(C.x,'2x')}`,600,330,{size:48}));
  s+=fade(seg(p,.55,.7),L('実数乗の 微分 ／ 中身の 微分',600,450,{size:26,color:HI}));
  return s;
 },
 [K+'ds2']:(p)=>{
  const g=seg(p,.1,.3)>.5;
  let s=EQ(`\\dfrac{ds}{dx}=${g?'\\cancel{\\tfrac12}':'\\tfrac12'}\\,(x^2+r^2)^{-\\frac12}\\times ${g?'\\cancel{2}':'2'}x`,600,140,{size:48});
  s+=fade(seg(p,.35,.5),EQ(`(x^2+r^2)^{-\\frac12}=\\dfrac{1}{s}`,600,270,{size:40,color:DIM}));
  s+=TF(`\\dfrac{ds}{dx}=\\dfrac{x}{s}`,600,410,{size:52,box:true,frac:true,g:seg(p,.6,.75)});
  return s;
 },
 [K+'prod']:(p)=>{
  let s=EQ(`F=\\dfrac{1}{r^2}\\cdot\\dfrac{x}{s}`,600,130,{size:52});
  s+=fade(seg(p,.2,.35),L('1/r²：定数 → 外に 置く',600,240,{size:28,color:DIM}));
  s+=fade(seg(p,.5,.7),EQ(`\\dfrac{x}{s}=${cs(C.x,'x')}\\times${cs(RH,'\\dfrac{1}{s}')}`,600,350,{size:48})+L('積の 微分',600,460,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'t1']:(p)=>{
  let s=EQ(`\\Big(${cs(C.x,'x')}\\cdot${cs(RH,'\\dfrac{1}{s}')}\\Big)'={\\color{${HI}}{1\\cdot\\dfrac{1}{s}}}+\\ \\cdots`,600,170,{size:46});
  s+=fade(seg(p,.2,.4),L('黄：1つ目の 項',600,280,{size:28,color:HI,weight:700}));
  s+=fade(seg(p,.4,.6),L('x の 微分 ＝ 1',600,370,{size:30,color:C.x,weight:700}));
  return s;
 },
 [K+'t2']:(p)=>{
  let s=EQ(`\\Big(\\dfrac{1}{s}\\Big)'=-\\dfrac{1}{s^2}\\cdot\\dfrac{ds}{dx}=-\\dfrac{x}{s^3}`,600,130,{size:44});
  s+=fade(seg(p,.5,.7),EQ(`\\Big(x\\cdot\\dfrac{1}{s}\\Big)'=\\dfrac{1}{s}{\\color{${HI}}{-\\ \\dfrac{x^2}{s^3}}}`,600,330,{size:46})+L('黄：2つ目の 項',600,440,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'comm']:(p)=>{
  let s=EQ(`\\dfrac{1}{s}-\\dfrac{x^2}{s^3}`,600,120,{size:48});
  s+=fade(seg(p,.2,.4),EQ(`=\\dfrac{${cs(HI,'s^2')}}{s^3}-\\dfrac{x^2}{s^3}`,600,250,{size:48}));
  s+=fade(seg(p,.55,.75),EQ(`=\\dfrac{s^2-x^2}{s^3}`,600,390,{size:48}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=EQ(`s^2-x^2=r^2\\quad\\Rightarrow\\quad\\dfrac{r^2}{s^3}`,600,110,{size:44});
  s+=fade(seg(p,.3,.5),EQ(`F'=\\dfrac{1}{\\cancel{r^2}}\\cdot\\dfrac{\\cancel{r^2}}{s^3}`,600,240,{size:46}));
  s+=TF(`F'=\\dfrac{1}{s^3}`,600,400,{size:52,box:true,frac:true,g:seg(p,.55,.7)});
  s+=fade(seg(p,.7,.85),L('積分の 中身と 一致 ✓',950,400,{size:28,color:C.F,weight:700}));
  return s;
 },
 [K+'limP']:(p)=>{
  const A=axes({x:90,y:300,w:520,h:220,xmin:-4,xmax:4,ymin:-1.2,ymax:1.2,xticks:[],yticks:[]});
  let s=A.svg+A.plot(u=>u/Math.sqrt(1+u*u),{color:HI,w:5,p:seg(p,.05,.4)});
  s+=line(A.X(-4),A.Y(1),A.X(4),A.Y(1),{color:DIM,w:1.5,dash:'6 6'})+line(A.X(-4),A.Y(-1),A.X(4),A.Y(-1),{color:DIM,w:1.5,dash:'6 6'});
  s+=label('1',A.X(0)-14,A.Y(1)-6,{size:22,color:DIM,anchor:'end'})+label('−1',A.X(0)-14,A.Y(-1)+24,{size:22,color:DIM,anchor:'end'})+label('x/s',A.X(-4)+6,A.Y(1.2)-20,{size:24,color:HI});
  s+=card(680,90,480,320,L('x が とても 大きい',920,140,{size:26,color:DIM})+EQ(`s\\approx x,\\ \\ \\dfrac{x}{s}\\to 1`,920,225,{size:42})
   +fade(seg(p,.5,.7),EQ(`F\\to\\dfrac{1}{r^2}`,920,335,{size:46})),1);
  return s;
 },
 [K+'limN']:(p)=>{
  let s=EQ(`F(\\infty)=\\dfrac{1}{r^2},\\qquad F(-\\infty)=-\\dfrac{1}{r^2}`,600,120,{size:44});
  s+=fade(seg(p,.5,.7),EQ(`F(\\infty)-F(-\\infty)=\\dfrac{1}{r^2}-\\Big(-\\dfrac{1}{r^2}\\Big)=\\dfrac{2}{r^2}`,600,300,{size:44}));
  return s;
 },
 [K+'res1']:(p)=>{
  const g=seg(p,.45,.6)>.5;
  let s=EQ(`${Bs}=\\dfrac{\\mu_0${Ic}\\,${g?'\\cancel{r}':'r'}}{4\\pi}\\times\\dfrac{2}{r^{${g?'\\cancel{2}':'2'}}}`,600,150,{size:52});
  s+=fade(seg(p,.6,.75),EQ(`=\\dfrac{2\\mu_0${Ic}}{4\\pi r}`,600,330,{size:52}));
  return s;
 },
 [K+'res2']:(p)=>{
  let s=EQ(`\\dfrac{2}{4\\pi}=\\dfrac{1}{2\\pi}`,600,100,{size:42,color:DIM});
  s+=TF(`${Bs}=\\dfrac{\\mu_0${Ic}}{2\\pi r}`,600,260,{size:64,box:true,frac:true,g:seg(p,.15,.3)});
  s+=fade(seg(p,.55,.7),L('アンペールの 法則 ＋ 対称性 と 同じ ✓',600,430,{size:32,color:C.F,weight:700}));
  return s;
 },
 // ===== S5 どの欠片が効くか =====
 [K+'q71']:(p)=>{
  let s=graph({shade:seg(p,.2,.4)});
  s+=card(680,110,480,280,L('予想',920,160,{size:26,color:DIM})+L('真下から 左右 r 以内で',920,235,{size:28,color:INK})+L('全体の 何割？',920,305,{size:34,color:HI,weight:700}),1,HI);
  return s;
 },
 [K+'a71a']:(p)=>{
  let s=graph({shade:1});
  s+=card(680,60,480,400,L('x ＝ r のとき',920,105,{size:26,color:DIM})+EQ(`s=\\sqrt{2}\\,r`,920,175,{size:40})
   +fade(seg(p,.3,.5),EQ(`F(r)=\\dfrac{r}{r^2\\cdot\\sqrt2\\,r}=\\dfrac{1}{\\sqrt2\\,r^2}`,920,285,{size:36}))
   +fade(seg(p,.65,.8),EQ(`F(-r)=-\\dfrac{1}{\\sqrt2\\,r^2}`,920,400,{size:36})),1);
  return s;
 },
 [K+'a71b']:(p)=>{
  let s=graph({shade:1});
  s+=card(680,60,480,400,L('|x| ≦ r の 欠片',920,105,{size:26,color:DIM})+EQ(`F(r)-F(-r)=\\dfrac{\\sqrt2}{r^2}`,920,185,{size:38})
   +fade(seg(p,.3,.5),EQ(`\\dfrac{\\sqrt2/r^2}{2/r^2}=\\dfrac{1}{\\sqrt2}\\approx 0.71`,920,305,{size:38}))
   +fade(seg(p,.6,.75),L('約 71 %',920,410,{size:36,color:HI,weight:700})),1);
  return s;
 },
 [K+'rest']:(p)=>{
  let s=graph({shade:1});
  s+=card(680,90,480,320,L('残り 約 29 %',920,145,{size:30,color:CB,weight:700})+L('もっと 遠い 欠片から',920,210,{size:26,color:INK})
   +fade(seg(p,.45,.6),L('「無限に 長い」＝',920,290,{size:26,color:DIM})+L('r より ずっと 長い',920,345,{size:30,color:HI,weight:700})),1);
  return s;
 },
 [K+'num10']:(p)=>{
  let s=card(60,60,1080,180,L('I ＝ 10 A，r ＝ 0.1 m',600,105,{size:28,color:DIM})+EQ(`${Bs}=\\dfrac{\\mu_0}{2\\pi}\\cdot\\dfrac{${Ic}}{r}=2\\times10^{-7}\\times\\dfrac{10}{0.1}`,600,185,{size:44}),1);
  s+=fade(seg(p,.4,.6),TF(`${Bs}=2\\times10^{-5}\\,\\mathrm{T}`,600,340,{size:52,box:true}));
  s+=fade(seg(p,.7,.85),L('中級で 求めた 値と 同じ',600,460,{size:28,color:C.F,weight:700}));
  return s;
 },
 // ===== S6 使い分け =====
 [K+'cmp2']:(p)=>{
  let s=card(40,30,540,440,L('欠片を 足す 道',310,75,{size:26,color:CI,weight:700}),1);
  s+=arrow(70,300,550,300,{color:CI,w:5,head:16});for(let i=0;i<9;i++){const x=90+i*52;s+=line(x,290,x,310,{color:INK,w:2})+line(x,300,310,170,{color:INK,w:1.3,dash:'5 6',opacity:.5});}
  s+=bOut(310,170,16)+T(`\\int_{-\\infty}^{\\infty}\\dfrac{dx}{s^3}`,310,400,{size:36});
  s+=card(620,30,540,440,L('一周の 和の 道',890,75,{size:26,color:SC,weight:700}),seg(p,.05,.2));
  const cx=860,cy=290,R=120;
  s+=fade(seg(p,.05,.2),wire(cx,cy,'out',{text:'I',r:16})+ring(cx,cy,R,{color:SC,w:3,dash:'9 7'})+line(cx+16,cy,cx+R,cy,{color:INK,w:2.5,dash:'8 6'})+label('r',cx+60,cy+30,{size:28,color:INK,weight:700}));
  // step at the top of the circle: ccw tangent = left
  s+=fade(seg(p,.25,.4),arrow(cx,cy-R,cx-85,cy-R,{color:SC,w:6,head:15})+T(dr,cx-42,cy-R+36,{size:28}));
  s+=fade(seg(p,.4,.55),L('一歩に 半径方向の 部分は ない',890,118,{size:24,color:RH}));
  s+=fade(seg(p,.55,.7),arrow(cx,cy-R-22,cx-95,cy-R-22,{color:CB,w:4,head:13})+T(Bv,cx-112,cy-R-14,{size:28,anchor:'end'}));
  s+=fade(seg(p,.72,.85),T(`${Bv}\\cdot${dr}=B\\,d\\ell`,890,450,{size:36}));
  return s;
 },
 [K+'cmp3']:(p)=>{
  let s=card(40,30,540,440,L('欠片を 足す 道',310,75,{size:26,color:CI,weight:700})+T(`\\dfrac{\\mu_0${Ic}}{2\\pi r}`,310,260,{size:52}),1);
  const cx=760,cy=230,R=100;
  s+=card(620,30,540,440,L('一周の 和の 道',890,75,{size:26,color:SC,weight:700}),1);
  s+=wire(cx,cy,'out',{text:'',r:14})+ring(cx,cy,R,{color:SC,w:3,dash:'9 7'})+line(cx+14,cy,cx+R,cy,{color:INK,w:2.5,dash:'8 6'})+label('r',cx+50,cy+28,{size:26,color:INK,weight:700});
  s+=label('r：半径（一定）',990,180,{size:24,color:INK,anchor:'middle'})+label('dℓ：一歩の 長さ',990,230,{size:24,color:SC,anchor:'middle'});
  s+=fade(seg(p,.4,.6),T(`B\\times 2\\pi r=\\mu_0${Ic}`,890,380,{size:40}));
  s+=fade(seg(p,.7,.85),L('同じ 式 ✓',310,380,{size:30,color:C.F,weight:700}));
  return s;
 },
 [K+'use']:(p)=>{
  let s=card(40,40,540,420,L('欠片を 足す（ビオ・サバール）',310,90,{size:26,color:CI,weight:700})+L('○ どんな 形にも 使える',310,200,{size:28,color:INK})+L('△ 積分が 重い',310,280,{size:28,color:BAD}),1);
  s+=card(620,40,540,420,L('一周の 和（アンペール）',890,90,{size:26,color:SC,weight:700})+fade(seg(p,.5,.65),L('△ 対称性が あるときだけ',890,200,{size:28,color:BAD})+L('○ 速い',890,280,{size:28,color:INK})),seg(p,.4,.55));
  return s;
 },
 [K+'gauss']:(p)=>{
  let s=card(40,40,540,300,L('電場',310,90,{size:30,color:EC,weight:700})+L('クーロン：電荷の 欠片を 足す',310,190,{size:26,color:INK})+L('ガウス：対称性で 速い',310,260,{size:26,color:INK}),1);
  s+=card(620,40,540,300,L('磁場',890,90,{size:30,color:CB,weight:700})+L('ビオ・サバール：電流の 欠片を 足す',890,190,{size:26,color:INK})+L('アンペール：対称性で 速い',890,260,{size:26,color:INK}),seg(p,.2,.4));
  s+=fade(seg(p,.6,.8),L('同じ 関係',600,420,{size:34,color:HI,weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=card(60,40,1080,200,L('ビオ・サバールで 直線電流の 欠片を 足す',600,85,{size:26,color:DIM})+T(`${Bs}=\\dfrac{\\mu_0${Ic}r}{4\\pi}\\int_{-\\infty}^{\\infty}\\dfrac{dx}{s^3}=\\dfrac{\\mu_0${Ic}r}{4\\pi}\\cdot\\dfrac{2}{r^2}=\\dfrac{\\mu_0${Ic}}{2\\pi r}`,600,175,{size:40}),1);
  s+=fade(seg(p,.5,.7),L('アンペールの 法則の 結果と 一致',600,330,{size:34,color:C.F,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  // solenoid side view
  let s='';const x0=90,x1=560,yt=170,yb=350;
  for(let i=0;i<10;i++){const x=x0+20+i*47;s+=fade(seg(p,.05+i*.03,.12+i*.03),`<ellipse cx="${x}" cy="${(yt+yb)/2}" rx="16" ry="${(yb-yt)/2}" fill="none" stroke="${CI}" stroke-width="3.5"/>`);}
  s+=fade(seg(p,.4,.6),draw([[x0+150,yb-50],[x0+340,yb-50],[x0+340,yt-60],[x0+150,yt-60],[x0+150,yb-50]],1,{color:SC,w:3.5,dash:'9 7'}));
  s+=card(660,90,480,330,L('次の 問い',900,140,{size:26,color:DIM})+L('密に 巻いた 長い コイル',900,215,{size:28,color:INK})+L('中の 磁場は？',900,285,{size:34,color:CB,weight:700})+L('長方形の 輪で',900,360,{size:28,color:SC,weight:700}),seg(p,.1,.3),HI);
  return s;
 },
};
