// YouTube シリーズ「空気抵抗・中級 1/2」(ys-um-drag-1) — 図。Stage 1200×515.
// 色（anim.mjs C／初級 ui-drag と同じ）：力 F 緑（重力・抵抗・合力）、速度 v 紫、加速度 a 赤、時刻 t・刻み Δt 金、
// 終端速度の線・強調 黄、微分方程式の回の量 y 橙。
// 数値：初級の表 m＝1 kg、k＝2 kg/s、g＝10 → dv/dt＝10−2v、0.1 s 刻み 0→1.0→1.8→2.44→2.95。
//   ステージ例 m＝2 kg、k＝4 kg/s → v∞＝5 m/s。3 m/s で 抵抗 12 N、合力 8 N、a＝4 m/s²。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,draw} from './anim.mjs';

const K='um-drag-1:';
const CF=C.F,CV=C.v,CA=C.a,CT=C.t,CH=C.hi,CD=C.dim,CY=C.E;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const swap=(p,a,b,t=.12)=>fade(1-seg(p,0,t),a)+fade(seg(p,t*.6,t+.1),b);
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:32,color:CA,weight:700,anchor:'middle'}));
const EQ='m\\dfrac{dv}{dt}=mg-kv';
const EQM='\\dfrac{dv}{dt}=g-\\dfrac{k}{m}\\,v';
const VN=n=>5*(1-Math.pow(.8,n));

// ---- ball and arrows (初級と同じ) ---------------------------------------------------------------
const NPX=11;
function ball(x,y,{r=30,g=1}={}){return fade(g,ring(x,y,r,{color:C.dim,w:3,fill:'#2b3d63'})+dot(x-9,y-9,7,'#5a73a6'));}
function gravA(x,y,N,{r=30,g=1,text='重力',px=NPX,tx=16}={}){const L=N*px;return arrow(x,y+r,x,y+r+L,{color:CF,w:6,g})+(text?fade(g,label(text,x+tx,y+r+L-4,{size:24,color:CF})):'');}
function resA(x,y,N,{r=30,g=1,text='抵抗',px=NPX,tx=16}={}){const L=N*px;if(L<2)return '';return arrow(x,y-r,x,y-r-L,{color:CF,w:6,g})+(text?fade(g,label(text,x+tx,y-r-L+18,{size:24,color:CF})):'');}
function velA(x,y,v,{g=1,px=30,text='速度 v',dx=-80}={}){const L=v*px;if(L<2)return '';return arrow(x+dx,y-L/2,x+dx,y+L/2,{color:CV,w:7,g})+(text?fade(g,label(text,x+dx,y-L/2-12,{size:24,color:CV,anchor:'middle'})):'');}
function downAxis(x,y1,y2,g=1){return fade(g,arrow(x,y1,x,y2,{color:CD,w:3,head:14})+label('＋',x+14,y2-6,{size:28,color:CH,weight:700})+label('下向きが 正',x,y1-14,{size:22,color:CD,anchor:'middle'}));}

// ---- v–t graph with the 0.1 s steps (初級 11-2) ----------------------------------------------------
function vtA(g=1){return axes({x:110,y:450,w:470,h:330,xmax:1.6,ymax:6,xticks:[.5,1,1.5],yticks:[1,2,3,4,5],grid:true,g,xlabel:'t [s]',ylabel:'速度 v [m/s]',xcolor:CT,ycolor:CV});}
function steps(A,p=1,n=16){const pts=Array.from({length:n},(_,i)=>[A.X(i/10),A.Y(VN(i))]);return draw(pts,p,{color:CV,w:4})+pts.map((q,i)=>fade(seg(p,i/n,(i+1)/n),dot(q[0],q[1],5,CV))).join('');}
const vinf=(A,g=1,txt='v∞ ＝ 5 m/s')=>fade(g,line(A.X(0),A.Y(5),A.X(1.6),A.Y(5),{color:CH,w:3,dash:'10 7'})+label(txt,A.X(1.6)+8,A.Y(5)-12,{size:24,color:CH,weight:700,anchor:'end'}));
// schematic v–t (no numbers)
function vsA(g=1){return axes({x:110,y:450,w:470,h:330,xmax:1.6,ymax:6,g,xlabel:'t',ylabel:'速度 v',xcolor:CT,ycolor:CV});}
const vex=t=>5*(1-Math.exp(-2*t));

// ---- the cycle: v → 抵抗 → 合力 → a → 積み上げ → v ----------------------------------------------------
function cycle(p,{resolved=0}={}){
 const N=[[250,270,'速度 v',CV],[600,120,'抵抗 kv',CF],[950,270,'加速度 a',CA],[600,420,'積み上げ',CT]];
 const g=[seg(p,0,.15),seg(p,.15,.3),seg(p,.3,.45),seg(p,.45,.6)];
 let s='';
 N.forEach(([x,y,t,c],i)=>{s+=card(x-120,y-38,240,76,label(t,x,y+10,{size:30,color:c,anchor:'middle',weight:700}),g[i],c);});
 s+=arrow(330,225,480,140,{color:CD,w:4,g:g[1]})+arrow(720,140,870,225,{color:CD,w:4,g:g[2]})+arrow(870,315,720,400,{color:CD,w:4,g:g[3]})+arrow(480,400,330,315,{color:CD,w:4,g:seg(p,.6,.72)});
 s+=fade(g[2],label('合力 mg − kv',850,160,{size:22,color:CF}));
 s+=fade(seg(p,.6,.72)*(1-resolved),label('まだ 分からない',250,350,{size:26,color:CA,anchor:'middle',weight:700})+label('？',250,215,{size:40,color:CA,anchor:'middle',weight:700}));
 s+=fade(resolved,label('今の v から 毎回 計算',175,350,{size:26,color:CH,anchor:'middle',weight:700}));
 return s;
}

// ---- 初級の表（ui-drag-2 と同じ並び） ------------------------------------------------------------------
const CX=[80,200,350,505,650,800,1000],HY=160;
const ROWS=[['0','0','0','10','10','1.0','1.0'],['0.1','1.0','2','8','8','0.8','1.8'],['0.2','1.8','3.6','6.4','6.4','0.64','2.44'],['0.3','2.44','4.88','5.12','5.12','0.512','2.95']];
const RY=[237,285,333,381];
const COLS=[CT,CV,CF,CF,CA,CV,CV];
function tHead(g=1){
 const H=[['t','[s]'],['v','[m/s]'],['抵抗','[N]'],['合力','[N]'],['a','[m/s²]'],['増え分','[m/s]'],['0.1 秒後の v','[m/s]']];
 return fade(g,H.map(([a,b],i)=>label(a,CX[i],HY,{size:26,color:COLS[i],anchor:'middle',weight:700})+label(b,CX[i],HY+28,{size:20,color:C.dim,anchor:'middle'})).join('')+line(30,HY+42,1170,HY+42,{color:C.faint,w:2}));
}
function tRow(i,g=1){return fade(g,ROWS[i].map((v,j)=>label(j===6?'≈ '+v:v,CX[j],RY[i],{size:28,color:COLS[j],anchor:'middle',weight:j===6?700:400})).join(''));}
const TERMS=[[2,'kv'],[3,'mg-kv'],[4,'\\dfrac{dv}{dt}'],[5,'\\dfrac{dv}{dt}\\,\\Delta t']];
function tTerms(gs=[1,1,1,1]){return TERMS.map(([j,t],i)=>fade(gs[i],tex(t,CX[j],HY-62,{size:j>3?30:34})+line(CX[j],HY-36,CX[j],HY-24,{color:CH,w:2}))).join('');}

// ---- equation split into parts (for braces under each term) ------------------------------------------
function eqParts(cx,y,size){
 const P=['m\\dfrac{dv}{dt}','=','mg','-','kv'],W=P.map(t=>texWidth(t,size)),gap=size*.35;
 const tot=W.reduce((a,b)=>a+b,0)+gap*(P.length-1);let x=cx-tot/2;const xs=[];let s='';
 P.forEach((t,i)=>{xs.push([x,x+W[i]]);s+=tex(t,x,y,{size,anchor:'start'});x+=W[i]+gap;});
 return {s,xs};
}

// ---- small graphs for the drag model ---------------------------------------------------------------
function dragPlot(x,y,w,h,fn,{g=1,color=CF,title='',sub=''}={}){
 const A=axes({x,y,w,h,xmax:1,ymax:1,g,xlabel:'速さ',ylabel:'抵抗',xcolor:CV,ycolor:CF});
 return A.svg+fade(g,A.plot(fn,{from:0,to:1,color,w:4}))+fade(g,label(title,x+w/2,y-h-70,{size:26,color:C.ink,anchor:'middle',weight:700})+(sub?label(sub,x+w/2,y+70,{size:24,color:CH,anchor:'middle'}):''));
}

// ---- balance ------------------------------------------------------------------------------------
function balance(g,L,R,gl,gr){
 const bx=600,by=250;
 let s=fade(g,line(bx,by,bx,430,{color:C.dim,w:5})+line(bx-60,430,bx+60,430,{color:C.dim,w:5})+line(bx-300,by,bx+300,by,{color:C.dim,w:5})+dot(bx,by,9,C.dim)
  +line(bx-300,by,bx-450,by+90,{color:C.dim,w:2})+line(bx-300,by,bx-150,by+90,{color:C.dim,w:2})+line(bx-460,by+90,bx-140,by+90,{color:C.dim,w:5})
  +line(bx+300,by,bx+150,by+90,{color:C.dim,w:2})+line(bx+300,by,bx+450,by+90,{color:C.dim,w:2})+line(bx+140,by+90,bx+460,by+90,{color:C.dim,w:5}));
 s+=fade(gl,L(bx-300,by+55))+fade(gr,R(bx+300,by+55));
 return s;
}

export const ytUmDrag1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=axes({x:100,y:440,w:440,h:300,xmax:4,ymax:3,xticks:[1,2,3],yticks:[1,2],grid:true,g:seg(p,0,.15),xlabel:'t [s]',ylabel:'加速度 a',xcolor:CT,ycolor:CA});
  let s=A.svg+fade(seg(p,.1,.3),rect(A.X(0),A.Y(2),A.X(3)-A.X(0),A.Y(0)-A.Y(2),{fill:CA,fo:.25,stroke:CA,sw:2,rx:0})+line(A.X(0),A.Y(2),A.X(3.6),A.Y(2),{color:CA,w:4}));
  s+=fade(seg(p,.25,.4),label('一定の a を 積み上げる',A.X(1.5),A.Y(1)+10,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(620,110,540,280,label('力が 一定 → 加速度も 一定',890,165,{size:28,color:CF,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),tex('v=v_0+at',890,240,{size:44}))
   +fade(seg(p,.55,.7),tex('x=x_0+v_0t+\\tfrac{1}{2}at^2',890,320,{size:40})),seg(p,0,.15));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=ball(260,230)+gravA(260,230,10,{text:'重力'})+resA(260,230,7,{text:'抵抗',g:seg(p,.1,.3)})+velA(260,230,3,{g:seg(p,.1,.3)});
  s+=card(520,90,640,320,label('前回の最後の問い',840,140,{size:26,color:CD,anchor:'middle'})
   +label('空気抵抗 → 力が 速度で 変わる',840,210,{size:30,color:CF,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('この積分は そのまま 使えない',840,275,{size:30,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('では、どう解く？',840,350,{size:36,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 [K+'why']:(p)=>cycle(p),
 [K+'shokyu']:(p)=>{
  const A=vtA(seg(p,0,.15));
  let s=A.svg+steps(A,seg(p,.1,.6))+vinf(A,seg(p,.5,.65));
  s+=card(700,110,460,250,label('初級：0.1 秒刻みの 表',930,160,{size:26,color:CD,anchor:'middle'})
   +label('m ＝ 1 kg、k ＝ 2、g ＝ 10',930,220,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('重力 ＝ 抵抗',930,285,{size:30,color:CF,anchor:'middle',weight:700})+label('終端速度 5 m/s',930,330,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'ask']:(p)=>{
  const A=vtA();
  let s=fade(.35,A.svg+steps(A)+vinf(A));
  s+=card(600,110,560,280,label('今回の問い',880,160,{size:26,color:CD,anchor:'middle'})
   +label('速度で 変わる 抵抗があると',880,230,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('運動方程式は どんな形？',880,305,{size:34,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 // ===== S2 力を書く =====
 ...(()=>{
  const BX=330,BY=250;
  const base=(gv=1)=>downAxis(130,110,420)+ball(BX,BY)+velA(BX,BY,3,{g:gv});
  const promise=(g=1)=>card(640,90,520,150,label('約束',900,135,{size:24,color:CD,anchor:'middle'})+label('下向きが 正、落下中 v ≥ 0',900,195,{size:30,color:C.ink,anchor:'middle',weight:700}),g);
  return {
   [K+'axis']:(p)=>fade(seg(p,0,.2),downAxis(130,110,420))+fade(seg(p,.1,.3),ball(BX,BY))+velA(BX,BY,3,{g:seg(p,.5,.7)})+promise(seg(p,.2,.4)),
   [K+'grav']:(p)=>base()+promise()+gravA(BX,BY,11,{text:'重力 ＋mg',g:seg(p,.05,.3)})+card(640,270,520,140,label('重力 ＋mg',900,320,{size:32,color:CF,anchor:'middle',weight:700})+fade(seg(p,.4,.6),label('速度に よらず 一定',900,375,{size:28,color:C.ink,anchor:'middle'})),seg(p,.1,.3)),
   [K+'drag']:(p)=>{
    let s=base()+promise()+gravA(BX,BY,11,{text:'重力 ＋mg'})+resA(BX,BY,7,{text:'抵抗 ？',g:seg(p,.05,.3)});
    s+=card(640,270,520,140,label('抵抗：運動と 逆向き → 上向き',900,320,{size:28,color:CF,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('大きさは どう書く？',900,375,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,.1,.3));
    return s;
   },
   [K+'model']:(p)=>{
    let s=ball(BX-90,BY)+gravA(BX-90,BY,11,{text:'重力'})+resA(BX-90,BY,7,{text:'kv',g:1});
    const A=axes({x:480,y:430,w:380,h:290,xmax:6,ymax:13,xticks:[],yticks:[],g:seg(p,0,.15),xlabel:'速さ v',ylabel:'抵抗',xcolor:CV,ycolor:CF});
    s+=A.svg+A.plot(v=>2*v,{from:0,to:6,p:seg(p,.15,.45),color:CF,w:5});
    s+=fade(seg(p,.4,.55),label('抵抗 ＝ kv',A.X(3.3),A.Y(8.5),{size:30,color:CF,weight:700,anchor:'end'})+label('比例（原点を通る直線）',A.X(3),A.Y(0)+60,{size:24,color:C.ink,anchor:'middle'}));
    s+=card(920,120,250,170,label('仮定',1045,165,{size:26,color:CH,anchor:'middle',weight:700})+label('k：比例の',1045,215,{size:24,color:C.ink,anchor:'middle'})+label('係数（正）',1045,250,{size:24,color:C.ink,anchor:'middle'}),seg(p,.55,.7),CH);
    return s;
   },
   [K+'modelnote']:(p)=>{
    let s=label('法則ではなく モデル（仮定）',600,70,{size:32,color:CH,anchor:'middle',weight:700});
    s+=dragPlot(130,420,330,230,v=>v,{g:seg(p,.05,.3),title:'霧の粒（ごく小さい）',sub:'kv が よく合う'});
    s+=dragPlot(700,420,330,230,v=>v*v,{g:seg(p,.45,.7),color:CF,title:'1 mm ほどの 雨粒',sub:'速さの 2乗に 比例が 近い'});
    return s;
   },
   [K+'sign']:(p)=>{
    let s=downAxis(130,110,420)+ball(BX,BY)+velA(BX,BY,3)+gravA(BX,BY,11,{text:'＋mg'})+resA(BX,BY,7,{text:'−kv'});
    s+=card(600,100,560,320,label('下向きが 正',880,150,{size:26,color:CD,anchor:'middle'})
     +label('合力 ＝',700,232,{size:32,color:CF,anchor:'middle',weight:700})+tex('(+mg)+(-kv)',910,220,{size:42})
     +fade(seg(p,.35,.5),label('k ＞ 0、v ＞ 0 の間',880,295,{size:28,color:C.ink,anchor:'middle'}))
     +fade(seg(p,.55,.7),label('−kv ＜ 0 → 上向き',880,360,{size:32,color:CF,anchor:'middle',weight:700})),seg(p,0,.15));
    return s;
   },
  };
 })(),
 [K+'unit']:(p)=>{
  let s=label('k の 単位',600,80,{size:30,color:CD,anchor:'middle'});
  s+=fade(seg(p,.05,.25),tex('kv',300,180,{size:56})+label('＝ 力：N',400,190,{size:32,color:CF}));
  s+=fade(seg(p,.2,.4),tex('v',760,180,{size:56})+label('：m/s',790,190,{size:32,color:CV}));
  s+=fade(seg(p,.45,.65),tex('[k]=\\dfrac{\\mathrm{N}}{\\mathrm{m/s}}',520,330,{size:60,auto:false}));
  s+=fade(seg(p,.7,.85),tex('=\\mathrm{N\\cdot s/m}',800,330,{size:60,auto:false,color:CH}));
  s+=fade(seg(p,.8,.95),label('[k]：k の単位',990,480,{size:22,color:CD,anchor:'middle'}));
  return s;
 },
 [K+'unit2']:(p)=>{
  let s=tex('\\mathrm{N\\cdot s/m}',230,150,{size:54,auto:false});
  s+=fade(seg(p,.05,.3),tex('=\\mathrm{kg\\cdot m/s^2}\\times\\mathrm{s/m}',640,150,{size:50,auto:false}));
  s+=fade(seg(p,.1,.3),label('N ＝ kg·m/s²',640,230,{size:26,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),tex('=\\mathrm{kg/s}',600,320,{size:66,auto:false,color:CH}));
  s+=fade(seg(p,.35,.55),label('m と s を 1つずつ 約分',600,395,{size:26,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),label('初級の N·s/m と 同じ量',600,460,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit3']:(p)=>{
  let s=label('kv の 単位を 確かめる',600,70,{size:28,color:CD,anchor:'middle'});
  s+=balance(seg(p,0,.15),(x,y)=>tex('\\mathrm{kg/s}\\times\\mathrm{m/s}',x,y,{size:40,auto:false})+label('k × v',x,y+80,{size:24,color:CD,anchor:'middle'}),(x,y)=>tex('\\mathrm{N}',x,y,{size:46,auto:false,color:CF})+label('力',x,y+80,{size:24,color:CD,anchor:'middle'}),seg(p,.1,.3),seg(p,.25,.45));
  s+=fade(seg(p,.5,.7),tex('\\mathrm{kg\\cdot m/s^2}=\\mathrm{N}',600,165,{size:44,auto:false,color:CH}));
  return s;
 },
 [K+'spring']:(p)=>{
  let s=card(80,100,480,280,label('抵抗の 係数 k',320,160,{size:30,color:CF,anchor:'middle',weight:700})+tex('\\mathrm{kg/s}\\;(=\\mathrm{N\\cdot s/m})',320,240,{size:38,auto:false})+label('速さ 1 m/s あたりの 力',320,320,{size:26,color:C.ink,anchor:'middle'}),seg(p,0,.15),CF);
  s+=card(640,100,480,280,label('ばね定数 k',880,160,{size:30,color:CD,anchor:'middle',weight:700})+tex('\\mathrm{N/m}',880,240,{size:44,auto:false})+label('伸び 1 m あたりの 力',880,320,{size:26,color:C.ink,anchor:'middle'}),seg(p,.15,.35));
  s+=fade(seg(p,.5,.65),label('≠',600,250,{size:56,color:CA,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('同じ文字でも 別の量',600,450,{size:32,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 運動方程式 =====
 [K+'sum']:(p)=>{
  let s=ball(220,250)+gravA(220,250,11,{text:'＋mg'})+resA(220,250,7,{text:'−kv'});
  s+=fade(seg(p,.05,.25),label('合力',520,160,{size:28,color:CF})+tex('F=mg-kv',760,155,{size:48}));
  s+=fade(seg(p,.45,.6),tex('ma=F',760,320,{size:56}));
  s+=arrow(760,195,790,275,{color:CH,w:4,g:seg(p,.6,.8)})+fade(seg(p,.65,.8),label('右の辺に 入れる',830,245,{size:24,color:CH}));
  return s;
 },
 [K+'eq']:(p)=>{
  let s=fade(seg(p,0,.15),label('a ＝ dv/dt（速度の 変化率）',600,90,{size:28,color:CA,anchor:'middle'}));
  s+=fade(seg(p,.25,.5),tex(EQ,600,260,{size:84}));
  s+=highlight(260,170,680,170,seg(p,.65,.8));
  s+=fade(seg(p,.7,.85),label('空気抵抗のある 運動方程式',600,430,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'read']:(p)=>{
  const {s:e,xs}=eqParts(600,230,80);let s=e;
  const br=(i,j,txt,col,g)=>brace(xs[i][0],xs[j][1],310,{dir:1,color:col,text:txt,size:28,g});
  s+=br(0,0,'加速の 勢い',CA,seg(p,.05,.25));
  s+=br(2,2,'重力',CF,seg(p,.3,.45))+br(4,4,'抵抗',CF,seg(p,.4,.55));
  s+=fade(seg(p,.6,.75),brace(xs[2][0],xs[4][1],150,{dir:-1,color:CH,text:'重力から 抵抗を 引いた 残り',size:28}));
  return s;
 },
 [K+'rhs']:(p)=>{
  let s=label('一定の力',140,130,{size:26,color:CD})+tex('m\\dfrac{dv}{dt}=F',480,130,{size:48})+label('F は 定数',720,140,{size:26,color:CD});
  s+=fade(seg(p,.05,.2),label('今回',140,265,{size:26,color:C.ink,weight:700})+tex(EQ,480,265,{size:52}));
  const e2=480+texWidth(EQ,52)/2,e3=480+texWidth('\\dfrac{dy}{dt}=-ky',48)/2;
  s+=fade(seg(p,.2,.35),ring(e2-29,258,26,{color:CH,w:3})+label('求めたい v が 右の辺に',720,275,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.55,.7),label('微分方程式の回',140,410,{size:26,color:CD})+tex('\\dfrac{d{\\color{'+CY+'}y}}{dt}=-k{\\color{'+CY+'}y}',480,410,{size:48})+ring(e3-26,404,26,{color:CY,w:3})+label('今の量 y が 右の辺に',720,420,{size:28,color:CY}));
  return s;
 },
 [K+'divm']:(p)=>{
  let s=tex(EQ,600,130,{size:56});
  s+=fade(seg(p,.05,.25),label('両辺を m で 割る',600,215,{size:28,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.25,.45),tex(EQM,600,320,{size:66}));
  s+=fade(seg(p,.6,.75),label('加速度が 今の 速度で 決まる',600,450,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'start']:(p)=>{
  const A=vsA();
  let s=A.svg+fade(.5,line(A.X(0),A.Y(5),A.X(1.6),A.Y(5),{color:CH,w:2,dash:'8 6'}))+A.plot(vex,{from:0,to:1.55,p:seg(p,.05,.3),color:CV,w:4,dash:'2 10'});
  s+=draw([[A.X(0),A.Y(0)],[A.X(.4),A.Y(4)]],seg(p,.3,.5),{color:CA,w:5})+fade(seg(p,.4,.55),label('傾き g',A.X(.4)+10,A.Y(4)+6,{size:26,color:CA,weight:700}));
  s+=card(660,100,500,300,label('落ち始め',860,160,{size:28,color:CD,anchor:'end'})+tex('v=0',950,150,{size:44})
   +fade(seg(p,.1,.25),tex('\\dfrac{dv}{dt}=g',910,265,{size:48,color:C.ink}))
   +fade(seg(p,.55,.7),label('抵抗 0 → 自由落下と 同じ',910,360,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'faster']:(p)=>{
  const A=vsA();
  let s=A.svg+fade(.5,line(A.X(0),A.Y(5),A.X(1.6),A.Y(5),{color:CH,w:2,dash:'8 6'}))+A.plot(vex,{from:0,to:1.55,color:CV,w:4,dash:'2 10'});
  const tan=(t0,d,g)=>{const v0=vex(t0),a=10-2*v0,d0=t0<.01?0:d;return fade(g,line(A.X(t0-d0),A.Y(v0-a*d0),A.X(t0+d),A.Y(v0+a*d),{color:CA,w:5})+dot(A.X(t0),A.Y(v0),6,CV));};
  s+=tan(0.001,.2,1)+tan(.35,.2,seg(p,.1,.25))+tan(.8,.22,seg(p,.25,.4))+tan(1.3,.22,seg(p,.4,.55));
  s+=card(660,110,500,280,tex(EQM,910,185,{size:44})
   +fade(seg(p,.1,.3),label('速いほど (k/m)v が 大きい',910,275,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.35,.55),label('→ 残りの 加速度が 小さい',910,330,{size:28,color:CA,anchor:'middle',weight:700})),seg(p,0,.12));
  s+=fade(seg(p,.65,.8),label('増え方が 鈍る',A.X(1.05),A.Y(3.2),{size:26,color:CV,weight:700}));
  return s;
 },
 // ===== S4 初級の表は一歩ずつ版 =====
 [K+'table']:(p)=>{
  let s=card(80,90,480,300,label('初級の例',320,140,{size:26,color:CD,anchor:'middle'})+label('m ＝ 1 kg',320,205,{size:30,anchor:'middle'})+label('g ＝ 10 m/s²',320,260,{size:30,anchor:'middle'})+label('k ＝ 2 kg/s',320,315,{size:30,color:CF,anchor:'middle'}),seg(p,.1,.3));
  s+=card(640,90,480,300,tex(EQM,880,200,{size:46}),seg(p,0,.12));
  return s;
 },
 [K+'arate']:(p)=>{
  let s=card(80,90,480,300,label('初級の例',320,140,{size:26,color:CD,anchor:'middle'})+label('m ＝ 1 kg',320,205,{size:30,anchor:'middle'})+label('g ＝ 10 m/s²',320,260,{size:30,anchor:'middle'})+label('k ＝ 2 kg/s',320,315,{size:30,color:CF,anchor:'middle'}));
  s+=card(640,90,480,300,tex(EQM,880,165,{size:40})+fade(seg(p,.05,.3),tex('\\dfrac{dv}{dt}=10-2v',880,310,{size:46,color:C.ink}))+fade(seg(p,.05,.3),label('↓',880,240,{size:30,color:CD,anchor:'middle'})));
  s+=fade(seg(p,.5,.7),card(300,410,600,80,label('初級の表：a ＝ 10 − 2v と 同じ',600,462,{size:30,color:CH,anchor:'middle',weight:700}),1,CH));
  return s;
 },
 ...(()=>{
  const A0=()=>axes({x:110,y:450,w:470,h:330,xmax:.5,ymax:3.3,xticks:[.1,.2,.3,.4],yticks:[1,2,3],grid:true,xlabel:'t [s]',ylabel:'速度 v [m/s]',xcolor:CT,ycolor:CV});
  const stepPic=(A,p,{show2=1}={})=>{
   let s=dot(A.X(0),A.Y(0),7,CV)+line(A.X(0),A.Y(0),A.X(.1),A.Y(1),{color:CV,w:4})+dot(A.X(.1),A.Y(1),9,CV)+label('今',A.X(.1)-14,A.Y(1)-16,{size:24,color:CV,anchor:'end',weight:700});
   s+=draw([[A.X(.1),A.Y(1)],[A.X(.2),A.Y(1.8)]],seg(p,.2,.55),{color:CA,w:5})+fade(seg(p,.5,.6),dot(A.X(.2),A.Y(1.8),9,CH));
   s+=fade(seg(p,.2,.4),line(A.X(.1),A.Y(1),A.X(.2),A.Y(1),{color:CT,w:3,dash:'6 5'})+label('Δt',A.X(.15),A.Y(1)+30,{size:24,color:CT,anchor:'middle',weight:700}));
   s+=fade(seg(p,.45,.6),line(A.X(.2),A.Y(1),A.X(.2),A.Y(1.8),{color:CA,w:3,dash:'6 5'})+label('a × Δt',A.X(.2)+12,A.Y(1.4)+8,{size:24,color:CA,weight:700}));
   return s;
  };
  return {
   [K+'step1']:(p)=>{const A=A0();return A.svg+stepPic(A,p)+card(660,110,500,260,label('短い Δt の 間は',910,180,{size:28,anchor:'middle'})+label('今の 加速度が 続くと みなす',910,240,{size:30,color:CA,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('微分方程式の回と 同じ',910,310,{size:26,color:CD,anchor:'middle'})),seg(p,0,.12));},
   [K+'step2']:(p)=>{const A=A0();return A.svg+stepPic(A,1)+card(620,110,550,300,tex('v_{i+1}\\approx v_i+(10-2v_i)\\,\\Delta t',895,200,{size:40})
     +fade(seg(p,.1,.3),brace(700,752,240,{dir:1,color:CV,text:'今の 速度',size:22}))
     +fade(seg(p,.25,.45),brace(790,1110,240,{dir:1,color:CA,text:'加速度 × Δt',size:22}))
     +fade(seg(p,.6,.75),label('一歩の式',895,360,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));},
  };
 })(),
 [K+'row']:(p)=>{
  let s=tHead();
  s+=tRow(0,seg(p,.05,.3))+tRow(1,seg(p,.5,.75));
  s+=fade(seg(p,.05,.3),label('0 ＋ 10 × 0.1 ＝ 1.0',600,460,{size:28,color:CV,anchor:'middle'}));
  s+=fade(seg(p,.5,.75),label('1.0 ＋ 8 × 0.1 ＝ 1.8',600,500,{size:28,color:CV,anchor:'middle'}));
  s+=fade(seg(p,0,.2),label('Δt ＝ 0.1 s',1160,90,{size:26,color:CT,anchor:'end',weight:700}));
  return s;
 },
 [K+'row2']:(p)=>tHead()+tRow(0)+tRow(1)+tRow(2,seg(p,.05,.3))+tRow(3,seg(p,.35,.6))+label('Δt ＝ 0.1 s',1160,90,{size:26,color:CT,anchor:'end',weight:700})+fade(seg(p,.65,.8),label('初級の 表と 同じ数',600,460,{size:30,color:CH,anchor:'middle',weight:700})),
 [K+'map']:(p)=>{
  let s=tHead()+tRow(0)+tRow(1)+tRow(2)+tRow(3);
  const gs=[0,1,2,3].map(i=>seg(p,.1+i*.17,.22+i*.17));
  s+=tTerms(gs);
  [2,3,4,5].forEach((j,i)=>s+=highlight(CX[j]-70,HY-30,140,RY[3]-HY+50,gs[i]*.8,COLS[j]));
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=tHead()+tRow(0)+tRow(1)+tRow(2)+tRow(3)+tTerms();
  s+=card(200,410,800,90,label('初級の表 ＝ 運動方程式の 一歩ずつ版',600,468,{size:32,color:CH,anchor:'middle',weight:700}),seg(p,.1,.3),CH);
  return s;
 },
 [K+'redo']:(p)=>cycle(1,{resolved:seg(p,.2,.4)})+fade(seg(p,.55,.7),label('一歩ずつなら 追える',950,440,{size:30,color:CH,anchor:'middle',weight:700})),
 // ===== S5 右の辺を0と置く =====
 [K+'term']:(p)=>{
  const A=vtA();
  let s=A.svg+steps(A)+vinf(A,seg(p,.05,.2),'v∞');
  s+=card(660,110,500,280,label('加速が 止まる',910,165,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.45),tex('\\dfrac{dv}{dt}=0',910,265,{size:48}))
   +fade(seg(p,.6,.75),label('→ 右の辺 ＝ 0',910,360,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 ...(()=>{
  const r1=(g=1)=>fade(g,tex('mg-kv=0',330,150,{size:52}));
  const r2=(g=1)=>fade(g,tex('kv=mg',330,280,{size:52}));
  const r3=(g=1)=>fade(g,tex('v_\\infty=\\dfrac{mg}{k}',330,420,{size:56}));
  const ops=(g1=1,g2=1)=>fade(g1,label('両辺に ＋kv',560,225,{size:26,color:CH}))+fade(g2,label('両辺を k で 割る',560,360,{size:26,color:CH}));
  const box=(g=1)=>highlight(190,325,280,170,g);
  return {
   [K+'term2']:(p)=>r1()+ops(seg(p,.1,.25),seg(p,.45,.6))+r2(seg(p,.2,.35))+r3(seg(p,.55,.7))+box(seg(p,.7,.8))+fade(seg(p,.75,.9),label('終端速度',700,430,{size:40,color:CH,weight:700})),
   [K+'shortcut']:(p)=>r1()+fade(1-seg(p,0,.15),ops())+r2()+r3()+box()+card(660,110,500,280,label('方程式を 解き切らなくても',910,180,{size:28,anchor:'middle'})+label('右の辺 ＝ 0 と 置くだけで',910,245,{size:30,color:CH,anchor:'middle',weight:700})+label('行き先の 速さが 分かる',910,310,{size:30,color:CV,anchor:'middle',weight:700}),seg(p,.05,.25),CH),
  };
 })(),
 [K+'tunit']:(p)=>{
  let s=label('終端速度の 単位',600,80,{size:28,color:CD,anchor:'middle'});
  s+=tex('\\dfrac{\\mathrm{N}}{\\mathrm{kg/s}}',230,230,{size:58,auto:false});
  s+=fade(seg(p,.15,.4),tex('=\\mathrm{kg\\cdot m/s^2}\\times\\mathrm{s/kg}',640,230,{size:50,auto:false}));
  s+=fade(seg(p,.45,.65),tex('=\\mathrm{m/s}',600,360,{size:70,auto:false,color:CV}));
  s+=fade(seg(p,.7,.85),label('速さの 単位',600,450,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(80,80,440,300,label('ステージの例',300,130,{size:26,color:CD,anchor:'middle'})+label('m ＝ 2 kg',300,195,{size:30,anchor:'middle'})+label('g ＝ 10 m/s²',300,250,{size:30,anchor:'middle'})+label('k ＝ 4 kg/s',300,305,{size:30,color:CF,anchor:'middle'}),seg(p,0,.15));
  s+=fade(seg(p,.25,.45),tex('v_\\infty=\\dfrac{mg}{k}',620,150,{size:52,anchor:'start'}));
  s+=fade(seg(p,.45,.65),tex('=\\dfrac{2\\times 10}{4}',620+texWidth('v_\\infty',52)+2,270,{size:52,anchor:'start'}));
  s+=fade(seg(p,.7,.85),tex('=5\\ \\mathrm{m/s}',620+texWidth('v_\\infty',52)+2,390,{size:58,color:CH,anchor:'start'}));
  return s;
 },
 ...(()=>{
  const two=(gA=0,gB=0)=>ball(260,250,{r:34})+label('2 kg',306,215,{size:24,color:C.ink})+velA(260,250,3,{text:'3 m/s',dx:-100})
   +gravA(260,250,20,{r:34,px:8,text:'重力 20 N',g:gA})+resA(260,250,12,{r:34,px:8,text:'抵抗 12 N',g:gB});
  return {
   [K+'quiz']:(p)=>fade(seg(p,0,.2),two())+card(620,120,540,240,label('m ＝ 2 kg、k ＝ 4 kg/s',890,180,{size:28,anchor:'middle'})+label('3 m/s で 落ちているとき',890,240,{size:28,color:CV,anchor:'middle'})+label('加速度は？',890,310,{size:36,color:CH,anchor:'middle',weight:700}),seg(p,.15,.35),CH),
   [K+'quizA']:(p)=>{
    let s=two(seg(p,0,.15),seg(p,.05,.25));
    s+=card(620,90,540,340,label('抵抗 4 × 3 ＝ 12 N',890,150,{size:30,color:CF,anchor:'middle'})
     +fade(seg(p,.25,.4),label('合力 20 − 12 ＝ 8 N',890,215,{size:30,color:CF,anchor:'middle',weight:700}))
     +fade(seg(p,.45,.6),label('a ＝ 8 ÷ 2 ＝ 4 m/s²',890,285,{size:34,color:CA,anchor:'middle',weight:700}))
     +fade(seg(p,.7,.85),label('まだ 下向きに 加速',890,365,{size:28,color:CH,anchor:'middle'})),seg(p,0,.12),CH);
    s+=fade(seg(p,.3,.45),arrow(420,300,420,380,{color:CF,w:6})+label('8 N',432,350,{size:24,color:CF,weight:700}));
    return s;
   },
  };
 })(),
 // ===== S6 まとめと次の問い =====
 ...(()=>{
  const c1=(g=1)=>card(100,60,1000,190,label('下向きが 正、抵抗 ＝ kv（モデル）',600,110,{size:28,color:C.ink,anchor:'middle'})+tex(EQ,420,190,{size:46})+label('k の単位 kg/s',880,200,{size:30,color:CF,anchor:'middle',weight:700}),g,CH);
  const c2=(g=1)=>card(100,275,1000,190,label('落ち始め：dv/dt ＝ g',600,330,{size:30,color:CA,anchor:'middle'})+label('右の辺 ＝ 0 と 置くと',420,410,{size:28,anchor:'middle'})+tex('v_\\infty=\\dfrac{mg}{k}',820,405,{size:46}),g);
  return {
   [K+'sum1']:(p)=>c1(seg(p,0,.2)),
   [K+'sum2']:(p)=>c1()+c2(seg(p,0,.2)),
  };
 })(),
 [K+'nextq']:(p)=>{
  const A=vtA(seg(p,0,.12));
  let s=A.svg+vinf(A,seg(p,0,.15))+dot(A.X(0),A.Y(0),8,CV);
  const G=[t=>5*(1-Math.exp(-4*t)),t=>5*Math.min(1,t/1.2),t=>5*(1-Math.exp(-1.6*t))];
  G.forEach((f,i)=>s+=A.plot(f,{from:0,to:1.55,p:seg(p,.1+i*.1,.35+i*.1),color:CV,w:3,dash:'4 10'}));
  s+=fade(seg(p,.35,.5),label('？',A.X(.55),A.Y(3.2),{size:44,color:CH,weight:700,anchor:'middle'}));
  s+=card(660,110,500,300,label('次の問い',910,160,{size:26,color:CD,anchor:'middle'})
   +label('どんな 曲線で',910,225,{size:32,color:CV,anchor:'middle',weight:700})
   +label('どれくらいの 時間で 近づく？',910,280,{size:30,color:CT,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('式で 解けないか？',910,355,{size:34,color:CH,anchor:'middle',weight:700})),seg(p,.1,.25),CH);
  return s;
 },
};
