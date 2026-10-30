// YouTube シリーズ 単振動・中級 1/1（ステージ um-pendulum 本0〜本3）— 図。Stage 1200×515.
// 色：θ 橙、糸の長さ l・弧 s 水色、力（mg と成分）緑、糸の力 深緑、加速度 赤、ω 桃、周期 T 金、強調 黄、差・誤り 赤。
// 振り子の描き方は 単振動・初級（ui-pendulum-1）と同じ（右へ振れる向きが正、重力の分解）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth} from './anim.mjs';

const K='um-pendulum-1:';
const CTH=C.E,CL=C.x,CW=C.p,CT=C.t,CR='#4f9f80',CD=C.a;
const TH=`{\\color{${CTH}}\\theta}`,LL=`{\\color{${CL}}l}`,WW=`{\\color{${CW}}\\omega}`,TT=`{\\color{${CT}}T}`;
const DDT=`\\dfrac{d^2${TH}}{dt^2}`,DDTa=`{\\color{${C.a}}${LL}\\,\\dfrac{d^2${TH}}{dt^2}}`;
const SIN=`\\sin${TH}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const TAU=2*Math.PI;

// ---- pendulum. th [rad], right positive. -------------------------------------------------------
function pend(th,{cx=380,py=40,Lp=250,g=1,R=24,path=1,vert=1,grav=0,split=0,tens=0,tanHi=1,radHi=1,G=170,mtext='m',ceil=1,thMax=.62,
  lLab=0,thPivot=0,thBob=0,plusDir=0,tanLab='',radLab='',arcHi=0,bobColor=C.x,bobFill='#123049'}={}){
 const sn=Math.sin(th),cs=Math.cos(th),bx=cx+Lp*sn,by=py+Lp*cs;
 let s='';
 if(ceil){s+=line(cx-90,py,cx+90,py,{color:C.dim,w:4});for(let q=cx-86;q<cx+90;q+=20)s+=line(q,py,q+12,py-14,{color:C.faint,w:2});}
 if(vert)s+=fade(vert,line(cx,py,cx,py+Lp+40,{color:C.faint,w:2,dash:'7 7'}));
 if(path)s+=fade(path,draw(Array.from({length:41},(_,i)=>{const a=-thMax+2*thMax*i/40;return [cx+Lp*Math.sin(a),py+Lp*Math.cos(a)];}),1,{color:C.faint,w:2,dash:'5 8'}));
 if(arcHi&&Math.abs(th)>.02){
  const n=30,pts=Array.from({length:n+1},(_,i)=>{const a=th*i/n;return [cx+Lp*Math.sin(a),py+Lp*Math.cos(a)];});
  s+=fade(arcHi,draw(pts,1,{color:CL,w:7}));
 }
 s+=line(cx,py,bx,by,{color:lLab?CL:C.ink,w:3})+dot(cx,py,7,C.dim);
 if(lLab)s+=fade(lLab,T(LL,cx+Lp*.62*sn+22,py+Lp*.62*cs-4,34,{auto:false}));
 if(thPivot&&Math.abs(th)>.02){
  const r=70,n=20,pts=Array.from({length:n+1},(_,i)=>{const a=th*i/n;return [cx+r*Math.sin(a),py+r*Math.cos(a)];});
  s+=fade(thPivot,draw(pts,1,{color:CTH,w:4})+T(TH,cx+(r+26)*Math.sin(th/2),py+(r+26)*Math.cos(th/2)+10,30,{auto:false}));
 }
 s+=ring(bx,by,R,{color:bobColor,w:3,fill:bobFill})+(mtext?label(mtext,bx,by+8,{size:22,color:C.ink,anchor:'middle'}):'');
 // gravity and its components
 const ga=grav*(split?mix(1,.45,split):1);
 if(grav)s+=fade(ga,arrow(bx,by+R,bx,by+G,{color:C.F,w:6,head:18}))+fade(grav,label('mg',bx+14,by+G-4,{size:26,color:C.F,weight:700}));
 const rx=G*cs*sn,ry=G*cs*cs,tx=-G*sn*cs,ty=G*sn*sn;
 if(split){
  s+=fade(split*.8,line(bx+rx,by+ry,bx,by+G,{color:C.F,w:2,dash:'6 6'})+line(bx+tx,by+ty,bx,by+G,{color:C.F,w:2,dash:'6 6'}));
  s+=fade(split*radHi,arrow(bx,by,bx+rx,by+ry,{color:CR,w:6,head:16})+(radLab?label(radLab,bx+rx+14,by+ry+6,{size:24,color:CR,weight:700}):''));
  if(Math.abs(sn)>.03)s+=fade(split*tanHi,arrow(bx,by,bx+tx,by+ty,{color:C.F,w:7,head:20})+(tanLab?label(tanLab,bx+tx+(tx<0?-12:12),by+ty+(tx<0?-10:-10),{size:26,color:C.F,anchor:tx<0?'end':'start',weight:700}):''));
 }
 if(thBob&&Math.abs(th)>.02){
  // angle between gravity (down) and the string direction (outward), at the bob
  const r=62,a0=Math.PI/2-th,n=16,pts=Array.from({length:n+1},(_,i)=>{const a=a0+th*i/n;return [bx+r*Math.cos(a),by+r*Math.sin(a)];});
  const am=a0+th/2;
  s+=fade(thBob,draw(pts,1,{color:CTH,w:4})+T(TH,bx+(r+22)*Math.cos(am),by+(r+22)*Math.sin(am)+10,28,{auto:false}));
 }
 if(tens){const Tl=G*cs*.95;s+=fade(tens,arrow(bx-R*sn,by-R*cs,bx-Tl*sn,by-Tl*cs,{color:CR,w:6,head:16})+label('糸の力',bx-Tl*sn+(sn>=0?-18:18),by-Tl*cs+34,{size:24,color:CR,anchor:sn>=0?'end':'start',weight:700}));}
 if(plusDir){
  const r=Lp+40,a1=th+.08,a2=th+.36,n=12,pts=Array.from({length:n+1},(_,i)=>{const a=a1+(a2-a1)*i/n;return [cx+r*Math.sin(a),py+r*Math.cos(a)];});
  s+=fade(plusDir,draw(pts.slice(0,n-1),1,{color:C.hi,w:4})+arrow(pts[n-2][0],pts[n-2][1],pts[n][0],pts[n][1],{color:C.hi,w:4,head:14})
   +label('＋',pts[n][0]+14,pts[n][1]+2,{size:30,color:C.hi,weight:700}));
 }
 return fade(g,s);
}
const bobXY=(th,{cx=380,py=40,Lp=250}={})=>[cx+Lp*Math.sin(th),py+Lp*Math.cos(th)];
const TH30=Math.PI/6;

// ---- true pendulum vs small-angle solution (θ0 = 30°, l = 1 m, g = 9.8), RK4 ------------------------
const W0=Math.sqrt(9.8),DT=.002,NT=4200; // 8.4 s
const TRUE=(()=>{let th=TH30,om=0;const out=[th];const f=(a)=>-9.8*Math.sin(a);
 for(let i=0;i<NT;i++){const k1t=om,k1o=f(th),k2t=om+DT/2*k1o,k2o=f(th+DT/2*k1t),k3t=om+DT/2*k2o,k3o=f(th+DT/2*k2t),k4t=om+DT*k3o,k4o=f(th+DT*k3t);
  th+=DT/6*(k1t+2*k2t+2*k3t+k4t);om+=DT/6*(k1o+2*k2o+2*k3o+k4o);out.push(th);}return out;})();
const trueAt=t=>TRUE[clamp(Math.round(t/DT),0,NT)];
const approxAt=t=>TH30*Math.cos(W0*t);

// ---- sin θ vs θ graph ---------------------------------------------------------------------------------
function sinGraph({g=1,lin=1,x=90,y=455,w=520,h=390,xmax=1.6,ymax=1.6,ticks=[.5,1,1.5]}={}){
 const A=axes({x,y,w,h,xmin:0,xmax,ymin:0,ymax,xlabel:'θ [rad]',ylabel:'',xticks:ticks,yticks:ticks,grid:true,g,xcolor:CTH});
 let s=A.svg+A.plot(Math.sin,{color:C.F,w:4.5});
 s+=fade(lin*g,A.plot(u=>u,{from:0,to:Math.min(xmax,ymax),color:C.hi,w:3.5,dash:'10 7'}));
 return {A,svg:s};
}

// a row of TeX pieces placed left to right, centred as a whole at cx; gs[i] = visibility of piece i
const GAP=18;
function chain(parts,cx,y,size,gs){
 const ws=parts.map(q=>texWidth(q,size,false)),W=ws.reduce((a,b)=>a+b,0)+GAP*(parts.length-1);let x=cx-W/2,out='';
 parts.forEach((q,i)=>{out+=fade(gs[i]??1,T(q,x,y,size,{auto:false,anchor:'start'}));x+=ws[i]+GAP;});return out;
}
// swinging helper: amplitude a, cycles over p
const swing=(p,a=.45,cyc=1.3)=>a*Math.cos(TAU*cyc*p);

export const ytUmPendulum1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=card(50,50,520,360,label('前回：回転の勢い',310,100,{size:28,color:C.dim,anchor:'middle'}),1);
  const ox=180,oy=330,ang=.5+.9*seg(p,.05,.5),R=170,px=ox+R*Math.cos(ang),py=oy-R*Math.sin(ang);
  s+=dot(ox,oy,7,C.dim)+label('O',ox-30,oy+8,{size:24,color:C.dim});
  s+=arrow(ox,oy,px,py,{color:C.x,w:5,head:16})+label('𝐫',(ox+px)/2-26,(oy+py)/2,{size:28,color:C.x,weight:700});
  s+=arrow(px,py,px-80*Math.sin(ang),py-80*Math.cos(ang),{color:C.p,w:5,head:16})+label('𝐩',px-80*Math.sin(ang)-8,py-80*Math.cos(ang)-12,{size:28,color:C.p,weight:700,anchor:'end'});
  s+=T('\\mathbf{L}=\\mathbf{r}\\times\\mathbf{p}',430,370,34,{auto:false});
  s+=fade(seg(p,.5,.65),pend(.5,{cx:870,py:60,Lp:260,grav:1,tens:1,G:150,path:1})
   +label('振り子の 運動方程式 は？',870,475,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lastq']:(p)=>{
  const th=.5,[bx,by]=bobXY(th,{cx:420,py:40,Lp:260});
  let s=pend(th,{cx:420,Lp:260,grav:seg(p,.1,.25),tens:seg(p,.25,.4),G:150});
  // tangent direction (dashed, with ?)
  const ux=Math.cos(th),uy=-Math.sin(th),gq=seg(p,.5,.7);
  s+=fade(gq,line(bx-110*ux,by-110*uy,bx+110*ux,by+110*uy,{color:C.hi,w:3,dash:'8 8'})+label('円弧に 沿う向き',bx+120*ux+10,by+120*uy-4,{size:26,color:C.hi,weight:700}));
  s+=card(760,300,400,120,label('この向きの 式は？',960,372,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
  [K+'promise']:(p)=>{
  let s=card(80,30,1040,215,label('初級で 導かずに 使った式',600,72,{size:26,color:C.dim,anchor:'middle'})
   +T(`${TT}\\approx2\\pi\\sqrt{\\dfrac{L}{g}}`,600,190,44,{auto:false}),seg(p,0,.15));
  s+=card(80,275,1040,175,label('初級で 式に しなかったこと',600,322,{size:26,color:C.dim,anchor:'middle'})
   +label('戻す力 は ずれに ほぼ 比例',600,400,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65));
  s+=fade(seg(p,.25,.4),label('→ 今回 導く',1000,190,{size:26,color:C.hi,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),label('→ 今回 式に',1000,420,{size:26,color:C.hi,weight:700,anchor:'middle'}));
  return s;
 },

  [K+'ask']:(p)=>{
  const th=swing(p,.45,1.3);
  let s=pend(th,{cx:300,py:40,Lp:300,thMax:.5,mtext:''});
  s+=card(610,60,540,380,label('振り子の 周期',880,110,{size:30,color:C.ink,anchor:'middle'})
   +T(`${TT}=2\\pi\\sqrt{\\dfrac{${LL}}{g}}`,880,245,48,{auto:false})
   +fade(seg(p,.35,.5),label('どう 導かれ、',880,340,{size:32,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('どこまで 正しい？',880,395,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },

 [K+'plan']:(p)=>{
  let s='';
  const items=[['① 力を 成分に 分ける（内積の 影）',C.F],['② 接線方向に ma ＝ F',C.a],['③ 近似 sinθ ≈ θ（近似の 回）',C.hi]];
  items.forEach(([t,c],i)=>{s+=card(170,50+i*140,860,110,label(t,600,118+i*140,{size:34,color:c,anchor:'middle',weight:700}),seg(p,.25+.22*i,.37+.22*i),c);});
  return s;
 },

 // ===== S2 重力を二つの向きに分ける =====
 [K+'setup']:(p)=>{
  const th=TH30*seg(p,.05,.3);
  let s=pend(th,{lLab:seg(p,.05,.2),thPivot:seg(p,.3,.45),plusDir:seg(p,.6,.75),path:1});
  s+=card(720,70,440,300,T(LL,775,132,36,{auto:false})+label('：糸の 長さ',790,140,{size:30,color:CL,weight:700})
   +label('m：おもりの 質量',760,200,{size:30,color:C.ink,weight:700})
   +fade(seg(p,.3,.45),label('θ：真下から 測った 振れ角',760,260,{size:28,color:CTH,weight:700}))
   +fade(seg(p,.6,.75),label('右へ 振れる 向きが ＋',760,320,{size:28,color:C.hi,weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'setup2']:(p)=>{
  let s=pend(TH30,{lLab:1,thPivot:1});
  s+=card(660,60,500,190,T(LL,720,135,48,{auto:false})+label('＝ 糸の 長さ（小文字）',750,145,{size:28,color:CL,weight:700})
   +T('\\mathbf{L}',720,210,44,{auto:false})+label('＝ 前回の 回転の勢い（別もの）',750,220,{size:26,color:C.dim}),seg(p,0,.2));
  s+=card(660,290,500,130,label('θ は ラジアン で 測る',910,340,{size:30,color:CTH,anchor:'middle',weight:700})+label('30° ＝ 約 0.52 rad',910,395,{size:28,color:C.ink,anchor:'middle'}),seg(p,.55,.7),CTH);
  return s;
 },
 [K+'forces']:(p)=>{
  let s=pend(TH30,{tens:seg(p,.15,.35),grav:seg(p,.5,.7)});
  s+=card(720,120,440,200,fade(seg(p,.15,.35),label('糸の力（支点の方へ）',760,190,{size:28,color:CR,weight:700}))
   +fade(seg(p,.5,.7),label('重力 mg（真下向き）',760,260,{size:28,color:C.F,weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'split']:(p)=>{
  let s=pend(TH30,{grav:1,split:seg(p,.35,.7),tanLab:'',radLab:''});
  s+=card(720,70,440,300,label('内積の 回の 影',940,130,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.75),label('糸の 方向 へ の 影',760,210,{size:28,color:CR,weight:700}))
   +fade(seg(p,.65,.85),label('接線の 方向 へ の 影',760,280,{size:28,color:C.F,weight:700}))
   +fade(seg(p,.75,.9),label('二つを 足すと 元の mg',760,340,{size:24,color:C.dim})),seg(p,.05,.2));
  return s;
 },
 [K+'angle']:(p)=>{
  let s=pend(TH30,{grav:1,split:1,thPivot:seg(p,.05,.25),thBob:seg(p,.45,.65)});
  // extend the string line below the bob (dotted) so the angle at the bob reads clearly
  const [bx,by]=bobXY(TH30),sn=Math.sin(TH30),cs=Math.cos(TH30);
  s+=fade(seg(p,.3,.45),line(bx,by,bx+200*sn,by+200*cs,{color:CR,w:2,dash:'3 7'}));
  s+=card(720,110,440,220,label('糸は 真下から θ 傾く',940,180,{size:28,color:CTH,anchor:'middle',weight:700})
   +fade(seg(p,.45,.65),label('→ mg と 糸の 方向の 間も θ',940,260,{size:26,color:CTH,anchor:'middle',weight:700})),seg(p,.05,.2),CTH);
  return s;
 },
 [K+'angle2']:(p)=>{
  let s=pend(TH30,{grav:1,split:1,thBob:1,tanLab:seg(p,.15,.3)>0?'mg sinθ':'',radLab:seg(p,.5,.65)>0?'mg cosθ':''});
  s+=card(720,90,440,280,label('θ の 向かい側 → sin',940,150,{size:28,color:C.F,anchor:'middle',weight:700})
   +T(`mg\\,${SIN}`,940,215,44,{auto:false,color:C.F})
   +fade(seg(p,.5,.65),label('θ の となり → cos',940,285,{size:28,color:CR,anchor:'middle',weight:700})+T(`mg\\cos${TH}`,940,345,40,{auto:false,color:CR})),seg(p,.1,.25),C.F);
  return s;
 },
 [K+'sign']:(p)=>{
  let s=pend(TH30,{grav:1,split:1,radHi:.3,plusDir:1,tanLab:'戻す向き'});
  s+=card(720,90,440,280,label('＋ は θ が 増える 向き',940,150,{size:28,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('接線成分 は 逆向き',940,215,{size:28,color:C.F,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.7),label('接線方向の 力',940,275,{size:26,color:C.F,anchor:'middle'})+T(`-mg\\,${SIN}`,940,340,48,{auto:false,color:C.F})),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'num']:(p)=>{
  let s=pend(TH30,{grav:1,split:1,radHi:.3,mtext:'',thPivot:1,tanLab:seg(p,.6,.75)>0?'4.9 N':''});
  s+=card(680,60,490,380,label('1 kg、θ ＝ 30°',925,115,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),T('mg=1\\times9.8=9.8\\ \\mathrm{N}',925,185,34,{auto:false,color:C.F}))
   +fade(seg(p,.3,.45),T('\\sin30^\\circ=0.5',925,255,34,{auto:false}))
   +fade(seg(p,.45,.6),T('9.8\\times0.5=4.9\\ \\mathrm{N}',925,330,38,{auto:false,color:C.F}))
   +fade(seg(p,.6,.75),label('mg の 半分が 戻す力',925,405,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.15));
  return s;
 },
 [K+'tension']:(p)=>{
  const [bx,by]=bobXY(TH30),sn=Math.sin(TH30),cs=Math.cos(TH30);
  let s=pend(TH30,{grav:.4,split:0,tens:1,path:1});
  // tangent line and right-angle mark
  const tx=cs,ty=-sn,ux=-sn,uy=-cs,q=22;
  s+=fade(seg(p,.1,.3),line(bx-130*tx,by-130*ty,bx+130*tx,by+130*ty,{color:C.hi,w:3,dash:'8 8'})+label('接線',bx+140*tx+8,by+140*ty,{size:26,color:C.hi,weight:700}));
  const ox=bx+30*ux,oy=by+30*uy;
  s+=fade(seg(p,.25,.4),draw([[ox+q*tx,oy+q*ty],[ox+q*tx+q*ux,oy+q*ty+q*uy],[ox+q*ux,oy+q*uy]],1,{color:C.hi,w:3}));
  s+=card(720,110,440,220,label('糸の力 ⟂ 接線',940,180,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('接線方向の 成分 ＝ 0',940,245,{size:30,color:CR,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('→ 円弧に 沿う 式に 入らない',940,300,{size:26,color:C.ink,anchor:'middle'})),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'tension2']:(p)=>{
  let s=pend(TH30,{grav:1,split:1,tens:.35,radHi:.35});
  s+=card(700,70,470,150,label('糸の 方向',935,125,{size:28,color:CR,anchor:'middle',weight:700})+label('糸の力の 大きさ → 上級',935,185,{size:28,color:C.dim,anchor:'middle'}),seg(p,.05,.2),CR);
  s+=card(700,260,470,150,label('接線の 方向',935,315,{size:28,color:C.F,anchor:'middle',weight:700})+label('今回 使うのは こちら だけ',935,375,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.F);
  return s;
 },

 // ===== S3 接線方向の運動方程式 =====
 [K+'arc']:(p)=>{
  const th=TH30;
  let s=pend(th,{lLab:1,thPivot:1,arcHi:seg(p,.35,.6),mtext:''});
  const Lp=250,cx=380,py=40,am=th/2;
  s+=fade(seg(p,.5,.65),label('s',cx+(Lp+30)*Math.sin(am),py+(Lp+30)*Math.cos(am)+12,{size:32,color:CL,weight:700}));
  s+=card(720,90,440,280,label('円弧の 長さ ＝ 半径 × 角度',940,150,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.7),T(`{\\color{${CL}}s}=${LL}\\,${TH}`,940,240,60,{auto:false}))
   +fade(seg(p,.7,.85),label('θ が ラジアン のとき',940,325,{size:28,color:CTH,anchor:'middle',weight:700})),seg(p,.05,.2),CL);
  return s;
 },
 [K+'d1']:(p)=>{
  let s=card(120,40,960,420,'',1);
  s+=T(`{\\color{${CL}}s}=${LL}\\,${TH}`,600,110,52,{auto:false});
  s+=fade(seg(p,.25,.4),arrow(600,140,600,190,{color:C.dim,w:3,head:12})+label('時間で 1回 微分',630,175,{size:24,color:C.dim}));
  s+=fade(seg(p,.35,.55),T(`\\dfrac{d{\\color{${CL}}s}}{dt}=${LL}\\,\\dfrac{d${TH}}{dt}`,600,265,52,{auto:false}));
  s+=fade(seg(p,.6,.75),label('円弧に 沿う 速度',600,360,{size:30,color:C.v,anchor:'middle',weight:700})+label('（l は 一定 なので 前に 出た まま）',600,410,{size:26,color:CL,anchor:'middle'}));
  return s;
 },
 [K+'d2']:(p)=>{
  let s=card(120,40,960,420,'',1);
  s+=T(`\\dfrac{d{\\color{${CL}}s}}{dt}=${LL}\\,\\dfrac{d${TH}}{dt}`,600,115,48,{auto:false});
  s+=fade(seg(p,.15,.3),arrow(600,160,600,210,{color:C.dim,w:3,head:12})+label('もう 1回 微分',630,195,{size:24,color:C.dim}));
  s+=fade(seg(p,.3,.5),T(`\\dfrac{d^2{\\color{${CL}}s}}{dt^2}=${DDTa}`,600,290,52,{auto:false}));
  s+=fade(seg(p,.6,.75),label('接線方向の 加速度',600,405,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eom']:(p)=>{
  let s=pend(TH30,{cx:220,py:40,Lp:230,grav:1,split:1,radHi:.25,G:150,mtext:''});
  s+=card(440,60,730,380,'',1);
  s+=T(`m\\times${DDTa}=${`{\\color{${C.F}}-mg\\,${SIN}}`}`,805,200,50,{auto:false});
  s+=fade(seg(p,.1,.3),label('質量 × 加速度',640,300,{size:26,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.45),label('接線方向の 力',990,300,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('振り子の 運動方程式',805,395,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cancel']:(p)=>{
  const cn=seg(p,.6,.75);
  const mL=cn>.5?`{\\color{${C.a}}\\cancel{\\color{${C.ink}}m}}`:'m';
  let s=card(80,50,1040,400,'',1);
  s+=T(`${mL}\\,${DDTa}=-${mL}g\\,${SIN}`,600,190,56,{auto:false});
  s+=fade(seg(p,.1,.25),label('動かしにくさ の m',360,300,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('重力の 強さ の m',820,300,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('両辺を m で 割る → 打ち消し合う',600,390,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
  [K+'cancel2']:(p)=>{
  let s=card(80,30,1040,430,'',1);
  s+=T(`${DDTa}=-g\\,${SIN}`,600,140,48,{auto:false});
  s+=fade(seg(p,.1,.3),label('両辺を l で 割る',600,235,{size:28,color:CL,anchor:'middle'}));
  const f=`${DDT}=-\\dfrac{g}{${LL}}\\,${SIN}`,w=texWidth(f,54,false);
  s+=fade(seg(p,.3,.5),T(f,600,370,54,{auto:false}));
  s+=fade(seg(p,.55,.7),highlight(600-w/2-30,275,w+60,140,1));
  return s;
 },

 [K+'mass']:(p)=>{
  const th=swing(p,.4,1.4);
  let s=pend(th,{cx:230,py:40,Lp:260,mtext:'1 kg',R:26,thMax:.45});
  s+=pend(th,{cx:620,py:40,Lp:260,mtext:'5 kg',R:40,thMax:.45,bobFill:'#1d4d6e'});
  s+=card(860,110,310,260,label('同じ 長さ',1015,165,{size:28,color:CL,anchor:'middle',weight:700})
   +label('重さが 違っても',1015,225,{size:28,color:C.ink,anchor:'middle'})+label('同じ リズム',1015,285,{size:32,color:C.hi,anchor:'middle',weight:700})
   +label('式に m が ない',1015,340,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
  [K+'problem']:(p)=>{
  const f1=`${DDT}=-\\dfrac{g}{${LL}}\\,${SIN}`,f2=`\\dfrac{d^2x}{dt^2}=-${WW}^2x`,w1=texWidth(f1,46,false),w2=texWidth(f2,46,false);
  const p1=texWidth(SIN,46,false),p2=texWidth('x',46,false);
  let s=card(60,60,520,300,label('振り子',320,110,{size:28,color:C.dim,anchor:'middle'})+T(f1,320,235,46,{auto:false}),1);
  s+=card(620,60,520,300,label('振動の 方程式（ばね）',880,110,{size:28,color:C.dim,anchor:'middle'})+T(f2,880,235,46,{auto:false}),seg(p,.25,.4));
  s+=fade(seg(p,.45,.6),highlight(320+w1/2-p1-8,188,p1+16,66,1,CD)+highlight(880+w2/2-p2-6,188,p2+12,66,1,CD));
  s+=fade(seg(p,.6,.75),label('sinθ と x … 形が 違う',600,430,{size:32,color:CD,anchor:'middle',weight:700}));
  return s;
 },


 // ===== S4 小さな振れで近似する =====
 [K+'small']:(p)=>{
  const {A,svg}=sinGraph({g:seg(p,0,.2),lin:seg(p,.3,.5)});
  let s=svg;
  s+=fade(seg(p,.1,.25),label('sinθ',A.X(1.45),A.Y(Math.sin(1.45))+40,{size:28,color:C.F,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),label('傾き 1 の 直線 θ',A.X(1.05)-20,A.Y(1.2),{size:26,color:C.hi,weight:700,anchor:'end'}));
  s+=fade(seg(p,.55,.7),highlight(A.X(0)-10,A.Y(.35),A.X(.35)-A.X(0)+20,A.Y(0)-A.Y(.35)+10,1,C.hi));
  s+=card(700,90,460,280,label('0 の 近くでは',930,150,{size:28,color:C.ink,anchor:'middle'})
   +T(`${SIN}\\approx${TH}`,930,235,56,{auto:false})
   +label('（近似・中級 1/2）',930,320,{size:24,color:C.dim,anchor:'middle'}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'radian']:(p)=>{
  let s=card(80,50,1040,170,label('傾きが ちょうど 1 ＝ θ を ラジアン で 測るとき',600,105,{size:30,color:CTH,anchor:'middle',weight:700})
   +T(`\\sin(0.1)=0.0998\\approx0.1`,600,175,40,{auto:false}),seg(p,0,.2),CTH);
  s+=card(80,260,1040,180,label('度 の ままでは 使えない',600,315,{size:30,color:CD,anchor:'middle',weight:700})
   +T(`\\sin30^\\circ=0.5`,420,390,38,{auto:false})+label('≠',600,400,{size:40,color:CD,anchor:'middle',weight:700})+label('30',760,400,{size:38,color:C.ink,anchor:'middle'}),seg(p,.5,.65),CD);
  s+=ng(880,400,seg(p,.65,.8));
  return s;
 },
 [K+'replace']:(p)=>{
  const k=seg(p,.2,.45);
  let s=card(80,40,1040,420,'',1);
  s+=fade(1-k,T(`${DDT}=-\\dfrac{g}{${LL}}\\,${SIN}`,600,150,54,{auto:false}));
  s+=fade(k,T(`${DDT}=-\\dfrac{g}{${LL}}\\,${TH}`,600,150,54,{auto:false}));
  s+=fade(seg(p,.2,.35)*(1-seg(p,.5,.6)),label('sinθ → θ',860,95,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.55,.75),T(`\\dfrac{d^2x}{dt^2}=-${WW}^2x`,600,330,54,{auto:false})+label('振動の 方程式',600,420,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),label('同じ 形',960,250,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
  [K+'map']:(p)=>{
  let s=card(60,40,520,250,label('振り子（小さな 振れ）',320,85,{size:26,color:C.dim,anchor:'middle'})+T(`${DDT}=-\\dfrac{g}{${LL}}\\,${TH}`,320,200,44,{auto:false}),1);
  s+=card(620,40,520,250,label('振動の 方程式',880,85,{size:26,color:C.dim,anchor:'middle'})+T(`\\dfrac{d^2x}{dt^2}=-${WW}^2x`,880,200,44,{auto:false}),1);
  s+=fade(seg(p,.05,.25),label('x → θ',600,345,{size:32,color:CTH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),label('ω² → g/l',600,395,{size:32,color:CW,anchor:'middle',weight:700}));
  s+=card(760,320,380,150,T(`${WW}=\\sqrt{\\dfrac{g}{${LL}}}`,950,420,46,{auto:false}),seg(p,.6,.8),CW);
  return s;
 },

 [K+'units']:(p)=>{
  let s=card(120,60,960,380,label('単位の 確かめ',600,115,{size:28,color:C.dim,anchor:'middle'}),1);
  s+=fade(seg(p,.1,.3),T(`\\dfrac{g}{${LL}}`,340,235,54,{auto:false})+label('→',450,245,{size:36,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.45),T(`\\dfrac{\\mathrm{m/s^2}}{\\mathrm{m}}`,600,235,46,{auto:false}));
  s+=fade(seg(p,.45,.6),label('＝',740,248,{size:36,color:C.ink,anchor:'middle'})+T(`\\dfrac{1}{\\mathrm{s}^2}`,840,235,50,{auto:false}));
  s+=fade(seg(p,.65,.8),label('ω² の 単位（rad/s の 2乗）と 同じ',600,370,{size:28,color:CW,anchor:'middle',weight:700}));
  s+=ok(1000,250,seg(p,.7,.85));
  return s;
 },
  [K+'period']:(p)=>{
  let s=card(80,40,1040,420,'',1);
  s+=chain([`${TT}=\\dfrac{2\\pi}{${WW}}`,`=\\dfrac{2\\pi}{\\sqrt{g/${LL}}}`,`=2\\pi\\sqrt{\\dfrac{${LL}}{g}}`],600,210,50,[1,seg(p,.15,.35),seg(p,.4,.6)]);
  const f=`=2\\pi\\sqrt{\\dfrac{${LL}}{g}}`,w=texWidth(f,50,false),W=[`${TT}=\\dfrac{2\\pi}{${WW}}`,`=\\dfrac{2\\pi}{\\sqrt{g/${LL}}}`,f].reduce((a,q)=>a+texWidth(q,50,false),0)+2*GAP;
  s+=fade(seg(p,.6,.75),highlight(600+W/2-w-6,95,w+24,170,1));
  s+=fade(seg(p,.7,.85),label('初級で 先に 使った 式 を 導けた',600,380,{size:30,color:C.hi,weight:700,anchor:'middle'})+label('✓',880,385,{size:40,color:C.F,weight:700}));
  return s;
 },

 [K+'calc']:(p)=>{
  let s=card(80,40,1040,420,label('l ＝ 1.00 m、g ＝ 9.8 m/s²',600,95,{size:30,color:C.ink,anchor:'middle',weight:700}),1);
  s+=fade(seg(p,.15,.35),T(`\\sqrt{\\dfrac{1.00}{9.8}}\\approx0.319`,600,195,46,{auto:false}));
  s+=fade(seg(p,.45,.65),T(`${TT}=2\\pi\\times0.319\\approx{\\color{${CT}}2.01\\ \\mathrm{s}}`,600,305,48,{auto:false}));
  s+=fade(seg(p,.7,.85),label('（ω ＝ √9.8 ≈ 3.13 rad/s）',600,400,{size:26,color:CW,anchor:'middle'}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=pend(.25,{cx:220,py:50,Lp:95,G:0,mtext:'',R:18,thMax:.3});
  s+=pend(.25,{cx:520,py:50,Lp:380,mtext:'',R:18,thMax:.3});
  s+=fade(seg(p,.05,.2),label('1 m',215,190,{size:26,color:CL,anchor:'middle',weight:700})+label('4 m',640,300,{size:26,color:CL,weight:700}));
  s+=card(760,120,400,220,label('糸を 4倍に すると',960,190,{size:30,color:C.ink,anchor:'middle'})+label('周期は 何倍？',960,265,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  // true relative rates: the 4 m pendulum swings at half the rate
  const ph=TAU*1.6*p;
  let s=pend(.25*Math.cos(ph),{cx:220,py:50,Lp:95,mtext:'',R:18,thMax:.3});
  s+=pend(.25*Math.cos(ph/2),{cx:520,py:50,Lp:380,mtext:'',R:18,thMax:.3});
  s+=label('1 m',215,190,{size:26,color:CL,anchor:'middle',weight:700})+label('4 m',640,300,{size:26,color:CL,weight:700});
  s+=card(760,60,400,400,T(`\\sqrt{4}=2`,960,130,44,{auto:false})
   +label('1 m：約 2.01 秒',960,215,{size:28,color:CT,anchor:'middle',weight:700})
   +label('4 m：約 4.01 秒',960,270,{size:28,color:CT,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('質量を 変えても',960,355,{size:26,color:C.ink,anchor:'middle'})+label('周期は 同じ',960,400,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),CT);
  return s;
 },
  [K+'gmeas']:(p)=>{
  let s=card(80,20,1040,460,'',1);
  s+=T(`${TT}=2\\pi\\sqrt{\\dfrac{${LL}}{g}}`,480,125,42,{auto:false});
  s+=fade(seg(p,.1,.3),label('↓ 両辺を 2乗',720,190,{size:26,color:C.dim})+T(`${TT}^2=\\dfrac{4\\pi^2${LL}}{g}`,480,270,42,{auto:false}));
  s+=fade(seg(p,.35,.55),label('↓ g について 解く',720,330,{size:26,color:C.dim})+T(`g=\\dfrac{4\\pi^2${LL}}{${TT}^2}`,480,415,46,{auto:false}));
  s+=fade(seg(p,.65,.8),label('周期と 長さ → その場所の g',720,420,{size:28,color:C.hi,weight:700}));
  return s;
 },

 [K+'gmeas2']:(p)=>{
  let s=card(80,40,1040,420,'',1);
  s+=T(`g=\\dfrac{4\\pi^2${LL}}{${TT}^2}`,600,120,46,{auto:false});
  s+=fade(seg(p,.1,.35),T(`=\\dfrac{39.48\\times1.00}{{\\color{${CT}}2.01}^2}`,600,245,46,{auto:false}));
  s+=fade(seg(p,.45,.65),T(`\\approx9.8\\ \\mathrm{m/s^2}`,600,365,50,{auto:false}));
  s+=ok(860,370,seg(p,.65,.8));
  return s;
 },

 // ===== S5 どこまで正しい？ =====
 [K+'big']:(p)=>{
  const th=TH30*Math.cos(TAU*1.2*p);
  let s=pend(th,{thMax:TH30+.04,mtext:''});
  // amplitude marks at ±30°
  [TH30,-TH30].forEach(a=>{const [x,y]=bobXY(a);s+=line(380,40,x,y,{color:C.faint,w:2,dash:'4 6'});});
  s+=card(720,110,440,230,label('振幅 30°',940,180,{size:36,color:CTH,anchor:'middle',weight:700})
   +label('＝ 約 0.52 rad',940,245,{size:32,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.7),label('sinθ ≈ θ は まだ 使える？',940,310,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),CTH);
  return s;
 },
  [K+'gap']:(p)=>{
  const {A,svg}=sinGraph({xmax:.9,ymax:.9,w:520,h:390,ticks:[.5]});
  let s=svg;
  const x=TH30;
  s+=fade(seg(p,.05,.2),line(A.X(x),A.Y(0),A.X(x),A.Y(x),{color:C.dim,w:2,dash:'4 6'}));
  s+=fade(seg(p,.15,.3),dot(A.X(x),A.Y(Math.sin(x)),8,C.F)+label('sin ＝ 0.50',A.X(x)+16,A.Y(Math.sin(x))+30,{size:24,color:C.F,weight:700}));
  s+=fade(seg(p,.2,.35),dot(A.X(x),A.Y(x),8,C.hi)+label('θ ＝ 0.52',A.X(x)-16,A.Y(x)-14,{size:24,color:C.hi,weight:700,anchor:'end'}));
  s+=fade(seg(p,.4,.55),line(A.X(x)+2,A.Y(x),A.X(x)+2,A.Y(Math.sin(x)),{color:CD,w:6}));
  s+=card(700,90,460,280,label('差',930,150,{size:28,color:CD,anchor:'middle',weight:700})
   +T('0.524-0.500=0.024',930,215,36,{auto:false,color:CD})
   +fade(seg(p,.65,.8),label('θ の 約 4.5% 足りない',930,300,{size:30,color:CD,anchor:'middle',weight:700})),seg(p,.45,.6),CD);
  return s;
 },

  [K+'cubic']:(p)=>{
  let s=card(80,30,1040,440,label('近似・中級 2/2 の 見積もり',600,80,{size:26,color:C.dim,anchor:'middle'}),1);
  s+=T(`${TH}-${SIN}\\approx\\dfrac{${TH}^3}{6}`,600,190,48,{auto:false});
  s+=fade(seg(p,.25,.45),T(`\\dfrac{0.524^3}{6}\\approx0.024`,600,335,46,{auto:false,color:CD}));
  s+=fade(seg(p,.55,.7),label('実際の 差 0.024 と 合う',600,425,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=ok(840,430,seg(p,.6,.75));
  return s;
 },

 [K+'weak']:(p)=>{
  const G=axes({x:90,y:320,w:760,h:230,xmin:0,xmax:8.4,ymin:-.62,ymax:.62,xlabel:'t [s]',ylabel:'θ [rad]',xticks:[2,4,6,8],yticks:[.5,-.5],xcolor:CT,ycolor:CTH});
  let s=G.svg;
  const tEnd=8.4*seg(p,.1,.8);
  s+=G.plot(approxAt,{from:0,to:Math.max(.01,tEnd),color:C.hi,w:3,dash:'10 7'});
  s+=G.plot(trueAt,{from:0,to:Math.max(.01,tEnd),color:CTH,w:4.5});
  s+=label('- - 近似の 式',890,120,{size:24,color:C.hi,weight:700})+label('── 本当の 動き',890,160,{size:24,color:CTH,weight:700});
  s+=card(120,380,960,110,label('戻す力が 弱い → 戻るのが 遅れる → 周期が 長い',600,448,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'numeric']:(p)=>{
  const G=axes({x:90,y:320,w:760,h:230,xmin:0,xmax:8.4,ymin:-.62,ymax:.62,xlabel:'t [s]',ylabel:'θ [rad]',xticks:[2,4,6,8],yticks:[.5,-.5],xcolor:CT,ycolor:CTH});
  let s=G.svg+G.plot(approxAt,{color:C.hi,w:3,dash:'10 7'})+G.plot(trueAt,{color:CTH,w:4.5});
  s+=label('- - 近似の 式',890,120,{size:24,color:C.hi,weight:700})+label('── 本当の 動き',890,160,{size:24,color:CTH,weight:700});
  // after 4 periods the true swing lags by 4 × 0.035 ≈ 0.14 s
  const T0=TAU/W0,T1=T0*1.01741;
  s+=fade(seg(p,.1,.3),dot(G.X(4*T0),G.Y(TH30),8,C.hi)+dot(G.X(4*T1),G.Y(TH30),8,CTH)+label('4周で 約0.14 s 遅れる',G.X(4*T0)-12,G.Y(TH30)-18,{size:24,color:CD,weight:700,anchor:'end'}));
  s+=card(120,370,960,130,label('近似の 式',160,452,{size:26,color:C.hi,weight:700})+T(`${TT}=2.01\\ \\mathrm{s}`,370,440,36,{auto:false})
   +fade(seg(p,.45,.6),label('本当',520,452,{size:26,color:CTH,weight:700})+T(`${TT}\\approx2.04\\ \\mathrm{s}`,680,440,36,{auto:false})+label('約 1.7% 長い',940,452,{size:28,color:CD,weight:700,anchor:'middle'})),seg(p,.3,.45));
  return s;
 },
 [K+'table']:(p)=>{
  const rows=[['5°','2.008 s','＋0.05%'],['30°','2.04 s','＋1.7%'],['90°','2.37 s','＋18%']],R=[1.00048,1.0174,1.1803];
  let s=card(80,40,1040,430,'',1);
  s+=label('振幅',200,100,{size:26,color:CTH,anchor:'middle',weight:700})+label('本当の 周期',420,100,{size:26,color:CT,anchor:'middle',weight:700})+label('近似 2.01 s との 差',850,100,{size:26,color:CD,anchor:'middle',weight:700});
  s+=line(110,120,1090,120,{color:C.faint,w:2});
  rows.forEach((r,i)=>{const y=190+i*100,g=i===0?seg(p,.05,.2):i===1?seg(p,.2,.35):seg(p,.5,.65);
   const bw=(R[i]-1)*1500;
   s+=fade(g,label(r[0],200,y,{size:32,color:CTH,anchor:'middle',weight:700})+label(r[1],420,y,{size:30,color:CT,anchor:'middle'})
    +rect(620,y-28,Math.max(4,bw),36,{fill:CD,fo:.5,stroke:CD,rx:4})+label(r[2],620+Math.max(4,bw)+16,y,{size:28,color:CD,weight:700}));});
  return s;
 },
  [K+'cond']:(p)=>{
  let s=card(120,30,960,440,'',1);
  s+=T(`${TT}=2\\pi\\sqrt{\\dfrac{${LL}}{g}}`,600,215,56,{auto:false});
  s+=fade(seg(p,.35,.55),T(`(\\,|${TH}|\\ll1\\,)`,600,330,46,{auto:false,color:C.hi})+highlight(330,70,540,300,1));
  s+=fade(seg(p,.6,.75),label('振幅に よらない ＝ 小さな 振れ での 結果',600,425,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },


 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=pend(TH30,{cx:220,py:40,Lp:230,grav:1,split:1,radHi:.25,G:150,mtext:''});
  s+=card(440,60,730,380,'',1);
  s+=T(`m${LL}\\,${DDT}=-mg\\,${SIN}`,805,160,46,{auto:false});
  s+=fade(seg(p,.5,.7),label('m は 消える',805,250,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),T(`${DDT}=-\\dfrac{g}{${LL}}\\,${SIN}`,805,350,44,{auto:false}));
  return s;
 },
  [K+'sum2']:(p)=>{
  let s=card(80,20,1040,460,'',1);
  s+=T(`${SIN}\\approx${TH}\\ \\ (|${TH}|\\ll1)`,600,85,36,{auto:false});
  s+=fade(seg(p,.15,.35),T(`${DDT}=-\\dfrac{g}{${LL}}\\,${TH}`,600,215,42,{auto:false}));
  s+=fade(seg(p,.35,.55),T(`${TT}=2\\pi\\sqrt{\\dfrac{${LL}}{g}}`,600,355,44,{auto:false}));
  s+=fade(seg(p,.7,.85),label('大きく 振ると 少し 長い',600,450,{size:28,color:CD,anchor:'middle',weight:700}));
  return s;
 },

 [K+'next']:(p)=>{
  const th=.35*Math.cos(TAU*1.2*p);
  let s=pend(th,{cx:300,py:60,Lp:300,thMax:.45,mtext:'',g:1-seg(p,.45,.6)});
  s+=fade(seg(p,.1,.3)*(1-seg(p,.45,.6)),label('大きさの ない 点',300,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  const gr=seg(p,.45,.65),cx=300,py=60,Lp=330,ex=cx+Lp*Math.sin(th),ey=py+Lp*Math.cos(th);
  s+=fade(gr,line(cx-90,py,cx+90,py,{color:C.dim,w:4})+line(cx,py,ex,ey,{color:C.x,w:26,cap:'round'})+dot(cx,py,8,C.hi));
  s+=card(640,140,500,190,label('広がった 物体 なら？',890,215,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（棒の 振り子）',890,275,{size:26,color:C.dim,anchor:'middle'}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  const th=.3*Math.cos(TAU*1.1*p),cx=260,py=60,Lp=330,sn=Math.sin(th),cs=Math.cos(th);
  let s=line(cx-90,py,cx+90,py,{color:C.dim,w:4})+line(cx,py,cx+Lp*sn,py+Lp*cs,{color:C.faint,w:10,cap:'round'})+dot(cx,py,8,C.hi);
  // same total mass: near the pivot vs at the end
  const near=seg(p,.35,.5),far=seg(p,.6,.75);
  const r=mix(.3,.95,far);
  s+=fade(near,dot(cx+Lp*r*sn,py+Lp*r*cs,22,C.x)+label('m',cx+Lp*r*sn+30,py+Lp*r*cs+8,{size:24,color:C.x}));
  s+=card(560,70,600,150,label('回しにくさ は',860,130,{size:30,color:C.ink,anchor:'middle'})+label('質量の 位置で どう 決まる？',860,190,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(560,280,600,130,label('支点の 近く と 遠く、同じ 質量 なら？',860,355,{size:28,color:C.ink,anchor:'middle'}),seg(p,.45,.6));
  return s;
 },
};
