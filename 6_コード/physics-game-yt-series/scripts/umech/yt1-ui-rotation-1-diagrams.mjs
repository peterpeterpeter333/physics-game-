// YouTube シリーズ 剛体の回転・初級 1/1（ステージ ui-rotation 本0〜本2）— 図。Stage 1200×515.
// 色：位置・長さ・半径 R 水色、速度 v 紫、加速度 a／角加速度 α 赤、角度 θ 橙、角速度 ω 桃、時間 t・T 金、エネルギー 橙。
// 車輪は横から見た図。画面の角度 a は (cx+r cos a, cy+r sin a)（y 下向き）なので、a が増える＝画面で時計回り。
// 右へ d px 転がる車輪は rot＝d/R だけ時計回り（接地点の速度 0）。数式上の θ・ω は反時計回りを正とする。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth,poly,ground} from './anim.mjs';

const K='ui-rotation-1:';
const CR=C.x,CV=C.v,CA=C.a,CTH=C.E,CW=C.p,CT=C.t,CE=C.E;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const col=(c,s)=>`{\\color{${c}}${s}}`;
const OM=col(CW,'\\omega'),TH=col(CTH,'\\theta'),RR=col(CR,'R'),VV=col(CV,'v'),AL=col(CA,'\\alpha'),TT=col(CT,'T'),DT=col(CT,'\\Delta t');
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const TAU=Math.PI*2;
const ptsArc=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
// curved arrow along screen angles a0→a1 (a1>a0 = clockwise on screen)
function turn(cx,cy,r,a0,a1,{color=CW,w=5,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=ptsArc(cx,cy,r,a0,a1,36),[x1,y1]=pts[35],[x2,y2]=pts[36],a=Math.atan2(y2-y1,x2-x1),L=17;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${color}"/>`;
 return fade(g,draw(pts,1,{color,w})+head);
}
// wheel seen from the side. rot = clockwise turn (rad). marker starts at the bottom.
function wheel(cx,cy,R,rot,{g=1,paint=0,marker=1,spokes=6,rim=C.dim,fill='#141d33'}={}){
 let s=ring(cx,cy,R,{color:paint?CR:rim,w:paint?9:6,fill});
 for(let i=0;i<spokes;i++){const a=rot+i*TAU/spokes+Math.PI/2;s+=line(cx,cy,cx+R*.9*Math.cos(a),cy+R*.9*Math.sin(a),{color:C.faint,w:3});}
 if(marker){const a=rot+Math.PI/2;s+=dot(cx+R*Math.cos(a),cy+R*Math.sin(a),9,C.hi);}
 s+=dot(cx,cy,7,C.ink);
 return fade(g,s);
}
const ice=(x1,x2,y)=>rect(x1,y,x2-x1,16,{fill:'#8fd8ff',fo:.25,stroke:'#8fd8ff',sw:1.5,rx:3});

// ---- rolling geometry shared by S3/S4 -------------------------------------------------------------
const W={x0:120,gy:400,R:62};
const CIRC=TAU*W.R;
const PW={x0:250,gy:420,R:100};
// wheel after `rev` revolutions to the right, with paint trace
function roll(rev,{paint=1,trace=1,ghost=0,Rlbl=0,g=1}={}){
 const d=rev*CIRC,cx=W.x0+d,cy=W.gy-W.R;
 let s=ground(40,620,W.gy);
 if(ghost)s+=fade(ghost*.35,ring(W.x0,cy,W.R,{color:C.dim,w:3,dash:'6 6'})+dot(W.x0,cy,5,C.dim));
 if(trace&&d>1)s+=line(W.x0,W.gy-2,cx,W.gy-2,{color:CR,w:7,cap:'butt'});
 s+=wheel(cx,cy,W.R,d/W.R,{paint});
 if(Rlbl)s+=fade(Rlbl,line(cx,cy,cx,cy-W.R,{color:CR,w:4})+label('R',cx+10,cy-W.R/2+4,{size:26,color:CR,weight:700}));
 return fade(g,s);
}

// ---- S1 rod about a fixed axis --------------------------------------------------------------------
function rodScene(p,{ox=150,oy=330,L=380,phi=null,vG=1,g=1}={}){
 const b=-(phi??.55*seg(p,.05,.6)),ux=Math.cos(b),uy=Math.sin(b);
 let s=fade(.35,line(ox,oy,ox+L,oy,{color:C.dim,w:2,dash:'8 8'}));
 s+=line(ox,oy,ox+L*ux,oy+L*uy,{color:'#b99b73',w:14});
 s+=ring(ox,oy,13,{color:C.ink,w:3,fill:C.bg})+label('軸',ox-4,oy+46,{size:22,color:C.dim,anchor:'middle'});
 if(Math.abs(b)>.05)s+=draw(ptsArc(ox,oy,70,b,0,24),1,{color:CTH,w:3.5});
 [.33,.66,1].forEach((f,i)=>{const r=L*f,x=ox+r*ux,y=oy+r*uy,k=.34*r;
  s+=dot(x,y,9,C.ink)+fade(vG,arrow(x,y,x+uy*k,y-ux*k,{color:CV,w:5,head:14}));});
 return fade(g,s);
}

// ---- S2 disc, angle, table ------------------------------------------------------------------------
const DC={cx:230,cy:270,R:140};
// th = CCW angle (maths); screen angle = -th
function disc(th,{thG=1,refG=1,g=1,omegaArrow=0,lbl=1}={}){
 const {cx,cy,R}=DC,a=-th;
 let s=ring(cx,cy,R,{color:C.dim,w:5,fill:'#141d33'});
 s+=fade(refG,line(cx,cy,cx+R+30,cy,{color:C.dim,w:2.5,dash:'8 7'})+(lbl?label('基準の線',cx+R-70,cy+36,{size:22,color:C.dim}):''));
 s+=line(cx,cy,cx+R*Math.cos(a),cy+R*Math.sin(a),{color:C.ink,w:5})+dot(cx+R*Math.cos(a),cy+R*Math.sin(a),9,C.hi)+dot(cx,cy,7,C.ink);
 if(thG>0&&th>.05){s+=fade(thG,draw(ptsArc(cx,cy,56,0,-Math.min(th,TAU-.02),40),1,{color:CTH,w:4}));
  const m=-Math.min(th,TAU-.02)/2;if(lbl)s+=fade(thG,T(TH,cx+88*Math.cos(m),cy+88*Math.sin(m)+10,{size:34}));}
 if(omegaArrow>0)s+=turn(cx,cy,R+26,-.3,-1.5,{color:CW,g:omegaArrow});
 return fade(g,s);
}
const TB={x:470,w:690,y0:70,rh:112};
function table(rows=[0,0,0],{g=1,hl=-1,head=1}={}){
 const {x,w,y0,rh}=TB,xm=x+w/2;
 let s=fade(head,label('直線',x+w*.25,y0+22,{size:28,color:C.dim,anchor:'middle',weight:700})+label('回転',x+w*.75,y0+22,{size:28,color:C.dim,anchor:'middle',weight:700})+line(x,y0+40,x+w,y0+40,{color:C.faint,w:2}));
 const R=[
  ['位置','[m]',`${col(CR,'x')}`,'角度','[rad]',`${TH}`],
  ['速度','[m/s]',`${VV}=\\dfrac{\\Delta ${col(CR,'x')}}{${DT}}`,'角速度','[rad/s]',`${OM}=\\dfrac{\\Delta ${TH}}{${DT}}`],
  ['加速度','[m/s²]',`${col(CA,'a')}=\\dfrac{\\Delta ${VV}}{${DT}}`,'角加速度','[rad/s²]',`${AL}=\\dfrac{\\Delta ${OM}}{${DT}}`],
 ];
 R.forEach((r,i)=>{const gg=rows[i];if(gg<=0)return;const yc=y0+48+rh*i+rh/2;
  let q=rect(x,yc-rh/2+6,w,rh-12,{fill:i===hl?C.hi:'#1a2742',fo:i===hl?.08:.5,stroke:i===hl?C.hi:C.faint,sw:i===hl?2.5:1.5,rx:12});
  q+=label(`${'①②③'[i]}`,x-8,yc+9,{size:26,color:C.hi,anchor:'end'});
  q+=label(r[0],x+18,yc-4,{size:26,color:C.ink})+label(r[1],x+18,yc+30,{size:22,color:C.dim})+T(r[2],x+w*.25+50,yc+4,{size:34});
  q+=label('↔',xm,yc+10,{size:30,color:C.dim,anchor:'middle'});
  q+=label(r[3],xm+26,yc-4,{size:26,color:C.ink})+label(r[4],xm+26,yc+30,{size:22,color:C.dim})+T(r[5],x+w*.75+62,yc+4,{size:34});
  s+=fade(gg,q);});
 return fade(g,s);
}

// ---- S5 slopes & energy bars ----------------------------------------------------------------------
const SL=[{x1:110,x2:340},{x1:380,x2:610}],SY1=150,SY2=420;
function slope(i){const {x1,x2}=SL[i];return poly([[x1,SY1],[x2,SY2],[x1,SY2]],{fill:'#26324d',fo:.8,stroke:C.dim,sw:2});}
const slopeDir=i=>{const {x1,x2}=SL[i],L=Math.hypot(x2-x1,SY2-SY1);return {ux:(x2-x1)/L,uy:(SY2-SY1)/L,L};};
function boxOn(u){const {x1}=SL[0],{ux,uy,L}=slopeDir(0),s0=40,sd=s0+(L-90)*u,px=x1+ux*sd,py=SY1+uy*sd,a=Math.atan2(uy,ux)*180/Math.PI;
 return `<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${a.toFixed(1)})">${rect(-24,-44,48,44,{fill:CR,fo:.35,stroke:CR,rx:4})}</g>`;}
function canOn(u,{r=22,ringOnly=false,i=1,s0=40}={}){const {x1}=SL[i],{ux,uy,L}=slopeDir(i),sd=s0+(L-90)*u,nx=uy,ny=-ux,px=x1+ux*sd+nx*r,py=SY1+uy*sd+ny*r;
 const rot=sd/r;let s=ringOnly?ring(px,py,r,{color:C.hi,w:7,fill:'#141d33'}):ring(px,py,r,{color:C.dim,w:4,fill:'#3a4a66'});
 s+=line(px,py,px+r*.9*Math.cos(rot),py+r*.9*Math.sin(rot),{color:C.ink,w:3})+dot(px,py,4,C.ink);return {s,px,py};}
const EB={x:660,k:26}; // px per J
function bar(y,parts,{lbl='',g=1,total=0}={}){
 let s=lbl?label(lbl,EB.x,y-14,{size:24,color:C.ink}):'';let x=EB.x;
 for(const [J,color,t] of parts){s+=rect(x,y,J*EB.k,40,{fill:color,fo:.55,stroke:color,rx:6});if(t)s+=label(t,x+J*EB.k/2,y+29,{size:22,color:C.ink,anchor:'middle'});x+=J*EB.k;}
 if(total)s+=line(EB.x+16*EB.k,y-8,EB.x+16*EB.k,y+48,{color:C.dim,w:2,dash:'5 5'});
 return fade(g,s);
}

export const ytUiRotation1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=rodScene(p,{vG:seg(p,.45,.6)});
  s+=card(660,90,500,300,label('前回：回る棒',910,145,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.25,.4),label('どの点も 同じ角度',910,210,{size:28,color:CTH,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),T(`${VV}=${col(CR,'r')}${OM}`,910,290,{size:52})+label('外側ほど 速い',910,360,{size:26,color:CV,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'ask']:(p)=>{
  const rev=.7*seg(p,0,.9);
  let s=roll(rev,{paint:0,trace:0});
  const cx=W.x0+rev*CIRC,cy=W.gy-W.R;
  s+=turn(cx,cy,W.R+22,-2.2,-.9,{color:CW,g:seg(p,.1,.25)})+fade(seg(p,.1,.25),T(OM,cx-W.R-20,cy-W.R-8,{size:36}));
  s+=arrow(cx,cy,cx+110,cy,{color:CV,w:6,g:seg(p,.2,.35)})+fade(seg(p,.25,.4),T(VV,cx+124,cy+12,{size:36}));
  s+=card(700,120,460,230,label('回転の速さ ω と',930,185,{size:30,color:CW,anchor:'middle'})+label('前へ進む速さ v は',930,240,{size:30,color:CV,anchor:'middle'})+label('どうつながる？',930,305,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'wheel']:(p)=>{
  const rev=.25*seg(p,.1,1);
  let s=roll(rev,{paint:0,trace:0,Rlbl:seg(p,.15,.3)});
  const cx=W.x0+rev*CIRC,cy=W.gy-W.R;
  s+=turn(cx,cy,W.R+22,-2.2,-.9,{color:CW,g:seg(p,.45,.6)});
  s+=card(700,110,460,250,label('半径',760,185,{size:28,color:C.ink})+T(`${RR}=0.5\\,\\mathrm{m}`,1000,180,{size:40})
   +fade(seg(p,.45,.6),label('1秒に 回る角度',760,265,{size:28,color:C.ink})+T(`${OM}=4\\,\\mathrm{rad/s}`,1000,320,{size:40})),seg(p,.1,.25));
  return s;
 },
 [K+'predict']:(p)=>{
  const rev=.25+.1*seg(p,0,1);
  let s=roll(rev,{paint:0,trace:0});
  const cx=W.x0+rev*CIRC,cy=W.gy-W.R;
  s+=turn(cx,cy,W.R+22,-2.2,-.9,{color:CW});
  s+=card(700,110,460,250,label('中心は 1秒に',930,180,{size:30,color:C.ink,anchor:'middle'})+label('何 m 進む？',930,245,{size:36,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',930,310,{size:26,color:C.dim,anchor:'middle'}),seg(p,0,.15),C.hi);
  return s;
 },
 // ===== S2 直線と回転の対応 =====
 [K+'table0']:(p)=>disc(0,{g:seg(p,0,.3),thG:0})+table([0,0,0],{head:seg(p,.3,.5)}),
 [K+'theta']:(p)=>{const th=1.1*seg(p,.3,.8);return disc(th,{thG:seg(p,.4,.6)})+table([seg(p,.1,.25),0,0],{hl:0});},
 [K+'omega']:(p)=>{const th=1.1+1.2*seg(p,.35,.95);return disc(th,{omegaArrow:seg(p,.45,.6)})+fade(seg(p,.5,.65),T(OM,DC.cx+DC.R+10,DC.cy-DC.R+10,{size:36}))+table([1,seg(p,.1,.3),0],{hl:1});},
 [K+'omegaEx']:(p)=>{
  // 4 rad/s: 0.5 s → 2 rad, 2π rad → π/2 s
  const u=seg(p,.05,.4),v=seg(p,.5,.9),th=u<1?2*u:2+(TAU-2)*v;
  let s=disc(th,{lbl:0});
  const tsec=th/4;
  s+=label(`t ＝ ${tsec.toFixed(2)} s`,DC.cx,DC.cy+DC.R+50,{size:26,color:CT,anchor:'middle'});
  s+=card(560,80,600,360,T(`${OM}=4\\,\\mathrm{rad/s}`,860,140,{size:40})
   +fade(seg(p,.25,.4),label('0.5 s で',610,225,{size:28,color:CT})+T(`4\\times0.5=2\\,\\mathrm{rad}`,960,222,{size:36}))
   +fade(seg(p,.55,.7),label('1周',610,310,{size:28,color:C.ink})+T(`2\\pi\\approx6.28\\,\\mathrm{rad}`,960,306,{size:36}))
   +fade(seg(p,.75,.9),label('かかる時間',610,395,{size:28,color:CT})+T(`2\\pi\\div4\\approx1.57\\,\\mathrm{s}`,960,392,{size:36}))
  );
  return s;
 },
 [K+'alpha']:(p)=>disc(1.1,{omegaArrow:1})+table([1,1,seg(p,.1,.3)],{hl:2}),
 [K+'alphaEx']:(p)=>{
  const u=seg(p,.05,.6),w=4*u;
  let s=disc(1.1+2*u*u*2.5,{omegaArrow:1,thG:0,lbl:0});
  s+=card(560,90,600,340,label('止まった状態から 2 s で',600,160,{size:28,color:C.ink})
   +label('ω ＝',600,240,{size:30,color:CW,weight:700})+label(`${w.toFixed(1)} rad/s`,860,240,{size:34,color:CW,anchor:'end',weight:700})
   +fade(seg(p,.6,.75),T(`${AL}=\\dfrac{4\\,\\mathrm{rad/s}}{2\\,\\mathrm{s}}=2\\,\\mathrm{rad/s^2}`,860,360,{size:40})),seg(p,0,.12));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=disc(.8,{thG:0,lbl:0});
  s+=turn(DC.cx,DC.cy,DC.R+28,-.4,-2.2,{color:C.F,g:seg(p,.3,.45)})+fade(seg(p,.3,.45),label('＋',DC.cx+8,DC.cy-DC.R-44,{size:36,color:C.F,weight:700,anchor:'middle'}));
  s+=turn(DC.cx,DC.cy,DC.R+28,.4,2.2,{color:CA,g:seg(p,.55,.7)})+fade(seg(p,.55,.7),label('−',DC.cx+8,DC.cy+DC.R+70,{size:36,color:CA,weight:700,anchor:'middle'}));
  s+=card(560,90,600,340,label('直線',600,150,{size:26,color:C.dim})
   +line(700,190,1000,190,{color:C.dim,w:3})+arrow(850,190,1000,190,{color:C.F,w:5})+label('右向き ＋',1020,200,{size:26,color:C.F})
   +fade(seg(p,.25,.4),label('回転',600,270,{size:26,color:C.dim})+label('反時計回り ＋',700,320,{size:30,color:C.F,weight:700}))
   +fade(seg(p,.5,.65),label('時計回り −',700,390,{size:30,color:CA,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'omegaNote']:(p)=>{
  // left: oscillation as the shadow of circular motion; right: a real turning wheel
  const ph=TAU*1.2*seg(p,0,1),cx=260,cy=250,r=100,px=cx+r*Math.cos(ph),py=cy-r*Math.sin(ph);
  let s=card(40,60,520,420,label('振動（前の回）',300,110,{size:26,color:C.dim,anchor:'middle'})
   +ring(cx,cy,r,{color:C.faint,w:2,dash:'6 6'})+dot(px,py,8,C.dim)+line(px,py,px,cy+r+50,{color:C.faint,w:1.5,dash:'4 5'})
   +line(cx-r-20,cy+r+50,cx+r+20,cy+r+50,{color:C.dim,w:2})+dot(px,cy+r+50,11,C.x)
   +label('角振動数 ω',300,445,{size:28,color:C.dim,anchor:'middle'}),1);
  const rot=1.5*seg(p,0,1);
  s+=card(640,60,520,420,label('今回',900,110,{size:26,color:C.hi,anchor:'middle',weight:700})
   +wheel(900,260,110,-rot,{marker:1})+turn(900,260,138,-.4,-1.6,{color:CW})
   +label('角速度 ω',900,425,{size:30,color:CW,anchor:'middle',weight:700})+label('実際に回る角度 ÷ 時間',900,462,{size:22,color:C.ink,anchor:'middle'}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ===== S3 ペンキで1周をほどく =====
 [K+'paint']:(p)=>{
  let s=roll(.5*seg(p,.15,1),{paint:1,ghost:1});
  s+=card(680,90,480,300,label('縁に ペンキ',920,150,{size:30,color:CR,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('滑らない：縁の各部分が',920,225,{size:26,color:C.ink,anchor:'middle'})+label('順に 一度ずつ 地面に触れる',920,270,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'trace']:(p)=>{
  let s=roll(.5+.5*seg(p,0,.5),{paint:1,ghost:1});
  s+=fade(seg(p,.55,.7),brace(W.x0,W.x0+CIRC,W.gy+12,{dir:1,color:CR,text:'',g:1})+T(`2\\pi ${RR}`,W.x0+CIRC/2,W.gy+72,{size:34}));
  s+=card(680,90,480,300,label('地面の線 ＝ 縁を伸ばしたもの',920,150,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.7),label('1周で 線の長さ',920,235,{size:28,color:C.ink,anchor:'middle'})+label('＝ 円周 2πR',920,295,{size:34,color:CR,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'center']:(p)=>{
  let s=roll(1,{paint:1,ghost:1});
  const cy=W.gy-W.R;
  s+=brace(W.x0,W.x0+CIRC,W.gy+12,{dir:1,color:CR})+T(`2\\pi ${RR}`,W.x0+CIRC/2,W.gy+72,{size:34});
  s+=arrow(W.x0,cy-W.R-40,W.x0+CIRC*seg(p,.1,.5),cy-W.R-40,{color:CR,w:5})+fade(seg(p,.3,.5),line(W.x0,cy,W.x0,cy-W.R-50,{color:C.faint,w:2,dash:'5 5'})+line(W.x0+CIRC,cy,W.x0+CIRC,cy-W.R-50,{color:C.faint,w:2,dash:'5 5'}));
  s+=fade(seg(p,.4,.55),label('中心も 2πR 進む',W.x0+CIRC/2,cy-W.R-58,{size:26,color:CR,anchor:'middle',weight:700}));
  s+=card(680,90,480,300,label('1周 転がると',920,160,{size:28,color:C.ink,anchor:'middle'})+label('線の長さ ＝ 中心の移動',920,230,{size:30,color:CR,anchor:'middle',weight:700})+fade(seg(p,.5,.65),T(`=2\\pi ${RR}`,920,305,{size:44})),1);
  return s;
 },
 [K+'slip']:(p)=>{
  const cx=320,cy=W.gy-W.R,rot=TAU*1.5*seg(p,.1,1);
  let s=ice(60,600,W.gy)+label('氷',70,W.gy+50,{size:24,color:'#8fd8ff'});
  s+=wheel(cx,cy,W.R,rot)+turn(cx,cy,W.R+22,-2.2,-.9,{color:CW});
  s+=fade(seg(p,.3,.45),label('回っても 中心は ほとんど進まない',cx,cy-W.R-50,{size:26,color:C.ink,anchor:'middle'}));
  s+=card(680,90,480,300,label('空回り ＝ 滑る',920,160,{size:32,color:CA,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('回転の速さだけでは',920,235,{size:26,color:C.ink,anchor:'middle'})+label('進む速さは 決まらない',920,280,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.7,.85),label('今回は 滑らない場合だけ',920,350,{size:26,color:C.hi,anchor:'middle'})),seg(p,0,.12),CA);
  return s;
 },
 [K+'period']:(p)=>{
  const u=seg(p,.05,.55);let s=roll(u,{paint:1,ghost:1});
  s+=label(`時間：${u<.999?(u).toFixed(2)+' T':'T'}`,W.x0-40,80,{size:28,color:CT});
  s+=card(680,70,480,380,label('1周にかかる時間 T',920,125,{size:28,color:CT,anchor:'middle'})
   +fade(seg(p,.55,.7),label('中心の速さ',720,210,{size:26,color:CV})+T(`${VV}=\\dfrac{2\\pi ${RR}}{${TT}}`,1000,210,{size:40})),seg(p,0,.12));
  return s;
 },
 [K+'omegaT']:(p)=>{
  let s=roll(1,{paint:1,ghost:1})+label('時間：T',W.x0-40,80,{size:28,color:CT});
  const cx=W.x0+CIRC,cy=W.gy-W.R;
  s+=fade(seg(p,.1,.3),draw(ptsArc(cx,cy,34,Math.PI/2,Math.PI/2+TAU*seg(p,.1,.45)-.05,50),1,{color:CTH,w:4})+label('2π',cx+44,cy-40,{size:26,color:CTH,weight:700}));
  s+=card(680,70,480,380,label('1周にかかる時間 T',920,125,{size:28,color:CT,anchor:'middle'})
   +label('中心の速さ',720,210,{size:26,color:CV})+T(`${VV}=\\dfrac{2\\pi ${RR}}{${TT}}`,1000,210,{size:40})
   +fade(seg(p,.4,.55),label('角速度',720,330,{size:26,color:CW})+T(`${OM}=\\dfrac{2\\pi}{${TT}}`,1000,330,{size:40})));
  return s;
 },
 [K+'derive']:(p)=>{
  let s=roll(1,{paint:1,ghost:1,Rlbl:1});
  s+=card(640,50,520,420,
   T(`${VV}=\\dfrac{2\\pi ${RR}}{${TT}}`,900,120,{size:40})
   +fade(seg(p,.1,.3),T(`=${RR}\\times\\dfrac{2\\pi}{${TT}}`,900,215,{size:40}))
   +fade(seg(p,.25,.4),label('ω',1085,225,{size:30,color:CW,weight:700})+arrow(1080,210,1030,212,{color:CW,w:3,head:10}))
   +fade(seg(p,.4,.55),T(`${VV}=${RR}${OM}`,900,325,{size:60})+highlight(780,285,240,80,1))
   +fade(seg(p,.6,.75),label('滑らずに 転がる 条件',900,420,{size:28,color:C.hi,anchor:'middle',weight:700})));
  return s;
 },
 [K+'partial']:(p)=>{
  const dth=1.3*seg(p,.05,.5),cx=PW.x0+PW.R*dth,cy=PW.gy-PW.R,R=PW.R;
  let s=ground(40,620,PW.gy)+dot(PW.x0,cy,5,C.dim);
  s+=wheel(cx,cy,R,dth,{paint:1});
  s+=draw(ptsArc(cx,cy,R,Math.PI/2,Math.PI/2+dth,30),1,{color:C.hi,w:9});
  s+=line(PW.x0,PW.gy-2,cx,PW.gy-2,{color:C.hi,w:8,cap:'butt'});
  if(dth>.2){s+=fade(seg(p,.45,.6),line(cx,cy,cx,cy+R,{color:C.dim,w:2.5})+line(cx,cy,cx+R*Math.cos(Math.PI/2+dth),cy+R*Math.sin(Math.PI/2+dth),{color:C.dim,w:2.5})+draw(ptsArc(cx,cy,34,Math.PI/2,Math.PI/2+dth,20),1,{color:CTH,w:3.5}));}
  s+=fade(seg(p,.5,.65),T(`\\Delta${TH}`,cx-20,cy+62,{size:26})+label('弧 RΔθ',cx-R-24,cy-10,{size:26,color:C.hi,weight:700,anchor:'end'}));
  s+=fade(seg(p,.6,.75),label('線 RΔθ',(PW.x0+cx)/2,PW.gy+46,{size:26,color:C.hi,anchor:'middle',weight:700})+arrow(PW.x0,cy-R-30,cx,cy-R-30,{color:CR,w:4,head:12})+label('中心も RΔθ',(PW.x0+cx)/2,cy-R-46,{size:24,color:CR,anchor:'middle'}));
  s+=card(680,90,480,300,label('Δθ だけ 回ると',920,160,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),T(`\\Delta ${col(CR,'x')}=${RR}\\,\\Delta${TH}`,920,265,{size:48})+label('中心の移動 ＝ 弧の長さ',920,345,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'partial2']:(p)=>{
  const dth=1.3,cx=PW.x0+PW.R*dth,cy=PW.gy-PW.R,R=PW.R;
  let s=ground(40,620,PW.gy)+dot(PW.x0,cy,5,C.dim)+wheel(cx,cy,R,dth,{paint:1});
  s+=line(PW.x0,PW.gy-2,cx,PW.gy-2,{color:C.hi,w:8,cap:'butt'})+draw(ptsArc(cx,cy,R,Math.PI/2,Math.PI/2+dth,30),1,{color:C.hi,w:9});
  s+=card(680,40,480,440,T(`\\Delta ${col(CR,'x')}=${RR}\\,\\Delta${TH}`,920,105,{size:44})
   +fade(seg(p,.05,.2),label(`両辺を Δt で割る`,920,170,{size:26,color:CT,anchor:'middle'}))
   +fade(seg(p,.15,.3),T(`\\dfrac{\\Delta ${col(CR,'x')}}{${DT}}=${RR}\\,\\dfrac{\\Delta${TH}}{${DT}}`,920,250,{size:40}))
   +fade(seg(p,.3,.45),label('v',800,330,{size:30,color:CV,anchor:'middle',weight:700})+label('Rω',1010,330,{size:30,color:CW,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),T(`${VV}=${RR}${OM}`,920,410,{size:52})+highlight(830,375,180,70,1)),1);
  return s;
 },
 // ===== S4 0.5 m と 4 rad/s =====
 [K+'calc']:(p)=>{
  const rev=.35*seg(p,0,1),cx=W.x0+rev*CIRC,cy=W.gy-W.R;
  let s=roll(rev,{paint:0,trace:0,Rlbl:1});
  s+=turn(cx,cy,W.R+22,-2.2,-.9,{color:CW})+label('4 rad/s',cx,cy-W.R-40,{size:24,color:CW,anchor:'middle'});
  s+=arrow(cx,cy,cx+110,cy,{color:CV,w:6,g:seg(p,.55,.7)})+fade(seg(p,.6,.75),label('2 m/s',cx+120,cy+8,{size:26,color:CV,weight:700}));
  s+=label('半径 R ＝ 0.5 m',cx,W.gy+38,{size:24,color:CR,anchor:'middle'});
  s+=card(680,90,480,300,T(`${VV}=${RR}${OM}`,920,160,{size:48})
   +fade(seg(p,.2,.35),T(`=0.5\\,\\mathrm{m}\\times4\\,\\mathrm{rad/s}`,920,245,{size:38}))
   +fade(seg(p,.45,.6),T(`=2\\,\\mathrm{m/s}`,920,330,{size:46})+highlight(830,295,180,68,1)),1);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(80,70,1040,380,
   label('ラジアン ＝ 弧の長さ ÷ 半径',600,140,{size:30,color:CTH,anchor:'middle'})
   +T(`\\dfrac{\\mathrm{m}}{\\mathrm{m}}`,520,225,{size:44})
   +label('→ 単位は 残らない',640,238,{size:28,color:C.ink})
   +fade(seg(p,.4,.6),T(`\\mathrm{m}\\times\\mathrm{rad/s}=\\mathrm{m/s}`,600,350,{size:52})+highlight(390,310,420,78,1)),seg(p,0,.12));
  return s;
 },
 [K+'check']:(p)=>{
  const u=seg(p,.05,.6);let s=roll(u,{paint:1,ghost:1});
  s+=label(`時間：${(u*Math.PI/2).toFixed(2)} s`,W.x0-40,80,{size:28,color:CT});
  s+=card(680,60,480,400,label('1周で 確かめる',920,110,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.25),label('円周',720,190,{size:26,color:CR})+T(`2\\pi\\times0.5\\approx3.14\\,\\mathrm{m}`,1010,187,{size:34}))
   +fade(seg(p,.35,.5),label('1周の時間',720,275,{size:26,color:CT})+T(`\\approx1.57\\,\\mathrm{s}`,1030,272,{size:34}))
   +fade(seg(p,.65,.8),T(`\\dfrac{3.14\\,\\mathrm{m}}{1.57\\,\\mathrm{s}}=2\\,\\mathrm{m/s}`,920,380,{size:40})),1);
  return s;
 },
 [K+'dir']:(p)=>{
  const R=46,u=seg(p,.05,.95),gy1=200,gy2=440;
  // top: rolls right → clockwise (rot increases)
  const x1=90+u*300;let s=ground(40,520,gy1)+wheel(x1,gy1-R,R,(x1-90)/R)+turn(x1,gy1-R,R+18,-2.3,-.8,{color:CW,w:4})+arrow(x1,gy1-R,x1+80,gy1-R,{color:CV,w:5});
  s+=label('右へ進む → 時計回り',40,70,{size:26,color:C.ink});
  // bottom: rolls left → counter-clockwise (rot decreases)
  const x2=470-u*300;s+=fade(seg(p,.2,.35),ground(40,520,gy2)+wheel(x2,gy2-R,R,-(470-x2)/R)+turn(x2,gy2-R,R+18,-.8,-2.3,{color:CW,w:4})+arrow(x2,gy2-R,x2-80,gy2-R,{color:CV,w:5})+label('左へ進む → 反時計回り',40,300,{size:26,color:C.ink}));
  s+=card(600,90,560,330,label('反時計回りを ＋ と決めた',880,150,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('右へ転がる車輪の ω は 負',880,225,{size:28,color:CA,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('v＝Rω には 大きさを使う',880,300,{size:28,color:C.hi,anchor:'middle'})+T(`|${OM}|=4\\,\\mathrm{rad/s}`,880,370,{size:36})),seg(p,0,.12));
  return s;
 },
 [K+'quiz']:(p)=>{
  const rev=.2*seg(p,0,1),cx=W.x0+rev*CIRC,cy=W.gy-W.R;
  let s=roll(rev,{paint:0,trace:0,Rlbl:1})+label('半径 R ＝ 0.5 m',cx,W.gy+38,{size:24,color:CR,anchor:'middle'});
  s+=arrow(cx,cy,cx+160,cy,{color:CV,w:6})+label('3 m/s',cx+170,cy+8,{size:26,color:CV,weight:700});
  s+=card(680,110,480,250,label('3 m/s で 進ませるには',920,180,{size:30,color:C.ink,anchor:'middle'})+T(`${OM}=\\;?`,920,265,{size:52})+label('予想してみよう',920,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  const cx=W.x0+.2*CIRC,cy=W.gy-W.R;
  let s=roll(.2,{paint:0,trace:0,Rlbl:1})+label('半径 R ＝ 0.5 m',cx,W.gy+38,{size:24,color:CR,anchor:'middle'})+arrow(cx,cy,cx+160,cy,{color:CV,w:6})+label('3 m/s',cx+170,cy+8,{size:26,color:CV,weight:700});
  s+=turn(cx,cy,W.R+22,-2.2,-.9,{color:CW,g:seg(p,.6,.75)})+fade(seg(p,.6,.75),label('6 rad/s',cx,cy-W.R-40,{size:24,color:CW,anchor:'middle'}));
  s+=card(680,60,480,400,T(`${VV}=${RR}${OM}`,920,130,{size:44})
   +fade(seg(p,.05,.2),label('両辺を R で割る',920,195,{size:26,color:CR,anchor:'middle'}))
   +fade(seg(p,.2,.35),T(`${OM}=\\dfrac{${VV}}{${RR}}`,920,275,{size:44}))
   +fade(seg(p,.5,.65),T(`=\\dfrac{3\\,\\mathrm{m/s}}{0.5\\,\\mathrm{m}}=6\\,\\mathrm{rad/s}`,920,385,{size:38})),1);
  return s;
 },
 [K+'rod']:(p)=>{
  let s=card(30,40,560,440,label('前回：回る棒',310,90,{size:26,color:C.dim,anchor:'middle'}),1);
  s+=rodScene(.5,{ox:90,oy:380,L:300,phi:.4+.25*seg(p,0,1)});
  s+=label('軸は 止まっている',310,462,{size:26,color:C.ink,anchor:'middle'})+T(`${VV}=${col(CR,'r')}${OM}`,470,160,{size:34});
  const rev=.3*seg(p,0,1),R=50,gy=360,cx=700+rev*TAU*R,cy=gy-R;
  s+=card(610,40,560,440,label('今回：転がる車輪',890,90,{size:26,color:C.dim,anchor:'middle'})
   +ground(630,1150,gy)+wheel(cx,cy,R,rev*TAU)+turn(cx,cy,R+18,-2.2,-.9,{color:CW,w:4})+arrow(cx,cy,cx+90,cy,{color:CV,w:5})
   +fade(seg(p,.4,.55),label('軸そのものが 進む',890,420,{size:26,color:C.ink,anchor:'middle'})+label('滑らない条件で v＝Rω',890,458,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.3,.42));
  return s;
 },
 // ===== S5 転がるとエネルギーを分ける =====
 [K+'race']:(p)=>{
  const u=.85*seg(p,.2,.9);
  let s=slope(0)+slope(1)+boxOn(u)+canOn(u*.82).s;
  s+=label('箱：つるつる 滑る',SL[0].x1,120,{size:24,color:CR})+label('缶：滑らず 転がる',SL[1].x1,120,{size:24,color:C.hi});
  s+=line(92,SY1,92,SY2,{color:C.dim,w:2})+label('0.8 m',84,(SY1+SY2)/2+8,{size:24,color:C.dim,anchor:'end'});
  s+=card(660,110,500,240,label('同じ高さの坂',910,170,{size:30,color:C.ink,anchor:'middle'})+label('損失は ないとする',910,240,{size:28,color:C.dim,anchor:'middle'})+fade(seg(p,.5,.65),label('下での 速さは？',910,305,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'U']:(p)=>{
  let s=slope(0)+slope(1)+boxOn(0)+canOn(0).s+line(92,SY1,92,SY2,{color:C.dim,w:2})+label('0.8 m',84,(SY1+SY2)/2+8,{size:24,color:C.dim,anchor:'end'});
  s+=label('箱：つるつる 滑る',SL[0].x1,120,{size:24,color:CR})+label('缶：滑らず 転がる',SL[1].x1,120,{size:24,color:C.hi});
  s+=fade(seg(p,.05,.2),label('位置エネルギーの減少',EB.x,90,{size:26,color:CE,weight:700})+T(`mgh=2\\times10\\times0.8`,EB.x,150,{size:36,anchor:'start'}));
  s+=bar(200,[[16*seg(p,.45,.7),CE,'']],{g:seg(p,.4,.5)})+fade(seg(p,.65,.8),label('16 J',EB.x+16*EB.k+14,230,{size:28,color:CE,weight:700}));
  return s;
 },
 [K+'slide']:(p)=>{
  const u=seg(p,.05,.5);
  let s=slope(0)+slope(1)+boxOn(u*.85)+canOn(0).s;
  s+=label('箱：つるつる 滑る',SL[0].x1,120,{size:24,color:CR})+label('缶：滑らず 転がる',SL[1].x1,120,{size:24,color:C.hi});
  s+=label('位置エネルギーの減少',EB.x,90,{size:26,color:CE,weight:700})+bar(110,[[16,CE,'16 J']]);
  s+=bar(250,[[16,CV,'前へ進む分 16 J']],{lbl:'箱',g:seg(p,.15,.3)});
  s+=fade(seg(p,.45,.6),T(`\\tfrac12\\cdot2\\cdot ${VV}^2=16`,EB.x,360,{size:36,anchor:'start'})+T(`${VV}=4\\,\\mathrm{m/s}`,EB.x+300,360,{size:36,anchor:'start'}));
  return s;
 },
 [K+'roll']:(p)=>{
  // close-up of the can: points on the rim go round the centre as it moves
  const cx=300+220*seg(p,0,1),cy=300,r=110,rot=(cx-300)/r;
  let s=ground(40,640,cy+r)+wheel(cx,cy,r,rot,{spokes:6});
  for(const a0 of [0,Math.PI/2,Math.PI,1.5*Math.PI]){const a=a0+rot,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);
   s+=fade(seg(p,.3,.45),arrow(x,y,x-60*Math.sin(a),y+60*Math.cos(a),{color:CW,w:4,head:12}));}
  s+=arrow(cx,cy,cx+100,cy,{color:CV,w:6,g:seg(p,.1,.25)});
  s+=card(680,110,480,260,label('缶：進みながら 回る',920,175,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('縁の点は 中心の周りも回る',920,240,{size:26,color:CW,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('回ることにも エネルギー',920,310,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'split']:(p)=>{
  const u=seg(p,.05,.5);
  let s=slope(0)+slope(1)+boxOn(.85)+canOn(u*.72).s;
  s+=label('箱：つるつる 滑る',SL[0].x1,120,{size:24,color:CR})+label('缶：滑らず 転がる',SL[1].x1,120,{size:24,color:C.hi});
  s+=label('位置エネルギーの減少',EB.x,90,{size:26,color:CE,weight:700})+bar(110,[[16,CE,'16 J']]);
  s+=bar(230,[[16,CV,'前へ進む分']],{lbl:'箱'});
  const tr=mix(16,10.7,seg(p,.15,.4));
  s+=bar(350,[[tr,CV,'進む分'],[16-tr,CW,'回る分']],{lbl:'缶',total:1});
  s+=fade(seg(p,.55,.7),label('箱 4 m/s　缶 4 m/s より遅い',EB.x,470,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'warn']:(p)=>{
  let s=slope(1)+canOn(.72).s+label('缶：滑らず 転がる',SL[1].x1,120,{size:24,color:C.hi});
  s+=card(650,90,510,340,label('転がる物体では',905,150,{size:28,color:C.ink,anchor:'middle'})
   +T(`mgh=\\tfrac12 m${VV}^2`,905,245,{size:48})+fade(seg(p,.2,.35),line(765,250,1045,230,{color:CA,w:6})+label('✕',1070,262,{size:44,color:CA,weight:700}))
   +fade(seg(p,.4,.55),label('回る分を 忘れている',905,345,{size:28,color:CA,anchor:'middle',weight:700})),seg(p,0,.12),CA);
  return s;
 },
 [K+'share']:(p)=>{
  // ring (mass at the rim) vs disc on the same slope
  const u=seg(p,.15,.95);
  let s=poly([[60,150],[640,430],[60,430]],{fill:'#26324d',fo:.8,stroke:C.dim,sw:2});
  const L=Math.hypot(580,280),ux=580/L,uy=280/L,nx=uy,ny=-ux,r=36;
  const put=(sd)=>[60+ux*sd+nx*r,150+uy*sd+ny*r];
  const [dx,dy]=put(120+(L-200)*u),[rx,ry]=put(40+(L-200)*u*.8);
  s+=ring(dx,dy,r,{color:C.dim,w:3,fill:'#5a6b8c'})+line(dx,dy,dx+r*Math.cos(u*14),dy+r*Math.sin(u*14),{color:C.ink,w:3});
  s+=ring(rx,ry,r,{color:C.hi,w:9,fill:'#141d33'})+line(rx,ry,rx+r*Math.cos(u*12),ry+r*Math.sin(u*12),{color:C.faint,w:2});
  s+=label('円板',dx+r+10,dy-r-6,{size:24,color:C.ink})+label('輪',rx-r-10,ry-r-6,{size:24,color:C.hi,anchor:'end'});
  s+=card(700,90,460,330,label('同じ質量・同じ半径',930,150,{size:26,color:C.dim,anchor:'middle'})
   +label('重さが 外側（輪）',930,220,{size:28,color:C.hi,anchor:'middle'})+label('→ 回る分が 多い',930,270,{size:28,color:CW,anchor:'middle'})
   +fade(seg(p,.55,.7),label('→ 進む分が 少なく 遅れる',930,340,{size:28,color:CV,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'share2']:(p)=>{
  let s=card(200,110,800,280,label('回る分の 取り分',600,180,{size:30,color:CW,anchor:'middle',weight:700})
   +label('＝ 重さが 軸から どれだけ離れているか で決まる',600,250,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.2,.35),label('計算する式は 中級で',600,330,{size:30,color:C.hi,anchor:'middle'})),1);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>table([seg(p,.05,.2),seg(p,.15,.3),seg(p,.25,.4)])+disc(1.1,{omegaArrow:1,g:seg(p,0,.15)}),
 [K+'sum2']:(p)=>{
  const rev=.3*seg(p,0,1);let s=roll(rev,{paint:1,Rlbl:1});
  const cx=W.x0+rev*CIRC,cy=W.gy-W.R;s+=turn(cx,cy,W.R+22,-2.2,-.9,{color:CW})+arrow(cx,cy,cx+100,cy,{color:CV,w:6});
  s+=card(680,90,480,320,label('滑らずに 転がる',920,150,{size:28,color:C.ink,anchor:'middle'})+T(`${VV}=${RR}${OM}`,920,235,{size:56})
   +fade(seg(p,.4,.55),T(`0.5\\,\\mathrm{m}\\times4\\,\\mathrm{rad/s}=2\\,\\mathrm{m/s}`,920,340,{size:34})),seg(p,0,.12));
  return s;
 },
 [K+'sum3']:(p)=>{
  const x0=392,k=26;
  let s=label('位置エネルギーの減少',600,140,{size:28,color:CE,weight:700,anchor:'middle'})+rect(x0,160,16*k,40,{fill:CE,fo:.55,stroke:CE,rx:6})+label('mgh',600,189,{size:24,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.05,.25),rect(x0,230,10.7*k,40,{fill:CV,fo:.55,stroke:CV,rx:6})+label('前へ進む分',x0+10.7*k/2,259,{size:22,color:C.ink,anchor:'middle'})+rect(x0+10.7*k,230,5.3*k,40,{fill:CW,fo:.55,stroke:CW,rx:6})+label('回る分',x0+10.7*k+5.3*k/2,259,{size:22,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('転がる物体は 2つに 分ける',600,340,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('mgh ＝ ½mv² だけで 速さを求めない',600,410,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'next']:(p)=>{
  // accelerating train and a turntable
  const u=seg(p,0,1),tx=80+140*u*u;
  let s=line(40,300,560,300,{color:C.dim,w:3});
  s+=rect(tx,200,240,90,{fill:CR,fo:.25,stroke:CR,rx:12})+ring(tx+50,295,12,{color:C.dim,w:3,fill:C.bg})+ring(tx+190,295,12,{color:C.dim,w:3,fill:C.bg});
  s+=arrow(tx+250,240,tx+330,240,{color:CA,w:5})+label('加速',tx+262,225,{size:22,color:CA});
  const ang=TAU*.6*u;s+=`<ellipse cx="400" cy="420" rx="150" ry="42" fill="#1a2742" stroke="${C.dim}" stroke-width="3"/>`+dot(400+120*Math.cos(ang),420+34*Math.sin(ang),10,C.hi);
  s+=label('回る台',400,490,{size:24,color:C.dim,anchor:'middle'});
  s+=card(650,120,510,260,label('乗っている人から 見ると',905,190,{size:28,color:C.ink,anchor:'middle'})+label('運動の見え方は',905,255,{size:32,color:C.ink,anchor:'middle'})+label('変わる？',905,320,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
};
