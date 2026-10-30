// YouTube シリーズ「慣性力と軌道・上級 3/4」(ys-uc-frontier-3) — 図。Stage 1200×515.
// 左：いまの一操作。右：置き換えた「部品」の帳簿（dθ/dt、dr/dt、d²r/dt²、r(dθ/dt)²、−GM/r²）が順にたまる。
// 色：r 水色、u 青緑、θ 橙、h 黄、時間 t 金、力 緑。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly} from './anim.mjs';

const K='uc-frontier-3:';
const SUN='#ffcf67',CR=C.x,CU='#7fe0c8',CANG=C.E,CH=C.hi,CT=C.t,CF=C.F;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const top=(t='真上から見た図')=>label(t,30,40,{size:22,color:C.dim});
const u=cs(CU,'u'),h=cs(CH,'h'),th='\\theta';
const D=(a,b='t')=>`\\dfrac{d${a}}{d${b}}`,DD=(a,b='t')=>`\\dfrac{d^2${a}}{d${b}^2}`;
const sd=(a,b='t')=>`d${a}/d${b}`;
const sun=(x,y,r=16)=>dot(x,y,r,SUN);
const planet=(x,y,r=11)=>dot(x,y,r,C.x)+ring(x,y,r,{color:C.ink,w:2});
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});

// ---- parts ledger (right) -----------------------------------------------------------------------
const PARTS=[
 [`d\\theta/dt`,`${h}${u}^2`],
 [`dr/dt`,`-${h}\\,(d${u}/d\\theta)`],
 [`d^2r/dt^2`,`-${h}^2${u}^2(d^2${u}/d\\theta^2)`],
 [`r\\,(d\\theta/dt)^{2}`,`${h}^2${u}^3`],
 [`-GM/r^2`,`-GM${u}^2`],
];
function parts(n,hi=-1,g=1){
 if(n<=0)return '';
 let s=rect(742,62,450,440,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+L('u で 書いた 部品',967,98,{size:22,color:C.dim});
 for(let i=0;i<n;i++){const y=160+i*78,on=i===hi;
  if(on)s+=rect(752,y-32,430,64,{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:10});
  s+=T(PARTS[i][0],890,y,{size:27,anchor:'end'})+T('=',910,y,{size:27})+T(PARTS[i][1],930,y,{size:27,anchor:'start'});}
 return fade(g,s);
}
// left board rows (x center 400)
function rows(list,p,{x=400,y0=110,dy=110,size=40}={}){return list.map(([s,a,o={}],i)=>fade(a==null?1:seg(p,a,a+.12),T(s,o.x??x,o.y??(y0+i*dy),{size:o.size??size,opacity:o.dim?.45:1}))).join('');}
const note=(s,x,y,g=1,color=C.hi,size=26)=>fade(g,L(s,x,y,{size,color,weight:700}));

// ---- small pictures -------------------------------------------------------------------------------
function orbit(p,{cx=300,cy=270,a=230,e=.6,lab=1}={}){
 const b=a*Math.sqrt(1-e*e),fx=cx+a*e;
 const Ean=t=>{const M=2*Math.PI*t;let E=M;for(let i=0;i<30;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E;};
 const E=Ean(p),x=cx+a*Math.cos(E),y=cy-b*Math.sin(E);
 let s=draw(Array.from({length:121},(_,i)=>{const q=2*Math.PI*i/120;return [cx+a*Math.cos(q),cy-b*Math.sin(q)];}),1,{color:C.dim,w:2,dash:'6 7'})+sun(fx,cy,18);
 const ang=Math.atan2(cy-y,x-fx);
 s+=line(fx,cy,x,y,{color:CR,w:3})+planet(x,y);
 if(lab)s+=T(cs(CR,'r'),(fx+x)/2-18*Math.sin(ang),(cy+y)/2-18*Math.cos(ang),{size:30})+line(fx,cy,fx+90,cy,{color:C.faint,w:2})+draw(circPts(fx,cy,46,0,ang<0?ang+2*Math.PI:ang,24),1,{color:CANG,w:3})+T(cs(CANG,th),fx+62*Math.cos((ang<0?ang+2*Math.PI:ang)/2),cy-62*Math.sin((ang<0?ang+2*Math.PI:ang)/2)+10,{size:26});
 return s;
}
function gear(cx,cy,R,rot,color,lab,teeth=10){
 const pts=[];for(let i=0;i<teeth*2;i++){const a=rot+Math.PI*i/teeth,rr=i%2?R:R*.82;pts.push([cx+rr*Math.cos(a-.12),cy-rr*Math.sin(a-.12)],[cx+rr*Math.cos(a+.12),cy-rr*Math.sin(a+.12)]);}
 return poly(pts,{fill:color,fo:.18,stroke:color,sw:3})+ring(cx,cy,R*.3,{color,w:2})+T(lab,cx,cy+10,{size:40});
}
function gears(p,{hl=0}={}){
 const a=2*Math.PI*.5*p;
 let s=gear(170,290,95,a,CT,cs(CT,'t'))+gear(400,290,95,-a+.31,CANG,cs(CANG,th))+gear(630,290,95,a,CU,u);
 s+=fade(hl?1:.9,L('倍率',285,140,{size:22,color:C.dim})+T(`${D(th)}=${h}${u}^2`,285,190,{size:30}));
 s+=L('倍率',515,140,{size:22,color:C.dim})+T(D(u,th),515,190,{size:30});
 return s;
}
// u–θ wave
function wave(p,{x0=80,y0=270,w=600,hA=110,showMid=1}={}){
 const X=q=>x0+w*q/(2*Math.PI),Y=v=>y0-hA*v;
 let s=arrow(x0-10,y0+hA*1.6,x0+w+30,y0+hA*1.6,{color:C.dim,w:2,head:12})+label('θ',x0+w+38,y0+hA*1.6+8,{size:24,color:CANG});
 s+=arrow(x0,y0+hA*1.6+10,x0,y0-hA*1.6,{color:C.dim,w:2,head:12})+T(u,x0,y0-hA*1.6-24,{size:28});
 if(showMid)s+=line(x0,y0,x0+w,y0,{color:CH,w:2,dash:'7 6'})+T(`\\dfrac{GM}{${h}^2}`,x0-14,y0+4,{size:24,anchor:'end'});
 s+=draw(Array.from({length:121},(_,i)=>{const q=2*Math.PI*i/120;return [X(q),Y(.6*Math.cos(q))];}),clamp(p),{color:CU,w:4});
 [[0,'0'],[Math.PI,'π'],[2*Math.PI,'2π']].forEach(([q,t])=>{s+=label(t,X(q),y0+hA*1.6+30,{size:22,color:C.dim,anchor:'middle'});});
 return s;
}

export const ytUcFrontier3Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  let s=top()+orbit(.1+.5*p);
  s+=card(640,90,520,330,L('前回の 最後の 問い',900,140,{size:24,color:C.dim})+T(`${u}=\\dfrac{1}{r},\\qquad t\\ \\to\\ \\theta`,900,230,{size:44})
   +fade(seg(p,.4,.55),L('軌道の 式は どうなる？',900,330,{size:34,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=L('前回（2/4）の 結果',600,60,{size:26,color:C.dim});
  s+=card(80,100,1040,150,L('① 半径方向',200,182,{size:26,color:CR,weight:700})+T(`${DD('r')}-r\\left(${D(th)}\\right)^{2}=-\\dfrac{GM}{r^2}`,690,175,{size:44}),seg(p,.05,.18));
  s+=card(80,290,1040,150,L('② 中心力',200,372,{size:26,color:CF,weight:700})+T(`r^2\\,${D(th)}=${h}`,620,365,{size:46})+L('一定',820,377,{size:30,color:CH,weight:700}),seg(p,.5,.63));
  return s;
 },
 [K+'aim']:(p)=>{
  let s=top()+orbit(.05+.6*p);
  s+=card(640,90,520,330,L('ほしいもの：軌道の 形',900,145,{size:28,weight:700})+L('角度 θ の ときの 距離 r',900,215,{size:28,color:CR,weight:700})
   +fade(seg(p,.45,.6),L('時刻 t は 使わない',900,300,{size:30,color:CT,weight:700})+T(`r(t)\\ \\to\\ r(\\theta)`,900,370,{size:38})),seg(p,.02,.12));
  return s;
 },
 [K+'why']:(p)=>{
  let s=rows([[`-\\dfrac{GM}{r^2}`,0,{x:300,y:200,size:56}],[`=-GM\\,${u}^2`,.4,{x:640,y:200,size:56}]],p);
  s+=fade(seg(p,.25,.38),L('u ＝ 1/r なら 1/r² ＝ u²',600,330,{size:30,color:CU,weight:700}));
  s+=fade(seg(p,.6,.72),L('引力の 項が 簡単な 形に',600,420,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=card(200,80,800,340,L('置き換えた あとの 式は',600,150,{size:30,weight:700})+L('これまでに 解いた どの 式に 似ている？',600,230,{size:30,weight:700})
   +fade(seg(p,.35,.5),L('（予想してから 先へ）',600,330,{size:26,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 // ===== S2 時間から角度へ =====
 [K+'om1']:(p)=>rows([[`r^2\\,${D(th)}=${h}`,0,{y:110,size:48}],[`${D(th)}=\\dfrac{${h}}{r^2}`,.45,{y:300,size:52}]],p)+note('両辺を r² で 割る',400,200,seg(p,.25,.38))+parts(0),
 [K+'om2']:(p)=>rows([[`${D(th)}=\\dfrac{${h}}{r^2}`,0,{y:100,size:44,dim:1}],[`\\dfrac{1}{r}=${u}\\ \\Rightarrow\\ \\dfrac{1}{r^2}=${u}^2`,.1,{y:220,size:44}],[`${D(th)}=${h}${u}^2`,.5,{y:360,size:56}]],p)+fade(seg(p,.55,.7),parts(1,0)),
 [K+'gear']:(p)=>gears(p)+parts(1)+fade(seg(p,.1,.25),L('時間 → 角度 → u',400,460,{size:28,weight:700})),
 [K+'gear2']:(p)=>{
  let s=gears(p,{hl:1})+parts(1,0);
  s+=fade(seg(p,.3,.45),T(`\\dfrac{d}{dt}=${D(th)}\\times\\dfrac{d}{d\\theta}=${h}${u}^2\\,\\dfrac{d}{d\\theta}`,400,450,{size:34}));
  return s;
 },
 // ===== S3 連鎖律を2回 =====
 [K+'dr1']:(p)=>rows([[`r=\\dfrac{1}{${u}}`,0,{y:100,size:44}],[`${D('r')}=-\\dfrac{1}{${u}^2}\\,${D(u)}`,.3,{y:250,size:48}]],p)+note('1つ目：dr/dt',400,400,seg(p,.05,.15),CR)+parts(1),
 [K+'dr2']:(p)=>rows([[`${D(u)}=${D(u,th)}\\times${D(th)}`,0,{y:110,size:46}],[`=${D(u,th)}\\times ${h}${u}^2`,.4,{y:270,size:46}]],p)+note('θ を 通す（連鎖律）',400,400,seg(p,.1,.22),CANG)+parts(1,0),
 [K+'dr3']:(p)=>{
  let s=T(`${D('r')}=-\\dfrac{1}{${u}^2}\\times${D(u,th)}\\times${h}${u}^2`,400,110,{size:40});
  const g=seg(p,.25,.4);
  s+=fade(g,L('u² が 約分で 消える',400,215,{size:28,color:C.a,weight:700}));
  s+=fade(seg(p,.45,.6),T(`${D('r')}=-${h}\\,${D(u,th)}`,400,340,{size:56})+rect(220,259,360,120,{fill:C.hi,fo:.05,stroke:C.hi,sw:2.5,rx:12}));
  return s+parts(seg(p,.6,.75)>0?2:1,1);
 },
 [K+'dd1']:(p)=>rows([[`${D('r')}=-${h}\\,${D(u,th)}`,0,{y:100,size:44}],[`${DD('r')}=-${h}\\,\\dfrac{d}{dt}\\!\\left(${D(u,th)}\\right)`,.3,{y:260,size:44}]],p)+note('2つ目：もう1回 t で 微分（h は 一定）',400,400,seg(p,.5,.62),CR,24)+parts(2),
 [K+'dd2']:(p)=>rows([[`\\dfrac{d}{dt}\\!\\left(${D(u,th)}\\right)=${DD(u,th)}\\times${D(th)}`,0,{y:120,size:40}],[`=${DD(u,th)}\\times${h}${u}^2`,.45,{y:280,size:44}]],p)+note('ここでも θ を 通す',400,410,seg(p,.1,.22),CANG)+parts(2,0),
 [K+'dd3']:(p)=>{
  let s=rows([[`${DD('r')}=-${h}\\times${DD(u,th)}\\times${h}${u}^2`,0,{y:110,size:40}],[`${DD('r')}=-${h}^2${u}^2\\,${DD(u,th)}`,.45,{y:300,size:50}]],p);
  s+=fade(seg(p,.45,.6),rect(130,225,540,110,{fill:C.hi,fo:.05,stroke:C.hi,sw:2.5,rx:12}));
  return s+parts(seg(p,.6,.75)>0?3:2,2);
 },
 [K+'cf1']:(p)=>rows([[`r\\left(${D(th)}\\right)^{2}=\\dfrac{1}{${u}}\\left(${h}${u}^2\\right)^{2}`,0,{y:110,size:42}],[`=\\dfrac{1}{${u}}\\times ${h}^2${u}^4`,.3,{y:250,size:44}],[`=${h}^2${u}^3`,.6,{y:380,size:52}]],p)+note('3つ目',90,40,seg(p,.02,.1),CR)+parts(seg(p,.7,.82)>0?4:3,3),
 [K+'grav']:(p)=>rows([[`-\\dfrac{GM}{r^2}=-GM\\,${u}^2`,0,{y:220,size:52}]],p)+note('1/r² ＝ u²',400,350,seg(p,.2,.35),CU)+parts(seg(p,.5,.62)>0?5:4,4),
 // ===== S4 振動の式 =====
 [K+'sub']:(p)=>{
  let s=T(`${DD('r')}-r\\left(${D(th)}\\right)^{2}=-\\dfrac{GM}{r^2}`,400,90,{size:38,opacity:.6});
  s+=fade(seg(p,.15,.3),L('部品を 入れる',400,180,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),T(`-${h}^2${u}^2\\,${DD(u,th)}-${h}^2${u}^3=-GM\\,${u}^2`,400,300,{size:38}));
  return s+parts(5);
 },
 [K+'div1']:(p)=>{
  let s=T(`-${h}^2${u}^2\\,${DD(u,th)}-${h}^2${u}^3=-GM\\,${u}^2`,600,90,{size:40});
  s+=L('両辺を −h²u² で 割る',600,190,{size:28,color:C.hi,weight:700});
  s+=fade(seg(p,.3,.45),T(`${DD(u,th)}`,380,320,{size:50})+L('1つ目',380,430,{size:24,color:C.dim}));
  s+=fade(seg(p,.6,.75),T(`+\\,${u}`,560,320,{size:50})+L('2つ目',560,430,{size:24,color:C.dim}));
  return s;
 },
 [K+'div2']:(p)=>{
  let s=T(`-${h}^2${u}^2\\,${DD(u,th)}-${h}^2${u}^3=-GM\\,${u}^2`,600,90,{size:40,opacity:.6});
  s+=T(`${DD(u,th)}+${u}`,430,300,{size:50})+T('=',600,300,{size:50});
  s+=fade(seg(p,.2,.35),T(`\\dfrac{-GM\\,${u}^2}{-${h}^2${u}^2}`,790,300,{size:44}));
  s+=fade(seg(p,.55,.7),T(`=\\dfrac{GM}{${h}^2}`,790,440,{size:46}));
  return s;
 },
 [K+'result']:(p)=>{
  let s=T(`${DD(u,th)}+${u}=\\dfrac{GM}{${h}^2}`,600,180,{size:66});
  s+=fade(seg(p,.05,.2),rect(330,78,540,150,{fill:C.hi,fo:.05,stroke:C.hi,sw:3,rx:14}));
  s+=fade(seg(p,.45,.6),L('t が 消えて、u と θ だけ',600,360,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'status']:(p)=>{
  let s=T(`${DD(u,th)}+${u}=\\dfrac{GM}{${h}^2}`,600,90,{size:44});
  s+=card(80,170,500,280,L('出どころ（法則）',330,215,{size:24,color:C.dim})+tex('ma=F',330,290,{size:40})+L('＋ 万有引力 GMm/r²',330,365,{size:26,weight:700})+L('→ 導いた 結果',330,420,{size:26,color:CF,weight:700}),seg(p,.05,.18),CF);
  s+=card(620,170,500,280,L('仮定',870,215,{size:24,color:C.dim})+L('太陽は 動かない 点',870,290,{size:28,weight:700})+L('ほかの 天体の 力は 無視',870,360,{size:28,weight:700}),seg(p,.45,.58));
  return s;
 },
 [K+'shift']:(p)=>{
  let s=T(`${DD(u,th)}+${u}=\\dfrac{GM}{${h}^2}`,600,80,{size:42,opacity:.6});
  s+=fade(seg(p,.05,.2),T(`w=${u}-\\dfrac{GM}{${h}^2}`,600,210,{size:52}));
  s+=fade(seg(p,.5,.65),L('GM/h² は 定数 → 微分すると 0',600,320,{size:28,color:C.hi,weight:700})+T(`${DD('w',th)}=${DD(u,th)}`,600,420,{size:44}));
  return s;
 },
 [K+'shm']:(p)=>{
  let s=T(`${DD(u,th)}=\\dfrac{GM}{${h}^2}-${u}`,600,90,{size:44,opacity:.65});
  s+=fade(seg(p,.1,.25),T(`${DD('w',th)}=\\dfrac{GM}{${h}^2}-${u}`,600,230,{size:48}));
  s+=fade(seg(p,.45,.6),T(`=-w`,600,370,{size:58})+rect(470,282,260,110,{fill:C.hi,fo:.05,stroke:C.hi,sw:2.5,rx:12}));
  return s;
 },
 [K+'answer']:(p)=>{
  let s=card(60,60,520,300,L('ばねの 単振動',320,105,{size:26,color:C.dim})+T(`\\dfrac{d^2x}{dt^2}=-\\omega^2x`,320,200,{size:46,auto:true}),seg(p,.02,.12));
  s+=card(620,60,520,300,L('軌道（今回）',880,105,{size:26,color:C.dim})+T(`${DD('w',th)}=-w`,880,200,{size:46}),seg(p,.02,.12),C.hi);
  s+=fade(seg(p,.4,.55),L('時間 t → 角度 θ',600,420,{size:30,color:CANG,weight:700}));
  s+=fade(seg(p,.6,.75),L('ω → 1',600,475,{size:30,color:C.p,weight:700}));
  return s;
 },
 [K+'wave']:(p)=>{
  let s=wave(seg(p,.05,.6));
  s+=card(760,90,410,330,L('w は cos の 形で 揺れる',965,150,{size:26,weight:700})+fade(seg(p,.5,.65),L('u は 真ん中の 値',965,240,{size:26,color:CU,weight:700})+T(`\\dfrac{GM}{${h}^2}`,965,315,{size:40})+L('の まわりで 揺れる',965,390,{size:26,color:CU,weight:700})),seg(p,.02,.12));
  return s;
 },
 // ===== S5 円の軌道 =====
 [K+'circ1']:(p)=>{
  const cx=250,cy=275,R=170,q=.3+1.6*p;let s=top()+ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'})+sun(cx,cy);
  const x=cx+R*Math.cos(q),y=cy-R*Math.sin(q);s+=line(cx,cy,x,y,{color:CR,w:3})+planet(x,y);
  s+=card(520,70,650,380,L('u が 一定 なら',845,120,{size:28,weight:700})+T(`${DD(u,th)}=0`,845,215,{size:40})
   +fade(seg(p,.35,.5),T(`${u}=\\dfrac{GM}{${h}^2}`,845,325,{size:46}))+fade(seg(p,.6,.75),L('r が 一定 ＝ 円の 軌道',845,420,{size:30,color:CR,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'circ2']:(p)=>rows([[`${h}=r^2${D(th)}=r\\times\\left(r${D(th)}\\right)=r${cs(C.v,'v')}`,0,{x:600,y:100,size:40}],[`${u}=\\dfrac{GM}{${h}^2}\\ \\Rightarrow\\ \\dfrac{1}{r}=\\dfrac{GM}{r^2${cs(C.v,'v')}^2}`,.45,{x:600,y:300,size:46}]],p)+note('円なら r dθ/dt ＝ 速さ v',600,195,seg(p,.2,.32),C.v),
 [K+'circ3']:(p)=>rows([[`\\dfrac{1}{r}=\\dfrac{GM}{r^2${cs(C.v,'v')}^2}`,0,{x:600,y:90,size:42,dim:1}],[`r${cs(C.v,'v')}^2=GM`,.15,{x:600,y:220,size:48}],[`${cs(C.v,'v')}^2=\\dfrac{GM}{r}`,.5,{x:600,y:360,size:56}]],p)+note('両辺に r²v²',960,220,seg(p,.1,.2),C.hi,24)+note('r で 割る',960,360,seg(p,.45,.55),C.hi,24),
 [K+'circ4']:(p)=>{
  let s=T(`${cs(C.v,'v')}^2=\\dfrac{GM}{r}`,330,150,{size:52});
  s+=fade(seg(p,.15,.3),L('⇔',600,165,{size:44,color:C.hi}));
  s+=fade(seg(p,.15,.3),T(`\\dfrac{GMm}{r^2}=\\dfrac{m${cs(C.v,'v')}^2}{r}`,870,150,{size:46}));
  s+=fade(seg(p,.5,.65),L('1本目：円の 軌道（万有引力 ＝ m × 中心向きの 加速度）と 一致',600,330,{size:26,color:CF,weight:700}));
  return s;
 },
 [K+'earth']:(p)=>rows([[`GM=1.327\\times10^{20}\\ \\mathrm{m^3/s^2}`,0,{x:600,y:80,size:38}],[`r=1.496\\times10^{11}\\ \\mathrm{m}`,.1,{x:600,y:170,size:38}],[`${cs(C.v,'v')}=\\sqrt{\\dfrac{GM}{r}}`,.35,{x:600,y:290,size:44}],[`\\approx 2.98\\times10^{4}\\ \\mathrm{m/s}`,.6,{x:600,y:420,size:44}]],p)+note('＝ 約 29.8 km/s',960,420,seg(p,.7,.8),C.v,30),
 [K+'between']:(p)=>{
  const X=v=>200+(v-29)*600;let s=line(X(29),300,X(30.6),300,{color:C.dim,w:3});
  [[29.29,'遠い 点 29.29'],[30.29,'近い 点 30.29']].forEach(([v,t],i)=>{s+=fade(seg(p,.05+i*.15,.18+i*.15),line(X(v),280,X(v),320,{color:C.dim,w:3})+L(t,X(v),360,{size:24,color:C.dim}));});
  s+=fade(seg(p,.4,.55),dot(X(29.78),300,12,C.v)+L('円で 計算 29.8',X(29.78),250,{size:28,color:C.v,weight:700}));
  s+=L('地球の 公転の 速さ（km/s）',600,120,{size:26,color:C.dim})+fade(seg(p,.6,.75),L('間に 入る',600,450,{size:30,color:C.hi,weight:700}));
  return s;
 },
 // ===== S6 =====
 [K+'sum']:(p)=>{
  let s=L('まとめ',600,55,{size:26,color:C.dim});
  s+=T(`${u}=\\dfrac1r,\\quad ${D(th)}=${h}${u}^2`,600,140,{size:40});
  s+=fade(seg(p,.2,.35),L('連鎖律で t → θ',600,225,{size:26,color:CANG,weight:700}));
  s+=fade(seg(p,.35,.5),T(`${DD(u,th)}+${u}=\\dfrac{GM}{${h}^2}`,600,350,{size:56})+rect(330,265,540,125,{fill:C.hi,fo:.05,stroke:C.hi,sw:2.5,rx:12}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=wave(1,{x0:90,w:560});
  s+=card(740,100,430,300,T(`w=${u}-\\dfrac{GM}{${h}^2}`,955,170,{size:36})+T(`${DD('w',th)}=-w`,955,290,{size:44})+L('振動の 式',955,370,{size:26,color:C.hi,weight:700}),seg(p,.02,.12));
  return s;
 },
 [K+'next']:(p)=>{
  let s=wave(1,{x0:70,w:440,hA:90});
  s+=card(600,70,570,380,L('次の 問い',885,120,{size:24,color:C.dim})+L('解は cos',885,190,{size:30,weight:700})
   +L('u が θ について cos で 揺れると',885,270,{size:28,color:CU,weight:700})+fade(seg(p,.35,.5),L('r は どんな 曲線？',885,360,{size:36,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
};
