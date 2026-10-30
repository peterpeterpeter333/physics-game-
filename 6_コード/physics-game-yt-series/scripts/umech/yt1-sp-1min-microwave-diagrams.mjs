// 「1分の疑問」09 電子レンジはなぜ温まる (ys-sp-1min-microwave) — 図。Stage 1200×515。
// 形（カウンター・Q カード・疑問カード・黄色の枠の問い）は 01 の yt1-sp-1min-common.mjs。小さな部品は yt1-sp-1min-c0609-common.mjs。
// 電場は上下の矢印（水色）。水の分子は 酸素（−、青）と水素2つ（＋、赤）。分子の ＋ 側が電場の向きにそろおうとする。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,poly,clamp,mix} from './anim.mjs';
import {wrap,qcard,finalQ,cueT,vseg,HC} from './yt1-sp-1min-common.mjs';
import {card,tag,note,cross} from './yt1-sp-1min-c0609-common.mjs';

const K='sp-1min-microwave:';
const PI=Math.PI, EF=C.x, HEAT=C.E, NEG='#6f9dff', POS='#ff8f9b';
const rnd=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};

// microwave oven (x,y = top left, w)
function oven(x,y,w,{g=1,inner=''}={}){
 const h=w*.6,dw=w*.68;
 let s=rect(x,y,w,h,{fill:'#c9d0dc',fo:1,stroke:'#e8edf5',sw:2,rx:12});
 s+=rect(x+14,y+14,dw,h-28,{fill:'#1a2234',fo:1,stroke:'#5a6478',sw:2,rx:6});
 s+=inner;
 // door mesh dots
 let m='';for(let i=0;i<Math.floor(dw/12);i++)for(let j=0;j<Math.floor((h-28)/12);j++)m+=dot(x+20+i*12,y+20+j*12,1.6,'#0b1122',.5);
 s+=m;
 s+=rect(x+dw+28,y+20,w-dw-42,h*.3,{fill:'#2a3346',fo:1,stroke:'#5a6478',sw:1.5,rx:4});
 s+=ring(x+dw+28+(w-dw-42)/2,y+h*.62,w*.05,{color:'#5a6478',w:3,fill:'#e8edf5'});
 return fade(g,s);
}
// bento box
function bento(x,y,w,{g=1,frozen=0}={}){
 const h=w*.42;
 let s=rect(x,y,w,h,{fill:'#2d2d2d',fo:1,stroke:'#555',sw:2,rx:8});
 s+=rect(x+6,y+6,w*.55,h-12,{fill:'#f4f1e8',fo:1,stroke:'#ddd',sw:1,rx:4});
 s+=dot(x+w*.27,y+h/2,h*.13,'#d33');
 s+=rect(x+w*.62,y+6,w*.33,h*.45,{fill:'#d9902f',fo:1,stroke:'#b8771f',sw:1,rx:4});
 s+=rect(x+w*.62,y+h*.55,w*.33,h*.35,{fill:'#5ba04a',fo:1,stroke:'#3f7d32',sw:1,rx:4});
 if(frozen>0)s+=fade(frozen,rect(x,y,w,h,{fill:'#cfe9ff',fo:.55,stroke:'#e6f4ff',sw:3,rx:8})+[[.15,.25],[.5,.6],[.8,.3],[.3,.75]].map(([a,b])=>flake(x+a*w,y+b*h,h*.14)).join(''));
 return fade(g,s);
}
function flake(x,y,r,col='#ffffff'){let s='';for(let i=0;i<3;i++){const a=i*PI/3;s+=line(x-r*Math.cos(a),y-r*Math.sin(a),x+r*Math.cos(a),y+r*Math.sin(a),{color:col,w:2.5});}return s;}
// flame (crossed out on the Q card)
function flame(x,y,k=1,g=1){return fade(g,`<path d="M${x} ${y-60*k} C ${x+35*k} ${y-20*k}, ${x+30*k} ${y+10*k}, ${x} ${y+15*k} C ${x-30*k} ${y+10*k}, ${x-35*k} ${y-20*k}, ${x} ${y-60*k} Z" fill="#ff8a3d"/><path d="M${x} ${y-25*k} C ${x+15*k} ${y-5*k}, ${x+12*k} ${y+8*k}, ${x} ${y+12*k} C ${x-12*k} ${y+8*k}, ${x-15*k} ${y-5*k}, ${x} ${y-25*k} Z" fill="#ffe08a"/>`);}

// water molecule: ang = direction (rad, SVG) of the + side (from O toward the H's)
function mol(x,y,ang,k=1,{g=1,signs=true}={}){
 const d=30*k,h=.91; // half of 104.5°
 const h1=[x+d*Math.cos(ang-h),y+d*Math.sin(ang-h)],h2=[x+d*Math.cos(ang+h),y+d*Math.sin(ang+h)];
 let s=dot(h1[0],h1[1],13*k,POS)+dot(h2[0],h2[1],13*k,POS)+dot(x,y,22*k,NEG);
 if(signs&&k>=.8){s+=label('−',x,y+9*k,{size:26*k,color:'#0b1122',anchor:'middle',weight:700});
  for(const [hx,hy] of [h1,h2])s+=label('+',hx,hy+8*k,{size:20*k,color:'#0b1122',anchor:'middle',weight:700});}
 return fade(g,s);
}
// field: E(t) = cos(W t); W chosen so the arrows flip about every 1.2 s on screen
const W=2.6;
const Ef=t=>Math.cos(W*t);
function fieldArrows(x0,x1,y0,y1,t,{g=1,n=8}={}){
 const e=Ef(t);let s='';
 for(let i=0;i<n;i++){const x=mix(x0,x1,(i+.5)/n),yc=(y0+y1)/2,L=(y1-y0)/2*e;
  if(Math.abs(L)>6)s+=arrow(x,yc+L*.6,x,yc-L*.6,{color:EF,w:3,head:14,opacity:.6});}
 return fade(g,s);
}
// angle of a free molecule following the field (with a small lag); + side points along E (up = -π/2)
const follow=(t,lag=.25)=>-PI/2+PI*(1-Math.tanh(3*Math.cos(W*(t-lag))))/2;

// travelling field along x (snapshot of the wave): arrows up/down
function waveRow(x0,x1,y,t,{g=1,amp=70,lam=300,n=22}={}){
 let s='';for(let i=0;i<n;i++){const x=mix(x0,x1,i/(n-1)),e=Math.cos(2*PI*(x-x0)/lam-W*t);
  if(Math.abs(e*amp)>5)s+=arrow(x,y,x,y-e*amp,{color:EF,w:3.5,head:12});}
 s+=line(x0,y,x1,y,{color:C.faint,w:2});
 return fade(g,s);
}
function thermo(x,y,h,lev,{g=1}={}){
 let s=rect(x-12,y-h,24,h,{fill:'#1a2234',fo:1,stroke:C.ink,sw:2,rx:12})+dot(x,y+10,20,HEAT);
 s+=rect(x-6,y-h*lev,12,h*lev+8,{fill:HEAT,fo:1,stroke:HEAT,sw:0,rx:6});
 return fade(g,s);
}

// hexagonal ice lattice (fixed molecules, bonds)
const LAT=(()=>{const P=[];const a=66;for(let r=0;r<4;r++)for(let c=0;c<7;c++){const x=330+c*a*1.0+(r%2)*a*.5,y=170+r*a*.87;P.push([x,y]);}return P;})();
function lattice(t,{g=1,wob=.08}={}){
 let s='';
 for(let i=0;i<LAT.length;i++)for(let j=i+1;j<LAT.length;j++){const d=Math.hypot(LAT[i][0]-LAT[j][0],LAT[i][1]-LAT[j][1]);if(d<70)s+=line(LAT[i][0],LAT[i][1],LAT[j][0],LAT[j][1],{color:'#9fd0ff',w:2,dash:'5 5',opacity:.8});}
 LAT.forEach(([x,y],i)=>{s+=mol(x,y,-PI/2+(i%3-1)*.9+wob*Math.cos(W*t+i),.62,{signs:false});});
 return fade(g,s);
}

export const sp1minMicrowaveDiagrams={
 // 1 — Q：電子レンジとお弁当、火は使わない
 [K+'q']:wrap(1,(p,ctx)=>{
  const t=cueT(p,ctx);
  let bg=oven(860,320,300,{g:vseg(ctx,p,.05,.2),inner:bento(895,385,140)});
  bg+=flame(150,430,1.1,vseg(ctx,p,.3,.45))+cross(150,410,55,vseg(ctx,p,.45,.55));
  bg+=fade(vseg(ctx,p,.4,.55),label('火は 使わない',150,500,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return qcard(['電子レンジは、','なぜ 温まる？'],p,t,{bg,y0:160});
 },{fadeIn:false,roll:0}),

 // 2 — 向きが入れ替わる電磁波（マイクロ波）
 [K+'wave']:wrap(1,(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=oven(40,150,330,{inner:bento(80,230,150)});
  s+=fade(vseg(ctx,p,.05,.15),label('レンジの 中',205,385,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=waveRow(440,1160,300,t,{g:vseg(ctx,p,.1,.25)});
  s+=fade(vseg(ctx,p,.1,.25),label('電場の 向き',440,215,{size:26,color:EF,weight:700}));
  s+=card(560,76,520,104,label('1秒間に 24億5000万回',820,122,{size:34,color:HC,anchor:'middle',weight:700})+label('向きが 入れ替わる',820,162,{size:24,color:C.dim,anchor:'middle',weight:700}),vseg(ctx,p,.3,.45),HC);
  s+=tag('マイクロ波',800,440,{g:vseg(ctx,p,.75,.88),size:32,color:EF});
  s+=fade(vseg(ctx,p,.8,.9),label('波長 約12 cm',1060,445,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },{pill:'電子レンジは、なぜ温まる？',bridge:.97}),

 // 3 — 水の分子：＋と−、電場に合わせて回る
 [K+'water']:wrap(2,(p,ctx)=>{
  const t=cueT(p,ctx);
  // left: one big molecule with labels
  let s=card(40,90,360,330,mol(220,250,-PI/2,1.9,{g:1})
   +label('酸素 −',220,345,{size:26,color:NEG,anchor:'middle',weight:700})+label('水素 ＋',220,140,{size:26,color:POS,anchor:'middle',weight:700})
   +label('水の 分子',220,400,{size:26,color:C.dim,anchor:'middle',weight:700}),vseg(ctx,p,.2,.35),C.faint);
  // right: field + molecules following it
  const on=vseg(ctx,p,.55,.65);
  s+=card(440,90,720,330,fieldArrows(460,1140,110,400,t,{g:on})
   +[[560,170],[760,190],[960,160],[640,330],[860,340],[1060,320]].map(([x,y],i)=>mol(x,y,on>0?follow(t,.08+.03*i):-PI/2+i*.7,1)).join(''),vseg(ctx,p,.5,.6),EF);
  s+=fade(vseg(ctx,p,.6,.72),label('電場の 向きに 合わせて くるくる 回る',800,465,{size:28,color:EF,anchor:'middle',weight:700}));
  return s;
 },{roll:0,q:{end:.2,lines:['マイクロ波は、何を 揺らす？'],text:'マイクロ波は、何を揺らす？'}}),

 // 4 — ぶつかり合い → 熱
 [K+'heat']:wrap(2,(p,ctx)=>{
  const t=cueT(p,ctx),hot=vseg(ctx,p,.35,.9);
  let s=card(40,90,880,330,fieldArrows(60,900,110,400,t,{g:.7}),1,EF);
  for(let i=0;i<14;i++){const bx=110+(i%7)*120+(Math.floor(i/7)%2)*50,by=170+Math.floor(i/7)*150;
   const jx=(8+14*hot)*Math.sin(t*(7+i)+i),jy=(8+14*hot)*Math.cos(t*(6+i*.7)+2*i);
   s+=mol(bx+jx,by+jy,follow(t,.05+.02*i)+(.4*hot)*Math.sin(t*9+i),.75,{signs:false});}
  // collision sparks
  for(let i=0;i<5;i++){const ph=(t*1.7+i*.37)%1;if(ph<.25&&hot>0)s+=fade(hot*(1-ph*4),dot(170+i*160,245,14+36*ph,HEAT,.85));}
  s+=fade(vseg(ctx,p,.3,.4),label('ぶつかり合う',480,465,{size:28,color:HEAT,anchor:'middle',weight:700}));
  s+=thermo(1040,380,250,mix(.15,.85,hot),{g:vseg(ctx,p,.4,.5)});
  s+=fade(vseg(ctx,p,.7,.85),label('熱に なる',1040,90,{size:32,color:HEAT,anchor:'middle',weight:700}));
  s+=fade(.25*hot,rect(40,90,880,330,{fill:HEAT,fo:.25,stroke:'none',rx:14}));
  return s;
 },{fadeIn:false,pill:'マイクロ波は、何を揺らす？',bridge:.97}),

 // 5 — 冷凍のお弁当は、なぜ温まりにくい？
 [K+'frozen']:wrap(3,(p,ctx)=>{
  let s=oven(250,130,460,{inner:bento(310,230,250,{frozen:1})});
  s+=fade(vseg(ctx,p,.6,.75),label('なかなか 温まらない',920,260,{size:34,color:'#9fd0ff',anchor:'middle',weight:700})+flake(920,330,40,'#cfe9ff'));
  return s;
 },{roll:0,q:{end:.55,lines:['冷凍は、なぜ 温まりにくい？'],text:'冷凍は、なぜ温まりにくい？'}}),

 // 6 — 氷の網目：分子はほとんど回れない
 [K+'ice']:wrap(3,(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=fieldArrows(300,800,110,420,t,{g:.6,n:6})+lattice(t,{g:vseg(ctx,p,0,.15)});
  s+=fade(vseg(ctx,p,.15,.3),label('氷：がっちり つながる',560,465,{size:28,color:'#9fd0ff',anchor:'middle',weight:700}));
  // right: free water molecule for comparison
  s+=card(900,110,260,260,mol(1030,230,follow(t),1.1)+label('水：くるくる',1030,345,{size:26,color:EF,anchor:'middle',weight:700}),vseg(ctx,p,.35,.5),C.faint);
  s+=card(40,110,240,260,mol(160,230,-PI/2+.08*Math.cos(W*t),1.1)+label('氷：回れない',160,345,{size:26,color:'#9fd0ff',anchor:'middle',weight:700}),vseg(ctx,p,.35,.5),'#9fd0ff');
  s+=fade(vseg(ctx,p,.7,.85),label('揺さぶりを 受け取りにくい',600,95,{size:28,color:HC,anchor:'middle',weight:700}));
  return s;
 },{fadeIn:false,pill:'冷凍は、なぜ温まりにくい？',bridge:.97}),

 // 7 — 次の疑問：扉の網からは、なぜ出てこない？
 [K+'next']:wrap(4,(p,ctx)=>{
  const t=cueT(p,ctx),g=vseg(ctx,p,.02,.15),k=vseg(ctx,p,.3,.45);
  let s=oven(70,290,300,{g:k,inner:bento(100,350,130)});
  s+=fade(k,ring(185,370,34,{color:HC,w:3})+line(215,385,470,380,{color:HC,w:2})+line(205,345,470,300,{color:HC,w:2}));
  // magnified mesh
  let m=`<clipPath id="mwz"><circle cx="560" cy="390" r="100"/></clipPath><g clip-path="url(#mwz)">`+rect(450,280,220,220,{fill:'#9aa2b2',fo:1,stroke:'none',rx:0});
  for(let i=0;i<9;i++)for(let j=0;j<9;j++)m+=dot(468+i*24,298+j*24,8,'#0b1122');
  m+='</g>'+ring(560,390,100,{color:HC,w:4});
  s+=fade(k,m);
  s+=fade(vseg(ctx,p,.45,.6),label('見える',760,350,{size:30,color:C.ink,anchor:'middle',weight:700})+arrow(690,360,730,360,{color:C.ink,w:4,head:12}));
  s+=fade(vseg(ctx,p,.6,.75),waveRow(830,1150,420,t,{amp:40,lam:240,n:12})+label('？',1000,380,{size:56,color:HC,anchor:'middle',weight:700}));
  s+=finalQ(['扉の 網から 中は 見えるのに、','なぜ マイクロ波は 出てこない？'],g,{y:60,sc:.9+.1*g});
  return s;
 },{roll:0}),
};
