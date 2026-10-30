// 高校編「コンデンサー・深く学ぶ 2/2」(ys-hs-e-capacitor-2) — 図。Stage 1200×515.
// 色：電荷 q・Q 桃、電圧 V 紫、容量 C 黄、エネルギー U 橙、電子 青、正電荷 赤。
// q–V グラフ：横軸 途中の電荷 q [μC]（0〜6.0）、縦軸 電圧 [V]（q/C、C＝2.0 μF → 0〜3.0）。短冊の高さは各区間の始めの電圧。
import {C,clamp,mix,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,poly,axes,brace} from './anim.mjs';
import {card,tag,T2,sceneT,fcard,U,electron,POS,NEG,QC,VC,EC,WC,CC,Qt,qt,Vt,Ct,Ut,capCircuit,fieldArrows,wires,pair,CAP} from './yt1-hs-e-capacitor-1-diagrams.mjs';
export {qvAxes,strips,triangle,rectQV,vLine};

const K='hs-e-capacitor-2:';
const dq=`\\Delta ${qt}`, qC=`\\dfrac{${qt}}{${Ct}}`;
const UHALF=`${Ut}=\\tfrac12${Qt}${Vt}`;
// ---- q–V graph ---------------------------------------------------------------------------------
function qvAxes({x=110,y=385,w=520,h=290,g=1,xmax=7,ymax=3.6,xticks=[1,2,3,4,5,6],yticks=[1,2,3]}={}){
 return axes({x,y,w,h,xmax,ymax,xticks,yticks,grid:true,g,xlabel:'q [μC]',ylabel:'電圧 [V]',xcolor:QC,ycolor:VC});
}
const VL=q=>q/2;
function strips(A,n,{g=1,color=WC,fo=.4,Q=6,hl=-1}={}){
 let s='';const d=Q/n;for(let i=0;i<n;i++){const q0=i*d,v=VL(q0);if(v<=0)continue;
  s+=rect(A.X(q0),A.Y(v),A.X(q0+d)-A.X(q0),A.Y(0)-A.Y(v),{fill:color,fo:i===hl?.8:fo,stroke:i===hl?C.hi:color,sw:n>20?0.8:2,rx:1});}
 return fade(g,s);
}
const triangle=(A,{g=1,fo=.38,Q=6,V=3}={})=>fade(g,poly([[A.X(0),A.Y(0)],[A.X(Q),A.Y(0)],[A.X(Q),A.Y(V)]],{fill:WC,fo,stroke:WC,sw:2.5}));
const rectQV=(A,{g=1,Q=6,V=3}={})=>fade(g,rect(A.X(0),A.Y(V),A.X(Q)-A.X(0),A.Y(0)-A.Y(V),{fill:'none',fo:0,stroke:C.ink,sw:2.5,rx:0}).replace('stroke-width','stroke-dasharray="10 8" stroke-width'));
const vLine=(A,p=1,{Q=6}={})=>A.plot(VL,{from:0,to:Q,p,color:VC,w:5});
const RP=780,RW=390;                                         // right panel
const rcard=(y,h,inner,g=1,col=C.faint)=>card(RP,y,RW,h,inner,g,col);
// mini graph (for the mechanics comparison): origin (x,y), size w×h, line to (w,h)
function mini(x,y,w,h,{xl='',yl='',xc=C.dim,yc=C.dim,g=1,f=WC,tx='',ty=''}={}){
 let s=arrow(x-6,y,x+w+24,y,{color:C.dim,w:2.5,head:12})+arrow(x,y+6,x,y-h-24,{color:C.dim,w:2.5,head:12});
 s+=poly([[x,y],[x+w,y],[x+w,y-h]],{fill:f,fo:.38,stroke:f,sw:2})+line(x,y,x+w,y-h,{color:yc,w:4});
 s+=T2(xl,x+w+34,y+30,{size:30,auto:false,color:xc})+T2(yl,x-24,y-h-26,{size:30,auto:false,color:yc});
 if(tx)s+=T2(tx,x+w/2,y+70,{size:34});
 if(ty)s+=label(ty,x+w/2,y-h-50,{size:26,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// light hitting a metal plate, an electron leaving
function photo(p,{g=1,t=0}={}){
 let s=rect(160,330,520,60,{fill:'#8795ad',fo:.35,stroke:C.dim,sw:2.5,rx:4})+label('金属',420,370,{size:26,color:C.ink,anchor:'middle',weight:700});
 for(let i=0;i<3;i++){const x0=200+i*120,ph=t*6+i;let pts=[];for(let k=0;k<=40;k++){const u=k/40;pts.push([x0+u*120,90+u*230+10*Math.sin(u*18-ph)]);}s+=draw(pts,seg(p,.05+i*.05,.2+i*.05),{color:'#c98bff',w:3});}
 s+=fade(seg(p,.1,.25),label('光',230,70,{size:30,color:'#c98bff',anchor:'middle',weight:700}));
 const u=seg(p,.35,.7);s+=fade(seg(p,.3,.4),electron(mix(560,640,u),mix(318,170,u),{r:13})+arrow(575,300,mix(580,660,u),mix(290,150,u),{color:NEG,w:4,head:14}));
 return fade(g,s);
}

export const hsECapacitor2Diagrams={
 // ================= S1 前回からの問い =================
 [K+'q']:(p)=>{
  let s=capCircuit(6)+fieldArrows(1);
  s+=fade(seg(p,.05,.2),label('電池が 仕事',CAP.WX,CAP.B+80,{size:28,color:WC,anchor:'middle',weight:700}));
  s+=card(780,140,380,200,label('エネルギーは',970,205,{size:30,color:WC,anchor:'middle',weight:700})+T2(`${Qt}${Vt}\\ ?`,970,290,{size:56}),seg(p,.4,.55),WC);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=capCircuit(6)+wires({volt:'3.0 V'});
  s+=card(800,90,360,280,T2(`${Ct}=2.0${U('\\mu F')}`,970,165,{size:42})+T2(`${Vt}=3.0${U('V')}`,970,240,{size:42})+fade(seg(p,.5,.65),T2(`${Qt}=6.0${U('\\mu C')}`,970,320,{size:42})),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'qv']:(p)=>{
  let s=card(150,80,900,180,T2(`${Qt}${Vt}=6.0${U('\\mu C')}\\times3.0${U('V')}`,470,185,{size:50})+fade(seg(p,.45,.6),T2(`=18${U('\\mu J')}`,880,182,{size:50,auto:false,color:WC})),seg(p,.02,.15),WC);
  s+=fade(seg(p,.7,.85),label('本当に？',600,340,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'guess']:(p)=>{
  const opt=(x,t,g)=>card(x-160,170,320,130,label(t,x,248,{size:32,color:C.ink,anchor:'middle',weight:700}),g,C.hi);
  let s=label('本当の エネルギーは？',600,100,{size:36,color:C.hi,anchor:'middle',weight:700});
  s+=opt(250,'18 μJ ちょうど',seg(p,.15,.3))+opt(600,'18 μJ より 大きい',seg(p,.4,.55))+opt(950,'18 μJ より 小さい',seg(p,.65,.8));
  return s;
 },
 // ================= S2 途中の電圧 =================
 [K+'wq']:(p)=>{
  let s=card(150,60,900,130,label('電圧 ＝ 1 C あたりの エネルギー',600,140,{size:36,color:VC,anchor:'middle',weight:700}),seg(p,.02,.15),VC);
  s+=fade(seg(p,.45,.55),arrow(600,205,600,265,{color:C.hi,w:5,head:16}));
  s+=card(150,280,900,130,label('電荷を 運ぶ 仕事 ＝ 電荷 × 電圧',600,360,{size:36,color:WC,anchor:'middle',weight:700}),seg(p,.5,.65),WC);
  return s;
 },
 [K+'start']:(p)=>{
  let s=capCircuit(lin(p,.5,.9));
  s+=fade(seg(p,.05,.2),label('まだ 空',(CAP.L+CAP.R)/2,(CAP.T+CAP.B+CAP.TH)/2+10,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=card(780,110,380,240,label('充電の 始め',970,170,{size:30,color:C.ink,anchor:'middle',weight:700})+label('電圧 ＝ 0',970,235,{size:38,color:VC,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('ほぼ 仕事なしで 運べる',970,305,{size:26,color:WC,anchor:'middle',weight:700})),seg(p,.15,.3),VC);
  return s;
 },
 [K+'qsmall']:(p)=>{
  let s=capCircuit(2);
  s+=card(780,70,380,160,label('途中の 電荷',970,125,{size:30,color:QC,anchor:'middle',weight:700})+T2(qt,970,195,{size:60}),seg(p,.05,.2),QC);
  s+=card(780,260,380,160,label('最後の 電荷',970,315,{size:30,color:QC,anchor:'middle',weight:700})+T2(Qt,970,385,{size:60}),seg(p,.55,.7),C.faint);
  return s;
 },
 [K+'midV']:(p)=>{
  let s=capCircuit(2);
  s+=card(780,90,380,270,label('途中の 電圧',970,150,{size:30,color:VC,anchor:'middle',weight:700})+fade(seg(p,.4,.55),T2(qC,970,255,{size:64})),seg(p,.05,.2),VC);
  s+=fade(seg(p,.15,.3),label('容量は 途中でも C',970,410,{size:26,color:CC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'table']:(p)=>{
  const rows=[['2.0 μC','1.0 V'],['4.0 μC','2.0 V'],['6.0 μC','3.0 V']];
  let s=card(250,40,700,330,'',1,C.faint);
  s+=label('途中の 電荷 q',420,100,{size:30,color:QC,anchor:'middle',weight:700})+label('電圧 q/C',780,100,{size:30,color:VC,anchor:'middle',weight:700});
  rows.forEach((r,i)=>{const y=180+i*70,g=seg(p,.05+i*.25,.15+i*.25);s+=fade(g,label(r[0],420,y,{size:34,color:C.ink,anchor:'middle'})+label(r[1],780,y,{size:34,color:i===2?C.hi:C.ink,anchor:'middle',weight:i===2?700:400}));});
  s+=fade(seg(p,.05,.15),label('C ＝ 2.0 μF',600,430,{size:30,color:CC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'dq']:(p)=>{
  let s=card(200,60,800,200,T2(`${qC}\\times${dq}`,600,180,{size:64}),seg(p,.3,.45),WC);
  s+=fade(seg(p,.02,.15),label('少しの 電荷',740,330,{size:30,color:QC,anchor:'middle',weight:700})+T2(dq,740,390,{size:44}));
  s+=fade(seg(p,.5,.65),label('そのときの 電圧',470,330,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('仕事',600,40,{size:30,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'early']:(p)=>{
  const bar=(x,h,t,c,g)=>fade(g,rect(x,400-h,80,h,{fill:WC,fo:.5,stroke:WC,sw:2,rx:2})+label(t,x+40,450,{size:28,color:c,anchor:'middle',weight:700}));
  let s=line(150,400,1050,400,{color:C.dim,w:3});
  s+=bar(300,50,'始めの うち',C.ink,seg(p,.05,.2))+bar(800,250,'終わり 近く',C.ink,seg(p,.3,.45));
  s+=fade(seg(p,.05,.2),label('電圧 小',340,330,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('電圧 大',840,130,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('同じ Δq でも 仕事が 小さい',600,80,{size:32,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 グラフの三角形 =================
 [K+'axes']:(p)=>{
  const A=qvAxes({g:seg(p,0,.2)});
  let s=A.svg+vLine(A,seg(p,.4,.75));
  s+=rcard(110,200,label('電圧 ＝',RP+150,215,{size:34,color:VC,anchor:'middle',weight:700})+T2(qC,RP+290,210,{size:54})+label('原点を 通る 直線',RP+RW/2,270,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.65),VC);
  return s;
 },
 [K+'strip']:(p)=>{
  const A=qvAxes();let s=A.svg+vLine(A);
  const q0=3.6,w=.6,v=VL(q0);
  s+=fade(seg(p,.05,.2),rect(A.X(q0),A.Y(v),A.X(q0+w)-A.X(q0),A.Y(0)-A.Y(v),{fill:WC,fo:.6,stroke:C.hi,sw:2.5,rx:1}));
  s+=fade(seg(p,.2,.35),brace(A.X(q0),A.X(q0+w),A.Y(0)+46,{dir:1,color:QC})+T2(dq,A.X(q0+w/2),A.Y(0)+102,{size:32}));
  s+=fade(seg(p,.35,.5),T2(qC,A.X(q0)-50,A.Y(v/2)+12,{size:34}));
  s+=rcard(110,200,label('1回の 仕事',RP+RW/2,165,{size:28,color:WC,anchor:'middle',weight:700})+label('＝ 短冊の 面積',RP+RW/2,235,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),WC);
  return s;
 },
 [K+'six']:(p)=>{
  const A=qvAxes();let s=A.svg+strips(A,6,{g:seg(p,.05,.3)})+vLine(A);
  s+=rcard(110,220,label('1.0 μC ずつ 6本',RP+RW/2,175,{size:32,color:QC,anchor:'middle',weight:700})+fade(seg(p,.5,.65),T2(`7.5${U('\\mu J')}`,RP+RW/2,265,{size:52,auto:false,color:WC})),seg(p,.05,.2),WC);
  return s;
 },
 [K+'fine']:(p)=>{
  const A=qvAxes();let s=A.svg+strips(A,12,{g:1})+vLine(A);
  s+=rcard(110,220,label('0.50 μC ずつ 12本',RP+RW/2,175,{size:32,color:QC,anchor:'middle',weight:700})+fade(seg(p,.3,.45),T2(`8.25${U('\\mu J')}`,RP+RW/2,265,{size:52,auto:false,color:WC})),1,WC);
  s+=fade(seg(p,.6,.75),label('すき間が 減る',RP+RW/2,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'limit']:(p)=>{
  const A=qvAxes();const n=Math.round(mix(12,60,seg(p,.05,.4)));
  let s=A.svg+fade(1-seg(p,.55,.7),strips(A,n))+triangle(A,{g:seg(p,.55,.7)})+vLine(A);
  s+=rcard(110,220,label('分ける ほど',RP+RW/2,175,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 三角形の 面積',RP+RW/2,250,{size:34,color:WC,anchor:'middle',weight:700}),seg(p,.3,.45),WC);
  return s;
 },
 [K+'tri']:(p)=>{
  const A=qvAxes();let s=A.svg+triangle(A)+vLine(A);
  s+=fade(seg(p,.05,.2),brace(A.X(0),A.X(6),A.Y(0)+46,{dir:1,color:QC})+label('最後の 電荷',A.X(3)-50,A.Y(0)+104,{size:26,color:QC,anchor:'middle',weight:700})+T2(Qt,A.X(3)+60,A.Y(0)+100,{size:34}));
  s+=fade(seg(p,.3,.45),line(A.X(6)+18,A.Y(0),A.X(6)+18,A.Y(3),{color:VC,w:3})+T2(Vt,A.X(6)+44,A.Y(1.5)+12,{size:36}));
  s+=rcard(130,170,T2(`\\tfrac12\\times${Qt}\\times${Vt}`,RP+RW/2,230,{size:52}),seg(p,.6,.75),WC);
  return s;
 },
 [K+'U']:(p)=>{
  const A=qvAxes();let s=A.svg+triangle(A)+vLine(A);
  s+=rcard(110,190,T2(UHALF,RP+RW/2,220,{size:60}),seg(p,.1,.25),WC);
  s+=tag('結果',RP+RW/2,370,{color:C.hi,g:seg(p,.5,.65),size:28});
  return s;
 },
 [K+'calc']:(p)=>{
  const A=qvAxes();let s=A.svg+triangle(A)+vLine(A);
  s+=rcard(70,330,T2(UHALF,RP+RW/2,130,{size:46})+T2(`=\\tfrac12\\times6.0${U('\\mu C')}\\times3.0${U('V')}`,RP+RW/2,225,{size:36})+fade(seg(p,.5,.65),T2(`=9.0${U('\\mu J')}`,RP+RW/2,320,{size:50,auto:false,color:WC})),1,WC);
  return s;
 },
 [K+'rect']:(p)=>{
  const A=qvAxes();let s=A.svg+triangle(A)+vLine(A)+rectQV(A,{g:seg(p,.05,.25)});
  s+=fade(seg(p,.1,.25),line(A.X(0),A.Y(3),A.X(6),A.Y(3),{color:VC,w:3,dash:'8 6'}));
  s+=rcard(90,300,label('長方形',RP+RW/2,145,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${Qt}${Vt}=18${U('\\mu J')}`,RP+RW/2,220,{size:46})
   +fade(seg(p,.55,.7),label('三角形の 9.0 μJ の 2倍',RP+RW/2,320,{size:30,color:C.a,anchor:'middle',weight:700})),seg(p,.25,.4),C.faint);
  return s;
 },
 [K+'avg']:(p)=>{
  const A=qvAxes();let s=A.svg+triangle(A,{g:1-.6*seg(p,.4,.6)})+vLine(A);
  s+=fade(seg(p,.35,.5),rect(A.X(0),A.Y(1.5),A.X(6)-A.X(0),A.Y(0)-A.Y(1.5),{fill:WC,fo:.3,stroke:WC,sw:2.5,rx:0}));
  s+=fade(seg(p,.35,.5),T2(`\\tfrac{${Vt}}{2}`,A.X(6)+40,A.Y(.75)+14,{size:34}));
  s+=rcard(110,220,label('平均の 電圧',RP+RW/2,175,{size:30,color:VC,anchor:'middle',weight:700})+T2(`\\tfrac{${Vt}}{2}=1.5${U('V')}`,RP+RW/2,260,{size:48}),seg(p,.55,.7),VC);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(150,60,900,140,T2(`1${U('V')}=1${U('J/C')}`,600,145,{size:54,auto:false}),seg(p,.02,.15),VC);
  s+=card(150,240,900,140,T2(`\\mathrm{C}\\times\\mathrm{V}=\\mathrm{C}\\times\\mathrm{J/C}=\\mathrm{J}`,600,325,{size:50,auto:false}),seg(p,.3,.45),WC);
  s+=fade(seg(p,.7,.85),T2(`\\mathrm{\\mu C}\\times\\mathrm{V}=\\mathrm{\\mu J}`,600,450,{size:40,auto:false,color:C.hi}));
  return s;
 },
 [K+'mech']:(p)=>{
  let s=mini(90,370,240,200,{xl:'t',yl:'v',xc:C.t,yc:C.v,tx:'x=\\tfrac12at^2',ty:'等加速度',g:seg(p,.25,.4)});
  s+=mini(480,370,240,200,{xl:'x',yl:'F',xc:C.x,yc:C.F,tx:`${Ut}=\\tfrac12kx^2`,ty:'ばね',g:seg(p,.5,.65)});
  s+=mini(870,370,240,200,{xl:'q',yl:'V',xc:QC,yc:VC,tx:UHALF,ty:'コンデンサー',g:seg(p,.02,.15)});
  return s;
 },
 [K+'mech2']:(p)=>{
  let s=mini(90,370,240,200,{xl:'t',yl:'v',xc:C.t,yc:C.v,tx:'x=\\tfrac12at^2',ty:'等加速度'});
  s+=mini(480,370,240,200,{xl:'x',yl:'F',xc:C.x,yc:C.F,tx:`${Ut}=\\tfrac12kx^2`,ty:'ばね'});
  s+=mini(870,370,240,200,{xl:'q',yl:'V',xc:QC,yc:VC,tx:UHALF,ty:'コンデンサー'});
  s+=card(250,20,700,70,label('½ ＝ 直線の 下の 三角形',600,68,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 // ================= S4 三つの形 =================
 [K+'cv2']:(p)=>{
  let s=fcard(120,60,420,170,UHALF,{size:52,col:WC});
  s+=fcard(660,60,420,170,`${Qt}=${Ct}${Vt}`,{size:52,col:QC,g:seg(p,.15,.3)});
  s+=fade(seg(p,.3,.45),arrow(660,180,450,160,{color:C.hi,w:4,head:14})+label('Q に 入れる',560,215,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fcard(310,280,580,170,`${Ut}=\\tfrac12${Ct}${Vt}^2`,{size:60,col:WC,g:seg(p,.55,.7)});
  return s;
 },
 [K+'cv2n']:(p)=>{
  let s=fcard(370,30,460,150,`${Ut}=\\tfrac12${Ct}${Vt}^2`,{size:50,col:WC});
  s+=card(100,220,1000,160,T2(`\\tfrac12\\times2.0${U('\\mu F')}\\times(3.0${U('V')})^2`,470,312,{size:46})+fade(seg(p,.35,.5),T2(`=9.0${U('\\mu J')}`,900,310,{size:50,auto:false,color:WC})),1,WC);
  s+=fade(seg(p,.6,.75),label('½QV と 同じ 値',600,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'double']:(p)=>{
  let s=fcard(370,30,460,150,`${Ut}=\\tfrac12${Ct}${Vt}^2`,{size:50,col:WC});
  s+=card(250,230,700,150,label('3.0 V → 6.0 V（2倍）',600,295,{size:36,color:VC,anchor:'middle',weight:700})+label('エネルギーは 何倍？',600,355,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'double2']:(p)=>{
  let s=fcard(370,30,460,150,`${Ut}=\\tfrac12${Ct}${Vt}^2`,{size:50,col:WC});
  s+=card(100,220,1000,160,T2(`\\tfrac12\\times2.0${U('\\mu F')}\\times(6.0${U('V')})^2`,470,312,{size:46})+fade(seg(p,.3,.45),T2(`=36${U('\\mu J')}`,900,310,{size:50,auto:false,color:WC})),1,WC);
  s+=fade(seg(p,.6,.75),label('9.0 μJ の 4倍',600,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'double3']:(p)=>{
  const A=axes({x:110,y:400,w:520,h:300,xmax:13.5,ymax:6.9,xticks:[6,12],yticks:[3,6],grid:true,xlabel:'q [μC]',ylabel:'電圧 [V]',xcolor:QC,ycolor:VC});
  let s=A.svg;
  s+=fade(seg(p,.05,.4),poly([[A.X(0),A.Y(0)],[A.X(12),A.Y(0)],[A.X(12),A.Y(6)]],{fill:WC,fo:.22,stroke:WC,sw:2}));
  s+=poly([[A.X(0),A.Y(0)],[A.X(6),A.Y(0)],[A.X(6),A.Y(3)]],{fill:WC,fo:.55,stroke:WC,sw:2});
  s+=A.plot(u=>u/2,{from:0,to:12,color:VC,w:4});
  s+=rcard(70,330,label('電荷 2倍',RP+RW/2,130,{size:32,color:QC,anchor:'middle',weight:700})+label('平均の 電圧 2倍',RP+RW/2,190,{size:32,color:VC,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('2 × 2 ＝ 4倍',RP+RW/2,280,{size:40,color:WC,anchor:'middle',weight:700}))+fade(seg(p,.6,.75),label('底辺も 高さも 2倍',RP+RW/2,355,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2),WC);
  return s;
 },
 [K+'q2c']:(p)=>{
  let s=fcard(120,40,420,160,UHALF,{size:50,col:WC});
  s+=fcard(660,40,420,160,`${Vt}=\\dfrac{${Qt}}{${Ct}}`,{size:50,col:VC,g:seg(p,.1,.25)});
  s+=card(150,240,900,200,T2(`${Ut}=\\tfrac12\\times${Qt}\\times\\dfrac{${Qt}}{${Ct}}`,420,355,{size:50})+fade(seg(p,.55,.7),T2(`=\\dfrac{${Qt}^2}{2${Ct}}`,850,350,{size:56})),seg(p,.3,.45),WC);
  return s;
 },
 [K+'which']:(p)=>{
  let s=fcard(60,80,340,160,UHALF,{size:46,col:WC,g:seg(p,.02,.15)})+fcard(430,80,340,160,`${Ut}=\\tfrac12${Ct}${Vt}^2`,{size:46,col:WC,g:seg(p,.02,.15)})+fcard(800,80,340,160,`${Ut}=\\dfrac{${Qt}^2}{2${Ct}}`,{size:46,col:WC,g:seg(p,.02,.15)});
  s+=card(250,310,700,110,label('何が 一定か で 選ぶ',600,378,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'change']:(p)=>{
  let s=pair(270,110,240,180,{vbar:0,field:0,lab:'2.0 μF'});
  s+=fade(seg(p,.1,.25),arrow(450,240,560,240,{color:C.hi,w:5,head:16})+label('間隔 半分',505,210,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=pair(750,200,240,90,{vbar:0,field:0,lab:'4.0 μF',g:seg(p,.1,.25)});
  s+=card(930,150,250,150,label('エネルギーは',1055,205,{size:26,color:WC,anchor:'middle',weight:700})+label('増える？',1055,260,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'vconst']:(p)=>{
  let s=card(40,40,540,440,label('電池を つないだ まま',310,95,{size:30,color:C.ink,anchor:'middle',weight:700})+label('V 一定：3.0 V',310,150,{size:32,color:VC,anchor:'middle',weight:700})
   +T2(`${Ut}=\\tfrac12${Ct}${Vt}^2`,310,235,{size:44})+fade(seg(p,.4,.55),T2(`=\\tfrac12\\times4.0\\times3.0^2`,310,310,{size:38}))+fade(seg(p,.6,.75),T2(`=18${U('\\mu J')}`,310,385,{size:46,auto:false,color:WC})+label('増える ↑',310,450,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15),VC);
  s+=card(620,40,540,440,label('電池を 外してから',890,95,{size:30,color:C.dim,anchor:'middle',weight:700}),.35,C.faint);
  return s;
 },
 [K+'qconst']:(p)=>{
  let s=card(40,40,540,440,label('電池を つないだ まま',310,95,{size:30,color:C.ink,anchor:'middle',weight:700})+label('V 一定：3.0 V',310,150,{size:32,color:VC,anchor:'middle',weight:700})
   +T2(`${Ut}=\\tfrac12${Ct}${Vt}^2`,310,235,{size:44})+T2(`=18${U('\\mu J')}`,310,385,{size:46,auto:false,color:WC})+label('増える ↑',310,450,{size:30,color:C.hi,anchor:'middle',weight:700}),.6,VC);
  s+=card(620,40,540,440,label('電池を 外してから',890,95,{size:30,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.35,.5),label('Q 一定：6.0 μC',890,150,{size:32,color:QC,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),T2(`${Ut}=\\dfrac{${Qt}^2}{2${Ct}}`,890,245,{size:44})),seg(p,.02,.15),QC);
  return s;
 },
 [K+'qconst2']:(p)=>{
  let s=card(40,40,540,440,label('電池を つないだ まま',310,95,{size:30,color:C.ink,anchor:'middle',weight:700})+label('V 一定：3.0 V',310,150,{size:32,color:VC,anchor:'middle',weight:700})
   +T2(`${Ut}=\\tfrac12${Ct}${Vt}^2`,310,235,{size:44})+T2(`=18${U('\\mu J')}`,310,385,{size:46,auto:false,color:WC})+label('増える ↑',310,450,{size:30,color:C.hi,anchor:'middle',weight:700}),.6,VC);
  s+=card(620,40,540,440,label('電池を 外してから',890,95,{size:30,color:C.ink,anchor:'middle',weight:700})+label('Q 一定：6.0 μC',890,150,{size:32,color:QC,anchor:'middle',weight:700})
   +T2(`${Ut}=\\dfrac{${Qt}^2}{2${Ct}}`,890,218,{size:34})+fade(seg(p,.1,.25),T2(`=\\dfrac{6.0^2}{2\\times4.0}`,890,318,{size:34}))+fade(seg(p,.45,.6),T2(`=4.5${U('\\mu J')}`,890,395,{size:44,auto:false,color:WC})+label('減る ↓',890,455,{size:30,color:C.a,anchor:'middle',weight:700})),1,QC);
  return s;
 },
 [K+'qconst3']:(p)=>{
  let s=card(620,40,540,440,label('電池を 外してから',890,95,{size:30,color:C.ink,anchor:'middle',weight:700})
   +T2(`${Vt}=\\dfrac{6.0${U('\\mu C')}}{4.0${U('\\mu F')}}=1.5${U('V')}`,890,190,{size:40})
   +fade(seg(p,.4,.55),T2(`\\tfrac12\\times6.0${U('\\mu C')}\\times1.5${U('V')}`,890,300,{size:38}))+fade(seg(p,.6,.75),T2(`=4.5${U('\\mu J')}`,890,385,{size:46,auto:false,color:WC})),1,QC);
  s+=pair(270,140,240,90,{vbar:0,field:1,lab:'電荷は 逃げ場が ない'});
  return s;
 },
 // ================= S5 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  const A=qvAxes();let s=A.svg+triangle(A)+vLine(A)+rectQV(A,{g:.8});
  s+=rcard(110,220,T2(`${Qt}${Vt}`,RP+130,190,{size:44})+label('ではなく',RP+260,198,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.4,.55),T2(UHALF,RP+RW/2,280,{size:52})),seg(p,.05,.2),WC);
  return s;
 },
 [K+'ans2']:(p)=>{
  const A=qvAxes();let s=A.svg+triangle(A)+vLine(A);
  s+=rcard(110,220,label('途中の 電圧 ＜ 最後の 電圧',RP+RW/2,175,{size:28,color:VC,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('½ ＝ 三角形の 面積',RP+RW/2,255,{size:34,color:WC,anchor:'middle',weight:700})),seg(p,.05,.2),WC);
  return s;
 },
 [K+'heat']:(p)=>{
  let s=card(200,60,800,130,label('✕ 熱で 半分 逃げた',600,140,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(200,250,800,150,label('〇 たまった エネルギー ＝ 三角形',600,340,{size:38,color:WC,anchor:'middle',weight:700}),seg(p,.5,.65),WC);
  return s;
 },
 [K+'univ']:(p)=>{
  const A=qvAxes();let s=A.svg+strips(A,24)+vLine(A);
  s+=tag('大学編：短冊の 足し算 → 積分',RP+RW/2,250,{color:C.hi,g:seg(p,.2,.35),size:24});
  return s;
 },
 [K+'next1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=photo(p,{t});
  s+=card(760,130,400,220,label('電圧なし',960,195,{size:32,color:VC,anchor:'middle',weight:700})+label('光を 当てる だけで',960,255,{size:30,color:C.ink,anchor:'middle',weight:700})+label('電子が 飛び出す',960,310,{size:30,color:NEG,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=photo(1,{t});
  s+=card(760,130,400,220,label('光は 電子に',960,215,{size:34,color:C.ink,anchor:'middle',weight:700})+label('どうやって エネルギーを',960,270,{size:28,color:WC,anchor:'middle',weight:700})+label('渡す？',960,320,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'bye']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.35,photo(1,{t}));
  s+=card(250,170,700,150,label('原子：光子と電子 へ',600,260,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
