// 高校編「気体の法則・深く学ぶ 2/2」(ys-hs-t-gas-2) — 図。Stage 1200×515.
// 色：P 緑、V 水色、T 黄緑（1/2・熱と温度と同じ）。1/2 の部品（分子の箱・式の一歩）を使う。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp,mix} from './anim.mjs';
import {card,tag,T2,FA,TC,QC,Tt,sceneT,thermo,PC,VC,Pt,Vt,P1,P2,V1,V2,T1,T2t,PA,LL,KK,E5,gasBox,step} from './yt1-hs-t-gas-1-diagrams.mjs';
export {PC,VC,Pt,Vt};

const K='hs-t-gas-2:';
const Vs=`{\\color{${VC}}V^{*}}`, E5b='2.0\\times10^{5}';
const HOTM='#ffb08a';
// ---- vertical cylinder with a free piston + weight, optional flame ------------------------------
// V in litres → gas height 45 px per litre
export function cyl({x=600,gy=440,w=220,V=3,dist=0,seed=5,n=14,flame=0,hot=0,g=1,label:lb='',hit=0,weight=1}={}){
 const h=45*V,top=gy-h;let s='';
 s+=`<path d="M${x-w/2-6} ${gy-250} L${x-w/2-6} ${gy+6} L${x+w/2+6} ${gy+6} L${x+w/2+6} ${gy-250}" fill="none" stroke="${C.dim}" stroke-width="4"/>`;
 s+=gasBox({x:x-w/2,y:top,w,h,n,dist,seed,color:hot?HOTM:'#a9d8ff',fill:'#0f1a30',stroke:'none',hit});
 s+=rect(x-w/2,top-18,w,18,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:3});
 if(weight)s+=rect(x-40,top-58,80,40,{fill:'#8c97ad',fo:.95,stroke:'#d5dbe6',sw:2,rx:6});
 if(flame)s+=fade(flame,`<path d="M${x-30} ${gy+60} q10 -40 30 -50 q20 10 30 50 z" fill="${QC}" fill-opacity=".85"/>`+`<path d="M${x-12} ${gy+60} q6 -22 12 -28 q8 8 12 28 z" fill="${C.hi}"/>`);
 if(lb)s+=label(lb,x,gy+(flame?100:44),{size:26,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- Charles graph: x = Celsius (−300..160), y = V (0..4.5 L) --------------------------------------
const CG={x0:140,y0:420,kx:1.72,ky:75};
const cX=c=>CG.x0+(c+300)*CG.kx, cY=v=>CG.y0-v*CG.ky, Vc=c=>2.73+.01*c;
function charlesAxes({g=1,kRow=0,cRow=1}={}){
 let s=arrow(CG.x0-10,CG.y0,cX(175),CG.y0,{color:C.dim,w:2.5,head:14})+arrow(cX(0),CG.y0+10,cX(0),cY(4.9),{color:C.dim,w:2.5,head:14});
 for(const v of [1,2,3,4])s+=line(cX(0)-6,cY(v),cX(0)+6,cY(v),{color:C.dim})+label(`${v}.0`,cX(0)-12,cY(v)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('体積 V [L]',cX(0)+16,cY(4.9)+8,{size:24,color:VC,weight:700});
 if(cRow){
  for(const c of [-273,0,27,127])s+=fade(cRow,line(cX(c),CG.y0-6,cX(c),CG.y0+6,{color:C.dim})+label(c<0?'−273':String(c),cX(c)+(c===27?-6:c===0?-10:0),CG.y0+30,{size:22,color:C.ink,anchor:'middle'}));
  s+=fade(cRow,label('セ氏温度 [℃]',cX(175)+14,CG.y0+30,{size:24,color:C.ink,weight:700}));
 }
 if(kRow){
  for(const [c,k] of [[-273,0],[27,300],[127,400]])s+=fade(kRow,label(`${k}`,cX(c),CG.y0+64,{size:24,color:TC,anchor:'middle',weight:700}));
  s+=fade(kRow,label('絶対温度 [K]',cX(175)+14,CG.y0+64,{size:24,color:TC,weight:700}));
 }
 return fade(g,s);
}
const cpt=(c,g=1)=>fade(g,dot(cX(c),cY(Vc(c)),10,C.hi));
const cline=(p=1)=>draw([[cX(27),cY(Vc(27))],[cX(127),cY(Vc(127))]],p,{color:VC,w:4});
const cext=(p=1,to=-273)=>draw([[cX(27),cY(Vc(27))],[cX(to),cY(Vc(to))]],p,{color:VC,w:3,dash:'8 8'});
// ---- three-state strip for the two-step change --------------------------------------------------
function states({g1=1,g2=1,g3=1,a1=0,a2=0,showV=[1,0,0],hl=-1}={}){
 const xs=[200,600,1000];let s='';
 const st=[[E5,'3.0','300'],[E5b,'1.5','300'],[E5b,'2.0','400']];
 const names=['状態 1','途中','状態 2'];
 const gs=[g1,g2,g3];
 st.forEach(([P,V,T],i)=>{
  const vs=showV[i]?`${V}${LL}`:'?';
  const Vl=i===1?Vs:`{\\color{${VC}}V_${i===0?1:2}}`;
  s+=fade(gs[i],card(xs[i]-170,60,340,230,label(names[i],xs[i],100,{size:28,color:i===hl?C.hi:C.ink,anchor:'middle',weight:700})+T2(`${i===0?P1:P2}=${P}${PA}`,xs[i],150,{size:30})+T2(`${Vl}=${vs}`,xs[i],205,{size:30})+T2(`${i===2?T2t:T1}=${T}${KK}`,xs[i],260,{size:30}),1,i===hl?C.hi:C.faint));
 });
 s+=fade(a1,arrow(372,175,428,175,{color:TC,w:5,head:16})+label('温度 固定',400,330,{size:26,color:TC,anchor:'middle',weight:700})+label('ボイル',400,370,{size:26,color:PC,anchor:'middle',weight:700}));
 s+=fade(a2,arrow(772,175,828,175,{color:PC,w:5,head:16})+label('圧力 固定',800,330,{size:26,color:PC,anchor:'middle',weight:700})+label('シャルル',800,370,{size:26,color:TC,anchor:'middle',weight:700}));
 return s;
}
const Q2=(a,b,o={})=>card(200,130,800,210,label(a,600,200,{size:34,color:C.ink,anchor:'middle'})+label(b,600,280,{size:44,color:C.hi,anchor:'middle',weight:700}),o.g??1,C.hi);
const BC=`\\dfrac{${P1}${V1}}{${T1}}=\\dfrac{${P2}${V2}}{${T2t}}`;

export const hsTGas2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=cyl({x:330,V:3,dist:200*t,flame:seg(p,.3,.5)});
  s+=card(560,120,560,200,label('圧力 一定 の まま 温めると',840,190,{size:30,color:C.ink,anchor:'middle'})+label('体積は どう 変わる？',840,260,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.4,cyl({x:330,V:3,dist:200*t,flame:1}));
  s+=fade(.5,card(560,120,560,200,label('体積は どう 変わる？',840,225,{size:38,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  s+=card(560,350,560,100,label('なぜ 絶対温度 が 必要？',840,415,{size:36,color:TC,anchor:'middle',weight:700}),seg(p,.05,.25),TC);
  return s;
 },
 [K+'setup']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=cyl({x:420,V:3,dist:200*t,flame:seg(p,.3,.45)});
  s+=fade(seg(p,.05,.2),label('自由に 動く ピストン',560,250,{size:26,color:C.ink,weight:700}));
  s+=FA(420,40,420,210,{w:7,head:18,g:seg(p,.55,.75)})+fade(seg(p,.6,.75),label('外から 押す 圧力：一定',460,80,{size:28,color:PC,weight:700}));
  return s;
 },
 [K+'guess']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=cyl({x:300,V:3,dist:420*t,flame:1,hot:1,hit:1});
  s+=fade(seg(p,.05,.2),label('激しく 動く → 強く 叩く',660,150,{size:30,color:HOTM,weight:700}));
  s+=card(600,250,540,120,label('圧力を 同じに 保つ には？',870,320,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 // ================= S2 シャルルの法則 =================
 [K+'expand']:(p,ctx)=>{
  const t=sceneT(p,ctx),V=mix(3,4,seg(p,.05,.4));
  let s=cyl({x:300,V,dist:420*t,flame:1,hot:1});
  s+=fade(seg(p,.1,.3),arrow(470,440-45*3,470,440-45*4-10,{color:VC,w:5,head:16})+label('体積が 増える',500,250,{size:30,color:VC,weight:700}));
  s+=card(600,300,560,140,label('当たる 回数が 減る',880,355,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 圧力は 元と 同じ',880,410,{size:32,color:PC,anchor:'middle',weight:700}),seg(p,.5,.7),PC);
  return s;
 },
 [K+'measure']:(p,ctx)=>{
  const t=sceneT(p,ctx),V=mix(3,4,seg(p,.45,.8));
  let s=cyl({x:300,V,dist:(200+220*seg(p,.45,.8))*t,flame:seg(p,.4,.5),hot:p>.6?1:0});
  s+=card(620,110,500,110,label('27℃：3.0 L',870,180,{size:36,color:VC,anchor:'middle',weight:700}),seg(p,.05,.2),C.faint);
  s+=card(620,260,500,110,label('127℃：4.0 L',870,330,{size:36,color:VC,anchor:'middle',weight:700}),seg(p,.6,.8),C.hi);
  return s;
 },
 [K+'graph']:(p)=>charlesAxes({g:seg(p,.0,.2)})+cpt(27,seg(p,.3,.4))+cpt(127,seg(p,.45,.55))+cline(seg(p,.6,.9))+fade(seg(p,.3,.45),label('(27, 3.0)',cX(27)+14,cY(3)+34,{size:22,color:C.hi}))+fade(seg(p,.45,.6),label('(127, 4.0)',cX(127)+14,cY(4)-14,{size:22,color:C.hi})),
 [K+'slope']:(p)=>{
  let s=charlesAxes()+cline()+cpt(27)+cpt(127);
  s+=fade(seg(p,.05,.25),line(cX(27),cY(3),cX(127),cY(3),{color:C.ink,w:3,dash:'6 6'})+label('100℃',cX(77),cY(3)+30,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.4),line(cX(127),cY(3),cX(127),cY(4),{color:VC,w:3,dash:'6 6'})+label('1.0 L',cX(127)+12,cY(3.5)+8,{size:24,color:VC,weight:700}));
  s+=card(100,40,480,90,label('1℃ ごとに 0.010 L',340,98,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'extend']:(p)=>{
  let s=charlesAxes()+cline()+cpt(27)+cpt(127)+cext(seg(p,.1,.5),0);
  s+=fade(seg(p,.5,.65),dot(cX(0),cY(2.73),9,VC)+label('2.73 L',cX(0)+16,cY(2.73)+34,{size:24,color:VC,weight:700}));
  s+=card(100,40,480,90,label('3.0 − 0.27 ＝ 2.73',340,98,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.8),C.hi);
  return s;
 },
 [K+'zero']:(p)=>{
  let s=charlesAxes()+cline()+cpt(27)+cpt(127)+cext(1,0)+dot(cX(0),cY(2.73),9,VC)+cext(seg(p,.05,.45));
  s+=fade(seg(p,.45,.6),ring(cX(-273),cY(0),16,{color:C.hi,w:4})+label('体積 0',cX(-273),cY(0)-30,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(100,40,480,90,label('2.73 ÷ 0.010 ＝ 273',340,98,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.85),C.hi);
  return s;
 },
 [K+'dotted']:(p)=>{
  let s=charlesAxes()+cline()+cpt(27)+cpt(127)+cext(1);
  s+=card(80,30,520,120,label('点線 ＝ 計算 上の 線',340,80,{size:28,color:VC,anchor:'middle',weight:700})+label('実際の 気体は 先に 液体に なる',340,128,{size:26,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.3),C.dim);
  return s;
 },
 [K+'newzero']:(p)=>{
  let s=charlesAxes({kRow:seg(p,.3,.6)})+cline()+cpt(27)+cpt(127)+cext(1);
  s+=ring(cX(-273),cY(0),16,{color:C.hi,w:4});
  s+=card(100,40,480,100,label('ここを 0 に → 絶対温度',340,105,{size:32,color:TC,anchor:'middle',weight:700}),seg(p,.05,.25),TC);
  s+=fade(seg(p,.6,.8),label('−273℃ ＝ 0 K',cX(-273)+30,cY(0)-40,{size:26,color:TC,weight:700}));
  return s;
 },
 [K+'prop']:(p)=>{
  let s=charlesAxes({kRow:1,cRow:mix(1,.35,seg(p,.05,.3))})+cline()+cpt(27)+cpt(127)+cext(1);
  s+=fade(seg(p,.05,.3),dot(cX(-273),cY(0),9,C.hi)+label('原点',cX(-273)+18,cY(0)-16,{size:24,color:C.hi,weight:700}));
  s+=card(100,40,480,100,T2(`${Vt}\\ \\propto\\ ${Tt}`,340,95,{size:52}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(130,90,940,250,label('圧力 一定・決まった 量の 薄い 気体',600,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('体積 V は 絶対温度 T に 比例',600,240,{size:40,color:C.hi,anchor:'middle',weight:700})+label('シャルルの 法則',600,305,{size:30,color:TC,anchor:'middle',weight:700}),seg(p,.05,.25),TC);
  s+=tag('法則（実験で 確かめた）',600,410,{g:seg(p,.5,.65),size:26});
  return s;
 },
 [K+'VT']:(p)=>{
  let s=fade(.6,T2(`${Vt}\\ \\propto\\ ${Tt}`,600,90,{size:40}));
  s+=card(300,170,600,160,T2(`\\dfrac{${Vt}}{${Tt}}`,520,250,{size:58})+label('＝ 一定',700,268,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.4),TC);
  return s;
 },
 [K+'V1T1']:(p)=>{
  let s=fade(.6,T2(`\\dfrac{${Vt}}{${Tt}}`,560,90,{size:38})+label('＝ 一定',680,102,{size:30,color:C.dim,anchor:'middle'}));
  s+=card(300,190,600,160,T2(`\\dfrac{${V1}}{${T1}}=\\dfrac{${V2}}{${T2t}}`,600,270,{size:56}),seg(p,.2,.4),C.hi);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=card(100,60,480,200,T2(`${V1}=3.0${LL}`,340,120,{size:36})+T2(`${T1}=300${KK}`,340,200,{size:36}),seg(p,.05,.2),C.faint);
  s+=card(620,60,480,200,T2(`${T2t}=400${KK}`,860,120,{size:36})+T2(`${V2}=\\ ?`,860,200,{size:36}),seg(p,.4,.6),C.hi);
  s+=fade(seg(p,.1,.3),label('27℃',340,300,{size:26,color:C.dim,anchor:'middle'}))+fade(seg(p,.45,.6),label('127℃',860,300,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ex2']:(p)=>step(p,`\\dfrac{${V1}}{${T1}}=\\dfrac{${V2}}{${T2t}}`,`${V2}=${V1}\\times\\dfrac{${T2t}}{${T1}}`,'両辺 × T₂',{size:46,col:TC}),
 [K+'ex3']:(p)=>{
  let s=fade(.6,T2(`${V2}=${V1}\\times\\dfrac{${T2t}}{${T1}}`,600,85,{size:36}));
  s+=card(200,170,800,140,T2(`${V2}=3.0\\times\\dfrac{400}{300}=4.0${LL}`,600,240,{size:46}),seg(p,.05,.25),VC);
  s+=fade(seg(p,.55,.7),label('グラフの 127℃ の 点と 一致',600,400,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 セ氏を2倍にしない =================
 [K+'double']:(p)=>Q2('27℃ の 温度を「2倍」に するとは','何℃ に する こと？',{g:seg(p,.05,.25)}),
 [K+'guess54']:(p)=>{
  let s=card(300,80,600,120,label('54℃？',600,160,{size:48,color:C.dim,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.5,.65),line(470,140,730,140,{color:C.a,w:5}));
  s+=card(250,260,700,110,label('比例 する のは 絶対温度',600,328,{size:36,color:TC,anchor:'middle',weight:700}),seg(p,.5,.7),TC);
  return s;
 },
 [K+'K600']:(p)=>{
  let s=label('27℃ ＝ 300 K',600,110,{size:40,color:TC,anchor:'middle',weight:700});
  s+=fade(seg(p,.25,.4),label('2倍 → 600 K',600,210,{size:40,color:TC,anchor:'middle',weight:700}));
  s+=card(300,280,600,120,label('600 − 273 ＝ 327℃',600,355,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.8),C.hi);
  return s;
 },
 [K+'vol']:(p)=>{
  let s=cyl({x:250,V:2.2,label:'27℃'})+cyl({x:600,V:mix(2.2,4.4,seg(p,.05,.3)),label:'327℃',g:seg(p,.05,.2)});
  s+=fade(seg(p,.25,.4),label('体積 2倍',600,70,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=cyl({x:950,V:2.4,label:'54℃',g:seg(p,.55,.7)})+fade(seg(p,.6,.75),label('約 1.1倍',950,70,{size:28,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 2つの変化を順に =================
 [K+'state']:(p)=>states({g2:0,g3:seg(p,.45,.65),showV:[1,0,0]}),
 [K+'idea']:(p)=>{
  let s=states({g2:seg(p,.4,.6),showV:[1,0,0],a1:seg(p,.55,.7),a2:seg(p,.65,.8)});
  return s;
 },
 [K+'step1']:(p)=>states({showV:[1,0,0],a1:1,a2:.25,hl:1,g3:.35}),
 [K+'vstar']:(p)=>{
  let s=fade(.4,states({showV:[1,0,0],a1:0,hl:1}));
  s+=card(250,390,700,110,T2(`${P1}${V1}=${P2}${Vs}`,600,448,{size:46}),seg(p,.2,.4),PC);
  return s;
 },
 [K+'vstar2']:(p)=>step(p,`${P1}${V1}=${P2}${Vs}`,`${Vs}=\\dfrac{${P1}${V1}}{${P2}}`,'両辺 ÷ P₂',{size:46,col:PC}),
 [K+'vstar3']:(p)=>{
  let s=fade(.6,T2(`${Vs}=\\dfrac{${P1}${V1}}{${P2}}`,600,85,{size:36}));
  s+=card(150,170,900,140,T2(`${Vs}=\\dfrac{${E5}\\times3.0}{${E5b}}=1.5${LL}`,600,240,{size:44}),seg(p,.05,.25),VC);
  return s;
 },
 [K+'step2']:(p)=>states({showV:[1,1,0],a1:1,a2:1,hl:2}),
 [K+'v2']:(p)=>{
  let s=fade(.45,states({showV:[1,1,seg(p,.6,.75)],a1:0,a2:0}));
  s+=card(160,390,880,110,T2(`${V2}=${Vs}\\times\\dfrac{${T2t}}{${T1}}=1.5\\times\\dfrac{400}{300}=2.0${LL}`,600,448,{size:36}),seg(p,.05,.25),VC);
  return s;
 },
 // ================= S5 文字のままつなぐ =================
 [K+'gen']:(p)=>{
  let s=card(100,30,460,190,label('1段目',330,68,{size:26,color:C.dim,anchor:'middle'})+T2(`${Vs}=\\dfrac{${P1}${V1}}{${P2}}`,330,150,{size:40}),seg(p,.05,.2),C.faint);
  s+=card(640,30,460,190,label('2段目',870,68,{size:26,color:C.dim,anchor:'middle'})+T2(`${V2}=${Vs}\\times\\dfrac{${T2t}}{${T1}}`,870,150,{size:40}),seg(p,.05,.2),C.faint);
  s+=fade(seg(p,.4,.6),arrow(500,230,700,300,{color:C.hi,w:5,head:18})+label('代入',560,300,{size:28,color:C.hi,weight:700}));
  s+=card(250,330,700,130,T2(`${V2}=\\dfrac{${P1}${V1}}{${P2}}\\times\\dfrac{${T2t}}{${T1}}`,600,398,{size:44}),seg(p,.6,.8),C.hi);
  return s;
 },
 [K+'sub']:(p)=>{
  let s=card(200,100,800,160,T2(`${V2}=\\dfrac{${P1}${V1}}{${P2}}\\times\\dfrac{${T2t}}{${T1}}`,600,180,{size:50}),1,C.hi);
  s+=fade(seg(p,.2,.4),label('V* が 消えた',600,340,{size:34,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('最初と 最後の 量 だけ',600,400,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mul']:(p)=>step(p,`${V2}=\\dfrac{${P1}${V1}}{${P2}}\\times\\dfrac{${T2t}}{${T1}}`,`\\dfrac{${P2}${V2}}{${T2t}}=\\dfrac{${P1}${V1}}{${T1}}`,'両辺 × P₂／T₂',{size:46}),
 [K+'bc']:(p)=>{
  let s=card(250,60,700,170,T2(BC,600,145,{size:56}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.3,.45),label('ボイル・シャルルの 法則',600,290,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),T2(`\\dfrac{${Pt}${Vt}}{${Tt}}`,520,380,{size:44})+label('＝ 一定',650,392,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=tag('2つの 法則から 導いた 結果',600,470,{g:seg(p,.6,.75),size:24,color:C.dim});
  return s;
 },
 [K+'check']:(p)=>{
  let s=label('数で 確かめる：PV／T',600,70,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=card(100,110,1000,120,label('前',160,180,{size:28,color:C.dim,anchor:'middle',weight:700})+T2(`\\dfrac{${E5}\\times3.0}{300}=1000`,620,172,{size:40,auto:false}),seg(p,.1,.3),C.faint);
  return s;
 },
 [K+'check2']:(p)=>{
  let s=label('数で 確かめる：PV／T',600,70,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=card(100,110,1000,120,label('前',160,180,{size:28,color:C.dim,anchor:'middle',weight:700})+T2(`\\dfrac{${E5}\\times3.0}{300}=1000`,620,172,{size:40,auto:false}),1,C.faint);
  s+=card(100,260,1000,120,label('後',160,330,{size:28,color:C.dim,anchor:'middle',weight:700})+T2(`\\dfrac{${E5b}\\times2.0}{400}=1000`,620,322,{size:40,auto:false}),seg(p,.05,.25),C.faint);
  s+=fade(seg(p,.6,.75),label('一致 ✓（単位 Pa·L／K）',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'back']:(p)=>{
  let s=card(300,40,600,140,T2(BC,600,110,{size:44}),1,C.hi);
  s+=card(80,210,480,250,label('T が 変わらない',320,252,{size:28,color:TC,anchor:'middle',weight:700})+T2(`${P1}${V1}=${P2}${V2}`,320,335,{size:38})+label('ボイル',320,430,{size:26,color:PC,anchor:'middle',weight:700}),seg(p,.05,.25),TC);
  s+=card(640,210,480,250,label('P が 変わらない',880,252,{size:28,color:PC,anchor:'middle',weight:700})+T2(`\\dfrac{${V1}}{${T1}}=\\dfrac{${V2}}{${T2t}}`,880,335,{size:38})+label('シャルル',880,430,{size:26,color:TC,anchor:'middle',weight:700}),seg(p,.5,.7),PC);
  return s;
 },
 // ================= S6 使うときの注意・現象・次の問い =================
 [K+'Tk']:(p)=>{
  let s=card(200,90,800,130,label('注意 1：T は 絶対温度（K）',600,170,{size:38,color:TC,anchor:'middle',weight:700}),seg(p,.3,.5),TC);
  s+=fade(seg(p,.6,.75),label('℃ なら ＋273',600,290,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'abs']:(p)=>{
  let s=card(200,50,800,110,label('注意 2：P は 真空を 0 と した 圧力',600,118,{size:34,color:PC,anchor:'middle',weight:700}),seg(p,.05,.2),PC);
  // gauge
  s+=fade(seg(p,.35,.5),ring(330,330,100,{color:C.dim,w:4,fill:'#0f1a30'})+line(330,330,390,270,{color:C.a,w:5})+label('上乗せ 分',330,470,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('＋ 大気圧',560,345,{size:34,color:PC,weight:700})+label('→ 式に 入れる 値',560,410,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'snack']:(p)=>{
  const k=seg(p,.2,.7);
  let s=`<path d="M60 470 L380 170 L540 300 L700 120 L1140 470 Z" fill="#1d2b46" stroke="${C.faint}" stroke-width="2"/>`;
  const bag=(x,y,sc)=>`<ellipse cx="${x}" cy="${y}" rx="${70*sc}" ry="${48*sc}" fill="#e8a33a" fill-opacity=".85" stroke="#ffd27a" stroke-width="3"/>`;
  s+=bag(250,420,1)+label('ふもと',250,500,{size:24,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.3),bag(700,180,1+.35*k)+label('山の 上',700,90,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('中の 気体の 量は 同じ',960,320,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'snack2']:(p)=>{
  let s=card(150,60,900,110,label('外の 大気圧が 下がる',600,128,{size:34,color:PC,anchor:'middle',weight:700}),seg(p,.05,.2),PC);
  s+=fade(seg(p,.4,.55),T2(`${P1}${V1}=${P2}${V2}`,600,250,{size:44}));
  s+=fade(seg(p,.55,.7),label('P が 小さく なる → V が 大きく なる',600,340,{size:32,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('（温度が ほぼ 同じ なら）',600,400,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ans']:(p)=>{
  let s=card(200,60,800,130,label('圧力 一定なら',600,110,{size:28,color:C.ink,anchor:'middle'})+T2(`${Vt}\\ \\propto\\ ${Tt}`,600,160,{size:44}),seg(p,.05,.2),C.hi);
  s+=card(200,230,800,140,label('0℃ は 体積 0 の 点 では ない',600,285,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ セ氏温度 では 比が 使えない',600,340,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.7),C.dim);
  return s;
 },
 [K+'next']:(p)=>{
  let s=fade(.6,T2(`\\dfrac{${Pt}${Vt}}{${Tt}}`,540,110,{size:50})+label('＝ 一定',680,124,{size:40,color:C.dim,anchor:'middle',weight:700}));
  s+=card(200,220,800,160,label('その 一定の 値は',600,280,{size:32,color:C.ink,anchor:'middle'})+label('何で 決まる？',600,345,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(250,170,700,150,label('次の 単元：状態方程式',600,260,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
