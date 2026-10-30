// 問題編 解説「円形コイル、直線の欠片、長いコイル」（q-ue-ampere、大学編 26 アンペールの法則・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/26_アンペールの法則.md の q-ue-ampere（解説 21 行）。
// 色（上級の単元動画 yt1-ue-ampere-1/2/3 と同じ）：𝐁・d𝐁 橙、電流 I・欠片 d𝐥 緑、𝐫̂ 桃、距離 R・r・s 白、一歩 d𝐫 金、強調 黄、誤り 赤。
// 向き：円形コイルは反時計回り → 中心の d𝐁 は ⊙。直線の電流は右向き。コイルの断面は上の列 ⊙・下の列 ⊗、内側の 𝐁 は右向き、長方形は反時計回り。
// 円形コイルの部品は 上級の単元動画 1/3（yt1-ue-ampere-1-diagrams.mjs）から import して使う（あちらは編集しない）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {CB,CI,RH,cs,outSym,inSym,head,ringWire,ringPiece,rpt,tanv,inv,rightMark,bOut} from './yt1-ue-ampere-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,textW,sentWin,cueT,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-ue-ampere:';
const RAD=Math.PI/180,BAD='#ff6b6b',DC=C.t,INK=C.ink,DIM=C.dim,HI=C.hi;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const Bv=cs(CB,'\\mathbf{B}'),Bs=cs(CB,'B'),dBs=cs(CB,'dB'),dl=cs(CI,'d\\mathbf{l}'),rh=cs(RH,'\\hat{\\mathbf{r}}'),Ic=cs(CI,'I'),dr=cs(DC,'d\\mathbf{r}');
const G1='中心の磁場の強さ',G2='左右 √3 r 以内の割合',G3='コイルの中の磁場 B';
const A1=g=>answerTag(1,'C','6.3×10⁻⁴ T',{g}),A2=g=>answerTag(2,'B','約 87％',{g}),A3=g=>answerTag(3,'D','1.9×10⁻³ T',{g});
// 右の枠
const PX=650,PW=530,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WR={x:PX,w:PW,size:26,whySize:22};

// ===================== 小問1：円形コイル =====================
const O1={x:300,y:290},R1=150;
function coilFig({g=1,labs=1,rLine=1}={}){
 let s=ringWire({c:O1,R:R1,lab:0})+dot(O1.x,O1.y,6,DIM);
 if(rLine){const [x,y]=rpt(-30,O1,R1);s+=line(O1.x,O1.y,x,y,{color:INK,w:2.5,dash:'9 7'})+label('R＝0.10 m',O1.x-10,O1.y+60,{size:26,color:INK,anchor:'middle',weight:700});}
 if(labs)s+=label('50 巻き',O1.x-R1-10,O1.y-R1+6,{size:28,color:CI,anchor:'middle',weight:700})+label('2.0 A',O1.x+R1*.72+16,O1.y-R1*.72-14,{size:28,color:CI,weight:700});
 return fade(g,s);
}
// 欠片 a（度）での d𝐥（緑）、𝐫̂（桃）、直角の印（黄）
function pieceAt(a,{g=1,mark=1,lab=0}={}){
 const [x,y]=rpt(a,O1,R1),[tx,ty]=tanv(a),[rx,ry]=inv(a);
 let s=arrow(x-tx*30,y-ty*30,x+tx*30,y+ty*30,{color:CI,w:7,head:15})+arrow(x,y,x+rx*70,y+ry*70,{color:RH,w:4.5,head:13});
 if(mark)s+=rightMark(x,y,[tx,ty],[rx,ry],{s:14,color:HI});
 if(lab)s+=T(dl,x+tx*30+24,y+ty*30-6,28)+T(rh,x+rx*70+20,y+ry*70+24,28);
 return fade(g,s);
}
const BS1=`${dBs}=\\dfrac{\\mu_0${Ic}}{4\\pi}\\cdot\\dfrac{|${dl}\\times${rh}|}{R^2}`;

// ===================== 小問2：直線の欠片 =====================
const W2={y:200,x0:330,u:80,P:120};   // 1 r ＝ 80 px、P は (x0, 120)
const X2=k=>W2.x0+k*W2.u,S3=Math.sqrt(3);
const fcon=u=>Math.pow(1+u*u,-1.5);
const GY=470,GH=190,G2X=u=>X2(u),G2Y=v=>GY-GH*v;
function wire2({g=1,ticks=1}={}){
 let s=arrow(40,W2.y,630,W2.y,{color:CI,w:5,head:18})+label('I',612,W2.y-14,{size:28,color:CI,weight:700});
 s+=dot(W2.x0,W2.P,8,INK)+label('P',W2.x0-16,W2.P-12,{size:30,color:INK,anchor:'end',weight:700});
 s+=line(W2.x0,W2.P,W2.x0,W2.y,{color:INK,w:2.5,dash:'9 7'})+label('r',W2.x0+10,(W2.P+W2.y)/2+10,{size:30,color:INK,weight:700})+rightMark(W2.x0,W2.y,[1,0],[0,-1],{s:12});
 s+=line(W2.x0,W2.y+6,W2.x0,W2.y+16,{color:DIM,w:2})+label('x＝0',W2.x0,W2.y+44,{size:24,color:DIM,anchor:'middle'});
 if(ticks)for(const [k,t] of [[-S3,'−√3 r'],[S3,'√3 r']])s+=fade(ticks,line(X2(k),W2.y-10,X2(k),W2.y+10,{color:INK,w:3})+label(t,X2(k),W2.y+44,{size:24,color:INK,anchor:'middle',weight:700}));
 return fade(g,s);
}
function graph2({g=1,whole=0,mid=0}={}){
 let s=line(40,GY,630,GY,{color:DIM,w:2.5})+line(W2.x0,GY,W2.x0,GY-GH-20,{color:DIM,w:1.5,dash:'4 6'});
 const pts=k0=>{const a=[];for(let i=0;i<=120;i++){const u=-3.6+7.2*i/120;a.push([G2X(u),G2Y(fcon(u))]);}return a;};
 const area=(a,b)=>{const q=[[G2X(a),GY]];for(let i=0;i<=60;i++){const u=a+(b-a)*i/60;q.push([G2X(u),G2Y(fcon(u))]);}q.push([G2X(b),GY]);return q;};
 if(whole>0)s+=fade(whole,poly(area(-3.6,3.6),{fill:CB,fo:.18}));
 if(mid>0)s+=fade(mid,poly(area(-S3,S3),{fill:HI,fo:.35}));
 s+=draw(pts(),1,{color:CB,w:4.5});
 s+=label('欠片の 寄与 dB',50,GY-GH+20,{size:24,color:CB,weight:700});
 for(const k of [-S3,S3])s+=line(G2X(k),GY-6,G2X(k),GY+6,{color:DIM,w:2});
 return fade(g,s);
}
// 端の欠片（x＝√3 r）から P への線と直角三角形
function tri2({g=1,hyp='2r',hypBad=0,ang30=0,ang60=0,side=1}={}){
 const ex=X2(S3);
 let s=poly([[W2.x0,W2.y],[ex,W2.y],[W2.x0,W2.P]],{fill:HI,fo:.06,stroke:'none'});
 s+=line(ex,W2.y,W2.x0,W2.P,{color:INK,w:3});
 s+=rect(ex-26,W2.y-12,52,24,{fill:HI,fo:.15,stroke:HI,sw:2,rx:6});
 
 const mx=(ex+W2.x0)/2,my=(W2.y+W2.P)/2;
 if(hyp)s+=label(`s＝${hyp}`,mx+18,my-16,{size:28,color:hypBad?BAD:HI,weight:700});
 if(ang30>0){let a1=Math.atan2(W2.P-W2.y,W2.x0-ex);if(a1<0)a1+=2*Math.PI;const p=Array.from({length:21},(_,i)=>{const a=Math.PI+(a1-Math.PI)*0+ (a1-Math.PI)*i/20;return [ex+46*Math.cos(Math.PI+(a1-Math.PI)*i/20),W2.y+46*Math.sin(Math.PI+(a1-Math.PI)*i/20)];});
  s+=fade(ang30,draw(p,1,{color:CB,w:3.5})+label('30°',ex-50,W2.y-8,{size:22,color:CB,anchor:'end',weight:700})+label('導線（基準）',565,W2.y+44,{size:22,color:DIM,anchor:'middle'}));}
 if(ang60>0){const a0=Math.PI/2,a1=Math.atan2(W2.y-W2.P,ex-W2.x0);const p=Array.from({length:21},(_,i)=>{const a=a0+(a1-a0)*i/20;return [W2.x0+44*Math.cos(a),W2.P+44*Math.sin(a)];});
  s+=fade(ang60,draw(p,1,{color:CB,w:3.5})+label('60°',W2.x0+20,W2.P+62,{size:22,color:CB,weight:700}));}
 return fade(g,s);
}

// ===================== 小問3：長いコイルの断面 =====================
const TY=170,BY=400,AY=285,NW=13,wx=i=>70+i*45;
const RX0=235,RX1=415,RB=240,RT=95;
function rows3({g=1,hl=0,dimBot=0}={}){
 let s=line(40,AY,640,AY,{color:DIM,w:2,dash:'10 8'})+label('軸',650,AY+8,{size:22,color:DIM});
 for(let i=0;i<NW;i++)s+=outSym(wx(i),TY,14,CI)+fade(1-.6*dimBot,inSym(wx(i),BY,14,CI));
 const inside=[...Array(NW).keys()].filter(i=>wx(i)>RX0&&wx(i)<RX1);
 if(hl>0)inside.forEach((i,k)=>{s+=fade(clamp(hl*inside.length-k),ring(wx(i),TY,24,{color:HI,w:3.5}));});
 return fade(g,s);
}
function rect3({g=1,hlBot=0,zero=0,dashBad=0}={}){
 const sides=[[[RX0,RB],[RX1,RB]],[[RX1,RB],[RX1,RT]],[[RX1,RT],[RX0,RT]],[[RX0,RT],[RX0,RB]]];
 let s='';
 sides.forEach(([a,b],i)=>{s+=line(a[0],a[1],b[0],b[1],{color:i===0&&hlBot?CB:INK,w:i===0&&hlBot?7:3.5});
  const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;s+=head(mx+(b[0]-a[0])*.05,my+(b[1]-a[1])*.05,b[0]-a[0],b[1]-a[1],{color:i===0&&hlBot?CB:INK,L:16});});
 if(zero>0)s+=fade(zero,label('0',RX0+16,RT+30,{size:28,color:HI,anchor:'middle',weight:700})+label('0',RX1+12,RT+52,{size:28,color:HI,weight:700})+label('0',RX0-12,RT+52,{size:28,color:HI,anchor:'end',weight:700}));
 return fade(g,s);
}
const labs3=(g=1)=>fade(g,label('500 巻/m',630,TY-30,{size:26,color:CI,anchor:'end',weight:700})+label('3.0 A',650,BY+48,{size:26,color:CI,anchor:'end',weight:700})
 +label('L＝4.0 cm',(RX0+RX1)/2,RB+34,{size:24,color:INK,anchor:'middle',weight:700}));
const LAW3=`\\oint ${Bv}\\cdot${dr}=\\mu_0${Ic}`;

export const ytQxUeAmpereDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約7秒）：0〜2 s 前半（円形コイル、電流の矢印が一周）、2〜4 s 中盤（導線、P、x＝0、r、±√3 r）、4〜7 s 後半（コイルの断面と長方形の輪）。静止。
 //   d𝐁 の重なり・寄与のグラフ・角度・各辺の寄与・前提のカードは出さない。
 [K+'q0']:(p)=>{
  const gA=seg(p,0,.1),gB=seg(p,.29,.38),gC=seg(p,.57,.66);
  let s='';
  // 前半
  const c={x:190,y:310},R=105;
  let a=ringWire({c,R,lab:0})+dot(c.x,c.y,5,DIM);
  const u=seg(p,.05,.27);
  if(u>0&&u<1){const d=-90+360*u,[x,y]=rpt(d,c,R),[tx,ty]=tanv(d);a+=head(x+tx*14,y+ty*14,tx,ty,{color:INK,L:28});}
  const [rx,ry]=rpt(-35,c,R);
  a+=line(c.x,c.y,rx,ry,{color:INK,w:2.5,dash:'8 6'})+label('R＝0.10 m',c.x,c.y+R+44,{size:24,color:INK,anchor:'middle',weight:700});
  a+=label('50 巻き',c.x-R+10,c.y-R-16,{size:24,color:CI,anchor:'middle',weight:700})+label('2.0 A',c.x+R*.7+10,c.y-R*.7-12,{size:24,color:CI,weight:700});
  s+=fade(gA,label('前半',c.x,115,{size:26,color:DIM,anchor:'middle',weight:700})+a);
  // 中盤
  const wy=330,x0=580,ru=62,py=wy-ru;
  let b=arrow(380,wy,790,wy,{color:CI,w:5,head:16})+dot(x0,py,7,INK)+label('P',x0-14,py-10,{size:28,color:INK,anchor:'end',weight:700})
   +line(x0,py,x0,wy,{color:INK,w:2.5,dash:'8 6'})+label('r',x0+10,(py+wy)/2+10,{size:26,color:INK,weight:700})
   +label('x＝0',x0,wy+40,{size:22,color:DIM,anchor:'middle'});
  for(const [k,t] of [[-S3,'−√3 r'],[S3,'√3 r']])b+=line(x0+k*ru,wy-9,x0+k*ru,wy+9,{color:INK,w:3})+label(t,x0+k*ru,wy+40,{size:22,color:INK,anchor:'middle',weight:700});
  s+=fade(gB,label('中盤',x0,115,{size:26,color:DIM,anchor:'middle',weight:700})+b);
  // 後半
  const cx0=850,dx=38,ty=225,by=430,rx0=905,rx1=1060,rb=290,rt=170;
  let d='';
  for(let i=0;i<9;i++)d+=outSym(cx0+i*dx,ty,12,CI)+inSym(cx0+i*dx,by,12,CI);
  d+=draw([[rx0,rb],[rx1,rb],[rx1,rt],[rx0,rt],[rx0,rb]],1,{color:INK,w:3});
  d+=label('L＝4.0 cm',(rx0+rx1)/2,rb+32,{size:22,color:INK,anchor:'middle',weight:700});
  d+=label('500 巻/m',1165,by+44,{size:24,color:CI,anchor:'end',weight:700})+label('3.0 A',1165,by+76,{size:24,color:CI,anchor:'end',weight:700});
  s+=fade(gC,label('後半（巻き線の 断面）',1000,115,{size:26,color:DIM,anchor:'middle',weight:700})+d);
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 円形コイル（緑）
 [K+'goal1']:(p)=>coilFig({g:seg(p,.03,.15)})+goalTag(G1,{g:seg(p,.03,.12)}),
 // 2. 先に図の上に記号：欠片 d𝐥・𝐫̂・R。そのあと「法則」タグと dB＝(μ₀I/4π)·|d𝐥×𝐫̂|/R²
 [K+'law']:(p)=>{
  let s=coilFig({labs:0})+pieceAt(60,{g:seg(p,.05,.18),mark:0,lab:1});
  s+=panel(95,390,fade(seg(p,.08,.2),label('d𝐥＝電流の欠片',PX+24,145,{size:26,color:CI,weight:700})+label('（向きは電流の向き）',PX+24,180,{size:24,color:CI}))
   +fade(seg(p,.2,.32),label('𝐫̂＝中心へ向く 長さ1の 矢印',PX+24,228,{size:26,color:RH,weight:700}))
   +fade(seg(p,.3,.4),line(PX+20,262,PX+PW-20,262,{color:C.faint,w:2}))
   +kindTag('法則',PX+70,300,{g:seg(p,.42,.52)})+fade(seg(p,.5,.62),T(BS1,PC,400,40)),1);
  s+=goalTag(G1);
  return s;
 },
 // 3. 欠片ごとに中心へ向く 𝐫̂（桃）と直角の印（黄）。中心に橙の ⊙ を1つずつ重ねる
 [K+'same']:(p)=>{
  const angs=[60,150,240,330,15,105,195,285];
  let s=coilFig({labs:0,rLine:1});
  let k=0;angs.forEach((a,i)=>{const g=seg(p,.05+i*.08,.1+i*.08);if(g>.5)k++;s+=pieceAt(a,{g:g*(i===0?1:.9)});});
  if(k>0)s+=bOut(O1.x,O1.y,14+2*Math.min(k,8),1);
  s+=fade(seg(p,.72,.82),panel(150,120,label('d𝐁 は すべて ⊙（手前）',PC,222,{size:28,color:CB,anchor:'middle',weight:700}),1,CB));
  s+=goalTag(G1);
  return s;
 },
 // 4. ∫dl＝2πR（黄）→ 約分（2π と 4π、R と R²）に打ち消し線 → μ₀I/(2R) の前に ×50（図を消して式）
 [K+'sum1']:(p)=>{
  let s=card(100,90,1000,400,'',1);
  s+=fade(seg(p,.02,.1),label('足し合わせ',420,198,{size:24,color:DIM,anchor:'end'}));
  s+=fade(seg(p,.05,.15),T(`\\int dl={\\color{${HI}}2\\pi R}`,600,190,40));
  const c1=seg(p,.4,.45),c2=seg(p,.5,.55);
  const X=(a,c)=>c>.5?`{\\color{${C.a}}\\cancel{\\color{${INK}}${a}}}`:`{${a}}`;
  s+=fade(seg(p,.2,.3),T(`${Bs}=\\dfrac{\\mu_0${Ic}}{${X('4\\pi',c1)}${X('R^2',c2)}}\\times{\\color{${HI}}${X('2\\pi',c1)}${X('R',c2)}}`,600,300,44));
  s+=fade(seg(p,.6,.68),T(`=\\dfrac{\\mu_0${Ic}}{2R}`,600,410,44));
  s+=fade(seg(p,.78,.86),label('×50',800,422,{size:40,color:HI,weight:700})+label('（50 巻き）',800,462,{size:24,color:HI}));
  s+=goalTag(G1);
  return s;
 },
 // 5. 計算を一行 → ≈6.3×10⁻⁴ T。小問1 の答え C
 [K+'calc1']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=card(100,90,1000,400,'',1);
  s+=T(`${Bs}=50\\times\\dfrac{\\mu_0${Ic}}{2R}`,600,170,44);
  s+=fade(seg(p,.05,.15),T(`=50\\times4\\pi\\times10^{-7}\\times2.0\\div0.20`,600,290,42));
  s+=fade(seg(p,.4,.5),T(`\\approx6.3\\times10^{-4}\\ \\mathrm{T}`,600,400,46,{color:HI}));
  s+=goalTag(G1)+A1(seg(p,ve*.68,ve*.76));
  return s;
 },
 // 6. 誤答 A：直線電流の式。2つの値を並べ「×π」
 [K+'wrong1A']:(p)=>{
  let s=card(100,90,1000,210,'',1);
  s+=label('直線電流の 式',330,140,{size:24,color:DIM,anchor:'middle'})+label('円の 中心',870,140,{size:24,color:DIM,anchor:'middle'});
  s+=T(`2.0\\times10^{-4}\\ \\mathrm{T}`,330,225,40)+T(`6.3\\times10^{-4}\\ \\mathrm{T}`,870,225,40,{color:HI});
  s+=fade(seg(p,.3,.42),arrow(500,215,690,215,{color:HI,w:4,head:16})+label('×π',595,195,{size:34,color:HI,anchor:'middle',weight:700}));
  s+=wrongCard('A','2.0×10⁻⁴ T','直線電流の式を使った（円では π 倍）',{x:150,w:900,y:330,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7. 誤答 B → 誤答 D
 [K+'wrong1BD']:(p,ctx)=>{
  let s=coilFig({labs:1});
  s+=wrongSeq(p,ctx,[['B','1.3×10⁻⁵ T','50 巻きを掛けていない'],['D','6.3×10⁻³ T','分母を 2R² にした（単位 T/m）']],{opts:{...WR,y:150}});
  s+=goalTag(G1)+A1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 8. 導線、点 P、x＝0、±√3 r の目盛り
 [K+'goal2']:(p)=>wire2({g:seg(p,.03,.15)})+goalTag(G2,{g:seg(p,.03,.12)}),
 // 9. 寄与 dB のグラフ（x＝0 で最大の山）。F(x)＝x/(r²s)、F(∞)＝1/r²、F(−∞)＝−1/r²、差 2/r²。山の下全体を薄い橙
 [K+'whole']:(p)=>{
  let s=wire2()+graph2({g:seg(p,.03,.15),whole:seg(p,.75,.85)});
  s+=panel(95,390,label('原始関数',PX+24,140,{size:24,color:DIM})+T(`F(x)=\\dfrac{x}{r^2 s}`,PC,200,40)
   +fade(seg(p,.3,.4),T(`F(\\infty)=\\dfrac{1}{r^2}`,PC-120,290,34))+fade(seg(p,.42,.52),T(`F(-\\infty)=-\\dfrac{1}{r^2}`,PC+120,290,34))
   +fade(seg(p,.6,.7),label('全体',PX+24,400,{size:24,color:CB,weight:700})+T(`F(\\infty)-F(-\\infty)=\\dfrac{2}{r^2}`,PC+30,400,36,{color:CB})),seg(p,.1,.2));
  s+=goalTag(G2);
  return s;
 },
 // 10. 端の欠片から P へ白の線、直角三角形（底辺 √3 r、高さ r）。斜辺に「s＝2r」。導線との角 30°
 [K+'edge']:(p)=>{
  let s=wire2()+graph2({whole:.6})+tri2({g:seg(p,.05,.2),hyp:seg(p,.6,.7)>0?'2r':'',ang30:seg(p,.75,.85)});
  s+=panel(95,250,label('端 x＝√3 r の 欠片から P まで',PC,145,{size:24,color:DIM,anchor:'middle'})
   +fade(seg(p,.25,.4),T(`s=\\sqrt{3r^2+r^2}`,PC-60,240,40))+fade(seg(p,.5,.6),T(`=2r`,PC+150,240,40,{color:HI})),1);
  s+=goalTag(G2);
  return s;
 },
 // 11. F の式に x＝√3 r と s＝2r を一つずつ入れる。左端の −√3 r に「−√3/(2r²)」
 [K+'fval']:(p)=>{
  let s=wire2()+graph2({whole:.6})+tri2({ang30:1});
  s+=panel(95,390,T(`F(\\sqrt3\\,r)=\\dfrac{\\sqrt3\\,r}{r^2\\times2r}`,PC,180,38)
   +fade(seg(p,.25,.35),T(`=\\dfrac{\\sqrt3}{2r^2}`,PC,290,40,{color:HI}))
   +fade(seg(p,.6,.7),label('x＝−√3 r',PX+30,410,{size:26,color:INK,weight:700})+T(`-\\dfrac{\\sqrt3}{2r^2}`,PC+90,400,36)),1);
  s+=fade(seg(p,.6,.7),label('−√3/(2r²)',X2(-S3),W2.y-24,{size:24,color:HI,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 12. −√3 r〜√3 r の範囲を黄で塗り「87％」。P で 60°、√3/2＝sin60°。小問2 の答え B
 [K+'ratio']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=wire2()+graph2({whole:.5,mid:seg(p,.3,.42)})+tri2({ang30:0,ang60:seg(p,.5,.6),hyp:'2r'});
  s+=fade(seg(p,.4,.5),label('87％',W2.x0,GY-40,{size:34,color:INK,anchor:'middle',weight:700}));
  s+=panel(95,390,label('差',PX+24,145,{size:24,color:DIM})+T(`\\dfrac{\\sqrt3}{r^2}\\div\\dfrac{2}{r^2}=\\dfrac{\\sqrt3}{2}\\approx0.87`,PC,200,38)
   +fade(seg(p,.55,.65),line(PX+20,290,PX+PW-20,290,{color:C.faint,w:2})+T(`\\dfrac{\\sqrt3}{2}=\\sin60^\\circ`,PC,370,40,{color:CB})),1);
  s+=goalTag(G2)+A2(seg(p,ve*.72,ve*.8));
  return s;
 },
 // 13. 誤答 A → 誤答 D
 [K+'wrong2AD']:(p,ctx)=>{
  let s=wire2()+graph2({whole:.5,mid:1})+label('87％',W2.x0,GY-40,{size:34,color:INK,anchor:'middle',weight:700});
  s+=wrongSeq(p,ctx,[['A','約 71％','動画の例（左右 r 以内）の値'],['D','約 50％','F の差を計算していない']],{opts:{...WR,y:150}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 14. 誤答 C：斜辺に「√3 r」と書いた誤りに赤い ×、「2r」を黄で残す
 [K+'wrong2C']:(p)=>{
  let s=wire2()+graph2({whole:.5,mid:1})+tri2({hyp:'2r'});
  const ex=X2(S3),mx=(ex+W2.x0)/2,my=(W2.y+W2.P)/2,g=seg(p,.05,.15);
  s+=fade(g,label('s＝√3 r',mx+18,my-50,{size:28,color:BAD,weight:700})+line(mx+14,my-74,mx+124,my-44,{color:BAD,w:4})+line(mx+14,my-44,mx+124,my-74,{color:BAD,w:4}));
  s+=wrongCard('C','約 100％','s を √3 r とした（正しくは 2r）',{...WR,y:150,g:seg(p,.05,.12)});
  s+=goalTag(G2)+A2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 15. コイルの断面と長方形の輪
 [K+'goal3']:(p)=>rows3({g:seg(p,.03,.15)})+rect3({g:seg(p,.1,.22)})+labs3(seg(p,.1,.22))+goalTag(G3,{g:seg(p,.03,.12)}),
 // 16. 「法則」タグと ∮𝐁·d𝐫＝μ₀I。下の辺を橙で光らせ「BL」
 [K+'law3']:(p)=>{
  const g=seg(p,.45,.55);
  let s=rows3()+rect3({hlBot:g})+labs3();
  s+=fade(g,label('BL',RX0-12,RB+10,{size:30,color:CB,anchor:'end',weight:700}));
  s+=fade(seg(p,.2,.3),label('下の辺（中）',RX1+20,RB+6,{size:22,color:DIM})+label('上の辺（外）',RX1+20,RT+8,{size:22,color:DIM}));
  s+=panel(95,200,kindTag('法則',PC,140,{g:seg(p,.03,.12)})+fade(seg(p,.05,.15),T(LAW3,PC,215,44)),1);
  s+=goalTag(G3);
  return s;
 },
 // 17. 「近似」タグ「外側はほぼ 0」。上の辺・左右の辺に「0」
 [K+'zero3']:(p)=>{
  let s=rows3()+rect3({hlBot:1,zero:seg(p,.3,.5)})+labs3();
  s+=label('BL',RX0-12,RB+10,{size:30,color:CB,anchor:'end',weight:700});
  s+=panel(95,200,kindTag('近似',PC,140,{g:seg(p,.03,.12),text:'外側はほぼ 0'})+fade(seg(p,.55,.65),label('左右の辺：一歩 ⟂ 𝐁 か B≈0',PC,220,{size:24,color:INK,anchor:'middle',weight:700})),1);
  s+=goalTag(G3);
  return s;
 },
 // 18. 長方形の中を通る ⊙ の導線を一本ずつ光らせ「nL 本」。式 BL＝μ₀nLI
 [K+'current3']:(p)=>{
  let s=rows3({hl:seg(p,.05,.35)})+rect3({hlBot:1,zero:1})+labs3();
  s+=fade(seg(p,.35,.45),label('nL 本',(RX0+RX1)/2,TY+56,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=panel(95,200,label('貫く 電流 ＝ nL × I',PC,150,{size:26,color:INK,anchor:'middle',weight:700})+fade(seg(p,.55,.65),T(`${Bs}L=\\mu_0 n L${Ic}`,PC,225,44)),1);
  s+=goalTag(G3);
  return s;
 },
 // 19. 「前提」のカード → 両辺の L に打ち消し線 → 4π×10⁻⁷×500×3.0≈1.9×10⁻³ T。小問3 の答え D（図を消して式）
 [K+'result3']:(p,ctx)=>{
  const ve=voiceEnd(ctx),cn=seg(p,.25,.3)>.5;
  const Lx=cn?`{\\color{${C.a}}\\cancel{\\color{${INK}}L}}`:'L';
  let s=card(80,90,1040,120,kindTag('前提',170,150,{})+label('中央付近：内側の 𝐁 は軸に平行で一定、',650,140,{size:26,color:INK,anchor:'middle',weight:700})
   +label('外側はほぼ 0（近似）',650,180,{size:26,color:INK,anchor:'middle',weight:700}),seg(p,.02,.1),DIM);
  s+=fade(seg(p,.15,.22),T(`${Bs}${Lx}=\\mu_0 n ${Lx}${Ic}`,600,275,44));
  s+=fade(seg(p,.35,.45),T(`${Bs}=\\mu_0 n${Ic}=4\\pi\\times10^{-7}\\times500\\times3.0`,600,360,40));
  s+=fade(seg(p,.5,.58),T(`\\approx1.9\\times10^{-3}\\ \\mathrm{T}`,600,445,44,{color:HI}));
  s+=goalTag(G3)+A3(seg(p,ve*.75,ve*.83));
  return s;
 },
 // 20. BL＝7.5×10⁻⁵ T·m と B＝1.9×10⁻³ T を並べ、単位 T·m（赤）と T（黄）を色で比べる。誤答 A
 [K+'wrong3A']:(p)=>{
  let s=card(100,90,1000,210,'',1);
  s+=T(`${Bs}L=7.5\\times10^{-5}\\ {\\color{${BAD}}\\mathrm{T\\cdot m}}`,330,190,38)+T(`${Bs}=1.9\\times10^{-3}\\ {\\color{${HI}}\\mathrm{T}}`,870,190,38);
  s+=fade(seg(p,.3,.4),label('単位',600,265,{size:26,color:DIM,anchor:'middle'})+label('T·m',490,265,{size:28,color:BAD,anchor:'middle',weight:700})+label('T',710,265,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=wrongCard('A','7.5×10⁻⁵ T','BL を L で割っていない（単位 T·m）',{x:150,w:900,y:330,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 21. 誤答 B → 誤答 C（C の間、上下の列をまたぐ長方形を赤の破線で）。最後にビオ・サバールとアンペールの2枚のカード、答えの札3枚
 [K+'wrong3BC']:(p,ctx)=>{
  const ve=voiceEnd(ctx),inC=seg(p,ve*.5,ve*.55),end=seg(p,ve+.02,ve+.08);
  let s=fade(1-end,rows3()+rect3({hlBot:1})+labs3()
   +fade(inC,draw([[120,BY+40],[360,BY+40],[360,TY-40],[120,TY-40],[120,BY+40]],1,{color:BAD,w:3,dash:'10 8'}))
   +wrongSeq(p,ctx,[['B','9.4×10⁻⁴ T','外の上の辺も BL と数えた（2BL）'],['C','0 T','上下の列をまたぐ長方形にした']],{win:[[0,ve*.5],[ve*.5,1]],opts:{...WR,y:150}})
   +goalTag(G3));
  const sc=(x,title,tx,sub)=>card(x,100,520,330,label(title,x+260,150,{size:28,color:INK,anchor:'middle',weight:700})+T(tx,x+260,270,38)+label(sub,x+260,385,{size:24,color:DIM,anchor:'middle'}),end);
  s+=sc(50,'ビオ・サバール',`${dBs}=\\dfrac{\\mu_0${Ic}}{4\\pi}\\cdot\\dfrac{|${dl}\\times${rh}|}{r^2}`,'欠片を 足す');
  s+=sc(630,'アンペール',LAW3,'対称な 道で 一周');
  s+=answerRow([[1,'C','6.3×10⁻⁴ T'],[2,'B','約 87％'],[3,'D','1.9×10⁻³ T']],{g:seg(p,ve+.08,ve+.14),size:22});
  s+=fade(1-end,A3(1));
  return s;
 },
};
