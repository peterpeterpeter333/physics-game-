// YouTube シリーズ「空気抵抗・初級 2/2」(ys-ui-drag-2) — 図。Stage 1200×515.
// 色（anim.mjs C）：力 F 緑、速度 v 紫、加速度 a 赤、時刻 t 金、強調・終端速度の線 黄。
// 例：m＝1 kg、g＝10 m/s²、k＝2 N·s/m → v∞＝5 m/s。0.1 s 刻み v_{n+1}＝1＋0.8 v_n（v_n＝5(1−0.8ⁿ)）。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,cart,ground} from './anim.mjs';

const K='ui-drag-2:';
const CF=C.F,CV=C.v,CA=C.a,CT=C.t,CH=C.hi;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const swap=(p,a,b,t=.12)=>fade(1-seg(p,0,t),a)+fade(seg(p,t*.6,t+.1),b);
const VN=n=>5*(1-Math.pow(.8,n));

const NPX=11;
function ball(x,y,{r=30,g=1}={}){return fade(g,ring(x,y,r,{color:C.dim,w:3,fill:'#2b3d63'})+dot(x-9,y-9,7,'#5a73a6'));}
function gravA(x,y,N,{r=30,g=1,text='重力',px=NPX,tx=16}={}){const L=N*px;return arrow(x,y+r,x,y+r+L,{color:CF,w:6,g})+(text?fade(g,label(text,x+tx,y+r+L-4,{size:24,color:CF})):'');}
function resA(x,y,N,{r=30,g=1,text='抵抗',px=NPX,tx=16}={}){const L=N*px;if(L<2)return '';return arrow(x,y-r,x,y-r-L,{color:CF,w:6,g})+(text?fade(g,label(text,x+tx,y-r-L+18,{size:24,color:CF})):'');}
function velA(x,y,v,{g=1,px=30,text='速度',dx=-70}={}){const L=v*px;if(L<2)return '';return arrow(x+dx,y-L/2,x+dx,y+L/2,{color:CV,w:7,g})+(text?fade(g,label(text,x+dx,y-L/2-10,{size:24,color:CV,anchor:'middle'})):'');}

// ---- S3 table --------------------------------------------------------------------------------------
const CX=[80,200,350,505,650,800,1000],HY=130;
const ROWS=[['0','0','0','10','10','1.0','1.0'],['0.1','1.0','2','8','8','0.8','1.8'],['0.2','1.8','3.6','6.4','6.4','0.64','2.44'],['0.3','2.44','4.88','5.12','5.12','0.512','2.95']];
const RY=[207,257,307,357];
const COLS=[CT,CV,CF,CF,CA,CV,CV];
function tTop(ga=1){return label('固定：重力 10 N',40,50,{size:26,color:CF})+label('変化：抵抗 2v',40,90,{size:26,color:CF})+fade(ga,label('a ＝ (10 − 2v) ÷ 1 kg ＝ 10 − 2v',1160,70,{size:30,color:CA,anchor:'end',weight:700}));}
function tHead(g=1){
 const H=[['t','[s]'],['v','[m/s]'],['抵抗','[N]'],['合力','[N]'],['a','[m/s²]'],['増え分','[m/s]'],['0.1 秒後の v','[m/s]']];
 return fade(g,H.map(([a,b],i)=>label(a,CX[i],HY,{size:26,color:COLS[i],anchor:'middle',weight:700})+label(b,CX[i],HY+28,{size:20,color:C.dim,anchor:'middle'})).join('')+line(30,HY+42,1170,HY+42,{color:C.faint,w:2}));
}
function tRow(i,gs){gs=gs??[1,1,1,1,1,1,1];
 return ROWS[i].map((v,j)=>{const txt=j===6?'≈ '+v:v;return fade(1-gs[j],j>1?label('？',CX[j],RY[i],{size:26,color:CH,anchor:'middle'}):'')+fade(gs[j],label(txt,CX[j],RY[i],{size:28,color:COLS[j],anchor:'middle',weight:j===6?700:400}));}).join('');}
const seq=(p,a,b,n=7)=>Array.from({length:n},(_,j)=>seg(p,a+(b-a)*j/n,a+(b-a)*(j+1)/n));

// ---- S3b bars: purple = v, yellow = remaining to 5 --------------------------------------------------
const BX=190,BW=180,BY=[105,163,221,279,337];
function bars({gv=[1,1,1,1,1],gr=[0,0,0,0,0],inc=[0,0,0,0,0]}={}){
 let s=label('0',BX,78,{size:22,color:C.dim,anchor:'middle'})+label('5 m/s',BX+5*BW,78,{size:22,color:CH,anchor:'middle'})+line(BX+5*BW,88,BX+5*BW,370,{color:CH,w:3,dash:'8 6'});
 for(let n=0;n<5;n++){const v=VN(n),y=BY[n];
  s+=fade(gv[n],label(`t ＝ ${(n/10).toFixed(1)}`,40,y+22,{size:24,color:CT})+rect(BX,y,BW*v,30,{fill:CV,fo:.75,rx:4})+(n?label(v.toFixed(2).replace(/0$/,'').replace(/\.0$/,'').replace('2.95','2.95'),BX+BW*v-8,y+23,{size:20,color:'#0b1122',anchor:'end',weight:700}):''));
  if(n>0)s+=fade(inc[n],rect(BX+BW*VN(n-1),y-3,BW*(v-VN(n-1)),36,{fill:'none',fo:0,stroke:CH,sw:2.5,rx:4})+label('＋'+['','1.0','0.8','0.64','0.512'][n],BX+BW*VN(n-1)+BW*(v-VN(n-1))/2,y-8,{size:20,color:CH,anchor:'middle'}));
  s+=fade(gr[n],rect(BX+BW*v,y,BW*(5-v),30,{fill:CH,fo:.25,stroke:CH,sw:1.5,rx:4})+label(['5','4','3.2','2.56','2.05'][n],BX+BW*(v+5)/2,y+23,{size:22,color:CH,anchor:'middle',weight:700}));
 }
 return s;
}

// ---- v–t graph of the steps -----------------------------------------------------------------------
function vtAxes(g=1){return axes({x:110,y:440,w:700,h:330,xmax:1.6,ymax:6,xticks:[.5,1,1.5],yticks:[1,2,3,4,5],grid:true,g,xlabel:'t [s]',ylabel:'速度 v [m/s]',xcolor:CT,ycolor:CV});}
function steps(A,p=1){const pts=Array.from({length:16},(_,n)=>[A.X(n/10),A.Y(VN(n))]);return draw(pts,p,{color:CV,w:4})+pts.map((q,i)=>fade(seg(p,i/16,(i+1)/16),dot(q[0],q[1],5,CV))).join('');}
const vinf=(A,g=1)=>fade(g,line(A.X(0),A.Y(5),A.X(1.6),A.Y(5),{color:CH,w:3,dash:'10 7'})+label('v∞ ＝ 5 m/s',A.X(1.6)+10,A.Y(5)+8,{size:24,color:CH,weight:700}));

export const ytUiDrag2Diagrams={
 // ===== S1 =====
 [K+'recap']:(p)=>{
  let s=ball(280,255)+gravA(280,255,10,{text:'重力 10 N',g:seg(p,0,.2)})+resA(280,255,10,{text:'抵抗 10 N',g:seg(p,0,.2)})+velA(280,255,3,{g:seg(p,.3,.5)});
  s+=card(560,140,590,230,label('前回',855,190,{size:26,color:C.dim,anchor:'middle'})+label('合力 0 → a ＝ 0',855,255,{size:34,color:CF,anchor:'middle',weight:700})+label('落下中なら 同じ速度で 落ち続ける',855,320,{size:28,color:CV,anchor:'middle'}),seg(p,.2,.4));
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=fade(1-seg(p,0,.15),ball(280,255)+gravA(280,255,10,{text:'重力 10 N'})+resA(280,255,10,{text:'抵抗 10 N'})+velA(280,255,3));
  s+=fade(seg(p,.1,.3),ball(280,120)+label('速度 0 から',280,70,{size:26,color:CV,anchor:'middle'})+arrow(280,160,280,450,{color:C.faint,w:3}));
  const old=card(560,140,590,230,label('前回',855,190,{size:26,color:C.dim,anchor:'middle'})+label('合力 0 → a ＝ 0',855,255,{size:34,color:CF,anchor:'middle',weight:700})+label('落下中なら 同じ速度で 落ち続ける',855,320,{size:28,color:CV,anchor:'middle'}));
  const nw=card(560,140,590,230,label('前回の最後の問い',855,190,{size:26,color:C.dim,anchor:'middle'})+label('静止から落とすと 加速はいつ止まる？',855,260,{size:30,color:CH,anchor:'middle',weight:700})+label('そのときの 速さは？',855,320,{size:30,color:CH,anchor:'middle',weight:700}),1,CH);
  return s+swap(p,old,nw);
 },
 [K+'setup']:(p)=>{
  let s=card(60,70,500,300,label('今回の例',310,115,{size:26,color:C.dim,anchor:'middle'})
   +label('質量 m ＝ 1 kg',110,180,{size:30})+label('g ＝ 10 m/s²',110,240,{size:30})+label('抵抗 R ＝ kv',110,300,{size:30,color:CF})+label('k ＝ 2 N·s/m',330,300,{size:30,color:CF}),seg(p,0,.2));
  s+=arrow(580,220,660,220,{color:C.dim,w:4,g:seg(p,.45,.6)});
  s+=card(680,70,480,300,label('重力 mg ＝ 10 N（一定）',920,180,{size:30,color:CF,anchor:'middle'})+label('抵抗 R ＝ 2v [N]',920,260,{size:30,color:CF,anchor:'middle',weight:700})+label('v は m/s で',920,310,{size:22,color:C.dim,anchor:'middle'}),seg(p,.55,.75));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(60,70,500,300,label('今回の例',310,115,{size:26,color:C.dim,anchor:'middle'})+label('質量 m ＝ 1 kg',110,180,{size:30})+label('g ＝ 10 m/s²',110,240,{size:30})+label('抵抗 R ＝ kv',110,300,{size:30,color:CF})+label('k ＝ 2 N·s/m',330,300,{size:30,color:CF}));
  s+=arrow(580,220,660,220,{color:C.dim,w:4})+card(680,70,480,300,label('重力 mg ＝ 10 N（一定）',920,180,{size:30,color:CF,anchor:'middle'})+label('抵抗 R ＝ 2v [N]',920,260,{size:30,color:CF,anchor:'middle',weight:700})+label('v は m/s で',920,310,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(160,390,880,110,label('① 加速が止まる速さは？',230,458,{size:30,color:CH,weight:700})+fade(seg(p,.45,.6),label('② どう近づく？',700,458,{size:30,color:CH,weight:700})),seg(p,.1,.3),CH);
  return s;
 },

 // ===== S2 加速が止まる条件 =====
 ...(()=>{
  const chain=(g=[1,1,1],y=70)=>{const B=[['加速が止まる',C.ink],['a ＝ 0',CA],['合力 ＝ 0',CF]];let s='';B.forEach(([t,c],i)=>{s+=card(90+i*360,y-40,290,70,label(t,235+i*360,y+8,{size:30,color:c,anchor:'middle',weight:700}),g[i]);if(i)s+=fade(g[i],label('⇔',55+i*360,y+8,{size:34,color:C.dim,anchor:'middle'}));});return s;};
  const r1=(g=1,c=C.ink)=>fade(g,tex('mg-kv=0',330,190,{size:50,color:c,auto:c===C.ink}));
  const r2=(g=1)=>fade(g,tex('kv=mg',330,290,{size:50}));
  const r3=(g=1)=>fade(g,tex('v_\\infty=\\dfrac{mg}{k}',330,428,{size:54}));
  return {
   [K+'cond']:(p)=>chain([seg(p,0,.2),seg(p,.3,.45),seg(p,.6,.75)],200)+fade(seg(p,.35,.5),label('加速度は 合力で決まる（ma ＝ F）',600,330,{size:28,color:C.dim,anchor:'middle'}))+fade(seg(p,.75,.9),label('合力が 0 になる 速さ v を探す',600,400,{size:32,color:CH,anchor:'middle',weight:700})),
   [K+'eq1']:(p)=>{
    let s=chain()+r1(seg(p,.1,.3));
    s+=fade(seg(p,.1,.3),label('合力',120,198,{size:26,color:CF}));
    s+=fade(seg(p,.6,.8),label('分からないのは 速さ v だけ',640,198,{size:30,color:CV,weight:700}));
    return s;
   },
   [K+'eq2']:(p)=>{
    let s=chain()+r1();
    s+=fade(seg(p,.05,.25),label('＋kv',240,135,{size:28,color:CH,weight:700,anchor:'middle'})+label('＋kv',440,135,{size:28,color:CH,weight:700,anchor:'middle'})+label('両辺に kv を足す',640,230,{size:24,color:CH}));
    s+=r2(seg(p,.3,.5))+fade(seg(p,.55,.75),label('抵抗 ＝ 重力',640,298,{size:32,color:CF,weight:700}));
    return s;
   },
   [K+'eq3']:(p)=>{
    let s=chain()+r1()+r2()+label('抵抗 ＝ 重力',640,298,{size:32,color:CF,weight:700});
    s+=fade(seg(p,.05,.2),label('両辺を k で割る',640,370,{size:24,color:CH}));
    s+=r3(seg(p,.2,.4))+highlight(200,352,270,140,seg(p,.55,.7));
    s+=fade(seg(p,.6,.8),label('終端速度',640,430,{size:36,color:CH,weight:700}));
    return s;
   },
   [K+'unit']:(p)=>{
    let s=chain()+r1()+r2()+r3()+highlight(200,352,270,140,1);
    s+=card(620,230,550,250,label('単位',895,275,{size:26,color:C.dim,anchor:'middle'})+tex('\\dfrac{\\mathrm{N}}{\\mathrm{N\\cdot s/m}}=\\mathrm{m/s}',895,370,{size:44})+fade(seg(p,.6,.8),label('速さの単位',895,455,{size:28,color:CV,anchor:'middle',weight:700})),seg(p,0,.15));
    return s;
   },
   [K+'shortcut']:(p)=>{
    let s=chain()+r1()+r2()+r3()+highlight(200,352,270,140,1);
    s+=card(620,230,550,250,label('運動の全体を 解かなくても',895,300,{size:28,anchor:'middle'})+label('a ＝ 0 と置くだけで',895,360,{size:32,color:CA,anchor:'middle',weight:700})+label('行き先の速さが 分かる',895,420,{size:32,color:CH,anchor:'middle',weight:700}),seg(p,0,.2),CH);
    return s;
   },
  };
 })(),
 [K+'num']:(p)=>{
  let s=tex('v_\\infty=\\dfrac{mg}{k}',330,200,{size:56});
  s+=fade(seg(p,.2,.4),tex('=\\dfrac{10\\,\\mathrm{N}}{2\\,\\mathrm{N\\cdot s/m}}',650,200,{size:50}));
  s+=fade(seg(p,.55,.75),tex('=5\\,\\mathrm{m/s}',980,200,{size:56,color:CH}));
  s+=fade(seg(p,.2,.4),label('mg ＝ 1 × 10 ＝ 10 N',330,360,{size:30,color:CF,anchor:'middle'})+label('k ＝ 2 N·s/m',760,360,{size:30,color:CF,anchor:'middle'}));
  return s;
 },
 [K+'arrows']:(p)=>{
  let s='';const V=[1,3,5],X=[200,500,800];
  V.forEach((v,i)=>{const g=seg(p,.1+i*.25,.25+i*.25);
   s+=fade(g,ball(X[i],250,{r:26})+gravA(X[i],250,10,{r:26,text:'10 N'})+resA(X[i],250,2*v,{r:26,text:`${2*v} N`})+label(`v ＝ ${v} m/s`,X[i],500,{size:28,color:CV,anchor:'middle',weight:700}));});
  const g=seg(p,.8,.95);
  s+=fade(g,line(740,114,860,114,{color:CH,w:2,dash:'5 5'})+line(740,386,860,386,{color:CH,w:2,dash:'5 5'})+ring(800,250,40,{color:CH,w:3}));
  s+=fade(g,label('重力と 同じ長さ',1040,240,{size:30,color:CH,anchor:'middle',weight:700})+label('＝ 終端速度',1040,290,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S3 0.1秒ずつ追う =====
 [K+'intro']:(p)=>tTop(0)+tHead(seg(p,.4,.6)),
 [K+'aeq']:(p)=>tTop(seg(p,.4,.6))+tHead(),
 [K+'row0']:(p)=>tTop()+tHead()+tRow(0,seq(p,.05,.85)),
 [K+'approx']:(p)=>tTop()+tHead()+tRow(0)+highlight(CX[6]-80,RY[0]-36,160,50,seg(p,.2,.35))+fade(seg(p,.3,.5),label('≈：0.1 秒の間 a を一定と みなした 近似',600,460,{size:28,color:CH,anchor:'middle'})),
 [K+'row1']:(p)=>tTop()+tHead()+tRow(0)+tRow(1,seq(p,.05,.85))+label('≈：0.1 秒の間 a を一定と みなした 近似',600,460,{size:24,color:C.dim,anchor:'middle'}),
 [K+'row2']:(p)=>tTop()+tHead()+tRow(0)+tRow(1)+tRow(2,seq(p,.05,.85))+label('≈：0.1 秒の間 a を一定と みなした 近似',600,460,{size:24,color:C.dim,anchor:'middle'}),
 [K+'quiz']:(p)=>tTop()+tHead()+tRow(0)+tRow(1)+tRow(2)+tRow(3,[seg(p,.05,.2),seg(p,.1,.25),0,0,0,0,0])+highlight(CX[6]-80,RY[3]-36,160,50,seg(p,.3,.5)),
 [K+'row3']:(p)=>tTop()+tHead()+tRow(0)+tRow(1)+tRow(2)+tRow(3,[1,1,...seq(p,.05,.85,5)]),
 [K+'incr']:(p)=>bars({gv:[1,...[1,2,3,4].map(i=>seg(p,(i-1)*.18,(i-1)*.18+.12))],inc:[0,...[1,2,3,4].map(i=>seg(p,(i-1)*.18+.05,(i-1)*.18+.15))]})+fade(seg(p,.75,.9),label('増え分：毎回 × 0.8',600,450,{size:32,color:CH,anchor:'middle',weight:700})),
 [K+'gap']:(p)=>bars({inc:[0,1,1,1,1],gr:[0,1,2,3,4].map(i=>seg(p,i*.14,i*.14+.1))})+fade(seg(p,.75,.9),label('5 までの残りも：毎回 × 0.8',600,450,{size:32,color:CH,anchor:'middle',weight:700})),
 [K+'factor']:(p)=>{
  let s=bars({inc:[0,1,1,1,1],gr:[1,1,1,1,1]});
  s+=card(150,395,900,110,tex('a=10-2v',330,450,{size:40})+fade(seg(p,.2,.4),tex('=2\\times(5-v)',610,450,{size:40}))+fade(seg(p,.5,.7),label('＝ 残りの 2 倍',960,462,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 [K+'link']:(p)=>{
  let s=bars({inc:[0,1,1,1,1],gr:[1,1,1,1,1]});
  const old=card(150,395,900,110,tex('a=10-2v',330,450,{size:40})+tex('=2\\times(5-v)',610,450,{size:40})+label('＝ 残りの 2 倍',960,462,{size:30,color:CH,anchor:'middle',weight:700}),1,CH);
  const nw=card(150,395,900,110,label('微分方程式の回：速さが 毎秒 0.9 倍',600,440,{size:28,color:C.dim,anchor:'middle'})+label('今回：残りが 0.1 秒ごとに 0.8 倍 ― 同じ形',600,485,{size:28,color:CH,anchor:'middle',weight:700}),1,CH);
  return s+swap(p,old,nw);
 },

 // ===== S4 5を越えない =====
 ...(()=>{
  const NL=(g=1)=>{const X=v=>120+v*160;let s=line(X(0),250,X(6.3),250,{color:C.dim,w:3});for(let v=0;v<=6;v++)s+=line(X(v),242,X(v),258,{color:C.dim,w:2})+label(String(v),X(v),290,{size:22,color:C.dim,anchor:'middle'});
   s+=line(X(5),150,X(5),330,{color:CH,w:3,dash:'8 6'})+label('5 m/s',X(5),140,{size:24,color:CH,anchor:'middle',weight:700})+label('速度 v [m/s]',X(6.3),330,{size:22,color:CV,anchor:'end'});return {X,s:fade(g,s)};};
  return {
   [K+'never']:(p)=>{
    const {X,s:b}=NL();let s=b;const n=Math.floor(16*clamp(p/.8));
    for(let i=0;i<=n;i++)s+=dot(X(VN(i)),250,7,CV);
    s+=fade(seg(p,.6,.8),label('残り × 0.8 × 0.8 × … は 0 にならない',600,420,{size:30,color:CH,anchor:'middle',weight:700}));
    s+=fade(seg(p,.75,.9),label('5 を 越えない',X(5)+20,200,{size:26,color:CH}));
    return s;
   },
   [K+'over']:(p)=>{
    let s='';

    s+=card(90,60,520,120,label('6 m/s で 落ちていたら',350,105,{size:28,color:CV,anchor:'middle'})+label('抵抗 2 × 6 ＝ 12 N',350,155,{size:28,color:CF,anchor:'middle'}),seg(p,0,.15));
    s+=ball(820,260,{r:26})+gravA(820,260,10,{r:26,px:10,text:'重力 10 N'})+resA(820,260,12,{r:26,px:10,text:'抵抗 12 N',g:seg(p,.1,.3)});
    s+=fade(seg(p,.4,.6),label('合力 10 − 12 ＝ −2 N',350,300,{size:32,color:CF,anchor:'middle',weight:700})+label('（上向き）',350,350,{size:28,color:CF,anchor:'middle'}));
    s+=fade(seg(p,.7,.9),label('→ 遅くなる',350,420,{size:32,color:CH,anchor:'middle',weight:700}));
    return s;
   },
   [K+'over2']:(p)=>{
    const {X,s:b}=NL();let s=b;
    s+=arrow(X(1.5),210,X(4.8),210,{color:CV,w:5,g:seg(p,.1,.35)})+fade(seg(p,.1,.35),label('遅ければ 加速',X(3.1),190,{size:26,color:CV,anchor:'middle'}));
    s+=arrow(X(6.2),210,X(5.2),210,{color:CA,w:5,g:seg(p,.35,.6)})+fade(seg(p,.35,.6),label('速ければ 減速',X(5.8),190,{size:26,color:CA,anchor:'middle'}));
    s+=fade(seg(p,.65,.85),label('どちら側からも 5 m/s へ',600,420,{size:32,color:CH,anchor:'middle',weight:700}));
    return s;
   },
  };
 })(),
 [K+'finer']:(p)=>{
  const A=vtAxes(1);let s=A.svg+vinf(A)+steps(A,1);
  const fine=[];let v=0;for(let n=0;n<=160;n++){fine.push([A.X(n/100),A.Y(v)]);v+=0.01*(10-2*v);}
  s+=draw(fine,seg(p,.1,.5),{color:C.x,w:3,dash:'8 6'});
  s+=fade(seg(p,.05,.2),label('0.1 秒刻み',860,300,{size:26,color:CV})+dot(845,292,6,CV));
  s+=fade(seg(p,.3,.5),label('0.01 秒刻み',860,350,{size:26,color:C.x})+line(832,342,856,342,{color:C.x,w:3,dash:'6 4'}));
  s+=fade(seg(p,.6,.8),label('どちらも 5 に近づき 越えない',860,420,{size:26,color:CH,weight:700}));
  return s;
 },

 // ===== S5 グラフを読む =====
 [K+'graph']:(p)=>{const A=vtAxes(seg(p,0,.15));return A.svg+steps(A,seg(p,.2,.8))+vinf(A,seg(p,.5,.7))+fade(seg(p,.8,.95),label('下から 近づく',A.X(1.1),A.Y(4.2)+40,{size:26,color:CV}));},
 [K+'slope']:(p)=>{
  const A=vtAxes();let s=A.svg+steps(A)+vinf(A);
  const tan=(t0,a,g,txt,dy)=>{const v0=VN(Math.round(t0*10)),d=.12,d0=t0?d:0;return fade(g,line(A.X(t0-d0),A.Y(v0-a*d0),A.X(t0+d),A.Y(v0+a*d),{color:CA,w:5})+label(txt,A.X(t0)+18,A.Y(v0)+dy,{size:26,color:CA,weight:700}));};
  s+=tan(0,10,seg(p,.1,.3),'傾き 10',30);
  s+=tan(.5,10-2*VN(5),seg(p,.4,.6),'傾き ≈ 3.3',46);
  s+=tan(1.2,10-2*VN(12),seg(p,.65,.8),'傾き ≈ 0.7',46);
  s+=fade(seg(p,.8,.95),label('傾き ＝ 加速度 → 0',930,300,{size:28,color:CA,weight:700}));
  return s;
 },
 [K+'zero']:(p)=>{
  const A=vtAxes();let s=A.svg+steps(A)+vinf(A);
  s+=card(850,220,320,180,label('0 になるのは',1010,262,{size:24,color:C.dim,anchor:'middle'})+label('加速度 a',1010,308,{size:32,color:CA,anchor:'middle',weight:700})+fade(seg(p,.4,.6),label('速度 → 5 m/s',1010,370,{size:30,color:CV,anchor:'middle',weight:700})),seg(p,0,.2),CH);
  return s;
 },
 [K+'position']:(p)=>{
  const A=axes({x:110,y:440,w:620,h:330,xmax:3.2,ymax:14,xticks:[1,2,3],yticks:[5,10],grid:true,g:seg(p,0,.15),xlabel:'t [s]',ylabel:'位置 x [m]',xcolor:CT,ycolor:C.x});
  const x=t=>5*t-2.5*(1-Math.exp(-2*t));
  let s=A.svg+A.plot(x,{from:0,to:3.1,p:seg(p,.1,.5),color:C.x,w:4});
  s+=A.plot(t=>5*t-2.5,{from:.8,to:3.1,p:seg(p,.6,.8),color:CH,w:2,dash:'8 6'});
  s+=fade(seg(p,.05,.2),label('位置の グラフ',900,150,{size:28,color:C.x,weight:700}));
  s+=fade(seg(p,.35,.5),label('止まらず 増え続ける',900,230,{size:28}));
  s+=fade(seg(p,.7,.85),label('やがて 傾き 5 m/s',900,300,{size:28,color:CH,weight:700})+label('（毎秒 約 5 m）',900,345,{size:26,color:C.dim}));
  return s;
 },
 ...(()=>{
  const two=(g2=0)=>{let s=ball(250,250,{r:34})+label('1 kg',250,258,{size:22,anchor:'middle'})+ball(550,250,{r:34})+label('2 kg',550,258,{size:22,anchor:'middle'});
   s+=label('同じ形・同じ大きさ',400,90,{size:28,color:C.dim,anchor:'middle'});
   s+=fade(g2,gravA(250,250,10,{r:34,px:8,text:'10 N'})+gravA(550,250,20,{r:34,px:8,text:'20 N'})+label('k ＝ 2（同じとする）',400,140,{size:26,color:CF,anchor:'middle'}));
   return s;};
  return {
   [K+'quiz2']:(p)=>fade(seg(p,0,.2),two())+card(740,150,420,200,label('2 kg の球の',950,215,{size:28,anchor:'middle'})+label('終端速度は？',950,280,{size:36,color:CH,anchor:'middle',weight:700}),seg(p,.2,.4),CH),
   [K+'ans2']:(p)=>{
    let s=two(seg(p,.05,.25));
    s+=card(740,150,420,260,label('2 kg の球',950,200,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.4,.6),tex('v_\\infty=\\dfrac{20}{2}=10\\,\\mathrm{m/s}',950,285,{size:40}))+fade(seg(p,.75,.9),label('重い方が 速く落ちる',950,375,{size:30,color:CH,anchor:'middle',weight:700})),1,CH);
    return s;
   },
  };
 })(),
 [K+'caveat']:(p)=>card(170,120,860,270,label('R ＝ kv は モデル（仮定）',600,185,{size:34,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),label('実際の雨粒や 人の落下では',600,260,{size:28,anchor:'middle'})+label('抵抗の式も 係数も 違う',600,310,{size:28,anchor:'middle'}))
   +fade(seg(p,.6,.8),label('→ この計算を そのまま使えるとは 限らない',600,360,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.2),CH),

 // ===== S6 =====
 ...(()=>{
  const c1=(g=1)=>card(120,50,960,190,label('加速が止まる条件：合力 ＝ 0',600,105,{size:30,anchor:'middle',weight:700})+tex('mg-kv=0\\;\\Rightarrow\\;v_\\infty=\\dfrac{mg}{k}',600,185,{size:42}),g,CH);
  const c2=(g=1)=>card(120,265,960,190,label('静止から：残りが 同じ割合で 減りながら',600,320,{size:30,anchor:'middle'})+label('速度は 終端速度へ 近づく',600,370,{size:30,color:CV,anchor:'middle',weight:700})+label('0 になるのは 加速度（速度ではない）',600,420,{size:28,color:CA,anchor:'middle'}),g);
  return {
   [K+'sum1']:(p)=>c1(seg(p,0,.2)),
   [K+'sum2']:(p)=>c1()+c2(seg(p,0,.2)),
  };
 })(),
 [K+'next']:(p)=>{
  const x=mix(300,700,smooth(clamp((p-.2)/.6)));
  let s=ground(100,1100,380)+cart(x,380,{w:140,h:70,color:C.x});
  s+=arrow(x-200,330,x-80,330,{color:CF,w:7,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('力',x-140,310,{size:26,color:CF,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),line(300,420,x,420,{color:C.x,w:4})+label('動いた距離',(300+x)/2,455,{size:24,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),label('力が 物体を動かす → エネルギーを渡す',600,120,{size:32,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=ground(100,1100,380)+cart(700,380,{w:140,h:70,color:C.x})+arrow(500,330,620,330,{color:CF,w:7})+label('力',560,310,{size:26,color:CF,anchor:'middle'})+line(300,420,700,420,{color:C.x,w:4})+label('動いた距離',500,455,{size:24,color:C.x,anchor:'middle'});
  s+=card(250,60,700,170,label('次の問い',600,105,{size:26,color:C.dim,anchor:'middle'})+label('渡す量 ＝ 仕事 は どう測る？',600,180,{size:36,color:CH,anchor:'middle',weight:700}),seg(p,0,.2),CH);
  return s;
 },
};
