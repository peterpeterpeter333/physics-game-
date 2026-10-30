// 問題編 解説「はずみ車と、坂を転がる円板」（q-um-rotation、大学編 18 剛体の回転・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/18_剛体の回転.md の q-um-rotation（解説 19 行）。
// 配置：左に はずみ車・車輪・坂、右に説明の枠。札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：r・R・弧 s・高さ 水色、角 θ 橙、v 紫、ω・回転の速度・トルク N 桃、α・加速度 赤、力 緑、エネルギー 並進 橙・回転 桃、合成の速度 黄（凡例を出す）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly,ground} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,legend,note,pauseBadge,kindTag,sentWin,cueT,tAt,textW} from './yt1-qx-common.mjs';

const K='qx-um-rotation:';
const CX=C.x,CTH=C.E,CV=C.v,CW=C.p,CA=C.a,CF=C.F,CN=C.p,CE=C.E,CRot=C.p,CD='#ff6b6b',CARDBG='#131f38';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const col=(c,s)=>`{\\color{${c}}{${s}}}`;
const rr=col(CX,'r'),RR=col(CX,'R'),TH=col(CTH,'\\theta'),SS=col(CX,'s'),VV=col(CV,'v'),WW=col(CW,'\\omega'),AL=col(CA,'\\alpha'),FF=col(CF,'F'),NN=col(CN,'N'),AA=col(CA,'a');
const TAU=2*Math.PI;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const G1='角加速度 α',G2='接地点と一番上の速さ',G3='坂の下での速さ v';
const ANS1=g=>answerTag(1,'B','4.0 rad/s²',{g}),ANS2=g=>answerTag(2,'C','接地点 0、一番上 24 m/s',{g}),ANS3=g=>answerTag(3,'B','約 2.45 m/s',{g});
const LEGV=(g=1)=>legend([['合成',C.hi]],24,500,{g,dir:'row'});
const LEGE=(g=1)=>legend([['並進',CE],['回転',CRot]],24,500,{g,dir:'row'});

const arcPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
function headAt(pts,color,H=16){const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1);
 return poly([[x2,y2],[x2-H*Math.cos(a)+H*.5*Math.sin(a),y2-H*Math.sin(a)-H*.5*Math.cos(a)],[x2-H*Math.cos(a)-H*.5*Math.sin(a),y2-H*Math.sin(a)+H*.5*Math.cos(a)]],{fill:color,fo:1});}
function turnArc(cx,cy,r,a0,a1,{color=CW,w=5,g=1}={}){const pts=arcPts(cx,cy,r,a0,a1,30);return fade(g,draw(pts.slice(0,-2),1,{color,w})+headAt(pts,color));}

// ---- はずみ車（正面から見た図）。rot：画面の角（時計回りが＋）----
const FW={cx:320,cy:290,R:160,rp:140};
function flywheel(rot,{g=1,cx=FW.cx,cy=FW.cy,R=FW.R,dim=0}={}){
 let s=ring(cx,cy,R,{color:'#7d8aa6',w:5,fill:'#2a3550'})+ring(cx,cy,R*.82,{color:'#3f4c68',w:3});
 for(let k=0;k<8;k++){const a=rot+TAU*k/8;s+=line(cx+R*.86*Math.cos(a),cy+R*.86*Math.sin(a),cx+R*.97*Math.cos(a),cy+R*.97*Math.sin(a),{color:'#9aa6c0',w:4});}
 s+=line(cx+22*Math.cos(rot),cy+22*Math.sin(rot),cx+R*.8*Math.cos(rot),cy+R*.8*Math.sin(rot),{color:'#56637f',w:3});
 s+=ring(cx,cy,16,{color:C.dim,w:4,fill:'#141d33'})+dot(cx,cy,6,C.ink);
 return fade(g*(dim?.55:1),s);
}
// 押す力（一番上の点、接線の向き＝右）と 0.4 m、摩擦のトルク、I の札
function fwLabels({force=1,dist=1,fric=1,inert=1,cx=FW.cx,cy=FW.cy,rp=FW.rp,fval='10 N',tq=0}={}){
 const px=cx,py=cy-rp;let s='';
 s+=fade(dist,line(cx,cy,px,py,{color:CX,w:4})+label('0.4 m',cx-12,cy-rp/2,{size:28,color:CX,anchor:'end',weight:700}));
 s+=fade(force,dot(px,py,9,C.ink)+arrow(px,py,px+150,py,{color:CF,w:7,head:20})+label(fval,px+160,py+10,{size:30,color:CF,weight:700}));
 s+=fade(fric,turnArc(cx,cy,48,-.35,-2.8,{color:CN,w:5})+label('摩擦のトルク 0.8 N·m',cx,cy+FW.R+38,{size:26,color:CN,anchor:'middle',weight:700}));
 s+=fade(inert,label('I ＝ 0.8 kg·m²',30,118,{size:28,color:C.ink,weight:700}));
 if(tq)s+=fade(tq,turnArc(cx,cy,rp+28,-2.2,-1.0,{color:CN,w:5}));
 return s;
}

// ---- 転がる車輪 ----
function wheel(cx,cy,R,rot,{g=1,spokes=6,rim='#9aabc7',ghost=0}={}){
 let s=ring(cx,cy,R,{color:rim,w:6,fill:ghost?'none':'#141d33'});
 for(let k=0;k<spokes;k++){const a=rot+TAU*k/spokes;s+=line(cx,cy,cx+R*.9*Math.cos(a),cy+R*.9*Math.sin(a),{color:C.faint,w:3});}
 s+=dot(cx,cy,6,C.dim);
 return fade(g,s);
}
const pts3=(cx,cy,R,g=1)=>fade(g,[[cx,cy-R],[cx,cy],[cx,cy+R]].map(([x,y])=>ring(x,y,11,{color:C.ink,w:3,fill:'#e9eefb'})).join(''));
const hArr=(x,y,len,color,o={})=>Math.abs(len)>3?arrow(x,y,x+len,y,{color,w:7,head:18,...o}):'';
const W2={cx:330,R:120,gy:420};
// 出題の小問2の図：右へ転がる（スロー）→ 映像を一時停止して3つの点
function q2Wheel(tm,{badge=1,dots=1}={}){
 const {R,gy}=W2,th=(TAU/3)*clamp(tm/3),cx=W2.cx-120+R*th,cy=gy-R;
 let s=ground(80,760,gy)+wheel(cx,cy,R,th);
 s+=label('スロー',100,130,{size:26,color:C.dim,weight:700})+label('右へ 12 m/s',100,170,{size:30,color:C.ink,weight:700});
 if(dots)s+=pts3(cx,cy,R,dots);
 if(badge)s+=pauseBadge({g:badge,x:900,y:110});
 return {s,cx,cy};
}
const W2END=()=>{const {R,gy}=W2;return {cx:W2.cx-120+R*TAU/3,cy:gy-R,R,gy};};

// ---- 坂と円板 ----
const SL={x1:120,y1:190,x2:540,y2:420};
const slGeom=()=>{const {x1,y1,x2,y2}=SL,L=Math.hypot(x2-x1,y2-y1);return {ux:(x2-x1)/L,uy:(y2-y1)/L,L};};
function slope({hLab=1}={}){const {x1,y1,x2,y2}=SL;
 let s=poly([[x1,y1],[x2,y2],[x1,y2]],{fill:'#26324d',fo:.8,stroke:C.dim,sw:2})+line(x2,y2,x2+60,y2,{color:C.dim,w:3});
 if(hLab)s+=line(x1-22,y1,x1-22,y2,{color:CX,w:3})+line(x1-30,y1,x1-14,y1,{color:CX,w:3})+line(x1-30,y2,x1-14,y2,{color:CX,w:3})+label('0.45 m',x1-30,(y1+y2)/2+8,{size:24,color:CX,anchor:'end',weight:700});
 return s;}
const DR=42;
function diskAt(u,{g=1,lab=0}={}){const {x1,y1,x2,y2}=SL,{ux,uy,L}=slGeom(),x=mix(x1,x2,u),y=mix(y1,y2,u),cx=x+DR*uy,cy=y-DR*ux,rot=u*L/DR;
 let s=ring(cx,cy,DR,{color:'#c9d2e0',w:3,fill:'#8fa6cf'})+line(cx,cy,cx+DR*.9*Math.cos(rot),cy+DR*.9*Math.sin(rot),{color:'#2a3550',w:3})+dot(cx,cy,5,C.bg);
 if(lab)s+=fade(lab,label('M、R',cx+DR+12,cy-16,{size:26,color:C.ink,weight:700})+label('I ＝ ½MR²',cx+DR+12,cy+16,{size:26,color:C.ink,weight:700}));
 return fade(g,s);}
const diskC=u=>{const {x1,y1,x2,y2}=SL,{ux,uy}=slGeom();return [mix(x1,x2,u)+DR*uy,mix(y1,y2,u)-DR*ux];};
// エネルギーの棒（1本。pot 残り、tr 並進、ro 回転）
const BX=1060,BY=470,BH=200,BW=80;
function ebar({pot=1,tr=0,ro=0,g=1}={}){
 let s=rect(BX-BW/2,BY-BH,BW,BH,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:4});
 if(pot>.002)s+=rect(BX-BW/2+4,BY-pot*BH,BW-8,pot*BH-2,{fill:CE,fo:.12,stroke:CE,sw:2,rx:3}).replace('/>',' stroke-dasharray="7 6"/>');
 if(tr>.002)s+=rect(BX-BW/2+4,BY-tr*BH,BW-8,tr*BH-2,{fill:CE,fo:.85,stroke:'none',rx:3});
 if(ro>.002)s+=rect(BX-BW/2+4,BY-(tr+ro)*BH,BW-8,ro*BH,{fill:CRot,fo:.85,stroke:'none',rx:3});
 s+=label('円板',BX,BY+32,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}

// ---- 競走（箱・円板・輪）----
const LN=i=>({x1:190,x2:510,yT:120+i*125,yB:200+i*125});
function lane(i,u,kind){const {x1,x2,yT,yB}=LN(i),L=Math.hypot(x2-x1,yB-yT),ux=(x2-x1)/L,uy=(yB-yT)/L,x=mix(x1,x2,u),y=mix(yT,yB,u);
 let s=poly([[x1,yT],[x2,yB],[x1,yB]],{fill:'#26324d',fo:.8,stroke:C.dim,sw:2})+line(x2,yB,x2+70,yB,{color:C.dim,w:3})+line(x2+50,yB-30,x2+50,yB,{color:C.hi,w:3,dash:'5 5'});
 const r=20,cx=x+r*uy,cy=y-r*ux,rot=u*L/r;
 if(kind==='box')s+=`<g transform="rotate(${(Math.atan2(yB-yT,x2-x1)*180/Math.PI).toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})">`+rect(cx-r,cy-r,2*r,2*r,{fill:'#c58a4a',fo:.6,stroke:'#e0a866',sw:2,rx:4})+'</g>';
 if(kind==='disk')s+=ring(cx,cy,r,{color:'#c9d2e0',w:2,fill:'#8fa6cf'})+line(cx,cy,cx+r*Math.cos(rot),cy+r*Math.sin(rot),{color:'#2a3550',w:3});
 if(kind==='ring')s+=ring(cx,cy,r-3,{color:C.hi,w:7})+line(cx+(r-8)*Math.cos(rot),cy+(r-8)*Math.sin(rot),cx+(r+1)*Math.cos(rot),cy+(r+1)*Math.sin(rot),{color:'#2a3550',w:3});
 return s;}
function race(tau){
 const k=[1,Math.sqrt(1.5),Math.sqrt(2)],names=['箱（滑る）','円板','輪'],kinds=['box','disk','ring'];let s='';
 kinds.forEach((kd,i)=>{const u=Math.min(1,(tau/k[i])**2);s+=lane(i,u,kd)+label(names[i],LN(i).x1-14,LN(i).yT+40,{size:24,color:C.ink,anchor:'end',weight:700});
  if(u>=1)s+=label(['1着','2着','3着'][i],LN(i).x2+90,LN(i).yB-6,{size:24,color:C.hi,weight:700});});
 return s;
}

export const ytQxUmRotationDiagrams={
 // ===================== 問題アニメ =====================
 // 小問1の図（約4秒）：はずみ車と軸。0〜2 s で 0.4 m と力 10 N、2〜4 s で摩擦のトルク。I の札。回さずに静止
 [K+'q1']:(p)=>flywheel(0,{g:seg(p,0,.15)})+fwLabels({dist:seg(p,.1,.3),force:seg(p,.2,.45),fric:seg(p,.55,.8),inert:seg(p,.75,.95)}),
 // 小問2の図（約3.5秒）：右へ転がる車輪（スロー、3 s で 1/3 回転）→ 映像を一時停止、3つの点。速度の矢印は描かない
 [K+'q2']:(p,ctx)=>{const t=cueT(ctx);return q2Wheel(Math.min(t,3),{badge:clamp((t-3)/.3),dots:clamp((t-3.05)/.3)}).s;},
 // 小問3の図（約3秒）：高さ 0.45 m の坂の上に、一様な円板。静止
 [K+'q3']:(p)=>fade(seg(p,0,.3),slope())+diskAt(0,{g:seg(p,.2,.45),lab:seg(p,.45,.75)}),

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>flywheel(0)+fwLabels()+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 軸から r の点が回って弧 s。右の枠で s＝rθ → v＝rω → a＝rα
 [K+'arc']:(p,ctx)=>{
  const th=.7*seg(p,.03,.2),{cx,cy}=FW,r=140,a0=-Math.PI/2,a=a0+th;
  let s=flywheel(th);
  s+=line(cx,cy,cx+r*Math.cos(a0),cy+r*Math.sin(a0),{color:C.faint,w:3,dash:'6 6'})+line(cx,cy,cx+r*Math.cos(a),cy+r*Math.sin(a),{color:CX,w:4});
  s+=label('r',cx+r*.55*Math.cos(a)+14,cy+r*.55*Math.sin(a)-4,{size:32,color:CX,weight:700});
  if(th>.05)s+=draw(arcPts(cx,cy,r,a0,a),1,{color:CX,w:8})+label('s',cx+(r+26)*Math.cos(a0+th/2),cy+(r+26)*Math.sin(a0+th/2),{size:32,color:CX,weight:700})
   +draw(arcPts(cx,cy,44,a0,a),1,{color:CTH,w:4})+T(TH,cx+70*Math.cos(a0+th/2),cy+70*Math.sin(a0+th/2)+10,28);
  s+=dot(cx+r*Math.cos(a),cy+r*Math.sin(a),10,C.ink);
  const eA=`${AA}=${rr}\\,\\dfrac{d${WW}}{dt}=${rr}\\,${AL}`,xA=PC-texWidth(eA,36,false)/2,wA0=texWidth(`${AA}=${rr}\\,`,36,false),wA1=texWidth(`${AA}=${rr}\\,\\dfrac{d${WW}}{dt}`,36,false);
  s+=panel(86,420,T(`${SS}=${rr}\\,${TH}`,PC,135,38)
   +fade(seg(p,.25,.32),label('↓ 1回 微分',PC-150,180,{size:24,color:C.dim}))
   +fade(seg(p,.3,.42),T(`${VV}=${rr}\\,\\dfrac{d${TH}}{dt}=${rr}\\,${WW}`,PC,235,36))
   +fade(seg(p,.5,.57),label('↓ もう 1回 微分',PC-150,300,{size:24,color:C.dim}))
   +fade(seg(p,.55,.68),T(eA,PC,360,36))
   +fade(seg(p,.72,.8),highlight(xA+wA0-5,318,wA1-wA0+10,84,1,CA)+label('α ＝ dω/dt',PC,470,{size:28,color:CA,anchor:'middle',weight:700})),1,CX);
  return s+goalTag(G1);
 },
 // 3. その点に接線方向の力 F。m(rα)＝F → 両辺に r → mr²α＝rF（rF を桃の枠で「トルク」）
 [K+'point']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,{cx,cy}=FW,r=140,a=-Math.PI/2+.7,px=cx+r*Math.cos(a),py=cy+r*Math.sin(a),tx=-Math.sin(a),ty=Math.cos(a);
  let s=flywheel(.7)+line(cx,cy,px,py,{color:CX,w:4})+label('r',cx+r*.55*Math.cos(a)+14,cy+r*.55*Math.sin(a)-4,{size:32,color:CX,weight:700});
  s+=dot(px,py,11,C.ink)+label('m',px-34,py-6,{size:28,color:C.ink,weight:700});
  s+=fade(seg(p,.03,.12),arrow(px,py,px+120*tx,py+120*ty,{color:CF,w:7,head:18})+label('F',px+120*tx+12,py+120*ty+8,{size:30,color:CF,weight:700}));
  const e2=`m${rr}^2${AL}=`,w2=texWidth(e2+`${rr}${FF}`,44,false),x2=PC-w2/2,wl=texWidth(e2,44,false);
  s+=panel(86,420,label('接線方向に ma ＝ F',PC,130,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.22),T(`m\\,(${rr}${AL})=${FF}`,PC,200,44))
   +fade(seg(p,b,b+.08),label('両辺に r を 掛ける',PC,270,{size:26,color:CX,anchor:'middle',weight:700}))
   +fade(seg(p,b+.1,b+.2),T(e2+`${rr}${FF}`,PC,345,44))
   +fade(seg(p,b+.25,b+.33),highlight(x2+wl-6,305,w2-wl+12,78,1,CN)+label('トルク',x2+wl+(w2-wl)/2,430,{size:30,color:CN,anchor:'middle',weight:700})),1,CX);
  return s+goalTag(G1);
 },
 // 4. 全部の点で足す：Σmr²α＝ΣrF → Iα＝N。ma＝F と Iα＝N の対応。「N は外からのトルクの和」
 [K+'sum1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,{cx,cy}=FW;
  let s=flywheel(.7);
  const many=[[60,-1.2],[100,-.4],[130,.6],[90,1.5],[150,2.4],[70,3.1],[120,-2.3],[155,-.9]];
  many.forEach(([r,a],i)=>{const g=seg(p,.02+i*.02,.08+i*.02),x=cx+r*Math.cos(a),y=cy+r*Math.sin(a),tx=-Math.sin(a),ty=Math.cos(a);
   s+=fade(g,dot(x,y,7,C.ink)+arrow(x,y,x+40*tx,y+40*ty,{color:CF,w:4,head:10}));});
  s+=fade(seg(p,.1,.2),label('どの 点でも m r²α ＝ rF',cx,cy+FW.R+40,{size:26,color:C.ink,anchor:'middle',weight:700}));
  const e1=`\\Sigma m${rr}^2\\,${AL}=\\Sigma ${rr}${FF}`;
  s+=panel(86,420,fade(seg(p,.2,.3),T(e1,PC,140,38))
   +fade(seg(p,.32,.42),label('↓',PC,190,{size:26,color:C.dim,anchor:'middle'})+T(`I\\,${AL}=${NN}`,PC,245,48))
   +fade(seg(p,b,b+.08),line(PX+30,290,PX+PW-30,290,{color:C.faint,w:2})
    +T(`m\\,${AA}=${FF}`,PX+130,345,38)+T(`I\\,${AL}=${NN}`,PX+130,425,38)
    +label('m ↔ I',PX+340,330,{size:26,color:C.ink,weight:700})+label('a ↔ α',PX+340,370,{size:26,color:CA,weight:700})+label('F ↔ N',PX+340,410,{size:26,color:CN,weight:700}))
   +fade(seg(p,b+.15,b+.25),label('N は 外からの トルクの 和',PC,480,{size:26,color:C.hi,anchor:'middle',weight:700})),1,CN);
  return s+goalTag(G1);
 },
 // 5. 押す力のトルク 0.4×10＝4.0、摩擦 0.8（逆向き）。桃の棒を逆向きに並べて 3.2
 [K+'torque']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=flywheel(0)+fwLabels({inert:0,tq:seg(p,.1,.2)});
  s+=fade(seg(p,.12,.22),label('4.0',FW.cx-130,FW.cy-150,{size:28,color:CN,weight:700}));
  const bx=PX+40,bw=420,u=bw/4.0,by=330;
  s+=panel(86,420,T(`0.4\\times10=${col(CN,'4.0')}\\ \\mathrm{N\\,m}`,PC,140,38)
   +fade(seg(p,b,b+.08),T(`${NN}=4.0-0.8=${col(CN,'3.2')}\\ \\mathrm{N\\,m}`,PC,215,38))
   +fade(seg(p,.2,.3),rect(bx,by-26,4.0*u,26,{fill:CN,fo:.85,stroke:'none',rx:4})+label('押す力 4.0',bx,by-36,{size:24,color:CN,weight:700}))
   +fade(seg(p,b+.08,b+.16),rect(bx+3.2*u,by+8,0.8*u,26,{fill:'none',fo:0,stroke:CN,sw:3,rx:4})+label('摩擦 0.8（逆向き）',bx+4.0*u,by+66,{size:24,color:CN,anchor:'end',weight:700})
    +arrow(bx+4.0*u,by+44,bx+3.2*u,by+44,{color:CN,w:3,head:10}))
   +fade(seg(p,b+.2,b+.3),line(bx+3.2*u,by-40,bx+3.2*u,by+40,{color:C.hi,w:3,dash:'5 5'})+label('残り 3.2',bx+1.6*u,by+110,{size:28,color:C.hi,anchor:'middle',weight:700})),1,CN);
  return s+goalTag(G1);
 },
 // 6. α＝N/I＝3.2÷0.8＝4.0（赤）。単位の札。はずみ車が回り始め、だんだん速くなる。答えの札（2文目）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,t=cueT(ctx),rot=.12*t*t;
  let s=flywheel(rot)+fwLabels({inert:0,fric:1,dist:.5});
  s+=panel(86,420,T(`I\\,${AL}=${NN}`,PC,135,38)
   +fade(seg(p,.05,.15),T(`${AL}=\\dfrac{${NN}}{I}=\\dfrac{3.2}{0.8}`,PC,230,38))
   +fade(seg(p,.2,.3),T(`=${col(CA,'4.0\\ \\mathrm{rad/s^2}')}`,PC,320,42))
   +fade(seg(p,.32,.42),label('単位：N·m ÷ kg·m² ＝ 1/s²',PC,410,{size:24,color:C.dim,anchor:'middle'})),1,CA);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));
 },
 // 7. 誤答 A → C → D を一枚ずつ。C の間、F↔N の対応を光らせる
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],w=[[0,e0*.45],[e0*.45,e0],[W[1]?W[1][0]:e0,1]];
  const onC=seg(p,w[1][0]+.01,w[1][0]+.05)*(1-seg(p,w[1][1]-.04,w[1][1])),bl=.5+.5*Math.sin(cueT(ctx)*6);
  let s=card(80,90,520,200,label('正しい 計算',340,130,{size:24,color:C.dim,anchor:'middle'})+T(`${AL}=\\dfrac{4.0-0.8}{0.8}=4.0`,340,215,38),1);
  s+=card(640,90,480,200,T(`m\\,${AA}=${FF}`,800,150,34)+T(`I\\,${AL}=${NN}`,800,235,34)+label('F ↔ N',1010,195,{size:28,color:CN,weight:700})
   +fade(onC*(.4+.6*bl),highlight(980,160,120,52,1,C.hi)),1,onC>.5?C.hi:C.faint);
  s+=wrongSeq(p,ctx,[['A','5.0','4.0÷0.8（摩擦を 引いていない）'],['C','12.5','10÷0.8（力を 割った）'],['D','2.56','3.2×0.8（掛けた）']],{win:w,opts:{y:330}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 8. はずみ車とカードを消し、出題中の小問2の図（車輪と3つの点）。凡例「合成 黄」
 [K+'goal2']:(p)=>q2Wheel(3,{badge:1,dots:1}).s+LEGV(seg(p,.1,.25))+goalTag(G2,{g:seg(p,.03,.15)}),
 // 9. 2枚の薄い絵：左は回らずに右へ滑る（紫が3点とも同じ）、右はその場で回る（桃：上は前、下は後ろ、中心 0）。重ねて元の車輪に戻す
 [K+'split']:(p)=>{
  const R=100,gy=400,cy=gy-R,xa=250,xb=800,mg=seg(p,.72,.85),xa2=mix(xa,525,mg),xb2=mix(xb,525,mg),L=90;
  let s=ground(60,1140,gy);
  const ga=seg(p,.03,.12),gb=seg(p,.25,.35),arr=1-seg(p,.7,.74);
  s+=fade(ga*(1-mg*.6),wheel(xa2,cy,R,0,{rim:CV}))+fade(ga*arr,[cy-R,cy,cy+R].map(y=>dot(xa2,y,8,C.ink)+hArr(xa2,y,L,CV)).join('')+label('並進',xa,cy-R-50,{size:30,color:CV,anchor:'middle',weight:700})+label('（回らずに 右へ 滑る）',xa,cy-R-16,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(gb*(1-mg*.6),wheel(xb2,cy,R,0,{rim:CW}))+fade(gb*arr,dot(xb,cy-R,8,C.ink)+hArr(xb,cy-R,L,CW)+dot(xb,cy+R,8,C.ink)+hArr(xb,cy+R,-L,CW)+dot(xb,cy,8,C.ink)+label('0',xb+18,cy+8,{size:26,color:CW,weight:700})
   +label('回転',xb,cy-R-50,{size:30,color:CW,anchor:'middle',weight:700})+label('（その場で 回る）',xb,cy-R-16,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(gb*arr,label('＋',525,cy+12,{size:56,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.85,.95),wheel(525,cy,R,0)+pts3(525,cy,R)+label('転がり ＝ 並進 ＋ 回転',525,cy-R-24,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s+LEGV()+goalTag(G2);
 },
 // 10. s＝Rθ → v＝Rω。縁の桃の矢印と中心の紫の矢印が同じ長さ「Rω＝v＝12 m/s」
 [K+'same']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,R=120,gy=430,cx=300,cy=gy-R,L=110;
  let s=ground(60,640,gy)+wheel(cx,cy,R,0)+pts3(cx,cy,R);
  s+=fade(seg(p,b,b+.1),dot(cx,cy,8,C.ink)+hArr(cx,cy,L,CV)+label('v',cx+L/2,cy-16,{size:30,color:CV,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.1,b+.2),hArr(cx,cy-R,L,CW)+label('Rω',cx+L/2,cy-R-16,{size:30,color:CW,anchor:'middle',weight:700}));
  s+=panel(86,420,T(`${SS}=${RR}\\,${TH}`,PC,140,40)+fade(seg(p,.1,.18),label('↓ 微分',PC-120,190,{size:24,color:C.dim}))
   +fade(seg(p,.18,.28),T(`${VV}=${RR}\\,${WW}`,PC,245,44))
   +fade(seg(p,b+.2,b+.3),line(PX+40,295,PX+PW-40,295,{color:C.faint,w:2})+label('回転による 縁の 速さ',PC,345,{size:26,color:CW,anchor:'middle',weight:700})
    +T(`${RR}${WW}=${VV}=12\\ \\mathrm{m/s}`,PC,420,40)),1,CX);
  return s+LEGV()+goalTag(G2);
 },
 // 11. 一番上：紫の矢印の先に桃を継ぎ足し、合成（黄）24 m/s
 [K+'top']:(p)=>{
  const R=120,gy=430,cx=300,cy=gy-R,L=110,gT=seg(p,.15,.3),gS=seg(p,.4,.55);
  let s=ground(60,640,gy)+wheel(cx,cy,R,0)+pts3(cx,cy,R);
  s+=hArr(cx,cy-R,L,CV)+fade(gT,hArr(cx+L,cy-R,L,CW));
  s+=label('v',cx+L/2,cy-R-16,{size:28,color:CV,anchor:'middle',weight:700})+fade(gT,label('Rω',cx+1.5*L,cy-R-16,{size:28,color:CW,anchor:'middle',weight:700}));
  s+=fade(gS,hArr(cx,cy-R-56,2*L,C.hi)+label('24 m/s',cx+2*L+14,cy-R-48,{size:30,color:C.hi,weight:700}));
  s+=panel(86,300,label('一番上',PC,135,{size:28,color:C.dim,anchor:'middle'})+fade(gT,T(`${VV}+${RR}${WW}=2${VV}`,PC,215,44))
   +fade(gS,T(`=2\\times12=${col(C.hi,'24\\ \\mathrm{m/s}')}`,PC,300,40)),1,C.hi);
  return s+LEGV()+goalTag(G2);
 },
 // 12. 接地点：紫（前）と桃（後ろ）が打ち消し、合成 0。「止まっている」。答えの札（2文目）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,R=120,gy=430,cx=300,cy=gy-R,L=110,sh=seg(p,.3,.5);
  let s=ground(60,640,gy)+wheel(cx,cy,R,0)+pts3(cx,cy,R);
  s+=hArr(cx,cy-R,L,CV)+hArr(cx+L,cy-R,L,CW)+hArr(cx,cy-R-56,2*L,C.hi)+label('24 m/s',cx+2*L+14,cy-R-48,{size:28,color:C.hi,weight:700});
  s+=fade(1-sh,hArr(cx,cy+R-14,L,CV)+hArr(cx,cy+R+14,-L,CW));
  s+=fade(sh,hArr(cx,cy+R-14,L*(1-sh),CV,{opacity:1-sh})+ring(cx,cy+R,18,{color:C.hi,w:4})+label('止まっている（0）',cx+30,cy+R+48,{size:26,color:C.hi,weight:700}));
  s+=panel(86,300,label('接地点',PC,135,{size:28,color:C.dim,anchor:'middle'})+T(`${VV}-${RR}${WW}=12-12`,PC,215,44)
   +fade(seg(p,.25,.35),T(`=${col(C.hi,'0')}`,PC,300,44)),1,C.hi);
  return s+LEGV()+goalTag(G2)+ANS2(seg(p,b,b+.06));
 },
 // 13. 誤答 A → B → D を一枚ずつ（右）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],w=[[0,e0*.45],[e0*.45,e0],[W[1]?W[1][0]:e0,1]],R=120,gy=430,cx=300,cy=gy-R,L=110;
  let s=ground(60,640,gy)+wheel(cx,cy,R,0)+pts3(cx,cy,R)+hArr(cx,cy-R-10,2*L,C.hi)+label('24 m/s',cx+2*L+14,cy-R-2,{size:28,color:C.hi,weight:700})
   +ring(cx,cy+R,18,{color:C.hi,w:4})+label('0',cx+30,cy+R+40,{size:28,color:C.hi,weight:700});
  s+=wrongSeq(p,ctx,[['A','12 と 12','並進だけ'],['B','0 と 12','上で 回転を 足し忘れた'],['D','12（後ろ）と 12（前）','回転だけ（中心から 見た 速度）']],{win:w,opts:{x:PX-20,w:PW+20,y:200,size:26,whySize:24}});
  return s+LEGV()+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 14. 車輪とカードを消し、出題中の小問3の図（坂の上の円板）。凡例「並進 橙・回転 桃」
 [K+'goal3']:(p)=>slope()+diskAt(0,{lab:1})+LEGE(seg(p,.1,.25))+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 円板を転がし下らせる。棒を並進（橙）と回転（桃）の2色に。式の各項を棒の色に
 [K+'energy']:(p)=>{
  const u=seg(p,.05,.6);
  let s=slope()+diskAt(u)+ebar({pot:1-u,tr:u*2/3,ro:u/3});
  s+=card(PX,86,PW,130,T(`Mgh=${col(CE,'\\tfrac{1}{2}Mv^2')}+${col(CRot,'\\tfrac{1}{2}I\\omega^2')}`,PC,140,38)
   +fade(seg(p,.3,.4),label('並進',PC+10,195,{size:24,color:CE,anchor:'middle',weight:700})+label('回転',PC+150,195,{size:24,color:CRot,anchor:'middle',weight:700})),seg(p,.03,.12));
  s+=fade(seg(p,.6,.7),label('並進',BX-BW/2-10,BY-BH/3,{size:24,color:CE,anchor:'end',weight:700})+label('回転',BX-BW/2-10,BY-BH*5/6+8,{size:24,color:CRot,anchor:'end',weight:700}));
  return s+LEGE()+goalTag(G3);
 },
 // 16. 式変形を一行ずつ（図を消して式が主役）
 [K+'solve']:(p)=>{
  const g=[seg(p,0,.08),seg(p,.15,.25),seg(p,.35,.45),seg(p,.55,.65),seg(p,.72,.82)];
  let s=card(60,86,1080,424,'',1);
  s+=fade(g[0],T(`Mgh=\\tfrac{1}{2}Mv^2+\\tfrac{1}{2}I${col(CW,'\\omega')}^2`,680,128,34));
  s+=fade(g[1],label('ω ＝ v/R を 入れる',90,215,{size:24,color:CW})+T(`\\tfrac{1}{2}I${col(CW,'\\omega')}^2=\\tfrac{1}{2}\\dfrac{I}{R^2}v^2`,680,208,34));
  s+=fade(g[2],label('½Mv² で くくる',90,305,{size:24,color:C.dim})+T(`Mgh=\\tfrac{1}{2}Mv^2\\left(1+\\dfrac{I}{MR^2}\\right)`,680,298,34));
  s+=fade(g[3],label('M が 消える',90,442,{size:24,color:C.dim})+T(`v^2=\\dfrac{2gh}{1+\\dfrac{I}{MR^2}}`,680,442,36));
  s+=fade(g[4],highlight(540,374,280,132,1,C.hi));
  return s+goalTag(G3);
 },
 // 17. I/(MR²)＝½ → 分母 1.5（黄）。2gh＝9、9÷1.5＝6、√6≈2.45。坂の下の円板に速度の矢印。答えの札（2文目）
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7,[dx,dy]=diskC(1);
  let s=slope()+diskAt(1);
  s+=fade(seg(p,b-.1,b-.03),arrow(dx+DR+4,dy,dx+DR+70,dy,{color:CV,w:7,head:18})+label('約 2.45 m/s',dx,dy-DR-16,{size:26,color:CV,anchor:'middle',weight:700}));
  s+=panel(86,420,T(`v^2=\\dfrac{2gh}{1+${col(C.hi,'\\tfrac{1}{2}')}}=\\dfrac{2gh}{${col(C.hi,'1.5')}}`,PC,150,38)
   +fade(seg(p,.15,.25),T(`2gh=2\\times10\\times0.45=9`,PC,245,34))
   +fade(seg(p,.3,.4),T(`v^2=9\\div1.5=6`,PC,315,36))
   +fade(seg(p,.45,.55),T(`v=\\sqrt{6}\\approx${col(CV,'2.45\\ \\mathrm{m/s}')}`,PC,395,38)),1,C.hi);
  return s+LEGE()+goalTag(G3)+ANS3(seg(p,b,b+.06));
 },
 // 18. 箱・円板・輪の競走（箱が先、円板、輪）。誤答 A → C → D を一枚ずつ（右）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],w=[[0,e0*.5],[e0*.5,e0],[W[1]?W[1][0]:e0,1]],tau=1.5*seg(p,.03,.6);
  let s=race(tau)+note('着く 時刻だけを 比べる 図',350,495,{g:seg(p,.05,.15)});
  s+=wrongSeq(p,ctx,[['A','3.0 m/s',['回転の 分を 入れていない','（滑る 箱の 値）']],['C','約 2.12 m/s','輪の 値（分母 2）'],['D','約 4.24 m/s','分母 1−½（引いた）']],{win:w,opts:{x:PX-20,w:PW+20,y:180,size:26,whySize:24}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 19. はずみ車の Iα＝N、車輪の矢印の足し算、坂の v²＝…を並べ、ma＝F との対応の色をそろえる。答えの札3枚
 [K+'sum']:(p)=>{
  const gs=[seg(p,.02,.12),seg(p,.12,.22),seg(p,.22,.32)],y0=96,h=300,w=370,xs=[20,415,810];
  let s='';
  s+=card(xs[0],y0,w,h,flywheel(.4,{cx:xs[0]+110,cy:y0+150,R:85})+arrow(xs[0]+110,y0+150-70,xs[0]+190,y0+150-70,{color:CF,w:5,head:14})
   +T(`I\\,${AL}=${NN}`,xs[0]+290,y0+120,32)+label('α ＝ 4.0 rad/s²',xs[0]+w/2,y0+h-30,{size:26,color:CA,anchor:'middle',weight:700}),gs[0]);
  const cx=xs[1]+120,cy=y0+150,R=70;
  s+=card(xs[1],y0,w,h,wheel(cx,cy,R,0)+pts3(cx,cy,R)+hArr(cx,cy-R,140,C.hi,{w:5,head:14})+label('24 m/s',cx+150,cy-R+8,{size:24,color:C.hi,weight:700})
   +label('0',cx-40,cy+R+8,{size:26,color:C.hi,weight:700})+label('接地点 0・一番上 24 m/s',xs[1]+w/2,y0+h-30,{size:24,color:C.ink,anchor:'middle',weight:700}),gs[1]);
  s+=card(xs[2],y0,w,h,T(`v^2=\\dfrac{2gh}{1+\\dfrac{I}{MR^2}}`,xs[2]+w/2,y0+120,32)+label('円板：約 2.45 m/s',xs[2]+w/2,y0+h-30,{size:26,color:CV,anchor:'middle',weight:700})
   +label('並進 ＋ 回転',xs[2]+w/2,y0+h-80,{size:24,color:C.dim,anchor:'middle'}),gs[2]);
  const gm=seg(p,.4,.5);
  s+=fade(gm,rect(240,y0+h+18,720,70,{fill:CARDBG,fo:.96,stroke:CN,sw:2,rx:12})+T(`m\\,${AA}=${FF}`,400,y0+h+55,34)+label('↔',600,y0+h+64,{size:34,color:C.ink,anchor:'middle',weight:700})+T(`I\\,${AL}=${NN}`,800,y0+h+55,34));
  s+=answerRow([[1,'B','4.0 rad/s²'],[2,'C',''],[3,'B','約 2.45 m/s']],{g:seg(p,.8,.9)});
  return s;
 },
};
