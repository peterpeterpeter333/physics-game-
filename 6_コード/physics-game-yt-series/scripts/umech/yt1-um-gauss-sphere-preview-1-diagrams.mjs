// YouTube シリーズ「ガウスの法則・中級 1/2」(ys-um-gauss-sphere-preview-1) — 図。Stage 1200×515.
// 色：電場 𝐄 水色(C.x)、法線 𝐧 桃(C.p)、面積 ΔA・d𝐀 金(C.t)、電気束 Φ・強調 黄(C.hi)、誤り・負 赤(C.a)、正電荷 赤い丸（初級 21 と共通）。
// 球・いびつな面は正射影の 3D（少し上から見る）。手前の面だけ実線、奥は薄い点線。法線はいつも外向き。
// 2/2 からも使うので、補助関数は関数として export する（登録されるのは下の図オブジェクトだけ）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,poly} from './anim.mjs';
import {charge,boxScene,boxNormals,VAL3,blobPts,closedPath} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='um-gauss-sphere-preview-1:';
export const GC={E:C.x,n:C.p,A:C.t,hi:C.hi,bad:C.a,Q:C.p,dim:C.dim,ok:C.F};
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
export const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
// tex pieces
export const vE=cs(GC.E,'\\mathbf{E}'),vEi=cs(GC.E,'\\mathbf{E}_i'),Ei=cs(GC.E,'E_i'),EE=cs(GC.E,'E');
export const vn=cs(GC.n,'\\mathbf{n}'),vni=cs(GC.n,'\\mathbf{n}_i');
export const dAi=cs(GC.A,'\\Delta A_i'),vdA=cs(GC.A,'d\\mathbf{A}'),dA=cs(GC.A,'dA'),AA=cs(GC.A,'A');
export const PHI=cs(GC.hi,'\\Phi'),QQ=cs(GC.Q,'Q');
export const OI='\\displaystyle\\mathop{\\iint\\mkern-23.5mu\\bigcirc\\mkern2mu}\\nolimits_S';
export const FLUX=`${OI}${vE}\\cdot${vdA}`;
export const U=s=>`\\,\\mathrm{${s}}`,UF=U('N\\cdot m^2/C');
export const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:GC.ok,weight:700,anchor:'middle'}));

// ---- 3D projection -----------------------------------------------------------------------------
// orthographic view, spin about the vertical axis then tilt (look slightly from above)
export function view(cx,cy,R,{tilt=.36,spin=.5}={}){
 const ct=Math.cos(tilt),st=Math.sin(tilt),c2=Math.cos(spin),s2=Math.sin(spin);
 return ([x,y,z])=>{const x1=x*c2+z*s2,z1=-x*s2+z*c2,y2=y*ct-z1*st,z2=y*st+z1*ct;return [cx+R*x1,cy-R*y2,z2];};
}
const D2R=Math.PI/180;
export const sph=(f,l)=>[Math.cos(f*D2R)*Math.sin(l*D2R),Math.sin(f*D2R),Math.cos(f*D2R)*Math.cos(l*D2R)];
const add=(a,b,k=1)=>[a[0]+k*b[0],a[1]+k*b[1],a[2]+k*b[2]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const nrm=a=>{const l=Math.hypot(...a);return [a[0]/l,a[1]/l,a[2]/l];};
const crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dt=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
// surfaces: position on the surface for (lat,lon) in degrees
export const SPHERE=(f,l)=>sph(f,l);
export const POTATO=(f,l)=>{const r=1+.16*Math.sin(2*l*D2R+.7)*Math.cos(f*D2R)**2+.07*Math.sin(f*D2R)+.05*Math.cos(3*l*D2R)*Math.cos(f*D2R)**2;return sph(f,l).map(v=>v*r);};
export function surfNormal(F,f,l){const h=.5;const a=sub(F(f,l+h),F(f,l-h)),b=sub(F(f+h,l),F(f-h,l));let n=nrm(crs(a,b));if(dt(n,F(f,l))<0)n=n.map(v=>-v);return n;}
// draw the surface: back grid faint, front cells filled, front grid
export function surface(P,F,{g=1,step=30,fill='#9aabc7',fo=.07,gridColor='#b8c6de',gridW=2,back=1}={}){
 let s='';
 const vis=(f,l)=>{const p=F(f,l),n=surfNormal(F,f,l);return P(add(p,n,1))[2]-P(p)[2]>0;};
 const runs=(pts)=>{const out=[];let cur=null;for(const [f,l] of pts){const v=vis(f,l),q=P(F(f,l));if(!cur||cur.v!==v){if(cur)cur.pts.push(q);cur={v,pts:[q]};out.push(cur);}else cur.pts.push(q);}return out;};
 // front fill
 for(let f=-90;f<90;f+=15)for(let l=0;l<360;l+=15){const fc=f+7.5,lc=l+7.5;if(!vis(fc,lc))continue;
  const pts=[];for(let k=0;k<=3;k++)pts.push(P(F(f,l+5*k)));for(let k=0;k<=3;k++)pts.push(P(F(f+5*k,l+15)));for(let k=0;k<=3;k++)pts.push(P(F(f+15,l+15-5*k)));for(let k=0;k<=3;k++)pts.push(P(F(f+15-5*k,l)));
  s+=poly(pts.map(q=>[q[0],q[1]]),{fill,fo,stroke:'none'});}
 const lines=[];
 for(let f=-90+step;f<90;f+=step){const pts=[];for(let l=0;l<=360;l+=4)pts.push([f,l]);lines.push(pts);}
 for(let l=0;l<360;l+=step){const pts=[];for(let f=-90;f<=90;f+=4)pts.push([f,l]);lines.push(pts);}
 let bk='',fr='';
 for(const pts of lines)for(const r of runs(pts)){const q=r.pts.map(v=>[v[0],v[1]]);if(r.v)fr+=draw(q,1,{color:gridColor,w:gridW,opacity:.75});else if(back)bk+=draw(q,1,{color:C.faint,w:1.5,dash:'5 7'});}
 return fade(g,bk+s+fr);
}
export function sphereOutline(cx,cy,R,g=1){return fade(g,ring(cx,cy,R,{color:'#c9d6ee',w:3}));}
// one tile patch between lat f0..f1, lon l0..l1
export function patch(P,F,f0,f1,l0,l1,{color=GC.hi,fo=.35,sw=3,g=1}={}){
 const pts=[];const n=6;
 for(let k=0;k<=n;k++)pts.push(P(F(f0,l0+(l1-l0)*k/n)));for(let k=0;k<=n;k++)pts.push(P(F(f0+(f1-f0)*k/n,l1)));
 for(let k=0;k<=n;k++)pts.push(P(F(f1,l1-(l1-l0)*k/n)));for(let k=0;k<=n;k++)pts.push(P(F(f1-(f1-f0)*k/n,l0)));
 return fade(g,poly(pts.map(q=>[q[0],q[1]]),{fill:color,fo,stroke:color,sw}));
}
// arrow in 3D from surface point along a unit direction (length in model units)
export function arrow3(P,p,dir,len,{color=GC.E,w=5,head=16,g=1,text='',tsize=26,tdx=10,tdy=-8}={}){
 const a=P(p),b=P(add(p,dir,len));return arrow(a[0],a[1],b[0],b[1],{color,w,head,g,text,tsize,tdx,tdy});
}
export const isFront=(P,F,f,l)=>{const p=F(f,l),n=surfNormal(F,f,l);return P(add(p,n,1))[2]-P(p)[2]>0;};

// ---- 2D cross-section helpers ------------------------------------------------------------------
export function radial2(cx,cy,{R=[90,165],n=8,rot=22.5,g=1,len=null,kE=1}={}){
 let s='';for(const r of R)for(let i=0;i<n;i++){const a=(rot+360*i/n)*D2R,ux=Math.cos(a),uy=-Math.sin(a);const Lh=len??Math.min(70,kE*5200/(r*r)*6+14);
  s+=arrow(cx+r*ux,cy+r*uy,cx+(r+Lh)*ux,cy+(r+Lh)*uy,{color:GC.E,w:4,head:13});}
 return fade(g,s);
}

// ---- small pictures used more than once ---------------------------------------------------------
const SP={cx:330,cy:262,R:180};
function sphereScene({g=1,grid=1,q=1,cx=SP.cx,cy=SP.cy,R=SP.R,tilt=.36,spin=.5}={}){
 const P=view(cx,cy,R,{tilt,spin});
 return fade(g,surface(P,SPHERE,{g:grid})+sphereOutline(cx,cy,R)+(q?charge(cx,cy,1,20):''));
}
// tiles on the sphere where arrows are drawn (lat, lon) — all on the front for spin .5
const TILES=[[20,-75],[40,-30],[30,30],[-15,-60],[-20,40],[55,5],[-45,-20]];
function sphereArrows(P,{gE=1,gN=1,lenE=.5,lenN=.3,list=TILES,hl=-1}={}){
 let s='';list.forEach(([f,l],i)=>{const p=sph(f,l);
  s+=arrow3(P,p,p,lenE,{color:GC.E,w:i===hl?6:5,g:gE,head:15});
  s+=arrow3(P,p,p,lenN,{color:GC.n,w:i===hl?5:4,g:gN,head:13});
  s+=dot(...P(p).slice(0,2),4,C.ink);});
 return s;
}

export const ytUmGaussSphere1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const pts=[[110,400],[190,330],[290,300],[390,250],[470,170],[520,110]];
  let s=draw(pts,seg(p,.02,.3),{color:C.ink,w:4})+fade(seg(p,.2,.3),label('C',540,120,{size:30,color:C.ink,weight:700}));
  for(let i=0;i<pts.length-1;i++){const [x,y]=pts[i],[X,Y]=pts[i+1];s+=fade(seg(p,.25+.05*i,.35+.05*i),arrow(x,y,X,Y,{color:C.t,w:4,head:12})+arrow((x+X)/2,(y+Y)/2,(x+X)/2+40,(y+Y)/2-26+8*i,{color:C.F,w:4,head:12}));}
  s+=card(640,120,500,250,label('線積分',890,175,{size:28,color:C.dim,anchor:'middle'})+T(`W=\\displaystyle\\int_C ${cs(C.F,'\\mathbf{F}')}\\cdot${cs(C.t,'d\\mathbf{r}')}`,890,275,{size:56}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=sphereScene({g:seg(p,.3,.5),cx:260,cy:262,R:170});
  s+=card(520,90,640,320,L('前回の 最後の問い',840,145,{color:C.dim})+L('線に沿って 足した。',840,205,{size:30})+L('閉じた面の上で 𝐄 を足す 電気束は、',840,262,{size:30,color:GC.E})
   +L('点電荷を囲む 球なら',840,320,{size:30})+L('どう 簡単になる？',840,375,{size:32,color:GC.hi,weight:700}),seg(p,.02,.2),GC.hi);
  return s;
 },
 [K+'bag']:(p)=>{
  let s=boxScene({inside:1})+boxNormals(['left','right','top','bottom','front','back'],{vals:VAL3,g:seg(p,.3,.5)});
  s+=card(720,110,440,270,L('初級：面ごとに',940,165,{color:C.dim})+L('法線方向の成分 × 面積',940,230,{size:30,color:GC.hi,weight:700})+L('符号つきで 足す',940,295,{size:30})+L('（出る＋、入る−）',940,345,{size:24,color:C.dim}),seg(p,.05,.25));
  return s;
 },
 [K+'bag2']:(p)=>{
  let s=closedPath(blobPts(150),300,262,{w:4})+charge(300,262,1,22)+radial2(300,262,{R:[70],len:40,g:seg(p,.05,.2)});
  s+=card(620,110,540,270,L('合計 ∝ 中の正味の電荷',890,180,{size:32,color:GC.hi,weight:700})+fade(seg(p,.45,.6),L('でも 数え方は',890,255,{size:28,color:C.dim})+L('平らな面・言葉で 数えただけ',890,310,{size:30})),seg(p,.02,.2));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=sphereScene({g:seg(p,0,.2),cx:260,cy:262,R:170});
  s+=card(520,110,640,270,L('今回の問い',840,165,{color:C.dim})+L('中心に電荷を置いた 球面なら',840,230,{size:30})+L('電気束の和は なぜ',840,290,{size:32,color:GC.hi,weight:700})+L('掛け算 1回 になる？',840,345,{size:32,color:GC.hi,weight:700}),seg(p,.15,.35),GC.hi);
  return s;
 },

 // ===== S2 面をタイルに分ける =====
 [K+'flat']:(p)=>{
  // tilted flat tile in oblique view
  const o=[250,300],u=[190,-40],v=[60,-120];
  const q=[[o[0],o[1]],[o[0]+u[0],o[1]+u[1]],[o[0]+u[0]+v[0],o[1]+u[1]+v[1]],[o[0]+v[0],o[1]+v[1]]];
  const c=[o[0]+(u[0]+v[0])/2,o[1]+(u[1]+v[1])/2];
  let s=poly(q,{fill:'#9aabc7',fo:.18,stroke:'#c9d6ee',sw:3})+L('面積 A',c[0]+30,o[1]+80,{color:GC.A,size:26});
  for(let k=0;k<3;k++)for(let j=0;j<3;j++){const x=90+k*150,y=150+j*95;s+=fade(seg(p,.1,.3),arrow(x,y,x+110,y-30,{color:GC.E,w:4,head:13,opacity:.85}));}
  s+=arrow(c[0],c[1],c[0]-70,c[1]-150,{color:GC.n,w:6,head:18,g:seg(p,.45,.6)})+fade(seg(p,.5,.6),T(vn,c[0]-95,c[1]-165,{size:40}));
  s+=fade(seg(p,.1,.3),T(`${vE}\\ \\text{一様}`,100,90,{size:32,anchor:'start'}));
  s+=card(680,130,470,240,T(`${PHI}=(${vE}\\cdot${vn})\\,${AA}`,915,210,{size:50})+fade(seg(p,.5,.65),L('𝐧：面に垂直・長さ 1',915,300,{size:26,color:GC.n})),seg(p,.25,.4),GC.hi);
  return s;
 },
 [K+'curved']:(p)=>{
  const P=view(330,262,170,{tilt:.36,spin:.5});const qc=[-.4,-.3,.1];
  let s=surface(P,POTATO)+charge(...P(qc).slice(0,2),18);
  const list=[[20,-70],[30,0],[-15,-40],[-10,40],[45,-25]];
  list.forEach(([f,l],i)=>{const pt=POTATO(f,l),n=surfNormal(POTATO,f,l),e=nrm(sub(pt,qc));const g=seg(p,.1+.08*i,.25+.08*i);
   s+=arrow3(P,pt,e,.45,{color:GC.E,w:5,g})+arrow3(P,pt,n,.32,{color:GC.n,w:4,head:13,g})+fade(g,dot(...P(pt).slice(0,2),4,C.ink));});
  s+=card(640,120,510,260,L('曲がった面',895,175,{color:C.dim})+L('𝐧 の向きが 場所ごとに違う',895,235,{size:28,color:GC.n})+L('𝐄 も 場所ごとに違う',895,290,{size:28,color:GC.E})+L('→ 掛け算 1回では 済まない',895,350,{size:28,color:GC.hi,weight:700}),seg(p,.55,.72));
  return s;
 },
 [K+'tiles']:(p)=>{
  const P=view(330,262,170,{tilt:.36,spin:.5});
  let s=surface(P,POTATO,{step:30,g:1});
  s+=fade(seg(p,.3,.6),surface(P,POTATO,{step:15,fo:0,gridColor:GC.A,gridW:1.5,back:0}));
  s+=card(660,150,470,190,L('線積分：曲線を 短い区間に',895,210,{size:26,color:C.dim})+L('面積分：面を 小さなタイルに',895,275,{size:30,color:GC.A,weight:700}),seg(p,.1,.3));
  return s;
 },
 [K+'tile']:(p)=>{
  const P=view(330,262,170,{tilt:.36,spin:.5});const qc=[-.45,.45,.1];const f=-5,l=25,pt=POTATO(f+10,l+10),n=surfNormal(POTATO,f+10,l+10),e=nrm(sub(pt,qc));
  let s=surface(P,POTATO,{step:15,gridColor:'#8797b3',gridW:1.5})+charge(...P(qc).slice(0,2),18);
  s+=patch(P,POTATO,f,f+20,l,l+20,{color:GC.A,fo:.45,g:seg(p,.05,.2)});
  s+=arrow3(P,pt,n,.55,{color:GC.n,w:5,g:seg(p,.3,.45)})+arrow3(P,pt,e,.7,{color:GC.E,w:5,g:seg(p,.55,.7)});
  const [x,y]=P(pt),[nx,ny]=P(add(pt,n,.55)),[ex,ey]=P(add(pt,e,.7));
  s+=fade(seg(p,.1,.25),T(dAi,x-10,y+75,{size:34}))+fade(seg(p,.35,.45),T(vni,nx-30,ny-20,{size:36}))+fade(seg(p,.6,.7),T(vEi,ex+32,ey+6,{size:36}));
  s+=card(680,110,460,280,L('タイル i',910,165,{color:C.dim})+T(`\\text{面積 }${dAi}`,910,225,{size:34})+T(`\\text{外向きの法線 }${vni}`,910,285,{size:34})+T(`\\text{そこの電場 }${vEi}`,910,345,{size:34}),seg(p,.05,.2));
  return s;
 },
 [K+'contrib']:(p)=>{
  // zoomed flat tile with n_i and E_i at angle
  const cx=300,cy=330;
  let s=poly([[cx-150,cy+30],[cx+120,cy+30],[cx+170,cy-40],[cx-100,cy-40]],{fill:GC.A,fo:.3,stroke:GC.A,sw:3});
  s+=arrow(cx,cy-5,cx,cy-225,{color:GC.n,w:6,head:18})+T(vni,cx-40,cy-215,{size:38});
  s+=arrow(cx,cy-5,cx+150,cy-195,{color:GC.E,w:6,head:18})+T(vEi,cx+180,cy-195,{size:38});
  s+=fade(seg(p,.05,.2),L('小さい → 平ら・電場も一定とみなす',cx+10,cy+85,{size:24,color:C.dim}));
  s+=card(640,150,510,170,T(`\\Delta ${PHI}_i\\approx ${vEi}\\cdot${vni}\\,${dAi}`,895,235,{size:48}),seg(p,.35,.5),GC.hi);
  return s;
 },
 [K+'shadow']:(p)=>{
  const cx=300,cy=330,th=Math.atan2(150,190);const Lh=Math.hypot(150,190)*Math.cos(th);
  let s=poly([[cx-150,cy+30],[cx+120,cy+30],[cx+170,cy-40],[cx-100,cy-40]],{fill:GC.A,fo:.3,stroke:GC.A,sw:3});
  s+=arrow(cx,cy-5,cx,cy-225,{color:GC.n,w:5,head:18})+T(vni,cx-40,cy-215,{size:38});
  s+=arrow(cx,cy-5,cx+150,cy-195,{color:GC.E,w:6,head:18})+T(vEi,cx+180,cy-195,{size:38});
  const g=seg(p,.1,.35);s+=fade(g,line(cx+150,cy-195,cx,cy-195,{color:C.dim,w:2,dash:'6 6'}))+fade(g,line(cx,cy-5,cx,cy-5-190*g,{color:GC.hi,w:10,opacity:.8}));
  s+=fade(seg(p,.3,.45),label('影',cx-60,cy-100,{size:28,color:GC.hi,weight:700}));
  // angle arc
  const arc=[];for(let k=0;k<=20;k++){const a=Math.PI/2-(Math.PI/2-Math.atan2(190,150))*k/20;arc.push([cx+60*Math.cos(a),cy-5-60*Math.sin(a)]);}
  s+=fade(seg(p,.55,.7),draw(arc,1,{color:C.ink,w:3})+T(cs(C.ink,'\\theta_i'),cx+40,cy-85,{size:32}));
  s+=card(640,140,510,200,T(`${vEi}\\cdot${vni}=${Ei}\\cos\\theta_i`,895,215,{size:46})+fade(seg(p,.55,.7),L('θᵢ：電場と法線の間の角',895,290,{size:26,color:C.dim})),seg(p,.3,.45),GC.hi);
  return s;
 },
 [K+'sum']:(p)=>{
  const P=view(250,262,160,{tilt:.36,spin:.5});
  let s=surface(P,POTATO,{step:15,gridColor:'#8797b3',gridW:1.5});
  const cells=[];for(let f=-75;f<75;f+=15)for(let l=-90;l<60;l+=15)if(isFront(P,POTATO,f+7.5,l+7.5))cells.push([f,l]);
  const kk=Math.floor(cells.length*seg(p,.02,.35));for(let i=0;i<kk;i++){const [f,l]=cells[i];s+=patch(P,POTATO,f,f+15,l,l+15,{color:GC.A,fo:.18,sw:1});}
  s+=T(`${PHI}\\approx\\sum_i ${vEi}\\cdot${vni}\\,${dAi}`,810,130,{size:46,opacity:1});
  s+=fade(seg(p,.4,.5),L('タイルを 限りなく 細かく ↓',810,215,{size:26,color:C.dim}));
  s+=card(560,250,500,140,T(`${PHI}=${FLUX}`,810,320,{size:52}),seg(p,.5,.65),GC.hi);
  s+=fade(seg(p,.7,.85),L('有限の和は ≈、行き先で ＝',810,440,{size:26,color:C.dim}));
  return s;
 },
 [K+'dA']:(p)=>{
  const cx=300,cy=330;
  let s=poly([[cx-150,cy+30],[cx+120,cy+30],[cx+170,cy-40],[cx-100,cy-40]],{fill:GC.A,fo:.3,stroke:GC.A,sw:3})+L('面積 dA',cx+10,cy+75,{color:GC.A});
  s+=arrow(cx,cy-5,cx,cy-120,{color:GC.n,w:5,head:16,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),T(vn,cx-38,cy-110,{size:36}));
  s+=arrow(cx+40,cy-5,cx+40,cy-220,{color:GC.A,w:7,head:20,g:seg(p,.3,.5)})+fade(seg(p,.4,.5),T(vdA,cx+85,cy-205,{size:38}));
  s+=card(640,110,510,290,T(`${vdA}=${vn}\\,${dA}`,895,185,{size:52})+fade(seg(p,.35,.5),L('大きさ ＝ タイルの面積',895,265,{size:28,color:GC.A})+L('向き ＝ 外向きの法線',895,315,{size:28,color:GC.n}))+fade(seg(p,.7,.85),L('面積ベクトル',895,370,{size:30,color:GC.hi,weight:700})),seg(p,.15,.3),GC.hi);
  return s;
 },
 [K+'compare']:(p)=>{
  let s=card(80,90,480,300,L('線積分',320,145,{color:C.dim})+T(`\\displaystyle\\int_C ${cs(C.F,'\\mathbf{F}')}\\cdot${cs(C.t,'d\\mathbf{r}')}`,320,235,{size:52})+L('C：足す曲線',320,315,{size:26})+L('d𝐫：小さな一歩',320,360,{size:26,color:C.t}),seg(p,0,.15));
  s+=card(640,90,480,300,L('閉じた面の 面積分',880,145,{color:C.dim})+T(FLUX,880,235,{size:52})+L('S：足す閉じた面',880,315,{size:26})+L('d𝐀：小さなタイル',880,360,{size:26,color:GC.A}),seg(p,.1,.25),GC.hi);
  s+=fade(seg(p,.2,.35),L('→',600,245,{size:44,color:C.dim}));
  s+=fade(seg(p,.55,.7),L('∯ の丸 ＝ 閉じた面を 残らず足す',600,455,{size:28,color:GC.hi,weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=T(`${FLUX}`,600,130,{size:52});
  s+=fade(seg(p,.15,.35),T(`\\mathrm{N/C}\\ \\times\\ ${cs(GC.A,'\\mathrm{m^2}')}\\ =\\ \\mathrm{N\\cdot m^2/C}`,600,290,{size:52}));
  s+=fade(seg(p,.15,.35),L('電場',470,390,{size:26,color:GC.E})+L('面積',640,390,{size:26,color:GC.A}));
  return s;
 },

 // ===== S3 球面を選ぶ =====
 [K+'radial']:(p)=>{
  let s=charge(330,262,1,24)+radial2(330,262,{R:[70,140,210],n:12,rot:0,g:seg(p,.05,.3),len:null,kE:1.4});
  s+=card(680,120,470,250,L('正の点電荷 Q',915,180,{size:28,color:C.a})+L('電場：半径方向・外向き',915,245,{size:28,color:GC.E})+fade(seg(p,.5,.65),L('強さは 距離だけで 決まる',915,315,{size:28,color:GC.hi,weight:700})),seg(p,.1,.3));
  return s;
 },
 [K+'choose']:(p)=>{
  const P=view(SP.cx,SP.cy,SP.R);
  let s=surface(P,SPHERE,{g:seg(p,.25,.5)})+sphereOutline(SP.cx,SP.cy,SP.R,seg(p,.2,.4))+charge(SP.cx,SP.cy,1,20);
  s+=fade(seg(p,.45,.6),line(SP.cx,SP.cy,SP.cx+SP.R,SP.cy,{color:C.ink,w:3,dash:'8 6'})+label('r',SP.cx+SP.R/2,SP.cy-12,{size:30,color:C.ink,weight:700,anchor:'middle'}));
  s+=card(680,150,460,190,L('閉じた面：どんな形でも よい',910,210,{size:26,color:C.dim})+L('電荷が中心の 半径 r の球面',910,280,{size:30,color:GC.hi,weight:700}),seg(p,.1,.3));
  return s;
 },
 [K+'imagined']:(p)=>{
  const P=view(SP.cx,SP.cy,SP.R);
  let s=surface(P,SPHERE)+sphereOutline(SP.cx,SP.cy,SP.R)+charge(SP.cx,SP.cy,1,20);
  s+=fade(seg(p,.1,.3),radial2(SP.cx,SP.cy,{R:[110,205],n:8,rot:22.5,len:40}));
  s+=card(680,150,460,190,L('頭の中の面',910,215,{size:30,color:C.ink,weight:700})+L('→ 電場は そのまま',910,280,{size:28,color:GC.E}),seg(p,.2,.4));
  return s;
 },
 [K+'normal']:(p)=>{
  const P=view(SP.cx,SP.cy,SP.R);
  let s=surface(P,SPHERE)+sphereOutline(SP.cx,SP.cy,SP.R)+charge(SP.cx,SP.cy,1,20);
  s+=sphereArrows(P,{gE:0,gN:seg(p,.1,.4),lenN:.32});
  s+=card(700,150,440,190,L('外向きの法線 𝐧',920,215,{size:30,color:GC.n,weight:700})+L('中心から外へ ＝ 半径方向',920,280,{size:28}),seg(p,.3,.5));
  return s;
 },
 [K+'predict']:(p)=>{
  const P=view(260,262,170);
  let s=surface(P,SPHERE)+sphereOutline(260,262,170)+charge(260,262,1,20);
  s+=card(540,120,620,260,T(`\\sum_i ${Ei}\\cos\\theta_i\\,${dAi}`,850,215,{size:50})+fade(seg(p,.2,.4),L('どこまで 簡単になる？',850,320,{size:32,color:GC.hi,weight:700})),seg(p,.02,.2));
  return s;
 },

 // ===== S4 2つのチェック =====
 [K+'check1']:(p)=>{
  const P=view(SP.cx,SP.cy,SP.R);
  let s=surface(P,SPHERE)+sphereOutline(SP.cx,SP.cy,SP.R)+charge(SP.cx,SP.cy,1,20);
  s+=sphereArrows(P,{gE:seg(p,.1,.35),gN:seg(p,.3,.5)});
  s+=card(700,110,440,280,L('チェック 1：向き',920,165,{size:30,color:GC.hi,weight:700})+T(`${vEi}\\ \\text{も}\\ ${vni}\\ \\text{も 半径方向}`,920,240,{size:32})+fade(seg(p,.55,.7),T(`${vEi}\\parallel${vni}`,920,320,{size:46})+ok(1060,330)),seg(p,.05,.2),GC.hi);
  return s;
 },
 [K+'cos1']:(p)=>{
  // zoomed: parallel arrows on a tile
  const cx=250,cy=360;
  let s=poly([[cx-140,cy+25],[cx+110,cy+25],[cx+150,cy-35],[cx-100,cy-35]],{fill:GC.A,fo:.3,stroke:GC.A,sw:3});
  s+=arrow(cx+6,cy-5,cx+6,cy-270,{color:GC.E,w:7,head:20})+T(vEi,cx+60,cy-255,{size:38});
  s+=arrow(cx-6,cy-5,cx-6,cy-150,{color:GC.n,w:6,head:18})+T(vni,cx-50,cy-150,{size:38});
  s+=fade(seg(p,.2,.35),line(cx+6,cy-5,cx+6,cy-270,{color:GC.hi,w:12,opacity:.35})+label('影 ＝ 矢印そのもの',cx+60,cy-120,{size:26,color:GC.hi,weight:700}));
  s+=card(600,130,560,230,T(`\\theta_i=0\\ \\Rightarrow\\ \\cos\\theta_i=1`,880,200,{size:44})+fade(seg(p,.45,.6),T(`${vEi}\\cdot${vni}=${Ei}`,880,295,{size:50})),seg(p,.05,.2),GC.hi);
  return s;
 },
 [K+'check2']:(p)=>{
  const cx=300,cy=262,R=190;
  let s=ring(cx,cy,R,{color:'#c9d6ee',w:3,fill:'rgba(154,171,199,.06)'})+charge(cx,cy,1,20);
  const angs=[20,80,150,215,290];
  angs.forEach((a,i)=>{const g=seg(p,.15+.1*i,.3+.1*i),x=cx+R*Math.cos(a*D2R),y=cy-R*Math.sin(a*D2R);
   s+=fade(g,line(cx,cy,x,y,{color:C.ink,w:3,dash:'8 6'})+dot(x,y,6,C.ink)+label('r',cx+R*.55*Math.cos(a*D2R)+12,cy-R*.55*Math.sin(a*D2R)-8,{size:28,color:C.ink,weight:700}));});
  s+=fade(seg(p,.02,.15),label('断面',cx-R,cy-R+10,{size:24,color:C.dim}));
  s+=card(680,130,460,230,L('チェック 2：大きさ',910,190,{size:30,color:GC.hi,weight:700})+L('球面上の点は どれも',910,255,{size:28})+L('中心から 同じ距離 r',910,310,{size:28,weight:700}),seg(p,.05,.2),GC.hi);
  return s;
 },
 [K+'sameE']:(p)=>{
  const cx=300,cy=262,R=170;
  let s=ring(cx,cy,R,{color:'#c9d6ee',w:3,fill:'rgba(154,171,199,.06)'})+charge(cx,cy,1,20);
  for(let i=0;i<8;i++){const a=(22.5+45*i)*D2R,x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);s+=arrow(x,y,x+60*Math.cos(a),y-60*Math.sin(a),{color:GC.E,w:5,head:15,g:seg(p,.05,.3)});}
  s+=fade(seg(p,.3,.45),label('どれも 同じ長さ',910,420,{size:26,color:GC.E,anchor:'middle',weight:700}));
  s+=card(680,130,460,230,L('強さは 距離だけで 決まる',910,190,{size:28})+fade(seg(p,.4,.55),T(`${Ei}=${EE}\\ \\ (\\text{どのタイルも})`,910,280,{size:40})+ok(1100,340)),seg(p,.02,.2),GC.hi);
  return s;
 },
 [K+'caution']:(p)=>{
  const cx=300,cy=262,R=170;
  let s=ring(cx,cy,R,{color:'#c9d6ee',w:3,fill:'rgba(154,171,199,.06)'})+charge(cx,cy,1,20);
  for(let i=0;i<8;i++){const a=(22.5+45*i)*D2R,x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);s+=arrow(x,y,x+60*Math.cos(a),y-60*Math.sin(a),{color:GC.E,w:5,head:15})+arrow(x,y,x+36*Math.cos(a),y-36*Math.sin(a),{color:GC.n,w:4,head:12,g:seg(p,.4,.6)});}
  s+=card(680,110,470,290,L('同じなのは 大きさ',915,165,{size:28,color:GC.E,weight:700})+L('向きは タイルごとに 違う',915,220,{size:28})+fade(seg(p,.45,.6),L('でも 法線との内積は',915,290,{size:26,color:C.dim})+T(`${vEi}\\cdot${vni}=${EE}`,915,355,{size:44})),seg(p,.02,.2),GC.hi);
  return s;
 },

 // ===== S5 掛け算1回になる =====
 [K+'step1']:(p)=>{
  const h=seg(p,.45,.6);
  let s=T(`${PHI}=\\sum_i ${Ei}\\,${cs(GC.hi,'\\cos\\theta_i')}\\,${dAi}`,600,110,{size:50});
  s+=fade(h,L('チェック 1：cosθᵢ ＝ 1',600,225,{size:28,color:GC.hi,weight:700}));
  s+=fade(seg(p,.6,.75),T(`=\\sum_i ${Ei}\\,${cs(GC.hi,'1')}\\,${dAi}=\\sum_i ${Ei}\\,${dAi}`,600,330,{size:50}));
  return s;
 },
 [K+'step2']:(p)=>{
  let s=T(`${PHI}=\\sum_i ${cs(GC.hi,'E_i')}\\,${dAi}`,600,110,{size:50});
  s+=fade(seg(p,.1,.25),L('チェック 2：Eᵢ ＝ E',600,225,{size:28,color:GC.hi,weight:700}));
  s+=fade(seg(p,.3,.45),T(`=\\sum_i ${cs(GC.hi,'E')}\\,${dAi}`,600,330,{size:50}));
  s+=fade(seg(p,.55,.7),L('どの項も 同じ E を 掛けている',600,440,{size:26,color:C.dim}));
  return s;
 },
 [K+'factor']:(p)=>{
  let s=T(`${PHI}=\\sum_i ${EE}\\,${dAi}`,600,90,{size:48});
  s+=card(250,150,700,110,T(`E\\times a+E\\times b=E\\times(a+b)`,600,205,{size:40,color:C.dim}),seg(p,.15,.3));
  s+=fade(seg(p,.5,.65),T(`=${EE}\\sum_i ${dAi}`,600,360,{size:56}));
  s+=fade(seg(p,.55,.7),L('E を Σ の外へ',870,370,{size:28,color:GC.hi,weight:700,anchor:'start'}));
  return s;
 },
 [K+'area']:(p)=>{
  const P=view(260,262,170);
  let s=surface(P,SPHERE,{step:15,gridColor:'#8797b3',gridW:1.5})+sphereOutline(260,262,170);
  const cells=[];for(let f=-90;f<90;f+=15)for(let l=0;l<360;l+=15)if(isFront(P,SPHERE,f+7.5,l+7.5))cells.push([f,l]);
  const kk=Math.floor(cells.length*seg(p,.05,.4));for(let i=0;i<kk;i++){const [f,l]=cells[i];s+=patch(P,SPHERE,f,f+15,l,l+15,{color:GC.A,fo:.2,sw:1});}
  s+=T(`\\sum_i ${dAi}`,760,140,{size:52});
  s+=fade(seg(p,.4,.55),T(`=\\text{球の表面積}=${cs(GC.A,'4\\pi r^2')}`,860,260,{size:44}));
  s+=fade(seg(p,.7,.85),L('（公式は ここでは 使うだけ）',860,360,{size:26,color:C.dim}));
  return s;
 },
 [K+'exact']:(p)=>{
  let s=card(150,70,900,170,L('球では タイルの中でも',600,125,{size:28,color:C.dim})+L('cos ＝ 1、E も 同じ',600,190,{size:32,color:GC.hi,weight:700}),seg(p,0,.15));
  s+=fade(seg(p,.3,.45),T(`\\Delta${PHI}_i=${EE}\\,${dAi}\\quad(\\text{ちょうど})`,600,310,{size:46}));
  s+=fade(seg(p,.6,.75),L('≈ が ＝ に なる',600,420,{size:32,color:GC.hi,weight:700}));
  return s;
 },
 [K+'result']:(p)=>{
  let s=card(170,90,860,190,T(`${FLUX}=${EE}\\times${cs(GC.A,'4\\pi r^2')}`,600,190,{size:62}),seg(p,0,.2),GC.hi);
  s+=fade(seg(p,.5,.65),L('電場の強さ',470,350,{size:28,color:GC.E})+L('×',600,350,{size:30,color:C.dim})+L('表面積',720,350,{size:28,color:GC.A}));
  s+=fade(seg(p,.65,.8),L('掛け算 1回',600,430,{size:34,color:GC.hi,weight:700}));
  return s;
 },
 [K+'ex']:(p)=>{
  const P=view(300,262,180);
  let s=surface(P,SPHERE)+sphereOutline(300,262,180)+charge(300,262,1,20);
  s+=sphereArrows(P,{gE:seg(p,.3,.5),gN:seg(p,.3,.5),list:[[30,30],[-15,45],[-45,-20],[55,5]]});
  s+=fade(seg(p,.1,.25),line(300,262,120,262,{color:C.ink,w:3,dash:'8 6'})+label('r ＝ 2 m',210,300,{size:28,color:C.ink,weight:700,anchor:'middle'}));
  s+=card(680,140,460,210,L('球面上で',910,195,{size:26,color:C.dim})+L('E ＝ 3 N/C',910,255,{size:34,color:GC.E,weight:700})+L('外向きの法線と 平行',910,315,{size:28,color:GC.n}),seg(p,.3,.5));
  return s;
 },
 [K+'excalc']:(p)=>{
  let s=T(`${FLUX}=${EE}\\times${cs(GC.A,'4\\pi r^2')}`,600,90,{size:46});
  s+=fade(seg(p,.1,.3),T(`=${cs(GC.E,'3')}\\times${cs(GC.A,'4\\pi\\times 2^2')}`,600,210,{size:50}));
  s+=fade(seg(p,.35,.5),T(`=48\\pi`,600,320,{size:54}));
  s+=card(330,370,540,100,T(`\\approx 151${UF}`,600,425,{size:50,color:GC.hi}),seg(p,.55,.7),GC.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  const cx=300,cy=262,R=170;
  let s=ring(cx,cy,R,{color:'#c9d6ee',w:3,fill:'rgba(154,171,199,.06)'})+charge(cx,cy,1,20);
  for(let i=0;i<8;i++){const a=(22.5+45*i)*D2R,x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);s+=arrow(x,y,x+60*Math.cos(a),y-60*Math.sin(a),{color:GC.E,w:5,head:15})+arrow(x,y,x-45*Math.cos(a),y+45*Math.sin(a),{color:GC.n,w:4,head:13,g:seg(p,.2,.4)});}
  s+=card(680,140,460,210,L('法線を 内向きに 立てたら？',910,215,{size:28,color:GC.n,weight:700})+fade(seg(p,.4,.55),L('値は どうなる？',910,290,{size:32,color:GC.hi,weight:700})),seg(p,.1,.3),GC.hi);
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=T(`\\theta=180^\\circ\\ \\Rightarrow\\ \\cos\\theta=-1`,600,90,{size:44});
  s+=fade(seg(p,.2,.35),T(`${FLUX}=-48\\pi`,600,200,{size:52,color:GC.bad}));
  s+=card(250,280,700,170,L('閉じた面では',600,335,{size:28,color:C.dim})+L('法線は いつも 外向き',600,400,{size:34,color:GC.n,weight:700}),seg(p,.55,.7),GC.hi);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(80,80,1040,170,T(`\\Delta${PHI}_i\\approx${vEi}\\cdot${vni}\\,${dAi}\\quad\\longrightarrow\\quad ${PHI}=${FLUX}`,600,165,{size:46}),seg(p,0,.15));
  s+=fade(seg(p,.4,.55),L('タイルごとの寄与を 足した行き先',600,300,{size:28,color:C.dim}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,60,500,190,L('チェック 1',330,110,{size:26,color:C.dim})+L('cos ＝ 1',330,185,{size:34,color:GC.hi,weight:700})+ok(470,190),seg(p,0,.15));
  s+=card(620,60,500,190,L('チェック 2',870,110,{size:26,color:C.dim})+L('どこでも 同じ E',870,185,{size:34,color:GC.hi,weight:700})+ok(1060,190),seg(p,.1,.25));
  s+=card(230,290,740,150,T(`${FLUX}=${EE}\\times${cs(GC.A,'4\\pi r^2')}`,600,365,{size:50}),seg(p,.45,.6),GC.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s=T(`${FLUX}=${EE}\\times${cs(GC.A,'4\\pi r^2')}`,600,110,{size:46,opacity:.8});
  s+=card(250,200,700,170,L('これで ガウスの法則を',600,265,{size:30})+L('証明した ことになる？',600,330,{size:34,color:GC.hi,weight:700}),seg(p,.1,.3),GC.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=T(`${FLUX}\\ =\\ \\ ?`,600,110,{size:52});
  s+=fade(seg(p,.15,.3),label('右辺',770,190,{size:28,color:GC.hi,weight:700,anchor:'middle'}));
  s+=card(250,240,700,150,L('中の電荷 Q と',600,300,{size:30,color:GC.Q})+L('どう つながる？',600,360,{size:34,color:GC.hi,weight:700}),seg(p,.25,.45),GC.hi);
  return s;
 },
};
