// 問題編 解説「曲がった坂と、傾いた窓」（q-um-dot、大学編 06 内積・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/06_内積.md の q-um-dot（解説 17 行）。
// 画面の配置：左に3次元の図（斜めから見た投影）、右に説明の枠（式・表）。誤答カードは右の枠の下。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。設定の札は求めるものの札の下。札の帯（y＜78）には図を描かない。
// 色：力 𝐅 緑、移動 Δ𝐫 水色、影 黄、仕事 橙、磁場 𝐁 橙の濃い線、面 灰、法線 𝐧 白、負の値 赤。
// 図のために決めたもの：投影の向き、管の曲がり方（P と Q を通る曲線）、一歩の数 6、行10 の「場所で変わる力」の矢印、窓の縦横（1 m × 0.5 m）。
import {C,clamp,mix,seg,fade,move,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-um-dot:';
const FC=C.F,LC=C.x,WC=C.E,AL=C.hi,CD='#ff6b6b',BC='#e0892e',NC=C.ink,GR='#8a95a8';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}${s}}`;
const bF=cc(FC,'\\mathbf{F}'),bR=cc(LC,'\\Delta\\mathbf{r}'),bB=cc(BC,'\\mathbf{B}'),bA=cc(NC,'\\mathbf{A}'),bn=cc(NC,'\\mathbf{n}'),W_=cc(WC,'W'),PH=cc(WC,'\\Phi');
const dR=i=>cc(LC,`\\Delta\\mathbf{r}_${i}`);
const PX=640,PW=540,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1T='P→Q で 𝐅 がした仕事',G2T='始点と終点だけでよい理由',G3T='窓を貫く磁束 Φ';
const ANS1=g=>answerTag(1,'A','14 J',{g}),ANS2=g=>answerTag(2,'B','',{g}),ANS3=g=>answerTag(3,'D','0.2 Wb',{g});
function setTag(text,{g=1,x=10,y=74}={}){
 const w=text.length*24+30;
 return fade(g,rect(x,y,w,38,{fill:'#1a2438',fo:.95,stroke:C.dim,sw:2,rx:8})+label(text,x+15,y+27,{size:24,color:C.ink,weight:700}));
}

// ---- 投影（x：左手前、y：右、z：上）----
const EX=[-0.55,0.42],EY=[0.95,-0.18],EZ=[0,-1];
const mkV=(ox,oy,s)=>v=>[ox+s*(EX[0]*v[0]+EY[0]*v[1]+EZ[0]*v[2]),oy+s*(EX[1]*v[0]+EY[1]*v[1]+EZ[1]*v[2])];
const add=(a,b,k=1)=>a.map((x,i)=>x+k*b[i]);
const V1=mkV(170,400,80);                 // 設定(1)
const VP1=mkV(420,400,80);                // 設定(1)（問題アニメ：中央寄せ）
const Pp=[1,0,3],Qp=[4,4,1],Fv=[2,1,-2],DR=[3,4,-2],FS=.3;
const tube=t=>add(add(Pp,DR,t),add([-0.5,1.0,0.8].map(x=>x*Math.sin(Math.PI*t)),[0.6,0,-0.4].map(x=>x*Math.sin(2*Math.PI*t))));
const NS=6,TS=Array.from({length:NS+1},(_,i)=>i/NS);
function axes3(V,{g=1,L=[2.4,5.6,3.6],labs=1}={}){
 const o=V([0,0,0]);let s='';
 const ends=[[L[0],0,0],[0,L[1],0],[0,0,L[2]]],names=['x','y','z'];
 ends.forEach((e,i)=>{const p=V(e);s+=arrow(o[0],o[1],p[0],p[1],{color:C.faint,w:2,head:12});if(labs)s+=label(names[i],p[0]+(i===0?-18:10),p[1]+(i===0?18:i===2?-6:6),{size:24,color:C.dim,weight:700});});
 return fade(g,s);
}
// 軸の向きだけ（小さな3本の矢印）
function triad(cx,cy,{g=1,s=46}={}){
 const V=mkV(cx,cy,s),o=V([0,0,0]);let r='';
 [[1,0,0,'x'],[0,1,0,'y'],[0,0,1,'z']].forEach(([a,b,c,n])=>{const p=V([a,b,c]);r+=arrow(o[0],o[1],p[0],p[1],{color:C.dim,w:2.5,head:10})+label(n,p[0]+(n==='x'?-16:8),p[1]+(n==='x'?16:n==='z'?-4:6),{size:22,color:C.dim,weight:700});});
 return fade(g,r);
}
function tubePath(V,{g=1,p=1,w=12,dim=0}={}){
 const pts=Array.from({length:61},(_,i)=>V(tube(i/60)));
 return fade(g*(1-dim*.6),draw(pts,p,{color:'#4a5568',w:w+6})+draw(pts,p,{color:'#2b3446',w}));
}
function PQ(V,{g=1}={}){
 const P=V(Pp),Q=V(Qp);
 return fade(g,dot(P[0],P[1],7,C.ink)+dot(Q[0],Q[1],7,C.ink)+label('P(1, 0, 3)',P[0]-12,P[1]-16,{size:24,color:C.ink,anchor:'end',weight:700})+label('Q(4, 4, 1)',Q[0]+14,Q[1]+30,{size:24,color:C.ink,weight:700}));
}
const fArrow=(V,at,{g=1,color=FC,vec=Fv,k=FS}={})=>{const a=V(at),b=V(add(at,vec,k));return arrow(a[0],a[1],b[0],b[1],{color,g,w:5,head:14});};
function forces(V,{g=1,ts=[.12,.37,.62,.87],label1=1}={}){
 let s='';ts.forEach((t,i)=>{s+=fArrow(V,tube(t),{g});});
 const a=V(add(tube(.12),Fv,FS));
 return s+fade(g*label1,label('𝐅＝(2, 1, −2) N',a[0]-14,a[1]+10,{size:24,color:FC,anchor:'end',weight:700}));
}
function chords(V,{g=1,n=NS,F=0,lab=1,hi=-1,glow=0}={}){
 let s='';
 for(let i=0;i<Math.min(n,NS);i++){const a=V(tube(TS[i])),b=V(tube(TS[i+1]));
  if(glow&&i===hi)s+=arrow(a[0],a[1],b[0],b[1],{color:AL,w:10,head:20});
  s+=arrow(a[0],a[1],b[0],b[1],{color:LC,w:5,head:14});
  if(F)s+=fade(F,fArrow(V,tube(TS[i])));
  if(lab&&i<2){const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];s+=fade(lab,T(dR(i+1),m[0]-26,m[1]+(i===0?0:-8),26));}
 }
 return fade(g,s);
}
function straight(V,{g=1,lab=1,len=0}={}){
 const P=V(Pp),Q=V(Qp);
 return fade(g,arrow(P[0],P[1],Q[0],Q[1],{color:LC,w:8,head:22})+fade(lab,T(bR,(P[0]+Q[0])/2+30,(P[1]+Q[1])/2-6,32))
  +fade(len,label('直線 √29 ≈ 5.4 m',(P[0]+Q[0])/2+40,(P[1]+Q[1])/2+30,{size:24,color:LC,weight:700})));
}
// ---- 3×3 の表 ----
const TX=PX-40,THW=70,TCW=175,TY=92,THH=52,TRH=66;
const tX=j=>TX+THW+TCW*j,tY=i=>TY+THH+TRH*i;
function table3({g=1,off=0,vals=0,zneg=0}={}){
 let s=rect(TX,TY,THW+3*TCW,THH+3*TRH,{fill:'#0e1830',fo:.6,stroke:C.faint,sw:2,rx:10});
 s+=line(TX+THW,TY,TX+THW,TY+THH+3*TRH,{color:C.faint,w:2})+line(TX,TY+THH,TX+THW+3*TCW,TY+THH,{color:C.faint,w:2});
 const col=['3','4','-2'],row=['2','1','-2'],ax=['x','y','z'];
 for(let j=0;j<3;j++)s+=T(`${cc(LC,col[j])}\\,\\hat{${ax[j]}}`,tX(j)+TCW/2,TY+THH/2+6,28);
 for(let i=0;i<3;i++)s+=T(`${cc(FC,row[i])}\\,\\hat{${ax[i]}}`,TX+THW/2,tY(i)+TRH/2+6,28);
 const dv=['2\\times3=6','1\\times4=4',`(${cc(AL,'-')}2)\\times(${cc(AL,'-')}2)=4`];
 for(let i=0;i<3;i++)for(let j=0;j<3;j++){
  if(i===j){s+=fade(1-vals,T(`\\hat{${ax[i]}}\\cdot\\hat{${ax[j]}}=1`,tX(j)+TCW/2,tY(i)+TRH/2+6,24))+fade(vals,(()=>{const src=i===2&&zneg?dv[2]:dv[i].replaceAll(cc(AL,'-'),'-'),w=texWidth(src,24,false);return T(src,tX(j)+TCW/2,tY(i)+TRH/2+6,w>TCW-16?24*(TCW-16)/w:24);})());
   s+=rect(tX(j)+4,tY(i)+4,TCW-8,TRH-8,{fill:'none',fo:0,stroke:AL,sw:2.5,rx:8,opacity:clamp(off)});}
  else{s+=fade(1-off,T(`\\hat{${ax[i]}}\\cdot\\hat{${ax[j]}}=0`,tX(j)+TCW/2,tY(i)+TRH/2+6,24));
   s+=fade(off*(1-seg(off,.6,1))*.8,rect(tX(j)+4,tY(i)+4,TCW-8,TRH-8,{fill:C.faint,fo:.6,stroke:'none'}));}
 }
 return fade(g,s);
}
// ---- 設定(2)：窓 ----
const V2=mkV(330,330,220),VQ3=mkV(560,330,220);
const N=[0,0.6,0.8],U1=[1,0,0],U2=[0,0.8,-0.6],Bv=[0.2,0,0.5];
function windowPic(V,{g=1,win=1,nrm=1,along=1,field=1,labs=1,Aarr=0,shadow=0,red=0,bvec=0,glowN=0}={}){
 const O=[0,0,0],c=(a,b)=>V(add(add(O,U1,a),U2,b));let s='';
 const corners=[c(-.5,-.5),c(.5,-.5),c(.5,.5),c(-.5,.5)];
 if(field>0){for(const [a,b] of [[-.55,-.55],[.1,-.65],[.6,-.3],[-.6,.25],[.2,.15],[-.1,.7]]){const st=add(add(add(O,U1,a),U2,b),Bv,-1.1),en=add(st,Bv,2.2),p=V(st),q=V(en);
  s+=fade(field*.85,arrow(p[0],p[1],q[0],q[1],{color:BC,w:4,head:14}));}}
 s+=fade(win,poly(corners,{fill:'#7a8496',fo:.35,stroke:'#b9c2d0',sw:2.5}));
 if(along>0){const p=V(add(O,U2,-.7)),q=V(add(O,U2,.75));s+=fade(along,line(p[0],p[1],q[0],q[1],{color:GR,w:3,dash:'8 7'})+dot(q[0],q[1],5,GR));}
 if(nrm>0){const o=V(O),q=V(N);if(glowN)s+=fade(glowN,arrow(o[0],o[1],q[0],q[1],{color:AL,w:12,head:24}));s+=fade(nrm,arrow(o[0],o[1],q[0],q[1],{color:NC,w:5,head:18})+dot(o[0],o[1],5,NC));}
 if(Aarr>0){const o=V(O),q=V(add(O,N,.5));s+=fade(Aarr,arrow(o[0],o[1],q[0],q[1],{color:NC,w:11,head:24}));}
 if(bvec>0){const o=V(O),q=V(Bv);s+=fade(bvec,arrow(o[0],o[1],q[0],q[1],{color:BC,w:7,head:20})+label('𝐁',q[0]-14,q[1]-8,{size:28,color:BC,anchor:'end',weight:700}));}
 if(shadow>0){const o=V(O),f=V(add(O,N,.4)),q=V(Bv);
  s+=fade(shadow,line(q[0],q[1],f[0],f[1],{color:AL,w:2,dash:'5 5'})+line(o[0],o[1],f[0],f[1],{color:AL,w:10,cap:'butt'})+label('影 0.4',f[0]+14,f[1]+8,{size:26,color:AL,weight:700}));}
 if(red>0){const o=V(O),f=V(add(O,U2,-.3)),q=V(Bv);
  s+=fade(red,line(q[0],q[1],f[0],f[1],{color:CD,w:2,dash:'5 5'})+line(o[0],o[1],f[0],f[1],{color:CD,w:10,cap:'butt'})+label('影 −0.3',f[0]-10,f[1]-24,{size:26,color:CD,anchor:'end',weight:700}));}
 if(labs>0){const q=V(N),a=V(add(O,U2,.75)),w=c(.5,.5);
  s+=fade(labs*nrm,label('𝐧＝(0, 0.6, 0.8)',q[0]-16,q[1]+22,{size:24,color:NC,anchor:'end',weight:700}));
  s+=fade(labs*along,label('窓に沿う向き (0, 0.8, −0.6)',a[0]+12,a[1]+30,{size:22,color:GR,weight:700}));
  const o=V(O),lw=c(.5,-.5);
  s+=fade(labs*win,label('面積 0.5 m²',lw[0]-14,lw[1]+8,{size:24,color:'#c9d2e0',anchor:'end',weight:700}));
  s+=fade(labs*field,label('𝐁＝(0.2, 0, 0.5) T',o[0]+150,o[1]+178,{size:24,color:BC,weight:700}));}
 return fade(g,s);
}
// 分配法則の小さな図：𝐅 の向きの直線に、Δ𝐫₁ と Δ𝐫₂ の影がつながる
function distrib(x0,y0,{g=1}={}){
 const L=[x0,y0],ang=0,ux=Math.cos(ang),uy=Math.sin(ang);
 const a=[110,-70],b=[120,40],pa=a[0]*ux+a[1]*uy,pb=b[0]*ux+b[1]*uy;
 const P=(t)=>[L[0]+t*ux,L[1]+t*uy];
 let s=line(L[0]-20*ux,L[1]-20*uy,L[0]+300*ux,L[1]+300*uy,{color:FC,w:2,dash:'7 6'})+label('𝐅 の 向き',L[0]+300*ux+8,L[1]+300*uy+8,{size:22,color:FC,weight:700});
 const o=[L[0],L[1]-80],A=[o[0]+a[0],o[1]+a[1]],B=[A[0]+b[0],A[1]+b[1]];
 const foot=q=>{const t=(q[0]-L[0])*ux+(q[1]-L[1])*uy;return P(t);};
 s+=arrow(o[0],o[1],A[0],A[1],{color:LC,w:4,head:12})+arrow(A[0],A[1],B[0],B[1],{color:LC,w:4,head:12});
 const fo=foot(o),fA=foot(A),fB=foot(B);
 s+=line(o[0],o[1],fo[0],fo[1],{color:C.dim,w:1.5,dash:'4 5'})+line(A[0],A[1],fA[0],fA[1],{color:C.dim,w:1.5,dash:'4 5'})+line(B[0],B[1],fB[0],fB[1],{color:C.dim,w:1.5,dash:'4 5'});
 s+=line(fo[0],fo[1]+0,fA[0],fA[1],{color:AL,w:8,cap:'butt'})+line(fA[0],fA[1],fB[0],fB[1],{color:'#c9a640',w:8,cap:'butt'});
 s+=T(dR(1),(o[0]+A[0])/2-22,(o[1]+A[1])/2,22)+T(dR(2),(A[0]+B[0])/2+24,(A[1]+B[1])/2-4,22);
 s+=label('影 ＋ 影 ＝ 和の 影',(fo[0]+fB[0])/2,fB[1]+34,{size:22,color:AL,anchor:'middle',weight:700});
 return fade(g,s);
}
const FAC1=`${W_}=${bF}\\cdot${dR(1)}+${bF}\\cdot${dR(2)}+\\cdots`;
const FAC1y=`${W_}=${cc(AL,'\\mathbf{F}')}\\cdot${dR(1)}+${cc(AL,'\\mathbf{F}')}\\cdot${dR(2)}+\\cdots`;
const FAC2=`${W_}=${bF}\\cdot(${dR(1)}+${dR(2)}+\\cdots)`;
const scene1=(V,o={})=>axes3(V)+tubePath(V,o)+PQ(V);

export const ytQxUmDotDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（設定(1)、約7秒）：0〜2 s 軸と設定の札、2〜5 s 管・P・Q、玉が P から Q へ、「管の長さ 7 m」、5〜7 s 管の上の数か所に同じ 𝐅。静止。
 [K+'q1']:(p)=>{
  const V=VP1;let s=setTag('設定(1)：曲がった管',{g:seg(p,.05,.2),x:40,y:20})+axes3(V,{g:seg(p,0,.22)});
  s+=tubePath(V,{p:seg(p,.29,.5)})+PQ(V,{g:seg(p,.45,.55)});
  const u=seg(p,.52,.7),b=V(tube(u));
  if(p>.5)s+=ring(b[0],b[1],10,{color:C.dim,w:3,fill:'#5a6478'});
  const m=V(tube(.5));s+=fade(seg(p,.62,.7),label('管の長さ 7 m',m[0]+24,m[1]-24,{size:26,color:C.ink,weight:700}));
  s+=forces(V,{g:seg(p,.72,.88),label1:seg(p,.85,.95)});
  return s;
 },
 // 小問3（設定(2)、約6秒）：0〜1 s 設定(1) を暗転して消す（軸の向きだけ残す）、1〜2 s 設定(2) の札、2〜4 s 窓・𝐧・窓に沿う点線、4〜6 s 𝐁。静止。
 [K+'q3']:(p)=>{
  const out=1-seg(p,0,.15);let s='';
  if(out>0)s+=fade(out,setTag('設定(1)：曲がった管',{x:40,y:20})+scene1(VP1)+forces(VP1));
  s+=triad(110,460,{g:seg(p,.12,.2)});
  s+=setTag('設定(2)：窓（設定(1) とは別の場面）',{g:seg(p,.18,.3),x:40,y:20});
  s+=windowPic(VQ3,{win:seg(p,.34,.45),nrm:seg(p,.45,.55),along:seg(p,.52,.62),field:seg(p,.68,.85),labs:1});
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 設定(1) の静止画。左上に設定の札、その上に求めるもの
 [K+'goal1']:(p)=>{
  let s=scene1(V1)+forces(V1,{label1:0})+(()=>{const m=V1(tube(.5));return label('管の長さ 7 m',m[0]+24,m[1]-24,{size:24,color:C.ink,weight:700});})();
  s+=panel(130,200,label('P(1, 0, 3) → Q(4, 4, 1)',PC,180,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('𝐅＝(2, 1, −2) N（一定）',PC,235,{size:28,color:FC,anchor:'middle',weight:700})+label('管の 長さ 7 m',PC,290,{size:28,color:C.dim,anchor:'middle'}),seg(p,.1,.25));
  return s+setTag('設定(1)：曲がった管')+goalTag(G1T,{g:seg(p,.03,.15)});
 },
 // 2. 管を短い一歩 Δ𝐫ᵢ に分け、各一歩の根元に同じ 𝐅。下に 𝐅·Δ𝐫₁＋𝐅·Δ𝐫₂＋…
 [K+'steps']:(p)=>{
  const n=Math.floor(clamp((p-.05)/.4)*NS+.001);
  let s=axes3(V1)+tubePath(V1,{dim:seg(p,.05,.15)})+PQ(V1)+chords(V1,{n,F:seg(p,.45,.55)});
  s+=panel(130,150,fade(seg(p,.5,.65),T(FAC1,PC,205,36)),1);
  return s+setTag('設定(1)：曲がった管')+goalTag(G1T);
 },
 // 3. 各項の 𝐅 を黄で光らせ、一つにまとめてかっこの外へ
 [K+'factor']:(p)=>{
  let s=axes3(V1)+tubePath(V1,{dim:1})+PQ(V1)+chords(V1,{F:1});
  const y1=seg(p,.1,.25)*(1-seg(p,.55,.65));
  s+=panel(130,220,fade(1-seg(p,.55,.65),T(FAC1,PC,195,36))+fade(y1,T(FAC1y,PC,195,36))
   +fade(seg(p,.4,.55),arrow(PC,225,PC,255,{color:C.dim,w:3,head:12})+label('くくり出す',PC+20,250,{size:24,color:AL,weight:700}))
   +fade(seg(p,.55,.7),T(FAC2,PC,300,38)),1);
  return s+setTag('設定(1)：曲がった管')+goalTag(G1T);
 },
 // 4. 短い矢印が順につながり、P から Q への1本の Δ𝐫 になる。(4−1, 4−0, 1−3)＝(3, 4, −2)
 [K+'join']:(p)=>{
  const k=Math.floor(clamp((p-.05)/.35)*NS+.001);
  let s=axes3(V1)+tubePath(V1,{dim:1})+PQ(V1)+chords(V1,{lab:0,hi:k,glow:p<.42?1:0,g:1-seg(p,.42,.5)*.7})+straight(V1,{g:seg(p,.42,.55)});
  s+=panel(130,220,T(FAC2,PC,185,34)
   +fade(seg(p,.45,.6),T(`${dR(1)}+${dR(2)}+\\cdots=${bR}`,PC,255,34))
   +fade(seg(p,.6,.75),T(`=(4-1,\\,4-0,\\,1-3)=(3,\\,4,\\,-2)`,PC,320,30)),1);
  return s+setTag('設定(1)：曲がった管')+goalTag(G1T);
 },
 // 5a. 3×3 の表。対角線以外が灰になって消え、対角線に 6・4・4。z の2つの負号を黄。6＋4＋4＝14 J
 [K+'table']:(p)=>{
  const V=mkV(150,415,52);
  let s=axes3(V,{L:[2,5.6,3.6]})+straight(V,{lab:1})+fArrow(V,Pp,{k:.6})+label('𝐅',V(add(Pp,Fv,.6))[0]+12,V(add(Pp,Fv,.6))[1],{size:26,color:FC,weight:700});
  s+=T(`${bF}=(2,\\,1,\\,-2)`,260,150,28)+T(`${bR}=(3,\\,4,\\,-2)`,260,195,28);
  s+=table3({off:seg(p,.12,.3),vals:seg(p,.3,.55),zneg:seg(p,.5,.6)>0?1:0});
  s+=fade(seg(p,.62,.8),T(`${bF}\\cdot${bR}=6+4+4=${cc(WC,'14\\ \\mathrm{J}')}`,TX+(THW+3*TCW)/2,TY+THH+3*TRH+56,34));
  return s+setTag('設定(1)：曲がった管')+goalTag(G1T);
 },
 // 5b. 小問1 の答え A
 [K+'ans1']:(p)=>{
  const V=mkV(150,415,52);
  let s=axes3(V,{L:[2,5.6,3.6]})+straight(V,{lab:1})+fArrow(V,Pp,{k:.6})+label('𝐅',V(add(Pp,Fv,.6))[0]+12,V(add(Pp,Fv,.6))[1],{size:26,color:FC,weight:700});
  s+=T(`${bF}=(2,\\,1,\\,-2)`,260,150,28)+T(`${bR}=(3,\\,4,\\,-2)`,260,195,28);
  s+=table3({off:1,vals:1,zneg:1})+T(`${bF}\\cdot${bR}=6+4+4=${cc(WC,'14\\ \\mathrm{J}')}`,TX+(THW+3*TCW)/2,TY+THH+3*TRH+56,34);
  return s+setTag('設定(1)：曲がった管')+goalTag(G1T)+ANS1(seg(p,.05,.15));
 },
 // 6. 誤答 B（21 J）。管に沿った短い矢印の向きが一歩ごとに変わる様子を一瞬
 [K+'wrongB']:(p,ctx)=>{
  const k=Math.floor(clamp((p-.1)/.5)*NS*1.0)%NS;
  let s=axes3(V1)+tubePath(V1,{dim:1})+PQ(V1)+chords(V1,{lab:0,hi:k,glow:p>.1&&p<.6?1:0});
  s+=panel(96,110,T(`${W_}=${bF}\\cdot${bR}=${cc(WC,'14\\ \\mathrm{J}')}`,PC,155,36),1);
  s+=wrongCard('B','21 J',['3 N × 管の長さ 7 m','道の 向きは 一歩ごとに 変わる'],{...WOPT,y:226,g:seg(p,.02,.08)});
  return s+setTag('設定(1)：曲がった管')+goalTag(G1T)+ANS1(1);
 },
 // 7. 誤答 C（約 16.2 J）→ D（6 J）
 [K+'wrongCD']:(p,ctx)=>{
  let s=axes3(V1)+tubePath(V1,{dim:1})+PQ(V1)+straight(V1,{lab:1})+fArrow(V1,Pp,{k:.5});
  s+=panel(96,110,T(`${W_}=${bF}\\cdot${bR}=${cc(WC,'14\\ \\mathrm{J}')}`,PC,155,36),1);
  s+=wrongSeq(p,ctx,[['C','約 16.2 J',['3×√29','cosθ を 掛けていない']],['D','6 J','(−2)×(−2) を −4 と した']],{opts:{...WOPT,y:226}});
  return s+setTag('設定(1)：曲がった管')+goalTag(G1T)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 8. くくり出しの式を再表示
 [K+'goal2']:(p)=>{
  let s=axes3(V1)+tubePath(V1,{dim:1})+PQ(V1)+chords(V1,{F:1,lab:1});
  s+=panel(130,170,label('一歩ごとの 和 → くくり出し',PC,175,{size:24,color:C.dim,anchor:'middle'})+T(FAC2,PC,245,38),seg(p,.1,.25));
  return s+setTag('設定(1)：曲がった管')+goalTag(G2T,{g:seg(p,.03,.15)});
 },
 // 9. くくり出しの式に黄の枠。「どの一歩も 𝐅 が同じ」。分配法則の小さな図。「B です」で答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=axes3(V1,{g:.5})+tubePath(V1,{dim:1})+PQ(V1)+chords(V1,{F:1,lab:0});
  const w=texWidth(FAC2,36,false);
  s+=panel(96,400,T(FAC2,PC,140,36)+highlight(PC-w/2-12,104,w+24,70,seg(p,.05,.15))
   +fade(seg(p,.15,.25),label('どの 一歩も 𝐅 が 同じ',PC,205,{size:26,color:AL,anchor:'middle',weight:700}))
   +fade(seg(p,.3,.45),distrib(PX+70,440)),1);
  return s+setTag('設定(1)：曲がった管')+goalTag(G2T)+ANS2(seg(p,b,b+.08));
 },
 // 10. 誤答 A（点検 PQ-002 で2 cue に）。1文目でカード「どんな力でも、とは 言えない」。
 //   10b. 管の各一歩に、向きも長さも違う緑の矢印 → くくり出しの式に赤の × → 「中級の例 𝐅＝(0, x)：道で 仕事が 変わる」。
 [K+'wrongA2']:(p)=>{
  let s=axes3(V1)+tubePath(V1,{dim:1})+PQ(V1)+chords(V1,{lab:0});
  s+=panel(96,110,T(FAC2,PC,155,34),1);
  s+=wrongCard('A','どんな力でも',['どんな力でも、とは 言えない'],{...WOPT,y:226,g:seg(p,.03,.1)});
  return s+setTag('設定(1)：曲がった管')+goalTag(G2T)+ANS2(1);
 },
 [K+'wrongA2b']:(p,ctx)=>{
  const W=sentWin(ctx),[a,b]=W[0]??[0,1],ve=voiceEnd(ctx);
  // 読みの「、」で区切った3つの句の始まり（力が場所で…／中級の…／道で…）
  const parts=((ctx?.cue?.reading??'').split('。')[0]??'').split('、').map(x=>x.replace(/\s/g,'').length);
  const tot=parts.reduce((x,y)=>x+y,0)||1;const st=[];let acc=0;for(const n of parts){st.push(a+(b-a)*acc/tot);acc+=n;}
  const c2=st[1]??.4,c3=st[2]??.6;
  let s=axes3(V1)+tubePath(V1,{dim:1})+PQ(V1)+chords(V1,{lab:0});
  const vs=[[0,1.5,-1],[1.5,0,1],[-1,1,-1.8],[2,-1,0],[0,-1,2],[1,2,0.5]];
  for(let i=0;i<NS;i++)s+=fade(seg(p,.03+i*.025,.07+i*.025),fArrow(V1,tube(TS[i]),{vec:vs[i],k:.35}));
  const w=texWidth(FAC2,34,false),xg=seg(p,c2-.1,c2-.04);
  s+=panel(96,110,T(FAC2,PC,155,34)+fade(xg,line(PC-w/2,125,PC+w/2,185,{color:CD,w:5})+line(PC-w/2,185,PC+w/2,125,{color:CD,w:5})),1);
  s+=wrongCard('A','どんな力でも',['どんな力でも、とは 言えない'],{...WOPT,y:226,g:1});
  const eg=seg(p,c2,c2+.05),dg=seg(p,c3,c3+.05);
  s+=fade(eg,panel(350,140,label('中級の 例',PC,392,{size:24,color:C.dim,anchor:'middle'})
   +T(`${bF}=(0,\ x)`,PC,432,34)
   +fade(dg,label('道で 仕事が 変わる',PC,476,{size:26,color:AL,anchor:'middle',weight:700})),1));
  return s+setTag('設定(1)：曲がった管')+goalTag(G2T)+ANS2(1);
 },
 // 11. 誤答 C → D。D のとき、管と直線の Δ𝐫 に長さの札
 [K+'wrongCD2']:(p,ctx)=>{
  const W=sentWin(ctx),ve=voiceEnd(ctx),h=ve*.42,inD=seg(p,h,h+.05);
  let s=axes3(V1)+tubePath(V1,{dim:1-inD})+PQ(V1)+straight(V1,{lab:1,len:inD,g:.4+.6*inD})+fArrow(V1,Pp,{k:.5,g:1-inD});
  const m=V1(tube(.5));s+=fade(inD,label('管 7 m',m[0]+24,m[1]-24,{size:26,color:C.ink,weight:700}));
  s+=panel(96,110,T(`${W_}=${bF}\\cdot${bR}=${cc(WC,'14\\ \\mathrm{J}')}`,PC,155,36),1);
  s+=wrongSeq(p,ctx,[['C','力が 管と 直角',['直角なら 0','実際は 14 J']],['D','長さが 等しい','管 7 m ≠ 直線 √29≈5.4 m']],{win:[[0,h],[h,1]],opts:{...WOPT,y:226}});
  return s+setTag('設定(1)：曲がった管')+goalTag(G2T)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 12. 暗転して設定(2) へ。軸の向きだけ残し、窓・𝐧・窓に沿う点線・𝐁
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,on=seg(p,.12,.25);
  let s=triad(90,470,{g:seg(p,.05,.15)});
  s+=setTag('設定(2)：窓（設定(1) とは別の場面）',{g:on});
  s+=windowPic(V2,{g:on});
  s+=panel(130,150,label('小問3',PC,180,{size:26,color:C.dim,anchor:'middle'})+label('窓を 貫く 磁束 Φ は？',PC,235,{size:30,color:AL,anchor:'middle',weight:700}),seg(p,b,b+.1),AL);
  return s+goalTag(G3T,{g:seg(p,b,b+.08)});
 },
 // 13. 法線 𝐧 を光らせ、𝐀＝0.5𝐧（白の太い矢印）と札。そのあと Φ＝𝐁·𝐀
 [K+'flux']:(p)=>{
  let s=triad(90,470)+setTag('設定(2)：窓（設定(1) とは別の場面）');
  s+=windowPic(V2,{glowN:seg(p,.05,.15)*(1-seg(p,.4,.5)),Aarr:seg(p,.35,.5),labs:1});
  s+=panel(130,230,label('法線の 向きの 成分で 数える',PC,175,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.35,.5),label('𝐀：向き ＝ 法線、長さ ＝ 面積 0.5',PC,230,{size:26,color:NC,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),T(`${PH}=${bB}\\cdot${bA}`,PC,310,46)),1);
  return s+goalTag(G3T);
 },
 // 14. 𝐁 を法線の直線に落とした影（黄）0.4。0.2×0＋0×0.6＋0.5×0.8＝0.4 T
 [K+'shadowB']:(p)=>{
  let s=triad(90,470)+setTag('設定(2)：窓（設定(1) とは別の場面）');
  s+=windowPic(V2,{field:.35,labs:0,along:.5,bvec:seg(p,.05,.15),shadow:seg(p,.2,.4)});
  s+=panel(130,230,T(`${bB}\\cdot${bn}`,PC,180,40)
   +fade(seg(p,.3,.5),T(`=0.2\\times0+0\\times0.6+0.5\\times0.8`,PC,250,30))
   +fade(seg(p,.55,.7),T(`=${cc(AL,'0.4')}\\ \\mathrm{T}`,PC,315,38)),1);
  return s+goalTag(G3T);
 },
 // 15. Φ＝𝐁·𝐀＝0.4×0.5＝0.2 Wb。「D です」で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=triad(90,470)+setTag('設定(2)：窓（設定(1) とは別の場面）');
  s+=windowPic(V2,{field:.35,labs:0,along:.5,bvec:1,shadow:1,Aarr:seg(p,.05,.15)});
  s+=panel(130,230,T(`${PH}=${bB}\\cdot${bA}`,PC,180,40)
   +fade(seg(p,.15,.35),T(`=${cc(AL,'0.4')}\\times0.5`,PC,250,38))
   +fade(seg(p,.4,b),T(`=${cc(WC,'0.2\\ \\mathrm{Wb}')}`,PC,320,42)),1);
  return s+goalTag(G3T)+ANS3(seg(p,b,b+.08));
 },
 // 16. 誤答 A（約 0.27 Wb）。𝐁 全体と黄の影の長さを並べる
 [K+'wrongA3']:(p)=>{
  let s=triad(90,470)+setTag('設定(2)：窓（設定(1) とは別の場面）');
  s+=windowPic(V2,{field:.35,labs:0,along:.5,bvec:1,shadow:1});
  const x0=PX+150,y0=130;
  s+=panel(96,120,label('|𝐁| ≈ 0.54',PX+30,y0+12,{size:24,color:BC,weight:700})+line(x0+60,y0+4,x0+60+0.54*400,y0+4,{color:BC,w:12,cap:'butt'})
   +label('影 0.4',PX+30,y0+62,{size:24,color:AL,weight:700})+line(x0+60,y0+54,x0+60+0.4*400,y0+54,{color:AL,w:12,cap:'butt'}),seg(p,.05,.15));
  s+=wrongCard('A','約 0.27 Wb',['|𝐁|≈0.54 T × 0.5','法線との 角を 考えていない'],{...WOPT,y:236,g:seg(p,.02,.08)});
  return s+goalTag(G3T)+ANS3(1);
 },
 // 17. 誤答 B（0.35 Wb）→ C（−0.15 Wb）。C のとき窓に沿う向きへの影（赤）−0.3。最後に二つの場面を左右に並べて静止
 [K+'wrongBC3']:(p,ctx)=>{
  const W=sentWin(ctx),ve=voiceEnd(ctx),h=ve*.38,end=Math.min(1,ve+.02),inC=seg(p,h,h+.05),fin=seg(p,end,end+.06),mid=1-fin;
  let s=fade(mid,triad(90,470)+setTag('設定(2)：窓（設定(1) とは別の場面）')+windowPic(V2,{field:.35,labs:inC,nrm:1,along:.5+.5*inC,bvec:1,shadow:1-inC,red:inC}));
  s+=fade(mid,panel(96,110,T(`${PH}=${bB}\\cdot${bA}=${cc(WC,'0.2\\ \\mathrm{Wb}')}`,PC,155,36),1));
  s+=fade(mid,wrongSeq(p,ctx,[['B','0.35 Wb',['(0.2＋0.5)×0.5','法線の 成分を 掛けていない']],['C','−0.15 Wb','窓に 沿う 向きとの 内積']],{win:[[0,h],[h,end]],keepLast:false,opts:{...WOPT,y:226}}));
  if(fin>0){
   const VL=mkV(150,380,44),VR=mkV(860,300,160);
   let f=axes3(VL,{L:[2,5.6,3.6],labs:0})+tubePath(VL,{w:8})+straight(VL,{lab:0})+fArrow(VL,Pp,{k:.6});
   f+=label('設定(1)',40,110,{size:24,color:C.dim,weight:700})+T(`${bF}\\cdot${bR}=${cc(WC,'14\\ \\mathrm{J}')}`,300,438,34);
   f+=line(600,96,600,455,{color:C.faint,w:3});
   f+=label('設定(2)',640,110,{size:24,color:C.dim,weight:700})+windowPic(VR,{labs:0,field:.3,along:0,bvec:1,shadow:1,Aarr:1})+T(`${bB}\\cdot${bA}=${cc(WC,'0.2\\ \\mathrm{Wb}')}`,900,438,34);
   f+=rect(330,462,540,46,{fill:AL,fo:.10,stroke:AL,sw:2.5,rx:12})+label('どちらも「黄の 影 × 長さ」',600,494,{size:26,color:AL,anchor:'middle',weight:700});
   s+=fade(fin,f+answerRow([[1,'A','14 J'],[2,'B',''],[3,'D','0.2 Wb']]));
  }
  return s+goalTag(G3T,{g:mid})+ANS3(mid);
 },
};
