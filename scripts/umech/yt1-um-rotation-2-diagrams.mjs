// YouTube シリーズ「剛体の回転・中級 2/2」(ys-um-rotation-2) — 図。Stage 1200×515.
// 色：R・h 水色、並進の矢印 v 紫、回転の矢印 Rω 桃、合成の速度 黄、並進のエネルギー 橙、回転のエネルギー 桃、摩擦 緑、誤り 赤。
// 車輪は横から見た図。画面の角度 a（y 下向き）で点 (cx＋R cos a, cy＋R sin a)。右へ転がる車輪は a が増える向き＝画面で時計回り。
//   時計回りの回転による速度の向き（画面）＝(−sin a, cos a)：上 a＝−π/2 → 右、下 a＝π/2 → 左、前（右端）a＝0 → 下、後ろ（左端）a＝π → 上。
// 数値：R＝0.5 m、ω＝4 rad/s → v＝2 m/s：上 4、中心 2、下 0。h＝0.6 m、g＝10：v²＝12、8、6 → 3.46、2.83、2.45 m/s。2 kg：12 J＝8＋4（円板）＝6＋6（輪）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth,poly,ground} from './anim.mjs';

const K='um-rotation-2:';
const CR=C.x,CV=C.v,CW=C.p,CS=C.hi,CF=C.F,CE=C.E,CH=C.hi,CD=C.dim,CM=C.m,BAD=C.a;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const col=(c,s)=>`{\\color{${c}}{${s}}}`;
const VV=col(CV,'v'),RR=col(CR,'R'),WW=col(CW,'\\omega'),RW=`${RR}${WW}`,HH=col(CR,'h');
const KT=`\\tfrac12 M${VV}^2`,KR=`\\tfrac12 I${WW}^2`;
const U=s=>`\\,\\mathrm{${s}}`;
const TAU=Math.PI*2;
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:CF,weight:700,anchor:'middle'}));

// ---- wheel (side view) -------------------------------------------------------------------------------
function wheel(cx,cy,R,rot,{g=1,marker=1,spokes=6,rim=C.dim,fill='#141d33',w=6}={}){
 let s=ring(cx,cy,R,{color:rim,w,fill});
 for(let i=0;i<spokes;i++){const a=rot+i*TAU/spokes+Math.PI/2;s+=line(cx,cy,cx+R*.92*Math.cos(a),cy+R*.92*Math.sin(a),{color:C.faint,w:3});}
 if(marker){const a=rot+Math.PI/2;s+=dot(cx+R*Math.cos(a),cy+R*Math.sin(a),9,CH);}
 s+=dot(cx,cy,7,C.ink);
 return fade(g,s);
}
const pt=(cx,cy,R,a)=>[cx+R*Math.cos(a),cy+R*Math.sin(a)];
const cwDir=a=>[-Math.sin(a),Math.cos(a)];
const A={top:-Math.PI/2,bottom:Math.PI/2,front:0,back:Math.PI};
// velocity arrows at a point: translation (right, len vt) and rotation (cw tangent, len vr)
const vArr=(x,y,len,o={})=>len>2?arrow(x,y,x+len,y,{color:CV,w:6,head:16,...o}):'';
const rArr=(x,y,a,len,o={})=>{const [dx,dy]=cwDir(a);return len>2?arrow(x,y,x+dx*len,y+dy*len,{color:CW,w:6,head:16,...o}):'';};
function turnCW(cx,cy,r,a0,a1,{color=CW,w=4,g=1}={}){ // screen angles, a1>a0 = clockwise
 if(g<=0)return '';
 const pts=Array.from({length:31},(_,i)=>{const a=a0+(a1-a0)*i/30;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
 const [x1,y1]=pts[29],[x2,y2]=pts[30],an=Math.atan2(y2-y1,x2-x1),Lh=15;
 const head=`<polygon points="${x2+Math.cos(an)*6},${y2+Math.sin(an)*6} ${x2-Lh*Math.cos(an)+Lh*.55*Math.sin(an)},${y2-Lh*Math.sin(an)-Lh*.55*Math.cos(an)} ${x2-Lh*Math.cos(an)-Lh*.55*Math.sin(an)},${y2-Lh*Math.sin(an)+Lh*.55*Math.cos(an)}" fill="${color}"/>`;
 return fade(g,draw(pts,1,{color,w})+head);
}
// the main wheel of S2/S3
const MW={cx:330,cy:270,R:130,gy:400,v:110};
function mainWheel(rot=0,{g=1,gnd=1}={}){const {cx,cy,R,gy}=MW;return fade(g,(gnd?ground(60,640,gy):'')+wheel(cx,cy,R,rot,{marker:0}));}

// slope for the energy scenes
const SLP={x1:80,y1:130,x2:620,y2:450};
function slope(){const {x1,y1,x2,y2}=SLP;return poly([[x1,y1],[x2,y2],[x1,y2]],{fill:'#26324d',fo:.8,stroke:CD,sw:2})+line(x2,y2,x2+80,y2,{color:CD,w:3});}
const slopeDir=()=>{const {x1,y1,x2,y2}=SLP,L0=Math.hypot(x2-x1,y2-y1);return {ux:(x2-x1)/L0,uy:(y2-y1)/L0,L0};};
// object on the slope at fraction u of the way down; kind: 'box' | 'disk' | 'ring'
function onSlope(u,kind,{r=26,off=0}={}){
 const {x1,y1}=SLP,{ux,uy,L0}=slopeDir(),sd=30+(L0-80)*u,nx=uy,ny=-ux,px=x1+ux*sd+nx*r,py=y1+uy*sd+ny*r;
 if(kind==='box'){const a=Math.atan2(uy,ux)*180/Math.PI,bx=x1+ux*sd,by=y1+uy*sd;return `<g transform="translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${a.toFixed(1)})">${rect(-24,-46,48,46,{fill:CR,fo:.35,stroke:CR,rx:4})}</g>`;}
 const rot=sd/r;let s=kind==='ring'?ring(px,py,r,{color:CH,w:8,fill:'#141d33'}):ring(px,py,r,{color:CD,w:3,fill:'#8fa6cf'});
 s+=line(px,py,px+r*.85*Math.cos(rot),py+r*.85*Math.sin(rot),{color:kind==='ring'?CH:C.bg,w:3})+dot(px,py,4,kind==='ring'?CH:C.bg);
 return s;
}
const diskIcon=(x,y,r,g=1)=>fade(g,ring(x,y,r,{color:CD,w:3,fill:'#8fa6cf'})+dot(x,y,5,C.bg));
const ringIcon=(x,y,r,g=1)=>fade(g,ring(x,y,r,{color:CH,w:10,fill:'#141d33'})+dot(x,y,5,CH));

export const ytUmRotation2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const cx=250,cy=270,ph=.3+1.5*seg(p,.1,1)**2;
  let s=ring(cx,cy,140,{color:CD,w:5,fill:'#141d33'})+line(cx,cy,cx+140*Math.cos(-ph),cy+140*Math.sin(-ph),{color:C.ink,w:4})+ring(cx,cy,12,{color:C.ink,w:3,fill:C.bg})+dot(cx,cy,4,C.ink);
  s+=turnCW(cx,cy,175,.6,-.9,{color:CW,g:seg(p,.1,.25)})+fade(seg(p,.1,.25),label('N',cx+175,cy-120,{size:30,color:CW,weight:700}));
  s+=card(560,80,580,300,L('前回（剛体の回転・中級 1/2）',850,130,{size:24,color:CD})
   +T(`I\\,${col(C.a,'\\alpha')}=${col(CW,'N')}`,850,215,{size:60})
   +fade(seg(p,.45,.6),L('各点の ma＝F × r を 足す',850,300,{size:28,color:CH,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'lastq']:(p)=>{
  const gy=440,R=70,cx=150+300*seg(p,.1,1),rot=(cx-150)/R;
  let s=ground(40,1160,gy)+wheel(cx,gy-R,R,rot,{marker:0});
  s+=card(560,60,580,260,L('前回の 最後の 問い',850,115,{size:26,color:CD})
   +L('固定軸で ない、 転がる 車輪では',850,185,{size:30,weight:700})
   +fade(seg(p,.4,.55),L('地面に 触れている 点は どう 動く？',850,255,{size:30,color:CH,weight:700})),seg(p,0,.12),CH);
  s+=fade(seg(p,.45,.6),ring(cx,gy,18,{color:CH,w:4,dash:'5 4'}));
  return s;
 },
 [K+'hook']:(p)=>{
  const gy=430,R=120,x0=200,cx=x0+560*seg(p,.05,1),rot=(cx-x0)/R;
  let s=ground(40,1160,gy);
  s+=ring(cx,gy-R,R,{color:'#2b2f3a',w:22,fill:'none'})+wheel(cx,gy-R,R-12,rot,{marker:1,rim:'#6b7690',w:4});
  s+=fade(seg(p,.1,.25),arrow(cx,gy-R,cx+110,gy-R,{color:CV,w:6,head:16})+label('v',cx+124,gy-R+10,{size:30,color:CV,weight:700}));
  s+=fade(seg(p,.55,.7),ring(cx,gy,22,{color:CH,w:4,dash:'5 4'})+card(760,60,400,120,L('タイヤは 地面を',960,110,{size:28})+L('こすらない',960,155,{size:30,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'pred']:(p)=>{
  const {cx,cy,R,gy}=MW;
  let s=mainWheel(0)+arrow(cx,cy,cx+MW.v,cy,{color:CV,w:6,head:16})+label('v',cx+MW.v+14,cy+10,{size:30,color:CV,weight:700});
  s+=fade(seg(p,.15,.3),ring(cx,gy,22,{color:CH,w:4,dash:'5 4'})+label('？',cx+36,gy-14,{size:44,color:CH,weight:700}));
  const opts=['前向き v','前向き 2v','0','後ろ向き v'];
  opts.forEach((t,i)=>{const x=720+(i%2)*230,y=110+Math.floor(i/2)*150;s+=card(x,y,210,110,L(t,x+105,y+68,{size:32,weight:700}),seg(p,.3+.1*i,.4+.1*i),CH);});
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(170,60,860,330,L('今回の 問い',600,115,{size:26,color:CD})
   +L('① 転がる 車輪の 各点は どう 動く？',600,200,{size:34,weight:700})
   +fade(seg(p,.4,.55),L('② エネルギーは どう 分かれる？',600,290,{size:34,color:CH,weight:700})),seg(p,0,.12),CH);
  return s;
 },

 // ===== S2 並進と回転に分ける =====
 [K+'paint']:(p)=>{
  const gy=400,R=90,x0=140,u=seg(p,.05,.9),cx=x0+TAU*R*.9*u,rot=(cx-x0)/R;
  let s=ground(40,1160,gy);
  if(cx-x0>1)s+=line(x0,gy-2,cx,gy-2,{color:CR,w:7,cap:'butt'});
  s+=wheel(cx,gy-R,R,rot,{marker:1});
  s+=card(760,60,400,160,T(`${VV}=${RR}${WW}`,960,130,{size:52})+L('初級（ペンキの 跡）',960,190,{size:24,color:CD}),seg(p,.3,.45),CH);
  s+=fade(seg(p,.55,.7),line(cx,gy-R,cx,gy-2*R,{color:CR,w:4})+label('R',cx+12,gy-1.5*R+8,{size:28,color:CR,weight:700}));
  return s;
 },
 [K+'trans']:(p)=>{
  const {cx,cy,R,gy,v}=MW,dx=120*seg(p,.2,1);
  let s=ground(60,1160,gy)+fade(.3,wheel(cx,cy,R,0,{marker:0}));
  s+=wheel(cx+dx,cy,R,0,{marker:0});
  const pts=[['top'],['bottom'],['front'],['back'],['c']];
  for(const [k] of pts){const [x,y]=k==='c'?[cx+dx,cy]:pt(cx+dx,cy,R,A[k]);s+=dot(x,y,9,CH)+fade(seg(p,.1,.25),vArr(x,y,v));}
  s+=card(820,90,340,200,L('① 並進',990,150,{size:32,color:CV,weight:700})+L('全部の 点が',990,205,{size:26})+L('同じ v で 右へ',990,250,{size:28,color:CV,weight:700}),seg(p,.4,.55),CV);
  return s;
 },
 [K+'rot']:(p)=>{
  const {cx,cy,R,gy}=MW,rot=1.4*seg(p,.05,1);
  let s=ground(60,640,gy)+wheel(cx,cy,R,rot,{marker:0});
  for(const k of ['top','bottom','front','back']){const [x,y]=pt(cx,cy,R,A[k]);s+=dot(x,y,9,CH)+fade(seg(p,.35,.5),rArr(x,y,A[k],MW.v));}
  s+=fade(seg(p,.2,.35),turnCW(cx,cy,48,-2.2,-.7,{color:CW}));
  s+=card(820,90,340,220,L('② 中心の まわりの 回転',990,150,{size:28,color:CW,weight:700})+L('半径に 直角',990,210,{size:26})+label('速さ',950,272,{size:28,color:C.ink,anchor:'end'})+T(RW,1000,262,{size:40}),seg(p,.5,.65),CW);
  return s;
 },
 [K+'dir']:(p)=>{
  const {cx,cy,R,gy}=MW;
  let s=ground(60,640,gy)+wheel(cx,cy,R,0,{marker:0})+turnCW(cx,cy,48,-2.2,-.7,{color:CW});
  for(const k of ['top','bottom','front','back']){const [x,y]=pt(cx,cy,R,A[k]);s+=dot(x,y,9,CH)+rArr(x,y,A[k],MW.v,{opacity:k==='top'||k==='bottom'?1:.35});}
  s+=fade(seg(p,.35,.5),label('上：前向き',cx+R+20,cy-R-10,{size:28,color:CW,weight:700}));
  s+=fade(seg(p,.55,.7),label('下：後ろ向き',cx-R-150,gy+40,{size:28,color:CW,weight:700,anchor:'start'}));
  s+=card(820,90,340,140,L('右へ 転がる',990,150,{size:28})+L('→ 時計回り',990,200,{size:30,color:CW,weight:700}),seg(p,0,.12),CW);
  return s;
 },
 [K+'add']:(p)=>{
  const {cx,cy,R,gy,v}=MW;
  let s=ground(60,640,gy)+wheel(cx,cy,R,0,{marker:0});
  const [x,y]=pt(cx,cy,R,A.top);
  s+=dot(x,y,9,CH)+vArr(x,y-16,v)+fade(seg(p,.1,.25),rArr(x+v,y-16,A.top,v));
  s+=card(700,80,460,260,L('実際の 速度',930,140,{size:28,weight:700})
   +L('＝ 並進の 矢印',930,200,{size:28,color:CV,weight:700})+L('＋ 回転の 矢印',930,250,{size:28,color:CW,weight:700})
   +fade(seg(p,.45,.6),L('向きを 含めて 足す',930,310,{size:26,color:CH})),seg(p,0,.12),CH);
  return s;
 },

 // ===== S3 3つの点で足す =====
 [K+'center']:(p)=>{
  const {cx,cy,R,gy,v}=MW;
  let s=mainWheel(0);
  s+=dot(cx,cy,10,CH)+vArr(cx,cy,v)+fade(seg(p,.3,.45),rect(cx-110,cy+34,220,40,{fill:C.bg,fo:.85,stroke:CW,sw:1.5,rx:8})+label('回転の 矢印は 0',cx,cy+62,{size:24,color:CW,anchor:'middle'}));
  s+=card(760,70,400,340,L('足し算の 結果',960,120,{size:26,color:CD})+fade(seg(p,.45,.6),L('中心：v',960,300,{size:32,color:CS,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'top']:(p)=>{
  const {cx,cy,R,gy,v}=MW;
  let s=mainWheel(0)+dot(cx,cy,10,CH)+vArr(cx,cy,v,{opacity:.5});
  const [x,y]=pt(cx,cy,R,A.top);
  s+=dot(x,y,10,CH)+vArr(x,y-20,v)+fade(seg(p,.15,.3),rArr(x+v,y-20,A.top,v));
  s+=fade(seg(p,.55,.7),arrow(x,y+22,x+2*v,y+22,{color:CS,w:7,head:18})+label('2v',x+2*v+14,y+32,{size:32,color:CS,weight:700}));
  s+=card(760,70,400,340,L('足し算の 結果',960,120,{size:26,color:CD})
   +fade(seg(p,.35,.5),T(`${RW}=${VV}`,960,190,{size:36}))
   +fade(seg(p,.55,.7),L('一番上：2v',960,250,{size:32,color:CS,weight:700}))
   +L('中心：v',960,300,{size:32,color:CS,weight:700}),1);
  return s;
 },
 [K+'bottom']:(p)=>{
  const {cx,cy,R,gy,v}=MW;
  let s=mainWheel(0)+dot(cx,cy,10,CH)+vArr(cx,cy,v,{opacity:.5});
  const [xt,yt]=pt(cx,cy,R,A.top);s+=arrow(xt,yt+22,xt+2*v,yt+22,{color:CS,w:7,head:18,opacity:.5});
  const [x,y]=pt(cx,cy,R,A.bottom);
  s+=dot(x,y,10,CH)+vArr(x,y-22,v)+fade(seg(p,.15,.3),rArr(x+v,y-38,A.bottom,v));
  s+=fade(seg(p,.5,.65),ring(x,y,20,{color:CS,w:4})+label('0',x-34,y+6,{size:34,color:CS,weight:700,anchor:'end'}));
  s+=card(760,70,400,340,L('足し算の 結果',960,120,{size:26,color:CD})
   +L('一番上：2v',960,250,{size:32,color:CS,weight:700})+L('中心：v',960,300,{size:32,color:CS,weight:700})
   +fade(seg(p,.35,.5),T(`${VV}-${RW}=0`,960,190,{size:36}))
   +fade(seg(p,.5,.65),L('接地点：0',960,350,{size:32,color:CS,weight:700})),1);
  return s;
 },
 [K+'num']:(p)=>{
  const {cx,cy,R,gy}=MW,k=45; // px per m/s
  let s=mainWheel(0);
  // speed profile along the vertical diameter: 4 at the top, 2 at the centre, 0 at the bottom (linear)
  const rows=[[-1,'4 m/s'],[-.5,''],[0,'2 m/s'],[.5,''],[1,'0']];
  rows.forEach(([f,t],i)=>{const y=cy+f*R,sp=2*(1-f),gg=seg(p,.2+.08*i,.3+.08*i);
   s+=fade(gg,dot(cx,y,7,CH)+(sp>0.05?arrow(cx,y,cx+sp*k,y,{color:CS,w:5,head:14}):'')+(t?label(t,cx+sp*k+14,y+9,{size:26,color:CS,weight:700}):''));});
  s+=fade(seg(p,.7,.85),line(cx,cy+R,cx+4*k,cy-R,{color:CS,w:2,dash:'6 6'}));
  s+=card(760,70,400,250,T(`${RR}=0.5${U('m')},\\ \\ ${WW}=4${U('rad/s')}`,960,130,{size:32})
   +fade(seg(p,.1,.25),T(`${VV}=0.5\\times4=2${U('m/s')}`,960,210,{size:34}))
   +fade(seg(p,.7,.85),L('上ほど 速く、 下ほど 遅い',960,285,{size:26,color:CH,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'slip']:(p)=>{
  const {cx,cy,R,gy}=MW,v=50,vr=120;
  let s=rect(60,gy,580,16,{fill:'#8fd8ff',fo:.25,stroke:'#8fd8ff',sw:1.5,rx:3})+wheel(cx,cy,R,1.5*p,{marker:0});
  s+=label('氷',90,gy+48,{size:26,color:'#8fd8ff'});
  const [x,y]=pt(cx,cy,R,A.bottom);
  s+=dot(x,y,10,CH)+vArr(x,y-22,v)+fade(seg(p,.2,.35),rArr(x+v,y-38,A.bottom,vr));
  s+=fade(seg(p,.45,.6),arrow(x,y+26,x+v-vr,y+26,{color:BAD,w:7,head:16})+label('後ろへ こすれる',x-80,y+70,{size:26,color:BAD,weight:700,anchor:'middle'}));
  s+=card(720,70,440,280,L('滑らない 条件',940,125,{size:28,weight:700})
   +T(`${VV}-${RW}=0`,940,195,{size:40})
   +fade(seg(p,.4,.55),L('空回り：Rω ＞ v',940,265,{size:28,color:BAD,weight:700}))
   +fade(seg(p,.55,.7),T(`${VV}-${RW}<0`,940,320,{size:32,color:BAD})),seg(p,0,.12));
  return s;
 },
 [K+'instant']:(p)=>{
  const gy=420,R=80,x0=120,th=TAU*1.3*seg(p,.02,.98),cx=x0+R*th,cy=gy-R;
  let s=ground(40,1160,gy);
  // cycloid traced by a rim point that starts at the bottom
  const path=Array.from({length:81},(_,i)=>{const t=th*i/80;return [x0+R*(t-Math.sin(t)),gy-R*(1-Math.cos(t))];});
  s+=draw(path,1,{color:CH,w:3,dash:'6 6'});
  s+=wheel(cx,cy,R,th,{marker:1});
  s+=ring(x0,gy,16,{color:CS,w:3})+ring(x0+TAU*R,gy,16,{color:CS,w:3,dash:'4 4'});
  s+=fade(seg(p,.3,.45),label('止まるのは 触れた 瞬間だけ',x0+TAU*R/2,110,{size:28,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),card(820,40,340,110,L('止まる 点は',990,85,{size:26})+L('入れ替わる',990,130,{size:30,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'friction']:(p)=>{
  const {cx,cy,R,gy}=MW;
  let s=mainWheel(0)+arrow(cx,cy,cx+MW.v,cy,{color:CV,w:6,head:16});
  s+=dot(cx,gy,10,CH)+fade(seg(p,.1,.25),arrow(cx,gy+14,cx-100,gy+14,{color:CF,w:6,head:16})+label('摩擦',cx-120,gy+50,{size:26,color:CF,weight:700,anchor:'middle'}));
  s+=card(720,70,440,300,L('接地点は 動かない',940,130,{size:28,weight:700})
   +fade(seg(p,.35,.5),L('こすれない',940,200,{size:30,color:CH,weight:700}))
   +fade(seg(p,.55,.7),L('摩擦で エネルギーは',940,270,{size:28})+L('失われない',940,320,{size:30,color:CE,weight:700})),seg(p,0,.12));
  return s;
 },

 // ===== S4 エネルギーの取り分 =====
 [K+'promise']:(p)=>{
  const u=seg(p,.05,.8);
  let s=slope()+onSlope(u,'box')+fade(.9,onSlope(u*.82,'disk',{r:26}));
  s+=fade(seg(p,.1,.25),rect(300,60,30,30,{fill:CR,fo:.35,stroke:CR,rx:4})+label('滑る 箱',342,84,{size:24,color:CR})+diskIcon(485,75,16)+label('転がる 缶',510,84,{size:24,color:C.ink}));
  s+=card(720,70,440,300,L('初級で 見たこと',940,125,{size:26,color:CD})+L('転がる 方が 遅い',940,190,{size:30,weight:700})
   +fade(seg(p,.45,.6),L('取り分の 式 → 中級',940,270,{size:30,color:CH,weight:700})),seg(p,0,.12),CH);
  return s;
 },
 [K+'twoK']:(p)=>{
  let s=T(`K=`,240,130,{size:56});
  s+=fade(seg(p,.1,.25),T(col(CE,KT),420,130,{size:56})+L('重心が 進む 分',420,210,{size:28,color:CE,weight:700}));
  s+=fade(seg(p,.4,.55),T(`+`,560,130,{size:56})+T(col(CW,KR),700,130,{size:56})+L('重心の まわりに 回る 分',700,210,{size:28,color:CW,weight:700}));
  // icons: wheel translating / rotating
  const u=seg(p,.1,1);
  s+=fade(seg(p,.1,.25),wheel(360+80*u,390,60,0,{marker:0})+arrow(360+80*u,390,440+80*u,390,{color:CV,w:5,head:14}));
  s+=fade(seg(p,.4,.55),wheel(700,390,60,2.5*u,{marker:1})+turnCW(700,390,80,-2.2,-.8,{color:CW}));
  s+=fade(seg(p,.4,.55),label('＋',560,400,{size:44,color:CD,anchor:'middle'}));
  return s;
 },
 [K+'twoK2']:(p)=>{
  let s=T(`K=${col(CE,KT)}+${col(CW,KR)}`,600,120,{size:56});
  s+=card(300,230,600,160,L('この 分け方の 理由 → 上級',600,295,{size:28,color:CD})+L('ここでは 結果として 使う',600,350,{size:30,color:CH,weight:700}),seg(p,.1,.25),CH);
  return s;
 },
 [K+'cons']:(p)=>{
  const u=seg(p,.1,.9);
  let s=slope()+onSlope(u,'disk',{r:30});
  s+=line(SLP.x1-30,SLP.y1,SLP.x1-30,SLP.y2,{color:CR,w:3})+line(SLP.x1-40,SLP.y1,SLP.x1-20,SLP.y1,{color:CR,w:3})+line(SLP.x1-40,SLP.y2,SLP.x1-20,SLP.y2,{color:CR,w:3})+label('h',SLP.x1-50,(SLP.y1+SLP.y2)/2,{size:30,color:CR,anchor:'end',weight:700});
  s+=card(700,60,460,340,L('減った 位置エネルギー',930,115,{size:26,color:CD})+T(`M g ${HH}`,930,180,{size:48,color:CE})
   +fade(seg(p,.3,.45),T(`\\downarrow`,930,235,{size:36,color:CD}))
   +fade(seg(p,.35,.5),T(`${col(CE,KT)}+${col(CW,KR)}`,930,300,{size:44}))
   +fade(seg(p,.35,.5),L('並進',840,370,{size:24,color:CE})+L('回転',1030,370,{size:24,color:CW})),seg(p,0,.12));
  return s;
 },
 [K+'subst']:(p)=>{
  let s=T(`M g ${HH}=${col(CE,KT)}+${col(CW,KR)}`,600,90,{size:48});
  s+=fade(seg(p,.05,.2),card(120,170,360,110,T(`${WW}=\\dfrac{${VV}}{${RR}}`,300,228,{size:44}),1,CH)+L('滑らない',300,310,{size:26,color:CH,weight:700}));
  s+=fade(seg(p,.4,.55),arrow(500,225,600,225,{color:CH,w:4,head:14}));
  s+=fade(seg(p,.5,.65),T(`\\tfrac12 I${WW}^2=\\tfrac12 I\\,\\dfrac{${VV}^2}{${RR}^2}`,860,228,{size:46,color:CW}));
  return s;
 },
 [K+'factor']:(p)=>{
  let s=T(`M g ${HH}=${col(CE,KT)}+${col(CW,`\\tfrac12 I\\,\\dfrac{${VV}^2}{${RR}^2}`)}`,600,90,{size:46});
  s+=fade(seg(p,.15,.3),L('½Mv² で くくる',600,180,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.35,.5),T(`M g ${HH}=${col(CE,KT)}\\left(1+${col(CW,`\\dfrac{I}{M${RR}^2}`)}\\right)`,600,300,{size:54}));
  s+=fade(seg(p,.6,.75),L('並進の 分',470,410,{size:24,color:CE})+L('回転の 取り分の 目安',800,410,{size:24,color:CW}));
  return s;
 },
 [K+'solve']:(p)=>{
  let s=T(`M g ${HH}=${col(CE,KT)}\\left(1+${col(CW,`\\dfrac{I}{M${RR}^2}`)}\\right)`,600,90,{size:44,color:CD});
  s+=fade(seg(p,.1,.25),L('½M で 割る → 括弧で 割る',600,180,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.35,.5),card(330,220,540,250,T(`${VV}^2=\\dfrac{2g${HH}}{1+${col(CW,`\\dfrac{I}{M${RR}^2}`)}}`,600,345,{size:46}),1,CH));
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=T(`${VV}^2=\\dfrac{2g${HH}}{1+${col(CW,`\\dfrac{I}{M${RR}^2}`)}}`,300,200,{size:54});
  s+=fade(seg(p,.05,.2),highlight(330,150,190,120,1,CW));
  s+=card(640,60,520,380,L('I/(MR²) ＝ 質量が 外に ある 目安',900,115,{size:26,color:CW,weight:700})
   +diskIcon(780,230,70)+ringIcon(1020,230,70)
   +L('内側にも',780,340,{size:24})+L('全部 外側',1020,340,{size:24})
   +fade(seg(p,.5,.65),L('大きいほど 回る 分に 取られ 遅い',900,405,{size:26,color:CH,weight:700})),seg(p,.1,.25));
  return s;
 },

 // ===== S5 円板と輪の競走 =====
 [K+'ring']:(p)=>{
  let s=ringIcon(260,260,150);
  s+=fade(seg(p,.1,.25),line(260,260,260+150*Math.cos(-.6),260+150*Math.sin(-.6),{color:CR,w:4})+label('R',340,215,{size:30,color:CR,weight:700}));
  s+=fade(seg(p,.2,.35),label('全部の 質量が 距離 R',260,470,{size:28,color:CH,anchor:'middle',weight:700}));
  s+=card(620,80,540,300,L('輪',890,135,{size:30,weight:700})
   +fade(seg(p,.35,.5),T(`I=M${RR}^2`,890,195,{size:48}))
   +fade(seg(p,.6,.75),T(`\\dfrac{I}{M${RR}^2}=1`,890,320,{size:44,color:CW})),seg(p,0,.12));
  return s;
 },
 [K+'disk']:(p)=>{
  let s=fade(.45,ringIcon(170,250,90))+diskIcon(420,250,120);
  s+=card(620,60,540,380,L('中身の 詰まった 円板',890,115,{size:30,weight:700})
   +fade(seg(p,.1,.25),T(`I=\\tfrac12 M${RR}^2`,890,185,{size:48}))
   +fade(seg(p,.3,.45),T(`\\dfrac{I}{M${RR}^2}=\\tfrac12`,890,310,{size:44,color:CW}))
   +fade(seg(p,.55,.7),L('（この 値は 上級で 積分して 求める）',890,395,{size:24,color:CD})),seg(p,0,.12));
  s+=label('輪 1',170,380,{size:26,color:CH,anchor:'middle'})+label('円板 ½',420,410,{size:26,color:C.ink,anchor:'middle'});
  return s;
 },
 [K+'quiz']:(p)=>{
  const sl=(ox)=>poly([[ox,150],[ox+280,420],[ox,420]],{fill:'#26324d',fo:.8,stroke:CD,sw:2})+line(ox+280,420,ox+330,420,{color:CD,w:3});
  const th=Math.atan2(270,280),nx=Math.sin(th),ny=-Math.cos(th),r=30,sx=ox=>ox+40*Math.cos(th)+nx*r,sy=150+40*Math.sin(th)+ny*r;
  let s=sl(40)+sl(360);
  s+=diskIcon(sx(40),sy,r)+ringIcon(sx(360),sy,r);
  s+=fade(seg(p,.05,.2),label('円板',150,470,{size:28,color:C.ink,anchor:'middle',weight:700})+label('輪',470,470,{size:28,color:CH,anchor:'middle',weight:700}));
  s+=card(720,80,440,260,L('同じ 質量・同じ 半径',940,140,{size:28})+L('同じ 坂から 同時に',940,195,{size:28})+fade(seg(p,.3,.45),L('先に 着くのは？',940,275,{size:36,color:CH,weight:700})),seg(p,.1,.25),CH);
  return s;
 },
 [K+'box']:(p)=>{
  const u=seg(p,.4,.95);
  let s=slope()+onSlope(u,'box');
  s+=line(SLP.x1-30,SLP.y1,SLP.x1-30,SLP.y2,{color:CR,w:3})+label('0.6 m',SLP.x1-10,SLP.y1-16,{size:26,color:CR,anchor:'middle',weight:700});
  s+=card(700,60,460,340,T(`2g${HH}=2\\times10\\times0.6=12`,930,125,{size:34})
   +fade(seg(p,.4,.55),L('滑るだけ（回らない）',930,190,{size:26,color:CR})+T(`\\dfrac{I}{M${RR}^2}\\to 0`,930,260,{size:32,color:CW}))
   +fade(seg(p,.6,.75),T(`${VV}^2=12,\\ \\ ${VV}\\approx3.46${U('m/s')}`,930,350,{size:36})),seg(p,0,.12));
  return s;
 },
 [K+'race']:(p)=>{
  const rows=[['箱',12,3.46,'box'],['円板',8,2.83,'disk'],['輪',6,2.45,'ring']];
  let s='';
  rows.forEach(([t,v2,v,k],i)=>{const y=110+i*130,gg=i===0?1:seg(p,.1+.3*(i-1),.25+.3*(i-1));
   const icon=k==='box'?rect(70,y-30,60,60,{fill:CR,fo:.35,stroke:CR,rx:4}):k==='disk'?diskIcon(100,y,32):ringIcon(100,y,32);
   s+=fade(gg,icon+label(t,170,y+10,{size:28,color:C.ink})
    +T(i===0?`${VV}^2=12`:`${VV}^2=\\dfrac{12}{${i===1?'1.5':'2'}}=${v2}`,380,y,{size:34})
    +rect(560,y-22,v*140,44,{fill:CV,fo:.45,stroke:CV,rx:6})+label(`${v.toFixed(2)} m/s`,570+v*140,y+10,{size:26,color:CV,weight:700}));});
  s+=fade(seg(p,.75,.9),card(880,420,300,80,L('円板が 先',1030,470,{size:30,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'bars']:(p)=>{
  const k=48,x0=380;
  const rows=[['箱',12,0],['円板',8,4],['輪',6,6]];
  let s=label('2 kg、 12 J',600,60,{size:30,color:CE,anchor:'middle',weight:700});
  rows.forEach(([t,a,b],i)=>{const y=130+i*120,gg=seg(p,.1+.2*i,.25+.2*i);
   s+=fade(gg,label(t,x0-30,y+32,{size:28,color:C.ink,anchor:'end'})
    +rect(x0,y,a*k,48,{fill:CE,fo:.55,stroke:CE,rx:6})+label(`並進 ${a} J`,x0+a*k/2,y+33,{size:24,color:C.ink,anchor:'middle',weight:700})
    +(b?rect(x0+a*k,y,b*k,48,{fill:CW,fo:.55,stroke:CW,rx:6})+label(`回転 ${b} J`,x0+a*k+b*k/2,y+33,{size:24,color:C.ink,anchor:'middle',weight:700}):''));});
  s+=line(x0+12*k,110,x0+12*k,440,{color:CD,w:2,dash:'6 6'});
  s+=fade(seg(p,.75,.9),label('半分が 回転',x0+6*k,470,{size:28,color:CW,anchor:'middle',weight:700}));
  return s;
 },
 [K+'shape']:(p)=>{
  let s=T(`${VV}^2=\\dfrac{2g${HH}}{1+${col(CW,`\\dfrac{I}{M${RR}^2}`)}}`,300,200,{size:54});
  s+=fade(seg(p,.05,.2),L('M も R も 残らない',300,340,{size:28,color:CH,weight:700}));
  s+=card(640,60,520,380,L('同じ 形なら 同じ 速さ',900,115,{size:28,weight:700})
   +diskIcon(760,250,40)+diskIcon(900,250,80)+label('小さい 円板',760,380,{size:22,color:CD,anchor:'middle'})+label('大きい 円板',900,380,{size:22,color:CD,anchor:'middle'})
   +fade(seg(p,.5,.65),L('順番を 決めるのは 形',900,425,{size:28,color:CH,weight:700})),seg(p,.15,.3));
  s+=fade(seg(p,.3,.45),label('＝',830,262,{size:40,color:CH,anchor:'middle'}));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  const cx=260,cy=250,R=110,v=80;
  let s=wheel(cx,cy,R,0,{marker:0})+ground(80,440,cy+R);
  s+=arrow(cx,cy-R,cx+2*v,cy-R,{color:CS,w:6,head:16})+label('2v',cx+2*v+10,cy-R+10,{size:28,color:CS,weight:700});
  s+=arrow(cx,cy,cx+v,cy,{color:CS,w:6,head:16})+label('v',cx+v+10,cy+10,{size:28,color:CS,weight:700});
  s+=ring(cx,cy+R,16,{color:CS,w:4})+label('0',cx-26,cy+R+6,{size:28,color:CS,weight:700,anchor:'end'});
  s+=card(560,60,600,380,L('転がり ＝ 並進 ＋ 回転',860,120,{size:30,weight:700})
   +T(`${VV}-${RW}=0`,860,210,{size:44})+L('滑らない 条件',860,270,{size:24,color:CD})
   +fade(seg(p,.4,.55),L('接地点 0、 一番上 2v',860,350,{size:30,color:CS,weight:700})),seg(p,0,.12),CH);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(40,60,540,380,L('転がり ＝ 並進 ＋ 回転',310,120,{size:28,weight:700})+T(`${VV}-${RW}=0`,310,210,{size:40})+L('接地点 0、 一番上 2v',310,300,{size:28,color:CS,weight:700}),1,CH);
  s+=card(620,60,540,380,L('エネルギーの 取り分',890,120,{size:28,weight:700})
   +T(`K=${col(CE,KT)}+${col(CW,KR)}`,890,180,{size:36})
   +fade(seg(p,.3,.45),T(`${VV}^2=\\dfrac{2g${HH}}{1+${col(CW,`\\dfrac{I}{M${RR}^2}`)}}`,890,320,{size:34}))
   +fade(seg(p,.6,.75),L('I/(MR²) が 大きいほど 遅い',890,420,{size:24,color:CH,weight:700})),seg(p,0,.12),CE);
  return s;
 },
 [K+'next']:(p)=>{
  const gy=430,R=60,cx=500+300*seg(p,.05,1),rot=(cx-500)/R;
  let s=ground(40,1160,gy)+wheel(cx,gy-R,R,rot,{marker:0});
  // observer standing on the ground
  const ox=220;
  s+=dot(ox,gy-150,20,'#e0b48f')+line(ox,gy-130,ox,gy-60,{color:C.ink,w:6})+line(ox,gy-60,ox-20,gy,{color:C.ink,w:6})+line(ox,gy-60,ox+20,gy,{color:C.ink,w:6})+line(ox,gy-110,ox+40,gy-90,{color:C.ink,w:6});
  s+=fade(seg(p,.2,.35),label('地面に 立った 観測者',ox,gy-190,{size:26,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  // accelerating train car with an observer inside, and a rotating platform
  const gy=420,u=seg(p,0,1),tx=60+140*u*u;
  let s=ground(20,640,gy);
  s+=rect(tx,gy-200,380,170,{fill:'#1f2c4a',fo:.95,stroke:CD,rx:14})+ring(tx+70,gy-18,18,{color:CD,w:4,fill:C.bg})+ring(tx+310,gy-18,18,{color:CD,w:4,fill:C.bg});
  const ox=tx+190;
  s+=dot(ox,gy-165,16,'#e0b48f')+line(ox,gy-149,ox,gy-90,{color:C.ink,w:5})+line(ox,gy-90,ox-16,gy-40,{color:C.ink,w:5})+line(ox,gy-90,ox+16,gy-40,{color:C.ink,w:5});
  s+=arrow(tx+390,gy-120,tx+470,gy-120,{color:C.a,w:6,head:16})+label('加速',tx+430,gy-140,{size:24,color:C.a,anchor:'middle',weight:700});
  const px=920,py=380,ph=2.5*p;
  s+=`<ellipse cx="${px}" cy="${py}" rx="200" ry="55" fill="#1f2c4a" stroke="${CD}" stroke-width="3"/>`;
  const qx=px+130*Math.cos(ph),qy=py+35*Math.sin(ph);
  s+=dot(qx,qy-70,14,'#e0b48f')+line(qx,qy-56,qx,qy,{color:C.ink,w:5});
  s+=turnCW(px,py-10,230,-2.6,-2.0,{color:CW,g:1});
  s+=card(320,40,560,110,L('乗った 観測者の 運動方程式は？',600,105,{size:32,color:CH,weight:700}),seg(p,.1,.25),CH);
  return s;
 },
};
