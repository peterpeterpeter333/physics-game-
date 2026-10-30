// 特別編「1分の疑問」04（ys-sp-1min-pi）「円周率はなぜ終わらない？」— 図。Stage 1200×515。
// 形（Q カード・「疑問 n」カウンター・疑問の札・「次の疑問 →」・最後の黄色の枠の問い）は 01 の yt1-sp-1min-common.mjs を import（編集しない）。
// 色：円・円周 水色、直径 黄、多角形 内側 緑・外側 橙、強調 黄。
// 数値：正 n 角形の周 ÷ 直径 = 内 n·sin(π/n)、外 n·tan(π/n)（n=96 で 3.1410／3.1427）。アルキメデスの答え 223/71 ≈ 3.1408 < π < 22/7 ≈ 3.1429。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,tex} from './anim.mjs';
import {wrap,qcard,finalQ,cueT,voiceEnd,vseg,HC} from './yt1-sp-1min-common.mjs';

const PI=Math.PI;
const CIR=C.x, DIA=HC, IN=C.F, OUT=C.E;
const PI_DIGITS='3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651';
const hash=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const K='sp-1min-pi:';
const clipR=(id,x,y,w,h,inner)=>`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
const circPts=(cx,cy,r,a0=0,a1=2*PI,n=160)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
const ngon=(cx,cy,R,n,rot=-PI/2)=>Array.from({length:n+1},(_,k)=>[cx+R*Math.cos(rot+2*PI*k/n),cy+R*Math.sin(rot+2*PI*k/n)]);

// ---------- 1: Q card over streaming digits ----------
function digitsBg(t){
 const row=(y,speed,size,op,off)=>{const str=(PI_DIGITS+PI_DIGITS.slice(2)).slice(0,200),x=60-((t*speed+off)%(size*.6*100));return label(str,x,y,{size,color:C.dim,opacity:op});};
 return row(470,60,34,.55,0)+row(420,25,22,.25,700);
}

// ---------- 2: circumference ÷ diameter — roll the circle; any size gives the same ratio ----------
function defScene(ctx,p,t){
 const a=vseg(ctx,p,0,.12),roll=vseg(ctx,p,.14,.48),b=vseg(ctx,p,.58,.8),c=vseg(ctx,p,.8,.95);
 const r=62,x0=110,gy=360,th=2*PI*roll,cx=x0+r*th,cy=gy-r,D=2*r;
 let s=fade(a,label('円周の 長さ ÷ 直径',360,112,{size:34,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(a,line(60,gy,1160,gy,{color:C.dim,w:2}));
 // unrolled circumference along the ground
 s+=line(x0,gy,cx,gy,{color:CIR,w:7});
 // circle with the diameter, rotating
 s+=fade(a,ring(cx,cy,r,{color:CIR,w:5}));
 const ang=th+PI/2;
 s+=fade(a,line(cx-r*Math.cos(ang),cy-r*Math.sin(ang),cx+r*Math.cos(ang),cy+r*Math.sin(ang),{color:DIA,w:5})+dot(cx+r*Math.cos(ang),cy+r*Math.sin(ang),7,CIR));
 // diameter ticks 1, 2, 3 and the leftover 0.14…
 for(let k=1;k<=3;k++){const x=x0+k*D;if(cx>=x-1)s+=fade(clamp((cx-x)/20),line(x,gy-14,x,gy+14,{color:DIA,w:4})+label(`${k}`,x-r,gy+44,{size:30,color:DIA,anchor:'middle',weight:700}));}
 if(roll>=1)s+=fade(seg(p,.48,.55),rect(x0+3*D,gy-8,2*PI*r-3*D,16,{fill:HC,fo:.6,stroke:'none',rx:4})+label('少し',x0+3*D+(2*PI*r-3*D)/2+8,gy+44,{size:26,color:HC,anchor:'middle',weight:700}));
 s+=fade(roll>=1?seg(p,.5,.58):0,label('直径の 約 3.14 倍',x0+PI*r,gy+92,{size:30,color:HC,anchor:'middle',weight:700}));
 // small and big circles: same ratio
 const pane=(x,rr,g)=>fade(g,ring(x,215,rr,{color:CIR,w:4})+line(x-rr,215,x+rr,215,{color:DIA,w:4})+label('3.14…',x,215+rr+44,{size:30,color:HC,anchor:'middle',weight:700}));
 s+=fade(b,rect(620,70,560,400,{fill:'#131f38',fo:.9,stroke:C.faint,sw:2,rx:14}));
 s+=pane(730,40,b)+pane(960,110,seg(b,.3,1));
 s+=fade(c,label('大きさに よらず 同じ',900,450,{size:30,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ---------- 3: how did people long ago find it? ----------
function oldBg(t){
 return fade(.6,ring(600,290,150,{color:CIR,w:4})+draw(ngon(600,290,150,6),1,{color:IN,w:3})+draw(ngon(600,290,150/Math.cos(PI/6),6),1,{color:OUT,w:3}));
}

// ---------- 4: Archimedes — inscribed and circumscribed 6 → 96-gons ----------
const NS=[6,12,24,48,96];
function polyScene(ctx,p,t){
 const a=vseg(ctx,p,0,.08),st=clamp((cueT(p,ctx)-.06*voiceEnd(ctx))/(.36*voiceEnd(ctx))),res=vseg(ctx,p,.45,.6),hi=vseg(ctx,p,.6,.75),hi2=vseg(ctx,p,.78,.92);
 const k=Math.min(4,Math.floor(st*5)),n=NS[k],cx=290,cy=280,R=175;
 let s=fade(a,ring(cx,cy,R,{color:CIR,w:4}));
 s+=fade(a,draw(ngon(cx,cy,R,n),1,{color:IN,w:3})+draw(ngon(cx,cy,R/Math.cos(PI/n),n,-PI/2+PI/n),1,{color:OUT,w:3}));
 s+=fade(a,label('内側',cx-R-10,cy+R+40,{size:26,color:IN,weight:700})+label('外側',cx+R-50,cy+R+40,{size:26,color:OUT,weight:700}));
 // zoom on the top to show the gap between the polygons and the circle
 const zx=cx,zy=cy-R,zs=6;
 let z=ring(cx,cy,R,{color:CIR,w:4/zs})+draw(ngon(cx,cy,R,n),1,{color:IN,w:3/zs})+draw(ngon(cx,cy,R/Math.cos(PI/n),n,-PI/2+PI/n),1,{color:OUT,w:3/zs});
 s+=fade(a,rect(510,74,250,170,{fill:'#0b1122',fo:1,stroke:C.faint,sw:2,rx:10})+clipR('pz',512,76,246,166,`<g transform="translate(635 165) scale(${zs}) translate(${-zx} ${-zy})">${z}</g>`)+label('拡大',635,270,{size:24,color:C.dim,anchor:'middle'}));
 s+=fade(a,label('正',880,160,{size:40,color:C.ink,anchor:'end',weight:700})+label(String(n),960,164,{size:64,color:HC,anchor:'middle',weight:700})+label('角形',1040,160,{size:40,color:C.ink,anchor:'start',weight:700}));
 s+=fade(a,label('6 → 12 → 24 → 48 → 96',960,220,{size:26,color:C.dim,anchor:'middle'}));
 // the result
 s+=fade(res,rect(760,280,420,160,{fill:'#131f38',fo:.95,stroke:HC,sw:2.5,rx:14})+label('円周率は',970,322,{size:28,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(res,tex(`{\\color{${IN}}{3.1408}} < \\pi < {\\color{${OUT}}{3.1429}}`,970,388,{size:38,color:C.ink,auto:false}));
 s+=fade(res,label('アルキメデスの 答え',970,476,{size:26,color:C.dim,anchor:'middle'}));
 return s;
}

// ---------- 5: rational numbers end or repeat; π does neither (Lambert 1761) ----------
function irrScene(ctx,p,t){
 const tg=vseg(ctx,p,.14,.3),r1=vseg(ctx,p,.32,.48),r1b=vseg(ctx,p,.42,.58),r2=vseg(ctx,p,.62,.8),ir=vseg(ctx,p,.78,.92);
 let s=fade(tg,rect(860,64,320,52,{fill:'#131f38',fo:.95,stroke:C.faint,sw:2,rx:24})+label('ランベルト　1761年',1020,99,{size:26,color:C.ink,anchor:'middle',weight:700}));
 // row 1: fractions
 s+=fade(r1,rect(30,130,1140,160,{fill:'#131f38',fo:.9,stroke:C.faint,sw:2,rx:14})+label('分数で 表せる 数',60,172,{size:28,color:C.F,weight:700}));
 s+=fade(r1,tex('\\frac{1}{4}=0.25',190,240,{size:38,color:C.ink,auto:false})+label('終わる',350,246,{size:28,color:C.F,anchor:'start',weight:700}));
 s+=fade(r1b,tex(`\\frac{1}{7}=0.{\\color{${HC}}{142857}}\\,{\\color{${C.x}}{142857}}\\,{\\color{${HC}}{142857}}\\ldots`,710,240,{size:38,color:C.ink,auto:false}));
 s+=fade(r1b,label('繰り返す',1100,246,{size:28,color:C.F,anchor:'middle',weight:700}));
 // row 2: π
 s+=fade(r2,rect(30,310,1140,160,{fill:'#131f38',fo:.9,stroke:HC,sw:2.5,rx:14})+label('円周率',60,352,{size:28,color:HC,weight:700}));
 s+=fade(r2,tex('\\pi=3.14159265358979323846\\ldots',420,420,{size:40,color:C.ink,auto:false}));
 s+=fade(r2,label('終わらず、繰り返さない',1150,430,{size:28,color:HC,anchor:'end',weight:700}));
 s+=fade(ir,rect(980,330,170,52,{fill:HC,fo:.18,stroke:HC,sw:2.5,rx:24})+label('無理数',1065,366,{size:30,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ---------- 6: 100 trillion digits vs NASA's 15 ----------
function digitsScene(ctx,p,t){
 const a=vseg(ctx,p,0,.4),b=vseg(ctx,p,.55,.8),c=vseg(ctx,p,.82,.95);
 // a mountain of digits growing upward
 const top=mix(470,170,a);
 let m='';
 for(let row=0;row<30;row++){const y=470-row*10;if(y<top)break;const w=mix(500,60,row/30);
  const str=PI_DIGITS.slice((row*7)%60,(row*7)%60+Math.round(w/9));m+=label(str,300,y,{size:12,color:'#7fb2ff',anchor:'middle',opacity:.8});}
 let s=m;
 s+=fade(a,label('100兆桁 以上',300,top-30,{size:40,color:'#7fb2ff',anchor:'middle',weight:700})+label('コンピューターの 計算',300,top-78,{size:26,color:C.dim,anchor:'middle'}));
 // NASA's small tag
 s+=fade(b,rect(700,250,440,110,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:14})+tex('3.141592653589793',920,316,{size:36,color:HC,auto:false}));
 s+=fade(b,label('宇宙探査機の 計算（NASA）',920,230,{size:28,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(c,label('小数点以下 15桁 ほど',920,410,{size:32,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ---------- 7: Buffon's needle — dropping needles on a floor of parallel lines ----------
function needles(ctx,p,t){
 const y0=300,y1=505,gap=50,len=40,g=vseg(ctx,p,.25,.4);
 let s=rect(40,y0,1120,y1-y0,{fill:'#3a2a1c',fo:1,stroke:'none',rx:10});
 for(let y=y0+gap/2;y<y1;y+=gap)s+=line(40,y,1160,y,{color:'#c9a77a',w:3});
 const tt=t-.25*voiceEnd(ctx);
 for(let i=0;i<40;i++){const t0=i*.18;if(tt<t0)break;
  const x=90+hash(i)*1020,y=y0+20+hash(i+3)*(y1-y0-40),ang=hash(i+5)*PI,fall=clamp((tt-t0)/.25);
  const dx=len/2*Math.cos(ang),dy=len/2*Math.sin(ang),yy=y-(1-fall)*60;
  const lo=Math.min(yy-dy,yy+dy),hi=Math.max(yy-dy,yy+dy),k0=Math.ceil((lo-(y0+gap/2))/gap),cross=fall>=1&&k0*gap+y0+gap/2<=hi;
  s+=fade(fall,line(x-dx,yy-dy,x+dx,yy+dy,{color:cross?HC:'#e8f2ff',w:4}));}
 return fade(g,s);
}

export const sp1minPiDiagrams={
 // 1 — Q card over the digits
 [K+'q']:wrap(1,(p,ctx)=>{const t=cueT(p,ctx);return qcard(['円周率 3.14159… は、','なぜ 終わらない？'],p,t,{bg:digitsBg(t),y0:190});},{fadeIn:false,roll:0}),
 // 2 — definition: circumference ÷ diameter, same for every circle
 [K+'def']:wrap(1,(p,ctx)=>defScene(ctx,p,cueT(p,ctx)),{pill:'円周率は、なぜ終わらない？',bridge:.95}),
 // 3 — how did people long ago know it?
 [K+'old']:wrap(2,(p,ctx)=>oldBg(cueT(p,ctx)),{roll:0,q:{end:.92,lines:['昔の 人は、','どうやって 知った？'],text:'昔の人は、どうやって知った？'}}),
 // 4 — Archimedes' 96-gons
 [K+'poly']:wrap(2,(p,ctx)=>polyScene(ctx,p,cueT(p,ctx)),{pill:'昔の人は、どうやって知った？',bridge:.95}),
 // 5 — why it never ends: irrational (Lambert 1761)
 [K+'irr']:wrap(3,(p,ctx)=>irrScene(ctx,p,cueT(p,ctx)),{roll:0,q:{end:.13,lines:['では、なぜ 終わらない？'],text:'なぜ終わらない？'},bridge:.95}),
 // 6 — how many digits do we use?
 [K+'digits']:wrap(4,(p,ctx)=>digitsScene(ctx,p,cueT(p,ctx)),{roll:0,q:{end:.1,lines:['何桁まで 分かっている？'],text:'何桁まで分かっている？'},bridge:.95}),
 // 7 — next question: needles (stops on the yellow frame)
 [K+'next']:wrap(5,(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,.05,.2);
  return needles(ctx,p,t)+finalQ(['円と 関係のない 針を 落とす 遊びに、','なぜ 円周率が 現れる？'],g,{y:76,sc:.9+.1*g});
 },{roll:0}),
};
