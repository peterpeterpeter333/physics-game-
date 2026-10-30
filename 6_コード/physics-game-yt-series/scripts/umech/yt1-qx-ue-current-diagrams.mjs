// 問題編 解説「20 km の送電線」（q-ue-current、大学編 24 電流・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/24_電流.md の q-ue-current（解説 19 行）。
// 配置：上（y 120〜340）に発電所・2本の線・町、下（y 360〜505）に式・棒・誤答カード。小問3 は線の一部の拡大。札の帯（y＜78）には図を描かない。
// 色（正本）：電流 I・𝐣 緑、𝐄 水色、V送 紫、V線 赤桃、ρ・σ・R 黄、S 金、l 白、電力・熱 橙、誤り 赤。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,sentWin,cueT,note,textW} from './yt1-qx-common.mjs';

const K='qx-ue-current:';
const EC=C.x,IC=C.F,VS=C.v,VL='#ff8fb0',RC=C.hi,SC=C.t,HC=C.E,BAD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,color:C.ink,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const U=s=>`\\,\\mathrm{${s}}`;
const rho=cs(RC,'\\rho'),ll=cs(C.ink,'l'),SS=cs(SC,'S'),RR=cs(RC,'R');
// 日本語の添え字（R線・P送 など）は TeX に入れず、文字（label）で描く。parts＝[['L',文字,色] | ['T',TeX], ...] を横に並べ、中央を x に置く。
function mixRow(parts,x,y,size=40){
 const lw=(v,sz)=>[...v].reduce((a,ch)=>a+(/[²³⁴]/.test(ch)?.45:/[Il1]/.test(ch)?.34:/[ -~]/.test(ch)?.62:1.0),0)*sz;
 const ws=parts.map(([k,v])=>k==='L'?lw(v,size*.9):texWidth(v,size,false)),W=ws.reduce((a,b)=>a+b,0)+6*(parts.length-1);
 let cx=x-W/2,s='';
 parts.forEach(([k,v,col],i)=>{s+=k==='L'?label(v,cx,y+size*.32,{size:size*.9,color:col??C.ink,weight:700}):T(v,cx+ws[i]/2,y,size);cx+=ws[i]+6;});
 return s;
}
const G1='2本の線の抵抗の合計 R線',G2='線で熱になる電力 P損',G3='線の中の電場 E';
const ANS1=g=>answerTag(1,'A','13 Ω',{g}),ANS2=g=>answerTag(2,'C','3.4×10⁴ W',{g}),ANS3=g=>answerTag(3,'D','0.034 V/m',{g});

// ---- 送電の図 ---------------------------------------------------------------------------------
const LX1=175,LX2=1025,YA=200,YB=300,RX1=520,RX2=720;
function plant(g=1){
 return fade(g,rect(60,180,110,140,{fill:'#2a2f3e',fo:1,stroke:C.dim,sw:2.5,rx:6})+rect(80,140,24,42,{fill:'#2a2f3e',fo:1,stroke:C.dim,sw:2.5,rx:3})
  +label('発電所',115,355,{size:24,color:C.dim,anchor:'middle'}));
}
function town(g=1){
 let s='';for(const [x,h] of [[1045,60],[1090,85],[1135,50]])s+=rect(x-18,320-h,36,h,{fill:'#24324a',fo:1,stroke:C.dim,sw:2,rx:2})+draw([[x-22,320-h],[x,320-h-20],[x+22,320-h]],1,{color:C.dim,w:2});
 return fade(g,s+label('町',1090,355,{size:24,color:C.dim,anchor:'middle'}));
}
function lines({g=1,gA=1,gB=1,hiA=0,hiB=0,greyB=0,box=1,boxTxt='R線 ＝ ？',boxHeat=0,boxBlink=0,km=1}={}){
 let s=fade(gA,line(LX1,YA,RX1,YA,{color:hiA?C.hi:'#c89060',w:4+2*hiA})+line(RX2,YA,LX2,YA,{color:hiA?C.hi:'#c89060',w:4+2*hiA}));
 s+=fade(gB,line(LX1,YB,LX2,YB,{color:greyB?C.faint:hiB?C.hi:'#c89060',w:4+2*hiB}));
 if(km)s+=fade(gA,label('10 km',380,YA-16,{size:26,color:C.ink,anchor:'middle',weight:700}))+fade(gB,label('10 km',380,YB+36,{size:26,color:C.ink,anchor:'middle',weight:700}));
 if(box){const col=boxHeat?HC:RC;
  s+=fade(box,rect(RX1,YA-24,RX2-RX1,48,{fill:boxHeat?'#3a2410':'#2a2610',fo:1,stroke:col,sw:3+2*boxBlink,rx:6})+label(boxTxt,(RX1+RX2)/2,YA+9,{size:24,color:col,anchor:'middle',weight:700}));
  if(boxHeat)for(let k=0;k<3;k++){const x=RX1+30+k*40;s+=fade(boxHeat,draw(Array.from({length:12},(_,i)=>[x+6*Math.sin(i*1.1+k),YA-30-i*4]),1,{color:HC,w:3}));}
 }
 return fade(g,s);
}
const vSend=(g=1)=>fade(g,line(205,YA+8,205,YB-8,{color:VS,w:3})+line(195,YA+8,215,YA+8,{color:VS,w:3})+line(195,YB-8,215,YB-8,{color:VS,w:3})
 +label('V送 ＝ 40 kV',222,YA+60,{size:26,color:VS,weight:700}));
const power=(g=1)=>fade(g,label('2 MW',115,128,{size:28,color:HC,anchor:'middle',weight:700}));
function inset(g=1){
 return fade(g,ring(520,430,34,{color:SC,w:3,fill:'#2a2410'})+label('25 mm²',570,440,{size:26,color:SC,weight:700})
  +label('ρ ＝ 1.68×10⁻⁸ Ω·m',700,440,{size:26,color:RC,weight:700})+label('線の 断面',520,490,{size:22,color:C.dim,anchor:'middle'}));
}
const figure=(o={})=>plant()+town()+lines(o)+vSend(o.vs??1)+power(o.pw??1);
// 電流の矢印（往きは右、帰りは左）
const iArrows=(g=1,txt='50 A')=>fade(g,arrow(780,YA-14,900,YA-14,{color:IC,w:5,head:16})+arrow(900,YB-14,780,YB-14,{color:IC,w:5,head:16})
 +label(txt,840,YA-30,{size:26,color:IC,anchor:'middle',weight:700})+label(txt,840,YB-30,{size:26,color:IC,anchor:'middle',weight:700}));
// 棒（左端 x0、2 MW を長さ L）
function bars({g=1,x0=230,y=400,L=700,loss=1,lossW=33600,lossTxt='≈ 3.4×10⁴ W（約 1.7%）',big=0}={}){
 let s=label('送る 2 MW',x0-14,y+10,{size:24,color:HC,anchor:'end',weight:700})+rect(x0,y-14,L,28,{fill:HC,fo:.5,stroke:HC,sw:2,rx:4});
 s+=fade(loss,label('P損',x0-14,y+62,{size:24,color:HC,anchor:'end',weight:700})+rect(x0,y+38,Math.max(3,L*lossW/2e6),28,{fill:HC,fo:.9,stroke:HC,sw:2,rx:2})
  +label(lossTxt,x0+Math.max(3,L*lossW/2e6)+14,y+62,{size:24,color:C.ink}));
 return fade(g,s);
}
// ---- 小問3：線の一部の拡大 ----------------------------------------------------------------------
const ZX1=150,ZX2=880,ZY=190,ZH=62;
function zoomWire({g=1,j=0,e=0,jl=0}={}){
 let s=rect(ZX1,ZY-ZH,ZX2-ZX1,2*ZH,{fill:'#b87a4a',fo:.14,stroke:'#c89060',sw:2.5,rx:0});
 s+=`<ellipse cx="${ZX1}" cy="${ZY}" rx="22" ry="${ZH}" fill="#3a2410" stroke="${SC}" stroke-width="3"/>`+`<path d="M${ZX2} ${ZY-ZH} a22 ${ZH} 0 0 1 0 ${2*ZH}" fill="none" stroke="#c89060" stroke-width="2.5"/>`;
 s+=label('S',ZX1,ZY+ZH+32,{size:26,color:SC,anchor:'middle',weight:700});
 for(let r=0;r<3;r++)for(let k=0;k<4;k++){const x=ZX1+80+k*170,y=ZY-34+r*34;
  s+=fade(j,arrow(x,y,x+110,y,{color:IC,w:4,head:14}));
  s+=fade(e,arrow(x+20,y+12,x+130,y+12,{color:EC,w:3,head:12}));}
 s+=fade(jl,label('𝐣 ＝ 電流密度',ZX2+40,ZY-12,{size:26,color:IC,weight:700})+label('（1 m² あたりの 電流）',ZX2+40,ZY+24,{size:22,color:IC}));
 s+=fade(e,label('𝐄',ZX2+40,ZY+70,{size:30,color:EC,weight:700})+label('（𝐣 と 同じ 向き）',ZX2+80,ZY+70,{size:22,color:EC}));
 return fade(g,s);
}

export const ytQxUeCurrentDiagrams={
 // ===================== 問題アニメ（6 秒＋静止） =====================
 // 0〜3 s：発電所・町、2本の線が左から右へ伸びる、各線に「10 km」。3〜5 s：R線＝？ の箱、V送＝40 kV、2 MW。5〜6 s：断面の拡大「25 mm²」と ρ。
 [K+'q0']:(p)=>{
  const a=seg(p,.12,.45);
  let s=plant(seg(p,0,.12))+town(seg(p,0,.12));
  s+=line(LX1,YA,mix(LX1,LX2,a),YA,{color:'#c89060',w:4})+line(LX1,YB,mix(LX1,LX2,a),YB,{color:'#c89060',w:4});
  s+=fade(seg(p,.42,.5),label('10 km',380,YA-16,{size:26,color:C.ink,anchor:'middle',weight:700})+label('10 km',380,YB+36,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.62),rect(RX1,YA-24,RX2-RX1,48,{fill:'#2a2610',fo:1,stroke:RC,sw:3,rx:6})+label('R線 ＝ ？',(RX1+RX2)/2,YA+9,{size:24,color:RC,anchor:'middle',weight:700}));
  s+=vSend(seg(p,.6,.72))+power(seg(p,.68,.8))+inset(seg(p,.84,.96));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 往きの線と帰りの線を順に光らせ「10 km＋10 km」
 [K+'intro']:(p)=>{
  const hA=seg(p,.3,.4)*(1-seg(p,.55,.62)),hB=seg(p,.55,.65)*(1-seg(p,.8,.88));
  let s=figure({hiA:hA,hiB:hB})+inset();
  s+=fade(seg(p,.7,.8),label('10 km ＋ 10 km ＝ 20 km',600,YB+66,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // 2. 求めるもの。R線 の箱を黄で点滅
 [K+'goal1']:(p,ctx)=>{
  const bl=seg(p,.1,.2)*(.5+.5*Math.sin(cueT(ctx)*6));
  return figure({boxBlink:bl})+inset()+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 3. 記号を図に（l・S・ρ）→ 図を消して R＝ρl/S、長さ2倍・断面2倍の小さな図
 [K+'rho']:(p)=>{
  const cA=1-seg(p,.4,.46),cB=seg(p,.44,.5);
  let a=figure()+inset();
  a+=fade(seg(p,.05,.12),label('l ＝ 線の 長さ',780,(YA+YB)/2+9,{size:26,color:C.ink,anchor:'middle',weight:700}));
  a+=fade(seg(p,.12,.2),rect(440,472,160,30,{fill:C.bg,fo:1,stroke:'none'})+label('S ＝ 断面積',520,492,{size:24,color:SC,anchor:'middle',weight:700}));
  a+=fade(seg(p,.2,.28),label('（材料で 決まる）',700,480,{size:22,color:RC}));
  let s=fade(cA,a);
  let b=label('抵抗率 ρ（材料で 決まる）',600,108,{size:24,color:RC,anchor:'middle'})+T(`${RR}=\\dfrac{${rho}\\,${ll}}{${SS}}`,600,215,56);
  // 長さ 2倍 → 箱が直列に2つ／断面 2倍 → 線が並列に2本
  const box=(x,y)=>rect(x,y-18,90,36,{fill:'#2a2610',fo:1,stroke:RC,sw:2.5,rx:4});
  b+=fade(seg(p,.6,.7),card(120,300,450,190,label('長さ 2倍',345,340,{size:26,color:C.ink,anchor:'middle',weight:700})
   +line(150,410,540,410,{color:'#c89060',w:3})+box(200,410)+box(380,410)+label('箱が 直列に 2つ → R は 2倍',345,465,{size:22,color:C.dim,anchor:'middle'}),1));
  b+=fade(seg(p,.72,.82),card(630,300,450,190,label('断面 2倍',855,340,{size:26,color:C.ink,anchor:'middle',weight:700})
   +line(660,390,1050,390,{color:'#c89060',w:3})+line(660,430,1050,430,{color:'#c89060',w:3})+box(810,390)+box(810,430)
   +label('線が 並列に 2本 → R は 半分',855,475,{size:22,color:C.dim,anchor:'middle'}),1));
  s+=fade(cB,b);
  return s+goalTag(G1);
 },
 // 4. 換算を2つの枠で
 [K+'units']:(p)=>{
  let s=card(110,110,460,200,label('長さ',340,155,{size:26,color:C.dim,anchor:'middle'})+label('2×10 km',340,210,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('＝ 2×10⁴ m',340,265,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.03,.15),C.ink);
  s+=card(630,110,460,200,label('面積',860,155,{size:26,color:C.dim,anchor:'middle'})+label('25 mm²',860,210,{size:32,color:SC,anchor:'middle',weight:700})
   +label('＝ 2.5×10⁻⁵ m²',860,265,{size:34,color:SC,anchor:'middle',weight:700}),seg(p,.45,.57),SC);
  s+=note('1 mm² ＝ 10⁻⁶ m²',860,350,{g:seg(p,.55,.65)});
  return s+goalTag(G1);
 },
 // 5. 計算を一行ずつ → 2文目で図に戻り、箱に「13 Ω」、答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,cA=1-seg(p,b-.04,b),cB=seg(p,b-.02,b+.04);
  let a=mixRow([['L','R線',RC],['T',`=\\dfrac{${rho}\\,${ll}}{${SS}}`]],600,160,44);
  a+=fade(seg(p,.05,.18),T(`=\\dfrac{1.68\\times10^{-8}\\times2\\times10^{4}}{2.5\\times10^{-5}}`,600,290,40));
  a+=fade(seg(p,.25,.38),T(`\\approx13.4${U('\\Omega')}`,600,410,46,{color:RC}));
  let s=fade(cA,a);
  s+=fade(cB,figure({boxTxt:'R線 ＝ 13 Ω'})+note('（13.44 Ω）',(RX1+RX2)/2,YA+58));
  return s+goalTag(G1)+ANS1(seg(p,b+.05,b+.12));
 },
 // 6. 誤答 B・C（1文目）→ D（2文目）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.45,w=[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]];
  let s=figure({boxTxt:'R線 ＝ 13 Ω'});
  s+=wrongSeq(p,ctx,[['B','6.7 Ω','線 1本だけ'],['C','1.3×10⁻⁵ Ω','mm² のまま'],['D','2.1×10⁻¹⁷',['ρS/l と 逆（単位 Ω·m²）']]],{win:w,opts:{y:380}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>figure({boxTxt:'R線 ＝ 13 Ω'})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 8. P送＝V送 I → I＝50 A。線に緑の矢印
 [K+'cur']:(p)=>{
  let s=figure({boxTxt:'R線 ＝ 13 Ω'})+iArrows(seg(p,.55,.68));
  s+=fade(seg(p,.05,.18),mixRow([['L','P送',HC],['T','='],['L','V送',VS],['L','I',IC]],300,440,40));
  s+=fade(seg(p,.25,.38),T(`${cs(IC,'I')}=\\dfrac{2\\times10^{6}}{4\\times10^{4}}=${cs(IC,`50${U('A')}`)}`,820,440,40));
  return s+goalTag(G2);
 },
 // 9. R線 の箱が橙に光り、熱の波線。P損＝I²R線
 [K+'heat']:(p)=>{
  let s=figure({boxTxt:'R線 ＝ 13 Ω',boxHeat:seg(p,.1,.3)})+iArrows();
  s+=fade(seg(p,.35,.5),mixRow([['L','P損',HC],['T','='],['L','I²',IC],['L','R線',RC]],600,440,48));
  return s+goalTag(G2);
 },
 // 10. 2500×13.44＝33600≈3.4×10⁴ W → 棒（2 MW と P損）。2文目で答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.65,c1=1-seg(p,.3,.36),c2=seg(p,.34,.42);
  let s=figure({boxTxt:'R線 ＝ 13 Ω',boxHeat:1})+iArrows();
  s+=fade(c1,T(`50^2\\times13.44=33600\\approx${cs(HC,`3.4\\times10^{4}${U('W')}`)}`,600,440,40));
  s+=fade(c2,bars({y:400}));
  return s+goalTag(G2)+ANS2(seg(p,b,b+.08));
 },
 // 11. 誤答 A：1.2×10⁸ W の棒が 2 MW を大きく超えて伸び、赤い ×
 [K+'wrongA']:(p,ctx)=>{
  const grow=seg(p,.1,.45),x0=230,L=420;
  let s=label('送る 2 MW',x0-14,140,{size:24,color:HC,anchor:'end',weight:700})+rect(x0,116,L,28,{fill:HC,fo:.5,stroke:HC,sw:2,rx:4});
  s+=label('誤答 A',x0-14,212,{size:24,color:BAD,anchor:'end',weight:700})+rect(x0,188,mix(L*.3,1180-x0,grow),28,{fill:BAD,fo:.35,stroke:BAD,sw:2,rx:4});
  s+=fade(seg(p,.4,.5),label('1.2×10⁸ W',x0+10,250,{size:26,color:BAD,weight:700})+line(940,170,1010,235,{color:BAD,w:6})+line(1010,170,940,235,{color:BAD,w:6}));
  s+=wrongCard('A','1.2×10⁸ W','V送 を V²/R に 入れた',{y:320,g:seg(p,.45,.55)});
  return s+goalTag(G2)+ANS2(1);
 },
 // 12. V線＝672 V を赤桃の寸法線で（V送 の紫とは別の位置・別の色）。672²÷13.44 を小さく。2文目で誤答 B
 [K+'wrongB']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,cA=1-seg(p,b-.04,b);
  let s=figure({boxTxt:'R線 ＝ 13 Ω'})+iArrows();
  const yv=YA-62;
  s+=fade(seg(p,.1,.25),line(RX1,yv,RX2,yv,{color:VL,w:3})+line(RX1,yv-10,RX1,yv+10,{color:VL,w:3})+line(RX2,yv-10,RX2,yv+10,{color:VL,w:3})
   +label('V線 ＝ IR線 ＝ 672 V',(RX1+RX2)/2,yv-16,{size:26,color:VL,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.3,.42)*cA,T(`\\dfrac{${cs(VL,'672')}^2}{13.44}=33600\\approx3.4\\times10^{4}${U('W')}`,600,440,36));
  s+=wrongCard('B','672',['V線 を 電力と 取り違えた（単位 V）'],{y:380,g:seg(p,b+.01,b+.06)});
  return s+goalTag(G2)+ANS2(1);
 },
 // 13. 誤答 D。帰りの線を一瞬灰色にして戻す
 [K+'wrongD']:(p)=>{
  const gr=seg(p,.2,.28)*(1-seg(p,.6,.68));
  let s=figure({boxTxt:'R線 ＝ 13 Ω',greyB:gr>.5?1:0})+iArrows();
  s+=wrongCard('D','1.7×10⁴ W','線 1本の 抵抗だけ',{y:380,g:seg(p,.03,.1)});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>zoomWire({g:seg(p,0,.15)})+label('線の 一部を 拡大',ZX1,ZY+ZH+70,{size:22,color:C.dim})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 切り口に 𝐣 の札 → 緑の矢印 𝐣、「2×10⁶ A/m²」
 [K+'jden']:(p)=>{
  let s=zoomWire({jl:seg(p,.03,.15),j:seg(p,.2,.35)});
  s+=fade(seg(p,.3,.45),T(`${cs(IC,'j')}=\\dfrac{${cs(IC,'I')}}{${SS}}=\\dfrac{50}{2.5\\times10^{-5}}=${cs(IC,`2\\times10^{6}${U('A/m^2')}`)}`,600,410,40));
  return s+goalTag(G3);
 },
 // 16. 𝐄 を 𝐣 と同じ向きに。σ の札 → E＝j/σ＝ρj を一行ずつ
 [K+'efield']:(p)=>{
  let s=zoomWire({jl:1,j:1,e:seg(p,.05,.18)});
  s+=fade(seg(p,.15,.25),label('σ ＝ 電気伝導率（σ ＝ 1/ρ）',ZX1+50,ZY+ZH+40,{size:24,color:RC,weight:700}));
  s+=fade(seg(p,.25,.35),T(`${cs(EC,'E')}=\\dfrac{${cs(IC,'j')}}{${cs(RC,'\\sigma')}}=${rho}\\,${cs(IC,'j')}`,330,420,40));
  s+=fade(seg(p,.45,.6),T(`=1.68\\times10^{-8}\\times2\\times10^{6}=0.0336\\approx${cs(EC,`0.034${U('V/m')}`)}`,820,420,32));
  return s+goalTag(G3);
 },
 // 17. 二通り（ρj と V線/l）を左右に並べて「一致」。2文目で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=zoomWire({jl:0,j:1,e:1});
  s+=card(80,330,480,130,label('𝐣＝σ𝐄 から',320,368,{size:24,color:C.dim,anchor:'middle'})+T(`${rho}\\,${cs(IC,'j')}=0.0336${U('V/m')}`,320,420,36),1,C.faint);
  s+=card(640,330,480,130,label('線に 沿う 電圧の 下がり から',880,368,{size:24,color:C.dim,anchor:'middle'})
   +mixRow([['L','V線',VL],['L','÷ l',C.ink],['T',`=\\dfrac{672}{2\\times10^{4}}=0.0336`]],880,425,30),seg(p,.05,.2),C.faint);
  s+=fade(seg(p,.4,.5),label('一致',600,410,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G3)+ANS3(seg(p,b,b+.08));
 },
 // 18. V送 のカードに赤い ×。誤答 A・B（1文目）→ C（2文目）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5,w=[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]];
  const gA=seg(p,.02,.08)*(1-seg(p,m-.04,m));
  let s=zoomWire({j:1,e:1});
  s+=fade(gA,card(70,350,300,90,label('V送 ＝ 40 kV',220,405,{size:28,color:VS,anchor:'middle',weight:700}),1,VS)+line(90,360,350,430,{color:BAD,w:5})+line(350,360,90,430,{color:BAD,w:5}));
  s+=wrongSeq(p,ctx,[['A','2.0 V/m','V送 を 長さで 割った'],['B','0.067 V/m','V線 を 1本の 長さで 割った'],['C','1.2×10¹⁴',['j/ρ と した（単位も V/m に ならない）']]],{win:w,opts:{x:420,w:740,y:345}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 19. I：50 A → 10 A、損失の棒が 1/25 に（33600 W → 1344 W）。最後に P損＝I²R線 を中央に
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,u=seg(p,.1,.4);
  let s=label('40 kV',380,130,{size:30,color:VS,anchor:'middle',weight:700})+fade(seg(p,.03,.1),label('→ 200 kV',520,130,{size:30,color:VS,anchor:'middle',weight:700}));
  const x0=300,L=600;
  s+=label('電流 I',x0-20,200,{size:26,color:IC,anchor:'end',weight:700})+rect(x0,178,L*mix(1,.2,u),30,{fill:IC,fo:.6,stroke:IC,sw:2,rx:4})
   +label(u<.5?'50 A':'10 A（1/5）',x0+L*mix(1,.2,u)+14,202,{size:26,color:IC,weight:700});
  s+=label('損失 P損',x0-20,270,{size:26,color:HC,anchor:'end',weight:700})+rect(x0,248,L*mix(1,1/25,u),30,{fill:HC,fo:.7,stroke:HC,sw:2,rx:4})
   +label(u<.5?'33600 W':'1344 W（1/25）',x0+L*mix(1,1/25,u)+14,272,{size:26,color:HC,weight:700});
  s+=fade(seg(p,b,b+.1),mixRow([['L','P損',HC],['T','='],['L','I²',IC],['L','R線',RC]],600,390,52));
  return s+answerRow([[1,'A',''],[2,'C',''],[3,'D','']],{g:seg(p,b+.15,b+.25)});
 },
};
