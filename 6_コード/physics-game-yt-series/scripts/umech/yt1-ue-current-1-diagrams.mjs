// YouTube シリーズ「電流・上級 1/2」(ys-ue-current-1) — 図。Stage 1200×515.
// 向き：𝐄 は右向き。電子の力 −e𝐄・平均の速度 𝐯 は左向き。電流密度 𝐣・電流 I は右向き。
// 色：電流 I・𝐣 緑、e 桃、電子 青、陽イオン 赤、𝐄 水色、𝐯 紫、電圧 V 紫、τ 金、σ・ρ・R 黄、力 −e𝐄 緑の枠なしの矢印（力の色）、強調 黄、誤り 赤。
// 部品（関数）は export して 2/2 でも使う（関数の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,texWidth,brace,poly} from './anim.mjs';
import {NEG,POS,EC,QC,IC,VEL,TC,SC,cs,T,card,L,U,tube,electronsIn,ions,eArrow,vArrow,iArrow,BG,xout,W} from './yt1-um-conduction-1-diagrams.mjs';
export {NEG,POS,EC,QC,IC,VEL,TC,SC,cs,T,card,L,U,tube,electronsIn,ions,eArrow,vArrow,iArrow,BG,xout,W};

const K='ue-current-1:';
export const BAD=C.a,OK=C.F,VC=C.v,RC=C.hi,FC=C.F,HEAT=C.E;
// TeX pieces
export const bE=cs(EC,'\\mathbf{E}'),Es=cs(EC,'E'),bv=cs(VEL,'\\mathbf{v}'),vs=cs(VEL,'v'),et=cs(QC,'e'),tau=cs(TC,'\\tau'),
 bj=cs(IC,'\\mathbf{j}'),js=cs(IC,'j'),It=cs(IC,'I'),sig=cs(RC,'\\sigma'),rho=cs(RC,'\\rho'),Rt=cs(RC,'R'),Vt=cs(VC,'V'),St=cs(SC,'S');
// equation centred on x with automatic shrink, optional box
export function TF(s,x,y,{size=44,maxW=1100,g=1,box=false,col=C.hi,frac=false}={}){
 const w0=texWidth(s,size,false),sz=w0>maxW?size*maxW/w0:size,w=w0*sz/size;
 let o=T(s,x,y,{size:sz});
 if(box){const top=frac?1.95:1.5,h=frac?3.0:2.45;o+=highlight(x-w/2-20,y-sz*top,w+40,sz*h,1,col);}
 return fade(g,o);
}
// a row of TeX pieces; returns svg and the centre x / width of each piece (for boxes and labels)
export function row(pieces,y,{size=52,cx=600,gap=14}={}){
 const ws=pieces.map(s=>texWidth(s,size,false)),tot=ws.reduce((a,b)=>a+b,0)+gap*(pieces.length-1);
 let x=cx-tot/2,s='';const xs=[];
 pieces.forEach((pc,i)=>{xs.push(x+ws[i]/2);s+=T(pc,x+ws[i]/2,y,{size});x+=ws[i]+gap;});
 return {svg:s,xs,ws};
}
const box=(xc,w,y,size,g,col=C.hi,frac=true)=>highlight(xc-w/2-12,y-size*(frac?1.95:1.5),w+24,size*(frac?3.0:2.45),g,col);

// ---------- lattice (zoomed metal) ----------
const IONS=[];for(let r=0;r<4;r++)for(let k=0;k<8;k++){const x=95+k*145+(r%2?72:0);if(x>1130)continue;IONS.push([x,95+r*118]);}
export function lattice(g=1,{hit=-1,hg=0}={}){
 let s='';IONS.forEach(([x,y],i)=>{const on=i===hit;s+=ring(x,y,20,{color:POS,w:on?4:2.5,fill:on?'#5a2434':'#3a1d2a'})+label('+',x,y+8,{size:24,color:POS,anchor:'middle',weight:700});
  if(on&&hg>0)s+=fade(hg,ring(x,y,34,{color:C.hi,w:3,dash:'5 5'}));});
 return fade(g,s);
}
const ion=i=>IONS[i];
const near=(i,from,rr=30)=>{const [x,y]=ion(i),dx=from[0]-x,dy=from[1]-y,d=Math.hypot(dx,dy);return [x+dx/d*rr,y+dy/d*rr];};
// the electron path: start, then contact points beside ions; each leg is a quadratic curve bent by the leftward push
const idx=(x,y)=>IONS.findIndex(q=>Math.abs(q[0]-x)<2&&Math.abs(q[1]-y)<2);
const P0=[1080,272];
const CH=[idx(965,331),idx(892,213),idx(747,213),idx(675,331),idx(530,331),idx(457,213),idx(312,213),idx(240,331)];
const PTS=[P0];CH.forEach((i,k)=>PTS.push(near(i,PTS[k])));
// start velocity of each leg (after the collision: a random direction); the curve control point
const KICK=[[0,1],[.3,-1],[.8,.3],[-.1,1],[.5,.2],[.2,-1],[.6,.4],[-.2,1]];
function leg(k){const a=PTS[k],b=PTS[k+1],d=Math.hypot(b[0]-a[0],b[1]-a[1])*.5;return [a,[a[0]+KICK[k][0]*d,a[1]+KICK[k][1]*d],b];}
const qb=([a,c,b],u)=>[(1-u)*(1-u)*a[0]+2*u*(1-u)*c[0]+u*u*b[0],(1-u)*(1-u)*a[1]+2*u*(1-u)*c[1]+u*u*b[1]];
function legPath(k,u=1,{color=VEL,w=3,dash=''}={}){const L3=leg(k);const pts=[];for(let i=0;i<=30;i++)pts.push(qb(L3,u*i/30));return draw(pts,1,{color,w,dash});}
const flash=(x,y,g)=>fade(g,`<circle cx="${x}" cy="${y}" r="${14+16*g}" fill="${C.hi}" fill-opacity="${.35*(1-g)+.1}"/>`+ring(x,y,10+14*g,{color:C.hi,w:3}));
const eTop=(g=1)=>fade(g,arrow(880,40,1080,40,{color:EC,w:5,head:16})+T(bE,1110,50,{size:34}));
const elec=(x,y,r=12)=>dot(x,y,r,NEG)+ring(x,y,r+5,{color:C.hi,w:2.5});

// ---------- sawtooth: velocity gained to the left vs time ----------
export const TS=[0,.9,2.2,2.8,4.3,5.1,5.6,7.0,7.7,9.1,10];
const sawV=(t,k=1)=>{let last=0;for(const c of TS){if(c<=t)last=c;}return k*(t-last);};
export function sawMean(k=1){const N=4000;let s=0;for(let i=0;i<N;i++)s+=sawV(10*(i+.5)/N,k);return s/N;}
const GA={x:130,y:440,w:860,h:340,xmin:0,xmax:10.4,ymin:0,ymax:3.3};
function sawGraph({g=1,p1=1,k=1,col=VEL,avg=0,p2=0,avg2=0,marks=1}={}){
 const A=axes({...GA,g});
 let s=A.svg+fade(g,label('時間',A.X(10.4)+20,A.Y(0)+8,{size:24,color:TC})+label('左向きに 得た 速さ',A.X(0)+14,A.Y(3.3)-20,{size:24,color:VEL}));
 const curve=(kk,pp,cc,w)=>{const pts=[];const tEnd=10*pp;for(let i=0;i<TS.length-1;i++){const a=TS[i],b=Math.min(TS[i+1],tEnd);if(b<=a)break;
   pts.push([A.X(a),A.Y(0)],[A.X(b),A.Y(kk*(b-a))]);if(b===TS[i+1]&&b<tEnd)pts.push([A.X(b),A.Y(0)]);}
  let o='';for(let i=0;i+1<pts.length;i++)o+=line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],{color:cc,w,cap:'round'});return o;};
 s+=curve(k,p1,col,4);
 if(marks)for(let i=1;i<TS.length-1;i++)if(TS[i]<=10*p1)s+=fade(g,dot(A.X(TS[i]),A.Y(k*(TS[i]-TS[i-1])),6,C.hi));
 const m=sawMean(k);
 if(avg>0)s+=fade(avg,line(A.X(0),A.Y(m),A.X(10),A.Y(m),{color:VEL,w:4,dash:'12 8'}));
 if(p2>0){s+=curve(2*k,p2,C.hi,3.5);}
 const m2=sawMean(2*k);
 if(avg2>0)s+=fade(avg2,line(A.X(0),A.Y(m2),A.X(10),A.Y(m2),{color:C.hi,w:4,dash:'12 8'}));
 return {svg:s,A,m,m2};
}

const avgLab=(A,m)=>label('平均 ＝',A.X(10)+12,A.Y(m)-36,{size:24,color:VEL,weight:700})+label('ドリフト速度',A.X(10)+12,A.Y(m)-8,{size:24,color:VEL,weight:700});
export const ytUeCurrent1Diagrams={
 // ===== S1 前回の問い =====
 [K+'prev']:(p)=>card(150,80,900,350,
   L('コンデンサ・上級 2/2',600,130,{size:24,color:C.dim})
   +T(`C=\\kappa\\,C_0`,600,215,{size:50})
   +fade(seg(p,.35,.5),L('電池を 外す（Q 一定）：U は 1/κ 倍',600,300,{size:28,color:C.E}))
   +fade(seg(p,.5,.65),L('つないだまま（V 一定）：U は κ 倍',600,370,{size:28,color:C.E})),seg(p,0,.15)),
 [K+'w:ask']:(p)=>{
  let s=tube({})+ions({})+electronsIn({n:34})+eArrow(1);
  s+=card(760,80,400,350,L('前回の 最後の 問い',960,130,{size:24,color:C.dim})
   +L('電子の 平均の 速さは',960,205,{size:28})+L('なぜ 電場に 比例？',960,255,{size:30,weight:700,color:EC})
   +fade(seg(p,.5,.65),L('→ オームの 法則？',960,345,{size:32,weight:700,color:C.hi})),seg(p,0,.15));
  return s;
 },
 [K+'w:ensv']:(p)=>{
  let s=tube({})+ions({})+electronsIn({n:34,shift:40*p})+eArrow(1)+vArrow(seg(p,.1,.3),W.x2-170,W.y+W.h+42,130)+iArrow(seg(p,.2,.4),W.x1+10,W.y+W.h+42,120);
  s+=card(760,80,400,350,L('中級',960,125,{size:24,color:C.dim})
   +T(`${It}=${et}n${St}${vs}`,960,200,{size:48})
   +fade(seg(p,.4,.55),L('銅線 1 mm²，1 A',960,275,{size:26})
    +T(`${vs}\\approx 7\\times10^{-5}${U('m/s')}`,960,335,{size:36})
    +L('（1秒に 約 0.07 mm）',960,395,{size:24,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'w:ohm']:(p)=>{
  let s=fade(.45,tube({})+ions({})+electronsIn({n:34,shift:40})+eArrow(1));
  s+=card(760,80,400,350,L('初級',960,125,{size:24,color:C.dim})
   +T(`${Vt}=${Rt}\\,${It}`,960,210,{size:56})
   +L('実験で 確かめる 法則',960,280,{size:26,color:C.dim})
   +fade(seg(p,.5,.65),L('今回：電子の 動きから',960,350,{size:28,color:C.hi,weight:700})+L('導く',960,395,{size:28,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'puzzle']:(p)=>{
  // left: one electron pushed left, growing velocity arrow
  const u=seg(p,.05,.6),x=520-300*u*u;
  let s=line(80,250,600,250,{color:C.faint,w:2,dash:'6 8'});
  s+=elec(x,250)+arrow(x-18,250-40,x-128,250-40,{color:FC,w:5,head:16})+T(`-${et}${bE}`,x-80,250-74,{size:30});
  s+=arrow(x+18,250+42,x+18-(30+150*u),250+42,{color:VEL,w:5,head:16});
  s+=label('速さ',x+30,250+52,{size:24,color:VEL});
  s+=arrow(380,90,560,90,{color:EC,w:5,head:16})+T(bE,590,100,{size:32});
  // right: speed vs time — keeps growing?
  const A=axes({x:720,y:430,w:380,h:300,xmin:0,xmax:1,ymin:0,ymax:1});
  s+=A.svg+label('時間',A.X(1)+18,A.Y(0)+8,{size:24,color:TC})+label('速さ',A.X(0),A.Y(1)-40,{size:24,color:VEL,anchor:'middle'});
  s+=A.plot(t=>t*.75,{from:0,to:.6*seg(p,.05,.6)+.001,color:VEL,w:4});
  s+=fade(seg(p,.55,.7),A.plot(t=>t*.75,{from:.6,to:1.25,color:VEL,w:3,dash:'8 8'})+label('増え続ける？',A.X(.55),A.Y(.95),{size:28,color:C.hi,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.75,.88),L('何が 止める？',350,440,{size:34,color:BAD,weight:700}));
  return s;
 },
 // ===== S2 加速と衝突 =====
 [K+'lat:zoom']:(p)=>{
  let s=lattice(seg(p,0,.3))+eTop(seg(p,.55,.75));
  s+=fade(seg(p,.2,.4),elec(P0[0],P0[1]));
  s+=fade(seg(p,.25,.45),label('陽イオンの 格子',300,500,{size:26,color:POS,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),label('自由電子',P0[0]-30,P0[1]+9,{size:26,color:NEG,weight:700,anchor:'end'}));
  return s;
 },
 [K+'lat:force']:(p)=>{
  const u=seg(p,.25,.95),[x,y]=qb(leg(0),u*u*.8);
  let s=lattice(1)+eTop(1)+legPath(0,u*u*.8,{color:VEL,w:3});
  s+=elec(x,y)+arrow(x-16,y-34,x-126,y-34,{color:FC,w:5,head:16});
  s+=fade(seg(p,.1,.25),card(60,415,560,80,L('力 −e𝐄 は 左向き → 左へ 加速',340,465,{size:26,color:FC,weight:700})));
  return s;
 },
 [K+'lat:thermal']:(p)=>{
  const [x,y]=qb(leg(0),.8);
  let s=lattice(.5)+eTop(1)+legPath(0,.8,{color:VEL,w:3});
  // random fast thermal velocities (averaging to zero) — grey
  const dirs=[[1,.2],[-.6,.8],[.1,-1],[-1,-.3],[.7,.7],[.4,-.8]];
  s+=fade(seg(p,.05,.3),dirs.map(([a,b])=>arrow(x,y,x+a*95,y+b*95,{color:C.dim,w:3,head:12})).join(''));
  s+=fade(seg(p,.05,.3),card(60,415,620,80,L('灰色：でたらめな 熱運動（平均 0）→ 除く',370,465,{size:26,color:C.ink})));
  s+=fade(seg(p,.45,.6),`<rect x="${x-130}" y="${y-140}" width="260" height="260" fill="${BG}" fill-opacity=".7"/>`);
  s+=elec(x,y)+fade(seg(p,.5,.7),arrow(x-14,y+40,x-150,y+40,{color:VEL,w:6,head:16})+label('電場で 得た 左向きの 速さ',x-80,y+86,{size:24,color:VEL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lat:hit']:(p)=>{
  // finish leg 0, collide (flash), then the repeated legs 1..7 drifting left
  const u=seg(p,0,.2),hg=seg(p,.2,.32);
  let s=lattice(1,{hit:CH[0],hg:hg*(1-seg(p,.4,.5))})+eTop(1)+legPath(0,mix(.8,1,u),{color:VEL,w:3});
  if(p<.2){const [x,y]=qb(leg(0),mix(.8,1,u));s+=elec(x,y);}
  else{
   s+=flash(PTS[1][0],PTS[1][1],clamp(hg))+dot(PTS[1][0],PTS[1][1],7,C.hi);
   const tot=CH.length-1,f=seg(p,.34,.92)*tot; // legs 1..tot
   let ex=PTS[1][0],ey=PTS[1][1];
   for(let k=1;k<=tot;k++){const uu=clamp(f-(k-1),0,1);if(uu<=0)break;s+=legPath(k,uu*uu,{color:VEL,w:3});[ex,ey]=qb(leg(k),uu*uu);if(uu>=1)s+=dot(PTS[k+1][0],PTS[k+1][1],7,C.hi);}
   s+=elec(ex,ey);
  }
  s+=fade(seg(p,.22,.34)*(1-seg(p,.5,.58)),card(60,415,600,80,L('衝突：向きが 乱れ、得た 速さを 失う',360,465,{size:26,color:C.hi,weight:700})));
  s+=fade(seg(p,.75,.9),arrow(800,52,240,52,{color:VEL,w:4,head:14})+label('全体として 少しずつ 左へ',520,36,{size:24,color:VEL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'saw:graph']:(p)=>{
  const {svg,A}=sawGraph({p1:seg(p,.05,.75)});
  let s=svg+fade(seg(p,.3,.45),label('加速',A.X(3.3),A.Y(1.0),{size:24,color:C.ink,anchor:'end'})+label('衝突',A.X(.9),A.Y(.9)-18,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),card(1010,100,180,150,L('間隔は',1100,160,{size:24})+L('ばらばら',1100,205,{size:26,weight:700,color:C.hi})));
  return s;
 },
 [K+'saw:avg']:(p)=>{
  const {svg,A,m}=sawGraph({avg:seg(p,.3,.55)});
  return svg+fade(seg(p,.5,.7),avgLab(A,m));
 },
 [K+'saw:predict']:(p)=>{
  const {svg,A,m}=sawGraph({avg:1});
  return svg+avgLab(A,m)
   +card(820,90,360,130,L('𝐄 を 2倍に すると',1000,145,{size:26,color:EC,weight:700})+L('平均の 高さは？',1000,192,{size:28,color:C.hi,weight:700}),seg(p,0,.2),C.hi);
 },
 [K+'saw:double']:(p)=>{
  const {svg,A,m,m2}=sawGraph({avg:1,p2:seg(p,.05,.5),avg2:seg(p,.6,.8),marks:0});
  let s=svg+label('平均',A.X(10)+12,A.Y(m)+8,{size:24,color:VEL,weight:700});
  s+=fade(seg(p,.2,.35),label('傾き 2倍',A.X(.9)+40,A.Y(1.8)-10,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.7,.85),label('平均も 2倍',A.X(10)+12,A.Y(m2)+8,{size:24,color:C.hi,weight:700}));
  return s;
 },
 // ===== S3 平均の運動方程式 =====
 ...(()=>{
  const PCS=[`m\\dfrac{d${bv}}{dt}`,'=',`-${et}${bE}`,`-\\dfrac{m${bv}}{${tau}}`];
  const Y0=150,SZ=56;
  const eq=(g=1)=>{const r=row(PCS,Y0,{size:SZ});return {...r,svg:fade(g,r.svg)};};
  const under=(i,xs,txt,col,g,y=Y0+95)=>fade(g,L(txt,xs[i],y,{size:24,color:col,weight:700}));
  const o={};
  o[K+'eq:model']=(p)=>{const r=eq(seg(p,.05,.3));
   return r.svg+fade(seg(p,.45,.6),under(0,r.xs,'質量 × 平均の 加速度',C.ink,1))
    +fade(seg(p,.35,.5),L('𝐯：たくさんの 電子の 平均の 速度',600,380,{size:26,color:VEL}));};
  o[K+'eq:t1']=(p)=>{const r=eq();
   return r.svg+under(0,r.xs,'質量 × 平均の 加速度',C.ink,1)+box(r.xs[2],r.ws[2],Y0,SZ,seg(p,.1,.3),FC,false)+under(2,r.xs,'電場の 力',FC,seg(p,.25,.45),Y0+95);};
  o[K+'eq:t2']=(p)=>{const r=eq();
   return r.svg+under(0,r.xs,'質量 × 平均の 加速度',C.ink,1)+under(2,r.xs,'電場の 力',FC,1)
    +box(r.xs[3],r.ws[3],Y0,SZ,seg(p,.05,.2),C.hi)+under(3,r.xs,'衝突の 効果',C.hi,seg(p,.1,.25),Y0+95)
    +fade(seg(p,.35,.5),card(200,300,800,170,L('平均して 時間 τ ごとに 運動量 m𝐯 を 失う',600,360,{size:26,color:C.ink})
      +fade(seg(p,.6,.75),L('→ 1秒に m𝐯/τ ずつ 減る',600,425,{size:28,color:C.hi,weight:700}))));};
  o[K+'eq:model2']=(p)=>{const r=eq();
   return r.svg+under(2,r.xs,'電場の 力',FC,1)+under(3,r.xs,'衝突の 効果',C.hi,1)
    +card(150,290,900,190,L('ばらばらの 衝突を 平均して ならした モデル（仮定）',600,345,{size:28,color:C.hi,weight:700})
     +fade(seg(p,.5,.65),L('空気抵抗：速さに 比例する 抵抗',430,425,{size:24,color:C.dim})+T(`-k${bv}`,700,425,{size:34})+L('と 同じ 形',850,425,{size:24,color:C.dim})),seg(p,0,.15));};
  o[K+'eq:steady']=(p)=>{const r=eq();const g=seg(p,.35,.55);
   let s=r.svg+box(r.xs[0],r.ws[0],Y0,SZ,seg(p,.1,.3),C.hi);
   s+=fade(seg(p,.1,.3),L('定常：平均の 速度は 一定',r.xs[0],Y0+95,{size:24,color:C.hi,weight:700}));
   s+=fade(g,line(r.xs[0]-r.ws[0]/2,Y0+30,r.xs[0]+r.ws[0]/2,Y0-80,{color:BAD,w:4}));
   s+=TF(`0=-${et}${bE}-\\dfrac{m${bv}}{${tau}}`,600,390,{size:52,g:seg(p,.6,.8)});
   return s;};
  o[K+'eq:move']=(p)=>{
   let s=TF(`0=-${et}${bE}-\\dfrac{m${bv}}{${tau}}`,600,120,{size:46});
   s+=fade(seg(p,.1,.3),label('m𝐯/τ を 左辺へ',820,215,{size:24,color:C.hi})+arrow(780,195,700,250,{color:C.hi,w:3,head:12}));
   s+=TF(`\\dfrac{m${bv}}{${tau}}=-${et}${bE}`,600,360,{size:58,g:seg(p,.35,.6)});
   return s;};
  o[K+'eq:solve']=(p)=>{
   let s=TF(`\\dfrac{m${bv}}{${tau}}=-${et}${bE}`,600,110,{size:46});
   s+=fade(seg(p,.1,.25),L('両辺 × τ/m',940,120,{size:26,color:C.hi,weight:700}));
   s+=TF(`${bv}=-\\dfrac{${et}${tau}}{m}\\,${bE}`,600,350,{size:62,box:true,frac:true,g:seg(p,.35,.6)});
   return s;};
  const RES=(g=1,y=110,size=54)=>TF(`${bv}=-\\dfrac{${et}${tau}}{m}\\,${bE}`,600,y,{size,box:true,frac:true,g});
  o[K+'eq:sign']=(p)=>{
   let s=RES();
   const y=330;s+=fade(seg(p,.1,.3),arrow(520,y-50,720,y-50,{color:EC,w:5,head:16})+T(bE,750,y-40,{size:32})+label('電場',500,y-42,{size:24,color:EC,anchor:'end'}));
   s+=fade(seg(p,.2,.4),arrow(720,y+30,520,y+30,{color:VEL,w:5,head:16})+T(bv,490,y+40,{size:32})+label('電子の 平均の 速度',750,y+38,{size:24,color:VEL}));
   s+=fade(seg(p,.3,.45),L('負号：逆向き',260,y-5,{size:28,color:BAD,weight:700}));
   s+=fade(seg(p,.55,.7),L('大きさ ∝ E',600,470,{size:32,color:C.hi,weight:700}));
   return s;};
  return o;
 })(),
 // ===== S4 j = σE =====
 [K+'j:def']:(p)=>{
  let s=tube({})+fade(.5,ions({}))+electronsIn({n:30,shift:30*p,g:.6});
  // a 1 m² patch on the section, with arrows j through it
  const x=W.gx,y=W.y;
  s+=`<ellipse cx="${x}" cy="${y}" rx="${Math.round(W.h*.28)}" ry="${W.h}" fill="${C.hi}" fill-opacity=".08" stroke="${C.dim}" stroke-width="2"/>`;
  s+=fade(seg(p,.1,.3),rect(x-10,y-34,20,68,{fill:C.hi,fo:.35,stroke:C.hi,sw:2,rx:3})+label('1 m²',x+40,y-W.h-14,{size:24,color:C.hi,anchor:'middle',weight:700})+line(x+10,y-34,x+34,y-W.h-8,{color:C.hi,w:2}));
  s+=fade(seg(p,.25,.45),[-20,0,20].map(dy=>arrow(x-110,y+dy,x+120,y+dy,{color:IC,w:4,head:14})).join('')+T(bj,x+150,y+10,{size:36}));
  s+=eArrow(1);
  s+=card(760,90,400,330,L('電流密度',960,145,{size:30,color:IC,weight:700})
   +L('1 m² あたりの 電流',960,215,{size:26})+L('向きを 持つ 矢印',960,265,{size:26})
   +fade(seg(p,.6,.75),L('単位 A/m²',960,345,{size:28,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'j:flux']:(p)=>{
  let s=tube({})+fade(.5,ions({}));
  const x=W.gx,y=W.y;
  s+=`<ellipse cx="${x}" cy="${y}" rx="${Math.round(W.h*.28)}" ry="${W.h}" fill="${C.hi}" fill-opacity=".12" stroke="${C.hi}" stroke-width="3"/>`;
  s+=[-70,-35,0,35,70].map(dy=>arrow(x-100,y+dy,x+110,y+dy,{color:IC,w:3.5,head:12})).join('')+T(bj,x+140,y+10,{size:34});
  s+=fade(seg(p,.1,.25),arrow(x,y-W.h-60,x+60,y-W.h-60,{color:C.dim,w:3,head:12})+T('\\mathbf{n}',x+84,y-W.h-52,{size:28}));
  s+=card(760,80,400,350,L('面を 貫く 𝐣 を 足す',960,135,{size:26,color:C.ink})
   +fade(seg(p,.15,.35),T(`${It}=\\int_S ${bj}\\cdot\\mathbf{n}\\,dA`,960,225,{size:42}))
   +fade(seg(p,.55,.7),L('電気束と 同じ 組み立て',960,320,{size:26,color:C.hi,weight:700})+T(`\\int_S ${bE}\\cdot\\mathbf{n}\\,dA`,960,385,{size:34})),seg(p,0,.15));
  return s;
 },
 [K+'j:env']:(p)=>{
  let s=TF(`${It}=${et}n${St}${vs}`,600,110,{size:56});
  s+=fade(seg(p,.15,.3),L('断面積 S で 割る',600,215,{size:26,color:C.hi,weight:700}));
  s+=TF(`${js}=\\dfrac{${It}}{${St}}=${et}n${vs}`,600,350,{size:58,g:seg(p,.35,.6)});
  return s;
 },
 [K+'j:vec']:(p)=>{
  let s=TF(`${js}=${et}n${vs}`,600,80,{size:40,g:.5});
  const r=row([`${bj}`,'=',`(-${et})`,'\\times','n','\\times',`${bv}`],250,{size:58});
  s+=fade(seg(p,.1,.3),r.svg);
  s+=fade(seg(p,.25,.4),L('電荷',r.xs[2],340,{size:24,color:QC,weight:700}));
  s+=fade(seg(p,.32,.47),L('1 m³ の 個数',r.xs[4],340,{size:24,color:C.ink,weight:700}));
  s+=fade(seg(p,.4,.55),L('速度',r.xs[6],340,{size:24,color:VEL,weight:700}));
  s+=TF(`${bj}=-n${et}\\,${bv}`,600,440,{size:52,box:true,g:seg(p,.65,.85)});
  return s;
 },
 [K+'j:sub']:(p)=>{
  let s=TF(`${bj}=-n${et}\\,${bv}`,600,90,{size:48});
  s+=fade(seg(p,.05,.2),TF(`${bv}=-\\dfrac{${et}${tau}}{m}\\,${bE}`,960,210,{size:36,box:true,frac:true}));
  s+=fade(seg(p,.15,.3),arrow(860,240,700,300,{color:C.hi,w:3,head:12})+label('代入',800,300,{size:24,color:C.hi}));
  s+=TF(`${bj}=-n${et}\\left(-\\dfrac{${et}${tau}}{m}\\,${bE}\\right)`,560,380,{size:54,g:seg(p,.35,.6)});
  return s;
 },
 [K+'j:cancel']:(p)=>{
  const c=seg(p,.1,.3)>.5;
  const neg=c?`{\\color{${BAD}}{\\cancel{\\color{${C.ink}}{-}}}}`:'-';
  let s=TF(`${bj}=${neg}n${et}\\left(${neg}\\dfrac{${et}${tau}}{m}\\,${bE}\\right)`,600,110,{size:50});
  s+=fade(seg(p,.2,.35),L('（−）×（−）＝（＋）',600,215,{size:26,color:BAD,weight:700}));
  s+=TF(`${bj}=\\dfrac{n${et}^2${tau}}{m}\\,${bE}`,600,360,{size:62,g:seg(p,.4,.6)});
  s+=fade(seg(p,.7,.85),L('𝐣 は 𝐄 と 同じ 向き',600,480,{size:28,color:IC,weight:700}));
  return s;
 },
 [K+'j:sigma']:(p)=>{
  let s=TF(`${bj}=\\dfrac{n${et}^2${tau}}{m}\\,${bE}`,600,90,{size:46});
  s+=fade(seg(p,.05,.25),TF(`${sig}=\\dfrac{n${et}^2${tau}}{m}`,330,250,{size:46}));
  s+=fade(seg(p,.15,.3),L('導電率',330,340,{size:28,color:RC,weight:700})+L('（面電荷密度の σ とは 別）',330,385,{size:22,color:C.dim}));
  s+=TF(`${bj}=${sig}\\,${bE}`,850,250,{size:68,box:true,g:seg(p,.4,.6)});
  s+=fade(seg(p,.6,.75),L('オームの 法則の',850,355,{size:26,color:C.hi})+L('小さな 場所ごとの 形',850,400,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'j:dir']:(p)=>{
  let s=tube({})+fade(.5,ions({}))+electronsIn({n:34,shift:40*p});
  s+=fade(seg(p,.05,.2),eArrow(1));
  s+=fade(seg(p,.25,.4),vArrow(1,W.x2-60,W.y+W.h+42,160,'電子'));
  s+=fade(seg(p,.45,.6),arrow(W.x1+10,W.y+W.h+42,W.x1+190,W.y+W.h+42,{color:IC,w:6,head:16})+T(bj,W.x1+215,W.y+W.h+52,{size:32})+label('電流',W.x1+238,W.y+W.h+50,{size:24,color:IC,weight:700}));
  s+=card(760,90,400,330,L('𝐄：右',960,160,{size:30,color:EC,weight:700})+fade(seg(p,.25,.4),L('電子：左',960,230,{size:30,color:NEG,weight:700}))
   +fade(seg(p,.45,.6),L('電流：右',960,300,{size:30,color:IC,weight:700}))+fade(seg(p,.7,.85),L('初級・中級と 同じ ✓',960,375,{size:26,color:OK,weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'j:temp']:(p)=>{
  let s=TF(`${sig}=\\dfrac{n${et}^2${tau}}{m}`,600,95,{size:46});
  const steps=[['温度 ↑',C.E],['格子の 振動 ↑',POS],['τ ↓',TC],['σ ↓',RC],['抵抗 ↑',C.hi]];
  const x0=110,dx=245;
  steps.forEach(([t,c],i)=>{const g=seg(p,.1+i*.14,.22+i*.14);const x=x0+i*dx;
   s+=fade(g,rect(x-95,270,190,80,{fill:c,fo:.12,stroke:c,sw:2.5,rx:12})+L(t,x,320,{size:26,color:c,weight:700}));
   if(i>0)s+=fade(g,arrow(x-dx+100,310,x-100,310,{color:C.dim,w:3,head:12}));});
  return s;
 },
 // ===== S5 R = ρl/S =====
 ...(()=>{
  const X1=170,X2=1030,Y=150,Hh=50;
  const wire=(p,{eg=1}={})=>{
   let s=rect(X1,Y-Hh,X2-X1,2*Hh,{fill:'#8795ad',fo:.14,stroke:C.dim,sw:2.5,rx:16});
   s+=`<ellipse cx="${X1}" cy="${Y}" rx="15" ry="${Hh}" fill="${SC}" fill-opacity=".25" stroke="${SC}" stroke-width="3"/>`+T(St,X1-36,Y+12,{size:34});
   s+=line(X1,Y+Hh+22,X2,Y+Hh+22,{color:C.ink,w:2})+line(X1,Y+Hh+12,X1,Y+Hh+32,{color:C.ink,w:2})+line(X2,Y+Hh+12,X2,Y+Hh+32,{color:C.ink,w:2})+T('l',(X1+X2)/2,Y+Hh+52,{size:32});
   s+=label('電位 高い',X1,Y-Hh-16,{size:22,color:VC,anchor:'middle'})+label('電位 低い',X2,Y-Hh-16,{size:22,color:VC,anchor:'middle'});
   s+=fade(eg,[-22,22].map(d=>arrow(X1+250,Y+d,X1+420,Y+d,{color:EC,w:3.5,head:12})).join('')+T(Es,X1+445,Y+10,{size:30}));
   s+=arrow(X2-260,Y,X2-90,Y,{color:IC,w:5,head:14})+T(It,X2-60,Y+10,{size:32});
   return s;};
  const vbar=(g=1)=>fade(g,line(X1,46,X2,46,{color:VC,w:3,dash:'8 6'})+line(X1,36,X1,56,{color:VC,w:3})+line(X2,36,X2,56,{color:VC,w:3})+T(Vt,(X1+X2)/2,26,{size:30})+label('両端の 電圧',(X1+X2)/2+30,30,{size:22,color:VC}));
  const o={};
  o[K+'r:wire']=(p)=>fade(seg(p,0,.2),wire(p))+vbar(seg(p,.4,.6))+fade(seg(p,.6,.8),L('一様な 導線（長さ l，断面積 S）',600,400,{size:28,color:C.ink}));
  o[K+'r:ijs']=(p)=>wire(p)+vbar()+fade(seg(p,.1,.25),`<ellipse cx="${X1}" cy="${Y}" rx="15" ry="${Hh}" fill="none" stroke="${C.hi}" stroke-width="4"/>`)
    +TF(`${It}=${js}\\,${St}`,300,360,{size:54,g:seg(p,.3,.5)})+fade(seg(p,.5,.65),L('j が 一様',300,450,{size:24,color:C.dim}));
  o[K+'r:evl']=(p)=>wire(p)+vbar()+TF(`${It}=${js}\\,${St}`,300,360,{size:54})
    +TF(`${Es}=\\dfrac{${Vt}}{l}`,880,360,{size:54,g:seg(p,.3,.5)})+fade(seg(p,.5,.65),L('長さ l で V 下がる',880,465,{size:24,color:C.dim}));
  o[K+'r:sub']=(p)=>{let s=fade(.6,wire(p)+vbar());
   s+=TF(`${js}=${sig}\\,${Es}`,600,320,{size:46,g:clamp(1-seg(p,.35,.5))});
   s+=fade(seg(p,.1,.3),L('j ＝ I/S',330,320,{size:26,color:IC,weight:700})+L('E ＝ V/l',870,320,{size:26,color:EC,weight:700}));
   s+=TF(`\\dfrac{${It}}{${St}}=${sig}\\,\\dfrac{${Vt}}{l}`,600,420,{size:54,g:seg(p,.45,.65)});
   return s;};
  o[K+'r:solve']=(p)=>{let s=fade(.45,wire(p)+vbar());
   s+=TF(`\\dfrac{${It}}{${St}}=${sig}\\,\\dfrac{${Vt}}{l}`,330,350,{size:46});
   s+=fade(seg(p,.1,.25),L('両辺 × l/σ',590,320,{size:24,color:C.hi,weight:700})+arrow(520,350,660,350,{color:C.hi,w:3,head:12}));
   s+=TF(`${Vt}=\\dfrac{l}{${sig}${St}}\\,${It}`,880,350,{size:54,g:seg(p,.3,.55)});
   return s;};
  o[K+'r:rho']=(p)=>{let s=fade(.45,wire(p)+vbar());
   s+=TF(`${Vt}=\\dfrac{l}{${sig}${St}}\\,${It}`,300,340,{size:46});
   s+=fade(seg(p,.1,.25),label('比例定数',300,445,{size:24,color:RC,anchor:'middle',weight:700}));
   s+=TF(`${Rt}=\\dfrac{l}{${sig}${St}}=${rho}\\,\\dfrac{l}{${St}}`,820,320,{size:50,box:true,frac:true,g:seg(p,.35,.6)});
   s+=fade(seg(p,.55,.75),T(`${rho}=\\dfrac{1}{${sig}}`,820,445,{size:34})+label('抵抗率',920,450,{size:24,color:RC}));
   return s;};
  o[K+'r:law']=(p)=>{let s=fade(.45,wire(p)+vbar());
   s+=TF(`${Rt}=${rho}\\,\\dfrac{l}{${St}}`,260,330,{size:46});
   s+=fade(seg(p,.05,.2),L('l が 2倍 → R も 2倍',260,425,{size:24,color:C.ink}))+fade(seg(p,.15,.3),L('S が 2倍 → R は ½',260,470,{size:24,color:C.ink}));
   s+=fade(seg(p,.4,.55),card(560,270,560,215,L('初級：実験の 法則',840,315,{size:24,color:C.dim})+T(`${Vt}=${Rt}\\,${It}`,840,385,{size:50})
     +fade(seg(p,.6,.75),L('→ 衝突モデルから 導いた',840,455,{size:26,color:C.hi,weight:700}))));
   return s;};
  return o;
 })(),
 // ===== S6 銅で確かめる =====
 ...(()=>{
  const data=(g=1,more=0)=>card(40,70,470,400,
    L('銅（実験値）',275,120,{size:26,color:C.dim})
    +T(`${sig}\\approx5.96\\times10^{7}\\,/(\\Omega\\cdot\\mathrm{m})`,275,190,{size:32})
    +L('中級と 同じ',275,250,{size:22,color:C.dim})+T(`n\\approx8.5\\times10^{28}\\,/\\mathrm{m^3}`,275,295,{size:32})
    +fade(more,T(`m=9.11\\times10^{-31}${U('kg')}`,275,370,{size:30})+T(`${et}=1.6\\times10^{-19}${U('C')}`,275,430,{size:30})),g);
  const o={};
  o[K+'cu:data']=(p)=>data(seg(p,0,.2))+fade(seg(p,.5,.7),L('この 2つから',840,220,{size:28})+L('衝突の 時間 τ を 求める',840,280,{size:30,color:TC,weight:700}));
  o[K+'cu:tau']=(p)=>data()+TF(`${sig}=\\dfrac{n${et}^2${tau}}{m}`,840,160,{size:46})
    +fade(seg(p,.2,.35),L('τ について 解く',840,265,{size:24,color:C.hi,weight:700}))+TF(`${tau}=\\dfrac{m\\,${sig}}{n${et}^2}`,840,380,{size:54,g:seg(p,.35,.6)});
  o[K+'cu:taunum']=(p)=>data(1,seg(p,0,.2))+TF(`${tau}=\\dfrac{m\\,${sig}}{n${et}^2}`,840,120,{size:42})
    +TF(`=\\dfrac{9.11\\times10^{-31}\\times5.96\\times10^{7}}{8.5\\times10^{28}\\times(1.6\\times10^{-19})^2}`,840,240,{size:30,maxW:620,g:seg(p,.15,.35)})
    +TF(`\\approx2.5\\times10^{-14}${U('s')}`,840,350,{size:44,box:true,g:seg(p,.35,.55)})
    +fade(seg(p,.65,.8),L('1秒に 約 40兆 回 ぶつかる',840,450,{size:26,color:C.hi,weight:700}));
  o[K+'cu:je']=(p)=>card(60,60,1080,190,L('断面積 1 mm² ＝ 10⁻⁶ m²，I ＝ 1 A',600,105,{size:26,color:C.dim})
     +T(`${js}=\\dfrac{${It}}{${St}}=\\dfrac{1}{10^{-6}}=10^{6}${U('A/m^2')}`,600,190,{size:40}),seg(p,0,.2))
    +TF(`${Es}=\\dfrac{${js}}{${sig}}=\\dfrac{10^{6}}{5.96\\times10^{7}}\\approx0.017${U('V/m')}`,600,370,{size:44,g:seg(p,.45,.7)});
  o[K+'cu:v']=(p)=>TF(`${Es}\\approx0.017${U('V/m')}`,600,70,{size:34,g:.7})
    +TF(`${vs}=\\dfrac{${et}${tau}${Es}}{m}=\\dfrac{1.6\\times10^{-19}\\times2.5\\times10^{-14}\\times0.017}{9.11\\times10^{-31}}`,600,190,{size:36,g:seg(p,0,.25)})
    +TF(`\\approx7\\times10^{-5}${U('m/s')}`,600,300,{size:48,box:true,g:seg(p,.3,.5)})
    +fade(seg(p,.55,.75),card(260,370,680,110,L('中級：I ＝ enSv から',600,410,{size:24,color:C.dim})+L('約 7×10⁻⁵ m/s と 一致 ✓',600,458,{size:28,color:OK,weight:700})));
  o[K+'cu:r']=(p)=>TF(`${Rt}=${rho}\\,\\dfrac{l}{${St}}=\\dfrac{1.68\\times10^{-8}\\times1}{10^{-6}}\\approx0.017${U('\\Omega')}`,600,110,{size:42,g:seg(p,0,.25)})
    +fade(seg(p,.1,.25),L('ρ ＝ 1/σ ≈ 1.68×10⁻⁸ Ω·m，l ＝ 1 m',600,215,{size:24,color:C.dim}))
    +TF(`${Vt}=${Rt}\\,${It}\\approx0.017${U('V')}`,370,340,{size:44,g:seg(p,.35,.55)})
    +fade(seg(p,.6,.8),TF(`=${Es}\\times l\\approx0.017${U('V/m')}\\times1${U('m')}`,850,340,{size:34})+L('同じ ✓',850,430,{size:28,color:OK,weight:700}));
  o[K+'cu:sum']=(p)=>{
   const items=[['加速 ⇄ 衝突',`m\\dfrac{d${bv}}{dt}=-${et}${bE}-\\dfrac{m${bv}}{${tau}}`],['定常',`${bv}=-\\dfrac{${et}${tau}}{m}${bE}`],['電流密度',`${bj}=${sig}${bE}`],['導線全体',`${Rt}=${rho}\\dfrac{l}{${St}}`]];
   let s='';items.forEach(([t,f],i)=>{const g=seg(p,.05+i*.15,.2+i*.15),y=75+i*115;
    s+=fade(g,label(t,200,y+10,{size:26,color:C.hi,weight:700,anchor:'end'})+T(f,560,y,{size:38})+(i<3?arrow(560,y+40,560,y+68,{color:C.dim,w:3,head:10}):''));});
   return s;};
  o[K+'cu:next']=(p)=>{
   const glow=seg(p,.1,.5);
   let s=rect(80,180,560,110,{fill:HEAT,fo:.1+.3*glow,stroke:HEAT,sw:3,rx:20});
   s+=fade(glow,[140,240,340,440,540].map(x=>draw([[x,170],[x+12,140],[x-6,115],[x+8,90]],1,{color:HEAT,w:3})).join(''));
   s+=label('衝突で 渡した エネルギー → 熱',360,340,{size:26,color:HEAT,anchor:'middle',weight:700});
   s+=card(700,90,460,330,L('次の 問い',930,140,{size:24,color:C.dim})+L('送電線の 損失を',930,215,{size:30})+L('減らすには',930,265,{size:30})
    +L('なぜ 電圧を 上げる？',930,345,{size:32,color:C.hi,weight:700}),seg(p,.35,.5),C.hi);
   return s;};
  return o;
 })(),
};
