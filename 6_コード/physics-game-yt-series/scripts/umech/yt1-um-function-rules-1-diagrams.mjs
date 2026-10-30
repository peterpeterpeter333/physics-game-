// YouTube シリーズ 微分の法則・中級 1/2（ステージ um-function-rules 本0〜本2）— 図。Stage 1200×515.
// 色：時刻 t 金、中身 u 橙、外側の出力 y 緑、強調 黄、誤り 赤。積の微分：上の帯 紫（gΔf）、右の帯 桃（fΔg）、角 赤。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='um-function-rules-1:';
const CU=C.E,CY=C.F,CR=C.p,CT=C.v,CK=C.a;
const U=`{\\color{${CU}}u}`,Y=`{\\color{${CY}}y}`,T=`{\\color{${C.t}}t}`;
const DU=`\\Delta ${U}`,DY=`\\Delta ${Y}`,DT=`\\Delta ${T}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const title=(s)=>label(s,600,44,{size:26,color:C.dim,anchor:'middle'});

// ---- pipeline t → [op] → u → [op] → y -------------------------------------------------------
function node(x,y,name,color,g=1){
 return fade(g,ring(x,y,40,{color,w:4,fill:'#10182c'})+label(name,x,y+12,{size:36,color,anchor:'middle',weight:700}));
}
function opbox(x,y,text,g=1){return fade(g,rect(x-86,y-32,172,64,{fill:'#1a2440',fo:1,stroke:C.dim,sw:2,rx:12})+label(text,x,y+10,{size:26,color:C.ink,anchor:'middle',weight:700}));}
function pipeline(y,{g=1,ops=['×2 ＋1','2乗'],X=[170,600,1030],cols=[C.t,CU,CY],names=['t','u','y']}={}){
 let s='';
 const bx=[(X[0]+X[1])/2,(X[1]+X[2])/2];
 for(let i=0;i<3;i++)s+=node(X[i],y,names[i],cols[i],g);
 for(let i=0;i<2;i++){s+=fade(g,arrow(X[i]+44,y,bx[i]-92,y,{color:C.dim,w:3,head:12})+arrow(bx[i]+92,y,X[i+1]-46,y,{color:C.dim,w:3,head:12}));s+=opbox(bx[i],y,ops[i],g);}
 return s;
}

// ---- gears (from 初級) ------------------------------------------------------------------------
function gear(cx,cy,r,teeth,ang,color,g=1){
 const pts=[];const N=teeth*4;
 for(let i=0;i<N;i++){const a=ang+i*2*Math.PI/N,rr=(i%4<2)?r:r*.8;pts.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)]);}
 return fade(g,poly(pts,{fill:color,fo:.22,stroke:color,sw:3})+ring(cx,cy,r*.28,{color,w:3,fill:C.bg})
  +line(cx,cy,cx+r*.62*Math.cos(ang),cy+r*.62*Math.sin(ang),{color,w:4}));
}
// rectangle f (vertical) × g (horizontal), growth Δf up (上の帯 gΔf), Δg right (右の帯 fΔg)
function rectFG({x0=110,y0=450,w=300,h=220,d=48,g=[1,1,1],labels=1,dim=[1,1,1]}={}){
 let s=rect(x0,y0-h,w,h,{fill:C.dim,fo:.12,stroke:C.dim,sw:3,rx:2})+label('fg',x0+w/2,y0-h/2+14,{size:38,color:C.ink,anchor:'middle',weight:700});
 s+=label('g',x0+w/2,y0+36,{size:30,color:C.ink,anchor:'middle',weight:700})+label('f',x0-20,y0-h/2+10,{size:30,color:C.ink,anchor:'end',weight:700});
 s+=fade(g[0]*dim[0],rect(x0,y0-h-d,w,d,{fill:CT,fo:.5,stroke:CT,sw:2,rx:2})+fade(labels,label('gΔf',x0+w/2,y0-h-d/2+9,{size:24,color:C.ink,anchor:'middle'})));
 s+=fade(g[1]*dim[1],rect(x0+w,y0-h,d,h,{fill:CR,fo:.5,stroke:CR,sw:2,rx:2})+fade(labels*(d>=46?1:0),label('fΔg',x0+w+d/2,y0-h/2+8,{size:20,color:C.ink,anchor:'middle'})));
 s+=fade(g[2]*dim[2],rect(x0+w,y0-h-d,d,d,{fill:CK,fo:.75,stroke:CK,sw:2,rx:2}));
 s+=fade(labels*Math.max(g[1],g[2]),label('Δg',x0+w+d/2,y0+36,{size:24,color:CR,anchor:'middle'}));
 s+=fade(labels*Math.max(g[0],g[2]),label('Δf',x0-20,y0-h-d/2+9,{size:24,color:CT,anchor:'end'}));
 return s;
}

// ---- value table for Δt = 0.01 -----------------------------------------------------------------
// vis[i] = [value-row opacity, delta-row opacity]
function table(vis){
 let s=pipeline(90);
 const X=[170,600,1030],ry=210;
 const rows=[['1 → 1.01','Δt ＝ 0.01',C.t],['3 → 3.02','Δu ＝ 0.02',CU],['9 → 9.1204','Δy ＝ 0.1204',CY]];
 rows.forEach(([a,b,c],i)=>{s+=fade(vis[i][0],label(a,X[i],ry,{size:30,color:c,anchor:'middle'}))+fade(vis[i][1],label(b,X[i],ry+50,{size:30,color:c,anchor:'middle',weight:700}));});
 return s;
}

export const ytUmFunctionRules1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=card(170,40,860,250,
    label('前回の最後の問い',600,90,{size:24,color:C.dim,anchor:'middle'})
   +tex('(2t+1)^2',420,170,{size:54})+label('中に式が入った関数',420,240,{size:26,color:C.ink,anchor:'middle'})
   +tex('f\\,g',800,170,{size:54,auto:false})+label('掛け算の関数',800,240,{size:26,color:C.ink,anchor:'middle'}),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.45,.6),label('傾きは どう求める？',600,370,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'recap']:(p)=>{
  const th=-.9*smooth(p);
  let s=card(40,40,540,430,
    label('連鎖律（初級）',310,90,{size:28,color:C.hi,anchor:'middle',weight:700})
   +gear(170,210,52,8,th,C.t)+gear(310,210,52,8,3*th,CU)+gear(450,210,52,8,18*th,CY)
   +label('×3',240,300,{size:28,color:C.hi,anchor:'middle',weight:700})+label('×6',380,300,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('倍率を 掛ける',310,410,{size:30,color:C.ink,anchor:'middle'}),seg(p,0,.2),C.faint);
  s+=card(620,40,540,430,
    label('積の微分（初級）',890,90,{size:28,color:C.hi,anchor:'middle',weight:700})
   +rect(760,190,160,160,{fill:C.x,fo:.18,stroke:C.x,sw:2,rx:2})+rect(920,190,26,160,{fill:CR,fo:.5,stroke:CR,sw:2,rx:2})+rect(760,164,160,26,{fill:CT,fo:.5,stroke:CT,sw:2,rx:2})+rect(920,164,26,26,{fill:CK,fo:.75,stroke:CK,sw:2,rx:2})
   +tex('x\\times x',840,280,{size:36})
   +label('帯を 足す',890,410,{size:30,color:C.ink,anchor:'middle'}),seg(p,.35,.55),C.faint);
  s+=fade(seg(p,.7,.85),label('数値と図で 確かめた',600,500,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'goal']:(p)=>{
  let s=label('今回：理由を 差の比の極限から',600,70,{size:32,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),tex(`\\dfrac{${DY}}{${DT}}`,330,230,{size:66,auto:false})+label('差の比（幅あり）',330,340,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),arrow(470,220,700,220,{color:C.hi,w:4})+label('幅 → 0',585,195,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),tex(`\\dfrac{d${Y}}{d${T}}`,850,230,{size:66,auto:false})+label('近づく先',850,340,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('なぜ 掛け算？',400,440,{size:32,color:CU,anchor:'middle',weight:700})+label('なぜ 足し算？',800,440,{size:32,color:CR,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=tex(`${Y}=(2t+1)^2`,600,110,{size:62});
  s+=fade(seg(p,.1,.25),label('t ＝ 1 での傾きは？',600,200,{size:30,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),tex(`2\\times1+1=3`,380,330,{size:46,auto:false})+label('中身',380,400,{size:26,color:CU,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),tex(`3^2=9`,820,330,{size:46,auto:false})+label('y',820,400,{size:28,color:CY,anchor:'middle',weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=tex(`${Y}=(2t+1)^2`,600,90,{size:50});
  s+=card(250,170,700,280,label('外側 u² の傾き 2u',600,230,{size:30,color:CU,anchor:'middle'})
   +tex(`2${U}=2\\times3=6`,600,300,{size:48,auto:false})
   +label('答えは 6 ？',600,380,{size:38,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('予想してみよう',600,428,{size:24,color:C.hi,anchor:'middle'})),seg(p,.05,.2),C.hi);
  return s;
 },

 // ===== S2 差の比を二段に分ける =====
 [K+'name']:(p)=>{
  let s=pipeline(140,{g:seg(p,0,.2)});
  s+=fade(seg(p,.15,.3),tex(`${U}=2t+1`,385,300,{size:48}));
  s+=fade(seg(p,.3,.45),tex(`${Y}=${U}^2`,815,300,{size:48}));
  s+=fade(seg(p,.6,.75),label('t が動く → u が動く → y が動く',600,430,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'tbl1']:(p)=>table([[seg(p,.05,.2),seg(p,.15,.3)],[seg(p,.45,.6),seg(p,.7,.85)],[0,0]]),
 [K+'tbl2']:(p)=>table([[1,1],[1,1],[seg(p,.1,.35),seg(p,.6,.8)]]),
 [K+'tbl3']:(p)=>{
  let s=table([[1,1],[1,1],[1,1]]);
  s+=fade(seg(p,.05,.25),tex(`\\dfrac{${DY}}{${DT}}=\\dfrac{0.1204}{0.01}=12.04`,600,390,{size:44,auto:false}));
  s+=fade(seg(p,.5,.65),label('6 ではなく',520,480,{size:30,color:C.a,anchor:'middle'})+label('→ ほぼ 12',700,480,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'split']:(p)=>{
  let s=tex(`\\dfrac{${DY}}{${DT}}`,300,200,{size:66,auto:false});
  s+=fade(seg(p,.25,.45),tex(`=\\dfrac{${DY}}{${DU}}\\times\\dfrac{${DU}}{${DT}}`,390,200,{size:66,anchor:'start',auto:false}));
  const w0=texWidth(`=`,66,false)+8,wf=texWidth(`\\dfrac{${DY}}{${DU}}`,66,false),wx=texWidth(`\\times`,66,false);
  const c1=390+w0+wf/2,c2=390+w0+wf+wx+wf/2;
  s+=fade(seg(p,.5,.65),label('外側の倍率',c1,340,{size:28,color:CY,anchor:'middle'})+label('内側の倍率',c2,340,{size:28,color:CU,anchor:'middle'}));
  return s;
 },
 [K+'split2']:(p)=>{
  const a=`\\dfrac{${DY}}{${DT}}=`,b=`\\dfrac{${DY}}{${DU}}`,c=`\\times`,d=`\\dfrac{${DU}}{${DT}}`;
  const wa=texWidth(a,66,false),wb=texWidth(b,66,false),wc=texWidth(c,66,false),wd=texWidth(d,66,false),L=600-(wa+wb+wc+wd)/2;
  let s=tex(a+b+c+d,600,200,{size:66,auto:false});
  const x1=L+wa+wb/2,x2=L+wa+wb+wc+wd/2;
  // Δu in the denominator of the first factor and the numerator of the second
  s+=highlight(x1-48,210,96,66,seg(p,.1,.25),CU)+highlight(x2-48,124,96,66,seg(p,.1,.25),CU);
  s+=fade(seg(p,.3,.45),line(x1-40,262,x1+40,228,{color:C.a,w:4})+line(x2-40,176,x2+40,142,{color:C.a,w:4}));
  s+=fade(seg(p,.35,.5),label('打ち消し合う',600,330,{size:28,color:C.a,anchor:'middle'}));
  s+=card(250,380,700,90,label('Δu ≠ 0 なら ぴったり成り立つ 等式',600,437,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.6,.75),C.F);
  return s;
 },
 [K+'nums']:(p)=>{
  let s=tex(`\\dfrac{${DY}}{${DT}}=\\dfrac{${DY}}{${DU}}\\times\\dfrac{${DU}}{${DT}}`,600,110,{size:50,auto:false});
  s+=fade(seg(p,.1,.3),tex(`\\dfrac{0.1204}{0.02}=6.02`,380,290,{size:46,auto:false})+label('外側の倍率',380,390,{size:28,color:CY,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),tex(`\\dfrac{0.02}{0.01}=2`,860,290,{size:46,auto:false})+label('内側の倍率',860,390,{size:28,color:CU,anchor:'middle'}));
  return s;
 },
 [K+'nums2']:(p)=>{
  let s=tex(`\\dfrac{${DY}}{${DT}}=\\dfrac{${DY}}{${DU}}\\times\\dfrac{${DU}}{${DT}}`,600,110,{size:50,auto:false});
  s+=tex(`12.04=6.02\\times2`,600,290,{size:56,auto:false});
  s+=fade(seg(p,.4,.55),ok(860,300)+label('左辺 ＝ 右辺',600,390,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lim1']:(p)=>{
  let s=tex(`\\dfrac{${DY}}{${DT}}=\\dfrac{${DY}}{${DU}}\\times\\dfrac{${DU}}{${DT}}`,600,110,{size:50,auto:false});
  s+=fade(seg(p,.05,.25),label('Δt → 0 なら Δu → 0',600,210,{size:30,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),label('外側の倍率 → 2u ＝ 6',380,320,{size:30,color:CY,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('内側の倍率 ＝ 2 のまま',840,320,{size:30,color:CU,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lim2']:(p)=>{
  let s=label('幅を縮める',600,50,{size:26,color:C.dim,anchor:'middle'});
  const hx=[250,520,720,960];
  s+=label('Δt',hx[0],110,{size:28,color:C.t,anchor:'middle',weight:700})+label('外側の倍率',hx[1],110,{size:26,color:CY,anchor:'middle'})+label('内側',hx[2],110,{size:26,color:CU,anchor:'middle'})+label('Δy / Δt',hx[3],110,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=line(140,132,1080,132,{color:C.faint,w:2});
  const rows=[['0.01','6.02','2','12.04'],['0.001','6.002','2','12.004'],['→ 0','→ 6','2','→ 12']];
  const gs=[1,seg(p,.05,.25),seg(p,.55,.75)];
  rows.forEach((r,i)=>{const y=190+i*80,col=i===2?C.hi:C.ink;
   s+=fade(gs[i],label(r[0],hx[0],y,{size:32,color:C.t,anchor:'middle'})+label(r[1],hx[1],y,{size:32,color:CY,anchor:'middle'})+label('×',620,y,{size:28,color:C.dim,anchor:'middle'})+label(r[2],hx[2],y,{size:32,color:CU,anchor:'middle'})+label(r[3],hx[3],y,{size:34,color:col,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.75,.9),highlight(150,318,920,50,1));
  return s;
 },
 [K+'chain']:(p)=>{
  const src=`\\dfrac{d${Y}}{d${T}}=\\dfrac{d${Y}}{d${U}}\\times\\dfrac{d${U}}{d${T}}`;
  let s=tex(src,600,170,{size:72,auto:false});
  s+=fade(seg(p,.2,.4),label('12',600-texWidth(src,72,false)/2+50,300,{size:34,color:C.hi,anchor:'middle',weight:700})+label('＝ 6 × 2',720,300,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=card(400,360,400,90,label('連鎖律',600,418,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'chain2']:(p)=>{
  let s=tex(`\\dfrac{d${Y}}{d${T}}=\\dfrac{d${Y}}{d${U}}\\times\\dfrac{d${U}}{d${T}}`,600,120,{size:56,auto:false});
  s+=fade(seg(p,.05,.25),ng(250,272)+label('d を 約分した',300,272,{size:30,color:C.a}));
  s+=fade(seg(p,.4,.6),ok(250,372)+label('Δ の等式の 近づく先',300,372,{size:30,color:C.F}));
  s+=fade(seg(p,.4,.6),tex(`\\dfrac{${DY}}{${DT}}=\\dfrac{${DY}}{${DU}}\\times\\dfrac{${DU}}{${DT}}`,900,420,{size:38,auto:false}));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=gear(250,180,70,8,-.9*smooth(p),C.t)+gear(600,180,70,8,-1.8*smooth(p),CU)+gear(950,180,70,8,-10.8*smooth(p),CY);
  s+=label('t',250,290,{size:32,color:C.t,anchor:'middle',weight:700})+label('u',600,290,{size:32,color:CU,anchor:'middle',weight:700})+label('y',950,290,{size:32,color:CY,anchor:'middle',weight:700});
  s+=label('×2',425,190,{size:32,color:CU,anchor:'middle',weight:700})+label('×6',775,190,{size:32,color:CY,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),ng(300,400)+label('6 だけ ＝ 内側の ×2 を落とした',340,400,{size:28,color:C.a}));
  s+=fade(seg(p,.5,.7),ok(300,460)+label('6 × 2 ＝ 12',340,460,{size:28,color:C.F}));
  return s;
 },

 // ===== S3 どの時刻でも・振動でも =====
 [K+'gen']:(p)=>{
  let s=label('どの時刻 t でも',600,50,{size:26,color:C.dim,anchor:'middle'});
  s+=tex(`\\dfrac{d${Y}}{d${T}}=2${U}\\times2`,600,150,{size:56,auto:false});
  s+=fade(seg(p,.4,.6),label('u ＝ 2t ＋ 1 を戻す',600,250,{size:26,color:CU,anchor:'middle'}));
  s+=fade(seg(p,.45,.65),tex(`=2(2t+1)\\times2`,600,340,{size:56}));
  return s;
 },
 [K+'gen2']:(p)=>{
  let s=tex(`\\dfrac{d${Y}}{d${T}}=2(2t+1)\\times2`,600,110,{size:50,auto:false});
  s+=fade(seg(p,.05,.25),tex(`=4(2t+1)`,600,220,{size:56}));
  s+=fade(seg(p,.45,.65),label('t ＝ 1',400,340,{size:30,color:C.t,anchor:'middle'})+tex('4\\times3=12',640,340,{size:50,auto:false}));
  s+=fade(seg(p,.7,.85),highlight(500,300,280,80,1));
  return s;
 },
 [K+'exp1']:(p)=>{
  let s=label('展開して 確かめる',600,50,{size:26,color:C.dim,anchor:'middle'});
  s+=tex(`(2t+1)^2`,600,150,{size:56});
  s+=fade(seg(p,.3,.5),tex(`=4t^2+4t+1`,600,260,{size:56}));
  return s;
 },
 [K+'exp2']:(p)=>{
  let s=tex(`${Y}=4t^2+4t+1`,600,110,{size:52});
  s+=fade(seg(p,.05,.25),label('項ごとに 微分',600,200,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.1,.3),tex(`\\dfrac{d${Y}}{d${T}}=8t+4`,600,290,{size:52,auto:false}));
  s+=fade(seg(p,.5,.7),tex(`=4(2t+1)`,600,400,{size:52})+ok(820,410));
  return s;
 },
 [K+'osc1']:(p)=>{
  let s=tex('x=A\\sin(\\omega t+\\varphi)',600,90,{size:52});
  s+=fade(seg(p,.1,.3),pipeline(240,{ops:['ω倍 ＋φ','A sin'],cols:[C.t,CU,C.x],names:['t','u','x']}));
  s+=fade(seg(p,.1,.3),label('中身 u ＝ ωt ＋ φ',600,340,{size:26,color:CU,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),tex('v=A\\omega\\cos(\\omega t+\\varphi)',600,440,{size:50})+label('（初級）',960,450,{size:24,color:C.dim}));
  return s;
 },
 [K+'osc2']:(p)=>{
  let s=tex('v=A\\omega\\cos(\\omega t+\\varphi)',600,90,{size:50});
  s+=fade(seg(p,.05,.3),label('外側：cos → −sin',380,220,{size:32,color:CY,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.7),label('中身の倍率 ω を もう一度',820,220,{size:32,color:CU,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.75),tex('A\\omega\\times(-\\sin u)\\times\\omega',600,340,{size:50}));
  return s;
 },
 [K+'osc3']:(p)=>{
  let s=tex('a=-A\\omega^2\\sin(\\omega t+\\varphi)',600,90,{size:50});
  const src='=-\\omega^2\\,A\\sin(\\omega t+\\varphi)',W=texWidth(src,50),wl=texWidth('=-\\omega^2\\,',50);
  s+=fade(seg(p,.25,.4),tex(src,600,200,{size:50})+label('並べ替え',600+W/2+30,210,{size:24,color:C.dim}));
  s+=fade(seg(p,.4,.55),brace(600-W/2+wl,600+W/2,250,{color:C.x,text:'x',size:30}));
  s+=fade(seg(p,.6,.75),tex('a=-\\omega^2x',600,390,{size:64})+highlight(600-texWidth('a=-\\omega^2x',64)/2-20,342,texWidth('a=-\\omega^2x',64)+40,88,seg(p,.75,.9)));
  return s;
 },
 [K+'osc4']:(p)=>{
  let s=label('単位で 確かめる（A は m、ω は 1/s）',600,60,{size:26,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),ng(200,190)+tex('A\\omega',330,180,{size:48})+label('→  m/s',420,190,{size:34,color:C.a})+label('加速度でない',700,190,{size:30,color:C.a}));
  s+=fade(seg(p,.5,.7),ok(200,330)+tex('A\\omega^2',340,320,{size:48})+label('→  m/s²',440,330,{size:34,color:C.F})+label('加速度の単位',720,330,{size:30,color:C.F}));
  return s;
 },

 // ===== S4 積の微分と角の項 =====
 [K+'prod0']:(p)=>{
  let s=rectFG({g:[0,0,0],labels:0});
  s+=card(600,110,560,260,label('面積 fg',880,170,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('縦 f も 横 g も t で変わる',880,240,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.6),label('fg の増え方は？',880,315,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'prod1']:(p)=>{
  const g=seg(p,.1,.4);
  let s=rectFG({g:[g,g,g],labels:0});
  s+=fade(seg(p,.1,.3),label('t → t ＋ Δt',880,90,{size:28,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),tex('f\\to f+\\Delta f,\\quad g\\to g+\\Delta g',880,170,{size:40,auto:false}));
  s+=fade(seg(p,.55,.75),label('増えた分',880,260,{size:26,color:C.dim,anchor:'middle'})+tex('(f+\\Delta f)(g+\\Delta g)-fg',880,330,{size:40,auto:false}));
  return s;
 },
 [K+'prod2']:(p)=>{
  let s=rectFG({labels:0});
  s+=tex('(f+\\Delta f)(g+\\Delta g)-fg',880,110,{size:38,auto:false});
  s+=fade(seg(p,.1,.35),tex('=fg+g\\Delta f+f\\Delta g+\\Delta f\\Delta g-fg',850,220,{size:36,auto:false}));
  return s;
 },
 [K+'prod3']:(p)=>{
  let s=rectFG({labels:0});
  const src='=fg+g\\Delta f+f\\Delta g+\\Delta f\\Delta g-fg',W=texWidth(src,36,false),L=850-W/2;
  const w1=texWidth('=fg',36,false),w0=texWidth('=',36,false),wEnd=texWidth('-fg',36,false);
  s+=tex('(f+\\Delta f)(g+\\Delta g)-fg',880,110,{size:38,auto:false})+tex(src,850,220,{size:36,auto:false});
  const c=seg(p,.1,.35);
  s+=fade(c,line(L+w0,232,L+w1,204,{color:C.a,w:4})+line(L+W-wEnd+8,232,L+W,204,{color:C.a,w:4}));
  s+=fade(seg(p,.45,.65),tex(`={\\color{${CT}}g\\Delta f}+{\\color{${CR}}f\\Delta g}+{\\color{${CK}}\\Delta f\\Delta g}`,850,330,{size:44,auto:false}));
  return s;
 },
 [K+'prod4']:(p)=>{
  const a=seg(p,.1,.25),b=seg(p,.3,.45),c=seg(p,.55,.7);
  let s=rectFG({dim:[mix(.3,1,a),mix(.3,1,b),mix(.3,1,c)]});
  s+=tex(`={\\color{${CT}}g\\Delta f}+{\\color{${CR}}f\\Delta g}+{\\color{${CK}}\\Delta f\\Delta g}`,850,110,{size:44,auto:false});
  s+=fade(a,label('上の帯',700,230,{size:30,color:CT,weight:700}));
  s+=fade(b,label('右の帯',850,230,{size:30,color:CR,weight:700}));
  s+=fade(c,label('右上の角',1000,230,{size:30,color:CK,weight:700}));
  return s;
 },
 [K+'div1']:(p)=>{
  let s=rectFG({x0:90,w:240,h:180,d:40});
  s+=tex(`{\\color{${CT}}g\\Delta f}+{\\color{${CR}}f\\Delta g}+{\\color{${CK}}\\Delta f\\Delta g}`,790,110,{size:40,auto:false});
  s+=fade(seg(p,.05,.2),label('Δt で割る',790,190,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.15,.4),tex(`{\\color{${CT}}g\\dfrac{\\Delta f}{\\Delta t}}+{\\color{${CR}}f\\dfrac{\\Delta g}{\\Delta t}}+{\\color{${CK}}\\dfrac{\\Delta f}{\\Delta t}\\Delta g}`,790,300,{size:44,auto:false}));
  return s;
 },
 [K+'div2']:(p)=>{
  let s=rectFG({x0:90,w:240,h:180,d:40,dim:[.3,.3,1]});
  const src=`{\\color{${CT}}g\\dfrac{\\Delta f}{\\Delta t}}+{\\color{${CR}}f\\dfrac{\\Delta g}{\\Delta t}}+{\\color{${CK}}\\dfrac{\\Delta f}{\\Delta t}\\Delta g}`;
  const W=texWidth(src,44,false),wl=texWidth('\\dfrac{\\Delta f}{\\Delta t}\\Delta g',44,false),wf=texWidth('\\dfrac{\\Delta f}{\\Delta t}',44,false);
  s+=tex(src,790,160,{size:44,auto:false});
  const xl=790+W/2-wl;
  s+=highlight(xl-10,95,wl+20,110,seg(p,.05,.2),CK);
  s+=fade(seg(p,.25,.45),brace(xl,xl+wf,225,{color:C.ink,text:'f の変化の割合',size:24}));
  s+=fade(seg(p,.55,.75),label('× Δg',xl+wl-10,330,{size:28,color:CK,anchor:'middle',weight:700}));
  return s;
 },
 [K+'div3']:(p)=>{
  let s=rectFG({x0:90,w:240,h:180,d:mix(40,6,seg(p,.3,.8)),dim:[.3,.3,1],labels:0});
  const src=`{\\color{${CK}}\\dfrac{\\Delta f}{\\Delta t}\\,\\Delta g}`;
  s+=tex(src,790,120,{size:52,auto:false});
  s+=fade(seg(p,.1,.3),label("→ f′（有限の値）",650,230,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),label('→ 0',930,230,{size:30,color:CK,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),card(560,300,480,90,label("f′ × 0 → 0",800,358,{size:36,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  s+=fade(seg(p,.7,.9),label('「小さいから無視」ではない',800,450,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'num1']:(p)=>{
  let s=label('例：f ＝ g ＝ t，t ＝ 3（面積 t²）',600,50,{size:28,color:C.dim,anchor:'middle'});
  s+=tex(`{\\color{${CK}}\\dfrac{\\Delta t\\,\\Delta t}{\\Delta t}}=\\Delta t`,600,150,{size:50,auto:false});
  const hx=[330,600,870];
  s+=label('Δt',hx[0],260,{size:28,color:C.t,anchor:'middle',weight:700})+label('帯の二項',hx[1],260,{size:28,color:C.ink,anchor:'middle'})+label('角の項',hx[2],260,{size:28,color:CK,anchor:'middle'});
  const rows=[['0.1','3 ＋ 3','0.1'],['0.01','3 ＋ 3','0.01'],['0.001','3 ＋ 3','0.001']];
  rows.forEach((r,i)=>{const g=seg(p,.25+i*.2,.4+i*.2),y=320+i*60;s+=fade(g,label(r[0],hx[0],y,{size:30,color:C.t,anchor:'middle'})+label(r[1],hx[1],y,{size:30,color:C.ink,anchor:'middle'})+label(r[2],hx[2],y,{size:30,color:CK,anchor:'middle',weight:700}));});
  return s;
 },
 [K+'num2']:(p)=>{
  let s=ytUmFunctionRules1Diagrams[K+'num1'](1);
  s+=fade(seg(p,.05,.25),highlight(500,292,200,160,1));
  s+=fade(seg(p,.4,.6),label('3 ＋ 3 ＝ 6 ＝ t² の傾き 2t（t ＝ 3）',600,495,{size:26,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rule']:(p)=>{
  const src=`(fg)'={\\color{${CT}}f'g}+{\\color{${CR}}fg'}`;
  const W=texWidth(src,76,false);
  let s=tex(src,600,170,{size:76,auto:false})+highlight(600-W/2-30,105,W+60,120,seg(p,.1,.25));
  const R0=600+W/2,w3=texWidth("fg'",76,false),w2=texWidth("f'g+",76,false),w1=texWidth("f'g",76,false);
  s+=fade(seg(p,.3,.45),label('上の帯',R0-w3-w2+w1/2,275,{size:26,color:CT,anchor:'middle'})+label('右の帯',R0-w3/2,275,{size:26,color:CR,anchor:'middle'}));
  s+=card(250,330,700,90,label('増える場所が 二か所 → 足し算',600,387,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'cmp']:(p)=>{
  const th=-.8*smooth(p);
  let s=card(40,40,540,430,
    label('直列につながる',310,95,{size:30,color:C.hi,anchor:'middle',weight:700})
   +gear(170,210,52,8,th,C.t)+gear(310,210,52,8,2*th,CU)+gear(450,210,52,8,12*th,CY)
   +tex(`\\dfrac{d${Y}}{d${T}}=\\dfrac{d${Y}}{d${U}}\\times\\dfrac{d${U}}{d${T}}`,310,350,{size:40,auto:false})
   +label('倍率を 掛ける',310,440,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.2),C.hi);
  const g=seg(p,.4,.6),x0=700,y0=290,w=180,h=120,d=30;
  s+=card(620,40,540,430,
    label('同時に起きる',890,95,{size:30,color:C.hi,anchor:'middle',weight:700})
   +rect(x0,y0-h,w,h,{fill:C.dim,fo:.12,stroke:C.dim,sw:2,rx:2})+rect(x0+w,y0-h,d,h,{fill:CR,fo:.5,stroke:CR,sw:2,rx:2})+rect(x0,y0-h-d,w,d,{fill:CT,fo:.5,stroke:CT,sw:2,rx:2})
   +label('fg',x0+w/2,y0-h/2+12,{size:30,color:C.ink,anchor:'middle'})
   +tex(`(fg)'={\\color{${CT}}f'g}+{\\color{${CR}}fg'}`,890,350,{size:40,auto:false})
   +label('増え方を 足す',890,440,{size:28,color:C.ink,anchor:'middle'}),g,C.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(250,90,700,300,label('確かめ',600,140,{size:26,color:C.dim,anchor:'middle'})
   +tex(`${Y}=t(2t+1)`,600,220,{size:56})
   +label('t ＝ 1 での傾きは？',600,320,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=tex(`${Y}=t(2t+1)`,600,70,{size:46});
  s+=fade(seg(p,.05,.25),tex("f=t,\\ f'=1",370,170,{size:40})+tex("g=2t+1,\\ g'=2",830,170,{size:40}));
  s+=fade(seg(p,.35,.55),label('t ＝ 1：f ＝ 1，g ＝ 3',600,260,{size:28,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),tex(`{\\color{${CT}}f'g}+{\\color{${CR}}fg'}={\\color{${CT}}1\\times3}+{\\color{${CR}}1\\times2}=5`,600,370,{size:50,auto:false}));
  return s;
 },
 [K+'quiz3']:(p)=>{
  let s=tex(`{\\color{${CT}}f'g}+{\\color{${CR}}fg'}={\\color{${CT}}1\\times3}+{\\color{${CR}}1\\times2}=5`,600,90,{size:42,auto:false});
  s+=fade(seg(p,.05,.25),tex(`${Y}=2t^2+t`,600,210,{size:48})+label('展開',860,220,{size:26,color:C.dim}));
  s+=fade(seg(p,.3,.5),tex(`\\dfrac{d${Y}}{d${T}}=4t+1`,600,320,{size:48,auto:false}));
  s+=fade(seg(p,.55,.75),label('t ＝ 1 で 5',600,430,{size:34,color:C.F,anchor:'middle',weight:700})+ok(720,434));
  return s;
 },

 // ===== S5 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=tex(`\\dfrac{${DY}}{${DT}}=\\dfrac{${DY}}{${DU}}\\times\\dfrac{${DU}}{${DT}}`,330,140,{size:40,auto:false})+label('連鎖律',330,60,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=tex(`\\dfrac{\\Delta(fg)}{\\Delta t}=g\\dfrac{\\Delta f}{\\Delta t}+f\\dfrac{\\Delta g}{\\Delta t}+{\\color{${CK}}\\dfrac{\\Delta f}{\\Delta t}\\Delta g}`,870,140,{size:36,auto:false})+label('積の微分',870,60,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.5),label('① 幅のある Δ で 等式を作る',600,290,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),label('② 幅 → 0 の 近づく先',600,370,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next1']:(p)=>{
  // simple hill: contour ellipses on a map
  const cx=380,cy=270;let s='';
  [200,160,120,80,40].forEach((r,i)=>{s+=fade(seg(p,.05+i*.06,.2+i*.06),`<ellipse cx="${cx}" cy="${cy}" rx="${r*1.3}" ry="${r}" fill="none" stroke="${C.F}" stroke-opacity="${.35+i*.13}" stroke-width="3"/>`);});
  s+=dot(cx,cy,8,C.hi)+label('山頂',cx,cy-18,{size:22,color:C.hi,anchor:'middle'});
  s+=fade(seg(p,.4,.55),arrow(700,270,880,270,{color:C.x,w:4})+label('東西 x',790,250,{size:28,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),arrow(1000,360,1000,180,{color:CY,w:4})+label('南北 y',1030,280,{size:28,color:CY}));
  s+=fade(seg(p,.7,.85),label('高さ h は 二つで決まる',880,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(200,90,800,300,label('次の問い',600,140,{size:26,color:C.dim,anchor:'middle'})
   +tex(`h(x,\\,${Y})`,600,220,{size:60})
   +label('変数が二つ：傾きは どう測る？',600,320,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
