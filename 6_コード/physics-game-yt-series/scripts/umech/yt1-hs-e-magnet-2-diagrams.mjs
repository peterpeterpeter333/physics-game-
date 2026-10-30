// 高校編「磁場と電磁誘導・深く学ぶ 2/4」(ys-hs-e-magnet-2) — 図。Stage 1200×515.
// 色：電流 I 緑（⊙⊗ 記号と「I」）、力 𝐅 緑（太い矢印と「F」）、磁場 𝐁 橙、長さ l 白。
// 向き（検算済み。x 右・y 上・z 手前）：⊙(+z) と 𝐁 右(+x) → ẑ×x̂＝+ŷ（上）。⊗ → 下。𝐁 左 → 下。
//   縦の導線（電流 上 +ŷ）と 𝐁 奥(−ẑ) → ŷ×(−ẑ)＝−x̂（左）。モーター：左の辺 ⊙ 上・右の辺 ⊗ 下 → 時計回り。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly} from './anim.mjs';
import {card,tag,FA,BC,IC,FC,NP,SP,SURF,BAD,RAD,T,cs,vB,vF,Bt,It,Ft,U,outSym,inSym,sym,wireTop,head,fieldCircle,fieldRows,uMagnet,Qcard,barMagnet} from './yt1-hs-e-magnet-1-diagrams.mjs';

const K='hs-e-magnet-2:';
const lt=cs(C.ink,'l');
const LAW=`${Ft}=${Bt}${It}${lt}`;
const crossX=(x,y,r=26,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:BAD,w:6})+line(x-r,y+r,x+r,y-r,{color:BAD,w:6}));
// ---- flat view: uniform B to the right (dir) with a wire ⊙/⊗ ------------------------------------------
const W={x:400,y:262};
function flat({kind='out',dir=1,F=0,Flen=150,Ftext='F',g=1,rowsG=1,blab=1,x=W.x,y=W.y,x0=70,x1=740,wlab='I'}={}){
 let s=fieldRows(x0,x1,[y-170,y-90,y,y+90,y+170],{g:rowsG,dir,len:70,gap:120});
 if(blab)s+=fade(blab,T(vB,x1+20,y-160,{size:36,anchor:'start'})+label(dir>0?'右向き':'左向き',x1+20,y-110,{size:24,color:BC,weight:700}));
 s+=rect(x-36,y-36,72,72,{fill:C.bg,fo:1,stroke:'none',rx:36});
 s+=wireTop(x,y,kind,{r:24,text:wlab,dx:6,dy:-6});
 if(F){const up=F>0?-1:1;s+=FA(x,y+up*30,x,y+up*(30+Flen),{text:'',w:11,head:28});s+=label(Ftext,x+26,y+up*(30+Flen*.6)+10,{size:34,color:FC,weight:700});}
 return fade(g,s);
}
// ---- total field around a ⊙ wire in a uniform field: arrows on a grid ------------------------------------
function combined({g=1,k=1,x=W.x,y=W.y}={}){
 let s='';
 for(let gx=x-300;gx<=x+300;gx+=60)for(let gy=y-180;gy<=y+180;gy+=60){const dx=gx-x,dy=-(gy-y),r=Math.hypot(dx,dy);if(r<45)continue;
  // wire field (ccw): ẑ×r̂ / r  → (−dy, dx)/r²
  const c=75*k;let bx=1+c*(-dy)/(r*r),by=c*dx/(r*r);const m=Math.hypot(bx,by),L=mix(4,80,clamp(m/2.4));
  const ux=bx/m,uy=-by/m;s+=arrow(gx-ux*L/2,gy-uy*L/2,gx+ux*L/2,gy+uy*L/2,{color:BC,w:3.5,head:12});}
 return fade(g,s);
}
// ---- Fleming left-hand triad (oblique): middle = current (toward viewer), index = B (right), thumb = F (up) --
function triad(ox,oy,{g=1,a=[1,1,1],lab=[1,1,1],k=1}={}){
 const P=(x,y,z)=>[ox+x-.55*z,oy-y+.4*z];
 let s=`<ellipse cx="${ox-10}" cy="${oy+14}" rx="46" ry="34" fill="#e2b48f" opacity=".9"/>`;
 const [zx,zy]=P(0,0,190),[bx,by]=P(190,0,0),[fx,fy]=P(0,170,0);
 s+=fade(a[0],arrow(ox,oy,zx,zy,{color:IC,w:7,head:20}))+fade(a[0]*lab[0],label('中指 ＝ 電流 I（手前）',zx-10,zy+38,{size:26,color:IC,weight:700,anchor:'middle'}));
 s+=fade(a[1],arrow(ox,oy,bx,by,{color:BC,w:7,head:20}))+fade(a[1]*lab[1],label('人差し指 ＝ 磁場 𝐁',bx+14,by+9,{size:26,color:BC,weight:700}));
 s+=fade(a[2],arrow(ox,oy,fx,fy,{color:FC,w:11,head:26}))+fade(a[2]*lab[2],label('親指 ＝ 力 𝐅',fx+18,fy+10,{size:26,color:FC,weight:700}));
 return fade(g,s);
}
// ---- region of B into the screen with a vertical wire (length l inside) ----------------------------------
function lenFig({g=1,F=0,lab=1}={}){
 let s=rect(250,90,320,330,{fill:BC,fo:.06,stroke:BC,sw:2,rx:10});
 for(let x=290;x<=540;x+=62)for(let y=125;y<=400;y+=62)s+=inSym(x,y,10,BC,.7);
 s+=T(vB,580,120,{size:32,anchor:'start'})+label('奥向き',580,165,{size:24,color:BC,weight:700});
 s+=line(410,40,410,480,{color:IC,w:7})+arrow(410,300,410,180,{color:IC,w:7,head:22})+label('I',428,200,{size:30,color:IC,weight:700});
 s+=fade(lab,line(200,90,200,420,{color:C.ink,w:2.5})+line(190,90,210,90,{color:C.ink,w:2.5})+line(190,420,210,420,{color:C.ink,w:2.5})+T(lt,180,265,{size:40,anchor:'end'})+label('磁場の 中の 長さ',180,310,{size:22,color:C.dim,anchor:'end'}));
 if(F)s+=fade(F,FA(395,262,260,262,{w:11,head:28})+label('F',300,240,{size:34,color:FC,weight:700}));
 return fade(g,s);
}
// ---- motor: rectangular coil seen in cross-section ---------------------------------------------------------
function motor({g=1,F=1,rot=0,swap=false,ang=0,cx=600,cy=270,R=170,rows=1}={}){
 let s=fieldRows(80,1120,[cy-150,cy-75,cy+75,cy+150],{g:rows,len:70,gap:130});
 const a=ang*RAD,lx=cx-R*Math.cos(a),ly=cy+R*Math.sin(a),rx=cx+R*Math.cos(a),ry=cy-R*Math.sin(a);
 s+=line(lx,ly,rx,ry,{color:IC,w:3,dash:'10 8',opacity:.7})+dot(cx,cy,7,C.dim);
 const L=swap?'in':'out',Rk=swap?'out':'in';
 s+=rect(lx-30,ly-30,60,60,{fill:C.bg,fo:1,stroke:'none',rx:30})+rect(rx-30,ry-30,60,60,{fill:C.bg,fo:1,stroke:'none',rx:30});
 s+=sym(L,lx,ly,24)+sym(Rk,rx,ry,24);
 if(F){const fl=L==='out'?-1:1;s+=fade(F,FA(lx,ly+fl*30,lx,ly+fl*140,{w:10,head:26})+FA(rx,ry-fl*30,rx,ry-fl*140,{w:10,head:26}));}
 if(rot){const sense=swap?-1:1;const pts=Array.from({length:31},(_,i)=>{const t=(60-sense*100*i/30)*RAD;return [cx+70*Math.cos(t),cy-70*Math.sin(t)];});
  s+=fade(rot,draw(pts,1,{color:C.hi,w:4})+head(pts[30][0],pts[30][1],pts[30][0]-pts[28][0],pts[30][1]-pts[28][1],{color:C.hi,L:18}));}
 return fade(g,s);
}
// ---- coil with a horizontal axis, a bar magnet on the right, and a meter on top (used again in 3/4) --------
export function meter(x,y,needle=0,{R=48,g=1}={}){
 let s=ring(x,y,R,{color:SURF,w:3,fill:'#172238'});
 for(const t of [-1,-.5,0,.5,1]){const a=(90-50*t)*RAD;s+=line(x+(R-8)*Math.cos(a),y+18-(R-8)*Math.sin(a),x+(R-16)*Math.cos(a),y+18-(R-16)*Math.sin(a),{color:C.dim,w:2});}
 const a=(90-50*clamp(needle,-1,1))*RAD;s+=line(x,y+18,x+(R-10)*Math.cos(a),y+18-(R-10)*Math.sin(a),{color:C.hi,w:4})+dot(x,y+18,5,C.hi);
 return fade(g,s);
}
const ell=(cx,cy,rx,ry,a0,a1,n=30)=>Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});
// coil centre (cx,cy), turns between cx−hw … cx+hw. mx: centre of the magnet (N faces the coil, i.e. N on the left of the bar).
export function coilRig({cx=420,cy=300,hw=80,ry=90,turns=5,mx=900,needle=0,g=1,meterG=1,magG=1,lab=1,mdir=-1}={}){
 let s='';const dx=2*hw/(turns-1);
 for(let i=0;i<turns;i++)s+=draw(ell(cx-hw+i*dx,cy,22,ry,90,270),1,{color:IC,w:4,opacity:.4});
 for(let i=0;i<turns;i++)s+=draw(ell(cx-hw+i*dx,cy,22,ry,-90,90),1,{color:IC,w:5});
 if(meterG){s+=fade(meterG,draw([[cx-hw,cy-ry],[cx-hw,90],[cx-55,90]],1,{color:IC,w:3})+draw([[cx+hw,cy-ry],[cx+hw,90],[cx+55,90]],1,{color:IC,w:3})+meter(cx,90-18,needle)+label('電流計',cx+70,60,{size:22,color:C.dim}));}
 if(lab)s+=label('コイル',cx,cy+ry+42,{size:24,color:IC,anchor:'middle'});
 s+=fade(magG,barMagnet(mx,cy,{hl:90,hh:30,dir:mdir,size:30}));
 return fade(g,s);
}

export const hsEMagnet2Diagrams={
 // ================= S1 前回の問い =================
 [K+'recap']:(p)=>fieldCircle(330,262,150,1,{nh:4,phase:22.5,w:3,g:seg(p,.05,.3)})+wireTop(330,262,'out',{r:26})
  +card(640,150,500,180,label('電流 → 円い 磁場',890,250,{size:38,color:BC,anchor:'middle',weight:700}),seg(p,.3,.5),BC),
 [K+'q']:(p)=>uMagnet(330,262)+outSym(330,262,24)+label('I',360,282,{size:30,color:IC,weight:700})+Qcard('磁場の 中の 電流は','力を 受ける？ 向きと 大きさは？',{g:seg(p,.05,.25),x:640,y:140,w:520,h:220,bsize:30}),
 [K+'setup']:(p)=>{
  let s=uMagnet(500,262,{gap:520,field:seg(p,.4,.65),rows:[-110,-40,40,110],step:110});
  s+=fade(seg(p,.1,.3),ring(500,262,22,{color:C.dim,w:4,fill:'#101a30'})+label('導線',540,232,{size:26,color:C.dim}));
  s+=fade(seg(p,.6,.8),label('N → S',500,70,{size:30,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'guess']:(p)=>{
  let s=uMagnet(500,262,{gap:520,rows:[-110,-40,40,110],step:110})+ring(500,262,22,{color:C.dim,w:4,fill:'#101a30'});
  s+=fade(seg(p,.05,.25),label('一様 ＝ どこでも 同じ 向きと 強さ',600,480,{size:28,color:BC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('？',500,140,{size:56,color:C.hi,anchor:'middle',weight:700})+label('？',640,280,{size:48,color:C.hi,anchor:'middle',weight:700})+label('？',360,280,{size:48,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S2 力の向き =================
 [K+'jump']:(p)=>{
  let s=flat({F:seg(p,.15,.4)>0?1:0,Flen:150*seg(p,.15,.4)+1});
  s+=card(820,250,350,170,label('磁場とも 電流とも',995,315,{size:26,color:C.ink,anchor:'middle'})+label('垂直な 向き',995,370,{size:34,color:FC,anchor:'middle',weight:700}),seg(p,.4,.6),FC);
  s+=tag('法則（実験）',995,460,{g:seg(p,.65,.8)});
  return s;
 },
 [K+'flat']:(p)=>{
  let s=flat({rowsG:seg(p,.05,.3),blab:seg(p,.15,.35),g:1});
  s+=fade(seg(p,.5,.7),label('電流：手前向き',W.x,W.y+72,{size:26,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'up']:(p)=>{
  let s=flat({F:1,Flen:30+120*seg(p,.05,.35)});
  s+=fade(seg(p,.5,.7),card(830,250,330,190,label('力 F：太い 矢印',995,315,{size:28,color:FC,anchor:'middle',weight:700})+label('電流 I：⊙ と I',995,385,{size:28,color:IC,anchor:'middle',weight:700}),1,C.faint));
  return s;
 },
 [K+'flip']:(p)=>{
  let s=`<g transform="translate(-20 40) scale(.7)">${flat({kind:'in',F:-1,Flen:130,x0:90,x1:720,blab:0})}</g>`;
  s+=fade(seg(p,.45,.6),`<g transform="translate(580 40) scale(.7)">${flat({kind:'out',dir:-1,F:-1,Flen:130,x0:90,x1:720,blab:0})}</g>`);
  s+=label('電流 ⊗ → 力は 下',260,40,{size:28,color:C.ink,anchor:'middle',weight:700})+label('𝐁 右向き',260,485,{size:26,color:BC,anchor:'middle',weight:700});
  s+=fade(seg(p,.45,.6),label('磁場 左向き → 力は 下',860,40,{size:28,color:C.ink,anchor:'middle',weight:700})+label('𝐁 左向き',860,485,{size:26,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why']:(p)=>flat({rowsG:1-.5*seg(p,.3,.6)})+fieldCircle(W.x,W.y,110,1,{g:seg(p,.3,.6),nh:4,phase:0,w:4})+fade(seg(p,.6,.8),label('重ねる',900,260,{size:36,color:C.hi,anchor:'middle',weight:700})),
 [K+'above']:(p)=>{
  let s=flat({rowsG:.5})+fieldCircle(W.x,W.y,110,1,{nh:4,phase:0,w:4});
  const y=W.y-110;
  s+=fade(seg(p,.2,.45),arrow(W.x+10,y-40,W.x-80,y-40,{color:BC,w:6,head:18})+arrow(W.x-40,y-75,W.x+50,y-75,{color:BC,w:6,head:18,opacity:.8}));
  s+=fade(seg(p,.5,.7),highlight(W.x-130,y-110,260,110,1,C.dim)+label('上側：弱め合う → 弱い',800,240,{size:30,color:C.dim,weight:700}));
  return s;
 },
 [K+'below']:(p)=>{
  let s=flat({rowsG:.5})+fieldCircle(W.x,W.y,110,1,{nh:4,phase:0,w:4});
  s+=highlight(W.x-130,W.y-220,260,110,1,C.dim)+label('上側：弱め合う → 弱い',800,240,{size:30,color:C.dim,weight:700});
  const y=W.y+110;
  s+=fade(seg(p,.1,.4),arrow(W.x-60,y+40,W.x+40,y+40,{color:BC,w:6,head:18})+arrow(W.x-40,y+75,W.x+50,y+75,{color:BC,w:6,head:18}));
  s+=fade(seg(p,.4,.6),highlight(W.x-130,y,260,110,1,BC)+label('下側：強め合う → 強い',800,320,{size:30,color:BC,weight:700}));
  return s;
 },
 [K+'push']:(p)=>{
  let s=combined({g:1});
  s+=rect(W.x-34,W.y-34,68,68,{fill:C.bg,fo:1,stroke:'none',rx:34})+wireTop(W.x,W.y,'out',{r:24,dx:6,dy:-6});
  s+=fade(seg(p,.05,.25),label('上：弱い',W.x+330,W.y-130,{size:28,color:C.dim,weight:700})+label('下：強い',W.x+330,W.y+150,{size:28,color:BC,weight:700}));
  s+=fade(seg(p,.35,.6),FA(W.x,W.y-30,W.x,W.y-170,{w:11,head:28})+label('F',W.x+26,W.y-120,{size:34,color:FC,weight:700}));
  s+=fade(seg(p,.5,.7),label('強い 側 → 弱い 側へ',960,250,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'left']:(p)=>triad(330,320,{a:[seg(p,.2,.4),seg(p,.2,.4),seg(p,.2,.4)],lab:[0,0,0]})+card(700,150,440,170,label('フレミングの',920,215,{size:28,color:C.ink,anchor:'middle'})+label('左手の 法則',920,275,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi),
 [K+'fingers']:(p)=>triad(330,320,{lab:[seg(p,.05,.25),seg(p,.3,.5),seg(p,.6,.8)]}),
 [K+'check']:(p)=>`<g transform="translate(0 20) scale(.85)">${triad(300,320)}</g>`+fade(seg(p,.3,.5),`<g transform="translate(560 20) scale(.85)">${flat({F:1,Flen:130,x0:60,x1:640,blab:0})}</g>`)+fade(seg(p,.6,.8),label('同じ 向き',1100,140,{size:30,color:C.hi,anchor:'middle',weight:700})),
 // ================= S3 力の大きさ =================
 [K+'size']:(p)=>{
  let s=lenFig({F:1,lab:seg(p,.45,.65)});
  s+=card(760,140,400,200,label('力は',960,200,{size:28,color:C.ink,anchor:'middle'})+label('電流 I に 比例',960,250,{size:30,color:IC,anchor:'middle',weight:700})+fade(seg(p,.5,.7),label('長さ l に 比例',960,300,{size:30,color:C.ink,anchor:'middle',weight:700})),seg(p,.1,.3),C.faint);
  return s;
 },
 [K+'law']:(p)=>{
  let s=lenFig({F:1});
  s+=fade(seg(p,.05,.25),label('強い 磁場 → 大きい 力',960,130,{size:28,color:BC,anchor:'middle',weight:700}));
  s+=card(760,200,400,180,T(LAW,960,310,{size:72}),seg(p,.4,.6),C.hi)+tag('法則（実験）',960,440,{g:seg(p,.65,.8)});
  return s;
 },
 [K+'para']:(p)=>{
  let s=label('垂直',300,60,{size:30,color:C.ink,anchor:'middle',weight:700})+`<g transform="translate(60 40) scale(.55)">${flat({F:1,Flen:130,x0:60,x1:740,blab:0,wlab:'',Ftext:''})}</g>`;
  s+=T(LAW,300,440,{size:48});
  s+=fade(seg(p,.2,.4),label('平行',880,60,{size:30,color:C.ink,anchor:'middle',weight:700})+fieldRows(660,1120,[150,230,310],{len:70,gap:120})+line(650,270,1120,270,{color:IC,w:7})+arrow(780,270,960,270,{color:IC,w:7,head:22})+label('I',870,250,{size:28,color:IC,weight:700}));
  s+=fade(seg(p,.4,.6),T(`${Ft}=0`,880,440,{size:52}));
  return s;
 },
 [K+'sin']:(p)=>{
  let s=fieldRows(80,700,[120,200,280,360,440],{len:70,gap:120,opacity:.6});
  const a=35*RAD;s+=line(390-200*Math.cos(a),280+200*Math.sin(a),390+200*Math.cos(a),280-200*Math.sin(a),{color:IC,w:7})+arrow(390,280,390+120*Math.cos(a),280-120*Math.sin(a),{color:IC,w:7,head:22});
  s+=draw(Array.from({length:13},(_,i)=>{const t=a*i/12;return [390+70*Math.cos(t),280-70*Math.sin(t)];}),1,{color:C.ink,w:3})+label('θ',475,265,{size:28,color:C.ink});
  s+=card(760,140,400,160,T(`${Ft}=${Bt}${It}${lt}\\sin\\theta`,960,240,{size:52}),seg(p,.05,.25),C.faint);
  s+=fade(seg(p,.5,.7),label('この回は 垂直と 平行だけ',960,380,{size:28,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lpart']:(p)=>{
  let s=lenFig({F:1});
  s+=fade(seg(p,.05,.25),highlight(395,90,30,330,1,C.hi));
  s+=fade(seg(p,.5,.7),label('磁場の 外：力 なし',960,180,{size:30,color:C.dim,anchor:'middle',weight:700})+line(430,60,520,60,{color:C.dim,w:2})+line(430,455,520,455,{color:C.dim,w:2}));
  s+=fade(seg(p,.05,.25),label('l ＝ 磁場の 中の 部分',960,300,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 1 T の中身 =================
 [K+'unitq']:(p)=>card(250,120,700,240,label('磁場の 単位 T（テスラ）',600,200,{size:34,color:BC,anchor:'middle',weight:700})+label('中身は？',600,290,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi)+fade(seg(p,.6,.8),T(LAW,600,440,{size:56})),
 [K+'solve']:(p)=>{
  let s=T(LAW,600,110,{size:64});
  s+=fade(seg(p,.1,.3),label('両辺を Il で 割る',600,200,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.65),T(`${Bt}=\\dfrac{${Ft}}{${It}${lt}}`,600,330,{size:74}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=T(`${Bt}=\\dfrac{${Ft}}{${It}${lt}}`,250,180,{size:64});
  s+=fade(seg(p,.05,.3),label('電流 1 A',600,150,{size:32,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.5),label('長さ 1 m',600,230,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.7),label('力 1 N',600,310,{size:32,color:FC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.9),label('→ 1 T',900,230,{size:48,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit2']:(p)=>{
  let s=T(`${Bt}=\\dfrac{${Ft}}{${It}${lt}}`,250,180,{size:64});
  s+=card(520,110,620,210,T(`1${U('T')}=1\\,\\dfrac{\\mathrm{N}}{\\mathrm{A\\cdot m}}`,830,240,{size:64}),seg(p,0,.2),BC);
  s+=tag('定義',830,400,{g:seg(p,.3,.45)});
  s+=fade(seg(p,.6,.8),label('T と N は 別の 単位',250,330,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex6']:(p)=>{
  let s=fade(seg(p,0,.25),label('2 A、長さ 3 m、力 6 N',600,90,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.7),T(`${Bt}=\\dfrac{6${U('N')}}{2${U('A')}\\times 3${U('m')}}`,600,280,{size:66}));
  return s;
 },
 [K+'ex6b']:(p)=>{
  let s=T(`${Bt}=\\dfrac{6${U('N')}}{2${U('A')}\\times 3${U('m')}}`,330,230,{size:58});
  s+=fade(seg(p,.05,.3),T(`=1\\,\\dfrac{\\mathrm{N}}{\\mathrm{A\\cdot m}}=1${U('T')}`,820,230,{size:58}));
  s+=fade(seg(p,.55,.75),label('1 N',820,420,{size:40,color:C.dim,anchor:'middle',weight:700})+crossX(820,405,40)+label('ではない',920,420,{size:30,color:BAD,weight:700}));
  return s;
 },
 // ================= S5 使ってみる =================
 [K+'ex']:(p)=>{
  let s=flat({wlab:'',rowsG:seg(p,0,.2)});
  s+=fade(seg(p,.1,.3),label('0.50 T',870,140,{size:34,color:BC,weight:700}));
  s+=fade(seg(p,.4,.6),label('2.0 A（手前向き）',870,230,{size:30,color:IC,weight:700}));
  s+=fade(seg(p,.7,.85),label('長さ 0.30 m',870,320,{size:30,color:C.ink,weight:700}));
  return s;
 },
 [K+'exq']:(p)=>flat({wlab:''})+label('0.50 T',870,140,{size:34,color:BC,weight:700})+label('2.0 A（手前向き）',870,230,{size:30,color:IC,weight:700})+label('長さ 0.30 m',870,320,{size:30,color:C.ink,weight:700})+fade(seg(p,.2,.4),label('力は？',W.x+180,262,{size:44,color:C.hi,anchor:'middle',weight:700})),
 [K+'calc']:(p)=>{
  let s=T(LAW,600,110,{size:60});
  s+=fade(seg(p,.1,.35),T(`=0.50${U('T')}\\times 2.0${U('A')}\\times 0.30${U('m')}`,600,250,{size:52}));
  s+=fade(seg(p,.55,.75),T(`=0.30${U('N')}`,600,390,{size:66,color:FC})+highlight(470,330,260,100,1,FC));
  return s;
 },
 [K+'calcu']:(p)=>{
  let s=T(`\\mathrm{T}\\times\\mathrm{A}\\times\\mathrm{m}`,600,100,{size:56});
  const c=seg(p,.45,.65);
  const a=`=\\dfrac{\\mathrm{N}}{\\mathrm{A}\\cdot\\mathrm{m}}\\times\\mathrm{A}\\times\\mathrm{m}`,b=`=\\dfrac{\\mathrm{N}}{\\cancel{\\mathrm{A}}\\cdot\\cancel{\\mathrm{m}}}\\times\\cancel{\\mathrm{A}}\\times\\cancel{\\mathrm{m}}`;
  s+=fade(seg(p,.1,.35)*(1-c),T(a,600,250,{size:60}))+fade(c,T(b,600,250,{size:60}));
  s+=fade(seg(p,.7,.85),T(`=\\mathrm{N}`,600,420,{size:66,color:FC}));
  return s;
 },
 [K+'calcd']:(p)=>{
  let s=flat({wlab:'',F:1,Flen:30+120*seg(p,.2,.5),Ftext:'F'});
  s+=label('0.50 T',870,140,{size:34,color:BC,weight:700})+label('2.0 A（手前向き）',870,230,{size:30,color:IC,weight:700});
  s+=fade(seg(p,.5,.7),label('上向き 0.30 N',870,330,{size:38,color:FC,weight:700}));
  return s;
 },
 [K+'feel']:(p)=>{
  let s=flat({wlab:'',F:1,Flen:150,Ftext:'F'})+label('上向き 0.30 N',870,200,{size:38,color:FC,weight:700});
  s+=fade(seg(p,.2,.45),rect(880,290,90,90,{fill:'#8c97ad',fo:.9,stroke:'none',rx:8})+label('30 g',925,345,{size:28,color:C.bg,anchor:'middle',weight:700})+FA(925,385,925,470,{w:8,head:20})+label('重力',985,450,{size:26,color:FC,weight:700}));
  s+=fade(seg(p,.6,.8),label('≒ 同じくらい',1040,250,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'motor']:(p)=>motor({F:0,rows:seg(p,0,.2)})+fade(seg(p,.4,.6),label('四角い コイル（断面）',600,505,{size:24,color:C.dim,anchor:'middle'})),
 [K+'motor2']:(p)=>motor({F:seg(p,.1,.4),rot:seg(p,.6,.8)})+fade(seg(p,.6,.8),label('時計回り',600,505,{size:30,color:C.hi,anchor:'middle',weight:700})),
 [K+'switch']:(p)=>{
  let s=label('切り替えないと',300,40,{size:28,color:BAD,anchor:'middle',weight:700})+`<g transform="translate(-60 60) scale(.6)">${motor({swap:true,rot:1})}</g>`;
  s+=fade(seg(p,.4,.6),label('半回転ごとに 切り替える',900,40,{size:28,color:C.hi,anchor:'middle',weight:700})+`<g transform="translate(540 60) scale(.6)">${motor({rot:1})}</g>`);
  s+=label('逆回り',300,470,{size:28,color:BAD,anchor:'middle',weight:700})+fade(seg(p,.4,.6),label('同じ 向きに 回り続ける',900,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fan']:(p)=>card(300,110,600,250,label('モーター',600,180,{size:38,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.2,.4),label('扇風機',450,270,{size:32,color:C.ink,anchor:'middle'}))+fade(seg(p,.35,.55),label('電車',750,270,{size:32,color:C.ink,anchor:'middle'})),seg(p,.05,.2),C.hi)+fade(seg(p,.6,.8),label('中身は 磁場の 中の 電流が 受ける 力',600,440,{size:30,color:FC,anchor:'middle',weight:700})),
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>flat({F:1})+card(820,200,350,160,label('電流にも 磁場にも',995,265,{size:26,color:C.ink,anchor:'middle'})+label('垂直な 力',995,320,{size:34,color:FC,anchor:'middle',weight:700}),seg(p,.3,.5),FC),
 [K+'ans2']:(p)=>{
  let s=card(80,60,1040,120,T(LAW,320,135,{size:56})+label('向き：フレミングの 左手',760,135,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.2),C.faint);
  s+=card(80,210,1040,120,label('平行なら 0',320,285,{size:34,color:C.ink,anchor:'middle',weight:700})+T(`1${U('T')}=1\\,\\dfrac{\\mathrm{N}}{\\mathrm{A\\cdot m}}`,760,280,{size:48}),seg(p,.45,.65),C.faint);
  return s;
 },
 [K+'chain']:(p)=>{
  let s=card(100,120,440,110,label('電流 → 磁場',320,190,{size:36,color:BC,anchor:'middle',weight:700}),seg(p,0,.2),C.faint)+label('1/4',320,270,{size:24,color:C.dim,anchor:'middle'});
  s+=card(660,120,440,110,label('磁場 × 電流 → 力',880,190,{size:36,color:FC,anchor:'middle',weight:700}),seg(p,.3,.5),C.faint)+fade(seg(p,.3,.5),label('2/4',880,270,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),label('電気と 磁気が つながる',600,400,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=motor({F:0});
  s+=fade(seg(p,.2,.4),`<g>${line(600,270,600,470,{color:C.dim,w:6})+rect(560,460,80,20,{fill:'#e2b48f',fo:1,stroke:'none',rx:8})}</g>`+label('手で 回す',700,470,{size:28,color:C.ink,weight:700}));
  s+=fade(seg(p,.55,.75),label('どうなる？',600,60,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  const u=seg(p,.15,.6);
  let s=coilRig({mx:mix(1000,760,u),needle:.6*Math.sin(Math.PI*u)});
  s+=fade(seg(p,.15,.3),arrow(mix(1000,760,u)+110,420,mix(1000,760,u)+10,420,{color:C.ink,w:4,head:14}));
  s+=fade(seg(p,.6,.8),label('何が 変わると 流れる？',900,140,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bye']:(p)=>card(300,150,600,180,label('次回：深く学ぶ 3/4',600,230,{size:38,color:C.hi,anchor:'middle',weight:700})+label('磁束と 電磁誘導',600,290,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi),
};
