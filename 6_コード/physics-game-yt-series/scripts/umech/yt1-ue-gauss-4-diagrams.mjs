// YouTube シリーズ「ガウスの法則・上級 4/6」(ys-ue-gauss-4) — 図。Stage 1200×515.
// 色：1/6 と共通（𝐄 水色、𝐧 桃、dA 金、Φ・強調 黄、角 橙）＋ 射影面積 dA⊥ 紫、立体角 dΩ 黄緑（CO）。
// 横から見た図：電荷 O を (OX,OY)、光線は右向き。距離 r＝2 を 500px（半径1の球は 250px）。小片の法線は光線から α＝60° 上。
//   小片は法線に垂直なので、縦から α 傾く。射影（光線に垂直な縦の線）は 幅×cosα。
// C 形の面（凹んだ閉じた面）：中心 (CX,CY)、外 190・内 85 の輪から右側 ±40° を切り取った形。外向き法線は外円で外向き、内円で中心向き。
//   内部電荷 (CX, CY−137) から真下：内円を出る(＋) → 内円に入る(−) → 外円を出る(＋)。外部電荷 (60,CY) から右：入る(−)・出る(＋)。
//   外部電荷 (CX,30) から真下：−＋−＋。
// 数値：dA＝0.01 m²、α＝60° → dA⊥＝0.005 m²、r＝2 m → dΩ＝0.00125 sr。E＝kQ/4、𝐄·𝐧＝kQ/8、×0.01＝0.00125kQ。
// 5/6・6/6 からも使う補助関数は export する（登録されるのは下の図オブジェクトだけ）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly,texWidth} from './anim.mjs';
import {G1,cs,card,T,L,TF,qin,xsec,ok,bad,strike,PHI,vE,vn,dA,OI} from './yt1-ue-gauss-1-diagrams.mjs';
import {charge,blobPts,closedPath} from './yt1-ui-closed-bag-1-diagrams.mjs';
import {view,surface,sphereOutline,SPHERE,patch} from './yt1-um-gauss-sphere-preview-1-diagrams.mjs';

const K='ue-gauss-4:';
export const CO='#c6f07a',CPJ=C.v;
export const dOm=cs(CO,'d\\Omega'),dAp=cs(CPJ,'dA_{\\perp}'),al=cs(G1.ang,'\\alpha'),rh='\\frac{\\mathbf{r}}{r}';
const OX=140,OY=300,RU=250; // charge and unit-sphere radius (px)
const A60=Math.PI/3;
// ---- side view: charge, ray, tilted piece -------------------------------------------------------
// piece centred at (px,OY) with half-width hw, normal at angle a above the ray
export function pieceAt(px,py,hw,a,{g=1,gN=1,col=G1.A,w=7,nlen=80}={}){
 const tx=Math.sin(a),ty=Math.cos(a); // along the piece (down-right for a>0)
 const nx=Math.cos(a),ny=-Math.sin(a);
 return fade(g,line(px-hw*tx,py-hw*ty,px+hw*tx,py+hw*ty,{color:col,w})+fade(gN,arrow(px,py,px+nlen*nx,py+nlen*ny,{color:G1.n,w:5,head:14})));
}
export function alphaArc(px,py,a,{r=46,g=1,text=true}={}){
 const pts=[];for(let i=0;i<=20;i++){const t=a*i/20;pts.push([px+r*Math.cos(t),py-r*Math.sin(t)]);}
 return fade(g,draw(pts,1,{color:G1.ang,w:3})+(text?label('α',px+(r+18)*Math.cos(a/2),py-(r+18)*Math.sin(a/2)+8,{size:28,color:G1.ang,weight:700,anchor:'middle'}):''));
}
function sideBase({px=OX+500,g=1,ray=1,rlab=1}={}){
 let s=charge(OX,OY,1,18)+label('Q',OX-28,OY+8,{size:26,color:C.p,weight:700,anchor:'end'});
 s+=fade(ray,line(OX+20,OY,px+150,OY,{color:C.dim,w:2,dash:'8 8'}));
 s+=fade(rlab,line(OX,OY+110,px,OY+110,{color:C.ink,w:2})+line(OX,OY+100,OX,OY+120,{color:C.ink,w:2})+line(px,OY+100,px,OY+120,{color:C.ink,w:2})+label('距離 r',(OX+px)/2,OY+100,{size:26,anchor:'middle'}));
 return fade(g,s);
}
// unit arrow r/r at the piece (white)
const rArrow=(px,g=1)=>fade(g,arrow(px,OY,px+80,OY,{color:C.ink,w:5,head:14})+label('𝐫/r',px+88,OY+36,{size:26,color:C.ink,weight:700}));
// projected (perpendicular) segment
const projSeg=(px,hw,a,g=1)=>fade(g,line(px,OY-hw*Math.cos(a),px,OY+hw*Math.cos(a),{color:CPJ,w:8}));
const projGuides=(px,hw,a,g=1)=>{const tx=Math.sin(a),ty=Math.cos(a);return fade(g,line(px-hw*tx,OY-hw*ty,px,OY-hw*ty,{color:C.dim,w:2,dash:'5 6'})+line(px+hw*tx,OY+hw*ty,px,OY+hw*ty,{color:C.dim,w:2,dash:'5 6'}));};
// cone through a perpendicular half-height h at distance D (px), drawn to distance Dmax
function cone(D,h,Dmax,{g=1,fill=true}={}){
 const k=Dmax/D;const a=[OX+Dmax,OY-h*k],b=[OX+Dmax,OY+h*k];
 return fade(g,(fill?poly([[OX,OY],a,b],{fill:CO,fo:.08}):'')+line(OX,OY,a[0],a[1],{color:CO,w:2.5})+line(OX,OY,b[0],b[1],{color:CO,w:2.5}));
}
function unitArc(D,h,{g=1,full=true}={}){
 const t=Math.atan(h/D);const pts=[];for(let i=0;i<=24;i++){const q=-t+2*t*i/24;pts.push([OX+RU*Math.cos(q),OY-RU*Math.sin(q)]);}
 let s=full?draw(Array.from({length:61},(_,i)=>{const q=-Math.PI/2.6+i*(2*Math.PI/2.6)/60;return [OX+RU*Math.cos(q),OY-RU*Math.sin(q)];}),1,{color:G1.geo,w:2,dash:'6 7'}):'';
 s+=draw(pts,1,{color:CO,w:9});
 return fade(g,s);
}
// ---- C-shaped (concave) closed surface ----------------------------------------------------------
export const CSH={cx:430,cy:265,ro:190,ri:85,gap:40};
const cp=(r,deg,o=CSH)=>[o.cx+r*Math.cos(deg*Math.PI/180),o.cy-r*Math.sin(deg*Math.PI/180)];
export function cShape({g=1,o=CSH,fo=.07}={}){
 const {ro,ri,gap}=o,rc=(ro-ri)/2;
 const a=cp(ro,gap,o),b=cp(ro,360-gap,o),c=cp(ri,360-gap,o),d=cp(ri,gap,o);
 const path=`M${a[0].toFixed(1)} ${a[1].toFixed(1)} A${ro} ${ro} 0 1 0 ${b[0].toFixed(1)} ${b[1].toFixed(1)} A${rc} ${rc} 0 0 0 ${c[0].toFixed(1)} ${c[1].toFixed(1)} A${ri} ${ri} 0 1 1 ${d[0].toFixed(1)} ${d[1].toFixed(1)} A${rc} ${rc} 0 0 0 ${a[0].toFixed(1)} ${a[1].toFixed(1)} Z`;
 return fade(g,`<path d="${path}" fill="#9aabc7" fill-opacity="${fo}" stroke="${G1.geo}" stroke-width="3"/>`);
}
// crossing mark: sign +1 (yellow) / −1 (red), with the outward normal (pink)
export function cross(x,y,sgn,{g=1,nx=0,ny=0,tx=36,ty=8}={}){
 const col=sgn>0?G1.hi:G1.bad;
 return fade(g,(nx||ny?arrow(x,y,x+46*nx,y+46*ny,{color:G1.n,w:4,head:11}):'')+dot(x,y,8,col)+label(sgn>0?'＋1':'−1',x+tx,y+ty,{size:28,color:col,weight:700}));
}
// ---- small cards ----------------------------------------------------------------------------------
const DEF=`${dOm}=\\frac{\\cos${al}\\,${dA}}{r^2}`;

export const ytUeGauss4Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=cShape({g:seg(p,.05,.3)})+charge(CSH.cx,CSH.cy-137,1,16);
  s+=fade(seg(p,.0,.2),closedPath(blobPts(105),940,262,{color:G1.geo,w:3})+charge(925,275,1,14));
  s+=fade(seg(p,.3,.5),L('凹んだ 面',CSH.cx,500,{size:26,color:G1.hi,weight:700})+L('いびつな 面',940,420,{size:26,color:G1.hi,weight:700}));
  s+=fade(seg(p,.45,.6),label('？',700,180,{size:80,color:G1.hi,weight:700,anchor:'middle'}));
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=cShape()+charge(CSH.cx,CSH.cy-137,1,16);
  s+=closedPath(blobPts(105),940,262,{color:G1.geo,w:3})+charge(925,275,1,14);
  s+=L('凹んだ 面',CSH.cx,500,{size:26,color:G1.hi,weight:700})+L('いびつな 面',940,420,{size:26,color:G1.hi,weight:700});
  s+=label('？',700,180,{size:80,color:G1.hi,weight:700,anchor:'middle'});
  return s;
 },
 [K+'recap']:(p)=>{
  let s=xsec(300,262,170,{dr:.5,ths:[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,-Math.PI/4,-Math.PI/2,-3*Math.PI/4]});
  s+=card(620,70,540,380,L('前回：ずれた 球（0 < d < R）',890,130,{size:26,color:C.dim})
   +TF(`${PHI}=\\frac{\\pi kQ}{d}\\,(2d+2d)`,890,220,{size:40,frac:true,g:seg(p,.1,.3)})
   +TF(`=4\\pi kQ=\\frac{Q}{\\varepsilon_0}`,890,330,{size:44,frac:true,box:true,g:seg(p,.45,.6)})
   +fade(seg(p,.6,.75),L('R も d も 消えた',890,420,{size:28,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=xsec(300,170,120,{dr:2.0,ths:[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,-Math.PI/4,-Math.PI/2,-3*Math.PI/4],kE:60,axis:false,labC:false,labO:false});
  s+=fade(seg(p,.25,.4),L('出る（＋）',420,70,{size:26,color:G1.hi,weight:700})+label('入る（−）',440,300,{size:26,color:G1.bad,weight:700}));
  s+=card(620,70,540,380,L('前回：電荷が 球の 外（d > R）',890,130,{size:26,color:C.dim})
   +TF(`${PHI}=0`,890,225,{size:48,box:true})
   +fade(seg(p,.3,.45),L('各点の 𝐄 は 0 ではない',890,320,{size:28,color:G1.E,weight:700}))
   +fade(seg(p,.55,.7),L('入る分と 出る分が 打ち消す',890,395,{size:28})),1);
  return s;
 },
 [K+'limit']:(p)=>{
  let s=card(110,60,980,400,L('前回の 計算で 使った 式',600,115,{size:26,color:C.dim})
   +TF('r^2=R^2+d^2+2Rd\\cos\\theta',600,205,{size:44,g:seg(p,.1,.25)})
   +TF(`${dA}=R^2\\sin\\theta\\,d\\theta\\,d\\varphi`,600,305,{size:44,g:seg(p,.35,.5)})
   +fade(seg(p,.6,.75),L('どちらも 球 だから 書けた 式',600,410,{size:32,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'shapes']:(p)=>{
  let s=fade(seg(p,0,.2),closedPath(blobPts(120),230,262,{color:G1.geo,w:3})+charge(215,275,1,14));
  s+=cShape({g:seg(p,.15,.35),o:{cx:600,cy:262,ro:160,ri:72,gap:40}})+fade(seg(p,.15,.35),charge(600,262-116,1,14));
  s+=fade(seg(p,.3,.5),`<path d="M900 120 C1060 80 1140 200 1060 260 C1000 300 1120 360 1040 420 C940 470 860 400 900 330 C930 280 820 220 900 120 Z" fill="#9aabc7" fill-opacity=".07" stroke="${G1.geo}" stroke-width="3"/>`+charge(980,190,1,14));
  s+=fade(seg(p,.5,.65),L('形ごとに 積分を 書き直す？',600,490,{size:30,color:G1.bad,weight:700}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=charge(OX,OY,1,18);
  s+=cone(500,40,800,{g:seg(p,.1,.3)});
  s+=pieceAt(OX+500,OY,80,A60,{gN:0,g:seg(p,0,.15)});
  s+=pieceAt(OX+800,OY,64/Math.cos(.5),.5,{gN:0,g:seg(p,.2,.35)});
  s+=fade(seg(p,.45,.6),L('電荷から 見た 見かけの 広がり',650,80,{size:30,color:CO,weight:700}));
  s+=fade(seg(p,.6,.75),L('＝ 立体角',650,135,{size:34,color:G1.hi,weight:700}));
  s+=fade(seg(p,.6,.75),L('形に よらない 量',OX+500,480,{size:26,color:C.dim}));
  return s;
 },
 // ===== S2 斜めの小片を正面に向ける =====
 [K+'piece']:(p)=>{
  const px=OX+500;
  let s=sideBase({px,ray:seg(p,.6,.75),rlab:seg(p,.6,.75)});
  s+=pieceAt(px,OY,80,A60,{gN:seg(p,.3,.45)});
  s+=fade(seg(p,.1,.25),label('dA',px-70,OY-60,{size:30,color:G1.A,weight:700}));
  s+=fade(seg(p,.35,.5),label('𝐧（外向き）',px+50,OY-90,{size:26,color:G1.n,weight:700}));
  s+=L('横から 見た 図',300,60,{size:24,color:C.dim});
  return s;
 },
 [K+'rhat']:(p)=>{
  const px=OX+500;
  let s=sideBase({px});
  s+=pieceAt(px,OY,80,A60)+label('dA',px-70,OY-60,{size:30,color:G1.A,weight:700});
  s+=rArrow(px,seg(p,.02,.15));
  s+=alphaArc(px,OY,A60,{g:seg(p,.3,.45),r:52});
  s+=card(840,330,330,120,TF(`\\left|${rh}\\right|=1`,1005,395,{size:36,frac:true}),seg(p,.1,.25));
  s+=card(840,60,330,170,L('α：小片の 傾き',1005,120,{size:28,color:G1.ang,weight:700})+fade(seg(p,.6,.75),L('球の 角 θ とは 別',1005,185,{size:26,color:C.dim})),seg(p,.4,.55));
  return s;
 },
 [K+'tilt']:(p)=>{
  const px=OX+500,a=A60*seg(p,.1,.6);
  let s=sideBase({px,rlab:0});
  s+=pieceAt(px,OY,80,a,{gN:1});
  s+=fade(seg(p,0,.1)*(1-seg(p,.15,.3)),label('正面を 向く',px-60,OY-120,{size:24,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,.6,.75),label('傾くと 狭く 見える',px+70,OY+150,{size:28,color:G1.hi,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),projSeg(px,80,A60)+projGuides(px,80,A60));
  return s;
 },
 [K+'proj']:(p)=>{
  const px=OX+500;
  let s=sideBase({px,rlab:0})+pieceAt(px,OY,80,A60)+alphaArc(px,OY,A60,{r:40});
  s+=projGuides(px,80,A60)+projSeg(px,80,A60,seg(p,.05,.2));
  s+=fade(seg(p,.1,.3),label('幅 × cos α',px-20,OY+80,{size:26,color:CPJ,weight:700,anchor:'end'}));
  // front view inset: gold rectangle w×h, purple (w cosα)×h
  const x0=900,w=200,h=100;
  s+=card(820,50,360,420,L('正面から 見た 小片',1000,90,{size:22,color:C.dim})
   +rect(x0,115,w,h,{fill:G1.A,fo:.18,stroke:G1.A,sw:3,rx:2})
   +fade(seg(p,.3,.5),rect(x0+w/4,285,w/2,h,{fill:CPJ,fo:.25,stroke:CPJ,sw:3,rx:2}))
   +fade(seg(p,.35,.5),label('幅 × cos α',x0+w/2,262,{size:24,color:CPJ,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('高さは そのまま',x0+w/2,435,{size:24,color:C.ink,anchor:'middle'})),1);
  return s;
 },
 [K+'projA']:(p)=>{
  const px=OX+500;
  let s=sideBase({px,rlab:0})+pieceAt(px,OY,80,A60)+alphaArc(px,OY,A60,{r:40})+projGuides(px,80,A60)+projSeg(px,80,A60);
  s+=label('dA⊥',px+16,OY-60,{size:28,color:CPJ,weight:700});
  s+=card(760,70,420,370,TF(`${dAp}=\\cos${al}\\,${dA}`,970,170,{size:40,box:true,g:seg(p,.05,.2)})
   +fade(seg(p,.5,.65),TF(`=\\Big(${rh}\\cdot${vn}\\Big)${dA}`,970,320,{size:40,frac:true})),1);
  return s;
 },
 [K+'projnum']:(p)=>{
  const px=OX+500;
  let s=sideBase({px,rlab:0})+pieceAt(px,OY,80,A60)+alphaArc(px,OY,A60,{r:40})+projGuides(px,80,A60)+projSeg(px,80,A60);
  s+=card(760,50,420,410,TF(`${dA}=0.01\\,\\mathrm{m^2}`,970,120,{size:36})
   +TF(`${al}=60^\\circ,\\ \\cos 60^\\circ=0.5`,970,200,{size:34,g:seg(p,.2,.35)})
   +TF(`${dAp}=0.5\\times 0.01`,970,300,{size:36,g:seg(p,.5,.62)})
   +TF(`=0.005\\,\\mathrm{m^2}`,990,385,{size:38,box:true,g:seg(p,.62,.75)}),1);
  return s;
 },
 [K+'sign']:(p)=>{
  const px=OX+500,a=Math.PI*0.75;
  let s=sideBase({px,rlab:0});
  s+=pieceAt(px,OY,80,a)+rArrow(px)+alphaArc(px,OY,a,{r:44});
  s+=fade(seg(p,.1,.25),label('法線が 電荷の 側',px-30,OY-130,{size:26,color:G1.n,weight:700,anchor:'end'}));
  s+=card(760,50,420,170,TF(`${al}>90^\\circ\\ \\Rightarrow\\ \\cos${al}<0`,970,115,{size:36,g:seg(p,.25,.4)})
   +fade(seg(p,.55,.7),L('符号付きの 面積',970,185,{size:28,color:G1.hi,weight:700})),1);
  return s;
 },
 // ===== S3 半径1の球へ縮める =====
 [K+'cone']:(p)=>{
  const px=OX+500,h=40;
  let s=charge(OX,OY,1,18)+pieceAt(px,OY,80,A60,{gN:0})+projSeg(px,80,A60,.6);
  s+=cone(500,h,500,{g:seg(p,.1,.35)});
  s+=fade(seg(p,.45,.6),cone(500,h,700,{fill:false}));
  s+=fade(seg(p,.5,.65),L('細い 円錐の 束',OX+380,120,{size:28,color:CO,weight:700}));
  return s;
 },
 [K+'shrink']:(p)=>{
  const px=OX+500,h=40;
  let s=charge(OX,OY,1,18)+cone(500,h,560)+pieceAt(px,OY,80,A60,{gN:0})+projSeg(px,80,A60);
  s+=unitArc(500,h,{g:seg(p,.15,.35)});
  s+=fade(seg(p,.2,.35),label('半径 1',OX+RU*.64+14,OY-RU*.77,{size:26,color:G1.geo,weight:700}));
  s+=fade(seg(p,.45,.6),line(OX,OY+110,OX+RU,OY+110,{color:C.ink,w:2})+label('1',OX+RU/2,OY+100,{size:26,anchor:'middle'})+line(OX,OY+165,px,OY+165,{color:C.ink,w:2})+label('r',(OX+px)/2,OY+155,{size:26,anchor:'middle'}));
  s+=card(830,60,340,130,L('長さ：1/r 倍',1000,140,{size:32,color:CO,weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'shrink2']:(p)=>{
  const px=OX+500,h=40;
  let s=charge(OX,OY,1,18)+cone(500,h,560)+pieceAt(px,OY,80,A60,{gN:0})+projSeg(px,80,A60)+unitArc(500,h);
  s+=card(800,50,380,400,L('長さ：1/r 倍',990,110,{size:28,color:CO})
   +fade(seg(p,.1,.3),L('2方向 → 面積：1/r² 倍',990,180,{size:28,color:CO,weight:700}))
   +fade(seg(p,.1,.3),rect(890,215,120,90,{fill:CPJ,fo:.25,stroke:CPJ,sw:3,rx:2})+rect(1040,245,60,45,{fill:CO,fo:.3,stroke:CO,sw:3,rx:2}))
   +TF(`\\frac{${dAp}}{r^2}`,990,390,{size:44,frac:true,box:true,g:seg(p,.5,.65)}),1);
  return s;
 },
 [K+'def']:(p)=>{
  const px=OX+500,h=40;
  let s=charge(OX,OY,1,18)+cone(500,h,560)+pieceAt(px,OY,80,A60,{gN:0})+projSeg(px,80,A60)+unitArc(500,h);
  s+=fade(seg(p,.05,.2),label('dΩ',OX+RU+18,OY-50,{size:30,color:CO,weight:700}));
  s+=card(760,60,420,390,L('立体角（定義）',970,100,{size:26,color:G1.hi,weight:700})
   +TF(`${dOm}=\\frac{${dAp}}{r^2}`,970,205,{size:42,frac:true,g:seg(p,.05,.2)})
   +TF(`=\\frac{\\cos${al}\\,${dA}}{r^2}`,990,335,{size:44,frac:true,box:true,g:seg(p,.3,.45)})+fade(seg(p,.7,.85),L('m² ÷ m² → 単位の ない 数',970,432,{size:24,color:C.dim}))
   ,1);
  return s;
 },
 [K+'rad']:(p)=>{
  // left: plane angle; right: solid angle
  const cx=220,cy=330,R=170,t=.5;
  let s=dot(cx,cy,7,C.ink)+ring(cx,cy,R,{color:G1.geo,w:2,dash:'6 7'});
  s+=line(cx,cy,cx+R*Math.cos(t),cy-R*Math.sin(t),{color:C.dim,w:2})+line(cx,cy,cx+R,cy,{color:C.dim,w:2});
  const arc=[];for(let i=0;i<=20;i++){const q=t*i/20;arc.push([cx+R*Math.cos(q),cy-R*Math.sin(q)]);}
  s+=draw(arc,1,{color:G1.ang,w:7})+label('半径 1',cx+40,cy+30,{size:24,color:G1.geo});
  s+=L('平面の 角',cx,90,{size:28,weight:700});
  s+=label('ラジアン ＝ 弧の長さ ÷ 半径',cx-150,150,{size:24,color:G1.ang});
  const {P,svg}=(()=>{const P=view(830,335,150,{tilt:.35,spin:.5});return {P,svg:surface(P,SPHERE,{g:1,fo:.05})+sphereOutline(830,335,150)};})();
  s+=fade(seg(p,.4,.55),svg+patch(P,SPHERE,15,40,-20,10,{color:CO,fo:.45})+L('立体角',830,90,{size:28,weight:700})+label('＝ 半径1の 球の 上の 面積',650,150,{size:24,color:CO}));
  return s;
 },
 [K+'num']:(p)=>{
  const px=OX+500,h=40;
  let s=charge(OX,OY,1,18)+cone(500,h,560)+pieceAt(px,OY,80,A60,{gN:0})+projSeg(px,80,A60)+unitArc(500,h);
  s+=label('r ＝ 2 m',OX+250,OY+150,{size:26,anchor:'middle'});
  s+=card(760,60,420,390,TF(`${dOm}=\\frac{0.005}{2^2}`,970,150,{size:42,frac:true,g:seg(p,.05,.2)})
   +TF(`=0.00125\\,\\mathrm{sr}`,970,265,{size:42,box:true,g:seg(p,.3,.45)})
   +fade(seg(p,.35,.5),L('sr：単位の ない 数の 目印',970,330,{size:24,color:C.dim}))+fade(seg(p,.6,.75),L('半径1の 球の 上で',970,375,{size:26})+L('0.00125 m² の 広さ',970,420,{size:28,color:CO,weight:700})),1);
  return s;
 },
 [K+'same']:(p)=>{
  const h=40;
  let s=charge(OX,OY,1,18)+cone(500,h,980)+unitArc(500,h);
  s+=pieceAt(OX+500,OY,80,A60,{gN:0});
  s+=pieceAt(OX+900,OY,72*Math.cos(0)/Math.cos(.6)*1,.6,{gN:0,g:seg(p,.1,.3)});
  s+=fade(seg(p,.1,.3),label('遠くて 傾いた 小片',OX+900,OY+190,{size:24,color:G1.A,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),label('面積は 違う',OX+700,90,{size:28,color:G1.A,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('dΩ は 同じ',OX+RU+20,OY-120,{size:30,color:CO,weight:700}));
  return s;
 },
 // ===== S4 クーロンの電場を入れる =====
 [K+'coul']:(p)=>{
  const px=OX+500;
  let s=sideBase({px,rlab:1})+pieceAt(px,OY,80,A60)+alphaArc(px,OY,A60,{r:40});
  s+=fade(seg(p,.3,.45),arrow(px,OY,px+120,OY,{color:G1.E,w:6,head:16})+label('𝐄',px+128,OY+10,{size:30,color:G1.E,weight:700}));
  s+=card(770,60,410,180,TF(`${vE}=kQ\\,\\frac{${rh}}{r^2}`,975,150,{size:42,frac:true,box:true,g:seg(p,.2,.35)}),1);
  return s;
 },
 [K+'dot']:(p)=>{
  const lt=`${vE}\\cdot${vn}\\,${dA}=kQ\\,`,rt=`\\frac{${rh}\\cdot${vn}\\,${dA}}{r^2}`,sz=46;
  const wl=texWidth(lt,sz,false),wr=texWidth(rt,sz,false),x0=600-(wl+wr)/2;
  let s=card(80,60,1040,400,TF(lt,x0+wl/2,175,{size:sz,g:seg(p,0,.2)})+TF(rt,x0+wl+wr/2,175,{size:sz,frac:true,g:seg(p,0,.2)})
   +fade(seg(p,.45,.6),highlight(x0+wl-14,175-sz*1.95,wr+28,sz*3.0,1,CO))
   +fade(seg(p,.55,.7),TF(`=kQ\\,${dOm}`,600,370,{size:48,box:true})),1);
  return s;
 },
 [K+'res']:(p)=>{
  const h=40;
  let s=charge(OX,OY,1,18)+cone(500,h,560)+unitArc(500,h)+pieceAt(OX+500,OY,80,A60,{gN:0});
  s+=card(730,80,450,340,TF(`d${PHI}=kQ\\,${dOm}`,955,200,{size:50,box:true})
   +fade(seg(p,.4,.6),L('見かけの 広がり × kQ',955,330,{size:30,color:CO,weight:700})),1);
  return s;
 },
 [K+'numE']:(p)=>{
  let s=card(80,40,1040,430,L('r ＝ 2 m、α ＝ 60°、dA ＝ 0.01 m²',600,95,{size:28,color:C.dim})
   +TF(`E=\\frac{kQ}{r^2}=\\frac{kQ}{2^2}=\\frac{kQ}{4}`,600,290,{size:54,frac:true,box:true,g:seg(p,.2,.4)}),1);
  return s;
 },
 [K+'numE2']:(p)=>{
  let s=card(80,40,1040,430,L('r ＝ 2 m、α ＝ 60°、dA ＝ 0.01 m²',600,95,{size:28,color:C.dim})
   +TF(`E=\\frac{kQ}{4}`,300,190,{size:36,frac:true})
   +TF(`${vE}\\cdot${vn}=\\frac{kQ}{4}\\times 0.5=\\frac{kQ}{8}`,700,190,{size:36,frac:true,g:seg(p,.0,.15)})
   +TF(`${vE}\\cdot${vn}\\,${dA}=\\frac{kQ}{8}\\times 0.01=0.00125\\,kQ`,600,300,{size:38,frac:true,g:seg(p,.25,.4)})
   +TF(`kQ\\,${dOm}=kQ\\times 0.00125`,600,400,{size:38,box:true,g:seg(p,.6,.75)})
   +fade(seg(p,.75,.9),label('一致',900,412,{size:32,color:G1.ok,weight:700})),1);
  return s;
 },
 [K+'why']:(p)=>{
  // 同じ束（同じ dΩ）を r と 2r で切って比べる。断面の幅は2倍（面積は4倍）、電場は 1/4。
  const D1=220,h1=40,x1=OX+D1,x2=OX+2*D1;
  let s=charge(OX,OY,1,18)+cone(D1,h1,2*D1+40);
  s+=fade(seg(p,.05,.2),line(x1,OY-h1,x1,OY+h1,{color:CPJ,w:8})+label('距離 r',x1,OY+h1+44,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),line(x2,OY-2*h1,x2,OY+2*h1,{color:CPJ,w:8})+label('距離 2r',x2,OY+2*h1+44,{size:24,color:C.ink,anchor:'middle'})
   +label('幅 2倍 → 面積 4倍',x2,OY-2*h1-24,{size:24,color:CPJ,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),arrow(x1+10,OY,x1+130,OY,{color:G1.E,w:7,head:18})+arrow(x2+10,OY,x2+40,OY,{color:G1.E,w:7,head:14})
   +label('電場 1/4',x2+24,OY+44,{size:24,color:G1.E,weight:700}));
  s+=card(800,70,400,420,L('同じ束（同じ dΩ）',1000,120,{size:26,color:CO,weight:700})
   +TF(`${dAp}\\propto r^2`,1000,190,{size:40,g:seg(p,.2,.35)})
   +TF(`E\\propto\\frac{1}{r^2}`,1000,280,{size:40,frac:true,g:seg(p,.4,.55)})
   +TF(`E\\,${dAp}`,1000,370,{size:42,box:true,g:seg(p,.65,.8)})
   +fade(seg(p,.75,.9),L('変わらない',1000,462,{size:26,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'why2']:(p)=>{
  let s=card(80,60,1040,380,TF(`E\\,${dAp}=\\frac{kQ}{r^2}\\times r^2\\,${dOm}=kQ\\,${dOm}`,600,140,{size:40,frac:true})
   +TF(`${vE}\\cdot${vn}=E\\cos${al}`,600,250,{size:40,g:seg(p,.45,.6)})
   +TF(`${dOm}=\\frac{\\cos${al}\\,${dA}}{r^2}`,600,350,{size:40,frac:true,g:seg(p,.45,.6)})
   +fade(seg(p,.7,.85),L('同じ cos α が 立体角に 入っている',600,420,{size:28,color:G1.ang,weight:700})),1);
  return s;
 },
 [K+'inv']:(p)=>{
  let s=card(80,60,500,380,L('逆2乗 1/r²',330,130,{size:30,color:G1.ok,weight:700})+TF(`d${PHI}=kQ\\,${dOm}`,330,250,{size:40})+L('距離に よらない',330,350,{size:26}),1,G1.ok);
  s+=fade(seg(p,.15,.3),card(620,60,500,380,L('もし 1/r³ なら',870,130,{size:30,color:G1.bad,weight:700})+TF(`d${PHI}\\propto\\frac{${dOm}}{r}`,870,250,{size:40,frac:true})+L('距離が 残る',870,350,{size:26}),1,G1.bad));
  s+=fade(seg(p,.55,.7),L('使ったのは クーロンの法則と 図形だけ',600,490,{size:26,color:G1.hi,weight:700}));
  return s;
 },
 // ===== S5 半直線で出入りを数える =====
 [K+'total']:(p)=>{
  let s=cShape()+charge(CSH.cx,CSH.cy-137,1,16);
  s+=card(720,80,450,350,TF(`${PHI}=kQ\\,${OI}${dOm}`,945,200,{size:44,box:true,g:seg(p,.05,.2)})
   +fade(seg(p,.5,.65),TF(`${OI}${dOm}=\\;?`,945,340,{size:40})),1);
  return s;
 },
 [K+'ray']:(p)=>{
  const qx=CSH.cx,qy=CSH.cy-137;
  let s=cShape()+charge(qx,qy,1,16);
  const t=seg(p,.05,.4);
  s+=fade(seg(p,.05,.1),arrow(qx,qy+18,qx,qy+18+(500-qy-18)*t,{color:C.ink,w:3,head:12}));
  s+=fade(seg(p,.4,.6),poly([[qx,qy],[qx-24,505],[qx+24,505]],{fill:CO,fo:.12})+line(qx,qy,qx-24,505,{color:CO,w:2})+line(qx,qy,qx+24,505,{color:CO,w:2}));
  s+=fade(seg(p,.6,.75),label('横切る たびに 同じ 大きさの dΩ',760,140,{size:26,color:CO,weight:700}));
  return s;
 },
 [K+'signrule']:(p)=>{
  // left: exit; right: enter (side views)
  let s=card(60,50,520,410,L('外へ 出る',320,100,{size:30,color:G1.hi,weight:700}),1);
  s+=line(320,140,320,340,{color:G1.geo,w:4})+label('内',230,330,{size:26,color:C.dim})+label('外',390,330,{size:26,color:C.dim});
  s+=arrow(150,275,320,275,{color:C.ink,w:3,head:12})+arrow(320,275,420,275,{color:C.ink,w:5,head:14})+label('𝐫/r',430,262,{size:24,color:C.ink});
  s+=arrow(320,275,390,215,{color:G1.n,w:5,head:13,g:1})+label('𝐧',398,210,{size:26,color:G1.n,weight:700});
  s+=fade(seg(p,.2,.35),L('cos α > 0 → ＋',320,415,{size:30,color:G1.hi,weight:700}));
  s+=fade(seg(p,.5,.6),card(620,50,520,410,L('中へ 入る',880,100,{size:30,color:G1.bad,weight:700})
   +line(880,140,880,340,{color:G1.geo,w:4})+label('外',800,330,{size:26,color:C.dim})+label('内',950,330,{size:26,color:C.dim})
   +arrow(710,275,880,275,{color:C.ink,w:3,head:12})+arrow(880,275,980,275,{color:C.ink,w:5,head:14})+label('𝐫/r',990,262,{size:24,color:C.ink})
   +arrow(880,275,810,215,{color:G1.n,w:5,head:13})+label('𝐧',790,205,{size:26,color:G1.n,weight:700})
   +fade(seg(p,.65,.8),L('cos α < 0 → −',880,415,{size:30,color:G1.bad,weight:700}))));
  return s;
 },
 [K+'inside']:(p)=>{
  const qx=CSH.cx,qy=CSH.cy-137;
  let s=cShape()+charge(qx,qy,1,16)+label('中の 電荷',qx-30,qy-30,{size:24,color:C.p,anchor:'end'});
  s+=fade(seg(p,.05,.3),arrow(qx,qy-18,qx,40,{color:C.ink,w:3,head:12}));
  s+=cross(qx,CSH.cy-CSH.ro,1,{g:seg(p,.2,.35),nx:0,ny:-1,tx:16,ty:30});
  s+=fade(seg(p,.4,.55),arrow(qx,qy+18,qx,505,{color:C.ink,w:3,head:12}));
  s+=cross(qx,CSH.cy-CSH.ri,1,{g:seg(p,.5,.6),nx:0,ny:1,tx:14,ty:-6});
  s+=cross(qx,CSH.cy+CSH.ri,-1,{g:seg(p,.65,.75),nx:0,ny:-1,tx:14,ty:30});
  s+=cross(qx,CSH.cy+CSH.ro,1,{g:seg(p,.8,.9),nx:0,ny:1,tx:14,ty:-6});
  return s;
 },
 [K+'inside2']:(p)=>{
  const qx=CSH.cx,qy=CSH.cy-137;
  let s=cShape()+charge(qx,qy,1,16);
  s+=arrow(qx,qy+18,qx,505,{color:C.ink,w:3,head:12});
  s+=cross(qx,CSH.cy-CSH.ri,1,{tx:14,ty:-6})+cross(qx,CSH.cy+CSH.ri,-1,{tx:14,ty:30})+cross(qx,CSH.cy+CSH.ro,1,{tx:14,ty:-6});
  s+=card(720,80,450,340,TF('+1-1+1=+1',945,190,{size:46,g:seg(p,.05,.2)})
   +fade(seg(p,.45,.6),L('遠くでは 必ず 外',945,290,{size:28}))
   +fade(seg(p,.6,.75),L('どの 方向も 正味 ＋1 回',945,360,{size:30,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'outside']:(p)=>{
  const qx=60,qy=CSH.cy;
  let s=cShape()+charge(qx,qy,1,16)+label('外の 電荷',qx-10,qy-34,{size:24,color:C.p});
  s+=fade(seg(p,.05,.3),arrow(qx+18,qy,700,qy,{color:C.ink,w:3,head:12}));
  s+=cross(CSH.cx-CSH.ro,qy,-1,{g:seg(p,.25,.35),nx:-1,ny:0,tx:-12,ty:-20});
  s+=cross(CSH.cx-CSH.ri,qy,1,{g:seg(p,.4,.5),nx:1,ny:0,tx:-10,ty:-20});
  s+=card(760,80,410,330,TF('-1+1=0',965,190,{size:46,g:seg(p,.45,.6)})
   +fade(seg(p,.7,.85),L('横切らない 方向：0',965,320,{size:28})),1);
  return s;
 },
 [K+'quiz']:(p)=>{
  const qx=CSH.cx,qy=32;
  let s=cShape()+charge(qx,qy,1,16)+label('外の 電荷',qx+26,qy+10,{size:24,color:C.p});
  s+=arrow(qx,qy+18,qx,505,{color:C.ink,w:3,head:12});
  for(const y of [CSH.cy-CSH.ro,CSH.cy-CSH.ri,CSH.cy+CSH.ri,CSH.cy+CSH.ro])s+=dot(qx,y,8,C.ink);
  s+=card(760,100,410,260,L('4回 横切る',965,180,{size:32,weight:700})+L('正味は？',965,260,{size:36,color:G1.hi,weight:700}),seg(p,.1,.25),G1.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  const qx=CSH.cx,qy=32;
  let s=cShape()+charge(qx,qy,1,16);
  s+=arrow(qx,qy+18,qx,505,{color:C.ink,w:3,head:12});
  s+=cross(qx,CSH.cy-CSH.ro,-1,{g:seg(p,.0,.1),tx:14,ty:-6})+cross(qx,CSH.cy-CSH.ri,1,{g:seg(p,.1,.2),tx:14,ty:30})
   +cross(qx,CSH.cy+CSH.ri,-1,{g:seg(p,.2,.3),tx:14,ty:-6})+cross(qx,CSH.cy+CSH.ro,1,{g:seg(p,.3,.4),tx:14,ty:30});
  s+=card(760,100,410,260,TF('-1+1-1+1=0',965,200,{size:40,g:seg(p,.35,.5)})+fade(seg(p,.6,.75),L('正味 0 回',965,290,{size:32,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'lines']:(p)=>{
  const qx=CSH.cx,qy=CSH.cy-137;
  let s=cShape({g:1})+charge(qx,qy,1,16);
  s+=arrow(qx,qy+18,qx,505,{color:G1.E,w:3,head:12});
  s+=card(720,60,450,180,L('初級：電気力線の 本数',945,120,{size:26,color:C.dim})+L('（数えるための 絵）',945,180,{size:24,color:C.dim}),1);
  s+=fade(seg(p,.45,.6),card(720,270,450,190,L('上級：立体角という 量',945,330,{size:28,color:CO,weight:700})+TF(`d${PHI}=kQ\\,${dOm}`,945,410,{size:36}),1,CO));
  return s;
 },
 [K+'full']:(p)=>{
  const P=view(330,262,180,{tilt:.35,spin:.5});
  let s=surface(P,SPHERE,{fo:.06})+sphereOutline(330,262,180)+fade(seg(p,.05,.2),charge(330,262,1,14));
  s+=label('半径 1',420,470,{size:26,color:G1.geo});
  s+=card(620,50,550,420,L('全方向の 立体角',895,105,{size:28,weight:700})
   +TF('\\int_0^{2\\pi}\\!\\!\\int_0^{\\pi}\\sin\\theta\\,d\\theta\\,d\\varphi',895,200,{size:38,g:seg(p,.15,.3)})
   +TF('=4\\pi R^2\\Big|_{R=1}=4\\pi',895,300,{size:40,box:true,g:seg(p,.3,.45)})
   +fade(seg(p,.6,.75),L('円周の 2π ではない',895,400,{size:28,color:G1.bad,weight:700})),1);
  return s;
 },
 [K+'result']:(p)=>{
  let s=card(60,50,530,410,L('電荷が 内側',325,105,{size:30,color:G1.hi,weight:700})
   +TF(`${PHI}=kQ\\times 4\\pi\\times(+1)`,325,200,{size:34})
   +TF('=4\\pi kQ=\\frac{Q}{\\varepsilon_0}',325,320,{size:40,frac:true,box:true,g:seg(p,.15,.3)}),1,G1.hi);
  s+=fade(seg(p,.4,.55),card(620,50,530,410,L('電荷が 外側',885,105,{size:30,color:C.dim,weight:700})+TF(`${PHI}=kQ\\times 4\\pi\\times 0=0`,885,230,{size:34})));
  s+=fade(seg(p,.65,.8),L('どんな 形でも、前回の 球と 同じ',600,500,{size:26,color:G1.hi,weight:700}));
  return s;
 },
 [K+'cond']:(p)=>{
  let s=card(80,60,1040,390,L('条件',600,115,{size:28,color:C.dim})
   +L('電荷は 面の 上に 置かない',600,200,{size:32,weight:700})
   +fade(seg(p,.45,.6),L('面を かすめる だけの 方向：広がり 0',600,300,{size:30}))
   +fade(seg(p,.6,.75),L('→ 合計に 効かない',600,380,{size:30,color:G1.hi,weight:700})),1);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  const h=40;
  let s=charge(OX,OY,1,18)+cone(500,h,560)+unitArc(500,h)+pieceAt(OX+500,OY,80,A60,{gN:0});
  s+=card(730,60,450,390,TF(DEF,955,170,{size:40,frac:true})
   +TF(`d${PHI}=kQ\\,${dOm}`,955,320,{size:44,box:true,g:seg(p,.4,.55)}),1);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(60,60,530,380,L('中に 電荷 1個',325,120,{size:28,color:G1.hi,weight:700})+qin(`${OI}${vE}\\cdot${vn}\\,${dA}`,325,280,{size:40,box:true}),1,G1.hi);
  s+=card(620,60,530,380,L('外に 電荷 1個',885,120,{size:28,color:C.dim,weight:700})+TF(`${OI}${vE}\\cdot${vn}\\,${dA}=0`,885,280,{size:40}),seg(p,.3,.45));
  s+=fade(seg(p,.55,.7),L('どんな 形の 閉じた 面でも',600,490,{size:28,color:G1.hi,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=cShape({o:{cx:330,cy:262,ro:190,ri:85,gap:40}});
  s+=charge(330,262-137,1,16)+charge(220,330,-1,16)+charge(330,262+137,1,16)+charge(660,150,-1,16)+charge(600,420,1,16);
  s+=card(760,120,410,260,L('電荷が 何個も',965,200,{size:30,weight:700})+L('正と 負が 混ざると？',965,280,{size:30,color:G1.hi,weight:700}),seg(p,.1,.3),G1.hi);
  return s;
 },
};
