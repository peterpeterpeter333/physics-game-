// YouTube シリーズ「積分・初級 1/2」(ys-ui-area-is-distance-1) — 図。Stage 1200×515.
// 色（anim.mjs C）：位置・距離 x 水色、速さ v 紫、時刻・時間 t 金、強調 黄、誤り 赤、正しい 緑。
// 面積（＝距離）は水色で塗る。高さ（速さ）は紫、幅（時間）は金。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,cart} from './anim.mjs';

const K='ui-area-is-distance-1:';
export const cV=s=>`{\\color{${C.v}}{${s}}}`,cT=s=>`{\\color{${C.t}}{${s}}}`,cX=s=>`{\\color{${C.x}}{${s}}}`,cI=s=>`{\\color{${C.ink}}{${s}}}`;
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
// v–t axes (time gold, speed purple)
export function vt({x=110,y=430,w=520,h=300,xmax=4.6,ymax=4.8,xticks=[1,2,3,4],yticks=[1,2,3,4],g=1,ymin=0}={}){
 return axes({x,y,w,h,xmax,ymax,ymin,xticks,yticks,grid:true,g,xlabel:'時刻 t [s]',ylabel:'速さ v [m/s]',xcolor:C.t,ycolor:C.v});
}
// a bar (rectangle between the time axis and height v) growing from its left side with g
export function bar(A,t0,t1,v,{g=1,color=C.x,fo=.3,sw=2}={}){
 if(g<=0.001)return '';
 const x=A.X(t0),w=(A.X(t1)-x)*clamp(g),y0=A.Y(0),y1=A.Y(v);
 return rect(x,Math.min(y0,y1),w,Math.abs(y1-y0),{fill:color,fo,stroke:color,sw,rx:2});
}
// step graph line through pieces [[t0,t1,v],...], drawn with p
export function steps(A,pieces,{p=1,color=C.v,w=5}={}){
 const pts=[];pieces.forEach(([a,b,v],i)=>{if(i>0)pts.push([A.X(a),A.Y(pieces[i-1][2])]);pts.push([A.X(a),A.Y(v)],[A.X(b),A.Y(v)]);});
 let s='';let L=0;const segs=[];for(let i=1;i<pts.length;i++)segs.push([pts[i-1],pts[i]]);
 const n=segs.length,shown=clamp(p)*n;
 segs.forEach(([a,b],i)=>{const u=clamp(shown-i);if(u>0)s+=line(a[0],a[1],mix(a[0],b[0],u),mix(a[1],b[1],u),{color,w});});
 return s;
}
// straight road with metre ticks; returns {svg,X}
export function road(x0,x1,y,mmax,{labels=[],g=1,unit=true}={}){
 const X=m=>x0+(x1-x0)*m/mmax;
 let s=line(x0-10,y,x1+20,y,{color:C.dim,w:3});
 for(let m=0;m<=mmax;m++)s+=line(X(m),y-6,X(m),y+6,{color:C.faint,w:2});
 for(const m of labels)s+=line(X(m),y-10,X(m),y+10,{color:C.dim,w:3})+label(String(m),X(m),y+38,{size:22,color:C.x,anchor:'middle'});
 if(unit)s+=label('[m]',x1+30,y+38,{size:22,color:C.x});
 return {svg:fade(g,s),X};
}
export const car=(x,y,g=1)=>fade(g,cart(x,y,{w:84,h:38,color:C.x}));
const ok=C.F,bad=C.a;

// graph pieces of the example: 2, 3, 4 m/s for 1 s each
const P3=[[0,1,2],[1,2,3],[2,3,4]];
const vt3=(o={})=>vt({x:110,y:430,w:470,h:300,xmax:3.7,ymax:4.8,xticks:[1,2,3],yticks:[1,2,3,4],...o});
const vt3s=(o={})=>vt({x:90,y:300,w:300,h:190,xmax:3.6,ymax:4.8,xticks:[1,2,3],yticks:[2,4],...o});
// right-hand panel of the constant-speed graph starts at x=860
const R=860;

function fracMS(cancel){ // 3 m/s × 4 s = 12 m, optionally with s cancelled
 const s1=cancel?`{\\color{${bad}}\\cancel{${cV('\\mathrm{s}')}}}`:cV('\\mathrm{s}');
 const s2=cancel?`{\\color{${bad}}\\cancel{${cT('\\mathrm{s}')}}}`:cT('\\mathrm{s}');
 return cV('3\\,')+cV('\\dfrac{\\mathrm{m}}{')+s1+cV('}')+'\\times'+cT('4\\,')+s2+'='+cX('12\\,\\mathrm{m}');
}

export const ytUiArea1Diagrams={
 // ===== S1 前回の問い =====
 [K+'intro']:(p)=>{
  let s=card(90,90,450,300,label('前回（微分）',315,145,{size:28,color:C.dim,anchor:'middle'})
   +label('位置の変わり方',315,225,{size:32,color:C.x,anchor:'middle',weight:700})
   +arrow(315,250,315,305,{color:C.dim,w:4})+label('速さ',315,355,{size:34,color:C.v,anchor:'middle',weight:700}),seg(p,0,.15));
  s+=card(660,90,450,300,label('今回（積分）',885,145,{size:28,color:C.hi,anchor:'middle'})
   +label('速さ',885,225,{size:34,color:C.v,anchor:'middle',weight:700})
   +arrow(885,250,885,305,{color:C.hi,w:4})+label('進んだ距離 ？',885,355,{size:34,color:C.x,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  s+=fade(seg(p,.45,.6),label('逆向き',600,250,{size:26,color:C.hi,anchor:'middle'})+arrow(560,270,640,270,{color:C.hi,w:3,head:12}));
  return s;
 },
 [K+'car']:(p)=>{
  const {svg,X}=road(120,1060,330,12,{labels:[0]});
  let s=svg+car(X(0),330)+fade(seg(p,.35,.5),arrow(X(0)+50,270,X(0)+190,270,{color:C.v,w:5})+label('秒速 3 m/s',X(0)+210,280,{size:30,color:C.v,weight:700}));
  s+=fade(seg(p,.35,.5),label('速さは ずっと同じ',X(0)+210,230,{size:24,color:C.dim}));
  s+=fade(seg(p,.6,.75),card(760,90,300,110,label('時間',910,135,{size:24,color:C.dim,anchor:'middle'})+label('4 s',910,180,{size:36,color:C.t,anchor:'middle',weight:700})));
  s+=fade(seg(p,0,.2),label('まっすぐな道',120,440,{size:24,color:C.dim}));
  return s;
 },
 [K+'predict']:(p)=>{
  const {svg,X}=road(120,1060,330,12,{labels:[0]});
  let s=svg+car(X(0),330)+label('秒速 3 m/s',X(0)+60,280,{size:26,color:C.v})+label('4 s',X(0)+240,280,{size:26,color:C.t});
  s+=card(640,90,420,150,label('4秒後、車は どこ？',850,150,{size:32,color:C.ink,anchor:'middle',weight:700})+label('予想してみよう',850,205,{size:26,color:C.hi,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.2,.4),label('？',X(10),300,{size:44,color:C.hi,anchor:'middle',weight:700})+line(X(10),315,X(10),345,{color:C.hi,w:3,dash:'6 5'}));
  return s;
 },
 // ===== S2 速さ×時間 =====
 [K+'steps']:(p)=>{
  const {svg,X}=road(120,1060,300,12,{labels:[0,3,6,9,12]});
  // car advances 3 m per second in four hops, synchronized with the four phrases
  const hop=[[.12,.28],[.34,.5],[.56,.72],[.78,.94]];let m=0;hop.forEach(([a,b])=>m+=3*seg(p,a,b));
  let s=svg+car(X(m),300);
  hop.forEach(([a,b],i)=>{const g=seg(p,a,b);s+=fade(g,line(X(3*i),345,X(3*i+3),345,{color:C.x,w:6})
   +label(`${i+1} s`,X(3*i+3),400,{size:26,color:C.t,anchor:'middle'})+label(`${3*i+3} m`,X(3*i+3),440,{size:28,color:C.x,anchor:'middle',weight:700}));});
  s+=label('1秒ごとに 3 m',120,110,{size:30,color:C.ink})+fade(seg(p,0,.1),label('時刻',60,400,{size:22,color:C.t})+label('位置',60,440,{size:22,color:C.x}));
  return s;
 },
 [K+'mult']:(p)=>{
  const {svg,X}=road(150,1000,130,12,{labels:[0,12]});
  let s=svg+car(X(12),130);
  for(let i=0;i<4;i++)s+=line(X(3*i)+3,195,X(3*i+3)-3,195,{color:C.x,w:6})+label('3 m',(X(3*i)+X(3*i+3))/2,230,{size:24,color:C.x,anchor:'middle'});
  s+=fade(seg(p,.1,.3),label('3 m が 4回分',575,290,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),tex(cV('3\\,\\mathrm{m/s}')+'\\times'+cT('4\\,\\mathrm{s}'),520,390,{size:54,auto:false}));
  s+=fade(seg(p,.4,.55),label('速さ',400,470,{size:26,color:C.v,anchor:'middle'})+label('時間',640,470,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),tex('='+cX('12\\,\\mathrm{m}'),520+texWidth('3\\,\\mathrm{m/s}\\times4\\,\\mathrm{s}',54,false)/2+100,390,{size:54,auto:false}));
  return s;
 },
 [K+'delta']:(p)=>{
  let s=tex('\\Delta x=v\\,\\Delta t',600,140,{size:70});
  s+=fade(seg(p,.35,.5),card(160,220,880,80,label('Δ（デルタ）：変化した分 の印',600,272,{size:32,color:C.hi,anchor:'middle',weight:700})));
  s+=fade(seg(p,.6,.72),label('Δx：進んだ距離 [m]',160,380,{size:30,color:C.x}));
  s+=fade(seg(p,.64,.76),label('v：速さ [m/s]',510,380,{size:30,color:C.v}));
  s+=fade(seg(p,.8,.92),label('Δt：かかった時間 [s]',760,380,{size:30,color:C.t}));
  s+=fade(seg(p,.85,.97),tex(cX('12')+'='+cV('3')+'\\times'+cT('4'),600,460,{size:40,auto:false}));
  return s;
 },
 [K+'unit']:(p)=>{
  const g=seg(p,.55,.7);
  let s=label('単位も 一緒に掛ける',600,90,{size:30,color:C.ink,anchor:'middle'});
  s+=fade(1-g,tex(fracMS(false),600,260,{size:64,auto:false}))+fade(g,tex(fracMS(true),600,260,{size:64,auto:false}));
  s+=fade(seg(p,.15,.3),label('メートル毎秒',420,400,{size:26,color:C.v,anchor:'middle'})+label('秒',640,400,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('s が約分されて m が残る',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit2']:(p)=>{
  let s=tex(fracMS(true),600,200,{size:56,auto:false});
  const w=texWidth(fracMS(true),56,false),xe=600+w/2;
  s+=highlight(xe-122,140,142,100,seg(p,.1,.3));
  s+=fade(seg(p,.35,.55),label('答えの単位が m（メートル）',600,360,{size:32,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('→ 掛け算で出たのは 距離',600,430,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 グラフの面積 =====
 [K+'vtaxes']:(p)=>{
  const A=vt({g:seg(p,0,.3)});
  let s=A.svg;
  s+=fade(seg(p,.4,.6),label('横軸：時刻 t [s]',R,190,{size:28,color:C.t}));
  s+=fade(seg(p,.65,.85),label('縦軸：速さ v [m/s]',R,250,{size:28,color:C.v}));
  return s;
 },
 [K+'vtline']:(p)=>{
  const A=vt();
  let s=A.svg+A.plot(()=>3,{from:0,to:4.3,p:seg(p,.25,.7),color:C.v,w:5});
  s+=fade(seg(p,.1,.25),label('秒速 3 m/s',R,190,{size:30,color:C.v,weight:700})+label('のまま',R,235,{size:26,color:C.dim}));
  s+=fade(seg(p,.6,.8),label('高さ 3 の 水平な線',R,310,{size:30,color:C.v}));
  return s;
 },
 [K+'rect']:(p)=>{
  const A=vt();
  let s=A.svg+bar(A,0,4,3,{g:seg(p,.2,.6)})+A.plot(()=>3,{from:0,to:4.3,color:C.v,w:5});
  s+=fade(seg(p,.55,.75),line(A.X(4)+22,A.Y(0),A.X(4)+22,A.Y(3),{color:C.v,w:4})+label('縦 3',A.X(4)+34,A.Y(1.5)+8,{size:26,color:C.v}));
  s+=fade(seg(p,.7,.9),line(A.X(0),A.Y(0),A.X(4),A.Y(0),{color:C.t,w:7})+label('横 4',A.X(2),A.Y(0)-16,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),label('0 s から 4 s まで',R,190,{size:28,color:C.t}));
  s+=fade(seg(p,.4,.6),label('線の下を 塗る',R,240,{size:28,color:C.x}));
  s+=fade(seg(p,.8,.95),label('→ 長方形',R,300,{size:32,color:C.ink,weight:700}));
  return s;
 },
 [K+'match']:(p)=>{
  const A=vt();
  let s=A.svg+bar(A,0,4,3)+A.plot(()=>3,{from:0,to:4.3,color:C.v,w:5});
  s+=line(A.X(4)+22,A.Y(0),A.X(4)+22,A.Y(3),{color:C.v,w:4})+label('縦 3',A.X(4)+34,A.Y(1.5)+8,{size:26,color:C.v});
  s+=line(A.X(0),A.Y(0),A.X(4),A.Y(0),{color:C.t,w:7})+label('横 4',A.X(2),A.Y(0)-16,{size:26,color:C.t,anchor:'middle'});
  s+=fade(seg(p,.45,.6),label('12',(A.X(0)+A.X(4))/2,A.Y(1.5)+14,{size:44,color:C.x,anchor:'middle',weight:700}));
  const rows=[[.02,.15,'縦 3','＝ 3 m/s',C.v],[.18,.3,'横 4','＝ 4 s',C.t],[.4,.55,'面積 12','＝ 12 m',C.x]];
  rows.forEach(([a,b,l,r,c],i)=>{s+=fade(seg(p,a,b),label(l,R-20,180+i*62,{size:30,color:c,weight:700})+label(r,R+120,180+i*62,{size:30,color:c}));});
  s+=fade(seg(p,.62,.78),card(R-40,350,340,120,tex(cV('3')+'\\times'+cT('4')+'='+cX('12'),R+130,400,{size:44,auto:false})
   +label('距離も 面積も 同じ掛け算',R+130,452,{size:22,color:C.hi,anchor:'middle'}),1,C.hi));
  return s;
 },
 [K+'unitarea']:(p)=>{
  const A=vt();
  let s=A.svg+bar(A,0,4,3)+A.plot(()=>3,{from:0,to:4.3,color:C.v,w:5})+label('12',(A.X(0)+A.X(4))/2,A.Y(1.5)+14,{size:44,color:C.x,anchor:'middle',weight:700});
  s+=line(A.X(4)+22,A.Y(0),A.X(4)+22,A.Y(3),{color:C.v,w:4})+label('m/s',A.X(4)+34,A.Y(1.5)+8,{size:26,color:C.v});
  s+=line(A.X(0),A.Y(0),A.X(4),A.Y(0),{color:C.t,w:7})+label('s',A.X(2),A.Y(0)-16,{size:26,color:C.t,anchor:'middle'});
  s+=fade(seg(p,.05,.2),label('面積の単位',R-20,160,{size:28,color:C.dim}));
  s+=fade(seg(p,.2,.4),label('縦：m/s',R-20,220,{size:30,color:C.v})); 
  s+=fade(seg(p,.35,.5),label('横：s',R+150,220,{size:30,color:C.t}));
  s+=fade(seg(p,.5,.7),tex(cV('\\mathrm{\\tfrac{m}{s}}')+'\\times'+cT('\\mathrm{s}')+'='+cX('\\mathrm{m}'),R+110,320,{size:50,auto:false}));
  s+=fade(seg(p,.75,.9),label('距離の単位と 一致 ✓',R-20,420,{size:30,color:ok,weight:700}));
  return s;
 },
 [K+'rule']:(p)=>{
  const A=vt();
  let s=A.svg+bar(A,0,4,3,{fo:.3+.15*seg(p,.2,.5)})+A.plot(()=>3,{from:0,to:4.3,color:C.v,w:5});
  s+=fade(seg(p,.3,.5),label('面積 ＝ 距離',(A.X(0)+A.X(4))/2,A.Y(1.5)+12,{size:34,color:C.x,anchor:'middle',weight:700}));
  s+=card(R-40,150,340,220,label('速さと時間の',R+130,205,{size:28,color:C.ink,anchor:'middle'})+label('グラフでは',R+130,245,{size:28,color:C.ink,anchor:'middle'})
   +label('線の下の面積',R+130,300,{size:30,color:C.x,anchor:'middle',weight:700})+label('＝ 進んだ距離',R+130,345,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'check2']:(p)=>{
  const A=vt();
  let s=A.svg+bar(A,0,4,3,{color:C.faint,fo:.25})+bar(A,0,2,3,{g:seg(p,.1,.35)})+A.plot(()=>3,{from:0,to:4.3,color:C.v,w:5});
  s+=fade(seg(p,.25,.4),label('3 × 2 ＝ 6',(A.X(0)+A.X(2))/2,A.Y(1.5)+10,{size:30,color:C.x,anchor:'middle',weight:700}));
  const {svg,X}=road(R-60,1150,300,12,{labels:[0,6,12],unit:false});
  const m=6*seg(p,.5,.75);
  s+=fade(seg(p,.45,.55),svg+car(X(m),300)+label('1秒に 3 m ずつ',R-60,190,{size:26,color:C.ink}));
  s+=fade(seg(p,.72,.85),label('2 s で 6 m',X(6),390,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.85,.97),label('一致 ✓',X(6),440,{size:30,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 速さが変わるとき =====
 [K+'steps3']:(p)=>{
  const A=vt3();
  let s=A.svg+steps(A,P3,{p:seg(p,.2,.9)});
  const lab=[[.25,.4],[.5,.65],[.75,.9]];
  P3.forEach(([a,b,v],i)=>{s+=fade(seg(p,...lab[i]),label(`${v} m/s`,(A.X(a)+A.X(b))/2,A.Y(v)-16,{size:24,color:C.v,anchor:'middle',weight:700})+label(`${a}〜${b} s`,780,170+i*60,{size:28,color:C.t})+label(`秒速 ${v} m/s`,920,170+i*60,{size:28,color:C.v}));});
  return s;
 },
 [K+'which']:(p)=>{
  const A=vt3();
  let s=A.svg+steps(A,P3);
  for(const v of [2,3,4])s+=fade(seg(p,.1,.35),line(A.X(0),A.Y(v),A.X(3.4),A.Y(v),{color:C.hi,w:2,dash:'6 6'})+label('？',A.X(3.4)+14,A.Y(v)+10,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.1,.25),label('階段の形',780,170,{size:30,color:C.v}));
  s+=card(740,230,400,130,label('掛ける 速さ が',940,285,{size:30,color:C.ink,anchor:'middle'})+label('一つに 決まらない',940,335,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'wrong']:(p)=>{
  const A=vt3();
  let s=A.svg+bar(A,0,1,2,{g:1,fo:.25})+bar(A,1,2,3,{fo:.25})+bar(A,2,3,4,{fo:.25});
  const g=seg(p,.05,.3);
  s+=fade(g,rect(A.X(0),A.Y(4),A.X(3)-A.X(0),A.Y(0)-A.Y(4),{fill:'none',fo:0,stroke:bad,sw:3,rx:2}).replace('fill="none"','fill="none" stroke-dasharray="10 7"'));
  s+=steps(A,P3);
  s+=fade(seg(p,.2,.35),label('4 × 3 ＝ 12 m',780,170,{size:32,color:bad,weight:700}));
  const g2=seg(p,.55,.75);
  s+=fade(g2,rect(A.X(0),A.Y(4),A.X(1)-A.X(0),A.Y(2)-A.Y(4),{fill:bad,fo:.35,stroke:bad,sw:0,rx:0})+rect(A.X(1),A.Y(4),A.X(2)-A.X(1),A.Y(3)-A.Y(4),{fill:bad,fo:.35,stroke:bad,sw:0,rx:0}));
  s+=fade(g2,label('遅かった 最初の2秒も',780,250,{size:28,color:C.ink})+label('4 m/s にしてしまう',780,295,{size:28,color:C.ink}));
  s+=fade(seg(p,.8,.95),label('✕ 多すぎる',780,370,{size:32,color:bad,weight:700}));
  return s;
 },
 [K+'cut']:(p)=>{
  const A=vt3();
  let s=A.svg+steps(A,P3);
  for(const t of [1,2])s+=line(A.X(t),A.Y(0),A.X(t),mix(A.Y(0),A.Y(4.6),seg(p,.1,.35)),{color:C.t,w:3,dash:'8 6'});
  P3.forEach(([a,b],i)=>{s+=fade(seg(p,.3+i*.06,.4+i*.06),label(`区間${i+1}`,(A.X(a)+A.X(b))/2,A.Y(4.5)+6,{size:24,color:C.t,anchor:'middle'}));});
  s+=card(740,170,400,190,label('作戦',940,220,{size:26,color:C.dim,anchor:'middle'})+label('時間を 区間に 切り分ける',940,275,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('区間の中では 速さ一定',940,330,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'cutwhere']:(p)=>{
  const A=vt3();
  let s=A.svg+steps(A,P3);
  for(const t of [1,2])s+=line(A.X(t),A.Y(0),A.X(t),A.Y(4.6),{color:C.t,w:3,dash:'8 6'})+fade(seg(p,.2,.4),ring(A.X(t),A.Y(t+1.5),12,{color:C.hi,w:3}));
  s+=fade(seg(p,.2,.4),label('1 s',A.X(1),A.Y(0)+62,{size:24,color:C.t,anchor:'middle'})+label('2 s',A.X(2),A.Y(0)+62,{size:24,color:C.t,anchor:'middle'}));
  s+=card(740,150,400,230,label('区切る場所',940,200,{size:26,color:C.dim,anchor:'middle'})+label('速さが 変わる 時刻',940,255,{size:30,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.55,.75),label('どの区間でも',940,315,{size:28,color:C.ink,anchor:'middle'})+label('速さは 一つ',940,355,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'piece1']:(p)=>{
  const A=vt3();
  let s=A.svg+bar(A,0,1,2,{g:seg(p,.3,.55)})+steps(A,P3,{color:C.faint})+line(A.X(0),A.Y(2),A.X(1),A.Y(2),{color:C.v,w:5});
  s+=fade(seg(p,.05,.2),label('区間1：0〜1 s',760,150,{size:28,color:C.t}));
  s+=fade(seg(p,.15,.3),label('ずっと 秒速 2 m/s',760,200,{size:28,color:C.v}));
  s+=fade(seg(p,.55,.75),tex(cV('2\\,\\mathrm{m/s}')+'\\times'+cT('1\\,\\mathrm{s}')+'='+cX('2\\,\\mathrm{m}'),930,300,{size:40,auto:false}));
  s+=fade(seg(p,.6,.8),label('2',(A.X(0)+A.X(1))/2,A.Y(1)+10,{size:32,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'index']:(p)=>{
  const A=vt3();
  let s=A.svg+bar(A,0,1,2)+steps(A,P3,{color:C.faint})+line(A.X(0),A.Y(2),A.X(1),A.Y(2),{color:C.v,w:5})+label('2',(A.X(0)+A.X(1))/2,A.Y(1)+10,{size:32,color:C.x,anchor:'middle',weight:700});
  s+=tex(cV('2\\,\\mathrm{m/s}')+'\\times'+cT('1\\,\\mathrm{s}')+'='+cX('2\\,\\mathrm{m}'),930,300,{size:40,auto:false});
  s+=fade(seg(p,.05,.25),tex('\\Delta x_1=v_1\\,\\Delta t_1',930,180,{size:54}));
  s+=fade(seg(p,.55,.75),card(770,370,380,90,label('小さな 1 ＝ 1番目の区間',960,425,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'piece2']:(p)=>{
  const A=vt3();
  let s=A.svg+bar(A,0,1,2)+bar(A,1,2,3,{g:seg(p,.3,.55)})+steps(A,P3,{color:C.faint})+steps(A,P3.slice(0,2));
  s+=label('2',(A.X(0)+A.X(1))/2,A.Y(1)+10,{size:32,color:C.x,anchor:'middle',weight:700});
  s+=fade(seg(p,.55,.7),label('3',(A.X(1)+A.X(2))/2,A.Y(1.5)+10,{size:32,color:C.x,anchor:'middle',weight:700}));
  s+=tex('\\Delta x_1='+cV('2')+'\\times'+cT('1')+'='+cX('2\\,\\mathrm{m}'),930,170,{size:40,auto:false,color:C.ink});
  s+=fade(seg(p,.1,.3),label('区間2：秒速 3 m/s で 1 s',760,245,{size:26,color:C.dim}));
  s+=fade(seg(p,.45,.65),tex('\\Delta x_2='+cV('3')+'\\times'+cT('1')+'='+cX('3\\,\\mathrm{m}'),930,310,{size:40,auto:false,color:C.ink}));
  return s;
 },
 [K+'piece3']:(p)=>{
  const A=vt3();
  let s=A.svg+bar(A,0,1,2)+bar(A,1,2,3)+bar(A,2,3,4,{g:seg(p,.3,.55)})+steps(A,P3);
  s+=label('2',(A.X(0)+A.X(1))/2,A.Y(1)+10,{size:32,color:C.x,anchor:'middle',weight:700})+label('3',(A.X(1)+A.X(2))/2,A.Y(1.5)+10,{size:32,color:C.x,anchor:'middle',weight:700});
  s+=fade(seg(p,.55,.7),label('4',(A.X(2)+A.X(3))/2,A.Y(2)+10,{size:32,color:C.x,anchor:'middle',weight:700}));
  s+=tex('\\Delta x_1='+cV('2')+'\\times'+cT('1')+'='+cX('2\\,\\mathrm{m}'),930,150,{size:40,auto:false,color:C.ink});
  s+=tex('\\Delta x_2='+cV('3')+'\\times'+cT('1')+'='+cX('3\\,\\mathrm{m}'),930,250,{size:40,auto:false,color:C.ink});
  s+=fade(seg(p,.45,.65),tex('\\Delta x_3='+cV('4')+'\\times'+cT('1')+'='+cX('4\\,\\mathrm{m}'),930,350,{size:40,auto:false,color:C.ink}));
  return s;
 },
 [K+'widths']:(p)=>{
  const A=vt3();
  let s=A.svg+bar(A,0,1,2)+bar(A,1,2,3)+bar(A,2,3,4)+steps(A,P3);
  P3.forEach(([a,b,v])=>{s+=fade(seg(p,.05,.3),line(A.X(a)+5,A.Y(0),A.X(b)-5,A.Y(0),{color:C.t,w:7})+label('1 s',(A.X(a)+A.X(b))/2,A.Y(0)-14,{size:22,color:C.t,anchor:'middle'}));
   s+=fade(seg(p,.4,.6),label(String(v),(A.X(a)+A.X(b))/2,A.Y(v/2)+10,{size:32,color:C.x,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.05,.3),label('幅は どれも 1 s',760,190,{size:30,color:C.t}));
  s+=fade(seg(p,.35,.55),label('高さ 2・3・4 が違う',760,260,{size:30,color:C.v}));
  s+=fade(seg(p,.6,.8),label('→ 面積も 2・3・4',760,330,{size:32,color:C.x,weight:700}));
  return s;
 },
 // ===== S5 積み上げる =====
 ...stackScene(),
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  const A=vt({x:90,y:380,w:380,h:230,xmax:4.6,ymax:4.8,xticks:[4],yticks:[3]});
  let s=fade(seg(p,0,.2),A.svg+bar(A,0,4,3)+A.plot(()=>3,{from:0,to:4.3,color:C.v,w:4})+label('3 × 4 ＝ 12',A.X(2),A.Y(1.5)+10,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),label('速さ一定：掛け算 1回',90,460,{size:28,color:C.ink})+label('＝ 長方形の面積',90,500,{size:28,color:C.x}));
  return s;
 },
 [K+'sum2']:(p)=>{
  const A=vt({x:90,y:380,w:380,h:230,xmax:4.6,ymax:4.8,xticks:[4],yticks:[3]});
  let s=A.svg+bar(A,0,4,3)+A.plot(()=>3,{from:0,to:4.3,color:C.v,w:4})+label('3 × 4 ＝ 12',A.X(2),A.Y(1.5)+10,{size:28,color:C.x,anchor:'middle',weight:700});
  s+=label('速さ一定：掛け算 1回',90,460,{size:28,color:C.ink})+label('＝ 長方形の面積',90,500,{size:28,color:C.x});
  const B=vt({x:700,y:380,w:360,h:230,xmax:3.6,ymax:4.8,xticks:[1,2,3],yticks:[2,4],g:seg(p,0,.2)});
  s+=B.svg;P3.forEach(([a,b,v],i)=>{s+=bar(B,a,b,v,{g:seg(p,.2+i*.12,.32+i*.12)});});s+=fade(seg(p,0,.2),steps(B,P3,{w:4}));
  s+=fade(seg(p,.6,.75),label('2 ＋ 3 ＋ 4 ＝ 9',B.X(1.5),170,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),label('速さが変わる：区間に分けて',700,460,{size:28,color:C.ink})+label('長方形を 全部足す',700,500,{size:28,color:C.x}));
  return s;
 },
 [K+'next1']:(p)=>{
  const A=vt({x:90,y:400,w:500,h:280,xmax:3.3,ymax:4.8,xticks:[1,2,3],yticks:[2,4]});
  const n=Math.round(mix(3,30,seg(p,.1,.6))),w=3/n;
  let s=A.svg;for(let i=0;i<n;i++){const v=2+2*(i+.5)/n;s+=bar(A,i*w,(i+1)*w,v,{sw:1.5});}
  s+=fade(seg(p,.05,.2),label(`区間の数：${n}`,760,160,{size:30,color:C.t}));
  const terms=Math.min(n,4);let t='Δx ＝ ';for(let i=1;i<=terms;i++)t+=`Δx${'₁₂₃₄₅₆'[i-1]} ＋ `;
  s+=fade(seg(p,.3,.5),label(t+'…',690,250,{size:26,color:C.ink}));
  s+=fade(seg(p,.6,.8),card(790,310,370,110,label('長い足し算を',975,355,{size:28,color:C.ink,anchor:'middle'})+label('どう 短く書く？',975,398,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'next2']:(p)=>{
  const A=vt3();
  let s=A.svg+bar(A,0,1,2)+bar(A,1,2,3)+bar(A,2,3,4)+steps(A,P3)+label('面積 9',A.X(1.5),A.Y(1.2),{size:32,color:C.x,anchor:'middle',weight:700});
  s+=card(740,150,400,200,label('面積 ＝ 距離',940,215,{size:34,color:C.x,anchor:'middle',weight:700})+label('これは たまたま？',940,285,{size:32,color:C.hi,anchor:'middle',weight:700})
   +label('次回',940,330,{size:22,color:C.dim,anchor:'middle'}),seg(p,.1,.3),C.hi);
  return s;
 },
};

// S5: bars on the v–t graph are laid end to end on the road below/right, and the car follows.
function stackScene(){
 const G=()=>vt3s();
 const RD=()=>road(610,1110,300,10,{labels:[0,2,5,9,10].filter(m=>m!==10)});
 // how many of the three bars have been laid onto the road (0..3, fractional while moving)
 const laid=(A,X,k)=>{
  let s='';const ends=[0,2,5,9];
  P3.forEach(([a,b,v],i)=>{
   const u=clamp(k-i);s+=bar(A,a,b,v,{fo:.3+.3*(u>0&&u<1?1:0)});
   if(u>0){s+=line(X(ends[i])+2,300,X(mix(ends[i],ends[i+1],u))-2,300,{color:C.x,w:10});
    if(u>=1)s+=label(`${v} m`,(X(ends[i])+X(ends[i+1]))/2,270,{size:24,color:C.x,anchor:'middle',weight:700});}
  });
  const m=k<=0?0:k>=3?9:mix([0,2,5,9][Math.floor(k)],[0,2,5,9][Math.floor(k)+1],k-Math.floor(k));
  return s+steps(A,P3,{w:4})+car(X(m),230);
 };
 const base=(p,k,extra='')=>{const A=G(),{svg,X}=RD();return A.svg+svg+laid(A,X,k)+label('道',585,308,{size:24,color:C.dim,anchor:'end'})+extra;};
 const tally=(k,g=1)=>{
  let s=label('面積の合計',620,410,{size:26,color:C.x})+label('車の位置',620,460,{size:26,color:C.x});
  const vals=[2,5,9];for(let i=0;i<3;i++){const u=clamp(k-i);if(u>=1)s+=label(`${vals[i]}`,820+i*110,410,{size:30,color:C.x,anchor:'middle',weight:700})+label(`${vals[i]} m`,820+i*110,460,{size:30,color:C.x,anchor:'middle',weight:700})+(i<2&&clamp(k-i-1)>=1?label('→',875+i*110,435,{size:26,color:C.dim,anchor:'middle'}):'');}
  return fade(g,s);
 };
 return {
  [K+'sumq']:(p)=>base(p,0,card(610,70,500,100,label('三つの区間を 合わせると？',860,132,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi)),
  [K+'stack1']:(p)=>{const k=seg(p,.45,.85);return base(p,k,tally(k,seg(p,.3,.45))+fade(seg(p,.05,.25),label('長方形を 1本ずつ 道へ',620,120,{size:28,color:C.ink})));},
  [K+'stack2']:(p)=>{const k=1+seg(p,.1,.45)+seg(p,.55,.9);return base(p,k,tally(k)+label('長方形を 1本ずつ 道へ',620,120,{size:28,color:C.ink}));},
  [K+'sumform']:(p)=>{
   const A=vt3s();let s=A.svg+bar(A,0,1,2)+bar(A,1,2,3)+bar(A,2,3,4)+steps(A,P3,{w:4});
   P3.forEach(([a,b,v],i)=>{s+=label(`Δx${'₁₂₃'[i]}`,(A.X(a)+A.X(b))/2,A.Y(v)-12,{size:22,color:C.x,anchor:'middle'});});
   s+=fade(seg(p,.1,.25),label('全体の距離 ＝ 区間ごとの距離の和',520,140,{size:30,color:C.ink}));
   s+=fade(seg(p,.45,.7),tex('\\Delta x=\\Delta x_1+\\Delta x_2+\\Delta x_3',820,260,{size:52}));
   return s;
  },
  [K+'sumnum']:(p)=>{
   const A=vt3s();let s=A.svg+bar(A,0,1,2)+bar(A,1,2,3)+bar(A,2,3,4)+steps(A,P3,{w:4});
   P3.forEach(([a,b,v],i)=>{s+=label(`${v}`,(A.X(a)+A.X(b))/2,A.Y(v/2)+9,{size:26,color:C.x,anchor:'middle',weight:700});});
   s+=tex('\\Delta x=\\Delta x_1+\\Delta x_2+\\Delta x_3',820,160,{size:46});
   s+=fade(seg(p,.1,.35),tex('='+cX('2')+'+'+cX('3')+'+'+cX('4'),760,260,{size:46,auto:false,color:C.ink}));
   s+=fade(seg(p,.5,.7),tex('='+cX('9\\,\\mathrm{m}'),760,350,{size:52,auto:false,color:C.ink})+highlight(688,305,200,80,1));
   s+=fade(seg(p,.2,.4),label('数を入れる',960,260,{size:24,color:C.hi}));
   s+=fade(seg(p,.55,.75),label('足す',960,350,{size:24,color:C.hi}));
   return s;
  },
  [K+'same']:(p)=>base(p,3,tally(3)+card(610,60,520,90,label('面積の合計 ＝ 進んだ距離',870,117,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi)
    +highlight(605,380,540,100,seg(p,.1,.35))),
  [K+'avg']:(p)=>{
   const A=vt3();let s=A.svg+bar(A,0,1,2)+bar(A,1,2,3)+bar(A,2,3,4)+steps(A,P3);
   s+=fade(seg(p,.1,.25),label('確かめ：平均の速さ',760,150,{size:28,color:C.dim}));
   s+=fade(seg(p,.25,.45),tex('\\bar v=\\dfrac{'+cX('9\\,\\mathrm{m}')+'}{'+cT('3\\,\\mathrm{s}')+'}='+cV('3\\,\\mathrm{m/s}'),940,250,{size:44,auto:false,color:C.v}));
   s+=fade(seg(p,.5,.7),line(A.X(0),A.Y(3),A.X(3),A.Y(3),{color:C.hi,w:3,dash:'10 7'})+label('3',A.X(3)+14,A.Y(3)+8,{size:26,color:C.hi,weight:700}));
   s+=fade(seg(p,.6,.8),label('2、3、4 の 真ん中',760,360,{size:30,color:C.hi,weight:700}));
   return s;
  },
  [K+'quiz']:(p)=>{
   const Q=[[0,1,5],[1,2,1]];const A=vt({x:110,y:430,w:420,h:300,xmax:2.7,ymax:5.8,xticks:[1,2],yticks:[1,2,3,4,5]});
   let s=A.svg+steps(A,Q,{p:seg(p,.1,.6)});
   s+=fade(seg(p,.2,.35),label('5 m/s',A.X(.5),A.Y(5)-14,{size:24,color:C.v,anchor:'middle'}))+fade(seg(p,.4,.55),label('1 m/s',A.X(1.5),A.Y(1)-14,{size:24,color:C.v,anchor:'middle'}));
   s+=card(700,150,440,190,label('一問',920,200,{size:26,color:C.dim,anchor:'middle'})+label('2 s までに',920,255,{size:30,color:C.ink,anchor:'middle'})+label('何 m 進む？',920,305,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
   return s;
  },
  [K+'quiz2']:(p)=>{
   const Q=[[0,1,5],[1,2,1]];const A=vt({x:110,y:430,w:420,h:300,xmax:2.7,ymax:5.8,xticks:[1,2],yticks:[1,2,3,4,5]});
   let s=A.svg+bar(A,0,1,5,{g:seg(p,.05,.2)})+bar(A,1,2,1,{g:seg(p,.2,.35)})+steps(A,Q);
   s+=fade(seg(p,.1,.25),label('5',A.X(.5),A.Y(2.5)+10,{size:30,color:C.x,anchor:'middle',weight:700}))+fade(seg(p,.25,.4),label('1',A.X(1.5),A.Y(.5)+10,{size:26,color:C.x,anchor:'middle',weight:700}));
   s+=fade(seg(p,.05,.2),tex(cV('5')+'\\times'+cT('1')+'='+cX('5'),760,170,{size:40,auto:false,color:C.ink,anchor:'start'}));
   s+=fade(seg(p,.2,.35),tex(cV('1')+'\\times'+cT('1')+'='+cX('1'),760,240,{size:40,auto:false,color:C.ink,anchor:'start'}));
   s+=fade(seg(p,.35,.5),tex(cX('5')+'+'+cX('1')+'='+cX('6\\,\\mathrm{m}'),760,320,{size:44,auto:false,color:C.ink,anchor:'start'})+label('✓',1060,330,{size:34,color:ok,weight:700}));
   const g=seg(p,.6,.75);
   s+=fade(g,rect(A.X(0),A.Y(5),A.X(2)-A.X(0),A.Y(0)-A.Y(5),{fill:'none',fo:0,stroke:bad,sw:3,rx:2}).replace('fill="none"','fill="none" stroke-dasharray="10 7"'));
   s+=fade(g,label('5 × 2 ＝ 10 m ではない ✕',760,420,{size:28,color:bad,weight:700}));
   return s;
  },
  [K+'quiz3']:(p)=>{
   const Q=[[0,2,3],[2,5,1]];const A=vt({x:110,y:430,w:500,h:300,xmax:5.6,ymax:4.8,xticks:[1,2,3,4,5],yticks:[1,2,3,4]});
   let s=A.svg+steps(A,Q,{p:seg(p,.1,.55)});
   s+=fade(seg(p,.15,.3),label('3 m/s',A.X(1),A.Y(3)-14,{size:24,color:C.v,anchor:'middle'}))+fade(seg(p,.35,.5),label('1 m/s',A.X(3.5),A.Y(1)-14,{size:24,color:C.v,anchor:'middle'}));
   s+=fade(seg(p,.45,.6),line(A.X(0),A.Y(0),A.X(2),A.Y(0),{color:C.t,w:7})+label('幅 2 s',A.X(1),A.Y(0)-16,{size:22,color:C.t,anchor:'middle'})
     +line(A.X(2),A.Y(0),A.X(5),A.Y(0),{color:C.t,w:7,opacity:.7})+label('幅 3 s',A.X(3.5),A.Y(0)-16,{size:22,color:C.t,anchor:'middle'}));
   s+=card(780,150,370,190,label('もう一問',965,200,{size:26,color:C.dim,anchor:'middle'})+label('5 s までに',965,255,{size:30,color:C.ink,anchor:'middle'})+label('何 m 進む？',965,305,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
   return s;
  },
  [K+'quiz4']:(p)=>{
   const Q=[[0,2,3],[2,5,1]];const A=vt({x:110,y:430,w:500,h:300,xmax:5.6,ymax:4.8,xticks:[1,2,3,4,5],yticks:[1,2,3,4]});
   let s=A.svg+bar(A,0,2,3,{g:seg(p,.2,.35)})+bar(A,2,5,1,{g:seg(p,.4,.55)})+steps(A,Q);
   s+=fade(seg(p,.3,.4),label('6',A.X(1),A.Y(1.5)+10,{size:32,color:C.x,anchor:'middle',weight:700}))+fade(seg(p,.5,.6),label('3',A.X(3.5),A.Y(.5)+10,{size:28,color:C.x,anchor:'middle',weight:700}));
   s+=fade(seg(p,.05,.2),label('幅も 区間ごとに',790,150,{size:28,color:C.t}));
   s+=fade(seg(p,.25,.4),tex(cV('3')+'\\times'+cT('2')+'='+cX('6'),790,230,{size:40,auto:false,color:C.ink,anchor:'start'}));
   s+=fade(seg(p,.45,.6),tex(cV('1')+'\\times'+cT('3')+'='+cX('3'),790,300,{size:40,auto:false,color:C.ink,anchor:'start'}));
   s+=fade(seg(p,.65,.8),tex(cX('6')+'+'+cX('3')+'='+cX('9\\,\\mathrm{m}'),790,380,{size:44,auto:false,color:C.ink,anchor:'start'})+label('✓',1080,390,{size:34,color:ok,weight:700}));
   return s;
  },
 };
}
