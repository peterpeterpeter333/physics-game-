// YouTube シリーズ 仕事・中級 1/3（ステージ um-work-energy 本0〜本5）— 図。Stage 1200×515.
// 色：力 F 緑、位置 x・dx 水色、速度 v・dv 紫、時刻 t・dt 金、仕事・エネルギー 橙、強調 黄、誤り 赤。
// 道筋の地図：左端 F＝ma（出発点）→ 3つの手 → 右端「速さ ⇄ 位置」（ゴール）。
// 数値：2 kg・4 N・静止から → a＝2、v＝2t、x＝t²；1 m で t＝1 s、v＝2 m/s。dt＝dx/v：0.02÷2＝0.01 s；0.1÷5＝0.02 s。
//   a＝dv/(dx/v)：dv＝2×0.01＝0.02 → 0.02÷(0.02÷2)＝2。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,ground,block,poly,spring,wall,draw} from './anim.mjs';

const K='um-work-energy-1:';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
// 分数の分母を囲む：f 全体を x 中央・y に置いたとき、末尾の分数 frac の分母 part の位置。
const denBox=(x,y,z,f,frac,part,g,color)=>{const cx=x+texWidth(f,z)/2-texWidth(frac,z)/2,bw=texWidth(part,z)+30;return highlight(cx-bw/2,y+.25*z-.55*z,bw,1.1*z,g,color);};
const denC=(x,z,f,frac)=>x+texWidth(f,z)/2-texWidth(frac,z)/2;
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));

// ---- 道筋の地図 ----
const STEPS=['a=\\dfrac{dv}{dt}','dt=\\dfrac{dx}{v}','a=\\dfrac{dv}{dx/v}'];
function roadmap(p,{done=0,y=250,here=-1,g=1,fill=[1,1,1]}={}){
 let s='';
 const xs=[150,390,600,810,1050];
 s+=fade(g,line(xs[0]+90,y,xs[4]-110,y,{color:C.faint,w:4,dash:'10 10'}));
 s+=card(xs[0]-100,y-60,200,120,tex('F=ma',xs[0],y+12,{size:44})+label('出発点',xs[0],y+95,{size:24,color:C.dim,anchor:'middle'}),g,C.F);
 s+=card(xs[4]-120,y-60,240,120,label('速さ ⇄ 位置',xs[4],y+10,{size:30,color:C.hi,anchor:'middle',weight:700})+label('ゴール',xs[4],y+95,{size:24,color:C.dim,anchor:'middle'}),g,C.hi);
 for(let i=0;i<3;i++){
  const x=xs[i+1],on=i<done;
  s+=fade(g,rect(x-95,y-55,190,110,{fill:'#131f38',fo:.96,stroke:on?C.ink:C.faint,sw:2,rx:12}));
  s+=fade(g*(on?fill[i]:1),on?tex(STEPS[i],x,y+12,{size:34}):label('？',x,y+12,{size:34,color:C.faint,anchor:'middle',weight:700}));
  s+=fade(g,label(`${['一','二','三'][i]}手目`,x,y-72,{size:24,color:on?C.ink:C.dim,anchor:'middle'}));
 }
 if(here>=0)s+=fade(g,arrow(xs[here],y+150,xs[here],y+80,{color:C.hi,w:5,head:16})+label('いま ここ',xs[here],y+180,{size:24,color:C.hi,anchor:'middle',weight:700}));
 return s;
}

// ---- 飛行機（簡単な形） ----
function plane(x,y,sc=1){
 const P=pts=>pts.map(([a,b])=>[x+a*sc,y+b*sc]);
 return poly(P([[-70,-8],[50,-10],[70,0],[50,10],[-70,8]]),{fill:'#c9d6ec',fo:.9,stroke:C.dim,sw:2})
  +poly(P([[-10,0],[-40,40],[-20,40],[15,0]]),{fill:'#9fb1cf',fo:.9})+poly(P([[-60,-6],[-75,-32],[-62,-32],[-45,-6]]),{fill:'#9fb1cf',fo:.9});
}
// ---- 箱 ----
const box=(x,y,txt='2 kg')=>rect(x-50,y-80,100,80,{fill:C.x,fo:.22,stroke:C.dim,sw:2,rx:8})+label(txt,x,y-30,{size:26,color:C.ink,anchor:'middle'});

export const ytUmWorkEnergy1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const G=axes({x:90,y:450,w:520,h:340,xmin:0,xmax:2.2,ymin:0,ymax:6,xlabel:'t [s]',ylabel:'v [m/s]',xticks:[.5,1,1.5,2],yticks:[5],xcolor:C.t,ycolor:C.v});
  let s=G.svg+fade(seg(p,.05,.2),line(G.X(0),G.Y(5),G.X(2.2),G.Y(5),{color:C.hi,w:3,dash:'10 7'})+label('v∞ ＝ 5',G.X(2.2),G.Y(5)-14,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=G.plot(t=>5*(1-Math.exp(-t/.5)),{from:0,to:2.1,p:seg(p,.1,.5),color:C.v,w:5});
  s+=card(690,110,470,250,label('前回：時刻 t の 式',925,170,{size:28,color:C.dim,anchor:'middle'})+tex('v=v_\\infty\\bigl(1-e^{-t/\\tau}\\bigr)',925,260,{size:46}),seg(p,.3,.45));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=card(130,50,940,410,label('前回の 最後の問い',600,100,{size:24,color:C.dim,anchor:'middle'})
   +label('時刻 t を 追う 代わりに',600,175,{size:32,color:C.t,anchor:'middle'})
   +fade(seg(p,.3,.45),label('どこまで 動いたら',600,260,{size:36,color:C.x,anchor:'middle',weight:700})+label('速さは いくつ？',600,320,{size:36,color:C.v,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('→ 直接 つなぐ 式は？',600,405,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'runway']:(p)=>{
  const u=seg(p,.1,.9),x0=140,x1=980,px=mix(x0,x1,u*u);
  let s=line(60,380,1140,380,{color:C.dim,w:4})+line(60,380,1140,380,{color:C.faint,w:2,dash:'30 30'});
  s+=plane(px,350,1.1);
  s+=fade(seg(p,.2,.35),brace(x0,x1,420,{color:C.x})+label('何 m 走る？',(x0+x1)/2,480,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('離陸できる 速さ',x1,200,{size:28,color:C.v,anchor:'middle',weight:700})+arrow(x1-40,250,x1+80,250,{color:C.v,w:6,head:16}));
  s+=fade(seg(p,.05,.2),dot(x0,380,9,C.x)+label('出発',x0,110,{size:24,color:C.dim,anchor:'middle'})+line(x0,130,x0,370,{color:C.faint,w:2,dash:'6 6'}));
  return s;
 },
 [K+'runway2']:(p)=>{
  let s=card(90,90,470,300,label('何秒 かかる？',325,180,{size:34,color:C.t,anchor:'middle',weight:700})+label('（時刻 t）',325,240,{size:26,color:C.dim,anchor:'middle'})+label('知りたいのは これ より…',325,320,{size:24,color:C.dim,anchor:'middle'}),1,C.faint);
  s+=card(640,90,470,300,label('どこまで 走ったら',875,170,{size:32,color:C.x,anchor:'middle',weight:700})+label('（位置 x）',875,220,{size:26,color:C.dim,anchor:'middle'})+label('↓',875,265,{size:30,color:C.ink,anchor:'middle'})+label('その 速さ v に なる？',875,320,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.25,.4),C.hi);
  s+=fade(seg(p,.55,.7),label('位置 ⇄ 速さ を 直接 つなぐ 式',600,460,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'promise']:(p)=>{
  let s=card(90,50,1020,190,label('初級（仕事 2/2）で 紹介',600,100,{size:24,color:C.dim,anchor:'middle'})+label('仕事の 分だけ、運動エネルギーが 増える',600,165,{size:34,color:C.E,anchor:'middle',weight:700})+tex(`K=\\tfrac12mv^2`,600,220,{size:34,color:C.E}),1);
  s+=card(190,285,820,170,label('その 理由 と ½mv² の 形 は',600,345,{size:30,color:C.ink,anchor:'middle'})+label('中級で 導く（約束）',600,410,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'promise2']:(p)=>{
  const bx=(x,n,t1,t2,c,g)=>card(x-165,150,330,200,label(n,x,200,{size:24,color:C.dim,anchor:'middle'})+label(t1,x,260,{size:28,color:c,anchor:'middle',weight:700})+label(t2,x,310,{size:28,color:c,anchor:'middle',weight:700}),g,c);
  let s=label('この 3本',600,80,{size:30,color:C.dim,anchor:'middle'});
  s+=bx(215,'1/3','F＝ma から','時刻を 消す 準備',C.F,seg(p,.05,.2));
  s+=arrow(385,250,425,250,{color:C.dim,w:4,head:14,g:seg(p,.2,.3)});
  s+=bx(600,'2/3','位置と 速さ の','関係',C.v,seg(p,.25,.4));
  s+=arrow(770,250,810,250,{color:C.dim,w:4,head:14,g:seg(p,.4,.5)});
  s+=bx(985,'3/3','仕事 と','エネルギー',C.E,seg(p,.45,.6));
  s+=fade(seg(p,.65,.8),label('½ の 出どころ も',985,410,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(90,120,420,240,tex('F=ma',300,230,{size:70})+label('時刻が 主役',300,320,{size:28,color:C.t,anchor:'middle',weight:700}),1,C.F);
  s+=arrow(530,240,690,240,{color:C.hi,w:6,head:18,g:seg(p,.2,.4)})+fade(seg(p,.3,.45),label('どう 取り出す？',610,200,{size:24,color:C.hi,anchor:'middle'}));
  s+=card(700,120,420,240,label('位置 x',910,210,{size:36,color:C.x,anchor:'middle',weight:700})+label('⇄',910,260,{size:34,color:C.ink,anchor:'middle'})+label('速さ v',910,315,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  return s;
 },

 // ===== S2 前提と出発点 =====
 [K+'prem1']:(p)=>premGrid(p,2),
 [K+'prem2']:(p)=>premGrid(p,4),
 [K+'rocket']:(p)=>{
  let s=premGrid(1,4,{dim:true,hl:0});
  const y=mix(360,300,seg(p,.1,.9));
  const R=`<g transform="translate(900 ${y})">`+poly([[0,-120],[28,-70],[28,40],[-28,40],[-28,-70]],{fill:'#c9d6ec',fo:.9,stroke:C.dim,sw:2})+poly([[-28,20],[-50,55],[-28,40]],{fill:'#9fb1cf',fo:.9})+poly([[28,20],[50,55],[28,40]],{fill:'#9fb1cf',fo:.9})
   +poly([[-18,42],[0,110+20*Math.sin(p*40)],[18,42]],{fill:C.E,fo:.8})+'</g>';
  s+=fade(seg(p,.05,.2),rect(740,40,320,450,{fill:C.bg,fo:.9,stroke:C.a,sw:2,rx:14})+R);
  s+=fade(seg(p,.35,.5),label('質量 m が 減る',900,95,{size:28,color:C.a,anchor:'middle',weight:700})+label('→ ① の 外',900,470,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'Fnet']:(p)=>{
  let s=ground(120,1080,330);
  s+=box(600,330,'箱');
  s+=fade(seg(p,.1,.25),arrow(650,290,850,290,{color:C.F,w:6,head:18})+label('押す力',860,298,{size:26,color:C.F}));
  s+=fade(seg(p,.25,.4),arrow(550,320,450,320,{color:C.F,w:6,head:18})+label('摩擦',440,300,{size:26,color:C.F,anchor:'end'}));
  s+=card(320,370,560,120,label('合力 F ＝ はたらく 力 すべての 和',600,420,{size:28,color:C.F,anchor:'middle',weight:700})+label('（向きを 考えて 足す）',600,462,{size:24,color:C.dim,anchor:'middle'}),seg(p,.5,.65),C.F);
  s+=fade(seg(p,.55,.7),arrow(600,160,700,160,{color:C.F,w:8,head:20})+label('F',712,168,{size:34,color:C.F,weight:700})+label('合力',560,168,{size:26,color:C.F,anchor:'end'}));
  return s;
 },
 [K+'quiz1']:(p)=>{
  let s=card(200,100,800,300,label('問題',600,160,{size:26,color:C.dim,anchor:'middle'})+label('「力の 大きさが 一定」は',600,240,{size:36,color:C.F,anchor:'middle',weight:700})+label('前提に 入っている？',600,315,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ans1']:(p)=>{
  let s=label('入っていない',300,80,{size:40,color:C.hi,anchor:'middle',weight:700});
  const xb=mix(420,500,.5+.5*Math.sin(p*9));
  s+=wall(90,170,330)+spring(90,xb-45,280,{coils:8,amp:14})+rect(xb-45,230,90,100,{fill:C.x,fo:.22,stroke:C.dim,sw:2,rx:8})+ground(80,600,330);
  s+=fade(seg(p,.1,.25),arrow(xb-50,210,xb-50-(xb-420+40)*1.2,210,{color:C.F,w:5,head:14})+label('ばねの 力',300,190,{size:24,color:C.F,anchor:'middle'}));
  const G=axes({x:720,y:430,w:380,h:280,xmin:0,xmax:1,ymin:0,ymax:1,xlabel:'x',ylabel:'力の 大きさ',xcolor:C.x,ycolor:C.F,g:seg(p,.3,.45)});
  s+=G.svg+G.plot(u=>.9*u,{from:0,to:1,p:seg(p,.4,.6),color:C.F,w:4});
  s+=fade(seg(p,.6,.75),label('位置で 変わる 力 も OK',600,490,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'start']:(p)=>{
  let s=card(300,60,600,260,tex('F=ma',600,200,{size:96})+label('運動方程式',600,110,{size:26,color:C.dim,anchor:'middle'}),1,C.F);
  s+=fade(seg(p,.2,.35),label('出発点は これ 1本 だけ',600,380,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('新しい 法則は 足さない → 式を 書き換える だけ',600,450,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'map']:(p)=>roadmap(p,{done:0,g:1})+fade(seg(p,.4,.6),label('一手ずつ 埋める',600,470,{size:30,color:C.dim,anchor:'middle'})),

 // ===== S3 時刻が主役の式 =====
 [K+'adef']:(p)=>{
  let s=tex('a=\\dfrac{dv}{dt}',420,200,{size:90});
  s+=fade(seg(p,.35,.5),arrow(560,130,700,110,{color:C.v,w:3,head:12})+label('dv：速度の 変化',715,118,{size:30,color:C.v,weight:700}));
  s+=fade(seg(p,.5,.65),arrow(560,270,700,290,{color:C.t,w:3,head:12})+label('dt：短い 時間',715,300,{size:30,color:C.t,weight:700}));
  s+=fade(seg(p,.7,.85),label('加速度の 定義',420,440,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'Fmdv']:(p)=>{
  const f='F=ma',z=64,w=texWidth(f,z);
  let s=tex(f,600,110,{size:z})+highlight(600+w/2-texWidth('a',z)-14,50,texWidth('a',z)+28,85,seg(p,.05,.2),C.a);
  s+=fade(seg(p,.2,.35),label('a に 代入',860,120,{size:26,color:C.dim}));
  s+=fade(seg(p,.35,.55),arrow(600,160,600,215,{color:C.dim,w:4,head:14})+tex('F=m\\dfrac{dv}{dt}',600,320,{size:80}));
  s+=fade(seg(p,.6,.75),label('一手目',300,320,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tmain']:(p)=>{
  const f='F=m\\dfrac{dv}{dt}',z=80,w=texWidth(f,z);
  let s=tex(f,420,190,{size:z});
  s+=denBox(420,190,z,f,'\\dfrac{dv}{dt}','dt',seg(p,.4,.55),C.t);
  s+=card(740,80,420,260,label('時間が 少し 進むと',950,150,{size:28,color:C.t,anchor:'middle'})+label('速度が どれだけ',950,205,{size:28,color:C.v,anchor:'middle'})+label('変わるか',950,260,{size:28,color:C.v,anchor:'middle'}),seg(p,.1,.25));
  s+=fade(seg(p,.6,.75),label('分母に dt → 時刻が 主役',600,440,{size:32,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex1']:(p)=>{
  const u=seg(p,.3,.95),bx=mix(250,420,u*u);
  let s=ground(100,1100,330)+box(bx,330);
  s+=fade(seg(p,.15,.3),arrow(bx+55,290,bx+205,290,{color:C.F,w:6,head:18})+label('4 N（一定）',bx+215,298,{size:26,color:C.F}));
  s+=fade(seg(p,.05,.2),label('静止から',250,420,{size:26,color:C.v,anchor:'middle',weight:700})+dot(250,340,7,C.v));
  s+=card(740,50,420,130,label('つるつるの 床',950,105,{size:24,color:C.dim,anchor:'middle'})+label('m ＝ 2 kg、F ＝ 4 N',950,150,{size:28,color:C.ink,anchor:'middle'}),seg(p,.2,.35));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=tex('a=\\dfrac{4}{2}=2\\ \\mathrm{m/s^2}',600,90,{size:50});
  s+=fade(seg(p,.35,.5),tex('v=2t',380,260,{size:60}));
  s+=fade(seg(p,.5,.65),tex('x=t^2',820,260,{size:60}));
  s+=fade(seg(p,.6,.75),label('（運動方程式・中級 3/3 と 同じ 形）',600,400,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=tex('v=2t,\\qquad x=t^2',600,80,{size:40});
  s+=card(250,150,700,240,label('1 m 進んだ ときの',600,240,{size:34,color:C.x,anchor:'middle',weight:700})+label('速さ v は？',600,315,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ex4']:(p)=>{
  const n=[[380,'x=1'],[600,'t=1\\ \\mathrm{s}'],[820,'v=2\\ \\mathrm{m/s}']];
  let s=tex('t^2=1',380,110,{size:44});
  s+=fade(seg(p,.05,.2),rect(260,190,240,100,{fill:'#131f38',fo:1,stroke:C.x,sw:3,rx:12})+tex(n[0][1],380,255,{size:44}));
  s+=arrow(510,240,560,240,{color:C.dim,w:4,head:14,g:seg(p,.15,.3)});
  s+=fade(seg(p,.2,.35),rect(485,190,230,100,{fill:'#131f38',fo:1,stroke:C.t,sw:3,rx:12})+tex(n[1][1],600,255,{size:44}));
  s+=arrow(725,240,775,240,{color:C.dim,w:4,head:14,g:seg(p,.45,.6)});
  s+=fade(seg(p,.5,.65),rect(700,190,240,100,{fill:'#131f38',fo:1,stroke:C.v,sw:3,rx:12})+tex(n[2][1],820,255,{size:40})+tex('v=2\\times1',820,110,{size:44}));
  s+=ok(955,262,seg(p,.7,.85));
  return s;
 },
 [K+'detour']:(p)=>{
  const nd=(x,y,t,c,g=1)=>fade(g,rect(x-90,y-45,180,90,{fill:'#131f38',fo:1,stroke:c,sw:3,rx:12})+label(t,x,y+12,{size:32,color:c,anchor:'middle',weight:700}));
  let s=nd(200,300,'位置 x',C.x)+nd(1000,300,'速さ v',C.v)+nd(600,120,'時刻 t',C.t);
  s+=arrow(270,250,510,150,{color:C.t,w:4,head:14,g:seg(p,.05,.2)})+arrow(690,150,930,250,{color:C.t,w:4,head:14,g:seg(p,.15,.3)});
  s+=fade(seg(p,.2,.35),label('回り道',600,215,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),spring(300,480,440,{coils:7,amp:12})+rect(480,405,70,70,{fill:C.x,fo:.22,stroke:C.dim,sw:2,rx:6})+label('力が 位置で 変わると、t の 式が 難しい',600,500,{size:26,color:C.a,anchor:'middle'}));
  return s;
 },
 [K+'want']:(p)=>{
  const nd=(x,y,t,c,g=1)=>fade(g,rect(x-90,y-45,180,90,{fill:'#131f38',fo:1,stroke:c,sw:3,rx:12})+label(t,x,y+12,{size:32,color:c,anchor:'middle',weight:700}));
  let s=nd(200,300,'位置 x',C.x)+nd(1000,300,'速さ v',C.v)+fade(.35,nd(600,120,'時刻 t',C.t));
  s+=arrow(300,300,900,300,{color:C.hi,w:6,head:18,g:seg(p,.05,.3)})+fade(seg(p,.2,.35),label('t を 通らない 道',600,270,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(330,380,540,100,label('そのために、式から dt を 追い出す',600,440,{size:28,color:C.t,anchor:'middle',weight:700}),seg(p,.5,.65),C.t);
  return s;
 },

 // ===== S4 dt を位置の言葉に =====
 [K+'vdef']:(p)=>{
  let s=tex('v=\\dfrac{dx}{dt}',380,180,{size:86});
  s+=fade(seg(p,.35,.5),arrow(510,110,640,95,{color:C.x,w:3,head:12})+label('dx：進む 距離',655,105,{size:28,color:C.x,weight:700}));
  s+=fade(seg(p,.5,.65),arrow(510,250,640,265,{color:C.t,w:3,head:12})+label('dt：短い 時間',655,275,{size:28,color:C.t,weight:700}));
  const u=seg(p,.6,.9);
  s+=fade(seg(p,.55,.65),line(200,420,1000,420,{color:C.dim,w:3})+dot(mix(420,600,u),420,12,C.v)+line(420,440,420,470,{color:C.x,w:2})+line(600,440,600,470,{color:C.x,w:2})+fade(u,arrow(420,455,600,455,{color:C.x,w:3,head:12})+label('dx',510,500,{size:26,color:C.x,anchor:'middle',weight:700})));
  return s;
 },
 [K+'mul']:(p)=>{
  let s=tex('v=\\dfrac{dx}{dt}',600,110,{size:62});
  s+=fade(seg(p,.15,.3),label('両辺に × dt',900,120,{size:28,color:C.t,weight:700}));
  s+=fade(seg(p,.3,.5),arrow(600,170,600,220,{color:C.dim,w:4,head:14})+tex('v\\,dt=dx',600,300,{size:76}));
  s+=fade(seg(p,.6,.75),label('速度 × 時間 ＝ 進んだ 距離',600,440,{size:32,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'div']:(p)=>{
  let s=tex('v\\,dt=dx',600,100,{size:62});
  s+=fade(seg(p,.15,.3),label('両辺を ÷ v',880,110,{size:28,color:C.v,weight:700}));
  s+=fade(seg(p,.3,.5),arrow(600,160,600,210,{color:C.dim,w:4,head:14})+tex('dt=\\dfrac{dx}{v}',600,320,{size:86}));
  s+=fade(seg(p,.6,.75),label('二手目',280,320,{size:30,color:C.hi,anchor:'middle',weight:700})+label('短い 時間 を 位置の 言葉で',600,470,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'num1']:(p)=>{
  const x0=200,x1=1000,u=seg(p,.15,.6);
  let s=line(120,200,1080,200,{color:C.dim,w:3});
  s+=line(x0,180,x0,220,{color:C.x,w:3})+line(x1,180,x1,220,{color:C.x,w:3});
  s+=dot(mix(x0,x1,u),200,14,C.v)+fade(seg(p,.05,.15),arrow(mix(x0,x1,u)+20,160,mix(x0,x1,u)+110,160,{color:C.v,w:4,head:12})+label('2 m/s',mix(x0,x1,u)+120,168,{size:26,color:C.v,weight:700}));
  s+=fade(seg(p,.1,.25),brace(x0,x1,235,{color:C.x})+label('0.02 m（拡大）',600,295,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),tex('dt=\\dfrac{0.02}{2}=0.01\\ \\mathrm{s}',600,420,{size:54}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=label('進んだ 距離 ÷ 速さ ＝ かかった 時間',600,130,{size:36,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.5),tex('dt=\\dfrac{dx}{v}',600,300,{size:80}));
  s+=fade(seg(p,.5,.65),label('短い 区間で 書いた 同じ 割り算',600,450,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'quiz2']:(p)=>card(250,100,700,300,label('確かめ',600,160,{size:26,color:C.dim,anchor:'middle'})+tex('v=5\\ \\mathrm{m/s},\\quad dx=0.1\\ \\mathrm{m}',600,245,{size:44})+label('かかる 時間は？',600,340,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi),
 [K+'ans2']:(p)=>{
  let s=card(250,100,700,300,label('確かめ',600,160,{size:26,color:C.dim,anchor:'middle'})+tex('v=5\\ \\mathrm{m/s},\\quad dx=0.1\\ \\mathrm{m}',600,245,{size:44})+fade(seg(p,.1,.3),tex('dt=\\dfrac{0.1}{5}=0.02\\ \\mathrm{s}',600,335,{size:46})),1,C.hi);
  s+=ok(880,345,seg(p,.4,.55));
  return s;
 },
 [K+'cond']:(p)=>{
  const f='dt=\\dfrac{dx}{v}',z=86,w=texWidth(f,z);
  let s=tex(f,360,200,{size:z});
  s+=fade(seg(p,.1,.25),ring(denC(360,z,f,'\\dfrac{dx}{v}'),200+.25*z,40,{color:C.a,w:4}));
  s+=card(660,70,480,160,label('v ＝ 0 では',900,135,{size:32,color:C.a,anchor:'middle',weight:700})+label('割れない',900,190,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.25,.4),C.a);
  s+=card(660,270,480,160,label('v ≠ 0 の 区間',900,335,{size:34,color:C.hi,anchor:'middle',weight:700})+label('だけを 考える',900,390,{size:30,color:C.ink,anchor:'middle'}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'cond2']:(p)=>{
  const G=axes({x:120,y:260,w:620,h:200,xmin:0,xmax:2.2,ymin:-11,ymax:11,xlabel:'t [s]',ylabel:'v [m/s]',xticks:[1,2],yticks:[10,-10],xcolor:C.t,ycolor:C.v});
  let s=G.svg+G.plot(t=>10-10*t,{from:0,to:1,color:C.v,w:5,p:seg(p,0,.3)})+G.plot(t=>10-10*t,{from:1,to:2,color:C.v,w:5,p:seg(p,.25,.5)});
  s+=fade(seg(p,.3,.45),dot(G.X(1),G.Y(0),11,C.a)+label('v ＝ 0（頂点）',G.X(1)+18,G.Y(0)-22,{size:24,color:C.a,weight:700}));
  s+=fade(seg(p,.5,.65),line(G.X(1),60,G.X(1),480,{color:C.hi,w:3,dash:'8 6'})+label('前の 区間',G.X(.5),440,{size:26,color:C.hi,anchor:'middle',weight:700})+label('後の 区間',G.X(1.5),440,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(840,120,330,230,label('境目で 分けて',1005,200,{size:28,color:C.ink,anchor:'middle'})+label('別々に 扱う',1005,260,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },

 // ===== S5 dt を置き換える =====
 [K+'sub1']:(p)=>{
  const f='a=\\dfrac{dv}{dt}',z=80,w=texWidth(f,z);
  let s=tex(f,330,210,{size:z});
  s+=denBox(330,210,z,f,'\\dfrac{dv}{dt}','dt',seg(p,.1,.25),C.t);
  s+=card(740,120,380,200,label('二手目で 作った',930,175,{size:26,color:C.dim,anchor:'middle'})+tex('dt=\\dfrac{dx}{v}',930,265,{size:54}),seg(p,.3,.45));
  s+=arrow(730,260,480,265,{color:C.hi,w:5,head:16,g:seg(p,.55,.75)});
  s+=fade(seg(p,.7,.85),label('分母の dt に 入れる',600,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sub2']:(p)=>{
  let s=tex('a=\\dfrac{dv}{dt}',600,90,{size:50});
  s+=fade(seg(p,.1,.3),arrow(600,140,600,185,{color:C.dim,w:4,head:14}));
  const f='a=\\dfrac{dv}{dx/v}',z=92;
  s+=fade(seg(p,.2,.4),tex(f,600,320,{size:z}));
  s+=fade(seg(p,.45,.6),denBox(600,320,z,f,'\\dfrac{dv}{dx/v}','dx/v',1,C.hi)+label('分母に さらに 分数',950,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('三手目',260,320,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chk1']:(p)=>{
  const x0=200,x1=1000,u=seg(p,.15,.6);
  let s=line(120,180,1080,180,{color:C.dim,w:3})+line(x0,160,x0,200,{color:C.x,w:3})+line(x1,160,x1,200,{color:C.x,w:3});
  s+=label('x ＝ 1 m',x0,140,{size:26,color:C.x,anchor:'middle',weight:700})+label('1.02 m',x1,140,{size:26,color:C.x,anchor:'middle',weight:700});
  s+=dot(mix(x0,x1,u),180,14,C.v)+label('v ＝ 2 m/s',x0,100,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),brace(x0,x1,215,{color:C.x})+label('dx ＝ 0.02 m',600,275,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),tex('dt=\\dfrac{0.02}{2}=0.01\\ \\mathrm{s}',600,410,{size:50}));
  return s;
 },
 [K+'chk2']:(p)=>{
  let s=label('dx ＝ 0.02 m、dt ＝ 0.01 s',600,90,{size:30,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.1,.3),tex('dv=a\\,dt',600,210,{size:60}));
  s+=fade(seg(p,.35,.55),tex('=2\\times0.01=0.02\\ \\mathrm{m/s}',600,340,{size:56}));
  return s;
 },
 [K+'chk3']:(p)=>{
  let s=tex('a=\\dfrac{dv}{dx/v}',230,210,{size:64});
  s+=fade(seg(p,.1,.25),tex('=\\dfrac{0.02}{0.02/2}',560,210,{size:60}));
  s+=fade(seg(p,.35,.5),tex('=\\dfrac{0.02}{0.01}',850,210,{size:60}));
  s+=fade(seg(p,.55,.7),tex('=2\\ \\mathrm{m/s^2}',600,380,{size:64})+ok(790,392));
  s+=fade(seg(p,.7,.85),label('元の a に 戻った',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  let s=card(80,90,480,280,label('時間で 書く',320,150,{size:30,color:C.t,anchor:'middle',weight:700})+tex('a=\\dfrac{dv}{dt}',320,290,{size:64}),1,C.t);
  s+=fade(seg(p,.2,.35),label('＝',600,245,{size:60,color:C.ink,anchor:'middle',weight:700}));
  s+=card(640,90,480,280,label('距離 と 速さ で 書く',880,150,{size:30,color:C.x,anchor:'middle',weight:700})+tex('a=\\dfrac{dv}{dx/v}',880,290,{size:64}),seg(p,.25,.4),C.x);
  s+=fade(seg(p,.55,.7),label('同じ 加速度 の 書き直し',600,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'map2']:(p)=>roadmap(p,{done:3,here:3,fill:[1,seg(p,.1,.25),seg(p,.25,.4)]})+fade(seg(p,.6,.75),label('まだ ゴール ではない',1050,470,{size:26,color:C.dim,anchor:'middle'})),

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(80,40,1040,200,label('前提 4つ',600,95,{size:28,color:C.dim,anchor:'middle'})+label('① m 一定　② 粒子 1個　③ 慣性系　④ 1本の 軸',600,150,{size:30,color:C.ink,anchor:'middle'})+label('F は 合力',600,205,{size:28,color:C.F,anchor:'middle',weight:700}),1);
  s+=card(80,270,1040,200,label('出発点',600,320,{size:26,color:C.dim,anchor:'middle'})+tex('F=ma',470,395,{size:54})+label('だけ（新しい 法則 なし）',580,405,{size:28,color:C.hi,weight:700}),seg(p,.3,.45),C.F);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=tex('a=\\dfrac{dv}{dt}',200,190,{size:58});
  s+=fade(seg(p,.1,.25),arrow(330,190,420,190,{color:C.dim,w:4,head:14})+label('dt ＝ dx/v',375,130,{size:24,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),tex('a=\\dfrac{dv}{dx/v}',600,190,{size:58}));
  s+=card(800,110,340,160,label('v ≠ 0 の',970,180,{size:30,color:C.hi,anchor:'middle',weight:700})+label('区間',970,230,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  s+=fade(seg(p,.3,.45),label('速度の 定義 v ＝ dx/dt から',600,400,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=tex('a=\\dfrac{dv}{dx/v}',600,150,{size:80});
  s+=card(170,280,400,170,label('どう 整理 できる？',370,375,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  s+=card(630,280,400,170,label('何を 意味する？',830,375,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
};

// ---- 前提の4枚 ----
function premGrid(p,n,{dim=false,hl=-1}={}){
 const L=[['① 質量 m が 一定','途中で 変わらない'],['② 粒子は 1個','見る 物体は 1つ'],['③ 慣性系','加速して いない 立場'],['④ 1本の 軸','まっすぐな 運動']];
 let s='';
 L.forEach(([a,b],i)=>{
  const x=(dim?60:120)+(i%2)*(dim?320:500),y=(dim?70:50)+Math.floor(i/2)*(dim?200:220),w=dim?300:460,h=dim?170:190;
  let g;
  if(dim)g=i===hl?1:.45;
  else if(i>=n)g=0;
  else if(i<n-2)g=1;
  else g=seg(p,.1+.3*(i%2),.25+.3*(i%2));
  s+=card(x,y,w,h,label(a,x+w/2,y+h*.45,{size:dim?26:32,color:i===hl?C.a:C.ink,anchor:'middle',weight:700})+label(b,x+w/2,y+h*.78,{size:dim?22:26,color:C.dim,anchor:'middle'}),g,i===hl?C.a:C.faint);
 });
 return s;
}
