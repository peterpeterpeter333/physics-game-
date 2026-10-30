// YouTube シリーズ「剛体の回転・上級 1/2」(ys-uc-rigid2-1) — 図。Stage 1200×515.
// 色：v 紫、ω 桃、L 黄、エネルギー 橙（並進 橙、回転 桃）、摩擦・筋肉の力 緑、h・R 水色、強調 黄、誤り 赤。
// 坂の車輪は横から見た図（右下へ転がる → 画面で時計回り）。スケーターは真上から見た図（反時計回り → 𝐋 は手前 ⊙）。
// 数値：2gh＝12 → 箱 3.46、球 2.93、円板 2.83、輪 2.45 m/s。回転の割合 0、2/7、1/3、1/2。
//   スケーター I 4→2 kg·m²、ω 3→6 rad/s、L＝12、K 18→36 J。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly,ground} from './anim.mjs';

const K='uc-rigid2-1:';
const CV=C.v,CW=C.p,CL=C.hi,CE=C.E,CF=C.F,CR=C.x,CD=C.dim,BAD=C.a,CH=C.hi;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const col=(c,s)=>`{\\color{${c}}{${s}}}`;
const VV=col(CV,'v'),WW=col(CW,'\\omega'),RR=col(CR,'R'),HH=col(CR,'h'),LL=col(CL,'L'),KK=col(CE,'K');
const KT=`\\tfrac12 M${VV}^2`,KR=`\\tfrac12 I${WW}^2`;
const kk=`\\dfrac{I}{M${RR}^2}`;
const U=s=>`\\,\\mathrm{${s}}`;
const TAU=Math.PI*2;
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:CF,weight:700,anchor:'middle'}));
const ng=(x,y,g=1)=>fade(g,label('×',x,y,{size:36,color:BAD,weight:700,anchor:'middle'}));

// ---- shared pieces ------------------------------------------------------------------------------------------
function wheel(cx,cy,R,rot,{g=1,marker=1,spokes=6,rim=CD,fill='#141d33',w=6}={}){
 let s=ring(cx,cy,R,{color:rim,w,fill});
 for(let i=0;i<spokes;i++){const a=rot+i*TAU/spokes+Math.PI/2;s+=line(cx,cy,cx+R*.92*Math.cos(a),cy+R*.92*Math.sin(a),{color:C.faint,w:3});}
 if(marker){const a=rot+Math.PI/2;s+=dot(cx+R*Math.cos(a),cy+R*Math.sin(a),9,CH);}
 s+=dot(cx,cy,7,C.ink);
 return fade(g,s);
}
function headAt(pts,color){const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1),H=15;
 return `<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-H*Math.cos(a)+H*.55*Math.sin(a)},${y2-H*Math.sin(a)-H*.55*Math.cos(a)} ${x2-H*Math.cos(a)-H*.55*Math.sin(a)},${y2-H*Math.sin(a)+H*.55*Math.cos(a)}" fill="${color}"/>`;}
// arc in math angles (counter-clockwise on screen when a1>a0)
function turnArc(cx,cy,r,a0,a1,{color=CW,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=Array.from({length:31},(_,i)=>{const a=a0+(a1-a0)*i/30;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
 return fade(g,draw(pts,1,{color,w})+headAt(pts,color));
}
function outSym(x,y,r=22,color=CL,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
const topNote=(t='真上から 見た 図')=>label(t,30,40,{size:22,color:CD});

// shapes
const ringIcon=(x,y,r,g=1)=>fade(g,ring(x,y,r,{color:CH,w:Math.max(6,r*.12),fill:'#141d33'})+dot(x,y,4,CH));
const diskIcon=(x,y,r,g=1)=>fade(g,ring(x,y,r,{color:CD,w:3,fill:'#8fa6cf'})+dot(x,y,4,C.bg));
const ballIcon=(x,y,r,g=1)=>fade(g,`<defs><radialGradient id="bg${Math.round(x)}${Math.round(y)}" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#d9e6ff"/><stop offset="1" stop-color="#4f6390"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#bg${Math.round(x)}${Math.round(y)})"/>`);
const boxIcon=(x,y,r,g=1)=>fade(g,rect(x-r,y-r,2*r,2*r,{fill:CR,fo:.35,stroke:CR,rx:4}));
const SH={box:{k:0,name:'箱（滑る）',icon:boxIcon,kt:'0'},ball:{k:.4,name:'球',icon:ballIcon,kt:'\\tfrac25'},disk:{k:.5,name:'円板',icon:diskIcon,kt:'\\tfrac12'},ring:{k:1,name:'輪',icon:ringIcon,kt:'1'}};
const ORDER=['box','ball','disk','ring'];

// ---- slope (single) -----------------------------------------------------------------------------------------
const SLP={x1:70,y1:120,x2:600,y2:440};
function slope(){const {x1,y1,x2,y2}=SLP;return poly([[x1,y1],[x2,y2],[x1,y2]],{fill:'#26324d',fo:.8,stroke:CD,sw:2})+line(x2,y2,x2+80,y2,{color:CD,w:3});}
const slopeDir=()=>{const {x1,y1,x2,y2}=SLP,L0=Math.hypot(x2-x1,y2-y1);return {ux:(x2-x1)/L0,uy:(y2-y1)/L0,L0};};
function diskOnSlope(u,r=34){
 const {x1,y1}=SLP,{ux,uy,L0}=slopeDir(),sd=40+(L0-120)*u,nx=uy,ny=-ux,px=x1+ux*sd+nx*r,py=y1+uy*sd+ny*r,rot=sd/r;
 return {px,py,svg:ring(px,py,r,{color:CD,w:3,fill:'#8fa6cf'})+line(px,py,px+r*.85*Math.cos(rot),py+r*.85*Math.sin(rot),{color:C.bg,w:3})+dot(px,py,4,C.bg)};
}

// ---- race lanes ---------------------------------------------------------------------------------------------
const LN={x1:70,x2:640,drop:60,y0:85,gap:108,r:22};
function lane(i){const y=LN.y0+i*LN.gap;return {ax:LN.x1,ay:y,bx:LN.x2,by:y+LN.drop};}
function raceLanes(tau,{hiKey=''}={}){
 let s='';
 ORDER.forEach((key,i)=>{
  const {ax,ay,bx,by}=lane(i),sh=SH[key],Lx=bx-ax,Ly=by-ay,l0=Math.hypot(Lx,Ly),ux=Lx/l0,uy=Ly/l0,nx=uy,ny=-ux;
  s+=line(ax,ay,bx,by,{color:CD,w:3})+line(bx,by-6,bx,by+16,{color:CH,w:3});
  const u=clamp(tau*tau/(1+sh.k)),d=LN.r+u*(l0-2*LN.r),px=ax+ux*d+nx*(LN.r+2),py=ay+uy*d+ny*(LN.r+2);
  if(hiKey===key)s+=ring(px,py,LN.r+12,{color:CH,w:3,dash:'5 4'});
  if(key==='box'){const a=Math.atan2(uy,ux)*180/Math.PI;s+=`<g transform="translate(${(ax+ux*d).toFixed(1)} ${(ay+uy*d).toFixed(1)}) rotate(${a.toFixed(1)})">${rect(-LN.r,-2*LN.r,2*LN.r,2*LN.r,{fill:CR,fo:.35,stroke:CR,rx:4})}</g>`;}
  else {s+=sh.icon(px,py,LN.r);const rot=d/LN.r;s+=key==='ball'?'':line(px,py,px+LN.r*.8*Math.cos(rot),py+LN.r*.8*Math.sin(rot),{color:key==='ring'?CH:C.bg,w:3});}
  s+=label(sh.name,ax-6,ay-14,{size:22,color:CD,anchor:'start'});
 });
 return s;
}

// ---- skater (top view) --------------------------------------------------------------------------------------
function skaterTop(cx,cy,arm,phi,{g=1,force=0,fdir=1,handHi=0}={}){
 const c=Math.cos(phi),sn=Math.sin(phi),P=r=>[cx+r*c,cy-r*sn],Q=r=>[cx-r*c,cy+r*sn];
 const ang=-phi*180/Math.PI;
 let s=`<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${ang.toFixed(1)})"><ellipse cx="0" cy="0" rx="46" ry="26" fill="#2c3854" stroke="${C.ink}" stroke-width="3"/></g>`;
 const [ax,ay]=P(40),[hx,hy]=P(arm),[bx,by]=Q(40),[kx,ky]=Q(arm);
 s+=line(ax,ay,hx,hy,{color:C.ink,w:9})+line(bx,by,kx,ky,{color:C.ink,w:9});
 s+=dot(hx,hy,11,handHi?CH:C.ink)+dot(kx,ky,11,handHi?CH:C.ink);
 s+=ring(cx,cy,19,{color:C.ink,w:3,fill:'#3a4868'});
 if(force>0){const f=46*fdir;
  s+=fade(force,arrow(hx-c*14,hy+sn*14,hx-c*(14+f+ (fdir<0?0:0)),hy+sn*(14+f),{color:CF,w:6,head:15})+arrow(kx+c*14,ky-sn*14,kx+c*(14+f),ky-sn*(14+f),{color:CF,w:6,head:15}));}
 return fade(g,s);
}
// integrated rotation angle for a skater whose arm length follows armOf(p)
function spinAngle(p,armOf,w0=2.2,steps=80){let a=0;for(let i=0;i<steps;i++){const q=p*(i+.5)/steps,ar=armOf(q),I=1+(ar/150)**2*3;a+=w0*(4/I)/steps*p;}return a;}

// ---- bars ---------------------------------------------------------------------------------------------------
function bar(x,yb,w,hpx,color,{g=1,val='',lab='',vsize=26}={}){
 let s=rect(x,yb-hpx,w,hpx,{fill:color,fo:.55,stroke:color,rx:4});
 if(val)s+=L(val,x+w/2,yb-hpx-12,{size:vsize,color,weight:700});
 if(lab)s+=L(lab,x+w/2,yb+32,{size:22,color:CD});
 return fade(g,s);
}

export const ytUcRigid21Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const u=.05+.85*seg(p,.05,1)**2;
  let s=slope()+diskOnSlope(u).svg;
  s+=card(660,70,500,340,L('前回の 最後の 問い',910,120,{size:24,color:CD})
   +L('I が 求まった',910,190,{size:32,weight:700})
   +fade(seg(p,.3,.45),L('坂を 転がる 速さ',910,265,{size:30,color:CV,weight:700}))
   +fade(seg(p,.55,.7),L('スケーターの スピン',910,335,{size:30,color:CW,weight:700})),seg(p,.02,.12),CH);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=slope()+diskOnSlope(.9).svg;
  s+=card(660,70,500,340,L('どう 解き分ける？',910,125,{size:30,color:CH,weight:700})
   +fade(seg(p,.15,.3),L('エネルギー',910,215,{size:34,color:CE,weight:700}))
   +fade(seg(p,.35,.5),L('角運動量',910,305,{size:34,color:CL,weight:700}))
   +fade(seg(p,.35,.5),L('と',910,262,{size:26,color:CD})),1,CH);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=L('慣性モーメント・上級で 積分した I',600,60,{size:26,color:CD});
  const items=[['輪',ringIcon,`M${RR}^2`],['円板',diskIcon,`\\tfrac12 M${RR}^2`],['球',ballIcon,`\\tfrac25 M${RR}^2`]];
  items.forEach(([nm,ic,f],i)=>{const x=220+380*i,g=seg(p,.08+.22*i,.22+.22*i);
   s+=fade(g,ic(x,215,95)+L(nm,x,355,{size:28,weight:700})+T(`I=${f}`,x,435,{size:44}));});
  return s;
 },
 [K+'tools']:(p)=>{
  let s=card(80,70,500,360,L('道具 ①',330,120,{size:24,color:CD})+L('エネルギーの 保存',330,185,{size:34,color:CE,weight:700})
   +fade(seg(p,.55,.7),L('使える 条件',330,270,{size:24,color:CD})+L('熱に 逃げる 仕事 が ない',330,330,{size:28,weight:700})),seg(p,.02,.12),CE);
  s+=card(620,70,500,360,L('道具 ②',870,120,{size:24,color:CD})+L('角運動量の 保存',870,185,{size:34,color:CL,weight:700})
   +fade(seg(p,.6,.75),L('使える 条件',870,270,{size:24,color:CD})+L('外からの トルク が 0',870,330,{size:28,weight:700})),seg(p,.2,.32),CL);
  return s;
 },
 [K+'predict']:(p)=>{
  const armOf=q=>mix(150,70,seg(q,.1,.4)),arm=armOf(p),phi=spinAngle(p,armOf);
  let s=topNote()+skaterTop(260,270,arm,phi);
  s+=turnArc(260,270,185,.3,1.6,{color:CW,w:4})+T(WW,425,120,{size:34});
  s+=fade(seg(p,.35,.5),L('ω が 2倍',260,490,{size:28,color:CW,weight:700}));
  s+=L('回転の エネルギーは？',830,90,{size:30,color:CH,weight:700});
  ['同じ','2倍','4倍'].forEach((t,i)=>{const x=560+i*200;s+=card(x,170,170,120,L(t,x+85,245,{size:36,weight:700}),seg(p,.45+.1*i,.55+.1*i),CH);});
  return s;
 },

 // ===== S2 坂を転がる速さ =====
 [K+'slope']:(p)=>{
  const u=.03+.9*seg(p,.05,.85)**2;
  let s=slope();
  const {x1,y1,y2}=SLP;
  s+=line(x1-25,y1,x1-25,y2,{color:CR,w:3})+line(x1-35,y1,x1-15,y1,{color:CR,w:3})+line(x1-35,y2,x1-15,y2,{color:CR,w:3})+T(HH,x1-40,(y1+y2)/2+10,{size:34,anchor:'end'});
  s+=diskOnSlope(u).svg;
  const gE=seg(p,.35,.5),f=seg(p,.55,.75);
  s+=card(690,70,470,380,L('減った 位置エネルギー',925,115,{size:24,color:CD})
   +T(`M g ${HH}`,925,175,{size:40})
   +fade(gE,arrow(925,200,925,250,{color:CD,w:3,head:12}))
   +fade(gE,rect(760,270,330,46,{fill:CE,fo:.18,stroke:CE,rx:6})+rect(760,270,330*(1-f/3),46,{fill:CE,fo:.55,stroke:'none',rx:6})+rect(760+330*(1-f/3),270,330*f/3,46,{fill:CW,fo:.6,stroke:'none',rx:6}))
   +fade(f,L('並進',830,360,{size:26,color:CE,weight:700})+L('回転',1050,360,{size:26,color:CW,weight:700})+L('（円板）',925,410,{size:22,color:CD})),seg(p,.02,.12));
  return s;
 },
 [K+'eq']:(p)=>{
  const e=`M g ${HH}=${col(CE,'\\tfrac12 M')}${VV}^2+${col(CW,'\\tfrac12 I')}${WW}^2`;
  let s=T(e,600,170,{size:64});
  const W=texWidth(e,64,false),x0=600-W/2,wl=texWidth(`M g ${HH}=`,64,false),w1=texWidth(`\\tfrac12 M${VV}^2+`,64,false);
  s+=fade(seg(p,.1,.25),L('並進',x0+wl+w1*.42,265,{size:28,color:CE,weight:700})+L('回転',x0+wl+w1+(W-wl-w1)*.5,265,{size:28,color:CW,weight:700}));
  s+=fade(seg(p,.45,.6),card(250,330,700,120,L('分け方の 理由 → 次の 本（2/2）で 確かめる',600,382,{size:28,color:CH,weight:700})+L('今は 結果として 使う',600,425,{size:24,color:CD}),1,CH));
  return s;
 },
 [K+'nofric']:(p)=>{
  const gy=440,R=130,cx=300,cy=gy-R;
  let s=ground(40,620,gy)+wheel(cx,cy,R,.4*seg(p,0,1),{marker:0});
  s+=arrow(cx,cy,cx+120,cy,{color:CV,w:6,head:16})+T(VV,cx+138,cy+10,{size:32});
  s+=fade(seg(p,.1,.25),ring(cx,gy,20,{color:CH,w:4,dash:'5 4'})+L('速度 0',cx+20,gy+56,{size:24,color:CH,weight:700}));
  s+=fade(seg(p,.25,.4),arrow(cx+10,gy+8,cx-90,gy+8,{color:CF,w:6,head:15})+L('摩擦',cx-110,gy+56,{size:24,color:CF,weight:700}));
  s+=card(680,90,480,320,L('摩擦の 仕事',920,140,{size:26,color:CD})
   +fade(seg(p,.35,.5),L('＝ 力 × その点が 動いた 距離',920,205,{size:26}))
   +fade(seg(p,.5,.62),L('接地点は 止まっている',920,265,{size:28,color:CH,weight:700}))
   +fade(seg(p,.65,.78),L('→ 仕事 0、熱に 逃げない',920,335,{size:30,color:CF,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(`M g ${HH}=${KT}+${KR}`,600,90,{size:48});
  s+=fade(seg(p,.05,.2),card(330,135,540,115,L('滑らない 条件',470,200,{size:24,color:CD})+T(`${WW}=\\dfrac{${VV}}{${RR}}`,720,205,{size:38}),1,CH));
  s+=fade(seg(p,.35,.5),T(`M g ${HH}=${KT}+\\tfrac12 I\\dfrac{${VV}^2}{${RR}^2}`,600,345,{size:52}));
  const e=`M g ${HH}=${KT}+\\tfrac12 I\\dfrac{${VV}^2}{${RR}^2}`,W=texWidth(e,52,false),x0=600-W/2+texWidth(`M g ${HH}=${KT}+`,52,false);
  s+=highlight(x0-12,280,W-(x0-(600-W/2))+24,120,seg(p,.55,.7),CW);
  s+=fade(seg(p,.6,.75),L('回る 分',x0+(600+W/2-x0)/2,450,{size:26,color:CW,weight:700}));
  return s;
 },
 [K+'vform']:(p)=>{
  let s=L('½Mv² で くくる',600,50,{size:26,color:CD});
  s+=T(`M g ${HH}=${KT}\\left(1+${kk}\\right)`,600,150,{size:46});
  s+=fade(seg(p,.3,.45),L('両辺を ½M(1＋I/(MR²)) で 割る',600,265,{size:26,color:CD}));
  const e=`${VV}^2=\\dfrac{2g${HH}}{1+${kk}}`,W=texWidth(e,46,false);
  s+=fade(seg(p,.45,.6),T(e,600,420,{size:46})+highlight(600-W/2-24,306,W+48,202,1));
  return s;
 },
 [K+'kdef']:(p)=>{
  const e=`${VV}^2=\\dfrac{2g${HH}}{1+${kk}}`;
  let s=T(e,330,170,{size:56});
  const w=texWidth(kk,56,false);
  s+=fade(seg(p,.05,.2),arrow(400,262,400,292,{color:CH,w:3,head:12})+T(kk,400,395,{size:56})+highlight(400-w/2-20,298,w+40,170,1));
  s+=card(660,70,500,380,L('I/(MR²) の 意味',910,120,{size:26,color:CD})
   +fade(seg(p,.2,.35),L('質量が 軸から',910,195,{size:30,weight:700})+L('どれだけ 外に あるか',910,245,{size:30,color:CH,weight:700}))
   +fade(seg(p,.5,.65),ringIcon(820,350,55)+diskIcon(1000,350,55)+L('外に 多い',820,440,{size:22,color:CD})+L('内にも ある',1000,440,{size:22,color:CD})),seg(p,.02,.12));
  return s;
 },
 [K+'coef']:(p)=>{
  let s=L('I/(MR²) の 値',600,55,{size:28,color:CD});
  const y0=440,sc=180;
  ORDER.forEach((key,i)=>{const sh=SH[key],x=170+260*i,g=seg(p,[.32,.12,.2,.05][i],[.45,.25,.32,.17][i]);
   s+=fade(g,sh.icon(x,110,42)+L(sh.name,x,185,{size:26,weight:700})+(sh.k>0?rect(x-45,y0-sc*sh.k,90,sc*sh.k,{fill:CW,fo:.5,stroke:CW,rx:4}):line(x-45,y0,x+45,y0,{color:CW,w:4}))
    +T(sh.kt+(key==='ball'?'=0.4':''),x,y0-sc*sh.k-18,{size:34}));});
  s+=line(80,y0,1120,y0,{color:CD,w:2});
  return s;
 },
 [K+'race']:(p)=>{
  const tau=seg(p,.05,.95);
  let s=raceLanes(tau);
  s+=card(730,70,440,380,L('h ＝ 0.6 m、g ＝ 10 m/s²',950,120,{size:24,color:CD})
   +T(`2g${HH}=12`,950,190,{size:40})
   +fade(seg(p,.5,.65),T(`\\text{}\\ \\sqrt{12}\\approx 3.46${U('m/s')}`,1000,300,{size:36})+boxIcon(790,290,22)),seg(p,.02,.12));
  return s;
 },
 [K+'race2']:(p)=>{
  let s=raceLanes(1);
  const rows=[['ball','\\sqrt{12/1.4}\\approx 2.93'],['disk','\\sqrt{8}\\approx 2.83'],['ring','\\sqrt{6}\\approx 2.45']];
  let inner=boxIcon(790,120,20)+T(`\\sqrt{12}\\approx 3.46`,1000,130,{size:34});
  rows.forEach(([k,f],i)=>{const y=215+90*i;inner+=fade(seg(p,.05+.28*i,.18+.28*i),SH[k].icon(790,y-10,20)+T(f,1000,y,{size:34}));});
  inner+=L('（m/s）',1110,440,{size:22,color:CD});
  s+=card(730,70,440,390,inner);
  return s;
 },
 [K+'race3']:(p)=>{
  let s=raceLanes(1,{hiKey:p<.3?'ball':p<.55?'ring':''});
  s+=card(730,70,440,380,L('転がる 物の 中で',950,120,{size:24,color:CD})
   +L('1位 球',950,185,{size:32,color:CH,weight:700})+fade(seg(p,.2,.32),L('最下位 輪',950,250,{size:32,color:CW,weight:700}))
   +fade(seg(p,.55,.7),L('違いを 生むのは',950,330,{size:26})+L('回転に 取られる 割合',950,385,{size:30,color:CH,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'share']:(p)=>{
  let s=L('回転の 割合 ＝',420,105,{size:30,weight:700,anchor:'end'})+T(`\\dfrac{I/(M${RR}^2)}{1+I/(M${RR}^2)}`,560,100,{size:42});
  const x0=330,W=640,rows=[['ring','\\tfrac12',.5],['disk','\\tfrac13',1/3],['ball','\\tfrac27',2/7],['box','0',0]];
  rows.forEach(([k,f,fr],i)=>{const y=200+78*i,g=seg(p,.12+.14*i,.25+.14*i);
   s+=fade(g,SH[k].icon(x0-170,y+22,22)+L(SH[k].name,x0-75,y+32,{size:24,weight:700})
    +rect(x0,y,W*(1-fr),44,{fill:CE,fo:.55,stroke:CE,rx:4})+(fr>0?rect(x0+W*(1-fr),y,W*fr,44,{fill:CW,fo:.6,stroke:CW,rx:4}):'')
    +T(f,x0+W+50,y+34,{size:34}));});
  s+=fade(seg(p,.1,.2),L('並進',x0+120,186,{size:22,color:CE,weight:700})+L('回転',x0+W-60,186,{size:22,color:CW,weight:700}));
  return s;
 },
 [K+'Lnot']:(p)=>{
  // wheel on a slope going down to the right, angle 22°
  const th=22*Math.PI/180,ux=Math.cos(th),uy=Math.sin(th),nx=uy,ny=-ux;
  const ax=60,ay=150,R=110,sd=230+40*seg(p,0,1),bx=ax+ux*sd,by=ay+uy*sd,cx=bx+nx*R,cy=by+ny*R;
  let s=poly([[ax,ay],[ax+ux*620,ay+uy*620],[ax,ay+uy*620]],{fill:'#26324d',fo:.8,stroke:CD,sw:2});
  s+=wheel(cx,cy,R,sd/R,{marker:1,spokes:0});
  s+=fade(seg(p,.05,.2),arrow(bx,by,bx-ux*110,by-uy*110,{color:CF,w:6,head:15})+L('摩擦',bx-ux*110-10,by-uy*110+40,{size:24,color:CF,weight:700}));
  s+=fade(seg(p,.2,.35),arrow(cx,cy,cx,cy+95,{color:CD,w:4,head:13})+L('重力',cx+14,cy+60,{size:22,color:CD,anchor:'start'}));
  // clockwise torque arc (screen): math angles decreasing
  s+=turnArc(cx,cy,R+28,2.4,.9,{color:CW,w:5,g:seg(p,.35,.5)});
  s+=fade(seg(p,.4,.55),L('時計回りの トルク',cx+R+30,cy-R+20,{size:24,color:CW,weight:700,anchor:'start'}));//{size:24,color:CW,weight:700}));
  s+=card(720,120,440,280,L('角運動量 L',940,175,{size:26,color:CL,weight:700})
   +fade(seg(p,.5,.65),L('摩擦の トルクで',940,240,{size:28})+L('回転が 速まっていく',940,290,{size:28,weight:700}))
   +fade(seg(p,.7,.82),L('→ 保存 しない',940,360,{size:32,color:BAD,weight:700})),seg(p,.02,.12));
  return s;
 },

 // ===== S3 スケーター =====
 [K+'skater']:(p)=>{
  const armOf=q=>mix(150,70,seg(q,.4,.7)),arm=armOf(p),phi=spinAngle(p,armOf,3);
  let s=topNote()+skaterTop(330,270,arm,phi);
  s+=turnArc(330,270,190,.3,1.6,{color:CW,w:4});
  s+=card(720,110,440,280,fade(seg(p,.05,.2),L('腕を 広げて 回り 始める',940,180,{size:28}))
   +fade(seg(p,.4,.55),L('腕を 縮める',940,250,{size:30,color:CH,weight:700}))
   +fade(seg(p,.6,.75),L('→ ぐんと 速く 回る',940,320,{size:30,color:CW,weight:700})));
  return s;
 },
 [K+'noTorque']:(p)=>{
  // side view stick figure
  const ax=300,gy=455,top=60;
  let s=label('横から 見た 図',30,40,{size:22,color:CD});
  s+=line(80,gy,560,gy,{color:'#a8d8ff',w:5})+L('氷',520,gy+38,{size:22,color:CD});
  s+=line(ax,top,ax,gy,{color:CH,w:3,dash:'10 8'})+L('回転軸',ax+16,top+20,{size:22,color:CH,anchor:'start'});
  // body
  s+=ring(ax,120,28,{color:C.ink,w:4,fill:'#2c3854'})+line(ax,148,ax,290,{color:C.ink,w:9})+line(ax-90,185,ax+90,185,{color:C.ink,w:8})
   +line(ax,290,ax-8,445,{color:C.ink,w:8})+line(ax,290,ax+50,380,{color:C.ink,w:7})+line(ax+50,380,ax+20,410,{color:C.ink,w:7})+line(ax-40,450,ax+30,450,{color:CD,w:5});
  s+=fade(seg(p,.4,.55),dot(ax,240,8,CH)+arrow(ax+14,240,ax+14,350,{color:CF,w:6,head:15})+L('重力',ax+30,330,{size:24,color:CF,anchor:'start',weight:700}));
  s+=fade(seg(p,.55,.7),arrow(ax-14,gy,ax-14,gy-110,{color:CF,w:6,head:15})+L('床が 押す 力',ax-30,gy-60,{size:24,color:CF,anchor:'end',weight:700}));
  s+=card(660,90,500,340,fade(seg(p,.05,.2),L('氷は ほぼ 滑らか',910,150,{size:28})+L('→ 止める トルク ≈ 0',910,200,{size:28,weight:700}))
   +fade(seg(p,.6,.75),L('重力・床の 力は',910,285,{size:28})+L('回転軸の 上',910,335,{size:30,color:CH,weight:700})+L('→ トルク 0',910,390,{size:30,color:CF,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'dLdt']:(p)=>{
  let s=topNote()+skaterTop(260,280,150,.4+.6*p)+turnArc(260,280,185,.3,1.6,{color:CW,w:4})+outSym(260,470,22,CL)+T(`${LL}`,300,480,{size:30,anchor:'start'});
  s+=card(560,70,600,380,L('角運動量・上級',860,115,{size:24,color:CD})
   +T(`\\dfrac{d${col(CL,'\\mathbf{L}')}}{dt}=${col(CW,'\\mathbf{N}')}_{\\text{外}}`,860,205,{size:50})
   +fade(seg(p,.3,.45),L('外からの トルク ＝ 0',860,300,{size:28,weight:700}))
   +fade(seg(p,.55,.7),L('→ 𝐋 は 変わらない',860,375,{size:32,color:CL,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'LIw']:(p)=>{
  let s=topNote()+skaterTop(250,250,150,.5)+skaterTop(780,250,70,.9,{g:seg(p,.2,.35)});
  s+=fade(seg(p,.2,.35),arrow(470,250,560,250,{color:CD,w:4,head:14})+L('縮める',515,225,{size:22,color:CD}));
  s+=fade(seg(p,.02,.15),T(`I_1,\\ ${WW}_1`,250,450,{size:38}));
  s+=fade(seg(p,.25,.4),T(`I_2,\\ ${WW}_2`,780,450,{size:38}));
  s+=card(930,130,250,230,T(`${LL}=I${WW}`,1055,195,{size:38})+fade(seg(p,.55,.7),T(`I_1${WW}_1`,1055,265,{size:34})+T(`=I_2${WW}_2`,1055,320,{size:34})),seg(p,.02,.12),CL);
  return s;
 },
 [K+'num1']:(p)=>{
  let s=topNote()+skaterTop(250,250,150,.5+.3*p);
  s+=fade(.35,skaterTop(780,250,70,.9));
  s+=T(`I_1=4${U('kg\\cdot m^2')}`,250,440,{size:32})+fade(seg(p,.15,.3),T(`${WW}_1=3${U('rad/s')}`,250,490,{size:32}));
  s+=card(560,330,620,150,fade(seg(p,.45,.6),T(`${LL}=4\\times 3=12${U('kg\\cdot m^2/s')}`,870,410,{size:40})),seg(p,.4,.5),CL);
  return s;
 },
 [K+'num2']:(p)=>{
  let s=topNote()+fade(.35,skaterTop(250,250,150,.8))+skaterTop(780,250,70,.9+1.2*p);
  s+=fade(.5,T(`I_1=4,\\ ${WW}_1=3`,250,440,{size:30}));
  s+=T(`I_2=2${U('kg\\cdot m^2')}`,780,410,{size:32})+fade(seg(p,.2,.35),T(`${WW}_2=12\\div 2=6${U('rad/s')}`,780,465,{size:32}));
  s+=fade(seg(p,.55,.7),card(930,60,250,160,L('I 半分',1055,115,{size:28,weight:700})+L('ω 2倍',1055,175,{size:30,color:CW,weight:700}),1,CH));
  return s;
 },
 [K+'notw']:(p)=>{
  const yb=420,sc=22;
  let s=L('縮める 前 → 後',1010,120,{size:26,color:CD});
  s+=bar(170,yb,90,12*sc,CL,{val:'12',lab:'前'})+bar(290,yb,90,12*sc,CL,{val:'12',lab:'後'})+L('角運動量 L',275,yb+80,{size:28,color:CL,weight:700});
  s+=bar(560,yb,90,3*sc*2,CW,{val:'3',lab:'前'})+bar(680,yb,90,6*sc*2,CW,{val:'6',lab:'後',g:seg(p,.05,.2)})+L('角速度 ω',665,yb+80,{size:28,color:CW,weight:700});
  s+=fade(seg(p,.3,.45),ok(275,110)+L('保存',275,70,{size:28,color:CF,weight:700}));
  s+=fade(seg(p,.55,.7),ng(665,110)+L('変わる',665,70,{size:28,color:BAD,weight:700}));
  s+=line(120,yb,800,yb,{color:CD,w:2});
  s+=card(850,150,320,200,L('保存 するのは',1010,210,{size:26})+L('ω でなく L',1010,280,{size:34,color:CL,weight:700}),seg(p,.7,.82),CL);
  return s;
 },

 // ===== S4 エネルギーは増える =====
 [K+'K1']:(p)=>{
  let s=topNote()+skaterTop(220,250,150,.5)+skaterTop(560,250,70,.9);
  s+=arrow(380,250,440,250,{color:CD,w:4,head:14});
  s+=card(760,90,400,330,L('回転の エネルギー',960,145,{size:26,color:CD})+T(`${KK}=\\tfrac12 I${WW}^2`,960,235,{size:52})
   +fade(seg(p,.4,.55),L('縮める 前 と 後',960,330,{size:28,color:CH,weight:700})),seg(p,.02,.12),CE);
  return s;
 },
 [K+'K2']:(p)=>{
  const yb=440,sc=7;
  let s=T(`\\tfrac12\\times 4\\times 3^2=18${U('J')}`,330,80,{size:40})+fade(seg(p,.3,.45),T(`\\tfrac12\\times 2\\times 6^2=36${U('J')}`,870,80,{size:40}));
  s+=bar(270,yb,120,18*sc,CE,{val:'18 J',lab:'前'})+bar(810,yb,120,36*sc,CE,{val:'36 J',lab:'後',g:seg(p,.3,.45)});
  s+=line(120,yb,1080,yb,{color:CD,w:2});
  s+=fade(seg(p,.6,.75),card(450,200,300,130,L('4倍 ではなく',600,250,{size:26})+L('2倍',600,305,{size:40,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'KL']:(p)=>{
  let s=T(`${KK}=\\tfrac12 I${WW}^2`,600,90,{size:50});
  s+=fade(seg(p,.1,.25),card(380,145,440,90,T(`${LL}=I${WW}\\ \\Rightarrow\\ ${WW}=\\dfrac{${LL}}{I}`,600,200,{size:38}),1,CH));
  s+=fade(seg(p,.4,.55),T(`${KK}=\\tfrac12 I\\times\\dfrac{${LL}^2}{I^2}`,600,380,{size:58}));
  return s;
 },
 [K+'KL2']:(p)=>{
  const e=`${KK}=\\tfrac12 I\\times\\dfrac{${LL}^2}{I^2}`;
  let s=T(e,600,110,{size:54});
  const W=texWidth(e,54,false),x0=600-W/2,xi=x0+texWidth(`${KK}=\\tfrac12 `,54,false);
  s+=fade(seg(p,.05,.2),line(xi-4,128,xi+28,82,{color:BAD,w:4})+line(600+W/2-38,170,600+W/2-6,128,{color:BAD,w:4}));
  const e2=`${KK}=\\dfrac{${LL}^2}{2I}`,W2=texWidth(e2,64,false);
  s+=fade(seg(p,.25,.4),T(e2,600,300,{size:64})+highlight(600-W2/2-26,195,W2+52,175,1));
  s+=fade(seg(p,.6,.75),L('L が 同じ なら、I が 半分 → K は 2倍',600,440,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'KLcheck']:(p)=>{
  let s=T(`${KK}=\\dfrac{${LL}^2}{2I}`,600,90,{size:50});
  s+=fade(seg(p,.05,.2),T(`${LL}=12,\\ ${LL}^2=144`,600,190,{size:38}));
  s+=fade(seg(p,.25,.4),T(`I=4:\\ \\dfrac{144}{8}=18${U('J')}`,330,330,{size:42}));
  s+=fade(seg(p,.45,.6),T(`I=2:\\ \\dfrac{144}{4}=36${U('J')}`,870,330,{size:42}));
  s+=ok(330,440,seg(p,.65,.75))+ok(870,440,seg(p,.65,.75));
  return s;
 },
 [K+'where']:(p)=>{
  const yb=440,sc=7;
  let s=bar(270,yb,120,18*sc,CE,{val:'18 J',lab:'前'})+bar(810,yb,120,18*sc,CE,{val:'',lab:'後'});
  s+=fade(seg(p,.1,.25),rect(810,yb-36*sc,120,18*sc,{fill:CH,fo:.25,stroke:CH,rx:4})+L('＋18 J',870,yb-36*sc-14,{size:28,color:CH,weight:700})+L('？',870,yb-27*sc+12,{size:44,color:CH,weight:700}));
  s+=line(120,yb,1080,yb,{color:CD,w:2});
  s+=fade(seg(p,.5,.65),card(440,130,320,140,L('無から 生まれた',600,190,{size:26})+L('のではない',600,240,{size:30,color:BAD,weight:700}),1,BAD));
  return s;
 },
 [K+'work']:(p)=>{
  const ox=300,oy=270,armOf=q=>mix(220,120,clamp((q-.05)/.95)),a0=.35,wv=.5;
  const ang=q=>a0+spinAngle(q,armOf,wv),arm=armOf(p),phi=ang(p);
  let s=topNote();
  const path=Array.from({length:41},(_,i)=>{const q=i/40,a=ang(q),r=armOf(q);return [ox+r*Math.cos(a),oy-r*Math.sin(a)];});
  s+=draw(path,1,{color:C.faint,w:3,dash:'7 7'});
  s+=skaterTop(ox,oy,arm,phi,{handHi:1});
  const c=Math.cos(phi),sn=Math.sin(phi),hx=ox+arm*c,hy=oy-arm*sn,nx=-sn,ny=-c; // n: perpendicular (CCW side)
  s+=fade(seg(p,.15,.3),arrow(hx-c*16,hy+sn*16,hx-c*80,hy+sn*80,{color:CF,w:6,head:15})+L('筋肉の 力',hx-c*50-nx*40,hy+sn*50-ny*40+8,{size:22,color:CF,weight:700,anchor:'start'}));
  const q2=Math.min(1,p+.03),a2=ang(q2),r2=armOf(q2),x2=ox+r2*Math.cos(a2),y2=oy-r2*Math.sin(a2),d=Math.hypot(x2-hx,y2-hy)||1,mx=(x2-hx)/d,my=(y2-hy)/d;
  s+=fade(seg(p,.35,.5),arrow(hx+mx*16,hy+my*16,hx+mx*90,hy+my*90,{color:CV,w:5,head:14})+L('手の 動き',hx+mx*100+nx*20,hy+my*100+ny*20,{size:22,color:CV,weight:700,anchor:'start'}));
  s+=card(700,110,460,300,L('手は 内側へ 引かれ',930,170,{size:28})+L('内側へ 動く',930,220,{size:28})
   +fade(seg(p,.55,.7),L('力と 動きの 向きが そろう',930,295,{size:28,color:CH,weight:700})+L('→ 正の 仕事',930,355,{size:32,color:CF,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'Weq']:(p)=>{
  let s=L('重力・床の 力：仕事 0',600,70,{size:28,color:CD});
  s+=fade(seg(p,.15,.3),T(`W=\\Delta ${KK}`,600,170,{size:56}));
  s+=fade(seg(p,.4,.55),T(`=36-18=18${U('J')}`,600,280,{size:50}));
  s+=fade(seg(p,.65,.8),card(200,345,800,110,L('筋肉の 仕事 ＝ 回転の エネルギーの 増えた 分',600,410,{size:26,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'internal']:(p)=>{
  const bx=300,by=270,hx=560,hy=270;
  let s=L('体（軸の 近く）と 手',430,70,{size:24,color:CD});
  s+=ring(bx,by,45,{color:C.ink,w:3,fill:'#2c3854'})+dot(hx,hy,16,CH)+line(bx+45,by,hx-16,hy,{color:C.faint,w:2,dash:'6 6'});
  s+=fade(seg(p,.1,.25),arrow(hx-18,hy,hx-110,hy,{color:CF,w:6,head:15})+arrow(bx+48,by,bx+140,by,{color:CF,w:6,head:15})+L('引き合う 内力',430,by+60,{size:24,color:CF,weight:700}));
  s+=fade(seg(p,.25,.4),L('同じ 線の 上・逆向き・同じ 大きさ',430,by+110,{size:24,color:CD}));
  s+=card(720,110,440,300,L('内力の トルク',940,170,{size:28,color:CW,weight:700})
   +fade(seg(p,.4,.55),L('打ち消し 合う',940,240,{size:30,weight:700})+L('（角運動量・上級）',940,285,{size:22,color:CD}))
   +fade(seg(p,.65,.8),L('→ L は 変わらない',940,355,{size:30,color:CL,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'internal2']:(p)=>{
  const bx=300,by=270,d=mix(260,140,seg(p,.2,.7)),hx=bx+d,hy=270;
  let s=ring(bx,by,45,{color:C.ink,w:3,fill:'#2c3854'})+dot(hx,hy,16,CH);
  s+=arrow(hx-18,hy,hx-100,hy,{color:CF,w:6,head:15})+arrow(bx+48,by,bx+120,by,{color:CF,w:6,head:15,opacity:.6});
  s+=fade(seg(p,.2,.35),arrow(hx,hy-40,hx-70,hy-40,{color:CV,w:5,head:13})+L('手の 動き',hx-35,hy-62,{size:22,color:CV,weight:700}));
  s+=line(bx,by+70,hx,hy+70,{color:CR,w:3})+L('距離が 縮む',(bx+hx)/2,hy+110,{size:24,color:CR,weight:700});
  s+=card(720,110,440,300,L('内力の 仕事',940,170,{size:28,color:CE,weight:700})
   +fade(seg(p,.35,.5),L('打ち消し 合わない',940,240,{size:30,weight:700}))
   +fade(seg(p,.6,.75),L('近づく 向きに 引く',940,305,{size:26})+L('→ 仕事の 和 ＞ 0',940,360,{size:30,color:CF,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'reverse']:(p)=>{
  const ox=300,oy=280,armOf=q=>mix(130,220,seg(q,.1,.7)),arm=armOf(p),phi=.5+spinAngle(p,armOf,.5);
  let s=topNote()+skaterTop(ox,oy,arm,phi,{handHi:1});
  const c=Math.cos(phi),sn=Math.sin(phi),hx=ox+arm*c,hy=oy-arm*sn;
  s+=fade(seg(p,.2,.35),arrow(hx+c*16,hy-sn*16,hx+c*80,hy-sn*80,{color:CV,w:5,head:14}));
  s+=fade(seg(p,.3,.45),arrow(hx-c*16+sn*22,hy+sn*16+c*22,hx-c*80+sn*22,hy+sn*80+c*22,{color:CF,w:6,head:15}));
  s+=card(640,60,520,120,L('外へ 動く 手を 内向きに 支える',900,108,{size:26,weight:700})+L('→ 負の 仕事',900,155,{size:28,color:BAD,weight:700}),seg(p,.55,.7),CH);
  const yb=470,sc=6;
  s+=bar(760,yb,100,36*sc,CE,{val:'36 J',lab:'縮めた'})+bar(940,yb,100,18*sc,CE,{val:'18 J',lab:'広げた',g:seg(p,.4,.55)});
  return s;
 },
 [K+'cat']:(p)=>{
  // two halves of a body twisting opposite ways (schematic)
  const cx=330,cy=260,a=.6*Math.sin(p*Math.PI*1.2);
  const half=(x,ang,colr)=>`<g transform="translate(${x} ${cy}) rotate(${(ang*180/Math.PI).toFixed(1)})"><ellipse cx="0" cy="0" rx="70" ry="44" fill="${colr}" fill-opacity=".35" stroke="${C.ink}" stroke-width="3"/></g>`;
  let s=label('模式図',30,40,{size:22,color:CD});
  s+=half(cx-70,a,'#8fa6cf')+half(cx+70,-a,'#b49bff');
  s+=L('前半身',cx+70,cy+90,{size:22,color:CD})+L('後半身',cx-70,cy+90,{size:22,color:CD});
  s+=card(660,90,500,340,L('空中の 猫',910,145,{size:28,weight:700})
   +fade(seg(p,.2,.35),T(`${LL}=0`,910,225,{size:46}))
   +fade(seg(p,.4,.55),L('体の 形を 変えて 向きを 変える',910,305,{size:26}))
   +fade(seg(p,.6,.75),L('Iω 一定 だけでは 説明 できない',910,370,{size:26,color:CH,weight:700})),seg(p,.02,.12));
  return s;
 },

 // ===== S5 道具の選び方 =====
 ...(()=>{
  const table=(p,g1,g2,g3)=>{
   let s=L('',0,0);
   const x0=290,c1=620,c2=930,y0=70;
   s+=fade(g1,L('坂を 転がる',c1,y0+35,{size:28,color:CV,weight:700}))+fade(g2,L('スケーター',c2,y0+35,{size:28,color:CW,weight:700}));
   s+=L('エネルギー 保存',x0,y0+130,{size:28,color:CE,weight:700})+L('角運動量 保存',x0,y0+250,{size:28,color:CL,weight:700});
   s+=line(130,y0+65,1090,y0+65,{color:C.faint,w:2})+line(130,y0+190,1090,y0+190,{color:C.faint,w:2});
   s+=fade(g1,ok(c1-110,y0+140)+L('摩擦の 仕事 0',c1+30,y0+138,{size:24})+ng(c1-110,y0+262)+L('摩擦の トルク',c1+30,y0+258,{size:24}));
   s+=fade(g2,ng(c2-110,y0+142)+L('筋肉の 仕事',c2+30,y0+138,{size:24})+ok(c2-110,y0+260)+L('外の トルク 0',c2+30,y0+258,{size:24}));
   s+=fade(g3,card(170,y0+300,860,130,L('熱・内力の 仕事が なければ エネルギー',600,y0+352,{size:28,color:CE,weight:700})+L('外からの トルクが なければ 角運動量',600,y0+402,{size:28,color:CL,weight:700}),1,CH));
   return s;
  };
  return {
   [K+'sum1']:(p)=>table(p,seg(p,.05,.2),0,0),
   [K+'sum2']:(p)=>table(p,1,seg(p,.05,.2),0),
   [K+'sum3']:(p)=>table(p,1,1,seg(p,.1,.25)),
  };
 })(),
 [K+'back']:(p)=>{
  let s=L('冒頭の 予想',600,60,{size:26,color:CD});
  ['同じ','2倍','4倍'].forEach((t,i)=>{const x=210+i*280,isA=i===1;
   s+=card(x,110,220,130,L(t,x+110,192,{size:40,weight:700,color:isA?CH:C.ink}),1,isA?CH:C.faint);
   if(isA)s+=ok(x+110,290,seg(p,.1,.25));});
  s+=fade(seg(p,.4,.55),T(`${KK}=\\dfrac{${LL}^2}{2I}`,600,390,{size:50})+L('L 同じ・I 半分',880,395,{size:26,color:CH,weight:700,anchor:'start'}));
  return s;
 },
 [K+'next1']:(p)=>{
  const gy=440,R=120,cx=260+120*seg(p,0,1),cy=gy-R;
  let s=ground(40,700,gy)+wheel(cx,cy,R,(cx-260)/R,{marker:1});
  s+=fade(seg(p,.2,.35),arrow(cx,cy,cx+110,cy,{color:CV,w:6,head:16})+L('重心の 並進',cx+R+16,cy+8,{size:24,color:CV,weight:700,anchor:'start'}));
  s+=turnArc(cx,cy,R+26,2.3,.8,{color:CW,w:5,g:seg(p,.45,.6)});
  s+=fade(seg(p,.5,.65),L('重心まわりの 回転',cx-20,cy-R-50,{size:24,color:CW,weight:700}));
  s+=card(760,140,400,200,T(`\\tfrac12 M${VV}^2+\\tfrac12 I${WW}^2`,960,245,{size:40}),seg(p,.6,.75),CE);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(170,90,860,300,L('次の 問い',600,145,{size:26,color:CD})
   +T(`\\tfrac12 M${VV}^2+\\tfrac12 I${WW}^2`,600,235,{size:46})
   +fade(seg(p,.2,.35),L('この 分け方は、なぜ 許される？',600,330,{size:36,color:CH,weight:700})),seg(p,0,.12),CH);
  return s;
 },
};
