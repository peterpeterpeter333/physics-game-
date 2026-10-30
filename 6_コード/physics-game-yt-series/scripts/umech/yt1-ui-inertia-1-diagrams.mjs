// YouTube シリーズ 慣性モーメント・初級 1/1（ステージ ui-inertia 本0〜本2）— 図。Stage 1200×515.
// 色：位置・距離 x・r 水色、速度 v 紫、力（重力）F 緑、トルク N 桃、角速度 ω 桃、運動エネルギー K 橙、強調 黄。
// シーソー：1 kg を x＝0、3 kg を x＝4 m。g＝10 m/s² → 10 N・30 N。画面右回り（時計回り）＝右が下がる。
// 回す場面：上から見た図。軸は左下、棒は反時計回りに回る（速さの矢印は棒に直角、長さ ∝ r）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth,poly} from './anim.mjs';

const K='ui-inertia-1:';
const CR=C.x,CV=C.v,CF=C.F,CN=C.p,CW=C.p,CK=C.E,WOOD='#b99b73';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const WW=`{\\color{${CW}}\\omega}`,RR=`{\\color{${CR}}r}`,KK=`{\\color{${CK}}K}`,VV=`{\\color{${CV}}v}`;
const XG=`{\\color{${CR}}x_G}`,XI=`{\\color{${CR}}x_i}`;
const NM=`\\,\\mathrm{N\\cdot m}`;
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function turnArc(cx,cy,r,a0,a1,{color=CN,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=circPts(cx,cy,r,a0,a1,30),[x1,y1]=pts[29],[x2,y2]=pts[30],a=Math.atan2(y2-y1,x2-x1),L=15;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${color}"/>`;
 return fade(g,draw(pts,1,{color,w})+head);
}
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:CF,weight:700}));

// ---- seesaw ------------------------------------------------------------------------------------
// masses: [[u (m), m (kg), text]], support s (m), tilt (rad, + = clockwise = right side down).
function seesaw({s=2,tilt=0,ms=[[0,1,'1 kg'],[4,3,'3 kg']],x0=250,ppm=170,by=280,g=1,wts=0,wtLbl=1,dist=0,nl=1,ticks=null,supLbl=0,sup=1,trq=0,sc=1}={}){
 const X=u=>x0+ppm*u,sx=X(s);
 const R=u=>{const d=X(u)-sx;return [sx+d*Math.cos(tilt),by+d*Math.sin(tilt)];};
 let s1='';
 // number line (fixed)
 if(nl){
  const y=by+170;
  s1+=line(X(-.3),y,X(4.35),y,{color:C.dim,w:2});
  const tk=ticks??[0,1,2,3,4].map(u=>[u,String(u)]);
  for(const [u,t,col] of tk){s1+=line(X(u),y-7,X(u),y+7,{color:C.dim,w:2});if(t.startsWith('$'))s1+=T(t.slice(1),X(u),y+34,{size:26,color:col??CR});else s1+=label(t,X(u),y+32,{size:22,color:col??C.dim,anchor:'middle'});}
  if(!ticks)s1+=label('x (m)',X(4.35)+12,y+8,{size:22,color:CR});
 }
 // support
 if(sup)s1+=poly([[sx,by+6],[sx-34,by+70],[sx+34,by+70]],{fill:C.faint,fo:1,stroke:C.dim,sw:2})+line(sx-80,by+70,sx+80,by+70,{color:C.dim,w:3});
 if(supLbl)s1+=label('支点',sx+42,by+62,{size:22,color:C.dim});
 // bar + blocks (rotated together)
 let b=line(X(-.25),by,X(4.25),by,{color:WOOD,w:10});
 for(const [u,m,t] of ms){const side=Math.round(56*Math.sqrt(m));b+=rect(X(u)-side/2,by-5-side,side,side,{fill:C.m,fo:.18,stroke:C.ink,sw:2,rx:6})+label(t,X(u),by-5-side/2+8,{size:22,color:C.ink,anchor:'middle'});}
 s1+=`<g transform="rotate(${(tilt*180/Math.PI).toFixed(2)} ${sx.toFixed(1)} ${by})">${b}</g>`;
 s1+=dot(sx,by,5,C.dim);
 // weights (vertical, 4 px per N)
 if(wts>0)for(const [u,m] of ms){const [px,py]=R(u),L=40*m;s1+=fade(wts,arrow(px,py+4,px,py+4+L,{color:CF,w:6,head:16})+(wtLbl?label(`${10*m} N`,px+(u<s?-14:14),py+L-8,{size:24,color:CF,anchor:u<s?'end':'start',weight:700}):''));}
 // distances from the support (cyan braces above)
 if(dist>0&&Math.abs(tilt)<.01)for(const [u] of ms){if(Math.abs(u-s)<.05)continue;const a=Math.min(X(u),sx),c=Math.max(X(u),sx);s1+=brace(a,c,by-120,{dir:-1,color:CR,text:`${+Math.abs(u-s).toFixed(2)} m`,size:26,g:dist});}
 // torque turning arrows at the support: left weight → counter-clockwise, right → clockwise
 if(trq>0){s1+=turnArc(sx,by,62,100*Math.PI/180,165*Math.PI/180,{color:CN,g:trq})+turnArc(sx,by,62,80*Math.PI/180,15*Math.PI/180,{color:CN,g:trq});}
 return fade(g,s1);
}
const SX=(u,x0=250,ppm=170)=>x0+ppm*u;

// ---- rod seen from above ---------------------------------------------------------------------------
const O={ax:190,ay:440,ppm:300};
function rodTop(phi,{o=O,len=1,phi0=null,marks=[],varr=[],vk=60,vlab=null,trail=[],wedge=0,wedgeLbl='',g=1,view=1,axisLbl=1,masses=[],rodW=10}={}){
 const P=(r,a=phi)=>[o.ax+r*o.ppm*Math.cos(a),o.ay-r*o.ppm*Math.sin(a)];
 let s='';
 if(view)s+=label('上から見た図',30,40,{size:24,color:C.dim});
 if(phi0!==null){const [ex,ey]=P(len,phi0);s+=line(o.ax,o.ay,ex,ey,{color:WOOD,w:rodW,dash:'10 8',opacity:.35});}
 for(const [r,col] of trail)s+=draw(circPts(o.ax,o.ay,r*o.ppm,phi0??0,phi,40),1,{color:col??CR,w:5});
 if(wedge>0&&phi0!==null)s+=fade(wedge,turnArc(o.ax,o.ay,62,phi0,phi,{color:CW,w:4})+(wedgeLbl?label(wedgeLbl,o.ax+80*Math.cos((phi0+phi)/2)+8,o.ay-80*Math.sin((phi0+phi)/2)+8,{size:28,color:CW,weight:700}):''));
 const [ex,ey]=P(len);
 s+=line(o.ax,o.ay,ex,ey,{color:WOOD,w:rodW});
 for(const [r,m,t] of masses){const [x,y]=P(r);s+=ring(x,y,22,{color:C.ink,w:3,fill:'#2a3550'})+(t?label(t,x+26,y+34,{size:20,color:C.ink}):'');}
 s+=ring(o.ax,o.ay,12,{color:C.ink,w:3,fill:C.bg});
 if(axisLbl)s+=label('軸',o.ax-22,o.ay+8,{size:24,color:C.dim,anchor:'end'});
 for(const [r,t] of marks){const [x,y]=P(r);s+=dot(x,y,7,C.hi)+(t?label(t,x+14*Math.sin(phi)+10,y+14*Math.cos(phi)+24,{size:22,color:CR}):'');}
 varr.forEach(([r,gg,t],i)=>{if(!(gg>0))return;const [x,y]=P(r),ux=-Math.sin(phi),uy=-Math.cos(phi),L=r*vk*2;
  s+=fade(gg,arrow(x,y,x+ux*L,y+uy*L,{color:CV,w:5,head:14})+(t?label(t,x+ux*L-10,y+uy*L-10,{size:22,color:CV,anchor:'end',weight:700}):''));});
 return fade(g,s);
}

// ---- K bars (orange) -------------------------------------------------------------------------------
function kbars(items,{x=700,y=440,sc=65,w=90,gap=150,g=1}={}){
 let s=line(x-30,y,x+gap*items.length-20,y,{color:C.dim,w:3});
 items.forEach(([Kv,lab,val,gg=1,col=CK],i)=>{const bx=x+i*gap;
  s+=fade(gg,rect(bx,y-Kv*sc,w,Kv*sc,{fill:col,fo:.5,stroke:col})+label(val,bx+w/2,y-Kv*sc-12,{size:26,color:col,anchor:'middle',weight:700}));
  s+=label(lab,bx+w/2,y+32,{size:22,color:CR,anchor:'middle'});});
 return fade(g,s);
}

// ---- wheel ------------------------------------------------------------------------------------------
function wheel(cx,cy,R,rot,{g=1}={}){
 let s=ring(cx,cy,R,{color:C.ink,w:6})+ring(cx,cy,R-10,{color:C.faint,w:2});
 for(let k=0;k<6;k++){const a=rot+k*Math.PI/3;s+=line(cx,cy,cx+(R-10)*Math.cos(a),cy+(R-10)*Math.sin(a),{color:C.dim,w:3});}
 s+=dot(cx,cy,8,C.ink)+dot(cx+(R-4)*Math.cos(rot),cy+(R-4)*Math.sin(rot),9,C.hi);
 return fade(g,s);
}

// ---- rod pendulum (前回の終わりと同じ見た目) ------------------------------------------------------------
function rodPend(th,{cx=300,py=60,Lp=330,g=1,w=26,color=CR,blobs=null}={}){
 const ex=cx+Lp*Math.sin(th),ey=py+Lp*Math.cos(th);
 let s=line(cx-90,py,cx+90,py,{color:C.dim,w:4});for(let q=cx-86;q<cx+90;q+=20)s+=line(q,py,q+12,py-14,{color:C.faint,w:2});
 if(blobs){s+=line(cx,py,ex,ey,{color:C.dim,w:5});for(const f of blobs){s+=dot(cx+f*Lp*Math.sin(th),py+f*Lp*Math.cos(th),26,color);}}
 else s+=line(cx,py,ex,ey,{color,w,cap:'round'});
 s+=dot(cx,py,8,C.hi);
 return fade(g,s);
}

export const ytUiInertia1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const th=.35*Math.cos(2*Math.PI*1.1*p),cx=300,py=60,Lp=330,bx=cx+Lp*Math.sin(th),by=py+Lp*Math.cos(th);
  let s='';
  const gr=seg(p,.4,.6);
  s+=fade(1-gr,line(cx-90,py,cx+90,py,{color:C.dim,w:4})+line(cx,py,bx,by,{color:C.ink,w:3})+ring(bx,by,26,{color:CR,w:3,fill:'#123049'}));
  s+=rodPend(th,{cx,py,Lp,g:gr});
  s+=card(640,70,500,150,label('前回：振り子と ばねの リズム',890,160,{size:30,color:C.dim,anchor:'middle'}),seg(p,0,.15));
  s+=card(640,260,500,150,label('おもりが 棒のように',890,320,{size:32,color:C.hi,anchor:'middle',weight:700})+label('広がって いたら？',890,375,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=seesaw({s:2,ms:[[0,1,'1 kg'],[4,3,'3 kg']],x0:90,ppm:95,by:300,nl:0,sup:1,sc:.6,tilt:.12*seg(p,.2,.5)});
  const ph=1.4*seg(p,.1,1);
  s+=rodTop(.2+ph,{o:{ax:780,ay:440,ppm:260},view:0,axisLbl:0,varr:[[.5,1],[1,1]],vk:55});
  s+=card(170,14,860,100,label('重さの 位置 は、つり合いと 回りやすさに どう 効く？',600,76,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(60,60,520,400,label('① 1点で 支えて つり合わせる',320,120,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),CN);
  s+=fade(seg(p,.1,.25),seesaw({s:3,ms:[[0,1,'1 kg'],[4,3,'3 kg']],x0:130,ppm:75,by:330,nl:0}));
  s+=card(620,60,520,400,label('② 軸の 周りに 回す',880,120,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),CW);
  s+=fade(seg(p,.5,.65),rodTop(.3+.9*seg(p,.5,1),{o:{ax:700,ay:420,ppm:250},view:0,axisLbl:0}));
  return s;
 },

 // ===== S2 つり合う点 =====
 [K+'seesaw']:(p)=>{
  let s=seesaw({s:2,sup:0,nl:seg(p,.1,.3)>0?1:0});
  s+=fade(seg(p,.05,.2),label('軽い 棒（棒の 重さは 考えない）',600,60,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),highlight(SX(0)-40,430,80,70,1)+highlight(SX(4)-40,430,80,70,1));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=seesaw({s:2,supLbl:1,sup:seg(p,.3,.45)>0?1:0});
  s+=card(760,40,400,90,label('どこを 支える？',960,98,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.3,.45),label('真ん中？',SX(2),SX(0)>0?100:100,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'torque']:(p)=>{
  let s=seesaw({s:2,supLbl:1,x0:520,ppm:140,by:280});
  s+=card(30,60,440,300,label('角運動量の回',250,110,{size:26,color:C.dim,anchor:'middle'})
   +label('トルク ＝ 力 × 垂直な 距離',250,190,{size:28,color:CN,anchor:'middle',weight:700})
   +label('単位 N·m',250,250,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.7),label('ここでは 軸 ＝ 支点',250,320,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),CN);
  s+=fade(seg(p,.55,.7),turnArc(SX(2,520,140),280,70,100*Math.PI/180,160*Math.PI/180,{color:C.hi})+turnArc(SX(2,520,140),280,70,80*Math.PI/180,20*Math.PI/180,{color:C.hi}));
  return s;
 },
 [K+'weights']:(p)=>{
  let s=seesaw({s:2,supLbl:1,wts:seg(p,.3,.5)});
  s+=fade(seg(p,.05,.2),T('g=10\\,\\mathrm{m/s^2}',1040,60,{size:32}));
  s+=fade(seg(p,.6,.75),label('どちらも 真下向き',1040,120,{size:26,color:CF,anchor:'middle'}));
  return s;
 },
 [K+'mid']:(p)=>{
  const tl=.08*seg(p,.72,.9);
  let s=seesaw({s:2,supLbl:1,wts:1,dist:1-seg(p,.66,.72),tilt:tl,trq:seg(p,.3,.45)*(1-seg(p,.66,.72))});
  s+=fade(seg(p,.2,.35),T(`10\\times2=20${NM}`,SX(0)+70,60,{size:30,color:CN}));
  s+=fade(seg(p,.4,.55),T(`30\\times2={\\color{${C.hi}}60}${NM}`,SX(4)-70,60,{size:30,color:CN}));
  s+=fade(seg(p,.75,.88),label('右に 傾く',SX(4)-70,120,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'move']:(p)=>{
  const sp=mix(2,3,seg(p,.2,.75));
  let s=seesaw({s:sp,supLbl:1,wts:1,dist:1});
  s+=fade(seg(p,.1,.25),arrow(SX(2),by0+100,SX(3)-6,by0+100,{color:C.hi,w:4,head:14}));
  s+=fade(seg(p,.45,.6),label('右の 距離 が 縮み、左の 距離 が 伸びる',600,52,{size:28,color:CR,anchor:'middle',weight:700}));
  return s;
 },
 [K+'three']:(p)=>{
  let s=seesaw({s:3,supLbl:1,wts:1,dist:1,nl:0,trq:seg(p,.55,.7)});
  s+=fade(seg(p,.15,.3),T(`10\\times3=30${NM}`,SX(0)+120,60,{size:30,color:CN}));
  s+=fade(seg(p,.35,.5),T(`30\\times1=30${NM}`,SX(4)-50,60,{size:30,color:CN}));
  s+=fade(seg(p,.6,.75),label('逆向き・同じ 大きさ → 回り始めない',600,470,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mass']:(p)=>{
  let s=seesaw({s:3,supLbl:1,wts:1,wtLbl:0,dist:1,by:330,nl:0});
  s+=card(80,6,1040,108,
   T(`{\\color{${CN}}1\\times10\\times3}={\\color{${CN}}3\\times10\\times1}`,600,46,{size:32})
   +fade(seg(p,.35,.5),T(`{\\color{${C.hi}}1\\times3}={\\color{${C.hi}}3\\times1}`,600,94,{size:32}))
   ,seg(p,0,.12));
  s+=fade(seg(p,.35,.5),label('質量 × 距離',1010,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'heavy']:(p)=>{
  let s=seesaw({s:3,supLbl:1,wts:1,wtLbl:0,dist:1});
  s+=fade(seg(p,.05,.2),line(SX(2),175,SX(2),by0+110,{color:C.dim,w:2,dash:'6 6'})+label('真ん中',SX(2)-12,by0+112,{size:24,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,.2,.35),arrow(SX(2)+6,by0+105,SX(3)-8,by0+105,{color:C.hi,w:4,head:14})+label('重い 側へ 寄る',SX(2.5),60,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S3 重心の式 =====
 [K+'general']:(p)=>{
  const ms=[[.2,1,'m₁'],[1.2,2,'m₂'],[3.9,1.5,'m₃']],sG=(.2*1+1.2*2+3.9*1.5)/4.5;
  const tk=[[.2,'$x_1',CR],[1.2,'$x_2',CR],[3.9,'$x_3',CR]];
  let s=seesaw({s:sG,ms,ticks:[...tk,...(seg(p,.55,.7)>0?[[sG,'$x_G',CR]]:[])],sup:seg(p,.55,.7)>0?1:0});
  s+=fade(seg(p,.1,.3),label('i 番目： 質量 mᵢ、 位置 xᵢ',600,60,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),highlight(SX(sG)-40,430,80,70,1));
  return s;
 },
 [K+'sign']:(p)=>{
  const ms=[[.2,1,'m₁'],[1.2,2,'m₂'],[3.9,1.5,'m₃']],sG=(.2*1+1.2*2+3.9*1.5)/4.5;
  let s=seesaw({s:sG,ms,ticks:[[.2,'$x_1',CR],[1.2,'$x_2',CR],[3.9,'$x_3',CR],[sG,'$x_G',CR]],by:280,wts:0});
  s+=T(`N_i=m_i\\,g\\,(${XI}-${XG})`,600,60,{size:40});
  const yy=150;
  s+=fade(seg(p,.35,.5),arrow(SX(sG),yy,SX(3.9),yy,{color:CR,w:4,head:14})+label('右：正',SX(2.8),yy-14,{size:26,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),arrow(SX(sG),yy,SX(.2),yy,{color:CR,w:4,head:14})+label('左：負',SX(1),yy-14,{size:26,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),turnArc(SX(sG),280,70,80*Math.PI/180,20*Math.PI/180,{color:CN})+turnArc(SX(sG),280,70,100*Math.PI/180,160*Math.PI/180,{color:CN})
   +label('時計回り',SX(sG)+75,345,{size:24,color:CN})+label('反時計回り',SX(sG)-75,345,{size:24,color:CN,anchor:'end'}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=T(`\\sum_i m_i\\,g\\,(${XI}-${XG})=0`,600,200,{size:64});
  s+=fade(seg(p,.05,.2),label('トルクを 全部 足すと 0（つり合い）',600,70,{size:30,color:CN,anchor:'middle',weight:700}));
  const w=texWidth('\\sum_i',64,false);
  s+=fade(seg(p,.4,.55),highlight(600-texWidth(`\\sum_i m_i\\,g\\,(x_i-x_G)=0`,64,false)/2-14,120,w+28,150,1)
   +label('Σ ＝ おもりごとに 足す',600,360,{size:30,color:C.hi,anchor:'middle',weight:700})
   +T('m_1g(x_1-x_G)+m_2g(x_2-x_G)+\\cdots',600,440,{size:34,color:C.dim}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=seesaw({s:3,wts:1,wtLbl:1,by:250,nl:1,x0:330,ppm:140,dist:0});
  s+=T(`10\\times(0-3)+30\\times(4-3)`,420,60,{size:36,color:CN});
  s+=fade(seg(p,.4,.55),T(`=-30+30=0`,880,60,{size:36,color:CN}));
  s+=fade(seg(p,.65,.8),ok(1080,72,1));
  return s;
 },
 [K+'divg']:(p)=>{
  let s=T(`\\sum_i m_i\\,g\\,(${XI}-${XG})=0`,600,110,{size:52});
  s+=fade(seg(p,.2,.35),label('両辺 ÷ g',600,215,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),T(`\\sum_i m_i\\,{\\color{${C.a}}\\cancel{g}}\\,(${XI}-${XG})=0`,600,310,{size:52}));
  s+=fade(seg(p,.6,.75),label('仮定：重力は どこでも 同じ g',600,440,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'expand']:(p)=>{
  let s=T(`\\sum_i m_i(${XI}-${XG})=0`,600,80,{size:46});
  s+=fade(seg(p,.1,.25),T(`\\sum_i m_i${XI}-\\sum_i m_i{\\color{${C.hi}}x_G}=0`,600,200,{size:46}));
  s+=fade(seg(p,.45,.6),T(`\\sum_i m_i${XI}-{\\color{${C.hi}}x_G}\\sum_i m_i=0`,600,330,{size:46}));
  s+=fade(seg(p,.55,.7),label('x_G は 共通 → Σ の 外へ',600,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'solve']:(p)=>{
  let s=T(`\\sum_i m_i${XI}-${XG}\\sum_i m_i=0`,600,70,{size:40,color:C.dim});
  s+=fade(seg(p,.05,.2),T(`\\sum_i m_i${XI}=${XG}\\sum_i m_i`,600,175,{size:46}));
  s+=fade(seg(p,.35,.5),label('両辺 ÷ Σmᵢ（全質量）',600,265,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),T(`${XG}=\\dfrac{\\sum_i m_i${XI}}{\\sum_i m_i}`,600,385,{size:52})+highlight(390,300,420,170,1));
  return s;
 },
 [K+'plug']:(p)=>{
  let s=T(`${XG}=\\dfrac{1\\times0+3\\times4}{1+3}`,420,120,{size:48});
  s+=fade(seg(p,.3,.45),T(`=\\dfrac{12}{4}=3\\,\\mathrm{m}`,850,120,{size:48}));
  s+=fade(seg(p,.55,.7),seesaw({s:3,wts:0,by:300,x0:280,ppm:160,nl:1,supLbl:1})+highlight(SX(3,280,160)-40,445,80,70,1));
  return s;
 },
 [K+'name']:(p)=>{
  let s=seesaw({s:3,x0:80,ppm:110,by:280,nl:1,ticks:[[0,'0'],[3,'3 m',C.hi],[4,'4']]});
  s+=fade(seg(p,.05,.2),label('重心 G',SX(3,80,110),130,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.3),T(`${XG}=\\dfrac{\\sum_i m_i${XI}}{\\sum_i m_i}`,300,60,{size:30}));
  s+=fade(seg(p,.45,.6),seesaw({s:2,ms:[[0,1,'1 kg'],[4,1,'1 kg']],x0:660,ppm:110,by:280,nl:1,ticks:[[0,'0'],[2,'2 m',C.hi],[4,'4']]})
   +label('同じ 質量なら 真ん中',SX(2,660,110),130,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'kind']:(p)=>{
  let s=card(80,40,1040,120,label('条件（角運動量の回）： トルクの 和 ＝ 0',600,112,{size:30,color:CN,anchor:'middle',weight:700}),seg(p,.02,.15),CN);
  s+=card(80,190,1040,130,label('導いた 結果',230,262,{size:28,color:C.hi,anchor:'middle',weight:700})+T(`${XG}=\\dfrac{\\sum_i m_i${XI}}{\\sum_i m_i}`,700,255,{size:36}),seg(p,.15,.3),C.hi);
  s+=card(80,350,1040,120,label('仮定： 重力は どこでも 同じ、 棒は 軽い',600,422,{size:30,color:C.dim,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },

 // ===== S4 回る棒の速さ =====
 [K+'rotate']:(p)=>{
  const ph=.15+1.0*seg(p,.2,1);
  let s=rodTop(ph,{phi0:.15});
  s+=card(640,90,500,170,label('なめらかな 台の 上で',890,155,{size:28,color:C.ink,anchor:'middle'})+label('一端を 軸に 水平に 回す',890,210,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'same']:(p)=>{
  const a0=.15,ph=a0+.8*seg(p,.1,.8);
  let s=rodTop(ph,{phi0:a0,trail:[[.5],[1]],marks:[[.5,''],[1,'']],wedge:seg(p,.3,.5),wedgeLbl:''});
  s+=fade(seg(p,.55,.7),card(640,90,500,170,label('どの 点も',890,155,{size:28,color:C.ink,anchor:'middle'})+label('同じ 時間に 同じ 角度',890,210,{size:32,color:CW,anchor:'middle',weight:700}),1,CW));
  return s;
 },
 [K+'omega']:(p)=>{
  const a0=.15,ph=a0+.8*seg(p,.05,.6);
  let s=rodTop(ph,{phi0:a0,wedge:1,wedgeLbl:'ω'});
  s+=card(600,80,560,210,label('1秒あたりに 回る 角度',880,150,{size:30,color:C.ink,anchor:'middle'})+label('＝ 角速度 ω',880,215,{size:36,color:CW,anchor:'middle',weight:700}),seg(p,.1,.25),CW);
  s+=fade(seg(p,.55,.7),card(600,320,560,110,T('\\text{単位}\\ \\ \\mathrm{rad/s}',880,378,{size:36,color:C.ink}),1));
  return s;
 },
 [K+'omega2']:(p)=>{
  // left: the imagined circle of the oscillation (shadow); right: the real rod
  let s=card(40,40,540,440,label('振動の回： 角振動数 ω',310,95,{size:28,color:C.dim,anchor:'middle',weight:700}),1);
  const cx=230,cy=290,R=120,a=2*Math.PI*.8*p;
  s+=ring(cx,cy,R,{color:C.faint,w:3,dash:'8 8'})+line(cx,cy,cx+R*Math.cos(a),cy-R*Math.sin(a),{color:C.dim,w:3})+dot(cx+R*Math.cos(a),cy-R*Math.sin(a),10,C.hi);
  s+=line(420,cy-R-10,420,cy+R+10,{color:C.dim,w:2})+line(cx+R*Math.cos(a),cy-R*Math.sin(a),420,cy-R*Math.sin(a),{color:C.hi,w:2,dash:'5 6'})+dot(420,cy-R*Math.sin(a),11,CR);
  s+=label('想像の 円（影 ＝ 振動）',310,460,{size:22,color:C.dim,anchor:'middle'});
  s+=card(620,40,540,440,label('ここ： 角速度 ω',890,95,{size:28,color:CW,anchor:'middle',weight:700}),seg(p,.4,.55),CW);
  s+=fade(seg(p,.4,.55),rodTop(.2+1.1*seg(p,.45,1),{o:{ax:700,ay:420,ppm:260},view:0,axisLbl:0})+label('棒が 実際に 回る 速さ',890,460,{size:22,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'arc']:(p)=>{
  const a0=.15,w=.7,ph=a0+w*seg(p,.35,.65);
  let s=rodTop(ph,{phi0:a0,trail:[[.9]],marks:[[.9,'']],wedge:1,wedgeLbl:'ω'});
  const bx=O.ax+.9*O.ppm*Math.cos((a0+ph)/2),by=O.ay-.9*O.ppm*Math.sin((a0+ph)/2);
  s+=fade(seg(p,.6,.75),label('rω',bx+18,by-8,{size:30,color:CR,weight:700}));
  s+=fade(seg(p,.6,.75),brace(O.ax,O.ax+.9*O.ppm*Math.cos(a0),O.ay-.9*O.ppm*Math.sin(a0)*0+20,{dir:1,color:CR,text:'r',size:28}));
  s+=card(620,50,540,150,label('弧の 長さ ＝ 半径 × 角度',890,110,{size:30,color:C.ink,anchor:'middle'})+label('（角度は ラジアン）',890,160,{size:24,color:C.dim,anchor:'middle'}),seg(p,.02,.15));
  s+=fade(seg(p,.35,.5),card(620,240,540,160,label('1秒で 角 ω 回る',890,300,{size:28,color:CW,anchor:'middle'})+T(`\\text{進む 長さ}=${RR}${WW}`,890,360,{size:36,color:C.ink}),1,CR));
  return s;
 },
 [K+'vrw']:(p)=>{
  const ph=.35+.5*seg(p,0,1);
  let s=rodTop(ph,{varr:[[1,seg(p,.1,.3),'v']],vk:60});
  s+=card(640,70,500,120,T(`${VV}=${RR}${WW}`,890,140,{size:56}),seg(p,0,.15),CV);
  s+=fade(seg(p,.45,.6),card(640,230,500,150,label('角度は 同じ',890,290,{size:28,color:CW,anchor:'middle'})+label('遠い 点ほど 長い道 → 速い',890,345,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'vnum']:(p)=>{
  const ph=.35+.5*seg(p,0,1);
  let s=rodTop(ph,{marks:[[.5,'0.5 m'],[1,'1 m']],varr:[[.5,seg(p,.25,.4),'1 m/s'],[1,seg(p,.5,.65),'2 m/s']],vk:60});
  s+=card(700,60,440,100,T(`${WW}=2\\,\\mathrm{rad/s}`,920,112,{size:40}),seg(p,0,.15),CW);
  s+=fade(seg(p,.25,.4),T(`0.5\\times2=1\\,\\mathrm{m/s}`,920,240,{size:36,color:CV}));
  s+=fade(seg(p,.5,.65),T(`1\\times2=2\\,\\mathrm{m/s}`,920,320,{size:36,color:CV}));
  return s;
 },
 [K+'varr']:(p)=>{
  const ph=.35+.5*seg(p,0,1);
  let s=rodTop(ph,{varr:[[.25,seg(p,.05,.2)],[.5,seg(p,.1,.25)],[.75,seg(p,.15,.3)],[1,seg(p,.2,.35)]],vk:60});
  s+=card(640,70,500,150,label('矢印は 棒に 直角',890,130,{size:28,color:CV,anchor:'middle'})+label('長さ ∝ 軸からの 距離',890,185,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),CV);
  s+=fade(seg(p,.65,.8),label('軸：速さ 0',O.ax+30,O.ay+50,{size:26,color:C.hi,weight:700}));
  return s;
 },

 // ===== S5 運動エネルギーと距離 =====
 [K+'kin']:(p)=>{
  let s=label('仕事の回',600,60,{size:26,color:C.dim,anchor:'middle'});
  s+=T(`${KK}=\\tfrac12 m${VV}^2`,600,170,{size:64});
  s+=fade(seg(p,.4,.55),T(`${VV}=${RR}${WW}`,600,340,{size:56})+arrow(600,295,600,225,{color:C.hi,w:4,head:14})+label('入れる',630,270,{size:26,color:C.hi}));
  return s;
 },
 [K+'kin2']:(p)=>{
  let s=T(`${KK}=\\tfrac12 m(${RR}${WW})^2`,600,100,{size:52});
  s+=fade(seg(p,.2,.35),T(`=\\tfrac12 m\\,{\\color{${C.hi}}${RR}^2}\\,${WW}^2`,600,230,{size:56}));
  s+=fade(seg(p,.5,.65),card(250,320,700,150,label('v に r が 1回 → 2乗で r が 2回',600,380,{size:30,color:C.ink,anchor:'middle'})+label('K ∝ r²（同じ m、同じ ω）',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'two']:(p)=>{
  const ph=.2+1.0*seg(p,.1,1);
  let s=rodTop(ph,{o:{ax:90,ay:440,ppm:220},masses:[[.5,1,'1 kg']],marks:[],axisLbl:0,view:0,varr:[[.5,1]],vk:55,rodW:6});
  s+=rodTop(ph,{o:{ax:430,ay:440,ppm:220},masses:[[1,1,'1 kg']],axisLbl:0,view:0,varr:[[1,1]],vk:55,rodW:6});
  s+=label('0.5 m',200,500,{size:24,color:CR,anchor:'middle'})+label('1 m',540,500,{size:24,color:CR,anchor:'middle'});
  s+=card(760,60,400,100,T(`${WW}=2\\,\\mathrm{rad/s}`,960,112,{size:36}),seg(p,0,.15),CW);
  s+=card(760,200,400,120,label('K は 何倍？',960,272,{size:34,color:CK,anchor:'middle',weight:700}),seg(p,.4,.55),CK);
  return s;
 },
 [K+'two2']:(p)=>{
  let s=kbars([[.5,'0.5 m','0.5 J',seg(p,.05,.25)],[2,'1 m','2 J',seg(p,.4,.6)]],{x:140,y:440,sc:65,gap:220,w:120});
  s+=fade(seg(p,.05,.25),T(`\\tfrac12\\times1\\times1^2=0.5\\,\\mathrm J`,800,140,{size:34,color:CK}));
  s+=fade(seg(p,.4,.6),T(`\\tfrac12\\times1\\times2^2=2\\,\\mathrm J`,800,240,{size:34,color:CK}));
  s+=fade(seg(p,.7,.85),label('距離 2倍 → K 4倍',800,360,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'work']:(p)=>{
  let s=kbars([[.5,'0.5 m','0.5 J'],[2,'1 m','2 J']],{x:140,y:440,sc:65,gap:220,w:120});
  s+=card(620,70,540,160,label('止まった 棒を ω まで 回す',890,130,{size:28,color:C.ink,anchor:'middle'})+label('入れる 仕事 ＝ K',890,190,{size:32,color:CK,anchor:'middle',weight:700}),seg(p,.05,.2),CK);
  s+=card(620,270,540,130,label('遠くの 重さほど 多くの 仕事',890,345,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=kbars([[.5,'0.5 m','0.5 J'],[2,'1 m','2 J'],[0,'1.5 m','？',1,C.hi]],{x:120,y:440,sc:65,gap:200,w:110});
  s+=fade(seg(p,.1,.25),label('？',120+400+55,300,{size:60,color:C.hi,anchor:'middle',weight:700}));
  s+=card(760,70,400,120,label('3倍の 1.5 m なら？',960,142,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=kbars([[.5,'0.5 m','0.5 J'],[2,'1 m','2 J'],[4.5,'1.5 m','4.5 J',seg(p,.25,.45)]],{x:120,y:440,sc:65,gap:200,w:110});
  s+=fade(seg(p,.05,.2),T(`${VV}=1.5\\times2=3\\,\\mathrm{m/s}`,960,80,{size:32}));
  s+=fade(seg(p,.2,.35),T(`${KK}=\\tfrac12\\times1\\times3^2=4.5\\,\\mathrm J`,960,170,{size:32}));
  s+=fade(seg(p,.55,.7),card(760,240,400,150,label('0.5 J の 9倍',960,300,{size:30,color:CK,anchor:'middle',weight:700})+label('9 ＝ 3²（距離の 倍率の 2乗）',960,355,{size:24,color:C.hi,anchor:'middle'}),1,C.hi));
  return s;
 },
 [K+'inertia']:(p)=>{
  let s=T(`I=\\sum_i m_i\\,${RR}_i^{\\,2}`,600,150,{size:72});
  s+=fade(seg(p,.2,.35),label('各部分の 質量 × 距離² を 足す',600,280,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),label('慣性モーメント ＝ 回しにくさ',600,350,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('（詳しくは 中級で）',600,430,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'back']:(p)=>{
  const th=.3*Math.cos(2*Math.PI*1.2*p);
  let s=rodPend(th,{cx:260,py:70,Lp:300,blobs:[.25,.3],color:CR});
  s+=rodPend(th,{cx:760,py:70,Lp:300,blobs:[.9,.95],color:CR});
  s+=label('支点の 近く',260,440,{size:28,color:C.ink,anchor:'middle'})+label('支点から 遠く',760,440,{size:28,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.3,.45),label('同じ 質量',510,230,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('回しにくい',760,490,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S6 まとめ =====
 [K+'sum1']:(p)=>{
  let s=seesaw({s:3,wts:1,wtLbl:0,by:300,x0:120,ppm:140,nl:1,ticks:[[0,'0'],[3,'3 m',C.hi],[4,'4']]});
  s+=card(760,100,400,220,label('重心',960,160,{size:32,color:C.hi,anchor:'middle',weight:700})+T(`${XG}=\\dfrac{\\sum_i m_i${XI}}{\\sum_i m_i}`,960,240,{size:30})+label('重い 側へ 寄る',960,300,{size:24,color:C.ink,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'sum2']:(p)=>{
  const ph=.35+.5*seg(p,0,1);
  let s=rodTop(ph,{varr:[[.25,1],[.5,1],[.75,1],[1,1]],vk:60});
  s+=card(640,60,500,120,T(`${VV}=${RR}${WW}`,890,130,{size:48}),seg(p,.1,.25),CV);
  s+=card(640,220,500,140,T(`${KK}=\\tfrac12 m${RR}^2${WW}^2`,890,295,{size:44}),seg(p,.45,.6),CK);
  return s;
 },
 [K+'sum3']:(p)=>{
  let s=card(80,60,1040,150,label('つり合い',260,145,{size:32,color:CN,anchor:'middle',weight:700})+label('質量 × 距離',720,145,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),CN);
  s+=card(80,260,1040,150,label('回しにくさ',260,345,{size:32,color:CK,anchor:'middle',weight:700})+label('質量 × 距離²',720,345,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),CK);
  return s;
 },
 [K+'next']:(p)=>{
  const R=110,cx=mix(200,900,p),cy=390-R;
  let s=line(40,390,1160,390,{color:C.dim,w:3});
  s+=wheel(cx,cy,R,(cx-200)/R);
  s+=fade(seg(p,.1,.25),label('回りながら 前へ 進む',600,70,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  const R=110,cx=mix(250,650,p),cy=390-R;
  let s=line(40,390,1160,390,{color:C.dim,w:3});
  s+=wheel(cx,cy,R,(cx-250)/R);
  s+=turnArc(cx,cy,R+26,150*Math.PI/180,30*Math.PI/180,{color:CW,w:4})+label('ω',cx,cy-R-44,{size:32,color:CW,anchor:'middle',weight:700});
  s+=arrow(cx,cy,cx+150,cy,{color:CV,w:6,head:18})+label('v',cx+160,cy+10,{size:32,color:CV,weight:700});
  s+=card(820,120,340,140,label('ω と v は',990,180,{size:30,color:C.ink,anchor:'middle'})+label('どう つながる？',990,230,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
};
const by0=280;
