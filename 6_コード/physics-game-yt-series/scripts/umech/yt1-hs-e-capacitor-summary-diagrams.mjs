// 高校編「コンデンサー・要点」(ys-hs-e-capacitor-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/2・2/2 の部品（回路・板の組・q–V グラフ）を使う。色：Q 桃、V 紫、C 黄、U 橙。
import {C,seg,lin,fade,label,line,rect,arrow,brace} from './anim.mjs';
import {card,tag,T2,fcard,U,QC,VC,WC,CC,Qt,Vt,Ct,Ut,capCircuit,fieldArrows,pair,CAP} from './yt1-hs-e-capacitor-1-diagrams.mjs';
import {qvAxes,strips,triangle,rectQV,vLine} from './yt1-hs-e-capacitor-2-diagrams.mjs';

const K='hs-e-capacitor-summary:';
const QCV=`${Qt}=${Ct}${Vt}`, UH=`${Ut}=\\tfrac12${Qt}${Vt}`, UC=`${Ut}=\\tfrac12${Ct}${Vt}^2`;
const RP=780,RW=390;
const rcard=(y,h,inner,g=1,col=C.faint)=>card(RP,y,RW,h,inner,g,col);

export const hsECapacitorSummaryDiagrams={
 [K+'what']:(p)=>capCircuit(lin(p,.3,.9)*0)+fade(seg(p,.2,.35),label('2枚の 金属の 板',(CAP.L+CAP.R)/2,(CAP.T+CAP.B+CAP.TH)/2+10,{size:30,color:C.hi,anchor:'middle',weight:700})),
 [K+'pm']:(p)=>{
  let s=capCircuit(6*lin(p,.05,.5))+fieldArrows(seg(p,.5,.6));
  s+=card(780,90,380,120,T2(`+${Qt}`,970,165,{size:56}),seg(p,.5,.6),C.a);
  s+=card(780,250,380,120,T2(`-${Qt}`,970,325,{size:56}),seg(p,.5,.6),'#7fb3ff');
  s+=fade(seg(p,.7,.85),label('Q ＝ 片方の 大きさ',970,420,{size:28,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'qcv']:(p)=>fcard(330,100,540,200,QCV,{size:72,col:QC,g:seg(p,.2,.35)}),
 [K+'c']:(p)=>{
  let s=fcard(330,40,540,170,QCV,{size:60,col:QC});
  s+=card(200,260,800,170,label('C ＝ 1 V あたりに ためる 電荷',600,330,{size:34,color:CC,anchor:'middle',weight:700})+fade(seg(p,.55,.7),label('単位：F（ファラド）＝ C/V',600,395,{size:30,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2),CC);
  return s;
 },
 [K+'shape']:(p)=>{
  let s=pair(230,150,200,150,{vbar:0,field:0,lab:'元の 板'});
  s+=pair(620,150,400,150,{vbar:0,field:0,lab:'広い',g:seg(p,.1,.25)});
  s+=pair(1000,200,200,60,{vbar:0,field:0,lab:'せまい',g:seg(p,.35,.5)});
  s+=fade(seg(p,.6,.75),label('C が 大きい',800,470,{size:32,color:CC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'u']:(p)=>{
  let s=fcard(330,50,540,180,UH,{size:64,col:WC,g:seg(p,.05,.2)});
  s+=fcard(330,280,540,180,UC,{size:64,col:WC,g:seg(p,.55,.7)});
  return s;
 },
 [K+'why']:(p)=>{
  const A=qvAxes({g:seg(p,0,.15)});
  let s=A.svg+vLine(A,seg(p,.35,.75));
  s+=rcard(110,220,label('途中の 電圧',RP+RW/2,170,{size:30,color:VC,anchor:'middle',weight:700})+label('0 → V に 増える',RP+RW/2,240,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),VC);
  return s;
 },
 [K+'graph']:(p)=>{
  const A=qvAxes();let s=A.svg+strips(A,24,{g:seg(p,.45,.6)*(1-seg(p,.8,.95))})+triangle(A,{g:seg(p,.8,.95)})+vLine(A);
  s+=rcard(110,200,label('運ぶ 仕事',RP+RW/2,175,{size:30,color:WC,anchor:'middle',weight:700})+label('＝ 直線の 下の 面積',RP+RW/2,240,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),WC);
  return s;
 },
 [K+'tri']:(p)=>{
  const A=qvAxes();let s=A.svg+triangle(A)+vLine(A);
  s+=fade(seg(p,.05,.2),brace(A.X(0),A.X(6),A.Y(0)+46,{dir:1,color:QC})+T2(Qt,A.X(3),A.Y(0)+100,{size:34}));
  s+=fade(seg(p,.2,.35),line(A.X(6)+18,A.Y(0),A.X(6)+18,A.Y(3),{color:VC,w:3})+T2(Vt,A.X(6)+44,A.Y(1.5)+12,{size:36}));
  s+=rcard(130,170,T2(UH,RP+RW/2,230,{size:52}),seg(p,.5,.65),WC);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=capCircuit(6);
  s+=card(780,140,380,200,T2(`${Ct}=2.0${U('\\mu F')}`,970,215,{size:44})+T2(`${Vt}=3.0${U('V')}`,970,295,{size:44}),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'q']:(p)=>{
  let s=fcard(400,30,400,140,QCV,{size:50,col:QC});
  s+=card(100,220,1000,160,T2(`${Qt}=2.0${U('\\mu F')}\\times3.0${U('V')}`,450,312,{size:48})+fade(seg(p,.4,.55),T2(`=6.0${U('\\mu C')}`,880,310,{size:50,auto:false,color:QC})),seg(p,.05,.2),QC);
  return s;
 },
 [K+'u9']:(p)=>{
  const A=qvAxes();let s=A.svg+triangle(A)+vLine(A);
  s+=rcard(70,330,T2(UH,RP+RW/2,130,{size:46})+T2(`=\\tfrac12\\times6.0${U('\\mu C')}\\times3.0${U('V')}`,RP+RW/2,225,{size:34})+fade(seg(p,.5,.65),T2(`=9.0${U('\\mu J')}`,RP+RW/2,320,{size:50,auto:false,color:WC})),1,WC);
  return s;
 },
 [K+'cv2']:(p)=>{
  let s=fcard(400,30,400,140,UC,{size:48,col:WC});
  s+=card(100,220,1000,160,T2(`\\tfrac12\\times2.0${U('\\mu F')}\\times(3.0${U('V')})^2`,470,312,{size:46})+fade(seg(p,.4,.55),T2(`=9.0${U('\\mu J')}`,900,310,{size:50,auto:false,color:WC})),seg(p,.05,.2),WC);
  return s;
 },
 [K+'wrong']:(p)=>card(250,150,700,160,label('✕ エネルギー ＝ QV',600,248,{size:44,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.25),C.a),
 [K+'rect']:(p)=>{
  const A=qvAxes();let s=A.svg+fade(.35,triangle(A))+vLine(A)+rectQV(A,{g:seg(p,.1,.3)});
  s+=fade(seg(p,.1,.3),rect(A.X(0),A.Y(3),A.X(6)-A.X(0),A.Y(0)-A.Y(3),{fill:C.a,fo:.12,stroke:'none',sw:0,rx:0}));
  s+=rcard(110,200,label('長方形',RP+RW/2,165,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${Qt}${Vt}=18${U('\\mu J')}`,RP+RW/2,240,{size:46}),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'half']:(p)=>{
  const A=qvAxes();let s=A.svg+triangle(A)+vLine(A)+rectQV(A,{g:.6});
  s+=rcard(110,220,label('途中の 電圧は 小さい',RP+RW/2,165,{size:28,color:VC,anchor:'middle',weight:700})+label('ちょうど 半分',RP+RW/2,220,{size:30,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.5,.65),T2(`9.0${U('\\mu J')}`,RP+RW/2,290,{size:48,auto:false,color:WC})),seg(p,.1,.25),WC);
  return s;
 },
 [K+'heat']:(p)=>{
  let s=card(200,60,800,130,label('✕ 熱で 半分 逃げた',600,140,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(200,250,800,150,label('〇 ½ ＝ 三角形の 面積',600,340,{size:40,color:WC,anchor:'middle',weight:700}),seg(p,.5,.65),WC);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=fcard(100,60,460,170,QCV,{size:60,col:QC,g:seg(p,.02,.15)});
  s+=fcard(640,60,460,170,`${Ut}=\\tfrac12${Qt}${Vt}=\\tfrac12${Ct}${Vt}^2`,{size:44,col:WC,g:seg(p,.2,.35)});
  s+=card(300,290,600,110,label('½ ＝ 三角形の 面積',600,358,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'deep']:(p)=>{
  let s=card(200,110,800,220,label('なぜ そうなるかは',600,190,{size:34,color:C.ink,anchor:'middle',weight:700})+label('深く学ぶ版 1/2・2/2 で',600,260,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
