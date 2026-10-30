// YouTube シリーズ 運動方程式・初級 1/2（ステージ ui-newton-small-step 補0〜補3・本0〜本3）— 図。Stage 1200×515.
// 色：位置 x 水色、速度 v 紫、加速度 a 赤、力 F 緑、時刻 t 金、強調 黄。箱は灰青（位置の色と混ぜない）。
// 力の矢印は 1 N ＝ 40 px、速度の矢印は 1 m/s ＝ 40 px（向きは右が正）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,ground,block,cart} from './anim.mjs';

const K='ui-newton-small-step-1:';
const BX='#9fb2d4';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700,anchor:'middle'}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700,anchor:'middle'}));
const cF=s=>`{\\color{${C.F}}{${s}}}`,cA=s=>`{\\color{${C.a}}{${s}}}`,cH=s=>`{\\color{${C.hi}}{${s}}}`,cV=s=>`{\\color{${C.v}}{${s}}}`;
const FS=40; // px per N
const VS=40; // px per m/s

// box on the floor. x = centre, y = floor line
function box(x,y,{w=130,h=100,text='2 kg',size=28,g=1}={}){return fade(g,block(x,y,w,h,{color:BX,text,size,fo:.25}));}
function fArrow(x,y,N,{g=1,text='',color=C.F,w=6,tsize=26,below=0}={}){
 if(Math.abs(N)<1e-6)return '';
 const X=x+N*FS;
 return fade(g,arrow(x,y,X,y,{color,w,head:18})+(text?label(text,X+(N>0?12:-12),y+(below?34:9),{size:tsize,color,anchor:N>0?'start':'end',weight:700}):''));
}
function vArrow(x,y,v,{g=1,text='',tsize=24}={}){
 if(Math.abs(v)<1e-6)return fade(g,dot(x,y,6,C.v)+(text?label(text,x+14,y+8,{size:tsize,color:C.v}):''));
 const X=x+v*VS;return fade(g,arrow(x,y,X,y,{color:C.v,w:5,head:16})+(text?label(text,X+(v>0?12:-12),y+8,{size:tsize,color:C.v,anchor:v>0?'start':'end',weight:700}):''));
}
// the pushed box of the example (2 kg, 4 N to the right)
function pushed(x,{y=380,g=1,fg=1,txt='4 N'}={}){return fade(g,ground(80,1120,y)+box(x,y)+fArrow(x+65,y-50,4,{g:fg,text:txt}));}

// x → v → a chain (same look as 振動の方程式・初級 1/2)
function chain(step,{y=120,g=1,deriv=1}={}){
 const X=[200,600,1000],names=['x','v','a'],cols=[C.x,C.v,C.a],sub=['位置','速度','加速度'];let s='';
 X.forEach((x,i)=>{const gi=i<=step?1:0;s+=fade(gi,ring(x,y,44,{color:cols[i],w:4,fill:'#10182c'})+label(names[i],x,y+13,{size:38,color:cols[i],anchor:'middle',weight:700})+label(sub[i],x,y+86,{size:26,color:cols[i],anchor:'middle'}));
  if(i>0&&i<=step)s+=arrow(X[i-1]+52,y,x-54,y,{color:C.dim,w:3,head:14})+fade(deriv,label('変わり方',(X[i-1]+x)/2,y-22,{size:24,color:C.t,anchor:'middle'}));});
 return fade(g,s);
}
// number line for position (metres)
const NX=u=>250+u*130;
function numberLine(y,{g=1,from=-1,to=6}={}){
 let s=arrow(NX(from)-20,y,NX(to)+40,y,{color:C.dim,w:2.5,head:14});
 for(let u=from;u<=to;u++)s+=line(NX(u),y-7,NX(u),y+7,{color:C.dim,w:2})+label(String(u),NX(u),y+34,{size:22,color:u===0?C.ink:C.dim,anchor:'middle'});
 s+=label('x [m]',NX(to)+50,y+8,{size:24,color:C.x});
 return fade(g,s);
}
function smallBox(u,y,{g=1,text='',ghost=0}={}){const x=NX(u);return fade(g,rect(x-32,y-58,64,52,{fill:BX,fo:ghost?.08:.25,stroke:ghost?C.faint:BX,rx:6})+(text?label(text,x,y-72,{size:22,color:C.t,anchor:'middle'}):''));}

// velocity table used in acc3 / meaning
function vRows(rows,{x0=700,y0=130,dy=56,g=1,step='+2'}={}){
 let s=label('t [s]',x0,y0,{size:24,color:C.t,anchor:'middle',weight:700})+label('v [m/s]',x0+180,y0,{size:24,color:C.v,anchor:'middle',weight:700})+line(x0-70,y0+16,x0+260,y0+16,{color:C.faint,w:2});
 rows.forEach(([t,v,gg],i)=>{const y=y0+dy*(i+1);s+=fade(gg,label(t,x0,y,{size:28,color:C.t,anchor:'middle'})+label(v,x0+180,y,{size:28,color:C.v,anchor:'middle',weight:700})+(i>0?label(step,x0+290,y-dy/2+8,{size:24,color:C.a,anchor:'start',weight:700}):''));});
 return fade(g,s);
}

// two force arrows on one box + tip-to-tail line below
const TX=u=>360+u*FS*1.5;
function tipToTail(p0,{y=455,g=1,res=1}={}){
 let s=line(TX(0),y-40,TX(0),y+36,{color:C.faint,w:2,dash:'6 6'})+label('0',TX(0),y+36+24,{size:22,color:C.dim,anchor:'middle'});
 s+=arrow(TX(0),y-18,TX(6),y-18,{color:C.F,w:6,head:18,g:seg(p0,0,.3)})+fade(seg(p0,.2,.3),label('＋6',TX(3),y-30,{size:24,color:C.F,anchor:'middle',weight:700}));
 s+=arrow(TX(6),y+10,TX(4),y+10,{color:C.F,w:6,head:18,g:seg(p0,.35,.6)})+fade(seg(p0,.5,.6),label('−2',TX(5),y+44,{size:24,color:C.F,anchor:'middle',weight:700}));
 s+=fade(res,line(TX(4),y-40,TX(4),y+36,{color:C.hi,w:2,dash:'6 6'})+label('4',TX(4),y+36+24,{size:22,color:C.hi,anchor:'middle',weight:700}));
 s+=fade(res,line(TX(6),y-40,TX(6),y+20,{color:C.faint,w:2,dash:'6 6'})+label('6',TX(6)+14,y-44,{size:22,color:C.dim,anchor:'start'}));
 return fade(g,s);
}
function twoForces(x,y,{g=1,g6=1,g2=1,res=0}={}){
 let s=ground(80,1120,y)+box(x,y,{text:'箱'});
 s+=fArrow(x+65,y-50,6,{g:g6,text:'6 N'})+fArrow(x-65,y-50,-2,{g:g2,text:'2 N'});
 s+=fade(res,fArrow(x,y-120,4,{text:'合力 4 N',color:C.hi,w:7}));
 return fade(g,s);
}
// hand pushing the box
function hand(x,y){x-=20;return rect(x-40,y-90,60,70,{fill:'#e8c9a8',fo:.25,stroke:'#e8c9a8',rx:18})+label('手',x-10,y-45,{size:26,color:C.ink,anchor:'middle'});}

export const ytUiNewton1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=card(200,50,800,150,label('前回の最後の問い',600,100,{size:26,color:C.dim,anchor:'middle'})+tex('F=ma\\;\\text{?}',600,160,{size:54,auto:true}),seg(p,0,.15));
  const opts=[['位置 x',C.x],['速度 v',C.v],['別のもの？',C.hi]];
  opts.forEach(([t,c],i)=>{const x=260+i*340;s+=card(x-130,270,260,110,label(t,x,340,{size:34,color:c,anchor:'middle',weight:700}),seg(p,.3+.15*i,.42+.15*i),c);});
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=card(60,60,470,160,label('微分方程式の回',295,105,{size:26,color:C.dim,anchor:'middle'})+tex('\\dfrac{dv}{dt}=-kv',295,175,{size:40}),seg(p,0,.15));
  s+=card(60,270,470,160,label('振動の回',295,315,{size:26,color:C.dim,anchor:'middle'})+tex('m\\dfrac{d^2x}{dt^2}=-kx',295,385,{size:40}),seg(p,.05,.2));
  s+=fade(seg(p,.15,.3),arrow(545,140,720,230,{color:C.dim,w:3,head:14})+arrow(545,350,720,270,{color:C.dim,w:3,head:14}));
  s+=card(740,170,400,160,tex('ma=F',940,245,{size:64}),seg(p,.15,.3));
  s+=fade(seg(p,.25,.4),label('形だけ 使った',940,375,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),highlight(740,170,400,160,1)+label('今回：きちんと 扱う',940,430,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'box']:(p)=>{
  const x=420+120*seg(p,.45,1)**2;
  let s=pushed(x,{fg:seg(p,.2,.35)});
  s+=fade(seg(p,.05,.2),label('なめらかな床（摩擦なし）',600,470,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.1,.25),label('質量 2 kg',x,250,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=pushed(540);
  const opts=[['位置？',C.x],['速度？',C.v],['別のもの？',C.hi]];
  opts.forEach(([t,c],i)=>{const x=260+i*340;s+=card(x-120,50,240,90,label(t,x,108,{size:32,color:c,anchor:'middle',weight:700}),seg(p,.1+.18*i,.22+.18*i),c);});
  return s;
 },
 [K+'plan']:(p)=>chain(2,{y:190,deriv:0,g:seg(p,0,.2)})+fade(seg(p,.5,.7),label('まず 違いを 確かめる',600,420,{size:30,color:C.ink,anchor:'middle'})),
 // ===== S2 位置・速度・加速度 =====
 [K+'pos']:(p)=>{
  const y=330;let s=numberLine(y,{g:seg(p,0,.15)});
  s+=fade(seg(p,.1,.25),label('基準の点',NX(0),y+70,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),arrow(NX(3),150,NX(5),150,{color:C.dim,w:4,head:16})+label('右向きを 正',NX(4),130,{size:26,color:C.ink,anchor:'middle'}));
  const u=1+2*Math.sin(Math.PI*clamp((p-.35)/.6));
  s+=fade(seg(p,.3,.4),smallBox(u,y)+arrow(NX(0),y-90,NX(u),y-90,{color:C.x,w:4,head:14})+label(`x ＝ ${u.toFixed(1)} m`,NX(u),y-102,{size:26,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'disp']:(p)=>{
  const y=330;let s=numberLine(y);
  s+=smallBox(1,y,{ghost:1,text:'t＝0 s'})+fade(seg(p,.2,.35),smallBox(5,y,{text:'t＝2 s'}));
  s+=fade(seg(p,.05,.2),label('Δ ＝ 後 − 前',600,90,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),arrow(NX(1),y-110,NX(5),y-110,{color:C.x,w:5,head:16})+label('Δx ＝ 5 − 1 ＝ 4 m',NX(3),y-126,{size:28,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'vel']:(p)=>{
  const y=330;let s=numberLine(y);
  s+=smallBox(1,y,{ghost:1,text:'t＝0 s'})+smallBox(5,y,{text:'t＝2 s'})+arrow(NX(1),y-110,NX(5),y-110,{color:C.x,w:5,head:16})+label('Δx ＝ 4 m',NX(3),y-126,{size:28,color:C.x,anchor:'middle',weight:700});
  s+=card(170,40,560,110,tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}=\\dfrac{4\\,\\mathrm{m}}{2\\,\\mathrm{s}}=2\\,\\mathrm{m/s}',450,100,{size:38}),seg(p,.05,.25));
  s+=fade(seg(p,.5,.65),card(790,40,340,110,arrow(1080,80,900,80,{color:C.v,w:5,head:16})+label('左向き：v ＜ 0',960,128,{size:26,color:C.v,anchor:'middle',weight:700}),1,C.v));
  s+=fade(seg(p,.78,.9),label('速度には 向きがある',NX(2.5),470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'acc']:(p)=>{
  let s=fade(seg(p,0,.15),label('加速度 ＝ 速度の 変わり方',600,80,{size:36,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.3),label('t＝0 s',150,210,{size:26,color:C.t})+vArrow(290,202,2,{text:'2 m/s'}));
  s+=fade(seg(p,.3,.45),label('t＝3 s',150,320,{size:26,color:C.t})+vArrow(290,312,8,{text:'8 m/s'}));
  s+=fade(seg(p,.6,.75),label('速さの 大きさ そのもの ではない',600,450,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'acc2']:(p)=>{
  let s=label('t＝0 s',150,130,{size:26,color:C.t})+vArrow(290,122,2,{text:'2 m/s'});
  s+=label('t＝3 s',150,230,{size:26,color:C.t})+vArrow(290,222,8,{text:'8 m/s'});
  s+=fade(seg(p,.2,.35),line(370,150,370,250,{color:C.a,w:2,dash:'6 6'})+brace(370,610,255,{color:C.a,text:'増え分 6 m/s',size:26}));
  s+=fade(seg(p,.3,.45),tex('\\Delta v=8-2=6\\,\\mathrm{m/s}',330,380,{size:36,anchor:'start'}));
  s+=fade(seg(p,.6,.75),tex('a=\\dfrac{6\\,\\mathrm{m/s}}{3\\,\\mathrm{s}}=2\\,\\mathrm{m/s^2}',330,465,{size:36,anchor:'start'}));
  return s;
 },
 [K+'acc3']:(p)=>{
  let s=card(80,90,480,200,tex('\\dfrac{\\mathrm{m/s}}{\\mathrm{s}}=\\mathrm{m/s^2}',320,170,{size:44,auto:false})+label('メートル 毎秒 毎秒',320,255,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.2));
  s+=vRows([['0','2',seg(p,.4,.5)],['1','4',seg(p,.5,.6)],['2','6',seg(p,.6,.7)],['3','8',seg(p,.7,.8)]],{x0:760,y0:120});
  s+=fade(seg(p,.8,.92),label('毎秒 ＋2 m/s',320,360,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'acc0']:(p)=>{
  let s=ground(40,1160,380);
  const xs=[200,560,920];
  xs.forEach((x,i)=>{s+=fade(seg(p,.05+.15*i,.15+.15*i),cart(x,380,{w:130,text:''})+vArrow(x-60,260,6,{text:i===0?'6 m/s':''})+label(`t＝${i} s`,x,440,{size:24,color:C.t,anchor:'middle'}));});
  s+=fade(seg(p,.55,.7),label('速度が 一定 → a ＝ 0',600,110,{size:36,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chain']:(p)=>{
  let s=chain(2,{y:150});
  s+=fade(seg(p,.1,.3),tex('v=\\dfrac{dx}{dt}',400,380,{size:44}));
  s+=fade(seg(p,.3,.5),tex('a=\\dfrac{dv}{dt}',800,380,{size:44}));
  return s;
 },
 // ===== S3 力を合計する =====
 [K+'mF']:(p)=>{
  let s=card(90,80,470,330,label('質量 m',325,150,{size:38,color:C.ink,anchor:'middle',weight:700})+label('単位 kg',325,220,{size:30,color:C.dim,anchor:'middle'})+label('動かしにくさ',325,320,{size:32,color:C.ink,anchor:'middle'}),seg(p,0,.2));
  s+=card(640,80,470,330,label('力 F',875,150,{size:38,color:C.F,anchor:'middle',weight:700})+label('単位 N（ニュートン）',875,220,{size:30,color:C.dim,anchor:'middle'})+label('押す・引く',875,320,{size:32,color:C.F,anchor:'middle'}),seg(p,.45,.65),C.F);
  return s;
 },
 [K+'vec1d']:(p)=>{
  let s=fade(seg(p,0,.15),arrow(200,330,380,190,{color:C.F,w:6,head:18})+tex('\\mathbf{F}',410,200,{size:48}));
  s+=fade(seg(p,.1,.25),label('向きを持つ ＝ ベクトル',290,420,{size:28,color:C.ink,anchor:'middle'}));
  const y=260;
  s+=fade(seg(p,.45,.6),line(620,y,1120,y,{color:C.dim,w:2.5})+line(870,y-12,870,y+12,{color:C.dim,w:2})+label('0',870,y+40,{size:22,color:C.dim,anchor:'middle'})+label('一直線の上',870,120,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),arrow(870,y-30,1030,y-30,{color:C.F,w:6,head:18})+label('右向き → ＋',1000,y-60,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),arrow(870,y+60,790,y+60,{color:C.F,w:6,head:18})+label('左向き → −',790,y+105,{size:26,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'two']:(p)=>twoForces(600,330,{g6:seg(p,.2,.4),g2:seg(p,.45,.65)}),
 [K+'tip']:(p)=>twoForces(600,300,{res:0})+tipToTail(seg(p,.05,.8),{res:seg(p,.75,.9)}),
 [K+'sum']:(p)=>{
  let s=twoForces(600,300,{res:seg(p,.45,.6)})+tipToTail(1,{res:1});
  s+=card(40,40,380,120,tex(cF('6')+'+('+cF('-2')+')='+cH('4'),230,105,{size:44,auto:false}),seg(p,0,.2));
  s+=fade(seg(p,.6,.75),card(790,40,370,100,label('合力 ＝ 力の合計',975,102,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'intoF']:(p)=>{
  const x=600,y=400;
  let s=ground(80,1120,y)+box(x,y,{text:'箱'});
  s+=fade(seg(p,.35,.5),arrow(x+30,y,x+30,y+90,{color:C.F,w:6,head:18})+label('重力',x+48,y+80,{size:24,color:C.F}));
  s+=fade(seg(p,.45,.6),arrow(x-30,y-100,x-30,y-210,{color:C.F,w:6,head:18})+label('床が押す力',x-45,y-190,{size:24,color:C.F,anchor:'end'}));
  s+=fArrow(x+65,y-50,6,{text:'6 N'})+fArrow(x-65,y-50,-2,{text:'2 N'});
  s+=card(760,40,400,140,tex('ma='+cH('F'),960,100,{size:48,auto:false})+label('F ＝ 合力',960,158,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  s+=fade(seg(p,.7,.85),label('一つずつ 描いてから 足す',290,90,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'intoF2']:(p)=>{
  const x=600,y=400,gv=1-.65*seg(p,.45,.6);
  let s=ground(80,1120,y)+box(x,y,{text:'箱'});
  s+=fade(gv,arrow(x+30,y,x+30,y+90,{color:C.F,w:6,head:18})+label('重力',x+48,y+80,{size:24,color:C.F}));
  s+=fade(gv,arrow(x-30,y-100,x-30,y-210,{color:C.F,w:6,head:18})+label('床が押す力',x-45,y-190,{size:24,color:C.F,anchor:'end'}));
  s+=fade(seg(p,.1,.25),label('上下は つり合う',x+40,y-160,{size:26,color:C.dim}));
  s+=fArrow(x+65,y-50,6,{text:'6 N'})+fArrow(x-65,y-50,-2,{text:'2 N'});
  s+=card(760,40,400,140,tex('ma='+cH('F'),960,100,{size:48,auto:false})+label('F ＝ 合力',960,158,{size:26,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=fade(seg(p,.6,.75),label('残るのは 横の力：右向き 4 N',290,90,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 運動方程式の約束 =====
 [K+'choose']:(p)=>{
  const x=620,y=400;
  let s=ground(80,1120,y)+box(x,y,{text:'箱'})+hand(x-65,y);
  s+=fade(seg(p,.1,.25),label('① どの物体か',180,90,{size:32,color:C.ink,weight:700}));
  s+=fade(seg(p,.45,.6),ring(x,y-50,95,{color:C.hi,w:3,dash:'10 8'})+label('この箱を 選ぶ',x+110,y-150,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'choose2']:(p)=>{
  const x=620,y=400;
  let s=ground(80,1120,y)+box(x,y,{text:'箱'})+hand(x-65,y);
  s+=label('① どの物体か',180,90,{size:32,color:C.ink,weight:700})+ring(x,y-50,95,{color:C.hi,w:3,dash:'10 8'});
  s+=fade(seg(p,.05,.2),fArrow(x+65,y-50,4,{text:'箱が受ける 4 N'}))+ok(x+160,y-80,seg(p,.2,.3));
  s+=fade(seg(p,.4,.55),fArrow(x-110,y-110,-4,{text:'手が受ける力',color:C.dim}));
  s+=fade(seg(p,.6,.75),line(x-280,y-145,x-120,y-95,{color:C.a,w:4})+label('入れない',x-200,y-160,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'frame']:(p)=>{
  const y=380;
  let s=label('② 座標',180,90,{size:32,color:C.ink,weight:700});
  s+=fade(seg(p,.05,.2),ground(80,1120,y)+numberLine(y+10,{from:-1,to:6}));
  s+=fade(seg(p,.2,.35),box(NX(2),y,{text:'箱',w:110,h:86}));
  s+=fade(seg(p,.3,.45),arrow(NX(3.5),290,NX(5.5),290,{color:C.dim,w:4,head:16})+label('右向きを 正',NX(4.5),270,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),card(560,50,300,90,label('慣性系',710,108,{size:36,color:C.hi,anchor:'middle',weight:700}),1,C.hi)+label('地面に 固定した 目盛り',710,215,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(380,40,440,140,tex('ma=F',600,115,{size:64}),seg(p,0,.15));
  const it=[['定義',0],['導いた 結果',0],['実験に 支えられた 法則',1]];
  it.forEach(([t,good],i)=>{const x=210+i*390,gg=seg(p,.12+.14*i,.24+.14*i);
   s+=card(x-170,240,340,110,label(t,x,305,{size:30,color:good?C.hi:C.dim,anchor:'middle',weight:700}),gg,good?C.hi:C.faint)+(good?ok(x,410,gg):ng(x,410,gg));});
  s+=fade(seg(p,.75,.9),label('運動を 予測する 出発点',600,480,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unitN']:(p)=>{
  let s=card(200,60,800,170,tex('1\\,\\mathrm{N}=1\\,\\mathrm{kg}\\times1\\,\\mathrm{m/s^2}',600,150,{size:52,auto:false}),seg(p,0,.2));
  s+=fade(seg(p,.15,.3),label('単位の 決め方（定義）',600,280,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),ground(300,900,460)+box(500,460,{text:'1 kg',w:110,h:80})+fArrow(555,420,1,{text:'1 N'})+label('→ a ＝ 1 m/s²',720,430,{size:28,color:C.a,weight:700}));
  return s;
 },
 // ===== S5 力が決めるもの =====
 [K+'back']:(p)=>{
  let s=pushed(300,{y:420});
  s+=card(640,70,470,300,
   fade(seg(p,.1,.25),label('F ＝ 4 N（合力）',700,150,{size:32,color:C.F,weight:700}))
   +fade(seg(p,.25,.4),label('m ＝ 2 kg',700,230,{size:32,color:C.ink,weight:700}))
   +fade(seg(p,.5,.65),label('a ＝ ？',700,310,{size:36,color:C.a,weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'solve']:(p)=>{
  let s=tex('ma=F',600,90,{size:52});
  s+=fade(seg(p,.1,.25),label('両辺を m で割る',950,95,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.2,.4)*(1-seg(p,.42,.48)),tex('\\dfrac{ma}{m}=\\dfrac{F}{m}',600,230,{size:52}));
  s+=fade(seg(p,.45,.6),tex('\\dfrac{\\cancel{m}a}{\\cancel{m}}=\\dfrac{F}{m}',600,230,{size:52})+label('左の m が 消える',950,235,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),tex('a=\\dfrac{F}{m}',600,400,{size:60})+highlight(460,305,280,170,1));
  return s;
 },
 [K+'num']:(p)=>{
  let s=tex('a=\\dfrac{F}{m}',250,120,{size:48});
  s+=fade(seg(p,.05,.25),tex('a=\\dfrac{4\\,\\mathrm{N}}{2\\,\\mathrm{kg}}=2\\,\\mathrm{m/s^2}',680,120,{size:48}));
  s+=fade(seg(p,.45,.6),card(250,250,700,180,tex('\\dfrac{\\mathrm{N}}{\\mathrm{kg}}=\\dfrac{\\mathrm{kg\\cdot m/s^2}}{\\mathrm{kg}}=\\mathrm{m/s^2}',600,320,{size:40,auto:false})+label('単位も 合う',600,405,{size:26,color:C.dim,anchor:'middle'}),1));
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=tex('a=2\\,\\mathrm{m/s^2}',230,90,{size:44});
  const rows=[[0,0],[1,2],[2,4]];
  rows.forEach(([t,v],i)=>{const y=190+i*100,gg=seg(p,.1+.2*i,.25+.2*i);s+=fade(gg,label(`${t} s 後`,160,y+8,{size:26,color:C.t,anchor:'middle'})+vArrow(260,y,v,{text:`${v} m/s`}));
   if(i>0)s+=fade(gg,label('＋2',230,y-42,{size:24,color:C.a,weight:700}));});
  s+=fade(seg(p,.7,.85),card(680,180,440,160,label('力が 決めたのは',900,240,{size:28,color:C.ink,anchor:'middle'})+label('速度の 増え方',900,300,{size:36,color:C.a,anchor:'middle',weight:700}),1,C.a));
  return s;
 },
 [K+'mass']:(p)=>{
  let s=ground(40,1160,220)+ground(40,1160,450);
  s+=cart(300,220,{w:130,h:60,color:BX,text:'2 kg'})+fArrow(365,180,4,{text:'4 N'});
  s+=fade(seg(p,.1,.3),cart(300,450,{w:210,h:90,color:BX,text:'4 kg'})+fArrow(405,395,4,{text:'4 N'}));
  s+=fade(seg(p,.35,.5),label('固定：力 4 N',860,60,{size:28,color:C.F,anchor:'middle',weight:700})+label('変える：質量',860,110,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('a ＝ ？',860,330,{size:36,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mass2']:(p)=>{
  let s=ground(40,1160,220)+ground(40,1160,450);
  s+=cart(300,220,{w:130,h:60,color:BX,text:'2 kg'})+fArrow(365,180,4,{text:'4 N'});
  s+=cart(300,450,{w:210,h:90,color:BX,text:'4 kg'})+fArrow(405,395,4,{text:'4 N'});
  s+=label('固定：力 4 N',860,60,{size:28,color:C.F,anchor:'middle',weight:700})+label('変える：質量',860,110,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=tex('a=\\dfrac{4}{2}=2\\,\\mathrm{m/s^2}',860,190,{size:36})+fade(seg(p,.05,.25),tex('a=\\dfrac{4}{4}=1\\,\\mathrm{m/s^2}',860,410,{size:36}));
  s+=fade(seg(p,.5,.65),label('質量 2倍 → 加速度 半分',860,300,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mass3']:(p)=>{
  let s=tex('a=\\dfrac{F}{'+cH('m')+'}',400,220,{size:84});
  s+=fade(seg(p,.05,.2),label('← 分母',490,300,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.35,.5),card(640,120,480,200,label('重いほど',880,180,{size:30,color:C.ink,anchor:'middle'})+label('速度が 変わりにくい',880,250,{size:34,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  s+=fade(seg(p,.7,.85),label('質量 ＝ 動かしにくさ',880,390,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'half']:(p)=>{
  const A=axes({x:140,y:440,w:500,h:320,xmax:1.2,ymax:2.6,xticks:[0.5,1],yticks:[1,2],grid:true,xlabel:'t [s]',ylabel:'v [m/s]',xcolor:C.t,ycolor:C.v,g:seg(p,0,.15)});
  let s=A.svg+fade(seg(p,.1,.3),line(A.X(0),A.Y(0),A.X(1),A.Y(2),{color:C.v,w:4})+dot(A.X(1),A.Y(2),8,C.v)+label('1 s で ＋2',A.X(1)+14,A.Y(2)-10,{size:24,color:C.v}));
  s+=fade(seg(p,.4,.6),line(A.X(.5),A.Y(0),A.X(.5),A.Y(1),{color:C.hi,w:2,dash:'6 6'})+label('？',A.X(.5)-40,A.Y(1)+4,{size:34,color:C.hi,weight:700}));
  s+=card(740,120,380,160,tex('a=2\\,\\mathrm{m/s^2}',930,180,{size:36})+tex('\\Delta t=0.5\\,\\mathrm{s}',930,245,{size:36}),seg(p,.3,.45));
  return s;
 },
 [K+'dv']:(p)=>{
  const A=axes({x:140,y:440,w:500,h:320,xmax:1.2,ymax:2.6,xticks:[0.5,1],yticks:[1,2],grid:true,xlabel:'t [s]',ylabel:'v [m/s]',xcolor:C.t,ycolor:C.v});
  let s=A.svg+line(A.X(0),A.Y(0),A.X(1),A.Y(2),{color:C.v,w:4})+dot(A.X(1),A.Y(2),8,C.v);
  s+=fade(seg(p,.3,.45),line(A.X(.5),A.Y(0),A.X(.5),A.Y(1),{color:C.hi,w:2,dash:'6 6'})+dot(A.X(.5),A.Y(1),8,C.hi)+label('＋1 m/s',A.X(.5)+16,A.Y(1)+34,{size:26,color:C.hi,weight:700}));
  s+=card(680,90,480,130,tex('\\Delta v=a\\,\\Delta t=2\\times0.5=1\\,\\mathrm{m/s}',920,155,{size:34}),seg(p,0,.2));
  s+=fade(seg(p,.55,.7),card(680,280,480,110,tex('\\mathrm{m/s^2}\\times\\mathrm{s}=\\mathrm{m/s}',920,335,{size:36,auto:false}),1));
  return s;
 },
 [K+'v0']:(p)=>{
  let s=label('初め',330,70,{size:26,color:C.t,anchor:'middle'})+label('1秒後',760,70,{size:26,color:C.t,anchor:'middle'});
  s+=fade(seg(p,.1,.25),label('静止から',120,190,{size:28,color:C.ink,anchor:'middle'})+vArrow(270,182,0,{text:'0 m/s'}));
  s+=fade(seg(p,.2,.35),vArrow(640,182,2,{text:'2 m/s'}));
  s+=fade(seg(p,.5,.65),label('3 m/s から',120,350,{size:28,color:C.ink,anchor:'middle'})+vArrow(270,342,3,{text:'3 m/s'}));
  s+=fade(seg(p,.7,.85),vArrow(640,342,5,{text:'5 m/s'}));
  s+=fade(seg(p,0,.1),label('2 kg に 4 N',1050,470,{size:24,color:C.F,anchor:'middle'}));
  return s;
 },
 [K+'v0b']:(p)=>{
  let s=label('初め',330,70,{size:26,color:C.t,anchor:'middle'})+label('1秒後',760,70,{size:26,color:C.t,anchor:'middle'});
  s+=label('静止から',120,190,{size:28,color:C.ink,anchor:'middle'})+vArrow(270,182,0,{text:'0 m/s'})+vArrow(640,182,2,{text:'2 m/s'});
  s+=label('3 m/s から',120,350,{size:28,color:C.ink,anchor:'middle'})+vArrow(270,342,3,{text:'3 m/s'})+vArrow(640,342,5,{text:'5 m/s'});
  s+=label('2 kg に 4 N',1050,470,{size:24,color:C.F,anchor:'middle'});
  s+=fade(seg(p,.1,.25),label('速度は 違う',1050,190,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('＋2 m/s',520,240,{size:28,color:C.a,anchor:'middle',weight:700})+label('＋2 m/s',520,400,{size:28,color:C.a,anchor:'middle',weight:700})+label('増え分は 同じ',1050,330,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'answer']:(p)=>{
  let s=card(140,50,920,180,tex('F=ma',330,140,{size:56})+fade(seg(p,.1,.3),arrow(450,140,560,140,{color:C.dim,w:4,head:16})+label('今の 加速度 a',800,152,{size:44,color:C.a,anchor:'middle',weight:700})),seg(p,0,.1),C.hi);
  s+=fade(seg(p,.2,.35),ng(250,300)+label('位置',300,310,{size:30,color:C.x})+ng(500,300)+label('速度',550,310,{size:30,color:C.v}));
  s+=fade(seg(p,.6,.75),card(140,370,920,100,label('速度 ＝ 初めの速度 ＋ 積み上がった 増え分',600,432,{size:30,color:C.v,anchor:'middle',weight:700}),1,C.v));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=twoForces(600,300,{res:1});
  s+=card(40,380,1120,110,label('F ＝ 選んだ物体が 受ける 合力（右向き ＋）',600,445,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.4),C.hi);
  s+=fade(seg(p,0,.2),label('6 ＋ (−2) ＝ 4 N',180,80,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=twoForces(600,300,{res:1})+card(40,380,1120,110,label('F ＝ 選んだ物体が 受ける 合力（右向き ＋）',600,445,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s=fade(1-seg(p,0,.15),s);
  s+=fade(seg(p,.05,.2),card(90,80,480,300,label('実験に 支えられた 法則',330,140,{size:26,color:C.dim,anchor:'middle'})+tex('a=\\dfrac{F}{m}',330,250,{size:60})+label('今の 加速度',330,340,{size:28,color:C.a,anchor:'middle',weight:700}),1));
  s+=fade(seg(p,.5,.65),card(630,80,480,300,label('時間を 掛ける',870,140,{size:26,color:C.dim,anchor:'middle'})+tex('\\Delta v=a\\,\\Delta t',870,250,{size:56})+label('速度の 増え分',870,340,{size:28,color:C.v,anchor:'middle',weight:700}),1));
  return s;
 },
 [K+'sum3']:(p)=>{
  let s=tex('a=\\dfrac{4}{2}=2\\,\\mathrm{m/s^2},\\quad \\Delta v=2\\times0.5=1\\,\\mathrm{m/s}',600,90,{size:38});
  s+=vRows([['0','0',seg(p,.2,.3)],['0.5','1',seg(p,.3,.4)],['1.0','2',seg(p,.4,.5)],['1.5','？',seg(p,.5,.6)]],{x0:500,y0:180,dy:70,step:'+1'});
  return s;
 },
 [K+'next']:(p)=>{
  let s=tex('a=\\dfrac{4}{2}=2\\,\\mathrm{m/s^2},\\quad \\Delta v=2\\times0.5=1\\,\\mathrm{m/s}',600,90,{size:38});
  s+=vRows([['0','0',1],['0.5','1',1],['1.0','2',1],['1.5','？',1]],{x0:500,y0:180,dy:70,step:'+1'});
  s+=fade(seg(p,.3,.5),label('位置 x [m]',950,180,{size:24,color:C.x,anchor:'middle',weight:700})+[0,1,2,3].map(i=>label('？',950,250+70*i,{size:28,color:C.x,anchor:'middle',weight:700})).join(''));
  s+=fade(seg(p,.55,.7),label('積み上げると？',200,330,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
};
