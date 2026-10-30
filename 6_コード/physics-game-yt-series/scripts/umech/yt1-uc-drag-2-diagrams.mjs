// YouTube シリーズ「空気抵抗・上級 2/2」(ys-uc-drag-2) — 図。Stage 1200×515.
// 色（1/2・中級と同じ）：速度 v 紫、終端速度の線 黄、差 w 橙、力 緑、加速度 赤、時刻 t 金、強調 黄、誤り 赤、確かめ 緑。
// 2乗の抵抗 cv² は黄（直線 kv は緑）で区別。上端の帯：手順5段（力を書く → ma＝F → 初期条件 → 解く → 確かめる）。
// 数値：m＝70 kg、c＝0.25 kg/m、g＝9.8 → mg＝686 N、v∞＝√2744＝52.38 m/s、v∞/g＝5.345 s。
//   比較の比例モデル k＝mg/v∞＝13.10 kg/s（同じ v∞、τ＝v∞/g）。v（比例）＝v∞(1−e^(−t/τ))、v（2乗）は計算機の数値解
//   （数値積分の結果は v∞·tanh(gt/v∞) と一致することを確認済み。ここではその値を描く。関数名は出さない）。
//   t＝v∞/g：比例 33.1、2乗 39.9 m/s。半分の速さ 26.2 m/s：抵抗 343 N（比例）、171.5 N（2乗）。
import {C,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,draw,poly} from './anim.mjs';

const K='uc-drag-2:';
const CF=C.F,CV=C.v,CA=C.a,CT=C.t,CH=C.hi,CD=C.dim,CW=C.E,OK=C.F,CR=C.a,CQ=C.hi;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const TF=(s,x,y,maxW,size=44,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const check=(x,y,sz=14,color=OK)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const cross=(x,y,sz=14,color=CR)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:5})+line(x-sz,y+sz,x+sz,y-sz,{color,w:5});

const v=cs(CV,'v'),t=cs(CT,'t'),W=cs(CW,'w'),V8=`${v}_\\infty`;
const dvdt=`\\dfrac{d${v}}{d${t}}`;
const EQ2=`m${dvdt}=mg-c${v}^2`;

// ---- ball and arrows ----
function ball(x,y,{r=30,g=1}={}){return fade(g,ring(x,y,r,{color:C.dim,w:3,fill:'#2b3d63'})+dot(x-9,y-9,7,'#5a73a6'));}
function downAxis(x,y1,y2,g=1){return fade(g,arrow(x,y1,x,y2,{color:CD,w:3,head:14})+label('＋',x+14,y2-6,{size:28,color:CH,weight:700})+label('下向きが 正',x,y1-14,{size:22,color:CD,anchor:'middle'}));}

// ---- 5-step bar ----
const STEPS=['① 力を書く','② ma＝F','③ 初期条件','④ 解く','⑤ 確かめる'];
function bar(cur,g=1){
 let s='';
 STEPS.forEach((n,i)=>{
  const x=14+i*237,w=222,y=6,h=40,on=i+1===cur,done=i+1<cur;
  s+=rect(x,y,w,h,{fill:on?CH:'#131f38',fo:on?.2:.9,stroke:on?CH:C.faint,sw:on?2.5:1.5,rx:10});
  s+=label(n,x+w/2,y+28,{size:22,color:on?CH:done?C.ink:C.dim,anchor:'middle',weight:on?700:400});
  if(done)s+=check(x+w-18,y+20,8);
 });
 return fade(g,s);
}

// ---- numbers ----
const m=70,c=.25,g=9.8,MG=m*g,VI=Math.sqrt(MG/c),TS=VI/g,KL=MG/VI;
const vLin=u=>VI*(1-Math.exp(-u/TS)),vQuad=u=>VI*Math.tanh(u/TS);
const GT=(o={})=>axes({x:100,y:465,w:520,h:330,xmin:0,xmax:16,ymin:0,ymax:60,xticks:[4,8,12,16],yticks:[10,20,30,40,50],grid:true,xlabel:'t [s]',ylabel:'速度 v [m/s]',xcolor:CT,ycolor:CV,...o});
const vline=(A,g=1)=>fade(g,line(A.X(0),A.Y(VI),A.X(16),A.Y(VI),{color:CH,w:3,dash:'10 7'})+label('v∞ ≈ 52.4',A.X(16),A.Y(VI)-12,{size:22,color:CH,anchor:'end',weight:700}));
const GF=(o={})=>axes({x:110,y:465,w:500,h:330,xmin:0,xmax:66,ymin:0,ymax:1000,xticks:[20,40,60],yticks:[200,400,600,800],grid:true,xlabel:'速さ [m/s]',ylabel:'抵抗の 大きさ [N]',xcolor:CV,ycolor:CF,...o});

export const ytUcDrag2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const A=axes({x:620,y:460,w:480,h:330,xmin:0,xmax:2,ymin:0,ymax:2.2,xticks:[],yticks:[],xlabel:'速さ',ylabel:'抵抗の 大きさ',xcolor:CV,ycolor:CF});
  let s=card(80,100,470,170,L('前回の結果は',315,150,{size:26,color:CD})+L('抵抗 ＝ kv の モデル',315,215,{size:32,color:CF,weight:700}),1);
  s+=A.svg+A.plot(u=>u,{from:0,to:1.9,color:CF,w:4})+label('kv',A.X(1.9)+6,A.Y(1.9)+30,{size:26,color:CF});
  s+=fade(seg(p,.4,.55),A.plot(u=>u*u*.6,{from:0,to:1.9,color:CQ,w:4})+label('速さの 2乗',A.X(1.55),A.Y(2.1),{size:24,color:CQ,anchor:'end'}));
  s+=fade(seg(p,.45,.6),L('速い物体では 2乗に 近い',315,360,{size:30,color:CQ,weight:700}));
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=card(80,110,480,260,L('モデルを 変えると',320,170,{size:26,color:CD})+L('終端速度は？',320,270,{size:40,color:CH,weight:700}),1,CH);
  s+=card(640,110,480,260,L('モデルを 変えると',880,170,{size:26,color:CD})+L('解き方は？',880,270,{size:40,color:CH,weight:700}),seg(p,.3,.45),CH);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=card(100,90,1000,150,L('前回（抵抗 kv）',600,135,{size:24,color:CD})+T(`${v}=${V8}+(${v}_0-${V8})\\,e^{-${t}/${cs(CT,'\\tau')}}`,600,200,{size:50}),1,OK);
  s+=fade(seg(p,.4,.55),L('変数分離で 導き',380,320,{size:30})+L('代入で 確かめた',820,320,{size:30})+check(560,312,12)+check(1000,312,12));
  return s;
 },
 [K+'which']:(p)=>{
  const fr=z=>z-Math.floor(z);let fog='';for(let i=0;i<24;i++){const x=110+380*fr(Math.sin(i*12.9898)*43758.5),y=120+200*fr(Math.sin(i*78.233)*12345.6);fog+=dot(x,y,4+(i%3),'#9fb4d6',.55);}
  let s=card(70,80,500,370,fog+L('霧の粒：小さく 遅い',320,370,{size:28})+L('抵抗 ≈ kv',320,420,{size:32,color:CF,weight:700}),1);
  // skydiver: simple figure
  const sx=880,sy=230;
  const diver=ring(sx,sy-40,20,{color:C.ink,w:3,fill:'#2b3d63'})+line(sx,sy-20,sx,sy+50,{color:C.ink,w:5})+line(sx,sy,sx-60,sy-30,{color:C.ink,w:5})+line(sx,sy,sx+60,sy-30,{color:C.ink,w:5})+line(sx,sy+50,sx-40,sy+100,{color:C.ink,w:5})+line(sx,sy+50,sx+40,sy+100,{color:C.ink,w:5});
  s+=card(630,80,500,370,diver+L('スカイダイバー・車：速い',880,370,{size:28})+L('抵抗 ≈ （速さの 2乗）',880,420,{size:30,color:CQ,weight:700}),seg(p,.4,.55));
  return s;
 },
 [K+'assume']:(p)=>{
  let s=card(150,100,900,150,L('どちらも',600,150,{size:26,color:CD})+L('現象に 合わせて 選ぶ 仮定 ＝ モデル',600,210,{size:34,color:CH,weight:700}),1,CH);
  s+=card(300,300,600,110,L('法則として 決まっているわけ ではない',600,365,{size:28,color:CR,weight:700}),seg(p,.45,.6),CR);
  return s;
 },
 [K+'steps']:(p)=>{
  let s=label('同じ 手順（2乗の モデルで）',600,90,{size:28,color:C.ink,anchor:'middle'});
  const nm=['力を 書く','ma ＝ F','初期条件','解く','確かめる'];
  nm.forEach((n,i)=>{const x=60+i*225,gg=seg(p,.35+i*.1,.45+i*.1);s+=fade(gg,rect(x,170,190,110,{fill:'#131f38',fo:.96,stroke:CH,sw:2,rx:14})+label('①②③④⑤'[i],x+28,205,{size:28,color:CH,weight:700})+L(n,x+105,245,{size:28}));if(i<4)s+=fade(gg,arrow(x+192,225,x+222,225,{color:CD,w:4,head:12}));});
  return s;
 },
 // ===== S2 力と方程式 =====
 [K+'force']:(p)=>{
  let s=bar(1)+downAxis(130,110,430)+ball(330,240);
  s+=arrow(250,200,250,290,{color:CV,w:7})+label('v ≧ 0',250,320,{size:24,color:CV,anchor:'middle'});
  s+=fade(seg(p,.25,.4),arrow(330,270,330,420,{color:CF,w:6})+label('＋mg',346,415,{size:26,color:CF}));
  s+=fade(seg(p,.5,.65),arrow(330,210,330,110,{color:CQ,w:6})+label('抵抗 cv²（上向き）',346,125,{size:26,color:CQ}));
  s+=card(600,140,540,240,L('下向きを 正',870,190,{size:26,color:CD})+fade(seg(p,.3,.45),T(`+mg`,760,275,{size:50}))+fade(seg(p,.6,.75),T(`-c${v}^2`,960,275,{size:50}))+fade(seg(p,.7,.85),L('上向きなので マイナス',960,340,{size:22,color:CQ})),1);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=bar(1)+T(`c${v}^2\\;[\\mathrm{N}]`,320,170,{size:52});
  s+=fade(seg(p,.2,.35),T(`${v}^2\\;[\\mathrm{m^2/s^2}]`,880,170,{size:52}));
  s+=fade(seg(p,.5,.7),T(`c=\\dfrac{\\mathrm{N}}{\\mathrm{m^2/s^2}}`,600,350,{size:56}));
  return s;
 },
 [K+'unit2']:(p)=>{
  let s=bar(1)+T(`c=\\dfrac{\\mathrm{N}}{\\mathrm{m^2/s^2}}=\\dfrac{\\mathrm{kg\\,m/s^2}}{\\mathrm{m^2/s^2}}=\\mathrm{kg/m}`,600,170,{size:48});
  s+=card(150,290,420,150,L('2乗の 係数 c',360,340,{size:26,color:CQ})+L('kg/m',360,400,{size:36,color:CQ,weight:700}),seg(p,.4,.55),CQ);
  s+=card(630,290,420,150,L('比例の 係数 k',840,340,{size:26,color:CF})+L('kg/s',840,400,{size:36,color:CF,weight:700}),seg(p,.5,.65),CF);
  return s;
 },
 [K+'eq']:(p)=>{
  let s=bar(2)+T(`m\\,a=F`,600,130,{size:48});
  s+=fade(seg(p,.05,.2),arrow(600,170,600,220,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.1,.3),T(EQ2,600,300,{size:72}));
  {const R=600+texWidth(EQ2,72,false)/2;s+=fade(seg(p,.55,.7),arrow(R-10,400,R-25,345,{color:CQ,w:4,head:12})+L('v が 2乗に',R-10,435,{size:30,color:CQ,weight:700,anchor:'end'}));}
  return s;
 },
 [K+'updown']:(p)=>{
  let s=bar(1)+downAxis(130,110,430)+ball(380,250);
  s+=arrow(300,300,300,190,{color:CV,w:7})+label('上へ 動く：v ＜ 0',300,335,{size:24,color:CV,anchor:'middle'});
  s+=fade(seg(p,.4,.55),arrow(380,220,380,110,{color:CR,w:6})+label('−cv²：上向き',396,125,{size:26,color:CR})+cross(430,180,14));
  s+=card(640,140,500,230,L('−cv² は いつも 負 ＝ 上向き',890,200,{size:28,color:CR})+fade(seg(p,.6,.75),L('運動と 同じ向き',890,270,{size:32,color:CR,weight:700})+L('→ 抵抗として おかしい',890,325,{size:28,color:CR})),seg(p,.4,.55),CR);
  return s;
 },
 [K+'abs']:(p)=>{
  let s=bar(1)+downAxis(130,110,430)+ball(380,250);
  s+=arrow(300,300,300,190,{color:CV,w:7})+label('v ＜ 0',300,170,{size:24,color:CV,anchor:'middle'});
  s+=fade(seg(p,.5,.65),arrow(380,280,380,390,{color:CQ,w:6})+label('＋cv²：下向き',396,385,{size:26,color:CQ})+check(600,375,12));
  s+=card(640,110,500,300,L('抵抗は いつも 運動と 逆向き',890,165,{size:26,color:CD})+T(`-c\\,|${v}|\\,${v}`,890,250,{size:60})
   +fade(seg(p,.5,.65),T(`${v}<0:\\;\\; -c|${v}|${v}=+c${v}^2`,890,350,{size:40})),1,CQ);
  return s;
 },
 [K+'lin']:(p)=>{
  let s=bar(1);
  s+=card(80,100,500,280,L('比例の モデル',330,150,{size:26,color:CF})+T(`-k${v}`,330,240,{size:60})+L('v の 符号で 自動で 逆向き',330,330,{size:26}),1,CF);
  s+=card(620,100,500,280,L('2乗の モデル',870,150,{size:26,color:CQ})+T(`-c\\,|${v}|\\,${v}`,870,240,{size:56})+L('絶対値で 向きを 補う',870,330,{size:26}),seg(p,.4,.55),CQ);
  return s;
 },
 [K+'init']:(p)=>{
  let s=bar(3)+T(EQ2,600,140,{size:56})+label('落ちる 向きだけ：v ≧ 0',600,225,{size:26,color:CD,anchor:'middle'});
  s+=card(330,280,540,150,L('初期条件：静止から',600,330,{size:26,color:CD})+T(`${v}(0)=0`,600,395,{size:52}),seg(p,.45,.6),CH);
  return s;
 },
 // ===== S3 終端速度 =====
 [K+'term1']:(p)=>{
  let s=bar(4)+T(EQ2,600,130,{size:52});
  s+=fade(seg(p,.1,.25),label('加速が 止まる：dv/dt ＝ 0',600,215,{size:26,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),T(`0=mg-c${V8}^{\\,2}`,600,330,{size:64}));
  return s;
 },
 [K+'term2']:(p)=>{
  let s=bar(4)+T(`0=mg-c${V8}^{\\,2}`,600,120,{size:48});
  s+=fade(seg(p,.05,.2),label('c v∞² を 右へ 移す',820,195,{size:24,color:CH,anchor:'start'})+arrow(600,160,600,205,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.1,.25),T(`c${V8}^{\\,2}=mg`,600,265,{size:52}));
  s+=fade(seg(p,.5,.62),label('両辺 ÷ c',820,335,{size:24,color:CH,anchor:'start'})+arrow(600,300,600,345,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.55,.7),T(`${V8}^{\\,2}=\\dfrac{mg}{c}`,600,425,{size:52}));
  return s;
 },
 [K+'term3']:(p)=>{
  let s=bar(4)+T(`${V8}^{\\,2}=\\dfrac{mg}{c}`,330,140,{size:46});
  s+=fade(seg(p,.1,.25),label('落ちる向き：v∞ ＞ 0 → 正の 平方根',330,225,{size:24,color:CD,anchor:'middle'}));
  s+=card(80,260,500,170,T(`${V8}=\\sqrt{\\dfrac{mg}{c}}`,330,355,{size:58}),seg(p,.2,.35),CQ);
  s+=card(640,260,480,170,L('比例の モデルでは',880,305,{size:24,color:CF})+T(`${V8}=\\dfrac{mg}{k}`,880,375,{size:46}),seg(p,.6,.75),CF);
  return s;
 },
 [K+'unitchk']:(p)=>{
  let s=bar(4)+T(`\\dfrac{mg}{c}:\\;\\dfrac{\\mathrm{N}}{\\mathrm{kg/m}}=\\dfrac{\\mathrm{kg\\,m/s^2}}{\\mathrm{kg/m}}=\\mathrm{m^2/s^2}`,600,160,{size:46});
  s+=fade(seg(p,.4,.55),T(`\\sqrt{\\mathrm{m^2/s^2}}=\\mathrm{m/s}`,600,300,{size:52}));
  s+=fade(seg(p,.6,.75),L('速さの 単位',600,400,{size:30,color:OK,weight:700})+check(720,392,12));
  return s;
 },
 [K+'sky']:(p)=>{
  const sx=230,sy=240;
  let s=bar(4)+ring(sx,sy-40,20,{color:C.ink,w:3,fill:'#2b3d63'})+line(sx,sy-20,sx,sy+50,{color:C.ink,w:5})+line(sx,sy,sx-60,sy-30,{color:C.ink,w:5})+line(sx,sy,sx+60,sy-30,{color:C.ink,w:5})+line(sx,sy+50,sx-40,sy+100,{color:C.ink,w:5})+line(sx,sy+50,sx+40,sy+100,{color:C.ink,w:5});
  s+=label('スカイダイバー',sx,410,{size:26,color:C.ink,anchor:'middle'});
  s+=card(460,90,620,330,L('新しい 数値例',770,140,{size:24,color:CD})+fade(seg(p,.15,.3),L('m ＝ 70 kg',770,210,{size:32}))+fade(seg(p,.3,.45),L('c ＝ 0.25 kg/m',770,280,{size:32,color:CQ}))+fade(seg(p,.5,.65),L('g ＝ 9.8 m/s²',770,350,{size:32})),1);
  return s;
 },
 [K+'sky2']:(p)=>{
  let s=bar(4)+T(`\\dfrac{mg}{c}=\\dfrac{70\\times 9.8}{0.25}=2744`,600,130,{size:46});
  s+=fade(seg(p,.35,.5),T(`${V8}=\\sqrt{2744}\\approx 52.4\\ \\mathrm{m/s}`,600,265,{size:52}));
  s+=fade(seg(p,.7,.85),L('52.4 × 3.6 ≈ 189 → 時速 約 189 km',600,390,{size:32,color:CH,weight:700}));
  return s;
 },
 [K+'sky3']:(p)=>{
  const A=GT();
  let s=bar(4)+A.svg+vline(A);
  s+=fade(seg(p,.05,.3),A.plot(u=>g*u,{from:0,to:TS,color:CA,w:4,dash:'10 7'})+label('傾き g',A.X(0.4),A.Y(44),{size:22,color:CA,anchor:'start'}));
  s+=fade(seg(p,.3,.45),line(A.X(TS),A.Y(0),A.X(TS),A.Y(VI),{color:CT,w:2,dash:'6 6'})+dot(A.X(TS),A.Y(VI),9,CH)+label('約 5.3 s',A.X(TS)+8,A.Y(0)-12,{size:22,color:CT}));
  s+=card(680,110,460,280,T(`\\dfrac{${V8}}{g}=\\dfrac{52.4}{9.8}`,910,190,{size:44})+L('≈ 5.3 s',910,275,{size:36,color:CT,weight:700})+fade(seg(p,.6,.75),L('時間の 目安',910,345,{size:28,color:CH})),seg(p,.2,.35));
  return s;
 },
 // ===== S4 近づき方 =====
 [K+'cmp']:(p)=>{
  let s=bar(4);
  s+=card(80,100,500,280,L('2乗の モデル',330,150,{size:26,color:CQ})+T(`c${v}^2`,330,230,{size:54})+L('c ＝ 0.25 kg/m',330,315,{size:26}),1,CQ);
  s+=card(620,100,500,280,L('比例の モデル（比べる 相手）',870,150,{size:26,color:CF})+T(`k${v}`,870,230,{size:54})+L('k ＝ mg ÷ v∞ ≈ 13.1 kg/s',870,315,{size:26}),seg(p,.4,.55),CF);
  s+=fade(seg(p,.6,.75),L('どちらも 終端速度 ≈ 52.4 m/s',600,440,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'graph']:(p)=>{
  const A=GF();
  let s=bar(4)+A.svg;
  s+=line(A.X(0),A.Y(MG),A.X(66),A.Y(MG),{color:CD,w:2,dash:'8 6'})+label('mg ＝ 686 N',A.X(2),A.Y(MG)-10,{size:22,color:CD,anchor:'start'});
  s+=fade(seg(p,.1,.3),A.plot(u=>KL*u,{from:0,to:64,color:CF,w:4})+label('kv',A.X(30)-6,A.Y(KL*30)-14,{size:26,color:CF,anchor:'end'}));
  s+=fade(seg(p,.25,.45),A.plot(u=>c*u*u,{from:0,to:63,color:CQ,w:4})+label('cv²',A.X(40)+6,A.Y(c*40*40)+34,{size:26,color:CQ}));
  s+=fade(seg(p,.55,.7),line(A.X(VI),A.Y(0),A.X(VI),A.Y(MG),{color:CH,w:2,dash:'6 6'})+dot(A.X(VI),A.Y(MG),10,CH)+label('v∞',A.X(VI),A.Y(0)-10,{size:22,color:CH,anchor:'middle'}));
  s+=card(700,140,440,200,L('終端速度で',920,195,{size:28})+L('どちらも 抵抗 ＝ mg',920,255,{size:32,color:CH,weight:700})+L('（重力と つり合う）',920,305,{size:24,color:CD}),seg(p,.6,.75));
  return s;
 },
 [K+'predict']:(p)=>{
  const A=GF();const vh=VI/2;
  let s=bar(4)+A.svg+line(A.X(0),A.Y(MG),A.X(66),A.Y(MG),{color:CD,w:2,dash:'8 6'})+label('mg',A.X(2),A.Y(MG)-10,{size:22,color:CD,anchor:'start'});
  s+=A.plot(u=>KL*u,{from:0,to:64,color:CF,w:4})+A.plot(u=>c*u*u,{from:0,to:63,color:CQ,w:4});
  s+=fade(seg(p,.1,.25),line(A.X(vh),A.Y(0),A.X(vh),A.Y(MG),{color:CV,w:3,dash:'6 6'})+label('半分の 速さ',A.X(vh),A.Y(MG)-12,{size:22,color:CV,anchor:'middle'}));
  s+=card(700,140,440,200,L('終端の 半分の 速さで',920,195,{size:26})+L('強く 加速して いるのは',920,250,{size:28,color:CH,weight:700})+L('どちら？',920,300,{size:30,color:CH,weight:700}),seg(p,.2,.35),CH);
  return s;
 },
 [K+'half1']:(p)=>{
  const A=GF();const vh=VI/2;
  let s=bar(4)+A.svg+line(A.X(0),A.Y(MG),A.X(66),A.Y(MG),{color:CD,w:2,dash:'8 6'})+label('mg',A.X(2),A.Y(MG)-10,{size:22,color:CD,anchor:'start'});
  s+=A.plot(u=>KL*u,{from:0,to:64,color:CF,w:4})+fade(.35,A.plot(u=>c*u*u,{from:0,to:63,color:CQ,w:4}));
  s+=line(A.X(vh),A.Y(0),A.X(vh),A.Y(MG),{color:CV,w:3,dash:'6 6'});
  s+=fade(seg(p,.1,.25),dot(A.X(vh),A.Y(MG/2),9,CF)+label('mg/2',A.X(vh)-12,A.Y(MG/2)-8,{size:24,color:CF,anchor:'end',weight:700}));
  s+=fade(seg(p,.3,.45),line(A.X(vh)+14,A.Y(MG/2),A.X(vh)+14,A.Y(MG),{color:CA,w:5})+label('残り',A.X(vh)+22,A.Y(MG*.75)+8,{size:22,color:CA}));
  s+=card(700,120,440,240,L('比例：抵抗 mg/2',920,175,{size:28,color:CF})+fade(seg(p,.4,.55),T('a=g-\\dfrac{g}{2}',920,250,{size:44})+L('＝ 0.5g',920,325,{size:34,color:CA,weight:700})),1,CF);
  return s;
 },
 [K+'half2']:(p)=>{
  const A=GF();const vh=VI/2;
  let s=bar(4)+A.svg+line(A.X(0),A.Y(MG),A.X(66),A.Y(MG),{color:CD,w:2,dash:'8 6'})+label('mg',A.X(2),A.Y(MG)-10,{size:22,color:CD,anchor:'start'});
  s+=fade(.35,A.plot(u=>KL*u,{from:0,to:64,color:CF,w:4}))+A.plot(u=>c*u*u,{from:0,to:63,color:CQ,w:4});
  s+=line(A.X(vh),A.Y(0),A.X(vh),A.Y(MG),{color:CV,w:3,dash:'6 6'});
  s+=fade(seg(p,.2,.35),dot(A.X(vh),A.Y(MG/4),9,CQ)+label('mg/4',A.X(vh)-12,A.Y(MG/4)-8,{size:24,color:CQ,anchor:'end',weight:700}));
  s+=fade(seg(p,.5,.65),line(A.X(vh)+14,A.Y(MG/4),A.X(vh)+14,A.Y(MG),{color:CA,w:5})+label('残り',A.X(vh)+22,A.Y(MG*.6)+8,{size:22,color:CA}));
  s+=card(700,120,440,240,L('2乗：(1/2)² ＝ 1/4 → mg/4',920,175,{size:26,color:CQ})+fade(seg(p,.5,.65),T('a=g-\\dfrac{g}{4}',920,250,{size:44})+L('＝ 0.75g',920,325,{size:34,color:CA,weight:700})),1,CQ);
  return s;
 },
 [K+'why']:(p)=>{
  const A=GF();
  let s=bar(4)+A.svg+line(A.X(0),A.Y(MG),A.X(66),A.Y(MG),{color:CD,w:2,dash:'8 6'});
  s+=A.plot(u=>KL*u,{from:0,to:64,color:CF,w:4})+A.plot(u=>c*u*u,{from:0,to:63,color:CQ,w:4});
  s+=fade(seg(p,.05,.2),highlight(A.X(0),A.Y(400),A.X(26)-A.X(0),A.Y(0)-A.Y(400),1,CQ)+label('遅いうち',A.X(13),A.Y(400)-10,{size:22,color:CQ,anchor:'middle'}));
  s+=card(700,120,440,260,L('遅いうちは v² が 小さい',920,175,{size:28,color:CQ})+L('2乗の 抵抗は ほぼ 効かない',920,230,{size:26})+fade(seg(p,.55,.7),L('→ 途中までは',920,295,{size:26})+L('2乗の方が 勢いよく 加速',920,340,{size:28,color:CH,weight:700})),1);
  return s;
 },
 [K+'w1']:(p)=>{
  let s=bar(4)+T(`${W}=${V8}-${v}`,300,110,{size:44})+T(`g=\\dfrac{c}{m}${V8}^{\\,2}`,880,110,{size:44});
  s+=fade(seg(p,.25,.4),T(`\\dfrac{d${W}}{d${t}}=-${dvdt}=-\\Big(g-\\dfrac{c}{m}${v}^2\\Big)`,600,250,{size:46}));
  s+=fade(seg(p,.6,.75),T(`=-\\dfrac{c}{m}\\big(${V8}^{\\,2}-${v}^2\\big)`,600,390,{size:52}));
  return s;
 },
 [K+'w2']:(p)=>{
  let s=bar(4)+T(`\\dfrac{d${W}}{d${t}}=-\\dfrac{c}{m}\\big(${V8}^{\\,2}-${v}^2\\big)`,600,120,{size:46});
  s+=fade(seg(p,.1,.3),T(`${V8}^{\\,2}-${v}^2=(${V8}+${v})(${V8}-${v})`,600,250,{size:46})+label('因数分解',990,258,{size:24,color:CH,anchor:'start'}));
  s+=fade(seg(p,.55,.7),T(`\\dfrac{d${W}}{d${t}}=-\\dfrac{c}{m}(${V8}+${v})\\,${W}`,600,390,{size:56}));
  return s;
 },
 [K+'w3']:(p)=>{
  let s=bar(4)+T(`\\dfrac{d${W}}{d${t}}=-${cs(CH,'\\dfrac{c}{m}')}${cs(CH,'(')}${V8}+${v}${cs(CH,')')}\\,${W}`,600,120,{size:50});
  s+=fade(seg(p,.05,.2),L('縮む 割合：v とともに 変わる',600,230,{size:28,color:CH,weight:700}));
  s+=card(80,280,500,170,L('比例の モデル',330,325,{size:24,color:CF})+L('割合 1/τ は 一定',330,375,{size:28})+L('→ 指数関数 1本',330,420,{size:28,color:CF}),seg(p,.35,.5),CF);
  s+=card(620,280,500,170,L('2乗の モデル',870,325,{size:24,color:CQ})+L('割合が 速さで 変わる',870,375,{size:28})+L('→ 指数関数 1本に ならない',870,420,{size:28,color:CQ}),seg(p,.5,.65),CQ);
  return s;
 },
 [K+'numeric']:(p)=>{
  let s=bar(4)+card(150,90,900,140,L('変数分離の 積分 → まだ 習っていない 関数',600,145,{size:28,color:CD})+L('計算機で 細かく 刻む',600,200,{size:32,color:CH,weight:700}),1,CH);
  s+=fade(seg(p,.35,.5),T(`${v}_{i+1}\\approx ${v}_i+\\Big(g-\\dfrac{c}{m}${v}_i^{\\,2}\\Big)\\Delta ${t}`,600,330,{size:46}));
  s+=fade(seg(p,.55,.7),L('中級の 一歩の式（Δt を ごく小さく）',600,430,{size:26,color:CD}));
  return s;
 },
 [K+'curves']:(p)=>{
  const A=GT();
  let s=bar(4)+A.svg+vline(A);
  s+=A.plot(vLin,{from:0,to:15.8,p:seg(p,.0,.35),color:CF,w:4})+A.plot(vQuad,{from:0,to:15.8,p:seg(p,.0,.35),color:CQ,w:4});
  s+=fade(seg(p,.2,.35),label('kv',A.X(13),A.Y(vLin(13))+28,{size:24,color:CF})+label('cv²',A.X(2.4)-10,A.Y(vQuad(2.4)),{size:24,color:CQ,anchor:'end'}));
  s+=fade(seg(p,.3,.45),line(A.X(TS),A.Y(0),A.X(TS),A.Y(VI),{color:CT,w:2,dash:'6 6'})+label('v∞/g',A.X(TS)+8,A.Y(0)-12,{size:22,color:CT}));
  s+=fade(seg(p,.45,.6),dot(A.X(TS),A.Y(vLin(TS)),9,CF)+label('約 33',A.X(TS)+12,A.Y(vLin(TS))+26,{size:24,color:CF,weight:700}));
  s+=fade(seg(p,.7,.85),dot(A.X(TS),A.Y(vQuad(TS)),9,CQ)+label('約 40',A.X(TS)-12,A.Y(vQuad(TS))-10,{size:24,color:CQ,anchor:'end',weight:700}));
  s+=card(680,110,460,280,L('t ＝ v∞/g ≈ 5.3 s で',910,165,{size:26,color:CD})+fade(seg(p,.45,.6),L('比例：約 63％ ≈ 33 m/s',910,240,{size:28,color:CF,weight:700}))+fade(seg(p,.7,.85),L('2乗：約 76％ ≈ 40 m/s',910,310,{size:28,color:CQ,weight:700})),1);
  return s;
 },
 [K+'curves2']:(p)=>{
  const A=GT();
  let s=bar(4)+A.svg+vline(A)+A.plot(vLin,{from:0,to:15.8,color:CF,w:4})+A.plot(vQuad,{from:0,to:15.8,color:CQ,w:5});
  s+=label('kv',A.X(13),A.Y(vLin(13))+28,{size:24,color:CF})+label('cv²',A.X(2.4)-10,A.Y(vQuad(2.4)),{size:24,color:CQ,anchor:'end'});
  s+=card(680,140,460,200,L('2乗の方が',910,200,{size:28})+L('先に 終端速度へ 近づく',910,260,{size:30,color:CQ,weight:700})+fade(seg(p,.4,.55),L('予想どおり？',910,310,{size:24,color:CD})),1,CQ);
  return s;
 },
 // ===== S5 確かめ・まとめ =====
 [K+'check']:(p)=>{
  let s=bar(5)+T(EQ2,600,120,{size:50});
  s+=fade(seg(p,.1,.25),label('v ＝ v∞（一定）を 入れる',600,205,{size:26,color:CH,anchor:'middle'}));
  s+=card(200,240,380,200,L('左の辺',390,285,{size:24,color:CD})+T(`m\\dfrac{d${V8}}{d${t}}=0`,390,365,{size:44}),seg(p,.2,.35));
  s+=card(620,240,380,200,L('右の辺',810,285,{size:24,color:CD})+T(`mg-c${V8}^{\\,2}=0`,810,365,{size:42}),seg(p,.4,.55));
  s+=fade(seg(p,.65,.8),check(1060,340,18));
  return s;
 },
 [K+'slope']:(p)=>{
  const A=GT();
  let s=bar(5)+A.svg+vline(A)+A.plot(vLin,{from:0,to:15.8,color:CF,w:4})+A.plot(vQuad,{from:0,to:15.8,color:CQ,w:4});
  s+=fade(seg(p,.3,.45),A.plot(u=>g*u,{from:0,to:3.2,color:CA,w:4,dash:'10 7'})+label('傾き g（2本 共通）',A.X(5),A.Y(6),{size:24,color:CA,anchor:'start'}));
  s+=card(680,140,460,200,L('落ち始め：v ＝ 0',910,200,{size:28})+L('抵抗 0 → 加速度 g',910,260,{size:30,color:CA,weight:700})+L('どちらの モデルでも',910,310,{size:24,color:CD}),seg(p,.1,.25));
  return s;
 },
 [K+'lesson']:(p)=>{
  let s=card(150,90,900,120,L('大事なのは 式の 暗記 ではない',600,162,{size:34,color:CR,weight:700}),1,CR);
  const nm=['現象を 見る','力の モデルを 選ぶ','同じ 手順で 解く'];
  nm.forEach((n,i)=>{const x=100+i*350,gg=seg(p,.35+i*.12,.45+i*.12);s+=fade(gg,rect(x,270,300,110,{fill:'#131f38',fo:.96,stroke:OK,sw:2,rx:14})+L(n,x+150,335,{size:30,color:OK,weight:700}));if(i<2)s+=fade(gg,arrow(x+302,325,x+348,325,{color:CD,w:4,head:12}));});
  s+=fade(seg(p,.75,.9),L('霧の粒 → kv、スカイダイバー → cv²',600,450,{size:26,color:CD}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s='';
  const R=[['2乗の モデル（仮定）',EQ2,null],['終端速度',`${V8}=\\sqrt{mg/c}`,null],['半分の 速さで',null,'加速度 0.75g（比例は 0.5g）'],['近づき方',null,'途中まで 勢いよく、先に 近づく'],['向きも 含めると',`-c\\,|${v}|\\,${v}`,null]];
  R.forEach((r,i)=>{const y=100+i*78,gg=seg(p,.03+i*.12,.13+i*.12);s+=fade(gg,check(90,y,10)+label(r[0],120,y+10,{size:28,color:C.ink,anchor:'start'})+(r[1]?TF(r[1],830,y,520,40):'')+(r[2]?label(r[2],830,y+10,{size:28,color:CQ,anchor:'middle'}):''));});
  return s;
 },
 [K+'next1']:(p)=>{
  const A=GT();
  let s=A.svg+vline(A)+A.plot(vQuad,{from:0,to:15.8,color:CQ,w:4});
  s+=card(680,140,460,200,L('ここまで',910,200,{size:26,color:CD})+L('時刻 t を 追って',910,260,{size:30,color:CT,weight:700})+L('速度を 求めた',910,310,{size:30,color:CV,weight:700}),1);
  return s;
 },
 [K+'next2']:(p)=>{
  // curved path with a force arrow along it
  const pts=Array.from({length:61},(_,i)=>{const u=i/60;return [120+u*480,400-260*Math.sin(u*Math.PI*.9)+60*u];});
  let s=draw(pts,seg(p,0,.3),{color:CD,w:4});
  [12,30,48].forEach((i,j)=>{const [x,y]=pts[i];s+=fade(seg(p,.2+j*.08,.3+j*.08),dot(x,y,8,CH)+arrow(x,y,x+60,y-50+j*35,{color:CF,w:5,head:14}));});
  s+=fade(seg(p,.25,.4),label('力が 道に 沿って 変わる',360,470,{size:26,color:CF,anchor:'middle'}));
  s+=card(680,110,460,280,L('仕事を "時間" で',910,175,{size:30,color:CT,weight:700})+L('書き直すと',910,225,{size:28})+fade(seg(p,.5,.65),L('ベクトルのまま',910,290,{size:28,color:CH})+L('運動エネルギーと 結べる？',910,340,{size:30,color:C.E,weight:700})),seg(p,.35,.5),CH);
  return s;
 },
};
