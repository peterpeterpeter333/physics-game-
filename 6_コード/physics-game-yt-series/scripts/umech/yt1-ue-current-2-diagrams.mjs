// YouTube シリーズ「電流・上級 2/2」(ys-ue-current-2) — 図。Stage 1200×515.
// 向き：𝐄 右、電子の力 −e𝐄・平均の速度 𝐯 は左（同じ向き → 仕事率 正）、𝐣・I 右。
// 送電の図：左の発電所 → 上下2本の線 → 右の町。2本の線の抵抗の合計 R線 を上の線に1か所まとめて描く。
//   V送（紫）は発電所側の2本の線の間、V線（赤桃）は R線 に沿う電圧の下がり。電流 I（緑）は上の線を右へ、下の線を左へ戻る。
// 日本語の添字（送・損・線）は TeX に入れず、rich()（SVG の tspan）で書く。
// 色：電流 I・𝐣 緑、e 桃、電子 青、𝐄 水色、𝐯 紫、V送 紫、V線 赤桃、仕事率・電力・熱 橙、σ・R 黄、強調 黄、誤り 赤。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,texWidth,poly} from './anim.mjs';
import {NEG,POS,EC,QC,IC,VEL,TC,SC,cs,T,card,L,U,tube,electronsIn,ions,eArrow,vArrow,iArrow,W,
 BAD,OK,VC,RC,FC,HEAT,bE,Es,bv,vs,et,tau,bj,js,It,sig,rho,Rt,Vt,St,TF,row} from './yt1-ue-current-1-diagrams.mjs';

const K='ue-current-2:';
const VL=C.a,PC=HEAT;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
// rich text: parts = [text, color, kind]; kind 'i' italic (a symbol), 's' subscript, '' plain
function rich(parts,x,y,{size=34,anchor='middle',weight=400}={}){
 let s=`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}" xml:space="preserve" style="white-space:pre">`,sub=false;
 for(const [t,c,k=''] of parts){
  let dy=0;if(k==='s'&&!sub){dy=size*.28;sub=true;}else if(k!=='s'&&sub){dy=-size*.28;sub=false;}
  s+=`<tspan fill="${c}"${dy?` dy="${dy}"`:''}${k==='s'?` font-size="${Math.round(size*.62)}"`:''}${k==='i'?' font-style="italic" font-family="serif"':''}>${esc(t)}</tspan>`;
 }
 return s+'</text>';
}
// symbol builders for rich()
const Pso=[['P',PC,'i'],['送',PC,'s']],Pson=[['P',PC,'i'],['損',PC,'s']],Vso=[['V',VC,'i'],['送',VC,'s']],Vli=[['V',VL,'i'],['線',VL,'s']],Rli=[['R',RC,'i'],['線',RC,'s']],
 Ii=[['I',IC,'i']],op=t=>[[t,C.ink]];
const R2=(...a)=>a.flat();

// ---------- transmission circuit ----------
const GX=150,TX=1050,YT=150,YB=330,RX1=520,RX2=680;
function circuit({g=1,vso=0,vli=0,cur=0,heat=0,ilab=1}={}){
 let s='';
 // station
 s+=rect(GX-110,YT-30,110,YB-YT+60,{fill:'#2a3550',fo:.9,stroke:C.dim,sw:2.5,rx:10})+label('発電所',GX-55,YT+(YB-YT)/2+8,{size:24,color:C.ink,anchor:'middle'});
 // town
 s+=rect(TX,YT-30,120,YB-YT+60,{fill:'#2a3550',fo:.9,stroke:C.dim,sw:2.5,rx:10});
 [[TX+30,YT+60],[TX+80,YT+100],[TX+35,YT+150]].forEach(([x,y])=>{s+=poly([[x-18,y],[x,y-18],[x+18,y]],{fill:C.hi,fo:.6})+rect(x-14,y,28,22,{fill:C.hi,fo:.35,stroke:'none',rx:2});});
 s+=label('町',TX+60,YB+10,{size:24,color:C.ink,anchor:'middle'});
 // top line with the lumped resistor, bottom line
 s+=line(GX,YT,RX1,YT,{color:C.ink,w:4})+line(RX2,YT,TX,YT,{color:C.ink,w:4})+line(GX,YB,TX,YB,{color:C.ink,w:4});
 const zz=[[RX1,YT]];for(let i=1;i<8;i++)zz.push([RX1+(RX2-RX1)*i/8,YT+(i%2?-16:16)]);zz.push([RX2,YT]);
 s+=draw(zz,1,{color:RC,w:4});
 if(heat>0)s+=fade(heat,`<rect x="${RX1-10}" y="${YT-34}" width="${RX2-RX1+20}" height="68" rx="14" fill="${PC}" fill-opacity=".22"/>`+[0,1,2,3].map(i=>draw([[RX1+25+i*40,YT-36],[RX1+35+i*40,YT-56],[RX1+22+i*40,YT-72],[RX1+32+i*40,YT-90]],1,{color:PC,w:3})).join(''));
 s+=rich(Rli,(RX1+RX2)/2,YT+58,{size:30});
 // current arrows
 if(cur>0)s+=fade(cur,arrow(GX+60,YT-22,GX+220,YT-22,{color:IC,w:4,head:14})+arrow(TX-60,YB+24,TX-220,YB+24,{color:IC,w:4,head:14})+(ilab?rich(Ii,GX+245,YT-14,{size:32}):''));
 // V送 between the lines (station side)
 if(vso>0)s+=fade(vso,arrow(GX+70,(YT+YB)/2,GX+70,YT+8,{color:VC,w:3.5,head:12})+arrow(GX+70,(YT+YB)/2,GX+70,YB-8,{color:VC,w:3.5,head:12})+rich(Vso,GX+120,(YT+YB)/2+12,{size:34}));
 // V線 along the resistor
 if(vli>0)s+=fade(vli,line(RX1,YT-110,RX2,YT-110,{color:VL,w:3})+line(RX1,YT-120,RX1,YT-100,{color:VL,w:3})+line(RX2,YT-120,RX2,YT-100,{color:VL,w:3})+rich(Vli,(RX1+RX2)/2,YT-122,{size:32}));
 return fade(g,s);
}
const Y2=430;
function helix(u,head=1){
 const N=600,tmax=5*2*Math.PI,pts=[];for(let i=0;i<=N*u;i++){const t=i/N*tmax;pts.push([t,170+t*24+55*Math.sin(t),250-85*Math.cos(t)]);}
 let s='';for(let i=0;i+1<pts.length;i++){const [t,x,y]=pts[i],[,X,Y]=pts[i+1];const front=Math.sin(t)>=0;s+=line(x,y,X,Y,{color:C.p,w:front?3.5:2,opacity:front?1:.35});}
 if(head&&pts.length)s+=dot(pts.at(-1)[1],pts.at(-1)[2],10,POS);
 return s;
} // formula line under the circuit

export const ytUeCurrent2Diagrams={
 // ===== S1 =====
 [K+'prev']:(p)=>card(150,70,900,370,
   L('電流・上級 1/2',600,120,{size:24,color:C.dim})
   +T(`${bv}=-\\dfrac{${et}${tau}}{m}${bE}`,600,200,{size:42})
   +fade(seg(p,.3,.45),T(`${bj}=${sig}${bE}`,380,320,{size:46}))
   +fade(seg(p,.45,.6),T(`${Rt}=${rho}\\dfrac{l}{${St}}`,820,320,{size:46})),seg(p,0,.15)),
 [K+'ask']:(p)=>{
  const glow=seg(p,.1,.4);
  let s=rect(80,180,560,110,{fill:PC,fo:.1+.3*glow,stroke:PC,sw:3,rx:20});
  s+=fade(glow,[140,240,340,440,540].map(x=>draw([[x,170],[x+12,140],[x-6,115],[x+8,90]],1,{color:PC,w:3})).join(''));
  s+=label('衝突で 渡した エネルギー → 熱',360,340,{size:26,color:PC,anchor:'middle',weight:700});
  s+=card(700,90,460,330,L('前回の 最後の 問い',930,140,{size:24,color:C.dim})+L('送電線の 損失を',930,215,{size:30})+L('減らすには',930,265,{size:30})
   +L('なぜ 電圧を 上げる？',930,345,{size:32,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'tower']:(p)=>{
  let s='';
  // pylons with lines, station left, town right
  const xs=[260,500,740,980],top=120,gy=430;
  s+=line(40,gy,1160,gy,{color:C.faint,w:3});
  s+=rect(40,gy-110,130,110,{fill:'#2a3550',fo:.9,stroke:C.dim,sw:2,rx:8})+label('発電所',105,gy-45,{size:24,anchor:'middle'});
  s+=fade(seg(p,.05,.3),xs.map(x=>draw([[x-40,gy],[x,top],[x+40,gy]],1,{color:C.dim,w:3})+line(x-50,top+30,x+50,top+30,{color:C.dim,w:3})+line(x-60,top+60,x+60,top+60,{color:C.dim,w:3})).join(''));
  const w=seg(p,.2,.5);
  s+=draw([[170,gy-100],[220,top+30],[1020,top+30],[1070,gy-60]],w,{color:C.ink,w:2.5})+draw([[170,gy-70],[210,top+60],[1030,top+60],[1090,gy-50]],w,{color:C.ink,w:2.5});
  s+=[[1050,gy],[1100,gy],[1150,gy]].map(([x,y])=>poly([[x-20,y-30],[x,y-52],[x+20,y-30]],{fill:C.hi,fo:.6})+rect(x-16,y-30,32,30,{fill:C.hi,fo:.35,stroke:'none',rx:2})).join('')+label('町',1100,gy+34,{size:24,anchor:'middle'});
  s+=fade(seg(p,.45,.6),card(380,230,440,90,L('数十万 V',600,288,{size:38,color:VC,weight:700}),1,VC));
  s+=fade(seg(p,.75,.9),L('高い 電圧は 危ないのに、なぜ？',600,490,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(110,110,450,260,L('①',335,170,{size:34,color:PC,weight:700})+L('熱に なる 量を',335,240,{size:30})+L('式に する',335,290,{size:30,color:PC,weight:700}),seg(p,0,.2));
  s+=card(640,110,450,260,L('②',865,170,{size:34,color:VC,weight:700})+L('送る 電力 と',865,240,{size:30})+L('線で 失う 電力',865,290,{size:30,color:PC,weight:700}),seg(p,.45,.6));
  return s;
 },
 // ===== S2 仕事率 =====
 [K+'pw:force']:(p)=>{
  const x=600,y=250;
  let s=arrow(380,90,560,90,{color:EC,w:5,head:16})+T(bE,590,100,{size:34});
  s+=dot(x,y,14,NEG)+ring(x,y,19,{color:C.hi,w:2.5});
  s+=fade(seg(p,.1,.25),arrow(x-22,y-36,x-180,y-36,{color:FC,w:5,head:16})+T('\\mathbf{F}',x-210,y-28,{size:32,color:FC}));
  s+=fade(seg(p,.2,.35),arrow(x-22,y+38,x-160,y+38,{color:VEL,w:5,head:16})+T(bv,x-188,y+48,{size:32}));
  s+=card(760,110,400,260,L('仕事・上級：仕事率',960,160,{size:24,color:C.dim})+T(`P=\\mathbf{F}\\cdot${bv}`,960,250,{size:50})+L('1秒 あたりの 仕事',960,330,{size:24,color:PC}),seg(p,.4,.55));
  return s;
 },
 [K+'pw:one']:(p)=>{
  const x=600,y=250;
  let s=arrow(380,90,560,90,{color:EC,w:5,head:16})+T(bE,590,100,{size:34});
  s+=dot(x,y,14,NEG)+ring(x,y,19,{color:C.hi,w:2.5});
  s+=arrow(x-22,y-36,x-180,y-36,{color:FC,w:5,head:16})+T(`-${et}${bE}`,x-230,y-28,{size:32});
  s+=arrow(x-22,y+38,x-160,y+38,{color:VEL,w:5,head:16})+T(bv,x-188,y+48,{size:32});
  s+=card(760,110,400,260,L('電子 1個',960,160,{size:26,color:C.dim})+T(`P_1=(-${et}${bE})\\cdot${bv}`,960,255,{size:44}),seg(p,.2,.4));
  return s;
 },
 [K+'pw:sign']:(p)=>{
  const x=600,y=250;
  let s=arrow(380,90,560,90,{color:EC,w:5,head:16})+T(bE,590,100,{size:34})+label('電場：右',300,100,{size:24,color:EC,anchor:'end'});
  s+=dot(x,y,14,NEG)+ring(x,y,19,{color:C.hi,w:2.5});
  s+=arrow(x-22,y-36,x-180,y-36,{color:FC,w:5,head:16})+T(`-${et}${bE}`,x-230,y-28,{size:32});
  s+=arrow(x-22,y+38,x-160,y+38,{color:VEL,w:5,head:16})+T(bv,x-188,y+48,{size:32});
  s+=fade(seg(p,.15,.3),label('どちらも 左',x-100,y+110,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(760,110,400,260,T(`P_1=(-${et}${bE})\\cdot${bv}`,960,180,{size:40})+fade(seg(p,.4,.55),T('>0',960,260,{size:48,color:OK})+L('電場は 正の 仕事',960,330,{size:26,color:OK,weight:700})),1);
  return s;
 },
 [K+'pw:heat']:(p)=>{
  // a few ions; electron passes energy to one ion that glows and vibrates
  let s='';const IX=[[200,180],[380,180],[560,180],[740,180],[290,330],[470,330],[650,330]];
  const hit=5,glow=seg(p,.35,.55),vib=glow*Math.sin(p*80)*6;
  IX.forEach(([x,y],i)=>{const on=i===hit;const xx=x+(on?vib:0);
   if(on&&glow>0)s+=fade(glow,`<circle cx="${xx}" cy="${y}" r="40" fill="${PC}" fill-opacity=".3"/>`);
   s+=ring(xx,y,22,{color:on&&glow>.5?PC:POS,w:on?3.5:2.5,fill:'#3a1d2a'})+label('+',xx,y+8,{size:24,color:POS,anchor:'middle',weight:700});});
  const u=seg(p,.05,.35),ex=mix(820,IX[hit][0]+32,u),ey=mix(250,IX[hit][1]-18,u);
  s+=dot(ex,ey,12,NEG)+ring(ex,ey,17,{color:C.hi,w:2});
  s+=fade(seg(p,.4,.55),arrow(ex-6,ey+4,IX[hit][0]+14,IX[hit][1]-6,{color:PC,w:3,head:10}));
  s+=card(860,100,320,300,L('定常',1020,150,{size:24,color:C.dim})+L('平均の 速さは',1020,205,{size:26})+L('増えない',1020,245,{size:26,weight:700})
   +fade(seg(p,.45,.6),L('もらった 分 → 格子',1020,310,{size:24,color:PC})+L('→ 熱',1020,355,{size:30,color:PC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'pw:n']:(p)=>{
  let s=TF(`P_1=(-${et}${bE})\\cdot${bv}`,600,90,{size:40,g:.6});
  s+=fade(seg(p,.05,.2),L('1 m³ に n 個 → n を 掛ける',600,175,{size:26,color:C.hi,weight:700}));
  s+=TF(`n(-${et}${bE})\\cdot${bv}`,600,280,{size:50,g:seg(p,.15,.35)});
  s+=TF(`=(-n${et}\\,${bv})\\cdot${bE}`,600,410,{size:50,g:seg(p,.5,.7)});
  s+=fade(seg(p,.55,.7),L('並べ 替え',1000,410,{size:24,color:C.dim}));
  return s;
 },
 [K+'pw:je']:(p)=>{
  const r=row([`(-n${et}\\,${bv})`,'\\cdot',`${bE}`],130,{size:50});
  let s=r.svg+fade(seg(p,.05,.2),highlight(r.xs[0]-r.ws[0]/2-12,130-70,r.ws[0]+24,100,1,IC)+L('＝ 𝐣（電流密度）',r.xs[0],215,{size:26,color:IC,weight:700}));
  s+=TF(`${bj}\\cdot${bE}`,600,350,{size:64,box:true,g:seg(p,.3,.5),col:PC});
  s+=fade(seg(p,.55,.7),L('1 m³ あたりの 仕事率［W/m³］',600,465,{size:28,color:PC,weight:700}));
  return s;
 },
 [K+'pw:sig']:(p)=>{
  let s=TF(`${bj}\\cdot${bE}`,350,120,{size:50});
  s+=fade(seg(p,.05,.2),L('𝐣 ＝ σ𝐄 を 入れる',800,125,{size:26,color:C.hi,weight:700}));
  s+=TF(`=${sig}${bE}\\cdot${bE}=${sig}${Es}^2`,600,290,{size:58,box:true,g:seg(p,.25,.5),col:PC});
  s+=fade(seg(p,.6,.75),L('電場の 2乗に 比例して 熱が 出る',600,430,{size:28,color:PC,weight:700}));
  return s;
 },
 [K+'pw:whole']:(p)=>{
  // wire with length l and section S
  const X1=170,X2=1030,Y=120,Hh=48;
  let s=rect(X1,Y-Hh,X2-X1,2*Hh,{fill:PC,fo:.12,stroke:C.dim,sw:2.5,rx:16});
  s+=`<ellipse cx="${X1}" cy="${Y}" rx="15" ry="${Hh}" fill="${SC}" fill-opacity=".25" stroke="${SC}" stroke-width="3"/>`+T(St,X1-36,Y+12,{size:34});
  s+=line(X1,Y+Hh+20,X2,Y+Hh+20,{color:C.ink,w:2})+T('l',(X1+X2)/2,Y+Hh+48,{size:30});
  s+=fade(seg(p,.05,.2),L('体積 Sl',X2-80,Y+10,{size:26,color:C.ink,weight:700}));
  s+=TF(`P=${js}${Es}\\times ${St}\\,l`,600,290,{size:48,g:seg(p,.1,.3)});
  s+=TF(`=(${js}${St})\\times(${Es}\\,l)`,600,380,{size:48,g:seg(p,.35,.55)});
  s+=fade(seg(p,.6,.8),T(`=${It}\\times${Vt}`,600,470,{size:52})+L('jS ＝ I',300,470,{size:24,color:IC})+L('El ＝ V',900,470,{size:24,color:VC}));
  return s;
 },
 [K+'pw:i2r']:(p)=>{
  let s=TF(`P=${It}\\,${Vt}`,600,100,{size:52});
  s+=fade(seg(p,.05,.2),L('V ＝ RI を 入れる',950,105,{size:26,color:C.hi,weight:700}));
  s+=TF(`P=${It}\\,${Vt}=${It}^2${Rt}`,600,260,{size:66,box:true,g:seg(p,.25,.5),col:PC});
  s+=fade(seg(p,.6,.75),L('ジュール熱（抵抗で 出る 熱）',600,400,{size:32,color:PC,weight:700}));
  return s;
 },
 [K+'pw:cu']:(p)=>{
  let s=card(60,60,1080,120,L('前回の 銅線：1 mm²，1 m，1 A',600,105,{size:24,color:C.dim})+T(`${Rt}\\approx0.017${U('\\Omega')},\\quad ${Es}\\approx0.017${U('V/m')}`,600,150,{size:32}),seg(p,0,.15));
  s+=TF(`P=${It}^2${Rt}=1^2\\times0.017\\approx0.017${U('W')}`,600,275,{size:42,g:seg(p,.15,.35)});
  s+=fade(seg(p,.5,.7),TF(`${sig}${Es}^2\\times 10^{-6}${U('m^3')}=5.96\\times10^{7}\\times0.017^2\\times10^{-6}\\approx0.017${U('W')}`,600,400,{size:34}));
  s+=fade(seg(p,.75,.9),L('同じ ✓',600,480,{size:28,color:OK,weight:700}));
  return s;
 },
 // ===== S3 送る電力と失う電力 =====
 [K+'tx:pic']:(p)=>circuit({g:seg(p,0,.2),cur:seg(p,.3,.5)})+fade(seg(p,.6,.75),L('2本の 線の 抵抗を まとめて 1か所に',600,Y2+20,{size:28,color:RC,weight:700})),
 [K+'tx:psend']:(p)=>circuit({cur:1,vso:seg(p,.05,.25)})+fade(seg(p,.4,.6),rich(R2(Pso,op(' ＝ '),Vso,op(' '),Ii),600,Y2+30,{size:48})),
 [K+'tx:i']:(p)=>circuit({cur:1,vso:1})+rich(R2(Pso,op(' ＝ '),Vso,op(' '),Ii),330,Y2+30,{size:40})
   +fade(seg(p,.15,.35),rich(R2(Ii,op(' ＝ '),Pso,op(' / '),Vso),830,Y2+30,{size:48}))+fade(seg(p,.6,.75),label('V送 ↑ → I ↓',830,Y2-30,{size:26,color:C.hi,anchor:'middle',weight:700})),
 [K+'tx:ploss']:(p)=>circuit({cur:1,vso:1,heat:seg(p,.05,.3)})+fade(seg(p,.35,.55),rich(R2(Pson,op(' ＝ '),Ii,[['²',IC]],Rli),600,Y2+30,{size:48}))
   +fade(seg(p,.35,.55),label('線で 熱に なる',880,Y2+26,{size:26,color:PC})),
 [K+'tx:vline']:(p)=>circuit({cur:1,vso:1,heat:1,vli:seg(p,.05,.25)})+rich(R2(Vli,op(' ＝ '),Ii,op(' '),Rli),330,Y2+30,{size:40})
   +fade(seg(p,.5,.7),rich(R2(Pson,op(' ＝ '),Vli,op(' '),Ii),850,Y2+30,{size:40})),
 [K+'tx:predict']:(p)=>circuit({cur:1,vso:1,heat:1})+card(300,370,600,120,rich(R2(Vso,op(' を 10倍 → '),Pson,op(' は 何倍？')),600,445,{size:36}),seg(p,0,.2),C.hi),
 [K+'tx:answer']:(p)=>{
  let s=circuit({cur:1,vso:1,heat:clamp(1-seg(p,.4,.8)*.85),ilab:1});
  s+=fade(seg(p,.05,.25),rich(R2(Ii,op(' → 1/10')),330,Y2+30,{size:44}));
  s+=fade(seg(p,.4,.6),rich(R2(Pson,op(' ∝ '),Ii,[['²',IC]],op(' → 1/100')),830,Y2+30,{size:44}));
  return s;
 },
 [K+'tx:wrong']:(p)=>{
  let s=rich(R2([['P',PC,'i']],op(' ＝ '),op('('),Vso,op(')²'),op(' / '),Rli),600,150,{size:60});
  const x=seg(p,.15,.35);
  s+=fade(x,line(380,90,820,180,{color:BAD,w:6})+line(380,180,820,90,{color:BAD,w:6}));
  s+=fade(seg(p,.4,.6),L('× V送 を 上げると 損失が 増える？（逆の 答え）',600,290,{size:30,color:BAD,weight:700}));
  s+=fade(seg(p,.6,.8),L('V送 は 線の 両端の 電圧 では ない',600,380,{size:28,color:C.ink}));
  return s;
 },
 [K+'tx:right']:(p)=>{
  let s=circuit({cur:1,vso:.35,heat:1,vli:1,g:.55});
  s+=fade(seg(p,.05,.25),rich(R2(op('('),Vli,op(')²'),op(' / '),Rli,op(' ＝ ('),Ii,op(' '),Rli,op(')'),[['²',C.ink]],op(' / '),Rli),600,Y2-10,{size:40}));
  s+=fade(seg(p,.5,.7),rich(R2(op('＝ '),Ii,[['²',IC]],Rli,op('  同じ ✓')),600,Y2+50,{size:42}));
  return s;
 },
 // ===== S4 1 MW =====
 ...(()=>{
  const o={};
  const setCard=(g=1)=>card(60,40,1080,90,rich(R2(Pso,op(' ＝ 1 MW，  '),Rli,op(' ＝ 10 Ω   （線の 抵抗 一定，変圧器の 損失 なし）')),600,98,{size:30}),g);
  const colL=(g,kk)=>{let s='';
   s+=fade(g,L('10 kV',330,175,{size:36,color:VC,weight:700}));
   if(kk>=1)s+=fade(kk>=1?1:0,T(`${It}=\\dfrac{10^6}{10^4}=100${U('A')}`,330,250,{size:36}));
   if(kk>=2)s+=rich(R2(Pson,op(' ＝ 100² × 10 ＝ 100 kW')),330,335,{size:30})+L('（10%）',330,378,{size:26,color:PC,weight:700});
   if(kk>=3)s+=rich(R2(Vli,op(' ＝ 100 × 10 ＝ 1000 V')),330,440,{size:30});
   return s;};
  const colR=(g,kk)=>{let s='';
   s+=fade(g,L('100 kV',870,175,{size:36,color:VC,weight:700}));
   if(kk>=1)s+=T(`${It}=\\dfrac{10^6}{10^5}=10${U('A')}`,870,250,{size:36});
   if(kk>=2)s+=rich(R2(Pson,op(' ＝ 10² × 10 ＝ 1 kW')),870,335,{size:30})+L('（0.1%）',870,378,{size:26,color:PC,weight:700});
   if(kk>=3)s+=rich(R2(Vli,op(' ＝ 10 × 10 ＝ 100 V')),870,440,{size:30});
   return s;};
  o[K+'num:set']=(p)=>setCard(seg(p,0,.2))+fade(seg(p,.4,.6),`<g transform="translate(150 150) scale(.75)">${circuit({cur:1,vso:1,heat:1})}</g>`);
  o[K+'num:i10']=(p)=>setCard()+colL(1,seg(p,.2,.4)>.5?1:0);
  o[K+'num:l10']=(p)=>setCard()+colL(1,1)+fade(seg(p,.1,.3),colL(0,2));
  o[K+'num:v10']=(p)=>setCard()+colL(1,2)+fade(seg(p,.1,.3),rich(R2(Vli,op(' ＝ 100 × 10 ＝ 1000 V')),330,440,{size:30}))+fade(seg(p,.5,.7),L('≠ 10 kV（別の 電圧）',330,490,{size:24,color:VL,weight:700}));
  o[K+'num:l100']=(p)=>setCard()+colL(1,3)+line(600,150,600,470,{color:C.faint,w:2})+colR(seg(p,0,.15),0)+fade(seg(p,.1,.3),colR(0,1))+fade(seg(p,.4,.6),colR(0,2));
  o[K+'num:bar']=(p)=>{
   // two bar groups: current and loss, 10 kV vs 100 kV (linear scale)
   let s=L('送る 電力 1 MW，R線 ＝ 10 Ω',600,42,{size:24,color:C.dim});
   const base=430,Hh=300,g=seg(p,.05,.4);
   const bar=(x,h,c,t,lab)=>rect(x-45,base-h*g,90,h*g,{fill:c,fo:.55,stroke:c,sw:2,rx:4})+fade(g,L(t,x,base-h*g-12,{size:24,color:c,weight:700}))+L(lab,x,base+34,{size:24,color:VC});
   s+=line(80,base,1120,base,{color:C.dim,w:2});
   s+=L('電流',335,84,{size:28,color:IC,weight:700})+bar(250,Hh,IC,'100 A','10 kV')+bar(420,Hh/10,IC,'10 A','100 kV');
   s+=L('損失',865,84,{size:28,color:PC,weight:700})+bar(780,Hh,PC,'100 kW','10 kV')+bar(950,Math.max(3,Hh/100),PC,'1 kW','100 kV');
   s+=fade(seg(p,.5,.65),L('1/10',420,300,{size:34,color:C.hi,weight:700})+L('1/100',950,320,{size:34,color:C.hi,weight:700}));
   return s;};
  o[K+'num:wrong']=(p)=>{
   let s=rich(R2(op('('),Vso,op(')²'),op(' / '),Rli,op(' ＝ (10⁵)² / 10 ＝ 10⁹ W')),600,140,{size:46});
   s+=fade(seg(p,.25,.45),L('＝ 1000 MW',600,230,{size:36,color:BAD,weight:700}));
   s+=fade(seg(p,.45,.6),L('送る 電力 1 MW の 千倍 → ありえない',600,320,{size:30,color:BAD,weight:700}));
   s+=fade(seg(p,.6,.8),line(250,95,950,170,{color:BAD,w:5})+L('V送 を 入れては いけない',600,420,{size:28,color:C.ink}));
   return s;};
  o[K+'num:home']=(p)=>{
   let s='';const y=250;
   const box=(x,t1,t2,c)=>card(x-130,y-80,260,160,L(t1,x,y-20,{size:28,weight:700})+L(t2,x,y+35,{size:30,color:c,weight:700}));
   s+=box(200,'送電線','数十万 V',VC)+fade(seg(p,.2,.4),arrow(340,y,450,y,{color:C.dim,w:4,head:14})+box(600,'変圧器','電圧を 下げる',C.hi))+fade(seg(p,.5,.7),arrow(740,y,850,y,{color:C.dim,w:4,head:14})+box(1000,'家','100 V',VC));
   s+=fade(seg(p,.1,.3),L('電流 小 → 損失 小',200,y+130,{size:24,color:PC}));
   return s;};
  return o;
 })(),
 // ===== S5 =====
 [K+'sum:1']:(p)=>{
  let s=L('仕事率（熱）',600,80,{size:28,color:PC,weight:700});
  s+=TF(`(-${et}${bE})\\cdot${bv}\\ \\to\\ ${bj}\\cdot${bE}=${sig}${Es}^2\\ \\to\\ P=${It}${Vt}=${It}^2${Rt}`,600,200,{size:42,g:seg(p,.05,.4)});
  s+=fade(seg(p,.6,.75),L('ジュール熱',600,310,{size:32,color:PC,weight:700}));
  return s;
 },
 [K+'sum:2']:(p)=>{
  let s=rich(R2(Pso,op(' ＝ '),Vso,op(' '),Ii,op('  を 固定')),600,100,{size:40});
  s+=fade(seg(p,.2,.4),rich(R2(Vso,op(' ↑  →  '),Ii,op(' ↓  →  '),Pson,op(' ＝ '),Ii,[['²',IC]],Rli,op(' ↓↓')),600,230,{size:44}));
  return s;
 },
 [K+'sum:3']:(p)=>{
  let s=circuit({cur:1,vso:1,vli:1,heat:.6});
  s+=fade(seg(p,.05,.25),rich(R2(Vso,op('：2本の 線の 間')),330,Y2+30,{size:32}))+fade(seg(p,.25,.45),rich(R2(Vli,op('：線に 沿う 下がり')),850,Y2+30,{size:32}));
  return s;
 },
 [K+'sum:next']:(p)=>{
  let s=arrow(100,250,1080,250,{color:C.E,w:4,head:16})+T('\\mathbf{B}',1110,260,{size:34,color:C.E});
  s+=helix(seg(p,.05,.7),1);
  s+=fade(seg(p,.7,.85),L('一周で どれだけ 進む？',600,440,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'sum:next2']:(p)=>{
  let s=arrow(100,250,1080,250,{color:C.E,w:4,head:16})+T('\\mathbf{B}',1110,260,{size:34,color:C.E});
  s+=fade(.4,helix(1,0));
  s+=card(250,340,700,150,L('導線の 中の 無数の 電荷の 力を 束ねると',600,395,{size:28})+L('導線 全体の 力は？',600,450,{size:32,color:C.hi,weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
};
