// YouTube シリーズ「ガウスの法則・上級 5/6」(ys-ue-gauss-5) — 図。Stage 1200×515.
// 色：1/6・4/6 と共通（𝐄 水色、𝐧 桃、面積 金、Φ・強調 黄、立体角 黄緑）＋ 線電荷 λ 紫、正電荷 赤、負電荷 青。
// 円筒（横から）：軸 y＝CYY、x＝X0〜X1 が長さ L、半径 r は画面で RR px。ふたは縦長の楕円（奥の半分は破線）。
//   電場は軸から垂直（上下）。ふたの面の中に沿う → ふたの電気束 0。ふたの外向き法線は軸方向（左・右）。
// 数値：表 +2Q → 2Q/ε₀、−Q → −Q/ε₀、外 +3Q → 0、計 Q/ε₀。点電荷 1 nC・1 m → 8.99 N/C。直線 1 nC/m：0.1 m → 180、0.2 m → 90 N/C。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly,axes,texWidth,brace} from './anim.mjs';
import {G1,cs,card,T,L,TF,qin,ok,bad,strike,PHI,vE,vn,dA,OI} from './yt1-ue-gauss-1-diagrams.mjs';
import {charge,blobPts,closedPath} from './yt1-ui-closed-bag-1-diagrams.mjs';
import {CO,cShape,CSH} from './yt1-ue-gauss-4-diagrams.mjs';

const K='ue-gauss-5:';
const LAM=C.v;
const dOm=cs(CO,'d\\Omega');
const E1=cs(G1.E,'\\mathbf{E}_1'),E2=cs(G1.E,'\\mathbf{E}_2'),Ej=cs(G1.E,'\\mathbf{E}_j');
const qlab=(x,y,t,col=C.ink)=>label(t,x,y,{size:26,color:col,weight:700,anchor:'middle'});
// radial arrows around a point charge
function radial(x,y,{n=8,r0=30,len=70,g=1,rot=0}={}){let s='';for(let i=0;i<n;i++){const a=rot+2*Math.PI*i/n;s+=arrow(x+r0*Math.cos(a),y+r0*Math.sin(a),x+(r0+len)*Math.cos(a),y+(r0+len)*Math.sin(a),{color:G1.E,w:4,head:12});}return fade(g,s);}
// blob with charges for the superposition table
const BX=300,BY=262;
function tableFig({g=1,hl=-1}={}){
 let s=closedPath(blobPts(150),BX,BY,{color:G1.geo,w:3});
 const items=[[250,220,1,'＋2Q'],[350,320,-1,'−Q'],[560,110,1,'＋3Q']];
 items.forEach(([x,y,sg,t],i)=>{s+=charge(x,y,sg,i===hl?24:18)+qlab(x,y+(i===2?50:48),t,sg>0?C.a:'#7fb3ff');});
 s+=label('中',BX-120,BY+150,{size:24,color:C.dim})+label('外',560,200,{size:24,color:C.dim});
 return fade(g,s);
}
function tableCard(p,stage){
 const rows=[['中','＋2Q','\\frac{2Q}{\\varepsilon_0}'],['中','−Q','-\\frac{Q}{\\varepsilon_0}'],['外','＋3Q','0']];
 let s=rect(640,40,530,440,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 s+=label('電荷',700,95,{size:24,color:C.dim})+label('場所',820,95,{size:24,color:C.dim})+label('電気束への 寄与',960,95,{size:24,color:C.dim});
 rows.forEach(([w,q,v],i)=>{const y=165+i*85,on=stage>i;s+=fade(on?1:.25,label(q,700,y+8,{size:28,weight:700,color:q.startsWith('−')?'#7fb3ff':C.a})+label(w,830,y+8,{size:28,anchor:'middle'})+(on?TF(v,1040,y,{size:34,frac:true}):''));});
 if(stage>3)s+=line(660,400,1150,400,{color:C.dim,w:2})+TF('\\frac{2Q}{\\varepsilon_0}-\\frac{Q}{\\varepsilon_0}+0=\\frac{Q}{\\varepsilon_0}',905,448,{size:32,frac:true,col:G1.hi});
 return s;
}
// cylinder (side view)
const X0=330,X1=700,CYY=262,RR=110,EX=26;
function ell(x,{col=G1.geo,w=3,fill=null,g=1}={}){
 const front=`M${x} ${CYY-RR} A${EX} ${RR} 0 0 1 ${x} ${CYY+RR}`,back=`M${x} ${CYY+RR} A${EX} ${RR} 0 0 1 ${x} ${CYY-RR}`;
 return fade(g,(fill?`<ellipse cx="${x}" cy="${CYY}" rx="${EX}" ry="${RR}" fill="${fill}" fill-opacity=".22" stroke="none"/>`:'')+`<path d="${front}" fill="none" stroke="${col}" stroke-width="${w}"/><path d="${back}" fill="none" stroke="${col}" stroke-width="${w-1}" stroke-dasharray="6 6"/>`);
}
function lineCharge({g=1,x0=110,x1=930}={}){return fade(g,line(x0,CYY,x1,CYY,{color:LAM,w:7})+label('λ',x0+8,CYY-18,{size:30,color:LAM,weight:700}));}
function cylinder({g=1,caps=1,side=1,hlCaps=0,hlSide=0}={}){
 let s='';
 if(hlSide)s+=fade(hlSide,poly([[X0,CYY-RR],[X1,CYY-RR],[X1,CYY+RR],[X0,CYY+RR]],{fill:G1.A,fo:.16}));
 s+=fade(side,line(X0,CYY-RR,X1,CYY-RR,{color:G1.geo,w:3})+line(X0,CYY+RR,X1,CYY+RR,{color:G1.geo,w:3}));
 s+=fade(caps,ell(X0,{col:hlCaps?G1.hi:G1.geo,fill:hlCaps?G1.hi:null})+ell(X1,{col:hlCaps?G1.hi:G1.geo,fill:hlCaps?G1.hi:null}));
 return fade(g,s);
}
function sideArrows({g=1,xs=[400,515,630]}={}){let s='';for(const x of xs){s+=arrow(x,CYY-RR,x,CYY-RR-62,{color:G1.E,w:5,head:14})+arrow(x,CYY+RR,x,CYY+RR+62,{color:G1.E,w:5,head:14});}return fade(g,s);}
function capArrows({g=1}={}){let s='';for(const x of [X0,X1]){s+=arrow(x,CYY-14,x,CYY-80,{color:G1.E,w:4,head:12})+arrow(x,CYY+14,x,CYY+80,{color:G1.E,w:4,head:12});}
 s+=arrow(X0-EX*.6,CYY-60,X0-EX*.6-80,CYY-60,{color:G1.n,w:5,head:14})+arrow(X1+EX*.6,CYY-60,X1+EX*.6+80,CYY-60,{color:G1.n,w:5,head:14});return fade(g,s);}

export const ytUeGauss5Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=cShape({o:{cx:330,cy:262,ro:190,ri:85,gap:40}});
  s+=charge(330,125,1,16)+charge(220,330,-1,16)+charge(330,399,1,16)+charge(660,150,-1,16)+charge(600,420,1,16);
  s+=card(760,120,410,260,L('電荷が 何個も',965,200,{size:30,weight:700})+L('正と 負が 混ざると？',965,280,{size:30,color:G1.hi,weight:700}),1,G1.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=charge(140,300,1,18);
  s+=poly([[140,300],[700,250],[700,350]],{fill:CO,fo:.08})+line(140,300,700,250,{color:CO,w:2.5})+line(140,300,700,350,{color:CO,w:2.5});
  s+=line(600,240,660,370,{color:G1.A,w:7});
  s+=card(740,80,430,330,L('前回（4本目）',955,135,{size:24,color:C.dim})+TF(`d${PHI}=kQ\\,${dOm}`,955,235,{size:46,box:true})+L('見かけの 広がり × kQ',955,345,{size:28,color:CO,weight:700}),1);
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=cShape({o:{cx:300,cy:262,ro:190,ri:85,gap:40}})+charge(300,125,1,16)+label('中',270,110,{size:24,color:C.dim,anchor:'end'});
  s+=charge(610,262,1,16)+label('外',610,230,{size:24,color:C.dim,anchor:'middle'});
  s+=card(740,60,430,400,L('中の 電荷 1個',955,115,{size:26,color:G1.hi,weight:700})+qin(`${PHI}`,955,195,{size:42})
   +fade(seg(p,.35,.5),L('外の 電荷 1個',955,290,{size:26,color:C.dim,weight:700})+TF(`${PHI}=0`,955,350,{size:42}))
   +fade(seg(p,.7,.85),L('面の 形は 問わない',955,430,{size:26,color:G1.hi})),1);
  return s;
 },
 [K+'today']:(p)=>{
  let s=card(80,90,480,330,L('① 重ね合わせ',320,160,{size:32,color:G1.hi,weight:700})+L('証明を 完成',320,240,{size:30})+L('何個の 電荷でも',320,300,{size:26,color:C.dim}),seg(p,0,.15),G1.hi);
  s+=fade(seg(p,.35,.45),arrow(575,255,625,255,{color:C.dim,w:3,head:12}));
  s+=card(640,90,480,330,L('② 応用',880,160,{size:32,color:G1.E,weight:700})+L('電場を 取り出す',880,240,{size:30})+L('対称性を 使う',880,300,{size:26,color:C.dim}),seg(p,.4,.55),G1.E);
  return s;
 },
 // ===== S2 重ね合わせ =====
 [K+'sup']:(p)=>{
  const q1=[200,380],q2=[560,400],P=[400,190];
  let s=charge(...q1,1,20)+charge(...q2,-1,20)+label('Q₁',q1[0]-34,q1[1]+8,{size:26,color:C.a,weight:700,anchor:'end'})+label('Q₂',q2[0]+34,q2[1]+8,{size:26,color:'#7fb3ff',weight:700});
  s+=dot(...P,7,C.ink)+label('P',P[0]-16,P[1]-12,{size:26,weight:700,anchor:'end'});
  const u1=[P[0]-q1[0],P[1]-q1[1]],l1=Math.hypot(...u1),a=[P[0]+120*u1[0]/l1,P[1]+120*u1[1]/l1];
  const u2=[q2[0]-P[0],q2[1]-P[1]],l2=Math.hypot(...u2),b=[P[0]+110*u2[0]/l2,P[1]+110*u2[1]/l2];
  s+=fade(seg(p,.1,.25),arrow(...P,...a,{color:G1.E,w:4,head:13})+label('𝐄₁',a[0]+8,a[1]-6,{size:26,color:G1.E,weight:700}));
  s+=fade(seg(p,.25,.4),arrow(...P,...b,{color:G1.E,w:4,head:13})+label('𝐄₂',b[0]+12,b[1]+6,{size:26,color:G1.E,weight:700}));
  const c=[a[0]+b[0]-P[0],a[1]+b[1]-P[1]];
  s+=fade(seg(p,.45,.6),line(...a,...c,{color:C.dim,w:2,dash:'6 6'})+line(...b,...c,{color:C.dim,w:2,dash:'6 6'})+arrow(...P,...c,{color:G1.E,w:7,head:16})+label('𝐄',c[0]+12,c[1]+8,{size:30,color:G1.E,weight:700}));
  s+=card(740,120,430,220,TF(`${vE}=${E1}+${E2}+\\cdots`,955,230,{size:40,box:true}),seg(p,.55,.7));
  return s;
 },
 [K+'sup2']:(p)=>{
  let s=card(80,60,1040,170,L('出発点 ①',260,125,{size:28,color:C.dim,weight:700})+L('クーロンの法則',600,125,{size:32})+TF(`${vE}=kQ\\frac{\\mathbf{r}}{r^3}`,600,195,{size:32,frac:true}),1);
  s+=card(80,260,1040,200,L('出発点 ②',260,330,{size:28,color:G1.hi,weight:700})+L('重ね合わせ',600,330,{size:32,color:G1.hi,weight:700})+TF(`${vE}=\\sum_j ${Ej}`,600,400,{size:34})+fade(seg(p,.3,.45),L('実験に 支えられた 原理',940,420,{size:24,color:C.dim})),seg(p,.05,.2),G1.hi);
  return s;
 },
 [K+'dist']:(p)=>{
  let s=card(80,70,1040,380,L('内積は 和に 分配できる',600,130,{size:28,color:C.dim})
   +TF(`(${E1}+${E2})\\cdot${vn}`,600,240,{size:50,g:seg(p,.05,.2)})
   +TF(`=${E1}\\cdot${vn}+${E2}\\cdot${vn}`,600,360,{size:50,box:true,g:seg(p,.3,.5)}),1);
  return s;
 },
 [K+'dist2']:(p)=>{
  let s=card(60,70,1080,380,L('積分も 和に 分けられる',600,130,{size:28,color:C.dim})
   +TF(`${OI}\\Big(\\sum_j ${Ej}\\Big)\\cdot${vn}\\,${dA}=\\sum_j ${OI}${Ej}\\cdot${vn}\\,${dA}`,600,260,{size:42,g:seg(p,.05,.25),maxW:1020})
   +fade(seg(p,.5,.65),L('全電場の 電気束 ＝ 電荷1個ずつの 電気束の 和',600,400,{size:28,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'table']:(p)=>tableFig({g:1})+fade(seg(p,.3,.5),tableCard(p,0)),
 [K+'table2']:(p)=>tableFig({hl:p<.5?0:1})+tableCard(p,p<.45?1:2),
 [K+'table3']:(p)=>tableFig({hl:2})+tableCard(p,p<.35?3:4),
 [K+'table4']:(p)=>{
  let s=tableFig({});
  // field of the outside charge on the surface: some in, some out
  const q=[560,110];
  for(const [x,y] of [[420,170],[450,260],[380,140],[440,330]]){const u=[x-q[0],y-q[1]],l=Math.hypot(...u);s+=arrow(x,y,x+60*u[0]/l,y+60*u[1]/l,{color:G1.E,w:4,head:12,g:seg(p,.05,.25)});}
  s+=card(640,90,530,330,L('外の ＋3Q',905,150,{size:28,color:C.a,weight:700})+L('面の 上の 𝐄 は 変える',905,230,{size:28})+fade(seg(p,.45,.6),L('正味の 電気束：0',905,320,{size:32,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(110,60,980,300,L('ガウスの法則（導いた 結果）',600,120,{size:28,color:G1.hi,weight:700})+qin(`${OI}${vE}\\cdot${vn}\\,${dA}`,600,250,{size:58,box:true}),1,G1.hi);
  s+=fade(seg(p,.1,.3),L('Q内 ＝ 中の 電荷を 符号付きで 足したもの',600,430,{size:28}));
  return s;
 },
 [K+'rho']:(p)=>{
  let s=closedPath(blobPts(160),300,262,{color:G1.geo,w:3,fill:C.a,fo:.10});
  for(let i=0;i<40;i++){const t=i*2.4,r=20+((i*37)%120);s+=dot(300+r*Math.cos(t),262+r*.85*Math.sin(t),3,C.a,.7);}
  s+=fade(seg(p,.4,.55),rect(330,200,44,44,{fill:G1.hi,fo:.3,stroke:G1.hi,sw:3,rx:2})+label('dV',384,230,{size:28,color:G1.hi,weight:700}));
  s+=card(660,80,500,350,L('ρ（ロー）：体積あたりの 電荷',910,150,{size:28,weight:700})+L('単位 C/m³',910,205,{size:26,color:C.dim})
   +fade(seg(p,.5,.65),L('小さな 体積 dV の 電荷',910,290,{size:28})+TF('\\rho\\,dV',910,365,{size:44,box:true})),1);
  return s;
 },
 [K+'rho2']:(p)=>{
  const sz=44,lhs=`${OI}${vE}\\cdot${vn}\\,${dA}=\\frac{1}{\\varepsilon_0}\\iiint_V\\rho\\,dV`;
  let s=card(80,60,1040,400,L('Q内 ＝ ρ dV を 内部全体で 足した 体積積分',600,120,{size:28})
   +TF(lhs,600,260,{size:sz,frac:true,box:true,g:seg(p,.05,.25)})
   +fade(seg(p,.5,.65),L('面での 集計',380,410,{size:28,color:G1.n,weight:700})+label('＝',600,418,{size:30,anchor:'middle'})+L('内部での 集計',820,410,{size:28,color:C.a,weight:700})),1);
  return s;
 },
 [K+'scope']:(p)=>{
  let s=card(80,60,1040,400,L('使ったもの',600,120,{size:28,color:C.dim})
   +L('クーロンの法則 ＋ 重ね合わせ ＋ 積分',600,200,{size:34,weight:700})
   +fade(seg(p,.1,.25),L('ガウスの法則は 根拠に 使っていない',600,280,{size:28,color:G1.ok}))
   +fade(seg(p,.5,.65),L('この証明は 静電場の 場合',600,380,{size:30,color:G1.hi,weight:700})),1);
  return s;
 },
 // ===== S3 証明から応用へ =====
 [K+'switch']:(p)=>{
  let s=card(60,60,520,400,L('証明',320,120,{size:32,color:G1.hi,weight:700})+L('分かっている 𝐄',320,210,{size:30,color:G1.E})+L('↓ 積分',320,280,{size:28,color:C.dim})+L('Q内 / ε₀',320,360,{size:32}),1,G1.hi);
  s+=fade(seg(p,.4,.55),card(620,60,520,400,L('応用',880,120,{size:32,color:G1.E,weight:700})+L('法則 ＋ 対称性',880,210,{size:30})+L('↓',880,280,{size:28,color:C.dim})+L('未知の E を 求める',880,360,{size:32,color:G1.E,weight:700}),1,C.faint));
  return s;
 },
 [K+'switch2']:(p)=>{
  let s=card(60,60,520,400,L('証明',320,120,{size:32,color:C.dim,weight:700})+L('分かっている 𝐄',320,210,{size:30,color:C.dim})+L('↓ 積分',320,280,{size:28,color:C.dim})+L('Q内 / ε₀',320,360,{size:32,color:C.dim}),1);
  s+=card(620,60,520,400,L('応用',880,120,{size:32,color:G1.E,weight:700})+L('法則 ＋ 対称性',880,210,{size:30})+L('↓',880,280,{size:28,color:C.dim})+L('未知の E を 求める',880,360,{size:32,color:G1.E,weight:700}),1,G1.E);
  return s;
 },
 [K+'fixed']:(p)=>{
  const q=[300,262],P=[430,170];
  let s=charge(...q,1,18)+dot(...P,7,C.ink)+label('P',P[0]-12,P[1]-14,{size:26,weight:700,anchor:'end'});
  const u=[P[0]-q[0],P[1]-q[1]],l=Math.hypot(...u);
  s+=arrow(...P,P[0]+90*u[0]/l,P[1]+90*u[1]/l,{color:G1.E,w:6,head:15})+label('𝐄',P[0]+96*u[0]/l+8,P[1]+96*u[1]/l,{size:28,color:G1.E,weight:700});
  s+=fade(seg(p,.05,.3)*(1-seg(p,.4,.55)),ring(...q,l,{color:G1.A,w:3,dash:'8 6'}));
  s+=fade(seg(p,.45,.65),closedPath(blobPts(170).map(([x,y])=>[x*1.05,y*0.95]),q[0]+20,q[1]+5,{color:G1.A,w:3,dash:'8 6',fo:0}));
  s+=card(720,110,450,280,L('面を 描き直しても',945,190,{size:28})+L('𝐄 は 変わらない',945,260,{size:32,color:G1.E,weight:700})+L('面は 頭の 中の 面',945,330,{size:26,color:C.dim}),seg(p,.5,.65));
  return s;
 },
 [K+'sym']:(p)=>{
  let s=charge(300,262,1,18)+radial(300,262,{r0:150,len:60,n:8,rot:Math.PI/8})+ring(300,262,150,{color:G1.A,w:3});
  s+=card(600,60,570,400,TF(`${OI}${vE}\\cdot${vn}\\,${dA}=E\\times A`,885,140,{size:38})
   +L('使えるのは',885,220,{size:26,color:C.dim})
   +L('① 面の 上で E が 一定',885,285,{size:28})+ok(1120,287,seg(p,.2,.3))
   +L('② 𝐄 が 面に 垂直',885,345,{size:28})+ok(1120,347,seg(p,.3,.4))
   +fade(seg(p,.6,.75),L('→ 電荷の 配置の 対称性',885,420,{size:30,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'nosym']:(p)=>{
  let s=charge(250,200,1,18)+charge(400,330,1,18)+charge(620,140,-1,18)+ring(300,262,170,{color:G1.A,w:3});
  s+=card(720,90,450,320,L('配置が 非対称',945,160,{size:28,weight:700})+L('法則は 成り立つ ✓',945,240,{size:28,color:G1.ok})+fade(seg(p,.35,.5),L('でも 各点の E は',945,310,{size:28})+L('決まらない',945,365,{size:30,color:G1.bad,weight:700})),1);
  return s;
 },
 // ===== S4 点電荷 =====
 [K+'pt']:(p)=>{
  const rot=Math.PI/8*seg(p,.2,.8);
  let s=charge(330,262,1,20)+radial(330,262,{r0:40,len:80,rot});
  s+=fade(seg(p,.15,.3),draw(Array.from({length:30},(_,i)=>{const a=-1.9+i*1.1/29;return [330+180*Math.cos(a),262+180*Math.sin(a)];}),1,{color:C.dim,w:3})+label('回しても 同じ',470,90,{size:26,color:C.dim}));
  s+=card(720,140,450,220,L('点電荷 Q',945,215,{size:30,weight:700})+L('どの 向きに 回しても 同じ 配置',945,290,{size:24,color:C.dim}),1);
  return s;
 },
 [K+'pt2']:(p)=>{
  let s=charge(330,262,1,20)+radial(330,262,{r0:40,len:80,rot:Math.PI/8});
  s+=fade(seg(p,.4,.6),ring(330,262,170,{color:G1.A,w:3})+line(330,262,330+170*Math.cos(-.5),262+170*Math.sin(-.5),{color:G1.geo,w:2})+label('r',430,190,{size:28,weight:700}));
  for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;s+=fade(seg(p,.6,.75),arrow(330+170*Math.cos(a),262+170*Math.sin(a),330+225*Math.cos(a),262+225*Math.sin(a),{color:G1.E,w:5,head:13}));}
  s+=card(720,110,450,280,L('𝐄：半径方向',945,190,{size:28,color:G1.E,weight:700})+L('同じ r なら 同じ 強さ',945,260,{size:28})+fade(seg(p,.5,.65),L('→ 半径 r の 球を 選ぶ',945,330,{size:28,color:G1.A,weight:700})),1);
  return s;
 },
 [K+'pt3']:(p)=>{
  const sz=64,parts=['E\\times','4\\pi r^2','=','\\frac{Q}{\\varepsilon_0}'],gap=18;
  const ws=parts.map(t=>texWidth(t,sz,false)),tot=ws.reduce((a,b)=>a+b,0)+gap*3;let x=600-tot/2;const cx=[];
  ws.forEach(w=>{cx.push(x+w/2);x+=w+gap;});
  let s=parts.map((t,i)=>TF(t,cx[i],230,{size:sz,frac:i===3})).join('');
  s+=fade(seg(p,.1,.25),label('左辺',(cx[0]+cx[1])/2,100,{size:26,color:C.dim,anchor:'middle'})+label('右辺',cx[3],100,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.15,.3),brace(cx[1]-ws[1]/2,cx[1]+ws[1]/2,262,{text:'球の 面積',size:26,color:G1.A}));
  s+=fade(seg(p,.5,.65),brace(cx[3]-ws[3]/2,cx[3]+ws[3]/2,310,{text:'中の 電荷 ÷ ε₀',size:26,color:C.a}));
  return s;
 },
 [K+'pt4']:(p)=>{
  let s=TF(`E\\times 4\\pi r^2=\\frac{Q}{\\varepsilon_0}`,600,90,{size:44,frac:true});
  s+=fade(seg(p,.1,.3),L('両辺 ÷ 4πr²',600,185,{size:28,color:G1.hi,weight:700}));
  s+=TF(`E=\\frac{Q}{4\\pi\\varepsilon_0 r^2}`,600,345,{size:60,frac:true,box:true,g:seg(p,.3,.5)});
  return s;
 },
 [K+'pt5']:(p)=>{
  const box=(x,t,c,g)=>fade(g,rect(x-150,170,300,120,{fill:'#131f38',fo:.96,stroke:c,sw:2,rx:14})+L(t,x,240,{size:28,color:c,weight:700}));
  let s=box(220,'クーロンの法則',C.ink,1)+fade(seg(p,.05,.15),arrow(380,230,440,230,{color:C.dim,w:3,head:12}))+box(600,'ガウスの法則',G1.hi,seg(p,.05,.2));
  s+=fade(seg(p,.35,.45),arrow(760,230,820,230,{color:C.dim,w:3,head:12}))+box(980,'クーロンの法則',C.ink,seg(p,.35,.5));
  s+=fade(seg(p,.6,.75),L('同じ 式に 戻った ＝ 整合の 確認（新しい 証明 ではない）',600,400,{size:28,color:G1.hi,weight:700}));
  return s;
 },
 [K+'ptnum']:(p)=>{
  let s=card(80,60,1040,400,L('Q ＝ 1 nC、r ＝ 1 m',600,120,{size:28,color:C.dim})
   +TF('E=\\frac{1\\times10^{-9}}{4\\pi\\times 8.85\\times10^{-12}\\times 1^2}',600,240,{size:44,frac:true,g:seg(p,.05,.25)})
   +TF('\\approx 8.99\\ \\mathrm{N/C}',600,370,{size:48,box:true,g:seg(p,.3,.45)})
   +fade(seg(p,.6,.75),label('中級と 同じ',880,380,{size:28,color:G1.ok,weight:700})),1);
  return s;
 },
 // ===== S5 直線の電荷 =====
 [K+'line']:(p)=>{
  let s=lineCharge({x0:80,x1:1120,g:seg(p,0,.2)});
  s+=fade(seg(p,.1,.25),label('…',60,CYY+10,{size:30,color:LAM,anchor:'end'})+label('…',1140,CYY+10,{size:30,color:LAM}));
  s+=fade(seg(p,.4,.6),line(400,CYY-40,600,CYY-40,{color:C.ink,w:2})+line(400,CYY-50,400,CYY-30,{color:C.ink,w:2})+line(600,CYY-50,600,CYY-30,{color:C.ink,w:2})+L('1 m',500,CYY-60,{size:26}));
  s+=card(330,330,540,150,L('線密度 λ（ラムダ）＝ 1 m あたりの 電荷',600,390,{size:26,weight:700})+L('単位 C/m',600,445,{size:26,color:C.dim}),seg(p,.5,.65));
  return s;
 },
 [K+'linesym']:(p)=>{
  // side view
  let s=line(60,CYY,620,CYY,{color:LAM,w:7})+label('横から',80,90,{size:24,color:C.dim});
  for(const x of [140,260,380,500])s+=arrow(x,CYY-12,x,CYY-110,{color:G1.E,w:4,head:12,g:seg(p,.4,.6)})+arrow(x,CYY+12,x,CYY+110,{color:G1.E,w:4,head:12,g:seg(p,.4,.6)});
  s+=fade(seg(p,.05,.25),arrow(200,CYY+150,360,CYY+150,{color:C.dim,w:3,head:12})+label('ずらしても 同じ',380,CYY+160,{size:24,color:C.dim}));
  // end view
  const ex=900;
  s+=dot(ex,CYY,12,LAM)+label('線の 方向から 見る',ex,70,{size:24,color:C.dim,anchor:'middle'});
  s+=radial(ex,CYY,{r0:22,len:100,n:8,g:seg(p,.4,.6)});
  s+=fade(seg(p,.15,.35),draw(Array.from({length:30},(_,i)=>{const a=-2.2+i*1.3/29;return [ex+170*Math.cos(a),CYY+170*Math.sin(a)];}),1,{color:C.dim,w:3})+label('回しても 同じ',ex+120,CYY-140,{size:24,color:C.dim}));
  s+=fade(seg(p,.6,.75),L('真横に 放射状',ex,CYY+200,{size:26,color:G1.E,weight:700}));
  return s;
 },
 [K+'cyl']:(p)=>{
  let s=lineCharge({x0:110,x1:930});
  s+=cylinder({g:seg(p,.05,.3)});
  s+=fade(seg(p,.3,.45),line(X1+50,CYY,X1+50,CYY-RR,{color:C.ink,w:2})+label('r',X1+62,CYY-RR/2,{size:28,weight:700}));
  s+=fade(seg(p,.35,.5),brace(X0,X1,CYY+RR+16,{text:'長さ L',size:26,color:C.ink}));
  s+=card(960,90,220,160,L('中の 電荷',1070,150,{size:24})+TF('\\lambda L',1070,215,{size:40}),seg(p,.6,.75),LAM);
  return s;
 },
 [K+'caps']:(p)=>{
  let s=lineCharge({x0:110,x1:930})+cylinder({hlCaps:seg(p,.05,.2)});
  s+=capArrows({g:seg(p,.15,.35)});
  s+=fade(seg(p,.3,.45),label('𝐧',X0-EX-80,CYY-74,{size:28,color:G1.n,weight:700})+label('𝐄',X0+12,CYY-60,{size:28,color:G1.E,weight:700}));
  s+=card(960,90,220,300,L('ふた',1070,150,{size:28,color:G1.hi,weight:700})+L('𝐄 は 面に 沿う',1070,215,{size:24})+TF('{\\color{#ffe28a}{\\Phi}}=0',1070,300,{size:40,g:seg(p,.5,.65)}),1,G1.hi);
  return s;
 },
 [K+'side']:(p)=>{
  // unrolled rectangle
  const g1=seg(p,0,.3);
  let s=fade(1-g1,lineCharge({x0:110,x1:930})+cylinder({hlSide:1})+sideArrows());
  const rx=200,ry=110,rw=520,rh=260;
  s+=fade(g1,rect(rx,ry,rw,rh,{fill:G1.A,fo:.16,stroke:G1.A,sw:3,rx:2})
   +brace(rx,rx+rw,ry+rh+12,{text:'円周 2πr',size:26,color:C.ink})
   +label('L',rx-30,ry+rh/2+10,{size:30,weight:700,anchor:'end'})+line(rx-14,ry,rx-14,ry+rh,{color:C.ink,w:2}));
  for(const [x,y] of [[330,190],[460,190],[590,190],[330,300],[460,300],[590,300]])s+=fade(seg(p,.35,.5),ring(x,y,14,{color:G1.E,w:3})+dot(x,y,4,G1.E));
  s+=fade(seg(p,.35,.5),label('⊙ 𝐄 は 面に 垂直（手前向き）',rx,ry-20,{size:24,color:G1.E}));
  s+=card(800,130,370,250,L('側面の 電気束',985,190,{size:26,color:C.dim})+TF('E\\times 2\\pi r L',985,280,{size:44,box:true,g:seg(p,.6,.75)}),seg(p,.5,.6));
  return s;
 },
 [K+'solve']:(p)=>{
  let s=TF('E\\times 2\\pi rL=\\frac{\\lambda L}{\\varepsilon_0}',600,100,{size:48,frac:true});
  s+=fade(seg(p,.2,.35),L('両辺 ÷ 2πrL',600,200,{size:28,color:G1.hi,weight:700}));
  s+=TF('E=\\frac{\\lambda \\cancel{L}}{\\varepsilon_0\\,2\\pi r\\cancel{L}}',400,340,{size:48,frac:true,g:seg(p,.3,.5)});
  s+=TF('=\\frac{\\lambda}{2\\pi\\varepsilon_0 r}',800,340,{size:52,frac:true,box:true,g:seg(p,.6,.75)});
  return s;
 },
 [K+'why']:(p)=>{
  const c=(cx,r,lab,g)=>fade(g,line(cx-110,CYY,cx+110,CYY,{color:LAM,w:6})+`<ellipse cx="${cx}" cy="${CYY}" rx="${r*.24}" ry="${r}" fill="none" stroke="${G1.A}" stroke-width="3"/>`+line(cx-70,CYY-r,cx+70,CYY-r,{color:G1.A,w:3})+line(cx-70,CYY+r,cx+70,CYY+r,{color:G1.A,w:3})+L(lab,cx,CYY+r+50,{size:26}));
  let s=c(250,70,'半径 r',1)+c(650,140,'半径 2r',seg(p,.05,.2));
  s+=card(860,60,320,400,L('半径 2倍',1020,120,{size:26,color:C.dim})+L('側面積：2倍',1020,195,{size:28,color:G1.A,weight:700})+fade(seg(p,.25,.4),L('中の 電荷：同じ',1020,265,{size:28,color:LAM,weight:700}))+fade(seg(p,.5,.65),L('E：1/2',1020,345,{size:32,color:G1.E,weight:700})+L('→ 1/r',1020,410,{size:32,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(60,50,1080,420,L('λ ＝ 1 nC/m、r ＝ 0.1 m',600,110,{size:28,color:C.dim})
   +TF('E=\\frac{1\\times10^{-9}}{2\\pi\\times 8.85\\times10^{-12}\\times 0.1}',600,240,{size:44,frac:true,g:seg(p,.05,.25)})
   +TF('\\approx 180\\ \\mathrm{N/C}',600,385,{size:50,box:true,g:seg(p,.45,.6)}),1);
  return s;
 },
 [K+'num2']:(p)=>{
  const A=axes({x:130,y:440,w:620,h:340,xmax:.5,ymax:400,g:1});
  let s=A.svg+A.plot(r=>18/r,{from:.045,to:.5,color:G1.E,w:4});
  for(const v of [.1,.2,.3,.4,.5])s+=label(String(v),A.X(v),A.Y(0)+34,{size:22,color:C.dim,anchor:'middle'});
  for(const v of [100,200,300])s+=label(String(v),A.X(0)-12,A.Y(v)+8,{size:22,color:C.dim,anchor:'end'});
  s+=label('r（m）',A.X(.5)+40,A.Y(0)+8,{size:24,color:C.dim})+label('E（N/C）',A.X(0)+10,A.Y(400)-6,{size:24,color:C.dim});
  s+=dot(A.X(.1),A.Y(180),9,G1.hi)+label('180',A.X(.1)+16,A.Y(180)-10,{size:26,color:G1.hi,weight:700});
  s+=fade(seg(p,.15,.3),dot(A.X(.2),A.Y(90),9,G1.hi)+label('90',A.X(.2)+16,A.Y(90)-12,{size:26,color:G1.hi,weight:700}));
  s+=card(820,120,350,260,L('距離 2倍',995,190,{size:28})+L('→ E は 半分',995,260,{size:30,color:G1.E,weight:700})+L('（1/r）',995,320,{size:26,color:C.dim}),seg(p,.3,.45));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(110,70,980,360,L('重ね合わせで 完成',600,130,{size:28,color:C.dim})+qin(`${OI}${vE}\\cdot${vn}\\,${dA}`,600,260,{size:54,box:true})+L('何個の 電荷でも・どんな 形の 閉じた 面でも',600,390,{size:26,color:G1.hi}),1,G1.hi);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,70,500,380,L('点電荷',330,130,{size:30,weight:700})+charge(330,210,1,16)+TF('E=\\frac{Q}{4\\pi\\varepsilon_0 r^2}',330,320,{size:38,frac:true})+L('1/r²',330,410,{size:30,color:G1.hi,weight:700}),1);
  s+=card(620,70,500,380,L('直線',870,130,{size:30,weight:700})+line(760,210,980,210,{color:LAM,w:6})+TF('E=\\frac{\\lambda}{2\\pi\\varepsilon_0 r}',870,320,{size:38,frac:true})+L('1/r',870,410,{size:30,color:G1.hi,weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'next']:(p)=>{
  // wide sheet in perspective
  let s=poly([[120,330],[620,330],[760,200],[260,200]],{fill:LAM,fo:.25,stroke:LAM,sw:3});
  for(const [x,y] of [[300,240],[420,290],[540,240],[640,280],[380,215],[500,310]])s+=label('＋',x,y,{size:26,color:C.a,anchor:'middle',weight:700});
  s+=label('σ',140,190,{size:32,color:LAM,weight:700});
  s+=card(820,90,350,320,L('広い 板',995,150,{size:28,weight:700})+TF('E=\\frac{\\sigma}{2\\varepsilon_0}',995,250,{size:44,frac:true})+L('なぜ 2？',995,360,{size:34,color:G1.hi,weight:700}),seg(p,.1,.3),G1.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=ring(260,262,150,{color:LAM,w:6});
  for(let i=0;i<10;i++){const a=i*Math.PI/5;s+=label('＋',260+150*Math.cos(a),262+150*Math.sin(a)+9,{size:24,color:C.a,anchor:'middle',weight:700});}
  s+=L('球殻',260,470,{size:26});
  s+=rect(560,130,260,260,{fill:'#7f8fa8',fo:.25,stroke:'#c9d6ee',sw:3,rx:10})+L('導体',690,470,{size:26});
  s+=label('E ＝ 0 ？',260,272,{size:32,color:G1.hi,weight:700,anchor:'middle'})+label('E ＝ 0 ？',690,272,{size:32,color:G1.hi,weight:700,anchor:'middle'});
  s+=card(880,150,290,200,L('なぜ？',1025,265,{size:38,color:G1.hi,weight:700}),seg(p,.2,.35),G1.hi);
  return s;
 },
};
