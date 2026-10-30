// 問題編 解説「月の上の振り子時計」（q-um-pendulum、大学編 16 単振動・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/16_単振動.md の q-um-pendulum（解説 25 行）。
// 画面の配置（正本どおり）：左に振り子・グラフ・時計、右に説明の枠（紺の塗り・角の丸い枠）。誤答カードは右の枠の下。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：θ 橙、糸の長さ l・弧 s 水色、力（mg と成分）緑、糸の力 S 深緑、加速度 赤、速度 紫、ω 桃、周期 T 金、強調 黄、誤り・差 赤。
// 振り子の描き方は 単振動・中級（yt1-um-pendulum-1-diagrams.mjs）のヘルパーを写して使う（あちらは編集しない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-um-pendulum:';
const CTH=C.E,CL=C.x,CW=C.p,CT=C.t,CR='#4f9f80',CD='#ff6b6b';
const TH=`{\\color{${CTH}}\\theta}`,LL=`{\\color{${CL}}l}`,WW=`{\\color{${CW}}\\omega}`,TT=`{\\color{${CT}}T}`;
const DDT=`\\dfrac{d^2${TH}}{dt^2}`;
const SIN=`\\sin${TH}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const TAU=2*Math.PI,TH30=Math.PI/6;
// 右の説明の枠と、その下の誤答カード
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='円弧に沿う向きの運動方程式',G2='月面での周期 T',G3='振幅 30° での周期の変わり方';
const ANS1=g=>answerTag(1,'C',{tex:`ml\\,d^2\\theta/dt^2=-mg\\sin\\theta`},{g});
const ANS2=g=>answerTag(2,'B','約 7.70 s',{g}),ANS3=g=>answerTag(3,'A','長くなる',{g});

// ---- pendulum (copied from yt1-um-pendulum-1-diagrams.mjs, with a label for S and a colour for the tangent part) ----
function pend(th,{cx=300,py=100,Lp=230,g=1,R=24,path=1,vert=1,grav=0,split=0,tens=0,tanHi=1,radHi=1,G=160,mtext='m',ceil=1,thMax=.62,
  lLab=0,thPivot=0,plusDir=0,tanLab='',radLab='',arcHi=0,tanColor=C.F,tri=0,tLab='糸の力 S',bobColor=C.x,bobFill='#123049',strColor=C.ink,radLabHi=0}={}){
 const sn=Math.sin(th),cs=Math.cos(th),bx=cx+Lp*sn,by=py+Lp*cs;
 let s='';
 if(ceil){s+=line(cx-90,py,cx+90,py,{color:C.dim,w:4});for(let q=cx-86;q<cx+90;q+=20)s+=line(q,py,q+12,py-14,{color:C.faint,w:2});}
 if(vert)s+=fade(vert,line(cx,py,cx,py+Lp+40,{color:C.faint,w:2,dash:'7 7'}));
 if(path)s+=fade(path,draw(Array.from({length:41},(_,i)=>{const a=-thMax+2*thMax*i/40;return [cx+Lp*Math.sin(a),py+Lp*Math.cos(a)];}),1,{color:C.faint,w:2,dash:'5 8'}));
 if(arcHi&&Math.abs(th)>.02){
  const n=30,pts=Array.from({length:n+1},(_,i)=>{const a=th*i/n;return [cx+Lp*Math.sin(a),py+Lp*Math.cos(a)];});
  s+=fade(arcHi,draw(pts,1,{color:CL,w:7}));
 }
 s+=line(cx,py,bx,by,{color:lLab?CL:strColor,w:3})+dot(cx,py,7,C.dim);
 if(lLab)s+=fade(lLab,T(LL,cx+Lp*.62*sn+22,py+Lp*.62*cs-4,34));
 if(thPivot&&Math.abs(th)>.02){
  const r=70,n=20,pts=Array.from({length:n+1},(_,i)=>{const a=th*i/n;return [cx+r*Math.sin(a),py+r*Math.cos(a)];});
  s+=fade(thPivot,draw(pts,1,{color:CTH,w:4})+T(TH,cx+(r+26)*Math.sin(th/2),py+(r+26)*Math.cos(th/2)+10,30));
 }
 const rx=G*cs*sn,ry=G*cs*cs,tx=-G*sn*cs,ty=G*sn*sn;
 if(tri&&split)s+=fade(tri*split,poly([[bx,by],[bx+tx,by+ty],[bx,by+G]],{fill:C.hi,fo:.10}));
 s+=ring(bx,by,R,{color:bobColor,w:3,fill:bobFill})+(mtext?label(mtext,bx,by+8,{size:22,color:C.ink,anchor:'middle'}):'');
 const ga=grav*(split?mix(1,.45,split):1);
 if(grav)s+=fade(ga,arrow(bx,by+R,bx,by+G,{color:C.F,w:6,head:18}))+fade(grav,label('mg',bx+14,by+G-4,{size:26,color:C.F,weight:700}));
 if(split){
  s+=fade(split*.8,line(bx+rx,by+ry,bx,by+G,{color:C.F,w:2,dash:'6 6'})+line(bx+tx,by+ty,bx,by+G,{color:C.F,w:2,dash:'6 6'}));
  s+=fade(split*radHi,arrow(bx,by,bx+rx,by+ry,{color:CR,w:6+4*radLabHi,head:16})+(radLab?label(radLab,bx+rx+14,by+ry+6,{size:24,color:CR,weight:700}):''));
  if(Math.abs(sn)>.03)s+=fade(split*tanHi,arrow(bx,by,bx+tx,by+ty,{color:tanColor,w:7,head:20})+(tanLab?label(tanLab,bx+tx+(tx<0?-12:12),by+ty-10,{size:26,color:tanColor,anchor:tx<0?'end':'start',weight:700}):''));
 }
 if(tens){const Tl=G*cs*.95;s+=fade(tens,arrow(bx-R*sn,by-R*cs,bx-Tl*sn,by-Tl*cs,{color:CR,w:6,head:16})+label(tLab,bx-Tl*sn*.75+(sn>=0?-22:22),by-Tl*cs*.75+40,{size:24,color:CR,anchor:sn>=0?'end':'start',weight:700}));}
 if(plusDir){
  const r=Lp+40,a1=th+.08,a2=th+.36,n=12,pts=Array.from({length:n+1},(_,i)=>{const a=a1+(a2-a1)*i/n;return [cx+r*Math.sin(a),py+r*Math.cos(a)];});
  s+=fade(plusDir,draw(pts.slice(0,n-1),1,{color:C.hi,w:4})+arrow(pts[n-2][0],pts[n-2][1],pts[n][0],pts[n][1],{color:C.hi,w:4,head:14})
   +label('＋',pts[n][0]+14,pts[n][1]+2,{size:30,color:C.hi,weight:700}));
 }
 return fade(g,s);
}
const bobXY=(th,{cx=300,py=100,Lp=230}={})=>[cx+Lp*Math.sin(th),py+Lp*Math.cos(th)];
// 接線（黄の点線）と、糸の力との直角の印
function tangentMark(th,{cx=300,py=100,Lp=230,g=1,glow=0}={}){
 const [bx,by]=bobXY(th,{cx,py,Lp}),sn=Math.sin(th),cs=Math.cos(th),tx=cs,ty=-sn,ux=-sn,uy=-cs,q=22;
 let s=line(bx-130*tx,by-130*ty,bx+130*tx,by+130*ty,{color:C.hi,w:3,dash:'8 8'})+label('接線',bx+140*tx+8,by+140*ty,{size:26,color:C.hi,weight:700});
 const ox=bx+30*ux,oy=by+30*uy;
 s+=draw([[ox+q*tx,oy+q*ty],[ox+q*tx+q*ux,oy+q*ty+q*uy],[ox+q*ux,oy+q*uy]],1,{color:C.hi,w:3+3*glow});
 if(glow)s+=fade(glow*.5,ring(ox+q*(tx+ux)/2,oy+q*(ty+uy)/2,26,{color:C.hi,w:3}));
 return fade(g,s);
}
// sin θ と θ のグラフ
function sinGraph({g=1,lin=1,x=90,y=470,w=480,h=360,xmax=1.6,ymax=1.6,ticks=[.5,1,1.5]}={}){
 const A=axes({x,y,w,h,xmin:0,xmax,ymin:0,ymax,xlabel:'θ [rad]',ylabel:'',xticks:ticks,yticks:ticks,grid:true,g,xcolor:CTH});
 let s=A.svg+A.plot(Math.sin,{color:C.F,w:4.5});
 s+=fade(lin*g,A.plot(u=>u,{from:0,to:Math.min(xmax,ymax),color:C.hi,w:3.5,dash:'10 7'}));
 return {A,svg:s};
}
// 周期の時計（金）：1周 ＝ full 秒。t 秒の所まで針が回る
function clock(cx,cy,r,t,{full=10,g=1,txt=''}={}){
 let s=ring(cx,cy,r,{color:CT,w:4,fill:'#1a1a10'});
 for(let i=0;i<full;i++){const a=TAU*i/full;s+=line(cx+r*.84*Math.sin(a),cy-r*.84*Math.cos(a),cx+r*Math.sin(a),cy-r*Math.cos(a),{color:CT,w:3});}
 s+=label('0',cx,cy-r+40,{size:22,color:CT,anchor:'middle'});
 const a=TAU*t/full;
 if(t>.01){const n=Math.max(2,Math.ceil(36*t/full)),pts=Array.from({length:n+1},(_,i)=>{const b=a*i/n;return [cx+r*.6*Math.sin(b),cy-r*.6*Math.cos(b)];});
  s+=draw([[cx,cy],...pts,[cx,cy]],1,{color:CT,w:0,fill:CT,opacity:.28});}
 s+=line(cx,cy,cx+r*.78*Math.sin(a),cy-r*.78*Math.cos(a),{color:CT,w:5})+dot(cx,cy,7,CT);
 if(txt)s+=label(txt,cx,cy+r+40,{size:30,color:CT,anchor:'middle',weight:700});
 return fade(g,s);
}
// 振れ角 30°、l＝2.45 m、g＝9.8：近似（30°×cos 2t）と、sinθ のままの式を RK4 で解いたもの（実時間）
const GL=9.8/2.45,W0=Math.sqrt(GL),DT=.002,NT=8000; // 16 s
const TRUE=(()=>{let th=TH30,om=0;const out=[th];const f=a=>-GL*Math.sin(a);
 for(let i=0;i<NT;i++){const k1t=om,k1o=f(th),k2t=om+DT/2*k1o,k2o=f(th+DT/2*k1t),k3t=om+DT/2*k2o,k3o=f(th+DT/2*k2t),k4t=om+DT*k3o,k4o=f(th+DT*k3t);
  th+=DT/6*(k1t+2*k2t+2*k3t+k4t);om+=DT/6*(k1o+2*k2o+2*k3o+k4o);out.push(th);}return out;})();
const trueAt=t=>TRUE[clamp(Math.round(t/DT),0,NT)];
const approxAt=t=>TH30*Math.cos(W0*t);
export const T_STOP=4*TAU/W0;   // 4π ≈ 12.57 s：近似の振り子が4往復して右端に戻る
// 地球と月の振り子（実際の周期 π s と 7.70 s のまま、実時間）
const RMOON=Math.sqrt(9.8/1.63);
function earthMoon(t,{g=1,swing=1,labels=1,amp=.4}={}){
 const th1=swing?amp*Math.cos(2*t):amp,th2=swing?amp*Math.cos(2*t/RMOON):amp;
 let s=pend(th1,{cx:170,py:100,Lp:230,thMax:amp,mtext:'',R:22});
 s+=pend(th2,{cx:490,py:100,Lp:230,thMax:amp,mtext:'',R:22,bobColor:C.dim,bobFill:'#2a3346'});
 if(labels)s+=label('地球 g ＝ 9.8',170,410,{size:26,color:C.ink,anchor:'middle',weight:700})+label('月 g ＝ 1.63',490,410,{size:26,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// 式 EOM の中の位置（左端から）：[l の左端, l の右端, −mg sinθ の左端]
const eomParts=size=>[texWidth('m',size,false),texWidth(`m${LL}`,size,false),texWidth(`m${LL}\\,${DDT}=`,size,false)+size*.1];
const EOM=(mL='m')=>`${mL}${LL}\\,${DDT}=-${mL}g\\,${SIN}`;
const TFORM=`${TT}=2\\pi\\sqrt{\\dfrac{${LL}}{g}}`;

// 行13 の画面：上段に振り子の式とばねの式、下段にばねの周期
function springScene({top=1,same=1,map=1,bottom=0,t1=0,t2=0}={}){
 let s=card(40,90,540,170,label('振り子（小さな 振れ）',310,130,{size:26,color:C.dim,anchor:'middle'})+T(`${DDT}=-\\dfrac{g}{${LL}}\\,${TH}`,310,205,38),1);
 s+=card(620,90,540,170,label('ばねの 式（振動の 方程式）',890,130,{size:26,color:C.dim,anchor:'middle'})+T(`\\dfrac{d^2x}{dt^2}=-${WW}^2x`,890,205,38),top);
 s+=fade(same,label('同じ 形',600,298,{size:28,color:C.hi,anchor:'middle',weight:700}));
 s+=fade(map,label('x → θ',420,298,{size:28,color:CTH,anchor:'middle',weight:700})+label('ω² → g/l',790,298,{size:28,color:CW,anchor:'middle',weight:700}));
 s+=card(120,330,960,175,label('ばねの 周期',250,375,{size:24,color:C.dim,anchor:'middle'}),bottom);
 const parts=[`${TT}=\\dfrac{2\\pi}{${WW}}`,`=2\\pi\\sqrt{\\dfrac{${LL}}{g}}`],ws=parts.map(q=>texWidth(q,42,false)),Wd=ws[0]+ws[1]+18;
 s+=fade(t1,T(parts[0],640-Wd/2,435,42,{anchor:'start'}));
 s+=fade(t2,T(parts[1],640-Wd/2+ws[0]+18,435,42,{anchor:'start'})+highlight(640-Wd/2+ws[0]+8,368,ws[1]+20,128,1));
 return s;
}
// 行21〜24 の画面：左に2つの振り子、右に説明の枠（赤の縁）、左下に拡大の小窓。札は呼ぶ側で描く。
function lagScene(t,{stop=0,after=0,last=0,src=0,badge=1}={}){
 const cx1=170,cx2=480,py=100,Lp=220;
 const ta=approxAt(t),tt=trueAt(t);
 let s=pend(ta,{cx:cx1,py,Lp,thMax:TH30,mtext:'',R:22,bobColor:C.hi,bobFill:'#3a3418'});
 s+=pend(tt,{cx:cx2,py,Lp,thMax:TH30,mtext:'',R:22,bobColor:CTH,bobFill:'#3a2614'});
 const [gx,gy]=bobXY(ta,{cx:cx2,py,Lp});
 s+=ring(gx,gy,22,{color:C.hi,w:2.5,dash:'5 5'});
 s+=label('近似の 式',cx1,365,{size:26,color:C.hi,anchor:'middle',weight:700})+label('本当（sinθ のまま）',cx2,365,{size:26,color:CTH,anchor:'middle',weight:700});
 s+=label('点線 ＝ 近似の 位置',cx2,398,{size:22,color:C.dim,anchor:'middle'});
 if(stop){
  // 本当の振り子の側の、点線の輪（近似の位置）と本当のおもりの間に赤の弧
  const n=12,pts=Array.from({length:n+1},(_,i)=>{const a=tt+(ta-tt)*i/n;return [cx2+(Lp+34)*Math.sin(a),py+(Lp+34)*Math.cos(a)];});
  s+=fade(after,draw(pts,1,{color:CD,w:5}));
  s+=fade(after,label('位置の差 約 3°：',40,445,{size:24,color:CD,weight:700})+label('本当の方が 遅れている',40,478,{size:24,color:CD,weight:700}));
  // 拡大の小窓（右端の付近を 4 倍）
  const zx=370,zy=412,zw=280,zh=96,k=4,[ax,ay]=bobXY(ta,{cx:cx2,py,Lp}),[bx,by]=bobXY(tt,{cx:cx2,py,Lp});
  const cxz=(ax+bx)/2,cyz=(ay+by)/2,Z=(x,y)=>[zx+zw/2+(x-cxz)*k,zy+zh/2+(y-cyz)*k];
  let z=rect(zx,zy,zw,zh,{fill:'#0e1830',fo:.98,stroke:C.dim,sw:2,rx:8});
  const arcPts=Array.from({length:30},(_,i)=>{const a=tt-.06+(ta-tt+.12)*i/29;return Z(cx2+Lp*Math.sin(a),py+Lp*Math.cos(a));});
  z+=draw(arcPts,1,{color:C.faint,w:2,dash:'5 6'});
  const [zax,zay]=Z(ax,ay),[zbx,zby]=Z(bx,by);
  z+=ring(zax,zay,16,{color:C.hi,w:2.5,dash:'5 5'})+ring(zbx,zby,16,{color:CTH,w:3,fill:'#3a2614'})+line(zbx,zby,zax,zay,{color:CD,w:4});
  z+=label('拡大',zx+zw-10,zy+24,{size:20,color:C.dim,anchor:'end'});
  s+=fade(after,`<svg x="${zx}" y="${zy}" width="${zw}" height="${zh}" viewBox="${zx} ${zy} ${zw} ${zh}" overflow="hidden">${z}</svg>`);
  if(badge)s+=pauseBadge({g:after,x:960,y:8});
 }
 s+=panel(86,300,label('戻す力が 弱い',PC,130,{size:28,color:C.F,anchor:'middle',weight:700})
  +label('↓',PC,168,{size:26,color:C.dim,anchor:'middle'})+label('戻るのに 時間が かかる',PC,208,{size:28,color:C.ink,anchor:'middle'})
  +label('↓',PC,246,{size:26,color:C.dim,anchor:'middle'})+label('周期は 長い',PC,286,{size:28,color:C.ink,anchor:'middle',weight:700})
  +fade(last,line(PX+40,312,PX+PW-40,312,{color:C.faint,w:2})+label('周期は 約 1.7% 長い',PC,354,{size:30,color:CD,anchor:'middle',weight:700})),1,CD);
 if(src)s+=card(PX,400,PW,100,label('単元動画で、運動方程式（sinθ のまま）を',PC,440,{size:22,color:C.ink,anchor:'middle',weight:700})+label('数値で 解いた 結果',PC,476,{size:22,color:C.ink,anchor:'middle',weight:700}),src,C.ink);
 return s;
}

export const ytQxUmPendulumDiagrams={
 // ===================== 問題アニメ =====================
 // 小問1の図（出題、約4秒）：0〜2 s で右へ 30° 振り上げ θ の弧、2〜4 s で mg と糸の力 S、右へ振れる向きに黄の「＋」。静止。
 [K+'q1']:(p)=>{
  const th=TH30*seg(p,.02,.48);
  return pend(th,{cx:600,py:60,Lp:250,G:170,thPivot:seg(p,.1,.48),grav:seg(p,.55,.75),tens:seg(p,.6,.8),plusDir:seg(p,.8,.95),thMax:.62});
 },
 // 小問2の図（約3秒）：同じ振り子（l＝2.45 m）を2つ、止めたまま並べる。揺らさない。
 [K+'q2']:(p)=>{
  let s=fade(seg(p,0,.3),pend(0,{cx:400,py:60,Lp:300,thMax:.3,mtext:'',R:24,path:0}))+fade(seg(p,.2,.5),pend(0,{cx:800,py:60,Lp:300,thMax:.3,mtext:'',R:24,path:0,bobColor:C.dim,bobFill:'#2a3346'}));
  s+=fade(seg(p,.1,.4),label('地球 g＝9.8',400,430,{size:28,color:C.ink,anchor:'middle',weight:700}))+fade(seg(p,.3,.6),label('月 g＝1.63',800,430,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.9),label('同じ振り子 l＝2.45 m',600,490,{size:28,color:CL,anchor:'middle',weight:700}));
  return s;
 },
 // 小問3の図（約2.5秒）：振幅 30° に振り上げた静止画。角の札「30°（約 0.52 rad）」
 [K+'q3']:(p)=>{
  const th=TH30*seg(p,.02,.55);
  let s=pend(th,{cx:600,py:60,Lp:250,thPivot:seg(p,.2,.55),thMax:.62,mtext:'m'});
  s+=fade(seg(p,.6,.9),label('30°（約 0.52 rad）',740,150,{size:30,color:CTH,weight:700}));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題中の図（30°・θ・mg・S）。右の枠に「小問1／円弧に沿う向きの運動方程式を立てる」。「振れ角 θ」で下半分と「＋」
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=pend(TH30,{thPivot:1,grav:1,tens:1,plusDir:seg(p,b,b+.12)});
  s+=panel(90,330,label('小問1',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('円弧に 沿う 向きの',PC,200,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('運動方程式 を 立てる',PC,245,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.12),line(PX+40,282,PX+PW-40,282,{color:C.faint,w:2})+label('位置 は 振れ角 θ で 表す',PC,335,{size:28,color:CTH,anchor:'middle',weight:700})
   +label('（右へ 振れる 向きが ＋）',PC,380,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2),C.hi);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 力は糸の力と重力。重力を、糸の方向と接線方向に分け、影の三角形
 [K+'split']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,sp=seg(p,b+.05,b+.3);
  let s=pend(TH30,{thPivot:1,grav:1,tens:1,split:sp,tri:1,radHi:1});
  s+=panel(90,330,label('おもりに はたらく 力',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('糸の力 S',PX+60,205,{size:30,color:CR,weight:700})+label('重力 mg',PX+60,260,{size:30,color:C.F,weight:700})
   +fade(seg(p,b,b+.1),line(PX+40,290,PX+PW-40,290,{color:C.faint,w:2})+label('重力を 二つの 向きに 分ける',PC,335,{size:28,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,b+.25,b+.38),label('糸の 方向',PX+130,395,{size:26,color:CR,anchor:'middle',weight:700})+label('円弧の 接線方向',PX+350,395,{size:26,color:C.F,anchor:'middle',weight:700})),seg(p,.05,.2));
  s+=goalTag(G1);
  return s;
 },
 // 3. 接線成分 mg sinθ（黄）、糸の方向 mg cosθ（薄く）。誤答カードは出さない（行10で扱う）
 [K+'tangent']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=pend(TH30,{thPivot:1,grav:1,split:1,tri:1,tanColor:C.hi,radHi:mix(1,.35,seg(p,b-.05,b+.05)),
   tanLab:'mg sinθ',radLab:seg(p,b,b+.08)>0?'mg cosθ':''});
  s+=panel(90,330,label('接線方向（θ を 減らす 向き）',PC,140,{size:26,color:C.hi,anchor:'middle',weight:700})
   +T(`-mg\\,${SIN}`,PC,215,50,{color:C.hi})
   +fade(seg(p,b,b+.1),line(PX+40,275,PX+PW-40,275,{color:C.faint,w:2})+label('糸の 方向の 影 は 別もの',PC,325,{size:26,color:C.dim,anchor:'middle'})+T(`mg\\cos${TH}`,PC,378,36,{color:CR})),seg(p,.05,.2),C.hi);
  s+=goalTag(G1);
  return s;
 },
 // 4. 糸の力と接線に直角の印。誤答カードは出さない（行10で扱う）
 [K+'tension']:(p)=>{
  let s=pend(TH30,{grav:.35,split:.35,tri:0,tanColor:C.hi,radHi:0,tens:1});
  s+=tangentMark(TH30,{g:seg(p,.05,.25)});
  s+=panel(90,300,label('糸の力 S ⟂ 接線',PC,160,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('接線方向の 成分 ＝ 0',PC,240,{size:30,color:CR,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.6),label('→ 接線方向の 式に 入らない',PC,320,{size:28,color:C.ink,anchor:'middle'})),seg(p,.1,.25),C.hi);
  s+=goalTag(G1);
  return s;
 },
 // 5. 円弧の長さ s＝lθ（θ はラジアン）
 [K+'arc']:(p,ctx)=>{
  const th=TH30*seg(p,.05,.35),W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=pend(th,{lLab:1,thPivot:1,arcHi:1,mtext:'',grav:0});
  const Lp=230,py=100,cx=300,am=th/2;
  if(th>.05)s+=label('s',cx+(Lp+30)*Math.sin(am),py+(Lp+30)*Math.cos(am)+12,{size:32,color:CL,weight:700});
  s+=panel(90,400,label('円弧の 長さ',PC,140,{size:26,color:C.dim,anchor:'middle'})+T(`{\\color{${CL}}s}=${LL}\\,${TH}`,PC,205,52)
   +fade(seg(p,b,b+.12),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+label('θ を ラジアン で 測る',PC,300,{size:28,color:CTH,anchor:'middle',weight:700})
    +label('θ ＝ 円弧の 長さ ÷ 半径',PC,355,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,b+.2,b+.32),label('→ 半径 × 角度 ＝ 円弧の 長さ',PC,430,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25),CL);
  s+=goalTag(G1);
  return s;
 },
 // 6. 1回微分して、円弧に沿う速度（振幅 30° で1往復。速度の矢印は真下で最長、端で 0）
 [K+'vel']:(p)=>{
  const ph=TAU*p,th=TH30*Math.cos(ph),om=-TH30*Math.sin(ph);
  const [bx,by]=bobXY(th);
  let s=pend(th,{lLab:1,arcHi:1,mtext:'',thMax:TH30});
  const k=150*om/TH30;
  if(Math.abs(k)>8)s+=arrow(bx,by,bx+k*Math.cos(th),by-k*Math.sin(th),{color:C.v,w:6,head:16});
  s+=label('速度',300,420,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=panel(86,425,T(`{\\color{${CL}}s}=${LL}\\,${TH}`,PC,140,44)
   +fade(seg(p,.15,.3),arrow(PC,175,PC,215,{color:C.dim,w:3,head:12})+label('時間で 1回 微分',PC+20,202,{size:24,color:C.dim}))
   +fade(seg(p,.3,.45),T(`\\dfrac{d{\\color{${CL}}s}}{dt}=${LL}\\,\\dfrac{d${TH}}{dt}`,PC,280,44))
   +fade(seg(p,.45,.6),label('円弧に 沿う 速度',PC,365,{size:28,color:C.v,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('l は 一定 なので 前に 出た まま',PC,440,{size:26,color:CL,anchor:'middle'})),seg(p,0,.12),CL);
  s+=goalTag(G1);
  return s;
 },
 // 7. もう1回微分して加速度。誤答カードは出さない（行10で扱う）
 [K+'acc']:(p)=>{
  let s=pend(TH30,{lLab:1,thPivot:1,arcHi:1,mtext:''});
  s+=panel(86,340,T(`\\dfrac{d{\\color{${CL}}s}}{dt}=${LL}\\,\\dfrac{d${TH}}{dt}`,PC,145,32)
   +fade(seg(p,.1,.25),arrow(PC,185,PC,220,{color:C.dim,w:3,head:12})+label('もう 1回 微分',PC+20,210,{size:24,color:C.dim}))
   +fade(seg(p,.25,.4),T(`{\\color{${C.a}}\\dfrac{d^2{\\color{${CL}}s}}{dt^2}=${LL}\\,${DDT}}`,PC,300,40))
   +fade(seg(p,.4,.55),label('接線方向の 加速度',PC,395,{size:28,color:C.a,anchor:'middle',weight:700})),seg(p,0,.12),CL);
  s+=goalTag(G1);
  return s;
 },
 // 8. ma＝F に入れる（カット割り：①図で意味 → ②図を消して式を大きく、両辺の m に打ち消し線）
 [K+'eom']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,cA=1-seg(p,b-.06,b),cB=seg(p,b-.02,b+.05),cn=seg(p,b+.08,b+.16);
  let s=fade(cA,pend(TH30,{cx:200,py:110,Lp:200,grav:1,split:1,tri:1,tanColor:C.hi,radHi:.25,G:140,mtext:''})
   +card(420,90,760,320,label('接線方向に ma ＝ F',800,140,{size:28,color:C.dim,anchor:'middle'})
   +T(EOM('m'),800,240,46)+label('質量 × 加速度',660,340,{size:26,color:C.a,anchor:'middle',weight:700})+label('接線方向の 力',955,340,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.03,.15)));
  const mL=cn>.5?`{\\color{${C.a}}\\cancel{\\color{${C.ink}}m}}`:'m';
  s+=fade(cB,label('接線方向に ma ＝ F',600,150,{size:28,color:C.dim,anchor:'middle'})+T(EOM(mL),600,260,60)
   +fade(seg(p,b+.18,b+.28),label('m が 消える → 周期は 質量に よらない',600,390,{size:32,color:C.ink,anchor:'middle',weight:700})));
  s+=goalTag(G1);
  return s;
 },
 // 9. 小問1 の答え C。−mg sinθ（黄）と左辺の l（水色）を順に光らせる
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  const e=EOM('m'),w=texWidth(e,56,false),x0=600-w/2;
  let s=label('接線方向に ma ＝ F',600,150,{size:28,color:C.dim,anchor:'middle'})+T(e,600,260,56);
  const [l0,l1,r0]=eomParts(56),hx=x0+r0;
  s+=highlight(hx-6,205,x0+w-hx+12,95,seg(p,b+.05,b+.15)*(1-seg(p,b+.4,b+.48)),C.hi);
  s+=highlight(x0+l0-6,205,l1-l0+12,95,seg(p,b+.4,b+.48),CL);
  s+=fade(seg(p,b+.05,b+.15),label('接線方向の 影 だけ',(hx+x0+w)/2,360,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.4,b+.48),label('弧の 長さの l',x0+(l0+l1)/2,360,{size:26,color:CL,anchor:'middle',weight:700}));
  s+=goalTag(G1)+ANS1(seg(p,.03,.12));
  return s;
 },
 // 10. 誤答 B → A → D を一枚ずつ。B の間 mg cosθ、A の間 直角の印、D の間 左辺の l を光らせる
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),wB=[0,W[0][1]*.55],wA=[W[0][1]*.55,W[0][1]],wD=[W[1]?W[1][0]:.6,1];
  const inB=seg(p,wB[0]+.01,wB[0]+.05)*(1-seg(p,wB[1]-.04,wB[1])),inA=seg(p,wA[0]+.01,wA[0]+.05)*(1-seg(p,wA[1]-.04,wA[1])),inD=seg(p,wD[0]+.01,wD[0]+.05);
  const blink=.5+.5*Math.sin(cueT(ctx)*6);
  let s=pend(TH30,{grav:1,split:1,tri:1,tens:1,tanColor:C.hi,radHi:.35+.65*inB,radLabHi:inB*blink,radLab:inB>.05?'mg cosθ':'',G:140});
  s+=tangentMark(TH30,{g:inA,glow:inA*blink});
  const e=EOM('m'),w=texWidth(e,34,false),x0=PC-w/2;
  s+=panel(90,150,label('小問1 の 式',PC,130,{size:24,color:C.dim,anchor:'middle'})+T(e,PC,195,34),1,C.faint);
  const [l0,l1]=eomParts(34);
  s+=fade(inD*(.4+.6*blink),highlight(x0+l0-5,155,l1-l0+10,75,1,CL));
  s+=wrongSeq(p,ctx,[['B','−mg cosθ','糸の 方向の 影と 取り違えた'],['A','S−mg sinθ',['糸の力を 接線方向の 式に 入れた','（S は 接線と 直角）']],['D','m d²θ/dt²',['l を 落とした','（左辺が kg/s²、右辺の N と 合わない）']]],{win:[wB,wA,wD],opts:{...WOPT,y:255}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 11. 地球と月の同じ振り子（止めたまま）。右の枠「小問2／月面での周期は？」「まず 運動方程式 → 周期の式」
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=earthMoon(0,{swing:0});
  s+=label('同じ 振り子 l ＝ 2.45 m',330,460,{size:26,color:CL,anchor:'middle',weight:700});
  s+=panel(90,330,label('小問2',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('月面での 周期 は？',PC,205,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),line(PX+40,245,PX+PW-40,245,{color:C.faint,w:2})+label('まず',PC,300,{size:26,color:C.dim,anchor:'middle'})
    +label('運動方程式 → 周期の 式',PC,355,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 12. 小さな振れ sinθ≈θ（カット割り：①グラフと近似 → ②図を消して式を一段ずつ）
 [K+'small']:(p)=>{
  const cA=1-seg(p,.5,.56),cB=seg(p,.55,.62);
  const {A,svg}=sinGraph({x:80,y:470,w:340,h:340,g:seg(p,0,.12),lin:seg(p,.06,.18)});
  let a=svg+fade(seg(p,.05,.18),label('sinθ',A.X(1.45),A.Y(Math.sin(1.45))+40,{size:26,color:C.F,weight:700,anchor:'middle'})+label('θ',A.X(1.3)-16,A.Y(1.3),{size:28,color:C.hi,weight:700,anchor:'end'}));
  a+=fade(seg(p,.15,.27),highlight(A.X(0)-10,A.Y(.4),A.X(.4)-A.X(0)+20,A.Y(0)-A.Y(.4)+10,1,C.hi)+label('原点の 近くで 重なる',A.X(.45),A.Y(.15),{size:24,color:C.hi,weight:700}));
  a+=panel(90,300,kindTag('近似',PC,140,{g:seg(p,.1,.2)})+fade(seg(p,.12,.24),label('小さな 振れ（|θ| ≪ 1）',PC,205,{size:28,color:C.dim,anchor:'middle'})+T(`${SIN}\\approx${TH}`,PC,280,48)),seg(p,0,.1),C.hi);
  let s=fade(cA,a);
  const s1=seg(p,.6,.68),s2=seg(p,.72,.8),s3=seg(p,.84,.92);
  let b=label('運動方程式の sinθ を θ に',600,130,{size:28,color:C.dim,anchor:'middle'});
  b+=T(`m${LL}\\,${DDT}=-mg\\,{\\color{${C.hi}}\\boxed{\\sin${TH}}}`,600,215,44,{opacity:1-s2*.6});
  b+=fade(s2,T(`m${LL}\\,${DDT}=-mg\\,{\\color{${C.hi}}${TH}}`,600,320,44));
  b+=fade(s3,label('両辺を ml で 割る',1000,375,{size:24,color:C.dim,anchor:'middle'})+T(`${DDT}=-\\dfrac{g}{${LL}}\\,${TH}`,600,430,48));
  s+=fade(cB*s1,b);
  s+=goalTag(G2);
  return s;
 },
 // 13a. ばねの式と同じ形 → ω²＝g/l（カット割り①：上段の対応）
 [K+'spring']:(p)=>springScene({top:seg(p,0,.1),same:seg(p,.15,.28),map:seg(p,.3,.45)})+goalTag(G2),
 // 13b. 周期 T＝2π/ω＝2π√(l/g)（カット割り②：下段の周期。継ぎ足して黄の枠）
 [K+'spring2']:(p)=>springScene({bottom:seg(p,0,.1),t1:seg(p,.08,.2),t2:seg(p,.35,.48)})+goalTag(G2),
 // 14. 地球：√(2.45÷9.8)＝√0.25＝0.5、T＝π s。時計の針が π s まで回る
 [K+'earth']:(p)=>{
  const tc=Math.PI*seg(p,.5,.8);
  let s=clock(250,270,140,tc,{full:10,txt:seg(p,.78,.88)>0?'π s ≈ 3.14 s':''});
  s+=label('地球',250,115,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=card(480,86,700,420,label('l ＝ 2.45 m、g ＝ 9.8 m/s²',830,135,{size:30,color:C.ink,anchor:'middle',weight:700}),1);
  s+=fade(seg(p,.08,.2),T(`\\sqrt{\\dfrac{${LL}}{g}}=\\sqrt{\\dfrac{2.45}{9.8}}`,830,215,38));
  s+=fade(seg(p,.2,.32),T(`=\\sqrt{0.25}=0.5\\ \\mathrm{s}`,830,305,38));
  s+=fade(seg(p,.36,.5),T(`${TT}=2\\pi\\times0.5=\\pi\\ \\mathrm{s}`,830,390,40));
  s+=fade(seg(p,.6,.72),T(`\\approx{\\color{${CT}}3.14\\ \\mathrm{s}}`,830,465,38));
  s+=goalTag(G2);
  return s;
 },
 // 15. T は √(1/g) に比例。g の比と、その平方根
 [K+'ratio']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35;
  let s=card(20,86,1160,420,'',1);
  s+=T(TFORM,290,190,44);
  s+=fade(seg(p,.05,.18),label('g は √ の 中、分母',290,285,{size:26,color:C.dim,anchor:'middle'})+T(`${TT}\\propto\\sqrt{\\dfrac{1}{g}}`,290,390,40));
  s+=line(560,110,560,480,{color:C.faint,w:2});
  s+=fade(seg(p,b,b+.1),label('地球 9.8 → 月 1.63',860,145,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.1,b+.2),label('g の 比',690,230,{size:26,color:C.dim,anchor:'middle'})+T(`\\dfrac{9.8}{1.63}\\approx6.0`,920,230,38));
  s+=fade(seg(p,b+.22,b+.32),label('平方根',690,340,{size:26,color:C.dim,anchor:'middle'})+T(`\\sqrt{\\dfrac{9.8}{1.63}}\\approx2.45`,920,340,38));
  s+=fade(seg(p,b+.36,b+.46),label('T は 約 2.45 倍',860,450,{size:34,color:CT,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 16. 地球と月の振り子を並べて揺らす（実時間：周期 π s と 7.70 s）。T＝π√(9.8/1.63)≈7.70 s。小問2 の答え B
 [K+'moon']:(p,ctx)=>{
  const t=tAt(ctx,K+'moon'),W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=earthMoon(t);
  s+=label('T ≈ 3.14 s',170,450,{size:28,color:CT,anchor:'middle',weight:700})+label('T ≈ 7.70 s',490,450,{size:28,color:CT,anchor:'middle',weight:700});
  s+=panel(86,330,label('月面の 周期',PC,135,{size:28,color:C.dim,anchor:'middle'})
   +T(`${TT}=\\pi\\sqrt{\\dfrac{9.8}{1.63}}\\approx{\\color{${CT}}7.70\\ \\mathrm{s}}`,PC,215,36)
   +fade(seg(p,.15,.28),line(PX+40,275,PX+PW-40,275,{color:C.faint,w:2})+T(`\\sqrt{\\dfrac{9.8}{1.63}}\\approx2.452`,PC,335,32)
   +label('計算途中の 近似値（丸める前の 値で 計算）',PC,395,{size:22,color:C.dim,anchor:'middle'})),seg(p,.03,.12),CT);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.08));
  return s;
 },
 // 17. 振り子時計は月では遅れる。g が 1/6 → 周期は √6 倍。正しい方のカード（B ✓）
 [K+'slow']:(p,ctx)=>{
  const t=tAt(ctx,K+'moon'),W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=earthMoon(t);
  s+=fade(seg(p,.05,.15),label('振り子時計は 月では 遅れる',330,460,{size:28,color:C.hi,anchor:'middle',weight:700}));
  const wT=texWidth(TFORM,40,false),wS=texWidth(`\\sqrt{\\dfrac{${LL}}{g}}`,40,false),xR=PC+wT/2;
  s+=panel(86,250,T(TFORM,PC,170,40)+fade(seg(p,b,b+.08),highlight(xR-wS+2,112,wS+8,110,1)+label('g は √ の 中',xR-wS/2,246,{size:24,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,b+.12,b+.22),label('g が 1/6 → 周期は √6 倍（√6 ≈ 2.45）',PC,310,{size:24,color:C.hi,anchor:'middle',weight:700})),1,C.faint);
  s+=fade(seg(p,b+.3,b+.4),rect(PX,350,PW,110,{fill:'#132a22',fo:.95,stroke:C.F,sw:2.5,rx:12})+label('B ✓',PX+24,415,{size:30,color:C.F,weight:700})
   +T('\\pi\\times\\sqrt{6}\\approx7.70\\ \\mathrm{s}',PX+110,405,34,{anchor:'start'}));
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 18. 誤答 A（√ を落として 6 倍）。カードは1枚だけ
 [K+'wrongA']:(p,ctx)=>{
  let s=earthMoon(tAt(ctx,K+'moon'));
  s+=panel(86,160,label('周期の 式',PC,122,{size:24,color:C.dim,anchor:'middle'})+T(TFORM,PC,200,36),1);
  s+=wrongCard('A','π×6 ≈ 18.9 s',['g が 約 1/6 → 周期も 6倍 とした','（√ を 落とした）'],{...WOPT,y:255,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 19. 誤答 C（√6 で割った）→ 誤答 D（g も効かない）。D の横で式の g を黄で光らせる
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),wC=[0,W[0][1]*.55],wD=[W[0][1]*.55,1],inD=seg(p,wD[0]+.01,wD[0]+.05);
  let s=earthMoon(tAt(ctx,K+'moon'));
  const g1=`${TT}=2\\pi\\sqrt{\\dfrac{${LL}}{{\\color{${C.hi}}g}}}`;
  s+=panel(86,160,label('周期の 式',PC,122,{size:24,color:C.dim,anchor:'middle'})+fade(1-inD,T(TFORM,PC,200,36))+fade(inD,T(g1,PC,200,36)),1,inD>.5?C.hi:C.faint);
  s+=wrongSeq(p,ctx,[['C','約 1.28 s','√6 で 割った（月の 方が 速い と した）'],['D','約 3.14 s','m と 同じく g も 消える と した']],{win:[wC,wD],opts:{...WOPT,y:255}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 20. 30° の所で、sinθ と θ のすき間を赤で。本当の戻す力は約 4.5% 弱い
 //   2026-10-16 点検PQ-017：0.52／0.50 では 4.5% が再現できないので、π/6≈0.5236 と sin30°＝0.5 にした。
 [K+'gap']:(p)=>{
  const {A,svg}=sinGraph({x:90,y:470,w:450,h:360,xmax:.9,ymax:.9,ticks:[.5]});
  let s=svg;
  const x=TH30;
  s+=fade(seg(p,.05,.18),line(A.X(x),A.Y(0),A.X(x),A.Y(x),{color:C.dim,w:2,dash:'4 6'})+label('30°',A.X(x),A.Y(0)-12,{size:24,color:CTH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.18,.3),dot(A.X(x),A.Y(x),8,C.hi)+label('θ ＝ π/6 ≈ 0.5236',A.X(x)-16,A.Y(x)-14,{size:24,color:C.hi,weight:700,anchor:'end'}));
  s+=fade(seg(p,.28,.4),dot(A.X(x),A.Y(Math.sin(x)),8,C.F)+label('sin30° ＝ 0.5',A.X(x)+16,A.Y(Math.sin(x))+34,{size:24,color:C.F,weight:700}));
  s+=fade(seg(p,.42,.55),line(A.X(x)+2,A.Y(x),A.X(x)+2,A.Y(Math.sin(x)),{color:CD,w:7}));
  s+=panel(86,330,label('振幅 30° ＝ π/6 ≈ 0.5236 rad',PC,140,{size:28,color:CTH,anchor:'middle',weight:700})
   +fade(seg(p,.45,.57),label('本当の 戻す力',PC,205,{size:26,color:C.F,anchor:'middle'})+T(`mg\\sin${TH}`,PC,255,36,{color:C.F}))
   +fade(seg(p,.55,.67),label('近似の 戻す力',PC,320,{size:26,color:C.hi,anchor:'middle'})+T(`mg\\,${TH}`,PC,370,36,{color:C.hi})),seg(p,.05,.15),CTH);
  s+=fade(seg(p,.72,.85),label('本当の 力は 約 4.5% 弱い',PC,465,{size:32,color:CD,anchor:'middle',weight:700}));
  s+=goalTag(G3,{g:seg(p,.03,.12)});
  return s;
 },
 // 21. 近似の振り子と本当の振り子（実時間・早送りしない）。t＝4π で映像を一時停止。位置の差 約 3°、拡大の小窓
 [K+'lag']:(p,ctx)=>{
  const tr=tAt(ctx,K+'lag'),t=Math.min(tr,T_STOP),after=clamp((tr-T_STOP)/.6);
  return lagScene(t,{stop:tr>=T_STOP?1:0,after})+goalTag(G3);
 },
 // 22. 一時停止した画面のまま。「周期は 約 1.7% 長い」と出どころの札（4.5% とは矢印・等号でつながない）
 [K+'source']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  return lagScene(T_STOP,{stop:1,after:1,last:seg(p,b,b+.08),src:seg(p,b+.06,b+.16)})+goalTag(G3);
 },
 // 23. 小問3 の答え A。答えの札を出し終えてから、誤答 B（1枚だけ）
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=lagScene(T_STOP,{stop:1,after:1,last:1,badge:0});
  s+=wrongCard('B','短くなる','弱い 力では 戻るのが 遅れる（逆）',{...WOPT,y:400,g:seg(p,b,b+.05)});
  s+=goalTag(G3)+ANS3(seg(p,.03,.1));
  return s;
 },
 // 24. 誤答 C（等時性）→ 誤答 D（mg は一定）。D の横に 30° と 60° の小さな図
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),wC=[0,W[0][1]],wD=[W[1]?W[1][0]:.5,1],inD=seg(p,wD[0]+.01,wD[0]+.06);
  let s=fade(1-inD,lagScene(T_STOP,{stop:1,after:1,last:1,badge:0}));
  const mini=(th,cx,txt)=>pend(th,{cx,py:110,Lp:150,G:120,R:16,grav:1,split:1,tri:1,tanColor:C.hi,radHi:.3,mtext:'',thMax:1.1,path:0})+label(txt,cx-40,150,{size:26,color:CTH,anchor:'middle',weight:700});
  s+=fade(inD,mini(TH30,150,'30°')+mini(Math.PI/3,420,'60°')+label('mg は 同じ、接線成分（黄）が 違う',320,480,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(inD,panel(86,300,label('重力 mg は 振れ角に よらない',PC,180,{size:26,color:C.F,anchor:'middle',weight:700})+label('変わるのは 接線方向の 割合',PC,250,{size:26,color:C.hi,anchor:'middle',weight:700}),1,C.faint));
  s+=wrongSeq(p,ctx,[['C','変わらない','等時性は |θ| ≪ 1 の ときだけ'],['D','重力が 大きくなる','mg は 一定、変わるのは sinθ の 割合']],{win:[wC,wD],opts:{...WOPT,y:400}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 25. 上段の4枚 → 下段の結果3枚 → 条件の帯 → 右上に答えの札3枚（カット割り：①図と式の流れ → ②結果 → ③条件）
 [K+'sum']:(p)=>{
  let s='';
  const bw=255,gap=40,x0=600-(4*bw+3*gap)/2,y0=86,bh=170;
  const xs=[0,1,2,3].map(i=>x0+i*(bw+gap));
  const gs=[seg(p,.02,.1),seg(p,.1,.18),seg(p,.18,.26),seg(p,.26,.34)];
  s+=card(xs[0],y0,bw,bh,pend(TH30,{cx:xs[0]+90,py:y0+16,Lp:60,R:11,G:55,mtext:'',grav:1,split:1,tri:1,tanColor:C.hi,radHi:.3,ceil:0,path:0,vert:0})
   +label('影の 三角形',xs[0]+bw/2,y0+bh-14,{size:22,color:C.dim,anchor:'middle'}),gs[0]);
  s+=card(xs[1],y0,bw,bh,T(`m${LL}\\,${DDT}`,xs[1]+bw/2,y0+58,26)+T(`=-mg\\,${SIN}`,xs[1]+bw/2,y0+118,26),gs[1]);
  s+=card(xs[2],y0,bw,bh,T(`${SIN}\\approx${TH}`,xs[2]+bw/2,y0+90,32),gs[2],C.hi);
  s+=card(xs[3],y0,bw,bh,T(TFORM,xs[3]+bw/2,y0+90,30),gs[3]);
  for(let i=0;i<3;i++)s+=fade(gs[i+1],arrow(xs[i]+bw+4,y0+bh/2,xs[i+1]-4,y0+bh/2,{color:C.dim,w:3,head:12}));
  const ry=y0+bh+26,rh=110,res=[['地球','π s ≈ 3.14 s',CT],['月','約 7.70 s',CT],['振幅 30°','約 1.7% 長い（単元動画の 数値計算）',CD]];
  const rws=[300,300,500],rg=30,rx0=600-(rws.reduce((a,b)=>a+b,0)+2*rg)/2;
  let xx=rx0;
  res.forEach(([a,b,c],i)=>{const x=xx,rw=rws[i],g=seg(p,.4+.07*i,.47+.07*i);xx+=rw+rg;
   s+=card(x,ry,rw,rh,label(a,x+rw/2,ry+40,{size:26,color:C.dim,anchor:'middle'})+label(b,x+rw/2,ry+86,{size:i===2?24:32,color:c,anchor:'middle',weight:700}),g);});
  s+=fade(seg(p,.65,.75),rect(60,ry+rh+14,1080,60,{fill:C.hi,fo:.10,stroke:C.hi,sw:2.5,rx:12})
   +T(`|${TH}|\\ll1`,420,ry+rh+50,32)+label('という 条件の 下での 結果',490,ry+rh+54,{size:28,color:C.hi,weight:700}));
  const ga=seg(p,.82,.92);
  s+=answerRow([[1,'C',''],[2,'B','約 7.70 s'],[3,'A','長くなる']],{g:ga});
  return s;
 },
};
