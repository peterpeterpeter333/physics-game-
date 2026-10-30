// YouTube シリーズ「ローレンツ力・上級 1/2」(ys-ue-lorentz-1) — 図。Stage 1200×515.
// 軸：x 右、y 奥、z 上（中級と同じ右手系）。らせんの図は 𝐁＝Bx̂（右向き）、斜投影で y（奥）を右上に描く。
// らせん：位置 (adv·(ψ−π/2), −ρ sinψ, −ρ cosψ)。ψ＝π/2：手前（y＝−ρ）で 𝐯⊥＝+ẑ（上）から出発 → 上 → 奥 → 真下 → 手前。
//   𝐯⊥ ∝ (0,−cosψ, sinψ)、力（軸向き）∝ (0, sinψ, cosψ)。真下（ψ＝2π）：𝐯⊥＝−ŷ、(−ŷ)×x̂＝ẑ（上）✓。
// 端から見た図（+x の側から −x を見る）：画面の右＝+y、上＝+z、𝐁 は手前（⊙）。画面位置 (cx−R sinψ, cy+R cosψ) → 時計回り（正電荷）。
// 正面図（中級 2/2 と同じ）：x 右、z 上、𝐁 奥（⊗）、正電荷は反時計回り。
// 色：𝐯 紫、𝐁 橙、𝐅 緑、正電荷 赤、電子 青、半径 r 水色、周期 T 金、ピッチ p 黄。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';

const K='ue-lorentz-1:';
const CV=C.v,CB=C.E,CF=C.F,CQ=C.p,PO=C.a,EL='#7fb3ff',CR=C.x,CT=C.t,CP=C.hi,HX=C.x,HY=C.v,HZ=C.t,GL='#7dffa8';
const PI=Math.PI;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const TF=(s,x,y,maxW,size=40,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}'),bF=cs(CF,'\\mathbf{F}'),qq=cs(CQ,'q'),aq=cs(CQ,'|q|');
const hx=cs(HX,'\\hat{x}'),hy=cs(HY,'\\hat{y}'),hz=cs(HZ,'\\hat{z}');
const vv=cs(CV,'v'),BB=cs(CB,'B'),rr=cs(CR,'r'),TT=cs(CT,'T'),pp=cs(CP,'p');
const vpa=cs(CV,'v_{\\parallel}'),vpe=cs(CV,'v_{\\perp}'),bvpe=cs(CV,'\\mathbf{v}_{\\perp}');
const R_EQ=`${rr}=\\dfrac{m\\,${vpe}}{${aq}\\,${BB}}`;
const T_EQ=`${TT}=\\dfrac{2\\pi m}{${aq}\\,${BB}}`;
const P_EQ=`${pp}=\\dfrac{2\\pi m\\,${vpa}}{${aq}\\,${BB}}`;
const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
function charge(x,y,sign=1,r=16,g=1){const c=sign>0?PO:EL;return fade(g,ring(x,y,r,{color:c,w:3,fill:sign>0?'#3a1d2a':'#1b2a48'})+label(sign>0?'＋':'−',x,y+r*.4,{size:r*1.15,color:c,anchor:'middle',weight:700}));}
function inSym(x,y,r=9,color=CB,w=2){const d=r*.62;return ring(x,y,r,{color,w,fill:'#10182c'})+line(x-d,y-d,x+d,y+d,{color,w})+line(x-d,y+d,x+d,y-d,{color,w});}
function outSym(x,y,r=9,color=CB,w=2){return ring(x,y,r,{color,w,fill:'#10182c'})+dot(x,y,r*.32,color);}
function field(sym,x0,y0,x1,y1,{step=80,g=1,r=9}={}){let s='';for(let x=x0;x<=x1+1;x+=step)for(let y=y0;y<=y1+1;y+=step)s+=sym(x,y,r);return fade(g*.45,s);}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function arcArrow(cx,cy,r,a0,a1,color,w=4,g=1){
 if(g<=0)return '';const pts=circPts(cx,cy,r,a0,a1,30),n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1),L=14;
 return fade(g,draw(pts,1,{color,w})+`<polygon points="${x2+Math.cos(a)*5},${y2+Math.sin(a)*5} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${color}"/>`);
}
function rightMark(x,y,a,b,s=13,color=C.ink){return draw([[x+a[0]*s,y+a[1]*s],[x+(a[0]+b[0])*s,y+(a[1]+b[1])*s],[x+b[0]*s,y+b[1]*s]],1,{color,w:2});}
function bracketH(x1,x2,y,{color=CP,text='',size=30,dy=40,g=1}={}){
 return fade(g,line(x1,y,x2,y,{color,w:3})+line(x1,y-12,x1,y+12,{color,w:3})+line(x2,y-12,x2,y+12,{color,w:3})+(text?label(text,(x1+x2)/2,y+dy,{size,color,anchor:'middle',weight:700}):''));
}
function rowsCard(list,p,{x=740,y=90,w=430,h=84,gap=12,start=0,step=.25,shown=null}={}){
 let s='';list.forEach((r,i)=>{const yy=y+i*(h+gap);const g=shown!==null?(i<shown?1:0):seg(p,start+i*step,start+i*step+.12);s+=card(x,yy,w,h,r(yy+h/2),g);});return s;
}

// ---- front view (中級 2/2 と同じ：𝐁 奥向き、正電荷は反時計回り) ----
const CI0={cx:330,cy:265,R:150};
function at(phi,{cx=CI0.cx,cy=CI0.cy,R=CI0.R}={}){return {x:cx+R*Math.cos(phi),y:cy-R*Math.sin(phi),v:[-Math.sin(phi),-Math.cos(phi)],f:[-Math.cos(phi),Math.sin(phi)]};}
function vf(phi,{g=1,lv=80,lf=65,labels=0,cx,cy,R}={}){
 const o={};if(cx!==undefined){o.cx=cx;o.cy=cy;o.R=R;}
 const {x,y,v,f}=at(phi,o);
 let s=arrow(x,y,x+v[0]*lv,y+v[1]*lv,{color:CV,w:5,head:15})+(lf?arrow(x,y,x+f[0]*lf,y+f[1]*lf,{color:CF,w:6,head:16}):'');
 if(labels)s+=T(bv,x+v[0]*(lv+22),y+v[1]*(lv+22)+10,{size:30})+(lf?T(bF,x+f[0]*(lf+24),y+f[1]*(lf+24)+10,{size:30}):'');
 return fade(g,s+charge(x,y,1,14));
}
function frontBase({cx=CI0.cx,cy=CI0.cy,R=CI0.R,x0=60,x1=600}={}){
 return field(inSym,x0,90,x1,460)+draw(circPts(cx,cy,R,0,2*PI,90),1,{color:C.dim,w:2.5,dash:'8 8'})+dot(cx,cy,5,C.dim);
}
function radius(g=1,{cx=CI0.cx,cy=CI0.cy,R=CI0.R,ang=200,sym=rr}={}){const x=cx+R*Math.cos(ang*PI/180),y=cy-R*Math.sin(ang*PI/180);return fade(g,line(cx,cy,x,y,{color:CR,w:4})+T(sym,(cx+x)/2-4,(cy+y)/2-14,{size:34}));}

// ---- oblique 3D (𝐁 along x) ----
const KX=.9,KZ=.3;
const mkP=(ox,oy,u)=>(x,y,z)=>[ox+u*(x+KX*y),oy-u*(z+KZ*y)];
const P=mkP(170,300,85);
const RHO=1,ADV=.35,PS=PI/2; // radius, advance per radian (v∥/v⊥ = .45)
const hp=(psi,{rho=RHO,adv=ADV}={})=>[adv*(psi-PS),-rho*Math.sin(psi),-rho*Math.cos(psi)];
const vperp=psi=>[0,-Math.cos(psi),Math.sin(psi)];
const fdir=psi=>[0,Math.sin(psi),Math.cos(psi)];
const add=(a,b,k=1)=>[a[0]+k*b[0],a[1]+k*b[1],a[2]+k*b[2]];
const V3=(Q,a,b,o={})=>{const A=Q(...a),B=Q(...b);return arrow(A[0],A[1],B[0],B[1],o);};
const L3=(Q,a,b,o={})=>{const A=Q(...a),B=Q(...b);return line(A[0],A[1],B[0],B[1],o);};
function fieldX(Q,{g=1,x0=-.6,x1=6.2,z=1.75,lab=1}={}){
 let s='';for(const zz of [z,-z])s+=V3(Q,[x0,0,zz],[x1,0,zz],{color:CB,w:3,head:13});
 return fade(g*.6,s)+(lab?fade(g,T(bB,Q(x1,0,z)[0]+10,Q(x1,0,z)[1]+12,{size:34,anchor:'start'})):'');
}
function axisX(Q,g=1,x0=-.6,x1=6.2){return fade(g,L3(Q,[x0,0,0],[x1,0,0],{color:C.faint,w:2,dash:'6 7'}));}
function triad(x=60,y=110,g=1){
 const L=46;return fade(g,arrow(x,y,x+L,y,{color:HX,w:3,head:10})+label('x',x+L+6,y+8,{size:22,color:HX})
  +arrow(x,y,x,y-L,{color:HZ,w:3,head:10})+label('z',x-6,y-L-6,{size:22,color:HZ,anchor:'end'})
  +arrow(x,y,x+L*.75,y-L*.25,{color:HY,w:3,head:10})+label('y（奥）',x+L*.75+6,y-L*.25-8,{size:22,color:HY}));
}
function helixPts(Q,psi0,psi1,o={},n=240){return Array.from({length:n+1},(_,i)=>Q(...hp(psi0+(psi1-psi0)*i/n,o)));}
// helix with the far half (y>0, behind the axis) dimmed so it reads as a 3D coil
function hdraw(Q,psi0,psi1,o={},{color=C.hi,w=4,dash=''}={}){
 if(psi1<=psi0+1e-6)return '';
 const n=Math.max(12,Math.ceil((psi1-psi0)/(2*PI)*140));let out='',cur=[],front=null;
 for(let i=0;i<=n;i++){const ps=psi0+(psi1-psi0)*i/n,P3=hp(ps,o),f=P3[1]<=1e-9,pt=Q(...P3);
  if(front===null)front=f;
  if(f!==front){cur.push(pt);out+=draw(cur,1,{color,w:front?w:w*.7,opacity:front?1:.45,dash});cur=[pt];front=f;}else cur.push(pt);}
 if(cur.length>1)out+=draw(cur,1,{color,w:front?w:w*.7,opacity:front?1:.45,dash});
 return out;
}
const base3=(g=1)=>fieldX(P,{g})+axisX(P,g)+triad(60,110,g);
const PSI_END=PS+2*2*PI; // two turns
function chargeAt(Q,psi,o={},{sign=1,r=14}={}){const A=Q(...hp(psi,o));return charge(A[0],A[1],sign,r);}

// end view (looking from +x toward −x): screen right = +y, up = +z, 𝐁 out of screen
const EV={cx:330,cy:265,R:150};
function evPos(psi,{cx=EV.cx,cy=EV.cy,R=EV.R}={}){return [cx-R*Math.sin(psi),cy+R*Math.cos(psi)];}
function endView(psi,{g=1,cx=EV.cx,cy=EV.cy,R=EV.R,lv=80,lf=65,showF=1,labels=1,fieldBox=[60,90,600,460],axes=1}={}){
 let s=field(outSym,fieldBox[0],fieldBox[1],fieldBox[2],fieldBox[3],{g});
 s+=draw(circPts(cx,cy,R,0,2*PI,90),1,{color:C.dim,w:2.5,dash:'8 8'})+outSym(cx,cy,16,CB,3);
 s+=arcArrow(cx,cy,R+30,PI*.9,PI*.4,PO,4,g);
 const [x,y]=evPos(psi,{cx,cy,R});const vd=[-Math.cos(psi),-Math.sin(psi)],fd=[(cx-x)/R,(cy-y)/R];
 s+=arrow(x,y,x+vd[0]*lv,y+vd[1]*lv,{color:CV,w:5,head:15});
 if(showF)s+=arrow(x,y,x+fd[0]*lf,y+fd[1]*lf,{color:CF,w:6,head:16});
 if(labels)s+=T(bvpe,x+vd[0]*(lv+26),y+vd[1]*(lv+26)+10,{size:28})+(showF?T(bF,x+fd[0]*(lf+26),y+fd[1]*(lf+26)+10,{size:28}):'');
 s+=charge(x,y,1,14);
 if(axes)s+=arrow(80,470,140,470,{color:HY,w:3,head:10})+label('y',148,478,{size:22,color:HY})+arrow(80,470,80,410,{color:HZ,w:3,head:10})+label('z',72,404,{size:22,color:HZ,anchor:'end'});
 return fade(g,s);
}

// ---- earth (dipole field lines, side view) ----
const EA={cx:330,cy:265,Re:72};
function fieldLinePts(L,side,{cx=EA.cx,cy=EA.cy,Re=EA.Re,n=90}={}){
 const l0=Math.acos(Math.sqrt(1/L));
 return Array.from({length:n+1},(_,i)=>{const lam=-l0+2*l0*i/n,r=L*Math.cos(lam)**2;return [cx+side*r*Re*Math.cos(lam),cy-r*Re*Math.sin(lam)];});
}
function earth(g=1,{lines=[2.2,3.2,4.4],lineG=1}={}){
 let s='';for(const L of lines)for(const side of [1,-1])s+=draw(fieldLinePts(L,side),lineG,{color:CB,w:2.5,opacity:.75});
 s+=ring(EA.cx,EA.cy,EA.Re,{color:C.x,w:3,fill:'#123049'})+label('地球',EA.cx,EA.cy+10,{size:28,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// particle spiralling along the L=4.4 line on the right side, from the equator toward the north
function spiralAlong(t,{L=4.4,side=1,amp=13,turns=9,color=C.hi}={}){
 const l0=Math.acos(Math.sqrt(1/L)),n=360,pts=[];
 for(let i=0;i<=n*t;i++){
  const u=i/n,lam=l0*u*.97,r=L*Math.cos(lam)**2;
  const x=EA.cx+side*r*EA.Re*Math.cos(lam),y=EA.cy-r*EA.Re*Math.sin(lam);
  const dl=.001,r2=L*Math.cos(lam+dl)**2,x2=EA.cx+side*r2*EA.Re*Math.cos(lam+dl),y2=EA.cy-r2*EA.Re*Math.sin(lam+dl);
  let tx=x2-x,ty=y2-y;const m=Math.hypot(tx,ty);tx/=m;ty/=m;const nx=-ty,ny=tx;
  const a=amp*(r/L)**1.5,ph=2*PI*turns*u;
  pts.push([x+a*Math.sin(ph)*nx+a*.55*Math.cos(ph)*tx,y+a*Math.sin(ph)*ny+a*.55*Math.cos(ph)*ty]);
 }
 if(pts.length<2)return '';
 const last=pts[pts.length-1];
 return draw(pts,1,{color,w:3})+dot(last[0],last[1],6,PO);
}
function polarCaps(g=1,{lat=64,color=GL,w=6}={}){
 const la=lat*PI/180,yN=EA.cy-EA.Re*Math.sin(la),yS=EA.cy+EA.Re*Math.sin(la),rx=EA.Re*Math.cos(la);
 return fade(g,`<ellipse cx="${EA.cx}" cy="${yN.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx*.22).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${w}" opacity=".9"/>`
  +`<ellipse cx="${EA.cx}" cy="${yS.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx*.22).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${w}" opacity=".9"/>`);
}

// rich text (same as ue-current-2): parts = [text, color, kind, weight]; kind 'i' italic symbol, 's' subscript
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function rich(parts,x,y,{size=34,anchor='middle'}={}){
 let s=`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" xml:space="preserve" style="white-space:pre">`,sub=false;
 for(const [t,c,k='',w=0] of parts){
  let dy=0;if(k==='s'&&!sub){dy=size*.28;sub=true;}else if(k!=='s'&&sub){dy=-size*.28;sub=false;}
  s+=`<tspan fill="${c}"${dy?` dy="${dy}"`:''}${k==='s'?` font-size="${Math.round(size*.62)}"`:''}${k==='i'?' font-style="italic" font-family="serif"':''}${w?` font-weight="${w}"`:''}>${esc(t)}</tspan>`;
 }
 return s+'</text>';
}
// three-row equation box (previous row dim, new row bright)
function eqBox(rows,p,{x=740,y=80,w=430,h=400}={}){
 let s=card(x,y,w,h,'',1);const n=rows.length,dy=h/(n+1);
 rows.forEach((r,i)=>{const g=i<n-1?.55:seg(p,.05,.25);s+=fade(i<n-1?1:g,r(x+w/2,y+dy*(i+1)+12,i<n-1));});
 return s;
}

export const ytUeLorentz1Diagrams={
 // ===== S1 前回の問い =====
 [K+'prev']:(p)=>{
  let s=card(150,70,900,380,label('前回：送電',600,128,{size:28,color:C.dim,anchor:'middle'}),1);
  s+=fade(seg(p,.05,.2),label('送る電力 ＝ 送電の電圧 × 電流',600,205,{size:32,color:C.ink,anchor:'middle'}));
  // 前回（電流・上級 2/2）と同じ表記と色：P損 橙、I・² 緑、R線 黄（日本語の添字は tspan）
  s+=fade(seg(p,.25,.4),rich([['線で失う電力  ',C.E,'',700],['P',C.E,'i'],['損',C.E,'s'],[' ＝ ',C.ink],['I',C.F,'i'],['²',C.F],['R',C.hi,'i'],['線',C.hi,'s']],600,280,{size:34}));
  s+=fade(seg(p,.5,.65),label('高い電圧 → 小さな電流 → 損失が小さい',600,365,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=base3()+hdraw(P,PS,PS+(PSI_END-PS)*seg(p,0,.6));
  s+=chargeAt(P,PS+(PSI_END-PS)*seg(p,0,.6));
  const a=P(...hp(2*PI)),b=P(...hp(4*PI));
  s+=bracketH(a[0],b[0],a[1]+70,{text:'？',size:40,g:seg(p,.55,.7)});
  s+=card(740,110,430,280,label('前回の最後の問い',955,165,{size:26,color:C.dim,anchor:'middle'})+label('斜めに動く電荷 → らせん',955,230,{size:28,color:C.ink,anchor:'middle'})
   +label('一周で 𝐁 の向きに',955,295,{size:30,color:C.hi,anchor:'middle',weight:700})+label('どれだけ 進む？',955,345,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=base3()+hdraw(P,PS,PSI_END)+chargeAt(P,PSI_END);
  const a=P(...hp(2*PI)),b=P(...hp(4*PI));
  s+=bracketH(a[0],b[0],a[1]+70,{text:'ピッチ p',size:30});
  s+=card(740,90,430,190,label('今回',955,140,{size:26,color:C.hi,anchor:'middle',weight:700})+label('ピッチ ＝ 一周で',955,195,{size:30,color:C.ink,anchor:'middle'})+label('𝐁 の向きに 進む距離',955,245,{size:30,color:C.ink,anchor:'middle'}),seg(p,0,.15),C.hi);
  s+=card(740,300,430,140,label('次回',955,350,{size:26,color:C.dim,anchor:'middle'})+label('導線全体が 受ける力',955,405,{size:28,color:C.dim,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'recap1']:(p)=>{
  let s=frontBase()+radius(1)+vf(-PI/2,{labels:1});
  s+=label('中級：𝐁 に 直角に 打ち出す',330,500,{size:24,color:C.dim,anchor:'middle'});
  s+=card(660,90,510,330,label('中級で 導いた',915,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),T(`${aq}\\,${vv}\\,${BB}=\\dfrac{m\\,${vv}^2}{${rr}}`,915,240,{size:46}))
   +fade(seg(p,.5,.7),T(`${rr}=\\dfrac{m\\,${vv}}{${aq}\\,${BB}}`,915,370,{size:50})),1);
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=frontBase()+radius(1)+vf(-PI/2,{labels:1});
  s+=label('中級：𝐁 に 直角に 打ち出す',330,500,{size:24,color:C.dim,anchor:'middle'});
  s+=card(660,90,510,330,label('1周の時間 T',915,140,{size:26,color:C.dim,anchor:'middle'})
   +T(`${TT}=\\dfrac{2\\pi ${rr}}{${vv}}=\\dfrac{2\\pi m}{${aq}\\,${BB}}`,915,250,{size:46})
   +fade(seg(p,.45,.6),label('v が 約分で 消える',915,345,{size:28,color:C.a,anchor:'middle',weight:700})+label('→ 速さに よらない',915,395,{size:28,color:CT,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'predict']:(p)=>{
  let s=field(inSym,60,100,400,360,{step:70})+draw(circPts(230,230,100,0,2*PI,70),1,{color:C.dim,w:3,dash:'8 8'})+vf(-PI/2,{cx:230,cy:230,R:100,lv:60,lf:0});
  s+=label('𝐁 に 直角',230,400,{size:28,color:C.ink,anchor:'middle',weight:700});
  const Q=mkP(540,250,52);
  s+=fieldX(Q,{x0:-.5,x1:7,z:1.8,lab:0})+hdraw(Q,PS,PS+3*2*PI,{adv:.35},{w:3})+(()=>{const A=Q(...hp(PS,{adv:.35}));return charge(A[0],A[1],1,12);})();
  s+=label('𝐁 に 斜め',720,400,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=card(150,425,900,80,label('1周の時間 T は、変わる？ 変わらない？',600,477,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 // ===== S2 速度を2つに分ける =====
 [K+'setup']:(p)=>{
  let s=base3(seg(p,0,.25));
  const O=hp(PS),V=add(add(O,[ADV*1.6,0,0]),[0,0,1.6]);
  s+=fade(seg(p,.3,.5),V3(P,O,V,{color:CV,w:6,head:18})+T(bv,P(...V)[0]+14,P(...V)[1]+6,{size:34,anchor:'start'}));
  s+=chargeAt(P,PS);
  s+=card(740,120,430,250,T(`${bB}=B\\,${hx}`,955,195,{size:48})+label('右向き（x の向き）',955,265,{size:28,color:CB,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('𝐯 は 𝐁 に 斜め',955,330,{size:28,color:CV,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 ...(()=>{
  const O=hp(PS),Vpa=add(O,[ADV*1.6,0,0]),Vpe=add(O,[0,0,1.6]),V=add(Vpa,[0,0,1.6]);
  const vecs=({gpa=1,gpe=1,dimV=0}={})=>V3(P,O,V,{color:CV,w:6,head:18,opacity:dimV?.35:1})
   +fade(gpa,V3(P,O,Vpa,{color:CV,w:6,head:16})+L3(P,Vpa,V,{color:CV,w:2,dash:'5 6'})+T(vpa,P(...Vpa)[0]+10,P(...Vpa)[1]+34,{size:32,anchor:'start'}))
   +fade(gpe,V3(P,O,Vpe,{color:CV,w:6,head:16})+L3(P,Vpe,V,{color:CV,w:2,dash:'5 6'})+T(bvpe,P(...Vpe)[0]-12,P(...Vpe)[1]+4,{size:32,anchor:'end'}));
  return {
   [K+'split']:(p)=>base3()+vecs({gpa:seg(p,.15,.35),gpe:seg(p,.4,.6),dimV:1})+chargeAt(P,PS)
    +card(740,140,430,200,label('𝐁 に 平行 ＋ 直角',955,195,{size:28,color:C.dim,anchor:'middle'})+T(`${bv}=${vpa}\\,${hx}+${bvpe}`,955,280,{size:46}),seg(p,.05,.2)),
   [K+'par']:(p)=>base3()+vecs({gpe:.3,dimV:1})+chargeAt(P,PS)
    +card(740,100,430,320,label('平行な部分の力',955,150,{size:26,color:C.dim,anchor:'middle'})
     +TF(`${qq}\\,(${vpa}\\,${hx})\\times(B\\,${hx})`,955,230,400,40)
     +fade(seg(p,.4,.55),T(`${hx}\\times${hx}=0`,955,315,{size:44}))
     +fade(seg(p,.6,.75),label('力は 0',955,385,{size:32,color:CF,anchor:'middle',weight:700})),1),
  };
 })(),
 [K+'par2']:(p)=>{
  let s=base3();
  const X=seg(p,.05,.95)*5.2,ticks=[0,1.3,2.6,3.9,5.2];
  s+=ticks.map((x,i)=>{const A=P(x,0,0);return fade(X>=x-1e-6?1:.25,line(A[0],A[1]-12,A[0],A[1]+12,{color:CT,w:3}));}).join('');
  const A=P(X,0,0);
  s+=arrow(A[0],A[1],A[0]+62,A[1],{color:CV,w:6,head:16})+T(vpa,A[0]+70,A[1]-14,{size:30,anchor:'start'})+dot(A[0],A[1],9,PO);
  s+=label('等しい時間ごとに 等しい距離',P(2.6,0,0)[0],P(2.6,0,0)[1]+60,{size:26,color:CT,anchor:'middle'});
  s+=card(740,120,430,260,label('x の向き：力なし',955,180,{size:30,color:CF,anchor:'middle',weight:700})
   +label('v∥ は 一定 → 等速',955,290,{size:30,color:CV,anchor:'middle',weight:700}),1);
  return s;
 },
 [K+'perp']:(p)=>{
  let s=base3();
  s+=draw(Array.from({length:91},(_,i)=>P(...hp(2*PI*i/90,{adv:0}))),1,{color:C.dim,w:2.5,dash:'8 8'});
  const psi=PS+2*PI*seg(p,0,1),O=hp(psi,{adv:0}),A=P(...O);
  s+=V3(P,O,add(O,vperp(psi),1.3),{color:CV,w:5,head:16})+V3(P,O,add(O,fdir(psi),.7),{color:CF,w:6,head:16})+charge(A[0],A[1],1,14);
  s+=card(740,110,430,290,label('直角な部分：円運動',955,170,{size:30,color:C.ink,anchor:'middle',weight:700})+label('v を v⊥ に 替える',955,230,{size:26,color:C.dim,anchor:'middle'})+T(R_EQ,955,330,{size:46}),1);
  return s;
 },
 ...(()=>{
  const O=hp(2*PI,{adv:0}),A=P(...O),Vt=add(O,vperp(2*PI),1.1),Ft=add(O,fdir(2*PI),.75);
  const ringP=()=>draw(Array.from({length:91},(_,i)=>P(...hp(2*PI*i/90,{adv:0}))),1,{color:C.dim,w:2.5,dash:'8 8'});
  const vArrow=()=>V3(P,O,Vt,{color:CV,w:5,head:16})+T(bvpe,P(...Vt)[0]-4,P(...Vt)[1]-20,{size:30,anchor:'start'})+label('（手前）',P(...Vt)[0]-10,P(...Vt)[1]-58,{size:22,color:CV});
  const fArrow=g=>fade(g,V3(P,O,Ft,{color:CF,w:6,head:16})+T(bF,P(...Ft)[0]+16,P(...Ft)[1]+8,{size:30,anchor:'start'}));
  return {
   [K+'check']:(p)=>base3()+ringP()+vArrow()+charge(A[0],A[1],1,14)
    +card(740,130,430,240,label('軸の 真下で',955,190,{size:28,color:C.dim,anchor:'middle'})+T(`${bvpe}=-${vpe}\\,${hy}`,955,280,{size:46})+label('（手前向き）',955,340,{size:26,color:CV,anchor:'middle'}),seg(p,0,.15)),
   [K+'check2']:(p)=>base3()+ringP()+vArrow()+fArrow(seg(p,.45,.6))+charge(A[0],A[1],1,14)
    +card(740,110,430,300,T(`(-${hy})\\times${hx}=${hz}`,955,200,{size:46})+fade(seg(p,.4,.55),label('正の電荷：力は 上',955,290,{size:30,color:CF,anchor:'middle',weight:700})+label('＝ 軸の方向き',955,345,{size:30,color:CF,anchor:'middle',weight:700})),1),
   [K+'check3']:(p)=>{
    let s=base3()+ringP();
    for(const psi of [PS,PI,3*PI/2,2*PI]){const Q=hp(psi,{adv:0}),B=P(...Q);s+=V3(P,Q,add(Q,fdir(psi),.7),{color:CF,w:5,head:14})+charge(B[0],B[1],1,11);}
    const psi=PS+2*PI*seg(p,0,1),Q=hp(psi,{adv:0}),B=P(...Q);
    s+=V3(P,Q,add(Q,vperp(psi),1.2),{color:CV,w:5,head:15})+charge(B[0],B[1],1,14);
    s+=card(740,150,430,200,label('円の どこでも',955,215,{size:30,color:C.ink,anchor:'middle'})+label('力は 軸に 向かう',955,290,{size:32,color:CF,anchor:'middle',weight:700}),1);
    return s;
   },
  };
 })(),
 [K+'end']:(p)=>{
  const psi=PS+2*PI*seg(p,.1,1);
  let s=endView(psi,{});
  s+=label('𝐁 の 矢の先の 側から 見る',350,500,{size:24,color:C.dim,anchor:'middle'});
  s+=card(660,100,510,330,label('𝐁：手前向き（⊙）',915,165,{size:30,color:CB,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('正の電荷：時計回り',915,240,{size:30,color:PO,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('中級の ⊗ の図を',915,320,{size:28,color:C.ink,anchor:'middle'})+label('裏から 見た形',915,370,{size:28,color:C.ink,anchor:'middle'})),1);
  return s;
 },
 ...(()=>{
  const left=()=>endView(PI*1.25,{})+fade(1,line(EV.cx,EV.cy,...evPos(PI*1.75),{color:CR,w:4}))+T(rr,(EV.cx+evPos(PI*1.75)[0])/2+20,(EV.cy+evPos(PI*1.75)[1])/2+4,{size:32,anchor:'start'});
  return {
   [K+'endT']:(p)=>left()+card(660,80,510,400,label('円の 1周の時間',915,125,{size:26,color:C.dim,anchor:'middle'})
     +T(`${TT}=\\dfrac{2\\pi ${rr}}{${vpe}}`,915,205,{size:44})
     +fade(seg(p,.35,.5),TF(`=\\dfrac{2\\pi}{${vpe}}\\cdot\\dfrac{m\\,${vpe}}{${aq}\\,${BB}}`,915,310,480,42))
     +fade(seg(p,.7,.85),T(`=\\dfrac{2\\pi m}{${aq}\\,${BB}}`,915,425,{size:44,color:CT})),1),
   [K+'answer']:(p)=>left()+card(660,90,510,360,label('予想の答え',915,145,{size:26,color:C.dim,anchor:'middle'})+T(T_EQ,915,245,{size:48})
     +fade(seg(p,.1,.25),label('1周の時間は 変わらない',915,335,{size:32,color:CT,anchor:'middle',weight:700}))+fade(seg(p,.45,.6),label('角度にも 速さにも よらない',915,400,{size:28,color:C.ink,anchor:'middle'})),1,C.hi),
  };
 })(),
 // ===== S3 同じ時計で合わせる =====
 [K+'clock']:(p)=>{
  const u=seg(p,.05,.9),psi=PS+2*PI*u;
  let s=endView(psi,{cx:200,cy:200,R:95,lv:55,lf:0,labels:0,fieldBox:[60,90,340,320],axes:0});
  s+=label('円（𝐁 の向きから）',200,345,{size:24,color:C.dim,anchor:'middle'});
  // clock
  const ccx=480,ccy=200,cr=70;
  s+=ring(ccx,ccy,cr,{color:CT,w:4,fill:'#1f1a10'});for(let i=0;i<12;i++){const a=i*PI/6;s+=line(ccx+(cr-10)*Math.sin(a),ccy-(cr-10)*Math.cos(a),ccx+cr*Math.sin(a),ccy-cr*Math.cos(a),{color:CT,w:2});}
  s+=draw(Array.from({length:61},(_,i)=>{const a=2*PI*u*i/60;return [ccx+(cr-22)*Math.sin(a),ccy-(cr-22)*Math.cos(a)];}),1,{color:CT,w:6,opacity:.35});
  s+=line(ccx,ccy,ccx+(cr-14)*Math.sin(2*PI*u),ccy-(cr-14)*Math.cos(2*PI*u),{color:CT,w:5})+dot(ccx,ccy,6,CT);
  s+=label(u>.98?'t ＝ T':'時間 t',ccx,ccy+cr+40,{size:26,color:CT,anchor:'middle',weight:700});
  // track
  const x0=110,x1=640,y=430,X=mix(x0,x1,u);
  s+=line(x0-20,y,x1+60,y,{color:C.faint,w:3,dash:'6 7'})+arrow(x1+10,y-60,x1+90,y-60,{color:CB,w:3,head:12})+T(bB,x1+100,y-52,{size:28,anchor:'start'});
  for(let i=0;i<=4;i++){const xx=mix(x0,x1,i/4);s+=fade(u>=i/4-1e-6?1:.25,line(xx,y-12,xx,y+12,{color:CT,w:3}));}
  s+=arrow(X,y,X+55,y,{color:CV,w:5,head:14})+dot(X,y,9,PO)+label('𝐁 の向き：等速',375,y+50,{size:24,color:C.dim,anchor:'middle'});
  s+=card(760,100,410,300,label('同じ 時計で 同時に',965,160,{size:30,color:CT,anchor:'middle',weight:700})+label('円：1周 ＝ 時間 T',965,240,{size:28,color:C.ink,anchor:'middle'})+label('x の向き：速さ v∥',965,310,{size:28,color:C.ink,anchor:'middle'}),1);
  return s;
 },
 [K+'helix']:(p)=>{
  const u=seg(p,.05,.95),psi=PS+(PSI_END-PS)*u;
  let s=base3()+hdraw(P,PS,psi);
  s+=V3(P,hp(psi),add(hp(psi),add([ADV,0,0],vperp(psi)),1.2),{color:CV,w:5,head:15})+chargeAt(P,psi);
  s+=card(740,150,430,200,label('回りながら 進む',955,215,{size:30,color:C.ink,anchor:'middle'})+label('→ らせん',955,290,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 ...(()=>{
  const a=P(...hp(2*PI)),b=P(...hp(4*PI));
  const left=(g=1)=>base3()+hdraw(P,PS,PSI_END)+chargeAt(P,PSI_END)
   +fade(g,ring(a[0],a[1],12,{color:CP,w:3})+ring(b[0],b[1],12,{color:CP,w:3})+line(a[0],a[1],a[0],a[1]+70,{color:CP,w:2,dash:'4 5'})+line(b[0],b[1],b[0],b[1]+70,{color:CP,w:2,dash:'4 5'}))
   +bracketH(a[0],b[0],a[1]+70,{text:'p',size:34,g});
  return {
   [K+'pitch']:(p)=>left(seg(p,.3,.5))+card(740,110,430,280,label('ピッチ p',955,170,{size:34,color:CP,anchor:'middle',weight:700})+label('1周の 間に',955,240,{size:28,color:C.ink,anchor:'middle'})+label('𝐁 の向きに 進む距離',955,295,{size:28,color:C.ink,anchor:'middle'})
     +fade(seg(p,.55,.7),label('真下 → 次の 真下',955,355,{size:26,color:C.dim,anchor:'middle'})),1),
   [K+'eq1']:(p)=>left()+card(740,110,430,280,label('速さ × 時間',955,170,{size:28,color:C.dim,anchor:'middle'})+fade(seg(p,.3,.5),T(`${pp}=${vpa}\\,${TT}`,955,290,{size:60})),1),
   [K+'eq2']:(p)=>left()+card(740,70,430,420,T(`${pp}=${vpa}\\,${TT}`,955,140,{size:44,opacity:.6})
     +fade(seg(p,.05,.25),T(T_EQ,955,240,{size:38})+label('代入',1110,250,{size:24,color:CT,anchor:'middle'}))
     +fade(seg(p,.4,.55),arrow(955,290,955,325,{color:C.dim,w:3,head:12}))
     +fade(seg(p,.45,.65),T(P_EQ,955,420,{size:48})),1),
  };
 })(),
 [K+'read']:(p)=>{
  let s=card(80,90,500,260,label('半径',330,140,{size:28,color:CR,anchor:'middle',weight:700})+T(R_EQ,330,250,{size:52})+label('v⊥ で 決まる',330,325,{size:28,color:CV,anchor:'middle'}),1);
  s+=card(620,90,500,260,label('ピッチ',870,140,{size:28,color:CP,anchor:'middle',weight:700})+T(P_EQ,870,250,{size:52})+label('v∥ で 決まる',870,325,{size:28,color:CV,anchor:'middle'}),seg(p,.15,.3));
  s+=fade(seg(p,.55,.7),label('どちらも B が 強いほど 小さい',600,430,{size:32,color:CB,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ratio']:(p)=>{
  let s=card(100,70,1000,400,'',1);
  s+=T(`\\dfrac{${pp}}{2\\pi ${rr}}`,240,210,{size:56});
  s+=fade(seg(p,.05,.25),T(`=\\dfrac{2\\pi m\\,${vpa}\\,/\\,(${aq}\\,${BB})}{2\\pi m\\,${vpe}\\,/\\,(${aq}\\,${BB})}`,640,210,{size:50}));
    s+=fade(seg(p,.4,.55),label('2π・m・|q|B が 消える',640,330,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),T(`=\\dfrac{${vpa}}{${vpe}}`,640,430,{size:56,color:C.hi}));
  return s;
 },
 [K+'shape']:(p)=>{
  let s='';
  const cols=[[200,1.6,'v∥ ＞ v⊥：伸びる'],[600,1,'v∥ ＝ v⊥'],[1000,.25,'v∥ ＜ v⊥：詰まる']];
  cols.forEach(([cx,k,t],i)=>{
   const g=seg(p,.05+i*.2,.2+i*.2),Q=mkP(cx-150,250,40),len=7,turns=len/(2*PI*k);
   s+=fade(g,V3(Q,[-.3,0,2.1],[7.4,0,2.1],{color:CB,w:3,head:12,opacity:.7})+hdraw(Q,PS,PS+2*PI*turns,{adv:k},{w:3})+label(t,cx,410,{size:28,color:C.ink,anchor:'middle',weight:700}));
  });
  s+=fade(seg(p,.7,.85),label('形は 速度の向き（v∥ と v⊥ の比）だけで 決まる',600,480,{size:28,color:C.hi,anchor:'middle'}));
  return s;
 },
 // ===== S4 陽子で計算する =====
 [K+'data']:(p)=>{
  const items=[['陽子の質量 m','1.67\\times10^{-27}\\ \\mathrm{kg}',C.ink],['電荷 q','1.6\\times10^{-19}\\ \\mathrm{C}',CQ],['磁場 B','0.1\\ \\mathrm{T}',CB],['v⊥ ＝ v∥','10^{6}\\ \\mathrm{m/s}',CV]];
  let s='';
  items.forEach(([a,b,c],i)=>{s+=card(60,85+i*95,600,80,label(a,90,135+i*95,{size:28,color:c,weight:700})+T(b,470,127+i*95,{size:38,color:c}),seg(p,.05+i*.12,.15+i*.12));});
  const ox=760,oy=390,L=230;
  s+=arrow(ox-20,oy,ox+330,oy,{color:CB,w:4,head:14})+T(bB,ox+340,oy+10,{size:32,anchor:'start'});
  s+=fade(seg(p,.55,.7),line(ox+L,oy,ox+L,oy-L,{color:CV,w:2,dash:'6 6'})+line(ox,oy-L,ox+L,oy-L,{color:CV,w:2,dash:'6 6'})+arrow(ox,oy,ox+L,oy-L,{color:CV,w:6,head:18})
   +T(bv,ox+L+14,oy-L-6,{size:32,anchor:'start'})+label('v∥',ox+L/2,oy+36,{size:26,color:CV,anchor:'middle'})+label('v⊥',ox+L+16,oy-L/2+8,{size:26,color:CV})
   +`<path d="M ${ox+60} ${oy} A 60 60 0 0 0 ${(ox+60*Math.cos(PI/4)).toFixed(1)} ${(oy-60*Math.sin(PI/4)).toFixed(1)}" fill="none" stroke="${C.ink}" stroke-width="2"/>`+label('45°',ox+78,oy-18,{size:24,color:C.ink}));
  s+=charge(ox,oy,1,12);
  return s;
 },
 ...(()=>{
  const res=(n)=>{let s='';const rows=[[`${rr}\\approx0.104\\ \\mathrm{m}`],[`${TT}\\approx6.56\\times10^{-7}\\ \\mathrm{s}`],[`${pp}\\approx0.656\\ \\mathrm{m}`]];
   rows.forEach(([t],i)=>{if(i<n)s+=card(870,95+i*120,300,95,TF(t,1020,152+i*120,270,32),1);});return s;};
  const box=(rows,p,n,hl=-1)=>{let s=card(50,70,790,420,'',1);rows.forEach((r,i)=>{s+=fade(i===0?1:seg(p,.1+i*.22,.28+i*.22),TF(r,445,165+i*125,740,42));});return s+res(n);};
  return {
   [K+'r']:(p)=>box([R_EQ,`=\\dfrac{1.67\\times10^{-27}\\times10^{6}}{1.6\\times10^{-19}\\times0.1}`,`=\\dfrac{1.67\\times10^{-21}}{1.6\\times10^{-20}}\\approx0.104\\ \\mathrm{m}`],p,p>.8?1:0),
   [K+'T']:(p)=>box([T_EQ,`=\\dfrac{2\\pi\\times1.67\\times10^{-27}}{1.6\\times10^{-20}}`,`\\approx6.56\\times10^{-7}\\ \\mathrm{s}`],p,p>.8?2:1),
   [K+'p']:(p)=>box([`${pp}=${vpa}\\,${TT}`,`=10^{6}\\ \\mathrm{m/s}\\times6.56\\times10^{-7}\\ \\mathrm{s}`,`\\approx0.656\\ \\mathrm{m}`],p,p>.8?3:2),
   [K+'pchk']:(p)=>box([`2\\pi ${rr}=2\\pi\\times0.104\\ \\mathrm{m}`,`\\approx0.65\\ \\mathrm{m}`],p,3)+fade(seg(p,.6,.75),label('ピッチ 0.656 m と ほぼ 同じ',445,430,{size:30,color:CP,anchor:'middle',weight:700})),
   [K+'pchk2']:(p)=>box([`45^\\circ:\\ \\ ${vpa}=${vpe}`,`\\dfrac{${pp}}{2\\pi ${rr}}=\\dfrac{${vpa}}{${vpe}}=1`],p,3)+fade(seg(p,.6,.75),label('式の 通り',445,430,{size:30,color:C.hi,anchor:'middle',weight:700})),
  };
 })(),
 [K+'pic']:(p)=>{
  const u=320,Q=mkP(300,270,u),r=.104375,adv=r; // 45°: advance per radian = r
  let s=fieldX(Q,{x0:-.12,x1:2.4,z:.33});
  const ps=PS+(2*PI*1.6/(2*PI*r))*seg(p,0,.85)*1; // up to x≈1.6 m
  const psi1=PS+2.1/adv;
  s+=hdraw(Q,PS,PS+(psi1-PS)*seg(p,0,.8),{rho:r,adv});
  const now=PS+(psi1-PS)*seg(p,0,.8),A=Q(...hp(now,{rho:r,adv}));s+=charge(A[0],A[1],1,11);
  // radius at start (z down from axis at bottom point ψ=2π)
  const a=Q(...hp(2*PI,{rho:r,adv})),b=Q(...hp(4*PI,{rho:r,adv})),c0=Q(adv*(2*PI-PS),0,0);
  s+=fade(seg(p,.3,.45),line(c0[0],c0[1],a[0],a[1],{color:CR,w:4})+label('r ≈ 0.104 m（約 10 cm）',a[0]-24,a[1]+44,{size:26,color:CR,anchor:'end',weight:700}));
  s+=bracketH(a[0],b[0],a[1]+90,{text:'p ≈ 0.656 m（約 66 cm）',size:28,g:seg(p,.55,.7)});
  return s;
 },
 [K+'double']:(p)=>{
  const u=300,r=.104375;
  let s='';
  const one=(oy,rr2,g,txt,col)=>{const Q=mkP(120,oy,u),psi1=PS+1.55/rr2;return fade(g,V3(Q,[-.1,0,.3],[1.7,0,.3],{color:CB,w:3,head:12,opacity:.6})+hdraw(Q,PS,psi1,{rho:rr2,adv:rr2},{color:col,w:3.5})
   +label(txt[0],660,oy-14,{size:28,color:C.ink,weight:700})+label(txt[1],660,oy+26,{size:26,color:col}));};
  s+=one(170,r,1,['B＝0.1 T','r ≈ 0.104 m、p ≈ 0.656 m'],C.hi);
  s+=one(390,r/2,seg(p,.15,.35),['B＝0.2 T','r ≈ 0.052 m、p ≈ 0.328 m'],C.x);
  s+=fade(seg(p,.55,.7),label('r も T も p も 半分 → 同じ形のまま 縮む',600,495,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 オーロラ =====
 [K+'aur']:(p)=>earth(1,{lineG:seg(p,0,.3)})+fade(seg(p,.2,.35),spiralAlong(seg(p,.25,1)))
   +card(700,110,470,260,label('らせんが 基本',935,170,{size:30,color:C.hi,anchor:'middle',weight:700})+label('荷電粒子は',935,240,{size:28,color:C.ink,anchor:'middle'})+label('磁力線に 巻きつくように 動く',935,295,{size:28,color:C.ink,anchor:'middle'}),seg(p,.1,.25)),
 [K+'guide']:(p)=>{
  let s=earth()+spiralAlong(1);
  const Q=mkP(720,410,34);
  s+=card(700,80,470,410,label('磁力線に 直角',935,130,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 円を 回るだけ',935,180,{size:28,color:C.a,anchor:'middle'})
   +fade(seg(p,.4,.55),label('磁力線に 沿って',935,255,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ v∥ で 進める',935,305,{size:28,color:CF,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),V3(Q,[0,0,1.7],[12.5,0,1.7],{color:CB,w:3,head:12,opacity:.7})+hdraw(Q,PS,PS+2*PI*4,{adv:.45},{w:3})),1);
  return s;
 },
 [K+'pole']:(p)=>{
  let s=earth()+spiralAlong(1)+polarCaps(seg(p,.2,.4),{color:C.hi,w:4});
  s+=card(700,120,470,250,label('磁力線は 極の 近くで',935,185,{size:28,color:C.ink,anchor:'middle'})+label('地面へ 集まる',935,240,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('→ 極の 上空の 大気へ',935,315,{size:30,color:C.hi,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'glow']:(p)=>{
  let s=earth()+spiralAlong(1)+polarCaps(1,{color:C.hi,w:3})+polarCaps(seg(p,.3,.5),{color:GL,w:10});
  s+=card(700,120,470,250,label('大気の 分子・原子に',935,185,{size:28,color:C.ink,anchor:'middle'})+label('ぶつかって エネルギーを 渡す',935,240,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),label('→ 光る ＝ オーロラ',935,315,{size:32,color:GL,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'limit']:(p)=>{
  let s='';
  // converging field lines (stronger to the right)
  for(let i=-3;i<=3;i++){const pts=Array.from({length:61},(_,j)=>{const x=80+520*j/60,sq=1-.62*(j/60)**2;return [x,265+i*42*sq];});s+=draw(pts,1,{color:CB,w:2.5,opacity:.7});}
  s+=label('弱い',110,120,{size:24,color:C.dim})+label('強い',560,120,{size:24,color:C.dim});
  const t=seg(p,.05,.95),n=200,pts=[];
  for(let j=0;j<=n*t;j++){const u=j/n,xx=u<.65?mix(100,520,u/.65):mix(520,300,(u-.65)/.35),R=24*(1-.5*((xx-80)/520)**2),ph=u*2*PI*11;pts.push([xx+R*.5*Math.cos(ph),265+R*Math.sin(ph)]);}
  if(pts.length>1)s+=draw(pts,1,{color:C.hi,w:3});
  s+=fade(seg(p,.6,.75),arrow(520,170,400,170,{color:C.a,w:4,head:14})+label('押し返される',460,150,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=card(680,90,490,340,label('実際の 地磁気は 一様ではない',925,145,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),check(745,205,14)+label('強まる所で 押し返される',775,215,{size:26,color:C.ink}))
   +fade(seg(p,.5,.65),check(745,270,14)+label('加速される ことも',775,280,{size:26,color:C.ink}))
   +fade(seg(p,.7,.85),label('（ここでは 計算しない）',925,375,{size:26,color:C.dim,anchor:'middle'})),1);
  return s;
 },
 [K+'storm']:(p)=>{
  let s=earth(1,{lines:[2.2,3.2,4.4]})+polarCaps(1,{lat:66,color:GL,w:8})+polarCaps(seg(p,.4,.6),{lat:40,color:GL,w:4});
  s+=fade(seg(p,.4,.6),label('強い 磁気嵐',EA.cx+170,EA.cy-60,{size:24,color:GL,weight:700}));
  s+=card(700,110,470,280,label('極の 近くに 多い',935,180,{size:30,color:GL,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('強い 磁気嵐では',935,260,{size:28,color:C.ink,anchor:'middle'})+label('日本でも 見えることがある',935,315,{size:28,color:C.ink,anchor:'middle'})),1);
  return s;
 },
 // ===== S6 まとめ =====
 [K+'sum1']:(p)=>{
  let s=base3()+hdraw(P,PS,PSI_END)+chargeAt(P,PSI_END);
  s+=rowsCard([
   y=>label('平行：等速（力 0）',955,y+10,{size:28,color:C.ink,anchor:'middle',weight:700}),
   y=>label('直角：円',955,y+10,{size:28,color:C.ink,anchor:'middle',weight:700}),
   y=>label('同じ時計 T → らせん',955,y+10,{size:28,color:C.hi,anchor:'middle',weight:700}),
  ],p,{y:110,h:90,step:.22});
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(120,50,960,135,label('半径',230,128,{size:28,color:CR,weight:700,anchor:'middle'})+T(R_EQ,640,133,{size:42}),1);
  s+=card(120,200,960,135,label('周期',230,278,{size:28,color:CT,weight:700,anchor:'middle'})+T(T_EQ,640,283,{size:42}),seg(p,.25,.4));
  s+=card(120,350,960,135,label('ピッチ',230,428,{size:28,color:CP,weight:700,anchor:'middle'})+T(`${pp}=${vpa}\\,${TT}=\\dfrac{2\\pi m\\,${vpa}}{${aq}\\,${BB}}`,640,433,{size:42}),seg(p,.5,.65));
  return s;
 },
 ...(()=>{
  const wire=(p,big)=>{
   let s=field(inSym,70,95,1130,470,{step:85});
   s+=rect(80,225,1040,80,{fill:'#c58b4a',fo:.18,stroke:'#c58b4a',sw:2,rx:40});
   s+=arrow(980,190,1100,190,{color:CF,w:4,head:14})+label('電流 I',1040,170,{size:24,color:CF,anchor:'middle',weight:700});
   s+=label('𝐁：奥向き（⊗）',150,80,{size:24,color:CB,weight:700});
   const dx=-60*p;
   for(let i=0;i<22;i++){const x=((120+i*47+dx)%1000+1000)%1000+100,y=245+((i*37)%45);s+=fade(big?.5:1,arrow(x,y,x,y-30,{color:CF,w:3,head:9}))+dot(x,y,7,EL);}
   return s;
  };
  return {
   [K+'wire']:(p)=>wire(p,0)+card(330,345,540,120,label('電子 1個ずつに  q𝐯×𝐁',600,395,{size:28,color:C.ink,anchor:'middle'})+label('（電子は 電流と 逆向きに 動く）',600,440,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.25)),
   [K+'next']:(p)=>wire(p,1)+fade(seg(p,.1,.3),arrow(600,225,600,105,{color:CF,w:10,head:28}))+fade(seg(p,.15,.35),label('？',650,140,{size:48,color:C.hi,weight:700}))
    +card(330,345,540,120,label('導線 全体の 力は',600,395,{size:30,color:C.hi,anchor:'middle',weight:700})+label('どう 書ける？',600,445,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi),
  };
 })(),
};
