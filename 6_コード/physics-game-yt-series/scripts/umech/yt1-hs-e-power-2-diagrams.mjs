// 高校編「電力とジュール熱・深く学ぶ 2/2」(ys-hs-e-power-2) — 図。Stage 1200×515.
// 色は 1/2 と同じ（I 緑、V 紫、P・W・熱 橙、t 金、R 白、強調 黄、誤り 赤）。
// 送電の図：左の発電所 → 上下2本の線 → 右の家。2本の線の抵抗の合計 R線 を上の線に1か所まとめて描く（大学編 電流・上級 2/2 と同じ描き方）。
//   V送（紫）は発電所側の2本の線の間、V線（紫の括弧）は R線 の両端。電流 I（緑）は上の線を右へ、下の線を左へ戻る。矢印の太さ ∝ 電流。
// 日本語の添字（送・損・線）は TeX に入れず、rich()（SVG の tspan）で書く。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,IC,VC,QC,TC,PC,WC,RC,BAD,It,Qt,Vt,Rt,Wt,Pt,tt,U,PVI,PRI,PVR,circuit,heatWaves,resistor,dryer,tower,fcard,Qcard} from './yt1-hs-e-power-1-diagrams.mjs';

const K='hs-e-power-2:';
const GOOD=C.F;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
// rich text: parts = [text, color, kind]; kind 'i' italic symbol, 's' subscript, '' plain
export function rich(parts,x,y,{size=34,anchor='middle',weight=400}={}){
 let s=`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}" xml:space="preserve" style="white-space:pre">`,sub=false;
 for(const [t,c,k=''] of parts){
  let dy=0;if(k==='s'&&!sub){dy=size*.28;sub=true;}else if(k!=='s'&&sub){dy=-size*.28;sub=false;}
  s+=`<tspan fill="${c}"${dy?` dy="${dy}"`:''}${k==='s'?` font-size="${Math.round(size*.62)}"`:''}${k==='i'?' font-style="italic" font-family="serif"':''}>${esc(t)}</tspan>`;
 }
 return s+'</text>';
}
export const Pso=[['P',PC,'i'],['送',PC,'s']],Pson=[['P',PC,'i'],['損',PC,'s']],Vso=[['V',VC,'i'],['送',VC,'s']],Vli=[['V',VC,'i'],['線',VC,'s']],Rli=[['R',RC,'i'],['線',RC,'s']],
 Ii=[['I',IC,'i']],op=(t,c=C.ink)=>[[t,c]];
const R2=(...a)=>a.flat();
// ---- transmission line ----------------------------------------------------------------------------
const GX=170,TX=1040,YT=150,YB=330,RX1=500,RX2=680;
function house(x,y,{g=1}={}){return fade(g,poly([[x-50,y-40],[x,y-85],[x+50,y-40]],{fill:C.hi,fo:.5})+rect(x-40,y-40,80,60,{fill:C.hi,fo:.25,stroke:C.hi,sw:2,rx:2}));}
export function transLine({g=1,cur=0,heat=0,t=0,vso=0,vli=0,iw=6,rlab=1,vsoText='',vliText='',town='家'}={}){
 let s='';
 s+=rect(GX-120,YT-30,120,YB-YT+60,{fill:'#2a3550',fo:.9,stroke:C.dim,sw:2.5,rx:10})+label('発電所',GX-60,YT+(YB-YT)/2+9,{size:26,color:C.ink,anchor:'middle'});
 s+=rect(TX,YT-30,130,YB-YT+60,{fill:'#2a3550',fo:.9,stroke:C.dim,sw:2.5,rx:10})+house(TX+65,YT+130)+label(town,TX+65,YB+10,{size:26,color:C.ink,anchor:'middle'});
 s+=line(GX,YT,RX1,YT,{color:C.ink,w:4})+line(RX2,YT,TX,YT,{color:C.ink,w:4})+line(GX,YB,TX,YB,{color:C.ink,w:4});
 if(heat>0)s+=fade(Math.min(1,heat),rect(RX1-12,YT-36,RX2-RX1+24,72,{fill:PC,fo:.25,stroke:'none',rx:16}));
 s+=resistor(RX1,RX2,YT,{color:heat>.5?'#ffd2a0':RC,n:7});
 if(heat>0)s+=heatWaves(RX1,RX2,YT,t,{g:Math.min(1,heat),n:Math.max(1,Math.round(4*Math.min(1,heat))),h:60*Math.min(1,heat)+10});
 if(rlab)s+=rich(Rli,(RX1+RX2)/2,YT+62,{size:38});
 if(cur>0)s+=fade(cur,arrow(GX+40,YT-26,GX+250,YT-26,{color:IC,w:iw,head:12+iw*1.2})+arrow(TX-40,YB+28,TX-250,YB+28,{color:IC,w:iw,head:12+iw*1.2})+rich(Ii,GX+280,YT-16,{size:34}));
 if(vso>0)s+=fade(vso,arrow(GX+35,(YT+YB)/2,GX+35,YT+8,{color:VC,w:3.5,head:12})+arrow(GX+35,(YT+YB)/2,GX+35,YB-8,{color:VC,w:3.5,head:12})+rich(R2(Vso,vsoText?op(vsoText):[]),GX+52,(YT+YB)/2+12,{size:36,anchor:'start'}));
 if(vli>0)s+=fade(vli,line(RX1,YT+90,RX2,YT+90,{color:VC,w:3})+line(RX1,YT+80,RX1,YT+100,{color:VC,w:3})+line(RX2,YT+80,RX2,YT+100,{color:VC,w:3})+rich(R2(Vli,vliText?op(vliText):[]),(RX1+RX2)/2,YT+138,{size:36}));
 return fade(g,s);
}
// compact row for the 1000 V / 10000 V comparison (y = top wire)
export function trow(y,{g=1,v='1000 V',iw=10,heat=1,t=0,itext='',ptext='',pg=1,ig=1,col=PC}={}){
 const x0=60,x1=700,r1=330,r2=450;
 let s=rect(x0,y-18,90,116,{fill:'#2a3550',fo:.9,stroke:C.dim,sw:2,rx:8})+label('発電所',x0+45,y+48,{size:22,color:C.ink,anchor:'middle'});
 s+=rect(x1,y-18,80,116,{fill:'#2a3550',fo:.9,stroke:C.dim,sw:2,rx:8})+label('家',x1+40,y+48,{size:24,color:C.ink,anchor:'middle'});
 s+=line(x0+90,y,r1,y,{color:C.ink,w:3.5})+line(r2,y,x1,y,{color:C.ink,w:3.5})+line(x0+90,y+80,x1,y+80,{color:C.ink,w:3.5});
 if(heat>0)s+=fade(Math.min(1,heat),rect(r1-8,y-26,r2-r1+16,52,{fill:PC,fo:.3,stroke:'none',rx:12}));
 s+=resistor(r1,r2,y,{color:heat>.5?'#ffd2a0':RC,n:5,amp:13});
 if(heat>.3)s+=heatWaves(r1,r2,y-4,t,{g:Math.min(1,heat),n:Math.max(1,Math.round(4*heat)),h:Math.max(12,50*heat)});
 s+=label(v,x0+45,y-30,{size:28,color:VC,anchor:'middle',weight:700});
 s+=fade(ig,arrow(x0+110,y+40,x0+230,y+40,{color:IC,w:iw,head:10+iw*1.3}));
 if(itext)s+=fade(ig,label(itext,x0+300,y+50,{size:28,color:IC,anchor:'start',weight:700}));
 if(ptext)s+=card(800,y-20,360,110,label(ptext,980,y+50,{size:30,color:col,anchor:'middle',weight:700}),pg,col);
 return fade(g,s);
}
// ---- P–t graph -------------------------------------------------------------------------------------
const G={x:150,y:430,w:560,h:310,tmax:600,pmax:1400};
const gx=s=>G.x+G.w*s/G.tmax, gy=w=>G.y-G.h*w/G.pmax;
export function ptAxes({g=1}={}){
 let s=arrow(G.x-10,G.y,G.x+G.w+40,G.y,{color:C.dim,w:2.5,head:14})+arrow(G.x,G.y+10,G.x,G.y-G.h-30,{color:C.dim,w:2.5,head:14});
 s+=label('時間 t（s）',G.x+G.w+52,G.y+8,{size:24,color:TC,anchor:'start',weight:700})+label('電力 P（W）',G.x,G.y-G.h-44,{size:24,color:PC,anchor:'middle',weight:700});
 s+=[0,300,600].map(v=>line(gx(v),G.y-6,gx(v),G.y+6,{color:C.dim})+label(String(v),gx(v),G.y+32,{size:22,color:C.dim,anchor:'middle'})).join('');
 s+=[600,1200].map(v=>line(G.x-6,gy(v),G.x+6,gy(v),{color:C.dim})+label(String(v),G.x-12,gy(v)+8,{size:22,color:C.dim,anchor:'end'})).join('');
 return fade(g,s);
}
const flat=(p=1)=>draw([[gx(0),gy(1200)],[gx(600),gy(1200)]],p,{color:PC,w:5});
const areaRect=(t0,t1,w,g=1,fo=.3)=>fade(g,rect(gx(t0),gy(w),gx(t1)-gx(t0),G.y-gy(w),{fill:PC,fo,stroke:PC,sw:2,rx:0}));
const stepLine=(p=1)=>draw([[gx(0),gy(1200)],[gx(300),gy(1200)],[gx(300),gy(600)],[gx(600),gy(600)]],p,{color:PC,w:5});
// ---- compass ---------------------------------------------------------------------------------------
function compass(x,y,ang,{g=1,r=60}={}){
 const a=ang*Math.PI/180,dx=Math.sin(a),dy=-Math.cos(a),px=Math.cos(a),py=Math.sin(a);
 let s=ring(x,y,r,{color:C.dim,w:3,fill:'#131f38'});
 s+=poly([[x+dx*r*.85,y+dy*r*.85],[x+px*9,y+py*9],[x-px*9,y-py*9]],{fill:C.a,fo:1});
 s+=poly([[x-dx*r*.85,y-dy*r*.85],[x+px*9,y+py*9],[x-px*9,y-py*9]],{fill:C.ink,fo:.9});
 s+=dot(x,y,5,C.dim);
 return fade(g,s);
}
const QA=(p)=>{
 let s=dryer(220,160);
 s+=card(400,70,740,150,label('1200 W × 10分 ＝ 何 J？',770,160,{size:40,color:PC,anchor:'middle',weight:700}),1,PC);
 return s;
};
const QB=(g=1)=>fade(g,tower(170,505,{h:160})+line(100,375,40,405,{color:C.dim,w:2})+line(240,375,300,405,{color:C.dim,w:2}))+card(400,290,740,150,label('なぜ 高い 電圧で 送る？',770,380,{size:40,color:C.hi,anchor:'middle',weight:700}),g,C.hi);

export const hsEPower2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>fade(seg(p,.02,.2),QA(p)),
 [K+'q2']:(p)=>QA(p)+QB(seg(p,.05,.3)),
 [K+'recap']:(p)=>{
  let s=card(150,90,900,190,T2(`${Pt}=${Vt}${It}=${Rt}${It}^2=\\dfrac{${Vt}^2}{${Rt}}`,600,200,{size:58}),seg(p,.05,.25),PC);
  s+=fade(seg(p,.4,.6),label('電力 ＝ 1秒あたりの エネルギー',600,370,{size:34,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S2 電力量 =================
 [K+'def']:(p)=>{
  let s=fcard(300,90,600,170,`${Wt}=${Pt}${tt}`,{g:seg(p,.05,.25),size:72,col:PC});
  s+=fade(seg(p,.3,.5),label('1秒あたり',555,320,{size:28,color:PC,anchor:'middle',weight:700})+arrow(565,290,600,250,{color:PC,w:3,head:10}));
  s+=fade(seg(p,.45,.65),label('秒数',730,320,{size:28,color:TC,anchor:'middle',weight:700})+arrow(715,290,690,250,{color:TC,w:3,head:10}));
  s+=fade(seg(p,.7,.85),label('電力が 一定 のとき',600,420,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'def2']:(p)=>{
  let s=fcard(300,90,600,170,`${Wt}=${Pt}${tt}`,{size:72,col:PC});
  s+=fade(seg(p,.05,.25),label('電力量 ＝ 使った エネルギーの 総量',600,340,{size:34,color:PC,anchor:'middle',weight:700}));
  s+=tag('定義',600,430,{g:seg(p,.45,.6)});
  return s;
 },
 [K+'speed']:(p)=>{
  const xs=[330,600,870];
  let s=card(120,80,960,150,'',seg(p,.0,.15),C.faint);
  s+=fade(seg(p,.0,.2),label('速さ',xs[0],175,{size:40,color:C.v,anchor:'middle',weight:700})+label('×',465,175,{size:40,color:C.ink,anchor:'middle'})+label('時間',xs[1],175,{size:40,color:TC,anchor:'middle',weight:700})+label('＝',735,175,{size:40,color:C.ink,anchor:'middle'})+label('距離',xs[2],175,{size:40,color:C.x,anchor:'middle',weight:700}));
  s+=card(120,280,960,150,'',seg(p,.3,.45),PC);
  s+=fade(seg(p,.3,.5),T2(Pt,xs[0],370,{size:54})+label('×',465,375,{size:40,color:C.ink,anchor:'middle'})+T2(tt,xs[1],370,{size:54})+label('＝',735,375,{size:40,color:C.ink,anchor:'middle'})+T2(Wt,xs[2],370,{size:54}));
  s+=fade(seg(p,.55,.7),label('1秒あたり',xs[0],470,{size:26,color:C.dim,anchor:'middle'})+label('秒数',xs[1],470,{size:26,color:C.dim,anchor:'middle'})+label('総量',xs[2],470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'dryer']:(p)=>{
  let s=dryer(220,190);
  s+=fade(seg(p,.05,.2),label('1200 W',190,370,{size:32,color:PC,anchor:'middle',weight:700})+label('10分 ＝ 600 秒',190,420,{size:30,color:TC,anchor:'middle',weight:700}));
  s+=fcard(450,110,680,150,`${Wt}=1200\\times600`,{g:seg(p,.4,.6),size:56,col:C.faint});
  return s;
 },
 [K+'dryer2']:(p)=>{
  let s=dryer(220,190)+label('1200 W',190,370,{size:32,color:PC,anchor:'middle',weight:700})+label('10分 ＝ 600 秒',190,420,{size:30,color:TC,anchor:'middle',weight:700});
  s+=fcard(450,40,680,130,`${Wt}=1200\\times600`,{size:50,col:C.faint});
  s+=fcard(450,200,680,130,`=720000${U('J')}`,{g:seg(p,.05,.25),size:50,col:C.faint});
  s+=fcard(450,360,680,130,`=7.2\\times10^5${U('J')}`,{g:seg(p,.4,.6),size:54,col:PC});
  return s;
 },
 [K+'joule']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({t,flow:1,glow:1,heat:1,rlab:1,ilab:1});
  s+=card(560,60,600,170,label('ジュール熱',860,115,{size:32,color:PC,anchor:'middle',weight:700})+T2(`${Wt}=${Pt}${tt}`,860,195,{size:52}),seg(p,.05,.25),PC);
  s+=card(560,270,600,170,label('抵抗では P ＝ RI² なので',860,325,{size:28,color:C.ink,anchor:'middle'})+T2(`${Wt}=${Rt}${It}^2${tt}`,860,405,{size:52}),seg(p,.5,.7),PC);
  return s;
 },
 [K+'symbol']:(p)=>{
  let s=card(140,80,420,300,label('熱の 回',350,140,{size:30,color:C.dim,anchor:'middle',weight:700})+T2('Q',350,250,{size:90,color:PC,auto:false})+label('熱の 量',350,345,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,.0,.2),C.faint);
  s+=card(640,80,420,300,label('この 回',850,140,{size:30,color:C.dim,anchor:'middle',weight:700})+T2(Qt,780,250,{size:80})+label('電荷',780,345,{size:30,color:QC,anchor:'middle',weight:700})+T2(Wt,930,250,{size:80})+label('熱の 量',930,345,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,.35,.55),PC);
  s+=fade(seg(p,.65,.8),label('同じ 文字を 二つの 量に 使わない',600,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 P–t グラフ =================
 [K+'graph']:(p)=>{
  let s=ptAxes({g:seg(p,.0,.2)})+flat(seg(p,.25,.6));
  s+=fade(seg(p,.55,.7),label('1200 W で 一定',gx(300),gy(1200)-20,{size:28,color:PC,anchor:'middle',weight:700}));
  s+=dryer(960,200,{g:seg(p,.1,.3),s:.8});
  return s;
 },
 [K+'area']:(p)=>{
  let s=ptAxes()+areaRect(0,600,1200,seg(p,.05,.3))+flat();
  s+=fade(seg(p,.2,.4),label('縦 1200 W',gx(600)-20,gy(600),{size:28,color:PC,anchor:'end',weight:700}));
  s+=fade(seg(p,.3,.5),label('横 600 s',gx(300),G.y+70,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=card(800,130,360,190,label('面積',980,190,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`7.2\\times10^5${U('J')}`,980,275,{size:42}),seg(p,.55,.75),PC);
  return s;
 },
 [K+'vt']:(p)=>{
  let s=ptAxes()+areaRect(0,600,1200)+flat();
  s+=card(800,40,360,200,'',seg(p,.05,.25),C.faint);
  const ax=850,ay=200;
  s+=fade(seg(p,.05,.25),arrow(ax-5,ay,ax+170,ay,{color:C.dim,w:2,head:10})+arrow(ax,ay+5,ax,ay-130,{color:C.dim,w:2,head:10})+rect(ax,ay-80,140,80,{fill:C.x,fo:.3,stroke:C.v,sw:3,rx:0})
   +T2('v',ax-20,ay-110,{size:30})+T2('t',ax+175,ay+20,{size:30})+label('面積 ＝ 変位',1080,150,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=card(800,260,360,130,label('面積 ＝ 電力量',980,335,{size:32,color:PC,anchor:'middle',weight:700}),seg(p,.4,.6),PC);
  return s;
 },
 [K+'step']:(p)=>{
  let s=ptAxes()+stepLine(seg(p,.05,.4));
  s+=areaRect(0,300,1200,seg(p,.45,.6))+areaRect(300,600,600,seg(p,.6,.75));
  s+=fade(seg(p,.4,.55),label('途中で 電力が 変わる',980,200,{size:30,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'step2']:(p)=>{
  let s=ptAxes()+areaRect(0,300,1200)+areaRect(300,600,600)+stepLine();
  s+=card(780,60,390,130,T2(`1200\\times300`,975,115,{size:34})+T2(`=3.6\\times10^5${U('J')}`,975,165,{size:34}),seg(p,.05,.25),PC);
  s+=card(780,220,390,130,T2(`600\\times300`,975,275,{size:34})+T2(`=1.8\\times10^5${U('J')}`,975,325,{size:34}),seg(p,.45,.65),PC);
  s+=fade(seg(p,.05,.25),label('①',gx(150),gy(600)+10,{size:36,color:C.ink,anchor:'middle',weight:700}))+fade(seg(p,.45,.65),label('②',gx(450),gy(300)+10,{size:36,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.25),label('①',770,135,{size:30,color:C.ink,anchor:'end',weight:700}))+fade(seg(p,.45,.65),label('②',770,295,{size:30,color:C.ink,anchor:'end',weight:700}));
  return s;
 },
 [K+'step3']:(p)=>{
  let s=ptAxes()+areaRect(0,300,1200)+areaRect(300,600,600)+stepLine();
  s+=label('①',gx(150),gy(600)+10,{size:36,color:C.ink,anchor:'middle',weight:700})+label('②',gx(450),gy(300)+10,{size:36,color:C.ink,anchor:'middle',weight:700});
  s+=card(780,60,390,170,label('① ＋ ②',975,115,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`=5.4\\times10^5${U('J')}`,975,190,{size:40}),seg(p,.05,.25),PC);
  s+=card(780,280,390,130,label('下の 面積 ＝ 電力量',975,355,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.65),C.hi);
  return s;
 },
 // ================= S4 kWh =================
 [K+'bill']:(p)=>{
  let s=fade(seg(p,.0,.2),rect(140,50,360,420,{fill:'#e8edf5',fo:.95,stroke:C.dim,sw:2,rx:8})+label('電気 ご使用量 の お知らせ',320,110,{size:24,color:'#22304a',anchor:'middle',weight:700})
   +line(170,135,470,135,{color:'#8090a8',w:2})+label('ご使用量',190,215,{size:26,color:'#22304a'})+label('250 kWh',470,215,{size:34,color:'#c0561a',anchor:'end',weight:700})
   +line(170,250,470,250,{color:'#c0ccdd',w:2})+line(170,300,420,300,{color:'#c0ccdd',w:2})+line(170,350,450,350,{color:'#c0ccdd',w:2}));
  s+=fade(seg(p,.25,.4),ring(410,205,80,{color:C.hi,w:4}));
  s+=card(600,110,540,140,label('kWh は 電力 ではなく',870,195,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),C.faint);
  s+=card(600,290,540,140,label('エネルギーの 単位',870,375,{size:38,color:PC,anchor:'middle',weight:700}),seg(p,.65,.8),PC);
  return s;
 },
 [K+'kwh']:(p)=>{
  let s=fcard(200,90,800,170,`1${U('kWh')}=1${U('kW')}\\times1${U('h')}`,{g:seg(p,.05,.25),size:58,col:PC});
  s+=fade(seg(p,.4,.6),label('1 kW の 電力を 1時間 使った ときの 電力量',600,350,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'kwh2']:(p)=>{
  let s=T2(`1${U('kWh')}=1${U('kW')}\\times1${U('h')}`,600,80,{size:44});
  const c=seg(p,.4,.5);
  s+=fade(seg(p,.05,.25)*(1-c),T2(`=1000${U('J/s')}\\times3600${U('s')}`,600,220,{size:56}));
  s+=fade(c,T2(`=1000\\,\\mathrm{J}/\\cancel{\\mathrm{s}}\\times3600\\,\\cancel{\\mathrm{s}}`,600,220,{size:56}));
  s+=fcard(300,300,600,150,`=3.6\\times10^6${U('J')}`,{g:seg(p,.6,.8),size:60,col:PC});
  return s;
 },
 [K+'dkwh']:(p)=>{
  let s=dryer(170,150,{s:.75});
  s+=fcard(330,50,840,140,`1.2${U('kW')}\\times\\tfrac{1}{6}${U('h')}=0.20${U('kWh')}`,{g:seg(p,.05,.25),size:50,col:PC});
  s+=fade(seg(p,.1,.25),label('10分 ＝ 1/6 時間',170,300,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=card(330,250,840,190,label('確かめ',360,355,{size:28,color:C.dim,weight:700})+T2(`\\dfrac{7.2\\times10^5${U('J')}}{3.6\\times10^6${U('J')}}=0.20`,800,360,{size:46}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'ans1']:(p)=>{
  let s=dryer(220,190)+label('10分',190,400,{size:30,color:TC,anchor:'middle',weight:700});
  s+=card(450,100,700,280,T2(`${Wt}=7.2\\times10^5${U('J')}`,800,200,{size:56})+T2(`=0.20${U('kWh')}`,800,310,{size:56}),seg(p,.05,.3),PC);
  return s;
 },
 // ================= S5 送電 =================
 [K+'line']:(p)=>{
  let s=transLine({g:seg(p,.0,.25),rlab:0});
  s+=fade(seg(p,.5,.7),rich(Rli,(RX1+RX2)/2,YT+62,{size:38}));
  s+=fade(seg(p,.55,.75),label('2本の 線の 抵抗を 1か所に まとめた',600,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'loss']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=transLine({cur:seg(p,.05,.2),heat:seg(p,.2,.45),t});
  s+=card(330,400,540,100,rich(R2(Pson,op(' ＝ '),Rli,op(' '),Ii,[['²',IC]]),600,465,{size:40}),seg(p,.5,.7),PC);
  return s;
 },
 [K+'fix']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=transLine({cur:1,heat:1,t,vso:seg(p,.05,.2)});
  s+=card(80,400,500,100,rich(R2(Pso,op(' ＝ '),Vso,op(' '),Ii),330,465,{size:40}),seg(p,.15,.35),PC);
  s+=card(620,400,500,100,rich(R2(Ii,op(' ＝ '),Pso,op(' ÷ '),Vso),870,465,{size:40}),seg(p,.55,.75),IC);
  return s;
 },
 [K+'guess']:(p)=>Qcard('送る 電力は そのまま、電圧を 10倍','損失は 何倍？',{g:seg(p,.05,.25)}),
 [K+'ex']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=transLine({cur:1,t,rlab:0});
  s+=fade(seg(p,.05,.25),rich(R2(Pso,op(' ＝ 100 kW')),GX+20,YT-80,{size:36,anchor:'start'}));
  s+=fade(seg(p,.25,.45),rich(R2(Rli,op(' ＝ 2.0 Ω')),(RX1+RX2)/2,YT+62,{size:38}));
  s+=fade(seg(p,.55,.75),tag('仮定：R線 は 一定、変圧器の 損失は ない',600,450,{color:C.dim,size:24}));
  return s;
 },
 [K+'ex1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=trow(100,{t,heat:0,iw:14,itext:'I ＝ 100 A',ig:seg(p,.3,.5),pg:0});
  s+=fade(seg(p,.05,.3),T2(`${It}=\\dfrac{100\\times10^3}{1000}=100${U('A')}`,600,400,{size:46}));
  return s;
 },
 [K+'ex1b']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=trow(100,{t,heat:seg(p,.05,.3),iw:14,itext:'I ＝ 100 A',ptext:'損失 20 %',pg:seg(p,.5,.7),col:BAD});
  s+=fade(seg(p,.1,.35),T2(`2.0\\times100^2=2.0\\times10^4${U('W')}`,600,330,{size:44}));
  s+=fade(seg(p,.5,.7),T2(`\\dfrac{2.0\\times10^4}{100\\times10^3}=0.20`,600,440,{size:40}));
  return s;
 },
 [K+'ex2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=trow(100,{t,heat:1,iw:14,itext:'I ＝ 100 A',ptext:'損失 20 %',col:BAD});
  s+=fade(seg(p,.05,.2),trow(320,{t,v:'10000 V',heat:seg(p,.4,.6)*.15,iw:3,itext:'I ＝ 10 A',ig:seg(p,.15,.35),ptext:'損失 0.2 %',pg:seg(p,.6,.8),col:GOOD}));
  s+=fade(seg(p,.35,.55),label('2.0 × 10² ＝ 200 W',515,470,{size:28,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ratio']:(p)=>{
  const rows=[['電圧',VC,'× 10'],['電流',IC,'× 1/10'],['損失',PC,'× 1/100']];
  let s='';
  rows.forEach(([a,c,b],i)=>{const y=110+i*130,g=seg(p,.05+i*.2,.2+i*.2);
   s+=card(250,y-60,700,100,label(a,420,y+8,{size:38,color:c,anchor:'middle',weight:700})+label(b,740,y+10,{size:44,color:C.ink,anchor:'middle',weight:700}),g,c);
   if(i>0)s+=fade(g,arrow(600,y-100,600,y-66,{color:C.dim,w:4,head:12}));});
  s+=fade(seg(p,.7,.85),label('2乗に 比例',1060,380,{size:28,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'trap']:(p)=>{
  let s=card(150,50,900,120,rich(R2(op('送電の 電圧 '),Vso,op(' を '),[['V',VC,'i'],['²',VC],['/',C.ink]],Rli,op(' に 入れる')),600,125,{size:36}),seg(p,.0,.2),BAD);
  s+=fade(seg(p,.25,.5),T2(`\\dfrac{1000^2}{2.0}=5.0\\times10^5${U('W')}`,600,300,{size:56}));
  s+=fade(seg(p,.6,.8),label('？',930,305,{size:60,color:BAD,anchor:'middle',weight:700}));
  return s;
 },
 [K+'trap2']:(p)=>{
  let s=T2(`\\dfrac{1000^2}{2.0}=5.0\\times10^5${U('W')}`,600,110,{size:46});
  s+=fade(seg(p,.05,.2),rect(250,190,100,40,{fill:PC,fo:.55,stroke:PC,sw:2,rx:4})+label('送る 電力 100 kW',370,220,{size:28,color:PC,weight:700}));
  s+=fade(seg(p,.15,.35),rect(250,260,500,40,{fill:BAD,fo:.5,stroke:BAD,sw:2,rx:4})+label('損失？ 500 kW',770,290,{size:28,color:BAD,weight:700}));
  s+=card(250,340,700,140,label('ありえない ／ 逆の 答え',600,425,{size:38,color:BAD,anchor:'middle',weight:700}),seg(p,.45,.65),BAD);
  return s;
 },
 [K+'vline']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=transLine({cur:1,heat:1,t,vso:1,vsoText:' ＝ 1000 V',vli:seg(p,.05,.25),rlab:1});
  s+=card(150,395,900,110,rich(R2(Vli,op(' ＝ '),Ii,Rli,op(' ＝ 100 × 2.0 ＝ 200 V')),600,465,{size:38}),seg(p,.35,.55),VC);
  return s;
 },
 [K+'vline2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=transLine({cur:1,heat:1,t,vso:1,vsoText:' ＝ 1000 V',vli:1,vliText:' ＝ 200 V',rlab:1});
  s+=card(150,395,900,110,T2(`\\dfrac{200^2}{2.0}=2.0\\times10^4${U('W')}`,520,462,{size:42})+label('同じ 損失',900,462,{size:32,color:GOOD,anchor:'middle',weight:700}),seg(p,.05,.3),GOOD);
  return s;
 },
 [K+'home']:(p)=>{
  let s=rect(50,180,130,130,{fill:'#2a3550',fo:.9,stroke:C.dim,sw:2.5,rx:10})+label('発電所',115,252,{size:24,color:C.ink,anchor:'middle'});
  s+=tower(330,330,{h:150})+tower(560,330,{h:150});
  s+=line(180,210,330,210,{color:C.ink,w:3})+line(330,210,560,210,{color:C.ink,w:3})+line(560,210,760,210,{color:C.ink,w:3});
  s+=fade(seg(p,.05,.2),label('高い 電圧で 送る',445,150,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),rect(760,170,130,110,{fill:'#2a3550',fo:.95,stroke:C.hi,sw:2.5,rx:10})+label('変圧器',825,232,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),line(890,225,990,225,{color:C.ink,w:3})+house(1050,280)+label('100 V',1050,340,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),tag('100 V でも 感電は 危険',900,430,{color:BAD,size:26}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(80,70,1040,160,label('電気代 ＝ エネルギーの 量',380,165,{size:34,color:PC,anchor:'middle',weight:700})+T2(`${Wt}=${Pt}${tt}`,860,165,{size:54}),seg(p,.05,.25),PC);
  s+=card(80,270,1040,170,label('送電：電圧 ↑ → 電流 ↓ → 損失',480,370,{size:34,color:C.ink,anchor:'middle',weight:700})+rich(R2(Rli,op(' '),Ii,[['²',IC]],op(' ↓')),930,370,{size:44}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'univ']:(p)=>{
  let s=ptAxes();
  const pts=Array.from({length:61},(_,i)=>{const t=i*10;return [gx(t),gy(800+300*Math.sin(t/95))];});
  s+=fade(seg(p,.1,.35),poly([[gx(0),G.y],...pts,[gx(600),G.y]],{fill:PC,fo:.3}));
  s+=draw(pts,seg(p,.0,.3),{color:PC,w:5});
  s+=card(800,140,360,180,label('大学編：',980,200,{size:30,color:C.dim,anchor:'middle',weight:700})+label('面積を 積分で',980,265,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.55),C.hi);
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx),sw=seg(p,.25,.5);
  let s=compass(430,300,mix(90,35,sw)+(sw>0?4*Math.sin(t*6)*(1-seg(p,.5,.7)):0),{r:70});
  s+=line(80,300,700,300,{color:C.ink,w:6});
  s+=fade(seg(p,.05,.2),arrow(140,265,340,265,{color:IC,w:6,head:18})+T2(It,250,240,{size:40}));
  s+=fade(seg(p,.1,.25),label('導線の 下に 方位磁針',430,420,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.1,.25),label('上から 見た 図',430,100,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(760,90,400,250,label('熱の ほかに',960,170,{size:32,color:PC,anchor:'middle',weight:700})+label('何を 作っている？',960,250,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=compass(430,300,35,{r:70})+line(80,300,700,300,{color:C.ink,w:6})+arrow(140,265,340,265,{color:IC,w:6,head:18})+T2(It,250,240,{size:40});
  s+=label('導線の 下に 方位磁針',430,420,{size:26,color:C.dim,anchor:'middle'})+label('上から 見た 図',430,100,{size:24,color:C.dim,anchor:'middle'});
  s+=card(760,90,400,250,label('熱の ほかに',960,170,{size:32,color:PC,anchor:'middle',weight:700})+label('何を 作っている？',960,250,{size:36,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=tag('次の 単元：磁場と電磁誘導',960,410,{g:seg(p,.1,.3),size:24});
  return s;
 },
};
