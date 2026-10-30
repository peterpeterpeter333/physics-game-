// YouTube シリーズ「ローレンツ力・中級 2/2」(ys-um-magnetic-force-2) — 図。Stage 1200×515.
// 正面図：x 右、z 上、𝐁＝Bŷ は奥向き（⊗）。正電荷は下の点から右へ → 反時計回り（φ 増加）。
//   位置 (cx+R cosφ, cy−R sinφ)、𝐯 の向き (−sinφ, −cosφ)、𝐅 の向き（中心）(−cosφ, sinφ)（画面座標）。
//   検算：下 𝐯 右 → x̂×ŷ＝ẑ 上。右 𝐯 上 → ẑ×ŷ＝−x̂ 左。上 𝐯 左 → (−x̂)×ŷ＝−ẑ 下。
// らせん（斜投影 x 右・y 奥・z 上、𝐁＝Bx̂ 右向き）：正電荷は ω⃗＝−(qB/m)x̂。r⊥＝ρ(0,−sinψ,−cosψ)、x＝v∥t。
//   ψ＝0：下にいて 𝐯⊥＝−ŷ（手前）→ q(−ŷ)×x̂＝+qẑ（上＝軸向き）✓。
// 色：𝐯 紫、𝐁 橙、𝐅 緑、正電荷 赤、電子 青、半径 r 水色、周期 T 金、電流 I 緑。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly,fmt} from './anim.mjs';

const K='um-magnetic-force-2:';
const CV=C.v,CB=C.E,CF=C.F,CI=C.F,CQ=C.p,PO=C.a,EL='#7fb3ff',CR=C.x,CT=C.t,NG=C.a,HX=C.x,HY=C.v,HZ=C.t;
const RAD=Math.PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const TF=(s,x,y,maxW,size=40,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}'),bF=cs(CF,'\\mathbf{F}'),qq=cs(CQ,'q'),aq=cs(CQ,'|q|');
const hx=cs(HX,'\\hat{x}'),hy=cs(HY,'\\hat{y}'),hz=cs(HZ,'\\hat{z}');
const vv=cs(CV,'v'),BB=cs(CB,'B'),rr=cs(CR,'r'),TT=cs(CT,'T');
const R_EQ=`${rr}=\\dfrac{m\\,${vv}}{${aq}\\,${BB}}`;
const T_EQ=`${TT}=\\dfrac{2\\pi m}{${aq}\\,${BB}}`;
const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
function inSym(x,y,r=22,color=CB,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#10182c'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
function charge(x,y,sign=1,r=16,g=1){const c=sign>0?PO:EL;return fade(g,ring(x,y,r,{color:c,w:3,fill:sign>0?'#3a1d2a':'#1b2a48'})+label(sign>0?'＋':'−',x,y+r*.4,{size:r*1.15,color:c,anchor:'middle',weight:700}));}
function intoField(x0,y0,x1,y1,{step=80,g=1,r=9}={}){
 let s='';for(let x=x0;x<=x1+1;x+=step)for(let y=y0;y<=y1+1;y+=step){const d=r*.62;s+=ring(x,y,r,{color:CB,w:2})+line(x-d,y-d,x+d,y+d,{color:CB,w:2})+line(x-d,y+d,x+d,y-d,{color:CB,w:2});}
 return fade(g*.45,s);
}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function arcArrow(cx,cy,r,a0,a1,color,w=4,g=1){
 if(g<=0)return '';const pts=circPts(cx,cy,r,a0,a1,30),n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1),L=14;
 return fade(g,draw(pts,1,{color,w})+`<polygon points="${x2+Math.cos(a)*5},${y2+Math.sin(a)*5} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${color}"/>`);
}
function rightMark(x,y,a,b,s=13,color=C.ink){return draw([[x+a[0]*s,y+a[1]*s],[x+(a[0]+b[0])*s,y+(a[1]+b[1])*s],[x+b[0]*s,y+b[1]*s]],1,{color,w:2});}

// ---- front-view circle ----
const CI0={cx:330,cy:275,R:160};
function at(phi,{cx=CI0.cx,cy=CI0.cy,R=CI0.R,sign=1}={}){
 const x=cx+R*Math.cos(phi),y=cy-R*Math.sin(phi);
 const v=sign>0?[-Math.sin(phi),-Math.cos(phi)]:[Math.sin(phi),Math.cos(phi)];
 return {x,y,v,f:[-Math.cos(phi),Math.sin(phi)]};
}
function vf(phi,{g=1,lv=85,lf=70,sign=1,labels=0,mark=1,cx,cy,R}={}){
 const o={sign};if(cx!==undefined){o.cx=cx;o.cy=cy;o.R=R;}
 const {x,y,v,f}=at(phi,o);
 let s=arrow(x,y,x+v[0]*lv,y+v[1]*lv,{color:CV,w:5,head:15})+arrow(x,y,x+f[0]*lf,y+f[1]*lf,{color:CF,w:6,head:16});
 if(mark)s+=rightMark(x,y,v,f,13);
 if(labels)s+=T(bv,x+v[0]*(lv+22),y+v[1]*(lv+22)+10,{size:30})+T(bF,x+f[0]*(lf+24),y+f[1]*(lf+24)+10,{size:30});
 s+=charge(x,y,sign,14);
 return fade(g,s);
}
function circBase({g=1,path=1,field=1,cx=CI0.cx,cy=CI0.cy,R=CI0.R,x0=70,x1=600}={}){
 return (field?intoField(x0,90,x1,470,{g}):'')+fade(g*path,draw(circPts(cx,cy,R,0,2*Math.PI,90),1,{color:C.dim,w:2.5,dash:'8 8'})+dot(cx,cy,5,C.dim));
}
function radius(g=1,{cx=CI0.cx,cy=CI0.cy,R=CI0.R,ang=200}={}){const x=cx+R*Math.cos(ang*RAD),y=cy-R*Math.sin(ang*RAD);return fade(g,line(cx,cy,x,y,{color:CR,w:4})+T(rr,(cx+x)/2-4,(cy+y)/2-14,{size:34}));}
function rowsCard(list,p,{x=660,y=90,w=500,h=78,gap=12,start=0,step=.25,shown=null}={}){
 let s='';list.forEach((r,i)=>{const yy=y+i*(h+gap);const g=shown!==null?(i<shown?1:0):seg(p,start+i*step,start+i*step+.12);s+=card(x,yy,w,h,r(yy+h/2),g);});return s;
}

// ---- oblique 3D (B along x) ----
const KY=.55,AY=32*RAD;
function view({ox,oy,u}){return (x,y,z)=>[ox+u*(x+KY*Math.cos(AY)*y),oy-u*(z+KY*Math.sin(AY)*y)];}
const V3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return arrow(A[0],A[1],B[0],B[1],o);};
const L3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return line(A[0],A[1],B[0],B[1],o);};
// helix view: B (x) to the right, z up, y (奥) drawn up-right so the y–z circle reads as an ellipse
const PH=(x,y,z)=>[150+90*(x+.45*y),300-90*(z+.3*y)];
const RHO=1,VPAR=.3; // helix: radius 1, advance per radian VPAR
function hpos(psi,{rho=RHO,adv=VPAR}={}){return [adv*psi,-rho*Math.sin(psi),-rho*Math.cos(psi)];}
function fieldX(P,{g=1,x0=-.8,x1=6.4}={}){
 let s='';for(const [y,z] of [[0,1.9],[0,-1.9]])s+=V3(P,[x0,y,z],[x1,y,z],{color:CB,w:3,head:13});
 return fade(g*.6,s)+fade(g,T(bB,P(x0,0,1.9)[0]-12,P(x0,0,1.9)[1]+10,{size:36,anchor:'end'}));
}
function axisX(P,g=1){return fade(g,L3(P,[-.8,0,0],[6.4,0,0],{color:C.faint,w:2,dash:'6 7'}));}
function helixPts(P,t,{rho=RHO,adv=VPAR,turns=3}={}){const n=Math.max(2,Math.round(240*t)),m=turns*2*Math.PI*t;return Array.from({length:n+1},(_,i)=>P(...hpos(m*i/n,{rho,adv})));}

export const ytUmMagneticForce2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=circBase({path:seg(p,.3,.6)})+vf(-Math.PI/2,{labels:1});
  s+=fade(seg(p,.35,.55),label('？',CI0.cx,CI0.cy+16,{size:52,color:C.hi,anchor:'middle',weight:700}));
  s+=card(660,110,500,280,label('前回の最後の問い',910,165,{size:26,color:C.dim,anchor:'middle'})+label('いつも 直角な力 →',910,230,{size:30,color:C.ink,anchor:'middle'})
   +label('どんな軌道？',910,290,{size:32,color:C.hi,anchor:'middle',weight:700})+label('半径は いくつ？',910,345,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=card(160,100,880,320,T(`${bF}=${qq}\\,${bv}\\times${bB}`,600,175,{size:52})
   +fade(seg(p,.25,.4),T(`${bF}\\perp${bv},\\qquad ${bF}\\perp${bB}`,600,265,{size:44}))
   +fade(seg(p,.55,.7),T(`F=${aq}\\,${vv}\\,${BB}\\sin\\theta`,600,355,{size:46})),seg(p,0,.12));
  return s;
 },
 [K+'setup']:(p)=>{
  let s=intoField(70,90,600,470,{g:seg(p,0,.2)});
  {const o=at(-Math.PI/2);s+=fade(seg(p,.5,.65),vf(-Math.PI/2,{lf:0,mark:0})+T(bv,o.x+110,o.y+10,{size:30}));}
  s+=card(660,100,500,320,label('条件',910,150,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.22),label('𝐁：一様、奥向き（⊗）',910,215,{size:28,color:CB,anchor:'middle',weight:700}))
   +fade(seg(p,.25,.37),label('電場なし（𝐄＝0）',910,275,{size:28,color:C.x,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.6),label('𝐯 は 𝐁 に直角（画面の中）',910,335,{size:28,color:CV,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('正の電荷を 右へ',910,390,{size:26,color:PO,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=intoField(70,90,600,470,{g:.6})+draw(circPts(330,275,130,0,2*Math.PI,80),1,{color:C.dim,w:3,dash:'8 8'})+label('B',330,285,{size:30,color:CB,anchor:'middle',weight:700});
  s+=card(660,110,500,280,label('磁場を 2倍に すると',910,180,{size:30,color:C.ink,anchor:'middle'})+label('円は 大きく？ 小さく？',910,260,{size:34,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',910,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 // ===== S2 なぜ円になるか =====
 [K+'power']:(p)=>{
  let s=intoField(70,90,600,470,{g:.6})+vf(-Math.PI/2,{labels:1,cx:330,cy:220,R:120});
  s+=card(660,100,500,320,label('仕事率',910,150,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.2),TF(`${bF}\\cdot${bv}=${qq}\\,(${bv}\\times${bB})\\cdot${bv}`,910,225,470,40))
   +fade(seg(p,.45,.6),label('𝐯×𝐁 は 𝐯 に直角',910,300,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.65,.8),T(`=0`,910,370,{size:50,color:CF})),seg(p,0,.1));
  return s;
 },
 [K+'speed']:(p)=>{
  const phi=-Math.PI/2+seg(p,0,1)*Math.PI*.8;
  let s=circBase({})+vf(phi,{mark:0});
  s+=rowsCard([
   y=>label('仕事率 0',910,y+10,{size:30,color:CF,anchor:'middle',weight:700}),
   y=>T(`\\tfrac12 m${vv}^2\\ \\text{一定}`,910,y,{size:40}),
   y=>label('速さ v 一定',910,y+10,{size:32,color:CV,anchor:'middle',weight:700}),
  ],p,{y:110,h:90,step:.22});
  return s;
 },
 [K+'const']:(p)=>{
  const phi=-Math.PI/2+Math.PI*.8+seg(p,0,1)*Math.PI*.6;
  let s=circBase({})+vf(phi,{mark:1});
  s+=rowsCard([
   y=>label('速さ v 一定',910,y+10,{size:30,color:CV,anchor:'middle',weight:700}),
   y=>label('𝐯 ⊥ 𝐁 → sinθ ＝ 1',910,y+10,{size:30,color:C.ink,anchor:'middle'}),
   y=>T(`F=${aq}\\,${vv}\\,${BB}\\ \\ \\text{一定}`,910,y,{size:40,color:CF}),
  ],p,{y:110,h:90,step:.22});
  return s;
 },
 [K+'bottom']:(p)=>{
  let s=circBase({})+vf(-Math.PI/2,{labels:1,g:seg(p,.1,.25)});
  s+=card(660,100,500,300,label('下の点：𝐯 右',910,150,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.45),T(`${hx}\\times${hy}=${hz}`,910,230,{size:46}))
   +fade(seg(p,.55,.7),label('力は 上 ＝ 中心向き',910,320,{size:30,color:CF,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'right']:(p)=>{
  let s=circBase({})+vf(-Math.PI/2,{})+vf(0,{labels:1,g:seg(p,.1,.25)});
  s+=card(660,100,500,300,label('右の点：𝐯 上',910,150,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.45),T(`${hz}\\times${hy}=-${hx}`,910,230,{size:46}))
   +fade(seg(p,.55,.7),label('力は 左 ＝ 中心向き',910,320,{size:30,color:CF,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'top']:(p)=>{
  let s=circBase({})+vf(-Math.PI/2,{})+vf(0,{})+vf(Math.PI/2,{labels:1,g:seg(p,.1,.25)});
  s+=card(660,100,500,300,label('上の点：𝐯 左',910,150,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.45),T(`(-${hx})\\times${hy}=-${hz}`,910,230,{size:46}))
   +fade(seg(p,.55,.7),label('力は 下 ＝ 中心向き',910,320,{size:30,color:CF,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'ccw']:(p)=>{
  const a=seg(p,0,1)*Math.PI*1.2;
  let s=intoField(60,90,1140,470,{step:90,g:.6});
  s+=draw(circPts(300,260,140,0,2*Math.PI,80),1,{color:C.dim,w:2.5,dash:'8 8'})+arcArrow(300,260,175,-Math.PI/2+.3,Math.PI*.6,PO,4,seg(p,.1,.3));
  s+=vf(-Math.PI/2+a,{cx:300,cy:260,R:140,lv:70,lf:55,mark:0});
  s+=label('正の電荷：反時計回り',300,480,{size:28,color:PO,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.55),draw(circPts(870,260,140,0,2*Math.PI,80),1,{color:C.dim,w:2.5,dash:'8 8'})+arcArrow(870,260,175,-Math.PI/2-.3,-Math.PI*1.6,EL,4,1)
   +vf(-Math.PI/2-a,{cx:870,cy:260,R:140,lv:70,lf:55,mark:0,sign:-1})+label('電子：時計回り',870,480,{size:28,color:EL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cond']:(p)=>{
  let s=card(120,80,960,380,label('仕事 0 だけでは、円とは 決まらない',600,150,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  [['𝐁 が 一様（場所によらない）',.35],['速度が 𝐁 に 直角',.5],['電場なし（𝐄＝0）',.62]].forEach(([t,a],i)=>{s+=fade(seg(p,a,a+.1),check(300,228+i*65,16)+label(t,340,238+i*65,{size:30,color:C.ink}));});
  s+=fade(seg(p,.8,.92),label('→ はじめて 円',600,430,{size:30,color:CF,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 半径を導く =====
 ...(()=>{
  const X=915;
  const rowsT=[
   (y,g)=>fade(g,label('中心向きに 必要な力',X-120,y+10,{size:28,color:C.dim,anchor:'middle'})+T(`\\dfrac{m\\,${vv}^2}{${rr}}`,X+120,y,{size:48})),
   (y,g)=>fade(g,T(`${aq}\\,${vv}\\,${BB}=\\dfrac{m\\,${vv}^2}{${rr}}`,X,y,{size:48})),
   (y,g)=>fade(g,T(`${aq}\\,${BB}=\\dfrac{m\\,${vv}}{${rr}}`,X,y,{size:48})+label('両辺 ÷ v',X+190,y+10,{size:26,color:C.t,anchor:'middle'})),
   (y,g)=>fade(g,T(R_EQ,X,y,{size:52})),
  ];
  const left=(g=1)=>circBase({})+radius(g)+vf(-Math.PI/2,{labels:1});
  // two slots: previous row (dim) above, new row below
  const box=(p,n)=>{let s=card(650,70,520,420,'',1);
   if(n===1)return s+rowsT[0](200,seg(p,.3,.5));
   s+=rowsT[n-2](185,.55)+arrow(X,245,X,300,{color:C.dim,w:3,head:12})+rowsT[n-1](375,seg(p,.05,.25));return s;};
  return {
   [K+'need']:(p)=>left(seg(p,.1,.3))+box(p,1)+fade(seg(p,.6,.8),label('（慣性力と軌道・中級で 導いた）',X,330,{size:24,color:C.dim,anchor:'middle'})),
   [K+'eq']:(p)=>left()+box(p,2)+fade(seg(p,.2,.4),label('磁場の力が まかなう',X,460,{size:26,color:CF,anchor:'middle',weight:700})),
   [K+'div']:(p)=>left()+box(p,3),
   [K+'solve']:(p)=>left()+box(p,4)+fade(seg(p,.5,.65),highlight(X-135,300,270,135,1,C.hi)),
  };
 })(),
 [K+'read']:(p)=>{
  let s=T(R_EQ,600,150,{size:72});
  s+=fade(seg(p,.1,.3),card(90,260,480,190,label('m・v が 大きい',330,320,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 大回り',330,390,{size:34,color:CR,anchor:'middle',weight:700})));
  s+=fade(seg(p,.5,.7),card(630,260,480,190,label('B・|q| が 大きい',870,320,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 小回り',870,390,{size:34,color:CR,anchor:'middle',weight:700})));
  return s;
 },
 [K+'answer']:(p)=>{
  let s=intoField(60,90,1140,470,{step:90,g:.5});
  s+=draw(circPts(300,270,160,0,2*Math.PI,80),1,{color:CR,w:3})+label('B',300,280,{size:32,color:CB,anchor:'middle',weight:700})+label('半径 r',300,480,{size:28,color:CR,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.4),draw(circPts(850,270,80,0,2*Math.PI,60),1,{color:CR,w:3})+label('2B',850,280,{size:32,color:CB,anchor:'middle',weight:700})+label('半径 r ÷ 2',850,480,{size:28,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('小さくなる',575,100,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'abs']:(p)=>{
  let s=T(R_EQ,600,130,{size:64});
  s+=fade(seg(p,.05,.2),label('分母の |q| は いつも 正',600,235,{size:28,color:CQ,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),draw(circPts(330,360,80,0,2*Math.PI,60),1,{color:C.dim,w:2.5,dash:'8 8'})+arcArrow(330,360,100,-Math.PI/2+.3,Math.PI*.6,PO,4)+charge(330,280,1,14)+label('正：反時計回り',330,498,{size:26,color:PO,anchor:'middle',weight:700})
   +draw(circPts(870,360,80,0,2*Math.PI,60),1,{color:C.dim,w:2.5,dash:'8 8'})+arcArrow(870,360,100,-Math.PI/2-.3,-Math.PI*1.6,EL,4)+charge(870,280,-1,14)+label('負：時計回り',870,498,{size:26,color:EL,anchor:'middle',weight:700})
   +label('同じ 半径',600,380,{size:30,color:CR,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 陽子 =====
 [K+'proton']:(p)=>{
  const items=[['質量 m',`1.67\\times10^{-27}\\ \\mathrm{kg}`,C.ink],['電荷 q',`1.6\\times10^{-19}\\ \\mathrm{C}`,CQ],['速さ v',`10^{6}\\ \\mathrm{m/s}`,CV],['磁場 B',`0.1\\ \\mathrm{T}`,CB]];
  let s=label('陽子',600,80,{size:30,color:PO,anchor:'middle',weight:700});
  items.forEach(([a,b,c],i)=>{s+=card(200,105+i*95,800,80,label(a,260,155+i*95,{size:30,color:c,weight:700})+T(b,720,145+i*95,{size:40,color:c}),seg(p,.1+i*.15,.22+i*.15));});
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(80,90,1040,360,'',1);
  s+=T(`${rr}=\\dfrac{m\\,${vv}}{${aq}\\,${BB}}`,250,250,{size:52});
  s+=fade(seg(p,.05,.25),T(`=\\dfrac{1.67\\times10^{-27}\\times10^{6}}{1.6\\times10^{-19}\\times0.1}`,660,250,{size:46}));
  s+=fade(seg(p,.4,.6),T(`=\\dfrac{1.67\\times10^{-21}}{1.6\\times10^{-20}}`,660,390,{size:44,color:C.hi}));
  return s;
 },
 [K+'r']:(p)=>{
  let s=card(640,100,520,300,T(`${rr}\\approx0.10\\ \\mathrm{m}`,900,200,{size:52})+fade(seg(p,.4,.6),label('直径 およそ 20 cm',900,310,{size:32,color:CR,anchor:'middle',weight:700})),seg(p,0,.12),C.hi);
  s+=circBase({R:150,cx:320,cy:270})+radius(1,{R:150,cx:320,cy:270,ang:180});
  s+=fade(seg(p,.4,.6),line(170,450,470,450,{color:CR,w:3})+line(170,440,170,460,{color:CR,w:3})+line(470,440,470,460,{color:CR,w:3})+label('約 20 cm',320,490,{size:26,color:CR,anchor:'middle'}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=label('単位の確かめ',600,85,{size:28,color:C.dim,anchor:'middle'});
  s+=card(80,95,1040,150,T(`${aq}\\,${BB}:\\ \\ \\mathrm{C}\\times\\dfrac{\\mathrm{N}}{\\mathrm{A\\cdot m}}=\\mathrm{C}\\times\\dfrac{\\mathrm{N}}{(\\mathrm{C/s})\\cdot\\mathrm{m}}=\\dfrac{\\mathrm{N\\cdot s}}{\\mathrm{m}}`,600,178,{size:38}),seg(p,.05,.2));
  s+=card(80,265,1040,150,T(`\\dfrac{\\mathrm{kg\\cdot m/s}}{\\mathrm{N\\cdot s/m}}=\\dfrac{\\mathrm{kg\\cdot m^2}}{\\mathrm{N\\cdot s^2}}=\\mathrm{m}`,600,345,{size:40}),seg(p,.4,.55));
  s+=fade(seg(p,.65,.8),label('（N ＝ kg·m/s²）',600,455,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'period']:(p)=>{
  let s=circBase({R:130,cx:280,cy:270,x1:520})+radius(1,{R:130,cx:280,cy:270,ang:180});
  s+=card(560,70,600,420,label('1周の時間 T（テスラの T とは別）',860,115,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.25),T(`${TT}=\\dfrac{2\\pi ${rr}}{${vv}}`,860,205,{size:46}))
   +fade(seg(p,.5,.65),TF(`=\\dfrac{2\\pi}{${vv}}\\cdot\\dfrac{m\\,${vv}}{${aq}\\,${BB}}`,860,320,560,42))
   +fade(seg(p,.75,.9),T(`=\\dfrac{2\\pi m}{${aq}\\,${BB}}`,860,430,{size:44,color:CT})),seg(p,0,.1));
  return s;
 },
 [K+'period2']:(p)=>{
  let s=card(120,90,960,360,'',1);
  s+=T(`${TT}=\\dfrac{2\\pi}{${vv}}\\cdot\\dfrac{m\\,${vv}}{${aq}\\,${BB}}=${T_EQ.replace(`${TT}=`,'')}`,600,190,{size:48});
  s+=fade(seg(p,.05,.2),label('v が 約分で 消える',600,300,{size:28,color:NG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),T(`${TT}\\approx6.6\\times10^{-7}\\ \\mathrm{s}`,640,390,{size:46,color:CT})+label('陽子',380,400,{size:28,color:PO,anchor:'middle',weight:700}));
  return s;
 },
 [K+'period3']:(p)=>{
  let s='';
  s+=draw(circPts(300,270,90,0,2*Math.PI,60),1,{color:CR,w:3})+vf(-Math.PI/2+seg(p,0,1)*2*Math.PI,{cx:300,cy:270,R:90,lv:55,lf:0,mark:0});
  s+=label('速さ v、半径 r',300,440,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),draw(circPts(850,270,180,0,2*Math.PI,90),1,{color:CR,w:3})+vf(-Math.PI/2+seg(p,0,1)*2*Math.PI,{cx:850,cy:270,R:180,lv:110,lf:0,mark:0})+label('速さ 2v、半径 2r',850,490,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('1周の時間は 同じ',560,80,{size:32,color:CT,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 らせん =====
 [K+'turn']:(p)=>{
  let s=fieldX(PH,{g:seg(p,.3,.5)})+axisX(PH,seg(p,.3,.5));
  const O=PH(0,0,-1);
  s+=V3(PH,[0,0,-1],[1,-1.1,-1],{color:CV,w:6,head:18})+T(bv,PH(1,-1.1,-1)[0]+14,PH(1,-1.1,-1)[1]+20,{size:34,anchor:'start'})+charge(O[0],O[1],1,15);
  s+=card(760,300,400,190,label('𝐁 を 右向きに 描く',960,365,{size:28,color:CB,anchor:'middle',weight:700})+label('𝐯 は 𝐁 に 斜め',960,430,{size:28,color:CV,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'split']:(p)=>{
  let s=fieldX(PH)+axisX(PH);
  const O=PH(0,0,-1);
  s+=V3(PH,[0,0,-1],[1,-1.1,-1],{color:CV,w:6,head:18,opacity:.5});
  s+=fade(seg(p,.1,.3),V3(PH,[0,0,-1],[1,0,-1],{color:CV,w:6,head:18})+T(`${vv}_{\\parallel}`,PH(1,0,-1)[0]+10,PH(1,0,-1)[1]+30,{size:34,anchor:'start'}));
  s+=fade(seg(p,.3,.5),V3(PH,[0,0,-1],[0,-1.1,-1],{color:CV,w:6,head:18})+T(`${vv}_{\\perp}`,PH(0,-1.1,-1)[0]-14,PH(0,-1.1,-1)[1]+12,{size:34,anchor:'end'}));
  s+=charge(O[0],O[1],1,15);
  s+=card(760,270,400,220,label('𝐁 に 平行：v∥',960,330,{size:28,color:C.ink,anchor:'middle',weight:700})+label('𝐁 に 直角：v⊥',960,390,{size:28,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('（前回の 分け方）',960,450,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'par']:(p)=>{
  let s=fieldX(PH)+axisX(PH);
  const X=seg(p,.1,.9)*4.5;
  s+=fade(.8,L3(PH,[0,0,-1],[5.5,0,-1],{color:CV,w:3,dash:'8 8'}));
  s+=V3(PH,[X,0,-1],[X+1,0,-1],{color:CV,w:6,head:18})+T(`${vv}_{\\parallel}`,PH(X+1,0,-1)[0]+8,PH(X+1,0,-1)[1]+30,{size:32,anchor:'start'})+charge(PH(X,0,-1)[0],PH(X,0,-1)[1],1,15);
  s+=card(760,300,400,170,T(`${vv}_{\\parallel}\\,${hx}\\times${hx}=0`,960,360,{size:38})+label('力なし → 等速で 進む',960,430,{size:26,color:CF,anchor:'middle',weight:700}),seg(p,0,.15));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=fieldX(PH)+axisX(PH);
  const ring3=Array.from({length:91},(_,i)=>PH(...hpos(2*Math.PI*i/90,{adv:0})));
  s+=draw(ring3,1,{color:C.dim,w:2.5,dash:'8 8'});
  const psi=seg(p,0,1)*2*Math.PI,P0=hpos(psi,{adv:0}),vd=[0,-Math.cos(psi),Math.sin(psi)],fd=[0,-P0[1],-P0[2]];
  const A=PH(...P0);
  s+=V3(PH,P0,[0,P0[1]+vd[1]*1.1,P0[2]+vd[2]*1.1],{color:CV,w:5,head:16})+V3(PH,P0,[0,P0[1]+fd[1]*.7,P0[2]+fd[2]*.7],{color:CF,w:6,head:16})+charge(A[0],A[1],1,14);
  s+=card(760,300,400,190,label('直角な部分：円運動',960,355,{size:28,color:C.ink,anchor:'middle',weight:700})+T(`${rr}=\\dfrac{m\\,${vv}_{\\perp}}{${aq}\\,${BB}}`,960,440,{size:42}),seg(p,0,.15));
  return s;
 },
 [K+'helix']:(p)=>{
  let s=fieldX(PH)+axisX(PH);
  const t=seg(p,.05,.9);
  s+=draw(helixPts(PH,t,{turns:3}),1,{color:C.hi,w:4});
  const psi=3*2*Math.PI*t,P0=hpos(psi),A=PH(...P0);
  const vd=[VPAR,-Math.cos(psi),Math.sin(psi)];
  s+=V3(PH,P0,[P0[0]+vd[0]*1.2,P0[1]+vd[1]*1.2,P0[2]+vd[2]*1.2],{color:CV,w:5,head:16})+charge(A[0],A[1],1,14);
  s+=card(760,360,400,120,label('進みながら 回る ＝ らせん',960,410,{size:28,color:C.hi,anchor:'middle',weight:700})+label('一周で進む距離は 上級で',960,455,{size:24,color:C.dim,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'nonuni']:(p)=>{
  const cx=330,cy=270,Re=70;
  let s='';
  for(const L of [2.2,3.2,4.4])for(const side of [1,-1]){const pts=[];for(let i=0;i<=80;i++){const lam=-Math.acos(Math.sqrt(1/L))+2*Math.acos(Math.sqrt(1/L))*i/80;const r=L*Math.cos(lam)**2;pts.push([cx+side*r*Re*Math.cos(lam),cy-r*Re*Math.sin(lam)]);}s+=draw(pts,seg(p,.05,.35),{color:CB,w:2.5,opacity:.8});}
  s+=ring(cx,cy,Re,{color:C.x,w:3,fill:'#123049'})+label('地球',cx,cy+10,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.65),ring(cx,cy-Re-6,16,{color:C.F,w:4})+ring(cx,cy+Re+6,16,{color:C.F,w:4}));
  s+=card(680,110,470,280,label('場所で 変わる 磁場',915,170,{size:30,color:CB,anchor:'middle',weight:700})+label('→ 軌道も さらに 変わる',915,235,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('オーロラの 粒子：この 続き',915,320,{size:26,color:C.F,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 // ===== S6 まとめ =====
 [K+'sum1']:(p)=>{
  let s=circBase({})+vf(-Math.PI/2,{})+vf(0,{})+vf(Math.PI/2,{})+vf(Math.PI,{});
  s+=rowsCard([
   y=>label('仕事 0 → 速さ 一定',910,y+10,{size:30,color:C.ink,anchor:'middle',weight:700}),
   y=>label('力は いつも 中心向き',910,y+10,{size:30,color:CF,anchor:'middle',weight:700}),
   y=>label('→ 円',910,y+10,{size:34,color:C.hi,anchor:'middle',weight:700}),
  ],p,{y:110,h:90,step:.25});
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,80,1040,120,T(`${aq}\\,${vv}\\,${BB}=\\dfrac{m\\,${vv}^2}{${rr}}\\ \\ \\Rightarrow\\ \\ ${R_EQ}`,600,140,{size:44}),seg(p,0,.12));
  s+=card(80,220,1040,110,T(T_EQ,420,275,{size:42})+label('速さに よらない',820,285,{size:30,color:CT,anchor:'middle',weight:700}),seg(p,.4,.52));
  s+=card(80,350,1040,100,label('平行な部分が あれば → らせん',600,410,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.7,.82));
  return s;
 },
 [K+'sum3']:(p)=>{
  let s=card(90,110,460,280,label('受ける側',320,170,{size:30,color:C.dim,anchor:'middle'})+T(`${bF}=${qq}\\,${bv}\\times${bB}`,320,260,{size:44})+label('円・らせん',320,340,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=fade(seg(p,.5,.65),arrow(570,250,640,250,{color:C.dim,w:4}));
  s+=card(650,110,460,280,label('作る側',880,170,{size:30,color:C.hi,anchor:'middle',weight:700})+label('電流 → 磁場',880,260,{size:32,color:CB,anchor:'middle',weight:700})+label('？',880,340,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  const cx=330,cy=270;
  let s=line(cx,470,cx,70,{color:CI,w:8})+arrow(cx,200,cx,120,{color:CI,w:8,head:22})+label('電流 I',cx+20,100,{size:28,color:CI,weight:700});
  for(const [r,a] of [[70,.1],[130,.25],[190,.4]])s+=fade(seg(p,a,a+.15),`<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r*.3}" fill="none" stroke="${CB}" stroke-width="3" stroke-dasharray="8 8"/>`);
  s+=fade(seg(p,.4,.55),line(cx,cy,cx+190,cy,{color:CR,w:3})+label('距離 r',cx+240,cy+10,{size:26,color:CR,anchor:'middle',weight:700}));
  s+=card(660,110,500,280,label('次の問い',910,165,{size:26,color:C.dim,anchor:'middle'})+label('直線電流のまわりの 磁場',910,235,{size:30,color:C.ink,anchor:'middle'})
   +label('強さは 距離で',910,300,{size:32,color:C.hi,anchor:'middle',weight:700})+label('どう 決まる？',910,350,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};
