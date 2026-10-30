// 問題編 解説「揺さぶられる模型の、減衰と共振」（q-uc-shm、大学編 16 単振動・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/16_単振動.md の q-uc-shm（解説 22 行、字幕 27 cue）。
// 画面の配置：左に模型・グラフ、右に説明の枠。式変形の行は図を消して式を主役にする（【カット割り】の考え方）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：位置 x 水色、速度 v 紫、加速度の部分 赤、力 F 緑、時間 t 金、Ω・ω 桃、新しい関数 y・強調 黄、Fv（仕事率）橙、係数 C・D は白の斜体。
import {C,clamp,seg,lin,fade,move,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,wall,spring,poly,esc} from './anim.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-uc-shm:';
// 2026-10-16：画面の文字の「x_G」などの添字を、下付きの小さな文字で描く（label と同じ属性。字幕の caption と同じ見え方）。
const subLabel=(s,x,y,{size=26,color=C.ink,anchor='start',weight=400}={})=>{const n=v=>Number((+v).toFixed(2)),d=n(size*.3),fs=Math.round(size*.68);
 const body=String(s).split(/(_[A-Za-z0-9]{1,2})/).map(t=>/^_[A-Za-z0-9]{1,2}$/.test(t)?`<tspan dy="${d}" font-size="${fs}">${esc(t.slice(1))}</tspan><tspan dy="${-d}">\u200b</tspan>`:esc(t)).join('');
 return `<text x="${n(x)}" y="${n(y)}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-weight="${weight}">${body}</text>`;};
const CT=C.t,CW=C.p,CD='#ff6b6b';
const T=(s,x,y,size=36,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}${s}}`;
const X=cc(C.x,'x'),Y=cc(C.hi,'y'),TT=cc(CT,'t'),G='\\gamma',O=cc(CW,'\\Omega'),F0=cc(C.F,'F_0');
const d1=q=>`\\dfrac{d${q}}{d${TT}}`,d2=q=>`\\dfrac{d^2${q}}{d${TT}^2}`;
const EG=`e^{-${G}${TT}}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
// TeX を置いて、その周りに黄の枠（幅は texWidth、高さは分数なら 2.7 倍）
const hlTex=(src,x,y,size,g=1,col=C.hi,frac=1)=>{const w=texWidth(src,size,false),h=size*(frac?2.7:1.6);return T(src,x,y,size)+highlight(x-w/2-16,y-h*.62,w+32,h,g,col);};
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='幅が 1/e になる時間',G2='振幅 A',G3='変位と外力のずれ';
const ANS1=g=>answerTag(1,'B','0.50 s',{g}),ANS2=g=>answerTag(2,'A','0.020 m',{g}),ANS3=g=>answerTag(3,'B','1/4 周期遅れる',{g});
const W2=ctx=>{const W=sentWin(ctx);return {W,b:W[1]?W[1][0]:.5,e:W[1]?W[1][1]:1,a1:W[0][1]};};
// 係数の札（選択肢の記号とは別）
const coefTag=(g=1,x=QX.W-QX.PAD,y=86)=>{const t='係数 C・D（選択肢とは別）',w=t.length*22*1.0+34;return fade(g,rect(x-w,y,w,40,{fill:'#2a3346',fo:.95,stroke:C.dim,sw:2,rx:10})+label(t,x-w/2,y+28,{size:22,color:C.ink,anchor:'middle',weight:700}));};

// ---- 数値 ----
const WD=Math.sqrt(396),GAM=2;
const xFree=t=>Math.exp(-GAM*t)*(Math.cos(WD*t)+GAM/WD*Math.sin(WD*t)); // 初めのずれを 1 とした x(t)
const Amp=W=>.4/Math.sqrt((100-.25*W*W)**2+(W)**2);

// ---- 建物とばね・おもりの模型 ----
// dx：おもりのずれ [px]。F：外力の矢印（−1〜1、null なら描かない）。tags：'right' で m・k・b の札を右に並べる（問題アニメ用）。
function model(dx,{F=null,tags='',ftags=0,g=1,mt=1}={}){
 const y0=290,mx=470+dx,sh=dx*.6;
 let s=poly([[40,y0],[190,y0],[190+sh,90],[40+sh,90]],{fill:C.faint,fo:.25,stroke:C.dim,sw:2.5});
 for(let i=1;i<=4;i++){const y=y0-i*40,o=sh*(y0-y)/200;s+=line(54+o,y,176+o,y,{color:C.dim,w:2});}
 s+=line(115,y0,115+sh,90,{color:C.dim,w:2});
 s+=line(20,y0,200,y0,{color:C.dim,w:3});
 s+=wall(240,140,y0)+line(240,y0,650,y0,{color:C.dim,w:3});
 s+=spring(240,mx-40,192,{coils:8,amp:13,color:C.dim,w:3});
 const cy=255,pist=clamp(mx-150,280,360);
 s+=line(240,cy,262,cy,{color:C.dim,w:3})+rect(262,cy-15,110,30,{fill:C.dim,fo:.12,stroke:C.dim,sw:2.5,rx:3})+line(pist,cy-11,pist,cy+11,{color:C.dim,w:4})+line(pist,cy,mx-40,cy,{color:C.dim,w:3});
 s+=label('k',(240+mx-40)/2,170,{size:24,color:C.ink,anchor:'middle',weight:700})+label('b',317,234,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=rect(mx-40,180,80,110,{fill:C.x,fo:.3,stroke:C.x,sw:2,rx:8})+(mt?label('m',mx,244,{size:30,color:C.ink,anchor:'middle',weight:700}):'');
 s+=arrow(300,322,650,322,{color:C.x,w:3,head:14})+line(470,314,470,330,{color:C.x,w:3})+label('0',470,354,{size:24,color:C.x,anchor:'middle'})+label('x',662,330,{size:28,color:C.x,weight:700});
 if(F!==null){if(Math.abs(F)>.05)s+=arrow(mx,152,mx+F*90,152,{color:C.F,w:6,head:16});s+=label('F₀ cos Ωt',mx,128,{size:24,color:C.F,anchor:'middle',weight:700});}
 if(tags==='right'){
  s+=label('m ＝ 0.25 kg',720,170,{size:28,color:C.ink,weight:700})+label('k ＝ 100 N/m',720,220,{size:28,color:C.ink,weight:700})+label('b ＝ 1.0 kg/s',720,270,{size:28,color:C.ink,weight:700});
  if(ftags)s+=fade(ftags,label('F₀ ＝ 0.40 N',720,340,{size:28,color:C.F,weight:700})+label('Ω ＝ 20 rad/s',720,390,{size:28,color:CW,weight:700}));
 }
 return fade(g,s);
}
// m・k・b（と F₀・Ω）を右の枠に並べる
const tagLines=(y,{f=0}={})=>label('m ＝ 0.25 kg　k ＝ 100 N/m',PC,y,{size:24,color:C.ink,anchor:'middle',weight:700})+label('b ＝ 1.0 kg/s',PC,y+36,{size:24,color:C.ink,anchor:'middle',weight:700})
 +(f?label('F₀ ＝ 0.40 N　Ω ＝ 20 rad/s',PC,y+72,{size:24,color:C.F,anchor:'middle',weight:700}):'');

// ---- 減衰の x–t グラフ（時間の目盛りは opts.ticks のときだけ）----
function dgraph({x0=60,x1=640,yc=425,amp=65,tmax=1.5,p=1,env=0,g=1}={}){
 const XT=t=>x0+(x1-x0)*t/tmax,YX=v=>yc-amp*v;
 let s=arrow(x0-6,yc,x1+24,yc,{color:CT,w:2.5,head:12})+label('t',x1+32,yc+8,{size:26,color:CT,weight:700});
 s+=arrow(x0,yc+amp+16,x0,yc-amp-22,{color:C.x,w:2.5,head:12})+label('x',x0+12,yc-amp-14,{size:26,color:C.x,weight:700});
 const n=300,te=tmax*clamp(p);if(te>.002)s+=draw(Array.from({length:n+1},(_,i)=>{const t=te*i/n;return [XT(t),YX(xFree(t))];}),1,{color:C.x,w:3.5});
 if(env)s+=fade(env,draw(Array.from({length:81},(_,i)=>{const t=tmax*i/80;return [XT(t),YX(Math.exp(-GAM*t))];}),1,{color:C.hi,w:2.5,dash:'8 6'})+draw(Array.from({length:81},(_,i)=>{const t=tmax*i/80;return [XT(t),YX(-Math.exp(-GAM*t))];}),1,{color:C.hi,w:2.5,dash:'8 6'}));
 return {svg:fade(g,s),XT,YX};
}
// 小問1 の大きいグラフ（行7〜9）
const BG={x0:110,x1:615,yc:290,amp:160,tmax:1.5};
function bigGraph({env=1,ticks=1,pt=1,g=1}={}){
 const G_=dgraph({...BG,env,g}),{XT,YX}=G_;let s=G_.svg;
 if(ticks){
  s+=fade(ticks,line(BG.x0-8,YX(1),BG.x0+8,YX(1),{color:C.hi,w:3})+label('A₀',BG.x0-14,YX(1)+9,{size:24,color:C.hi,anchor:'end',weight:700})
   +line(BG.x0-8,YX(1/Math.E),BG.x0+8,YX(1/Math.E),{color:C.hi,w:3})+label('A₀/e',BG.x0-14,YX(1/Math.E)+9,{size:24,color:C.hi,anchor:'end',weight:700})
   +line(BG.x0,YX(1/Math.E),XT(.5),YX(1/Math.E),{color:C.hi,w:1.5,dash:'4 6'}));
 }
 if(pt)s+=fade(pt,line(XT(.5),YX(1/Math.E),XT(.5),470,{color:CT,w:2,dash:'5 6'})+dot(XT(.5),YX(1/Math.E),9,C.hi)+label('0.50 s',XT(.5),498,{size:24,color:CT,anchor:'middle',weight:700}));
 return {svg:s,XT,YX};
}

// ---- 共振曲線 A(Ω) ----
const RC={x0:110,x1:620,yb:470,h:300};
const RX=W=>RC.x0+(RC.x1-RC.x0)*W/30,RY=A=>RC.yb-RC.h*A/.025;
function rcurve({g=1,p=1,v20=0,peak=0,pt=0,low=0}={}){
 let s=arrow(RC.x0-6,RC.yb,RC.x1+30,RC.yb,{color:C.dim,w:2.5,head:12})+arrow(RC.x0,RC.yb+8,RC.x0,RC.yb-RC.h-26,{color:C.dim,w:2.5,head:12});
 for(const W of [10,20,30])s+=line(RX(W),RC.yb-6,RX(W),RC.yb+6,{color:C.dim,w:2})+(W<30?label(String(W),RX(W),RC.yb+32,{size:22,color:C.dim,anchor:'middle'}):'');
 s+=label('Ω［rad/s］',RX(30),RC.yb+32,{size:22,color:CW,anchor:'middle'})+label('振幅 A［m］',RC.x0+14,RC.yb-RC.h-34,{size:22,color:C.hi});
 const n=240,We=30*clamp(p);if(We>.05)s+=draw(Array.from({length:n+1},(_,i)=>{const W=We*i/n;return [RX(W),RY(Amp(W))];}),1,{color:C.hi,w:3.5});
 if(v20)s+=fade(v20,line(RX(20),RC.yb,RX(20),RY(.0215),{color:CW,w:2.5,dash:'7 6'})+label('Ω ＝ ω₀ ＝ 20',RX(20)+10,RY(.0236),{size:24,color:CW,weight:700}));
 if(peak)s+=fade(peak,label('山の頂上は わずかに 左',RX(1),RY(.0195),{size:22,color:C.dim})+label('（約 19.8）',RX(1),RY(.0195)+30,{size:22,color:C.dim})+arrow(RX(15),RY(.0192),RX(19.4),RY(.0201),{color:C.dim,w:2.5,head:10}));
 if(pt)s+=fade(pt,dot(RX(20),RY(.02),9,C.hi)+label('0.020',RX(20)-14,RY(.02)+8,{size:24,color:C.hi,anchor:'end',weight:700}));
 if(low)s+=fade(low,line(RC.x0,RY(.004),RX(26),RY(.004),{color:C.x,w:2.5,dash:'7 6'})+label('0.004（Ω→0）',RC.x0+12,RY(.004)-14,{size:22,color:C.x,weight:700})
  +arrow(RX(24),RY(.0045),RX(24),RY(.0195),{color:C.ink,w:3,head:12})+arrow(RX(24),RY(.0195),RX(24),RY(.0045),{color:C.ink,w:3,head:12})+label('5倍',RX(24)+12,RY(.012),{size:26,color:C.ink,weight:700}));
 return fade(g,s);
}

// ---- 外力・変位・速度・Fv の波形（行19〜21、まとめ）----
const WV={x0:350,x1:1170,tmax:.63};
const WT=t=>WV.x0+(WV.x1-WV.x0)*t/WV.tmax;
function wrow(fn,yc,amp,col,{g=1,lab='',p=1,base=1,from=0}={}){
 let s=base?line(WV.x0,yc,WV.x1+16,yc,{color:CT,w:1.5,opacity:.7})+label('t',WV.x1+22,yc+8,{size:22,color:CT}):'';
 const n=220,te=WV.tmax*clamp(p);if(te>.002)s+=draw(Array.from({length:n+1},(_,i)=>{const t=te*i/n;return [WT(t),yc-amp*fn(t)];}),1,{color:col,w:3.5});
 if(lab)s+=T(lab,190,yc+6,26);
 return fade(g,s);
}
const R={F:150,x:245,v:340,P:450};
const fF=t=>Math.cos(20*t),fX=t=>Math.sin(20*t),fP=t=>Math.cos(20*t)**2;
const LF=`${cc(C.F,'F')}=0.40\\cos 20${TT}`,LX=`${X}=0.020\\sin 20${TT}`,LV=`${cc(C.v,'v')}=0.40\\cos 20${TT}`;

export const ytQxUcShmDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約6秒）：0〜2 s 共通（建物と模型を同時に少し揺らす、m・k・b の札）→ 2〜6 s 小問1（右へずらして離し、小さくなる揺れと x–t グラフ）。静止。
 [K+'q1']:(p)=>{
  const t=p*6;let dx,gp=0;
  if(t<2)dx=14*Math.sin(2*Math.PI*t/1.0);
  else if(t<2.5)dx=60*seg(t,2.05,2.5);
  else{const tp=(t-2.5)*1.5/3.5;dx=60*xFree(tp);gp=tp/1.5;}
  return move(140,0,fade(seg(p,0,.06),model(dx,{tags:'right'}))+dgraph({x0:60,x1:640,yc:425,amp:65,tmax:1.5,p:gp,g:seg(t,2.3,2.6)}).svg);
 },
 // 小問2・3 の図（約6秒）：0〜2 s 共通 → 2〜6 s 外力 F₀ cos Ωt の矢印が伸び縮みするだけ。おもりは動かさない。静止。
 [K+'q2']:(p)=>{
  const t=p*6,dx=t<2?14*Math.sin(2*Math.PI*t/1.0)*seg(p,0,.05):0;
  const F=t<2?null:Math.cos(2*Math.PI*(t-2)/1.0)*seg(t,2,2.3);
  return move(140,0,model(dx,{tags:'right',F,ftags:seg(p,.36,.46)}));
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=model(60*xFree(1.5))+dgraph({p:1}).svg;
  s+=panel(90,380,label('小問1（外力 なし）',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +label('振動の 幅が 初めの 1/e に',PC,200,{size:30,color:C.hi,anchor:'middle',weight:700})+label('なるまでの 時間は？',PC,245,{size:30,color:C.hi,anchor:'middle',weight:700})
   +line(PX+40,290,PX+PW-40,290,{color:C.faint,w:2})+tagLines(345),seg(p,.05,.2),C.hi);
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. 法則：運動方程式（加速度の部分 赤・速度の部分 紫・kx 水色）。「抵抗の項」で b dx/dt を黄の枠、グラフの山が低くなる所を指す
 [K+'eom']:(p,ctx)=>{
  const {b}=W2(ctx),hb=seg(p,b,b+.06);
  const eq=hb>.5?`${cc(C.a,`m${d2('x')}`)}+${cc(C.hi,`\\boxed{${cc(C.v,`b${d1('x')}`)}}`)}+${cc(C.x,'kx')}=0`:`${cc(C.a,`m${d2('x')}`)}+${cc(C.v,`b${d1('x')}`)}+${cc(C.x,'kx')}=0`;
  const plain=`m${d2('x')}+b${d1('x')}+kx=0`,W0=texWidth(plain,34,false),x0=PC-W0/2,ex=(a,b)=>x0+((a?texWidth(a,34,false):0)+texWidth(b,34,false))/2;
  let s=model(60*xFree(1.5));
  const D_=dgraph({p:1}),{XT,YX}=D_;s+=D_.svg;
  const pk=[0,.3157,.6314,.947].map(t=>[XT(t),YX(xFree(t))]);
  s+=fade(seg(p,b+.08,b+.16),draw(pk,1,{color:C.hi,w:3,dash:'6 6'})+pk.map(([x,y])=>dot(x,y,6,C.hi)).join('')+label('山が 低く なる',XT(.75),YX(.55),{size:24,color:C.hi,weight:700}));
  s+=panel(90,300,kindTag('法則',PC,140)+T(eq,PC,230,34)
   +fade(seg(p,.1,.2),label('加速度',ex(0,`m${d2('x')}`),330,{size:22,color:C.a,anchor:'middle',weight:700})+label('速度',ex(`m${d2('x')}+`,`m${d2('x')}+b${d1('x')}`),330,{size:22,color:C.v,anchor:'middle',weight:700})+label('ずれ',ex(`m${d2('x')}+b${d1('x')}+`,`m${d2('x')}+b${d1('x')}+kx`),330,{size:22,color:C.x,anchor:'middle',weight:700}))
   +fade(hb,label('抵抗の 項 → 揺れを 小さく する',PC,370,{size:24,color:C.hi,anchor:'middle',weight:700})),1,C.F);
  return s+goalTag(G1);
 },
 // 3a. 置き換え x＝e^(−γt) y（e^(−γt) が幅の減る分）
 [K+'subst']:(p)=>{
  let s=card(200,100,800,250,label('置き換え',600,145,{size:26,color:C.dim,anchor:'middle'})+T(`${X}=${cc(C.hi,'e^{-\\gamma t}')}\\,${Y}`,600,230,60),1,C.hi);
  const f=`${X}=${cc(C.hi,'e^{-\\gamma t}')}\\,${Y}`,w=texWidth(f,60,false),l=600-w/2,a=texWidth(`${X}=`,60,false),b=texWidth(`${X}=e^{-\\gamma t}\\,`,60,false);
  s+=fade(seg(p,.3,.45),arrow((l+a+l+b)/2,300,(l+a+l+b)/2,268,{color:C.hi,w:3,head:10})+label('幅が 減る 分',(l+a+l+b)/2-20,330,{size:26,color:C.hi,anchor:'end',weight:700})+arrow(l+(b+w)/2,300,l+(b+w)/2,268,{color:C.hi,w:3,head:10})+label('揺れる 部分',l+(b+w)/2+20,330,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.35,.5),label('y：新しい 関数',600,420,{size:24,color:C.hi,anchor:'middle'}));
  return s+goalTag(G1);
 },
 // 3b. 1回微分（積の微分）：−γe^(−γt)y と e^(−γt)dy/dt → dx/dt＝e^(−γt)(dy/dt−γy)
 [K+'subst2']:(p)=>{
  let s=T(`${X}=${EG}\\,${Y}`,600,125,40);
  s+=fade(seg(p,.05,.15),arrow(600,160,600,205,{color:C.dim,w:3,head:12})+label('1回 微分',620,192,{size:24,color:C.dim})+rect(760,165,130,38,{fill:'#2a3346',fo:.95,stroke:C.dim,sw:2,rx:10})+label('積の 微分',825,192,{size:22,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.3),rect(250,225,300,90,{fill:C.E,fo:.08,stroke:C.E,sw:2.5,rx:10})+T(`-${G}\\,${EG}\\,${Y}`,400,272,34)+label('e の 部分を 微分',400,345,{size:22,color:C.E,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),T('+',600,272,36)+rect(650,225,300,90,{fill:C.x,fo:.08,stroke:C.x,sw:2.5,rx:10})+T(`${EG}\\,${d1(Y)}`,800,272,34)+label('y を 微分',800,345,{size:22,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),hlTex(`${d1(X)}=${EG}\\left(${d1(Y)}-${G}${Y}\\right)`,600,435,40));
  return s+goalTag(G1);
 },
 // 4. もう1回微分：2つの部分 → d²x/dt²＝e^(−γt)(d²y/dt²−2γ dy/dt＋γ²y)。−γ dy/dt が2回出て −2γ dy/dt
 [K+'second']:(p)=>{
  const hi=seg(p,.55,.65),gy=`${G}${d1(Y)}`;
  let s=T(`${d1(X)}=${EG}\\left(${d1(Y)}-${G}${Y}\\right)`,600,125,32);
  s+=fade(seg(p,.05,.15),arrow(600,165,600,205,{color:C.dim,w:3,head:12})+label('もう 1回 微分',620,192,{size:24,color:C.dim}));
  s+=fade(seg(p,.15,.3),rect(80,220,480,90,{fill:C.E,fo:.08,stroke:C.E,sw:2.5,rx:10})+T(`${cc(C.hi,`-${G}`)}\\,${EG}\\left(${cc(C.hi,d1(Y))}-${G}${Y}\\right)`,320,265,30)
   +'');
  s+=fade(seg(p,.25,.4),T('+',600,265,34)+rect(640,220,480,90,{fill:C.x,fo:.08,stroke:C.x,sw:2.5,rx:10})+T(`${EG}\\left(${d2(Y)}-${cc(C.hi,gy)}\\right)`,880,265,30));
  s+=fade(seg(p,.45,.55),T(`${d2(X)}=${EG}\\left(${d2(Y)}${cc(C.hi,`\\boxed{-2${G}${d1(Y)}}`)}+${G}^2${Y}\\right)`,600,420,38));
  s+=fade(hi,label('−γ dy/dt が 2回 → −2γ dy/dt',600,500,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 5a. 代入して m e^(−γt) で割る。dy/dt の2つの項（黄）を (b/m−2γ)dy/dt にまとめる
 [K+'choose']:(p)=>{
  let s=label('運動方程式に 代入して、両辺を',640,130,{size:26,color:C.dim,anchor:'end'})+T(`m\\,${EG}`,692,122,30)+label('で 割る',740,130,{size:26,color:C.dim});
  s+=fade(seg(p,.1,.25),T(`${d2(Y)}${cc(C.hi,`-2${G}${d1(Y)}`)}+${G}^2${Y}+\\dfrac{b}{m}\\left(${cc(C.hi,d1(Y))}-${G}${Y}\\right)+\\dfrac{k}{m}${Y}=0`,600,235,34));
  s+=fade(seg(p,.45,.6),arrow(600,290,600,335,{color:C.dim,w:3,head:12})+label('dy/dt の 項を まとめる',620,322,{size:24,color:C.dim}));
  s+=fade(seg(p,.55,.7),T(`${d2(Y)}+${cc(C.hi,`\\boxed{\\left(\\dfrac{b}{m}-2${G}\\right)${d1(Y)}}`)}+\\left(${G}^2-\\dfrac{b${G}}{m}+\\dfrac{k}{m}\\right)${Y}=0`,600,420,34));
  return s+goalTag(G1);
 },
 // 5b. 括弧の中を 0 に（打ち消し線）→ γ＝b/(2m) を黄の枠
 [K+'choose2']:(p)=>{
  const st=seg(p,.1,.2);
  let s=T(`${d2(Y)}+${st>.5?`\\cancel{\\left(\\dfrac{b}{m}-2${G}\\right)${d1(Y)}}`:`\\left(\\dfrac{b}{m}-2${G}\\right)${d1(Y)}`}+\\left(${G}^2-\\dfrac{b${G}}{m}+\\dfrac{k}{m}\\right)${Y}=0`,600,140,32);
  s+=fade(seg(p,.2,.32),label('これが 消える ように',380,265,{size:26,color:C.dim,anchor:'middle'})+T(`\\dfrac{b}{m}-2${G}=0`,700,258,40));
  s+=fade(seg(p,.4,.55),T(`\\boxed{${G}=\\dfrac{b}{2m}}`,600,395,56,{color:C.hi}));
  return s+goalTag(G1);
 },
 // 6. γ＝1.0÷(2×0.25)＝2 /s を一つずつ → 残る y の式と ω_d²＝k/m−γ²
 [K+'gamma']:(p,ctx)=>{
  const {b}=W2(ctx),a=seg(p,.06,.14),c=seg(p,.18,.26),d=seg(p,.3,.38);
  let L=T(`${G}=\\dfrac{b}{2m}`,290,170,44);
  L+=fade(a,T(`=\\dfrac{1.0}{2\\times0.25}`,290,290,40))+fade(d,T(`=2\\ \\mathrm{/s}`,290,400,48,{color:C.hi}));
  let s=card(30,90,520,410,L,1,C.hi);
  let Rr=fade(seg(p,b,b+.08),label('残る y の 式',870,140,{size:26,color:C.dim,anchor:'middle'})+T(`${d2(Y)}+\\left(\\dfrac{k}{m}-${G}^2\\right)${Y}=0`,870,225,36))
   +fade(seg(p,b+.12,b+.2),label('振動の 式',870,305,{size:26,color:C.ink,anchor:'middle',weight:700})+T(`${cc(CW,'\\omega_d')}=\\sqrt{\\dfrac{k}{m}-${G}^2}`,870,400,42));
  s+=card(580,90,580,410,Rr,seg(p,b-.02,b+.05),CW);
  return s+goalTag(G1);
 },
 // 7. 包絡線 ±A₀e^(−γt)（黄の点線）、A₀・A₀/e、0.50 s。答えの札
 [K+'ans1']:(p,ctx)=>{
  const {b,e}=W2(ctx);
  let s=bigGraph({env:seg(p,.05,.15),ticks:seg(p,.3,.4),pt:seg(p,b+.05,b+.15)}).svg;
  s+=panel(90,360,label('幅',PC,135,{size:26,color:C.dim,anchor:'middle'})+T(`A_0\\,${EG}`,PC,190,40,{color:C.hi})
   +fade(seg(p,.3,.4),T(`${G}${TT}=1\\ \\rightarrow\\ e^{-1}=\\dfrac{1}{e}`,PC,275,34))
   +fade(seg(p,b,b+.08),T(`${TT}=\\dfrac{1}{${G}}=0.50\\ \\mathrm{s}`,PC,385,40)),1,C.hi);
  return s+goalTag(G1)+ANS1(seg(p,b+.5*(e-b),b+.5*(e-b)+.05));
 },
 // 8. 誤答 A → C（一文を半分ずつ）
 [K+'wrongAC']:(p,ctx)=>{
  let s=bigGraph().svg;
  s+=panel(90,210,T(`${G}=\\dfrac{b}{2m}=2\\ \\mathrm{/s}`,PC,150,34)+T(`${TT}=\\dfrac{1}{${G}}=0.50\\ \\mathrm{s}`,PC,245,34),1,C.faint);
  s+=wrongSeq(p,ctx,[['A','0.25 s','γ ＝ b/m（2 で 割り忘れ）'],['C','2.0 s','γ（単位 1/s）を 時間に した']],{opts:{...WOPT,y:320}});
  return s+goalTag(G1)+ANS1(1);
 },
 // 9. 誤答 D（1周期）。0〜0.50 s を金で塗り、1周期の金の横棒、山を 1、2 と数えて「約 1.6 回」
 [K+'wrongD']:(p,ctx)=>{
  const {b}=W2(ctx),B=bigGraph(),{XT,YX}=B,Td=2*Math.PI/WD;
  let s=fade(seg(p,b,b+.06),rect(XT(0),110,XT(.5)-XT(0),350,{fill:CT,fo:.12,stroke:'none',rx:0}))+B.svg;
  s+=fade(seg(p,.15,.25),line(XT(0),98,XT(Td),98,{color:CT,w:6})+line(XT(0),88,XT(0),108,{color:CT,w:3})+line(XT(Td),88,XT(Td),108,{color:CT,w:3})+label('1周期 約 0.32 s',XT(Td)+12,106,{size:22,color:CT,weight:700}));
  s+=fade(seg(p,b+.1,b+.16),label('1',XT(0)+20,YX(1)+2,{size:26,color:C.ink,weight:700}))+fade(seg(p,b+.18,b+.24),label('2',XT(Td)+4,YX(xFree(Td))-14,{size:26,color:C.ink,weight:700}));
  s+=fade(seg(p,b+.3,b+.38),label('0.50 s で 約 1.6 回',XT(.5)+14,160,{size:26,color:CT,weight:700}));
  s+=panel(90,210,T(`${cc(CW,'\\omega_d')}=\\sqrt{400-4}\\approx19.9`,PC,150,34)+subLabel('周期 2π/ω_d ≈ 0.32 s',PC,245,{size:26,color:CT,anchor:'middle',weight:700}),1,C.faint);
  s+=wrongCard('D','約 0.32 s','1周期で 1/e に なると した',{...WOPT,y:320,g:seg(p,.02,.06)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 10. 出題中の小問2・3 の図（外力の矢印が揺れる模型。おもりは動かさない）
 [K+'goal2']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=model(0,{F:Math.cos(2*Math.PI*t/1.0)});
  s+=panel(90,380,label('小問2',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +label('Ω ＝ 20 rad/s で 押し続けた',PC,200,{size:28,color:C.hi,anchor:'middle',weight:700})+label('ときの 振幅は？（定常解）',PC,245,{size:28,color:C.hi,anchor:'middle',weight:700})
   +line(PX+40,290,PX+PW-40,290,{color:C.faint,w:2})+tagLines(340,{f:1}),seg(p,.05,.2),C.hi);
  s+=note('矢印の 伸び縮みは ゆっくり 描いています',340,420);
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 11. 定常解 x＝C cos Ωt＋D sin Ωt（C・D は白の斜体）と、札「係数 C・D（選択肢とは別）」
 [K+'ansatz']:(p,ctx)=>{
  const {b}=W2(ctx),t=cueT(ctx);
  let s=model(0,{F:Math.cos(2*Math.PI*t/1.0)});
  s+=panel(140,250,label('定常解（十分に 時間が たった後）',PC,190,{size:24,color:C.dim,anchor:'middle'})+T(`${X}=C\\cos ${O}${TT}+D\\sin ${O}${TT}`,PC,275,34)
   +fade(seg(p,b,b+.08),label('C・D は 係数の 名前',PC,350,{size:24,color:C.ink,anchor:'middle',weight:700})),seg(p,.03,.12),C.faint);
  s+=coefTag(seg(p,b,b+.08));
  s+=note('矢印の 伸び縮みは ゆっくり 描いています',340,420);
  return s+goalTag(G2);
 },
 // 12a. 1回微分：cos → −sin、sin → cos、Ω が前に出る
 [K+'deriv']:(p)=>{
  let s=T(`${X}=C\\cos ${O}${TT}+D\\sin ${O}${TT}`,600,140,40);
  s+=fade(seg(p,.1,.2),arrow(600,180,600,225,{color:C.dim,w:3,head:12})+label('1回 微分',620,212,{size:24,color:C.dim}));
  s+=fade(seg(p,.25,.4),T(`${d1(X)}=${O}\\left(-C\\sin ${O}${TT}+D\\cos ${O}${TT}\\right)`,600,290,40));
  s+=fade(seg(p,.45,.55),label('cos → −sin、sin → cos、Ω が 前に 出る',600,380,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s+coefTag(1)+goalTag(G2);
 },
 // 12b. もう1回微分：−Ω²(C cos Ωt＋D sin Ωt) の括弧が x と同じ形 → −Ω²x
 [K+'deriv2']:(p)=>{
  let s=T(`${X}=C\\cos ${O}${TT}+D\\sin ${O}${TT}`,600,120,32)+T(`${d1(X)}=${O}\\left(-C\\sin ${O}${TT}+D\\cos ${O}${TT}\\right)`,600,200,32);
  s+=fade(seg(p,.05,.15),arrow(600,240,600,280,{color:C.dim,w:3,head:12})+label('もう 1回 微分',620,268,{size:24,color:C.dim}));
  s+=fade(seg(p,.15,.3),T(`${d2(X)}=-${O}^2${cc(C.hi,`\\boxed{\\color{${C.ink}}C\\cos ${O}${TT}+D\\sin ${O}${TT}}`)}`,560,345,36));
  s+=fade(seg(p,.35,.45),label('＝ x と 同じ 形',940,353,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.6),T(`=-${O}^2${X}`,600,450,48,{color:C.hi}));
  return s+coefTag(1)+goalTag(G2);
 },
 // 13a. cos の箱と sin の箱 → 2乗して足す（交差項は打ち消し線で消える）
 [K+'boxes']:(p,ctx)=>{
  let s=T(`m${d2(X)}+b${d1(X)}+k${X}=${F0}\\cos ${O}${TT}`,600,120,30);
  s+=fade(seg(p,.05,.15),rect(60,165,520,140,{fill:C.x,fo:.06,stroke:C.x,sw:2.5,rx:14})+label('cos Ωt の 箱',320,200,{size:24,color:C.x,anchor:'middle',weight:700})
   +T(`(k-m${O}^2)C+b${O}D=${F0}`,320,260,32));
  s+=fade(seg(p,.12,.22),rect(620,165,520,140,{fill:C.v,fo:.06,stroke:C.v,sw:2.5,rx:14})+label('sin Ωt の 箱',880,200,{size:24,color:C.v,anchor:'middle',weight:700})
   +T(`(k-m${O}^2)D-b${O}C=0`,880,260,32));
  s+=fade(seg(p,.4,.5),label('2乗して 足す',600,350,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.62),T(`\\left[(k-m${O}^2)^2+(b${O})^2\\right](C^2+D^2)={F_0}^2`,600,420,34));
  s+=fade(seg(p,.62,.72),label('交差項（2(k−mΩ²)bΩCD）は 打ち消し合って 消える',600,490,{size:22,color:CD,anchor:'middle',weight:700}));
  return s+coefTag(1)+goalTag(G2);
 },
 // 13b. 振幅 A＝√(C²＋D²)＝F₀/√[(k−mΩ²)²＋(bΩ)²]（(k−mΩ²) 水色、bΩ 紫）
 [K+'boxes2']:(p)=>{
  let s=T(`\\left[(k-m${O}^2)^2+(b${O})^2\\right](C^2+D^2)={F_0}^2`,600,130,28);
  s+=fade(seg(p,.03,.12),label('振幅',480,205,{size:28,color:C.dim,anchor:'end'})+T(`A=\\sqrt{C^2+D^2}`,600,195,34));
  s+=fade(seg(p,.15,.3),hlTex(`A=\\dfrac{${F0}}{\\sqrt{${cc(C.x,`(k-m${O}^2)`)}^2+${cc(C.v,`(b${O})`)}^2}}`,600,350,56));
  return s+coefTag(1)+goalTag(G2);
 },
 // 14. 共振曲線と Ω＝ω₀＝20 の縦線、「山の頂上はわずかに左」。右に ω₀＝√(k/m)＝20、k−mΩ²＝100−0.25×400＝0（打ち消し線）
 [K+'omega0']:(p,ctx)=>{
  const {b}=W2(ctx),z=seg(p,b+.3,b+.4);
  let s=rcurve({p:seg(p,.03,.25),v20:seg(p,.25,.35),peak:seg(p,.35,.45)});
  s+=panel(90,380,label('ばね 自身の 角振動数',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(`${cc(CW,'\\omega_0')}=\\sqrt{\\dfrac{k}{m}}=\\sqrt{400}=20`,PC,200,32)
   +fade(seg(p,b,b+.08),line(PX+40,255,PX+PW-40,255,{color:C.faint,w:2})+label('Ω ＝ 20 では',PC,292,{size:24,color:C.dim,anchor:'middle'})+T(`k-m${O}^2=100-0.25\\times400`,PC-40,350,28))
   +fade(seg(p,b+.2,b+.3),T('=0',PC+190,350,30,{color:CD}))+fade(z,T(`A=\\dfrac{${F0}}{\\sqrt{${cc(CD,`\\cancel{(k-m${O}^2)^2}`)}+(b${O})^2}}`,PC,425,26)),1,CW);
  return s+goalTag(G2);
 },
 // 15. bΩ＝1.0×20＝20、A＝0.40/20＝0.020 m。曲線の Ω＝20 の高さに「0.020」。答えの札
 [K+'ans2']:(p,ctx)=>{
  const {b,e}=W2(ctx);
  let s=rcurve({v20:1,pt:seg(p,.6*b,.7*b)});
  s+=panel(90,380,T(`A=\\dfrac{${F0}}{\\sqrt{0^2+${cc(C.v,`(b${O})`)}^2}}=\\dfrac{${F0}}{${cc(C.v,`b${O}`)}}`,PC,165,32)
   +fade(seg(p,.15,.25),T(`${cc(C.v,`b${O}`)}=1.0\\times20=20`,PC,265,32))
   +fade(seg(p,.35,.45),T(`A=\\dfrac{0.40}{20}=0.020\\ \\mathrm{m}`,PC,375,36)),1,C.v);
  return s+goalTag(G2)+ANS2(seg(p,b+.4*(e-b),b+.4*(e-b)+.05));
 },
 // 16a. 誤答 B（限りなく大きい）
 [K+'wrong2']:(p)=>{
  let s=rcurve({v20:1,pt:1});
  s+=panel(90,210,T(`A=\\dfrac{${F0}}{\\sqrt{(k-m${O}^2)^2+${cc(C.hi,`(b${O})^2`)}}}`,PC,195,30),1,C.faint);
  s+=wrongCard('B','限りなく大きい','抵抗 bΩ が 残る（有限）',{...WOPT,y:320,g:seg(p,.04,.12)});
  return s+goalTag(G2)+ANS2(1);
 },
 // 16b. 誤答 C（F₀/k、ゆっくり押したとき）→ D（F₀/b）。曲線の左端に横線「0.004」、山と比べて「5倍」
 [K+'wrong2b']:(p,ctx)=>{
  let s=rcurve({v20:1,pt:1,low:seg(p,.03,.15)});
  s+=panel(90,210,T(`A=\\dfrac{${F0}}{\\sqrt{(k-m${O}^2)^2+(b${O})^2}}`,PC,195,30),1,C.faint);
  s+=wrongSeq(p,ctx,[['C','0.0040 m','F₀/k（ゆっくり 押したとき）'],['D','0.40 m','F₀/b（単位 m/s）']],{opts:{...WOPT,y:320}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=model(0,{F:Math.cos(2*Math.PI*t/1.0)});
  s+=panel(90,300,label('小問3（Ω ＝ 20 で 押す）',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +label('変位 x は 外力に 比べて',PC,210,{size:30,color:C.hi,anchor:'middle',weight:700})+label('どう 揺れる？',PC,260,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('（理由とともに）',PC,320,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=note('矢印の 伸び縮みは ゆっくり 描いています',340,420);
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 18. 2つの箱に k−mΩ²＝0 を入れる → sin の箱から C＝0、cos の箱から D＝0.40/20＝0.020 → x＝0.020 sin 20t（黄の枠）
 // （2026-10-16 PQ-003：字幕を「sin の係数を比べると C＝0、cos の係数を比べると D」に直したので、C＝0 を sin の箱、D を cos の箱に矢印で結ぶ）
 [K+'coef']:(p,ctx,box=0)=>{
  let s=rect(60,100,520,150,{fill:C.x,fo:.06,stroke:C.x,sw:2.5,rx:14})+label('cos Ωt の 箱',320,135,{size:24,color:C.x,anchor:'middle',weight:700})
   +T(`\\cancel{(k-m${O}^2)C}+b${O}D=${F0}`,320,200,30);
  s+=rect(620,100,520,150,{fill:C.v,fo:.06,stroke:C.v,sw:2.5,rx:14})+label('sin Ωt の 箱',880,135,{size:24,color:C.v,anchor:'middle',weight:700})
   +T(`\\cancel{(k-m${O}^2)D}-b${O}C=0`,880,200,30);
  s+=label('k − mΩ² ＝ 0',600,280,{size:24,color:CD,anchor:'middle',weight:700});
  // sin の係数 → C＝0（sin の箱の下）、cos の係数 → D（cos の箱の下）。箱から結果へ矢印
  s+=fade(seg(p,.08,.14),arrow(880,254,880,300,{color:C.v,w:4,head:12}));
  s+=fade(seg(p,.1,.2),T('C=0',880,372,40));
  s+=fade(seg(p,.23,.29),arrow(320,254,320,300,{color:C.x,w:4,head:12}));
  s+=fade(seg(p,.25,.4),T(`D=\\dfrac{${F0}}{b${O}}=\\dfrac{0.40}{20}=0.020`,320,375,36));
  s+=fade(box,T(`\\boxed{${X}=0.020\\sin 20${TT}}`,600,450,44,{color:C.hi}));
  return s+coefTag(1,QX.W-QX.PAD,QX.H-48)+goalTag(G3);
 },
 // 18b.（2026-10-16 PQ-003 で cue を分けた2つ目）C・D を出したまま、x＝0.020 sin 20t（黄の枠）
 [K+'coef2']:(p,ctx)=>ytQxUcShmDiagrams[K+'coef'](1,ctx,seg(p,.05,.2)),
 // 19. 外力 0.40 cos 20t（緑）と変位 0.020 sin 20t（水色）。外力の山 → 変位の山 「1/4 周期（約 0.079 s）」。答えの札
 [K+'phase']:(p,ctx)=>{
  const {b,e}=W2(ctx);
  let s=wrow(fF,R.F,38,C.F,{lab:LF,p:seg(p,.03,.2)})+wrow(fX,R.x,38,C.x,{lab:LX,p:seg(p,.1,.27)});
  s+=label('外力',190,R.F-40,{size:22,color:C.F,anchor:'middle',weight:700})+label('変位',190,R.x-40,{size:22,color:C.x,anchor:'middle',weight:700});
  const t1=Math.PI/10,t2=t1+Math.PI/40,a=seg(p,.35,.5);
  s+=fade(a,line(WT(t1),R.F-38,WT(t1),300,{color:C.F,w:2,dash:'5 6'})+line(WT(t2),R.x-38,WT(t2),300,{color:C.x,w:2,dash:'5 6'})
   +arrow(WT(t1),295,WT(t2),295,{color:C.hi,w:4,head:12})+label('1/4 周期（約 0.079 s）',(WT(t1)+WT(t2))/2,340,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.08),label('外力が 最大 → 1/4 周期 後に 変位が 最大',760,420,{size:26,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G3)+ANS3(seg(p,b+.75*(e-b),b+.75*(e-b)+.04));
 },
 // 20. 3段目に速度 0.40 cos 20t（紫）、外力と山がそろう所に縦の点線。下に Fv（0 以上、橙）
 [K+'power']:(p,ctx)=>{
  const {b}=W2(ctx);
  let s=wrow(fF,R.F,38,C.F,{lab:LF})+wrow(fX,R.x,38,C.x,{lab:LX});
  s+=label('外力',190,R.F-40,{size:22,color:C.F,anchor:'middle',weight:700})+label('変位',190,R.x-40,{size:22,color:C.x,anchor:'middle',weight:700});
  const dv=seg(p,.18,.24)>.5;
  s+=wrow(fF,R.v,38,C.v,{lab:dv?LV:`${cc(C.v,'v')}=0.020\\times20\\cos 20${TT}`,p:seg(p,.1,.3),g:seg(p,.03,.09)})+fade(seg(p,.03,.09),label('速度（x を 微分）',190,R.v-40,{size:22,color:C.v,anchor:'middle',weight:700}));
  const pk=[0,Math.PI/10,Math.PI/5];
  s+=fade(seg(p,.32,.42),pk.map(t=>line(WT(t),R.F-42,WT(t),R.v+42,{color:C.hi,w:2,dash:'4 6'})).join('')+label('山が そろう',WT(Math.PI/10)+10,R.v+64,{size:22,color:C.hi,weight:700}));
  s+=fade(seg(p,b,b+.08),wrow(t=>fP(t)*1,R.P+30,64,C.E,{p:seg(p,b,b+.2)})+T(`${cc(C.F,'F')}${cc(C.v,'v')}\\geqq0`,190,R.P,28)+label('Fv（いつも 0 以上）',190,R.P+40,{size:22,color:C.E,anchor:'middle',weight:700}));
  return s+goalTag(G3)+ANS3(1);
 },
 // 21. 誤答 A → C → D を一枚ずつ（A・C は文1 を半分ずつ、D は文2）
 [K+'wrong3']:(p,ctx)=>{
  const {b,a1}=W2(ctx),m=a1*.5;
  let s=wrow(fF,R.F,38,C.F,{lab:LF})+wrow(fX,R.x,38,C.x,{lab:LX});
  s+=label('外力',190,R.F-40,{size:22,color:C.F,anchor:'middle',weight:700})+label('変位',190,R.x-40,{size:22,color:C.x,anchor:'middle',weight:700});
  s+=wrongSeq(p,ctx,[['A','同時に 最大','ゆっくり 押すときの 見方'],['C','1/2 周期 遅れる','Ω ≫ ω₀ の ときに 近づく 形'],['D','1/4 周期 早い','sin は cos より 遅れる']],{win:[[0,m],[m,a1],[b,1]],opts:{y:330}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 22. 0.50 s で 1/e を通る包絡線、Ω＝20 で 0.020 m の共振曲線、1/4 周期遅れる波形。振幅の式の bΩ を黄で囲む。答えの札3枚
 [K+'sum']:(p)=>{
  const xs=[20,413,806],w=374,y0=86,h=290,gs=[seg(p,.02,.12),seg(p,.12,.22),seg(p,.22,.32)];
  let s='';
  // 1：減衰
  {const x=xs[0],D_=dgraph({x0:x+30,x1:x+w-50,yc:y0+130,amp:80,tmax:1.5,env:1});
   const px=D_.XT(.5),py=D_.YX(1/Math.E);
   s+=card(x,y0,w,h,D_.svg+dot(px,py,7,C.hi)+line(px,py,px,y0+225,{color:CT,w:2,dash:'4 5'})+label('0.50 s で 1/e',x+w/2,y0+270,{size:24,color:CT,anchor:'middle',weight:700}),gs[0],C.hi);}
  // 2：共振曲線
  {const x=xs[1],X0=x+30,X1=x+w-30,YB=y0+220,HH=170,rx=W=>X0+(X1-X0)*W/30,ry=A=>YB-HH*A/.025;
   let c=arrow(X0-4,YB,X1+10,YB,{color:C.dim,w:2,head:10})+arrow(X0,YB+4,X0,YB-HH-14,{color:C.dim,w:2,head:10})
    +draw(Array.from({length:121},(_,i)=>{const W=30*i/120;return [rx(W),ry(Amp(W))];}),1,{color:C.hi,w:3})+dot(rx(20),ry(.02),7,C.hi)+label('0.020 m',rx(20)+12,ry(.02)+6,{size:22,color:C.hi,weight:700});
   s+=card(x,y0,w,h,c+label('Ω ＝ 20 で 0.020 m',x+w/2,y0+270,{size:24,color:C.hi,anchor:'middle',weight:700}),gs[1],C.hi);}
  // 3：波形
  {const x=xs[2],X0=x+30,X1=x+w-30,tx=t=>X0+(X1-X0)*t/.63;
   let c=draw(Array.from({length:121},(_,i)=>{const t=.63*i/120;return [tx(t),y0+90-36*fF(t)];}),1,{color:C.F,w:3})+draw(Array.from({length:121},(_,i)=>{const t=.63*i/120;return [tx(t),y0+190-36*fX(t)];}),1,{color:C.x,w:3});
   c+=label('外力',X0,y0+44,{size:22,color:C.F,weight:700})+label('変位',X0,y0+146,{size:22,color:C.x,weight:700});
   c+=arrow(tx(Math.PI/10),y0+240,tx(Math.PI/10+Math.PI/40),y0+240,{color:C.hi,w:3,head:10});
   s+=card(x,y0,w,h,c+label('1/4 周期 遅れる',x+w/2,y0+280,{size:24,color:C.hi,anchor:'middle',weight:700}),gs[2],C.hi);}
  s+=fade(seg(p,.4,.55),T(`A=\\dfrac{${F0}}{\\sqrt{(k-m${O}^2)^2+${cc(C.hi,`\\boxed{(b${O})^2}`)}}}`,480,462,30)+label('Ω ≈ ω₀ では bΩ だけが 抑える',830,463,{size:24,color:C.hi,weight:700}));
  s+=answerRow([[1,'B','0.50 s'],[2,'A','0.020 m'],[3,'B','']],{g:seg(p,.8,.9)});
  return s;
 },
};
