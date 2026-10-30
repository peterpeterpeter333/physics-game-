// YouTube シリーズ「剛体の回転・中級 1/2」(ys-um-rotation-1) — 図。Stage 1200×515.
// 色：r 水色、v 紫、a・α 赤、F 緑、トルク N 桃、ω 桃、L 黄、m・I 白、強調 黄、誤り 赤。
// 上から見た図は、数学の角度 φ（反時計回りが正）で描く：点 (ax＋r cosφ, ay−r sinφ)。
//   反時計回りの接線の向き（画面）＝(−sinφ, −cosφ)。F_t はこの向き → N＝rF_t は正（反時計回り）。
// 数値：2 kg、1 m、6 N → a_t＝3 m/s²、α＝3 rad/s²。I＝2、N＝6 → α＝3。棒 3 kg・2 m・端 → I＝4、α＝1.5。
// 斜めの棒（範囲の外）：軸 z 上向き、棒の向き u＝(sinβ, cosβ)、両端に m → 𝐋 ∝ (−cosβ, sinβ)（棒に直角）。β＝50° で左上へ傾く。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth,poly,ground} from './anim.mjs';

const K='um-rotation-1:';
const CR=C.x,CV=C.v,CA=C.a,CF=C.F,CN=C.p,CW=C.p,CL=C.hi,CH=C.hi,CD=C.dim,CM=C.m,WOOD='#b99b73';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const col=(c,s)=>`{\\color{${c}}{${s}}}`;
const RR=col(CR,'r'),VV=col(CV,'v'),AL=col(CA,'\\alpha'),AA=col(CA,'a'),AT=col(CA,'a_t'),FF=col(CF,'F'),FT=col(CF,'F_t'),NN=col(CN,'N'),WW=col(CW,'\\omega'),LL=col(CL,'L'),PP=col(C.p,'p');
const RI2=col(CR,'r_i^2'),NI=col(CN,'N_i');
const U=s=>`\\,\\mathrm{${s}}`;
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:CF,weight:700,anchor:'middle'}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:CA,weight:700,anchor:'middle'}));

// ---- geometry --------------------------------------------------------------------------------------
const PT=(ax,ay,r,phi)=>[ax+r*Math.cos(phi),ay-r*Math.sin(phi)];
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
// curved arrow (math angles, a1>a0 = counter-clockwise)
function turnArc(cx,cy,r,a0,a1,{color=CW,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=circPts(cx,cy,r,a0,a1,30),[x1,y1]=pts[29],[x2,y2]=pts[30],a=Math.atan2(y2-y1,x2-x1),Lh=15;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-Lh*Math.cos(a)+Lh*.55*Math.sin(a)},${y2-Lh*Math.sin(a)-Lh*.55*Math.cos(a)} ${x2-Lh*Math.cos(a)-Lh*.55*Math.sin(a)},${y2-Lh*Math.sin(a)+Lh*.55*Math.cos(a)}" fill="${color}"/>`;
 return fade(g,draw(pts,1,{color,w})+head);
}
const axisMark=(x,y,lbl=0)=>ring(x,y,12,{color:C.ink,w:3,fill:C.bg})+dot(x,y,4,C.ink)+(lbl?label('軸',x-20,y+8,{size:24,color:CD,anchor:'end'}):'');
const ball=(x,y,r=24,t='',size=20)=>ring(x,y,r,{color:C.ink,w:3,fill:'#2a3550'})+(t?label(t,x,y+7,{size,color:C.ink,anchor:'middle',weight:700}):'');

// door seen from above: hinge (hx,hy), angle phi (CCW), width Lp px
function door(phi,{hx=200,hy=380,Lp=320,g=1,push=0,fTxt='F',heavy=0,omega=0}={}){
 const [ex,ey]=PT(hx,hy,Lp,phi);
 let s=fade(.35,line(hx,hy,hx+Lp+20,hy,{color:CD,w:2,dash:'8 8'}));
 s+=line(hx,hy,ex,ey,{color:heavy?'#8a6f4c':WOOD,w:heavy?24:16,cap:'butt'});
 s+=axisMark(hx,hy);
 if(push>0){const tx=-Math.sin(phi),ty=-Math.cos(phi),bx=ex-tx*10,by=ey-ty*10;
  s+=fade(push,arrow(bx-tx*95,by-ty*95,bx,by,{color:CF,w:6,head:16})+label(fTxt,bx-tx*95-26,by-ty*95+8,{size:28,color:CF,weight:700,anchor:'middle'}));}
 if(omega>0)s+=turnArc(hx,hy,80,phi+.15,phi+1.0,{color:CW,g:omega});
 return fade(g,s);
}

// light rod + ball seen from above. phi = CCW angle.
function ballRod(phi,{ax=240,ay=300,rp=170,m='m',g=1,ft=0,ftTxt='F_t',rad=0,varr=0,vTxt='v',rTxt='r',omega=0}={}){
 const [bx,by]=PT(ax,ay,rp,phi),tx=-Math.sin(phi),ty=-Math.cos(phi);
 let s=fade(.3,ring(ax,ay,rp,{color:CD,w:2,dash:'6 8'}));
 s+=line(ax,ay,bx,by,{color:WOOD,w:6});
 if(rTxt)s+=label(rTxt,(ax+bx)/2-18*Math.sin(phi),(ay+by)/2-18*Math.cos(phi)+8,{size:28,color:CR,anchor:'middle',weight:700});
 s+=ball(bx,by,m.length>1?32:24,m,m.length>1?18:22);
 // outward unit (screen) from the axis to the ball
 const ox=(bx-ax)/rp,oy=(by-ay)/rp;
 if(ft>0){const sx=bx+ox*30,sy=by+oy*30;s+=fade(ft,line(bx,by,sx,sy,{color:CF,w:2,dash:'4 4'})+arrow(sx,sy,sx+tx*130,sy+ty*130,{color:CF,w:6,head:16})+T(col(CF,ftTxt),sx+tx*130+ox*34,sy+ty*130+oy*34+8,{size:32}));}
 if(varr>0){const sx=bx-ox*34,sy=by-oy*34;s+=fade(varr,arrow(sx,sy,sx+tx*95,sy+ty*95,{color:CV,w:5,head:14})+label(vTxt,sx+tx*95-ox*26,sy+ty*95-oy*26+8,{size:28,color:CV,weight:700,anchor:'middle'}));}
 if(rad>0){const ux=(ax-bx)/rp,uy=(ay-by)/rp;s+=fade(rad,arrow(bx+ux*26,by+uy*26,bx+ux*90,by+uy*90,{color:'#4fae8a',w:5,head:14}));}
 if(omega>0)s+=turnArc(ax,ay,50,phi-1.2,phi-.25,{color:CW,g:omega});
 s+=axisMark(ax,ay);
 return fade(g,s);
}

// plate made of small point masses seen from above, rotating about the axis (ax,ay)
const BODY=(()=>{const pts=[];for(let i=-4;i<=4;i++)for(let j=-3;j<=3;j++){const x=i*.28,y=j*.28;if((x/1.2)**2+(y/.85)**2<=1)pts.push([x+.35,y+.1]);}return pts;})();
function plate(phi,{ax=260,ay=280,ppm=150,g=1,hl=[],dots=1}={}){
 const P=([x,y])=>{const c=Math.cos(phi),s=Math.sin(phi);return [ax+ppm*(x*c-y*s),ay-ppm*(x*s+y*c)];};
 const e=[];for(let k=0;k<=48;k++){const a=2*Math.PI*k/48;e.push(P([.35+1.32*Math.cos(a),.1+.97*Math.sin(a)]));}
 let s=poly(e,{fill:'#1b2946',fo:.9,stroke:CD,sw:2});
 if(dots)for(const q of BODY){const [x,y]=P(q);s+=dot(x,y,5,'#8fa6cf');}
 for(const [idx,t] of hl){const [x,y]=P(BODY[idx]);s+=line(ax,ay,x,y,{color:CR,w:3,dash:'7 6'})+dot(x,y,9,CH)+(t?label(t,(ax+x)/2,(ay+y)/2-14,{size:26,color:CR,weight:700,anchor:'middle'}):'');}
 s+=axisMark(ax,ay);
 return fade(g,s);
}
const plateP=(phi,idx,{ax=260,ay=280,ppm=150}={})=>{const [x,y]=BODY[idx],c=Math.cos(phi),s=Math.sin(phi);return [ax+ppm*(x*c-y*s),ay-ppm*(x*s+y*c)];};

export const ytUmRotation1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const X0=120,W=560,Y=250,n=Math.round(mix(4,20,seg(p,.1,.5)));
  let s=rect(X0,Y-16,W,32,{fill:WOOD,fo:.85,stroke:'#8a6f4c',rx:6})+axisMark(X0,Y);
  for(let k=1;k<n;k++)s+=line(X0+W*k/n,Y-24,X0+W*k/n,Y+24,{color:C.bg,w:2});
  s+=fade(seg(p,.35,.5),rect(X0+W*.62,Y-18,W/n,36,{fill:CH,fo:.35,stroke:CH,rx:3})+label('dm',X0+W*.62+W/n/2,Y-34,{size:26,color:CH,anchor:'middle',weight:700}));
  s+=card(760,90,400,300,L('前回（慣性モーメント・中級）',960,140,{size:24,color:CD})
   +T(`I=\\sum_i m_i${RI2}`,960,215,{size:40})
   +fade(seg(p,.45,.6),T(`\\downarrow`,960,265,{size:30,color:CH})+T(`I=\\int ${col(CR,'r')}^2\\,dm`,960,330,{size:44})),seg(p,0,.15));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=card(170,50,860,330,L('前回の 最後の 問い',600,105,{size:26,color:CD})
   +L('I が 分かった。 では、',600,175,{size:32,weight:700})
   +fade(seg(p,.3,.45),L('トルクを 加えると、',600,240,{size:32,color:CN,weight:700}))
   +fade(seg(p,.5,.65),L('回転の 速さは どれだけの 割合で 変わる？',600,310,{size:32,color:CH,weight:700})),seg(p,0,.12),CH);
  return s;
 },
 [K+'door']:(p)=>{
  const u=seg(p,.15,1);
  let s=L('上から 見た ドア',600,40,{size:24,color:CD});
  s+=door(1.1*u*u,{hx:120,hy:420,Lp:330,push:seg(p,.05,.2),omega:seg(p,.2,.35)});
  s+=door(.45*u*u,{hx:700,hy:420,Lp:330,push:seg(p,.05,.2),heavy:1});
  s+=fade(seg(p,.5,.65),L('回しやすい',290,480,{size:28,color:C.ink})+L('回しにくい',860,480,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.6,.75),card(830,90,340,100,L('同じ 力 → ゆっくり',1000,150,{size:28,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'line']:(p)=>{
  const u=seg(p,.1,1),x1=150+140*u*u,x2=150+60*u*u;
  let s=ground(60,620,210)+ground(60,620,450);
  s+=rect(x1-50,130,100,80,{fill:CM,fo:.15,stroke:C.ink,rx:8})+label('m',x1,180,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=arrow(x1-150,170,x1-52,170,{color:CF,w:6,head:16})+label('F',x1-160,160,{size:28,color:CF,weight:700,anchor:'end'});
  s+=fade(seg(p,.35,.5),rect(x2-70,340,140,110,{fill:CM,fo:.3,stroke:C.ink,rx:8})+label('大きい m',x2,405,{size:26,color:C.ink,anchor:'middle',weight:700})
   +arrow(x2-170,395,x2-72,395,{color:CF,w:6,head:16})+label('F',x2-180,385,{size:28,color:CF,weight:700,anchor:'end'}));
  s+=card(720,100,420,280,T(`${col(CM,'m')}\\,${AA}=${FF}`,930,190,{size:60})
   +fade(seg(p,.35,.5),L('力 → 加速度',930,270,{size:28,color:CA}))
   +fade(seg(p,.55,.7),L('m が 大きいほど a は 小さい',930,330,{size:26,color:CH,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=fade(.4,door(.15,{hx:90,hy:470,Lp:250,push:1}));
  s+=card(250,50,880,300,L('今回の 問い',690,105,{size:26,color:CD})
   +T(`${col(CM,'I')}\\,${AL}=${NN}`,690,190,{size:60})
   +L('なぜ ma＝F と 同じ 形？',690,290,{size:34,color:CH,weight:700}),seg(p,0,.12),CH);
  return s;
 },

 // ===== S2 1本の式で表せる範囲 =====
 [K+'fixed']:(p)=>{
  let s=door(.25+.6*seg(p,.1,.9),{hx:160,hy:400,Lp:330});
  s+=fade(seg(p,.05,.2),label('固定した 軸',180,470,{size:26,color:CH,weight:700}));
  s+=fade(seg(p,.45,.6),turnArc(900,260,90,-.6,2.2,{color:CH,w:5})+L('＋',900,272,{size:52,color:CH,weight:700})+L('反時計回りを 正',900,410,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.4,.55),L('上から 見る',900,90,{size:26,color:CD}));
  return s;
 },
 [K+'alpha']:(p)=>{
  let s=door(.85+.3*seg(p,0,1),{hx:160,hy:400,Lp:330,omega:1});
  s+=card(640,70,500,330,T(`${AL}=\\dfrac{d${WW}}{dt}`,890,170,{size:56})
   +fade(seg(p,.2,.35),L('角速度 ω が 変わる 割合',890,270,{size:28,color:CA,weight:700}))
   +fade(seg(p,.55,.7),L('単位 rad/s²',890,340,{size:28,color:CD})),seg(p,0,.12),CA);
  return s;
 },
 [K+'range']:(p)=>{
  let s=card(40,30,540,420,L('固定した 軸',310,80,{size:28,weight:700}),seg(p,0,.15),CF);
  const ph=.4+1.4*seg(p,0,1);
  s+=fade(seg(p,0,.15),ring(310,280,120,{color:CD,w:5,fill:'#141d33'})+line(310,280,310+120*Math.cos(ph),280-120*Math.sin(ph),{color:C.ink,w:4})+axisMark(310,280)+turnArc(310,280,150,.2,1.3,{color:CW})+ok(530,80));
  s+=card(620,30,540,420,L('対称な 物体の 平面の 運動',890,80,{size:28,weight:700}),seg(p,.4,.55),CF);
  const cx=740+260*seg(p,.45,1),R=70,rot=(cx-740)/R;
  s+=fade(seg(p,.4,.55),ground(650,1130,400)+ring(cx,400-R,R,{color:CD,w:5,fill:'#141d33'})+line(cx,400-R,cx+R*.9*Math.cos(rot+Math.PI/2),400-R+R*.9*Math.sin(rot+Math.PI/2),{color:C.ink,w:4})+dot(cx,400-R,6,C.ink)+ok(1110,80));
  s+=fade(seg(p,.7,.85),L('1本の 式で 表せる',600,495,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'out']:(p)=>{
  // side view: vertical axle, rod tilted by beta from the axle, balls at both ends
  const cx=360,cy=270,a=150,b=50*Math.PI/180,ph=2*Math.PI*.6*p,ux=Math.sin(b)*Math.cos(ph),uy=Math.cos(b);
  let s=line(cx,60,cx,480,{color:CD,w:5});
  const x1=cx+a*ux,y1=cy-a*uy,x2=cx-a*ux,y2=cy+a*uy;
  s+=line(x1,y1,x2,y2,{color:WOOD,w:7})+dot(x1,y1,18,'#8fa6cf')+dot(x2,y2,18,'#8fa6cf')+dot(cx,cy,6,C.ink);
  s+=fade(seg(p,.15,.3),arrow(cx-22,cy-40,cx-22,cy-190,{color:CW,w:6,head:16})+label('ω の 軸',cx-36,cy-170,{size:26,color:CW,weight:700,anchor:'end'}));
  // L ⟂ rod, in the plane of axle and rod
  const lx=-Math.cos(b)*Math.cos(ph),ly=Math.sin(b);
  s+=fade(seg(p,.35,.5),arrow(cx,cy,cx+170*lx,cy-170*ly,{color:CL,w:6,head:16})+label('回転の 勢い L',cx+170*lx+(lx<0?-14:14),cy-170*ly+8,{size:26,color:CL,weight:700,anchor:lx<0?'end':'start'}));
  s+=card(720,90,440,300,L('斜めに 付いた 棒',940,145,{size:28,weight:700})
   +L('L の 向きが 軸と ずれる',940,215,{size:28,color:CL})
   +L('1本の 式では 足りない',940,285,{size:28,color:CA,weight:700})
   +L('（この 回の 範囲の 外）',940,345,{size:24,color:CD}),seg(p,.5,.65),CA);
  s+=ng(1120,130,seg(p,.6,.7));
  return s;
 },

 // ===== S3 1個の玉で確かめる =====
 [K+'ball']:(p)=>{
  const ph=.1+.8*seg(p,0,1);
  let s=ballRod(ph,{ax:300,ay:330,rp:170,rTxt:seg(p,.4,.55)>.5?'r':''});
  s+=fade(seg(p,.05,.2),label('上から 見た 図',30,40,{size:24,color:CD}));
  s+=card(760,110,380,220,L('軽い 棒 ＋ 玉',950,170,{size:28,weight:700})+L('質量 m',950,230,{size:28,color:CM})+L('半径 r の 円',950,285,{size:28,color:CR}),seg(p,.2,.35));
  return s;
 },
 [K+'push']:(p)=>{
  const ph=.9;
  let s=ballRod(ph,{ax:300,ay:330,rp:170,ft:seg(p,.1,.3)});
  s+=card(760,110,380,220,L('接線の 向きに 押す',950,170,{size:28,color:CF,weight:700})+T(`${FT}`,950,245,{size:48})+L('t ＝ 接線の 向きの 成分',950,300,{size:24,color:CD}),seg(p,.3,.45),CF);
  return s;
 },
 [K+'radial']:(p)=>{
  const ph=.9;
  let s=ballRod(ph,{ax:300,ay:330,rp:170,ft:1,rad:seg(p,.05,.2),varr:seg(p,.3,.45)});
  s+=card(760,70,400,160,L('棒の 力（半径の 向き）',960,125,{size:26,color:'#4fae8a',weight:700})+L('進む 向きを 曲げるだけ',960,185,{size:26}),seg(p,.1,.25),'#4fae8a');
  s+=card(760,270,400,160,L('速さを 変えるのは',960,325,{size:26})+L('接線の 向きの 力',960,385,{size:28,color:CF,weight:700}),seg(p,.55,.7),CF);
  return s;
 },
 [K+'eqt']:(p)=>{
  let s=ballRod(.9,{ax:220,ay:330,rp:150,ft:1,varr:1});
  s+=T(`m\\,${AT}=${FT}`,800,100,{size:56});
  s+=fade(seg(p,.4,.55),T(AT,640,205,{size:40})+label('＝ 円に 沿った 速さ v が 変わる 割合',675,214,{size:26,color:CA}));
  return s;
 },
 [K+'at']:(p)=>{
  let s=ballRod(.9,{ax:220,ay:330,rp:150,ft:1,varr:1});
  s+=T(`m\\,${AT}=${FT}`,800,100,{size:56,color:CD});
  s+=fade(seg(p,.05,.2),T(`${VV}=${RR}${WW}`,660,210,{size:44}));
  s+=fade(seg(p,.3,.45),arrow(760,210,860,210,{color:CH,w:4,head:14})+label('r 一定で 微分',810,190,{size:22,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),T(`${AT}=${RR}${AL}`,970,210,{size:44}));
  return s;
 },
 [K+'mulr']:(p)=>{
  let s=ballRod(.9,{ax:220,ay:330,rp:150,ft:1,varr:1});
  s+=T(`m\\,${AT}=${FT}`,800,100,{size:56,color:CD});
  s+=T(`${AT}=${RR}${AL}`,970,210,{size:36,color:CD});
  s+=fade(seg(p,.05,.2),T(`m\\,${RR}${AL}=${FT}`,760,300,{size:52}));
  s+=fade(seg(p,.45,.6),T(`\\times ${RR}`,1060,300,{size:44,color:CH})+highlight(540,255,600,90,1));
  return s;
 },
 [K+'iaN']:(p)=>{
  let s=ballRod(.9,{ax:220,ay:330,rp:150,ft:1,varr:1});
  s+=T(`m\\,${RR}^2${AL}=${RR}${FT}`,800,110,{size:54});
  s+=fade(seg(p,.1,.25),brace(855,1000,160,{color:CN})+T(`=${NN}`,930,215,{size:44})+L('トルク',930,265,{size:24,color:CN}));
  s+=fade(seg(p,.4,.55),brace(610,730,160,{color:C.ink})+T(`=I`,670,215,{size:44})+L('玉 1個の I',670,265,{size:24}));
  s+=fade(seg(p,.65,.8),card(600,320,400,120,T(`I\\,${AL}=${NN}`,800,382,{size:60}),1,CH));
  return s;
 },
 [K+'num']:(p)=>{
  let s=ballRod(.9,{ax:220,ay:330,rp:150,ft:1,m:'2 kg',rTxt:'1 m',ftTxt:'6\\,\\mathrm N'});
  s+=card(560,60,600,140,T(`m=2${U('kg')},\\ \\ ${RR}=1${U('m')},\\ \\ ${FT}=6${U('N')}`,860,135,{size:38}),seg(p,0,.15));
  s+=fade(seg(p,.35,.5),T(`${AT}=\\dfrac{6}{2}=3${U('m/s^2')}`,860,270,{size:44}));
  s+=fade(seg(p,.65,.8),T(`${AL}=\\dfrac{${AT}}{${RR}}=3${U('rad/s^2')}`,860,390,{size:44}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=ballRod(.9,{ax:220,ay:330,rp:150,ft:1,m:'2 kg',rTxt:'1 m',ftTxt:'6\\,\\mathrm N'});
  s+=card(560,60,600,140,T(`m=2${U('kg')},\\ \\ ${RR}=1${U('m')},\\ \\ ${FT}=6${U('N')}`,860,135,{size:38}),1);
  s+=fade(seg(p,.05,.2),T(`I=2\\times1^2=2${U('kg\\cdot m^2')}`,860,250,{size:36}));
  s+=fade(seg(p,.25,.4),T(`${NN}=1\\times6=6${U('N\\cdot m')}`,860,320,{size:36}));
  s+=fade(seg(p,.45,.6),T(`${AL}=\\dfrac{6}{2}=3${U('rad/s^2')}`,860,410,{size:40}));
  s+=ok(1110,410,seg(p,.7,.8));
  return s;
 },
 [K+'dLdt']:(p)=>{
  let s=ballRod(.9,{ax:220,ay:330,rp:150,varr:1,omega:1});
  s+=T(`${LL}=m\\,${RR}${VV}`,720,90,{size:48});
  s+=fade(seg(p,.15,.3),L('円運動：r と v が 直角',720,170,{size:24,color:CD}));
  s+=fade(seg(p,.45,.6),T(`${VV}=${RR}${WW}`,1040,90,{size:36,color:CV}));
  s+=fade(seg(p,.6,.75),T(`${LL}=m\\,${RR}^2${WW}`,720,260,{size:52})+highlight(560,215,320,90,1));
  return s;
 },
 [K+'dLdt2']:(p)=>{
  let s=ballRod(.9,{ax:220,ay:330,rp:150,varr:1,omega:1});
  s+=T(`${LL}=m\\,${RR}^2${WW}`,800,80,{size:46,color:CD});
  s+=fade(seg(p,.05,.2),arrow(800,120,800,170,{color:CH,w:4,head:14})+label('時間で 微分',820,155,{size:24,color:CH}));
  const src=`\\dfrac{d${LL}}{dt}=m\\,${RR}^2${AL}`,w=texWidth(src,48,false),x0=800-w/2-40;
  s+=fade(seg(p,.15,.3),T(src,x0,235,{size:48,anchor:'start'}));
  s+=fade(seg(p,.35,.5),T(`=${NN}`,x0+w+14,235,{size:48,anchor:'start'}));
  s+=fade(seg(p,.6,.75),card(590,320,420,150,T(`\\dfrac{d${LL}}{dt}=${NN}`,800,397,{size:50}),1,CL));
  return s;
 },
 [K+'dpdt']:(p)=>{
  let s=card(80,80,480,300,L('運動量',320,135,{size:28,color:C.p,weight:700})+T(`\\dfrac{d${PP}}{dt}=${FF}`,320,245,{size:60})+L('力が p を 変える',320,340,{size:26}),1);
  s+=card(640,80,480,300,L('角運動量',880,135,{size:28,color:CL,weight:700})+T(`\\dfrac{d${LL}}{dt}=${NN}`,880,245,{size:60})+L('トルクが L を 変える',880,340,{size:26}),seg(p,.15,.3),CL);
  s+=fade(seg(p,.2,.35),L('↔',600,250,{size:40,color:CD}));
  s+=fade(seg(p,.55,.7),L('角運動量・中級で 予告した 式',600,450,{size:28,color:CH,weight:700}));
  return s;
 },

 // ===== S4 剛体は質点の集まり =====
 [K+'body']:(p)=>{
  const ph=.2+1.1*seg(p,.05,1);
  let s=plate(ph);
  s+=fade(seg(p,.1,.25),turnArc(260,280,230,ph+.6,ph+1.4,{color:CW}));
  s+=card(700,80,440,280,L('剛体 ＝ 形の 変わらない 物体',920,140,{size:26,weight:700})
   +fade(seg(p,.45,.6),L('どの 点も',920,215,{size:28})+L('同じ ω、 同じ α',920,275,{size:32,color:CH,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'each']:(p)=>{
  const ph=1.3;
  let s=plate(ph,{hl:[[40,'rᵢ']]});
  s+=fade(seg(p,.1,.25),label('mᵢ',plateP(ph,40)[0]+18,plateP(ph,40)[1]+10,{size:28,color:CM,weight:700}));
  s+=card(640,80,520,300,L('i 番目の 点',900,140,{size:26,color:CD})
   +T(`m_i${RI2}${AL}=${NI}`,900,230,{size:52})
   +fade(seg(p,.55,.7),L('Nᵢ ＝ その 点が 受ける 力の トルク',900,320,{size:24,color:CN})),seg(p,.15,.3));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=fade(.4,plate(1.3,{ax:180,ay:300,ppm:110}));
  s+=T(`m_1${col(CR,'r_1^2')}${AL}+m_2${col(CR,'r_2^2')}${AL}+\\cdots=${col(CN,'N_1')}+${col(CN,'N_2')}+\\cdots`,720,80,{size:36});
  s+=fade(seg(p,.2,.35),L('α は 共通 → Σ の 外へ',720,170,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.35,.5),T(`\\Big(\\sum_i m_i${RI2}\\Big)${AL}=\\sum_i ${NI}`,720,280,{size:48}));
  s+=fade(seg(p,.65,.8),brace(530,760,335,{color:C.ink})+T('I',645,405,{size:44,color:CH}));
  return s;
 },
 [K+'inner']:(p)=>{
  const ph=0,ax=260,ay=300;
  let s=plate(ph,{ax,ay});
  const A=plateP(ph,7,{ax,ay}),B=plateP(ph,39,{ax,ay});
  s+=fade(seg(p,.1,.25),dot(A[0],A[1],10,CH)+dot(B[0],B[1],10,CH));
  s+=fade(seg(p,.35,.5),arrow(A[0],A[1],A[0]-85,A[1],{color:CF,w:6,head:15})+arrow(B[0],B[1],B[0]+85,B[1],{color:CF,w:6,head:15}));
  s+=fade(seg(p,.55,.7),line(A[0]-150,A[1],B[0]+150,B[1],{color:CF,w:2,dash:'8 7'}));
  s+=card(720,90,440,280,L('物体の 中で 押し合う 力',940,150,{size:26,weight:700})
   +fade(seg(p,.35,.5),L('作用・反作用',940,220,{size:28,color:CF,weight:700}))
   +fade(seg(p,.55,.7),L('同じ 線の 上の 逆向きの 組',940,290,{size:26,color:CH,weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'cancel']:(p)=>{
  const ph=0,ax=260,ay=300;
  let s=plate(ph,{ax,ay});
  const A=plateP(ph,7,{ax,ay}),B=plateP(ph,39,{ax,ay});
  s+=dot(A[0],A[1],10,CH)+dot(B[0],B[1],10,CH)+arrow(A[0],A[1],A[0]-85,A[1],{color:CF,w:6,head:15})+arrow(B[0],B[1],B[0]+85,B[1],{color:CF,w:6,head:15});
  s+=line(A[0]-150,A[1],B[0]+150,B[1],{color:CF,w:2,dash:'8 7'});
  // perpendicular from the axis to the common line of action (the line is horizontal above the axis)
  s+=fade(seg(p,.05,.2),line(ax,ay,ax,A[1],{color:CR,w:5})+rect(ax+10,(ay+A[1])/2-20,120,36,{fill:C.bg,fo:.85,stroke:CR,sw:1.5,rx:8})+label('同じ 距離',ax+70,(ay+A[1])/2+7,{size:24,color:CR,anchor:'middle',weight:700}));
  // turning sense about the axis: A (left, pushed left) → counter-clockwise, B (right, pushed right) → clockwise
  const ra=Math.hypot(A[0]-ax,A[1]-ay),ta=Math.atan2(ay-A[1],A[0]-ax),rb=Math.hypot(B[0]-ax,B[1]-ay),tb=Math.atan2(ay-B[1],B[0]-ax);
  s+=turnArc(ax,ay,ra+24,ta,ta+.45,{color:CN,w:5,g:seg(p,.3,.45)})+turnArc(ax,ay,rb+24,tb,tb-.3,{color:CN,w:5,g:seg(p,.35,.5)});
  s+=fade(seg(p,.3,.45),label('反時計回り',A[0]-40,A[1]-70,{size:24,color:CN,anchor:'middle',weight:700})+label('時計回り',B[0]+10,B[1]-70,{size:24,color:CN,anchor:'middle',weight:700}));
  s+=card(720,90,440,300,L('回す 向きが 逆',940,150,{size:28,color:CN,weight:700})
   +fade(seg(p,.5,.65),L('トルクは 打ち消す',940,220,{size:30,color:CH,weight:700}))
   +fade(seg(p,.7,.85),L('残るのは 外からの トルク',940,300,{size:28,weight:700})),seg(p,.25,.4),CN);
  return s;
 },
 [K+'result']:(p)=>{
  let s=fade(.35,plate(1.3,{ax:180,ay:300,ppm:110}));
  s+=card(420,70,600,170,T(`I\\,${AL}=${NN}`,720,160,{size:72}),seg(p,0,.15),CH);
  s+=fade(seg(p,.3,.45),L('N ＝ 外からの トルクの 和',720,320,{size:30,color:CN,weight:700}));
  s+=fade(seg(p,.6,.75),L('I ＝ 同じ 軸の まわりの 慣性モーメント',720,400,{size:30,weight:700}));
  return s;
 },
 [K+'LIw']:(p)=>{
  let s=fade(.35,plate(1.3,{ax:180,ay:300,ppm:110}));
  const a=`${LL}=\\sum_i m_i${RI2}${WW}`,wa=texWidth(a,46,false),x0=740-wa/2-60;
  s+=T(a,x0,80,{size:46,anchor:'start'});
  s+=fade(seg(p,.25,.4),T(`=I\\,${WW}`,x0+wa+14,80,{size:46,anchor:'start'}));
  s+=fade(seg(p,.5,.65),L('I が 一定なら',760,190,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.6,.75),T(`\\dfrac{d${LL}}{dt}=I\\,\\dfrac{d${WW}}{dt}=I\\,${AL}`,760,300,{size:50}));
  return s;
 },
 [K+'Ichange']:(p)=>{
  // skater from above: arms pulled in
  const cx=240,cy=270,arm=mix(170,70,seg(p,.1,.5)),ph=.3+3*p*p;
  let s=ring(cx,cy,40,{color:C.ink,w:3,fill:'#2a3550'});
  for(const sg of [1,-1]){const x=cx+sg*arm*Math.cos(ph),y=cy-sg*arm*Math.sin(ph);s+=line(cx+sg*40*Math.cos(ph),cy-sg*40*Math.sin(ph),x,y,{color:C.ink,w:8})+dot(x,y,13,'#8fa6cf');}
  s+=turnArc(cx,cy,110,ph+.4,ph+1.4,{color:CW,g:seg(p,.3,.45)});
  s+=label('腕を 縮める → I が 減る',cx,480,{size:26,color:CH,anchor:'middle',weight:700});
  const a=`\\dfrac{d(I${WW})}{dt}=`,b=`I'\\,${WW}`,c=`+\\,I\\,${AL}`,wa=texWidth(a,48,false),wb=texWidth(b,48,false),wc=texWidth(c,48,false),x0=780-(wa+wb+wc+20)/2;
  s+=fade(seg(p,.45,.6),T(a,x0,170,{size:48,anchor:'start'})+T(b,x0+wa+8,170,{size:48,anchor:'start',color:CH})+T(c,x0+wa+wb+20,170,{size:48,anchor:'start'}));
  s+=fade(seg(p,.6,.75),brace(x0+wa+4,x0+wa+wb+12,225,{color:CH,text:'積の 微分で 加わる 項',size:24}));
  return s;
 },

 // ===== S5 ma＝F と並べる =====
 [K+'pair']:(p)=>{
  const y1=150,y2=330,xs=[470,600,720,850];
  const top=[col(CM,'m'),AA,'=',FF],bot=[col(CM,'I'),AL,'=',NN];
  let s='';
  top.forEach((t,i)=>{s+=fade(seg(p,0,.15),T(t,xs[i],y1,{size:80}));});
  bot.forEach((t,i)=>{s+=fade(seg(p,.15,.3),T(t,xs[i],y2,{size:80}));});
  const cs=[CM,CA,CN],gg=[seg(p,.35,.5),seg(p,.5,.65),seg(p,.65,.8)],bx=[xs[0],xs[1],xs[3]];
  bx.forEach((x,i)=>{s+=fade(gg[i],rect(x-50,y1-75,100,y2-y1+135,{fill:cs[i],fo:.06,stroke:cs[i],sw:2.5,rx:16}));});
  s+=fade(seg(p,.35,.5),label('直線',300,y1+10,{size:28,color:CD,anchor:'middle'})+label('回転',300,y2+10,{size:28,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.8,.9),label('質量 ↔ 慣性モーメント',470,470,{size:22,color:CM,anchor:'middle'})+label('加速度 ↔ 角加速度',680,500,{size:22,color:CA,anchor:'middle'})+label('力 ↔ トルク',900,470,{size:22,color:CN,anchor:'middle'}));
  return s;
 },
 [K+'why']:(p)=>{
  let s=T(`m_i\\,${col(CA,'a_i')}=${col(CF,'F_i')}`,200,120,{size:46});
  s+=fade(seg(p,.15,.3),arrow(340,120,440,120,{color:CH,w:4,head:14})+label('× r',390,100,{size:26,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),T(`m_i${RI2}${AL}=${NI}`,640,120,{size:46}));
  s+=fade(seg(p,.45,.6),arrow(830,120,930,120,{color:CH,w:4,head:14})+label('足す',880,100,{size:26,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),T(`I\\,${AL}=${NN}`,1060,120,{size:50}));
  s+=fade(seg(p,.7,.85),card(220,250,760,150,L('回転の 式 ＝ 各点の ma＝F に r を 掛けて 足したもの',600,335,{size:28,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'axis']:(p)=>{
  let s=card(40,30,540,360,L('質量 m',310,80,{size:30,weight:700})+L('物体で 決まる',310,365,{size:26,color:CD}),1);
  s+=dot(310,220,50,'#8fa6cf');
  s+=card(620,30,540,360,L('慣性モーメント I',890,80,{size:30,weight:700})+L('軸で 変わる',890,365,{size:26,color:CH,weight:700}),seg(p,.1,.25),CH);
  const ph=1.4*seg(p,.2,1);
  const rod=(ax,ay,off)=>{const c=Math.cos(ph),s2=Math.sin(ph),P=u=>[ax+(u-off)*c,ay-(u-off)*s2];const [x1,y1]=P(0),[x2,y2]=P(160);return line(x1,y1,x2,y2,{color:WOOD,w:8})+axisMark(ax,ay);};
  s+=fade(seg(p,.2,.35),rod(760,210,80)+rod(930,270,0));
  s+=fade(seg(p,.2,.35),label('中心が 軸',760,320,{size:22,color:CD,anchor:'middle'})+label('端が 軸',960,320,{size:22,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),card(330,410,540,90,L('N と I は 同じ 軸で 取る',600,466,{size:30,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'ex']:(p)=>{
  const ph=.3+.6*seg(p,.2,1)**2;
  let s=ring(260,270,150,{color:CD,w:5,fill:'#141d33'})+line(260,270,260+150*Math.cos(ph),270-150*Math.sin(ph),{color:C.ink,w:4})+axisMark(260,270);
  s+=turnArc(260,270,190,-.5,1.1,{color:CN,g:seg(p,.2,.35)})+fade(seg(p,.2,.35),label('N',470,200,{size:32,color:CN,weight:700}));
  s+=card(600,60,560,330,L('例題（固定した 軸）',880,115,{size:26,color:CD})
   +T(`I=2${U('kg\\cdot m^2')}`,880,190,{size:42})
   +fade(seg(p,.2,.35),T(`${NN}=6${U('N\\cdot m')}`,880,265,{size:42}))
   +fade(seg(p,.5,.65),T(`${AL}=\\ ?`,880,345,{size:44,color:CH})),seg(p,0,.12),CH);
  return s;
 },
 [K+'exA']:(p)=>{
  let s=card(40,60,520,360,L('手順（直線の 運動と 同じ）',300,115,{size:26,color:CD})
   +fade(seg(p,.05,.2),L('① トルクを 書き出す',300,190,{size:28,color:CN,weight:700}))
   +fade(seg(p,.2,.35),L('② Iα＝N に 入れる',300,265,{size:28,weight:700}))
   +fade(seg(p,.35,.5),L('③ α に ついて 解く',300,340,{size:28,color:CA,weight:700})),1);
  s+=fade(seg(p,.55,.7),T(`${AL}=\\dfrac{${NN}}{I}=\\dfrac{6}{2}=3${U('rad/s^2')}`,870,240,{size:50}));
  s+=ok(1150,245,seg(p,.8,.9));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=T(`\\dfrac{\\mathrm{N\\cdot m}}{\\mathrm{kg\\cdot m^2}}`,300,200,{size:56});
  s+=fade(seg(p,.25,.4),T(`1\\,\\mathrm N=1\\,\\mathrm{kg\\cdot m/s^2}`,800,110,{size:40,color:CD}));
  s+=fade(seg(p,.4,.55),T(`=\\dfrac{\\mathrm{kg\\cdot m^2/s^2}}{\\mathrm{kg\\cdot m^2}}`,760,240,{size:52}));
  s+=fade(seg(p,.65,.8),T(`=\\dfrac{1}{\\mathrm s^2}\\ \\to\\ \\mathrm{rad/s^2}`,760,380,{size:52,color:CA}));
  return s;
 },
 [K+'quiz0']:(p)=>{
  const ph=.2,ax=130,ay=400,Lp=420;
  let s=line(ax,ay,ax+Lp*Math.cos(ph),ay-Lp*Math.sin(ph),{color:WOOD,w:18})+axisMark(ax,ay);
  s+=fade(seg(p,.1,.25),label('3 kg、 2 m、 一様',ax+200,ay+60,{size:26,color:C.ink,anchor:'middle'}));
  s+=card(640,50,520,380,L('前回の 棒（端が 軸）',900,105,{size:26,color:CD})
   +fade(seg(p,.45,.6),T(`I=\\dfrac{M${col(CR,'l')}^2}{3}=\\dfrac{3\\times2^2}{3}=4${U('kg\\cdot m^2')}`,900,200,{size:36})),seg(p,.3,.45),CH);
  return s;
 },
 [K+'quiz']:(p)=>{
  const ph=.2+.5*seg(p,.2,1)**2,ax=130,ay=400,Lp=420;
  let s=line(ax,ay,ax+Lp*Math.cos(ph),ay-Lp*Math.sin(ph),{color:WOOD,w:18})+axisMark(ax,ay);
  s+=label('3 kg、 2 m、 一様',ax+200,ay+60,{size:26,color:C.ink,anchor:'middle'});
  s+=turnArc(ax,ay,110,.9,1.9,{color:CN,g:seg(p,.1,.25)});
  s+=card(640,50,520,380,L('前回の 棒（端が 軸）',900,105,{size:26,color:CD})
   +T(`I=\\dfrac{M${col(CR,'l')}^2}{3}=\\dfrac{3\\times2^2}{3}=4${U('kg\\cdot m^2')}`,900,200,{size:36})
   +fade(seg(p,.1,.25),T(`${NN}=6${U('N\\cdot m')}`,900,290,{size:40}))
   +fade(seg(p,.35,.5),T(`${AL}=\\ ?`,900,370,{size:44,color:CH})),1,CH);
  return s;
 },
 [K+'quizA']:(p)=>{
  let s=T(`${AL}=\\dfrac{6}{4}=1.5${U('rad/s^2')}`,600,90,{size:50});
  const bar=(x,v,t,c,g)=>fade(g,rect(x,440-v*80,140,v*80,{fill:c,fo:.45,stroke:c})+label(t,x+70,440-v*80-14,{size:26,color:c,anchor:'middle',weight:700}));
  s+=line(300,440,900,440,{color:CD,w:3});
  s+=bar(360,3,'3 rad/s²',CA,seg(p,.2,.35))+label('I ＝ 2',430,476,{size:24,color:C.ink,anchor:'middle'});
  s+=bar(700,1.5,'1.5 rad/s²',CA,seg(p,.3,.45))+label('I ＝ 4',770,476,{size:24,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.55,.7),card(900,190,270,130,L('I 2倍',1035,245,{size:28})+L('→ α 半分',1035,295,{size:30,color:CH,weight:700}),1,CH));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(60,50,520,420,L('固定した 軸',320,105,{size:30,color:CH,weight:700})
   +T(`m_i${RI2}${AL}=${NI}`,320,195,{size:40})
   +fade(seg(p,.3,.45),T(`\\downarrow\\ \\sum`,320,260,{size:34,color:CH}))
   +fade(seg(p,.4,.55),T(`I\\,${AL}=${NN}`,320,340,{size:58}))
   +fade(seg(p,.65,.8),L('回転版の ma＝F',320,430,{size:28,color:CH,weight:700})),seg(p,0,.12),CH);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(60,50,520,420,L('固定した 軸',320,105,{size:30,color:CH,weight:700})
   +T(`m_i${RI2}${AL}=${NI}`,320,195,{size:40})+T(`\\downarrow\\ \\sum`,320,260,{size:34,color:CH})+T(`I\\,${AL}=${NN}`,320,340,{size:58})
   +L('回転版の ma＝F',320,430,{size:28,color:CH,weight:700}),1,CH);
  s+=card(620,50,520,420,L('角運動量',880,105,{size:30,color:CL,weight:700})
   +T(`${LL}=I\\,${WW}`,880,200,{size:50})
   +fade(seg(p,.3,.45),T(`\\dfrac{d${LL}}{dt}=${NN}`,880,320,{size:54}))
   +fade(seg(p,.6,.75),L('トルクが L の 変わる 割合を 決める',880,430,{size:24,color:CH,weight:700})),seg(p,0,.12),CL);
  return s;
 },
 [K+'next']:(p)=>{
  const R=80,gy=420,cx=220+500*seg(p,.2,1),rot=(cx-220)/R;
  let s=ground(60,1140,gy)+ring(cx,gy-R,R,{color:CD,w:6,fill:'#141d33'});
  for(let i=0;i<6;i++){const a=rot+i*Math.PI/3;s+=line(cx,gy-R,cx+R*.9*Math.cos(a),gy-R+R*.9*Math.sin(a),{color:C.faint,w:3});}
  s+=dot(cx,gy-R,7,C.ink);
  s+=fade(seg(p,0,.15),card(760,60,400,120,L('軸ごと 前へ 進む',960,132,{size:30,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'next2']:(p)=>{
  const R=80,gy=420,cx=720,rot=500/R;
  let s=ground(60,1140,gy)+ring(cx,gy-R,R,{color:CD,w:6,fill:'#141d33'});
  for(let i=0;i<6;i++){const a=rot+i*Math.PI/3;s+=line(cx,gy-R,cx+R*.9*Math.cos(a),gy-R+R*.9*Math.sin(a),{color:C.faint,w:3});}
  s+=dot(cx,gy-R,7,C.ink);
  s+=fade(seg(p,.1,.25),ring(cx,gy,18,{color:CH,w:4,dash:'5 4'})+label('？',cx+40,gy-20,{size:56,color:CH,weight:700}));
  s+=card(120,60,520,160,L('地面に 触れている 点は',380,120,{size:30,weight:700})+L('どう 動いている？',380,180,{size:34,color:CH,weight:700}),seg(p,.2,.35),CH);
  return s;
 },
};
