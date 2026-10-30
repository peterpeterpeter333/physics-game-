// YouTube シリーズ 微分・上級 2/3（ステージ um-derivative 本8〜本10）— 図。Stage 1200×515.
// 色：t 金（自動）、幅 h 橙。sin h/h の部品（→1）緑、(cos h−1)/h の部品（→0）赤。単位円：高さ sin h 緑、弧 h 橙、接線の高さ tan h 紫。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='um-derivative-2:';
const CH=C.E,CG=C.F,CR=C.a,CV=C.v;
const h=`{\\color{${CH}}h}`;
const col=(c,s)=>`{\\color{${c}}${s}}`;
const card=(x,y,w,hh,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,hh,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const top=(s,g=1)=>fade(g,label(s,600,44,{size:26,color:C.dim,anchor:'middle'}));
const SH=`\\dfrac{\\sin ${h}}{${h}}`,CHm=`\\dfrac{\\cos ${h}-1}{${h}}`;
const PA=col(CR,`\\sin t\\cdot${CHm}`),PB=col(CG,`\\cos t\\cdot${SH}`);

// ---- sin graph with slope record ---------------------------------------------------------------
function trace(p){
 const A=axes({x:110,y:190,w:600,h:130,xmin:0,xmax:6.6,ymin:-1.2,ymax:1.2,xlabel:'t',ylabel:'',xcolor:C.t});
 const B=axes({x:110,y:440,w:600,h:130,xmin:0,xmax:6.6,ymin:-1.2,ymax:1.2,xlabel:'t',ylabel:'',xcolor:C.t});
 let s=A.svg+A.plot(Math.sin,{from:0,to:6.4,color:C.x,w:4})+label('sin t',A.X(1.6),A.Y(1.15),{size:26,color:C.x});
 s+=B.svg+label('傾き',B.X(0)+14,B.Y(1.25),{size:24,color:C.hi});
 const T=6.3*seg(p,.1,.9);
 // recorded slope dots
 for(let u=0;u<=T;u+=.21)s+=dot(B.X(u),B.Y(Math.cos(u)),5,C.hi);
 if(p>.1){const k=Math.cos(T);s+=draw([[A.X(T-.7),A.Y(Math.sin(T)-.7*k)],[A.X(T+.7),A.Y(Math.sin(T)+.7*k)]],1,{color:C.hi,w:3,dash:'8 6'})+dot(A.X(T),A.Y(Math.sin(T)),8,C.hi)+line(A.X(T),A.Y(Math.sin(T)),B.X(T),B.Y(Math.cos(T)),{color:C.faint,w:2,dash:'4 6'});}
 s+=fade(seg(p,.85,1),B.plot(Math.cos,{from:0,to:6.4,color:C.hi,w:2,dash:'6 6'})+label('cos t の形',B.X(3.4),B.Y(1.05),{size:26,color:C.hi}));
 return s;
}

// ---- unit circle, first quadrant --------------------------------------------------------------
const O=[120,470],R=330;
function U(x,y){return [O[0]+R*x,O[1]-R*y];}
function circle({a=.6,g={},lab={}}={}){
 const G=k=>g[k]??0,L=k=>lab[k]??0;
 const P=U(Math.cos(a),Math.sin(a)),A=U(1,0),Tt=U(1,Math.tan(a)),F=U(Math.cos(a),0);
 let s='';
 s+=line(O[0]-10,O[1],O[0]+R+60,O[1],{color:C.dim,w:2})+line(O[0],O[1]+10,O[0],O[1]-R-20,{color:C.dim,w:2});
 s+=draw(Array.from({length:61},(_,i)=>U(Math.cos(i/60*Math.PI/2),Math.sin(i/60*Math.PI/2))),1,{color:C.faint,w:3});
 // filled regions
 s+=fade(G('tri2')*.9,poly([O,A,Tt],{fill:CV,fo:.18,stroke:CV,sw:2}));
 s+=fade(G('sector')*.9,poly([O,...Array.from({length:31},(_,i)=>U(Math.cos(i/30*a),Math.sin(i/30*a)))],{fill:CH,fo:.28,stroke:CH,sw:2}));
 s+=fade(G('tri1'),poly([O,A,P],{fill:CG,fo:.35,stroke:CG,sw:3}));
 // radius and points
 s+=line(...O,...P,{color:C.ink,w:3})+line(...O,...A,{color:C.ink,w:3});
 s+=fade(G('tan'),line(...A,...Tt,{color:CV,w:5})+line(...O,...Tt,{color:C.dim,w:2,dash:'6 6'}));
 s+=fade(G('sin'),line(...P,...F,{color:CG,w:5}));
 s+=fade(G('arc'),draw(Array.from({length:31},(_,i)=>U(1.0*Math.cos(i/30*a),1.0*Math.sin(i/30*a))),1,{color:CH,w:6}));
 s+=dot(...P,7,C.ink)+dot(...A,7,C.ink)+dot(...O,6,C.ink);
 s+=label('O',O[0]-30,O[1]+28,{size:26,color:C.ink})+label('A',A[0]+8,A[1]+32,{size:26,color:C.ink})+label('P',P[0]-12,P[1]-16,{size:26,color:C.ink,anchor:'end'});
 s+=fade(G('tan'),label('T',Tt[0]+10,Tt[1]-4,{size:26,color:C.ink}));
 // angle mark
 s+=draw(Array.from({length:16},(_,i)=>[O[0]+48*Math.cos(i/15*a),O[1]-48*Math.sin(i/15*a)]),1,{color:CH,w:3});
 s+=label('h',O[0]+60,O[1]-14,{size:26,color:CH,weight:700});
 s+=label('1',(O[0]+A[0])/2,O[1]+32,{size:26,color:C.dim,anchor:'middle'});
 s+=fade(L('sin'),label('sin h',F[0]-10,(P[1]+F[1])/2+8,{size:26,color:CG,anchor:'end',weight:700}));
 const M=U(Math.cos(a*.5),Math.sin(a*.5));
 s+=fade(L('arc'),line(M[0]+4,M[1],A[0]+14,M[1]+2,{color:CH,w:2})+label('弧 h',A[0]+18,M[1]+10,{size:26,color:CH,weight:700}));
 s+=fade(L('tan'),label('tan h',A[0]+12,Tt[1]+42,{size:26,color:CV,weight:700}));
 return s;
}

export const ytUmDerivative2Diagrams={
 // ================= S1 =================
 [K+'ask']:(p)=>{
  let s=card(200,50,800,260,label('前回の最後の問い',600,100,{size:24,color:C.dim,anchor:'middle'})
   +tex(`\\sin(t+${h})-\\sin t`,600,185,{size:54})+label('どうほどけば、傾き ＝ cos t と示せる？',600,265,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  const cx=320,cy=270,r=170,th=.8;
  let s=label('初級：円の一歩',320,50,{size:26,color:C.dim,anchor:'middle'});
  s+=ring(cx,cy,r,{color:C.faint,w:3})+line(cx-r-20,cy,cx+r+20,cy,{color:C.dim})+line(cx,cy+r+20,cx,cy-r-20,{color:C.dim});
  const px=cx+r*Math.cos(th),py=cy-r*Math.sin(th);
  s+=line(cx,cy,px,py,{color:C.ink,w:3})+dot(px,py,8,C.hi);
  const g=seg(p,.2,.5);
  s+=arrow(px,py,px-110*Math.sin(th)*g,py-110*Math.cos(th)*g,{color:CH,w:4,head:14});
  s+=fade(seg(p,.4,.6),line(px-110*Math.sin(th),py-110*Math.cos(th),px-110*Math.sin(th),py,{color:CG,w:4,dash:'6 5'}));
  s+=card(620,120,520,230,label('高さの増え方',880,180,{size:28,color:C.ink,anchor:'middle'})+tex(`\\cos\\theta\\times\\Delta\\theta`,880,250,{size:46,auto:false})+label('→ sin の傾きは cos（図で）',880,320,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7));
  return s;
 },
 [K+'trace']:(p)=>{
  let s=trace(p);
  s+=card(780,150,380,200,label('傾きを 記録',970,200,{size:28,color:C.hi,anchor:'middle',weight:700})+label('t＝0 で 1',970,250,{size:26,color:C.ink,anchor:'middle'})+label('頂上で 0、下りで 負',970,300,{size:26,color:C.ink,anchor:'middle'}),seg(p,.2,.35));
  return s;
 },
 [K+'goal']:(p)=>{
  let s=trace(1);
  s+=card(760,90,420,320,label('形が似ている',970,150,{size:28,color:C.ink,anchor:'middle'})+label('＝ 観察',970,200,{size:30,color:C.dim,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('今回：差の計算で',970,280,{size:28,color:C.hi,anchor:'middle',weight:700})+tex(`(\\sin t)'=\\cos t`,970,350,{size:40})),seg(p,.05,.2));
  return s;
 },

 // ================= S2 =================
 [K+'add']:(p)=>{
  let s=label('加法定理（高校の公式）',600,60,{size:28,color:C.dim,anchor:'middle'});
  s+=tex(`\\sin(t+${h})=\\sin t\\cos ${h}+\\cos t\\sin ${h}`,600,180,{size:54});
  s+=fade(seg(p,.6,.8),label('ここでは 公式として 使う',600,320,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'diff1']:(p)=>{
  let s=tex(`\\sin(t+${h})=\\sin t\\cos ${h}+\\cos t\\sin ${h}`,600,80,{size:40});
  s+=fade(seg(p,.1,.35),tex(`\\sin(t+${h})-\\sin t`,600,200,{size:48}));
  s+=fade(seg(p,.4,.65),tex(`=\\sin t\\cos ${h}+\\cos t\\sin ${h}-\\sin t`,600,310,{size:48}));
  return s;
 },
 [K+'diff2']:(p)=>{
  const src=`\\sin t\\cos ${h}+\\cos t\\sin ${h}-\\sin t`;
  let s=tex(src,600,90,{size:46});
  s+=fade(seg(p,.1,.3),label('sin t を 含む 2項',600,170,{size:26,color:CR,anchor:'middle'}));
  s+=fade(seg(p,.3,.55),tex(`\\sin t\\cos ${h}-\\sin t=\\sin t\\,(\\cos ${h}-1)`,600,270,{size:48}));
  s+=fade(seg(p,.6,.8),tex(`\\sin(t+${h})-\\sin t=${col(CR,`\\sin t\\,(\\cos ${h}-1)`)}+${col(CG,`\\cos t\\sin ${h}`)}`,600,400,{size:44}));
  return s;
 },
 [K+'diff3']:(p)=>{
  let s=tex(`\\sin(t+${h})-\\sin t=${col(CR,`\\sin t\\,(\\cos ${h}-1)`)}+${col(CG,`\\cos t\\sin ${h}`)}`,600,80,{size:40});
  s+=fade(seg(p,.05,.2),label('÷ h',600,160,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.45),tex(`\\dfrac{\\sin(t+${h})-\\sin t}{${h}}=${PA}+${PB}`,600,290,{size:48}));
  s+=fade(seg(p,.6,.8),label('部品 A',470,410,{size:28,color:CR,anchor:'middle',weight:700})+label('部品 B',850,410,{size:28,color:CG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'parts']:(p)=>{
  let s=tex(`\\dfrac{\\sin(t+${h})-\\sin t}{${h}}=${PA}+${PB}`,600,110,{size:44});
  s+=fade(seg(p,.1,.3),label('t は 固定、h だけ → 0',600,230,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),label('sin t、cos t ＝ ただの係数',380,330,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),label('動くのは h の部品だけ',840,330,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'need']:(p)=>{
  let s=label('必要な 2つの極限',600,60,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=card(150,120,400,220,tex(col(CG,SH),350,220,{size:60,auto:false})+label('→ ？',350,310,{size:32,color:CG,anchor:'middle',weight:700}),seg(p,.3,.45),CG);
  s+=card(650,120,400,220,tex(col(CR,CHm),850,220,{size:60,auto:false})+label('→ ？',850,310,{size:32,color:CR,anchor:'middle',weight:700}),seg(p,.55,.7),CR);
  return s;
 },
 [K+'predict']:(p)=>{
  let s=card(150,120,400,220,tex(col(CG,SH),350,220,{size:60,auto:false})+label('→ ？',350,310,{size:32,color:CG,anchor:'middle',weight:700}),1,CG);
  s+=card(650,120,400,220,tex(col(CR,CHm),850,220,{size:60,auto:false})+label('→ ？',850,310,{size:32,color:CR,anchor:'middle',weight:700}),1,CR);
  s+=fade(seg(p,.2,.4),label('h を 小さくすると？ 予想してみよう',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 ...(()=>{
  const tbl=(p,rows)=>{
   const hx=[250,560,900];
   let s=label('h',hx[0],80,{size:32,color:CH,anchor:'middle',weight:700})+tex(col(CG,SH),hx[1],80,{size:40,auto:false})+tex(col(CR,CHm),hx[2],80,{size:40,auto:false});
   s+=line(140,140,1060,140,{color:C.faint,w:2});
   const R=[['0.1','0.998334','−0.049958'],['0.01','0.9999833','−0.00499996'],['→ 0','→ 1','→ 0']];
   R.forEach((r,i)=>{const y=200+i*80,g=rows[i];s+=fade(g,label(r[0],hx[0],y,{size:34,color:CH,anchor:'middle'})+label(r[1],hx[1],y,{size:34,color:i===2?C.hi:CG,anchor:'middle',weight:i===2?700:400})+label(r[2],hx[2],y,{size:34,color:i===2?C.hi:CR,anchor:'middle',weight:i===2?700:400}));});
   return s;
  };
  return {
   [K+'tbl1']:(p)=>tbl(p,[seg(p,.1,.3),0,0]),
   [K+'tbl2']:(p)=>tbl(p,[1,seg(p,.05,.25),seg(p,.6,.8)]),
  };
 })(),

 // ================= S3 =================
 [K+'rad']:(p)=>{
  let s=circle({a:.6,g:{arc:seg(p,.3,.6)},lab:{arc:seg(p,.5,.7)}});
  s+=label('半径 1 の円',860,120,{size:30,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.2,.4),label('角 h ＝ 弧の長さ（ラジアン）',860,200,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fig']:(p)=>{
  let s=circle({a:.6,g:{arc:1,sin:seg(p,.02,.2),tan:seg(p,.6,.8)},lab:{arc:1,sin:seg(p,.05,.2),tan:seg(p,.65,.8)}});
  s+=fade(seg(p,.05,.2),label('高さ sin h',860,150,{size:30,color:CG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('弧 h',860,220,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('接線の高さ tan h',860,290,{size:30,color:CV,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tri1']:(p)=>{
  let s=circle({a:.6,g:{arc:.4,sin:1,tan:.4,tri1:seg(p,.3,.5)},lab:{sin:1}});
  s+=fade(seg(p,.3,.5),label('三角形 OAP',860,140,{size:30,color:CG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('底辺 1 × 高さ sin h ÷ 2',860,210,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),tex(`\\tfrac12\\sin ${h}`,860,300,{size:50}));
  return s;
 },
 [K+'sector']:(p)=>{
  let s=circle({a:.6,g:{arc:1,tri1:.35,sector:seg(p,.05,.25)},lab:{arc:1}});
  s+=fade(seg(p,.05,.25),label('扇形 OAP',860,120,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.45),tex(`\\pi\\times\\dfrac{${h}}{2\\pi}`,860,220,{size:48,auto:false}));
  s+=fade(seg(p,.25,.45),label('円全体 π の h/(2π) 倍',860,300,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),tex(`=\\tfrac12\\,${h}`,860,380,{size:50,auto:false}));
  return s;
 },
 [K+'tri2']:(p)=>{
  let s=circle({a:.6,g:{tan:1,tri2:seg(p,.05,.25),sector:.35,tri1:.35},lab:{tan:1}});
  s+=fade(seg(p,.05,.25),label('三角形 OAT',860,140,{size:30,color:CV,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),label('底辺 1 × 高さ tan h ÷ 2',860,210,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),tex(`\\tfrac12\\tan ${h}`,860,300,{size:50}));
  return s;
 },
 [K+'ineq']:(p)=>{
  let s=circle({a:.6,g:{tri2:1,sector:1,tri1:1,tan:1,sin:1,arc:1}});
  s+=tex(`${col(CG,'\\tfrac12\\sin h')}\\le${col(CH,'\\tfrac12 h')}\\le${col(CV,'\\tfrac12\\tan h')}`,860,150,{size:44,auto:false});
  s+=fade(seg(p,.5,.65),label('小 ⊂ 扇形 ⊂ 大',860,250,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('（面積の 順）',860,300,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ineqn']:(p)=>{
  let s=label('h ＝ 0.1',600,50,{size:28,color:CH,anchor:'middle',weight:700});
  s+=tex(`${col(CG,'\\tfrac12\\sin h')}\\le${col(CH,'\\tfrac12 h')}\\le${col(CV,'\\tfrac12\\tan h')}`,600,150,{size:48,auto:false});
  s+=fade(seg(p,.1,.4),tex(`${col(CG,'0.04992')}\\le${col(CH,'0.05')}\\le${col(CV,'0.05017')}`,600,280,{size:52,auto:false}));
  s+=fade(seg(p,.6,.8),ok(600,390)+label('この順に 並ぶ',640,390,{size:30,color:C.F}));
  return s;
 },
 [K+'div']:(p)=>{
  let s=tex(`\\tfrac12\\sin ${h}\\le\\tfrac12 ${h}\\le\\tfrac12\\tan ${h}`,600,90,{size:46,auto:false});
  s+=fade(seg(p,.05,.25),label('全体を ½ sin h で 割る',600,190,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),label('0 ＜ h ＜ π/2 なら sin h ＞ 0',600,290,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),label('→ 不等号の向きは そのまま',600,360,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'div2']:(p)=>{
  let s=tex(`\\tfrac12\\sin ${h}\\le\\tfrac12 ${h}\\le\\tfrac12\\tan ${h}`,600,80,{size:40,auto:false});
  s+=fade(seg(p,.02,.25),tex(`1\\le\\dfrac{${h}}{\\sin ${h}}\\le\\dfrac{1}{\\cos ${h}}`,600,220,{size:56,auto:false}));
  s+=fade(seg(p,.45,.7),tex(`\\dfrac{\\tan ${h}}{\\sin ${h}}=\\dfrac{\\sin ${h}/\\cos ${h}}{\\sin ${h}}=\\dfrac{1}{\\cos ${h}}`,600,380,{size:40,auto:false}));
  return s;
 },
 [K+'flip']:(p)=>{
  let s=tex(`1\\le\\dfrac{${h}}{\\sin ${h}}\\le\\dfrac{1}{\\cos ${h}}`,600,100,{size:48,auto:false});
  s+=fade(seg(p,.05,.3),label('逆数を とる → 向きが 入れかわる',600,210,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.7),tex(`\\cos ${h}\\le${col(CG,SH)}\\le1`,600,330,{size:60,auto:false}));
  return s;
 },
 [K+'squeeze']:(p)=>{
  const A=axes({x:140,y:430,w:720,h:330,xmin:0,xmax:1.05,ymin:.5,ymax:1.08,xlabel:'h',ylabel:'',xticks:[],yticks:[]});
  let s=A.svg+label('1',A.X(0)-14,A.Y(1)+8,{size:24,color:C.dim,anchor:'end'});
  s+=A.plot(()=>1,{from:0,to:1,color:C.dim,w:3,dash:'8 6'});
  s+=A.plot(u=>Math.cos(u),{from:0.001,to:1,color:C.x,w:4})+label('cos h',A.X(1)+10,A.Y(Math.cos(1))+8,{size:26,color:C.x});
  s+=A.plot(u=>Math.sin(u)/u,{from:0.001,to:1,color:CG,w:5})+label('sin h / h',A.X(1)+10,A.Y(Math.sin(1))+8,{size:26,color:CG,weight:700});
  s+=label('上 ＝ 1',A.X(.62),A.Y(1)-14,{size:24,color:C.dim});
  const u=mix(1,.02,seg(p,.1,.7));
  s+=line(A.X(u),A.Y(.5),A.X(u),A.Y(1.06),{color:CH,w:2,dash:'4 5'})+dot(A.X(u),A.Y(Math.cos(u)),7,C.x)+dot(A.X(u),A.Y(Math.sin(u)/u),8,CG)+dot(A.X(u),A.Y(1),6,C.dim);
  s+=label('h → 0',A.X(u)+10,A.Y(.52),{size:24,color:CH});
  s+=fade(seg(p,.7,.85),label('はさまれて 1 へ',1020,200,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'squeeze2']:(p)=>{
  let s=card(210,50,780,120,label('はさみうち',600,105,{size:36,color:C.hi,anchor:'middle',weight:700})+label('上と下が 同じ値へ → 間も その値へ',600,148,{size:26,color:C.ink,anchor:'middle'}),1,C.hi);
  s+=fade(seg(p,.4,.6),tex(`\\dfrac{\\sin(-${h})}{-${h}}=\\dfrac{-\\sin ${h}}{-${h}}=${SH}`,600,265,{size:44,auto:false}));
  s+=fade(seg(p,.6,.75),label('h ＜ 0 でも 同じ値',600,352,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),tex(`${col(CG,SH)}\\ \\longrightarrow\\ 1`,600,440,{size:40,auto:false}));
  return s;
 },

 // ================= S4 =================
 [K+'c1']:(p)=>{
  let s=tex(col(CR,CHm),600,110,{size:56,auto:false});
  s+=fade(seg(p,.3,.55),tex(`=\\dfrac{(\\cos ${h}-1)\\,${col(C.hi,`(1+\\cos ${h})`)}}{${h}\\,${col(C.hi,`(1+\\cos ${h})`)}}`,600,280,{size:52,auto:false}));
  s+=fade(seg(p,.55,.75),label('上下に 同じものを 掛ける → 値は 同じ',600,420,{size:28,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'c2']:(p)=>{
  let s=label('分子',600,50,{size:26,color:C.dim,anchor:'middle'});
  s+=tex(`(\\cos ${h}-1)(\\cos ${h}+1)`,600,130,{size:48,auto:false});
  s+=fade(seg(p,.1,.3),tex(`=\\cos^2 ${h}-1`,600,230,{size:52,auto:false}));
  s+=fade(seg(p,.45,.65),label('sin²h ＋ cos²h ＝ 1 より',600,320,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),tex(`=-\\sin^2 ${h}`,600,410,{size:52,auto:false}));
  return s;
 },
 [K+'c3']:(p)=>{
  let s=tex(`${CHm}=\\dfrac{-\\sin^2 ${h}}{${h}\\,(1+\\cos ${h})}`,600,110,{size:48,auto:false});
  s+=fade(seg(p,.2,.5),tex(`=-\\,${col(CG,SH)}\\times\\dfrac{\\sin ${h}}{1+\\cos ${h}}`,600,290,{size:56,auto:false}));
  s+=fade(seg(p,.6,.8),label('2つの 因子に 分ける',600,420,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'c4']:(p)=>{
  const parts=['-',col(CG,SH),'\\times',`\\dfrac{\\sin ${h}}{1+\\cos ${h}}`];
  let s=tex(parts.join(''),600,120,{size:56,auto:false});
  const W=texWidth(parts.join(''),56,false),L=600-W/2,a=texWidth('-',56,false),b=texWidth('-'+parts[1],56,false),c=texWidth(parts.slice(0,3).join(''),56,false);
  s+=fade(seg(p,.1,.3),label('→ 1',L+(a+b)/2,240,{size:32,color:CG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.55),label('→ 0/2 ＝ 0',L+(c+W)/2,240,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.85),tex(`${col(CR,CHm)}\\ \\longrightarrow\\ -1\\times0=0`,600,380,{size:48,auto:false}));
  return s;
 },
 [K+'res']:(p)=>{
  let s=tex(`\\dfrac{\\sin(t+${h})-\\sin t}{${h}}=${PA}+${PB}`,600,100,{size:44});
  s+=fade(seg(p,.1,.35),tex(col(CR,'\\sin t\\times0'),380,260,{size:48,auto:false})+label('→ 0',380,330,{size:30,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.75),tex(col(CG,'\\cos t\\times1'),820,260,{size:48,auto:false})+label('→ cos t',820,330,{size:30,color:CG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'res2']:(p)=>{
  const src=`\\dfrac{d}{dt}\\sin t=\\cos t`,W=texWidth(src,72);
  let s=tex(src,600,190,{size:72});
  s+=fade(seg(p,.15,.3),highlight(600-W/2-24,78,W+48,205,1));
  s+=fade(seg(p,.5,.7),label('観察 → 差の計算による 証明',600,370,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num1']:(p)=>{
  let s=top('t ＝ 0.5、h ＝ 0.01');
  s+=fade(seg(p,.1,.4),tex('\\dfrac{\\sin 0.51-\\sin 0.5}{0.01}',520,200,{size:54,auto:false}));
  s+=fade(seg(p,.6,.8),tex('\\approx0.8752',870,200,{size:54,auto:false}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=top('t ＝ 0.5、h ＝ 0.01');
  s+=tex('\\dfrac{\\sin 0.51-\\sin 0.5}{0.01}\\approx0.8752',600,140,{size:38,auto:false});
  s+=fade(seg(p,.05,.3),label('部品 A',260,240,{size:28,color:CR,anchor:'middle',weight:700})+tex(col(CR,'0.4794\\times(-0.0050)\\approx-0.0024'),720,240,{size:40,auto:false}));
  s+=fade(seg(p,.35,.6),label('部品 B',260,320,{size:28,color:CG,anchor:'middle',weight:700})+tex(col(CG,'0.8776\\times0.99998\\approx0.8776'),720,320,{size:40,auto:false}));
  s+=fade(seg(p,.7,.9),line(430,360,1010,360,{color:C.dim,w:2})+label('合計 ≈ 0.8752',720,420,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num3']:(p)=>{
  let s=tex('\\cos 0.5\\approx0.8776',600,110,{size:52,auto:false});
  s+=fade(seg(p,.1,.3),label('差商 ≈ 0.8752',600,220,{size:36,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.4,.6),label('ずれ ＝ 部品 A の −0.0024',600,320,{size:32,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.85),label('h → 0 で 部品 A → 0',600,400,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },

 // ================= S5 =================
 [K+'cos1']:(p)=>{
  let s=label('cos も 同じ手順',600,60,{size:28,color:C.dim,anchor:'middle'});
  s+=tex(`\\cos(t+${h})=\\cos t\\cos ${h}-\\sin t\\sin ${h}`,600,190,{size:52});
  s+=fade(seg(p,.5,.7),label('加法定理',600,300,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'cos2']:(p)=>{
  let s=tex(`\\dfrac{\\cos(t+${h})-\\cos t}{${h}}=${col(CR,`\\cos t\\cdot${CHm}`)}-${col(CG,`\\sin t\\cdot${SH}`)}`,600,110,{size:44});
  s+=fade(seg(p,.1,.4),tex(`\\longrightarrow\\ ${col(CR,'\\cos t\\times0')}-${col(CG,'\\sin t\\times1')}`,600,280,{size:50,auto:false}));
  s+=fade(seg(p,.55,.75),label('2つの極限を そのまま 使う',600,400,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'cos3']:(p)=>{
  const src=`\\dfrac{d}{dt}\\cos t=-\\sin t`,W=texWidth(src,68);
  let s=tex(src,600,180,{size:68});
  s+=fade(seg(p,.15,.3),highlight(600-W/2-24,72,W+48,200,1));
  s+=fade(seg(p,.5,.7),label('マイナスは 加法定理の 引き算から',600,360,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'deg']:(p)=>{
  let s=label('角を 度で 測ると？',600,60,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.45),tex('\\sin 1^\\circ\\approx0.01745',600,190,{size:54,auto:false}));
  s+=fade(seg(p,.55,.75),tex('\\dfrac{\\sin 1^\\circ}{1}\\approx0.01745',520,330,{size:48,auto:false})+ng(780,340)+label('1 に ならない',820,340,{size:30,color:C.a}));
  return s;
 },
 [K+'deg2']:(p)=>{
  let s=tex('0.01745\\approx\\dfrac{\\pi}{180}',600,120,{size:54,auto:false});
  s+=fade(seg(p,.1,.3),label('1° ＝ π/180 rad',600,230,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.7),label('度で 測ると',600,310,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.45,.7),label('傾き ＝ （π/180）× cos',600,390,{size:36,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'deg3']:(p)=>{
  let s=card(200,110,800,240,label('ラジアンで 測るとき だけ',600,180,{size:32,color:C.hi,anchor:'middle',weight:700})+tex(`(\\sin t)'=\\cos t`,600,280,{size:56}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=label('まとめ',600,44,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=tex(`\\dfrac{\\sin(t+${h})-\\sin t}{${h}}=${PA}+${PB}`,600,140,{size:42});
  s+=fade(seg(p,.3,.5),tex(`${col(CG,SH)}\\to1`,380,290,{size:46,auto:false})+label('はさみうち',380,370,{size:26,color:CG,anchor:'middle'}));
  s+=fade(seg(p,.45,.65),tex(`${col(CR,CHm)}\\to0`,820,290,{size:46,auto:false})+label('1＋cos h を 掛ける',820,370,{size:26,color:CR,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),tex(`(\\sin t)'=\\cos t`,600,450,{size:44}));
  return s;
 },
 [K+'table']:(p)=>{
  let s=label('微分の表',600,50,{size:30,color:C.hi,anchor:'middle',weight:700});
  const rows=[['t^n','n\\,t^{n-1}','1/3'],['\\sin t','\\cos t','2/3'],['\\cos t','-\\sin t','2/3']];
  s+=label('関数',400,110,{size:26,color:C.dim,anchor:'middle'})+label('微分',760,110,{size:26,color:C.dim,anchor:'middle'});
  rows.forEach((r,i)=>{const y=190+i*90;s+=fade(seg(p,.1+i*.15,.25+i*.15),tex(r[0],400,y,{size:48})+label('→',580,y+8,{size:34,color:C.dim,anchor:'middle'})+tex(r[1],760,y,{size:48})+label(r[2],980,y+8,{size:24,color:C.dim,anchor:'middle'}));});
  return s;
 },
 [K+'next']:(p)=>{
  const mk=(y,fn,colr,name)=>{const A=axes({x:120,y,w:380,h:90,xmin:-1.2,xmax:2.2,ymin:-2.5,ymax:2.5,xlabel:'',ylabel:''});return A.svg+A.plot(fn,{from:-1.1,to:2.1,color:colr,w:3})+label(name,90,y-40,{size:28,color:colr,weight:700,anchor:'end'});};
  let s=fade(seg(p,.02,.2),mk(140,u=>(u*u*u-3*u)/1.2,C.x,'x')+mk(290,u=>(3*u*u-3)/2,C.v,'v')+mk(440,u=>6*u/3,C.a,'a'));
  s+=fade(seg(p,.1,.25),label('順に 微分すると 何が 読める？',570,200,{size:28,color:C.hi,weight:700}));
  const B=axes({x:700,y:470,w:400,h:140,xmin:-1.2,xmax:1.2,ymin:-.1,ymax:1.2,xlabel:'t',ylabel:'',xcolor:C.t});
  s+=fade(seg(p,.5,.65),B.svg+B.plot(Math.abs,{from:-1.1,to:1.1,color:C.x,w:4})+label('傾きは 1つに 決まる？',900,250,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
};
