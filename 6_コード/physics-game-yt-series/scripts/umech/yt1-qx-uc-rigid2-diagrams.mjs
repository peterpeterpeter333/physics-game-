// 問題編 解説「坂を転がる球と、腕を縮めるスケーター」（q-uc-rigid2、大学編 18 剛体の回転・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/18_剛体の回転.md の q-uc-rigid2（解説 20 行）。
// 配置：左に坂と球・スケーター、右に説明の枠。札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：R・s 水色、斜面の角 θ 橙、球の回転角 φ・ω・トルク N 桃（2026-10-16 PQ-019：回転角を θ から φ に）、v 紫、α・a 赤、力（重力・垂直抗力・摩擦）緑、L 黄、エネルギー 並進 橙・回転 桃（凡例）、強調 黄。
// スケーターの真上から見た図は 単元動画（yt1-uc-rigid2-1-diagrams.mjs の skaterTop）を写して使う（あちらは編集しない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,sentWin,cueT,tAt,durOf,textW} from './yt1-qx-common.mjs';

const K='qx-uc-rigid2:';
const CX=C.x,CTH=C.E,CV=C.v,CW=C.p,CA=C.a,CF=C.F,CN=C.p,CL=C.hi,CE=C.E,CRot=C.p,CD='#ff6b6b',CARDBG='#131f38';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const col=(c,s)=>`{\\color{${c}}{${s}}}`;
const TAU=2*Math.PI;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const G1='重心の加速度 a',G2='摩擦力 f（向きと大きさ）',G3='ω₂ と筋肉の仕事';
const ANS1=g=>answerTag(1,'B','2.0 m/s²',{g}),ANS2=g=>answerTag(2,'B','坂の上向きに 2.4 N',{g}),ANS3=g=>answerTag(3,'C','5 rad/s、15 J',{g});
const LEGE=(g=1,x=24)=>legend([['並進',CE],['回転',CRot]],x,500,{g,dir:'row'});
const MLAB=label('球：M ＝ 3 kg、半径 R',40,440,{size:26,color:C.ink,weight:700})+label('I ＝ (2/5)MR²',40,480,{size:26,color:C.ink,weight:700});
const SIN=`\\sin${col(CTH,'\\theta')}`,aa=col(CA,'a'),al=col(CA,'\\alpha'),ff=col(CF,'f'),RR=col(CX,'R');

const arcPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
function headAt(pts,color,H=16){const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1);
 return poly([[x2,y2],[x2-H*Math.cos(a)+H*.5*Math.sin(a),y2-H*Math.sin(a)-H*.5*Math.cos(a)],[x2-H*Math.cos(a)-H*.5*Math.sin(a),y2-H*Math.sin(a)+H*.5*Math.cos(a)]],{fill:color,fo:1});}
// 画面の角（時計回りが＋）で a0→a1 の弧の矢印
function turnArc(cx,cy,r,a0,a1,{color=CW,w=5,g=1}={}){const pts=arcPts(cx,cy,r,a0,a1,30);return fade(g,draw(pts.slice(0,-2),1,{color,w})+headAt(pts,color));}

// ---- 坂（sinθ＝0.28）と球 ----
const SN=.28,CS=Math.sqrt(1-SN*SN);
const SL={x1:40,y1:180,x2:640,y2:180+600*SN/CS};
const RB=52;
function slope({th=1,thLab=1}={}){const {x1,y1,x2,y2}=SL;
 let s=poly([[x1,y1],[x2,y2],[x1,y2]],{fill:'#26324d',fo:.8,stroke:C.dim,sw:2})+line(x2,y2,x2+50,y2,{color:C.dim,w:3});
 if(th){const a0=Math.PI,a1=Math.PI+Math.atan2(y2-y1,x2-x1);s+=draw(arcPts(x2,y2,70,a1,a0),1,{color:CTH,w:4})+label('θ',x2-96,y2-8,{size:28,color:CTH,weight:700});}
 if(thLab)s+=label('sinθ ＝ 0.28',x2-60,y2+40,{size:26,color:CTH,anchor:'middle',weight:700});
 return s;}
const ux=CS,uy=SN,nx=SN,ny=-CS; // 坂に沿う下向き u、坂から外向き n
const contact=u=>[mix(SL.x1,SL.x2,u),mix(SL.y1,SL.y2,u)];
const center=u=>{const [px,py]=contact(u);return [px+RB*nx,py+RB*ny];};
function ball(u,{g=1,rot=null}={}){const [cx,cy]=center(u),r=rot??(u*Math.hypot(SL.x2-SL.x1,SL.y2-SL.y1)/RB);
 return fade(g,ring(cx,cy,RB,{color:'#c9d2e0',w:3,fill:'#6f86b4'})+line(cx,cy,cx+RB*.9*Math.cos(r),cy+RB*.9*Math.sin(r),{color:'#1c2742',w:4})+dot(cx,cy,6,C.bg));}
const U0=.42;
// 力：重力（重心から下）、垂直抗力（接地点から坂に垂直）、摩擦（接地点、坂の上向き）
function forces(u,{grav=1,norm=1,fq=1,fr=0,frDash=1,frVal='',split=0,gl=1}={}){
 const [cx,cy]=center(u),[px,py]=contact(u),G=130;let s='';
 if(grav)s+=fade(grav,arrow(cx,cy,cx,cy+G,{color:CF,w:6,head:16})+(gl?label('Mg',cx+12,cy+G-6,{size:26,color:CF,weight:700}):''));
 if(split){s+=fade(split,arrow(cx,cy,cx+G*SN*ux,cy+G*SN*uy,{color:CF,w:7,head:18})+line(cx+G*SN*ux,cy+G*SN*uy,cx,cy+G,{color:CF,w:2,dash:'6 6'})
   +label('Mg sinθ',cx+G*SN*ux+14,cy+G*SN*uy+6,{size:26,color:CF,weight:700}));}
 if(norm)s+=fade(norm,arrow(px,py,px+125*nx,py+125*ny,{color:CF,w:6,head:16})+label('垂直抗力',px+125*nx+10,py+125*ny-6,{size:24,color:CF,weight:700}));
 if(fq)s+=fade(fq,rect(px-120,py+14,96,36,{fill:CARDBG,fo:.9,stroke:C.hi,sw:2,rx:8})+label('摩擦 f？',px-72,py+40,{size:22,color:C.hi,anchor:'middle',weight:700}));
 if(fr){const L=95,o={color:CF,w:6,head:16};s+=fade(fr,(frDash?line(px,py,px-L*ux,py-L*uy,{color:CF,w:5,dash:'8 7'})+headAt([[px,py],[px-L*ux,py-L*uy]],CF):arrow(px,py,px-L*ux,py-L*uy,o))
  +label(frVal||'f',px-L*ux-10,py-L*uy-12,{size:26,color:CF,anchor:'end',weight:700}));}
 return s;
}
// 重心のまわりのトルク（摩擦による。時計回り）と腕 R
function torqueMark(u,{g=1,arm=1,rev=0}={}){const [cx,cy]=center(u),[px,py]=contact(u);
 let s='';if(arm)s+=line(cx,cy,px,py,{color:CX,w:4})+label('R',(cx+px)/2+10,(cy+py)/2+4,{size:26,color:CX,weight:700});
 s+=rev?turnArc(cx,cy,RB+22,-.3,-2.4,{color:CN}):turnArc(cx,cy,RB+22,-2.4,-.3,{color:CN});
 return fade(g,s);}
// エネルギーの棒（並進 5/7・回転 2/7）
function ebar(x,y,h,{g=1}={}){const w=70;return fade(g,rect(x-w/2,y-h,w,h,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:4})+rect(x-w/2+4,y-h*5/7,w-8,h*5/7-2,{fill:CE,fo:.85,stroke:'none',rx:3})
 +rect(x-w/2+4,y-h,w-8,h*2/7,{fill:CRot,fo:.85,stroke:'none',rx:3})+label('並進',x-w/2-10,y-h*5/14+8,{size:24,color:CE,anchor:'end',weight:700})+label('回転',x-w/2-10,y-h*6/7+8,{size:24,color:CRot,anchor:'end',weight:700}));}

// ---- スケーター（真上から。単元動画の skaterTop を写した）----
function skaterTop(cx,cy,arm,phi,{g=1,force=0,handHi=0,ghost=0,move=0,pair=0}={}){
 const c=Math.cos(phi),sn=Math.sin(phi),P=r=>[cx+r*c,cy-r*sn],Q=r=>[cx-r*c,cy+r*sn];
 const ang=-phi*180/Math.PI;
 if(ghost){const [hx,hy]=P(arm),[kx,ky]=Q(arm),[ax,ay]=P(40),[bx,by]=Q(40);
  return fade(g,line(ax,ay,hx,hy,{color:C.dim,w:4,dash:'8 7'})+line(bx,by,kx,ky,{color:C.dim,w:4,dash:'8 7'})+ring(hx,hy,11,{color:C.dim,w:3,dash:'5 5'})+ring(kx,ky,11,{color:C.dim,w:3,dash:'5 5'}));}
 let s=`<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${ang.toFixed(1)})"><ellipse cx="0" cy="0" rx="46" ry="26" fill="#2c3854" stroke="${C.ink}" stroke-width="3"/></g>`;
 const [ax,ay]=P(40),[hx,hy]=P(arm),[bx,by]=Q(40),[kx,ky]=Q(arm);
 s+=line(ax,ay,hx,hy,{color:C.ink,w:9})+line(bx,by,kx,ky,{color:C.ink,w:9});
 s+=dot(hx,hy,11,handHi?C.hi:C.ink)+dot(kx,ky,11,handHi?C.hi:C.ink);
 s+=ring(cx,cy,19,{color:C.ink,w:3,fill:'#3a4868'});
 if(force>0){const f=56;
  s+=fade(force,arrow(hx-c*14,hy+sn*14,hx-c*(14+f),hy+sn*(14+f),{color:CF,w:6,head:15})+arrow(kx+c*14,ky-sn*14,kx+c*(14+f),ky-sn*(14+f),{color:CF,w:6,head:15}));}
 if(move>0){const o=24,f=50;s+=fade(move,arrow(hx-sn*o,hy-c*o,hx-sn*o-c*f,hy-c*o+sn*f,{color:CV,w:5,head:13})+arrow(kx+sn*o,ky+c*o,kx+sn*o+c*f,ky+c*o-sn*f,{color:CV,w:5,head:13}));}
 if(pair>0){const [mx,my]=P(arm*.5),f=44;
  s+=fade(pair,arrow(mx,my,mx-c*f,my+sn*f,{color:CF,w:5,head:13})+arrow(cx+c*44,cy-sn*44,cx+c*(44+f),cy-sn*(44+f),{color:'#4f9f80',w:5,head:13}));}
 return fade(g,s);
}
const SK={cx:300,cy:300,A1:150,A2:70};
const Iof=arm=>2+3*clamp((arm-SK.A2)/(SK.A1-SK.A2))**2; // 図のための補間（I₁＝5、I₂＝2 だけを合わせる）
// 腕の長さ arm(t) に合わせて、角運動量一定（I ω＝一定）で回した角度
function spinPhi(t,armOf,w1=1.1,steps=120){let a=0;const dt=t/steps;for(let i=0;i<steps;i++){a+=w1*5/Iof(armOf((i+.5)*dt))*dt;}return a;}
function skScene(phi,arm,{lab1=1,ghost=0,lab2=0,note1=1,o={}}={}){const {cx,cy,A2}=SK;let s='';
 if(note1)s+=note('真上から 見た 図',40,112,{anchor:'start'});
 s+=fade(.8,turnArc(cx,cy,190,-.4,-1.6,{color:CW,w:4}));
 s+=skaterTop(cx,cy,arm,phi,o);
 if(ghost)s+=fade(ghost,skaterTop(cx+300,cy,A2,phi,{ghost:1})+`<g transform="translate(${cx+300} ${cy}) rotate(${(-phi*180/Math.PI).toFixed(1)})"><ellipse cx="0" cy="0" rx="46" ry="26" fill="none" stroke="${C.dim}" stroke-width="3" stroke-dasharray="7 6"/></g>`+ring(cx+300,cy,19,{color:C.dim,w:3,dash:'5 5'}));
 if(lab1)s+=fade(lab1,label('I₁ ＝ 5 kg·m²',40,440,{size:26,color:C.ink,weight:700})+label('ω₁ ＝ 2 rad/s',40,480,{size:26,color:CW,weight:700}));
 if(lab2)s+=fade(lab2,label('点線：腕を 縮めた 姿（輪郭）',430,440,{size:24,color:C.dim,weight:700})+label('I₂ ＝ 2 kg·m²',430,480,{size:26,color:C.ink,weight:700}));
 return s;}
// 縦の棒（L 黄、K 桃）
function vbar(x,yb,hpx,color,{g=1,val='',lab='',w=70}={}){let s=rect(x-w/2,yb-hpx,w,hpx,{fill:color,fo:.6,stroke:color,sw:2,rx:4});
 if(val)s+=label(val,x,yb-hpx-12,{size:26,color,anchor:'middle',weight:700});if(lab)s+=label(lab,x,yb+32,{size:24,color,anchor:'middle',weight:700});return fade(g,s);}

export const ytQxUcRigid2Diagrams={
 // ===================== 問題アニメ =====================
 // 小問1・2の図（約4秒）：0〜2 s で球が現れ、2〜4 s で重力と垂直抗力。接地点には「摩擦 f？」の札だけ（向きと大きさは描かない）。静止
 [K+'q1']:(p)=>{let s=slope();s+=ball(U0,{g:seg(p,.05,.4),rot:0});
  s+=fade(seg(p,.2,.45),MLAB);
  return s+forces(U0,{grav:seg(p,.5,.7),norm:seg(p,.6,.8),fq:seg(p,.8,.95)});},
 // 小問3の図（約4秒）：真上から見たスケーターが腕を広げて回る（0〜3 s）。縮めた姿の輪郭だけを点線で重ね、I₂。3〜4 s で静止（縮めた後の回りは見せない）
 [K+'q3']:(p,ctx)=>{const t=cueT(ctx),phi=1.1*Math.min(t,3);
  return skScene(phi,SK.A1,{lab1:seg(p,.05,.25),ghost:clamp((t-2.4)/.5),lab2:clamp((t-2.6)/.5)});},

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{let s=slope()+ball(U0,{rot:0})+MLAB;
  return s+forces(U0)+goalTag(G1,{g:seg(p,.03,.15)});},
 // 2. 「法則」。右の枠を左右に：並進 M𝐚_G＝𝐅外 ／ 回転 I_Gα＝N_G。球の重心に黄の点
 [K+'two']:(p,ctx)=>{const W=sentWin(ctx),b=.5;
  let s=slope()+ball(U0,{rot:0})+forces(U0,{fq:0,gl:1});const [cx,cy]=center(U0);
  s+=fade(seg(p,.1,.2),dot(cx,cy,10,C.hi)+label('重心',cx-RB-14,cy-RB+4,{size:24,color:C.hi,anchor:'end',weight:700}));
  const eL=`M\\mathbf{${col(CA,'a')}}_G=\\mathbf{${col(CF,'F')}}`,wL=texWidth(eL,32,false),xl=PX+125;
  s+=panel(86,300,kindTag('法則',PC,130,{g:seg(p,.03,.12)})+line(PC,165,PC,370,{color:C.faint,w:2})
   +fade(seg(p,.12,.25),label('並進',xl,200,{size:26,color:C.dim,anchor:'middle',weight:700})+T(eL,xl-8,275,32)+label('外',xl-8+wL/2+2,290,{size:22,color:CF,weight:700})+label('（重心の 運動）',xl,345,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.35,.48),label('回転',PX+375,200,{size:26,color:C.dim,anchor:'middle',weight:700})+T(`I_G\\,${al}=${col(CN,'N_G')}`,PX+375,275,32)+label('（重心の まわり）',PX+375,345,{size:22,color:C.dim,anchor:'middle'})),1,CF);
  return s+goalTag(G1);},
 // 3. 下向き＋。重力を坂に沿う成分 Mg sinθ と垂直成分に分ける。摩擦 f を坂の上向きに仮に置く。左 Ma＝Mg sinθ−f、右 Iα＝fR
 [K+'eqs']:(p,ctx)=>{const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const [px,py]=contact(U0),[cx,cy]=center(U0);
  let s=slope({thLab:1})+ball(U0,{rot:0});
  const [qx,qy]=contact(.78);s+=fade(seg(p,.03,.1),arrow(qx+40*nx,qy+40*ny,qx+40*nx+100*ux,qy+40*ny+100*uy,{color:C.hi,w:4,head:14})+label('＋（下向き）',qx+40*nx+20,qy+40*ny-20,{size:26,color:C.hi,weight:700}));
  s+=forces(U0,{fq:0,norm:1,split:seg(p,.08,.2),fr:seg(p,.2,.3),frDash:1});
  s+=fade(seg(p,.22,.32),label('f の 向きは 仮に 置いた（計算で 確かめる）',40,440,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,b+.1,b+.2),torqueMark(U0)+label('重力・垂直抗力は 重心を 通る → トルク 0',40,480,{size:24,color:C.dim,weight:700}));
  s+=panel(86,300,line(PC,110,PC,370,{color:C.faint,w:2})
   +label('並進',PX+125,135,{size:26,color:C.dim,anchor:'middle',weight:700})+label('回転',PX+375,135,{size:26,color:C.dim,anchor:'middle',weight:700})
   +fade(seg(p,.3,.42),T(`M${aa}=Mg${SIN}-${ff}`,PX+125,230,28))
   +fade(seg(p,b+.15,b+.25),T(`I${al}=${ff}${RR}`,PX+375,230,32)),1,CF);
  return s+goalTag(G1);},
 // 4. 球を少し転がし、回った角 φ（桃。斜面の角 θ とは別の文字）と進んだ距離 s（水色）。s＝Rφ → v＝Rω → a＝Rα。a＝Rα を黄の枠で、左右の式の橋
 [K+'roll']:(p)=>{const u=U0+.22*seg(p,.03,.25),L=Math.hypot(SL.x2-SL.x1,SL.y2-SL.y1),th=(u-U0)*L/RB;
  let s=slope({thLab:0});
  const [c0x,c0y]=center(U0),[cx,cy]=center(u);
  s+=fade(.5,ring(c0x,c0y,RB,{color:C.faint,w:2,dash:'6 6'}));
  s+=ball(u,{rot:th-Math.PI/2});
  if(th>.05){s+=line(cx,cy,cx,cy-RB,{color:C.faint,w:2,dash:'5 5'})+draw(arcPts(cx,cy,30,-Math.PI/2,-Math.PI/2+th),1,{color:CW,w:4})+label('φ',cx+40*Math.cos(-Math.PI/2+th/2)+4,cy+40*Math.sin(-Math.PI/2+th/2)+2,{size:26,color:CW,weight:700});
   s+=arrow(c0x,c0y,cx,cy,{color:CX,w:4,head:12})+label('s',(c0x+cx)/2-6,(c0y+cy)/2-14,{size:28,color:CX,weight:700});}
  s+=panel(86,420,line(PX+30,190,PX+PW-30,190,{color:C.faint,w:2})
   +T(`M${aa}=Mg${SIN}-${ff}`,PX+125,140,24)+T(`I${al}=${ff}${RR}`,PX+375,140,26)
   +fade(seg(p,.25,.35),T(`s=${RR}\\,${col(CW,'\\phi')}`,PC+50,240,34))
   +fade(seg(p,.4,.5),label('↓ 1回 微分',PX+30,300,{size:22,color:C.dim})+T(`${col(CV,'v')}=${RR}\\,${col(CW,'\\omega')}`,PC+50,300,34))
   +fade(seg(p,.55,.65),label('↓ もう 1回',PX+30,375,{size:22,color:C.dim})+T(`${aa}=${RR}\\,${al}`,PC+50,375,38))
   +fade(seg(p,.7,.8),highlight(PC-40,335,180,72,1,C.hi)+label('左右の 式を つなぐ 橋',PC,460,{size:26,color:C.hi,anchor:'middle',weight:700})),1,C.hi);
  return s+goalTag(G1);},
 // 5a. Iα＝fR に α＝a/R → f＝Ia/R²（図を消して式が主役）
 [K+'solve']:(p)=>{let s=card(80,86,1040,420,'',1);
  s+=label('回転の 式',260,150,{size:26,color:C.dim,anchor:'middle'})+T(`I${al}=${ff}${RR}`,600,150,44);
  s+=fade(seg(p,.2,.32),label('α ＝ a/R を 入れる',260,250,{size:26,color:CA,anchor:'middle',weight:700})+T(`I\\,\\dfrac{${aa}}{${RR}}=${ff}${RR}`,600,250,44));
  s+=fade(seg(p,.45,.58),label('R で 割る',260,380,{size:26,color:C.dim,anchor:'middle'})+T(`${ff}=\\dfrac{I${aa}}{${RR}^2}`,600,380,48));
  s+=fade(seg(p,.62,.72),highlight(500,320,200,120,1,CF));
  return s+goalTag(G1);},
 // 5b. 1本目に入れる：Ma＝Mg sinθ−Ia/R² → a でくくる → a＝g sinθ/(1＋I/(MR²))（黄の枠）
 [K+'solve2']:(p)=>{let s=card(80,86,1040,420,'',1);
  s+=label('並進の 式に 入れる',230,140,{size:26,color:C.dim,anchor:'middle'})+T(`M${aa}=Mg${SIN}-\\dfrac{I${aa}}{${RR}^2}`,640,140,38);
  s+=fade(seg(p,.15,.28),label('a で くくる',230,255,{size:26,color:C.dim,anchor:'middle'})+T(`${aa}\\left(M+\\dfrac{I}{${RR}^2}\\right)=Mg${SIN}`,640,255,38));
  s+=fade(seg(p,.35,.48),label('M で 割る',230,400,{size:26,color:C.dim,anchor:'middle'})+T(`${aa}=\\dfrac{g${SIN}}{1+\\dfrac{I}{M${RR}^2}}`,640,400,42));
  s+=fade(seg(p,.55,.65),highlight(480,330,320,150,1,C.hi));
  return s+goalTag(G1);},
 // 6. I/(MR²)＝0.4 → 分母 1.4（黄）。10×0.28＝2.8、2.8÷1.4＝2.0（赤）。重心に加速度の矢印。答えの札（2文目）
 [K+'ans1']:(p,ctx)=>{const W=sentWin(ctx),b=W[1]?W[1][0]:.65;
  let s=slope()+ball(U0,{rot:0})+forces(U0,{fq:0,norm:.35,grav:.35,gl:0});const [cx,cy]=center(U0);
  s+=fade(seg(p,b-.15,b-.05),arrow(cx,cy,cx+130*ux,cy+130*uy,{color:CA,w:7,head:18})+label('2.0 m/s²',cx+130*ux+10,cy+130*uy-16,{size:26,color:CA,weight:700}));
  s+=panel(86,420,T(`${aa}=\\dfrac{g${SIN}}{1+${col(C.hi,'0.4')}}`,PC,150,36)
   +fade(seg(p,.1,.2),label('球：I/(MR²) ＝ 2/5 ＝ 0.4',PC,230,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.2,.3),T(`=\\dfrac{10\\times0.28}{${col(C.hi,'1.4')}}`,PC,300,36))
   +fade(seg(p,.32,.42),T(`=\\dfrac{2.8}{1.4}=${col(CA,'2.0\\ \\mathrm{m/s^2}')}`,PC,410,36)),1,C.hi);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));},
 // 7. 誤答 A → C → D を一枚ずつ。分母だけを並べた小さな表（1・1.4・1.5・2）
 [K+'wrong1']:(p,ctx)=>{const e=1,w=[[0,.3],[.3,.6],[.6,1]];
  const on=i=>seg(p,w[i][0]+.01,w[i][0]+.05)*(i===2?1:1-seg(p,w[i][1]-.04,w[i][1]));
  const rows=[['滑る（回転なし）','1','2.8',0],['球','1.4','2.0',-1],['円板','1.5','約 1.87',2],['輪','2','1.4',1]];
  let s=card(200,86,800,230,'',1);
  s+=label('分母 1 ＋ I/(MR²)',420,125,{size:24,color:C.dim,anchor:'middle',weight:700})+label('a（m/s²）',800,125,{size:24,color:C.dim,anchor:'middle',weight:700});
  rows.forEach(([n,d,a,k],i)=>{const y=168+i*40,hi=k<0?0:on(k)>.5?1:0,clr=k<0?C.hi:hi?CD:C.ink;
   s+=label(n,260,y,{size:24,color:clr,weight:700})+label(d,520,y,{size:26,color:clr,anchor:'middle',weight:700})+label(a,800,y,{size:26,color:clr,anchor:'middle',weight:700});});
  s+=wrongSeq(p,ctx,[['A','2.8','分母 1（回転なし）'],['C','1.4','輪（分母 2）'],['D','約 1.87','円板（分母 1.5）']],{win:w,opts:{y:340}});
  return s+goalTag(G1)+ANS1(1);},

 // ===================== 小問2 =====================
 // 8. カードを消す。接地点の「f？」を黄で光らせる
 [K+'goal2']:(p,ctx)=>{const bl=.5+.5*Math.sin(cueT(ctx)*5);let s=slope()+ball(U0,{rot:0})+forces(U0,{fq:1});
  const [px,py]=contact(U0);s+=fade(.4+.6*bl,ring(px,py,22,{color:C.hi,w:4}));
  return s+goalTag(G2,{g:seg(p,.03,.15)})+ANS1(0);},
 // 9. f＝Ia/R² → (2/5)Ma → 0.4×3×2.0＝2.4 N。摩擦の矢印を実線に「2.4 N」。値が正 → 仮に置いた向きで合っている
 [K+'fval']:(p,ctx)=>{const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=slope()+ball(U0,{rot:0})+forces(U0,{fq:0,fr:1,frDash:seg(p,b-.06,b)<.5?1:0,frVal:seg(p,b-.06,b)>.5?'2.4 N':'f'});
  s+=panel(86,420,T(`${ff}=\\dfrac{I${aa}}{${RR}^2}`,PC,145,36)
   +fade(seg(p,.1,.2),T(`=\\dfrac{\\tfrac{2}{5}M${RR}^2\\,${aa}}{${RR}^2}=\\tfrac{2}{5}M${aa}`,PC,240,32))
   +fade(seg(p,.28,.4),T(`=0.4\\times3\\times2.0=${col(CF,'2.4\\ \\mathrm{N}')}`,PC,330,32))
   +fade(seg(p,b,b+.1),label('値が 正 →',PC,405,{size:24,color:C.hi,anchor:'middle',weight:700})+label('仮に 置いた 向き（坂の 上向き）で 合う',PC,445,{size:24,color:C.hi,anchor:'middle',weight:700}))
   ,1,CF);
  return s+goalTag(G2);},
 // 10. 確かめ：Ma＝3×2.0＝6.0、Mg sinθ−f＝8.4−2.4＝6.0。答えの札（2文目）
 [K+'ans2']:(p,ctx)=>{const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=slope()+ball(U0,{rot:0})+forces(U0,{fq:0,fr:1,frDash:0,frVal:'2.4 N',split:1,norm:.35,gl:0});
  s+=panel(86,420,label('確かめ：並進の 式',PC,130,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.15),label('左辺',PX+60,200,{size:24,color:C.dim})+T(`M${aa}=3\\times2.0=${col(C.hi,'6.0\\ \\mathrm{N}')}`,PX+300,195,30))
   +fade(seg(p,.2,.32),label('右辺',PX+60,290,{size:24,color:C.dim})+T(`Mg${SIN}-${ff}=8.4-2.4`,PX+300,285,28)+T(`=${col(C.hi,'6.0\\ \\mathrm{N}')}`,PX+300,350,30))
   +fade(seg(p,.4,.5),label('一致 ✓',PC,450,{size:30,color:CF,anchor:'middle',weight:700})),1,CF);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.06));},
 // 11. 誤答 A「0 N」。摩擦のトルクの矢印（桃）を光らせ、球の回転がだんだん速くなる
 [K+'wrongA']:(p,ctx)=>{const t=cueT(ctx),bl=.5+.5*Math.sin(t*6),rot=.25*t*t;
  let s=slope()+ball(U0,{rot})+forces(U0,{fq:0,fr:1,frDash:0,frVal:'2.4 N',norm:.3,grav:.3,gl:0});
  s+=fade(.5+.5*bl,torqueMark(U0,{arm:0}));
  s+=fade(seg(p,.4,.5),label('摩擦の トルク → 回転が 速くなる',40,500,{size:24,color:CN,weight:700}));
  s+=wrongCard('A','0 N','滑らない ≠ 摩擦 0',{x:PX,w:PW,y:150,size:26,whySize:24,g:seg(p,.02,.08)});
  return s+goalTag(G2)+ANS2(1);},
 // 12. 誤答 C → D。D の所で、下向きの摩擦なら逆回りのトルクになる薄い影の矢印
 [K+'wrongCD']:(p,ctx)=>{const W=sentWin(ctx),e0=W[0][1],w=[[0,e0*.5],[e0*.5,1]],inD=seg(p,w[1][0]+.01,w[1][0]+.06);
  let s=slope()+ball(U0,{rot:0})+forces(U0,{fq:0,fr:1-inD*.6,frDash:0,frVal:'2.4 N',norm:.3,grav:.3,gl:0});
  const [px,py]=contact(U0);
  s+=fade(inD*.6,arrow(px,py,px+95*ux,py+95*uy,{color:CF,w:5,head:14})+label('下向き なら',px+95*ux+8,py+95*uy+28,{size:22,color:CF,weight:700})+torqueMark(U0,{arm:0,rev:1}));
  s+=fade(inD,label('逆回りの トルク → 回転を 遅らせる',40,500,{size:24,color:CN,weight:700}));
  s+=wrongSeq(p,ctx,[['C','上向き 8.4 N','Mg sinθ を 摩擦に した'],['D','下向き 2.4 N',['向きが 逆','（回転を 遅らせる 向き）']]],{win:w,opts:{x:PX,w:PW,y:150,size:26,whySize:24}});
  return s+goalTag(G2)+ANS2(1);},
 // 13. 接地点は止まっている → 摩擦は仕事をしない。エネルギーの棒を並進（橙）と回転（桃）、「熱 0」
 [K+'nowork']:(p,ctx)=>{const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=slope()+ball(U0,{rot:0})+forces(U0,{fq:0,fr:1,frDash:0,frVal:'2.4 N',norm:0,grav:0});
  const [px,py]=contact(U0);
  s+=fade(seg(p,.03,.12),ring(px,py,18,{color:C.hi,w:4})+label('止まっている',px+20,py+44,{size:24,color:C.hi,weight:700}));
  s+=panel(86,150,label('接地点は 止まっている',PC,140,{size:26,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.15,.25),label('→ 摩擦の 仕事 ＝ 0',PC,195,{size:28,color:CF,anchor:'middle',weight:700})),seg(p,.02,.1),CF);
  s+=fade(seg(p,b,b+.1),ebar(1000,470,200)+rect(1070,280,100,44,{fill:CARDBG,fo:.95,stroke:C.dim,sw:2,rx:8})+label('熱 0',1120,311,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s+LEGE(seg(p,b,b+.1))+goalTag(G2)+ANS2(1);},

 // ===================== 小問3 =====================
 // 14. 坂の図を消し、出題中の小問3の図（スケーター）
 [K+'goal3']:(p)=>skScene(0,SK.A1,{ghost:1,lab2:1})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 「法則」外からのトルク 0 → L 一定。L の棒（黄）5×2＝10。腕を縮めても棒は同じ長さ、回る速さが上がる。ω₂＝10÷2＝5
 [K+'lconst']:(p,ctx)=>{const t=cueT(ctx);
  let s=skScene(1.1*t,SK.A1,{lab1:1,note1:1});
  s+=panel(86,420,kindTag('法則',PC,130,{text:'外からの トルク 0 → L 一定',g:seg(p,.05,.2)})
   +fade(seg(p,.3,.45),T(`L=I${col(CW,'\\omega')}`,PC,240,44)+label('一定',PC,310,{size:30,color:CL,anchor:'middle',weight:700})),1,CL);
  return s+goalTag(G3);},
 // 15b. L の棒（黄）5×2＝10。腕を縮めても棒は同じ長さ、回る速さが上がる。ω₂＝10÷2＝5
 [K+'lconst2']:(p,ctx)=>{const t=cueT(ctx),d0=durOf(ctx,K+'lconst',6),t0=(ctx?.dur??10)*.3;
  const armOf=tt=>mix(SK.A1,SK.A2,seg(tt,t0,t0+2.5));const arm=armOf(t),phi=1.1*d0+spinPhi(t,armOf);
  let s=skScene(phi,arm,{lab1:1-seg(t,t0,t0+1),note1:1});
  s+=fade(seg(t,t0+2,t0+3),label('I₂ ＝ 2 kg·m²',40,440,{size:26,color:C.ink,weight:700}));
  s+=panel(86,420,kindTag('法則',PC,130,{text:'外からの トルク 0 → L 一定'})
   +vbar(PX+110,440,200,CL,{g:seg(p,.03,.1),val:'L ＝ 10',lab:'L'})
   +fade(seg(p,.05,.15),T(`L=5\\times2=10`,PX+330,220,32)+label('kg·m²/s',PX+330,262,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.6,.7),T(`${col(CW,'\\omega_2')}=10\\div2=${col(CW,'5')}`,PX+330,360,32)+label('rad/s',PX+330,402,{size:22,color:CW,anchor:'middle'})),1,CL);
  return s+goalTag(G3);},
 // 16. K＝½Iω²＝L²/(2I)。K の棒（桃）が 10 J から 25 J へ
 [K+'kup']:(p,ctx)=>{const W=sentWin(ctx),b=W[1]?W[1][0]:.45,gK=seg(p,b+.2,b+.4),t=cueT(ctx);
  let s=skScene(spinPhi(t,()=>SK.A2)+3,SK.A2,{lab1:0,note1:1});
  s+=label('I₂ ＝ 2 kg·m²',40,430,{size:26,color:C.ink,weight:700})+label('ω₂ ＝ 5 rad/s',40,466,{size:26,color:CW,weight:700});
  const hk=v=>v*6.4,xb=PX+400,yb=470;
  s+=panel(86,420,T(`K=\\tfrac{1}{2}I${col(CW,'\\omega')}^2`,PX+170,140,32)
   +fade(seg(p,.12,.24),T(`=\\dfrac{L^2}{2I}`,PX+170,215,32))
   +fade(seg(p,b,b+.1),label('前',PX+20,312,{size:24,color:C.dim})+T(`100\\div10=10\\ \\mathrm{J}`,PX+200,305,28))
   +fade(seg(p,b+.15,b+.25),label('後',PX+20,382,{size:24,color:C.dim})+T(`100\\div4=25\\ \\mathrm{J}`,PX+200,375,28))
   +fade(seg(p,b,b+.1),vbar(xb,yb,hk(mix(10,25,gK)),CRot,{val:`K ＝ ${Math.round(mix(10,25,gK))} J`,w:80})),1,CRot);
  return s+LEGE(1,380)+goalTag(G3);},
 // 17. 腕を引く力（緑・内向き）と手が動く向き（内向き）がそろう。K の棒の増えた部分「＋15 J＝筋肉の仕事」。答えの札（2文目）
 [K+'ans3']:(p,ctx)=>{const W=sentWin(ctx),b=W[1]?W[1][0]:.6,arm=mix(SK.A1,SK.A2,seg(p,.05,.5));
  let s=skScene(.6,arm,{lab1:0,note1:1,o:{force:seg(p,.03,.12),move:seg(p,.12,.2),handHi:1}});
  s+=fade(seg(p,.15,.25),label('引く 力（緑）と 手の 動き（紫）が 同じ 向き',40,470,{size:24,color:C.ink,weight:700}));
  const hk=v=>v*6.4,yb=470,xb=PX+380;
  s+=panel(86,420,vbar(xb,yb,hk(25),CRot,{val:'K ＝ 25 J',w:80})+line(xb-60,yb-hk(10),xb+60,yb-hk(10),{color:C.ink,w:3,dash:'6 5'})+label('10 J',xb+66,yb-hk(10)+8,{size:22,color:C.dim})
   +fade(seg(p,.3,.4),line(xb-50,yb-hk(25),xb-50,yb-hk(10),{color:C.hi,w:3})+label('＋15 J ＝',PX+40,yb-hk(20),{size:28,color:C.hi,weight:700})+label('筋肉の 仕事',PX+40,yb-hk(20)+40,{size:28,color:C.hi,weight:700})),1,CRot);
  return s+LEGE(1,380)+goalTag(G3)+ANS3(seg(p,b,b+.06));},
 // 18. 内力の対（緑）。2段の札「トルク：打ち消す → L 一定」「仕事：残る → K 増える」
 [K+'internal']:(p,ctx)=>{const W=sentWin(ctx),e=W[0][1];
  let s=skScene(.6,110,{lab1:0,note1:1,o:{pair:seg(p,.03,.15)}});
  s+=fade(seg(p,.05,.15),label('体が 腕を 引く（緑）・腕が 体を 引く（深緑）',40,480,{size:22,color:C.ink,weight:700}));
  s+=panel(86,420,label('内力（体と 腕の 間の 力）',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.28),rect(PX+30,175,PW-60,100,{fill:CL,fo:.08,stroke:CL,sw:2,rx:12})+label('トルク：打ち消す',PC,215,{size:28,color:CL,anchor:'middle',weight:700})+label('→ L 一定',PC,255,{size:28,color:CL,anchor:'middle',weight:700}))
   +fade(seg(p,e*.55,e*.55+.12),rect(PX+30,300,PW-60,100,{fill:CRot,fo:.08,stroke:CRot,sw:2,rx:12})+label('仕事：残る',PC,340,{size:28,color:CRot,anchor:'middle',weight:700})+label('→ K 増える',PC,380,{size:28,color:CRot,anchor:'middle',weight:700})),1,C.faint);
  return s+goalTag(G3)+ANS3(1);},
 // 19. 誤答 A → B → D を一枚ずつ
 [K+'wrong3']:(p,ctx)=>{const W=sentWin(ctx),e0=W[0][1],w=[[0,e0*.45],[e0*.45,e0],[W[1]?W[1][0]:e0,1]];
  let s=skScene(.6,SK.A2,{lab1:0,note1:1});
  s+=label('L ＝ 10 一定、K：10 J → 25 J',40,480,{size:24,color:C.ink,weight:700});
  s+=wrongSeq(p,ctx,[['A','5 rad/s、0 J','K は 増える（筋肉が 仕事）'],['B','約 3.2 rad/s、0 J','保存するのは L（K ではない）'],['D','2 rad/s、0 J','保存するのは 角速度 ではない']],{win:w,opts:{x:PX-40,w:PW+40,y:180,size:26,whySize:24}});
  return s+goalTag(G3)+ANS3(1);},

 // ===================== まとめ =====================
 // 20. 坂の図とスケーターの図を並べ、「エネルギー」「角運動量」の札をそれぞれの条件に矢印でつなぐ。答えの札3枚
 [K+'sum']:(p)=>{const g1=seg(p,.02,.12),g2=seg(p,.12,.22),g3=seg(p,.3,.42);
  let a='';const k=.75;
  a+=`<g transform="translate(15 0) scale(${k})">`+slope({thLab:0})+ball(U0,{rot:0})+forces(U0,{fq:0,grav:0,norm:0,fr:1,frDash:0,frVal:''})+'</g>';
  a+=label('a ＝ 2.0 m/s²',300,320,{size:26,color:CA,anchor:'middle',weight:700})+label('f ＝ 2.4 N（上向き）',300,358,{size:26,color:CF,anchor:'middle',weight:700})
   +label('摩擦：仕事 0・トルク あり',300,400,{size:24,color:C.ink,anchor:'middle',weight:700});
  let s=card(20,96,560,330,a,g1);
  let b='';b+=`<g transform="translate(${-470+820} ${-300+230}) scale(1)">`+skaterTop(470,300,70,.6)+'</g>';
  b+=label('L ＝ 10 一定',1040,200,{size:26,color:CL,anchor:'middle',weight:700})+label('K：10 → 25 J',1040,245,{size:26,color:CRot,anchor:'middle',weight:700})
   +label('外からの トルク 0',890,400,{size:24,color:C.ink,anchor:'middle',weight:700});
  s+=card(620,96,560,330,b,g2);
  s+=fade(g3,rect(160,440,280,52,{fill:CE,fo:.12,stroke:CE,sw:2.5,rx:12})+label('エネルギー',300,475,{size:28,color:CE,anchor:'middle',weight:700})
   +rect(760,440,280,52,{fill:CL,fo:.12,stroke:CL,sw:2.5,rx:12})+label('角運動量',900,475,{size:28,color:CL,anchor:'middle',weight:700}));
  s+=answerRow([[1,'B','2.0 m/s²'],[2,'B',''],[3,'C','5 rad/s、15 J']],{g:seg(p,.8,.9),size:24});
  return s;},
};
