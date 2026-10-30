// YouTube シリーズ「積分・上級 2/2」(ys-um-integral-2) — 図。Stage 1200×515.
// 色：t 金、原始関数 F・位置 x 水色、速度 v 紫、加速度 a 赤、積分定数 C 黄、正しい 緑、誤り 赤。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,poly,draw} from './anim.mjs';
import {card,T,cc,cV,cT,cX,cH} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='um-integral-2:';
const ok=C.F,bad=C.a;
const cA=s=>cc(C.a,s),cR=s=>cc(bad,s),cG=s=>cc(ok,s);
const t=cT('t');
const under=(A,fn,from,to,{fill=C.x,fo=.3,stroke='none',sw=2}={})=>{const N=60,pts=[[A.X(from),A.Y(0)]];for(let i=0;i<=N;i++){const u=from+(to-from)*i/N;pts.push([A.X(u),A.Y(fn(u))]);}pts.push([A.X(to),A.Y(0)]);return poly(pts,{fill,fo,stroke,sw});};

// table of powers: rows [n, t^n, primitive]
const ROWS=[['2',t+'^2',t+'^3/3'],['1',t,t+'^2/2'],['0','1',t],['-2',t+'^{-2}','-1/'+t],['-1',t+'^{-1}','?']];
function table(p,{show=[1,1,1,0,0],hl=-1,bad1=0}={}){
 const x0=170,xs=[250,520,860],y0=110,dy=76;
 let s=rect(x0,y0-50,860,60+dy*5,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 s+=label('n',xs[0],y0-8,{size:28,color:C.dim,anchor:'middle',weight:700})+label('微分すると これ',xs[1],y0-8,{size:26,color:C.dim,anchor:'middle'})+label('原始関数',xs[2],y0-8,{size:26,color:C.x,anchor:'middle',weight:700});
 ROWS.forEach(([n,f,F],i)=>{const g=show[i];if(g<=0)return;const y=y0+dy*(i+.75);
  let r=T(n,xs[0],y,{size:36})+T(f,xs[1],y,{size:40});
  if(i===4&&bad1<=0)r+=T(cH('?'),xs[2],y,{size:44});
  if(i===4&&bad1>0)r+=fade(bad1,label('✕',xs[2],y+14,{size:44,color:bad,anchor:'middle',weight:700}));
  else if(i!==4)r+=T(cX(F),xs[2],y,{size:40});
  if(i===hl)r+=highlight(x0+12,y-38,836,70,1);
  s+=fade(g,r);});
 return s;
}
// graph of 1/t
const GI=(o={})=>axes({x:90,y:450,w:520,h:360,xmax:4.2,ymax:3.2,xticks:[1,2,3,4],yticks:[1,2,3],grid:true,xlabel:'t',xcolor:C.t,...o});
const inv=u=>1/u;
// doors: a → (∫ + C1) → v → (∫ + C2) → x
function doors(p,{y=260,g=1,v0='v₀',x0='x₀',hl=0}={}){
 const box=(cx,txt,col)=>rect(cx-70,y-45,140,90,{fill:col,fo:.18,stroke:col,sw:3,rx:12})+label(txt,cx,y+12,{size:36,color:col,anchor:'middle',weight:700});
 let s=box(170,'a',C.a)+box(600,'v',C.v)+box(1030,'x',C.x);
 const door=(x1,x2,cn,val,gg,hh)=>{const m=(x1+x2)/2;return arrow(x1,y,x2,y,{color:C.dim,w:4,head:16})+label('∫',m-40,y-18,{size:34,color:C.dim,anchor:'middle'})+label('＋ '+cn,m+22,y-18,{size:28,color:C.hi,anchor:'middle',weight:700})
  +fade(gg,rect(m-110,y+40,220,70,{fill:C.hi,fo:hh?.18:.08,stroke:C.hi,sw:hh?3:2,rx:10})+label(cn+' ＝ '+val,m,y+85,{size:26,color:C.hi,anchor:'middle',weight:700}));};
 s+=door(245,525,'C₁',v0,1,hl===1)+door(675,955,'C₂',x0,1,hl===2);
 if(v0!=='初速度')s+=label('初速度',385,y+140,{size:24,color:C.dim,anchor:'middle'})+label('初期位置',815,y+140,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
// a–t graph for a = 6t
const GA=(o={})=>axes({x:90,y:450,w:470,h:350,xmax:2.6,ymax:14,xticks:[1,2],yticks:[6,12],grid:true,xlabel:'t [s]',ylabel:'a [m/s²]',xcolor:C.t,ycolor:C.a,...o});

export const ytUmIntegral2Diagrams={
 // ===== S1 =====
 [K+'recap']:(p)=>{
  const src=cH('\\int_a^b')+cc(C.v,'f(x)')+'\\,'+cT('dx')+'='+cX('F(b)')+'-'+cX('F(a)'),w=texWidth(src,60,false);
  let s=label('前回：証明した',600,110,{size:28,color:C.dim,anchor:'middle'});
  s+=T(src,600,220,{size:60})+fade(seg(p,.05,.2),highlight(600-w/2-26,130,w+52,170,1));
  s+=fade(seg(p,.5,.65),label('原始関数 F が 一つ あれば、引き算 1回',600,380,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'question']:(p)=>{
  let s=card(250,90,700,320,label('今回の問い',600,140,{size:26,color:C.dim,anchor:'middle'})+T('\\int '+t+'^{\\,n}\\,'+cT('dt')+'=\\;?',600,250,{size:64})
   +fade(seg(p,.45,.6),label('使えない n は ある？',600,360,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15),C.hi);
  return s;
 },
 // ===== S2 =====
 [K+'diff']:(p)=>{
  let s=label('微分・上級',600,90,{size:26,color:C.dim,anchor:'middle'});
  s+=T('('+t+'^{\\,n})\'=n\\,'+t+'^{\\,n-1}',600,210,{size:70});
  s+=fade(seg(p,.4,.55),label('肩の数 n が 前に 出る',380,350,{size:30,color:C.hi,anchor:'middle',weight:700})+label('肩が 1つ 下がる',830,350,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'reverse']:(p)=>{
  let s=T(cX('?'),330,200,{size:80})+T(t+'^{\\,n}',870,200,{size:70});
  s+=arrow(410,160,790,160,{color:C.dim,w:4,head:16})+label('微分',600,140,{size:28,color:C.dim,anchor:'middle'});
  s+=arrow(790,250,410,250,{color:C.hi,w:5,head:18,g:seg(p,.2,.45)})+fade(seg(p,.3,.45),label('積分：微分すると tⁿ になる 関数を 探す',600,310,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'raise']:(p)=>{
  let s=label('肩を 1つ 上げて 微分',600,90,{size:28,color:C.dim,anchor:'middle'});
  const src='('+t+'^{\\,n+1})\'=',rest=cR('(n+1)')+'\\,'+t+'^{\\,n}',w1=texWidth(src,64,false),w2=texWidth(rest,64,false),x0=600-(w1+w2)/2;
  s+=T(src,x0,220,{size:64,anchor:'start'})+fade(seg(p,.3,.45),T(rest,x0+w1,220,{size:64,anchor:'start'}));
  const xr=x0+w1+texWidth(cR('(n+1)'),64,false)/2;
  s+=fade(seg(p,.6,.75),arrow(xr,370,xr,275,{color:bad,w:4,head:14})+label('余計な n＋1',xr,410,{size:30,color:bad,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cand']:(p)=>{
  let s=label('はじめから n＋1 で 割っておく',600,100,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.4),T(cX('F(t)')+'=\\dfrac{'+t+'^{\\,n+1}}{n+1}',600,260,{size:72}));
  s+=fade(seg(p,.5,.65),label('候補',600,400,{size:30,color:C.x,anchor:'middle'}));
  return s;
 },
 [K+'verify']:(p)=>{
  let s=label('微分で 検算',600,80,{size:28,color:C.dim,anchor:'middle'});
  s+=T('\\left(\\dfrac{'+t+'^{\\,n+1}}{n+1}\\right)\'',330,220,{size:56});
  s+=fade(seg(p,.1,.3),T('=\\dfrac{'+cR('(n+1)')+'\\,'+t+'^{\\,n}}{'+cR('n+1')+'}',640,220,{size:56}));
  s+=fade(seg(p,.45,.6),T('='+t+'^{\\,n}',930,220,{size:64}));
  s+=fade(seg(p,.35,.5),label('前の n＋1 と 分母が 消える',600,380,{size:30,color:bad,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('○ 戻った',930,320,{size:30,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'table']:(p)=>table(p,{show:[seg(p,.02,.15),seg(p,.25,.4),seg(p,.5,.65),0,0]}),
 // ===== S3 =====
 [K+'neg']:(p)=>table(p,{show:[1,1,1,seg(p,.05,.3),0],hl:3}),
 [K+'neg2']:(p)=>{
  let s=card(150,100,900,130,label('微分・上級で 示したのは 正の整数の n',600,178,{size:30,color:C.ink,anchor:'middle'}),seg(p,.02,.15));
  s+=card(150,280,900,150,T('-\\dfrac{1}{'+t+'}',340,355,{size:56})+label('→ 差の商で 直接 確かめる',720,368,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'negdiff']:(p)=>{
  let s=T('-\\dfrac{1}{'+t+'+'+cT('h')+'}-\\left(-\\dfrac{1}{'+t+'}\\right)',600,110,{size:48});
  s+=fade(seg(p,.25,.45),T('=\\dfrac{-'+t+'+('+t+'+'+cT('h')+')}{'+t+'('+t+'+'+cT('h')+')}',600,260,{size:48})+label('通分',250,270,{size:28,color:C.dim}));
  s+=fade(seg(p,.6,.75),T('=\\dfrac{'+cT('h')+'}{'+t+'('+t+'+'+cT('h')+')}',600,410,{size:52}));
  return s;
 },
 [K+'negdiff2']:(p)=>{
  let s=T('\\dfrac{1}{'+cT('h')+'}\\times\\dfrac{'+cT('h')+'}{'+t+'('+t+'+'+cT('h')+')}=\\dfrac{1}{'+t+'('+t+'+'+cT('h')+')}',600,130,{size:50});
  s+=fade(seg(p,.3,.5),T('\\xrightarrow{\\;'+cT('h')+'\\to0\\;}\\;\\dfrac{1}{'+t+'^2}='+t+'^{-2}',600,290,{size:56}));
  s+=fade(seg(p,.6,.75),label('○ 元の 1/t² に 戻った',600,420,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m1']:(p)=>table(p,{show:[1,1,1,1,seg(p,.05,.3)],hl:4}),
 [K+'m1b']:(p)=>{
  let s=label('n ＝ −1',600,90,{size:32,color:C.hi,anchor:'middle',weight:700});
  s+=T('\\dfrac{'+t+'^{\\,-1+1}}{-1+1}=\\dfrac{'+t+'^{0}}{'+cR('0')+'}',600,230,{size:64});
  s+=fade(seg(p,.25,.4),label('分母 0 → 割り算 できない ✕',600,380,{size:34,color:bad,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('n ＝ −1 だけ、この形は 使えない',600,450,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'area']:(p)=>{
  const A=GI();let s=A.svg+fade(seg(p,.05,.3),under(A,inv,1,2))+A.plot(inv,{from:0.32,to:4.1,color:C.v,w:4});
  s+=label('1/t',A.X(0.5)+14,A.Y(2.4),{size:28,color:C.v,weight:700});
  s+=card(680,120,480,280,label('グラフの下に 面積は ある',920,185,{size:28,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('→ 原始関数も ある',920,245,{size:28,color:C.ink,anchor:'middle'})+label('でも t の何乗 では 書けない',920,320,{size:28,color:bad,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'ln']:(p)=>{
  const src=cH('\\int')+'\\dfrac{1}{'+t+'}\\,'+cT('dt')+'='+cX('\\ln|t|')+'+'+cH('C'),w=texWidth(src,60,false);
  let s=T(src,600,150,{size:60})+fade(seg(p,.1,.25),highlight(600-w/2-24,85,w+48,130,1));
  s+=fade(seg(p,.2,.35),label('（t ≠ 0）',600,270,{size:28,color:C.t,anchor:'middle'}));
  s+=card(200,320,800,140,label('ln：「e の 何乗か」を 返す 関数',600,380,{size:30,color:C.x,anchor:'middle',weight:700})+label('例：ln e ＝ 1、ln 1 ＝ 0',600,428,{size:26,color:C.dim,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },
 [K+'ln2']:(p)=>{
  let s=card(150,90,900,170,T('(\\ln|'+t+'|)\'=\\dfrac{1}{'+t+'}\\;?',600,170,{size:52})+label('次の単元（微分の法則・上級）で 確かめる',600,235,{size:26,color:C.hi,anchor:'middle'}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.55,.7),label('ここでは 使う',600,360,{size:34,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lnex']:(p)=>{
  const A=GI();const e=Math.E;
  let s=A.svg+fade(seg(p,.05,.25),under(A,inv,1,e))+A.plot(inv,{from:0.32,to:4.1,color:C.v,w:4});
  s+=line(A.X(e),A.Y(0)-8,A.X(e),A.Y(0)+8,{color:C.t,w:3})+label('e',A.X(e),A.Y(0)-16,{size:26,color:C.t,anchor:'middle',weight:700});
  s+=label('（e ≈ 2.718）',A.X(e)+6,A.Y(1.2),{size:22,color:C.dim});
  s+=card(660,110,510,300,T(cH('\\int_1^{e}')+'\\dfrac{1}{'+t+'}\\,'+cT('dt'),915,180,{size:46})
   +fade(seg(p,.3,.45),T('='+cX('\\ln e')+'-'+cX('\\ln 1'),915,270,{size:44}))
   +fade(seg(p,.55,.7),T('=1-0=1',915,350,{size:46})),seg(p,.02,.15));
  return s;
 },
 [K+'lnzero']:(p)=>{
  const A=axes({x:90,y:440,w:540,h:340,xmin:-3.2,xmax:3.2,ymin:-3,ymax:3,xticks:[-2,-1,1,2],yticks:[],grid:false,xlabel:'t',xcolor:C.t});
  let s=A.svg+A.plot(inv,{from:0.34,to:3.1,color:C.v,w:4})+A.plot(inv,{from:-3.1,to:-0.34,color:C.v,w:4});
  s+=fade(seg(p,.1,.3),line(A.X(-1.5),A.Y(0),A.X(2),A.Y(0),{color:bad,w:8})+label('✕',A.X(-0.9),A.Y(0)-18,{size:36,color:bad,anchor:'middle',weight:700}));
  s+=card(690,120,470,260,label('0 を またぐ 区間：✕',925,185,{size:30,color:bad,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('t ＝ 0 で 1/t が 跳ぶ',925,255,{size:28,color:C.ink,anchor:'middle'})+label('→ 前回の 仮定が 崩れる',925,305,{size:28,color:C.hi,anchor:'middle'})),seg(p,.02,.15));
  return s;
 },
 // ===== S4 =====
 ...(()=>{
  const GV=(o={})=>axes({x:90,y:450,w:470,h:350,xmax:3.6,ymax:7.5,xticks:[1,2,3],yticks:[2,4,6],grid:true,xlabel:'t [s]',ylabel:'v [m/s]',xcolor:C.t,ycolor:C.v,...o});
  const vf=u=>2*u;
  const base=(A,from,to)=>A.svg+under(A,vf,from,to)+A.plot(vf,{from:0,to:3.5,color:C.v,w:4})+label('v ＝ 2t',A.X(2.4),A.Y(6.6),{size:26,color:C.v,anchor:'end'});
  return {
   [K+'v2t']:(p)=>{
    const A=GV();let s=A.svg+fade(seg(p,.2,.4),under(A,vf,0,3))+A.plot(vf,{from:0,to:3.5,color:C.v,w:4})+label('v ＝ 2t',A.X(2.4),A.Y(6.6),{size:26,color:C.v,anchor:'end'});
    s+=card(640,90,530,340,label('上端の値 − 下端の値',905,140,{size:28,color:C.hi,anchor:'middle',weight:700})
     +fade(seg(p,.4,.55),T(cH('\\int_0^3')+'2'+t+'\\,'+cT('dt')+'=\\Big['+t+'^2\\Big]_0^3',905,240,{size:42}))
     +fade(seg(p,.6,.75),T('=9-0='+cX('9\\,\\mathrm{m}'),905,340,{size:46})),seg(p,.02,.15));
    return s;
   },
   [K+'v2t2']:(p)=>{
    const A=GV();let s=base(A,2,3);
    s+=card(640,90,530,340,T(cH('\\int_2^3')+'2'+t+'\\,'+cT('dt')+'=9-4='+cX('5\\,\\mathrm{m}'),905,180,{size:42})
     +fade(seg(p,.4,.55),label('9 だけ ではない',905,280,{size:28,color:bad,anchor:'middle'})+label('下端の 4 を 引く',905,335,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15));
    return s;
   },
   [K+'v2t3']:(p)=>{
    const A=GV();let s=base(A,2,3);
    s+=fade(seg(p,.05,.2),label('4',A.X(2)-12,A.Y(2)+8,{size:26,color:C.v,anchor:'end',weight:700})+label('6',A.X(3)+12,A.Y(3)+8,{size:26,color:C.v,weight:700})+line(A.X(2),A.Y(0)-12,A.X(3),A.Y(0)-12,{color:C.t,w:6})+label('幅 1',A.X(2.5),A.Y(0)-22,{size:24,color:C.t,anchor:'middle',weight:700}));
    s+=card(640,120,530,260,label('台形',905,170,{size:28,color:C.dim,anchor:'middle'})+T('\\dfrac{4+6}{2}\\times1='+cX('5'),905,265,{size:46})
     +fade(seg(p,.55,.7),label('○ 一致',905,345,{size:30,color:ok,anchor:'middle',weight:700})),seg(p,.2,.35));
    return s;
   },
  };
 })(),
 [K+'recall']:(p)=>{
  let s=card(200,80,800,130,label('運動方程式・中級（振り返り）',600,130,{size:26,color:C.dim,anchor:'middle'})+label('加速度 a が 一定 → 2回 積分',600,180,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=fade(seg(p,.4,.55),doors(p,{y:320}));
  return s;
 },
 [K+'recall2']:(p)=>{
  let s=T(cV('v')+'='+cV('v_0')+'+'+cA('a')+t,330,110,{size:48})+T(cX('x')+'='+cX('x_0')+'+'+cV('v_0')+t+'+\\tfrac12'+cA('a')+t+'^2',820,110,{size:48});
  s+=fade(seg(p,.4,.55),doors(p,{y:300,hl:0}));
  return s;
 },
 [K+'recall3']:(p)=>{
  let s=T(cX('x')+'='+cX('x_0')+'+'+cV('v_0')+t+'+\\tfrac12'+cA('a')+t+'^2',600,130,{size:58});
  s+=card(250,230,700,110,label('使えるのは a が 一定の ときだけ',600,298,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  s+=fade(seg(p,.6,.75),label('a が 時間で 変わったら？',600,430,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 =====
 [K+'cart']:(p)=>{
  const A=GA();let s=A.svg+A.plot(u=>6*u,{from:0,to:2.3,p:seg(p,.1,.5),color:C.a,w:4});
  s+=fade(seg(p,.4,.55),label('a ＝ 6t',A.X(1.5),A.Y(11),{size:28,color:C.a,anchor:'end',weight:700}));
  s+=card(640,110,520,280,label('加速を 強めていく 台車（右向き 正）',900,165,{size:24,color:C.dim,anchor:'middle'})
   +T(cA('a')+'=6'+t+'\\;\\;\\mathrm{m/s^2}',900,255,{size:48})+fade(seg(p,.6,.75),label('t は 秒の 数値',900,335,{size:28,color:C.t,anchor:'middle'})),seg(p,.02,.15));
  return s;
 },
 [K+'ic']:(p)=>{
  let s=card(200,60,800,130,label('初期条件（t ＝ 0）',600,105,{size:26,color:C.dim,anchor:'middle'})+label('速度 1 m/s、位置 2 m',600,160,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=fade(seg(p,.3,.45),doors(p,{y:290,v0:'1 m/s',x0:'2 m'}));
  return s;
 },
 [K+'guess']:(p)=>{
  const A=GA();let s=A.svg+A.plot(u=>6*u,{from:0,to:2.3,color:C.a,w:4})+label('a ＝ 6t',A.X(1.5),A.Y(11),{size:26,color:C.a,anchor:'end'});
  s+=dot(A.X(2),A.Y(12),9,C.a)+fade(seg(p,.2,.35),line(A.X(0),A.Y(12),A.X(2),A.Y(12),{color:bad,w:3,dash:'8 6'}));
  s+=card(640,110,520,290,label('予想',900,160,{size:28,color:C.hi,anchor:'middle',weight:700})+T(cX('x')+'='+cX('x_0')+'+'+cV('v_0')+t+'+\\tfrac12'+cA('a')+t+'^2',900,245,{size:40})
   +fade(seg(p,.3,.45),label('a ＝ 12 を 入れて いい？',900,340,{size:30,color:C.ink,anchor:'middle'})),seg(p,.02,.15));
  return s;
 },
 [K+'wrong']:(p)=>{
  const A=GA();let s=A.svg+fade(seg(p,.4,.55),rect(A.X(0),A.Y(12),A.X(2)-A.X(0),A.Y(0)-A.Y(12),{fill:bad,fo:.12,stroke:bad,sw:2,rx:0}))+A.plot(u=>6*u,{from:0,to:2.3,color:C.a,w:4})+line(A.X(0),A.Y(12),A.X(2),A.Y(12),{color:bad,w:3,dash:'8 6'});
  s+=fade(seg(p,.4,.55),label('ずっと 12 と した 場合',A.X(1),A.Y(13)-6,{size:22,color:bad,anchor:'middle'}));
  s+=card(630,110,540,290,T('2+1\\times2+\\tfrac12\\times12\\times2^2',900,180,{size:38})+T('='+cR('28\\,\\mathrm{m}'),900,260,{size:46})
   +fade(seg(p,.55,.7),label('✕ 正しくない',900,345,{size:32,color:bad,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'v']:(p)=>{
  let s=label('公式に 頼らず 積分',600,90,{size:28,color:C.dim,anchor:'middle'});
  const a1=cV('v')+'='+cH('\\int')+'6'+t+'\\,'+cT('dt'),a2='=3'+t+'^2+'+cH('C_1'),w1=texWidth(a1,60,false),w2=texWidth(a2,60,false),x0=600-(w1+w2+16)/2;
  s+=T(a1,x0,230,{size:60,anchor:'start'});
  s+=fade(seg(p,.35,.55),T(a2,x0+w1+16,230,{size:60,anchor:'start'}));
  s+=fade(seg(p,.6,.75),label('6t の 原始関数 ＋ 定数',600,380,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'v2']:(p)=>{
  let s=T('(3'+t+'^2)\'=6'+t,330,110,{size:48})+fade(seg(p,.05,.2),label('○ 検算',560,122,{size:28,color:ok,weight:700}));
  s+=fade(seg(p,.3,.45),T(t+'=0:\\;'+cV('v')+'='+cH('C_1')+'=1',600,240,{size:50}));
  const src=cV('v')+'=1+3'+t+'^2',w=texWidth(src,64,false);
  s+=fade(seg(p,.6,.75),T(src,600,390,{size:64})+highlight(600-w/2-24,330,w+48,110,1));
  return s;
 },
 [K+'x']:(p)=>{
  let s=T(cX('x')+'='+cH('\\int')+'(1+3'+t+'^2)\\,'+cT('dt')+'='+t+'+'+t+'^3+'+cH('C_2'),600,140,{size:52});
  s+=fade(seg(p,.55,.7),T('('+t+'+'+t+'^3)\'=1+3'+t+'^2',600,300,{size:50})+label('○ 検算',880,312,{size:28,color:ok,weight:700}));
  return s;
 },
 [K+'x2']:(p)=>{
  let s=T(t+'=0:\\;'+cX('x')+'='+cH('C_2')+'=2',330,90,{size:44});
  const src=cX('x')+'=2+'+t+'+'+t+'^3',w=texWidth(src,50,false);
  s+=fade(seg(p,.2,.35),T(src,850,90,{size:50})+highlight(850-w/2-20,40,w+40,90,1));
  s+=fade(seg(p,.45,.6),doors(p,{y:280,v0:'1 m/s',x0:'2 m'}));
  return s;
 },
 [K+'t2']:(p)=>{
  const A=axes({x:90,y:450,w:470,h:350,xmax:2.6,ymax:14,xticks:[1,2],yticks:[4,8,12],grid:true,xlabel:'t [s]',ylabel:'x [m]',xcolor:C.t,ycolor:C.x});
  let s=A.svg+A.plot(u=>2+u+u**3,{from:0,to:2.25,color:C.x,w:4})+dot(A.X(0),A.Y(2),8,C.hi);
  s+=fade(seg(p,.4,.55),dot(A.X(2),A.Y(12),10,C.hi)+line(A.X(2),A.Y(0),A.X(2),A.Y(12),{color:C.hi,w:2,dash:'5 6'})+line(A.X(0),A.Y(12),A.X(2),A.Y(12),{color:C.hi,w:2,dash:'5 6'})+label('12 m',A.X(2)-12,A.Y(12)-12,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=card(630,110,540,290,label('t ＝ 2 s',900,160,{size:28,color:C.t,anchor:'middle'})
   +fade(seg(p,.1,.25),T(cV('v')+'=1+12='+cV('13\\,\\mathrm{m/s}'),900,240,{size:42}))
   +fade(seg(p,.4,.55),T(cX('x')+'=2+2+8='+cX('12\\,\\mathrm{m}'),900,330,{size:42})),seg(p,.02,.15));
  return s;
 },
 [K+'check']:(p)=>{
  const A=axes({x:90,y:450,w:470,h:350,xmax:2.6,ymax:15,xticks:[1,2],yticks:[5,10,15],grid:true,xlabel:'t [s]',ylabel:'v [m/s]',xcolor:C.t,ycolor:C.v});
  let s=A.svg+fade(seg(p,.05,.2),under(A,u=>1+3*u*u,0,2))+A.plot(u=>1+3*u*u,{from:0,to:2.2,color:C.v,w:4})+label('v ＝ 1 ＋ 3t²',A.X(1.2),A.Y(9),{size:24,color:C.v,anchor:'end'});
  s+=card(600,90,570,340,T(cH('\\int_0^2')+'(1+3'+t+'^2)\\,'+cT('dt'),885,150,{size:40})
   +fade(seg(p,.15,.3),T('=\\Big['+t+'+'+t+'^3\\Big]_0^2=10-0='+cX('10\\,\\mathrm{m}'),885,240,{size:38}))
   +fade(seg(p,.55,.7),T('2+10='+cX('12\\,\\mathrm{m}'),885,330,{size:44})+label('○ 一致',885,395,{size:28,color:ok,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'why']:(p)=>{
  const A=GA();let s=A.svg+rect(A.X(0),A.Y(12),A.X(2)-A.X(0),A.Y(0)-A.Y(12),{fill:bad,fo:.1,stroke:bad,sw:2,rx:0})+under(A,u=>6*u,0,2,{fill:C.a,fo:.35})+A.plot(u=>6*u,{from:0,to:2.3,color:C.a,w:4});
  s+=label('実際の a',A.X(1.45),A.Y(4.5),{size:24,color:C.ink,anchor:'middle'});
  s+=card(630,120,540,260,label('途中の 加速度は 12 より 小さい',900,185,{size:28,color:C.a,anchor:'middle'})
   +fade(seg(p,.35,.5),label('ずっと 12 と した 見積もり',900,255,{size:28,color:bad,anchor:'middle'})+label('→ 大きすぎる（28 m）',900,305,{size:30,color:bad,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 // ===== S6 =====
 [K+'sum1']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=card(120,100,460,300,T(cH('\\int')+t+'^{\\,n}\\,'+cT('dt')+'=\\dfrac{'+t+'^{\\,n+1}}{n+1}+'+cH('C'),350,210,{size:42})+label('微分で 検算できる',350,320,{size:26,color:ok,anchor:'middle'}),seg(p,.02,.15));
  s+=card(620,100,460,300,label('例外 n ＝ −1',850,160,{size:28,color:bad,anchor:'middle',weight:700})+T(cH('\\int')+'\\dfrac{1}{'+t+'}\\,'+cT('dt')+'='+cX('\\ln|t|')+'+'+cH('C'),850,250,{size:42})+label('（t ≠ 0）',850,330,{size:24,color:C.t,anchor:'middle'}),seg(p,.5,.65),bad);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=label('加速度が 変わっても',600,80,{size:30,color:C.ink,anchor:'middle'});
  s+=doors(p,{y:240,v0:'初速度',x0:'初期位置'});
  s+=fade(seg(p,.5,.65),label('2回 積分 ＋ 初期条件 → 位置',600,470,{size:30,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=label('次の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(150,100,900,170,label('連鎖律・積の微分（中級：差の比で 確かめた）',600,165,{size:28,color:C.ink,anchor:'middle'})+label('どんな関数にも 言える 証明？',600,225,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=label('次の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(150,100,900,170,label('連鎖律・積の微分（中級：差の比で 確かめた）',600,165,{size:28,color:C.ink,anchor:'middle'})+label('どんな関数にも 言える 証明？',600,225,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=card(150,300,900,170,T('(\\ln|'+t+'|)\'=\\dfrac{1}{'+t+'}',600,375,{size:52})+label('本当？ どう 確かめる？',600,445,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
