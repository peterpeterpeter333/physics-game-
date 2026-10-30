// 問題編 解説「すき間の電場、電磁波の 𝐁、左へ進む波」（q-ue-maxwell、大学編 29 マクスウェル方程式・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/29_マクスウェル方程式.md の q-ue-maxwell（解説 21 行）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色（正本・単元動画どおり）：電流 I 緑、電荷 q 桃、𝐄 水色、𝐁 橙、面積 S 金、時間 t 金、x 水色、c・進む向き 紫、電気束・強調 黄、μ₀・ε₀ 白、誤り 赤。
// 座標：x 右、y 上、z 手前（左下へ斜めに描く）。⊙＝手前。
// 単元動画（yt1-ue-maxwell-1/3）の記号の定数を import して使う。図は目盛りの文字を 22px 以上にするため、ここで描く。
// 図のために決めた値：立体図の波長・振幅の長さ（画面上）。行19 の f の形は山が1つの形（f(u)＝exp(−u²)）、ずらしは図の都合。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth} from './anim.mjs';
import {cs,TAU} from './yt1-ui-ac-waves-1-diagrams.mjs';
import {eps,mu} from './yt1-ue-maxwell-1-diagrams.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin,cueT,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-ue-maxwell:';
const IC=C.F,QC=C.p,EC=C.x,BC=C.E,SC=C.t,TC=C.t,XC=C.x,VC=C.v,HI=C.hi,BAD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const tI=cs(IC,'I'),tq=cs(QC,'q'),tE=cs(EC,'E'),tS=cs(SC,'S'),tt=cs(TC,'t'),tx=cs(XC,'x'),tc=cs(VC,'c'),tB=cs(BC,'B'),tE0=cs(EC,'E_0'),tB0=cs(BC,'B_0');
const vE=cs(EC,'\\mathbf{E}'),vB=cs(BC,'\\mathbf{B}');
const dEdt=`\\dfrac{d${tE}}{d${tt}}`;
const G1='dE/dt',G2='𝐁 の振幅と向き',G3='満たすか、進む向き';
const ANS1=g=>answerTag(1,'B','2.8×10¹² V/(m·s)',{g}),ANS2=g=>answerTag(2,'D','3.0×10⁻⁶ T、+z',{g}),ANS3=g=>answerTag(3,'B','左へ速さ c',{g});
const WAVE=`\\dfrac{\\partial^2 ${tE}}{\\partial ${tx}^2}=${mu}${eps}\\,\\dfrac{\\partial^2 ${tE}}{\\partial ${tt}^2}`;
const FPLUS=`f(${tx}+${tc}${tt})`;

// ---- 平行板（横から見た図）----
function plates({x1=470,x2=560,cy=270,h=220,g=1,q=.5,E=0,Elen=1,Ehi=0,cur=1,curLab='0.5 A',dots=null,S=1,wl=110,wr=920,qLab=0}={}){
 const pt=cy-h/2,pb=cy+h/2;
 let s=line(wl,cy,x1,cy,{color:C.dim,w:6})+line(x2,cy,wr,cy,{color:C.dim,w:6});
 s+=rect(x1-10,pt,10,h,{fill:C.ink,fo:.8,stroke:C.ink,sw:1,rx:2})+rect(x2,pt,10,h,{fill:C.ink,fo:.8,stroke:C.ink,sw:1,rx:2});
 const n=Math.round(1+5*q);
 for(let k=0;k<n;k++){const y=pt+16+k*(h-32)/Math.max(1,n-1);s+=label('＋',x1-26,y+9,{size:24,color:QC,anchor:'middle',weight:700})+label('−',x2+26,y+9,{size:26,color:QC,anchor:'middle',weight:700});}
 if(E>0){for(let k=0;k<5;k++){const y=pt+24+k*(h-48)/4,Lx=(x2-x1-20)*Elen,xm=(x1+x2)/2;if(Lx>10)s+=fade(E,arrow(xm-Lx/2,y,xm+Lx/2,y,{color:Ehi?HI:EC,w:3.5+2*Ehi,head:11}));}
  s+=fade(E,label('𝐄',(x1+x2)/2,pt-14,{size:28,color:EC,anchor:'middle',weight:700}));}
 if(cur){const a0=wl+Math.max(15,(x1-wl)*.15),a1=x1-Math.max(44,(x1-wl)*.2);
  s+=arrow(a0,cy-28,a1,cy-28,{color:IC,w:6,head:16})+label(curLab,(a0+a1)/2,cy-48,{size:28,color:IC,anchor:'middle',weight:700});
  const b0=x2+44,b1=Math.min(wr-15,b0+(a1-a0));if(b1-b0>40)s+=arrow(b0,cy-28,b1,cy-28,{color:IC,w:6,head:16});}
 if(dots!==null){for(let k=0;k<6;k++){const u=((dots*.5+k/6)%1),x=mix(wl,x1-14,u);s+=dot(x,cy,7,QC);}}
 if(S)s+=fade(S,label('S ＝ 0.02 m²',(x1+x2)/2,pb+38,{size:26,color:SC,anchor:'middle',weight:700}));
 if(qLab)s+=fade(qLab,label('dq/dt ＝ I（電荷保存）',x1-40,pb+38,{size:26,color:QC,anchor:'end',weight:700}));
 return fade(g,s);
}

// ---- 立体図（斜投影）：x 右、y 上、z 手前（左下）----
function proj(o){const {ox=600,oy=300,sx=1,sy=1,zx=.55,zy=.45}=o;return (x,y,z)=>[ox+x*sx-z*zx,oy-y*sy+z*zy];}
function emFig({ox=180,oy=300,len=620,lam=300,amp=95,ph=0,gE=1,gB=0,mark=0,dir=1,axes=1,crestHi=0,Bdir=1,showBarrow=0,g=1,E0lab=0,E0at=null,n=17}={}){
 const P=proj({ox,oy});let s='';
 if(axes){s+=arrow(...P(-20,0,0),...P(len+40,0,0),{color:C.dim,w:2.5,head:12})+label('x',...P(len+56,-8,0),{size:26,color:XC,weight:700});
  s+=arrow(...P(0,-20,0),...P(0,amp+50,0),{color:C.dim,w:2.5,head:12})+label('y',P(0,amp+64,0)[0]-6,P(0,amp+64,0)[1],{size:26,color:C.dim,weight:700});
  s+=arrow(...P(0,0,-20),...P(0,0,amp+60),{color:C.dim,w:2.5,head:12})+label('z（手前）',P(0,0,amp+72)[0]-10,P(0,0,amp+72)[1]+18,{size:24,color:C.dim,weight:700,anchor:'middle'});}
 const val=x=>Math.sin(TAU*x/lam-ph);
 if(gE){s+=fade(gE,draw(Array.from({length:181},(_,i)=>{const x=len*i/180;return P(x,amp*val(x),0);}),1,{color:EC,w:3}));
  for(let i=0;i<=n;i++){const x=len*i/n,v=amp*val(x);if(Math.abs(v)>8)s+=fade(gE,arrow(...P(x,0,0),...P(x,v,0),{color:EC,w:3,head:10}));}}
 if(gB){s+=fade(gB,draw(Array.from({length:181},(_,i)=>{const x=len*i/180;return P(x,0,Bdir*amp*val(x));}),1,{color:BC,w:3}));
  for(let i=0;i<=n;i++){const x=len*i/n,v=Bdir*amp*val(x);if(Math.abs(v)>8)s+=fade(gB,arrow(...P(x,0,0),...P(x,0,v),{color:BC,w:3,head:10}));}}
 let xc=lam*(((ph/TAU+.25)%1+1)%1);if(xc<lam*.4)xc+=lam;   // +y の山（画面の中ほどのもの）
 if(mark)s+=fade(mark,dot(...P(xc,amp,0),11,HI)+ring(...P(xc,amp,0),18,{color:HI,w:3}));
 if(dir)s+=fade(dir,arrow(...P(len-120,amp+70,0),...P(len+20,amp+70,0),{color:VC,w:6,head:16})+label('進む向き +x',P(len-50,amp+92,0)[0],P(len-50,amp+92,0)[1],{size:24,color:VC,anchor:'middle',weight:700}));
 if(E0lab)s+=fade(E0lab,label('E₀ ＝ 900 V/m',...(E0at??P(xc+30,amp+20,0)),{size:26,color:EC,weight:700}));
 return {svg:fade(g,s),P,xc,amp};
}

// ---- 山が1つの形 f（行19〜21）----
function bumpGraph({x0=120,w=760,cy=360,h=200,shift=0,later=1,g=1,dirLab=1,right=0}={}){
 const X=u=>x0+w*(u+4)/8,f=u=>Math.exp(-u*u*1.6);
 let s=arrow(x0-10,cy,x0+w+26,cy,{color:C.dim,w:2.5,head:12})+label('x',x0+w+34,cy+9,{size:26,color:XC,weight:700});
 s+=draw(Array.from({length:161},(_,i)=>{const u=-4+8*i/160;return [X(u),cy-h*f(u-.8)];}),1,{color:EC,w:5});
 s+=right?label('t ＝ 0',X(.8)-60,cy-h+10,{size:24,color:EC,weight:700,anchor:'end'}):label('t ＝ 0',X(.8)+60,cy-h+10,{size:24,color:EC,weight:700});
 if(later>0){const d=right?shift:-shift;
  s+=fade(later,draw(Array.from({length:161},(_,i)=>{const u=-4+8*i/160;return [X(u),cy-h*f(u-.8-d)];}),1,{color:EC,w:4,dash:'10 8'})
   +(right?label('少し 後',X(.8+d)+60,cy-h+10,{size:24,color:EC,weight:700}):label('少し 後',X(.8+d)-60,cy-h+10,{size:24,color:EC,anchor:'end',weight:700})));
  if(dirLab)s+=fade(later,arrow(X(.8)-10,cy-h-30,X(.8+d)+10,cy-h-30,{color:VC,w:5,head:14})+label(right?'右へ 速さ c':'左へ 速さ c',(X(.8)+X(.8+d))/2,cy-h-48,{size:26,color:VC,anchor:'middle',weight:700}));}
 return fade(g,s);
}

// ---- 問題アニメ ----
function quizFig(p){
 const g1=seg(p,0,.08),g2=seg(p,.29,.37),g3=seg(p,.72,.8);
 let s=fade(g1,plates({x1:190,x2:240,cy:260,h:160,q:.4,wl:20,wr:330,S:0})+label('S ＝ 0.02 m²',215,380,{size:26,color:SC,anchor:'middle',weight:700}));
 const W=emFig({E0at:[560,425],ox:480,oy:290,len:280,lam:220,amp:70,n:12,gE:seg(p,.33,.6),mark:seg(p,.6,.66),dir:seg(p,.63,.7),axes:1,g:g2,E0lab:seg(p,.64,.7)});
 s+=W.svg;
 s+=fade(g3,card(850,110,345,330,'',1)+T(WAVE,1022,190,30)+label('E は 電場の y 成分',1022,275,{size:22,color:C.dim,anchor:'middle'})+T(FPLUS,1022,350,40)+label('を 入れる',1022,410,{size:24,color:C.dim,anchor:'middle'}));
 return s;
}

export const ytQxUeMaxwellDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（7秒）：0〜2 s 充電中の平行板（S＝0.02 m²、0.5 A）、2〜5 s 立体図の 𝐄 の波（E₀＝900 V/m、+y の山の印、進む向き +x）、5〜7 s 波動方程式と f(x＋ct)。
 //   すき間の電場の伸び・𝐁・外積・倍率・形のずれは描かない。
 [K+'q1']:(p)=>quizFig(p),

 // ===================== 小問1 =====================
 // 1. 充電中のコンデンサ。求めるもの：dE/dt
 [K+'goal1']:(p)=>plates({q:.4,g:seg(p,0,.1)})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. E＝q/(ε₀S)。導線の電荷が板にたまる動きに「dq/dt＝I（電荷保存）」
 [K+'Eq']:(p,ctx)=>{
  let s=plates({q:.3+.5*seg(p,.3,.95),dots:cueT(ctx),qLab:seg(p,.45,.55),x1:380,x2:470,wl:60,wr:760,S:0});
  s+=card(820,110,350,170,T(`${tE}=\\dfrac{${tq}}{${eps}${tS}}`,995,195,46),seg(p,.02,.12),EC);
  return s+goalTag(G1);
 },
 // 3. 時間で微分：q → dq/dt → I（一操作ずつ）
 [K+'diff']:(p)=>{
  let s=T(`${tE}=\\dfrac{${tq}}{${eps}${tS}}`,600,140,44);
  s+=fade(seg(p,.15,.3),L('時間で 微分（ε₀ と S は 一定）',600,225,{size:24,color:C.dim}));
  s+=fade(seg(p,.25,.4)*(1-seg(p,.55,.62)),T(`${dEdt}=\\dfrac{1}{${eps}${tS}}\\,\\dfrac{d${tq}}{d${tt}}`,600,330,44));
  s+=fade(seg(p,.58,.66),T(`${dEdt}=\\dfrac{${tI}}{${eps}${tS}}`,600,330,48));
  s+=fade(seg(p,.66,.76),L('dq/dt を I に 置きかえ',600,445,{size:24,color:HI,weight:700}));
  return s+goalTag(G1);
 },
 // 4. 分母 1.77×10⁻¹³ を先に、割って ≈2.8×10¹²。すき間の電場が急速に伸びる。小問1 の答え B
 [K+'num']:(p)=>{
  let s=plates({q:.8,E:1,Elen:clamp(.2+.8*seg(p,.5,.85)),x1:200,x2:290,wl:30,wr:420,cy:270,h:200,cur:1,S:1});
  s+=card(470,95,710,400,'',1);
  s+=fade(seg(p,.02,.12),L('分母',540,175,{size:24,color:C.dim})+T(`8.85\\times10^{-12}\\times0.02=1.77\\times10^{-13}`,850,170,32));
  s+=fade(seg(p,.25,.35),T(`${dEdt}=\\dfrac{0.5}{1.77\\times10^{-13}}`,825,290,36));
  s+=fade(seg(p,.45,.55),T(`\\approx2.8\\times10^{12}\\ \\mathrm{V/(m\\cdot s)}`,825,410,36));
  return s+goalTag(G1)+ANS1(seg(p,.82,.9));
 },
 // 5. 誤答 A → C（1枚ずつ）
 [K+'wrong1']:(p,ctx)=>fade(.55,plates({q:.8,E:1,cy:190,h:170,S:0}))+wrongSeq(p,ctx,[['A','5.6×10¹⁰','I/ε₀（S で 割っていない）'],['C','8.9×10⁻¹⁴','ε₀ と S を 掛けた']])+goalTag(G1)+ANS1(1),
 // 6. 伸びる電場の矢印を黄で光らせる。誤答 D
 [K+'wrongD']:(p,ctx)=>plates({q:.8,E:1,Ehi:1,Elen:.3+.7*((cueT(ctx)*.4)%1),cy:190,h:170,S:0})+wrongCard('D','0','電荷は 通らないが、電場は 増える',{g:seg(p,.35,.42)})+goalTag(G1)+ANS1(1),
 // 7. 戻すと 0.5 A。輪と、導線を横切る平らな面・すき間を通る袋の面で、右辺はどちらも μ₀×0.5 A
 [K+'back']:(p)=>{
  let s=card(240,88,720,96,T(`${eps}${tS}\\times${dEdt}=1.77\\times10^{-13}\\times2.8\\times10^{12}\\approx0.5\\ \\mathrm{A}`,600,136,28),seg(p,0,.08),HI);
  const cy=350,lx=180,rx=26,ry=70;
  s+=plates({q:.8,E:1,cy,h:150,x1:480,x2:560,wl:60,wr:760,S:0,cur:1});
  // 輪（導線のまわり）
  s+=fade(seg(p,.25,.35),`<ellipse cx="${lx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.ink}" stroke-width="4"/>`+label('輪',lx,cy-ry-12,{size:24,color:C.ink,anchor:'middle',weight:700}));
  // 平らな面
  s+=fade(seg(p,.35,.45),`<ellipse cx="${lx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${HI}" fill-opacity=".25" stroke="none"/>`);
  // 袋の面（すき間を通る）
  const bag=`M${lx},${cy-ry} C ${lx+90},${cy-ry-20} ${520-40},${cy-60} 520,${cy-60} L520,${cy+60} C ${520-40},${cy+60} ${lx+90},${cy+ry+20} ${lx},${cy+ry}`;
  s+=fade(seg(p,.55,.65),`<path d="${bag}" fill="${HI}" fill-opacity=".08" stroke="${HI}" stroke-width="3" stroke-dasharray="10 7"/>`);
  s+=card(800,210,380,260,fade(seg(p,.4,.5),L('平らな面：導線の 電流',990,260,{size:24,color:IC,weight:700})+T(`${mu}\\times0.5\\ \\mathrm{A}`,990,310,32))
   +fade(seg(p,.62,.72),L('袋の面：変位電流',990,380,{size:24,color:HI,weight:700})+T(`${mu}\\times0.5\\ \\mathrm{A}`,990,430,32)),seg(p,.35,.45));
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 8. 立体図と 𝐄 の波、進む向き +x。求めるもの：𝐁 の振幅と向き
 [K+'goal2']:(p)=>emFig({gE:seg(p,0,.2),mark:seg(p,.2,.3),dir:seg(p,.25,.35),E0lab:seg(p,.3,.4)}).svg+goalTag(G2,{g:seg(p,.03,.15)}),
 // 9. ①波の図に k＝2π÷波長、ω＝2π×振動数 → ②法則：B＝(k/ω)E₀ sin(kx−ωt)、ω/k＝c → B₀＝E₀/c
 [K+'law']:(p)=>{
  const cA=1-seg(p,.36,.41),cB=seg(p,.39,.44);
  const X=u=>140+u*620,Y=v=>290-v*110;
  let a=arrow(120,290,800,290,{color:C.dim,w:2.5,head:12})+label('x',808,299,{size:26,color:XC,weight:700});
  a+=draw(Array.from({length:181},(_,i)=>{const u=i/180;return [X(u),Y(Math.sin(TAU*u*1.6))];}),1,{color:EC,w:5});
  const c1=1/(4*1.6),c2=c1+1/1.6;
  a+=fade(seg(p,.05,.15),brace(X(c1),X(c2),Y(1)-14,{dir:-1,color:EC,text:'k ＝ 2π ÷ 波長',size:26}));
  a+=fade(seg(p,.15,.25),ring(980,250,70,{color:TC,w:4,fill:'#1a1a10'})+line(980,250,980,195,{color:TC,w:5})+L('ω ＝ 2π × 振動数',980,370,{size:26,color:TC,weight:700}));
  let s=fade(cA,a);
  let b=kindTag('法則',600,110,{g:cB})+L('ファラデーの 法則の 式から',600,160,{size:24,color:C.dim});
  b+=fade(seg(p,.44,.54),T(`${tB}=\\dfrac{k}{\\omega}\\,${tE0}\\sin(k${tx}-\\omega ${tt})`,600,232,34));
  b+=fade(seg(p,.6,.7),T(`\\dfrac{\\omega}{k}=${tc}\\ \\Rightarrow\\ \\dfrac{k}{\\omega}=\\dfrac{1}{${tc}}`,600,335,34));
  b+=fade(seg(p,.76,.86),T(`${tB0}=\\dfrac{${tE0}}{${tc}}`,600,445,40));
  s+=fade(cB,b);
  return s+goalTag(G2);
 },
 // 10. 900÷(3.0×10⁸)＝3.0×10⁻⁶ T。橙の 𝐁 の波を z の向きに、𝐄 と同じ位相で
 [K+'B0']:(p,ctx)=>{
  const ph=.3*TAU*seg(p,.45,1);
  let s=emFig({ox:170,oy:300,len:520,ph,gB:seg(p,.3,.45),mark:1,dir:1}).svg;
  s+=card(760,95,420,170,T(`${tB0}=\\dfrac{900}{3.0\\times10^{8}}`,970,150,32)+T(`=${cs(BC,'3.0\\times10^{-6}\\ \\mathrm{T}')}`,970,225,32),seg(p,0,.1),BC);
  s+=fade(seg(p,.5,.6),L('電場が 山 → 磁場も 山',970,320,{size:26,color:HI,weight:700})+L('（同じ 位相）',970,360,{size:24,color:C.dim}));
  return s+goalTag(G2);
 },
 // 11. 【カット割り】①山の位置で 𝐄（+y）と 𝐁、𝐄×𝐁 が +x → ②ŷ×ẑ＝x̂ を成分で → ③𝐁 の矢印を +z に確定（黄）
 [K+'cross']:(p)=>crossScene(p),
 // 12. 小問2 の答え D
 [K+'ans2']:(p)=>crossScene(1,{final:1})+ANS2(seg(p,.05,.2)),
 // 13. 誤答 A → C（1枚ずつ）
 [K+'wrong2']:(p,ctx)=>fade(.5,triad({cx:600,cy:200,size:80,b:1,cross:1}))+wrongSeq(p,ctx,[['A','−z 向き','𝐁×𝐄 を 進む向きに した（順が 逆）'],['C','+x 向き','𝐁 も 進む向きに 直角']])+goalTag(G2)+ANS2(1),
 // 14. 誤答 B
 [K+'wrongB']:(p)=>fade(.5,triad({cx:600,cy:200,size:80,b:1,cross:1}))+wrongCard('B','2.7×10¹¹ T','E₀×c（単位 V/s）',{g:seg(p,.03,.1)})+goalTag(G2)+ANS2(1),

 // ===================== 小問3 =====================
 // 15. 波動方程式と f(x＋ct)。求めるもの：満たすか、進む向き
 [K+'goal3']:(p)=>card(200,110,800,330,T(WAVE,600,200,40,{opacity:1})+fade(seg(p,.2,.3),L('に',600,290,{size:26,color:C.dim})+T(FPLUS,600,360,52)),seg(p,0,.1))+goalTag(G3,{g:seg(p,.03,.15)}),
 // 16. u＝x＋ct と置き、f(u) と書きかえる
 [K+'u']:(p)=>{
  let s=T(FPLUS,600,150,52);
  s+=fade(seg(p,.15,.28),card(380,215,440,90,T(`u=${tx}+${tc}${tt}`,600,262,44),1,HI));
  s+=fade(seg(p,.4,.52),L('↓',600,355,{size:30,color:C.dim})+T(`f(u)`,600,430,52));
  return s+goalTag(G3);
 },
 // 17. 【カット割り】①u の倍率（x に 1、t に ＋c）→ ②∂/∂x を2回で f″、∂/∂t の1回目・2回目に「＋c」の黄の枠 → c²f″
 [K+'deriv']:(p)=>{
  const cA=1-seg(p,.27,.32),cB=seg(p,.3,.35);
  let a=card(150,110,900,330,'',1)+T(`u=${tx}+${tc}${tt}`,600,170,44);
  a+=fade(seg(p,.04,.12),L('x が 1 増える → u は 1 増える',600,270,{size:28,color:XC,weight:700}));
  a+=fade(seg(p,.12,.2),L('t が 1 増える → u は ＋c 増える',600,350,{size:28,color:VC,weight:700}));
  let s=fade(cA,a);
  let b=L('x で 2回',300,130,{size:26,color:XC,weight:700})+L('t で 2回',870,130,{size:26,color:VC,weight:700});
  b+=line(600,110,600,470,{color:C.faint,w:2});
  b+=fade(seg(p,.34,.42),T(`\\dfrac{\\partial f}{\\partial ${tx}}=f'`,300,230,38))+fade(seg(p,.42,.5),T(`\\dfrac{\\partial^2 f}{\\partial ${tx}^2}=f''`,300,350,40));
  const c=`{\\color{${HI}}\\boxed{{\\color{${VC}}+c}}}`;
  b+=fade(seg(p,.55,.63),T(`\\dfrac{\\partial f}{\\partial ${tt}}=${c}\\,f'`,870,230,38));
  b+=fade(seg(p,.7,.78),T(`\\dfrac{\\partial^2 f}{\\partial ${tt}^2}=${c}${c}\\,f''`,870,350,38));
  b+=fade(seg(p,.84,.92),T(`=${tc}^2 f''`,940,440,40));
  s+=fade(cB,b);
  return s+goalTag(G3);
 },
 // 18. 【カット割り】①方程式の左辺・右辺に何が入るか → ②代入 f″＝μ₀ε₀c²f″、c＝1/√(μ₀ε₀) から μ₀ε₀c²＝1 → 両辺が等しい
 [K+'plug']:(p)=>{
  const cA=1-seg(p,.27,.32),cB=seg(p,.3,.35);
  let a=T(WAVE,600,190,46);
  a+=fade(seg(p,.05,.13),L('↑ 左辺に f″',420,310,{size:28,color:XC,weight:700}))+fade(seg(p,.12,.2),L('↑ 右辺に c²f″',800,310,{size:28,color:VC,weight:700}));
  let s=fade(cA,a);
  let b=T(`f''=${mu}${eps}\\,${tc}^2 f''`,600,150,44);
  b+=fade(seg(p,.5,.58),T(`${tc}=\\dfrac{1}{\\sqrt{${mu}${eps}}}\\ \\Rightarrow\\ ${mu}${eps}\\,${tc}^2=1`,600,270,40));
  b+=fade(seg(p,.72,.8),T(`f''=f''`,600,385,48)+L('両辺が 等しい → 満たす',600,460,{size:28,color:HI,weight:700}));
  s+=fade(cB,b);
  return s+goalTag(G3);
 },
 // 19. f の形を t＝0（実線）と少し後（点線）で重ね、左へずれる。小問3 の答え B
 [K+'left']:(p)=>{
  let s=bumpGraph({shift:1.6*seg(p,.35,.65),later:seg(p,.3,.4)});
  s+=card(880,110,300,200,L('x＋ct ＝ 一定',1030,165,{size:28,color:C.ink,weight:700})+fade(seg(p,.1,.2),L('t が 増える',1030,225,{size:26,color:TC,weight:700})+L('→ x が 減る',1030,270,{size:26,color:XC,weight:700})),seg(p,0,.08));
  return s+goalTag(G3)+ANS3(seg(p,.8,.88));
 },
 // 20. 誤答 A → D（1枚ずつ）
 [K+'wrong3']:(p,ctx)=>fade(.5,bumpGraph({cy:320,h:150,shift:1.6}))+wrongSeq(p,ctx,[['A','満たさない','(＋c)²＝c²。符号を 誤った'],['D','速さ 2c','c を 2回 掛けても、速さは c']])+goalTag(G3)+ANS3(1),
 // 21. 誤答 C → 最後に f(x−ct)（右へ）と f(x＋ct)（左へ）を並べ、答えの札3枚
 [K+'last']:(p,ctx)=>{
  const ve=voiceEnd(ctx),gc=seg(p,.02,.06)*(1-seg(p,ve+.01,ve+.05)),gf=seg(p,ve+.04,ve+.1);
  let s=fade(gc,fade(.5,bumpGraph({cy:320,h:150,shift:1.6}))+wrongCard('C','右へ 進む','x＋ct＝一定なら、x は 減る'));
  s+=fade(gf,card(40,100,550,400,T(`f(${tx}-${tc}${tt})`,315,160,40)+bumpGraph({x0:70,w:470,cy:430,h:150,shift:1.4,right:1})),1);
  s+=fade(gf,card(610,100,550,400,T(FPLUS,885,160,40)+bumpGraph({x0:640,w:470,cy:430,h:150,shift:1.4})));
  s+=fade(gc,goalTag(G3)+ANS3(1));
  return s+answerRow([[1,'B','2.8×10¹²'],[2,'D','+z'],[3,'B','左へ']],{g:seg(p,ve+.12,ve+.2)});
 },
};

// 行11・12：3つの向き（x 右、y 上、z 手前）の矢印
function triad({cx=600,cy=280,size=110,e=1,b=1,cross=0,bHi=0,g=1}={}){
 const P=proj({ox:cx,oy:cy});let s='';
 s+=fade(e,arrow(cx,cy,...P(0,size,0),{color:EC,w:7,head:18})+label('𝐄（+y）',P(0,size,0)[0]+14,P(0,size,0)[1],{size:28,color:EC,weight:700}));
 s+=fade(b,arrow(cx,cy,...P(0,0,size*1.1),{color:bHi?HI:BC,w:7+3*bHi,head:18})+label('𝐁（+z、手前）',P(0,0,size*1.1)[0]-14,P(0,0,size*1.1)[1]+30,{size:28,color:bHi?HI:BC,anchor:'end',weight:700}));
 s+=fade(cross,arrow(cx,cy,...P(size*1.4,0,0),{color:VC,w:7,head:18})+label('𝐄×𝐁（+x）',P(size*1.4,0,0)[0]+12,P(size*1.4,0,0)[1]+10,{size:28,color:VC,weight:700}));
 return fade(g,s);
}
function crossScene(p,{final=0}={}){
 const cA=final?0:1-seg(p,.32,.37),cB=final?0:seg(p,.35,.4)*(1-seg(p,.72,.77)),cC=final?1:seg(p,.75,.8);
 let s='';
 // ① 図で意味：山の位置の 𝐄 と、進む向き。𝐄×𝐁 が +x を向くように 𝐁 を選ぶ
 s+=fade(cA,triad({e:1,b:seg(p,.12,.22),cross:seg(p,.05,.12)})+L('進む 向き ＝ 𝐄×𝐁 の 向き',600,470,{size:28,color:VC,weight:700}));
 // ② 図を消して成分で一段ずつ
 let b=L('成分で 外積',600,120,{size:26,color:C.dim});
 b+=T(`\\hat{y}\\times\\hat{z}=(0,1,0)\\times(0,0,1)`,600,200,40);
 b+=fade(seg(p,.47,.55),T(`=(1\\cdot1-0\\cdot0,\\ 0\\cdot0-0\\cdot1,\\ 0\\cdot0-1\\cdot0)`,600,300,36));
 b+=fade(seg(p,.58,.66),T(`=(1,0,0)=\\hat{x}`,600,400,44));
 s+=fade(cB,b);
 // ③ 図に戻り、𝐁 を +z に確定（黄）
 s+=fade(cC,triad({e:1,b:1,cross:1,bHi:1}));
 return s+goalTag(G2);
}
