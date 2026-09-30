// YouTube シリーズ「電磁誘導・中級 1/3」(ys-um-induction-1) — 図。Stage 1200×515.
// 色：𝐄 水色(C.x)、𝐁 橙(C.E)、誘導の磁場 赤、電流 I 緑(C.F)、起電力 ℰ 紫(C.v)、磁束 Φ 黄(C.hi)、法線 桃(C.p)、面積 Δ𝐀・一歩 d𝐫・時間 t 金(C.t)、負・誤り 赤(C.a)。
// 真上から見た図：⊙＝画面の手前向き。画面上の回り方（時計回り／反時計回り）は、手前から見た回り方そのもの。
// 向き（検算済み）：反時計回りにたどる → 法線 ⊙（右手）。⊙ の磁束が増える → ∮𝐄·d𝐫＜0 → 𝐄 は時計回り → 電流も時計回り → 中に ⊗。
// 部品（関数・定数）は export して 2/3・3/3 でも使う（関数・定数の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,highlight} from './anim.mjs';

const K='um-induction-1:';
export const CE=C.x,CB=C.E,CI=C.F,EMF=C.v,PHI=C.hi,NC=C.p,DA=C.t,IND='#ff6b6b',NEG=C.a,SURF='#c9d6ee',MEM='#7f93b8';
export const RAD=Math.PI/180;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const n2=v=>Number(v.toFixed(2));
export const L=(s,x,y,o={})=>label(s,x,y,{size:28,color:C.ink,...o});
export const LB=(s,x,y,o={})=>label(s,x,y,{size:28,color:C.ink,weight:700,...o});
// TeX pieces
export const vE=cs(CE,'\\mathbf{E}'),dr=cs(DA,'d\\mathbf{r}'),EM=cs(EMF,'\\mathcal{E}'),PH=cs(PHI,'\\Phi'),tt=cs(C.t,'t'),vB=cs(CB,'\\mathbf{B}');
export const DPHI=`\\dfrac{d${PH}}{d${tt}}`;
export const OE=`\\oint_C ${vE}\\cdot${dr}`;
export const LAW=`${OE}=-${DPHI}`;

// ---- symbols -----------------------------------------------------------------------------------------
export function head(x,y,dx,dy,{color=CI,L:Lh=18}={}){
 const m=Math.hypot(dx,dy)||1,ux=dx/m,uy=dy/m,bx=x-Lh*ux,by=y-Lh*uy;
 return `<polygon points="${n2(x)},${n2(y)} ${n2(bx-Lh*.5*uy)},${n2(by+Lh*.5*ux)} ${n2(bx+Lh*.5*uy)},${n2(by-Lh*.5*ux)}" fill="${color}"/>`;
}
export function outSym(x,y,r=16,color=CB,g=1){return fade(g,ring(x,y,r,{color,w:3.5,fill:'#101a30'})+dot(x,y,r*.3,color));}
export function inSym(x,y,r=16,color=CB,g=1){const d=r*.6;return fade(g,ring(x,y,r,{color,w:3.5,fill:'#101a30'})+line(x-d,y-d,x+d,y+d,{color,w:3.5})+line(x-d,y+d,x+d,y-d,{color,w:3.5}));}
export const sym=(kind,x,y,r,color,g=1)=>kind==='out'?outSym(x,y,r,color,g):inSym(x,y,r,color,g);
// circle with arrowheads; sense +1 = counter-clockwise on screen, −1 = clockwise.
export function circ(cx,cy,R,sense=1,{g=1,color=C.ink,w=3.5,nh=4,phase=45,Lh=18,dash=''}={}){
 if(g<=0)return '';
 let s=ring(cx,cy,R,{color,w,dash});
 if(sense)for(let i=0;i<nh;i++){const t=(phase+360*i/nh)*RAD;const x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);s+=head(x,y,-Math.sin(t)*sense,-Math.cos(t)*sense,{color,L:Lh});}
 return fade(g,s);
}
// tangent arrows around a circle (induced 𝐄 or current). sense +1 ccw, −1 cw. prog draws them one by one.
export function ringArrows(cx,cy,R,sense,{g=1,color=CE,n=8,len=46,w=4.5,hd=14,phase=22.5,prog=1}={}){
 let s='';
 for(let i=0;i<n;i++){const t=(phase+360*i/n)*RAD,x=cx+R*Math.cos(t),y=cy-R*Math.sin(t),dx=-Math.sin(t)*sense*len/2,dy=-Math.cos(t)*sense*len/2;
  s+=fade(clamp(prog*n-i),arrow(x-dx,y-dy,x+dx,y+dy,{color,w,head:hd}));}
 return fade(g,s);
}
// grid of ⊙/⊗ symbols filling a disc
export function fieldDisc(cx,cy,R,{kind='out',g=1,r=13,color=CB,step=62,grow=1}={}){
 let s='';
 for(let x=-R;x<=R;x+=step)for(let y=-R;y<=R;y+=step){if(Math.hypot(x,y)>R-8)continue;s+=sym(kind,cx+x,cy+y,r*grow,color);}
 return fade(g,s);
}
export function arcPts(cx,cy,rx,ry,a0,a1,n=40){return Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+rx*Math.cos(a),cy-ry*Math.sin(a)];});}
export function plusCharge(x,y,r=15){return ring(x,y,r,{color:'#ff6b6b',w:3,fill:'#3a1d2a'})+label('＋',x,y+6,{size:20,color:'#ff6b6b',anchor:'middle',weight:700});}
// simple axes with mapping. returns {s,X,Y}
export function graph(x0,y0,w,h,{tmax=.2,fmin=0,fmax=.05,tt:tks=[],ft=[],xl='t［s］',yl='Φ［Wb］',g=1,ycol=PHI}={}){
 const X=t=>x0+w*t/tmax,Y=f=>y0-h*(f-fmin)/(fmax-fmin);
 let s=arrow(x0-6,Y(0),x0+w+22,Y(0),{color:C.dim,w:2.5,head:12})+arrow(x0,y0+6,x0,y0-h-22,{color:C.dim,w:2.5,head:12});
 s+=label(xl,x0+w+24,Y(0)+32,{size:22,color:C.t,anchor:'middle'})+label(yl,x0,y0-h-32,{size:22,color:ycol,anchor:'middle'});
 for(const [t,txt] of tks)s+=line(X(t),Y(0)-5,X(t),Y(0)+5,{color:C.dim})+label(txt,X(t),Y(0)+28,{size:22,color:C.t,anchor:'middle'});
 for(const [f,txt] of ft)s+=line(x0-5,Y(f),x0+5,Y(f),{color:C.dim})+label(txt,x0-10,Y(f)+7,{size:22,color:ycol,anchor:'end'});
 return {s:fade(g,s),X,Y};
}
// side view of a coil (edge-on ellipse) with a bar magnet below; u 0 far … 1 near
export function sideCoil({cx=300,cy=190,rx=140,ry=32,u=.5,g=1,cur=0,curG=0,fieldG=1}={}){
 let s='';
 const my=mix(390,cy+70,u);
 s+=draw(arcPts(cx,cy,rx,ry,0,180),1,{color:CI,w:5,opacity:.6});
 [-90,-45,0,45,90].forEach(dx=>{const Lf=mix(50,120,u),x0=cx+dx,xt=cx+dx*(1-.12*u),y0=my-14,y1=my-14-Lf-(my-cy)*.5;s+=fade(fieldG*mix(.35,1,u),arrow(x0,y0,xt,y1,{color:CB,w:4,head:14}));});
 s+=draw(arcPts(cx,cy,rx,ry,180,360),1,{color:CI,w:6});
 if(cur&&curG>0){// cur −1: clockwise seen from above → front (screen-lower) part runs to the LEFT, back part to the right
  const d=cur<0?-1:1;s+=fade(curG,head(cx+d*20,cy+ry,d,0,{color:CI,L:24})+head(cx-d*20,cy-ry,-d,0,{color:CI,L:20}));
 }
 s+=rect(cx-32,my,64,56,{fill:'#e05252',fo:.9,stroke:'#e05252',rx:4})+label('N',cx,my+39,{size:28,color:C.bg,anchor:'middle',weight:700});
 s+=rect(cx-32,my+56,64,56,{fill:'#4f7fe0',fo:.9,stroke:'#4f7fe0',rx:4})+label('S',cx,my+95,{size:28,color:C.bg,anchor:'middle',weight:700});
 return fade(g,s);
}
// potential-height profile along the loop. kind: 'hill' | 'battery' | 'down'
function profile({kind='hill',g=1,q=0,qG=0,parts=0,x0=90,y0=400,w=520,h=250}={}){
 let pts;
 if(kind==='hill')pts=Array.from({length:61},(_,i)=>{const u=i/60;return [x0+w*u,y0-h*.8*Math.sin(Math.PI*u)**1.3];});
 else if(kind==='battery')pts=[[x0,y0],[x0+40,y0],[x0+40,y0-h*.8],...Array.from({length:41},(_,i)=>{const u=i/40;return [x0+40+(w-40)*u,y0-h*.8*(1-u)];})];
 else pts=Array.from({length:41},(_,i)=>{const u=i/40;return [x0+w*u,y0-h*(.85-.7*u)];});
 let s=line(x0-20,y0+2,x0+w+30,y0+2,{color:C.faint,w:2});
 s+=arrow(x0-30,y0+20,x0-30,y0-h-10,{color:C.dim,w:2.5,head:12})+label('電位（高さ）',x0-10,y0-h-24,{size:22,color:EMF});
 if(kind==='hill'&&parts>0){
  const up=pts.slice(0,31),dn=pts.slice(30);
  s+=fade(parts,draw(up,1,{color:NEG,w:9,opacity:.55})+draw(dn,1,{color:PHI,w:9,opacity:.55})
   +label('上り：電場に 逆らう',x0+w*.24,y0-h*.9,{size:24,color:NEG,anchor:'middle',weight:700})+label('下り：電場に 押される',x0+w*.8,y0-h*.9,{size:24,color:PHI,anchor:'middle',weight:700}));
 }
 s+=draw(pts,1,{color:EMF,w:5});
 if(kind==='down')s+=label('?',x0+w+14,y0-h*.15,{size:34,color:NEG,weight:700});
 s+=dot(pts[0][0],pts[0][1],7,C.ink)+label('A',pts[0][0],pts[0][1]+34,{size:26,color:C.ink,anchor:'middle',weight:700});
 const e=pts.at(-1);s+=dot(e[0],e[1],7,C.ink)+label(kind==='down'?'A（一周後）':'A（戻った）',e[0],e[1]+34,{size:24,color:C.ink,anchor:'middle',weight:700});
 if(qG>0){const k=Math.min(pts.length-1,Math.floor(q*(pts.length-1)));s+=fade(qG,plusCharge(pts[k][0],pts[k][1]-18,14));}
 return fade(g,s);
}

// ---- top view: loop C with field region -----------------------------------------------------------
export const TV={x:300,y:258};
// the "induced field" picture: disc of ⊙ growing, cyan 𝐄 circulating clockwise
function inducedPic({g=1,grow=1,eG=1,eProg=1,loopG=0,stepsG=0,cx=TV.x,cy=TV.y}={}){
 let s=ring(cx,cy,118,{color:C.faint,w:2,dash:'6 7'});
 s+=fieldDisc(cx,cy,118,{kind:'out',r:mix(9,15,grow),step:58});
 s+=fade(clamp(grow*1.5),label('𝐁（手前向き）が 増える',40,50,{size:24,color:CB,weight:700}));
 if(loopG>0)s+=fade(loopG,ring(cx,cy,185,{color:C.ink,w:3}))+fade(loopG,label('C',cx+140,cy-150,{size:30,color:C.ink,weight:700}));
 if(stepsG>0){for(let i=0;i<12;i++){const a=(90-30*i)*RAD,b=(90-30*(i+1))*RAD;s+=fade(stepsG,arrow(cx+185*Math.cos(a)*.99,cy-185*Math.sin(a)*.99,cx+185*Math.cos(b)*.99,cy-185*Math.sin(b)*.99,{color:DA,w:4,head:12}));}}
 s+=ringArrows(cx,cy,loopG>0?212:185,-1,{g:eG,prog:eProg,n:8,len:50});
 return fade(g,s);
}
// right-hand rule, oblique: loop in a horizontal plane (ellipse), ccw seen from above, normal up
function obliqueRule(cx,cy,{g=1,nG=1}={}){
 const rx=150,ry=46;let s='';
 s+=draw(arcPts(cx,cy,rx,ry,0,180),1,{color:DA,w:4,opacity:.55});
 s+=fade(nG,arrow(cx,cy+4,cx,cy-190,{color:NC,w:6,head:20})+label('親指 ＝ 法線',cx+16,cy-170,{size:26,color:NC,weight:700}));
 s+=draw(arcPts(cx,cy,rx,ry,180,360),1,{color:DA,w:4});
 // ccw seen from above: front (screen-lower) part runs to the right
 s+=head(cx+18,cy+ry,1,0,{color:DA,L:20})+fade(.7,head(cx-18,cy-ry,-1,0,{color:DA,L:18}));
 s+=label('4本の指 ＝ たどる向き',cx,cy+ry+48,{size:26,color:DA,anchor:'middle',weight:700});
 s+=label('上から見て 反時計回り',cx,cy+ry+84,{size:22,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
// horizontal extent of a sub-part of a centred TeX formula: returns [x0, x1] of `mid` in `pre+mid+post`
export function texSpan(pre,mid,post,x,size){const W=texWidth(pre+mid+post,size,false),a=pre?texWidth(pre,size,false):0,b=texWidth(pre+mid,size,false);const left=x-W/2;return [left+a,left+b];}
function phiRow(x,y,txt,col){return label(txt,x,y,{size:26,color:col,anchor:'middle',weight:700});}

export const ytUmInduction1Diagrams={
 // ===== S1 前回の問い =====
 [K+'intro']:(p)=>{
  let s=fade(seg(p,0,.15),label('前回の 最後の問い',60,50,{size:24,color:C.dim}));
  s+=circ(TV.x,TV.y,170,0,{g:seg(p,.05,.3),color:C.ink});
  s+=fade(seg(p,.05,.3),label('C',TV.x+130,TV.y-140,{size:30,color:C.ink,weight:700}));
  s+=ringArrows(TV.x,TV.y,170,-1,{g:seg(p,.15,.4),prog:seg(p,.2,.6)});
  s+=card(640,110,520,270,T(`${OE}`,900,190,{size:46})+label('＝ 0 に ならないのは',900,270,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.7),label('どんなとき？',900,330,{size:34,color:PHI,anchor:'middle',weight:700})),seg(p,.1,.3),PHI);
  return s;
 },
 [K+'recapB']:(p)=>{
  let s=label('アンペールの法則・中級',60,50,{size:24,color:C.dim});
  s+=circ(TV.x,TV.y,95,1,{g:seg(p,.05,.3),color:CB,nh:3,phase:60})+circ(TV.x,TV.y,165,1,{g:seg(p,.1,.35)*.8,color:CB,nh:4,phase:20});
  s+=outSym(TV.x,TV.y,20,CI)+label('I',TV.x+26,TV.y-22,{size:28,color:CI,weight:700});
  s+=card(640,90,520,300,T(`\\oint_C ${vB}\\cdot${dr}=\\mu_0${cs(CI,'I')}`,900,175,{size:44})+fade(seg(p,.45,.6),arrow(900,215,900,265,{color:C.dim,w:3,head:12})+T(`${cs(CB,'B')}=\\dfrac{\\mu_0${cs(CI,'I')}}{2\\pi r}`,900,330,{size:44})),seg(p,.1,.3));
  return s;
 },
 [K+'recapE']:(p)=>{
  let s=label('電位・中級',60,50,{size:24,color:C.dim});
  // static field: arrows away from a + charge, and a closed loop beside it
  const qx=190,qy=260;s+=plusCharge(qx,qy,18);
  for(let k=0;k<8;k++){const t=k*45*RAD;s+=fade(seg(p,.05,.3),arrow(qx+34*Math.cos(t),qy-34*Math.sin(t),qx+100*Math.cos(t),qy-100*Math.sin(t),{color:CE,w:3.5,head:12}));}
  s+=fade(seg(p,.2,.45),draw(arcPts(420,250,120,95,0,360,80),1,{color:C.ink,w:3.5})+head(420+120*Math.cos(90*RAD)+0,250-95,-1,0,{color:C.ink,L:18})+label('C',545,180,{size:30,color:C.ink,weight:700}));
  s+=card(680,110,470,260,label('電荷が 止まっている',915,170,{size:26,color:C.dim,anchor:'middle'})+label('静電場',915,215,{size:30,color:CE,anchor:'middle',weight:700})+fade(seg(p,.5,.7),T(`${OE}=0`,915,300,{size:46})),seg(p,.3,.5));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(90,110,480,260,label('静電場',330,175,{size:30,color:CE,anchor:'middle',weight:700})+T(`${OE}=0`,330,265,{size:44}),seg(p,.02,.2));
  s+=card(630,110,480,260,label('今回',870,175,{size:30,color:PHI,anchor:'middle',weight:700})+T(`${OE}\\neq 0`,870,255,{size:44})+fade(seg(p,.45,.65),label('→ 起電力 ℰ',870,330,{size:32,color:EMF,anchor:'middle',weight:700})),seg(p,.2,.4),PHI);
  return s;
 },
 // ===== S2 一周で 0 になる電場・ならない電場 =====
 [K+'slope']:(p)=>{
  let s=profile({kind:'hill',g:seg(p,0,.2),q:seg(p,.3,.9),qG:seg(p,.25,.35)});
  s+=card(720,120,440,230,label('静電場（山の比喩）',940,180,{size:26,color:C.dim,anchor:'middle'})+label('坂を 上って 下り',940,240,{size:30,color:C.ink,anchor:'middle',weight:700})+label('元の場所に 戻る',940,295,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.15,.3));
  return s;
 },
 [K+'slope2']:(p)=>{
  let s=profile({kind:'hill',parts:seg(p,.05,.35),q:1,qG:1});
  s+=card(720,120,440,230,label('高さが 元に戻る',940,185,{size:28,color:C.ink,anchor:'middle'})+label('電場の 仕事',940,250,{size:28,color:C.ink,anchor:'middle'})+label('差し引き 0',940,305,{size:34,color:PHI,anchor:'middle',weight:700}),seg(p,.45,.65),PHI);
  return s;
 },
 [K+'battery']:(p)=>{
  let s=profile({kind:'battery',g:1,q:seg(p,.3,.9),qG:seg(p,.25,.35)});
  s+=fade(seg(p,.15,.35),arrow(165,395,165,215,{color:EMF,w:6,head:18})+label('電池',180,300,{size:26,color:EMF,weight:700}));
  s+=card(720,120,440,230,label('坂を 上らせる',940,185,{size:30,color:C.ink,anchor:'middle',weight:700})+label('別の はたらき',940,240,{size:30,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.55,.75),label('電池：中の 化学反応',940,305,{size:26,color:EMF,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'magnet']:(p)=>{
  let s=label('初級 27',60,50,{size:24,color:C.dim});
  s+=sideCoil({u:mix(.1,.85,seg(p,.1,.7)),cur:-1,curG:seg(p,.35,.5)});
  s+=fade(seg(p,.1,.3),arrow(410,400,410,300,{color:C.ink,w:4,head:14})+label('近づける',425,355,{size:24,color:C.ink}));
  s+=card(720,120,440,230,label('電池は ない',940,190,{size:30,color:C.dim,anchor:'middle'})+fade(seg(p,.45,.65),label('それでも',940,250,{size:26,color:C.ink,anchor:'middle'})+label('輪に 電流が 流れる',940,300,{size:30,color:CI,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'induced']:(p)=>{
  let s=inducedPic({grow:seg(p,.05,.9),eG:seg(p,.3,.45),eProg:seg(p,.3,.7)});
  s+=card(680,120,470,240,label('電荷が なくても',915,185,{size:26,color:C.dim,anchor:'middle'})+label('ぐるりと 回る 電場',915,245,{size:30,color:CE,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('＝ 誘導電場',915,310,{size:32,color:CE,anchor:'middle',weight:700})),seg(p,.35,.5));
  return s;
 },
 [K+'induced2']:(p)=>{
  let s=inducedPic({grow:1,loopG:seg(p,0,.15),stepsG:seg(p,.12,.3)});
  // zoom: one step and 𝐄 parallel
  s+=card(680,70,470,380,label('どの 一歩でも',915,120,{size:26,color:C.dim,anchor:'middle'})
   +arrow(800,175,1030,175,{color:CE,w:5,head:16})+T(vE,1045,165,{size:34,anchor:'start'})
   +arrow(800,215,1030,215,{color:DA,w:5,head:16})+T(dr,1045,227,{size:34,anchor:'start'})
   +fade(seg(p,.4,.55),T(`${vE}\\cdot${dr}>0`,915,285,{size:36}))
   +fade(seg(p,.65,.8),T(`${OE}\\neq0`,915,385,{size:36})),seg(p,.2,.35));
  return s;
 },
 [K+'noslope']:(p)=>{
  let s=profile({kind:'down',g:seg(p,0,.2),q:seg(p,.2,.8),qG:seg(p,.15,.25)});
  s+=fade(seg(p,.5,.65),line(610,150,610,380,{color:NEG,w:3,dash:'7 6'})+label('同じ場所なのに 高さが違う',560,110,{size:24,color:NEG,anchor:'middle',weight:700}));
  s+=card(720,140,440,200,label('下り続けて 戻る坂',940,215,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ ない',940,280,{size:32,color:NEG,anchor:'middle',weight:700}),seg(p,.3,.45),NEG);
  return s;
 },
 [K+'nopot']:(p)=>{
  let s=inducedPic({grow:1,loopG:1});
  s+=fade(seg(p,.1,.3),dot(TV.x,TV.y-185,8,C.ink)+label('V ＝ ？',TV.x,TV.y-150,{size:26,color:EMF,anchor:'middle',weight:700}));
  s+=card(680,110,470,270,label('場所ごとに 一つの 電位',915,180,{size:28,color:C.ink,anchor:'middle'})+label('置けない',915,235,{size:32,color:NEG,anchor:'middle',weight:700})+fade(seg(p,.5,.7),label('静電場 ではない',915,320,{size:32,color:CE,anchor:'middle',weight:700})),seg(p,.15,.35));
  return s;
 },
 // ===== S3 一周の和＝起電力 =====
 [K+'emf']:(p)=>{
  let s=inducedPic({grow:1,loopG:1,g:1});
  const a=(90+360*seg(p,.1,.9)*-1)*RAD;s+=plusCharge(TV.x+185*Math.cos(a),TV.y-185*Math.sin(a),16);
  s+=card(680,100,470,300,label('1 C が 一周する 間に',915,160,{size:26,color:C.ink,anchor:'middle'})+label('電場から 受け取る 仕事',915,205,{size:28,color:C.ink,anchor:'middle',weight:700})+T(OE,915,280,{size:40})
   +fade(seg(p,.55,.7),label('単位 J/C ＝ V',915,360,{size:30,color:EMF,anchor:'middle',weight:700})),seg(p,.15,.3));
  return s;
 },
 [K+'emfname']:(p)=>{
  let s=T(`${EM}=${OE}`,600,190,{size:66});
  s+=fade(seg(p,.1,.3),label('起電力（単位 V）',600,300,{size:34,color:EMF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.65),label('初級：1 C が 一周で 受け取る エネルギー',600,380,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'vs']:(p)=>{
  let s=card(60,60,520,400,label('電位差',320,110,{size:32,color:EMF,anchor:'middle',weight:700})
   +dot(190,250,9,C.ink)+label('A',170,245,{size:28,color:C.ink,anchor:'end',weight:700})+dot(450,250,9,C.ink)+label('B',470,245,{size:28,color:C.ink,weight:700})
   +draw(arcPts(320,250,130,70,180,0,40),1,{color:DA,w:3.5})+head(452,248,.2,1,{color:DA,L:14})
   +T(`V(\\mathrm{B})-V(\\mathrm{A})`,320,360,{size:34,color:EMF})
   +fade(seg(p,.5,.7),draw(arcPts(320,250,130,70,0,-180,40),1,{color:DA,w:3.5,dash:'8 6'})+label('A に 戻れば 0',320,420,{size:28,color:PHI,anchor:'middle',weight:700})),seg(p,.02,.2));
  return s;
 },
 [K+'vs2']:(p)=>{
  let s=card(60,60,520,400,label('電位差',320,110,{size:32,color:EMF,anchor:'middle',weight:700})+label('2点の 値の差',320,190,{size:28,color:C.ink,anchor:'middle'})+label('一周で 0',320,260,{size:30,color:PHI,anchor:'middle',weight:700}),1);
  const cx=880,cy=270,R=110;
  let inner=label('起電力 ℰ',880,110,{size:32,color:EMF,anchor:'middle',weight:700})+ringArrows(cx,cy,R,-1,{n:6,len:44})+ring(cx,cy,R,{color:C.ink,w:3});
  const laps=seg(p,.2,.95)*3,a=(90-360*laps)*RAD;inner+=plusCharge(cx+R*Math.cos(a),cy-R*Math.sin(a),14);
  const k=Math.floor(laps+1e-6);inner+=label(`${k} 周：${k===0?'0':k===1?'ℰ':k+'ℰ'}`,880,430,{size:30,color:EMF,anchor:'middle',weight:700});
  s+=card(620,40,520,420,inner,seg(p,.02,.2));
  s+=fade(seg(p,.3,.45),label('閉じた道の 全体で 決まる',880,495,{size:26,color:EMF,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fixed']:(p)=>{
  let s=circ(TV.x,TV.y,170,0,{color:C.ink,w:4});
  for(const t of [45,135,225,315]){const x=TV.x+170*Math.cos(t*RAD),y=TV.y-170*Math.sin(t*RAD);s+=fade(seg(p,.1,.3),ring(x,y,10,{color:C.dim,w:3,fill:'#24324e'})+line(x-7,y-7,x+7,y+7,{color:C.dim,w:2}));}
  s+=fade(seg(p,.15,.35),label('固定',TV.x,TV.y+10,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=card(680,130,470,220,label('今回：輪は 固定',915,200,{size:30,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.45,.65),label('導線が 動く場合 → 3本目',915,275,{size:28,color:C.dim,anchor:'middle'})),seg(p,.2,.35));
  return s;
 },
 // ===== S4 ファラデーの法則 =====
 [K+'law0']:(p)=>{
  const cx=300,cy=300,rx=190,ry=60;let s='';
  const n=Math.round(mix(3,7,seg(p,.2,.9)));
  const xs=[-120,-60,0,60,120,-90,90].slice(0,n);
  s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${MEM}" fill-opacity="${n2(.22*seg(p,.05,.25))}" stroke="none"/>`;
  xs.forEach((dx,i)=>{s+=fade(i<3?1:seg(p,.2+.1*(i-3),.3+.1*(i-3)),line(cx+dx,cy+100,cx+dx,cy+(i%2?10:-5),{color:CB,w:4,opacity:.5}));});
  s+=draw(arcPts(cx,cy,rx,ry,0,360,80),1,{color:C.ink,w:4})+label('C',cx+rx+14,cy-10,{size:30,color:C.ink,weight:700});
  xs.forEach((dx,i)=>{s+=fade(i<3?1:seg(p,.2+.1*(i-3),.3+.1*(i-3)),arrow(cx+dx,cy+(i%2?10:-5),cx+dx,cy-150,{color:CB,w:4,head:14}));});
  s+=fade(seg(p,.05,.25),label('C を縁とする面',cx,cy+135,{size:24,color:SURF,anchor:'middle'}));
  s+=card(680,110,470,260,label('一周の和を 決めるのは',915,170,{size:26,color:C.dim,anchor:'middle'})+label('面を 貫く 磁束 Φ の',915,235,{size:30,color:PHI,anchor:'middle',weight:700})+label('変化率',915,295,{size:34,color:PHI,anchor:'middle',weight:700}),seg(p,.35,.5),PHI);
  return s;
 },
 [K+'law']:(p)=>{
  let s=T(LAW,600,170,{size:70});
  s+=fade(seg(p,.1,.3),label('一周の和',470,300,{size:28,color:CE,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.55),label('磁束の 変化率',790,300,{size:28,color:PHI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('Φ：輪を縁とする 面を 貫く 磁束',600,400,{size:28,color:PHI,anchor:'middle'}));
  return s;
 },
 [K+'flux']:(p)=>{
  // flat square, uniform B at an angle to the normal
  let s=poly([[120,380],[440,380],[540,290],[220,290]],{fill:MEM,fo:.25,stroke:SURF,sw:2});
  s+=fade(seg(p,.05,.25),arrow(330,335,330,160,{color:NC,w:5,head:16})+label('法線',345,175,{size:24,color:NC,weight:700}));
  for(const dx of [-120,-40,40,120])s+=fade(seg(p,.15,.35),arrow(330+dx-40,420,330+dx+50,190,{color:CB,w:4,head:14}));
  s+=card(680,110,470,260,T(`${PH}=${cs(CB,'B_{\\perp}')}\\,A`,915,200,{size:52})+label('法線方向の 成分 × 面積',915,280,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.5,.7),label('単位 Wb ＝ T·m²',915,335,{size:28,color:PHI,anchor:'middle',weight:700})),seg(p,.2,.4));
  return s;
 },
 [K+'fluxsum']:(p)=>{
  const P0=[70,420],P1=[470,420],P2=[570,300],P3=[170,300],nx=4,ny=3;
  const at=(u,v)=>[mix(mix(P0[0],P1[0],u),mix(P3[0],P2[0],u),v),mix(mix(P0[1],P1[1],u),mix(P3[1],P2[1],u),v)];
  let s='';
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const q=[at(i/nx,j/ny),at((i+1)/nx,j/ny),at((i+1)/nx,(j+1)/ny),at(i/nx,(j+1)/ny)];s+=poly(q,{fill:MEM,fo:(i+j)%2?.18:.3,stroke:SURF,sw:1.5});}
  const cells=[];for(let j=ny-1;j>=0;j--)for(let i=0;i<nx;i++)cells.push([i,j]);
  cells.forEach(([i,j],k)=>{const [x,y]=at((i+.5)/nx,(j+.5)/ny);const gA=seg(p,.05+k*.02,.15+k*.02);
   s+=fade(gA,arrow(x,y,x,y-42,{color:DA,w:3,head:10}));
   const ang=(30+12*Math.sin(i*1.7+j*2.3))*RAD*(i%2?1:-1),Lb=66+18*Math.cos(i+j);
   s+=fade(seg(p,.35,.5),arrow(x,y,x+Lb*Math.sin(ang),y-Lb*Math.cos(ang),{color:CB,w:3.5,head:11}));});
  s+=fade(seg(p,.1,.25),label('Δ𝐀：大きさ＝面積、向き＝法線',320,475,{size:24,color:DA,anchor:'middle',weight:700}));
  s+=card(680,90,470,320,T(`${PH}\\approx\\sum_i ${cs(CB,'\\mathbf{B}_i')}\\cdot${cs(DA,'\\Delta\\mathbf{A}_i')}`,915,180,{size:42})
   +fade(seg(p,.6,.75),arrow(915,225,915,270,{color:C.dim,w:3,head:12})+T(`${PH}=\\int_S ${vB}\\cdot${cs(DA,'d\\mathbf{A}')}`,915,330,{size:42}))
   +fade(seg(p,.75,.9),label('ガウスの回と 同じ 面積分',915,395,{size:24,color:C.dim,anchor:'middle'})),seg(p,.45,.6));
  return s;
 },
 [K+'law2']:(p)=>{
  let s=T(LAW,600,150,{size:60});
  s+=fade(seg(p,.05,.25),label('ファラデーの 電磁誘導の 法則',600,255,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=card(170,300,400,130,label('計算で 導いた式',370,378,{size:30,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  s+=fade(seg(p,.3,.45),line(210,365,530,395,{color:NEG,w:4})+line(210,395,530,365,{color:NEG,w:4}));
  s+=card(630,300,400,130,label('実験に 支えられた 法則',830,378,{size:30,color:PHI,anchor:'middle',weight:700}),seg(p,.5,.65),PHI);
  return s;
 },
 [K+'rate']:(p)=>{
  let s='';
  const A=graph(90,380,380,230,{tmax:.3,fmax:1.2,tt:[[.1,'0.1'],[.2,'0.2']],ft:[[1,'1']]});
  s+=A.s+draw([[A.X(0),A.Y(1)],[A.X(.3),A.Y(1)]],seg(p,.05,.3),{color:PHI,w:5});
  s+=fade(seg(p,.3,.45),label('磁束 大きいが 一定',280,90,{size:26,color:C.ink,anchor:'middle',weight:700})+label('傾き 0 → 一周の和 0',280,440,{size:26,color:PHI,anchor:'middle',weight:700}));
  const B=graph(690,380,380,230,{tmax:.3,fmax:1.2,tt:[[.1,'0.1'],[.2,'0.2']],ft:[[1,'1']],g:seg(p,.45,.6)});
  s+=B.s+draw([[B.X(0),B.Y(.1)],[B.X(.3),B.Y(1.05)]],seg(p,.5,.75),{color:PHI,w:5});
  s+=fade(seg(p,.7,.85),label('磁束が 変わる',880,90,{size:26,color:C.ink,anchor:'middle',weight:700})+label('傾き ≠ 0 → 一周の和 ≠ 0',880,440,{size:26,color:PHI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=T(LAW,600,120,{size:52});
  s+=card(120,210,440,210,label('左辺',340,260,{size:26,color:C.dim,anchor:'middle'})+T(`\\mathrm{J/C}=\\mathrm{V}`,340,345,{size:48}),seg(p,.05,.25));
  s+=card(640,210,440,210,label('右辺（初級で確かめた）',860,260,{size:26,color:C.dim,anchor:'middle'})+T(`\\mathrm{Wb/s}=\\mathrm{V}`,860,345,{size:48}),seg(p,.3,.5));
  s+=fade(seg(p,.65,.8),label('一致',600,470,{size:32,color:PHI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ampere']:(p)=>{
  const AL=`\\oint_C ${vB}\\cdot${dr}`,AR=`\\mu_0${cs(CI,'I')}`,FL=OE,FR=`-${DPHI}`;
  const a1=texSpan('',AL,`=${AR}`,320,40),a2=texSpan(`${AL}=`,AR,'',320,40),f1=texSpan('',FL,`=${FR}`,880,40),f2=texSpan(`${FL}=`,FR,'',880,40);
  let s=card(70,90,500,320,label('アンペールの法則',320,145,{size:28,color:CB,anchor:'middle',weight:700})+T(`${AL}=${AR}`,320,240,{size:40})+fade(seg(p,.5,.7),label('貫く 電流',(a2[0]+a2[1])/2,340,{size:28,color:CI,anchor:'middle',weight:700})),seg(p,.02,.2));
  s+=card(630,90,500,320,label('ファラデーの法則',880,145,{size:28,color:CE,anchor:'middle',weight:700})+T(`${FL}=${FR}`,880,240,{size:40})+fade(seg(p,.55,.75),label('貫く 磁束の 変化率',Math.min(1010,(f2[0]+f2[1])/2),340,{size:28,color:PHI,anchor:'middle',weight:700})),seg(p,.15,.3));
  s+=fade(seg(p,.3,.45),highlight(a1[0]-8,190,a1[1]-a1[0]+16,85,1,C.hi)+highlight(f1[0]-8,190,f1[1]-f1[0]+16,85,1,C.hi)+label('左辺：どちらも 一周の和',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=T(LAW,600,110,{size:52});
  {const m=texSpan(`${OE}=`,'-',DPHI,600,52);s+=fade(seg(p,.05,.2),highlight(m[0]-6,74,m[1]-m[0]+12,38,1,NEG));}
  s+=card(90,200,480,240,label('左辺',330,250,{size:26,color:C.dim,anchor:'middle'})+label('たどる向きを 逆に',330,310,{size:28,color:DA,anchor:'middle',weight:700})+label('→ 符号が 反転',330,370,{size:28,color:C.ink,anchor:'middle'}),seg(p,.2,.35));
  s+=card(630,200,480,240,label('右辺',870,250,{size:26,color:C.dim,anchor:'middle'})+label('法線を 逆に',870,310,{size:28,color:NC,anchor:'middle',weight:700})+label('→ 符号が 反転',870,370,{size:28,color:C.ink,anchor:'middle'}),seg(p,.4,.55));
  s+=fade(seg(p,.7,.85),label('2つの向きを 組にする',600,490,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=obliqueRule(290,330,{g:seg(p,0,.2),nG:seg(p,.2,.4)});
  s+=circ(900,270,130,1,{g:seg(p,.5,.65),color:DA,w:4});
  s+=fade(seg(p,.6,.75),outSym(900,270,24,NC)+label('法線：手前（⊙）',900,450,{size:28,color:NC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('画面の輪：反時計回り',900,100,{size:26,color:DA,anchor:'middle',weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=circ(TV.x,TV.y,185,1,{color:DA,w:3.5,nh:4});
  s+=label('＋の向き',TV.x+150,TV.y-170,{size:24,color:DA,weight:700});
  s+=fieldDisc(TV.x,TV.y,150,{kind:'out',r:mix(8,15,seg(p,.1,.9)),step:62});
  s+=card(680,120,470,240,label('手前向きの 磁束が 増える',915,190,{size:28,color:CB,anchor:'middle',weight:700})+label('電場は どちら回り？',915,280,{size:32,color:CE,anchor:'middle',weight:700}),seg(p,.1,.3),CE);
  return s;
 },
 [K+'inc']:(p)=>{
  let s=circ(TV.x,TV.y,185,1,{color:DA,w:3,nh:4,g:.6});
  s+=fieldDisc(TV.x,TV.y,150,{kind:'out',r:15,step:62});
  s+=ringArrows(TV.x,TV.y,212,-1,{g:seg(p,.55,.7),prog:seg(p,.55,.85),n:8,len:50});
  let c=T(`${DPHI}>0`,915,160,{size:40});
  c+=fade(seg(p,.2,.35),arrow(915,200,915,235,{color:C.dim,w:3,head:12})+T(`${OE}<0`,915,285,{size:40}));
  c+=fade(seg(p,.55,.7),label('𝐄 は 時計回り',915,370,{size:32,color:CE,anchor:'middle',weight:700}));
  s+=card(680,90,470,320,c,seg(p,0,.15));
  return s;
 },
 [K+'lenz']:(p)=>{
  let s=fieldDisc(TV.x,TV.y,150,{kind:'out',r:13,step:62,g:.45});
  s+=circ(TV.x,TV.y,185,-1,{color:CI,w:6,nh:4,Lh:24});
  s+=label('電流 I：時計回り',TV.x,TV.y+235,{size:26,color:CI,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.35),inSym(TV.x,TV.y,34,IND));
  s+=card(680,110,470,270,label('誘導の磁場：奥向き（⊗）',915,175,{size:28,color:IND,anchor:'middle',weight:700})+fade(seg(p,.35,.5),label('手前向きの 増加を',915,245,{size:28,color:C.ink,anchor:'middle'})+label('妨げる',915,295,{size:32,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('初級の レンツの法則と 一致',915,355,{size:26,color:PHI,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=T(LAW,600,120,{size:56});
  {const m=texSpan(`${OE}=`,'-',DPHI,600,56);s+=fade(seg(p,.02,.15),highlight(m[0]-6,82,m[1]-m[0]+12,40,1,NEG));}
  s+=card(150,220,900,210,label('負号が 表すもの',600,270,{size:26,color:C.dim,anchor:'middle'})+label('右手で 組にした 向きに 対して',600,330,{size:30,color:C.ink,anchor:'middle'})+label('誘導は 変化を 妨げる向き（実験の 事実）',600,385,{size:30,color:PHI,anchor:'middle',weight:700}),seg(p,.15,.35));
  return s;
 },
 [K+'energy']:(p)=>{
  const cx=320,cy=260,R=140;let s='';
  const items=[['電流 増える',CI,90],['磁束 増える',PHI,-30],['起電力 増える',EMF,210]];
  items.forEach(([t,c,a],i)=>{s+=fade(seg(p,.05+i*.12,.15+i*.12),label(t,cx+R*Math.cos(a*RAD),cy-R*Math.sin(a*RAD)+10,{size:28,color:c,anchor:'middle',weight:700}));});
  for(let i=0;i<3;i++){const a0=(90-120*i-30)*RAD,a1=(90-120*i-90)*RAD;s+=fade(seg(p,.1+i*.12,.2+i*.12),arrow(cx+R*.95*Math.cos(a0),cy-R*.95*Math.sin(a0),cx+R*.95*Math.cos(a1),cy-R*.95*Math.sin(a1),{color:C.dim,w:4,head:14}));}
  s+=fade(seg(p,.4,.55),label('もし 助ける向きなら',cx,50,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(680,110,470,270,label('エネルギーが',915,180,{size:28,color:C.ink,anchor:'middle'})+label('無から わく',915,235,{size:34,color:NEG,anchor:'middle',weight:700})+fade(seg(p,.65,.8),label('→ 負号は エネルギー保存と 合う',915,315,{size:26,color:PHI,anchor:'middle',weight:700})),seg(p,.45,.6),NEG);
  return s;
 },
 [K+'num']:(p)=>{
  let s=circ(250,260,150,1,{color:DA,w:3,nh:4,g:.8})+fieldDisc(250,260,118,{kind:'out',r:mix(8,14,seg(p,.3,.9)),step:58});
  s+=label('1巻き',250,450,{size:26,color:C.ink,anchor:'middle',weight:700});
  const G=graph(640,400,440,270,{tmax:.15,fmax:.025,tt:[[.1,'0.1']],ft:[[.02,'0.02']]});
  s+=fade(seg(p,.1,.3),G.s+draw([[G.X(0),G.Y(0)],[G.X(.1),G.Y(.02)],[G.X(.15),G.Y(.02)]],seg(p,.3,.8),{color:PHI,w:5}));
  s+=fade(seg(p,.75,.9),label('一様に 増える',G.X(.06)+14,G.Y(.009)+14,{size:24,color:PHI,weight:700}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=T(`${DPHI}=\\dfrac{0.02\\,\\mathrm{Wb}}{0.1\\,\\mathrm{s}}=0.2\\,\\mathrm{Wb/s}`,600,150,{size:50});
  s+=fade(seg(p,.45,.6),T(`${EM}=-0.2\\,\\mathrm{V}`,600,330,{size:62}));
  return s;
 },
 [K+'num3']:(p)=>{
  let s=circ(300,258,160,1,{color:DA,w:3,nh:4,g:.5})+label('選んだ ＋の向き（反時計回り）',300,60,{size:24,color:DA,anchor:'middle'});
  s+=ringArrows(300,258,190,-1,{color:EMF,g:seg(p,.05,.2),prog:seg(p,.05,.4),n:8,len:48});
  s+=fade(seg(p,.15,.3),label('時計回りに 0.2 V',300,478,{size:28,color:EMF,anchor:'middle',weight:700}));
  s+=card(680,110,470,270,T(`${EM}=-0.2\\,\\mathrm{V}`,915,190,{size:48})+label('負 → ＋の向きと 逆',915,265,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.55,.7),label('1 C が 一周で 0.2 J',915,335,{size:30,color:PHI,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'quiz']:(p)=>{
  const G=graph(110,400,420,270,{tmax:.3,fmax:.05,tt:[[.2,'0.2']],ft:[[.04,'0.04']]});
  let s=G.s+draw([[G.X(0),G.Y(.04)],[G.X(.2),G.Y(0)],[G.X(.3),G.Y(0)]],seg(p,.1,.5),{color:PHI,w:5});
  s+=card(680,110,470,270,label('手前向きの 磁束が',915,170,{size:26,color:C.ink,anchor:'middle'})+label('0.2 秒で 0.04 Wb 減る',915,220,{size:30,color:PHI,anchor:'middle',weight:700})+label('ℰ は？ どちら回り？',915,310,{size:32,color:EMF,anchor:'middle',weight:700}),seg(p,.2,.35),EMF);
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=T(`${DPHI}=\\dfrac{-0.04}{0.2}=-0.2\\,\\mathrm{Wb/s}`,340,120,{size:40});
  s+=fade(seg(p,.2,.35),T(`${EM}=+0.2\\,\\mathrm{V}`,340,240,{size:48}));
  s+=circ(900,260,130,1,{color:DA,w:3,nh:4,g:.5})+fieldDisc(900,260,100,{kind:'out',r:mix(14,8,seg(p,.3,.9)),step:52});
  s+=ringArrows(900,260,160,1,{color:EMF,g:seg(p,.35,.5),prog:seg(p,.35,.65),n:8,len:44});
  s+=fade(seg(p,.4,.55),label('反時計回り',900,470,{size:28,color:EMF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('減る 磁束を 補う 向き',340,350,{size:30,color:PHI,anchor:'middle',weight:700})+label('（輪の中に 手前向きの 磁場）',340,400,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(90,70,480,380,label('静電場',330,130,{size:30,color:CE,anchor:'middle',weight:700})+T(`${OE}=0`,330,230,{size:40})+label('電位が 置ける',330,330,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.2));
  s+=card(630,70,480,380,label('磁場が 時間で 変わる',870,130,{size:28,color:CB,anchor:'middle',weight:700})+T(LAW,870,230,{size:38})+label('回る 電場（固定した 輪）',870,330,{size:26,color:C.dim,anchor:'middle'}),seg(p,.3,.5),PHI);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=T(`${EM}=${OE}=-${DPHI}`,600,130,{size:54});
  s+=card(80,230,330,200,label('起電力 ℰ',245,290,{size:30,color:EMF,anchor:'middle',weight:700})+label('単位 V',245,350,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2));
  s+=card(435,230,330,200,label('電位差とは',600,290,{size:28,color:C.ink,anchor:'middle'})+label('別の量',600,350,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45));
  s+=card(790,230,330,200,label('負号',955,290,{size:28,color:NEG,anchor:'middle',weight:700})+label('変化を 妨げる向き',955,350,{size:26,color:C.ink,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },
 [K+'next1']:(p)=>{
  const cx=300;let s='';const Nn=6;
  for(let i=0;i<Nn;i++){const cy=150+i*42;s+=fade(seg(p,.05+i*.06,.12+i*.06),draw(arcPts(cx,cy,150,34,0,360,60),1,{color:CI,w:4,opacity:i===0?1:.85}));}
  s+=fade(seg(p,.45,.6),label('N 巻き',cx,470,{size:30,color:CI,anchor:'middle',weight:700}));
  s+=card(680,130,470,220,label('N 回 巻いた コイルの',915,200,{size:28,color:C.ink,anchor:'middle'})+label('起電力は？',915,270,{size:34,color:EMF,anchor:'middle',weight:700}),seg(p,.3,.45),EMF);
  return s;
 },
 [K+'next']:(p)=>{
  const cx=300,cy=260;let s='';
  for(let y=110;y<=410;y+=60)s+=arrow(40,y,560,y,{color:CB,w:3,head:12,opacity:.6});
  s+=label('𝐁',575,120,{size:28,color:CB,weight:700});
  const ang=seg(p,0,1)*Math.PI*2*1.5,w=130*Math.cos(ang);
  s+=line(cx,70,cx,450,{color:C.dim,w:2,dash:'6 6'});
  s+=poly([[cx-w,150],[cx+w,150],[cx+w,370],[cx-w,370]],{fill:MEM,fo:.18,stroke:CI,sw:5});
  s+=card(680,130,470,220,label('回し 続けると',915,200,{size:28,color:C.ink,anchor:'middle'})+label('起電力は どう 変わる？',915,270,{size:32,color:EMF,anchor:'middle',weight:700}),seg(p,.05,.2),EMF);
  return s;
 },
};
