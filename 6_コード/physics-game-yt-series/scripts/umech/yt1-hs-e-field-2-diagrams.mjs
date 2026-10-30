// 高校編「電場とクーロンの法則・深く学ぶ 2/3」(ys-hs-e-field-2) — 図。Stage 1200×515.
// 色：電場 𝐄 水色、力 𝐅 緑、電荷 Q・q 桃、正電荷 赤、負電荷・電子 青、磁場 𝐁 橙、距離 r 白（強調は黄）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card,tag,fcard,circuit,POS,NEG,FA,EC,QC,FC,HI,RC,cs,Ft,vF,Et,vE,qt,Qt,U,TX,COUL,chg,dist,pair} from './yt1-hs-e-field-1-diagrams.mjs';

const K='hs-e-field-2:';
export const BC=C.E;
export const EA=(x,y,X,Y,o={})=>arrow(x,y,X,Y,{color:EC,w:6,head:18,...o});
export const EDEF=`${vE}=\\dfrac{${vF}}{${qt}}`;
// radial field map around a point charge at (cx,cy). len ∝ 1/r² (L0 at r0). p draws the arrows on.
export function fieldMap(cx,cy,{sign=1,g=1,p=1,rings=[[85,8],[125,12],[175,16]],L0=60,r0=85,rot=0,maxX=1200}={}){
 let s='';
 rings.forEach(([r,n],ri)=>{const L=L0*(r0/r)**2;
  for(let i=0;i<n;i++){const a=rot+Math.PI*2*(i+.5*(ri%2))/n,ux=Math.cos(a),uy=Math.sin(a);
   const x0=cx+ux*(r-L/2),y0=cy+uy*(r-L/2),x1=cx+ux*(r+L/2),y1=cy+uy*(r+L/2);
   if(Math.max(x0,x1)>maxX)continue;
   s+=sign>0?EA(x0,y0,x1,y1,{w:4,head:Math.min(14,L*.6),g:p}):EA(x1,y1,x0,y0,{w:4,head:Math.min(14,L*.6),g:p});}});
 return fade(g,chg(cx,cy,{sign,r:26})+s);
}
const big=(t,x,y,{size=34,color=C.ink,g=1}={})=>fade(g,label(t,x,y,{size,color,anchor:'middle',weight:700}));
const ptP=(x,y,{g=1,text='P'}={})=>fade(g,ring(x,y,9,{color:HI,w:3})+label(text,x+14,y-16,{size:28,color:HI,weight:700}));
const small=(x,y,{sign=1,g=1}={})=>chg(x,y,{sign,r:14,g});
// rows q, 2q, 3q at P: Q at x=200, P at x=620
const ROWS=[[115,1],[255,2],[395,3]];
function rows(p,{lab=1,force=1,eop=0}={}){
 let s='';
 ROWS.forEach(([y,k],i)=>{
  s+=chg(200,y,{r:22})+TX(Qt,200,y-36,{size:32});
  s+=line(232,y,600,y,{color:C.faint,w:2,dash:'6 8'})+small(620,y);
  s+=fade(lab,TX(k===1?qt:`${k}${qt}`,620,y-30,{size:32}));
  s+=fade(force,FA(640,y,640+80*k,y,{w:8,head:20}));
  s+=fade(force*seg(1,0,1),label(k===1?'F':`${k}F`,650+80*k,y+10,{size:28,color:FC,weight:700}));
  s+=fade(eop,EA(640,y,720,y,{w:7,head:20}));
 });
 return s;
}
export const hsEField2Diagrams={
 // ================= S1 前回の問い =================
 [K+'prev']:(p)=>{
  let s=pair(330,870,220,{len:90})+TX(cs(QC,'q_1'),330,170,{size:40})+TX(cs(QC,'q_2'),870,170,{size:40});
  s+=fade(seg(p,.4,.55),rect(250,130,700,140,{fill:HI,fo:.05,stroke:HI,sw:3,rx:16})+label('2つの 電荷の 組で 決まる',600,320,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q']:(p)=>{
  let s=chg(330,230,{r:30})+TX(Qt,330,170,{size:44});
  s+=fade(seg(p,.1,.25),ring(760,230,30,{color:HI,w:3,dash:'8 6'})+label('相手は 決めない',760,310,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('？',760,245,{size:40,color:HI,anchor:'middle',weight:700}));
  s+=card(250,370,700,110,label('その 場所の 押す 強さ だけ？',600,440,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.5,.65),HI);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=fieldMap(330,250,{p:seg(p,.1,.6)});
  s+=card(640,150,500,180,label('押す 強さ',890,215,{size:32,color:C.ink,anchor:'middle',weight:700})+label('→ 電場（地図）',890,280,{size:36,color:EC,anchor:'middle',weight:700}),seg(p,.3,.45),EC);
  return s;
 },
 // ================= S2 調べるための電荷 =================
 [K+'Q']:(p)=>{
  let s=chg(300,250,{r:34,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),TX(Qt,300,185,{size:48}));
  s+=fade(seg(p,.4,.55),label('力を 及ぼす 元の 電荷',300,345,{size:28,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'qtest']:(p)=>{
  let s=chg(300,250,{r:34})+TX(Qt,300,185,{size:48})+label('元の 電荷',300,345,{size:28,color:QC,anchor:'middle',weight:700});
  s+=ptP(800,250,{g:seg(p,.05,.2)});
  s+=small(800,250,{g:seg(p,.3,.45)})+fade(seg(p,.3,.45),TX(qt,770,218,{size:36}));
  s+=fade(seg(p,.6,.75),label('試験電荷（小さい）',800,320,{size:28,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'small']:(p)=>{
  let s=chg(300,200,{r:34})+TX(Qt,300,135,{size:48})+small(800,200)+TX(qt,800,162,{size:36});
  s+=card(200,320,800,130,label('元の 電荷を 動かさない・乱さない',600,398,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.3,.45),HI);
  return s;
 },
 [K+'grow']:(p)=>{
  let s=rows(p,{force:0});
  s+=fade(seg(p,.1,.25),label('同じ 場所 P',620,480,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('力は？',1000,265,{size:40,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'grow2']:(p)=>{
  let s='';
  ROWS.forEach(([y,k],i)=>{const g=seg(p,.3+i*.12,.42+i*.12);
   s+=chg(200,y,{r:22})+TX(Qt,200,y-36,{size:32})+line(232,y,600,y,{color:C.faint,w:2,dash:'6 8'})+small(620,y)+TX(k===1?qt:`${k}${qt}`,620,y-30,{size:32});
   s+=FA(640,y,640+80*k,y,{w:8,head:20,g})+fade(g,label(k===1?'F':`${k}F`,650+80*k,y+10,{size:28,color:FC,weight:700}));});
  s+=card(960,40,220,110,TX(`${Ft}\\propto ${qt}`,1070,105,{size:42}),seg(p,.05,.2),FC);
  return s;
 },
 [K+'divide']:(p)=>{
  const u=seg(p,.45,.65);
  let s=rows(p,{force:1-u,eop:u});
  s+=card(945,110,240,320,TX(`\\dfrac{${Ft}}{${qt}}`,1065,180,{size:32})+TX(`=\\dfrac{2${Ft}}{2${qt}}`,1065,285,{size:32})+TX(`=\\dfrac{3${Ft}}{3${qt}}`,1065,390,{size:32}),seg(p,.1,.25),HI);
  s+=fade(seg(p,.7,.85),label("どれも 同じ",1065,475,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'place']:(p)=>{
  let s=chg(300,250,{r:34})+TX(Qt,300,185,{size:48})+line(340,250,770,250,{color:C.faint,w:2,dash:'6 8'})+ptP(800,250);
  s+=EA(810,250,930,250,{w:8,head:22,g:seg(p,.1,.3)});
  s+=card(200,350,800,120,label('置いた 電荷に よらない ― 場所 P だけで 決まる',600,422,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.4,.55),HI);
  return s;
 },
 // ================= S3 電場の定義 =================
 [K+'def']:(p)=>{
  let s=fcard(330,70,540,220,EDEF,{size:72,col:EC,g:seg(p,.45,.6)});
  s+=big('電場',600,370,{size:40,color:EC,g:seg(p,.1,.25)});
  s+=fade(seg(p,.1,.25),label('力 ÷ 置いた 電荷',600,440,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'vec']:(p)=>{
  let s=fcard(80,60,420,190,EDEF,{size:58,col:EC});
  
  s+=small(700,300,{g:seg(p,.35,.5)})+fade(seg(p,.35,.5),label('q（正）',700,262,{size:28,color:QC,anchor:'middle',weight:700}));
  s+=FA(720,300,960,300,{g:seg(p,.45,.6),w:10,head:26})+fade(seg(p,.5,.6),TX(vF,980,250,{size:44}));
  s+=EA(720,370,880,370,{g:seg(p,.65,.8),w:7,head:20})+fade(seg(p,.7,.8),TX(vE,900,385,{size:44}));
  s+=fade(seg(p,.8,.92),label('同じ 向き',800,450,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=fcard(330,40,540,180,EDEF,{size:56,col:EC});
  s+=card(250,270,700,170,label('単位',600,320,{size:28,color:C.dim,anchor:'middle'})+TX(`\\mathrm{N}\\div\\mathrm{C}=\\mathrm{N/C}`,600,390,{size:50,color:EC}),seg(p,.05,.2),EC);
  s+=tag('定義',990,130,{g:seg(p,.05,.2),size:30});
  s+=fade(seg(p,.6,.75),label('1 C あたりの 力',600,485,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'big1']:(p)=>{
  let s=pair(380,820,160,{len:0,kind:'',r:34});
  s+=fade(seg(p,.35,.5),label('1 C',380,105,{size:32,color:QC,anchor:'middle',weight:700})+label('1 C',820,105,{size:32,color:QC,anchor:'middle',weight:700}));
  s+=dist(380,820,240,{text:'1 m',color:HI,g:seg(p,.35,.5)});
  s+=card(150,340,900,140,TX(`${Ft}=9.0\\times10^{9}\\times\\dfrac{1\\times1}{1^2}=9.0\\times10^{9}${U('N')}`,600,412,{size:46}),seg(p,.55,.7),FC);
  return s;
 },
 [K+'conv']:(p)=>{
  let s=card(80,120,300,180,label('小さな q で',230,190,{size:30,color:QC,anchor:'middle',weight:700})+label('力を 測る',230,245,{size:30,color:FC,anchor:'middle',weight:700}),seg(p,.05,.2),QC);
  s+=arrow(400,210,500,210,{color:C.dim,w:4,head:16,g:seg(p,.25,.35)});
  s+=card(520,120,300,180,label('q で 割る',670,190,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（1 C あたりに 換算）',670,245,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.45),C.faint);
  s+=arrow(840,210,940,210,{color:C.dim,w:4,head:16,g:seg(p,.5,.6)});
  s+=card(960,120,200,180,label('電場',1060,190,{size:32,color:EC,anchor:'middle',weight:700})+TX(vE,1060,255,{size:46}),seg(p,.6,.75),EC);
  return s;
 },
 [K+'map']:(p)=>{
  let s=fieldMap(600,255,{p:seg(p,.05,.6),rings:[[85,8],[130,12],[185,16],[235,20]]});
  s+=fade(seg(p,.6,.75),label('電場の 地図',1000,90,{size:32,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bmap']:(p)=>bPanel(330,250,{g:1,p:seg(p,.05,.5)})+card(680,150,460,190,label('磁場 𝐁 の 地図',910,215,{size:32,color:BC,anchor:'middle',weight:700})+label('各場所に 向きと 強さ',910,280,{size:28,color:C.ink,anchor:'middle'}),seg(p,.4,.55),BC),
 [K+'bmap2']:(p)=>{
  let s=bPanel(300,230,{g:1,R:[90,150]})+fieldMap(900,230,{g:seg(p,.05,.2),rings:[[80,8],[130,12]],L0:56,r0:80});
  s+=label('磁場 𝐁',300,450,{size:30,color:BC,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),label('電場 𝐄',900,450,{size:30,color:EC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('電荷が 受ける 力',900,495,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label('同じ 種類の 地図',600,40,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 地図から力を求める =================
 [K+'fqe']:(p)=>{
  let s=TX(EDEF,330,190,{size:62});
  s+=fade(seg(p,.25,.4),label('両辺に q を 掛ける',600,110,{size:28,color:QC,anchor:'middle',weight:700})+arrow(500,190,700,190,{color:C.dim,w:4,head:16}));
  s+=card(740,100,360,180,TX(`${vF}=${qt}${vE}`,920,200,{size:62}),seg(p,.5,.65),FC);
  return s;
 },
 [K+'any']:(p)=>{
  let s=fieldMap(330,260,{rings:[[85,8],[130,12],[185,16]]});
  const x=330+150*Math.cos(-.4),y=260+150*Math.sin(-.4);
  s+=small(x,y,{g:seg(p,.1,.25)})+FA(x+10,y-4,x+150,y-60,{g:seg(p,.3,.5),w:8,head:20});
  s+=card(680,170,460,160,TX(`${vF}=${qt}${vE}`,910,265,{size:58}),seg(p,.4,.55),FC);
  return s;
 },
 [K+'neg']:(p)=>{
  let s=EA(300,180,900,180,{w:8,head:24})+TX(vE,940,195,{size:44});
  s+=small(600,320,{sign:-1,g:seg(p,.1,.25)})+fade(seg(p,.1,.25),label('負の 電荷',600,380,{size:28,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('← ？ →',600,290,{size:34,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'neg2']:(p)=>{
  let s=EA(300,180,900,180,{w:8,head:24})+TX(vE,940,195,{size:44});
  s+=small(600,320,{sign:-1})+label('負の 電荷',600,380,{size:28,color:NEG,anchor:'middle',weight:700});
  s+=FA(580,320,380,320,{g:seg(p,.3,.5),w:10,head:26})+fade(seg(p,.4,.55),TX(vF,350,300,{size:44}));
  s+=card(760,280,380,130,TX(`${cs(QC,'q<0')}`,950,330,{size:40})+label('→ 𝐄 と 逆向き',950,390,{size:28,color:HI,anchor:'middle',weight:700}),seg(p,.55,.7),HI);
  return s;
 },
 [K+'electron']:(p)=>{
  let s=fieldMap(330,255,{rings:[[85,8],[130,12],[185,16]]});
  const x=560,y=255;
  s+=small(x,y,{sign:-1,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('電子',x,y+48,{size:26,color:NEG,weight:700}));
  s+=EA(x+20,y,x+100,y,{w:7,head:20,g:seg(p,.2,.35)});
  s+=FA(x-6,y-36,x-90,y-36,{g:seg(p,.45,.6),w:8,head:20});
  s+=card(730,150,420,190,label('電子が 受ける 力は',930,215,{size:28,color:C.ink,anchor:'middle'})+label('𝐄 と 逆向き',930,280,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.55,.7),HI);
  return s;
 },
 // ================= S5 点電荷のまわりの電場 =================
 [K+'pt']:(p)=>ptBase(p,{F:seg(p,.5,.7)}),
 [K+'pt2']:(p)=>ptBase(p,{F:1})+card(250,330,700,150,TX(`${Ft}=k\\dfrac{${Qt}${qt}}{r^2}`,600,415,{size:56}),seg(p,.1,.25),FC),
 [K+'cancel']:(p)=>{
  const g=seg(p,.45,.6);
  let s=TX(`${Et}=\\dfrac{${Ft}}{${qt}}`,200,140,{size:52});
  s+=fade(seg(p,.1,.25),TX(`=k\\dfrac{${Qt}${qt}}{r^2}\\div ${qt}`,560,140,{size:52}));
  s+=fade(seg(p,.25,.4),TX(`=k\\dfrac{${Qt}${qt}}{r^2\\,${qt}}`,320,320,{size:56}));
  s+=fade(g,TX(`=k\\dfrac{${Qt}${cs(C.a,'\\cancel{'+qt+'}')}}{r^2\\,${cs(C.a,'\\cancel{'+qt+'}')}}`,700,320,{size:56}));
  s+=fade(g,label('q が 約分で 消える',600,460,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pres']:(p)=>{
  let s=fcard(330,50,540,200,`${Et}=k\\dfrac{${Qt}}{r^2}`,{size:66,col:EC});
  s+=tag('結果',960,150,{g:seg(p,.05,.2),size:30});
  s+=card(200,310,800,130,label('q が ない → 場所 だけで 決まる',600,388,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.4,.55),HI);
  return s;
 },
 [K+'absQ']:(p)=>{
  let s=fcard(330,60,540,200,`${Et}=k\\dfrac{|${Qt}|}{r^2}`,{size:66,col:EC,g:seg(p,.3,.45)});
  s+=fade(seg(p,.05,.2),label('Q が 負でも 大きさは 正',600,360,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'outin']:(p)=>{
  let s=fieldMap(300,240,{rings:[[85,8],[140,12]],g:seg(p,.05,.2)})+label('Q が 正 → 外向き',300,470,{size:28,color:POS,anchor:'middle',weight:700,});
  s+=fieldMap(900,240,{sign:-1,rings:[[85,8],[140,12]],g:seg(p,.4,.55)})+fade(seg(p,.4,.55),label('Q が 負 → 内向き',900,470,{size:28,color:NEG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n1']:(p)=>{
  let s=chg(250,170,{r:30})+label('2.0 μC',250,115,{size:30,color:QC,anchor:'middle',weight:700});
  s+=ptP(830,170,{g:seg(p,.3,.45)})+dist(250,830,240,{text:'0.30 m',color:HI,g:seg(p,.3,.45)});
  s+=fade(seg(p,.6,.75),label('E は？',600,400,{size:40,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n2']:(p)=>{
  let s=chg(250,90,{r:24})+label('2.0 μC',250,45,{size:26,color:QC,anchor:'middle',weight:700})+ptP(830,90)+dist(250,830,140,{color:HI});
  s+=label('0.30 m',540,180,{size:26,color:HI,anchor:'middle',weight:700});
  s+=card(80,200,1040,160,TX(`${Et}=9.0\\times10^{9}\\times\\dfrac{2.0\\times10^{-6}}{0.30^2}`,600,290,{size:50}),seg(p,.05,.2),EC);
  s+=card(330,390,540,100,TX(`=2.0\\times10^{5}${U('N/C')}`,600,450,{size:48,color:EC}),seg(p,.55,.7),EC);
  return s;
 },
 [K+'n3']:(p)=>{
  let s=chg(250,170,{r:30})+label('2.0 μC',250,115,{size:30,color:QC,anchor:'middle',weight:700})+dist(250,830,240,{text:'0.30 m',color:HI});
  s+=EA(840,170,960,170,{w:7,head:20})+TX(`${Et}=2.0\\times10^{5}${U('N/C')}`,1000,110,{size:30});
  s+=small(830,170,{g:seg(p,.05,.2)});
  s+=FA(850,200,1000,200,{g:seg(p,.4,.55),w:9,head:22})+fade(seg(p,.45,.6),TX(Ft,1030,212,{size:36}));
  s+=card(150,330,900,150,TX(`${Ft}=1.0\\times10^{-9}\\times2.0\\times10^{5}=2.0\\times10^{-4}${U('N')}`,600,400,{size:44})+fade(seg(p,.6,.75),label('外向き',600,458,{size:26,color:FC,anchor:'middle',weight:700})),seg(p,.2,.35),FC);
  return s;
 },
 [K+'n4']:(p)=>{
  let s=chg(250,170,{r:30})+label('2.0 μC',250,115,{size:30,color:QC,anchor:'middle',weight:700})+dist(250,830,240,{text:'0.30 m',color:HI});
  s+=EA(840,150,960,150,{w:7,head:20})+TX(vE,985,160,{size:36});
  s+=small(830,170,{sign:-1,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('電子',830,130,{size:26,color:NEG,anchor:'middle',weight:700}));
  s+=FA(810,200,670,200,{g:seg(p,.5,.65),w:9,head:22});
  s+=card(60,320,1080,170,TX(`${Ft}=1.6\\times10^{-19}\\times2.0\\times10^{5}=3.2\\times10^{-14}${U('N')}`,600,395,{size:44})+fade(seg(p,.6,.75),label('内向き（𝐄 と 逆）',600,462,{size:26,color:FC,anchor:'middle',weight:700})),seg(p,.2,.35),FC);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=fieldMap(300,255,{rings:[[85,8],[130,12],[185,16]]});
  s+=fcard(640,140,480,200,EDEF,{size:60,col:EC,g:seg(p,.2,.35)});
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=fieldMap(300,255,{rings:[[85,8],[130,12],[185,16]]});
  s+=card(600,90,560,130,label('𝐄 の 矢印 ＝',880,140,{size:28,color:EC,anchor:'middle',weight:700})+label('正の 電荷が 押される 向き',880,190,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55),EC);
  s+=card(600,270,560,110,label('✕ 電荷が 動く 道すじ',880,338,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'next']:(p)=>{
  let s='';for(let i=0;i<4;i++)s+=EA(150,100+100*i,650,100+100*i,{w:5,head:18,opacity:.8});
  s+=label('𝐄',680,110,{size:34,color:EC,weight:700});
  const u=seg(p,.15,.6);s+=small(mix(220,560,u),250)+arrow(220,290,560,290,{color:C.dim,w:3,head:14,g:u});
  s+=card(760,170,380,160,label('エネルギーは',950,235,{size:30,color:C.ink,anchor:'middle'})+label('どう 変わる？',950,290,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.45,.6),HI);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=circuit({on:1,cur:1,bhl:seg(p,.2,.35)});
  s+=card(850,140,310,230,label('電圧',1005,200,{size:32,color:C.v,anchor:'middle',weight:700})+label('と',1005,250,{size:28,color:C.ink,anchor:'middle'})+label('電場',1005,300,{size:32,color:EC,anchor:'middle',weight:700})+label('どう つながる？',1005,350,{size:24,color:HI,anchor:'middle',weight:700}),seg(p,.4,.55),HI);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=fade(.35,fieldMap(600,255,{rings:[[85,8],[130,12],[185,16]]}));
  s+=card(300,170,600,140,label('深く学ぶ 3/3 へ',600,255,{size:44,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  return s;
 },
};
// wire ⊙ with counterclockwise circular B arrows (orange)
function bPanel(cx,cy,{g=1,p=1,R=[90,150,210]}={}){
 let s=ring(cx,cy,20,{color:C.F,w:3,fill:'#13281f'})+dot(cx,cy,6,C.F);
 R.forEach((r,ri)=>{const n=8+4*ri,L=46*90/r+12;
  for(let i=0;i<n;i++){const a=Math.PI*2*(i+.5*(ri%2))/n,x=cx+r*Math.cos(a),y=cy-r*Math.sin(a),tx=-Math.sin(a),ty=-Math.cos(a);
   s+=arrow(x-tx*L/2,y-ty*L/2,x+tx*L/2,y+ty*L/2,{color:BC,w:4,head:12,g:p});}});
 return fade(g,s);
}
function ptBase(p,{F=1}={}){
 let s=chg(250,200,{r:30})+TX(Qt,250,140,{size:44});
 s+=small(800,200)+TX(qt,800,165,{size:36})+dist(250,800,260,{src:'r'});
 s+=FA(820,200,960,200,{g:F,w:9,head:22})+fade(F,TX(Ft,990,210,{size:40}));
 return s;
}
Object.assign(hsEField2Diagrams,{
 [K+'check']:(p)=>{
  let s=chg(250,220,{r:30})+TX(Qt,250,160,{size:44})+line(290,220,760,220,{color:C.faint,w:2,dash:'6 8'})+ptP(800,220,{text:''});
  s+=chg(800,220,{r:20,g:seg(p,.1,.25)})+fade(seg(p,.1,.25),TX(`4${qt}`,800,170,{size:40}));
  s+=card(250,330,700,130,label('力 と 力 ÷ 電荷 は？',600,408,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.4,.55),HI);
  return s;
 },
 [K+'check2']:(p)=>{
  let s=chg(250,180,{r:30})+TX(Qt,250,120,{size:44})+line(290,180,760,180,{color:C.faint,w:2,dash:'6 8'})+chg(800,180,{r:20})+TX(`4${qt}`,800,130,{size:40});
  s+=FA(825,180,1145,180,{g:seg(p,.05,.25),w:10,head:24})+fade(seg(p,.15,.3),TX(`4${Ft}`,1000,140,{size:38}));
  s+=card(250,300,700,150,TX(`\\dfrac{4${Ft}}{4${qt}}=\\dfrac{${Ft}}{${qt}}`,600,385,{size:56}),seg(p,.45,.6),HI);
  s+=fade(seg(p,.7,.85),label('変わらない',600,490,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fnum']:(p)=>fnumBase(p,{neg:0}),
 [K+'fnum2']:(p)=>fnumBase(p,{neg:1}),
 [K+'same']:(p)=>{
  let s=card(80,60,480,220,TX(`1.0\\times10^{-9}${U('C')}`,270,112,{size:30,color:QC})+label("を 置く",380,118,{size:28,color:QC,weight:700})+TX(`${Ft}=2.0\\times10^{-4}${U('N')}`,320,180,{size:38})+label('外向き',320,240,{size:26,color:FC,anchor:'middle',weight:700}),seg(p,.05,.2),FC);
  s+=card(640,60,480,220,label('電子を 置く',880,115,{size:28,color:NEG,anchor:'middle',weight:700})+TX(`${Ft}=3.2\\times10^{-14}${U('N')}`,880,180,{size:38})+label('内向き',880,240,{size:26,color:FC,anchor:'middle',weight:700}),seg(p,.15,.3),FC);
  s+=card(250,330,700,130,TX(`${Et}=2.0\\times10^{5}${U('N/C')}`,600,390,{size:46,color:EC})+label('どちらも 同じ',600,440,{size:24,color:HI,anchor:'middle',weight:700}),seg(p,.55,.7),EC);
  return s;
 },
});
function fnumBase(p,{neg=0}={}){
 let s='';for(let i=0;i<3;i++)s+=EA(120,90+60*i,640,90+60*i,{w:4,head:16,opacity:.7});
 s+=TX(`${Et}=2.0\\times10^{4}${U('N/C')}`,900,120,{size:38,color:EC});
 const g=neg?1:seg(p,.05,.2);
 s+=chg(380,330,{sign:neg?-1:1,r:22,g});
 s+=fade(g,label(neg?'−3.0 μC':'＋3.0 μC',380,285,{size:28,color:neg?NEG:QC,anchor:'middle',weight:700}));
 const a=seg(p,neg?.2:.35,neg?.4:.55);
 s+=neg?FA(352,330,212,330,{g:a,w:9,head:22}):FA(408,330,548,330,{g:a,w:9,head:22});
 s+=card(680,260,460,170,TX(neg?`|${Ft}|=3.0\\times10^{-6}\\times2.0\\times10^{4}`:`${Ft}=3.0\\times10^{-6}\\times2.0\\times10^{4}`,910,320,{size:32})
   +TX(neg?`|${Ft}|=0.060${U('N')}`:`=0.060${U('N')}`,910,385,{size:40,color:FC}),seg(p,.4,.55),FC);
 s+=fade(seg(p,.6,.75),label(neg?'向きは 左（𝐄 と 逆）':'向きは 右（𝐄 と 同じ）',380,420,{size:28,color:HI,anchor:'middle',weight:700}));
 return s;
}
