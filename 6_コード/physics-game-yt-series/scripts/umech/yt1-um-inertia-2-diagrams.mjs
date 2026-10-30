// YouTube シリーズ「慣性モーメント・中級 2/2」(ys-um-inertia-2) — 図。Stage 1200×515.
// 色：位置・距離 x・r 水色、幅 dx 金、質量 m・dm・I 白、ω・トルク 桃、エネルギー 橙、強調 黄、近似の誤差・誤り 赤。
// 数値：軽い 2 m の棒の両端に 1 kg → 中心軸 2、端の軸 4 kg·m²。一様な棒 M＝3 kg、l＝2 m、端の軸：
//   4本 3.9375≈3.94、8本 3.984≈3.98、積分 4。1 m あたり 1.5 kg。中心軸 1 kg·m²。全質量が先端なら 12。
// 上から見た図：回転は反時計回り（ω の矢印も反時計回り）。棒は軸（⊙）から右へ伸びる。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth,poly,axes} from './anim.mjs';

const K='um-inertia-2:';
const CR=C.x,CT=C.t,CW=C.p,CK=C.E,CH=C.hi,CD=C.dim,CM=C.m,BAD=C.a,WOOD='#b99b73',WOOD2='#8a6f4c';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const col=(c,s)=>`{\\color{${c}}{${s}}}`;
const RI2=col(CR,'r_i^2'),X2=col(CR,'x^2'),X3=col(CR,'x^3'),XX=col(CR,'x'),DX=col(CT,'dx'),WW=col(CW,'\\omega'),KK=col(CK,'K');
const U=s=>`\\,\\mathrm{${s}}`,KGM2=U('kg\\cdot m^2');
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700,anchor:'middle'}));
const axisMark=(x,y,lbl=0)=>ring(x,y,12,{color:C.ink,w:3,fill:C.bg})+dot(x,y,4,C.ink)+(lbl?label('軸',x-20,y+8,{size:24,color:CD,anchor:'end'}):'');
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function turnArc(cx,cy,r,a0,a1,{color=CW,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=circPts(cx,cy,r,a0,a1,30),[x1,y1]=pts[29],[x2,y2]=pts[30],a=Math.atan2(y2-y1,x2-x1),Lh=15;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-Lh*Math.cos(a)+Lh*.55*Math.sin(a)},${y2-Lh*Math.sin(a)-Lh*.55*Math.cos(a)} ${x2-Lh*Math.cos(a)-Lh*.55*Math.sin(a)},${y2-Lh*Math.sin(a)+Lh*.55*Math.cos(a)}" fill="${color}"/>`;
 return fade(g,draw(pts,1,{color,w})+head);
}
const rot=(x,y,ang,svg)=>Math.abs(ang)<1e-4?svg:`<g transform="rotate(${(-ang*180/Math.PI).toFixed(2)} ${x} ${y})">${svg}</g>`;

// ---- the uniform rod (top view). axis at u = ax (m from the left end) ------------------------------------
function rod({x0=150,y=240,ppm=400,l=2,ax=0,ang=0,g=1,n=0,shade=0,mids=0,midLbl='',hl=-1,axis=1,h=26}={}){
 const X=u=>x0+ppm*u,px=X(ax);
 let s=rect(X(0),y-h/2,ppm*l,h,{fill:WOOD,fo:.9,stroke:WOOD2,sw:2,rx:6});
 if(n>0){for(let k=0;k<n;k++){const a=X(l*k/n),w=ppm*l/n;
   if(shade&&k%2)s+=rect(a,y-h/2,w,h,{fill:'#6d5638',fo:.8,stroke:'none',rx:0});
   if(k===hl)s+=rect(a,y-h/2,w,h,{fill:CH,fo:.35,stroke:CH,sw:2,rx:0});
   if(k>0)s+=line(a,y-h/2-6,a,y+h/2+6,{color:C.bg,w:3});}
  if(mids>0)for(let k=0;k<n;k++){const m=X(l*(k+.5)/n);s+=fade(mids,dot(m,y,8,CM)+(midLbl?label(midLbl,m,y-h/2-12,{size:20,color:CM,anchor:'middle'}):''));}}
 if(axis)s+=axisMark(px,y);
 return fade(g,rot(px,y,ang,s));
}
function ticks(x0,y,ppm,vals,{g=1,unit='m',color=CD}={}){
 let s='';for(const [u,t] of vals){s+=line(x0+ppm*u,y-7,x0+ppm*u,y+7,{color:CD,w:2})+label(t,x0+ppm*u,y+30,{size:22,color,anchor:'middle'});}
 s=line(x0-10,y,x0+ppm*vals[vals.length-1][0]+20,y,{color:CD,w:2})+s+label(`x (${unit})`,x0+ppm*vals[vals.length-1][0]+30,y+8,{size:22,color:CR});
 return fade(g,s);
}
// dumbbell: light rod 2 m with 1 kg at both ends. axis at u (0 = left end, 1 = centre)
function dumbbell({x0=150,y=250,ppm=120,ax=1,ang=0,g=1,lbl=1}={}){
 const X=u=>x0+ppm*u,px=X(ax);
 let s=line(X(0),y,X(2),y,{color:WOOD,w:6})+ring(X(0),y,22,{color:C.ink,w:3,fill:'#2a3550'})+ring(X(2),y,22,{color:C.ink,w:3,fill:'#2a3550'});
 if(lbl)s+=label('1 kg',X(0),y+7,{size:17,color:C.ink,anchor:'middle',weight:700})+label('1 kg',X(2),y+7,{size:17,color:C.ink,anchor:'middle',weight:700});
 s+=axisMark(px,y);
 return fade(g,rot(px,y,ang,s));
}
function bars(items,{x=700,y=440,sc=70,w=100,gap=160,g=1,base=1}={}){
 let s=base?line(x-30,y,x+gap*items.length-40,y,{color:CD,w:3}):'';
 items.forEach(([v,lab,val,gg=1,c=CM,fo=.3],i)=>{const bx=x+i*gap;
  s+=fade(gg,rect(bx,y-v*sc,w,v*sc,{fill:c,fo,stroke:c})+label(val,bx+w/2,y-v*sc-12,{size:24,color:c,anchor:'middle',weight:700}));
  s+=label(lab,bx+w/2,y+30,{size:22,color:CD,anchor:'middle'});});
 return fade(g,s);
}

export const ytUmInertia2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s='';const cx=250,cy=280,ph=.6*p;
  const pts=[[.4,.1],[.8,-.2],[1.1,.3],[.6,.5],[1.3,-.1],[.9,.8],[.3,-.4]];
  for(const [x,y] of pts){const c=Math.cos(ph),si=Math.sin(ph),X=cx+130*(x*c-y*si),Y=cy-130*(x*si+y*c);s+=line(cx,cy,X,Y,{color:C.faint,w:2})+dot(X,Y,10,'#8fa6cf');}
  s+=axisMark(cx,cy,1)+turnArc(cx,cy,60,.2,1.6,{color:CW});
  s+=card(560,70,600,330,L('前回（慣性モーメント・中級 1/2）',860,120,{size:24,color:CD})
   +fade(seg(p,.1,.25),T(`I=\\sum_i m_i${RI2}`,860,225,{size:52}))
   +fade(seg(p,.5,.65),T(`${KK}=\\tfrac12 I${WW}^2`,860,335,{size:50})),seg(p,0,.12));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s='';for(let i=0;i<8;i++)s+=dot(160+55*i,150,13,'#8fa6cf');
  s+=L('質点の 集まり → Σ で 足せた',350,90,{size:26,color:CD});
  s+=rect(640,137,440,26,{fill:WOOD,fo:.9,stroke:WOOD2,rx:6});
  s+=L('切れ目の ない 棒',860,90,{size:28,color:CH,weight:700});
  s+=card(200,240,800,190,L('前回の 最後の 問い',600,290,{size:24,color:CD})+L('Σ を どう 書き直す？',600,370,{size:36,color:CH,weight:700}),seg(p,.2,.35),CH);
  return s;
 },
 [K+'nograin']:(p)=>{
  let s=rect(150,120,900,40,{fill:WOOD,fo:.9,stroke:WOOD2,rx:6});
  const cxs=[330,610,880];cxs.forEach((cx,i)=>{const g=seg(p,.1+.15*i,.25+.15*i);s+=fade(g,line(cx,100,cx,180,{color:CH,w:3,dash:'6 5'})+label('✂',cx,95,{size:30,color:CH,anchor:'middle'}));});
  // zoomed piece: still continuous
  s+=fade(seg(p,.55,.7),line(610,165,500,250,{color:CD,w:2,dash:'5 5'})+line(610,165,720,250,{color:CD,w:2,dash:'5 5'})
   +rect(420,250,380,110,{fill:WOOD,fo:.9,stroke:WOOD2,rx:10})+L('拡大しても 切れ目なく 続く',610,410,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.05,.2),L('数えられる 粒が ない',600,60,{size:28,color:C.ink}));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=fade(.35,rod({x0:200,y:120,ppm:400,l:2,n:Math.round(mix(4,20,seg(p,.1,.8)))}));
  s+=card(170,190,860,250,L('今回の 問い',600,240,{size:26,color:CD})
   +L('切れ目の ない 物体の 慣性モーメントを',600,310,{size:32,color:C.ink,weight:700})
   +fade(seg(p,.35,.5),T(`\\sum\\ \\longrightarrow\\ \\int`,450,385,{size:44,color:CH})+L('で 求めるには？',720,395,{size:32,color:CH,weight:700})),seg(p,0,.12),CH);
  return s;
 },

 // ===== S2 Σ が命じていること =====
 [K+'cmd']:(p)=>{
  let s=T(`I=\\sum_i\\,${col(CM,'m_i')}\\,${RI2}`,600,130,{size:76});
  const w=texWidth(`I=\\sum_i\\,m_i\\,r_i^2`,76,false),x0=600-w/2;
  const xs=[x0+w*.43,x0+w*.70,x0+w*.90];
  s+=fade(seg(p,.2,.35),arrow(xs[1],230,xs[1],185,{color:CM,w:3,head:12})+L('質量',xs[1],265,{size:26,color:CM,weight:700}));
  s+=fade(seg(p,.3,.45),arrow(xs[2],230,xs[2],185,{color:CR,w:3,head:12})+L('距離²',xs[2]+10,265,{size:26,color:CR,weight:700}));
  s+=fade(seg(p,.5,.65),arrow(xs[0],230,xs[0],195,{color:CH,w:3,head:12})+L('全部 足す',xs[0]-20,265,{size:26,color:CH,weight:700}));
  s+=fade(seg(p,.65,.8),card(230,320,740,120,L('各部分ごとに「質量 × 距離²」→ 全部 足す',600,390,{size:30,color:C.ink,weight:700}),1,CH));
  return s;
 },
 [K+'perp']:(p)=>{
  // top view: an L-shaped plate, centre G, axis A elsewhere
  let s=label('上から 見た 図',30,40,{size:24,color:CD});
  s+=poly([[200,120],[520,120],[520,220],[330,220],[330,420],[200,420]],{fill:'#1b2946',fo:.9,stroke:CD,sw:2});
  const ax=[250,380],gx=[330,230],pt=[480,160];
  s+=axisMark(ax[0],ax[1])+label('軸',ax[0]-20,ax[1]+30,{size:24,color:CD,anchor:'end'});
  s+=dot(gx[0],gx[1],7,CD)+label('中心',gx[0]+12,gx[1]+26,{size:22,color:CD});
  s+=dot(pt[0],pt[1],9,CH);
  s+=fade(seg(p,.15,.3),line(ax[0],ax[1],pt[0],pt[1],{color:CR,w:4})+label('rᵢ',(ax[0]+pt[0])/2+14,(ax[1]+pt[1])/2+10,{size:28,color:CR,weight:700}));
  s+=fade(seg(p,.5,.65),line(gx[0],gx[1],pt[0],pt[1],{color:BAD,w:3,dash:'7 6'})+label('✗',(gx[0]+pt[0])/2,(gx[1]+pt[1])/2-12,{size:28,color:BAD,anchor:'middle',weight:700}));
  s+=card(640,110,520,260,L('rᵢ ＝ 回転軸 からの',900,190,{size:30,color:CR,weight:700})+L('垂直な 距離',900,240,{size:30,color:CR,weight:700})
   +fade(seg(p,.5,.65),L('中心からの 距離 とは 限らない',900,315,{size:26,color:BAD})),seg(p,.1,.25),CR);
  return s;
 },
 [K+'side']:(p)=>{
  let s=label('横から 見た 図',30,40,{size:24,color:CD});
  const axX=300;
  s+=line(axX,70,axX,480,{color:C.ink,w:4,dash:'12 8'})+label('回転軸',axX+16,90,{size:24,color:C.ink});
  s+=turnArc(axX,450,40,-.4,3.5,{color:CW,g:1});
  const P=[[520,160],[520,380],[420,300]];
  P.forEach(([x,y],i)=>{const g=seg(p,.1+.12*i,.25+.12*i);s+=fade(g,dot(x,y,11,CH)+line(axX,y,x,y,{color:CR,w:4})+dot(axX,y,5,CR));});
  s+=fade(seg(p,.2,.35),label('r',410,150,{size:26,color:CR,weight:700}))+fade(seg(p,.32,.47),label('r（同じ）',410,370,{size:26,color:CR,weight:700}));
  s+=fade(seg(p,.6,.75),line(560,160,560,380,{color:BAD,w:3})+label('高さの 差',575,275,{size:24,color:BAD}));
  s+=card(720,120,440,230,L('水平に 下ろした 線',940,195,{size:30,color:CR,weight:700})+fade(seg(p,.6,.75),L('軸に 沿った 高さは',940,265,{size:26,color:C.ink})+L('効かない',940,310,{size:30,color:CH,weight:700})),seg(p,.05,.2),CR);
  return s;
 },
 [K+'db1']:(p)=>{
  const ang=.9*seg(p,.1,1);
  let s=dumbbell({x0:120,y:280,ppm:130,ax:1,ang});
  s+=fade(seg(p,.1,.25),turnArc(250,280,55,.3,1.9,{color:CW}));
  s+=label('真ん中が 軸',250,470,{size:26,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.3,.45),card(600,100,560,230,L('各 1 kg、 軸から 1 m',880,160,{size:26,color:CD})+T(`I=1\\times${col(CR,'1')}^2+1\\times${col(CR,'1')}^2`,880,230,{size:38})+T(`=2${KGM2}`,880,295,{size:40}),1));
  return s;
 },
 [K+'db2']:(p)=>{
  let s=dumbbell({x0:90,y:280,ppm:95,ax:1,ang:.4,lbl:0});
  s+=L('真ん中： 2 kg·m²',185,470,{size:24,color:CD});
  const ang=.9*seg(p,.1,1);
  s+=dumbbell({x0:420,y:360,ppm:95,ax:0,ang,g:1});
  s+=fade(seg(p,.1,.25),turnArc(420,360,55,.3,1.9,{color:CW}));
  s+=L('端が 軸',520,470,{size:26});
  s+=card(680,90,480,230,L('軸から 0 m と 2 m',920,150,{size:26,color:CD})+T(`I=1\\times${col(CR,'0')}^2+1\\times${col(CR,'2')}^2`,920,220,{size:36})+T(`=4${KGM2}`,920,285,{size:40}),seg(p,.25,.4));
  s+=fade(seg(p,.7,.85),L('軸を 変えると I も 変わる',920,380,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'which']:(p)=>{
  let s=dumbbell({x0:120,y:230,ppm:100,ax:1,ang:.3,lbl:0})+L('真ん中の 軸',220,380,{size:24,color:CD})+T(`I=2${KGM2}`,220,430,{size:32});
  s+=dumbbell({x0:470,y:280,ppm:100,ax:0,ang:.3,lbl:0})+L('端の 軸',570,380,{size:24,color:CD})+T(`I=4${KGM2}`,570,430,{size:32});
  s+=card(780,140,380,200,L('I は いつも',970,205,{size:28})+L('どの 軸の まわりか',970,260,{size:30,color:CH,weight:700})+L('と セット',970,305,{size:28}),seg(p,.1,.25),CH);
  return s;
 },

 // ===== S3 切って足す =====
 [K+'rod']:(p)=>{
  const ang=.25*Math.sin(Math.PI*seg(p,.5,1));
  let s=rod({x0:150,y:230,ppm:400,ang});
  s+=fade(seg(p,.05,.2),ticks(150,330,400,[[0,'0'],[.5,'0.5'],[1,'1'],[1.5,'1.5'],[2,'2']]));
  s+=fade(seg(p,.1,.25),L('一様な 棒',550,130,{size:28,color:C.ink,weight:700}));
  s+=fade(seg(p,.2,.35),T(`M=3\\,\\mathrm{kg}`,420,440,{size:34})+T(`${col(CR,'l')}=2\\,\\mathrm{m}`,700,440,{size:34}));
  s+=fade(seg(p,.5,.65),label('端が 軸',150,300,{size:24,color:CD,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=rod({x0:150,y:230,ppm:400,n:seg(p,.55,.7)>0?4:0});
  s+=ticks(150,330,400,[[0,'0'],[.5,'0.5'],[1,'1'],[1.5,'1.5'],[2,'2']]);
  s+=card(760,60,400,110,T(`I\\approx\\ ?`,960,118,{size:44,color:CH}),seg(p,.05,.2),CH);
  s+=fade(seg(p,.55,.7),L('切って Σ を 使う',550,130,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'four']:(p)=>{
  let s=rod({x0:150,y:230,ppm:400,n:4,shade:1,mids:seg(p,.45,.6),midLbl:seg(p,.2,.35)>0?'0.75 kg':''});
  s+=ticks(150,330,400,[[0,'0'],[.5,'0.5'],[1,'1'],[1.5,'1.5'],[2,'2']]);
  s+=fade(seg(p,.05,.2),brace(150,350,265,{dir:1,color:CT,text:'0.5 m',size:22}));
  s+=fade(seg(p,.45,.6),card(360,390,480,100,L('質量は 各部分の 真ん中に 集める',600,450,{size:26,color:CM}),1));
  return s;
 },
 [K+'dist']:(p)=>{
  let s=rod({x0:150,y:200,ppm:400,n:4,shade:1,mids:1});
  s+=ticks(150,400,400,[[0,'0'],[.5,'0.5'],[1,'1'],[1.5,'1.5'],[2,'2']]);
  [.25,.75,1.25,1.75].forEach((u,i)=>{const g=seg(p,.1+.15*i,.25+.15*i),y=240+36*i;s+=fade(g,line(150,y,150+400*u,y,{color:CR,w:3})+dot(150+400*u,y,5,CR)+label(`${u}`,150+400*u+10,y+8,{size:22,color:CR,weight:700}));});
  s+=fade(seg(p,.7,.85),L('軸から 真ん中 までの 距離',870,120,{size:26,color:CR,weight:700}));
  return s;
 },
 [K+'sum4']:(p)=>{
  let s=rod({x0:300,y:70,ppm:300,n:4,shade:1,mids:1});
  s+=T(`\\sum=0.75\\times(${col(CR,'0.25')}^2+${col(CR,'0.75')}^2+${col(CR,'1.25')}^2+${col(CR,'1.75')}^2)`,600,210,{size:36});
  s+=fade(seg(p,.4,.55),T(`=0.75\\times5.25`,600,300,{size:38}));
  s+=fade(seg(p,.6,.75),T(`\\approx3.94${KGM2}`,600,390,{size:46})+highlight(430,340,340,95,1));
  return s;
 },
 [K+'approx']:(p)=>{
  let s=rod({x0:150,y:120,ppm:400,n:4,shade:1,mids:1,hl:3});
  // zoom the 4th piece: near end 1.5 m, mid 1.75 m, far end 2 m
  const zx=300,zy=330,zw=600;
  s+=fade(seg(p,.1,.25),line(750,135,zx,zy-30,{color:CD,w:2,dash:'5 5'})+line(950,135,zx+zw,zy-30,{color:CD,w:2,dash:'5 5'})
   +rect(zx,zy-30,zw,60,{fill:WOOD,fo:.9,stroke:CH,sw:2,rx:0})+dot(zx+zw/2,zy,9,CM)
   +label('1.5 m',zx,zy+62,{size:22,color:CR,anchor:'middle'})+label('1.75 m',zx+zw/2,zy+62,{size:22,color:CR,anchor:'middle'})+label('2 m',zx+zw,zy+62,{size:22,color:CR,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),label('軸に 近い',zx+60,zy-44,{size:24,color:BAD,anchor:'middle',weight:700})+label('軸から 遠い',zx+zw-70,zy-44,{size:24,color:BAD,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),L('真ん中に 集めた → ≈',600,470,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'eight']:(p)=>{
  let s=rod({x0:150,y:90,ppm:400,n:8,shade:1,mids:1});
  s+=bars([[.1375,'4本','3.94'],[.184,'8本','3.98',seg(p,.1,.3)],[.2,'もっと 細かく','→ 4',seg(p,.5,.7),CH,.15]],{x:260,y:460,sc:1300,w:140,gap:260});
  s+=fade(seg(p,.5,.7),line(690,460-.2*1300,1020,460-.2*1300,{color:CH,w:2,dash:'8 6'}));
  s+=label('（3.8 より 上を 拡大）',1180,440,{size:22,color:CD,anchor:'end'});
  return s;
 },
 [K+'integ']:(p)=>{
  // left: strips under a curve (積分の回); right: rod pieces
  const A=axes({x:80,y:430,w:420,h:280,xmax:2.2,ymax:4.4,xticks:[],yticks:[]});
  let s=card(40,40,520,440,'',1)+A.svg+A.plot(x=>x*x,{from:0,to:2,color:CR,w:4});
  const n=Math.round(mix(4,16,seg(p,.1,.6)));for(let k=0;k<n;k++){const a=2*k/n,b=2*(k+1)/n,m=(a+b)/2;s+=rect(A.X(a),A.Y(m*m),A.X(b)-A.X(a),A.Y(0)-A.Y(m*m),{fill:CT,fo:.3,stroke:CT,sw:1,rx:0});}
  s+=L('積分の回： 短冊 → 面積',300,80,{size:24,color:CD});
  s+=card(640,40,520,440,L('棒： 切った 部分 → ？',900,80,{size:24,color:CD}),1);
  s+=rod({x0:700,y:220,ppm:200,n,shade:1,mids:1});
  s+=fade(seg(p,.6,.75),T(`\\sum\\ \\longrightarrow\\ \\int`,900,360,{size:54,color:CH}));
  return s;
 },

 // ===== S4 1切れの質量 dm =====
 [K+'dens']:(p)=>{
  let s=rod({x0:150,y:200,ppm:400,n:2,shade:1});
  s+=ticks(150,300,400,[[0,'0'],[1,'1'],[2,'2']]);
  s+=fade(seg(p,.35,.5),L('1.5 kg',350,160,{size:26,color:CM,weight:700})+L('1.5 kg',750,160,{size:26,color:CM,weight:700}));
  s+=card(250,370,700,110,T(`\\dfrac{M}{${col(CR,'l')}}=\\dfrac{3\\,\\mathrm{kg}}{2\\,\\mathrm{m}}=1.5\\,\\mathrm{kg/m}`,600,425,{size:38}),seg(p,.3,.45));
  s+=fade(seg(p,.05,.2),L('1 m あたりの 質量',550,80,{size:28,color:C.ink,weight:700}));
  return s;
 },
 [K+'dx']:(p)=>{
  const x=1.2,w=.12,x0=150,ppm=400,y=180;
  let s=rod({x0,y,ppm});
  s+=ticks(x0,280,ppm,[[0,'0'],[1,'1'],[2,'2']]);
  s+=fade(seg(p,.05,.2),rect(x0+ppm*x,y-17,ppm*w,34,{fill:CT,fo:.55,stroke:CT,sw:2,rx:0})+brace(x0+ppm*x,x0+ppm*(x+w),y-24,{dir:-1,color:CT,text:'dx',size:26}));
  s+=fade(seg(p,.1,.25),line(x0,y+40,x0+ppm*x,y+40,{color:CR,w:3})+label('x',x0+ppm*x/2,y+70,{size:28,color:CR,anchor:'middle',weight:700}));
  s+=card(150,340,900,150,fade(seg(p,.45,.6),T(`${col(CM,'dm')}=\\dfrac{M}{${col(CR,'l')}}\\,${DX}`,340,418,{size:46}))
   +fade(seg(p,.6,.75),label('（1 m あたり 1.5 kg）×（長さ dx）',780,425,{size:23,color:C.ink,anchor:'middle'})),seg(p,.4,.55),CT);
  return s;
 },
 [K+'dmdef']:(p)=>{
  const x=1.2,w=.12,x0=150,ppm=400,y=180;
  let s=rod({x0,y,ppm})+rect(x0+ppm*x,y-17,ppm*w,34,{fill:CT,fo:.55,stroke:CT,sw:2,rx:0});
  s+=T(`${col(CM,'dm')}`,x0+ppm*(x+w/2),y-50,{size:34});
  s+=card(200,300,800,160,L('dm ＝ 細かく 切った 1切れの 質量',600,360,{size:30,color:C.ink,weight:700})+L('（新しい 種類の 質量 ではない）',600,415,{size:26,color:CD}),seg(p,.05,.2),CH);
  return s;
 },
 [K+'piece']:(p)=>{
  const w=.12,x0=150,ppm=400,y=170,x=mix(.1,1.85,seg(p,.45,.95));
  let s=rod({x0,y,ppm})+rect(x0+ppm*x,y-17,ppm*w,34,{fill:CT,fo:.55,stroke:CT,sw:2,rx:0});
  s+=line(x0,y+40,x0+ppm*x,y+40,{color:CR,w:3})+label('x',x0+ppm*x/2,y+70,{size:26,color:CR,anchor:'middle',weight:700});
  s+=card(250,300,700,150,T(`\\text{}${X2}\\,${col(CM,'dm')}`,440,375,{size:48})+L('質量 × 距離²',760,385,{size:28,color:C.ink}),seg(p,.05,.2));
  s+=fade(seg(p,.45,.6),label('0 から l まで 足す →',x0+ppm*1,115,{size:26,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'Idef']:(p)=>{
  let s=T(`I=\\sum_i ${col(CM,'m_i')}\\,${RI2}`,600,90,{size:44,color:CD});
  s+=fade(seg(p,.05,.2),T(`I=\\int ${X2}\\,${col(CM,'dm')}`,600,215,{size:50}));
  s+=fade(seg(p,.25,.4),T(`=\\int_0^{${col(CR,'l')}} ${X2}\\,\\dfrac{M}{${col(CR,'l')}}\\,${DX}`,600,340,{size:50}));
  s+=fade(seg(p,.55,.7),card(250,410,700,90,T(`\\sum\\to\\int,\\quad ${col(CM,'m_i')}\\to${col(CM,'dm')},\\quad ${col(CR,'r_i')}\\to${XX}`,600,455,{size:38}),1,CH));
  return s;
 },

 // ===== S5 積分を計算する =====
 [K+'const']:(p)=>{
  let s=T(`I=\\int_0^{${col(CR,'l')}} ${X2}\\,{\\color{${CH}}{\\dfrac{M}{l}}}\\,${DX}`,600,110,{size:48});
  s+=fade(seg(p,.2,.35),L('M/l は 定数 → 外へ',600,215,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.35,.5),T(`={\\color{${CH}}{\\dfrac{M}{l}}}\\int_0^{${col(CR,'l')}} ${X2}\\,${DX}`,600,330,{size:52}));
  return s;
 },
 [K+'anti']:(p)=>{
  let s=card(300,90,600,150,T(`(\\ \\ ?\\ \\ )'=${X2}`,600,170,{size:54}),seg(p,0,.12),CH);
  s+=fade(seg(p,.45,.6),L('まず x³ を 積の微分で',600,320,{size:30,color:C.ink})+T(`${X3}=${XX}\\cdot${X2}`,600,400,{size:46}));
  return s;
 },
 [K+'prod']:(p)=>{
  let s=T(`(${XX}\\cdot${X2})'=1\\cdot${X2}+${XX}\\cdot2${XX}=3${X2}`,600,100,{size:44});
  s+=fade(seg(p,.35,.5),L('3 で 割る',600,200,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.45,.6),T(`\\left(\\dfrac{${X3}}{3}\\right)'=${X2}`,600,350,{size:54})+highlight(430,265,340,160,1));
  return s;
 },
 [K+'eval']:(p)=>{
  let s=T(`\\int_0^{${col(CR,'l')}} ${X2}\\,${DX}=\\left[\\dfrac{${X3}}{3}\\right]_0^{${col(CR,'l')}}`,600,110,{size:48});
  s+=fade(seg(p,.35,.5),T(`=\\dfrac{${col(CR,'l^3')}}{3}-\\dfrac{0^3}{3}`,600,250,{size:48}));
  s+=fade(seg(p,.6,.75),T(`=\\dfrac{${col(CR,'l^3')}}{3}`,600,380,{size:52}));
  s+=fade(seg(p,.2,.35),L('上端での 値 − 下端での 値',1000,250,{size:24,color:CD}));
  return s;
 },
 [K+'result']:(p)=>{
  let s=T(`I=\\dfrac{M}{${col(CR,'l')}}\\times\\dfrac{${col(CR,'l^3')}}{3}`,600,85,{size:44});
  s+=fade(seg(p,.3,.45),T(`=\\dfrac{M\\,${col(CR,'l^3')}}{3\\,${col(CR,'l')}}`,600,225,{size:44})+L('l³ ÷ l ＝ l²',880,235,{size:26,color:CH,weight:700}));
  s+=fade(seg(p,.55,.7),T(`=\\dfrac{M${col(CR,'l^2')}}{3}`,600,375,{size:52})+highlight(460,285,280,170,1));
  return s;
 },
 [K+'plug']:(p)=>{
  let s=T(`I=\\dfrac{3\\times${col(CR,'2')}^2}{3}=4${KGM2}`,600,90,{size:48});
  s+=bars([[.1375,'4本','3.94'],[.184,'8本','3.98'],[.2,'積分','4',seg(p,.35,.55),CH,.3]],{x:260,y:470,sc:1300,w:140,gap:260});
  s+=label('（3.8 より 上を 拡大）',1180,450,{size:22,color:CD,anchor:'end'});
  s+=fade(seg(p,.55,.7),ok(1080,110));
  return s;
 },
 [K+'compare']:(p)=>{
  let s=rod({x0:120,y:100,ppm:180,l:2,g:1})+L('一様な 棒',300,60,{size:24,color:CD});
  s+=fade(seg(p,.05,.2),line(620,100,980,100,{color:WOOD,w:5})+ring(980,100,24,{color:C.ink,w:3,fill:'#2a3550'})+label('3 kg',980,107,{size:17,color:C.ink,anchor:'middle',weight:700})+axisMark(620,100)+L('全部 先端に',800,60,{size:24,color:CD}));
  s+=bars([[4,'一様な 棒','4'],[12,'全部 先端','12',seg(p,.05,.25)]],{x:330,y:480,sc:24,w:150,gap:420});
  s+=fade(seg(p,.55,.7),L('3分の1',600,300,{size:34,color:CH,weight:700})+arrow(560,315,500,370,{color:CH,w:4,head:14}));
  return s;
 },
 [K+'quiz']:(p)=>{
  const ang=.8*seg(p,.1,1);
  let s=rod({x0:200,y:260,ppm:200,ax:1,ang});
  s+=fade(seg(p,.1,.25),turnArc(400,260,60,.3,1.9,{color:CW}));
  s+=card(720,70,440,120,L('真ん中を 軸に すると',940,120,{size:28})+L('I は？',940,165,{size:34,color:CH,weight:700}),seg(p,.05,.2),CH);
  s+=fade(seg(p,.6,.75),card(720,230,440,100,L('ヒント： 半分の 棒 2本',940,290,{size:28,color:CT,weight:700}),1,CT));
  return s;
 },
 [K+'quizA']:(p)=>{
  let s=rod({x0:150,y:150,ppm:250,ax:1,n:2,shade:1});
  s+=fade(seg(p,.05,.2),L('1.5 kg・1 m',275,110,{size:22,color:CM})+L('1.5 kg・1 m',525,110,{size:22,color:CM})+L('端が 軸',400,215,{size:22,color:CD}));
  s+=fade(seg(p,.3,.45),T(`\\text{}1.5\\times${col(CR,'1')}^2\\div3=0.5`,900,110,{size:38}));
  s+=fade(seg(p,.55,.7),T(`0.5\\times2=1${KGM2}`,900,210,{size:42})+highlight(715,160,370,100,1));
  s+=fade(seg(p,.55,.7),bars([[4,'端の 軸','4'],[1,'真ん中の 軸','1',1,CH]],{x:250,y:470,sc:40,w:130,gap:300}));
  return s;
 },
 [K+'quizB']:(p)=>{
  let s=bars([[4,'端の 軸','4 kg·m²'],[1,'真ん中の 軸','1 kg·m²',1,CH]],{x:250,y:450,sc:70,w:150,gap:360});
  s+=fade(seg(p,.05,.2),L('4分の1',560,200,{size:36,color:CH,weight:700}));
  s+=fade(seg(p,.45,.6),card(760,120,400,130,L('軸を 変えると',960,175,{size:28})+L('I も 変わる',960,225,{size:32,color:CH,weight:700}),1,CH));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>card(60,60,520,400,L('Σ の 読み方',320,115,{size:30,color:CH,weight:700})+T(`I=\\sum_i ${col(CM,'m_i')}\\,${RI2}`,320,210,{size:44})
   +L('質量 × 軸からの 垂直な 距離²',320,290,{size:24})+L('を 全部 足す',320,330,{size:24})+fade(seg(p,.55,.7),L('軸を 変えると I も 変わる',320,400,{size:26,color:CH,weight:700})),seg(p,.05,.2),CH),
 [K+'sum2']:(p)=>{
  let s=card(60,60,520,400,L('Σ の 読み方',320,115,{size:30,color:CH,weight:700})+T(`I=\\sum_i ${col(CM,'m_i')}\\,${RI2}`,320,210,{size:44})
   +L('質量 × 軸からの 垂直な 距離²',320,290,{size:24})+L('を 全部 足す',320,330,{size:24})+L('軸を 変えると I も 変わる',320,400,{size:26,color:CH,weight:700}),1,CH);
  s+=card(620,60,520,400,L('切れ目の ない 物体',880,115,{size:30,color:CT,weight:700})
   +T(`I=\\int ${col(CR,'r^2')}\\,${col(CM,'dm')}`,880,210,{size:44})
   +fade(seg(p,.45,.6),L('一様な 棒・端の 軸',880,300,{size:24})+T(`I=\\dfrac{M${col(CR,'l^2')}}{3}`,880,380,{size:44})),seg(p,.05,.2),CT);
  return s;
 },
 [K+'next']:(p)=>{
  const ang=.3+.9*seg(p,.1,1);
  let s=rod({x0:250,y:360,ppm:130,l:2,ang});
  s+=turnArc(250,360,70,.2,1.8,{color:CW});
  s+=card(720,120,440,160,L('回しにくさ I を',940,185,{size:30})+L('計算で 求められる',940,240,{size:30,color:CH,weight:700}),seg(p,.1,.25),CH);
  return s;
 },
 [K+'next2']:(p)=>{
  const ang=.2+.8*seg(p,.1,1)**2;
  let s=rod({x0:250,y:380,ppm:130,l:2,ang});
  const ex=250+260*Math.cos(ang),ey=380-260*Math.sin(ang),ux=-Math.sin(ang),uy=-Math.cos(ang);
  s+=arrow(ex,ey,ex+ux*90,ey+uy*90,{color:C.F,w:6,head:16})+label('力',ex+ux*90+10,ey+uy*90-8,{size:24,color:C.F,weight:700});
  s+=turnArc(250,380,70,.2,1.8,{color:CW})+label('トルク',250,490,{size:24,color:CW,anchor:'middle',weight:700});
  s+=card(720,110,440,200,L('トルクを 加えると',940,170,{size:28})+L('ω は どれだけの',940,225,{size:30,color:CW,weight:700})+L('割合で 変わる？',940,275,{size:30,color:CH,weight:700}),seg(p,.1,.25),CH);
  return s;
 },
};
