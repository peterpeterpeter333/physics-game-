// 問題編 解説「x-t グラフの2本の直線」(ys-qx-hs-m1-velocity-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/101_速度.md の q-hs-m1-velocity-2（解説 20 行）。
// 上段：数直線（−10〜20 m）。P は線の上、Q は線の下に描く（同じ位置に来ても両方見えるように）。速度の矢印は線の上。
// 下段（左）：x-t グラフ（t 0〜5.5 s、x −8〜14 m）。右側は式・札・誤答カードの置き場。
// 色（01_共通の約束）：位置 x 水色、速度 v 紫、時刻 t 金、強調 黄、誤り 赤。P（白）・Q（灰青）は物体の印。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,texWidth,axes,clamp,mix} from './anim.mjs';
import {QC,card,goalTag,answerTag,wrongCard,wrongSeq,kindTag,pauseBadge,sentWin,voiceEnd,cueT,tAt,textW} from './yt1-qx-common.mjs';

const K='qx-hs-m1-velocity-2:';
const X=QC.x,V=QC.v,T=QC.t,HI=QC.hi,BAD=QC.bad;
const PC='#e8eef8',QCOL='#a9bbd8';
const G1='同じ位置に来る時刻',G2='Q の 0〜5 s の変位',G3='速いのはどちらか、その理由';
const A1=g=>answerTag(1,'B','3 s',{g}),A2=g=>answerTag(2,'C','−10 m',{g}),A3=g=>answerTag(3,'D','P、傾きの大きさ',{g});
const B=(s,x,y,o={})=>label(s,x,y,{weight:700,...o});
const mstr=m=>m<0?`−${-m}`:String(m);
const xP=t=>-6+4*t,xQ=t=>12-2*t;
// TeX の色
const cx=s=>`{\\color{${X}}${s}}`,cv=s=>`{\\color{${V}}${s}}`,ct=s=>`{\\color{${T}}${s}}`,ch=s=>`{\\color{${HI}}${s}}`;
const tt=ct('t');

// ---- 上段：数直線 -------------------------------------------------------------------------------
const NY=140,NX=m=>140+(m+10)*30;
function numberLine({g=1,y=NY}={}){
 let s=line(NX(-10)-10,y,NX(20)+14,y,{color:C.dim,w:3})+arrow(NX(20)+6,y,NX(20)+30,y,{color:C.dim,w:3,head:12});
 for(let m=-10;m<=20;m++)s+=line(NX(m),y-(m%5?5:10),NX(m),y+(m%5?5:10),{color:m%5?C.faint:X,w:2});
 for(let m=-10;m<=20;m+=5)s+=label(mstr(m),NX(m),y+62,{size:22,color:m===0?C.ink:X,anchor:'middle'});
 s+=label('x [m]',NX(20)+38,y+8,{size:22,color:X});
 return fade(g,s);
}
function obj(name,m,{g=1,y=NY,hl=0}={}){
 const up=name==='P',cy=up?y-20:y+20,col=up?PC:QCOL;
 let s=line(NX(m),y,NX(m),cy,{color:col,w:2})+dot(NX(m),cy,17,col)+B(name,NX(m),cy+8,{size:22,color:C.bg,anchor:'middle'});
 if(hl>0)s+=fade(hl,ring(NX(m),cy,26,{color:HI,w:4}));
 return fade(g,s);
}
function vArrow(name,m,{g=1,y=NY,hl=0,txt=1}={}){
 const v=name==='P'?4:-2,ya=y-56,x1=NX(m+v);
 let s=arrow(NX(m),ya,x1,ya,{color:hl>.5?HI:V,w:6,head:16});
 if(txt)s+=B(v>0?'＋4 m/s':'−2 m/s',v>0?x1+10:x1-10,ya+8,{size:24,color:hl>.5?HI:V,anchor:v>0?'start':'end'});
 return fade(g,s);
}
// 上段の全体（時刻 t の位置）
function top(t,{g=1,P=1,Q=1,arrows=1,txt=1,hlP=0,hlQ=0,hlPv=0,hlQv=0}={}){
 let s=numberLine({g});
 if(P)s+=fade(g*P,obj('P',xP(t),{hl:hlP})+(arrows?vArrow('P',xP(t),{hl:hlPv,txt}):''));
 if(Q)s+=fade(g*Q,obj('Q',xQ(t),{hl:hlQ})+(arrows?vArrow('Q',xQ(t),{hl:hlQv,txt}):''));
 return s;
}
// ---- 下段：x-t グラフ ---------------------------------------------------------------------------
const GA=(g=1)=>axes({x:200,y:495,w:470,h:250,xmin:0,xmax:5.5,ymin:-8,ymax:14,xlabel:'t [s]',ylabel:'',xticks:[1,2,3,4,5],yticks:[-6,0,6,12],grid:true,g,xcolor:T,ycolor:X});
const A0=GA();
function graph({g=1,pts=1,to=0,full=0,hlLines=0,glow=0}={}){
 let s=A0.svg+label('x [m]',A0.X(0)-14,A0.Y(14)-2,{size:22,color:X,anchor:'end'});
 const t1=Math.max(to,full?5:0);
 if(t1>0){s+=A0.plot(xP,{from:0,to:Math.min(t1,5),color:PC,w:4,steps:2})+A0.plot(xQ,{from:0,to:Math.min(t1,5),color:QCOL,w:4,steps:2});
  if(full)s+=fade(full,B('P',A0.X(5)+12,A0.Y(14)+16,{size:24,color:PC})+B('Q',A0.X(5)+12,A0.Y(2)-8,{size:24,color:QCOL}));}
 if(hlLines>0)s+=fade(hlLines,A0.plot(xP,{from:0,to:5*clamp(hlLines*1.2),color:HI,w:7,steps:2})+A0.plot(xQ,{from:0,to:5*clamp(hlLines*1.2),color:HI,w:7,steps:2}));
 if(pts)s+=fade(pts,dot(A0.X(0),A0.Y(-6),9,PC)+dot(A0.X(0),A0.Y(12),9,QCOL)+B('P',A0.X(0)+16,A0.Y(-6)+26,{size:22,color:PC})+B('Q',A0.X(0)+16,A0.Y(12)-12,{size:22,color:QCOL}));
 if(glow>0)s+=fade(glow,ring(A0.X(3),A0.Y(6),18,{color:HI,w:4})+dot(A0.X(3),A0.Y(6),9,HI)+B('(3, 6)',A0.X(3)+18,A0.Y(6)-18,{size:24,color:HI}));
 return fade(g,s);
}
// 傾きの三角形（t＝1→2）
function slopeTri(name,{g=1,hl=0}={}){
 const f=name==='P'?xP:xQ,a=[A0.X(1),A0.Y(f(1))],b=[A0.X(2),A0.Y(f(1))],c=[A0.X(2),A0.Y(f(2))],up=name==='P';
 let s=line(a[0],a[1],b[0],b[1],{color:T,w:4})+line(b[0],b[1],c[0],c[1],{color:V,w:5});
 s+=B('横 1',(a[0]+b[0])/2,up?a[1]+28:a[1]-12,{size:22,color:T,anchor:'middle'});
 s+=B(up?'縦 4':'縦 −2',b[0]+10,(b[1]+c[1])/2+8,{size:22,color:V});
 if(hl>0)s+=fade(hl,rect(a[0]-10,Math.min(a[1],c[1])-12,b[0]-a[0]+90,Math.abs(c[1]-a[1])+46,{fill:'none',fo:0,stroke:HI,sw:4,rx:10}));
 return fade(g,s);
}
// 出題中の図（p 0→1）
function setupPic(p){
 let s=numberLine({g:seg(p,0,.15)});
 s+=fade(seg(p,.2,.3),obj('P',-6))+vArrow('P',-6,{g:seg(p,.3,.42)});
 s+=fade(seg(p,.45,.55),obj('Q',12))+vArrow('Q',12,{g:seg(p,.55,.67)});
 s+=graph({g:seg(p,.3,.6),pts:seg(p,.75,.9)});
 return s;
}
// 式を部品で並べる（TeX、左から）。parts＝[[tex,size],...]。中央そろえ。返り値 {svg, xs}（各部品の左端）
function texRow(parts,cx0,y,size=44){
 const ws=parts.map(p=>texWidth(p,size,false)),W=ws.reduce((a,b)=>a+b,0);let x=cx0-W/2,s='';const xs=[];
 parts.forEach((p,i)=>{xs.push(x);s+=tex(p,x,y,{size,auto:false,anchor:'start'});x+=ws[i];});
 return {svg:s,xs,ws};
}
const eqP=`${cx('x')}=${cx('-6')}+${cv('4')}${tt}`;
const eqQ=(hl=0)=>[`${cx('x')}=${cx('12')}`,hl?ch('-2'):cv('-2'),tt];

export const qxHsM1Velocity2Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、4 秒＋静止）=================
 // 数直線（−10〜20 m）、P（x＝−6、＋4 m/s）と Q（x＝12、−2 m/s）が順に現れる。下段は x-t グラフの軸と t＝0 の2点だけ。
 // P・Q は動かさず、直線も描かない（重なる位置と時刻が見えるため）。
 [K+'q0']:(p)=>setupPic(p),
 // ================= S1 小問1 =================
 // 1. 出題中の図を再生して静止。「P」「右へ 4」「Q」「左へ 2」を言葉に合わせて黄で光らせる
 [K+'setup']:(p,ctx)=>{
  const ve=voiceEnd(ctx),q=k=>k*ve;
  let s=setupPic(Math.min(1,cueT(ctx)/3.2));
  const pulse=(a,b)=>seg(p,q(a),q(a)+.03)*(1-seg(p,q(b),q(b)+.03));
  s+=fade(pulse(.02,.2),ring(NX(-6),NY-20,26,{color:HI,w:4}));
  s+=vArrow('P',-6,{hl:1,g:pulse(.3,.5)});
  s+=fade(pulse(.52,.68),ring(NX(12),NY+20,26,{color:HI,w:4}));
  s+=vArrow('Q',12,{hl:1,g:pulse(.82,1.02)});
  return s;
 },
 // 2. 求めるもの：同じ位置に来る時刻。上段の P と Q の間に「？ s」
 [K+'goal1']:(p)=>{
  let s=setupPic(1);
  s+=fade(seg(p,.3,.45),rect(NX(3)-60,NY-80,120,50,{fill:'#1a1430',fo:.95,stroke:HI,sw:2.5,rx:10})+B('？ s',NX(3),NY-44,{size:28,color:HI,anchor:'middle'}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. x＝x₀＋vt。x₀ 水色、vt 紫。x₀ を黄で強調。P の −6 から紫の帯 vt が伸びる
 [K+'law']:(p,ctx)=>{
  const W=sentWin(ctx),[c,d]=W[1]??[.5,1],hx=seg(p,c+.02,c+.08)*(1-seg(p,c+(d-c)*.45,c+(d-c)*.5)),hv=seg(p,c+(d-c)*.5,c+(d-c)*.56);
  let s=numberLine()+obj('P',-6)+obj('Q',12,{g:.35});
  const u=(cueT(ctx)%3)/3,L=4*Math.min(1,u*1.3);
  s+=fade(seg(p,.05,.15),rect(NX(-6),NY+84,NX(-6+L)-NX(-6),16,{fill:V,fo:.5,stroke:V,sw:2,rx:3})+B('vt',NX(-6+L)+8,NY+100,{size:24,color:V}));
  s+=fade(seg(p,.05,.15),line(NX(-6),NY+76,NX(-6),NY+108,{color:hx>.5?HI:X,w:3})+B('x₀',NX(-6),NY+136,{size:26,color:hx>.5?HI:X,anchor:'middle'}));
  const f=`${cx('x')}=${hx>.5?ch('x_0'):cx('x_0')}+${hv>.5?ch('vt'):cv('vt')}`;
  s+=card(330,250,540,110,tex(f,600,318,{size:54,auto:false}),seg(p,.03,.15),C.dim);
  s+=fade(seg(p,c+.02,c+.1),B('出発点',470,400,{size:26,color:X,anchor:'middle'})+B('t 秒で 進んだ',770,400,{size:26,color:V,anchor:'middle'}));
  s+=goalTag(G1);
  return s;
 },
 // 4. P：x＝−6＋4t、Q：x＝12−2t。Q の −2 を光らせ、上段の Q の左向きの矢印と線で結ぶ
 [K+'eqs']:(p,ctx)=>{
  const W=sentWin(ctx),[c]=W[1]??[.5],hq=seg(p,c+.02,c+.08);
  let s=numberLine()+obj('P',-6)+vArrow('P',-6)+obj('Q',12)+vArrow('Q',12,{hl:hq});
  s+=fade(seg(p,.03,.12),B('P：',330,300,{size:30,color:PC})+tex(eqP,600,290,{size:48,auto:false}));
  const r=texRow(eqQ(hq>.5),600,390,48);
  s+=fade(seg(p,.25,.35),B('Q：',330,400,{size:30,color:QCOL})+r.svg);
  if(hq>0){const qx=r.xs[1]+r.ws[1]/2;s+=fade(hq,line(qx,352,NX(11),NY-40,{color:HI,w:3,dash:'8 6'})+rect(r.xs[1]-6,352,r.ws[1]+12,58,{fill:'none',fo:0,stroke:HI,sw:3,rx:8}));}
  s+=goalTag(G1);
  return s;
 },
 // 5. 2本の式の右辺を「＝」で結んで1本の式に
 [K+'equal']:(p,ctx)=>{
  const W=sentWin(ctx),[c]=W[1]??[.5],j=seg(p,c,c+.1);
  let s=fade(1-.6*j,B('P：',330,170,{size:30,color:PC})+tex(eqP,600,160,{size:48,auto:false})+B('Q：',330,260,{size:30,color:QCOL})+tex(`${cx('x')}=${cx('12')}${cv('-2')}${tt}`,600,250,{size:48,auto:false}));
  s+=fade(seg(p,.1,.25),B('P の x ＝ Q の x',600,90+240,{size:28,color:HI,anchor:'middle'}));
  s+=card(250,370,700,100,tex(`${cx('-6')}+${cv('4')}${tt}=${cx('12')}${cv('-2')}${tt}`,600,428,{size:50,auto:false}),j,HI);
  s+=goalTag(G1);
  return s;
 },
 // 6. 一操作ずつ：＋2t → ＋6 → ÷6。足した項を黄で光らせてから消す。t＝3 s（金）
 [K+'solve']:(p,ctx)=>{
  const W=sentWin(ctx),[a,b]=W[0],[c,d]=W[1]??[.7,1],L=b-a;
  const rows=[
   [1,null,`${cx('-6')}+${cv('4')}${tt}=${cx('12')}${cv('-2')}${tt}`,''],
   [seg(p,a+L*.05,a+L*.12),`-6+4${tt}${ch('+2t')}=12-2${tt}${ch('+2t')}`,`-6+6${tt}=12`,'両辺に ＋2t',seg(p,a+L*.38,a+L*.45)],
   [seg(p,a+L*.5,a+L*.57),`-6+6${tt}${ch('+6')}=12${ch('+6')}`,`6${tt}=18`,'両辺に ＋6',seg(p,a+L*.8,a+L*.87)],
   [seg(p,c,c+.04),`\\dfrac{6${tt}}{${ch('6')}}=\\dfrac{18}{${ch('6')}}`,`${ct('t=3\\ \\mathrm{s}')}`,'両辺を ÷6',seg(p,c+(d-c)*.4,c+(d-c)*.48)],
  ];
  let s='';
  rows.forEach(([g,pre,post,ann,m=1],i)=>{const y=125+i*98;
   if(i===0){s+=tex(post,520,y,{size:42,auto:false});return;}
   s+=fade(g*(1-m),tex(pre,520,y,{size:42,auto:false}))+fade(g*m,tex(post,520,y,{size:42,auto:false}));
   s+=fade(g,B(ann,860,y+8,{size:26,color:HI}));});
  s+=goalTag(G1);
  return s;
 },
 // 7. 下段に P・Q の直線、交点 (3, 6)。上段で P・Q を実時間で動かし、t＝3 s で映像を一時停止。小問1 の答え B
 [K+'check']:(p,ctx)=>{
  const W=sentWin(ctx),[c]=W[1]??[.6],t=clamp(cueT(ctx)-.6,0,3),stop=t>=3?1:0;
  let s=top(t,{txt:t<.2||t>=3?1:0});
  s+=graph({to:t,glow:stop*seg(p,c-.12,c-.05),pts:1});
  s+=fade(stop,line(NX(6),NY-30,NX(6),NY+30,{color:HI,w:3,dash:'6 5'})+B('x ＝ 6',NX(6),NY+92,{size:26,color:HI,anchor:'middle'}));
  s+=card(800,250,260,64,B(`t ＝ ${t.toFixed(1)} s`,930,293,{size:30,color:T,anchor:'middle'}),1,T);
  s+=pauseBadge({x:930,y:350,g:stop});
  s+=goalTag(G1)+A1(seg(p,c,c+.06));
  return s;
 },
 // 8. はじめの間 18 m（12 引く −6）。誤答 A
 [K+'wrongA']:(p,ctx)=>{
  const W=sentWin(ctx),[c]=W[1]??[.5];
  let s=numberLine()+obj('P',-6)+obj('Q',12);
  s+=fade(seg(p,.05,.15),rect(NX(-6),NY+84,NX(12)-NX(-6),16,{fill:X,fo:.45,stroke:X,sw:2,rx:3})+B('18 m',NX(3),NY+130,{size:30,color:X,anchor:'middle'}));
  s+=fade(seg(p,.1,.2),tex('12-(-6)=18',600,330,{size:40,auto:false}));
  s+=wrongCard('A','1 s','−6 の 符号を 落とし、間を 6 m と した',{y:380,mid:'',g:seg(p,c,c+.05)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 9. 誤答 C（4.5 s）、誤答 D（9 s）を1枚ずつ → カードを消し、矢印を向かい合わせて 4＋2＝6 m/s で近づく、18÷6＝3
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),[a,b]=W[0],[c]=W[1]??[.6],m=(a+b)/2;
  let s=numberLine()+obj('P',-6)+vArrow('P',-6,{hl:seg(p,c,c+.04)})+obj('Q',12)+vArrow('Q',12,{hl:seg(p,c,c+.04)});
  s+=fade(.6,rect(NX(-6),NY+84,NX(12)-NX(-6),16,{fill:X,fo:.45,stroke:X,sw:2,rx:3})+B('18 m',NX(3),NY+130,{size:28,color:X,anchor:'middle'}));
  s+=wrongSeq(p,ctx,[['C','4.5 s','Q も 動くことを 忘れた',{mid:'18\\div 4=4.5'}],['D','9 s','近づくのに 速さの差で 割った',{mid:'18\\div (4-2)=9'}]],{win:[[a,m],[m,c-.01]],keepLast:false,opts:{y:300}});
  s+=card(250,300,700,150,B('4 ＋ 2 ＝ 6 m/s で 近づく',600,355,{size:32,color:V,anchor:'middle'})+tex('18\\div 6=3',600,415,{size:42,auto:false}),seg(p,c+.01,c+.06),HI);
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2 =================
 // 10. 上段の数直線と Q だけ（x＝12、−2 m/s）。求めるもの：Q の 0〜5 s の変位
 [K+'goal2']:(p)=>{
  let s=numberLine()+obj('Q',12)+vArrow('Q',12);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 11. 変位＝あとの位置−はじめの位置（定義）。Q が 12 → 2 へ。「5 s 後」
 [K+'disp']:(p,ctx)=>{
  const W=sentWin(ctx),[c,d]=W[1]??[.5,1],u=lin(p,c+.02,c+(d-c)*.85),m=12-10*u;
  let s=numberLine();
  s+=fade(u>.02?.35:0,obj('Q',12));
  s+=obj('Q',m)+vArrow('Q',m);
  s+=fade(seg(p,c+(d-c)*.85,c+(d-c)*.95),rect(NX(2)-50,NY+76,100,40,{fill:'#1a2540',fo:.95,stroke:T,sw:2,rx:8})+B('5 s 後',NX(2),NY+104,{size:24,color:T,anchor:'middle'}));
  s+=card(170,290,860,90,B('変位 ＝ あとの位置 − はじめの位置',600,346,{size:34,color:X,anchor:'middle'}),seg(p,.03,.12),X);
  s+=kindTag('定義',600,420,{g:seg(p,.08,.18)});
  s+=goalTag(G2);
  return s;
 },
 // 12. 始点 12 から終点 2 へ、左向きの水色の矢印「−10 m」。小問2 の答え C
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),[c]=W[1]??[.6];
  let s=numberLine()+fade(.35,obj('Q',12))+obj('Q',2)+vArrow('Q',2);
  s+=arrow(NX(12),NY+110,NX(2),NY+110,{color:X,w:6,head:18,g:seg(p,.03,.15)})+fade(seg(p,.1,.2),B('−10 m',NX(7),NY+150,{size:30,color:X,anchor:'middle'}));
  s+=card(330,330,540,90,tex('2-12=-10\\ \\mathrm{m}',600,385,{size:44,auto:false}),seg(p,.15,.28),X);
  s+=goalTag(G2)+A2(seg(p,c,c+.06));
  return s;
 },
 // 13. 誤答 A（＋10 m）、B（2 m）、D（−2 m）を1枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  let s=numberLine()+fade(.35,obj('Q',12))+obj('Q',2)+vArrow('Q',2);
  s+=arrow(NX(12),NY+110,NX(2),NY+110,{color:X,w:6,head:18})+B('−10 m',NX(7),NY+150,{size:30,color:X,anchor:'middle'});
  s+=wrongSeq(p,ctx,[['A','＋10 m','左向きの マイナスを 落とした'],['B','2 m','位置を 変位と した'],['D','−2 m','速度 −2 m/s と 取り違えた']],{opts:{y:330}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3 =================
 // 14. 下段に x-t グラフの2本の直線を戻す。求めるもの：速いのはどちらか、その理由
 [K+'goal3']:(p)=>{
  let s=top(0)+graph({full:seg(p,.1,.3),to:5*seg(p,.1,.3)});
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. 「高さ＝位置」「傾き＝速度」。t＝0 で Q のほうが高い所（水色の縦線）
 [K+'read']:(p,ctx)=>{
  const W=sentWin(ctx),[a,b]=W[0],L=b-a;
  let s=top(0)+graph({full:1});
  s+=card(740,250,400,64,B('高さ ＝ 位置',940,293,{size:30,color:X,anchor:'middle'}),seg(p,a+L*.15,a+L*.3),X);
  s+=card(740,330,400,64,B('傾き ＝ 速度',940,373,{size:30,color:V,anchor:'middle'}),seg(p,a+L*.55,a+L*.7),V);
  const g=seg(p,a+L*.3,a+L*.45),x0=A0.X(0)+14;
  s+=fade(g,line(x0,A0.Y(0),x0,A0.Y(12),{color:X,w:5})+line(x0+14,A0.Y(0),x0+14,A0.Y(-6),{color:X,w:5})
   +B('Q：12',x0-140,A0.Y(9),{size:22,color:X})+B('P：−6',x0-140,A0.Y(-3),{size:22,color:X}));
  s+=goalTag(G3);
  return s;
 },
 // 16. 傾きの三角形。P は横 1・縦 4、Q は横 1・縦 −2
 [K+'slope']:(p,ctx)=>{
  const W=sentWin(ctx),[c]=W[1]??[.5];
  let s=top(0)+graph({full:1});
  s+=slopeTri('P',{g:seg(p,.05,.15)})+slopeTri('Q',{g:seg(p,c,c+.08)});
  s+=card(740,250,400,64,B('P の傾き ＝ ＋4',940,293,{size:30,color:V,anchor:'middle'}),seg(p,.25,.35),V);
  s+=card(740,330,400,64,B('Q の傾き ＝ −2',940,373,{size:30,color:V,anchor:'middle'}),seg(p,c+.25,c+.35),V);
  s+=goalTag(G3);
  return s;
 },
 // 17. 4＞2。P の三角形を黄で囲む。小問3 の答え D
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),[c]=W[1]??[.7];
  let s=top(0)+graph({full:1})+slopeTri('P',{hl:seg(p,.3,.4)})+slopeTri('Q');
  s+=card(740,250,400,140,B('傾きの 大きさ',940,292,{size:26,color:C.dim,anchor:'middle'})+B('4 ＞ 2',940,360,{size:44,color:HI,anchor:'middle'}),seg(p,.1,.2),HI);
  s+=fade(seg(p,.45,.55),B('P が 速い',940,440,{size:30,color:HI,anchor:'middle'}));
  s+=goalTag(G3)+A3(seg(p,c,c+.06));
  return s;
 },
 // 18. 誤答 A（高い所から始まる）、B（負なので大きく変化）。上段の Q の矢印に「逆向き」
 [K+'wrongAB']:(p,ctx)=>{
  const W=sentWin(ctx),[a,b]=W[0],[c]=W[1]??[.6],m=(a+b)/2;
  let s=top(0,{hlQv:seg(p,c,c+.05)})+graph({full:1})+slopeTri('P')+slopeTri('Q');
  s+=fade(seg(p,c,c+.05),B('逆向き',NX(11),NY-16,{size:24,color:HI,anchor:'middle'}));
  s+=wrongSeq(p,ctx,[['A','高い所から 始まる','高さは 位置'],['B','負なので 大きく変化','負は 逆向き']],{win:[[a,m],[m,1]],opts:{x:700,w:490,y:250}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 19. 交点 (3, 6) を光らせ、2つの三角形の大きさの違いを並べる。誤答 C
 [K+'wrongC']:(p,ctx)=>{
  let s=top(0)+graph({full:1,glow:seg(p,.05,.15)*(.6+.4*Math.sin(cueT(ctx)*4)**2)})+slopeTri('P')+slopeTri('Q');
  s+=wrongCard('C','同じ','同じ位置 ≠ 同じ速さ',{x:700,w:490,y:250,g:seg(p,.3,.38)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 20. 誤答カードを消し、2本の直線の傾きを黄でなぞる
 [K+'sum']:(p)=>{
  let s=top(0)+graph({full:1,hlLines:seg(p,.1,.6)});
  s+=card(740,250,420,130,B('速度 ＝ 向きの付いた速さ',950,302,{size:28,color:V,anchor:'middle'})+B('＝ x-t グラフの 傾き',950,350,{size:28,color:HI,anchor:'middle'}),seg(p,.3,.45),HI);
  return s;
 },
};
