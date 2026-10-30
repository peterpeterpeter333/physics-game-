// 問題編 解説「12 V・5 kΩ・2 μF の充電と放電」（q-um-circuit-time、大学編 28 過渡現象・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/28_過渡現象.md の q-um-circuit-time（解説 21 行）。
// 色（正本・単元動画と同じ）：電圧 V₀ 紫、電荷 q 桃、電流 I 緑、時間 t・τ 金、容量 C 黄、差 u 橙、R 白、強調 黄。
// 回路の配置は 過渡現象・中級（yt1-um-circuit-time-1）と同じ（電池の＋極が左、抵抗は上の左、コンデンサは上の右）。電池・抵抗の記号は import（あちらは編集しない）。
// 充電の電流は時計回り（左の辺を上へ）、放電は反時計回り。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。軸の目盛り数字は 22px（自前の軸）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,draw,arrow,highlight,axes,tex,texWidth} from './anim.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,sentWin,voiceEnd,textW} from './yt1-qx-common.mjs';
import {battery,zig} from './yt1-um-circuit-time-1-diagrams.mjs';

const K='qx-um-circuit-time:';
const VC=QC.V,QQ=QC.q,IC=QC.I,TC=QC.t,CC=C.hi,UC=C.E,POS=C.a,NEG='#7fb3ff';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const q_=cs(QQ,'q'),C_=cs(CC,'C'),V0=cs(VC,'V_0'),t_=cs(TC,'t'),u_=cs(UC,'u'),TAU=cs(TC,'\\tau'),QI=cs(QQ,'q_\\infty');
const DQ=`\\dfrac{d${q_}}{d${t_}}`,DU=`\\dfrac{d${u_}}{d${t_}}`;
const LOOP=`R\\,${DQ}=${V0}-\\dfrac{${q_}}{${C_}}`;
const G1='時定数 τ',G2='t＝τ の電荷',G3='20 ms 後の電荷と電流の向き';
const ANS1=g=>answerTag(1,'B','10 ms',{g}),ANS2=g=>answerTag(2,'D','15 μC',{g}),ANS3=g=>answerTag(3,'A','3.2 μC、逆向き',{g});
function atWord(ctx,word,def){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0||!r.length?def:i/r.length*voiceEnd(ctx);
}
const pill=(t,x,y,color,{size=24,g=1}={})=>{const w=textW(t,size)+24,h=size+16;
 return fade(g,rect(x-w/2,y-h/2,w,h,{fill:'#131f38',fo:.96,stroke:color,sw:2.5,rx:h/2})+label(t,x,y+size*.36,{size,color,anchor:'middle',weight:700}));};
function ax({x,y,w,h,xmax,ymax,xt=[],yt=[],xl='',yl='',xc=C.dim,yc=C.dim,g=1,size=22}){
 const A=axes({x,y,w,h,xmax,ymax,g,xcolor:xc,ycolor:yc});
 let s=A.svg;
 s+=fade(g,xt.map(([u,t])=>line(A.X(u),y-6,A.X(u),y+6,{color:C.dim})+label(t,A.X(u),y+32,{size,color:xc,anchor:'middle'})).join('')
  +yt.map(([v,t])=>line(x-6,A.Y(v),x+6,A.Y(v),{color:C.dim})+label(t,x-12,A.Y(v)+8,{size,color:yc,anchor:'end'})).join(''));
 s+=fade(g,label(xl,x+w+40,y+8,{size:24,color:xc})+label(yl,x,y-h-42,{size:24,color:yc,anchor:'middle',weight:700}));
 return {...A,svg:s};
}

// ---- RC 回路（充電：電池あり／放電：電池を外して導線）----------------------------------------------
function rc({x0=60,y0=180,w=420,h=230,bat=1,sw=1,dr=1,sym=0,vals=1,qLab=0,I=0,charges=0,g=1,swOn=1}={}){
 const CL=x0,CR=x0+w,CT=y0,CB=y0+h,RA=x0+.12*w,RB=x0+.45*w,PL=x0+.66*w,PR=PL+32,BX=x0+.58*w,SWA=x0+.1*w,SWB=x0+.24*w;
 const W=(pts,a,b)=>draw(pts,seg(dr,a,b),{color:C.dim,w:4});
 let s='';
 const swA=swOn?SWA:SWB;
 s+=W([[swOn?SWA:CL+.15*w,CB],[CL,CB],[CL,CT],[RA,CT]],0,.35)+W([[RB,CT],[PL,CT]],.3,.5)+W([[PR+8,CT],[CR,CT],[CR,CB],[bat?BX+10:SWB,CB]],.45,.85);
 if(bat)s+=W([[BX-10,CB],[swOn?SWB:CL+.15*w,CB]],.8,1);
 else if(!swOn)s+=W([[SWB,CB],[CL+.15*w,CB]],.8,1);
 const gc=seg(dr,.5,1);
 let comp=zig(RA,RB,CT)+rect(PL,CT-45,8,90,{fill:CC,fo:.9,stroke:CC,sw:1,rx:2})+rect(PR,CT-45,8,90,{fill:CC,fo:.9,stroke:CC,sw:1,rx:2});
 if(bat)comp+=battery(BX,CB,{text:''})+label(sym?'V₀':'12 V',BX,CB+62,{size:26,color:VC,anchor:'middle',weight:700});
 if(swOn){const ang=mix(-0.55,0,clamp(sw)),L=SWB-SWA;
  comp+=dot(SWA,CB,6,C.ink)+dot(SWB,CB,6,C.ink)+line(SWA,CB,SWA+L*Math.cos(ang),CB+L*Math.sin(ang),{color:C.ink,w:4})+label('スイッチ',(SWA+SWB)/2,CB+44,{size:22,color:C.dim,anchor:'middle'});}
 if(vals)comp+=label(sym?'R':'5 kΩ',(RA+RB)/2,CT-34,{size:26,color:C.ink,anchor:'middle',weight:700})+label(sym?'C':'2 μF',PL+20,CT-56,{size:26,color:CC,anchor:'middle',weight:700});
 if(charges){for(let k=0;k<4;k++){const y=CT-30+k*20;comp+=label('＋',PL-14,y+8,{size:20,color:POS,anchor:'middle',weight:700})+label('−',PR+22,y+8,{size:22,color:NEG,anchor:'middle',weight:700});}}
 s+=fade(gc,comp);
 if(qLab)s+=fade(qLab,label('q',PL+20,CT+82,{size:30,color:QQ,anchor:'middle',weight:700}));
 if(I){const o={color:IC,w:5,head:16},A=(a,b,c,d)=>I>0?arrow(a,b,c,d,o):arrow(c,d,a,b,o);
  s+=fade(Math.abs(I),A(CL,CB-60,CL,CT+60)+A(CL+20,CT,RA-14,CT)+A(CR,CT+60,CR,CB-60)+label('電流',CL+16,(CT+CB)/2+8,{size:24,color:IC,weight:700}));}
 return fade(g,s);
}
// ---- q–t グラフ（t は ms）-----------------------------------------------------------------------------
const qc=t=>24*(1-Math.exp(-t/10)),qd=t=>24*Math.exp(-t/10);
function qg({x=100,y=460,w=540,h=300,g=1,xt=1,yt=[],xl='t [ms]',yl='電荷 q [μC]',xmax=50,ymax=30}={}){
 return ax({x,y,w,h,xmax,ymax,xt:xt?[[10,'10'],[20,'20'],[30,'30'],[40,'40']]:[],yt,xl,yl,xc:TC,yc:QQ,g});
}
const hline=(A,v,txt,g=1,xmax=50)=>fade(g,line(A.X(0),A.Y(v),A.X(xmax),A.Y(v),{color:QQ,w:2.5,dash:'10 8'})+(txt?label(txt,A.X(xmax),A.Y(v)-14,{size:24,color:QQ,anchor:'end',weight:700}):''));
const vline=(A,u,txt,g=1,top=28,color=TC,w=3)=>fade(g,line(A.X(u),A.Y(0),A.X(u),A.Y(top),{color,w,dash:'8 6'})+(txt?label(txt,A.X(u),A.Y(top)-10,{size:26,color,anchor:'middle',weight:700}):''));
const PX=720,PW=470,PC=PX+PW/2;
const WO={x:PX,w:PW,y:190,size:28,whySize:24};

export const ytQxUmCircuitTimeDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 s）：0〜3 s 充電の回路、3〜5 s 右に放電の回路と札「放電の始まりを新しい時刻 0」、5〜6 s 下に q–t グラフの軸だけ。静止。
 [K+'q1']:(p)=>{
  let s=rc({x0:50,y0:100,w:440,h:180,dr:seg(p,0,.4),sw:0});
  s+=rc({x0:690,y0:100,w:440,h:180,bat:0,swOn:0,dr:seg(p,.5,.75)});
  s+=fade(seg(p,.3,.45),label('充電',270,395,{size:26,color:C.dim,anchor:'middle',weight:700}))+fade(seg(p,.6,.75),label('放電',910,330,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=pill('放電の始まりを新しい時刻 0',910,382,TC,{g:seg(p,.72,.82)});
  s+=qg({x:440,y:505,w:420,h:80,g:seg(p,.84,.97),xt:0,xl:'t',yl:''}).svg+fade(seg(p,.84,.97),label('電荷 q',420,445,{size:24,color:QQ,anchor:'end',weight:700}));
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>rc({dr:seg(p,0,.3),sw:seg(p,.3,.4)})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. ①記号を図に（R・C・V₀・q）、グラフに行き先の点線と差 u ②図を消して 法則 → u → du/dt＝−u/(RC) → RC を囲んで τ
 [K+'ode']:(p,ctx)=>{
  const b=atWord(ctx,'ディーユー',.45),b2=sentWin(ctx)[1]?.[0]??.75,cA=1-seg(p,b-.05,b),cB=seg(p,b,b+.05),gu=seg(p,atWord(ctx,'いきさきとの',.25),atWord(ctx,'いきさきとの',.25)+.06);
  let a=rc({sym:1,qLab:1})+card(560,90,630,100,T(LOOP,875,145,38),seg(p,.02,.08));
  const A=qg({x:600,y:470,w:520,h:220,xt:0,xl:'t',yl:''}),tu=9;
  a+=A.svg+A.plot(qc,{from:0,to:50,color:QQ,w:5})+hline(A,24,'行き先',1)+fade(gu,line(A.X(tu),A.Y(qc(tu)),A.X(tu),A.Y(24),{color:UC,w:7})+label('u＝行き先との差',A.X(tu)+16,A.Y(19),{size:24,color:UC,weight:700}));
  let s=fade(cA,a);
  const bx=texWidth(`${DU}=-\\dfrac{${u_}}{RC}`,44,false)-texWidth(`\\dfrac{${u_}}{RC}`,44,false),wE=texWidth(`${DU}=-\\dfrac{${u_}}{RC}`,44,false),wRC=texWidth('RC',44,false);
  let e=kindTag('法則',150,140)+T(LOOP,600,140,40)
   +fade(seg(p,b+.02,b+.08),T(`${u_}=${QI}-${q_}`,600,245,40)+label('行き先との差',600+texWidth(`${u_}=${QI}-${q_}`,40,false)/2+24,253,{size:24,color:UC,weight:700}))
   +fade(seg(p,b+.08,b+.15),T(`${DU}=-\\dfrac{${u_}}{RC}`,600,355,44));
  const wF=texWidth(`\\dfrac{${u_}}{RC}`,44,false),rcx=600+wE/2-wF/2;
  e+=fade(seg(p,b2,b2+.06),rect(rcx-wRC/2-8,358,wRC+16,46,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:6})+label('＝ τ',600+wE/2+24,392,{size:30,color:TC,weight:700}));
  e+=fade(seg(p,b2+.06,b2+.12),T(`${TAU}=RC`,600,465,44));
  s+=fade(cB,e);
  return s+goalTag(G1);
 },
 // 3. RC＝5×10³ Ω×2×10⁻⁶ F＝1×10⁻² s＝10 ms（k と μ を枠で）
 [K+'calc']:(p)=>{
  let s=T(`${TAU}=RC`,600,135,44);
  const pre1=`=5\\,`,pre2=`=5\\,\\mathrm{k}\\Omega\\times2\\,`,full=`=5\\,\\mathrm{k}\\Omega\\times2\\,\\mu\\mathrm{F}`,sz=44;
  const W=texWidth(full,sz,false),x0=600-W/2,kx=x0+texWidth(pre1,sz,false),kw=texWidth('\\mathrm{k}',sz,false),mx=x0+texWidth(pre2,sz,false),mw=texWidth('\\mu',sz,false);
  s+=fade(seg(p,.03,.1),T(full,600,225,sz));
  s+=fade(seg(p,.1,.2),rect(kx-9,190,kw+10,54,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:6})+label('×10³',kx+kw/2,290,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.22,.32),rect(mx-9,190,mw+10,54,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:6})+label('×10⁻⁶',mx+mw/2,290,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.45),T(`=5\\times10^{3}\\,\\Omega\\times2\\times10^{-6}\\,\\mathrm{F}`,600,365,40));
  s+=fade(seg(p,.55,.65),T(`=1\\times10^{-2}\\,\\mathrm{s}=${cs(TC,'10\\,\\mathrm{ms}')}`,600,460,44));
  return s+goalTag(G1);
 },
 // 4. 単位 Ω×F＝V/A×C/V（V を消す）＝C/A＝s。答えの札
 [K+'units']:(p,ctx)=>{
  const b=atWord(ctx,'しょうもん',.65),c=seg(p,.3,.38);
  let s=card(40,90,360,120,label('τ ＝ RC ＝ 10 ms',220,160,{size:30,color:TC,anchor:'middle',weight:700}),1);
  s+=T(`\\Omega\\times\\mathrm{F}`,780,140,44);
  const V1=c>.5?`{\\color{${C.a}}\\cancel{\\color{${C.ink}}\\mathrm{V}}}`:'\\mathrm{V}';
  s+=fade(seg(p,.08,.16),T(`=\\dfrac{${V1}}{\\mathrm{A}}\\times\\dfrac{\\mathrm{C}}{${V1}}`,780,255,44));
  s+=fade(seg(p,.4,.48),T(`=\\dfrac{\\mathrm{C}}{\\mathrm{A}}`,700,385,44)+label('A ＝ C/s',880,395,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.58),T(`=\\mathrm{s}`,780,475,44)+label('秒',870,485,{size:28,color:TC,anchor:'middle',weight:700}));
  return s+goalTag(G1)+ANS1(seg(p,b,b+.08));
 },
 // 5. 誤答 A → C（1枚ずつ）
 [K+'wrongAC']:(p,ctx)=>{
  let s=card(40,110,620,330,T(`${TAU}=RC`,350,180,40)+T(`=5\\,\\mathrm{k}\\Omega\\times2\\,\\mu\\mathrm{F}`,350,280,40)+T(`=${cs(TC,'10\\,\\mathrm{ms}')}`,350,380,40),1);
  s+=wrongSeq(p,ctx,[['A','10 s','k と μ の倍率を掛けていない',{mid:'5\\times2=10'}],['C','100 s','1/(RC)（単位 1/s）',{mid:'\\dfrac{1}{RC}=100'}]],{opts:WO});
  return s+goalTag(G1)+ANS1(1);
 },
 // 6. 誤答 D
 [K+'wrongD']:(p)=>{
  let s=card(40,110,620,330,T(`${TAU}=RC`,350,180,40)+T(`=5\\,\\mathrm{k}\\Omega\\times2\\,\\mu\\mathrm{F}`,350,280,40)+T(`=${cs(TC,'10\\,\\mathrm{ms}')}`,350,380,40),1);
  s+=wrongCard('D','2.5×10⁹ s','R÷C（単位 Ω/F）',{...WO,mid:'\\dfrac{5\\times10^{3}}{2\\times10^{-6}}=2.5\\times10^{9}',g:seg(p,.03,.1)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>qg({g:seg(p,.02,.15)}).svg+goalTag(G2,{g:seg(p,.03,.15)}),
 // 8. 行き先 q∞＝CV₀＝2 μF×12 V＝24 μC
 [K+'qinf']:(p,ctx)=>{
  const A=qg({yt:[[24,'24']]});
  let s=A.svg+hline(A,24,'q∞ ＝ 24 μC',seg(p,.55,.7));
  s+=card(PX,130,PW,320,T(`${QI}=${C_}${V0}`,PC,200,40)+fade(seg(p,.25,.35),T(`=2\\,\\mu\\mathrm{F}\\times${cs(VC,'12\\,\\mathrm{V}')}`,PC,300,36))
   +fade(seg(p,.45,.55),T(`=${cs(QQ,'24\\,\\mu\\mathrm{C}')}`,PC,395,40)),seg(p,.03,.1));
  return s+goalTag(G2);
 },
 // 9. 下から近づく曲線。t＝τ の縦線で、はじめのすき間 u と τ のすき間（0.368 倍）を並べる
 [K+'shrink']:(p)=>{
  const A=qg({yt:[[24,'24']]});
  let s=A.svg+hline(A,24,'q∞ ＝ 24 μC')+A.plot(qc,{from:0,to:50,p:seg(p,.03,.35),color:QQ,w:5});
  s+=vline(A,10,'τ',seg(p,.3,.4));
  s+=fade(seg(p,.4,.5),line(A.X(0)+8,A.Y(0),A.X(0)+8,A.Y(24),{color:UC,w:8})+label('u',A.X(0)+22,A.Y(12),{size:28,color:UC,weight:700}));
  s+=fade(seg(p,.5,.6),line(A.X(10)+8,A.Y(qc(10)),A.X(10)+8,A.Y(24),{color:UC,w:8}));
  s+=fade(seg(p,.6,.7),label('×0.368',A.X(10)+20,A.Y(19)+8,{size:28,color:UC,weight:700}));
  s+=card(PX,150,PW,260,label('差 u は τ ごとに',PC,240,{size:30,color:UC,anchor:'middle',weight:700})+label('0.368 倍',PC,320,{size:40,color:UC,anchor:'middle',weight:700}),seg(p,.55,.65),UC);
  return s+goalTag(G2);
 },
 // 10. 1−0.368＝0.632、24×0.632≈15 μC。答えの札
 [K+'ans2']:(p,ctx)=>{
  const b=atWord(ctx,'しょうもん',.75);
  const A=qg({yt:[[24,'24']]});
  let s=A.svg+hline(A,24,'q∞ ＝ 24 μC')+A.plot(qc,{from:0,to:50,color:QQ,w:5})+vline(A,10,'τ');
  s+=fade(seg(p,.4,.5),dot(A.X(10),A.Y(qc(10)),9,QQ)+label('63％',A.X(10)+18,A.Y(qc(10))+30,{size:28,color:C.hi,weight:700}));
  s+=card(PX,130,PW,320,T(`1-0.368=0.632`,PC,200,36)+fade(seg(p,.4,.5),T(`24\\times0.632\\approx${cs(QQ,'15\\,\\mu\\mathrm{C}')}`,PC,330,36)),1);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.08));
 },
 [K+'wrongAC2']:(p,ctx)=>{
  const A=qg({yt:[[24,'24']]});
  let s=A.svg+hline(A,24,'q∞ ＝ 24 μC')+A.plot(qc,{from:0,to:50,color:QQ,w:5})+vline(A,10,'τ')+dot(A.X(10),A.Y(qc(10)),9,QQ);
  s+=wrongSeq(p,ctx,[['A','24 μC','τ は終わる時間ではない'],['C','12 μC','τ で半分ではなく 63％']],{opts:WO});
  return s+goalTag(G2)+ANS2(1);
 },
 [K+'wrongB2']:(p)=>{
  const A=qg({yt:[[24,'24']]});
  let s=A.svg+hline(A,24,'q∞ ＝ 24 μC')+A.plot(qc,{from:0,to:50,color:QQ,w:5})+vline(A,10,'τ')+dot(A.X(10),A.Y(qc(10)),9,QQ);
  s+=wrongCard('B','8.8 μC','37％（放電の形）を使った',{...WO,mid:'24\\times0.368\\approx8.8',g:seg(p,.03,.1)});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>rc({bat:0,swOn:0,charges:1,dr:seg(p,0,.3)})+label('電池を外した 放電の回路',270,470,{size:26,color:C.dim,anchor:'middle'})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 14. ①一周の式の V₀ を消す ②グラフ：24 μC から 0 へ下る曲線
 [K+'dis']:(p,ctx)=>{
  const b=atWord(ctx,'いきさきが',.45),cs2=seg(p,.12,.2);
  const LOOPX=`R\\,${DQ}=${cs2>.5?`{\\color{${C.a}}\\cancel{${V0}}}`:V0}-\\dfrac{${q_}}{${C_}}`;
  let s=fade(1-seg(p,b-.06,b),rc({bat:0,swOn:0,charges:1})+card(560,120,630,300,T(LOOPX,875,210,40)+fade(seg(p,.22,.3),T(`R\\,${DQ}=-\\dfrac{${q_}}{${C_}}`,875,340,40)),1));
  const A=qg({x:340,y:470,w:520,h:200,yt:[[24,'24']]});
  s+=fade(seg(p,b,b+.06),card(250,95,700,90,T(`R\\,${DQ}=-\\dfrac{${q_}}{${C_}}`,600,140,36),1)+A.svg+A.plot(qd,{from:0,to:50,p:seg(p,b+.04,b+.3),color:QQ,w:5})+label('行き先 0',A.X(50),A.Y(0)-14,{size:24,color:QQ,anchor:'end',weight:700}));
  return s+goalTag(G3);
 },
 // 15. τ と 2τ の縦線。2τ で 14％、24×0.135≈3.2 μC
 [K+'twoTau']:(p)=>{
  const A=qg({yt:[[24,'24']]});
  let s=A.svg+A.plot(qd,{from:0,to:50,color:QQ,w:5})+vline(A,10,'τ',seg(p,.05,.15))+vline(A,20,'2τ',seg(p,.12,.22));
  s+=fade(seg(p,.4,.5),dot(A.X(20),A.Y(qd(20)),9,QQ)+label('14％',A.X(20)+16,A.Y(qd(20))-16,{size:28,color:C.hi,weight:700}));
  s+=card(PX,130,PW,320,label('20 ms ＝ 2τ',PC,195,{size:30,color:TC,anchor:'middle',weight:700})+fade(seg(p,.3,.4),label('残りは 0.135 倍',PC,270,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.5,.6),T(`24\\times0.135\\approx${cs(QQ,'3.2\\,\\mu\\mathrm{C}')}`,PC,370,34)),1);
  return s+goalTag(G3);
 },
 // 16. 充電と放電の回路の電流の矢印を並べ、向きが逆
 [K+'dir']:(p,ctx)=>{
  const b=atWord(ctx,'でんりゅうは',.45);
  let s=rc({x0:60,y0:150,w:440,h:190,sw:1,I:seg(p,b,b+.08)})+rc({x0:700,y0:150,w:440,h:190,bat:0,swOn:0,charges:1,I:-seg(p,b,b+.08)});
  s+=label('充電',280,440,{size:28,color:C.dim,anchor:'middle',weight:700})+label('放電',920,440,{size:28,color:C.dim,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.15),T(`${DQ}<0`,600,475,36));
  s+=fade(seg(p,b+.1,b+.18),pill('逆向き',600,260,C.hi,{size:30}));
  return s+goalTag(G3);
 },
 [K+'ans3']:(p)=>{
  let s=rc({x0:60,y0:150,w:440,h:190,sw:1,I:1})+rc({x0:700,y0:150,w:440,h:190,bat:0,swOn:0,charges:1,I:-1});
  s+=label('充電',280,440,{size:28,color:C.dim,anchor:'middle',weight:700})+label('放電',920,440,{size:28,color:C.dim,anchor:'middle',weight:700})+pill('逆向き',600,260,C.hi,{size:30});
  return s+goalTag(G3)+ANS3(seg(p,.05,.15));
 },
 [K+'wrongBC3']:(p,ctx)=>{
  const A=qg({yt:[[24,'24']]});
  let s=A.svg+A.plot(qd,{from:0,to:50,color:QQ,w:5})+vline(A,20,'2τ')+dot(A.X(20),A.Y(qd(20)),9,QQ);
  s+=wrongSeq(p,ctx,[['B','3.2 μC、同じ向き','電荷が減るので電流は逆向き'],['C','21 μC','充電の形 1−0.135 を使った',{mid:'24\\times(1-0.135)\\approx21'}]],{opts:WO});
  return s+goalTag(G3)+ANS3(1);
 },
 [K+'wrongD3']:(p)=>{
  const A=qg({yt:[[24,'24']]});
  let s=A.svg+A.plot(qd,{from:0,to:50,color:QQ,w:5})+vline(A,20,'2τ')+dot(A.X(20),A.Y(qd(20)),9,QQ);
  s+=wrongCard('D','12 μC','2τ で半分ではなく 14％が残る',{...WO,g:seg(p,.03,.1)});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 20. 充電と放電のグラフを上下に。τ と 2τ の縦線で 63％・86％／37％・14％
 [K+'sum1']:(p)=>sumScene(p,0),
 // 21. τ の縦線を黄に光らせる。答えの札3枚
 [K+'sum2']:(p)=>sumScene(1,seg(p,.05,.2))+answerRow([[1,'B','10 ms'],[2,'D','15 μC'],[3,'A','3.2 μC、逆向き']],{g:seg(p,.3,.42),size:24,gap:8}),
};
function sumScene(p,glow){
 const x=260,w=700,A1=qg({x,y:270,w,h:160,xt:0,xl:'',yl:''}),A2=qg({x,y:468,w,h:160,xl:'t',yl:''});
 let s=fade(seg(p,0,.1),A1.svg+A1.plot(qc,{from:0,to:50,color:QQ,w:5})+label('充電',x-40,200,{size:28,color:C.ink,anchor:'end',weight:700}));
 s+=fade(seg(p,.05,.15),A2.svg+A2.plot(qd,{from:0,to:50,color:QQ,w:5})+label('放電',x-40,410,{size:28,color:C.ink,anchor:'end',weight:700}));
 const col=glow>.5?C.hi:TC,lw=3+3*glow;
 for(const [u,t] of [[10,'τ'],[20,'2τ']])s+=fade(seg(p,.15,.25),line(A1.X(u),A2.Y(0),A1.X(u),A1.Y(28),{color:col,w:lw,dash:'8 6'})+label(t,A1.X(u),A1.Y(28)-8,{size:26,color:col,anchor:'middle',weight:700}));
 const P=(A,f,u,t,g,dy)=>fade(g,dot(A.X(u),A.Y(f(u)),8,QQ)+label(t,A.X(u)+14,A.Y(f(u))+dy,{size:26,color:C.hi,weight:700}));
 s+=P(A1,qc,10,'63％',seg(p,.25,.35),30)+P(A1,qc,20,'86％',seg(p,.35,.45),30);
 s+=P(A2,qd,10,'37％',seg(p,.55,.65),-12)+P(A2,qd,20,'14％',seg(p,.65,.75),-12);
 return s;
}
