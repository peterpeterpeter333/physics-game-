// 高校編「電場とクーロンの法則・要点」(ys-hs-e-field-summary) — 図。Stage 1200×515.
// 色：電場 𝐄 水色、電位 V 紫、力 F 緑、電荷 q 桃、位置エネルギー U 橙、正電荷 赤、負電荷・電子 青。深く学ぶ版の部品を読み込む。
import {C,seg,fade,label,line,rect,ring,arrow,axes,mix} from './anim.mjs';
import {card,tag,fcard,circuit,POS,NEG,FA,EC,VC,QC,FC,UC,HI,cs,Ft,Et,vF,vE,qt,Vt,Ut,U,TX,COUL,chg,dist,pair} from './yt1-hs-e-field-1-diagrams.mjs';
import {EA,EDEF,fieldMap} from './yt1-hs-e-field-2-diagrams.mjs';
import {VDEF,uniField} from './yt1-hs-e-field-3-diagrams.mjs';

const K='hs-e-field-summary:';
const big=(t,x,y,{size=34,color=C.ink,g=1}={})=>fade(g,label(t,x,y,{size,color,anchor:'middle',weight:700}));
const small=(x,y,{sign=1,g=1}={})=>chg(x,y,{sign,r:14,g});
export const hsEFieldSummaryDiagrams={
 [K+'coul']:(p)=>{
  let s=pair(300,620,130,{len:90,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),TX(cs(QC,'q_1'),300,82,{size:36})+TX(cs(QC,'q_2'),620,82,{size:36}));
  s+=dist(300,620,190,{src:'r',color:HI,g:seg(p,.05,.2)});
  s+=fcard(300,280,600,200,COUL(HI),{size:62,col:FC,g:seg(p,.35,.5)});
  s+=card(880,60,280,150,label('距離 2倍',1020,115,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 力 1/4',1020,170,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,.7,.85),HI);
  return s;
 },
 [K+'coul2']:(p)=>{
  let s=fcard(300,30,600,180,COUL(),{size:56,col:FC});
  s+=tag('法則：実験で 確かめた',600,260,{g:seg(p,.05,.2),size:28});
  s+=pair(200,420,360,{s1:1,s2:1,kind:'rep',len:70,g:seg(p,.45,.6)})+big('同じ 符号 → 反発',310,460,{size:28,color:FC,g:seg(p,.45,.6)});
  s+=pair(780,1000,360,{s1:1,s2:-1,kind:'att',len:70,g:seg(p,.65,.8)})+big('違う 符号 → 引力',890,460,{size:28,color:HI,g:seg(p,.65,.8)});
  return s;
 },
 [K+'field']:(p)=>{
  let s=fieldMap(300,255,{p:seg(p,.05,.4),rings:[[85,8],[130,12],[185,16]]});
  s+=fcard(640,90,480,200,EDEF,{size:62,col:EC,g:seg(p,.3,.45)});
  s+=card(700,330,360,110,TX(`\\mathrm{N/C}`,880,395,{size:46,color:EC}),seg(p,.65,.8),EC);
  return s;
 },
 [K+'pot']:(p)=>{
  let s=fcard(80,60,480,200,VDEF,{size:62,col:VC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.1,.25),label('1 C あたりの 位置エネルギー',320,310,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fcard(640,60,480,200,`${Vt}=${Et}d`,{size:62,col:VC,g:seg(p,.55,.7)});
  s+=fade(seg(p,.6,.75),label('一様な 電場・大きさ',880,310,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  let s='';[[110,1],[250,2],[390,3]].forEach(([y,k],i)=>{
   s+=chg(180,y,{r:22})+TX(cs(QC,'Q'),180,y-36,{size:30})+line(212,y,580,y,{color:C.faint,w:2,dash:'6 8'})+small(600,y)+TX(k===1?qt:`${k}${qt}`,600,y-30,{size:30});
   const g=seg(p,.35+i*.12,.47+i*.12);s+=FA(620,y,620+80*k,y,{w:8,head:20,g})+fade(g,label(k===1?'F':`${k}F`,630+80*k,y+10,{size:26,color:FC,weight:700}));});
  s+=card(930,170,240,130,TX(`${Ft}\\propto ${qt}`,1050,250,{size:44}),seg(p,.7,.85),FC);
  return s;
 },
 [K+'why2']:(p)=>{
  const u=seg(p,.3,.5);let s='';
  [[110,1],[250,2],[390,3]].forEach(([y,k])=>{
   s+=chg(180,y,{r:22})+TX(cs(QC,'Q'),180,y-36,{size:30})+line(212,y,580,y,{color:C.faint,w:2,dash:'6 8'})+small(600,y)+TX(k===1?qt:`${k}${qt}`,600,y-30,{size:30});
   s+=fade(1-u,FA(620,y,620+80*k,y,{w:8,head:20}))+fade(u,EA(620,y,700,y,{w:7,head:20}));});
  s+=card(900,150,270,190,label('÷ 電荷',1035,210,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ どれも 同じ',1035,265,{size:28,color:EC,anchor:'middle',weight:700})+TX(vE,1035,320,{size:40}),seg(p,.4,.55),EC);
  s+=fade(seg(p,.7,.85),label('場所 だけで 決まる 地図',1035,410,{size:26,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why3']:(p)=>{
  let s=uniField();
  const u=seg(p,.1,.45),x=mix(230,610,u);
  s+=ring(230,170,8,{color:HI,w:3})+ring(610,170,8,{color:HI,w:3})+chg(x,170,{r:20})+dist(230,610,400,{src:'d',color:HI});
  s+=FA(x+24,170,x+110,170,{g:seg(p,.05,.2),w:8,head:20});
  s+=card(820,90,350,320,label('電場の 仕事',995,145,{size:26,color:UC,anchor:'middle',weight:700})+TX(`${qt}${Et}d`,995,200,{size:42})
   +fade(seg(p,.4,.55),label('位置エネルギー が 減る',995,265,{size:24,color:UC,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),TX(`${Vt}=${Et}d`,995,350,{size:48})),seg(p,.15,.3),VC);
  return s;
 },
 [K+'n1']:(p)=>{
  let s=pair(240,440,120,{len:160})+dist(240,440,180,{text:'0.10 m',color:HI})+label('0.90 N',120,165,{size:28,color:FC,anchor:'middle',weight:700});
  s+=label('1.0 μC',240,80,{size:24,color:QC,anchor:'middle',weight:700})+label('1.0 μC',440,80,{size:24,color:QC,anchor:'middle',weight:700});
  s+=pair(240,640,330,{len:40,ga:seg(p,.45,.6),g:seg(p,.4,.55)})+dist(240,640,390,{text:'0.20 m',color:HI,g:seg(p,.4,.55)});
  s+=fade(seg(p,.55,.7),label('0.225 N',150,295,{size:28,color:FC,anchor:'middle',weight:700}));
  s+=card(840,170,300,180,label('距離 2倍',990,235,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 1/4',990,300,{size:40,color:HI,anchor:'middle',weight:700}),seg(p,.65,.8),HI);
  return s;
 },
 [K+'n2']:(p)=>{
  let s=chg(250,90,{r:24})+label('2.0 μC',250,45,{size:26,color:QC,anchor:'middle',weight:700})+ring(830,90,9,{color:HI,w:3})+dist(250,830,140,{color:HI});
  s+=label('0.30 m',540,180,{size:26,color:HI,anchor:'middle',weight:700});
  s+=card(80,210,1040,150,TX(`${Et}=9.0\\times10^{9}\\times\\dfrac{2.0\\times10^{-6}}{0.30^2}`,600,295,{size:48}),seg(p,.05,.2),EC);
  s+=card(330,390,540,100,TX(`=2.0\\times10^{5}${U('N/C')}`,600,450,{size:46,color:EC}),seg(p,.55,.7),EC);
  return s;
 },
 [K+'n3']:(p)=>{
  let s=uniField();
  s+=ring(250,170,8,{color:HI,w:3})+ring(570,170,8,{color:HI,w:3})+dist(250,570,400,{text:'0.20 m',color:HI});
  s+=TX(`${Et}=100${U('V/m')}`,970,110,{size:36});
  s+=card(760,170,420,200,TX(`${Vt}=100\\times0.20`,970,240,{size:40})+fade(seg(p,.45,.6),TX(`=20${U('V')}`,970,320,{size:48,color:VC})),seg(p,.2,.35),VC);
  s+=fade(seg(p,.65,.8),label('20 V 下がる',970,430,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n4']:(p)=>{
  let s=card(200,60,800,130,TX(`\\mathrm{V/m}=\\mathrm{N/C}`,600,140,{size:56,color:EC}),1,EC);
  s+=card(120,250,440,150,label('力の 地図',340,315,{size:32,color:FC,anchor:'middle',weight:700})+label('1 C あたりの 力',340,365,{size:26,color:C.ink,anchor:'middle'}),seg(p,.3,.45),FC);
  s+=card(640,250,440,150,label('電位の 坂の 傾き',860,315,{size:32,color:VC,anchor:'middle',weight:700})+label('1 m あたりの 電位差',860,365,{size:26,color:C.ink,anchor:'middle'}),seg(p,.55,.7),VC);
  return s;
 },
 [K+'err']:(p)=>{
  let s=EA(300,180,900,180,{w:8,head:24})+TX(vE,940,195,{size:44});
  s+=small(600,320,{sign:-1})+label('負の 電荷',600,380,{size:28,color:NEG,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.35),arrow(620,290,760,290,{color:C.a,w:5,head:16})+label('✕ 𝐄 の 向き？',700,260,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'err2']:(p)=>{
  let s=EA(300,180,900,180,{w:8,head:24})+TX(vE,940,195,{size:44});
  s+=small(600,320,{sign:-1})+label('負の 電荷',600,380,{size:28,color:NEG,anchor:'middle',weight:700});
  s+=FA(580,320,380,320,{g:seg(p,.2,.4),w:10,head:26})+fade(seg(p,.3,.45),TX(vF,350,300,{size:44}));
  s+=card(760,280,380,130,TX(`${vF}=${qt}${vE}`,950,330,{size:40})+label('q＜0 → 逆向き',950,390,{size:26,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  return s;
 },
 [K+'err3']:(p)=>{
  let s=EA(300,160,600,160,{w:8,head:24})+TX(`${Et}=2.0\\times10^{5}${U('N/C')}`,800,170,{size:36});
  s+=small(450,280,{sign:-1})+label('電子',450,330,{size:26,color:NEG,anchor:'middle',weight:700});
  s+=FA(430,280,300,280,{g:seg(p,.3,.45),w:9,head:22});
  s+=card(150,370,900,120,TX(`|${Ft}|=1.6\\times10^{-19}\\times2.0\\times10^{5}=3.2\\times10^{-14}${U('N')}`,600,440,{size:40}),seg(p,.4,.55),FC);
  return s;
 },
 [K+'err4']:(p)=>{
  let s=pair(240,440,140,{len:160})+dist(240,440,200,{src:'r',color:HI});
  s+=pair(240,640,350,{len:40})+dist(240,640,410,{src:'2r',color:HI});
  s+=card(820,90,320,150,label('✕ 1/2',980,180,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.25),C.a);
  s+=card(820,280,320,170,TX(`\\dfrac{1}{(2r)^2}=\\dfrac{1}{4r^2}`,980,360,{size:40,color:HI}),seg(p,.5,.65),HI);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=card(80,90,480,280,label('電場',320,160,{size:36,color:EC,anchor:'middle',weight:700})+TX(EDEF,320,250,{size:52})+label('1 C あたりの 力',320,335,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),EC);
  s+=card(640,90,480,280,label('電位',880,160,{size:36,color:VC,anchor:'middle',weight:700})+TX(VDEF,880,250,{size:52})+label('1 C あたりの 位置エネルギー',880,335,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55),VC);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=circuit({on:1,cur:1});
  s+=card(850,140,310,230,label('電圧',1005,200,{size:32,color:VC,anchor:'middle',weight:700})+label('＝',1005,255,{size:30,color:C.ink,anchor:'middle'})+label('電位の 差',1005,315,{size:34,color:VC,anchor:'middle',weight:700}),seg(p,.2,.35),VC);
  return s;
 },
 [K+'bye']:(p)=>fade(.35,fieldMap(600,255,{rings:[[85,8],[130,12],[185,16]]}))+card(300,170,600,140,label('なぜ？ → 深く学ぶ版で',600,255,{size:40,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI),
};
