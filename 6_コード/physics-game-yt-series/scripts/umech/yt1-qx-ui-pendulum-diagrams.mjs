// 問題編 解説「ばねの力の向きと、振り子のエネルギー」（q-ui-pendulum、大学編 16 単振動・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/16_単振動.md の q-ui-pendulum（解説 18 行）。
// 画面の配置：左に図（ばね・振り子）、右に説明の枠（紺の塗り・角の丸い枠）。誤答カードは右の枠の下（小問2 は上）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：ずれ・位置 x・長さ L 水色、速度 v 紫、力 F・重力 緑、糸の力 深緑、時間・周期 T 金、位置エネルギー U 橙、運動エネルギー K 紫（単元動画と同じ。凡例を出す）、合計・強調 黄。
import {C,clamp,mix,seg,lin,fade,move,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,wall,ground,block,spring} from './anim.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,legend,note,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-ui-pendulum:';
const CU=C.E,CK=C.v,CS='#4f9f80',CT=C.t,CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cF=s=>`{\\color{${C.F}}${s}}`,cX=s=>`{\\color{${C.x}}${s}}`,cV=s=>`{\\color{${C.v}}${s}}`,cU=s=>`{\\color{${CU}}${s}}`,cK=s=>`{\\color{${CK}}${s}}`,cT=s=>`{\\color{${CT}}${s}}`,cH=s=>`{\\color{${C.hi}}${s}}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='ばねの力 F（向きと大きさ）',G2='一番低い所の速さ v',G3='周期は何倍か';
const ANS1=g=>answerTag(1,'B','左向きに 2.0 N',{g}),ANS2=g=>answerTag(2,'D','3.0 m/s',{g}),ANS3=g=>answerTag(3,'A','2 倍',{g});
const W2=ctx=>{const W=sentWin(ctx);return {W,b:W[1]?W[1][0]:.5,e:W[1]?W[1][1]:1,a1:W[0][1]};};

// ===================== ばねとおもり（小問1） =====================
// d：ずれ [m]。0.040 m を 160 px（図のための縮尺）。
const SP={x0:360,fy:360,sc:4000,bw:110,bh:90};
function springFig(d,{disp=1,dispLab=1,F=0,Flab='',Fcol=C.F,zero=1,axis=1,kTag=1,g=1,mtext='m'}={}){
 const {x0,fy,sc,bw,bh}=SP,bx=x0+d*sc;
 let s=ground(50,650,fy)+wall(60,fy-170,fy);
 s+=spring(60,bx-bw/2,fy-bh/2,{coils:10,amp:16,color:C.dim,w:3});
 s+=block(bx,fy,bw,bh,{color:C.x,text:mtext,size:30,fo:.22});
 if(axis){
  const ay=fy+44;
  s+=arrow(150,ay,640,ay,{color:C.x,w:3,head:14})+label('x',652,ay+9,{size:28,color:C.x,weight:700});
  for(const u of [-.04,-.02,0,.02,.04,.06])s+=line(x0+u*sc,ay-7,x0+u*sc,ay+7,{color:C.x,w:2.5});
  s+=label('0',x0,ay+36,{size:24,color:C.x,anchor:'middle'})+label('0.040',x0+.04*sc,ay+36,{size:24,color:C.x,anchor:'middle'})+label('［m］',600,ay+36,{size:22,color:C.x,anchor:'middle'});
  s+=label('右が ＋',190,ay+36,{size:22,color:C.x,anchor:'middle'});
 }
 if(zero)s+=fade(zero,line(x0,140,x0,fy+10,{color:C.dim,w:2,dash:'7 7'})+label('x ＝ 0（ばねが 自然の長さ）',x0,128,{size:24,color:C.dim,anchor:'middle'}));
 if(disp&&Math.abs(d)>.002)s+=fade(disp,arrow(x0,185,bx,185,{color:C.x,w:5,head:16})+(dispLab?fade(dispLab,label(d>0?'＋0.040 m':'ずれ',(x0+bx)/2,170,{size:26,color:C.x,anchor:'middle',weight:700})):''));
 if(Math.abs(F)>2)s+=arrow(bx,240,bx+F,240,{color:Fcol,w:7,head:20})+(Flab?label(Flab,bx+F+(F<0?-12:12),248,{size:28,color:Fcol,anchor:F<0?'end':'start',weight:700}):'');
 if(kTag)s+=fade(kTag,label('k ＝ 50 N/m',(60+bx-bw/2)/2,fy-82,{size:26,color:C.ink,anchor:'middle',weight:700}));
 return fade(g,s);
}
const FPX=-2800; // 力の矢印：ずれ 1 m あたり −2800 px（0.040 m で 112 px）

// ===================== 振り子（小問2） =====================
const PV={cx:290,py:100,Lp:270}; // 0.90 m ＝ 270 px（0.45 m ＝ 135 px）
const TH0=Math.PI/3;
function pend(th,{cx=PV.cx,py=PV.py,Lp=PV.Lp,R=24,g=1,path=1,thMax=TH0,mtext='',bobColor=C.x,bobFill='#123049',vert=1,ceil=1,vel=0,velLab='',grav=0,gravLab='mg',tens=0}={}){
 const sn=Math.sin(th),cs=Math.cos(th),bx=cx+Lp*sn,by=py+Lp*cs;
 let s='';
 if(ceil){s+=line(cx-90,py,cx+90,py,{color:C.dim,w:4});for(let q=cx-86;q<cx+90;q+=20)s+=line(q,py,q+12,py-14,{color:C.faint,w:2});}
 if(vert)s+=fade(vert,line(cx,py,cx,py+Lp+36,{color:C.faint,w:2,dash:'7 7'}));
 if(path)s+=fade(path,draw(Array.from({length:41},(_,i)=>{const a=-thMax+2*thMax*i/40;return [cx+Lp*Math.sin(a),py+Lp*Math.cos(a)];}),1,{color:C.faint,w:2,dash:'5 8'}));
 s+=line(cx,py,bx,by,{color:C.ink,w:3})+dot(cx,py,7,C.dim);
 if(tens){const L=110;s+=fade(tens,arrow(bx-R*sn,by-R*cs,bx-(R+L)*sn,by-(R+L)*cs,{color:CS,w:6,head:16})+label('糸の力',bx-(R+L)*sn-14,by-(R+L)*cs+20,{size:24,color:CS,anchor:'end',weight:700}));}
 if(grav){s+=fade(Math.min(1,grav),arrow(bx,by+R,bx,by+R+grav*60,{color:C.F,w:6,head:16})+(gravLab?label(gravLab,bx+14,by+R+grav*60-4,{size:24,color:C.F,weight:700}):''));}
 s+=ring(bx,by,R,{color:bobColor,w:3,fill:bobFill})+(mtext?label(mtext,bx,by+8,{size:22,color:C.ink,anchor:'middle'}):'');
 if(Math.abs(vel)>4){const ux=cs,uy=-sn,e=Math.sign(vel)*R;s+=arrow(bx+e*ux,by+e*uy,bx+(vel+e)*ux,by+(vel+e)*uy,{color:C.v,w:6,head:16})
  +(velLab?label(velLab,bx+(vel/2+e)*ux,by+(vel/2+e)*uy+40,{size:26,color:C.v,anchor:'middle',weight:700}):'');}
 return fade(g,s);
}
const bobXY=(th,{cx=PV.cx,py=PV.py,Lp=PV.Lp}={})=>[cx+Lp*Math.sin(th),py+Lp*Math.cos(th)];
// sinθ のままの運動方程式（g/L＝10/0.90）を RK4 で解く。θ(0)＝60°、静かに離す。
const GL=10/.9,DT=.002,NT=6000;
const SW=(()=>{let th=TH0,om=0;const a=[th],o=[0];const f=x=>-GL*Math.sin(x);
 for(let i=0;i<NT;i++){const k1t=om,k1o=f(th),k2t=om+DT/2*k1o,k2o=f(th+DT/2*k1t),k3t=om+DT/2*k2o,k3o=f(th+DT/2*k2t),k4t=om+DT*k3o,k4o=f(th+DT*k3t);
  th+=DT/6*(k1t+2*k2t+2*k3t+k4t);om+=DT/6*(k1o+2*k2o+2*k3o+k4o);a.push(th);o.push(om);}return {a,o};})();
const thAt=t=>SW.a[clamp(Math.round(t/DT),0,NT)],omAt=t=>SW.o[clamp(Math.round(t/DT),0,NT)];
const TB=(()=>{for(let i=1;i<=NT;i++)if(SW.a[i]<=0)return i*DT;return .5;})(); // 一番低い所に着く時刻（約 0.51 s）
const Uof=th=>4.5*(1-Math.cos(th)),Kof=th=>Math.max(0,2.25-Uof(th));
const vOf=th=>Math.sqrt(Math.max(0,18*(Math.cos(th)-.5))); // m/s
// 高さ 0.45 m・振れ角 60°・U＝0 の線
function pendMarks(th,{u0=1,h=1,ang=1,len=0,mass=0,hLeft=0}={}){
 const {cx,py,Lp}=PV,yb=py+Lp,yh=py+Lp*.5,[bx,by]=bobXY(th);
 let s='';
 if(u0)s+=fade(u0,line(40,yb,600,yb,{color:CU,w:2.5,dash:'8 7'})+label('U ＝ 0',44,yb+32,{size:24,color:CU,weight:700}));
 if(h)s+=fade(h,line(560,yh,560,yb,{color:C.x,w:3})+line(548,yh,572,yh,{color:C.x,w:3})+line(548,yb,572,yb,{color:C.x,w:3})+label('0.45 m',578,(yh+yb)/2+9,{size:26,color:C.x,weight:700}));
 if(hLeft)s+=fade(hLeft,line(30,yh,560,yh,{color:C.x,w:2,dash:'6 7'})+label('同じ 高さ',300,yh-10,{size:24,color:C.x,weight:700}));
 if(ang&&th>.05){const r=62,n=20,pts=Array.from({length:n+1},(_,i)=>{const a=th*i/n;return [cx+r*Math.sin(a),py+r*Math.cos(a)];});
  s+=fade(ang,draw(pts,1,{color:C.E,w:4})+label(`${Math.round(th*180/Math.PI)}°`,cx+(r+16)*Math.sin(th/2)+4,py+(r+16)*Math.cos(th/2)+16,{size:26,color:C.E,weight:700}));}
 if(len)s+=fade(len,label('0.90 m',cx+Lp*.5*Math.sin(th)+30*Math.cos(th)-4,py+Lp*.5*Math.cos(th)-30*Math.sin(th),{size:24,color:C.x,weight:700}));
 if(mass)s+=fade(mass,label('0.5 kg',bx+20,by-30,{size:24,color:C.ink,weight:700}));
 return s;
}
// U・K の棒と、合計の線（黄）
function bars(U,Kv,{x=720,y=440,sc=76,g=1,total=1,nums=1}={}){
 let s=line(x-30,y,x+300,y,{color:C.dim,w:3});
 s+=rect(x,y-U*sc,100,U*sc,{fill:CU,fo:.55,stroke:CU})+rect(x+170,y-Kv*sc,100,Kv*sc,{fill:CK,fo:.55,stroke:CK});
 s+=label('U',x+50,y+32,{size:28,color:CU,anchor:'middle',weight:700})+label('K',x+220,y+32,{size:28,color:CK,anchor:'middle',weight:700});
 if(nums)s+=label(`${U.toFixed(2)} J`,x+50,y-U*sc-12,{size:24,color:CU,anchor:'middle',weight:700})+label(`${Kv.toFixed(2)} J`,x+220,y-Kv*sc-12,{size:24,color:CK,anchor:'middle',weight:700});
 if(total)s+=fade(total,line(x-20,y-2.25*sc,x+290,y-2.25*sc,{color:C.hi,w:3,dash:'10 7'})+label('K＋U 一定',x+300,y-2.25*sc+8,{size:24,color:C.hi,weight:700}));
 return fade(g,s);
}
const LEG=g=>legend([['K 運動エネルギー',CK],['U 位置エネルギー',CU]],24,462,{g,size:22,gap:12});

// ===================== 小問3 の2つの振り子 =====================
const SH={cx:170,py:100,Lp:85},LO={cx:430,py:100,Lp:340},A3=.15;
function twoPend(t1,t2,{g=1,tags=1,sym=0,symL=0,symG=0,symT=0,small=1,mt=1}={}){
 let s=pend(t1,{...SH,R:18,thMax:A3,vert:.6,mtext:mt?'m':''})+pend(t2,{...LO,R:26,thMax:A3,vert:.6,bobColor:C.hi,bobFill:'#3a3418',mtext:mt?'2m':''});
 const [sx,sy]=bobXY(t1,SH);
 if(tags)s+=fade(tags,label('元の 振り子',150,192,{size:24,color:C.dim,anchor:'end',weight:700})
  +label('糸 ×4',470,270,{size:28,color:C.x,weight:700})+label('質量 ×2',560,445,{size:26,color:C.hi,weight:700}));
 if(small)s+=fade(small,rect(30,460,210,44,{fill:'#2a3346',fo:.9,stroke:C.dim,sw:2,rx:22})+label('小さく 揺らす',135,490,{size:24,color:C.ink,anchor:'middle',weight:700}));
 if(sym){
  s+=fade(symL,label('L：糸の長さ',204,150,{size:24,color:C.x,weight:700}));
  s+=fade(symG,arrow(sx,sy+20,sx,sy+78,{color:C.F,w:5,head:14})+label('g：重力加速度',sx+14,sy+76,{size:24,color:C.F,weight:700}));
  const r=SH.Lp+26,n=24,pts=Array.from({length:n+1},(_,i)=>{const a=-A3*1.6+2*A3*1.6*i/n;return [SH.cx+r*Math.sin(a),SH.py+r*Math.cos(a)];});
  s+=fade(symT,draw(pts,1,{color:CT,w:4})+label('T：1往復の 時間（周期）',36,340,{size:24,color:CT,weight:700}));
 }
 return fade(g,s);
}
// 周期の時計（金）：針が 1 周期で 1 回転
function clock(cx,cy,r,t,Tp,{g=1,txt=''}={}){
 const a=2*Math.PI*((t/Tp)%1);
 let s=ring(cx,cy,r,{color:CT,w:4,fill:'#1a1a10'})+line(cx,cy-r,cx,cy-r+10,{color:CT,w:3});
 s+=line(cx,cy,cx+r*.8*Math.sin(a),cy-r*.8*Math.cos(a),{color:CT,w:5})+dot(cx,cy,6,CT);
 if(txt)s+=label(txt,cx,cy+r+32,{size:26,color:CT,anchor:'middle',weight:700});
 return fade(g,s);
}
const WS=Math.sqrt(10/.9),WL=WS/2,TS=2*Math.PI/WS,TL=2*Math.PI/WL;
const HOLD_A2B=1.2; // 真下で「速さは 最大」を見せてから動かす秒数（wrongBC2 も同じだけずらす）
const TF=`${cT('T')}\\approx2\\pi\\sqrt{\\dfrac{${cX('L')}}{${cF('g')}}}`;

export const ytQxUiPendulumDiagrams={
 // ===================== 問題アニメ =====================
 // 小問1の図（出題、約4秒）：0〜2 s でおもりを x＝0 から右へ 0.040 m。ずれの矢印「＋0.040 m」、札「k＝50 N/m」。力の矢印なし。
 [K+'q1']:(p)=>move(240,0,springFig(.04*seg(p,.03,.5),{disp:seg(p,.1,.5),dispLab:seg(p,.5,.65),kTag:seg(p,.6,.8)})),
 // 小問2の図（約4秒）：0〜2 s で糸を張ったまま 0.45 m（60°）まで持ち上げ、高さ・角の札。まだ離さない。
 [K+'q2']:(p)=>{
  const th=TH0*seg(p,.03,.5);
  return move(150,0,pendMarks(th,{u0:seg(p,0,.15),h:seg(p,.55,.7),ang:seg(p,.55,.7),len:seg(p,.65,.8),mass:seg(p,.7,.85)})+pend(th));
 },
 // 小問3の図（約3秒）：元の振り子と、糸 ×4・質量 ×2 の振り子を小さな振れ角で並べた静止画。揺らさない。
 [K+'q3']:(p)=>move(200,0,twoPend(A3,A3,{g:seg(p,0,.3),tags:seg(p,.3,.6),small:seg(p,.6,.85)})),

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=springFig(.04);
  s+=panel(90,250,label('小問1',PC,140,{size:28,color:C.dim,anchor:'middle'})+label('x ＝ ＋0.040 m での',PC,205,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('ばねの 力 F は？',PC,260,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（向きと 大きさ）',PC,305,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. 法則 F＝−kx。「マイナス」で − を黄で光らせ、右・左にずらしたときの力の矢印を1往復だけ見せて +0.040 に戻す
 [K+'law']:(p,ctx)=>{
  const {b,e}=W2(ctx),u=lin(p,b+.05,b+.05+.75*(e-b)),d=.04*Math.cos(2*Math.PI*u);
  let s=springFig(d,{F:u>0&&u<1?d*FPX:0,Flab:u>0&&u<1?'F':'',dispLab:u<=0||u>=1?1:0});
  const f=`${cF('F')}=-k${cX('x')}`,w=texWidth(f,64,false),x0=PC-w/2,wl=texWidth(`${cF('F')}=`,64,false),wm=texWidth('-',64,false);
  s+=panel(90,300,kindTag('法則',PC,140)+T(f,PC,225,64)
   +highlight(x0+wl-6,180,wm+16,82,seg(p,b,b+.06),C.hi)
   +fade(seg(p,b+.04,b+.12),label('マイナス ＝ ずれと 逆向き',PC,330,{size:28,color:C.hi,anchor:'middle',weight:700})),1,C.F);
  return s+goalTag(G1);
 },
 // 3. 代入して −2.0 N → 札「左向き」→ 左向きの緑の矢印「2.0 N」→ 答えの札
 [K+'ans1']:(p,ctx)=>{
  const {b,e,a1}=W2(ctx),k1=seg(p,a1*.3,a1*.4),k2=seg(p,a1*.5,a1*.6),r=seg(p,a1*.75,a1*.85),lt=seg(p,b,b+.06),ar=seg(p,b+.05,b+.12);
  let s=springFig(.04,{F:ar*.04*FPX,Flab:ar>.5?'2.0 N':''});
  let q=T(`${cF('F')}=-k${cX('x')}`,PC,140,44);
  q+=fade(k1*(k2<.5?1:0),T(`${cF('F')}=-{\\color{${C.hi}}50}\\times${cX('x')}`,PC,215,40));
  q+=fade(k2<.5?0:1,T(`${cF('F')}=-{\\color{${C.hi}}50}\\times{\\color{${C.hi}}0.040}`,PC,215,40));
  q+=fade(r,T(`=-2.0\\ \\mathrm{N}`,PC,285,44));
  q+=fade(lt,label('マイナス → 左向き',PC,360,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(90,310,q,1,C.F);
  return s+goalTag(G1)+ANS1(seg(p,b+.6*(e-b),b+.6*(e-b)+.05));
 },
 // 4. 誤答 A → C → D を一枚ずつ（A は文1、C・D は文2 を半分ずつ）。A の間は、ずれと同じ向き（右）の赤い点線の矢印
 [K+'wrong1']:(p,ctx)=>{
  const {b,a1}=W2(ctx),m=b+(1-b)*.5;
  const wA=[0,a1],wC=[b,m],wD=[m,1],inA=seg(p,.01,.05)*(1-seg(p,a1-.04,a1));
  let s=springFig(.04,{F:.04*FPX,Flab:'2.0 N'});
  s+=fade(inA,arrow(SP.x0+.04*SP.sc,240,SP.x0+.04*SP.sc+112,240,{color:CD,w:5,head:16})+label('×',SP.x0+.04*SP.sc+122,252,{size:30,color:CD,weight:700}));
  s+=panel(90,235,T(`${cF('F')}=-k${cX('x')}`,PC,150,44)+T(`=-50\\times0.040`,PC,215,36)+T(`=-2.0\\ \\mathrm{N}`,PC,280,36),1,C.faint);
  s+=wrongSeq(p,ctx,[['A','右向きに 2.0 N','マイナスを 落とした'],['C','左向きに 1250 N','50÷0.040（単位 N/m²）'],['D','左向きに 0.040 N','k を 掛けていない（単位 m）']],{win:[wA,wC,wD],opts:{...WOPT,y:340}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 5. 出題中の小問2の図（0.45 m 持ち上げた振り子）、札「求めるもの」、左下に凡例
 [K+'goal2']:(p)=>{
  let s=pendMarks(TH0,{len:1,mass:1})+pend(TH0);
  s+=panel(90,250,label('小問2',PC,140,{size:28,color:C.dim,anchor:'middle'})+label('一番 低い所を 通る ときの',PC,205,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('速さ v は？',PC,265,{size:32,color:C.hi,anchor:'middle',weight:700})+label('g ＝ 10 m/s²',PC,315,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s+LEG(seg(p,.2,.35))+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 6. K（紫）と U（橙）の棒。K＝0、U＝0.5×10×0.45＝2.25 J を一つずつ入れ、U の棒が伸びる
 [K+'energy0']:(p,ctx)=>{
  const {b,e,a1}=W2(ctx),u1=seg(p,b+.15*(e-b),b+.25*(e-b)),u2=seg(p,b+.4*(e-b),b+.5*(e-b)),u3=seg(p,b+.65*(e-b),b+.75*(e-b));
  let s=pendMarks(TH0,{len:0,mass:1})+pend(TH0);
  s+=fade(seg(p,.1,.2),T(`${cK('K')}=0`,780,130,36))+fade(seg(p,.1,.2),label('止まっている',860,138,{size:24,color:C.dim}));
  s+=fade(seg(p,b,b+.06),T(`${cU('U')}=mgh`,800,185,34));
  s+=fade(u2<.5?u1:0,T(`=0.5\\times10\\times h`,1010,185,30))+fade(u2>=.5&&u3<.5?1:0,T(`=0.5\\times10\\times0.45`,1010,185,30))+fade(u3>=.5?1:0,T(`=2.25\\ \\mathrm{J}`,960,185,34));
  s+=bars(2.25*u3,0,{total:0,nums:u3>.5});
  return s+LEG(1)+goalTag(G2);
 },
 // 7. 糸の力（深緑）と動く向き（紫の短い矢印）に直角の印。合計の線（黄）「K＋U 一定」
 [K+'const']:(p,ctx)=>{
  const {b}=W2(ctx),[bx,by]=bobXY(TH0),sn=Math.sin(TH0),cs=Math.cos(TH0);
  let s=pendMarks(TH0,{h:.5,mass:0,ang:0})+pend(TH0,{tens:seg(p,.05,.15),vel:seg(p,.12,.22)>.5?-60:0});
  const d=24+16,ux=-sn,uy=-cs,vx=-cs,vy=sn;
  s+=fade(seg(p,.2,.3),draw([[bx+d*ux,by+d*uy],[bx+d*(ux+vx),by+d*(uy+vy)],[bx+d*vx,by+d*vy]],1,{color:C.hi,w:3}));
  s+=fade(seg(p,.22,.32),label('直角 → 仕事 0',bx+24,by-30,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.1,.2),label('動く 向き',bx-70,by+60,{size:22,color:C.v,anchor:'end',weight:700}));
  s+=T(`${cU('U')}=2.25\\ \\mathrm{J}`,800,150,34)+T(`${cK('K')}=0`,1030,150,34);
  s+=fade(seg(p,b,b+.08),label('仕事を するのは 重力だけ',930,215,{size:24,color:C.F,anchor:'middle',weight:700}));
  s+=bars(2.25,0,{total:seg(p,b+.1,b+.2)});
  return s+LEG(1)+goalTag(G2);
 },
 // 8. 離して一番低い所まで（実時間）。棒が入れ替わり、合計の線は水平。一番低い所で映像を一時停止、K＝2.25 J
 [K+'bottom']:(p,ctx)=>{
  const t0=.8,t=cueT(ctx)-t0,tt=clamp(t,0,TB),th=t<=0?TH0:t>=TB?0:thAt(tt),stop=t>=TB?clamp((t-TB)/.4):0;
  const vpx=-vOf(th)*40;
  let s=pendMarks(th,{h:.5,ang:0})+pend(th,{vel:t>0?vpx:0});
  s+=bars(Uof(th),Kof(th),{total:1});
  s+=fade(stop,T(`${cU('U')}=0\\ \\rightarrow\\ ${cK('K')}=2.25\\ \\mathrm{J}`,930,150,34));
  s+=pauseBadge({g:stop,x:560});
  return s+LEG(1)+goalTag(G2);
 },
 // 9. 止めた画面のまま、棒を消して式を一行ずつ。速度の矢印（紫）を最も長く「3.0 m/s」。答えの札
 [K+'ans2']:(p,ctx)=>{
  const {b,e,a1}=W2(ctx),l1=seg(p,.03,.1),l2=seg(p,a1*.45,a1*.55),l3=seg(p,a1*.75,a1*.85);
  let s=pendMarks(0,{h:.5,ang:0})+pend(0,{vel:-120,velLab:l3>.5?'3.0 m/s':''});
  s+=fade(1-l1,bars(0,2.25,{total:1}));
  s+=panel(90,320,T(`\\tfrac{1}{2}\\times0.5\\times${cV('v')}^2=2.25`,PC,160,40)+fade(l2,T(`${cV('v')}^2=9`,PC,245,40))+fade(l3,T(`${cV('v')}=3.0\\ \\mathrm{m/s}`,PC,330,44)),l1,C.v);
  s+=pauseBadge({x:560});
  return s+goalTag(G2)+ANS2(seg(p,b+.4*(e-b),b+.4*(e-b)+.05));
 },
 // 10. 誤答 A（0 m/s）。2026-10-16 点検PQ-018 で2 cue に分けた。
 //   10a（wrongA2）：映像を止めたまま真下。文1 で誤答カード、文2 で力を「接線の向き：0」「中心向き：あり」に分けて示す
 //   （真下では糸の力 10 N ＞ mg 5 N。差 5 N ＝ mv²/L＝0.5×9/0.9 が中心向き。図の矢印の長さは 2:1 の目安）。
 [K+'wrongA2']:(p,ctx)=>{
  const {b}=W2(ctx),k=seg(p,b,b+.06),[bx,by]=bobXY(0);
  let s=pendMarks(0,{h:.5,ang:0,u0:1-k});
  s+=k<.5?pend(0,{vel:-120}):pend(0,{tens:k,grav:.9*k});
  s+=fade(seg(p,b+.04,b+.12),line(bx-150,by,bx+150,by,{color:C.dim,w:2.5,dash:'8 7'})+label('接線',bx+156,by+8,{size:24,color:C.dim,weight:700})
   +label('0',bx-110,by-14,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.18,b+.26),arrow(bx+46,by-6,bx+46,by-60,{color:C.F,w:7,head:18})+label('中心向き',bx+60,by-36,{size:24,color:C.F,weight:700}));
  s+=pauseBadge({x:450,y:458});
  s+=wrongCard('A','0 m/s','戻す力 0 ≠ 速さ 0',{...WOPT,y:86,g:seg(p,.02,.08)});
  s+=panel(210,190,label('真下を 通る 瞬間の 力',PC,250,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,b+.04,b+.12),label('接線の 向き：0',PC,305,{size:30,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,b+.18,b+.26),label('中心 向き：あり',PC,355,{size:30,color:C.F,anchor:'middle',weight:700})+label('（糸の力 ＞ mg）',PC,390,{size:22,color:C.dim,anchor:'middle'})),seg(p,b,b+.06),C.faint);
  return s+goalTag(G2)+ANS2(1);
 },
 // 10b（wrongA2b）：動きを戻し、おもりは真下を通り過ぎて反対側の同じ高さで一瞬止まる（実時間）
 [K+'wrongA2b']:(p,ctx)=>{
  const t0=cueT(ctx),t=Math.max(0,t0-HOLD_A2B),th=thAt(TB+t),om=t<=0?-1:omAt(TB+t);
  const vpx=Math.sign(om)*vOf(th)*40;
  let s=pendMarks(th,{h:.5,ang:0,hLeft:seg(p,.1,.2)})+pend(th,{vel:vpx});
  s+=fade(clamp(t0/.3)*(1-clamp((t0-HOLD_A2B)/.3)),label('速さは 最大',330,430,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=bars(Uof(th),Kof(th),{total:1,nums:0});
  s+=wrongCard('A','0 m/s','戻す力 0 ≠ 速さ 0',{...WOPT,y:86});
  return s+LEG(1)+goalTag(G2)+ANS2(1);
 },
 // 11. 誤答 B → C（一枚ずつ）。振り子はそのまま揺れ続ける（実時間）。右に式
 [K+'wrongBC2']:(p,ctx)=>{
  const t=tAt(ctx,K+'wrongA2b')-HOLD_A2B,th=thAt(TB+Math.max(0,t)),om=omAt(TB+Math.max(0,t)),vpx=Math.sign(om)*vOf(th)*40;
  let s=pendMarks(th,{h:.5,ang:0})+pend(th,{vel:vpx});
  s+=panel(86,230,T(`\\tfrac{1}{2}\\times0.5\\times${cV('v')}^2=2.25`,PC,140,34)+T(`${cV('v')}^2=9`,PC,210,34)+T(`${cV('v')}=3.0\\ \\mathrm{m/s}`,PC,275,36),1,C.faint);
  s+=wrongSeq(p,ctx,[['B','約 2.1 m/s','½ を 落とした（v² ＝ 4.5）'],['C','9.0 m/s','v² ＝ 9 のまま（単位 m²/s²）']],{opts:{...WOPT,y:330}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 12. 出題中の小問3の図（2つの振り子）。札「求めるもの：周期は何倍か」
 [K+'goal3']:(p)=>{
  let s=twoPend(A3,A3);
  s+=panel(90,250,label('小問3',PC,140,{size:28,color:C.dim,anchor:'middle'})+label('糸 ×4、質量 ×2 で',PC,205,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('周期は 元の 何倍？',PC,265,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（小さく 揺らす）',PC,310,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 13. 記号を先に図の上へ（L・g・T）→「近似」タグと T≈2π√(L/g)、札「小さく揺らすとき」、「導き方は中級」
 [K+'formula']:(p,ctx)=>{
  const {b}=W2(ctx);
  let s=twoPend(A3,A3,{tags:.35,sym:1,symL:seg(p,.03,.08),symG:seg(p,.08,.13),symT:seg(p,.13,.18)});
  s+=panel(90,330,kindTag('近似',PC,140,{g:seg(p,.2,.26)})+fade(seg(p,.22,.3),T(TF,PC,235,52))
   +fade(seg(p,.3,.38),rect(PX+110,300,280,44,{fill:C.E,fo:.12,stroke:C.E,sw:2,rx:22})+label('小さく 揺らすとき',PC,331,{size:24,color:C.E,anchor:'middle',weight:700}))
   +fade(seg(p,.4,.48),label('振幅に よらない',PC,385,{size:26,color:C.ink,anchor:'middle',weight:700})),seg(p,.18,.24),C.E);
  s+=fade(seg(p,b+.02,b+.1),rect(PX+150,432,200,40,{fill:'#2a3346',fo:.9,stroke:C.dim,sw:2,rx:20})+label('導き方は 中級',PC,460,{size:22,color:C.dim,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 14. L に ×4、√ の外へ ×2。2つを実時間で揺らし（周期 約 1.9 s と 約 3.8 s）、周期の時計（金）に「2倍」
 [K+'long']:(p,ctx)=>{
  const {b}=W2(ctx),t=cueT(ctx);
  let s=twoPend(A3*Math.cos(WS*t),A3*Math.cos(WL*t),{tags:.6,small:0});
  s+=clock(90,300,44,t,TS,{txt:'周期 T'})+clock(620,300,44,t,TL,{txt:'周期 2T'});
  s+=panel(90,330,T(`${cT('T')}\\approx2\\pi\\sqrt{\\dfrac{{\\color{${C.hi}}4}${cX('L')}}{${cF('g')}}}`,PC,148,30)
   +fade(seg(p,.12,.22),T(`=2\\pi\\times{\\color{${C.hi}}\\sqrt{4}}\\sqrt{\\dfrac{${cX('L')}}{${cF('g')}}}`,PC,262,30))
   +fade(seg(p,.25,.35),T(`={\\color{${C.hi}}2}\\times2\\pi\\sqrt{\\dfrac{${cX('L')}}{${cF('g')}}}`,PC,374,30)),1,C.x);
  s+=fade(seg(p,.35,.45),label('周期 2倍',PC,470,{size:32,color:CT,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.08),label('長い 振り子ほど ゆっくり',345,490,{size:24,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 15. 同じ長さで、軽いおもり（m）と重いおもり（2m）を並べて同じリズムで揺らす。重力 ×2 と 動かしにくさ ×2 を打ち消す
 [K+'mass']:(p,ctx)=>{
  const {b}=W2(ctx),t=cueT(ctx),th=.25*Math.cos(WS*t),P1={cx:170,py:100,Lp:220},P2={cx:470,py:100,Lp:220};
  let s=pend(th,{...P1,R:18,thMax:.25,grav:seg(p,b,b+.06),gravLab:'mg',mtext:'m'})+pend(th,{...P2,R:26,thMax:.25,bobColor:C.hi,bobFill:'#3a3418',grav:2*seg(p,b,b+.06),gravLab:'2mg',mtext:'2m'});
  const [x2,y2]=bobXY(th,P2);
  s+=label('同じ 長さ',320,470,{size:26,color:C.x,anchor:'middle',weight:700});
  s+=fade(seg(p,b+.12,b+.2),label('動かしにくさ ×2',x2-34,y2-40,{size:24,color:C.hi,anchor:'end',weight:700}));
  const st=seg(p,b+.45,b+.55);
  s+=panel(90,330,T(TF,PC,170,44)+fade(seg(p,.05,.15),label('式に 質量 m が ない',PC,265,{size:26,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,b+.05,b+.12),label('重力',PX+130,330,{size:26,color:C.F,anchor:'middle',weight:700})+label('×2',PX+130,370,{size:30,color:C.F,anchor:'middle',weight:700}))
   +fade(seg(p,b+.15,b+.22),label('動かしにくさ',PX+360,330,{size:26,color:C.hi,anchor:'middle',weight:700})+label('×2',PX+360,370,{size:30,color:C.hi,anchor:'middle',weight:700}))
   +fade(st,line(PX+105,375,PX+155,345,{color:CD,w:4})+line(PX+335,375,PX+385,345,{color:CD,w:4})+label('打ち消し合う',PC,405,{size:26,color:C.ink,anchor:'middle',weight:700})),1,C.faint);
  return s+goalTag(G3);
 },
 // 16. 「糸 ×4 → ×2」「質量 ×2 → ×1」をかけて「×2」。答えの札
 [K+'ans3']:(p,ctx)=>{
  const {b,e}=W2(ctx);
  let s=twoPend(A3,A3,{small:0});
  s+=panel(90,340,T(TF,PC,150,40)
   +fade(seg(p,.05,.15),label('糸 ×4　→　周期 ×2',PC,245,{size:30,color:C.x,anchor:'middle',weight:700}))
   +fade(seg(p,.18,.28),label('質量 ×2　→　周期 ×1',PC,300,{size:30,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.32,.42),line(PX+60,330,PX+PW-60,330,{color:C.dim,w:2})+label('全体で　×2',PC,385,{size:34,color:CT,anchor:'middle',weight:700})),1,CT);
  return s+goalTag(G3)+ANS3(seg(p,b+.4*(e-b),b+.4*(e-b)+.05));
 },
 // 17. 誤答 B → C → D を一枚ずつ（B・C は文1 を半分ずつ、D は文2）
 [K+'wrong3']:(p,ctx)=>{
  const {b,a1}=W2(ctx),m=a1*.5;
  let s=twoPend(A3,A3,{small:0});
  s+=panel(86,190,T(TF,PC,140,36)+label('糸 ×4 → ×2、質量 → ×1',PC,240,{size:26,color:C.ink,anchor:'middle',weight:700}),1,C.faint);
  s+=wrongSeq(p,ctx,[['B','4 倍','√ を 落とした'],['C','8 倍','4×2 と 質量も 掛けた'],['D','2√2 倍','質量も √ の 中に 入れた']],{win:[[0,m],[m,a1],[b,1]],opts:{...WOPT,y:300}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 18. ばね（F＝−2.0 N 左向き）、振り子の棒（2.25 J → 3.0 m/s）、2つの振り子（T∝√L、2倍）を並べ、札でつなぐ。答えの札3枚
 [K+'sum']:(p)=>{
  const xs=[20,413,806],w=374,y0=110,h=390,gs=[seg(p,.02,.12),seg(p,.15,.25),seg(p,.28,.38)];
  const tags=[['戻す力',C.F],['K＋U 一定',C.hi],['小さな振れの周期',CT]];
  let s='';
  xs.forEach((x,i)=>{s+=card(x,y0,w,h,label(tags[i][0],x+w/2,y0+40,{size:26,color:tags[i][1],anchor:'middle',weight:700}),gs[i],tags[i][1]);});
  // 1：ばね
  s+=fade(gs[0],`<svg x="${xs[0]}" y="${y0+60}" width="${w}" height="210" viewBox="20 120 660 370" overflow="hidden">${springFig(.04,{F:.04*FPX,Flab:'',zero:0,kTag:0,axis:0,disp:1,dispLab:0,mtext:''})}</svg>`
   +T(`${cF('F')}=-2.0\\ \\mathrm{N}`,xs[0]+w/2,y0+305,34)+label('左向き（ずれと 逆）',xs[0]+w/2,y0+360,{size:24,color:C.ink,anchor:'middle'}));
  // 2：振り子の棒
  s+=fade(gs[1],bars(0,2.25,{x:xs[1]+60,y:y0+260,sc:60,total:0,nums:0})+bars(2.25,0,{x:xs[1]+60,y:y0+260,sc:60,total:0,nums:0,g:.35})
   +label('U 2.25 J → K 2.25 J',xs[1]+w/2,y0+330,{size:24,color:C.ink,anchor:'middle',weight:700})+T(`${cV('v')}=3.0\\ \\mathrm{m/s}`,xs[1]+w/2,y0+368,30));
  // 3：2つの振り子
  s+=fade(gs[2],`<svg x="${xs[2]}" y="${y0+55}" width="${w}" height="235" viewBox="40 80 600 380" overflow="hidden">${twoPend(A3,A3,{tags:0,small:0,mt:0})}</svg>`
   +T(`${cT('T')}\\propto\\sqrt{${cX('L')}}`,xs[2]+w/2,y0+315,32)+label('2倍・質量に よらない',xs[2]+w/2,y0+365,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=answerRow([[1,'B',''],[2,'D','3.0 m/s'],[3,'A','2 倍']],{g:seg(p,.8,.9)});
  return s;
 },
};
