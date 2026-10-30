// YouTube シリーズ 微分の法則・初級 1/2（ステージ ui-function-rules 本0・本2）— 図。Stage 1200×515.
// 色：時刻 t 金、中身 u 橙、外側の出力 y 緑、強調 黄、誤り 赤（anim.mjs の C）。
// 積の微分：右の帯 桃、上の帯 紫、角 赤。一辺 x は水色。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='ui-function-rules-1:';
const CU=C.E,CY=C.F,CR=C.p,CT=C.v,CK=C.a;
const U=`{\\color{${CU}}u}`,Y=`{\\color{${CY}}y}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));

// ---- pipeline t → [×3] → u → [2乗] → y -----------------------------------------------------
function node(x,y,name,color,val='',g=1){
 return fade(g,ring(x,y,40,{color,w:4,fill:'#10182c'})+label(name,x,y+12,{size:36,color,anchor:'middle',weight:700})
  +(val?label(val,x,y+86,{size:30,color,anchor:'middle',weight:700}):''));
}
function opbox(x,y,text,g=1,color=C.ink){return fade(g,rect(x-80,y-34,160,68,{fill:'#1a2440',fo:1,stroke:C.dim,sw:2,rx:12})+label(text,x,y+10,{size:28,color,anchor:'middle',weight:700}));}
function pipeline(y,{g=1,ops=['×3','2乗'],names=['t','u','y'],colors=[C.t,CU,CY],vals=['','',''],vg=1,X=[170,600,1030],opg=1}={}){
 let s=node(X[0],y,names[0],colors[0],'',g);
 const bx=[(X[0]+X[1])/2,(X[1]+X[2])/2];
 s+=fade(g,arrow(X[0]+44,y,bx[0]-86,y,{color:C.dim,w:3,head:12})+arrow(bx[0]+86,y,X[1]-46,y,{color:C.dim,w:3,head:12}));
 s+=opbox(bx[0],y,ops[0],g*opg)+node(X[1],y,names[1],colors[1],'',g);
 s+=fade(g,arrow(X[1]+44,y,bx[1]-86,y,{color:C.dim,w:3,head:12})+arrow(bx[1]+86,y,X[2]-46,y,{color:C.dim,w:3,head:12}));
 s+=opbox(bx[1],y,ops[1],g*opg)+node(X[2],y,names[2],colors[2],'',g);
 vals.forEach((v,i)=>{if(v)s+=fade(Array.isArray(vg)?vg[i]:vg,label(v,X[i],y+86,{size:30,color:colors[i],anchor:'middle',weight:700}));});
 return s;
}

// ---- gear icon --------------------------------------------------------------------------------
function gear(cx,cy,r,teeth,ang,color,g=1){
 const pts=[];const N=teeth*4;
 for(let i=0;i<N;i++){const a=ang+i*2*Math.PI/N,rr=(i%4<2)?r:r*.8;pts.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)]);}
 return fade(g,poly(pts,{fill:color,fo:.22,stroke:color,sw:3})+ring(cx,cy,r*.28,{color,w:3,fill:C.bg})
  +line(cx,cy,cx+r*.62*Math.cos(ang),cy+r*.62*Math.sin(ang),{color,w:4}));
}
// three gears t → u → y with ratio badges
function gearRow(p,step){
 const X=[200,600,1000],yc=150,th=-.9*smooth(clamp(p/.9));
 let s=gear(X[0],yc,62,8,th,C.t)+gear(X[1],yc,62,8,3*th,CU)+fade(step>=1?1:.25,gear(X[2],yc,62,8,18*th,CY));
 s+=label('t',X[0],yc+100,{size:34,color:C.t,anchor:'middle',weight:700})+label('u',X[1],yc+100,{size:34,color:CU,anchor:'middle',weight:700})
  +fade(step>=1?1:.25,label('y',X[2],yc+100,{size:34,color:CY,anchor:'middle',weight:700}));
 const b1=step===0?seg(p,.3,.45):1;
 s+=fade(b1,rect(340,yc-30,120,60,{fill:'#1a2440',fo:1,stroke:C.hi,sw:2,rx:12})+label('×3',400,yc+11,{size:32,color:C.hi,anchor:'middle',weight:700}));
 if(step>=2){const b2=step===2?seg(p,.55,.7):1;
  s+=fade(b2,rect(725,yc-30,150,60,{fill:'#1a2440',fo:1,stroke:C.hi,sw:2,rx:12})+label('×6',800,yc+11,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（2u）',800,yc+62,{size:24,color:CU,anchor:'middle'}));
 }
 // value rows
 const ry=330;
 s+=label('1 → 1.01',X[0],ry,{size:30,color:C.t,anchor:'middle'})+label('Δt ＝ 0.01',X[0],ry+50,{size:28,color:C.t,anchor:'middle',weight:700});
 const g1=step===0?seg(p,.45,.65):1;
 s+=fade(g1,label('3 → 3.03',X[1],ry,{size:30,color:CU,anchor:'middle'})+label('Δu ＝ 0.03',X[1],ry+50,{size:28,color:CU,anchor:'middle',weight:700}));
 if(step>=1){const g2=step===1?seg(p,.3,.5):1,g3=step===1?seg(p,.6,.8):1;
  s+=fade(g2,label('9 → 9.1809',X[2],ry,{size:30,color:CY,anchor:'middle'}));
  s+=fade(g3,label('Δy ＝ 0.1809',X[2],ry+50,{size:28,color:CY,anchor:'middle',weight:700}));
 }
 return s;
}

// ---- square x×x growing from 3 to 3.1 (growth drawn enlarged) -------------------------------
const SQ={x0:130,y0:440,s:300,d:40};
function square(p,{strips=[1,1,1],dimSq=1,cross=0}={}){
 const {x0,y0,s,d}=SQ;
 let o=rect(x0,y0-s,s,s,{fill:C.x,fo:.18*dimSq,stroke:C.x,sw:3,rx:2});
 o+=label('3',x0+s/2,y0+34,{size:26,color:C.x,anchor:'middle'})+label('3',x0-18,y0-s/2+9,{size:26,color:C.x,anchor:'end'});
 o+=label('9',x0+s/2,y0-s/2+14,{size:40,color:C.x,anchor:'middle',weight:700});
 o+=fade(strips[0],rect(x0+s,y0-s,d,s,{fill:CR,fo:.5,stroke:CR,sw:2,rx:2}));
 o+=fade(strips[1],rect(x0,y0-s-d,s,d,{fill:CT,fo:.5,stroke:CT,sw:2,rx:2}));
 o+=fade(strips[2],rect(x0+s,y0-s-d,d,d,{fill:CK,fo:.7,stroke:CK,sw:2,rx:2}));
 o+=fade(Math.max(strips[0],strips[2]),label('0.1',x0+s+d/2,y0+34,{size:24,color:C.dim,anchor:'middle'}));
 o+=fade(Math.max(strips[1],strips[2]),label('0.1',x0-18,y0-s-d/2+8,{size:24,color:C.dim,anchor:'end'}));
 if(cross>0){o+=fade(cross,label('✗',x0+s+d/2,y0-s/2+12,{size:34,color:C.a,anchor:'middle',weight:700})+label('✗',x0+s/2,y0-s-d/2+12,{size:34,color:C.a,anchor:'middle',weight:700}));}
 o+=label('0.1 は拡大して表示',x0+s/2+20,y0+72,{size:22,color:C.dim,anchor:'middle'});
 return o;
}
// general rectangle f × g with growth Δf (up) and Δg (right)
function rectFG(p,{grow=1,labels=1}={}){
 const x0=120,y0=440,w=320,h=240,d=46*grow;
 let s=rect(x0,y0-h,w,h,{fill:C.dim,fo:.12,stroke:C.dim,sw:3,rx:2})+label('fg',x0+w/2,y0-h/2+14,{size:40,color:C.ink,anchor:'middle',weight:700});
 s+=label('g',x0+w/2,y0+36,{size:30,color:C.ink,anchor:'middle',weight:700})+label('f',x0-20,y0-h/2+10,{size:30,color:C.ink,anchor:'end',weight:700});
 if(d>1){
  s+=rect(x0+w,y0-h,d,h,{fill:CR,fo:.5,stroke:CR,sw:2,rx:2})+rect(x0,y0-h-d,w,d,{fill:CT,fo:.5,stroke:CT,sw:2,rx:2})+rect(x0+w,y0-h-d,d,d,{fill:CK,fo:.7,stroke:CK,sw:2,rx:2});
  s+=fade(labels,label('Δg',x0+w+d/2,y0+36,{size:26,color:CR,anchor:'middle'})+label('Δf',x0-20,y0-h-d/2+9,{size:26,color:CT,anchor:'end'}));
 }
 return s;
}

// ---- summary panels ---------------------------------------------------------------------------
function summary(p,step){
 let s=card(40,40,540,430,
   label('二段につながる（直列）',310,95,{size:30,color:C.hi,anchor:'middle',weight:700})
  +gear(170,210,52,8,-.8*smooth(p),C.t)+gear(310,210,52,8,-2.4*smooth(p),CU)+gear(450,210,52,8,-7*smooth(p),CY)
  +label('×',240,222,{size:30,color:C.dim,anchor:'middle'})+label('×',380,222,{size:30,color:C.dim,anchor:'middle'})
  +tex(`\\dfrac{d${Y}}{dt}=\\dfrac{d${Y}}{d${U}}\\cdot\\dfrac{d${U}}{dt}`,310,345,{size:42})
  +label('倍率を 掛ける（連鎖律）',310,440,{size:28,color:C.ink,anchor:'middle'}),step===0?seg(p,0,.2):1,C.hi);
 if(step>=1){
  const g=step===1?seg(p,0,.2):1,x0=700,y0=280,w=180,h=120,d=30;
  s+=card(620,40,540,430,
    label('同時に変わる積（並列）',890,95,{size:30,color:C.hi,anchor:'middle',weight:700})
   +rect(x0,y0-h,w,h,{fill:C.dim,fo:.12,stroke:C.dim,sw:2,rx:2})+rect(x0+w,y0-h,d,h,{fill:CR,fo:.5,stroke:CR,sw:2,rx:2})+rect(x0,y0-h-d,w,d,{fill:CT,fo:.5,stroke:CT,sw:2,rx:2})
   +label('fg',x0+w/2,y0-h/2+12,{size:30,color:C.ink,anchor:'middle'})
   +tex(`(fg)'={\\color{${CT}}f'g}+{\\color{${CR}}fg'}`,890,345,{size:42,auto:false})
   +label('増える場所を 足す（積の微分）',890,440,{size:28,color:C.ink,anchor:'middle'}),g,C.hi);
 }
 return s;
}

// oscillating position x = A sin(ωt+φ)
function wave(y0,{g=1,p=1,amp=70}={}){
 const x0=170,x1=1050,w=x1-x0;
 let s=fade(g,arrow(x0-10,y0,x1+30,y0,{color:C.dim,w:2.5,head:12})+arrow(x0,y0+amp+20,x0,y0-amp-30,{color:C.dim,w:2.5,head:12})
  +label('時刻 t',x1+20,y0+36,{size:24,color:C.t,anchor:'end'})+label('位置 x',x0+14,y0-amp-20,{size:24,color:C.x}));
 const f=u=>y0-amp*Math.sin(2*Math.PI*u*2.2+.5);
 s+=draw(Array.from({length:201},(_,i)=>{const u=i/200;return [x0+w*u,f(u)];}),g,{color:C.x,w:4});
 const u=.1+.8*((p*1.3)%1);s+=fade(g,dot(x0+w*u,f(u),10,C.hi));
 return s;
}

export const ytUiFunctionRules1Diagrams={
 // ===== S1 式の中の式 =====
 [K+'ask']:(p)=>{
  let s=card(200,40,800,230,
    label('前回の最後の問い',600,90,{size:24,color:C.dim,anchor:'middle'})
   +label('t を3倍してから 2乗する',600,150,{size:34,color:C.ink,anchor:'middle'})
   +label('式の中に 式が入っていたら',600,200,{size:30,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.55),label('変化の倍率は どうなる？',600,248,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12),C.hi);
  s+=pipeline(390,{g:seg(p,.6,.8)});
  return s;
 },
 [K+'phys']:(p)=>{
  const w1=texWidth('x=A\\sin(',64),w2=texWidth('\\omega t+\\varphi',64),wall=texWidth('x=A\\sin(\\omega t+\\varphi)',64);
  const left=600-wall/2;
  let s=tex('x=A\\sin(\\omega t+\\varphi)',600,120,{size:64});
  s+=highlight(left+w1-8,72,w2+16,78,seg(p,.4,.55));
  s+=fade(seg(p,.45,.6),arrow(left+w1+w2/2,160,left+w1+w2/2,200,{color:C.hi,w:3,head:12})+label('sin の中に 入った式',left+w1+w2/2,234,{size:26,color:C.hi,anchor:'middle'}));
  s+=label('振動する物体の位置',600,40,{size:26,color:C.dim,anchor:'middle'});
  s+=wave(380,{g:seg(p,.05,.3),p,amp:70});
  return s;
 },
 [K+'machine']:(p)=>{
  let s=pipeline(170,{g:seg(p,0,.2)});
  s+=fade(seg(p,.3,.45),label('3倍する',385,110,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('2乗する',815,110,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),tex(`${U}=3t`,385,380,{size:52}));
  s+=fade(seg(p,.65,.8),tex(`${Y}=${U}^2`,815,380,{size:52}));
  return s;
 },
 [K+'machine1']:(p)=>{
  let s=pipeline(170,{vals:['1','3','9'],vg:[seg(p,.05,.2),seg(p,.15,.3),seg(p,.25,.4)]});
  s+=label('t ＝ 1 のとき',170,60,{size:26,color:C.t,anchor:'middle'});
  s+=fade(seg(p,.45,.6),label('① 先に 中身',385,380,{size:30,color:CU,anchor:'middle',weight:700})+tex(`${U}=3\\times1=3`,385,440,{size:40,auto:false}));
  s+=fade(seg(p,.65,.8),label('② 外側へ渡す',815,380,{size:30,color:CY,anchor:'middle',weight:700})+tex(`${Y}=3^2=9`,815,440,{size:40,auto:false}));
  return s;
 },
 [K+'order']:(p)=>{
  let s=label('正しい順番',70,95,{size:26,color:C.F})+pipeline(120,{vals:['1','3','9'],X:[300,640,980]});
  s+=tex(`${Y}=9t^2`,1110,90,{size:34});
  const g=seg(p,.15,.35);
  s+=fade(g,label('逆の順番',70,345,{size:26,color:C.a}))+pipeline(370,{g,ops:['2乗','×3'],names:['t','','y'],colors:[C.t,C.dim,C.a],vals:['1','1','3'],vg:seg(p,.3,.5),X:[300,640,980]});
  s+=fade(seg(p,.6,.75),tex(`${`{\\color{${C.a}}y}`}=3t^2`,1110,340,{size:34})+label('別の関数',1110,410,{size:26,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=pipeline(110,{vals:['1','3','9']});
  s+=card(250,260,700,220,label('t が 少し動くと',600,320,{size:32,color:C.ink,anchor:'middle'})
   +label('y は t の 何倍の速さで 動く？',600,380,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('予想してみよう',600,440,{size:26,color:C.hi,anchor:'middle'})),seg(p,.05,.2),C.hi);
  return s;
 },

 // ===== S2 まとめて一つの式で =====
 [K+'direct']:(p)=>{
  let s=label('方法1：まとめて書く',600,70,{size:30,color:C.hi,anchor:'middle',weight:700});
  const a0=260,wa=texWidth(`${Y}=${U}^2`,56),wb=texWidth('=(3t)^2',56);
  s+=tex(`${Y}=${U}^2`,a0,200,{size:56,anchor:'start'});
  s+=fade(seg(p,.2,.35),tex('=(3t)^2',a0+wa+16,200,{size:56,anchor:'start'}));
  const xc=a0+wa+wb+50;
  s+=fade(seg(p,.5,.65),tex('=9t^2',xc,200,{size:56,anchor:'start'})+highlight(xc-15,150,texWidth('=9t^2',56)+30,84,seg(p,.7,.85)));
  s+=fade(seg(p,.5,.65),label('3t × 3t ＝ 9t²',600,360,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'t2']:(p)=>{
  // small square t × t growing by h: helper picture for the general t² rule
  const x0=90,y0=440,s0=230,d=46;let s='';
  s+=rect(x0,y0-s0,s0,s0,{fill:C.t,fo:.14,stroke:C.t,sw:3,rx:2})+label('t²',x0+s0/2,y0-s0/2+12,{size:36,color:C.t,anchor:'middle'});
  s+=label('t',x0+s0/2,y0+34,{size:28,color:C.t,anchor:'middle'})+label('t',x0-16,y0-s0/2+9,{size:28,color:C.t,anchor:'end'});
  const g=seg(p,.35,.55);
  s+=fade(g,rect(x0+s0,y0-s0,d,s0,{fill:CR,fo:.45,stroke:CR,sw:2,rx:2})+rect(x0,y0-s0-d,s0,d,{fill:CT,fo:.45,stroke:CT,sw:2,rx:2})+rect(x0+s0,y0-s0-d,d,d,{fill:CK,fo:.7,stroke:CK,sw:2,rx:2})
   +label('h',x0+s0+d/2,y0+34,{size:26,color:C.dim,anchor:'middle'})+label('th',x0+s0+d/2,y0-s0/2+8,{size:22,color:C.ink,anchor:'middle'})+label('th',x0+s0/2,y0-s0-d/2+8,{size:22,color:C.ink,anchor:'middle'}));
  s+=label('t² の傾きを どの時刻でも',780,70,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.1,.3),tex('(t+h)^2-t^2',780,170,{size:46}));
  s+=fade(seg(p,.35,.55),tex('=t^2+2th+h^2-t^2',780,260,{size:46}));
  s+=fade(seg(p,.6,.8),tex('=2th+h^2',780,350,{size:52})+label('増え方',1080,355,{size:26,color:C.hi}));
  return s;
 },
 [K+'t2b']:(p)=>{
  let s=tex('\\dfrac{2th+h^2}{h}',330,150,{size:52});
  s+=fade(seg(p,.1,.25),label('h で割る',330,245,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.15,.3),tex('=2t+h',520,150,{size:52,anchor:'start'}));
  s+=fade(seg(p,.35,.5),arrow(560,290,720,290,{color:C.hi,w:4})+label('h → 0',640,272,{size:24,color:C.hi,anchor:'middle'})+tex('2t',790,300,{size:56}));
  s+=card(300,370,600,100,label('t² の傾き ＝ 2t',600,435,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'nine']:(p)=>{
  let s=tex(`${Y}=9t^2`,260,150,{size:56});
  s+=fade(seg(p,.1,.3),arrow(410,140,560,140,{color:C.hi,w:4})+label('傾き',485,120,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.15,.35),tex('9\\times 2t=18t',790,150,{size:56}));
  s+=fade(seg(p,.1,.3),label('t² の傾き 2t の 9倍',790,240,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(300,320,600,130,label('t ＝ 1 では',600,370,{size:28,color:C.t,anchor:'middle'})+label('18',600,430,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'num']:(p)=>{
  let s=label('数値で確かめる',600,60,{size:28,color:C.dim,anchor:'middle'});
  s+=card(170,100,860,300,
    label('t',330,160,{size:30,color:C.t,anchor:'middle',weight:700})+label('y ＝ 9t²',700,160,{size:30,color:CY,anchor:'middle',weight:700})
   +line(200,185,1000,185,{color:C.faint,w:2})
   +label('1',330,245,{size:34,color:C.t,anchor:'middle'})+label('9',700,245,{size:34,color:CY,anchor:'middle'})
   +fade(seg(p,.3,.45),label('1.01',330,320,{size:34,color:C.t,anchor:'middle'}))
   +fade(seg(p,.55,.75),label('9 × 1.0201 ＝ 9.1809',700,320,{size:34,color:CY,anchor:'middle'}))
   +fade(seg(p,.3,.45),label('+0.01',470,285,{size:24,color:C.t,anchor:'middle'})));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=tex('\\dfrac{\\Delta y}{\\Delta t}',260,200,{size:52});
  s+=fade(seg(p,.05,.25),tex(`=\\dfrac{{\\color{${CY}}0.1809}}{{\\color{${C.t}}0.01}}`,380,200,{size:52,anchor:'start',auto:false}));
  s+=fade(seg(p,.35,.55),tex('=18.09',650,200,{size:52,anchor:'start',auto:false}));
  s+=card(330,330,540,110,label('ほぼ 18倍',600,400,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },

 // ===== S3 二段の歯車 =====
 [K+'gear1']:(p)=>gearRow(p,0)+fade(seg(p,0,.15),label('方法2：二段に分ける',600,40,{size:28,color:C.hi,anchor:'middle',weight:700})),
 [K+'gear2']:(p)=>gearRow(p,1)+label('方法2：二段に分ける',600,40,{size:28,color:C.hi,anchor:'middle',weight:700}),
 [K+'gear2b']:(p)=>{
  let s=gearRow(p,2)+label('方法2：二段に分ける',600,40,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.35),card(620,440,560,64,tex(`\\dfrac{0.1809}{0.03}=6.03\\approx 6`,900,478,{size:34,auto:false})));
  s+=fade(seg(p,.75,.9),label('2u ＝ 2×3 ＝ 6',300,478,{size:28,color:CU,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gears']:(p)=>{
  let s=gearRow(p,3)+label('方法2：二段に分ける',600,40,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=card(250,430,700,78,label('3倍 × 6倍 ＝ 18倍',470,480,{size:34,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('方法1 の 18 と一致',790,480,{size:28,color:C.F,anchor:'middle'})+ok(920,482)),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'mult']:(p)=>{
  const X0=260,u=70;let s='';
  const row=(y,n,text,g,color)=>fade(g,rect(X0,y-26,u*n,52,{fill:color,fo:.35,stroke:color,sw:2,rx:6})+label(text,X0-24,y+10,{size:30,color,anchor:'end',weight:700}));
  s+=row(120,1,'1',seg(p,0,.15),C.t);
  s+=row(230,2,'2',seg(p,.15,.3),CU)+fade(seg(p,.15,.3),label('2倍',X0+u*2+20,240,{size:28,color:CU}));
  s+=row(340,6,'6',seg(p,.35,.5),CY)+fade(seg(p,.35,.5),label('さらに 3倍',X0+u*6+20,350,{size:28,color:CY}));
  for(let i=1;i<3;i++)s+=fade(seg(p,.35,.5),line(X0+u*2*i,314,X0+u*2*i,366,{color:C.bg,w:3}));
  s+=card(250,420,700,80,label('倍率が 鎖のようにつながる → 掛け算',600,470,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'chain']:(p)=>{
  const src=`\\dfrac{d${Y}}{dt}=\\dfrac{d${Y}}{d${U}}\\times\\dfrac{d${U}}{dt}`;
  let s=tex(src,600,190,{size:72});
  s+=card(350,340,500,100,label('連鎖律',600,405,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'chain1']:(p)=>{
  const src=`\\dfrac{d${Y}}{dt}=\\dfrac{d${Y}}{d${U}}\\times\\dfrac{d${U}}{dt}`,W=texWidth(src,72),L=600-W/2;
  const wA=texWidth(`\\dfrac{d${Y}}{dt}=`,72),wB=texWidth(`\\dfrac{d${Y}}{d${U}}`,72),wX=texWidth('\\times',72);
  let s=tex(src,600,190,{size:72});
  const cB=L+wA+wB/2,cC=L+wA+wB+wX+wB/2;
  s+=fade(seg(p,.05,.25),brace(cB-wB/2,cB+wB/2,265,{color:CY})+label('外側の傾き',cB,335,{size:26,color:CY,anchor:'middle'})+tex(`2${U}`,cB,405,{size:48}));
  s+=fade(seg(p,.5,.7),brace(cC-wB/2,cC+wB/2,265,{color:CU})+label('中身の傾き',cC,335,{size:26,color:CU,anchor:'middle'})+tex('3',cC,405,{size:48,auto:false}));
  return s;
 },
 [K+'chain2']:(p)=>{
  const w0=texWidth(`\\dfrac{d${Y}}{dt}=2${U}\\times3`,56);
  let s=tex(`\\dfrac{d${Y}}{dt}=2${U}\\times3`,250,130,{size:56,anchor:'start'});
  s+=fade(seg(p,.1,.25),tex(`=6${U}`,250+w0+16,130,{size:56,anchor:'start'}));
  s+=fade(seg(p,.3,.45),label('u ＝ 3t を戻す',600,240,{size:26,color:CU,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),tex('=6\\times3t=18t',600,320,{size:56}));
  s+=card(250,400,700,80,label('どの時刻でも 方法1 の 18t と同じ',600,450,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.6,.75),C.F);
  return s;
 },
 [K+'delta']:(p)=>{
  let s=fade(seg(p,0,.15),label('✗ d を 分数のように 約分した のではない',600,60,{size:28,color:C.a,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),tex(`\\dfrac{\\Delta ${Y}}{\\Delta t}=\\dfrac{\\Delta ${Y}}{\\Delta ${U}}\\times\\dfrac{\\Delta ${U}}{\\Delta t}`,600,180,{size:58}));
  s+=fade(seg(p,.55,.7),tex(`\\dfrac{0.1809}{0.01}=\\dfrac{0.1809}{0.03}\\times\\dfrac{0.03}{0.01}`,600,330,{size:44,auto:false}));
  s+=fade(seg(p,.72,.85),tex('18.09=6.03\\times3',600,440,{size:44,auto:false})+ok(820,452));
  return s;
 },
 [K+'delta2']:(p)=>{
  let s=tex(`\\dfrac{\\Delta ${Y}}{\\Delta t}=\\dfrac{\\Delta ${Y}}{\\Delta ${U}}\\times\\dfrac{\\Delta ${U}}{\\Delta t}`,600,120,{size:50});
  s+=fade(seg(p,.1,.3),arrow(600,190,600,270,{color:C.hi,w:4})+label('幅 → 0 の 近づく先',630,240,{size:26,color:C.hi}));
  s+=fade(seg(p,.3,.5),tex(`\\dfrac{d${Y}}{dt}=\\dfrac{d${Y}}{d${U}}\\times\\dfrac{d${U}}{dt}`,600,370,{size:58})+highlight(320,272,560,180,seg(p,.5,.65)));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=card(150,50,900,120,label('外側を微分 × 中身を微分',600,125,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.4,.55),ng(250,272)+tex(`2${U}=6t`,420,260,{size:44})+label('t ＝ 1 で 6',700,272,{size:30,color:C.a})+label('3倍 小さい',950,272,{size:30,color:C.a,weight:700}));
  s+=fade(seg(p,.4,.55),ok(250,392)+tex(`2${U}\\times3=18t`,450,380,{size:44})+label('t ＝ 1 で 18',700,392,{size:30,color:C.F}));
  s+=fade(seg(p,.4,.55),label('中身の 3 を 掛け忘れ',420,320,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=pipeline(110,{ops:['×2','2乗']});
  s+=card(250,250,700,220,label('確かめ',600,300,{size:26,color:C.dim,anchor:'middle'})
   +tex(`${Y}=(2t)^2`,600,370,{size:52})
   +label('t ＝ 1 での 変化の倍率は？',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=pipeline(90,{ops:['×2','2乗'],vals:['1','2','4'],vg:1});
  s+=fade(seg(p,.05,.2),label('中身 2t の傾き ＝ 2',300,290,{size:30,color:CU,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),label('外側 u² の傾き 2u ＝ 4',860,290,{size:30,color:CY,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),tex('2\\times4=8',600,360,{size:56,auto:false})+highlight(470,318,260,80,1));
  return s;
 },
 [K+'quiz3']:(p)=>{
  let s=ytUiFunctionRules1Diagrams[K+'quiz2'](1);
  s+=fade(seg(p,.05,.25),label('まとめると y ＝ 4t² → 傾き 8t → t ＝ 1 で 8',600,470,{size:28,color:C.F,anchor:'middle'})+ok(1000,472,seg(p,.5,.65)));
  return s;
 },

 // ===== S4 掛け算の関数 =====
 [K+'rect']:(p)=>{
  const g=seg(p,.35,.8);let s=rectFG(p,{grow:g,labels:g});
  s+=card(620,120,540,260,label('面積 ＝ 縦 × 横',890,190,{size:34,color:C.ink,anchor:'middle',weight:700})
   +label('縦 f と 横 g が どちらも変わる',890,260,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.65),label('積 fg は どう変わる？',890,330,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'sq0']:(p)=>{
  const g=seg(p,.55,.8);
  let s=square(p,{strips:[g,g,g]});
  s+=card(620,110,540,250,label('一辺 x の 正方形',890,170,{size:30,color:C.x,anchor:'middle'})
   +tex('x\\times x',890,250,{size:56})
   +fade(seg(p,.5,.65),label('x を 3 → 3.1 へ',890,330,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'sq1']:(p)=>{
  let s=square(p);
  s+=tex('3.1^2=9.61',880,150,{size:48,auto:false});
  s+=fade(seg(p,.15,.35),tex('9.61-9=0.61',880,250,{size:48,auto:false})+label('増えた面積',880,305,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('三つに 分けてみる',880,400,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sq2']:(p)=>{
  const a=seg(p,.05,.2),b=seg(p,.5,.65);
  let s=square(p,{strips:[mix(.25,1,a),mix(.25,1,b),.25]});
  s+=fade(a,label('右の帯',640,150,{size:30,color:CR,weight:700})+tex('0.1\\times3=0.3',940,145,{size:44,auto:false}));
  s+=fade(a,label('伸びた幅 × 縦',940,200,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(b,label('上の帯',640,290,{size:30,color:CT,weight:700})+tex('3\\times0.1=0.3',940,285,{size:44,auto:false}));
  s+=fade(b,label('横 × 伸びた幅',940,340,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sq3']:(p)=>{
  const c=seg(p,.05,.2);
  let s=square(p,{strips:[1,1,mix(.25,1,c)]});
  s+=label('右の帯',640,110,{size:28,color:CR,weight:700})+tex('0.3',1060,105,{size:40,auto:false});
  s+=label('上の帯',640,180,{size:28,color:CT,weight:700})+tex('0.3',1060,175,{size:40,auto:false});
  s+=fade(c,label('右上の角',640,250,{size:28,color:CK,weight:700})+tex('0.1\\times0.1=0.01',960,245,{size:40,auto:false}));
  s+=fade(seg(p,.5,.65),line(640,290,1140,290,{color:C.dim,w:2})+label('合計',640,345,{size:28,color:C.ink})+tex('0.61',1060,340,{size:44,auto:false})+ok(1120,352));
  return s;
 },
 [K+'sq4']:(p)=>{
  const fadeCorner=1-.8*seg(p,.6,.85);
  let s=square(p,{strips:[1,1,fadeCorner]});
  s+=label('伸びた幅 0.1 で割る',900,90,{size:26,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),tex(`\\dfrac{0.61}{0.1}={\\color{${CR}}3}+{\\color{${CT}}3}+{\\color{${CK}}0.1}=6.1`,900,180,{size:44,auto:false}));
  s+=fade(seg(p,.55,.7),arrow(900,240,900,300,{color:C.hi,w:4})+label('幅 → 0',930,280,{size:24,color:C.hi})+label('角の分 → 0',1060,370,{size:24,color:CK,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),tex('6',900,380,{size:56,auto:false})+label('＝ x² の傾き 2x（x ＝ 3）',900,460,{size:28,color:C.F,anchor:'middle'}));
  return s;
 },
 [K+'gen']:(p)=>{
  let s=rectFG(p);
  s+=label('増える面積',880,90,{size:28,color:C.dim,anchor:'middle'});
  const parts=[[`{\\color{${CT}}g\\,\\Delta f}`,'上の帯',CT,.2],[`+{\\color{${CR}}f\\,\\Delta g}`,'右の帯',CR,.4],[`+{\\color{${CK}}\\Delta f\\,\\Delta g}`,'角',CK,.6]];
  const ws=parts.map(q=>texWidth(q[0],48,false)),W=ws.reduce((a,b)=>a+b,0);let x=880-W/2;
  parts.forEach(([src,name,col,a],k)=>{s+=fade(seg(p,a,a+.2),tex(src,x,190,{size:48,auto:false,anchor:'start'})+label(name,x+ws[k]/2+(k?12:0),250,{size:24,color:col,anchor:'middle'}));x+=ws[k];});
  return s;
 },
 [K+'gen2']:(p)=>{
  let s=rectFG(p,{labels:1});
  s+=label('動かした幅 Δx で割る',880,70,{size:26,color:C.dim,anchor:'middle'});
  s+=tex(`{\\color{${CT}}g\\dfrac{\\Delta f}{\\Delta x}}+{\\color{${CR}}f\\dfrac{\\Delta g}{\\Delta x}}+{\\color{${CK}}\\dfrac{\\Delta f}{\\Delta x}\\Delta g}`,850,170,{size:44,auto:false});
  s+=fade(seg(p,.3,.5),arrow(700,235,700,285,{color:CT,w:3,head:12})+arrow(840,235,840,285,{color:CR,w:3,head:12}));
  s+=fade(seg(p,.4,.6),tex(`{\\color{${CT}}f'g}`,700,330,{size:48,auto:false})+tex(`{\\color{${CR}}fg'}`,840,330,{size:48,auto:false}));
  s+=fade(seg(p,.6,.8),label('帯は 2本とも 残る',770,420,{size:28,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'gen3']:(p)=>{
  let s=rectFG(p,{labels:1});
  s+=tex(`{\\color{${CT}}g\\dfrac{\\Delta f}{\\Delta x}}+{\\color{${CR}}f\\dfrac{\\Delta g}{\\Delta x}}+{\\color{${CK}}\\dfrac{\\Delta f}{\\Delta x}\\Delta g}`,850,170,{size:44,auto:false});
  const wAll=texWidth(`{\\color{${CT}}g\\dfrac{\\Delta f}{\\Delta x}}+{\\color{${CR}}f\\dfrac{\\Delta g}{\\Delta x}}+{\\color{${CK}}\\dfrac{\\Delta f}{\\Delta x}\\Delta g}`,44,false),wLast=texWidth('\\dfrac{\\Delta f}{\\Delta x}\\Delta g',44,false);
  const xl=850+wAll/2-wLast;
  s+=highlight(xl-10,115,wLast+20,100,seg(p,.05,.2),CK);
  s+=fade(seg(p,.1,.3),label('f の伸びの割合 × Δg',xl+wLast/2,250,{size:24,color:CK,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),label('幅 → 0 で Δg → 0',850,330,{size:30,color:CK,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),label('角の項 → 0',850,400,{size:34,color:CK,anchor:'middle',weight:700}));
  return s;
 },
 [K+'prod']:(p)=>{
  const src=`(fg)'={\\color{${CT}}f'g}+{\\color{${CR}}fg'}`;
  let s=tex(src,600,170,{size:76,auto:false})+highlight(600-texWidth(src,76,false)/2-30,105,texWidth(src,76,false)+60,120,seg(p,.1,.25));
  const Wt=texWidth(src,76,false),R0=600+Wt/2,w3=texWidth("fg'",76,false),w2=texWidth("f'g+",76,false),w1=texWidth("f'g",76,false);
  s+=fade(seg(p,.3,.45),label('上の帯',R0-w3-w2+w1/2,275,{size:26,color:CT,anchor:'middle'})+label('右の帯',R0-w3/2,275,{size:26,color:CR,anchor:'middle'}));
  s+=card(250,330,700,80,label('増える場所が 二か所 → 足し算',600,382,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  s+=fade(seg(p,.7,.85),label('積の微分',600,470,{size:34,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'xx']:(p)=>{
  let s=label('検算：f ＝ x，g ＝ x',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.1,.25),tex("f'=1,\\quad g'=1",600,150,{size:44,auto:false}));
  s+=fade(seg(p,.3,.5),tex(`(x\\cdot x)'={\\color{${CT}}1\\cdot x}+{\\color{${CR}}x\\cdot1}=2x`,600,260,{size:56}));
  s+=fade(seg(p,.6,.75),label('t² の傾き 2t と 同じ形',600,380,{size:32,color:C.F,anchor:'middle',weight:700})+ok(820,384));
  return s;
 },
 [K+'wrong']:(p)=>{
  const c=seg(p,.45,.65);
  let s=square(p,{strips:[1-.75*c,1-.75*c,.25],cross:c});
  s+=fade(seg(p,.05,.25),ng(640,160)+tex("f'g'=1\\times1=1",880,150,{size:48,auto:false}));
  s+=fade(seg(p,.45,.6),label('増えた帯を 2本とも 失う',880,270,{size:32,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),ok(640,390)+tex(`{\\color{${CT}}f'g}+{\\color{${CR}}fg'}`,880,380,{size:48,auto:false}));
  return s;
 },

 // ===== S5 まとめと次の問い =====
 [K+'sum1']:(p)=>summary(p,0),
 [K+'sum2']:(p)=>summary(p,1),
 [K+'next1']:(p)=>{
  let s=tex('x=A\\sin(\\omega t+\\varphi)',600,70,{size:52});
  s+=pipeline(230,{g:seg(p,.1,.3),ops:['ω倍＋φ','sin'],names:['t','u','x'],colors:[C.t,CU,C.x]});
  s+=fade(seg(p,.35,.5),label('中身 u ＝ ωt ＋ φ',600,380,{size:30,color:CU,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('t が動くと 中身も動く',600,450,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=wave(390,{p,amp:60});
  s+=card(200,40,800,220,label('次の問い',600,90,{size:26,color:C.dim,anchor:'middle'})
   +tex('x=A\\sin(\\omega t+\\varphi)',600,160,{size:52})
   +label('振動する位置は どう微分する？',600,230,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
