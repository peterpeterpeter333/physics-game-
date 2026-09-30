// YouTube シリーズ「アンペールの法則・中級 2/2」(ys-um-current-field-2) — 図。Stage 1200×515.
// 部品は 1/2（yt1-um-current-field-1-diagrams.mjs）と共通。色：𝐁 橙、I 緑、一歩 d𝐫・dℓ 金、半径 r 白、沿う部分 黄、半径の向きの部分 桃、𝐄 水色。
// 向き：⊙ の電流 → 𝐁 は画面上で反時計回り。道 C（半径 r の円）も反時計回りにたどる → 親指は手前 → I は正。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,texWidth,highlight,axes} from './anim.mjs';
import {CB,CI,DC,AL,PP,NG,CR,EC,RAD,cs,T,card,cross,vB,dr,Ic,LAW,OINT,outSym,wire,head,circ,bvec,bArrow,loopC,W,obWire,obLoop,sphere,topWire} from './yt1-um-current-field-1-diagrams.mjs';

const K='um-current-field-2:';
const RES=`${cs(CB,'B')}=\\frac{\\mu_0${Ic}}{2\\pi r}`;
const O={x:330,y:262},RR=160;
const cpt=a=>[O.x+RR*Math.cos(a*RAD),O.y-RR*Math.sin(a*RAD)];
const ctan=a=>[-Math.sin(a*RAD),-Math.cos(a*RAD)];// ccw tangent (screen)
const crad=a=>[Math.cos(a*RAD),-Math.sin(a*RAD)];
// the chosen circle C of radius r, traversed ccw
function circC({g=1,path=1,col=DC,heads=1,lab=1,dash='10 8'}={}){
 let s=draw(Array.from({length:121},(_,k)=>cpt(360*k/120)),path,{color:col,w:3.5,dash});
 if(heads)for(const a of [60,150,240,330]){const [x,y]=cpt(a),[tx,ty]=ctan(a);s+=fade(path,head(x+tx*10,y+ty*10,tx,ty,{color:col,L:18}));}
 if(lab)s+=fade(path,T('C',O.x+RR*.8+24,O.y-RR*.8,{size:32,anchor:'start',color:col}));
 return fade(g,s);
}
function rLine(a=-25,g=1){const [x,y]=cpt(a);return fade(g,line(O.x+22*Math.cos(a*RAD),O.y-22*Math.sin(a*RAD),x,y,{color:CR,w:3,dash:'10 7'})+label('r',O.x+.55*RR*Math.cos(a*RAD)+4,O.y-.55*RR*Math.sin(a*RAD)+30,{size:32,color:CR,weight:700}));}
function stepAt(a,{len=80,g=1,lab=''}={}){const [x,y]=cpt(a),[tx,ty]=ctan(a);return fade(g,arrow(x,y,x+len*tx,y+len*ty,{color:DC,w:6,head:17})+(lab?T(lab,x+len*tx+(tx>0?12:-12),y+len*ty+(ty>0?30:-10),{size:30,anchor:tx>0?'start':'end'}):''));}
function bAt(a,{len=80,g=1,off=26,lab=false}={}){const [x,y]=cpt(a),[tx,ty]=ctan(a),[rx,ry]=crad(a);const X=x+off*rx,Y=y+off*ry;
 return fade(g,arrow(X,Y,X+len*tx,Y+len*ty,{color:CB,w:5,head:16})+(lab?T(vB,X+len*tx+(tx>0?10:-10),Y+len*ty-8,{size:30,anchor:tx>0?'start':'end'}):''));}

// ---- square path (S5) ----
const SQ={h:150};
const sqPts=()=>[[O.x+SQ.h,O.y+SQ.h],[O.x+SQ.h,O.y-SQ.h],[O.x-SQ.h,O.y-SQ.h],[O.x-SQ.h,O.y+SQ.h],[O.x+SQ.h,O.y+SQ.h]];
function square({g=1,heads=1,lab=1}={}){
 let s=draw(sqPts(),1,{color:DC,w:4});
 if(heads){s+=head(O.x+SQ.h,O.y,0,-1,{color:DC,L:18})+head(O.x,O.y-SQ.h,-1,0,{color:DC,L:18})+head(O.x-SQ.h,O.y,0,1,{color:DC,L:18})+head(O.x,O.y+SQ.h,1,0,{color:DC,L:18});}
 if(lab)s+=T('C',O.x+SQ.h+14,O.y-SQ.h-10,{size:32,anchor:'start',color:DC});
 return fade(g,s);
}
const SQB=[[O.x+SQ.h,O.y-110],[O.x+SQ.h,O.y],[O.x+SQ.h,O.y+110],[O.x+60,O.y-SQ.h],[O.x-80,O.y-SQ.h],[O.x-SQ.h,O.y-40],[O.x-SQ.h,O.y+110],[O.x-20,O.y+SQ.h],[O.x+100,O.y+SQ.h]];
function sqField(g=1){let s='';for(const [x,y] of SQB){const [vx,vy]=bvec(O.x,O.y,x,y,{k:11000});s+=fade(g,arrow(x,y,x+vx,y+vy,{color:CB,w:4,head:14}));}return s;}

function barChart(g=1,g2=1){
 const x0=120,sc=110;
 let s=label('×10⁻⁵ T',x0+560,470,{size:22,color:C.dim});
 s+=line(x0,120,x0,440,{color:C.dim,w:2});
 s+=fade(g,rect(x0,170,2*sc,70,{fill:CB,fo:.55,stroke:CB})+label('導線から 0.1 m：2',x0+2*sc+16,215,{size:26,color:CB,weight:700}));
 s+=fade(g2,rect(x0,310,4.5*sc,70,{fill:C.dim,fo:.35,stroke:C.dim})+label('地磁気（日本）：約 4.5',x0+4.5*sc+16,355,{size:26,color:C.ink,weight:700}));
 return s;
}

export const ytUmCurrentField2Diagrams={
 // ===== S1 前回の問い =====
 [K+'intro']:(p)=>{
  let s=loopC({c:{x:300,y:262},field:.5,steps:seg(p,.1,.4)});
  s+=card(640,110,520,200,label('前回',700,160,{size:24,color:C.dim})+T(LAW,900,240,{size:46}),seg(p,.3,.5),C.faint);
  return s;
 },
 [K+'q']:(p)=>{
  let s=topWire({rQ:seg(p,.2,.4)});
  s+=card(700,110,450,260,label('前回の最後の問い',925,160,{size:24,color:C.dim,anchor:'middle'})+T(`${cs(CB,'B')}(r)=\\ ?`,925,245,{size:50,color:C.hi})+label('1行で 出せるか？',925,320,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'issue']:(p)=>{
  let s=loopC({c:{x:300,y:262},field:.4});
  [[1.05],[2.0],[3.3],[4.9]].forEach(([t],k)=>{const rr=150+40*Math.cos(2*t+.6)+14*Math.sin(3*t),x=300+rr*Math.cos(t),y=262-rr*Math.sin(t);s+=fade(seg(p,.3+k*.08,.45+k*.08),dot(x,y,8,C.hi)+label('B＝？',x+(Math.cos(t)>0?14:-14),y-(Math.sin(t)>0?14:-32),{size:24,color:CB,anchor:Math.cos(t)>0?'start':'end',weight:700}));});
  s+=card(700,120,450,220,label('法則が 決めるのは',925,185,{size:28,color:C.dim,anchor:'middle'})+label('一周の和 だけ',925,245,{size:36,color:C.hi,anchor:'middle',weight:700})+label('ふつうは 各点の B は 決まらない',925,305,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.25),C.faint);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(100,60,1000,110,label('今回',170,128,{size:30,color:C.hi,weight:700})+label('対称性で B を 積分の外へ 出す',290,128,{size:30,color:C.ink}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.25,.45),T(RES,600,290,{size:68}));
  s+=fade(seg(p,.55,.75),label('ローレンツ力の回の問い：距離で どう決まるか への 答え',600,430,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ===== S2 対称性を読む =====
 [K+'setup']:(p)=>{
  const cx=300,cy=330,rx=210,ry=55;
  let s=obWire(cx,{front:false,cy,ry});
  s+=fade(.5,`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#24324e" fill-opacity=".6" stroke="${C.faint}" stroke-width="2"/>`);
  s+=obWire(cx,{cy,ry,top:30,arrowY:[220,110]});
  s+=fade(seg(p,.25,.45),arrow(cx+140,60,cx+140,170,{color:C.dim,w:4,head:16})+label('上から 見下ろす',cx+160,90,{size:26,color:C.dim}));
  s+=card(720,110,420,260,outSym(930,200,30,CI)+label('上から見ると',930,285,{size:26,color:C.dim,anchor:'middle'})+label('電流は 手前向き（⊙）',930,335,{size:30,color:CI,anchor:'middle',weight:700}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'dir']:(p)=>{
  let s=circ(O.x,O.y,90,1,{g:seg(p,.05,.4),nh:3,phase:60})+circ(O.x,O.y,160,1,{g:seg(p,.15,.5),nh:4,phase:20})+circ(O.x,O.y,225,1,{g:seg(p,.25,.6),nh:5,phase:40,w:3})+wire(O.x,O.y,'out');
  s+=card(720,120,430,200,label('接線の 向き',935,185,{size:30,color:CB,anchor:'middle',weight:700})+label('反時計回り（初級 26）',935,245,{size:28,color:C.ink,anchor:'middle'}),seg(p,.45,.65),C.faint);
  return s;
 },
 [K+'same']:(p)=>{
  let s=ring(O.x,O.y,RR,{color:C.faint,w:2,dash:'6 8'})+wire(O.x,O.y,'out');
  for(let k=0;k<8;k++)s+=bAt(k*45+10,{len:70,off:0,g:.45});
  const a=10+360*seg(p,.1,.8);s+=bAt(a,{len:90,off:0})+fade(1,dot(...cpt(a),7,C.hi));
  s+=rLine(-60,.8);
  s+=card(720,110,430,240,label('導線の まわりを 回っても',935,175,{size:26,color:C.dim,anchor:'middle'})+label('様子は 同じ',935,225,{size:30,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.5,.7),label('同じ r → 同じ 強さ',935,295,{size:32,color:CB,anchor:'middle',weight:700})),seg(p,.05,.25),C.faint);
  return s;
 },
 [K+'name']:(p)=>{
  let s=card(80,90,480,300,circ(320,230,90,1,{color:C.ink,nh:3,w:3})+wire(320,230,'out',{text:''})+label('回しても',320,370,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),C.faint);
  s+=card(640,90,480,300,line(880,110,880,330,{color:CI,w:7})+arrow(880,260,880,150,{color:CI,w:7,head:20})+fade(seg(p,.3,.5),arrow(940,280,940,160,{color:C.hi,w:4,head:15})+arrow(820,160,820,280,{color:C.hi,w:4,head:15}))+label('導線に 沿って ずらしても',880,370,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.2,.4),C.faint);
  s+=fade(seg(p,.55,.75),label('変わらない ＝ 対称性',600,470,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'choose']:(p)=>{
  let s=circ(O.x,O.y,160,1,{g:.3,nh:4,phase:20})+wire(O.x,O.y,'out')+circC({path:seg(p,.05,.5)})+rLine(-25,seg(p,.3,.5));
  s+=card(720,110,430,240,label('道 C ＝ 半径 r の 円',935,175,{size:30,color:DC,anchor:'middle',weight:700})+label('反時計回りに たどる',935,230,{size:26,color:C.ink,anchor:'middle'})+fade(seg(p,.6,.8),label('親指：手前 → I は 正',935,295,{size:28,color:CI,anchor:'middle',weight:700})),seg(p,.3,.5),C.faint);
  return s;
 },
 [K+'rdl']:(p)=>{
  let s=circC({lab:0})+wire(O.x,O.y,'out')+rLine(-25,seg(p,.05,.25));
  s+=stepAt(70,{len:95,g:seg(p,.45,.65),lab:dr});
  s+=card(720,90,440,320,label('2つの 長さ',940,145,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),label('r：導線から 円まで の 距離',940,205,{size:26,color:CR,anchor:'middle',weight:700})+label('一周の間 変わらない',940,245,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.5,.7),label('dℓ：一歩 d𝐫 の 長さ',940,315,{size:26,color:DC,anchor:'middle',weight:700})+label('道に 沿った 一歩',940,355,{size:24,color:C.dim,anchor:'middle'})),1,C.faint);
  return s;
 },
 // ===== S3 1行で計算 =====
 [K+'chk1']:(p)=>{
  let s=circC({lab:0,heads:0})+wire(O.x,O.y,'out');
  [30,110,190,270].forEach((a,k)=>{s+=stepAt(a,{len:75,g:seg(p,.05+k*.08,.2+k*.08)})+bAt(a,{len:75,g:seg(p,.3+k*.08,.45+k*.08)});});
  s+=card(720,110,430,240,label('チェック1：向き',935,170,{size:30,color:C.hi,anchor:'middle',weight:700})+T(`${vB}\\parallel ${dr}`,935,245,{size:44})+label('どちらも 接線の向き',935,310,{size:26,color:C.ink,anchor:'middle'}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'chk1b']:(p)=>{
  let s=stepAt(90,{len:0.001,g:0});
  s+=card(80,80,1040,340,T(`${vB}\\cdot${dr}=${cs(CB,'B')}\\,${cs(DC,'d\\ell')}\\,\\cos 0^\\circ`,600,190,{size:56})
   +fade(seg(p,.35,.55),T(`=${cs(CB,'B')}\\,${cs(DC,'d\\ell')}`,600,320,{size:64,color:C.ink})+label('直角な 部分が ない → 沿う部分 ＝ B そのもの',600,395,{size:26,color:AL,anchor:'middle',weight:700})),seg(p,.02,.2),C.faint);
  return s;
 },
 [K+'chk2']:(p)=>{
  let s=circC({lab:0,heads:0})+wire(O.x,O.y,'out')+rLine(-25,.8);
  for(let k=0;k<8;k++)s+=bAt(k*45+20,{len:75,g:seg(p,.05+k*.05,.2+k*.05)});
  s+=card(720,110,430,240,label('チェック2：大きさ',935,170,{size:30,color:C.hi,anchor:'middle',weight:700})+label('どの点も 距離 r',935,235,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.7),label('→ B は 円の上で 一定',935,295,{size:30,color:CB,anchor:'middle',weight:700})),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'out']:(p)=>{
  const u=seg(p,.35,.6);
  let s=T(`\\oint_C ${cs(CB,'B')}\\,${cs(DC,'d\\ell')}`,600,170,{size:70,opacity:1-u*.6});
  s+=fade(seg(p,.1,.3),label('どの項にも 同じ B',600,290,{size:28,color:CB,anchor:'middle',weight:700}));
  s+=arrow(600,310,600,360,{color:C.hi,w:4,head:14,g:u});
  s+=fade(u,T(`=${cs(CB,'B')}\\oint_C ${cs(DC,'d\\ell')}`,600,420,{size:70}));
  s+=fade(seg(p,.6,.8),label('B を 外へ',860,420,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'circ']:(p)=>{
  const u=seg(p,.1,.6),cx=260,cy=190,R=85,L=2*Math.PI*R,x0=90;
  // unroll: the arc not yet unrolled stays on the circle, the rest lies on the line
  const left=360*(1-u),pts=[];for(let k=0;k<=60;k++){const a=-90-left*k/60;pts.push([cx+R*Math.cos(a*RAD),cy-R*Math.sin(a*RAD)]);}
  let s=left>1?draw(pts,1,{color:DC,w:5}):'';
  s+=line(x0,cy+R,x0+L*u,cy+R,{color:DC,w:5});
  s+=dot(cx,cy,5,C.dim)+line(cx,cy,cx+R,cy,{color:CR,w:2.5,dash:'7 6',opacity:1-u})+fade(1-u,label('r',cx+R/2,cy-10,{size:26,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),line(x0,cy+R+24,x0+L,cy+R+24,{color:C.dim,w:2})+label('2πr',x0+L/2,cy+R+60,{size:30,color:DC,anchor:'middle',weight:700}));
  s+=card(720,110,440,270,T(`\\oint_C ${cs(DC,'d\\ell')}=2\\pi r`,940,190,{size:44})+fade(seg(p,.6,.8),label('左辺は',940,265,{size:26,color:C.dim,anchor:'middle'})+T(`${cs(CB,'B')}\\times 2\\pi r`,940,325,{size:48})),seg(p,.4,.55),C.faint);
  return s;
 },
 [K+'gausslike']:(p)=>{
  let s=card(60,40,520,440,sphere(320,190,105,{})+label('cos ＝ 1 ・ E 一定',320,355,{size:26,color:C.ink,anchor:'middle'})+T(`${cs(EC,'E')}\\times 4\\pi r^2`,320,430,{size:44}),seg(p,.02,.2),C.faint);
  s+=card(620,40,540,440,circ(890,190,105,1,{color:CB,nh:4,phase:30})+wire(890,190,'out',{text:''})+label('cos ＝ 1 ・ B 一定',890,355,{size:26,color:C.ink,anchor:'middle'})+T(`${cs(CB,'B')}\\times 2\\pi r`,890,430,{size:44}),seg(p,.35,.55),C.hi);
  s+=fade(seg(p,.1,.3),label('ガウスの法則の回',320,78,{size:24,color:C.dim,anchor:'middle'}))+fade(seg(p,.4,.6),label('今回',890,78,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eq']:(p)=>{
  let s=T(`${cs(CB,'B')}\\times 2\\pi r=\\mu_0${Ic}`,600,220,{size:80});
  const w=texWidth(`${cs(CB,'B')}\\times 2\\pi r=\\mu_0${Ic}`,80,false),l=600-w/2;
  s+=fade(seg(p,.2,.4),label('左辺：対称性で 計算',l+140,340,{size:28,color:CB,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),label('右辺：法則',l+w-80,340,{size:28,color:CI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'div']:(p)=>{
  let s=T(`\\frac{${cs(CB,'B')}\\times 2\\pi r}{2\\pi r}=\\frac{\\mu_0${Ic}}{2\\pi r}`,600,170,{size:70});
  s+=fade(seg(p,.05,.25),label('両辺を 2πr で 割る',1000,70,{size:28,color:C.hi,anchor:'middle',weight:700}));
  const wl=texWidth(`\\frac{${cs(CB,'B')}\\times 2\\pi r}{2\\pi r}`,70,false),wa=texWidth(`\\frac{${cs(CB,'B')}\\times 2\\pi r}{2\\pi r}=\\frac{\\mu_0${Ic}}{2\\pi r}`,70,false),l=600-wa/2;
  s+=fade(seg(p,.25,.4),line(l+wl*.45,142,l+wl*.98,112,{color:C.hi,w:3})+line(l+wl*.2,212,l+wl*.8,182,{color:C.hi,w:3}));
  s+=fade(seg(p,.5,.7),T(RES,600,390,{size:76}));
  return s;
 },
 [K+'hs']:(p)=>{
  let s=T(RES,600,210,{size:96});
  const w=texWidth(RES,96,false);s+=highlight(600-w/2-24,70,w+48,250,seg(p,.05,.3),C.hi);
  s+=fade(seg(p,.3,.5),label('高校で 覚えた 式を、法則 ＋ 対称性 から 導いた',600,380,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 数で確かめる =====
 [K+'num']:(p)=>{
  let s=circ(O.x,O.y,160,1,{g:.4,nh:4,phase:20})+wire(O.x,O.y,'out',{text:'I ＝ 10 A',size:28,tdx:-60,tdy:-44});
  s+=fade(seg(p,.3,.5),line(O.x+22,O.y+8,O.x+160,O.y+8,{color:CR,w:3,dash:'10 7'})+label('r ＝ 0.1 m',O.x+90,O.y+48,{size:28,color:CR,anchor:'middle',weight:700})+dot(O.x+160,O.y+8,7,C.hi));
  s+=card(720,140,430,170,T(`${cs(CB,'B')}=\\ ?`,935,230,{size:54,color:C.hi}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'mu2pi']:(p)=>{
  let s=T(`\\frac{\\mu_0}{2\\pi}=\\frac{4\\pi\\times10^{-7}}{2\\pi}`,600,180,{size:66});
  s+=fade(seg(p,.35,.55),T(`=2\\times10^{-7}\\ \\mathrm{T\\cdot m/A}`,600,360,{size:62,color:C.hi}));
  s+=fade(seg(p,.2,.35),label('π が 約分で 消える',1000,90,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=T(`${cs(CB,'B')}=2\\times10^{-7}\\times\\frac{10}{0.1}`,600,170,{size:64});
  s+=fade(seg(p,.35,.55),T(`=2\\times10^{-5}\\ \\mathrm{T}`,600,360,{size:72,color:C.hi}));
  return s;
 },
 [K+'earth']:(p)=>barChart(seg(p,.05,.3),seg(p,.35,.6))+fade(seg(p,.6,.8),label('地磁気の 半分弱',820,215,{size:28,color:C.hi,weight:700})),
 [K+'unit']:(p)=>{
  let s=label('単位',80,70,{size:28,color:C.dim});
  s+=T(`\\frac{\\mathrm{T\\cdot m}}{\\mathrm{A}}\\times\\frac{\\mathrm{A}}{\\mathrm{m}}`,520,230,{size:70});
  s+=fade(seg(p,.4,.6),T(`=\\mathrm{T}`,860,230,{size:70,color:C.hi}));
  s+=fade(seg(p,.2,.4),label('A と m が 約分で 消える',600,420,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=circ(O.x,O.y,200,1,{g:.4,nh:4,phase:20})+wire(O.x,O.y,'out',{text:'10 A',size:28,tdx:-30,tdy:-44});
  s+=line(O.x+22,O.y+8,O.x+200,O.y+8,{color:CR,w:3,dash:'10 7'})+label('r ＝ 0.2 m',O.x+110,O.y+48,{size:28,color:CR,anchor:'middle',weight:700})+dot(O.x+200,O.y+8,7,C.hi);
  s+=card(720,140,430,170,T(`${cs(CB,'B')}=\\ ?`,935,230,{size:54,color:C.hi}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'ans']:(p)=>{
  const A=axes({x:110,y:440,w:520,h:330,xmax:.4,ymax:4,xticks:[.1,.2,.3,.4],yticks:[1,2,3,4],xlabel:'r［m］',ylabel:'B［×10⁻⁵ T］',g:1,ycolor:CB,xcolor:CR});
  let s=A.svg+A.plot(r=>.2/r,{from:.05,to:.4,p:seg(p,.05,.4),color:CB});
  s+=fade(seg(p,.3,.45),dot(A.X(.1),A.Y(2),9,C.hi)+label('2',A.X(.1)+14,A.Y(2)-10,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.6),dot(A.X(.2),A.Y(1),9,C.hi)+label('1',A.X(.2)+14,A.Y(1)-10,{size:26,color:C.hi,weight:700}));
  s+=card(760,110,400,260,label('r が 2倍',960,175,{size:28,color:CR,anchor:'middle',weight:700})+label('→ B は 半分',960,225,{size:30,color:CB,anchor:'middle',weight:700})+T(`1\\times10^{-5}\\ \\mathrm{T}`,960,290,{size:36})+fade(seg(p,.65,.85),label('同じ μ₀I を 2倍の 円周で 割る',960,345,{size:22,color:C.dim,anchor:'middle'})),seg(p,.45,.6),C.faint);
  return s;
 },
 [K+'rnote']:(p)=>{
  let s=ring(O.x,O.y,42,{color:CI,w:3,fill:'#1b3a33'})+dot(O.x,O.y,6,CI)+label('導線の 断面',O.x,O.y+80,{size:24,color:CI,anchor:'middle'});
  s+=fade(seg(p,.1,.35),line(O.x,O.y,O.x+220,O.y-60,{color:CR,w:3,dash:'10 7'})+dot(O.x+220,O.y-60,8,C.hi)+label('r',O.x+120,O.y-52,{size:32,color:CR,weight:700}));
  s+=fade(seg(p,.5,.7),line(O.x-42,O.y+120,O.x+42,O.y+120,{color:C.dim,w:2})+label('太さ',O.x,O.y+150,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(720,120,430,220,label('r ＝ 中心から 点まで',935,190,{size:30,color:CR,anchor:'middle',weight:700})+fade(seg(p,.55,.75),label('導線の 太さ ではない',935,260,{size:28,color:NG,anchor:'middle',weight:700})),seg(p,.3,.5),C.faint);
  return s;
 },
 // ===== S5 円を選ぶ理由 =====
 [K+'other']:(p)=>{
  let s=wire(O.x,O.y,'out')+square({g:seg(p,.05,.4)});
  s+=card(720,150,430,170,label('正方形 なら？',935,245,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'still']:(p)=>{
  let s=wire(O.x,O.y,'out')+square({});
  s+=card(700,110,460,260,label('法則は どんな 閉じた道でも',930,170,{size:26,color:C.dim,anchor:'middle'})+T(`\\oint_C ${vB}\\cdot${dr}=\\mu_0${Ic}`,930,250,{size:42})+label('導線を 囲めば 同じ 値',930,325,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),C.faint);
  return s;
 },
 [K+'cannot']:(p)=>{
  let s=wire(O.x,O.y,'out')+square({})+sqField(seg(p,.05,.4));
  s+=card(720,110,430,240,label('正方形の 上では',935,170,{size:26,color:C.dim,anchor:'middle'})+label('距離が 違う → B が 違う',935,230,{size:28,color:CB,anchor:'middle',weight:700})+fade(seg(p,.5,.7),label('一歩との 角度も 違う',935,290,{size:28,color:DC,anchor:'middle',weight:700})),seg(p,.3,.5),C.faint);
  return s;
 },
 [K+'splitstep']:(p)=>{
  const P=[O.x+SQ.h,O.y-70],d=[0,-165];// step up along the right edge
  const mx=P[0]-O.x,my=-(P[1]-O.y),rr=Math.hypot(mx,my),u=[mx/rr,my/rr],t=[-my/rr,mx/rr];// math coords
  const dm=[d[0],-d[1]],du=dm[0]*u[0]+dm[1]*u[1],dt=dm[0]*t[0]+dm[1]*t[1];
  const U=[du*u[0],-du*u[1]],Tt=[dt*t[0],-dt*t[1]];
  let s=wire(O.x,O.y,'out')+fade(.35,square({heads:0,lab:0}))+ring(O.x,O.y,rr,{color:C.faint,w:2,dash:'6 8'});
  s+=line(O.x+20*u[0],O.y-20*u[1],P[0],P[1],{color:CR,w:2.5,dash:'8 6'});
  s+=arrow(P[0],P[1],P[0]+d[0],P[1]+d[1],{color:DC,w:6,head:17})+T(dr,P[0]+12,P[1]+d[1]+6,{size:30,anchor:'start'});
  s+=fade(seg(p,.1,.3),arrow(P[0],P[1],P[0]+Tt[0],P[1]+Tt[1],{color:AL,w:5,head:15})+line(P[0]+Tt[0],P[1]+Tt[1],P[0]+d[0],P[1]+d[1],{color:C.dim,w:2,dash:'5 5'}));
  s+=fade(seg(p,.2,.4),arrow(P[0],P[1],P[0]+U[0],P[1]+U[1],{color:PP,w:5,head:15})+line(P[0]+U[0],P[1]+U[1],P[0]+d[0],P[1]+d[1],{color:C.dim,w:2,dash:'5 5'}));
  const [bx,by]=bvec(O.x,O.y,P[0],P[1],{k:14000});s+=fade(seg(p,.35,.5),arrow(P[0],P[1],P[0]+bx,P[1]+by,{color:CB,w:5,head:16})+T(vB,P[0]+bx-10,P[1]+by-14,{size:30,anchor:'end'}));
  s+=card(720,90,440,320,label('円に 沿う部分',940,160,{size:28,color:AL,anchor:'middle',weight:700})+label('→ B と 平行',940,200,{size:26,color:C.ink,anchor:'middle'})
   +label('半径の 向きの部分',940,275,{size:28,color:PP,anchor:'middle',weight:700})+fade(seg(p,.55,.75),label('→ B に 直角 → 寄与 0',940,315,{size:26,color:C.ink,anchor:'middle'})),seg(p,.3,.5),C.faint);
  return s;
 },
 [K+'cannot2']:(p)=>{
  let s=fade(.5,wire(O.x,O.y,'out')+square({})+sqField(1));
  s+=card(660,100,500,280,label('B が 一定でない',910,165,{size:30,color:CB,anchor:'middle',weight:700})+label('→ 外へ 出せない',910,215,{size:30,color:NG,anchor:'middle',weight:700})
   +fade(seg(p,.45,.65),label('2つの チェックが 通る',910,290,{size:28,color:C.ink,anchor:'middle'})+label('円を 選んだ',910,340,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.25),C.faint);
  return s;
 },
 [K+'condition']:(p)=>{
  let s=card(60,110,520,260,label('法則が 成り立つ',320,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('どんな 閉じた道 でも',320,250,{size:30,color:CI,anchor:'middle',weight:700}),seg(p,.05,.25),C.faint);
  s+=card(620,110,520,260,label('B を 外へ 出せる',880,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('対称な 円 だけ',880,250,{size:30,color:C.hi,anchor:'middle',weight:700})+label('＝ 計算を 楽にする 条件',880,310,{size:26,color:C.dim,anchor:'middle'}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'compare']:(p)=>{
  let s=card(60,40,520,440,sphere(320,170,100,{})+T(`${cs(EC,'E')}=\\frac{Q/\\varepsilon_0}{4\\pi r^2}`,320,360,{size:44})+fade(seg(p,.4,.6),label('4πr²：球の 面積 → 1/r²',320,450,{size:26,color:C.ink,anchor:'middle',weight:700})),seg(p,.02,.2),C.faint);
  return s;
 },
 [K+'compare2']:(p)=>{
  let s=card(60,40,520,440,sphere(320,170,100,{})+T(`${cs(EC,'E')}=\\frac{Q/\\varepsilon_0}{4\\pi r^2}`,320,360,{size:44})+label('4πr²：球の 面積 → 1/r²',320,450,{size:26,color:C.ink,anchor:'middle',weight:700}),1,C.faint);
  s+=card(620,40,540,440,circ(890,170,100,1,{color:CB,nh:4,phase:30})+wire(890,170,'out',{text:''})+T(`${cs(CB,'B')}=\\frac{\\mu_0${Ic}}{2\\pi r}`,890,360,{size:44})+label('2πr：円周 → 1/r',890,450,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.55,.75),rect(160,488,880,0,{fill:C.hi,fo:0})+label('一定の 総量 ÷ r とともに 増える 大きさ',600,505,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=T(`\\oint_C ${vB}\\cdot${dr}=\\oint_C ${cs(CB,'B')}\\,${cs(DC,'d\\ell')}=${cs(CB,'B')}\\times2\\pi r`,600,120,{size:46});
  s+=fade(seg(p,.2,.4),label('向きが そろう（cos ＝ 1）',330,205,{size:24,color:AL,anchor:'middle'})+label('B 一定 → 外へ',760,205,{size:24,color:CB,anchor:'middle'}));
  s+=fade(seg(p,.4,.6),T(`${cs(CB,'B')}\\times2\\pi r=\\mu_0${Ic}`,600,300,{size:50}));
  s+=fade(seg(p,.6,.8),T(RES,600,430,{size:58,color:C.hi}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(60,110,520,240,T(`\\oint_C ${vB}\\cdot${dr}=\\mu_0${Ic}`,320,200,{size:44})+label('囲む 電流で 決まる',320,290,{size:28,color:CI,anchor:'middle',weight:700}),seg(p,.02,.2),C.faint);
  s+=card(620,110,540,240,T(`\\oint_C ${cs(EC,'\\mathbf{E}')}\\cdot${dr}=0`,890,200,{size:44})+label('静電場（電位の回）',890,290,{size:28,color:EC,anchor:'middle',weight:700}),seg(p,.45,.65),C.faint);
  return s;
 },
 [K+'next']:(p)=>{
  let s=T(`\\oint_C ${cs(EC,'\\mathbf{E}')}\\cdot${dr}\\neq 0\\ ?`,600,180,{size:76,color:C.ink});
  s+=fade(seg(p,.3,.5),label('静電場 でないのは どんなとき？',600,340,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('次：電磁誘導',600,420,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
};
