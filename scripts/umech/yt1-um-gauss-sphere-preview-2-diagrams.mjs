// YouTube シリーズ「ガウスの法則・中級 2/2」(ys-um-gauss-sphere-preview-2) — 図。Stage 1200×515.
// 色は 1/2 と共通：電場 𝐄 水色、法線 𝐧 桃、面積 金、電気束 Φ・強調 黄、電荷 Q 桃（図の正電荷は赤い丸）、誤り 赤。
// 数値：1 nC → 4π×8.99＝112.97≈113 N·m²/C。r＝1 m：8.99 N/C × 12.57 m²、r＝2 m：2.25 N/C × 50.27 m²。ε₀≈8.85×10⁻¹² C²/(N·m²)。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,poly} from './anim.mjs';
import {charge,blobPts,closedPath} from './yt1-ui-closed-bag-1-diagrams.mjs';
import {GC,cs,card,T,L,vE,vn,EE,PHI,QQ,FLUX,UF,ok,view,SPHERE,surface,sphereOutline} from './yt1-um-gauss-sphere-preview-1-diagrams.mjs';

const K='um-gauss-sphere-preview-2:';
const D2R=Math.PI/180;
const A4=cs(GC.A,'4\\pi r^2');
const kk=cs(C.ink,'k'),EPS=cs(C.ink,'\\varepsilon_0');
const bad=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:GC.bad,weight:700,anchor:'middle'}));
// cross-section of a sphere (circle) with the charge at offset (ox,oy) px from the centre.
// E arrows at points on the circle: direction from the charge, length ∝ 1/d² (clamped); normals from the centre.
function section(cx,cy,R,{ox=0,oy=0,n=8,rot=22.5,gE=1,gN=1,kE=1,title='',lenN=34,g=1,maxL=120}={}){
 const qx=cx+ox,qy=cy+oy;
 let s=ring(cx,cy,R,{color:'#c9d6ee',w:3,fill:'rgba(154,171,199,.06)'})+dot(cx,cy,4,C.dim);
 for(let i=0;i<n;i++){const a=(rot+360*i/n)*D2R,x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);
  const dx=x-qx,dy=y-qy,d=Math.hypot(dx,dy),Lh=Math.max(18,Math.min(maxL,kE*60*(R/d)**2));
  s+=arrow(x,y,x+Lh*dx/d,y+Lh*dy/d,{color:GC.E,w:5,head:14,g:gE});
  s+=arrow(x,y,x+lenN*Math.cos(a),y-lenN*Math.sin(a),{color:GC.n,w:4,head:12,g:gN});}
 s+=charge(qx,qy,1,18);
 if(title)s+=label(title,cx,cy+R+85,{size:26,color:C.dim,anchor:'middle'});
 return fade(g,s);
}

export const ytUmGaussSphere2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=card(80,90,1040,170,T(`\\Delta${PHI}_i\\approx${cs(GC.E,'\\mathbf{E}_i')}\\cdot${cs(GC.n,'\\mathbf{n}_i')}\\,${cs(GC.A,'\\Delta A_i')}\\quad\\longrightarrow\\quad ${PHI}=${FLUX}`,600,175,{size:46}),seg(p,.05,.2));
  s+=fade(seg(p,.4,.55),L('タイルごとの寄与を 足した行き先',600,320,{size:28,color:C.dim}));
  return s;
 },
 [K+'recap2']:(p)=>{
  const P=view(260,262,170);
  let s=surface(P,SPHERE)+sphereOutline(260,262,170)+charge(260,262,1,20);
  s+=card(520,90,640,150,T(`${FLUX}=${EE}\\times${A4}`,840,165,{size:48}),seg(p,.3,.5),GC.hi);
  s+=fade(seg(p,.1,.3),L('cos ＝ 1 ✓　どこでも同じ E ✓',840,310,{size:30,color:GC.hi,weight:700}));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=T(`${FLUX}=${EE}\\times${A4}`,600,100,{size:44,opacity:.85});
  s+=card(200,180,800,230,L('前回の 最後の問い',600,235,{color:C.dim})+L('ガウスの法則を 証明した？',600,300,{size:32,color:GC.hi,weight:700})+L('右辺の 中の電荷と どうつながる？',600,365,{size:32,color:GC.hi,weight:700}),seg(p,.05,.25),GC.hi);
  return s;
 },
 [K+'promise']:(p)=>{
  let s=closedPath(blobPts(150),300,262,{w:4})+charge(300,262,1,22);
  for(let i=0;i<8;i++){const a=(22.5+45*i)*D2R;s+=arrow(300+30*Math.cos(a),262-30*Math.sin(a),300+215*Math.cos(a),262-215*Math.sin(a),{color:GC.E,w:3,head:12,g:seg(p,.05,.25)});}
  s+=card(620,110,540,270,L('初級：ガウスの法則',890,165,{size:26,color:C.dim})+L('合計 ∝ 中の正味の電荷',890,230,{size:32,color:GC.hi,weight:700})+fade(seg(p,.5,.65),L('比例の係数は？',890,300,{size:30})+L('→ 中級で（約束）',890,350,{size:28,color:C.dim})),seg(p,.02,.2));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(200,90,800,320,L('今回の問い',600,145,{color:C.dim})+L('球の計算は 証明なのか？',600,215,{size:34,color:GC.hi,weight:700})+L('クーロンの法則から',600,290,{size:30})+L('電気束は いくつになる？',600,350,{size:34,color:GC.hi,weight:700}),seg(p,.05,.25),GC.hi);
  return s;
 },

 // ===== S2 示したのは左辺だけ =====
 [K+'answer']:(p)=>{
  let s=T(`${FLUX}=${EE}\\times${A4}`,600,120,{size:48});
  s+=card(350,230,500,150,L('証明には',600,285,{size:30})+L('なっていない',600,345,{size:38,color:GC.bad,weight:700}),seg(p,.1,.3),GC.bad);
  return s;
 },
 [K+'lhs']:(p)=>{
  let s=T(`${FLUX}\\quad=\\quad ?`,600,110,{size:52});
  s+=fade(seg(p,.1,.25),L('左辺：電気束',460,215,{size:28,color:GC.hi,weight:700})+L('右辺：中の電荷',780,215,{size:28,color:GC.Q,weight:700}));
  s+=card(150,280,900,160,L('前回 示したのは',600,330,{size:26,color:C.dim})+T(`\\text{左辺}=${EE}\\times${A4}\\quad\\text{だけ}`,600,395,{size:44}),seg(p,.45,.6),GC.hi);
  return s;
 },
 [K+'noE']:(p)=>{
  let s=T(`${FLUX}=${cs(GC.hi,'E')}\\times${A4}`,600,110,{size:52});
  s+=fade(seg(p,.1,.3),L('E ＝ ？',520,215,{size:34,color:GC.hi,weight:700}));
  s+=card(250,270,700,150,L('E と 中の電荷の関係は',600,325,{size:28})+L('まだ 使っていない',600,385,{size:32,color:GC.bad,weight:700}),seg(p,.3,.5));
  return s;
 },
 [K+'any']:(p)=>{
  const shapes=[[200,blobPts(110)],[600,[[-110,-95],[-30,-120],[115,-100],[125,15],[100,115],[-25,105],[-125,90],[-115,0]]],[1000,blobPts(115).map(([x,y],i)=>{const t=2*Math.PI*i/120;const r=1+.25*Math.sin(3*t);return [x*r,y*r];})]];
  let s='';shapes.forEach(([x,P],i)=>{s+=fade(seg(p,.1+.12*i,.25+.12*i),closedPath(P,x,230,{w:4})+charge(x,230,1,18));});
  s+=fade(seg(p,.5,.65),L('どんな閉じた面でも 成り立つ という主張',600,440,{size:30,color:GC.hi,weight:700}));
  return s;
 },
 [K+'symm']:(p)=>{
  let s=card(80,90,500,300,L('法則が 成り立つ 条件？',330,150,{size:28})+L('→ ちがう',330,220,{size:34,color:GC.bad,weight:700})+L('対称性がなくても 成り立つ',330,300,{size:26,color:C.dim}),seg(p,.02,.2));
  s+=card(620,90,500,300,L('計算を 楽にする 条件',870,150,{size:28})+L('→ そう',870,220,{size:34,color:GC.ok,weight:700})+L('E を外へ 出せる',870,300,{size:28,color:GC.E}),seg(p,.4,.6),GC.hi);
  return s;
 },
 [K+'range']:(p)=>{
  let s=card(80,70,500,360,L('法則が 成り立つ',330,130,{size:30,color:GC.hi,weight:700})+closedPath(blobPts(80),230,260,{w:3})+charge(230,260,1,14)+closedPath([[-70,-60],[70,-55],[75,60],[-65,65]],430,260,{w:3})+charge(430,260,1,14)+L('どんな閉じた面でも',330,395,{size:26}),seg(p,.02,.2));
  s+=card(620,70,500,360,L('掛け算 E×4πr² が 使える',870,130,{size:30,color:GC.hi,weight:700})+ring(870,260,85,{color:'#c9d6ee',w:3})+charge(870,260,1,14)+L('中心に電荷がある 球だけ',870,395,{size:26}),seg(p,.35,.55),GC.hi);
  return s;
 },

 // ===== S3 ずれた球では =====
 [K+'shift']:(p)=>{
  const u=seg(p,.1,.6);
  let s=section(330,262,170,{ox:-95*u,oy:20*u,gE:0,gN:0});
  s+=card(680,150,460,190,L('電荷を 中心から',910,215,{size:28})+L('ずらすと？',910,280,{size:34,color:GC.hi,weight:700}),seg(p,.02,.2),GC.hi);
  return s;
 },
 [K+'dist']:(p)=>{
  const cx=330,cy=262,R=170,ox=-95,oy=20;
  let s=section(cx,cy,R,{ox,oy,gE:seg(p,.25,.5),gN:0});
  const near=[cx-R,cy],far=[cx+R,cy];
  s+=fade(seg(p,.05,.25),line(cx+ox,cy+oy,near[0],near[1],{color:C.ink,w:2,dash:'6 6'})+line(cx+ox,cy+oy,far[0],far[1],{color:C.ink,w:2,dash:'6 6'})+label('近い',cx-R+10,cy+45,{size:24,color:C.ink})+label('遠い',cx+R-60,cy+45,{size:24,color:C.ink}));
  s+=card(700,130,450,230,L('チェック 2：大きさ',925,190,{size:28,color:GC.hi,weight:700})+L('近い → 強い、遠い → 弱い',925,255,{size:26,color:GC.E})+fade(seg(p,.6,.75),L('どこでも同じ E ではない',925,315,{size:26})+bad(1120,320)),seg(p,.1,.3),GC.hi);
  return s;
 },
 [K+'angle']:(p)=>{
  let s=section(330,262,170,{ox:-95,oy:20,gE:1,gN:seg(p,.1,.35)});
  s+=card(700,130,450,230,L('チェック 1：向き',925,190,{size:28,color:GC.hi,weight:700})+L('𝐄 は 電荷から、𝐧 は 中心から',925,255,{size:24})+fade(seg(p,.5,.65),L('平行でない → cos ≠ 1',925,315,{size:26})+bad(1120,320)),seg(p,.05,.25),GC.hi);
  return s;
 },
 [K+'cant']:(p)=>{
  let s=section(180,240,120,{ox:0,oy:0,title:'中心の球',kE:.8,maxL:70});
  s+=section(590,240,120,{ox:-65,oy:15,title:'ずれた球',kE:.8,maxL:70});
  s+=card(890,110,290,300,L('ずれた球',1035,160,{size:26,color:C.dim})+L('E を外へ',1035,225,{size:28})+L('出せない',1035,270,{size:30,color:GC.bad,weight:700})+fade(seg(p,.4,.55),L('面積は 同じ 4πr²',1035,345,{size:24,color:GC.A})),seg(p,.1,.3),GC.bad);
  return s;
 },
 [K+'upper']:(p)=>{
  let s=section(300,262,170,{ox:-95,oy:20});
  s+=card(640,110,520,280,L('面は 取り替えない',900,170,{size:28})+T(`${FLUX}`,900,250,{size:46})+L('各タイルの内積を そのまま積分',900,320,{size:26})+fade(seg(p,.45,.6),L('→ 上級で',900,370,{size:30,color:GC.hi,weight:700})),seg(p,.05,.25));
  return s;
 },
 [K+'plan']:(p)=>{
  const P=view(300,262,170);
  let s=surface(P,SPHERE)+sphereOutline(300,262,170)+charge(300,262,1,20);
  s+=card(640,150,500,190,L('今回 計算するのは',890,210,{size:26,color:C.dim})+L('中心に電荷がある 球だけ',890,275,{size:32,color:GC.hi,weight:700}),seg(p,.05,.25),GC.hi);
  return s;
 },

 // ===== S4 クーロンの法則を入れる =====
 [K+'coulomb']:(p)=>{
  let s=charge(170,262,1,24)+label('Q',170,215,{size:30,color:GC.Q,weight:700,anchor:'middle'});
  s+=fade(seg(p,.1,.3),line(170,262,470,262,{color:C.ink,w:3,dash:'8 6'})+label('r',320,250,{size:30,color:C.ink,weight:700,anchor:'middle'})+arrow(470,262,570,262,{color:GC.E,w:6,head:18})+label('E',580,250,{size:30,color:GC.E,weight:700}));
  s+=card(680,110,470,260,L('クーロンの法則',915,165,{size:28,color:C.dim})+T(`${EE}=\\dfrac{${kk}\\,${QQ}}{r^2}`,915,265,{size:56}),seg(p,.35,.55),GC.hi);
  return s;
 },
 [K+'k']:(p)=>{
  let s=T(`${EE}=\\dfrac{${kk}\\,${QQ}}{r^2}`,600,110,{size:50});
  s+=card(200,200,800,120,T(`${kk}\\approx 8.99\\times10^{9}\\,\\mathrm{N\\cdot m^2/C^2}`,600,262,{size:44}),seg(p,.05,.25));
  s+=fade(seg(p,.55,.7),L('実験に 支えられた 原理',600,390,{size:32,color:GC.hi,weight:700}));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(`${PHI}=${cs(GC.hi,'E')}\\times${A4}`,600,100,{size:48});
  s+=fade(seg(p,.2,.35),L('E に クーロンの法則を 入れる ↓',600,200,{size:26,color:C.dim}));
  s+=fade(seg(p,.4,.6),T(`${PHI}=${cs(GC.hi,'\\dfrac{kQ}{r^2}')}\\times${A4}`,600,320,{size:56}));
  return s;
 },
 [K+'cancel']:(p)=>{
  const c=seg(p,.15,.35);
  let s=T(`${PHI}=\\dfrac{${kk}\\,${QQ}}{${c>.5?'\\cancel{r^2}':'r^2'}}\\times 4\\pi\\,${c>.5?cs(GC.A,'\\cancel{r^2}'):cs(GC.A,'r^2')}`,600,120,{size:56});
  s+=fade(seg(p,.2,.35),L('分母の r² と 表面積の r² が 打ち消し合う',600,240,{size:26,color:GC.hi}));
  s+=card(350,300,500,130,T(`${PHI}=4\\pi\\,${kk}\\,${QQ}`,600,365,{size:56}),seg(p,.55,.75),GC.hi);
  return s;
 },
 [K+'rgone']:(p)=>{
  let s=T(`${PHI}=4\\pi\\,${kk}\\,${QQ}`,600,110,{size:56});
  s+=fade(seg(p,.1,.3),L('r が ない',600,210,{size:32,color:GC.hi,weight:700}));
  s+=fade(seg(p,.35,.55),ring(330,360,50,{color:'#c9d6ee',w:3})+ring(600,360,80,{color:'#c9d6ee',w:3})+ring(890,360,110,{color:'#c9d6ee',w:3})+charge(330,360,1,12)+charge(600,360,1,14)+charge(890,360,1,16));
  s+=fade(seg(p,.55,.7),L('大きさによらず 同じ',600,500,{size:26,color:C.dim}));
  return s;
 },
 [K+'why']:(p)=>{
  let s=card(80,90,500,300,L('半径 2倍',330,150,{size:28,color:C.dim})+L('E：1/4',330,230,{size:40,color:GC.E,weight:700})+L('（逆2乗で 弱まる）',330,290,{size:24,color:C.dim}),seg(p,.02,.2));
  s+=card(620,90,500,300,L('半径 2倍',870,150,{size:28,color:C.dim})+L('表面積：4倍',870,230,{size:40,color:GC.A,weight:700})+L('（r² に比例して 増える）',870,290,{size:24,color:C.dim}),seg(p,.25,.45));
  s+=fade(seg(p,.6,.75),L('1/4 × 4 ＝ 1 → 変わらない',600,450,{size:32,color:GC.hi,weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=T(`${QQ}=1\\,\\mathrm{nC}=10^{-9}\\,\\mathrm{C}`,600,90,{size:44});
  s+=fade(seg(p,.2,.4),T(`${PHI}=4\\pi\\times8.99\\times10^{9}\\times10^{-9}`,600,210,{size:48}));
  s+=card(330,290,540,110,T(`\\approx 113${UF}`,600,345,{size:50,color:GC.hi}),seg(p,.55,.75),GC.hi);
  return s;
 },
 [K+'r1']:(p)=>{
  let s=card(80,90,500,340,L('r ＝ 1 m',330,145,{size:32,weight:700})+T(`${EE}\\approx 8.99\\,\\mathrm{N/C}`,330,220,{size:40})+T(`${A4}\\approx 12.6\\,\\mathrm{m^2}`,330,295,{size:40})+fade(seg(p,.5,.7),T(`\\text{掛けて}\\approx 113`,330,375,{size:40,color:GC.hi})),seg(p,.02,.2),GC.hi);
  s+=card(620,90,500,340,L('r ＝ 2 m',870,145,{size:32,weight:700}),1);
  return s;
 },
 [K+'r2']:(p)=>{
  let s=card(80,90,500,340,L('r ＝ 1 m',330,145,{size:32,weight:700})+T(`${EE}\\approx 8.99\\,\\mathrm{N/C}`,330,220,{size:40})+T(`${A4}\\approx 12.6\\,\\mathrm{m^2}`,330,295,{size:40})+T(`\\text{掛けて}\\approx 113`,330,375,{size:40,color:GC.hi}),1,GC.hi);
  s+=card(620,90,500,340,L('r ＝ 2 m',870,145,{size:32,weight:700})+fade(seg(p,.1,.3),T(`${EE}\\approx 2.25\\,\\mathrm{N/C}`,870,220,{size:40}))+fade(seg(p,.25,.45),T(`${A4}\\approx 50.3\\,\\mathrm{m^2}`,870,295,{size:40}))+fade(seg(p,.5,.7),T(`\\text{掛けて}\\approx 113`,870,375,{size:40,color:GC.hi})),1,GC.hi);
  s+=fade(seg(p,.55,.7),L('E は 1/4、面積は 4倍',600,475,{size:26,color:C.dim}));
  return s;
 },

 // ===== S5 ε₀ を定義する =====
 [K+'always']:(p)=>{
  let s=T(`${PHI}=${cs(GC.hi,'4\\pi k')}\\,${QQ}`,600,120,{size:60});
  s+=fade(seg(p,.35,.55),L('4πk は いつも 一緒に 出てくる',600,280,{size:30,color:GC.hi,weight:700}));
  return s;
 },
 [K+'define']:(p)=>{
  let s=card(250,60,700,250,L('新しい定数の 定義',600,105,{size:26,color:C.dim})+T(`${EPS}=\\dfrac{1}{4\\pi ${kk}}`,600,230,{size:56}),seg(p,.05,.25),GC.hi);
  s+=fade(seg(p,.5,.7),L('真空の誘電率',600,380,{size:32,color:GC.hi,weight:700}));
  return s;
 },
 [K+'notx']:(p)=>{
  let s=card(80,90,500,280,L('k を 別の単位に 両替？',330,160,{size:28})+L('→ ちがう',330,240,{size:34,color:GC.bad,weight:700}),seg(p,.02,.2),GC.bad);
  s+=card(620,90,500,280,L('1/(4πk) という 組み合わせに',870,160,{size:26})+L('名前を付けた 新しい定数',870,215,{size:26})+fade(seg(p,.55,.7),T(`${EPS}=\\dfrac{1}{4\\pi ${kk}}`,870,300,{size:44})),seg(p,.4,.55),GC.hi);
  return s;
 },
 [K+'value']:(p)=>{
  let s=T(`${EPS}=\\dfrac{1}{4\\pi\\times 8.99\\times10^{9}}`,600,110,{size:48});
  s+=card(200,230,800,130,T(`${EPS}\\approx 8.85\\times10^{-12}\\,\\mathrm{C^2/(N\\cdot m^2)}`,600,295,{size:46}),seg(p,.2,.4),GC.hi);
  return s;
 },
 [K+'rewrite']:(p)=>{
  let s=T(`4\\pi ${kk}=\\dfrac{1}{${EPS}}`,600,90,{size:46});
  s+=fade(seg(p,.2,.35),T(`${PHI}=4\\pi ${kk}\\,${QQ}`,600,200,{size:48}));
  s+=card(350,265,500,210,T(`${PHI}=\\dfrac{${QQ}}{${EPS}}`,600,385,{size:64}),seg(p,.45,.65),GC.hi);
  return s;
 },
 [K+'check']:(p)=>{
  let s=T(`${PHI}=\\dfrac{10^{-9}}{8.85\\times10^{-12}}`,600,120,{size:52});
  s+=card(330,250,540,110,T(`\\approx 113${UF}`,600,305,{size:50,color:GC.hi}),seg(p,.3,.5),GC.hi);
  s+=fade(seg(p,.6,.75),L('さっきと 同じ',600,440,{size:28,color:C.dim}));
  return s;
 },
 [K+'coulomb2']:(p)=>{
  let s=T(`${EE}=\\dfrac{${kk}\\,${QQ}}{r^2}`,330,160,{size:52});
  s+=fade(seg(p,.1,.3),L('＝',600,170,{size:40,color:C.dim}));
  s+=fade(seg(p,.15,.35),T(`${EE}=\\dfrac{${QQ}}{4\\pi${EPS}\\,r^2}`,870,160,{size:52}));
  s+=fade(seg(p,.5,.7),L('同じ法則。書き方が 変わっただけ',600,360,{size:30,color:GC.hi,weight:700}));
  return s;
 },
 [K+'coef']:(p)=>{
  let s=T(`${PHI}=\\dfrac{1}{${EPS}}\\times${QQ}`,600,150,{size:62});
  s+=fade(seg(p,.2,.4),L('比例の係数',440,290,{size:28,color:GC.hi,weight:700}));
  s+=fade(seg(p,.2,.4),arrow(470,262,515,215,{color:GC.hi,w:3,head:12}));
  s+=fade(seg(p,.5,.7),L('初級の 約束を 回収',600,410,{size:30}));
  return s;
 },
 [K+'caution']:(p)=>{
  let s=T(`\\dfrac{${QQ}}{${EPS}}`,600,110,{size:56});
  s+=card(80,210,500,200,L('中にある 電荷の量',330,275,{size:30,color:GC.ok,weight:700})+L('で 決まる数',330,335,{size:28})+ok(330,395),seg(p,.1,.3),GC.hi);
  s+=card(620,210,500,200,L('電荷が 面から',870,275,{size:30})+L('出ていく量 ではない',870,335,{size:30,color:GC.bad,weight:700})+bad(870,395),seg(p,.45,.65),GC.bad);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(150,90,900,190,T(`${FLUX}=${EE}\\times${A4}`,600,160,{size:48})+L('左辺の 書き換え（証明ではない）',600,240,{size:28,color:C.dim}),seg(p,0,.2));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(150,60,900,180,T(`\\text{中心の球：}\\ ${PHI}=\\dfrac{${QQ}}{${EPS}}\\quad(r\\text{ によらない})`,600,150,{size:44}),seg(p,0,.2),GC.hi);
  s+=card(250,290,700,150,L('どんな閉じた面でも こうなる 証明',600,345,{size:28})+L('→ 上級',600,400,{size:32,color:GC.hi,weight:700}),seg(p,.45,.65));
  return s;
 },
 [K+'bridge']:(p)=>{
  let s=card(80,110,500,260,L('線に沿って 足す',330,170,{size:28,color:C.dim})+T(`\\displaystyle\\int_C ${vE}\\cdot${cs(C.t,'d\\mathbf{r}')}`,330,275,{size:52}),seg(p,0,.2));
  s+=card(620,110,500,260,L('閉じた面で 足す',870,170,{size:28,color:C.dim})+T(FLUX,870,275,{size:52}),seg(p,.3,.5));
  return s;
 },
 [K+'next']:(p)=>{
  let s=T(`\\displaystyle\\int_C ${vE}\\cdot${cs(C.t,'d\\mathbf{r}')}`,600,90,{size:44,opacity:.85});
  s+=fade(seg(p,.05,.2),L('一般には 道による',600,175,{size:28,color:C.dim}));
  s+=card(200,230,800,210,L('静電場では 道によらず',600,290,{size:30})+L('位置だけで決まる量 ― 電位 ― は',600,350,{size:32,color:GC.hi,weight:700})+L('作れるのか？',600,405,{size:32,color:GC.hi,weight:700}),seg(p,.3,.5),GC.hi);
  return s;
 },
};
