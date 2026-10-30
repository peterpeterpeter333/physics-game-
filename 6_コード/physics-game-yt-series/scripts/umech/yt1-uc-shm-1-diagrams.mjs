// YouTube シリーズ「単振動・上級 1/3」(ys-uc-shm-1) — 図。Stage 1200×515.
// 色：長さ l・位置 x 水色、速度 v 紫、加速度 赤、力（重力 mg・糸の力 S）緑、周期 T・時間 金、角度 θ・エネルギー 橙、強調 黄。
// 振り子：支点 (px,py)、振れ角 θ は真下から、右へ振れる向きを正。画面座標（y 下向き）でおもり (px+L sinθ, py+L cosθ)。
//   支点向き (−sinθ, −cosθ)、θ を増やす接線 (cosθ, −sinθ)。重力の糸方向（外向き）成分 mg cosθ、接線成分 −mg sinθ。
// 数値：l＝0.80 m、T＝1.80 s → 31.58/3.24＝9.75。m＝0.1 kg、θ₀＝60°：最下点 1.96 N、端 0.49 N。90°：2.94 N。
import {C,seg,fade,mix,label,line,rect,dot,ring,arrow,brace,highlight,axes,texWidth,draw,wall,spring as coil} from './anim.mjs';
import {card,T,cc} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='uc-shm-1:';
export const cF=s=>cc(C.F,s),cV=s=>cc(C.v,s),cX=s=>cc(C.x,s),cT=s=>cc(C.t,s),cE=s=>cc(C.E,s),cH=s=>cc(C.hi,s),cA=s=>cc(C.a,s);
export const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
export const TF=(s,x,y,maxW,size=44,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
export const boxT=(s,x,y,size=48,g=1,col=C.hi,frac=false)=>{const w=texWidth(s,size,false),top=frac?1.95:1.5,h=frac?3.0:2.45;return T(s,x,y,{size})+highlight(x-w/2-22,y-size*top,w+44,size*h,g,col);};
const deg=Math.PI/180;
const TH=cE('\\theta'),TH0=cE('\\theta_0'),l=cX('l'),Sv=cF('S'),v=cV('v'),Tp=cT('T');
const COS=`\\cos${TH}`,COS0=`\\cos${TH0}`;

// ---- pendulum ----
export function ceiling(px,py){let s=line(px-90,py,px+90,py,{color:C.dim,w:4});for(let q=px-84;q<px+90;q+=22)s+=line(q,py,q+14,py-14,{color:C.faint,w:2});return s;}
export const bobAt=(px,py,Lp,th)=>[px+Lp*Math.sin(th),py+Lp*Math.cos(th)];
export function pend(px,py,Lp,th,{r=22,ref=1,g=1,ghost=0,str=C.dim}={}){
 const [bx,by]=bobAt(px,py,Lp,th);
 let s=ceiling(px,py);
 if(ref)s+=line(px,py,px,py+Lp+34,{color:C.faint,w:2,dash:'6 7'});
 s+=line(px,py,bx,by,{color:str,w:3})+ring(bx,by,r,{color:C.dim,w:3,fill:'#2b3d63'})+dot(bx-7,by-7,5,'#5a73a6')+dot(px,py,6,C.dim);
 return fade(g,s);
}
export function ghostPend(px,py,Lp,th,g=1){const [bx,by]=bobAt(px,py,Lp,th);return fade(g*.5,line(px,py,bx,by,{color:C.faint,w:2,dash:'6 6'})+ring(bx,by,20,{color:C.faint,w:2,dash:'5 5'}));}
export function angArc(px,py,R,th,{txt='θ',g=1,col=C.E,size=26}={}){
 const n=24,pts=Array.from({length:n+1},(_,i)=>{const a=th*i/n;return [px+R*Math.sin(a),py+R*Math.cos(a)];});
 const am=th/2;return fade(g,draw(pts,1,{color:col,w:3})+label(txt,px+(R+26)*Math.sin(am),py+(R+26)*Math.cos(am)+8,{size,color:col,anchor:'middle',weight:700}));
}
// force arrows at the bob
export function gArrow(px,py,Lp,th,{len=110,g=1,txt='mg',r=22}={}){const [bx,by]=bobAt(px,py,Lp,th);return fade(g,arrow(bx,by+r,bx,by+r+len,{color:C.F,w:5,head:14})+label(txt,bx+12,by+r+len-6,{size:26,color:C.F,weight:700}));}
export function sArrow(px,py,Lp,th,{len=120,g=1,txt='S',r=22,dx=-34,dy=0}={}){const [bx,by]=bobAt(px,py,Lp,th),ux=-Math.sin(th),uy=-Math.cos(th);const ex=bx+ux*(r+len),ey=by+uy*(r+len);return fade(g,arrow(bx+ux*r,by+uy*r,ex,ey,{color:C.F,w:5,head:14})+label(txt,(bx+ex)/2+dx,(by+ey)/2+dy,{size:26,color:C.F,weight:700,anchor:'middle'}));}
export function vArrow(px,py,Lp,th,{len=100,g=1,txt='v',sign=-1}={}){const [bx,by]=bobAt(px,py,Lp,th),tx=Math.cos(th)*sign,ty=-Math.sin(th)*sign;return fade(g,arrow(bx,by,bx+tx*len,by+ty*len,{color:C.v,w:5,head:14})+label(txt,bx+tx*(len+18),by+ty*(len+18)+8,{size:26,color:C.v,weight:700,anchor:'middle'}));}
function comps(px,py,Lp,th,{g=1,len=110,cos=1,sin=1}={}){
 const [bx,by]=bobAt(px,py,Lp,th);
 const ox=Math.sin(th),oy=Math.cos(th),c=len*Math.cos(th),s_=len*Math.sin(th);
 let s='';
 if(cos)s+=fade(cos,arrow(bx,by,bx+ox*c,by+oy*c,{color:C.F,w:4,head:12})+label('mg cosθ',bx+ox*c+16,by+oy*c-4,{size:24,color:C.F}));
 if(sin){const tx=-Math.cos(th),ty=Math.sin(th);s+=fade(sin,arrow(bx,by,bx+tx*s_,by+ty*s_,{color:C.F,w:4,head:12})+label('mg sinθ',bx+tx*s_-10,by+ty*s_-12,{size:24,color:C.F,anchor:'end'}));}
 return fade(g,s);
}
export const swingTh=(p,amp=.5,cyc=1.5,ph=0)=>amp*Math.cos(2*Math.PI*(cyc*p+ph));

// ---- spring + block (same as 振動の方程式・上級) ----
export function springBox(x,{cx=330,y=330,g=1,unit=120,F=0}={}){
 const bx=cx+unit*x;
 let s=wall(70,y-90,y+10)+line(70,y+10,cx+unit*1.6,y+10,{color:C.dim,w:3});
 s+=coil(70,bx-38,y-34,{coils:9,amp:16,color:C.dim,w:3});
 s+=rect(bx-38,y-72,76,72,{fill:C.x,fo:.3,stroke:C.x,sw:2,rx:8})+label('m',bx,y-26,{size:28,color:C.ink,anchor:'middle',weight:700});
 s+=line(cx,y+18,cx,y+40,{color:C.dim,w:2})+label('0',cx,y+70,{size:24,color:C.dim,anchor:'middle'});
 if(F)s+=fade(F,Math.abs(x)>0.05?arrow(bx,y-90,bx-x*90,y-90,{color:C.F,w:5,head:14}):'');
 return fade(g,s);
}
const CK='#ffd9b0';
export function bars(Kf,Uf,{x=760,y=430,h=300,g=1}={}){
 let s=line(x-30,y,x+330,y,{color:C.dim,w:2});
 const bar=(i,f,col,name)=>{const X=x+i*120;return rect(X,y-h*f,80,h*f,{fill:col,fo:.85,stroke:col,sw:2,rx:4})+label(name,X+40,y+34,{size:26,color:col,anchor:'middle',weight:700});};
 s+=bar(0,Uf,C.E,'U')+bar(1,Kf,CK,'K');
 const X=x+240;
 s+=rect(X,y-h*Uf,80,h*Uf,{fill:C.E,fo:.85,stroke:C.E,sw:2,rx:4})+rect(X,y-h*(Uf+Kf),80,h*Kf,{fill:CK,fo:.85,stroke:CK,sw:2,rx:4})
  +label('K＋U',X+40,y+34,{size:26,color:C.hi,anchor:'middle',weight:700})+line(X-14,y-h,X+94,y-h,{color:C.hi,w:3,dash:'7 6'});
 return fade(g,s);
}

// ---- small curves ----
export function miniCurve(x,y,w,h,fn,{p=1,color=C.x,from=0,to=1,axis=1}={}){
 let s=axis?line(x,y,x+w,y,{color:C.faint,w:2})+line(x,y-h,x,y+h,{color:C.faint,w:2}):'';
 s+=draw(Array.from({length:161},(_,i)=>{const u=from+(to-from)*i/160;return [x+w*(u-from)/(to-from),y-h*fn(u)];}),p,{color,w:3});
 return s;
}
// stacked bar for S (green parts)
function sBar(x,y,h1,h2,{g=1,t1='mg cosθ',t2='mv²/l',w=90}={}){
 let s=rect(x,y-h1,w,h1,{fill:C.F,fo:.35,stroke:C.F,sw:2,rx:4})+label(t1,x+w+14,y-h1/2+8,{size:24,color:C.F});
 s+=fade(g,rect(x,y-h1-h2,w,h2,{fill:C.F,fo:.75,stroke:C.F,sw:2,rx:4})+label(t2,x+w+14,y-h1-h2/2+8,{size:24,color:C.hi,weight:700}));
 return s+line(x-20,y,x+w+20,y,{color:C.dim,w:2});
}
function wBar(x,y,vals,{unit=100,g=1}={}){
 // vals: [[label,value,color]]
 let s=line(x-20,y,x+vals.length*130,y,{color:C.dim,w:2});
 vals.forEach(([t,val,col,gg=1],i)=>{const X=x+i*130,h=val*unit;s+=fade(gg,rect(X,y-h,80,h,{fill:col,fo:.6,stroke:col,sw:2,rx:4})+label(String(val)+' N',X+40,y-h-12,{size:24,color:col,anchor:'middle',weight:700})+label(t,X+40,y+32,{size:24,color:C.dim,anchor:'middle'}));});
 return fade(g,s);
}

const PX=280,PY=50,PL=330;
export const ytUcShm1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const th=swingTh(p,.5,1.5);
  let s=pend(PX,PY,PL,th);
  s+=card(620,70,540,360,L('前回の 最後の 問い',890,118,{size:24,color:C.dim})
   +L('回転 → 振動',890,180,{size:34,weight:700,color:C.hi})
   +fade(seg(p,.35,.5),L('振り子で g を 測る',890,260,{size:30}))
   +fade(seg(p,.55,.7),L('糸の 力 は？',890,330,{size:30,color:C.F,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=card(80,70,500,380,L('抵抗が 加わると？',330,125,{size:30,weight:700})+miniCurve(120,300,420,110,u=>Math.exp(-3*u)*Math.cos(2*Math.PI*6*u),{p:seg(p,.05,.6)}),seg(p,.0,.08));
  s+=card(620,70,500,380,L('周期的に 押すと？',870,125,{size:30,weight:700})+fade(seg(p,.3,.4),miniCurve(660,300,420,110,u=>(1-Math.exp(-4*u))*Math.sin(2*Math.PI*6*u),{p:seg(p,.35,.9)})),seg(p,.1,.2));
  return s;
 },
 [K+'plan']:(p)=>{
  const items=[['1/3','振り子の 測定 と 糸の 力','今回'],['2/3','抵抗で 減る 振動','減衰'],['3/3','周期的に 押す 振動','共振']];
  let s='';
  items.forEach(([n,a,b],i)=>{const y=70+i*135,on=i===0;s+=card(170,y,860,112,L(n,250,y+70,{size:34,color:on?C.hi:C.dim,weight:700})+label(a,330,y+68,{size:32,color:on?C.ink:C.dim,weight:on?700:400})+label(b,990,y+66,{size:28,color:on?C.hi:C.dim,anchor:'end',weight:700}),seg(p,.03+i*.2,.13+i*.2),on?C.hi:C.faint);});
  return s;
 },
 [K+'recall']:(p)=>{
  const th=.5;
  let s=pend(PX,PY,PL,th)+angArc(PX,PY,90,th)+gArrow(PX,PY,PL,th)+comps(PX,PY,PL,th,{cos:0,sin:seg(p,.05,.2)});
  s+=card(620,60,540,400,L('中級（接線方向）',890,105,{size:24,color:C.dim})
   +T(`m${l}\\dfrac{d^2${TH}}{d${cT('t')}^2}=-mg\\sin${TH}`,890,175,{size:36})
   +fade(seg(p,.3,.45),L('小さな 振れ： sinθ ≈ θ',890,250,{size:28,color:C.E}))
   +fade(seg(p,.5,.65),T(`${Tp}=2\\pi\\sqrt{\\dfrac{${l}}{g}}`,890,370,{size:46})+L('（近似で 導いた 結果）',890,448,{size:24,color:C.dim})),seg(p,.0,.08));
  return s;
 },
 [K+'recall2']:(p)=>{
  const th=.5,[bx,by]=bobAt(PX,PY,PL,th);
  // motion arc
  const arcPts=Array.from({length:41},(_,i)=>bobAt(PX,PY,PL,-.65+1.3*i/40));
  let s=draw(arcPts,1,{color:C.faint,w:3,dash:'8 7'})+pend(PX,PY,PL,th)+vArrow(PX,PY,PL,th,{len:95,sign:1,txt:'動き'});
  s+=sArrow(PX,PY,PL,th,{len:120,txt:'糸の 力',dx:-62});
  // right-angle mark
  const ux=-Math.sin(th),uy=-Math.cos(th),tx=Math.cos(th),ty=-Math.sin(th),q=18,o=24;
  s+=draw([[bx+ux*(o+q)+0,by+uy*(o+q)],[bx+ux*(o+q)+tx*q,by+uy*(o+q)+ty*q],[bx+ux*o+tx*q+tx*0,by+uy*o+ty*q]],1,{color:C.hi,w:2.5});
  s+=card(620,90,540,330,L('糸の 力 ⟂ 動き',890,150,{size:32,weight:700})
   +L('→ 接線方向の 式に 入らない',890,215,{size:28,color:C.dim})
   +fade(seg(p,.45,.6),L('大きさは？',890,305,{size:34,color:C.F,weight:700})+L('→ 上級で 扱う 約束',890,365,{size:28,color:C.hi}))
   ,seg(p,.0,.08));
  return s;
 },
 // ===== S2 周期から g =====
 [K+'meas']:(p)=>{
  const th=swingTh(p,.35,2);
  let s=pend(PX,PY,PL,th);
  s+=fade(1,label('l',PX-30,PY+PL/2,{size:32,color:C.x,weight:700,anchor:'end'})+line(PX-16,PY,PX-16,PY+PL,{color:C.x,w:3}));
  s+=card(620,60,540,400,T(`${Tp}=2\\pi\\sqrt{\\dfrac{${l}}{g}}`,890,150,{size:50})
   +fade(seg(p,.3,.45),label('測る：',680,280,{size:30,color:C.dim})+T(`${l},\\;\\;${Tp}`,860,272,{size:40}))
   +fade(seg(p,.55,.7),label('求める：',680,370,{size:30,color:C.dim})+T('g',860,362,{size:44})),seg(p,.0,.08));
  return s;
 },
 [K+'sq']:(p)=>{
  let s=T(`${Tp}=2\\pi\\sqrt{\\dfrac{${l}}{g}}`,600,110,{size:50});
  s+=fade(seg(p,.15,.3),L('両辺を 2乗：√ が 外れる',600,215,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.35,.5),boxT(`${Tp}^2=\\dfrac{4\\pi^2${l}}{g}`,600,360,56,1,C.hi,true));
  return s;
 },
 [K+'mulg']:(p)=>{
  let s=T(`${Tp}^2=\\dfrac{4\\pi^2${l}}{g}`,600,110,{size:48,opacity:.8});
  s+=fade(seg(p,.15,.3),L('両辺 × g',600,215,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.35,.5),boxT(`g\\,${Tp}^2=4\\pi^2${l}`,600,340,58));
  return s;
 },
 [K+'divT']:(p)=>{
  let s=T(`g\\,${Tp}^2=4\\pi^2${l}`,600,100,{size:48,opacity:.8});
  s+=fade(seg(p,.12,.27),L(`両辺 ÷ T²`,600,195,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),boxT(`g=\\dfrac{4\\pi^2${l}}{${Tp}^2}`,600,350,60,1,C.F,true));
  s+=fade(seg(p,.6,.75),L('測った l と T から g',600,480,{size:28,color:C.F}));
  return s;
 },
 [K+'len']:(p)=>{
  const px=330,py=40,Ls=300,R=48;
  let s=ceiling(px,py)+line(px,py,px,py+Ls,{color:C.dim,w:3})+ring(px,py+Ls+R,R,{color:C.dim,w:3,fill:'#2b3d63'})+dot(px,py+Ls+R,7,C.hi)+dot(px,py,6,C.dim);
  s+=label('重心',px+16,py+Ls+R+8,{size:24,color:C.hi,weight:700});
  s+=fade(seg(p,.05,.2),line(px-70,py,px-70,py+Ls+R,{color:C.x,w:4})+line(px-82,py,px-58,py,{color:C.x,w:3})+line(px-82,py+Ls+R,px-58,py+Ls+R,{color:C.x,w:3})+label('l',px-90,py+(Ls+R)/2+10,{size:34,color:C.x,weight:700,anchor:'end'}));
  s+=fade(seg(p,.45,.6),line(px+80,py,px+80,py+Ls,{color:C.dim,w:3,dash:'7 6'})+label('糸だけ',px+96,py+Ls/2,{size:26,color:C.dim})+label('（半径の 分 短い）',px+96,py+Ls/2+36,{size:24,color:C.a}));
  s+=card(640,110,500,260,L('l ＝ 支点 → 重心',890,200,{size:34,color:C.x,weight:700})+fade(seg(p,.45,.6),L('糸の 長さ ＋ 半径',890,280,{size:30,color:C.dim})),seg(p,.0,.1));
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(80,60,1040,120,T(`${l}=0.80\\ \\mathrm{m},\\qquad ${Tp}=1.80\\ \\mathrm{s}`,600,125,{size:46}),seg(p,0,.08));
  s+=fade(seg(p,.3,.45),T(`4\\pi^2\\times 0.80\\approx 31.58`,600,275,{size:46}));
  s+=fade(seg(p,.6,.75),T(`1.80^2=3.24`,600,395,{size:46}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=T(`g=\\dfrac{4\\pi^2${l}}{${Tp}^2}=\\dfrac{31.58}{3.24}`,600,150,{size:50});
  s+=fade(seg(p,.25,.4),boxT(`g\\approx 9.75\\ \\mathrm{m/s^2}`,600,360,58,1,C.F));
  return s;
 },
 [K+'err']:(p)=>{
  let s=card(80,50,500,200,L('T を 1% 長く 測ると',330,100,{size:28})+T(`\\dfrac{1}{1.01^2}\\approx 0.980`,330,185,{size:42}),seg(p,0,.08));
  s+=fade(seg(p,.25,.4),L('g は 約 2% 小さく 出る',330,300,{size:30,color:C.a,weight:700}));
  s+=card(620,50,500,300,L('10往復 を まとめて',870,100,{size:28})
   +fade(seg(p,.55,.7),T(`18.0\\ \\mathrm{s}\\div 10=1.80\\ \\mathrm{s}`,870,190,{size:40}))
   +fade(seg(p,.7,.85),L('始めと 終わりの 押し遅れが',870,265,{size:24,color:C.dim})+L('10分の1 に なる',870,305,{size:24,color:C.dim})),seg(p,.45,.55));
  return s;
 },
 // ===== S3 エネルギー（振り返り） =====
 [K+'erec']:(p)=>{
  const x=Math.cos(2*Math.PI*1.5*p);
  let s=springBox(x,{cx:300,y:300});
  s+=card(640,50,520,400,L('振動の 方程式・上級',900,95,{size:24,color:C.dim})
   +T(`${cX('x')}=A\\cos\\omega ${cT('t')}`,900,160,{size:42})
   +fade(seg(p,.35,.5),T(`K=\\tfrac12 m\\omega^2A^2\\sin^2\\omega ${cT('t')}`,900,260,{size:34}))
   +fade(seg(p,.55,.7),T(`U=\\tfrac12 kA^2\\cos^2\\omega ${cT('t')}`,900,350,{size:34})),seg(p,0,.08));
  return s;
 },
 [K+'erec2']:(p)=>{
  const ph=2*Math.PI*1.25*p,x=Math.cos(ph);
  let s=bars(1-x*x,x*x,{x:120,y:430,h:290});
  s+=card(600,60,560,380,T(`m\\omega^2=k`,880,120,{size:40})
   +fade(seg(p,.2,.35),T(`K+U=\\tfrac12kA^2(\\sin^2+\\cos^2)`,880,220,{size:36}))
   +fade(seg(p,.45,.6),boxT(`K+U=\\tfrac12kA^2`,880,345,48)),seg(p,0,.08));
  return s;
 },
 [K+'height']:(p)=>{
  const th=.75,[bx,by]=bobAt(PX,PY,PL,th),low=PY+PL;
  let s=pend(PX,PY,PL,th)+angArc(PX,PY,80,th);
  s+=line(PX-60,low,bx+120,low,{color:C.faint,w:2,dash:'6 6'})+label('最下点',PX-70,low+8,{size:24,color:C.dim,anchor:'end'});
  s+=line(bx-40,by,bx+120,by,{color:C.faint,w:2,dash:'6 6'});
  s+=fade(seg(p,.25,.4),line(PX-40,PY,PX-40,by,{color:C.x,w:4})+label('l cosθ',PX-50,(PY+by)/2,{size:26,color:C.x,anchor:'end',weight:700}));
  s+=fade(seg(p,.45,.6),line(bx+90,by,bx+90,low,{color:C.E,w:5})+label('h',bx+104,(by+low)/2+10,{size:30,color:C.E,weight:700}));
  s+=card(680,90,470,320,T(`U=mg\\,${cE('h')}`,915,165,{size:46})
   +fade(seg(p,.5,.65),T(`${cE('h')}=${l}-${l}\\cos${TH}`,915,275,{size:44}))
   +fade(seg(p,.65,.8),L('（最下点から 測る）',915,355,{size:24,color:C.dim})),seg(p,0,.08));
  return s;
 },
 [K+'height2']:(p)=>{
  const th=swingTh(p,.9,1.25),U=(1-Math.cos(th))/(1-Math.cos(.9));
  let s=pend(PX-40,PY,PL,th)+vArrowSigned(PX-40,PY,PL,th,p);
  s+=bars(1-U,U,{x:640,y:330,h:230});
  s+=fade(seg(p,.3,.45),L('sinθ ≈ θ は 使わない',880,435,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.55,.7),L('糸の 力 ⟂ 動き → 仕事 0',880,485,{size:26,color:C.F}));
  return s;
 },
 // ===== S4 糸の力 =====
 [K+'tens']:(p)=>{
  const th=.5;
  let s=pend(PX,PY,PL,th)+sArrow(PX,PY,PL,th,{len:130,txt:'S'})+gArrow(PX,PY,PL,th);
  s+=card(620,90,540,320,L('糸の 力 の 大きさ',890,150,{size:28,color:C.dim})+T(Sv,890,250,{size:70})
   +fade(seg(p,.4,.55),L('T は 周期 に 使う',890,355,{size:28,color:C.t})),seg(p,0,.08));
  return s;
 },
 [K+'radial']:(p)=>{
  const th=.5,[bx,by]=bobAt(PX,PY,PL,th);
  let s=pend(PX,PY,PL,th);
  s+=line(bx+Math.sin(th)*70,by+Math.cos(th)*70,PX,PY,{color:C.hi,w:2,dash:'4 6'});
  s+=fade(seg(p,.1,.3),arrow(bx-Math.sin(th)*30,by-Math.cos(th)*30,bx-Math.sin(th)*170,by-Math.cos(th)*170,{color:C.hi,w:4,head:16})+label('支点向き を 正',bx-Math.sin(th)*120-20,by-Math.cos(th)*120,{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=card(660,140,480,220,L('今度は 糸の 方向',900,215,{size:32,weight:700})+L('の 運動方程式',900,275,{size:30}),seg(p,0,.08));
  return s;
 },
 [K+'acc']:(p)=>{
  const th=mix(.2,.6,seg(p,.0,.9)),[bx,by]=bobAt(PX,PY,PL,th);
  const circ=Array.from({length:81},(_,i)=>bobAt(PX,PY,PL,-.9+1.8*i/80));
  let s=draw(circ,1,{color:C.faint,w:3,dash:'8 7'})+pend(PX,PY,PL,th);
  s+=label('半径 l',PX-16,PY+150,{size:26,color:C.x,anchor:'end'});
  s+=vArrow(PX,PY,PL,th,{len:90,sign:1});
  s+=arrow(bx-Math.sin(th)*26,by-Math.cos(th)*26,bx-Math.sin(th)*136,by-Math.cos(th)*136,{color:C.a,w:5,head:14});
  s+=label('v²/l',bx-Math.sin(th)*90-28,by-Math.cos(th)*90+4,{size:28,color:C.a,weight:700,anchor:'end'});
  s+=card(680,110,470,280,L('支点（中心）向きの 加速度',915,170,{size:26,color:C.dim})+T(`\\dfrac{${v}^2}{${l}}`,915,275,{size:62})+L('（円運動の 結果）',915,355,{size:24,color:C.dim}),seg(p,0,.08));
  return s;
 },
 [K+'acc2']:(p)=>{
  const th=.4,[bx,by]=bobAt(PX,PY,PL,th);
  let s=pend(PX,PY,PL,th);
  s+=arrow(bx-Math.sin(th)*26,by-Math.cos(th)*26,bx-Math.sin(th)*136,by-Math.cos(th)*136,{color:C.a,w:5,head:14})+label('v²/l',bx-Math.sin(th)*90-28,by-Math.cos(th)*90+4,{size:28,color:C.a,weight:700,anchor:'end'});
  s+=fade(seg(p,.1,.25),arrow(bx,by,bx-Math.cos(th)*110,by+Math.sin(th)*110,{color:C.a,w:4,head:12})+label('接線',bx-Math.cos(th)*110-10,by+Math.sin(th)*110+30,{size:24,color:C.a,anchor:'end'}));
  s+=card(660,80,490,350,L('接線方向',905,135,{size:28,color:C.dim})+L('速さの 変化',905,185,{size:30,color:C.a})
   +fade(seg(p,.4,.55),L('中心向き',905,270,{size:28,color:C.dim})+T(`\\dfrac{${v}^2}{${l}}\\ \\text{のまま}`,905,350,{size:40})),seg(p,0,.08));
  return s;
 },
 [K+'force']:(p)=>{
  const th=.5;
  let s=pend(PX,PY,PL,th)+angArc(PX,PY,80,th)+sArrow(PX,PY,PL,th,{len:150,txt:'S'})+gArrow(PX,PY,PL,th);
  s+=comps(PX,PY,PL,th,{cos:seg(p,.15,.3),sin:0});
  s+=card(660,110,490,290,L('支点向きの 力',905,170,{size:28,color:C.dim})
   +fade(seg(p,.35,.5),T(`${Sv}-mg\\cos${TH}`,905,270,{size:50}))
   +fade(seg(p,.55,.7),L('mg cosθ は 支点と 逆向き',905,350,{size:24,color:C.F})),seg(p,0,.08));
  return s;
 },
 [K+'eom']:(p)=>{
  let s=T(`m\\,${cA('a')}=${cF('F')}`,600,85,{size:44,opacity:.8});
  s+=fade(seg(p,.1,.25),boxT(`m\\dfrac{${v}^2}{${l}}=${Sv}-mg\\cos${TH}`,600,270,56,1,C.hi,true));
  s+=fade(seg(p,.4,.55),L('質量 × 支点向きの 加速度',380,410,{size:26,color:C.a})+L('支点向きの 力',830,410,{size:26,color:C.F}));
  return s;
 },
 [K+'eom2']:(p)=>{
  let s=T(`m\\dfrac{${v}^2}{${l}}=${Sv}-mg\\cos${TH}`,600,100,{size:44,opacity:.8});
  s+=fade(seg(p,.12,.27),L('mg cosθ を 左へ',600,200,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),boxT(`${Sv}=mg\\cos${TH}+m\\dfrac{${v}^2}{${l}}`,600,355,56,1,C.F,true));
  return s;
 },
 [K+'read']:(p)=>{
  const th=.5;
  let s=pend(PX-40,PY,PL,th)+sArrow(PX-40,PY,PL,th,{len:150,txt:'S'});
  s+=sBar(700,430,140,mix(0,150,seg(p,.2,.45)),{g:seg(p,.2,.35)});
  s+=label('S',745,470,{size:30,color:C.F,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.65),L('円を 回るのに 要る 分',980,170,{size:26,color:C.hi}));
  return s;
 },
 [K+'release']:(p)=>{
  const th0=1.0,th=mix(th0,.35,seg(p,.3,.9));
  let s=ghostPend(PX,PY,PL,th0)+angArc(PX,PY,110,th0,{txt:'θ₀',col:C.E})+pend(PX,PY,PL,th);
  s+=fade(seg(p,.05,.2),(()=>{const [bx,by]=bobAt(PX,PY,PL,th0);return label('v ＝ 0',bx+30,by+8,{size:26,color:C.v,weight:700});})());
  s+=card(680,120,470,250,L('振れ角 θ₀ の 端から',915,190,{size:30})+L('そっと 離す',915,250,{size:30,weight:700})+fade(seg(p,.5,.65),L('v は エネルギーで',915,320,{size:26,color:C.E})),seg(p,0,.08));
  return s;
 },
 [K+'drop']:(p)=>{
  const th0=1.0,th=.35,[b0x,b0y]=bobAt(PX,PY,PL,th0),[bx,by]=bobAt(PX,PY,PL,th);
  let s=ghostPend(PX,PY,PL,th0)+pend(PX,PY,PL,th);
  s+=line(PX-40,b0y,b0x+40,b0y,{color:C.faint,w:2,dash:'6 6'})+line(PX-40,by,bx+260,by,{color:C.faint,w:2,dash:'6 6'})+line(b0x,b0y,b0x+250,b0y,{color:C.faint,w:2,dash:'6 6'});
  s+=fade(seg(p,.05,.2),line(PX-30,PY,PX-30,b0y,{color:C.x,w:4})+label('l cosθ₀',PX-40,(PY+b0y)/2+8,{size:24,color:C.x,anchor:'end',weight:700}));
  s+=fade(seg(p,.2,.35),line(PX-80,PY,PX-80,by,{color:C.x,w:4})+label('l cosθ',PX-90,(PY+by)/2+40,{size:24,color:C.x,anchor:'end',weight:700}));
  s+=fade(seg(p,.4,.55),line(b0x+230,b0y,b0x+230,by,{color:C.E,w:6})+label('下がる 高さ',b0x+246,(b0y+by)/2+8,{size:24,color:C.E,weight:700}));
  s+=fade(seg(p,.4,.55),T(`${l}\\cos${TH}-${l}\\cos${TH0}`,900,470,{size:36}));
  return s;
 },
 [K+'ke']:(p)=>{
  let s=boxT(`\\tfrac12 m${v}^2=mg${l}(\\cos${TH}-\\cos${TH0})`,600,200,54);
  s+=fade(seg(p,.3,.45),L('増えた 運動エネルギー',330,360,{size:26,color:CK})+L('＝',600,360,{size:30})+L('減った 位置エネルギー',870,360,{size:26,color:C.E}));
  return s;
 },
 [K+'ke2']:(p)=>{
  let s=T(`\\tfrac12 m${v}^2=mg${l}(\\cos${TH}-\\cos${TH0})`,600,100,{size:42,opacity:.8});
  s+=fade(seg(p,.12,.27),L('両辺 × 2/l',600,195,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),boxT(`m\\dfrac{${v}^2}{${l}}=2mg(\\cos${TH}-\\cos${TH0})`,600,355,54,1,C.hi,true));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(`${Sv}=mg\\cos${TH}+`,430,110,{size:46})+T(`m\\dfrac{${v}^2}{${l}}`,700,110,{size:46});
  s+=highlight(640,50,125,120,1,C.hi);
  s+=fade(seg(p,.15,.3),arrow(700,180,700,240,{color:C.hi,w:4,head:12})+L('2mg(cosθ − cosθ₀) を 入れる',890,220,{size:24,color:C.hi}));
  s+=fade(seg(p,.35,.5),T(`${Sv}=mg\\cos${TH}+2mg(\\cos${TH}-\\cos${TH0})`,600,360,{size:48}));
  return s;
 },
 [K+'sub2']:(p)=>{
  let s=T(`${Sv}=${cH('mg\\cos'+TH)}+${cH('2mg\\cos'+TH)}-2mg\\cos${TH0}`,600,100,{size:44});
  s+=fade(seg(p,.15,.3),L('cosθ の 項： 1 ＋ 2 ＝ 3',600,200,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.35,.5),boxT(`${Sv}=mg(3\\cos${TH}-2\\cos${TH0})`,600,340,62,1,C.F));
  return s;
 },
 [K+'exact']:(p)=>{
  const rows=[['使った もの','ma ＝ F、中心向き v²/l、K＋U 一定',C.ink],['仮定','糸は 伸びない・たるまない、摩擦なし',C.t],['使って いない','sinθ ≈ θ（大きな 振れでも OK）',C.F]];
  let s='';
  rows.forEach(([a,b,col],i)=>{const y=70+i*130;s+=card(110,y,980,108,label(a,150,y+66,{size:28,color:col,weight:700})+label(b,1060,y+66,{size:28,color:C.ink,anchor:'end'}),seg(p,.02+i*.2,.12+i*.2));});
  return s;
 },
 // ===== S5 数値 =====
 [K+'n1']:(p)=>{
  const th0=60*deg;
  let s=ghostPend(PX,PY,PL,th0)+angArc(PX,PY,110,th0,{txt:'60°'})+pend(PX,PY,PL,swingTh(p,th0,1));
  s+=card(660,70,490,370,T(`m=0.1\\ \\mathrm{kg}`,905,140,{size:40})+T(`${TH0}=60^\\circ`,905,215,{size:40})+T(`g=9.8\\ \\mathrm{m/s^2}`,905,290,{size:40})
   +fade(seg(p,.5,.65),T(`mg=0.98\\ \\mathrm{N}`,905,385,{size:44})),seg(p,0,.08));
  return s;
 },
 [K+'n2']:(p)=>{
  let s=T(`${Sv}=mg(3\\cos 0-2\\cos 60^\\circ)`,600,80,{size:40});
  s+=fade(seg(p,.2,.35),T(`=0.98\\times(3-1)=${cF('1.96\\ \\mathrm{N}')}`,600,170,{size:42}));
  s+=wBar(420,450,[['重さ',0.98,C.dim],['最下点の S',1.96,C.F,seg(p,.45,.6)]],{unit:105});
  s+=fade(seg(p,.6,.75),L('2倍',850,320,{size:40,color:C.hi,weight:700}));
  return s;
 },
 [K+'n3']:(p)=>{
  const th0=60*deg;
  let s=pend(240,50,300,th0)+sArrow(240,50,300,th0,{len:55,txt:'S',dx:-6,dy:-26})+gArrow(240,50,300,th0,{len:100});
  s+=label('v ＝ 0',bobAt(240,50,300,th0)[0]+34,bobAt(240,50,300,th0)[1]+40,{size:26,color:C.v,weight:700});
  s+=T(`${Sv}=0.98\\times(1.5-1)=${cF('0.49\\ \\mathrm{N}')}`,800,110,{size:40});
  s+=fade(seg(p,.4,.55),T(`=mg\\cos 60^\\circ`,800,210,{size:42})+L('止まって いる → v²/l の 分は 0',800,300,{size:26,color:C.dim}));
  return s;
 },
 [K+'n4']:(p)=>{
  const A=axes({x:110,y:440,w:500,h:330,xmin:-60,xmax:60,ymin:0,ymax:2.2,xticks:[-60,-30,30,60],yticks:[0.5,1,1.5,2],grid:true,xlabel:'θ [°]',ylabel:'S [N]',xcolor:C.E,ycolor:C.F});
  let s=A.svg+A.plot(t=>0.98*(3*Math.cos(t*deg)-1),{from:-60,to:60,color:C.F,w:5,p:seg(p,.0,.3)});
  s+=line(A.X(-60),A.Y(.98),A.X(60),A.Y(.98),{color:C.dim,w:2,dash:'6 6'})+label('重さ 0.98 N',A.X(-32),A.Y(.98)+30,{size:22,color:C.dim,anchor:'middle'});
  s+=dot(A.X(0),A.Y(1.96),8,C.hi);
  s+=card(680,90,470,330,L('最下点：',915,150,{size:28,color:C.dim})+T(`mg(3-2\\cos${TH0})`,915,225,{size:42})
   +fade(seg(p,.35,.5),L('l が ない',915,310,{size:34,color:C.hi,weight:700})+L('長さに よらず 重さの 2倍',915,370,{size:26}))
   ,seg(p,0,.08));
  return s;
 },
 [K+'q90']:(p)=>{
  const th0=90*deg;
  let s=ghostPend(PX,PY+90,250,th0)+pend(PX,PY+90,250,swingTh(p,th0,.75));
  s+=card(640,90,510,300,L('真横 90° から 離すと',895,165,{size:30})+L('最下点の S は',895,235,{size:30})+L('重さの 何倍？',895,305,{size:36,color:C.hi,weight:700}),seg(p,0,.08),C.hi);
  return s;
 },
 [K+'a90']:(p)=>{
  let s=T(`${Sv}=mg(3\\cdot 1-2\\cdot 0)=3mg`,600,75,{size:44});
  s+=fade(seg(p,.2,.35),T(`=3\\times0.98=${cF('2.94\\ \\mathrm{N}')}`,600,160,{size:42}));
  s+=wBar(400,465,[['重さ',0.98,C.dim],['60° から',1.96,C.F],['90° から',2.94,C.F,seg(p,.3,.45)]],{unit:68});
  return s;
 },
 // ===== S6 まとめ =====
 [K+'sum']:(p)=>{
  let s=card(90,60,1020,150,L('周期 → g',230,145,{size:28,color:C.dim})+T(`g=\\dfrac{4\\pi^2${l}}{${Tp}^2}`,640,135,{size:50}),seg(p,0,.08),C.F);
  s+=card(90,250,1020,170,L('糸の 力',230,345,{size:28,color:C.dim})+T(`${Sv}=mg(3\\cos${TH}-2\\cos${TH0})`,640,335,{size:50}),seg(p,.3,.4),C.F);
  return s;
 },
 [K+'real']:(p)=>{
  const th=.6*Math.exp(-2.2*p)*Math.cos(2*Math.PI*3*p);
  let s=pend(PX,PY,PL,th);
  s+=card(640,80,510,350,L('摩擦・空気抵抗',895,135,{size:28,color:C.dim})+miniCurve(680,280,420,100,u=>Math.exp(-3*u)*Math.cos(2*Math.PI*5*u),{p:seg(p,.0,.9)})+L('やがて 止まる',895,410,{size:30,color:C.a,weight:700}),seg(p,0,.08));
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(150,60,900,380,L('速度に 比例する 抵抗 を 入れると？',600,130,{size:32,color:C.hi,weight:700})
   +fade(seg(p,.2,.35),L('方程式 は？　エネルギー は？',600,210,{size:30}))
   +fade(seg(p,.4,.55),miniCurve(260,330,680,80,u=>Math.exp(-3*u)*Math.cos(2*Math.PI*6*u),{p:seg(p,.4,.95)}))
   +fade(seg(p,.6,.75),L('揺れは どう 減る？',600,425,{size:30,color:C.hi})),seg(p,0,.08),C.hi);
  return s;
 },
};

function pendMini(x,y,p){
 const th=swingTh(p,.4,3);const px=x,py=y-60;return pend(px,py,140,th,{r:14,ref:1});
}
function vArrowSigned(px,py,Lp,th,p){
 // velocity of a swing θ(p)=.9cos(2π·1.25p): dθ/dp ∝ −sin
 const w=-Math.sin(2*Math.PI*1.25*p);const len=110*w;if(Math.abs(len)<6)return '';
 const [bx,by]=bobAt(px,py,Lp,th),tx=Math.cos(th),ty=-Math.sin(th);
 return arrow(bx,by,bx+tx*len,by+ty*len,{color:C.v,w:5,head:14});
}
