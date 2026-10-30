// 問題編 解説「行きと帰りで速さが違う往復」(ys-qx-hs-m1-velocity-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/101_速度.md の q-hs-m1-velocity-1（解説 19 行）。
// 色（01_共通の約束）：位置（道の目盛り）水色、速さ 紫、時間 金、強調 黄、誤り 赤（×）。車は物理量ではないので灰色。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,clamp,mix} from './anim.mjs';
import {QC,card,goalTag,answerTag,wrongCard,wrongSeq,kindTag,sentWin,voiceEnd,cueT,textW} from './yt1-qx-common.mjs';

const K='qx-hs-m1-velocity-1:';
const V=QC.v,X=QC.x,T=QC.t,HI=QC.hi,BAD=QC.bad;
const G1='往復全体の平均の速さ',G2='真ん中にならない理由',G3='90 km/h を m/s で　';
const A1=g=>answerTag(1,'C','時速 72 km',{g}),A2=g=>answerTag(2,'A','遅い行き道に長い時間',{g}),A3=g=>answerTag(3,'D','25 m/s',{g});
const B=(s,x,y,o={})=>label(s,x,y,{weight:700,...o});

// ---- 道（水色の目盛り 0〜90 km）と車 -------------------------------------------------------------
const RX=km=>150+10*km;
function road(y,{g=1,names=1}={}){
 let s=line(RX(0)-24,y,RX(90)+24,y,{color:C.dim,w:4});
 for(let k=0;k<=90;k+=10)s+=line(RX(k),y-8,RX(k),y+8,{color:X,w:2});
 for(const k of [0,30,60,90])s+=label(`${k} km`,RX(k),y+36,{size:22,color:X,anchor:'middle'});
 if(names)s+=B('出発',RX(0),y+70,{size:24,anchor:'middle'})+B('折り返し 90 km',RX(90)-20,y+70,{size:24,anchor:'middle'});
 return fade(g,s);
}
function car(x,y,{dir=1,g=1}={}){
 const w=78,h=24,x0=x-w/2,y0=y-12-h,cx=x-dir*8;
 let s=rect(cx-22,y0-16,44,20,{fill:'#c9d3e4',fo:.95,stroke:'#9aa8c0',sw:2,rx:7});
 s+=rect(cx-14+dir*4,y0-12,20,11,{fill:'#7fb6ff',fo:.7,stroke:'none',rx:3});
 s+=rect(x0,y0,w,h,{fill:'#c9d3e4',fo:.97,stroke:'#9aa8c0',sw:2,rx:7});
 s+=rect(x+dir*w/2-(dir>0?8:0),y0+6,8,7,{fill:HI,fo:.9,stroke:'none',rx:2});
 s+=ring(x-22,y-9,9,{color:C.dim,w:3,fill:C.bg})+ring(x+22,y-9,9,{color:C.dim,w:3,fill:C.bg});
 return fade(g,s);
}
function speedTag(text,x,y,{g=1,size=26}={}){
 const w=textW(text,size)+26;
 return fade(g,rect(x-w/2,y-size-6,w,size+16,{fill:'#1a1430',fo:.95,stroke:V,sw:2.5,rx:9})+B(text,x,y+2,{size,color:V,anchor:'middle'}));
}
// 往復の動き u＝0→1（行き 0〜0.6、帰り 0.6〜1。時間の比 1.5：1 のまま）
function tripCar(u,y,{tag=1}={}){
 const go=u<.6,km=go?90*u/.6:90*(1-(u-.6)/.4),x=RX(km);
 return car(x,y,{dir:go?1:-1})+speedTag(go?'60 km/h':'90 km/h',x,y-62,{g:tag});
}
// 出題中の図：道、往復する車、最後に「行き 60 km/h」「帰り 90 km/h」の札
const RY=310;
function setupPic(p,{y=RY,names=1}={}){
 const u=lin(p,.04,.8),fin=seg(p,.82,.95);
 let s=road(y,{names});
 s+=tripCar(u,y,{tag:1-fin});
 s+=speedTag('行き 60 km/h',RX(25),y-130,{g:fin})+speedTag('帰り 90 km/h',RX(68),y-130,{g:fin});
 return s;
}

// ---- 時間の軸（金、0〜2.5 h）と帯 -----------------------------------------------------------------
const TX=h=>150+360*h;
function timeAxis(y,{g=1,half=0}={}){
 let s=line(TX(0)-10,y,TX(2.5)+30,y,{color:T,w:3})+arrow(TX(2.5)+20,y,TX(2.5)+46,y,{color:T,w:3,head:12});
 for(let h=0;h<=2.5+1e-9;h+=.5)s+=line(TX(h),y-7,TX(h),y+7,{color:T,w:2})+label(h===0?'0':String(h),TX(h),y+32,{size:22,color:T,anchor:'middle'});
 s+=label('時間 [h]',TX(2.5)+56,y+8,{size:22,color:T});
 if(half)s+=fade(half,label('（目盛り 30分ごと）',TX(2.5)+60,y+40,{size:22,color:C.dim}));
 return fade(g,s);
}
// 行き・帰りの帯。go,back＝伸びの割合 0〜1
function bars(y,{go=1,back=1,g=1,txt=1,div=0,spd=1}={}){
 let s='';const h=40,yt=y-h-6;
 if(go>0){const x1=TX(1.5*go);s+=rect(TX(0),yt,x1-TX(0),h,{fill:T,fo:.3,stroke:T,sw:2,rx:4});
  if(txt)s+=fade(seg(go,.8,1),B('行き 1.5 h',(TX(0)+x1)/2,yt+29,{size:24,color:C.ink,anchor:'middle'}));
  if(spd)s+=fade(seg(go,.3,.6),B('60 km/h',TX(.75),yt-12,{size:24,color:V,anchor:'middle'}));
  if(div)s+=fade(div*seg(go,.8,1),B('90÷60',TX(.75),y+70,{size:24,color:C.ink,anchor:'middle'}));}
 if(back>0){const x1=TX(1.5+back);s+=rect(TX(1.5),yt,x1-TX(1.5),h,{fill:T,fo:.18,stroke:T,sw:2,rx:4});
  if(txt)s+=fade(seg(back,.8,1),B('帰り 1.0 h',(TX(1.5)+x1)/2,yt+29,{size:24,color:C.ink,anchor:'middle'}));
  if(spd)s+=fade(seg(back,.3,.6),B('90 km/h',TX(2),yt-12,{size:24,color:V,anchor:'middle'}));
  if(div)s+=fade(div*seg(back,.8,1),B('90÷90',TX(2),y+70,{size:24,color:C.ink,anchor:'middle'}));}
 return fade(g,s);
}
// 道の上の、往復の白い線2本と「180 km」
function roundLines(y,g=1){
 return fade(g,arrow(RX(0),y-34,RX(90),y-34,{color:C.ink,w:4,head:14})+arrow(RX(90),y-54,RX(0),y-54,{color:C.ink,w:4,head:14})
  +B('180 km',RX(45),y-68,{size:28,color:C.ink,anchor:'middle'}));
}
// 式の文字を部品に分けて並べ、部品ごとに黄で光らせる。parts＝[[文字,色,光の強さ],...]
function partsRow(parts,cx,y,{size=34}={}){
 const ws=parts.map(([t])=>textW(t,size)),W=ws.reduce((a,b)=>a+b,0);let x=cx-W/2,s='';
 parts.forEach(([t,col,hl=0],i)=>{if(hl>0)s+=fade(hl,rect(x-4,y-size-2,ws[i]+8,size+16,{fill:HI,fo:.18,stroke:HI,sw:2.5,rx:8}));
  s+=B(t,x,y,{size,color:hl>.5?HI:col});x+=ws[i];});
 return s;
}
const defRow=(cx,y,{h1=0,h2=0,size=34}={})=>partsRow([['平均の速さ',V],[' ＝ ',C.ink],['全体の道のり',X,h1],[' ÷ ',C.ink],['全体の時間',T,h2]],cx,y,{size});
// 60〜90 の紫の数直線
const NX=v=>200+(v-60)*800/30;
function speedLine(y,{g=1,m75=1,m72=1,hi72=0}={}){
 let s=line(NX(58),y,NX(92),y,{color:V,w:4});
 for(let v=60;v<=90;v+=5)s+=line(NX(v),y-8,NX(v),y+8,{color:V,w:2});
 for(const v of [60,70,80,90])s+=label(String(v),NX(v),y+36,{size:22,color:V,anchor:'middle'});
 s+=label('速さ [km/h]',NX(92)+16,y+8,{size:22,color:V});
 s+=fade(m75,line(NX(75),y-26,NX(75),y+4,{color:C.ink,w:3})+B('真ん中 75',NX(75),y-36,{size:24,color:C.ink,anchor:'middle'}));
 s+=fade(m72,dot(NX(72),y,10,hi72>.5?HI:V)+ring(NX(72),y,16,{color:HI,w:3})+B('72',NX(72),y+68,{size:26,color:HI,anchor:'middle'}));
 return fade(g,s);
}
// 30分ごとに切った時間の帯（5区間）。k＝見せる区間の数（0〜5、小数で現れる途中）
function sliced(y,{k=5,hi60=0,g=1}={}){
 const h=44,yt=y-h-6;let s='';
 for(let i=0;i<5;i++){const a=clamp(k-i);if(a<=0)continue;const x0=TX(.5*i),slow=i<3;
  s+=fade(a,rect(x0,yt,180,h,{fill:T,fo:slow?.3:.18,stroke:T,sw:2,rx:3})+B(slow?'60':'90',x0+90,yt-14,{size:30,color:V,anchor:'middle'}));}
 if(hi60>0)s+=fade(hi60,rect(TX(0)-8,yt-52,540+16,h+62,{fill:'none',fo:0,stroke:HI,sw:4,rx:10})+B('長い 時間',TX(.75),y+70,{size:26,color:HI,anchor:'middle'}));
 return fade(g,s);
}
// km/h を分数で（行15〜18）
const frac=(a,b,col=C.ink)=>`{\\color{${col}}\\dfrac{${a}}{${b}}}`;
const hiT=(s,on)=>on?`{\\color{${HI}}${s}}`:s;

export const qxHsM1Velocity1Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、6 秒＋静止）=================
 // 道（目盛り 0〜90 km）。車が右へ（紫の札 60 km/h）、右端で向きを変えて左へ戻る（札 90 km/h）。最後に「行き」「帰り」の札で静止。
 // 時間の帯・時間の数値・平均の値は出さない。
 [K+'q0']:(p)=>setupPic(p),
 // ================= S1 小問1 =================
 // 1. 出題中の図を再生して静止
 [K+'setup']:(p)=>setupPic(Math.min(1,p*1.25)),
 // 2. 求めるもの：往復全体の平均の速さ。道の上に「？ km/h」
 [K+'goal1']:(p)=>{
  let s=setupPic(1);
  s+=fade(seg(p,.25,.4),rect(RX(45)-90,RY-236,180,56,{fill:'#1a1430',fo:.95,stroke:HI,sw:2.5,rx:10})+B('？ km/h',RX(45),RY-196,{size:30,color:HI,anchor:'middle'}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 平均の速さ＝全体の道のり÷全体の時間（定義）。言葉に合わせて順に光らせる
 [K+'def']:(p,ctx)=>{
  const [a,b]=sentWin(ctx)[0],L=b-a;
  let s=card(110,96,980,96,defRow(600,158,{h1:seg(p,a+L*.3,a+L*.4)*(1-seg(p,a+L*.62,a+L*.68)),h2:seg(p,a+L*.62,a+L*.72)*(1-seg(p,b+.02,b+.08))}),seg(p,0,.08),HI);
  s+=kindTag('定義',1040,230,{g:seg(p,.05,.15)});
  s+=fade(.55,setupPic(1,{y:400,names:0}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 時間の軸と帯：行き 1.5 h（90÷60）、帰り 1.0 h（90÷90）
 [K+'time']:(p,ctx)=>{
  const W=sentWin(ctx),[a,b]=W[1]??[.3,1],m=(a+b)/2;
  let s=road(150,{names:0});
  s+=timeAxis(390,{g:seg(p,.03,.15)});
  s+=bars(390,{go:lin(p,a+.02,m-.05),back:lin(p,m+.02,b-.06),div:1});
  s+=goalTag(G1);
  return s;
 },
 // 5. 合計 2.5 h。道の上に往復の白い線2本「180 km」
 [K+'total']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=road(150,{names:0})+timeAxis(390)+bars(390,{div:1});
  s+=fade(seg(p,.03,.15),line(TX(0),488,TX(2.5),488,{color:T,w:3})+line(TX(0),478,TX(0),498,{color:T,w:3})+line(TX(2.5),478,TX(2.5),498,{color:T,w:3})+B('合計 2.5 h',TX(2.5)+10,497,{size:26,color:T}));
  s+=roundLines(150,seg(p,b+.02,b+.15));
  s+=goalTag(G1);
  return s;
 },
 // 6. 180÷2.5＝72。小問1 の答え C
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=road(150,{names:0})+roundLines(150)+timeAxis(390)+bars(390);
  s+=card(330,200,540,84,tex('180\\div 2.5=72\\ \\mathrm{km/h}',600,250,{size:40,auto:false}),seg(p,.03,.15),HI);
  s+=goalTag(G1)+A1(seg(p,b,b+.06));
  return s;
 },
 // 7.【カット割り】①単純な平均 75 と 平均の速さ 72 の札。時間の帯と、同じ長さの点線の帯（赤の×）
 //    ②札を消し、誤答カード A
 [K+'avg']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,ve=voiceEnd(ctx),out=seg(p,ve-.02,ve+.03);
  let s='';
  const L=card(20,92,570,112,B('単純な平均',305,134,{size:26,color:C.dim,anchor:'middle'})+B('(60＋90)÷2＝75',305,180,{size:32,color:C.ink,anchor:'middle'}),seg(p,.02,.1)*(1-out),C.dim);
  const R=card(610,92,570,112,B('平均の速さ',895,134,{size:26,color:V,anchor:'middle'})+B('180 km÷2.5 h＝72 km/h',895,180,{size:32,color:C.ink,anchor:'middle'}),seg(p,b,b+.08)*(1-out),V);
  s+=L+R;
  // 下：本当の時間の帯（行き 1.5 h、帰り 1.0 h）と、同じ長さに描いた点線の帯
  const gb=seg(p,.08,.18)*(1-out);
  s+=fade(gb,bars(300,{spd:0})+B('本当の 時間',TX(0)-10,262,{size:22,color:C.dim,anchor:'end'}));
  const yd=410,hd=40;
  s+=fade(gb,(rect(TX(0),yd-hd,450,hd,{fill:'none',fo:0,stroke:C.dim,sw:2.5,rx:4})+rect(TX(1.25),yd-hd,450,hd,{fill:'none',fo:0,stroke:C.dim,sw:2.5,rx:4}))
   .replace(/stroke-width="2.5"/g,'stroke-width="2.5" stroke-dasharray="9 7"')
   +B('60',TX(.625),yd-12,{size:24,color:V,anchor:'middle'})+B('90',TX(1.875),yd-12,{size:24,color:V,anchor:'middle'})
   +B('75 は 2本の 時間を 同じ長さと みた 値',TX(1.25),yd+44,{size:24,color:C.dim,anchor:'middle'}));
  const gx=seg(p,.18,.28)*(1-out);
  s+=fade(gx,line(TX(1.25)-26,yd-46,TX(1.25)+26,yd+6,{color:BAD,w:6})+line(TX(1.25)+26,yd-46,TX(1.25)-26,yd+6,{color:BAD,w:6}));
  s+=wrongCard('A','時速 75 km','速さを 足して 2で 割った（単純な平均）',{y:240,g:seg(p,ve+.01,ve+.05)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 8. 誤答 B（36）、誤答 D（120）を1枚ずつ。足りない所に赤の下線
 [K+'wrongBD']:(p,ctx)=>{
  let s=card(250,96,700,72,B('正しくは  180 km ÷ 2.5 h',600,144,{size:30,color:C.ink,anchor:'middle'}),seg(p,0,.08),C.dim);
  const u=n=>`{\\color{${BAD}}\\underline{${n}}}`;
  s+=wrongSeq(p,ctx,[['B','時速 36 km','道のりが 片道だけ',{mid:`${u('90')}\\div 2.5=36`}],['D','時速 120 km','時間が 行きだけ',{mid:`180\\div ${u('1.5')}=120`}]],{opts:{y:200}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2 =================
 // 9. 求めるもの：真ん中にならない理由。60〜90 の数直線に 75 と 72
 [K+'goal2']:(p)=>{
  let s=speedLine(170,{m75:seg(p,.3,.42),m72:seg(p,.5,.62)});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 10. 時間の帯を30分ごとに切る：60、60、60、90、90
 [K+'slices']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=speedLine(170);
  s+=timeAxis(420,{g:seg(p,.02,.1),half:seg(p,.08,.18)});
  s+=sliced(420,{k:5*lin(p,.12,ve*.95)});
  s+=goalTag(G2);
  return s;
 },
 // 11. 長い「60」を黄で囲む。72 は 60 の側（黄の矢印）。小問2 の答え A
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=speedLine(170,{hi72:seg(p,.3,.4)});
  s+=arrow(NX(74),100,NX(66),100,{color:HI,w:5,head:16,g:seg(p,.3,.42)})+fade(seg(p,.3,.42),B('遅いほうへ',NX(64),108,{size:24,color:HI,anchor:'end'}));
  s+=timeAxis(420,{half:1})+sliced(420,{hi60:seg(p,.05,.18)});
  s+=goalTag(G2)+A2(seg(p,b,b+.06));
  return s;
 },
 // 12. 誤答 B（道のりが違う）、誤答 C（速いほうへ寄る）。1枚ずつ
 [K+'wrongBC']:(p,ctx)=>{
  let s=speedLine(170);
  s+=wrongSeq(p,ctx,[['B','道のりが 違う','どちらも 90 km'],['C','速いほうへ 寄る','寄るのは 遅いほう']],{opts:{y:300,w:900}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 13. 折り返し点に「0」を一瞬出して消す。誤答 D
 [K+'wrongD']:(p)=>{
  let s=road(230,{names:1})+car(RX(90),230,{dir:-1});
  const z=seg(p,.12,.18)*(1-seg(p,.32,.4));
  s+=fade(z,ring(RX(90),130,34,{color:HI,w:4})+B('0',RX(90),143,{size:36,color:HI,anchor:'middle'}));
  s+=wrongCard('D','一瞬 0 になった','止まる時間は 0 で、平均に効かない',{y:345,g:seg(p,.45,.52)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3 =================
 // 14. 求めるもの：90 km/h を m/s で。中央に紫の「90 km/h」
 [K+'goal3']:(p)=>{
  let s=fade(seg(p,.2,.35),B('90 km/h',600,300,{size:64,color:V,anchor:'middle'}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. km/h を分数の形に。上の km、下の h を順に光らせる。m/s も分数で並べる
 [K+'frac']:(p,ctx)=>{
  const W=sentWin(ctx),[a,b]=W[0],[c,d]=W[1]??[.5,1],L=d-c;
  const hk=p>c+L*.3&&p<c+L*.62,hh=p>=c+L*.62;
  const f1=seg(p,a+.02,a+.12),f2=seg(p,a+(b-a)*.45,a+(b-a)*.6);
  let s=fade(1-f1,B('km/h',360,300,{size:56,color:V,anchor:'middle'}));
  s+=fade(f1,tex(`\\mathrm{km/h}=${frac(`\\mathrm{${hiT('km',hk)}}`,`\\mathrm{${hiT('h',hh)}}`)}`,360,290,{size:56,auto:false}));
  s+=fade(f2,tex(`\\mathrm{m/s}=${frac(`\\mathrm{${hiT('m',hk)}}`,`\\mathrm{${hiT('s',hh)}}`)}`,920,290,{size:56,auto:false}));
  s+=fade(f2,B('メートル ÷ 秒',920,420,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,c+L*.3,c+L*.4),arrow(540,236,780,236,{color:HI,w:4,head:14})+B('上：km → m',660,214,{size:24,color:HI,anchor:'middle'}));
  s+=fade(seg(p,c+L*.62,c+L*.72),arrow(540,352,780,352,{color:HI,w:4,head:14})+B('下：h → s',660,394,{size:24,color:HI,anchor:'middle'}));
  s+=goalTag(G3);
  return s;
 },
 // 16a. 分子 90 km → 90000 m、分母 1 h → 3600 s を一つずつ
 [K+'replace']:(p)=>{
  const n1=p>.3,d1=p>.62;
  const num=n1?`{\\color{${HI}}90000\\ \\mathrm{m}}`:'90\\ \\mathrm{km}',den=d1?`{\\color{${HI}}3600\\ \\mathrm{s}}`:'1\\ \\mathrm{h}';
  let s=tex(`90\\ \\mathrm{km/h}=\\dfrac{${num}}{${den}}`,600,230,{size:60,auto:false});
  s+=goalTag(G3);
  return s;
 },
 // 16b. 90000÷3600＝25
 [K+'replace2']:(p)=>{
  let s=tex(`90\\ \\mathrm{km/h}=\\dfrac{{\\color{${HI}}90000\\ \\mathrm{m}}}{{\\color{${HI}}3600\\ \\mathrm{s}}}`,600,230,{size:60,auto:false});
  s+=fade(seg(p,.05,.15),card(300,330,600,90,tex(`90000\\div 3600=25\\ \\mathrm{m/s}`,600,385,{size:44,auto:false}),1,V));
  s+=goalTag(G3);
  return s;
 },
 // 17. 小問3 の答え D。3600÷1000＝3.6、「÷3.6」を黄で囲む
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),[c]=W[1]??[.4];
  let s=tex(`90\\ \\mathrm{km/h}=\\dfrac{90000\\ \\mathrm{m}}{3600\\ \\mathrm{s}}=25\\ \\mathrm{m/s}`,600,200,{size:52,auto:false});
  s+=fade(seg(p,c+.02,c+.12),tex('3600\\div 1000=3.6',600,330,{size:34,auto:false,color:C.dim}));
  s+=fade(seg(p,c+.2,c+.3),tex(`90\\ {\\color{${HI}}\\boxed{\\div 3.6}}=25`,600,430,{size:48,auto:false}));
  s+=goalTag(G3)+A3(seg(p,.04,.12));
  return s;
 },
 // 18. 誤答 A（324）、B（1.5）、C（90）を1枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  let s=tex(`90\\ \\mathrm{km/h}=\\dfrac{90000\\ \\mathrm{m}}{3600\\ \\mathrm{s}}=25\\ \\mathrm{m/s}`,600,200,{size:52,auto:false});
  s+=wrongSeq(p,ctx,[['A','324 m/s','3.6 を 掛けた'],['B','1.5 m/s','90÷60 は km/分'],['C','90 m/s','数を 直していない']]);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p)=>{
  let s=card(110,190,980,110,defRow(600,258,{size:36}),seg(p,.03,.15),HI);
  s+=fade(seg(p,.2,.35),rect(102,182,996,126,{fill:'none',fo:0,stroke:HI,sw:4,rx:18}));
  s+=kindTag('定義',600,360,{g:seg(p,.2,.35)});
  return s;
 },
};
