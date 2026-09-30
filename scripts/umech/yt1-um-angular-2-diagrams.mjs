// YouTube シリーズ「角運動量・中級 2/2」(ys-um-angular-2) — 図。Stage 1200×515.
// 色（初級15・1/2 とそろえる）：𝐫 水色、𝐯 紫、𝐩 桃、𝐋 黄、v⊥ 黄、θ 橙、𝐅 緑、𝐍 桃。ベクトルは太字、大きさは細字。
// 平面は真上から見る。円運動は反時計回り → 𝐋 手前 ⊙。直線運動（O の上の線を右へ）→ 時計回り → 𝐋 奥 ⊗（成分 (x,3,0)×(8,0,0)＝(0,0,−24)）。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';

const K='um-angular-2:';
const CR=C.x,CV=C.v,CP=C.p,CL=C.hi,CQ=C.hi,CT=C.E,CF=C.F,CN=C.p,NG=C.a;
const RAD=Math.PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const vl=(s,x,y,{size=30,color=C.ink,anchor='start'}={})=>tex(`\\mathbf{${s}}`,x,y,{size:size+6,color,anchor,auto:false});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bL=cs(CL,'\\mathbf{L}'),br=cs(CR,'\\mathbf{r}'),bp=cs(CP,'\\mathbf{p}'),bv=cs(CV,'\\mathbf{v}'),bF=cs(CF,'\\mathbf{F}'),bN=cs(CN,'\\mathbf{N}');
const vperp=cs(CQ,'v_{\\perp}');
const LU='\\,\\mathrm{kg\\cdot m^2/s}';

function outSym(x,y,r=22,color=CL,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=22,color=CL,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function head(pts,color){const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1),L=16;
 return `<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${color}"/>`;}
function arc2(pts,{c1=CR,c2=CV,w=5,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2);
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head(pts,c2));
}
function turnArc(cx,cy,r,a0,a1,{color=CL,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=circPts(cx,cy,r,a0,a1,30);
 return fade(g,draw(pts,1,{color,w})+head(pts,color));
}
function rightMark(x,y,ux,uy,vx,vy,q=14,color=C.dim){return line(x+ux*q,y+uy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w:2})+line(x+vx*q,y+vy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w:2});}
const tick=(x,y,sz=14,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const crossX=(x,y,sz=14,color=NG)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:5})+line(x-sz,y+sz,x+sz,y-sz,{color,w:5});
const ball=(x,y,r=18)=>ring(x,y,r,{color:C.ink,w:3,fill:'#2c3854'});
const baseDot=(x,y,name='O',dy=40)=>ring(x,y,10,{color:C.ink,w:3,fill:C.bg})+(name?label(name,x,y+dy,{size:26,color:C.ink,anchor:'middle',weight:700}):'');

// ---- circular motion --------------------------------------------------------------------------------
const CI={cx:300,cy:275,R:165,kv:30};
function circleScene({phi=.5,rG=1,vG=1,perpG=0,Lsym=0,labels=1,arcG=0,title=1,vText='4 m/s'}={}){
 const {cx,cy,R,kv}=CI,bx=cx+R*Math.cos(phi),by=cy-R*Math.sin(phi),tx=-Math.sin(phi),ty=-Math.cos(phi);
 let s=title?label('真上から見た図',40,50,{size:24,color:C.dim}):'';
 s+=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'});
 s+=baseDot(cx,cy,labels?'中心':'',60);
 if(rG>0)s+=fade(rG,arrow(cx,cy,bx-18*Math.cos(phi),by+18*Math.sin(phi),{color:CR,w:5,head:14})+(labels?vl('r',(cx+bx)/2+30*Math.sin(phi),(cy+by)/2+30*Math.cos(phi)+10,{size:28,color:CR,anchor:'middle'})+label('3 m',(cx+bx)/2+30*Math.sin(phi)+22,(cy+by)/2+30*Math.cos(phi)+14,{size:22,color:CR}):''));
 if(perpG>0)s+=fade(perpG,rightMark(bx,by,-Math.cos(phi),Math.sin(phi),tx,ty,16,C.hi));
 if(vG>0)s+=fade(vG,arrow(bx,by,bx+tx*4*kv,by+ty*4*kv,{color:CV,w:6})+(labels?vl('v',bx+tx*4*kv+10,by+ty*4*kv-6,{size:28,color:CV})+label(vText,bx+tx*2*kv+Math.cos(phi)*40,by+ty*2*kv-Math.sin(phi)*40,{size:22,color:CV,anchor:'middle'}):''));
 s+=ball(bx,by);
 if(arcG>0)s+=turnArc(cx,cy,60,phi+.15,phi+.15+1.3*arcG,{color:C.dim,w:3,g:Math.min(1,arcG*5)});
 if(Lsym>0)s+=outSym(cx,cy,22,CL,Lsym);
 return s;
}

// ---- tilted velocity (θ = 30°) ------------------------------------------------------------------------
const TI={ox:140,oy:370,rp:330,kv:40};
const TH=30*RAD;
function tiltScene({vG=1,thG=1,splitG=0,paraG=0,paraPerp=0,dimAlong=0,labels=1}={}){
 const {ox,oy,rp,kv}=TI,bx=ox+rp,by=oy,L=4*kv,ux=Math.cos(TH),uy=-Math.sin(TH);
 let s=label('真上から見た図',40,50,{size:24,color:C.dim});
 if(paraG>0){const h=paraPerp?L*Math.sin(TH):L*Math.sin(TH);
  s+=fade(paraG,poly([[ox,oy],[bx,by],[bx+L*ux,by+L*uy],[ox+L*ux,oy+L*uy]],{fill:CL,fo:.22,stroke:C.faint,sw:2}));}
 s+=baseDot(ox,oy,'O');
 s+=arrow(ox,oy,bx-18,by,{color:CR,w:6,head:16})+vl('r',(ox+bx)/2,oy+44,{size:30,color:CR,anchor:'middle'})+label('3 m',(ox+bx)/2+40,oy+40,{size:22,color:CR});
 if(splitG>0){
  s+=fade(splitG*(1-.6*dimAlong),arrow(bx,by,bx+L*ux,by,{color:CV,w:4,head:14,opacity:.75})+label('沿う部分',bx+L*ux+8,by+32,{size:22,color:CV,anchor:'middle'}));
  s+=fade(splitG,arrow(bx,by,bx,by+L*uy,{color:CQ,w:6,head:16})+T(vperp,bx-14,by+L*uy/2,{size:34,anchor:'end'}));
  s+=fade(splitG,line(bx,by+L*uy,bx+L*ux,by+L*uy,{color:C.faint,w:2,dash:'5 5'})+line(bx+L*ux,by,bx+L*ux,by+L*uy,{color:C.faint,w:2,dash:'5 5'})+rightMark(bx,by,1,0,0,-1,14));
 }
 s+=ball(bx,by);
 if(vG>0)s+=fade(vG,arrow(bx,by,bx+L*ux,by+L*uy,{color:CV,w:6,opacity:splitG>0?.6:1})+vl('v',bx+L*ux+12,by+L*uy-4,{size:28,color:CV})+label('4 m/s',bx+L*ux+14,by+L*uy+30,{size:22,color:CV}));
 if(thG>0)s+=fade(thG,line(bx+18,by,bx+120,by,{color:C.dim,w:2,dash:'5 6'})+draw(circPts(bx,by,62,0,TH,16),1,{color:CT,w:3.5})+label('30°',bx+70,by-10,{size:24,color:CT,weight:700}));
 return s;
}

// ---- straight line past O ------------------------------------------------------------------------------
const LI={ox:430,oy:445,ppm:50,d:3,kv:25};
const LX=x=>LI.ox+x*LI.ppm, LY=LI.oy-LI.d*LI.ppm;
function lineScene(x,{rG=1,vG=1,thG=0,perpG=0,Lsym=0,labR='',base=null,arcG=0,trail=1,dLabel=1}={}){
 const {ox,oy,kv}=LI,bx=LX(x),by=LY;
 let s=label('真上から見た図',40,50,{size:24,color:C.dim});
 s+=line(80,by,780,by,{color:C.faint,w:2,dash:'8 8'})+label('玉の進む線',90,by-16,{size:22,color:C.dim});
 const bxo=base?base[0]:ox,byo=base?base[1]:oy;
 s+=baseDot(bxo,byo,base?'Q':'O',base?-18:40);
 if(perpG>0)s+=fade(perpG,line(ox,oy,ox,by,{color:CQ,w:4,dash:'10 7'})+rightMark(ox,by,0,1,1,0,14)+(dLabel?label('3 m',ox-14,(oy+by)/2+8,{size:26,color:CQ,anchor:'end',weight:700}):''));
 if(rG>0){const L=Math.hypot(bx-bxo,by-byo),ux=(bx-bxo)/L,uy=(by-byo)/L;
  s+=fade(rG,arrow(bxo,byo,bx-ux*18,by-uy*18,{color:CR,w:5,head:14})+(labR?label(labR,(bxo+bx)/2+(x>=0?16:-16),(byo+by)/2+(x>=0?20:20),{size:24,color:CR,anchor:x>=0?'start':'end',weight:700}):''));
  if(thG>0){s+=fade(thG,line(bx,by,bx+ux*90,by+uy*90,{color:C.dim,w:2,dash:'5 6'}));const a0=0,a1=Math.atan2(-uy,ux);s+=fade(thG,draw(circPts(bx,by,50,a0,a1,16),1,{color:CT,w:3.5})+label('θ',bx+58*Math.cos(a1/2),by-58*Math.sin(a1/2)-4,{size:24,color:CT,weight:700}));}
 }
 if(vG>0)s+=fade(vG,arrow(bx,by,bx+4*kv,by,{color:CV,w:6})+vl('v',bx+4*kv+8,by-10,{size:26,color:CV}));
 s+=ball(bx,by,16);
 if(arcG>0)s+=turnArc(ox,oy,56,Math.PI/2-.2,Math.PI/2-.2-1.2*arcG,{color:C.dim,w:3,g:Math.min(1,arcG*5)});
 if(Lsym>0)s+=inSym(ox,oy,22,CL,Lsym);
 return s;
}

export const ytUmAngular2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const phi=.4+1.0*seg(p,0,1);
  let s=circleScene({phi,labels:0,title:0,vG:0});
  const {cx,cy,R}=CI,bx=cx+R*Math.cos(phi),by=cy-R*Math.sin(phi),tx=-Math.sin(phi),ty=-Math.cos(phi);
  s+=arrow(bx,by,bx+tx*110,by+ty*110,{color:CP,w:6})+vl('p',bx+tx*110+8,by+ty*110-6,{size:28,color:CP});
  s+=card(620,100,520,300,label('前回の最後の問い',880,150,{size:22,color:C.dim,anchor:'middle'})
   +T(`${bp}=m\\mathbf{v}`,880,220,{size:44})+label('の 回転版',880,280,{size:28,color:C.ink,anchor:'middle'})
   +label('回転の勢いは どう定義する？',880,345,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  const ox=140,oy=360,px=520,py=360;
  let s=label('真上から見た図',40,50,{size:24,color:C.dim});
  s+=baseDot(ox,oy,'基準点');
  s+=arrow(ox,oy,px-6,py,{color:CR,w:6,head:16})+vl('r',(ox+px)/2,oy+46,{size:30,color:CR,anchor:'middle'});
  s+=dot(px,py,9,C.ink)+arrow(px,py,px+139,py-80,{color:CF,w:6})+vl('F',px+150,py-86,{size:30,color:CF});
  s+=card(740,90,420,340,label('前回：トルク',950,145,{size:26,color:C.dim,anchor:'middle'})
   +T(`${bN}=${br}\\times${bF}`,950,225,{size:50})
   +fade(seg(p,.55,.7),label('大きさ ＝',950,305,{size:26,color:C.ink,anchor:'middle'})+label('回す角度あたりの 仕事',950,355,{size:28,color:C.E,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'plan']:(p)=>{
  const it=(i,t,c,g)=>fade(g,dot(170,160+i*100,9,c)+label(t,200,170+i*100,{size:32,color:c,weight:700}));
  return card(110,70,980,380,label('今回 確かめること',600,120,{size:26,color:C.dim,anchor:'middle'})
   +it(0,'① 回転の勢い ＝ 角運動量 の定義',C.ink,seg(p,.05,.2))
   +it(1,'② いつ m × r × v になるか',C.hi,seg(p,.5,.65)),seg(p,0,.1));
 },
 [K+'predict']:(p)=>{
  const phi=.3+2*seg(p,0,1);
  const cx=210,cy=280,R=120,bx=cx+R*Math.cos(phi),by=cy-R*Math.sin(phi);
  let s=label('円を回る玉',cx,90,{size:26,color:C.ink,anchor:'middle'})+ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'})+baseDot(cx,cy,'')+arrow(cx,cy,bx,by,{color:CR,w:4,head:12})+ball(bx,by,15);
  const x2=440+220*seg(p,.1,.9);
  s+=label('まっすぐ進む玉',560,90,{size:26,color:C.ink,anchor:'middle'})+line(420,200,700,200,{color:C.faint,w:2,dash:'8 8'})+baseDot(540,360,'O')+arrow(540,360,x2,200,{color:CR,w:4,head:12,opacity:.7})+ball(x2,200,15)+arrow(x2+16,200,x2+80,200,{color:CV,w:5,head:14});
  s+=fade(seg(p,.2,.35),label('？',600,300,{size:44,color:C.hi,anchor:'middle',weight:700}));
  s+=card(790,120,370,260,label('まっすぐ進む玉にも',975,185,{size:26,color:C.ink,anchor:'middle'})+label('回転の勢いは ある？',975,250,{size:30,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',975,315,{size:22,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 // ===== S2 角運動量の定義 =====
 [K+'def']:(p)=>{
  const ox=150,oy=380,bx=450,by=380;
  let s=label('真上から見た図',40,50,{size:24,color:C.dim})+baseDot(ox,oy,'基準点');
  s+=arrow(ox,oy,bx-18,by,{color:CR,w:6,head:16})+vl('r',(ox+bx)/2,oy+46,{size:30,color:CR,anchor:'middle'});
  s+=fade(seg(p,.1,.3),arrow(bx,by-18,bx,by-190,{color:CP,w:6})+vl('p',bx+14,by-170,{size:30,color:CP})+label('＝ m𝐯',bx+48,by-172,{size:24,color:CP}));
  s+=ball(bx,by);
  s+=card(680,90,480,340,label('角運動量（回転の勢い）',920,145,{size:28,color:CL,anchor:'middle',weight:700})
   +T(`${bL}=${br}\\times${bp}`,920,235,{size:58})
   +fade(seg(p,.3,.45),label('トルク 𝐍 ＝ 𝐫 × 𝐅 の 𝐅 → 𝐩',920,315,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.7,.85),label('初級15 で予告した式',920,380,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'rdir']:(p)=>{
  let s='';
  s+=baseDot(150,190,'基準点',-24)+arrow(160,190,432,190,{color:CR,w:6,head:16})+vl('r',290,168,{size:30,color:CR})+ball(450,190)+label('物体',450,150,{size:22,color:C.dim,anchor:'middle'});
  s+=tick(520,190,18);
  s+=fade(seg(p,.45,.6),baseDot(150,370,'基準点',44)+arrow(432,370,168,370,{color:CR,w:4,head:14,opacity:.6})+ball(450,370)+crossX(520,370,16));
  s+=card(640,100,520,300,label('𝐫 の向き',900,160,{size:28,color:CR,anchor:'middle',weight:700})
   +label('基準点 → 物体',900,230,{size:32,color:C.F,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('物体 → 基準点 ではない',900,320,{size:28,color:NG,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'size']:(p)=>{
  const ox=140,oy=390,bx=470,by=390,L=200,a=55*RAD,ux=Math.cos(a),uy=-Math.sin(a);
  let s=label('真上から見た図',40,50,{size:24,color:C.dim});
  s+=fade(seg(p,.05,.25),poly([[ox,oy],[bx,by],[bx+L*ux,by+L*uy],[ox+L*ux,oy+L*uy]],{fill:CL,fo:.2,stroke:C.faint,sw:2}));
  s+=baseDot(ox,oy,'O')+arrow(ox,oy,bx-18,by,{color:CR,w:6,head:16})+vl('r',(ox+bx)/2,oy+46,{size:30,color:CR,anchor:'middle'});
  s+=ball(bx,by)+arrow(bx,by,bx+L*ux,by+L*uy,{color:CP,w:6})+vl('p',bx+L*ux+12,by+L*uy,{size:30,color:CP});
  s+=fade(seg(p,.6,.75),line(bx+18,by,bx+100,by,{color:C.dim,w:2,dash:'5 6'})+draw(circPts(bx,by,52,0,a,16),1,{color:CT,w:3.5})+label('θ',bx+62,by-24,{size:26,color:CT,weight:700}));
  s+=card(720,80,440,360,label('大きさ ＝ 平行四辺形の面積',940,135,{size:24,color:CL,anchor:'middle'})
   +T(`L=r\\,${cs(CP,'p')}\\sin\\theta`,940,210,{size:42})
   +fade(seg(p,.3,.45),T(`=m\\,r\\,${cs(CV,'v')}\\sin\\theta`,960,290,{size:42}))
   +fade(seg(p,.6,.75),label('θ：𝐫 と 𝐯 の間の角',940,380,{size:26,color:CT,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=circleScene({phi:0,vText:'',arcG:0,labels:0,rG:1,vG:1});
  const {cx,cy}=CI;
  s+=arc2(circPts(cx,cy,70,0,Math.PI/2*seg(p,.05,.35),30),{c1:CR,c2:CV,g:seg(p,.05,.1)})+outSym(cx,cy,22,CL,seg(p,.35,.5));
  s+=card(640,90,520,340,label('向き：右ねじ（トルクと同じ）',900,145,{size:26,color:CL,anchor:'middle'})
   +fade(seg(p,.5,.65),label('単位',900,230,{size:24,color:C.dim,anchor:'middle'})+T(`\\mathrm{m}\\times\\mathrm{kg\\cdot m/s}`,900,295,{size:40})+T(`=\\mathrm{kg\\cdot m^2/s}`,920,370,{size:42,color:CL})),seg(p,0,.12));
  return s;
 },
 [K+'examples']:(p)=>{
  // spin (top view of a spinning body) and planet orbit
  const a=2.2*p;let s=label('スピン（上から見る）',250,80,{size:26,color:C.ink,anchor:'middle'});
  s+=ring(250,270,110,{color:C.faint,w:2,dash:'6 7'});
  for(let k=0;k<3;k++){const b=a+k*2*Math.PI/3;s+=ball(250+110*Math.cos(b),270-110*Math.sin(b),14)+arrow(250+110*Math.cos(b),270-110*Math.sin(b),250+110*Math.cos(b)-50*Math.sin(b),270-110*Math.sin(b)-50*Math.cos(b),{color:CV,w:4,head:12});}
  s+=outSym(250,270,20,CL);
  s+=label('惑星の公転',770,80,{size:26,color:C.ink,anchor:'middle'});
  const cx=770,cy=270,A=230,B=140,c=Math.sqrt(A*A-B*B),t=a*.8;
  s+=draw(Array.from({length:81},(_,i)=>{const u=2*Math.PI*i/80;return [cx+A*Math.cos(u),cy-B*Math.sin(u)];}),1,{color:C.faint,w:2,dash:'6 7'});
  s+=dot(cx-c,cy,16,C.t)+label('太陽',cx-c,cy+46,{size:22,color:C.t,anchor:'middle'});
  s+=ring(cx+A*Math.cos(t),cy-B*Math.sin(t),13,{color:C.x,w:3,fill:'#1a3040'});
  s+=fade(seg(p,.4,.6),label('どちらも 角運動量 で語られる',600,480,{size:28,color:CL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  const row=(y,a,b,c,g,col)=>fade(g,T(a,300,y,{size:44})+label('が',360,y+10,{size:28,color:C.ink})+T(b,450,y,{size:44})+label(c,500,y+10,{size:28,color:col,weight:700}));
  return card(100,60,1000,400,label('勢いと呼ぶ理由',600,115,{size:26,color:C.dim,anchor:'middle'})
   +label('力',200,200,{size:28,color:CF})+row(190,bF,bp,'を変える',1,C.ink)
   +fade(seg(p,.3,.45),label('トルク',170,300,{size:28,color:CN})+row(290,bN,bL,'を変える',1,C.ink))
   +fade(seg(p,.6,.75),label('（同じ形。式は 剛体の回転・中級 で確かめる）',600,395,{size:26,color:C.hi,anchor:'middle'})),seg(p,0,.1));
 },
 // ===== S3 円運動なら mrv =====
 [K+'circle']:(p)=>{
  const phi=-.3+.9*seg(p,.1,.9);
  let s=circleScene({phi,rG:seg(p,.3,.5),vG:seg(p,.4,.6)});
  s+=card(680,100,480,300,label('m ＝ 2 kg',920,165,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('半径 r ＝ 3 m',920,230,{size:30,color:CR,anchor:'middle',weight:700})
   +label('速さ v ＝ 4 m/s',920,295,{size:30,color:CV,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('基準点：円の中心',920,360,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'perp']:(p)=>{
  const phi=.6;
  let s=circleScene({phi,perpG:seg(p,.3,.5)});
  s+=card(680,100,480,300,label('速度：円の接線の向き',920,165,{size:28,color:CV,anchor:'middle'})
   +fade(seg(p,.3,.45),label('𝐫 と 直角',920,230,{size:32,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),T(`\\sin\\theta=\\sin90^\\circ=1`,920,315,{size:40})),seg(p,0,.12));
  return s;
 },
 [K+'mrv']:(p)=>{
  let s=circleScene({phi:.6,perpG:1,Lsym:seg(p,.6,.75),arcG:seg(p,.55,.7)});
  s+=fade(seg(p,.6,.75),vl('L',CI.cx-70,CI.cy-10,{size:30,color:CL}));
  s+=card(640,80,520,360,T(`L=m\\,r\\,${cs(CV,'v')}`,900,150,{size:44})
   +fade(seg(p,.1,.25),T(`=2\\times3\\times4`,910,225,{size:42}))
   +fade(seg(p,.25,.4),T(`=${cs(CL,'24'+LU)}`,920,300,{size:40}))
   +fade(seg(p,.6,.75),label('𝐫 → 𝐯 反時計回り：手前向き',900,385,{size:26,color:CL,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'everywhere']:(p)=>{
  const phi=.6+2*Math.PI*seg(p,0,1);
  let s=circleScene({phi,perpG:1,Lsym:1,vText:'',labels:0});
  s+=card(680,120,480,260,label('どこにいても 𝐫 ⊥ 𝐯',920,190,{size:30,color:C.ink,anchor:'middle'})
   +T(`L=${cs(CL,'24'+LU)}`,920,275,{size:40})+label('変わらない',920,345,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.12));
  return s;
 },
 [K+'three']:(p)=>{
  const it=(i,t,g)=>fade(g,label(t,240,180+i*80,{size:32,color:C.ink,weight:700})+label('→ L も 2倍',720,180+i*80,{size:30,color:CL,weight:700}));
  return card(110,60,980,400,label('L ＝ m r v',600,115,{size:34,color:CL,anchor:'middle',weight:700})
   +it(0,'遠くを回る（r を 2倍）',seg(p,.05,.2))+it(1,'重い物が回る（m を 2倍）',seg(p,.15,.3))+it(2,'速く回る（v を 2倍）',seg(p,.25,.4))
   +fade(seg(p,.6,.75),label('どれも 比例',600,430,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.1));
 },
 // ===== S4 直角でないとき =====
 [K+'tilt']:(p)=>{
  let s=tiltScene({vG:seg(p,.3,.5),thG:seg(p,.45,.6)});
  s+=card(760,90,400,340,label('同じ 2 kg・3 m・4 m/s',960,150,{size:26,color:C.ink,anchor:'middle'})
   +label('𝐯 が 𝐫 から 30°',960,215,{size:30,color:CT,anchor:'middle',weight:700})
   +label('L は いくつ？',960,295,{size:34,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',960,355,{size:22,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'split']:(p)=>{
  let s=tiltScene({splitG:seg(p,.15,.45)});
  s+=card(760,90,400,340,label('𝐯 を 分ける',960,150,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.15,.3),label('𝐫 に沿う部分',960,220,{size:28,color:CV,anchor:'middle'}))
   +fade(seg(p,.3,.45),label('𝐫 に直角な部分',960,285,{size:28,color:CQ,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),T(`${vperp}=v\\sin\\theta`,960,365,{size:42})),seg(p,0,.12));
  return s;
 },
 [K+'only']:(p)=>{
  let s=tiltScene({splitG:1,dimAlong:seg(p,.1,.3),paraG:seg(p,.4,.6)});
  s+=card(760,90,400,340,label('沿う部分：面積を作らない',960,150,{size:26,color:CV,anchor:'middle'})
   +fade(seg(p,.4,.55),label('高さ ＝ v⊥',960,220,{size:28,color:CQ,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),T(`L=m\\,r\\,${vperp}`,960,310,{size:48})),seg(p,0,.12));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=tiltScene({splitG:1,dimAlong:1,paraG:1});
  s+=card(740,70,420,380,T(`${vperp}=4\\times\\sin30^\\circ`,950,135,{size:36})+T(`=2\\,\\mathrm{m/s}`,960,195,{size:36,color:CQ})
   +fade(seg(p,.35,.5),T(`L=2\\times3\\times2`,950,285,{size:40}))+fade(seg(p,.5,.65),T(`=${cs(CL,'12'+LU)}`,950,370,{size:36})),seg(p,0,.1));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(80,70,500,360,label('𝐯 全体で mrv',330,130,{size:28,color:NG,anchor:'middle',weight:700})
   +T(`2\\times3\\times4=24`,330,215,{size:42})+crossX(330,300,28)+label('2倍 大きすぎる',330,380,{size:28,color:NG,anchor:'middle'}),seg(p,0,.12),NG);
  s+=card(620,70,500,360,label('v⊥ を使う',870,130,{size:28,color:C.F,anchor:'middle',weight:700})
   +T(`2\\times3\\times2=12`,870,215,{size:42,color:CL})+tick(870,300,24)+label('sinθ を 忘れない',870,380,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.F);
  return s;
 },
 [K+'contrast']:(p)=>{
  let s=card(60,50,520,420,label('内積：仕事',320,105,{size:28,color:C.E,anchor:'middle',weight:700}),seg(p,0,.1));
  // work: force oblique, displacement right, along-part highlighted
  s+=fade(seg(p,0,.1),arrow(140,330,470,330,{color:CR,w:5,head:14})+label('動き',300,370,{size:24,color:CR,anchor:'middle'})
   +arrow(160,330,160+170*Math.cos(TH),330-170*Math.sin(TH),{color:CF,w:5,opacity:.6})+vl('F',160+170*Math.cos(TH)+8,330-170*Math.sin(TH),{size:26,color:CF})
   +arrow(160,300,160+170*Math.cos(TH),300,{color:CQ,w:7,head:16})+label('沿う部分が 効く',320,200,{size:26,color:CQ,anchor:'middle',weight:700}));
  s+=card(620,50,520,420,label('外積：角運動量',880,105,{size:28,color:CL,anchor:'middle',weight:700}),seg(p,.35,.45));
  const ox=680,oy=380,bx=900;
  s+=fade(seg(p,.35,.45),baseDot(ox,oy,'')+arrow(ox,oy,bx-14,oy,{color:CR,w:5,head:14})+vl('r',790,oy+40,{size:26,color:CR})
   +arrow(bx,oy,bx+170*Math.cos(TH),oy-170*Math.sin(TH),{color:CV,w:5,opacity:.6})+vl('v',bx+170*Math.cos(TH)+8,oy-170*Math.sin(TH),{size:26,color:CV})
   +arrow(bx,oy,bx,oy-85,{color:CQ,w:7,head:16})+ball(bx,oy,12)+label('直角な部分が 効く',880,200,{size:26,color:CQ,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ellipse']:(p)=>{
  const cx=330,cy=290,A=240,B=150,c=Math.sqrt(A*A-B*B),fx=cx-c,fy=cy,t=.2+.6*seg(p,.05,.5);
  const bx=cx+A*Math.cos(t),by=cy-B*Math.sin(t);
  let vx=-A*Math.sin(t),vy=-B*Math.cos(t);const vl0=Math.hypot(vx,vy);vx/=vl0;vy/=vl0;const V=140;
  let rx=bx-fx,ry=by-fy;const rl=Math.hypot(rx,ry);rx/=rl;ry/=rl;
  const along=vx*rx+vy*ry,px_=vx-along*rx,py_=vy-along*ry;
  let s=label('真上から見た図',40,50,{size:24,color:C.dim});
  s+=draw(Array.from({length:81},(_,i)=>{const u=2*Math.PI*i/80;return [cx+A*Math.cos(u),cy-B*Math.sin(u)];}),1,{color:C.faint,w:2,dash:'6 7'});
  s+=dot(fx,fy,16,C.t)+label('太陽（基準点）',fx,fy+48,{size:22,color:C.t,anchor:'middle'});
  s+=arrow(fx,fy,bx-rx*16,by-ry*16,{color:CR,w:5,head:14})+vl('r',(fx+bx)/2-30,(fy+by)/2,{size:28,color:CR});
  s+=arrow(bx,by,bx+vx*V,by+vy*V,{color:CV,w:6,opacity:seg(p,.5,.6)>0?.55:1})+vl('v',bx+vx*V-10,by+vy*V-14,{size:28,color:CV});
  s+=fade(seg(p,.5,.65),arrow(bx,by,bx+px_*V,by+py_*V,{color:CQ,w:6,head:16})+T(vperp,bx+px_*V-16,by+py_*V+6,{size:32,anchor:'end'})+arrow(bx,by,bx+along*rx*V,by+along*ry*V,{color:CV,w:3,head:12,opacity:.6}));
  s+=ring(bx,by,13,{color:C.x,w:3,fill:'#1a3040'});
  s+=card(720,100,440,320,label('楕円の軌道',940,160,{size:28,color:C.ink,anchor:'middle'})
   +label('𝐯 は 𝐫 と直角とは 限らない',940,225,{size:26,color:CV,anchor:'middle'})
   +fade(seg(p,.55,.7),label('mrv ではなく',940,295,{size:26,color:NG,anchor:'middle'})+T(`L=m\\,r\\,${vperp}`,940,370,{size:44})),seg(p,0,.12));
  return s;
 },
 // ===== S5 まっすぐ進む玉 =====
 [K+'line']:(p)=>{
  const x=-5+4*seg(p,.2,.95);
  let s=lineScene(x,{rG:0,perpG:seg(p,.5,.7)});
  s+=card(800,100,360,300,label('力を受けない玉',980,160,{size:26,color:C.ink,anchor:'middle'})
   +label('2 kg・4 m/s で 右へ',980,220,{size:28,color:CV,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('O は 線から 3 m 下',980,290,{size:28,color:CQ,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'at0']:(p)=>{
  const x=-1+1*seg(p,0,.3);
  let s=lineScene(x,{rG:1,perpG:1,dLabel:0,labR:x>-0.05?'3 m':''});
  if(p>.3)s+=rightMark(LX(0),LY,0,1,1,0,14,C.hi);
  s+=card(800,100,360,300,label('O の真上',980,160,{size:28,color:C.ink,anchor:'middle'})
   +label('r ＝ 3 m、𝐫 ⊥ 𝐯',980,225,{size:28,color:CR,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),T(`L=2\\times3\\times4=${cs(CL,'24')}`,980,315,{size:36})),seg(p,0,.12));
  return s;
 },
 [K+'at4']:(p)=>{
  const x=4*seg(p,0,.35);
  let s=lineScene(x,{rG:1,perpG:1,thG:seg(p,.6,.75),labR:p>.35?'5 m':''});
  s+=card(800,90,360,340,label('4 m 先へ',980,150,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.45),label('r：3 m → 5 m',980,215,{size:30,color:CR,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('sinθ：1 → 3/5',980,285,{size:30,color:CT,anchor:'middle',weight:700})+label('＝ 0.6',980,345,{size:30,color:CT,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'at4b']:(p)=>{
  let s=lineScene(4,{rG:1,perpG:1,thG:1,labR:'5 m'});
  s+=card(790,80,370,360,T(`L=2\\times4\\times5\\times0.6`,975,150,{size:34})
   +fade(seg(p,.2,.35),T(`=${cs(CL,'24')}`,975,225,{size:44}))
   +fade(seg(p,.45,.6),label('r は 伸び',975,300,{size:28,color:CR,anchor:'middle'})+label('sinθ は 縮む',975,345,{size:28,color:CT,anchor:'middle'}))
   +fade(seg(p,.7,.85),label('打ち消し合う',975,405,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'arm']:(p)=>{
  let s=lineScene(-4,{rG:1,perpG:1,labR:'5 m'});
  s+=fade(.45*seg(p,.35,.5),arrow(LI.ox,LI.oy,LX(4)-10,LY+6,{color:CR,w:4,head:12})+ball(LX(4),LY,16)+label('5 m',LX(2)+16,(LI.oy+LY)/2+20,{size:24,color:CR,weight:700}));
  s+=card(790,80,370,360,label('4 m 手前でも',975,140,{size:26,color:C.ink,anchor:'middle'})+T(`L=${cs(CL,'24')}`,975,200,{size:40})
   +fade(seg(p,.35,.5),label('r sinθ ＝ 垂直な距離',975,280,{size:26,color:CQ,anchor:'middle',weight:700})+label('＝ 3 m',975,325,{size:30,color:CQ,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('どこでも 同じ',975,400,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=lineScene(2,{rG:1,perpG:1,arcG:seg(p,.45,.7),Lsym:seg(p,.7,.85)});
  s+=card(790,80,370,360,label('初級：作用線までの距離',975,140,{size:24,color:C.dim,anchor:'middle'})
   +label('と 同じ形',975,185,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),label('𝐫 → 𝐯：時計回り',975,265,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.7,.85),T(bL,905,345,{size:42})+label('奥向き',935,357,{size:28,color:CL,weight:700})+inSym(1075,345,18)),seg(p,0,.1));
  return s;
 },
 [K+'const']:(p)=>{
  const x=-5+9*seg(p,0,1);
  let s=lineScene(x,{rG:1,perpG:1,Lsym:1});
  s+=card(790,90,370,340,label('まっすぐ進む玉にも',975,150,{size:26,color:C.ink,anchor:'middle'})
   +label('回転の勢いが ある',975,205,{size:30,color:CL,anchor:'middle',weight:700})
   +T(`L=${cs(CL,'24')}`,930,275,{size:40})+label('一定',1010,287,{size:30,color:CL,weight:700})
   +fade(seg(p,.5,.65),label('力なし → トルクなし',975,370,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'base']:(p)=>{
  const x=1+2*seg(p,.1,.9),Q=[LX(-3),LY];
  let s=lineScene(x,{rG:seg(p,.1,.3),base:Q});
  s+=card(790,90,370,340,label('基準点 Q を 線の上に',975,150,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.45),label('𝐫 ∥ 𝐯 → L ＝ 0',975,225,{size:32,color:NG,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('角運動量も',975,305,{size:26,color:C.ink,anchor:'middle'})+label('基準点を 決めて 決まる',975,355,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  return card(80,50,1040,420,label('まとめ',600,100,{size:26,color:C.dim,anchor:'middle'})
   +label('回転の勢い ＝ 角運動量',140,180,{size:30,color:C.ink})+T(`${bL}=${br}\\times${bp}`,860,172,{size:46})
   +fade(seg(p,.35,.5),label('大きさ',140,280,{size:30,color:C.ink})+T(`L=m\\,r\\,${cs(CV,'v')}\\sin\\theta=m\\,r\\,${vperp}`,700,272,{size:40}))
   +fade(seg(p,.6,.75),label('効くのは 𝐫 に直角な速度 v⊥ だけ',600,385,{size:30,color:CQ,anchor:'middle',weight:700})),seg(p,0,.1));
 },
 [K+'sum2']:(p)=>{
  let s=card(60,60,520,380,label('円運動の中心から',320,120,{size:28,color:C.ink,anchor:'middle'})+label('𝐫 ⊥ 𝐯',320,185,{size:30,color:C.hi,anchor:'middle',weight:700})+T(`L=m\\,r\\,${cs(CV,'v')}`,320,280,{size:48}),seg(p,0,.12));
  s+=card(620,60,520,380,label('それ以外',880,120,{size:28,color:C.ink,anchor:'middle'})+label('sinθ を 忘れない',880,185,{size:30,color:C.hi,anchor:'middle',weight:700})+T(`L=m\\,r\\,${cs(CV,'v')}\\sin\\theta`,880,280,{size:44}),seg(p,.4,.55));
  return s;
 },
 [K+'next1']:(p)=>{
  const px=300,py=80,Lp=280,a=.45*Math.cos(2*Math.PI*p*1.1),bx=px+Lp*Math.sin(a),by=py+Lp*Math.cos(a);
  let s=line(px-90,py,px+90,py,{color:C.dim,w:4})+line(px,py,bx,by,{color:C.dim,w:3});
  s+=draw(circPts(px,py,Lp,-Math.PI/2-.5,-Math.PI/2+.5,30),1,{color:C.faint,w:2,dash:'5 6'});
  s+=fade(seg(p,.4,.55),arrow(bx,by,bx+(px-bx)*.4,by+(py-by)*.4,{color:CF,w:5,head:14})+label('糸の力',bx+(px-bx)*.4+14,by+(py-by)*.4,{size:24,color:CF,weight:700}));
  s+=fade(seg(p,.55,.7),arrow(bx,by,bx,by+110,{color:CF,w:5,head:14})+label('重力',bx+14,by+100,{size:24,color:CF,weight:700}));
  s+=ring(bx,by,20,{color:C.ink,w:3,fill:'#2c3854'});
  s+=card(700,110,450,280,label('次は',925,170,{size:24,color:C.dim,anchor:'middle'})+label('回る運動 → 揺れる運動',925,235,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('振り子のおもりには',925,300,{size:26,color:C.ink,anchor:'middle'})+label('糸の力 と 重力',925,345,{size:28,color:CF,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'next2']:(p)=>{
  const px=300,py=80,Lp=280,a=.45*Math.cos(2*Math.PI*p*1.1),bx=px+Lp*Math.sin(a),by=py+Lp*Math.cos(a);
  let s=line(px-90,py,px+90,py,{color:C.dim,w:4})+line(px,py,bx,by,{color:C.dim,w:3});
  s+=draw(circPts(px,py,Lp,-Math.PI/2-.5,-Math.PI/2+.5,30),1,{color:C.hi,w:3});
  s+=label('円弧に沿う向き',px,py+Lp+60,{size:24,color:C.hi,anchor:'middle'});
  s+=ring(bx,by,20,{color:C.ink,w:3,fill:'#2c3854'});
  s+=card(660,110,490,280,label('次の問い',905,170,{size:24,color:C.dim,anchor:'middle'})+label('円弧に沿って進む向きの式',905,235,{size:28,color:C.ink,anchor:'middle'})
   +label('振り子の運動方程式は',905,295,{size:30,color:C.hi,anchor:'middle',weight:700})+label('どう立てる？',905,345,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
