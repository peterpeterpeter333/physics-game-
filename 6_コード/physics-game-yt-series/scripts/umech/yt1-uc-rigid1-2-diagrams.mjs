// YouTube シリーズ「慣性モーメント・上級 2/3」(ys-uc-rigid1-2) — 図。Stage 1200×515.
// 色：z 水色、R 白、密度 ρ 砂色（DEN）、1枚の円板 黄、I の結果 黄枠。
// 数値：1−2/3＋1/5＝8/15、ρπ＝3M/(4R³)、I＝(2/5)MR²。M＝2、R＝0.3 → 0.072。坂 v²：球 8.57、円板 8、輪 6。
import {C,seg,lin,fade,mix,clamp,label,line,rect,dot,ring,arrow,draw,poly,texWidth} from './anim.mjs';
import {card,T,cc} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {cX,cH,cA,L,boxT} from './yt1-uc-shm-1-diagrams.mjs';
import {DEN,BODY,tz,tdm,rh,KGM2,axisDot,vAxis,ringTop,discTop,discPersp,spherePersp,ratioBars,strike,rowT} from './yt1-uc-rigid1-1-diagrams.mjs';

const K='uc-rigid1-2:';
const n2=v=>Number(v.toFixed(2));
const RZ=`(R^2-${tz}^2)`;

// sphere (side view) with slices; zs = height of the highlighted slice (in units of R)
function sphere(cx,cy,R,{slices=0,g=1,zs=null,tri=0,axis=true,zAxis=false,dz=true,hiCol=C.hi}={}){
 let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${BODY}" fill-opacity=".12" stroke="${BODY}" stroke-width="2"/>`;
 if(axis)s+=line(cx,cy-R-40,cx,cy+R+30,{color:C.dim,w:2.5,dash:'8 7'})+label('軸',cx+12,cy-R-22,{size:24,color:C.dim});
 for(let i=0;i<slices;i++){const z=-1+(i+.5)*2/slices,rr=R*Math.sqrt(1-z*z),y=cy-z*R,gi=clamp((g*slices-i)/1.5);if(gi<=0)continue;
  s+=fade(gi*.9,`<ellipse cx="${cx}" cy="${n2(y)}" rx="${n2(rr)}" ry="${n2(rr*.16)}" fill="${BODY}" fill-opacity=".25" stroke="${C.x}" stroke-width="1.2" stroke-opacity=".7"/>`);}
 if(zs!==null){const y=cy-zs*R,rr=R*Math.sqrt(1-zs*zs),h=dz?16:6;
  s+=`<ellipse cx="${cx}" cy="${n2(y+h/2)}" rx="${n2(rr)}" ry="${n2(rr*.16)}" fill="${hiCol}" fill-opacity=".35" stroke="${hiCol}" stroke-width="2"/>`
   +rect(cx-rr,y-h/2,2*rr,h,{fill:hiCol,fo:.45,stroke:'none',rx:0})
   +`<ellipse cx="${cx}" cy="${n2(y-h/2)}" rx="${n2(rr)}" ry="${n2(rr*.16)}" fill="${hiCol}" fill-opacity=".55" stroke="${hiCol}" stroke-width="2"/>`;
  if(tri>0){s+=fade(tri,line(cx,cy,cx+rr,y,{color:C.ink,w:3.5})+line(cx,cy,cx,y,{color:C.x,w:4})+line(cx,y,cx+rr,y,{color:C.hi,w:4})+dot(cx,cy,6,C.ink)
   +label('R',cx+rr/2+18,(cy+y)/2+24,{size:30,color:C.ink,weight:700})+label('z',cx-28,(cy+y)/2+10,{size:30,color:C.x,weight:700})+label('半径',cx+rr/2+40,y-44,{size:24,color:C.hi,anchor:'middle',weight:700}));}
 }
 if(zAxis){s+=dot(cx,cy,6,C.ink)+label('z ＝ 0',cx-16,cy+8,{size:24,color:C.x,anchor:'end'})+label('z ＝ R',cx-16,cy-R+8,{size:24,color:C.x,anchor:'end'})+label('z ＝ −R',cx-16,cy+R+8,{size:24,color:C.x,anchor:'end'});}
 return s;
}
// rolling race on a slope (中級 18-2：2gh＝12 → v² 球 8.57、円板 8、輪 6)
function race(p){
 const x0=100,y0=90,x1=720,y1=440,Lp=Math.hypot(x1-x0,y1-y0),ux=(x1-x0)/Lp,uy=(y1-y0)/Lp,nx=uy,ny=-ux;
 let s=poly([[x0,y0],[x1,y1],[x0,y1]],{fill:'#24314b',fo:1,stroke:C.dim,sw:2});
 const u=clamp(p/.8),D0=Lp*.82*u*u;
 const put=(f,kind,col)=>{const d=D0*f,R=26,cx=x0+ux*(d+30)+nx*R,cy=y0+uy*(d+30)+ny*R,th=d/R;
  let q=kind==='ring'?ringTop(cx,cy,R-4,{w:7,col}):`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${R}" fill="${col}" fill-opacity="${kind==='ball'?.55:.3}" stroke="${col}" stroke-width="2.5"/>`;
  return q+line(cx,cy,cx+R*Math.cos(th),cy+R*Math.sin(th),{color:C.ink,w:2.5});};
 // accelerations ∝ 1/(1+k): ball 1/1.4, disc 1/1.5, ring 1/2 → scale to ball=1
 s+=put(.7,'ring','#c9a7ff')+put(1.4/1.5,'disc',C.x)+put(1,'ball',C.E);
 return s;
}

export const ytUcRigid12Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  let s=sphere(330,260,200,{slices:12,g:seg(p,.05,.6)});
  s+=card(660,120,480,260,L('前回の 最後の 問い',900,170,{size:24,color:C.dim})+L('薄い 円板を 積み重ねると',900,240,{size:30})+T('\\dfrac{2}{5}',840,320,{size:44})+label('は どこから？',880,330,{size:30,color:C.hi,weight:700}),seg(p,0,.1),C.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  const col=(X,icon,name,f,g)=>fade(g,rect(X-170,60,340,400,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+icon+L(name,X,330,{size:28,weight:700})+T(f,X,410,{size:44}));
  let s=col(220,ringTop(220,190,90)+axisDot(220,190,{lab:''}),'輪','MR^2',seg(p,0,.1));
  s+=col(600,discTop(600,190,90)+axisDot(600,190,{lab:''}),'円板','\\dfrac{1}{2}MR^2',seg(p,.2,.3));
  s+=col(980,`<rect x="860" y="178" width="240" height="24" rx="4" fill="${BODY}" fill-opacity=".4" stroke="${BODY}" stroke-width="2"/>`+vAxis(980,110,270,''),'棒（真ん中）','\\dfrac{1}{12}Ml^2',seg(p,.45,.55));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=discPersp(270,270,170,{ph:6*p})+L('円板',270,470,{size:30,weight:700})+T('\\dfrac{1}{2}MR^2',270,90,{size:40});
  s+=spherePersp(930,270,170,{ph:6*p})+L('球',930,470,{size:30,weight:700})+T('?',930,70,{size:44});
  s+=L('同じ M、同じ R',600,60,{size:28,color:C.dim});
  s+=fade(seg(p,.3,.45),L('回しにくい？',600,230,{size:30,color:C.hi,weight:700})+L('回しやすい？',600,300,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=sphere(330,260,200,{slices:14,g:seg(p,.3,.8)});
  s+=card(660,90,480,320,L('部品：前回の 円板',900,140,{size:28,color:C.dim})+L('I ＝ ½ ×（質量）×（半径）²',900,240,{size:30,weight:700})+fade(seg(p,.4,.55),L('軸に 垂直に 輪切り',900,340,{size:30,color:C.hi,weight:700})),seg(p,0,.1));
  return s;
 },
 // ===== S2 =====
 [K+'axis']:(p)=>{
  let s=sphere(330,260,200,{zAxis:true,axis:false});
  s+=line(330,490,330,40,{color:C.dim,w:2.5,dash:'8 7'})+label('軸',345,500,{size:24,color:C.dim});
  s+=fade(seg(p,.4,.55),arrow(330,490,330,25,{color:C.x,w:3,head:14})+label('z',350,40,{size:30,color:C.x,weight:700}));
  s+=card(680,140,460,220,L('半径 R、質量 M の 一様な 球',910,200,{size:28})+L('中心を 通る 縦の 軸で 回す',910,280,{size:28,color:C.dim}),seg(p,0,.1));
  return s;
 },
 [K+'slice']:(p)=>{
  let s=sphere(330,260,200,{zs:.45});
  const y=260-.45*200;
  s+=label('z',300,(260+y)/2+10,{size:28,color:C.x,weight:700,anchor:'end'})+line(318,260,318,y,{color:C.x,w:3});
  s+=card(680,110,460,280,L('高さ z の 薄い 円板',910,170,{size:30,color:C.hi,weight:700})+label('厚さ',800,250,{size:28})+T(`d${tz}`,890,250,{size:36})+fade(seg(p,.4,.55),label('z は −R 〜 R',910,330,{size:28,color:C.x,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'pyth']:(p)=>{
  let s=sphere(330,260,200,{zs:.45,tri:seg(p,.1,.35)});
  s+=fade(seg(p,.5,.65),card(680,140,460,240,L('三平方の 定理',910,190,{size:26,color:C.dim})+label('（半径）² ＝',800,300,{size:32,color:C.hi,weight:700,anchor:'middle'})+T(`R^2-${tz}^2`,1000,290,{size:44}),1,C.hi));
  return s;
 },
 [K+'rho']:(p)=>{
  let s=sphere(330,260,200,{});
  for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){const X=330+i*42,Y=260+j*42;if(Math.hypot(i*42,j*42)<170){s+=fade(seg(p,.05,.3),rect(X-14,Y-14,28,28,{fill:DEN,fo:.4,stroke:DEN,sw:1.2,rx:2}));}}
  s+=card(680,120,460,260,L('どの 1 m³ も 同じ 質量',910,180,{size:28})+fade(seg(p,.45,.6),T(`${rh}`,850,280,{size:56})+label('密度',900,295,{size:32,color:DEN,weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'vol']:(p)=>{
  let s=sphere(250,260,190,{zs:.45,tri:1});
  s+=T(`\\pi${RZ}`,820,150,{size:46})+label('面積',820,215,{size:26,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.3,.45),T(`\\pi${RZ}\\,d${tz}`,820,340,{size:50})+label('面積 × 厚さ ＝ 体積',820,410,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'dm']:(p)=>{
  let s=sphere(250,260,190,{zs:.45});
  s+=T(`\\pi${RZ}\\,d${tz}`,820,130,{size:44,opacity:.8})+label('体積',820,195,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.2,.35),boxT(`${tdm}=${rh}\\,\\pi${RZ}\\,d${tz}`,820,340,46,1,C.hi));
  s+=fade(seg(p,.2,.35),label('密度 × 体積',820,440,{size:26,color:DEN,anchor:'middle'}));
  return s;
 },
 [K+'part']:(p)=>{
  let s=sphere(250,260,190,{slices:10,zs:.45});
  s+=card(520,60,640,330,L('前回の 円板',840,110,{size:26,color:C.dim})+L('I ＝ ½ ×（質量）×（半径）²',840,205,{size:32,weight:700})
   +fade(seg(p,.45,.6),L('どの 円板も 中心が 軸の 上',840,300,{size:28,color:C.hi,weight:700})+L('→ そのまま 使える',840,355,{size:28})),seg(p,0,.1));
  return s;
 },
 [K+'dI']:(p)=>{
  let s=sphere(250,260,190,{zs:.45,tri:1});
  s+=L('dI ＝ ½ ×（質量）×（半径）²',820,125,{size:32});
  s+=fade(seg(p,.25,.4),boxT(`dI=\\dfrac{1}{2}\\times ${tdm}\\times${RZ}`,820,320,44,1,C.hi,true));
  return s;
 },
 [K+'dI2']:(p)=>{
  let s=T(`dI=\\dfrac{1}{2}\\times ${tdm}\\times${RZ}`,600,80,{size:42,opacity:.85});
  s+=fade(seg(p,.05,.2),T(`${tdm}=${rh}\\,\\pi${RZ}\\,d${tz}`,600,180,{size:38}));
  s+=fade(seg(p,.25,.4),boxT(`dI=\\dfrac{1}{2}${rh}\\,\\pi\\,${RZ}^2\\,d${tz}`,600,330,48,1,C.hi,true));
  s+=fade(seg(p,.55,.7),L('R² − z² ： 質量 から 1回、 半径² から 1回',600,460,{size:28,color:C.dim}));
  return s;
 },
 // ===== S3 =====
 [K+'int']:(p)=>{
  const k=Math.floor(lin(p,.05,.7)*12);
  let s=sphere(250,260,190,{});
  for(let i=0;i<=Math.min(11,k);i++){const z=1-(i+.5)*2/12;s+=sphere(250,260,190,{zs:z,axis:false,dz:false,hiCol:i===k?C.hi:'#b9a45e'}).replace(/<circle[^>]*\/>/,'');}
  s+=boxT(`I=\\dfrac{1}{2}${rh}\\,\\pi\\int_{-R}^{R}${RZ}^2\\,d${tz}`,820,200,40,1,C.hi,true);
  s+=fade(seg(p,.3,.45),L('z ＝ −R から R まで 足す',820,370,{size:28,color:C.dim}));
  return s;
 },
 [K+'sym']:(p)=>{
  let s=sphere(250,260,190,{slices:12});
  s+=fade(seg(p,.05,.2),rect(60,70,380,190,{fill:C.hi,fo:.12,stroke:C.hi,sw:2,rx:8})+label('上 半分',250,105,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('下 半分 ＝ 上 半分',250,488,{size:26,color:C.dim,anchor:'middle'}));
  s+=T(`I=\\dfrac{1}{2}${rh}\\,\\pi\\int_{-R}^{R}${RZ}^2\\,d${tz}`,820,110,{size:36,opacity:.85});
  s+=fade(seg(p,.3,.45),L('½ × 2 ＝ 1',820,230,{size:28,color:C.dim}));
  s+=fade(seg(p,.45,.6),boxT(`I=${rh}\\,\\pi\\int_{0}^{R}${RZ}^2\\,d${tz}`,820,360,44,1,C.hi,true));
  return s;
 },
 [K+'expand']:(p)=>{
  let s=T(`${RZ}^2`,600,110,{size:50});
  s+=fade(seg(p,.2,.35),boxT(`=R^4-2R^2${tz}^2+${tz}^4`,600,290,54,1,C.hi));
  return s;
 },
 [K+'t1']:(p)=>{
  const R=rowT([`\\int_0^R R^4\\,d${tz}`,`-\\int_0^R 2R^2${tz}^2\\,d${tz}`,`+\\int_0^R ${tz}^4\\,d${tz}`],600,100,40,{gap:.3});
  let s=R.svg;
  s+=fade(seg(p,.2,.35),boxT('=R^4\\times R=R^5',R.pos[0].x,290,40,1,C.hi));
  s+=fade(seg(p,.1,.25),label('定数 × 長さ R',R.pos[0].x,200,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'t2']:(p)=>{
  const R=rowT([`\\int_0^R R^4\\,d${tz}`,`-\\int_0^R 2R^2${tz}^2\\,d${tz}`,`+\\int_0^R ${tz}^4\\,d${tz}`],600,100,40,{gap:.3});
  let s=R.svg+T('R^5',R.pos[0].x,290,{size:40});
  s+=fade(seg(p,.05,.2),label('z² → z³/3',R.pos[1].x,200,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),boxT('-\\dfrac{2}{3}R^5',R.pos[1].x,300,40,1,C.hi,true));
  return s;
 },
 [K+'t3']:(p)=>{
  const R=rowT([`\\int_0^R R^4\\,d${tz}`,`-\\int_0^R 2R^2${tz}^2\\,d${tz}`,`+\\int_0^R ${tz}^4\\,d${tz}`],600,100,40,{gap:.3});
  let s=R.svg+T('R^5',R.pos[0].x,290,{size:40})+T('-\\dfrac{2}{3}R^5',R.pos[1].x,300,{size:40});
  s+=fade(seg(p,.05,.2),label('z⁴ → z⁵/5',R.pos[2].x,200,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),boxT('+\\dfrac{1}{5}R^5',R.pos[2].x,300,40,1,C.hi,true));
  return s;
 },
 [K+'comb']:(p)=>{
  let s=T('R^5\\quad-\\dfrac{2}{3}R^5\\quad+\\dfrac{1}{5}R^5',600,100,{size:44,opacity:.85});
  s+=fade(seg(p,.15,.3),L('R⁵ で くくる',600,210,{size:28,color:C.dim}));
  s+=fade(seg(p,.3,.45),boxT(`I=${rh}\\,\\pi R^5\\left(1-\\dfrac{2}{3}+\\dfrac{1}{5}\\right)`,600,350,50,1,C.hi,true));
  return s;
 },
 [K+'frac']:(p)=>{
  let s=T('1-\\dfrac{2}{3}+\\dfrac{1}{5}',330,110,{size:48});
  s+=fade(seg(p,.1,.25),T('=\\dfrac{15-10+3}{15}',730,110,{size:48}));
  s+=fade(seg(p,.3,.45),T('=\\dfrac{8}{15}',1000,110,{size:48}));
  s+=fade(seg(p,.55,.7),boxT(`I=\\dfrac{8}{15}\\,${rh}\\,\\pi R^5`,600,340,56,1,C.hi,true));
  return s;
 },
 [K+'rhoM']:(p)=>{
  let s=sphere(250,260,190,{});
  s+=label('体積 ＝',680,140,{size:32,anchor:'middle'})+T('\\dfrac{4}{3}\\pi R^3',830,130,{size:46});
  s+=fade(seg(p,.4,.55),boxT(`M=\\dfrac{4}{3}\\pi R^3\\,${rh}`,820,330,50,1,C.hi,true));
  s+=fade(seg(p,.4,.55),label('質量 ＝ 体積 × 密度',820,450,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'vcheck']:(p)=>{
  let s=sphere(200,260,170,{slices:10});
  s+=T(`\\int_{-R}^{R}\\pi${RZ}\\,d${tz}`,760,90,{size:42});
  s+=fade(seg(p,.25,.4),T('=\\pi\\left(2R^3-\\dfrac{2R^3}{3}\\right)',760,230,{size:42}));
  s+=fade(seg(p,.5,.65),boxT('=\\dfrac{4}{3}\\pi R^3',760,385,46,1,C.F,true)+label('✓',935,395,{size:34,color:C.F,weight:700}));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(`M=\\dfrac{4}{3}\\pi R^3\\,${rh}`,330,100,{size:42,opacity:.85});
  s+=fade(seg(p,.05,.2),T(`\\to\\ ${rh}\\,\\pi=\\dfrac{3M}{4R^3}`,800,100,{size:42}));
  s+=fade(seg(p,.4,.55),boxT('I=\\dfrac{8}{15}\\times\\dfrac{3M}{4R^3}\\times R^5',600,330,50,1,C.hi,true));
  return s;
 },
 [K+'res']:(p)=>{
  let s=T('I=\\dfrac{8}{15}\\times\\dfrac{3M}{4R^3}\\times R^5',600,90,{size:44});
  s+=fade(seg(p,.05,.2),T('\\dfrac{8\\times3}{15\\times4}=\\dfrac{24}{60}=\\dfrac{2}{5}',380,240,{size:40}));
  s+=fade(seg(p,.3,.42),T('\\dfrac{R^5}{R^3}=R^2',880,240,{size:40}));
  s+=fade(seg(p,.55,.67),boxT('I=\\dfrac{2}{5}MR^2',600,420,54,1,C.hi,true));
  return s;
 },
 // ===== S4 =====
 [K+'num']:(p)=>{
  let s=card(100,40,1000,190,L('球　M ＝ 2 kg、R ＝ 0.3 m',600,90,{size:28,color:C.dim})+T(`I=0.4\\times 2\\times 0.3^2=0.072${KGM2}`,600,170,{size:44}),seg(p,0,.08),C.E);
  s+=card(100,270,1000,170,L('前回の 円板',600,315,{size:28,color:C.dim})+T(`I=0.09${KGM2}`,600,390,{size:44}),seg(p,.5,.6),C.x);
  return s;
 },
 [K+'bars']:(p)=>{
  let s=ratioBars([['輪',1,'#c9a7ff','1'],['円板',.5,C.x,'0.5',seg(p,.1,.22)],['球',.4,C.E,'0.4',seg(p,.25,.37)]],{x:300,y:120,unit:600,gap:100});
  s+=L('I ÷ (MR²)',600,50,{size:28,color:C.dim});
  s+=fade(seg(p,.55,.7),L('球が いちばん 回しやすい',600,450,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  let s=sphere(300,260,200,{slices:12});
  [.85,-.85].forEach(z=>{s+=fade(seg(p,.05,.25),sphere(300,260,200,{zs:z,axis:false,dz:false}).replace(/<circle[^>]*\/>/,''));});
  s+=fade(seg(p,.05,.25),label('小さな 円板',540,260-.85*200+8,{size:26,color:C.hi})+label('小さな 円板',540,260+.85*200+8,{size:26,color:C.hi}));
  s+=card(680,170,480,180,L('上と 下 ＝ 軸の 近く',920,230,{size:28})+L('→ 質量が 軸に 近い',920,300,{size:30,color:C.hi,weight:700}),seg(p,.4,.52));
  return s;
 },
 [K+'trap']:(p)=>{
  const cx=330,cy=260,R=200;
  let s=sphere(cx,cy,R,{});
  s+=dot(cx,cy,6,C.ink)+fade(seg(p,.15,.3),line(cx,cy,cx,cy-R,{color:C.a,w:3.5,dash:'7 6'})+label('中心から R',cx+16,cy-R/2,{size:26,color:C.a}));
  s+=fade(seg(p,.15,.3),dot(cx,cy-R,10,C.hi));
  s+=fade(seg(p,.5,.65),card(680,140,460,220,L('一番 上の 点',910,195,{size:28,color:C.hi,weight:700})+L('軸からの 距離 ＝ 0',910,275,{size:32,weight:700})),1);
  return s;
 },
 [K+'trap2']:(p)=>{
  const cx=330,cy=260,R=200,a=-.7,px=cx+R*.75*Math.sin(-a),py=cy-R*.75*Math.cos(-a)*0-R*.4;
  let s=sphere(cx,cy,R,{});
  const X=cx+150,Y=cy-110;
  s+=dot(cx,cy,6,C.ink)+dot(X,Y,9,C.hi);
  s+=line(cx,cy,X,Y,{color:C.a,w:3,dash:'7 6'})+label('中心から',cx+40,cy-20,{size:24,color:C.a});
  s+=line(cx,Y,X,Y,{color:C.x,w:4})+label('軸から',cx+40,Y-14,{size:24,color:C.x,weight:700});
  s+=card(680,140,460,240,label('×',720,215,{size:34,color:C.a,weight:700})+label('中心からの 距離',770,215,{size:28,color:C.a})+label('○',720,305,{size:34,color:C.x,weight:700})+label('軸からの 垂直な 距離',770,305,{size:28,color:C.x,weight:700}),seg(p,0,.1));
  return s;
 },
 [K+'roll']:(p)=>{
  let s=race(0)+card(780,40,390,420,T('v^2=\\dfrac{2gh}{1+I/(MR^2)}',975,110,{size:30})+L('2gh ＝ 12 m²/s²',975,190,{size:24,color:C.dim})
   +fade(seg(p,.4,.55),label('球',820,270,{size:28,color:C.E,weight:700})+T('12\\div1.4\\approx8.57',1030,270,{size:30})),seg(p,0,.08));
  return s;
 },
 [K+'roll2']:(p)=>{
  let s=race(p)+card(780,40,390,420,L('v²（m²/s²）',975,90,{size:24,color:C.dim})
   +label('球',820,170,{size:28,color:C.E,weight:700})+T('8.57',1030,170,{size:32})
   +label('円板',820,250,{size:28,color:C.x,weight:700})+T('8',1030,250,{size:32})
   +label('輪',820,330,{size:28,color:'#c9a7ff',weight:700})+T('6',1030,330,{size:32})
   +fade(seg(p,.5,.65),L('回転の 取り分が 最小',975,410,{size:26,color:C.hi,weight:700})),seg(p,0,.08));
  return s;
 },
 // ===== S5 =====
 [K+'sum1']:(p)=>{
  const st=(X,txt,tex,g)=>fade(g,rect(X-180,110,360,260,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+L(txt,X,170,{size:28,weight:700,color:C.hi})+T(tex,X,280,{size:34}));
  let s=st(220,'① 輪切り',`${tdm}=${rh}\\pi${RZ}d${tz}`,seg(p,0,.1))+st(600,'② 円板の ½',`dI=\\tfrac12\\,${tdm}\\,${RZ}`,seg(p,.25,.35))+st(980,'③ 積分',`\\int_0^R${RZ}^2d${tz}`,seg(p,.5,.6));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=T('1-\\dfrac{2}{3}+\\dfrac{1}{5}=\\dfrac{8}{15}',600,110,{size:46});
  s+=fade(seg(p,.25,.4),T('\\dfrac{8}{15}\\times\\dfrac{3}{4}=\\dfrac{2}{5}',600,250,{size:46})+label('ρ → M',870,262,{size:26,color:DEN}));
  s+=fade(seg(p,.5,.65),boxT('I=\\dfrac{2}{5}MR^2',600,410,50,1,C.hi,true));
  return s;
 },
 [K+'chain']:(p)=>{
  let s=fade(seg(p,0,.1),ringTop(200,250,110)+axisDot(200,250,{lab:''})+L('輪',200,430,{size:30,weight:700}));
  s+=fade(seg(p,.2,.3),arrow(340,250,420,250,{color:C.dim,w:4,head:14})+discTop(580,250,110)+axisDot(580,250,{lab:''})+L('円板',580,430,{size:30,weight:700}));
  s+=fade(seg(p,.4,.5),arrow(720,250,800,250,{color:C.dim,w:4,head:14})+sphere(980,250,120,{slices:8,axis:false})+L('球',980,430,{size:30,weight:700}));
  s+=fade(seg(p,.6,.72),L('前の 結果を 部品に',600,60,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'axisG']:(p)=>{
  let s=sphere(250,260,170,{})+dot(250,260,9,C.hi)+label('重心',270,300,{size:24,color:C.hi});
  s+=discTop(600,260,130)+dot(600,260,9,C.hi)+label('重心',620,300,{size:24,color:C.hi});
  s+=`<rect x="830" y="248" width="260" height="24" rx="4" fill="${BODY}" fill-opacity=".4" stroke="${BODY}" stroke-width="2"/>`+vAxis(960,140,400,'')+dot(960,260,9,C.hi)+label('重心',980,300,{size:24,color:C.hi});
  s+=fade(seg(p,.3,.45),L('どの 軸も 重心を 通る',600,470,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  const sh=200*seg(p,.15,.6);
  let s=`<rect x="300" y="248" width="400" height="24" rx="4" fill="${BODY}" fill-opacity=".4" stroke="${BODY}" stroke-width="2"/>`;
  s+=line(500,120,500,420,{color:C.faint,w:2.5,dash:'8 7'})+label('重心の 軸',500,450,{size:24,color:C.dim,anchor:'middle'});
  s+=line(500-sh,100,500-sh,420,{color:C.hi,w:3,dash:'8 7'})+fade(seg(p,.4,.55),label('ずらした 軸',500-sh,90,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),card(780,140,380,220,L('I は どれだけ',970,210,{size:30})+L('増える？',970,280,{size:34,color:C.hi,weight:700}),1,C.hi));
  return s;
 },
};
