// 高校編「光波・深く学ぶ 2/3」(ys-hs-w-light-2) — 図。Stage 1200×515.
// 色は 1/3 と同じ（θ 橙、v 紫、n 白、光 淡い黄、ガラス 青）。作図：上の三角形 水色、下の三角形 緑、共通の斜辺 d 黄。
// 作図の寸法：1目盛り＝72 px、d＝6目盛り、θ₁＝30°、A は 3目盛り（v₁Δt）、B は 2目盛り（v₂Δt）、sinθ₂＝1/3。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,tSince,arc,LC,FC,VCOL,TCOL,ANG,LIGHT,GLASS,GLINE,SAND,ct,vt,th,vi,E8,
 medium,normal,refr,rays,angMark,beam} from './yt1-hs-w-light-1-diagrams.mjs';

const K='hs-w-light-2:';
const PI=Math.PI, R=PI/180;
const F=(src,x,y,size=46,o={})=>tex(src,x,y,{size,auto:false,...o});
const DC=C.hi, T1C=C.x, T2C=C.F;
const DT=`\\Delta {\\color{${TCOL}}t}`;
export const sinT=i=>`\\sin${th(i)}`;
// ---- construction geometry ------------------------------------------------------------------
const U=72, YB=250, TH1=30, S2=1/3, C2=Math.sqrt(1-1/9);
export const G={B:[330,YB],A2:[330+6*U,YB]};
const d1=[Math.sin(TH1*R),Math.cos(TH1*R)], d2=[S2,C2];
G.A=[G.A2[0]-3*U*d1[0],G.A2[1]-3*U*d1[1]];
G.B2=[G.B[0]+2*U*d2[0],G.B[1]+2*U*d2[1]];
const P=(o,d,k)=>[o[0]+k*d[0],o[1]+k*d[1]];
const rot=(v,f)=>[v[0]*Math.cos(f)-v[1]*Math.sin(f),v[0]*Math.sin(f)+v[1]*Math.cos(f)]; // clockwise on screen
function rightMark(Pt,u,v,{s=18,color=C.ink}={}){const a=P(Pt,u,s),b=P(P(Pt,u,s),v,s),c=P(Pt,v,s);return draw([a,b,c],1,{color,w:2.5});}
const norm=v=>{const l=Math.hypot(...v);return [v[0]/l,v[1]/l];};
const ptLabel=(t,Pt,dx,dy,{g=1,color=C.ink}={})=>fade(g,label(t,Pt[0]+dx,Pt[1]+dy,{size:30,color,anchor:'middle',weight:700}));
// the construction picture; options switch the layers on
export function cons({g=1,wf=1,ab=1,ra=0,rb=0,circ=0,nwf=0,dl=0,t1=0,t2=0,ang1=0,ang2=0,ticks=0,lab=1,rays0=1}={}){
 let s=medium({y:YB,g,lower:'ガラス',lx:150});
 // incoming rays through B and A (upper), refracted rays (lower)
 if(rays0){
  s+=fade(g*.8,line(...P(G.B,d1,-260),...G.B,{color:LIGHT,w:2,dash:'6 6'})+line(...P(G.A,d1,-150),...G.A,{color:LIGHT,w:2,dash:'6 6'}));
  s+=fade(g*.8*nwf,line(...G.B,...P(G.B,d2,250),{color:LIGHT,w:2,dash:'6 6'})+line(...G.A2,...P(G.A2,d2,170),{color:LIGHT,w:2,dash:'6 6'}));
 }
 if(t1)s+=fade(t1*.9,poly([G.B,G.A,G.A2],{fill:T1C,fo:.18,stroke:T1C,sw:2}));
 if(t2)s+=fade(t2*.9,poly([G.B,G.B2,G.A2],{fill:T2C,fo:.18,stroke:T2C,sw:2}));
 if(wf)s+=fade(wf,line(...G.B,...G.A,{color:LIGHT,w:6}));
 if(ab)s+=ptLabel('B',G.B,-26,-14,{g:ab})+ptLabel('A',G.A,-12,-22,{g:ab})+fade(ab,dot(...G.A,7,LIGHT)+dot(...G.B,7,LIGHT));
 if(ra)s+=arrow(...G.A,...P(G.A,d1,3*U*ra),{color:VCOL,w:5,head:16})+fade(clamp(ra*3-2),tex(`${vi(1)}${DT}`,mix(G.A[0],G.A2[0],.5)+62,mix(G.A[1],G.A2[1],.5)+6,{size:32,auto:false}));
 if(ra>=1)s+=ptLabel('A′',G.A2,18,40,{g:1});
 if(circ){const r=2*U;s+=fade(circ,`<path d="M${G.B[0]-r} ${YB} A${r} ${r} 0 0 0 ${G.B[0]+r} ${YB}" fill="none" stroke="${VCOL}" stroke-width="2.5" stroke-dasharray="6 6"/>`);}
 if(rb)s+=arrow(...G.B,...P(G.B,d2,2*U*rb),{color:VCOL,w:5,head:16})+fade(clamp(rb*3-2),tex(`${vi(2)}${DT}`,G.B[0]-60,mix(G.B[1],G.B2[1],.6),{size:32,auto:false}));
 if(nwf)s+=fade(nwf,line(...G.A2,...G.B2,{color:LIGHT,w:6})+dot(...G.B2,7,LIGHT))+ptLabel('B′',G.B2,-10,42,{g:nwf});
 if(dl)s+=fade(dl,line(...G.B,...G.A2,{color:DC,w:7}))+fade(dl,tex('d',mix(G.B[0],G.A2[0],.5)-40,YB+40,{size:36,color:DC,auto:false}));
 if(t1)s+=fade(t1,rightMark(G.A,norm([G.B[0]-G.A[0],G.B[1]-G.A[1]]),d1));
 if(t2)s+=fade(t2,rightMark(G.B2,[-d2[0],-d2[1]],norm([G.A2[0]-G.B2[0],G.A2[1]-G.B2[1]])));
 if(ang1){const u=norm([G.A[0]-G.B[0],G.A[1]-G.B[1]]),a1=Math.atan2(-u[1],u[0])/R;s+=fade(ang1,arc(G.B[0],G.B[1],70,0,a1,{color:ANG,w:4})+tex(th(1),G.B[0]+104,G.B[1]-20,{size:32,auto:false}));}
 if(ang2){s+=fade(ang2,arc(G.A2[0],G.A2[1],80,180,180+Math.asin(S2)/R,{color:ANG,w:4})+tex(th(2),G.A2[0]-118,G.A2[1]+40,{size:32,auto:false}));}
 if(ticks){const tk=(o,d,n,col)=>{let q='';for(let i=0;i<=n;i++){const p=P(o,d,i*U),nn=[-d[1],d[0]];q+=line(p[0]-9*nn[0],p[1]-9*nn[1],p[0]+9*nn[0],p[1]+9*nn[1],{color:col,w:3});}return q;};
  s+=fade(ticks,tk(G.A,d1,3,VCOL)+tk(G.B,d2,2,VCOL)+tk(G.B,[1,0],6,DC));}
 return s;
}
// two segments (ray direction & normal) rotated together about a point by f (0..90°)
function rotPair(O,dirRay,dirN,f,{g=1,L=150,text=th(1)}={}){
 const a=rot(dirRay,f*R),b=rot(dirN,f*R);
 const ang=v=>Math.atan2(-v[1],v[0])/R;let a0=ang(b),a1=ang(a);
 let dd=((a1-a0)%360+360)%360;if(dd>180){[a0,a1]=[a1,a0];dd=360-dd;}
 const mid=(a0+dd/2)*R;
 return fade(g,line(...O,...P(O,a,L),{color:LIGHT,w:5})+line(...O,...P(O,b,L),{color:C.ink,w:4,dash:'8 6'})+arc(O[0],O[1],60,a0,a0+dd,{color:ANG,w:4})+tex(text,O[0]+96*Math.cos(mid),O[1]-96*Math.sin(mid)+10,{size:30,auto:false}));
}
// ---- the cart (top view) on road → sand -------------------------------------------------------
function cartState(t,{c0=[300,50],h0=40,v1=30,v2=20,L=150}={}){
 let c=[...c0],h=h0*R;const dt=1/30;const n=Math.round(clamp(t,0,24)/dt);
 const sp=y=>y<YB?v1:v2;
 for(let i=0;i<n;i++){const d=[Math.sin(h),Math.cos(h)],a=[Math.cos(h),-Math.sin(h)];
  const Pw=[c[0]-L/2*a[0],c[1]-L/2*a[1]],Qw=[c[0]+L/2*a[0],c[1]+L/2*a[1]];
  const vp=sp(Pw[1]),vq=sp(Qw[1]),vc=(vp+vq)/2;
  c=[c[0]+vc*d[0]*dt,c[1]+vc*d[1]*dt];h-=(vq-vp)/L*dt;}
 return {c,h};
}
function cartTop(t,{g=1,tags=0,trail=1}={}){
 const L=150;let s=fade(g,rect(0,YB,1200,265,{fill:SAND,fo:.3,stroke:'none',rx:0})+line(0,YB,1200,YB,{color:SAND,w:3})+label('舗装路（速い）',1170,YB-18,{size:26,color:C.dim,anchor:'end',weight:700})+label('砂浜（遅い）',1170,YB+42,{size:26,color:SAND,anchor:'end',weight:700}));
 if(trail){const pts=[];for(let k=0;k<=40;k++){const st=cartState(t*k/40);pts.push(st.c);}s+=fade(g*.7,draw(pts,1,{color:C.dim,w:2,dash:'5 7'}));}
 const {c,h}=cartState(t),d=[Math.sin(h),Math.cos(h)],a=[Math.cos(h),-Math.sin(h)];
 const Pw=P(c,a,-L/2),Qw=P(c,a,L/2);
 const corner=(u,v)=>[c[0]+u*a[0]+v*d[0],c[1]+u*a[1]+v*d[1]];
 s+=fade(g,poly([corner(-L/2+10,-40),corner(L/2-10,-40),corner(L/2-10,40),corner(-L/2+10,40)],{fill:C.x,fo:.35,stroke:C.x,sw:2}));
 s+=fade(g,line(...Pw,...Qw,{color:C.dim,w:4}));
 const wheel=(W,col)=>line(...P(W,d,-18),...P(W,d,18),{color:col,w:12});
 const pin=Pw[1]>YB,qin=Qw[1]>YB;
 s+=fade(g,wheel(Pw,pin?C.a:C.ink)+wheel(Qw,qin?C.a:C.ink));
 s+=arrow(...P(c,d,45),...P(c,d,110),{color:VCOL,w:5,head:16,g});
 if(tags){s+=fade(tags*(pin?1:0),label(pin&&!qin?'遅い':'',Pw[0]-20,Pw[1]+40,{size:26,color:C.a,anchor:'end',weight:700}));
  s+=fade(tags*(pin&&!qin?1:0),label('速い',Qw[0]+24,Qw[1]-14,{size:26,color:C.ink,weight:700}));}
 return s;
}

export const hsWLight2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  return medium({y:270,g:seg(p,0,.15)})+beam({O:[520,270],th1:40,w:130,la:330,lb:250,t,g:seg(p,.05,.25)})+fade(seg(p,.4,.55),label('折れ曲がる',720,420,{size:30,color:C.hi,weight:700}));
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=medium({y:270})+beam({O:[520,270],th1:40,w:130,la:330,lb:250,t});
  s+=card(760,40,400,80,label('なぜ 向きまで？',960,93,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(760,140,400,80,label('どれだけ 曲がる？',960,193,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ================= S2 角度は法線から =================
 [K+'normal']:(p,ctx)=>{
  const O=[600,270];
  let s=medium({y:270,g:seg(p,0,.15)});
  s+=normal(...O,{up:240,down:230,g:seg(p,.45,.6),text:'法線'});
  s+=fade(seg(p,.5,.65),line(600,270,630,270,{color:C.ink,w:2})+line(630,270,630,240,{color:C.ink,w:2})+line(630,240,600,240,{color:C.ink,w:2}));
  s+=tag('定義',1080,60,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'th1']:(p,ctx)=>{
  const O=[600,270],t2=refr(40,1,1.5);
  let s=medium({y:270})+normal(...O,{up:240,down:230,text:'法線'});
  s+=rays({O,th1:40,la:320,lb:260,g:seg(p,0,.15),trans:seg(p,.5,.6)});
  s+=angMark(O,'in',40,{r:90,text:th(1),g:seg(p,.15,.3)})+fade(seg(p,.2,.35),label('入射角',330,170,{size:30,color:ANG,anchor:'end',weight:700}));
  s+=angMark(O,'out',t2,{r:100,text:th(2),g:seg(p,.6,.75)})+fade(seg(p,.65,.8),label('屈折角',740,470,{size:30,color:ANG,weight:700}));
  return s;
 },
 [K+'why']:(p,ctx)=>{
  const O=[600,270],t2=refr(40,1,1.5);
  let s=medium({y:270})+normal(...O,{up:240,down:230,text:'法線'})+rays({O,th1:40,la:320,lb:260});
  s+=angMark(O,'in',40,{r:90,text:th(1)})+angMark(O,'out',t2,{r:100,text:th(2)});
  // wrong: angle from the surface
  s+=fade(seg(p,.05,.2),arc(O[0],O[1],150,90+40,180,{color:C.a,w:4})+label('境界面からの 角 ✕',180,215,{size:28,color:C.a,weight:700}));
  s+=card(760,40,400,90,label('角は 法線から',960,98,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'pred']:(p,ctx)=>{
  const O=[600,270];
  let s=medium({y:270})+normal(...O,{up:240,down:230,text:'法線'})+rays({O,th1:40,la:320,trans:0});
  const dirA=refr(40,1,1.5),dirB=55;
  const ln=(a,col)=>line(...O,O[0]+240*Math.sin(a*R),O[1]+240*Math.cos(a*R),{color:col,w:4,dash:'10 8'});
  s+=fade(seg(p,.2,.35),ln(dirA,C.x)+label('近づく？',O[0]+70,O[1]+200,{size:28,color:C.x,anchor:'end',weight:700}));
  s+=fade(seg(p,.45,.6),ln(dirB,C.p)+label('離れる？',O[0]+250,O[1]+150,{size:28,color:C.p,weight:700}));
  return s;
 },
 [K+'obs']:(p,ctx)=>{
  const O=[560,270],t=tSince(p,ctx,K+'obs'),t2=refr(40,1,1.5);
  let s=medium({y:270})+beam({O,th1:40,w:110,la:330,lb:250,t,g:seg(p,0,.15)})+normal(...O,{up:240,down:230,text:'法線'});
  s+=angMark(O,'in',40,{r:110,text:th(1),g:seg(p,.2,.35)})+angMark(O,'out',t2,{r:130,text:th(2),g:seg(p,.2,.35)});
  s+=card(800,40,370,100,F(`${th(2)}<${th(1)}`,985,100,44),seg(p,.55,.7),ANG);
  s+=tag('実験',985,180,{color:C.dim,g:seg(p,.1,.25)});
  return s;
 },
 // ================= S3 台車のたとえ =================
 [K+'cart']:(p,ctx)=>{const t=tSince(p,ctx,K+'cart');return cartTop(t,{g:seg(p,0,.15)})+fade(seg(p,.5,.65),label('上から 見た 図',40,60,{size:28,color:C.dim,weight:700}));},
 [K+'cart2']:(p,ctx)=>{const t=tSince(p,ctx,K+'cart');return cartTop(t,{tags:seg(p,.05,.2)});},
 [K+'cart3']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'cart'),st=cartState(1e9);
  let s=cartTop(t,{});
  let hit=[0,YB];for(let k=0;k<=240;k++){const q=cartState(k*.1).c;if(q[1]>=YB){hit=[q[0],YB];break;}}s+=normal(...hit,{up:200,down:240,g:seg(p,.4,.55),text:'法線'});
  s+=fade(seg(p,.6,.75),label('法線に 近づく 向きへ',760,420,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'cart4']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'cart');
  let s=fade(.35,cartTop(t,{trail:0}));
  const rows=[['車輪の 両端','波面の 両端',C.ink],['砂','光の 遅く なる 物質',SAND]];
  rows.forEach(([a,b,c],i)=>{const o=seg(p,.05+i*.35,.2+i*.35),y=85+i*97;s+=card(120,y-55,960,90,label(a,380,y+6,{size:32,color:c,anchor:'middle',weight:700})+label('→',600,y+6,{size:32,color:C.dim,anchor:'middle'})+label(b,820,y+6,{size:32,color:c===SAND?GLINE:LIGHT,anchor:'middle',weight:700}),o,C.dim);});
  return s;
 },
 [K+'cart5']:(p,ctx)=>{
  let s=card(200,60,800,110,label('違い：光には 車軸が ない',600,130,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(200,260,800,110,label('→ 波面の 作図で 確かめる',600,330,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ================= S4 波面の作図 =================
 [K+'wf']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'wf');
  let s=medium({y:270})+beam({O:[560,270],th1:40,w:150,la:330,lb:250,t,hlCrest:0,g:seg(p,0,.15)});
  s+=fade(seg(p,.2,.35),label('波面（同じ 山を つないだ 線）',660,60,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.6,.75),label('進む 向き ⟂ 波面',660,110,{size:28,color:LIGHT,weight:700}));
  return s;
 },
 [K+'ab']:(p,ctx)=>cons({g:1,wf:seg(p,0,.15),ab:seg(p,.1,.3)})+fade(seg(p,.55,.7),label('B が 先に 境界へ',60,330,{size:28,color:C.hi,weight:700})),
 [K+'dta']:(p,ctx)=>cons({ra:lin(p,.45,.85)})+fade(seg(p,.1,.25),tex(`${DT}\\ \\text{の あいだ}`,950,80,{size:34,auto:false})),
 [K+'dtb']:(p,ctx)=>cons({ra:1,rb:lin(p,.2,.5),circ:seg(p,.45,.6)})+fade(seg(p,.7,.85),tex(`${vi(2)}<${vi(1)}`,1000,420,{size:36,auto:false})),
 [K+'newwf']:(p,ctx)=>cons({ra:1,rb:1,circ:1,nwf:seg(p,.1,.35)})+fade(seg(p,.6,.75),label('ガラスの 中の 向き',G.B[0]+80,470,{size:26,color:LIGHT,weight:700})),
 [K+'d']:(p,ctx)=>cons({ra:1,rb:1,circ:.4,nwf:1,dl:seg(p,.05,.2),t1:seg(p,.5,.6),t2:seg(p,.6,.7)}),
 [K+'tri1']:(p,ctx)=>cons({ra:1,rb:1,circ:.4,nwf:1,dl:1,t1:1})+fade(seg(p,.2,.35),label('A で 直角',G.A[0]+30,G.A[1]+10,{size:26,color:C.ink,weight:700})),
 [K+'rot']:(p,ctx)=>{
  let s=fade(.45,cons({ra:1,rb:1,circ:.4,nwf:1,dl:1,t1:1}));
  const f=90*seg(p,.55,.95);
  s+=rotPair(G.B,[-d1[0],-d1[1]],[0,-1],f,{g:seg(p,.3,.45)});
  s+=fade(seg(p,.3,.45),label('光線と 法線を 90° 回す',780,470,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'rot2']:(p,ctx)=>{
  let s=cons({ra:1,rb:1,circ:.4,nwf:1,dl:1,t1:1,ang1:seg(p,.5,.65)});
  s+=rotPair(G.B,[-d1[0],-d1[1]],[0,-1],90,{g:1-seg(p,.45,.6)});
  s+=fade(seg(p,.05,.2),label('光線 → 波面、法線 → 境界',780,430,{size:28,color:C.ink,weight:700}));
  s+=fade(seg(p,.6,.75),label('間の 角は θ₁ のまま',780,475,{size:28,color:ANG,weight:700}));
  return s;
 },
 [K+'sin1']:(p,ctx)=>{
  let s=cons({ra:1,rb:0,circ:0,nwf:0,dl:1,t1:1,ang1:1,rays0:1});
  s+=card(820,40,360,110,label('sin ＝ 向かいの 辺 ÷ 斜辺',1000,108,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.55,.7),line(...G.A,...G.A2,{color:C.hi,w:8}));
  return s;
 },
 [K+'sin1b']:(p,ctx)=>{
  let s=cons({ra:1,dl:1,t1:1,ang1:1});
  s+=card(830,30,350,100,F(`${sinT(1)}=\\dfrac{${vi(1)}${DT}}{d}`,1005,80,36),1,T1C);
  s+=card(830,180,350,90,F(`${vi(1)}${DT}=d\\,${sinT(1)}`,1005,228,36),seg(p,.5,.65),T1C);
  s+=fade(seg(p,.4,.55),label('両辺 × d',1005,160,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tri2']:(p,ctx)=>{
  let s=cons({ra:1,rb:1,circ:.4,nwf:1,dl:1,t1:.3,t2:seg(p,0,.15),ang2:seg(p,.75,.9)});
  s+=card(830,30,350,90,F(`${vi(1)}${DT}=d\\,${sinT(1)}`,1005,78,32),1,T1C);
  s+=fade(seg(p,.1,.25),label('B′ で 直角',G.B2[0]+30,G.B2[1]+40,{size:26,color:C.ink,weight:700}));
  s+=rotPair(G.A2,[d2[0],d2[1]],[0,1],90*seg(p,.4,.75),{g:seg(p,.3,.4)*(1-seg(p,.85,.95)),text:th(2)});
  return s;
 },
 [K+'sin2']:(p,ctx)=>{
  let s=cons({ra:1,rb:1,circ:.4,nwf:1,dl:1,t1:.3,t2:1,ang2:1});
  s+=fade(seg(p,.05,.2),line(...G.B,...G.B2,{color:C.hi,w:8}));
  s+=card(830,30,350,90,F(`${vi(1)}${DT}=d\\,${sinT(1)}`,1005,78,32),1,T1C);
  s+=card(830,150,350,90,F(`${vi(2)}${DT}=d\\,${sinT(2)}`,1005,198,32),seg(p,.4,.55),T2C);
  return s;
 },
 // ================= S5 数で確かめる =================
 [K+'num']:(p,ctx)=>{
  let s=cons({ra:1,rb:1,circ:.4,nwf:1,dl:1,t1:.6,t2:.6,ticks:seg(p,.4,.6)});
  s+=card(820,30,360,100,F(`${vi(2)}=\\tfrac{2}{3}${vi(1)}`,1000,88,40),seg(p,.05,.2),VCOL);
  s+=fade(seg(p,.6,.75),label('A：3目盛り',960,300,{size:28,color:VCOL,weight:700})+label('B：2目盛り',960,350,{size:28,color:VCOL,weight:700}));
  return s;
 },
 [K+'num2']:(p,ctx)=>{
  let s=cons({ra:1,rb:1,circ:.4,nwf:1,dl:1,t1:1,t2:.4,ticks:1,ang1:1});
  s+=fade(1,label('d：6目盛り',960,300,{size:28,color:DC,weight:700}));
  s+=card(820,30,360,110,F(`${sinT(1)}=\\dfrac{3}{6}=0.50`,1000,88,36),seg(p,.1,.25),T1C);
  s+=fade(seg(p,.6,.75),F(`${th(1)}=30^\\circ`,1000,190,36));
  return s;
 },
 [K+'num3']:(p,ctx)=>{
  let s=cons({ra:1,rb:1,circ:.4,nwf:1,dl:1,t1:.4,t2:1,ticks:1,ang1:1,ang2:1});
  s+=card(820,30,360,110,F(`${sinT(2)}=\\dfrac{2}{6}\\approx 0.33`,1000,88,34),seg(p,.05,.2),T2C);
  s+=fade(seg(p,.55,.7),F(`${th(2)}\\approx 19^\\circ`,1000,190,36));
  return s;
 },
 [K+'num4']:(p,ctx)=>{
  const O=[560,270],t2=refr(30,1,1.5);
  let s=medium({y:270})+normal(...O,{up:240,down:230,text:'法線'})+rays({O,th1:30,la:300,lb:250});
  s+=angMark(O,'in',30,{r:100,text:'30^\\circ'})+angMark(O,'out',t2,{r:120,text:'19^\\circ'});
  s+=card(820,40,350,100,label('法線に 近づく',995,105,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ================= S6 スネルの法則 =================
 [K+'div']:(p,ctx)=>{
  let s=card(100,30,480,90,F(`${vi(1)}${DT}=d\\,${sinT(1)}`,340,78,36),1,T1C);
  s+=card(620,30,480,90,F(`${vi(2)}${DT}=d\\,${sinT(2)}`,860,78,36),1,T2C);
  s+=card(250,200,700,170,F(`\\dfrac{${vi(1)}${DT}}{${vi(2)}${DT}}=\\dfrac{d\\,${sinT(1)}}{d\\,${sinT(2)}}`,600,290,48),seg(p,.35,.55),C.ink);
  return s;
 },
 [K+'cancel']:(p,ctx)=>{
  const X=`{\\color{${C.a}}\\cancel{\\color{${C.ink}}${DT}}}`,Y=`{\\color{${C.a}}\\cancel{\\color{${C.ink}}d}}`;
  let s=card(250,40,700,170,F(`\\dfrac{${vi(1)}${DT}}{${vi(2)}${DT}}=\\dfrac{d\\,${sinT(1)}}{d\\,${sinT(2)}}`,600,130,48),1-seg(p,.3,.45),C.ink);
  s+=fade(seg(p,.3,.45),card(250,40,700,170,F(`\\dfrac{${vi(1)}${X}}{${vi(2)}${X}}=\\dfrac{${Y}\\,${sinT(1)}}{${Y}\\,${sinT(2)}}`,600,130,48),1,C.ink));
  return s;
 },
 [K+'ratio']:(p,ctx)=>{
  let s=card(250,60,700,170,F(`\\dfrac{${vi(1)}}{${vi(2)}}=\\dfrac{${sinT(1)}}{${sinT(2)}}`,600,150,56),seg(p,0,.15),C.hi);
  s+=tag('結果',1030,90,{color:C.hi,g:seg(p,.3,.45)});
  s+=fade(seg(p,.5,.65),label('速さの 比 ＝ sin の 比',600,320,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('3：2 ＝ 0.50：0.33',600,390,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'subst']:(p,ctx)=>{
  let s=card(250,30,700,140,F(`\\dfrac{${vi(1)}}{${vi(2)}}=\\dfrac{${sinT(1)}}{${sinT(2)}}`,600,105,46),1,C.hi);
  s+=card(400,200,400,100,F(`${vt}=\\dfrac{${ct}}{n}`,600,256,40),seg(p,.15,.3),VCOL);
  s+=card(150,340,420,110,F(`${vi(1)}=\\dfrac{${ct}}{n_1}`,360,400,40),seg(p,.5,.62),VCOL);
  s+=card(630,340,420,110,F(`${vi(2)}=\\dfrac{${ct}}{n_2}`,840,400,40),seg(p,.65,.78),VCOL);
  return s;
 },
 [K+'inv']:(p,ctx)=>{
  let s=card(150,30,420,100,F(`${vi(1)}=\\dfrac{${ct}}{n_1}`,360,85,36),1,VCOL)+card(630,30,420,100,F(`${vi(2)}=\\dfrac{${ct}}{n_2}`,840,85,36),1,VCOL);
  s+=card(80,200,1040,170,F(`\\dfrac{${vi(1)}}{${vi(2)}}=\\dfrac{${ct}}{n_1}\\div\\dfrac{${ct}}{n_2}`,420,290,46),seg(p,.05,.2),C.ink);
  s+=fade(seg(p,.45,.6),F(`=\\dfrac{${ct}}{n_1}\\times\\dfrac{n_2}{${ct}}`,860,290,46));
  s+=fade(seg(p,.45,.6),label('逆さにして 掛ける',860,420,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'inv2']:(p,ctx)=>{
  const X=`{\\color{${C.a}}\\cancel{${ct}}}`;
  let s=card(80,30,1040,150,F(`\\dfrac{${vi(1)}}{${vi(2)}}=\\dfrac{${X}}{n_1}\\times\\dfrac{n_2}{${X}}=\\dfrac{n_2}{n_1}`,600,110,46),seg(p,0,.1),C.ink);
  s+=card(250,260,700,160,F(`\\dfrac{${sinT(1)}}{${sinT(2)}}=\\dfrac{n_2}{n_1}`,600,345,52),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'snell']:(p,ctx)=>{
  let s=card(250,20,700,140,F(`\\dfrac{${sinT(1)}}{${sinT(2)}}=\\dfrac{n_2}{n_1}`,600,95,46),1,C.dim);
  s+=fade(seg(p,.1,.25),label(`両辺 × n₁ sinθ₂`,600,200,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(200,250,800,150,F(`n_1\\,${sinT(1)}=n_2\\,${sinT(2)}`,600,335,60),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.7,.85),label('スネルの 法則',600,460,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check']:(p,ctx)=>{
  let s=card(200,20,800,120,F(`n_1\\,${sinT(1)}=n_2\\,${sinT(2)}`,600,90,46),1,C.hi);
  s+=card(80,220,500,130,F('1.0\\times0.50=0.50',330,292,40),seg(p,.15,.3),T1C);
  s+=fade(seg(p,.1,.25),label('左辺（空気）',330,200,{size:26,color:T1C,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check2']:(p,ctx)=>{
  let s=card(200,20,800,120,F(`n_1\\,${sinT(1)}=n_2\\,${sinT(2)}`,600,90,46),1,C.hi);
  s+=card(80,220,500,130,F('1.0\\times0.50=0.50',330,292,40),1,T1C)+label('左辺（空気）',330,200,{size:26,color:T1C,anchor:'middle',weight:700});
  s+=card(620,220,500,130,F('1.5\\times\\tfrac{1}{3}=0.50',870,292,40),seg(p,.05,.2),T2C);
  s+=fade(seg(p,.05,.2),label('右辺（ガラス）',870,200,{size:26,color:T2C,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('一致',600,430,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'law']:(p,ctx)=>{
  const O=[300,300],t=tSince(p,ctx,K+'law');
  let s=medium({y:300,x1:620,lx:600})+beam({O,th1:35,w:90,la:280,lb:200,t});
  s+=card(660,80,500,140,F(`n_1\\,${sinT(1)}=n_2\\,${sinT(2)}`,910,160,46),1,C.hi);
  s+=tag('結果',910,280,{color:C.hi,g:seg(p,.6,.75)});
  s+=fade(seg(p,.2,.35),label('境界の 両側で 等しい',910,350,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S7 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'ans');
  let s=medium({y:270})+beam({O:[560,270],th1:40,w:150,la:330,lb:250,t,hlCrest:0});
  s+=fade(seg(p,.4,.55),label('先に 着いた 側から 遅くなる',640,60,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const O=[400,300],t2=refr(30,1,1.5);
  let s=medium({y:300,x1:760,lx:740})+normal(...O,{up:250,down:200})+rays({O,th1:30,la:270,lb:200});
  s+=angMark(O,'in',30,{r:90,text:'30^\\circ'})+angMark(O,'out',t2,{r:100,text:'19^\\circ'});
  s+=card(780,100,400,130,F(`n_1\\,${sinT(1)}=n_2\\,${sinT(2)}`,980,175,34),1,C.hi);
  return s;
 },
 [K+'mis']:(p,ctx)=>{
  let s=card(100,40,1000,110,label('角度を 境界面から 測る',600,110,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(100,200,1000,110,label('遅い 物質に 入ると 法線から 離れる',600,270,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  s+=fade(seg(p,.2,.3),line(120,50,1080,140,{color:C.a,w:4}))+fade(seg(p,.6,.7),line(120,210,1080,300,{color:C.a,w:4}));
  s+=fade(seg(p,.75,.9),label('角は 法線から。遅い 物質へは 法線に 近づく',600,390,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const O=[560,270],t2=refr(30,1.5,1);
  let s=medium({y:270,upFill:GLASS,fo:.22,lowFo:0,upper:'ガラス',lower:'空気',g:1});
  s+=normal(...O,{up:240,down:230,text:'法線'})+rays({O,th1:30,n1:1.5,n2:1,la:290,lb:240,g:seg(p,0,.15)});
  s+=angMark(O,'in',30,{r:90,text:th(1),g:seg(p,.2,.35)})+angMark(O,'out',t2,{r:100,text:th(2),g:seg(p,.4,.55)});
  s+=fade(seg(p,.6,.75),label('法線から 離れる',780,460,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'next2']:(p,ctx)=>{
  const O=[560,270],a=mix(30,38,lin(p,.1,.8)),t2=refr(a,1.5,1);
  let s=medium({y:270,upFill:GLASS,fo:.22,lowFo:0,upper:'ガラス',lower:'空気'});
  s+=normal(...O,{up:240,down:230,text:'法線'})+rays({O,th1:a,n1:1.5,n2:1,la:290,lb:240});
  s+=angMark(O,'in',a,{r:90,text:th(1)});
  s+=card(800,60,380,100,label('もっと 大きく すると？',990,122,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'bye']:(p,ctx)=>card(300,170,600,140,label('深く学ぶ 3/3 へ',600,258,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
};
