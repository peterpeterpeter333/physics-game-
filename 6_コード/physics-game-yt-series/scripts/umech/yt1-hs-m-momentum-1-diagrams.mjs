// 高校編「運動量と力積・深く学ぶ 1/2」(ys-hs-m-momentum-1) — 図。Stage 1200×515.
// 色：運動量 p 桃（太めの矢印）、力 F 緑、速度 v 紫、時間 t 金、運動エネルギー K 濃い橙、強調 黄。右向きを正とする。
// 2/2・要点でも使う部品は export する（台車・力の矢印・表は 06 の部品、K の棒は 07 の部品を使う）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,ground,cart,wall,axes,clamp} from './anim.mjs';
import {card,FA,VA,box,table,T2,Fc} from './yt1-hs-m-force-1-diagrams.mjs';
import {KC,ebar,tag} from './yt1-hs-m-energy-1-diagrams.mjs';
import {areaUnder,strips} from './yt1-hs-m1-uniform-accel-1-diagrams.mjs';
export {card,FA,VA,box,table,T2,Fc,KC,ebar,tag,areaUnder,strips};

const K='hs-m-momentum-1:';
export const PC=C.p;
export const Pt=`{\\color{${PC}}p}`, Kt=`{\\color{${KC}}K}`;
export const DP=`\\Delta ${Pt}`;
// ---- momentum arrow (pink) ----------------------------------------------------------------------
export function PA(x,y,X,Y,{text='',g=1,size=26,dx=0,dy=-16,anchor='middle',w=7,head=20,color=PC}={}){
 let s=arrow(x,y,X,Y,{color,w,head,g});
 if(text&&g>.05)s+=fade(Math.min(1,g*1.4),label(text,(x+X)/2+dx,(y+Y)/2+dy,{size,color,anchor,weight:700}));
 return s;
}
export const PK=30; // px per kg·m/s
export const VK=26; // px per m/s
// ---- a cart (06 の形) ----------------------------------------------------------------------------
export const mcart=(x,gy,{text='2.0 kg',w=150,color=C.x,size=24}={})=>cart(x,gy,{w,h:62,color,text,size});
// positive direction marker
export function posDir(x,y,{g=1,text='右向きが 正'}={}){
 return fade(g,arrow(x,y,x+110,y,{color:C.hi,w:4,head:16})+label('＋',x-14,y+9,{size:30,color:C.hi,anchor:'end',weight:700})+label(text,x+126,y+9,{size:24,color:C.hi,weight:700}));
}
// a cart with its velocity (purple) and momentum (pink) arrows; v signed (m/s)
export function movingCart(x,gy,v,{m='2.0 kg',g=1,vg=1,pg=1,vl=null,pl=null,py=null}={}){
 let s=fade(g,mcart(x,gy,{text:m}));
 const d=Math.sign(v),ox=x+d*80,vy=gy-110,yy=py??gy-160;
 if(v){
  s+=fade(g,VA(ox-d*150,vy,ox-d*150+v*VK,vy,{g:vg}));
  if(vl&&vg>.05)s+=fade(g*vg,label(vl,ox-d*150+v*VK/2,vy-14,{size:24,color:C.v,anchor:'middle',weight:700}));
  const P=parseFloat(m)*v;
  s+=fade(g,PA(ox-d*150,yy,ox-d*150+P*PK,yy,{g:pg}));
  if(pl&&pg>.05)s+=fade(g*pg,label(pl,ox-d*150+P*PK/2,yy-18,{size:26,color:PC,anchor:'middle',weight:700}));
 }
 return s;
}
// ---- simple truck / bicycle --------------------------------------------------------------------
function truck(x,gy,{o=1}={}){
 return fade(o,rect(x-150,gy-150,200,120,{fill:'#8fa6c9',fo:.75,stroke:'#b9c9e6',rx:8})+rect(x+50,gy-110,80,80,{fill:'#c9a46a',fo:.85,stroke:'none',rx:10})+rect(x+80,gy-100,38,30,{fill:'#cfe8ff',fo:.8,stroke:'none',rx:4})
  +[x-110,x-40,x+90].map(q=>ring(q,gy-18,18,{color:C.dim,w:4,fill:C.bg})).join('')+label('トラック',x-50,gy-80,{size:26,color:C.ink,anchor:'middle',weight:700}));
}
function bike(x,gy,{o=1}={}){
 const c='#c9d2e3';
 return fade(o,ring(x-45,gy-30,30,{color:c,w:4})+ring(x+45,gy-30,30,{color:c,w:4})+line(x-45,gy-30,x-5,gy-80,{color:c,w:4})+line(x-5,gy-80,x+35,gy-80,{color:c,w:4})+line(x+35,gy-80,x+45,gy-30,{color:c,w:4})+line(x-5,gy-80,x+5,gy-30,{color:c,w:4})+line(x+5,gy-30,x-45,gy-30,{color:c,w:4})
  +dot(x-10,gy-150,15,'#e9c7a6')+line(x-10,gy-135,x-5,gy-85,{color:'#7f8fd8',w:12})+line(x-8,gy-125,x+30,gy-95,{color:'#e9c7a6',w:7})+label('自転車',x,gy+40,{size:26,color:C.ink,anchor:'middle',weight:700}));
}
// ---- F–t graph (force magnitude, t in seconds) ---------------------------------------------------
// ticks drawn here so that 0.010 keeps its trailing zero
export function ftAxes(g=1,{x=110,y=440,w=560,h=340,tmax=.013,fmax=1350,tt=[[.005,'0.005'],[.010,'0.010']],ft=[[600,'600'],[1200,'1200']],ylabel='力の 大きさ F [N]'}={}){
 const A=axes({x,y,w,h,xmax:tmax,ymax:fmax,xlabel:'t [s]',ylabel,xticks:[],yticks:[],g,xcolor:C.t,ycolor:C.F});
 let s=ft.map(([v])=>line(x,A.Y(v),x+w,A.Y(v),{color:C.grid,w:1.5})).join('');
 s+=tt.map(([u,t])=>line(A.X(u),y-6,A.X(u),y+6,{color:C.dim})+label(t,A.X(u),y+32,{size:22,color:C.t,anchor:'middle'})).join('');
 s+=ft.map(([v,t])=>line(x-6,A.Y(v),x+6,A.Y(v),{color:C.dim})+label(t,x-14,A.Y(v)+8,{size:22,color:C.F,anchor:'end'})).join('');
 return {...A,svg:fade(g,s)+A.svg};
}
export const bump=t=>t<0||t>.01?0:1200*Math.sin(Math.PI*t/.01)**2;      // smooth collision force, area 6.0
export const tri=t=>t<0||t>.01?0:(t<.005?1200*t/.005:1200*(.01-t)/.005); // triangle model, area 6.0
// ---- equation chain for the derivation (S3) --------------------------------------------------------
const CH=[
 {src:'a=\\dfrac{v-v_0}{\\Delta t}',y:72,size:40},
 {src:'m\\,\\dfrac{v-v_0}{\\Delta t}=F',y:180,size:40},
 {src:'m(v-v_0)=F\\Delta t',y:268,size:40},
 {src:'mv-mv_0=F\\Delta t',y:340,size:40},
];
function chain(step,p,{x=430}={}){
 let s='';
 CH.forEach((r,i)=>{if(i>step)return;const o=i===step?seg(p,.05,.25):(i===step-1?1:.55);s+=fade(o,T2(r.src,x,r.y,{size:r.size}));});
 return s;
}
const cardR=(inner,g=1,stroke=C.faint)=>card(760,40,400,170,inner,g,stroke);

export const hsMomentum1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  const u=seg(p,.05,.95)*60;
  let s=ground(60,1140,400)+truck(330+u,400)+bike(860+u,400);
  s+=VA(500+u,200,500+u+120,200,{g:seg(p,.25,.4)})+VA(920+u,200,920+u+120,200,{g:seg(p,.25,.4)});
  s+=fade(seg(p,.3,.45),label('同じ 速さ',600,140,{size:30,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('止めにくさは 違う',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=fade(.3,ground(60,1140,400)+truck(390,400)+bike(920,400));
  s+=card(250,90,700,220,label('この 勢いは',600,165,{size:32,color:C.ink,anchor:'middle'})+label('エネルギーとは 別の 量？',600,245,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'heavy']:(p)=>{
  let s=card(60,50,520,380,label('質量が 大きい ほど',320,110,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.1,.25),box(220,330,{w:150,h:120,text:'重い'})+box(440,330,{w:70,h:56,text:'軽い',size:22})+VA(160,190,260,190)+VA(400,250,500,250)+label('同じ 速さ',320,400,{size:24,color:C.v,anchor:'middle'}));
  s+=card(620,50,520,380,label('速さが 大きい ほど',880,110,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55));
  s+=fade(seg(p,.45,.6),box(760,330,{w:100,h:80})+box(1000,330,{w:100,h:80})+VA(710,220,890,220)+VA(960,220,1010,220)+label('速い',800,200,{size:24,color:C.v,anchor:'middle'})+label('遅い',985,200,{size:24,color:C.v,anchor:'middle'})+label('同じ 質量',880,400,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),label('止めにくい',320,160,{size:28,color:C.hi,anchor:'middle',weight:700})+label('止めにくい',880,160,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S2 運動量 p＝mv =================
 [K+'def']:(p)=>{
  let s=card(380,60,440,150,T2(`${Pt}=mv`,600,140,{size:70}),seg(p,.05,.2),PC);
  s+=tag('定義',900,100,{g:seg(p,.7,.85)});
  s+=fade(seg(p,.3,.45),label('p：運動量',300,300,{size:32,color:PC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('m：質量',600,300,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('v：速度',900,300,{size:32,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('質量 × 速度',600,380,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(380,60,440,150,T2(`${Pt}=mv`,600,140,{size:70}),1,PC);
  s+=fade(seg(p,.05,.25),label('単位',600,290,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.15,.4),T2('\\mathrm{kg}\\times\\mathrm{m/s}',420,370,{size:46,auto:false}));
  s+=fade(seg(p,.55,.75),T2('=\\mathrm{kg\\cdot m/s}',780,370,{size:46,auto:false,color:PC}));
  return s;
 },
 [K+'ex1']:(p)=>{
  const x=300+120*seg(p,0,1);
  let s=ground(60,1140,420)+movingCart(x,420,3,{vg:seg(p,.05,.2),pg:seg(p,.45,.65),vl:'3.0 m/s',pl:'p ＝ 6.0'});
  s+=card(700,40,460,150,T2(`${Pt}=2.0\\times 3.0`,930,95,{size:42,auto:false})+fade(seg(p,.6,.75),T2('=6.0\\ \\mathrm{kg\\cdot m/s}',930,155,{size:40,auto:false,color:PC})),seg(p,.4,.55),PC);
  return s;
 },
 [K+'dir']:(p)=>{
  let s=ground(60,1140,420)+movingCart(420,420,3,{vl:'3.0 m/s',pl:'p ＝ 6.0'});
  s+=card(700,40,460,150,T2(`${Pt}=2.0\\times 3.0`,930,95,{size:42,auto:false})+T2('=6.0\\ \\mathrm{kg\\cdot m/s}',930,155,{size:40,auto:false,color:PC}),1,PC);
  s+=fade(seg(p,.1,.25),label('速度にも 運動量にも 向きが ある',600,480,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=posDir(760,300,{g:seg(p,.55,.7)});
  return s;
 },
 [K+'ex2']:(p)=>{
  const x=860-120*seg(p,0,1);
  let s=ground(60,1140,420)+movingCart(x,420,-3,{vg:seg(p,.05,.2),pg:seg(p,.45,.6),vl:'−3.0 m/s',pl:'p ＝ −6.0'});
  s+=posDir(90,70);
  s+=card(40,110,480,150,T2(`${Pt}=2.0\\times(-3.0)`,280,165,{size:40,auto:false})+fade(seg(p,.6,.75),T2('=-6.0\\ \\mathrm{kg\\cdot m/s}',280,225,{size:40,auto:false,color:PC})),seg(p,.4,.55),PC);
  return s;
 },
 [K+'sum0']:(p)=>{
  const u=seg(p,0,1)*70;
  let s=ground(60,1140,420)+posDir(470,60);
  s+=movingCart(260+u,420,3,{vl:'3.0 m/s',pl:'＋6.0'})+movingCart(940-u,420,-3,{vl:'−3.0 m/s',pl:'−6.0'});

  s+=fade(seg(p,.5,.65),T2('6.0+(-6.0)=0',600,140,{size:44,auto:false,color:PC}));
  return s;
 },
 [K+'sum0b']:(p)=>{
  // tip-to-tail on a line: +6 then −6
  const y=250,x0=420;
  let s=line(200,y+120,1000,y+120,{color:C.dim,w:2})+label('0',x0,y+155,{size:24,color:C.dim,anchor:'middle'})+line(x0,y+110,x0,y+130,{color:C.dim,w:3});
  s+=PA(x0,y,x0+6*PK*1.6,y,{g:seg(p,.05,.3),text:'＋6.0',dy:-20});
  s+=PA(x0+6*PK*1.6,y+40,x0,y+40,{g:seg(p,.35,.6),text:'−6.0',dy:40});
  s+=fade(seg(p,.65,.8),dot(x0,y+120,10,C.hi)+label('合計 0',x0-30,y+20,{size:30,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.2,.35),label('符号を 付けて 足す',600,80,{size:34,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'kcmp']:(p)=>{
  let s=ground(60,1140,420)+movingCart(330,420,3,{vl:'3.0 m/s',pg:.25})+movingCart(870,420,-3,{vl:'3.0 m/s',pg:.25});
  s+=card(330,30,540,130,T2(`${Kt}=\\tfrac12\\times 2.0\\times 3.0^2`,600,80,{size:40,auto:false})+fade(seg(p,.5,.65),T2('=9.0\\ \\mathrm{J}',600,135,{size:40,auto:false,color:KC})),seg(p,.1,.25),KC);
  s+=ebar(150,420,9,14,{g:seg(p,.65,.8),w:70,top:'9.0 J'})+ebar(1050,420,9,14,{g:seg(p,.65,.8),w:70,top:'9.0 J'});
  return s;
 },
 [K+'kcmp2']:(p)=>{
  let s=fade(.35,ground(60,1140,420)+movingCart(330,420,3,{pg:0})+movingCart(870,420,-3,{pg:0}));
  s+=ebar(560,420,9,14,{w:90,top:''})+fade(seg(p,.2,.4),`<g transform="translate(0 ${-126*seg(p,.2,.4)})">${ebar(560,420,9,14,{w:90,color:'#ffb070'})}</g>`);
  s+=fade(seg(p,.05,.2),label('負に ならない',900,180,{size:30,color:KC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('合計 18 J',560,130,{size:32,color:KC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'diff']:(p)=>{
  let s=card(80,80,480,250,label('運動量の 合計',320,145,{size:30,color:C.ink,anchor:'middle'})+T2('0\\ \\mathrm{kg\\cdot m/s}',320,240,{size:52,auto:false,color:PC}),seg(p,.05,.2),PC);
  s+=card(640,80,480,250,label('運動エネルギーの 合計',880,145,{size:30,color:C.ink,anchor:'middle'})+T2('18\\ \\mathrm{J}',880,240,{size:52,auto:false,color:KC}),seg(p,.15,.3),KC);
  s+=fade(seg(p,.6,.75),label('運動量 と エネルギー は 別の 量',600,420,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 力積＝運動量の変化 =================
 [K+'der0']:(p)=>{
  let s=card(380,60,440,140,T2('ma=F',600,135,{size:64}),seg(p,.4,.55),C.F);
  s+=fade(seg(p,.05,.2),label('運動量を 変えるには 何が 要る？',600,300,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('運動方程式 から 考える',600,380,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'der1']:(p)=>{
  const gy=330,u=seg(p,.2,.9),x=260+520*u*u;
  let s=ground(60,1140,gy)+mcart(x,gy,{text:'m'});
  s+=FA(x+80,gy-40,x+190,gy-40,{text:'F（一定）',size:24,dy:-18,g:seg(p,.1,.25)});
  s+=fade(seg(p,.25,.4),VA(200,gy-140,290,gy-140)+label('v₀',245,gy-158,{size:28,color:C.v,anchor:'middle',weight:700})+label('はじめ',245,gy-200,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),VA(760,gy-140,960,gy-140)+label('v',860,gy-158,{size:28,color:C.v,anchor:'middle',weight:700})+label('あと',860,gy-200,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),line(260,gy+50,780,gy+50,{color:C.t,w:3})+line(260,gy+40,260,gy+60,{color:C.t,w:3})+line(780,gy+40,780,gy+60,{color:C.t,w:3})+label('時間 Δt',520,gy+92,{size:28,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 [K+'der2']:(p)=>{
  let s=chain(0,p);
  s+=fade(seg(p,.4,.55),label('加速度の 定義（02）',780,80,{size:26,color:C.dim}));
  return s;
 },
 [K+'der3']:(p)=>{
  let s=chain(1,p);
  s+=fade(seg(p,.05,.25),arrow(330,110,330,150,{color:C.hi,w:3,head:12})+label('a に 入れる',560,135,{size:26,color:C.hi}));
  return s;
 },
 [K+'der4']:(p)=>{
  let s=chain(2,p);
  s+=fade(seg(p,.05,.25),label('両辺 × Δt',780,276,{size:28,color:C.t,weight:700}));
  return s;
 },
 [K+'der5']:(p)=>{
  let s=chain(3,p);
  const W=texWidth(CH[3].src,40),w=texWidth('mv-mv_0',40),l=430-W/2;
  s+=fade(seg(p,.35,.5),`<rect x="${l-10}" y="312" width="${w+20}" height="54" rx="10" fill="none" stroke="${PC}" stroke-width="3"/>`);
  s+=fade(seg(p,.5,.65),label('あと − はじめ ＝ Δp',780,350,{size:28,color:PC,weight:700}));
  return s;
 },
 [K+'der6']:(p)=>{
  let s=fade(.45,chain(3,1));
  s+=card(300,385,420,100,T2(`F\\Delta t=${DP}`,510,440,{size:50}),seg(p,.05,.2),PC);
  s+=tag('結果',840,440,{g:seg(p,.5,.65)});
  return s;
 },
 [K+'imp']:(p)=>{
  let s=card(330,60,540,150,T2(`F\\Delta t=${DP}`,600,140,{size:66}),1,PC);
  const W=texWidth(`F\\Delta t=${DP}`,66),w=texWidth('F\\Delta t',66),l=600-W/2;
  s+=fade(seg(p,.1,.3),`<rect x="${l-12}" y="98" width="${w+24}" height="76" rx="12" fill="none" stroke="${C.hi}" stroke-width="3"/>`+label('力積',460,260,{size:40,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('力 × 時間',460,310,{size:28,color:C.ink,anchor:'middle'}));
  s+=tag('定義',460,380,{g:seg(p,.6,.75)});
  s+=fade(seg(p,.3,.45),label('運動量の 変化',760,260,{size:32,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'impunit']:(p)=>{
  let s=label('力積の 単位',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.2),T2('\\mathrm{N\\cdot s}',600,140,{size:52,auto:false,color:C.F}));
  s+=fade(seg(p,.3,.45),T2('1\\ \\mathrm{N}=1\\ \\mathrm{kg\\cdot m/s^2}',600,240,{size:44,auto:false}));
  s+=card(250,300,700,120,T2('\\mathrm{N\\cdot s}=\\mathrm{kg\\cdot m/s^2}\\times\\mathrm{s}=\\mathrm{kg\\cdot m/s}',600,360,{size:40,auto:false,color:PC}),seg(p,.6,.75),PC);
  return s;
 },
 [K+'imp2']:(p)=>{
  const gy=380,u=seg(p,.15,.85),x=250+450*u*u;
  let s=ground(60,1140,gy)+mcart(x,gy,{text:'m'});
  s+=FA(x+80,gy-40,x+190,gy-40,{text:'F',size:26,dy:-18,g:1-seg(p,.85,.95)});
  s+=PA(200,150,200+60+200*u,150,{text:'',g:1});
  s+=fade(seg(p,.05,.2),label('運動量 p',150,120,{size:26,color:PC,anchor:'start',weight:700}));
  s+=card(760,30,400,130,label('力積 FΔt の 分だけ',960,85,{size:28,color:C.ink,anchor:'middle'})+label('運動量が 変わる',960,130,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,.45,.6),PC);
  return s;
 },
 // ================= S4 時間をかけて止める =================
 [K+'stop']:(p)=>{
  const u=seg(p,.05,.5),x=200+460*(1-(1-u)**2);
  const v=3*(1-u);
  let s=ground(60,1140,420)+wall(1000,250,420)+mcart(x,420,{text:'2.0 kg'});
  if(v>.05)s+=VA(x+80,310,x+80+v*VK,310)+PA(x-90,250,x-90+2*v*PK,250)+label(`p ＝ ${(2*v).toFixed(1)}`,x-90+v*PK,230,{size:26,color:PC,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.6),label('止まった：p ＝ 0',x,230,{size:26,color:PC,anchor:'middle',weight:700}));
  s+=posDir(80,60);
  s+=card(560,30,600,130,T2(`${DP}=0-6.0`,860,82,{size:40,auto:false})+fade(seg(p,.75,.9),T2('=-6.0\\ \\mathrm{kg\\cdot m/s}',860,135,{size:38,auto:false,color:PC})),seg(p,.6,.75),PC);
  return s;
 },
 [K+'stop2']:(p)=>{
  let s=card(200,50,800,140,T2(`${DP}=-6.0\\ \\mathrm{kg\\cdot m/s}`,600,105,{size:44,auto:false})+label('どんな 止め方 でも 同じ',600,170,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),PC);
  s+=card(200,250,800,140,label('変えられる のは',600,305,{size:28,color:C.ink,anchor:'middle'})+label('止めるのに かける 時間 Δt',600,360,{size:34,color:C.t,anchor:'middle',weight:700}),seg(p,.5,.65),C.t);
  return s;
 },
 [K+'guess']:(p)=>{
  let s=card(60,50,500,330,label('0.010 s で 止める',310,110,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.05,.2),wall(470,170,330)+mcart(360,330,{text:'2.0 kg'})+label('力は？',190,220,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=card(640,50,500,330,label('0.20 s かけて 止める',890,110,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.3,.45));
  s+=fade(seg(p,.3,.45),rect(980,190,70,140,{fill:'#ffd6a0',fo:.45,stroke:'#ffd6a0',rx:30})+mcart(870,330,{text:'2.0 kg'})+label('力は？',760,220,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('どちらも Δp ＝ −6.0 kg·m/s',600,450,{size:30,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'calc1']:(p)=>{
  let s=T2(`F\\Delta t=${DP}`,300,90,{size:44});
  s+=fade(seg(p,.1,.25),label('両辺 ÷ Δt',300,160,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),T2(`F=\\dfrac{${DP}}{\\Delta t}`,300,260,{size:48}));
  s+=card(600,100,560,280,label('0.010 s で 止める',880,150,{size:28,color:C.t,anchor:'middle',weight:700})+fade(seg(p,.55,.7),T2('F=\\dfrac{-6.0}{0.010}',880,240,{size:44,auto:false}))+fade(seg(p,.75,.9),T2('=-600\\ \\mathrm{N}',880,330,{size:44,auto:false,color:Fc})),seg(p,.45,.55),C.F);
  return s;
 },
 [K+'calc2']:(p)=>{
  const cols=[{h:'かける 時間 Δt',color:C.t,w:300},{h:'力 F',color:C.F,w:260}];
  let s=table({x:80,y:80,cols,rows:[['0.010 s','−600 N'],['0.20 s','−30 N']],reveal:[1,seg(p,.05,.3)],size:34,rh:70});
  s+=card(720,90,420,240,label('時間 20倍',930,160,{size:34,color:C.t,anchor:'middle',weight:700})+label('↓',930,210,{size:30,color:C.dim,anchor:'middle'})+label('力の 大きさ 20分の1',930,270,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  s+=fade(seg(p,.2,.35),label('−6.0 ÷ 0.20 ＝ −30',360,370,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=ground(60,1140,400)+wall(980,240,400)+mcart(700,400,{text:'2.0 kg'})+posDir(80,60);
  s+=VA(780,280,880,280)+label('動き：右',830,262,{size:24,color:C.v,anchor:'middle',weight:700});
  s+=FA(620,350,470,350,{g:seg(p,.1,.3)})+fade(seg(p,.1,.3),label('力：左',545,320,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=card(80,130,420,110,label('F ＜ 0 ＝ 左向き',290,198,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'airbag']:(p)=>{
  // head-on into a hard wall vs into a cushion
  let s=card(60,40,500,380,label('硬い 壁',310,95,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.05,.2),wall(470,150,330)+ground(110,470,330)+mcart(380,330,{text:''})+FA(300,230,190,230,{text:'大きい 力',size:24,dy:-20,w:12,head:28})+label('短い 時間',310,390,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=card(640,40,500,380,label('エアバッグ・受け身',890,95,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.35,.5));
  s+=fade(seg(p,.35,.5),rect(980,150,90,180,{fill:'#ffd6a0',fo:.45,stroke:'#ffd6a0',rx:40})+ground(690,1100,330)+mcart(880,330,{text:''})+FA(820,230,760,230,{text:'小さい 力',size:24,dy:-20,w:6,head:18})+label('長い 時間',890,390,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('Δp は 同じ',600,470,{size:28,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis']:(p)=>{
  let s=card(170,60,860,120,label('エアバッグは 運動量の 変化を 小さくする',600,135,{size:32,color:C.dim,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.4,.5),line(210,128,990,128,{color:C.a,w:4})+label('誤解',1080,140,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=card(170,240,860,150,label('Δp は 同じ（−6.0 kg·m/s）',600,300,{size:32,color:PC,anchor:'middle',weight:700})+label('Δt が 長く なって、力が 小さく なる',600,360,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 // ================= S5 F-t グラフの面積 =================
 [K+'ft1']:(p)=>{
  const A=ftAxes(1,{ft:[],tt:[]});
  let s=A.svg+A.plot(bump,{from:0,to:.012,p:seg(p,.15,.75),color:C.F,w:5,steps:200});
  s+=card(760,60,400,170,label('衝突中の 力は',960,120,{size:28,color:C.ink,anchor:'middle'})+label('山の 形',960,180,{size:38,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 [K+'ft2']:(p)=>{
  const A=ftAxes(1,{ft:[[600,'F']],tt:[[.010,'Δt']]});
  let s=A.svg+fade(seg(p,.05,.2),line(A.X(0),A.Y(600),A.X(.01),A.Y(600),{color:C.F,w:5}));
  s+=fade(seg(p,.35,.5),rect(A.X(0),A.Y(600),A.X(.01)-A.X(0),A.Y(0)-A.Y(600),{fill:PC,fo:.3,stroke:PC,sw:2,rx:0}));
  s+=fade(seg(p,.5,.65),label('F × Δt',(A.X(0)+A.X(.01))/2,A.Y(300)+10,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=card(760,60,400,170,label('一定の 力なら',960,120,{size:28,color:C.ink,anchor:'middle'})+label('長方形 ＝ 力積',960,180,{size:34,color:PC,anchor:'middle',weight:700}),seg(p,.6,.75),PC);
  return s;
 },
 [K+'ft3']:(p)=>{
  const A=ftAxes(1,{ft:[],tt:[]});
  let s=A.svg+A.plot(bump,{from:0,to:.012,color:C.F,w:4,steps:200});
  s+=strips(A,bump,{t0:0,t1:.01,n:10,mode:'left',g:1,count:10*seg(p,.1,.5),color:PC,fo:.3});
  const i=4,a=i*.001,b=a+.001;
  s+=fade(seg(p,.55,.7),rect(A.X(a),A.Y(bump(a)),A.X(b)-A.X(a),A.Y(0)-A.Y(bump(a)),{fill:C.hi,fo:.25,stroke:C.hi,sw:3,rx:0}));
  s+=card(760,60,400,170,label('1本ずつ',960,120,{size:28,color:C.ink,anchor:'middle'})+label('F × 短い 時間',960,180,{size:34,color:PC,anchor:'middle',weight:700}),seg(p,.6,.75),PC);
  return s;
 },
 [K+'ft3b']:(p)=>{
  const A=ftAxes(1,{ft:[],tt:[]});
  let s=A.svg+fade(1-seg(p,.2,.5),strips(A,bump,{t0:0,t1:.01,n:10,mode:'left',color:PC,fo:.3}));
  s+=areaUnder(A,bump,0,.01,{color:PC,fo:.35,g:seg(p,.2,.5)})+A.plot(bump,{from:0,to:.012,color:C.F,w:4,steps:200});
  s+=card(760,60,400,170,label('全部 足すと',960,120,{size:28,color:C.ink,anchor:'middle'})+label('面積 ＝ 力積',960,180,{size:36,color:PC,anchor:'middle',weight:700}),seg(p,.5,.65),PC);
  return s;
 },
 [K+'ft4']:(p)=>{
  const A=ftAxes(1);
  let s=A.svg+A.plot(tri,{from:0,to:.012,p:seg(p,.1,.5),color:C.F,w:5,steps:240});
  s+=fade(seg(p,.5,.65),label('最大 1200 N',A.X(.005),A.Y(1200)-16,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('ハバ 0.010 s',A.X(.005),A.Y(250),{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=card(760,60,400,170,label('台車を 壁で 止める',960,120,{size:28,color:C.ink,anchor:'middle'})+label('三角形の モデル',960,180,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'ft4b']:(p)=>{
  const A=ftAxes(1);
  let s=A.svg+areaUnder(A,tri,0,.01,{color:PC,fo:.35,g:seg(p,.05,.2)})+A.plot(tri,{from:0,to:.012,color:C.F,w:5,steps:240});
  s+=card(740,40,430,250,T2('\\tfrac12\\times 0.010\\times 1200',955,105,{size:36,auto:false})+fade(seg(p,.3,.45),T2('=6.0\\ \\mathrm{N\\cdot s}',955,170,{size:42,auto:false,color:PC}))+fade(seg(p,.6,.75),label('Δp の 大きさ 6.0 と 一致',955,250,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25),PC);
  return s;
 },
 [K+'ft5']:(p)=>{
  const A=ftAxes(1);
  let s=A.svg+areaUnder(A,tri,0,.01,{color:PC,fo:.2})+A.plot(tri,{from:0,to:.012,color:C.F,w:4,steps:240});
  s+=fade(seg(p,.05,.25),rect(A.X(0),A.Y(600),A.X(.01)-A.X(0),A.Y(0)-A.Y(600),{fill:C.hi,fo:.18,stroke:C.hi,sw:3,rx:0}));
  s+=card(740,40,430,250,label('同じ 面積の 長方形',955,95,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.2,.35),T2('\\dfrac{6.0}{0.010}=600\\ \\mathrm{N}',955,175,{size:40,auto:false}))+fade(seg(p,.5,.65),label('平均の 力',955,255,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ft6']:(p)=>{
  const A=ftAxes(1,{x:100,w:380,h:300,y:430,tmax:.013,fmax:1350,ft:[[1200,'1200']],tt:[[.010,'0.010']],ylabel:'F [N]'});
  let s=A.svg+areaUnder(A,tri,0,.01,{color:PC,fo:.35})+A.plot(tri,{from:0,to:.012,color:C.F,w:4,steps:240});
  s+=label('壁',A.X(.0075),95,{size:28,color:C.ink,anchor:'middle',weight:700});
  const B=ftAxes(seg(p,.05,.2),{x:720,w:380,h:300,y:430,tmax:.26,fmax:40,ft:[[30,'30']],tt:[[.2,'0.20']],ylabel:'F [N]'});
  s+=B.svg+fade(seg(p,.2,.4),rect(B.X(0),B.Y(30),B.X(.2)-B.X(0),B.Y(0)-B.Y(30),{fill:PC,fo:.35,stroke:C.F,sw:3,rx:0}));
  s+=fade(seg(p,.05,.2),label('エアバッグ',B.X(.13),95,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('6.0 N·s',A.X(.005),A.Y(250),{size:26,color:C.ink,anchor:'middle',weight:700})+label('30 × 0.20 ＝ 6.0 N·s',B.X(.1),B.Y(15)+8,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('面積は 同じ',600,490,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'areas']:(p)=>{
  const mini=(x,xl,yl,xc,yc,fill,name,g,shape)=>{
   const A=axes({x,y:380,w:260,h:220,xmax:1.2,ymax:1.2,xlabel:xl,ylabel:yl,g,xcolor:xc,ycolor:yc});
   const pts=shape==='tri'?[[A.X(0),A.Y(0)],[A.X(.5),A.Y(1)],[A.X(1),A.Y(0)]]:[[A.X(0),A.Y(0)],[A.X(0),A.Y(.7)],[A.X(1),A.Y(.7)],[A.X(1),A.Y(0)]];
   return A.svg+fade(g,poly(pts,{fill,fo:.4,stroke:fill,sw:2})+label(name,A.X(.5),455,{size:32,color:fill,anchor:'middle',weight:700}));
  };
  let s=mini(90,'t','v',C.t,C.v,C.x,'変位',seg(p,.15,.3),'rect');
  s+=mini(480,'x','F',C.x,C.F,KC,'仕事',seg(p,.35,.5),'rect');
  s+=mini(870,'t','F',C.t,C.F,PC,'力積',seg(p,.55,.7),'tri');
  s+=fade(seg(p,.02,.12),label('面積の 意味は、軸で 決まる',600,60,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=ground(60,1140,420)+movingCart(380,420,3,{vl:'3.0 m/s',pl:'p ＝ 6.0'});
  s+=card(700,60,440,180,T2(`${Pt}=mv`,920,135,{size:62})+label('向きを 持つ 量',920,215,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),PC);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=card(80,80,500,260,label('力 × 距離 ＝ 仕事',330,150,{size:34,color:KC,anchor:'middle',weight:700})+label('↓',330,205,{size:30,color:C.dim,anchor:'middle'})+label('運動エネルギー K が 変わる',330,265,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),KC);
  s+=card(620,80,500,260,label('力 × 時間 ＝ 力積',870,150,{size:34,color:PC,anchor:'middle',weight:700})+label('↓',870,205,{size:30,color:C.dim,anchor:'middle'})+label('運動量 p が 変わる',870,265,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),PC);
  return s;
 },
 [K+'univ']:(p)=>{
  const A=ftAxes(.5,{x:110,w:420,h:300,y:430,ft:[],tt:[]});
  let s=A.svg+areaUnder(A,bump,0,.01,{color:PC,fo:.3,g:.6})+fade(.6,A.plot(bump,{from:0,to:.012,color:C.F,w:4,steps:200}));
  s+=card(620,120,520,200,label('大学編',880,180,{size:28,color:C.dim,anchor:'middle'})+label('グラフの 面積 → 積分',880,250,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  const u=seg(p,.05,.45),xa=300+240*u,xb=900-255*u,hit=seg(p,.47,.6),vo=1-seg(p,.36,.44);
  let s=ground(100,1100,420);
  s+=dot(xa,360,60,'#8fa6c9')+label('1',xa,370,{size:30,color:C.ink,anchor:'middle',weight:700})+dot(xb,375,45,'#c9a46a')+label('2',xb,385,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(vo,VA(xa-40,260,xa+60,260)+VA(xb+30,260,xb-60,260));
  s+=fade(hit,FA(660,270,780,270,{w:7,head:20})+FA(520,270,400,270,{w:7,head:20}));
  s+=card(250,40,700,150,label('互いに 与え合う 力積は',600,100,{size:30,color:C.ink,anchor:'middle'})+label('どう なって いる？',600,160,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(200,110,800,230,label('次の回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('運動量と力積',600,260,{size:52,color:C.hi,anchor:'middle',weight:700})+label('深く学ぶ 2/2 へ',600,315,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi),
};
