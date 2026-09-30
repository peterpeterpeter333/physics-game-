// YouTube シリーズ「コンデンサ・中級 1/2」(ys-um-capacitance-1) — 図。Stage 1200×515.
// 板は横から見た図（縦の棒）。左の板＝＋Q（電池の＋極側）、右の板＝−Q。電場 𝐄 は＋の板 → −の板（右向き）。
// 部品は export して 2/2 でも使う（関数・文字列の export は図の登録に入らない）。
// 色：電場 𝐄 水色、電位・電圧 V 紫、電荷 Q・面密度 σ 桃（図の正電荷 赤、電子・負電荷 青）、面積 S 金、容量 C 黄、ε₀・d 白、強調 黄、誤り 赤。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,highlight} from './anim.mjs';

const K='um-capacitance-1:';
export const POS=C.a,NEG='#7fb3ff',EC=C.x,QC=C.p,VC=C.v,CC=C.hi,SC=C.t,WC=C.E,NG=C.a;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
// TeX pieces
export const sig=cs(QC,'\\sigma'),Qt=cs(QC,'Q'),St=cs(SC,'S'),Et=cs(EC,'E'),vE=cs(EC,'\\mathbf{E}'),Vt=cs(VC,'V'),Ct=cs(CC,'C');
export const eps='\\varepsilon_0';
export const HALF=`\\dfrac{${sig}}{2${eps}}`,FULL=`\\dfrac{${sig}}{${eps}}`,QES=`\\dfrac{${Qt}}{${eps}${St}}`;
export const U=s=>`\\,\\mathrm{${s}}`;

// ---- plates seen edge-on ------------------------------------------------------------------------
export const G={LX:400,RX:620,PW:22,PT:95,PB:405};
export const plus=(x,y,{op=1,size=24}={})=>fade(op,label('＋',x,y+size*.36,{size,color:POS,anchor:'middle',weight:700}));
export const minus=(x,y,{op=1,size=26}={})=>fade(op,label('−',x,y+size*.36,{size,color:NEG,anchor:'middle',weight:700}));
export function plate(x,pt,pb,{w=G.PW,sign=0,n=7,g=1,cop=1}={}){
 let s=rect(x,pt,w,pb-pt,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3});
 if(sign)for(let i=0;i<n;i++){const y=pt+(pb-pt)*(i+.5)/n;s+=sign>0?plus(x+w/2,y,{op:cop}):minus(x+w/2,y,{op:cop});}
 return fade(g,s);
}
export function plates({g=1,lx=G.LX,rx=G.RX,pt=G.PT,pb=G.PB,n=7,left=1,right=1,cop=1,qlab=0,lq='+Q',rq='-Q'}={}){
 let s=fade(left,plate(lx-G.PW,pt,pb,{sign:1,n,cop}))+fade(right,plate(rx,pt,pb,{sign:-1,n,cop}));
 if(qlab)s+=fade(qlab*left,T(cs(POS,lq),lx-G.PW-44,(pt+pb)/2,{size:36}))+fade(qlab*right,T(cs(NEG,rq),rx+G.PW+46,(pt+pb)/2,{size:36}));
 return fade(g,s);
}
// uniform field arrows between the plates (strength scales the arrow length)
export function fieldIn({g=1,lx=G.LX,rx=G.RX,rows=[140,210,280,350],k=1,w=4,color=EC}={}){
 if(g<=.001)return '';
 const m=(lx+rx)/2,half=(rx-lx-50)/2*clamp(k,0,1.4);let s='';
 for(const y of rows)s+=arrow(m-half,y,m+half,y,{color,w,head:14});
 return fade(g,s);
}
// battery under the plates: long line (＋ terminal) on the left, wired to the left plate
export function battery({g=1,lx=G.LX,rx=G.RX,pb=G.PB,wy=460,volt=''}={}){
 const bx=(lx+rx)/2,a=lx-G.PW/2,b=rx+G.PW/2;
 let s=draw([[a,pb],[a,wy],[bx-10,wy]],1,{color:C.dim,w:4})+draw([[bx+10,wy],[b,wy],[b,pb]],1,{color:C.dim,w:4});
 s+=line(bx-10,wy-30,bx-10,wy+30,{color:C.ink,w:5})+line(bx+10,wy-16,bx+10,wy+16,{color:C.ink,w:9});
 s+=label('＋',bx-32,wy-14,{size:24,color:POS,anchor:'middle',weight:700})+label('−',bx+32,wy-14,{size:26,color:NEG,anchor:'middle',weight:700});
 if(volt)s+=label(volt,bx+50,wy+10,{size:24,color:VC,weight:700});
 return fade(g,s);
}
// face-on plate: a square with charges on a grid
export function faceOn(x,y,side,{g=1,n=4,sign=1,lab='',labColor=SC,dens=1}={}){
 let s=rect(x,y,side,side,{fill:'#8795ad',fo:.22,stroke:C.dim,sw:2.5,rx:4});
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){const cx=x+side*(i+.5)/n,cy=y+side*(j+.5)/n;s+=sign>0?plus(cx,cy,{size:22*dens}):minus(cx,cy,{size:24*dens});}
 if(lab)s+=label(lab,x+side/2,y+side+36,{size:26,color:labColor,anchor:'middle',weight:700});
 return fade(g,s);
}
// dashed "0" marker for a cancelled region
export const zero=(x,y,g=1)=>fade(g,L('0',x,y+12,{size:40,color:C.hi,weight:700}));
const vbar=(x,y1,y2,color=C.ink,w=3)=>line(x,y1,x,y2,{color,w})+line(x-8,y1,x+8,y1,{color,w})+line(x-8,y2,x+8,y2,{color,w});
const hbar=(x1,x2,y,color=C.ink,w=3)=>line(x1,y,x2,y,{color,w})+line(x1,y-8,x1,y+8,{color,w})+line(x2,y-8,x2,y+8,{color,w});

// ---- three-row superposition figure -----------------------------------------------------------
const R={LX:400,RX:600,PW:20,Y:[130,262,394],PT:66,PB:462,A:66};
const REG=[(R.LX-R.PW+228)/2,(R.LX+R.RX)/2,(R.RX+R.PW+R.RX+R.PW+160)/2]; // centres: left out, between, right out
function rowArrow(ri,region,dir,{g=1,len=R.A,color=EC,dy=0,tag='',off=0}={}){
 if(g<=.001)return '';
 const y=R.Y[ri]+dy,cx=REG[region]+off,x0=cx-dir*len/2,x1=cx+dir*len/2;
 return fade(g,arrow(x0,y,x1,y,{color,w:5,head:15})+(tag?label(tag,cx,y-16,{size:22,color:tag==='＋'?POS:NEG,anchor:'middle',weight:700}):''));
}
function rows3({g=1,labels=[1,1,1],cop=1}={}){
 let s=rect(R.LX-R.PW,R.PT,R.PW,R.PB-R.PT,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3})+rect(R.RX,R.PT,R.PW,R.PB-R.PT,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3});
 for(let i=0;i<9;i++){const y=R.PT+(R.PB-R.PT)*(i+.5)/9;s+=plus(R.LX-R.PW/2,y,{op:cop,size:22})+minus(R.RX+R.PW/2,y,{op:cop,size:24});}
 const names=['＋の板だけ','−の板だけ','両方'],cols=[POS,NEG,C.hi];
 for(let i=0;i<3;i++){s+=fade(labels[i],L(names[i],110,R.Y[i]+9,{size:26,color:cols[i],weight:700}));if(i<2)s+=line(20,(R.Y[i]+R.Y[i+1])/2,790,(R.Y[i]+R.Y[i+1])/2,{color:C.faint,w:1.5,dash:'6 8'});}
 s+=L('左の外',REG[0],R.PT-14,{size:22,color:C.dim})+L('板の間',REG[1],R.PT-14,{size:22,color:C.dim})+L('右の外',REG[2],R.PT-14,{size:22,color:C.dim});
 return fade(g,s);
}
const plusRow=(g=1)=>rowArrow(0,0,-1,{g})+rowArrow(0,1,1,{g})+rowArrow(0,2,1,{g});
const minusRow=(g=1)=>rowArrow(1,0,1,{g})+rowArrow(1,1,1,{g})+rowArrow(1,2,-1,{g});

// ---- single plate (edge-on, centred) ---------------------------------------------------------
const SP={X:330,PT:70,PB:450,W:22};
function onePlate({g=1,sign=1,n=9}={}){return plate(SP.X-SP.W/2,SP.PT,SP.PB,{w:SP.W,sign,n,g});}
function sideArrows({g=1,sign=1,len=80,ys=[140,260,380],d=[40,40,40]}={}){
 let s='';ys.forEach((y,i)=>{const a=SP.X+SP.W/2+d[i],b=SP.X-SP.W/2-d[i];
  s+=sign>0?arrow(a,y,a+len,y,{color:EC,w:5,head:15})+arrow(b,y,b-len,y,{color:EC,w:5,head:15})
           :arrow(a+len,y,a,y,{color:EC,w:5,head:15})+arrow(b-len,y,b,y,{color:EC,w:5,head:15});});
 return fade(g,s);
}

export const ytUmCapacitance1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recall']:(p)=>{
  // uniform field; two equipotential lines d apart
  let s='';for(const y of [130,220,310,400])for(const x0 of [110,330])s+=arrow(x0,y,x0+150,y,{color:EC,w:3.5,head:13,opacity:.75});
  s+=fade(seg(p,.05,.2),L('一様な電場',330,82,{size:26,color:EC,weight:700}));
  const xa=170,xb=470,g=seg(p,.25,.45);
  s+=fade(g,line(xa,100,xa,440,{color:VC,w:3,dash:'8 8'})+line(xb,100,xb,440,{color:VC,w:3,dash:'8 8'})
   +hbar(xa,xb,470,C.ink)+L('d',(xa+xb)/2,500,{size:26,weight:700}));
  s+=card(700,110,450,280,L('電場に沿って d 進むと',925,170,{size:26,color:C.dim})
   +L('電位が',790,272,{size:32})+T(`${cs(EC,'E')}d`,905,262,{size:52})+L('下がる',1025,272,{size:32})
   +fade(seg(p,.6,.8),L('（前回：電位の坂）',925,345,{size:24,color:C.dim})),seg(p,.4,.6),VC);
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=plates({qlab:1,g:seg(p,0,.2)});
  s+=fade(seg(p,.2,.4),L('?',(G.LX+G.RX)/2,260,{size:60,color:EC,weight:700}));
  s+=card(760,90,400,330,L('最後の問い',960,140,{size:24,color:C.dim})
   +L('板の間の 電場は？',960,205,{size:30,color:EC,weight:700})
   +fade(seg(p,.35,.5),L('電位差は？',960,270,{size:30,color:VC,weight:700}))
   +fade(seg(p,.55,.7),L('1 V あたり',960,335,{size:30,color:C.hi,weight:700})+L('どれだけ ためられる？',960,380,{size:28,color:C.hi,weight:700})),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'recallC']:(p)=>{
  let s=card(90,90,480,330,L('初級：定義',330,145,{size:26,color:CC,weight:700})
   +T(`${Ct}=\\dfrac{${Qt}}{${Vt}}`,330,250,{size:64})+L('1 V あたりの電荷',330,360,{size:26,color:C.dim}),seg(p,0,.2),CC);
  s+=card(630,90,480,330,L('初級：実験で分かった事実',870,145,{size:26,color:C.dim,weight:700})
   +T(`${Qt}\\propto ${Vt}`,870,250,{size:64})+L('3 V で 6 μC、6 V で 12 μC',870,360,{size:26,color:C.dim}),seg(p,.45,.65));
  return s;
 },
 [K+'plan']:(p)=>{
  const box=(x,title,tx,color,g)=>card(x,150,280,170,L(title,x+140,200,{size:26,color,weight:700})+T(tx,x+140,275,{size:46}),g,color);
  let s=L('板の面積 S と 間隔 d から 容量 C を導く',600,90,{size:30,color:C.ink,weight:700});
  s+=box(90,'電場',vE,EC,seg(p,.2,.35))+fade(seg(p,.3,.4),L('→',430,245,{size:40,color:C.dim}))
   +box(460,'電位差',Vt,VC,seg(p,.3,.45))+fade(seg(p,.4,.5),L('→',800,245,{size:40,color:C.dim}))
   +box(830,'容量',Ct,CC,seg(p,.4,.55));
  s+=fade(seg(p,.6,.75),highlight(80,140,300,190,1,C.hi)+L('今回',230,380,{size:30,color:C.hi,weight:700})+L('次回',795,380,{size:30,color:C.dim,weight:700}));
  return s;
 },
 [K+'question']:(p)=>{
  let s=plates({qlab:1});
  const g=seg(p,.15,.35);
  s+=fade(g,L('?',(G.LX+G.RX)/2,240,{size:56,color:EC,weight:700})+L('?',240,240,{size:56,color:EC,weight:700})+L('?',790,240,{size:56,color:EC,weight:700}));
  s+=fade(seg(p,.4,.6),L('向きは？　強さは？',600,470,{size:30,color:C.hi,weight:700}));
  return s;
 },
 // ===== S2 面積1あたりの電荷 =====
 [K+'setup']:(p)=>{
  let s=plates({qlab:seg(p,.3,.5)})+battery({g:seg(p,0,.25)});
  s+=card(800,110,360,250,L('電池の ＋極 側',980,165,{size:26,color:POS,weight:700})+L('左の板 ＋Q',980,215,{size:28,color:POS,weight:700})
   +L('右の板 −Q',980,265,{size:28,color:NEG,weight:700})+fade(seg(p,.6,.75),L('Q ＝ 片方の大きさ',980,325,{size:26,color:QC,weight:700})),seg(p,.2,.4),QC);
  return s;
 },
 [K+'area']:(p)=>{
  let s=plates({g:1-seg(p,0,.25),qlab:1});
  const g=seg(p,.2,.45);
  s+=fade(g,faceOn(150,90,300,{n:5})+L('正面から見た 左の板',300,70,{size:24,color:C.dim}));
  s+=fade(seg(p,.4,.6),hbar(150,450,425,SC)+L('面積 S',300,470,{size:28,color:SC,weight:700}));
  s+=card(620,150,520,190,L('電荷は 板の上に',880,215,{size:28,color:C.ink})+L('一様に 広がる（仮定）',880,270,{size:30,color:C.hi,weight:700}),seg(p,.55,.75));
  return s;
 },
 [K+'sigma']:(p)=>{
  let s=faceOn(150,90,300,{n:5})+L('正面から見た 左の板',300,70,{size:24,color:C.dim})+hbar(150,450,425,SC)+L('面積 S',300,470,{size:28,color:SC,weight:700});
  s+=fade(seg(p,.05,.25),rect(150,90,60,60,{fill:C.hi,fo:.2,stroke:C.hi,sw:3,rx:2})+L('1 m²',180,172,{size:22,color:C.hi,weight:700}));
  s+=card(620,100,520,300,L('面積 1 m² あたりの電荷',880,140,{size:26,color:C.dim})
   +T(`${sig}=\\dfrac{${Qt}}{${St}}`,880,262,{size:60})
   +L('面密度　単位 C/m²',880,355,{size:28,color:QC,weight:700}),seg(p,.2,.4),QC);
  return s;
 },
 [K+'sparse']:(p)=>{
  let s=faceOn(110,95,300,{n:3,g:seg(p,0,.2)})+faceOn(640,155,180,{n:3,g:seg(p,.3,.5)});
  s+=fade(seg(p,0,.2),L('広い板：薄く広がる',260,450,{size:26,color:C.ink})+T(sig,240,488,{size:34})+label('小',262,498,{size:28,color:C.ink}));
  s+=fade(seg(p,.3,.5),L('狭い板：詰め込む',730,450,{size:26,color:C.ink})+T(sig,710,488,{size:34})+label('大',732,498,{size:28,color:C.ink}));
  s+=fade(seg(p,.05,.2),L('同じ Q（どちらも ＋9個）',600,60,{size:26,color:QC,weight:700}));
  return s;
 },
 [K+'num1']:(p)=>{
  let s=faceOn(150,95,280,{n:5})+hbar(150,430,410,SC)+L('10 cm',290,445,{size:24,color:SC,weight:700})+vbar(465,95,375,SC)+label('10 cm',480,243,{size:24,color:SC,weight:700});
  s+=card(620,110,520,280,T(`${St}=0.01${U('m^2')}`,880,190,{size:46})
   +fade(seg(p,.4,.6),T(`${Qt}=2.66\\times10^{-10}${U('C')}`,880,300,{size:46})),seg(p,.1,.3),QC);
  return s;
 },
 [K+'num2']:(p)=>{
  let s=card(150,80,900,340,T(`${sig}=\\dfrac{${Qt}}{${St}}`,330,190,{size:56})
   +fade(seg(p,.1,.3),T(`=\\dfrac{${cs(QC,'2.66\\times10^{-10}'+U('C'))}}{${cs(SC,'0.01'+U('m^2'))}}`,700,190,{size:50}))
   +fade(seg(p,.4,.6),T(`=${cs(QC,'2.66\\times10^{-8}'+U('C/m^2'))}`,600,320,{size:54}))
   +fade(seg(p,.75,.9),L('Q の出どころは 次回',600,395,{size:24,color:C.dim})),seg(p,0,.1),QC);
  return s;
 },
 [K+'assume1']:(p)=>{
  // narrow gap, tall plates (drawn to a realistic ratio)
  const lx=300,rx=360,pt=70,pb=440;
  let s=plates({lx,rx,pt,pb,n:9});
  s+=fade(seg(p,.2,.4),hbar(lx,rx,470,C.ink)+L('d',(lx+rx)/2,505,{size:28,weight:700}));
  s+=fade(seg(p,.35,.55),vbar(420,pt,pb,C.dim)+label('板の幅',435,262,{size:26,color:C.dim}));
  s+=card(640,140,500,220,L('仮定 1',890,195,{size:26,color:C.hi,weight:700})
   +L('間隔 d ≪ 板の幅',890,265,{size:36,color:C.ink,weight:700})+L('（≪：十分小さい）',890,320,{size:24,color:C.dim}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'edge']:(p)=>{
  const lx=300,rx=360,pt=70,pb=440;
  let s=plates({lx,rx,pt,pb,n:9});
  let f='';for(let y=110;y<=400;y+=36)f+=arrow(lx+6,y,rx-6,y,{color:EC,w:3,head:10});
  s+=fade(seg(p,0,.2),f);
  // fringing at the two edges
  const fr=(y0,dir)=>draw([[lx-G.PW/2,y0],[lx-30,y0+dir*28],[(lx+rx)/2,y0+dir*46],[rx+30,y0+dir*28],[rx+G.PW/2,y0]],1,{color:EC,w:2.5,dash:'6 6'});
  s+=fade(seg(p,.15,.35),fr(pt,-1)+fr(pb,1)+label('端で曲がる',rx+48,pt-4,{size:22,color:C.dim})+label('端で曲がる',rx+48,pb+30,{size:22,color:C.dim}));
  s+=fade(seg(p,.45,.6),highlight(lx-40,140,rx-lx+80,230,1,C.hi)+label('中央部',rx+60,262,{size:28,color:C.hi,weight:700}));
  s+=card(640,110,500,280,L('端の曲がりは 全体のわずか',890,170,{size:28,color:C.ink})+L('→ 無視する',890,225,{size:30,color:C.hi,weight:700})
   +fade(seg(p,.7,.85),L('以後の図は すき間を',890,300,{size:24,color:C.dim})+L('広げて描きます',890,340,{size:24,color:C.dim})),seg(p,.35,.55));
  return s;
 },
 [K+'vacuum']:(p)=>{
  const lx=300,rx=360,pt=70,pb=440;
  let s=plates({lx,rx,pt,pb,n:9});
  s+=fade(seg(p,0,.2),label('空気',rx+50,200,{size:28,color:C.dim}));
  s+=fade(seg(p,.2,.4),label('→ 真空とみなす',rx+50,250,{size:28,color:C.ink,weight:700}));
  s+=card(640,140,500,220,L('仮定 2',890,195,{size:26,color:C.hi,weight:700})+L('真空の誘電率',890,255,{size:30,color:C.ink})
   +T(eps,890,320,{size:56}),seg(p,.45,.65),C.hi);
  return s;
 },
 [K+'eps']:(p)=>{
  return card(150,70,900,370,L('ガウスの法則の回で 定義した定数',600,118,{size:26,color:C.dim})
   +T(`${eps}=\\dfrac{1}{4\\pi k}`,600,232,{size:56})
   +fade(seg(p,.4,.6),T(`${eps}\\approx 8.85\\times10^{-12}${U('C^2/(N\\cdot m^2)')}`,600,345,{size:46})),seg(p,0,.15));
 },
 // ===== S3 1枚の板の電場 =====
 [K+'one']:(p)=>{
  let s=onePlate({g:seg(p,0,.25)});
  s+=fade(seg(p,.25,.45),T(sig,SP.X,SP.PT-26,{size:40})+L('正の電荷が 一様に並ぶ',SP.X,SP.PB+44,{size:24,color:C.dim}));
  s+=card(640,150,500,200,L('1枚だけの 広い平面',890,215,{size:30,color:C.ink,weight:700})+L('面密度 σ',890,280,{size:30,color:QC,weight:700}),seg(p,.4,.6));
  return s;
 },
 [K+'sym']:(p)=>{
  let s=onePlate();
  const Px=560,Py=260,a1=[SP.X,Py-130],a2=[SP.X,Py+130];
  s+=dot(Px,Py,8,C.hi)+label('P',Px+14,Py-14,{size:28,color:C.hi,weight:700});
  s+=fade(seg(p,.05,.2),ring(a1[0],a1[1],20,{color:C.hi,w:3})+ring(a2[0],a2[1],20,{color:C.hi,w:3})
   +line(a1[0],a1[1],Px,Py,{color:C.faint,w:2,dash:'6 6'})+line(a2[0],a2[1],Px,Py,{color:C.faint,w:2,dash:'6 6'}));
  const L1=150,u1=[(Px-a1[0]),(Py-a1[1])],n1=Math.hypot(...u1),e1=[u1[0]/n1*L1,u1[1]/n1*L1],e2=[e1[0],-e1[1]];
  const g=seg(p,.15,.35);
  s+=fade(g,arrow(Px,Py,Px+e1[0],Py+e1[1],{color:EC,w:4,head:14})+arrow(Px,Py,Px+e2[0],Py+e2[1],{color:EC,w:4,head:14}));
  const g2=seg(p,.4,.6);
  s+=fade(g2,arrow(Px+e1[0],Py,Px+e1[0],Py+e1[1],{color:C.p,w:4,head:12})+arrow(Px+e2[0],Py,Px+e2[0],Py+e2[1],{color:C.p,w:4,head:12}));
  s+=fade(seg(p,.55,.7),label('面に沿う成分',Px+e1[0]+20,Py-50,{size:24,color:C.p,weight:700})+label('打ち消す',Px+e1[0]+20,Py+62,{size:26,color:NG,weight:700}));
  s+=fade(seg(p,.7,.9),arrow(Px,Py,Px+2*e1[0],Py,{color:EC,w:6,head:18})+label('和',Px+2*e1[0]+14,Py+9,{size:28,color:EC,weight:700}));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=onePlate()+sideArrows({g:seg(p,.1,.4)});
  s+=card(640,150,500,210,L('残るのは 垂直な成分',890,215,{size:28,color:C.ink})+L('→ 面から 垂直に出る',890,280,{size:30,color:EC,weight:700}),seg(p,.4,.6),EC);
  return s;
 },
 [K+'result']:(p)=>{
  let s=onePlate()+sideArrows();
  s+=card(640,90,500,330,L('1枚の広い平面（結果）',890,125,{size:26,color:C.dim})
   +T(`${Et}=${HALF}`,890,248,{size:60})
   +fade(seg(p,.4,.6),L('導き方は 上級で',890,350,{size:26,color:C.dim})+L('ここでは 結果を使う',890,392,{size:26,color:C.hi,weight:700})),seg(p,.05,.25),EC);
  return s;
 },
 [K+'half']:(p)=>{
  let s=onePlate();
  // a small box around a patch of the plate; flux leaves through both faces
  const y1=200,y2=320,bx1=SP.X-70,bx2=SP.X+70;
  s+=fade(seg(p,0,.2),rect(bx1,y1,bx2-bx1,y2-y1,{fill:C.hi,fo:.06,stroke:C.hi,sw:2.5,rx:4}));
  let f='';for(const y of [220,260,300])f+=arrow(bx2,y,bx2+120,y,{color:EC,w:4,head:13})+arrow(bx1,y,bx1-120,y,{color:EC,w:4,head:13});
  s+=fade(seg(p,.2,.45),f);
  s+=fade(seg(p,.45,.6),L('半分',bx2+70,y1-20,{size:28,color:C.hi,weight:700})+L('半分',bx1-70,y1-20,{size:28,color:C.hi,weight:700}));
  s+=card(640,110,500,280,L('面から出る 電気束',890,158,{size:28,color:C.ink})+L('右へ 半分、左へ 半分',890,210,{size:30,color:C.hi,weight:700})
   +fade(seg(p,.6,.8),T(`${Et}=\\dfrac{${sig}}{\\color{${C.hi}}{2}${eps}}`,890,318,{size:52})),seg(p,.3,.5));
  return s;
 },
 [K+'nodist']:(p)=>{
  let s=onePlate()+sideArrows({d:[30,110,190]});
  s+=card(700,100,440,300,T(`${Et}=${HALF}`,920,190,{size:56})
   +fade(seg(p,.2,.4),L('距離が 入っていない',920,290,{size:30,color:C.hi,weight:700}))
   +fade(seg(p,.5,.7),L('なぜ 弱まらない？',920,350,{size:30,color:C.ink})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'point']:(p)=>{
  const cx=300,cy=260;let s='';
  for(let i=0;i<16;i++){const a=i*Math.PI/8;s+=line(cx+22*Math.cos(a),cy+22*Math.sin(a),cx+220*Math.cos(a),cy+220*Math.sin(a),{color:EC,w:2,opacity:.6});}
  s+=ring(cx,cy,20,{color:POS,w:3,fill:'#3a1d2a'})+label('＋',cx,cy+9,{size:24,color:POS,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.35),ring(cx,cy,90,{color:SC,w:2.5,dash:'7 7'})+ring(cx,cy,180,{color:SC,w:2.5,dash:'7 7'}));
  s+=fade(seg(p,.25,.45),arrow(cx+90,cy-2,cx+90+90,cy-2,{color:EC,w:6,head:16})+arrow(cx+180,cy+30,cx+180+22,cy+30,{color:EC,w:6,head:12}));
  s+=card(640,110,500,280,L('点電荷（ガウス 中級）',890,165,{size:26,color:C.dim})+T(`${Et}\\times 4\\pi r^2`,850,240,{size:44})+L('が 一定',1010,250,{size:28,color:C.ink})
   +fade(seg(p,.5,.7),L('球面が広がる分 → 弱まる',890,320,{size:28,color:C.hi,weight:700})),seg(p,.2,.4));
  return s;
 },
 [K+'parallel']:(p)=>{
  let s=onePlate();
  let f='';for(let y=100;y<=420;y+=40)f+=line(SP.X+SP.W/2,y,SP.X+260,y,{color:EC,w:2,opacity:.55})+line(SP.X-SP.W/2,y,SP.X-260,y,{color:EC,w:2,opacity:.55});
  s+=fade(seg(p,0,.2),f);
  s+=fade(seg(p,.2,.4),sideArrows({d:[30,110,190],ys:[160,260,360],len:70}));
  s+=card(700,110,440,280,L('力線が 平行 → 広がらない',920,170,{size:28,color:C.ink})+L('どこでも 同じ強さ',920,235,{size:32,color:C.hi,weight:700})
   +fade(seg(p,.6,.8),L('（板の幅より 近い所）',920,310,{size:24,color:C.dim})),seg(p,.35,.55),C.hi);
  return s;
 },
 [K+'num3']:(p)=>{
  return card(120,80,960,340,T(`${Et}=${HALF}`,290,190,{size:52})
   +fade(seg(p,.1,.35),T(`=\\dfrac{${cs(QC,'2.66\\times10^{-8}')}}{2\\times8.85\\times10^{-12}}`,720,190,{size:48}))
   +fade(seg(p,.5,.7),T(`\\approx ${cs(EC,'1500'+U('N/C'))}`,600,330,{size:58})),seg(p,0,.1),EC);
 },
 [K+'neg']:(p)=>{
  let s=onePlate({sign:-1})+sideArrows({sign:-1,g:seg(p,.1,.35)});
  s+=card(640,110,500,280,L('負の板',890,148,{size:28,color:NEG,weight:700})+L('強さは 同じ',800,258,{size:28,color:C.ink})+T(HALF,960,250,{size:46})
   +fade(seg(p,.4,.6),L('向きは 逆：板へ入る',890,345,{size:30,color:EC,weight:700})),seg(p,.05,.25),NEG);
  return s;
 },
 // ===== S4 2枚を重ね合わせる =====
 [K+'superpos']:(p)=>{
  return card(150,80,900,350,L('重ね合わせ',600,135,{size:30,color:C.hi,weight:700})
   +T(`${vE}=${cs(EC,'\\mathbf{E}_{+}')}+${cs(EC,'\\mathbf{E}_{-}')}`,600,230,{size:60})
   +L('＋の板の電場 と −の板の電場 の ベクトルの和',600,315,{size:26,color:C.ink})
   +fade(seg(p,.55,.75),L('実験で確かめられた性質',600,385,{size:28,color:C.dim,weight:700})),seg(p,0,.15),C.hi);
 },
 [K+'plusOnly']:(p)=>{
  let s=rows3({labels:[1,0,0]})+plusRow(seg(p,.1,.4));
  s+=card(820,120,350,200,L('＋の板だけ',995,170,{size:26,color:POS,weight:700})+L('どこも',925,268,{size:26,color:C.ink})+T(HALF,1040,262,{size:44}),seg(p,.4,.6),POS);
  return s;
 },
 [K+'minusOnly']:(p)=>{
  let s=rows3({labels:[1,1,0]})+plusRow()+minusRow(seg(p,.1,.4));
  s+=card(820,120,350,200,L('−の板だけ',995,170,{size:26,color:NEG,weight:700})+L('板へ 向かう',995,245,{size:30,color:C.ink,weight:700}),seg(p,.3,.5),NEG);
  return s;
 },
 [K+'predict']:(p)=>{
  let s=rows3()+plusRow()+minusRow();
  s+=fade(seg(p,.1,.3),L('?',REG[0],R.Y[2]+16,{size:48,color:C.hi,weight:700})+L('?',REG[1],R.Y[2]+16,{size:48,color:C.hi,weight:700})+L('?',REG[2],R.Y[2]+16,{size:48,color:C.hi,weight:700}));
  s+=card(820,150,350,160,L('予想',995,205,{size:28,color:C.hi,weight:700})+L('3つの場所は？',995,265,{size:28,color:C.ink}),seg(p,.2,.4),C.hi);
  return s;
 },
 [K+'between']:(p)=>{
  let s=rows3()+plusRow()+minusRow();
  const x0=REG[1]-R.A,y=R.Y[2],g1=seg(p,.05,.25),g2=seg(p,.2,.4);
  s+=fade(g1,arrow(x0,y,x0+R.A,y,{color:EC,w:5,head:15})+label('＋',x0+R.A/2,y-16,{size:22,color:POS,anchor:'middle',weight:700}));
  s+=fade(g2,arrow(x0+R.A,y,x0+2*R.A,y,{color:EC,w:5,head:15})+label('−',x0+1.5*R.A,y-16,{size:24,color:NEG,anchor:'middle',weight:700}));
  s+=card(810,95,370,330,L('板の間：同じ向き',995,140,{size:26,color:EC,weight:700})
   +T(`${HALF}+${HALF}`,995,225,{size:38})+fade(seg(p,.5,.7),T(`=${FULL}`,995,350,{size:52})),seg(p,.3,.5),EC);
  return s;
 },
 [K+'outside']:(p)=>{
  let s=rows3()+plusRow()+minusRow();
  s+=arrow(REG[1]-R.A,R.Y[2],REG[1]+R.A,R.Y[2],{color:EC,w:7,head:18});
  const g=seg(p,.05,.3),y=R.Y[2];
  s+=fade(g*(1-seg(p,.45,.6)),rowArrow(2,0,-1,{dy:-14})+rowArrow(2,0,1,{dy:14})+rowArrow(2,2,1,{dy:-14})+rowArrow(2,2,-1,{dy:14}));
  s+=zero(REG[0],y,seg(p,.45,.6))+zero(REG[2],y,seg(p,.45,.6));
  s+=card(810,130,370,240,L('外側：逆向き・同じ強さ',995,185,{size:26,color:C.ink,weight:700})+fade(seg(p,.4,.6),L('打ち消して 0',995,270,{size:36,color:C.hi,weight:700})),seg(p,.2,.4),C.hi);
  return s;
 },
 [K+'box']:(p)=>{
  let s=plates({qlab:1})+fieldIn({k:1});
  s+=zero(250,240)+zero(780,240);
  s+=fade(seg(p,.3,.5),rect(G.LX+4,G.PT-8,G.RX-G.LX-8,G.PB-G.PT+16,{fill:C.hi,fo:.07,stroke:C.hi,sw:3,rx:6}));
  s+=fade(seg(p,.45,.65),L('電場を 箱に詰める',(G.LX+G.RX)/2,G.PB+60,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.1,.3),label('外',235,300,{size:24,color:C.dim})+label('外',765,300,{size:24,color:C.dim}));
  return s;
 },
 [K+'formula']:(p)=>{
  const lx=160,rx=330;
  let s=plates({lx,rx,qlab:1,n:7})+fieldIn({lx,rx,k:1});
  s+=card(520,90,640,330,T(`${Et}=${FULL}`,700,200,{size:56})
   +fade(seg(p,.2,.4),T(`=${QES}`,960,200,{size:56})+L('σ ＝ Q/S を 入れる',960,280,{size:24,color:C.dim}))
   +fade(seg(p,.55,.75),L('向き：＋の板 → −の板',840,370,{size:30,color:EC,weight:700})),seg(p,0,.15),EC);
  return s;
 },
 [K+'uniform']:(p)=>{
  let s=plates({qlab:1})+fieldIn({k:1,rows:[130,190,250,310,370]});
  const g=seg(p,.35,.55);
  s+=fade(g,[[450,160],[560,340],[510,250]].map(([x,y])=>ring(x,y,16,{color:C.hi,w:3})).join(''));
  s+=card(800,110,360,290,T(`${Et}=${QES}`,980,190,{size:48})+L('場所を表す量が ない',980,275,{size:26,color:C.dim})
   +fade(seg(p,.6,.8),L('→ 一様',980,345,{size:36,color:C.hi,weight:700})),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'num4']:(p)=>{
  return card(120,80,960,350,T(`${Et}=2\\times1500\\approx ${cs(EC,'3000'+U('N/C'))}`,600,180,{size:52})
   +fade(seg(p,.35,.55),T(`1${U('N/C')}=1${U('V/m')}`,600,280,{size:44})+L('（電位の回）',900,285,{size:24,color:C.dim}))
   +fade(seg(p,.65,.85),T(`${Et}\\approx ${cs(EC,'3000'+U('V/m'))}`,600,380,{size:52})),seg(p,0,.1),EC);
 },
 [K+'propQ']:(p)=>{
  const k=1+seg(p,.35,.6)*.35;const two=seg(p,.35,.6);
  let s=plates({qlab:1,lq:two>.5?'+2Q':'+Q',rq:two>.5?'-2Q':'-Q'})+fieldIn({k:k/1.35,w:4+two*2});
  s+=card(800,110,360,290,L('初級：電荷が増えると 強い',980,165,{size:24,color:C.dim})
   +T(`${Et}=${QES}`,980,250,{size:46})+fade(seg(p,.55,.75),T(`${Et}\\propto ${Qt}`,980,350,{size:48})),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=faceOn(120,110,200,{n:3,lab:'面積 S',g:seg(p,0,.2)})+faceOn(400,70,283,{n:3,lab:'面積 2S',g:seg(p,.1,.3)});
  s+=fade(seg(p,.05,.25),L('同じ Q',450,40,{size:26,color:QC,weight:700}));
  s+=card(760,120,400,240,L('確認',960,170,{size:26,color:C.dim})+L('面積 2倍 で 同じ Q',960,230,{size:28,color:C.ink})
   +fade(seg(p,.35,.55),T(`${Et}=\\;?`,960,310,{size:52})),seg(p,.2,.4),C.hi);
  return s;
 },
 [K+'ans']:(p)=>{
  return card(150,80,900,350,T(`${sig}=\\dfrac{${Qt}}{2${St}}`,540,170,{size:48})+L('→ 半分',720,182,{size:32,color:C.hi,weight:700})
   +fade(seg(p,.2,.4),T(`${Et}\\approx ${cs(EC,'1500'+U('V/m'))}`,600,275,{size:52}))
   +fade(seg(p,.55,.75),L('電場を決めるのは 面密度 σ',600,375,{size:30,color:QC,weight:700})),0.999,C.hi);
 },
 // ===== S5 まとめと次の問い =====
 [K+'summary']:(p)=>{
  const col=(x,title,color,body,g)=>card(x,110,350,300,L(title,x+175,160,{size:26,color,weight:700})+body,g,color);
  let s=col(40,'定義',QC,T(`${sig}=\\dfrac{${Qt}}{${St}}`,215,270,{size:52}),seg(p,.05,.2));
  s+=col(425,'結果として使う',C.dim,T(HALF,600,260,{size:52})+L('1枚の広い平面',600,360,{size:24,color:C.dim}),seg(p,.25,.4));
  s+=col(810,'実験で確かめられた',C.hi,L('重ね合わせ',985,250,{size:34,color:C.ink,weight:700})+L('ベクトルの和',985,310,{size:26,color:C.dim}),seg(p,.5,.65));
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=plates({qlab:1})+fieldIn({k:1})+zero(250,240)+zero(780,240);
  s+=card(830,90,340,340,L('導いた結果',1000,128,{size:26,color:EC,weight:700})+T(`${Et}=${FULL}`,1000,215,{size:50})+L('間：一様',1000,295,{size:26,color:C.ink})+L('外：0',1000,338,{size:26,color:C.ink})
   +fade(seg(p,.5,.7),L('仮定：端を無視',1000,395,{size:24,color:C.dim})),seg(p,0,.2),EC);
  return s;
 },
 [K+'next']:(p)=>{
  let s=plates({qlab:1})+fieldIn({k:1});
  s+=fade(seg(p,.1,.3),hbar(G.LX,G.RX,G.PB+50,C.ink)+L('d',(G.LX+G.RX)/2,G.PB+90,{size:26,weight:700}));
  s+=card(800,100,360,320,L('次の問い',980,150,{size:26,color:C.dim})
   +T(`${Vt}=\\;?`,980,230,{size:52})+fade(seg(p,.4,.6),T(`${Ct}=\\dfrac{${Qt}}{${Vt}}=\\;?`,980,340,{size:48})),seg(p,.2,.4),C.hi);
  return s;
 },
};
