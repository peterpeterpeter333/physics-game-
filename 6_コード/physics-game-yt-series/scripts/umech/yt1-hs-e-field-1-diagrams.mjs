// 高校編「電場とクーロンの法則・深く学ぶ 1/3」(ys-hs-e-field-1) — 図。Stage 1200×515.
// 色：力 F 緑、電荷 q 桃、正電荷 赤、負電荷・電子 青、電場 𝐄 水色、電位 V 紫、エネルギー U・W 橙、距離 r・k 白（強調は黄）。
// 2/3・3/3・要点でも使う部品は export する（カード・タグ・T2・回路は電流の部品、力の矢印・表は力学の部品を読み込む）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,axes,brace,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,fcard,circuit,CIR,POS,NEG} from './yt1-hs-e-current-1-diagrams.mjs';
import {FA,table} from './yt1-hs-m-energy-1-diagrams.mjs';
export {card,tag,T2,sceneT,fcard,circuit,CIR,POS,NEG,FA,table};

const K='hs-e-field-1:';
export const EC=C.x, VC=C.v, QC=C.p, FC=C.F, UC=C.E, HI=C.hi, RC=C.ink;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const Ft=cs(FC,'F'), vF=cs(FC,'\\mathbf{F}'), Et=cs(EC,'E'), vE=cs(EC,'\\mathbf{E}');
export const qt=cs(QC,'q'), Qt=cs(QC,'Q'), q1=cs(QC,'q_1'), q2=cs(QC,'q_2'), Vt=cs(VC,'V'), Ut=cs(UC,'U'), Wt=cs(UC,'W');
export const U=s=>`\\ \\mathrm{${s}}`;
export const TX=(src,x,y,o={})=>tex(src,x,y,{size:46,auto:false,...o});
export const COUL=(rc=RC)=>`${Ft}=k\\dfrac{|${q1}${q2}|}{${cs(rc,'r')}^2}`;
// ---- a charged ball -----------------------------------------------------------------------------
export function chg(x,y,{sign=1,r=24,g=1}={}){
 const col=sign>0?POS:NEG,fill=sign>0?'#3a1d2a':'#1b2a48';
 return fade(g,ring(x,y,r,{color:col,w:3,fill})+label(sign>0?'＋':'−',x,y+r*.4,{size:Math.round(r*1.15),color:col,anchor:'middle',weight:700}));
}
// distance marker between x1 and x2 at height y (ticks + line + text below)
export function dist(x1,x2,y,{text='',color=RC,g=1,size=28,src=''}={}){
 let s=line(x1,y-12,x1,y+12,{color,w:3})+line(x2,y-12,x2,y+12,{color,w:3})+line(x1,y,x2,y,{color,w:3,dash:'8 6'});
 if(text)s+=label(text,(x1+x2)/2,y+40,{size,color,anchor:'middle',weight:700});
 if(src)s+=TX(src,(x1+x2)/2,y+40,{size:size+6,color});
 return fade(g,s);
}
// ---- 下敷き and hair -------------------------------------------------------------------------------
export function sheet(x,y,w,{g=1,minus=0,text='下敷き'}={}){
 let s=rect(x,y,w,26,{fill:'#9fd0ff',fo:.25,stroke:'#9fd0ff',sw:2,rx:4});
 if(text)s+=label(text,x+w+16,y+22,{size:26,color:C.dim});
 if(minus>0)for(let i=0;i<7;i++)s+=fade(minus,label('−',x+30+(w-60)*i/6,y+21,{size:26,color:NEG,anchor:'middle',weight:700}));
 return fade(g,s);
}
export function head(cx,cy,{lift=0,g=1,plus=0,n=11,text='髪'}={}){
 let s=`<path d="M${cx-110} ${cy+90} Q${cx-110} ${cy-70} ${cx} ${cy-70} Q${cx+110} ${cy-70} ${cx+110} ${cy+90} Z" fill="#2a3550" stroke="${C.dim}" stroke-width="2.5"/>`;
 for(let i=0;i<n;i++){
  const u=(i+.5)/n,a=Math.PI*(1-u),x0=cx+100*Math.cos(a),y0=cy-60*Math.sin(a)+4;
  const L=40+lift*70,lean=(1-lift*.85)*Math.cos(a)*40;
  const pts=[];for(let k=0;k<=8;k++){const t=k/8;pts.push([x0+lean*t*t+6*Math.sin(t*3+i),y0-L*t-(1-lift)*10*Math.sin(t*Math.PI)]);}
  s+=draw(pts,1,{color:'#c9a46a',w:3});
 }
 if(plus>0)for(let i=0;i<5;i++)s+=fade(plus,label('＋',cx-64+32*i,cy+40,{size:26,color:POS,anchor:'middle',weight:700}));
 if(text)s+=label(text,cx+130,cy+60,{size:26,color:C.dim});
 return fade(g,s);
}
// a horizontal pair of charges with force arrows. kind: 'rep' | 'att' | ''. len: arrow length.
export function pair(x1,x2,y,{s1=1,s2=1,kind='rep',len=90,g=1,ga=1,r=24}={}){
 let s=chg(x1,y,{sign:s1,r})+chg(x2,y,{sign:s2,r});
 if(kind==='rep')s+=FA(x1-r-6,y,x1-r-6-len,y,{g:ga})+FA(x2+r+6,y,x2+r+6+len,y,{g:ga});
 if(kind==='att')s+=FA(x1+r+6,y,x1+r+6+len,y,{g:ga})+FA(x2-r-6,y,x2-r-6-len,y,{g:ga});
 return fade(g,s);
}
const big=(t,x,y,{size=34,color=C.ink,g=1}={})=>fade(g,label(t,x,y,{size,color,anchor:'middle',weight:700}));
export const sheetScene=(p,{lift=1,minus=1,plus=1,arrows=0,gap=0}={})=>{
 let s=sheet(380,110+gap,440,{minus})+head(600,330+gap*0,{lift,plus});
 if(arrows>0)s+=FA(600,262,600,180,{g:arrows,w:7,head:20});
 return s;
};

export const hsEField1Diagrams={
 // ================= S1 磁場と電磁誘導からの問い =================
 [K+'volt']:(p)=>{
  let s=circuit({on:1,cur:1});
  s+=card(850,130,320,240,label('電圧',1010,190,{size:32,color:VC,anchor:'middle',weight:700})+label('1 C あたりの',1010,255,{size:28,color:C.ink,anchor:'middle'})+label('エネルギー',1010,305,{size:30,color:UC,anchor:'middle',weight:700}),seg(p,.2,.4),VC);
  return s;
 },
 [K+'q']:(p)=>{
  let s=chg(600,250,{r:34});
  for(let i=0;i<8;i++){const a=Math.PI*2*i/8+.3,g=seg(p,.15+i*.03,.3+i*.03);s+=fade(g,label('？',600+150*Math.cos(a),250+150*Math.sin(a)*.95+12,{size:36,color:HI,anchor:'middle',weight:700}));}
  s+=card(760,400,420,90,label('力は 空間に どう 広がる？',970,456,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.5,.65),HI);
  return s;
 },
 [K+'shitajiki']:(p)=>{
  let s=sheet(380,130,440,{g:seg(p,0,.15)})+head(600,350,{lift:seg(p,.3,.7)});
  return s;
 },
 [K+'pull']:(p)=>{
  let s=sheet(380,130,440)+head(600,350,{lift:1});
  s+=fade(seg(p,.15,.3),line(860,160,860,265,{color:HI,w:3})+line(848,160,872,160,{color:HI,w:3})+line(848,265,872,265,{color:HI,w:3})+label('触れていない',880,222,{size:28,color:HI,weight:700}));
  s+=FA(600,262,600,180,{g:seg(p,.45,.65),w:7,head:20})+fade(seg(p,.55,.7),label('引き合う',440,230,{size:30,color:FC,anchor:'end',weight:700}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=pair(380,620,180,{kind:'rep',len:120,g:seg(p,0,.15)});
  s+=dist(380,620,250,{text:'距離',g:seg(p,.1,.25),color:HI});
  s+=card(200,340,800,120,label('距離で 力は どう 弱まる？',600,415,{size:38,color:HI,anchor:'middle',weight:700}),seg(p,.3,.45),HI);
  return s;
 },
 // ================= S2 電荷の正と負 =================
 [K+'rub']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sheet(380,130,440,{minus:seg(p,.55,.8)})+head(600,350,{lift:0,plus:seg(p,.55,.8)});
  // electrons hopping from hair (y≈290) up to the sheet (y≈150)
  for(let k=0;k<6;k++){const u=lin(p,.15+k*.06,.45+k*.06);if(u<=0||u>=1)continue;const x=470+52*k;s+=dot(x,mix(285,160,u),8,NEG);}
  s+=fade(seg(p,.1,.25),arrow(1000,300,1000,170,{color:NEG,w:5,head:16})+label('電子が 移る',1020,245,{size:28,color:NEG,weight:700}));
  return s;
 },
 [K+'rub2']:(p)=>{
  let s=sheet(380,130,440,{minus:1})+head(600,350,{lift:0,plus:1});
  s+=card(40,90,300,110,label('電子が 増えた',190,135,{size:26,color:C.ink,anchor:'middle'})+label('負',190,180,{size:34,color:NEG,anchor:'middle',weight:700}),seg(p,.1,.25),NEG);
  s+=card(40,300,300,110,label('電子が 減った',190,345,{size:26,color:C.ink,anchor:'middle'})+label('正',190,390,{size:34,color:POS,anchor:'middle',weight:700}),seg(p,.5,.65),POS);
  return s;
 },
 [K+'signs']:(p)=>{
  let s='';
  const rows=[[110,1,1,'rep','反発'],[250,-1,-1,'rep','反発'],[390,1,-1,'att','引き合う']];
  rows.forEach(([y,a,b,kind,txt],i)=>{const g=seg(p,.05+i*.22,.17+i*.22);
   s+=pair(330,590,y,{s1:a,s2:b,kind,len:80,g});
   s+=fade(g,label(txt,820,y+11,{size:32,color:kind==='rep'?FC:HI,weight:700}));});
  s+=tag('実験で 確かめた 事実',1030,470,{g:seg(p,.8,.92),size:24});
  return s;
 },
 [K+'signs2']:(p)=>{
  let s=sheetScene(p,{arrows:seg(p,.3,.5)});
  s+=card(40,180,290,140,label('負 と 正',185,240,{size:32,color:HI,anchor:'middle',weight:700})+label('→ 引き合う',185,290,{size:30,color:FC,anchor:'middle',weight:700}),seg(p,.4,.55),HI);
  return s;
 },
 // ================= S3 クーロンの法則 =================
 [K+'measure']:(p)=>{
  let s=chg(330,200,{r:20,g:seg(p,.05,.2)})+chg(870,200,{r:20,g:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),TX(q1,330,150,{size:40})+TX(q2,870,150,{size:40}));
  s+=FA(304,200,214,200,{g:seg(p,.2,.35)})+FA(896,200,986,200,{g:seg(p,.2,.35)});
  s+=dist(330,870,270,{src:'r',g:seg(p,.25,.4)});
  s+=card(250,370,700,100,label('点電荷：大きさを 無視できる 電荷',600,432,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.55,.7),HI);
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(100,90,460,280,label('電荷の 積に 比例',330,160,{size:32,color:QC,anchor:'middle',weight:700})+TX(`${Ft}\\ \\propto\\ |${q1}${q2}|`,330,270,{size:56}),seg(p,.1,.25),QC);
  s+=card(640,90,460,280,label('距離の 2乗に 反比例',870,160,{size:32,color:HI,anchor:'middle',weight:700})+TX(`${Ft}\\ \\propto\\ \\dfrac{1}{${cs(HI,'r')}^2}`,870,270,{size:56}),seg(p,.5,.65),HI);
  s+=tag('測った 結果',600,440,{g:seg(p,.75,.88)});
  return s;
 },
 [K+'formula']:(p)=>{
  let s=fcard(300,110,600,230,COUL(),{size:72,col:FC,g:seg(p,.1,.3)});
  s+=big('クーロンの 法則',600,420,{size:38,color:HI,g:seg(p,.55,.7)});
  return s;
 },
 [K+'letters']:(p)=>{
  const hl=seg(p,.55,.7);
  let s=chg(250,140,{r:20})+chg(950,140,{r:20})+TX(q1,250,92,{size:40})+TX(q2,950,92,{size:40});
  s+=fade(seg(p,.05,.2),label('電荷 [C]',600,105,{size:28,color:QC,anchor:'middle',weight:700}));
  s+=dist(250,950,190,{src:'r',color:mix(0,1,hl)>.5?HI:RC});
  s+=fade(seg(p,.55,.7),label('距離 [m]',630,240,{size:28,color:HI,weight:700}));
  s+=card(380,300,440,190,fade(1-hl,TX(COUL(),600,410,{size:58}))+fade(hl,TX(COUL(HI),600,410,{size:58})),1,FC);
  return s;
 },
 [K+'exp']:(p)=>{
  let s=fcard(300,90,600,220,COUL(),{size:68,col:FC});
  s+=tag('法則：実験で 確かめた',600,400,{g:seg(p,.1,.25),size:30});
  s+=fade(seg(p,.55,.7),label('ほかの 式から 導いた ものではない',600,465,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'abs']:(p)=>{
  let s=fcard(300,40,600,200,COUL(),{size:64,col:FC});
  s+=fade(seg(p,.05,.2),rect(605,55,165,90,{fill:HI,fo:.08,stroke:HI,sw:3,rx:10}));
  s+=card(150,290,900,170,label('例：',230,385,{size:30,color:C.dim,anchor:'middle'})+TX(`(+2)\\times(-3)=-6`,480,380,{size:46})
   +fade(seg(p,.45,.6),TX(`|-6|=6`,800,380,{size:46,color:HI}))+fade(seg(p,.6,.75),label('大きさは 正',930,440,{size:24,color:HI,anchor:'middle',weight:700})),seg(p,.25,.4),HI);
  return s;
 },
 [K+'dir']:(p)=>{
  let s=fcard(300,30,600,170,COUL(),{size:56,col:FC});
  s+=pair(230,450,320,{s1:1,s2:1,kind:'rep',len:70,g:seg(p,.3,.45)})+big('同じ 符号 → 反発',340,430,{size:30,color:FC,g:seg(p,.3,.45)});
  s+=pair(750,970,320,{s1:1,s2:-1,kind:'att',len:70,g:seg(p,.55,.7)})+big('違う 符号 → 引力',860,430,{size:30,color:HI,g:seg(p,.55,.7)});
  return s;
 },
 [K+'k']:(p)=>{
  let s=fcard(300,30,600,170,COUL(),{size:56,col:FC});
  s+=fade(seg(p,.05,.2),rect(548,62,62,104,{fill:HI,fo:.08,stroke:HI,sw:3,rx:10}));
  s+=card(110,250,980,180,label('比例定数（真空）',600,300,{size:28,color:C.dim,anchor:'middle'})+TX(`k\\approx 8.99\\times10^{9}${U('N\\cdot m^2/C^2')}`,600,380,{size:50}),seg(p,.25,.4),HI);
  return s;
 },
 [K+'k2']:(p)=>{
  let s=card(110,60,980,170,TX(`k\\approx 8.99\\times10^{9}${U('N\\cdot m^2/C^2')}`,600,160,{size:48}),1,C.faint);
  s+=card(250,280,700,160,label('計算では',600,330,{size:28,color:C.dim,anchor:'middle'})+TX(`k=9.0\\times10^{9}${U('N\\cdot m^2/C^2')}`,600,400,{size:46,color:HI}),seg(p,.15,.3),HI);
  return s;
 },
 [K+'kunit']:(p)=>{
  const g1=seg(p,.3,.45),g2=seg(p,.55,.7);
  const ex=(c1,c2)=>TX(`\\dfrac{\\mathrm{N}\\cdot ${cs(c2,'\\mathrm{m^2}')}}{${cs(c1,'\\mathrm{C^2}')}}\\times\\dfrac{${cs(c1,'\\mathrm{C\\times C}')}}{${cs(c2,'\\mathrm{m^2}')}}`,480,230,{size:62});
  let s=card(80,90,1040,250,fade(1-g1,ex(C.ink,C.ink))+fade(g1,ex(QC,HI))
   +fade(g2,TX(`=\\mathrm{N}`,880,225,{size:62,color:FC})),seg(p,.05,.2),HI);
  s+=fade(g1,label('C² どうし、m² どうしが 約分で 消える',600,390,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('k の 単位なら、力が N で 出る',600,450,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eps']:(p)=>{
  let s=fcard(300,50,600,200,`\\varepsilon_0=\\dfrac{1}{4\\pi k}`,{size:70,col:HI,g:seg(p,.3,.45)});
  s+=fade(seg(p,.05,.2),label('イプシロン ゼロ',600,320,{size:30,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('k から 決めた 別の 定数',600,400,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eps2']:(p)=>{
  let s=fcard(300,30,600,180,`\\varepsilon_0=\\dfrac{1}{4\\pi k}`,{size:62,col:HI});
  s+=tag('定義',1000,120,{g:seg(p,.05,.2),size:30});
  s+=card(150,250,900,130,TX(`\\varepsilon_0\\approx8.85\\times10^{-12}${U('C^2/(N\\cdot m^2)')}`,600,325,{size:46}),seg(p,.3,.45),C.faint);
  s+=fade(seg(p,.6,.75),label('コンデンサーの 単元で 使う',600,450,{size:30,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 距離2倍で、力は何倍？ =================
 [K+'guess']:(p)=>{
  let s=pair(240,440,140,{len:160,g:seg(p,0,.15)})+dist(240,440,200,{src:'r',color:HI,g:seg(p,0,.15)});
  s+=pair(240,640,350,{len:0,kind:'',g:seg(p,.2,.35)})+dist(240,640,410,{src:'2r',color:HI,g:seg(p,.2,.35)});
  s+=fade(seg(p,.35,.5),label('力は？',870,365,{size:40,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=TX(`${Ft}=k\\dfrac{|${q1}${q2}|}{${cs(HI,'r')}^2}`,250,190,{size:58});
  s+=fade(seg(p,.1,.3),TX(`\\to\\ k\\dfrac{|${q1}${q2}|}{(${cs(HI,'2r')})^2}`,610,190,{size:58}));
  s+=fade(seg(p,.5,.7),TX(`=k\\dfrac{|${q1}${q2}|}{${cs(HI,'4r^2')}}`,960,190,{size:58}));
  s+=fade(seg(p,.5,.7),label('(2r)² ＝ 2r × 2r ＝ 4r²',600,400,{size:34,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quarter']:(p)=>{
  let s=pair(240,440,140,{len:160})+dist(240,440,200,{src:'r',color:HI});
  s+=pair(240,640,350,{len:40,ga:seg(p,.1,.3)})+dist(240,640,410,{src:'2r',color:HI});
  s+=fade(seg(p,.1,.3),label('長さ 4 : 1',150,290,{size:28,color:FC,weight:700}));
  s+=card(840,140,300,250,label('力は',990,190,{size:30,color:C.ink,anchor:'middle'})+TX(`\\dfrac{1}{4}`,990,320,{size:64,color:HI}),seg(p,.3,.45),HI);
  s+=fade(seg(p,.6,.75),label('1/2 ではない',990,440,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=pair(380,820,170,{len:0,kind:'',g:seg(p,.05,.2)});
  s+=fade(seg(p,.1,.25),label('1.0 μC',380,125,{size:30,color:QC,anchor:'middle',weight:700})+label('1.0 μC',820,125,{size:30,color:QC,anchor:'middle',weight:700}));
  s+=dist(380,820,240,{text:'0.10 m',color:HI,g:seg(p,.45,.6)});
  return s;
 },
 [K+'micro']:(p)=>{
  let s=card(200,60,800,150,label('μ（マイクロ） ＝ 100万分の1',600,130,{size:34,color:C.ink,anchor:'middle',weight:700})+TX(`=10^{-6}`,600,185,{size:40,color:HI}),seg(p,.05,.2),HI);
  s+=card(200,260,800,150,TX(`1.0${U('\\mu C')}=1.0\\times10^{-6}${U('C')}`,600,345,{size:52,color:QC}),seg(p,.5,.65),QC);
  return s;
 },
 [K+'calc1']:(p)=>{
  let s=pair(380,820,80,{len:0,kind:'',r:18})+label('1.0 μC',300,90,{size:26,color:QC,anchor:'end',weight:700})+label('1.0 μC',900,90,{size:26,color:QC,weight:700})+dist(380,820,130,{text:'',color:HI});
  s+=label('0.10 m',600,170,{size:26,color:HI,anchor:'middle',weight:700});
  s+=card(60,190,1080,170,TX(`${Ft}=9.0\\times10^{9}\\times\\dfrac{(1.0\\times10^{-6})^2}{${cs(HI,'0.10^2')}}`,600,285,{size:50}),seg(p,.05,.2),FC);
  s+=card(400,390,400,100,TX(`=0.90${U('N')}`,600,450,{size:50,color:FC}),seg(p,.6,.75),FC);
  return s;
 },
 [K+'calc2']:(p)=>{
  let s=pair(240,440,130,{len:160})+dist(240,440,190,{text:'0.10 m',color:HI})+label('0.90 N',140,100,{size:28,color:FC,anchor:'middle',weight:700});
  s+=pair(240,640,340,{len:40,ga:seg(p,.1,.3)})+dist(240,640,400,{text:'0.20 m',color:HI,g:seg(p,.05,.2)});
  s+=fade(seg(p,.3,.45),label('0.225 N',150,305,{size:28,color:FC,anchor:'middle',weight:700}));
  s+=card(820,170,330,200,TX(`0.90\\div4`,985,240,{size:44})+TX(`=0.225`,985,320,{size:44,color:FC}),seg(p,.4,.55),HI);
  s+=fade(seg(p,.7,.85),label('ちょうど 1/4',985,420,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'both']:(p)=>{
  let s=pair(380,820,170,{len:0,kind:'',r:30,g:1});
  s+=fade(seg(p,.4,.55),label('2.0 μC',380,115,{size:30,color:QC,anchor:'middle',weight:700})+label('2.0 μC',820,115,{size:30,color:QC,anchor:'middle',weight:700}));
  s+=fade(1-seg(p,.35,.5),label('1.0 μC',380,115,{size:30,color:QC,anchor:'middle',weight:700})+label('1.0 μC',820,115,{size:30,color:QC,anchor:'middle',weight:700}));
  s+=dist(380,820,250,{text:'0.20 m',color:HI});
  s+=fade(seg(p,.6,.75),label('力は？',600,400,{size:40,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'both2']:(p)=>{
  let s=TX(`${Ft}=k\\dfrac{|${q1}${q2}|}{r^2}`,600,110,{size:54});
  s+=card(120,200,440,170,label('分子',340,250,{size:28,color:QC,anchor:'middle',weight:700})+TX(`2\\times2=4`,340,320,{size:46})+label('倍',450,327,{size:30,color:C.ink,weight:700}),seg(p,.05,.2),QC);
  s+=card(640,200,440,170,label('分母',860,250,{size:28,color:HI,anchor:'middle',weight:700})+TX(`2^2=4`,840,320,{size:46})+label('倍',920,327,{size:30,color:C.ink,weight:700}),seg(p,.25,.4),HI);
  s+=card(330,400,540,100,TX(`${Ft}=0.90${U('N')}`,540,460,{size:46,color:FC})+label('に 戻る',690,465,{size:28,color:C.ink,weight:700}),seg(p,.6,.75),FC);
  return s;
 },
 // ================= S5 万有引力と比べる =================
 [K+'grav']:(p)=>{
  let s=card(80,100,480,240,label('万有引力',320,160,{size:30,color:C.ink,anchor:'middle',weight:700})+TX(`${Ft}=G\\dfrac{m_1m_2}{r^2}`,320,260,{size:56}),seg(p,.15,.3),C.faint);
  s+=card(640,100,480,240,label('クーロンの 法則',880,160,{size:30,color:C.ink,anchor:'middle',weight:700})+TX(COUL(),880,260,{size:56}),1,FC);
  s+=fade(seg(p,.55,.7),label('そっくり',600,420,{size:36,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'table']:(p)=>gravTable(p,{r1:seg(p,.05,.2),r2:seg(p,.3,.45),r3:seg(p,.6,.75)}),
 [K+'table2']:(p)=>gravTable(p,{r4:seg(p,.3,.45),hl:seg(p,.3,.45)}),
 [K+'table3']:(p)=>gravTable(p,{r4:1,hl:1,r5:seg(p,.2,.35)}),
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=fcard(250,60,700,190,COUL(HI),{size:64,col:FC});
  s+=big('距離の 2乗に 反比例',600,330,{size:38,color:HI,g:seg(p,.4,.55)});
  return s;
 },
 [K+'ans2']:(p)=>{
  const A=axes({x:170,y:440,w:620,h:340,xmax:.35,ymax:1.0,xticks:[.1,.2,.3],yticks:[.5,1],grid:true,xlabel:'r [m]',ylabel:'力の 大きさ [N]',ycolor:FC});
  let s=A.svg+A.plot(u=>.009/(u*u),{from:.095,to:.35,p:seg(p,.05,.6),color:FC,w:5});
  const pts=[[.1,.9,'0.90 N',.0],[.2,.225,'0.225 N',.3],[.3,.1,'0.10 N',.55]];
  pts.forEach(([u,v,t,a])=>{const g=seg(p,a,a+.12);s+=fade(g,dot(A.X(u),A.Y(v),9,HI)+label(t,A.X(u)+22,A.Y(v)-4,{size:26,color:HI,weight:700}));});
  s+=card(880,130,280,220,label('1 : 1/4 : 1/9',1020,215,{size:32,color:HI,anchor:'middle',weight:700})+label('距離 1 : 2 : 3',1020,285,{size:28,color:C.ink,anchor:'middle'}),seg(p,.6,.75),HI);
  return s;
 },
 [K+'pair']:(p)=>{
  let s=pair(330,870,200,{len:90});
  s+=TX(q1,330,150,{size:40})+TX(q2,870,150,{size:40});
  s+=fade(seg(p,.2,.4),rect(250,110,700,140,{fill:HI,fo:.05,stroke:HI,sw:3,rx:16})+label('2つの 電荷の 組',600,300,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=chg(330,230,{r:30})+TX(cs(QC,'Q'),330,170,{size:44});
  s+=fade(seg(p,.1,.25),ring(760,230,30,{color:HI,w:3,dash:'8 6'})+label('相手は 決めない',760,310,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('？',760,245,{size:40,color:HI,anchor:'middle',weight:700}));
  s+=card(250,370,700,110,label('その 場所の 押す 強さ だけ？',600,440,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.5,.65),HI);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=fade(.35,chg(330,230,{r:30}));
  s+=card(300,170,600,140,label('深く学ぶ 2/3 へ',600,255,{size:44,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  return s;
 },
};
function gravTable(p,{r1=1,r2=1,r3=1,r4=0,r5=0,hl=0}={}){
 const x=70,y=40,cw=[300,300,300],rh=72;
 let s=card(x-14,y-10,cw[0]+cw[1]+cw[2]+28,rh*6+12,'',1,C.faint);
 const head=['','万有引力','電気の 力'];
 head.forEach((h,j)=>{s+=label(h,x+cw.slice(0,j).reduce((a,b)=>a+b,0)+cw[j]/2,y+46,{size:28,color:C.dim,anchor:'middle',weight:700});});
 s+=line(x,y+rh,x+900,y+rh,{color:C.faint,w:2});
 const cell=(i,j,content,g)=>fade(g,content(x+cw.slice(0,j).reduce((a,b)=>a+b,0)+cw[j]/2,y+rh*(i+1)+48));
 const L=(t,c=C.ink)=>(cx,cy)=>label(t,cx,cy,{size:30,color:c,anchor:'middle',weight:700});
 const Tt=(src,c=C.ink)=>(cx,cy)=>TX(src,cx,cy-8,{size:40,color:c});
 s+=cell(0,0,L('もと'),r1)+cell(0,1,L('質量 m'),r1)+cell(0,2,L('電荷 q',QC),r1);
 s+=cell(1,0,L('比例定数'),r2)+cell(1,1,Tt('G'),r2)+cell(1,2,Tt('k'),r2);
 s+=cell(2,0,L('距離'),r3)+cell(2,1,Tt('1/r^2'),r3)+cell(2,2,Tt('1/r^2'),r3);
 if(hl>0)s+=fade(hl,rect(x,y+rh*4+4,900,rh-8,{fill:C.a,fo:.1,stroke:C.a,sw:2,rx:8}));
 s+=cell(3,0,L('向き'),r4)+cell(3,1,L('引力だけ'),r4)+cell(3,2,L('引力 と 反発',HI),r4);
 s+=cell(4,0,L('負の 量'),r5)+cell(4,1,L('ない'),r5)+cell(4,2,L('ある',HI),r5);
 if(r4>0)s+=fade(r4,label('✕ 対応しない',1085,y+rh*4+48,{size:24,color:C.a,anchor:'middle',weight:700}));
 return s;
}

Object.assign(hsEField1Diagrams,{
 [K+'closer']:(p)=>{
  const u=seg(p,.1,.6);
  let s=sheet(380,mix(130,152,u),440)+head(600,350,{lift:1});
  s+=FA(600,262,600,mix(196,200,u),{w:mix(7,12,u),head:20});
  s+=fade(seg(p,.5,.65),label('近いほど 強い',440,240,{size:30,color:FC,anchor:'end',weight:700}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=pair(240,440,140,{len:160})+dist(240,440,200,{src:'r',color:HI});
  s+=pair(240,840,350,{len:0,kind:'',g:seg(p,.1,.25)})+dist(240,840,410,{src:'3r',color:HI,g:seg(p,.1,.25)});
  s+=fade(seg(p,.3,.45),label('力は？',1020,365,{size:40,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check2']:(p)=>{
  let s=pair(240,440,140,{len:162})+dist(240,440,200,{src:'r',color:HI});
  s+=pair(240,840,350,{len:18,ga:seg(p,.4,.55)})+dist(240,840,410,{src:'3r',color:HI});
  s+=card(880,40,280,130,TX(`(${cs(HI,'3r')})^2=${cs(HI,'9r^2')}`,1020,115,{size:40}),seg(p,.05,.2),HI);
  s+=card(930,190,180,160,TX(`\\dfrac{1}{9}`,1020,282,{size:56,color:HI}),seg(p,.45,.6),HI);
  s+=fade(seg(p,.5,.65),label('長さ 9 : 1',150,290,{size:28,color:FC,weight:700}));
  return s;
 },
 [K+'gnum']:(p)=>{
  let s=card(60,40,1080,120,TX(`G\\approx6.7\\times10^{-11}${U('N\\cdot m^2/kg^2')}`,600,112,{size:44}),seg(p,.05,.2),C.faint);
  s+=fade(seg(p,.2,.35),dot(380,230,26,'#9aabc7')+dot(820,230,26,'#9aabc7')+label('1 kg',380,196,{size:28,color:C.ink,anchor:'middle',weight:700})+label('1 kg',820,196,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=dist(380,820,280,{text:'0.10 m',color:HI,g:seg(p,.2,.35)});
  s+=card(150,360,900,120,TX(`${Ft}=6.7\\times10^{-11}\\times\\dfrac{1\\times1}{0.10^2}\\approx6.7\\times10^{-9}${U('N')}`,600,428,{size:42}),seg(p,.45,.6),FC);
  return s;
 },
 [K+'gnum2']:(p)=>{
  let s=card(80,60,480,200,label('万有引力（1 kg 2つ）',320,120,{size:28,color:C.ink,anchor:'middle',weight:700})+TX(`6.7\\times10^{-9}${U('N')}`,320,205,{size:46,color:FC}),1,C.faint);
  s+=card(640,60,480,200,label('電気の力（1.0 μC 2つ）',880,120,{size:28,color:QC,anchor:'middle',weight:700})+TX(`0.90${U('N')}`,880,205,{size:46,color:FC}),seg(p,.05,.2),FC);
  s+=card(250,320,700,130,label('1億倍 以上',600,400,{size:44,color:HI,anchor:'middle',weight:700}),seg(p,.35,.5),HI);
  return s;
 },
});
