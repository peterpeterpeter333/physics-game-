// 特別編「1分の疑問」05（ys-sp-1min-zero）「0で割ってはいけないのはなぜ？」— 図。Stage 1200×515。
// 形（Q カード・「疑問 n」カウンター・疑問の札・「次の疑問 →」・最後の黄色の枠の問い）は 01 の yt1-sp-1min-common.mjs を import（編集しない）。
// 色：□（探す数）黄、成り立つ ○ 緑、成り立たない × 赤、＋側 赤・−側 青（グラフ）。
// 数値：1÷0.1＝10、1÷0.001＝1000、1÷0.000001＝1000000。y＝1/x は x→+0 で上へ、x→−0 で下へ。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,tex,axes} from './anim.mjs';
import {wrap,qcard,finalQ,cueT,voiceEnd,vseg,HC} from './yt1-sp-1min-common.mjs';

const PI=Math.PI;
const OKC=C.F, BAD='#ff6b6b', POS='#ff8f9b', NEG='#6f9dff';
const K='sp-1min-zero:';
const SQ=`{\\color{${HC}}{\\square}}`;
const T=(s,x,y,size=56,o={})=>tex(s,x,y,{size,color:C.ink,auto:false,...o});
const cross=(x,y,r=18,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:BAD,w:6})+line(x-r,y+r,x+r,y-r,{color:BAD,w:6}));
const okRing=(x,y,r=18,g=1)=>fade(g,ring(x,y,r,{color:OKC,w:6}));

// ---------- 2: apples — 6 ÷ 2 = 3 is 2 × 3 = 6 ----------
function apple(x,y,r=30){
 return dot(x,y,r,'#e5484d')+dot(x-r*.35,y-r*.3,r*.25,'#ff9a9e',.6)+line(x,y-r,x+3,y-r-12,{color:'#8a5a2b',w:4})+`<ellipse cx="${x+12}" cy="${y-r-8}" rx="11" ry="6" fill="#5ee07a" transform="rotate(-25 ${x+12} ${y-r-8})"/>`;
}
function appleScene(ctx,p,t){
 const a=vseg(ctx,p,0,.12),inv=vseg(ctx,p,.12,.3),ap=vseg(ctx,p,.32,.4),grp=vseg(ctx,p,.4,.6),e1=vseg(ctx,p,.45,.6),e2=vseg(ctx,p,.68,.85);
 let s=fade(a,label('割り算',420,118,{size:36,color:C.ink,anchor:'middle',weight:700})+label('かけ算',780,118,{size:36,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(inv,arrow(500,98,700,98,{color:HC,w:4,head:14})+arrow(700,124,500,124,{color:HC,w:4,head:14})+label('逆',600,82,{size:28,color:HC,anchor:'middle',weight:700}));
 for(let i=0;i<6;i++){const g=Math.floor(i/2),side=i%2?1:-1,x0=300+i*120,x1=360+g*240+side*40;s+=fade(ap,apple(mix(x0,x1,grp),240));}
 for(let g=0;g<3;g++){const cx=360+g*240;s+=fade(grp,rect(cx-95,190,190,100,{fill:'none',fo:0,stroke:HC,sw:2.5,rx:20}));}
 s+=fade(grp,label('2個ずつ → 3組',600,330,{size:28,color:HC,anchor:'middle',weight:700}));
 s+=fade(e1,T('6\\div 2=3',360,420,52));
 s+=fade(e2,label('⇔',600,432,{size:48,color:C.ink,anchor:'middle',weight:700})+T('2\\times 3=6',840,420,52));
 return s;
}

// ---------- 3: 6 ÷ 0 = □ → 0 × □ = 6 ----------
function sixScene(ctx,p,t){
 const a=vseg(ctx,p,0,.3),b=vseg(ctx,p,.42,.62),c=vseg(ctx,p,.7,.95);
 let s=fade(a,T(`6\\div 0=${SQ}`,600,190,72));
 s+=fade(b,arrow(600,240,600,300,{color:C.dim,w:4,head:14})+label('かけ算に 直す',640,280,{size:26,color:C.dim,weight:700}));
 s+=fade(b,T(`0\\times ${SQ}=6`,600,380,72));
 s+=fade(c,label('□ に 入る 数を 探す',600,480,{size:30,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ---------- 4: 0 × anything = 0 — no number gives 6 ----------
const TRY=['1','100','1000000'];
function noneScene(ctx,p,t){
 let s=T(`0\\times ${SQ}=6`,600,110,48);
 TRY.forEach((v,i)=>{const g=vseg(ctx,p,.08+i*.12,.18+i*.12),y=200+i*80;
  s+=fade(g,T(`0\\times {\\color{${HC}}{${v}}}=0`,470,y,46));
  s+=fade(seg(g,.5,1),label('≠ 6',740,y+14,{size:40,color:BAD,anchor:'middle',weight:700})+cross(820,y,18,1));});
 s+=fade(vseg(ctx,p,.62,.8),rect(240,430,720,62,{fill:BAD,fo:.12,stroke:BAD,sw:2.5,rx:20})+label('6 に なる 数は、どこにも ない',600,472,{size:32,color:'#ffb3b3',anchor:'middle',weight:700}));
 return s;
}

// ---------- 5: 0 ÷ 0 — every number fits ----------
const ANY=['1','7','100'];
function zzScene(ctx,p,t){
 const a=vseg(ctx,p,0,.2),b=vseg(ctx,p,.25,.45);
 let s=fade(a,T(`0\\div 0=${SQ}`,330,120,50))+fade(b,label('→',600,134,{size:44,color:C.dim,anchor:'middle',weight:700})+T(`0\\times ${SQ}=0`,870,120,50));
 ANY.forEach((v,i)=>{const g=vseg(ctx,p,.5+i*.1,.6+i*.1),y=230+i*80;
  s+=fade(g,T(`0\\times {\\color{${HC}}{${v}}}=0`,520,y,46))+okRing(760,y,20,seg(g,.5,1));});
 s+=fade(vseg(ctx,p,.82,.95),label('どんな 数でも 当てはまる',600,490,{size:32,color:OKC,anchor:'middle',weight:700}));
 return s;
}

// ---------- 6: none, or all → cannot decide one ----------
function sumScene(ctx,p,t){
 const a=vseg(ctx,p,0,.15),b=vseg(ctx,p,.15,.3),c=vseg(ctx,p,.5,.7),d=vseg(ctx,p,.75,.92);
 let s=fade(a,rect(60,70,500,260,{fill:'#131f38',fo:.95,stroke:BAD,sw:2.5,rx:16})+T('6\\div 0',310,150,52)+label('答えが 一つも ない',310,250,{size:32,color:'#ffb3b3',anchor:'middle',weight:700})+label('（0 個）',310,296,{size:26,color:C.dim,anchor:'middle'}));
 s+=fade(b,rect(640,70,500,260,{fill:'#131f38',fo:.95,stroke:OKC,sw:2.5,rx:16})+T('0\\div 0',890,150,52)+label('全部が 答え',890,250,{size:32,color:OKC,anchor:'middle',weight:700})+label('（1 も 7 も 100 も…）',890,296,{size:26,color:C.dim,anchor:'middle'}));
 s+=fade(c,label('一つに 決められない',600,400,{size:36,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(d,rect(330,430,540,64,{fill:HC,fo:.14,stroke:HC,sw:3,rx:22})+label('だから「割っては いけない」',600,473,{size:32,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ---------- 7–8: dividing by numbers close to 0 — the graph of y = 1/x ----------
const AX={x:70,y:285,w:480,h:340,xmin:-1,xmax:1,ymin:-10,ymax:10};
function graph(ctx,p,t,{right=1,left=0,rows=0,tab=1,ptR=-1,ptL=-1,upA=0,dnA=0,both=0}={}){
 const {X,Y}=axes({x:AX.x,y:AX.y+AX.h/2,w:AX.w,h:AX.h,xmin:AX.xmin,xmax:AX.xmax,ymin:AX.ymin,ymax:AX.ymax});
 let s=line(AX.x,Y(0),AX.x+AX.w,Y(0),{color:C.dim,w:2.5})+line(X(0),AX.y-AX.h/2-10,X(0),AX.y+AX.h/2+10,{color:C.dim,w:2.5});
 s+=label('x',AX.x+AX.w+10,Y(0)+8,{size:26,color:C.x})+label('0',X(0)-22,Y(0)+30,{size:24,color:C.dim,anchor:'middle'})+label('1',X(1)-4,Y(0)+30,{size:24,color:C.dim,anchor:'middle'})+label('−1',X(-1)+12,Y(0)+30,{size:24,color:C.dim,anchor:'middle'});
 s+=line(X(1),Y(0)-6,X(1),Y(0)+6,{color:C.dim,w:2})+line(X(-1),Y(0)-6,X(-1),Y(0)+6,{color:C.dim,w:2});
 s+=label('1 ÷ x',X(0)-14,AX.y-AX.h/2+10,{size:26,color:C.ink,anchor:'end',weight:700});
 const ptsR=Array.from({length:121},(_,i)=>{const u=1-i*(1-.1)/120;return [X(u),Y(1/u)];});
 const ptsL=Array.from({length:121},(_,i)=>{const u=-1+i*(1-.1)/120;return [X(u),Y(1/u)];});
 s+=draw(ptsR,right,{color:POS,w:5});
 if(left>0)s+=draw(ptsL,left,{color:NEG,w:5});
 if(ptR>=0){const u=mix(1,.1,ptR);s+=dot(X(u),Y(1/u),10,POS)+line(X(u),Y(0),X(u),Y(1/u),{color:POS,w:2,dash:'5 5'});}
 if(ptL>=0){const u=mix(-1,-.1,ptL);s+=dot(X(u),Y(1/u),10,NEG)+line(X(u),Y(0),X(u),Y(1/u),{color:NEG,w:2,dash:'5 5'});}
 const bob=6*Math.sin(t*4);
 s+=fade(upA,arrow(X(.1)+26,Y(9)+10,X(.1)+26,Y(9)-40+bob,{color:POS,w:5,head:16}));
 s+=fade(dnA,arrow(X(-.1)-26,Y(-9)-10,X(-.1)-26,Y(-9)+40-bob,{color:NEG,w:5,head:16}));
 // table (cue 7) / directions (cue 8)
 const R=[['1\\div 0.1','10'],['1\\div 0.001','1000'],['1\\div 0.000001','1000000']];
 R.forEach(([a,b],i)=>{const g=rows>i?clamp(rows-i):0,y=170+i*95;
  s+=fade(g*tab,T(`${a}=`,840,y,38,{anchor:'end'})+T(`{\\color{${POS}}{${b}}}`,860,y,38,{anchor:'start'}));});
 s+=fade(clamp(rows-2)*tab,label('（100万）',1050,365,{size:26,color:POS,anchor:'middle',weight:700}));
 s+=fade(clamp(rows-2.5)*tab,label('どこまでも 大きく',880,470,{size:32,color:POS,anchor:'middle',weight:700}));
 s+=fade(both,rect(640,110,520,110,{fill:'#131f38',fo:.95,stroke:POS,sw:2.5,rx:14})+label('＋側から 近づく',900,152,{size:30,color:POS,anchor:'middle',weight:700})+label('→ どこまでも 大きく',900,196,{size:28,color:POS,anchor:'middle'}));
 return s;
}

// ---------- 9: is there a difference in size between infinities? ----------
function infScene(ctx,p,t){
 const g=vseg(ctx,p,.3,.5),pulse=1+.05*Math.sin(t*3);
 let s=fade(g,scaleAt(330,410,pulse,T('\\infty',330,410,110))+scaleAt(870,410,pulse,T('\\infty',870,410,110)));
 s+=fade(vseg(ctx,p,.45,.65),label('？',600,440,{size:110,color:HC,anchor:'middle',weight:700}));
 return s;
}

export const sp1minZeroDiagrams={
 // 1 — Q card
 [K+'q']:wrap(1,(p,ctx)=>{const t=cueT(p,ctx);return qcard(['「0で 割ってはいけない」','なぜ ダメ？'],p,t,{bg:fade(.35,T('6\\div 0=\\,?',600,470,60)),y0:170});},{fadeIn:false,roll:0}),
 // 2 — division undoes multiplication
 [K+'apple']:wrap(1,(p,ctx)=>appleScene(ctx,p,cueT(p,ctx)),{pill:'0で割ってはいけないのは、なぜ？',bridge:.95}),
 // 3 — 6 ÷ 0 = □ means 0 × □ = 6
 [K+'six']:wrap(2,(p,ctx)=>sixScene(ctx,p,cueT(p,ctx)),{roll:0,q:{end:.3,lines:['6 ÷ 0 の 答えは？'],text:'6÷0 の答えは？'}}),
 // 4 — no number works
 [K+'none']:wrap(2,(p,ctx)=>noneScene(ctx,p,cueT(p,ctx)),{pill:'6÷0 の答えは？',bridge:.95}),
 // 5 — 0 ÷ 0: every number works
 [K+'zz']:wrap(3,(p,ctx)=>zzScene(ctx,p,cueT(p,ctx)),{roll:0,q:{end:.2,lines:['0 ÷ 0 は？'],text:'0÷0 は？'}}),
 // 6 — none or all → cannot decide
 [K+'sum']:wrap(3,(p,ctx)=>sumScene(ctx,p,cueT(p,ctx)),{pill:'0÷0 は？',bridge:.95}),
 // 7 — numbers close to 0: 1 ÷ x grows without end
 [K+'near']:wrap(4,(p,ctx)=>{const t=cueT(p,ctx);
  return graph(ctx,p,t,{right:vseg(ctx,p,.2,.4),ptR:vseg(ctx,p,.4,.9),rows:3*vseg(ctx,p,.4,.9)+.6*vseg(ctx,p,.9,.97),upA:vseg(ctx,p,.85,.95)});
 },{roll:0,q:{end:.3,lines:['0に 限りなく 近い 数で 割ると？'],text:'0に近い数で割ると？'}}),
 // 8 — from the minus side it goes down without end
 [K+'minus']:wrap(4,(p,ctx)=>{const t=cueT(p,ctx),tb=1-vseg(ctx,p,0,.1);
  let s=graph(ctx,p,t,{right:1,ptR:1,rows:3.6,tab:tb,upA:1,left:vseg(ctx,p,.05,.3),ptL:vseg(ctx,p,.2,.6),dnA:vseg(ctx,p,.5,.62),both:vseg(ctx,p,.1,.2)});
  s+=fade(vseg(ctx,p,.3,.45),rect(640,240,520,110,{fill:'#131f38',fo:.95,stroke:NEG,sw:2.5,rx:14})+label('−側から 近づく',900,282,{size:30,color:NEG,anchor:'middle',weight:700})+label('→ マイナスに どこまでも',900,326,{size:28,color:NEG,anchor:'middle'}));
  s+=fade(vseg(ctx,p,.7,.85),rect(660,390,480,70,{fill:HC,fo:.14,stroke:HC,sw:3,rx:22})+label('行き先が 一つに 決まらない',900,436,{size:30,color:HC,anchor:'middle',weight:700}));
  return s;
 },{fadeIn:false,pill:'0に近い数で割ると？',bridge:.95}),
 // 9 — next question (stops on the yellow frame)
 [K+'next']:wrap(5,(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,.05,.2);
  return infScene(ctx,p,t)+finalQ(['「無限大」にも、','大きさの 違いは ある？'],g,{y:80,sc:.9+.1*g});
 },{roll:0}),
};
