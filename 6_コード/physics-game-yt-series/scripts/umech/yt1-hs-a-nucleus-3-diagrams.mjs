// 高校編「原子核と放射線・深く学ぶ 3/3」(ys-hs-a-nucleus-3) — 図。Stage 1200×515.
// 色：エネルギー（E・ΔE）橙、光速 c 紫、質量 m・Δm 白、陽子 赤、中性子 灰、強調 黄。
// 振り返りは高校編の最初の動画（速度 深1/2）の道の帯 strip を読み込んで使う。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp,mix,poly} from './anim.mjs';
import {card,tag,TX,fcard,cs,cross,okMark,nucBalls,proton,neutron,sceneT,wavy,C12} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {strip,SM,PA,PB} from './yt1-hs-m1-velocity-1-diagrams.mjs';

const K='hs-a-nucleus-3:';
export const EC=C.E, CC=C.v, MC=C.ink, HC=C.hi, BAD=C.a, OK=C.F;
export const Et=cs(EC,'E'), ct=cs(CC,'c'), DE=cs(EC,'\\Delta E'), DM=`\\Delta m`;
export const MC2=`${Et}=m${ct}^2`, DMC2=`${DE}=${DM}\\,${ct}^2`;
const U=s=>`\\,\\mathrm{${s}}`;
const P10=(m,e)=>`${m}\\times10^{${e}}`;
export function deuteron(x,y,{r=24,g=1}={}){return fade(g,proton(x-r*.8,y,r)+neutron(x+r*.8,y,r));}
// balance: left pan holds free p + n, right pan the deuteron; tilt u (0..1): right side goes up
export function balance(x,y,{u=0,g=1}={}){
 const a=.07*u,L=280,cx=x,cy=y;
 const lx=cx-L*Math.cos(a),ly=cy-L*Math.sin(a)*-1,rx=cx+L*Math.cos(a),ry=cy+L*Math.sin(a)*-1;
 let s=poly([[cx-40,cy+230],[cx+40,cy+230],[cx,cy]],{fill:'#56627a',fo:1,stroke:C.dim});
 s+=line(lx,ly+0,rx,ry,{color:C.ink,w:5});
 const pan=(px,py)=>line(px,py,px-70,py+90,{color:C.dim,w:2})+line(px,py,px+70,py+90,{color:C.dim,w:2})+line(px-80,py+90,px+80,py+90,{color:C.ink,w:5});
 s+=pan(lx,ly)+pan(rx,ry);
 s+=proton(lx-30,ly+68,20)+neutron(lx+30,ly+68,20);
 s+=deuteron(rx,ry+68,{r:20});
 s+=label('陽子 ＋ 中性子',lx,ly+140,{size:24,color:C.ink,anchor:'middle',weight:700})+label('重水素の 核',rx,ry+140,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
function sun(x,y,R,{g=1,t=0}={}){
 let s='';for(let k=6;k>=1;k--)s+=dot(x,y,R*(1+k*.08),'#ffb36b',.07);
 s+=dot(x,y,R,'#ffb84d',.9)+dot(x,y,R*.35,'#fff2b8',.85);
 for(let i=0;i<12;i++){const a=i*Math.PI/6+t*.2;s+=line(x+R*1.15*Math.cos(a),y+R*1.15*Math.sin(a),x+R*1.4*Math.cos(a),y+R*1.4*Math.sin(a),{color:'#ffcf67',w:4});}
 return fade(g,s);
}
function speedometer(x,y,R,{g=1,t=0}={}){
 const A=v=>Math.PI*(1-v/120);let s=`<path d="M${x-R} ${y} A${R} ${R} 0 0 1 ${x+R} ${y}" fill="none" stroke="${C.dim}" stroke-width="6"/>`;
 for(let v=0;v<=120;v+=20){const a=A(v);s+=line(x+R*.86*Math.cos(a),y-R*.86*Math.sin(a),x+R*Math.cos(a),y-R*Math.sin(a),{color:C.ink,w:3})+label(String(v),x+R*.7*Math.cos(a),y-R*.7*Math.sin(a)+9,{size:24,color:C.dim,anchor:'middle'});}
 const v=60+18*Math.sin(t*.9),a=A(v);
 s+=line(x,y,x+R*.8*Math.cos(a),y-R*.8*Math.sin(a),{color:C.a,w:6})+dot(x,y,12,C.a);
 s+=label('km/h',x,y+40,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
// log ruler for eV (10^0 .. 10^7)
const LX=e=>200+e*120;
export function logBars({g=1,lin=0}={}){
 let s='';
 if(lin){ // linear scale: nuclear bar 2.2e6 = 900 px → chemical 3 eV = 0.0012 px
  s+=line(200,400,1110,400,{color:C.dim,w:3});
  s+=rect(200,330,900*(2.2/2.2),50,{fill:EC,fo:.6,stroke:EC,rx:4})+label('核反応 2.2×10⁶ eV',200,310,{size:26,color:EC,weight:700});
  s+=rect(200,200,1,50,{fill:C.x,fo:1,stroke:C.x,rx:0})+label('化学反応 3 eV（棒が 見えない）',220,235,{size:26,color:C.x,weight:700});
  s+=label('同じ 目盛り',650,470,{size:26,color:C.dim,anchor:'middle'});
  return fade(g,s);
 }
 s+=line(LX(0),400,LX(7),400,{color:C.dim,w:3});
 for(let e=0;e<=7;e++)s+=line(LX(e),392,LX(e),408,{color:C.dim,w:2})+tex(`10^{${e}}`,LX(e),446,{size:26,color:C.dim,auto:false});
 s+=label('eV',LX(7)+30,446,{size:24,color:C.dim});
 const bar=(v,y,col,txt)=>rect(LX(0),y,LX(Math.log10(v))-LX(0),50,{fill:col,fo:.6,stroke:col,rx:4})+label(txt,LX(0),y-14,{size:26,color:col,weight:700});
 s+=bar(2.2e6,300,EC,'核反応 約 2.2×10⁶ eV')+bar(3,170,C.x,'化学反応 約 3 eV');
 s+=label('目盛り 1つで 10倍',650,80,{size:26,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
export function ledgerBars({g=1,u=1}={}){
 const base=430,k=2.6;let s=line(150,base,1050,base,{color:C.dim,w:3});
 s+=rect(250,base-120*k,160,120*k,{fill:EC,fo:.45,stroke:EC,rx:6})+label('前の 静止エネルギー',330,base+36,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=fade(u,rect(700,base-110*k,160,110*k,{fill:EC,fo:.45,stroke:EC,rx:6})+rect(700,base-120*k,160,10*k,{fill:HC,fo:.7,stroke:HC,rx:3})
  +label('後の 静止エネルギー',780,base+36,{size:24,color:C.ink,anchor:'middle',weight:700})+label('運動 エネルギー・光',890,base-115*k+22,{size:24,color:HC,weight:700}));
 s+=fade(u,line(250,base-120*k,1050,base-120*k,{color:C.hi,w:2,dash:'8 6'})+label('合計は 同じ',560,base-120*k-14,{size:26,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
const roundup=(p)=>{ // the four "÷ 時間" cards
 const items=[['速さ','距離 ÷ 時間',C.v],['電流','電荷 ÷ 時間','#83ecc0'],['電力','エネルギー ÷ 時間',EC],['太陽','40億 kg ÷ 1秒',HC]];
 let s='';items.forEach(([a,b,col],i)=>{const x=60+i*280,g=seg(p,.05+i*.12,.2+i*.12);s+=card(x,120,250,170,label(a,x+125,180,{size:32,color:col,anchor:'middle',weight:700})+label(b,x+125,245,{size:26,color:C.ink,anchor:'middle',weight:700}),g,col);});
 return s;
};

export const hsANucleus3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=nucBalls(300,260,C12,{r:24});
  s+=fade(seg(p,.3,.45),wavy(420,230,640,150,{color:HC,amp:9,lam:30,ph:t*1.5,w:4,head:16})+label('エネルギー',560,120,{size:28,color:EC,anchor:'middle',weight:700}));
  s+=card(680,150,470,150,label('どこから 来る？',915,240,{size:38,color:EC,anchor:'middle',weight:700}),seg(p,.5,.65),EC);
  return s;
 },
 [K+'q2']:(p)=>card(100,120,440,220,label('反応の 前',320,200,{size:32,color:C.ink,anchor:'middle',weight:700})+proton(270,270,22)+neutron(370,270,22),1,C.faint)
  +card(660,120,440,220,label('反応の 後',880,200,{size:32,color:C.ink,anchor:'middle',weight:700})+deuteron(880,270,{r:22}),1,C.faint)
  +fade(seg(p,.3,.45),label('何が 減った？',600,420,{size:38,color:HC,anchor:'middle',weight:700})),
 [K+'plan']:(p)=>card(150,70,900,170,label('鍵は 質量',600,125,{size:30,color:C.dim,anchor:'middle'})+TX(MC2,600,205,{size:64}),seg(p,.05,.2),EC)
  +card(300,290,600,120,label('核の エネルギーを 計算する',600,362,{size:32,color:HC,anchor:'middle',weight:700}),seg(p,.5,.65),HC),
 // ================= S2 止まっていてもエネルギー =================
 [K+'s1']:(p)=>{
  let s=fade(seg(p,.02,.15),rect(150,200,140,140,{fill:'#8795ad',fo:.5,stroke:C.dim,rx:10})+label('止まった 物体',220,380,{size:26,color:C.ink,anchor:'middle',weight:700})+label('質量 m',220,180,{size:28,color:MC,anchor:'middle',weight:700}));
  s+=fcard(450,140,620,200,MC2,{size:90,col:EC,g:seg(p,.5,.65)});
  s+=tag('特殊相対論の 結果',760,410,{color:C.ink,size:26,g:seg(p,.5,.65)});
  return s;
 },
 [K+'s2']:(p)=>{
  let s=fade(.6,TX(MC2,600,80,{size:56}));
  s+=card(200,140,800,130,TX(`${ct}=3.0\\times10^{8}${U('m/s')}`,600,222,{size:52}),seg(p,.05,.2),CC);
  s+=fade(seg(p,.05,.2),label('光の 速さ',230,170,{size:24,color:CC,weight:700}));
  s+=card(300,320,600,120,label('静止エネルギー',600,395,{size:40,color:EC,anchor:'middle',weight:700}),seg(p,.55,.7),EC);
  return s;
 },
 [K+'s3']:(p)=>{
  let s=fade(.6,TX(MC2,600,80,{size:56}));
  s+=card(150,150,420,220,label('ニュートンの 力学',360,230,{size:30,color:C.ink,anchor:'middle',weight:700})+label('からは 出ない',360,300,{size:30,color:BAD,anchor:'middle',weight:700}),seg(p,.05,.2),BAD);
  s+=card(630,150,420,220,label('この 動画では',840,230,{size:30,color:C.ink,anchor:'middle'})+label('原理 として 使う',840,300,{size:34,color:HC,anchor:'middle',weight:700}),seg(p,.5,.65),HC);
  return s;
 },
 [K+'s4']:(p)=>fade(.6,TX(MC2,600,80,{size:50}))+fcard(150,150,900,160,`\\mathrm{kg}\\times(\\mathrm{m/s})^2=\\mathrm{kg\\cdot m^2/s^2}=\\mathrm{J}`,{size:50,col:EC,g:seg(p,.05,.2)})
  +fade(seg(p,.6,.75),label('エネルギーの 単位 ジュール',600,400,{size:32,color:EC,anchor:'middle',weight:700})),
 [K+'s5']:(p)=>fade(.6,TX(`1${U('g')}=1.0\\times10^{-3}${U('kg')}`,600,90,{size:40}))
  +fcard(80,150,1040,170,`${Et}=1.0\\times10^{-3}\\times(3.0\\times10^{8})^2=9.0\\times10^{13}${U('J')}`,{size:46,col:EC,g:seg(p,.05,.2)}),
 [K+'s5b']:(p)=>{
  let s=fade(seg(p,.02,.15),dot(300,260,90,'#c9ced8')+ring(300,260,90,{color:'#e8ecf2',w:4})+label('1',300,282,{size:64,color:'#6f7a8f',anchor:'middle',weight:700})+label('1円玉 ＝ 1 g',300,410,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),arrow(420,260,560,260,{color:CC,w:5,head:16}));
  s+=fcard(580,180,560,160,`9.0\\times10^{13}${U('J')}`,{size:60,col:EC,g:seg(p,.4,.55)});
  return s;
 },
 [K+'u3b']:(p,ctx)=>{
  let s=sun(300,260,140,{t:sceneT(p,ctx)});
  s+=card(600,110,540,130,label('約 46億 年 つづく',870,192,{size:36,color:C.t,anchor:'middle',weight:700}),seg(p,.05,.2),C.t);
  s+=card(600,290,540,130,label('失った 質量：数千分の1 ほど',870,372,{size:30,color:HC,anchor:'middle',weight:700}),seg(p,.5,.65),HC);
  return s;
 },
 [K+'s6']:(p)=>{
  let s=dot(200,300,8,MC)+label('わずかな 質量',200,360,{size:26,color:MC,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),arrow(240,300,420,300,{color:CC,w:5,head:16})+TX(`\\times ${ct}^2`,330,270,{size:40}));
  s+=fade(seg(p,.05,.2),TX(`${ct}^2=9.0\\times10^{16}`,330,160,{size:40}));
  s+=rect(460,280,640*seg(p,.25,.6),40,{fill:EC,fo:.6,stroke:EC,rx:4});
  s+=fade(seg(p,.6,.75),label('莫大な エネルギー',780,250,{size:32,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 質量の差 =================
 [K+'d1']:(p)=>card(250,120,700,240,label('核反応で 質量が',600,200,{size:32,color:C.ink,anchor:'middle',weight:700})+label('全部 エネルギーに なる？',600,270,{size:36,color:HC,anchor:'middle',weight:700})+cross(880,330,26,seg(p,.6,.75)),seg(p,.05,.2),HC),
 [K+'d2']:(p)=>{
  const u=seg(p,.1,.45);
  let s=proton(mix(250,560,u),260,30)+neutron(mix(950,640,u),260,30);
  s+=fade(1-u,label('陽子',250,330,{size:28,color:C.a,anchor:'middle',weight:700})+label('中性子',950,330,{size:28,color:'#a7b1c4',anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('重水素の 原子核（陽子 1・中性子 1）',600,360,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d3']:(p)=>card(150,90,900,280,proton(240,170,22)+TX(`${P10('1.67262','-27')}${U('kg')}`,680,180,{size:46})+fade(seg(p,.35,.5),neutron(240,280,22)+TX(`${P10('1.67493','-27')}${U('kg')}`,680,290,{size:46})),seg(p,.02,.15),C.faint)
  +tag('測定値',600,440,{color:C.ink,size:26,g:seg(p,.6,.75)}),
 [K+'d4']:(p)=>fade(.6,TX(`${P10('1.67262','-27')}+${P10('1.67493','-27')}`,600,90,{size:40}))
  +card(200,160,800,150,label('前',270,245,{size:30,color:C.ink,anchor:'middle',weight:700})+TX(`${P10('3.34755','-27')}${U('kg')}`,640,245,{size:52}),seg(p,.05,.2),C.ink),
 [K+'d5']:(p)=>{
  let s=balance(600,150,{u:seg(p,.3,.6)});
  s+=fade(seg(p,.05,.2),TX(`${P10('3.34755','-27')}`,250,70,{size:34})+TX(`${P10('3.34358','-27')}`,950,70,{size:34}));
  s+=fade(seg(p,.6,.75),label('後が 少し 軽い',950,30,{size:28,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d6']:(p)=>fade(.6,TX(`(3.34755-3.34358)\\times10^{-27}`,600,80,{size:42}))
  +fcard(220,140,760,150,`${DM}\\approx3.97\\times10^{-30}${U('kg')}`,{size:54,col:MC,g:seg(p,.05,.2)})
  +fade(seg(p,.55,.7),label('全体の 約 0.12 %',600,380,{size:34,color:HC,anchor:'middle',weight:700})),
 [K+'d7']:(p)=>{
  let s=fcard(250,60,700,170,DMC2,{size:72,col:EC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.2,.35),label('質量の 差',420,290,{size:28,color:MC,anchor:'middle',weight:700})+arrow(500,280,560,215,{color:MC,w:3,head:12}));
  s+=card(250,340,700,110,label('質量 全部 では ない',600,408,{size:32,color:HC,anchor:'middle',weight:700}),seg(p,.55,.7),HC);
  return s;
 },
 // ================= S4 桁違いのエネルギー =================
 [K+'n1']:(p)=>fade(.6,TX(DMC2,600,80,{size:46}))+fcard(60,150,1080,170,`${DE}=3.97\\times10^{-30}\\times9.0\\times10^{16}\\approx3.6\\times10^{-13}${U('J')}`,{size:44,col:EC,g:seg(p,.05,.2)}),
 [K+'n2']:(p)=>fade(.6,TX(`${DE}\\approx3.6\\times10^{-13}${U('J')}`,600,80,{size:42}))+fade(seg(p,.3,.45),TX(`1${U('eV')}=1.6\\times10^{-19}${U('J')}`,600,150,{size:34}))
  +fcard(120,200,960,170,`\\dfrac{3.6\\times10^{-13}}{1.6\\times10^{-19}}\\approx2.2\\times10^{6}${U('eV')}`,{size:50,col:EC,g:seg(p,.45,.6)}),
 [K+'n3']:(p)=>card(250,90,700,120,TX(`10^{6}${U('eV')}=1${U('MeV')}`,600,170,{size:50}),seg(p,.05,.2),C.faint)+fcard(300,260,600,150,`${DE}\\approx2.2${U('MeV')}`,{size:60,col:EC,g:seg(p,.45,.6)}),
 [K+'n4']:(p)=>card(150,110,900,250,label('水素が 燃える（化学反応）',600,180,{size:32,color:C.ink,anchor:'middle',weight:700})+label('水の 分子 1個 あたり 約 3 eV',600,280,{size:38,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.2),C.x),
 [K+'n5']:(p)=>fade(seg(p,.02,.15),TX(`\\dfrac{2.2\\times10^{6}}{3}\\approx7\\times10^{5}`,330,110,{size:44})+label('約 70万 倍',780,120,{size:36,color:HC,anchor:'middle',weight:700}))+logBars({lin:1,g:seg(p,.45,.6)}),
 [K+'n6']:(p)=>logBars({g:seg(p,.02,.2)})+fade(seg(p,.6,.75),label('桁違い',1000,220,{size:36,color:HC,anchor:'middle',weight:700})),
 [K+'n7']:(p)=>card(150,100,900,280,TX(MC2,600,180,{size:50})+label('化学反応でも 成り立つ',600,260,{size:32,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('減る 質量は 数十億分の1 → 測れない',600,335,{size:30,color:HC,anchor:'middle',weight:700})),seg(p,.05,.2),C.faint),
 // ================= S5 太陽が光るしくみ =================
 [K+'u1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sun(300,260,140,{t});
  s+=fade(seg(p,.1,.25),label('水素 → ヘリウム（核融合）',300,470,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=card(600,150,540,190,label('毎秒 約 40億 kg',870,230,{size:40,color:MC,anchor:'middle',weight:700})+label('軽く なる',870,300,{size:32,color:HC,anchor:'middle',weight:700}),seg(p,.5,.65),HC);
  return s;
 },
 [K+'u2']:(p,ctx)=>fade(.5,sun(160,260,90,{t:sceneT(p,ctx)}))+fcard(320,170,840,170,`4.0\\times10^{9}\\times9.0\\times10^{16}=3.6\\times10^{26}${U('J')}`,{size:44,col:EC,g:seg(p,.05,.2)})
  +fade(seg(p,.05,.2),label('1秒 あたり',740,140,{size:28,color:C.ink,anchor:'middle',weight:700})),
 [K+'u3']:(p,ctx)=>fade(.5,sun(160,260,90,{t:sceneT(p,ctx)}))+card(320,90,840,130,TX(`1${U('W')}=1${U('J/s')}`,740,170,{size:50}),seg(p,.05,.2),C.faint)
  +fade(seg(p,.05,.2),label('電力と 同じ',420,125,{size:24,color:C.dim,anchor:'middle'}))
  +fcard(420,270,640,150,`\\approx3.6\\times10^{26}${U('W')}`,{size:56,col:EC,g:seg(p,.5,.65)}),
 [K+'u4']:(p)=>ledgerBars({g:seg(p,.02,.15),u:seg(p,.4,.6)}),
 // ================= S6 高校編のふり返りと次の問い =================
 [K+'r1']:(p)=>{
  let s=fade(seg(p,.02,.15),label('高校編の 最初',600,60,{size:30,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.05,.2),label('A：100 m を 20 秒',150,150,{size:28,color:PA,weight:700}))+strip(190,100,{n:20,color:PA,g:seg(p,.05,.2)});
  s+=fade(seg(p,.3,.45),label('B：60 m を 10 秒',150,300,{size:28,color:PB,weight:700}))+strip(340,60,{n:10,color:PB,g:seg(p,.3,.45)});
  s+=fade(seg(p,.6,.75),label('距離 ÷ 時間 → 5 m/s と 6 m/s',600,450,{size:32,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r2']:(p)=>roundup(p),
 [K+'r3']:(p)=>{
  let s=fade(.45,roundup(1));
  s+=card(150,330,900,140,label('ある 区間の 変化量 ÷ 時間 ＝ 平均',600,412,{size:36,color:HC,anchor:'middle',weight:700}),seg(p,.4,.55),HC);
  return s;
 },
 [K+'x']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=speedometer(330,330,220,{t,g:seg(p,.02,.2)});
  s+=card(640,110,520,260,label('時間の 幅を 区切らずに',900,180,{size:30,color:C.ink,anchor:'middle'})+label('一瞬の 変化の 速さ',900,260,{size:40,color:HC,anchor:'middle',weight:700})+label('を 正確に 表すには？',900,325,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.45),HC);
  return s;
 },
 [K+'bye']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=speedometer(330,330,220,{t});
  s+=card(640,110,520,150,label('「いま」の 速さ',900,200,{size:40,color:HC,anchor:'middle',weight:700}),1,HC);
  s+=card(640,300,520,150,label('大学編・微分',900,360,{size:30,color:C.ink,anchor:'middle',weight:700})+label('平均の速さから今の速さへ',900,415,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.35,.5),C.x);
  return s;
 },
};
