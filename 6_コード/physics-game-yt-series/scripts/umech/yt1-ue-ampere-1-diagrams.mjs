// YouTube シリーズ「アンペールの法則・上級 1/3」(ys-ue-ampere-1) — 図。Stage 1200×515.
// 色：𝐁・d𝐁 橙(C.E)、電流 I・欠片 d𝐥 緑(C.F)、𝐫̂ 桃(C.p)、距離 r・R 白、𝐄 水色、dq 桃、強調 黄、誤り 赤。
// 向き：⊙＝画面の手前向き、⊗＝奥向き。円形電流は正面から見て反時計回り → 中心の d𝐁 はすべて ⊙。
//   欠片の向き（画面座標）：角 a（数学の向き）の点で反時計回りの接線は (−sin a, −cos a)、中心へ向く 𝐫̂ は (−cos a, sin a)。
//   d𝐥×𝐫̂ の z 成分（手前＋）＝ dlx·ry − dly·rx（数学座標）で確かめて ⊙/⊗ を描く。
// 部品は export して 2/3・3/3 でも使う（関数・定数の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,texWidth,highlight} from './anim.mjs';
import {CB,CI,RAD,cs,T,card,outSym,inSym,wire,head,circ} from './yt1-um-current-field-1-diagrams.mjs';
import {L,TF} from './yt1-ue-potential-1-diagrams.mjs';

const K='ue-ampere-1:';
export const RH=C.p,EC=C.x,HI=C.hi,BAD=C.a,INK=C.ink,DIM=C.dim;
export {CB,CI,RAD,cs,T,card,outSym,inSym,wire,head,circ,L,TF};
// TeX pieces
export const dl=cs(CI,'d\\mathbf{l}'),rh=cs(RH,'\\hat{\\mathbf{r}}'),dBv=cs(CB,'d\\mathbf{B}'),Bv=cs(CB,'\\mathbf{B}'),Bs=cs(CB,'B'),dBs=cs(CB,'dB'),Ic=cs(CI,'I');
export const BS=`${dBv}=\\dfrac{\\mu_0${Ic}}{4\\pi}\\,\\dfrac{${dl}\\times${rh}}{r^2}`;
export const BSmag=`${dBs}=\\dfrac{\\mu_0${Ic}}{4\\pi}\\,\\dfrac{${cs(CI,'dl')}\\,\\sin\\theta}{r^2}`;
const n2=v=>Number(v.toFixed(2));
// curved rotation arrow around (x,y) from screen angle a0 to a1 (degrees, screen: 0=right, 90=down)
export function turn(x,y,a0,a1,{r=42,color=HI,g=1,w=3.5}={}){
 if(g<=.001)return '';
 const pts=Array.from({length:25},(_,i)=>{const a=(a0+(a1-a0)*i/24)*RAD;return [x+r*Math.cos(a),y+r*Math.sin(a)];});
 const e=pts[24],f=pts[22];
 return fade(g,draw(pts,1,{color,w})+head(e[0],e[1],e[0]-f[0],e[1]-f[1],{color,L:14}));
}
// mixed line: parts are plain text or '$tex$' pieces, centred at (cx,y)
export function mixed(parts,cx,y,{size=28,color=INK,weight=400}={}){
 const w=q=>q.startsWith('$')?texWidth(q.slice(1,-1),size*1.15,false):[...q].reduce((a,ch)=>a+(/[ -~]/.test(ch)?.55:1)*size,0);
 const tot=parts.reduce((a,q)=>a+w(q)+6,-6);let x=cx-tot/2,o='';
 for(const q of parts){const ww=w(q);if(q.startsWith('$'))o+=T(q.slice(1,-1),x+ww/2,y-size*.12,{size:size*1.15});else o+=label(q,x,y,{size,color,weight});x+=ww+6;}
 return o;
}
export function rightMark(x,y,u,v,{s=16,color=INK,g=1}={}){// u,v screen unit vectors
 const a=[x+u[0]*s,y+u[1]*s],b=[x+(u[0]+v[0])*s,y+(u[1]+v[1])*s],c=[x+v[0]*s,y+v[1]*s];
 return fade(g,draw([a,b,c],1,{color,w:2.5}));
}
// ⊙ / ⊗ for a field (orange)
export const bOut=(x,y,r=18,g=1)=>outSym(x,y,r,CB,g);
export const bIn=(x,y,r=18,g=1)=>inSym(x,y,r,CB,g);

// ---- the general piece figure (S2) ----
const PW=[[60,400],[160,380],[250,360],[330,352],[420,360],[520,392],[600,440]];// wire polyline (screen)
const PC=[250,360],PU=[1,0],PP=[440,165];// highlighted piece start, unit dir (approx), point P
function wireCurve(g=1){return fade(g,draw(PW,1,{color:CI,w:5,opacity:.7})+head(600,440,80,48,{color:CI,L:18})+label('I',585,415,{size:28,color:CI,weight:700}));}
function pieceFig({g=1,piece=1,P=1,rline=0,rhat=0,theta=0,turnG=0,dB=0}={}){
 let s=wireCurve(g);
 const [x0,y0]=[200,370],[x1,y1]=[300,355];
 s+=fade(piece,arrow(x0,y0,x1,y1,{color:CI,w:8,head:18})+T(dl,250,410,{size:34}));
 s+=fade(P,dot(PP[0],PP[1],8,INK)+label('P',PP[0]+16,PP[1]-10,{size:30,color:INK,weight:700}));
 const cx=250,cy=362;
 s+=fade(rline,line(cx,cy,PP[0],PP[1],{color:INK,w:2.5,dash:'9 7'})+label('r',(cx+PP[0])/2-26,(cy+PP[1])/2-4,{size:30,color:INK,weight:700}));
 const L0=Math.hypot(PP[0]-cx,PP[1]-cy),ux=(PP[0]-cx)/L0,uy=(PP[1]-cy)/L0;
 s+=fade(rhat,arrow(cx,cy,cx+ux*90,cy+uy*90,{color:RH,w:5,head:15})+T(rh,cx+ux*90-34,cy+uy*90+4,{size:32}));
 if(theta>0){const a0=Math.atan2(y1-y0,x1-x0)/RAD,a1=Math.atan2(uy,ux)/RAD;
  const pts=Array.from({length:21},(_,i)=>{const a=(a0+(a1-a0)*i/20)*RAD;return [cx+52*Math.cos(a),cy+52*Math.sin(a)];});
  s+=fade(theta,draw(pts,1,{color:HI,w:3})+label('θ',cx+64,cy-22,{size:28,color:HI,weight:700}));}
 if(turnG>0){const a0=Math.atan2(y1-y0,x1-x0)/RAD,a1=Math.atan2(uy,ux)/RAD;s+=turn(cx,cy,a0,a1,{r:70,g:turnG});}
 s+=fade(dB,bOut(PP[0],PP[1],22)+T(dBv,PP[0]+36,PP[1]+40,{size:32,anchor:'start'}));
 return s;
}

// ---- the ring (S4) ----
export const O={x:300,y:262},RR=150;
export const rpt=(a,c=O,R=RR)=>[c.x+R*Math.cos(a*RAD),c.y-R*Math.sin(a*RAD)];
export const tanv=a=>[-Math.sin(a*RAD),-Math.cos(a*RAD)];
export const inv=a=>[-Math.cos(a*RAD),Math.sin(a*RAD)];
export function ringWire({c=O,R=RR,g=1,heads=1,w=5,op=1,lab=1}={}){
 let s=ring(c.x,c.y,R,{color:CI,w});
 if(heads)for(const a of [45,135,225,315]){const [x,y]=rpt(a,c,R),[tx,ty]=tanv(a);s+=head(x+tx*12,y+ty*12,tx,ty,{color:CI,L:20});}
 if(lab)s+=label('I',c.x+R*.75+14,c.y-R*.75-10,{size:30,color:CI,weight:700});
 return fade(g*op,s);
}
export function ringPiece(a,{c=O,R=RR,g=1,len=70,dlLab=1,rG=1,rLab=1,w=7}={}){
 const [x,y]=rpt(a,c,R),[tx,ty]=tanv(a),[rx,ry]=inv(a);
 let s=arrow(x-tx*len/2,y-ty*len/2,x+tx*len/2,y+ty*len/2,{color:CI,w,head:16});
 if(dlLab){const ox=Math.cos(a*RAD)*34,oy=-Math.sin(a*RAD)*34;s+=T(dl,x+ox+(Math.abs(Math.cos(a*RAD))>.5?Math.sign(Math.cos(a*RAD))*16:0),y+oy+12,{size:28});}
 s+=fade(rG,arrow(x,y,x+rx*80,y+ry*80,{color:RH,w:5,head:14})+(rLab?T(rh,x+rx*80+(Math.abs(rx)>.5?0:28),y+ry*80+(Math.abs(ry)>.5?(ry>0?34:-14):-18),{size:28}):''));
 return fade(g,s);
}
function radius(a,{c=O,R=RR,g=1,lab='R'}={}){const [x,y]=rpt(a,c,R);return fade(g,line(c.x,c.y,x,y,{color:INK,w:2.5,dash:'9 7'})+label(lab,(c.x+x)/2+8,(c.y+y)/2-10,{size:30,color:INK,weight:700}));}
const ringBase=(o={})=>ringWire(o)+dot(O.x,O.y,6,DIM);

// ---- Coulomb vs Biot–Savart rows (S3) ----
const dq=cs(RH,'dq'),dEv=cs(EC,'d\\mathbf{E}');
const COUL=`${dEv}=${cs(HI,'k')}\\,\\dfrac{${dq}\\;\\hat{\\mathbf{r}}}{r^2}`;
const BIOT=`${dBv}=${cs(HI,'\\dfrac{\\mu_0}{4\\pi}')}\\,\\dfrac{${Ic}\\,${dl}\\times\\hat{\\mathbf{r}}}{r^2}`;
function rows({g2=1}={}){
 let s=card(40,40,640,200,L('クーロンの 法則（電荷の 欠片）',360,82,{size:24,color:DIM})+T(COUL,360,175,{size:44}),1);
 s+=card(40,270,640,210,L('ビオ・サバールの 法則（電流の 欠片）',360,312,{size:24,color:DIM})+T(BIOT,360,410,{size:44}),g2);
 return s;
}
function corr(lines,g=1,title='対応'){
 let s=L(title,935,95,{size:26,color:DIM});
 lines.forEach(([tx,gg],i)=>{s+=fade(gg,T(tx,935,190+i*110,{size:40}));});
 return card(720,40,430,440,s,g,HI);
}

// ---- a straight ⊙ wire seen end-on with compass-like arrows (S3 around) ----
function endOn(cx,cy,g=1){
 let s=wire(cx,cy,'out',{text:'I'});
 s+=circ(cx,cy,90,1,{w:3,nh:4,phase:45})+circ(cx,cy,160,1,{w:2.5,nh:6,phase:15,opacity:.6});
 return fade(g,s);
}

export const ytUeAmpere1Diagrams={
 // ===== S1 前回の問い =====
 [K+'prev']:(p)=>{
  // straight wire segment in a field ⊗, force up: I to the right, B into the screen → I l × B = up
  let s='';
  for(const x of [110,205,420,515])for(const y of [150,390])s+=fade(.6,inSym(x,y,13,CB));
  s+=arrow(80,270,560,270,{color:CI,w:7,head:20})+label('I',560,310,{size:30,color:CI,weight:700});
  s+=fade(seg(p,.2,.4),arrow(320,270,320,120,{color:C.F,w:6,head:18})+T(cs(C.F,'\\mathbf{F}'),340,130,{size:34,anchor:'start'}));
  s+=label('𝐁（奥向き ⊗）',110,470,{size:24,color:CB});
  s+=card(640,110,500,260,L('前回：受ける 側',890,160,{size:24,color:DIM})+T(`${cs(C.F,'\\mathbf{F}')}=${Ic}\\,\\mathbf{l}\\times${Bv}`,890,265,{size:52}),seg(p,.1,.3));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(150,60,900,400,L('前回の 最後の 問い',600,110,{size:24,color:DIM}),1,HI);
  s+=L('電流が 作る 磁場を',600,200,{size:34,color:INK,weight:700});
  s+=fade(seg(p,.2,.4),L('電流の 小さな 部分ごとに 足して 求めるには？',600,280,{size:32,color:HI,weight:700}));
  s+=fade(seg(p,.5,.7),label('受ける 側 → 作る 側',600,380,{size:28,color:DIM,anchor:'middle'}));
  return s;
 },
 [K+'recall']:(p)=>{
  let s=wire(300,262,'out',{text:'I'})+circ(300,262,150,1,{w:3.5,nh:4,phase:45});
  s+=line(318,262,450,262,{color:INK,w:2.5,dash:'9 7'})+label('r',380,250,{size:30,color:INK,weight:700});
  s+=card(620,60,520,400,L('中級（アンペールの 法則）',880,105,{size:24,color:DIM})
   +T(`\\oint ${Bv}\\cdot ${cs(C.t,'d\\mathbf{r}')}=\\mu_0${Ic}`,880,190,{size:42})
   +fade(seg(p,.3,.45),L('＋ 対称性（円の 上で B 一定）',880,270,{size:26,color:DIM}))
   +fade(seg(p,.5,.65),T(`${Bs}=\\dfrac{\\mu_0${Ic}}{2\\pi r}`,880,370,{size:50})),1);
  return s;
 },
 [K+'promise']:(p)=>{
  let s=card(60,50,500,330,L('対称性 あり',310,95,{size:26,color:C.F,weight:700})+fade(.9,wire(310,240,'out',{text:''})+circ(310,240,90,1,{w:3,nh:4}))+L('アンペールで 1行',310,365,{size:26,color:INK}),1);
  // odd-shaped wire: no symmetry
  const pts=Array.from({length:61},(_,i)=>{const t=i/60*2*Math.PI;return [910+120*Math.cos(t)+30*Math.cos(3*t),235-80*Math.sin(t)+20*Math.sin(2*t)];});
  s+=card(640,50,500,330,L('対称性 なし',890,95,{size:26,color:BAD,weight:700})+draw(pts,1,{color:CI,w:5})+L('B ＝ ？',890,250,{size:34,color:CB,weight:700})+L('一周の 和だけでは 決まらない',890,365,{size:24,color:INK}),seg(p,.1,.3));
  s+=fade(seg(p,.5,.7),L('中級の 約束：小さな 部分の 磁場を 足して 確かめる → 上級',600,450,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'plan']:(p)=>{
  const items=['① 欠片の 磁場：ビオ・サバールの 法則','② クーロンの 法則と 比べる','③ 円形電流の 中心の 磁場','④ 数で 確かめる'];
  let s=card(180,40,840,330,L('今回の 道筋',600,90,{size:26,color:DIM}),1);
  items.forEach((t,i)=>{s+=fade(seg(p,.05+i*.1,.15+i*.1),label(t,260,160+i*58,{size:30,color:i===2?HI:INK,weight:700}));});
  s+=card(180,395,840,100,L('部品①：小さい 部分の 寄与を 足す',600,455,{size:30,color:HI,weight:700}),seg(p,.6,.75),HI);
  return s;
 },
 // ===== S2 ビオ・サバールの法則 =====
 [K+'piece']:(p)=>{
  let s=pieceFig({piece:seg(p,.3,.5),P:0});
  // tick marks for pieces
  for(let i=1;i<PW.length-1;i++){const [x,y]=PW[i];s+=fade(seg(p,.1,.3),line(x,y-12,x,y+12,{color:INK,w:2}));}
  s+=card(660,110,480,280,L('欠片の 矢印',900,160,{size:26,color:DIM})+T(dl,900,250,{size:56})
   +fade(seg(p,.5,.7),L('長さ dl・電流の 向き',900,340,{size:26,color:CI,weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'rhat']:(p)=>{
  let s=pieceFig({P:seg(p,0,.15),rline:seg(p,.25,.4),rhat:seg(p,.55,.7)});
  s+=card(660,90,480,320,L('欠片 → P',900,140,{size:26,color:DIM})
   +fade(seg(p,.25,.4),L('距離 r',900,215,{size:32,color:INK,weight:700}))
   +fade(seg(p,.55,.7),T(rh,830,300,{size:48})+label('長さ 1 の 矢印',880,310,{size:26,color:RH,weight:700})),1);
  return s;
 },
 [K+'law']:(p)=>{
  let s=pieceFig({rline:1,rhat:1,dB:seg(p,.5,.65)});
  s+=card(620,90,540,320,L('ビオ・サバールの 法則',890,140,{size:26,color:DIM})+T(BS,890,270,{size:46}),seg(p,.1,.3),HI);
  return s;
 },
 [K+'mag']:(p)=>{
  let s=pieceFig({rline:1,rhat:1,theta:seg(p,.45,.6),dB:1});
  s+=card(620,70,540,360,L('大きさ',890,115,{size:26,color:DIM})+T(BSmag,890,225,{size:42})
   +fade(seg(p,.2,.35),L('I・dl に 比例，r² に 反比例',890,320,{size:26,color:INK}))
   +fade(seg(p,.5,.65),L('外積 → sinθ',890,385,{size:28,color:HI,weight:700})),1);
  return s;
 },
 [K+'dir']:(p)=>{
  let s=pieceFig({rline:1,rhat:1,turnG:seg(p,.35,.55),dB:seg(p,.6,.75)});
  s+=card(620,90,540,320,L('向き',890,140,{size:26,color:DIM})
   +mixed([`$${dl}$`,'とも',`$${rh}$`,'とも 直角'],890,215,{size:28})
   +fade(seg(p,.35,.55),mixed([`$${dl}$`,'から',`$${rh}$`,'へ 回す'],890,285,{size:28,color:HI,weight:700}))
   +fade(seg(p,.6,.75),L('右ねじは 手前 → ⊙',890,355,{size:30,color:CB,weight:700})),1);
  return s;
 },
 [K+'angle']:(p)=>{
  // a single piece at (330,262) pointing right; points around it
  const cx=330,cy=262;let s=line(80,cy,600,cy,{color:DIM,w:2,dash:'8 8'});
  s+=arrow(cx-45,cy,cx+45,cy,{color:CI,w:8,head:18})+T(dl,cx,cy+44,{size:30});
  s+=fade(seg(p,.1,.3),bOut(cx,cy-150,30)+label('真横：最大',cx+44,cy-142,{size:26,color:CB,weight:700}));
  s+=fade(seg(p,.2,.4),bIn(cx,cy+150,30)+label('真横（下）：最大',cx+44,cy+158,{size:26,color:CB,weight:700}));
  s+=fade(seg(p,.3,.5),bOut(cx+170,cy-80,14));
  s+=fade(seg(p,.5,.7),dot(560,cy,9,INK)+label('0',560,cy-22,{size:30,color:HI,anchor:'middle',weight:700})+dot(100,cy,9,INK)+label('0',100,cy-22,{size:30,color:HI,anchor:'middle',weight:700}));
  s+=card(660,110,480,290,L('sinθ の 効果',900,160,{size:26,color:DIM})
   +L('真横：sin90° ＝ 1',900,235,{size:30,color:CB,weight:700})
   +fade(seg(p,.5,.7),L('延長線の 上：sin0° ＝ 0',900,310,{size:30,color:HI,weight:700})),1);
  return s;
 },
 [K+'steady']:(p)=>{
  // closed circuit with the same current everywhere
  const pts=[[100,120],[540,120],[540,420],[100,420],[100,120]];
  let s=draw(pts,1,{color:CI,w:5});
  [[320,120,1,0],[540,270,0,1],[320,420,-1,0],[100,270,0,-1]].forEach(([x,y,dx,dy],i)=>{s+=head(x+dx*12,y+dy*12,dx,dy,{color:CI,L:22});s+=fade(seg(p,.2+i*.08,.3+i*.08),label('I',x+(dy?24:0),y+(dx?-18:8),{size:28,color:CI,weight:700}));});
  s+=fade(seg(p,.5,.65),L('どこでも 同じ I',320,280,{size:28,color:INK,weight:700}));
  s+=card(640,70,520,380,L('定常電流',900,125,{size:30,color:HI,weight:700})
   +fade(seg(p,.15,.3),L('時間で 変わらない',900,200,{size:28,color:INK}))
   +fade(seg(p,.3,.45),L('どこにも 電荷が たまらない',900,265,{size:28,color:INK}))
   +fade(seg(p,.65,.8),L('実験に 基づく 法則',900,365,{size:30,color:CB,weight:700})),1);
  return s;
 },
 [K+'whole']:(p)=>{
  const pts=[[100,120],[540,120],[540,420],[100,420],[100,120]];
  let s=draw(pts,1,{color:CI,w:5,opacity:.5});
  s+=arrow(270,120,370,120,{color:CI,w:9,head:18});
  s+=fade(seg(p,.15,.35),line(280,80,360,160,{color:BAD,w:5})+line(280,160,360,80,{color:BAD,w:5})+L('欠片だけには 流せない',320,200,{size:26,color:BAD,weight:700}));
  s+=fade(seg(p,.55,.75),draw(pts,1,{color:CI,w:6})+L('確かめるのは 全部の 和',320,300,{size:28,color:HI,weight:700}));
  s+=card(640,110,520,280,L('実験で 確かめるもの',900,165,{size:26,color:DIM})+fade(seg(p,.55,.75),T(`${Bv}=\\int ${dBv}`,900,280,{size:56})),1);
  return s;
 },
 [K+'sum']:(p)=>{
  // S-shaped wire passing P; signs of dl×r̂ per piece
  const Pp=[330,250];const W=Array.from({length:13},(_,i)=>{const t=i/12;return [80+480*t,250+150*Math.sin(2*Math.PI*t+.3)];});
  let s=draw(W,1,{color:CI,w:5});s+=head(W[12][0],W[12][1],W[12][0]-W[11][0],W[12][1]-W[11][1],{color:CI,L:18});
  s+=dot(Pp[0],Pp[1],8,INK)+label('P',Pp[0]+14,Pp[1]-14,{size:30,color:INK,weight:700});
  for(let i=0;i<12;i++){const a=W[i],b=W[i+1],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
   const dx=b[0]-a[0],dy=-(b[1]-a[1]),rx=Pp[0]-mx,ry=-(Pp[1]-my),z=dx*ry-dy*rx;
   const g=seg(p,.1+i*.03,.18+i*.03);
   s+=fade(g,(z>0?bOut:bIn)(mx+(my<250?0:0),my+(my<Pp[1]?-30:30),12));}
  s+=card(640,90,520,330,L('全体の 磁場',900,140,{size:26,color:DIM})+T(`${Bv}=\\int ${dBv}`,900,235,{size:52})
   +fade(seg(p,.55,.7),L('ベクトルとして 足す',900,315,{size:28,color:HI,weight:700}))
   +fade(seg(p,.7,.85),L('⊙ と ⊗ は 打ち消し合う',900,375,{size:26,color:CB})),1);
  return s;
 },
 // ===== S3 クーロンと比べる =====
 [K+'coul']:(p)=>rows({g2:seg(p,.5,.7)}),
 [K+'map']:(p)=>rows()+corr([[`${dq}\\;\\longleftrightarrow\\;${Ic}\\,${dl}`,seg(p,.1,.3)],[`${cs(HI,'k')}\\;\\longleftrightarrow\\;${cs(HI,'\\dfrac{\\mu_0}{4\\pi}')}`,seg(p,.5,.7)]]),
 [K+'inv2']:(p)=>{
  let s=rows();
  s+=corr([[`\\dfrac{1}{r^2}`,seg(p,.05,.25)],[`\\dfrac{\\mu_0}{4\\pi}\\approx 10^{-7}`,seg(p,.5,.7)]],1,'共通：距離の 2乗に 反比例');
  s+=fade(seg(p,.5,.7),L('T·m/A',935,410,{size:26,color:DIM}));
  return s;
 },
 [K+'diff']:(p)=>{
  // left: charge piece → d𝐄 along r̂ ; right: current piece → d𝐁 ⊙ perpendicular
  let s=card(60,40,520,430,mixed(['電場：',`$${rh}$`,'と 同じ 向き'],320,85,{size:26,color:EC,weight:700}),1);
  s+=ring(160,300,16,{color:RH,w:3,fill:'#3a1d2a'})+label('dq',150,350,{size:26,color:RH});
  s+=line(160,300,440,170,{color:INK,w:2,dash:'8 7'})+dot(440,170,7,INK)+label('P',452,160,{size:26,color:INK,weight:700});
  s+=arrow(440,170,530,128,{color:EC,w:5,head:15})+T(dEv,500,110,{size:30});
  s+=card(620,40,520,430,mixed(['磁場：',`$${rh}$`,'と 直角'],880,85,{size:26,color:CB,weight:700}),seg(p,.3,.45));
  s+=fade(seg(p,.3,.45),arrow(680,300,780,300,{color:CI,w:7,head:16})+T(dl,730,345,{size:28})+line(730,300,1000,170,{color:INK,w:2,dash:'8 7'})+dot(1000,170,7,INK)+label('P',1012,160,{size:26,color:INK,weight:700}));
  s+=fade(seg(p,.55,.7),bOut(1000,170,22)+T(dBv,1000,240,{size:30})+L('手前向き（画面と 直角）',880,430,{size:26,color:CB}));
  return s;
 },
 [K+'around']:(p)=>{
  let s=endOn(300,262,1);
  s+=card(640,110,500,280,mixed(['どの 欠片の',`$${dBv}$`,'も'],890,165,{size:26,color:DIM})+L('導線を 囲む 向き',890,240,{size:34,color:CB,weight:700})
   +fade(seg(p,.5,.7),L('初級：方位磁針が 円に 並ぶ',890,325,{size:26,color:INK})),1);
  return s;
 },
 // ===== S4 円形電流の中心 =====
 [K+'ring']:(p)=>{
  let s=ringWire({g:seg(p,.05,.3)})+radius(-30,{g:seg(p,.3,.45)})+fade(seg(p,.5,.65),dot(O.x,O.y,8,HI)+label('中心',O.x-14,O.y+36,{size:24,color:HI,anchor:'end'}));
  s+=card(640,110,500,280,L('半径 R の 円形電流',890,165,{size:26,color:DIM})+fade(seg(p,.5,.7),mixed(['中心の',`$${Bs}=\\ ?$`],890,270,{size:40,color:HI,weight:700})),1);
  return s;
 },
 [K+'ringdir']:(p)=>{
  let s=ringBase()+radius(-30);
  s+=fade(seg(p,.2,.5),circ(O.x,O.y,RR+40,1,{color:CI,w:2.5,nh:3,phase:100,opacity:.6}));
  s+=card(640,110,500,280,L('電流の 向き',890,165,{size:26,color:DIM})+L('正面から 見て',890,235,{size:28,color:INK})+L('反時計回り',890,300,{size:36,color:CI,weight:700}),seg(p,.1,.3));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=ringBase()+radius(-30);
  s+=fade(seg(p,.1,.3),label('？',O.x,O.y+16,{size:56,color:HI,anchor:'middle',weight:700}));
  s+=card(640,110,500,280,L('予想',890,165,{size:26,color:DIM})+L('中心の 磁場の 向きは？',890,235,{size:30,color:HI,weight:700})
   +L('⊙ 手前 ／ ⊗ 奥 ／ 画面の 中',890,310,{size:26,color:INK}),1);
  return s;
 },
 [K+'bottom']:(p)=>{
  let s=ringBase({op:.6})+ringPiece(270,{rG:seg(p,.15,.3)});
  const [x,y]=rpt(270);
  s+=turn(x,y,0,-90,{r:46,g:seg(p,.4,.55)});
  s+=fade(seg(p,.6,.75),bOut(O.x,O.y,24)+T(dBv,O.x+34,O.y-26,{size:30,anchor:'start'}));
  s+=card(640,90,500,330,L('一番 下の 欠片',890,140,{size:26,color:DIM})
   +mixed([`$${dl}$`,'：右向き'],890,205,{size:28,color:CI,weight:700})
   +fade(seg(p,.15,.3),mixed([`$${rh}$`,'：上向き（中心へ）'],890,260,{size:28,color:RH,weight:700}))
   +fade(seg(p,.4,.55),L('右 → 上 へ 回す',890,320,{size:28,color:HI}))
   +fade(seg(p,.6,.75),L('右ねじは 手前 → ⊙',890,385,{size:30,color:CB,weight:700})),1);
  return s;
 },
 [K+'left']:(p)=>{
  let s=ringBase({op:.6})+ringPiece(270,{g:.35,dlLab:0,rLab:0})+bOut(O.x,O.y,24)+ringPiece(180,{rG:seg(p,.15,.3)});
  const [x,y]=rpt(180);
  s+=turn(x,y,90,0,{r:46,g:seg(p,.4,.55)});
  s+=card(640,90,500,330,L('左の 欠片',890,140,{size:26,color:DIM})
   +mixed([`$${dl}$`,'：下向き'],890,205,{size:28,color:CI,weight:700})
   +fade(seg(p,.15,.3),mixed([`$${rh}$`,'：右向き（中心へ）'],890,260,{size:28,color:RH,weight:700}))
   +fade(seg(p,.4,.55),L('下 → 右 へ 回す',890,320,{size:28,color:HI}))
   +fade(seg(p,.6,.75),L('やはり 手前 → ⊙',890,385,{size:30,color:CB,weight:700})),1);
  return s;
 },
 [K+'allsame']:(p)=>{
  let s=ringBase({op:.6});
  for(let i=0;i<8;i++){const a=270-45*i;s+=ringPiece(a,{g:seg(p,.05+i*.06,.12+i*.06),len:50,w:6,dlLab:0,rLab:0});}
  s+=bOut(O.x,O.y,30);
  s+=card(640,110,500,280,L('どの 欠片でも',890,165,{size:26,color:DIM})+fade(seg(p,.55,.7),mixed([`$${dBv}$`,'は すべて 手前（⊙）'],890,250,{size:32,color:CB,weight:700})),1);
  return s;
 },
 [K+'sin1']:(p)=>{
  let s=ringBase({op:.6});
  [270,30,150].forEach((a,i)=>{const [x,y]=rpt(a);s+=fade(seg(p,.1+i*.1,.2+i*.1),line(O.x,O.y,x,y,{color:INK,w:2.5,dash:'9 7'})+label('R',(O.x+x)/2+10,(O.y+y)/2+(i===0?0:-6),{size:28,color:INK,weight:700}));});
  {const a=270,[x,y]=rpt(a);s+=ringPiece(a,{dlLab:1,rLab:0})+rightMark(x,y,[1,0],[0,-1],{g:seg(p,.5,.65),color:HI});}
  s+=card(640,90,500,330,L('大きさ',890,140,{size:26,color:DIM})
   +L('どの 欠片も r ＝ R',890,215,{size:30,color:INK,weight:700})
   +fade(seg(p,.5,.65),T(`${dl}\\perp${rh}`,890,285,{size:36}))
   +fade(seg(p,.6,.75),T('\\sin 90^\\circ=1',890,370,{size:42})),1);
  return s;
 },
 [K+'dB']:(p)=>{
  let s=ringBase({op:.6})+ringPiece(270,{rLab:0})+bOut(O.x,O.y,24);
  const hc=seg(p,.45,.6)>.5;
  s+=card(620,90,540,330,L('欠片 1つの 寄与',890,140,{size:26,color:DIM})
   +T(`${dBs}=${hc?`{\\color{${HI}}{\\dfrac{\\mu_0 I}{4\\pi R^2}}}`:`\\dfrac{\\mu_0${Ic}}{4\\pi R^2}`}\\,${cs(CI,'dl')}`,890,250,{size:46})
   +fade(seg(p,.45,.6),L('黄色の 係数：どの 欠片でも 同じ',890,380,{size:26,color:HI,weight:700})),1);
  return s;
 },
 [K+'addmag']:(p)=>{
  let s=ringBase({op:.6});
  for(let i=0;i<8;i++){const a=270-45*i;s+=ringPiece(a,{len:50,w:6,dlLab:0,rLab:0,rG:.5});}
  s+=bOut(O.x,O.y,30);
  s+=card(620,90,540,330,L('向きが そろう',890,140,{size:26,color:DIM})
   +T(`${Bs}=\\int ${dBs}`,890,240,{size:50})
   +fade(seg(p,.4,.6),L('大きさを そのまま 足す',890,350,{size:30,color:HI,weight:700})),1);
  return s;
 },
 [K+'out']:(p)=>{
  let s=ringBase({op:.6})+bOut(O.x,O.y,24);
  s+=card(620,90,540,330,L('係数を 積分の 外へ',890,140,{size:26,color:DIM})
   +T(`${Bs}=\\int\\dfrac{\\mu_0${Ic}}{4\\pi R^2}\\,${cs(CI,'dl')}`,890,230,{size:42})
   +fade(seg(p,.35,.55),T(`=\\dfrac{\\mu_0${Ic}}{4\\pi R^2}\\int ${cs(CI,'dl')}`,890,350,{size:42})),1);
  return s;
 },
 [K+'circum']:(p)=>{
  let s=ringWire({op:.35})+bOut(O.x,O.y,24);
  s+=draw(Array.from({length:121},(_,k)=>rpt(-90+360*k/120)),seg(p,.1,.6),{color:HI,w:7});
  s+=fade(seg(p,.6,.75),label('2πR',O.x+RR+16,O.y+10,{size:32,color:HI,weight:700}));
  s+=card(620,90,540,330,L('欠片の 長さを 一周 足す',890,140,{size:26,color:DIM})
   +T(`\\int ${cs(CI,'dl')}=2\\pi R`,890,260,{size:52}),1);
  return s;
 },
 [K+'cancel1']:(p)=>{
  const g=seg(p,.45,.6),c=x=>g>.5?`\\cancel{${x}}`:x;
  let s=ringBase({op:.35})+bOut(O.x,O.y,24);
  s+=card(600,60,560,400,L('代入して 約分',880,105,{size:26,color:DIM})
   +T(`${Bs}=\\dfrac{\\mu_0${Ic}}{${c('4\\pi')} R^2}\\times ${c('2\\pi')} R`,880,215,{size:46})
   +fade(g,L('2π ÷ 4π ＝ 1/2',880,310,{size:28,color:HI,weight:700}))
   +fade(seg(p,.65,.8),T(`=\\dfrac{\\mu_0${Ic}\\,R}{2R^2}`,880,400,{size:46})),1);
  return s;
 },
 [K+'cancel2']:(p)=>{
  const g=seg(p,.2,.35),c=x=>g>.5?`\\cancel{${x}}`:x;
  let s=ringBase({op:.35})+bOut(O.x,O.y,24);
  s+=card(600,60,560,400,L('R を 約分',880,105,{size:26,color:DIM})
   +T(`${Bs}=\\dfrac{\\mu_0${Ic}\\,${c('R')}}{2R^{${g>.5?'\\cancel{2}':'2'}}}`,880,215,{size:46})
   +fade(seg(p,.55,.7),T(`=\\dfrac{\\mu_0${Ic}}{2R}`,880,370,{size:50})),1);
  return s;
 },
 [K+'result']:(p)=>{
  let s=ringBase()+radius(-30)+bOut(O.x,O.y,30);
  s+=TF(`${Bs}=\\dfrac{\\mu_0${Ic}}{2R}`,890,200,{size:62,box:true,frac:true});
  s+=fade(seg(p,.4,.6),L('向き：電流の 回る 向きに 右ねじを 回す',890,350,{size:26,color:INK})+L('→ 進む 向き（ここでは ⊙）',890,400,{size:28,color:CB,weight:700}));
  return s;
 },
 [K+'Nturn']:(p)=>{
  let s='';
  const N=5;for(let i=0;i<N;i++){const g=seg(p,.05+i*.06,.12+i*.06);s+=fade(g,`<ellipse cx="${300+i*14}" cy="${262-i*10}" rx="70" ry="150" fill="none" stroke="${CI}" stroke-width="4"/>`);}
  s+=fade(seg(p,.3,.45),label('N 回 巻き',300,470,{size:28,color:CI,anchor:'middle',weight:700}));
  s+=card(620,90,540,330,L('同じ 円が N 個',890,140,{size:26,color:DIM})+L('磁場も N 倍',890,215,{size:30,color:INK,weight:700})
   +fade(seg(p,.45,.6),T(`${Bs}=\\dfrac{N\\mu_0${Ic}}{2R}`,890,330,{size:52})),1);
  return s;
 },
 // ===== S5 数で確かめる・まとめ =====
 [K+'num1']:(p)=>{
  let s=card(60,60,1080,180,L('I ＝ 1 A，R ＝ 0.05 m',600,105,{size:28,color:DIM})+T(`${Bs}=\\dfrac{4\\pi\\times10^{-7}\\times 1}{2\\times 0.05}`,600,190,{size:46}),1);
  s+=fade(seg(p,.5,.7),L('分母：2 × 0.05 ＝ 0.1',600,330,{size:30,color:HI,weight:700}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=card(60,40,1080,150,T(`${Bs}=\\dfrac{4\\pi\\times10^{-7}}{0.1}=4\\pi\\times10^{-6}\\approx 1.26\\times10^{-5}\\,\\mathrm{T}`,600,125,{size:42}),1);
  const x0=160,sc=150;
  s+=L('単位：',x0+640,470,{size:24,color:DIM})+T(`10^{-5}\\,\\mathrm{T}`,x0+730,466,{size:30,color:DIM});
  s+=line(x0,230,x0,450,{color:DIM,w:2});
  s+=fade(seg(p,.2,.4),rect(x0,250,1.26*sc,60,{fill:CB,fo:.55,stroke:CB})+label('円の 中心：1.26',x0+1.26*sc+16,290,{size:26,color:CB,weight:700}));
  s+=fade(seg(p,.5,.7),rect(x0,350,4.5*sc,60,{fill:DIM,fo:.35,stroke:DIM})+label('地磁気（日本）：約 4.5',x0+4.5*sc+16,390,{size:26,color:INK,weight:700}));
  return s;
 },
 [K+'vsline']:(p)=>{
  const c1={x:250,y:250};
  let s=card(50,30,520,410,L('円の 中心',310,75,{size:26,color:DIM}),1);
  s+=ringWire({c:c1,R:120,lab:0})+line(c1.x,c1.y,c1.x+120,c1.y,{color:INK,w:2.5,dash:'8 7'})+label('R',c1.x+50,c1.y-10,{size:26,color:INK,weight:700})+bOut(c1.x,c1.y,16);
  s+=T(`\\dfrac{\\mu_0${Ic}}{2R}`,450,250,{size:40});
  s+=card(630,30,520,410,L('直線電流',890,75,{size:26,color:DIM}),seg(p,.05,.2));
  s+=fade(seg(p,.05,.2),arrow(660,330,1120,330,{color:CI,w:5,head:16})+bOut(800,210,16)+line(800,210,800,330,{color:INK,w:2.5,dash:'8 7'})+label('R',810,280,{size:26,color:INK,weight:700})+T(`\\dfrac{\\mu_0${Ic}}{2\\pi R}`,1000,230,{size:40}));
  s+=fade(seg(p,.5,.7),L('円の 中心は π 倍（約 3 倍）',600,485,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  const c1={x:250,y:250};
  let s=card(50,30,520,440,L('円：全部 同じ 距離・同じ 向き',310,75,{size:24,color:DIM}),1);
  s+=ringWire({c:c1,R:120,lab:0});for(let i=0;i<8;i++){const [x,y]=rpt(45*i,c1,120);s+=line(c1.x,c1.y,x,y,{color:INK,w:2,dash:'6 6'});}s+=bOut(c1.x,c1.y,16);
  s+=card(630,30,520,440,L('直線：遠い 欠片ほど 寄与（棒）が 小さい',890,75,{size:22,color:DIM}),1);
  s+=arrow(660,360,1120,360,{color:CI,w:5,head:16})+dot(890,230,7,INK);
  for(let i=-4;i<=4;i++){const x=890+i*55,d=Math.hypot(x-890,130),h=Math.min(110,110*Math.pow(130/d,3));s+=fade(seg(p,.2,.5),rect(x-14,440-h*.7,28,h*.7,{fill:CB,fo:.6,stroke:CB}));s+=fade(seg(p,.1,.3),line(x,360,890,230,{color:INK,w:1.5,dash:'5 6',opacity:.6}));}
  return s;
 },
 [K+'general']:(p)=>{
  let s=ringBase({op:.8});const Q=[O.x+80,O.y-40];
  s+=dot(Q[0],Q[1],8,HI)+label('P',Q[0]+14,Q[1]-12,{size:28,color:HI,weight:700});
  for(let i=0;i<8;i++){const [x,y]=rpt(22+45*i);s+=fade(seg(p,.1+i*.04,.2+i*.04),line(x,y,Q[0],Q[1],{color:INK,w:2,dash:'6 6'}));}
  s+=card(640,110,500,280,L('中心 以外の 点',890,165,{size:26,color:DIM})+L('距離も 角度も ばらばら',890,240,{size:30,color:INK,weight:700})
   +fade(seg(p,.55,.7),L('積分が ずっと 重い',890,320,{size:30,color:BAD,weight:700})),1);
  return s;
 },
 [K+'sum1']:(p)=>{
  let s=card(80,60,1040,180,L('ビオ・サバールの 法則（実験に 基づく）',600,105,{size:24,color:DIM})+T(BS,600,190,{size:46}),1);
  s+=fade(seg(p,.4,.6),T(`${Bv}=\\int ${dBv}`,600,330,{size:50})+L('ベクトルとして 足す',600,420,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=ringBase()+bOut(O.x,O.y,26);
  s+=card(620,60,540,400,L('円形電流の 中心',890,105,{size:26,color:DIM})
   +L('向きが そろう・r ＝ R 一定',890,175,{size:26,color:INK})
   +T(`\\int ${cs(CI,'dl')}=2\\pi R`,890,255,{size:40})
   +fade(seg(p,.4,.6),TF(`${Bs}=\\dfrac{\\mu_0${Ic}}{2R}`,890,375,{size:50,box:true,frac:true})),1);
  return s;
 },
 [K+'next']:(p)=>{
  let s=arrow(60,380,580,380,{color:CI,w:6,head:18})+label('I',560,360,{size:28,color:CI,weight:700});
  for(let i=0;i<9;i++){const x=90+i*55;s+=fade(seg(p,.05+i*.04,.12+i*.04),line(x,368,x,392,{color:INK,w:2.5}));}
  s+=dot(320,200,8,INK)+label('P',334,190,{size:28,color:INK,weight:700})+line(320,200,320,380,{color:INK,w:2.5,dash:'8 7'})+label('r',330,300,{size:28,color:INK,weight:700});
  s+=card(640,90,500,330,L('次の 問い',890,140,{size:26,color:DIM})+L('直線電流の 欠片を 足すと',890,215,{size:28,color:INK})
   +T(`${Bs}\\overset{?}{=}\\dfrac{\\mu_0${Ic}}{2\\pi r}`,890,330,{size:50}),seg(p,.1,.3),HI);
  return s;
 },
};
