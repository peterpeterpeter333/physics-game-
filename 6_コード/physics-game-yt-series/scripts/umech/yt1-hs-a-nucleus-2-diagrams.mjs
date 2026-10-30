// 高校編「原子核と放射線・深く学ぶ 2/3」(ys-hs-a-nucleus-2) — 図。Stage 1200×515.
// 色：時間 t・半減期 T 金、残りの核 水色（崩壊した核は暗い灰）、掛ける数 ½・□ 黄、誤り 赤。
// 1000 個のシミュレーション：各核の崩壊時刻 τ＝T·log₂(1/u)（決まった種の乱数）。画面の残り数はこの計算の実数。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp,mix,axes} from './anim.mjs';
import {card,tag,table,rng,TX,fcard,cs,cross,okMark,nucBalls,C12,sceneT,wavy,proton,neutron} from './yt1-hs-a-nucleus-1-diagrams.mjs';

const K='hs-a-nucleus-2:';
export const TC=C.t, LIVE=C.x, DEAD='#28324a', HC=C.hi, BAD=C.a, OK=C.F;
export const Tt=cs(TC,'T'), tt=cs(TC,'t');
export const HALF=`\\tfrac{1}{2}`;
// ---- simulation ------------------------------------------------------------------------------------
export function sim(seed,n=1000){const R=rng(seed);return Array.from({length:n},()=>Math.log2(1/Math.max(1e-12,R())));}
export const RUN1=sim(17), RUN2=sim(29);
export const alive=(run,tau)=>run.reduce((a,x)=>a+(x>tau?1:0),0);
export function grid(run,tau,{x0=70,y0=70,dx=14,dy=14.5,cols=40,r=5,g=1,hl=-1}={}){
 let s='';run.forEach((x,i)=>{const c=i%cols,rw=Math.floor(i/cols);const on=x>tau;const h=hl>=0&&on&&x<=hl;s+=dot(x0+c*dx,y0+rw*dy,r,on?(h?C.a:LIVE):DEAD);});
 return fade(g,s);
}
const tauLab=tau=>tau>=.999&&tau<=1.001?'T':tau>=1.999&&tau<=2.001?'2T':`${tau.toFixed(2)} T`;
export function counter(run,tau,{x=720,y=90,g=1,title=''}={}){
 const n=alive(run,tau);
 let s=card(x,y,420,250,'',g,C.faint);
 if(title)s+=fade(g,label(title,x+210,y+45,{size:26,color:C.dim,anchor:'middle'}));
 s+=fade(g,label('時間',x+40,y+110,{size:28,color:TC,weight:700})+label(tauLab(tau),x+380,y+110,{size:36,color:TC,anchor:'end',weight:700}));
 s+=fade(g,label('残り',x+40,y+195,{size:28,color:LIVE,weight:700})+label(`${n} 個`,x+380,y+195,{size:44,color:LIVE,anchor:'end',weight:700}));
 return s;
}
// ---- table and graph --------------------------------------------------------------------------------
export function htable({x=150,y=70,reveal=[1,1,1,1],hl=[],dec=1,size=32,q=0}={}){
 const rows=[['0','1000 個','—'],['T','500 個','500 個'],['2T',q?'？':'250 個',q?'？':'250 個'],['3T','125 個','125 個']];
 const cols=[{h:'時間',color:TC,w:150},{h:'残り',color:LIVE,w:200},{h:'その間に 崩壊',color:C.ink,w:220}];
 return table({x,y,cols:dec?cols:cols.slice(0,2),rows:dec?rows:rows.map(r=>r.slice(0,2)),reveal,hl,rh:62,size});
}
export const GA={x:640,y:440,w:430,h:340,xmax:4.3,ymax:1100};
export function hgraph({g=1,pts=4,curve=1,lin=0,o=GA,half=0,lab=1}={}){
 const A=axes({x:o.x,y:o.y,w:o.w,h:o.h,xmax:o.xmax,ymax:o.ymax,xticks:[],yticks:[],g});
 let s=A.svg;
 const X=t=>o.x+t/o.xmax*o.w,Y=v=>o.y-v/o.ymax*o.h;
 s+=fade(g,label('時間',o.x+o.w+46,o.y+8,{size:24,color:TC})+label('残り',o.x+16,o.y-o.h-14,{size:24,color:LIVE,anchor:'start'}));
 ['T','2T','3T','4T'].forEach((L,i)=>{s+=fade(g,line(X(i+1),o.y,X(i+1),o.y+8,{color:C.dim,w:2})+label(L,X(i+1),o.y+34,{size:24,color:TC,anchor:'middle',weight:700}));});
 [1000,500,250].forEach(v=>{s+=fade(g,line(o.x-8,Y(v),o.x,Y(v),{color:C.dim,w:2})+label(String(v),o.x-14,Y(v)+8,{size:22,color:C.dim,anchor:'end'}));});
 if(lin)s+=fade(lin,line(X(0),Y(1000),X(2),Y(0),{color:BAD,w:3,dash:'10 8'})+label('毎回 500 個 減る なら',X(1.0)+24,Y(760),{size:24,color:BAD,weight:700}));
 if(curve){const P=[];for(let t=0;t<=4.2;t+=.05)P.push([X(t),Y(1000*Math.pow(.5,t))]);s+=draw(P,curve,{color:LIVE,w:4});}
 for(let i=0;i<=Math.min(4,pts);i++)s+=fade(g*clamp(pts-i+1),dot(X(i),Y(1000/2**i),8,HC));
 if(half)s+=fade(half,dot(X(.5),Y(707),9,C.a)+line(X(.5),o.y,X(.5),Y(707),{color:C.a,w:2,dash:'6 6'})+label('0.71 倍',X(.5)+14,Y(707)-10,{size:24,color:C.a,weight:700}));
 return s;
}
function tree(x,y,{g=1,dead=0}={}){
 return fade(g,rect(x-12,y-80,24,80,{fill:'#8a6440',fo:.9,stroke:'#8a6440'})+(dead?'':dot(x,y-120,55,'#3f8f5a',.85)+dot(x-40,y-95,35,'#3f8f5a',.85)+dot(x+40,y-95,35,'#3f8f5a',.85)));
}
function bar(x,base,frac,{w=90,hmax=260,color=LIVE,g=1,top='',bot=''}={}){
 const h=frac*hmax;return fade(g,rect(x-w/2,base-h,w,h,{fill:color,fo:.45,stroke:color,rx:4})+(top?label(top,x,base-h-14,{size:28,color,anchor:'middle',weight:700}):'')+(bot?label(bot,x,base+36,{size:26,color:TC,anchor:'middle',weight:700}):''));
}
const jp=(s,x,y,o={})=>label(s,x,y,{size:34,color:C.ink,anchor:'middle',weight:700,...o});
// formula in words: 残りの数 ＝ 最初の数 × (½)^(t/T)
export function wordFormula(x,y,{g=1,size=34}={}){
 return fade(g,jp('残りの数',x,y,{size,color:LIVE,anchor:'end'})+TX('=',x+30,y-size*.3+2,{size:size*1.2})+jp('最初の数',x+60,y,{size,anchor:'start'})+TX(`\\times\\left(${cs(HC,HALF)}\\right)^{${tt}/${Tt}}`,x+60+size*4.2,y-size*.3,{size:size*1.3,anchor:'start'}));
}
export function days(p,n){
 const X=d=>170+d*36;let s=line(X(0),300,X(8*n+1),300,{color:C.dim,w:3});
 const tops=['1','1/2','1/4','1/8'];
 for(let i=0;i<=n;i++){const d=8*i,g=i<n?1:seg(p,.1,.3);s+=line(X(d),285,X(d),315,{color:TC,w:3})+label(`${d} 日`,X(d),355,{size:28,color:TC,anchor:'middle',weight:700});
  s+=bar(X(d),280,1/2**i,{hmax:180,w:64,top:tops[i],g:i<n?1:seg(p,.1,.3)});
  if(i>0)s+=fade(i<n?1:seg(p,.1,.3),TX(`\\times${cs(HC,HALF)}`,X(d-4),200,{size:34}));}
 s+=fade(seg(p,.6,.75),label(n===2?'4分の1':'8分の1',600,450,{size:36,color:HC,anchor:'middle',weight:700}));
 return s;
}
const smallRuns=[sim(101,10),sim(202,10),sim(303,10)];
const SIMT=(p,a,b,t0,t1)=>mix(t0,t1,seg(p,a,b));

export const hsANucleus2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q1']:(p)=>{
  let s=nucBalls(330,260,C12,{r:26});
  s+=card(640,130,500,200,label('1個の 核',890,200,{size:30,color:C.ink,anchor:'middle'})+label('いつ 崩壊？ → 決まらない',890,275,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.faint);
  return s;
 },
 [K+'q2']:(p)=>grid(RUN1,0,{g:seg(p,.02,.2)})+card(720,140,420,200,label('たくさんの 核は',930,210,{size:30,color:C.ink,anchor:'middle'})+label('どんな 決まりで 減る？',930,285,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi),
 [K+'plan']:(p)=>card(150,70,900,150,label('今回',600,120,{size:28,color:C.dim,anchor:'middle'})+label('残りの 数を 表に して 数える',600,190,{size:40,color:LIVE,anchor:'middle',weight:700}),seg(p,.05,.2),LIVE)
  +card(300,270,600,130,label('掛け算 だけで 決まりが 見える',600,347,{size:32,color:HC,anchor:'middle',weight:700}),seg(p,.5,.65),HC),
 // ================= S2 核は年をとらない =================
 [K+'k1']:(p)=>{
  let s='';for(let i=0;i<5;i++){const x=160+i*220,g=seg(p,.02+i*.05,.15+i*.05);s+=nucBalls(x,200,C12,{r:12,g});s+=fade(g,rect(x-55,290,110,60,{fill:HC,fo:.12,stroke:HC,rx:8})+label('くじ',x,330,{size:26,color:HC,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.5,.65),label('同じ 長さの 時間 → 同じ 確率で 崩壊',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'k2']:(p)=>{
  let s=card(80,70,480,330,label('できた ばかりの 核',320,125,{size:30,color:C.ink,anchor:'middle',weight:700})+nucBalls(320,240,C12,{r:16}),1,C.faint);
  s+=card(640,70,480,330,label('ずっと 前から ある 核',880,125,{size:30,color:C.ink,anchor:'middle',weight:700})+nucBalls(880,240,C12,{r:16}),seg(p,.1,.25),C.faint);
  s+=fade(seg(p,.3,.45),label('崩壊の 確率は 同じ',320,370,{size:28,color:HC,anchor:'middle',weight:700})+label('崩壊の 確率は 同じ',880,370,{size:28,color:HC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('核は 年を とらない',600,470,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'k3']:(p)=>tag('実験で 確かめられた 性質',600,140,{color:C.hi,size:32,g:seg(p,.05,.2)})+card(250,230,700,130,label('→ ここから 減り方を 導く',600,310,{size:36,color:LIVE,anchor:'middle',weight:700}),seg(p,.5,.65),LIVE),
 [K+'k4']:(p)=>{const tau=SIMT(p,.35,.98,0,.35);return grid(RUN1,tau)+counter(RUN1,tau,{g:seg(p,.05,.2)});},
 [K+'k5']:(p)=>{
  const tau=SIMT(p,.02,.55,.35,1);
  let s=grid(RUN1,tau)+counter(RUN1,tau);
  s+=card(720,370,420,110,label('この 時間 ＝ 半減期',890,438,{size:30,color:C.ink,anchor:'middle',weight:700})+TX(Tt,1080,445,{size:52}),seg(p,.6,.75),TC);
  return s;
 },
 [K+'k6']:(p)=>{
  const tau=SIMT(p,.08,.6,0,1);
  let s=grid(RUN2,tau)+counter(RUN2,tau,{title:'2回目'});
  s+=fade(seg(p,.65,.8),label(`1回目は ${alive(RUN1,1)} 個`,930,400,{size:28,color:C.dim,anchor:'middle',weight:700})+label('どちらも 約 500 個',930,460,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'k7']:(p)=>{
  let s=fade(.45,grid(RUN2,1));
  s+=tag('定義',600,120,{color:C.hi,size:28,g:seg(p,.4,.55)});
  s+=card(150,170,900,200,label('半減期 T',600,240,{size:36,color:TC,anchor:'middle',weight:700})+label('残りの 数の 平均が 半分に なる 時間',600,315,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),TC);
  return s;
 },
 // ================= S3 表で数える =================
 [K+'h1']:(p)=>htable({reveal:[1,1,seg(p,.2,.35),0],q:1,hl:[2]})+card(780,130,360,170,label('次の T で',960,195,{size:30,color:C.ink,anchor:'middle'})+label('また 500 個？',960,260,{size:36,color:BAD,anchor:'middle',weight:700}),seg(p,.5,.65),BAD),
 [K+'h2']:(p)=>{
  const tau=SIMT(p,.45,.95,1,2);
  return grid(RUN1,tau,{hl:2})+counter(RUN1,tau)+fade(seg(p,.05,.2),label('残った 500 個も 最初と 同じ 状況',600,465,{size:30,color:C.hi,anchor:'middle',weight:700}));
 },
 [K+'h3']:(p)=>htable({reveal:[1,1,seg(p,.2,.3),seg(p,.3,.4)],hl:[1,2,3].filter(i=>seg(p,.5,.6)>.5)})+fade(seg(p,.6,.75),label('残った 数の 半分ずつ',920,280,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'h4']:(p)=>hgraph({o:{...GA,x:150,w:900},pts:2,curve:0,lin:seg(p,.05,.25)})+fade(seg(p,.55,.7),label('2T でも 250 個',150+2/4.3*900+20,440-250/1100*340-20,{size:28,color:HC,weight:700})),
 [K+'h5']:(p)=>hgraph({o:{...GA,x:150,w:900},pts:4,curve:seg(p,.05,.5)})+fade(seg(p,.6,.75),label('だんだん ゆっくり',900,200,{size:32,color:LIVE,anchor:'middle',weight:700})),
 // ================= S4 掛け算で書く =================
 [K+'m1']:(p)=>{
  let s=htable({dec:0,x:200});
  for(let i=0;i<3;i++)s+=fade(seg(p,.3+i*.12,.42+i*.12),arrow(590,152+i*62,590,198+i*62,{color:HC,w:3,head:12})+TX(`\\times${cs(HC,HALF)}`,650,190+i*62,{size:34}));
  return s;
 },
 [K+'m2']:(p)=>fcard(150,70,900,150,`2${Tt}:\\ \\left(${cs(HC,HALF)}\\right)^2=\\tfrac{1}{4}`,{size:56,col:HC,g:seg(p,.05,.2)})
  +fcard(150,270,900,150,`3${Tt}:\\ \\left(${cs(HC,HALF)}\\right)^3=\\tfrac{1}{8}`,{size:56,col:HC,g:seg(p,.5,.65)}),
 [K+'m3']:(p)=>{
  let s=card(100,60,1000,150,label('時間 t の 間に、半減期は',470,148,{size:32,color:C.ink,anchor:'middle',weight:700})+TX(`${tt}/${Tt}`,800,155,{size:50})+label('回',880,148,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15),TC);
  s+=card(100,260,1000,170,wordFormula(560,360,{size:36}),seg(p,.45,.6),LIVE);
  return s;
 },
 [K+'m4']:(p)=>{
  let s=fade(.5,wordFormula(560,90,{size:30}));
  s+=card(150,160,900,140,label('教科書',260,240,{size:28,color:C.dim,anchor:'middle'})+TX(`N=N_0\\left(${HALF}\\right)^{${tt}/${Tt}}`,640,250,{size:52}),seg(p,.05,.2),C.faint);
  s+=fade(seg(p,.5,.65),label('中性子の 数 N（前回）と 区別 → この 動画は 言葉で',600,380,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m5']:(p)=>{
  const X=d=>200+d*45;let s=line(X(0),300,X(17),300,{color:C.dim,w:3});
  [0,8,16].forEach((d,i)=>{s+=fade(seg(p,.05+i*.1,.2+i*.1),line(X(d),285,X(d),315,{color:TC,w:3})+label(`${d} 日`,X(d),355,{size:28,color:TC,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.05,.2),label('半減期 8 日',600,110,{size:34,color:TC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('残りは 最初の 何分の1？',X(16),240,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m6']:(p)=>days(p,2),
 [K+'m6b']:(p)=>days(p,3),
 [K+'h3b']:(p)=>hgraph({o:{...GA,x:150,w:900},pts:3,curve:1})+fade(seg(p,.1,.25),label('？',150+4/4.3*900,440-62.5/1100*340-30,{size:44,color:C.hi,anchor:'middle',weight:700})),
 [K+'h3c']:(p)=>hgraph({o:{...GA,x:150,w:900},pts:4,curve:1})+fade(seg(p,.05,.2),label('62.5 個（平均）',150+4/4.3*900-10,440-62.5/1100*340-34,{size:30,color:HC,anchor:'middle',weight:700})),
 [K+'f4b']:(p)=>card(150,90,900,170,TX(`0.71\\times0.71\\approx0.50`,600,190,{size:60}),seg(p,.05,.2),OK)+fade(seg(p,.5,.65),label('ちょうど 半分 → 合う',600,350,{size:36,color:OK,anchor:'middle',weight:700})),
 [K+'c1b']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=tree(280,420);
  for(let i=0;i<3;i++){const u=(t*.4+i/3)%1;s+=fade(seg(p,.05,.2),arrow(120+u*30,120+u*120,150+u*30,150+u*120,{color:C.x,w:3,head:10}));}
  s+=fade(seg(p,.05,.2),label('空気から 炭素を 取り込む',280,70,{size:26,color:C.x,anchor:'middle',weight:700})+label('割合 ほぼ 一定',280,480,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),tree(850,420,{dead:1})+label('切られた 木：取り込まない',850,250,{size:26,color:C.ink,anchor:'middle',weight:700})+label('炭素14 は 減る 一方',850,480,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m7']:(p)=>card(150,100,420,260,label('16分の1',360,215,{size:44,color:BAD,anchor:'middle',weight:700})+cross(360,200,70,seg(p,.1,.25)),seg(p,.02,.15),BAD)
  +card(630,100,420,260,label('4分の1',840,215,{size:44,color:OK,anchor:'middle',weight:700})+okMark(840,300,1),seg(p,.45,.6),OK)
  +fade(seg(p,.6,.75),label('半減期 ごとに 掛け算で 半分',600,440,{size:34,color:C.hi,anchor:'middle',weight:700})),
 // ================= S5 半端な時間 =================
 [K+'f1']:(p)=>{
  let s=bar(250,400,1,{top:'1',bot:'0'})+bar(850,400,.5,{top:'1/2',bot:'T'});
  s+=fade(seg(p,.05,.2),rect(505,140,90,260,{fill:'none',fo:0,stroke:C.dim,rx:4})+label('？',550,280,{size:50,color:C.hi,anchor:'middle',weight:700})+label('T/2',550,436,{size:26,color:TC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),rect(505,400-.75*260,90,2,{fill:BAD,fo:1,stroke:BAD})+label('3/4 ？',620,400-.75*260+8,{size:28,color:BAD,weight:700}));
  return s;
 },
 [K+'f2']:(p)=>{
  let s=bar(250,400,1,{top:'1',bot:'0'})+bar(550,400,.71,{top:'',bot:'T/2',color:LIVE,g:.6})+bar(850,400,.5,{top:'1/2',bot:'T'});
  s+=fade(seg(p,.3,.45),arrow(310,110,490,110,{color:HC,w:4,head:14})+TX(`\\times\\square`,400,90,{size:40,color:HC})+arrow(610,110,790,110,{color:HC,w:4,head:14})+TX(`\\times\\square`,700,90,{size:40,color:HC}));
  s+=fade(seg(p,.3,.45),label('前半',400,150,{size:24,color:C.dim,anchor:'middle'})+label('後半',700,150,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('同じ 数',1040,110,{size:30,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'f3']:(p)=>{
  let s=fcard(250,50,700,140,`\\square\\times\\square=${cs(HC,HALF)}`,{size:60,col:HC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.35,.5),arrow(600,205,600,245,{color:C.hi,w:4,head:14}));
  s+=fcard(250,260,700,160,`\\square=\\dfrac{1}{\\sqrt{2}}\\approx0.71`,{size:60,col:HC,g:seg(p,.45,.6)});
  return s;
 },
 [K+'f4']:(p)=>card(150,90,900,170,TX(`0.75\\times0.75=0.5625`,600,190,{size:60}),seg(p,.05,.2),BAD)
  +fade(seg(p,.5,.65),label('0.5 より 多い → 合わない',600,340,{size:36,color:BAD,anchor:'middle',weight:700}))
  ,
 [K+'f5']:(p)=>{
  let s=fcard(60,60,500,150,`\\left(${HALF}\\right)^{${HALF}}=\\dfrac{1}{\\sqrt2}`,{size:50,col:HC,g:seg(p,.05,.2)});
  s+=tag('数学Ⅱ の 指数',310,270,{color:C.ink,size:26,g:seg(p,.05,.2)});
  s+=hgraph({pts:4,curve:1,half:seg(p,.45,.6)});
  s+=fade(seg(p,.6,.75),wordFormula(150,400,{size:24}));
  return s;
 },
 // ================= S6 年代を測る =================
 [K+'c1']:(p)=>tree(300,420)+card(560,140,560,200,label('炭素14 の 半減期',840,215,{size:32,color:C.ink,anchor:'middle',weight:700})+label('約 5730 年',840,290,{size:44,color:TC,anchor:'middle',weight:700}),seg(p,.1,.25),TC),
 [K+'c2']:(p)=>{
  let s=tree(200,420)+label('生きている 木',200,470,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),tree(560,420,{dead:1})+label('遺跡の 木',560,470,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=bar(850,420,1,{w:80,hmax:280,top:'1',bot:''})+bar(1010,420,.25,{w:80,hmax:280,top:'1/4',g:seg(p,.1,.25)});
  s+=fade(seg(p,.1,.25),label('生きている',850,460,{size:22,color:C.dim,anchor:'middle'})+label('遺跡',1010,460,{size:22,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),TX(`\\tfrac14=\\left(${cs(HC,HALF)}\\right)^2`,380,100,{size:44}));
  return s;
 },
 [K+'c3']:(p)=>fade(.6,TX(`\\tfrac14=\\left(${cs(HC,HALF)}\\right)^2`,600,80,{size:40})+label('半減期 2 回ぶん',600,145,{size:28,color:C.ink,anchor:'middle',weight:700}))
  +fcard(200,190,800,150,`5730\\times2=11460`,{size:56,col:TC,g:seg(p,.05,.2)})
  +fade(seg(p,.5,.65),label('約 11460 年前に 切られた 木',600,430,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'c4']:(p)=>{
  let s=fade(seg(p,.02,.15),label('10 個 だけ なら（時間 T のとき）',600,60,{size:30,color:C.ink,anchor:'middle',weight:700}));
  smallRuns.forEach((run,k)=>{const x0=150+k*340,g=seg(p,.1+k*.1,.25+k*.1);
   s+=grid(run,1,{x0,y0:180,dx:52,dy:60,cols:5,r:14,g});
   s+=fade(g,label(`残り ${alive(run,1)} 個`,x0+104,360,{size:30,color:LIVE,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.55,.7),label('平均の 5 個の まわりで ばらつく',600,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e1']:(p)=>htable({dec:0,x:120,y:90})+hgraph({pts:4,curve:1,g:seg(p,.05,.2)})+fade(seg(p,.5,.65),label('T ごとに ×½',290,440,{size:32,color:HC,anchor:'middle',weight:700})),
 [K+'x']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=nucBalls(300,260,C12,{r:24});
  s+=fade(seg(p,.05,.2),wavy(420,230,640,150,{color:HC,amp:9,lam:30,ph:t*1.5,w:4,head:16})+label('エネルギー',560,120,{size:28,color:C.E,anchor:'middle',weight:700}));
  s+=card(680,90,470,140,label('エネルギーは どこから？',915,175,{size:32,color:C.E,anchor:'middle',weight:700}),seg(p,.1,.25),C.E);
  s+=card(680,280,470,140,label('前と 後で 何が 減る？',915,365,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'bye']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  return nucBalls(300,260,C12,{r:24})+wavy(420,230,640,150,{color:HC,amp:9,lam:30,ph:t*1.5,w:4,head:16})+card(680,90,470,140,label('エネルギーは どこから？',915,175,{size:32,color:C.E,anchor:'middle',weight:700}),1,C.E)+card(680,280,470,140,label('前と 後で 何が 減る？',915,365,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
 },
};
