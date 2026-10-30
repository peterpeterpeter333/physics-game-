// YouTube シリーズ「慣性力と軌道・上級 2/4」(ys-uc-frontier-2) — 図。Stage 1200×515.
// 真上から見た平面。原点＝太陽、x 右・y 上、θ は x 軸から反時計回り。画面の y は下向きなので、点 (x,y) は (OX+x, OY−y) に描く。
// 色：r・𝐞r 水色、𝐞θ 黄、速度 紫、加速度 赤、角度 橙、力 緑、h・面積 黄の薄い塗り。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly} from './anim.mjs';

const K='uc-frontier-2:';
const SUN='#ffcf67',CR=C.x,CTH=C.hi,CV=C.v,CA=C.a,CF=C.F,CANG=C.E;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const top=(t='真上から見た図')=>label(t,30,40,{size:22,color:C.dim});
const rh=cs(CR,'\\mathbf e_r'),th=cs(CTH,'\\mathbf e_\\theta');
const d=(a,b='t')=>`\\frac{d${a}}{d${b}}`,dd=(a,b='t')=>`\\frac{d^2${a}}{d${b}^2}`;
const D=(a,b='t')=>`\\dfrac{d${a}}{d${b}}`,DD=(a,b='t')=>`\\dfrac{d^2${a}}{d${b}^2}`;
const sun=(x,y,r=16)=>dot(x,y,r,SUN);
const planet=(x,y,r=11)=>dot(x,y,r,C.x)+ring(x,y,r,{color:C.ink,w:2});
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function rightMark(x,y,ux,uy,vx,vy,q=13,color=C.dim){return line(x+ux*q,y+uy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w:2})+line(x+vx*q,y+vy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w:2});}

// ---- polar picture -------------------------------------------------------------------------------
const OX=130,OY=420,RR=300,U=95;
function polar(th0,{axes=1,rline=1,ang=1,rhat=0,thhat=0,rlab=1,g=1,ox=OX,oy=OY,R=RR}={}){
 const x=ox+R*Math.cos(th0),y=oy-R*Math.sin(th0);let s='';
 if(axes)s+=arrow(ox-20,oy,ox+R+80,oy,{color:C.faint,w:2,head:12})+label('x',ox+R+90,oy+8,{size:22,color:C.dim});
 s+=sun(ox,oy);
 if(rline)s+=line(ox,oy,x,y,{color:CR,w:3,opacity:.7})+(rlab?T(cs(CR,'r'),ox+R*.5*Math.cos(th0)-20*Math.sin(th0),oy-R*.5*Math.sin(th0)-20*Math.cos(th0),{size:30}):'');
 if(ang)s+=draw(circPts(ox,oy,62,0,th0,24),1,{color:CANG,w:3})+T(cs(CANG,'\\theta'),ox+84*Math.cos(th0/2),oy-84*Math.sin(th0/2)+10,{size:28});
 if(rhat)s+=fade(rhat,arrow(x,y,x+U*Math.cos(th0),y-U*Math.sin(th0),{color:CR,w:6,head:16})+T(rh,x+(U+30)*Math.cos(th0),y-(U+30)*Math.sin(th0)+8,{size:32}));
 if(thhat)s+=fade(thhat,arrow(x,y,x-U*Math.sin(th0),y-U*Math.cos(th0),{color:CTH,w:6,head:16})+T(th,x-(U+28)*Math.sin(th0)-6,y-(U+28)*Math.cos(th0)+4,{size:32})+rightMark(x,y,Math.cos(th0),-Math.sin(th0),-Math.sin(th0),-Math.cos(th0),13,C.dim));
 s+=planet(x,y);
 return fade(g,s);
}
const TH0=.62;
// derivation card on the right
const rcard=(inner,g=1,stroke=C.faint)=>card(600,60,570,400,inner,g,stroke);
function lines(list,p,{x=885,y0=120,dy=90}={}){return list.map(([s,a,o={}],i)=>fade(a==null?1:seg(p,a,a+.12),T(s,o.x??x,o.y??(y0+i*dy),{size:o.size??38,opacity:o.dim?.45:1}))).join('');}

// ---- ledger for the acceleration --------------------------------------------------------------------
const sd=(a)=>`d${a}/dt`,sdd=(a)=>`d^2${a}/dt^2`;
const VEQ=`${cs(CV,'\\mathbf v')}=${cs('#d9c8ff','\\underbrace{'+D('r')+'\\,'+rh+'}_{1}')}+${cs('#ffb0e0','\\underbrace{r\\,'+D('\\theta')+'\\,'+th+'}_{2}')}`;
const VEQs=`${cs(CV,'\\mathbf v')}=${cs('#d9c8ff','\\underbrace{('+sd('r')+')\\,'+rh+'}_{1}')}+${cs('#ffb0e0','\\underbrace{r\\,('+sd('\\theta')+')\\,'+th+'}_{2}')}`;
const ROWS=[
 ['1','dr/dt を 微分',`${sdd('r')}`,''],
 ['1','𝐞r を 微分','',`(${sd('r')})(${sd('\\theta')})`],
 ['2','r を 微分','',`(${sd('r')})(${sd('\\theta')})`],
 ['2','dθ/dt を 微分','',`r\\,(${sdd('\\theta')})`],
 ['2','𝐞θ を 微分',`-r\\,(${sd('\\theta')})^{2}`,''],
];
const XR=615,XT=965,LY0=175,LDY=50;
function ledger(n,{hi=-1,sumR=0,sumT=0,showV=1,g=1}={}){
 let s=showV?T(VEQs,600,58,{size:30}):'';
 s+=line(60,LY0-30,1150,LY0-30,{color:C.faint,w:2})+L('どこを 微分',230,LY0-40,{size:22,color:C.dim})+T(rh,XR,LY0-46,{size:30})+T(th,XT,LY0-46,{size:30});
 s+=line(450,LY0-70,450,LY0+5*LDY-10,{color:C.faint,w:2})+line(780,LY0-70,780,LY0+5*LDY-10,{color:C.faint,w:2});
 for(let i=0;i<n;i++){const [k,lab,R,Tt]=ROWS[i],y=LY0+i*LDY+10,on=i===hi;
  if(on)s+=rect(56,y-32,1098,LDY-4,{fill:C.hi,fo:.07,stroke:C.hi,sw:1.5,rx:8});
  s+=L(k==='1'?'①':'②',90,y+8,{size:26,color:k==='1'?'#d9c8ff':'#ffb0e0',weight:700})+L(lab,280,y+8,{size:24});
  if(R)s+=T(R,XR,y,{size:30});if(Tt)s+=T(Tt,XT,y,{size:30});}
 const yS=LY0+5*LDY+40;
 if(sumR||sumT)s+=line(450,yS-36,1150,yS-36,{color:C.dim,w:2.5});
 if(sumR)s+=fade(sumR,T(`${sdd('r')}-r\\,(${sd('\\theta')})^{2}`,XR,yS,{size:30})+rect(XR-145,yS-30,290,56,{fill:CA,fo:.06,stroke:CA,sw:2,rx:10}));
 if(sumT)s+=fade(sumT,T(`2(${sd('r')})(${sd('\\theta')})+r\\,(${sdd('\\theta')})`,XT,yS,{size:26})+rect(XT-178,yS-30,356,56,{fill:CA,fo:.06,stroke:CA,sw:2,rx:10}));
 if(sumR||sumT)s+=L('合計',230,yS+8,{size:24,color:CA,weight:700});
 return fade(g,s);
}

// ---- ellipse orbit used at the start ----------------------------------------------------------------
function orbit(p,{cx=300,cy=270,a=230,e=.6}={}){
 const b=a*Math.sqrt(1-e*e),fx=cx+a*e;
 const Ean=t=>{const M=2*Math.PI*t;let E=M;for(let i=0;i<30;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E;};
 const E=Ean(p),x=cx+a*Math.cos(E),y=cy-b*Math.sin(E);
 return {fx,fy:cy,x,y,svg:draw(Array.from({length:121},(_,i)=>{const u=2*Math.PI*i/120;return [cx+a*Math.cos(u),cy-b*Math.sin(u)];}),1,{color:C.dim,w:2,dash:'6 7'})+sun(fx,cy,18)};
}

export const ytUcFrontier2Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  let s=top()+polar(TH0+.3*p,{rhat:0});
  s+=rcard(L('前回の 最後の 問い',885,115,{size:24,color:C.dim})+L('中心からの 距離 r と 角度 θ で',885,200,{size:28,weight:700})
   +fade(seg(p,.35,.5),L('加速度は どんな 形？',885,290,{size:36,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'why']:(p)=>{
  const O=orbit(.05+.55*p);let s=top()+O.svg;
  const dx=O.x-O.fx,dy=O.y-O.fy,l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l;
  s+=line(O.fx,O.fy,O.x,O.y,{color:CR,w:3})+planet(O.x,O.y);
  s+=fade(seg(p,.45,.6),arrow(O.x,O.y,O.x+ux*80,O.y+uy*80,{color:CR,w:4,head:13})+arrow(O.x,O.y,O.x+uy*80,O.y-ux*80,{color:CTH,w:4,head:13})+rightMark(O.x,O.y,ux,uy,uy,-ux,12));
  s+=fade(seg(p,.45,.6),arrow(O.x-ux*16,O.y-uy*16,O.x-ux*70,O.y-uy*70,{color:CF,w:5,head:14}));
  s+=rcard(L('楕円の 軌道',885,115,{size:26,color:C.dim})+L('r も θ も 時間で 変わる',885,180,{size:28,weight:700})
   +fade(seg(p,.45,.6),L('引力は 太陽を 向く',885,260,{size:28,color:CF,weight:700})+L('太陽向き と それに 直角な 向き',885,325,{size:26,weight:700})+L('に 分けて 書きたい',885,375,{size:26,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=top()+polar(TH0,{rhat:1});
  s+=rcard(L('太陽から 離れる 向きの 加速度は',885,130,{size:26,weight:700})
   +T(DD('r'),885,240,{size:54})+fade(seg(p,.3,.45),L('だけ？',1040,255,{size:40,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 // ===== S2 =====
 [K+'coord']:(p)=>{
  let s=top()+polar(TH0*seg(p,.1,.6)+.001,{rlab:1});
  s+=rcard(L('原点 ＝ 太陽',885,130,{size:28,color:SUN,weight:700})+L('θ：x 軸から 反時計回り',885,210,{size:28,color:CANG,weight:700})+L('r：太陽からの 距離',885,280,{size:28,color:CR,weight:700})+L('どちらも 時刻 t の 関数',885,360,{size:24,color:C.dim}),seg(p,.02,.12));
  return s;
 },
 [K+'rhat']:(p)=>{
  let s=top()+polar(TH0,{rhat:seg(p,.05,.2)});
  s+=rcard(L('r の 向きを 指す 長さ 1 の 矢印',885,115,{size:24,color:C.dim})+T(`${rh}=(\\cos\\theta,\\ \\sin\\theta)`,885,200,{size:40})
   +fade(seg(p,.5,.65),L('位置の 矢印',885,290,{size:24,color:C.dim})+T(`\\mathbf r=r\\,${rh}`,885,360,{size:46})),seg(p,.02,.12));
  return s;
 },
 [K+'thhat']:(p)=>{
  let s=top()+polar(TH0,{rhat:1,thhat:seg(p,.1,.25)});
  s+=rcard(L('θ が 増える 向きの 長さ 1 の 矢印',885,115,{size:24,color:C.dim})+T(`${th}=(-\\sin\\theta,\\ \\cos\\theta)`,885,200,{size:40})
   +fade(seg(p,.5,.65),L('𝐞r を 90° 回した 向き',885,300,{size:28,color:CTH,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'turns']:(p)=>{
  const a=.25+.9*p;let s=top();
  s+=fade(.35,polar(.25,{rhat:1,thhat:1,ang:0,rlab:0}));
  s+=polar(a,{rhat:1,thhat:1,ang:1,rlab:0,axes:0});
  s+=rcard(L('x・y の 矢印は 向きが 一定',885,120,{size:26,color:C.dim})
   +L('𝐞r と 𝐞θ は、回ると 向きが 変わる',885,200,{size:28,weight:700})
   +fade(seg(p,.5,.65),L('→ 時間で 微分しても 0 で ない',885,300,{size:30,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'dcos']:(p)=>{
  let s=top()+polar(TH0,{rhat:1});
  s+=rcard(L('𝐞r の x 成分を t で 微分',885,105,{size:24,color:C.dim})
   +T(`${D('')}\\cos\\theta=-\\sin\\theta\\times${D('\\theta')}`,885,200,{size:38})
   +fade(seg(p,.4,.55),L('θ を 通す 連鎖律',885,300,{size:26,color:CANG,weight:700})+T(`\\frac{d}{d\\theta}\\cos\\theta\\ \\times\\ ${d('\\theta')}`,885,370,{size:32})),seg(p,.02,.12));
  return s;
 },
 [K+'dsin']:(p)=>{
  let s=top()+polar(TH0,{rhat:1});
  s+=rcard(T(`${D('')}\\cos\\theta=-\\sin\\theta\\times${D('\\theta')}`,885,130,{size:34,opacity:.6})
   +T(`${D('')}\\sin\\theta=\\cos\\theta\\times${D('\\theta')}`,885,250,{size:38})
   +fade(seg(p,.5,.65),L('並べると',885,340,{size:24,color:C.dim})+T(`(-\\sin\\theta,\\ \\cos\\theta)\\times${d('\\theta')}`,885,400,{size:34})),seg(p,.02,.12));
  return s;
 },
 [K+'drhat']:(p)=>{
  let s=top()+polar(TH0,{rhat:1,thhat:seg(p,.05,.2)});
  s+=rcard(T(`(-\\sin\\theta,\\ \\cos\\theta)=${th}`,885,130,{size:38})
   +fade(seg(p,.3,.45),T(`${D(rh)}=${D('\\theta')}\\,${th}`,885,260,{size:50})+rect(700,182,370,150,{fill:C.hi,fo:.05,stroke:C.hi,sw:2.5,rx:12}))
   +fade(seg(p,.6,.75),L('𝐞r は 𝐞θ の 向きに 変わる',885,400,{size:28,color:CTH,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'pic']:(p)=>{
  // unit circle zoom: r-hat at θ and θ+Δθ, difference ≈ Δθ θ-hat
  const cx=250,cy=390,R=270,t1=.55,dt=.32*seg(p,.05,.4)+.001,t2=t1+dt;let s=label('長さ 1 の 矢印を 拡大',30,40,{size:22,color:C.dim});
  s+=draw(circPts(cx,cy,R,.2,1.4,40),1,{color:C.faint,w:2,dash:'5 6'})+sun(cx,cy,10);
  const P1=[cx+R*Math.cos(t1),cy-R*Math.sin(t1)],P2=[cx+R*Math.cos(t2),cy-R*Math.sin(t2)];
  s+=arrow(cx,cy,P1[0],P1[1],{color:CR,w:5,head:15})+T(`${rh}(\\theta)`,P1[0]+16,P1[1]+26,{size:28,anchor:'start'});
  s+=arrow(cx,cy,P2[0],P2[1],{color:CR,w:5,head:15,opacity:.75})+fade(seg(p,.3,.4),T(`${rh}(\\theta+\\Delta\\theta)`,P2[0]-14,P2[1]-20,{size:28,anchor:'end'}));
  s+=draw(circPts(cx,cy,80,t1,t2,12),1,{color:CANG,w:3})+fade(seg(p,.3,.4),T(cs(CANG,'\\Delta\\theta'),cx+112*Math.cos((t1+t2)/2),cy-112*Math.sin((t1+t2)/2)+8,{size:26}));
  s+=fade(seg(p,.4,.55),arrow(P1[0],P1[1],P2[0],P2[1],{color:CTH,w:5,head:13}));
  s+=rcard(L('先の 動き：長さ ≈ 1 × Δθ',885,120,{size:26,color:CTH,weight:700})+fade(seg(p,.4,.55),T(`\\Delta${rh}\\approx\\Delta\\theta\\ ${th}`,885,210,{size:44}))
   +fade(seg(p,.6,.75),L('中級：速度の 矢印が Δθ 回る 図',885,310,{size:24,color:C.dim})+L('と 同じ 形',885,355,{size:24,color:C.dim})),seg(p,.02,.12));
  return s;
 },
 [K+'dth1']:(p)=>{
  let s=top()+polar(TH0,{rhat:1,thhat:1});
  s+=rcard(L('𝐞θ ＝ (−sinθ, cosθ) を 微分',885,110,{size:24,color:C.dim})
   +T(`${D('')}(-\\sin\\theta)=-\\cos\\theta\\times${D('\\theta')}`,885,200,{size:34})
   +fade(seg(p,.3,.45),T(`${D('')}\\cos\\theta=-\\sin\\theta\\times${D('\\theta')}`,885,300,{size:34}))
   +fade(seg(p,.6,.75),T(`(-\\cos\\theta,\\ -\\sin\\theta)\\times${d('\\theta')}`,885,400,{size:34})),seg(p,.02,.12));
  return s;
 },
 [K+'dthhat']:(p)=>{
  let s=top()+polar(TH0,{rhat:1,thhat:1});
  const x=OX+RR*Math.cos(TH0),y=OY-RR*Math.sin(TH0);
  s+=fade(seg(p,.1,.25),arrow(x,y,x-70*Math.cos(TH0),y+70*Math.sin(TH0),{color:CR,w:4,head:13,opacity:.8})+L('−𝐞r',x-60*Math.cos(TH0)+34*Math.sin(TH0),y+60*Math.sin(TH0)+34*Math.cos(TH0)+10,{size:26,color:CR,weight:700}));
  s+=rcard(T(`(-\\cos\\theta,\\ -\\sin\\theta)=-${rh}`,885,130,{size:38})
   +fade(seg(p,.3,.45),T(`${D(th)}=-${D('\\theta')}\\,${rh}`,885,260,{size:48})+rect(690,182,390,150,{fill:C.hi,fo:.05,stroke:C.hi,sw:2.5,rx:12}))
   +fade(seg(p,.6,.75),L('𝐞θ は 内向き（−𝐞r）に 変わる',885,400,{size:26,color:CR,weight:700})),seg(p,.02,.12));
  return s;
 },
 // ===== S3 速度 =====
 [K+'v2']:(p)=>{
  let s=top()+polar(TH0,{rhat:.5,thhat:.5});
  s+=rcard(T(`\\mathbf v=${D('')}\\left(r\\,${rh}\\right)`,885,120,{size:36})
   +fade(seg(p,.3,.45),L('r を 微分',780,205,{size:22,color:C.dim})+T(`${D('r')}\\,${rh}`,780,265,{size:34}))
   +fade(seg(p,.55,.7),L('𝐞r を 微分',1000,205,{size:22,color:C.dim})+T(`r\\,${D('\\theta')}\\,${th}`,1000,265,{size:34}))
   +fade(seg(p,.75,.88),T(VEQ.replace(/\\underbrace\{/g,'{').replace(/\}_\{[12]\}/g,'}'),885,380,{size:36})),seg(p,.02,.12));
  return s;
 },
 [K+'v3']:(p)=>{
  const x=OX+RR*Math.cos(TH0),y=OY-RR*Math.sin(TH0),c=Math.cos(TH0),sn=Math.sin(TH0);
  let s=top()+polar(TH0,{rlab:1});
  const a1=60,a2=110;
  s+=arrow(x,y,x+a1*c,y-a1*sn,{color:'#d9c8ff',w:5,head:14})+arrow(x,y,x-a2*sn,y-a2*c,{color:'#ffb0e0',w:5,head:14});
  s+=line(x+a1*c,y-a1*sn,x+a1*c-a2*sn,y-a1*sn-a2*c,{color:C.faint,w:2,dash:'5 5'})+line(x-a2*sn,y-a2*c,x+a1*c-a2*sn,y-a1*sn-a2*c,{color:C.faint,w:2,dash:'5 5'});
  s+=arrow(x,y,x+a1*c-a2*sn,y-a1*sn-a2*c,{color:CV,w:6,head:16})+T(cs(CV,'\\mathbf v'),x+a1*c-a2*sn+14,y-a1*sn-a2*c-6,{size:32,anchor:'start'});
  s+=rcard(L('① 太陽から 遠ざかる 速さ',885,120,{size:26,color:'#d9c8ff',weight:700})+T(D('r'),885,190,{size:38})
   +fade(seg(p,.4,.55),L('② 回る 向きの 速さ',885,280,{size:26,color:'#ffb0e0',weight:700})+T(`r\\,${D('\\theta')}=${cs(C.hi,'v_{\\perp}')}`,885,360,{size:38})),seg(p,.02,.12));
  return s;
 },
 // ===== S4 加速度 =====
 [K+'a0']:(p)=>{
  let s=T(VEQ,600,90,{size:40});
  s+=fade(seg(p,.25,.4),L('① も ② も 積 → 積の 微分で 項が 増える',600,230,{size:30,weight:700}));
  s+=fade(seg(p,.55,.7),L('① から 2項、② から 3項',600,310,{size:30,color:C.hi,weight:700})+L('帳簿に 1つずつ 書く',600,380,{size:26,color:C.dim}));
  return s;
 },
 [K+'a1']:(p)=>ledger(seg(p,.2,.35)>0?1:0,{hi:0}),
 [K+'a1b']:(p)=>ledger(seg(p,.2,.35)>0?2:1,{hi:1}),
 [K+'a2']:(p)=>ledger(seg(p,.35,.5)>0?3:2,{hi:2}),
 [K+'a3']:(p)=>ledger(seg(p,.25,.4)>0?4:3,{hi:3}),
 [K+'a4']:(p)=>ledger(seg(p,.25,.4)>0?5:4,{hi:4}),
 [K+'colR']:(p)=>ledger(5,{sumR:seg(p,.1,.25)})+fade(seg(p,.55,.7),L('d²r/dt² だけ で ない',230,505,{size:22,color:C.hi,weight:700})),
 [K+'colT']:(p)=>ledger(5,{sumR:1,sumT:seg(p,.25,.4)})+fade(seg(p,.05,.2),rect(XT-140,LY0+LDY-24,280,2*LDY-2,{fill:'none',fo:0,stroke:C.hi,sw:2.5,rx:8})+L('同じ 項 が 2回',XT-160,LY0+LDY+38,{size:24,color:C.hi,weight:700,anchor:'end'})),
 // ===== S5 円で確かめる =====
 [K+'c1']:(p)=>{
  const cx=280,cy=275,R=180,u=.4+1.4*p;let s=top()+ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'})+sun(cx,cy);
  const x=cx+R*Math.cos(u),y=cy-R*Math.sin(u);s+=line(cx,cy,x,y,{color:CR,w:3})+planet(x,y)+T(cs(CR,'r'),(cx+x)/2-16*Math.sin(u),(cy+y)/2-16*Math.cos(u),{size:30});
  s+=rcard(L('等速円運動',885,115,{size:28,weight:700})+L('r は 一定',885,190,{size:28,color:CR,weight:700})+T(`${D('r')}=0,\\ \\ ${DD('r')}=0`,885,260,{size:34})
   +fade(seg(p,.45,.6),T(`${D('\\theta')}=\\omega,\\ \\ ${DD('\\theta')}=0`,885,370,{size:34})),seg(p,.02,.12));
  return s;
 },
 [K+'c2']:(p)=>{
  const cx=280,cy=275,R=180,u=1.9;let s=top()+ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'})+sun(cx,cy);
  const x=cx+R*Math.cos(u),y=cy-R*Math.sin(u);s+=line(cx,cy,x,y,{color:CR,w:3})+planet(x,y);
  s+=fade(seg(p,.4,.55),arrow(x-16*Math.cos(u)+16*Math.sin(u),y+16*Math.sin(u)+16*Math.cos(u),x-90*Math.cos(u)+16*Math.sin(u),y+90*Math.sin(u)+16*Math.cos(u),{color:CA,w:6,head:15})+T(cs(CA,'r\\omega^2'),x-60*Math.cos(u)+50,y+60*Math.sin(u)+10,{size:30,anchor:'start'}));
  s+=rcard(L('𝐞r 成分',760,120,{size:24,color:CR,weight:700})+T(`0-r\\omega^2`,760,190,{size:36})+L('𝐞θ 成分',1010,120,{size:24,color:CTH,weight:700})+T(`0+0`,1010,190,{size:36})
   +fade(seg(p,.4,.55),L('中心向きに rω²',885,290,{size:32,color:CA,weight:700}))
   +fade(seg(p,.6,.75),L('中級の 円運動の 加速度と 一致',885,370,{size:26,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'c3']:(p)=>{
  let s=lines([[`r=2\\ \\mathrm{m},\\quad ${D('\\theta')}=3\\ \\mathrm{rad/s}`,0,{x:600,y:110,size:40}],[`-r\\left(${d('\\theta')}\\right)^{2}=-2\\times3^2`,.25,{x:600,y:240,size:44}],[`=-18\\ \\mathrm{m/s^2}`,.5,{x:600,y:350,size:48}]],p);
  s+=fade(seg(p,.7,.82),L('中心向きに 18 m/s²',600,460,{size:32,color:CA,weight:700}));
  return s;
 },
 [K+'eomR']:(p)=>{
  let s=T(`m\\left[${DD('r')}-r\\left(${D('\\theta')}\\right)^{2}\\right]=${cs(CF,'F')}`,600,100,{size:44});
  s+=L('F：力の 𝐞r の 向きの 成分',600,195,{size:24,color:C.dim});
  s+=fade(seg(p,.3,.42),L('−mr(dθ/dt)² を 右辺へ',600,270,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.55,.7),T(`m\\,${DD('r')}=${cs(CF,'F')}+${cs(CF,'mr\\left('+D('\\theta')+'\\right)^{2}')}`,600,390,{size:48}));
  return s;
 },
 [K+'cf']:(p)=>{
  let s=T(`m\\,${DD('r')}=${cs(CF,'F')}+${cs(CF,'mr\\left('+D('\\theta')+'\\right)^{2}')}`,600,90,{size:42});
  {const w=texWidth(`m\\,${DD('r')}=${cs(CF,'F')}+${cs(CF,'mr\\left('+D('\\theta')+'\\right)^{2}')}`,42,false);s+=fade(seg(p,.1,.25),L('← 外向きの 項',600+w/2+20,108,{size:24,color:CF,weight:700,anchor:'start'}));}
  s+=fade(seg(p,.35,.5),card(200,230,800,220,L('惑星と 一緒に 回る 観測者',600,280,{size:26,color:C.dim})+L('遠心力 mrω² と 同じ 形',600,350,{size:34,color:CF,weight:700})+L('（1本目：回る 観測者の 式に 加わる 項）',600,410,{size:22,color:C.dim}),1,CF));
  return s;
 },
 // ===== S6 =====
 [K+'t0']:(p)=>{
  let s=top()+polar(TH0,{rhat:1,thhat:1});
  const x=OX+RR*Math.cos(TH0),y=OY-RR*Math.sin(TH0);
  s+=arrow(x-16*Math.cos(TH0),y+16*Math.sin(TH0),x-110*Math.cos(TH0),y+110*Math.sin(TH0),{color:CF,w:6,head:16})+T(cs(CF,'\\mathbf F'),x-90*Math.cos(TH0)+30,y+90*Math.sin(TH0)+24,{size:30});
  s+=rcard(L('万有引力は 太陽を 向く',885,120,{size:28,color:CF,weight:700})+L('𝐞θ の 向きの 成分 ＝ 0',885,200,{size:28,weight:700})
   +fade(seg(p,.4,.55),L('だから',885,280,{size:24,color:C.dim})+T(`2${D('r')}${D('\\theta')}+r\\,${DD('\\theta')}=0`,885,370,{size:36})),seg(p,.02,.12));
  return s;
 },
 [K+'t1']:(p)=>{
  let s=T(`2${D('r')}${D('\\theta')}+r\\,${DD('\\theta')}`,600,110,{size:44});
  s+=fade(seg(p,.3,.45),L('実は',600,220,{size:28,color:C.dim}));
  s+=fade(seg(p,.4,.55),T(`=\\dfrac{1}{r}\\,${D('')}\\!\\left(${cs(C.hi,'r^2'+D('\\theta'))}\\right)`,600,340,{size:52}));
  return s;
 },
 [K+'t2']:(p)=>{
  let s=T(`${D('')}\\!\\left(r^2\\,${D('\\theta')}\\right)`,600,90,{size:44});
  s+=fade(seg(p,.2,.35),L('積の 微分',600,175,{size:26,color:C.dim}));
  s+=fade(seg(p,.35,.5),T(`=2r${D('r')}\\,${D('\\theta')}`,420,300,{size:42}));
  s+=fade(seg(p,.55,.7),T(`+\\ r^2\\,${DD('\\theta')}`,840,300,{size:42}));
  s+=fade(seg(p,.35,.5),L('r² を 微分',420,400,{size:22,color:C.dim}))+fade(seg(p,.55,.7),L('dθ/dt を 微分',840,400,{size:22,color:C.dim}));
  return s;
 },
 [K+'t3']:(p)=>{
  let s=T(`${D('')}\\!\\left(r^2\\,${D('\\theta')}\\right)=2r${D('r')}\\,${D('\\theta')}+r^2\\,${DD('\\theta')}`,600,90,{size:38,opacity:.6});
  s+=L('r で 割る',600,190,{size:28,color:C.hi,weight:700});
  s+=fade(seg(p,.2,.35),T(`\\dfrac{1}{r}${D('')}\\!\\left(r^2\\,${D('\\theta')}\\right)=2${D('r')}${D('\\theta')}+r\\,${DD('\\theta')}`,600,310,{size:44}));
  s+=fade(seg(p,.55,.7),L('＝ 𝐞θ 成分',600,430,{size:30,color:CTH,weight:700}));
  return s;
 },
 [K+'h']:(p)=>{
  let s=T(`\\dfrac{1}{r}${D('')}\\!\\left(r^2\\,${D('\\theta')}\\right)=0`,600,100,{size:44});
  s+=fade(seg(p,.25,.4),L('→ 時間で 変わらない',600,210,{size:28,weight:700}));
  s+=fade(seg(p,.45,.6),T(`r^2\\,${D('\\theta')}=${cs(C.hi,'h')}`,600,330,{size:58})+rect(390,232,420,168,{fill:C.hi,fo:.05,stroke:C.hi,sw:2.5,rx:12}));
  s+=fade(seg(p,.6,.75),L('h：一定の 値（ここで 決めた 名前）',600,460,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'hL']:(p)=>{
  let s=lines([[`L=mr\\,${cs(C.hi,'v_{\\perp}')},\\quad ${cs(C.hi,'v_{\\perp}')}=r\\,${D('\\theta')}`,0,{x:600,y:100,size:40}],[`L=m\\,r^2\\,${D('\\theta')}=m\\,${cs(C.hi,'h')}`,.35,{x:600,y:250,size:46}],[`${cs(C.hi,'h')}=\\dfrac{L}{m}`,.65,{x:600,y:390,size:50}]],p);
  return s;
 },
 [K+'area']:(p)=>{
  const ox=150,oy=420,R=300,t1=.45,t2=.45+.35*seg(p,.05,.45)+.001;let s=top()+sun(ox,oy);
  s+=poly([[ox,oy],...circPts(ox,oy,R,t1,t2,20)],{fill:C.hi,fo:.3,stroke:C.hi,sw:1.5});
  s+=line(ox,oy,ox+R*Math.cos(t1),oy-R*Math.sin(t1),{color:CR,w:3})+planet(ox+R*Math.cos(t2),oy-R*Math.sin(t2));
  s+=fade(seg(p,.2,.35),T(`r\\,d\\theta`,ox+(R+40)*Math.cos((t1+t2)/2),oy-(R+40)*Math.sin((t1+t2)/2),{size:28}));
  s+=rcard(L('細い 三角形：底辺 r、高さ r dθ',885,120,{size:24,color:C.dim})
   +fade(seg(p,.2,.35),T(`dA=\\tfrac12\\,r\\cdot r\\,d\\theta`,885,200,{size:38}))
   +fade(seg(p,.45,.6),T(`${D('A')}=\\tfrac12\\,r^2${D('\\theta')}=\\dfrac{${cs(C.hi,'h')}}{2}`,885,310,{size:40}))
   +fade(seg(p,.7,.82),L('一定 → ケプラーの 第2法則',885,410,{size:28,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=L('極座標の 加速度',600,55,{size:26,color:C.dim});
  s+=T(`${rh}:\\ \\ ${DD('r')}-r\\left(${D('\\theta')}\\right)^{2}`,600,150,{size:44});
  s+=T(`${th}:\\ \\ 2${D('r')}${D('\\theta')}+r\\,${DD('\\theta')}`,600,270,{size:44});
  s+=fade(seg(p,.5,.65),L('中心力 → ',430,400,{size:30,color:CF,weight:700})+T(`r^2\\,${D('\\theta')}=${cs(C.hi,'h')}`,700,390,{size:44})+L('一定',880,402,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'rest']:(p)=>{
  let s=T(`m\\left[${DD('r')}-r\\left(${D('\\theta')}\\right)^{2}\\right]=${cs(CF,'-\\dfrac{GMm}{r^2}')}`,600,110,{size:42});
  s+=fade(seg(p,.35,.5),L('両辺を m で 割る',600,225,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.5,.65),T(`${DD('r')}-r\\left(${D('\\theta')}\\right)^{2}=-\\dfrac{GM}{r^2}`,600,350,{size:50})+rect(250,255,700,160,{fill:CA,fo:.04,stroke:CA,sw:2,rx:12}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=T(`${DD('r')}-r\\left(${D('\\theta')}\\right)^{2}=-\\dfrac{GM}{r^2}`,600,90,{size:40,opacity:.7});
  s+=fade(seg(p,.1,.25),L('r と t が 絡んで 解きにくい',600,185,{size:26,color:C.dim}));
  s+=card(250,240,700,230,L('次の 問い',600,285,{size:24,color:C.dim})+T(`u=\\dfrac{1}{r},\\qquad t\\ \\to\\ \\theta`,600,360,{size:44})
   +fade(seg(p,.5,.65),L('置き換えると どうなる？',600,440,{size:32,color:C.hi,weight:700})),seg(p,.35,.48),C.hi);
  return s;
 },
};
