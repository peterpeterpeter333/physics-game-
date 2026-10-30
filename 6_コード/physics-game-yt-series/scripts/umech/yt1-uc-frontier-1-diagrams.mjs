// YouTube シリーズ「慣性力と軌道・上級 1/4」(ys-uc-frontier-1) — 図。Stage 1200×515.
// 回る台は真上から見て反時計回り（ω は手前向き）。コリオリ力は −2m𝛚×𝐯′：右へ動く物体には画面の下向き（進む向きの右）。
// 色：r 水色、v 紫、a 赤、F 緑（慣性力は緑の破線）、T 金、ω 桃、強調 黄。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly} from './anim.mjs';

const K='uc-frontier-1:';
const SUN='#ffcf67',CR=C.x,CF=C.F,CA=C.a,CT=C.t,CW=C.p;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const top=(t='真上から見た図')=>label(t,30,40,{size:22,color:C.dim});
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function head(pts,color){const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1),H=15;
 return `<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-H*Math.cos(a)+H*.55*Math.sin(a)},${y2-H*Math.sin(a)-H*.55*Math.cos(a)} ${x2-H*Math.cos(a)-H*.55*Math.sin(a)},${y2-H*Math.sin(a)+H*.55*Math.cos(a)}" fill="${color}"/>`;}
function turnArc(cx,cy,r,a0,a1,{color=CW,w=4,g=1}={}){if(g<=0)return '';const pts=circPts(cx,cy,r,a0,a1,30);return fade(g,draw(pts,1,{color,w})+head(pts,color));}
const sun=(x,y,r=22,lab=1)=>dot(x,y,r,SUN)+(lab?L('太陽',x,y+r+30,{size:22,color:SUN}):'');
const planet=(x,y,r=12,c=C.x)=>dot(x,y,r,c)+ring(x,y,r,{color:C.ink,w:2});
const dashArrow=(x,y,X,Y,color=CF)=>{const a=Math.atan2(Y-y,X-x),H=16,bx=X-H*Math.cos(a),by=Y-H*Math.sin(a);
 return line(x,y,bx,by,{color,w:5,dash:'10 7'})+`<polygon points="${X},${Y} ${bx+H*.5*Math.sin(a)},${by-H*.5*Math.cos(a)} ${bx-H*.5*Math.sin(a)},${by+H*.5*Math.cos(a)}" fill="${color}"/>`;};

// ---- turntable (top view). ang = rotation of the table (rad, counter-clockwise) ----
const TC=[300,275],TR=200,RB=140;
function table(ang,{ball=1,string=1,omega=1,rlab=1,g=1}={}){
 const [cx,cy]=TC;let s=ring(cx,cy,TR,{color:C.dim,w:3,fill:'#121b30'});
 for(let k=0;k<6;k++){const a=ang+k*Math.PI/3;s+=line(cx,cy,cx+TR*Math.cos(a),cy-TR*Math.sin(a),{color:C.faint,w:2});}
 s+=dot(cx,cy,7,C.dim);
 const bx=cx+RB*Math.cos(ang),by=cy-RB*Math.sin(ang);
 if(string)s+=line(cx,cy,bx,by,{color:C.ink,w:2.5});
 if(rlab)s+=T(cs(CR,'r'),(cx+bx)/2-18*Math.sin(ang),(cy+by)/2-18*Math.cos(ang)-4,{size:30});
 if(ball)s+=dot(bx,by,16,C.x)+ring(bx,by,16,{color:C.ink,w:2});
 if(omega)s+=turnArc(cx,cy,TR+24,.25,1.05,{color:CW})+T(cs(CW,'\\omega'),cx+(TR+56)*Math.cos(.65),cy-(TR+56)*Math.sin(.65),{size:32});
 return fade(g,s);
}
const perpAt=(ang,along,side=30)=>{const [bx,by]=ballAt(ang);return [bx-Math.cos(ang)*along-Math.sin(ang)*side,by+Math.sin(ang)*along-Math.cos(ang)*side];};
const ballAt=ang=>[TC[0]+RB*Math.cos(ang),TC[1]-RB*Math.sin(ang)];
function inward(ang,len,color,{from=22,dashed=false}={}){const [bx,by]=ballAt(ang),ux=-Math.cos(ang),uy=Math.sin(ang);
 return dashed?'':arrow(bx+ux*from,by+uy*from,bx+ux*(from+len),by+uy*(from+len),{color,w:6,head:16});}
function outward(ang,len,color=CF){const [bx,by]=ballAt(ang),ux=Math.cos(ang),uy=-Math.sin(ang);return dashArrow(bx+ux*20,by+uy*20,bx+ux*(20+len),by+uy*(20+len),color);}

// derivation board rows
function rows(list,p,{x=600,y0=90,dy=95,size=44}={}){
 return list.map(([s,a,o={}],i)=>fade(a==null?1:seg(p,a,a+.12),T(s,o.x??x,o.y??(y0+i*dy),{size:o.size??size,opacity:o.dim?.45:1}))).join('');
}
const GMm=`\\dfrac{GMm}{r^2}`, rhs=`m\\,${cs(CR,'r')}\\left(\\dfrac{2\\pi}{${cs(CT,'T')}}\\right)^{2}`;

// circle orbit picture (left)
function circOrbit(p,{cx=300,cy=270,R=170,lab=1,acc=0,force=0,per=1}={}){
 const u=.6+2*Math.PI*.18*p,x=cx+R*Math.cos(u),y=cy-R*Math.sin(u);
 let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'})+sun(cx,cy,22,0)+L('M',cx,cy+52,{size:24,color:SUN});
 s+=arrow(cx+24*Math.cos(u),cy-24*Math.sin(u),x-14*Math.cos(u),y+14*Math.sin(u),{color:CR,w:4,head:13})+T(cs(CR,'r'),(cx+x)/2-16*Math.sin(u),(cy+y)/2-16*Math.cos(u),{size:30});
 const ox=18*Math.sin(u),oy=18*Math.cos(u);
 if(acc)s+=fade(acc,arrow(x-16*Math.cos(u)+ox,y+16*Math.sin(u)+oy,x-80*Math.cos(u)+ox,y+80*Math.sin(u)+oy,{color:CA,w:6,head:15}));
 if(force)s+=fade(force,arrow(x-16*Math.cos(u)+ox,y+16*Math.sin(u)+oy,x-80*Math.cos(u)+ox,y+80*Math.sin(u)+oy,{color:CF,w:6,head:15}));
 s+=planet(x,y)+L('m',x+26*Math.cos(u)+6,y-26*Math.sin(u)-10,{size:24,color:C.x});
 if(per)s+=turnArc(cx,cy,R+28,1.9,2.9,{color:CT,w:3})+L('周期 T',cx-R*.95,cy-R*.95,{size:24,color:CT});
 return s;
}

export const ytUcFrontier1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=top()+table(1.2*p,{rlab:0});
  s+=card(640,70,520,370,L('前回の 最後の 問い',900,120,{size:24,color:C.dim})
   +L('回る 観測者の 運動方程式に',900,190,{size:28,weight:700})+L('何が 加わる？',900,240,{size:32,color:C.hi,weight:700})
   +fade(seg(p,.4,.55),L('万有引力の もとで',900,320,{size:28,weight:700})+L('軌道は なぜ 楕円？',900,375,{size:32,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'plan']:(p)=>{
  const items=[['1','回る 観測者','円の 軌道'],['2','距離と 角度で','加速度'],['3','u ＝ 1/r の','置き換え'],['4','楕円の','軌道']];
  let s=L('慣性力と軌道・上級 4本の 道のり',600,60,{size:26,color:C.dim});
  items.forEach(([n,a,b],i)=>{const x=60+i*275,g=seg(p,.05+i*.12,.17+i*.12),hi=i===0;
   s+=fade(g,rect(x,130,250,250,{fill:hi?'#2a2a14':'#131f38',fo:.96,stroke:hi?C.hi:C.faint,sw:hi?3:2,rx:14})+L(n,x+125,200,{size:46,color:hi?C.hi:C.dim,weight:700})+L(a,x+125,275,{size:26,weight:700})+L(b,x+125,320,{size:26,weight:700}));
   if(i<3)s+=fade(g,L('→',x+262,265,{size:30,color:C.dim}));});
  s+=fade(seg(p,.6,.75),L('今回',185,430,{size:28,color:C.hi,weight:700})+L('一歩ずつ 導く',738,430,{size:28,color:C.dim,weight:700}));
  return s;
 },
 [K+'laws']:(p)=>{
  let s=L('使う 法則（実験・観測に 支えられた もの）',600,60,{size:26,color:C.dim});
  s+=card(80,110,480,300,L('慣性系での 運動方程式',320,165,{size:28,weight:700})+tex('ma=F',320,280,{size:64}),seg(p,.05,.18),CF);
  s+=card(640,110,480,300,L('万有引力',880,165,{size:28,weight:700})+T(`${cs(CF,'F')}=\\dfrac{GMm}{r^2}`,880,285,{size:56})+L('r：中心からの 距離',880,385,{size:22,color:C.dim}),seg(p,.4,.53),CF);
  return s;
 },
 [K+'predict']:(p)=>{
  const cx=280,cy=270;let s=top();
  s+=sun(cx,cy,18,0)+ring(cx,cy,90,{color:CR,w:2.5,dash:'6 6'})+ring(cx,cy,180,{color:CR,w:2.5,dash:'6 6'});
  const u1=.5+2*Math.PI*p*.5,u2=.5+2*Math.PI*p*.5/2.83;
  s+=planet(cx+90*Math.cos(u1),cy-90*Math.sin(u1),10)+planet(cx+180*Math.cos(u2),cy-180*Math.sin(u2),10);
  s+=line(cx,cy,cx+90,cy,{color:CR,w:3})+L('r',cx+48,cy-14,{size:24,color:CR})+line(cx,cy,cx-180,cy,{color:CR,w:3})+L('2r',cx-130,cy-14,{size:24,color:CR});
  s+=card(640,110,520,290,L('円の 軌道の 半径を 2倍に',900,170,{size:28,weight:700})
   +fade(seg(p,.3,.45),L('1周に かかる 時間 T は',900,250,{size:28,color:CT,weight:700})+L('何倍？',900,325,{size:42,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 // ===== S2 回る観測者に加わる項 =====
 [K+'table']:(p)=>{
  let s=top()+table(.8*p);
  s+=card(640,110,520,290,L('回る 台（角速度 ω）',900,170,{size:28,color:CW,weight:700})
   +fade(seg(p,.4,.55),L('中心から r の 所に 球',900,240,{size:28,weight:700})+L('糸で つながれ、台の 上で 静止',900,300,{size:24,color:C.dim})),seg(p,.02,.12));
  return s;
 },
 [K+'ground']:(p)=>{
  const ang=.3+1.4*p;let s=top('地上から 見た 図')+table(ang,{rlab:0})+draw(circPts(TC[0],TC[1],RB,0,2*Math.PI,60),1,{color:C.x,w:2,dash:'4 6'});
  s+=fade(seg(p,.35,.5),inward(ang,70,CA));
  const [bx,by]=ballAt(ang);{const [lx,ly]=perpAt(ang,60,-40);s+=fade(seg(p,.35,.5),T(cs(CA,'r\\omega^2'),lx,ly+10,{size:30}));}
  s+=card(640,110,520,290,L('地上の 観測者',900,165,{size:28,color:C.dim})+L('球は 半径 r の 円を 回る',900,230,{size:28,weight:700})
   +fade(seg(p,.35,.5),L('加速度：中心向きに',900,300,{size:26,color:CA,weight:700})+T(cs(CA,'r\\omega^2'),900,360,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'groundEq']:(p)=>{
  const ang=1.7+.6*p,[bx,by]=ballAt(ang);let s=top('地上から 見た 図')+table(ang,{rlab:0})+draw(circPts(TC[0],TC[1],RB,0,2*Math.PI,60),1,{color:C.x,w:2,dash:'4 6'});
  {const [lx,ly]=perpAt(ang,60,-34);s+=fade(seg(p,.1,.25),inward(ang,70,CF)+T(cs(CF,'F'),lx,ly+10,{size:32}));}
  s+=card(640,110,520,290,L('中心向きの 力 ＝ 糸の 力 F だけ',900,170,{size:26,color:CF,weight:700})
   +fade(seg(p,.45,.6),L('地上の 式',900,245,{size:24,color:C.dim})+T(`m\\,${cs(CA,'r\\omega^2')}=${cs(CF,'F')}`,900,320,{size:50})),seg(p,.02,.12));
  return s;
 },
 [K+'rot']:(p)=>{
  const ang=Math.PI*.9,[bx,by]=ballAt(ang);let s=top('台と 一緒に 回る 観測者から 見た 図')+table(ang,{rlab:0});
  s+=fade(seg(p,.4,.55),inward(ang,70,CF)+T(cs(CF,'F'),perpAt(ang,60,34)[0],perpAt(ang,60,34)[1]+10,{size:32}));
  s+=card(640,110,520,290,L('回る 観測者',900,165,{size:28,color:C.dim})+L('球は 止まって いる',900,225,{size:28,weight:700})+T(`${cs(CA,'a\'')}=0`,900,290,{size:40})
   +fade(seg(p,.4,.55),L('でも 糸は 中心へ 引く',900,360,{size:28,color:CF,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'cf']:(p)=>{
  const ang=Math.PI*.9,[bx,by]=ballAt(ang);let s=top('台と 一緒に 回る 観測者から 見た 図')+table(ang,{rlab:0})+inward(ang,70,CF)+T(cs(CF,'F'),perpAt(ang,60,34)[0],perpAt(ang,60,34)[1]+10,{size:32});
  s+=fade(seg(p,.1,.25),outward(ang,80)+T(cs(CF,'mr\\omega^2'),bx+Math.cos(ang)*60,by-Math.sin(ang)*60-34,{size:30}));
  s+=card(640,90,520,330,L('外向きの mrω² を 書き加える',900,145,{size:26,color:CF,weight:700})
   +fade(seg(p,.35,.5),T(`${cs(CF,'F')}-${cs(CF,'mr\\omega^2')}=0`,900,230,{size:46}))+fade(seg(p,.35,.5),L('釣り合いの 式',900,290,{size:24,color:C.dim}))
   +fade(seg(p,.7,.82),L('遠心力',900,370,{size:40,color:CF,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'notReal']:(p)=>{
  const ang=Math.PI*.9,[bx,by]=ballAt(ang);let s=top('台と 一緒に 回る 観測者から 見た 図')+table(ang,{rlab:0})+inward(ang,70,CF)+outward(ang,80);
  s+=fade(seg(p,.15,.3),L('引く 相手？',bx-20,by+70,{size:26,color:C.a,weight:700}));
  s+=card(640,90,520,330,L('遠心力',900,145,{size:32,color:CF,weight:700})
   +fade(seg(p,.1,.25),L('押す・引く 相手が いない',900,215,{size:28,weight:700}))
   +fade(seg(p,.4,.55),L('反作用も ない',900,275,{size:28,weight:700}))
   +fade(seg(p,.6,.75),L('回る 観測者の 式に だけ 入る',900,345,{size:24,color:C.dim})+L('慣性力',900,395,{size:32,color:CF,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'num']:(p)=>{
  const ang=Math.PI*.9,[bx,by]=ballAt(ang);let s=top('台と 一緒に 回る 観測者から 見た 図')+table(ang,{rlab:0})+inward(ang,70,CF)+outward(ang,80);
  s+=fade(seg(p,.6,.75),L('2 N',perpAt(ang,60,-40)[0],perpAt(ang,60,-40)[1]+10,{size:26,color:CF,weight:700})+L('2 N',bx+Math.cos(ang)*70,by-Math.sin(ang)*70+44,{size:26,color:CF,weight:700}));
  s+=card(640,80,520,350,L('中級の 数',900,125,{size:24,color:C.dim})
   +T(`m=0.5\\ \\mathrm{kg},\\ r=1\\ \\mathrm{m},\\ \\omega=2\\ \\mathrm{rad/s}`,900,190,{size:30})
   +fade(seg(p,.25,.4),T(`mr\\omega^2=0.5\\times1\\times2^2`,900,270,{size:38}))
   +fade(seg(p,.45,.6),T(`=2\\ \\mathrm{N}`,900,340,{size:42}))
   +fade(seg(p,.65,.8),L('遠心力 ＝ 糸の 力 ＝ 2 N',900,405,{size:26,color:CF,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'coriolis']:(p)=>{
  const [cx,cy]=TC;let s=top('台と 一緒に 回る 観測者から 見た 図')+table(.4,{ball:0,string:0,rlab:0});
  const x=cx-170+150*seg(p,.05,.6),y=cy-40;
  s+=dot(x,y,14,C.hi)+ring(x,y,14,{color:C.ink,w:2});
  s+=arrow(x+18,y,x+110,y,{color:C.v,w:6,head:16})+T(cs(C.v,"v'"),x+120,y-16,{size:30,anchor:'start'});
  s+=fade(seg(p,.3,.45),dashArrow(x,y+18,x,y+100,CF)+L('コリオリ力',x+14,y+90,{size:24,color:CF,weight:700,anchor:'start'}));
  s+=card(640,90,520,330,L('台の 上を 動く 物体',900,145,{size:28,color:C.dim})
   +fade(seg(p,.3,.45),L('コリオリ力（慣性力）',900,215,{size:30,color:CF,weight:700})+L('速度に 直角',900,275,{size:30,weight:700}))
   +fade(seg(p,.65,.8),L('導き方は ここでは 扱わない',900,360,{size:24,color:C.dim})),seg(p,.02,.12));
  return s;
 },
 [K+'switch']:(p)=>{
  let s=card(30,60,450,230,L('地上（慣性系）',255,105,{size:26,color:C.dim})+tex('ma=F',255,195,{size:46})+L('遠心力は 入れない',255,262,{size:22,color:C.dim}),seg(p,0,.12));
  s+=card(720,60,450,230,L('回る 観測者',945,105,{size:26,color:C.dim})+T(`${cs(CF,'F')}-${cs(CF,'mr\\omega^2')}=0`,945,195,{size:40})+L('慣性力を 足す',945,262,{size:22,color:C.dim}),seg(p,0,.12));
  s+=fade(seg(p,.1,.25),L('混ぜない',600,185,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.6),card(250,330,700,150,L('ここからは：太陽に 固定した 慣性系',600,385,{size:30,color:SUN,weight:700})+L('惑星の 運動',600,440,{size:26,weight:700}),1,SUN));
  return s;
 },
 // ===== S3 ケプラーの3法則 =====
 [K+'kepler']:(p)=>{
  const cx=300,cy=270,a=220,e=.5,b=a*Math.sqrt(1-e*e);let s=top('観測の 記録（イメージ）');
  s+=sun(cx+a*e,cy,18,1);
  for(let i=0;i<14;i++){const u=2*Math.PI*i/14,g=seg(p,.05+i*.03,.1+i*.03);s+=fade(g,ring(cx+a*Math.cos(u),cy-b*Math.sin(u),6,{color:C.x,w:2.5}));}
  s+=card(640,90,520,330,L('ティコ・ブラーエ',900,145,{size:28,weight:700})+L('約 20年の 観測 記録',900,200,{size:26,color:C.dim})
   +fade(seg(p,.5,.62),L('↓ ケプラーが 調べる',900,265,{size:26,color:C.dim})+L('3つの 規則',900,340,{size:40,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'law12']:(p)=>{
  const cx=300,cy=265,a=230,e=.6,b=a*Math.sqrt(1-e*e),fx=cx+a*e;let s=top();
  const Ean=t=>{const M=2*Math.PI*t;let E=M;for(let i=0;i<30;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E;};
  const pos=t=>{const E=Ean(t);return [cx+a*Math.cos(E),cy-b*Math.sin(E)];};
  s+=draw(Array.from({length:121},(_,i)=>{const u=2*Math.PI*i/120;return [cx+a*Math.cos(u),cy-b*Math.sin(u)];}),1,{color:C.dim,w:2.5});
  s+=sun(fx,cy,18,0)+L('焦点（太陽）',fx,cy+72,{size:22,color:SUN});
  const wedge=(t0,t1,g)=>{const pts=[[fx,cy]];for(let i=0;i<=24;i++)pts.push(pos(t0+(t1-t0)*i/24));return fade(g,poly(pts,{fill:C.hi,fo:.35,stroke:C.hi,sw:1.5}));};
  s+=wedge(-.04,.04,seg(p,.55,.68))+wedge(.46,.54,seg(p,.6,.73));
  const [x,y]=pos(.15+.5*p);s+=planet(x,y,10);
  s+=card(640,80,520,350,L('第1法則',900,130,{size:26,color:C.hi,weight:700})+L('太陽を 焦点と する 楕円',900,180,{size:28,weight:700})
   +fade(seg(p,.5,.62),L('第2法則',900,265,{size:26,color:C.hi,weight:700})+L('面積速度は 一定',900,315,{size:28,weight:700})+L('同じ 時間 → 同じ 面積',900,370,{size:22,color:C.dim})),seg(p,.02,.12));
  return s;
 },
 [K+'law3']:(p)=>{
  const A=axes0();let s=A.svg;
  const data=[['水星',.0580,.0581],['金星',.378,.378],['地球',1,1],['火星',3.54,3.538]];
  s+=fade(seg(p,.4,.55),draw([[A.X(0),A.Y(0)],[A.X(4),A.Y(4)]],1,{color:C.hi,w:2.5,dash:'7 7'}));
  data.forEach(([n,x3,t2],i)=>{const g=seg(p,.08+i*.08,.18+i*.08);s+=fade(g,dot(A.X(x3),A.Y(t2),9,C.x)+L(n,A.X(x3)+(i===3?-18:18),A.Y(t2)+(i===3?-16:28),{size:22,color:C.x,anchor:i===3?'end':'start'}));});
  s+=card(640,90,520,330,L('第3法則',900,145,{size:26,color:C.hi,weight:700})+L('周期の 2乗 ∝ 大きさの 3乗',900,205,{size:28,weight:700})
   +fade(seg(p,.55,.68),L('どれも 観測から',900,290,{size:28,weight:700})+L('見つかった 規則',900,340,{size:28,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'which']:(p)=>kCards(p,0),
 [K+'roadmap']:(p)=>kCards(p,1),
 // ===== S4 第3法則を3行で =====
 [K+'setup']:(p)=>{
  let s=top()+circOrbit(p);
  s+=card(640,110,520,290,L('太陽 M（動かない）',900,170,{size:28,color:SUN,weight:700})
   +fade(seg(p,.25,.4),L('惑星 m：半径 r の 円',900,240,{size:28,weight:700}))
   +fade(seg(p,.5,.65),L('周期 T で 1周',900,310,{size:28,color:CT,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'omega']:(p)=>{
  let s=top()+circOrbit(p,{acc:seg(p,.45,.6)});
  s+=card(640,90,520,330,L('1周 2π を 時間 T で',900,140,{size:26,color:C.dim})
   +T(`\\omega=\\dfrac{2\\pi}{${cs(CT,'T')}}`,900,225,{size:46})
   +fade(seg(p,.45,.6),L('加速度（中心向き）',900,300,{size:24,color:CA,weight:700})+T(`${cs(CA,'a')}=r\\omega^2=${cs(CR,'r')}\\left(\\dfrac{2\\pi}{${cs(CT,'T')}}\\right)^{2}`,900,370,{size:38})),seg(p,.02,.12));
  return s;
 },
 [K+'eom']:(p)=>{
  let s=rows([[`m${cs(CA,'a')}=${cs(CF,'F')}`,0],[`${cs(CF,GMm)}=${rhs}`,.35]],p,{y0:100,dy:250,size:54});
  s+=fade(seg(p,.2,.35),L('F に 万有引力、a に r(2π/T)² を 入れる',600,215,{size:26,color:C.dim}));
  return s;
 },
 [K+'line1']:(p)=>{
  const g=seg(p,.1,.25),cm=g>.5?`{\\color{${CA}}{\\cancel{\\color{#9aabc7}{m}}}}`:'m';
  let s=T(`\\dfrac{GM${cm}}{r^2}=${cm}\\,${cs(CR,'r')}\\left(\\dfrac{2\\pi}{${cs(CT,'T')}}\\right)^{2}`,600,90,{size:44});
  s+=L('1行目：両辺の m を 消す',600,190,{size:28,color:C.hi,weight:700});
  const e1=`\\dfrac{GM}{r^2}=${cs(CR,'r')}\\left(\\dfrac{2\\pi}{${cs(CT,'T')}}\\right)^{2}`;
  s+=fade(seg(p,.3,.45),T(e1,600,330,{size:54}));
  s+=fade(seg(p,.6,.75),L('惑星の 質量 m に よらない',600,450,{size:26,weight:700}));
  return s;
 },
 [K+'line2']:(p)=>{
  let s=T(`\\dfrac{GM}{r^2}=${cs(CR,'r')}\\left(\\dfrac{2\\pi}{${cs(CT,'T')}}\\right)^{2}`,600,80,{size:42,opacity:.55});
  s+=L('2行目：両辺に r²T² を 掛ける',600,175,{size:28,color:C.hi,weight:700});
  s+=fade(seg(p,.2,.35),T(`\\dfrac{GM}{r^2}\\times r^2${cs(CT,'T')}^2=${cs(CR,'r')}\\dfrac{4\\pi^2}{${cs(CT,'T')}^2}\\times r^2${cs(CT,'T')}^2`,600,280,{size:42}));
  s+=fade(seg(p,.55,.7),T(`GM${cs(CT,'T')}^2=4\\pi^2${cs(CR,'r')}^3`,600,420,{size:54}));
  return s;
 },
 [K+'line3']:(p)=>{
  let s=T(`GM${cs(CT,'T')}^2=4\\pi^2${cs(CR,'r')}^3`,600,80,{size:44,opacity:.55});
  s+=L('3行目：両辺を GM で 割る',600,160,{size:28,color:C.hi,weight:700});
  s+=fade(seg(p,.2,.35),T(`${cs(CT,'T')}^2=\\dfrac{4\\pi^2${cs(CR,'r')}^3}{GM}`,600,315,{size:64}));
  s+=fade(seg(p,.2,.35),rect(365,195,470,235,{fill:C.hi,fo:.05,stroke:C.hi,sw:2.5,rx:12}));
  s+=fade(seg(p,.6,.75),L('周期の 2乗 ∝ 半径の 3乗',600,475,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'answer']:(p)=>{
  const cx=260,cy=270;let s=top()+sun(cx,cy,16,0)+ring(cx,cy,90,{color:CR,w:2.5,dash:'6 6'})+ring(cx,cy,180,{color:CR,w:2.5,dash:'6 6'});
  s+=line(cx,cy,cx+90,cy,{color:CR,w:3})+L('r',cx+45,cy-12,{size:24,color:CR})+line(cx,cy,cx-180,cy,{color:CR,w:3})+L('2r',cx-135,cy-12,{size:24,color:CR});
  s+=card(560,70,600,380,T(`${cs(CR,'r')}\\to 2${cs(CR,'r')}`,860,125,{size:40})
   +fade(seg(p,.15,.3),T(`${cs(CR,'r')}^3:\\ \\times 8`,860,200,{size:40}))
   +fade(seg(p,.3,.45),T(`${cs(CT,'T')}^2:\\ \\times 8`,860,270,{size:40}))
   +fade(seg(p,.5,.65),T(`${cs(CT,'T')}:\\ \\times\\sqrt{8}\\approx 2.83`,860,350,{size:44}))
   +fade(seg(p,.7,.82),L('予想の 答え：約 2.83倍',860,420,{size:28,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=card(80,60,460,170,L('観測から 見つかった 規則',310,110,{size:24,color:C.dim})+L('ケプラーの 第3法則',310,175,{size:30,weight:700}),seg(p,0,.1));
  s+=fade(seg(p,.1,.25),L('→',600,155,{size:40,color:C.hi}));
  s+=card(660,60,460,170,L('導いた 結果',890,110,{size:24,color:C.dim})+tex('ma=F',800,175,{size:34})+L('＋ 万有引力',960,185,{size:26,weight:700}),seg(p,.1,.25),CF);
  s+=fade(seg(p,.45,.6),T(`${cs(CT,'T')}^2=\\dfrac{4\\pi^2}{GM}\\,${cs(CR,'r')}^3`,600,350,{size:56}));
  s+=fade(seg(p,.65,.8),line(505,410,655,410,{color:C.hi,w:3})+L('係数から GM が 読める',580,465,{size:26,color:C.hi,weight:700}));
  return s;
 },
 // ===== S5 数で確かめる =====
 [K+'gm']:(p)=>{
  let s=earth(260,270,90,p)+L('地球',260,400,{size:24,color:C.x});
  s+=card(560,110,600,290,L('地球の GM',860,170,{size:28,weight:700})
   +fade(seg(p,.2,.35),T(`GM=3.986\\times10^{14}\\ \\mathrm{m^3/s^2}`,860,265,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'geo']:(p)=>{
  const ang=.3+2*Math.PI*.35*p;let s=top()+earth(260,270,60,0,ang)+ring(260,270,190,{color:C.faint,w:2,dash:'6 7'});
  const sx=260+190*Math.cos(ang+.0),sy=270-190*Math.sin(ang);
  s+=line(260+60*Math.cos(ang),270-60*Math.sin(ang),sx,sy,{color:C.hi,w:2,dash:'5 6'})+rect(sx-12,sy-8,24,16,{fill:C.v,fo:.9,rx:3})+line(sx-26,sy,sx+26,sy,{color:C.v,w:3});
  s+=card(560,90,600,330,L('1回 自転する 時間',860,145,{size:26,color:C.dim})+T(`${cs(CT,'T')}=86164\\ \\mathrm{s}`,860,215,{size:44})
   +fade(seg(p,.45,.6),L('同じ 向きに 同じ 周期で 1周',860,290,{size:26,weight:700})+L('地上からは 止まって 見える',860,345,{size:26,color:C.hi,weight:700})+L('静止衛星',860,400,{size:30,color:C.v,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'geoR']:(p)=>{
  let s=rows([[`${cs(CR,'r')}^3=\\dfrac{GM${cs(CT,'T')}^2}{4\\pi^2}`,0,{x:330,y:120,size:46}],[`${cs(CR,'r')}\\approx 4.22\\times10^{7}\\ \\mathrm{m}`,.3,{x:330,y:270,size:44}]],p);
  s+=fade(seg(p,.6,.72),card(660,170,500,200,L('地上からの 高さ',910,225,{size:26,color:C.dim})+L('約 35800 km',910,300,{size:40,color:C.hi,weight:700}),1,C.hi));
  s+=fade(seg(p,.6,.72),L('（4.22×10⁷ m − 地球の 半径 6.38×10⁶ m）',600,470,{size:22,color:C.dim}));
  return s;
 },
 [K+'moon']:(p)=>{
  let s=rows([[`${cs(CR,'r')}=3.84\\times10^{8}\\ \\mathrm{m}`,0,{y:75,size:42}],[`${cs(CT,'T')}^2=\\dfrac{4\\pi^2${cs(CR,'r')}^3}{GM}`,.15,{y:185,size:44}],[`${cs(CT,'T')}\\approx 2.37\\times10^{6}\\ \\mathrm{s}`,.4,{x:480,y:310,size:44}]],p);
  s+=fade(seg(p,.4,.52),L('≈ 27.4 日',820,322,{size:42,color:CT,weight:700}));
  s+=fade(seg(p,.65,.78),L('観測：27.3 日 → ほぼ 一致',600,440,{size:30,color:CF,weight:700}));
  return s;
 },
 [K+'year']:(p)=>{
  let s=L('太陽の まわり',600,50,{size:26,color:SUN,weight:700});
  s+=rows([[`GM=1.327\\times10^{20}\\ \\mathrm{m^3/s^2}`,0,{y:120,size:38}],[`${cs(CR,'r')}=1.496\\times10^{11}\\ \\mathrm{m}`,.15,{y:205,size:40}],[`${cs(CT,'T')}\\approx 3.156\\times10^{7}\\ \\mathrm{s}`,.4,{x:470,y:320,size:44}]],p);
  s+=fade(seg(p,.4,.52),L('≈ 365.3 日',830,332,{size:42,color:CT,weight:700}));
  s+=fade(seg(p,.65,.78),L('1年',600,440,{size:40,color:C.hi,weight:700}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(60,60,520,380,L('回る 観測者の 式に 加わる 項',320,110,{size:26,color:C.dim})
   +L('遠心力 mrω²（外向き）',320,190,{size:30,color:CF,weight:700})
   +fade(seg(p,.4,.55),L('動く 物体には',320,270,{size:26,color:C.dim})+L('コリオリ力（速度に 直角）',320,325,{size:30,color:CF,weight:700}))
   +fade(seg(p,.6,.75),L('どちらも 慣性力（相手 なし）',320,400,{size:24,color:C.dim})),seg(p,0,.1),CF);
  return s+moveTable(Math.PI*.9);
 },
 [K+'sum2']:(p)=>{
  let s=top()+circOrbit(p,{force:1,per:1});
  s+=card(640,110,520,290,L('円の 軌道（導いた 結果）',900,165,{size:26,color:C.dim})+T(`${cs(CT,'T')}^2=\\dfrac{4\\pi^2${cs(CR,'r')}^3}{GM}`,900,280,{size:54}),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'bridge']:(p)=>{
  const cx=300,cy=265,a=230,e=.6,b=a*Math.sqrt(1-e*e),fx=cx+a*e;let s=top();
  s+=draw(Array.from({length:121},(_,i)=>{const u=2*Math.PI*i/120;return [cx+a*Math.cos(u),cy-b*Math.sin(u)];}),1,{color:C.dim,w:2,dash:'6 7'})+sun(fx,cy,18,0);
  const Ean=t=>{const M=2*Math.PI*t;let E=M;for(let i=0;i<30;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E;};
  const E=Ean(.05+.6*p),x=cx+a*Math.cos(E),y=cy-b*Math.sin(E),r=Math.hypot(x-fx,y-cy);
  s+=arrow(fx+(x-fx)/r*22,cy+(y-cy)/r*22,x-(x-fx)/r*13,y-(y-cy)/r*13,{color:CR,w:5,head:14})+planet(x,y)+T(cs(CR,'r'),(fx+x)/2-14,(cy+y)/2-12,{size:30});
  s+=card(640,110,520,290,L('本当の 軌道は 楕円',900,170,{size:30,weight:700})
   +fade(seg(p,.3,.45),L('太陽からの 距離 r が',900,250,{size:28,color:CR,weight:700})+L('時間と ともに 変わる',900,305,{size:28,color:CR,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'next']:(p)=>{
  const ox=200,oy=400,rr=260,th=.75;let s=top();
  s+=arrow(ox-20,oy,ox+380,oy,{color:C.faint,w:2,head:12})+sun(ox,oy,16,0);
  const x=ox+rr*Math.cos(th),y=oy-rr*Math.sin(th);
  s+=arrow(ox+18*Math.cos(th),oy-18*Math.sin(th),x-13*Math.cos(th),y+13*Math.sin(th),{color:CR,w:5,head:14})+planet(x,y);
  s+=T(cs(CR,'r'),(ox+x)/2-20,(oy+y)/2-14,{size:32});
  s+=draw(circPts(ox,oy,70,0,th,20),1,{color:C.E,w:3})+T(cs(C.E,'\\theta'),ox+92,oy-26,{size:30});
  s+=card(600,90,560,340,L('次の 問い',880,140,{size:24,color:C.dim})
   +L('中心からの 距離 r と 角度 θ で',880,210,{size:28,weight:700})
   +fade(seg(p,.35,.5),L('加速度は どんな 形？',880,300,{size:36,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
};

function moveTable(ang){return `<g transform="translate(600 20) scale(.9)">${table(ang,{rlab:0})+inward(ang,70,CF)+outward(ang,80)}</g>`;}
function axes0(){
 const x=110,y=440,w=420,h=340,X=u=>x+w*u/4,Y=v=>y-h*v/4;
 let s=arrow(x-10,y,x+w+30,y,{color:C.dim,w:2.5,head:14})+arrow(x,y+10,x,y-h-30,{color:C.dim,w:2.5,head:14});
 [1,2,3,4].forEach(k=>{s+=line(X(k),y-6,X(k),y+6,{color:C.dim})+label(String(k),X(k),y+32,{size:21,color:C.dim,anchor:'middle'})+line(x-6,Y(k),x+6,Y(k),{color:C.dim})+label(String(k),x-14,Y(k)+8,{size:21,color:C.dim,anchor:'end'});});
 s+=label('（軌道の 大きさ）³',x+w-10,y+64,{size:22,color:CR,anchor:'middle'})+label('（周期）²',x+10,y-h-40,{size:22,color:CT,anchor:'start'});
 s+=label('地球を 1 と した 比',x+130,y-h-40,{size:22,color:C.dim,anchor:'start'});
 return {svg:s,X,Y};
}
function kCards(p,mode){
 const list=[['第1法則','楕円',mode?'3本目・4本目で 導く':'？',mode?C.hi:C.dim],['第2法則','面積速度 一定','角運動量・上級で 導いた',CF],['第3法則','T² ∝ r³',mode?'今回（円の 軌道）':'？',mode?C.hi:C.dim]];
 let s=L(mode?'どこで 導くか':'万有引力 ＋ 運動方程式 から 導ける？',600,60,{size:28,color:C.dim,weight:700});
 list.forEach(([a,b,c,col],i)=>{const x=60+i*370,g=seg(p,.05+i*.12,.17+i*.12);
  s+=fade(g,rect(x,110,340,300,{fill:'#131f38',fo:.96,stroke:col,sw:2.5,rx:14})+L(a,x+170,170,{size:28,color:C.dim,weight:700})+L(b,x+170,240,{size:32,weight:700})+L(c,x+170,330,{size:c.length>4?24:44,color:col,weight:700}));});
 return s;
}
function earth(x,y,r,p,ang=0){
 let s=dot(x,y,r,'#2b6cb0')+ring(x,y,r,{color:C.x,w:2});
 s+=fade(.6,`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.35}" fill="none" stroke="${C.x}" stroke-width="1.5"/>`);
 if(ang)s+=dot(x+r*Math.cos(ang),y-r*Math.sin(ang),7,C.hi);
 return s;
}
