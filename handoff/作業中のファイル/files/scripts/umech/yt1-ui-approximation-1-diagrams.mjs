// YouTube シリーズ「近似・初級 1/2」(ys-ui-approximation-1) — 図。Stage 1200×515.
// 色：弧の長さ s 水色(C.x)、半径 r 橙(C.E)、角度 θ 黄(C.hi)、高さ sinθ 赤(C.a)、横 cosθ 緑(C.F)、誤り 赤、正しい 緑。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth} from './anim.mjs';

const K='ui-approximation-1:';
const S_=C.x,R_=C.E,TH=C.hi,SN=C.a,CS=C.F;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const P=(cx,cy,R,a)=>[cx+R*Math.cos(a),cy-R*Math.sin(a)];
const arcPts=(cx,cy,R,a0,a1,n=90)=>Array.from({length:n+1},(_,i)=>P(cx,cy,R,a0+(a1-a0)*i/n));
const arc=(cx,cy,R,a0,a1,{p=1,color=S_,w=7,dash=''}={})=>draw(arcPts(cx,cy,R,a0,a1),p,{color,w,dash});
// angle mark near the centre
function angleMark(cx,cy,th,{rr=46,color=TH,text='θ',g=1,size=28}={}){
 const [lx,ly]=P(cx,cy,rr+26,th/2);
 return fade(g,arc(cx,cy,rr,0,th,{color,w:3})+(text?label(text,lx,ly+10,{size,color,anchor:'middle',weight:700}):''));
}
// circle with two radii, arc s and angle θ
function wedge(cx,cy,R,th,{g=1,gs=1,gr=1,ga=1,circle=1,sText='s',rText='r',aText='θ',ps=1}={}){
 const [px,py]=P(cx,cy,R,th);
 let s=fade(circle,ring(cx,cy,R,{color:C.faint,w:2}));
 s+=fade(gr,line(cx,cy,cx+R,cy,{color:R_,w:5})+line(cx,cy,px,py,{color:R_,w:5})+(rText?label(rText,cx+R/2,cy+34,{size:28,color:R_,anchor:'middle',weight:700}):''));
 s+=fade(gs,arc(cx,cy,R,0,th,{p:ps})+(sText?(()=>{const [lx,ly]=P(cx,cy,R+34,th/2);return label(sText,lx,ly+10,{size:28,color:S_,anchor:'middle',weight:700});})():''));
 s+=angleMark(cx,cy,th,{g:ga,text:aText});
 s+=dot(cx,cy,6,C.dim);
 return fade(g,s);
}
const defTex=(x,y,size=64)=>tex(`\\theta=\\dfrac{${cs(S_,'s')}}{${cs(R_,'r')}}`,x,y,{size,auto:false});
const cross=(x,y,sz=16,color=C.a)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});

// ---------- S1 前回の問い ----------
function recapFormulas(p,{hl=0}={}){
 let s=label('前回',80,80,{size:24,color:C.dim});
 s+=fade(seg(p,0,.15),tex('x=A\\sin(\\omega t+\\varphi)',600,160,{size:54}));
 s+=arrow(600,215,600,285,{color:C.hi,w:4,g:seg(p,.3,.45)})+fade(seg(p,.35,.5),label('微分',630,262,{size:26,color:C.hi}));
 s+=fade(seg(p,.5,.65),tex('v=A\\omega\\cos(\\omega t+\\varphi)',600,350,{size:54}));
 return s;
}
// ---------- degree ring ----------
function degreeRing(cx,cy,R,p){
 let s=ring(cx,cy,R,{color:C.dim,w:3});
 const n=Math.round(36*seg(p,.05,.5));
 for(let i=0;i<n;i++){const a=i*Math.PI*2/36,[x1,y1]=P(cx,cy,R,a),[x2,y2]=P(cx,cy,R-(i%9===0?26:14),a);s+=line(x1,y1,x2,y2,{color:i%9===0?C.ink:C.dim,w:i%9===0?3:2});}
 const L=[[0,'0°'],[90,'90°'],[180,'180°'],[270,'270°']];
 s+=fade(seg(p,.45,.6),L.map(([d,t])=>{const [x,y]=P(cx,cy,R+40,d*Math.PI/180);return label(t,x,y+9,{size:24,color:C.ink,anchor:'middle'});}).join(''));
 return s;
}
// ---------- strings wrapped round the circle ----------
function strings(cx,cy,R,count,{g=1,showNums=true}={}){
 let s='';const cols=[R_,'#ffd0a0'];
 const whole=Math.floor(count),frac=count-whole;
 for(let i=0;i<Math.ceil(count);i++){
  const a0=i,a1=i+(i<whole?1:frac);
  s+=arc(cx,cy,R+10,a0,a1,{color:cols[i%2],w:9});
  if(showNums&&i<whole){const [x,y]=P(cx,cy,R+44,i+.5);s+=label(`${i+1}本`,x,y+9,{size:24,color:cols[i%2],anchor:'middle'});}
  const [tx1,ty1]=P(cx,cy,R+2,a0),[tx2,ty2]=P(cx,cy,R+20,a0);s+=line(tx1,ty1,tx2,ty2,{color:C.ink,w:2});
 }
 return fade(g,s);
}

export const ytUiApprox1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>recapFormulas(p),
 [K+'inside']:(p)=>{
  let s=recapFormulas(1);
  const w0=texWidth('x=A\\sin(',54),wAll=texWidth('x=A\\sin(\\omega t+\\varphi)',54),wIn=texWidth('\\omega t+\\varphi',54);
  const x0=600-wAll/2+w0-6;
  s+=highlight(x0,112,wIn+14,70,seg(p,.05,.2));
  s+=fade(seg(p,.15,.3),label('角度（ラジアンで測る）',x0+wIn/2,90,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(760,400,400,90,label('ω：1秒あたりに 進む角度',960,455,{size:26,color:C.ink,anchor:'middle'}),seg(p,.6,.75));
  return s;
 },
 [K+'question']:(p)=>{
  let s=label('今回の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(170,100,860,150,label('角度を ラジアンで 測ると',600,165,{size:38,color:C.ink,anchor:'middle'})+label('何が 得になる？',600,222,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  s+=fade(seg(p,.35,.5),label('おなじみの「度」',380,340,{size:32,color:C.dim,anchor:'middle'})+label('30°，90°，360°',380,395,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('ラジアン',820,340,{size:32,color:C.hi,anchor:'middle'})+label('？',820,395,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'degree']:(p)=>{
  let s=degreeRing(300,270,190,p);
  s+=card(620,90,520,110,label('1周 ＝ 360°',880,160,{size:40,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25));
  s+=fade(seg(p,.55,.7),label('360 は 割り切りやすい数',880,260,{size:30,color:C.ink,anchor:'middle'})+label('÷2，÷3，÷4，÷5，÷6，÷8，÷9，÷10，…',880,305,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.78,.9),label('人が選んだ数（円の形からは決まらない）',880,390,{size:26,color:C.a,anchor:'middle'}));
  return s;
 },
 // ===== S2 弧の長さ÷半径 =====
 [K+'def']:(p)=>{
  const th=1.1;
  let s=wedge(300,310,185,th,{gr:seg(p,.05,.2),gs:seg(p,.3,.45),ps:seg(p,.3,.55),ga:seg(p,.15,.3)});
  s+=fade(seg(p,.3,.45),label('弧の長さ s',640,140,{size:30,color:S_}))+fade(seg(p,.5,.62),label('半径 r',640,190,{size:30,color:R_}));
  s+=card(620,230,520,200,defTex(880,335,70)+label('単位：rad（ラジアン）',880,410,{size:24,color:C.dim,anchor:'middle'}),seg(p,.62,.78),C.hi);
  return s;
 },
 [K+'scale']:(p)=>{
  const th=.9,g2=seg(p,.1,.35);
  let s=wedge(150,430,110,th,{sText:'s',rText:'r',circle:0});
  s+=fade(g2,wedge(400,430,220,th,{sText:'2s',rText:'2r',circle:0}));
  s+=fade(g2,label('同じ角度・2倍の円',400,495,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(760,120,400,280,tex(`\\theta=\\dfrac{${cs(S_,'2s')}}{${cs(R_,'2r')}}=\\dfrac{${cs(S_,'s')}}{${cs(R_,'r')}}`,960,235,{size:52,auto:false})
   +fade(seg(p,.6,.75),label('円の大きさによらず',960,315,{size:28,color:C.ink,anchor:'middle'})+label('開き具合だけで 決まる',960,360,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.35,.5));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=tex(`\\theta=\\dfrac{${cs(S_,'s')}\\;[\\mathrm{m}]}{${cs(R_,'r')}\\;[\\mathrm{m}]}`,420,230,{size:64,auto:false});
  const g=seg(p,.2,.4);
  s+=fade(seg(p,.35,.5),label('m ÷ m ＝ 単位が残らない',420,370,{size:30,color:C.ink,anchor:'middle'}));
  s+=card(740,150,420,200,label('rad（ラジアン）',950,215,{size:32,color:C.hi,anchor:'middle',weight:700})+label('「長さの比で 測った」',950,275,{size:28,color:C.ink,anchor:'middle'})+label('という 目印',950,320,{size:28,color:C.ink,anchor:'middle'}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'predict']:(p)=>{
  const cx=320,cy=300,R=170;
  let s=ring(cx,cy,R,{color:C.dim,w:3})+line(cx,cy,cx+R,cy,{color:R_,w:5})+dot(cx,cy,6,C.dim)+label('r',cx+R/2,cy+34,{size:28,color:R_,anchor:'middle',weight:700});
  // a string of length R lying off to the right, then an arrow suggesting it is wrapped
  s+=fade(seg(p,.05,.2),line(cx+R+10,cy+120,cx+R+10+R,cy+120,{color:R_,w:9})+label('半径と同じ長さの ひも',cx+R+10+R/2,cy+165,{size:24,color:R_,anchor:'middle'}));
  s+=arrow(cx+R+60,cy+100,cx+R+20,cy+20,{color:C.hi,w:4,g:seg(p,.2,.35)});
  s+=card(760,110,400,220,label('円周に 巻きつけると',960,175,{size:30,color:C.ink,anchor:'middle'})+label('中心角は？',960,235,{size:36,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',960,295,{size:24,color:C.hi,anchor:'middle'}),seg(p,.25,.4),C.hi);
  return s;
 },
 [K+'one']:(p)=>{
  const cx=320,cy=290,R=180,w=seg(p,0,.35);
  let s=ring(cx,cy,R,{color:C.faint,w:2})+dot(cx,cy,6,C.dim);
  s+=line(cx,cy,cx+R,cy,{color:R_,w:5})+label('r',cx+R/2,cy+34,{size:28,color:R_,anchor:'middle',weight:700});
  s+=arc(cx,cy,R+10,0,w,{color:R_,w:9});
  const [px,py]=P(cx,cy,R,1);
  s+=fade(seg(p,.35,.45),line(cx,cy,px,py,{color:R_,w:5})+angleMark(cx,cy,1,{text:''})+label('1 rad',...P(cx,cy,95,.5),{size:26,color:TH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.45),(()=>{const [lx,ly]=P(cx,cy,R+44,.5);return label('ひも ＝ r',lx+14,ly,{size:24,color:R_});})());
  s+=card(640,110,520,300,tex(`\\dfrac{${cs(S_,'s')}}{${cs(R_,'r')}}=\\dfrac{${cs(R_,'r')}}{${cs(R_,'r')}}=1`,900,215,{size:54,auto:false})
   +fade(seg(p,.4,.55),label('1 rad',900,300,{size:40,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('≈ 57.3°',900,365,{size:34,color:C.ink,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'half']:(p)=>{
  const cx=330,cy=330,R=170,c=3.14159*seg(p,.02,.6);
  let s=ring(cx,cy,R,{color:C.faint,w:2})+dot(cx,cy,6,C.dim)+line(cx,cy,cx+R,cy,{color:R_,w:4});
  s+=strings(cx,cy,R,c);
  s+=fade(seg(p,.6,.7),line(cx-R-30,cy,cx+R+30,cy,{color:C.dim,w:2,dash:'8 6'})+label('半周',cx-R-40,cy+8,{size:24,color:C.dim,anchor:'end'}));
  s+=card(700,110,450,300,label('半周までに 入る ひもの本数',925,170,{size:26,color:C.ink,anchor:'middle'})
   +label(`${c.toFixed(2)} 本`,925,250,{size:44,color:R_,anchor:'middle',weight:700})
   +fade(seg(p,.7,.85),label('この数が π',925,340,{size:38,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'full']:(p)=>{
  const cx=300,cy=290,R=170,a=Math.PI*(1+seg(p,.35,.6));
  let s=ring(cx,cy,R,{color:C.faint,w:2})+dot(cx,cy,6,C.dim)+line(cx,cy,cx+R,cy,{color:R_,w:4});
  s+=arc(cx,cy,R,0,Math.min(a,Math.PI*2-.001),{color:S_,w:7});
  s+=fade(seg(p,.02,.12),label('π',cx-R-30,cy-12,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.6),label('2π',cx+R+30,cy-12,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=card(600,70,560,120,tex('180^\\circ=\\pi\\ \\mathrm{rad}',880,150,{size:52,auto:false}),seg(p,.05,.2));
  s+=card(600,205,560,120,tex('360^\\circ=2\\pi\\ \\mathrm{rad}',880,285,{size:52,auto:false}),seg(p,.35,.5));
  s+=card(600,340,560,140,tex(`\\dfrac{${cs(S_,'2\\pi r')}}{${cs(R_,'r')}}=2\\pi`,960,425,{size:50,auto:false})+label('1周の弧',640,420,{size:24,color:S_}),seg(p,.7,.82));
  return s;
 },
 [K+'small']:(p)=>{
  // big radius so that a 0.1 rad wedge is visible
  const cx=90,cy=440,R=420,th=.1;
  let s=wedge(cx,cy,R,th,{circle:0,sText:'',rText:'',aText:'',ps:seg(p,.2,.4),gs:seg(p,.2,.3)});
  s+=arc(cx,cy,R,-.03,.35,{color:C.faint,w:2});
  s+=label('r',cx+R/2,cy+34,{size:28,color:R_,anchor:'middle',weight:700});
  const [ax,ay]=P(cx,cy,R,.05);
  s+=fade(seg(p,.25,.4),label('s ＝ r の 1/10',ax+20,ay+8,{size:28,color:S_,weight:700}));
  s+=angleMark(cx,cy,th,{rr:120,text:'',g:seg(p,.1,.2)})+fade(seg(p,.1,.2),label('0.1 rad',cx+140,cy-40,{size:24,color:TH}));
  s+=card(760,90,400,180,label('0.1 rad',960,160,{size:40,color:C.hi,anchor:'middle',weight:700})+label('≈ 5.7°',960,225,{size:34,color:C.ink,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },
 [K+'convert']:(p)=>{
  let s=label('度 → ラジアン',600,80,{size:30,color:C.dim,anchor:'middle'});
  s+=card(250,110,700,120,label('度の数',420,185,{size:32,color:C.ink,anchor:'middle'})+tex('\\times\\dfrac{\\pi}{180}',640,180,{size:52,auto:false})+label('＝ ラジアン',830,185,{size:32,color:C.hi,anchor:'middle'}),seg(p,0,.15));
  s+=fade(seg(p,.4,.55),tex('30^\\circ\\ \\to\\ 30\\times\\dfrac{\\pi}{180}=\\dfrac{\\pi}{6}',600,320,{size:50,auto:false}));
  s+=fade(seg(p,.65,.8),tex('\\approx 0.524\\ \\mathrm{rad}',600,430,{size:50,auto:false,color:C.hi}));
  return s;
 },
 [K+'quiz']:(p)=>{
  const cx=280,cy=330,R=170;
  let s=ring(cx,cy,R,{color:C.faint,w:2})+dot(cx,cy,6,C.dim)+line(cx,cy,cx+R,cy,{color:R_,w:4})+line(cx,cy,cx,cy-R,{color:R_,w:4});
  s+=arc(cx,cy,R,0,Math.PI/2,{color:S_,w:7})+angleMark(cx,cy,Math.PI/2,{text:'90°'});
  s+=card(600,100,540,130,label('理解の確認',870,150,{size:24,color:C.dim,anchor:'middle'})+label('90° は 何 rad？',870,205,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.12),C.hi);
  s+=fade(seg(p,.5,.62),label('180° の 半分',870,290,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.62,.78),tex('\\dfrac{\\pi}{2}\\approx 1.57\\ \\mathrm{rad}',870,390,{size:52,auto:false,color:C.hi}));
  return s;
 },
 // ===== S3 弧の長さを求める =====
 [K+'problem']:(p)=>{
  const cx=260,cy=330,R=360,th=.1;
  let s=wedge(cx-160,cy+100,R,th,{circle:0,sText:'',rText:'',aText:''});
  s+=arc(cx-160,cy+100,R,-.02,.3,{color:C.faint,w:2});
  s+=label('r ＝ 2 m',cx+20,cy+140,{size:28,color:R_,anchor:'middle',weight:700});
  s+=angleMark(cx-160,cy+100,th,{rr:110,text:''})+label('0.1 rad',cx-30,cy+60,{size:24,color:TH});
  const [ax,ay]=P(cx-160,cy+100,R,.05);s+=label('s ＝ ？',ax+20,ay+8,{size:30,color:S_,weight:700});
  s+=card(640,110,520,220,label('例題',900,160,{size:26,color:C.dim,anchor:'middle'})+label('半径 2 m の円で、中心角 0.1 rad',900,220,{size:28,color:C.ink,anchor:'middle'})+label('弧の長さ s は 何 m？',900,275,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'rearrange']:(p)=>{
  let s=defTex(360,150,58);
  s+=fade(seg(p,.15,.3),label('両辺に r を掛ける',720,150,{size:28,color:C.hi}));
  s+=fade(seg(p,.3,.45),tex(`${cs(R_,'r')}\\,\\theta=\\dfrac{${cs(S_,'s')}}{\\cancel{${cs(R_,'r')}}}\\times\\cancel{${cs(R_,'r')}}`,360,300,{size:52,auto:false}));
  s+=fade(seg(p,.5,.62),tex(`${cs(S_,'s')}=${cs(R_,'r')}\\,\\theta`,360,430,{size:64,auto:false})+highlight(250,385,220,80,1));
  s+=fade(seg(p,.7,.85),label('弧の長さ ＝ 半径 × 角度',720,435,{size:30,color:C.ink}));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=tex(`${cs(S_,'s')}=${cs(R_,'r')}\\,\\theta`,300,150,{size:60,auto:false});
  s+=fade(seg(p,.1,.3),tex(`=${cs(R_,'2\\ \\mathrm{m}')}\\times ${cs(TH,'0.1')}`,420,270,{size:54,auto:false}));
  s+=fade(seg(p,.5,.65),tex(`=${cs(S_,'0.2\\ \\mathrm{m}')}`,380,390,{size:60,auto:false})+highlight(380-texWidth(`=${cs(S_,'0.2\\ \\mathrm{m}')}`,60,false)/2-14,345,texWidth(`=${cs(S_,'0.2\\ \\mathrm{m}')}`,60,false)+28,82,1));
  s+=card(760,140,380,220,label('入れる角度は',950,210,{size:28,color:C.ink,anchor:'middle'})+label('ラジアン（0.1）',950,270,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35));
  return s;
 },
 [K+'meaning']:(p)=>{
  // radius bar of 2 m split into 10 pieces; one piece = 0.2 m
  const x0=130,x1=1070,y=230,step=(x1-x0)/10;
  let s=line(x0,y,x1,y,{color:R_,w:10})+label('半径 r ＝ 2 m',(x0+x1)/2,y-40,{size:30,color:R_,anchor:'middle',weight:700});
  const g=seg(p,.2,.45);
  for(let i=1;i<10;i++)s+=fade(g,line(x0+i*step,y-16,x0+i*step,y+16,{color:C.ink,w:2}));
  s+=fade(seg(p,.4,.55),rect(x0,y-12,step,24,{fill:S_,fo:.9,rx:4})+brace(x0,x0+step,y+26,{text:'10分の1',color:S_,size:26}));
  s+=fade(seg(p,.55,.7),tex(`\\dfrac{1}{10}\\times ${cs(R_,'2\\ \\mathrm{m}')}=${cs(S_,'0.2\\ \\mathrm{m}')}`,600,410,{size:54,auto:false}));
  s+=fade(seg(p,.8,.92),label('一致 ✓',950,420,{size:32,color:C.F,weight:700}));
  return s;
 },
 [K+'wrongdeg']:(p)=>{
  let s=label('よくある間違い',600,80,{size:30,color:C.a,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),label('0.1 rad ≈ 5.7°',600,160,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),tex(`${cs(S_,'s')}=${cs(R_,'2')}\\times 5.7=11.4\\ \\mathrm{m}`,560,290,{size:56,auto:false,color:C.a}));
  s+=fade(seg(p,.4,.55),cross(250,290,22));
  s+=fade(seg(p,.6,.75),label('度の数字を そのまま入れた',600,410,{size:30,color:C.a,anchor:'middle'}));
  return s;
 },
 [K+'absurd']:(p)=>{
  const cx=300,cy=290,R=170,frac=11.4/(4*Math.PI);
  let s=ring(cx,cy,R,{color:C.faint,w:3})+dot(cx,cy,6,C.dim)+line(cx,cy,cx+R,cy,{color:R_,w:4})+label('2 m',cx+R/2,cy+34,{size:26,color:R_,anchor:'middle'});
  s+=arc(cx,cy,R+12,0,2*Math.PI*frac*seg(p,.45,.8),{color:C.a,w:8});
  s+=card(600,90,560,120,label('円周',680,160,{size:28,color:C.ink})+tex('2\\pi\\times 2\\approx 12.6\\ \\mathrm{m}',950,155,{size:46,auto:false}),seg(p,.05,.2));
  s+=card(600,240,560,170,label('11.4 m の弧',880,305,{size:32,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.75,.9),label('ほぼ 1周してしまう',880,365,{size:30,color:C.ink,anchor:'middle'})),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'wrongops']:(p)=>{
  let s='';
  s+=card(60,100,520,300,label('割る',320,160,{size:30,color:C.dim,anchor:'middle'})+tex('2\\div 0.1=20\\ \\mathrm{m}',320,245,{size:48,auto:false,color:C.a})+fade(seg(p,.25,.4),label('円周 12.6 m より長い',320,340,{size:28,color:C.ink,anchor:'middle'})),seg(p,.05,.2),C.a);
  s+=card(620,100,520,300,label('足す',880,160,{size:30,color:C.dim,anchor:'middle'})+tex('2+0.1=2.1',880,245,{size:48,auto:false,color:C.a})+fade(seg(p,.7,.85),label('長さ ＋ 比 ＝ 意味がない',880,340,{size:28,color:C.ink,anchor:'middle'})),seg(p,.5,.65),C.a);
  s+=fade(seg(p,.05,.2),cross(110,245,16))+fade(seg(p,.5,.65),cross(670,245,16));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=card(200,110,800,300,tex(`${cs(S_,'s')}=${cs(R_,'r')}\\,\\theta`,600,210,{size:70,auto:false})
   +label('θ に入れてよいのは',600,310,{size:30,color:C.ink,anchor:'middle'})+label('ラジアンで 測った角度 だけ',600,365,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  return s;
 },
 // ===== S4 ラジアンの得 =====
 [K+'unitcircle']:(p)=>{
  const cx=320,cy=300,R=190,th=.9;
  let s=wedge(cx,cy,R,th,{rText:'1',sText:'θ',ps:seg(p,.4,.6)});
  s+=card(640,110,520,300,label('半径 r ＝ 1 の円',900,170,{size:30,color:R_,anchor:'middle'})
   +fade(seg(p,.35,.5),tex(`${cs(S_,'s')}=${cs(R_,'1')}\\times\\theta=\\theta`,900,270,{size:54,auto:false}))
   +fade(seg(p,.6,.75),label('弧の長さ ＝ 角度 θ そのもの',900,360,{size:28,color:S_,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'sincos']:(p)=>{
  const cx=320,cy=300,R=190,th=.9,[px,py]=P(cx,cy,R,th);
  let s=wedge(cx,cy,R,th,{rText:'1',sText:'',gs:.45,gr:.6});
  s+=line(cx-R-20,cy,cx+R+20,cy,{color:C.dim,w:2});
  s+=fade(seg(p,.05,.2),line(px,py,px,cy,{color:SN,w:7})+label('sinθ',px+80,(py+cy)/2+8,{size:28,color:SN,weight:700})+line(px+6,(py+cy)/2,px+72,(py+cy)/2,{color:SN,w:2,dash:'4 4'}));
  s+=fade(seg(p,.25,.4),line(cx,cy+6,px,cy+6,{color:CS,w:7})+label('cosθ',(cx+px)/2-24,cy+44,{size:28,color:CS,anchor:'middle',weight:700}));
  s+=dot(px,py,9,C.ink);
  s+=card(640,110,520,150,label('高さ ＝ sinθ',900,170,{size:32,color:SN,anchor:'middle',weight:700})+label('横 ＝ cosθ',900,225,{size:32,color:CS,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(640,290,520,140,label('前回の振動の位置',900,340,{size:26,color:C.dim,anchor:'middle'})+tex('x=A\\sin(\\omega t+\\varphi)',900,395,{size:40}),seg(p,.55,.7));
  return s;
 },
 [K+'compare']:(p)=>{
  const cx=280,cy=330,R=200,th=.9,[px,py]=P(cx,cy,R,th);
  let s=ring(cx,cy,R,{color:C.faint,w:2})+line(cx,cy,cx+R,cy,{color:R_,w:4})+line(cx,cy,px,py,{color:R_,w:4})+dot(cx,cy,6,C.dim);
  const u=seg(p,.35,.7);
  s+=arc(cx,cy,R,0,th,{color:S_,w:7})+line(px,py,px,cy,{color:SN,w:7});
  // arc straightened and laid next to the height as bars
  const bx=720,base=440,k=R;
  s+=fade(u,line(bx,base,bx,base-k*th,{color:S_,w:14})+line(bx+90,base,bx+90,base-k*Math.sin(th),{color:SN,w:14})
   +label('θ',bx,base+36,{size:28,color:S_,anchor:'middle',weight:700})+label('sinθ',bx+90,base+36,{size:28,color:SN,anchor:'middle',weight:700})
   +line(bx-40,base,bx+130,base,{color:C.dim,w:2}));
  s+=fade(seg(p,.05,.2),label('どちらも 同じ図の中の 長さ',880,110,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('そのまま 比べられる',990,250,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'deg30']:(p)=>{
  let s='';
  s+=card(40,90,540,340,label('度で書くと',310,145,{size:28,color:C.dim,anchor:'middle'})
   +tex('\\sin 30^\\circ=0.5',310,220,{size:46,auto:false})
   +fade(seg(p,.15,.3),label('30 と 0.5 は 比べようがない',310,320,{size:26,color:C.a,anchor:'middle'})),seg(p,0,.15));
  s+=card(620,90,540,340,label('ラジアンで書くと',890,145,{size:28,color:C.dim,anchor:'middle'})
   +tex(`30^\\circ=${cs(S_,'0.524')}\\ \\mathrm{rad}`,890,220,{size:46,auto:false})
   +fade(seg(p,.6,.72),tex(`\\sin 30^\\circ=${cs(SN,'0.5')}`,890,300,{size:46,auto:false}))
   +fade(seg(p,.75,.88),label('0.524 と 0.5：近い値',890,385,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.5,.62),C.hi);
  return s;
 },
 [K+'speed']:(p)=>{
  const cx=320,cy=290,R=190,th=.3+1.1*seg(p,.1,.9),[px,py]=P(cx,cy,R,th);
  let s=ring(cx,cy,R,{color:C.faint,w:2})+dot(cx,cy,6,C.dim)+line(cx,cy,cx+R,cy,{color:R_,w:4})+line(cx,cy,px,py,{color:R_,w:3});
  s+=arc(cx,cy,R,0,th,{color:S_,w:7})+dot(px,py,10,C.ink);
  // velocity: tangent, length ↔ 1 (drawn as 110 px)
  const L=110,vx=-Math.sin(th)*L,vy=-Math.cos(th)*L;
  s+=fade(seg(p,.3,.45),arrow(px,py,px+vx,py+vy,{color:C.v,w:5})+label('速さ 1',px+vx-10,py+vy-14,{size:26,color:C.v,anchor:'end'}));
  s+=card(640,110,520,300,label('θ が 1秒に 1 増える',900,170,{size:30,color:C.hi,anchor:'middle'})
   +label('角度 ＝ 弧の長さ だから',900,240,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('点は 秒速 1 で 進む',900,320,{size:32,color:C.v,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'deriv']:(p)=>{
  const cx=320,cy=290,R=190,th=.8,[px,py]=P(cx,cy,R,th);
  let s=ring(cx,cy,R,{color:C.faint,w:2})+dot(cx,cy,6,C.dim)+line(cx,cy,px,py,{color:R_,w:3})+line(cx-R-20,cy,cx+R+20,cy,{color:C.dim,w:2});
  s+=line(px,py,px,cy,{color:SN,w:6})+dot(px,py,10,C.ink);
  const L=150,vx=-Math.sin(th)*L,vy=-Math.cos(th)*L;
  s+=arrow(px,py,px+vx,py+vy,{color:C.v,w:4,opacity:.55});
  s+=fade(seg(p,.1,.3),arrow(px+vx,py,px+vx,py+vy,{color:SN,w:6}))+fade(seg(p,.1,.3),line(px,py,px+vx,py,{color:C.dim,w:2,dash:'6 5'}));
  s+=fade(seg(p,.2,.35),label('高さが 変わる速さ',px+vx-14,py+vy/2-8,{size:24,color:SN,anchor:'end'})+label('＝ cosθ',px+vx-14,py+vy/2+24,{size:26,color:SN,anchor:'end',weight:700}));
  s+=card(640,140,520,250,label('だから',900,195,{size:26,color:C.dim,anchor:'middle'})+tex(`\\dfrac{d}{d\\theta}\\,${cs(SN,'\\sin\\theta')}=\\cos\\theta`,900,290,{size:56,auto:false}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'degderiv']:(p)=>{
  let s=label('角度を 度の数字 x で測ると',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.2),tex('\\sin x^\\circ=\\sin\\!\\left(\\dfrac{\\pi}{180}\\,x\\right)',600,160,{size:50,auto:false}));
  s+=fade(seg(p,.45,.6),tex(`\\dfrac{d}{dx}\\sin x^\\circ=\\cos x^\\circ\\times${cs(C.a,'\\dfrac{\\pi}{180}')}`,600,310,{size:50,auto:false}));
  s+=fade(seg(p,.45,.6),label('外を微分',470,390,{size:24,color:C.dim,anchor:'middle'})+label('中を微分',830,390,{size:24,color:C.a,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('余分な倍率 π/180 ≈ 0.0175',600,460,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'clean']:(p)=>{
  let s=card(120,70,960,190,label('ラジアンなら 余分な倍率 ＝ 1',600,120,{size:30,color:C.hi,anchor:'middle',weight:700})+tex('\\dfrac{d}{d\\theta}\\sin\\theta=\\cos\\theta',600,215,{size:44,auto:false}),seg(p,0,.2),C.hi);
  s+=fade(seg(p,.5,.65),label('前回',150,320,{size:24,color:C.dim}));
  s+=fade(seg(p,.5,.65),tex('\\dfrac{d}{dt}A\\sin(\\omega t+\\varphi)=A\\omega\\cos(\\omega t+\\varphi)',640,380,{size:44}));
  return s;
 },
 // ===== S5 次の問い =====
 [K+'summary']:(p)=>{
  let s=label('まとめ',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(100,100,1000,110,defTex(330,170,44)+label('弧の長さ ÷ 半径',720,165,{size:30,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=card(100,225,1000,110,label('1 rad：半径と同じ長さの弧（≈ 57.3°）',600,290,{size:30,color:C.ink,anchor:'middle'}),seg(p,.35,.5));
  s+=card(100,350,1000,110,tex('\\pi\\ \\mathrm{rad}=180^\\circ,\\qquad 2\\pi\\ \\mathrm{rad}=360^\\circ',600,410,{size:46,auto:false}),seg(p,.65,.8));
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=label('まとめ',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(100,100,1000,110,tex(`${cs(S_,'s')}=${cs(R_,'r')}\\,\\theta`,300,160,{size:52,auto:false})+label('θ はラジアンで 入れる',720,165,{size:30,color:C.hi,anchor:'middle'}),seg(p,0,.15));
  s+=card(100,225,1000,110,label('半径 1 の円：角度 ＝ 弧の長さ',600,290,{size:30,color:S_,anchor:'middle'}),seg(p,.4,.55));
  s+=card(100,350,1000,110,tex('\\dfrac{d}{d\\theta}\\sin\\theta=\\cos\\theta',380,418,{size:38,auto:false})+label('余分な倍率なし',820,415,{size:30,color:C.ink,anchor:'middle'}),seg(p,.65,.8));
  return s;
 },
 [K+'zoom']:(p)=>{
  const cx=250,cy=400,R=320,th=.12,[px,py]=P(cx,cy,R,th);
  let s=arc(cx,cy,R,-.05,.5,{color:C.faint,w:2})+line(cx,cy,cx+R+30,cy,{color:C.dim,w:2})+line(cx,cy,px,py,{color:R_,w:3})+dot(cx,cy,6,C.dim);
  s+=arc(cx,cy,R,0,th,{color:S_,w:6})+line(px,py,px,cy,{color:SN,w:6});
  const g=seg(p,.2,.4);
  // magnifier: circle at the small-angle region with a scaled copy
  const mx=880,my=260,mr=200,k=4.5,ox=(px+cx+R)/2,oy=(py+cy)/2;
  const Z=(x,y)=>[mx+(x-ox)*k,my+(y-oy)*k];
  let inner='';
  const a0=0;
  const arcZ=Array.from({length:40},(_,i)=>{const [x,y]=P(cx,cy,R,a0+(th-a0)*i/39);return Z(x,y);});
  // straight height segment in zoom
  inner+=`<clipPath id="mag1"><circle cx="${mx}" cy="${my}" r="${mr}"/></clipPath>`;
  const [hx1,hy1]=Z(px,py),[hx2,hy2]=Z(px,cy);
  inner+=`<g clip-path="url(#mag1)">${draw(arcZ,1,{color:S_,w:8})}${line(hx1,hy1,hx2,hy2,{color:SN,w:8})}</g>`;
  s+=fade(g,line(px+20,oy-20,mx-mr*.72,my-mr*.4,{color:C.dim,w:2,dash:'6 6'})+ring(ox,oy,30,{color:C.hi,w:3})+ring(mx,my,mr,{color:C.hi,w:4,fill:'#0f1830'})+inner);
  s+=fade(seg(p,.45,.6),label('高さ sinθ',mx-30,my+mr+36,{size:26,color:SN,anchor:'end',weight:700})+label('弧 θ',mx+30,my+mr+36,{size:26,color:S_,weight:700}));
  s+=fade(seg(p,.7,.85),label('ほとんど 同じ長さ',mx,my-mr-16,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(160,110,880,280,label('次の問い',600,165,{size:26,color:C.dim,anchor:'middle'})
   +label('θ と sinθ は どれくらい 同じ？',600,235,{size:36,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),tex(`${cs(S_,'0.1')}`,470,320,{size:48,auto:false})+label('と',560,330,{size:32,color:C.ink,anchor:'middle'})+tex(`${cs(SN,'\\sin 0.1')}`,690,320,{size:48,auto:false})),seg(p,0,.2),C.hi);
  s+=fade(seg(p,.55,.7),label('差は いくつ？',600,450,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
};
