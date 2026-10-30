// YouTube シリーズ「マクスウェル方程式・上級 1/4」(ys-ue-maxwell-1) — 図。Stage 1200×515.
// 色：𝐄 水色、𝐁 橙、電流 I 緑、電荷 q 桃、t 金、面（平らな面・袋の面）黄、変位電流の項 黄の枠、誤り 赤、輪 C 白。
// 横から見た図：導線は左から右（電流 I は右向き）、左の板（x＝PL）が＋、右の板（x＝PR）が−。板の間の 𝐄 は左 → 右。
//   輪 C は左の導線を囲む縦長の楕円（右半分が手前、左半分が奥）。表は右向き（右ねじ）→ 手前の弧を下向きにたどる。
//   𝐁（電流の右ねじ）も同じ向き：手前の弧で下向き。袋の面は輪 C から右へ伸び、左の板を包んで板のすき間（x＝GX）を通る。
// 字幕では Φ_E と書かない（図の TeX の中だけ \Phi_E）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,texWidth,highlight} from './anim.mjs';
import {card,T,cs,head} from './yt1-um-current-field-1-diagrams.mjs';
import {L,TF} from './yt1-ue-potential-1-diagrams.mjs';
import {mixed} from './yt1-ue-ampere-1-diagrams.mjs';

const K='ue-maxwell-1:';
export const EC=C.x,CB=C.E,CI=C.F,QC=C.p,TC=C.t,VC=C.v,HI=C.hi,BAD=C.a,INK=C.ink,DIM=C.dim,SF=C.hi;
const RAD=Math.PI/180;
// TeX pieces
export const vE=cs(EC,'\\mathbf{E}'),Es=cs(EC,'E'),vB=cs(CB,'\\mathbf{B}'),Ic=cs(CI,'I'),qc=cs(QC,'q'),QQ=cs(QC,'Q'),tt=cs(TC,'t');
export const PE=cs(HI,'\\Phi_E'),PB=cs(HI,'\\Phi_B'),eps='\\varepsilon_0',mu='\\mu_0';
export const dr='d\\mathbf{r}',dA='d\\mathbf{A}';
export const AMP0=`\\oint ${vB}\\cdot ${dr}=${mu}${Ic}`;
export const DISP=`${eps}\\dfrac{d${PE}}{d${tt}}`;
export const AMPM=`\\oint ${vB}\\cdot ${dr}=${mu}\\left(${Ic}+${eps}\\dfrac{d${PE}}{d${tt}}\\right)`;
const OS='\\displaystyle\\mathop{\\iint\\mkern-23.5mu\\bigcirc\\mkern2mu}\\nolimits';
const U=s=>`\\,\\mathrm{${s}}`;
// formula drawn as left + right pieces so the right piece (the added term) can be boxed exactly
export const AL_=`\\oint ${vB}\\cdot ${dr}=${mu}\\Big(${Ic}+{}`,AR_=`${eps}\\dfrac{d${PE}}{d${tt}}\\Big)`;
const AL2=`\\oint ${vB}\\cdot ${dr}=${mu}${Ic}+{}`,AR2=`${mu}${eps}\\dfrac{d${PE}}{d${tt}}`;
export function eqSplit(cx,y,size,{box=0,g=1,l=AL_,r=AR_,boxR=0}={}){
 const wl=texWidth(l,size,false),wr=texWidth(r,size,false),x0=cx-(wl+wr)/2;
 let o=T(l,x0,y,{size,anchor:'start'})+T(r,x0+wl,y,{size,anchor:'start'});
 if(box)o+=highlight(x0+wl-8,y-size*1.4,wr-(boxR?texWidth('\\Big)',size,false)+4:0)+12,size*2.5,box);
 return fade(g,o);
}

// ---- capacitor side view ---------------------------------------------------------------------------
const CY=255,PL=420,PR=520,PT=140,PB_=370,GX=470,LX=230,LRX=24,LRY=62;
function ellPts(cx,cy,rx,ry,a0,a1,n=40){return Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});}
// loop C: right half (front) solid, left half (back) faint. Front arc runs downward.
function loopC({g=1,color=INK,w=4,heads=1,lab=1}={}){
 let s=draw(ellPts(LX,CY,LRX,LRY,90,270),1,{color,w:w-1,dash:'7 6',opacity:.55})+draw(ellPts(LX,CY,LRX,LRY,-90,90),1,{color,w});
 if(heads)s+=head(LX+LRX,CY+10,0,1,{color,L:18})+fade(.6,head(LX-LRX,CY-10,0,-1,{color,L:16}));
 if(lab)s+=label('C',LX-LRX-14,CY-LRY-8,{size:28,color,weight:700,anchor:'end'});
 return fade(g,s);
}
// 𝐁 around the wire, just outside the loop (front arc down, same sense as C)
function bArc(g=1){
 const rx=LRX+18,ry=LRY+22;
 return fade(g,draw(ellPts(LX,CY,rx,ry,-60,60),1,{color:CB,w:4})+head(LX+rx*Math.cos(60*RAD),CY+ry*Math.sin(60*RAD),-Math.sin(60*RAD)*rx,Math.cos(60*RAD)*ry,{color:CB,L:16})
  +draw(ellPts(LX,CY,rx,ry,120,240),1,{color:CB,w:3,opacity:.5})+label('𝐁',LX+rx+10,CY-ry+6,{size:28,color:CB,weight:700}));
}
function flatSurf(g=1,{hl=0,normal=0}={}){
 let s=`<ellipse cx="${LX}" cy="${CY}" rx="${LRX}" ry="${LRY}" fill="${SF}" fill-opacity="${hl?.38:.22}" stroke="${SF}" stroke-width="${hl?3:1.5}"/>`;
 if(normal)s+=fade(normal,arrow(LX,CY+LRY*.55,LX+70,CY+LRY*.55,{color:SF,w:3.5,head:13})+label('表',LX+76,CY+LRY*.55+8,{size:24,color:SF}));
 return fade(g,s);
}
const BAG=`M${LX},${CY-LRY} C ${LX+70},${PT-40} ${GX-80},${PT-26} ${GX},${PT-26} L${GX},${PB_+26} C ${GX-80},${PB_+26} ${LX+70},${PB_+40} ${LX},${CY+LRY}`;
function bagSurf(g=1,{hl=0,normal=0}={}){
 let s=`<path d="${BAG} Z" fill="${SF}" fill-opacity="${hl?.16:.09}" stroke="none"/>`+`<path d="${BAG}" fill="none" stroke="${SF}" stroke-width="${hl?3.5:2.5}" stroke-dasharray="10 7"/>`;
 if(normal)s+=fade(normal,arrow(GX,PB_+8,GX+70,PB_+8,{color:SF,w:3.5,head:13})+label('表',GX+76,PB_+16,{size:24,color:SF}));
 return fade(g,s);
}
// q: 0..1 amount of charge (number of ± marks and E arrows scale)
function capFig({g=1,I=1,q=.7,E=1,loop=0,B=0,flat=0,bag=0,flatHl=0,bagHl=0,normal=0,wireCut=0,rightWire=1}={}){
 let s='';
 s+=line(40,CY,PL,CY,{color:C.dim,w:6});
 if(rightWire)s+=line(PR,CY,660,CY,{color:C.dim,w:6});
 s+=flatSurf(flat,{hl:flatHl,normal})+bagSurf(bag,{hl:bagHl,normal});
 s+=line(PL,PT,PL,PB_,{color:INK,w:8})+line(PR,PT,PR,PB_,{color:INK,w:8});
 const n=Math.round(2+4*q);
 for(let k=0;k<n;k++){const y=PT+18+k*(PB_-PT-36)/Math.max(1,n-1);s+=label('＋',PL-22,y+9,{size:24,color:QC,anchor:'middle',weight:700})+label('−',PR+22,y+9,{size:26,color:QC,anchor:'middle',weight:700});}
 if(E>0){for(let k=0;k<5;k++){const y=PT+22+k*(PB_-PT-44)/4;s+=fade(E,arrow(PL+12,y,PR-12,y,{color:EC,w:3.5,head:12}));}s+=fade(E,label('𝐄',GX,PT-38,{size:28,color:EC,anchor:'middle',weight:700}));}
 if(I){s+=arrow(70,CY-28,160,CY-28,{color:CI,w:6,head:16})+label('I',115,CY-46,{size:28,color:CI,anchor:'middle',weight:700});
  if(rightWire)s+=arrow(560,CY-28,640,CY-28,{color:CI,w:6,head:16})+label('I',600,CY-46,{size:28,color:CI,anchor:'middle',weight:700});}
 s+=label('q',PL-22,PB_+40,{size:28,color:QC,anchor:'middle',weight:700});
 s+=B?bArc(B):'';
 s+=loop?loopC({g:loop}):'';
 return fade(g,s);
}
const cardR=(inner,g=1,stroke=C.faint)=>card(690,40,470,430,inner,g,stroke);

// ---- LC recap ----------------------------------------------------------------------------------------
function lcBars(p,g=1){
 const ph=2*Math.PI*(p*1.5),ue=Math.cos(ph)**2,um=Math.sin(ph)**2,H=230,y0=400;
 let s=line(90,y0,520,y0,{color:DIM,w:2.5});
 s+=rect(150,y0-H*ue,110,H*ue,{fill:EC,fo:.55})+rect(350,y0-H*um,110,H*um,{fill:CB,fo:.55});
 s+=L('電場の',205,y0+36,{size:24,color:EC})+L('エネルギー',205,y0+66,{size:24,color:EC})+L('磁場の',405,y0+36,{size:24,color:CB})+L('エネルギー',405,y0+66,{size:24,color:CB});
 return fade(g,s);
}

// ---- 4 laws table --------------------------------------------------------------------------------------
const ROWS=[
 {name:'① 電場のガウス',col:EC,eq:`${OS}${vE}\\cdot ${dA}=\\dfrac{${QQ}}{${eps}}`,vac:`${OS}${vE}\\cdot ${dA}=0`},
 {name:'② 磁場のガウス',col:CB,eq:`${OS}${vB}\\cdot ${dA}=0`,vac:`${OS}${vB}\\cdot ${dA}=0`},
 {name:'③ ファラデー',col:EC,eq:`\\oint ${vE}\\cdot ${dr}=-\\dfrac{d${PB}}{d${tt}}`,vac:`\\oint ${vE}\\cdot ${dr}=-\\dfrac{d${PB}}{d${tt}}`},
 {name:'④ アンペール・マクスウェル',col:CB,eq:`\\oint ${vB}\\cdot ${dr}=${mu}${Ic}+${mu}${eps}\\dfrac{d${PE}}{d${tt}}`,vac:`\\oint ${vB}\\cdot ${dr}=${mu}${eps}\\dfrac{d${PE}}{d${tt}}`},
];
const RY=i=>18+i*112;
function table({hi=[],dim=[],vac=0,g=1,box4=0,arrows=0}={}){
 let s='';
 ROWS.forEach((r,i)=>{const y=RY(i),h=hi.includes(i);
  let o=rect(30,y,1140,100,{fill:'#131f38',fo:.96,stroke:h?HI:C.faint,sw:h?3:2,rx:12});
  o+=label(r.name,52,y+60,{size:i===3?25:28,color:r.col,weight:700});
  o+=T(vac?r.vac:r.eq,820,y+62,{size:40});
  s+=fade(dim.includes(i)?.3:1,o);
 });
 if(box4){const l=`\\oint ${vB}\\cdot ${dr}=${mu}${Ic}+{}`,wl=texWidth(l,40,false),wr=texWidth(AR2,40,false),wt=texWidth(ROWS[3].eq,40,false),x0=820-wt/2;s+=highlight(x0+wl-8,RY(3)+8,wr+16,86,box4);}
 return fade(g,s);
}

export const ytUeMaxwell1Diagrams={
 // ===== S1 前回の問い =====
 [K+'prev']:(p)=>{
  let s=lcBars(p);
  s+=cardR(L('前回：L と C だけの 回路',925,110,{size:26,color:DIM})+L('電場の エネルギー',925,200,{size:30,color:EC,weight:700})+L('⇄',925,255,{size:34,color:INK})+L('磁場の エネルギー',925,310,{size:30,color:CB,weight:700})+fade(seg(p,.5,.7),L('入れ替わり 続ける',925,390,{size:28,color:HI,weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=capFig({q:.6,g:seg(p,.0,.15)});
  s+=fade(seg(p,.55,.75),L('？',GX,CY+12,{size:60,color:HI,weight:700}));
  s+=cardR(L('前回の 最後の 問い',925,100,{size:24,color:DIM})+L('空間でも 電場と 磁場は',925,170,{size:28})+L('互いを 生み 続けるか？',925,215,{size:28,color:HI,weight:700})
   +fade(seg(p,.45,.6),L('その前に：',925,295,{size:26,color:DIM})+L('すき間を「貫く電流」は',925,350,{size:30,color:INK,weight:700})+L('あるのか？',925,400,{size:30,color:HI,weight:700})),1,HI);
  return s;
 },
 [K+'promise']:(p)=>{
  let s=card(80,60,1040,170,L('中級 29-2 で 紹介した 法則',600,105,{size:26,color:DIM})+eqSplit(600,185,46,{l:AL2,r:AR2}),seg(p,.0,.15));
  {const wl=texWidth(AL2,46,false),wr=texWidth(AR2,46,false),x0=600-(wl+wr)/2;s+=highlight(x0+wl-8,185-46*1.25,wr+16,46*2.2,seg(p,.3,.45));}
  s+=fade(seg(p,.3,.45),L('加わった 項：電気束の 変化率',600,280,{size:26,color:HI,weight:700}));
  s+=fade(seg(p,.6,.75),card(330,330,540,110,L('必要な 理由の 確かめ → 上級',600,397,{size:32,color:HI,weight:700}),1,HI));
  return s;
 },
 [K+'plan']:(p)=>{
  const items=['① 2枚の 面で 答えが 食い違う','② すき間で 変わる 電場','③ 2枚の 面と 数で 確かめる','④ 4本の 法則が つながる'];
  let s=card(240,40,720,330,L('今回の 道筋',600,92,{size:26,color:DIM}),1);
  items.forEach((t,i)=>{s+=fade(seg(p,.05+i*.1,.15+i*.1),label(t,320,165+i*58,{size:30,color:INK,weight:700}));});
  s+=fade(seg(p,.55,.7),L('なぜ 項が 要るのか？',600,440,{size:34,color:HI,weight:700}));
  return s;
 },
 // ===== S2 2枚の面 =====
 [K+'setup']:(p)=>{
  const q=.3+.5*seg(p,0,1);
  let s=capFig({q});
  s+=cardR(L('充電の 途中',925,100,{size:26,color:DIM})+mixed(['導線：電流',`$${Ic}$`,'右向き'],925,190,{size:28,color:CI})+fade(seg(p,.4,.55),mixed(['左の 板：電荷',`$${qc}$`,'が たまる'],925,270,{size:28,color:QC}))
   +fade(seg(p,.6,.75),L('板の 間：電場 𝐄（左 → 右）',925,350,{size:26,color:EC})),1);
  return s;
 },
 [K+'loop']:(p)=>{
  let s=capFig({loop:seg(p,.05,.25),B:seg(p,.35,.5)});
  s+=cardR(L('アンペールの 法則',925,100,{size:26,color:DIM})+T(AMP0,925,190,{size:42})+fade(seg(p,.35,.5),L('輪 C に 沿った 磁場の 和',925,285,{size:26,color:CB})),1);
  return s;
 },
 [K+'surf']:(p)=>{
  let s=capFig({loop:1,B:.5,flat:seg(p,.3,.5)});
  s+=cardR(T(AMP0,925,120,{size:40})+mixed([`$${Ic}$`,'：輪を 縁と する'],925,215,{size:28})+L('面を 貫く 電流',925,262,{size:28})+fade(seg(p,.5,.65),L('縁が C なら',925,345,{size:28,color:SF})+L('どう 張っても よい はず',925,392,{size:28,color:SF,weight:700})),1);
  return s;
 },
 [K+'orient']:(p)=>{
  let s=capFig({loop:1,B:.4,flat:1,normal:seg(p,.35,.55)});
  s+=cardR(L('面の 表と 裏',925,100,{size:26,color:DIM})+L('たどる 向き → 右ねじ',925,190,{size:28})+L('→ 面の 表が 決まる',925,245,{size:28})+fade(seg(p,.45,.6),L('どの 面も 表は 右向き',925,330,{size:30,color:SF,weight:700})),1);
  return s;
 },
 [K+'flat']:(p)=>{
  let s=capFig({loop:1,B:.4,flat:1,flatHl:1});
  s+=fade(seg(p,.2,.4),ring(LX,CY,14,{color:CI,w:4}));
  s+=cardR(L('1枚目：平らな 面',925,100,{size:30,color:SF,weight:700})+mixed(['電流',`$${Ic}$`,'が 貫く'],925,195,{size:30,color:CI})+fade(seg(p,.5,.65),L('右辺',925,285,{size:26,color:DIM})+T(`${mu}${Ic}`,925,350,{size:52})),1,SF);
  return s;
 },
 [K+'bag']:(p)=>{
  let s=capFig({loop:1,B:.4,flat:.25,bag:seg(p,.05,.35),bagHl:1});
  s+=cardR(L('2枚目：袋の 面',925,100,{size:30,color:SF,weight:700})+L('板の すき間を 通る',925,180,{size:28})+fade(seg(p,.45,.6),L('導線は 貫かない',925,250,{size:28,color:CI}))+fade(seg(p,.65,.8),L('右辺',925,315,{size:26,color:DIM})+T('0',925,385,{size:56})),1,SF);
  return s;
 },
 [K+'contra']:(p)=>{
  let s='';
  s+=card(140,70,920,330,T(`\\oint ${vB}\\cdot ${dr}`,330,180,{size:46})+L('同じ 輪 → 値は 1つ',330,260,{size:26,color:CB})
   +fade(seg(p,.25,.4),L('平らな 面',650,140,{size:26,color:SF})+T(`=${mu}${Ic}`,850,140,{size:42}))
   +fade(seg(p,.35,.5),L('袋の 面',650,230,{size:26,color:SF})+T('=0',850,230,{size:42}))
   +fade(seg(p,.55,.7),L('2通り → 矛盾',750,335,{size:36,color:BAD,weight:700})),seg(p,.0,.15),BAD);
  return s;
 },
 [K+'steady']:(p)=>{
  let s=card(140,50,920,380,L('アンペールの 法則が 確かめられた 範囲',600,100,{size:26,color:DIM})+T(AMP0,600,180,{size:46})
   +fade(seg(p,.2,.35),L('定常電流',600,265,{size:36,color:CI,weight:700}))
   +fade(seg(p,.35,.5),L('電流が 時間で 変わらない',600,325,{size:28}))+fade(seg(p,.5,.65),L('どこにも 電荷が たまらない',600,375,{size:28})),seg(p,0,.12));
  return s;
 },
 [K+'here']:(p)=>{
  const q=.4+.5*seg(p,0,1);
  let s=capFig({q,loop:.5,B:.3});
  s+=fade(seg(p,.1,.3),ring(PL-22,CY,60,{color:QC,w:3,dash:'8 6'}));
  s+=cardR(L('今は',925,100,{size:26,color:DIM})+mixed(['左の 板に',`$${qc}$`,'が'],925,190,{size:30,color:QC})+L('たまり 続ける',925,240,{size:30,color:QC,weight:700})+fade(seg(p,.5,.65),L('→ そのままは 使えない',925,340,{size:30,color:BAD,weight:700})),1);
  return s;
 },
 // ===== S3 すき間で変わる電場 =====
 [K+'gapE']:(p)=>{
  const q=.3+.6*seg(p,.1,.9);
  let s=capFig({q,E:1,loop:.6,B:.3,flat:.25,bag:.6});
  s+=cardR(L('すき間',925,100,{size:30,color:SF,weight:700})+L('電流は ない',925,180,{size:28,color:CI})+fade(seg(p,.4,.55),L('電荷が たまると',925,260,{size:28,color:QC})+L('電場が 強く なる',925,310,{size:30,color:EC,weight:700})),1);
  s+=fade(seg(p,.4,.55),highlight(PL+6,PT-6,PR-PL-12,PB_-PT+12));
  return s;
 },
 [K+'Eq']:(p)=>{
  let s=capFig({loop:.5,B:.3,bag:.5});
  s+=fade(seg(p,.05,.2),label('板の 面積 S',PR+14,PT-14,{size:24,color:INK}));
  s+=cardR(L('板の 間の 電場（ガウスの 法則）',925,100,{size:24,color:DIM})+TF(`${Es}=\\dfrac{${qc}}{${eps}S}`,925,220,{size:56,frac:true,g:seg(p,.15,.35)})+fade(seg(p,.6,.75),L('端の 乱れは 無視',925,360,{size:26,color:DIM})),1);
  return s;
 },
 [K+'flux']:(p)=>{
  let s=capFig({loop:.5,B:.3,bag:1,bagHl:1});
  s+=fade(seg(p,.05,.25),highlight(GX-14,PT-4,28,PB_-PT+8));
  s+=cardR(L('袋の 面を 貫く 電気束',925,95,{size:26,color:SF})+TF(`${PE}=${Es}\\times S`,925,185,{size:46,g:seg(p,.1,.3)})+TF(`=\\dfrac{${qc}}{${eps}}`,925,285,{size:50,frac:true,g:seg(p,.3,.45)})
   +fade(seg(p,.6,.75),L('板の 外：𝐄 ≈ 0',925,395,{size:26,color:DIM})),1);
  return s;
 },
 [K+'rate']:(p)=>{
  let s=card(150,40,900,420,TF(`${PE}=\\dfrac{${qc}}{${eps}}`,600,130,{size:52,frac:true})+fade(seg(p,.15,.3),L('↓ 時間で 微分（ε₀ は 定数）',600,215,{size:28,color:TC}))
   +TF(`\\dfrac{d${PE}}{d${tt}}=\\dfrac{1}{${eps}}\\,\\dfrac{d${qc}}{d${tt}}`,600,330,{size:54,frac:true,g:seg(p,.35,.55)}),1);
  return s;
 },
 [K+'mul']:(p)=>{
  let s=card(150,40,900,420,TF(`\\dfrac{d${PE}}{d${tt}}=\\dfrac{1}{${eps}}\\,\\dfrac{d${qc}}{d${tt}}`,600,130,{size:50,frac:true})+fade(seg(p,.1,.25),L('↓ 両辺に ε₀ を 掛ける',600,215,{size:28,color:HI}))
   +TF(`${eps}\\dfrac{d${PE}}{d${tt}}=\\dfrac{d${qc}}{d${tt}}`,600,330,{size:56,frac:true,g:seg(p,.3,.5),box:true}),1);
  return s;
 },
 [K+'cons']:(p)=>{
  let s=capFig({q:.4+.4*seg(p,0,1),loop:.3,B:0,bag:.4});
  s+=fade(seg(p,.1,.3),ring(PL-22,CY,60,{color:QC,w:3,dash:'8 6'}));
  s+=cardR(TF(`\\dfrac{d${qc}}{d${tt}}=${Ic}`,925,150,{size:56,frac:true,g:seg(p,.05,.25)})+fade(seg(p,.25,.4),L('導線から 板へ 流れ込む 分だけ',925,250,{size:26})+L('板の 電荷が 増える',925,292,{size:26}))
   +fade(seg(p,.55,.7),L('電荷保存（原理）',925,380,{size:32,color:HI,weight:700})),1,HI);
  return s;
 },
 [K+'match']:(p)=>{
  let s='';
  s+=card(150,90,900,300,TF(`${eps}\\dfrac{d${PE}}{d${tt}}=\\dfrac{d${qc}}{d${tt}}=${Ic}`,600,210,{size:60,frac:true,box:true})
   +fade(seg(p,.4,.6),L('袋の 面で 足りなかった 分',600,335,{size:30,color:HI,weight:700})),seg(p,0,.15),HI);
  return s;
 },
 [K+'add']:(p)=>{
  let s=card(80,50,1040,260,L('マクスウェルが 加えた 項',600,100,{size:26,color:DIM})+T(AMP0,600,190,{size:50,opacity:1-seg(p,.2,.4)})
   +eqSplit(600,200,52,{g:seg(p,.25,.45),box:seg(p,.5,.65),boxR:1}),1);
  s+=fade(seg(p,.5,.65),L('μ₀ 倍して 右辺に 加える',600,370,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'name']:(p)=>{
  let s=card(80,40,1040,200,eqSplit(600,150,50,{box:1,boxR:1}),1);
  s+=fade(seg(p,.05,.2),card(560,280,560,170,L('変位電流',840,340,{size:34,color:HI,weight:700})+T(DISP,840,405,{size:36}),1,HI));
  s+=fade(seg(p,.5,.65),card(80,280,450,170,L('伝導電流',305,340,{size:34,color:CI,weight:700})+L('導線を 流れる 電荷の 流れ',305,405,{size:24,color:INK}),1,CI));
  return s;
 },
 // ===== S4 確かめる =====
 [K+'flatchk']:(p)=>{
  let s=capFig({loop:1,B:.4,flat:1,flatHl:1,bag:.15,E:.5});
  s+=cardR(L('平らな 面',925,90,{size:30,color:SF,weight:700})+mixed(['伝導電流',`$${Ic}$`],925,165,{size:28,color:CI})+fade(seg(p,.25,.4),L('導線の まわり：𝐄 ≈ 0',925,225,{size:26,color:EC})+L('変位電流 0',925,270,{size:28,color:HI}))
   +fade(seg(p,.55,.7),T(`${mu}\\left(${Ic}+0\\right)`,925,370,{size:46})),1,SF);
  return s;
 },
 [K+'bagchk']:(p)=>{
  let s=capFig({loop:1,B:.4,flat:.2,bag:1,bagHl:1});
  s+=cardR(L('袋の 面',925,90,{size:30,color:SF,weight:700})+L('伝導電流 0',925,165,{size:28,color:CI})+fade(seg(p,.25,.4),mixed(['変位電流',`$${Ic}$`],925,240,{size:28,color:HI}))
   +fade(seg(p,.5,.65),T(`${mu}\\left(0+${Ic}\\right)`,925,350,{size:46})),1,SF);
  return s;
 },
 [K+'same']:(p)=>{
  let s='';
  s+=card(140,70,920,330,T(`\\oint ${vB}\\cdot ${dr}`,330,200,{size:46})
   +L('平らな 面',650,140,{size:26,color:SF})+T(`=${mu}\\left(${Ic}+0\\right)`,880,140,{size:40})
   +L('袋の 面',650,240,{size:26,color:SF})+T(`=${mu}\\left(0+${Ic}\\right)`,880,240,{size:40})
   +fade(seg(p,.35,.5),L('どちらも μ₀I → 矛盾が 消えた',600,350,{size:34,color:HI,weight:700})),seg(p,0,.12),HI);
  return s;
 },
 [K+'status']:(p)=>{
  let s=card(80,40,1040,200,eqSplit(600,150,50,{box:1,boxR:1}),1);
  s+=fade(seg(p,.1,.25),card(80,280,500,170,L('計算からの 証明',330,345,{size:30,color:INK})+L('ではない',330,400,{size:30,color:BAD,weight:700}),1,BAD));
  s+=fade(seg(p,.45,.6),card(620,280,500,170,L('電荷保存と 矛盾しない',870,345,{size:28,color:INK})+L('ように 加えた 項',870,400,{size:30,color:HI,weight:700}),1,HI));
  return s;
 },
 [K+'exp']:(p)=>{
  let s=card(80,40,1040,200,eqSplit(600,150,50,{box:1,boxR:1}),1);
  s+=fade(seg(p,.1,.25),card(80,280,1040,170,L('支え：この 項から 予言された 電磁波',600,345,{size:30,color:INK})+fade(seg(p,.45,.6),L('→ のちに ヘルツの 実験で 発見',600,405,{size:32,color:HI,weight:700})),1,HI));
  return s;
 },
 [K+'num']:(p)=>{
  let s=capFig({q:.6,rightWire:1});
  s+=cardR(L('例',925,100,{size:28,color:DIM})+mixed(['電流',`$${Ic}=1${U('A')}$`],925,200,{size:34,color:CI})+fade(seg(p,.4,.55),mixed(['面積',`$S=0.01${U('m^2')}$`],925,290,{size:34})),1);
  return s;
 },
 [K+'dEdt']:(p)=>{
  let s=card(150,40,900,420,TF(`${Es}=\\dfrac{${qc}}{${eps}S}`,600,130,{size:52,frac:true})+fade(seg(p,.15,.3),mixed(['↓ 時間で 微分、',`$d${qc}/d${tt}=${Ic}$`],600,225,{size:28,color:TC}))
   +TF(`\\dfrac{d${Es}}{d${tt}}=\\dfrac{${Ic}}{${eps}S}`,600,340,{size:56,frac:true,g:seg(p,.35,.55),box:true}),1);
  return s;
 },
 [K+'dEnum']:(p)=>{
  let s=card(100,40,1000,420,TF(`\\dfrac{d${Es}}{d${tt}}=\\dfrac{${Ic}}{${eps}S}`,600,120,{size:48,frac:true})
   +TF(`=\\dfrac{1}{8.85\\times10^{-12}\\times0.01}`,600,250,{size:50,frac:true,g:seg(p,.1,.3)})
   +TF(`\\approx1.13\\times10^{13}${U('V/(m\\cdot s)')}`,600,385,{size:52,g:seg(p,.45,.65),box:true}),1);
  return s;
 },
 [K+'huge']:(p)=>{
  let s=card(100,40,1000,420,TF(`\\dfrac{d${Es}}{d${tt}}\\approx1.13\\times10^{13}${U('V/(m\\cdot s)')}`,600,140,{size:50,frac:true})
   +fade(seg(p,.2,.4),L('1秒 あたり 10兆 V/m を 超える',600,290,{size:36,color:HI,weight:700}))
   +fade(seg(p,.5,.7),L('ものすごい 増え方',600,370,{size:30,color:INK})),1);
  return s;
 },
 [K+'back']:(p)=>{
  let s=card(80,40,1040,420,L('変位電流に 戻す',600,95,{size:26,color:DIM})+TF(`${eps}\\,S\\,\\dfrac{d${Es}}{d${tt}}`,600,175,{size:50,frac:true})
   +TF(`=8.85\\times10^{-12}\\times0.01\\times1.13\\times10^{13}`,600,285,{size:46,g:seg(p,.2,.45)})
   +TF(`\\approx1.0${U('A')}`,600,390,{size:56,g:seg(p,.6,.8),box:true}),1);
  return s;
 },
 [K+'cont']:(p)=>{
  let s=capFig({q:.6,bag:.5});
  s+=fade(seg(p,.05,.25),highlight(PL+6,PT-6,PR-PL-12,PB_-PT+12));
  s+=cardR(L('導線：伝導電流 1 A',925,110,{size:28,color:CI,weight:700})+fade(seg(p,.25,.4),L('すき間：変位電流 1 A',925,190,{size:28,color:HI,weight:700}))
   +fade(seg(p,.5,.65),L('電場の 変化 として',925,290,{size:28,color:EC})+L('電流が 続く',925,340,{size:30,color:INK,weight:700})),1);
  return s;
 },
 // ===== S5 4本の法則 =====
 [K+'four']:(p)=>table({hi:[3],g:1,box4:seg(p,.6,.75)}),
 [K+'vac']:(p)=>{
  const v=seg(p,.25,.5);
  let s=fade(1-v,table({}))+fade(v,table({vac:1}));
  s+=fade(seg(p,.6,.75),highlight(590,RY(2)+8,560,88*1+0)+highlight(590,RY(3)+8,560,88));
  return s;
 },
 [K+'chainFA']:(p)=>{
  let s=fade(.3,table({vac:1,dim:[0,1]}));
  s+=fade(seg(p,.0,.15),card(60,40,520,420,L('③ ファラデー',320,100,{size:30,color:EC,weight:700})+L('磁束が 変わる',320,200,{size:30,color:CB})+L('↓',320,255,{size:32})+L('一周の 電場の 和',320,315,{size:30,color:EC,weight:700}),1,EC));
  s+=fade(seg(p,.45,.6),card(620,40,520,420,L('④ アンペール・マクスウェル',880,100,{size:26,color:CB,weight:700})+L('電気束が 変わる',880,200,{size:30,color:EC})+L('↓',880,255,{size:32})+L('一周の 磁場の 和',880,315,{size:30,color:CB,weight:700}),1,CB));
  return s;
 },
 [K+'chain']:(p)=>{
  const cx=600,cy=250;
  let s='';
  s+=card(380,40,440,110,L('磁場の 変化',600,110,{size:34,color:CB,weight:700}),seg(p,.0,.15),CB);
  s+=card(380,330,440,110,L('電場の 変化',600,400,{size:34,color:EC,weight:700}),seg(p,.15,.3),EC);
  s+=fade(seg(p,.2,.35),draw([[820,95],[930,95],[930,385],[835,385]],seg(p,.2,.4),{color:EC,w:5})+head(828,385,-1,0,{color:EC,L:20})+label('電場を 作る',945,250,{size:26,color:EC}));
  s+=fade(seg(p,.4,.55),draw([[380,385],[270,385],[270,95],[365,95]],seg(p,.4,.6),{color:CB,w:5})+head(372,95,1,0,{color:CB,L:20})+label('磁場を 作る',255,250,{size:26,color:CB,anchor:'end'}));
  s+=fade(seg(p,.7,.85),L('場が 場を 生む 連鎖',600,255,{size:34,color:HI,weight:700}));
  return s;
 },
 // ===== S6 まとめ =====
 [K+'sum1']:(p)=>{
  let s=fade(.45,capFig({loop:1,B:.4,flat:1,bag:1}));
  s+=cardR(L('まとめ ①',925,100,{size:26,color:DIM})+L('2枚の 面で 食い違い',925,190,{size:30,color:BAD,weight:700})+fade(seg(p,.35,.5),L('板に 電荷が たまる',925,280,{size:28,color:QC})+L('＝ 定常で ない',925,330,{size:28})),1);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,40,1040,420,L('まとめ ②',600,90,{size:26,color:DIM})+TF(`${eps}\\dfrac{d${PE}}{d${tt}}=${Ic}`,600,180,{size:50,frac:true})+L('電荷保存から',600,265,{size:26,color:HI})
   +fade(seg(p,.4,.6),T(AMPM,600,370,{size:48})),1);
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(380,40,440,110,L('磁場の 変化',600,110,{size:34,color:CB,weight:700}),1,CB)+card(380,330,440,110,L('電場の 変化',600,400,{size:34,color:EC,weight:700}),1,EC);
  s+=draw([[820,95],[930,95],[930,385],[835,385]],1,{color:EC,w:5})+head(828,385,-1,0,{color:EC,L:20})+draw([[380,385],[270,385],[270,95],[365,95]],1,{color:CB,w:5})+head(372,95,1,0,{color:CB,L:20});
  s+=fade(seg(p,.45,.6),L('空間を 伝わる 波？',600,255,{size:36,color:HI,weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(200,60,800,360,L('次の 問い',600,115,{size:26,color:DIM})+T(`\\oint ${vE}\\cdot ${dr}\\,,\\ \\ \\oint ${vB}\\cdot ${dr}`,600,215,{size:48})
   +L('一周の 積分から',600,305,{size:30,color:INK})+L('波の 式を どう 取り出す？',600,365,{size:34,color:HI,weight:700}),seg(p,0,.15),HI);
  return s;
 },
};
