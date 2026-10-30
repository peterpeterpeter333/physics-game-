// YouTube シリーズ「電位・上級 2/2」(ys-ue-potential-2) — 図。Stage 1200×515.
// 色：電場 𝐄 水色、電位 V 紫、一歩 d𝐫 金、半径方向の段 水色、円周方向の段 灰、正電荷 赤、負電荷 青、エネルギー U 橙、力 緑、強調 黄、誤り 赤。
// 極の図：電荷を (PC.x, PC.y) に置き、1 m を PC.s px で描く。角度は数学の向き（反時計回り、画面では上が +）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,texWidth,poly} from './anim.mjs';
import {EC,VC,GC,SC,LC,POS,NEG,OK,BAD,cs,T,L,card,TF,strike,charge,vE,V,dr,U} from './yt1-ue-potential-1-diagrams.mjs';

const K='ue-potential-2:';
const UC=C.E,FC=C.F,GREY='#8da0bf';
const rad=d=>d*Math.PI/180;
const PC={x:250,y:330,s:120};
const P=(r,deg)=>[PC.x+PC.s*r*Math.cos(rad(deg)),PC.y-PC.s*r*Math.sin(rad(deg))];
const kq=s=>`\\dfrac{kQ}{${s}^2}`;
function circ(r,{color=VC,w=2,op=.45,dash='6 7'}={}){return `<g opacity="${op}">${ring(PC.x,PC.y,PC.s*r,{color,w,dash})}</g>`;}
function radialE({g=1,n=12,r0=.35,r1=.75}={}){let s='';for(let i=0;i<n;i++){const a=i*360/n;const [x0,y0]=P(r0,a),[x1,y1]=P(r1,a);s+=arrow(x0,y0,x1,y1,{color:EC,w:3,head:10});}return fade(g,s);}
function polarBase({g=1,circles=[1,2],E=1,lab=1}={}){
 let s='';circles.forEach(r=>{s+=circ(r);if(lab){const [x,y]=P(r,-8);s+=label(`${r} m`,x+4,y+20,{size:22,color:VC});}});
 s+=radialE({g:E*.6});
 s+=charge(PC.x,PC.y,1,20);
 return fade(g,s);
}
// smooth path A(1 m, 30°) -> B(2 m, 110°)
const pathPts=(n=60)=>Array.from({length:n+1},(_,i)=>{const t=i/n;const r=1+t+0.35*Math.sin(Math.PI*t),a=30+80*t+12*Math.sin(2*Math.PI*t);return P(r,a);});
// staircase: alternate arc and radial steps; list of [type, r, a0, a1] or ['r', r0, r1, a]
function stairs(steps){
 let r=1,a=30;const out=[];
 for(const [da,drr] of steps){if(da){out.push(['a',r,a,a+da]);a+=da;}if(drr){out.push(['r',r,r+drr,a]);r+=drr;}}
 return out;
}
const ST=stairs([[20,.25],[20,.25],[20,.25],[20,.25]]);
const ST2=stairs([[15,.5],[15,.5],[15,.5],[20,-.25],[15,-.25]]);
function drawStairs(st,{g=1,ha=0,hr=0,w=5,gi=null}={}){
 let s='';st.forEach((q,i)=>{const gg=gi?gi(i):g;if(gg<=.001)return;
  if(q[0]==='a'){const pts=Array.from({length:13},(_,k)=>P(q[1],mix(q[2],q[3],k/12)));s+=fade(gg,draw(pts,1,{color:ha?C.ink:GREY,w:ha?w+1:w}));}
  else{const [x0,y0]=P(q[1],q[3]),[x1,y1]=P(q[2],q[3]);s+=fade(gg,arrow(x0,y0,x1,y1,{color:hr?C.hi:EC,w:hr?w+1:w,head:12}));}});
 return s;
}
function AB({a=1,b=1,bpos=[2,110]}={}){
 const [xa,ya]=P(1,30),[xb,yb]=P(bpos[0],bpos[1]);
 return fade(a,dot(xa,ya,8,C.ink)+label('A',xa+12,ya+8,{size:26,color:C.ink,weight:700}))+fade(b,dot(xb,yb,8,C.ink)+label('B',xb-14,yb-8,{size:26,color:C.ink,weight:700,anchor:'end'}));
}

export const ytUePotential2Diagrams={
 // ===== S1 前回の問い =====
 [K+'prev']:(p)=>{
  let s=card(80,90,480,320,L('前回',320,140,{size:24,color:C.dim})+TF(`${vE}=-${cs(GC,'\\nabla')}${V}`,320,250,{size:56,box:true}),seg(p,0,.15));
  s+=card(640,90,480,320,L('借りた もの',880,140,{size:24,color:C.dim})+T(`${V}=\\dfrac{kQ}{r}`,880,250,{size:56})
   +fade(seg(p,.5,.65),L('中級の 結果（差の 商で 確かめた）',880,350,{size:24,color:C.hi})),seg(p,.4,.5),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(150,70,900,380,L('前回の 最後の 問い',600,120,{size:24,color:C.dim}),1,C.hi);
  s+=T(`${V}=\\dfrac{kQ}{r}`,330,230,{size:50})+label('を 積分から 導けるか',450,240,{size:32,color:C.hi,weight:700});
  s+=fade(seg(p,.4,.55),label('どんな 静電場でも 道に よらない',600,350,{size:32,color:C.hi,anchor:'middle',weight:700})+label('と、なぜ 言えるか',600,400,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'recall']:(p)=>{
  // uniform field, two paths A->B
  const x0=110,y0=400,sx=110,sy=110;let s=rect(60,70,520,400,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:6});
  [130,200,270,340,410].forEach(y=>{s+=arrow(90,y,550,y,{color:EC,w:2,head:10,opacity:.45});});
  const A=[x0,y0],B=[x0+3*sx,y0-2*sy];
  s+=draw([A,[B[0],A[1]],B],seg(p,.1,.35),{color:'#7fb3ff',w:5})+draw([A,[A[0],B[1]],B],seg(p,.2,.45),{color:'#ff8fb0',w:5});
  s+=dot(A[0],A[1],8,C.ink)+label('A',A[0]-12,A[1]+8,{size:24,color:C.ink,anchor:'end',weight:700})+dot(B[0],B[1],8,C.ink)+label('B',B[0]+12,B[1]-6,{size:24,color:C.ink,weight:700});
  s+=card(640,90,520,330,L('中級で 確かめたこと',900,140,{size:24,color:C.dim})
   +L('一様な 電場：どの 道でも 同じ',900,210,{size:28,color:C.ink})
   +T(`\\oint ${vE}\\cdot ${dr}=0`,900,290,{size:44})
   +fade(seg(p,.55,.7),L('一般の 静電場では？ → 上級',900,380,{size:28,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'plan']:(p)=>{
  const items=['① kQ/r を 積分で 導く','② 点電荷の 電場は 道に よらない','③ 重ね合わせで どんな 静電場でも','④ 導体の 電位'];
  let s=card(200,50,800,420,L('今回の 道筋',600,100,{size:26,color:C.dim}),1);
  items.forEach((t,i)=>{s+=fade(seg(p,.15+i*.15,.3+i*.15),label(t,300,180+i*75,{size:32,color:i===3?C.ink:C.hi,weight:700}));});
  return s;
 },
 // ===== S2 kQ/r を積分で =====
 [K+'grav']:(p)=>{
  let s=card(60,40,520,430,L('万有引力（位置エネルギー・上級）',320,85,{size:24,color:C.dim})
   +label('外向きの 成分',320,125,{size:24,color:C.dim,anchor:'middle'})
   +T(`${cs(FC,'F')}=-\\dfrac{GMm}{s^2}`,320,205,{size:38})
   +T(`${cs(UC,'U(r)')}=-\\int_{\\infty}^{r}${cs(FC,'F')}\\,ds`,320,305,{size:36})
   +T(`${cs(UC,'U')}=-\\dfrac{GMm}{r}`,320,410,{size:42}),1);
  s+=card(620,40,520,430,L('電場（今回）',880,85,{size:24,color:C.dim})+fade(seg(p,.55,.7),label('同じ 手順',880,260,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.45,.55),C.hi);
  return s;
 },
 [K+'setup']:(p)=>{
  let s=card(60,40,520,430,L('万有引力',320,85,{size:24,color:C.dim})
   +label('外向きの 成分',320,125,{size:24,color:C.dim,anchor:'middle'})
   +T(`${cs(FC,'F')}=-\\dfrac{GMm}{s^2}`,320,215,{size:40}),1);
  s+=card(620,40,520,430,L('電場',880,85,{size:24,color:C.dim})
   +label('外向きの 成分',880,125,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),T(`${cs(EC,'E')}=+\\dfrac{kQ}{s^2}`,880,215,{size:40}))
   +fade(seg(p,.55,.7),T(`${V}(\\infty)=0`,880,300,{size:40})+L('（基準の 約束）',880,355,{size:24,color:C.hi})),1,C.hi);
  return s;
 },
 [K+'def']:(p)=>{
  let s=TF(`${V}(r)-${V}(\\infty)=-\\int_{\\infty}^{r}\\dfrac{kQ}{s^2}\\,ds`,600,110,{size:50});
  const y=330;s+=fade(seg(p,.3,.45),arrow(160,y,1040,y,{color:C.dim,w:3,head:14})+charge(160,y,1,16)+dot(400,y,8,C.x)+label('r',400,y+40,{size:28,color:C.x,anchor:'middle',weight:700})
   +label('∞',1060,y+10,{size:32,color:C.dim})+label('s：途中の 距離',700,y+48,{size:24,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),arrow(1000,y-36,430,y-36,{color:C.hi,w:4,head:14})+label('無限遠 → r の 向きに 積分',715,y-56,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'anti']:(p)=>{
  let s=TF(`=-kQ\\int_{\\infty}^{r}s^{-2}\\,ds`,600,110,{size:52});
  s+=fade(seg(p,.1,.25),L('kQ は 定数 → 積分の 外へ',600,210,{size:26,color:C.dim}));
  s+=card(250,260,700,170,L('積分・上級',600,300,{size:22,color:C.dim})+T(`\\int s^{-2}\\,ds=-\\dfrac{1}{s}`,600,375,{size:46}),seg(p,.45,.6));
  return s;
 },
 [K+'eval']:(p)=>{
  const g=seg(p,.35,.5),m=g>.5?`{\\color{${BAD}}{-}}`:'-';
  const e1=`${m}kQ\\Big[${m}\\dfrac{1}{s}\\Big]_{\\infty}^{r}=${m}kQ\\Big(${m}\\dfrac{1}{r}-0\\Big)`;
  let s=TF(e1,600,100,{size:46});
  s+=fade(seg(p,.1,.3),label('無限遠では −1/s → 0',870,200,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(g,label('赤い − と − が 打ち消す',380,200,{size:26,color:BAD,anchor:'middle',weight:700}));
  s+=TF(`${V}(r)=\\dfrac{kQ}{r}`,600,345,{size:66,box:true,frac:true,g:seg(p,.55,.75)});
  return s;
 },
 [K+'sign']:(p)=>{
  const A=axes({x:110,y:430,w:440,h:330,xmin:0,xmax:3.2,ymin:-1.3,ymax:1.3,xticks:[],yticks:[]});
  let s=A.svg+A.plot(r=>1/r,{from:.8,to:3.1,color:VC,w:5})+A.plot(r=>-1/r,{from:.8,to:3.1,color:UC,w:5,p:seg(p,.1,.4)});
  s+=label('r',A.X(3.2)+30,A.Y(0)+8,{size:26,color:C.dim})+label('V ＝ kQ/r（Q＞0）',A.X(1.2),A.Y(1.15),{size:24,color:VC,weight:700})+fade(seg(p,.2,.4),label('U ＝ −GMm/r',A.X(1.4),A.Y(-1.0),{size:24,color:UC,weight:700}));
  s+=card(640,90,520,330,L('負号の 数の 違い',900,140,{size:24,color:C.dim})
   +L('万有引力：力は 中心向き → U ＜ 0',900,215,{size:26,color:UC})
   +fade(seg(p,.45,.6),L('正の Q：電場は 外向き → V ＞ 0',900,290,{size:26,color:VC}))
   +fade(seg(p,.65,.8),L('遠ざかるほど 下がる',900,370,{size:30,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'num']:(p)=>{
  const A=axes({x:110,y:440,w:460,h:330,xmin:0,xmax:3.2,ymin:0,ymax:11,xticks:[1,2,3],yticks:[]});
  let s=A.svg+A.plot(r=>8.99/r,{from:.85,to:3.1,color:VC,w:5});
  s+=label('r [m]',A.X(3.2)+20,A.Y(0)+40,{size:22,color:C.dim})+label('V [V]',A.X(0),A.Y(11)-40,{size:22,color:VC,anchor:'middle'});
  s+=fade(seg(p,.2,.4),dot(A.X(1),A.Y(8.99),8,C.hi)+label('8.99',A.X(1)+14,A.Y(8.99)-8,{size:24,color:C.hi}));
  s+=fade(seg(p,.4,.6),dot(A.X(2),A.Y(4.495),8,C.hi)+label('4.495',A.X(2)+14,A.Y(4.495)-10,{size:24,color:C.hi}));
  s+=card(660,90,480,330,L('Q ＝ 1 nC，kQ ≈ 8.99 V·m',900,140,{size:24,color:C.dim})
   +T(`${V}(1${U('m')})=8.99${U('V')}`,900,220,{size:40})
   +fade(seg(p,.35,.5),T(`${V}(2${U('m')})=4.495${U('V')}`,900,300,{size:40}))
   +fade(seg(p,.65,.8),L('中級で 見た 値',900,375,{size:26,color:C.hi})),seg(p,0,.15));
  return s;
 },
 // ===== S3 点電荷の電場は道によらない =====
 [K+'path']:(p)=>{
  let s=polarBase({});
  s+=draw(pathPts(),seg(p,.15,.6),{color:SC,w:5});
  s+=AB({b:seg(p,.55,.65)});
  s+=card(660,110,500,280,L('曲がった 道',910,170,{size:30,color:SC,weight:700})+T(`\\int_{\\mathrm{A}}^{\\mathrm{B}}${vE}\\cdot ${dr}=\\ ?`,910,270,{size:44}),seg(p,.05,.2));
  return s;
 },
 [K+'split']:(p)=>{
  let s=polarBase({});
  s+=fade(1-seg(p,.4,.6),draw(pathPts(),1,{color:SC,w:5}));
  s+=fade(seg(p,.4,.6),draw(pathPts(),1,{color:SC,w:2,dash:'5 6'}));
  s+=drawStairs(ST,{gi:i=>seg(p,.4+i*.05,.48+i*.05)});
  s+=AB({});
  s+=card(660,90,500,330,L('一歩 d𝐫 を 2つに 分ける',910,140,{size:26,color:SC,weight:700})
   +fade(seg(p,.3,.45),label('半径方向の 部分',760,230,{size:28,color:EC,weight:700}))
   +fade(seg(p,.55,.7),label('円周方向の 部分',760,300,{size:28,color:GREY,weight:700}))
   +fade(seg(p,.55,.7),label('（半径と 直角）',760,345,{size:24,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'perp0']:(p)=>{
  let s=polarBase({});
  s+=drawStairs(ST,{ha:1});
  // show E at one arc step and a right angle
  const q=ST[2];const am=(q[2]+q[3])/2;const [x,y]=P(q[1],am);
  s+=fade(seg(p,.15,.35),arrow(x,y,...P(q[1]+.55,am),{color:EC,w:5,head:14}));
  s+=AB({});
  s+=card(660,110,500,290,L('円周方向の 一歩',910,165,{size:28,color:C.ink,weight:700})
   +fade(seg(p,.3,.45),L('𝐄 は 半径方向だけ → 直角',910,240,{size:26,color:EC}))
   +fade(seg(p,.55,.7),T(`${vE}\\cdot ${dr}=0`,910,320,{size:44})),seg(p,0,.15));
  return s;
 },
 [K+'radial']:(p)=>{
  let s=polarBase({});
  s+=drawStairs(ST,{hr:1});
  s+=AB({});
  s+=card(660,110,500,290,L('半径方向の 一歩：距離が dr 変わる',910,165,{size:24,color:C.ink})
   +fade(seg(p,.3,.5),T(`${vE}\\cdot ${dr}=\\dfrac{kQ}{r^2}\\,dr`,910,270,{size:46})),seg(p,0,.15));
  return s;
 },
 [K+'intg']:(p)=>{
  let s=TF(`\\int_{\\mathrm{A}}^{\\mathrm{B}}${vE}\\cdot ${dr}=\\int_{r_{\\mathrm{A}}}^{r_{\\mathrm{B}}}\\dfrac{kQ}{r^2}\\,dr`,600,120,{size:50});
  s+=TF(`=kQ\\Big(\\dfrac{1}{r_{\\mathrm{A}}}-\\dfrac{1}{r_{\\mathrm{B}}}\\Big)`,600,280,{size:50,g:seg(p,.3,.5)});
  s+=fade(seg(p,.6,.75),L('両端の 距離 だけで 決まる → 道に よらない',600,420,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'detour']:(p)=>{
  let s=polarBase({circles:[1,2,2.5]});
  s+=drawStairs(ST2,{gi:i=>seg(p,.05+i*.06,.12+i*.06)});
    s+=AB({b:1,bpos:[2,110]});
  s+=card(660,110,500,290,L('遠回り：r が 増えて また 減る',910,165,{size:24,color:C.ink})
   +fade(seg(p,.5,.65),L('外向き ＋ と 内向き − が',910,240,{size:28,color:EC}))
   +fade(seg(p,.6,.75),L('打ち消し合う',910,300,{size:32,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'ex12']:(p)=>{
  let s=polarBase({});
  s+=draw(pathPts(),1,{color:SC,w:4,opacity:.8});
  const alt=Array.from({length:41},(_,i)=>{const t=i/40;return P(1+t+.75*Math.sin(Math.PI*t),30+80*t-25*Math.sin(Math.PI*t));});
  s+=fade(seg(p,.1,.3),draw(alt,1,{color:'#ff8fb0',w:4}));
  s+=AB({});
  s+=card(640,70,520,380,L('1 m の 点 → 2 m の 点',900,115,{size:24,color:C.dim})
   +T(`\\int ${vE}\\cdot ${dr}=kQ\\Big(1-\\dfrac12\\Big)=4.495${U('V')}`,900,200,{size:32})
   +fade(seg(p,.45,.6),T(`${V}(1)-${V}(2)=8.99-4.495=4.495`,900,300,{size:32}))
   +fade(seg(p,.65,.8),L('どの 道でも 同じ ✓',900,390,{size:30,color:OK,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'sphere3d']:(p)=>{
  const cx=300,cy=270,R=170;
  let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${VC}" fill-opacity=".08" stroke="${VC}" stroke-width="3"/>`+`<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R*.3}" fill="none" stroke="${VC}" stroke-width="2" stroke-dasharray="6 6" opacity=".7"/>`;
  s+=charge(cx,cy,1,18);
  const px=cx+R*Math.cos(rad(40)),py=cy-R*Math.sin(rad(40));
  s+=arrow(px,py,px+90*Math.cos(rad(40)),py-90*Math.sin(rad(40)),{color:EC,w:5,head:14})+label('𝐄',px+100*Math.cos(rad(40))+6,py-100*Math.sin(rad(40)),{size:28,color:EC,weight:700});
  s+=fade(seg(p,.2,.4),arrow(px,py,px-80*Math.sin(rad(40)),py-80*Math.cos(rad(40)),{color:GREY,w:5,head:14})+arrow(px,py,px+60,py+40,{color:GREY,w:5,head:14}));
  s+=dot(px,py,7,C.ink);
  s+=card(640,110,520,290,L('3次元',900,165,{size:28,color:C.dim})
   +L('球面に 沿う 一歩：𝐄 と 直角 → 0',900,245,{size:26,color:C.ink})
   +fade(seg(p,.5,.65),L('残るのは 半径方向 だけ',900,320,{size:28,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S4 どんな静電場でも =====
 [K+'many']:(p)=>{
  const qs=[[160,180,1],[330,440,-1],[470,150,1]];
  let s=rect(60,60,520,410,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:6});
  qs.forEach(([x,y,q],i)=>{s+=fade(seg(p,.05+i*.1,.15+i*.1),charge(x,y,q,20));});
  s+=fade(seg(p,.4,.6),draw([[120,420],[220,300],[380,250],[520,330]],1,{color:SC,w:4})+dot(120,420,7,C.ink)+label('A',106,428,{size:24,color:C.ink,anchor:'end',weight:700})+dot(520,330,7,C.ink)+label('B',532,336,{size:24,color:C.ink,weight:700}));
  s+=card(640,110,520,280,L('電荷が 何個も',900,170,{size:30,color:C.ink,weight:700})
   +L('止まった 電荷の 電場 ＝ 静電場',900,250,{size:26,color:C.dim}),seg(p,0,.15));
  return s;
 },
 [K+'superpos']:(p)=>{
  const px=280,py=240;
  let s=rect(60,60,520,410,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:6});
  s+=charge(160,180,1,18)+label('1',140,160,{size:22,color:C.dim,anchor:'end'})+charge(330,440,-1,18)+label('2',360,460,{size:22,color:C.dim})+charge(470,150,1,18)+label('3',496,140,{size:22,color:C.dim});
  const e1=[90,46],e2=[10,42],e3=[-38,18];
  const p1=[px+e1[0],py+e1[1]],p2=[p1[0]+e2[0],p1[1]+e2[1]],p3=[p2[0]+e3[0],p2[1]+e3[1]];
  s+=arrow(px,py,p1[0],p1[1],{color:EC,w:4,head:12})+label('𝐄₁',(px+p1[0])/2+12,(py+p1[1])/2-4,{size:22,color:EC});
  s+=fade(seg(p,.1,.25),arrow(p1[0],p1[1],p2[0],p2[1],{color:EC,w:4,head:12})+label('𝐄₂',(p1[0]+p2[0])/2+14,(p1[1]+p2[1])/2,{size:22,color:EC}));
  s+=fade(seg(p,.2,.35),arrow(p2[0],p2[1],p3[0],p3[1],{color:EC,w:4,head:12})+label('𝐄₃',p3[0]-8,p3[1]+26,{size:22,color:EC,anchor:'end'}));
  s+=fade(seg(p,.4,.55),arrow(px,py,p3[0],p3[1],{color:C.hi,w:6,head:16})+label('𝐄',px-14,(py+p3[1])/2+10,{size:28,color:C.hi,weight:700,anchor:'end'}));
  s+=dot(px,py,6,C.ink);
  s+=card(640,110,520,290,L('重ね合わせ（実験に 支えられた 原理）',900,165,{size:24,color:C.dim})
   +T(`${vE}=${cs(EC,'\\mathbf{E}_1')}+${cs(EC,'\\mathbf{E}_2')}+${cs(EC,'\\mathbf{E}_3')}+\\cdots`,900,270,{size:42}),seg(p,0,.15));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=TF(`\\int ${vE}\\cdot ${dr}=\\int ${cs(EC,'\\mathbf{E}_1')}\\cdot ${dr}+\\int ${cs(EC,'\\mathbf{E}_2')}\\cdot ${dr}+\\int ${cs(EC,'\\mathbf{E}_3')}\\cdot ${dr}+\\cdots`,600,170,{size:42});
  s+=fade(seg(p,.4,.6),L('内積も 積分も 和に 分けられる',600,320,{size:30,color:C.ink}));
  return s;
 },
 [K+'each']:(p)=>{
  let s=TF(`\\int ${vE}\\cdot ${dr}=\\int ${cs(EC,'\\mathbf{E}_1')}\\cdot ${dr}+\\int ${cs(EC,'\\mathbf{E}_2')}\\cdot ${dr}+\\int ${cs(EC,'\\mathbf{E}_3')}\\cdot ${dr}+\\cdots`,600,110,{size:42});
  const w=texWidth(`\\int ${vE}\\cdot ${dr}=\\int ${cs(EC,'\\mathbf{E}_1')}\\cdot ${dr}+\\int ${cs(EC,'\\mathbf{E}_2')}\\cdot ${dr}+\\int ${cs(EC,'\\mathbf{E}_3')}\\cdot ${dr}+\\cdots`,42,false),x0=600-w/2;
  [.37,.6,.82].forEach((f,i)=>{s+=fade(seg(p,.05+i*.1,.15+i*.1),label('✓',x0+w*f,190,{size:34,color:OK,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.35,.5),L('各項：道に よらない',600,250,{size:28,color:OK}));
  s+=TF(`\\oint ${vE}\\cdot ${dr}=0`,600,370,{size:58,box:true,g:seg(p,.55,.75)});
  return s;
 },
 [K+'cont']:(p)=>{
  // blob split into small pieces
  let s='';const cx=270,cy=260;
  for(let i=-4;i<=4;i++)for(let j=-3;j<=3;j++){const x=cx+i*36,y=cy+j*36;if(((i*36)**2/170**2+(j*36)**2/120**2)>1)continue;
   s+=fade(seg(p,.05,.3),rect(x-15,y-15,30,30,{fill:POS,fo:.25,stroke:POS,sw:1.5,rx:4})+label('+',x,y+8,{size:22,color:POS,anchor:'middle'}));}
  s+=fade(seg(p,.3,.45),label('小さな 点電荷に 分ける',cx,cy+170,{size:26,color:C.ink,anchor:'middle'}));
  s+=card(640,90,520,330,L('使ったのは 2つだけ',900,140,{size:26,color:C.dim})
   +fade(seg(p,.45,.6),L('クーロンの 法則',900,230,{size:32,color:C.hi,weight:700}))
   +fade(seg(p,.6,.75),L('重ね合わせ',900,310,{size:32,color:C.hi,weight:700}))
   +fade(seg(p,.7,.85),L('（どちらも 実験に 支えられた 原理）',900,370,{size:22,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'induct']:(p)=>{
  let s=card(200,80,800,340,L('使えない とき',600,130,{size:26,color:C.dim}),1,BAD);
  s+=L('磁場が 時間とともに 変わる',600,210,{size:32,color:C.E,weight:700});
  s+=fade(seg(p,.3,.5),T(`\\oint ${vE}\\cdot ${dr}\\neq 0`,600,295,{size:48}));
  s+=fade(seg(p,.6,.75),L('→ 電磁誘導の 回',600,385,{size:28,color:C.ink}));
  return s;
 },
 // ===== S5 導体の電位 =====
 ...conductorDiagrams(),
 // ===== S6 導線と抵抗・まとめ =====
 [K+'wire']:(p)=>circuitFig(p,{res:0}),
 [K+'resistor']:(p)=>circuitFig(p,{res:1}),
 [K+'sum1']:(p)=>{
  let s=card(100,50,1000,420,'',1);
  s+=T(`${V}=\\dfrac{kQ}{r}`,300,160,{size:46})+label('積分で 導いた',470,170,{size:28,color:C.ink});
  s+=fade(seg(p,.4,.6),T(`${vE}\\cdot ${dr}=\\dfrac{kQ}{r^2}\\,dr`,300,320,{size:40})+label('半径方向の 一歩だけ → 道に よらない',530,330,{size:28,color:C.ink}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(100,50,1000,420,'',1);
  s+=T(`\\oint ${vE}\\cdot ${dr}=0`,300,160,{size:44})+label('重ね合わせで どんな 静電場でも',500,170,{size:28,color:C.ink});
  s+=fade(seg(p,.45,.65),label('導体：等電位（0 とは 限らない）',600,330,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s='';const lx=260,rx=420,pt=110,pb=410;
  s+=rect(lx-20,pt,20,pb-pt,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3})+rect(rx,pt,20,pb-pt,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3});
  for(let i=0;i<7;i++){const y=pt+(pb-pt)*(i+.5)/7;s+=label('＋',lx-10,y+8,{size:22,color:POS,anchor:'middle',weight:700})+label('−',rx+10,y+9,{size:24,color:NEG,anchor:'middle',weight:700});}
  [170,260,350].forEach(y=>{s+=arrow(lx+15,y,rx-15,y,{color:EC,w:4,head:12});});
  s+=card(600,90,560,330,L('次の 問い',880,140,{size:24,color:C.dim})
   +L('ためるのに 使った 仕事は',880,220,{size:30,color:C.ink})
   +L('どこに、どれだけ 蓄えられる？',880,290,{size:32,color:C.hi,weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
};

// ---- conductor figures ------------------------------------------------------------------------
function blob(cx,cy,{rx=170,ry=125,fill='#8795ad',fo=.25,stroke=C.dim}={}){
 const pts=Array.from({length:90},(_,i)=>{const t=2*Math.PI*i/90;const r=1+.08*Math.sin(2*t+.5)+.05*Math.cos(3*t);return [cx+rx*r*Math.cos(t),cy-ry*r*Math.sin(t)];});
 return poly(pts,{fill,fo,stroke,sw:3})+'';
}
function blobPt(cx,cy,t,{rx=170,ry=125}={}){const r=1+.08*Math.sin(2*t+.5)+.05*Math.cos(3*t);return [cx+rx*r*Math.cos(t),cy-ry*r*Math.sin(t)];}
function conductorDiagrams(){
 const cx=300,cy=265;
 const surfCharges=(g=1)=>{let s='';for(let i=0;i<14;i++){const t=2*Math.PI*i/14;const [x,y]=blobPt(cx,cy,t,{rx:158,ry:115});s+=label('+',x,y+8,{size:24,color:POS,anchor:'middle',weight:700});}return fade(g,s);};
 const outE=(g=1)=>{let s='';for(let i=0;i<10;i++){const t=2*Math.PI*i/10+.2;const [x,y]=blobPt(cx,cy,t);const [x2,y2]=blobPt(cx,cy,t+.01);const tx=x2-x,ty=y2-y,n=Math.hypot(tx,ty),nx=-ty/n,ny=tx/n;s+=arrow(x+nx*6,y+ny*6,x+nx*60,y+ny*60,{color:EC,w:4,head:12});}return fade(g,s);};
 return {
  [K+'equil']:(p)=>{
   let s=blob(cx,cy)+surfCharges(seg(p,.1,.3));
   s+=card(640,110,520,280,L('静電平衡の 導体',900,170,{size:30,color:C.ink,weight:700})+L('中の 電荷が もう 動かない 状態',900,250,{size:26,color:C.dim}),seg(p,0,.15));
   return s;
  },
  [K+'inside0']:(p)=>{
   let s=blob(cx,cy)+surfCharges();
   s+=fade(1-seg(p,.4,.6),arrow(cx-60,cy,cx+60,cy,{color:EC,w:5,head:14})+dot(cx+20,cy+40,9,NEG)+arrow(cx+20,cy+40,cx-30,cy+40,{color:NEG,w:3,head:10}));
   s+=fade(seg(p,.5,.7),label('𝐄 ＝ 0',cx,cy+12,{size:40,color:EC,anchor:'middle',weight:700}));
   s+=card(640,90,520,330,L('ガウスの法則・上級 6/6',900,140,{size:22,color:C.dim})
    +L('電場が 残れば → 自由電子が 動き続ける',900,215,{size:24,color:C.ink})
    +fade(seg(p,.5,.65),L('静電平衡では 内部の 𝐄 ＝ 0',900,300,{size:28,color:EC,weight:700})),seg(p,0,.15));
   return s;
  },
  [K+'flat']:(p)=>{
   let s=blob(cx,cy)+surfCharges()+label('𝐄 ＝ 0',cx,cy-60,{size:30,color:EC,anchor:'middle',weight:700});
   const A=[cx-90,cy+30],B=[cx+80,cy-10];
   s+=draw([A,[cx-20,cy+70],[cx+40,cy+40],B],seg(p,.05,.3),{color:SC,w:4})+dot(A[0],A[1],7,C.ink)+dot(B[0],B[1],7,C.ink);
   s+=card(640,90,520,330,L('内部の 2点',900,140,{size:26,color:C.dim})
    +T(`\\Delta ${V}=-\\int ${vE}\\cdot ${dr}=0`,900,220,{size:40})
    +fade(seg(p,.5,.65),L('どこも 同じ 電位（等電位）',900,320,{size:28,color:VC,weight:700})),seg(p,0,.15));
   return s;
  },
  [K+'surface']:(p)=>{
   let s=blob(cx,cy)+surfCharges()+outE(seg(p,.45,.65));
   const t=.9,[x,y]=blobPt(cx,cy,t),[x2,y2]=blobPt(cx,cy,t+.01),tx=(x2-x),ty=(y2-y),n=Math.hypot(tx,ty);
   s+=fade(1-seg(p,.3,.45),arrow(x,y,x+70*tx/n,y+70*ty/n,{color:EC,w:5,head:14}))+fade(seg(p,.25,.4)*(1-seg(p,.45,.6)),label('✗',x+40*tx/n,y+40*ty/n-16,{size:34,color:BAD,anchor:'middle',weight:700}));
   s+=card(640,90,520,330,L('表面に 沿う 電場も 0',900,140,{size:26,color:C.ink})
    +fade(seg(p,.35,.5),L('表面 ＝ 等電位面',900,225,{size:30,color:VC,weight:700}))
    +fade(seg(p,.6,.75),L('外の 電場は 表面と 直角',900,305,{size:30,color:EC,weight:700})),seg(p,0,.15));
   return s;
  },
  [K+'notzero']:(p)=>{
   let s=card(200,110,800,300,'',1);
   s+=L('電位が 一定',420,230,{size:36,color:VC,weight:700})+L('≠',600,232,{size:44,color:BAD,weight:700})+L('電位が 0',780,230,{size:36,color:VC,weight:700});
   s+=fade(seg(p,.4,.6),L('別の こと',600,330,{size:30,color:C.hi,weight:700}));
   return s;
  },
  [K+'sphere100']:(p)=>{
   // V(r) for a charged conducting sphere, R = 0.09 m
   const A=axes({x:100,y:440,w:470,h:330,xmin:0,xmax:0.36,ymin:0,ymax:120,xticks:[],yticks:[]});
   const Vr=r=>r<0.09?99.9:8.99/r;
   let s=A.svg+A.plot(Vr,{from:0,to:0.35,color:VC,w:5,steps:300});
   s+=rect(A.X(0),A.Y(120),A.X(0.09)-A.X(0),A.Y(0)-A.Y(120),{fill:'#8795ad',fo:.12,stroke:'none',rx:0});
   s+=label('導体の 中',A.X(.045)+4,A.Y(40),{size:22,color:C.dim,anchor:'middle'});
   s+=line(A.X(0)-6,A.Y(99.9),A.X(0)+6,A.Y(99.9),{color:C.dim})+label('99.9',A.X(0)-10,A.Y(99.9)+8,{size:21,color:VC,anchor:'end'});
   s+=line(A.X(.09),A.Y(0)-6,A.X(.09),A.Y(0)+6,{color:C.dim})+label('0.09',A.X(.09),A.Y(0)+30,{size:21,color:C.dim,anchor:'middle'});
   s+=label('r [m]',A.X(.36)+30,A.Y(0)+40,{size:22,color:C.dim})+label('V [V]',A.X(0),A.Y(120)-40,{size:22,color:VC,anchor:'middle'});
   s+=fade(seg(p,.55,.7),label('𝐄 ＝ 0',A.X(.045)+4,A.Y(80),{size:24,color:EC,anchor:'middle',weight:700}));
   s+=card(640,90,520,330,L('半径 9 cm，Q ＝ 1 nC',900,140,{size:26,color:C.dim})
    +T(`${V}=\\dfrac{8.99}{0.09}\\approx 99.9${U('V')}`,900,230,{size:42})
    +L('約 100 V',900,310,{size:28,color:VC,weight:700})
    +fade(seg(p,.55,.7),L('それでも 中の 𝐄 ＝ 0',900,375,{size:28,color:EC,weight:700})),seg(p,0,.15));
   return s;
  },
  [K+'grounded']:(p)=>{
   const py=400;let s=rect(70,py,500,26,{fill:'#8795ad',fo:.35,stroke:C.dim,sw:2,rx:3});
   // ground symbol
   s+=line(320,py+26,320,py+50,{color:C.dim,w:3})+line(295,py+50,345,py+50,{color:C.dim,w:3})+line(305,py+58,335,py+58,{color:C.dim,w:3})+line(314,py+66,326,py+66,{color:C.dim,w:3});
   s+=label('0 V',90,py-12,{size:24,color:VC,weight:700});
   const qx=320,qy=200;s+=charge(qx,qy,1,20);
   // field lines from charge ending perpendicular on plate
   [-150,-80,-30,30,80,150].forEach((dx,i)=>{const pts=[];for(let k=0;k<=20;k++){const t=k/20;const x=qx+dx*Math.sin(Math.PI/2*t)*1.1,y=mix(qy+22,py,t);pts.push([x,y]);}
    s+=fade(seg(p,.15+i*.04,.3+i*.04),draw(pts,1,{color:EC,w:3}))+fade(seg(p,.3,.45),arrow(pts[18][0],pts[18][1],pts[20][0],pts[20][1]-2,{color:EC,w:3,head:10}));});
   s+=card(640,110,520,290,L('接地した 板（0 V）',900,165,{size:28,color:C.ink})
    +fade(seg(p,.45,.6),L('表面は 0 V でも',900,240,{size:28,color:VC}))
    +fade(seg(p,.6,.75),L('𝐄 ≠ 0（表面と 直角）',900,310,{size:30,color:EC,weight:700})),seg(p,0,.15));
   return s;
  },
  [K+'v0e0']:(p)=>{
   let s=card(80,90,500,330,L('V ＝ 0',330,160,{size:40,color:VC,weight:700})+L('基準の 選び方で 作れる',330,250,{size:26,color:C.ink})+L('（約束）',330,300,{size:24,color:C.dim}),1);
   s+=card(620,90,500,330,L('𝐄 ＝ 0',870,160,{size:40,color:EC,weight:700})+L('電位が 場所で 変わらない',870,250,{size:26,color:C.ink})+L('（物理的な 条件）',870,300,{size:24,color:C.dim}),seg(p,.35,.5));
   return s;
  },
 };
}
// ---- circuit with ideal wires and a resistor; potential profile ---------------------------------------
function circuitFig(p,{res=0}={}){
 // loop: battery on the left, resistor on the right
 const L0=80,R0=520,T0=110,B0=420;
 let s='';
 s+=draw([[L0,240],[L0,T0],[R0,T0],[R0,200]],1,{color:C.dim,w:4})+draw([[R0,330],[R0,B0],[L0,B0],[L0,290]],1,{color:C.dim,w:4});
 // battery (long = +, top)
 s+=line(L0-30,240,L0+30,240,{color:C.ink,w:5})+line(L0-16,290,L0+16,290,{color:C.ink,w:9})+label('＋',L0+44,248,{size:22,color:POS,weight:700})+label('3 V',L0+44,290,{size:22,color:VC,weight:700});
 // resistor zigzag
 const zz=[[R0,200]];for(let i=1;i<=8;i++)zz.push([R0+(i%2?16:-16),200+i*16]);zz.push([R0,330]);s+=draw(zz,1,{color:C.E,w:4});
 s+=label('抵抗',R0+30,270,{size:24,color:C.E});
 // potential labels on wires
 s+=fade(1-res*.5,label('3 V（どこも 同じ）',300,T0-14,{size:24,color:VC,anchor:'middle',weight:700})+label('0 V（どこも 同じ）',300,B0+34,{size:24,color:VC,anchor:'middle',weight:700}));
 // current direction arrow on top wire
 s+=arrow(250,T0,330,T0,{color:C.F,w:4,head:12})+label('電流',290,T0+30,{size:22,color:C.F,anchor:'middle'});
 if(res){
  // zoom of resistor: E inside downward (current from top to bottom), potential drop
  s+=card(620,60,540,400,'',1);
  s+=rect(700,100,120,320,{fill:C.E,fo:.12,stroke:C.E,sw:2,rx:8});
  [150,230,310].forEach(y=>{s+=fade(seg(p,.1,.3),arrow(760,y,760,y+50,{color:EC,w:5,head:14}));});
  s+=fade(seg(p,.2,.35),label('𝐄',735,180,{size:28,color:EC,weight:700,anchor:'end'}));
  s+=fade(seg(p,.3,.45),dot(790,300,8,NEG)+arrow(790,300,790,260,{color:NEG,w:3,head:10})+label('電子',800,250,{size:22,color:NEG}));
  // potential along the resistor: vertical = position (top→bottom), horizontal = V
  s+=line(900,100,900,430,{color:C.dim,w:2})+arrow(900,430,1130,430,{color:C.dim,w:2,head:10})+label('V',1140,438,{size:24,color:VC});
  s+=fade(seg(p,.4,.6),draw([[1090,110],[900,410]],1,{color:VC,w:4})+label('3 V',1090,100,{size:22,color:VC,anchor:'middle'})+label('0 V',920,410,{size:22,color:VC}));
  s+=fade(seg(p,.7,.85),label('静電平衡ではない',890,488,{size:26,color:C.hi,anchor:'middle',weight:700}));
 }else{
  s+=card(620,110,540,290,L('理想導線（抵抗 0 の 近似）',890,170,{size:28,color:C.ink,weight:700})
   +fade(seg(p,.3,.5),L('電位が 変わらない 線',890,250,{size:30,color:VC,weight:700})),seg(p,0,.15));
 }
 return s;
}
