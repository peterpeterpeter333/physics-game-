// YouTube シリーズ「運動方程式・上級 1/1」(ys-uc-newton-1) — 図。Stage 1200×515.
// 色：位置 x・𝐫 水色、速度 𝐯 紫、加速度 𝐚 赤、力 𝐅 緑、時間 t 金、強調 黄、誤り・抵抗 赤。
// 放物運動は縦横同じ縮尺（1 m＝140 px）。
import {C,seg,fade,mix,label,line,rect,dot,ring,arrow,highlight,texWidth,draw} from './anim.mjs';
import {card,T,cc,cX,cH,cV,cT} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='uc-newton-1:';
const ok=C.F,bad=C.a;
const cF=s=>cc(C.F,s),cA=s=>cc(C.a,s),cR=s=>cc(bad,s);
const d2=v=>'\\dfrac{d^2'+v+'}{d'+cT('t')+'^2}';
const bR='\\mathbf{r}',bV='\\mathbf{v}',bF='\\mathbf{F}',bA='\\mathbf{a}';

// ---- projectile (equal scale) ----
const PJ={x0:80,y0:440,s:140};
const PX=u=>PJ.x0+PJ.s*u,PY=v=>PJ.y0-PJ.s*v;
const pr=t=>[4*t,5*t-5*t*t];
function pbase({g=1,path=1,ticks=1}={}){
 let s=fade(g,arrow(PJ.x0-10,PJ.y0,PX(4.3),PJ.y0,{color:C.dim,w:2.5,head:13})+arrow(PJ.x0,PJ.y0+10,PJ.x0,PY(2.1),{color:C.dim,w:2.5,head:13})
  +label('x（m）',PX(4.3)-4,PJ.y0+62,{size:24,color:C.x,anchor:'end'})+label('y（m）',PJ.x0+12,PY(2.1)+6,{size:24,color:C.ink}));
 s+=fade(g*ticks,[1,2,3,4].map(u=>line(PX(u),PJ.y0-6,PX(u),PJ.y0+6,{color:C.dim})+label(String(u),PX(u),PJ.y0+32,{size:22,color:C.dim,anchor:'middle'})).join('')
  +[0.5,1].map(v=>line(PJ.x0-6,PY(v),PJ.x0+6,PY(v),{color:C.dim})+label(String(v),PJ.x0-12,PY(v)+8,{size:22,color:C.dim,anchor:'end'})).join(''));
 s+=fade(g,draw(Array.from({length:81},(_,i)=>{const q=pr(i/80);return [PX(q[0]),PY(q[1])];}),path,{color:C.x,w:3.5}));
 return s;
}
const ball=(t,g=1)=>{const q=pr(t);return fade(g,dot(PX(q[0]),PY(q[1]),10,C.ink));};
const VS=22;
const vel=(t,g=1)=>{const q=pr(t);return fade(g,arrow(PX(q[0]),PY(q[1]),PX(q[0])+VS*4,PY(q[1])-VS*(5-10*t),{color:C.v,w:4,head:14}));};
const gArrow=(t,g=1,len=70)=>{const q=pr(t);return fade(g,arrow(PX(q[0]),PY(q[1]),PX(q[0]),PY(q[1])+len,{color:ok,w:5,head:14})+label('mg',PX(q[0])+12,PY(q[1])+len-6,{size:24,color:ok,weight:700}));};
const tq=n=>Array.from({length:n+1},(_,i)=>i/n);

export const ytUcNewton1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const t=Math.min(1,seg(p,.05,.7));
  let s=pbase({path:t})+ball(t)+vel(0,seg(p,.3,.45))+label('𝐯₀',PX(0)+VS*4+8,PY(0)-VS*5,{size:26,color:C.v,weight:700});
  s+=card(690,90,470,320,label('前回の 最後の 問い',925,140,{size:26,color:C.dim,anchor:'middle'})
   +label('放物運動を 成分で 解き',925,215,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('解を 確かめるには？',925,285,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=pbase()+ball(1);
  s+=card(690,90,470,320,label('放物運動を 成分で 解き',925,150,{size:28,color:C.dim,anchor:'middle'})
   +label('解を 確かめるには？',925,205,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),label('力が 変わったら？',925,300,{size:38,color:C.hi,anchor:'middle',weight:700})),1,C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=card(100,60,1000,170,label('中級',150,110,{size:24,color:C.dim})+T('m\\,'+d2(cX(bR))+'='+cF(bF),600,150,{size:52})+label('＝ 成分の 式の 束',960,160,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(100,270,1000,170,label('2回 積分',150,320,{size:24,color:C.dim})+T(cX('y')+'='+cX('y_0')+'+'+cV('v_0')+cT('t')+'-\\tfrac12 g'+cT('t')+'^2',600,370,{size:52}),seg(p,.45,.6));
  return s;
 },
 [K+'recall2']:(p)=>{
  const bx=[[200,'位置',cX(bR)+'=(4'+cT('t')+',\\,5'+cT('t')+'-5'+cT('t')+'^2)',C.x],[600,'速度',cV(bV)+'=(4,\\,5-10'+cT('t')+')',C.v],[1000,'加速度',cA(bA)+'=(0,\\,-10)',C.a]];
  let s=label('ベクトル・上級',600,60,{size:26,color:C.dim,anchor:'middle'});
  bx.forEach(([x,n,t,col],i)=>{s+=card(x-185,100,370,130,label(n,x,140,{size:24,color:col,anchor:'middle'})+T(t,x,195,{size:30}),seg(p,.02+i*.08,.12+i*.08));});
  s+=fade(seg(p,.15,.3),arrow(390,165,410,165,{color:C.dim,w:3,head:10})+arrow(790,165,810,165,{color:C.dim,w:3,head:10})+label('微分 →',600,270,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),arrow(1000,320,200,320,{color:C.hi,w:6,head:18})+label('今回：力から 出発して 積分で 戻る',600,400,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'kinds']:(p)=>{
  const rows=[['法則','ma ＝ F（実験に 支えられた）',C.ink],['仮定','重力だけ、g ＝ 10 m/s²',C.t],['導いた 結果','位置の 式 𝐫(t)',ok]];
  let s='';
  rows.forEach(([a,b,col],i)=>{const y=80+i*125;s+=card(170,y,860,105,label(a,220,y+65,{size:30,color:col,weight:700})+label(b,990,y+65,{size:32,color:C.ink,anchor:'end'}),seg(p,.05+i*.25,.15+i*.25));});
  return s;
 },
 // ===== S2 成分にほどく =====
 [K+'setup']:(p)=>{
  let s=pbase({path:0})+ball(0);
  const X=PX(0),Y=PY(0);
  s+=fade(seg(p,.1,.25),arrow(X,Y,X+VS*4*1.5,Y,{color:C.v,w:4,head:14})+label('横 4 m/s',X+VS*6+12,Y-8,{size:24,color:C.v,weight:700}));
  s+=fade(seg(p,.25,.4),arrow(X,Y,X,Y-VS*5*1.5,{color:C.v,w:4,head:14})+label('上 5 m/s',X+12,Y-VS*7.5-10,{size:22,color:C.v,weight:700}));
  s+=fade(seg(p,.4,.55),arrow(X,Y,X+VS*6,Y-VS*7.5,{color:C.v,w:5,head:16})+label('𝐯₀',X+VS*6+12,Y-VS*7.5+24,{size:28,color:C.v,weight:700}));
  s+=card(690,110,470,280,label('x：水平 右向き',925,190,{size:30,color:C.x,anchor:'middle',weight:700})+label('y：鉛直 上向き',925,260,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('g ＝ 10 m/s²（仮定）',925,335,{size:26,color:C.t,anchor:'middle'}),seg(p,.6,.75));
  return s;
 },
 [K+'init']:(p)=>{
  let s=pbase({path:0})+ball(0)+vel(0)+label('𝐯₀',PX(0)+VS*4+8,PY(0)-VS*5,{size:26,color:C.v,weight:700});
  s+=card(690,110,470,280,label('初期条件（与える 値）',925,165,{size:26,color:C.dim,anchor:'middle'})
   +T(cX(bR+'(0)')+'=(0,\\,0)',925,240,{size:44})
   +fade(seg(p,.35,.5),T(cV(bV+'(0)')+'=(4,\\,5)\\ \\mathrm{m/s}',925,325,{size:44})),seg(p,.02,.12));
  return s;
 },
 [K+'force']:(p)=>{
  let s=pbase({path:.5})+ball(0.3)+gArrow(0.3,seg(p,.1,.25),90);
  s+=card(690,110,470,280,label('働く 力は 重力 だけ',925,165,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),T(cF(bF)+'=(0,\\,-m g)',925,250,{size:48}))
   +fade(seg(p,.6,.75),label('横向きの 力 ＝ 0',925,335,{size:28,color:ok,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'split']:(p)=>{
  let s=T('m\\,'+d2(cX(bR))+'='+cF(bF),600,80,{size:46});
  s+=fade(seg(p,.15,.3),arrow(520,140,330,200,{color:C.dim,w:3,head:12})+arrow(680,140,870,200,{color:C.dim,w:3,head:12}));
  s+=card(80,220,480,200,label('x 成分（横）',320,270,{size:26,color:C.x,anchor:'middle'})+T('m\\,'+d2(cX('x'))+'=0',320,355,{size:46}),seg(p,.25,.4));
  s+=card(640,220,480,200,label('y 成分（縦）',880,270,{size:26,color:C.ink,anchor:'middle'})+T('m\\,'+d2('y')+'=-m g',880,355,{size:46}),seg(p,.5,.65));
  return s;
 },
 [K+'divide']:(p)=>{
  let s=card(80,90,480,200,label('x 成分（横）',320,140,{size:26,color:C.x,anchor:'middle'})+T(d2(cX('x'))+'=0',320,225,{size:48}),1);
  s+=card(640,90,480,200,label('y 成分（縦）',880,140,{size:26,color:C.ink,anchor:'middle'})+T(d2('y')+'=-g',880,225,{size:48}),1);
  s+=label('両辺 ÷ m',600,200,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.45,.6),T('=-10\\ \\mathrm{m/s^2}',880,370,{size:44}));
  s+=fade(seg(p,.45,.6),label('m が 消える',320,370,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'indep']:(p)=>{
  let s=card(80,90,480,200,label('x の 式：y が ない',320,140,{size:26,color:C.x,anchor:'middle'})+T(d2(cX('x'))+'=0',320,225,{size:46}),1);
  s+=card(640,90,480,200,label('y の 式：x が ない',880,140,{size:26,color:C.ink,anchor:'middle'})+T(d2('y')+'=-10',880,225,{size:46}),1);
  s+=fade(seg(p,.4,.55),line(320,300,320,360,{color:C.t,w:3})+line(880,300,880,360,{color:C.t,w:3})+line(320,360,880,360,{color:C.t,w:3})
   +label('同じ 時計 t',600,410,{size:34,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('→ 別々に 解ける',600,470,{size:30,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 2回積分 =====
 [K+'xv']:(p)=>{
  let s=label('横（x 成分）',600,55,{size:28,color:C.x,anchor:'middle',weight:700});
  s+=T('\\dfrac{d'+cV('v_x')+'}{d'+cT('t')+'}=0',600,140,{size:46});
  s+=fade(seg(p,.25,.4),T(cV('v_x')+'('+cT('t')+')-'+cV('v_x')+'(0)=\\int_0^{'+cT('t')+'}0\\,ds=0',600,260,{size:44}));
  const e=cV('v_x')+'('+cT('t')+')=4\\ \\mathrm{m/s}',w=texWidth(e,52,false);
  s+=fade(seg(p,.6,.75),T(e,600,390,{size:52})+highlight(600-w/2-24,330,w+48,110,1)+label('（初めの 値のまま）',600+w/2+40,400,{size:24,color:C.dim}));
  return s;
 },
 [K+'xx']:(p)=>{
  let s=label('横（x 成分）',600,55,{size:28,color:C.x,anchor:'middle',weight:700});
  s+=T(cX('x')+'('+cT('t')+')-0=\\int_0^{'+cT('t')+'}4\\,ds=4'+cT('t'),600,160,{size:48});
  const e=cX('x')+'=4'+cT('t'),w=texWidth(e,58,false);
  s+=fade(seg(p,.4,.55),T(e,600,320,{size:58})+highlight(600-w/2-24,262,w+48,115,1));
  s+=fade(seg(p,.6,.75),label('等速',600,450,{size:34,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'yv']:(p)=>{
  let s=label('縦（y 成分）',600,55,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=T('\\dfrac{d'+cV('v_y')+'}{d'+cT('t')+'}=-10',600,140,{size:46});
  s+=fade(seg(p,.25,.4),T(cV('v_y')+'('+cT('t')+')-5=\\int_0^{'+cT('t')+'}(-10)\\,ds=-10'+cT('t'),600,260,{size:44}));
  const e=cV('v_y')+'=5-10'+cT('t'),w=texWidth(e,52,false);
  s+=fade(seg(p,.6,.75),T(e,600,390,{size:52})+highlight(600-w/2-24,330,w+48,110,1));
  return s;
 },
 [K+'yy']:(p)=>{
  let s=label('縦（y 成分）',600,55,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=T('y('+cT('t')+')-0=\\int_0^{'+cT('t')+'}(5-10s)\\,ds',600,150,{size:46});
  s+=fade(seg(p,.2,.35),T('=5'+cT('t')+'-5'+cT('t')+'^2',600,260,{size:50}));
  s+=fade(seg(p,.55,.7),card(250,330,700,130,T('\\tfrac12 g=\\tfrac12\\times10=5',600,400,{size:44})+label('−½gt² → −5t²',600,445,{size:24,color:C.dim,anchor:'middle'})));
  return s;
 },
 [K+'combine']:(p)=>{
  const e=cX(bR)+'=(4'+cT('t')+',\\;5'+cT('t')+'-5'+cT('t')+'^2)\\ \\mathrm{m}',w=texWidth(e,58,false);
  let s=T(e,600,140,{size:58})+highlight(600-w/2-24,80,w+48,110,1);
  s+=fade(seg(p,.35,.5),card(150,260,900,180,label('ベクトル・上級：この式を 微分 → 𝐚 ＝ (0, −10)',600,320,{size:28,color:C.dim,anchor:'middle'})
   +label('今回：力 → 積分 → 同じ 式に 戻った',600,390,{size:32,color:ok,anchor:'middle',weight:700})));
  return s;
 },
 // ===== S4 合わせると放物線 =====
 [K+'film']:(p)=>{
  let s=pbase({path:0});
  const ts=tq(10),u=seg(p,.05,.9);
  ts.forEach((t,i)=>{if(i/10>u+1e-6)return;const q=pr(t);
   s+=dot(PX(q[0]),PJ.y0,7,C.x)+dot(PJ.x0,PY(q[1]),7,C.ink);});
  s+=fade(seg(p,.3,.45),label('横：0.4 m ずつ 等間隔',PX(2),PJ.y0-24,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('縦：上って 下りる',PJ.x0+20,PY(1.65),{size:24,color:C.ink,weight:700}));
  s+=card(720,120,440,250,label('0.1 秒ごと',940,175,{size:28,color:C.t,anchor:'middle',weight:700})
   +T(cX('x')+'=4'+cT('t'),940,250,{size:40})+T('y=5'+cT('t')+'-5'+cT('t')+'^2',940,320,{size:40}),seg(p,.02,.12));
  return s;
 },
 [K+'film2']:(p)=>{
  let s=pbase({path:seg(p,.5,.8)});
  const ts=tq(10),u=seg(p,.05,.5);
  ts.forEach((t,i)=>{const q=pr(t);
   s+=dot(PX(q[0]),PJ.y0,6,C.x)+dot(PJ.x0,PY(q[1]),6,C.ink);
   if(i/10<=u+1e-6)s+=line(PX(q[0]),PJ.y0,PX(q[0]),PY(q[1]),{color:C.faint,w:1.5,dash:'4 5'})+line(PJ.x0,PY(q[1]),PX(q[0]),PY(q[1]),{color:C.faint,w:1.5,dash:'4 5'})+dot(PX(q[0]),PY(q[1]),7,C.t);});
  s+=card(720,140,440,210,label('横 と 縦 を 重ねる',940,200,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('同じ 時刻 t で つながる',940,270,{size:28,color:C.t,anchor:'middle'}),seg(p,.02,.12));
  return s;
 },
 [K+'top']:(p)=>{
  let s=pbase()+ball(0.5)+vel(0.5,seg(p,.1,.25));
  s+=fade(seg(p,.5,.65),line(PX(2),PY(1.25),PX(2),PJ.y0,{color:C.x,w:2,dash:'5 5'})+label('1.25 m',PX(2)+12,PY(0.62),{size:24,color:C.hi,weight:700}));
  s+=card(690,90,470,320,label('最高点：縦の 速度 ＝ 0',925,140,{size:26,color:C.dim,anchor:'middle'})
   +T('5-10'+cT('t')+'=0',925,210,{size:42})
   +fade(seg(p,.25,.4),T(cT('t')+'=0.5\\ \\mathrm{s}',925,280,{size:42}))
   +fade(seg(p,.5,.65),T('y=2.5-1.25=1.25\\ \\mathrm{m}',925,355,{size:38})),seg(p,.02,.12));
  return s;
 },
 [K+'land']:(p)=>{
  let s=pbase()+ball(1,seg(p,.3,.45));
  s+=card(690,90,470,320,label('着地：y ＝ 0',925,140,{size:26,color:C.dim,anchor:'middle'})
   +T('5'+cT('t')+'(1-'+cT('t')+')=0',925,215,{size:42})
   +fade(seg(p,.3,.45),T(cT('t')+'=1\\ \\mathrm{s}',925,290,{size:42}))
   +fade(seg(p,.55,.7),T(cX('x')+'=4\\times1=4\\ \\mathrm{m}',925,360,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'elim']:(p)=>{
  let s=label('道の 形 ＝ x と y の 関係',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=T(cX('x')+'=4'+cT('t'),600,180,{size:52});
  s+=fade(seg(p,.35,.5),label('両辺 ÷ 4',600,260,{size:28,color:C.hi,anchor:'middle',weight:700}));
  const e=cT('t')+'=\\dfrac{'+cX('x')+'}{4}',w=texWidth(e,56,false);
  s+=fade(seg(p,.5,.65),T(e,600,380,{size:56})+highlight(600-w/2-24,300,w+48,150,1));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T('y=5\\Big(\\dfrac{'+cX('x')+'}{4}\\Big)-5\\Big(\\dfrac{'+cX('x')+'}{4}\\Big)^2',600,110,{size:46});
  const e='y=\\dfrac54'+cX('x')+'-\\dfrac{5}{16}'+cX('x')+'^2',w=texWidth(e,52,false);
  s+=fade(seg(p,.3,.45),T(e,600,290,{size:52})+highlight(600-w/2-24,210,w+48,160,1));
  s+=fade(seg(p,.6,.75),label('x の 2次式 → 放物線',600,450,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chk']:(p)=>{
  let s=pbase();
  s+=fade(seg(p,.05,.2),dot(PX(2),PY(1.25),9,C.hi)+label('(2, 1.25)',PX(2),PY(1.25)-20,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),dot(PX(4),PY(0),9,C.hi)+label('(4, 0)',PX(4),PY(0)-20,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=card(690,90,470,320,T('y=\\tfrac54'+cX('x')+'-\\tfrac{5}{16}'+cX('x')+'^2',925,150,{size:38})
   +fade(seg(p,.05,.2),label('x ＝ 2：2.5 − 1.25 ＝ 1.25 ✓',925,240,{size:28,color:C.ink,anchor:'middle'})+label('最高点',925,285,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.5,.65),label('x ＝ 4：5 − 5 ＝ 0 ✓',925,345,{size:28,color:C.ink,anchor:'middle'})+label('着地点',925,385,{size:24,color:C.dim,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 // ===== S5 解を確かめる =====
 [K+'why']:(p)=>{
  let s=card(200,80,800,150,label('積分で 出した 式は 正しい？',600,170,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.4,.55),label('① 元の 方程式',400,320,{size:30,color:C.ink,anchor:'middle',weight:700})+label('② 初期条件',800,320,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('に 代入して 確かめる',600,400,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'d2']:(p)=>{
  let s=T('y=5'+cT('t')+'-5'+cT('t')+'^2',600,80,{size:48});
  s+=fade(seg(p,.15,.3),T('\\dfrac{dy}{d'+cT('t')+'}=5-10'+cT('t'),600,190,{size:46}));
  s+=fade(seg(p,.4,.55),T(d2('y')+'=-10',600,320,{size:48}));
  s+=fade(seg(p,.6,.75),label('＝ −g ✓ 元の 方程式',600,440,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'t0']:(p)=>{
  const rows=[['元の 方程式','d²y/dt² ＝ −10','d²x/dt² ＝ 0'],['初めの 位置','y(0) ＝ 0','x(0) ＝ 0'],['初めの 速度','dy/dt ＝ 5','dx/dt ＝ 4']];
  let s=label('縦 y ＝ 5t − 5t²',640,60,{size:26,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.6,.7),label('横 x ＝ 4t',960,60,{size:26,color:C.x,anchor:'middle',weight:700}));
  rows.forEach(([a,b,c],i)=>{const y=90+i*120;s+=card(120,y,960,100,label(a,160,y+60,{size:28,color:C.dim})+label(b+' ✓',640,y+60,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.6,.75),label(c+' ✓',960,y+60,{size:30,color:C.x,anchor:'middle'})),i===0?1:seg(p,.1+i*.15,.2+i*.15));});
  return s;
 },
 [K+'three']:(p)=>{
    let s=pbase();
  s+=fade(seg(p,.25,.45),draw(Array.from({length:81},(_,i)=>{const t=i/80*1.075;return [PX(4*t),PY(5*t-5*t*t+1)];}),1,{color:bad,w:3,dash:'8 6'})+label('y ＝ 5t − 5t² ＋ 1',PX(3.3),PY(2.35),{size:24,color:bad,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),dot(PX(0),PY(1),8,bad));
  s+=card(720,110,440,280,label('方程式は 満たす',940,170,{size:28,color:C.ink,anchor:'middle'})
   +label('初めの 位置が 違う',940,240,{size:28,color:bad,anchor:'middle',weight:700})
   +label('→ 別の 運動',940,310,{size:30,color:bad,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'gen']:(p)=>{
  let s=T('y=y_0+v_0'+cT('t')+'-\\tfrac12 g'+cT('t')+'^2',600,80,{size:48});
  s+=fade(seg(p,.15,.3),T(d2('y')+'=-g',480,230,{size:44})+label('✓',620,240,{size:36,color:ok,weight:700}));
  s+=fade(seg(p,.4,.55),label('t ＝ 0：y ＝ y₀、dy/dt ＝ v₀ ✓',600,380,{size:34,color:C.ink,anchor:'middle'}));
  return s;
 },
 // ===== S6 力が変わったら =====
 [K+'recipe']:(p)=>{
  const st=[['①','力を 全部 書く'],['②','ma＝F に 入れ','成分に 分ける'],['③','初期条件を 付けて','積分する'],['✓','代入で 確かめる']];
  let s='';
  st.forEach(([n,a,b],i)=>{const x=30+i*295;s+=card(x,140,265,170,label(n,x+132,190,{size:30,color:i===3?ok:C.hi,anchor:'middle',weight:700})+label(a,x+132,240,{size:24,color:C.ink,anchor:'middle',weight:700})+(b?label(b,x+132,280,{size:24,color:C.ink,anchor:'middle',weight:700}):''),seg(p,.05+i*.18,.15+i*.18),i===3?ok:C.faint);
   if(i<3)s+=fade(seg(p,.12+i*.18,.2+i*.18),arrow(x+267,225,x+293,225,{color:C.hi,w:3,head:10}));});
  return s;
 },
 [K+'one']:(p)=>{
  const items=['落下','振動','惑星の 軌道'];
  let s=card(300,60,600,110,label('法則は ma ＝ F の 1本',600,128,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.12));
  items.forEach((t,i)=>{const x=150+i*320;s+=card(x,220,260,90,label(t,x+130,275,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.15+i*.1,.25+i*.1));});
  s+=fade(seg(p,.55,.7),label('変わるのは 力 と ③ の 難しさ',600,420,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'drag']:(p)=>{
  let s=pbase({path:.4})+ball(0.3);
  const q=pr(0.3),X=PX(q[0]),Y=PY(q[1]),vx=4,vy=2;
  s+=arrow(X,Y,X+VS*vx,Y-VS*vy,{color:C.v,w:4,head:14})+label('𝐯',X+VS*vx+8,Y-VS*vy-6,{size:28,color:C.v,weight:700});
  s+=fade(seg(p,.2,.35),arrow(X,Y,X-VS*vx*0.8,Y+VS*vy*0.8,{color:bad,w:5,head:14})+label('−k𝐯',X-40,Y-16,{size:26,color:bad,anchor:'end',weight:700}));
  s+=card(690,110,470,280,label('仮定：抵抗は 速度に 比例',925,170,{size:28,color:C.t,anchor:'middle',weight:700})
   +T('-k'+cV(bV),925,245,{size:48})
   +fade(seg(p,.5,.65),label('k：抵抗の 係数（kg/s）',925,330,{size:26,color:C.ink,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'dragy']:(p)=>{
  let s=label('縦の 速度を v とする（上向き 正）',600,70,{size:28,color:C.dim,anchor:'middle'});
  const e='m\\dfrac{d'+cV('v')+'}{d'+cT('t')+'}=-m g'+cR('\\;-\\;k'+cV('v')),w=texWidth(e,58,false);
  s+=fade(seg(p,.15,.3),T(e,600,240,{size:58})+highlight(600-w/2-24,160,w+48,160,1));
  s+=fade(seg(p,.5,.65),label('重力',470,380,{size:28,color:ok,anchor:'middle'})+label('抵抗',760,380,{size:28,color:bad,anchor:'middle'}));
  return s;
 },
 [K+'sign']:(p)=>{
  const one=(cx,up,g)=>{const y=270;let s=dot(cx,y,14,C.ink);
   s+=arrow(cx,y,cx,y+(up?-110:110),{color:C.v,w:5,head:16})+label(up?'v ＞ 0':'v ＜ 0',cx+24,y+(up?-80:90),{size:26,color:C.v,weight:700});
   s+=arrow(cx,y,cx,y+(up?60:-60),{color:bad,w:5,head:14})+label(up?'抵抗 下向き':'抵抗 上向き',cx-24,y+(up?62:-50),{size:24,color:bad,anchor:'end',weight:700});
   return fade(g,s);};
  let s=label('上り',330,90,{size:30,color:C.ink,anchor:'middle',weight:700})+one(330,true,seg(p,.02,.15));
  s+=fade(seg(p,.3,.45),label('下り',870,90,{size:30,color:C.ink,anchor:'middle',weight:700}))+one(870,false,seg(p,.3,.45));
  s+=fade(seg(p,.65,.8),label('−kv の 符号が 両方を 表す',600,470,{size:30,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notconst']:(p)=>{
  let s=T(cA('a')+'=-g-\\dfrac{k}{m}'+cV('v'),600,90,{size:48})+label('k/m ＝ 1 /s',950,100,{size:26,color:C.dim});
  s+=card(120,190,440,220,label('投げた 瞬間（v ＝ 5）',340,245,{size:26,color:C.dim,anchor:'middle'})+T('-10-1\\times5=-15',340,325,{size:40})+label('m/s²',340,385,{size:24,color:C.dim,anchor:'middle'}),seg(p,.2,.35));
  s+=card(640,190,440,220,label('最高点（v ＝ 0）',860,245,{size:26,color:C.dim,anchor:'middle'})+T('-10-1\\times0=-10',860,325,{size:40})+label('m/s²',860,385,{size:24,color:C.dim,anchor:'middle'}),seg(p,.45,.6));
  s+=fade(seg(p,.7,.85),label('加速度が 一定でない',600,470,{size:30,color:bad,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cannot']:(p)=>{
  let s=card(150,60,900,150,label('中級の 手順：a を 定数として 積分の 外へ',600,120,{size:28,color:C.ink,anchor:'middle'})+T('\\int a\\,d'+cT('t')+'=a'+cT('t'),600,175,{size:34}),1);
  s+=fade(seg(p,.15,.3),line(170,200,1030,70,{color:bad,w:5})+label('使えない',600,260,{size:34,color:bad,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),card(150,300,900,140,label('横の 速度も 抵抗で 減る',600,360,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 等速ではない',600,410,{size:28,color:bad,anchor:'middle'})));
  return s;
 },
 [K+'model']:(p)=>{
  const st=['力の モデル','方程式','初期条件','解','確かめ'];
  let s='';
  st.forEach((t,i)=>{const x=50+i*226;s+=card(x,150,200,100,label(t,x+100,210,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.02+i*.08,.1+i*.08));
   if(i<4)s+=fade(seg(p,.08+i*.08,.14+i*.08),arrow(x+202,200,x+224,200,{color:C.hi,w:3,head:10}));});
  s+=fade(seg(p,.5,.65),label('順番は 同じ',600,340,{size:34,color:ok,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('変わるのは 解き方',600,420,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=pbase();
  s+=card(690,70,470,370,label('重力だけ',925,115,{size:26,color:C.dim,anchor:'middle'})
   +label('成分の 式は 独立',925,170,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),T(cX('x')+'=4'+cT('t'),925,240,{size:40})+T('y=5'+cT('t')+'-5'+cT('t')+'^2',925,305,{size:40}))
   +fade(seg(p,.55,.7),label('積分で 導き、代入で 確かめた',925,385,{size:26,color:ok,anchor:'middle',weight:700})),seg(p,.02,.12),ok);
  return s;
 },
 [K+'next1']:(p)=>{
  let s=label('抵抗 ∝ 速度',600,80,{size:34,color:bad,anchor:'middle',weight:700});
  s+=T(cA('a')+'=-g-\\dfrac{k}{m}'+cV('v'),600,210,{size:52});
  s+=fade(seg(p,.4,.55),label('加速度は 一定でない',600,400,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  // terminal-velocity approach curve (drawn as a sketch, no numbers)
  const X0=90,Y0=430,W=520,Hh=300,f=u=>1-Math.exp(-3*u);
  let s=arrow(X0-10,Y0,X0+W+30,Y0,{color:C.dim,w:2.5,head:13})+arrow(X0,Y0+10,X0,Y0-Hh-30,{color:C.dim,w:2.5,head:13})
   +label('t',X0+W+40,Y0+8,{size:26,color:C.t})+label('v',X0,Y0-Hh-44,{size:26,color:C.v,anchor:'middle'});
  s+=line(X0,Y0-Hh,X0+W,Y0-Hh,{color:C.hi,w:2,dash:'8 6'})+label('終端速度',X0+W,Y0-Hh-14,{size:24,color:C.hi,anchor:'end',weight:700});
  s+=draw(Array.from({length:81},(_,i)=>{const u=i/80;return [X0+W*u,Y0-Hh*f(u)];}),seg(p,.05,.5),{color:C.v,w:4});
  const u0=0.25;s+=fade(seg(p,.35,.5),line(X0+W*u0,Y0-Hh*f(u0),X0+W*u0,Y0-Hh,{color:bad,w:4})+label('差 w',X0+W*u0+12,Y0-Hh*(1+f(u0))/2+8,{size:26,color:bad,weight:700}));
  s+=label('落下の 速さ（下向きを 正）',X0+W/2,Y0+44,{size:22,color:C.dim,anchor:'middle'});
  s+=card(690,90,470,320,label('中級：差 w の 式まで',925,150,{size:28,color:C.dim,anchor:'middle'})
   +label('初期条件 付きで',925,230,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('最後まで 積分すると？',925,300,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.3),C.hi);
  return s;
 },
};
