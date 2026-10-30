// YouTube シリーズ「空気抵抗・上級 1/2」(ys-uc-drag-1) — 図。Stage 1200×515.
// 色（中級 um-drag と同じ）：速度 v 紫、終端速度の線 黄、差 w 橙、力 緑、加速度 赤、時刻 t・τ 金、ln の量 水色、確かめ 緑。
// 上端の帯（S2）：微分方程式・上級 1/2 と同じ6段（w 版）。
// 数値：m＝2 kg、k＝4 kg/s、g＝10 → v∞＝5 m/s、τ＝0.5 s。v＝5＋(v₀−5)e^(−2t)。
//   静止から t＝0.5：3.16。v₀＝8：6.10（0.5 s）。差が半分 0.347 s（0.5×ln2）。t＝0 の確かめ（v₀＝8）：−6 m/s²。
import {C,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,draw,poly} from './anim.mjs';

const K='uc-drag-1:';
const CF=C.F,CV=C.v,CA=C.a,CT=C.t,CH=C.hi,CD=C.dim,CW=C.E,CL=C.x,OK=C.F,CR=C.a;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const TF=(s,x,y,maxW,size=44,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const check=(x,y,sz=14,color=OK)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const cross=(x,y,sz=14,color=CR)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:5})+line(x-sz,y+sz,x+sz,y-sz,{color,w:5});

// ---- symbols ----
const v=cs(CV,'v'),t=cs(CT,'t'),TAU=cs(CT,'\\tau'),W=cs(CW,'w');
const V8=`${v}_\\infty`,V0=`${v}_0`,W0=`${W}(0)`;
const E=`e^{-${t}/${TAU}}`;
const dvdt=`\\dfrac{d${v}}{d${t}}`,dwdt=`\\dfrac{d${W}}{d${t}}`;
const EQ=`m${dvdt}=mg-k${v}`;
const WEQ=`${dwdt}=-\\dfrac{${W}}{${TAU}}`;
const lnw=`${cs(CL,'\\ln|')}${W}${cs(CL,'|')}`;
const SOLV0=`${v}=${V8}+(${V0}-${V8})\\,${E}`;

// ---- ball and arrows (中級と同じ) ----
const NPX=11;
function ball(x,y,{r=30,g=1}={}){return fade(g,ring(x,y,r,{color:C.dim,w:3,fill:'#2b3d63'})+dot(x-9,y-9,7,'#5a73a6'));}
function gravA(x,y,N,{r=30,g=1,text='重力',px=NPX,tx=16}={}){const Ln=N*px;return arrow(x,y+r,x,y+r+Ln,{color:CF,w:6,g})+(text?fade(g,label(text,x+tx,y+r+Ln-4,{size:24,color:CF})):'');}
function resA(x,y,N,{r=30,g=1,text='抵抗',px=NPX,tx=16}={}){const Ln=N*px;if(Ln<2)return '';return arrow(x,y-r,x,y-r-Ln,{color:CF,w:6,g})+(text?fade(g,label(text,x+tx,y-r-Ln+18,{size:24,color:CF})):'');}
function velA(x,y,vv,{g=1,px=30,text='速度 v',dx=-80}={}){const Ln=vv*px;if(Ln<2)return '';return arrow(x+dx,y-Ln/2,x+dx,y+Ln/2,{color:CV,w:7,g})+(text?fade(g,label(text,x+dx,y-Ln/2-12,{size:24,color:CV,anchor:'middle'})):'');}
function downAxis(x,y1,y2,g=1){return fade(g,arrow(x,y1,x,y2,{color:CD,w:3,head:14})+label('＋',x+14,y2-6,{size:28,color:CH,weight:700})+label('下向きが 正',x,y1-14,{size:22,color:CD,anchor:'middle'}));}

// ---- v–t graphs ----
const vf=v0=>u=>5+(v0-5)*Math.exp(-2*u);
const GV=(o={})=>axes({x:100,y:465,w:500,h:335,xmin:0,xmax:2,ymin:0,ymax:9,xticks:[.5,1,1.5,2],yticks:[1,2,3,4,5,6,7,8],grid:true,xlabel:'t [s]',ylabel:'速度 v [m/s]',xcolor:CT,ycolor:CV,...o});
const vinf=(A,g=1,txt='v∞ ＝ 5 m/s')=>fade(g,line(A.X(0),A.Y(5),A.X(2),A.Y(5),{color:CH,w:3,dash:'10 7'})+label(txt,A.X(2),A.Y(5)-12,{size:24,color:CH,weight:700,anchor:'end'}));
function curve(A,v0,{p=1,hl=false,w=4}={}){return A.plot(vf(v0),{from:0,to:1.95,p,color:hl?CH:CV,w:hl?6:w});}
// schematic (no numbers)
const GS=(o={})=>axes({x:100,y:450,w:480,h:330,xmin:0,xmax:2,ymin:0,ymax:6,xlabel:'t',ylabel:'速度 v',xcolor:CT,ycolor:CV,...o});

// ---- the 6-step bar (微分方程式・上級 1/2 と同じ) ----
const STEPS=['① 零解','② w で割る','③ ln|w| へ','④ 積分','⑤ 指数へ','⑥ 初期値'];
function bar(cur,g=1){
 let s='';
 STEPS.forEach((n,i)=>{
  const x=14+i*197,w=184,y=6,h=40,on=i+1===cur,done=i+1<cur;
  s+=rect(x,y,w,h,{fill:on?CH:'#131f38',fo:on?.2:.9,stroke:on?CH:C.faint,sw:on?2.5:1.5,rx:10});
  s+=label(n,x+w/2,y+28,{size:22,color:on?CH:done?C.ink:C.dim,anchor:'middle',weight:on?700:400});
  if(done)s+=check(x+w-16,y+20,8);
 });
 return fade(g,s);
}
// w shapes (no numbers)
const GW=(o={})=>axes({x:660,y:470,w:470,h:330,xmin:0,xmax:4,ymin:-1.8,ymax:2,xticks:[],yticks:[],xlabel:'t',ylabel:'w',xcolor:CT,ycolor:CW,...o});
const wfam=A=>u=>A*Math.exp(-0.6*u);
function family(Ax,list,{hl=null,g=1}={}){let s='';list.forEach(A=>{const on=hl!==null&&Math.abs(A-hl)<1e-9;s+=Ax.plot(wfam(A),{from:0,to:3.9,color:on?CH:CW,w:on?5:3});});return fade(g,s);}

export const ytUcDrag1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const A=GS();
  let s=A.svg+vinf(A,1,'終端速度')+A.plot(u=>5*(1-Math.exp(-2*u)),{from:0,to:1.95,p:seg(p,0,.4),color:CV,w:5});
  const tan=(u,g)=>{const y0=5*(1-Math.exp(-2*u)),m=10*Math.exp(-2*u);return fade(g,line(A.X(u-.14),A.Y(y0-.14*m),A.X(u+.14),A.Y(y0+.14*m),{color:CA,w:4})+dot(A.X(u),A.Y(y0),7,CA));};
  s+=tan(.18,seg(p,.3,.45))+tan(.5,seg(p,.4,.55))+tan(1.1,seg(p,.5,.65));
  s+=label('落下の 速さ（下向きを 正）',A.X(1),A.Y(0)+44,{size:22,color:CD,anchor:'middle'});
  s+=card(660,110,490,270,L('抵抗 ∝ 速度',905,165,{size:30,color:CF,weight:700})+fade(seg(p,.45,.6),L('傾き ＝ 加速度 が',905,250,{size:28,color:CA})+L('だんだん 小さくなる',905,300,{size:28,color:CA})+L('→ 加速度は 一定でない',905,350,{size:28,color:CH,weight:700})),1,CH);
  return s;
 },
 [K+'ask2']:(p)=>{
  const A=GS();const f=u=>5*(1-Math.exp(-2*u)),u0=.35;
  let s=A.svg+vinf(A,1,'終端速度')+A.plot(f,{from:0,to:1.95,color:CV,w:5});
  s+=fade(seg(p,.05,.2),line(A.X(u0),A.Y(f(u0)),A.X(u0),A.Y(5),{color:CW,w:6})+label('差 w',A.X(u0)+12,A.Y((f(u0)+5)/2)+8,{size:26,color:CW,weight:700}));
  s+=card(650,90,510,320,L('中級：差 w の式まで',905,145,{size:26,color:CD})+T(WEQ,905,225,{size:48})
   +fade(seg(p,.35,.5),L('初期条件付きで',905,310,{size:28})+L('最後まで 積分すると？',905,360,{size:32,color:CH,weight:700})),1,CH);
  return s;
 },
 [K+'axis']:(p)=>{
  let s=downAxis(140,110,430)+ball(330,250)+velA(330,250,3,{g:seg(p,.05,.2)});
  s+=card(520,90,300,170,L('前回',670,140,{size:24,color:CD})+arrow(580,235,580,160,{color:CD,w:3,head:12,g:1})+L('上向きが 正',610,215,{size:26,anchor:'start'}),seg(p,.4,.55));
  s+=card(860,90,300,170,L('今回',1010,140,{size:24,color:CH})+arrow(920,160,920,235,{color:CH,w:3,head:12})+L('下向きが 正',950,215,{size:26,color:CH,anchor:'start',weight:700}),seg(p,.1,.25),CH);
  s+=fade(seg(p,.5,.65),L('落ちる球だけを 見る',860,330,{size:30,color:C.ink})+L('→ v ≧ 0（落ちている間）',860,385,{size:26,color:CV}));
  return s;
 },
 [K+'eq']:(p)=>{
  let s=downAxis(110,110,430)+ball(280,250)+velA(280,250,3)+gravA(280,250,11,{text:'＋mg'})+resA(280,250,7,{text:'kv（上向き）',g:seg(p,.45,.6)});
  s+=T(EQ,800,200,{size:60});
  s+=fade(seg(p,.4,.55),brace(790,900,250,{text:'重力',size:24,color:CF})+brace(955,1050,250,{text:'抵抗',size:24,color:CF}));
  s+=fade(seg(p,.6,.75),L('重力 から 抵抗を 引いた 残り',800,390,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'model']:(p)=>{
  let s=card(80,90,560,180,L('仮定（モデル）',360,140,{size:28,color:CH,weight:700})+L('抵抗の 大きさ ＝',300,220,{size:32})+T(`k${v}`,470,212,{size:52}),1,CH);
  s+=fade(seg(p,.1,.25),L('k は 正の 定数（単位 kg/s）',360,305,{size:24,color:CD}));
  s+=fade(seg(p,.15,.3),L('法則ではない',360,370,{size:32,color:CR,weight:700}));
  // fog droplets
  let fog='';for(let i=0;i<26;i++){const x=720+((i*137)%400),y=110+((i*71)%250);fog+=dot(x,y,4+(i%3),'#9fb4d6',.55);}
  s+=fade(seg(p,.5,.65),fog+L('霧の粒：小さく ゆっくり 落ちる',920,420,{size:28,color:C.ink}));
  return s;
 },
 [K+'w']:(p)=>{
  const A=GS({w:440});const f=u=>5*(1-Math.exp(-2*u)),u0=.35;
  let s=A.svg+vinf(A,1,'v∞')+A.plot(f,{from:0,to:1.95,color:CV,w:5});
  s+=fade(seg(p,.25,.4),line(A.X(u0),A.Y(f(u0)),A.X(u0),A.Y(5),{color:CW,w:6})+label('w',A.X(u0)+12,A.Y((f(u0)+5)/2)+8,{size:28,color:CW,weight:700}));
  s+=card(620,80,540,380,
    T(`${V8}=\\dfrac{mg}{k}`,890,150,{size:44})
   +fade(seg(p,.25,.4),T(`${W}=${V8}-${v}`,890,250,{size:44}))
   +fade(seg(p,.55,.7),T(`${dwdt}=-\\dfrac{k}{m}\\,${W}`,890,365,{size:44})+L('中級で 導いた',890,440,{size:22,color:CD})),1);
  return s;
 },
 [K+'promise']:(p)=>{
  let s=T(`${TAU}=\\dfrac{m}{k}`,300,150,{size:52})+fade(seg(p,.1,.25),T(WEQ,300,300,{size:56}));
  s+=card(620,90,540,330,L('その解',890,140,{size:26,color:CD})+fade(seg(p,.35,.5),T(`${W}=${W}_0\\,${E}`,890,225,{size:52}))
   +fade(seg(p,.5,.65),L('中級：刻みの 行き先として 使った',890,305,{size:26,color:CD}))
   +fade(seg(p,.65,.8),L('導き方は 上級で（約束）',890,370,{size:32,color:CH,weight:700})),1,CH);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=ball(200,250,{r:40})+L('2 kg',200,330,{size:26});
  s+=card(340,80,380,340,L('例（中級と同じ）',530,130,{size:26,color:CD})+L('m ＝ 2 kg',530,195,{size:30})+L('k ＝ 4 kg/s',530,255,{size:30,color:CF})+L('g ＝ 10 m/s²',530,315,{size:30}),1);
  s+=card(760,80,400,340,
    fade(seg(p,.3,.45),T(`${V8}=\\dfrac{mg}{k}=\\dfrac{20}{4}`,960,160,{size:40})+L('＝ 5 m/s',960,235,{size:34,color:CH,weight:700}))
   +fade(seg(p,.55,.7),T(`${TAU}=\\dfrac{m}{k}=\\dfrac{2}{4}`,960,315,{size:40})+L('＝ 0.5 s',960,390,{size:34,color:CT,weight:700})),seg(p,.25,.4));
  return s;
 },
 // ===== S2 変数分離 =====
 [K+'zero']:(p)=>{
  let s=bar(1)+T(WEQ,600,150,{size:64});
  s+=fade(seg(p,.35,.5),L('w ＝ 0（ずっと）を 入れると',600,255,{size:28,color:CW}));
  s+=card(250,290,700,170,L('左の辺',420,340,{size:24,color:CD})+L('右の辺',780,340,{size:24,color:CD})
   +T(`\\dfrac{d\\,0}{d${t}}=0`,420,410,{size:44})+T(`-\\dfrac{0}{${TAU}}=0`,780,410,{size:44})
   +fade(seg(p,.75,.88),check(600,400,16)),seg(p,.5,.65));
  return s;
 },
 [K+'zero2']:(p)=>{
  const A=GV({x:90,w:470});
  let s=bar(1)+A.svg+vinf(A,1,'')+line(A.X(0),A.Y(5),A.X(1.95),A.Y(5),{color:CH,w:6});
  s+=card(640,110,510,300,T(`${W}=0`,895,180,{size:52})+fade(seg(p,.15,.3),T(`\\Longleftrightarrow\\; ${v}=${V8}`,895,265,{size:48}))
   +fade(seg(p,.4,.55),L('終端速度のまま 落ち続ける',895,355,{size:30,color:CH,weight:700})),1);
  return s;
 },
 [K+'divide']:(p)=>{
  let s=bar(2)+T(WEQ,600,150,{size:56});
  s+=fade(seg(p,.05,.2),label('w ≠ 0 で 両辺 ÷ w',660,262,{size:28,color:CH,anchor:'start'})+arrow(600,232,600,292,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.3,.5),T(`\\dfrac{d${W}/d${t}}{${W}}=-\\dfrac{1}{${TAU}}`,600,400,{size:64}));
  return s;
 },
 [K+'chain']:(p)=>{
  let s=bar(3);
  const box=(x,txt,col)=>rect(x-85,90,170,90,{fill:'#131f38',fo:.96,stroke:col,sw:2.5,rx:14})+T(txt,x,145,{size:46});
  s+=box(200,t,CT)+arrow(290,135,470,135,{color:CD,w:4,head:14})+box(560,W,CW)+fade(seg(p,.1,.25),arrow(650,135,830,135,{color:CD,w:4,head:14})+box(920,lnw,CL));
  s+=fade(seg(p,.5,.62),label('中身の倍率',380,215,{size:22,color:CD,anchor:'middle'})+T(dwdt,380,280,{size:36}));
  s+=fade(seg(p,.45,.58),label('外側の倍率',740,215,{size:22,color:CD,anchor:'middle'})+T(`\\dfrac{1}{${W}}`,740,280,{size:36}));
  s+=fade(seg(p,.25,.4),T(`\\dfrac{d}{d${t}}${lnw}=\\dfrac{1}{${W}}\\cdot${dwdt}=\\dfrac{d${W}/d${t}}{${W}}`,600,420,{size:44}));
  return s;
 },
 [K+'rewrite']:(p)=>{
  let s=bar(3)+T(`\\dfrac{d}{d${t}}${lnw}=-\\dfrac{1}{${TAU}}`,320,190,{size:52});
  const A=axes({x:660,y:450,w:450,h:300,xmin:0,xmax:4,ymin:0,ymax:4,xticks:[],yticks:[],xlabel:'t',ylabel:'ln|w|',xcolor:CT,ycolor:CL});
  s+=fade(seg(p,.4,.55),A.svg+A.plot(u=>3.5-0.6*u,{from:0,to:3.9,color:CL,w:5}));
  s+=fade(seg(p,.55,.7),draw([[A.X(1),A.Y(2.9)],[A.X(2),A.Y(2.9)],[A.X(2),A.Y(2.3)]],1,{color:CH,w:3})+label('1 秒',A.X(1.5),A.Y(2.9)-12,{size:22,color:CT,anchor:'middle'})+label('1/τ 減る',A.X(2)+12,A.Y(2.6)+8,{size:22,color:CR}));
  s+=card(110,300,450,120,L('ln|w| が 毎秒 1/τ ずつ',335,350,{size:28})+L('一定に 減る',335,395,{size:28,color:CH,weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'integ']:(p)=>{
  let s=bar(4);
  const A=axes({x:660,y:450,w:450,h:300,xmin:0,xmax:4,ymin:0,ymax:4,xticks:[],yticks:[],xlabel:'t',ylabel:'ln|w|',xcolor:CT,ycolor:CL});
  s+=A.svg+A.plot(u=>3.5-0.6*u,{from:0,to:3.9,color:CL,w:5});
  s+=T(`\\dfrac{d}{d${t}}${lnw}=-\\dfrac{1}{${TAU}}`,320,140,{size:44});
  s+=fade(seg(p,.1,.25),label('時間で 積分',345,235,{size:26,color:CH,anchor:'start'})+arrow(320,195,320,255,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.2,.4),T(`${lnw}=-\\dfrac{${t}}{${TAU}}+${cs(CH,'C')}`,320,330,{size:52}));
  s+=fade(seg(p,.6,.75),L('C ：積分定数（上下の ずれ）',320,430,{size:26,color:CH}));
  return s;
 },
 [K+'exp']:(p)=>{
  let s=bar(5);
  s+=T(`${lnw}=-\\dfrac{${t}}{${TAU}}+${cs(CH,'C')}`,600,130,{size:46});
  s+=fade(seg(p,.1,.25),label('両辺を e の肩に',780,200,{size:24,color:CH,anchor:'start'})+arrow(600,170,600,215,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.2,.35),T(`|${W}|=e^{-${t}/${TAU}+${cs(CH,'C')}}`,600,275,{size:50}));
  s+=fade(seg(p,.45,.6),label('指数法則で 分ける',780,345,{size:24,color:CH,anchor:'start'})+arrow(600,315,600,360,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.55,.7),T(`|${W}|=e^{${cs(CH,'C')}}\\cdot ${E}`,600,425,{size:54}));
  return s;
 },
 [K+'sign']:(p)=>{
  const A=GW();let s=bar(5)+A.svg;
  s+=fade(seg(p,.02,.15),label('一意性：符号は 途中で 変わらない',320,115,{size:26,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),T(`${cs(CH,'A')}=\\pm e^{${cs(CH,'C')}}`,320,210,{size:48}));
  s+=fade(seg(p,.55,.7),T(`${W}=${cs(CH,'A')}\\,${E}`,320,330,{size:62}));
  s+=family(A,[1.6,1.0,0.5,-0.6,-1.2],{g:seg(p,.55,.75)});
  return s;
 },
 [K+'init']:(p)=>{
  const A=GW();let s=bar(6)+A.svg+family(A,[1.6,1.0,0.5,-0.6,-1.2],{hl:1.0});
  s+=T(`${t}=0:\\; e^{0}=1`,320,120,{size:44});
  s+=fade(seg(p,.2,.35),T(`${cs(CH,'A')}=${W0}`,320,210,{size:54}));
  s+=fade(seg(p,.25,.4),dot(A.X(0),A.Y(1.0),10,CH)+label('w(0)',A.X(0)-14,A.Y(1.0)+8,{size:26,color:CH,anchor:'end',weight:700}));
  s+=card(70,270,500,140,T(`${W}=${W0}\\,${E}`,320,345,{size:58}),seg(p,.5,.65),OK);
  return s;
 },
 // ===== S3 v に戻す =====
 [K+'back']:(p)=>{
  let s=T(`${W}=${W0}\\,${E}`,600,110,{size:50});
  s+=fade(seg(p,.05,.2),T(`${v}=${V8}-${W}`,600,215,{size:50})+label('欲しいのは v',900,222,{size:26,color:CV,anchor:'start'}));
  s+=fade(seg(p,.4,.55),arrow(600,255,600,305,{color:CH,w:4,head:12})+label('w を 代入',640,290,{size:24,color:CH,anchor:'start'}));
  s+=fade(seg(p,.5,.65),T(`${v}=${V8}-${W0}\\,${E}`,600,385,{size:58}));
  return s;
 },
 [K+'rest']:(p)=>{
  let s=T(`${v}=${V8}-${W0}\\,${E}`,600,110,{size:46});
  s+=card(200,180,800,230,L('静止から 落とす',600,230,{size:28,color:CD})+T(`${v}(0)=0`,600,295,{size:46})
   +fade(seg(p,.45,.6),T(`${W0}=${V8}-0=${V8}`,600,375,{size:50})),1,CH);
  return s;
 },
 [K+'rest2']:(p)=>{
  const A=GV({x:90,w:470});
  let s=A.svg+vinf(A)+curve(A,0,{p:seg(p,.4,.8)});
  s+=T(`${v}=${V8}-${V8}\\,${E}`,890,150,{size:44});
  s+=fade(seg(p,.2,.35),arrow(890,195,890,262,{color:CH,w:4,head:12})+label('v∞ で くくる',910,240,{size:24,color:CH,anchor:'start'}));
  s+=card(620,280,540,140,T(`${v}=${V8}\\left(1-${E}\\right)`,890,355,{size:50}),seg(p,.25,.4),OK);
  s+=fade(seg(p,.6,.75),L('中級で 使った 式を 導けた',890,470,{size:26,color:OK,weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  const A=GV({x:90,w:470});const y=vf(0)(.5);
  let s=A.svg+vinf(A)+curve(A,0);
  s+=fade(seg(p,.1,.25),line(A.X(.5),A.Y(0),A.X(.5),A.Y(y),{color:CT,w:2,dash:'6 6'})+label('t ＝ τ',A.X(.5)-8,A.Y(0)-14,{size:22,color:CT,anchor:'end'}));
  s+=fade(seg(p,.6,.75),dot(A.X(.5),A.Y(y),10,CH)+label('3.16',A.X(.5)+14,A.Y(y)+30,{size:26,color:CH,weight:700}));
  s+=card(620,90,540,330,T(`${t}=${TAU}=0.5\\ \\mathrm{s}`,890,150,{size:40})
   +fade(seg(p,.2,.35),T(`e^{-1}\\approx 0.368`,890,230,{size:42}))
   +fade(seg(p,.45,.6),T(`${v}\\approx 5\\times 0.632`,890,310,{size:42}))
   +fade(seg(p,.6,.75),L('≈ 3.16 m/s',890,385,{size:34,color:CH,weight:700})),1);
  return s;
 },
 [K+'half']:(p)=>{
  const A=axes({x:90,y:465,w:470,h:360,xmin:0,xmax:1.2,ymin:0,ymax:5.5,xticks:[.25,.5,.75,1],yticks:[1,2,3,4,5],grid:true,xlabel:'t [s]',ylabel:'差 w [m/s]',xcolor:CT,ycolor:CW});
  let s=A.svg+A.plot(u=>5*Math.exp(-2*u),{from:0,to:1.15,color:CW,w:5});
  s+=label('静止から：w(0) ＝ 5',A.X(.35),A.Y(5.2),{size:22,color:CW});
  s+=card(620,80,540,350,T(`${E}=\\dfrac{1}{2}`,890,150,{size:46})
   +fade(seg(p,.4,.55),L('両辺の ln（半減期と 同じ計算）',890,225,{size:24,color:CD})+T(`-\\dfrac{${t}}{${TAU}}=-\\ln 2`,890,295,{size:44}))
   +fade(seg(p,.6,.75),T(`${t}=${TAU}\\ln 2`,890,385,{size:54})),1);
  return s;
 },
 [K+'half2']:(p)=>{
  const A=axes({x:90,y:465,w:470,h:360,xmin:0,xmax:1.2,ymin:0,ymax:5.5,xticks:[.25,.5,.75,1],yticks:[1,2,3,4,5],grid:true,xlabel:'t [s]',ylabel:'差 w [m/s]',xcolor:CT,ycolor:CW});
  const th=.5*Math.log(2);
  let s=A.svg+A.plot(u=>5*Math.exp(-2*u),{from:0,to:1.15,color:CW,w:5});
  [[0,5],[th,2.5],[2*th,1.25]].forEach(([u,w],i)=>{s+=fade(seg(p,.2+i*.12,.3+i*.12),dot(A.X(u),A.Y(w),8,CH)+label(String(w),A.X(u)+14,A.Y(w)-12,{size:24,color:CH,weight:700}));});
  s+=fade(seg(p,.35,.5),draw([[A.X(0),A.Y(2.5)],[A.X(th),A.Y(2.5)]],1,{color:CT,w:3,dash:'6 5'})+draw([[A.X(th),A.Y(1.25)],[A.X(2*th),A.Y(1.25)]],1,{color:CT,w:3,dash:'6 5'}));
  s+=card(620,90,540,320,T(`0.5\\times 0.693\\approx 0.347\\ \\mathrm{s}`,890,170,{size:42})
   +fade(seg(p,.5,.65),L('中級の「約 0.35 秒で 半分」',890,265,{size:28,color:CD})+L('＝ この値',890,320,{size:32,color:CH,weight:700})),1);
  return s;
 },
 // ===== S4 初速 v₀ =====
 [K+'v0']:(p)=>{
  let s=downAxis(110,110,430)+ball(280,250)+velA(280,250,5,{text:'初速 v₀'});
  s+=card(480,100,680,300,L('下向きに 投げ下ろす',820,155,{size:28,color:CD})
   +fade(seg(p,.5,.65),T(`${W0}=${V8}-${V0}`,820,265,{size:56}))+fade(seg(p,.6,.75),L('w ＝ v∞ − v に t ＝ 0 を 入れた',820,350,{size:24,color:CD})),1,CH);
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(`${v}=${V8}-${cs(CH,'w(0)')}\\,${E}`,600,130,{size:50});
  s+=fade(seg(p,.1,.25),label('w(0) ＝ v∞ − v₀ を 入れる',600,205,{size:26,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),T(`${v}=${V8}-(${V8}-${V0})\\,${E}`,600,290,{size:50}));
  s+=fade(seg(p,.6,.75),label('マイナスを かっこの中へ：−(v∞ − v₀) ＝ (v₀ − v∞)',600,385,{size:26,color:CD,anchor:'middle'}));
  return s;
 },
 [K+'sol']:(p)=>{
  let s=card(170,80,860,140,T(SOLV0,600,165,{size:58}),1,OK);
  s+=fade(seg(p,.5,.65),T(`${V0}=0:\\quad ${v}=${V8}\\left(1-${E}\\right)`,600,320,{size:46})+L('さっきの 式に 戻る',600,410,{size:28,color:OK,weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  const A=GV({x:90,w:470});
  let s=A.svg+vinf(A)+dot(A.X(0),A.Y(8),10,CV)+label('8',A.X(0)-14,A.Y(8)+8,{size:24,color:CV,anchor:'end',weight:700});
  s+=fade(seg(p,.3,.45),arrow(A.X(.1),A.Y(8),A.X(.45),A.Y(8.8),{color:CD,w:3,head:12})+label('増える？',A.X(.48),A.Y(8.7),{size:24,color:CD}));
  s+=fade(seg(p,.35,.5),arrow(A.X(.1),A.Y(8),A.X(.45),A.Y(6.8),{color:CD,w:3,head:12})+label('減る？',A.X(.48),A.Y(6.6),{size:24,color:CD}));
  s+=card(640,140,500,200,L('8 m/s：終端の 5 m/s より 速い',890,200,{size:26,color:CH})+L('速さは 増える？ 減る？',890,270,{size:32,color:C.ink,weight:700}),seg(p,.1,.25),CH);
  return s;
 },
 [K+'four']:(p)=>{
  const A=GV({x:90,w:470});
  let s=A.svg+vinf(A);
  [0,2,5,8].forEach((v0,i)=>{s+=curve(A,v0,{p:seg(p,.15+i*.12,.4+i*.12)})+fade(seg(p,.15+i*.12,.25+i*.12),dot(A.X(0),A.Y(v0),8,CV)+label(String(v0),A.X(0)-14,A.Y(v0)+8,{size:24,color:CV,anchor:'end',weight:700}));});
  s+=card(640,110,510,280,T(SOLV0,895,180,{size:36})+L('v₀ ＝ 0、2、5、8 m/s',895,260,{size:28,color:CV})+fade(seg(p,.7,.85),L('どれも 5 m/s へ 集まる',895,330,{size:30,color:CH,weight:700})),1);
  return s;
 },
 [K+'eight']:(p)=>{
  const A=GV({x:90,w:470});const y=vf(8)(.5);
  let s=A.svg+vinf(A)+[0,2,5].map(v0=>fade(.35,curve(A,v0,{w:3}))).join('')+curve(A,8,{hl:true});
  s+=fade(seg(p,.5,.65),line(A.X(.5),A.Y(0),A.X(.5),A.Y(y),{color:CT,w:2,dash:'6 6'})+dot(A.X(.5),A.Y(y),10,CH)+label('6.10',A.X(.5)+14,A.Y(y)-14,{size:26,color:CH,weight:700}));
  s+=card(640,80,510,180,L('v₀ ＝ 8 m/s のとき',895,125,{size:24,color:CD})+L('抵抗 4 × 8 ＝ 32 N',895,175,{size:28,color:CF})+L('＞ 重力 2 × 10 ＝ 20 N → 減速',895,225,{size:26,color:CF,weight:700}),seg(p,.05,.2));
  s+=card(640,290,510,150,T(`${v}=5+3\\times 0.368`,895,350,{size:40})+L('≈ 6.10 m/s（0.5 秒後）',895,415,{size:28,color:CH,weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'five']:(p)=>{
  const A=GV({x:90,w:470});
  let s=A.svg+vinf(A,1,'')+[0,2,8].map(v0=>fade(.35,curve(A,v0,{w:3}))).join('')+line(A.X(0),A.Y(5),A.X(1.95),A.Y(5),{color:CH,w:6});
  s+=card(640,110,510,300,T(`${V0}=5:\\quad ${V0}-${V8}=0`,895,180,{size:40})+fade(seg(p,.2,.35),T(`${v}=5`,895,265,{size:48})+L('（ずっと）',1010,272,{size:24,color:CD,anchor:'start'}))
   +fade(seg(p,.5,.65),L('零解 w ＝ 0',895,360,{size:32,color:CH,weight:700})),1);
  return s;
 },
 [K+'onefor']:(p)=>{
  let s=T(`${v}=${V8}+\\underbrace{(${V0}-${V8})}_{\\color{${CH}}{\\pm\\ ?}}\\,${E}`,600,115,{size:50});
  const row=(y,a,b,c,g)=>fade(g,L(a,330,y,{size:28,color:CH})+L(b,640,y,{size:28})+L(c,920,y,{size:28,color:CV}));
  s+=row(220,'v₀ − v∞ ＞ 0','上から 近づく','減速',seg(p,.15,.3));
  s+=row(300,'v₀ − v∞ ＜ 0','下から 近づく','加速',seg(p,.3,.45));
  s+=row(380,'v₀ − v∞ ＝ 0','ずっと v∞','一定',seg(p,.45,.6));
  s+=fade(seg(p,.65,.8),L('一つの式に 両方が 入っている',600,460,{size:30,color:OK,weight:700}));
  return s;
 },
 // ===== S5 確かめ =====
 [K+'why']:(p)=>{
  let s=card(80,90,480,230,L('途中で したこと',320,140,{size:26,color:CD})+L('w ≠ 0 として 割った',320,205,{size:30})+L('一意性を 認めた',320,265,{size:30}),1);
  s+=fade(seg(p,.3,.45),arrow(580,205,640,205,{color:CH,w:5,head:16}));
  s+=card(660,90,480,230,L('答えを 元の 方程式へ',900,150,{size:28,color:CH,weight:700})+T(`${dvdt}=g-\\dfrac{k}{m}${v}\\ ?`,900,245,{size:44}),seg(p,.35,.5),CH);
  s+=fade(seg(p,.55,.7),T(SOLV0,600,415,{size:46}));
  return s;
 },
 [K+'lhs']:(p)=>{
  let s=T(`\\dfrac{d}{d${t}}\\Big[\\,${SOLV0.replace(`${v}=`,'')}\\,\\Big]`,600,120,{size:46});
  s+=card(80,210,480,200,L('v∞：定数',320,260,{size:28,color:CV})+fade(seg(p,.1,.25),T(`\\dfrac{d${V8}}{d${t}}=0`,320,340,{size:44})+L('消える',470,345,{size:26,color:CR,anchor:'start'})),1);
  s+=card(640,210,480,200,L('e の −t/τ 乗',880,260,{size:28,color:CT})+fade(seg(p,.5,.65),T(`\\dfrac{d}{d${t}}${E}=-\\dfrac{1}{${TAU}}${E}`,880,345,{size:40})),seg(p,.4,.55));
  return s;
 },
 [K+'lhs2']:(p)=>{
  let s=T(`\\dfrac{d}{d${t}}\\Big[\\,${SOLV0.replace(`${v}=`,'')}\\,\\Big]`,600,110,{size:42});
  s+=fade(seg(p,.1,.3),T(`${dvdt}=-\\dfrac{${V0}-${V8}}{${TAU}}\\,${E}`,600,280,{size:58}));
  s+=fade(seg(p,.5,.65),L('定数 (v₀ − v∞) は そのまま 前に 残る',600,410,{size:26,color:CD}));
  return s;
 },
 [K+'lhs3']:(p)=>{
  const top=`${dvdt}=-\\dfrac{1}{${TAU}}\\,\\underbrace{(${V0}-${V8})\\,${E}}_{${v}-${V8}}`;
  let s=T(top,600,150,{size:48});
  s+=fade(seg(p,.05,.2),label('v ＝ v∞ ＋（この部分）',600,295,{size:24,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),T(`${dvdt}=-\\dfrac{${v}-${V8}}{${TAU}}=\\dfrac{${V8}-${v}}{${TAU}}`,600,390,{size:54}));
  return s;
 },
 [K+'rhs']:(p)=>{
  let s=T(`g-\\dfrac{k}{m}${v}`,600,110,{size:50})+label('右の辺',340,120,{size:26,color:CD,anchor:'end'});
  s+=card(80,190,500,230,L('1/τ',330,240,{size:28,color:CT})+fade(seg(p,.25,.4),T(`\\dfrac{1}{${TAU}}=\\dfrac{k}{m}`,330,330,{size:50})),seg(p,.15,.3));
  s+=card(620,190,500,230,L('v∞ / τ',870,240,{size:28,color:CH})+fade(seg(p,.55,.7),T(`\\dfrac{${V8}}{${TAU}}=\\dfrac{mg}{k}\\cdot\\dfrac{k}{m}=g`,870,330,{size:44})),seg(p,.45,.6));
  return s;
 },
 [K+'match']:(p)=>{
  let s=label('左の辺（微分）',330,90,{size:26,color:CD,anchor:'middle'})+label('右の辺',870,90,{size:26,color:CD,anchor:'middle'});
  s+=T(`\\dfrac{${V8}-${v}}{${TAU}}`,330,190,{size:56})+T(`g-\\dfrac{k}{m}${v}`,870,190,{size:56});
  const piece=(x,y,src,col,g)=>{const w=texWidth(src,50,false);return T(src,x,y,{size:50})+fade(g,highlight(x-w/2-10,y-68,w+20,116,1,col));};
  s+=fade(seg(p,.1,.3),T('=',175,320,{size:50})+T('-',365,320,{size:50})+T('=',735,320,{size:50})+T('-',860,320,{size:50}));
  s+=fade(seg(p,.1,.3),piece(270,320,`\\dfrac{${V8}}{${TAU}}`,CH,seg(p,.35,.5))+piece(455,320,`\\dfrac{${v}}{${TAU}}`,CF,seg(p,.4,.55)));
  s+=fade(seg(p,.1,.3),piece(795,320,'g',CH,seg(p,.35,.5))+piece(960,320,`\\dfrac{k}{m}${v}`,CF,seg(p,.4,.55)));
  s+=fade(seg(p,.45,.6),L('同じ色の 枠が 同じ項（v∞/τ ＝ g、v/τ ＝ (k/m)v）',600,440,{size:26,color:OK,weight:700}));
  s+=fade(seg(p,.55,.7),check(1100,320,18));
  return s;
 },
 [K+'initchk']:(p)=>{
  let s=T(SOLV0,600,110,{size:48});
  s+=fade(seg(p,.2,.35),T(`${t}=0:\\; e^{0}=1`,600,210,{size:44}));
  s+=fade(seg(p,.4,.55),T(`${v}(0)=${V8}+${V0}-${V8}=${V0}`,600,320,{size:52}));
  s+=fade(seg(p,.65,.8),check(1000,320,18)+L('出発の 速さと 一致',600,420,{size:28,color:OK,weight:700}));
  return s;
 },
 [K+'numchk']:(p)=>{
  let s=L('v₀ ＝ 8 m/s、t ＝ 0',600,90,{size:28,color:CV,weight:700});
  s+=card(80,130,500,280,L('左の辺（微分）',330,180,{size:26,color:CD})+T(`\\dfrac{${V8}-${v}}{${TAU}}=\\dfrac{5-8}{0.5}`,330,265,{size:42})+fade(seg(p,.2,.35),L('＝ −6 m/s²',330,360,{size:34,color:CA,weight:700})),seg(p,.05,.2));
  s+=card(620,130,500,280,L('右の辺',870,180,{size:26,color:CD})+T(`10-2\\times 8=10-16`,870,265,{size:40})+fade(seg(p,.55,.7),L('＝ −6 m/s²',870,360,{size:34,color:CA,weight:700})),seg(p,.4,.55));
  s+=fade(seg(p,.75,.88),L('一致 → 上向きの 加速度 6 m/s²（減速）',600,470,{size:28,color:OK,weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  const rows=[['① 零解 w ＝ 0（終端速度のまま）',null],['②〜④ ÷ w、ln|w| の傾き、積分',`${lnw}=-${t}/${TAU}+C`],['⑤⑥ 指数へ、初期値',`${W}=${W0}\\,${E}`],['v ＝ v∞ − w へ戻す',`${v}=${V8}+(${V0}-${V8})${E}`],['代入で 確かめ（方程式・初期条件）',null]];
  let s='';
  rows.forEach((r,i)=>{const y=95+i*80,g=seg(p,.03+i*.12,.13+i*.12);s+=fade(g,check(90,y,10)+label(r[0],120,y+10,{size:28,color:C.ink,anchor:'start'})+(r[1]?TF(r[1],890,y,460,36):''));});
  return s;
 },
 [K+'next1']:(p)=>{
  const A=axes({x:620,y:460,w:480,h:330,xmin:0,xmax:2,ymin:0,ymax:2.2,xticks:[],yticks:[],xlabel:'速さ',ylabel:'抵抗の 大きさ',xcolor:CV,ycolor:CF});
  let s=card(80,100,470,170,L('ここまでの 結果は',315,150,{size:26,color:CD})+L('抵抗 ＝ kv の モデル',315,215,{size:32,color:CH,weight:700}),1,CH);
  s+=fade(seg(p,.3,.45),A.svg+A.plot(u=>u,{from:0,to:1.9,color:CF,w:4})+label('kv',A.X(1.9)+6,A.Y(1.9)+30,{size:26,color:CF}));
  s+=fade(seg(p,.55,.7),A.plot(u=>u*u*.6,{from:0,to:1.9,color:CH,w:4})+label('速さの 2乗',A.X(1.55),A.Y(2.1),{size:24,color:CH,anchor:'end'}));
  s+=fade(seg(p,.55,.7),L('速い物体では',315,340,{size:28})+L('2乗に 近い',315,395,{size:32,color:CH,weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(80,110,480,260,L('モデルを 変えると',320,170,{size:26,color:CD})+L('終端速度は？',320,270,{size:40,color:CH,weight:700}),1,CH);
  s+=card(640,110,480,260,L('モデルを 変えると',880,170,{size:26,color:CD})+L('解き方は？',880,270,{size:40,color:CH,weight:700}),seg(p,.3,.45),CH);
  return s;
 },
};
