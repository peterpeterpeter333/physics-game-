// YouTube シリーズ「電位・中級 1/3」(ys-um-electrostatic-potential-path-1) — 図。Stage 1200×515.
// 一様な電場 𝐄＝(4, 0) N/C、q＝2 C、A(0, 0)→B(3, 2) m。道1（右→上）・道2（上→右）・直線・曲がった道・寄り道。
// 部品は export して 2/3・3/3 でも使う（関数・定数の export は図の登録に入らない）。
// 色：電場 𝐄 水色、電位 V 紫、電荷 q 桃（正電荷の玉は赤）、仕事・エネルギー 橙、沿う部分・強調 黄、直角な部分 桃、負 赤、Δ𝐫・d𝐫 金、
//   道1 青・道2 薔薇・直線 白・寄り道 金。ベクトルは太字。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,highlight} from './anim.mjs';

const K='um-electrostatic-potential-path-1:';
export const EC=C.x,VC=C.v,QP=C.p,WC=C.E,AL=C.hi,NG=C.a,DC=C.t,FC=C.F,PP=C.p,QC='#ff6b6b';
export const PA='#6f9dff',PB='#f06a8a';
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const cross=(x,y,sz=16,color=C.a)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});
export const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
// label with a dark backing so it stays readable over the field arrows
export const BL=(t,x,y,o={})=>{const sz=o.size??24,w=[...t].reduce((a,c)=>a+(/[ -~]/.test(c)?.6:1),0)*sz,x0=o.anchor==='middle'?x-w/2:o.anchor==='end'?x-w:x;return rect(x0-8,y-sz*.95,w+16,sz*1.3,{fill:C.bg,fo:.92,stroke:C.bg,sw:0,rx:6})+label(t,x,y,o);};
// TeX pieces
export const vE=cs(EC,'\\mathbf{E}'),q=cs(QP,'q'),dr=cs(DC,'d\\mathbf{r}'),Dr=cs(DC,'\\Delta\\mathbf{r}');
export const Wt=s=>cs(WC,s),Vt=s=>cs(VC,s);
export const IAB=`\\int_{\\mathrm{A}}^{\\mathrm{B}}`;
export function charge(x,y,{g=1,text='2 C',r=13,neg=false}={}){
 const col=neg?'#6f9dff':QC;
 return fade(g,ring(x,y,r,{color:col,w:3,fill:neg?'#16223f':'#3a1d2a'})+label(neg?'−':'+',x,y+r*.42,{size:r*1.5,color:col,anchor:'middle',weight:700})+(text?label(text,x,y-r-12,{size:22,color:QP,anchor:'middle',weight:700}):''));
}
export function rightMark(x,y,dx,dy,sz=14,color=C.ink){// corner at (x,y), legs along (dx,dy) and its perpendicular
 const L1=Math.hypot(dx,dy),ux=dx/L1,uy=dy/L1,nx=-uy,ny=ux;
 return `<path d="M${x+ux*sz} ${y+uy*sz} L${x+ux*sz+nx*sz} ${y+uy*sz+ny*sz} L${x+nx*sz} ${y+ny*sz}" fill="none" stroke="${color}" stroke-width="2"/>`;
}

// ---- the plane with the uniform field ------------------------------------------------------------------
export const PL={x0:150,y0:430,S:115};
export const P=([u,v],o=PL)=>[o.x0+o.S*u,o.y0-o.S*v];
export function plane({g=1,field=1,fop=.42,xmax=3.6,ymax=2.6,o=PL,grid=1,xt=[1,2,3],rows=[.5,1.5,2.35]}={}){
 let s='';
 s+=fade(g*grid,[...Array(Math.floor(xmax)+1).keys()].slice(1).map(u=>line(P([u,0],o)[0],o.y0,P([u,0],o)[0],P([0,ymax-.2],o)[1],{color:C.grid,w:1.5})).join('')
  +[1,2].filter(v=>v<ymax).map(v=>line(o.x0,P([0,v],o)[1],P([xmax-.1,0],o)[0],P([0,v],o)[1],{color:C.grid,w:1.5})).join(''));
 s+=fade(g,arrow(o.x0-10,o.y0,P([xmax,0],o)[0]+20,o.y0,{color:C.dim,w:2.5,head:13})+arrow(o.x0,o.y0+10,o.x0,P([0,ymax],o)[1],{color:C.dim,w:2.5,head:13})
  +label('x [m]',P([xmax,0],o)[0]+26,o.y0+8,{size:22,color:C.dim})+label('y [m]',o.x0,P([0,ymax],o)[1]-10,{size:22,color:C.dim,anchor:'middle'})
  +xt.map(u=>label(String(u),P([u,0],o)[0],o.y0+30,{size:22,color:C.dim,anchor:'middle'})).join('')
  +[1,2].filter(v=>v<ymax).map(v=>label(String(v),o.x0-14,P([0,v],o)[1]+8,{size:22,color:C.dim,anchor:'end'})).join(''));
 let f='';for(let u=.35;u<xmax-.3;u+=1)for(const v of rows.filter(v=>v<ymax-.1)){const [x,y]=P([u,v],o);f+=arrow(x,y,x+o.S*.55,y,{color:EC,w:3,head:11,opacity:fop});}
 return s+fade(g*field,f);
}
export function AB({g=1,o=PL,lab=1,bdx=14,bdy=-12}={}){
 const a=P([0,0],o),b=P([3,2],o);
 return fade(g,dot(...a,7,C.ink)+dot(...b,7,C.ink)+fade(lab,label('A',a[0]-14,a[1]+30,{size:26,color:C.ink,anchor:'end',weight:700})+label('B',b[0]+bdx,b[1]+bdy,{size:26,color:C.ink,weight:700})));
}
const mid=(a,b,u=.55)=>[mix(a[0],b[0],u),mix(a[1],b[1],u)];
export function polyPath(pts,{g=1,p=1,color=PA,w=5,heads=1,o=PL,rev=false}={}){
 const Q=pts.map(v=>P(v,o));let s=draw(Q,p,{color,w});
 if(heads)for(let i=0;i<Q.length-1;i++){let a=Q[i],b=Q[i+1];if(rev)[a,b]=[b,a];const m1=mid(a,b,.42),m2=mid(a,b,.6);s+=fade(clamp(p*(Q.length-1)-i),arrow(m1[0],m1[1],m2[0],m2[1],{color,w,head:15}));}
 return fade(g,s);
}
export const PATH1=[[0,0],[3,0],[3,2]],PATH2=[[0,0],[0,2],[3,2]],DET=[[0,0],[5,0],[5,2],[3,2]];
export const along=(pts,k)=>{// point at fraction k of the total length
 let L0=0;const d=[];for(let i=1;i<pts.length;i++){const l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(l);L0+=l;}
 let w=L0*clamp(k);for(let i=1;i<pts.length;i++){if(w<=d[i-1])return [mix(pts[i-1][0],pts[i][0],w/d[i-1]),mix(pts[i-1][1],pts[i][1],w/d[i-1])];w-=d[i-1];}
 return pts[pts.length-1];
};
const wig=t=>[3*t+.55*Math.sin(2*Math.PI*t*2),2*t+.35*Math.sin(Math.PI*t)*Math.sin(3*Math.PI*t)];
export const WIG=Array.from({length:121},(_,i)=>wig(i/120));

// (0, x) force on the unit square, as in 線積分・中級 2/2
export function sq01({x0=150,y0=440,S=250,g=1,pa=1,pb=1,fop=.4,vals=0,loop=0}={}){
 const Pq=([u,v])=>[x0+S*u,y0-S*v];
 let s=arrow(x0-10,y0,x0+S+40,y0,{color:C.dim,w:2.5,head:12})+arrow(x0,y0+10,x0,y0-S-40,{color:C.dim,w:2.5,head:12})
  +label('(1, 1)',x0+S+10,y0-S-14,{size:22,color:C.dim})+label('原点',x0-12,y0+28,{size:22,color:C.dim,anchor:'end'});
 for(const u of [.25,.5,.75,1])for(const v of [.1,.45,.8]){const [x,y]=Pq([u,v]);s+=arrow(x,y,x,y-u*S*.28,{color:FC,w:3,head:10,opacity:fop});}
 const A1=[Pq([0,0]),Pq([1,0]),Pq([1,1])],B1=[Pq([0,0]),Pq([0,1]),Pq([1,1])];
 s+=fade(pa,draw(A1,1,{color:PA,w:5})+arrow(...mid(A1[1],A1[2],.4),...mid(A1[1],A1[2],.6),{color:PA,w:5,head:14})+arrow(...mid(A1[0],A1[1],.4),...mid(A1[0],A1[1],.6),{color:PA,w:5,head:14}));
 if(loop)s+=fade(pb,draw(B1,1,{color:PB,w:5})+arrow(...mid(B1[2],B1[1],.4),...mid(B1[2],B1[1],.6),{color:PB,w:5,head:14})+arrow(...mid(B1[1],B1[0],.4),...mid(B1[1],B1[0],.6),{color:PB,w:5,head:14}));
 else s+=fade(pb,draw(B1,1,{color:PB,w:5})+arrow(...mid(B1[0],B1[1],.4),...mid(B1[0],B1[1],.6),{color:PB,w:5,head:14})+arrow(...mid(B1[1],B1[2],.4),...mid(B1[1],B1[2],.6),{color:PB,w:5,head:14}));
 s+=fade(vals*pa,label('道 A：1 J',x0+S+16,y0-S*.45,{size:24,color:PA,weight:700}));
 s+=fade(vals*pb,label(loop?'道 B（逆）：0 J':'道 B：0 J',x0+S*.5,y0-S-22,{size:24,color:PB,anchor:'middle',weight:700}));
 s+=label('𝐅 ＝ (0, x) N',x0+S*.5,y0+44,{size:24,color:FC,anchor:'middle',weight:700});
 return fade(g,s);
}
// a sphere around a point charge (for the recap)
function sphere(cx,cy,R,{g=1,E=1}={}){
 let s=ring(cx,cy,R,{color:C.dim,w:3})+`<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R*.28}" fill="none" stroke="${C.dim}" stroke-width="2" stroke-dasharray="6 6" opacity=".7"/>`;
 let e='';for(let k=0;k<12;k++){const a=k*Math.PI/6+.2;e+=arrow(cx+Math.cos(a)*(R-6),cy-Math.sin(a)*(R-6),cx+Math.cos(a)*(R+55),cy-Math.sin(a)*(R+55),{color:EC,w:4,head:12});}
 return fade(g,s+fade(E,e)+ring(cx,cy,20,{color:QC,w:3,fill:'#3a1d2a'})+label('+',cx,cy+9,{size:28,color:QC,anchor:'middle',weight:700})+label('Q',cx+26,cy-18,{size:24,color:QP,weight:700}));
}
const W1=`W=${q}\\int_C${vE}\\cdot${dr}`;
function segCard(x,y,w,h,lines,g=1,stroke=C.faint){return card(x,y,w,h,lines,g,stroke);}

export const ytUmElectrostaticPotentialPath1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=sphere(320,265,120,{E:seg(p,.05,.35)});
  s+=card(660,130,470,230,L('球面の 電気束',895,190,{color:C.dim})+T(`\\Phi=\\dfrac{${cs(QP,'Q')}}{\\varepsilon_0}`,895,285,{size:56}),seg(p,.3,.5),C.faint);
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=card(60,70,520,380,L('一般の 線積分',320,125,{color:C.dim})+L('道によって 値が 変わりうる',320,215,{size:30,color:C.ink,weight:700})+T(`${cs(FC,'\\mathbf{F}')}=(0,\\;x)\\ \\mathrm{N}`,320,300,{size:38})+L('→ 1 J と 0 J',320,380,{size:28,color:WC,weight:700}),seg(p,0,.15),C.faint);
  s+=card(620,70,520,380,L('静電場 なら？',880,125,{color:EC,weight:700})+L('道に よらない？',880,215,{size:30,color:C.hi,weight:700})+L('位置 だけで 決まる 量',880,300,{size:28,color:C.ink})+L('電位 V ？',880,380,{size:34,color:VC,weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=sq01({pa:seg(p,.15,.35),pb:seg(p,.4,.6),vals:seg(p,.45,.65)});
  s+=card(640,120,500,230,L('線積分・中級 2/2',890,175,{color:C.dim,size:24})+L('両端は 同じ',890,235,{size:28})+L('道で 値が 変わった',890,300,{size:30,color:C.hi,weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'promise']:(p)=>{
  let s=card(80,90,560,330,L('初級 電位の回',360,145,{color:C.dim,size:24})+L('「静電場の 仕事は',360,215,{size:30})+L('道に よらない。',360,270,{size:30,color:C.hi,weight:700})+L('確かめは 中級で」',360,335,{size:30}),seg(p,0,.15),C.faint);
  s+=arrow(660,255,760,255,{color:C.hi,w:4,head:14,g:seg(p,.45,.6)});
  s+=card(780,160,360,190,L('今回',960,225,{size:26,color:C.dim})+L('確かめる',960,290,{size:36,color:C.hi,weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(100,90,1000,170,L('静電場では、電場の仕事は',600,160,{size:30})+L('本当に 道に よらない？',600,220,{size:38,color:C.hi,weight:700}),1,C.hi);
  s+=card(350,300,500,130,L('そして、なぜ？',600,380,{size:36,color:C.hi,weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ===== S2 2本の道 =====
 [K+'setup']:(p)=>{
  let s=plane({field:seg(p,.05,.35)})+AB({g:seg(p,.3,.5)});
  s+=charge(...P([0,0]),{g:seg(p,.5,.65)});
  s+=fade(seg(p,.35,.5),label('(0, 0)',P([0,0])[0]+12,P([0,0])[1]+30,{size:22,color:C.dim})+label('(3, 2)',P([3,2])[0]+14,P([3,2])[1]+22,{size:22,color:C.dim}));
  s+=card(700,110,450,250,T(`${vE}=(4,\\;0)\\ \\mathrm{N/C}`,925,180,{size:44})+T(`${q}=2\\ \\mathrm{C}`,925,260,{size:44})+L('A → B へ 運ぶ',925,330,{size:26}),seg(p,.1,.3),C.faint);
  return s;
 },
 [K+'uniform']:(p)=>{
  let s=plane({fop:mix(.42,.9,seg(p,.1,.3)-seg(p,.7,.9))})+AB({})+charge(...P([0,0]));
  s+=card(700,110,450,250,L('一様な 電場',925,170,{size:30,color:EC,weight:700})+L('どこでも 同じ向き・同じ強さ',925,230,{size:26})+L('右向き 4 N/C',925,285,{size:28,color:EC,weight:700})+L('静電場の 一番 簡単な例',925,335,{size:24,color:C.dim}),seg(p,.05,.2),EC);
  return s;
 },
 [K+'W']:(p)=>{
  let s=T(W1,600,160,{size:62});
  s+=fade(seg(p,.1,.3),label('線積分・中級 2/2',600,40,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(170,230,860,200,L('一歩ごとに',600,285,{size:26,color:C.dim})+L('電場の 沿う部分 × 長さ を 足す',600,340,{size:32,color:AL,weight:700})+fade(seg(p,.7,.85),L('→ q を 掛ける',600,395,{size:28,color:QP,weight:700})),seg(p,.4,.55),C.faint);
  return s;
 },
 [K+'paths']:(p)=>{
  let s=plane({})+AB({})+charge(...P([0,0]));
  s+=polyPath(PATH1,{p:seg(p,.2,.5),color:PA})+polyPath(PATH2,{p:seg(p,.45,.75),color:PB});
  s+=fade(seg(p,.35,.5),label('道1：先に 右',P([3,1])[0]+18,P([3,1])[1]+8,{size:24,color:PA,weight:700}));
  s+=fade(seg(p,.6,.75),BL('道2：先に 上',P([1.5,2])[0],P([1.5,2])[1]-32,{size:24,color:PB,anchor:'middle',weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=plane({})+AB({})+charge(...P([0,0]))+polyPath(PATH1,{color:PA})+polyPath(PATH2,{color:PB});
  s+=label('道1',P([3,1])[0]+18,P([3,1])[1]+8,{size:24,color:PA,weight:700})+BL('道2',P([1.5,2])[0],P([1.5,2])[1]-32,{size:24,color:PB,anchor:'middle',weight:700});
  s+=card(700,150,440,170,L('道が 違えば',920,215,{size:28})+L('仕事も 違う？',920,280,{size:36,color:C.hi,weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'p1a']:(p)=>{
  const k=seg(p,.05,.5);let s=plane({})+AB({})+polyPath(PATH1,{color:PA,g:.35})+polyPath([[0,0],[3,0]],{color:PA,w:7});
  s+=charge(...P([3*k,0]));
  s+=fade(seg(p,.1,.3),line(P([0,0])[0],P([0,0])[1],P([3,0])[0],P([3,0])[1],{color:AL,w:14,cap:'butt',opacity:.35}));
  s+=card(700,70,450,330,L('1区間目：右へ 3 m',925,125,{size:28,color:PA,weight:700})+L('電場と 同じ向き',925,175,{size:26,color:AL})
   +fade(seg(p,.35,.5),T(`4\\times3=12\\ \\mathrm{J/C}`,925,245,{size:42}))+fade(seg(p,.6,.75),T(`2\\times12=${Wt('24\\ \\mathrm{J}')}`,925,330,{size:42})),1,PA);
  s+=fade(seg(p,.6,.75),label('24 J',P([1.5,0])[0],P([1.5,0])[1]-18,{size:28,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p1b']:(p)=>{
  const k=seg(p,.05,.4);let s=plane({})+AB({})+polyPath(PATH1,{color:PA});
  s+=label('24 J',P([1.5,0])[0],P([1.5,0])[1]-18,{size:28,color:WC,anchor:'middle',weight:700});
  const [x,y]=P([3,2*k]);s+=charge(x,y,{text:k>.8?'':'2 C'});
  s+=fade(seg(p,.1,.3),rightMark(...P([3,0]),-1,0,16,C.hi)+arrow(x+30,y,x+30+55,y,{color:EC,w:4,head:12}));
  s+=fade(seg(p,.4,.55),label('0 J',P([3,1])[0]+24,P([3,1])[1]+8,{size:28,color:WC,weight:700}));
  s+=card(700,70,450,330,L('2区間目：上へ 2 m',925,125,{size:28,color:PA,weight:700})+L('一歩 ⊥ 電場 → 沿う部分 0',925,180,{size:26,color:AL})
   +fade(seg(p,.3,.45),T(`2\\times(4\\times0)=0`,925,245,{size:40}))+fade(seg(p,.65,.8),T(`24+0=${Wt('24\\ \\mathrm{J}')}`,925,330,{size:44})),1,PA);
  return s;
 },
 [K+'p2']:(p)=>{
  const k=seg(p,.05,.75);let s=plane({})+AB({})+polyPath(PATH1,{color:PA,g:.3})+polyPath(PATH2,{color:PB});
  s+=charge(...P(along(PATH2,k)),{text:k>.8?'':'2 C'});
  s+=fade(seg(p,.15,.3),label('0 J',P([0,1])[0]-16,P([0,1])[1]+8,{size:28,color:WC,anchor:'end',weight:700}));
  s+=fade(seg(p,.45,.6),BL('24 J',P([1.5,2])[0],P([1.5,2])[1]-32,{size:28,color:WC,anchor:'middle',weight:700}));
  s+=card(700,90,450,290,L('道2：先に 上',925,145,{size:28,color:PB,weight:700})+L('上へ 2 m：直角 → 0',925,200,{size:26})+fade(seg(p,.4,.55),L('右へ 3 m：24 J',925,250,{size:26}))
   +fade(seg(p,.65,.8),T(`0+24=${Wt('24\\ \\mathrm{J}')}`,925,330,{size:44})),1,PB);
  return s;
 },
 [K+'compare']:(p)=>{
  let s=card(60,70,520,390,L('線積分の回の力',320,120,{color:C.dim,size:24})+T(`${cs(FC,'\\mathbf{F}')}=(0,\\;x)\\ \\mathrm{N}`,320,185,{size:36})
   +label('道 A',160,275,{size:28,color:PA,weight:700})+label('1 J',480,275,{size:32,color:WC,anchor:'end',weight:700})
   +label('道 B',160,345,{size:28,color:PB,weight:700})+label('0 J',480,345,{size:32,color:WC,anchor:'end',weight:700})+L('違う',320,425,{size:30,color:NG,weight:700}),1,C.faint);
  s+=card(620,70,520,390,L('一様な 電場',880,120,{color:EC,size:24,weight:700})+T(`${vE}=(4,\\;0)\\ \\mathrm{N/C}`,880,185,{size:36})
   +fade(seg(p,.4,.55),label('道1',720,275,{size:28,color:PA,weight:700})+label('24 J',1040,275,{size:32,color:WC,anchor:'end',weight:700})
   +label('道2',720,345,{size:28,color:PB,weight:700})+label('24 J',1040,345,{size:32,color:WC,anchor:'end',weight:700})+L('同じ',880,425,{size:30,color:C.hi,weight:700})),seg(p,.3,.45),C.hi);
  return s;
 },
 // ===== S3 なぜ同じ =====
 [K+'onlyx']:(p)=>{
  let s=plane({})+AB({})+polyPath(PATH1,{color:PA,g:.55})+polyPath(PATH2,{color:PB,g:.55});
  const h=seg(p,.1,.35),v=seg(p,.45,.7);
  s+=fade(h,line(P([0,0])[0],P([0,0])[1],P([3,0])[0],P([3,0])[1],{color:AL,w:14,cap:'butt',opacity:.4})+line(P([0,2])[0],P([0,2])[1],P([3,2])[0],P([3,2])[1],{color:AL,w:14,cap:'butt',opacity:.4}));
  s+=fade(v,label('0',P([3,1])[0]+22,P([3,1])[1]+10,{size:30,color:C.hi,weight:700})+label('0',P([0,1])[0]+18,P([0,1])[1]+10,{size:30,color:C.hi,weight:700}));
  s+=card(700,110,450,260,L('効くのは',925,170,{size:26,color:C.dim})+L('x 方向（電場の向き）に',925,225,{size:28,color:AL,weight:700})+L('進んだ分 だけ',925,275,{size:28,color:AL,weight:700})+fade(v,L('上下の移動 → 0',925,335,{size:28,color:C.ink})),seg(p,.05,.2),AL);
  return s;
 },
 [K+'both3']:(p)=>{
  let s=plane({})+AB({})+polyPath(PATH1,{color:PA,g:.55})+polyPath(PATH2,{color:PB,g:.55});
  const y=P([0,0])[1]+44;
  s+=fade(seg(p,.05,.25),line(P([0,0])[0],y,P([3,0])[0],y,{color:AL,w:4})+line(P([0,0])[0],y-10,P([0,0])[0],y+10,{color:AL,w:3})+line(P([3,0])[0],y-10,P([3,0])[0],y+10,{color:AL,w:3})
   +label('x 方向に 3 m',P([1.5,0])[0],P([0,0])[1]-16,{size:24,color:AL,anchor:'middle',weight:700}));
  s+=card(700,130,450,220,L('どちらの 道も',925,190,{size:26})+fade(seg(p,.45,.6),T(`2\\times4\\times3=${Wt('24\\ \\mathrm{J}')}`,925,280,{size:46})),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'straight']:(p)=>{
  let s=plane({})+AB({})+polyPath(PATH1,{color:PA,g:.3,heads:0})+polyPath(PATH2,{color:PB,g:.3,heads:0});
  const a=P([0,0]),b=P([3,2]);
  s+=arrow(a[0],a[1],b[0],b[1],{color:DC,w:6,head:18,g:seg(p,.1,.4)});
  s+=fade(seg(p,.35,.5),T(Dr,P([1.4,1])[0]-34,P([1.4,1])[1]-14,{size:36}));
  s+=card(700,110,450,260,L('3本目：まっすぐ',925,165,{size:28,color:C.ink,weight:700})+fade(seg(p,.4,.55),T(`${Dr}=(3,\\;2)\\ \\mathrm{m}`,925,240,{size:42}))+fade(seg(p,.65,.8),L('途中の 𝐄 は どこでも 同じ',925,320,{size:26,color:EC,weight:700})),seg(p,.02,.15),C.faint);
  return s;
 },
 [K+'dot']:(p)=>{
  let s=plane({})+AB({});const a=P([0,0]),b=P([3,2]);s+=arrow(a[0],a[1],b[0],b[1],{color:DC,w:6,head:18});
  s+=card(640,70,520,350,T(`${vE}\\cdot${Dr}`,900,135,{size:44})+fade(seg(p,.1,.3),T(`=4\\times3+0\\times2`,900,215,{size:42}))+fade(seg(p,.35,.5),T(`=12\\ \\mathrm{J/C}`,900,290,{size:42}))
   +fade(seg(p,.6,.75),T(`\\times2\\ \\mathrm{C}\\;\\to\\;${Wt('24\\ \\mathrm{J}')}`,900,370,{size:42})),1,C.faint);
  return s;
 },
 [K+'split']:(p)=>{
  let s=plane({})+AB({});const a=P([0,0]),b=P([3,2]),c=P([3,0]);
  s+=arrow(a[0],a[1],b[0],b[1],{color:DC,w:6,head:18,opacity:.8});
  s+=fade(seg(p,.1,.3),line(a[0],a[1],c[0],c[1],{color:AL,w:13,cap:'butt',opacity:.45})+arrow(a[0],a[1],c[0],c[1],{color:AL,w:5,head:15})+label('沿う 3 m',P([1.5,0])[0],P([1.5,0])[1]-18,{size:26,color:AL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.55),arrow(c[0],c[1],b[0],b[1],{color:PP,w:5,head:15})+rightMark(c[0],c[1],-1,0,16,C.ink)+label('直角 2 m',P([3,1])[0]+20,P([3,1])[1]+8,{size:26,color:PP,weight:700}));
  s+=card(760,150,390,200,L('効くのは',955,215,{size:26,color:C.dim})+L('沿う 3 m だけ',955,285,{size:34,color:AL,weight:700}),seg(p,.65,.8),AL);
  return s;
 },
 [K+'wiggle']:(p)=>{
  let s=plane({})+AB({});
  const Q=WIG.map(v=>P(v));s+=draw(Q,seg(p,.02,.35),{color:C.ink,w:4});
  const t=.06,i=Math.round(t*120),a=Q[i],b=Q[i+6];
  s+=fade(seg(p,.4,.55),ring(a[0],a[1],38,{color:C.hi,w:3})+arrow(a[0],a[1],b[0],b[1],{color:DC,w:5,head:13}));
  s+=fade(seg(p,.4,.55),line(a[0],P([0,0])[1]+26,b[0],P([0,0])[1]+26,{color:AL,w:6})+label('Δx',(a[0]+b[0])/2,P([0,0])[1]+58,{size:24,color:AL,anchor:'middle',weight:700}));
  s+=card(680,110,480,250,L('一歩ごとの 寄与',920,170,{size:26,color:C.dim})+T(`${q}\\times4\\ \\mathrm{N/C}\\times${cs(AL,'\\Delta x')}`,920,255,{size:42})+L('（2 C × 4 N/C × Δx）',920,325,{size:24,color:C.dim}),seg(p,.5,.65),C.faint);
  return s;
 },
 [K+'cancel']:(p)=>{
  let s=plane({fop:.25})+AB({});const Q=WIG.map(v=>P(v));s+=draw(Q,1,{color:C.ink,w:4,opacity:.8});
  // x-projections of 12 steps under the axis: right = yellow, left = red
  const yb=P([0,0])[1]+48;let bars='';
  for(let k=0;k<12;k++){const u0=WIG[k*10][0],u1=WIG[k*10+10][0];const col=u1>=u0?AL:NG;const yy=yb+(u1>=u0?0:20);bars+=arrow(P([u0,0])[0],yy,P([u1,0])[0],yy,{color:col,w:4,head:9});}
  s+=fade(seg(p,.05,.35),bars);
  s+=card(700,90,450,300,L('Δx を 全部 足す',925,145,{size:28,color:AL,weight:700})+fade(seg(p,.3,.45),L('左へ 戻った分（負）が 打ち消す',925,200,{size:24,color:NG,weight:700}))
   +fade(seg(p,.45,.6),T(`\\sum\\Delta x=3\\ \\mathrm{m}`,925,270,{size:42}))+fade(seg(p,.7,.85),T(`\\to\\;${Wt('24\\ \\mathrm{J}')}`,925,345,{size:42})),1,C.faint);
  return s;
 },
 [K+'quiz']:(p)=>{
  const o={x0:110,y0:420,S:95};
  let s=plane({o,xmax:5.6,xt:[1,2,3,4,5]})+AB({o});
  s+=polyPath(DET,{o,color:DC,p:seg(p,.05,.5)});
  s+=card(720,120,440,220,L('寄り道 の 道',940,180,{size:26,color:DC,weight:700})+L('右 5 m → 上 2 m → 左 2 m',940,235,{size:24})+L('仕事は？',940,300,{size:36,color:C.hi,weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'ans']:(p)=>{
  const o={x0:110,y0:420,S:95};
  let s=plane({o,xmax:5.6,xt:[1,2,3,4,5]})+AB({o})+polyPath(DET,{o,color:DC});
  const Po=v=>P(v,o);
  s+=fade(seg(p,.05,.2),label('+40 J',Po([2.5,0])[0],Po([2.5,0])[1]-18,{size:26,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),label('0',Po([5,1])[0]+18,Po([5,1])[1]+8,{size:28,color:WC,weight:700}));
  s+=fade(seg(p,.4,.55),BL('−16 J',Po([4.45,2])[0],Po([4.2,2])[1]-18,{size:26,color:NG,anchor:'middle',weight:700}));
  s+=card(720,120,440,220,T(`40+0-16`,940,195,{size:44})+fade(seg(p,.6,.75),T(`=${Wt('24\\ \\mathrm{J}')}`,940,285,{size:48})),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'lengths']:(p)=>{
  const rows=[['道1',PA,'5 m'],['道2',PB,'5 m'],['まっすぐ',C.ink,'約 3.6 m'],['寄り道',DC,'9 m']];
  let body=label('道',230,150,{size:24,color:C.dim})+label('長さ',560,150,{size:24,color:C.dim,anchor:'middle'})+label('電場の 仕事',860,150,{size:24,color:C.dim,anchor:'middle'})+line(200,168,1000,168,{color:C.faint,w:2});
  rows.forEach(([n,c,l],i)=>{const y=225+i*62;body+=fade(seg(p,i*.1,i*.1+.2),line(200,y-9,240,y-9,{color:c,w:5})+label(n,260,y,{size:28,color:c,weight:700})+label(l,560,y,{size:28,color:C.ink,anchor:'middle'})+label('24 J',860,y,{size:30,color:WC,anchor:'middle',weight:700}));});
  return card(170,90,860,400,body,1,C.faint)+fade(seg(p,.5,.65),highlight(790,180,140,290,1,C.hi));
 },
 // ===== S4 一周 =====
 [K+'loop']:(p)=>{
  let s=plane({})+AB({});
  s+=polyPath(PATH1,{color:PA,p:seg(p,.05,.4)});
  s+=polyPath([[3,2],[0,2],[0,0]],{color:PB,p:seg(p,.45,.8)});
  s+=charge(...P(along([[0,0],[3,0],[3,2],[0,2],[0,0]],seg(p,.05,.8))));
  s+=fade(seg(p,.5,.65),BL('道2 を 逆向き',P([1.5,2])[0],P([1.5,2])[1]-32,{size:24,color:PB,anchor:'middle',weight:700}));
  s+=card(760,150,390,200,L('A → B → A',955,215,{size:32,color:C.ink,weight:700})+L('一周の 道',955,285,{size:30,color:C.hi,weight:700}),seg(p,.7,.85),C.hi);
  return s;
 },
 [K+'loopval']:(p)=>{
  let s=plane({})+AB({})+polyPath(PATH1,{color:PA})+polyPath([[3,2],[0,2],[0,0]],{color:PB});
  s+=fade(seg(p,.05,.2),label('行き +24 J',P([3,1])[0]+18,P([3,1])[1]+8,{size:26,color:WC,weight:700}));
  s+=fade(seg(p,.2,.35),BL('帰り −24 J',P([1.5,2])[0],P([1.5,2])[1]-32,{size:26,color:NG,anchor:'middle',weight:700}));
  s+=card(760,150,390,200,L('逆向き → 符号 反転',955,210,{size:24,color:C.dim})+fade(seg(p,.5,.65),T(`24-24=${Wt('0\\ \\mathrm{J}')}`,955,290,{size:44})),seg(p,.25,.4),C.faint);
  return s;
 },
 [K+'oint']:(p)=>{
  let s=T(`\\oint_C${vE}\\cdot${dr}`,600,150,{size:88});
  {const W=texWidth(`\\oint_C${vE}\\cdot${dr}`,88,false);s+=fade(seg(p,.2,.4),ring(600-W/2+texWidth('\\oint',88,false)*.5,120,48,{color:C.hi,w:3}));}
  s+=fade(seg(p,.2,.4),L('閉じた道 C を 一周する 線積分',600,300,{size:30,color:C.ink}));
  s+=card(300,340,600,120,L('∫ に付けた 丸 ＝ 道が 閉じて 一周',600,410,{size:28,color:C.hi,weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'zero']:(p)=>{
  let s=T(`\\oint_C${vE}\\cdot${dr}=0`,600,190,{size:88});
  s+=fade(seg(p,.05,.2),label('静電場',600,50,{size:30,color:EC,anchor:'middle',weight:700}));
  s+=card(250,300,700,150,L('どこを 回って 戻っても',600,355,{size:28})+L('電場の 仕事は 差し引き 0',600,415,{size:32,color:C.hi,weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'equiv']:(p)=>{
  const box=(x,w,txt,c)=>card(x,110,w,110,L(txt,x+w/2,178,{size:28,color:c,weight:700}),1,c);
  let s=fade(seg(p,.02,.2),box(60,260,'道1 の 仕事',PA)+L('−',360,180,{size:44})+box(400,260,'道2 の 仕事',PB)+L('＝',700,180,{size:40})+box(740,200,'一周',C.hi)+L('＝ 0',1030,180,{size:40,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),L('↓',600,275,{size:40,color:C.hi}));
  s+=card(250,310,700,150,L('道1 の 仕事 ＝ 道2 の 仕事',600,370,{size:32,color:C.ink,weight:700})+fade(seg(p,.6,.75),L('道に よらない ⇔ 一周が 0',600,425,{size:30,color:C.hi,weight:700})),seg(p,.35,.5),C.hi);
  return s;
 },
 [K+'contrast']:(p)=>{
  let s=sq01({loop:1,vals:seg(p,.1,.4),pb:seg(p,.2,.4)});
  s+=card(640,110,500,260,L('線積分の回の力',890,165,{size:24,color:C.dim})+fade(seg(p,.35,.5),T(`1+0=1\\ \\mathrm{J}`,890,245,{size:46}))+fade(seg(p,.6,.75),L('一周が 0 に ならない',890,325,{size:30,color:NG,weight:700})),seg(p,.05,.2),NG);
  return s;
 },
 [K+'general']:(p)=>{
  const row=(y,t1,t2,c,g)=>fade(g,label(t1,140,y,{size:28,color:C.dim})+label(t2,1060,y,{size:30,color:c,anchor:'end',weight:700}));
  let body=row(170,'計算で 確かめた','一様な 電場',C.ink,seg(p,0,.15))+row(260,'静電場の 性質 として 使う','一周が 0（どの 静電場でも）',EC,seg(p,.4,.55));
  return card(100,90,1000,240,body,1,C.faint)+fade(seg(p,.6,.75),L('電荷が 止まって いれば',600,400,{size:28,color:C.ink}));
 },
 [K+'point']:(p)=>{
  const cx=330,cy=265;let s='';
  for(const r of [80,150,220])s+=ring(cx,cy,r,{color:C.faint,w:2,dash:'6 7'});
  for(let k=0;k<12;k++){const a=k*Math.PI/6+.25;s+=arrow(cx+Math.cos(a)*28,cy-Math.sin(a)*28,cx+Math.cos(a)*(k%2?120:190),cy-Math.sin(a)*(k%2?120:190),{color:EC,w:3,head:11,opacity:.45});}
  s+=ring(cx,cy,18,{color:QC,w:3,fill:'#3a1d2a'})+label('+',cx,cy+8,{size:26,color:QC,anchor:'middle',weight:700});
  const a0=.75,r0=150,Px=cx+Math.cos(a0)*r0,Py=cy-Math.sin(a0)*r0,ur=[Math.cos(a0),-Math.sin(a0)],ut=[-Math.sin(a0),-Math.cos(a0)];
  const st=[Px+ur[0]*50+ut[0]*60,Py+ur[1]*50+ut[1]*60];
  s+=fade(seg(p,.05,.2),arrow(Px,Py,st[0],st[1],{color:DC,w:5,head:14})+dot(Px,Py,5,C.ink));
  s+=fade(seg(p,.25,.45),arrow(Px,Py,Px+ut[0]*60,Py+ut[1]*60,{color:PP,w:5,head:13})+BL('円周方向 → 0',Px+ut[0]*60-10,Py+ut[1]*60-14,{size:24,color:PP,anchor:'end',weight:700}));
  s+=fade(seg(p,.5,.7),arrow(Px,Py,Px+ur[0]*50,Py+ur[1]*50,{color:AL,w:5,head:13})+BL('半径方向',Px+ur[0]*50+14,Py+ur[1]*50+6,{size:24,color:AL,weight:700}));
  s+=card(680,130,470,230,L('一歩 ＝ 半径方向 ＋ 円周方向',915,190,{size:26})+fade(seg(p,.3,.45),L('円周方向：𝐄 と 直角 → 0',915,250,{size:26,color:PP,weight:700}))+fade(seg(p,.6,.75),L('半径方向：距離の 変化 だけ',915,310,{size:26,color:AL,weight:700})),seg(p,.1,.25),C.faint);
  return s;
 },
 [K+'upper']:(p)=>{
  const row=(y,t1,t2,c)=>label(t1,140,y,{size:28,color:C.dim})+label(t2,1060,y,{size:30,color:c,anchor:'end',weight:700});
  let body=row(170,'計算で 確かめた','一様な 電場',C.ink)+row(260,'静電場の 性質 として 使う','一周が 0（どの 静電場でも）',EC)+fade(seg(p,.1,.3),row(350,'一般の 確かめ','上級',C.hi));
  return card(100,90,1000,330,body,1,C.faint);
 },
 // ===== S5 まとめ =====
 [K+'sum1']:(p)=>{
  let s=plane({o:{x0:120,y0:420,S:95}})+AB({o:{x0:120,y0:420,S:95}})+polyPath(PATH1,{o:{x0:120,y0:420,S:95},color:PA})+polyPath(PATH2,{o:{x0:120,y0:420,S:95},color:PB})
   +draw([P([0,0],{x0:120,y0:420,S:95}),P([3,2],{x0:120,y0:420,S:95})],1,{color:C.ink,w:4});
  s+=card(620,110,530,260,L('一様な 電場',885,170,{size:26,color:EC,weight:700})+L('仕事は 電場の向きに 進んだ分 だけ',885,230,{size:26})+fade(seg(p,.4,.55),L('どの 道 でも 24 J',885,305,{size:34,color:WC,weight:700})),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=T(`\\oint_C${vE}\\cdot${dr}=0`,600,150,{size:70});
  s+=fade(seg(p,.05,.15),label('静電場',600,40,{size:28,color:EC,anchor:'middle',weight:700}));
  s+=card(250,230,700,200,L('仕事は 道に よらない',600,300,{size:34,color:C.hi,weight:700})+fade(seg(p,.5,.65),L('初級の 約束を 回収',600,370,{size:28,color:C.dim})),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'next1']:(p)=>{
  let s=plane({})+AB({lab:0})+polyPath(PATH1,{color:PA,g:.5})+polyPath(PATH2,{color:PB,g:.5});
  s+=fade(seg(p,.2,.4),ring(...P([0,0]),22,{color:C.hi,w:3})+ring(...P([3,2]),22,{color:C.hi,w:3}));
  s+=BL('A',P([0,0])[0]-24,P([0,0])[1]+34,{size:26,color:C.ink,anchor:'end',weight:700})+BL('B',P([3,2])[0]+28,P([3,2])[1]-18,{size:26,color:C.ink,weight:700});
  s+=card(700,130,450,220,L('A → B の 仕事は',925,195,{size:28})+L('位置 A と B だけで 決まる',925,265,{size:30,color:C.hi,weight:700}),seg(p,.35,.5),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(100,80,1000,190,T(`W_{\\mathrm{AB}}=(\\ \\text{?}\\ )_{\\mathrm{A}}-(\\ \\text{?}\\ )_{\\mathrm{B}}`,600,175,{size:56}),seg(p,0,.15),C.faint);
  s+=card(250,310,700,150,L('位置 だけで 決まる 量 とは？',600,395,{size:36,color:C.hi,weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
};
