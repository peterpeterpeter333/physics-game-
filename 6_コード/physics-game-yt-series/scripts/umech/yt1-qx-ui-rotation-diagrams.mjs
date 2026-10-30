// 問題編 解説「半径 0.3 m の車輪」（q-ui-rotation、大学編 18 剛体の回転・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/18_剛体の回転.md の q-ui-rotation（解説 18 行）。
// 配置：左に車輪・坂、右に説明の枠。札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：R・弧 s 水色、角 θ 橙、v 紫、ω 桃、エネルギー 並進 橙・回転 桃（凡例を出す）、強調 黄、誤り 赤。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly,ground} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,legend,note,sentWin,cueT,tAt,textW} from './yt1-qx-common.mjs';

const K='qx-ui-rotation:';
const CR=C.x,CTH=C.E,CV=C.v,CW=C.p,CD='#ff6b6b',CE=C.E,CRot=C.p;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const col=(c,s)=>`{\\color{${c}}{${s}}}`;
const RR=col(CR,'R'),TH=col(CTH,'\\theta'),SS=col(CR,'s'),VV=col(CV,'v'),WW=col(CW,'\\omega');
const TAU=2*Math.PI,CARDBG='#131f38';
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const G1='中心の速さ v',G2='10 回転で進む距離',G3='坂の下での箱と缶の速さ';
const ANS1=g=>answerTag(1,'C','3.0 m/s',{g}),ANS2=g=>answerTag(2,'D','約 18.8 m',{g}),ANS3=g=>answerTag(3,'A','',{g});
const LEG=(g=1)=>legend([['並進',CE],['回転',CRot]],24,500,{g,dir:'row'});

// ---- 車輪 ----
// rot：画面の角（時計回りが＋。右へ転がると rot＝θ）。mark：黄の印の初めの角（null なら無し）。paint：縁を水色に塗る
function wheel(cx,cy,R,rot,{g=1,paint=0,mark=null,spokes=6,rim=C.dim}={}){
 let s=ring(cx,cy,R,{color:rim,w:6,fill:'#141d33'});
 for(let k=0;k<spokes;k++){const a=rot+TAU*k/spokes;s+=line(cx,cy,cx+R*.9*Math.cos(a),cy+R*.9*Math.sin(a),{color:C.faint,w:3});}
 if(paint)s+=fade(paint,ring(cx,cy,R,{color:CR,w:7}));
 s+=dot(cx,cy,7,C.dim);
 if(mark!==null){const a=mark+rot;s+=dot(cx+R*Math.cos(a),cy+R*Math.sin(a),10,C.hi);}
 return fade(g,s);
}
const arcPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
function headAt(pts,color,H=16){const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1);
 return poly([[x2,y2],[x2-H*Math.cos(a)+H*.5*Math.sin(a),y2-H*Math.sin(a)-H*.5*Math.cos(a)],[x2-H*Math.cos(a)-H*.5*Math.sin(a),y2-H*Math.sin(a)+H*.5*Math.cos(a)]],{fill:color,fo:1});}
// 回る向きの弧の矢印（a0→a1、画面の角）
function turnArc(cx,cy,r,a0,a1,{color=CW,w=5,g=1}={}){const pts=arcPts(cx,cy,r,a0,a1,30);return fade(g,draw(pts.slice(0,-2),1,{color,w})+headAt(pts,color));}
// 半径の寸法（水色の線と札）
function radiusDim(cx,cy,R,{a=-Math.PI/4,txt='0.3 m',g=1,dx=14,dy=-6}={}){
 const x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);
 return fade(g,line(cx,cy,x,y,{color:CR,w:4})+label(txt,x+10,y+4,{size:28,color:CR,weight:700}));
}
// 出題の図（小問1・2）：地面の上で、その場で回る車輪
const QW={cx:420,cy:300,R:120,gy:420};
function qWheel(rot,{g=1,lab=1,turns=0}={}){
 const {cx,cy,R,gy}=QW;
 let s=ground(150,700,gy)+wheel(cx,cy,R,rot);
 s+=radiusDim(cx,cy,R,{g:lab});
 s+=fade(lab,turnArc(cx,cy,R+26,-2.5,-.75)+label('ω ＝ 10 rad/s',cx+R+20,cy-R-6,{size:30,color:CW,weight:700}));
 if(turns)s+=fade(turns,rect(800,200,260,80,{fill:C.hi,fo:.10,stroke:C.hi,sw:2.5,rx:14})+label('10 回転',930,252,{size:36,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}

// ---- 坂（同じ坂を2本並べて描く。上が箱、下が缶）----
const LN=[{x1:150,x2:600,yT:140,yB:250},{x1:150,x2:600,yT:330,yB:440}];
function ramp(i,{hLab=1}={}){const {x1,x2,yT,yB}=LN[i];
 let s=poly([[x1,yT],[x2,yB],[x1,yB]],{fill:'#26324d',fo:.8,stroke:C.dim,sw:2})+line(x2,yB,x2+130,yB,{color:C.dim,w:3});
 if(hLab)s+=line(x1-22,yT,x1-22,yB,{color:CR,w:3})+line(x1-30,yT,x1-14,yT,{color:CR,w:3})+line(x1-30,yB,x1-14,yB,{color:CR,w:3})
  +label('1.25 m',x1-30,(yT+yB)/2+8,{size:22,color:CR,anchor:'end',weight:700});
 return s;}
const rampGeom=i=>{const {x1,x2,yT,yB}=LN[i],L=Math.hypot(x2-x1,yB-yT);return {ux:(x2-x1)/L,uy:(yB-yT)/L,nx:(yB-yT)/L,ny:-(x2-x1)/L,L};};
// u：坂に沿った位置（0＝上、1＝下）。u＞1 は坂の下の平らな所（px 単位で u−1 に L を掛けた所）
function surf(i,u){const {x1,x2,yT,yB}=LN[i],{L}=rampGeom(i);if(u<=1)return [mix(x1,x2,u),mix(yT,yB,u),Math.atan2(yB-yT,x2-x1)];return [x2+(u-1)*L,yB,0];}
const BOX=56,CAN=28;
function boxAt(u){const [x,y,a]=surf(0,u),c=Math.cos(a),s=Math.sin(a),h=BOX/2,cx=x+h*s,cy=y-h*c,deg=a*180/Math.PI;
 return `<g transform="rotate(${deg.toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})">`+rect(cx-h,cy-h,BOX,BOX,{fill:'#c58a4a',fo:.55,stroke:'#e0a866',sw:2.5,rx:5})+'</g>'
  +label('2 kg',cx,cy+8,{size:22,color:C.ink,anchor:'middle',weight:700});}
const boxC=u=>{const [x,y,a]=surf(0,u);return [x+BOX/2*Math.sin(a),y-BOX/2*Math.cos(a)];};
function canAt(u){const [x,y,a]=surf(1,u),cx=x+CAN*Math.sin(a),cy=y-CAN*Math.cos(a),{L}=rampGeom(1),rot=u*L/CAN;
 return wheel(cx,cy,CAN,rot,{spokes:4,rim:'#c9d2e0'});}
const canC=u=>{const [x,y,a]=surf(1,u);return [x+CAN*Math.sin(a),y-CAN*Math.cos(a)];};
// エネルギーの棒：pot＝位置エネルギーの残り、tr＝進む分、ro＝回る分（どれも 25 J に対する割合）
const BH=190,BW=70,BY=465;
function ebar(x,name,{pot=1,tr=0,ro=0,g=1,val=1}={}){
 let s=rect(x-BW/2,BY-BH,BW,BH,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:4});
 if(pot>.002)s+=rect(x-BW/2+4,BY-pot*BH,BW-8,pot*BH-2,{fill:CE,fo:.12,stroke:CE,sw:2,rx:3}).replace('/>',' stroke-dasharray="7 6"/>');
 if(tr>.002)s+=rect(x-BW/2+4,BY-tr*BH,BW-8,tr*BH-2,{fill:CE,fo:.85,stroke:'none',rx:3});
 if(ro>.002)s+=rect(x-BW/2+4,BY-(tr+ro)*BH,BW-8,ro*BH,{fill:CRot,fo:.85,stroke:'none',rx:3});
 s+=label(name,x,BY+34,{size:26,color:C.ink,anchor:'middle',weight:700});
 if(val)s+=fade(val,label('25 J',x,BY-BH-12,{size:24,color:C.dim,anchor:'middle',weight:700}));
 return fade(g,s);
}
const BX0=900,BX1=1100,SPX=760,SPW=420,SPC=SPX+SPW/2;
const CANTR=2/3; // 缶を一様な円柱として描く（図のために決めた値）
const RACE=Math.sqrt(1.5); // 缶が着くまでの時間は、箱の √1.5 倍（円柱として）
function slopeScene({ub=0,uc=0,boxLab=1,canLab=1}={}){
 let s=ramp(0)+ramp(1);
 s+=boxAt(ub)+canAt(uc);
 if(boxLab)s+=fade(boxLab,label('箱：滑る',390,126,{size:28,color:C.ink,weight:700}));
 if(canLab)s+=fade(canLab,label('缶：転がる',390,316,{size:28,color:C.ink,weight:700})+(uc>.001?'':label('2 kg',LN[1].x1+45,292,{size:22,color:C.ink,weight:700})));
 return s;
}
const vArrow=(x,y,len,txt)=>arrow(x,y,x+len,y,{color:CV,w:6,head:16})+(txt?label(txt,x+len/2,y-16,{size:24,color:CV,anchor:'middle',weight:700}):'');

// ---- 小問2：転がって、地面に塗った線 ----
const W2={x0:80,R:80,gy:330};
function rollScene(th,{g=1,paint=1,lab=0}={}){
 const {x0,R,gy}=W2,cx=x0+R*th,cy=gy-R;
 let s=ground(20,665,gy)+line(x0,gy,cx,gy,{color:CR,w:7});
 s+=wheel(cx,cy,R,th,{paint});
 s+=line(x0,gy-12,x0,gy+12,{color:CR,w:3});
 if(lab)s+=fade(lab,line(x0+TAU*R,gy-12,x0+TAU*R,gy+12,{color:CR,w:3})+label('1周分 ＝ 2πR',x0+TAU*R/2,gy+48,{size:28,color:CR,anchor:'middle',weight:700}));
 return fade(g,s);
}

export const ytQxUiRotationDiagrams={
 // ===================== 問題アニメ =====================
 // 小問1の図（約4秒）：地面の上の車輪。0〜3 s で、その場で回る（進ませない。速度の矢印・ペンキの跡は描かない）。静止。
 [K+'q1']:(p)=>qWheel(2.4*seg(p,.02,.75),{lab:seg(p,.05,.3)}),
 // 小問2の図：同じ図に「10 回転」の札
 [K+'q2']:(p)=>qWheel(2.4*seg(p,.02,.75),{lab:seg(p,.05,.3),turns:seg(p,.6,.85)}),
 // 小問3の図（約3秒）：高さ 1.25 m の坂の上に箱と缶。まだ動かさない
 [K+'q3']:(p)=>fade(seg(p,0,.3),slopeScene({boxLab:seg(p,.35,.6),canLab:seg(p,.45,.7)}))+note('同じ坂を 2本 並べて 描いています',900,300,{g:seg(p,.6,.85)}),

 // ===================== 小問1 =====================
 // 1. 出題中の小問1の図。求めるもの
 [K+'goal1']:(p)=>qWheel(0)+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 縁を水色に塗って転がす。地面に線が伸びる。黄の印が地面に触れた所に、同じ印が残る
 [K+'paint']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,R=90,x0=140,gy=420,th=2.8*Math.PI*seg(p,.04,.92),cx=x0+R*th,cy=gy-R,mk=-Math.PI/2;
  let s=ground(40,1180,gy)+line(x0,gy,cx,gy,{color:CR,w:8});
  if(th>=Math.PI)s+=dot(x0+R*Math.PI,gy,10,C.hi);
  s+=wheel(cx,cy,R,th,{paint:1,mark:mk});
  s+=fade(seg(p,.02,.1),label('縁に 水色の ペンキ',x0+R+20,cy-R-10,{size:26,color:CR,weight:700}));
  s+=fade(seg(p,b,b+.08),label('地面の 線 ＝ 縁を まっすぐ 伸ばした もの',600,140,{size:30,color:CR,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 3. 少し転がす。回った角 θ（橙）と、縁の弧 s（水色）、地面の線と中心の進みが同じ長さ。右の枠に s＝Rθ
 [K+'arc']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,R=110,x0=200,gy=440,cy=gy-R,th=1.2*seg(p,.04,.3),cx=x0+R*th,u=seg(p,.3,.45);
  let s=ground(40,640,gy)+fade(.5,ring(x0,cy,R,{color:C.faint,w:2,dash:'6 7'}))+line(x0,gy,cx,gy,{color:CR,w:8});
  s+=wheel(cx,cy,R,th);
  if(th>.05){
   s+=fade(u,draw(arcPts(cx,cy,R,Math.PI/2,Math.PI/2+th),1,{color:CR,w:10}));
   s+=fade(u,line(cx,cy,cx,cy+R,{color:CTH,w:3})+line(cx,cy,cx+R*Math.cos(Math.PI/2+th),cy+R*Math.sin(Math.PI/2+th),{color:CTH,w:3})
    +draw(arcPts(cx,cy,40,Math.PI/2,Math.PI/2+th),1,{color:CTH,w:4})+T(TH,cx+62*Math.cos(Math.PI/2+th/2),cy+62*Math.sin(Math.PI/2+th/2)+8,30));
   const ma=Math.PI/2+th/2;s+=fade(u,label('s',cx+(R+26)*Math.cos(ma)-8,cy+(R+26)*Math.sin(ma)+8,{size:32,color:CR,weight:700}));
   const v2=seg(p,.45,.6);
   s+=fade(v2,arrow(x0,cy,cx,cy,{color:CR,w:5,head:14})+label('s',(x0+cx)/2,cy-14,{size:30,color:CR,anchor:'middle',weight:700})
    +label('s',(x0+cx)/2,gy+40,{size:30,color:CR,anchor:'middle',weight:700})+label('同じ 長さ',(x0+cx)/2+120,gy+40,{size:24,color:C.hi,weight:700}));
  }
  s+=panel(86,330,label('縁の 弧の 長さ ＝ 中心の 進み',PC,135,{size:26,color:C.dim,anchor:'middle'})+T(`${SS}=${RR}\\,${TH}`,PC,215,56)
   +fade(seg(p,b,b+.1),line(PX+40,265,PX+PW-40,265,{color:C.faint,w:2})+label('θ は ラジアン',PC,315,{size:28,color:CTH,anchor:'middle',weight:700})
    +label('角（rad）＝ 弧の 長さ ÷ 半径',PC,370,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.18),CR);
  return s+goalTag(G1);
 },
 // 4. s＝Rθ を時間で1回微分。ds/dt を v（紫）、dθ/dt を ω（桃）に置き換え、v＝Rω（黄の枠）
 [K+'diff']:(p,ctx)=>{
  const R=110,x0=200,gy=440,cy=gy-R,th=1.2,cx=x0+R*th;
  let s=fade(.6,ground(40,640,gy)+line(x0,gy,cx,gy,{color:CR,w:8})+wheel(cx,cy,R,th));
  s+=fade(seg(p,.05,.15),label('R は 一定',cx,cy-R-24,{size:28,color:CR,anchor:'middle',weight:700}));
  const e2=`\\dfrac{d${SS}}{dt}=${RR}\\,\\dfrac{d${TH}}{dt}`,w2=texWidth(e2,40,false),x2=PC-w2/2;
  const wA=texWidth(`\\dfrac{d${SS}}{dt}`,40,false),wB=texWidth(`\\dfrac{d${SS}}{dt}=${RR}\\,`,40,false);
  const r1=seg(p,.55,.63),r2=seg(p,.63,.71),fin=seg(p,.75,.85);
  s+=panel(86,420,T(`${SS}=${RR}\\,${TH}`,PC,140,44)
   +fade(seg(p,.15,.25),arrow(PC,170,PC,205,{color:C.dim,w:3,head:12})+label('時間で 1回 微分',PC+20,196,{size:24,color:C.dim}))
   +fade(seg(p,.25,.38),T(e2,PC,290,40))
   +fade(r1,highlight(x2-6,250,wA+12,82,1,CV)+label('v',x2+wA/2,365,{size:30,color:CV,anchor:'middle',weight:700}))
   +fade(r2,highlight(x2+wB-6,250,w2-wB+12,82,1,CW)+label('ω',x2+wB+(w2-wB)/2,365,{size:30,color:CW,anchor:'middle',weight:700}))
   +fade(fin,highlight(PC-110,392,220,90,1,C.hi)+T(`${VV}=${RR}\\,${WW}`,PC,439,50)),1,CR);
  return s+goalTag(G1);
 },
 // 5. R に 0.3、ω に 10 を入れて 3.0 m/s。中心に速度の矢印（紫）。札「rad は単位に残らない」。答えの札（2文目）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,R=110,x0=200,gy=440,cy=gy-R,th=1.2,cx=x0+R*th;
  let s=fade(.6,ground(40,640,gy)+wheel(cx,cy,R,th));
  const va=seg(p,b-.2,b-.08);
  s+=fade(va,arrow(cx,cy,cx+150,cy,{color:CV,w:7,head:18})+label('3.0 m/s',cx+162,cy+10,{size:28,color:CV,weight:700}));
  s+=panel(86,420,T(`${VV}=${RR}\\,${WW}`,PC,145,46)
   +fade(seg(p,.05,.16),T(`=${col(CR,'0.3')}\\times${WW}`,PC,235,42))
   +fade(seg(p,.16,.27),T(`=${col(CR,'0.3')}\\times${col(CW,'10')}`,PC,320,42))
   +fade(seg(p,.3,.42),T(`=${col(CV,'3.0\\ \\mathrm{m/s}')}`,PC,405,46))
   +fade(seg(p,.4,.5),label('rad は 単位に 残らない',PC,475,{size:24,color:C.dim,anchor:'middle'})),1,CR);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));
 },
 // 6. 誤答 A → B を一枚ずつ（1文目の前半 A、後半から B）
 [K+'wrongAB']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],w=[[0,e0*.5],[e0*.5,1]];
  let s=card(300,90,600,190,label('正しい 式',600,135,{size:24,color:C.dim,anchor:'middle'})+T(`${VV}=${RR}\\,${WW}=0.3\\times10=3.0\\ \\mathrm{m/s}`,600,210,38),1);
  s+=wrongSeq(p,ctx,[['A','0.03 m/s','0.3÷10（単位 m·s）'],['B','約 33 m/s','10÷0.3（単位 1/(m·s)）']],{win:w,opts:{y:320}});
  return s+goalTag(G1)+ANS1(1);
 },
 // 7. 誤答 D：2πR×ω。式の 2π と、ω の中の「1周＝2π rad」に赤の×
 [K+'wrongD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,x1=seg(p,b+.15,b+.25);
  const e='2\\pi\\,'+RR+'\\times'+WW,w=texWidth(e,48,false),xa=380-w/2,w2=texWidth('2\\pi',48,false);
  let s=card(80,90,600,200,label('D の 計算',380,135,{size:24,color:C.dim,anchor:'middle'})+T(e,380,215,48)
   +fade(x1,label('×',xa+w2/2,232,{size:64,color:CD,anchor:'middle',weight:700})),1);
  const t1='ω ＝ 1秒に 回る 角度',t2a='（1周 ＝ ',t2b='2π',t2c=' rad を 含む）',sz=26,tw=textW(t2a+t2b+t2c,sz),tx=950-tw/2;
  s+=card(720,90,460,200,label(t1,950,160,{size:sz,color:CW,anchor:'middle',weight:700})
   +label(t2a,tx,220,{size:sz,color:C.ink})+label(t2b,tx+textW(t2a,sz),220,{size:sz,color:C.hi,weight:700})+label(t2c,tx+textW(t2a+t2b,sz),220,{size:sz,color:C.ink})
   +fade(x1,label('×',tx+textW(t2a,sz)+textW(t2b,sz)/2,232,{size:56,color:CD,anchor:'middle',weight:700})),seg(p,b,b+.08));
  s+=wrongCard('D','約 19 m/s','2πR×ω（2π を 二重に 数えた）',{y:330,g:seg(p,.02,.08)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 8. カードを消す。出題中の小問2の図（その場で回る車輪＋10 回転）
 [K+'goal2']:(p)=>qWheel(0,{turns:1})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 9. 1回転転がして、地面に1周分の線。右の枠で θ に 2π を入れる
 [K+'turn1']:(p,ctx)=>{
  const th=TAU*seg(p,.05,.5);
  let s=rollScene(th,{lab:seg(p,.5,.6)});
  s+=panel(86,420,T(`${SS}=${RR}\\,${TH}`,PC,140,44)
   +fade(seg(p,.05,.15),label('1回転：θ ＝ 2π',PC,205,{size:28,color:CTH,anchor:'middle',weight:700}))
   +fade(seg(p,.2,.32),T(`${SS}=0.3\\times${col(CTH,'2\\pi')}`,PC,275,42))
   +fade(seg(p,.35,.47),T(`=0.6\\pi\\ \\mathrm{m}`,PC,350,42))
   +fade(seg(p,.55,.67),T(`\\approx${col(CR,'1.88\\ \\mathrm{m}')}`,PC,430,46)),1,CR);
  s+=fade(seg(p,.6,.7),label('2πR ＝ 0.6π ≈ 1.88 m',W2.x0+TAU*W2.R/2,W2.gy+92,{size:28,color:CR,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 10. 1周分の線を10本つなぐ（早送り・縮めて描く）。全体で約 18.8 m。答えの札（2文目）
 [K+'turn10']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,x0=100,seg1=100,gy=330,r=seg1/TAU,n=10*seg(p,.05,b-.05),cx=x0+seg1*n;
  let s=ground(60,1160,gy);
  for(let i=0;i<10;i++){const a=x0+seg1*i,e=Math.min(a+seg1,cx);if(e>a)s+=line(a,gy,e,gy,{color:i%2?'#3fb4d8':CR,w:9});
   if(cx>=a+seg1-1)s+=line(a+seg1,gy-10,a+seg1,gy+10,{color:C.ink,w:2})+label(String(i+1),a+seg1/2,gy+40,{size:22,color:C.dim,anchor:'middle'});}
  s+=line(x0,gy-10,x0,gy+10,{color:C.ink,w:2});
  s+=wheel(cx,gy-r,r,n*TAU,{spokes:4});
  s+=label('回転',x0+seg1*10+10,gy+40,{size:22,color:C.dim});
  s+=note('縮めて 描いています（早送り）',600,470,{g:seg(p,.05,.15)});
  s+=fade(seg(p,.05,.15),T(`10\\times0.6\\pi=6\\pi\\ \\mathrm{m}`,600,150,40));
  const gt=seg(p,b-.12,b-.02);
  s+=fade(gt,line(x0,gy-50,x0+seg1*10,gy-50,{color:CR,w:3})+line(x0,gy-62,x0,gy-38,{color:CR,w:3})+line(x0+seg1*10,gy-62,x0+seg1*10,gy-38,{color:CR,w:3})
   +rect(600-110,gy-82,220,50,{fill:C.bg,fo:1,stroke:'none',rx:6})+label('約 18.8 m',600,gy-46,{size:34,color:CR,anchor:'middle',weight:700}));
  return s+goalTag(G2)+ANS2(seg(p,b,b+.06));
 },
 // 11. 1周分の線の下に、R・πR・2R の灰色の線。誤答 A → B → C を一枚ずつ（右）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],w=[[0,e0*.33],[e0*.33,e0*.66],[e0*.66,1]],{x0,R,gy}=W2;
  const on=i=>seg(p,w[i][0]+.01,w[i][0]+.05)*(i===2?1:1-seg(p,w[i][1]-.04,w[i][1]));
  let s=ground(20,665,gy-140)+line(x0,gy-140,x0+TAU*R,gy-140,{color:CR,w:8})+label('1周 ＝ 2πR',x0+TAU*R/2,gy-160,{size:28,color:CR,anchor:'middle',weight:700});
  s+=line(x0,gy-152,x0,gy-128,{color:CR,w:3})+line(x0+TAU*R,gy-152,x0+TAU*R,gy-128,{color:CR,w:3});
  const rows=[['R',R],['πR',Math.PI*R],['2R',2*R]];
  rows.forEach(([t,L],i)=>{const y=gy-70+i*60,hi=on(i);
   s+=line(x0,y,x0+L,y,{color:hi>.5?C.ink:C.dim,w:6+3*hi})+label(t,x0+L+16,y+9,{size:28,color:hi>.5?C.ink:C.dim,weight:700});});
  s+=fade(seg(p,e0,e0+.06),label('円周は 2πR',x0+TAU*R/2,gy+140,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['A','3 m','1回転で R'],['B','約 9.4 m','1回転で πR（2 を 落とした）'],['C','6 m','1回転で 2R（π を 落とした）']],{win:w,opts:{x:PX,w:PW,y:150,size:26,whySize:24}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 12. 車輪を消し、出題中の小問3の図（坂の上の箱と缶）。凡例
 [K+'goal3']:(p)=>slopeScene()+note('同じ坂を 2本 並べて 描いています',900,300,{g:seg(p,.1,.25)})+LEG(seg(p,.1,.25))+goalTag(G3,{g:seg(p,.03,.15)}),
 // 13. エネルギーの棒（初めは位置エネルギー、橙の点線）。2・10・1.25 を一つずつ入れて 25 J
 [K+'pe']:(p)=>{
  let s=slopeScene()+LEG();
  s+=ebar(BX0,'箱',{g:seg(p,.03,.15),val:seg(p,.75,.85)})+ebar(BX1,'缶',{g:seg(p,.03,.15),val:seg(p,.75,.85)});
  s+=fade(seg(p,.05,.15),label('位置エネルギー',(BX0+BX1)/2,BY-BH-50,{size:24,color:CE,anchor:'middle',weight:700}));
  const full='mgh=2\\times10\\times1.25=25\\ \\mathrm{J}',wf=texWidth(full,32,false);
  const eq='mgh'+(seg(p,.15,.2)>0?'=2':'')+(seg(p,.25,.3)>0?'\\times10':'')+(seg(p,.35,.4)>0?'\\times1.25':'')+(seg(p,.5,.55)>0?`={\\color{${CE}}25\\ \\mathrm{J}}`:'');
  s+=card(SPX,86,SPW,110,T(eq,SPC-wf/2,142,32,{anchor:'start'}),1);
  return s+goalTag(G3);
 },
 // 14a. 箱を滑らせる。箱の棒は全部「進む分」（橙）に。途中は速度の数値を出さない
 [K+'box']:(p)=>{
  const u=seg(p,.08,.7)**1;
  let s=slopeScene({ub:u})+LEG();
  s+=ebar(BX0,'箱',{pot:1-u,tr:u})+ebar(BX1,'缶');
  s+=card(SPX,86,SPW,110,label('箱は 回らない',SPC,128,{size:26,color:C.dim,anchor:'middle'})+label('25 J が 全部 進む分',SPC,175,{size:30,color:CE,anchor:'middle',weight:700}),seg(p,.05,.15));
  s+=fade(seg(p,.75,.85),label('進む分',BX0-BW/2-10,BY-BH/2,{size:24,color:CE,anchor:'end',weight:700}));
  return s+goalTag(G3);
 },
 // 14b. ½×2×v²＝25 → v²＝25 → v＝5。坂の下に着いた箱にだけ速度の矢印
 [K+'box2']:(p)=>{
  let s=slopeScene({ub:1})+LEG();
  s+=ebar(BX0,'箱',{pot:0,tr:1})+ebar(BX1,'缶');
  s+=label('進む分',BX0-BW/2-10,BY-BH/2,{size:24,color:CE,anchor:'end',weight:700});
  s+=card(SPX,86,SPW,150,T(`\\tfrac{1}{2}\\times2\\times${VV}^2=25`,SPC,135,34)
   +fade(seg(p,.25,.4),T(`${VV}^2=25`,SPX+110,200,32))+fade(seg(p,.45,.6),T(`\\to\\ ${VV}=5\\ \\mathrm{m/s}`,SPX+290,200,32)),1);
  const [bx,by]=boxC(1);
  s+=fade(seg(p,.6,.72),vArrow(bx+BOX/2+6,by,100,'5 m/s'));
  return s+goalTag(G3);
 },
 // 15. 缶を転がす。缶の棒を2色に分ける：進む分（橙）と回る分（桃）。合計 25 J のまま
 [K+'can']:(p,ctx)=>{
  const u=seg(p,.06,.7);const [bx,by]=boxC(1);
  let s=slopeScene({ub:1,uc:u})+LEG();
  s+=vArrow(bx+BOX/2+6,by,100,'5 m/s');
  s+=ebar(BX0,'箱',{pot:0,tr:1})+ebar(BX1,'缶',{pot:1-u,tr:CANTR*u,ro:(1-CANTR)*u});
  s+=card(SPX,86,SPW,110,label('缶は 進みながら 回る',SPC,128,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.45),label('進む分',SPC-80,175,{size:30,color:CE,anchor:'middle',weight:700})+label('＋',SPC,175,{size:30,color:C.ink,anchor:'middle'})+label('回る分',SPC+80,175,{size:30,color:CRot,anchor:'middle',weight:700})),seg(p,.03,.12));
  s+=fade(seg(p,.72,.82),label('回る分',BX1-BW/2-10,BY-BH*(CANTR+(1-CANTR)/2)+8,{size:24,color:CRot,anchor:'end',weight:700})+label('進む分',BX1-BW/2-10,BY-BH*CANTR/2+8,{size:24,color:CE,anchor:'end',weight:700}));
  return s+goalTag(G3);
 },
 // 16. 箱と缶を同時に下らせる。箱が先に着く。缶の矢印は短く「5 m/s より遅い」。答えの札（2文目）
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,tau=seg(p,.03,.03+.42*RACE)*RACE,ub=Math.min(1,tau**2),uc=Math.min(1,(tau/RACE)**2);
  let s=slopeScene({ub,uc})+LEG();
  s+=ebar(BX0,'箱',{pot:1-ub,tr:ub})+ebar(BX1,'缶',{pot:1-uc,tr:CANTR*uc,ro:(1-CANTR)*uc});
  const [bx,by]=boxC(1),[cx,cy]=canC(1);
  if(ub>=1)s+=vArrow(bx+BOX/2+6,by,100,'5 m/s');
  if(uc>=1)s+=fade(seg(p,.5,.56),arrow(cx+CAN+6,cy,cx+CAN+6+82,cy,{color:CV,w:6,head:16})+label('5 m/s より 遅い',cx+CAN+10,cy-24,{size:24,color:CV,weight:700}));
  return s+goalTag(G3)+ANS3(seg(p,b,b+.06));
 },
 // 17. 誤答 B → C → D を一枚ずつ（右）。棒は消す
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],w=[[0,e0*.5],[e0*.5,e0],[e0,1]];
  const [bx,by]=boxC(1),[cx,cy]=canC(1);
  let s=slopeScene({ub:1,uc:1})+LEG()+vArrow(bx+BOX/2+6,by,100,'5 m/s')+arrow(cx+CAN+6,cy,cx+CAN+88,cy,{color:CV,w:6,head:16});
  s+=wrongSeq(p,ctx,[['B','どちらも 5 m/s','回る分の エネルギーを 忘れた'],['C','缶の 方が 速い','回るのにも エネルギーが 要る'],['D','どちらも 約 3.5 m/s','½ を 落とした（v² ＝ 12.5）']],{win:w,opts:{x:740,w:440,y:270,size:24,whySize:22}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 18. 左：ほどいた円周と v＝Rω＝3.0 m/s・10 回転で約 18.8 m。右：坂の箱 5 m/s と缶の2色の棒。矢印でつなぐ。答えの札3枚
 [K+'sum']:(p)=>{
  const gA=seg(p,.02,.12),gB=seg(p,.12,.22),gC=seg(p,.3,.4);
  let a='';const R=40,x0=60,gy=310;
  a+=ground(40,560,gy)+line(x0,gy,x0+TAU*R,gy,{color:CR,w:7})+wheel(x0+TAU*R,gy-R,R,TAU)+label('1周 ＝ 2πR',x0+TAU*R/2,gy+38,{size:24,color:CR,anchor:'middle',weight:700});
  a+=arrow(x0+TAU*R,gy-R,x0+TAU*R+80,gy-R,{color:CV,w:6,head:14});
  a+=T(`${VV}=${RR}\\,${WW}=3.0\\ \\mathrm{m/s}`,300,170,34)+label('10 回転で 約 18.8 m',300,400,{size:28,color:CR,anchor:'middle',weight:700});
  let s=card(20,96,560,330,a,gA);
  let b='';const rx1=640,rx2=900,ry1=190,ry2=330;
  b+=poly([[rx1,ry1],[rx2,ry2],[rx1,ry2]],{fill:'#26324d',fo:.8,stroke:C.dim,sw:2})+line(rx2,ry2,rx2+60,ry2,{color:C.dim,w:3});
  b+=rect(rx2,ry2-36,36,36,{fill:'#c58a4a',fo:.55,stroke:'#e0a866',sw:2,rx:4})+label('箱 5 m/s',rx2+18,ry2+36,{size:24,color:CV,anchor:'middle',weight:700});
  const bx=1110,bh=150,by=330;
  b+=rect(bx-30,by-bh,60,bh,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:4})+rect(bx-26,by-bh*CANTR,52,bh*CANTR-2,{fill:CE,fo:.85,stroke:'none',rx:3})+rect(bx-26,by-bh,52,bh*(1-CANTR),{fill:CRot,fo:.85,stroke:'none',rx:3});
  b+=label('缶',bx,by+34,{size:24,color:C.ink,anchor:'middle',weight:700})+label('進む分＋回る分',1030,by+72,{size:22,color:C.dim,anchor:'middle'});
  s+=card(600,96,580,330,b,gB);
  s+=fade(gC,draw([[450,150],[bx,150]],1,{color:C.hi,w:4})+arrow(bx,150,bx,by-bh-6,{color:C.hi,w:4,head:14})
   +rect(700,112,200,32,{fill:CARDBG,fo:1,stroke:'none',rx:6})+label('滑らずに 転がる',800,136,{size:22,color:C.hi,anchor:'middle',weight:700}));
  s+=LEG(gB);
  s+=answerRow([[1,'C','3.0 m/s'],[2,'D','約 18.8 m'],[3,'A','']],{g:seg(p,.8,.9)});
  return s;
 },
};
