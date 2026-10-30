// 問題編 解説「送電の電圧を2倍にすると、損失は？」(ys-qx-hs-e-power-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/402_電力とジュール熱.md の q-hs-e-power-2（解説 22 行）。
// 色（正本の指示）：電流 I 緑、電圧 V 紫、電力 P・電力量 W・熱 橙、時間 t 金、抵抗 R 白（power-2）、強調 黄。送電の場面では凡例「R 白」を出す。
// 記号：電力量・熱の量は斜めの W（橙）、単位のワットはまっすぐな W。日本語の添字（送・損・線）は TeX に入れず、rich()（SVG の tspan）で書く。
// 前半（小問1）：P–t グラフ（左）と式のカード（右 x≥740）。後半（小問2・3）：発電所 → 往復2本の電線 → 家。電線の抵抗 R線（往復2本の合計）を上の線に1か所まとめて描く。
//   つまみ（送電の電圧）は発電所の右下。下の帯（x≥420、y≥345）に式・誤答カード。札の帯（y＜78）には図を描かない。
// 単元動画（yt1-hs-e-power-1・2）の部品（抵抗のギザギザ・熱の波線・場面の時刻・rich）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,fade,label,line,rect,arrow,tex,poly,ring,dot,mix} from './anim.mjs';
import {heatWaves,resistor,sceneT} from './yt1-hs-e-power-1-diagrams.mjs';
import {rich,Pso,Pson,Vso,Vli,Rli,Ii} from './yt1-hs-e-power-2-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,legend,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-e-power-2:';
const IC=C.F,VC=C.v,PC=C.E,TC=C.t,RC=C.ink,HI=C.hi,DIM=C.dim;
const Wt=`{\\color{${PC}}W}`,Pt=`{\\color{${PC}}P}`,tt=`{\\color{${TC}}t}`;
const U=s=>`\\,\\mathrm{${s}}`;
const TX=(src,x,y,o={})=>tex(src,x,y,{size:44,auto:false,...o});
const G1='電力量（kWh）',G2='電線で失う電力',G3='損失の倍率';
const A1=g=>answerTag(1,'D','0.40 kWh',{g}),A2=g=>answerTag(2,'B',{tex:`5.0\\times10^3${U('W')}`},{g}),A3=g=>answerTag(3,'C','1/4 倍',{g});
const LEG=(g=1)=>legend([['R 白',RC]],1062,112,{g});
const frame=(x,y,w,h,g=1,sw=3.5)=>fade(g,rect(x,y,w,h,{fill:HI,fo:0,stroke:HI,sw,rx:8}));
const sw=(ctx,i,d=.5)=>{const W=sentWin(ctx);return W[i]?W[i][0]:d;};
const op=(t,c=C.ink)=>[[t,c]];
const R2=(...a)=>a.flat();
// 右のカード（前半）
const RX=740,RW=440;
const rcard=(y,h,inner,g=1,col=C.faint)=>card(RX,y,RW,h,inner,g,col);
const rtext=(t,y,{size=30,color=C.ink}={})=>label(t,RX+RW/2,y,{size,color,anchor:'middle',weight:700});

// ================= P–t グラフ =================
const G={x:150,y:430,w:440,h:290,tmax:45,pmax:1300};
const gx=m=>G.x+G.w*m/G.tmax,gy=w=>G.y-G.h*w/G.pmax;
function axes({g=1,hours=0,bare=0}={}){
 let s=arrow(G.x-10,G.y,G.x+G.w+30,G.y,{color:DIM,w:2.5,head:14})+arrow(G.x,G.y+10,G.x,G.y-G.h-14,{color:DIM,w:2.5,head:14});
 if(bare)return fade(g,s);
 s+=label('時間 t',G.x+G.w+40,G.y+9,{size:24,color:TC,weight:700})+label('電力 P',G.x,G.y-G.h-26,{size:24,color:PC,anchor:'middle',weight:700});
 s+=[[0,'0'],[15,'15分'],[45,'45分']].map(([m,t])=>line(gx(m),G.y-6,gx(m),G.y+6,{color:DIM})+label(t,gx(m),G.y+32,{size:22,color:DIM,anchor:'middle'})).join('');
 s+=[400,800].map(v=>line(G.x-6,gy(v),G.x+6,gy(v),{color:DIM})+label(`${v} W`,G.x-12,gy(v)+8,{size:22,color:DIM,anchor:'end'})).join('');
 if(hours>0)s+=fade(hours,label('0.25 h',gx(15),G.y+66,{size:24,color:TC,anchor:'middle',weight:700})+label('0.75 h',gx(45),G.y+66,{size:24,color:TC,anchor:'middle',weight:700}));
 return fade(g,s);
}
// 水平な線（p1・p2＝引いた割合）と札
function steps({p1=1,p2=1,labs=1,dash=0}={}){
 let s='';
 if(p1>0)s+=line(gx(0),gy(800),mix(gx(0),gx(15),p1),gy(800),{color:PC,w:5});
 if(p2>0)s+=line(gx(15),gy(400),mix(gx(15),gx(45),p2),gy(400),{color:PC,w:5});
 if(dash)s+=fade(dash,line(gx(15),gy(800),gx(15),gy(400),{color:PC,w:2,dash:'5 6'}));
 if(labs>0){s+=fade(labs*seg(p1,.6,1),label('800 W・15分',gx(7.5)+14,gy(800)-16,{size:24,color:PC,anchor:'middle',weight:700}));
  s+=fade(labs*seg(p2,.6,1),label('400 W・30分',gx(30),gy(400)-16,{size:24,color:PC,anchor:'middle',weight:700}));}
 return s;
}
const rect1=(g=1,fo=.32)=>fade(g,rect(gx(0),gy(800),gx(15)-gx(0),G.y-gy(800),{fill:PC,fo,stroke:PC,sw:2,rx:0}));
const rect2=(g=1,fo=.32)=>fade(g,rect(gx(15),gy(400),gx(45)-gx(15),G.y-gy(400),{fill:PC,fo,stroke:PC,sw:2,rx:0}));
const kwh1=(g=1)=>fade(g,label('0.20 kWh',gx(7.5),(gy(800)+G.y)/2+9,{size:24,color:C.ink,anchor:'middle',weight:700}));
const kwh2=(g=1)=>fade(g,label('0.20 kWh',gx(30),(gy(400)+G.y)/2+9,{size:26,color:C.ink,anchor:'middle',weight:700}));
const graph=(o={})=>axes(o)+steps(o);

// ================= 送電の図 =================
const PX0=40,PX1=200,HX0=1030,HX1=1170,YT=160,YB=290,RX1=520,RX2=700,DX=300,DY=385;
function house(x,y){return poly([[x-46,y-36],[x,y-78],[x+46,y-36]],{fill:HI,fo:.5})+rect(x-36,y-36,72,56,{fill:HI,fo:.25,stroke:HI,sw:2,rx:2});}
// 送電の電圧のつまみ。ang＝針の向き（0＝2000 V、1＝4000 V）。mark4＝4000 V の目盛り
function dial({ang=0,mark4=0,g=1,lab=1,hi=0}={}){
 const A=d=>(-45+90*d)*Math.PI/180,P=(d,r)=>[DX+r*Math.sin(A(d)),DY-r*Math.cos(A(d))];
 let s=ring(DX,DY,30,{color:VC,w:3,fill:'#1d1a35'});
 const [a1,b1]=P(0,36),[a2,b2]=P(0,48);s+=line(a1,b1,a2,b2,{color:VC,w:3});
 s+=label('2000 V',DX-52,DY-44,{size:26,color:VC,anchor:'end',weight:700});
 if(mark4>0){const [c1,d1]=P(1,36),[c2,d2]=P(1,48);s+=fade(mark4,line(c1,d1,c2,d2,{color:VC,w:3})+label('4000 V',DX+52,DY-44,{size:26,color:VC,weight:700}));}
 const [px,py]=P(ang,26);s+=line(DX,DY,px,py,{color:C.ink,w:5})+dot(DX,DY,6,C.ink);
 if(lab)s+=label('送電の 電圧',DX,DY+56,{size:22,color:DIM,anchor:'middle'});
 if(hi>0)s+=frame(DX-150,DY-74,140,40,hi);
 return fade(g,s);
}
function trans({g=1,draw:dr=1,t=0,heat=0,cur=0,iw=12,ilab='',pso=1,rlab=1,wireHi=0,dial:dl={},pson=0,vli=0,heatLab='',heatLabG=1,psoHi=0}={}){
 let s='';
 const d1=seg(dr,0,.5),d2=seg(dr,.4,.9);
 s+=fade(d1,rect(PX0,YT-30,PX1-PX0,YB-YT+60,{fill:'#2a3550',fo:.9,stroke:DIM,sw:2.5,rx:10})+label('発電所',(PX0+PX1)/2,(YT+YB)/2+9,{size:26,color:C.ink,anchor:'middle'})
  +rect(HX0,YT-30,HX1-HX0,YB-YT+60,{fill:'#2a3550',fo:.9,stroke:DIM,sw:2.5,rx:10})+house((HX0+HX1)/2,YT+86)+label('家',(HX0+HX1)/2,YB+12,{size:26,color:C.ink,anchor:'middle'}));
 s+=fade(d2,line(PX1,YT,RX1,YT,{color:C.ink,w:4})+line(RX2,YT,HX0,YT,{color:C.ink,w:4})+line(PX1,YB,HX0,YB,{color:C.ink,w:4}));
 if(wireHi>0)s+=frame(PX1+8,YT-24,HX0-PX1-16,48,wireHi)+frame(PX1+8,YB-24,HX0-PX1-16,48,wireHi);
 if(heat>0)s+=fade(Math.min(1,heat),rect(RX1-12,YT-34,RX2-RX1+24,68,{fill:PC,fo:.25,stroke:'none',rx:16}));
 s+=fade(d2,resistor(RX1,RX2,YT,{color:heat>.5?'#ffd2a0':RC,n:7}));
 if(heat>0)s+=heatWaves(RX1,RX2,YT,t,{g:Math.min(1,heat),n:Math.max(1,Math.round(4*heat)),h:8+46*heat});
 if(heatLab)s+=fade(heatLabG,label(heatLab,RX2+14,YT-46,{size:28,color:PC,weight:700}));
 if(rlab>0)s+=fade(rlab*d2,rich(R2(Rli,op(' ＝ 0.50 Ω')),(RX1+RX2)/2,YT+52,{size:32})+label('（往復 2本の 合計）',(RX1+RX2)/2,YT+84,{size:22,color:DIM,anchor:'middle'}));
 if(pso>0)s+=fade(pso*d1,rich(R2(Pso,op(' ＝ 200 kW',PC)),(PX0+PX1)/2+10,YT-48,{size:30,weight:700}));
 if(psoHi>0)s+=frame(PX0-6,YT-82,PX1-PX0+44,46,psoHi);
 if(cur>0){s+=fade(cur,arrow(PX1+20,YT-26,PX1+190,YT-26,{color:IC,w:iw,head:12+iw*1.2})+arrow(HX0-30,YB+26,HX0-230,YB+26,{color:IC,w:iw,head:12+iw*1.2}));
  if(ilab)s+=fade(cur,label(ilab,PX1+204,YT-16,{size:30,color:IC,weight:700}));}
 if(pson>0)s+=fade(pson,rich(R2(Pson,op('：電線で 熱に なる 電力',PC)),RX2+14,YT+96,{size:24,anchor:'start',weight:700}));
 if(vli>0){const y=YB-30;s+=fade(vli,line(RX1,y,RX2,y,{color:VC,w:3})+line(RX1,y-10,RX1,y+10,{color:VC,w:3})+line(RX2,y-10,RX2,y+10,{color:VC,w:3})
  +rich(R2(Vli,op(' ＝ 50 V',VC)),RX2+14,y+10,{size:30,anchor:'start',weight:700}));}
 s+=dial({g:d1,...dl});
 return fade(g,s);
}
// 下の帯のカード
const BX=430,BW=750;
const bcard=(y,h,inner,g=1,col=C.faint)=>card(BX,y,BW,h,inner,g,col);
const WOB={x:BX,w:BW,y:400,size:28,whySize:24};
// 200 kW の棒（2.5 % が橙）
function bar(g=1){
 const x0=BX+20,w=BW-40,y=440,f=.025;
 let s=rect(x0,y,w,34,{fill:'#2a3550',fo:.9,stroke:DIM,sw:2,rx:4})+rect(x0+w*(1-f),y,w*f,34,{fill:PC,fo:1,stroke:'none',rx:0});
 s+=label('送る 200 kW',x0,y-12,{size:24,color:PC,weight:700})+label('2.5 %（電線で 熱）',x0+w,y-12,{size:24,color:PC,anchor:'end',weight:700})+arrow(x0+w-60,y-6,x0+w-10,y+10,{color:PC,w:3,head:10});
 return fade(g,s);
}

export const qxHsEPower2Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1）：空の P–t グラフに、0〜15分 800 W、15〜45分 400 W の水平な線を左から順に引く。3 秒で静止（面積は塗らない）。
 [K+'q0']:(p)=>axes({g:seg(p,0,.15)})+steps({p1:seg(p,.12,.5),p2:seg(p,.55,.95)}),
 // 小問2：暗転して送電の図。P送＝200 kW、R線＝0.50 Ω（往復2本の合計）、つまみ 2000 V。3 秒で静止（電流・損失・熱の波線は出さない）。
 [K+'q2']:(p)=>trans({draw:seg(p,0,.8),pso:seg(p,.5,.8),rlab:seg(p,.6,.9)})+LEG(seg(p,.6,.9)),
 // 小問3：同じ図に、つまみの「4000 V」の目盛りを足して示す（つまみは回さない）。
 [K+'q3']:(p)=>trans({dial:{mark4:seg(p,.2,.6),hi:0}})+fade(seg(p,.2,.6),frame(DX+40,DY-74,150,40,1))+LEG(),
 // ================= S1 小問1 =================
 // 1. P–t グラフ。求めるもの：電力量（kWh）
 [K+'goal1']:(p)=>graph()+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 高さ（800 W）と幅（15分）を黄の枠 → P・t の札 → W＝Pt。2文目で長方形を塗り、W：電力量、高さ×幅＝面積
 [K+'area']:(p,ctx)=>{
  const b=sw(ctx,1,.5);
  let s=graph();
  s+=frame(G.x-8,gy(800),16,G.y-gy(800),seg(p,.03,.12)*(1-seg(p,b+.3,b+.4)),3)+frame(G.x,G.y-8,gx(15)-G.x,16,seg(p,.08,.17)*(1-seg(p,b+.3,b+.4)),3);
  s+=fade(seg(p,.12,.22),label('P：電力',G.x+10,gy(800)+34,{size:24,color:PC,weight:700})+label('t：時間',gx(7.5),G.y-16,{size:24,color:TC,anchor:'middle',weight:700}));
  s+=rcard(110,120,TX(`${Wt}=${Pt}${tt}`,RX+RW/2,186,{size:60}),seg(p,.25,.37),PC);
  s+=rect1(seg(p,b,b+.12));
  s+=fade(seg(p,b+.1,b+.2),label('W：電力量',gx(7.5),(gy(800)+G.y)/2+8,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=rcard(260,90,rtext('高さ × 幅 ＝ 面積',318,{size:32,color:PC}),seg(p,b+.15,b+.27),PC);
  s+=goalTag(G1);
  return s;
 },
 // 3. 分を時間に直す：15分＝0.25 h、30分＝0.50 h（横軸の下に 0.25 h・0.75 h）
 [K+'hours']:(p,ctx)=>{
  const b=sw(ctx,1,.4);
  let s=axes({hours:seg(p,b+.05,b+.2)})+steps()+rect1(1);
  s+=rcard(110,90,rtext('kWh で 答える',168,{size:30,color:PC}),seg(p,.03,.15),C.faint);
  s+=rcard(220,90,rtext('15分 ＝ 0.25 h',278,{size:32,color:TC}),seg(p,b+.05,b+.15),TC);
  s+=rcard(330,90,rtext('30分 ＝ 0.50 h',388,{size:32,color:TC}),seg(p,b+.3,b+.4),TC);
  s+=goalTag(G1);
  return s;
 },
 // 4. 1つ目 0.80 kW×0.25 h＝0.20 kWh、2つ目 0.40 kW×0.50 h＝0.20 kWh（高さは半分、幅は2倍）
 [K+'rects']:(p,ctx)=>{
  const b=sw(ctx,1,.5);
  let s=axes({hours:1})+steps()+rect1(1)+kwh1(seg(p,.25,.35));
  s+=rect2(seg(p,b,b+.1))+kwh2(seg(p,b+.25,b+.35));
  s+=rcard(110,120,rtext('0.80 kW × 0.25 h',160,{size:30})+rtext('＝ 0.20 kWh',208,{size:30,color:PC}),seg(p,.04,.16),PC);
  s+=rcard(250,120,rtext('0.40 kW × 0.50 h',300,{size:30})+rtext('＝ 0.20 kWh',348,{size:30,color:PC}),seg(p,b+.02,b+.14),PC);
  s+=fade(seg(p,b+.4,b+.5),label('高さは 半分、幅は 2倍',RX+RW/2,420,{size:28,color:HI,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 5. 足して 0.40 kWh。小問1 の答え D
 [K+'ans1']:(p,ctx)=>{
  const b=sw(ctx,1,.45);
  let s=axes({hours:1})+steps()+rect1(1)+rect2(1)+kwh1(1)+kwh2(1);
  s+=fade(seg(p,.05,.18),`<polyline points="${gx(0)},${G.y} ${gx(0)},${gy(800)} ${gx(15)},${gy(800)} ${gx(15)},${gy(400)} ${gx(45)},${gy(400)} ${gx(45)},${G.y} ${gx(0)},${G.y}" fill="none" stroke="${PC}" stroke-width="6" stroke-linejoin="round"/>`);
  s+=rcard(150,120,TX(`0.20+0.20=0.40${U('kWh')}`,RX+RW/2,222,{size:36}),seg(p,.05,.18),PC);
  s+=goalTag(G1)+A1(seg(p,b,b+.08));
  return s;
 },
 // 6. 誤答 A（1.2 kW×0.75 h：ない面積。点線の長方形を描いて消す）→ 誤答 C（片方だけ）
 [K+'wrongAC']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],dg=seg(p,.08,.2)*(1-seg(p,e-.1,e-.02));
  let s=axes({hours:1})+steps()+rect1(1)+rect2(1)+kwh1(1)+kwh2(1);
  s+=fade(dg,rect(gx(0),gy(1200),gx(45)-gx(0),G.y-gy(1200),{fill:'none',fo:0,stroke:C.ink,sw:3,rx:0}).replace('stroke-width="3"','stroke-width="3" stroke-dasharray="10 8"')+label('1200 W',G.x-12,gy(1200)+8,{size:22,color:DIM,anchor:'end'}));
  s+=fade(seg(p,W[1]?W[1][0]:.6,(W[1]?W[1][0]:.6)+.08),frame(gx(15)-6,gy(400)-6,gx(45)-gx(15)+12,G.y-gy(400)+12,1));
  s+=wrongSeq(p,ctx,[['A','0.90 kWh','1.2 kW×0.75 h（ない 面積）'],['C','0.20 kWh','片方だけ']],{opts:{x:RX,w:RW,y:150}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7. 誤答 B：24 kWh（分を h に直していない：kW·分）
 [K+'wrongB']:(p)=>{
  let s=axes({hours:1})+steps()+rect1(1)+rect2(1)+kwh1(1)+kwh2(1);
  s+=wrongCard('B','24 kWh','分を h に 直していない（kW·分）',{x:RX,w:RW,y:150,whySize:22,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2 =================
 // 8. 暗転して送電の図。求めるもの：電線で失う電力。電線を黄の枠で囲む
 [K+'goal2']:(p)=>trans({wireHi:seg(p,.3,.45)})+goalTag(G2,{g:seg(p,.05,.18)})+LEG(),
 // 9. 記号の札（V送：送電の電圧、I：電線を流れる電流）→ P送＝V送 I を I＝P送/V送 に
 [K+'Ieq']:(p,ctx)=>{
  const b=sw(ctx,1,.45),u=seg(p,b+.35,b+.45);
  let s=trans({cur:seg(p,.12,.25),iw:8,psoHi:seg(p,b,b+.08)*(1-seg(p,b+.3,b+.36))});
  s+=fade(seg(p,.04,.15),rich(R2(Vso,op('：送電の 電圧',VC)),DX+44,DY+6,{size:24,anchor:'start',weight:700}));
  s+=fade(seg(p,.12,.25),rich(R2(Ii,op('：電線を 流れる 電流',IC)),PX1+20,YT+44,{size:26,anchor:'start',weight:700}));
  let eq=fade(1-u,rich(R2(Pso,op(' ＝ '),Vso,op(' '),Ii),BX+BW/2,462,{size:44}));
  eq+=fade(u,rich(R2(Ii,op(' ＝ '),Pso,op(' ÷ '),Vso),BX+BW/2,462,{size:44}));
  s+=bcard(405,95,eq,seg(p,b+.08,b+.18),C.hi);
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 10. 200000÷2000 で、電流は 100 A（太い緑の矢印）
 [K+'I100']:(p)=>{
  let s=trans({cur:1,iw:mix(8,12,seg(p,.3,.5)),ilab:'100 A'});
  s+=bcard(405,95,TX(`200000\\div2000=100${U('A')}`,BX+BW/2,466,{size:40}),seg(p,.03,.15),IC);
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 11. P損：電線で熱になる電力 → P損＝R線 I²＝0.50×100²＝5.0×10³ W。熱の波線。小問2 の答え B
 [K+'loss']:(p,ctx)=>{
  const t=sceneT(p,ctx),b=sw(ctx,1,.7),h=seg(p,.45,.6);
  let s=trans({t,cur:1,iw:12,ilab:'100 A',heat:h,pson:seg(p,.04,.14),heatLab:'5.0×10³ W',heatLabG:seg(p,.5,.6)});
  let eq=fade(1-seg(p,.36,.42),rich(R2(Pson,op(' ＝ '),Rli,op(' '),Ii,op('²')),BX+BW/2,464,{size:44}));
  eq+=fade(seg(p,.4,.48),TX(`0.50\\times100^2=5.0\\times10^3${U('W')}`,BX+BW/2,466,{size:40}));
  s+=bcard(405,95,eq,seg(p,.16,.26),PC);
  s+=goalTag(G2)+A2(seg(p,b,b+.08))+LEG();
  return s;
 },
 // 12. 送る 200 kW のうち 2.5 % が電線で熱
 [K+'pct']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=trans({t,cur:1,iw:12,ilab:'100 A',heat:1,heatLab:'5.0×10³ W'});
  s+=bar(seg(p,.05,.2));
  s+=goalTag(G2)+A2(1)+LEG();
  return s;
 },
 // 13. 誤答 A：8.0×10⁶ W（送電の電圧を V²/R線 に入れた）。送る電力より大きい
 [K+'wrongA']:(p,ctx)=>{
  const t=sceneT(p,ctx),b=sw(ctx,1,.55);
  let s=trans({t,cur:1,iw:12,ilab:'100 A',heat:1,heatLab:'5.0×10³ W'});
  s+=wrongCard('A','8.0×10⁶ W','送電の 電圧を V²/R線 に 入れた',{...WOB,y:345,mid:`\\dfrac{2000^2}{0.50}=8.0\\times10^6${U('W')}`,midSize:28,g:seg(p,.03,.1)});
  s+=fade(seg(p,b,b+.08),frame(PX0-6,YT-82,PX1-PX0+44,46,1));
  s+=fade(seg(p,b,b+.08),label('＞ 送る 電力',PX1+50,YT-50,{size:24,color:HI,weight:700}));
  s+=goalTag(G2)+A2(1)+LEG();
  return s;
 },
 // 14. V²/R線 に入れてよいのは電線の両端の電圧 V線＝50 V（発電所の 2000 V とは別の場所）。50²÷0.50＝5.0×10³ W
 [K+'vline']:(p,ctx)=>{
  const t=sceneT(p,ctx),b=sw(ctx,1,.5);
  let s=trans({t,cur:1,iw:12,ilab:'100 A',heat:1,heatLab:'5.0×10³ W',vli:seg(p,.05,.18)});
  const a=seg(p,.18,.3)*(1-seg(p,b,b+.05));
  s+=fade(a,label('電線の 両端の 電圧',900,430,{size:28,color:VC,anchor:'middle',weight:700})+arrow(860,404,800,YB-4,{color:HI,w:4,head:14})
   +label('発電所の 電圧（別の 場所）',560,490,{size:26,color:VC,anchor:'middle',weight:700})+arrow(440,470,DX-60,DY-40,{color:HI,w:4,head:14}));
  s+=bcard(345,160,rich(R2(Vli,op(' ＝ 100 × 0.50 ＝ 50 V')),BX+BW/2,400,{size:36})+TX(`\\dfrac{50^2}{0.50}=5.0\\times10^3${U('W')}`,BX+BW/2,466,{size:38}),seg(p,b+.02,b+.12),VC);
  s+=goalTag(G2)+A2(1)+LEG();
  return s;
 },
 // 15. 誤答 C：50 W（2乗し忘れ。それは 50 V）→ 誤答 D：2.0×10⁵ W（送る電力全部ではない）
 [K+'wrongCD']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=trans({t,cur:1,iw:12,ilab:'100 A',heat:1,heatLab:'5.0×10³ W',vli:1});
  s+=wrongSeq(p,ctx,[['C','50 W','2乗し忘れ（それは 50 V）'],['D','2.0×10⁵ W','送る 電力 全部 ではない']],{opts:WOB});
  s+=goalTag(G2)+A2(1)+LEG();
  return s;
 },
 // ================= S3 小問3 =================
 // 16. カードと V線・2.5 % の棒を消す。つまみに 4000 V の目盛り。求めるもの：損失の倍率
 [K+'goal3']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=trans({t,cur:1,iw:12,ilab:'100 A',heat:1,heatLab:'5.0×10³ W',dial:{mark4:seg(p,.3,.45)}});
  s+=goalTag(G3,{g:seg(p,.05,.18)})+LEG();
  return s;
 },
 // 17. つまみを 2000 V → 4000 V。矢印が半分の太さ、100 A → 50 A
 [K+'I50']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=seg(p,.08,.3),v=seg(p,.3,.45);
  let s=trans({t,cur:1,iw:mix(12,6,v),ilab:v<.5?'100 A':'50 A',heat:1,heatLab:'5.0×10³ W',dial:{mark4:1,ang:u}});
  s+=bcard(405,95,TX(`200000\\div4000=50${U('A')}\\ \\ \\left(\\tfrac{1}{2}\\right)`,BX+BW/2,466,{size:38}),seg(p,.4,.52),IC);
  s+=goalTag(G3)+LEG();
  return s;
 },
 // 18. 熱の波線が 1/4 に。5.0×10³ W → 1.25×10³ W。(1/2)²＝1/4。小問3 の答え C
 [K+'loss4']:(p,ctx)=>{
  const t=sceneT(p,ctx),b=sw(ctx,1,.65),h=seg(p,.1,.3);
  let s=trans({t,cur:1,iw:6,ilab:'50 A',heat:mix(1,.25,h),heatLab:h<.5?'5.0×10³ W':'1.25×10³ W',dial:{mark4:1,ang:1}});
  let eq=fade(1-seg(p,b-.08,b-.02),TX(`0.50\\times50^2=1.25\\times10^3${U('W')}`,BX+BW/2,466,{size:38}));
  eq+=fade(seg(p,b-.04,b+.04),TX(`\\left(\\tfrac{1}{2}\\right)^2=\\tfrac{1}{4}`,BX+BW/2,466,{size:44}));
  s+=bcard(405,95,eq,seg(p,.03,.14),PC);
  s+=goalTag(G3)+A3(seg(p,b,b+.08))+LEG();
  return s;
 },
 // 19. 誤答 A：1/2 倍（損失は電流の2乗に比例）
 [K+'wrongA3']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=trans({t,cur:1,iw:6,ilab:'50 A',heat:.25,heatLab:'1.25×10³ W',dial:{mark4:1,ang:1}});
  s+=wrongCard('A','1/2 倍','損失は 電流の 2乗に 比例',{...WOB,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // 20. 誤答 B（4 倍：送電の電圧は電線の両端の電圧ではない）→ 誤答 D（変わらない：電流が変われば損失も変わる）
 [K+'wrongBD']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=trans({t,cur:1,iw:6,ilab:'50 A',heat:.25,heatLab:'1.25×10³ W',dial:{mark4:1,ang:1}});
  s+=wrongSeq(p,ctx,[['B','4 倍','送電の 電圧は 電線の 両端の 電圧 ではない'],['D','変わらない','電流が 変われば 損失も 変わる']],{opts:WOB});
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // 21. 損失は電流の2乗に比例：動画のように電圧を10倍 → 1/100（右下に小さく）
 [K+'ten']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=trans({t,cur:1,iw:6,ilab:'50 A',heat:.25,heatLab:'1.25×10³ W',dial:{mark4:1,ang:1}});
  s+=card(BX,405,390,95,label('損失 ∝ 電流の 2乗',BX+195,466,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,.04,.15),PC);
  s+=card(840,405,340,95,label('動画：電圧 10倍',1010,446,{size:24,color:DIM,anchor:'middle',weight:700})+label('→ 損失 1/100',1010,484,{size:28,color:HI,anchor:'middle',weight:700}),seg(p,.4,.52),HI);
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // ================= S4 まとめ =================
 // 22. P–t グラフの2つの長方形（計 0.40 kWh）と、2000 V・4000 V の送電を並べ、「電流 1/2 → 損失 1/4」を黄の枠で結ぶ
 [K+'sum']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  const mini=`<g transform="translate(-40 60) scale(.62)">${axes({bare:1})+steps({labs:0})+rect1(1)+rect2(1)}</g>`;
  let s=card(15,92,420,418,mini+label('電気代 ＝ 面積',225,420,{size:28,color:PC,anchor:'middle',weight:700})+label('計 0.40 kWh',225,470,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.03,.15),PC);
  const row=(y,v,iw,i,w,h)=>label(v,520,y+10,{size:28,color:VC,anchor:'middle',weight:700})+arrow(590,y,720,y,{color:IC,w:iw,head:12+iw*1.2})+label(i,740,y+10,{size:28,color:IC,weight:700})
   +resistor(850,950,y,{color:'#ffd2a0',n:4,amp:12})+heatWaves(850,950,y,t,{n:Math.max(1,Math.round(4*h)),h:8+40*h})+label(w,1170,y+10,{size:28,color:PC,anchor:'end',weight:700});
  s+=card(450,92,735,418,row(190,'2000 V',12,'100 A','5.0×10³ W',1)+row(330,'4000 V',6,'50 A','1.25×10³ W',.25),seg(p,.2,.32),C.faint);
  s+=fade(seg(p,.45,.55),card(560,410,520,70,label('電流 1/2 → 損失 1/4',820,456,{size:32,color:HI,anchor:'middle',weight:700}),1,HI)
   +line(745,212,745,300,{color:HI,w:3,dash:'6 6'})+line(1110,212,1110,300,{color:HI,w:3,dash:'6 6'}));
  s+=answerRow([[1,'D',''],[2,'B',''],[3,'C','']],{g:seg(p,.6,.7)});
  return s;
 },
};
