// YouTube シリーズ「積分・上級 1/2」(ys-um-integral-1) — 図。Stage 1200×515.
// 色：高さ f 紫、右端 x・幅 h・s 金、面積 A・原始関数 F 水色、増えた帯 黄、低い長方形 m 緑、高い長方形 M 橙、ずれ・誤り 赤。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,poly,draw} from './anim.mjs';
import {card,T,cc,cV,cT,cX,cH} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='um-integral-1:';
const ok=C.F,bad=C.a,cm=C.F,cM=C.E;
const cG=s=>cc(cm,s),cO=s=>cc(cM,s),cR=s=>cc(bad,s);

// ---------- generic continuous curve on [0,4.6] ----------
const f1=s=>1.05+0.2*s+1.25*Math.exp(-((s-2.35)**2)/0.7);
const aL=0.45,xL=1.75,h0=0.95;
const GA=(o={})=>axes({x:90,y:450,w:520,h:350,xmax:4.6,ymax:3.3,xticks:[],yticks:[],grid:false,...o});
const curve=(A,fn=f1,p=1,o={})=>A.plot(fn,{from:0.1,to:4.4,p,color:C.v,w:4,...o});
function under(A,fn,from,to,{fill=C.x,fo=.3,stroke='none',sw=2}={}){
 if(Math.abs(to-from)<1e-4)return '';
 const lo=Math.min(from,to),hi=Math.max(from,to),N=60,pts=[[A.X(lo),A.Y(0)]];
 for(let i=0;i<=N;i++){const u=lo+(hi-lo)*i/N;pts.push([A.X(u),A.Y(fn(u))]);}
 pts.push([A.X(hi),A.Y(0)]);return poly(pts,{fill,fo,stroke,sw});
}
function minmax(fn,a,b){let m=Infinity,M=-Infinity,um=a,uM=a;for(let i=0;i<=200;i++){const u=a+(b-a)*i/200,v=fn(u);if(v<m){m=v;um=u;}if(v>M){M=v;uM=u;}}return {m,M,um,uM};}
const tick=(A,u,text,{color=C.t,g=1,dy=34}={})=>fade(g,line(A.X(u),A.Y(0)-8,A.X(u),A.Y(0)+8,{color,w:3})+label(text,A.X(u),A.Y(0)+dy,{size:26,color,anchor:'middle',weight:700}));
const vdash=(A,u,fn,color=C.t)=>line(A.X(u),A.Y(0),A.X(u),A.Y(fn(u)),{color,w:2,dash:'6 6'});
// rectangles of height m (inside, green) and M (covering, orange) over [x,x+h]
function mMrects(A,fn,x,h,gm=1,gM=1){
 const lo=Math.min(x,x+h),hi=Math.max(x,x+h),{m,M}=minmax(fn,lo,hi),X0=A.X(lo),W=A.X(hi)-A.X(lo);
 return fade(gM,rect(X0,A.Y(M),W,A.Y(0)-A.Y(M),{fill:cM,fo:.12,stroke:cM,sw:3,rx:0}))
  +fade(gm,rect(X0,A.Y(m),W,A.Y(0)-A.Y(m),{fill:cm,fo:.4,stroke:cm,sw:3,rx:0}));
}
const stripY=(A,fn,x,h,g=1,fo=.4)=>fade(g,under(A,fn,x,x+h,{fill:C.hi,fo,stroke:C.hi,sw:2}));
// base picture: area A from a to x (cyan), strip (yellow), curve
function scene(A,{x=xL,h=h0,area=1,strip=1,rects=[0,0],ticks=1,curveP=1}={}){
 let s=A.svg+fade(area,under(A,f1,aL,x))+(strip>0?stripY(A,f1,x,h,strip):'')+mMrects(A,f1,x,h,rects[0],rects[1])+curve(A,f1,curveP);
 s+=fade(ticks,tick(A,aL,'a')+tick(A,x,'x')+vdash(A,aL,f1)+vdash(A,x,f1));
 if(strip>0)s+=fade(strip*ticks,tick(A,x+h,h>0.45?'x+h':'',{dy:34})+vdash(A,x+h,f1));
 return s;
}
// zoomed s² graph around s = 1
const GS=(o={})=>axes({x:90,y:450,w:520,h:350,xmax:1.5,ymax:2.3,xticks:[0.5,1,1.5],yticks:[1,2],grid:true,xlabel:'s',xcolor:C.t,...o});
const sq=s=>s*s;
// number line for the squeeze: value → screen x
const NL=(v,lo=0.95,hi=1.25,x0=660,x1=1140)=>x0+(x1-x0)*(v-lo)/(hi-lo);

export const ytUmIntegral1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=card(80,90,480,320,label('微分・上級',320,140,{size:26,color:C.dim,anchor:'middle'})
   +T('(\\,'+cT('t')+'^{n})\'=n\\,'+cT('t')+'^{\\,n-1}',320,225,{size:46})
   +T('(\\sin '+cT('t')+')\'=\\cos '+cT('t'),320,310,{size:46})
   +label('差の商の 行き先',320,385,{size:26,color:C.v,anchor:'middle'}),seg(p,.02,.15));
  s+=arrow(580,250,700,250,{color:C.hi,w:5,g:seg(p,.5,.65)})+fade(seg(p,.55,.7),label('逆向き',640,220,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(720,90,420,320,label('今回：積分・上級',930,130,{size:26,color:C.hi,anchor:'middle'})+T(cH('\\int'),930,300,{size:90}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'mid']:(p)=>{
  const A=axes({x:90,y:450,w:500,h:340,xmax:4.6,ymax:4.8,xticks:[1,2,3,4],yticks:[1,2,3,4],grid:true});
  const x=mix(1.4,2.6,seg(p,.05,.6));
  let s=A.svg+poly([[A.X(0),A.Y(0)],[A.X(x),A.Y(0)],[A.X(x),A.Y(x)]],{fill:C.x,fo:.3})+A.plot(u=>u,{from:0,to:4.35,color:C.v,w:4})+line(A.X(x),A.Y(0),A.X(x),A.Y(x),{color:C.hi,w:3,dash:'6 6'});
  s+=label('f(x) ＝ x',A.X(3.3),A.Y(4.2),{size:26,color:C.v,anchor:'end'});
  s+=card(680,110,460,280,label('積分・中級',910,160,{size:26,color:C.dim,anchor:'middle'})+T(cX("A'(x)")+'='+cV('f(x)'),910,240,{size:56})
   +fade(seg(p,.5,.65),label('図で 納得した',910,330,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'num']:(p)=>{
  const x0=240,y0=440,w=180,h=260,th=64;
  let s=label('2 〜 2.1 の帯（拡大・模式図）',330,80,{size:24,color:C.dim,anchor:'middle'});
  s+=poly([[x0,y0],[x0,y0-h],[x0+w,y0-h-th],[x0+w,y0]],{fill:C.hi,fo:.3,stroke:C.hi,sw:2});
  s+=fade(seg(p,.4,.55),rect(x0,y0-h,w,h,{fill:C.x,fo:.25,stroke:C.x,sw:3,rx:0}));
  s+=draw([[x0-40,y0-h+14],[x0+w+40,y0-h-th-14]],1,{color:C.v,w:4});
  s+=label('幅 0.1',x0+w/2,y0+34,{size:24,color:C.t,anchor:'middle'});
  s+=card(640,110,500,300,label('f(x) ＝ x、右端 2 → 2.1',890,165,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.3),label('面積の 増え ＝ 0.205',890,240,{size:32,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.6),label('短冊の 見積もり ＝ 0.2',890,310,{size:32,color:C.x,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.6),label('（f(2) × 0.1）',890,355,{size:24,color:C.dim,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'num2']:(p)=>{
  const x0=240,y0=440,w=180,h=260,th=64;
  let s=label('2 〜 2.1 の帯（拡大・模式図）',330,80,{size:24,color:C.dim,anchor:'middle'});
  s+=rect(x0,y0-h,w,h,{fill:C.x,fo:.25,stroke:C.x,sw:3,rx:0});
  s+=poly([[x0,y0-h],[x0+w,y0-h],[x0+w,y0-h-th]],{fill:bad,fo:.7,stroke:bad,sw:2});
  s+=draw([[x0-40,y0-h+14],[x0+w+40,y0-h-th-14]],1,{color:C.v,w:4});
  s+=label('幅 0.1',x0+w/2,y0+34,{size:24,color:C.t,anchor:'middle'});
  s+=card(640,110,500,300,T('0.205-0.2='+cR('0.005'),890,190,{size:44})+label('上の 小さな 三角形',890,250,{size:26,color:bad,anchor:'middle'})
   +fade(seg(p,.5,.65),label('中級で 言えたのは',890,320,{size:26,color:C.ink,anchor:'middle'})+label('「ほぼ（≈）」まで',890,370,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'question']:(p)=>{
  let s=card(200,70,800,250,label('今回の問い',600,120,{size:26,color:C.dim,anchor:'middle'})
   +T(cX("A'(x)")+'\\;\\approx\\;'+cV('f(x)'),380,220,{size:46})+arrow(545,210,640,210,{color:C.hi,w:5})
   +T(cX("A'(x)")+'='+cV('f(x)'),810,220,{size:46})+label('「ほぼ」を 等号に できるか？',600,295,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.55,.7),label('中級 3/3 の 約束：「証明は 上級で」',600,400,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'tool']:(p)=>{
  let s=card(120,60,960,150,label('上級の 部品③',600,105,{size:26,color:C.hi,anchor:'middle',weight:700})
   +label('Σ は 有限個の和、∫ は 分割を 限りなく 細かくした 極限',600,170,{size:30,color:C.ink,anchor:'middle'}),seg(p,.02,.15));
  s+=card(170,250,400,190,label('有限の 幅',370,300,{size:28,color:C.dim,anchor:'middle'})+T('\\approx',370,390,{size:70}),seg(p,.3,.45));
  s+=card(630,250,400,190,label('限りなく 細かくした 行き先',830,300,{size:28,color:C.dim,anchor:'middle'})+T('=',830,390,{size:70,color:ok}),seg(p,.55,.7),ok);
  return s;
 },
 // ===== S2 帯を長方形ではさむ =====
 [K+'curve']:(p)=>{
  const A=GA();let s=A.svg+curve(A,f1,seg(p,.02,.5));
  s+=fade(seg(p,.3,.45),label('f',A.X(4.3),A.Y(f1(4.3))-16,{size:30,color:C.v,weight:700}));
  s+=card(680,140,460,220,label('途中で 跳ばない',910,205,{size:32,color:C.v,anchor:'middle',weight:700})+label('（つながった関数）',910,250,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.7),label('＝ 今回の 仮定',910,315,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'A']:(p)=>{
  const A=GA();const g=seg(p,.05,.35);
  let s=scene(A,{strip:0,area:g});
  s+=fade(g,label('A(x)',A.X((aL+xL)/2),A.Y(0.55),{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=card(680,120,460,280,T(cX('A(x)')+'='+cH('\\int_a^{x}')+cV('f(s)')+'\\,'+cT('ds'),910,210,{size:48})
   +label('a から x までの 面積',910,290,{size:28,color:C.x,anchor:'middle'})
   +fade(seg(p,.55,.7),label('上端を 変数にした 積分（中級）',910,345,{size:24,color:C.dim,anchor:'middle'})),seg(p,.02,.15));
  return s;
 },
 [K+'strip']:(p)=>{
  const A=GA();const h=h0*seg(p,.05,.4);
  let s=scene(A,{h:Math.max(h,.001),strip:h>.01?1:0});
  s+=fade(seg(p,.35,.5),line(A.X(xL),A.Y(0)-10,A.X(xL+h0),A.Y(0)-10,{color:C.t,w:7})+label('h',A.X(xL+h0/2),A.Y(0)-22,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=card(680,140,460,230,label('増えた 帯',910,195,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),T(cX('A(')+cT('x+h')+cX(')')+'-'+cX('A(')+cT('x')+cX(')'),910,290,{size:44})),seg(p,.1,.25));
  return s;
 },
 [K+'curved']:(p)=>{
  const A=GA();let s=scene(A);
  // highlight the curved top edge
  s+=fade(seg(p,.05,.2),A.plot(f1,{from:xL,to:xL+h0,color:C.hi,w:8}));
  s+=card(680,120,460,280,label('上の辺は 曲がっている',910,180,{size:28,color:C.ink,anchor:'middle'})+label('→ 長方形ではない',910,230,{size:28,color:bad,anchor:'middle'})
   +fade(seg(p,.5,.65),label('長方形 二つで',910,305,{size:30,color:C.hi,anchor:'middle',weight:700})+label('上下から はさむ',910,350,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'mM']:(p)=>{
  const A=GA();let s=scene(A);const {m,M,um,uM}=minmax(f1,xL,xL+h0);
  s+=fade(seg(p,.1,.25),dot(A.X(um),A.Y(m),10,cm)+line(A.X(um)-60,A.Y(m),A.X(xL+h0)+30,A.Y(m),{color:cm,w:2,dash:'5 5'})+label('m',A.X(um)-70,A.Y(m)+10,{size:30,color:cm,anchor:'end',weight:700}));
  s+=fade(seg(p,.35,.5),dot(A.X(uM),A.Y(M),10,cM)+line(A.X(xL)-60,A.Y(M),A.X(xL+h0)+30,A.Y(M),{color:cM,w:2,dash:'5 5'})+label('M',A.X(xL)-70,A.Y(M)+10,{size:30,color:cM,anchor:'end',weight:700}));
  s+=card(680,120,460,280,label('帯の中の f の',910,170,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.25),label('一番 小さい値 ＝ m',910,225,{size:30,color:cm,anchor:'middle',weight:700}))
   +fade(seg(p,.35,.5),label('一番 大きい値 ＝ M',910,285,{size:30,color:cM,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('（h を 変えると 変わる）',910,350,{size:24,color:C.dim,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'rects']:(p)=>{
  const A=GA();let s=scene(A,{rects:[seg(p,.05,.25),seg(p,.45,.65)]});
  s+=card(680,120,460,280,fade(seg(p,.05,.25),label('高さ m：帯の中に 収まる',910,200,{size:28,color:cm,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.65),label('高さ M：帯を 覆う',910,280,{size:28,color:cM,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'ineq']:(p)=>{
  const A=GA();let s=scene(A,{rects:[1,1]});
  s+=card(630,110,550,300,T(cG('m')+'\\,'+cT('h')+'\\;\\le\\;'+cX('A(x+h)-A(x)')+'\\;\\le\\;'+cO('M')+'\\,'+cT('h'),905,200,{size:34})
   +label('低い長方形 ≤ 帯 ≤ 高い長方形',905,275,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.7),label('≤ ：「以下」',905,350,{size:30,color:C.ink,anchor:'middle'})),seg(p,.02,.15));
  return s;
 },
 // ===== S3 割って、縮める =====
 [K+'ex']:(p)=>{
  const A=GS();let s=A.svg+fade(seg(p,.25,.4),under(A,sq,1,1.1,{fill:C.hi,fo:.45,stroke:C.hi,sw:2}))+A.plot(sq,{from:0,to:1.5,color:C.v,w:4});
  s+=label('f(s) ＝ s²',A.X(0.55),A.Y(1.9),{size:26,color:C.v,anchor:'middle'});
  s+=fade(seg(p,.45,.6),dot(A.X(1),A.Y(1),9,cm)+dot(A.X(1.1),A.Y(1.21),9,cM)+label('1',A.X(1)-18,A.Y(1)+8,{size:24,color:cm,anchor:'end',weight:700})+label('1.21',A.X(1.1)+22,A.Y(1.21)+12,{size:24,color:cM,weight:700}));
  s+=card(680,120,460,280,T(cT('x')+'=1,\\quad '+cT('h')+'=0.1',910,190,{size:44})
   +fade(seg(p,.45,.6),label('帯の中で f は',910,270,{size:28,color:C.dim,anchor:'middle'})+label('1 → 1.21 と 増える',910,320,{size:30,color:C.ink,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'ex2']:(p)=>{
  const A=GS();let s=A.svg;
  s+=fade(seg(p,.05,.2),rect(A.X(1),A.Y(1.21),A.X(1.1)-A.X(1),A.Y(0)-A.Y(1.21),{fill:cM,fo:.12,stroke:cM,sw:3,rx:0})+rect(A.X(1),A.Y(1),A.X(1.1)-A.X(1),A.Y(0)-A.Y(1),{fill:cm,fo:.4,stroke:cm,sw:3,rx:0}));
  s+=A.plot(sq,{from:0,to:1.5,color:C.v,w:4});
  s+=card(650,100,520,320,T(cG('m')+'=1,\\quad '+cO('M')+'=1.21',910,170,{size:44})
   +fade(seg(p,.35,.5),label('1 × 0.1 ＝ 0.1、　1.21 × 0.1 ＝ 0.121',910,262,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.75),T('0.1\\;\\le\\;'+cX('A(1.1)-A(1)')+'\\;\\le\\;0.121',910,350,{size:36})),seg(p,.02,.15));
  return s;
 },
 [K+'divide']:(p)=>{
  let s=T(cG('m')+'\\,'+cT('h')+'\\;\\le\\;'+cX('A(x+h)-A(x)')+'\\;\\le\\;'+cO('M')+'\\,'+cT('h'),600,140,{size:52});
  s+=fade(seg(p,.1,.3),label('各辺を h で 割る',600,250,{size:32,color:C.t,anchor:'middle',weight:700})+arrow(600,265,600,320,{color:C.t,w:4,head:14}));
  s+=fade(seg(p,.5,.65),card(300,350,600,110,label('h ＞ 0 → 不等号の 向きは そのまま',600,418,{size:30,color:C.ink,anchor:'middle'})));
  return s;
 },
 [K+'divide2']:(p)=>{
  let s=T(cG('m')+'\\,'+cT('h')+'\\;\\le\\;'+cX('A(x+h)-A(x)')+'\\;\\le\\;'+cO('M')+'\\,'+cT('h'),600,110,{size:44,opacity:.55});
  const mid='\\dfrac{'+cX('A(x+h)-A(x)')+'}{'+cT('h')+'}',src=cG('m')+'\\;\\le\\;'+mid+'\\;\\le\\;'+cO('M');
  s+=fade(seg(p,.02,.2),T(src,600,280,{size:58}));
  const wm=texWidth(mid,58,false),wl=texWidth(cG('m')+'\\;\\le\\;',58,false),wt=texWidth(src,58,false),x0=600-wt/2+wl;
  s+=fade(seg(p,.5,.65),highlight(x0-12,188,wm+24,170,1)+label('差の商（面積の関数）',x0+wm/2,395,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'shrink']:(p)=>{
  const rows=[['0.1','1','1.21'],['0.01','1','1.0201'],['0.001','1','1.002001']];
  let t=label('h',220,150,{size:28,color:C.t,anchor:'middle',weight:700})+label('m',420,150,{size:28,color:cm,anchor:'middle',weight:700})+label('差の商',640,150,{size:28,color:C.hi,anchor:'middle',weight:700})+label('M',880,150,{size:28,color:cM,anchor:'middle',weight:700});
  rows.forEach(([h,m,M],i)=>{const g=i===0?1:i===1?seg(p,.45,.6):0;const y=215+i*70;
   t+=fade(g,label(h,220,y,{size:32,color:C.t,anchor:'middle'})+label(m,420,y,{size:32,color:cm,anchor:'middle'})+label('≤  ?  ≤',640,y,{size:32,color:C.ink,anchor:'middle'})+label(M,880,y,{size:32,color:cM,anchor:'middle'}));});
  return card(120,100,960,330,t,seg(p,.02,.12));
 },
 [K+'shrink2']:(p)=>{
  const rows=[['0.1','1','1.21'],['0.01','1','1.0201'],['0.001','1','1.002001']];
  let t=label('h',220,150,{size:28,color:C.t,anchor:'middle',weight:700})+label('m',420,150,{size:28,color:cm,anchor:'middle',weight:700})+label('差の商',640,150,{size:28,color:C.hi,anchor:'middle',weight:700})+label('M',880,150,{size:28,color:cM,anchor:'middle',weight:700});
  rows.forEach(([h,m,M],i)=>{const g=i<2?1:seg(p,.05,.2);const y=215+i*70;
   t+=fade(g,label(h,220,y,{size:32,color:C.t,anchor:'middle'})+label(m,420,y,{size:32,color:cm,anchor:'middle'})+label('≤  ?  ≤',640,y,{size:32,color:C.ink,anchor:'middle'})+label(M,880,y,{size:32,color:cM,anchor:'middle'}));});
  t+=fade(seg(p,.55,.7),arrow(1000,190,1000,370,{color:cM,w:4,head:14})+label('1 へ',1030,300,{size:28,color:cM,weight:700}));
  return card(120,100,960,330,t);
 },
 [K+'squeeze']:(p)=>{
  const A=GA();const h=mix(h0,0.07,seg(p,.05,.75));
  let s=scene(A,{h,rects:[1,1]});
  const {m,M}=minmax(f1,xL,xL+h);
  s+=dot(A.X(xL),A.Y(f1(xL)),9,C.v);
  s+=card(680,110,460,300,label('h を 小さく すると',910,160,{size:26,color:C.dim,anchor:'middle'})
   +label('高さ m と M が 近づく',910,230,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.7,.85),T(cG('m')+'\\to'+cV('f(x)')+',\\quad '+cO('M')+'\\to'+cV('f(x)'),910,320,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'squeeze2']:(p)=>{
  // number line: m ≤ quotient ≤ M, both ends move to f(x)
  const u=seg(p,.05,.7),fx=1.0,m=mix(1.0,1.0,u),M=mix(1.21,1.025,u),q=mix(1.1033,1.012,u);
  const X=v=>NL(v,0.95,1.25,180,1020);
  let s=line(150,260,1050,260,{color:C.dim,w:3});
  s+=line(X(fx),240,X(fx),280,{color:C.v,w:4})+label('f(x)',X(fx),320,{size:28,color:C.v,anchor:'middle',weight:700});
  s+=rect(X(m),235,Math.max(2,X(M)-X(m)),50,{fill:C.hi,fo:.15,stroke:C.hi,sw:2,rx:6});
  s+=dot(X(m),260,11,cm)+label('m',X(m)-4,210,{size:28,color:cm,anchor:'end',weight:700});
  s+=dot(X(M),260,11,cM)+label('M',X(M)+4,210,{size:28,color:cM,weight:700});
  s+=dot(X(q),260,8,C.hi);
  s+=label('差の商は この間',600,120,{size:30,color:C.hi,anchor:'middle'});
  s+=fade(seg(p,.7,.85),label('はさみうち：行き先は f(x) だけ',600,410,{size:34,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ftc']:(p)=>{
  let s=T('\\lim_{'+cT('h')+'\\to0}\\dfrac{'+cX('A(x+h)-A(x)')+'}{'+cT('h')+'}='+cV('f(x)'),600,130,{size:48});
  {const w=texWidth(cX("A'(x)")+'='+cV('f(x)'),70,false);s+=fade(seg(p,.1,.3),T(cX("A'(x)")+'='+cV('f(x)'),600,270,{size:70})+highlight(600-w/2-24,205,w+48,115,1));}
  s+=fade(seg(p,.45,.6),card(160,360,400,110,label('有限の h：≈',360,428,{size:32,color:C.ink,anchor:'middle'})));
  s+=fade(seg(p,.6,.75),card(640,360,400,110,label('h → 0 の 行き先：＝',840,428,{size:32,color:ok,anchor:'middle',weight:700}),1,ok));
  return s;
 },
 [K+'neg']:(p)=>{
  const A=GA();const h=-0.8;
  let s=A.svg+under(A,f1,aL,xL+h)+stripY(A,f1,xL,h,1)+mMrects(A,f1,xL,h,1,1)+curve(A,f1);
  s+=tick(A,aL,'a')+tick(A,xL,'x')+tick(A,xL+h,'x+h')+vdash(A,xL,f1)+vdash(A,xL+h,f1);
  s+=card(680,140,460,220,label('h ＜ 0：帯を 左側に とる',910,200,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('同じ はさみ方',910,265,{size:28,color:C.hi,anchor:'middle'})+label('→ 行き先は f(x)',910,315,{size:30,color:ok,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 // ===== S4 原始関数で F(b)−F(a) へ =====
 [K+'F']:(p)=>{
  let s=card(150,80,900,150,label('A(x) を 直接 求めるのは 大変',600,165,{size:32,color:C.ink,anchor:'middle'}),seg(p,.02,.15));
  s+=card(150,270,900,190,T(cX("F'(x)")+'='+cV('f(x)'),600,345,{size:56})+label('原始関数 F（どれか 一つ）',600,420,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.45,.6),C.x);
  return s;
 },
 [K+'diff0']:(p)=>{
  let s=T('('+cX('A')+'-'+cX('F')+')\'',600,120,{size:56});
  s+=fade(seg(p,.1,.3),T('='+cX("A'")+'-'+cX("F'"),600,220,{size:52}));
  s+=fade(seg(p,.3,.5),T('='+cV('f')+'-'+cV('f')+'=0',600,320,{size:52}));
  s+=fade(seg(p,.6,.75),label('A と F の差は、どこでも 傾き 0',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'const']:(p)=>{
  const A=axes({x:90,y:440,w:520,h:330,xmax:4.6,ymax:3,xticks:[],yticks:[],grid:false,xlabel:'x',xcolor:C.t});
  let s=A.svg+line(A.X(0.1),A.Y(1.6),A.X(4.4),A.Y(1.6),{color:C.x,w:4});
  [1,2.2,3.4].forEach((u,i)=>{s+=fade(seg(p,.1+i*.1,.2+i*.1),line(A.X(u-.35),A.Y(1.6),A.X(u+.35),A.Y(1.6),{color:C.hi,w:7})+dot(A.X(u),A.Y(1.6),8,C.hi));});
  s+=label('A − F',A.X(4.4),A.Y(1.6)-18,{size:26,color:C.x,anchor:'end',weight:700});
  s+=card(680,120,460,280,label('傾き いつも 0',910,180,{size:30,color:C.hi,anchor:'middle',weight:700})+label('→ 増えも 減りもしない ＝ 定数',910,235,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('前提（証明しない）',910,315,{size:30,color:C.E,anchor:'middle',weight:700})+label('平均値の定理で 示せる',910,360,{size:24,color:C.dim,anchor:'middle'})),seg(p,.02,.15));
  return s;
 },
 [K+'AFc']:(p)=>{
  let s=T(cX('A(x)')+'-'+cX('F(x)')+'='+cH('c'),600,150,{size:56});
  s+=fade(seg(p,.2,.4),T(cX('A(x)')+'='+cX('F(x)')+'+'+cH('c'),600,300,{size:64}));
  s+=fade(seg(p,.55,.7),label('c：まだ 分からない 定数',600,420,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'fixc']:(p)=>{
  let s=T(cX('A(x)')+'='+cX('F(x)')+'+'+cH('c'),600,90,{size:44,opacity:.6});
  s+=fade(seg(p,.02,.15),label('x ＝ a を 入れる',600,165,{size:28,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.15,.3),T(cX('A(a)')+'=0',330,250,{size:46})+label('（幅 0 の 面積）',330,310,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),T('0='+cX('F(a)')+'+'+cH('c'),850,250,{size:46}));
  {const w=texWidth(cH('c')+'=-'+cX('F(a)'),58,false);s+=fade(seg(p,.65,.8),T(cH('c')+'=-'+cX('F(a)'),600,420,{size:58})+highlight(600-w/2-22,362,w+44,105,1));}
  return s;
 },
 [K+'result']:(p)=>{
  let s=T(cX('A(x)')+'='+cX('F(x)')+'-'+cX('F(a)'),600,120,{size:54});
  s+=fade(seg(p,.35,.5),label('x ＝ b',600,210,{size:28,color:C.t,anchor:'middle'})+arrow(600,225,600,265,{color:C.t,w:4,head:12}));
  const src=cH('\\int_a^b')+cV('f(x)')+'\\,'+cT('dx')+'='+cX('F(b)')+'-'+cX('F(a)'),w=texWidth(src,60,false);
  s+=fade(seg(p,.45,.65),T(src,600,350,{size:60})+highlight(600-w/2-26,285,w+52,130,1));
  s+=fade(seg(p,.7,.85),label('導いた 結果',600,470,{size:28,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 差の鎖 =====
 ...(()=>{
  const Ff=u=>0.25+0.55*u+0.08*u*u;   // increasing F on [0,4.4]
  const GF=()=>axes({x:90,y:450,w:470,h:330,xmax:4.6,ymax:3.6,xticks:[],yticks:[],grid:false});
  const xs=[0.5,1.3,2.1,2.9,3.7];
  const cols=[C.hi,C.E,C.p,C.F];
  function graph(p,{rises=1,tan=0}={}){
   const A=GF();let s=A.svg+A.plot(Ff,{from:0.2,to:4.3,color:C.x,w:4})+label('F',A.X(4.3)+8,A.Y(Ff(4.3))+8,{size:28,color:C.x,weight:700});
   xs.forEach((u,i)=>{s+=line(A.X(u),A.Y(0)-8,A.X(u),A.Y(0)+8,{color:C.t,w:3})+label('x'+'₀₁₂₃₄'[i],A.X(u),A.Y(0)+34,{size:24,color:C.t,anchor:'middle'});});
   s+=label('a',A.X(xs[0])-4,A.Y(0)+64,{size:22,color:C.t,anchor:'middle'})+label('b',A.X(xs[4]),A.Y(0)+64,{size:22,color:C.t,anchor:'middle'});
   for(let i=0;i<4;i++){const g=typeof rises==='number'?rises:rises(i);
    s+=fade(g,line(A.X(xs[i]),A.Y(Ff(xs[i])),A.X(xs[i+1]),A.Y(Ff(xs[i])),{color:C.dim,w:2,dash:'5 5'})+line(A.X(xs[i+1]),A.Y(Ff(xs[i])),A.X(xs[i+1]),A.Y(Ff(xs[i+1])),{color:cols[i],w:6}));
    if(tan>0){const sl=0.55+0.16*xs[i];s+=fade(tan,line(A.X(xs[i]),A.Y(Ff(xs[i])),A.X(xs[i+1]),A.Y(Ff(xs[i])+sl*0.8),{color:C.v,w:3}));}
   }
   xs.forEach(u=>{s+=dot(A.X(u),A.Y(Ff(u)),7,C.x);});
   return {s,A};
  }
  // token row: [F(x1)-F(x0)] + [F(x2)-F(x1)] + ...
  const toks=[];for(let i=0;i<4;i++){if(i)toks.push({t:'+'});toks.push({t:'['},{t:cX(`F(x_${i+1})`),id:`p${i+1}`},{t:'-'},{t:cX(`F(x_${i})`),id:`m${i}`},{t:']'});}
  const SZ=37;toks.forEach(k=>{k.w=texWidth(k.t,SZ,false);});
  const gap=6,tot=toks.reduce((a,k)=>a+k.w+gap,0);
  function row(y,{show=()=>1,strike=()=>0,dim=()=>0}={},x0=600-tot/2){
   let s='',x=x0,ti=0,bi=-1;
   toks.forEach(k=>{if(k.t==='[')bi++;const g=show(bi);s+=fade(g*(1-.7*dim(k.id)),T(k.t,x+k.w/2,y,{size:SZ}));
    const st=strike(k.id);if(st>0)s+=fade(g,line(x-2,y+14,x-2+(k.w+4)*st,y-26,{color:bad,w:4}));x+=k.w+gap;ti++;});
   return s;
  }
  const idx=id=>({p1:1,m1:1,p2:2,m2:2,p3:3,m3:3})[id]??0;
  return {
   [K+'chain']:(p)=>{
    const {s}=graph(p,{rises:i=>seg(p,.4+i*.1,.5+i*.1)});
    return s+card(620,130,540,250,label('a から b を 4つに 分ける',890,190,{size:28,color:C.ink,anchor:'middle'})
     +fade(seg(p,.35,.5),label('区切り：x₀, x₁, x₂, x₃, x₄',890,260,{size:28,color:C.t,anchor:'middle'}))
     +fade(seg(p,.6,.75),label('色の線 ＝ 各区間での F の 増え',890,325,{size:24,color:C.dim,anchor:'middle'})),seg(p,.02,.15));
   },
   [K+'chain2']:(p)=>{
    let s=label('F の 増えを 並べて 足す',600,90,{size:28,color:C.dim,anchor:'middle'});
    s+=row(230,{show:b=>b===0?seg(p,.05,.25):b===1?seg(p,.45,.6):seg(p,.75,.9)});
    return s;
   },
   [K+'chain3']:(p)=>{
    let s=label('隣どうしで 消える',600,90,{size:28,color:bad,anchor:'middle',weight:700});
    const st=id=>{const i=idx(id);return i?seg(p,.05+(i-1)*.28,.2+(i-1)*.28):0;};
    s+=row(230,{strike:st});
    return s;
   },
   [K+'chain4']:(p)=>{
    let s=row(130,{strike:id=>idx(id)?1:0,dim:id=>idx(id)?1:0});
    s+=fade(seg(p,.05,.25),T('='+cX('F(x_4)')+'-'+cX('F(x_0)')+'='+cX('F(b)')+'-'+cX('F(a)'),600,270,{size:52}));
    s+=fade(seg(p,.55,.7),label('何個に 分けても 同じ',600,410,{size:32,color:ok,anchor:'middle',weight:700}));
    return s;
   },
   [K+'chain5']:(p)=>{
    const {s:gs}=graph(p,{tan:seg(p,.05,.2)});
    let s=gs+card(590,70,590,400,T(cX('F(x_{i+1})-F(x_i)')+'\\approx'+cV('f(x_i)')+'\\,'+cT('\\Delta x'),885,130,{size:36})
     +label('傾き × 幅（紫の線）',885,178,{size:24,color:C.v,anchor:'middle'})
     +fade(seg(p,.35,.5),T('\\sum'+cV('f(x_i)')+'\\,'+cT('\\Delta x')+'\\approx'+cX('F(b)')+'-'+cX('F(a)'),885,260,{size:40}))
     +fade(seg(p,.6,.75),label('細かくした 行き先で ＝',885,330,{size:24,color:ok,anchor:'middle',weight:700})+T(cH('\\int_a^b')+cV('f(x)')+'\\,'+cT('dx')+'='+cX('F(b)')+'-'+cX('F(a)'),885,410,{size:40})),seg(p,.02,.12));
    return s;
   },
  };
 })(),
 // ===== S6 確かめと次の問い =====
 [K+'check']:(p)=>{
  let s=T(cV('f(s)')+'='+cT('s')+'^2',600,100,{size:48});
  s+=fade(seg(p,.1,.3),T(cX('F(s)')+'=\\dfrac{'+cT('s')+'^3}{3}',600,210,{size:52})+label('原始関数',745,220,{size:26,color:C.x}));
  s+=fade(seg(p,.45,.65),T('\\left(\\dfrac{'+cT('s')+'^3}{3}\\right)\'=\\dfrac{3'+cT('s')+'^2}{3}='+cT('s')+'^2',600,360,{size:52}));
  s+=fade(seg(p,.75,.9),label('（微分・上級 1/3 の 3s²）',600,465,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'check2']:(p)=>{
  let s=label('1 から 1.1 の 帯',600,80,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.25),T('\\dfrac{1.1^3}{3}-\\dfrac{1^3}{3}',600,190,{size:52}));
  s+=fade(seg(p,.35,.55),T('=\\dfrac{1.331-1}{3}=\\dfrac{0.331}{3}',600,320,{size:48}));
  s+=fade(seg(p,.65,.8),T('\\approx 0.1103',600,440,{size:52,color:C.hi}));
  return s;
 },
 [K+'check3']:(p)=>{
  let s=T('\\dfrac{0.1103}{0.1}\\approx 1.103',600,120,{size:52});
  const X=v=>NL(v,0.95,1.25,200,1000);
  s+=fade(seg(p,.3,.45),line(170,300,1030,300,{color:C.dim,w:3})+rect(X(1),278,X(1.21)-X(1),44,{fill:C.hi,fo:.12,stroke:C.hi,sw:2,rx:6})
   +dot(X(1),300,10,cm)+label('m ＝ 1',X(1),260,{size:26,color:cm,anchor:'middle',weight:700})
   +dot(X(1.21),300,10,cM)+label('M ＝ 1.21',X(1.21),260,{size:26,color:cM,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),dot(X(1.103),300,10,C.hi)+label('1.103',X(1.103),350,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('○ はさみの 間に 入っている',600,440,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=label('確認',600,90,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),T(cH('\\int_0^3')+cT('s')+'^2\\,'+cT('ds')+'=\\;?',600,260,{size:70}));
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=label('確認',600,80,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=T(cH('\\int_0^3')+cT('s')+'^2\\,'+cT('ds')+'=\\dfrac{3^3}{3}-\\dfrac{0^3}{3}=9-0='+cX('9'),600,210,{size:54});
  s+=fade(seg(p,.5,.65),label('短冊を 数えずに、引き算 1回',600,380,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  const rows=[['仮定','f は 途中で 跳ばない（連続）',C.E],['前提','傾きが いつも 0 なら 定数',C.E],['導いた 結果','A′(x) ＝ f(x)、定積分 ＝ F(b) − F(a)',ok]];
  let s=label('整理',600,70,{size:30,color:C.hi,anchor:'middle',weight:700});
  rows.forEach(([a,b,col],i)=>{s+=card(120,100+i*115,960,95,label(a,160,158+i*115,{size:28,color:col,weight:700})+label(b,1050,158+i*115,{size:30,color:C.ink,anchor:'end'}),seg(p,.02+i*.25,.12+i*.25));});
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(200,80,800,150,label('原始関数が 見つかれば',600,140,{size:28,color:C.dim,anchor:'middle'})+label('積分 ＝ 引き算 1回',600,200,{size:34,color:ok,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(120,270,450,200,T('\\int '+cT('t')+'^{\\,n}\\,'+cT('dt')+'=\\;?',345,350,{size:50})+label('使えない n は？',345,430,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(200,80,800,150,label('原始関数が 見つかれば',600,140,{size:28,color:C.dim,anchor:'middle'})+label('積分 ＝ 引き算 1回',600,200,{size:34,color:ok,anchor:'middle',weight:700}));
  s+=card(120,270,450,200,T('\\int '+cT('t')+'^{\\,n}\\,'+cT('dt')+'=\\;?',345,350,{size:50})+label('使えない n は？',345,430,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=card(630,270,450,200,label('加速度が 時間で 変わる',855,330,{size:28,color:C.a,anchor:'middle'})+label('位置は どう 求める？',855,400,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
