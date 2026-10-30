// 高校編「熱と温度・深く学ぶ 2/2」(ys-hs-t-heat-2) — 図。Stage 1200×515.
// 色：温度 T・ΔT 黄緑、熱 Q 橙、強調 黄。1/2 の部品（分子の箱・温度計・ビーカー）を使う。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,axes,clamp,mix} from './anim.mjs';
import {card,tag,T2,FA,TC,QC,Tt,Qt,DT,HOT,COLD,WATER,sceneT,molBox,thermo,beaker,steam,ice} from './yt1-hs-t-heat-1-diagrams.mjs';
export {card,tag,T2,FA,TC,QC,Tt,Qt,DT,HOT,COLD,WATER,sceneT,molBox,thermo,beaker,steam,ice};

const K='hs-t-heat-2:';
export const ironBlock=(x,gy,{w=200,h=100,text='鉄',g=1}={})=>fade(g,rect(x-w/2,gy-h,w,h,{fill:'#8c97ad',fo:.9,stroke:'#d5dbe6',sw:2,rx:6})+(text?label(text,x,gy+36,{size:26,color:C.ink,anchor:'middle',weight:700}):''));
export const heatUp=(x,y,{g=1,text=''}={})=>fade(g,FA(x,y+80,x,y,{color:QC,w:8,head:22})+(text?label(text,x+16,y+50,{size:26,color:QC,weight:700}):''));
export const QF=`${Qt}=mc${DT}`;
// equation step: previous line (small, dim) + operation note + new line (big)
function step(p,prev,next,op,{size=48,col=C.hi}={}){
 let s=fade(.55,T2(prev,600,90,{size:34}));
 s+=fade(seg(p,.05,.2),label(op,600,175,{size:28,color:col,anchor:'middle',weight:700})+arrow(600,190,600,235,{color:col,w:4,head:14}));
 s+=card(150,260,900,140,T2(next,600,335,{size}),seg(p,.3,.5),col);
 return s;
}
const E0=`100\\times4.2\\times(353-${Tt})=200\\times4.2\\times(${Tt}-293)`;
const E1=`100(353-${Tt})=200(${Tt}-293)`;
const E2=`353-${Tt}=2(${Tt}-293)`;
const E3=`353-${Tt}=2${Tt}-586`;
const E4=`353=3${Tt}-586`;
const E5=`939=3${Tt}`;
const E6=`${Tt}=313\\ \\mathrm{K}`;
// number line for the balance (℃)
const NL={x0:200,k:12};const xC=c=>NL.x0+NL.k*(c-10);
function balance(p,{fx=40,w1=200,w2=100,g=1,showArms=0}={}){
 const y=360;let s='';
 const tq=w1*(fx-20)-w2*(80-fx),ang=-Math.max(-1,Math.min(1,tq/2500))*7;
 let b=line(xC(10),y,xC(90),y,{color:C.dim,w:6});
 const box=(c,wt,col)=>{const h=wt*.55;return rect(xC(c)-36,y-h-4,72,h,{fill:col,fo:.5,stroke:col,sw:2,rx:6})+label(String(wt),xC(c),y-h-14,{size:28,color:col,anchor:'middle',weight:700});};
 b+=box(20,w1,COLD)+box(80,w2,HOT);
 s+=`<g transform="rotate(${ang.toFixed(2)} ${xC(fx)} ${y})">${b}</g>`;
 s+=`<polygon points="${xC(fx)},${y+4} ${xC(fx)-22},${y+40} ${xC(fx)+22},${y+40}" fill="${C.hi}" fill-opacity=".85"/>`;
 for(const c of [20,40,50,80])s+=label(String(c),xC(c),y+66,{size:24,color:c===fx?C.hi:C.dim,anchor:'middle',weight:700});
 if(showArms){
  s+=fade(showArms,line(xC(20),y+86,xC(fx),y+86,{color:COLD,w:4})+label(`${fx-20}`,(xC(20)+xC(fx))/2,y+118,{size:26,color:COLD,anchor:'middle',weight:700}));
  s+=fade(showArms,line(xC(fx),y+86,xC(80),y+86,{color:HOT,w:4})+label(`${80-fx}`,(xC(fx)+xC(80))/2,y+118,{size:26,color:HOT,anchor:'middle',weight:700}));
 }
 return fade(g,s);
}
const iceAxes=()=>axes({x:150,y:430,w:560,h:330,xmax:10,ymax:60,ymin:-20,xlabel:'加えた 熱',ylabel:'温度 [℃]',yticks:[-20,0,20,40],grid:true,ycolor:TC,xcolor:QC});
const iceF=q=>q<2?-20+10*q:q<6?0:(q-6)*12;

export const hsTHeat2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=beaker(330,400,200,180,{water:WATER,fo:.35,text:'水'})+ironBlock(860,400);
  s+=heatUp(260,330,{g:seg(p,.1,.25)})+heatUp(790,330,{g:seg(p,.1,.25)})+fade(seg(p,.1,.25),label('同じ 熱',600,480,{size:30,color:QC,anchor:'middle',weight:700}));
  s+=thermo(450,120,350,40+30*seg(p,.35,.9))+thermo(1000,120,300,30+170*seg(p,.55,.95));
  s+=fade(seg(p,.45,.6),label('なかなか 上がらない',330,100,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),label('すぐ 熱く なる',860,100,{size:26,color:HOT,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=fade(.3,beaker(330,400,200,180,{water:WATER,fo:.35,text:'水'})+ironBlock(860,400));
  s+=card(250,110,700,200,label('温まり方の 違いを',600,180,{size:34,color:C.ink,anchor:'middle'})+label('どんな 数で 表す？',600,260,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'setup']:(p)=>{
  let s=beaker(330,380,200,170,{water:WATER,fo:.35,text:'水 100 g'})+ironBlock(860,380,{text:'鉄 100 g'});
  s+=heatUp(250,300,{g:seg(p,.4,.55)})+heatUp(780,280,{g:seg(p,.4,.55)});
  s+=fade(seg(p,.4,.55),label('4200 J',230,350,{size:28,color:QC,anchor:'end',weight:700})+label('4200 J',760,330,{size:28,color:QC,anchor:'end',weight:700}));
  return s;
 },
 [K+'guess']:(p)=>{
  let s=beaker(330,380,200,170,{water:WATER,fo:.35,text:'水 100 g'})+ironBlock(860,380,{text:'鉄 100 g'});
  s+=heatUp(250,300)+heatUp(780,280)+label('4200 J',230,350,{size:28,color:QC,anchor:'end',weight:700})+label('4200 J',760,330,{size:28,color:QC,anchor:'end',weight:700});
  s+=card(230,60,200,90,label('？ K',330,120,{size:40,color:TC,anchor:'middle',weight:700}),seg(p,.05,.2),TC);
  s+=card(760,60,200,90,label('？ K',860,120,{size:40,color:TC,anchor:'middle',weight:700}),seg(p,.1,.25),TC);
  return s;
 },
 // ================= S2 比熱と Q＝mcΔT =================
 [K+'c']:(p)=>{
  let s=rect(200,250,90,90,{fill:WATER,fo:.5,stroke:'#9fd0ff',sw:2,rx:6})+label('1 g',245,305,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=heatUp(245,160,{g:seg(p,.3,.45)})+fade(seg(p,.3,.45),label('？ J',265,210,{size:28,color:QC,weight:700}));
  s+=thermo(380,180,330,60+40*seg(p,.35,.6))+fade(seg(p,.45,.6),label('＋1 K',420,230,{size:28,color:TC,weight:700}));
  s+=card(540,120,620,230,label('比熱',820,185,{size:34,color:C.ink,anchor:'middle',weight:700})+tex('c',890,180,{size:46})+label('1 g を 1 K 上げるのに',850,255,{size:30,color:C.ink,anchor:'middle',weight:700})+label('必要な 熱',850,310,{size:32,color:QC,anchor:'middle',weight:700}),seg(p,.6,.8),C.hi);
  return s;
 },
 [K+'cw']:(p)=>{
  let s=card(200,60,800,190,label('比熱',330,135,{size:34,color:C.ink,anchor:'middle',weight:700})+tex('c',395,130,{size:46})+label('1 g を 1 K 上げるのに 必要な 熱',720,135,{size:28,color:C.ink,anchor:'middle'})+tag('定義',600,210,{color:C.hi,g:seg(p,.05,.2)}),1,C.hi);
  s+=card(250,290,700,150,label('水：',380,380,{size:34,color:C.ink,anchor:'middle',weight:700})+T2('c=4.2\\ \\mathrm{J/(g\\cdot K)}',650,365,{size:46,auto:false}),seg(p,.4,.55),WATER);
  return s;
 },
 [K+'m']:(p)=>{
  let s='';const n=Math.round(100*seg(p,.15,.55));
  for(let i=0;i<100;i++){const r=Math.floor(i/10),c=i%10;s+=rect(140+c*34,90+r*34,30,30,{fill:WATER,fo:i<n?.6:.12,stroke:'#9fd0ff',sw:1,rx:4});}
  s+=label('水 100 g',310,470,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=card(600,90,540,120,label('1 g ごとに 4.2 J',870,165,{size:34,color:QC,anchor:'middle',weight:700}),seg(p,.05,.2),QC);
  s+=card(600,250,540,140,T2('4.2\\times100=420\\ \\mathrm{J}',870,320,{size:42,auto:false}),seg(p,.6,.75),QC);
  s+=fade(seg(p,.6,.75),label('（1 K 上げる 熱）',870,430,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'dt']:(p)=>{
  let s='';const n=Math.round(10*seg(p,.1,.6));
  for(let i=0;i<10;i++)s+=rect(150,440-(i+1)*36,300,32,{fill:QC,fo:i<n?.55:.08,stroke:QC,sw:1.5,rx:4})+(i<n?label('420 J',300,440-(i+1)*36+24,{size:22,color:C.ink,anchor:'middle'}):'');
  s+=label('1 K ごとに 420 J',300,475,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=thermo(560,90,400,30+26*n);
  s+=fade(seg(p,.5,.65),label('＋10 K',600,180,{size:30,color:TC,weight:700}));
  s+=card(720,170,440,140,T2('420\\times10=4200\\ \\mathrm{J}',940,240,{size:40,auto:false}),seg(p,.65,.8),QC);
  return s;
 },
 [K+'qmc']:(p)=>{
  let s=card(250,60,700,170,T2(QF,600,150,{size:72}),seg(p,.55,.7),QC);
  s+=fade(seg(p,.05,.2),label('質量 m',300,320,{size:30,color:C.ink,anchor:'middle',weight:700})+label('g',300,365,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.15,.3),label('比熱 c',600,320,{size:30,color:C.ink,anchor:'middle',weight:700})+label('J/(g·K)',600,365,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),label('温度の 変化 ΔT',900,320,{size:30,color:TC,anchor:'middle',weight:700})+label('K',900,365,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('c を m 倍 → さらに ΔT 倍',600,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'qmc2']:(p)=>{
  let s=card(250,60,700,170,T2(QF,600,150,{size:72}),1,QC);
  s+=fade(seg(p,.05,.2),label('比熱の 定義（1 g・1 K）',600,300,{size:30,color:C.ink,anchor:'middle',weight:700})+label('× m 倍 × ΔT 倍',600,350,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=tag('導いた 結果',600,440,{color:C.hi,g:seg(p,.55,.7)});
  return s;
 },
 [K+'fe']:(p)=>{
  let s=label('比熱',600,60,{size:30,color:C.ink,anchor:'middle',weight:700});
  const k=70,u=seg(p,.05,.3);
  s+=rect(330,440-4.2*k*u,140,4.2*k*u,{fill:WATER,fo:.55,stroke:'#9fd0ff',sw:2,rx:6})+label('水 4.2',400,480,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),rect(730,440-.45*k,140,.45*k,{fill:'#8c97ad',fo:.9,stroke:'#d5dbe6',sw:2,rx:6})+label('鉄 0.45',800,480,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('J/(g·K)',1080,480,{size:24,color:C.dim,anchor:'middle'})+label('（代表値）',800,380,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(680,170,380,110,label('水の 約 1/9',870,240,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'solve']:(p)=>{
  let s=T2(QF,600,110,{size:56});
  s+=fade(seg(p,.1,.25),label('両辺を mc で 割る',600,200,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(600,215,600,260,{color:C.hi,w:4,head:14}));
  s+=card(300,290,600,150,T2(`${DT}=${Qt}\\div(mc)`,600,370,{size:56}),seg(p,.55,.7),TC);
  return s;
 },
 [K+'w10']:(p)=>{
  let s=beaker(200,440,170,150,{water:WATER,fo:.35,text:'水 100 g'})+thermo(320,170,400,40+100*seg(p,.6,.9));
  s+=card(450,80,700,230,T2(`${DT}=4200\\div(100\\times4.2)`,800,150,{size:40})+fade(seg(p,.35,.5),T2('=4200\\div420',800,220,{size:40,auto:false}))+fade(seg(p,.55,.7),T2('=10\\ \\mathrm{K}',800,285,{size:44,auto:false,color:TC})),seg(p,.05,.2),TC);
  s+=fade(seg(p,.75,.9),label('＋10 K',300,150,{size:30,color:TC,anchor:'end',weight:700}));
  return s;
 },
 [K+'f93']:(p)=>{
  let s=ironBlock(200,440,{w:180,h:90,text:'鉄 100 g'})+thermo(340,100,400,40+260*seg(p,.6,.9));
  s+=card(450,80,700,230,T2(`${DT}=4200\\div(100\\times0.45)`,800,150,{size:40})+fade(seg(p,.35,.5),T2('=4200\\div45',800,220,{size:40,auto:false}))+fade(seg(p,.55,.7),T2('\\approx 93\\ \\mathrm{K}',800,285,{size:44,auto:false,color:TC})),seg(p,.05,.2),TC);
  s+=fade(seg(p,.75,.9),label('約 93 K も 上がる',800,380,{size:30,color:HOT,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ansc']:(p)=>{
  let s=beaker(250,400,170,150,{water:WATER,fo:.35,text:'水 c ＝ 4.2'})+thermo(370,250,370,40)+label('＋10 K',410,300,{size:28,color:TC,weight:700});
  s+=ironBlock(760,400,{w:180,h:90,text:'鉄 c ＝ 0.45'})+thermo(900,150,370,200)+label('＋93 K',940,200,{size:28,color:TC,weight:700});
  s+=card(250,40,700,90,label('c が 小さい ほど 温度が 大きく 変わる',600,98,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.6,.75),label('違いを 表す 数 ＝ 比熱 c',600,500,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 ΔT と単位 =================
 [K+'diff']:(p)=>{
  const y=c=>440-(c-15)*16;
  let s=thermo(250,y(40),y(15),y(15)-y(20+15*seg(p,.1,.5)));
  for(const c of [20,35])s+=line(262,y(c),290,y(c),{color:C.ink,w:2.5})+label(`${c}℃`,300,y(c)+8,{size:26,color:C.ink,weight:700});
  s+=fade(seg(p,.4,.55),arrow(410,y(20),410,y(35),{color:TC,w:5,head:16})+label('15 目盛り',430,(y(20)+y(35))/2+8,{size:28,color:TC,weight:700}));
  s+=card(620,140,520,170,T2(`${DT}=35-20=15\\ \\mathrm{K}`,880,225,{size:44}),seg(p,.55,.7),TC);
  s+=fade(seg(p,.05,.2),label('温度の 差',880,110,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(200,50,800,100,T2(`${DT}=35`,440,100,{size:44})+label('✕ 最後の 温度',780,112,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(200,175,800,100,T2(`${DT}=308`,440,225,{size:44})+label('✕ 最後の 温度（K）',780,237,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.15,.3),C.a);
  s+=card(200,300,800,100,T2(`${DT}=15`,440,350,{size:44})+label('○ 何 目盛り 上げたか',780,362,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.6,.75),C.F);
  return s;
 },
 [K+'diffK']:(p)=>{
  let s=card(200,80,800,120,T2('35-20=15',600,140,{size:46,auto:false})+label('℃',880,150,{size:30,color:C.dim}),1);
  s+=card(200,240,800,120,T2('308-293=15',600,300,{size:46,auto:false,color:TC})+label('K',900,310,{size:30,color:C.dim}),seg(p,.05,.25),TC);
  s+=fade(seg(p,.55,.7),label('差 なので 同じ 数',600,430,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'kg']:(p)=>{
  let s=card(150,80,900,120,T2('c=4.2\\ \\mathrm{J/(g\\cdot K)}',600,140,{size:46,auto:false}),1,WATER);
  s+=fade(seg(p,.2,.35),label('1 kg ＝ 1000 g → 1000 倍',600,260,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(150,300,900,120,T2('c=4200\\ \\mathrm{J/(kg\\cdot K)}',600,360,{size:46,auto:false}),seg(p,.4,.55),WATER);
  return s;
 },
 [K+'kg2']:(p)=>{
  let s=card(100,70,1000,120,T2('0.10\\ \\mathrm{kg}\\times4200\\times10=4200\\ \\mathrm{J}',620,130,{size:42,auto:false})+label('○',150,142,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  s+=card(100,250,1000,120,T2('100\\ \\mathrm{g}\\times4200\\times10=4200000\\ \\mathrm{J}',620,310,{size:42,auto:false})+label('✕',150,322,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  s+=fade(seg(p,.7,.85),label('g と kg を 混ぜると 1000 倍 ずれる',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 混ぜたあとの温度 =================
 [K+'mix']:(p)=>{
  const u=seg(p,.45,.75);
  let s=fade(1-u*.7,beaker(220,330,150,140,{water:HOT,fo:.3,text:'80℃・100 g'})+beaker(520,330,170,170,{water:COLD,fo:.35,text:'20℃・200 g'}));
  s+=fade(u,beaker(900,440,240,220,{water:'#b98fb8',fo:.3,text:''})+arrow(640,260,760,300,{color:C.dim,w:4,head:14}));
  s+=fade(seg(p,.75,.9),label('？℃',900,330,{size:46,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'guess50']:(p)=>{
  let s=line(xC(10),300,xC(90),300,{color:C.dim,w:4});
  for(const c of [20,50,80])s+=line(xC(c),290,xC(c),310,{color:C.dim,w:2})+label(`${c}℃`,xC(c),346,{size:26,color:c===50?C.hi:C.ink,anchor:'middle',weight:700});
  s+=label('100 g',xC(80),250,{size:26,color:HOT,anchor:'middle',weight:700})+label('200 g',xC(20),250,{size:26,color:COLD,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),label('真ん中？',xC(50),240,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('式で 確かめる',600,450,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eq']:(p)=>{
  const u=seg(p,.1,.7);
  let s=rect(150,150,300,220,{fill:HOT,fo:.25,stroke:HOT,sw:2,rx:10})+rect(450,150,600,220,{fill:COLD,fo:.25,stroke:COLD,sw:2,rx:10});
  s+=label('熱い 水',300,130,{size:28,color:HOT,anchor:'middle',weight:700})+label('冷たい 水',750,130,{size:28,color:COLD,anchor:'middle',weight:700});
  s+=thermo(300,190,330,mix(130,70,u))+thermo(750,190,330,mix(25,70,u));
  s+=FA(380,420,620,420,{color:QC,w:8,head:22,g:seg(p,.1,.3)});
  s+=fade(seg(p,.7,.85),line(260,260,790,260,{color:C.hi,w:2,dash:'6 6'})+label('同じ 温度',920,268,{size:28,color:C.hi,weight:700}));
  s+=tag('熱平衡',600,490,{color:C.hi,g:seg(p,.8,.95)});
  return s;
 },
 [K+'cons']:(p)=>{
  let s=rect(120,180,280,160,{fill:HOT,fo:.25,stroke:HOT,sw:2,rx:10})+label('高温側',260,270,{size:30,color:HOT,anchor:'middle',weight:700});
  s+=rect(800,180,280,160,{fill:COLD,fo:.25,stroke:COLD,sw:2,rx:10})+label('低温側',940,270,{size:30,color:COLD,anchor:'middle',weight:700});
  s+=FA(420,260,780,260,{color:QC,w:10,head:28,g:seg(p,.05,.3)});
  s+=fade(seg(p,.05,.2),rect(80,150,1040,220,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:16})+label('外へ 逃げない',1100,140,{size:24,color:C.dim,anchor:'end'}));
  s+=card(280,40,640,80,label('失った 熱 ＝ 得た 熱',600,95,{size:36,color:QC,anchor:'middle',weight:700}),seg(p,.3,.45),QC);
  s+=tag('仮定',260,430,{color:C.dim,g:seg(p,.05,.2)})+tag('法則（エネルギー 保存）',760,430,{color:C.F,g:seg(p,.65,.8)});
  return s;
 },
 [K+'setT']:(p)=>{
  let s=card(150,60,900,110,label('最後の 温度 ＝',470,130,{size:34,color:C.ink,anchor:'middle',weight:700})+T2(Tt,640,118,{size:52})+label('（K）',680,130,{size:30,color:TC,weight:700}),seg(p,.05,.2),TC);
  s+=card(150,210,420,110,T2('80+273=353\\ \\mathrm{K}',360,265,{size:38,auto:false,color:HOT}),seg(p,.4,.55),HOT);
  s+=card(630,210,420,110,T2('20+273=293\\ \\mathrm{K}',840,265,{size:38,auto:false,color:COLD}),seg(p,.6,.75),COLD);
  s+=fade(seg(p,.25,.4),label('T は 絶対温度の 文字なので、K で 置く',600,410,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'widths']:(p)=>{
  const X=k=>200+(k-283)*10,y=230;
  let s=line(X(285),y,X(361),y,{color:C.dim,w:4});
  for(const [k,l,c] of [[293,'293',COLD],[313,'T',TC],[353,'353',HOT]])s+=line(X(k),y-12,X(k),y+12,{color:c,w:3})+label(l,X(k),y+48,{size:28,color:c,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),arrow(X(353),y-40,X(313),y-40,{color:HOT,w:5,head:16})+label('下がり幅',X(333),y-80,{size:26,color:HOT,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),arrow(X(293),y-40,X(313),y-40,{color:COLD,w:5,head:16})+label('上がり幅',X(298),y-80,{size:26,color:COLD,anchor:'middle',weight:700}));
  s+=card(150,330,420,110,T2(`353-${Tt}`,360,385,{size:46}),seg(p,.1,.25),HOT);
  s+=card(630,330,420,110,T2(`${Tt}-293`,840,385,{size:46}),seg(p,.4,.55),COLD);
  s+=fade(seg(p,.7,.85),label('どちらも 正の 量',600,490,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(.6,label('K',X(361)+30,y+8,{size:24,color:C.dim}));
  return s;
 },
 [K+'eqn']:(p)=>{
  let s=card(60,140,1080,150,T2(E0,600,215,{size:40}),seg(p,.3,.5),QC);
  s+=fade(seg(p,.05,.2),label('高温側が 失った 熱',330,110,{size:28,color:HOT,anchor:'middle',weight:700})+label('低温側が 得た 熱',870,110,{size:28,color:COLD,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),label('m ＝ 100、c ＝ 4.2、ΔT ＝ 353 − T',330,350,{size:24,color:C.dim,anchor:'middle'})+label('m ＝ 200、c ＝ 4.2、ΔT ＝ T − 293',870,350,{size:24,color:C.dim,anchor:'middle'}));
  s+=tag('失った 熱 ＝ 得た 熱',600,440,{color:QC,g:seg(p,.55,.7)});
  return s;
 },
 [K+'s1']:(p)=>step(p,E0,E1,'両辺 ÷ 4.2'),
 [K+'s2']:(p)=>step(p,E1,E2,'両辺 ÷ 100'),
 [K+'s3']:(p)=>step(p,E2,E3,'かっこを 外す：2 × 293 ＝ 586'),
 [K+'s4']:(p)=>step(p,E3,E4,'両辺 ＋ T'),
 [K+'s5']:(p)=>step(p,E4,E5,'両辺 ＋ 586'),
 [K+'s6']:(p)=>{
  let s=step(p,E5,E6,'両辺 ÷ 3',{col:TC});
  s+=card(330,420,540,80,T2('313-273=40',540,460,{size:36,auto:false})+label('℃',672,470,{size:32,color:C.hi,weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'chk']:(p)=>card(150,90,900,130,label('熱い 水：失った 熱',600,135,{size:28,color:HOT,anchor:'middle',weight:700})+T2('100\\times4.2\\times(80-40)=16800\\ \\mathrm{J}',600,190,{size:38,auto:false}),seg(p,.1,.3),HOT),
 [K+'chk2']:(p)=>{
  let s=card(150,90,900,130,label('熱い 水：失った 熱',600,135,{size:28,color:HOT,anchor:'middle',weight:700})+T2('100\\times4.2\\times(80-40)=16800\\ \\mathrm{J}',600,190,{size:38,auto:false}),1,HOT);
  s+=card(150,250,900,130,label('冷たい 水：得た 熱',600,295,{size:28,color:COLD,anchor:'middle',weight:700})+T2('200\\times4.2\\times(40-20)=16800\\ \\mathrm{J}',600,350,{size:38,auto:false}),seg(p,.05,.25),COLD);
  s+=fade(seg(p,.6,.75),label('一致 ✓',600,450,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bal']:(p)=>{
  let s=balance(p,{fx:50});
  s+=fade(seg(p,.05,.2),label('天びんで 考える（目盛りは ℃）',600,70,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('おもりの 重さ ＝ g の 数',600,130,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'bal2']:(p)=>{
  const fx=Math.round(mix(50,40,seg(p,.05,.3)));
  let s=balance(p,{fx,showArms:seg(p,.3,.45)});
  s+=card(700,30,420,80,T2('200\\times20=100\\times40',910,70,{size:34,auto:false}),seg(p,.4,.55),C.hi);
  s+=fade(seg(p,.6,.75),label('重さ ↔ mc',300,60,{size:30,color:C.hi,anchor:'middle',weight:700})+label('（今は c が 同じ）',300,100,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.8,.95),label('mc が 大きい 側へ 寄る',600,170,{size:28,color:COLD,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bal3']:(p)=>{
  let s=balance(p,{fx:50,w1:150,w2:150,showArms:1});
  s+=card(700,30,420,100,label('mc が 等しい ときだけ',910,75,{size:28,color:C.ink,anchor:'middle',weight:700})+label('真ん中 50℃',910,115,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.3),C.hi);
  return s;
 },
 // ================= S5 現象に戻る =================
 [K+'sea']:(p)=>{
  let s=rect(80,330,520,120,{fill:WATER,fo:.45,stroke:'none',rx:0})+rect(600,300,520,150,{fill:'#8a6a48',fo:.6,stroke:'none',rx:0});
  s+=label('海（水）',340,400,{size:30,color:C.ink,anchor:'middle',weight:700})+label('陸',860,385,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),label('c が 大きい → 温度が 変わりにくい',340,495,{size:24,color:C.hi,anchor:'middle',weight:700}));
  const sw=Math.sin(2*Math.PI*p*1.5);
  s+=thermo(340,90,300,105+15*sw)+thermo(860,90,270,100+70*sw);
  s+=fade(seg(p,.4,.55),label('昼と 夜の 差：小',380,150,{size:26,color:TC,weight:700})+label('差：大',900,150,{size:26,color:HOT,weight:700}));
  s+=fade(seg(p,.6,.75),label('海辺の 町は 気温差が 小さい',860,495,{size:24,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'ice']:(p)=>{
  const A=iceAxes();let s=A.svg;
  s+=A.plot(iceF,{from:0,to:9.5,p:seg(p,.05,.7),color:TC,w:4,steps:120});
  s+=fade(seg(p,.3,.45),rect(A.X(2),A.Y(8),A.X(6)-A.X(2),A.Y(-8)-A.Y(8),{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:6})+label('融けている 間',A.X(4),A.Y(14),{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('0℃ の まま',A.X(4),A.Y(-14),{size:24,color:C.ink,anchor:'middle'}));
  s+=card(870,140,300,170,label('熱は',1020,195,{size:28,color:QC,anchor:'middle',weight:700})+label('氷 → 水 に',1020,245,{size:28,color:C.ink,anchor:'middle',weight:700})+label('変えるのに 使われる',1020,290,{size:24,color:C.ink,anchor:'middle'}),seg(p,.65,.8),QC);
  return s;
 },
 [K+'ice2']:(p)=>{
  const A=iceAxes();let s=A.svg;
  s+=A.plot(iceF,{from:0,to:9.5,color:TC,w:4,steps:120});
  s+=rect(A.X(2),A.Y(8),A.X(6)-A.X(2),A.Y(-8)-A.Y(8),{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:6});
  s+=card(870,90,300,150,T2(QF,1020,140,{size:34})+label('だけでは 表せない',1020,205,{size:26,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(870,280,300,150,label('容器が 吸う 熱',1020,335,{size:26,color:QC,anchor:'middle',weight:700})+label('外へ 逃げる 熱',1020,385,{size:26,color:QC,anchor:'middle',weight:700}),seg(p,.55,.7),QC);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(250,70,700,120,label('温まり方の 違い ＝ 比熱',560,145,{size:36,color:C.ink,anchor:'middle',weight:700})+tex('c',800,140,{size:50}),seg(p,.05,.2),C.hi);
  s+=card(250,240,700,150,T2(QF,600,315,{size:64}),seg(p,.5,.65),QC);
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:300,y:70,w:600,h:380,n:22,dist:300*t,speed:300,seed:61,color:'#9fd0ff',frame:false,r:8});
  s+=rect(300,70,600,380,{fill:'none',fo:0,stroke:C.ink,sw:6,rx:4});
  for(let i=0;i<6;i++){const ph=(t*1.3+i*.37)%1;if(ph<.25){const side=i%4,o=1-ph/.25;const pos=[[300,120+i*50],[900,100+i*55],[340+i*90,70],[360+i*85,450]][side];s+=fade(o,dot(pos[0],pos[1],14,C.hi));}}
  s+=fade(seg(p,.35,.5),label('気体',600,40,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('壁を 叩く',1040,260,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.3,rect(300,70,600,380,{fill:'none',fo:0,stroke:C.ink,sw:6,rx:4}));
  s+=card(250,140,700,200,label('壁を 叩く 力は',600,210,{size:34,color:C.ink,anchor:'middle'})+label('何で 決まる？',600,290,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(300,150,600,170,label('次の 単元',600,215,{size:34,color:C.ink,anchor:'middle',weight:700})+label('気体の 法則 へ',600,280,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
