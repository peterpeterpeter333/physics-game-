// YouTube シリーズ 仕事・上級 1/3（ステージ uc-work 本5・本7）— 図。Stage 1200×515.
// 色：力 F 緑、位置 𝐫・d𝐫・x 水色、速度 v 紫、時刻 t 金、仕事・エネルギー（W・K・面積）橙、強調 黄、誤り 赤。
// 道の図：r(u) は画面上の曲線（数値の座標ではない）。一歩の数値は右のカードに出す（𝐯＝(3,4) m/s、Δt＝0.01 s、𝐅＝(0,−2) N）。
// 数値例：m＝2 kg、F＝4 N、静止から：v＝2t、K＝4t²、dK/dt＝Fv＝8t。t＝3 s：P＝24、三角形 36 J、K＝36 J、x＝9 m。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,poly,draw,ground,block} from './anim.mjs';

const K='uc-work-1:';
const CE=C.E,CH=C.hi,CX=C.x,CV=C.v,CF=C.F,CT=C.t;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const cE=s=>cs(CE,s),cH=s=>cs(CH,s);
const T=(s,x,y,size=44,o={})=>tex(s,x,y,{size,...o});
const TF=(s,x,y,maxW,size=44,o={})=>{const w=texWidth(s,size);return T(s,x,y,w>maxW?size*maxW/w:size,o);};
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:36,color:C.F,weight:700}));
const Wv=cE('W'),Kv=cE('K'),half='\\tfrac{1}{2}mv^2',halfE=cE('\\tfrac{1}{2}m')+'v'+cE('^2');
const bF='\\mathbf{F}',bv='\\mathbf{v}',br='\\mathbf{r}';

// ---- 曲がった道（画面座標の曲線） ----
const O=[70,480];
const curve=u=>[110+470*u,440-700*u+560*u*u];
const dcurve=u=>{const a=curve(u-1e-3),b=curve(u+1e-3);return [(b[0]-a[0])/2e-3,(b[1]-a[1])/2e-3];};
function pathLine(g=1,p=1,color=C.dim){return fade(g,draw(Array.from({length:81},(_,i)=>curve(i/80)),p,{color,w:4}));}
function ticks(g=1,n=8,labels=0){let s='';for(let i=0;i<=n;i++){const q=curve(i/n);s+=dot(q[0],q[1],6,CT);
  if(labels&&(i===0||i===n))s+=label(i===0?'t₀':'t₁',q[0]+(i===0?-14:14),q[1]+(i===0?8:30),{size:24,color:CT,anchor:i===0?'end':'start',weight:700});}
 return fade(g,s);}
function rvec(u,g=1,lab=''){const q=curve(u);return fade(g,arrow(O[0],O[1],q[0],q[1],{color:CX,w:4,head:15})+(lab?label(lab,(O[0]+q[0])/2-14,(O[1]+q[1])/2+4,{size:26,color:CX,weight:700,anchor:'end'}):''))+fade(g,dot(O[0],O[1],6,C.ink)+label('原点',O[0]-8,O[1]+30,{size:22,color:C.dim}));}
function vvec(u,g=1,len=150,lab='𝐯'){const q=curve(u),d=dcurve(u),n=Math.hypot(d[0],d[1]);return fade(g,arrow(q[0],q[1],q[0]+len*d[0]/n,q[1]+len*d[1]/n,{color:CV,w:5,head:16})+label(lab,q[0]+len*d[0]/n+10,q[1]+len*d[1]/n-6,{size:28,color:CV,weight:700}));}
function chord(u0,u1,g=1,lab='Δ𝐫'){const a=curve(u0),b=curve(u1);return fade(g,arrow(a[0],a[1],b[0],b[1],{color:CX,w:5,head:15})+(lab?label(lab,(a[0]+b[0])/2+10,(a[1]+b[1])/2+34,{size:26,color:CX,weight:700}):''));}
function fvec(u,g=1,len=90){const q=curve(u);return fade(g,arrow(q[0],q[1],q[0],q[1]+len,{color:CF,w:5,head:15})+label('𝐅',q[0]+12,q[1]+len-4,{size:28,color:CF,weight:700}));}

// ---- 1本の軸 ----
function axis1(g=1,{F=1,v=1,bx=330,text='m'}={}){
 let s=fade(g,ground(80,600,400)+arrow(80,450,600,450,{color:C.dim,w:2.5,head:12})+label('x（右向き ＋）',600,490,{size:22,color:C.dim,anchor:'end'}));
 s+=fade(g,block(bx,400,110,80,{color:CX,text,size:text.length>1?24:26}));
 s+=fade(F*g,arrow(bx-150,360,bx-58,360,{color:CF,w:6,head:16})+label('F',bx-170,370,{size:30,color:CF,weight:700,anchor:'end'}));
 s+=fade(v*g,arrow(bx+20,290,bx+130,290,{color:CV,w:5,head:16})+label('v',bx+142,300,{size:30,color:CV,weight:700}));
 return s;
}

// ---- P–t グラフ ----
const GP=(g=1)=>axes({x:90,y:450,w:470,h:350,xmin:0,xmax:3.6,ymin:0,ymax:30,xticks:[1,2,3],yticks:[8,16,24],grid:true,xlabel:'t [s]',ylabel:'Fv [J/s]',xcolor:CT,ycolor:CE,g});

// ---- 2本の道 ----
function roadmap(p,{g=1,mid=1,adv=1,warn=0}={}){
 let s='';
 const y1=150,y2=380,B=[[325,200],[600,300],[865,180]];
 s+=card(20,195,180,130,T('F=ma',110,270,44)+L('出発点',110,355,{size:22,color:C.dim}),g,CF);
 s+=card(1000,195,180,130,T(halfE,1090,268,46)+L('ゴール',1090,355,{size:22,color:C.dim}),g,CE);
 const box=(i,y,src,gg,stroke=C.ink)=>card(B[i][0]-B[i][1]/2,y-50,B[i][1],100,TF(src,B[i][0],y+10,B[i][1]-24,36),gg,stroke);
 const arrows=(y,gg,color,dy)=>fade(gg,arrow(200,260+dy,B[0][0]-B[0][1]/2-4,y+(dy<0?20:-20),{color,w:3,head:10})
  +arrow(B[0][0]+B[0][1]/2+2,y,B[1][0]-B[1][1]/2-4,y,{color,w:3,head:10})+arrow(B[1][0]+B[1][1]/2+2,y,B[2][0]-B[2][1]/2-4,y,{color,w:3,head:10})
  +arrow(B[2][0]+B[2][1]/2+2,y+(dy<0?20:-20),1000,260+dy,{color,w:3,head:10}));
 // 中級の道（上）
 s+=fade(mid*g,L('中級の道：時刻を 消す',600,52,{size:26,color:C.dim,weight:700}));
 s+=box(0,y1,'a=v\\dfrac{dv}{dx}',mid*g,warn?C.a:C.ink)+box(1,y1,'F\\,dx=mv\\,dv',mid*g)+box(2,y1,'\\int\\!\\cdots dx',mid*g);
 s+=arrows(y1,mid*g,C.dim,-30);
 // 上級の道（下）
 s+=fade(adv*g,L('上級の道：時刻で 積み上げる',600,488,{size:26,color:CH,weight:700}));
 s+=box(0,y2,'\\times\\,v',adv*g,warn?CF:CH)+box(1,y2,'\\tfrac{d}{dt}\\big(\\tfrac12mv^2\\big)=Fv',adv*g,CH)+box(2,y2,'\\int\\!\\cdots dt',adv*g,CH);
 s+=arrows(y2,adv*g,CH,30);
 return s;
}

export const ytUcWork1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=pathLine(1,seg(p,0,.3))+fvec(.25,seg(p,.2,.35),70)+fvec(.55,seg(p,.25,.4),95)+fvec(.85,seg(p,.3,.45),55);
  s+=card(640,80,520,350,L('前回の 最後の問い',900,130,{size:24,color:C.dim})
   +L('道に沿って 変わる力の 仕事を',900,190,{size:28})
   +L('"時間" で 書き直すと',900,240,{size:30,color:CT,weight:700})
   +L('ベクトルの まま',900,290,{size:28,color:CH})
   +L('運動エネルギーと 結べる？',900,345,{size:32,color:CE,weight:700}),seg(p,.1,.3),CH);
  return s;
 },
 [K+'recap1']:(p)=>{
  let s=pathLine(1,1);
  const us=[0,.2,.4,.6,.8,1];
  for(let i=0;i<5;i++){s+=chord(us[i],us[i+1],seg(p,.05+i*.06,.12+i*.06),'');s+=fvec(us[i],seg(p,.3,.45),60+15*Math.sin(i*1.7));}
  s+=fade(seg(p,.05,.2),label('d𝐫（一歩）',curve(.1)[0]-24,curve(.1)[1]+14,{size:24,color:CX,weight:700,anchor:'end'}));
  s+=card(640,110,520,280,L('中級：一歩ごとの 内積を 足す',900,165,{size:26,color:C.dim})
   +fade(seg(p,.35,.5),T(`${bF}\\cdot d${br}`,900,240,46))
   +fade(seg(p,.6,.75),T(`${Wv}=\\int_C ${bF}\\cdot d${br}`,900,340,52)),seg(p,.02,.15));
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=L('中級：1本の 軸',600,60,{size:28,color:C.dim,weight:700});
  const xs=[190,470,760,1030];
  const items=['dt=\\dfrac{dx}{v}','F\\,dx=mv\\,dv','\\int\\cdots',`${Wv}=\\Delta ${Kv}`];
  items.forEach((f,i)=>{const g=seg(p,.05+i*.17,.17+i*.17);s+=card(xs[i]-115,170,230,130,TF(f,xs[i],245,200,i===3?48:40),g,i===3?CE:C.faint);
   if(i<3)s+=fade(seg(p,.12+i*.17,.2+i*.17),arrow(xs[i]+118,235,xs[i+1]-120,235,{color:C.dim,w:3,head:12}));});
  s+=fade(seg(p,.1,.25),L('時刻を 消す',190,350,{size:24,color:CT}));
  s+=fade(seg(p,.6,.75),L('足し上げる',760,350,{size:24,color:C.dim}));
  return s;
 },
 [K+'recap3']:(p)=>{
  let s=pathLine(1,1)+ticks(.0);
  s+=card(640,140,520,220,L('曲がった道での 導き方は',900,200,{size:28})
   +L('上級で（約束）',900,265,{size:34,color:CH,weight:700})+fade(seg(p,.4,.6),L('→ 今回 果たす',900,325,{size:26,color:CH})),seg(p,.02,.2),CH);
  s+=fade(seg(p,.05,.25),label('?',curve(.5)[0],curve(.5)[1]-30,{size:44,color:CH,weight:700,anchor:'middle'}));
  return s;
 },
 [K+'goal']:(p)=>{
  let s=pathLine(1,1)+ticks(seg(p,.05,.25),8,1);
  s+=card(640,70,520,170,L('① 道を 時刻で たどると',900,120,{size:28,color:CT,weight:700})+T(`${Wv}=\\;?`,900,195,50),seg(p,.05,.2),CH);
  s+=card(640,270,520,170,L('② どこから 現れる？',900,320,{size:28,color:CE,weight:700})+T(halfE,900,395,50),seg(p,.4,.55),CH);
  return s;
 },

 // ===== S2 道を時刻でたどる =====
 [K+'path']:(p)=>{
  let s=pathLine(1,seg(p,0,.3))+ticks(seg(p,.35,.6),8,1)+rvec(.55,seg(p,.15,.35),'𝐫(t)');
  s+=card(680,120,470,240,T(`${br}(t)`,915,200,56)+L('時刻 t の 位置',915,270,{size:26,color:CX})
   +fade(seg(p,.4,.6),L('点 ＝ 時刻の 目盛り',915,325,{size:26,color:CT})),seg(p,.05,.2));
  return s;
 },
 [K+'step']:(p)=>{
  const u0=.45,u1=.56;
  let s=pathLine(1,1)+ticks(.5)+rvec(u0,1,'𝐫(t)')+fade(seg(p,.1,.3),arrow(O[0],O[1],curve(u1)[0],curve(u1)[1],{color:CX,w:2.5,head:12,opacity:.6}));
  s+=chord(u0,u1,seg(p,.2,.4))+vvec(u0,seg(p,.45,.6),130);
  s+=card(680,110,470,280,L('短い時間 Δt の 移動',915,160,{size:26,color:C.dim})
   +fade(seg(p,.2,.4),T(`\\Delta${br}`,915,230,48))
   +fade(seg(p,.55,.75),T(`\\Delta${br}\\approx ${bv}\\,\\Delta t`,915,320,52)),seg(p,.02,.15));
  return s;
 },
 [K+'stepnum']:(p)=>{
  const u0=.45,u1=.56;
  let s=pathLine(1,1)+ticks(.5)+chord(u0,u1)+vvec(u0,1,130);
  s+=card(640,70,520,370,T(`${bv}=(3,\\,4)\\ \\mathrm{m/s}`,900,140,40)
   +fade(seg(p,.15,.3),T('\\Delta t=0.01\\ \\mathrm{s}',900,210,40))
   +fade(seg(p,.35,.55),T(`\\Delta${br}\\approx(3\\times0.01,\\;4\\times0.01)`,900,290,34))
   +fade(seg(p,.6,.8),T('=(0.03,\\;0.04)\\ \\mathrm{m}',900,370,40)),seg(p,.02,.15));
  return s;
 },
 [K+'drvdt']:(p)=>{
  const u0=.45,u1=mix(.56,.47,seg(p,.0,.35));
  let s=pathLine(1,1)+chord(u0,u1,1,'')+vvec(u0,1,130);
  s+=fade(seg(p,.0,.3),L('Δt → 0',curve(.5)[0]+40,curve(.5)[1]+70,{size:26,color:CT,weight:700}));
  s+=card(640,90,520,330,T(`d${br}=${bv}\\,dt`,900,180,58)+fade(seg(p,.35,.5),L('（極限の 等式）',900,240,{size:24,color:C.dim}))
   +fade(seg(p,.5,.7),L('速度の 定義',900,310,{size:26,color:C.dim})+T(`${bv}=\\dfrac{d${br}}{dt}`,900,385,44)),seg(p,.2,.35),CH);
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(`${bF}\\cdot d${br}`,250,170,60);
  s+=fade(seg(p,.1,.3),label('d𝐫 ＝ 𝐯 dt を 入れる',600,110,{size:26,color:CX,anchor:'middle'}));
  s+=fade(seg(p,.1,.3),arrow(420,170,560,170,{color:C.dim,w:4,head:14}));
  s+=fade(seg(p,.25,.45),T(`${bF}\\cdot ${bv}\\,dt`,820,170,60));
  s+=fade(seg(p,.55,.7),brace(690,890,240,{text:'力と速度の 内積',size:26,color:CF})+brace(910,990,240,{text:'短い時間',size:26,color:CT}));
  s+=card(250,380,700,90,L('一歩の 仕事 ＝ （力・速度）× 時間',600,435,{size:28,color:CE,weight:700}),seg(p,.7,.85),CE);
  return s;
 },
 [K+'subnum']:(p)=>{
  const u0=.45,u1=.56;
  let s=pathLine(1,1)+chord(u0,u1)+vvec(u0,1,130)+fvec(u0,1,90);
  s+=card(600,60,570,400,T(`${bF}=(0,\\,-2)\\ \\mathrm{N}`,885,120,38)
   +fade(seg(p,.1,.3),T(`${bF}\\cdot${bv}=0\\times3+(-2)\\times4`,885,200,36))
   +fade(seg(p,.3,.45),T('=-8',885,265,40))
   +fade(seg(p,.5,.7),T(`${bF}\\cdot${bv}\\,\\Delta t=-8\\times0.01`,885,340,36))
   +fade(seg(p,.7,.85),T(`\\approx ${cE('-0.08\\ \\mathrm{J}')}`,885,410,42)),seg(p,.02,.12));
  return s;
 },
 [K+'wint']:(p)=>{
  let s=pathLine(1,1)+ticks(1,8,1);
  for(let i=0;i<8;i++)s+=fade(seg(p,.05+i*.04,.1+i*.04),vvec(i/8,1,70,''));
  s+=card(640,90,520,320,L('一歩ずつ 足す → 刻みを 細かく',900,140,{size:24,color:C.dim})
   +fade(seg(p,.3,.5),T(`${Wv}=\\int_{t_0}^{t_1}${bF}\\cdot${bv}\\,dt`,900,250,52))
   +fade(seg(p,.6,.75),L('時刻 t₀ から t₁ まで 時間で 積分',900,355,{size:24,color:CT})),seg(p,.02,.15));
  return s;
 },
 [K+'wint2']:(p)=>{
  let s=pathLine(1,1)+ticks(1,8,1);
  for(let i=0;i<8;i++)s+=vvec(i/8,1,70,'');
  s+=card(640,70,520,370,T(`${Wv}=\\int_{t_0}^{t_1}${bF}\\cdot${bv}(t)\\,dt`,900,150,46)
   +fade(seg(p,.1,.3),L('道の形は 𝐯(t) の 中',900,240,{size:28,color:CV,weight:700}))
   +fade(seg(p,.5,.7),L('曲がった道の 積分',900,310,{size:26}))+fade(seg(p,.5,.7),L('→ t だけの ふつうの 積分',900,360,{size:28,color:CT,weight:700})),1);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=T(`${Wv}=\\int ${bF}\\cdot${bv}\\,dt`,600,110,52);
  const u1='\\mathrm{N}\\times\\dfrac{\\mathrm{m}}{\\mathrm{s}}\\times\\mathrm{s}',u2='\\mathrm{N}\\times\\dfrac{\\mathrm{m}}{\\cancel{\\mathrm{s}}}\\times\\cancel{\\mathrm{s}}';
  s+=fade(seg(p,.1,.3)*(1-seg(p,.4,.55)),T(u1,600,250,56))+fade(seg(p,.4,.55),T(u2,600,250,56,{color:C.ink}));
  s+=fade(seg(p,.55,.7),T(`=\\mathrm{N\\cdot m}=${cE('\\mathrm{J}')}`,600,390,56)+ok(830,400));
  return s;
 },

 // ===== S3 1本の軸で v を掛ける =====
 [K+'eom']:(p)=>{
  let s=axis1(seg(p,0,.2));
  s+=card(680,120,470,240,L('1本の 軸',915,175,{size:28,color:C.dim,weight:700})+fade(seg(p,.3,.5),L('F と v は 符号付きの 数',915,245,{size:28}))
   +fade(seg(p,.5,.7),L('右向き ＝ 正',915,305,{size:28,color:CH,weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'eom2']:(p)=>{
  let s=axis1(1);
  s+=card(660,70,500,380,T('m\\dfrac{dv}{dt}=F',910,170,60)
   +fade(seg(p,.3,.5),L('仮定：m は 一定',910,280,{size:26,color:C.dim}))
   +fade(seg(p,.55,.75),L('F：はたらく力 すべての 合力',910,345,{size:26,color:CF,weight:700})),1,CF);
  return s;
 },
 [K+'mulv']:(p)=>{
  let s=T('F\\,dx=F\\,v\\,dt',600,95,46,{color:C.dim});
  s+=fade(seg(p,.0,.2),label('1次元の 一歩の 仕事',600,30,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.5),T('m\\dfrac{dv}{dt}=F',600,270,68));
  s+=fade(seg(p,.55,.75),label('× v',360,280,{size:44,color:CV,anchor:'middle',weight:700})+label('× v',840,280,{size:44,color:CV,anchor:'middle',weight:700}));
  s+=card(300,380,600,90,L('仕事が 現れるように 両辺に v を 掛ける',600,435,{size:28,color:CH}),seg(p,.55,.7),CH);
  return s;
 },
 [K+'mulv2']:(p)=>{
  let s=T('m\\,v\\dfrac{dv}{dt}=F\\,v',600,190,76);
  const w=texWidth('F\\,v',76),xr=600+texWidth('m\\,v\\dfrac{dv}{dt}=F\\,v',76)/2;
  s+=fade(seg(p,.35,.55),brace(xr-w-10,xr+10,280,{text:'1秒あたりに される 仕事',size:28,color:CE}));
  s+=fade(seg(p,.1,.3),label('左辺',360,330,{size:26,color:C.dim,anchor:'middle'})+label('?',360,390,{size:40,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chain']:(p)=>{
  let s=T('\\dfrac{d}{dt}\\big(v^2\\big)',260,200,64);
  s+=fade(seg(p,.15,.35),T('=',430,200,64)+T(`${cH('2v')}\\times\\dfrac{dv}{dt}`,620,200,64));
  s+=fade(seg(p,.35,.55),brace(490,560,290,{color:CH})+label('外側の2乗の 傾き',470,360,{size:26,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),brace(650,780,290,{color:CV})+label('中身の 変わる速さ',740,410,{size:26,color:CV,anchor:'middle',weight:700}));
  s+=card(840,90,330,130,L('連鎖律',1005,140,{size:26,color:C.dim})+L('（微分の法則）',1005,190,{size:24,color:C.dim}),seg(p,.05,.2));
  return s;
 },
 [K+'half']:(p)=>{
  let s=T('\\dfrac{d}{dt}\\big(v^2\\big)=2v\\dfrac{dv}{dt}',600,120,56);
  s+=fade(seg(p,.3,.45),label('÷ 2',140,300,{size:40,color:CH,anchor:'middle',weight:700})+label('÷ 2',1060,300,{size:40,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.65),T('v\\dfrac{dv}{dt}=\\dfrac{d}{dt}\\Big(\\dfrac{v^2}{2}\\Big)',600,300,62));
  s+=fade(seg(p,.7,.85),L('左辺の 形が 現れた',600,450,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'half2']:(p)=>{
  let s=T('v\\dfrac{dv}{dt}=\\dfrac{d}{dt}\\Big(\\dfrac{v^2}{2}\\Big)',600,110,50,{color:C.dim});
  s+=fade(seg(p,.1,.3),label('× m（定数）',600,215,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),T(`m\\,v\\dfrac{dv}{dt}=\\dfrac{d}{dt}\\Big(${halfE}\\Big)`,600,340,66));
  s+=fade(seg(p,.6,.8),L('定数は 微分の 中へ 入れてよい',600,465,{size:26,color:C.dim}));
  return s;
 },
 [K+'result']:(p)=>{
  const f=`\\dfrac{d}{dt}\\Big(${halfE}\\Big)=F\\,v`,w=texWidth(f,84);
  let s=highlight(600-w/2-30,62,w+60,195,seg(p,.1,.3),CH)+T(f,600,190,84);
  s+=fade(seg(p,.4,.6),label('½mv² の 増える速さ',420,370,{size:28,color:CE,anchor:'middle',weight:700})+label('＝',600,370,{size:30,color:C.ink,anchor:'middle'})+label('1秒あたりの 仕事',790,370,{size:28,color:CE,anchor:'middle',weight:700}));
  return s;
 },
 [K+'result2']:(p)=>{
  const hl=seg(p,.1,.3),fH=`\\dfrac{d}{dt}\\Big(${cH('\\tfrac{1}{2}')}${cE('m')}v${cH('^2')}\\Big)=F\\,v`;
  let s=fade(1-hl,T(`\\dfrac{d}{dt}\\Big(${halfE}\\Big)=F\\,v`,600,150,72))+fade(hl,T(fH,600,150,72));
  s+=fade(hl,highlight(466,74,50,100,1,CH)+highlight(602,64,50,62,1,CH));
  s+=fade(hl,label('½',440,290,{size:30,color:CH,anchor:'middle',weight:700})+arrow(452,262,482,182,{color:CH,w:3,head:10})
   +label('2乗',700,290,{size:30,color:CH,anchor:'middle',weight:700})+arrow(690,262,636,134,{color:CH,w:3,head:10}));
  s+=card(250,330,700,130,L('½ も 2乗も 定義では ない',600,385,{size:30,color:C.ink,weight:700})
   +fade(seg(p,.5,.7),L('v を 掛けて 微分を 逆に 読んだ 計算の 産物',600,435,{size:26,color:CH})),seg(p,.3,.45),CH);
  return s;
 },
 [K+'integ']:(p)=>{
  let s=T(`\\dfrac{d}{dt}\\Big(${halfE}\\Big)=F\\,v`,600,80,48,{color:C.dim});
  s+=fade(seg(p,.05,.2),label('t₀ から t₁ まで 時間で 積分',600,165,{size:26,color:CT,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),T(`\\tfrac{1}{2}mv_1^2-\\tfrac{1}{2}mv_0^2`,330,280,50));
  s+=fade(seg(p,.4,.55),T('=',560,280,50)+T('\\int_{t_0}^{t_1}F\\,v\\,dt',730,280,50));
  s+=fade(seg(p,.55,.7),T(`=${Wv}`,940,280,50));
  s+=fade(seg(p,.7,.85),T(`${Wv}=\\Delta ${Kv}`,600,420,56)+label('（1次元）',820,425,{size:24,color:C.dim}));
  return s;
 },

 // ===== S4 数で確かめる =====
 [K+'num']:(p)=>{
  let s=axis1(1,{bx:300,text:'2 kg'});
  s+=fade(seg(p,.05,.2),label('4 N',150,330,{size:26,color:CF,anchor:'middle',weight:700}));
  s+=card(650,70,510,380,L('静止から 一定の力で 押す',905,120,{size:26,color:C.dim})
   +fade(seg(p,.2,.4),T('a=4\\div2=2\\ \\mathrm{m/s^2}',905,200,40))
   +fade(seg(p,.5,.7),T('v=2t\\ \\ \\mathrm{m/s}',905,290,48))
   +fade(seg(p,.6,.8),L('（中級の 滑走路と 同じ例）',905,380,{size:24,color:C.dim})),seg(p,.02,.15));
  return s;
 },
 [K+'numK']:(p)=>{
  let s=T(`${Kv}=\\tfrac12\\times2\\times(2t)^2`,600,100,52);
  s+=fade(seg(p,.2,.35),T(`=4t^2\\ ${cE('\\mathrm{J}')}`,600,210,52));
  s+=fade(seg(p,.5,.7),T(`\\dfrac{d${Kv}}{dt}=8t`,600,370,64));
  s+=fade(seg(p,.5,.7),label('時間で 微分',880,375,{size:24,color:C.dim}));
  return s;
 },
 [K+'numP']:(p)=>{
  let s=T(`\\dfrac{d${Kv}}{dt}=8t`,320,190,64)+T('F\\,v=4\\times2t=8t',830,190,56,{opacity:seg(p,.05,.25)});
  s+=fade(seg(p,.4,.55),label('＝',570,195,{size:56,color:CF,anchor:'middle',weight:700}));
  s+=card(300,330,600,110,L('どの 時刻でも 一致',600,398,{size:32,color:CF,weight:700}),seg(p,.5,.65),CF);
  return s;
 },
 [K+'graph']:(p)=>{
  const G=GP();let s=G.svg+G.plot(u=>8*u,{from:0,to:3.4,color:CE,w:5,p:seg(p,.0,.3)});
  s+=fade(seg(p,.1,.3),label('Fv ＝ 8t',G.X(3.4)-10,G.Y(27.2)-10,{size:26,color:CE,anchor:'end',weight:700}));
  s+=fade(seg(p,.35,.55),poly([[G.X(0),G.Y(0)],[G.X(3),G.Y(0)],[G.X(3),G.Y(24)]],{fill:CE,fo:.35,stroke:CE,sw:2}));
  s+=card(660,90,500,330,L('三角形の 面積',910,145,{size:26,color:C.dim})
   +fade(seg(p,.5,.7),T('\\tfrac12\\times3\\times24',910,235,50))
   +fade(seg(p,.7,.85),T(`=${cE('36\\ \\mathrm{J}')}`,910,335,56)),seg(p,.3,.45));
  return s;
 },
 [K+'graph2']:(p)=>{
  const G=GP();let s=G.svg+G.plot(u=>8*u,{from:0,to:3.4,color:CE,w:5})+poly([[G.X(0),G.Y(0)],[G.X(3),G.Y(0)],[G.X(3),G.Y(24)]],{fill:CE,fo:.35,stroke:CE,sw:2});
  s+=label('36 J',G.X(2.2),G.Y(5),{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=card(660,90,500,330,L('t ＝ 3 s の 運動エネルギー',910,145,{size:26,color:C.dim})
   +fade(seg(p,.1,.3),T(`${Kv}=4\\times3^2`,910,235,50))
   +fade(seg(p,.3,.5),T(`=${cE('36\\ \\mathrm{J}')}`,910,325,56)+ok(1080,335,seg(p,.55,.7)))
   +fade(seg(p,.6,.75),L('面積の 仕事と 同じ',910,395,{size:26,color:CF,weight:700})),1,CE);
  return s;
 },
 [K+'graph3']:(p)=>{
  let s=axis1(1,{bx:300,v:0});
  s+=card(650,70,510,380,L('距離でも 確かめる',905,120,{size:26,color:C.dim})
   +fade(seg(p,.1,.3),T('x=t^2=3^2=9\\ \\mathrm{m}',905,200,44))
   +fade(seg(p,.4,.6),T(`F\\times x=4\\times9=${cE('36\\ \\mathrm{J}')}`,905,290,40))
   +fade(seg(p,.65,.85),L('中級の F dx の 道とも 一致',905,380,{size:26,color:CF,weight:700})),seg(p,.02,.15));
  return s;
 },

 // ===== S5 2本の道 =====
 [K+'map']:(p)=>roadmap(p,{mid:seg(p,0,.3),adv:0}),
 [K+'map2']:(p)=>roadmap(p,{mid:.5,adv:seg(p,0,.3)}),
 [K+'map3']:(p)=>roadmap(p,{mid:1,adv:1})+fade(seg(p,.3,.5),highlight(14,189,192,142,1,CF))+fade(seg(p,.5,.7),highlight(994,189,192,142,1,CE)),
 [K+'map4']:(p)=>{
  let s=roadmap(p,{mid:1,adv:1,warn:1});
  s+=fade(seg(p,.1,.3),card(225,207,200,56,L('÷ v（v ≠ 0）',325,244,{size:24,color:C.a,weight:700}),1,C.a));
  s+=fade(seg(p,.5,.7),card(225,267,200,56,L('× v：割らない',325,304,{size:24,color:CF,weight:700}),1,CF));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(80,60,1040,170,L('道を 時刻で たどる',600,105,{size:26,color:C.dim})+T(`d${br}=${bv}\\,dt\\quad\\Rightarrow\\quad ${Wv}=\\int ${bF}\\cdot${bv}\\,dt`,600,185,48),seg(p,.02,.2),CH);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,60,1040,170,L('道を 時刻で たどる',600,105,{size:26,color:C.dim})+T(`d${br}=${bv}\\,dt\\quad\\Rightarrow\\quad ${Wv}=\\int ${bF}\\cdot${bv}\\,dt`,600,185,48),1,CH);
  s+=card(80,270,1040,190,L('1本の 軸：運動方程式 × v',600,315,{size:26,color:C.dim})+T(`\\dfrac{d}{dt}\\Big(${halfE}\\Big)=F\\,v`,600,400,52),seg(p,.05,.25),CE);
  return s;
 },
 [K+'next']:(p)=>{
  // 3次元の曲がった道と、速度の矢印
  const cx=300,cy=300;
  let s=fade(seg(p,0,.2),arrow(cx,cy,cx+230,cy+60,{color:C.dim,w:2,head:10})+arrow(cx,cy,cx,cy-220,{color:C.dim,w:2,head:10})+arrow(cx,cy,cx-150,cy+130,{color:C.dim,w:2,head:10})
   +label('x',cx+240,cy+80,{size:24,color:C.dim})+label('y',cx-170,cy+150,{size:24,color:C.dim})+label('z',cx+10,cy-225,{size:24,color:C.dim}));
  const sp=Array.from({length:61},(_,i)=>{const u=i/60*Math.PI*2.2;return [cx-20+90*Math.cos(u)+25*u,cy+35*Math.sin(u)-28*u];});
  s+=draw(sp,seg(p,.05,.4),{color:C.dim,w:4});
  const q=sp[40],q2=sp[41],d=[q2[0]-q[0],q2[1]-q[1]],n=Math.hypot(d[0],d[1]);
  s+=fade(seg(p,.35,.55),arrow(q[0],q[1],q[0]+130*d[0]/n,q[1]+130*d[1]/n,{color:CV,w:6,head:18})+label('𝐯',q[0]+130*d[0]/n+12,q[1]+130*d[1]/n,{size:30,color:CV,weight:700}));
  s+=card(660,110,500,260,L('速度は 矢印',910,165,{size:28,color:CV,weight:700})
   +fade(seg(p,.5,.7),L('速さの 2乗',910,235,{size:26}))+fade(seg(p,.5,.7),T(`v^2=${bv}\\cdot${bv}`,910,315,52)),seg(p,.3,.45));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(200,90,800,330,L('次の 問い',600,145,{size:26,color:C.dim})
   +T(`\\dfrac{d}{dt}\\big(${bv}\\cdot${bv}\\big)=\\;?`,600,255,64)
   +fade(seg(p,.3,.5),L('3次元の 曲がった道で',600,370,{size:30,color:CH,weight:700})),seg(p,0,.15),CH);
  return s;
 },
};
