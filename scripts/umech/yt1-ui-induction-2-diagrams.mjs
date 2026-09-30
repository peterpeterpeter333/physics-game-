// YouTube シリーズ「電磁誘導・初級 2/2」(ys-ui-induction-2) — 図。Stage 1200×515.
// 色：元の磁場 𝐁 橙(C.E)、誘導の磁場 赤、電流 I 青、誘導の電場 𝐄 水色(C.x)、磁束 Φ 黄(C.hi)、時間 t 金(C.t)、起電力 ℰ 緑(C.F)、法線 桃(C.p)。
// 真上から見た図：上向き＝手前（⊙）。画面上の回り方 cw（時計回り）/ccw（反時計回り）は、上から見た回り方そのもの。
// 向き（検算済み）：⊙ の磁束が増える → 誘導の磁場 ⊗ → 電流 cw。⊙ が減る → 誘導 ⊙ → ccw。⊗ が増える（S 極を下から）→ 誘導 ⊙ → ccw。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,poly} from './anim.mjs';

const K='ui-induction-2:';
const BC=C.E,IND='#ff6b6b',CI='#6f9dff',CE=C.x,HI=C.hi,EMF=C.F,NC=C.p,SURF='#c9d6ee',NEG=C.a;
const rad=d=>d*Math.PI/180;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const n2=v=>Number(v.toFixed(2));
const vE=cs(CE,'\\mathbf{E}'),EM=cs(EMF,'\\mathcal{E}');
function arcPts(cx,cy,rx,ry,a0,a1,n=40){return Array.from({length:n+1},(_,i)=>{const a=rad(a0+(a1-a0)*i/n);return [cx+rx*Math.cos(a),cy-ry*Math.sin(a)];});}
function head(x,y,dx,dy,{color=CI,L=18}={}){
 const m=Math.hypot(dx,dy)||1,ux=dx/m,uy=dy/m,bx=x-L*ux,by=y-L*uy;
 return `<polygon points="${n2(x)},${n2(y)} ${n2(bx-L*.5*uy)},${n2(by+L*.5*ux)} ${n2(bx+L*.5*uy)},${n2(by-L*.5*ux)}" fill="${color}"/>`;
}
function outSym(x,y,r=16,color=BC,g=1){return fade(g,ring(x,y,r,{color,w:3.5,fill:'#101a30'})+dot(x,y,r*.3,color));}
function inSym(x,y,r=16,color=BC,g=1){const d=r*.6;return fade(g,ring(x,y,r,{color,w:3.5,fill:'#101a30'})+line(x-d,y-d,x+d,y+d,{color,w:3.5})+line(x-d,y+d,x+d,y-d,{color,w:3.5}));}
const sym=(kind,x,y,r,color,g=1)=>kind==='out'?outSym(x,y,r,color,g):inSym(x,y,r,color,g);

// ---- side view: coil (edge-on), bar magnet below, optional galvanometer -----------------------------
// u: 0 far … 1 near. pole: which pole faces the coil. needle: −1 … 1. meter: show the meter + wires.
function sideRig({cx=300,cy=200,rx=130,ry=30,u=.5,pole='N',needle=0,meter=true,g=1,ind=null,indG=0,move=0,moveG=0,arrowsG=1}={}){
 let s='';
 const my=mix(385,cy+72,u),up=pole==='N'?1:-1,k=mix(.35,1,u);
 s+=draw(arcPts(cx,cy,rx,ry,0,180),1,{color:CI,w:5,opacity:.6});
 [-90,-45,0,45,90].forEach((dx,i)=>{const on=(i===0||i===4)?seg(u,.35,.8):1,L=mix(60,130,u),x0=cx+dx,xt=cx+dx*(1-.12*u),y0=my-16,y1=my-16-L-(my-cy)*.5;
  s+=fade(on*k*arrowsG,up>0?arrow(x0,y0,xt,y1,{color:BC,w:4,head:14}):arrow(xt,y1,x0,y0,{color:BC,w:4,head:14}));});
 s+=draw(arcPts(cx,cy,rx,ry,180,360),1,{color:CI,w:6});
 if(ind&&indG>0){const d=ind==='down'?1:-1;s+=fade(indG,arrow(cx,cy-d*55,cx,cy+d*55,{color:IND,w:8,head:22})+label('誘導の磁場',cx-rx-12,cy-40,{size:22,color:IND,anchor:'end',weight:700}));}
 const top=pole==='N'?['N','#e05252']:['S','#4f7fe0'],bot=pole==='N'?['S','#4f7fe0']:['N','#e05252'];
 s+=rect(cx-32,my,64,56,{fill:top[1],fo:.9,stroke:top[1],rx:4})+label(top[0],cx,my+39,{size:28,color:C.bg,anchor:'middle',weight:700});
 s+=rect(cx-32,my+56,64,56,{fill:bot[1],fo:.9,stroke:bot[1],rx:4})+label(bot[0],cx,my+95,{size:28,color:C.bg,anchor:'middle',weight:700});
 if(moveG>0&&move)s+=fade(moveG,move>0?arrow(cx+62,my+80,cx+62,my+10,{color:C.ink,w:4,head:14})+label('近づける',cx+74,my+50,{size:22,color:C.ink}):arrow(cx+62,my+10,cx+62,my+80,{color:C.ink,w:4,head:14})+label('遠ざける',cx+74,my+50,{size:22,color:C.ink}));
 if(meter){
  const mx=cx+280,myy=110,R=52;
  s+=draw([[cx-rx,cy],[cx-rx-20,cy],[cx-rx-20,40],[mx,40],[mx,myy-R]],1,{color:CI,w:3});
  s+=draw([[cx+rx,cy],[mx,cy],[mx,myy+R]],1,{color:CI,w:3});
  s+=ring(mx,myy,R,{color:SURF,w:3,fill:'#172238'});
  for(const t of [-1,-.5,0,.5,1]){const a=rad(90-50*t);s+=line(mx+(R-8)*Math.cos(a),myy+20-(R-8)*Math.sin(a)+0,mx+(R-16)*Math.cos(a),myy+20-(R-16)*Math.sin(a),{color:C.dim,w:2});}
  const a=rad(90-50*clamp(needle,-1,1));s+=line(mx,myy+20,mx+(R-10)*Math.cos(a),myy+20-(R-10)*Math.sin(a),{color:C.hi,w:4})+dot(mx,myy+20,5,C.hi);
  s+=label('電流計',mx+R+10,myy+8,{size:22,color:C.dim});
 }
 return fade(g,s);
}

// ---- top view of the loop ---------------------------------------------------------------------------
// orig: 'out'|'in' symbols of the original field (count grows with origN 0..1); ind: big red symbol at the centre.
// cur: +1 = clockwise, −1 = counter-clockwise (as seen on screen = from above).
const TP=[[0,0],[-50,-45],[50,-45],[-50,45],[50,45],[0,-80],[0,80],[-85,0],[85,0]];
function topLoop(cx,cy,R,{orig=null,origN=1,origG=1,ind=null,indG=0,cur=0,curG=0,gap=false,resistor=false,g=1}={}){
 let s='';
 if(gap){s+=draw(arcPts(cx,cy,R,R,-80,260,80),1,{color:CI,w:6});}
 else if(resistor){s+=draw(arcPts(cx,cy,R,R,-70,250,80),1,{color:CI,w:6});
  const y=cy+R-4,x0=cx-R*Math.cos(rad(70)),x1=cx+R*Math.cos(rad(70)),zz=[[x0,y+7]];const n=8;for(let i=1;i<n;i++)zz.push([mix(x0+14,x1-14,(i-1)/(n-2)),y+7+(i%2?-14:14)]);zz.push([x1,y+7]);
  s+=draw([[x0,cy+R*Math.sin(rad(70))],[x0,y+7]],1,{color:CI,w:6})+draw([[x1,cy+R*Math.sin(rad(70))],[x1,y+7]],1,{color:CI,w:6})+draw(zz,1,{color:SURF,w:5})+label('4 Ω',cx,y+50,{size:26,color:SURF,anchor:'middle',weight:700});}
 else s+=ring(cx,cy,R,{color:CI,w:6});
 if(orig){const n=Math.round(mix(3,TP.length,clamp(origN)));TP.slice(0,n).forEach(([dx,dy],i)=>{if(ind&&indG>0&&i===0)return;s+=sym(orig,cx+dx*R/130,cy+dy*R/130,14,BC,origG);});}
 if(ind&&indG>0)s+=sym(ind,cx,cy,30,IND,indG);
 if(cur&&curG>0){let h='';for(const d of [45,135,225,315]){const t=rad(d),x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);h+=head(x,y,Math.sin(t)*cur,Math.cos(t)*cur,{color:CI,L:24});}s+=fade(curG,h);}
 return fade(g,s);
}
function curLabel(cx,cy,R,cur,g=1){return fade(g,label(cur>0?'時計回り':'反時計回り',cx,cy+R+44,{size:28,color:CI,anchor:'middle',weight:700}));}
const SD={cx:260,cy:230};const TV={cx:880,cy:250,R:120};
function titles(){return label('横から見た図',60,52,{size:22,color:C.dim})+label('真上から見た図',TV.cx,52,{size:22,color:C.dim,anchor:'middle'});}

// ---- Φ–t panels -------------------------------------------------------------------------------------
function panel(x,y,w,h,{kind='ramp',g=1,draw_=1,slope=0,title=''}={}){
 // data: t 0..0.15 s, Φ 0..1.1 Wb (flat) or 0..0.35 (ramp). y = baseline.
 let s=arrow(x-6,y,x+w+20,y,{color:C.dim,w:2.5,head:12})+arrow(x,y+6,x,y-h-24,{color:C.dim,w:2.5,head:12});
 s+=label('t［s］',x+w+22,y+30,{size:21,color:C.t,anchor:'middle'})+label('Φ［Wb］',x,y-h-34,{size:21,color:HI,anchor:'middle'});
 const X=t=>x+w*t/.15;
 s+=line(X(.1),y-5,X(.1),y+5,{color:C.dim})+label('0.1',X(.1),y+28,{size:21,color:C.t,anchor:'middle'});
 if(kind==='flat'){const Y=f=>y-h*f/1.1;s+=label('1',x-10,Y(1)+7,{size:21,color:HI,anchor:'end'});
  s+=draw([[X(0),Y(1)],[X(.15),Y(1)]],draw_,{color:HI,w:5});
  if(slope)s+=fade(slope,label('傾き 0',X(.075),Y(1)-18,{size:24,color:EMF,anchor:'middle',weight:700}));}
 else {const Y=f=>y-h*f/.35;s+=label('0.1',x-10,Y(.1)+7,{size:21,color:HI,anchor:'end'})+label('0.3',x-10,Y(.3)+7,{size:21,color:HI,anchor:'end'});
  s+=line(x,Y(.3),X(.1),Y(.3),{color:C.grid,w:1.5})+line(X(.1),Y(.3),X(.1),y,{color:C.grid,w:1.5});
  s+=draw([[X(0),Y(.1)],[X(.1),Y(.3)],[X(.15),Y(.3)]],draw_,{color:HI,w:5});
  if(slope)s+=fade(slope,line(X(0),Y(.1),X(.1),Y(.1),{color:C.t,w:4})+line(X(.1),Y(.1),X(.1),Y(.3),{color:HI,w:4})
   +label('0.1 s',X(.05),Y(.1)+26,{size:21,color:C.t,anchor:'middle'})+label('0.2 Wb',X(.1)+8,Y(.2)+8,{size:21,color:HI}));}
 if(title)s+=label(title,x+w/2,y-h-70,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}

// ---- odometer / speedometer -------------------------------------------------------------------------
function speedo(cx,cy,r,v,{g=1}={}){
 const MAX=100,ang=q=>(210-240*clamp(q/MAX))*Math.PI/180,P=(q,rr)=>[cx+rr*Math.cos(ang(q)),cy-rr*Math.sin(ang(q))];
 let s=ring(cx,cy,r+12,{color:C.faint,w:3,fill:'#10182c'})+draw(Array.from({length:61},(_,i)=>P(i*100/60,r)),1,{color:C.dim,w:4});
 for(let q=0;q<=MAX;q+=50){const [lx,ly]=P(q,r-34);s+=label(String(q),lx,ly+8,{size:21,color:C.dim,anchor:'middle'});}
 const [nx,ny]=P(v,r-18);s+=line(cx,cy,nx,ny,{color:C.a,w:5})+dot(cx,cy,8,C.a)+label('km/h',cx,cy+72,{size:21,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
function odo(cx,cy,txt,{g=1}={}){return fade(g,rect(cx-110,cy-32,220,64,{fill:'#0d1526',fo:1,stroke:SURF,sw:2,rx:8})+label(txt,cx,cy+11,{size:32,color:C.ink,anchor:'middle',weight:700}));}

// ---- loop with a charge going round ----------------------------------------------------------------
function chargeOn(cx,cy,R,angDeg){const t=rad(angDeg),x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);return ring(x,y,15,{color:C.a,w:3,fill:'#3a1d2a'})+label('＋',x,y+6,{size:18,color:C.a,anchor:'middle',weight:700});}
function circE(cx,cy,R,cur=1,g=1){let s='';for(let d=0;d<360;d+=45){const t=rad(d+22.5),x=cx+(R+26)*Math.cos(t),y=cy-(R+26)*Math.sin(t),dx=Math.sin(t)*cur*26,dy=Math.cos(t)*cur*26;s+=arrow(x-dx,y-dy,x+dx,y+dy,{color:CE,w:4,head:12});}return fade(g,s);}

export const ytUiInduction2Diagrams={
 // ===== S1 前回の問い =====
 [K+'Q']:(p)=>{
  let s=label('前回の 最後の問い',60,52,{size:22,color:C.dim});
  s+=sideRig({u:mix(.2,.8,seg(p,.1,.6)),meter:false,g:seg(p,0,.15)});
  s+=card(640,110,520,260,label('磁束が 変わると',900,170,{size:30,color:C.ink,anchor:'middle'})+label('コイルに 何が 起こる？',900,230,{size:34,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('その向きは いつも 元の磁場と 逆？',900,310,{size:26,color:IND,anchor:'middle'})),seg(p,.1,.25),HI);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=label('前回：磁束',600,90,{size:30,color:C.dim,anchor:'middle'});
  s+=T(`\\Phi=${cs(HI,'B_{\\perp}')}\\,A`,600,200,{size:70});
  s+=fade(seg(p,.5,.65),T(`1\\,\\mathrm{Wb}=1\\,\\mathrm{T\\cdot m^2}`,600,340,{size:52,color:HI}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s='';const it=[['① 変化が 生むもの',EMF],['② その 向き',IND],['③ 電流が 流れる 条件',CI]];
  it.forEach(([t,c],i)=>{s+=card(90+i*350,170,320,160,label(t,250+i*350,262,{size:30,color:c,anchor:'middle',weight:700}),seg(p,.1+i*.2,.25+i*.2),c);});
  return s;
 },
 // ===== S2 変化が起電力を生む =====
 [K+'setup']:(p)=>{
  let s=sideRig({u:0,g:seg(p,0,.2),arrowsG:0});
  s+=card(760,150,400,200,label('電流計',960,210,{size:32,color:C.ink,anchor:'middle',weight:700})+label('針の 振れ ＝',960,265,{size:26,color:C.dim,anchor:'middle'})+label('電流の 向きと 大きさ',960,310,{size:28,color:CI,anchor:'middle'}),seg(p,.45,.6));
  return s;
 },
 [K+'still']:(p)=>{
  let s=sideRig({u:mix(0,1,seg(p,.05,.3)),needle:0});
  s+=fade(seg(p,.35,.5),label('止めておく',SD.cx+80,460,{size:24,color:C.ink}));
  s+=card(760,150,400,210,label('磁束：大きい',960,215,{size:30,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('針：0 のまま',960,290,{size:32,color:C.ink,anchor:'middle',weight:700})),seg(p,.4,.55));
  return s;
 },
 [K+'move']:(p)=>{
  // slow approach, fast approach, withdraw
  let u,nd,mv;
  if(p<.3){u=mix(0,.5,seg(p,.04,.28));nd=p>.04&&p<.28?.3:0;mv=1;}
  else if(p<.5){u=mix(.5,1,seg(p,.32,.42));nd=p>.32&&p<.42?.9:0;mv=1;}
  else {u=mix(1,0,seg(p,.6,.85));nd=p>.6&&p<.85?-.5:0;mv=-1;}
  let s=sideRig({u,needle:nd,move:mv,moveG:1});
  s+=card(760,120,400,280,fade(seg(p,.05,.15),label('ゆっくり 近づける → 小さく 振れる',960,180,{size:22,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.32,.4),label('速く 近づける → 大きく 振れる',960,240,{size:22,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.5),label('止めると → 0',960,300,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.6,.7),label('遠ざける → 反対に 振れる',960,360,{size:22,color:C.ink,anchor:'middle'})),1);
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(80,110,480,200,label('✕ 磁束の 大きさ',320,190,{size:32,color:C.dim,anchor:'middle'})+label('○ 磁束が 変わる 速さ',320,260,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(640,110,500,300,label('実験で 分かったこと',890,165,{size:26,color:C.dim,anchor:'middle'})
   +label('起電力の 大きさ',890,230,{size:30,color:EMF,anchor:'middle',weight:700})+label('＝',890,275,{size:30,color:C.ink,anchor:'middle'})
   +label('磁束の 変化率',890,325,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.5,.65),EMF);
  return s;
 },
 [K+'emfword']:(p)=>{
  // battery-like pump in a loop
  let s=draw([[140,150],[440,150],[440,400],[140,400],[140,150]],1,{color:CI,w:5});
  s+=rect(250,370,80,60,{fill:'#172238',fo:1,stroke:EMF,sw:3,rx:6})+label('起電力',290,470,{size:26,color:EMF,anchor:'middle',weight:700});
  s+=line(275,385,275,415,{color:EMF,w:4})+line(300,392,300,408,{color:EMF,w:6});
  for(const [x,y,dx,dy] of [[440,275,0,-1],[290,150,-1,0],[140,275,0,1]])s+=fade(seg(p,.2,.35),head(x,y,dx,dy,{color:CI,L:22}));
  s+=card(600,120,540,260,label('電池のように',870,180,{size:28,color:C.ink,anchor:'middle'})+label('電流を 送り出す はたらき',870,235,{size:32,color:EMF,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('ファラデーの 電磁誘導の法則',870,320,{size:30,color:HI,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'graph']:(p)=>{
  const x=110,y=440,w=520,h=320,X=t=>x+w*t/3,Y=f=>y-h*f/1.2;
  const f=t=>t<1?.2:t<2?.2+.8*(t-1):1;
  let s=arrow(x-8,y,x+w+26,y,{color:C.dim,w:2.5,head:14})+arrow(x,y+8,x,y-h-28,{color:C.dim,w:2.5,head:14});
  s+=label('時刻 t',x+w+30,y+34,{size:24,color:C.t,anchor:'middle'})+label('磁束 Φ',x,y-h-40,{size:24,color:HI,anchor:'middle'});
  s+=draw(Array.from({length:91},(_,i)=>{const t=3*i/90;return [X(t),Y(f(t))];}),seg(p,.02,.3),{color:HI,w:5});
  s+=fade(seg(p,.35,.5),line(X(1.1),Y(f(1.1)),X(1.9),Y(f(1.1)),{color:C.t,w:3})+line(X(1.9),Y(f(1.1)),X(1.9),Y(f(1.9)),{color:HI,w:3})+label('傾き',X(1.9)+10,Y(.6),{size:24,color:EMF,weight:700}));
  s+=card(720,140,440,220,T(`\\text{変化率}=\\dfrac{d\\Phi}{dt}`,940,230,{size:44})+label('＝ グラフの 傾き',940,320,{size:28,color:EMF,anchor:'middle',weight:700}),seg(p,.5,.65),EMF);
  return s;
 },
 [K+'meter']:(p)=>{
  let s=odo(250,150,'50000 km',{g:seg(p,.05,.2)})+label('距離計',250,95,{size:26,color:C.dim,anchor:'middle'});
  s+=speedo(250,370,90,40,{g:seg(p,.2,.35)});
  s+=fade(seg(p,.4,.55),arrow(400,150,560,150,{color:C.dim,w:3,head:14})+label('Φ',600,162,{size:40,color:HI,weight:700})+label('（磁束の 値）',650,162,{size:26,color:C.dim}));
  s+=fade(seg(p,.6,.75),arrow(400,370,560,370,{color:C.dim,w:3,head:14})+T(`\\dfrac{d\\Phi}{dt}`,620,380,{size:44,color:EMF})+label('（傾き）',680,382,{size:26,color:C.dim}));
  return s;
 },
 [K+'parked']:(p)=>{
  let s=odo(250,150,'50000 km')+label('距離計',250,95,{size:26,color:C.dim,anchor:'middle'})+speedo(250,370,90,0);
  s+=fade(seg(p,.05,.2),label('止まった車',250,490,{size:24,color:C.ink,anchor:'middle'}));
  s+=panel(640,380,300,200,{kind:'flat',g:seg(p,.45,.6),slope:seg(p,.6,.75)});
  s+=card(990,190,190,170,label('大きいが',1085,240,{size:24,color:C.ink,anchor:'middle'})+label('一定',1085,280,{size:28,color:HI,anchor:'middle',weight:700})+T(`${EM}=0`,1085,330,{size:34}),seg(p,.7,.85),EMF);
  return s;
 },
 [K+'notmap']:(p)=>{
  let s=card(60,110,500,260,label('距離計',310,165,{size:28,color:C.dim,anchor:'middle'})+label('値は 減らない',310,225,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('（対応しない 所）',310,280,{size:24,color:C.a,anchor:'middle'}),seg(p,.02,.18));
  const x=660,y=400,w=380,h=240,X=t=>x+w*t,Y=f=>y-h*f;
  s+=fade(seg(p,.35,.5),arrow(x-6,y,x+w+20,y,{color:C.dim,w:2.5,head:12})+arrow(x,y+6,x,y-h-24,{color:C.dim,w:2.5,head:12})+label('Φ',x,y-h-34,{size:24,color:HI,anchor:'middle'})+label('t',x+w+24,y+28,{size:24,color:C.t})
   +draw([[X(0),Y(.8)],[X(.3),Y(.8)],[X(.7),Y(.2)],[X(1),Y(.2)]],1,{color:HI,w:5})+label('減る → 傾きが 負',X(.5)+20,Y(.55),{size:24,color:NEG,weight:700}));
  s+=fade(seg(p,.65,.8),label('針は 反対に 振れる',310,330,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'compare']:(p)=>{
  let s=panel(110,390,360,220,{kind:'flat',g:seg(p,.05,.2),draw_:seg(p,.1,.3),title:'1 Wb で 一定'});
  s+=panel(690,390,360,220,{kind:'ramp',g:seg(p,.35,.5),draw_:seg(p,.4,.7),title:'0.1 s で 0.1 → 0.3 Wb'});
  return s;
 },
 [K+'calc']:(p)=>{
  let s=panel(110,390,360,220,{kind:'flat',slope:seg(p,.05,.2),title:'1 Wb で 一定'});
  s+=fade(seg(p,.15,.3),T(`${EM}=0`,290,465,{size:36}));
  s+=panel(690,390,360,220,{kind:'ramp',slope:seg(p,.35,.5),title:'0.1 s で 0.1 → 0.3 Wb'});
  s+=fade(seg(p,.55,.7),T(`\\dfrac{0.2\\,\\mathrm{Wb}}{0.1\\,\\mathrm{s}}=${cs(EMF,'2\\,\\mathrm{Wb/s}')}`,870,462,{size:34}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=label('単位を 確かめる',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=T(`\\mathrm{Wb/s}=\\mathrm{T\\cdot m^2/s}`,600,160,{size:50});
  s+=fade(seg(p,.4,.55),T(`\\mathrm{T}=\\mathrm{N/(A\\cdot m)}`,600,260,{size:44,color:BC})+label('ローレンツ力の回',900,268,{size:22,color:C.dim}));
  s+=fade(seg(p,.7,.85),T(`\\mathrm{T\\cdot m^2/s}=\\dfrac{\\mathrm{N\\cdot m}}{\\mathrm{A\\cdot s}}`,600,390,{size:48}));
  return s;
 },
 [K+'unit2']:(p)=>{
  let s=T(`\\dfrac{\\mathrm{N\\cdot m}}{\\mathrm{A\\cdot s}}`,300,200,{size:60});
  s+=fade(seg(p,.05,.2),label('N·m ＝ J（仕事）',640,160,{size:30,color:C.E}))+fade(seg(p,.25,.4),label('A·s ＝ C（電荷）',640,240,{size:30,color:C.p}));
  s+=fade(seg(p,.5,.65),T(`=\\mathrm{J/C}=\\mathrm{V}`,600,340,{size:56,color:EMF}));
  s+=fade(seg(p,.75,.9),card(380,390,440,90,T(`${EM}=2\\,\\mathrm{V}`,600,445,{size:46}),1,EMF));
  return s;
 },
 // ===== S3 起電力とは =====
 [K+'def']:(p)=>{
  const cx=300,cy=270,R=150,laps=2*seg(p,.2,.9);
  let s=ring(cx,cy,R,{color:CI,w:6})+chargeOn(cx,cy,R,90-360*laps);
  s+=label('1 C',cx,cy-R-24,{size:24,color:C.a,anchor:'middle'});
  s+=card(640,110,520,300,label('1 C が 回路を 1周する間に',900,170,{size:28,color:C.ink,anchor:'middle'})+label('受け取る エネルギー',900,225,{size:32,color:EMF,anchor:'middle',weight:700})
   +fade(seg(p,.5,.6),label(`1周：2 J`,900,300,{size:30,color:C.E,anchor:'middle'}))+fade(seg(p,.85,.95),label(`2周：4 J`,900,355,{size:30,color:C.E,anchor:'middle'})),seg(p,.02,.15),EMF);
  return s;
 },
 [K+'notforce']:(p)=>{
  let s=card(80,120,480,260,label('✕ N（力）',320,200,{size:36,color:NEG,anchor:'middle'})+label('○ J/C ＝ V',320,290,{size:40,color:EMF,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(640,120,480,260,label('1 C あたりの エネルギー',880,195,{size:28,color:C.ink,anchor:'middle'})+label('記号',820,290,{size:28,color:C.dim,anchor:'middle'})+T(EM,920,300,{size:70}),seg(p,.5,.65),EMF);
  return s;
 },
 [K+'static']:(p)=>{
  const cx=300,cy=270,R=140,a=90-360*seg(p,.3,.85);
  let s=label('止まった 電荷の 電場（電位の回）',60,52,{size:22,color:C.dim});
  for(const y of [130,200,270,340,410])for(let x=90;x<540;x+=110)s+=arrow(x,y,x+54,y,{color:CE,w:3,head:11,opacity:.55});
  s+=ring(cx,cy,R,{color:SURF,w:4})+chargeOn(cx,cy,R,a);
  s+=fade(seg(p,.35,.5),label('上：押される',cx+R+12,cy-R+10,{size:22,color:CE})+label('下：逆らう',cx+R+12,cy+R,{size:22,color:NEG}));
  s+=card(680,150,460,210,label('1周して 元の点へ',910,210,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.85,.95),label('電位差 0・仕事の合計 0',910,285,{size:30,color:HI,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'induced']:(p)=>{
  const cx=300,cy=270,R=140,laps=seg(p,.4,.95),a=90-360*1.5*laps;
  let s=label('真上から見た図：⊙ の磁束が 増えている間',60,52,{size:22,color:C.dim});
  s+=ring(cx,cy,R,{color:SURF,w:4});
  for(const [dx,dy] of [[0,0],[-50,-45],[50,-45],[-50,45],[50,45]])s+=outSym(cx+dx,cy+dy,12,BC);
  s+=circE(cx,cy,R,1,seg(p,.05,.3));
  s+=fade(seg(p,.15,.3),label('𝐄',cx+R+50,cy-R+30,{size:30,color:CE,weight:700}));
  s+=fade(seg(p,.4,.45),chargeOn(cx,cy,R,a));
  s+=card(680,120,460,280,label('輪に沿って 回る 電場',910,180,{size:28,color:CE,anchor:'middle',weight:700})
   +fade(seg(p,.55,.65),label('1周ごとに',910,250,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.7),label('＋2 J/C',910,310,{size:36,color:EMF,anchor:'middle',weight:700}))
   +fade(seg(p,.85,.95),label('2周で ＋4 J/C',910,365,{size:26,color:C.ink,anchor:'middle'})),seg(p,.1,.25),CE);
  return s;
 },
 [K+'contrast']:(p)=>{
  let s=card(60,110,520,300,label('電位差',320,170,{size:32,color:HI,anchor:'middle',weight:700})+label('1周すると',320,240,{size:28,color:C.ink,anchor:'middle'})+label('0 に 戻る',320,300,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(620,110,520,300,label('起電力 ℰ',880,170,{size:32,color:EMF,anchor:'middle',weight:700})+label('回るたびに',880,240,{size:28,color:C.ink,anchor:'middle'})+label('押し続けられる',880,300,{size:34,color:EMF,anchor:'middle',weight:700}),seg(p,.3,.45),EMF);
  return s;
 },
 // ===== S4 向き =====
 [K+'pos']:(p)=>{
  const u=mix(.2,.9,seg(p,.3,.8));
  let s=titles()+sideRig({...SD,u,meter:false,move:1,moveG:seg(p,.25,.35)});
  s+=topLoop(TV.cx,TV.cy,TV.R,{orig:'out',origN:seg(p,.3,.8),origG:seg(p,.55,.7)});
  s+=fade(seg(p,.7,.85),label('磁束が 増える',TV.cx,TV.cy+TV.R+50,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'top']:(p)=>{
  let s=titles()+sideRig({...SD,u:.9,meter:false});
  s+=fade(seg(p,.05,.2),arrow(470,120,640,120,{color:C.dim,w:3,head:12})+label('上から 見る',555,100,{size:22,color:C.dim,anchor:'middle'}));
  s+=topLoop(TV.cx,TV.cy,TV.R,{orig:'out'});
  s+=fade(seg(p,.4,.55),card(700,420,360,70,label('上向き ＝ 手前向き（⊙）',880,465,{size:26,color:BC,anchor:'middle',weight:700}),1,BC));
  return s;
 },
 [K+'lenz']:(p)=>{
  let s=titles()+sideRig({...SD,u:.9,meter:false})+topLoop(TV.cx,TV.cy,TV.R,{orig:'out'});
  s+=card(420,390,520,110,label('レンツの法則（実験）',680,430,{size:24,color:C.dim,anchor:'middle'})+label('誘導の磁場は 磁束の「変化」を 妨げる',680,475,{size:26,color:IND,anchor:'middle',weight:700}),seg(p,.1,.3),IND);
  return s;
 },
 [K+'inc']:(p)=>{
  let s=titles()+sideRig({...SD,u:.9,meter:false,ind:'down',indG:seg(p,.45,.6),move:1,moveG:1});
  s+=topLoop(TV.cx,TV.cy,TV.R,{orig:'out',ind:'in',indG:seg(p,.45,.6)});
  s+=fade(seg(p,.05,.2),label('⊙ が 増える',TV.cx+TV.R+20,TV.cy-TV.R+10,{size:24,color:BC}));
  s+=fade(seg(p,.55,.7),label('妨げる ⊗',TV.cx,TV.cy+TV.R+50,{size:28,color:IND,anchor:'middle',weight:700}));
  return s;
 },
 [K+'inccur']:(p)=>{
  let s=titles()+sideRig({...SD,u:.9,meter:false,ind:'down',indG:1});
  s+=topLoop(TV.cx,TV.cy,TV.R,{orig:'out',ind:'in',indG:1,cur:1,curG:seg(p,.3,.5)})+curLabel(TV.cx,TV.cy,TV.R,1,seg(p,.5,.65));
  s+=fade(seg(p,.1,.25),label('右手：指の回る向き ＝ 電流',TV.cx-TV.R-30,TV.cy-TV.R-10,{size:22,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'dec']:(p)=>{
  const u=mix(.9,.35,seg(p,.1,.5));
  let s=titles()+sideRig({...SD,u,meter:false,move:-1,moveG:seg(p,.05,.15),ind:'up',indG:seg(p,.6,.75)});
  s+=topLoop(TV.cx,TV.cy,TV.R,{orig:'out',origN:mix(1,.25,seg(p,.1,.5)),ind:'out',indG:seg(p,.6,.75)});
  s+=fade(seg(p,.2,.35),label('⊙ が 減る',TV.cx+TV.R+20,TV.cy-TV.R+10,{size:24,color:BC}));
  s+=fade(seg(p,.65,.8),label('補う ⊙',TV.cx,TV.cy+TV.R+50,{size:28,color:IND,anchor:'middle',weight:700}));
  return s;
 },
 [K+'deccur']:(p)=>{
  let s=titles()+sideRig({...SD,u:.35,meter:false,ind:'up',indG:1,move:-1,moveG:1});
  s+=topLoop(TV.cx,TV.cy,TV.R,{orig:'out',origN:.25,ind:'out',indG:1,cur:-1,curG:seg(p,.1,.3)})+curLabel(TV.cx,TV.cy,TV.R,-1,seg(p,.3,.45));
  s+=fade(seg(p,.6,.75),card(440,70,290,70,label('元と 同じ向き',585,115,{size:26,color:IND,anchor:'middle',weight:700}),1,IND));
  return s;
 },
 [K+'answer']:(p)=>{
  let s=card(60,100,520,300,label('⊙ が 増える',320,150,{size:28,color:BC,anchor:'middle'}),seg(p,.02,.15));
  s+=fade(seg(p,.02,.15),topLoop(320,275,85,{orig:'out',origN:1,ind:'in',indG:1,cur:1,curG:1})+label('逆向き',470,280,{size:26,color:IND,weight:700}));
  s+=card(620,100,520,300,label('⊙ が 減る',880,150,{size:28,color:BC,anchor:'middle'}),seg(p,.15,.28));
  s+=fade(seg(p,.15,.28),topLoop(880,275,85,{orig:'out',origN:.1,ind:'out',indG:1,cur:-1,curG:1})+label('同じ向き',1030,280,{size:26,color:IND,weight:700}));
  s+=fade(seg(p,.6,.75),label('逆らうのは 磁場そのもの ではなく、その「変化」',600,460,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=titles()+sideRig({...SD,u:mix(.3,.9,seg(p,.05,.4)),pole:'S',meter:false,move:1,moveG:1});
  s+=topLoop(TV.cx,TV.cy,TV.R,{orig:'in',origN:seg(p,.05,.4)});
  s+=fade(seg(p,.4,.55),label('？',TV.cx+TV.R+40,TV.cy,{size:64,color:HI,weight:700}));
  s+=fade(seg(p,.3,.45),label('上から見て 電流は どちら回り？',TV.cx,TV.cy+TV.R+50,{size:26,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=titles()+sideRig({...SD,u:.9,pole:'S',meter:false,ind:'up',indG:seg(p,.35,.5)});
  s+=topLoop(TV.cx,TV.cy,TV.R,{orig:'in',ind:'out',indG:seg(p,.35,.5),cur:-1,curG:seg(p,.65,.8)})+curLabel(TV.cx,TV.cy,TV.R,-1,seg(p,.75,.9));
  s+=fade(seg(p,.05,.2),label('下向き ＝ 奥向き（⊗）',TV.cx+TV.R+10,TV.cy-TV.R-10,{size:22,color:BC,anchor:'end'}));
  return s;
 },
 [K+'sign']:(p)=>{
  const cx=330,cy=280,R=130;
  let s=T(`${EM}=-\\dfrac{d\\Phi}{dt}`,880,120,{size:56});
  s+=ring(cx,cy,R,{color:CI,w:6})+outSym(cx,cy,26,NC)+label('法線',cx,cy+52,{size:24,color:NC,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.6),draw(arcPts(cx,cy,R+30,R+30,200,340),1,{color:EMF,w:4})+head(cx+(R+30)*Math.cos(rad(340)),cy-(R+30)*Math.sin(rad(340)),Math.sin(rad(340))*-1,Math.cos(rad(340))*-1,{color:EMF,L:20})+label('＋ の回り方',cx,cy+R+62,{size:26,color:EMF,anchor:'middle',weight:700}));
  s+=card(660,220,500,200,label('どちら回りを ＋ にするか ＝ 約束',910,270,{size:24,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),label('親指 ＝ 法線、曲げた指 ＝ ＋',910,330,{size:26,color:EMF,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('法線 ⊙ → ＋ は 反時計回り',910,385,{size:26,color:C.ink,anchor:'middle'})),seg(p,.25,.4));
  return s;
 },
 [K+'sign2']:(p)=>{
  const cx=330,cy=280,R=130;
  let s=ring(cx,cy,R,{color:CI,w:6})+outSym(cx,cy,26,NC);
  s+=draw(arcPts(cx,cy,R+30,R+30,200,340),1,{color:EMF,w:4,opacity:.5})+label('＋',cx+R+40,cy+R*.5+40,{size:28,color:EMF,weight:700});
  s+=fade(seg(p,.5,.65),(()=>{let h='';for(const d of [45,135,225,315]){const t=rad(d);h+=head(cx+R*Math.cos(t),cy-R*Math.sin(t),Math.sin(t),Math.cos(t),{color:CI,L:24});}return h;})()+label('時計回りに 押す',cx,cy-R-30,{size:26,color:CI,anchor:'middle',weight:700}));
  s+=card(660,90,500,340,T(`\\text{増える}:\\ \\dfrac{d\\Phi}{dt}>0`,910,170,{size:38})
   +fade(seg(p,.25,.4),T(`${EM}=-\\dfrac{d\\Phi}{dt}<0`,910,265,{size:38}))
   +fade(seg(p,.4,.55),label('負 ＝ ＋と逆 ＝ 時計回り',910,335,{size:26,color:CI,anchor:'middle',weight:700}))
   +fade(seg(p,.75,.9),label('マイナス ＝ 変化を 妨げる向き',910,395,{size:26,color:IND,anchor:'middle',weight:700})),seg(p,0,.15),EMF);
  return s;
 },
 [K+'energy']:(p)=>{
  const cx=330,cy=270,R=150,items=['磁束が 増える','電流','さらに 増える','もっと 電流'];
  let s=label('もし 変化を「助ける」向きなら',60,52,{size:24,color:C.dim});
  items.forEach((t,i)=>{const a=rad(90-90*i),x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);s+=fade(seg(p,.1+i*.12,.2+i*.12),label(t,x,y+8,{size:26,color:i%2?CI:HI,anchor:'middle',weight:700}));
   const b=rad(90-90*i-45),bx=cx+R*Math.cos(b),by=cy-R*Math.sin(b);s+=fade(seg(p,.15+i*.12,.25+i*.12),head(bx,by,Math.sin(b),Math.cos(b),{color:C.dim,L:20}));});
  s+=card(680,150,470,220,label('エネルギーが 無から わく',915,215,{size:30,color:NEG,anchor:'middle',weight:700})+label('✕ 起こらない',915,280,{size:30,color:C.ink,anchor:'middle'})
   +label('→ 妨げる向き（マイナス）',915,335,{size:26,color:IND,anchor:'middle'}),seg(p,.65,.8),NEG);
  return s;
 },
 // ===== S5 電流が流れる条件 =====
 [K+'open']:(p)=>{
  const cx=320,cy=260,R=140;
  let s=label('真上から見た図：⊙ の磁束が 増えている間',60,52,{size:22,color:C.dim});
  s+=topLoop(cx,cy,R,{gap:true,orig:'out',origN:.6})+circE(cx,cy,R,1,seg(p,.3,.45));
  s+=fade(seg(p,.05,.2),label('切れ目',cx,cy+R+44,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(680,130,460,240,T(`${EM}=2\\,\\mathrm{V}`,910,200,{size:44})+fade(seg(p,.6,.75),label('電流は 流れ続けない',910,300,{size:30,color:NEG,anchor:'middle',weight:700})),seg(p,.3,.45),EMF);
  return s;
 },
 [K+'why']:(p)=>{
  const cx=320,cy=260,R=140,q=seg(p,.05,.5);
  let s=topLoop(cx,cy,R,{gap:true,orig:'out',origN:.6})+circE(cx,cy,R,1,.5);
  // cw at the bottom runs leftward → + piles up on the right end of the gap, − on the left end
  const xr=cx+R*Math.cos(rad(-80)),xl=cx+R*Math.cos(rad(260)),yb=cy+R*Math.sin(rad(80));
  s+=fade(q,label('＋',xr+18,yb+6,{size:30,color:C.a,weight:700})+label('＋',xr+12,yb-26,{size:26,color:C.a,weight:700}));
  s+=fade(q,label('−',xl-30,yb+6,{size:34,color:'#7fb3ff',weight:700})+label('−',xl-26,yb-26,{size:30,color:'#7fb3ff',weight:700}));
  s+=card(680,130,460,250,label('切れ目の 両端に たまる',910,190,{size:28,color:C.ink,anchor:'middle'})+label('→ 先へ 進めない',910,245,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('電流が 続くには 閉じた回路',910,320,{size:30,color:CI,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'closed']:(p)=>{
  const cx=320,cy=240,R=140;
  let s=topLoop(cx,cy,R,{resistor:true,orig:'out',origN:.6,g:seg(p,0,.2)});
  s+=card(680,120,460,280,label('オームの法則',910,175,{size:26,color:C.dim,anchor:'middle'})+T(`I=\\dfrac{${EM}}{R}`,910,280,{size:56}),seg(p,.4,.55),CI);
  return s;
 },
 [K+'calc2']:(p)=>{
  const cx=320,cy=240,R=140;
  let s=topLoop(cx,cy,R,{resistor:true,orig:'out',origN:.6,cur:1,curG:seg(p,.3,.5)});
  s+=card(680,110,460,300,T(`I=\\dfrac{2\\,\\mathrm{V}}{4\\,\\Omega}=${cs(CI,'0.5\\,\\mathrm{A}')}`,910,200,{size:44})
   +fade(seg(p,.5,.65),label('磁束が 増える 0.1 s の 間だけ',910,320,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.12),CI);
  return s;
 },
 [K+'summary']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.dim,anchor:'middle'});
  const rows=[[`① ${'起電力'}：磁束の 変化率（単位 V）`,EMF],['② 向き：変化を 妨げる向き',IND],['③ 電流が 続く：回路が 閉じているとき',CI]];
  rows.forEach(([t,c],i)=>{s+=fade(seg(p,.05+i*.25,.18+i*.25),label(t,180,170+i*100,{size:34,color:c,weight:700}));});
  s+=fade(seg(p,.05,.18),T(`|${EM}|=\\left|\\dfrac{d\\Phi}{dt}\\right|`,960,120,{size:36}));
  return s;
 },
 [K+'next']:(p)=>{
  // series circuit: battery, resistor, capacitor, coil
  const x0=120,x1=560,y0=130,y1=400;
  let s=draw([[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]],1,{color:CI,w:4});
  s+=rect(x0-22,250,44,40,{fill:C.bg,fo:1,stroke:C.bg})+line(x0-18,258,x0+18,258,{color:SURF,w:4})+line(x0-10,280,x0+10,280,{color:SURF,w:7});
  // resistor on top
  const zz=[[220,y0]];for(let i=0;i<8;i++)zz.push([232+i*14,y0+(i%2?12:-12)]);zz.push([350,y0]);s+=rect(215,y0-16,140,32,{fill:C.bg,fo:1,stroke:C.bg})+draw(zz,1,{color:SURF,w:4})+label('抵抗',285,y0-30,{size:24,color:C.ink,anchor:'middle'});
  // capacitor on the right side
  s+=rect(x1-24,240,48,50,{fill:C.bg,fo:1,stroke:C.bg})+line(x1-22,252,x1+22,252,{color:SURF,w:4})+line(x1-22,278,x1+22,278,{color:SURF,w:4})+label('コンデンサ',x1-34,272,{size:24,color:C.ink,anchor:'end'});
  // coil on the bottom
  s+=rect(250,y1-16,130,32,{fill:C.bg,fo:1,stroke:C.bg});for(let i=0;i<4;i++)s+=draw(arcPts(266+i*32,y1,16,16,180,0,16),1,{color:SURF,w:4});s+=label('コイル',315,y1+50,{size:24,color:C.ink,anchor:'middle'});
  s+=card(690,120,460,270,label('次の問い',920,170,{size:26,color:C.dim,anchor:'middle'})+label('抵抗・コンデンサ・コイル',920,235,{size:28,color:C.ink,anchor:'middle'})
   +label('電流は 時間とともに',920,290,{size:28,color:C.ink,anchor:'middle'})+label('どう 変わる？',920,345,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.2,.4),HI);
  return s;
 },
};
