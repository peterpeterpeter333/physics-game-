// 高校編「電流とオームの法則・要点」(ys-hs-e-current-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/4〜4/4 の部品と数値例をそのまま使う。色：電流 I 緑、電圧 V 紫、電荷 Q 桃、抵抗 R 白、電子 青。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,axes,clamp,mix} from './anim.mjs';
import {battery,card,tag,T2,sceneT,IC,VC,QC,WC,NEG,POS,CU,It,Qt,Vt,Rt,Wt,dQ,dT,U,qtok,edot,electron,tube,section,stream,passed,circuit,CIR,fcard,IDEF} from './yt1-hs-e-current-1-diagrams.mjs';
import {viGraph} from './yt1-hs-e-current-3-diagrams.mjs';
import {series,parallel,SC,PC} from './yt1-hs-e-current-4-diagrams.mjs';

const K='hs-e-current-summary:';
const R1=`${Rt}_1`,R2=`${Rt}_2`;
const PX=700,panel=(inner,g=1,col=C.faint)=>card(PX,60,460,400,inner,g,col);

export const hsECurrentSummaryDiagrams={
 [K+'i']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,170)+section(600,170)+stream(t,{x1:70,x2:1130,gx:600,y:170,r:2,speed:120});
  s+=fcard(380,290,440,180,IDEF,{size:56,col:IC,g:seg(p,.4,.55)});
  return s;
 },
 [K+'a']:(p)=>{
  let s=fcard(250,50,700,140,`1\\ \\mathrm{A}=1\\ \\mathrm{C/s}`,{size:56,col:IC});
  s+=card(200,240,800,170,T2(`${It}=\\dfrac{6\\ \\mathrm{C}}{2\\ \\mathrm{s}}=3\\ \\mathrm{A}`,600,335,{size:52,auto:false}),seg(p,.45,.6),IC);
  return s;
 },
 [K+'v']:(p)=>{
  let s=fcard(330,50,540,170,`${Vt}=\\dfrac{${Wt}}{${Qt}}`,{size:58,col:VC});
  s+=fcard(300,280,600,140,`1\\ \\mathrm{V}=1\\ \\mathrm{J/C}`,{size:56,col:VC,g:seg(p,.45,.6)});
  return s;
 },
 [K+'v2']:(p)=>{
  let s=fcard(300,40,600,130,`1\\ \\mathrm{V}=1\\ \\mathrm{J/C}`,{size:48,col:VC});
  const u=seg(p,.1,.5);s+=qtok(mix(300,650,u),300)+label('1 C',mix(300,650,u),265,{size:24,color:QC,anchor:'middle',weight:700});
  s+=line(120,300,239,300,{color:C.dim,w:4})+line(261,300,680,300,{color:C.dim,w:4})+battery(250,300,{pos:'right'})+label('1.5 V の 乾電池',250,400,{size:28,color:VC,anchor:'middle',weight:700});
  s+=fade(seg(p,.45,.6),rect(720,260,160,80,{fill:WC,fo:.5,stroke:WC,sw:2,rx:8})+label('1.5 J',800,310,{size:34,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r']:(p)=>{
  let s=fcard(330,60,540,190,`${Rt}=\\dfrac{${Vt}}{${It}}`,{size:66,col:C.ink});
  s+=fade(seg(p,.4,.55),T2(`1\\ \\Omega=1\\ \\mathrm{V/A}`,600,350,{size:48,auto:false}));
  return s;
 },
 [K+'ohm']:(p)=>{
  const {svg}=viGraph({pts:3,ln:seg(p,.05,.4)});
  let s=svg+card(780,110,380,230,label('温度 一定の 金属など',970,170,{size:26,color:C.ink,anchor:'middle',weight:700})+label('オームの法則',970,225,{size:30,color:C.hi,anchor:'middle',weight:700})+T2(`${Vt}=${Rt}${It}`,970,295,{size:48}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'why']:(p)=>{
  let s=line(200,140,560,140,{color:VC,w:4,dash:'10 8'})+line(200,380,560,380,{color:VC,w:4,dash:'10 8'})+label('高い',184,149,{size:26,color:VC,anchor:'end',weight:700})+label('低い',184,389,{size:26,color:VC,anchor:'end',weight:700});
  s+=arrow(400,150,400,370,{color:IC,w:7,head:20,g:seg(p,.1,.35)})+fade(seg(p,.2,.35),label('電流',420,270,{size:28,color:IC,weight:700}));
  s+=card(700,150,440,200,label('電気の 高さの 差',920,215,{size:32,color:VC,anchor:'middle',weight:700})+label('差が 大きい ほど 多く 流れる',920,290,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55),VC);
  return s;
 },
 [K+'why2']:(p)=>{
  let s=card(80,90,500,300,T2(`${Rt}=\\dfrac{${Vt}}{${It}}`,330,200,{size:56})+tag('定義',330,320,{color:C.hi,size:28}),seg(p,.4,.55),C.hi);
  s+=card(620,90,500,300,label('R が 一定',870,205,{size:40,color:C.ink,anchor:'middle',weight:700})+tag('実験の 法則',870,320,{color:C.F,size:28}),seg(p,.6,.75),C.F);
  s+=fade(seg(p,.05,.2)*(1-seg(p,.35,.45)),label('電流は 電圧に 比例（実験）',600,460,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=circuit({elem:'res',cur:seg(p,.5,.65),batt:''});
  s+=label('2.0 Ω',CIR.ex,CIR.T-40,{size:30,color:C.ink,anchor:'middle',weight:700})+label('6.0 V',CIR.bx,CIR.B+70,{size:30,color:VC,anchor:'middle',weight:700});
  s+=card(820,110,360,280,T2(`${It}=\\dfrac{${Vt}}{${Rt}}`,1000,190,{size:46})+fade(seg(p,.4,.55),T2(`=\\dfrac{6.0}{2.0}=3.0\\ \\mathrm{A}`,1000,320,{size:40,auto:false,color:IC})),seg(p,.1,.25),IC);
  return s;
 },
 [K+'series']:(p)=>{
  let s=series({lab:['2.0 Ω','3.0 Ω'],cur:1});
  s+=panel(label('直列：電流が 同じ',930,130,{size:28,color:IC,anchor:'middle',weight:700})+T2(`${Rt}=${R1}+${R2}`,930,230,{size:46})+fade(seg(p,.5,.65),T2(`=2.0+3.0=5.0\\ \\Omega`,930,340,{size:40,auto:false,color:C.hi})),seg(p,.1,.25),IC);
  return s;
 },
 [K+'par']:(p)=>{
  let s=parallel({cur:1,itext:['I','I₁','I₂']});
  s+=panel(label('並列：電圧が 同じ',930,130,{size:28,color:VC,anchor:'middle',weight:700})+T2(`\\dfrac{1}{${Rt}}=\\dfrac{1}{${R1}}+\\dfrac{1}{${R2}}`,930,260,{size:46}),seg(p,.1,.25),VC);
  return s;
 },
 [K+'par2']:(p)=>{
  let s=parallel({lab:['6 Ω','3 Ω'],vt:'6 V',cur:1,itext:['3 A','','']});
  s+=fade(seg(p,.35,.5),label('1 A',PC.nA+20,PC.y1-14,{size:26,color:IC,weight:700})+label('2 A',PC.nA+20,PC.y2+40,{size:26,color:IC,weight:700}));
  s+=panel(T2(`${Rt}=2\\ \\Omega`,930,150,{size:50,auto:false,color:C.hi})+fade(seg(p,.4,.55),T2(`1+2=3\\ \\mathrm{A}`,930,280,{size:42,auto:false,color:IC})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'mis']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,220)+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:220,r:1.2,speed:90,dir:-1});
  s+=fade(seg(p,.1,.25),arrow(820,110,380,110,{color:NEG,w:6,head:20})+label('電子の 動き',600,80,{size:30,color:NEG,anchor:'middle',weight:700}));
  s+=card(300,330,600,120,label('✕ 電流の 向き ＝ 電子の 向き？',600,402,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'mis2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,220)+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:220,r:1.2,speed:90,dir:-1});
  s+=arrow(820,110,380,110,{color:NEG,w:6,head:20})+label('電子の 動き',600,80,{size:30,color:NEG,anchor:'middle',weight:700});
  s+=arrow(380,360,820,360,{color:IC,w:8,head:24,g:seg(p,.1,.3)})+fade(seg(p,.2,.35),label('電流 ＝ 正の 電荷が 進む 向き（約束）',600,420,{size:28,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('逆向き',1030,300,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis3']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({on:1,cur:1,elec:seg(p,.4,.55),t,ev:60,n:26});
  s+=card(850,110,310,280,label('電流：＋極 → −極',1005,190,{size:28,color:IC,anchor:'middle',weight:700})+fade(seg(p,.4,.55),label('電子：−極 → ＋極',1005,290,{size:28,color:NEG,anchor:'middle',weight:700})),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'slow']:(p)=>{
  const x0=200,k=800,y=200;
  let s=line(x0,y,x0+k,y,{color:C.ink,w:3});
  for(let i=0;i<=10;i++)s+=line(x0+k*i/10,y,x0+k*i/10,y-(i%5?16:30),{color:C.ink,w:2});
  s+=label('0',x0,y+36,{size:24,color:C.dim,anchor:'middle'})+label('0.5 mm',x0+k/2,y+36,{size:24,color:C.dim,anchor:'middle'})+label('1 mm',x0+k,y+36,{size:24,color:C.dim,anchor:'middle'});
  s+=rect(x0,y-70,k*.074*seg(p,.2,.55),30,{fill:NEG,fo:.7,stroke:NEG,sw:2,rx:3})+fade(seg(p,.45,.6),label('約 0.074 mm（1秒）',x0+k*.074+16,y-46,{size:30,color:NEG,weight:700}));
  s+=card(250,310,700,130,label('1 mm² の 銅線 に 1 A',600,365,{size:28,color:C.ink,anchor:'middle',weight:700})+label('電子の 列は とても ゆっくり',600,415,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'end']:(p)=>{
  const it=(x,t,src,col,g)=>card(x,110,320,230,label(t,x+160,175,{size:32,color:col,anchor:'middle',weight:700})+T2(src,x+160,280,{size:40}),g,col);
  return it(60,'電流',IDEF,IC,seg(p,.05,.2))+it(440,'電圧',`${Vt}=\\dfrac{${Wt}}{${Qt}}`,VC,seg(p,.25,.4))+it(820,'抵抗',`${Rt}=\\dfrac{${Vt}}{${It}}`,C.ink,seg(p,.5,.65));
 },
 [K+'deep']:(p)=>{
  let s=card(80,90,500,220,label('直列',330,150,{size:32,color:C.hi,anchor:'middle',weight:700})+T2(`${Rt}=${R1}+${R2}`,330,250,{size:44}),1,C.faint);
  s+=card(620,90,500,220,label('並列',870,150,{size:32,color:C.hi,anchor:'middle',weight:700})+T2(`\\dfrac{1}{${Rt}}=\\dfrac{1}{${R1}}+\\dfrac{1}{${R2}}`,870,250,{size:42}),1,C.faint);
  s+=fade(seg(p,.3,.45),label('なぜ？ → 深く学ぶ版で',600,410,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
};
