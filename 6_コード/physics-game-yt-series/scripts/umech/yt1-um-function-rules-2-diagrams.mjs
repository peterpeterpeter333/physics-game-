// YouTube シリーズ 微分の法則・中級 2/2（ステージ um-function-rules 本3〜本4：偏微分）— 図。Stage 1200×515.
// 色：x（東西）水色、y（南北）緑、高さ h 黄、凍結（鍵）橙、誤り 赤。山 h = x²y の等高線。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';

const K='um-function-rules-2:';
const CX=C.x,CY=C.F,CH=C.hi,CL=C.E;
const Yc=`{\\color{${CY}}y}`,Xc=`{\\color{${CX}}x}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));

// ---- contour map of h = x²y ---------------------------------------------------------------------
const M={x0:90,y0:470,sx:170,sy:118,xmax:2.4,ymax:3.3};
const MX=x=>M.x0+M.sx*x,MY=y=>M.y0-M.sy*y;
function contour(c,{color=C.dim,w=2.5,op=.7}={}){
 const pts=[];const xa=Math.sqrt(c/M.ymax);
 for(let i=0;i<=60;i++){const x=mix(xa,M.xmax,i/60);pts.push([MX(x),MY(c/(x*x))]);}
 return `<g opacity="${op}">${draw(pts,1,{color,w})}</g>`;
}
function map({g=1,hl=0,lab=1,pt=[1,2],ptg=1,levels=[1,2,4,8,12]}={}){
 let s=fade(g,rect(M.x0,MY(M.ymax),M.sx*M.xmax,M.sy*M.ymax,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:4}));
 levels.forEach((c,i)=>{s+=fade(g,contour(c,{color:c===2&&hl?CH:C.dim,w:c===2&&hl?4:2.5,op:c===2&&hl?1:.45+i*.1}));
  const ly=MY(c/(M.xmax*M.xmax));if(lab&&c>=2)s+=fade(g*lab,label(String(c),MX(M.xmax)+8,ly+8,{size:22,color:c===2&&hl?CH:C.dim}));});
 s+=fade(g,arrow(M.x0,M.y0,MX(M.xmax)+40,M.y0,{color:CX,w:3,head:12})+label('東 x',MX(M.xmax)+44,M.y0+8,{size:24,color:CX}));
 s+=fade(g,arrow(M.x0,M.y0,M.x0,MY(M.ymax)-26,{color:CY,w:3,head:12})+label('北 y',M.x0+12,MY(M.ymax)-14,{size:24,color:CY}));
 s+=fade(g,label('1',MX(1),M.y0+28,{size:22,color:CX,anchor:'middle'})+label('2',MX(2),M.y0+28,{size:22,color:CX,anchor:'middle'})
  +label('1',M.x0-12,MY(1)+8,{size:22,color:CY,anchor:'end'})+label('2',M.x0-12,MY(2)+8,{size:22,color:CY,anchor:'end'})+label('3',M.x0-12,MY(3)+8,{size:22,color:CY,anchor:'end'}));
 if(pt)s+=fade(g*ptg,dot(MX(pt[0]),MY(pt[1]),10,CH));
 return s;
}
function eastArrow(pt,g=1,len=.55){return fade(g,arrow(MX(pt[0]),MY(pt[1]),MX(pt[0]+len),MY(pt[1]),{color:CX,w:5,head:16}));}
function northArrow(pt,g=1,len=.55){return fade(g,arrow(MX(pt[0]),MY(pt[1]),MX(pt[0]),MY(pt[1]+len),{color:CY,w:5,head:16}));}
// padlock icon
function lock(x,y,color=CL,g=1,s=1){
 return fade(g,`<path d="M ${x-9*s} ${y-6*s} v ${-8*s} a ${9*s} ${9*s} 0 0 1 ${18*s} 0 v ${8*s}" fill="none" stroke="${color}" stroke-width="${3.5*s}"/>`
  +rect(x-14*s,y-7*s,28*s,22*s,{fill:color,fo:.9,stroke:color,sw:1,rx:4*s}));
}

// ---- cross-section graphs (right side) -------------------------------------------------------------
function eastGraph({g=1,curve=1,tan=0,box=[600,460,320,360]}={}){
 const [gx,gy,gw,gh]=box;
 const A=axes({x:gx,y:gy,w:gw,h:gh,xmax:1.7,ymax:5.5,xlabel:'x',ylabel:'高さ h',xticks:[1],yticks:[2,4],grid:true,g,xcolor:CX,ycolor:CH});
 let s=A.svg+A.plot(x=>2*x*x,{from:0,to:1.65,p:curve,color:CX,w:4});
 if(!box.custom)s+=fade(g,tex('h=2x^2',1065,110,{size:34})+label('（y ＝ 2 の断面）',1065,150,{size:22,color:C.dim,anchor:'middle'}));
 s+=fade(tan,draw([[A.X(.55),A.Y(2-4*.45)],[A.X(1.45),A.Y(2+4*.45)]],1,{color:CH,w:3,dash:'8 6'}))+fade(tan,label('傾き 4',A.X(.08),A.Y(4.6),{size:26,color:CH,weight:700}));
 s+=fade(g,dot(A.X(1),A.Y(2),9,CH));
 return {A,svg:s};
}
function northGraph({g=1,curve=1,tan=0,box=[600,460,320,360]}={}){
 const [gx,gy,gw,gh]=box;
 const A=axes({x:gx,y:gy,w:gw,h:gh,xmax:3.3,ymax:3.6,xlabel:'y',ylabel:'高さ h',xticks:[1,2,3],yticks:[1,2,3],grid:true,g,xcolor:CY,ycolor:CH});
 let s=A.svg+A.plot(y=>y,{from:0,to:3.2,p:curve,color:CY,w:4});
 if(!box.custom)s+=fade(g,tex('h=y',1065,110,{size:34})+label('（x ＝ 1 の断面）',1065,150,{size:22,color:C.dim,anchor:'middle'}));
 s+=fade(tan,label('傾き 1',A.X(2.2),A.Y(1.5),{size:26,color:CH,weight:700}));
 s+=fade(g,dot(A.X(2),A.Y(2),9,CH));
 return {A,svg:s};
}
const P=[1,2];

export const ytUmFunctionRules2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=map({g:seg(p,.05,.3),pt:null,lab:0});
  s+=card(660,110,500,260,label('前回の最後の問い',910,160,{size:24,color:C.dim,anchor:'middle'})
   +tex(`h(x,\\,${Yc})`,910,240,{size:58})
   +label('傾きは どう測る？',910,320,{size:34,color:CH,anchor:'middle',weight:700}),seg(p,.1,.25),CH);
  return s;
 },
 [K+'map']:(p)=>{
  let s=map({g:1,lab:0,pt:null});
  const g1=seg(p,.05,.25),g2=seg(p,.55,.75);
  s+=fade(g1,label('東向き x，北向き y',910,160,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(g2,dot(MX(1),MY(2),10,CH)+line(MX(1),MY(2),MX(1),M.y0,{color:C.faint,w:2,dash:'5 5'})+line(M.x0,MY(2),MX(1),MY(2),{color:C.faint,w:2,dash:'5 5'}));
  s+=fade(g2,label('場所 (x, y) → 高さ h',910,260,{size:32,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'contour']:(p)=>{
  let s=map({lab:1,pt:null});
  s+=fade(seg(p,.05,.2),contour(4,{color:CH,w:4.5,op:1}));
  s+=card(660,110,500,150,label('等高線',910,160,{size:30,color:CH,anchor:'middle',weight:700})+label('同じ高さの点を 結んだ線',910,220,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2));
  s+=fade(seg(p,.55,.75),label('間隔が狭い → 坂が急',910,330,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('数字は その線の高さ',910,390,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=map({pt:P});
  s+=eastArrow(P,seg(p,.1,.3))+northArrow(P,seg(p,.35,.55));
  s+=fade(seg(p,.1,.3),label('東へ',MX(1.6),MY(2)+8,{size:26,color:CX,weight:700}));
  s+=fade(seg(p,.35,.55),label('北へ',MX(1)+14,MY(2.6),{size:26,color:CY,weight:700}));
  s+=card(660,150,500,170,label('同じ場所でも',910,205,{size:28,color:C.ink,anchor:'middle'})+label('歩く向きで 坂の急さが違う',910,265,{size:30,color:CH,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=map({pt:P,hl:1});
  s+=tex(`h=x^2${Yc}`,910,130,{size:60});
  s+=fade(seg(p,.4,.6),label('x ＝ 1，y ＝ 2 の地点',910,240,{size:28,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),tex(`h=1^2\\times2=2`,910,320,{size:48,auto:false}));
  s+=fade(seg(p,.75,.9),label('高さ 2 の等高線の上',910,410,{size:24,color:CH,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=map({pt:P,hl:1})+eastArrow(P)+northArrow(P);
  s+=card(660,130,500,220,label('東と北',910,190,{size:30,color:C.ink,anchor:'middle'})+label('どちらへ歩くほうが 急？',910,255,{size:32,color:CH,anchor:'middle',weight:700})+fade(seg(p,.4,.6),label('予想してみよう',910,315,{size:24,color:CH,anchor:'middle'})),seg(p,.05,.2),CH);
  return s;
 },

 // ===== S2 一方を固定して歩く =====
 [K+'east']:(p)=>{
  let s=map({pt:P,hl:1});
  s+=fade(seg(p,.1,.3),line(M.x0,MY(2),MX(M.xmax),MY(2),{color:CX,w:3,dash:'10 6'}));
  s+=eastArrow(P,seg(p,.1,.3));
  s+=fade(seg(p,.45,.65),lock(MX(.3),MY(2)-26)+label('y ＝ 2 のまま',MX(.15),MY(2)+36,{size:24,color:CL}));
  s+=card(660,150,500,150,label('東へ歩く',910,205,{size:30,color:CX,anchor:'middle',weight:700})+label('y は 動かさない',910,260,{size:28,color:CL,anchor:'middle'}),seg(p,.05,.2));
  return s;
 },
 [K+'esec']:(p)=>{
  let s=map({pt:P,hl:1,g:1})+line(M.x0,MY(2),MX(M.xmax),MY(2),{color:CX,w:3,dash:'10 6'})+lock(MX(.3),MY(2)-26);
  const {svg}=eastGraph({g:seg(p,.1,.3),curve:seg(p,.2,.5)});
  s+=svg;
  return s;
 },
 [K+'enum']:(p)=>{
  let s=map({pt:P,hl:1})+line(M.x0,MY(2),MX(M.xmax),MY(2),{color:CX,w:3,dash:'10 6'})+lock(MX(.3),MY(2)-26);
  const {A,svg}=eastGraph({});s+=svg;
  s+=fade(seg(p,.1,.3),label('x：1 → 1.01',1065,230,{size:26,color:CX,anchor:'middle'}));
  s+=fade(seg(p,.4,.6),label('h：2 → 2.0402',1065,280,{size:26,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('増えた 0.0402',1065,330,{size:26,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eslope']:(p)=>{
  let s=map({pt:P,hl:1})+line(M.x0,MY(2),MX(M.xmax),MY(2),{color:CX,w:3,dash:'10 6'})+lock(MX(.3),MY(2)-26);
  const {svg}=eastGraph({tan:seg(p,.45,.65)});s+=svg;
  s+=tex(`\\dfrac{0.0402}{0.01}=4.02`,1065,250,{size:32,auto:false});
  s+=fade(seg(p,.3,.5),label('幅 → 0 で 4',1065,330,{size:26,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'north']:(p)=>{
  let s=map({pt:P,hl:1});
  s+=fade(seg(p,.05,.25),line(MX(1),M.y0,MX(1),MY(M.ymax),{color:CY,w:3,dash:'10 6'})+lock(MX(1)-40,MY(.6))+label('x ＝ 1 のまま',MX(1)-10,MY(.35),{size:24,color:CL}));
  s+=northArrow(P,seg(p,.1,.3));
  const {svg}=northGraph({g:seg(p,.45,.6),curve:seg(p,.5,.8)});s+=svg;
  return s;
 },
 [K+'nslope']:(p)=>{
  let s=map({pt:P,hl:1})+line(MX(1),M.y0,MX(1),MY(M.ymax),{color:CY,w:3,dash:'10 6'})+lock(MX(1)-40,MY(.6));
  const {svg}=northGraph({tan:seg(p,.6,.8)});s+=svg;
  s+=fade(seg(p,.05,.25),label('y：2 → 2.01',1065,230,{size:26,color:CY,anchor:'middle'}));
  s+=fade(seg(p,.25,.45),label('h：2 → 2.01',1065,280,{size:26,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),tex(`\\dfrac{0.01}{0.01}=1`,1065,360,{size:32,auto:false}));
  return s;
 },
 [K+'cmp']:(p)=>{
  let s=map({pt:P,hl:1})+eastArrow(P)+northArrow(P);
  s+=label('傾き 4',MX(1.6),MY(2)+8,{size:26,color:CX,weight:700})+label('傾き 1',MX(1)+14,MY(2.6),{size:26,color:CY,weight:700});
  s+=card(660,130,500,240,label('x ＝ 1，y ＝ 2 の地点',910,180,{size:26,color:C.dim,anchor:'middle'})
   +label('東向き 4',800,250,{size:34,color:CX,anchor:'middle',weight:700})+label('北向き 1',1020,250,{size:34,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('東へ歩くほうが 4倍 急',910,320,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,.05,.2),CH);
  return s;
 },

 [K+'cross']:(p)=>{
  let s=map({pt:P,hl:1});
  s+=fade(seg(p,.05,.2),contour(4,{color:C.E,w:4,op:1}));
  const ge=seg(p,.1,.35),gn=seg(p,.55,.8);
  s+=fade(ge,arrow(MX(1),MY(2),MX(1.5),MY(2),{color:CX,w:5,head:16})+dot(MX(1.5),MY(2),8,CX));
  s+=fade(gn,arrow(MX(1),MY(2),MX(1),MY(2.5),{color:CY,w:5,head:16})+dot(MX(1),MY(2.5),8,CY));
  s+=card(660,110,500,300,label('0.5 歩いたとき',910,160,{size:26,color:C.dim,anchor:'middle'})
   +fade(ge,label('東：高さ 4.5',910,225,{size:32,color:CX,anchor:'middle',weight:700})+label('高さ 4 の線を 越える',910,265,{size:24,color:C.E,anchor:'middle'}))
   +fade(gn,label('北：高さ 2.5',910,335,{size:32,color:CY,anchor:'middle',weight:700})+label('まだ 越えない',910,375,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },

 // ===== S3 ∂ =====
 [K+'def']:(p)=>{
  let s=card(200,60,800,160,label('偏微分',600,120,{size:40,color:CH,anchor:'middle',weight:700})+label('一つの変数だけ 動かし，ほかは 固定して測る傾き',600,185,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.2),CH);
  s+=fade(seg(p,.3,.5),label('東へ：y を固定',380,320,{size:30,color:CX,anchor:'middle',weight:700})+lock(380,380,CL));
  s+=fade(seg(p,.45,.65),label('北へ：x を固定',820,320,{size:30,color:CY,anchor:'middle',weight:700})+lock(820,380,CL));
  return s;
 },
 [K+'defsec']:(p)=>{
  const e=eastGraph({box:Object.assign([90,480,380,290],{custom:1}),tan:1}),n=northGraph({box:Object.assign([690,480,380,290],{custom:1}),tan:1});
  let s=fade(seg(p,0,.2),label('偏微分 ＝ 断面の傾き',600,50,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.4),e.svg+label('y を固定 → 東向き',300,130,{size:26,color:CX,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),n.svg+label('x を固定 → 北向き',900,130,{size:26,color:CY,anchor:'middle'}));
  return s;
 },
 [K+'sym']:(p)=>{
  let s=tex('\\dfrac{\\partial h}{\\partial x}',380,210,{size:84});
  s+=fade(seg(p,.05,.25),label('東向きの傾き',380,340,{size:28,color:CX,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),tex('\\partial',780,190,{size:90})+label('ラウンド・ディー',780,290,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),lock(780,360,CL,1,1.2)+label('ほかの変数は 凍結中',780,440,{size:30,color:CL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'freeze']:(p)=>{
  const src=`h=${Xc}^2\\,${Yc}`,W=texWidth(src,76,false),wy=texWidth(Yc,76,false);
  let s=tex(src,600,200,{size:76,auto:false});
  const yx=600+W/2-wy/2;
  s+=fade(seg(p,.2,.4),lock(yx+4,108,CL,1,1.1));
  s+=fade(seg(p,.2,.4),highlight(yx-30,140,wy+60,90,1,CL));
  s+=fade(seg(p,.55,.75),label('y は ただの数として 扱う',600,340,{size:32,color:CL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('x で偏微分するとき',600,400,{size:26,color:CX,anchor:'middle'}));
  return s;
 },
 [K+'const']:(p)=>{
  let s=label('たとえば y ＝ 3 なら',600,60,{size:28,color:CL,anchor:'middle'});
  s+=tex('h=3x^2',600,150,{size:56});
  s+=fade(seg(p,.3,.5),tex('3\\times2x=6x',600,270,{size:56})+label('傾き',380,280,{size:26,color:CH}));
  s+=fade(seg(p,.6,.8),label('掛かっている数 3 は そのまま残る',600,390,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=tex(`h=x^2\\,${Yc}`,300,110,{size:52,auto:true})+lock(300+texWidth(`h=x^2\\,${Yc}`,52)/2-12,50,CL,1,.9);
  s+=fade(seg(p,.1,.3),label('x² を微分 → 2x',720,110,{size:30,color:CX,weight:700}));
  s+=fade(seg(p,.35,.55),label('凍結した y は そのまま',720,170,{size:28,color:CL}));
  s+=fade(seg(p,.6,.8),tex(`\\dfrac{\\partial h}{\\partial x}=2x${Yc}`,600,320,{size:70})+highlight(600-texWidth(`\\dfrac{\\partial h}{\\partial x}=2x${Yc}`,70)/2-24,250,texWidth(`\\dfrac{\\partial h}{\\partial x}=2x${Yc}`,70)+48,140,seg(p,.8,.95)));
  return s;
 },
 [K+'check']:(p)=>{
  let s=tex(`\\dfrac{\\partial h}{\\partial x}=2x${Yc}`,600,110,{size:56});
  s+=fade(seg(p,.05,.25),label('x ＝ 1，y ＝ 2',600,210,{size:28,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),tex('2\\times1\\times2=4',600,290,{size:52,auto:false}));
  s+=fade(seg(p,.55,.75),label('数値：4.02 → 4',600,400,{size:32,color:C.F,anchor:'middle',weight:700})+ok(760,404));
  return s;
 },
 [K+'yfreeze']:(p)=>{
  const src=`h=${Xc}^2\\,${Yc}`,W=texWidth(src,76,false),wx=texWidth('x^2',76,false),we=texWidth('h=',76,false);
  let s=tex(src,600,200,{size:76,auto:false});
  const xc=600-W/2+we+wx/2;
  s+=fade(seg(p,.1,.3),lock(xc+6,100,CL,1,1.1)+highlight(xc-wx/2+2,140,wx+16,90,1,CL));
  s+=fade(seg(p,.5,.7),label('x² は ただの数',600,330,{size:32,color:CL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('h は y の x² 倍',600,400,{size:30,color:CY,anchor:'middle'}));
  return s;
 },
 [K+'ycalc']:(p)=>{
  let s=label('y の傾きは 1',600,70,{size:28,color:CY,anchor:'middle'});
  s+=fade(seg(p,.05,.3),tex(`\\dfrac{\\partial h}{\\partial ${Yc}}=x^2`,600,190,{size:70}));
  s+=fade(seg(p,.45,.6),label('x ＝ 1，y ＝ 2',600,300,{size:28,color:CH,anchor:'middle'})+tex('1^2=1',600,370,{size:48,auto:false}));
  s+=fade(seg(p,.7,.85),label('数値の 1 と一致',600,450,{size:30,color:C.F,anchor:'middle',weight:700})+ok(730,454));
  return s;
 },
 [K+'contrast']:(p)=>{
  let s=tex(`h=x^2\\,${Yc}`,600,70,{size:48});
  s+=card(80,140,480,260,label('y を凍結',320,190,{size:28,color:CL,anchor:'middle'})+tex(`\\dfrac{\\partial h}{\\partial x}=2x${Yc}`,320,290,{size:56})+label('東向き',320,375,{size:26,color:CX,anchor:'middle'}),seg(p,.05,.2));
  s+=card(640,140,480,260,label('x を凍結',880,190,{size:28,color:CL,anchor:'middle'})+tex(`\\dfrac{\\partial h}{\\partial ${Yc}}=x^2`,880,290,{size:56})+label('北向き',880,375,{size:26,color:CY,anchor:'middle'}),seg(p,.35,.5));
  s+=fade(seg(p,.7,.85),label('何を凍結したかで 答えが違う',600,470,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'error']:(p)=>{
  let s=fade(seg(p,.05,.2),ng(250,140)+tex('\\dfrac{\\partial h}{\\partial x}=x^2',470,130,{size:52})+label('動かす変数の 取り違え',870,140,{size:28,color:C.a}));
  s+=fade(seg(p,.55,.7),ok(250,330)+tex(`x^2=\\dfrac{\\partial h}{\\partial ${Yc}}`,470,320,{size:52})+label('北向きの傾き',870,330,{size:28,color:CY}));
  return s;
 },

 // ===== S4 別の地点で確かめる =====
 [K+'quiz']:(p)=>{
  const Q=[2,3];
  let s=map({pt:Q,levels:[1,2,4,8,12]});
  s+=fade(seg(p,.2,.4),eastArrow(Q,1,.3)+northArrow(Q,1,.25));
  s+=card(660,110,500,260,label('確かめ',910,160,{size:24,color:C.dim,anchor:'middle'})+tex(`h=x^2${Yc}`,910,225,{size:44})
   +label('x ＝ 2，y ＝ 3 の地点',910,290,{size:28,color:CH,anchor:'middle'})+label('東向き・北向きの傾きは？',910,345,{size:30,color:CH,anchor:'middle',weight:700}),seg(p,.05,.2),CH);
  return s;
 },
 [K+'ans1']:(p)=>{
  let s=label('y ＝ 3 で凍結',600,60,{size:28,color:CL,anchor:'middle'})+lock(470,52,CL,1,.9);
  s+=tex('h=3x^2',600,150,{size:52});
  s+=fade(seg(p,.25,.45),tex('\\dfrac{\\partial h}{\\partial x}=6x',600,270,{size:56}));
  s+=fade(seg(p,.65,.8),label('x ＝ 2 で',470,400,{size:30,color:CX,anchor:'middle'})+label('12',640,404,{size:48,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ans1b']:(p)=>{
  let s=tex(`\\dfrac{\\partial h}{\\partial x}=2x${Yc}`,600,120,{size:56});
  s+=fade(seg(p,.1,.35),tex('2\\times2\\times3=12',600,260,{size:52,auto:false}));
  s+=fade(seg(p,.55,.75),label('6x と 同じ 12',600,370,{size:30,color:C.F,anchor:'middle',weight:700})+ok(730,374));
  return s;
 },
 [K+'qnum']:(p)=>{
  let s=label('数値で確かめる（y ＝ 3 のまま）',600,60,{size:26,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),label('x：2 → 2.01',400,150,{size:32,color:CX,anchor:'middle'}));
  s+=fade(seg(p,.2,.45),label('h：12 → 12.1203',800,150,{size:32,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),tex(`\\dfrac{0.1203}{0.01}=12.03`,600,290,{size:52,auto:false}));
  s+=fade(seg(p,.8,.92),label('→ 12',600,400,{size:34,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=label('x ＝ 2 で凍結',600,60,{size:28,color:CL,anchor:'middle'})+lock(470,52,CL,1,.9);
  s+=tex(`h=2^2\\,${Yc}=4${Yc}`,600,160,{size:52});
  s+=fade(seg(p,.4,.6),tex(`\\dfrac{\\partial h}{\\partial ${Yc}}=4`,600,300,{size:56})+label('＝ x²（x ＝ 2）',860,310,{size:26,color:C.dim}));
  return s;
 },
 [K+'qmap']:(p)=>{
  const Q=[2,3];
  let s=map({pt:Q})+eastArrow(Q,1,.3)+northArrow(Q,1,.25);
  s+=label('傾き 12',MX(2)+6,MY(3)+42,{size:24,color:CX,weight:700})+label('傾き 4',MX(2)-14,MY(3.25)+8,{size:24,color:CY,weight:700,anchor:'end'});
  s+=card(660,130,500,240,label('x ＝ 2，y ＝ 3 の地点',910,180,{size:26,color:C.dim,anchor:'middle'})
   +label('東向き 12',800,250,{size:34,color:CX,anchor:'middle',weight:700})+label('北向き 4',1020,250,{size:34,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('東へ歩くほうが 3倍 急',910,320,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,.05,.2),CH);
  return s;
 },

 // ===== S5 物理での再会と次の問い =====
 [K+'phys']:(p)=>{
  let s=map({pt:null,lab:0,g:seg(p,0,.2)});
  s+=card(660,130,500,240,label('場所で決まる量',910,185,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('電位',910,255,{size:32,color:CH,anchor:'middle'})+label('位置エネルギー',910,315,{size:32,color:C.E,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'phys2']:(p)=>{
  let s=map({pt:P,lab:0})+eastArrow(P,seg(p,.1,.3))+northArrow(P,seg(p,.1,.3));
  s+=card(660,130,500,240,label('電位の 坂の傾き',910,190,{size:30,color:CH,anchor:'middle',weight:700})
   +label('→ 電場',910,250,{size:32,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('偏微分に 再会（電位・中級）',910,320,{size:26,color:C.dim,anchor:'middle'})),seg(p,.1,.25),CH);
  return s;
 },
 [K+'sum1']:(p)=>{
  let s=card(150,70,900,170,label('偏微分',600,130,{size:38,color:CH,anchor:'middle',weight:700})
   +label('一つだけ動かし，ほかは 凍結して 測る傾き',600,195,{size:30,color:C.ink,anchor:'middle'}),seg(p,0,.2),CH);
  s+=fade(seg(p,.4,.6),tex(`\\dfrac{\\partial h}{\\partial x}=2x${Yc}`,380,370,{size:52})+tex(`\\dfrac{\\partial h}{\\partial ${Yc}}=x^2`,820,370,{size:52}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=tex('\\partial',400,210,{size:100})+lock(400,330,CL,1,1.2)+label('凍結中の印',400,420,{size:30,color:CL,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.6),label('計算は ふつうの微分と同じ',800,260,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bridge']:(p)=>{
  let s=map({pt:P,hl:1})+line(M.x0,MY(2),MX(M.xmax),MY(2),{color:CX,w:3,dash:'10 6'});
  const {svg}=eastGraph({tan:1});s+=svg;
  s+=fade(seg(p,.4,.6),label('東へ 0.01',1065,230,{size:26,color:CX,anchor:'middle'}));
  s+=fade(seg(p,.55,.8),tex('2+4\\times0.01',1065,290,{size:30,auto:false})+tex('\\approx2.04',1065,345,{size:30,auto:false})+label('傾きからの 予想',1065,400,{size:24,color:CH,anchor:'middle'}));
  return s;
 },
 [K+'bridge2']:(p)=>{
  let s=label('東へ 0.01 進んだ 高さ',600,60,{size:26,color:C.dim,anchor:'middle'});
  s+=label('予想（傾き 4 の直線）',420,160,{size:30,color:CH,anchor:'middle'})+tex('2.04',420,230,{size:52,auto:false});
  s+=fade(seg(p,.15,.35),label('実際（曲線 2x²）',820,160,{size:30,color:CX,anchor:'middle'})+tex('2.0402',820,230,{size:52,auto:false}));
  s+=fade(seg(p,.55,.75),label('ずれ 0.0002',600,360,{size:36,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bend']:(p)=>{
  // zoom on the east cross-section: curve bends away from the tangent
  const A=axes({x:120,y:460,w:520,h:380,xmin:.9,xmax:1.25,ymin:1.5,ymax:3.2,xlabel:'x',ylabel:'高さ h',xticks:[1,1.2],yticks:[2,3],grid:true,xcolor:CX,ycolor:CH});
  let s=A.svg+A.plot(x=>2*x*x,{from:.9,to:1.23,color:CX,w:4})+draw([[A.X(.9),A.Y(2-.4)],[A.X(1.25),A.Y(2+1)]],1,{color:CH,w:3,dash:'8 6'});
  s+=dot(A.X(1),A.Y(2),8,CH);
  const x2=1.2;s+=fade(seg(p,.2,.4),line(A.X(x2),A.Y(2+4*.2),A.X(x2),A.Y(2*x2*x2),{color:C.a,w:5})+label('曲がった分',A.X(x2)+12,A.Y(2.55),{size:22,color:C.a})+label('Δx ＝ 0.2 で 0.08',A.X(x2)+12,A.Y(2.55)+28,{size:22,color:C.a}));
  s+=fade(seg(p,.05,.2),label('x ＝ 1 の近くを 拡大',200,112,{size:22,color:C.dim}));
  s+=fade(seg(p,.45,.65),tex('2(1+\\Delta x)^2=2+4\\Delta x+2(\\Delta x)^2',930,160,{size:32}));
  s+=fade(seg(p,.6,.8),tex('2\\times0.01^2=0.0002',930,270,{size:40,auto:false})+label('Δx ＝ 0.01 の 曲がった分',930,330,{size:24,color:C.a,anchor:'middle'}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(200,90,800,300,label('次の問い',600,140,{size:26,color:C.dim,anchor:'middle'})
   +label('曲線を 直線や 2次式で 置き換えると',600,220,{size:32,color:C.ink,anchor:'middle'})
   +label('どこまで 正確に 予想できる？',600,300,{size:38,color:CH,anchor:'middle',weight:700}),seg(p,.05,.2),CH);
  return s;
 },
};
