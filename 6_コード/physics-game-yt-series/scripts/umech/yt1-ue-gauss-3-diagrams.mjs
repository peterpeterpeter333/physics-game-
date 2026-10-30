// YouTube シリーズ「ガウスの法則・上級 3/6」(ys-ue-gauss-3) — 図。Stage 1200×515.
// 色：1/6・2/6 と共通（𝐄 水色、𝐧 桃、Φ・強調 黄、θ 橙、u 黄緑）。帯の寄与の正 赤、負 青（PLAN の指定）。
// 帯の寄与 f(θ)＝2πR²(R＋d cosθ)sinθ/(R²＋d²＋2Rd cosθ)^{3/2}（kQ を 1 とする）。R＝2。
//   d＝0：2π sinθ（最大 6.28）、d＝1：最大 7.53（θ≈147°）、面積はどちらも 4π≈12.57。d＝3：負 −1.60、正 +1.60、合計 0。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly,axes} from './anim.mjs';
import {G1,cs,card,T,L,TF,xsec,ptAt,ok,bad,strike,PHI,qin} from './yt1-ue-gauss-1-diagrams.mjs';
import {CU,uu,GU,UPP,LOW,COEF1,PHIG,RD2} from './yt1-ue-gauss-2-diagrams.mjs';
import {charge,closedPath} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='ue-gauss-3:';
const vr0='\\mathbf{r}';
const POSC=C.a,NEGC='#7fb3ff';
const XC=300,YC=262,RP=165;
const TH8=[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,-Math.PI/4,-Math.PI/2,-3*Math.PI/4];
const band=(R,d,t)=>2*Math.PI*R*R*(R+d*Math.cos(t))*Math.sin(t)/Math.pow(R*R+d*d+2*R*d*Math.cos(t),1.5);
// graph of band contribution
function graph({x=110,y=430,w=640,h=360,ymin=-4,ymax=8,curves=[],g=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:Math.PI,ymin,ymax,yticks:[-4,0,4,8].filter(v=>v>=ymin&&v<=ymax),grid:true,g});
 let s=A.svg;
 s+=label('0',A.X(0),A.Y(0)+30,{size:22,color:C.dim,anchor:'middle'})+label('π/2',A.X(Math.PI/2),A.Y(0)+30,{size:22,color:C.dim,anchor:'middle'})+label('π',A.X(Math.PI),A.Y(0)+30,{size:22,color:C.dim,anchor:'middle'});
 s+=label('θ',x+w+40,A.Y(0)+8,{size:26,color:G1.ang,weight:700});
 s+=label('帯の 寄与（kQ を 1 として）',x+10,y-h-20,{size:22,color:C.dim});
 for(const c of curves){
  const N=180,pts=[];for(let i=0;i<=N;i++){const t=Math.PI*i/N;pts.push([A.X(t),A.Y(band(2,c.d,t))]);}
  if(c.fill){
   if(c.sign){ // separate positive / negative fills
    const pos=[],neg=[];for(let i=0;i<=N;i++){const t=Math.PI*i/N,v=band(2,c.d,t);pos.push([A.X(t),A.Y(Math.max(0,v))]);neg.push([A.X(t),A.Y(Math.min(0,v))]);}
    s+=fade(c.gf??1,poly([[A.X(0),A.Y(0)],...pos,[A.X(Math.PI),A.Y(0)]],{fill:POSC,fo:.35})+poly([[A.X(0),A.Y(0)],...neg,[A.X(Math.PI),A.Y(0)]],{fill:NEGC,fo:.45}));
   }else s+=fade(c.gf??1,poly([[A.X(0),A.Y(0)],...pts,[A.X(Math.PI),A.Y(0)]],{fill:c.color,fo:.18}));
  }
  s+=draw(pts,c.p??1,{color:c.color,w:c.w??4,dash:c.dash??''});
 }
 return {A,svg:fade(g,s)};
}
// circle arcs coloured by the sign of E·n (outside charge): negative where R + d cosθ < 0
function signArcs(cx,cy,Rp,dr,{g=1}={}){
 const tc=Math.acos(-1/dr);let s='';
 const arc=(a,b,col)=>{const pts=[];for(let i=0;i<=40;i++){const t=a+(b-a)*i/40;pts.push(ptAt(cx,cy,Rp,t));}return draw(pts,1,{color:col,w:9});};
 s+=arc(-tc,tc,POSC)+arc(tc,2*Math.PI-tc,NEGC);
 return fade(g,s);
}
const concave=()=>Array.from({length:160},(_,i)=>{const t=2*Math.PI*i/160,r=130*(1+.22*Math.cos(3*t+.4)+.06*Math.sin(2*t));return [r*Math.cos(t),r*Math.sin(t)];});

export const ytUeGauss3Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=L('前回の 最後の 問い',600,45,{size:24,color:C.dim});
  s+=TF(PHIG,600,140,{size:42,frac:true});
  s+=card(80,200,500,280,L('上下限を 入れると',330,270,{size:28})+L('d と R は 残る？',330,340,{size:32,color:G1.hi,weight:700}),seg(p,.05,.2),G1.hi);
  s+=card(620,200,500,280,xsec(760,290,70,{dr:1.6,axis:false,lab:false,qr:12})+L('電荷が 外',990,320,{size:28})+L('なら？',990,380,{size:32,color:G1.hi,weight:700}),seg(p,.4,.55),G1.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=TF(PHIG,600,190,{size:56,frac:true,box:true});
  s+=fade(seg(p,.3,.45),L('前回：u ＝ 距離の 2乗 と 置いた',600,400,{size:28,color:CU,weight:700}));
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=TF(`G(${uu})=${GU}`,600,100,{size:48,frac:true,box:true});
  s+=card(150,230,400,190,L('上端',350,285,{size:26,color:C.dim})+TF(`${uu}=${UPP}`,350,365,{size:40}),seg(p,.3,.45));
  s+=card(650,230,400,190,L('下端',850,285,{size:26,color:C.dim})+TF(`${uu}=${LOW}`,850,365,{size:40}),seg(p,.5,.65));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=TF(`G\\big(${UPP}\\big)-G\\big(${LOW}\\big)=\\;?`,600,130,{size:50});
  s+=card(150,240,400,200,L('d や R を 含む',350,310,{size:28})+L('複雑な 式？',350,380,{size:32,color:G1.hi,weight:700}),seg(p,.2,.35));
  s+=card(650,240,400,200,L('何かが',850,310,{size:28})+L('消える？',850,380,{size:32,color:G1.hi,weight:700}),seg(p,.5,.65));
  return s;
 },
 // ===== S2 上端を代入する =====
 [K+'sqrtup']:(p)=>{
  let s=L('上端',600,60,{size:28,color:C.dim});
  s+=TF(`${uu}=${UPP}`,600,150,{size:46});
  s+=TF(`\\sqrt{${uu}}=\\sqrt{(R+d)^2}=R+d`,600,300,{size:50,box:true,g:seg(p,.3,.45)});
  s+=fade(seg(p,.5,.65),L('R ＋ d ＞ 0',600,430,{size:28,color:G1.hi,weight:700}));
  return s;
 },
 [K+'factor']:(p)=>{
  let s=TF(`G(${uu})=\\sqrt{${uu}}-\\frac{${cs(G1.hi,RD2)}}{\\sqrt{${uu}}}`,600,100,{size:44,frac:true});
  s+=TF(`R^2-d^2=(R-d)(R+d)`,600,300,{size:52,box:true,g:seg(p,.3,.45)});
  s+=fade(seg(p,.55,.7),L('2乗の 差',600,430,{size:28,color:C.dim}));
  return s;
 },
 [K+'Gup1']:(p)=>{
  let s=TF(`\\frac{R^2-d^2}{\\sqrt{${uu}}}=\\frac{(R-d)\\cancel{(R+d)}}{\\cancel{R+d}}=R-d`,600,170,{size:50,frac:true});
  s+=fade(seg(p,.5,.65),L('R ＋ d が 約分される',600,360,{size:28,color:G1.hi,weight:700}));
  return s;
 },
 [K+'Gup2']:(p)=>{
  let s=TF(`G\\big(${UPP}\\big)=(R+d)-(R-d)`,600,140,{size:48});
  s+=TF(`=2d`,600,310,{size:60,box:true,g:seg(p,.35,.5)});
  return s;
 },
 [K+'numup']:(p)=>{
  let s=TF('R=2,\\ d=1:\\quad R^2-d^2=3',600,70,{size:38});
  s+=TF(`G(9)=\\sqrt{9}-\\frac{3}{\\sqrt{9}}=3-\\frac{3}{3}=2`,600,220,{size:48,frac:true,g:seg(p,.15,.3)});
  s+=TF(`2d=2`,600,380,{size:48,g:seg(p,.6,.72)})+ok(720,385,seg(p,.7,.8));
  return s;
 },
 // ===== S3 下端を代入して、差をとる =====
 [K+'sqrtlow']:(p)=>{
  let s=xsec(230,262,140,{dr:.5});
  s+=card(440,70,720,380,L('下端',800,125,{size:28,color:C.dim})+TF(`${uu}=${LOW}`,800,200,{size:42})
   +fade(seg(p,.3,.45),L('内側：d ＜ R → R − d ＞ 0',800,285,{size:28,color:G1.hi,weight:700}))
   +TF(`\\sqrt{${uu}}=R-d`,800,380,{size:48,box:true,g:seg(p,.6,.75)}),1);
  return s;
 },
 [K+'Glow']:(p)=>{
  let s=TF(`\\frac{R^2-d^2}{\\sqrt{${uu}}}=\\frac{\\cancel{(R-d)}(R+d)}{\\cancel{R-d}}=R+d`,600,110,{size:44,frac:true});
  s+=TF(`G\\big(${LOW}\\big)=(R-d)-(R+d)=-2d`,600,320,{size:52,box:true,g:seg(p,.45,.6)});
  return s;
 },
 [K+'numlow']:(p)=>{
  let s=TF('R=2,\\ d=1:\\quad R^2-d^2=3',600,70,{size:38});
  s+=TF(`G(1)=\\sqrt{1}-\\frac{3}{\\sqrt{1}}=1-3=-2`,600,220,{size:48,frac:true,g:seg(p,.15,.3)});
  s+=TF(`-2d=-2`,600,380,{size:48,g:seg(p,.6,.72)})+ok(740,385,seg(p,.7,.8));
  return s;
 },
 [K+'diff']:(p)=>{
  let s=TF(`G\\big(${UPP}\\big)-G\\big(${LOW}\\big)=2d-(-2d)=4d`,600,120,{size:46});
  s+=TF(`${PHI}=${COEF1}\\times 4d`,600,320,{size:54,frac:true,g:seg(p,.45,.6)});
  return s;
 },
 [K+'cancel']:(p)=>{
  let s=TF(`${PHI}=\\frac{\\pi kQ}{\\cancel{d}}\\times 4\\cancel{d}`,600,130,{size:52,frac:true});
  s+=TF(`${PHI}=4\\pi kQ`,600,320,{size:62,box:true,g:seg(p,.35,.5)});
  s+=fade(seg(p,.6,.75),L('ずれ d が 消えた',600,450,{size:30,color:G1.hi,weight:700}));
  return s;
 },
 [K+'eps']:(p)=>{
  let s=TF(`4\\pi kQ=4\\pi\\times\\frac{Q}{4\\pi\\varepsilon_0}=\\frac{Q}{\\varepsilon_0}`,600,120,{size:48,frac:true});
  s+=TF(`${PHI}=\\frac{Q}{\\varepsilon_0}`,600,310,{size:64,frac:true,box:true,g:seg(p,.3,.45)});
  s+=fade(seg(p,.6,.75),L('R も d も 残らない',600,470,{size:30,color:G1.hi,weight:700}));
  return s;
 },
 [K+'meaning']:(p)=>{
  let s='';
  const three=[[200,0,95],[600,.5,120],[1000,.35,150]];
  three.forEach(([x,dr,R],i)=>{s+=fade(seg(p,.05+.15*i,.15+.15*i),xsec(x,250,R,{dr,axis:false,lab:false,qr:12})+TF('\\frac{Q}{\\varepsilon_0}',x,470,{size:40,frac:true}));});
  s+=fade(seg(p,.6,.75),L('予想の 答え：同じ',600,60,{size:30,color:G1.hi,weight:700}));
  return s;
 },
 [K+'local']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5,ths:TH8,gN:0});
  const [nx,ny]=ptAt(XC,YC,RP,0),[sx,sy]=ptAt(XC,YC,RP,Math.PI);
  s+=label('kQ/9',nx+16,ny+30,{size:24,color:G1.E,weight:700})+label('kQ',sx+16,sy-14,{size:24,color:G1.E,weight:700});
  s+=card(600,90,560,330,L('局所の 𝐄·𝐧：9倍 違う まま',880,165,{size:28})+fade(seg(p,.4,.55),L('全面で 足すと',880,245,{size:28})+TF(`${PHI}=\\frac{Q}{\\varepsilon_0}`,880,365,{size:42,frac:true,box:true})),1);
  return s;
 },
 [K+'graph']:(p)=>{
  const {svg}=graph({curves:[{d:0,color:C.dim,w:3,dash:'8 6'},{d:1,color:G1.E,fill:true,p:seg(p,.1,.4),gf:seg(p,.35,.5)}]});
  let s=svg;
  s+=label('d＝0',300,140,{size:24,color:C.dim,weight:700})+fade(seg(p,.2,.35),label('d＝1',470,260,{size:24,color:G1.E,weight:700}));
  s+=card(820,90,340,330,L('R ＝ 2',990,145,{size:26,color:C.dim})+L('面積は どちらも',990,230,{size:26})+TF('4\\pi\\approx 12.57',990,300,{size:40,box:true})+L('（kQ を 1 として）',990,385,{size:22,color:C.dim}),seg(p,.5,.65));
  return s;
 },
 [K+'graph2']:(p)=>{
  const {svg,A}=graph({curves:[{d:0,color:C.dim,w:3,dash:'8 6'},{d:1,color:G1.E,fill:true}]});
  let s=svg+label('d＝0',300,140,{size:24,color:C.dim,weight:700})+label('d＝1',470,260,{size:24,color:G1.E,weight:700});
  s+=fade(seg(p,.35,.5),arrow(A.X(Math.PI/2),475,A.X(2.6),475,{color:G1.hi,w:3,head:12})+label('山が 南側へ 寄る',A.X(Math.PI/2)-10,483,{size:24,color:G1.hi,anchor:'end',weight:700}));
  s+=card(820,90,340,330,L('曲線の 下の 面積',990,150,{size:26})+L('＝ 電気束',990,200,{size:26,color:G1.hi,weight:700})+TF('4\\pi\\approx 12.57',990,300,{size:40,box:true})+L('どちらも 同じ',990,385,{size:24,color:C.dim}),1);
  return s;
 },
 [K+'d0']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:0,ths:TH8,kE:52,lenN:48});
  s+=card(600,60,560,410,L('d ＝ 0：途中の 1/d は 使えない',880,115,{size:26,color:G1.bad,weight:700})
   +L('元の 積分に 戻る',880,170,{size:26,color:C.dim})
   +TF(`${cs(G1.E,'E')}=\\frac{kQ}{R^2}\\ (\\text{const})`.replace('\\ (\\text{const})',''),880,250,{size:40,frac:true})+label('一定',1060,258,{size:26,color:C.dim})
   +TF('\\frac{kQ}{R^2}\\times 4\\pi R^2=4\\pi kQ',880,370,{size:40,frac:true,box:true,g:seg(p,.45,.6)}),1);
  return s;
 },
 // ===== S4 電荷が外なら =====
 [K+'out']:(p)=>{
  let s=xsec(XC,190,110,{dr:1.5,ths:TH8,gN:0,kE:60,maxL:100});
  s+=card(600,80,560,350,L('電荷が 球の 外',880,145,{size:30,weight:700})+TF('d>R',880,230,{size:48})
   +fade(seg(p,.45,.6),L('積分は 同じ',880,315,{size:28})+L('違うのは 平方根の 扱い だけ',880,375,{size:28,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'upout']:(p)=>{
  let s=L('上端（前と 同じ）',600,70,{size:28,color:C.dim});
  s+=TF(`\\sqrt{(R+d)^2}=R+d`,600,170,{size:48});
  s+=TF(`G\\big(${UPP}\\big)=2d`,600,330,{size:54,box:true,g:seg(p,.4,.55)});
  return s;
 },
 [K+'sqrtout']:(p)=>{
  let s=L('下端',600,55,{size:28,color:C.dim});
  s+=TF('d>R\\quad\\Rightarrow\\quad R-d<0',600,140,{size:42});
  s+=TF(`\\sqrt{(R-d)^2}=d-R`,600,290,{size:54,box:true,g:seg(p,.3,.45)});
  s+=fade(seg(p,.6,.75),L('平方根は 0 以上',600,430,{size:30,color:G1.hi,weight:700}));
  return s;
 },
 [K+'Glowout']:(p)=>{
  let s=TF(`\\frac{R^2-d^2}{d-R}=\\frac{-\\cancel{(d-R)}(d+R)}{\\cancel{d-R}}=-(d+R)`,600,110,{size:44,frac:true});
  s+=TF(`G\\big(${LOW}\\big)=(d-R)+(d+R)=2d`,600,320,{size:52,box:true,g:seg(p,.45,.6)});
  return s;
 },
 [K+'zero']:(p)=>{
  let s=TF(`G\\big(${UPP}\\big)-G\\big(${LOW}\\big)=2d-2d=0`,600,130,{size:46});
  s+=TF(`${PHI}=0`,600,320,{size:66,box:true,g:seg(p,.35,.5)});
  return s;
 },
 [K+'numout']:(p)=>{
  let s=TF('R=2,\\ d=3:\\quad R^2-d^2=-5',600,70,{size:38});
  s+=TF(`G(25)=5-\\frac{-5}{5}=6`,600,200,{size:46,frac:true,g:seg(p,.1,.25)});
  s+=TF(`G(1)=1-\\frac{-5}{1}=6`,600,330,{size:46,frac:true,g:seg(p,.4,.55)});
  s+=fade(seg(p,.7,.8),L('差 6 − 6 ＝ 0',600,450,{size:32,color:G1.hi,weight:700}));
  return s;
 },
 [K+'trap']:(p)=>{
  let s=card(100,60,1000,400,
   TF(`\\sqrt{(R-d)^2}=R-d`,450,150,{size:46})+bad(720,158)
   +fade(seg(p,.25,.4),TF(`G\\big(${LOW}\\big)=-2d`,600,260,{size:42}))
   +fade(seg(p,.5,.65),TF(`${PHI}=\\frac{Q}{\\varepsilon_0}`,450,380,{size:44,frac:true})+L('外の 電荷なのに？',800,390,{size:30,color:G1.bad,weight:700})),1,G1.bad);
  return s;
 },
 [K+'trap2']:(p)=>{
  const row=(y,a,b,c,d,col)=>label(a,170,y,{size:28,weight:700,color:col})+TF(b,480,y-8,{size:30})+TF(c,760,y-8,{size:36})+TF(d,1000,y-8,{size:40,frac:true});
  let s=label('平方根',480,110,{size:24,color:C.dim,anchor:'middle'})+label('G（下端）',760,110,{size:24,color:C.dim,anchor:'middle'})+label('電気束',1000,110,{size:24,color:C.dim,anchor:'middle'});
  s+=row(220,'内側 d ＜ R','\\sqrt{(R-d)^2}=R-d','-2d','\\frac{Q}{\\varepsilon_0}',G1.hi);
  s+=fade(seg(p,.25,.4),row(370,'外側 d ＞ R','\\sqrt{(R-d)^2}=d-R','2d','0',G1.hi));
  return s;
 },
 // ===== S5 正味0と、電場0は違う =====
 [K+'notzero']:(p)=>{
  let s=xsec(XC,180,110,{dr:1.5,ths:TH8,kE:60,maxL:100,lenN:40});
  s+=card(600,80,560,350,TF(`${PHI}=0`,880,160,{size:48})+L('でも 球面の 𝐄 は 0 ではない',880,260,{size:28,color:G1.hi,weight:700})+L('（クーロンの 法則）',880,320,{size:26,color:C.dim}),1);
  return s;
 },
 [K+'inout']:(p)=>{
  let s=xsec(XC,180,110,{dr:1.5,ths:TH8,kE:60,maxL:100,lenN:40})+signArcs(XC,180,110,1.5,{g:seg(p,.1,.3)});
  s+=card(600,80,560,350,label('近い 側：内側へ 向く',650,170,{size:28,color:NEGC,weight:700})+TF(`${cs(G1.E,'\\mathbf{E}')}\\cdot${cs(G1.n,'\\mathbf{n}')}<0`,1050,165,{size:34})
   +fade(seg(p,.5,.65),label('遠い 側：外へ 向く',650,290,{size:28,color:POSC,weight:700})+TF(`${cs(G1.E,'\\mathbf{E}')}\\cdot${cs(G1.n,'\\mathbf{n}')}>0`,1050,285,{size:34})),1);
  return s;
 },
 [K+'border']:(p)=>{
  const cx=XC,cy=180,Rp=110,dr=1.5,tc=Math.acos(-1/dr);
  let s=xsec(cx,cy,Rp,{dr,ths:[],gN:0})+signArcs(cx,cy,Rp,dr);
  const ox=cx,oy=cy+dr*Rp;
  for(const t of [tc,-tc]){const [x,y]=ptAt(cx,cy,Rp,t);const ux=x-ox,uy=y-oy,l=Math.hypot(ux,uy);
   s+=fade(seg(p,.3,.5),line(ox,oy,ox+ux/l*(l+70),oy+uy/l*(l+70),{color:C.hi,w:2.5,dash:'7 6'})+dot(x,y,7,C.hi));}
  s+=card(600,80,560,350,TF(`${vr0}\\cdot${cs(G1.n,'\\mathbf{n}')}=R+d\\cos\\theta=0`,880,165,{size:36,box:true})
   +fade(seg(p,.4,.55),L('電荷から 引いた 直線が',880,265,{size:28})+L('球に 接する 点',880,325,{size:30,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'graphout']:(p)=>{
  const {svg}=graph({ymin:-4,ymax:4,h:340,y:440,curves:[{d:3,color:C.ink,fill:true,sign:true,w:3,gf:seg(p,.1,.3)}]});
  let s=svg;
  s+=card(820,90,340,330,L('R ＝ 2、d ＝ 3',990,145,{size:26,color:C.dim})+label('正 ≈ ＋1.60',990,230,{size:28,color:POSC,weight:700,anchor:'middle'})+label('負 ≈ −1.60',990,290,{size:28,color:NEGC,weight:700,anchor:'middle'})+fade(seg(p,.5,.65),L('合計 0',990,375,{size:32,color:G1.hi,weight:700})),seg(p,.25,.4));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(100,70,1000,380,
   label('中の 電荷 ＝ 0',250,170,{size:32})+TF('\\Rightarrow',600,162,{size:44})+TF(`${PHI}=0`,860,162,{size:44})+ok(1040,170)
   +fade(seg(p,.2,.35),label('中の 電荷 ＝ 0',250,320,{size:32})+TF('\\Rightarrow',600,312,{size:44})+TF(`${cs(G1.E,'\\mathbf{E}')}=\\mathbf{0}`,860,312,{size:44})+bad(1040,320)+strike(520,290,980,330)),1);
  s+=fade(seg(p,.55,.7),L('0 なのは 正味の 電気束 だけ',600,490,{size:28,color:G1.hi,weight:700}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(80,70,500,380,xsec(330,195,80,{dr:.5,axis:false,lab:false,qr:12})+L('内側 0 ＜ d ＜ R',330,320,{size:26})+TF('\\frac{Q}{\\varepsilon_0}',330,405,{size:36,frac:true}),1,G1.hi);
  s+=card(620,70,500,380,xsec(870,160,60,{dr:1.6,axis:false,lab:false,qr:12})+L('外側 d ＞ R',870,320,{size:26})+TF('0',870,405,{size:44}),seg(p,.3,.45),G1.hi);
  s+=fade(seg(p,.6,.75),L('R にも d にも よらない',600,495,{size:26,color:G1.hi,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,90,500,330,L('使ったもの',330,150,{size:28,color:G1.ok,weight:700})+L('クーロンの法則',330,240,{size:30})+L('＋ 積分（置換・原始関数）',330,310,{size:26,color:C.dim}),1,G1.ok);
  s+=card(620,90,500,330,L('根拠に 使わない',870,150,{size:28,color:G1.bad,weight:700})+L('ガウスの法則',870,250,{size:30})+strike(760,262,980,226,seg(p,.3,.45)),seg(p,.15,.3),G1.bad);
  return s;
 },
 [K+'limit']:(p)=>{
  let s=card(80,70,520,380,L('球専用の 道具',340,130,{size:28,color:G1.hi,weight:700})
   +TF('(R\\sin\\theta\\cos\\varphi,\\ R\\sin\\theta\\sin\\varphi,\\ d+R\\cos\\theta)',340,230,{size:30,maxW:470})
   +TF('dA=R^2\\sin\\theta\\,d\\theta\\,d\\varphi',340,340,{size:36}),1,G1.hi);
  const pts=concave();
  s+=fade(seg(p,.4,.55),closedPath(pts,880,262,{color:G1.geo,w:3})+charge(860,262,1,16)+L('この 形には 使えない',880,480,{size:26,color:G1.bad,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  const pts=concave();
  let s=closedPath(pts,330,262,{color:G1.geo,w:3})+charge(310,262,1,18);
  s+=card(620,90,520,330,L('球なら 確かめられた',880,160,{size:28,color:C.dim})+L('凹んだ 面・いびつな 面でも',880,250,{size:30,weight:700})+L('成り立つと どう 言える？',880,320,{size:32,color:G1.hi,weight:700}),seg(p,.15,.3),G1.hi);
  return s;
 },
};
