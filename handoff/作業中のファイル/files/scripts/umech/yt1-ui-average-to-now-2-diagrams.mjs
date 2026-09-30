// YouTube シリーズ「微分・初級 2/3」(ys-ui-average-to-now-2) — pictures. Stage 1200×515.
// Colours (anim.mjs C): position x cyan, speed v purple, time / width t,h gold, highlight yellow.
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';

const P='ui-average-to-now-2:';
const xt=t=>5*t*t;
const Hc=`{\\color{${C.t}}h}`; // h is a time width → gold

// ---- the x–t graph of x = 5t² (left half) ----------------------------------------------
function graph({g=1,curve=1,dim=1,x=100,y=450,w=450,h=340}={}){
 const A=axes({x,y,w,h,xmax:2.3,ymax:26,xlabel:'時刻 t [s]',ylabel:'位置 x [m]',xticks:[1,2],yticks:[5,10,15,20,25],grid:true,g,xcolor:C.t,ycolor:C.x});
 return {A,svg:fade(dim,A.svg+A.plot(xt,{from:0,to:2.2,p:curve,color:C.x,w:4}))};
}
function pt(A,t,g=1,color=C.hi,r=9){return fade(g,dot(A.X(t),A.Y(xt(t)),r,color));}
function secant(A,t1,t2,{g=1,color=C.v,w=4,ext=.35,opacity=1}={}){
 const k=(xt(t2)-xt(t1))/(t2-t1),a=Math.max(.35,t1-ext),b=Math.min(2.25,t2+ext);
 return draw([[A.X(a),A.Y(xt(t1)+k*(a-t1))],[A.X(b),A.Y(xt(t1)+k*(b-t1))]],g,{color,w,opacity});
}
// Δt (gold, along the left point's height) and Δx (cyan riser at the right end)
function rise(A,t1,t2,{gt=1,gx=1,tText='',xText='',xColor=C.x}={}){
 const x1=A.X(t1),y1=A.Y(xt(t1)),x2=A.X(t2),y2=A.Y(xt(t2));
 let s=line(x1,y1,mix(x1,x2,gt),y1,{color:C.t,w:5})+line(x2,y1,x2,mix(y1,y2,gx),{color:xColor,w:5});
 if(tText)s+=fade(gt,label(tText,(x1+x2)/2,y1+34,{size:24,color:C.t,anchor:'middle'}));
 if(xText)s+=fade(gx,label(xText,x2+12,(y1+y2)/2+8,{size:24,color:xColor}));
 return s;
}
function guide(A,t,g=1){const X=A.X(t),Y=A.Y(xt(t));return fade(g,line(A.X(0),Y,X,Y,{color:C.x,w:2,dash:'6 6',opacity:.7})+line(X,Y,X,A.Y(0),{color:C.t,w:2,dash:'6 6',opacity:.7}));}
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const lock=(x,y,g=1)=>fade(g,rect(x-11,y-4,22,17,{fill:C.dim,fo:1,rx:3})+`<path d="M${x-7} ${y-4} v-6 a7 7 0 0 1 14 0 v6" fill="none" stroke="${C.dim}" stroke-width="3"/>`);

// right-hand card for scene 2 (columns 690..1180)
const RX=735,RW=445,RC=RX+RW/2;

// ---- scene 3 table ---------------------------------------------------------------------
const ROWS=[[1,'15','5'],[0.5,'12.5','2.5'],[0.1,'10.5','0.5'],[0.01,'10.05','0.05']];
function table({g=1,rows=4,excess=0,five=0,hiRow=-1}={}){
 const x0=60,y0=70,w=exW(excess);
 let s=rect(x0,y0,w,340,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 s+=label('幅 Δt [s]',x0+110,y0+52,{size:26,color:C.t,anchor:'middle'})+label('平均の速さ [m/s]',x0+330,y0+52,{size:26,color:C.v,anchor:'middle'});
 s+=fade(excess,label('10 を超えた分',x0+560,y0+52,{size:26,color:C.a,anchor:'middle'}));
 s+=line(x0+20,y0+74,x0+w-20,y0+74,{color:C.faint,w:2});
 ROWS.forEach(([h,v,e],i)=>{
  const y=y0+130+i*66,gi=i<rows?1:0;
  if(i===hiRow)s+=rect(x0+14,y-42,w-28,58,{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:10});
  s+=fade(gi,label(String(h),x0+110,y,{size:32,color:C.t,anchor:'middle'})+label(v,x0+330,y,{size:34,color:C.v,anchor:'middle',weight:700}));
  s+=fade(excess*gi,label(e,x0+560,y,{size:32,color:C.a,anchor:'middle'}));
  s+=fade(five*gi,label(`＝ ${h} × 5`,x0+660,y,{size:26,color:C.hi}));
 });
 return fade(g,s);
}
function exW(excess){return mix(460,740,excess);}

// ---- number line of the averages (scene 3 / 4) ---------------------------------------
function numline(x0,x1,y,{g=1,vals=[15,12.5,10.5,10.05],show=[1,1,1,1],ten=1,arrowG=0,lo=9,hi=15.5}={}){
 const X=v=>x0+(x1-x0)*(v-lo)/(hi-lo);
 let s=line(x0,y,x1,y,{color:C.dim,w:3});
 for(let v=Math.ceil(lo);v<=hi;v++)s+=line(X(v),y-8,X(v),y+8,{color:C.dim,w:2})+label(String(v),X(v),y+38,{size:22,color:C.dim,anchor:'middle'});
 s+=fade(ten,line(X(10),y-86,X(10),y+14,{color:C.hi,w:3,dash:'8 6'})+label('10',X(10),y-96,{size:28,color:C.hi,anchor:'middle',weight:700}));
 vals.forEach((v,i)=>{s+=fade(show[i],dot(X(v),y,10,C.v)+label(String(v),i===3?X(v)-8:X(v),y-24,{size:22,color:C.v,anchor:i===3?'end':'middle'}));});
 s+=arrow(X(15)+10,y+62,X(10)+14,y+62,{color:C.hi,w:4,g:arrowG});
 return {X,svg:fade(g,s)};
}

export const ytUiAvg2Diagrams={
 // ================= scene 1 =================
 [P+'recap']:(p)=>{
  const {A,svg}=graph({g:seg(p,0,.12),curve:seg(p,.05,.3)});
  let s=svg+pt(A,1,seg(p,.2,.3))+pt(A,2,seg(p,.2,.3))+rise(A,1,2,{gt:seg(p,.25,.4),gx:seg(p,.3,.45),tText:'Δt ＝ 1 s',xText:'Δx ＝ 15 m'})+secant(A,1,2,{g:seg(p,.4,.55)});
  s+=fade(seg(p,.1,.25),tex('x=5t^2',A.X(.5),A.Y(20),{size:40}));
  s+=card(735,100,445,210,label('前回',957,145,{size:24,color:C.dim,anchor:'middle'})
   +tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}=\\dfrac{15\\,\\mathrm{m}}{1\\,\\mathrm{s}}=15\\,\\mathrm{m/s}',957,235,{size:36}),seg(p,.15,.3));
  const gq=seg(p,.6,.75);
  s+=fade(gq,[1.2,1.5,1.8].map(t=>ring(A.X(t),A.Y(xt(t)),16,{color:C.a,w:3})+label('?',A.X(t)-26,A.Y(xt(t))-14,{size:28,color:C.a,weight:700})).join(''));
  s+=card(735,340,445,100,label('各瞬間の速さは 読み取れない',957,400,{size:30,color:C.a,anchor:'middle',weight:700}),gq,C.a);
  return s;
 },
 [P+'question']:(p)=>{
  let s=card(200,70,800,250,label('今回の問い',600,120,{size:26,color:C.dim,anchor:'middle'})
   +label('区間の幅を変えて 測り直したら、',600,195,{size:36,color:C.ink,anchor:'middle'})
   +label('平均の速さは どう動く？',600,265,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  // a little interval whose width breathes
  const w=mix(360,90,.5+.5*Math.sin(p*6.3)),x0=360,y=400,g=seg(p,.25,.4);
  s+=fade(g,line(300,y,900,y,{color:C.dim,w:3})+dot(x0,y,9,C.hi)+dot(x0+w,y,9,C.hi)+line(x0,y,x0+w,y,{color:C.t,w:7})+label('幅',x0+w/2,y+44,{size:26,color:C.t,anchor:'middle'})+label('時刻 t',910,y+8,{size:24,color:C.t}));
  return s;
 },
 [P+'fix']:(p)=>{
  const {A,svg}=graph();const t2=1.65+.35*Math.cos(Math.PI*2*seg(p,.35,1)*1);
  let s=svg+secant(A,1,t2,{g:1,opacity:.8})+pt(A,1)+pt(A,t2,1,C.hi);
  s+=lock(A.X(1)-30,A.Y(5)-20,seg(p,.05,.2));
  s+=fade(seg(p,.05,.2),label('t ＝ 1 s に固定',A.X(1)-50,A.Y(5)-50,{size:24,color:C.dim,anchor:'middle'}));
  s+=arrow(A.X(t2)+20,A.Y(xt(t2))+50,A.X(t2)-40,A.Y(xt(t2))+50,{color:C.hi,w:4,g:seg(p,.3,.45)});
  s+=line(A.X(1),A.Y(0)+0,A.X(t2),A.Y(0),{color:C.t,w:8})+fade(seg(p,.3,.45),label('幅',(A.X(1)+A.X(t2))/2,A.Y(0)-14,{size:24,color:C.t,anchor:'middle'}));
  s+=card(735,120,445,260,label('左の端：t ＝ 1 s に固定',760,190,{size:30,color:C.dim})
   +fade(seg(p,.3,.45),label('右の端：動かす',760,255,{size:30,color:C.hi}))
   +fade(seg(p,.55,.7),label('変えるのは 幅だけ',760,330,{size:32,color:C.t,weight:700})),seg(p,0,.15));
  return s;
 },
 [P+'predict']:(p)=>{
  const {A,svg}=graph();const t2=2-.5*smooth(seg(p,.1,.5));
  let s=svg+secant(A,1,2,{color:C.faint})+pt(A,1)+pt(A,t2,1,C.hi)+line(A.X(1),A.Y(0),A.X(t2),A.Y(0),{color:C.t,w:8});
  const opts=[['大きくなる','↑',C.a],['小さくなる','↓',C.x],['変わらない','→',C.dim]];
  s+=card(735,70,445,90,label('幅を縮めると、平均の速さは？',957,127,{size:30,color:C.ink,anchor:'middle'}),seg(p,0,.15),C.hi);
  opts.forEach(([t,a,c],i)=>{s+=card(735,185+i*95,445,78,label(a,790,236+i*95,{size:36,color:c,anchor:'middle',weight:700})+label(t,840,236+i*95,{size:32,color:C.ink}),seg(p,.15+i*.08,.3+i*.08));});
  s+=fade(seg(p,.5,.65),label('予想してみよう',957,490,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [P+'shape']:(p)=>{
  const {A,svg}=graph();let s=svg;
  const steps=[1,1.25,1.5,1.75];
  steps.forEach((t,i)=>{const g=seg(p,.12+i*.12,.24+i*.12);s+=fade(g,rise(A,t,t+.25,{})+dot(A.X(t),A.Y(xt(t)),6,C.hi));});
  s+=pt(A,2,seg(p,.5,.6),C.hi,6);
  const bars=steps.map(t=>xt(t+.25)-xt(t));
  let b='';bars.forEach((d,i)=>{const g=seg(p,.12+i*.12,.24+i*.12),h=d*48,x=790+i*95;
   b+=fade(g,rect(x,420-h,64,h,{fill:C.x,fo:.55,rx:4})+label(`${fmt(d,1)}`,x+32,410-h,{size:24,color:C.x,anchor:'middle'})+label(`${i+1}`,x+32,452,{size:22,color:C.dim,anchor:'middle'}));});
  s+=card(735,70,445,410,label('0.25 s ごとの増え方 [m]（約）',957,112,{size:24,color:C.ink,anchor:'middle'})+line(760,422,1160,422,{color:C.dim,w:2})+b
   +fade(seg(p,.7,.85),label('右へ行くほど 大きい',957,160,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },

 // ================= scene 2 =================
 [P+'w1']:(p)=>{
  const {A,svg}=graph();let s=svg;
  s+=guide(A,1,seg(p,.2,.35))+pt(A,1,seg(p,.2,.35))+fade(seg(p,.25,.4),label('t ＝ 1 s，x ＝ 5 m',A.X(1)+16,A.Y(5)+36,{size:24,color:C.hi}));
  s+=guide(A,2,seg(p,.55,.7))+pt(A,2,seg(p,.55,.7))+fade(seg(p,.6,.75),label('t ＝ 2 s，x ＝ 20 m',A.X(2)-14,A.Y(20)-20,{size:24,color:C.hi,anchor:'end'}));
  s+=card(RX,100,RW,150,label('幅 1 s',RC,150,{size:30,color:C.t,anchor:'middle',weight:700})+tex('x(1)=5\\,\\mathrm{m},\\ \\ x(2)=20\\,\\mathrm{m}',RC,215,{size:34}),seg(p,.3,.5));
  return s;
 },
 [P+'w1calc']:(p)=>{
  const {A,svg}=graph();let s=svg+pt(A,1)+pt(A,2);
  s+=rise(A,1,2,{gt:seg(p,.3,.45),gx:seg(p,.05,.25),tText:'Δt ＝ 1 s',xText:'Δx ＝ 15 m'})+secant(A,1,2,{g:seg(p,.65,.85)});
  s+=card(RX,100,RW,150,label('幅 1 s',RC,150,{size:30,color:C.t,anchor:'middle',weight:700})+tex('x(1)=5\\,\\mathrm{m},\\ \\ x(2)=20\\,\\mathrm{m}',RC,215,{size:34}));
  s+=card(RX,270,RW,200,tex('\\Delta x=20-5=15\\,\\mathrm{m}',RC,320,{size:36})
   +fade(seg(p,.45,.6),tex('\\bar v=\\dfrac{15\\,\\mathrm{m}}{1\\,\\mathrm{s}}=15\\,\\mathrm{m/s}',RC,420,{size:38})),seg(p,.05,.2));
  return s;
 },
 [P+'half']:(p)=>{
  const {A,svg}=graph();const t2=2-.5*smooth(seg(p,.1,.5));
  let s=svg+secant(A,1,2,{color:C.faint})+pt(A,1)+pt(A,t2)+line(A.X(1),A.Y(0),A.X(t2),A.Y(0),{color:C.t,w:8});
  s+=fade(seg(p,.5,.65),label('t ＝ 1.5 s',A.X(1.5),A.Y(0)+62,{size:24,color:C.hi,anchor:'middle'}));
  s+=card(RX,100,RW,190,label('幅 1 s　→　15 m/s',RC,160,{size:30,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.5),label('幅 0.5 s　→　？',RC,240,{size:34,color:C.t,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [P+'halfpos']:(p)=>{
  const {A,svg}=graph();let s=svg+secant(A,1,2,{color:C.faint})+pt(A,1)+pt(A,1.5)+line(A.X(1),A.Y(0),A.X(1.5),A.Y(0),{color:C.t,w:8});
  s+=guide(A,1.5,seg(p,.7,.85))+fade(seg(p,.72,.87),label('11.25 m',A.X(1.5)-14,A.Y(11.25)-18,{size:24,color:C.x,anchor:'end'}));
  s+=card(RX,100,RW,190,label('幅 1 s　→　15 m/s',RC,160,{size:30,color:C.dim,anchor:'middle'})+label('幅 0.5 s　→　？',RC,240,{size:34,color:C.t,anchor:'middle',weight:700}));
  s+=card(RX,310,RW,190,tex('x(1.5)=5\\times1.5^2',RC,350,{size:36})
   +fade(seg(p,.35,.5),tex('=5\\times2.25',RC+40,408,{size:36}))
   +fade(seg(p,.65,.8),tex('=11.25\\,\\mathrm{m}',RC+40,466,{size:36,color:C.x,auto:false})),seg(p,0,.15));
  return s;
 },
 [P+'halfdx']:(p)=>{
  const {A,svg}=graph();let s=svg+secant(A,1,2,{color:C.faint})+pt(A,1)+pt(A,1.5);
  s+=rise(A,1,1.5,{gt:seg(p,.05,.2),gx:seg(p,.2,.45),tText:'0.5 s',xText:'Δx'});
  s+=card(RX,100,RW,190,label('幅 1 s　→　15 m/s',RC,160,{size:30,color:C.dim,anchor:'middle'})+label('幅 0.5 s　→　？',RC,240,{size:34,color:C.t,anchor:'middle',weight:700}));
  s+=card(RX,310,RW,190,tex('\\Delta x=11.25-5',RC,370,{size:38})+fade(seg(p,.5,.65),tex('=6.25\\,\\mathrm{m}',RC+40,445,{size:38,color:C.x,auto:false})));
  return s;
 },
 [P+'halfv']:(p)=>{
  const {A,svg}=graph();let s=svg+secant(A,1,2,{color:C.faint})+pt(A,1)+pt(A,1.5);
  s+=rise(A,1,1.5,{tText:'0.5 s',xText:'6.25 m'})+secant(A,1,1.5,{g:seg(p,.6,.8)});
  s+=card(RX,100,RW,190,label('幅 1 s　→　15 m/s',RC,160,{size:30,color:C.dim,anchor:'middle'})
   +fade(1-seg(p,.8,.92),label('幅 0.5 s　→　？',RC,240,{size:34,color:C.t,anchor:'middle',weight:700}))+fade(seg(p,.8,.92),label('幅 0.5 s　→　12.5 m/s',RC,240,{size:34,color:C.v,anchor:'middle',weight:700})));
  s+=card(RX,310,RW,190,tex('\\bar v=\\dfrac{6.25\\,\\mathrm{m}}{0.5\\,\\mathrm{s}}',RC-60,395,{size:36})
   +fade(seg(p,.3,.45),label('÷0.5 ＝ ×2',RC+115,405,{size:26,color:C.hi,anchor:'middle'}))
   +fade(seg(p,.55,.7),tex('=12.5\\,\\mathrm{m/s}',RC,475,{size:36,color:C.v,auto:false})));
  return s;
 },
 [P+'halves']:(p)=>{
  const {A,svg}=graph();let s=svg+secant(A,1,2,{color:C.faint})+pt(A,1)+pt(A,1.5)+pt(A,2,seg(p,.3,.45));
  s+=rise(A,1,1.5,{tText:'前半',xText:'6.25 m'});
  s+=rise(A,1.5,2,{gt:seg(p,.3,.45),gx:seg(p,.45,.65),xText:'後半 8.75 m',xColor:C.a});
  s+=card(RX,100,RW,120,label('15　→　12.5 m/s',RC,175,{size:36,color:C.v,anchor:'middle',weight:700}));
  s+=card(RX,240,RW,240,label('前半 0.5 s：6.25 m',RX+40,300,{size:30,color:C.x})
   +fade(seg(p,.45,.6),label('後半 0.5 s：8.75 m',RX+40,360,{size:30,color:C.a}))
   +fade(seg(p,.7,.85),label('切り捨てたのは 速い部分',RX+40,435,{size:30,color:C.hi,weight:700})),seg(p,.2,.35),C.a);
  return s;
 },
 [P+'halfavg']:(p)=>{
  const {A,svg}=graph();let s=svg+pt(A,1)+pt(A,1.5)+pt(A,2);
  s+=secant(A,1,1.5,{ext:.15})+secant(A,1.5,2,{color:C.a,ext:.15,g:seg(p,.05,.25)})+secant(A,1,2,{color:C.hi,w:3,ext:.1,g:seg(p,.55,.75)});
  s+=card(RX,100,RW,380,
   label('前半',RX+40,165,{size:30,color:C.dim})+label('12.5 m/s',RX+RW-40,165,{size:32,color:C.v,anchor:'end',weight:700})
   +fade(seg(p,.05,.2),tex('\\dfrac{8.75}{0.5}=17.5',RX+RW-40,240,{size:32,anchor:'end',auto:false,color:C.a})+label('後半',RX+40,240,{size:30,color:C.dim}))
   +fade(seg(p,.45,.6),line(RX+30,290,RX+RW-30,290,{color:C.faint,w:2})+tex('\\dfrac{12.5+17.5}{2}=15',RC,360,{size:36,auto:false,color:C.hi}))
   +fade(seg(p,.65,.8),label('幅1 s の15 ＝ 二つを ならした値',RC,445,{size:25,color:C.ink,anchor:'middle'})));
  return s;
 },

 // ================= scene 3 =================
 [P+'tenth']:(p)=>{
  const {A,svg}=graph({x:90,y:450,w:380,h:330});const t2=1.5-.4*smooth(seg(p,.02,.25));
  let s=svg+pt(A,1)+pt(A,t2)+line(A.X(1),A.Y(0),A.X(t2),A.Y(0),{color:C.t,w:8});
  s+=fade(seg(p,.2,.3),label('幅 0.1 s',A.X(1.05),A.Y(0)+62,{size:24,color:C.t,anchor:'middle'}));
  s+=card(650,80,530,380,label('幅 0.1 s：t ＝ 1 → 1.1 s',910,135,{size:30,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),tex('x(1.1)=5\\times1.1^2',910,215,{size:38}))
   +fade(seg(p,.55,.7),tex('=5\\times1.21',950,290,{size:38}))
   +fade(seg(p,.75,.88),tex('=6.05\\,\\mathrm{m}',950,365,{size:38,color:C.x,auto:false})),seg(p,0,.15));
  return s;
 },
 [P+'tenthv']:(p)=>{
  const {A,svg}=graph({x:90,y:450,w:380,h:330});
  let s=svg+pt(A,1)+pt(A,1.1)+line(A.X(1),A.Y(0),A.X(1.1),A.Y(0),{color:C.t,w:8})+secant(A,1,1.1,{ext:.6,g:seg(p,.6,.8)});
  s+=card(650,80,530,380,label('幅 0.1 s：t ＝ 1 → 1.1 s',910,135,{size:30,color:C.t,anchor:'middle',weight:700})
   +tex('\\Delta x=6.05-5=1.05\\,\\mathrm{m}',910,215,{size:36})
   +fade(seg(p,.3,.45),tex('\\bar v=\\dfrac{1.05\\,\\mathrm{m}}{0.1\\,\\mathrm{s}}',820,320,{size:36})+label('÷0.1 ＝ ×10',1065,330,{size:25,color:C.hi,anchor:'middle'}))
   +fade(seg(p,.6,.75),tex('=10.5\\,\\mathrm{m/s}',910,420,{size:40,color:C.v,auto:false})));
  return s;
 },
 [P+'hund']:(p)=>{
  const {A,svg}=graph({x:90,y:450,w:380,h:330});const t2=1.1-.09*smooth(seg(p,.02,.2));
  let s=svg+pt(A,1)+pt(A,t2)+fade(seg(p,.2,.3),ring(A.X(1),A.Y(5),22,{color:C.hi,w:3})+label('ほぼ重なる',A.X(1)+30,A.Y(5)+50,{size:24,color:C.hi}));
  s+=card(650,80,530,380,label('幅 0.01 s：t ＝ 1 → 1.01 s',910,135,{size:30,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),tex('x(1.01)=5\\times1.0201',910,215,{size:36}))
   +fade(seg(p,.35,.5),tex('=5.1005\\,\\mathrm{m}',960,290,{size:36,color:C.x,auto:false}))
   +fade(seg(p,.6,.75),tex('\\Delta x=5.1005-5=0.1005\\,\\mathrm{m}',910,390,{size:34})),seg(p,0,.15));
  return s;
 },
 [P+'hundv']:(p)=>{
  const {A,svg}=graph({x:90,y:450,w:380,h:330});
  let s=svg+pt(A,1)+pt(A,1.01)+secant(A,1,1.01,{ext:.6,g:seg(p,.55,.75)});
  s+=card(650,80,530,380,label('幅 0.01 s：t ＝ 1 → 1.01 s',910,135,{size:30,color:C.t,anchor:'middle',weight:700})
   +tex('\\bar v=\\dfrac{0.1005\\,\\mathrm{m}}{0.01\\,\\mathrm{s}}',810,245,{size:36})
   +fade(seg(p,.1,.25),label('÷0.01 ＝ ×100',1060,255,{size:25,color:C.hi,anchor:'middle'}))
   +fade(seg(p,.45,.6),tex('=10.05\\,\\mathrm{m/s}',910,370,{size:42,color:C.v,auto:false})));
  return s;
 },
 [P+'table']:(p)=>{
  let s=table({rows:0})+[0,1,2,3].map(i=>fade(seg(p,.1+i*.18,.22+i*.18),table({rows:i+1}))).join('');
  return s;
 },
 [P+'excess']:(p)=>{
  const ex=seg(p,.05,.25),fv=seg(p,.6,.8);
  let s=table({excess:ex,five:fv});
  s+=fade(fv,card(60,430,740,70,label('10 を超えた分 ＝ 幅 × 5',430,477,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [P+'answer']:(p)=>{
  let s=fade(1-seg(p,0,.15)*.5,table({excess:1-seg(p,0,.15),five:1-seg(p,0,.15)}));
  const N=numline(560,1170,300,{g:seg(p,.05,.2),show:[0,1,2,3].map(i=>seg(p,.15+i*.1,.25+i*.1)),arrowG:seg(p,.55,.75),lo:9,hi:15.5});
  s+=card(540,80,650,420,N.svg+label('幅を縮めると 小さくなり、10 へ寄る',865,140,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  return s;
 },
 [P+'why']:(p)=>{
  let s=fade(.5,table({}));
  s+=card(540,80,650,420,
   label('数を 4つ 並べただけ',865,160,{size:32,color:C.ink,anchor:'middle'})
   +label('どんな幅でも 成り立つ？',865,230,{size:34,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),arrow(865,270,865,330,{color:C.hi,w:4})+label('幅を 文字 h で書く',865,400,{size:36,color:C.hi,anchor:'middle',weight:700})
    +tex(`${Hc}`,865,460,{size:40,auto:false})),seg(p,0,.15),C.a);
  return s;
 },

 // ================= scene 4 =================
 [P+'hstrip']:(p)=>{
  let s=line(120,110,640,110,{color:C.dim,w:3})+dot(220,110,9,C.hi)+fade(seg(p,.15,.3),dot(520,110,9,C.hi));
  s+=label('t ＝ 1',220,152,{size:26,color:C.t,anchor:'middle'})+fade(seg(p,.6,.75),label('t ＝ 1 ＋ h',520,152,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.15,.3),line(220,110,520,110,{color:C.t,w:7})+brace(220,520,78,{dir:-1,text:'幅 h',color:C.t,size:28}));
  s+=card(720,60,450,120,label('h：幅 [s]',750,110,{size:30,color:C.t,weight:700})+label('ゼロではない 正の数（h ＞ 0）',750,155,{size:26,color:C.ink}),seg(p,.25,.4));
  return s;
 },
 [P+'hpos']:(p)=>{
  let s=line(120,110,640,110,{color:C.dim,w:3})+dot(220,110,9,C.hi)+dot(520,110,9,C.hi)+label('t ＝ 1',220,152,{size:26,color:C.t,anchor:'middle'})+label('t ＝ 1 ＋ h',520,152,{size:26,color:C.t,anchor:'middle'})+line(220,110,520,110,{color:C.t,w:7})+brace(220,520,78,{dir:-1,text:'幅 h',color:C.t,size:28});
  s+=card(720,60,450,120,label('h：幅 [s]',750,110,{size:30,color:C.t,weight:700})+label('ゼロではない 正の数（h ＞ 0）',750,155,{size:26,color:C.ink}));
  s+=fade(seg(p,.1,.3),tex(`x(1+${Hc})=5(1+${Hc})^2`,90,250,{size:44,anchor:'start'})+label('右の端の位置',90,305,{size:24,color:C.x}));
  return s;
 },
 [P+'square']:(p)=>{
  const u=190,hh=80,x0=800,y0=110;
  let s=tex(`x(1+${Hc})=5(1+${Hc})^2`,90,110,{size:40,anchor:'start'});
  const g1=seg(p,.05,.2),g2=seg(p,.45,.6),g3=seg(p,.6,.72),g4=seg(p,.72,.84);
  s+=fade(g1,rect(x0,y0,u+hh,u+hh,{fill:'none',fo:0,stroke:C.dim,sw:3,rx:0})+brace(x0,x0+u+hh,y0-10,{dir:-1,text:'1 ＋ h',color:C.ink,size:26})+label('1 ＋ h',x0-16,y0+(u+hh)/2+8,{size:26,color:C.ink,anchor:'end'}));
  s+=fade(g2,rect(x0,y0,u,u,{fill:C.x,fo:.25,rx:0})+label('1',x0+u/2,y0+u/2+10,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(g3,rect(x0+u,y0,hh,u,{fill:C.t,fo:.3,rx:0})+rect(x0,y0+u,u,hh,{fill:C.t,fo:.3,rx:0})+label('h',x0+u+hh/2,y0+u/2+10,{size:30,color:C.t,anchor:'middle'})+label('h',x0+u/2,y0+u+hh/2+10,{size:30,color:C.t,anchor:'middle'}));
  s+=fade(g4,rect(x0+u,y0+u,hh,hh,{fill:C.a,fo:.35,rx:0})+label('h²',x0+u+hh/2,y0+u+hh/2+10,{size:28,color:C.a,anchor:'middle'}));
  s+=fade(g1,tex(`(1+${Hc})^2`,90,250,{size:44,anchor:'start'})+label('＝ 一辺 1 ＋ h の 正方形の面積',90,310,{size:26,color:C.dim}));
  s+=fade(g4,tex(`(1+${Hc})^2=1+2${Hc}+${Hc}^2`,90,410,{size:44,anchor:'start'}));
  return s;
 },
 [P+'times5']:(p)=>{
  const u=190,hh=80,x0=800,y0=110;
  let s=tex(`x(1+${Hc})=5(1+${Hc})^2`,90,110,{size:40,anchor:'start'});
  s+=fade(.45,rect(x0,y0,u,u,{fill:C.x,fo:.25,rx:0})+rect(x0+u,y0,hh,u,{fill:C.t,fo:.3,rx:0})+rect(x0,y0+u,u,hh,{fill:C.t,fo:.3,rx:0})+rect(x0+u,y0+u,hh,hh,{fill:C.a,fo:.35,rx:0}));
  s+=tex(`(1+${Hc})^2=1+2${Hc}+${Hc}^2`,90,230,{size:40,anchor:'start'});
  s+=fade(seg(p,.05,.2),label('5 倍する',90,310,{size:26,color:C.hi}));
  s+=fade(seg(p,.1,.35),tex(`x(1+${Hc})=5+10${Hc}+5${Hc}^2`,90,400,{size:46,anchor:'start'}));
  s+=fade(seg(p,.55,.7),highlight(75,360,texWidth(`x(1+${Hc})=5+10${Hc}+5${Hc}^2`,46)+30,70,1)+label('1 ＋ h 秒の位置 [m]',90,478,{size:24,color:C.x}));
  return s;
 },
 [P+'dx']:(p)=>{
  const top=`x(1+${Hc})=5+10${Hc}+5${Hc}^2`;
  let s=tex(top,90,80,{size:36,anchor:'start',opacity:.8})+label('− x(1) ＝ 5 m を引く',720,88,{size:26,color:C.hi});
  const r1=`\\Delta x=(5+10${Hc}+5${Hc}^2)-5`,x1=90,y1=210,sz=44;
  s+=fade(seg(p,.05,.2),tex(r1,x1,y1,{size:sz,anchor:'start'}));
  // strike the +5 and −5 that cancel
  const a=x1+texWidth('\\Delta x=(',sz),w5=texWidth('5',sz),b=x1+texWidth(r1,sz)-w5,g=seg(p,.4,.55);
  s+=fade(g,line(a-4,y1+18,a+w5+4,y1-30,{color:C.a,w:4})+line(b-4,y1+18,b+w5+4,y1-30,{color:C.a,w:4})+label('消える',x1+texWidth(r1,sz)+30,y1,{size:26,color:C.a}));
  s+=fade(seg(p,.6,.75),tex(`=10${Hc}+5${Hc}^2`,x1+texWidth('\\Delta x',sz)-4,320,{size:sz,anchor:'start'})+label('進んだ距離 [m]',640,330,{size:26,color:C.x}));
  return s;
 },
 [P+'divide']:(p)=>{
  let s=tex(`\\Delta x=10${Hc}+5${Hc}^2`,90,90,{size:40,anchor:'start'})+label('進んだ距離 [m]',520,100,{size:24,color:C.x});
  s+=fade(seg(p,.1,.3),tex(`\\bar v=\\dfrac{\\Delta x}{${Hc}}=\\dfrac{10${Hc}+5${Hc}^2}{${Hc}}`,90,270,{size:48,anchor:'start'}));
  s+=fade(seg(p,.4,.6),card(760,210,410,110,label('h で割る',965,255,{size:30,color:C.hi,anchor:'middle',weight:700})+label('＝ 1 秒あたりに直す',965,298,{size:26,color:C.ink,anchor:'middle'}),1,C.hi));
  return s;
 },
 [P+'cancel']:(p)=>{
  let s=tex(`\\Delta x=10${Hc}+5${Hc}^2`,90,90,{size:40,anchor:'start',opacity:.8});
  s+=tex(`\\bar v=\\dfrac{10${Hc}+5${Hc}^2}{${Hc}}`,90,220,{size:44,anchor:'start'});
  s+=fade(seg(p,.05,.2),label('h ≠ 0 なので 割ってよい',620,225,{size:28,color:C.hi}));
  s+=fade(seg(p,.35,.5),tex(`\\dfrac{10${Hc}}{${Hc}}=10`,120,390,{size:44,anchor:'start'}));
  s+=fade(seg(p,.6,.75),tex(`\\dfrac{5${Hc}^2}{${Hc}}=5${Hc}`,560,390,{size:44,anchor:'start'}));
  s+=fade(seg(p,.35,.5),label('h が一つ消える',120,445,{size:24,color:C.dim}))+fade(seg(p,.6,.75),label('h が一つ消える',560,445,{size:24,color:C.dim}));
  return s;
 },
 [P+'result']:(p)=>{
  let s=tex(`\\bar v=\\dfrac{10${Hc}+5${Hc}^2}{${Hc}}`,90,150,{size:44,anchor:'start',opacity:.8});
  const R=`\\bar v=10+5${Hc}`,W=texWidth(R,70);
  s+=fade(seg(p,.05,.25),tex(R,600,330,{size:70}))+fade(seg(p,.3,.45),highlight(600-W/2-24,275,W+48,100,1));
  s+=fade(seg(p,.5,.65),label('幅 h の区間の平均の速さ [m/s]',600,440,{size:28,color:C.v,anchor:'middle'}));
  return s;
 },
 [P+'check']:(p)=>{
  let s=tex(`\\bar v=10+5${Hc}`,300,110,{size:52});
  s+=card(80,170,440,90,label('h に代入',300,228,{size:30,color:C.ink,anchor:'middle'}));
  const rows=[['1','10 ＋ 5','15'],['0.5','10 ＋ 2.5','12.5'],['0.1','10 ＋ 0.5','10.5']];
  s+=card(600,40,570,440,label('h',660,100,{size:26,color:C.t,anchor:'middle'})+label('10 ＋ 5h',830,100,{size:26,color:C.ink,anchor:'middle'})+label('表',1020,100,{size:26,color:C.v,anchor:'middle'})+line(620,120,1150,120,{color:C.faint,w:2})
   +rows.map(([h,m,v],i)=>{const y=190+i*95,g=seg(p,.1+i*.18,.25+i*.18);return fade(g,label(h,660,y,{size:32,color:C.t,anchor:'middle'})+label(m,830,y,{size:30,color:C.ink,anchor:'middle'})+label(`＝ ${v}`,1020,y,{size:32,color:C.v,anchor:'middle',weight:700})+label('✓',1115,y,{size:34,color:C.F,anchor:'middle',weight:700}));}).join(''));
  s+=fade(seg(p,.7,.85),label('表の値と 一致',300,360,{size:34,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [P+'parts']:(p)=>{
  const h=Math.pow(10,-3*smooth(seg(p,.3,.9)));
  let s=tex(`\\bar v=10+5${Hc}`,600,100,{size:60});
  const w10=texWidth('\\bar v=',60),wAll=texWidth(`\\bar v=10+5${Hc}`,60),left=600-wAll/2;
  const b10=[left+w10,left+w10+texWidth('10',60)],b5=[left+wAll-texWidth(`5${Hc}`,60),left+wAll];
  s+=fade(seg(p,.02,.15),brace(b10[0],b10[1],135,{color:C.v})+label('幅によらない',(b10[0]+b10[1])/2+10,190,{size:26,color:C.v,anchor:'end'}));
  s+=fade(seg(p,.1,.25),brace(b5[0],b5[1],135,{color:C.a})+label('幅とともに 小さく',(b5[0]+b5[1])/2-10,190,{size:26,color:C.a}));
  const full=760,k=full/15,y=300;
  s+=label(`h ＝ ${h<.0015?'0.001':fmt(h,3)}`,220,y-30,{size:30,color:C.t});
  s+=rect(220,y,k*10,44,{fill:C.v,fo:.6,rx:6})+rect(220+k*10,y,k*5*h,44,{fill:C.a,fo:.8,rx:6});
  s+=label('10',220+k*5,y+32,{size:26,color:C.ink,anchor:'middle'})+fade(clamp(h*3),label('5h',220+k*10+k*2.5*h,y+32,{size:24,color:C.ink,anchor:'middle'}));
  s+=label(`平均 ＝ ${fmt(10+5*h,3)} m/s`,220,y+100,{size:32,color:C.v,weight:700});
  s+=fade(seg(p,.75,.9),label('→ 10 に寄る',700,y+100,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [P+'above']:(p)=>{
  let s=tex(`\\bar v=10+5${Hc}`,600,90,{size:52});
  s+=fade(seg(p,.02,.2),tex(`${Hc}>0\\ \\Rightarrow\\ 5${Hc}>0`,600,175,{size:40,auto:false}));
  const N=numline(120,1080,360,{g:seg(p,.2,.35),arrowG:seg(p,.55,.75),lo:9,hi:15.5});
  s+=N.svg;
  s+=fade(seg(p,.35,.5),rect(N.X(9)-10,300,N.X(10)-N.X(9)+10,90,{fill:C.a,fo:.08,stroke:'none',rx:0})+label('10 より下には来ない',N.X(9.5),480,{size:24,color:C.a,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('上から 10 に近づく',N.X(12.5),480,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ================= scene 5 =================
 [P+'slope']:(p)=>{
  const {A,svg}=graph();let s=svg+pt(A,1)+pt(A,2)+secant(A,1,2,{g:seg(p,.05,.25)});
  s+=rise(A,1,2,{gt:seg(p,.25,.4),gx:seg(p,.4,.55),tText:'横の差 Δt ＝ 1 s',xText:'縦の差 Δx'});
  s+=fade(seg(p,.45,.55),label('＝ 15 m',A.X(2)+12,A.Y(12.5)+40,{size:24,color:C.x}));
  s+=card(735,110,445,300,label('直線の傾き',957,160,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('＝ 縦の差 ÷ 横の差',957,215,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.55,.7),tex('=\\dfrac{\\Delta x}{\\Delta t}=\\bar v',957,305,{size:46}))
   +fade(seg(p,.75,.88),label('＝ 平均の速さ',957,385,{size:30,color:C.v,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [P+'tilt']:(p)=>{
  const {A,svg}=graph();
  const lg=p<.1?0:p<.45?smooth((p-.1)/.35):p<.55?1:p<.85?1+smooth((p-.55)/.3):2; // 0 → h=1, 1 → h=0.5, 2 → h=0.1
  const h=lg<=1?mix(1,.5,lg):mix(.5,.1,lg-1);
  let s=svg+fade(seg(p,.45,.55)*.35,secant(A,1,2,{color:C.v}))+fade(seg(p,.8,.9)*.35,secant(A,1,1.5,{color:C.v}))+secant(A,1,1+h)+pt(A,1)+pt(A,1+h,1,C.hi);
  const rows=[['幅 1 s','15'],['幅 0.5 s','12.5'],['幅 0.1 s','10.5']],show=[1,seg(p,.4,.5),seg(p,.8,.9)];
  s+=card(735,110,445,300,label('傾き ＝ 平均の速さ',957,160,{size:28,color:C.dim,anchor:'middle'})
   +rows.map(([w,v],i)=>fade(show[i],label(w,770,240+i*65,{size:30,color:C.t})+label(`${v} m/s`,1150,240+i*65,{size:32,color:C.v,anchor:'end',weight:700}))).join(''));
  s+=fade(seg(p,.6,.75),label('直線が 寝ていく',957,460,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [P+'touch']:(p)=>{
  const {A,svg}=graph();const h=mix(.1,.01,smooth(seg(p,.05,.35)));
  let s=svg+fade(.35,secant(A,1,1.1,{color:C.v,ext:.6}))+secant(A,1,1+h,{ext:.6,w:5})+pt(A,1)+pt(A,1+h,1,C.hi,7);
  s+=fade(seg(p,.35,.5),ring(A.X(1),A.Y(5),22,{color:C.hi,w:3})+label('2点が ほぼ重なる',A.X(1)+34,A.Y(5)+46,{size:24,color:C.hi}));
  s+=card(735,110,445,300,label('幅 0.01 s',957,170,{size:32,color:C.t,anchor:'middle',weight:700})
   +label('傾き 10.05 m/s',957,240,{size:32,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('1 秒の点で',957,320,{size:28,color:C.ink,anchor:'middle'})+label('曲線に沿う向き',957,365,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [P+'zoom']:(p)=>{
  const {A,svg}=graph({x:80,y:450,w:380,h:320});let s=svg+pt(A,1,1,C.hi,7);
  const bx0=A.X(.85),bx1=A.X(1.15),by0=A.Y(6.6),by1=A.Y(3.6);
  const gb=seg(p,.02,.15),gz=seg(p,.12,.35);
  s+=fade(gb,rect(bx0,by0,bx1-bx0,by1-by0,{fill:'none',fo:0,stroke:C.hi,sw:2.5,rx:2}));
  const Z={x0:620,y0:70,w:540,h:400};const ZX=t=>Z.x0+Z.w*(t-.85)/.3,ZY=v=>Z.y0+Z.h*(1-(v-3.6)/3);
  s+=fade(gz*.6,line(bx1,by0,Z.x0,Z.y0,{color:C.hi,w:1.5,dash:'5 6'})+line(bx1,by1,Z.x0,Z.y0+Z.h,{color:C.hi,w:1.5,dash:'5 6'}));
  let z=rect(Z.x0,Z.y0,Z.w,Z.h,{fill:'#0f1830',fo:1,stroke:C.hi,sw:2.5,rx:6});
  z+=line(ZX(1),Z.y0,ZX(1),Z.y0+Z.h,{color:C.grid,w:1.5})+line(Z.x0,ZY(5),Z.x0+Z.w,ZY(5),{color:C.grid,w:1.5});
  z+=draw(Array.from({length:61},(_,i)=>{const t=.85+.3*i/60;return [ZX(t),ZY(xt(t))];}),seg(p,.25,.5),{color:C.x,w:5});
  z+=fade(seg(p,.55,.7),draw([[ZX(.86),ZY(5+10*(-.14))],[ZX(1.14),ZY(5+10*.14)]],1,{color:C.hi,w:3,dash:'10 8'}));
  z+=dot(ZX(1),ZY(5),9,C.hi)+label('t ＝ 1 s',ZX(1)+14,ZY(5)+34,{size:24,color:C.t});
  z+=fade(seg(p,.4,.55),label('ほとんど まっすぐ',Z.x0+24,Z.y0+44,{size:28,color:C.ink}));
  z+=fade(seg(p,.7,.85),label('傾き ≈ 10 m/s',Z.x0+Z.w-24,Z.y0+Z.h-24,{size:30,color:C.hi,anchor:'end',weight:700}));
  s+=fade(gz,z);
  return s;
 },
 [P+'three']:(p)=>{
  const W=350,G=[seg(p,.02,.15),seg(p,.18,.32),seg(p,.34,.48)],xs=[40,425,810];
  let s='';
  s+=card(xs[0],60,W,320,label('数の表',xs[0]+W/2,105,{size:28,color:C.dim,anchor:'middle'})
   +['15','12.5','10.5','10.05'].map((v,i)=>label(v,xs[0]+W/2,165+i*48,{size:30,color:C.v,anchor:'middle',weight:700})).join(''),G[0]);
  s+=card(xs[1],60,W,320,label('式',xs[1]+W/2,105,{size:28,color:C.dim,anchor:'middle'})+tex(`\\bar v=10+5${Hc}`,xs[1]+W/2,200,{size:44})+label('h を縮めると 5h → 小さく',xs[1]+W/2,290,{size:24,color:C.a,anchor:'middle'}),G[1]);
  const gx=xs[2]+40,gy=330,sx=t=>gx+(t-.6)*230,sy=v=>gy-(v-1.5)*12;
  let gr=draw(Array.from({length:41},(_,i)=>{const t=.6+1.2*i/40;return [sx(t),sy(xt(t))];}),1,{color:C.x,w:3});
  [[2,.35],[1.5,.6],[1.1,1]].forEach(([t2,o])=>{const k=(xt(t2)-5)/(t2-1);gr+=line(sx(.7),sy(5+k*(-.3)),sx(Math.min(1.8,t2+.15)),sy(5+k*(Math.min(1.8,t2+.15)-1)),{color:C.v,w:3,opacity:o});});
  gr+=dot(sx(1),sy(5),6,C.hi);
  s+=card(xs[2],60,W,320,label('直線の傾き',xs[2]+W/2,105,{size:28,color:C.dim,anchor:'middle'})+gr,G[2]);
  s+=fade(seg(p,.55,.7),card(250,410,700,80,label('どれも 同じ 10 へ 向かう',600,462,{size:34,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },

 // ================= scene 6 =================
 [P+'summary']:(p)=>{
  const L=[['① 平均の速さは 区間の幅で変わる',C.ink],['② 幅 h では',C.ink],['③ 幅を縮めるほど 10 m/s に寄る',C.hi]];
  let s=card(110,50,980,420,label('まとめ',600,105,{size:28,color:C.dim,anchor:'middle'}),seg(p,0,.1));
  s+=fade(seg(p,.05,.2),label(L[0][0],170,190,{size:34,color:L[0][1]}));
  s+=fade(seg(p,.35,.5),label(L[1][0],170,290,{size:34,color:L[1][1]})+tex(`\\bar v=10+5${Hc}`,420,282,{size:44,anchor:'start'}));
  s+=fade(seg(p,.65,.8),label(L[2][0],170,395,{size:34,color:L[2][1],weight:700}));
  return s;
 },
 [P+'zero']:(p)=>{
  let s=tex(`\\bar v=\\dfrac{\\Delta x}{${Hc}}`,420,230,{size:70});
  s+=fade(seg(p,.2,.35),label('h ＝ 0 にして 割れば…',760,200,{size:34,color:C.t})+label('話は早い？',760,260,{size:40,color:C.hi,weight:700}));
  s+=fade(seg(p,.5,.65),label('?',600,440,{size:80,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [P+'next']:(p)=>{
  let s=label('次回の問い',600,75,{size:28,color:C.dim,anchor:'middle'});
  s+=card(120,110,960,140,label('① 幅を 0 にして割れば、早いのでは？',600,195,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.15),C.t);
  s+=card(120,280,960,140,label('② 近づく先の 10 を、どう言い表す？',600,365,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.35),C.hi);
  s+=fade(seg(p,.55,.7),label('微分・初級 3/3 へ',1080,480,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
