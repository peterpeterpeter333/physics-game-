// YouTube シリーズ「ガウスの法則・上級 1/6」(ys-ue-gauss-1) — 図。Stage 1200×515.
// 色：電場 𝐄 水色、法線 𝐧 桃（中級と同じ）、面積 dA 金、電気束 Φ・強調 黄、角 θ・φ 橙、正電荷 赤い丸、球の中心 C 白、誤り 赤。
// 断面図：球の中心 C を (cx,cy)、電荷 O をその真下 d（画面では下）に置く。θ は C から真上（z 軸）を 0 として測る。
//   画面上の点 P(θ) = (cx ± Rp sinθ, cy − Rp cosθ)。𝐄 は O→P の向き、長さ ∝ 1/r²（O からの距離 r）。𝐧 は C→P の向き。
// 3D：view()（中級 1/2 の正射影）で、モデル座標の y を物理の z（縦）にとる。電荷はモデル (0, −d/R, 0)。
// 2/6・3/6 からも使うので、補助関数は export する（登録されるのは下の図オブジェクトだけ）。
// 数値：R＝2、d＝1：北極 r＝3、𝐄·𝐧＝kQ/9、南極 r＝1、𝐄·𝐧＝kQ。d＝0：∫sinθ/R² dθ＝2/R² → 4πkQ。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,texWidth,poly} from './anim.mjs';
import {charge,blobPts,closedPath,normalAt} from './yt1-ui-closed-bag-1-diagrams.mjs';
import {cs,card,T,L,OI,view,surface,sphereOutline,SPHERE,patch} from './yt1-um-gauss-sphere-preview-1-diagrams.mjs';

const K='ue-gauss-1:';
export const G1={E:C.x,n:C.p,A:C.t,hi:C.hi,ang:C.E,bad:C.a,ok:C.F,geo:'#c9d6ee',dim:C.dim};
export {cs,card,T,L,OI};
// tex pieces
export const vE=cs(G1.E,'\\mathbf{E}'),vn=cs(G1.n,'\\mathbf{n}'),vr='\\mathbf{r}',vdA=cs(G1.A,'d\\mathbf{A}'),dA=cs(G1.A,'dA');
export const PHI=cs(G1.hi,'\\Phi'),th=cs(G1.ang,'\\theta'),ph=cs(G1.ang,'\\varphi');
export const EN=`${vE}\\cdot${vn}`,RN=`${vr}\\cdot${vn}`;
export const FLUX=`${OI}${vE}\\cdot${vdA}`;
export const DEN='(R^2+d^2+2Rd\\cos\\theta)';
export const INTG=`\\int_0^{\\pi}\\frac{(R+d\\cos\\theta)\\sin\\theta}{${DEN}^{3/2}}\\,d\\theta`;
// fitted tex, optionally boxed
export function TF(s,x,y,{size=44,maxW=1100,g=1,box=false,col=G1.hi,frac=false,opacity=1}={}){
 const w0=texWidth(s,size,false),sz=w0>maxW?size*maxW/w0:size,w=w0*sz/size;
 let o=T(s,x,y,{size:sz,opacity});
 if(box){const top=frac?1.95:1.5,h=frac?3.0:2.45;o+=highlight(x-w/2-20,y-sz*top,w+40,sz*h,1,col);}
 return fade(g,o);
}
// "= Q内/ε₀" with the Japanese subscript drawn as a label (never inside tex)
export function qin(lhs,x,y,{size=46,box=false,g=1,col=G1.hi,dx=0,dy=0}={}){
 const fr='\\frac{Q\\;\\;\\;}{\\varepsilon_0}',src=`${lhs}=${fr}`;
 const w=texWidth(src,size,false),wf=texWidth(fr,size,false),fx=x+w/2-wf/2;
 let o=T(src,x,y,{size})+label('内',fx+size*.2+dx,y-size*.6+dy,{size:size*.5,color:C.ink});
 if(box)o+=highlight(x-w/2-20,y-size*1.95,w+40,size*3.0,1,col);
 return fade(g,o);
}
export const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:G1.ok,weight:700,anchor:'middle'}));
export const bad=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:G1.bad,weight:700,anchor:'middle'}));
export const strike=(x1,y1,x2,y2,g=1)=>fade(g,line(x1,y1,x2,y2,{color:G1.bad,w:4}));

// ---- cross-section (2D) ----------------------------------------------------------------------
// dr = d/R (charge below the centre by dr*Rp). ths = list of θ (rad); negative θ = left half.
export const ptAt=(cx,cy,Rp,t)=>[cx+Rp*Math.sin(t),cy-Rp*Math.cos(t)];
export function xsec(cx,cy,Rp,{dr=.5,ths=[],gE=1,gN=1,kE=30,maxL=130,lenN=56,axis=true,lab=true,labC=true,labO=true,g=1,qr=16,ring0=true,dotP=true,hl=null}={}){
 const ox=cx,oy=cy+dr*Rp;
 let s='';
 if(axis)s+=line(cx,cy+Rp+46,cx,cy-Rp-30,{color:C.faint,w:2,dash:'7 7'})+arrow(cx,cy-Rp-20,cx,cy-Rp-52,{color:C.dim,w:2.5,head:12})+label('z',cx+12,cy-Rp-40,{size:26,color:C.dim});
 if(ring0)s+=ring(cx,cy,Rp,{color:G1.geo,w:3,fill:'rgba(154,171,199,.06)'});
 for(const t of ths){const [x,y]=ptAt(cx,cy,Rp,t);const dx=x-ox,dy=y-oy,d=Math.hypot(dx,dy),r=d/Rp,Lh=Math.min(maxL,kE/(r*r));
  const w=hl!==null&&Math.abs(t-hl)<1e-6?6:5;
  s+=arrow(x,y,x+Lh*dx/d,y+Lh*dy/d,{color:G1.E,w,head:14,g:gE});
  s+=arrow(x,y,x+lenN*Math.sin(t),y-lenN*Math.cos(t),{color:G1.n,w:w-1,head:12,g:gN});
  if(dotP)s+=dot(x,y,4,C.ink);}
 if(labC&&dr>0)s+=dot(cx,cy,6,C.ink)+(lab?label('C',cx-12,cy+8,{size:24,color:C.ink,weight:700,anchor:'end'}):'');
 s+=charge(ox,oy,1,qr)+(lab&&labO?label(dr>0?'O':'O ＝ C',ox-qr-8,oy+8,{size:24,color:C.ink,weight:700,anchor:'end'}):'');
 return fade(g,s);
}
// E arrow and normal at one θ, with the angle between them marked
export function eAt(cx,cy,Rp,dr,t,{kE=30,maxL=130,lenN=56,g=1}={}){
 const ox=cx,oy=cy+dr*Rp,[x,y]=ptAt(cx,cy,Rp,t),dx=x-ox,dy=y-oy,d=Math.hypot(dx,dy),r=d/Rp,Lh=Math.min(maxL,kE/(r*r));
 return fade(g,arrow(x,y,x+Lh*dx/d,y+Lh*dy/d,{color:G1.E,w:6,head:15})+arrow(x,y,x+lenN*Math.sin(t),y-lenN*Math.cos(t),{color:G1.n,w:5,head:13})+dot(x,y,5,C.ink));
}
// θ arc at C (from the upward axis to the point)
export function thArc(cx,cy,r,t,{g=1,side=1,text=true}={}){
 const pts=[];for(let i=0;i<=30;i++){const a=t*i/30;pts.push([cx+side*r*Math.sin(a),cy-r*Math.cos(a)]);}
 const m=t/2;return fade(g,draw(pts,1,{color:G1.ang,w:3})+(text?label('θ',cx+side*(r+20)*Math.sin(m),cy-(r+20)*Math.cos(m)+8,{size:26,color:G1.ang,weight:700,anchor:'middle'}):''));
}
export function seg2(x1,y1,x2,y2,{color=C.ink,w=3,text='',tx=0,ty=0,size=24,dash=''}={}){return line(x1,y1,x2,y2,{color,w,dash})+(text?label(text,(x1+x2)/2+tx,(y1+y2)/2+ty,{size,color,anchor:'middle',weight:700}):'');}

// ---- 3D sphere with the charge below the centre ----------------------------------------------------
export function sph3({cx=330,cy=262,R=180,dr=.5,tilt=.32,spin=.55,grid=1,g=1}={}){
 const P=view(cx,cy,R,{tilt,spin});
 let s=surface(P,SPHERE,{g:grid})+sphereOutline(cx,cy,R);
 const a=P([0,1.35,0]),b=P([0,-1.25,0]);
 s+=line(b[0],b[1],a[0],a[1],{color:C.dim,w:2,dash:'7 7'})+label('z',a[0]+12,a[1]+4,{size:26,color:C.dim});
 const c=P([0,0,0]),o=P([0,-dr,0]);
 s+=dot(c[0],c[1],6,C.ink)+label('C',c[0]-12,c[1]-8,{size:24,color:C.ink,weight:700,anchor:'end'});
 s+=charge(o[0],o[1],1,14)+label('O',o[0]-22,o[1]+8,{size:24,color:C.ink,weight:700,anchor:'end'});
 return {P,svg:fade(g,s)};
}
const m3=(t,f)=>[Math.sin(t)*Math.cos(f),Math.cos(t),Math.sin(t)*Math.sin(f)];
export function angles3(P,t,f,{g=1,gT=1,gF=1,rT=.42,rF=.75}={}){
 let s='';const c=P([0,0,0]),p=P(m3(t,f));
 s+=line(c[0],c[1],p[0],p[1],{color:G1.geo,w:3});
 // foot on the equator plane
 const ft=P([Math.sin(t)*Math.cos(f),0,Math.sin(t)*Math.sin(f)]);
 s+=fade(gF,line(c[0],c[1],ft[0],ft[1],{color:C.dim,w:2,dash:'6 6'})+line(ft[0],ft[1],p[0],p[1],{color:C.dim,w:2,dash:'6 6'}));
 const x0=P([1.15,0,0]);s+=fade(gF,line(c[0],c[1],x0[0],x0[1],{color:C.dim,w:2})+label('x',x0[0]+8,x0[1]+20,{size:24,color:C.dim}));
 // θ arc in the meridian plane
 const at=[];for(let i=0;i<=24;i++){const a=t*i/24;at.push(P(m3(a,f).map(v=>v*rT)).slice(0,2));}
 const mt=P(m3(t/2,f).map(v=>v*(rT+.14)));
 s+=fade(gT,draw(at,1,{color:G1.ang,w:3.5})+label('θ',mt[0],mt[1]+8,{size:28,color:G1.ang,weight:700,anchor:'middle'}));
 // φ arc on the equator
 const af=[];for(let i=0;i<=24;i++){const a=f*i/24;af.push(P([rF*Math.cos(a),0,rF*Math.sin(a)]).slice(0,2));}
 const mf=P([(rF+.16)*Math.cos(f/2),0,(rF+.16)*Math.sin(f/2)]);
 s+=fade(gF,draw(af,1,{color:G1.ang,w:3.5})+label('φ',mf[0],mf[1]+10,{size:28,color:G1.ang,weight:700,anchor:'middle'}));
 s+=dot(p[0],p[1],7,C.hi)+label('P',p[0]+12,p[1]-10,{size:26,color:C.hi,weight:700});
 return fade(g,s);
}

// ---- reused cards ---------------------------------------------------------------------------------
const XC=330,YC=262,RP=170; // standard cross-section placement
export const STD={cx:XC,cy:YC,Rp:RP};
const TH8=[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,-Math.PI/4,-Math.PI/2,-3*Math.PI/4];
export const TH8E=TH8;
const rightX=860;
function claimFormula(x,y,size=46,g=1){return qin(`${OI}${vE}\\cdot${vn}\\,${dA}`,x,y,{size,g,box:true});}
function roadmap(cur,{g=1,y=150}={}){
 const items=[['1','式を 立てる'],['2','置換積分'],['3','d が 消える'],['4','立体角'],['5','重ね合わせ'],['6','板・殻・導体']];
 let s='';items.forEach(([n,t],i)=>{const x=115+i*185,on=i+1===cur,done=i+1<cur;
  s+=rect(x-85,y,170,110,{fill:on?G1.hi:'#131f38',fo:on?.18:.96,stroke:on?G1.hi:C.faint,sw:on?3:2,rx:12})
   +label(`${n}本目`,x,y+38,{size:24,color:on?G1.hi:C.dim,anchor:'middle',weight:700})+label(t,x,y+82,{size:22,color:on?C.ink:C.dim,anchor:'middle'});});
 return fade(g,s);
}

export const ytUeGauss1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5,ths:TH8,gN:0,gE:seg(p,.05,.4)});
  s+=card(640,90,500,330,L('前回の 最後の 問い',890,140,{size:24,color:C.dim})+L('中心から ずれた 球でも',890,210,{size:30,weight:700})+claimFormula(890,300,44)+L('面を 取り替えずに 確かめられる？',890,390,{size:26,color:G1.hi,weight:700}),seg(p,0,.12),G1.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5,ths:TH8,gN:0});
  s+=fade(1-seg(p,.05,.3)*.0,card(640,90,500,330,L('前回の 最後の 問い',890,140,{size:24,color:C.dim})+L('中心から ずれた 球でも',890,210,{size:30,weight:700})+claimFormula(890,300,44)+L('面を 取り替えずに 確かめられる？',890,390,{size:26,color:G1.hi,weight:700}),1,G1.hi));
  s+=fade(seg(p,.3,.45),L('中級：中心の 球だけ',XC-200,480,{size:24,color:C.dim}));
  return s;
 },
 [K+'recap']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:0,ths:TH8,kE:52,lenN:48});
  s+=L('中級：電荷が 中心',XC-170,40,{size:26,color:C.dim});
  s+=card(620,70,540,380,
   label('チェック1：𝐄 と 𝐧 が 平行',660,135,{size:27})+ok(1110,137,seg(p,.1,.2))
   +label('チェック2：どこでも 同じ E',660,200,{size:27})+ok(1110,202,seg(p,.25,.35))
   +TF(`${FLUX}=${cs(G1.E,'E')}\\times 4\\pi r^2`,890,330,{size:46,g:seg(p,.5,.65),box:true}),1);
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:0,ths:TH8,kE:52,lenN:48});
  s+=L('中級：電荷が 中心',XC-170,40,{size:26,color:C.dim});
  s+=card(620,50,540,430,
   TF(`${FLUX}=${cs(G1.E,'E')}\\times 4\\pi r^2`,890,100,{size:34})
   +TF(`=\\frac{kQ}{\\cancel{r^2}}\\times 4\\pi \\cancel{r^2}=4\\pi kQ`,890,212,{size:36,g:seg(p,.05,.2),frac:true})
   +TF(`\\varepsilon_0=\\frac{1}{4\\pi k}`,800,295,{size:34,g:seg(p,.45,.55),frac:true})+fade(seg(p,.45,.55),label('（定義）',960,303,{size:26,color:C.dim}))
   +TF(`${PHI}=\\frac{Q}{\\varepsilon_0}`,890,420,{size:38,g:seg(p,.65,.8),box:true,frac:true}),1);
  return s;
 },
 [K+'shifted']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5,ths:TH8,gE:seg(p,0,.2),gN:seg(p,.1,.3)});
  s+=L('電荷を ずらすと',XC-170,40,{size:26,color:C.dim});
  s+=card(620,70,540,380,
   label('チェック1：𝐄 と 𝐧 が 平行',660,135,{size:27})+bad(1110,137,seg(p,.1,.2))
   +label('チェック2：どこでも 同じ E',660,200,{size:27})+bad(1110,202,seg(p,.2,.3))
   +fade(seg(p,.35,.5),L('E を 積分の 外へ 出せない',890,290,{size:28,color:G1.bad,weight:700}))
   +fade(seg(p,.6,.75),L('→ 上級で 積分する',890,380,{size:30,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'tools']:(p)=>{
  const {P,svg}=sph3({dr:.5});
  let s=svg;
  s+=patch(P,SPHERE,40,55,-70,-45,{color:G1.A,fo:.45,g:seg(p,.1,.3)});
  s+=card(600,70,560,360,L('線積分と面積分・上級 4/4',880,125,{size:24,color:C.dim})
   +label('経線方向の 辺',650,190,{size:26})+T('R\\,d\\theta',1050,190,{size:36})
   +label('緯線方向の 辺',650,250,{size:26})+T('R\\sin\\theta\\,d\\varphi',1050,250,{size:36})
   +TF(`${dA}=R^2\\sin\\theta\\,d\\theta\\,d\\varphi`,880,360,{size:44,g:seg(p,.3,.45),box:true}),1);
  return s;
 },
 [K+'plan6']:(p)=>{
  let s=L('ガウスの法則・上級：6本',600,70,{size:30,weight:700});
  s+=roadmap(1,{y:130});
  s+=fade(seg(p,.15,.3),line(32,275,568,275,{color:G1.hi,w:4})+L('ずれた 球を 最後まで 積分',300,320,{size:26,color:G1.hi,weight:700}));
  s+=fade(seg(p,.5,.65),line(572,275,928,275,{color:C.x,w:4})+L('どんな 面・何個の 電荷へ',750,320,{size:26,color:C.x,weight:700}));
  s+=fade(seg(p,.7,.85),L('今回：積分の 式を 立てる',600,440,{size:30,color:C.ink,weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5,ths:TH8,gN:0});
  const [x,y]=ptAt(XC,YC,RP,Math.PI);
  s+=fade(seg(p,.1,.25),L('近い：強い',x+110,y+20,{size:26,color:G1.E,weight:700}));
  const [x2,y2]=ptAt(XC,YC,RP,0);
  s+=fade(seg(p,.1,.25),L('遠い：弱い',x2+120,y2-4,{size:26,color:G1.E,weight:700}));
  s+=card(640,90,500,330,L('電気束の 合計は？',890,150,{size:28,weight:700})
   +TF(`${PHI}\\;>\\;Q/\\varepsilon_0\\;?`,890,230,{size:38,frac:true})
   +TF(`${PHI}\\;=\\;Q/\\varepsilon_0\\;?`,890,310,{size:38,frac:true})
   +TF(`${PHI}\\;<\\;Q/\\varepsilon_0\\;?`,890,390,{size:38,frac:true}),seg(p,.35,.5),G1.hi);
  return s;
 },
 // ===== S2 示すことと、使う前提 =====
 [K+'claim']:(p)=>{
  const pts=blobPts(150);let s=closedPath(pts,300,262,{color:G1.geo,w:3});
  s+=charge(270,280,1,18)+charge(345,215,1,14);
  for(const i of [0,15,30,45,60,75,90,105]){const [x,y]=pts[i],[nx,ny]=normalAt(pts,i);s+=arrow(300+x,262-y,300+x+50*nx,262-y-50*ny,{color:G1.n,w:4,head:12,g:seg(p,.1,.3)});}
  s+=fade(seg(p,.1,.3),label('外向き',470,120,{size:24,color:G1.n}));
  s+=card(600,80,560,350,
   L('閉じた 面で',880,135,{size:28})
   +L('電場の 外向きの 成分を',880,195,{size:28,g:1})
   +L('面全体で 積分すると',880,255,{size:28})
   +fade(seg(p,.4,.55),L('＝ 中の 電荷の 合計 ÷ ε₀',880,345,{size:32,color:G1.hi,weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'claim2']:(p)=>{
  let s=TF(`${vdA}=${vn}\\,${dA}`,600,80,{size:40});
  s+=qin(`${OI}${vE}\\cdot${vdA}`,600,215,{size:56,box:true,g:seg(p,.05,.2)});
  s+=fade(seg(p,.45,.6),card(160,320,880,150,L('電気束 ＝ 𝐄·𝐧 を 面全体で 足した 集計',600,380,{size:30,weight:700})+L('（何かが 流れ出る 量 ではない）',600,435,{size:26,color:C.dim})));
  return s;
 },
 [K+'notcond']:(p)=>{
  let s=xsec(250,250,150,{dr:.5,ths:[],axis:false,lab:false});
  s+=L('中心で なくてよい',250,470,{size:26,color:G1.hi,weight:700})+ok(250,60,seg(p,.1,.2));
  const pts=blobPts(140);s+=fade(seg(p,.3,.45),closedPath(pts,850,250,{color:G1.geo,w:3})+charge(800,280,1,16)+L('球で なくてよい',850,470,{size:26,color:G1.hi,weight:700})+ok(850,60));
  return s;
 },
 [K+'coulomb']:(p)=>{
  const ox=200,oy=330,px=480,py=170;
  let s=charge(ox,oy,1,22)+label('Q',ox-34,oy+8,{size:28,color:C.p,weight:700,anchor:'end'});
  s+=arrow(ox,oy,px,py,{color:C.ink,w:4,head:16,g:seg(p,.05,.25)})+fade(seg(p,.15,.3),label('𝐫',(ox+px)/2-26,(oy+py)/2-12,{size:30,color:C.ink,weight:700}));
  const ux=(px-ox),uy=(py-oy),Lr=Math.hypot(ux,uy);
  s+=arrow(px,py,px+110*ux/Lr,py+110*uy/Lr,{color:G1.E,w:6,head:16,g:seg(p,.3,.45)})+fade(seg(p,.35,.5),label('𝐄',px+110*ux/Lr+10,py+110*uy/Lr-6,{size:30,color:G1.E,weight:700}));
  s+=card(660,70,500,380,TF(`${vE}=kQ\\frac{${vr}}{r^3}`,910,175,{size:46,frac:true,box:true})
   +fade(seg(p,.45,.6),TF(`\\frac{${vr}}{r}`,760,290,{size:40,frac:true})+label('＝ 長さ1の 向き',830,300,{size:26,color:C.dim}))
   +fade(seg(p,.7,.85),label('強さ',730,400,{size:28})+TF(`|${vE}|=\\frac{kQ}{r^2}`,930,395,{size:40,frac:true})),1);
  return s;
 },
 [K+'coulomb2']:(p)=>{
  let s=card(80,70,1040,170,L('出発点①：クーロンの法則（実験に 支えられた 法則）',600,130,{size:28,color:G1.hi,weight:700})+TF(`${vE}=kQ\\frac{${vr}}{r^3}`,600,205,{size:40,frac:true}),1,G1.hi);
  s+=fade(seg(p,.35,.5),card(80,270,1040,200,TF(`k=\\frac{1}{4\\pi\\varepsilon_0}`,360,370,{size:44,frac:true})+label('⇔',600,380,{size:34,color:C.dim,anchor:'middle'})+TF(`\\varepsilon_0=\\frac{1}{4\\pi k}`,840,370,{size:44,frac:true})+L('中級の 定義を k について 解いた形',600,450,{size:24,color:C.dim})));
  return s;
 },
 [K+'nocircle']:(p)=>{
  let s=card(80,70,500,380,L('使う',330,125,{size:30,color:G1.ok,weight:700})+L('① クーロンの法則',330,215,{size:28})+L('② 重ね合わせ（5本目）',330,285,{size:28})+L('＋ 数学（積分・内積）',330,355,{size:26,color:C.dim}),1,G1.ok);
  s+=fade(seg(p,.05,.2),card(620,70,500,380,L('根拠に 使わない',870,125,{size:30,color:G1.bad,weight:700})+L('ガウスの法則',870,230,{size:30})+L('（いま 示したい もの）',870,290,{size:26,color:C.dim})+strike(720,250,1020,212,seg(p,.25,.4)),1,G1.bad));
  return s;
 },
 [K+'route']:(p)=>{
  const box=(x,n,t1,t2,g)=>{const [a,b]=t1.split('|');return fade(g,rect(x-170,110,340,270,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+L(n,x,165,{size:30,color:G1.hi,weight:700})+L(a,x,235,{size:28})+L(b,x,280,{size:28})+L(t2,x,345,{size:24,color:C.dim}));};
  let s=box(210,'①','ずれた 球を|そのまま 積分','1〜3本目',seg(p,.05,.2));
  s+=fade(seg(p,.3,.4),arrow(385,235,425,235,{color:C.dim,w:3,head:12}));
  s+=box(600,'②','立体角で|どんな 形の 面へ','4本目',seg(p,.35,.5));
  s+=fade(seg(p,.6,.7),arrow(775,235,815,235,{color:C.dim,w:3,head:12}));
  s+=box(990,'③','重ね合わせで|何個の 電荷へ','5本目',seg(p,.65,.8));
  s+=fade(seg(p,.85,.95),L('対称な 面を 選ぶ 計算は、証明の 後',600,440,{size:26,color:C.dim}));
  return s;
 },
 // ===== S3 2つの中心を分ける =====
 [K+'setup']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5});
  s+=fade(seg(p,.2,.35),seg2(XC-14,YC,XC-14,YC+RP*.5,{color:C.ink,w:3,text:'d',tx:-20,ty:8,size:28}));
  const [x,y]=ptAt(XC,YC,RP,Math.PI*.3);s+=fade(seg(p,.35,.5),seg2(XC,YC,x,y,{color:G1.geo,w:3,text:'R',tx:10,ty:-6,size:28}));
  s+=L('断面図（球は 途中で 動かさない）',XC,500,{size:22,color:C.dim});
  s+=card(620,80,540,350,label('電荷 Q：原点 O',660,150,{size:30})+fade(seg(p,.25,.4),label('球の 中心 C：(0, 0, d)',660,240,{size:30}))+fade(seg(p,.4,.55),label('球の 半径：R',660,330,{size:30})),1);
  return s;
 },
 [K+'inside']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5});
  s+=seg2(XC-14,YC,XC-14,YC+RP*.5,{color:C.ink,w:3,text:'d',tx:-20,ty:8,size:28});
  s+=card(620,50,540,200,TF('0<d<R',890,125,{size:44})+L('電荷は 球の 内側',890,205,{size:28,color:G1.hi,weight:700}),1,G1.hi);
  // inset: d = R
  s+=fade(seg(p,.4,.55),card(620,280,540,200,ring(720,380,70,{color:G1.geo,w:3})+charge(720,450,1,12)+label('d ＝ R',830,350,{size:28,weight:700})+label('電荷が 面の上 → 距離 0',830,405,{size:26})+label('除く',830,455,{size:26,color:G1.bad,weight:700})+bad(1110,350),1,G1.bad));
  return s;
 },
 [K+'section']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5});
  s+=card(620,80,540,350,L('3次元の 球を',890,150,{size:28})+L('z 軸を 含む 平面で 切った 断面',890,215,{size:28,weight:700})
   +fade(seg(p,.45,.6),L('計算の 途中で、球は',890,310,{size:28})+L('動かさない',890,370,{size:32,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'angles']:(p)=>{
  const {P,svg}=sph3({dr:.5});
  let s=svg+angles3(P,.85,.9,{gT:seg(p,.3,.45),gF:seg(p,.6,.75)});
  s+=card(620,80,540,330,L('角度は 中心 C から 測る',890,140,{size:28,weight:700})
   +fade(seg(p,.3,.45),label('θ：真上の z 軸から の 角',660,230,{size:28,color:G1.ang}))
   +fade(seg(p,.6,.75),label('φ：z 軸の 周りの 角',660,310,{size:28,color:G1.ang})),1);
  return s;
 },
 [K+'pos']:(p)=>{
  const {P,svg}=sph3({dr:.5});
  let s=svg+angles3(P,.85,.9);
  s+=card(620,60,540,400,L('C が 中心の 球なら',890,115,{size:26,color:C.dim})
   +TF('R(\\sin\\theta\\cos\\varphi,\\ \\sin\\theta\\sin\\varphi,\\ \\cos\\theta)',890,185,{size:34,maxW:500})
   +fade(seg(p,.45,.6),L('C は d だけ 上',890,262,{size:26,color:C.dim})+TF('+\\,(0,\\ 0,\\ d)',890,350,{size:38,box:true,col:G1.hi}))
   +fade(seg(p,.6,.7),L('z 成分に d を 足す',890,435,{size:26,color:G1.hi})),1);
  return s;
 },
 [K+'pos2']:(p)=>{
  const {P,svg}=sph3({dr:.5});
  let s=svg+angles3(P,.85,.9);
  const o=P([0,-.5,0]),q=P(m3(.85,.9));
  s+=arrow(o[0],o[1],q[0],q[1],{color:C.ink,w:4,head:15,g:seg(p,.05,.25)})+fade(seg(p,.15,.3),label('𝐫',(o[0]+q[0])/2+16,(o[1]+q[1])/2+20,{size:30,weight:700}));
  s+=card(620,90,540,330,L('電荷 O から 見た 位置',890,150,{size:28,weight:700})
   +TF(`${vr}=(R\\sin\\theta\\cos\\varphi,\\ R\\sin\\theta\\sin\\varphi,\\ ${cs(G1.hi,'d+R\\cos\\theta')})`,890,260,{size:34,maxW:500,box:true})
   +L('z 成分だけ d が 増える',890,370,{size:24,color:G1.hi}),1);
  return s;
 },
 [K+'normal']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5,ths:TH8,gE:0,gN:seg(p,.05,.3)});
  s+=card(620,80,540,350,L('外向きの 法線 𝐧',890,140,{size:30,color:G1.n,weight:700})
   +L('C から 表面へ、長さ 1',890,205,{size:26,color:C.dim})
   +TF(`${vn}=(\\sin\\theta\\cos\\varphi,\\ \\sin\\theta\\sin\\varphi,\\ \\cos\\theta)`,890,320,{size:34,maxW:500,box:true,col:G1.n,g:seg(p,.4,.55)}),1);
  return s;
 },
 [K+'notpar']:(p)=>{
  const t=Math.PI*.35;
  let s=xsec(XC,YC,RP,{dr:.5,ths:TH8,gE:seg(p,0,.2)});
  // guide lines from O and from C to one point
  const [x,y]=ptAt(XC,YC,RP,t);
  s+=fade(seg(p,.2,.35),line(XC,YC+RP*.5,x,y,{color:G1.E,w:2,dash:'6 6'})+line(XC,YC,x,y,{color:G1.n,w:2,dash:'6 6'}));
  s+=eAt(XC,YC,RP,.5,t,{lenN:70,kE:70});
  s+=card(640,90,520,330,label('𝐄：電荷 O から',680,170,{size:30,color:G1.E,weight:700})+label('𝐧：中心 C から',680,250,{size:30,color:G1.n,weight:700})
   +fade(seg(p,.45,.6),L('一般に 平行ではない',900,360,{size:30,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'r2a']:(p)=>{
  let s=TF(`${vr}=(R\\sin\\theta\\cos\\varphi,\\ R\\sin\\theta\\sin\\varphi,\\ d+R\\cos\\theta)`,600,60,{size:34,opacity:.85});
  s+=TF('x^2+y^2=R^2\\sin^2\\theta\\,(\\cos^2\\varphi+\\sin^2\\varphi)',600,190,{size:42,g:seg(p,.05,.2)});
  s+=fade(seg(p,.4,.55),TF('\\cos^2\\varphi+\\sin^2\\varphi=1',600,290,{size:34,col:C.dim})+line(600-3,268,600+3,268,{color:'none'}));
  s+=TF('x^2+y^2=R^2\\sin^2\\theta',600,410,{size:46,g:seg(p,.6,.75),box:true});
  return s;
 },
 [K+'r2b']:(p)=>{
  let s=TF('x^2+y^2=R^2\\sin^2\\theta',600,55,{size:34,opacity:.85});
  s+=TF('z^2=(d+R\\cos\\theta)^2=d^2+2Rd\\cos\\theta+R^2\\cos^2\\theta',600,150,{size:38,g:seg(p,0,.15)});
  s+=fade(seg(p,.35,.5),TF('R^2(\\sin^2\\theta+\\cos^2\\theta)=R^2',600,255,{size:34}));
  s+=TF('r^2=R^2+d^2+2Rd\\cos\\theta',600,390,{size:52,g:seg(p,.6,.75),box:true});
  return s;
 },
 [K+'r2check']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5});
  const [nx,ny]=ptAt(XC,YC,RP,0),[sx,sy]=ptAt(XC,YC,RP,Math.PI),oy=YC+RP*.5;
  s+=dot(nx,ny,7,C.hi)+dot(sx,sy,7,C.hi);
  s+=fade(seg(p,.05,.2),seg2(XC+26,oy,XC+26,ny,{color:C.hi,w:4,text:'R＋d',tx:44,ty:0,size:26})+label('北極 θ＝0',nx-20,ny-14,{size:24,color:C.hi,anchor:'end'}));
  s+=fade(seg(p,.25,.4),seg2(XC+26,oy,XC+26,sy,{color:C.a,w:4,text:'R−d',tx:44,ty:8,size:26})+label('南極 θ＝π',sx-20,sy+30,{size:24,color:C.hi,anchor:'end'}));
  s+=card(640,90,520,330,TF('\\theta=0:\\ r^2=(R+d)^2',900,190,{size:38,g:seg(p,.45,.6)})+TF('\\theta=\\pi:\\ r^2=(R-d)^2',900,300,{size:38,g:seg(p,.55,.7)})+ok(900,390,seg(p,.75,.85)),1);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5});
  const [nx,ny]=ptAt(XC,YC,RP,0),[sx,sy]=ptAt(XC,YC,RP,Math.PI),oy=YC+RP*.5;
  s+=dot(nx,ny,7,C.hi)+dot(sx,sy,7,C.hi);
  s+=seg2(XC+26,oy,XC+26,ny,{color:C.hi,w:4,text:'3 m',tx:40,ty:0,size:28})+seg2(XC+26,oy,XC+26,sy,{color:C.a,w:4,text:'1 m',tx:40,ty:8,size:28});
  s+=card(640,90,520,330,TF('R=2\\,\\mathrm{m},\\quad d=1\\,\\mathrm{m}',900,170,{size:40})
   +label('北極まで',700,270,{size:28})+TF('2+1=3\\,\\mathrm{m}',990,265,{size:38,g:seg(p,.3,.45)})
   +label('南極まで',700,360,{size:28})+TF('2-1=1\\,\\mathrm{m}',990,355,{size:38,g:seg(p,.5,.65)}),1);
  return s;
 },
 // ===== S4 内積を成分で計算する =====
 [K+'goal']:(p)=>{
  let s=xsec(250,262,160,{dr:.5,ths:[]})+eAt(250,262,160,.5,Math.PI*.35,{lenN:64,kE:70});
  s+=TF(`${vE}=kQ\\frac{${vr}}{r^3}`,800,100,{size:40,frac:true});
  s+=TF(`${EN}=kQ\\frac{${RN}}{r^3}`,800,250,{size:50,frac:true,g:seg(p,.1,.25)});
  s+=fade(seg(p,.5,.65),L('まず 分子の 内積',800,375,{size:28,color:G1.hi,weight:700})+TF(`${RN}=\\;?`,800,445,{size:42,box:true}));
  return s;
 },
 [K+'dot1']:(p)=>{
  let s=TF(`${vr}=(R\\sin\\theta\\cos\\varphi,\\ R\\sin\\theta\\sin\\varphi,\\ d+R\\cos\\theta)`,600,55,{size:34});
  s+=TF(`${vn}=(\\sin\\theta\\cos\\varphi,\\ \\sin\\theta\\sin\\varphi,\\ \\cos\\theta)`,600,125,{size:34});
  s+=L('水平（x と y）の 成分どうし',600,215,{size:26,color:C.dim});
  s+=TF('R\\sin^2\\theta\\cos^2\\varphi+R\\sin^2\\theta\\sin^2\\varphi',600,300,{size:40,g:seg(p,.15,.3)});
  s+=TF('=R\\sin^2\\theta\\,(\\cos^2\\varphi+\\sin^2\\varphi)=R\\sin^2\\theta',600,410,{size:40,g:seg(p,.45,.6),box:true});
  return s;
 },
 [K+'dot2']:(p)=>{
  let s=TF(`${vr}=(R\\sin\\theta\\cos\\varphi,\\ R\\sin\\theta\\sin\\varphi,\\ d+R\\cos\\theta)`,600,55,{size:34});
  s+=TF(`${vn}=(\\sin\\theta\\cos\\varphi,\\ \\sin\\theta\\sin\\varphi,\\ \\cos\\theta)`,600,125,{size:34});
  s+=TF('R\\sin^2\\theta',260,240,{size:36,opacity:.7})+label('水平',260,190,{size:24,color:C.dim,anchor:'middle'});
  s+=L('鉛直（z）の 成分どうし',760,190,{size:26,color:C.dim});
  s+=TF('(d+R\\cos\\theta)\\cos\\theta',760,280,{size:40,g:seg(p,.05,.2)});
  s+=TF('=d\\cos\\theta+R\\cos^2\\theta',760,400,{size:40,g:seg(p,.35,.5),box:true});
  return s;
 },
 [K+'dot3']:(p)=>{
  let s=TF(`${RN}=R\\sin^2\\theta+d\\cos\\theta+R\\cos^2\\theta`,600,80,{size:40});
  s+=TF(`=R(\\sin^2\\theta+\\cos^2\\theta)+d\\cos\\theta`,600,200,{size:40,g:seg(p,.05,.2)});
  s+=TF(`${RN}=R+d\\cos\\theta`,600,330,{size:52,g:seg(p,.3,.45),box:true});
  s+=fade(seg(p,.6,.75),L('𝐄 と 𝐧 が 平行とは 仮定していない',600,460,{size:28,color:G1.hi,weight:700}));
  return s;
 },
 [K+'dot0']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:0,ths:TH8,kE:52,lenN:48});
  s+=card(620,80,540,350,TF('d=0',890,150,{size:40})+TF(`${RN}=R+0=R`,890,250,{size:42,g:seg(p,.1,.25)})+L('距離 r も R → 𝐄 ∥ 𝐧',890,330,{size:28,g:1})+fade(seg(p,.5,.65),L('中級の 中心の 球に 戻る',890,400,{size:28,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'En']:(p)=>{
  let s=TF('r^3=(r^2)^{3/2}',600,70,{size:40});
  s+=TF(`r^2=R^2+d^2+2Rd\\cos\\theta`,600,150,{size:34,opacity:.85});
  s+=TF(`${EN}=kQ\\,\\frac{R+d\\cos\\theta}{${DEN}^{3/2}}`,600,320,{size:54,frac:true,box:true,g:seg(p,.3,.45)});
  return s;
 },
 [K+'Enum']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5,ths:[0,Math.PI],kE:30,maxL:130,gN:0});
  const [nx,ny]=ptAt(XC,YC,RP,0),[sx,sy]=ptAt(XC,YC,RP,Math.PI);
  s+=label('北極',nx-24,ny-10,{size:24,color:C.dim,anchor:'end'})+label('南極',sx-24,sy+30,{size:24,color:C.dim,anchor:'end'});
  s+=card(600,60,560,410,TF('R=2\\,\\mathrm{m},\\ d=1\\,\\mathrm{m}',880,115,{size:34})
   +label('北極',640,220,{size:28})+TF(`${EN}=kQ\\frac{3}{27}=\\frac{kQ}{9}`,930,215,{size:36,frac:true,g:seg(p,.1,.25)})
   +label('南極',640,330,{size:28})+TF(`${EN}=kQ\\frac{1}{1}=kQ`,930,325,{size:36,frac:true,g:seg(p,.4,.55)})
   +fade(seg(p,.7,.85),L('9倍 違う',880,430,{size:32,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'Enum2']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5,ths:TH8,gN:.35});
  // bar comparison
  s+=card(620,70,540,380,L('𝐄·𝐧 の 大きさ（kQ を 1 として）',890,125,{size:24,color:C.dim})
   +rect(700,170,400/9,60,{fill:G1.E,fo:.6})+label('北 1/9',690,210,{size:26,anchor:'end'})
   +rect(700,260,400,60,{fill:G1.E,fo:.6})+label('南 1',690,300,{size:26,anchor:'end'})
   +fade(seg(p,.45,.6),L('合計への 効き方は？',890,400,{size:30,color:G1.hi,weight:700})),1);
  return s;
 },
 // ===== S5 面積を掛けて φ を積分する =====
 [K+'dA']:(p)=>{
  const {P,svg}=sph3({dr:.5});
  let s=svg+patch(P,SPHERE,40,55,-70,-45,{color:G1.A,fo:.45});
  s+=card(600,70,560,360,TF(`${dA}=R^2\\sin\\theta\\,d\\theta\\,d\\varphi`,880,150,{size:44,box:true})
   +fade(seg(p,.4,.55),L('θ・φ は C から 測る',880,265,{size:28})+L('→ 球を ずらしても 同じ 式',880,330,{size:28,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'double']:(p)=>{
  let s=TF(`${PHI}=${OI}${EN}\\,${dA}`,600,70,{size:44});
  s+=TF(`=kQR^2\\int_0^{2\\pi}\\!d\\varphi\\int_0^{\\pi}\\frac{(R+d\\cos\\theta)\\sin\\theta}{${DEN}^{3/2}}\\,d\\theta`,600,250,{size:44,frac:true,g:seg(p,.1,.3)});
  s+=fade(seg(p,.35,.5),L('φ：0〜2π　θ：0〜π',600,420,{size:28,color:G1.ang}));
  return s;
 },
 [K+'phi']:(p)=>{
  const {P,svg}=sph3({dr:.5});
  // ring at fixed θ, a point moving around in φ
  const t=1.0,ringPts=[];for(let i=0;i<=72;i++){const f=2*Math.PI*i/72;ringPts.push(P([Math.sin(t)*Math.cos(f),Math.cos(t),Math.sin(t)*Math.sin(f)]).slice(0,2));}
  let s=svg+draw(ringPts,1,{color:G1.hi,w:4});
  const f=2*Math.PI*p,q=P([Math.sin(t)*Math.cos(f),Math.cos(t),Math.sin(t)*Math.sin(f)]),o=P([0,-.5,0]);
  s+=line(o[0],o[1],q[0],q[1],{color:G1.E,w:3,dash:'6 6'})+dot(q[0],q[1],8,C.hi);
  s+=card(620,80,540,350,L('積分の 中身に φ が ない',890,150,{size:28,weight:700})
   +L('同じ θ の 輪の 上では',890,240,{size:28})+L('距離も 角度も 同じ',890,300,{size:30,color:G1.hi,weight:700}),1);
  return s;
 },
 [K+'phi2']:(p)=>{
  let s=TF(`\\int_0^{2\\pi}d\\varphi=2\\pi`,600,80,{size:44});
  s+=TF(`${PHI}=2\\pi kQR^2${INTG}`,600,270,{size:52,frac:true,box:true,g:seg(p,.3,.45)});
  return s;
 },
 [K+'check']:(p)=>{
  let s=TF(`${PHI}=2\\pi kQR^2${INTG}`,600,70,{size:34,frac:true,opacity:.85});
  s+=TF('d=0:\\quad\\frac{R\\sin\\theta}{(R^2)^{3/2}}=\\frac{\\sin\\theta}{R^2}',600,195,{size:40,frac:true,g:seg(p,.05,.2)});
  s+=TF('\\int_0^{\\pi}\\sin\\theta\\,d\\theta=2',600,300,{size:38,g:seg(p,.3,.45)});
  s+=TF(`2\\pi kQR^2\\times\\frac{2}{R^2}=4\\pi kQ`,600,420,{size:44,frac:true,box:true,g:seg(p,.55,.7)});
  s+=ok(980,425,seg(p,.75,.85));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=TF('r^2=R^2+d^2+2Rd\\cos\\theta',330,70,{size:34})+TF(`${RN}=R+d\\cos\\theta`,870,70,{size:34,g:seg(p,.1,.25)});
  s+=TF(`${PHI}=2\\pi kQR^2${INTG}`,600,240,{size:50,frac:true,box:true,g:seg(p,.3,.45)});
  s+=fade(seg(p,.6,.75),L('面は 一度も 取り替えていない',600,420,{size:30,color:G1.hi,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=TF(`${PHI}=2\\pi kQR^2${INTG}`,600,190,{size:52,frac:true,box:true});
  s+=fade(seg(p,.2,.35),L('強さの 偏り・法線との ずれ・面積 を すべて 含む',600,360,{size:28}));
  s+=fade(seg(p,.55,.7),L('面は 一度も 取り替えていない',600,430,{size:30,color:G1.hi,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=TF(`${PHI}=2\\pi kQR^2${INTG}`,600,150,{size:52,frac:true});
  s+=TF(`${DEN}^{3/2}`,600,350,{size:44,box:true,g:seg(p,.2,.35)});
  s+=fade(seg(p,.4,.55),L('分母に 3/2 乗 ―― どう 計算する？',600,460,{size:32,color:G1.hi,weight:700}));
  return s;
 },
};
