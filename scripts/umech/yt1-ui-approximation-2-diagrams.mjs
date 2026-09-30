// YouTube シリーズ「近似・初級 2/2」(ys-ui-approximation-2) — 図。Stage 1200×515.
// 色：弧 θ 水色(C.x)、高さ sinθ 赤(C.a)、半径 橙(C.E)、差・強調 黄(C.hi)、正しい 緑、誤り 赤。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';

const K='ui-approximation-2:';
const TH=C.x,SN=C.a,R_=C.E,DF=C.hi;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const P=(cx,cy,R,a)=>[cx+R*Math.cos(a),cy-R*Math.sin(a)];
const arcPts=(cx,cy,R,a0,a1,n=90)=>Array.from({length:n+1},(_,i)=>P(cx,cy,R,a0+(a1-a0)*i/n));
const arc=(cx,cy,R,a0,a1,{p=1,color=TH,w=7}={})=>draw(arcPts(cx,cy,R,a0,a1),p,{color,w});
const cross=(x,y,sz=16,color=C.a)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});

// unit circle: radius 1 (fixed), arc θ (cyan), height sinθ (red)
function uc(cx,cy,R,th,{ga=1,gh=1,labels=true,full=true}={}){
 const [px,py]=P(cx,cy,R,th);
 let s=(full?ring(cx,cy,R,{color:C.faint,w:2}):arc(cx,cy,R,-.05,Math.min(Math.PI,th+.4),{color:C.faint,w:2}));
 s+=line(cx-(full?R+20:0),cy,cx+R+20,cy,{color:C.dim,w:2})+line(cx,cy,cx+R,cy,{color:R_,w:4})+line(cx,cy,px,py,{color:R_,w:4})+dot(cx,cy,6,C.dim);
 s+=label('1',cx+R/2,cy+32,{size:24,color:R_,anchor:'middle'});
 s+=fade(ga,arc(cx,cy,R,0,th)+(labels?(()=>{const [lx,ly]=P(cx,cy,R+36,th/2);return label('θ',lx+6,ly+10,{size:28,color:TH,weight:700});})():''));
 s+=fade(gh,line(px,py,px,cy,{color:SN,w:7})+(labels?label('sinθ',px-12,cy-14,{size:24,color:SN,anchor:'end',weight:700}):''));
 s+=dot(px,py,8,C.ink);
 return s;
}
// table of θ, sinθ, difference, relative error
const ROWS=[['0.1','0.09983','0.000167','0.167%'],['0.5','0.4794','0.0206','約 4.1%'],['1','0.8415','0.159','約 16%']];
function table(show,{x=90,y=90,w=1020,hl=-1,cols=4}={}){
 const cx=[x+120,x+350,x+620,x+880];
 let s=rect(x,y,w,90+show.length*0,{fill:'none',fo:0,stroke:'none'});
 s+=rect(x,y,w,300,{fill:'#131f38',fo:.96,stroke:C.faint,rx:14});
 const heads=[['θ [rad]',TH],['sinθ',SN],['差 θ − sinθ',DF],['相対誤差',C.ink]];
 heads.slice(0,cols).forEach(([t,c],i)=>{s+=label(t,cx[i],y+50,{size:26,color:c,anchor:'middle',weight:700});});
 s+=line(x+20,y+72,x+w-20,y+72,{color:C.faint,w:2});
 ROWS.forEach((r,j)=>{const yy=y+128+j*62;
  if(j===hl)s+=rect(x+14,yy-40,w-28,56,{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:10});
  s+=fade(show[j]??0,r.slice(0,cols).map((t,i)=>label(t,cx[i],yy,{size:30,color:[TH,SN,DF,C.ink][i],anchor:'middle',weight:i===2?700:400})).join(''));});
 return s;
}
function graphAxes(xmax,{g=1,x=110,y=450,w=560,h=360,ticks}={}){
 return axes({x,y,w,h,xmax,ymax:xmax,xticks:ticks,yticks:ticks,grid:true,g,xlabel:'θ',ylabel:'長さ',xcolor:TH,ycolor:C.dim});
}
function twoCurves(A,xmax,{p=1}={}){
 return A.plot(u=>Math.sin(u),{from:0,to:xmax,p,color:SN,w:7})+A.plot(u=>u,{from:0,to:xmax,p,color:TH,w:3});
}
function zoomGraph(xmax,ticks,p,title){
 const A=graphAxes(xmax,{ticks});
 let s=A.svg+twoCurves(A,xmax,{p:seg(p,0,.3)});
 s+=label(title,390,70,{size:26,color:C.hi,anchor:'middle',weight:700});
 return s;
}
function relCurve(p,{mark=0}={}){
 // relative error (θ − sinθ)/θ in %, θ from 0 to 0.4
 const A=axes({x:110,y:450,w:560,h:340,xmax:.4,ymax:3,xticks:[.1,.2,.3,.4],yticks:[1,2,3],grid:true,xlabel:'θ [rad]',ylabel:'相対誤差 [%]',xcolor:TH,ycolor:C.ink});
 let s=A.svg+A.plot(u=>u<1e-6?0:100*(u-Math.sin(u))/u,{from:0,to:.4,p:seg(p,0,.3),color:DF,w:4});
 s+=line(A.X(0),A.Y(1),A.X(.4),A.Y(1),{color:C.a,w:2,dash:'8 6'})+label('1%',A.X(.4)+10,A.Y(1)+8,{size:22,color:C.a});
 if(mark){const X=A.X(.245),Y=A.Y(.997);s+=fade(mark,line(X,Y,X,A.Y(0),{color:C.hi,w:2,dash:'6 5'})+dot(X,Y,9,C.hi)+label('0.245',X,A.Y(0)+62,{size:22,color:C.hi,anchor:'middle'}));}
 return s;
}

export const ytUiApprox2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=label('前回',70,70,{size:24,color:C.dim});
  s+=uc(320,290,190,.9,{gh:0,ga:seg(p,.3,.5)});
  s+=card(640,110,520,280,label('半径 1 の円',900,170,{size:30,color:R_,anchor:'middle'})
   +tex('\\theta=\\dfrac{s}{r}=\\dfrac{s}{1}=s',900,265,{size:46,auto:false})
   +fade(seg(p,.55,.7),label('角度 θ ＝ 弧の長さ',900,350,{size:30,color:TH,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'colors']:(p)=>{
  let s=uc(320,290,190,.9,{gh:seg(p,.05,.25)});
  s+=card(640,110,520,280,label('弧 θ ：青',900,195,{size:34,color:TH,anchor:'middle',weight:700})+label('高さ sinθ ：赤',900,285,{size:34,color:SN,anchor:'middle',weight:700}),seg(p,.4,.55));
  return s;
 },
 [K+'question']:(p)=>{
  let s=label('今回の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(170,100,860,170,label('小さな角で',600,160,{size:34,color:C.ink,anchor:'middle'})
   +label('弧 θ と 高さ sinθ は どれくらい 近い？',600,225,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  s+=fade(seg(p,.4,.6),uc(600,470,130,.35,{labels:false,full:false}));
  return s;
 },
 [K+'pendulum']:(p)=>{
  // pendulum at angle θ from the vertical
  const ox=260,oy=90,L=300,th=.35,bx=ox+L*Math.sin(th),by=oy+L*Math.cos(th);
  let s=line(ox-80,oy,ox+80,oy,{color:C.dim,w:4})+line(ox,oy,ox,oy+L+20,{color:C.faint,w:2,dash:'6 6'})+line(ox,oy,bx,by,{color:C.dim,w:3})+ring(bx,by,22,{color:C.ink,w:3,fill:'#1d2a48'});
  s+=draw(Array.from({length:30},(_,i)=>{const a=th*i/29;return [ox+70*Math.sin(a),oy+70*Math.cos(a)];}),1,{color:C.hi,w:3})+label('θ',ox+34,oy+110,{size:26,color:C.hi,weight:700});
  s+=card(560,90,600,150,label('角度が 小さいので',860,140,{size:28,color:C.dim,anchor:'middle'})+tex(`${cs(SN,'\\sin\\theta')}\\approx${cs(TH,'\\theta')}`,860,205,{size:52,auto:false}),seg(p,.05,.2));
  s+=card(560,270,600,190,fade(seg(p,.55,.7),label('≈ ：ほぼ 等しい',860,330,{size:32,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('＝（等号）とは 違う',860,400,{size:30,color:C.ink,anchor:'middle'})),seg(p,.5,.62));
  return s;
 },
 [K+'shorter']:(p)=>{
  const cx=260,cy=330,R=220,th=.9,[px,py]=P(cx,cy,R,th);
  let s=uc(cx,cy,R,th,{labels:false,full:false});
  // vertical difference between the two ends of the arc
  s+=fade(seg(p,.05,.25),line(cx+R,cy,cx+R+50,cy,{color:C.dim,w:2,dash:'5 5'})+line(px,py,cx+R+50,py,{color:C.dim,w:2,dash:'5 5'})+arrow(cx+R+40,cy,cx+R+40,py,{color:SN,w:3,head:12})+arrow(cx+R+40,py,cx+R+40,cy,{color:SN,w:3,head:12})
   +label('縦の差 ＝ sinθ',cx+R+56,(cy+py)/2+8,{size:24,color:SN}));
  const u=seg(p,.45,.7),bx=820,base=450,k=R;
  s+=fade(u,line(bx,base,bx,base-k*th,{color:TH,w:14})+line(bx+110,base,bx+110,base-k*Math.sin(th),{color:SN,w:14})
   +label('弧 θ',bx,base+36,{size:26,color:TH,anchor:'middle',weight:700})+label('sinθ',bx+110,base+36,{size:26,color:SN,anchor:'middle',weight:700})+line(bx-50,base,bx+160,base,{color:C.dim,w:2}));
  s+=fade(seg(p,.75,.9),label('sinθ ＜ θ',1000,200,{size:34,color:C.hi,weight:700})+label('（θ ＞ 0）',1000,245,{size:24,color:C.dim}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=card(200,110,800,260,label('θ ＝ 0.1 rad（約 5.7°）',600,180,{size:34,color:TH,anchor:'middle',weight:700})
   +label('sinθ は いくつ くらい？',600,250,{size:36,color:SN,anchor:'middle',weight:700})
   +label('予想してみよう',600,320,{size:26,color:C.hi,anchor:'middle'}),seg(p,0,.2),C.hi);
  return s;
 },
 // ===== S2 数で比べる =====
 [K+'t01']:(p)=>{
  let s=tex(`${cs(SN,'\\sin 0.1')}=${cs(SN,'0.09983')}`,600,130,{size:54,auto:false});
  s+=fade(seg(p,.45,.6),tex(`${cs(TH,'0.1')}-${cs(SN,'0.09983')}=${cs(DF,'0.000167')}`,600,270,{size:54,auto:false}));
  s+=fade(seg(p,.6,.75),label('差：わずか',600,380,{size:30,color:DF,anchor:'middle'}));
  s+=fade(seg(p,.02,.15),label('電卓で',160,130,{size:24,color:C.dim}));
  return s;
 },
 [K+'rel']:(p)=>{
  let s=tex(`\\dfrac{${cs(DF,'0.000167')}}{${cs(TH,'0.1')}}=0.00167=0.167\\,\\%`,600,160,{size:54,auto:false});
  s+=fade(seg(p,.5,.65),card(260,280,680,150,label('相対誤差',600,335,{size:34,color:C.ink,anchor:'middle',weight:700})+label('差 が θ の どれくらいの 割合か',600,390,{size:28,color:C.dim,anchor:'middle'})));
  return s;
 },
 [K+'abs']:(p)=>{
  let s='';
  s+=card(60,110,520,280,label('絶対誤差',320,170,{size:32,color:DF,anchor:'middle',weight:700})+label('差 そのもの',320,220,{size:26,color:C.dim,anchor:'middle'})+tex(cs(DF,'0.000167'),320,300,{size:50,auto:false}),seg(p,0,.2),DF);
  s+=card(620,110,520,280,label('相対誤差',880,170,{size:32,color:C.ink,anchor:'middle',weight:700})+label('差 ÷ θ（%）',880,220,{size:26,color:C.dim,anchor:'middle'})+tex('0.167\\,\\%',880,300,{size:50,auto:false}),seg(p,.4,.55));
  s+=fade(seg(p,.7,.85),label('混ぜずに 書き分ける',600,460,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'t05']:(p)=>{
  let s=uc(250,330,200,.5,{labels:false,full:false});
  s+=label('θ ＝ 0.5 rad（約 29°）',640,110,{size:30,color:TH});
  s+=fade(seg(p,.25,.4),tex(`${cs(SN,'\\sin 0.5')}=${cs(SN,'0.4794')}`,640,195,{size:46,auto:false,anchor:'start'}));
  s+=fade(seg(p,.5,.65),tex(`${cs(TH,'0.5')}-${cs(SN,'0.4794')}=${cs(DF,'0.0206')}`,640,285,{size:46,auto:false,anchor:'start'}));
  s+=fade(seg(p,.72,.87),label('相対誤差 約 4.1%',640,390,{size:32,color:C.ink,weight:700}));
  return s;
 },
 [K+'t1']:(p)=>{
  let s=uc(250,360,200,1,{labels:false,full:false});
  s+=label('θ ＝ 1 rad（約 57°）',640,110,{size:30,color:TH});
  s+=fade(seg(p,.25,.4),tex(`${cs(SN,'\\sin 1')}=${cs(SN,'0.8415')}`,640,195,{size:46,auto:false,anchor:'start'}));
  s+=fade(seg(p,.5,.65),tex(`${cs(TH,'1')}-${cs(SN,'0.8415')}=${cs(DF,'0.159')}`,640,285,{size:46,auto:false,anchor:'start'}));
  s+=fade(seg(p,.72,.87),label('相対誤差 約 16%',640,390,{size:32,color:C.a,weight:700}));
  return s;
 },
 [K+'table']:(p)=>table([seg(p,0,.15),seg(p,.15,.3),seg(p,.3,.45)])+fade(seg(p,.6,.75),label('角度が 大きいほど 差は 急に 大きくなる',600,460,{size:30,color:C.hi,anchor:'middle',weight:700})),
 [K+'ratio']:(p)=>{
  let s=table([1,1,1]);
  s+=fade(seg(p,.05,.2),label('θ：5倍',230,460,{size:30,color:TH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),label('差：約 120倍',710,460,{size:32,color:DF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),rect(160,180,120,120,{fill:'none',fo:0,stroke:TH,sw:2,rx:10}))+fade(seg(p,.4,.6),rect(620,180,180,120,{fill:'none',fo:0,stroke:DF,sw:2,rx:10}));
  return s;
 },
 // ===== S3 拡大して見る =====
 [K+'graph']:(p)=>{
  const A=graphAxes(1.2,{ticks:[.5,1],g:seg(p,0,.15)});
  let s=A.svg+A.plot(u=>u,{from:0,to:1.2,p:seg(p,.1,.35),color:TH,w:4})+A.plot(u=>Math.sin(u),{from:0,to:1.2,p:seg(p,.3,.55),color:SN,w:4});
  s+=fade(seg(p,.2,.35),label('y ＝ θ',A.X(1.05),A.Y(1.12)-10,{size:26,color:TH,anchor:'end',weight:700}));
  s+=fade(seg(p,.45,.6),label('y ＝ sinθ',A.X(1.1),A.Y(Math.sin(1.1))+44,{size:26,color:SN,anchor:'middle',weight:700}));
  s+=card(820,130,340,200,label('固定：半径 1',990,200,{size:28,color:R_,anchor:'middle'})+label('変える：θ だけ',990,260,{size:28,color:TH,anchor:'middle'}),seg(p,.65,.8));
  return s;
 },
 [K+'far']:(p)=>{
  const A=graphAxes(1.2,{ticks:[.5,1]});
  let s=A.svg+twoCurves(A,1.2);
  const X=A.X(1),Y1=A.Y(1),Y2=A.Y(Math.sin(1));
  s+=fade(seg(p,.1,.3),line(X,Y1,X,Y2,{color:DF,w:5})+label('差 0.159',X+10,Y2+40,{size:26,color:DF,weight:700}));
  s+=fade(seg(p,.4,.6),label('θ ＝ 1 の近くでは',975,200,{size:28,color:C.ink,anchor:'middle'})+label('はっきり 離れる',975,250,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),ring(A.X(0.06),A.Y(0.06),30,{color:C.hi,w:3})+label('0 の近くは？',A.X(.22),A.Y(0)-14,{size:24,color:C.hi}));
  return s;
 },
 [K+'zoom10']:(p)=>{
  let s=zoomGraph(.12,[.05,.1],p,'10倍に 拡大');
  s+=fade(seg(p,.5,.65),label('ほとんど 重なる',975,220,{size:32,color:C.hi,anchor:'middle',weight:700})+label('θ ＝ 0.1 での差 0.000167',975,280,{size:24,color:DF,anchor:'middle'}));
  return s;
 },
 [K+'zoom100']:(p)=>{
  let s=zoomGraph(.012,[.005,.01],p,'さらに 10倍（100倍）');
  s+=fade(seg(p,.45,.6),label('まっすぐに 見える',975,200,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('傾き ＝ 1',975,270,{size:34,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'slope1']:(p)=>{
  const A=graphAxes(1.2,{ticks:[.5,1]});
  let s=A.svg+twoCurves(A,1.2);
  s+=card(720,90,440,170,label('前回',760,130,{size:22,color:C.dim})+tex(`\\dfrac{d}{d\\theta}${cs(SN,'\\sin\\theta')}=\\cos\\theta`,940,200,{size:42,auto:false}),seg(p,0,.15));
  s+=card(720,280,440,110,tex('\\cos 0=1',940,340,{size:44,auto:false,color:C.hi}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.55,.7),ring(A.X(0),A.Y(0),22,{color:C.hi,w:3})+label('出発点で ぴったり 沿う',A.X(.3),A.Y(0)-20,{size:24,color:C.hi}));
  return s;
 },
 // ===== S4 差の目安 =====
 [K+'rule']:(p)=>{
  let s=label('差の 目安',600,90,{size:30,color:C.dim,anchor:'middle'});
  s+=card(300,120,600,220,tex(`${cs(TH,'\\theta')}-${cs(SN,'\\sin\\theta')}\\approx\\dfrac{${cs(TH,'\\theta')}^3}{6}`,600,240,{size:60,auto:false}),seg(p,0,.2),DF);
  s+=fade(seg(p,.5,.65),label('θ の 3乗 ÷ 6',600,420,{size:32,color:DF,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check01']:(p)=>{
  let s=label('θ ＝ 0.1',140,110,{size:32,color:TH,weight:700});
  s+=fade(seg(p,.1,.3),tex('0.1^3=0.001',560,120,{size:48,auto:false}));
  s+=fade(seg(p,.4,.6),tex(`\\dfrac{0.001}{6}\\approx${cs(DF,'0.000167')}`,560,260,{size:48,auto:false}));
  s+=card(250,340,700,110,label('表の差 0.000167',600,405,{size:30,color:DF,anchor:'middle'})+label('一致 ✓',880,405,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.7,.85));
  return s;
 },
 [K+'check05']:(p)=>{
  let s=label('θ ＝ 0.5',140,110,{size:32,color:TH,weight:700});
  s+=fade(seg(p,.1,.3),tex(`0.5^3=0.125,\\quad \\dfrac{0.125}{6}\\approx${cs(DF,'0.0208')}`,600,190,{size:48,auto:false}));
  s+=card(250,300,700,130,label('実際の差 0.0206',600,375,{size:30,color:DF,anchor:'middle'})+label('ほぼ同じ',880,375,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(200,80,800,120,label('理解の確認',600,120,{size:24,color:C.dim,anchor:'middle'})+label('θ ＝ 0.2 の 差は？',600,175,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.12),C.hi);
  s+=fade(seg(p,.4,.55),tex(`\\dfrac{0.2^3}{6}=\\dfrac{0.008}{6}\\approx${cs(DF,'0.00133')}`,600,300,{size:48,auto:false}));
  s+=fade(seg(p,.7,.82),tex(`${cs(TH,'0.2')}-${cs(SN,'\\sin 0.2')}=${cs(DF,'0.00133')}`,600,420,{size:44,auto:false})+label('電卓',180,425,{size:24,color:C.dim}));
  return s;
 },
 [K+'cube']:(p)=>{
  let s='';
  s+=card(60,90,520,330,label('差（絶対誤差）',320,140,{size:28,color:DF,anchor:'middle',weight:700})+tex(`\\dfrac{${cs(TH,'\\theta')}^3}{6}`,320,235,{size:46,auto:false})
   +label('θ：0.1 → 0.000167',320,305,{size:24,color:C.ink,anchor:'middle'})+label('θ：0.01 → 0.000000167',320,345,{size:24,color:C.ink,anchor:'middle'})
   +label('θ を 1/10 → 差は 1/1000',320,395,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15));
  s+=card(620,90,520,330,label('相対誤差',880,140,{size:28,color:C.ink,anchor:'middle',weight:700})+tex(`\\dfrac{${cs(TH,'\\theta')}^3/6}{${cs(TH,'\\theta')}}=\\dfrac{${cs(TH,'\\theta')}^2}{6}`,880,235,{size:44,auto:false})
   +label('θ：0.1 → 0.167%',880,305,{size:24,color:C.ink,anchor:'middle'})+label('θ：0.01 → 0.00167%',880,345,{size:24,color:C.ink,anchor:'middle'})
   +label('θ を 1/10 → 1/100',880,395,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'caution']:(p)=>{
  let s=card(160,100,880,300,tex(`${cs(TH,'\\theta')}-${cs(SN,'\\sin\\theta')}\\approx\\dfrac{${cs(TH,'\\theta')}^3}{6}`,600,190,{size:50,auto:false})
   +label('ここでは 数で 確かめた 目安',600,290,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('なぜ この形か → テイラー展開（中級）',600,350,{size:28,color:C.dim,anchor:'middle'})),seg(p,0,.2),C.hi);
  return s;
 },
 // ===== S5 どこまで信じる？ =====
 [K+'depends']:(p)=>{
  let s=card(200,100,800,300,tex(`${cs(SN,'\\sin\\theta')}\\approx${cs(TH,'\\theta')}`,600,190,{size:56,auto:false})
   +label('どこまで 信じてよい？',600,275,{size:32,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('→ 必要な 正確さ で 決まる',600,345,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.2),C.hi);
  return s;
 },
 [K+'onepct']:(p)=>{
  let s=relCurve(p,{mark:seg(p,.75,.9)});
  s+=card(740,70,420,70,label('相対誤差 1% まで 許す',950,115,{size:26,color:C.a,anchor:'middle'}),seg(p,.05,.2));
  s+=fade(seg(p,.25,.4),tex(`\\dfrac{${cs(TH,'\\theta')}^2}{6}\\le 0.01`,950,210,{size:40,auto:false}));
  s+=fade(seg(p,.45,.6),tex(`${cs(TH,'\\theta')}^2\\le 0.06`,950,300,{size:40,auto:false}));
  s+=fade(seg(p,.65,.8),tex(`${cs(TH,'\\theta')}\\lesssim 0.245\\ \\mathrm{rad}\\ (\\approx 14^\\circ)`,950,390,{size:36,auto:false}));
  return s;
 },
 [K+'verify']:(p)=>{
  let s=relCurve(1,{mark:1});
  s+=card(740,120,420,280,label('確かめ',950,165,{size:24,color:C.dim,anchor:'middle'})
   +tex(`${cs(SN,'\\sin 0.245')}=${cs(SN,'0.2426')}`,950,235,{size:38,auto:false})
   +fade(seg(p,.35,.5),label('相対誤差 約 1.0%',950,310,{size:30,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('目安どおり ✓',950,365,{size:28,color:C.F,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'swing']:(p)=>{
  const ox=250,oy=80,L=320,th=.1745*seg(p,0,.25)+ .1745*Math.sin(p*9)*.0,bx=ox+L*Math.sin(th),by=oy+L*Math.cos(th);
  let s=line(ox-80,oy,ox+80,oy,{color:C.dim,w:4})+line(ox,oy,ox,oy+L+30,{color:C.faint,w:2,dash:'6 6'})+line(ox,oy,bx,by,{color:C.dim,w:3})+ring(bx,by,22,{color:C.ink,w:3,fill:'#1d2a48'});
  s+=fade(seg(p,.2,.3),label('10° ＝ 0.175 rad',ox+60,oy+200,{size:26,color:TH,weight:700}));
  s+=card(600,110,560,280,label('θ ＝ 0.175 rad',880,170,{size:30,color:TH,anchor:'middle'})
   +fade(seg(p,.3,.45),label('相対誤差 約 0.5%',880,240,{size:34,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('sinθ → θ に 置き換えても',880,305,{size:26,color:C.dim,anchor:'middle'})+label('ずれは 0.5% ほど',880,350,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'notequal']:(p)=>{
  let s='';
  s+=card(80,100,480,200,tex(`${cs(SN,'\\sin\\theta')}=${cs(TH,'\\theta')}`,320,210,{size:56,auto:false,color:C.a})+cross(150,205,18),seg(p,0,.15),C.a);
  s+=card(640,100,480,200,tex(`${cs(SN,'\\sin\\theta')}\\approx${cs(TH,'\\theta')}`,880,210,{size:56,auto:false}),seg(p,0,.15),C.F);
  s+=fade(seg(p,.45,.6),card(160,330,880,130,label('条件つきの 置き換え',600,380,{size:30,color:C.hi,anchor:'middle',weight:700})+label('θ が 小さい 範囲で、この くらいの 誤差で',600,430,{size:26,color:C.ink,anchor:'middle'})));
  return s;
 },
 [K+'radian']:(p)=>{
  let s=label('θ は ラジアンで 入れる',600,80,{size:32,color:C.hi,anchor:'middle',weight:700});
  s+=card(60,120,520,300,label('度の数字のまま',320,170,{size:28,color:C.dim,anchor:'middle'})
   +tex(`${cs(SN,'\\sin 5^\\circ')}=${cs(SN,'0.087')}`,320,250,{size:44,auto:false})+label('と 5 ？',320,330,{size:32,color:C.a,anchor:'middle',weight:700})+cross(150,330,16),seg(p,.1,.25),C.a);
  s+=card(620,120,520,300,label('ラジアンに 直すと',880,170,{size:28,color:C.dim,anchor:'middle'})
   +tex(`5^\\circ=${cs(TH,'0.0873')}\\ \\mathrm{rad}`,880,250,{size:44,auto:false})+label('0.087 に 近い ✓',880,330,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.55,.7),C.F);
  return s;
 },
 // ===== S6 次の問い =====
 [K+'summary']:(p)=>{
  let s=label('まとめ',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,0,.15),uc(230,330,170,.6,{full:false}));
  s+=card(520,110,640,130,label('半径 1：θ は 弧、sinθ は 高さ',840,185,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.2));
  s+=card(520,270,640,150,label('差の目安',640,320,{size:26,color:C.dim})+tex(`\\dfrac{${cs(TH,'\\theta')}^3}{6}`,960,345,{size:48,auto:false}),seg(p,.5,.65));
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=table([1,1,1],{y:70});
  s+=fade(seg(p,.6,.75),label('必要な 正確さ から、使える 範囲を 決める',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'size']:(p)=>{
  let s=label('ここまでの 近似：「大きさ」の話',600,90,{size:32,color:C.ink,anchor:'middle',weight:700});
  s+=card(140,140,420,240,label('長さ',350,210,{size:30,color:TH,anchor:'middle'})+line(220,260,480,260,{color:TH,w:8})+label('0.2 m',350,320,{size:30,color:C.ink,anchor:'middle'}),seg(p,.1,.3));
  s+=card(640,140,420,240,label('角度',850,210,{size:30,color:C.hi,anchor:'middle'})+label('0.1 rad',850,290,{size:34,color:C.ink,anchor:'middle'}),seg(p,.3,.5));
  s+=fade(seg(p,.6,.75),label('どちらも 数 1つで 言える',600,450,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'next']:(p)=>{
  let s='';
  const a=seg(p,.05,.3);
  s+=arrow(150,400,150+260*a,400-170*a,{color:C.F,w:6})+arrow(150,400,150+300*a,400,{color:C.v,w:6})+dot(150,400,7,C.ink);
  s+=card(560,110,600,280,label('次の問い',860,165,{size:26,color:C.dim,anchor:'middle'})
   +label('向きを 持つ量 ＝ 矢印は',860,235,{size:32,color:C.ink,anchor:'middle'})
   +label('どうやって 数で 扱う？',860,300,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.4),C.hi);
  return s;
 },
};
