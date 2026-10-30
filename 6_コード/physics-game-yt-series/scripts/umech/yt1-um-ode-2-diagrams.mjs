// YouTube シリーズ「微分方程式・上級 2/2」(ys-um-ode-2) — 図。Stage 1200×515.
// 色（1/2 と同じ）：速さ v 紫、時刻 t・半減期 T 金、量 y・個数 N 橙、減る量・誤り 赤、強調・定数 黄、ln の量 水色、確かめ 緑。
// v の形の図（数値なし）：v＝e^(−0.5t)、2e^(−0.5t)、直線 1−0.5t。
// 中級の例：y＝100e^(−0.2t)。刻みの値 40.96 / 43.05 / 44.01 / 44.90、行き先 44.93。T＝ln2/0.2＝3.466 s。
// 炭素14：T＝5730 年、λ＝1.21×10⁻⁴ /年、1/2・1/4・1/8 は 5730・11460・17190 年。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,draw,poly} from './anim.mjs';

const K='um-ode-2:';
const CV=C.v,CT=C.t,CY=C.E,CR=C.a,CH=C.hi,CL=C.x,OK=C.F;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const cV=s=>cs(CV,s),cT=s=>cs(CT,s),cY=s=>cs(CY,s),cR=s=>cs(CR,s),cH=s=>cs(CH,s),cL=s=>cs(CL,s),cG=s=>cs(OK,s);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const check=(x,y,sz=14,color=OK)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const cross=(x,y,sz=13,color=CR)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:5})+line(x-sz,y+sz,x+sz,y-sz,{color,w:5});

const v=cV('v'),t=cT('t'),TT=cT('T'),v0=`${v}_0`,dvdt=`\\dfrac{d${v}}{d${t}}`;
const SOL=`${v}=${v0}\\,e^{-k${t}}`;
const y0=`${cY('y')}_0`,yy=cY('y'),N=cY('N'),N0=`${cY('N')}_0`;

// v shapes (k=0.5 visual)
const GV=(o={})=>axes({x:90,y:470,w:500,h:330,xmin:0,xmax:4,ymin:0,ymax:2.3,xticks:[],yticks:[],xlabel:'t',ylabel:'v',xcolor:CT,ycolor:CV,...o});
// 中級の例
const yEx=u=>100*Math.exp(-0.2*u);
const GY=(o={})=>axes({x:90,y:460,w:500,h:340,xmin:0,xmax:4.6,ymin:0,ymax:110,xticks:[1,2,3,4],yticks:[20,40,60,80,100],grid:true,xlabel:'t [s]',ylabel:'y [g]',xcolor:CT,ycolor:CY,...o});

export const ytUmOde2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=T(SOL,600,140,{size:70});
  s+=fade(seg(p,.15,.3),arrow(600,205,600,270,{color:CH,w:5}));
  s+=card(250,290,700,150,T(`${dvdt}=-k${v}\\quad ?`,600,368,{size:50}),seg(p,.25,.4),CH);
  s+=fade(seg(p,.45,.6),label('本当に 満たす？',600,480,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=card(80,110,480,280,L('中級：刻みの行き先',320,170,{color:C.dim})+L('44 グラム台',320,260,{size:46,color:CY,weight:700})+L('式から どう出る？',320,340,{size:28,color:CH}),1,CH);
  s+=card(640,110,480,280,L('中級：半分になる時間',880,170,{color:C.dim})+L('約 3.47 秒',880,260,{size:46,color:CT,weight:700})+L('式から どう出る？',880,340,{size:28,color:CH}),seg(p,.35,.5),CH);
  return s;
 },
 [K+'recall']:(p)=>{
  const names=['① 零解','② v で割る','③ ln|v| の傾き','④ 積分','⑤ 指数へ','⑥ 初期値'];
  let s='';
  names.forEach((n,i)=>{const x=14+i*197,g=seg(p,.03+i*.08,.12+i*.08);s+=fade(g,rect(x,90,184,46,{fill:'#131f38',fo:.9,stroke:C.faint,sw:1.5,rx:10})+label(n,x+92,121,{size:22,color:C.ink,anchor:'middle'})+check(x+168,113,8));});
  s+=fade(seg(p,.55,.7),arrow(600,160,600,230,{color:CH,w:5}));
  s+=card(300,250,600,140,T(SOL,600,330,{size:66}),seg(p,.6,.75),OK);
  return s;
 },
 [K+'why']:(p)=>{
  let s='';
  [['絶対値を 外した',.02],['符号を A に まとめた',.18],['一意性を 認めた',.34]].forEach(([n,a],i)=>{s+=fade(seg(p,a,a+.1),rect(110,90+i*85,460,66,{fill:'#131f38',fo:.9,stroke:C.faint,sw:1.5,rx:10})+L(n,340,133+i*85,{size:28}));});
  s+=fade(seg(p,.5,.62),arrow(600,215,690,215,{color:CH,w:5}));
  s+=card(710,130,410,170,L('だから 最後に',915,190,{size:26,color:C.dim})+L('元の式へ 戻して 確かめる',915,250,{size:28,color:CH,weight:700}),seg(p,.55,.7),CH);
  return s;
 },
 // ===== S2 代入 =====
 [K+'two']:(p)=>{
  let s=T(SOL,600,110,{size:52});
  s+=card(110,190,460,220,L('① 方程式',340,240,{size:28,color:CH,weight:700})+T(`${dvdt}=-k${v}`,340,330,{size:50}),seg(p,.1,.25));
  s+=card(630,190,460,220,L('② 初期条件',860,240,{size:28,color:CH,weight:700})+T(`${t}=0\\;\\to\\;${v}=${v0}`,860,330,{size:46}),seg(p,.5,.65));
  return s;
 },
 [K+'lhs']:(p)=>{
  let s=L('左の辺：e の −kt 乗を 微分',600,90,{size:28,color:C.dim});
  s+=T(`\\dfrac{d}{d${t}}\\,e^{\\,${cH(`-k${t}`)}}`,330,220,{size:58});
  s+=fade(seg(p,.15,.3),T(`=\\;e^{-k${t}}`,560,220,{size:58})+label('外側：自分自身',560,305,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),T(`\\times(${cH('-k')})`,800,220,{size:58})+label('中身 −kt の 倍率',800,305,{size:24,color:CH,anchor:'middle'}));
  s+=card(250,370,700,100,L('連鎖律：外側の倍率 × 中身の倍率',600,430,{size:28,color:C.ink}),seg(p,.7,.85));
  return s;
 },
 [K+'lhs2']:(p)=>{
  let s=T(`${dvdt}=${cH(v0)}\\cdot\\dfrac{d}{d${t}}e^{-k${t}}`,600,150,{size:52});
  s+=fade(seg(p,.1,.25),arrow(600,215,600,265,{color:C.dim,w:4,head:12}));
  s+=fade(seg(p,.15,.3),T(`${dvdt}=-k\\times ${cH(v0)}\\times e^{-k${t}}`,600,330,{size:56}));
  s+=fade(seg(p,.55,.7),label('定数の v₀ は そのまま 前に',600,440,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rhs']:(p)=>{
  let s=card(80,90,480,230,L('左の辺',320,140,{color:C.dim})+T(`${dvdt}`,320,215,{size:44})+T(`=-k\\,${v0}\\,e^{-k${t}}`,320,285,{size:42}),1);
  s+=card(640,90,480,230,L('右の辺',880,140,{color:C.dim})+T(`-k${v}`,880,215,{size:44})+fade(seg(p,.15,.3),T(`=-k\\,${v0}\\,e^{-k${t}}`,880,285,{size:42})),1);
  s+=fade(seg(p,.5,.65),T('=',600,285,{size:60,color:OK})+check(600,370,18));
  s+=fade(seg(p,.6,.75),L('どの時刻でも 一致',600,445,{size:32,color:OK,weight:700}));
  return s;
 },
 [K+'init']:(p)=>{
  const A=GV({x:640,w:480});
  let s=A.svg+A.plot(u=>Math.exp(-0.5*u),{from:0,to:3.9,color:CV,w:5})+dot(A.X(0),A.Y(1),10,CH)+label('v₀',A.X(0)-14,A.Y(1)+8,{size:28,color:CH,anchor:'end',weight:700});
  s+=T(`${t}=0:\\; e^{0}=1`,320,140,{size:46});
  s+=fade(seg(p,.25,.4),T(`${v}=${v0}\\times1=${v0}`,320,250,{size:52}));
  s+=fade(seg(p,.55,.7),check(160,350,16)+L('出発の値と 一致',340,362,{size:30,color:OK,weight:700}));
  return s;
 },
 [K+'bad1']:(p)=>{
  const A=GV({x:640,w:480});
  let s=A.svg+A.plot(u=>Math.exp(-0.5*u),{from:0,to:3.9,color:CV,w:4})+dot(A.X(0),A.Y(1),9,CV)+label('v₀',A.X(0)-14,A.Y(1)+8,{size:26,color:CV,anchor:'end'});
  s+=fade(seg(p,.05,.2),A.plot(u=>2*Math.exp(-0.5*u),{from:0,to:3.9,color:CR,w:4,dash:'10 7'})+dot(A.X(0),A.Y(2),9,CR)+label('2v₀',A.X(0)-14,A.Y(2)+8,{size:26,color:CR,anchor:'end'}));
  s+=T(`${v}=2${v0}\\,e^{-k${t}}`,320,130,{size:50});
  s+=card(90,200,460,230,L('① 方程式',230,265,{size:28})+fade(seg(p,.25,.4),check(440,258,14))
   +L('② 初期条件',230,345,{size:28})+fade(seg(p,.5,.65),cross(440,338))+fade(seg(p,.6,.75),L('出発が 2v₀：別の物体',320,405,{size:24,color:CR})),1);
  return s;
 },
 [K+'bad2']:(p)=>{
  const A=GV({x:640,w:480});
  let s=A.svg+A.plot(u=>Math.exp(-0.5*u),{from:0,to:3.9,color:CV,w:3,dash:'8 6'})+A.plot(u=>1-0.5*u,{from:0,to:2,color:CR,w:5});
  s+=dot(A.X(0),A.Y(1),9,CH)+label('v₀',A.X(0)-14,A.Y(1)+8,{size:26,color:CH,anchor:'end'});
  s+=fade(seg(p,.35,.5),label('傾き いつも −kv₀',A.X(2.2),A.Y(0.95),{size:24,color:CR}));
  s+=T(`${v}=${v0}(1-k${t})`,320,130,{size:50});
  s+=card(90,200,460,230,L('② 初期条件',230,265,{size:28})+fade(seg(p,.15,.3),check(440,258,14))
   +L('① 方程式',230,345,{size:28})+fade(seg(p,.6,.75),cross(440,338))+fade(seg(p,.65,.8),L('t ＞ 0 で 右の辺 −kv と 合わない',320,405,{size:22,color:CR})),1);
  return s;
 },
 [K+'done']:(p)=>{
  let s=card(110,110,460,180,L('① 方程式',340,170,{size:30,color:CH,weight:700})+check(340,235,18),1,OK);
  s+=card(630,110,460,180,L('② 初期条件',860,170,{size:30,color:CH,weight:700})+check(860,235,18),1,OK);
  s+=card(300,340,600,120,L('両方そろって 解答が 完了',600,410,{size:34,color:OK,weight:700}),seg(p,.3,.45),OK);
  return s;
 },
 // ===== S3 中級の刻み =====
 [K+'ex']:(p)=>{
  const A=GY();let s=A.svg+A.plot(yEx,{from:0,to:4.4,color:CY,w:5});
  s+=card(660,90,490,320,L('中級の例',905,140,{color:C.dim})+T(`\\dfrac{d${yy}}{d${t}}=-0.2\\,${yy}`,905,210,{size:44})+L('y₀ ＝ 100 g、k ＝ 0.2 /s',905,280,{size:26,color:CY})
   +fade(seg(p,.5,.65),T(`${yy}=100\\,e^{-0.2${t}}`,905,360,{size:46})),1);
  return s;
 },
 [K+'four']:(p)=>{
  const A=GY();let s=A.svg+A.plot(yEx,{from:0,to:4.4,color:CY,w:5});
  s+=fade(seg(p,.4,.55),line(A.X(4),A.Y(0),A.X(4),A.Y(yEx(4)),{color:CT,w:2,dash:'6 6'})+dot(A.X(4),A.Y(yEx(4)),10,CH)+label('44.93',A.X(4)+12,A.Y(yEx(4))-14,{size:26,color:CH,weight:700}));
  s+=card(660,90,490,330,T(`-0.2\\times4=-0.8`,905,160,{size:42})
   +fade(seg(p,.3,.45),T(`e^{-0.8}\\approx0.4493`,905,250,{size:42}))
   +fade(seg(p,.55,.7),T(`${yy}\\approx44.93\\ \\text{g}`,905,345,{size:48})),1);
  return s;
 },
 [K+'steps']:(p)=>{
  const A=axes({x:150,y:470,w:560,h:370,xmin:0,xmax:5,ymin:40,ymax:45.6,xticks:[],yticks:[40,41,42,43,44,45],grid:true,ylabel:'4秒後の y [g]',ycolor:CY});
  let s=A.svg;
  s+=line(A.X(0),A.Y(44.93),A.X(4.9),A.Y(44.93),{color:CH,w:3,dash:'10 7'})+label('式の値 44.93',A.X(1.5),A.Y(44.93)-12,{size:24,color:CH,anchor:'middle',weight:700});
  const pts=[[1,40.96,'1 s'],[2,43.05,'0.5 s'],[3,44.01,'0.25 s']];
  pts.forEach(([i,val,nm],j)=>{const g=seg(p,.1+j*.2,.22+j*.2);s+=fade(g,rect(A.X(i)-35,A.Y(val),70,A.Y(40)-A.Y(val),{fill:CY,fo:.35,rx:4})+label(String(val),A.X(i),A.Y(val)-12,{size:24,color:CY,anchor:'middle',weight:700})+label(nm,A.X(i),A.Y(40)+32,{size:22,color:C.dim,anchor:'middle'}));});
  s+=card(800,150,340,190,L('刻みを 半分に',970,210,{color:C.dim})+L('するたびに',970,250,{color:C.dim})+L('値が 上がる',970,300,{size:30,color:CY,weight:700}),seg(p,.7,.85));
  return s;
 },
 [K+'fine']:(p)=>{
  const A=axes({x:150,y:470,w:560,h:370,xmin:0,xmax:5,ymin:40,ymax:45.6,xticks:[],yticks:[40,41,42,43,44,45],grid:true,ylabel:'4秒後の y [g]',ycolor:CY});
  let s=A.svg;
  s+=line(A.X(0),A.Y(44.93),A.X(4.9),A.Y(44.93),{color:CH,w:3,dash:'10 7'})+label('式の値 44.93',A.X(1.5),A.Y(44.93)-12,{size:24,color:CH,anchor:'middle',weight:700});
  [[1,40.96,'1 s'],[2,43.05,'0.5 s'],[3,44.01,'0.25 s']].forEach(([i,val,nm])=>{s+=rect(A.X(i)-35,A.Y(val),70,A.Y(40)-A.Y(val),{fill:CY,fo:.35,rx:4})+label(String(val),A.X(i),A.Y(val)-12,{size:24,color:CY,anchor:'middle',weight:700})+label(nm,A.X(i),A.Y(40)+32,{size:22,color:C.dim,anchor:'middle'});});
  s+=fade(seg(p,.1,.25),rect(A.X(4)-35,A.Y(44.90),70,A.Y(40)-A.Y(44.90),{fill:CY,fo:.55,rx:4})+label('44.90',A.X(4),A.Y(44.90)+30,{size:24,color:C.ink,anchor:'middle',weight:700})+label('0.01 s',A.X(4),A.Y(40)+32,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(800,150,340,190,T('100\\times0.998^{400}',970,215,{size:34})+T('\\approx 44.90',970,280,{size:40}),seg(p,.05,.2));
  return s;
 },
 [K+'why1']:(p)=>{
  let s=card(270,80,660,110,T(`e^{x}\\approx 1+x`,600,140,{size:52})+label('近似・上級 1/2',900,180,{size:22,color:C.dim,anchor:'end'}),1);
  s+=fade(seg(p,.25,.4),T(`e^{-0.002}\\approx 1-0.002=0.998`,600,275,{size:50}));
  s+=fade(seg(p,.5,.65),T(`e^{-0.002}=0.998002\\ldots`,600,370,{size:46}));
  s+=fade(seg(p,.7,.85),label('ほぼ 同じ',600,455,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why2']:(p)=>{
  let s=T('0.998^{400}',300,140,{size:56});
  s+=fade(seg(p,.1,.25),T(`\\approx\\big(e^{-0.002}\\big)^{400}`,700,140,{size:56}));
  s+=fade(seg(p,.5,.65),T(`=e^{-0.002\\times400}`,600,270,{size:56})+label('指数を 足す（400 回）',950,280,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),T(`=e^{-0.8}`,600,390,{size:64}));
  return s;
 },
 [K+'truth']:(p)=>{
  let s=card(200,110,800,170,L('中級で 数値で見た 44 グラム台',600,165,{size:28,color:C.dim})+T(`100\\,e^{-0.8}\\approx 44.93\\ \\text{g}`,600,240,{size:54}),1,OK);
  s+=card(200,320,800,120,L('刻みの行き先 ＝ この式の値',600,390,{size:34,color:OK,weight:700}),seg(p,.3,.45),OK);
  return s;
 },
 // ===== S4 半減期 =====
 [K+'half']:(p)=>{
  const A=GY({x:80,w:480});let s=A.svg+A.plot(yEx,{from:0,to:4.4,color:CY,w:5});
  const Th=Math.log(2)/0.2;
  s+=fade(seg(p,.2,.35),line(A.X(0),A.Y(50),A.X(Th),A.Y(50),{color:CH,w:3,dash:'8 6'})+line(A.X(Th),A.Y(50),A.X(Th),A.Y(0),{color:CT,w:3,dash:'8 6'})+label('T',A.X(Th),A.Y(0)-14,{size:30,color:CT,anchor:'middle',weight:700})+label('y₀/2',A.X(0)+10,A.Y(50)-12,{size:24,color:CH}));
  s+=card(620,120,540,250,L('半分になる 時間 T',890,175,{size:28,color:CT,weight:700})+fade(seg(p,.45,.6),T(`${y0}\\,e^{-k${TT}}=\\dfrac{${y0}}{2}`,890,280,{size:50})),1);
  return s;
 },
 [K+'half2']:(p)=>{
  let s=T(`${y0}\\,e^{-k${TT}}=\\dfrac{${y0}}{2}`,600,130,{size:54});
  s+=fade(seg(p,.05,.2),label('両辺を y₀ で割る',600,215,{size:26,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),T(`e^{-k${TT}}=\\dfrac12`,600,315,{size:62}));
  s+=card(250,390,700,95,L('y₀ が 消えた → T は 出発の量に よらない',600,447,{size:28,color:OK,weight:700}),seg(p,.55,.7),OK);
  return s;
 },
 [K+'ln']:(p)=>{
  let s=T(`e^{-k${TT}}=\\dfrac12`,600,120,{size:54});
  s+=fade(seg(p,.05,.2),label('T は 肩の上 → 両辺の ln を とる',600,210,{size:26,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),T(`${cL('\\ln')}\\big(e^{-k${TT}}\\big)=${cL('\\ln')}\\dfrac12`,600,300,{size:52}));
  s+=fade(seg(p,.55,.7),T(`-k${TT}=${cL('\\ln')}\\dfrac12`,600,420,{size:56})+label('ln は 何乗かを 返す',960,430,{size:24,color:CL,anchor:'middle'}));
  return s;
 },
 [K+'ln2']:(p)=>{
  const X=u=>600+u*330,y=330;
  let s=T(`${cL('\\ln')}\\dfrac12=-${cL('\\ln')}\\,2`,600,120,{size:56});
  s+=fade(seg(p,.2,.35),arrow(X(-1.3),y,X(1.3),y,{color:C.dim,w:3,head:14})+label('e の 何乗か（指数）',X(-1.3),y-95,{size:22,color:C.dim,anchor:'start'}));
  [[-0.693,'1/2','−0.693'],[0,'1','0'],[0.693,'2','0.693']].forEach(([u,nm,us],i)=>{s+=fade(seg(p,.3+i*.1,.4+i*.1),line(X(u),y-12,X(u),y+12,{color:C.ink,w:3})+label(us,X(u),y+44,{size:26,color:CL,anchor:'middle',weight:700})+label(`e の ${us} 乗 ${u===0?'＝':'≈'} ${nm}`,X(u),y-40,{size:22,color:C.ink,anchor:'middle'}));});
  s+=fade(seg(p,.65,.8),brace(X(-0.693),X(0),y+64,{text:'',color:CH})+brace(X(0),X(0.693),y+64,{text:'',color:CH})+label('同じ長さ、向きが 逆',600,y+150,{size:26,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'solve']:(p)=>{
  let s=T(`-k${TT}=-${cL('\\ln')}\\,2`,600,150,{size:60});
  s+=fade(seg(p,.15,.3),label('両辺 ÷ (−k)',600,250,{size:28,color:CH,anchor:'middle'}));
  s+=card(330,290,540,185,T(`${TT}=\\dfrac{${cL('\\ln')}\\,2}{k}`,600,390,{size:60}),seg(p,.35,.5),OK);
  return s;
 },
 [K+'num']:(p)=>{
  const A=GY({x:80,w:480});let s=A.svg+A.plot(yEx,{from:0,to:4.4,color:CY,w:5});
  const Th=Math.log(2)/0.2;
  s+=line(A.X(0),A.Y(50),A.X(Th),A.Y(50),{color:CH,w:3,dash:'8 6'})+line(A.X(Th),A.Y(50),A.X(Th),A.Y(0),{color:CT,w:3,dash:'8 6'});
  s+=fade(seg(p,.6,.75),label('3.47 s',A.X(Th),A.Y(0)-14,{size:26,color:CT,anchor:'middle',weight:700}));
  s+=card(620,90,540,340,T(`${cL('\\ln')}\\,2\\approx0.6931`,890,160,{size:44})+label('e の 0.6931 乗 ≈ 2',890,215,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),T(`${TT}=\\dfrac{0.6931}{0.2}\\approx3.47\\ \\text{s}`,890,330,{size:46})),1);
  return s;
 },
 [K+'mid']:(p)=>{
  const A=axes({x:80,y:460,w:620,h:340,xmin:0,xmax:11.5,ymin:0,ymax:110,xticks:[2,4,6,8,10],yticks:[25,50,100],grid:true,xlabel:'t [s]',ylabel:'y [g]',xcolor:CT,ycolor:CY});
  let s=A.svg+A.plot(yEx,{from:0,to:11.3,color:CY,w:5});
  const Th=Math.log(2)/0.2;
  [1,2,3].forEach(i=>{const yv=100/2**i,g=seg(p,.1+i*.12,.22+i*.12);s+=fade(g,line(A.X(i*Th),A.Y(yv),A.X(i*Th),A.Y(0),{color:CT,w:2,dash:'6 6'})+dot(A.X(i*Th),A.Y(yv),8,CH));
   s+=fade(g,line(A.X(0),A.Y(yv),A.X(i*Th),A.Y(yv),{color:CH,w:2,dash:'6 6'})+label(['3.47','6.93','10.40'][i-1],A.X(i*Th),A.Y(0)-12,{size:22,color:CT,anchor:'middle',weight:700}));});
  s+=card(740,100,420,280,L('中級：グラフで 約 3.5 s',950,160,{size:26,color:C.dim})+L('計算：約 3.47 s',950,215,{size:26,color:C.dim})
   +T(`${TT}=\\dfrac{${cL('\\ln')}\\,2}{k}`,950,315,{size:52}),1,OK);
  return s;
 },
 // ===== S5 崩壊と高校の式 =====
 [K+'decay']:(p)=>{
  let s='';const gone=new Set([3,11,17,26,30,38]);
  for(let i=0;i<40;i++){const x=110+(i%8)*62,y=110+Math.floor(i/8)*62,g=gone.has(i)?seg(p,.5,.65):0;s+=ring(x,y,20,{color:CY,w:3,fill:'#2a2410'});s+=fade(g,ring(x,y,26,{color:CR,w:3})+line(x-14,y-14,x+14,y+14,{color:CR,w:3}));}
  s+=label('原子核 N 個',360,450,{size:26,color:CY,anchor:'middle'});
  s+=card(660,110,480,250,L('1個が 短い時間 Δt に',900,170,{size:28})+L('壊れる 確率',900,215,{size:28})+fade(seg(p,.4,.55),T(`\\lambda\\,\\Delta ${t}`,900,300,{size:56})),seg(p,.25,.4));
  return s;
 },
 [K+'decay1']:(p)=>{
  let s=T(`\\lambda\\,\\Delta ${t}`,600,130,{size:60});
  s+=card(200,200,800,120,L('λ：核の種類で 決まる 定数',600,250,{size:30,color:CH,weight:700})+L('核の 年齢に よらない',600,295,{size:26}),seg(p,.05,.2));
  s+=card(330,360,540,90,L('実験に 支えられた 性質',600,415,{size:30,color:OK,weight:700}),seg(p,.55,.7),OK);
  return s;
 },
 [K+'decay2']:(p)=>{
  const rows=[`\\approx\\lambda ${N}\\,\\Delta ${t}`,`\\Delta ${N}\\approx-\\lambda ${N}\\,\\Delta ${t}`,`\\dfrac{\\Delta ${N}}{\\Delta ${t}}\\approx-\\lambda ${N}`,`\\dfrac{d${N}}{d${t}}=-\\lambda ${N}`];
  const ys=[95,178,280,428],gs=[[0,.1],[.3,.42],[.6,.7],[.75,.85]];
  let s='';
  rows.forEach((r,i)=>{s+=fade(seg(p,gs[i][0],gs[i][1]),T(r,i===0?600:520,ys[i],{size:i===3?50:40})+(i===0?label('壊れる数',470,ys[0]+12,{size:32,color:C.ink,anchor:'end'}):''));});
  s+=fade(seg(p,.05,.15),label('平均として',900,103,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.7),label('Δt で 割る',900,288,{size:24,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.75,.85),label('Δt → 0',900,433,{size:24,color:CH,anchor:'middle'})+highlight(355,340,330,150,1,OK));
  return s;
 },
 [K+'same']:(p)=>{
  let s=card(80,90,480,180,T(`\\dfrac{d${yy}}{d${t}}=-k\\,${yy}`,320,180,{size:48}),1);
  s+=card(640,90,480,180,T(`\\dfrac{d${N}}{d${t}}=-\\lambda ${N}`,880,180,{size:48}),1);
  s+=label('y → N、k → λ',600,185,{size:24,color:CH,anchor:'middle'});
  s+=fade(seg(p,.4,.55),T(`${N}=${N0}\\,e^{-\\lambda ${t}}`,880,350,{size:48}));
  s+=fade(seg(p,.6,.75),T(`${TT}=\\dfrac{${cL('\\ln')}\\,2}{\\lambda}`,880,450,{size:46})+label('半減期',720,460,{size:28,color:CT,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c14']:(p)=>{
  let s=L('炭素14',600,95,{size:30,color:CY,weight:700});
  {const w=texWidth(`${TT}\\approx5730`,52,false);s+=T(`${TT}\\approx5730`,580,170,{size:52})+label('年',580+w/2+12,182,{size:36,color:C.ink});}
  s+=fade(seg(p,.35,.5),T(`\\lambda=\\dfrac{${cL('\\ln')}\\,2}{5730}\\approx0.000121`,560,295,{size:50})+label('/年',560+texWidth(`\\lambda=\\dfrac{${cL('\\ln')}\\,2}{5730}\\approx0.000121`,50,false)/2+10,310,{size:36,color:C.ink}));
  s+=fade(seg(p,.7,.85),L('1 年に 約 0.012 ％ の 割合',600,420,{size:32,color:CH,weight:700}));
  return s;
 },
 [K+'hs1']:(p)=>{
  let s=L('高校の 半減期の式へ',600,95,{size:28,color:C.dim});
  const rgt=`=\\big(-\\lambda ${TT}\\big)\\times\\dfrac{${t}}{${TT}}`,wr=texWidth(rgt,60,false),wf=texWidth(`\\dfrac{${t}}{${TT}}`,60,false);
  s+=T(`-\\lambda ${t}`,470,220,{size:60,anchor:'end'});
  s+=fade(seg(p,.2,.35),T(rgt,490,220,{size:60,anchor:'start'}));
  s+=fade(seg(p,.5,.65),brace(490+wr-wf-10,490+wr+10,300,{text:'時刻 ÷ 半減期',size:26,color:CT}));
  return s;
 },
 [K+'hs2']:(p)=>{
  let s=T(`e^{-\\lambda ${t}}=\\Big(e^{-\\lambda ${TT}}\\Big)^{${t}/${TT}}`,600,150,{size:60});
  s+=fade(seg(p,.05,.2),label('指数法則：e の (ab) 乗 ＝（e の a 乗）の b 乗',600,255,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('中身 ＝ 1/2',600,320,{size:28,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),T(`=\\Big(\\dfrac12\\Big)^{${t}/${TT}}`,600,420,{size:60}));
  return s;
 },
 [K+'hs3']:(p)=>{
  let s=card(270,80,660,210,T(`${N}=${N0}\\Big(\\dfrac12\\Big)^{${t}/${TT}}`,600,200,{size:58}),1,OK);
  s+=card(270,320,660,110,L('高校の式 ＝ 指数関数の 衣替え',600,385,{size:32,color:OK,weight:700}),seg(p,.4,.55));
  return s;
 },
 [K+'lines']:(p)=>{
  const A=axes({x:90,y:430,w:700,h:330,xmin:0,xmax:20000,ymin:0,ymax:1.1,xticks:[],yticks:[],xlabel:'t [年]',ylabel:'N / N₀',xcolor:CT,ycolor:CY});
  const Tc=5730,f=u=>Math.pow(0.5,u/Tc);
  let s=A.svg+A.plot(f,{from:0,to:19500,color:CY,w:5});
  [[1,'1/2'],[2,'1/4'],[3,'1/8']].forEach(([i,nm])=>{const g=seg(p,.05+i*.15,.17+i*.15),yv=f(i*Tc);
   s+=fade(g,line(A.X(0),A.Y(yv),A.X(i*Tc),A.Y(yv),{color:CH,w:2,dash:'7 6'})+line(A.X(i*Tc),A.Y(yv),A.X(i*Tc),A.Y(0),{color:CT,w:2,dash:'7 6'})+dot(A.X(i*Tc),A.Y(yv),8,CH)+label(nm,A.X(0)-12,A.Y(yv)+8,{size:24,color:CH,anchor:'end',weight:700})+label(`${i===1?'':i}T`,A.X(i*Tc),A.Y(0)+32,{size:24,color:CT,anchor:'middle',weight:700}));
   s+=fade(g,brace(A.X((i-1)*Tc)+4,A.X(i*Tc)-4,A.Y(0)+44,{dir:1,color:CT,text:'',size:24}));});
  s+=label('1',A.X(0)-12,A.Y(1)+8,{size:24,color:CY,anchor:'end'});
  s+=card(830,120,330,220,L('2T ＝ 11460 年',995,180,{size:28,color:CT})+L('→ 1/4',995,230,{size:30,color:CH,weight:700})+L('幅は どこでも T',995,300,{size:26,color:C.ink}),seg(p,.4,.55));
  return s;
 },
 [K+'sum']:(p)=>{
  let s='';
  const rows=[['代入','方程式 ＋ 初期条件 の 両方',`${SOL}`],['刻みの行き先','100 × e の −0.8 乗',`\\approx44.93\\ \\text{g}`],['半分になる時間','T ＝ ln 2 / k',`\\approx3.47\\ \\text{s}`],['崩壊・高校の式','N ＝ N₀ × (1/2) の t/T 乗',`${TT}=\\ln 2/\\lambda`]];
  rows.forEach((r,i)=>{const y=105+i*95,g=seg(p,.03+i*.15,.13+i*.15);s+=fade(g,rect(70,y-40,1060,76,{fill:'#131f38',fo:.9,stroke:C.faint,sw:1.5,rx:12})+label(r[0],100,y+8,{size:26,color:CH,weight:700})+label(r[1],330,y+8,{size:26})+T(r[2],960,y,{size:34})+check(1100,y,10));});
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(110,70,440,200,L('1階：解けた',330,115,{size:28,color:OK,weight:700})+T(`${dvdt}=-k${v}`,330,205,{size:40}),1,OK);
  s+=card(650,70,440,200,L('次：2階',870,115,{size:28,color:CH,weight:700})+T(`\\dfrac{d^2${cs(C.x,'x')}}{d${t}^2}=-\\omega^2${cs(C.x,'x')}`,870,205,{size:40}),seg(p,.4,.55),CH);
  // spring–mass sketch
  const g=seg(p,.55,.7),bx=600+90*Math.sin(p*9);
  let sp='';const pts=[[230,390]];for(let i=1;i<=16;i++)pts.push([230+(bx-60-230)*i/17,390+(i%2?-16:16)]);pts.push([bx-60,390]);
  sp+=line(220,330,220,450,{color:C.dim,w:4})+draw(pts,1,{color:C.dim,w:3})+rect(bx-60,350,120,80,{fill:C.x,fo:.3,rx:8})+line(200,450,1000,450,{color:C.dim,w:2});
  s+=fade(g,sp)+fade(g,L('振動',820,400,{size:32,color:C.x,weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=T(`\\dfrac{d^2${cs(C.x,'x')}}{d${t}^2}=-\\omega^2${cs(C.x,'x')}`,600,150,{size:64});
  s+=card(110,270,460,170,L('なぜ どこにでも',340,335,{size:30})+L('現れる？',340,385,{size:32,color:CH,weight:700}),seg(p,.15,.3),CH);
  s+=card(630,270,460,170,L('どんな条件で',860,335,{size:30})+L('成り立たなくなる？',860,385,{size:32,color:CH,weight:700}),seg(p,.4,.55),CH);
  return s;
 },
};
