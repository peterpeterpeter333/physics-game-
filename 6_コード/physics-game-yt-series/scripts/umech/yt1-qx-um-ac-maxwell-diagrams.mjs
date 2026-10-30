// 問題編 解説「60 Hz のコイルとコンデンサ、すき間の電流」（q-um-ac-maxwell、大学編 29 マクスウェル方程式・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/29_マクスウェル方程式.md の q-um-ac-maxwell（解説 21 行）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色（正本・単元動画どおり）：電流 I 緑、電圧 V 紫、電荷 q 桃、容量 C 黄、時間 t 金、位相差 橙、𝐄 水色、電気束・強調 黄、面積 S 金、ω・L・ε₀・μ₀ 白、誤り 赤。
// 単元動画（yt1-um-ac-maxwell-1）のコイル・コンデンサの記号を import して使う。グラフは、目盛りの文字を 22px 以上にするため、ここで描く。
// 図のために決めた値：グラフの横軸は u＝t/T（0〜1.15 周期）、振幅は図の都合（値は出さない）。行12 は電流の振幅を同じにして、周波数を 60→120 Hz に変える。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth} from './anim.mjs';
import {IC,VC,TC,PH,cs,TAU} from './yt1-ui-ac-waves-1-diagrams.mjs';
import {coilV,capV,acSource} from './yt1-um-ac-maxwell-1-diagrams.mjs';
import {OI} from './yt1-um-gauss-sphere-preview-1-diagrams.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin,cueT,tAt} from './yt1-qx-common.mjs';

const K='qx-um-ac-maxwell:';
const QC=C.p,CC=C.hi,EC=C.x,SC=C.t,PHI=C.hi,HI=C.hi,BC=C.E,FC=C.p;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const tI=cs(IC,'I'),tI0=cs(IC,'I_0'),tV=cs(VC,'V'),tV0=cs(VC,'V_0'),tt=cs(TC,'t'),tq=cs(QC,'q'),tC=cs(CC,'C'),tE=cs(EC,'E'),tS=cs(SC,'S');
const eps='\\varepsilon_0',mu='\\mu_0',wt=`\\omega ${tt}`;
const G1='電圧の振幅と位相',G2='V₀/I₀（60 Hz と 120 Hz）',G3='すき間の変位電流';
const ANS1=g=>answerTag(1,'A','47 V、π/2 進む',{g}),ANS2=g=>answerTag(2,'B','53 Ω、27 Ω',{g}),ANS3=g=>answerTag(3,'D','0.3 A',{g});

// 式を部分ごとに横に並べる（部分の位置を返す。枠や打ち消し線を重ねるため）
function row(parts,cx,y,size=44,{gs=[]}={}){
 const ws=parts.map(q=>texWidth(q,size,false)),W=ws.reduce((a,b)=>a+b,0);let x=cx-W/2,s='';const spans=[];
 parts.forEach((q,i)=>{spans.push([x,ws[i]]);s+=fade(gs[i]??1,T(q,x,y,size,{anchor:'start'}));x+=ws[i];});
 return {svg:s,spans,size};
}
const box=(sp,y,size,g=1,col=HI)=>highlight(sp[0]-1,y-size*1.15,sp[1]+4,size*1.9,g,col);

// ---- 時間のグラフ（横軸 u＝t/T）----
function gpanel(cy,{x=150,w=600,amp=60,umax=1.15,name='',col=IC,g=1,grid=0,gridLab=1}={}){
 const X=u=>x+w*u/umax;
 let s='';
 if(grid)[.25,.5,.75,1].forEach((u,i)=>{s+=line(X(u),cy-amp-12,X(u),cy+amp+12,{color:C.grid,w:1.5})+(gridLab?label(['T/4','T/2','3T/4','T'][i],X(u),cy+amp+38,{size:22,color:TC,anchor:'middle'}):'');});
 s+=arrow(x-8,cy,X(umax)+26,cy,{color:C.dim,w:2.5,head:12})+line(x,cy-amp-14,x,cy+amp+14,{color:C.dim,w:2.5})+label('t',X(umax)+34,cy+9,{size:26,color:TC,weight:700});
 if(name)s+=label(name,x-16,cy+10,{size:28,color:col,anchor:'end',weight:700});
 return {svg:fade(g,s),X,Y:v=>cy-amp*v};
}
const gcurve=(P,f,{p=1,color=IC,w=5,from=0,to=1.15}={})=>draw(Array.from({length:181},(_,i)=>{const u=from+(to-from)*i/180;return [P.X(u),P.Y(f(u))];}),p,{color,w});
const sI=u=>Math.sin(TAU*u),cV=u=>Math.cos(TAU*u),mq=u=>-Math.cos(TAU*u);

// コイル・コンデンサの回路（左に交流電源、右に部品）
function loop(el,{x1=80,x2=300,y1=120,y2=360,g=1,lab=[]}={}){
 const my=(y1+y2)/2;
 let s=draw([[x1,my-40],[x1,y1],[x2,y1],[x2,my-70]],1,{color:C.dim,w:4})+draw([[x2,my+70],[x2,y2],[x1,y2],[x1,my+40]],1,{color:C.dim,w:4});
 if(el==='coil')s+=coilV(x2,my-70,my+70,{n:5});
 else s+=line(x2,my-70,x2,my-11,{color:C.dim,w:4})+line(x2,my+11,x2,my+70,{color:C.dim,w:4})+capV(x2,my,{color:CC});
 s+=acSource(x1,my,{r:34});
 s+=arrow((x1+x2)/2-50,y1-24,(x1+x2)/2+50,y1-24,{color:IC,w:5,head:14})+label('I',(x1+x2)/2,y1-40,{size:26,color:IC,anchor:'middle',weight:700});
 lab.forEach(([t,c],i)=>{s+=label(t,x2+50,my-50+i*42,{size:26,color:c,weight:700});});
 return fade(g,s);
}
// 平行板コンデンサ（横から見た図）。q＝電荷の量 0〜1、E＝すき間の電場の矢印 0〜1、dots＝導線を進む電荷の点（時刻）
function plates({x1=470,x2=580,cy=270,h=230,g=1,q=.5,E=0,Elen=1,cur=1,curLab='0.3 A',dots=null,S=0,Q=0,disp=0,wl=120,wr=1080}={}){
 const pt=cy-h/2,pb=cy+h/2;
 let s=line(wl,cy,x1,cy,{color:C.dim,w:6})+line(x2,cy,wr,cy,{color:C.dim,w:6});
 s+=rect(x1-10,pt,10,h,{fill:C.ink,fo:.8,stroke:C.ink,sw:1,rx:2})+rect(x2,pt,10,h,{fill:C.ink,fo:.8,stroke:C.ink,sw:1,rx:2});
 const n=Math.round(1+5*q);
 for(let k=0;k<n;k++){const y=pt+16+k*(h-32)/Math.max(1,n-1);s+=label('＋',x1-28,y+9,{size:24,color:QC,anchor:'middle',weight:700})+label('−',x2+28,y+9,{size:26,color:QC,anchor:'middle',weight:700});}
 if(E>0){for(let k=0;k<5;k++){const y=pt+24+k*(h-48)/4,Lx=(x2-x1-24)*Elen,xm=(x1+x2)/2;if(Lx>10)s+=fade(E,arrow(xm-Lx/2,y,xm+Lx/2,y,{color:EC,w:3.5,head:11}));}
  s+=fade(E,label('𝐄',(x1+x2)/2,pt-16,{size:28,color:EC,anchor:'middle',weight:700}));}
 if(cur){const a0=wl+Math.max(15,(x1-wl)*.15),a1=x1-Math.max(40,(x1-wl)*.2),b0=x2+40,b1=Math.min(wr-15,x2+40+(a1-a0));
  s+=arrow(a0,cy-28,a1,cy-28,{color:IC,w:6,head:16})+label(curLab,(a0+a1)/2,cy-48,{size:28,color:IC,anchor:'middle',weight:700});
  if(b1-b0>40)s+=arrow(b0,cy-28,b1,cy-28,{color:IC,w:6,head:16});}
 if(dots!==null){for(let k=0;k<6;k++){const u=((dots*.5+k/6)%1),x=mix(wl,x1-14,u);s+=dot(x,cy,7,QC);}}
 if(S)s+=fade(S,line(x1-50,pt,x1-50,pb,{color:SC,w:4})+label('S ＝ 板の 面積',x1-62,pt+30,{size:26,color:SC,anchor:'end',weight:700}));
 if(Q)s+=fade(Q,label('q ＝ 板の 電荷',x1-62,pb-10,{size:26,color:QC,anchor:'end',weight:700}));
 if(disp)s+=fade(disp,rect(x1+2,pt-6,x2-x1-4,h+12,{fill:HI,fo:.12,stroke:HI,sw:3,rx:6})+label('変位電流',(x1+x2)/2,pb+40,{size:28,color:HI,anchor:'middle',weight:700}));
 return fade(g,s);
}

// ---- 4本の法則の表（④の右辺の 2項目を光らせられる）----
const vE=cs(EC,'\\mathbf{E}'),vB=cs(BC,'\\mathbf{B}'),dA=cs(SC,'d\\mathbf{A}'),dr=cs(SC,'d\\mathbf{r}'),QQ=cs(QC,'Q');
const PB=cs(PHI,'\\Phi_B'),PE=cs(PHI,'\\Phi_E'),OS=OI.replace('_S','');
const LAWS=[
 ['① 電場のガウス',EC,[`${OS}${vE}\\cdot${dA}=\\dfrac{${QQ}}{${eps}}`]],
 ['② 磁場のガウス',BC,[`${OS}${vB}\\cdot${dA}=0`]],
 ['③ ファラデー',EC,[`\\oint${vE}\\cdot${dr}=-\\dfrac{d${PB}}{d${tt}}`]],
 ['④ アンペール・マクスウェル',BC,[`\\oint${vB}\\cdot${dr}=${mu}${tI}+{}`,`${mu}${eps}\\dfrac{d${PE}}{d${tt}}`]],
];
function lawTable({hi=0,g=1,dim=1}={}){
 let s='';
 LAWS.forEach(([name,col,eq],i)=>{const y=84+i*98,last=i===3;
  let r=rect(30,y,1140,90,{fill:'#131f38',fo:.96,stroke:last?HI:C.faint,sw:last?3:2,rx:12})+label(name,50,y+56,{size:26,color:col,weight:700});
  const R=row(eq,830,y+50,last?32:34);r+=R.svg;
  if(last)r+=box(R.spans[1],y+50,32,hi);
  s+=fade(last?1:(1-.55*dim*hi),r);});
 return fade(g,s);
}

// ---- 問題アニメ：左にコイル、中央にコンデンサ、右に充電中の平行板 ----
function quizFig(p){
 let s='';
 const g1=seg(p,0,.08),g2=seg(p,.33,.41),g3=seg(p,.67,.75);
 // 左：コイル
 s+=fade(g1,coilV(110,105,245,{n:5})+line(110,85,110,105,{color:C.dim,w:4})+line(110,245,110,265,{color:C.dim,w:4})
  +label('L ＝ 0.25 H',160,125,{size:26,color:C.ink,weight:700})+label('60 Hz',160,170,{size:26,color:FC,weight:700})+label('I₀ ＝ 0.5 A',160,215,{size:26,color:IC,weight:700}));
 const P1=gpanel(400,{x:80,w:280,amp:55,name:'I',g:g1});s+=P1.svg+gcurve(P1,sI,{p:seg(p,.03,.3)});
 // 中央：コンデンサ
 s+=fade(g2,line(500,85,500,164,{color:C.dim,w:4})+capV(500,175,{color:CC})+line(500,186,500,265,{color:C.dim,w:4})+label('C ＝ 50 μF',560,185,{size:26,color:CC,weight:700}));
 const P2=gpanel(400,{x:480,w:280,amp:55,name:'I',g:g2});s+=P2.svg+gcurve(P2,sI,{p:seg(p,.36,.64)});
 // 右：充電中の平行板（すき間の電場は描かない）
 s+=fade(g3,plates({x1:1020,x2:1080,cy:290,h:170,q:.5,E:0,wl:830,wr:1185,curLab:'0.3 A'}));
 s+=fade(g3,note('真空',1050,410));
 return s;
}

export const ytQxUmAcMaxwellDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6秒）：0〜2 s コイルと電流のグラフ、2〜4 s コンデンサと電流のグラフ、4〜6 s 充電中の平行板と 0.3 A。電圧・電荷・電場は描かない。
 [K+'q1']:(p)=>quizFig(p),

 // ===================== 小問1 =====================
 // 1. コイルと電流の sin のグラフ。求めるもの：電圧の振幅と位相
 [K+'goal1']:(p)=>{
  let s=loop('coil',{lab:[['L ＝ 0.25 H',C.ink],['60 Hz',FC],['I₀ ＝ 0.5 A',IC]],g:seg(p,0,.1)});
  const P=gpanel(290,{x:560,w:540,amp:90,name:'I',col:IC,g:seg(p,.05,.15)});
  s+=P.svg+gcurve(P,sI,{p:seg(p,.1,.6)});
  s+=fade(seg(p,.45,.6),label('I ＝ I₀ sin ωt',830,455,{size:28,color:IC,anchor:'middle',weight:700}));
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. 法則 V＝L dI/dt。dI/dt を黄の枠
 [K+'law']:(p)=>{
  let s=fade(.7,loop('coil',{x1:70,x2:250,y1:130,y2:350,lab:[['L',C.ink]]}));
  s+=card(420,95,740,390,'',seg(p,0,.08));
  s+=kindTag('法則',790,145,{g:seg(p,.02,.1)});
  const R=row([`${tV}=L\\,`,`\\dfrac{d${tI}}{d${tt}}`],790,250,56);
  s+=fade(seg(p,.05,.15),R.svg)+box(R.spans[1],250,56,seg(p,.3,.4));
  s+=fade(seg(p,.3,.4),L('電流の 変化の 速さ',R.spans[1][0]+R.spans[1][1]/2,345,{size:24,color:HI,weight:700}));
  s+=fade(seg(p,.5,.62),T(`${tI}=${tI0}\\sin ${wt}`,790,420,44)+L('を 時間で 微分',1040,425,{size:24,color:C.dim}));
  return s+goalTag(G1);
 },
 // 3. 微分を一操作で：sin ωt → ω cos ωt。ω を黄の枠
 [K+'diff']:(p)=>{
  let s=label('I₀ sin ωt を 時間で 微分',600,130,{size:28,color:C.dim,anchor:'middle'});
  const R=row([`\\dfrac{d}{d${tt}}\\left(${tI0}\\sin ${wt}\\right)=\\;`,`\\omega`,`\\,${tI0}\\cos ${wt}`],600,230,50,{gs:[1,seg(p,.12,.22),seg(p,.12,.22)]});
  s+=R.svg+box(R.spans[1],230,50,seg(p,.2,.3));
  s+=fade(seg(p,.25,.35),L('中身の 倍率 ω',R.spans[1][0]+R.spans[1][1]/2,320,{size:26,color:HI,weight:700}));
  s+=fade(seg(p,.5,.62),T(`${tV}=L\\,\\dfrac{d${tI}}{d${tt}}=\\omega L${tI0}\\cos ${wt}`,600,420,50));
  return s+goalTag(G1);
 },
 // 4. ω≈377 rad/s、振幅 377×0.25×0.5≈47 V
 [K+'V0']:(p)=>{
  let s=card(180,100,840,380,'',1);
  s+=fade(seg(p,0,.1),T(`\\omega=2\\pi\\times60\\approx377\\ \\mathrm{rad/s}`,600,175,42));
  s+=fade(seg(p,.25,.38),L('振幅',300,295,{size:28,color:VC,weight:700})+T(`${tV0}=\\omega L${tI0}`,600,290,46));
  s+=fade(seg(p,.45,.58),T(`=377\\times0.25\\times0.5\\approx${cs(VC,'47\\ \\mathrm{V}')}`,600,400,46));
  return s+goalTag(G1);
 },
 // 5. t＝0 の接線（黄）、電圧（紫、cos）、t＝0 の縦線で電圧の山。電圧の山が 1/4 周期早い（橙の両矢印 π/2）
 [K+'graphs']:(p,ctx)=>graphs15(p,ctx,{}),
 // 6. 小問1 の答え A
 [K+'ans1']:(p,ctx)=>graphs15(1,ctx,{})+ANS1(seg(p,.05,.2)),
 // 7. 誤答 B → C（1枚ずつ）
 [K+'wrong1']:(p,ctx)=>small1()+wrongSeq(p,ctx,[['B','47 V、π/2 遅れる','微分は 進み、積分は 遅れ'],['C','7.5 V','ω でなく 60 を 掛けた']])+goalTag(G1)+ANS1(1),
 // 8. 誤答 D（0.125 V）
 [K+'wrongD']:(p)=>small1()+wrongCard('D','0.125 V','LI₀（ω がない。単位 Wb）',{g:seg(p,.03,.1)})+goalTag(G1)+ANS1(1),

 // ===================== 小問2 =====================
 // 9. コンデンサと電流のグラフ。求めるもの：V₀/I₀（60 Hz と 120 Hz）
 [K+'goal2']:(p)=>{
  let s=loop('cap',{lab:[['C ＝ 50 μF',CC],['60 Hz',FC]],g:seg(p,0,.1)});
  const P=gpanel(290,{x:560,w:540,amp:90,name:'I',col:IC,g:seg(p,.05,.15)});
  s+=P.svg+gcurve(P,sI,{p:seg(p,.1,.6)});
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 10. 定義 I＝dq/dt。電流（sin）の下に電荷（桃、−cos）。q を微分すると I に戻る確かめ
 [K+'q']:(p,ctx)=>{
  // 2026-10-16（PQ-026）：1文目＝電流を積分して、電荷の交流の部分。2文目＝積分で出る一定の電荷は振幅の比に効かない
  const W=sentWin(ctx),b=W[1]?W[1][0]:.65,q=x=>x*b;
  const P1=gpanel(160,{x:150,w:560,amp:55,name:'I',col:IC}),P2=gpanel(345,{x:150,w:560,amp:55,name:'q',col:QC,g:seg(p,q(.25),q(.35))});
  let s=P1.svg+gcurve(P1,sI)+P2.svg+gcurve(P2,mq,{p:seg(p,q(.3),q(.6)),color:QC});
  s+=kindTag('定義',950,120,{g:seg(p,q(.02),q(.1))})+fade(seg(p,q(.05),q(.15)),T(`${tI}=\\dfrac{d${tq}}{d${tt}}`,950,200,44));
  s+=fade(seg(p,q(.3),q(.4)),L('電流を 積分 → 電荷の 交流の 部分',950,275,{size:24,color:C.dim}));
  s+=fade(seg(p,q(.55),q(.68)),T(`${tq}=-\\dfrac{${tI0}}{\\omega}\\cos ${wt}`,950,345,40));
  s+=fade(seg(p,q(.75),q(.85)),L('確かめ：微分すると I₀ sin ωt',950,415,{size:24,color:C.dim}));
  s+=fade(seg(p,b+.02,b+.1),L('＋ 積分で 出る 一定の 電荷',950,460,{size:24,color:QC,weight:700}));
  s+=fade(seg(p,b+.2,b+.28),L('→ 交流の 振幅の 比には 効かない',950,494,{size:24,color:C.hi,weight:700}));
  return s+goalTag(G2);
 },
 // 11. V＝q/C → V₀/I₀＝1/(ωC)、60 Hz で ≈53 Ω。単位 1/(rad/s×F)＝Ω
 [K+'ratio']:(p)=>{
  let s=card(140,86,920,420,'',1);
  s+=fade(seg(p,0,.08),T(`${tV}=\\dfrac{${tq}}{${tC}}\\ \\Rightarrow\\ ${tV0}=\\dfrac{${tI0}}{\\omega ${tC}}`,600,150,34));
  s+=fade(seg(p,.2,.3),T(`\\dfrac{${tV0}}{${tI0}}=\\dfrac{1}{\\omega ${tC}}`,600,262,36));
  s+=fade(seg(p,.45,.55),T(`\\dfrac{1}{377\\times50\\times10^{-6}}\\approx53\\ \\Omega`,600,378,36));
  s+=fade(seg(p,.7,.8),L('単位：1/(rad/s × F) ＝ Ω',600,478,{size:24,color:C.dim}));
  return s+goalTag(G2);
 },
 // 12. 周波数を2倍にすると電荷の山が半分の高さ。約 53 Ω → 約 27 Ω。小問2 の答え B
 [K+'f2']:(p,ctx)=>{
  const k=1+seg(p,.12,.45),W=sentWin(ctx);
  const P1=gpanel(160,{x:150,w:560,amp:55,name:'I',col:IC}),P2=gpanel(345,{x:150,w:560,amp:55,name:'q',col:QC});
  let s=P1.svg+gcurve(P1,u=>Math.sin(TAU*k*u))+P2.svg+gcurve(P2,u=>-Math.cos(TAU*k*u)/k,{color:QC});
  s+=fade(seg(p,.4,.5),line(P2.X(.02),P2.Y(.5),P2.X(1.1),P2.Y(.5),{color:QC,w:2,dash:'6 6'})+label('半分',P2.X(1.12)+20,P2.Y(.5)+8,{size:24,color:QC,weight:700}));
  s+=card(780,110,390,330,L(k<1.5?'60 Hz':'120 Hz',975,170,{size:32,color:FC,weight:700})+fade(seg(p,.12,.3),L('ω が 2倍',975,225,{size:26,color:C.ink}))
   +fade(seg(p,.45,.55),L('約 53 Ω',975,300,{size:30,color:C.dim,weight:700})+L('↓',975,345,{size:28,color:C.dim})+L('約 27 Ω',975,395,{size:34,color:HI,weight:700})),1,FC);
  return s+goalTag(G2)+ANS2(seg(p,.72,.82));
 },
 // 13. コイル（比例）とコンデンサ（反比例）の比較。誤答 A → C（1枚ずつ）
 [K+'wrong2']:(p,ctx)=>cmp2()+wrongSeq(p,ctx,[['A','53 Ω、106 Ω','コイルの ωL のように 比例と した'],['C','0.019 Ω、0.038 Ω','ωC と した（単位 1/Ω）']])+goalTag(G2)+ANS2(1),
 // 14. 誤答 D
 [K+'wrongD2']:(p)=>cmp2()+wrongCard('D','330 Ω、170 Ω','1/(fC)（2π が ない）',{g:seg(p,.03,.1)})+goalTag(G2)+ANS2(1),

 // ===================== 小問3 =====================
 // 15. 充電中の平行板と 0.3 A。求めるもの：すき間の変位電流
 [K+'goal3']:(p)=>plates({q:.4,g:seg(p,0,.1)})+fade(seg(p,.2,.3),note('真空',525,445))+goalTag(G3,{g:seg(p,.03,.15)}),
 // 16. 導線の電荷（桃の点）が板で止まる。すき間の電場の矢印が増え、長くなる
 [K+'charge']:(p,ctx)=>{
  const t=cueT(ctx),q=.2+.8*seg(p,.1,.9);
  let s=plates({q,E:seg(p,.35,.45),Elen:clamp(.3+.7*seg(p,.35,.95)),dots:t});
  s+=fade(seg(p,.1,.2),label('電荷は 板で 止まる',300,420,{size:26,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.6),label('すき間の 電場が 強まる',525,460,{size:26,color:EC,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 17. ①図に S と q の札 → ②式を一つずつ：E＝q/(ε₀S) → ES＝q/ε₀ → ε₀×d(q/ε₀)/dt（ε₀ に打ち消し線）→ dq/dt
 [K+'flux']:(p)=>{
  const cA=1-seg(p,.2,.25),cB=seg(p,.23,.28);
  let s=fade(cA,plates({q:.8,E:1,cur:0,S:seg(p,0,.06),Q:seg(p,.05,.11)}));
  let b=T(`${tE}=\\dfrac{${tq}}{${eps}${tS}}`,600,140,38);
  b+=fade(seg(p,.38,.46),L('電気束',330,272,{size:28,color:PHI,weight:700})+T(`${tE}${tS}=${cs(PHI,`\\dfrac{${tq}}{${eps}}`)}`,620,265,38));
  const cn=seg(p,.62,.68),X0=`{\\color{${C.a}}\\cancel{\\color{${C.ink}}${eps}}}`;
  const e=E=>`${E}\\times\\dfrac{d}{d${tt}}\\left(\\dfrac{${tq}}{${E}}\\right)`,w=texWidth(e(eps),40,false),x0=520-w/2;
  b+=cn<.5?fade(seg(p,.55,.62),T(e(eps),x0,400,40,{anchor:'start'})):T(e(X0),x0,400,40,{anchor:'start'});
  b+=fade(seg(p,.76,.84),T(`=\\dfrac{d${tq}}{d${tt}}`,x0+w+34,400,42,{anchor:'start'}));
  s+=fade(cB,b);
  return s+goalTag(G3);
 },
 // 18. dq/dt＝I＝0.3 A。小問3 の答え D
 [K+'ans3']:(p)=>{
  let s=plates({q:.8,E:1,disp:seg(p,.3,.42),cy:205,h:170});
  s+=card(330,400,540,105,T(`\\dfrac{d${tq}}{d${tt}}=${tI}=${cs(IC,'0.3\\ \\mathrm{A}')}`,600,452,34),seg(p,.05,.15),HI);
  return s+goalTag(G3)+ANS3(seg(p,.6,.7));
 },
 // 19. 誤答 A → B（1枚ずつ）
 [K+'wrong3']:(p,ctx)=>fade(.55,plates({q:.8,E:1,cy:200,h:180}))+wrongSeq(p,ctx,[['A','0 A','伝導電流は 0 でも、変位電流は 0 でない'],['B','電荷が 飛び越える','変わっているのは 電場。電荷は 通らない']])+goalTag(G3)+ANS3(1),
 // 20. 誤答 C
 [K+'wrongC3']:(p)=>fade(.55,plates({q:.8,E:1,cy:200,h:180}))+wrongCard('C','0.3/ε₀ A','ε₀ を 掛けていない（単位 V·m/s）',{g:seg(p,.03,.1)})+goalTag(G3)+ANS3(1),

 // ===================== まとめ =====================
 // 21. 4本の法則の表で、アンペールの法則の μ₀ε₀ dΦ_E/dt を黄で光らせる。右上に答えの札3枚
 [K+'sum']:(p)=>lawTable({hi:seg(p,.2,.32),g:seg(p,0,.1)})+fade(seg(p,.35,.45),label('変わる 電場も 磁場の 源',1150,500,{size:24,color:HI,anchor:'end',weight:700}))
  +answerRow([[1,'A','47 V'],[2,'B','53 Ω、27 Ω'],[3,'D','0.3 A']],{g:seg(p,.7,.8)}),
};

// 行5・6 の画面：上に電流（接線）、下に電圧（cos）。右に説明の枠
function graphs15(p,ctx,{}){
 const P1=gpanel(150,{x:140,w:560,amp:60,name:'I',col:IC,grid:1,gridLab:0}),P2=gpanel(345,{x:140,w:560,amp:60,name:'V',col:VC,grid:1});
 let s=P1.svg+gcurve(P1,sI)+P2.svg;
 const h=.06,k=60*TAU;
 s+=fade(seg(p,.05,.15),draw([[P1.X(-h),P1.Y(0)+k*h],[P1.X(h),P1.Y(0)-k*h]],1,{color:HI,w:5})+dot(P1.X(0),P1.Y(0),9,HI)+label('傾き 最大',P1.X(.08),P1.Y(0)+40,{size:24,color:HI,weight:700}));
 s+=gcurve(P2,cV,{p:seg(p,.25,.5),color:VC});
 s+=fade(seg(p,.4,.5),line(P1.X(0),P1.Y(0),P2.X(0),P2.Y(1),{color:HI,w:2.5,dash:'7 6'})+dot(P2.X(0),P2.Y(1),10,VC));
 const a=P2.X(0),b=P2.X(.25),ya=P2.Y(1)-22;
 s+=fade(seg(p,.6,.72),line(b,P1.Y(1),b,ya,{color:IC,w:2,dash:'5 6'})+dot(b,P1.Y(1),9,IC)+arrow((a+b)/2,ya,a,ya,{color:PH,w:4,head:12})+arrow((a+b)/2,ya,b,ya,{color:PH,w:4,head:12})+label('π/2',(a+b)/2,ya-12,{size:28,color:PH,anchor:'middle',weight:700}));
 s+=card(790,110,380,330,L('t ＝ 0',980,165,{size:28,color:TC,weight:700})+fade(seg(p,.05,.15),L('電流の 傾きが 最大',980,215,{size:26,color:HI,weight:700}))
  +fade(seg(p,.4,.5),L('→ 電圧が 山',980,275,{size:28,color:VC,weight:700}))
  +fade(seg(p,.62,.72),line(820,310,1140,310,{color:C.faint,w:2})+L('電圧の 山が 1/4 周期 早い',980,360,{size:24,color:C.ink})+L('電圧が π/2 進む',980,410,{size:30,color:PH,weight:700})),seg(p,0,.08),C.faint);
 return s+goalTag(G1);
}
// 行7・8 の背景（小さく）
function small1(){
 const P1=gpanel(130,{x:200,w:560,amp:40,name:'I',col:IC}),P2=gpanel(250,{x:200,w:560,amp:40,name:'V',col:VC});
 return fade(.55,P1.svg+gcurve(P1,sI)+P2.svg+gcurve(P2,cV,{color:VC})+label('コイル：電圧が π/2 進む',1000,195,{size:26,color:PH,anchor:'middle',weight:700}));
}
// 行13・14 の比較表
function cmp2(){
 let s=card(150,95,430,210,L('コイル',365,140,{size:28,weight:700})+T('\\omega L',365,205,44)+L('周波数に 比例',365,275,{size:26,color:C.dim}),1);
 s+=card(620,95,430,210,L('コンデンサ',835,140,{size:28,color:CC,weight:700})+T(`\\dfrac{1}{\\omega ${tC}}`,835,210,40)+L('周波数に 反比例',835,275,{size:26,color:HI,weight:700}),1,CC);
 return s;
}
