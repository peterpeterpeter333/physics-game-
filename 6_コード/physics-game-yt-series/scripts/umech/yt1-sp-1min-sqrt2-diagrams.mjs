// 「1分の疑問」06 √2はなぜ分数にならない (ys-sp-1min-sqrt2) — 図。Stage 1200×515。
// 形（カウンター・Q カード・疑問カード・黄色の枠の問い）は 01 の yt1-sp-1min-common.mjs。小さな部品は yt1-sp-1min-c0609-common.mjs。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,poly,tex,clamp,mix} from './anim.mjs';
import {wrap,qcard,finalQ,cueT,vseg,HC} from './yt1-sp-1min-common.mjs';
import {card,tag,okMark,note} from './yt1-sp-1min-c0609-common.mjs';

const K='sp-1min-sqrt2:';
const R=String.raw;
const LOW=C.x, HIGH=C.E, BAD=C.a;

// unit square with its diagonal (x,y = top left, s = side)
function square(x,y,s,{u=1,g=1,lab=1}={}){
 let o=rect(x,y,s,s,{fill:C.x,fo:.06,stroke:C.ink,sw:3,rx:0});
 o+=fade(lab,label('1',x+s/2,y+s+36,{size:30,color:C.ink,anchor:'middle',weight:700})+label('1',x-26,y+s/2+10,{size:30,color:C.ink,anchor:'middle',weight:700}));
 o+=draw([[x,y+s],[x+s,y]],u,{color:HC,w:6});
 o+=fade(seg(u,.7,1)*lab,tex(R`\sqrt{2}`,x+s/2+38,y+s/2-14,{size:40,color:HC}));
 return fade(g,o);
}
// lightning bolt centred at (x,y)
const bolt=(x,y,k=1,g=1)=>fade(g,poly([[x+10*k,y-80*k],[x-30*k,y+6*k],[x-2*k,y+6*k],[x-16*k,y+80*k],[x+32*k,y-14*k],[x+4*k,y-14*k]],{fill:'#fff3a0',fo:1,stroke:HC,sw:3}));

// Greek temple (columns + roof); x0..x1 at base yB
function temple(x0,x1,yB,{g=1}={}){
 const col='#c9b98f',w=x1-x0,n=5,cw=w*.09;
 let s=rect(x0-20,yB,w+40,18,{fill:col,fo:.85,stroke:col,rx:2});
 s+=rect(x0-10,yB-18,w+20,18,{fill:col,fo:.7,stroke:col,rx:2});
 const top=yB-230;
 for(let i=0;i<n;i++){const cx=x0+cw/2+(w-cw)*i/(n-1);
  s+=rect(cx-cw/2,top,cw,yB-18-top,{fill:col,fo:.55,stroke:col,sw:1.5,rx:2});
  for(let f=1;f<4;f++)s+=line(cx-cw/2+cw*f/4,top+6,cx-cw/2+cw*f/4,yB-24,{color:'#8a7d5c',w:1.5});}
 s+=rect(x0-14,top-22,w+28,22,{fill:col,fo:.8,stroke:col,rx:2});
 s+=poly([[x0-30,top-22],[x1+30,top-22],[(x0+x1)/2,top-95]],{fill:col,fo:.6,stroke:col,sw:2});
 return fade(g,s);
}


const P1='√2は、なぜ分数にならない？', P2='本当に分数にならない？', P3='仮定は、どこで崩れる？';
export const sp1minSqrt2Diagrams={
 // 1 — Q：正方形と対角線
 [K+'q']:wrap(1,(p,ctx)=>{
  const t=cueT(p,ctx);
  const bg=square(80,250,180,{u:vseg(ctx,p,.1,.4),g:vseg(ctx,p,.05,.15)})
   +fade(vseg(ctx,p,.5,.65),tex(R`\sqrt{2}=\frac{?}{?}`,1020,330,{size:50,color:HC}));
  return qcard(['√2 は、なぜ','分数で 表せない？'],p,t,{bg,y0:170});
 },{fadeIn:false,roll:0}),

 // 2 — 2乗して2をはさむ → 終わらない・繰り返さない小数
 [K+'dec']:wrap(1,(p,ctx)=>{
  let s=tex(R`(\sqrt{2})^2=2`,600,110,{size:46,color:HC});
  const rows=[
   [R`1.4^2=1.96`,'2より小さい',LOW,330,190,.1],
   [R`1.42^2=2.0164`,'2より大きい',HIGH,870,190,.2],
   [R`1.414^2=1.999396`,'2より小さい',LOW,330,262,.3],
   [R`1.415^2=2.002225`,'2より大きい',HIGH,870,262,.4],
  ];
  for(const [e,w,col,x,y,a] of rows){const g=vseg(ctx,p,a,a+.08);
   s+=fade(g,tex(e,x-40,y,{size:36,color:col})+label(w,x+175,y+10,{size:24,color:col,anchor:'start',weight:700}));}
  s+=fade(vseg(ctx,p,.47,.55),tex(R`1.414<\sqrt{2}<1.415`,600,340,{size:42,color:C.ink}));
  const digits='1.41421356237309504880168872',nShow=Math.round(mix(0,digits.length,clamp((vseg(ctx,p,.55,.85)))));
  if(nShow>0)s+=label('√2 ＝ '+digits.slice(0,nShow)+(nShow>=digits.length?'…':''),600,425,{size:40,color:HC,anchor:'middle',weight:700});
  s+=tag('終わらない',470,485,{g:vseg(ctx,p,.8,.86),color:C.x,size:26})+tag('繰り返さない',740,485,{g:vseg(ctx,p,.88,.94),color:C.x,size:26});
  return s;
 },{pill:P1,bridge:.95}),

 // 3 — 背理法：もし分数なら → 計算 → 矛盾 → 仮定がまちがい
 [K+'contra']:wrap(2,(p,ctx)=>{
  let s=tag('背理法',600,120,{g:vseg(ctx,p,.4,.5),size:30});
  const box=(x,txt,col,g,sub='')=>card(x-170,180,340,130,label(txt,x,242,{size:30,color:col,anchor:'middle',weight:700})+(sub?label(sub,x,282,{size:24,color:C.dim,anchor:'middle'}):''),g,col);
  s+=box(220,'もし √2 が 分数なら',HC,vseg(ctx,p,.45,.55),'（仮定）');
  s+=fade(vseg(ctx,p,.58,.62),arrow(395,245,445,245,{color:C.dim,w:5,head:16}));
  s+=box(620,'計算を 進めると',C.ink,vseg(ctx,p,.6,.68));
  s+=fade(vseg(ctx,p,.7,.74),arrow(795,245,845,245,{color:C.dim,w:5,head:16}));
  s+=box(1020,'矛盾 が出る',BAD,vseg(ctx,p,.72,.82),'（ありえない）');
  s+=fade(vseg(ctx,p,.85,.95),arrow(1020,325,1020,375,{color:C.dim,w:5,head:16})+label('だから、最初の 仮定が まちがい',600,430,{size:34,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },{roll:0,q:{end:.38,lines:['本当に 分数に ならない？'],text:P2}}),

 // 4 — √2＝p/q → 両辺を2乗 → p²＝2q²
 [K+'eq1']:wrap(2,(p,ctx)=>{
  let s=tex(R`\sqrt{2}=\frac{p}{q}`,520,150,{size:50,color:C.ink});
  s+=note('これ以上 約分できない',700,160,vseg(ctx,p,.08,.18),HC);
  s+=fade(vseg(ctx,p,.5,.58),arrow(520,200,520,240,{color:C.dim,w:4,head:14})+label('両辺を 2乗',360,232,{size:26,color:C.dim,anchor:'end',weight:700}));
  s+=fade(vseg(ctx,p,.55,.65),tex(R`2=\frac{p^2}{q^2}`,520,300,{size:50,color:C.ink}));
  s+=fade(vseg(ctx,p,.7,.76),arrow(520,350,520,390,{color:C.dim,w:4,head:14})+label('両辺に q² を 掛ける',360,382,{size:26,color:C.dim,anchor:'end',weight:700}));
  s+=fade(vseg(ctx,p,.74,.84),tex(R`p^2=2q^2`,520,450,{size:54,color:HC}));
  s+=fade(vseg(ctx,p,.85,.95),rect(400,405,240,72,{fill:HC,fo:.08,stroke:HC,sw:3,rx:12}));
  return s;
 },{pill:P2}),

 // 5 — p も偶数 → p＝2k → q²＝2k² → q も偶数
 [K+'eq2']:wrap(2,(p,ctx)=>{
  let s=tex(R`p^2=2q^2`,600,100,{size:44,color:HC})+rect(495,62,210,64,{fill:HC,fo:.06,stroke:HC,sw:2,rx:10});
  s+=fade(vseg(ctx,p,.02,.1),label('→ p² は 2の倍数（偶数）→ p も 偶数',90,178,{size:30,color:C.ink,weight:700}));
  s+=card(720,140,440,120,label('もし p が 奇数なら、p² も 奇数',940,190,{size:26,color:C.ink,anchor:'middle',weight:700})+label('3² ＝ 9　　5² ＝ 25　　7² ＝ 49',940,232,{size:26,color:C.dim,anchor:'middle'}),vseg(ctx,p,.08,.18),C.dim);
  s+=fade(vseg(ctx,p,.3,.36),tex(R`p=2k`,240,262,{size:42,color:C.ink})+label('と おく',330,272,{size:28,color:C.dim,weight:700}));
  s+=fade(vseg(ctx,p,.4,.46),tex(R`(2k)^2=2q^2`,240,336,{size:42,color:C.ink}));
  s+=fade(vseg(ctx,p,.48,.54),label('→',420,346,{size:34,color:C.dim,anchor:'middle'})+tex(R`4k^2=2q^2`,580,336,{size:42,color:C.ink}));
  s+=fade(vseg(ctx,p,.6,.66),label('両辺を 2で 割る',440,420,{size:26,color:C.dim,anchor:'end',weight:700}));
  s+=fade(vseg(ctx,p,.64,.72),tex(R`q^2=2k^2`,580,410,{size:46,color:HC}));
  s+=fade(vseg(ctx,p,.82,.9),label('→ q² も 偶数 → q も 偶数',90,482,{size:30,color:C.ink,weight:700}));
  s+=tag('p 偶数',1010,350,{g:vseg(ctx,p,.12,.2),color:C.x,size:28})+tag('q 偶数',1010,440,{g:vseg(ctx,p,.88,.96),color:C.x,size:28});
  return s;
 },{pill:P2,bridge:.95}),

 // 6 — 矛盾の稲妻 → √2 は分数にならない
 [K+'boom']:wrap(3,(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=card(70,90,440,190,label('仮定',290,140,{size:28,color:C.dim,anchor:'middle',weight:700})+label('これ以上',290,192,{size:34,color:HC,anchor:'middle',weight:700})+label('約分できない',290,240,{size:34,color:HC,anchor:'middle',weight:700}),vseg(ctx,p,.2,.28),HC);
  s+=card(690,90,440,190,label('p も q も 偶数',910,140,{size:30,color:C.x,anchor:'middle',weight:700})
   +tex(R`\frac{p}{q}=\frac{2\times\square}{2\times\square}`,910,220,{size:40,color:C.ink})
   +fade(vseg(ctx,p,.3,.36),line(903,184,931,156,{color:BAD,w:4})+line(903,239,931,211,{color:BAD,w:4})),vseg(ctx,p,.22,.3),C.x);
  s+=fade(vseg(ctx,p,.3,.36),label('2で 約分できる！',910,315,{size:28,color:BAD,anchor:'middle',weight:700}));
  const fl=vseg(ctx,p,.5,.55),shake=fl>0&&fl<1?4*Math.sin(t*40):0;
  s+=bolt(600+shake,185,1.2,fl)+fade(fl,label('矛盾',600,315,{size:44,color:BAD,anchor:'middle',weight:700}));
  const fx=vseg(ctx,p,.53,.62);
  if(fl>0&&fx<1)s+=rect(0,0,1200,515,{fill:'#fff',fo:.15*(1-fx),stroke:'none',rx:0});
  s+=fade(vseg(ctx,p,.72,.82),rect(250,370,700,90,{fill:HC,fo:.1,stroke:HC,sw:4,rx:18})+label('√2 は 分数に ならない',580,430,{size:42,color:HC,anchor:'middle',weight:700}))+okMark(880,420,vseg(ctx,p,.8,.88));
  return s;
 },{roll:0,q:{end:.2,lines:['仮定は、どこで 崩れる？'],text:P3},bridge:.95}),

 // 7 — 伝説：古代ギリシャ、「すべては分数」の石板にひび
 [K+'legend']:wrap(3,(p,ctx)=>{
  let s=temple(90,450,470,{g:vseg(ctx,p,0,.12)});
  const tb=vseg(ctx,p,.12,.22);
  s+=fade(tb,rect(600,110,480,300,{fill:'#6f6a5e',fo:.9,stroke:'#b8b09a',sw:4,rx:10})
   +label('数は すべて',840,215,{size:44,color:'#f5ecd0',anchor:'middle',weight:700})
   +label('分数で 表せる',840,285,{size:44,color:'#f5ecd0',anchor:'middle',weight:700}));
  s+=fade(tb,draw([[760,110],[800,170],[780,210],[850,260],[820,320],[880,410]],vseg(ctx,p,.5,.75),{color:'#1a1a1a',w:5}));
  s+=fade(tb,draw([[850,260],[930,250],[970,300]],vseg(ctx,p,.65,.8),{color:'#1a1a1a',w:4}));
  s+=fade(vseg(ctx,p,.4,.5),tex(R`\sqrt{2}`,650,450,{size:52,color:HC})+arrow(690,430,750,380,{color:HC,w:5,head:16}));
  s+=note('伝説',990,470,vseg(ctx,p,0,.1),HC);
  return s;
 },{pill:P3,bridge:.95}),

 // 8 — 次の疑問：数直線には、どちらが多い？
 [K+'next']:wrap(4,(p,ctx)=>{
  const y=420,x0=120,x1=1080,X=v=>mix(x0,x1,v/3),g0=vseg(ctx,p,.3,.45);
  let s=fade(g0,line(x0-20,y,x1+20,y,{color:C.ink,w:3}));
  for(let v=0;v<=3;v++)s+=fade(g0,line(X(v),y-12,X(v),y+12,{color:C.ink,w:3})+label(String(v),X(v),y+48,{size:28,color:C.dim,anchor:'middle'}));
  [.5,1/3,2/3,1.25,1.5,1.75,2.5,7/3,8/3,.25,.75].forEach((v,i)=>{s+=fade(vseg(ctx,p,.35+i*.02,.4+i*.02),dot(X(v),y,8,C.x));});
  s+=fade(vseg(ctx,p,.45,.55),label('分数',X(.5),y-30,{size:26,color:C.x,anchor:'middle',weight:700}));
  for(const [v,e] of [[Math.SQRT2,R`\sqrt{2}`],[Math.sqrt(3),R`\sqrt{3}`],[Math.sqrt(5),R`\sqrt{5}`]])s+=fade(vseg(ctx,p,.55,.65),dot(X(v),y,9,HIGH)+tex(e,X(v),y-34,{size:30,color:HIGH}));
  s+=fade(vseg(ctx,p,.55,.65),label('分数でない数',X(1.95),y-80,{size:26,color:HIGH,anchor:'middle',weight:700}));
  const g=vseg(ctx,p,.02,.15);
  s+=finalQ(['分数で 表せる数と、表せない数。','数直線の上には、どちらが多い？'],g,{y:80,sc:.9+.1*g});
  return s;
 },{roll:0}),
};
