// YouTube シリーズ 微分・上級 1/3（ステージ um-derivative 本6 ＋ 上級の入口の部品）— 図。Stage 1200×515.
// 色：t 金（自動）、幅 h 橙。元の立方体（正方形）t³ 水色、h を1個含む板（帯）橙、h² を含む棒（角）赤、h³ の角 桃。位置 x 水色、速度 v 紫。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='um-derivative-1:';
const CH=C.E,C1=C.E,C2=C.a,C3=C.p,C0=C.x;
const h=`{\\color{${CH}}h}`;
const col=(c,s)=>`{\\color{${c}}${s}}`;
const card=(x,y,w,hh,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,hh,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
// centres of the parts of a TeX row drawn centred at cx (prefix widths keep operator spacing)
function centres(parts,size,cx,auto=false){
 const W=texWidth(parts.join(''),size,auto),L=cx-W/2;const out=[];
 for(let i=0;i<parts.length;i++){const a=i?texWidth(parts.slice(0,i).join(''),size,auto):0,b=texWidth(parts.slice(0,i+1).join(''),size,auto);out.push(L+(a+b)/2);}
 return {c:out,L,W};
}
const top=(s,g=1)=>fade(g,label(s,600,44,{size:26,color:C.dim,anchor:'middle'}));

// ---- isometric cube (t+h)³ split into 8 boxes -------------------------------------------------
const c30=Math.cos(Math.PI/6),s30=.5;
function P(cx,cy,x,y,z){return [cx+(x-y)*c30,cy+(x+y)*s30-z];}
function box(cx,cy,[x0,x1,y0,y1,z0,z1],color,g=1){
 if(g<=0)return '';
 const q=(x,y,z)=>P(cx,cy,x,y,z);
 const topF=[q(x0,y0,z1),q(x1,y0,z1),q(x1,y1,z1),q(x0,y1,z1)];
 const xF=[q(x1,y0,z0),q(x1,y1,z0),q(x1,y1,z1),q(x1,y0,z1)];
 const yF=[q(x0,y1,z0),q(x1,y1,z0),q(x1,y1,z1),q(x0,y1,z1)];
 const solid=pts=>poly(pts,{fill:C.bg,fo:1,stroke:'none'});
 return fade(g,solid(topF)+solid(xF)+solid(yF)+poly(topF,{fill:color,fo:.6,stroke:color,sw:2})+poly(xF,{fill:color,fo:.4,stroke:color,sw:2})+poly(yF,{fill:color,fo:.25,stroke:color,sw:2}));
}
// pieces: kind 0 base, 1 plate, 2 rod, 3 corner. ix,iy,iz = 1 when the piece lies in the added slab of that axis.
const PIECES=[[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[1,1,1]].map(v=>({v,kind:v[0]+v[1]+v[2]}));
const KCOL=[C0,C1,C2,C3];
function cube({cx=330,cy=250,T=130,H=45,gap=0,show=[1,1,1,1],dim=[1,1,1,1],labels=[0,0,0,0]}={}){
 let s='';
 const list=[...PIECES].sort((a,b)=>(a.v[0]+a.v[1]+a.v[2])-(b.v[0]+b.v[1]+b.v[2]));
 for(const pc of list){
  const g=show[pc.kind];if(g<=0)continue;
  const r=pc.v.map(i=>i?[T+gap,T+gap+H]:[0,T]);
  s+=fade(dim[pc.kind],box(cx,cy,[r[0][0],r[0][1],r[1][0],r[1][1],r[2][0],r[2][1]],KCOL[pc.kind],g));
 }
 return s;
}
// screen position of the centre of a piece's visible top (for labels)
function pieceCentre(v,{cx=330,cy=250,T=130,H=45,gap=0}={}){
 const r=v.map(i=>i?T+gap+H/2:T/2);return P(cx,cy,r[0],r[1],r[2]);
}

// ---- square (t+h)² for the recap ----------------------------------------------------------------
function square({x0=110,y0=70,u=240,hh=80,g=[1,1,1,1]}={}){
 const F=u+hh;let s='';
 s+=fade(g[0],rect(x0,y0+hh,u,u,{fill:C0,fo:.25,rx:0})+label('t²',x0+u/2,y0+hh+u/2+12,{size:36,color:C0,anchor:'middle',weight:700}));
 s+=fade(g[1],rect(x0+u,y0+hh,hh,u,{fill:C1,fo:.35,rx:0})+label('th',x0+u+hh/2,y0+hh+u/2+10,{size:28,color:C1,anchor:'middle',weight:700}));
 s+=fade(g[2],rect(x0,y0,u,hh,{fill:C1,fo:.35,rx:0})+label('th',x0+u/2,y0+hh/2+10,{size:28,color:C1,anchor:'middle',weight:700}));
 s+=fade(g[3],rect(x0+u,y0,hh,hh,{fill:C2,fo:.45,rx:0})+label('h²',x0+u+hh/2,y0+hh/2+10,{size:28,color:C2,anchor:'middle',weight:700}));
 s+=rect(x0,y0,F,F,{fill:'none',fo:0,stroke:C.dim,sw:3,rx:0});
 s+=label('t',x0+u/2,y0+F+34,{size:26,color:C.t,anchor:'middle'})+label('h',x0+u+hh/2,y0+F+34,{size:26,color:CH,anchor:'middle'});
 return s;
}

// ---- brackets (t+h)(t+h)... with a chosen letter under each -----------------------------------
function brackets(cx,y,picks,{g=1,size=40,gapx=150,res='',resCol=C.ink,dimTop=1,letters=1}={}){
 const n=picks.length,x0=cx-(n-1)*gapx/2;let s='';
 for(let i=0;i<n;i++){
  const x=x0+i*gapx;
  s+=fade(dimTop,tex(`(t+${h})`,x,y,{size}));
  const pk=picks[i];
  if(pk){const isH=pk==='h',W=texWidth(`(t+${h})`,size),cxr=x-W/2+W*(isH?.745:.2);s+=fade(g,ring(cxr,y-size*.28,size*.46,{color:isH?CH:C.t,w:3})+(letters?label(pk,x,y+62,{size:34,color:isH?CH:C.t,anchor:'middle',weight:700}):''));}
 }
 const ry=letters?y+62:y;
 if(res)s+=fade(g,label('→',x0+(n-1)*gapx+gapx*.62,ry,{size:30,color:C.dim,anchor:'middle'})+tex(res,x0+(n-1)*gapx+gapx*1.1,ry-2,{size:36,color:resCol,anchor:'start',auto:false}));
 return s;
}

// coloured pieces of the expansion of (t+h)³
const E3=`t^3+${col(C1,'3t^2h')}+${col(C2,'3th^2')}+${col(C3,'h^3')}`;
const Q3=`${col(C1,'3t^2')}+${col(C2,'3th')}+${col(C3,'h^2')}`;

export const ytUmDerivative1Diagrams={
 // ================= S1 =================
 [K+'ask']:(p)=>{
  let s=card(170,40,860,300,
    label('中級の最後の問い',600,92,{size:24,color:C.dim,anchor:'middle'})
   +tex('t^n',380,190,{size:64})+tex('\\sin t',600,190,{size:60})+label('…',790,200,{size:44,color:C.ink,anchor:'middle'})
   +label('同じ手順で 導ける？',600,290,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=card(170,40,860,190,
    tex('t^n',380,120,{size:52})+tex('\\sin t',600,120,{size:50})+label('…',790,128,{size:40,color:C.ink,anchor:'middle'})
   +label('同じ手順で 導ける？',600,196,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=fade(seg(p,.05,.25),label('傾きが 決まらない点は？',600,290,{size:32,color:C.a,anchor:'middle',weight:700}));
  const B=[['1/3','t の n 乗'],['2/3','sin・cos'],['3/3','x → v → a、決まらない点']];
  B.forEach(([a,b],i)=>{const x=110+i*340;s+=card(x,340,300,110,label(a,x+150,385,{size:24,color:C.dim,anchor:'middle'})+label(b,x+150,428,{size:i===2?24:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.5+i*.1,.65+i*.1));});
  return s;
 },
 ...(()=>{
  // toolkit panel, rows revealed step by step
  const rows=[['①','「値 × 幅」を 小さい区間ごとに 足す'],['②','内積：進む向き・貫く向きの 成分だけ'],['③','Σ は有限個の和、∫ は限りなく細かくした極限'],['④','使う前に：対象・座標・向き・初期条件・適用範囲']];
  const panel=(vis,hi=-1,sub=0)=>{
   let s=label('上級の入口：4つの部品',600,50,{size:30,color:C.hi,anchor:'middle',weight:700});
   rows.forEach(([n,t],i)=>{const y=110+i*80;
    s+=fade(vis[i],(i===hi?highlight(90,y-6,1020,68,1):'')+rect(110,y+2,52,52,{fill:C.faint,fo:.5,stroke:C.dim,sw:2,rx:10})+label(n,136,y+40,{size:32,color:C.hi,anchor:'middle',weight:700})+label(t,190,y+40,{size:30,color:i===hi||hi<0?C.ink:C.dim}));});
   return s;
  };
  return {
   [K+'kit1']:(p)=>panel([seg(p,.3,.45),0,0,0]),
   [K+'kit2']:(p)=>panel([1,seg(p,.02,.15),seg(p,.45,.6),0]),
   [K+'kit3']:(p)=>panel([1,1,1,seg(p,.02,.15)]),
   [K+'kit4']:(p)=>{
    const g=seg(p,.05,.2);
    let s=panel([1,1,1,1],g>.5?2:-1);
    s+=card(250,430-4,700,80,label('h ≠ 0 のまま 計算 → 最後に h → 0',600,478,{size:30,color:CH,anchor:'middle',weight:700}),seg(p,.45,.6),CH);
    return s;
   },
  };
 })(),
 [K+'goal']:(p)=>{
  let s=top('今回の問い');
  s+=tex(`\\dfrac{d}{dt}\\,t^n=n\\,t^{n-1}`,600,190,{size:80,auto:false,color:C.ink});
  s+=fade(seg(p,.3,.45),label('なぜ？',930,200,{size:40,color:C.hi,weight:700}));
  s+=fade(seg(p,.55,.75),label('n ＝ 1, 2, 3, …, 100, … どの n でも？',600,380,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ================= S2 =================
 [K+'sq1']:(p)=>{
  let s=square({g:[seg(p,0,.15),seg(p,.4,.55),seg(p,.4,.55),seg(p,.7,.85)]});
  s+=label('中級：x ＝ t²',790,90,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.25,.4),tex(`(t+${h})^2-t^2`,790,190,{size:48,auto:true}));
  s+=fade(seg(p,.4,.55),tex(`=${col(C1,'2th')}+${col(C2,'h^2')}`,790,290,{size:52,auto:false}));
  s+=fade(seg(p,.5,.62),label('帯 2本',700,380,{size:28,color:C1,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.88),label('角',900,380,{size:28,color:C2,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sq2']:(p)=>{
  let s=square({});
  s+=tex(`\\dfrac{${col(C1,'2th')}+${col(C2,'h^2')}}{${h}}`,790,120,{size:48,auto:false});
  s+=fade(seg(p,.05,.25),tex(`=2t+${h}`,790,250,{size:52}));
  s+=fade(seg(p,.45,.6),label('h → 0',700,360,{size:30,color:CH,anchor:'middle',weight:700})+arrow(760,350,830,350,{color:C.dim,w:3,head:12}));
  s+=fade(seg(p,.55,.75),tex('2t',900,360,{size:60}));
  s+=fade(seg(p,.7,.85),highlight(860,310,90,80,1));
  return s;
 },
 [K+'cube0']:(p)=>{
  const g=seg(p,.35,.8);
  let s=cube({H:45*g,show:[1,g>0?.35:0,g>0?.35:0,g>0?.35:0]});
  const q=(x,y,z)=>P(330,250,x,y,z);
  const [ax,ay]=q(65,130,0),[bx,by]=q(130,65,0),[zx,zy]=q(130,0,65);
  s+=label('t',ax-26,ay+38,{size:30,color:C.t,weight:700,anchor:'middle'});
  s+=label('t',bx+26,by+38,{size:30,color:C.t,weight:700,anchor:'middle'});
  s+=label('t',zx+22,zy+10,{size:30,color:C.t,weight:700});
  s+=fade(seg(p,.25,.4),label('横・奥・縦に h だけ伸ばす',830,120,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('一辺 t → t ＋ h',830,200,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),tex(`(t+${h})^3`,830,300,{size:54}));
  return s;
 },
 [K+'cube1']:(p)=>{
  const gap=36*seg(p,.05,.35);
  let s=cube({gap,show:[1,1,1,1],dim:[.8,1,.15,.15]});
  const lp=pieceCentre([0,0,1],{gap});
  s+=fade(seg(p,.4,.55),label('t²h',lp[0],lp[1]+10,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.45),label('板（面に 張り付く）',830,120,{size:30,color:C1,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),tex(`${col(C1,'t^2h')}\\times3`,830,210,{size:52,auto:false}));
  s+=fade(seg(p,.6,.75),label('t × t の面に 厚さ h',830,290,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'cube2']:(p)=>{
  let s=cube({gap:36,show:[1,1,1,1],dim:[.8,.45,mix(.15,1,seg(p,.02,.15)),mix(.15,1,seg(p,.5,.62))]});
  s+=label('板',830,90,{size:26,color:C1,anchor:'middle'})+tex(`${col(C1,'t^2h')}\\times3`,830,140,{size:40,auto:false});
  s+=fade(seg(p,.05,.2),label('棒（辺に 沿う）',830,215,{size:28,color:C2,anchor:'middle',weight:700})+tex(`${col(C2,'th^2')}\\times3`,830,265,{size:44,auto:false}));
  s+=fade(seg(p,.5,.65),label('角',830,340,{size:28,color:C3,anchor:'middle',weight:700})+tex(`${col(C3,'h^3')}\\times1`,830,390,{size:44,auto:false}));
  return s;
 },
 [K+'cube3']:(p)=>{
  let s=cube({cx:200,cy:270,T:100,H:36,gap:26,show:[1,1,1,1]});
  s+=tex(`(t+${h})^3=${E3}`,760,110,{size:44,auto:true});
  const rows=[[C0,'t^3','元の立方体',.2],[C1,'3t^2h','板 3枚',.45],[C2,'3th^2','棒 3本',.6],[C3,'h^3','角 1個',.75]];
  rows.forEach(([c,t,j,a],i)=>{const y=200+i*68;s+=fade(seg(p,a,a+.12),tex(col(c,t),640,y+10,{size:40,auto:false})+label('…',720,y+12,{size:28,color:C.dim,anchor:'middle'})+label(j,760,y+12,{size:30,color:c,weight:700}));});
  return s;
 },
 [K+'cube4']:(p)=>{
  let s=tex(`(t+${h})^3=${E3}`,600,80,{size:40,auto:true});
  s+=fade(seg(p,.05,.3),tex(`(t+${h})^3-t^3=${col(C1,'3t^2h')}+${col(C2,'3th^2')}+${col(C3,'h^3')}`,560,175,{size:44,auto:true}));
  s+=fade(seg(p,.1,.3),label('t³ を 引く',1010,183,{size:26,color:C.dim}));
  s+=fade(seg(p,.45,.65),tex(`\\dfrac{(t+${h})^3-t^3}{${h}}=${Q3}`,560,350,{size:48,auto:true}));
  s+=fade(seg(p,.5,.65),label('h で 割る',1010,358,{size:26,color:C.dim}));
  s+=fade(seg(p,.8,.95),highlight(240,265,650,150,1));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=tex(`\\dfrac{(t+${h})^3-t^3}{${h}}=${Q3}`,600,120,{size:44,auto:true});
  s+=card(270,240,660,210,label('t ＝ 1、h ＝ 0.001',600,305,{size:34,color:C.ink,anchor:'middle',weight:700})
   +label('差商は いくつ？',600,375,{size:36,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('予想してみよう',600,425,{size:24,color:C.hi,anchor:'middle'})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'num1']:(p)=>{
  let s=top('t ＝ 1、h ＝ 0.001');
  s+=tex('1.001^3',600,160,{size:56,auto:false});
  s+=fade(seg(p,.35,.6),tex('=1.003003001',600,280,{size:56,auto:false}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=top('t ＝ 1、h ＝ 0.001');
  s+=tex('1.001^3=1.003003001',600,110,{size:42,auto:false});
  s+=fade(seg(p,.05,.3),tex('\\dfrac{1.003003001-1}{0.001}=3.003001',600,240,{size:54,auto:false}));
  s+=fade(seg(p,.6,.75),label('3t² ＝ 3 に 近い',600,380,{size:32,color:C1,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num3']:(p)=>{
  let s=tex(`${Q3}`,600,90,{size:48,auto:true});
  const parts=[col(C1,'3'),'+',col(C2,'0.003'),'+',col(C3,'0.000001'),'=3.003001'];
  s+=fade(seg(p,.05,.3),tex(parts.join(''),600,220,{size:52,auto:false}));
  const {c}=centres(parts,52,600);
  s+=fade(seg(p,.1,.3),label('3t²',c[0],300,{size:26,color:C1,anchor:'middle'})+label('3th',c[2],300,{size:26,color:C2,anchor:'middle'})+label('h²',c[4],300,{size:26,color:C3,anchor:'middle'}));
  const L=c[2]-texWidth(parts[2],52,false)/2-30,Rr=c[4]+texWidth(parts[4],52,false)/2;
  s+=fade(seg(p,.6,.75),brace(L,Rr,330,{color:C2,text:'3 からの ずれ ＝ 棒と角の分',size:28}));
  return s;
 },
 [K+'lim3']:(p)=>{
  let s=label('h を 縮める（t ＝ 1）',600,44,{size:26,color:C.dim,anchor:'middle'});
  const hx=[270,560,860];
  s+=label('h',hx[0],100,{size:30,color:CH,anchor:'middle',weight:700})+label('3 ＋ 3h ＋ h²',hx[1],100,{size:28,color:C.ink,anchor:'middle'})+label('差商',hx[2],100,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=line(150,122,1050,122,{color:C.faint,w:2});
  const rows=[['0.1','3 ＋ 0.3 ＋ 0.01','3.31'],['0.01','3 ＋ 0.03 ＋ 0.0001','3.0301'],['0.001','3 ＋ 0.003 ＋ 0.000001','3.003001'],['→ 0','3 ＋ 0 ＋ 0','→ 3']];
  rows.forEach((r,i)=>{const y=172+i*62,g=seg(p,.05+i*.12,.2+i*.12);s+=fade(g,label(r[0],hx[0],y,{size:30,color:CH,anchor:'middle'})+label(r[1],hx[1],y,{size:28,color:C.ink,anchor:'middle'})+label(r[2],hx[2],y,{size:32,color:i===3?C.hi:C.ink,anchor:'middle',weight:700}));});
  s+=card(380,408,440,100,tex(`\\dfrac{d}{dt}\\,t^3=3t^2`,600,468,{size:36}),seg(p,.7,.85),C.hi);
  return s;
 },

 // ================= S3 =================
 [K+'n0']:(p)=>{
  let s=tex(`(t+${h})^{n}`,600,110,{size:64});
  s+=fade(seg(p,.35,.5),label('n ＝ 10 なら？',600,200,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),cube({cx:420,cy:340,T:70,H:24,gap:12})+ng(560,380)+label('10次元の立方体は 描けない',590,380,{size:30,color:C.a}));
  return s;
 },
 [K+'n1']:(p)=>{
  let s=fade(seg(p,.05,.2),label('図の代わりに 数える',600,50,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),tex(`(t+${h})^3`,600,150,{size:56}));
  s+=fade(seg(p,.5,.7),tex('=',320,290,{size:52,auto:false})+brackets(640,290,[0,0,0],{gapx:190,size:48}));
  s+=fade(seg(p,.7,.85),['①','②','③'].map((c,i)=>label(c,450+i*190,370,{size:28,color:C.dim,anchor:'middle'})).join(''));
  return s;
 },
 [K+'n2']:(p)=>{
  let s=brackets(600,120,[0,0,0],{gapx:220,size:48});
  const g=seg(p,.15,.35),g2=seg(p,.4,.6);
  s+=fade(g,label('各かっこから t か h を 1つ',600,50,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(g2,brackets(600,120,['t','h','t'],{gapx:220,size:48,dimTop:0}));
  s+=fade(seg(p,.55,.7),tex(`t\\times${h}\\times t=t^2${h}`,600,300,{size:46}));
  s+=fade(seg(p,.75,.9),label('すべての 選び方を 足す ＝ 展開',600,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n3']:(p)=>{
  let s=label('h を 0個',160,120,{size:28,color:C0,weight:700});
  s+=fade(seg(p,.05,.3),brackets(620,110,['t','t','t'],{gapx:170,size:42,res:'t^3',resCol:C0}));
  s+=fade(seg(p,.5,.65),label('1通り',620,260,{size:30,color:C0,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n4']:(p)=>{
  let s=label('h を ちょうど 1個',600,40,{size:28,color:C1,anchor:'middle',weight:700});
  const P3=[['h','t','t'],['t','h','t'],['t','t','h']];
  P3.forEach((pk,i)=>{s+=fade(seg(p,.1+i*.15,.25+i*.15),brackets(560,105+i*122,pk,{gapx:170,size:40,res:`${col(C1,'t^2h')}`}));});
  s+=fade(seg(p,.7,.85),label('3通り',1110,230,{size:30,color:C1,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n5']:(p)=>{
  let s=tex(`${col(C1,'t^2h')}+${col(C1,'t^2h')}+${col(C1,'t^2h')}=${col(C1,'3t^2h')}`,600,110,{size:52,auto:false});
  s+=fade(seg(p,.1,.3),label('係数 3 ＝ h を1個 選ぶ 選び方の数',600,210,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),cube({cx:560,cy:390,T:70,H:24,gap:14,dim:[.5,1,.15,.15]})+label('＝ 板 3枚',720,400,{size:32,color:C1,weight:700}));
  return s;
 },
 [K+'n6']:(p)=>{
  let s=label('h を 2個以上',600,40,{size:28,color:C2,anchor:'middle',weight:700});
  const rows=[[['h','h','t'],['t','h','h'],['h','t','h']],[['h','h','h']]];
  const R=[['h','h','t'],['h','t','h'],['t','h','h'],['h','h','h']];
  R.forEach((pk,i)=>{const last=i===3;s+=fade(seg(p,.05+i*.12,.18+i*.12),brackets(500,120+i*92,pk,{gapx:160,size:40,letters:0,res:last?col(C3,'h^3'):col(C2,'th^2')}));});
  s+=fade(seg(p,.55,.7),label('3th² … 棒',1060,210,{size:28,color:C2,anchor:'middle',weight:700})+label('h³ … 角',1060,400,{size:28,color:C3,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gen1']:(p)=>{
  let s=label('n 個の かっこ',600,44,{size:28,color:C.dim,anchor:'middle'});
  const xs=[230,400,570,800,970],y=150;
  xs.forEach((x,i)=>{s+=i===3?label('…',x-115,y+10,{size:40,color:C.ink,anchor:'middle'}):'';s+=tex(`(t+${h})`,x,y,{size:44});});
  s+=brace(170,1030,190,{color:C.dim,text:'n 個',size:28});
  const k=Math.min(4,Math.floor(seg(p,.35,.95)*5));
  const W=texWidth(`(t+${h})`,44);
  if(p>.35){xs.forEach((xx,i)=>{const isH=i===k;s+=ring(xx-W/2+W*(isH?.745:.2),y-12,20,{color:isH?CH:C.t,w:isH?3:2});});}
  s+=fade(seg(p,.4,.55),label('h を取る かっこを 1つ 選ぶ',600,340,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('→ n 通り',600,410,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gen2']:(p)=>{
  let s=label('h を 1個、残り n − 1 個は t',600,50,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),tex(`\\underbrace{t\\times t\\times\\cdots\\times t}_{n-1}\\times ${h}=${col(C1,'t^{n-1}h')}`,600,170,{size:48,auto:true}));
  s+=fade(seg(p,.5,.7),tex(`${col(C1,'t^{n-1}h')}\\times n=${col(C1,'n\\,t^{n-1}h')}`,600,340,{size:52,auto:false}));
  s+=fade(seg(p,.55,.7),label('n 通り 分',900,420,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'gen3']:(p)=>{
  const src=`(t+${h})^n=t^n+${col(C1,'n\\,t^{n-1}h')}+`;
  const W=texWidth(src,50),bw=300,L=600-(W+bw+16)/2;
  let s=tex(src,L,170,{size:50,anchor:'start'});
  s+=fade(seg(p,.35,.55),rect(L+W+8,125,bw,72,{fill:C2,fo:.15,stroke:C2,sw:2,rx:12})+label('h² 以上を含む項',L+W+8+bw/2,171,{size:30,color:C2,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3),label('全部 t',L+texWidth(`(t+${h})^n=`,50)+texWidth('t^n',50)/2,260,{size:26,color:C0,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),label('h を1個',L+texWidth(`(t+${h})^n=t^n+`,50)+texWidth(`n\\,t^{n-1}h`,50)/2,260,{size:26,color:C1,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),label('h を2個以上',L+W+8+bw/2,260,{size:26,color:C2,anchor:'middle'}));
  return s;
 },
 [K+'div1']:(p)=>{
  let s=tex(`(t+${h})^n-t^n=${col(C1,'n\\,t^{n-1}h')}+\\cdots`,600,90,{size:44});
  s+=fade(seg(p,.02,.15),label('（… ＝ h² 以上を含む項）',600,150,{size:24,color:C2,anchor:'middle'}));
  const src=`\\dfrac{(t+${h})^n-t^n}{${h}}=${col(C1,'n\\,t^{n-1}')}+`;
  const W=texWidth(src,50),bw=330,L=600-(W+bw+16)/2;
  s+=fade(seg(p,.15,.4),tex(src,L,290,{size:50,anchor:'start'}));
  s+=fade(seg(p,.5,.7),rect(L+W+8,250,bw,72,{fill:C2,fo:.15,stroke:C2,sw:2,rx:12})+label('h を1個以上含む項',L+W+8+bw/2,296,{size:28,color:C2,anchor:'middle',weight:700}));
  return s;
 },
 [K+'div2']:(p)=>{
  let s=label('h² 以上の項を h で割ると',600,50,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),tex(`\\dfrac{${h}^2}{${h}}=${h}`,330,170,{size:52,auto:false})+tex(`\\dfrac{${h}^3}{${h}}=${h}^2`,600,170,{size:52,auto:false})+tex('\\cdots',840,170,{size:52,auto:false}));
  s+=fade(seg(p,.25,.4),label('h が 残る',600,270,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('項の数は 有限',400,370,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('h → 0 で 合計も → 0',800,370,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=label('n は 正の整数',600,50,{size:28,color:C.dim,anchor:'middle'});
  const src=`\\dfrac{d}{dt}\\,t^n=n\\,t^{n-1}`;
  s+=tex(src,600,190,{size:76});
  s+=fade(seg(p,.2,.35),highlight(600-texWidth(src,76)/2-24,92,texWidth(src,76)+48,180,1));
  s+=fade(seg(p,.45,.6),tex('n=2:\\ 2t',330,370,{size:44})+tex('n=3:\\ 3t^2',600,370,{size:44})+tex('n=1:\\ 1',870,370,{size:44}));
  s+=fade(seg(p,.5,.65),ok(318,445)+ok(588,445)+ok(858,445));
  return s;
 },
 [K+'rule2']:(p)=>{
  let s=tex('t^{\\,n}',420,180,{size:90});
  s+=fade(seg(p,.1,.35),arrow(455,120,560,160,{color:C.hi,w:4,head:14})+tex('n\\,t^{\\,n-1}',720,190,{size:80}));
  s+=fade(seg(p,.35,.5),label('前に出る n',700,290,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('＝ h を1個だけ含む項の 数',700,340,{size:30,color:C1,anchor:'middle',weight:700}));
  s+=fade(seg(p,.72,.85),ng(260,440)+label('暗記の規則',300,440,{size:28,color:C.a})+ok(620,440)+label('数えた結果',660,440,{size:28,color:C.F}));
  return s;
 },

 // ================= S4 =================
 [K+'lin1']:(p)=>{
  let s=label('係数 a が付くと',600,44,{size:28,color:C.dim,anchor:'middle'});
  s+=tex(`\\dfrac{a(t+${h})^n-a\\,t^n}{${h}}`,600,150,{size:50,auto:false});
  s+=fade(seg(p,.25,.45),tex(`=a\\times\\dfrac{(t+${h})^n-t^n}{${h}}`,600,290,{size:50,auto:false}));
  s+=fade(seg(p,.25,.45),label('a を くくり出す',1010,300,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.65,.85),tex('\\longrightarrow\\ a\\,n\\,t^{n-1}',600,420,{size:50,auto:false}));
  return s;
 },
 [K+'lin2']:(p)=>{
  let s=label('和 f ＋ g',600,44,{size:28,color:C.dim,anchor:'middle'});
  s+=tex(`\\dfrac{\\{f(t+${h})+g(t+${h})\\}-\\{f(t)+g(t)\\}}{${h}}`,600,150,{size:40,auto:false});
  s+=fade(seg(p,.2,.45),tex(`=\\dfrac{f(t+${h})-f(t)}{${h}}+\\dfrac{g(t+${h})-g(t)}{${h}}`,600,280,{size:40,auto:false}));
  const wr=texWidth("(f+g)'=f'+g'",52,false);s+=fade(seg(p,.6,.8),tex("(f+g)'=f'+g'",600,410,{size:52,auto:false})+highlight(600-wr/2-20,355,wr+40,80,seg(p,.75,.9)));
  return s;
 },
 [K+'five']:(p)=>{
  let s=label('初級の例',600,44,{size:26,color:C.dim,anchor:'middle'});
  s+=tex('x=5t^2',300,140,{size:52});
  s+=fade(seg(p,.05,.25),tex('v=5\\times2t=10t',720,140,{size:52}));
  s+=fade(seg(p,.35,.5),tex('t=1:\\ v=10',720,250,{size:48}));
  s+=card(170,320,860,150,label('初級の数表（平均の速さ）',600,360,{size:24,color:C.dim,anchor:'middle'})
   +label('15 → 10.5 → 10.05 → …',470,425,{size:34,color:C.v,anchor:'middle'})+label('→ 10',850,425,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7));
  s+=fade(seg(p,.75,.88),ok(960,435));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=tex('x=2t^3-4t',600,110,{size:60});
  s+=fade(seg(p,.1,.25),label('x ［m］、t ［s］',600,190,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(270,240,660,200,label('速度 v は？',600,305,{size:36,color:C.hi,anchor:'middle',weight:700})+label('t ＝ 2 での値は？',600,380,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  return s;
 },
 [K+'ans1']:(p)=>{
  let s=tex('x=2t^3-4t',600,70,{size:48});
  s+=fade(seg(p,.02,.25),tex('2t^3\\ \\to\\ 2\\times3t^2=6t^2',380,190,{size:44}));
  s+=fade(seg(p,.3,.5),tex('-4t\\ \\to\\ -4\\times1=-4',850,190,{size:44}));
  s+=fade(seg(p,.35,.5),label('（t¹ → 1 × t⁰ ＝ 1）',850,250,{size:22,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.65,.85),tex('v=6t^2-4',600,350,{size:62})+highlight(430,295,340,95,seg(p,.8,.95)));
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=tex('v=6t^2-4',600,90,{size:52});
  s+=fade(seg(p,.05,.3),tex('t=2:\\ v=6\\times4-4',600,220,{size:52}));
  s+=fade(seg(p,.45,.65),tex('=20\\ \\mathrm{m/s}',600,340,{size:60}));
  return s;
 },
 [K+'ans3']:(p)=>{
  let s=label('差商で 確かめる（t ＝ 2、h ＝ 0.001）',600,44,{size:26,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),tex('x(2)=16-8=8',330,130,{size:40})+tex('x(2.001)\\approx8.020012',850,130,{size:40}));
  s+=fade(seg(p,.35,.6),tex('\\dfrac{8.020012-8}{0.001}\\approx20.012',600,280,{size:52,auto:false}));
  s+=fade(seg(p,.7,.85),label('→ 20 に 近づく',600,410,{size:34,color:C.hi,anchor:'middle',weight:700})+ok(760,420));
  return s;
 },

 // ================= S5 =================
 [K+'sum1']:(p)=>{
  let s=label('まとめ',600,44,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=tex(`(t+${h})^n=t^n+${col(C1,'n\\,t^{n-1}h')}+\\cdots`,600,150,{size:52});
  const src=`(t+${h})^n=t^n+`,W=texWidth(src,52),WA=texWidth(`(t+${h})^n=t^n+${col(C1,'n\\,t^{n-1}h')}+\\cdots`,52),L=600-WA/2;
  s+=fade(seg(p,.2,.4),brace(L+W,L+W+texWidth(`n\\,t^{n-1}h`,52),195,{color:C1,text:'h を1個：係数 n',size:28}));
  const wq=texWidth(`\\dfrac{d}{dt}\\,t^n=n\\,t^{n-1}`,56);s+=fade(seg(p,.6,.8),tex(`\\dfrac{d}{dt}\\,t^n=n\\,t^{n-1}`,600,400,{size:56})+highlight(600-wq/2-20,318,wq+40,138,seg(p,.75,.9)));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=tex(`(t+${h})^n=t^n+${col(C1,'n\\,t^{n-1}h')}+\\cdots`,600,90,{size:44});
  s+=card(200,170,800,230,label('h を 2個以上 含む項',600,230,{size:32,color:C2,anchor:'middle',weight:700})
   +fade(seg(p,.2,.4),label('÷ h でも h が 残る',600,300,{size:32,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.5,.7),label('極限では 0',600,365,{size:34,color:C.hi,anchor:'middle',weight:700})),1,C2);
  return s;
 },
 [K+'next1']:(p)=>{
  let s=card(110,80,450,280,tex(`(t+${h})^n`,335,170,{size:54})+label('展開できる',335,250,{size:30,color:C.F,anchor:'middle',weight:700})+ok(335,320),seg(p,0,.2),C.F);
  s+=card(640,80,450,280,tex(`\\sin(t+${h})`,865,170,{size:54})+label('展開の公式が ない',865,250,{size:30,color:C.a,anchor:'middle',weight:700})+label('？',865,322,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.4,.6),C.a);
  return s;
 },
 [K+'next2']:(p)=>{
  const A=axes({x:120,y:300,w:560,h:220,xmin:0,xmax:6.6,ymin:-1.2,ymax:1.2,xlabel:'t',ylabel:'',xcolor:C.t});
  let s=A.svg+A.plot(Math.sin,{from:0,to:6.4,color:C.x,w:4});
  const t0=1,k=Math.cos(t0);
  s+=fade(seg(p,.1,.3),draw([[A.X(t0-.9),A.Y(Math.sin(t0)-.9*k)],[A.X(t0+.9),A.Y(Math.sin(t0)+.9*k)]],1,{color:C.hi,w:4,dash:'10 8'})+dot(A.X(t0),A.Y(Math.sin(t0)),9,C.hi));
  s+=label('sin t',A.X(2.2),A.Y(1.05),{size:28,color:C.x});
  s+=fade(seg(p,.3,.5),label('差をどう ほどく？',930,160,{size:32,color:C.ink,anchor:'middle',weight:700})+tex(`\\sin(t+${h})-\\sin t`,930,230,{size:40}));
  s+=fade(seg(p,.55,.75),label('傾き ＝ cos t ？',930,340,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
};
