// YouTube シリーズ「ローレンツ力・中級 1/2」(ys-um-magnetic-force-1) — 図。Stage 1200×515.
// 空間：x 右、y 奥（斜め右上に描く）、z 上（斜投影。外積・中級と同じ）。正面から見ると ŷ は ⊗（奥）、ẑ は上。
// 向きの検算：x̂×ŷ＝ẑ（上）。q＝−1 → −ẑ（下）。𝐯＝3sinθ x̂＋3cosθ ŷ、𝐁＝2ŷ → 𝐯×𝐁＝6sinθ ẑ。
//   導線：電子 𝐯＝−v x̂、q＝−e → (−e)(−v)(x̂×ŷ)B＝+evB ẑ（上）。
// 色：𝐯 紫、𝐁 橙、𝐄 水色、𝐅 緑、電流 I 緑、q 桃、正電荷 赤、電子 青、𝐯×𝐁 桃。x̂ 水色、ŷ 紫、ẑ 金。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly,fmt} from './anim.mjs';

const K='um-magnetic-force-1:';
const CV=C.v,CB=C.E,CE=C.x,CF=C.F,CI=C.F,CQ=C.p,PO=C.a,EL='#7fb3ff',CX=C.p,HX=C.x,HY=C.v,HZ=C.t,NG=C.a;
const RAD=Math.PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const TF=(s,x,y,maxW,size=40,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}'),bF=cs(CF,'\\mathbf{F}'),bE=cs(CE,'\\mathbf{E}'),qq=cs(CQ,'q'),aq=cs(CQ,'|q|');
const hx=cs(HX,'\\hat{x}'),hy=cs(HY,'\\hat{y}'),hz=cs(HZ,'\\hat{z}');
const LAW=`${bF}=${qq}\\,(${bE}+${bv}\\times${bB})`;
const MAG=`${bF}=${qq}\\,${bv}\\times${bB}`;
const SIZE=`F=${aq}\\,${cs(CV,'v')}\\,${cs(CB,'B')}\\sin\\theta`;
const xmark=(x,y,sz=16,color=NG)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});
const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
function outSym(x,y,r=22,color=CF,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#10182c'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=22,color=CB,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#10182c'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
function charge(x,y,sign=1,r=18,g=1){const c=sign>0?PO:EL;return fade(g,ring(x,y,r,{color:c,w:3,fill:sign>0?'#3a1d2a':'#1b2a48'})+label(sign>0?'＋':'−',x,y+r*.4,{size:r*1.15,color:c,anchor:'middle',weight:700}));}
function intoField(x0,y0,x1,y1,{step=80,g=1,r=10}={}){
 let s='';for(let x=x0;x<=x1+1;x+=step)for(let y=y0;y<=y1+1;y+=step){const d=r*.62;s+=ring(x,y,r,{color:CB,w:2})+line(x-d,y-d,x+d,y+d,{color:CB,w:2})+line(x-d,y+d,x+d,y-d,{color:CB,w:2});}
 return fade(g*.5,s);
}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function arc2(pts,{c1=CV,c2=CB,w=4,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2),[x1,y1]=pts[n-2],[x2,y2]=pts[n-1];
 const a=Math.atan2(y2-y1,x2-x1),L=14;
 const head=`<polygon points="${x2+Math.cos(a)*5},${y2+Math.sin(a)*5} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${c2}"/>`;
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head);
}

// ---- oblique 3D (外積・中級と同じ) ----
const KY=.55,AY=32*RAD;
function view({ox,oy,u}){return (x,y,z)=>[ox+u*(x+KY*Math.cos(AY)*y),oy-u*(z+KY*Math.sin(AY)*y)];}
const V3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return arrow(A[0],A[1],B[0],B[1],o);};
const L3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return line(A[0],A[1],B[0],B[1],o);};
function axes3(P,{xl=1.7,yl=2.1,zl=1.5,zn=1.2,g=1,names=true}={}){
 let s=L3(P,[-.35,0,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,-.5,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,0,-zn],[0,0,0],{color:C.faint,w:2,dash:'5 6'});
 s+=V3(P,[0,0,0],[xl,0,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,yl,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,0,zl],{color:C.dim,w:2.5,head:13});
 if(names){const X=P(xl,0,0),Y=P(0,yl,0),Z=P(0,0,zl);
  s+=label('x（右）',X[0]+10,X[1]+8,{size:24,color:HX,weight:700})+label('y（奥）',Y[0]+10,Y[1]-2,{size:24,color:HY,weight:700})+label('z（上）',Z[0]+14,Z[1]+10,{size:24,color:HZ,weight:700});}
 return fade(g,s);
}
function floor(P,{x0=-.6,x1=2,y0=-.6,y1=2.2,g=1}={}){return fade(g,poly([P(x0,y0,0),P(x1,y0,0),P(x1,y1,0),P(x0,y1,0)],{fill:'#1a2a48',fo:.55,stroke:C.grid,sw:2}));}
const PM=view({ox:250,oy:330,u:120}),PS=view({ox:190,oy:360,u:150});
// charge at origin; B along +y (field arrows); v in the floor at angle th from B (th=90°: +x); force along z
function scene3(P,{th=90,gv=1,gB=1,gF=0,q=1,Fmax=1.2,gX=0,perp=0,arcTh=0,comp=0,names=true,vlen=1.4,labF=''}={}){
 let s=floor(P)+axes3(P,{xl:2.1,yl:2.4,zl:1.7,zn:1.4,names});
 for(const [x,z] of [[-.6,.55],[-.6,-.45],[2.5,-.45],[2.5,.55]])s+=fade(gB*.85,V3(P,[x,-.4,z],[x,1.4,z],{color:CB,w:3,head:12}));
 s+=fade(gB,T(bB,P(2.5,1.4,.55)[0]+10,P(2.5,1.4,.55)[1]+6,{size:36,anchor:'start'}));
 const vx=vlen*Math.sin(th*RAD),vy=vlen*Math.cos(th*RAD);
 if(comp>0){
  s+=fade(comp,L3(P,[0,0,0],[0,vy,0],{color:HY,w:5,dash:'8 7'})+L3(P,[0,vy,0],[vx,vy,0],{color:C.faint,w:2,dash:'4 6'})
   +L3(P,[0,0,0],[vx,0,0],{color:HX,w:5,dash:'8 7'})+L3(P,[vx,0,0],[vx,vy,0],{color:C.faint,w:2,dash:'4 6'}));
 }
 if(arcTh>0&&th>3){const pts=Array.from({length:25},(_,i)=>{const a=th*RAD*i/24;return P(.55*Math.sin(a),.55*Math.cos(a),0);});
  s+=fade(arcTh,draw(pts,1,{color:C.hi,w:3})+label('θ',P(.72*Math.sin(th*RAD/2),.72*Math.cos(th*RAD/2),0)[0]+4,P(.72*Math.sin(th*RAD/2),.72*Math.cos(th*RAD/2),0)[1]+8,{size:28,color:C.hi,weight:700}));}
 if(gv>0)s+=V3(P,[0,0,0],[vx,vy,0],{color:CV,w:7,head:20,g:gv})+fade(gv,T(bv,P(vx,vy,0)[0]+(th>70?-6:th>20?26:22),P(vx,vy,0)[1]+(th>70?42:th>20?-6:4),{size:38}));
 if(gX>0){const h=Fmax*Math.sin(th*RAD);if(h>.05)s+=V3(P,[0,0,0],[0,0,h],{color:CX,w:7,head:20,g:gX})+fade(gX,T(`${bv}\\times${bB}`,P(0,0,h)[0]-18,P(0,0,h)[1]+10,{size:32,anchor:'end'}));}
 if(gF>0){const h=q*Fmax*Math.sin(th*RAD);if(Math.abs(h)>.05)s+=V3(P,[0,0,0],[0,0,h],{color:CF,w:8,head:22,g:gF})+fade(gF,T(labF||bF,P(0,0,h)[0]+20,P(0,0,h)[1]+(h>0?20:0),{size:36,anchor:'start'}));}
 if(perp>0){const k=.16;s+=fade(perp,draw([P(k,0,0),P(k,0,k),P(0,0,k)],1,{color:C.ink,w:2.5})+draw([P(0,k,0),P(0,k,k),P(0,0,k)],1,{color:C.ink,w:2.5}));}
 const O=P(0,0,0);s+=charge(O[0],O[1],q,17);
 return s;
}
function mini3(P,q,g){
 let s=V3(P,[0,0,0],[1.4,0,0],{color:CV,w:6,head:18})+V3(P,[-.5,-.3,.5],[-.5,1.3,.5],{color:CB,w:3,head:12})+V3(P,[-.5,-.3,-.5],[-.5,1.3,-.5],{color:CB,w:3,head:12})
  +T(bv,P(1.4,0,0)[0]+22,P(1.4,0,0)[1]+10,{size:32,anchor:'start'})+T(bB,P(-.5,-.3,-.5)[0]-10,P(-.5,-.3,-.5)[1]+10,{size:32,anchor:'end'});
 const d=q<0?-1:1;s+=fade(g,V3(P,[0,0,0],[0,0,1.5*d],{color:CF,w:8,head:22})+T(`${bF}=${d<0?'-':'+'}6\\,${hz}\\ \\mathrm{N}`,P(0,0,1.5*d)[0]+20,P(0,0,1.5*d)[1]+(d>0?20:0),{size:32,anchor:'start'}));
 const O=P(0,0,0);s+=charge(O[0],O[1],q,17);
 return s;
}
// front view: field into the screen, a charge with v and F
function frontCharge(x,y,{sign=1,gF=1,vl=100,fl=90,labs=true}={}){
 const d=sign>0?-1:1;
 let s=arrow(x,y,x+vl,y,{color:CV,w:6,head:18})+(labs?T(bv,x+vl+22,y+10,{size:34}):'');
 s+=fade(gF,arrow(x,y,x,y+d*fl,{color:CF,w:7,head:20})+(labs?T(bF,x-22,y+d*fl+(d<0?8:22),{size:34,anchor:'end'}):''));
 s+=charge(x,y,sign,18);
 return s;
}
function wire(x0,x1,y,{g=1,I=1,t=0,eG=1,eF=0,n=8}={}){
 let s=rect(x0,y-26,x1-x0,52,{fill:'#8795ad',fo:.14,stroke:C.dim,sw:2,rx:10});
 s+=fade(I,rect(x0+40,y+36,x1-x0-80,44,{fill:C.bg,fo:.9,stroke:'none',rx:8})+arrow(x0+60,y+58,x1-150,y+58,{color:CI,w:6,head:18})+label('電流 I',x1-140,y+67,{size:26,color:CI,weight:700}));
 for(let i=0;i<n;i++){const L=x1-x0-40,x=x1-20-((i*L/n+t*120)%L);
  s+=fade(eG,charge(x,y,-1,13)+arrow(x-16,y,x-50,y,{color:CV,w:3,head:10}));
  if(eF>0)s+=fade(eF,arrow(x,y-14,x,y-14-eF*50,{color:CF,w:4,head:12}));}
 return s;
}
function rows(list,p,{x=80,y=80,w=1040,h=100,gap=18,start=.02,step=.25,size=30}={}){
 let s='';list.forEach((r,i)=>{const yy=y+i*(h+gap);s+=card(x,yy,w,h,r(yy+h/2),seg(p,start+i*step,start+i*step+.12));});return s;
}

export const ytUmMagneticForce1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=wire(80,720,260,{t:p,I:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('電子の動き（電流と逆）',400,210,{size:24,color:EL,anchor:'middle'}));
  s+=card(780,110,380,280,T(`${cs(CI,'I')}=e\\,n\\,S\\,${cs(CV,'v')}`,970,200,{size:50})
   +fade(seg(p,.5,.65),label('電流 ＝ 動く電荷の',970,290,{size:28,color:C.ink,anchor:'middle',weight:700})+label('集まり',970,335,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'question']:(p)=>{
  let s=intoField(80,90,640,450,{g:seg(p,0,.2)});
  const x=mix(160,330,seg(p,.1,.6));
  s+=arrow(x,280,x+110,280,{color:CV,w:6})+T(bv,x+132,290,{size:34})+charge(x,280,1,18);
  s+=fade(seg(p,.4,.6),label('？',x,200,{size:48,color:CF,anchor:'middle',weight:700}));
  s+=fade(seg(p,0,.2),label('磁場の中（⊗：奥向き）',80,495,{size:24,color:CB}));
  s+=card(720,90,440,150,label('① どんな 力？',940,150,{size:32,color:C.hi,anchor:'middle',weight:700})+label('今回',940,205,{size:26,color:C.dim,anchor:'middle'}),seg(p,.3,.45),C.hi);
  s+=card(720,280,440,150,label('② どんな 軌道？',940,340,{size:32,color:C.hi,anchor:'middle',weight:700})+label('次回',940,395,{size:26,color:C.dim,anchor:'middle'}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(70,80,500,360,label('初級で見たこと',320,130,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.35),T(MAG,320,210,{size:46}))
   +fade(seg(p,.35,.5),label('向き：𝐯 → 𝐁 の右ねじ',320,295,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('速さは変えず、曲げる',320,370,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  s+=card(630,80,500,360,label('中級 1/2（今回）',880,130,{size:28,color:C.dim,anchor:'middle'})+label('外積の計算として読む',880,200,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'goal']:(p)=>{
  let s=card(70,80,500,360,label('初級で見たこと',320,130,{size:28,color:C.dim,anchor:'middle'})+T(MAG,320,210,{size:46})
   +label('向き：𝐯 → 𝐁 の右ねじ',320,295,{size:28,color:C.ink,anchor:'middle'})+label('速さは変えず、曲げる',320,370,{size:28,color:C.hi,anchor:'middle',weight:700}),.55);
  let r=label('中級 1/2（今回）',880,130,{size:28,color:C.dim,anchor:'middle'})+label('外積の計算として読む',880,200,{size:28,color:C.ink,anchor:'middle'});
  [['① 大きさ',.2],['② 向き',.35],['③ 単位',.5]].forEach(([t,a],i)=>{r+=fade(seg(p,a,a+.12),label(t,880,275+i*55,{size:32,color:C.hi,anchor:'middle',weight:700}));});
  s+=card(630,80,500,360,r,1,C.hi);
  return s;
 },
 // ===== S2 法則と、導く結果 =====
 [K+'full']:(p)=>{
  let s=fade(seg(p,0,.2),T(LAW,600,190,{size:66}));
  s+=fade(seg(p,.55,.7),label('ローレンツ力',600,320,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'terms']:(p)=>{
  let s=T(LAW,600,130,{size:54});
  const parts=[`${bF}=`,`${qq}\\,${bE}`,'+',`${qq}\\,${bv}\\times${bB}`],sz=56,gap=18;
  const ws=parts.map(t=>texWidth(t,sz,false)),tot=ws.reduce((a,b)=>a+b,0)+gap*3;let x=600-tot/2;const xs=[];
  for(const w of ws){xs.push(x);x+=w+gap;}
  s+=fade(seg(p,.05,.2),parts.map((t,i)=>T(t,xs[i],270,{size:sz,anchor:'start'})).join(''));
  const b1=[xs[1]-6,xs[1]+ws[1]+6],b2=[xs[3]-6,xs[3]+ws[3]+6];
  s+=fade(seg(p,.2,.35),rect(b1[0],300,b1[1]-b1[0],10,{fill:CE,fo:.8,stroke:CE,rx:4})+label('電場からの力',(b1[0]+b1[1])/2,355,{size:28,color:CE,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),rect(b2[0],300,b2[1]-b2[0],10,{fill:CB,fo:.8,stroke:CB,rx:4})+label('磁場からの力',(b2[0]+b2[1])/2,355,{size:28,color:CB,anchor:'middle',weight:700})
   +label('速度 𝐯 が入る',(b2[0]+b2[1])/2,405,{size:26,color:CV,anchor:'middle'}));
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(70,110,500,280,label('実験に支えられた 法則',320,165,{size:28,color:C.hi,anchor:'middle',weight:700})+TF(LAW,320,255,450,44)
   +fade(seg(p,.5,.65),label('出発点（導く式ではない）',320,340,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'derive']:(p)=>{
  let s=card(70,110,500,280,label('実験に支えられた 法則',320,165,{size:28,color:C.hi,anchor:'middle',weight:700})+TF(LAW,320,255,450,44)
   +label('出発点（導く式ではない）',320,340,{size:26,color:C.dim,anchor:'middle'}),1,C.hi);
  s+=fade(seg(p,.05,.2),arrow(585,250,655,250,{color:C.dim,w:4}));
  s+=card(670,110,470,280,label('読み取る・導く 結果',905,165,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),label('力の性質（今回）',905,235,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.2,.35),label('円の半径（次回）',905,290,{size:28,color:C.ink,anchor:'middle'})),seg(p,.05,.2));
  s+=fade(seg(p,.55,.7),T(`${bE}=0\\ \\Rightarrow\\ ${MAG}`,600,460,{size:40})+highlight(360,425,480,70,1,C.hi));
  return s;
 },
 [K+'axes']:(p)=>{
  const P=view({ox:230,oy:360,u:130});
  let s=floor(P,{x0:-.4,x1:2,y0:-.5,y1:2.2})+axes3(P,{xl:2.1,yl:2.4,zl:1.8,zn:.3});
  s+=fade(seg(p,.1,.25),V3(P,[0,0,0],[1,0,0],{color:HX,w:7,head:20})+V3(P,[0,0,0],[0,1,0],{color:HY,w:7,head:20})+V3(P,[0,0,0],[0,0,1],{color:HZ,w:7,head:20})
   +T(hx,P(1,0,0)[0]-4,P(1,0,0)[1]+42,{size:38})+T(hy,P(0,1,0)[0]+26,P(0,1,0)[1]+6,{size:38})+T(hz,P(0,0,1)[0]-26,P(0,0,1)[1]+14,{size:38}));
  let r=label('正面から 見ると',900,150,{size:28,color:C.dim,anchor:'middle'});
  const o=[900,300];
  r+=arrow(o[0],o[1],o[0]+110,o[1],{color:HX,w:6})+T(hx,o[0]+140,o[1]+10,{size:34})+arrow(o[0],o[1],o[0],o[1]-110,{color:HZ,w:6})+T(hz,o[0]-28,o[1]-110,{size:34})
   +inSym(o[0],o[1],22,HY)+T(hy,o[0]-50,o[1]+52,{size:34})+label('⊗ 奥向き',o[0]+20,o[1]+100,{size:26,color:HY,anchor:'middle',weight:700});
  s+=card(700,110,400,330,r,seg(p,.5,.65));
  return s;
 },
 // ===== S3 外積から読める3つ =====
 [K+'three']:(p)=>{
  const items=[['①','止まっている'],['②','𝐁 と 平行に動く'],['③','力の向き']];
  let s=label('外積の性質だけで 読める',600,110,{size:32,color:C.ink,anchor:'middle',weight:700});
  items.forEach(([a,b],i)=>{s+=card(90+i*350,170,320,200,label(a,250+i*350,240,{size:40,color:C.hi,anchor:'middle',weight:700})+label(b,250+i*350,310,{size:28,color:C.ink,anchor:'middle'}),seg(p,.1+i*.2,.25+i*.2));});
  return s;
 },
 [K+'rest']:(p)=>{
  let s=scene3(PM,{gv:0});
  s+=card(690,100,470,320,label('① 止まっている',925,160,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),T(`${bv}=0`,925,235,{size:44}))
   +fade(seg(p,.3,.45),T(`${bF}=${qq}\\,(0\\times${bB})=0`,925,310,{size:40}))
   +fade(seg(p,.6,.75),label('止まった電荷に 力なし',925,385,{size:28,color:C.F,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'parallel']:(p)=>{
  let s=scene3(PM,{th:0,gv:seg(p,0,.2)});
  s+=card(690,100,470,320,label('② 𝐁 と 平行',925,160,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),T(`\\sin 0^\\circ=0`,925,235,{size:42}))+fade(seg(p,.3,.45),label('力 0',925,300,{size:32,color:C.F,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),T(`${hy}\\times${hy}=0`,925,375,{size:40})),seg(p,0,.12));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=scene3(PM,{th:90,gF:seg(p,.3,.5),perp:seg(p,.55,.7)});
  s+=card(690,100,470,320,label('③ 力の向き',925,160,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),label('外積の答え：元の2本に 直角',925,225,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.7),T(`${bF}\\perp${bv},\\qquad ${bF}\\perp${bB}`,925,320,{size:42})),seg(p,0,.12));
  return s;
 },
 [K+'size']:(p)=>{
  let s=scene3(PM,{th:60,gv:1,gF:1,arcTh:seg(p,.3,.5),Fmax:1.3});
  s+=card(690,100,470,320,label('大きさ',925,160,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.2),T(SIZE,925,240,{size:48}))
   +fade(seg(p,.3,.45),label('θ：𝐯 と 𝐁 の間の角',925,315,{size:26,color:C.hi,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('|q|：電荷の大きさ（絶対値）',925,370,{size:26,color:CQ,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'example']:(p)=>{
  let s=scene3(PM,{th:90,gF:seg(p,.6,.8),Fmax:1.3,labF:`${bF}`});
  s+=card(690,90,470,350,label('例',925,140,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.18),T(`B=2\\ \\mathrm{T}`,925,195,{size:36,color:CB}))
   +fade(seg(p,.15,.28),T(`${qq}=1\\ \\mathrm{C},\\quad ${cs(CV,'v')}=3\\ \\mathrm{m/s}`,925,250,{size:36}))
   +fade(seg(p,.55,.7),TF(`F=1\\times3\\times2\\times\\sin 90^\\circ`,925,320,440,38))
   +fade(seg(p,.75,.88),T(`=6\\ \\mathrm{N}`,925,395,{size:46,color:CF})),seg(p,0,.1));
  return s;
 },
 [K+'dial']:(p)=>{
  const th=90*(p<.2?0:p<.4?seg(p,.2,.4)/3:p<.55?1/3:seg(p,.55,.8)*2/3+1/3);
  let s=scene3(PM,{th,gF:1,arcTh:1,Fmax:1.3});
  const F=6*Math.sin(th*RAD);
  let r=label('𝐯 を 回す',925,150,{size:28,color:C.dim,anchor:'middle'})+T(`F=6\\sin\\theta\\ \\ \\mathrm{N}`,925,215,{size:40});
  const bx=740,bw=370,by=300;
  r+=rect(bx,by,bw,26,{fill:'#0b1122',fo:1,stroke:C.faint,rx:8})+rect(bx,by,bw*F/6,26,{fill:CF,fo:.8,stroke:CF,rx:8});
  [[0,'0°'],[3,'30°'],[6,'90°']].forEach(([v,t])=>{const x=bx+bw*v/6;r+=line(x,by+32,x,by+44,{color:C.dim})+label(`${v} N`,x,by+72,{size:22,color:C.dim,anchor:'middle'})+label(t,x,by+100,{size:22,color:C.hi,anchor:'middle'});});
  r+=label(`θ ＝ ${Math.round(th)}°　F ＝ ${fmt(F,1)} N`,925,265,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=card(690,100,470,330,r,seg(p,0,.1));
  return s;
 },
 [K+'split']:(p)=>{
  const th=50;
  let s=scene3(PS,{th,gF:0,arcTh:1,comp:seg(p,.3,.55)});
  const vy=1.4*Math.cos(th*RAD),vx=1.4*Math.sin(th*RAD);
  s+=fade(seg(p,.45,.6),label('平行な部分',PS(0,vy,0)[0]-24,PS(0,vy,0)[1]-22,{size:24,color:HY,anchor:'end',weight:700})+label('直角な部分',PS(vx/2,0,0)[0],PS(vx/2,0,0)[1]+46,{size:24,color:HX,anchor:'middle',weight:700}));
  s+=card(720,100,440,320,label('成分に 分ける',940,160,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.35),T(`${bB}=2\\,${hy}`,940,225,{size:38}))
   +fade(seg(p,.4,.6),TF(`${bv}=3\\sin\\theta\\,${hx}+3\\cos\\theta\\,${hy}`,940,300,410,38))
   +fade(seg(p,.6,.75),label('直角な部分 ＋ 平行な部分',940,370,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'split2']:(p)=>{
  let s=card(80,80,1040,360,'',1);
  s+=TF(`${bv}\\times${bB}=6\\sin\\theta\\,(${hx}\\times${hy})+6\\cos\\theta\\,(${hy}\\times${hy})`,600,160,980,46);
  const w2=texWidth(`6\\cos\\theta\\,(${hy}\\times${hy})`,46,false);
  const wAll=Math.min(980,texWidth(`${bv}\\times${bB}=6\\sin\\theta\\,(${hx}\\times${hy})+6\\cos\\theta\\,(${hy}\\times${hy})`,46,false)),k=wAll/texWidth(`${bv}\\times${bB}=6\\sin\\theta\\,(${hx}\\times${hy})+6\\cos\\theta\\,(${hy}\\times${hy})`,46,false);
  const x1=600+wAll/2,x0=x1-w2*k;
  s+=fade(seg(p,.1,.25),line(x0,150,x1,150,{color:NG,w:4})+label('＝ 0（平行な部分は 消える）',(x0+x1)/2,225,{size:26,color:NG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),T(`=6\\sin\\theta\\,${hz}`,600,320,{size:54,color:C.ink}));
  s+=fade(seg(p,.7,.85),label('直角な部分だけが 力を作る',600,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'split3']:(p)=>{
  const th=50;
  let s=scene3(PS,{th,gF:0,gX:0,arcTh:1,comp:1});
  const vx=1.4*Math.sin(th*RAD),fz=1.3*Math.sin(th*RAD);
  s+=fade(seg(p,.05,.2),V3(PS,[0,0,0],[vx,0,0],{color:HX,w:7,head:18})+V3(PS,[0,0,0],[0,0,fz],{color:CF,w:8,head:22})+T(bF,PS(0,0,fz)[0]+20,PS(0,0,fz)[1]+20,{size:36,anchor:'start'}));
  s+=card(720,120,440,280,label('磁場が見るのは',940,180,{size:28,color:C.dim,anchor:'middle'})
   +label('自分に 直角な部分だけ',940,245,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('→ 次回の らせんで 使う',940,330,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.12),C.hi);
  return s;
 },
 // ===== S4 向きと電荷の符号 =====
 [K+'dir']:(p)=>{
  let s=scene3(PM,{th:90,gX:seg(p,.45,.65),Fmax:1.2});
  s+=card(690,100,470,320,label('θ ＝ 90° のとき',925,160,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.25),T(`${bv}=3\\,${hx},\\quad ${bB}=2\\,${hy}`,925,235,{size:38}))
   +fade(seg(p,.45,.6),T(`${bv}\\times${bB}=6\\,${hz}`,925,310,{size:44}))
   +fade(seg(p,.6,.75),label('上向き',925,380,{size:30,color:CX,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'sign']:(p)=>{
  const P1=view({ox:170,oy:280,u:85}),P2=view({ox:740,oy:280,u:85});
  let s=mini3(P1,1,seg(p,.05,.2))+label('正の電荷 q ＝ +1 C',300,490,{size:28,color:PO,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.5),mini3(P2,-1,seg(p,.45,.6))+label('負の電荷 q ＝ −1 C',870,490,{size:28,color:EL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.88),label('外積の回と 同じ',600,70,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=rows([
   y=>label('①',150,y+12,{size:36,color:C.hi,weight:700})+label('まず 外積',210,y+10,{size:30,color:C.ink})+T(`${bv}\\times${bB}`,720,y,{size:44}),
   y=>label('②',150,y+12,{size:36,color:C.hi,weight:700})+label('最後に q を 符号ごと 掛ける',210,y+10,{size:30,color:C.ink})+T(`${bF}=${qq}\\,(${bv}\\times${bB})`,880,y,{size:44}),
   y=>label('大きさ',150,y+10,{size:28,color:C.dim})+T(`${SIZE}\\ \\geq 0`,600,y,{size:44})+label('負にならない',1000,y+10,{size:26,color:CF,anchor:'middle',weight:700}),
  ],p,{y:80,h:110,step:.25});
  return s;
 },
 [K+'front']:(p)=>{
  let s=intoField(70,90,1130,400,{step:90});
  s+=fade(seg(p,0,.15),label('𝐁：奥向き（⊗）',80,60,{size:26,color:CB,weight:700}));
  s+=fade(seg(p,.2,.3),frontCharge(320,300,{sign:1,gF:seg(p,.3,.45),fl:120})+label('正の電荷：上',320,465,{size:28,color:PO,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.6),frontCharge(820,220,{sign:-1,gF:seg(p,.6,.75),fl:120})+label('電子：下',820,465,{size:28,color:EL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fleming']:(p)=>{
  let s=intoField(70,90,500,450,{step:90})+frontCharge(250,300,{sign:1,fl:120});
  let r=label('フレミングの左手',850,145,{size:30,color:C.ink,anchor:'middle',weight:700});
  [['親指','力 𝐅',CF],['人差し指','磁場 𝐁',CB],['中指','電流（正電荷の 𝐯）',CV]].forEach(([a,b,c],i)=>{r+=fade(seg(p,.15+i*.1,.25+i*.1),label(a,640,215+i*55,{size:28,color:C.dim})+label('→',790,215+i*55,{size:28,color:C.dim})+label(b,840,215+i*55,{size:28,color:c,weight:700}));});
  r+=fade(seg(p,.55,.7),label('向きを 指の形で 覚える道具',850,395,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(580,95,540,340,r,seg(p,0,.12));
  return s;
 },
 [K+'wire']:(p)=>{
  let s=intoField(70,90,1130,450,{step:90,g:.8});
  s+=wire(120,1080,280,{t:p,I:seg(p,.05,.2),eG:seg(p,.3,.45)});
  s+=fade(seg(p,.45,.6),rect(470,380,260,50,{fill:C.bg,fo:.9,stroke:'none',rx:8})+label('電子は 左へ 動く',600,415,{size:28,color:EL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wire2']:(p)=>{
  let s=intoField(70,90,1130,250,{step:90,g:.8});
  s+=wire(120,1080,190,{t:0,eF:seg(p,.6,.8)});
  s+=card(120,290,960,190,TF(`${bF}=(-e)\\,(-v\\,${hx})\\times(B\\,${hy})`,600,345,900,40)
   +fade(seg(p,.3,.45),label('符号が 2回 反転',330,425,{size:28,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),T(`=+e\\,v\\,B\\,${hz}`,820,420,{size:42,color:CF})+label('上向き',1010,432,{size:26,color:CF,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'wire3']:(p)=>{
  let s=intoField(70,90,1130,450,{step:90,g:.6});
  s+=wire(120,1080,300,{t:0,eF:1});
  s+=fade(seg(p,.3,.5),arrow(600,250,600,130,{color:CF,w:10,head:26})+label('導線全体の力 ＝ 電子の力の和',640,150,{size:28,color:CF,weight:700}));
  s+=fade(seg(p,.6,.75),rect(470,405,260,50,{fill:C.bg,fo:.9,stroke:'none',rx:8})+label('その式は 上級で',600,440,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ===== S5 単位 =====
 [K+'unitq']:(p)=>{
  let s=label('単位の確かめ',600,85,{size:28,color:C.dim,anchor:'middle'});
  s+=card(80,110,1040,110,T(`${aq}\\,${cs(CV,'v')}\\,${cs(CB,'B')}\\ :\\ \\ \\mathrm{C}\\times\\mathrm{m/s}\\times\\mathrm{T}`,600,165,{size:46}),seg(p,.1,.25));
  return s;
 },
 [K+'unitA']:(p)=>{
  let s=label('単位の確かめ',600,85,{size:28,color:C.dim,anchor:'middle'});
  s+=card(80,110,1040,110,T(`${aq}\\,${cs(CV,'v')}\\,${cs(CB,'B')}\\ :\\ \\ \\mathrm{C}\\times\\mathrm{m/s}\\times\\mathrm{T}`,600,165,{size:46}),1);
  s+=card(80,240,1040,110,T(`\\mathrm{C}\\times\\mathrm{m/s}=\\mathrm{C/s}\\times\\mathrm{m}`,420,295,{size:44})
   +fade(seg(p,.5,.65),T(`=\\mathrm{A\\cdot m}`,800,295,{size:46,color:CI})),seg(p,.05,.2));
  return s;
 },
 [K+'unitT']:(p)=>{
  let s=label('単位の確かめ',600,85,{size:28,color:C.dim,anchor:'middle'});
  s+=card(80,110,1040,110,T(`${aq}\\,${cs(CV,'v')}\\,${cs(CB,'B')}\\ :\\ \\ \\mathrm{C}\\times\\mathrm{m/s}\\times\\mathrm{T}`,600,165,{size:46}),.5);
  s+=card(80,240,1040,110,T(`\\mathrm{C}\\times\\mathrm{m/s}=\\mathrm{C/s}\\times\\mathrm{m}=\\mathrm{A\\cdot m}`,600,295,{size:44}),.5);
  const src=`\\mathrm{A\\cdot m}\\times\\dfrac{\\mathrm{N}}{\\mathrm{A\\cdot m}}=\\mathrm{N}`;
  s+=card(80,370,1040,130,T(src,600,440,{size:46}),seg(p,.05,.2),C.hi);
  const w=texWidth(src,46,false),x0=600-w/2;
  s+=fade(seg(p,.4,.55),line(x0,445,x0+85,425,{color:NG,w:4})+line(x0+150,480,x0+230,462,{color:NG,w:4}));
  return s;
 },
 [K+'unitRead']:(p)=>{
  let s=intoField(70,90,700,400,{step:90,g:.8});
  s+=rect(110,290,540,40,{fill:'#8795ad',fo:.14,stroke:C.dim,sw:2,rx:10});
  s+=fade(seg(p,.25,.4),arrow(150,360,610,360,{color:CI,w:6,head:18})+label('I ＝ 2 A',380,400,{size:28,color:CI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),line(110,445,650,445,{color:C.x,w:2})+line(110,435,110,455,{color:C.x,w:2})+line(650,435,650,455,{color:C.x,w:2})+label('長さ 3 m',380,485,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),arrow(380,280,380,150,{color:CF,w:9,head:24})+label('F ＝ 6 N',400,170,{size:30,color:CF,weight:700}));
  s+=card(760,110,390,280,label('A·m ＝',955,180,{size:32,color:C.ink,anchor:'middle',weight:700})+label('電流 × 長さ',955,240,{size:32,color:CI,anchor:'middle',weight:700}),seg(p,.02,.15));
  return s;
 },
 [K+'unitRead2']:(p)=>{
  let s=card(80,90,1040,360,'',1);
  s+=T(`B=\\dfrac{6\\ \\mathrm{N}}{2\\ \\mathrm{A}\\times3\\ \\mathrm{m}}`,330,200,{size:50,color:C.ink});
  s+=fade(seg(p,.2,.35),T(`=1\\ \\dfrac{\\mathrm{N}}{\\mathrm{A\\cdot m}}`,690,200,{size:50}));
  s+=fade(seg(p,.35,.5),T(`=1\\ \\mathrm{T}`,960,200,{size:54,color:CB})+highlight(880,160,170,80,1,CB));
  s+=fade(seg(p,.6,.75),label('1 N ではない',600,370,{size:36,color:NG,anchor:'middle',weight:700})+xmark(430,358,18));
  return s;
 },
 [K+'unitRead3']:(p)=>{
  let s=card(80,90,500,340,label('初級の例',330,145,{size:28,color:C.dim,anchor:'middle'})+T(`2\\ \\mathrm{C}\\times3\\ \\mathrm{m/s}`,330,220,{size:40})
   +T(`=6\\ \\mathrm{A\\cdot m}`,330,290,{size:42,color:CI})+label('力 6 N',330,370,{size:28,color:CF,anchor:'middle',weight:700}),seg(p,0,.12));
  s+=card(620,90,500,340,label('導線の例',870,145,{size:28,color:C.dim,anchor:'middle'})+T(`2\\ \\mathrm{A}\\times3\\ \\mathrm{m}`,870,220,{size:40})
   +T(`=6\\ \\mathrm{A\\cdot m}`,870,290,{size:42,color:CI})+label('力 6 N',870,370,{size:28,color:CF,anchor:'middle',weight:700}),seg(p,.1,.22));
  s+=fade(seg(p,.5,.65),label('どちらも B ＝ 1 T',600,480,{size:34,color:CB,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(80,90,1040,150,label('法則（実験）',140,175,{size:28,color:C.dim})+T(LAW,640,165,{size:50}),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.5,.65),label('磁場の部分 ＝ 外積',640,300,{size:32,color:CB,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=rows([
   y=>label('止まる → 0　　平行 → 0　　𝐅 ⊥ 𝐯、𝐅 ⊥ 𝐁',600,y+10,{size:30,color:C.ink,anchor:'middle',weight:700}),
   y=>label('大きさ',120,y+10,{size:28,color:C.dim})+T(SIZE,600,y,{size:44}),
   y=>label('向き',120,y+10,{size:28,color:C.dim})+label('𝐯×𝐁 に q の符号を掛ける',600,y+10,{size:30,color:C.ink,anchor:'middle',weight:700}),
  ],p,{y:80,h:100,step:.28});
  return s;
 },
 [K+'sum3']:(p)=>{
  let s=card(80,120,1040,240,T(`\\mathrm{C}\\times\\mathrm{m/s}\\times\\mathrm{T}=\\mathrm{N}`,600,200,{size:48})
   +fade(seg(p,.4,.55),T(`1\\ \\mathrm{T}=1\\ \\mathrm{N/(A\\cdot m)}`,600,300,{size:46,color:CB})),seg(p,0,.12));
  return s;
 },
 [K+'next']:(p)=>{
  const cx=330,cy=270,R=150;
  let s=intoField(70,90,620,450,{step:90,g:.8});
  s+=fade(seg(p,.3,.6),draw(circPts(cx,cy,R,-Math.PI/2,1.5*Math.PI,90),1,{color:C.dim,w:2.5,dash:'8 8'}));
  const x=cx,y=cy+R;
  s+=arrow(x,y,x+100,y,{color:CV,w:6})+T(bv,x+122,y+10,{size:32})+arrow(x,y,x,y-80,{color:CF,w:6})+T(bF,x-18,y-80,{size:32,anchor:'end'})+charge(x,y,1,15);
  s+=fade(seg(p,.4,.6),label('？',cx,cy+14,{size:52,color:C.hi,anchor:'middle',weight:700}));
  s+=card(680,110,460,280,label('次の問い',910,165,{size:26,color:C.dim,anchor:'middle'})+label('いつも 直角な力 →',910,230,{size:30,color:C.ink,anchor:'middle'})
   +label('どんな軌道？',910,290,{size:32,color:C.hi,anchor:'middle',weight:700})+label('半径は いくつ？',910,345,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.4),C.hi);
  return s;
 },
};
