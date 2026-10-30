// 高校編「物質波とボーア模型・深く学ぶ 3/3」(ys-hs-a-bohr-3) — 図。Stage 1200×515.
// クーロン力＝向心力（仮定）と量子条件から r＝n²h²/(4π²mke²)、E＝−ke²/(2r)＝−13.6 eV/n²、3→2 で 656 nm。
// 色：力 F 緑、v 紫、エネルギー（K・U・E）橙、n 黄、r 白、電荷 e 桃、電子 青、原子核 赤、赤い光 #ff5a5a。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp,mix} from './anim.mjs';
import {card,tag,electron,LC,VC,PC,EC,NEG,POS,NC,RC,BAD,OK,cs,lam,vt,rt,nt,Et,Kt,U,TX,fcard,cross,okMark,nucleus,wave,span,ladder,ladderY,atomOrbit,ringWave,jt,photon} from './yt1-hs-a-bohr-1-diagrams.mjs';

const K='hs-a-bohr-3:';
const PI=Math.PI;
const sceneT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
const RED='#ff5a5a', FC=C.F;
const et=cs(PC,'e'), Ut=cs(EC,'U');
const ke2=`k${et}^2`;
const FORCE=`\\dfrac{${ke2}}{${rt}^2}=\\dfrac{m${vt}^2}{${rt}}`;
const QC=`m${vt}${rt}=\\dfrac{${nt}h}{2\\pi}`;
const RN=`${rt}=\\dfrac{${nt}^2h^2}{4\\pi^2mk${et}^2}`;
const EN=`${Et}=-\\dfrac{${ke2}}{2${rt}}`;
const prev=(src,g=.7)=>fade(g,TX(src,600,78,{size:40}));
function stepNote(t,y,g,col=C.hi){return fade(g,label(t,600,y,{size:28,color:col,anchor:'middle',weight:700})+arrow(600,y+14,600,y+52,{color:col,w:4,head:14}));}
const LV=[{E:0,text:'0',color:C.dim},{E:-1.51,text:'n＝3　−1.51 eV'},{E:-3.40,text:'n＝2　−3.40 eV'},{E:-13.6,text:'n＝1　−13.6 eV'}];
const LO={x:560,w:260,ytop:70,ybot:450,Emax:0,Emin:-14};
function levels({g=1,hl=-1,o=LO,size=26}={}){return ladder(LV,{...o,g,hl,size});}
function rings3({cx=260,cy=262,s=20,g=[1,1,1],lab=1}={}){
 let out='';[1,4,9].forEach((m,i)=>{out+=fade(g[i],ring(cx,cy,s*m,{color:[C.hi,'#ffd27a','#ffb36b'][i],w:3,dash:i?'8 6':''}));
  if(lab)out+=fade(g[i]*lab,label(['r₁','4r₁','9r₁'][i]?['1','4','9'][i]:'',cx+s*m*.72+6,cy-s*m*.72-6,{size:24,color:C.ink,weight:700}));});
 return out+nucleus(cx,cy,{r:8});
}
// energy bars: K (+1 unit), U (−2 units), total (−1)
function bars({gK=1,gU=1,gE=1,unit=70,y0=230}={}){
 const xs=[300,520,800];let s=line(180,y0,960,y0,{color:C.dim,w:2.5})+label('0',165,y0+9,{size:26,color:C.dim,anchor:'end'});
 s+=fade(gK,rect(xs[0]-50,y0-unit,100,unit,{fill:EC,fo:.55,stroke:EC,rx:4})+TX(`\\dfrac{${ke2}}{2${rt}}`,xs[0],y0-unit-34,{size:32})+label('運動',xs[0],y0+36,{size:24,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(gU,rect(xs[1]-50,y0,100,2*unit,{fill:EC,fo:.25,stroke:EC,rx:4})+TX(`-\\dfrac{${ke2}}{${rt}}`,xs[1],y0+2*unit+44,{size:32})+label('位置',xs[1],y0-16,{size:24,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(gE,rect(xs[2]-50,y0,100,unit,{fill:C.hi,fo:.4,stroke:C.hi,rx:4})+TX(`-\\dfrac{${ke2}}{2${rt}}`,xs[2],y0+unit+44,{size:32,color:C.hi})+label('合計 E',xs[2],y0-16,{size:24,color:C.hi,anchor:'middle',weight:700}));
 return s;
}
function spectrum(g=1,{mark=0}={}){
 const x0=200,x1=1000,y=300,h=60,lo=400,hi=700,X=nm=>x0+(nm-lo)/(hi-lo)*(x1-x0);
 let s='<defs><linearGradient id="spc" x1="0" x2="1"><stop offset="0" stop-color="#7a3cff"/><stop offset=".2" stop-color="#3c6cff"/><stop offset=".4" stop-color="#3cd0ff"/><stop offset=".55" stop-color="#4cff6a"/><stop offset=".7" stop-color="#ffee3c"/><stop offset=".83" stop-color="#ff8a3c"/><stop offset="1" stop-color="#ff2c2c"/></linearGradient></defs>';
 s+=`<rect x="${x0}" y="${y}" width="${x1-x0}" height="${h}" fill="url(#spc)" opacity=".35"/>`;
 [400,500,600,700].forEach(nm=>s+=label(`${nm} nm`,X(nm),y+h+34,{size:24,color:C.dim,anchor:'middle'}));
 s+=fade(mark,rect(X(656)-4,y-20,8,h+40,{fill:RED,fo:1,stroke:'none',rx:2})+label('656 nm',X(656),y-34,{size:28,color:RED,anchor:'middle',weight:700}));
 return fade(g,s);
}

export const hsABohr3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx),a=.6+t*.4,ex=330+170*Math.cos(a),ey=262-170*Math.sin(a);
  let s=atomOrbit(330,262,170,{ang:a})+arrow(ex,ey,ex+(330-ex)*.4,ey+(262-ey)*.4,{color:FC,w:7,head:18});
  s+=card(640,90,500,320,label('量子条件 ＋ クーロン力',890,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('半径は？',890,250,{size:40,color:RC,anchor:'middle',weight:700})+label('エネルギーは？',890,330,{size:40,color:EC,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'q2']:(p)=>ladder([{E:0,text:'0 eV',color:C.dim},{E:-1.51,text:'−1.51 eV'},{E:-3.40,text:'−3.40 eV'}],{x:200,w:360,ytop:90,ybot:440,Emax:0,Emin:-4})+card(760,150,400,210,label('どこから',960,225,{size:30,color:C.ink,anchor:'middle'})+label('来る？',960,305,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi),
 [K+'plan']:(p)=>fcard(100,80,440,150,QC,{size:50,col:C.hi,g:seg(p,.05,.2)})+card(660,80,440,150,label('クーロン力',880,170,{size:36,color:FC,anchor:'middle',weight:700}),seg(p,.15,.3),FC)+fade(seg(p,.4,.55),arrow(320,250,560,320,{color:C.ink,w:3,head:12})+arrow(880,250,640,320,{color:C.ink,w:3,head:12}))+card(350,330,500,120,label('半径 と エネルギー',600,402,{size:34,color:EC,anchor:'middle',weight:700}),seg(p,.5,.65),EC),
 // ================= S2 力の式と組み合わせる =================
 [K+'f1']:(p)=>{
  let s=nucleus(400,262,{r:24,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('陽子',400,180,{size:28,color:POS,anchor:'middle',weight:700})+TX(`+${et}`,400,340,{size:40}));
  s+=electron(800,262,{r:16,op:seg(p,.45,.6)})+fade(seg(p,.45,.6),label('電子',800,180,{size:28,color:NEG,anchor:'middle',weight:700})+TX(`-${et}`,800,340,{size:40}));
  return s;
 },
 [K+'f2']:(p)=>{
  let s=nucleus(400,262,{r:24})+electron(800,262,{r:16});
  s+=arrow(780,262,660,262,{color:FC,w:7,head:18,g:seg(p,.05,.2)})+arrow(426,262,546,262,{color:FC,w:7,head:18,g:seg(p,.05,.2)});
  s+=fade(seg(p,.1,.25),line(400,340,800,340,{color:RC,w:2})+label('r',600,375,{size:30,color:RC,anchor:'middle',weight:700}));
  s+=fcard(380,60,440,150,`${cs(FC,'F')}=\\dfrac{${ke2}}{${rt}^2}`,{size:50,col:FC,g:seg(p,.4,.55)});
  s+=fade(seg(p,.7,.85),label('（電場と クーロンの 法則）',600,450,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'f3']:(p)=>fcard(380,90,440,160,`${cs(FC,'F')}=\\dfrac{m${vt}^2}{${rt}}`,{size:54,col:FC,g:seg(p,.05,.2)})+fade(seg(p,.3,.45),label('円運動に 必要な 中心向きの 力（円運動の 単元）',600,320,{size:28,color:C.ink,anchor:'middle',weight:700})),
 [K+'f4']:(p)=>{
  let s=fcard(280,70,640,170,FORCE,{size:56,col:FC,g:seg(p,.3,.45)});
  s+=fade(seg(p,.45,.6),label('クーロン力',470,290,{size:28,color:FC,anchor:'middle',weight:700})+label('必要な 向心力',740,290,{size:28,color:FC,anchor:'middle',weight:700}));
  s+=tag('仮定（ボーア模型）',600,380,{color:C.hi,size:28,g:seg(p,.05,.2)});
  return s;
 },
 [K+'f5']:(p)=>{
  let s=fcard(100,80,460,160,FORCE,{size:46,col:FC})+label('①',80,175,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fcard(660,80,460,160,QC,{size:46,col:C.hi,g:seg(p,.1,.25)})+fade(seg(p,.1,.25),label('②',640,175,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(300,310,600,120,label('分からない もの：',520,382,{size:30,color:C.ink,anchor:'end',weight:700})+TX(`${vt},\\quad ${rt}`,640,378,{size:44,anchor:'start'}),seg(p,.55,.7));
  return s;
 },
 [K+'f6']:(p)=>{
  const c=seg(p,.35,.5);
  let s=prev(FORCE)+stepNote('① の 両辺に r を 掛ける',150,seg(p,.05,.2));
  s+=fcard(300,230,600,170,c<.5?`\\dfrac{${ke2}}{${rt}^2}\\times ${rt}=\\dfrac{m${vt}^2}{${rt}}\\times ${rt}`:`\\dfrac{${ke2}}{${rt}^{\\cancel{2}}}\\times \\cancel{${rt}}=\\dfrac{m${vt}^2}{\\cancel{${rt}}}\\times\\cancel{${rt}}`,{size:46,col:C.hi,g:seg(p,.2,.35)});
  s+=fade(seg(p,.6,.75),TX(`\\dfrac{${ke2}}{${rt}}=m${vt}^2`,600,470,{size:46}));
  return s;
 },
 [K+'f7']:(p)=>prev(QC)+stepNote('② の 両辺を mr で 割る',150,seg(p,.05,.2))+fcard(330,240,540,170,`${vt}=\\dfrac{${nt}h}{2\\pi m${rt}}`,{size:56,col:VC,g:seg(p,.3,.45)}),
 [K+'f8']:(p)=>{
  let s=fade(.7,TX(`\\dfrac{${ke2}}{${rt}}=m${vt}^2`,330,90,{size:40})+TX(`${vt}=\\dfrac{${nt}h}{2\\pi m${rt}}`,870,90,{size:40}));
  s+=fade(seg(p,.15,.3),arrow(800,150,520,240,{color:VC,w:4,head:14})+label('v に 代入',700,230,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=fcard(240,270,720,180,`\\dfrac{${ke2}}{${rt}}=m\\times{\\color{${VC}}\\left(\\dfrac{${nt}h}{2\\pi m${rt}}\\right)}^2`,{size:50,col:VC,g:seg(p,.35,.5)});
  return s;
 },
 [K+'f9']:(p)=>{
  const c=seg(p,.4,.55);
  let s=prev(`\\dfrac{${ke2}}{${rt}}=m\\left(\\dfrac{${nt}h}{2\\pi m${rt}}\\right)^2`,.6);
  s+=fcard(200,160,800,150,c<.5?`\\dfrac{${ke2}}{${rt}}=m\\times\\dfrac{${nt}^2h^2}{4\\pi^2m^2${rt}^2}`:`\\dfrac{${ke2}}{${rt}}=\\cancel{m}\\times\\dfrac{${nt}^2h^2}{4\\pi^2m^{\\cancel{2}}${rt}^2}`,{size:46,col:C.hi,g:seg(p,.05,.2)});
  s+=fcard(300,340,600,150,`\\dfrac{${ke2}}{${rt}}=\\dfrac{${nt}^2h^2}{4\\pi^2m${rt}^2}`,{size:48,col:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'f10']:(p)=>prev(`\\dfrac{${ke2}}{${rt}}=\\dfrac{${nt}^2h^2}{4\\pi^2m${rt}^2}`)+stepNote('両辺に r² を 掛ける',150,seg(p,.05,.2))+fcard(300,240,600,170,`${ke2}${rt}=\\dfrac{${nt}^2h^2}{4\\pi^2m}`,{size:54,col:C.hi,g:seg(p,.3,.45)}),
 [K+'f11']:(p)=>prev(`${ke2}${rt}=\\dfrac{${nt}^2h^2}{4\\pi^2m}`)+stepNote('両辺を ke² で 割る',150,seg(p,.05,.2))+fcard(300,230,600,170,RN,{size:56,col:C.hi,g:seg(p,.3,.45)})+fade(seg(p,.6,.75),label('半径は n² に 比例',600,470,{size:32,color:NC,anchor:'middle',weight:700}))+tag('導いた 結果',990,320,{color:C.hi,g:seg(p,.6,.75)}),
 // ================= S3 半径を計算する =================
 [K+'r1']:(p)=>{
  let s=fcard(80,60,460,170,RN,{size:46,col:C.hi});
  const rows=[`h=6.6\\times10^{-34}${U('J\\cdot s')}`,`m=9.1\\times10^{-31}${U('kg')}`,`k=9.0\\times10^{9}${U('N\\cdot m^2/C^2')}`,`${et}=1.6\\times10^{-19}${U('C')}`];
  s+=card(600,40,560,420,'',seg(p,.2,.3));
  rows.forEach((r,i)=>s+=fade(seg(p,.25+i*.1,.35+i*.1),TX(r,640,120+i*95,{size:38,anchor:'start'})));
  s+=fade(seg(p,.1,.25),TX(`${nt}=1`,310,320,{size:46}));
  return s;
 },
 [K+'r2']:(p)=>prev(RN,.6)+fcard(160,170,880,160,`${rt}=\\dfrac{(6.6\\times10^{-34})^2}{4\\pi^2\\times9.1\\times10^{-31}\\times9.0\\times10^{9}\\times(1.6\\times10^{-19})^2}`,{size:36,col:C.ink,g:seg(p,.02,.15)})+fcard(240,360,720,120,`${rt}\\approx5.26\\times10^{-11}\\approx5.3\\times10^{-11}${U('m')}`,{size:44,col:C.hi,g:seg(p,.3,.45)}),
 [K+'r3']:(p)=>{
  let s=rings3({cx:300,cy:262,s:24,g:[1,seg(p,.1,.3),seg(p,.35,.55)],lab:0});
  s+=fade(1,label('n＝1',300,262-24-10,{size:22,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3),label('n＝2',300,262-96-10,{size:24,color:'#ffd27a',anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.55),label('n＝3',300,262-216+30,{size:24,color:'#ffb36b',anchor:'middle',weight:700}));
  s+=card(620,150,500,200,label('半径の 比',870,215,{size:30,color:C.ink,anchor:'middle',weight:700})+label('1 ： 4 ： 9',870,295,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'r4']:(p)=>{
  let s='';for(let k=6;k>=1;k--)s+=dot(330,250,110*k/6+10,'#8fa3c4',.1);
  s=s+nucleus(330,250,{r:10})+ring(330,250,110,{color:C.hi,w:2,dash:'6 6'});
  s+=span(220,440,410,{color:C.ink,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),jt('直径 約',`1.1\\times10^{-10}${U('m')}`,330,456));
  s+=card(640,170,500,160,label('水素原子の 大きさ',890,235,{size:30,color:C.ink,anchor:'middle',weight:700})+label('＝ 計算で 説明できる',890,290,{size:30,color:OK,anchor:'middle',weight:700}),seg(p,.5,.65),OK);
  return s;
 },
 // ================= S4 エネルギーを計算する =================
 [K+'e1']:(p)=>fcard(260,100,680,160,`${Et}=${Kt}+${Ut}`,{size:60,col:EC,g:seg(p,.05,.2)})+fade(seg(p,.4,.55),label('運動エネルギー',550,320,{size:28,color:EC,anchor:'middle',weight:700})+label('位置エネルギー',800,320,{size:28,color:EC,anchor:'middle',weight:700})),
 [K+'e2']:(p)=>prev(`\\dfrac{${ke2}}{${rt}}=m${vt}^2`)+stepNote('両辺を 2 で 割る',150,seg(p,.05,.2))+fcard(300,240,600,170,`${Kt}=\\tfrac{1}{2}m${vt}^2=\\dfrac{${ke2}}{2${rt}}`,{size:52,col:EC,g:seg(p,.3,.45)}),
 [K+'e3']:(p)=>{
  let s=fcard(60,60,500,150,`${Ut}=-\\dfrac{${ke2}}{${rt}}`,{size:52,col:EC,g:seg(p,.05,.2)});
  const x0=640,x1=1140,y0=150,pts=[];for(let x=x0+30;x<=x1;x+=4){const r=(x-x0)/(x1-x0);pts.push([x,y0+Math.min(320,22/r)]);}
  s+=fade(seg(p,.3,.45),line(x0,y0,x1,y0,{color:C.dim,w:2.5})+line(x0,y0-40,x0,480,{color:C.dim,w:2.5})+label('0',x0-12,y0+9,{size:24,color:C.dim,anchor:'end'})+label('r',x1+10,y0+9,{size:28,color:RC,weight:700})+label('U',x0-14,480,{size:28,color:EC,anchor:'end',weight:700}));
  s+=fade(seg(p,.35,.55),draw(pts,1,{color:EC,w:4}));
  s+=fade(seg(p,.55,.7),label('遠い 所 → 0',x1,y0-18,{size:24,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'e4']:(p)=>fcard(60,60,500,150,`${Ut}=-\\dfrac{${ke2}}{${rt}}`,{size:52,col:EC})+tag('導かずに 結果だけ 使う',310,270,{color:C.hi,size:28,g:seg(p,.3,.45)})+card(640,90,500,200,label('電場の 単元',890,155,{size:28,color:C.dim,anchor:'middle'})+label('一様な 電場 だけ',890,225,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2)),
 [K+'e5']:(p,ctx)=>{
  const x0=640,x1=1140,y0=150,pts=[];for(let x=x0+30;x<=x1;x+=4){const r=(x-x0)/(x1-x0);pts.push([x,y0+Math.min(320,22/r)]);}
  let s=fcard(60,60,500,150,`${Ut}=-\\dfrac{${ke2}}{${rt}}`,{size:52,col:EC});
  s+=line(x0,y0,x1,y0,{color:C.dim,w:2.5})+line(x0,y0-40,x0,480,{color:C.dim,w:2.5})+label('0',x0-12,y0+9,{size:24,color:C.dim,anchor:'end'})+draw(pts,1,{color:EC,w:4});
  const u=1-seg(p,.15,.7),xr=x0+40+u*420,yr=y0+Math.min(320,22/((xr-x0)/(x1-x0)));
  s+=dot(xr,yr,10,C.hi)+fade(seg(p,.15,.3),arrow(xr+50,yr-40,xr+10,yr-10,{color:C.hi,w:3,head:10}));
  s+=card(60,260,500,160,label('近づく ほど 下がる',310,325,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 0 より 低い（負）',310,380,{size:30,color:EC,anchor:'middle',weight:700}),seg(p,.5,.65),EC);
  return s;
 },
 [K+'e6']:(p)=>fade(.8,TX(`${Et}=\\dfrac{${ke2}}{2${rt}}-\\dfrac{${ke2}}{${rt}}`,600,70,{size:42}))+bars({gK:seg(p,.1,.25),gU:seg(p,.3,.45),gE:0}),
 [K+'e7']:(p)=>fade(.8,TX(`${Et}=\\dfrac{${ke2}}{2${rt}}-\\dfrac{${ke2}}{${rt}}=${EN.slice(EN.indexOf('=')+1)}`,600,70,{size:42}))+bars({gE:seg(p,.2,.35)})+tag('導いた 結果',1060,300,{color:C.hi,g:seg(p,.5,.65)}),
 [K+'e8']:(p)=>{
  let s=fcard(60,60,480,150,EN,{size:52,col:C.hi});
  const y0=170;s+=line(640,y0,1120,y0,{color:C.dim,w:3})+label('E ＝ 0：離れられる',1120,y0-16,{size:26,color:C.dim,anchor:'end',weight:700});
  s+=line(640,400,1120,400,{color:EC,w:5})+label('E ＜ 0：捕まっている',1120,440,{size:26,color:EC,anchor:'end',weight:700});
  s+=electron(880,400,{r:14,op:1-seg(p,.55,.95)*.0});
  s+=arrow(880,385,880,y0+10,{color:C.hi,w:4,head:14,g:seg(p,.5,.7)});
  s+=fade(seg(p,.55,.7),label('エネルギーを 与える',900,290,{size:24,color:C.hi,weight:700}));
  return s;
 },
 // ================= S5 エネルギー準位 =================
 [K+'l1']:(p)=>fcard(100,80,440,150,EN,{size:50,col:C.hi})+fade(seg(p,.2,.35),TX(`${rt}\\propto ${nt}^2`,820,150,{size:50}))+fade(seg(p,.5,.6),arrow(600,270,600,320,{color:C.hi,w:4,head:14}))+fcard(330,330,540,140,`${Et}\\propto -\\dfrac{1}{${nt}^2}`,{size:52,col:EC,g:seg(p,.55,.7)}),
 [K+'l2']:(p)=>prev(EN,.6)+fcard(80,170,1040,170,`${Et}=-\\dfrac{9.0\\times10^{9}\\times(1.6\\times10^{-19})^2}{2\\times5.26\\times10^{-11}}\\approx-2.19\\times10^{-18}${U('J')}`,{size:42,col:EC,g:seg(p,.05,.2)}),
 [K+'l3']:(p)=>fade(.6,TX(`${Et}\\approx-2.19\\times10^{-18}${U('J')}`,600,80,{size:40}))+fcard(170,150,860,150,`\\dfrac{-2.19\\times10^{-18}}{1.6\\times10^{-19}}\\approx-13.7${U('eV')}`,{size:48,col:EC,g:seg(p,.05,.2)})+card(250,340,700,120,label('精密な 定数では',480,410,{size:28,color:C.ink,anchor:'middle',weight:700})+TX(`-13.6${U('eV')}`,760,410,{size:46,color:C.hi}),seg(p,.55,.7),C.hi),
 [K+'l4']:(p)=>fcard(300,140,600,200,`${Et}=-\\dfrac{13.6${U('eV')}}{${nt}^2}`,{size:62,col:EC,g:seg(p,.3,.45)})+fade(seg(p,.05,.2),label('以後は 精密な 値を 使う',600,90,{size:28,color:C.dim,anchor:'middle'})),
 [K+'l5']:(p)=>{
  let s=levels({g:1,o:LO});
  s=fade(1,ladder([LV[0],LV[3]],{...LO}))+fade(seg(p,.1,.25),ladder([LV[2]],{...LO}))+fade(seg(p,.5,.65),ladder([LV[1]],{...LO}));
  s+=fade(seg(p,.05,.2),TX(`-13.6\\div4=-3.40`,1000,300,{size:34}))+fade(seg(p,.45,.6),TX(`-13.6\\div9\\approx-1.51`,1000,370,{size:34}));
  s+=fade(.5,TX(`${Et}=-\\dfrac{13.6}{${nt}^2}`,250,120,{size:40}));
  return s;
 },
 [K+'l6']:(p)=>{
  let s=rings3({cx:250,cy:262,s:24,lab:0})+levels({o:{...LO,x:560,w:200},size:24});
  s+=fade(seg(p,.4,.55),card(860,190,320,230,label('半径',1020,240,{size:26,color:C.ink,anchor:'middle',weight:700})+label('1：4：9',1020,285,{size:34,color:C.hi,anchor:'middle',weight:700})+label('エネルギー',1020,340,{size:26,color:C.ink,anchor:'middle',weight:700})+TX('1:\\tfrac14:\\tfrac19',1020,390,{size:36,color:EC}),1,C.hi));
  return s;
 },
 [K+'l7']:(p)=>{
  let s=levels({o:{...LO,x:120,w:280}});
  s+=card(640,110,520,260,label('✕ 半径が 大きい ほど 低い',900,180,{size:30,color:BAD,anchor:'middle',weight:700})+label('○ 大きい ほど 0 に 近い',900,260,{size:30,color:OK,anchor:'middle',weight:700})+label('＝ 高い',900,320,{size:30,color:OK,anchor:'middle',weight:700}),seg(p,.05,.2),BAD);
  s+=arrow(80,440,80,110,{color:C.hi,w:4,head:14,g:seg(p,.5,.65)})+fade(seg(p,.5,.65),label('高い',80,90,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 赤い光に戻る =================
 [K+'g1']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...LO,x:120,w:240},y3=ladderY(-1.51,o),y2=ladderY(-3.40,o);
  let s=levels({o});
  const u=seg(p,.2,.5);s+=electron(250,mix(y3,y2,u),{r:13});
  s+=arrow(290,y3+6,290,y2-6,{color:C.hi,w:4,head:12,g:seg(p,.2,.35)});
  const f=((t*.6)%1);s+=fade(seg(p,.5,.65),wave(620,1120,300,70,16,{ph:t,color:RED,w:3})+photon(620+500*f,300)+arrow(560,200,640,280,{color:RED,w:3,head:12}));
  s+=fade(seg(p,.6,.75),label('差の エネルギー ＝ 光子 1個',870,390,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'g2']:(p)=>{const o={...LO,x:120,w:240};return fade(.4,levels({o}))+fcard(580,230,580,150,`-1.51-(-3.40)=1.89${U('eV')}`,{size:44,col:EC,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),line(100,ladderY(-1.51,o),100,ladderY(-3.40,o),{color:C.hi,w:6}));},
 [K+'g3']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fcard(150,40,900,170,`${lam}=\\dfrac{hc}{\\Delta ${Et}}=\\dfrac{1240}{1.89}\\approx656${U('nm')}`,{size:50,col:LC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.35,.5),label('光子の エネルギー ＝ 準位の 差 ΔE、hc ≈ 1240 eV·nm',600,250,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),wave(200,1000,370,130,40,{ph:t*.5,color:RED,w:5})+label('656 nm：赤い 光',600,480,{size:30,color:RED,anchor:'middle',weight:700}));
  return s;
 },
 [K+'g4']:(p)=>spectrum(1,{mark:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('水素の 光（線スペクトル）',600,120,{size:30,color:C.ink,anchor:'middle',weight:700}))+card(300,150,600,90,label('計算 656 nm ＝ 実験 656 nm',600,207,{size:30,color:OK,anchor:'middle',weight:700}),seg(p,.4,.55),OK),
 [K+'g5']:(p)=>card(150,80,900,150,label('この 計算が 使えるのは',600,140,{size:28,color:C.dim,anchor:'middle'})+label('電子 1個 だけの 原子（水素型）の 近似',600,195,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi)+tag('限界',600,300,{color:BAD,size:30,g:seg(p,.05,.2)}),
 [K+'g6']:(p)=>{
  let s=card(60,60,520,380,label('説明 できない もの',320,115,{size:28,color:BAD,anchor:'middle',weight:700})+label('電子 2個 以上の 原子',320,210,{size:28,color:C.ink,anchor:'middle',weight:700})+label('スペクトルの 細かい 違い',320,280,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15),BAD);
  s+=card(620,60,520,380,label('電子は 決まった 円を 回らない',880,115,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.65));
  s+=fade(seg(p,.5,.65),atomOrbit(880,280,110,{ang:.8})+cross(880,280,80,1));
  return s;
 },
 [K+'g7']:(p)=>card(200,140,800,200,label('大学編：量子力学',600,215,{size:36,color:C.hi,anchor:'middle',weight:700})+label('波 そのものの 方程式から 準位を 求める',600,285,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi),
 [K+'x1']:(p)=>{
  const z=seg(p,.2,.8);
  let s=fade(1-z,atomOrbit(600,262,170,{ang:.8}));
  const rN=mix(16,90,z);s+=fade(.3+.7*z,ring(600,262,rN,{color:POS,w:3,fill:'#3a1d2a'}));
  s+=fade(seg(p,.7,.9),label('原子の 中心',600,420,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'x2']:(p)=>{
  let s=ring(400,262,90,{color:POS,w:3,fill:'#3a1d2a'})+label('？',400,282,{size:60,color:C.hi,anchor:'middle',weight:700});
  s+=card(620,120,520,240,label('原子核は 何で できている？',880,200,{size:30,color:C.ink,anchor:'middle',weight:700})+label('なぜ 放射線を 出す？',880,280,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'bye']:()=>ring(400,262,90,{color:POS,w:3,fill:'#3a1d2a'})+label('？',400,282,{size:60,color:C.hi,anchor:'middle',weight:700})+card(620,150,520,180,label('次の 単元',880,215,{size:28,color:C.dim,anchor:'middle'})+label('原子核と 放射線',880,285,{size:38,color:C.hi,anchor:'middle',weight:700}),1,C.hi),
};
