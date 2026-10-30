// YouTube シリーズ「ローレンツ力・上級 2/2」(ys-ue-lorentz-2) — 図。Stage 1200×515.
// 軸：x 右、y 奥、z 上。導線の場面は正面図（x 右、z 上、𝐁＝Bŷ 奥向き ⊗）。電流は右、𝐥＝l x̂、x̂×ŷ＝ẑ → 力は上。
//   電子：𝐯＝−v x̂、q＝−e → (−e)(−v x̂)×(Bŷ)＝+evB ẑ（上）。
// モーター：𝐁＝B x̂（右）。コイルは x–y 面、長い辺（0.1 m）は y に沿う、回転軸も y。
//   軸の方向から見た図＝正面図（x 右、z 上、y は奥）。右の辺（x＝+0.025 m）は電流 −ŷ（手前 ⊙）→ (−ŷ)×x̂＝+ẑ（上）。左の辺は電流 +ŷ（奥 ⊗）→ 下。
//   トルク −0.1ŷ N·m（手前向き）→ 正面から見て反時計回り。傾き φ（反時計回り）で辺の位置 (±R cosφ, ±R sinφ)、腕 R cosφ。
// 色：𝐁 橙、𝐅 緑、電流 I 緑、𝐥 水色、𝐯 紫、電子 青、キャリア q 桃、トルク・腕 黄。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';

const K='ue-lorentz-2:';
const CV=C.v,CB=C.E,CF=C.F,CI=C.F,CQ=C.p,PO=C.a,EL='#7fb3ff',CL=C.x,CT=C.t,CH=C.hi,HX=C.x,HY=C.v,HZ=C.t;
const PI=Math.PI;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const TF=(s,x,y,maxW,size=40,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}'),bF=cs(CF,'\\mathbf{F}'),qq=cs(CQ,'q'),bl=cs(CL,'\\mathbf{l}'),ll=cs(CL,'l'),II=cs(CI,'I');
const hx=cs(HX,'\\hat{x}'),hy=cs(HY,'\\hat{y}'),hz=cs(HZ,'\\hat{z}'),vv=cs(CV,'v'),BB=cs(CB,'B'),ee=cs(CQ,'e');
const F_IL=`${bF}=${II}\\,${bl}\\times${bB}`;
function inSym(x,y,r=9,color=CB,w=2){const d=r*.62;return ring(x,y,r,{color,w,fill:'#10182c'})+line(x-d,y-d,x+d,y+d,{color,w})+line(x-d,y+d,x+d,y-d,{color,w});}
function outSym(x,y,r=9,color=CB,w=2){return ring(x,y,r,{color,w,fill:'#10182c'})+dot(x,y,r*.32,color);}
function field(sym,x0,y0,x1,y1,{step=80,g=1,r=9}={}){let s='';for(let x=x0;x<=x1+1;x+=step)for(let y=y0;y<=y1+1;y+=step)s+=sym(x,y,r);return fade(g*.45,s);}
function chargeDot(x,y,c,r=8){return ring(x,y,r,{color:c,w:2,fill:c===EL?'#1b2a48':'#3a1d33'})+dot(x,y,r*.45,c);}
const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
function rowsCard(list,p,{x=700,y=90,w=470,h=84,gap=12,start=0,step=.25}={}){
 let s='';list.forEach((r,i)=>{const yy=y+i*(h+gap);s+=card(x,yy,w,h,r(yy+h/2),seg(p,start+i*step,start+i*step+.12));});return s;
}
// equation stack: earlier rows dim, last row appears
function eqStack(rows,p,{x=60,y=250,w=1080,h=245,cx=600}={}){
 let s=card(x,y,w,h,'',1);const n=rows.length,dy=h/(n+.6);
 rows.forEach((r,i)=>{const last=i===n-1;s+=fade(last?seg(p,.05,.25):1,TF(r,cx,y+dy*(i+.8)+8,w-60,last?46:38,{opacity:last?1:.6}));});
 return s;
}

// ---- wire segment (front view) ----
const W={x0:130,x1:600,yc:150,h:70};
function wireBase({g=1,dims=1,fieldBox=[60,60,660,240],current=1}={}){
 let s=field(inSym,fieldBox[0],fieldBox[1],fieldBox[2],fieldBox[3],{step:75,g});
 s+=rect(W.x0,W.yc-W.h/2,W.x1-W.x0,W.h,{fill:'#c58b4a',fo:.16,stroke:'#c58b4a',sw:2,rx:6});
 s+=line(W.x0-50,W.yc-W.h/2,W.x0,W.yc-W.h/2,{color:'#c58b4a',w:2,dash:'5 6'})+line(W.x0-50,W.yc+W.h/2,W.x0,W.yc+W.h/2,{color:'#c58b4a',w:2,dash:'5 6'})
  +line(W.x1,W.yc-W.h/2,W.x1+50,W.yc-W.h/2,{color:'#c58b4a',w:2,dash:'5 6'})+line(W.x1,W.yc+W.h/2,W.x1+50,W.yc+W.h/2,{color:'#c58b4a',w:2,dash:'5 6'});
 s+=`<ellipse cx="${W.x0}" cy="${W.yc}" rx="16" ry="${W.h/2}" fill="#c58b4a" fill-opacity=".25" stroke="#c58b4a" stroke-width="2"/>`;
 if(current)s+=arrow(W.x1-90,W.yc-W.h/2-22,W.x1+10,W.yc-W.h/2-22,{color:CI,w:4,head:13})+label('電流 I',W.x1-40,W.yc-W.h/2-36,{size:24,color:CI,anchor:'middle',weight:700});
 if(dims)s+=fade(dims,line(W.x0,W.yc+W.h/2+30,W.x1,W.yc+W.h/2+30,{color:CL,w:3})+line(W.x0,W.yc+W.h/2+18,W.x0,W.yc+W.h/2+42,{color:CL,w:3})+line(W.x1,W.yc+W.h/2+18,W.x1,W.yc+W.h/2+42,{color:CL,w:3})
  +T(ll,(W.x0+W.x1)/2,W.yc+W.h/2+70,{size:34})+label('断面積 S',W.x0-10,W.yc-W.h/2-14,{size:24,color:'#e0b080',anchor:'middle'}));
 s+=label('𝐁：奥向き（⊗）',70,45,{size:24,color:CB,weight:700});
 return s;
}
const CAR=Array.from({length:24},(_,i)=>[((i*53)%460)/460,((i*37)%50)/50]);
function carriers(p,{sign=1,force=0,vel=0,jitter=0,big=0,g=1,shift=1}={}){
 let s='';const c=sign>0?CQ:EL,dir=sign>0?1:-1;
 CAR.forEach(([u,w],i)=>{let x=W.x0+15+((u*440+dir*shift*45*p)%440+440)%440,y=W.yc-W.h/2+12+w*(W.h-24);
  if(jitter){x+=7*Math.sin(37*p+i*1.7);y+=6*Math.cos(29*p+i*2.3);}
  if(force)s+=fade(big?.45:1,arrow(x,y,x,y-30,{color:CF,w:3,head:9}));
  if(vel)s+=arrow(x,y,x+dir*24,y,{color:CV,w:2.5,head:7});
  s+=chargeDot(x,y,c,7);});
 return fade(g,s);
}

// ---- motor ----
const KX=.9,KZ=.3;
const mkP=(ox,oy,u)=>(x,y,z)=>[ox+u*(x+KX*y),oy-u*(z+KZ*y)];
const V3=(Q,a,b,o={})=>{const A=Q(...a),B=Q(...b);return arrow(A[0],A[1],B[0],B[1],o);};
const L3=(Q,a,b,o={})=>{const A=Q(...a),B=Q(...b);return line(A[0],A[1],B[0],B[1],o);};
// coil 3D: x half-width a (0.025 m), y half-length b (0.05 m); units: metres × 10
function coil3D(Q,{g=1,hlShort=0,hlLong=0,labels=0}={}){
 const a=.25,b=.5;let s='';
 for(const z of [.75,-.75])s+=fade(.55,V3(Q,[-1.2,0,z],[1.3,0,z],{color:CB,w:3,head:12}));
 s+=T(bB,Q(1.3,0,.75)[0]+10,Q(1.3,0,.75)[1]+10,{size:32,anchor:'start'});
 s+=fade(.8,L3(Q,[0,-1.05,0],[0,1.05,0],{color:C.dim,w:2,dash:'7 7'}))+label('回転軸',Q(0,1.1,0)[0]+8,Q(0,1.1,0)[1]-6,{size:22,color:C.dim});
 const cl=(a1,b1,c)=>L3(Q,a1,b1,{color:c,w:6});
 const sl=hlShort?CH:'#c58b4a',lg=hlLong?CH:'#c58b4a';
 s+=cl([a,b,0],[a,-b,0],lg)+cl([a,-b,0],[-a,-b,0],sl)+cl([-a,-b,0],[-a,b,0],lg)+cl([-a,b,0],[a,b,0],sl);
 // current arrows (loop: right side toward viewer, front short −x, left side into screen, back short +x)
 s+=V3(Q,[a,.25,0],[a,-.2,0],{color:CI,w:4,head:13})+V3(Q,[.12,-b,0],[-.12,-b,0],{color:CI,w:4,head:13})+V3(Q,[-a,-.25,0],[-a,.2,0],{color:CI,w:4,head:13})+V3(Q,[-.12,b,0],[.12,b,0],{color:CI,w:4,head:13});
 if(labels){
  s+=label('0.1 m',Q(a,0,0)[0]+30,Q(a,0,0)[1]+30,{size:24,color:C.ink});
  s+=label('0.05 m',Q(0,-b,0)[0],Q(0,-b,0)[1]+40,{size:24,color:C.ink,anchor:'middle'});
 }
 return fade(g,s);
}
// front (axis) view: centre (cx,cy), half-width R px, tilt phi (rad, counter-clockwise)
function axisView({cx=380,cy=270,R=150,phi=0,forces=1,arms=0,g=1,flipMarks=0,fieldOn=1,fsc=1,bLab=1}={}){
 let s='';
 if(fieldOn)for(const dy of [-165,-75,75,165]){const y=cy+dy;s+=fade(.5,arrow(cx-330,y,cx+330,y,{color:CB,w:3,head:12}));}
 if(bLab)s+=T(bB,cx+345,cy-170,{size:32,anchor:'start'});
 const xr=cx+R*Math.cos(phi),yr=cy-R*Math.sin(phi),xl=cx-R*Math.cos(phi),yl=cy+R*Math.sin(phi);
 s+=line(xl,yl,xr,yr,{color:'#c58b4a',w:5})+dot(cx,cy,6,C.dim);
 // which side is on the right decides the current (commutator); default: physical side A on the right
 const A_right=Math.cos(phi)>=0;
 const sR=[xr,yr],sL=[xl,yl];
 const right=A_right?sR:sL,left=A_right?sL:sR;
 if(forces){s+=arrow(right[0],right[1],right[0],right[1]-110*fsc,{color:CF,w:7,head:20})+arrow(left[0],left[1],left[0],left[1]+110*fsc,{color:CF,w:7,head:20});}
 if(arms){s+=line(cx,cy,right[0],cy,{color:CH,w:3,dash:'6 6'})+line(cx,cy,left[0],cy,{color:CH,w:3,dash:'6 6'})+line(right[0],cy,right[0],right[1],{color:C.dim,w:1.5,dash:'3 5'})+line(left[0],cy,left[0],left[1],{color:C.dim,w:1.5,dash:'3 5'});}
 s+=outSym(right[0],right[1],17,CI,3)+inSym(left[0],left[1],17,CI,3);
 if(flipMarks){s+=ring(sR[0],sR[1],25,{color:CH,w:2,dash:'4 4'});}
 return fade(g,s);
}
function rotArrow(cx,cy,r,g=1){const pts=Array.from({length:31},(_,i)=>{const a=-PI*.15+PI*.5*i/30;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});const [x1,y1]=pts[29],[x2,y2]=pts[30],a=Math.atan2(y2-y1,x2-x1),L=14;
 return fade(g,draw(pts,1,{color:CH,w:4})+`<polygon points="${x2+Math.cos(a)*5},${y2+Math.sin(a)*5} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${CH}"/>`);}

// small helix for the recap
function miniHelix(ox,oy,u,turns=2.2,adv=.35){
 const Q=mkP(ox,oy,u);let out='',cur=[],front=null;const n=300;
 for(let i=0;i<=n;i++){const ps=PI/2+2*PI*turns*i/n,P3=[adv*(ps-PI/2),-Math.sin(ps),-Math.cos(ps)],f=P3[1]<=0,pt=Q(...P3);
  if(front===null)front=f;if(f!==front){cur.push(pt);out+=draw(cur,1,{color:CH,w:front?4:3,opacity:front?1:.45});cur=[pt];front=f;}else cur.push(pt);}
 if(cur.length>1)out+=draw(cur,1,{color:CH,w:front?4:3,opacity:front?1:.45});
 return fade(.55,V3(Q,[-.6,0,1.6],[5.6,0,1.6],{color:CB,w:3,head:12}))+out;
}

export const ytUeLorentz2Diagrams={
 // ===== S1 =====
 [K+'prev']:(p)=>miniHelix(110,270,80)+card(700,110,470,280,label('前回',935,165,{size:26,color:C.dim,anchor:'middle'})+T(`p=v_{\\parallel}\\,T`,935,250,{size:50,color:CH})
   +T(`=\\dfrac{2\\pi m\\,v_{\\parallel}}{|q|\\,B}`,935,345,{size:42}),1),
 [K+'ask']:(p)=>wireBase({dims:0})+carriers(p,{sign:-1,force:1})+fade(seg(p,.2,.4),arrow(365,110,365,30,{color:CF,w:10,head:26})+label('？',400,60,{size:44,color:CH,weight:700}))
   +card(700,280,470,170,label('導線 全体が 受ける力',935,345,{size:30,color:CH,anchor:'middle',weight:700})+label('どう 書ける？',935,400,{size:30,color:CH,anchor:'middle',weight:700}),seg(p,.1,.25),CH),
 ...(()=>{
  const left=(p)=>{let s=wireBase({dims:0});const x=380,y=W.yc;s+=arrow(x,y,x-80,y,{color:CV,w:5,head:15})+T(bv,x-100,y-14,{size:30,anchor:'end'})+arrow(x,y,x,y-110,{color:CF,w:6,head:17})+T(bF,x+14,y-100,{size:30,anchor:'start'})+chargeDot(x,y,EL,11);return s;};
  return {
   [K+'mid']:(p)=>left(p)+card(60,290,1080,200,label('中級で 確かめたこと（電子）',600,330,{size:26,color:C.dim,anchor:'middle'})
     +TF(`(-${ee})\\,(-${vv}\\,${hx})\\times(${BB}\\,${hy})=+${ee}${vv}${BB}\\,${hz}`,600,400,1000,42)
     +fade(seg(p,.5,.65),label('q も 𝐯 も 負 → 力は 上（正の電荷と 同じ）',600,465,{size:28,color:CF,anchor:'middle',weight:700})),1),
   [K+'promise']:(p)=>left(p)+card(60,290,1080,200,label('中級の 約束：導線 全体の 式は 上級で',600,350,{size:30,color:C.ink,anchor:'middle'})
     +fade(seg(p,.4,.55),label('今回：粒子の力を 足して 導く',600,430,{size:34,color:CH,anchor:'middle',weight:700})),1,CH),
  };
 })(),
 // ===== S2 =====
 [K+'setup']:(p)=>wireBase({dims:seg(p,.15,.35)})+rowsCard([
   y=>label('長さ l、断面積 S',935,y+10,{size:28,color:C.ink,anchor:'middle',weight:700}),
   y=>label('𝐁：奥向き（⊗）',935,y+10,{size:28,color:CB,anchor:'middle',weight:700}),
   y=>label('電流：右向き',935,y+10,{size:28,color:CI,anchor:'middle',weight:700}),
  ],p,{y:270,h:62,gap:10,step:.2}),
 [K+'carrier']:(p)=>wireBase()+carriers(p,{vel:1,g:seg(p,.1,.3)})+rowsCard([
   y=>label('キャリア：電荷 q',935,y+10,{size:28,color:CQ,anchor:'middle',weight:700}),
   y=>label('1 m³ に n 個',935,y+10,{size:28,color:C.ink,anchor:'middle',weight:700}),
   y=>label('平均の 速度 𝐯',935,y+10,{size:28,color:CV,anchor:'middle',weight:700}),
  ],p,{y:270,h:62,gap:10,step:.2}),
 [K+'thermal']:(p)=>wireBase()+carriers(p,{jitter:1})+fade(seg(p,.4,.6),arrow(300,W.yc+W.h/2+115,420,W.yc+W.h/2+115,{color:CV,w:6,head:16})+T(bv,440,W.yc+W.h/2+125,{size:32,anchor:'start'})+label('平均',250,W.yc+W.h/2+125,{size:26,color:CV,anchor:'middle'}))
   +card(700,270,470,200,label('熱運動：平均すると 0',935,330,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.4,.55),label('平均の 速度 𝐯 だけ 使う',935,410,{size:28,color:CV,anchor:'middle',weight:700})),1),
 [K+'count']:(p)=>wireBase()+fade(seg(p,.05,.25),rect(W.x0,W.yc-W.h/2,W.x1-W.x0,W.h,{fill:CH,fo:.12,stroke:CH,sw:3,rx:6}))+carriers(p,{})
   +card(700,270,470,200,label('体積 ＝ S × l',935,330,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.4,.6),T(`n\\,S\\,${ll}`,880,415,{size:48,color:CQ})+label('個',960,425,{size:32,color:CQ,weight:700})),1),
 [K+'one']:(p)=>{
  let s=wireBase()+carriers(0,{g:.35});const x=W.x0+15+CAR[5][0]*440,y=W.yc-W.h/2+12+CAR[5][1]*(W.h-24);
  s+=arrow(x,y,x+60,y,{color:CV,w:5,head:14})+T(bv,x+70,y+10,{size:28,anchor:'start'})+fade(seg(p,.2,.4),arrow(x,y,x,y-80,{color:CF,w:6,head:16})+T(bF,x+12,y-70,{size:28,anchor:'start'}))+chargeDot(x,y,CQ,9);
  s+=card(700,270,470,200,T(`${qq}\\,${bv}\\times${bB}`,935,345,{size:46})+fade(seg(p,.5,.65),label('どのキャリアも 同じ力',935,430,{size:28,color:CF,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'sum']:(p)=>wireBase()+carriers(0,{force:1,big:seg(p,.4,.7)>.5?1:0})+fade(seg(p,.4,.6),arrow(365,110,365,25,{color:CF,w:11,head:28})+T(bF,395,50,{size:36,anchor:'start'}))
   +card(700,270,470,200,label('nSl 個を 足す',935,325,{size:28,color:C.dim,anchor:'middle'})+T(`${bF}=n\\,S\\,${ll}\\;${qq}\\,${bv}\\times${bB}`,935,415,{size:42}),1),
 // ===== S3 =====
 ...(()=>{
  const top=(p,{lv=0,vv2=1,sign=1}={})=>{let s=wireBase({dims:0,fieldBox:[60,60,660,200],current:1});
   s+=carriers(p,{sign,g:.6});
   if(lv)s+=fade(lv,arrow(W.x0,W.yc+W.h/2+30,W.x1,W.yc+W.h/2+30,{color:CL,w:5,head:18})+T(bl,W.x1+20,W.yc+W.h/2+42,{size:34,anchor:'start'}));
   if(vv2){const x=360,y=W.yc;s+=arrow(x,y,x+sign*90,y,{color:CV,w:6,head:16})+T(bv,x+sign*90+sign*16,y+10,{size:32,anchor:sign>0?'start':'end'});}
   return s;};
  const F1=`${bF}=n\\,S\\,${ll}\\;${qq}\\,${bv}\\times${bB}`,F2=`${bF}=n\\,${qq}\\,S\\,(${ll}\\,${bv})\\times${bB}`,F3=`${bF}=(n\\,${qq}\\,S\\,${vv})\\,${bl}\\times${bB}`;
  return {
   [K+'out']:(p)=>top(p)+fade(seg(p,.3,.5),label('n・q・S・l は ただの数',900,60,{size:26,color:C.dim,anchor:'middle'}))+eqStack([F1,F2],p),
   [K+'lvec']:(p)=>top(p,{lv:seg(p,.05,.25)})+eqStack([F2,`${ll}\\,${bv}=${vv}\\,${bl}`],p)+fade(seg(p,.5,.65),label('正の キャリア：𝐯 は 電流と 同じ向き',900,60,{size:26,color:CV,anchor:'middle'})),
   [K+'sub']:(p)=>top(p,{lv:1})+eqStack([F2,F3],p),
   [K+'I']:(p)=>top(p,{lv:1})+eqStack([F3,`n\\,${qq}\\,S\\,${vv}=${II}`],p)+fade(seg(p,.4,.55),label('中級：I ＝ enSv の e を q に',900,60,{size:26,color:C.dim,anchor:'middle'})),
   [K+'result']:(p)=>top(p,{lv:1})+card(260,270,680,200,T(F_IL,600,385,{size:64}),1,CH),
   [K+'elec']:(p)=>top(p,{lv:1,sign:-1})+eqStack([`${qq}=-${ee}`,`${ll}\\,${bv}=-${vv}\\,${bl}`],p)+label('電子：電流と 逆向きに 動く',900,60,{size:26,color:EL,anchor:'middle'}),
   [K+'elec2']:(p)=>top(p,{lv:1,sign:-1})+eqStack([`${qq}\\cdot ${ll}\\,${bv}=(-${ee})(-${vv}\\,${bl})=${ee}\\,${vv}\\,${bl}`,`${bF}=(n\\,${ee}\\,S\\,${vv})\\,${bl}\\times${bB}=${II}\\,${bl}\\times${bB}`],p)
     +fade(seg(p,.2,.35),label('負号が 2回 → 消える',900,60,{size:26,color:C.a,anchor:'middle',weight:700})),
  };
 })(),
 // ===== S4 =====
 [K+'mag']:(p)=>{
  const ox=200,oy=380,th=55*PI/180;
  let s=arrow(ox,oy,ox+380,oy,{color:CB,w:5,head:16})+T(bB,ox+395,oy+10,{size:34,anchor:'start'});
  s+=arrow(ox,oy,ox+300*Math.cos(th),oy-300*Math.sin(th),{color:CL,w:6,head:18})+label('電流の向き',ox+300*Math.cos(th)+14,oy-300*Math.sin(th),{size:24,color:CL});
  s+=`<path d="M ${ox+70} ${oy} A 70 70 0 0 0 ${(ox+70*Math.cos(th)).toFixed(1)} ${(oy-70*Math.sin(th)).toFixed(1)}" fill="none" stroke="${C.ink}" stroke-width="2"/>`+T('\\theta',ox+92,oy-30,{size:30});
  s+=card(660,110,510,320,T(`F=${II}\\,${ll}\\,${BB}\\sin\\theta`,915,200,{size:48})
   +fade(seg(p,.5,.65),label('直角（θ ＝ 90°）なら',915,285,{size:28,color:C.ink,anchor:'middle'})+T(`F=${BB}\\,${II}\\,${ll}`,915,370,{size:52,color:CH})+label('高校の式',1100,380,{size:22,color:C.dim,anchor:'middle'})),1);
  return s;
 },
 ...(()=>{
  const base=(p,{F=0}={})=>{let s=wireBase({dims:1});
   s+=label('I ＝ 2 A',W.x1+75,W.yc-W.h/2-30,{size:24,color:CI,anchor:'middle',weight:700})+label('0.5 m',(W.x0+W.x1)/2+50,W.yc+W.h/2+70,{size:26,color:CL})+label('B ＝ 0.1 T',W.x0-40,W.yc+W.h/2+72,{size:24,color:CB,weight:700});
   if(F)s+=fade(F,arrow(365,W.yc-W.h/2,365,W.yc-W.h/2-115,{color:CF,w:9,head:24})+label('0.1 N',395,W.yc-W.h/2-85,{size:30,color:CF,weight:700}));
   return s;};
  return {
   [K+'ex']:(p)=>base(p)+rowsCard([y=>label('I ＝ 2 A',935,y+10,{size:28,color:CI,anchor:'middle',weight:700}),y=>label('l ＝ 0.5 m',935,y+10,{size:28,color:CL,anchor:'middle',weight:700}),y=>label('B ＝ 0.1 T（直角）',935,y+10,{size:28,color:CB,anchor:'middle',weight:700})],p,{y:270,h:62,gap:10,step:.2}),
   [K+'ex2']:(p)=>base(p)+eqStack([`${bl}=0.5\\,${hx}\\ \\mathrm{m},\\quad ${bB}=0.1\\,${hy}\\ \\mathrm{T}`,`${II}\\,${bl}\\times${bB}=2\\times0.5\\times0.1\\,(${hx}\\times${hy})\\ \\mathrm{N}`],p,{y:270,h:225}),
   [K+'ex3']:(p)=>base(p,{F:seg(p,.3,.5)})+eqStack([`${II}\\,${bl}\\times${bB}=0.1\\,(${hx}\\times${hy})\\ \\mathrm{N}`,`${hx}\\times${hy}=${hz}\\ \\Rightarrow\\ ${bF}=0.1\\,${hz}\\ \\mathrm{N}`],p,{y:270,h:225}),
  };
 })(),
 ...(()=>{
  const base=(p,big=0)=>wireBase({dims:0})+carriers(p,{sign:-1,force:1,big})+label('1 mm² の 銅線、l ＝ 0.5 m、I ＝ 2 A',380,W.yc+W.h/2+64,{size:24,color:C.dim,anchor:'middle'});
  return {
   [K+'bundle']:(p)=>base(p)+eqStack([`n\\approx8.5\\times10^{28}\\ /\\mathrm{m^3},\\quad S=10^{-6}\\ \\mathrm{m^2}`,`n\\,S\\,${ll}=8.5\\times10^{28}\\times10^{-6}\\times0.5\\approx4.25\\times10^{22}`],p,{y:270,h:225})+fade(seg(p,.5,.65),label('個',1110,460,{size:30,color:C.ink,weight:700})),
   [K+'each']:(p)=>base(p)+eqStack([`${vv}=\\dfrac{${II}}{n\\,${ee}\\,S}\\approx1.47\\times10^{-4}\\ \\mathrm{m/s}`,`${ee}\\,${vv}\\,${BB}\\approx2.35\\times10^{-24}\\ \\mathrm{N}`],p,{y:270,h:225}),
   [K+'product']:(p)=>base(p,1)+fade(seg(p,.4,.6),arrow(365,W.yc-W.h/2,365,25,{color:CF,w:10,head:26}))+eqStack([`4.25\\times10^{22}\\times2.35\\times10^{-24}\\ \\mathrm{N}`,`\\approx0.1\\ \\mathrm{N}`],p,{y:270,h:225})+fade(seg(p,.4,.55),label('＝ I l B と 一致',900,450,{size:28,color:CF,weight:700})),
  };
 })(),
 [K+'unit']:(p)=>card(200,60,800,420,label('単位の 確かめ',600,110,{size:26,color:C.dim,anchor:'middle'})
   +T(`F=${II}\\,${ll}\\,${BB}`,600,190,{size:46})
   +fade(seg(p,.2,.35),T(`\\mathrm{N}=\\mathrm{A}\\times\\mathrm{m}\\times\\mathrm{T}`,600,290,{size:46}))
   +fade(seg(p,.5,.65),T(`1\\ \\mathrm{T}=1\\ \\dfrac{\\mathrm{N}}{\\mathrm{A\\cdot m}}`,600,410,{size:50,color:CB})),1),
 // ===== S5 モーター =====
 [K+'motor']:(p)=>coil3D(mkP(300,290,250),{g:seg(p,0,.25)})+card(760,120,410,240,label('磁場の中の',965,185,{size:28,color:C.ink,anchor:'middle'})+label('長方形の コイル',965,240,{size:30,color:CH,anchor:'middle',weight:700})+label('＋ 電流',965,300,{size:28,color:CI,anchor:'middle',weight:700}),seg(p,.2,.35)),
 [K+'coil']:(p)=>coil3D(mkP(300,290,250),{labels:1})+rowsCard([
   y=>label('0.1 m × 0.05 m、100 巻き',965,y+10,{size:26,color:C.ink,anchor:'middle',weight:700}),
   y=>label('I ＝ 2 A',965,y+10,{size:28,color:CI,anchor:'middle',weight:700}),
   y=>T(`${bB}=0.1\\,${hx}\\ \\mathrm{T}`,965,y,{size:38}),
  ],p,{x:760,y:110,w:410,h:76,step:.2}),
 [K+'axis']:(p)=>coil3D(mkP(200,330,130),{labels:0,hlLong:1})+fade(seg(p,.3,.5),arrow(470,250,560,250,{color:C.dim,w:3,head:12})+label('軸の方向から 見る',515,225,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.4,.6),`<g transform="translate(600 60) scale(.5)">${axisView({cx:380,cy:270,R:150,forces:0,bLab:0})}</g>`)
   +card(820,320,350,150,label('長い辺 ＝ y に 沿う',995,375,{size:26,color:CH,anchor:'middle',weight:700})+label('→ 点に 見える',995,430,{size:26,color:C.ink,anchor:'middle'}),seg(p,.6,.75)),
 [K+'side']:(p)=>axisView({forces:seg(p,.3,.5)>0?1:0,g:1})+card(760,110,410,320,label('1辺の力（直角）',965,160,{size:26,color:C.dim,anchor:'middle'})
   +T(`N\\,${II}\\,${ll}\\,${BB}`,965,235,{size:44})+label('N：巻き数',965,280,{size:22,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.5),T(`=100\\times2\\times0.1\\times0.1`,965,345,{size:34}))+fade(seg(p,.6,.75),T(`=2\\ \\mathrm{N}`,965,410,{size:44,color:CF})),1),
 [K+'dirs']:(p)=>axisView({})+label('右の辺：手前 ⊙',530,470,{size:24,color:CI,anchor:'middle',weight:700})+label('左の辺：奥 ⊗',230,470,{size:24,color:CI,anchor:'middle',weight:700})
   +card(760,110,410,320,T(`(-${hy})\\times${hx}=${hz}`,965,190,{size:42})+label('右の辺：上向き',965,260,{size:28,color:CF,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),T(`${hy}\\times${hx}=-${hz}`,965,340,{size:42})+label('左の辺：下向き',965,405,{size:28,color:CF,anchor:'middle',weight:700})),1),
 [K+'short']:(p)=>coil3D(mkP(300,290,250),{hlShort:1})+card(760,110,410,300,label('0.05 m の 2辺',965,165,{size:28,color:CH,anchor:'middle',weight:700})+label('電流 ∥ 𝐁',965,225,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),T(`${hx}\\times${hx}=0`,965,305,{size:46}))+fade(seg(p,.6,.75),label('力は 0',965,375,{size:30,color:CF,anchor:'middle',weight:700})),1),
 [K+'couple']:(p)=>axisView({})+rotArrow(380,270,215,seg(p,.5,.7))+label('2 N',570,150,{size:28,color:CF,weight:700})+label('2 N',150,400,{size:28,color:CF,weight:700})
   +card(760,110,410,320,label('上 2 N ＋ 下 2 N',965,170,{size:28,color:C.ink,anchor:'middle'})+label('合力 ＝ 0',965,230,{size:30,color:CF,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('作用線が ずれる',965,315,{size:28,color:C.ink,anchor:'middle'})+label('→ 回る',965,375,{size:32,color:CH,anchor:'middle',weight:700})),1),
 [K+'torque']:(p)=>axisView({arms:1})+label('0.025 m',455,300,{size:24,color:CH,anchor:'middle'})+label('0.025 m',305,300,{size:24,color:CH,anchor:'middle'})
   +card(760,110,410,320,label('トルク ＝ 力 × 腕',965,165,{size:26,color:C.dim,anchor:'middle'})+T(`2\\times(2\\ \\mathrm{N}\\times0.025\\ \\mathrm{m})`,965,250,{size:38})
   +fade(seg(p,.4,.6),T(`=0.1\\ \\mathrm{N\\cdot m}`,965,350,{size:46,color:CH})),1),
 [K+'niab']:(p)=>card(60,60,1080,420,label('2辺 × 力 × 腕',600,110,{size:26,color:C.dim,anchor:'middle'})
   +TF(`2\\times(N\\,${II}\\,l_1\\,${BB})\\times\\dfrac{l_2}{2}=N\\,${II}\\,(l_1 l_2)\\,${BB}=N\\,${II}\\,A\\,${BB}`,600,195,1000,44)
   +label('l₁ ＝ 0.1 m（辺）、l₂ ＝ 0.05 m（幅）、A ＝ l₁ l₂',600,270,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),TF(`=100\\times2\\times0.005\\times0.1=0.1\\ \\mathrm{N\\cdot m}`,600,370,1000,44,{color:CH})),1),
 [K+'tilt']:(p)=>{
  const phi=seg(p,.05,.6)*55*PI/180;
  let s=axisView({phi,arms:1});
  s+=card(760,110,410,320,label('力：上下の まま',965,165,{size:28,color:CF,anchor:'middle',weight:700})+label('腕：短くなる',965,225,{size:28,color:CH,anchor:'middle',weight:700})+label('→ トルクは 減る',965,280,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('面 ∥ 𝐁 のとき 最大',965,350,{size:26,color:C.ink,anchor:'middle'})+label('0.1 N·m',965,400,{size:30,color:CH,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'comm']:(p)=>{
  const phi=2*PI*seg(p,.02,.98);
  let s=axisView({phi,flipMarks:1})+rotArrow(380,270,215,1);
  s+=card(760,110,410,320,label('半回転ごとに',965,175,{size:28,color:C.ink,anchor:'middle'})+label('電流の 向きを 切り替え',965,235,{size:28,color:CI,anchor:'middle',weight:700})
   +label('右側の辺は いつも ⊙ → 上',965,305,{size:24,color:C.dim,anchor:'middle'})+label('→ 同じ向きに 回り続ける',965,370,{size:26,color:CH,anchor:'middle',weight:700}),1);
  return s;
 },
 [K+'work']:(p)=>card(120,60,960,420,label('磁気力は 電荷に 仕事を しない（仕事の回）',600,130,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('モーターの 仕事の エネルギー ← 電源',600,230,{size:30,color:CH,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('回る コイル → 電磁誘導の 起電力（中級）',600,330,{size:28,color:C.v,anchor:'middle'})+label('電源は それに 逆らって 電流を 流す',600,390,{size:26,color:C.dim,anchor:'middle'})),1),
 // ===== S6 =====
 [K+'sum1']:(p)=>wireBase({dims:0})+carriers(p,{force:1})+eqStack([`${bF}=n\\,S\\,${ll}\\;${qq}\\,${bv}\\times${bB}`,`n\\,${qq}\\,S\\,${vv}=${II}\\ \\Rightarrow\\ ${F_IL}`],p,{y:270,h:225})+fade(seg(p,.6,.75),label('電子でも 同じ',900,60,{size:28,color:EL,anchor:'middle',weight:700})),
 [K+'sum2']:(p)=>{
  let s=card(80,70,1040,110,T(`F=${BB}\\,${II}\\,${ll}`,320,135,{size:44})+label('（直角）',520,145,{size:24,color:C.dim}),1);
  s+=card(80,200,1040,110,T(`1\\ \\mathrm{T}=1\\ \\dfrac{\\mathrm{N}}{\\mathrm{A\\cdot m}}`,600,262,{size:42}),seg(p,.25,.4));
  s+=card(80,330,1040,130,label('コイルの 2辺の 逆向きの 力 →',420,405,{size:28,color:C.ink,anchor:'middle'})+T(`N\\,${II}\\,A\\,${BB}`,850,402,{size:46,color:CH}),seg(p,.55,.7));
  return s;
 },
 [K+'next1']:(p)=>card(90,110,460,280,label('受ける側',320,170,{size:30,color:C.dim,anchor:'middle'})+T(F_IL,320,265,{size:44})+label('電流 ← 磁場',320,340,{size:28,color:C.ink,anchor:'middle'}),1)
   +fade(seg(p,.4,.55),arrow(570,250,640,250,{color:C.dim,w:4}))
   +card(650,110,460,280,label('作る側',880,170,{size:30,color:CH,anchor:'middle',weight:700})+label('電流 → 磁場',880,260,{size:32,color:CB,anchor:'middle',weight:700})+label('？',880,340,{size:40,color:CH,anchor:'middle',weight:700}),seg(p,.45,.6),CH),
 [K+'next']:(p)=>{
  let s=line(150,260,700,260,{color:CI,w:8})+arrow(620,260,700,260,{color:CI,w:8,head:22})+label('電流 I',700,230,{size:26,color:CI,weight:700});
  for(let i=0;i<8;i++){const x=170+i*64,g=seg(p,.05+i*.06,.15+i*.06);s+=fade(g,line(x,248,x,272,{color:CH,w:3})+arrow(x+6,260,x+50,260,{color:CL,w:4,head:10}));}
  s+=fade(seg(p,.5,.65),dot(430,120,8,CH)+label('ここの 磁場',450,110,{size:24,color:CH}));
  for(let i=0;i<8;i++){const x=198+i*64;s+=fade(seg(p,.55,.75),line(x,250,430,128,{color:C.dim,w:1.5,dash:'4 6'}));}
  s+=card(760,140,410,240,label('電流の 小さな 部分ごとに',965,215,{size:28,color:C.ink,anchor:'middle'})+label('磁場を 足すと？',965,280,{size:32,color:CH,anchor:'middle',weight:700}),seg(p,.3,.45),CH);
  return s;
 },
};
