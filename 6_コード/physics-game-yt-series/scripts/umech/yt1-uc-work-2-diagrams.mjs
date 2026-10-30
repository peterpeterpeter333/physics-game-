// YouTube シリーズ 仕事・上級 2/3（ステージ uc-work 本6・本8・本9）— 図。Stage 1200×515.
// 色：力 F 緑、位置・移動 水色、速度 v 紫、加速度 a 赤、時刻 t 金、エネルギー・仕事（K・W）橙、強調 黄。
// 補助線①：速度を x・y・z の3本のレーンに分け、各レーンで d(vᵢ²)/dt＝2vᵢaᵢ、最後に足す。
// 補助線②：放物運動（uc-newton-1 と同じ）m＝0.2 kg、𝐯＝(4, 5−10t)、y＝5t−5t²。上り（𝐅·𝐯<0）を赤、下り（>0）を緑で塗る。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,poly,draw} from './anim.mjs';

const K='uc-work-2:';
const CE=C.E,CH=C.hi,CX=C.x,CV=C.v,CF=C.F,CT=C.t,CA=C.a,UP='#ff8f9b',DN='#83ecc0';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const cE=s=>cs(CE,s),cH=s=>cs(CH,s),cV=s=>cs(CV,s),cA=s=>cs(CA,s),cF=s=>cs(CF,s);
const T=(s,x,y,size=44,o={})=>tex(s,x,y,{size,...o});
const TF=(s,x,y,maxW,size=44,o={})=>{const w=texWidth(s,size);return T(s,x,y,w>maxW?size*maxW/w:size,o);};
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:36,color:C.F,weight:700}));
const bv='\\mathbf{v}',ba='\\mathbf{a}',bF='\\mathbf{F}',br='\\mathbf{r}';
const Kv=cE('K'),Wv=cE('W'),halfE=cE('\\tfrac{1}{2}m');
const vv=`${bv}\\cdot${bv}`;

// ---- 3次元の道と速度 ----
function curve3(g=1,p=1,vArrow=1){
 const cx=250,cy=330;
 let s=fade(g,arrow(cx,cy,cx+230,cy+60,{color:C.dim,w:2,head:10})+arrow(cx,cy,cx,cy-230,{color:C.dim,w:2,head:10})+arrow(cx,cy,cx-150,cy+130,{color:C.dim,w:2,head:10})
  +label('x',cx+240,cy+80,{size:24,color:C.dim})+label('y',cx-170,cy+150,{size:24,color:C.dim})+label('z',cx+10,cy-235,{size:24,color:C.dim}));
 const sp=Array.from({length:61},(_,i)=>{const u=i/60*Math.PI*2.2;return [cx-20+90*Math.cos(u)+25*u,cy+35*Math.sin(u)-28*u];});
 s+=fade(g,draw(sp,p,{color:C.dim,w:4}));
 const q=sp[40],q2=sp[41],d=[q2[0]-q[0],q2[1]-q[1]],n=Math.hypot(d[0],d[1]);
 s+=fade(vArrow*g,arrow(q[0],q[1],q[0]+130*d[0]/n,q[1]+130*d[1]/n,{color:CV,w:6,head:18})+label('𝐯',q[0]+130*d[0]/n+12,q[1]+130*d[1]/n,{size:30,color:CV,weight:700}));
 return s;
}

// ---- 3本のレーン ----
const LY=[140,250,360],LN=['x','y','z'];
function lanes(p,{g=1,hl=-1,res=[0,0,0],acc=[0,0,0],sq=1}={}){
 let s='';
 for(let i=0;i<3;i++){
  const y=LY[i],on=hl===i;
  s+=fade(g,rect(40,y-48,1120,96,{fill:on?CH:'#131f38',fo:on?.08:.9,stroke:on?CH:C.faint,sw:on?2.5:1.5,rx:12})+label(`${LN[i]} のレーン`,70,y+9,{size:24,color:on?CH:C.dim}));
  s+=fade(g*sq,T(`${cV(`v_${LN[i]}`)}^2`,300,y+12,40));
  s+=fade(res[i],T(`\\dfrac{d}{dt}\\big(${cV(`v_${LN[i]}`)}^2\\big)=2\\,${cV(`v_${LN[i]}`)}\\,\\dfrac{d${cV(`v_${LN[i]}`)}}{dt}`,640,y+12,36));
  s+=fade(acc[i],T(`=2\\,${cV(`v_${LN[i]}`)}\\,${cA(`a_${LN[i]}`)}`,1000,y+12,40));
 }
 return s;
}

// ---- 放物運動 ----
const GT=(o={})=>axes({x:90,y:440,w:430,h:300,xmin:0,xmax:4.4,ymin:0,ymax:1.6,xticks:[1,2,3,4],yticks:[0.4,0.8,1.2],xlabel:'x [m]',ylabel:'y [m]',xcolor:CX,ycolor:CX,...o});
const traj=t=>[4*t,5*t-5*t*t];
function trajPath(G,{from=0,to=1,color=C.dim,w=4,p=1}={}){return draw(Array.from({length:61},(_,i)=>{const t=mix(from,to,i/60),q=traj(t);return [G.X(q[0]),G.Y(q[1])];}),p,{color,w});}
function ballAt(G,t,{v=1,F=1,scale=26,lab=''}={}){
 const q=traj(t),X=G.X(q[0]),Y=G.Y(q[1]),vx=4,vy=5-10*t;
 let s='';
 const kx=G.X(1)-G.X(0),ky=G.Y(0)-G.Y(1),f=scale/250;if(v)s+=arrow(X,Y,X+vx*kx*f,Y-vy*ky*f,{color:CV,w:4,head:13});
 if(F)s+=arrow(X,Y,X,Y+60,{color:CF,w:4,head:12});
 s+=dot(X,Y,9,C.ink);
 if(lab)s+=label(lab,X,Y-18,{size:22,color:C.ink,anchor:'middle'});
 return s;
}

export const ytUcWork2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=curve3(1,seg(p,0,.3),seg(p,.2,.35));
  s+=card(620,110,540,280,L('前回の 最後の問い',890,160,{size:24,color:C.dim})
   +T(`\\dfrac{d}{dt}\\big(${vv}\\big)=\\;?`,890,265,58)
   +fade(seg(p,.4,.55),L('3次元の 曲がった道で',890,355,{size:28,color:CH,weight:700})),seg(p,.05,.2),CH);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=card(80,50,1040,180,L('前回：1本の 軸',600,95,{size:24,color:C.dim})+T(`m\\dfrac{dv}{dt}=F\\ \\ \\xrightarrow{\\ \\times v\\ }\\ \\ \\dfrac{d}{dt}\\Big(${halfE}v^2\\Big)=F\\,v`,600,175,42),seg(p,0,.15),CE);
  s+=card(80,270,1040,170,L('仕事を 時間で',600,315,{size:24,color:C.dim})+T(`${Wv}=\\int ${bF}\\cdot${bv}\\,dt`,600,395,48),seg(p,.5,.65),CH);
  return s;
 },
 [K+'goal']:(p)=>{
  let s=curve3(1,1,1);
  s+=card(620,90,540,320,L('中級の 約束',890,140,{size:24,color:C.dim})
   +L('曲がった道でも',890,205,{size:30})+T(`${Wv}=\\Delta ${Kv}`,890,280,56)
   +fade(seg(p,.4,.6),L('ベクトルの まま 示す',890,365,{size:30,color:CH,weight:700})),seg(p,.02,.15),CH);
  return s;
 },
 [K+'vv']:(p)=>{
  const cx=170,cy=330;
  let s=arrow(cx,cy,cx+300,cy-150,{color:CV,w:6,head:18})+label('𝐯',cx+310,cy-160,{size:32,color:CV,weight:700});
  s+=fade(seg(p,.05,.2),label('長さ ＝ 速さ v',cx+120,cy+40,{size:26,color:CV,weight:700}));
  s+=fade(seg(p,.35,.5),label('自分自身との 角 ＝ 0',cx+130,cy+90,{size:24,color:C.dim}));
  s+=card(620,90,540,330,fade(seg(p,.35,.5),T(`${vv}=v\\times v\\times\\cos 0`,890,190,44))
   +fade(seg(p,.6,.75),T('=v^2',890,290,56))+fade(seg(p,.7,.85),L('（内積の 定義）',890,370,{size:24,color:C.dim})),seg(p,.3,.45));
  return s;
 },

 // ===== S2 成分ごとに微分する =====
 [K+'lanes']:(p)=>{
  let s=lanes(p,{g:seg(p,0,.3)});
  s+=fade(seg(p,.35,.55),T(`${vv}=${cV('v_x')}^2+${cV('v_y')}^2+${cV('v_z')}^2`,600,480,40));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=lanes(p,{g:.35});
  s+=card(250,150,700,230,T(`\\dfrac{d}{dt}\\big(${vv}\\big)=\\;?`,600,250,58)+fade(seg(p,.3,.5),L('予想してみよう',600,345,{size:28,color:CH,weight:700})),seg(p,.02,.15),CH);
  return s;
 },
 [K+'laneX']:(p)=>{
  let s=lanes(p,{hl:0,res:[seg(p,.3,.5),0,0]});
  s+=fade(seg(p,.05,.2),L('前回の 1本の軸と 同じ（連鎖律）',600,480,{size:26,color:CH}));
  return s;
 },
 [K+'laneX2']:(p)=>{
  let s=lanes(p,{hl:0,res:[1,0,0],acc:[seg(p,.2,.4),0,0]});
  s+=fade(seg(p,.05,.2),T(`\\dfrac{d${cV('v_x')}}{dt}=${cA('a_x')}`,300,480,34));
  s+=fade(seg(p,.45,.6),L('矢印の 微分 ＝ 成分ごとの 微分（座標軸は 固定）',780,488,{size:24,color:C.dim}));
  return s;
 },
 [K+'laneYZ']:(p)=>{
  let s=lanes(p,{res:[1,seg(p,.0,.15),seg(p,.1,.25)],acc:[1,seg(p,.1,.25),seg(p,.2,.35)]});
  s+=fade(seg(p,.4,.6),T(`\\dfrac{d}{dt}\\big(${vv}\\big)=2\\,(${cV('v_x')}${cA('a_x')}+${cV('v_y')}${cA('a_y')}+${cV('v_z')}${cA('a_z')})`,600,480,38));
  return s;
 },
 [K+'dot']:(p)=>{
  let s=T(`2\\,(${cV('v_x')}${cA('a_x')}+${cV('v_y')}${cA('a_y')}+${cV('v_z')}${cA('a_z')})`,600,110,48);
  s+=fade(seg(p,.05,.25),brace(390,830,170,{text:'成分ごとの 積の 和 ＝ 内積',size:28,color:CH}));
  const f=`\\dfrac{d}{dt}\\big(${vv}\\big)=2\\,${bv}\\cdot${ba}`,w=texWidth(f,68);
  s+=fade(seg(p,.5,.7),highlight(600-w/2-30,280,w+60,165,1,CH))+fade(seg(p,.4,.6),T(f,600,370,68));
  return s;
 },
 [K+'prod']:(p)=>{
  let s=L('数の 積の 微分：(fg)′ ＝ f′g ＋ fg′',600,70,{size:28,color:C.dim});
  s+=fade(seg(p,.1,.3),T(`\\big(${vv}\\big)'=${bv}'\\cdot${bv}+${bv}\\cdot${bv}'`,600,200,54));
  s+=fade(seg(p,.5,.65),T(`=${ba}\\cdot${bv}+${bv}\\cdot${ba}`,600,310,54));
  s+=fade(seg(p,.7,.85),T(`=2\\,${bv}\\cdot${ba}`,600,420,54));
  s+=fade(seg(p,.5,.65),label('𝐯′ ＝ 𝐚',1040,205,{size:28,color:CA,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chk']:(p)=>{
  let s=card(60,40,1080,120,T(`${bv}=(4,\\;5-10t)\\ \\mathrm{m/s},\\qquad ${ba}=(0,\\;-10)\\ \\mathrm{m/s^2}`,600,108,40),seg(p,0,.15));
  s+=fade(seg(p,.45,.65),T(`${vv}=4^2+(5-10t)^2=16+(5-10t)^2`,600,300,46));
  return s;
 },
 [K+'chk2']:(p)=>{
  let s=card(60,40,1080,120,T(`${bv}=(4,\\;5-10t)\\ \\mathrm{m/s},\\qquad ${ba}=(0,\\;-10)\\ \\mathrm{m/s^2}`,600,108,40),1);
  s+=T(`\\dfrac{d}{dt}\\big(${vv}\\big)=2(5-10t)\\times(-10)`,600,250,42);
  s+=fade(seg(p,.4,.6),T(`2\\,${bv}\\cdot${ba}=2\\,\\{4\\times0+(5-10t)\\times(-10)\\}`,600,370,42));
  s+=fade(seg(p,.7,.85),L('同じ',1080,470,{size:30,color:CF,weight:700})+ok(1130,472));
  s+=fade(seg(p,.7,.85),L('t ＝ 0 では どちらも −100',600,470,{size:26,color:C.dim}));
  return s;
 },

 // ===== S3 dK/dt＝F·v から ΔK＝W へ =====
 [K+'K']:(p)=>{
  let s=T(`${Kv}=${halfE}\\,${vv}`,600,170,72);
  s+=fade(seg(p,.4,.6),T(`=${halfE}v^2`,600,320,56)+L('（定義：前回の ½mv² と 同じ）',600,420,{size:26,color:C.dim}));
  return s;
 },
 [K+'dK']:(p)=>{
  const cx=seg(p,.4,.55),f0=`\\dfrac{d${Kv}}{dt}=${halfE}\\times 2\\,${bv}\\cdot${ba}`,f1=`\\dfrac{d${Kv}}{dt}=${cH('\\cancel{\\tfrac{1}{2}}')}${cE('m')}\\times ${cH('\\cancel{2}')}\\,${bv}\\cdot${ba}`;
  let s=fade(1-cx,T(f0,600,140,56))+fade(cx,T(f1,600,140,56));
  s+=fade(seg(p,.05,.2),L('m は 一定',1060,60,{size:24,color:C.dim}));
  s+=fade(seg(p,.55,.75),T(`=m\\,${ba}\\cdot${bv}`,600,330,64));
  return s;
 },
 [K+'dK2']:(p)=>{
  let s=T(`\\dfrac{d${Kv}}{dt}=m\\,${ba}\\cdot${bv}`,600,110,52,{color:C.dim});
  s+=fade(seg(p,.05,.25),L(`m𝐚 ＝ 𝐅 を 入れる`,960,120,{size:28,color:CF,weight:700}));
  const f=`\\dfrac{d${Kv}}{dt}=${bF}\\cdot${bv}`,w=texWidth(f,80);
  s+=fade(seg(p,.4,.55),highlight(600-w/2-30,225,w+60,190,1,CH))+fade(seg(p,.25,.45),T(f,600,330,80));
  s+=fade(seg(p,.6,.8),L('𝐅：はたらく力 すべての 合力',600,470,{size:26,color:CF}));
  return s;
 },
 [K+'along']:(p)=>{
  const ox=230,oy=330,vd=[0.9,-0.44],fd=[0.85,0.53];
  let s=arrow(ox,oy,ox+vd[0]*260,oy+vd[1]*260,{color:CV,w:6,head:18})+label('𝐯',ox+vd[0]*260+10,oy+vd[1]*260-6,{size:30,color:CV,weight:700});
  s+=arrow(ox,oy,ox+fd[0]*150,oy+fd[1]*150,{color:CF,w:6,head:18})+label('𝐅',ox+fd[0]*150+14,oy+fd[1]*150,{size:30,color:CF,weight:700});
  const c=fd[0]*vd[0]+fd[1]*vd[1],P=[ox+vd[0]*150*c,oy+vd[1]*150*c];
  s+=fade(seg(p,.4,.6),line(ox+fd[0]*150,oy+fd[1]*150,P[0],P[1],{color:C.dim,w:2,dash:'5 5'})+line(ox,oy,P[0],P[1],{color:CH,w:9})
   +label('𝐯 の向きの 成分',P[0]-40,P[1]-30,{size:24,color:CH,weight:700,anchor:'middle'}));
  s+=line(ox-vd[0]*80,oy-vd[1]*80,ox,oy,{color:C.faint,w:2,dash:'4 6'});
  s+=card(640,90,520,330,L('1本の 軸',900,140,{size:24,color:C.dim})+T('F\\,v',900,200,44)
   +L('↓',900,250,{size:28,color:C.dim})+T(`${bF}\\cdot${bv}`,900,310,52)
   +fade(seg(p,.5,.7),L('沿う 成分だけが K を 変える',900,385,{size:26,color:CH,weight:700})),seg(p,0,.2));
  return s;
 },
 [K+'num']:(p)=>{
  const G=GT();let s=G.svg+trajPath(G,{p:seg(p,0,.3)})+fade(seg(p,.1,.3),ballAt(G,0,{scale:30}));
  s+=fade(seg(p,.1,.3),label('𝐯 ＝ (4, 5)',G.X(0)+70,G.Y(0)-110,{size:24,color:CV,weight:700}));
  s+=card(640,70,520,370,L('0.2 kg のボール、投げた 瞬間',900,120,{size:24,color:C.dim})
   +fade(seg(p,.2,.35),T(`${bF}=(0,\\;-2)\\ \\mathrm{N}`,900,175,36))+fade(seg(p,.3,.5),T(`${bF}\\cdot${bv}=0\\times4+(-2)\\times5`,900,240,36))
   +fade(seg(p,.5,.65),T(`=-10\\ \\mathrm{J/s}`,900,310,44))
   +fade(seg(p,.7,.85),L('K は 毎秒 10 J の 割合で 減り始める',900,370,{size:24,color:CE,weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'integ']:(p)=>{
  let s=T(`\\dfrac{d${Kv}}{dt}=${bF}\\cdot${bv}`,600,120,60);
  s+=fade(seg(p,.2,.4),label('t₀ から t まで 積分',600,230,{size:28,color:CT,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),T(`\\int_{t_0}^{t}\\dfrac{d${Kv}}{ds}\\,ds=\\int_{t_0}^{t}${bF}\\cdot${bv}\\,ds`,600,360,52));
  s+=fade(seg(p,.65,.8),L('（積分の 変数を s と 書く）',600,470,{size:22,color:C.dim}));
  return s;
 },
 [K+'left']:(p)=>{
  let s=T(`\\int_{t_0}^{t}\\dfrac{d${Kv}}{ds}\\,ds=\\int_{t_0}^{t}${bF}\\cdot${bv}\\,ds`,600,100,46,{color:C.dim});
  s+=highlight(260,30,330,140,seg(p,.0,.2),CH);
  s+=fade(seg(p,.25,.45),T(`=${Kv}(t)-${Kv}(t_0)`,420,260,52));
  s+=card(250,340,700,110,L('傾きを 足し上げる → 元の量の 差',600,385,{size:28,color:CH,weight:700})+L('（積分の回）',600,428,{size:22,color:C.dim}),seg(p,.5,.65));
  return s;
 },
 [K+'right']:(p)=>{
  let s=T(`\\int_{t_0}^{t}\\dfrac{d${Kv}}{ds}\\,ds=\\int_{t_0}^{t}${bF}\\cdot${bv}\\,ds`,600,100,46,{color:C.dim});
  s+=highlight(640,30,320,140,seg(p,.0,.2),CH);
  s+=fade(seg(p,.2,.4),L('d𝐫 ＝ 𝐯 ds（前回）',800,230,{size:26,color:CX,weight:700}));
  s+=fade(seg(p,.4,.6),T(`=\\int_C ${bF}\\cdot d${br}=${Wv}`,800,340,52));
  s+=fade(seg(p,.65,.8),L('道 C に 沿った 仕事',800,450,{size:26,color:CE}));
  return s;
 },
 [K+'thm']:(p)=>{
  let s=T(`${Kv}(t)-${Kv}(t_0)=${Wv}`,600,140,64);
  const f=`\\Delta ${Kv}=${Wv}`,w=texWidth(f,84);
  s+=fade(seg(p,.1,.3),highlight(600-w/2-30,195,w+60,135,1,CH)+T(f,600,280,84));
  s+=fade(seg(p,.4,.6),L('運動エネルギー定理（導いた 結果）',600,400,{size:30,color:CH,weight:700}));
  s+=fade(seg(p,.6,.8),L('曲がった道・変わる力でも 成り立つ',600,460,{size:26,color:C.ink}));
  return s;
 },
 [K+'net']:(p)=>{
  let s=T(`\\Delta ${Kv}=${Wv}`,600,150,72)+L('W：合力の 仕事',600,240,{size:30,color:CE,weight:700});
  s+=card(200,280,800,150,L('一つの 力だけの 仕事 → 合わない',600,340,{size:30,color:CA,weight:700})
   +L('はたらく 力 すべてを 足した 合力の 仕事',600,395,{size:26}),seg(p,.3,.5),CA);
  return s;
 },

 // ===== S4 放物運動で確かめる =====
 [K+'ball']:(p)=>{
  const G=GT();let s=G.svg+trajPath(G,{p:seg(p,.1,.6)})+ballAt(G,0,{scale:30,F:0});
  s+=card(640,90,520,320,L('運動方程式・上級と 同じ 例',900,140,{size:24,color:C.dim})
   +T('m=0.2\\ \\mathrm{kg}',900,210,40)+T(`${bv}_0=(4,\\;5)\\ \\mathrm{m/s}`,900,285,40)
   +fade(seg(p,.6,.75),T('g=10\\ \\mathrm{m/s^2}',900,360,40)),seg(p,0,.15));
  return s;
 },
 [K+'K0']:(p)=>{
  const G=GT();let s=G.svg+trajPath(G)+ballAt(G,0,{scale:30,F:0,lab:''});
  s+=card(640,90,520,320,L('投げた 瞬間',900,140,{size:24,color:C.dim})
   +fade(seg(p,.1,.3),T(`${Kv}_0=\\tfrac12\\times0.2\\times(16+25)`,900,220,38))
   +fade(seg(p,.5,.7),T(`=${cE('4.1\\ \\mathrm{J}')}`,900,310,52)),1);
  return s;
 },
 [K+'top']:(p)=>{
  const G=GT();let s=G.svg+trajPath(G)+ballAt(G,0,{v:0,F:0})+fade(seg(p,0,.15),ballAt(G,0.5,{scale:30,F:0,lab:''}));
  s+=fade(seg(p,0,.15),label('最高点 t ＝ 0.5 s',G.X(2),G.Y(1.25)-24,{size:22,color:CT,anchor:'middle',weight:700}));
  s+=card(640,70,520,370,T(`${bv}=(4,\\;0)`,900,130,40)
   +fade(seg(p,.15,.35),T(`${Kv}=\\tfrac12\\times0.2\\times16=1.6\\ \\mathrm{J}`,900,215,36))
   +fade(seg(p,.5,.7),T(`\\Delta ${Kv}=1.6-4.1`,900,300,40))
   +fade(seg(p,.65,.8),T(`=${cE('-2.5\\ \\mathrm{J}')}`,900,380,48)),1);
  return s;
 },
 [K+'work']:(p)=>{
  const G=GT();let s=G.svg+trajPath(G,{from:0,to:.5,color:CE,w:5})+trajPath(G,{from:.5,to:1,color:C.faint})+ballAt(G,0,{v:0,F:0})+ballAt(G,.5,{v:0,F:1});
  s+=fade(seg(p,.1,.3),arrow(G.X(0),G.Y(0),G.X(2),G.Y(1.25),{color:CX,w:4,head:14})+label('Δ𝐫 ＝ (2, 1.25)',G.X(1)+10,G.Y(.62)+40,{size:22,color:CX,weight:700}));
  s+=card(640,70,520,370,L('重力は 一定 → 𝐅·Δ𝐫',900,120,{size:26,color:C.dim})
   +fade(seg(p,.25,.45),T(`${bF}\\cdot\\Delta${br}=0\\times2+(-2)\\times1.25`,900,205,34))
   +fade(seg(p,.5,.65),T(`=${cE('-2.5\\ \\mathrm{J}')}`,900,290,48))
   +fade(seg(p,.7,.85),T(`=\\Delta ${Kv}`,900,370,44)+ok(1040,378)),1);
  return s;
 },
 [K+'land']:(p)=>{
  const G=GT();let s=G.svg+trajPath(G,{p:1})+ballAt(G,0,{v:0,F:0})+ballAt(G,1,{scale:30,F:0});
  s+=fade(seg(p,0,.15),label('t ＝ 1 s',G.X(4)+14,G.Y(0)-60,{size:22,color:CT,anchor:'start',weight:700}));
  s+=card(640,70,520,370,T(`${bv}=(4,\\;-5)`,900,130,40)
   +fade(seg(p,.15,.35),T(`${Kv}=4.1\\ \\mathrm{J}`,900,215,40))
   +fade(seg(p,.5,.7),T(`\\Delta y=0\\ \\Rightarrow\\ ${Wv}=0`,900,300,40))
   +fade(seg(p,.7,.85),T(`\\Delta ${Kv}=0`,900,380,44)+ok(1040,388)),1);
  return s;
 },
 [K+'color']:(p)=>{
  const G=GT();let s=G.svg+trajPath(G,{from:0,to:.5,color:UP,w:7,p:seg(p,.05,.3)})+trajPath(G,{from:.5,to:1,color:DN,w:7,p:seg(p,.35,.6)});
  s+=fade(seg(p,.1,.3),ballAt(G,.2,{scale:28}))+fade(seg(p,.4,.6),ballAt(G,.8,{scale:28}));
  s+=card(640,90,520,320,fade(seg(p,.1,.3),L('上り：𝐅·𝐯 ＜ 0 → K が 減る',900,170,{size:28,color:UP,weight:700}))
   +fade(seg(p,.4,.6),L('下り：𝐅·𝐯 ＞ 0 → K が 増える',900,250,{size:28,color:DN,weight:700}))
   +fade(seg(p,.65,.8),L('最高点：𝐅 ⊥ 𝐯 で 𝐅·𝐯 ＝ 0',900,330,{size:26,color:C.dim})),seg(p,.05,.2));
  return s;
 },

 // ===== S5 新しい法則なのか =====
 [K+'newlaw']:(p)=>card(200,110,800,280,L('運動エネルギー定理',600,180,{size:30,color:C.dim})+T(`\\Delta ${Kv}=${Wv}`,600,265,64)+fade(seg(p,.3,.5),L('新しい 法則？',600,350,{size:34,color:CH,weight:700})),seg(p,0,.15),CH),
 [K+'no']:(p)=>{
  const xs=[170,450,750,1040];
  const items=[`m${ba}=${bF}`,`\\cdot\\,${bv}`,'\\int\\cdots dt',`\\Delta ${Kv}=${Wv}`];
  const lab=['原理（出発点）','内積を 取る','1回 積分','導いた 結果'];
  let s='';
  items.forEach((f,i)=>{const g=seg(p,.02+i*.1,.12+i*.1);s+=card(xs[i]-120,120,240,120,TF(f,xs[i],190,210,44),g,i===3?CE:i===0?CF:C.faint)+fade(g,L(lab[i],xs[i],275,{size:24,color:C.dim}));
   if(i<3)s+=fade(seg(p,.1+i*.1,.18+i*.1),arrow(xs[i]+123,180,xs[i+1]-125,180,{color:C.dim,w:3,head:12}));});
  s+=card(200,340,800,110,L('エネルギーで 解いても 運動方程式で 解いても',600,385,{size:26})+L('答えは 必ず 一致',600,428,{size:30,color:CF,weight:700}),seg(p,.55,.7),CF);
  return s;
 },
 [K+'e1']:(p)=>{
  const G=GT();let s=G.svg+trajPath(G)+fade(seg(p,0,.2),line(G.X(0),G.Y(.8),G.X(4.2),G.Y(.8),{color:CH,w:2.5,dash:'8 6'})+label('y ＝ 0.8 m',G.X(4.2),G.Y(.8)-12,{size:22,color:CH,anchor:'end',weight:700}));
  s+=card(640,70,520,370,L('エネルギーで 求める',900,120,{size:26,color:C.dim})
   +fade(seg(p,.2,.4),T(`${Wv}=-2\\times0.8=-1.6\\ \\mathrm{J}`,900,200,38))
   +fade(seg(p,.5,.7),T(`${Kv}=4.1-1.6=${cE('2.5\\ \\mathrm{J}')}`,900,290,40))
   +fade(seg(p,.7,.85),L('（ΔK ＝ W）',900,370,{size:24,color:C.dim})),1);
  return s;
 },
 [K+'e2']:(p)=>{
  const G=GT();let s=G.svg+trajPath(G)+line(G.X(0),G.Y(.8),G.X(4.2),G.Y(.8),{color:CH,w:2.5,dash:'8 6'})+label('y ＝ 0.8 m',G.X(4.2),G.Y(.8)-12,{size:22,color:CH,anchor:'end',weight:700});
  s+=card(640,70,520,370,T(`\\tfrac12\\times0.2\\times v^2=2.5`,900,140,40)
   +fade(seg(p,.25,.45),T('v^2=25',900,240,46))
   +fade(seg(p,.55,.75),T('v=5\\ \\mathrm{m/s}',900,340,52)),1);
  return s;
 },
 [K+'m1']:(p)=>{
  const G=GT();let s=G.svg+trajPath(G)+line(G.X(0),G.Y(.8),G.X(4.2),G.Y(.8),{color:CH,w:2.5,dash:'8 6'});
  s+=fade(seg(p,.3,.5),ballAt(G,.2,{scale:26,F:0,lab:'t＝0.2'})+ballAt(G,.8,{scale:26,F:0,lab:'t＝0.8'}));
  s+=card(640,70,520,370,L('運動方程式で 求める',900,115,{size:26,color:C.dim})
   +fade(seg(p,.05,.25),T('5t-5t^2=0.8',900,185,40))
   +fade(seg(p,.25,.4),T('t=0.2,\\ 0.8\\ \\mathrm{s}',900,255,40))
   +fade(seg(p,.45,.6),T(`${bv}=(4,\\,3),\\ (4,\\,-3)`,900,325,38))
   +fade(seg(p,.65,.8),T('\\sqrt{16+9}=5\\ \\mathrm{m/s}',900,400,40)+ok(1110,408)),1);
  return s;
 },
 [K+'short']:(p)=>{
  let s=card(80,70,500,360,L('エネルギーの 道',330,125,{size:30,color:CE,weight:700})+L('時刻を 飛ばす 近道',330,195,{size:26})+L('→ 速さ だけ',330,255,{size:26,color:CE})+L('（5 m/s）',330,315,{size:24,color:C.dim}),seg(p,0,.2),CE);
  s+=card(620,70,500,360,L('運動方程式の 道',870,125,{size:30,color:CF,weight:700})+L('全部の 時刻を 追う',870,195,{size:26})+L('→ 上りか 下りか、いつ 通るか',870,255,{size:24,color:CF})+L('（t ＝ 0.2 s と 0.8 s）',870,315,{size:24,color:C.dim}),seg(p,.4,.6),CF);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  const rows=[`\\dfrac{d}{dt}\\big(${vv}\\big)=2\\,${bv}\\cdot${ba}`,`\\dfrac{d${Kv}}{dt}=\\tfrac{m}{2}\\times2\\,${bv}\\cdot${ba}=${bF}\\cdot${bv}`];
  let s=card(80,50,1040,160,T(rows[0],600,140,48),seg(p,0,.15),CV);
  s+=card(80,250,1040,180,T(rows[1],600,350,48),seg(p,.4,.55),CF);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,50,1040,160,T(`\\dfrac{d${Kv}}{dt}=${bF}\\cdot${bv}`,600,140,48),1,CF);
  s+=card(80,250,1040,200,L('時間で 積分',600,295,{size:24,color:C.dim})+T(`\\Delta ${Kv}=${Wv}`,600,365,56)+fade(seg(p,.4,.6),L('運動方程式を 1回 積分した もの',600,425,{size:26,color:CH,weight:700})),seg(p,.05,.2),CE);
  return s;
 },
 [K+'next']:(p)=>{
  let s=T(`\\dfrac{d${Kv}}{dt}=${bF}\\cdot${bv}`,600,150,72);
  s+=fade(seg(p,.2,.4),brace(625,770,260,{text:'毎秒 流れ込む 仕事',size:30,color:CE}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(200,80,800,350,L('次の 問い',600,135,{size:26,color:C.dim})
   +L('仕事率 は 力と 速度から どう 決まる？',600,220,{size:32,color:CE,weight:700})
   +fade(seg(p,.4,.6),L('力が 速度と 直角 なら？',600,310,{size:32,color:CH,weight:700}))
   +fade(seg(p,.4,.6),T(`${bF}\\perp${bv}`,600,385,44)),seg(p,0,.15),CH);
  return s;
 },
};
