// 高校編「光子と電子・深く学ぶ 1/3」(ys-hs-a-photon-1) — 図。Stage 1200×515.
// 色：エネルギー E 橙、振動数 ν 桃（波の回の f と同じ）、波長 λ 水色、c 紫、h 白、光子 黄の粒、電子 青、電圧 V 紫、
//   出るのに必要なエネルギー（段）灰、光の色は 赤・紫外線（紫）で描く。
// 2/3・3/3・要点でも使う部品は export する（カード・タグ・T2・電子は前の単元の部品を読み込む）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,electron,POS,NEG} from './yt1-hs-e-current-1-diagrams.mjs';
import {tSince} from './yt1-hs-w-basics-1-diagrams.mjs';
export {card,tag,T2,sceneT,tSince,electron,POS,NEG};

const K='hs-a-photon-1:';
const PI=Math.PI;
export const EC=C.E, NC=C.p, LC=C.x, CC=C.v, PH=C.hi, W0C='#9aabc7', KC='#ffd6a0', VC=C.v, QC=C.p;
export const RED='#ff6b6b', UV='#b98cff', GRN='#6be08a', WHITE='#fff2b8', METAL='#8795ad';
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const Et=cs(EC,'E'), nut=cs(NC,'\\nu'), lt=cs(LC,'\\lambda'), ct=cs(CC,'c'), ht='h', Wt=cs(W0C,'W_0'), Kt=cs(KC,'K_{\\max}'), n0t=cs(NC,'\\nu_0');
export const U=s=>`\\ \\mathrm{${s}}`;
export const TX=(src,x,y,o={})=>tex(src,x,y,{size:44,auto:false,...o});
export const P10=(m,e)=>`${m}\\times 10^{${e}}`;
export const H_=`6.6\\times 10^{-34}`, E19=`1.6\\times 10^{-19}`;
const bigL=(s,x,y,{size=32,color=C.ink,g=1,anchor='middle'}={})=>fade(g,label(s,x,y,{size,color,anchor,weight:700}));
export {bigL};
// ---- pictures ------------------------------------------------------------------------------------
export function metal(x,y,w,{h=46,g=1,text='金属',tx=null}={}){
 let s=rect(x,y,w,h,{fill:METAL,fo:.35,stroke:C.dim,sw:2.5,rx:4});
 for(let q=x+18;q<x+w-10;q+=34)s+=line(q,y+h-10,q+14,y+10,{color:'#5b6780',w:2});
 if(text)s+=label(text,tx??x+w/2,y+h+34,{size:26,color:C.dim,anchor:'middle',weight:700});
 return fade(g,s);
}
// a light ray drawn as a wavy arrow from (x0,y0) to (x1,y1)
export function wavy(x0,y0,x1,y1,{color=WHITE,amp=9,lam=34,ph=0,w=4,g=1,head=16}={}){
 const L=Math.hypot(x1-x0,y1-y0),ux=(x1-x0)/L,uy=(y1-y0)/L,nx=-uy,ny=ux;const pts=[];
 for(let s=0;s<=L-head;s+=3){const o=amp*Math.sin(2*PI*(s/lam-ph));pts.push([x0+ux*s+nx*o,y0+uy*s+ny*o]);}
 const bx=x1-ux*head,by=y1-uy*head;
 return fade(g,draw(pts,1,{color,w})+poly([[x1,y1],[bx+nx*head*.5,by+ny*head*.5],[bx-nx*head*.5,by-ny*head*.5]],{fill:color,fo:1}));
}
export const photon=(x,y,{r=11,color=PH,g=1}={})=>fade(g,ring(x,y,r+7,{color,w:2})+dot(x,y,r,color));
// electrons leaving the surface y between x0..x1 (deterministic loop). returns {svg,count}
export function emit(t,{x0=400,x1=800,y=380,n=6,period=1.6,speed=240,g=1,start=0,ang=62,r=12}={}){
 let s='';const tt=t-start;if(tt<0)return {svg:'',count:0};
 const dt=period/n;
 for(let i=0;i<n;i++){const t0=i*dt;if(tt<t0)continue;const tau=((tt-t0)%period);
  const fr=(i*.618)%1,xi=mix(x0,x1,fr),a=(ang+(fr-.5)*40)*PI/180;
  const x=xi+speed*tau*Math.cos(a)*(fr<.5?-1:1),yy=y-14-speed*tau*Math.sin(a);
  s+=electron(x,yy,{r,op:clamp(1.4-tau/period*1.2)});}
 return {svg:fade(g,s),count:Math.floor(tt/dt)+1};
}
// light source box with two knobs (colour, brightness). kc, kb: pointer turn 0..1
export function source(x,y,{g=1,col=WHITE,kc=0,kb=0,knobs=1,hc=0,hb=0}={}){
 let s=rect(x-90,y-55,180,110,{fill:'#1d2a45',fo:1,stroke:C.dim,sw:2.5,rx:14})+ring(x+90,y,26,{color:col,w:4,fill:'#0b1122'})+dot(x+90,y,16,col,.85);
 s+=label('光源',x-10,y+10,{size:26,color:C.dim,anchor:'middle',weight:700});
 if(knobs){const kn=(kx,u,txt,hl)=>{const a=(-135+270*u)*PI/180;return (hl?ring(kx,y+100,34,{color:C.hi,w:3}):'')+ring(kx,y+100,24,{color:C.ink,w:3,fill:'#24324f'})+line(kx,y+100,kx+18*Math.sin(a),y+100-18*Math.cos(a),{color:C.hi,w:4})+label(txt,kx,y+160,{size:24,color:C.ink,anchor:'middle',weight:700});};
  s+=kn(x-50,kc,'色',hc)+kn(x+50,kb,'明るさ',hb);}
 return fade(g,s);
}
// visible spectrum bar + ultraviolet part. frequency grows to the right.
export function spectrum(x,y,w,h,{g=1,uv=1,uvhl=0,arrowLab=1}={}){
 const id='spg';const wv=w*.78;
 let s=`<defs><linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#ff4b4b"/><stop offset=".2" stop-color="#ff9a3c"/><stop offset=".38" stop-color="#ffe34d"/><stop offset=".56" stop-color="#5fd068"/><stop offset=".76" stop-color="#4aa3ff"/><stop offset="1" stop-color="#8a5cff"/></linearGradient></defs>`;
 s+=`<rect x="${x}" y="${y}" width="${wv}" height="${h}" rx="6" fill="url(#${id})"/>`;
 s+=label('赤',x+20,y+h+36,{size:26,color:RED,weight:700})+label('緑',x+wv*.55,y+h+36,{size:26,color:GRN,anchor:'middle',weight:700})+label('紫',x+wv-10,y+h+36,{size:26,color:UV,anchor:'end',weight:700});
 if(uv){let u=rect(x+wv+6,y,w-wv-6,h,{fill:'#3a2a66',fo:.9,stroke:UV,sw:2,rx:6});for(let q=x+wv+16;q<x+w-6;q+=18)u+=line(q,y+h-6,q+12,y+6,{color:UV,w:2,opacity:.6});
  u+=label('紫外線',x+wv+(w-wv)/2+3,y+h+36,{size:26,color:UV,anchor:'middle',weight:700});s+=fade(uv,u);
  if(uvhl)s+=fade(uvhl,rect(x+wv,y-8,w-wv+6,h+16,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8})+label('目に 見えない',x+wv+(w-wv)/2,y-22,{size:24,color:C.hi,anchor:'middle',weight:700}));}
 if(arrowLab)s+=arrow(x,y+h+70,x+w,y+h+70,{color:NC,w:4,head:16})+label('振動数 小',x,y+h+108,{size:24,color:NC,weight:700})+label('振動数 大',x+w,y+h+108,{size:24,color:NC,anchor:'end',weight:700});
 return fade(g,s);
}
// an energy bar (photon energy) standing on base at x. val in eV, k px per eV
export function ebar(x,base,val,k,{w=70,g=1,stroke=EC,fill=EC,fo=.5,top='',tcol=null,bottom='',bcol=C.ink,size=26}={}){
 const h=val*k;
 return fade(g,rect(x-w/2,base-h,w,h,{fill,fo,stroke,sw:2.5,rx:5})+(top?label(top,x,base-h-12,{size,color:tcol??stroke,anchor:'middle',weight:700}):'')+(bottom?label(bottom,x,base+34,{size:24,color:bcol,anchor:'middle',weight:700}):''));
}
// the "step" (energy needed to get out): a grey block of height val (eV) from xs to xe
export function stepBlock(xs,xe,base,val,k,{g=1,text='',dash=1,x0=60,lineTo=null}={}){
 const h=val*k;let s=rect(xs,base-h,xe-xs,h,{fill:W0C,fo:.28,stroke:W0C,sw:2.5,rx:4});
 if(dash)s+=line(lineTo??x0,base-h,xs,base-h,{color:W0C,w:2.5,dash:'8 8'});
 if(text)s+=label(text,(xs+xe)/2,base-h/2+10,{size:28,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
export const base=(x0,x1,y,g=1)=>fade(g,line(x0,y,x1,y,{color:C.dim,w:3}));
export const cross=(x,y,{s=26,g=1,color=C.a}={})=>fade(g,line(x-s,y-s,x+s,y+s,{color,w:6})+line(x-s,y+s,x+s,y-s,{color,w:6}));
export const check=(x,y,{s=26,g=1,color=GRN}={})=>fade(g,draw([[x-s,y],[x-s*.3,y+s*.7],[x+s,y-s*.8]],1,{color,w:7}));
// counter card
export const counter=(x,y,n,{g=1,w=250,text='出た 電子'}={})=>card(x,y,w,110,label(text,x+w/2,y+40,{size:24,color:C.dim,anchor:'middle'})+label(`${n} 個`,x+w/2,y+92,{size:42,color:NEG,anchor:'middle',weight:700}),g,NEG);
// a calculation line (left aligned TeX)
export const cl=(src,x,y,g=1,o={})=>fade(g,TX(src,x,y,{anchor:'start',size:40,...o}));
// a small two-plate gap with voltage V: electron goes from − plate (left) to ＋ plate (right)
export function gap(x,y,{g=1,u=0,w=360,h=200,volt='1 V',showE=1}={}){
 let s=rect(x-12,y-h/2,12,h,{fill:NEG,fo:.35,stroke:NEG,sw:2,rx:3})+rect(x+w,y-h/2,12,h,{fill:POS,fo:.35,stroke:POS,sw:2,rx:3});
 s+=label('−',x-6,y-h/2-14,{size:30,color:NEG,anchor:'middle',weight:700})+label('＋',x+w+6,y-h/2-14,{size:30,color:POS,anchor:'middle',weight:700});
 s+=line(x,y+h/2+36,x+w,y+h/2+36,{color:VC,w:3})+line(x,y+h/2+24,x,y+h/2+48,{color:VC,w:3})+line(x+w,y+h/2+24,x+w,y+h/2+48,{color:VC,w:3})+label(`電位差 ${volt}`,x+w/2,y+h/2+80,{size:28,color:VC,anchor:'middle',weight:700});
 const ex=x+24+(w-130)*u*u;s+=electron(ex,y,{r:16});
 if(u>.05)s+=arrow(ex+20,y,ex+20+30+40*u,y,{color:NEG,w:4,head:14});
 return fade(g,s);
}

// ================================ diagrams =================================================
const metalPE=(t,{g=1,on=1,col=WHITE,start=0,n=6,lab=1}={})=>{
 let s=metal(330,390,540,{g});
 for(let i=0;i<3;i++)s+=wavy(150+i*40,60+i*30,430+i*90,380,{color:col,ph:t*1.2,g:g*on});
 if(on)s+=emit(t,{x0:450,x1:760,y:390,n,start,g}).svg;
 if(lab)s+=fade(g*on,label('光',190,60,{size:30,color:col,weight:700})+label('電子',930,190,{size:30,color:NEG,weight:700}));
 return s;
};
export const hsAPhoton1Diagrams={
 // ================= S1 コンデンサーからの問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  // left: a wire with a battery pushing electrons
  const g1=seg(p,0,.15);
  s+=fade(g1,line(60,250,520,250,{color:C.dim,w:4})+line(60,170,60,250,{color:C.dim,w:4})+line(520,170,520,250,{color:C.dim,w:4})+line(60,170,250,170,{color:C.dim,w:4})+line(330,170,520,170,{color:C.dim,w:4}));
  s+=fade(g1,line(272,140,272,200,{color:C.ink,w:5})+line(306,152,306,188,{color:C.ink,w:10})+label('電池',290,120,{size:24,color:C.dim,anchor:'middle'}));
  for(let i=0;i<5;i++){const x=80+((t*70+i*90)%420);s+=fade(g1,electron(x,250,{r:12}));}
  s+=bigL('電圧で 押す',290,330,{size:30,color:VC,g:seg(p,.1,.25)});
  // right: light only
  const g2=seg(p,.45,.6);
  s+=metal(700,390,400,{g:g2});
  for(let i=0;i<2;i++)s+=wavy(650+i*60,90,800+i*90,380,{color:WHITE,ph:t*1.2,g:g2});
  s+=fade(g2,emit(t,{x0:820,x1:1000,y:390,n:4,start:0}).svg);
  s+=bigL('光を 当てるだけ',900,70,{size:30,color:WHITE,g:g2});
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=metalPE(t,{g:seg(p,0,.15)});
  s+=card(560,120,600,130,label('光は 電子に',860,172,{size:32,color:C.ink,anchor:'middle',weight:700})+label('どうやって エネルギーを 渡す？',860,226,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.25,.4),C.hi);
  return s;
 },
 [K+'pe']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=metalPE(t,{g:seg(p,0,.15)});
  s+=bigL('光電効果',700,70,{size:40,color:C.hi,g:seg(p,.55,.7)});
  s+=tag('実験',860,58,{color:C.dim,g:seg(p,.6,.75)});
  return s;
 },
 [K+'plan']:(p)=>{
  const items=[['実験','光電効果',C.dim],['法則','光子',PH],['計算','eV で 比べる',EC]];let s='';
  items.forEach(([a,b,c],i)=>{const x=80+i*370,o=seg(p,.1+i*.2,.25+i*.2);s+=card(x,170,300,170,label(a,x+150,235,{size:30,color:c,anchor:'middle',weight:700})+label(b,x+150,295,{size:30,color:C.ink,anchor:'middle',weight:700}),o,c);
   if(i<2)s+=fade(seg(p,.25+i*.2,.35+i*.2),arrow(x+305,255,x+365,255,{color:C.dim,w:4,head:14}));});
  return s;
 },
 // ================= S2 実験：2つのつまみ =================
 [K+'knobs']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=source(200,170,{g:seg(p,0,.15),kc:.3+.2*Math.sin(t),kb:.5,hc:seg(p,.35,.45),hb:seg(p,.6,.7)});
  s+=fade(seg(p,.05,.2),wavy(300,170,640,300,{color:WHITE,ph:t*1.2})+metal(560,310,520,{}));
  return s;
 },
 [K+'color']:(p)=>spectrum(110,150,980,70,{g:seg(p,0,.2),uv:seg(p,.6,.8)}),
 [K+'uvdef']:(p)=>spectrum(110,150,980,70,{uvhl:seg(p,.1,.3)}),
 [K+'bright']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  const pan=(x,n,txt,o)=>{let q=metal(x,400,420,{text:''});for(let i=0;i<n;i++)q+=wavy(x+40+i*(n>2?60:0),70,x+150+i*55,390,{color:GRN,ph:t*1.2,w:n>2?5:3,amp:n>2?12:6});return fade(o,q+label(txt,x+210,480,{size:28,color:C.ink,anchor:'middle',weight:700}));};
  s+=pan(100,1,'弱い 光',seg(p,.05,.2))+pan(660,5,'明るい 光',seg(p,.25,.4));
  s+=bigL('同じ 色（緑）',600,40,{size:28,color:GRN,g:seg(p,.5,.65)});
  return s;
 },
 [K+'pred']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=tag('仮の 考え：ふつうの 波',600,40,{color:C.dim,g:seg(p,0,.15)});
  const wv=(y,A,o,txt)=>{const pts=[];for(let x=80;x<=760;x+=4)pts.push([x,y-A*Math.sin(2*PI*(x/120-t*.8))]);return fade(o,draw(pts,1,{color:WHITE,w:4})+label(txt,80,y-A-22,{size:26,color:C.ink,weight:700}));};
  s+=wv(170,18,seg(p,.1,.25),'弱い 光：小さな 揺れ')+wv(370,60,seg(p,.4,.55),'明るい 光：大きな 揺れ');
  s+=fade(seg(p,.1,.25),rect(800,60,40,440,{fill:METAL,fo:.35,stroke:C.dim,sw:2.5,rx:4}));
  s+=card(870,300,300,120,label('エネルギーが',1020,350,{size:28,color:EC,anchor:'middle',weight:700})+label('多い',1020,400,{size:34,color:EC,anchor:'middle',weight:700}),seg(p,.65,.8),EC);
  return s;
 },
 [K+'pred2']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  s+=card(200,90,800,130,label('どんな 色でも、明るくすれば',600,145,{size:32,color:C.ink,anchor:'middle',weight:700})+label('いつかは 電子が 出る？',600,198,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=tag('予想',600,300,{color:C.hi,g:seg(p,.6,.75),size:30});
  return s;
 },
 [K+'exp1']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'exp1');let s=tag('実験',600,36,{color:C.dim,g:seg(p,0,.1)});
  s+=metal(60,400,460,{text:'',g:seg(p,0,.15)});
  for(let i=0;i<5;i++)s+=wavy(40+i*40,90,120+i*45,390,{color:RED,ph:t*1.2,w:6,amp:13,g:seg(p,.1,.25)});
  s+=bigL('とても 明るい 赤',180,80,{size:28,color:RED,g:seg(p,.1,.25)});
  s+=counter(340,180,0,{g:seg(p,.6,.75),w:220});
  return s;
 },
 [K+'exp2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'exp1'),t2=tSince(p,ctx,K+'exp2');let s=tag('実験',600,36,{});
  s+=metal(60,400,460,{text:''});
  for(let i=0;i<5;i++)s+=wavy(40+i*40,90,120+i*45,390,{color:RED,ph:t*1.2,w:6,amp:13});
  s+=bigL('とても 明るい 赤',180,80,{size:28,color:RED})+counter(340,180,0,{w:220});
  const g=seg(p,0,.15);
  s+=metal(660,400,480,{text:'',g});
  s+=wavy(700,90,840,390,{color:UV,ph:t*1.2,w:3,amp:6,g});
  s+=bigL('弱い 紫外線',800,90,{size:28,color:UV,g});
  const e=emit(t2,{x0:860,x1:1000,y:400,n:5,period:1.5,start:.4});
  s+=fade(g,e.svg)+counter(940,180,Math.min(e.count,99),{g,w:220});
  return s;
 },
 [K+'exp3']:(p)=>{
  let s='';const y=250,x0=100,x1=1100,xl=640;
  s+=fade(seg(p,0,.15),rect(x0,y-70,xl-x0,140,{fill:'#1b2a48',fo:.6,stroke:'none',rx:0})+rect(xl,y-70,x1-xl,140,{fill:'#2b3d22',fo:.45,stroke:'none',rx:0}));
  s+=fade(seg(p,0,.15),arrow(x0,y+70,x1,y+70,{color:NC,w:4,head:16})+label('振動数',x1,y+110,{size:26,color:NC,anchor:'end',weight:700}));
  s+=fade(seg(p,.3,.45),line(xl,y-110,xl,y+90,{color:C.hi,w:4,dash:'10 8'})+label('限界',xl,y-125,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=bigL('出ない',(x0+xl)/2,y-10,{size:34,color:C.ink,g:seg(p,.45,.6)})+bigL('いくら 明るくしても',(x0+xl)/2,y+36,{size:26,color:C.dim,g:seg(p,.6,.75)});
  s+=bigL('出る',(xl+x1)/2,y-10,{size:34,color:GRN,g:seg(p,.45,.6)})+bigL('弱くても',(xl+x1)/2,y+36,{size:26,color:C.dim,g:seg(p,.6,.75)});
  s+=fade(seg(p,.15,.3),dot(220,y+70,12,RED)+label('赤',220,y+150,{size:26,color:RED,anchor:'middle',weight:700})+dot(1000,y+70,12,UV)+label('紫外線',1000,y+150,{size:26,color:UV,anchor:'middle',weight:700}));
  s+=tag('実験 事実',1060,60,{color:C.dim,g:seg(p,.8,.9)});
  return s;
 },
 [K+'exp4']:(p)=>{
  let s='';const ax=(y,xl,name,o)=>fade(o,rect(220,y-34,xl-220,68,{fill:'#1b2a48',fo:.6,stroke:'none',rx:0})+rect(xl,y-34,1100-xl,68,{fill:'#2b3d22',fo:.45,stroke:'none',rx:0})+line(xl,y-48,xl,y+48,{color:C.hi,w:4,dash:'8 6'})+label(name,200,y+10,{size:28,color:C.ink,anchor:'end',weight:700})+label('出ない',(220+xl)/2,y+10,{size:26,color:C.dim,anchor:'middle',weight:700})+label('出る',(xl+1100)/2,y+10,{size:26,color:GRN,anchor:'middle',weight:700}));
  s+=ax(150,700,'ある 金属',seg(p,0,.2))+ax(310,300,'別の 材料',seg(p,.25,.45));
  s+=fade(seg(p,.05,.2),arrow(220,420,1100,420,{color:NC,w:4,head:16})+label('振動数',1100,460,{size:26,color:NC,anchor:'end',weight:700}));
  s+=fade(seg(p,.5,.65),line(360,100,360,420,{color:RED,w:3,dash:'4 6'})+dot(360,420,11,RED)+label('赤',360,470,{size:26,color:RED,anchor:'middle',weight:700}));
  s+=bigL('限界は 材料しだい',600,40,{size:30,color:C.hi,g:seg(p,.7,.85)});
  return s;
 },
 // ================= S3 光子：E＝hν =================
 [K+'ein']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=source(160,200,{knobs:0,g:seg(p,0,.15)});
  s+=metal(880,120,40,{h:300,text:'',g:seg(p,0,.15)});
  const g=seg(p,.4,.55);for(let i=0;i<6;i++){const x=270+((t*180+i*110)%600);s+=photon(x,200+((i*37)%3-1)*30,{g});}
  s+=bigL('エネルギーの 粒',560,360,{size:32,color:PH,g:seg(p,.55,.7)});
  return s;
 },
 [K+'photon']:(p)=>{
  let s=bigL('光子',600,50,{size:36,color:PH,g:seg(p,0,.15)});
  const items=[[RED,'赤',4.3],[GRN,'緑',5.6],[UV,'紫',7.5]];const b0=440,k=36;
  items.forEach(([c,n,v],i)=>{const x=330+i*270,o=seg(p,.3+i*.12,.45+i*.12);s+=fade(o,photon(x,b0+40,{color:c})+label(n,x+40,b0+50,{size:26,color:c,weight:700}))+ebar(x,b0,v*.6,k*1.3,{g:o,w:80});});
  s+=fade(seg(p,.7,.85),label('振動数が 大きいほど、1個の エネルギー',600,110,{size:28,color:C.ink,anchor:'middle',weight:700})+TX(`${Et}`,890,112,{size:40,color:EC})+label('が 大きい',920,110,{size:28,color:C.ink,weight:700}));
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(330,60,540,150,TX(`${Et}=${ht}\\,${nut}`,600,155,{size:72}),seg(p,0,.15),EC);
  s+=fade(seg(p,.45,.6),TX(`${ht}=${H_}${U('J\\cdot s')}`,600,290,{size:42}));
  s+=bigL('プランク定数',600,350,{size:26,color:C.dim,g:seg(p,.45,.6)});
  return s;
 },
 [K+'nu']:(p)=>{
  let s=card(330,60,540,150,TX(`${Et}=${ht}\\,${nut}`,600,155,{size:72}),1,EC)+TX(`${ht}=${H_}${U('J\\cdot s')}`,600,290,{size:42})+bigL('プランク定数',600,350,{size:26,color:C.dim});
  s+=card(330,385,540,100,TX(`${nut}`,420,450,{size:46})+label('（ニュー）＝ 波の回の',600,447,{size:26,color:C.ink,anchor:'middle',weight:700})+TX(cs(NC,'f'),790,450,{size:46}),seg(p,.05,.2),NC);
  return s;
 },
 [K+'law2']:(p)=>{
  let s=card(330,60,540,150,TX(`${Et}=${ht}\\,${nut}`,600,155,{size:72}),1,EC)+TX(`${ht}=${H_}${U('J\\cdot s')}`,600,290,{size:42});
  s+=tag('力学から 導いた 式ではない',600,370,{color:C.a,g:seg(p,.05,.2),size:26});
  s+=tag('法則（実験に 支えられる）',600,450,{color:C.hi,g:seg(p,.5,.65),size:28});
  return s;
 },
 [K+'one']:(p,ctx)=>{
  const u=lin(p,.1,.45),v=seg(p,.45,.6);let s=metal(100,380,1000,{text:'',g:seg(p,0,.1)});
  const ex=600,ey=360;
  s+=electron(ex,ey,{r:16});
  if(u<1)s+=photon(mix(240,ex-20,u),mix(140,ey-10,u))+ebar(mix(240,ex-20,u),mix(115,ey-30,u),1.8,60,{w:36});
  s+=ebar(ex+60,ey+5,1.8,60,{w:36,g:v});
  s+=bigL('1個を 丸ごと 受け取る',600,80,{size:32,color:C.hi,g:seg(p,.3,.45)});
  s+=card(820,140,330,150,label('足りなければ',985,195,{size:26,color:C.ink,anchor:'middle',weight:700})+label('何個 来ても 出ない',985,250,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.65,.8),C.a);
  return s;
 },
 [K+'knob2']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  s+=card(40,30,540,460,'',seg(p,0,.1))+card(620,30,540,460,'',seg(p,.45,.55));
  s+=bigL('明るさ ↑',310,80,{size:32,color:C.hi,g:seg(p,0,.15)})+bigL('光子の 個数が 増える',310,450,{size:28,color:PH,g:seg(p,.2,.35)});
  const nB=1+Math.floor(4*lin(p,.1,.35));for(let i=0;i<nB;i++)s+=photon(120+i*95,330,{g:seg(p,0,.15)})+ebar(120+i*95,300,1.8,45,{w:34,g:seg(p,0,.15)});
  s+=bigL('色 → 紫外線',890,80,{size:32,color:C.hi,g:seg(p,.45,.6)})+bigL('1個の エネルギーが 増える',890,450,{size:28,color:EC,g:seg(p,.65,.8)});
  const hv=mix(1.8,4.1,seg(p,.5,.75));s+=fade(seg(p,.45,.55),photon(890,370,{color:hv>3?UV:RED})+ebar(890,340,hv,52,{w:50}));
  return s;
 },
 [K+'note']:(p,ctx)=>{
  let s=fade(.35,hsAPhoton1Diagrams[K+'knob2'](1,ctx));
  s+=card(200,180,800,130,label('光子 2個を 同時に 受け取る 例外',600,235,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（とても 強い レーザー）→ 扱わない',600,285,{size:28,color:C.dim,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  return s;
 },
 // ================= S4 eV =================
 [K+'tiny']:(p)=>{
  let s=card(150,80,900,120,TX(`${Et}\\approx 10^{-19}${U('J')}`,600,155,{size:52}),seg(p,0,.15),EC);
  s+=fade(seg(p,.4,.6),TX(`=0.000\\,000\\,000\\,000\\,000\\,000\\,1${U('J')}`,600,290,{size:40}));
  s+=bigL('小さすぎて 扱いにくい',600,400,{size:30,color:C.dim,g:seg(p,.7,.85)});
  return s;
 },
 [K+'ev']:(p)=>{
  let s=gap(200,230,{g:seg(p,0,.15),u:lin(p,.35,.8)});
  s+=card(700,150,440,160,label('得る エネルギー',920,205,{size:28,color:C.ink,anchor:'middle',weight:700})+TX(`1${U('eV')}`,920,270,{size:52,color:EC}),seg(p,.6,.75),EC);
  s+=bigL('電子ボルト',920,350,{size:28,color:C.dim,g:seg(p,.7,.85)});
  return s;
 },
 [K+'ev2']:(p)=>{
  let s='';
  s+=card(150,60,900,110,label('エネルギーの 変化 ＝ 電荷 × 電位差',600,130,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=card(150,250,900,110,label('電子の 電荷の 大きさ',380,318,{size:30,color:QC,anchor:'middle',weight:700})+TX(`${E19}${U('C')}`,820,315,{size:42,color:QC}),seg(p,.5,.65),QC);
  return s;
 },
 [K+'ev3']:(p)=>{
  let s=card(80,50,1040,130,TX(`1${U('eV')}=${cs(QC,E19+U('C'))}\\times ${cs(VC,'1'+U('V'))}`,600,130,{size:46}),seg(p,0,.15),EC);
  s+=fade(seg(p,.25,.4),TX(`=${E19}${U('J')}`,600,250,{size:50,color:EC}));
  s+=card(250,320,700,110,TX(`\\mathrm{C}\\times\\mathrm{V}=\\mathrm{C}\\times\\dfrac{\\mathrm{J}}{\\mathrm{C}}=\\mathrm{J}`,600,385,{size:40}),seg(p,.6,.75),C.dim);
  return s;
 },
 [K+'conv']:(p)=>{
  let s='';const box=(x,txt,o)=>card(x,170,260,120,TX(txt,x+130,240,{size:52,color:EC}),o,EC);
  s+=box(150,'\\mathrm{J}',seg(p,0,.15))+box(790,'\\mathrm{eV}',seg(p,0,.15));
  s+=fade(seg(p,.1,.3),arrow(420,200,780,200,{color:C.hi,w:5,head:18})+TX(`\\div ${E19}`,600,160,{size:36}));
  s+=fade(seg(p,.55,.75),arrow(780,265,420,265,{color:C.hi,w:5,head:18})+TX(`\\times ${E19}`,600,330,{size:36}));
  return s;
 },
 // ================= S5 赤と紫外線 =================
 [K+'red']:(p,ctx)=>redCalc(p,ctx,0),
 [K+'red2']:(p,ctx)=>redCalc(p,ctx,1),
 [K+'red3']:(p,ctx)=>redCalc(p,ctx,2),
 [K+'red4']:(p,ctx)=>redCalc(p,ctx,3),
 [K+'uv']:(p,ctx)=>uvCalc(p,ctx,0),
 [K+'uv2']:(p,ctx)=>uvCalc(p,ctx,1),
 [K+'step']:(p)=>stepScene(p,0),
 [K+'redstep']:(p)=>stepScene(p,1),
 [K+'uvstep']:(p)=>stepScene(p,2),
 [K+'mis']:(p)=>{
  const b0=450,k=70;let s=base(60,1140,b0)+stepBlock(560,1100,b0,2.3,k,{text:'2.3 eV',x0:100});
  s+=ebar(300,b0,1.8,k,{w:70,stroke:RED})+ebar(300,b0-1.8*k,1.8,k,{w:70,stroke:RED,g:seg(p,.1,.3)});
  s+=label('1.8 eV',350,b0-1.8*k/2+10,{size:26,color:RED,weight:700})+fade(seg(p,.1,.3),label('1.8 eV',350,b0-1.8*k*1.5+10,{size:26,color:RED,weight:700}));
  s+=cross(300,b0-1.8*k*2-50,{s:34,g:seg(p,.45,.6)});
  s+=bigL('足し合わせては 越えられない',600,50,{size:32,color:C.a,g:seg(p,.55,.7)});
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(330,60,540,150,TX(`${Et}=${ht}\\,${nut}`,600,155,{size:72}),seg(p,0,.15),EC);
  s+=bigL('光子 1個ずつ 渡す',600,300,{size:34,color:PH,g:seg(p,.4,.55)});
  for(let i=0;i<4;i++)s+=photon(420+i*120,370,{g:seg(p,.45,.6)});
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=fade(.4,card(330,40,540,150,TX(`${Et}=${ht}\\,${nut}`,600,135,{size:72}),1,EC));
  s+=card(200,230,800,240,label('出るか どうかを 決めるのは',600,285,{size:30,color:C.ink,anchor:'middle',weight:700})+label('明るさ',420,395,{size:36,color:C.dim,anchor:'middle',weight:700})+label('振動数',780,395,{size:36,color:NC,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.3,.45),line(350,383,490,383,{color:C.a,w:5}))+fade(seg(p,.55,.7),rect(690,345,180,72,{fill:'none',fo:0,stroke:GRN,sw:5,rx:14}));
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=metal(100,420,500,{text:''});
  s+=wavy(150,200,320,410,{color:UV,ph:t*1.2});
  s+=fade(seg(p,.1,.25),electron(470,300,{r:16})+arrow(490,290,580,240,{color:NEG,w:4,head:14})+label('エネルギーは？',600,230,{size:28,color:C.hi,weight:700}));
  s+=card(660,280,480,130,label('明るくすると',900,330,{size:30,color:C.ink,anchor:'middle',weight:700})+label('何が 変わる？',900,385,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(330,170,540,150,label('次の 回',600,230,{size:30,color:C.dim,anchor:'middle'})+label('深く 学ぶ 2/3',600,290,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi),
};
// ---- calculation scenes -------------------------------------------------------------------------
function redStrip(t,{g=1,col=RED,lam=96,txt='700 nm'}={}){
 const pts=[];for(let x=80;x<=1120;x+=4)pts.push([x,80-26*Math.sin(2*PI*(x/lam-t*.6))]);
 let s=draw(pts,1,{color:col,w:4});
 const xa=200;s+=line(xa,128,xa+lam,128,{color:LC,w:3})+line(xa,118,xa,138,{color:LC,w:3})+line(xa+lam,118,xa+lam,138,{color:LC,w:3})+label(txt,xa+lam+16,138,{size:26,color:LC,weight:700});
 return fade(g,s);
}
function redCalc(p,ctx,k){
 const t=sceneT(p,ctx);let s=redStrip(t,{g:k===0?seg(p,0,.15):1});
 const L=[
  `${lt}=700${U('nm')}=${P10('7.0','-7')}${U('m')}`,
  `${nut}=\\dfrac{${ct}}{${lt}}=\\dfrac{${P10('3.0','8')}}{${P10('7.0','-7')}}\\approx ${cs(NC,P10('4.3','14')+U('Hz'))}`,
  `${Et}=${ht}${nut}=${H_}\\times ${P10('4.3','14')}\\approx ${cs(EC,P10('2.8','-19')+U('J'))}`,
  `\\dfrac{${P10('2.8','-19')}}{${E19}}\\approx ${cs(EC,'1.8'+U('eV'))}`];
 const Y=[200,282,370,462];
 for(let i=0;i<=k;i++){const g=i<k?1:seg(p,.15,.35);s+=cl(L[i],110,Y[i],g,{size:i===1?36:38});}
 if(k===0)s+=fade(seg(p,.4,.55),label('ナノ ＝ 10⁻⁹',1080,205,{size:26,color:C.dim,anchor:'end'}));
 if(k===3)s+=fade(seg(p,.5,.65),photon(1000,450,{color:RED})+ebar(1060,480,1.8,50,{w:40,g:1}));
 return s;
}
function uvCalc(p,ctx,k){
 const t=sceneT(p,ctx);let s=redStrip(t,{g:k===0?seg(p,0,.15):1,col:UV,lam:41,txt:'短い 波長'});
 s+=cl(`${nut}=${cs(NC,P10('1.0','15')+U('Hz'))}`,110,215,k===0?seg(p,.1,.25):1);
 s+=cl(`${Et}=${H_}\\times ${P10('1.0','15')}=${cs(EC,P10('6.6','-19')+U('J'))}`,110,305,k===0?seg(p,.35,.55):1);
 if(k>=1){s+=cl(`\\dfrac{${P10('6.6','-19')}}{${E19}}\\approx ${cs(EC,'4.1'+U('eV'))}`,110,410,seg(p,.05,.25));
  s+=fade(seg(p,.45,.6),ebar(820,490,1.8,60,{w:70,stroke:RED,top:'赤 1.8',tcol:RED})+ebar(980,490,4.1,60,{w:70,stroke:UV,top:'紫外線 4.1',tcol:UV}));}
 return s;
}
function stepScene(p,k){
 const b0=450,kk=70;let s=base(60,1140,b0);
 s+=stepBlock(640,1100,b0,2.3,kk,{text:'2.3 eV',x0:100,g:k===0?seg(p,.2,.4):1});
 if(k===0)s+=fade(seg(p,.45,.6),label('電子が 出るのに 必要',870,b0-2.3*kk-18,{size:26,color:W0C,anchor:'middle',weight:700}));
 if(k===0)s+=electron(600,b0-18,{r:14,op:seg(p,0,.2)});
 if(k===1){for(let i=0;i<4;i++)s+=ebar(160+i*110,b0,1.8,kk,{w:60,stroke:RED,top:i===0?'1.8 eV':'',tcol:RED,g:seg(p,i*.12,.12+i*.12)});
  s+=bigL('赤の 光子',320,b0+40,{size:26,color:RED,g:seg(p,0,.15)});
  s+=cross(380,b0-2.3*kk-30,{s:30,g:seg(p,.5,.65)})+electron(600,b0-18,{r:14});}
 if(k===2){s+=fade(.35,ebar(160,b0,1.8,kk,{w:60,stroke:RED,top:'1.8 eV',tcol:RED}));
  s+=ebar(380,b0,4.1,kk,{w:70,stroke:UV,top:'4.1 eV',tcol:UV,g:seg(p,0,.15)})+bigL('紫外線の 光子',380,b0+40,{size:26,color:UV,g:seg(p,0,.15)});
  const u=seg(p,.35,.7);s+=electron(mix(600,820,u),b0-18-Math.sin(u*PI)*230-u*2.3*kk,{r:14});
  s+=check(520,b0-4.1*kk+10,{g:seg(p,.6,.75)});}
 return s;
}
