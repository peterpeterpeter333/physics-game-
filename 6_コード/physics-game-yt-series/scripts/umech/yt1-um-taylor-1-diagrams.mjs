// YouTube シリーズ「近似・上級 1/2」(ys-um-taylor-1) — 図。Stage 1200×515.
// 色：f とその微分 紫、係数 c 黄、割る数・階乗 橙、x と k 金、本当の値 水色、ずれ・消える項 赤、導いた結果 緑。
import {C,seg,fade,label,line,rect,dot,arrow,highlight,axes,tex,texWidth,draw} from './anim.mjs';
import {card,T,cc,cV,cT,cX,cH} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='um-taylor-1:';
const ok=C.F,bad=C.a;
const cE=s=>cc(C.E,s),cR=s=>cc(bad,s),cG=s=>cc(ok,s);

// horizontal chain of TeX items joined by "微分" arrows
function chain(items,y,{size=46,gap=110,g=()=>1,lab='微分'}={}){
 const ws=items.map(t=>texWidth(t,size,false));
 const tot=ws.reduce((a,b)=>a+b,0)+gap*(items.length-1);
 let x=600-tot/2,s='';
 items.forEach((t,i)=>{
  const gi=g(i);
  if(i>0){s+=fade(gi,arrow(x-gap+18,y-12,x-18,y-12,{color:C.v,w:4,head:12})+label(lab,x-gap/2,y-40,{size:22,color:C.v,anchor:'middle'}));}
  s+=fade(gi,T(t,x+ws[i]/2,y,{size}));x+=ws[i]+gap;
 });
 return s;
}
// row of divisors 1,1,2,6,…
function divisors(vals,y,{g=()=>1,hl=-1,size=44,dx=150}={}){
 const x0=600-dx*(vals.length-1)/2;let s='';
 vals.forEach((v,i)=>{const X=x0+dx*i;
  s+=fade(g(i),rect(X-55,y-50,110,80,{fill:i===hl?C.hi:C.E,fo:i===hl?.2:.1,stroke:i===hl?C.hi:C.E,sw:2,rx:10})+T(v,X,y,{size,color:i===hl?C.hi:C.E}));});
 return s;
}

// survive table: rows = terms, cols = 1回, 2回, 3回, x=0
const TROWS=[
 ['c_0',['0','0','0'],'0'],
 ['c_1x',['c_1','0','0'],'0'],
 ['c_2x^2',['2c_2x','2c_2','0'],'0'],
 ['c_3x^3',['3c_3x^2','6c_3x','6c_3'],'6c_3'],
 ['c_4x^4',['4c_4x^3','12c_4x^2','24c_4x'],'0'],
];
function table(p,{rows=[1,1,1,1,1],hl=-1,box=0}={}){
 const cx=[210,420,610,800,990],y0=120,dy=66;
 let s=rect(110,80,980,y0+dy*5-50,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 ['項','1回','2回','3回','x ＝ 0'].forEach((h,i)=>{s+=label(h,cx[i],y0,{size:26,color:i===4?C.t:C.v,anchor:'middle',weight:700});});
 s+=line(130,y0+18,1070,y0+18,{color:C.faint,w:2});
 TROWS.forEach(([term,ds,end],r)=>{
  const g=rows[r];if(g<=0)return;const y=y0+dy*(r+1)+6;
  let t=T(cH(term),cx[0],y,{size:32});
  ds.forEach((d,i)=>{t+=T(d==='0'?cR('0'):cH(d),cx[i+1],y,{size:30});});
  t+=T(end==='0'?cR('0'):cG(end),cx[4],y,{size:34});
  if(r===hl)t=highlight(125,y-40,950,58,1)+t;
  s+=fade(g,t);
 });
 if(box>0){const y=y0+dy*4+6;s+=fade(box,rect(cx[4]-70,y-42,140,62,{fill:'none',fo:0,stroke:ok,sw:4,rx:10}));}
 return s;
}

// e^x graph
const GE=()=>axes({x:80,y:455,w:520,h:380,xmin:-1,xmax:2.3,ymin:0,ymax:8,xticks:[-1,1,2],yticks:[2,4,6,8],grid:true,xlabel:'x',xcolor:C.t});
const P1=x=>1+x,P2=x=>1+x+x*x/2,P3=x=>1+x+x*x/2+x*x*x/6;
function egraph(A,{g1=1,g2=1,g3=1,ge=1}={}){
 let s=A.svg;
 s+=fade(g1,A.plot(P1,{from:-1,to:2.25,color:C.E,w:3,dash:'8 6'}));
 s+=fade(g2,A.plot(P2,{from:-1,to:2.25,color:C.p,w:3,dash:'8 6'}));
 s+=fade(g3,A.plot(P3,{from:-1,to:2.25,color:C.F,w:3}));
 s+=fade(ge,A.plot(Math.exp,{from:-1,to:2.08,color:C.x,w:5})+label('eˣ',A.X(2.08)+10,A.Y(Math.exp(2.08))+26,{size:28,color:C.x,weight:700}));
 return s;
}
function elegend(g1,g2,g3){
 return fade(g1,line(90,48,130,48,{color:C.E,w:3,dash:'8 6'})+label('1次',138,56,{size:22,color:C.E}))
  +fade(g2,line(210,48,250,48,{color:C.p,w:3,dash:'8 6'})+label('2次',258,56,{size:22,color:C.p}))
  +fade(g3,line(330,48,370,48,{color:C.F,w:3})+label('3次',378,56,{size:22,color:C.F}));
}
// value table for x = 0.1
function etable(p,{rows=[1,1,1,1],cmp=0}={}){
 const R=[['1次','1.1','1.1',C.E],['2次','1.105','1.105',C.p],['3次','1.1051667','1.1051',C.F],['本当','1.1051709','',C.x]];
 let s=card(640,70,520,390,label('x ＝ 0.1',900,115,{size:28,color:C.t,anchor:'middle',weight:700}));
 R.forEach(([n,v,same,col],i)=>{const y=190+i*72;if(rows[i]<=0)return;
  let t=label(n,690,y,{size:26,color:col,weight:700});
  if(cmp>0&&same&&i<3){const w=texWidth('\\mathrm{'+v+'}',36,false),ws=texWidth('\\mathrm{'+same+'}',36,false);
   t+=fade(cmp,rect(1100-w-6,y-34,ws+12,46,{fill:C.hi,fo:.35,stroke:'none',rx:6}));}
  t+=T('\\mathrm{'+v+'}',1100,y,{size:36,anchor:'end'});
  s+=fade(rows[i],t);});
 s+=fade(cmp,label('黄色：本当の値と 合う桁',900,445,{size:22,color:C.hi,anchor:'middle'}));
 return s;
}

export const ytUmTaylor1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=card(150,60,900,150,label('微分の法則・上級 2/2 の 最後の問い',600,110,{size:26,color:C.dim,anchor:'middle'})
   +label('曲線を 多項式で 置き換えるとき、一般の 係数は？',600,170,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=fade(seg(p,.35,.5),T(cV('f(x)')+'\\approx'+cH('c_0')+'+'+cH('c_1')+'x+'+cH('c_2')+'x^2+'+cH('c_3')+'x^3+\\cdots',600,320,{size:50}));
  s+=fade(seg(p,.55,.7),label('? ? ?',600,420,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mid']:(p)=>{
  let s=label('近似・中級 2/2',600,70,{size:26,color:C.dim,anchor:'middle'});
  s+=T(cV('f(x)')+'\\approx'+cH('c_0')+'+'+cH('c_1')+'x+'+cH('c_2')+'x^2+'+cH('c_3')+'x^3',600,150,{size:46});
  s+=fade(seg(p,.3,.45),label('x ＝ 0 で 値と 微分を f と そろえる',600,240,{size:30,color:C.t,anchor:'middle'}));
  const R=[['c_0',"f(0)"],['c_1',"f'(0)"],['c_2',"f''(0)"],['c_3',"f'''(0)"]];
  R.forEach(([c,f],i)=>{s+=fade(seg(p,.5+i*.08,.6+i*.08),T(cH(c)+'\\leftrightarrow'+cV(f),195+i*270,350,{size:36}));});
  return s;
 },
 [K+'mid2']:(p)=>{
  const R=[['c_0',"f(0)",'1'],['c_1',"f'(0)",'1'],['c_2',"f''(0)",'2'],['c_3',"f'''(0)",'6']];
  let s='';
  R.forEach(([c,f,d],i)=>{s+=fade(seg(p,.02+i*.08,.12+i*.08),T(cH(c)+'=\\dfrac{'+cV(f)+'}{'+cE(d)+'}',195+i*270,130,{size:40}));});
  s+=fade(seg(p,.5,.65),card(200,250,800,210,label('sin x：x ＝ 0 で 0、1、0、−1',600,300,{size:28,color:C.v,anchor:'middle'})
   +T('\\sin x\\approx 0+\\dfrac{1}{'+cE('1')+'}x+0-\\dfrac{1}{'+cE('6')+'}x^3=x-\\dfrac{x^3}{6}',600,395,{size:44})));
  return s;
 },
 [K+'pattern']:(p)=>{
  let s=label('割る数',600,80,{size:30,color:C.E,anchor:'middle',weight:700});
  s+=divisors(['1','1','2','6','?','120'],190,{g:i=>i<4?1:i===4?seg(p,.1,.25):seg(p,.35,.5),dx:160});
  s+=label('0次',600-160*2.5,265,{size:22,color:C.dim,anchor:'middle'})+label('5次',600+160*2.5,265,{size:22,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.55,.7),T(cE('120')+'=1\\times2\\times3\\times4\\times5',600,380,{size:48}));
  s+=fade(seg(p,.7,.85),label('（近似・中級 2/2 の x⁵ の 項）',600,450,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'question']:(p)=>{
  let s=card(180,70,840,190,label('今回の問い',600,120,{size:26,color:C.dim,anchor:'middle'})
   +label('k 次の 係数を、一般に どう 決めるか',600,200,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.45,.6),label('割る数 1、1、2、6、… は なぜ この並び？',600,340,{size:32,color:C.E,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=label('予想',600,80,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=divisors(['1','1','2','6','?'],230,{hl:4,dx:170});
  ['0次','1次','2次','3次','4次'].forEach((n,i)=>{s+=label(n,600-170*2+170*i,310,{size:24,color:C.dim,anchor:'middle'});});
  s+=fade(seg(p,.4,.55),label('4次の 割る数は いくつ？',600,420,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S2 xᵏ を k 回微分 =====
 [K+'x2']:(p)=>{
  let s=label('x² を 2回 微分',600,80,{size:28,color:C.dim,anchor:'middle'});
  s+=chain(['x^2','2x',cE('2')],240,{size:60,g:i=>i===0?1:i===1?seg(p,.2,.35):seg(p,.5,.65)});
  return s;
 },
 [K+'x3']:(p)=>{
  let s=label('x³ を 3回 微分',600,80,{size:28,color:C.dim,anchor:'middle'});
  s+=chain(['x^3','3x^2','6x',cE('6')],220,{size:56,g:i=>i===0?1:seg(p,.05+i*.12,.15+i*.12)});
  s+=fade(seg(p,.6,.75),T(cE('6')+'=3\\times2\\times1',600,380,{size:52}));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=chain(['x^3','3x^2','6x',cE('6')],110,{size:40,g:()=>.55});
  s+=fade(seg(p,.05,.2),T('(x^{'+cT('n')+'})\'='+cT('n')+'\\,x^{'+cT('n')+'-1}',600,290,{size:66}));
  s+=fade(seg(p,.25,.4),label('指数が 前に 降りて 掛かる',380,420,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('指数は 1 つ 減る',830,420,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('（微分・上級 1/3 で 導いた 形）',600,480,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'x4']:(p)=>{
  let s=label('x⁴ を 4回 微分',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=chain(['x^4','4x^3','12x^2','24x',cE('24')],200,{size:48,gap:100,g:i=>i===0?1:seg(p,.03+i*.08,.1+i*.08)});
  s+=fade(seg(p,.45,.6),T(cE('24')+'=4\\times3\\times2\\times1',600,340,{size:52}));
  s+=fade(seg(p,.7,.85),label('予想の 答え：24',600,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fact']:(p)=>{
  let s='';
  s+=T('x^{'+cT('k')+'}',320,200,{size:66});
  s+=arrow(420,188,620,188,{color:C.v,w:5,head:14})+label('k 回 微分',520,150,{size:26,color:C.v,anchor:'middle'});
  s+=fade(seg(p,.2,.4),T(cT('k')+'\\times('+cT('k')+'-1)\\times\\cdots\\times2\\times1',900,200,{size:48}));
  s+=fade(seg(p,.5,.65),label('k から 1 までの 整数を 全部 掛けた 数',600,360,{size:32,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'def']:(p)=>{
  let s=card(200,60,800,170,T(cE(cT('k')+'!')+'=1\\times2\\times\\cdots\\times'+cT('k'),600,145,{size:58})+label('k の 階乗',600,205,{size:26,color:C.E,anchor:'middle'}),seg(p,.02,.15),C.E);
  s+=fade(seg(p,.4,.55),T(cE('3!')+'=6,\\qquad '+cE('4!')+'=24',600,320,{size:52}));
  s+=fade(seg(p,.7,.85),label('記号の 定義',600,440,{size:32,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zero']:(p)=>{
  const ks=['0','1','2','3','4'],fs=['1','1','2','6','24'];
  let s=card(200,60,800,250,'');
  s+=label('k',270,135,{size:30,color:C.t,anchor:'middle',weight:700})+label('k!',270,235,{size:30,color:C.E,anchor:'middle',weight:700});
  ks.forEach((k,i)=>{const X=420+i*140;s+=label(k,X,135,{size:32,color:C.t,anchor:'middle'});
   s+=fade(i===0?seg(p,.45,.6):1,label(fs[i],X,235,{size:36,color:C.E,anchor:'middle',weight:700}));});
  s+=line(230,170,970,170,{color:C.faint,w:2});
  s+=fade(seg(p,.05,.2),highlight(370,95,100,175,1));
  s+=fade(seg(p,.2,.35),T('x^0=1',360,380,{size:44})+label('（0回 微分 ＝ 何もしない）',360,440,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('0! ＝ 1 も 定義',860,392,{size:32,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 生き残るのは1項だけ =====
 [K+'poly']:(p)=>{
  const terms=['c_0','c_1x','c_2x^2','c_3x^3','c_4x^4'];
  let s=label('x ＝ 0 の 近くで',600,90,{size:28,color:C.t,anchor:'middle'});
  s+=T(cV('f(x)')+'='+terms.map((t,i)=>cH(t)).join('+')+'+\\cdots',600,230,{size:50});
  s+=fade(seg(p,.5,.65),label('c₀、c₁、… は これから 決める 係数',600,370,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'d3']:(p)=>{
  let s=T(cV('f(x)')+'='+cH('c_0')+'+'+cH('c_1x')+'+'+cH('c_2x^2')+'+'+cH('c_3x^3')+'+'+cH('c_4x^4')+'+\\cdots',600,110,{size:42});
  s+=fade(seg(p,.05,.2),label('3次の 係数 c₃ を 決める',600,210,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),arrow(600,240,600,300,{color:C.v,w:4,head:12})+label('全体を 3回 微分 → x ＝ 0 を 入れる',600,360,{size:32,color:C.v,anchor:'middle'}));
  return s;
 },
 [K+'low']:(p)=>table(p,{rows:[seg(p,.02,.15),seg(p,.1,.25),seg(p,.3,.5),0,0],hl:2}),
 [K+'mid3']:(p)=>table(p,{rows:[1,1,1,seg(p,.05,.25),0],hl:3}),
 [K+'high']:(p)=>table(p,{rows:[1,1,1,1,seg(p,.05,.25)],hl:4}),
 [K+'survive']:(p)=>{
  let s=fade(1-.7*seg(p,.35,.5),table(p,{rows:[1,1,1,1,1]}));
  {const y=120+66*4+6;s+=fade(seg(p,.02,.15),rect(990-70,y-42,140,62,{fill:'#131f38',fo:1,stroke:ok,sw:4,rx:10})+T(cG('6c_3'),990,y,{size:34}));}
  s+=fade(seg(p,.4,.55),card(120,140,720,280,T(cV("f'''(0)")+'='+cG('6c_3'),480,220,{size:50})
   +T(cH('c_3')+'=\\dfrac{'+cV("f'''(0)")+'}{'+cE('6')+'}=\\dfrac{'+cV("f'''(0)")+'}{'+cE('3!')+'}',480,340,{size:48}),1,ok));
  return s;
 },
 [K+'general']:(p)=>{
  let s=label('k 次の 項だけが 生き残る',600,80,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=T(cH('c_k')+'x^{'+cT('k')+'}',300,210,{size:58});
  s+=arrow(400,198,620,198,{color:C.v,w:5,head:14})+label('k 回 微分',510,160,{size:26,color:C.v,anchor:'middle'});
  s+=fade(seg(p,.1,.3),T(cE(cT('k')+'!')+'\\,'+cH('c_k'),800,210,{size:58}));
  s+=fade(seg(p,.35,.5),label('低い 次数：途中で 0',330,340,{size:28,color:bad,anchor:'middle'})+label('高い 次数：x が 残り、x ＝ 0 で 0',820,340,{size:28,color:bad,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),T(cV('f^{('+cT('k')+')}(0)')+'='+cE(cT('k')+'!')+'\\,'+cH('c_k'),600,450,{size:48}));
  return s;
 },
 [K+'formula']:(p)=>{
  const src=cH('c_k')+'=\\dfrac{'+cV('f^{('+cT('k')+')}(0)')+'}{'+cE(cT('k')+'!')+'}',w=texWidth(src,70,false);
  let s=T(src,600,200,{size:70})+fade(seg(p,.1,.3),highlight(600-w/2-34,55,w+68,240,1));
  s+=fade(seg(p,.3,.45),label('f の k 回微分の x ＝ 0 での 値 ÷ k!',600,360,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('導いた 結果',600,450,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'series']:(p)=>{
  let s=T(cV('f(x)')+'\\approx'+cV('f(0)')+'+'+cV("f'(0)")+'\\,x+\\dfrac{'+cV("f''(0)")+'}{'+cE('2!')+'}x^2+\\dfrac{'+cV("f'''(0)")+'}{'+cE('3!')+'}x^3+\\cdots',600,190,{size:48});
  s+=fade(seg(p,.55,.7),label('テイラー展開（x ＝ 0 の まわり）',600,360,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'shift']:(p)=>{
  let s=T(cV('f(x)')+'\\approx'+cV('f(0)')+'+'+cV("f'(0)")+'\\,x+\\dfrac{'+cV("f''(0)")+'}{'+cE('2!')+'}x^2+\\cdots',600,100,{size:40,opacity:.55});
  s+=fade(seg(p,.05,.2),label('x を x − a に、0 を a に',600,200,{size:30,color:C.t,anchor:'middle',weight:700})+arrow(600,215,600,260,{color:C.t,w:4,head:12}));
  s+=fade(seg(p,.25,.45),T(cV('f(x)')+'\\approx'+cV('f(a)')+'+'+cV("f'(a)")+'\\,('+cT('x-a')+')+\\dfrac{'+cV("f''(a)")+'}{'+cE('2!')+'}('+cT('x-a')+')^2+\\cdots',600,330,{size:44}));
  s+=fade(seg(p,.65,.8),label('次回は この形を 使う',600,460,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 // ===== S4 eˣ =====
 [K+'exp']:(p)=>{
  const A=GE();let s=egraph(A,{g1:0,g2:0,g3:0,ge:seg(p,.02,.3)});
  s+=card(660,110,480,280,T('(e^{x})\'=e^{x}',900,210,{size:60})+label('何回 微分しても eˣ',900,310,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'exp2']:(p)=>{
  let s=label('x ＝ 0 での 値',600,70,{size:28,color:C.t,anchor:'middle'});
  ['f(0)',"f'(0)","f''(0)","f'''(0)"].forEach((f,i)=>{s+=fade(seg(p,.02+i*.07,.1+i*.07),T(cV(f)+'=e^0=1',240+i*240,160,{size:32}));});
  s+=fade(seg(p,.45,.6),card(300,250,600,200,T(cH('c_k')+'=\\dfrac{1}{'+cE(cT('k')+'!')+'}',600,355,{size:66}),1,C.hi));
  return s;
 },
 [K+'exp3']:(p)=>{
  let s=T('e^{x}\\approx1+x+\\dfrac{x^2}{'+cE('2')+'}+\\dfrac{x^3}{'+cE('6')+'}+\\dfrac{x^4}{'+cE('24')+'}+\\cdots',600,190,{size:56});
  s+=fade(seg(p,.5,.65),T(cE('2')+'=2!,\\quad '+cE('6')+'=3!,\\quad '+cE('24')+'=4!',600,350,{size:46}));
  return s;
 },
 [K+'num']:(p)=>{
  const A=GE();let s=egraph(A,{g1:0,g2:0,g3:0})+elegend(0,0,0);
  s+=dot(A.X(0.1),A.Y(Math.exp(0.1)),8,C.x)+label('x ＝ 0.1',A.X(0.1)+14,A.Y(Math.exp(0.1))+40,{size:24,color:C.t});
  s+=etable(p,{rows:[0,0,0,seg(p,.3,.45)]});
  return s;
 },
 [K+'num2']:(p)=>{
  const A=GE();const g1=seg(p,.02,.15),g2=seg(p,.25,.4),g3=seg(p,.5,.65);
  let s=egraph(A,{g1,g2,g3})+elegend(g1,g2,g3);
  s+=etable(p,{rows:[g1,g2,g3,1],cmp:seg(p,.75,.9)});
  return s;
 },
 [K+'num3']:(p)=>{
  let s=label('x ＝ 0.1、3次で 止めると',600,70,{size:28,color:C.t,anchor:'middle'});
  s+=T('1.1051709-1.1051667\\approx'+cR('0.0000043'),600,160,{size:44});
  s+=label('実際の 差',600,215,{size:24,color:bad,anchor:'middle'});
  s+=fade(seg(p,.35,.5),T('\\dfrac{0.1^4}{'+cE('24')+'}\\approx'+cH('0.0000042'),600,320,{size:48})+label('捨てた 最初の 項',600,395,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('ほぼ 同じ 大きさ',600,465,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'far']:(p)=>{
  const A=GE();let s=egraph(A,{g1:0,g2:0})+elegend(0,0,1);
  const g=seg(p,.2,.4);
  s+=fade(g,dot(A.X(2),A.Y(Math.exp(2)),9,C.x)+dot(A.X(2),A.Y(P3(2)),9,C.F)+line(A.X(2),A.Y(Math.exp(2)),A.X(2),A.Y(P3(2)),{color:bad,w:5}));
  s+=card(660,90,500,340,label('x ＝ 2',910,140,{size:30,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),T('1+2+\\dfrac{4}{2}+\\dfrac{8}{6}\\approx6.33',910,220,{size:36,color:C.F}))
   +fade(seg(p,.35,.5),T('e^2\\approx7.39',910,305,{size:40,color:C.x}))
   +fade(seg(p,.6,.75),label('1 以上 ずれる',910,385,{size:30,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'far2']:(p)=>{
  let s=T('\\dfrac{2^4}{'+cE('24')+'}\\approx'+cR('0.67'),600,150,{size:60})+label('捨てた 最初の 項',600,240,{size:26,color:bad,anchor:'middle'});
  s+=fade(seg(p,.3,.45),label('小さくない → この近似は 使えない 合図',600,330,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('展開した点（x ＝ 0）から 遠いと 外れる',600,420,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ===== S5 (1+x)ⁿ =====
 [K+'pow']:(p)=>{
  let s=card(250,90,700,200,T('(1+x)^{'+cT('n')+'}',600,210,{size:72}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.4,.55),label('n は 整数で なくても よい（例：n ＝ 1/2 で √）',600,380,{size:30,color:C.t,anchor:'middle'}));
  return s;
 },
 [K+'pow1']:(p)=>{
  let s=T(cV('f(0)')+'=1^{'+cT('n')+'}=1',600,80,{size:44});
  s+=fade(seg(p,.2,.4),T(cV("f'(x)")+'='+cT('n')+'(1+x)^{'+cT('n')+'-1}',600,210,{size:54}));
  s+=fade(seg(p,.25,.4),label('実数乗・連鎖律（微分の法則・上級 1/2）',600,285,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),T(cV("f'(0)")+'='+cT('n')+'\\cdot1^{'+cT('n')+'-1}='+cT('n'),600,400,{size:52}));
  return s;
 },
 [K+'pow2']:(p)=>{
  const src='(1+x)^{'+cT('n')+'}\\approx1+'+cT('n')+'x',w=texWidth(src,64,false);
  let s=T(src,600,120,{size:64})+fade(seg(p,.1,.25),highlight(600-w/2-26,55,w+52,110,1));
  s+=fade(seg(p,.45,.6),card(100,240,1000,220,label('n ＝ 1/2、x ＝ 0.02（近似・中級 1/2）',600,295,{size:26,color:C.dim,anchor:'middle'})
   +T('\\sqrt{1.02}=(1+0.02)^{1/2}\\approx1+\\tfrac12\\times0.02=1.01',600,390,{size:42})));
  return s;
 },
 [K+'pow3']:(p)=>{
  let s=T(cV("f''(x)")+'='+cT('n')+'('+cT('n')+'-1)(1+x)^{'+cT('n')+'-2}',600,90,{size:48});
  s+=fade(seg(p,.25,.4),T(cV("f''(0)")+'='+cT('n')+'('+cT('n')+'-1)',600,210,{size:48}));
  s+=fade(seg(p,.55,.7),T(cH('c_2')+'=\\dfrac{'+cT('n')+'('+cT('n')+'-1)}{'+cE('2!')+'}',600,360,{size:56}));
  return s;
 },
 [K+'pow4']:(p)=>{
  let s=label('n ＝ 1/2、x ＝ 0.02',160,70,{size:28,color:C.t});
  s+=T('\\dfrac{\\frac12\\times\\left(-\\frac12\\right)}{2}=-\\dfrac18',600,190,{size:48});
  s+=fade(seg(p,.45,.6),T('x^2=0.02^2=0.0004',600,300,{size:44}));
  s+=fade(seg(p,.65,.8),T('-\\dfrac18\\times0.0004='+cH('-0.00005'),600,420,{size:48}));
  return s;
 },
 [K+'pow5']:(p)=>{
  let s=T('1.01'+cH('-0.00005')+'=1.00995',600,110,{size:54});
  s+=fade(seg(p,.2,.35),T('\\sqrt{1.02}='+cX('1.0099505')+'\\ldots',600,220,{size:50})+label('本当の 値',600,275,{size:24,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),card(220,320,760,140,label('中級で 見た 差 約 0.00005',600,370,{size:28,color:C.ink,anchor:'middle'})
   +label('＝ この 2次の 項',600,425,{size:32,color:C.hi,anchor:'middle',weight:700})));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(120,60,960,150,T('x^{'+cT('k')+'}\\;\\to\\;'+cE(cT('k')+'!'),520,150,{size:50})+label('（k 回 微分）',760,160,{size:28,color:C.v}),seg(p,.02,.15));
  s+=card(120,250,960,170,label('多項式を k 回 微分して x ＝ 0',600,305,{size:28,color:C.dim,anchor:'middle'})
   +label('→ k 次の 項だけが 残る：',520,375,{size:32,color:C.hi,anchor:'middle',weight:700})+T(cE(cT('k')+'!')+'\\,'+cH('c_k'),800,372,{size:44}),seg(p,.4,.55));
  return s;
 },
 [K+'sum2']:(p)=>{
  const rows=[['定義','k! ＝ 1 × 2 × … × k（0! ＝ 1）',C.E],['導いた 結果','k 次の 係数 ＝ k 回微分の値 ÷ k!',ok],['目安','捨てた 最初の 項で 差を 見積もる',C.t]];
  let s='';
  rows.forEach(([a,b,col],i)=>{s+=card(120,60+i*130,960,105,label(a,165,125+i*130,{size:28,color:col,weight:700})+label(b,1050,125+i*130,{size:30,color:C.ink,anchor:'end'}),seg(p,.02+i*.25,.12+i*.25));});
  return s;
 },
 ...(()=>{
  const U=x=>0.6*Math.sin(1.7*x)+0.18*x*x;
  function valley(p,{q=1,zoom=0}={}){
   const A=axes({x:80,y:440,w:560,h:340,xmin:-3.2,xmax:3.2,ymin:-1.2,ymax:2.6,xticks:[],yticks:[],grid:false});
   let s=A.svg+A.plot(U,{from:-3.1,to:3.1,color:C.E,w:4});
   // local minimum near x ≈ -0.85
   let xm=-0.85,best=1e9;for(let u=-2;u<0.5;u+=0.001){const v=U(u);if(v<best){best=v;xm=u;}}
   s+=fade(zoom,`<circle cx="${A.X(xm)}" cy="${A.Y(U(xm))}" r="60" fill="none" stroke="${C.hi}" stroke-width="4"/>`);
   s+=fade(zoom,line(A.X(xm)+42,A.Y(U(xm))+42,A.X(xm)+100,A.Y(U(xm))+100,{color:C.hi,w:6}));
   s+=fade(q,label('谷底',A.X(xm)-70,A.Y(U(xm))+95,{size:26,color:C.hi,anchor:'end',weight:700}));
   return s;
  }
  return {
   [K+'next']:(p)=>{
    let s=card(660,90,480,320,label('なぜ 物理では',900,160,{size:28,color:C.dim,anchor:'middle'})
     +label('近似が「正義」？',900,230,{size:40,color:C.hi,anchor:'middle',weight:700})
     +label('sinθ ≈ θ、(1＋x)ⁿ ≈ 1＋nx …',900,320,{size:26,color:C.ink,anchor:'middle'}),seg(p,.02,.15),C.hi);
    s+=valley(p,{q:0});
    return s;
   },
   [K+'next2']:(p)=>{
    let s=valley(p,{q:seg(p,.05,.2),zoom:seg(p,.2,.4)});
    s+=card(700,120,440,260,label('どんな 谷底も',920,190,{size:30,color:C.ink,anchor:'middle'})
     +label('拡大すると',920,250,{size:30,color:C.ink,anchor:'middle'})
     +label('何に 見える？',920,320,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
    return s;
   },
  };
 })(),
};
