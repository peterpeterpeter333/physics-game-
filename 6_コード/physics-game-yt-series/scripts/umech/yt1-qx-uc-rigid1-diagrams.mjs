// 問題編 解説「穴あき円板・ずらした軸・球の接点」（q-uc-rigid1、大学編 17 慣性モーメント・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/17_慣性モーメント.md の q-uc-rigid1（解説 21 行）。
// 画面の配置：左に図、右に説明の枠。誤答カードは右の枠の下。札の帯（y＜78）には図を描かない。
// 色：距離 r・x・d 水色、半径 R 黄、幅 dr 金（共通の表と違うので小問1 では凡例「R 黄・dr 金」）、面密度 σ 砂色、物体 灰青、強調 黄、
//   平行軸の定理の3つの項：Σmx²（I_G）水色、2dΣmx 赤、d²Σm（Md²）黄。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth,poly,ground} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-uc-rigid1:';
const CR=C.x,RY=C.hi,GOLD=C.t,DEN='#e6c98f',BODY='#8aa0c4',CRED=C.a;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const RR=`{\\color{${CR}}r}`,BR=`{\\color{${RY}}R}`,DR=`{\\color{${GOLD}}dr}`,SG=`{\\color{${DEN}}\\sigma}`,DD=`{\\color{${CR}}d}`,XX=`{\\color{${CR}}x}`;
const KGM2='\\ \\mathrm{kg\\cdot m^2}';
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='穴あき 円板の I',G2='ずらした 軸の まわりの I',G3='接点の 軸の まわりの I';
const ANS1=g=>answerTag(1,'C','(5/8)MR²',{g}),ANS2=g=>answerTag(2,'B','7 kg·m²',{g}),ANS3=g=>answerTag(3,'D','0.28 kg·m²',{g});
const LEG=(g=1)=>legend([['R（半径）',RY],['dr（幅）',GOLD]],30,470,{g,dir:'row'});
const n2=v=>Number(v.toFixed(2));
// 黄の枠つきの式（枠の大きさは式の幅から）
const TB=(e,x,y,size,frac=1,col=C.hi)=>{const w=texWidth(e,size,false),h=frac?size*2.5:size*1.6;return T(e,x,y,size)+highlight(x-w/2-14,y-h*.55,w+28,h,1,col);};
const circ=(cx,cy,r,{fill='none',fo=0,stroke=BODY,sw=2,dash=''}={})=>`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="${fill}" fill-opacity="${fo}" stroke="${stroke}" stroke-width="${sw}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const axisDot=(x,y,{col=C.ink,lab='軸',dx=-18,dy=8}={})=>ring(x,y,11,{color:col,w:3,fill:C.bg})+dot(x,y,4,col)+(lab?label(lab,x+dx,y+dy,{size:24,color:C.dim,anchor:'end'}):'');

// ---- 小問1：穴あき円板（真上から見た図）--------------------------------------------------------------
const DC={x:300,y:290,R:170};
function hdisc({rings=0,hiR=null,radii=1,rArrow=null,holeCut=0,g=1,axis=1,rLab=1,full=0}={}){
 const {x,y,R}=DC;let s='';
 s+=circ(x,y,R,{fill:BODY,fo:.3,stroke:BODY,sw:2.5});
 if(full>0)s+=fade(full,circ(x,y,R/2,{fill:BODY,fo:.3,stroke:BODY,sw:0}));
 s+=fade(1-full,circ(x,y,R/2,{fill:C.bg,fo:1,stroke:BODY,sw:2.5}));
 if(holeCut>0)s+=fade(holeCut,circ(x,y,R/2,{fill:CRED,fo:.12,stroke:CRED,sw:3,dash:'8 6'})+label('穴の 部分',x,y+8,{size:22,color:CRED,anchor:'middle',weight:700}));
 if(rings>0){const N=8;for(let i=0;i<=N;i++){const r=R/2+R/2*i/N;s+=fade(clamp(rings*(N+1)-i),circ(x,y,r,{stroke:'#c7d3ea',sw:1.5}));}}
 if(hiR!==null)s+=circ(x,y,hiR,{stroke:GOLD,sw:7});
 if(radii>0)s+=fade(radii,arrow(x,y,x+R*Math.cos(-.5),y+R*Math.sin(-.5),{color:RY,w:4,head:14})+(rLab?label('R',x+R*.6*Math.cos(-.5)+6,y+R*.6*Math.sin(-.5)-12,{size:28,color:RY,weight:700}):'')
  +arrow(x,y,x-R/2*Math.cos(.6),y+R/2*Math.sin(.6),{color:RY,w:4,head:14})+(rLab?label('R/2',x-R/2*Math.cos(.6)-8,y+R/2*Math.sin(.6)+30,{size:26,color:RY,anchor:'end',weight:700}):''));
 if(rArrow!==null){const a=2.4;s+=arrow(x,y,x+rArrow*Math.cos(a),y-rArrow*Math.sin(a),{color:CR,w:5,head:16})+label('r',x+rArrow*.55*Math.cos(a)-4,y-rArrow*.55*Math.sin(a)-14,{size:30,color:CR,weight:700,anchor:'middle'});}
 if(axis)s+=axisDot(x,y,{lab:'',col:C.ink});
 return fade(g,s);
}
// 斜め上から見た穴あき円板（問題アニメ）
function hdiscPersp(cx,cy,R,ph,{g=1}={}){
 const ry=R*.35,e=(rx,ryy,o={})=>`<ellipse cx="${n2(cx)}" cy="${n2(cy)}" rx="${n2(rx)}" ry="${n2(ryy)}" fill="${o.fill??'none'}" fill-opacity="${o.fo??0}" stroke="${o.stroke??BODY}" stroke-width="${o.sw??2.5}"${o.dash?` stroke-dasharray="${o.dash}"`:''}/>`;
 let s=line(cx,cy-200,cx,cy-ry/2,{color:C.ink,w:2.5,dash:'8 7'});
 s+=`<ellipse cx="${n2(cx)}" cy="${n2(cy+10)}" rx="${R}" ry="${n2(ry)}" fill="${BODY}" fill-opacity=".15" stroke="${BODY}" stroke-width="1.5"/>`;
 s+=e(R,ry,{fill:BODY,fo:.35})+e(R/2,ry/2,{fill:C.bg,fo:1});
 s+=dot(cx+R*.8*Math.cos(ph),cy+ry*.8*Math.sin(ph),7,C.hi);
 s+=line(cx,cy-ry/2+4,cx,cy+200,{color:C.ink,w:2.5,dash:'8 7'});
 return fade(g,s);
}
// 輪を切り開いた帯（縮めて描く）
function band(x,y,w,h,{g=1}={}){
 return fade(g,rect(x,y,w,h,{fill:GOLD,fo:.35,stroke:GOLD,sw:2,rx:2})+brace(x,x+w,y-8,{dir:-1,color:CR,text:'長さ 2πr',size:24})
  +line(x+w+14,y,x+w+14,y+h,{color:GOLD,w:3})+label('幅 dr',x+w+24,y+h/2+8,{size:24,color:GOLD,weight:700}));
}

// ---- 小問2：棒（上から見た図）-----------------------------------------------------------------------
const RD={x0:100,y:270,ppm:140};
const RX=m=>RD.x0+RD.ppm*m;
function rod({g=1,lab=1,G=0,Gaxis=0,dArr=0,pt=0,xArr=0,end=1}={}){
 const y=RD.y;let s=rect(RX(0),y-13,3*RD.ppm,26,{fill:BODY,fo:.45,stroke:BODY,sw:2,rx:4});
 if(lab)s+=label('4 kg',RX(3)+16,y+9,{size:26,color:C.ink,weight:700})+brace(RX(0),RX(3),y-100,{dir:-1,color:CR,text:'3 m',size:26});
 if(end)s+=brace(RX(0),RX(.5),y-24,{dir:-1,color:CR,text:'0.5 m',size:24});
 if(G>0)s+=fade(G,dot(RX(1.5),y,9,RY)+label('重心',RX(1.5),y-30,{size:24,color:RY,anchor:'middle',weight:700})+label('1.5 m',RX(1.5),y+128,{size:24,color:RY,anchor:'middle',weight:700})+line(RX(1.5),y+18,RX(1.5),y+102,{color:RY,w:2,dash:'4 4'}));
 if(Gaxis>0)s+=fade(Gaxis,ring(RX(1.5),y,15,{color:RY,w:3,dash:'5 4'}));
 if(dArr>0)s+=fade(dArr,arrow(RX(.5),y+80,RX(1.5),y+80,{color:CR,w:4,head:14})+arrow(RX(1.5),y+80,RX(.5),y+80,{color:CR,w:4,head:14})+label('d',RX(1),y+70,{size:28,color:CR,anchor:'middle',weight:700}));
 if(pt>0)s+=fade(pt,dot(RX(2.4),y,9,C.ink)+label('点',RX(2.4),y-26,{size:22,color:C.ink,anchor:'middle'}));
 if(xArr>0)s+=fade(xArr,arrow(RX(1.5),y+160,RX(2.4),y+160,{color:CR,w:4,head:14})+label('x',RX(1.95),y+150,{size:28,color:CR,anchor:'middle',weight:700})
  +arrow(RX(.5),y+195,RX(2.4),y+195,{color:CR,w:4,head:14})+label('x ＋ d',RX(1.45),y+229,{size:26,color:CR,anchor:'middle',weight:700}));
 s+=axisDot(RX(.5),y,{lab:''})+label('軸',RX(.5),y+48,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
// 問題アニメ：棒が一度回る（中心から外れた軸のまわり、1 m＝80 px）
function rodSpin(a,{cx=600,cy=300,ppm=80,g=1}={}){
 const p=(m)=>[cx+(m-.5)*ppm*Math.cos(a),cy-(m-.5)*ppm*Math.sin(a)],[x0,y0]=p(0),[x1,y1]=p(3),nx=Math.sin(a)*11,ny=Math.cos(a)*11;
 let s=poly([[x0-nx,y0-ny],[x1-nx,y1-ny],[x1+nx,y1+ny],[x0+nx,y0+ny]],{fill:BODY,fo:.45,stroke:BODY,sw:2});
 return fade(g,s+axisDot(cx,cy,{lab:''}));
}

// ---- 小問3：床の上の球 ------------------------------------------------------------------------------
const SP={x:300,y:270,R:130};
function sphere({g=1,lab=1,cAxis=.5,cCol=C.dim,pAxis=1,dArr=0}={}){
 const {x,y,R}=SP,fy=y+R;let s=ground(60,580,fy);
 s+=circ(x,y,R,{fill:BODY,fo:.25,stroke:BODY,sw:2.5})+`<ellipse cx="${x}" cy="${y}" rx="${R}" ry="${R*.25}" fill="none" stroke="${BODY}" stroke-width="1.5" stroke-dasharray="6 6"/>`;
 const ax=(cx,cy,col,w,o)=>fade(o,line(cx-190,cy+48,cx+190,cy-48,{color:col,w,dash:'9 7'}));
 if(cAxis>0)s+=ax(x,y,cCol,3,cAxis)+fade(cAxis,dot(x,y,6,cCol));
 if(pAxis>0)s+=ax(x,fy,C.ink,3,pAxis)+dot(x,fy,7,C.ink)+fade(pAxis,label('接点の 軸',x-200,fy+80,{size:24,color:C.ink,weight:700}));
 if(lab)s+=label('5 kg',x-30,y-30,{size:26,color:C.ink,anchor:'middle',weight:700})+line(x,y,x-R*.7,y+R*.7,{color:RY,w:3})+label('半径 0.2 m',x-R*.7-10,y+R*.7+14,{size:24,color:RY,anchor:'end',weight:700});
 if(dArr>0)s+=fade(dArr,arrow(x+22,y,x+22,fy,{color:CR,w:4,head:14})+arrow(x+22,fy,x+22,y,{color:CR,w:4,head:14})+label('d ＝ R ＝ 0.2 m',x+36,y+R*.62,{size:26,color:CR,weight:700}));
 return fade(g,s);
}

// 係数のブロック（2/5 と 1 → 7/5）
function blocks(x,y,u,{g=1,join=0}={}){
 const w1=u*.4,w2=u;let s=rect(x,y,w1,46,{fill:RY,fo:.35,stroke:RY})+label('2/5',x+w1/2,y+32,{size:24,color:C.ink,anchor:'middle',weight:700});
 const x2=x+w1+mix(30,0,join);s+=rect(x2,y,w2,46,{fill:CR,fo:.3,stroke:CR})+label('1',x2+w2/2,y+32,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=fade(join,label('＝ 7/5',x+w1+w2+20,y+32,{size:28,color:C.hi,weight:700}));
 return fade(g,s);
}

export const ytQxUcRigid1Diagrams={
 // ===================== 問題アニメ =====================
 // 出題（約4秒）：斜め上から見た穴あき薄い円板。R・R/2（黄）、中心の軸（白い点線）。0〜3 秒で一度回って止まる。札「質量 M」。
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx),ph=2*Math.PI*clamp(t/3);
  let s=hdiscPersp(600,280,230,ph);
  s+=line(600,280,600+230,280,{color:RY,w:3})+label('R',600+150,270,{size:30,color:RY,weight:700,anchor:'middle'});
  s+=line(600,280,600-115,280,{color:RY,w:3})+label('R/2',600-70,312,{size:26,color:RY,weight:700,anchor:'middle'});
  s+=label('質量 M',880,170,{size:30,color:C.ink,weight:700})+label('軸（面に 垂直）',620,90,{size:24,color:C.dim});
  return s;
 },
 // 小問2（約4秒）：細い棒（4 kg、3 m）。一端から 0.5 m の点に垂直な軸と「0.5 m」。棒がその軸のまわりに一度回って止まる。重心は描かない。
 [K+'q2']:(p,ctx)=>{
  const t=cueT(ctx),a=2*Math.PI*clamp((t-.8)/2.6);
  let s=rodSpin(a);
  const still=t<.8||t>3.4;
  s+=fade(still?1:0,label('4 kg',600+1.2*80,300-24,{size:26,color:C.ink,anchor:'middle',weight:700})+brace(600-40,600+200,320,{dir:1,color:CR,text:'3 m',size:26})
   +brace(600-40,600,282,{dir:-1,color:CR,text:'0.5 m',size:24}));
  s+=label('細い 棒（上から 見た 図）',600,60,{size:24,color:C.dim,anchor:'middle'})+label('軸は 棒に 垂直（画面に 垂直）',600,500,{size:24,color:C.dim,anchor:'middle'});
  return s;
 },
 // 小問3（約3秒）：床の上の球（5 kg、半径 0.2 m）。接点を通る軸（白い点線）と、中心を通る軸（薄い灰色の点線）。静止。
 [K+'q3']:(p)=>{
  return fade(seg(p,0,.4),sphere({cAxis:.6}))+fade(seg(p,.4,.8),label('中心を 通る 軸（平行）',SP.x+200,SP.y-40,{size:22,color:C.dim}));
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=hdisc({});
  s+=panel(90,250,label('小問1',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('穴の あいた 円板の、中心の',PC,205,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('軸の まわりの 慣性モーメント',PC,255,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.2,.35),label('質量 M',PX+20,420,{size:26,color:C.ink,weight:700})+label('軸は 中心を 通り 面に 垂直',PX+20,460,{size:24,color:C.dim}));
  return s+LEG(seg(p,.1,.25))+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. 同心の細い輪（R/2 から R）。r が R/2 から R まで動く
 [K+'rings']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,r=mix(DC.R/2,DC.R,seg(p,b+.1,b+.4));
  let s=hdisc({rings:seg(p,.05,.35),radii:.5,rLab:1,rArrow:seg(p,b,b+.05)>0?r:null});
  let q=label('同心の 細い 輪に 切る',PC,140,{size:28,color:C.ink,anchor:'middle',weight:700});
  q+=fade(seg(p,b,b+.1),line(PX+40,180,PX+PW-40,180,{color:C.faint,w:2})+label('違い：輪の 半径 r の 範囲',PC,230,{size:26,color:C.dim,anchor:'middle'})+T(`\\dfrac{${BR}}{2}\\ \\le\\ ${RR}\\ \\le\\ ${BR}`,PC,310,42));
  q+=fade(seg(p,b+.1,b+.2),label('穴の 中には 輪が ない',PC,400,{size:24,color:C.dim,anchor:'middle'}));
  s+=panel(90,350,q,1);
  return s+LEG()+goalTag(G1);
 },
 // 3a. 面積：大きい円 − 穴（カット割り：①図で穴を切り取る ②式）
 [K+'area']:(p)=>{
  let s=hdisc({radii:1,full:1-seg(p,.15,.35),holeCut:seg(p,.15,.35)});
  let q=label('面積',PC,130,{size:26,color:C.dim,anchor:'middle'});
  q+=fade(seg(p,.1,.2),T(`\\pi${BR}^2-\\pi\\Bigl(\\dfrac{${BR}}{2}\\Bigr)^2`,PC,200,38));
  q+=fade(seg(p,.4,.5),T(`=\\pi${BR}^2-\\dfrac14\\pi${BR}^2`,PC,290,38));
  q+=fade(seg(p,.6,.7),TB(`=\\dfrac34\\pi${BR}^2`,PC,385,42));
  s+=panel(90,380,q,1);
  return s+LEG()+goalTag(G1);
 },
 // 3b. 面密度 σ＝M÷面積＝4M/(3πR²)
 [K+'sigma']:(p)=>{
  let s=hdisc({radii:1,holeCut:1});
  s+=fade(seg(p,.6,.75),label('穴の 分だけ 面積が 減る',300,500,{size:24,color:CRED,anchor:'middle',weight:700}));
  let q=label('面密度（1 m² あたりの 質量）',PC,130,{size:24,color:C.dim,anchor:'middle'});
  q+=fade(seg(p,.05,.15),T(`${SG}=M\\div\\dfrac34\\pi${BR}^2`,PC,210,38));
  q+=fade(seg(p,.35,.45),TB(`=\\dfrac{4M}{3\\pi${BR}^2}`,PC,320,44));
  s+=panel(90,330,q,1);
  return s+LEG()+goalTag(G1);
 },
 // 4a. 半径 r・幅 dr の輪を切り開いて、長さ 2πr の帯（カット割り）
 [K+'strip']:(p)=>{
  const r=DC.R*.75;
  let s=hdisc({radii:0,rings:1,hiR:r,rArrow:r});
  s+=fade(seg(p,.05,.15),label('半径 r・幅 dr の 輪',300,100,{size:24,color:GOLD,anchor:'middle',weight:700}));
  let q=label('切り開く',PC,130,{size:26,color:C.dim,anchor:'middle'})+arrow(PC,145,PC,190,{color:C.dim,w:3,head:12});
  q+=band(PX+50,285,mix(30,360,seg(p,.2,.5)),26,{g:seg(p,.15,.3)});
  q+=fade(seg(p,.5,.6),note('（長さは 縮めて 描いています）',PC,360));
  s+=panel(90,300,q,1);
  return s+LEG()+goalTag(G1);
 },
 // 4b. dm＝σ×2πr dr
 [K+'dm']:(p)=>{
  const r=DC.R*.75;
  let s=hdisc({radii:0,rings:1,hiR:r,rArrow:r});
  let q=band(PX+50,180,360,26)+note('（長さは 縮めて 描いています）',PC,250);
  q+=fade(seg(p,.1,.2),label('帯の 面積 ＝ 2πr × dr',PC,300,{size:26,color:C.ink,anchor:'middle'}));
  q+=fade(seg(p,.3,.42),TB(`dm=${SG}\\times2\\pi${RR}\\,${DR}`,PC,375,42,0));
  s+=panel(90,345,q,1);
  return s+LEG()+goalTag(G1);
 },
 // 5a. 輪の上の点はどれも軸から r → 寄与 r² dm
 [K+'r2dm']:(p)=>{
  const r=DC.R*.75;
  let s=hdisc({radii:0,rings:1,hiR:r});
  for(let i=0;i<5;i++){const a=.4+i*1.25;s+=fade(seg(p,.05+i*.05,.12+i*.05),line(DC.x,DC.y,DC.x+r*Math.cos(a),DC.y-r*Math.sin(a),{color:CR,w:3})+dot(DC.x+r*Math.cos(a),DC.y-r*Math.sin(a),6,CR));}
  s+=fade(seg(p,.3,.4),label('どの 点も 軸から r',300,100,{size:24,color:CR,anchor:'middle',weight:700}));
  let q=fade(seg(p,.4,.5),T(`${RR}^2\\,dm=${RR}^2\\times${SG}\\,2\\pi${RR}\\,${DR}`,PC,160,34));
  q+=fade(seg(p,.6,.7),T(`=${SG}\\,2\\pi\\,{\\color{${C.hi}}\\boxed{${RR}^3}}\\,${DR}`,PC,260,38)+label('r が 3つ',PC,335,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(90,280,q,1);
  return s+LEG()+goalTag(G1);
 },
 // 5b. 足すと I＝σ×2π∫ r³ dr（R/2 から R）。下端・上端を輪の範囲に対応
 [K+'int1']:(p)=>{
  let s=hdisc({radii:1,rings:1});
  s+=fade(seg(p,.3,.45),circ(DC.x,DC.y,DC.R/2,{stroke:RY,sw:5})+circ(DC.x,DC.y,DC.R,{stroke:RY,sw:5}));
  let q=label('足す（σ×2π は 共通 → 外へ）',PC,130,{size:24,color:C.dim,anchor:'middle'});
  q+=fade(seg(p,.05,.18),T(`I=${SG}\\times2\\pi\\int_{${BR}/2}^{${BR}}${RR}^3\\,${DR}`,PC,230,40));
  q+=fade(seg(p,.3,.45),label('下端 R/2：穴の 縁',PC,340,{size:24,color:RY,anchor:'middle',weight:700})+label('上端 R：外側の 縁',PC,385,{size:24,color:RY,anchor:'middle',weight:700}));
  s+=panel(90,330,q,1);
  return s+LEG()+goalTag(G1);
 },
 // 6. 積分（カット割り：式だけ）
 [K+'calc1']:(p)=>{
  let s=card(100,90,1000,415,'',1);
  s+=label('d(r⁴/4)/dr ＝ r³',600,140,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.25),T(`\\int_{${BR}/2}^{${BR}}${RR}^3\\,${DR}=\\dfrac{${BR}^4}{4}-\\dfrac{(${BR}/2)^4}{4}`,600,225,40));
  s+=fade(seg(p,.4,.5),T(`=\\dfrac{${BR}^4-${BR}^4/16}{4}`,600,330,40));
  s+=fade(seg(p,.6,.7),TB(`=\\dfrac{15}{64}${BR}^4`,600,448,44));
  return s+goalTag(G1);
 },
 // 7. σ×2π を掛けて約分 → (5/8)MR²。答え C。比べる棒「輪 1、穴あき 0.625、円板 0.5」
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,cn=seg(p,.2,.28);
  let s=card(40,90,620,415,'',1);
  const pi=cn>.5?`\\cancel{\\pi}`:'\\pi',R2=cn>.5?`\\cancel{${BR}^2}`:`${BR}^2`;
  s+=T(`I=\\dfrac{4M}{3${pi}${R2}}\\times2${pi}\\times\\dfrac{15}{64}${BR}^{4}`,350,165,36);
  s+=fade(seg(p,.2,.28),label('π と R² を 約分',350,240,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.32,.42),T(`=\\dfrac{4\\times2\\times15}{3\\times64}M${BR}^2=\\dfrac{120}{192}M${BR}^2`,350,315,34));
  s+=fade(seg(p,.46,.56),TB(`=\\dfrac58\\,M${BR}^2`,350,425,44));
  // 比べる棒（MR² の 1＝300 px）
  const rows=[['輪',1],['穴あき',.625],['円板',.5]];let q=label('I ÷ MR²',PC,130,{size:24,color:C.dim,anchor:'middle'});
  rows.forEach(([n,v],i)=>{const y=180+i*80;q+=label(n,PX+100,y+30,{size:24,color:i===1?C.hi:C.ink,anchor:'end',weight:700})+rect(PX+115,y,300*v,40,{fill:i===1?C.hi:BODY,fo:.5,stroke:i===1?C.hi:BODY})+label(String(v),PX+125+300*v,y+30,{size:24,color:C.ink});});
  s+=panel(90,300,q,seg(p,b,b+.08));
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));
 },
 // 8a. 誤答 A → B
 [K+'wrong1ab']:(p,ctx)=>{
  let s=hdisc({radii:1});
  s+=panel(90,150,label('小問1 の 結果',PC,125,{size:22,color:C.dim,anchor:'middle'})+T(`I=\\dfrac58\\,M${BR}^2`,PC,190,36),1);
  s+=wrongSeq(p,ctx,[['A','(1/2)MR²','穴の ない 円板の 値'],['B','(15/32)MR²','σ＝M/(πR²) の まま']],{opts:{...WOPT,y:262}});
  return s+LEG()+goalTag(G1)+ANS1(1);
 },
 // 8b. 誤答 D（穴の質量も M として引いた）
 [K+'wrong1d']:(p)=>{
  let s=hdisc({radii:1,holeCut:seg(p,.1,.25)});
  s+=panel(90,150,label('小問1 の 結果',PC,125,{size:22,color:C.dim,anchor:'middle'})+T(`I=\\dfrac58\\,M${BR}^2`,PC,190,36),1);
  s+=wrongCard('D','(3/8)MR²',['½M(R/2)² を 引いた','（穴の 質量は M で ない）'],{...WOPT,y:262,g:seg(p,.02,.08)});
  return s+LEG()+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  let s=rod({});
  s+=label('上から 見た 図（軸は 画面に 垂直）',40,470,{size:22,color:C.dim});
  s+=panel(90,260,label('小問2',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('一端から 0.5 m の 点を 通る',PC,205,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('軸の まわりの I',PC,255,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 10. 重心 1.5 m、重心の軸のまわり I_G＝Ml²/12＝3
 [K+'ig']:(p)=>{
  let s=rod({G:seg(p,.03,.15),Gaxis:seg(p,.15,.25)});
  let q=label('重心を 通る 軸のまわり',PC,135,{size:24,color:C.dim,anchor:'middle'});
  q+=fade(seg(p,.25,.35),T('I_G=\\dfrac{Ml^2}{12}',PC,210,40));
  q+=fade(seg(p,.45,.55),T(`=\\dfrac{4\\times9}{12}=3${KGM2}`,PC,320,38));
  q+=fade(seg(p,.65,.75),T(`{\\color{${CR}}I_G=3}`,PC,405,40));
  s+=panel(90,360,q,1);
  return s+goalTag(G2);
 },
 // 11. 新しい軸と重心の間 d＝1.5−0.5＝1.0 m
 [K+'d']:(p)=>{
  let s=rod({G:1,Gaxis:1,dArr:seg(p,.05,.2)});
  let q=T(`{\\color{${CR}}I_G=3${KGM2}}`,PC,135,32);
  q+=fade(seg(p,.1,.2),T(`${DD}=1.5-0.5`,PC,220,40));
  q+=fade(seg(p,.35,.45),TB(`=1.0\\ \\mathrm{m}`,PC,310,42,0));
  s+=panel(90,300,q,1);
  return s+goalTag(G2);
 },
 // 12. x＋d、2乗を開いて3つの項（カット割り：①図 ②式）
 [K+'expand']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=rod({lab:0,end:0,G:1,Gaxis:1,dArr:1,pt:seg(p,.03,.12),xArr:seg(p,.1,.25)});
  let q=fade(seg(p,b,b+.08),T(`I=\\sum m(${XX}+${DD})^2`,PC,140,38));
  q+=fade(seg(p,b+.15,b+.25),T(`={\\color{${CR}}\\sum m${XX}^2}`,PC,225,36));
  q+=fade(seg(p,b+.28,b+.38),T(`+{\\color{${CRED}}2${DD}\\sum m${XX}}`,PC,300,36));
  q+=fade(seg(p,b+.41,b+.51),T(`+{\\color{${RY}}${DD}^2\\sum m}`,PC,375,36));
  q+=fade(seg(p,b+.55,b+.65),label('3つの 項',PX+420,300,{size:24,color:C.dim,anchor:'middle'}));
  s+=panel(90,330,q,1);
  return s+goalTag(G2);
 },
 // 13a. 2dΣmx は重心が原点なので 0（打ち消し線）
 [K+'cancel']:(p)=>{
  let s=rod({lab:0,end:0,G:1,Gaxis:1,dArr:1,pt:1,xArr:1});
  const cn=seg(p,.35,.45);
  let q=T(`I=\\sum m(${XX}+${DD})^2`,PC,140,38)+T(`={\\color{${CR}}\\sum m${XX}^2}`,PC,225,36);
  q+=T(cn>.5?`+{\\color{${CRED}}\\cancel{2${DD}\\sum m${XX}}}`:`+{\\color{${CRED}}2${DD}\\sum m${XX}}`,PC,300,36)+T(`+{\\color{${RY}}${DD}^2\\sum m}`,PC,375,36);
  q+=highlight(PC-100,265,200,70,seg(p,.05,.15)*(1-seg(p,.6,.7)),CRED);
  q+=fade(seg(p,.2,.3),label('重心が 原点 → Σmx ＝ 0',PC,450,{size:26,color:CRED,anchor:'middle',weight:700}));
  s+=panel(90,400,q,1);
  return s+goalTag(G2);
 },
 // 13b. 残り I＝I_G＋Md²＝3＋4×1²＝7
 [K+'seven']:(p)=>{
  let s=rod({lab:0,end:0,G:1,Gaxis:1,dArr:1});
  let q=T(`I={\\color{${CR}}I_G}+{\\color{${RY}}M${DD}^2}`,PC,150,42);
  q+=fade(seg(p,.2,.3),T(`=3+4\\times1^2`,PC,250,40));
  q+=fade(seg(p,.45,.55),TB(`=7${KGM2}`,PC,350,44,0));
  s+=panel(90,330,q,1);
  return s+goalTag(G2);
 },
 // 14. 答え B。誤答 A（端の軸の値 12 を I_G にした）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3;
  let s=rod({G:1,Gaxis:1,dArr:1});
  s+=panel(90,150,label('小問2 の 結果',PC,125,{size:22,color:C.dim,anchor:'middle'})+T(`I=I_G+M${DD}^2=3+4=7${KGM2}`,PC,190,32),1);
  s+=wrongCard('A','13',['Ml²/3＝12 を 重心の 軸の 値に した','（12＋4×0.5²、端からの 距離）'],{...WOPT,y:262,g:seg(p,b,b+.05)});
  return s+goalTag(G2)+ANS2(seg(p,.03,.1));
 },
 // 15. 誤答 C → D、札「I_G＝重心を通る軸の値」
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],b=W[1]?W[1][0]:e;
  let s=rod({G:1,Gaxis:1,dArr:1});
  s+=panel(90,150,label('小問2 の 結果',PC,125,{size:22,color:C.dim,anchor:'middle'})+T(`I=I_G+M${DD}^2=3+4=7${KGM2}`,PC,190,32),1);
  s+=wrongSeq(p,ctx,[['C','3','Md² を 足して いない'],['D','4','重心の 軸の 値 3 を 足して いない']],{win:[[0,e*.5],[e*.5,1]],opts:{...WOPT,y:262}});
  s+=fade(seg(p,b,b+.06),rect(PX,400,PW,60,{fill:RY,fo:.12,stroke:RY,sw:2.5,rx:12})+T(`{\\color{${RY}}I_G}`,PX+60,430,34)+label('＝ 重心を 通る 軸の 値',PX+100,440,{size:28,color:RY,weight:700}));
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>{
  let s=sphere({});
  s+=panel(90,260,label('小問3',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('球の、床との 接点を 通る',PC,205,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('軸の まわりの I',PC,255,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.2,.3),label('接点の 軸 ∥ 中心を 通る 軸',PX+20,410,{size:24,color:C.dim}));
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 17. 中心を通る軸：(2/5)MR²＝0.4×5×0.04＝0.08
 [K+'center']:(p)=>{
  let s=sphere({cAxis:1,cCol:RY,pAxis:.35});
  let q=label('中心を 通る 軸',PC,130,{size:26,color:RY,anchor:'middle',weight:700});
  q+=fade(seg(p,.05,.15),T(`I_G=\\dfrac25\\,M${BR}^2`,PC,200,40)+label('（単元動画で 導いた 結果）',PC,265,{size:22,color:C.dim,anchor:'middle'}));
  q+=fade(seg(p,.3,.42),T(`=0.4\\times5\\times0.2^2`,PC,330,36));
  q+=fade(seg(p,.5,.62),TB(`=0.08${KGM2}`,PC,415,40,0));
  s+=panel(90,380,q,1);
  return s+goalTag(G3);
 },
 // 18. d＝R。I＝(2/5)MR²＋MR²＝(7/5)MR²。係数ブロック 2/5＋1
 [K+'shift']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=sphere({cAxis:1,cCol:RY,dArr:seg(p,.05,.2)});
  let q=label('平行軸の 定理',PX+110,135,{size:24,color:C.dim,anchor:'middle'})+T(`I=I_G+M${DD}^2`,PX+330,130,30);
  q+=fade(seg(p,b,b+.1),T(`I=\\dfrac25\\,M${BR}^2+M${BR}^2`,PC,205,38));
  q+=blocks(PX+70,270,200,{g:seg(p,b+.15,b+.25),join:seg(p,b+.35,b+.5)});
  q+=fade(seg(p,b+.5,b+.6),TB(`=\\dfrac75\\,M${BR}^2`,PC,405,42));
  s+=panel(90,385,q,1);
  return s+goalTag(G3);
 },
 // 19. 1.4×5×0.04＝0.28。答え D
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[0][1]*.8;
  let s=sphere({cAxis:.6,dArr:1});
  let q=T(`I=\\dfrac75\\,M${BR}^2`,PC,150,40);
  q+=fade(seg(p,.05,.15),T(`=1.4\\times5\\times0.04`,PC,250,38));
  q+=fade(seg(p,.25,.35),TB(`=0.28${KGM2}`,PC,345,42,0));
  s+=panel(90,320,q,1);
  return s+goalTag(G3)+ANS3(seg(p,b,b+.06));
 },
 // 20. 誤答 A → B → C
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],wA=[0,e*.5],wB=[e*.5,e],wC=[W[1]?W[1][0]:e,1];
  let s=sphere({cAxis:.6,dArr:1});
  s+=panel(90,150,label('小問3 の 結果',PC,125,{size:22,color:C.dim,anchor:'middle'})+T(`I=\\dfrac75\\,M${BR}^2=0.28${KGM2}`,PC,192,32),1);
  s+=wrongSeq(p,ctx,[['A','0.08','Md² を 足して いない'],['B','0.20','重心の 軸の 値 0.08 を 足して いない'],['C','0.30','½MR²＋MR²（円板の 値）']],{win:[wA,wB,wC],opts:{...WOPT,y:262}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 [K+'summary']:(p)=>summary(p,0),
 [K+'summary2']:(p)=>summary(p,1),
};

// まとめ：3つの結果。∫r²dm を使ったもの（金の枠）と、I_G＋Md² を使ったもの（水色の枠）
function summary(p,k){
 const g1=k?1:seg(p,.03,.2),g2=k?1:seg(p,.3,.5),g3=k?1:seg(p,.6,.8),hl=k?seg(p,.1,.3):0;
 let s=card(20,90,370,330,'',g1,GOLD)+card(415,90,370,330,'',g2,CR)+card(810,90,370,330,'',g3,CR);
 s+=fade(g1,`<circle cx="205" cy="200" r="80" fill="${BODY}" fill-opacity=".3" stroke="${BODY}" stroke-width="2"/><circle cx="205" cy="200" r="40" fill="${C.bg}" stroke="${BODY}" stroke-width="2"/><circle cx="205" cy="200" r="60" fill="none" stroke="${GOLD}" stroke-width="5"/>`
  +T(`I=\\int ${RR}^2\\,dm`,205,330,32)+label('＝ (5/8)MR²',205,395,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2,rect(450,190,300,20,{fill:BODY,fo:.45,stroke:BODY,rx:3})+axisDot(500,200,{lab:''})+dot(600,200,7,RY)
  +T(`I=I_G+M${DD}^2`,600,300,32)+label('＝ 3 ＋ 4 ＝ 7 kg·m²',600,375,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g3,`<circle cx="995" cy="185" r="60" fill="${BODY}" fill-opacity=".25" stroke="${BODY}" stroke-width="2"/>`+line(920,245,1070,245,{color:C.dim,w:3})+dot(995,245,6,C.ink)
  +T(`\\dfrac25+1=\\dfrac75`,995,315,30)+label('＝ 0.28 kg·m²',995,385,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g1,label('dm に 切って 距離² を 掛けて 足す',205,455,{size:22,color:GOLD,anchor:'middle',weight:700}));
 s+=fade(k?1:seg(p,.45,.6),label('軸を ずらしたら',640,455,{size:24,color:CR,anchor:'end',weight:700})+T(`{\\color{${CR}}I_G}`,672,447,30)+label('に Md² を 足す',700,455,{size:24,color:CR,weight:700}));
 s+=fade(hl,highlight(415,90,765,395,1,CR));
 s+=answerRow([[1,'C','(5/8)MR²'],[2,'B','7 kg·m²'],[3,'D','0.28 kg·m²']],{g:k?seg(p,.75,.88):0,size:22});
 return s;
}
