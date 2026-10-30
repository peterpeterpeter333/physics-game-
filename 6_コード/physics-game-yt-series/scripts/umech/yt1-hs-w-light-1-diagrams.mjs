// 高校編「光波・深く学ぶ 1/3」(ys-hs-w-light-1) — 図。Stage 1200×515.
// 色（波の基本と同じ）：λ 水色、f 桃、v・c 紫（どちらも速さ）、t 金、n 白、角 θ 橙、光 淡い黄、ガラス・水 青。
// 2/3・3/3・要点でも使う部品（媒質、法線、光の帯と波面、光線、角の弧）は export する。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,tSince,LC,FC,VCOL,TCOL,Lt,ft,HZ,MS,MM,SS} from './yt1-hs-w-basics-1-diagrams.mjs';
import {arc} from './yt1-hs-m-energy-1-diagrams.mjs';
export {card,tag,T2,sceneT,tSince,arc,LC,FC,VCOL,TCOL,Lt,ft,HZ,MS,MM,SS};

const K='hs-w-light-1:';
const PI=Math.PI, R=PI/180;
export const ANG='#ffb36b', LIGHT='#fff2b8', GLASS='#4a90d9', GLINE='#8fc3ff', SAND='#c9a46a';
export const ct=`{\\color{${VCOL}}c}`, vt=`{\\color{${VCOL}}v}`;
export const th=i=>`{\\color{${ANG}}\\theta_{${i}}}`;
export const vi=i=>`{\\color{${VCOL}}v_{${i}}}`;
export const E8='\\times 10^{8}';
// ---- media ------------------------------------------------------------------------------------
// horizontal boundary at y; the lower region is filled. Labels at the right end.
export function medium({y=260,x0=0,x1=1200,bot=515,g=1,upper='空気',lower='ガラス',fill=GLASS,fo=.22,lowFo=null,upFill=null,lx=1170}={}){
 let s=fade(g,rect(x0,y,x1-x0,bot-y,{fill,fo:lowFo??fo,stroke:'none',rx:0})+(upFill?rect(x0,0,x1-x0,y,{fill:upFill,fo,stroke:'none',rx:0}):'')+line(x0,y,x1,y,{color:GLINE,w:3}));
 if(upper)s+=fade(g,label(upper,lx,y-18,{size:26,color:upFill?GLINE:C.dim,anchor:'end',weight:700}));
 if(lower)s+=fade(g,label(lower,lx,y+42,{size:26,color:upFill?C.dim:GLINE,anchor:'end',weight:700}));
 return s;
}
export const normal=(x,y,{up=200,down=200,g=1,text='',tx=12}={})=>fade(g,line(x,y-up,x,y+down,{color:C.ink,w:2.5,dash:'8 8'})+(text?label(text,x+tx,y-up+26,{size:24,color:C.ink,weight:700}):''));
// refraction angle (deg) or null (total internal reflection)
export const refr=(t1,n1,n2)=>{const s=n1/n2*Math.sin(t1*R);return s>1+1e-9?null:Math.asin(Math.min(1,s))/R;};
// ---- light rays (thin): incident from the upper left into O, refracted below, reflected up-right ----
export function rays({O=[600,260],th1=30,n1=1,n2=1.5,la=300,lb=260,lr=260,g=1,trans=1,refl=0,color=LIGHT,w=6,head=18,heads=1}={}){
 const s1=Math.sin(th1*R),c1=Math.cos(th1*R),t2=refr(th1,n1,n2);
 const A=[O[0]-la*s1,O[1]-la*c1];let s='';
 s+=fade(g,line(A[0],A[1],O[0],O[1],{color,w}));
 if(heads)s+=arrow(mix(A[0],O[0],.4),mix(A[1],O[1],.4),mix(A[0],O[0],.55),mix(A[1],O[1],.55),{color,w,head,g});
 if(t2!==null&&trans>0){const s2=Math.sin(t2*R),c2=Math.cos(t2*R),B=[O[0]+lb*s2,O[1]+lb*c2];
  s+=fade(g*trans,line(O[0],O[1],B[0],B[1],{color,w}));
  if(heads)s+=arrow(mix(O[0],B[0],.45),mix(O[1],B[1],.45),mix(O[0],B[0],.6),mix(O[1],B[1],.6),{color,w,head,g:g*trans});}
 if(refl>0){const Rr=[O[0]+lr*s1,O[1]-lr*c1];
  s+=fade(g*refl,line(O[0],O[1],Rr[0],Rr[1],{color,w}));
  if(heads)s+=arrow(mix(O[0],Rr[0],.45),mix(O[1],Rr[1],.45),mix(O[0],Rr[0],.6),mix(O[1],Rr[1],.6),{color,w,head,g:g*refl});}
 return s;
}
// angle marks measured from the normal: 'in' (upper left), 'out' (lower right), 'refl' (upper right)
export function angMark(O,kind,deg,{r=70,text='',g=1,size=30,color=ANG,dr=34}={}){
 if(deg<=0.3)return '';
 let a0,a1;if(kind==='in'){a0=90;a1=90+deg;}else if(kind==='out'){a0=270;a1=270+deg;}else{a0=90-deg;a1=90;}
 const am=(a0+a1)/2*R,lx=O[0]+(r+dr)*Math.cos(am),ly=O[1]-(r+dr)*Math.sin(am);
 return fade(g,arc(O[0],O[1],r,a0,a1,{color,w:4})+(text?tex(text,lx,ly+10,{size,color,auto:false}):''));
}
// ---- a beam (a strip of light) with its crest lines (wavefronts) --------------------------------
// crests move with time t; λ below = λ above × n1/n2 (same frequency), direction from Snell's law.
export function beam({O=[600,260],th1=30,n1=1,n2=1.5,w=120,lam=56,t=0,T=1.6,la=330,lb=280,g=1,crest=1,fo=.13,edge=.6,color=LIGHT,cw=3,hlCrest=null}={}){
 const s1=Math.sin(th1*R),c1=Math.cos(th1*R),t2=refr(th1,n1,n2),s2=Math.sin(t2*R),c2=Math.cos(t2*R);
 const d1=[s1,c1],e1=[c1,-s1],d2=[s2,c2],e2=[c2,-s2],w2=w*c2/c1,lam2=lam*n1/n2;
 const P=(d,e,s,u)=>[O[0]+s*d[0]+u*e[0],O[1]+s*d[1]+u*e[1]];
 const sb1=u=>s1>1e-6?u*s1/c1:0, sb2=u=>s2>1e-6?u*s2/c2:0;
 const up=[P(d1,e1,-la,-w/2),P(d1,e1,sb1(-w/2),-w/2),P(d1,e1,sb1(w/2),w/2),P(d1,e1,-la,w/2)];
 const dn=[P(d2,e2,sb2(-w2/2),-w2/2),P(d2,e2,lb,-w2/2),P(d2,e2,lb,w2/2),P(d2,e2,sb2(w2/2),w2/2)];
 let s=fade(g,poly(up,{fill:color,fo})+poly(dn,{fill:color,fo}));
 s+=fade(g*edge,line(...up[0],...up[1],{color,w:2})+line(...up[3],...up[2],{color,w:2})+line(...dn[0],...dn[1],{color,w:2})+line(...dn[3],...dn[2],{color,w:2}));
 if(crest>0){
  const ph=t/T;
  for(let m=-40;m<40;m++){const k=m+ph-Math.floor(ph);
   const sA=lam*k, sB=lam2*k;const hl=hlCrest!==null&&m===hlCrest;
   const col=hl?C.hi:color, ww=hl?5:cw;
   if(sA>=-la){let lo=-w/2,hi=w/2;if(s1>1e-6)lo=Math.max(lo,sA*c1/s1);else if(sA>0)lo=hi+1;
    if(lo<hi)s+=fade(g*crest,line(...P(d1,e1,sA,lo),...P(d1,e1,sA,hi),{color:col,w:ww}));}
   if(sB<=lb){let lo=-w2/2,hi=w2/2;if(s2>1e-6)hi=Math.min(hi,sB*c2/s2);else if(sB<0)hi=lo-1;
    if(lo<hi)s+=fade(g*crest,line(...P(d2,e2,sB,lo),...P(d2,e2,sB,hi),{color:col,w:ww}));}
  }
 }
 return s;
}
// ---- a horizontal transverse wave crossing a vertical boundary (air left, glass right) ----------
// same period T on both sides; λ right = λ left / n. phase continuous at the boundary.
export const HW={x0:60,xb:600,x1:1140,y:270,A:62,lam:210,n:1.5,T:1.8};
export function hPhase(x,t,o=HW){return x<=o.xb?t/o.T-(x-o.x0)/o.lam:t/o.T-(o.xb-o.x0)/o.lam-(x-o.xb)/(o.lam/o.n);}
export function hDisp(x,t,o=HW){return o.A*Math.sin(2*PI*hPhase(x,t,o));}
export function hWave(t,{o=HW,g=1,color=LIGHT,w=5,medium:md=1,labels=1}={}){
 let s='';
 if(md)s+=fade(g,rect(o.xb,o.y-150,o.x1+60-o.xb,300,{fill:GLASS,fo:.22,stroke:'none',rx:0})+line(o.xb,o.y-150,o.xb,o.y+150,{color:GLINE,w:3}));
 if(labels)s+=fade(g,label('空気',o.x0+10,o.y-120,{size:26,color:C.dim,weight:700})+label('ガラス',o.x1,o.y-120,{size:26,color:GLINE,anchor:'end',weight:700}));
 s+=fade(g*.6,line(o.x0,o.y,o.x1,o.y,{color:C.faint,w:2,dash:'6 8'}));
 const pts=[];for(let x=o.x0;x<=o.x1+.1;x+=4)pts.push([x,o.y-hDisp(x,t,o)]);
 return s+fade(g,draw(pts,1,{color,w}));
}
// crest positions (phase ≡ 1/4 mod 1) at time t
export function hCrests(t,o=HW){const out=[];const lam2=o.lam/o.n;
 for(let m=-30;m<30;m++){const xL=o.x0+o.lam*(t/o.T-.25-m);if(xL>=o.x0&&xL<=o.xb)out.push(xL);
  const pb=t/o.T-(o.xb-o.x0)/o.lam;const xR=o.xb+lam2*(pb-.25-m);if(xR>o.xb&&xR<=o.x1)out.push(xR);}
 return out.sort((a,b)=>a-b);}
export const crestTri=(x,y,{g=1,color=VCOL,s=13}={})=>fade(g,poly([[x-s,y-s*1.6],[x+s,y-s*1.6],[x,y-2]],{fill:color,fo:1}));
// number of crests that passed position x between t0 and t
export const passed=(x,t0,t,o=HW)=>Math.max(0,Math.floor(hPhase(x,t,o)-.25)-Math.floor(hPhase(x,t0,o)-.25));
export function gate(x,y,n,{g=1,color=FC,h=170}={}){
 return fade(g,line(x,y-h/2,x,y+h/2,{color,w:3,dash:'3 6'})+rect(x-36,y-h/2-58,72,48,{fill:'#131f38',fo:.95,stroke:color,sw:2,rx:10})+label(String(n),x,y-h/2-22,{size:32,color,anchor:'middle',weight:700}));
}
// ---- small pictures ---------------------------------------------------------------------------
export function lamp(x,y,{g=1,r=18}={}){return fade(g,dot(x,y,r,'#fff7c2')+[0,1,2,3,4,5,6,7].map(i=>{const a=i*PI/4;return line(x+(r+8)*Math.cos(a),y+(r+8)*Math.sin(a),x+(r+20)*Math.cos(a),y+(r+20)*Math.sin(a),{color:'#fff7c2',w:3});}).join(''));}
function earth(x,y,r,g=1){return fade(g,dot(x,y,r,'#2f6fb5')+`<path d="M${x-r*.5} ${y-r*.3} q${r*.3} ${-r*.4} ${r*.6} ${-r*.1} q${r*.1} ${r*.4} ${-r*.2} ${r*.5} z" fill="#5fae6a" opacity=".9"/>`+`<path d="M${x+r*.1} ${y+r*.2} q${r*.4} ${-r*.1} ${r*.5} ${r*.3} q${-r*.2} ${r*.4} ${-r*.5} ${r*.1} z" fill="#5fae6a" opacity=".9"/>`);}
function moon(x,y,r,g=1){return fade(g,dot(x,y,r,'#cfd6e3')+dot(x-r*.3,y-r*.2,r*.22,'#aeb6c4')+dot(x+r*.3,y+r*.3,r*.15,'#aeb6c4'));}
function sun(x,y,r,g=1){return fade(g,dot(x,y,r,'#ffcf67')+ring(x,y,r+10,{color:'#ffcf67',w:3,dash:'4 8'}));}
function bolt(x,y,g=1){return fade(g,poly([[x,y],[x+34,y],[x+14,y+50],[x+40,y+50],[x-6,y+120],[x+8,y+66],[x-16,y+66]],{fill:'#fff2b8',fo:1}));}
function cup(x,y,{g=1,t=0}={}){ // a glass of water with a straw; bottom-left at (x,y)
 const w=300,h=300,wl=y-190;let s=rect(x,y-h,w,h,{fill:'#9fc7ef',fo:.08,stroke:'#cfe3f7',sw:3,rx:10});
 s+=rect(x+3,wl,w-6,y-wl-3,{fill:GLASS,fo:.35,stroke:'none',rx:6})+line(x+3,wl,x+w-3,wl,{color:GLINE,w:3});
 // straw: real line from (x+40,y-h-80) to the water line, then seen bent below the surface
 const P0=[x+20,y-h-70],P1=[x+110,wl],P2=[x+230,y-30];
 s+=line(...P0,...P1,{color:'#ff9a7a',w:12})+line(...P1,...P2,{color:'#ff9a7a',w:12});
 return fade(g,s);
}
// a lane race: pulses travelling at speeds proportional to v (px/s); restart every period
function lane(y,v,t,{name='',g=1,period=4,x0=230,x1=1100,color=LIGHT,fill=null,txt=''}={}){
 let s=fade(g,(fill?rect(x0,y-34,x1-x0,68,{fill,fo:.22,stroke:'none',rx:10}):'')+line(x0,y+34,x1,y+34,{color:C.faint,w:2})+label(name,x0-20,y+10,{size:28,color:fill?GLINE:C.ink,anchor:'end',weight:700}));
 const tt=((t%period)+period)%period,x=Math.min(x1-20,x0+20+v*tt);
 s+=fade(g,line(Math.max(x0,x-90),y,x,y,{color,w:10})+dot(x,y,12,'#fff7c2'));
 if(txt)s+=fade(g,tex(txt,x1+10,y+12,{size:32,color:VCOL,anchor:'start',auto:false}));
 return s;
}
// people walking right; slower (and closer) after x=xb
function queue(t,{g=1,y=300,x0=60,xb=600,x1=1140,v1=150,v2=100,period=1.2,gx=[420,820],hl=1}={}){
 let s=fade(g,rect(xb,y-70,x1+60-xb,140,{fill:SAND,fo:.25,stroke:'none',rx:0})+line(xb,y-70,xb,y+70,{color:SAND,w:3})+label('歩きやすい 道',x0+10,y-90,{size:26,color:C.dim,weight:700})+label('歩きにくい 道',x1,y-90,{size:26,color:SAND,anchor:'end',weight:700}));
 for(let k=0;k<40;k++){const age=t-(k*period)+40*period;const tk=((t/period)%1+1)%1;
  const a=(tk+k)*period;let x=x0+v1*a;if(x>xb)x=xb+(x-xb)*v2/v1;if(x>x1)continue;
  s+=fade(g,dot(x,y-26,13,'#ffd6a0')+rect(x-12,y-12,24,44,{fill:'#ffd6a0',fo:.85,stroke:'none',rx:8}));}
 return s;
}
function three(p,ga=1){
 const items=[['速さ',`${vt}`,VCOL],['波長',`${Lt}`,LC],['振動数',`${ft}`,FC]];
 let s='';items.forEach(([a,b,c],i)=>{const x=110+i*350,o=seg(p,.1+i*.18,.25+i*.18)*ga;
  s+=card(x,300,280,150,label(a,x+140,355,{size:32,color:c,anchor:'middle',weight:700})+tex(b+'\\ ?',x+140,420,{size:46,auto:false}),o,c);});
 return s;
}
// scene time at which the crest counters start (the middle of the 'gate' cue)
function countStart(p,ctx){if(!ctx||!ctx.scene||!ctx.scene.captions)return 4;const i=ctx.scene.cues.findIndex(c=>c.diagram===K+'gate');const c=ctx.scene.captions[i];return c?c.start+(c.end-c.start)*.45:4;}
// formula row helper
const F=(src,x,y,size=46,o={})=>tex(src,x,y,{size,...o});

export const hsWLight1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  const vs=55,c0=150;
  for(let k=0;k<8;k++){const te=k*.55;if(te>t)continue;const cx=260+vs*te,r=c0*(t-te);if(r>900)continue;s+=fade(seg(p,0,.1)*clamp(1-r/900),ring(cx,280,r,{color:LIGHT,w:3}));}
  s+=lamp(260+vs*t,280,{g:seg(p,0,.1)});
  s+=fade(seg(p,.15,.3),label('前回：ドップラー効果',600,70,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('光も 波',600,470,{size:34,color:LIGHT,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=medium({y:300,g:seg(p,0,.15)});
  s+=beam({O:[600,300],th1:0,w:160,la:300,lb:215,t,g:seg(p,.05,.2)});
  s+=card(170,40,560,110,label('ガラスの 中で 何が 変わる？',450,108,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  return s;
 },
 [K+'straw']:(p,ctx)=>{
  let s=cup(420,470,{g:seg(p,0,.15)});
  s+=fade(seg(p,.25,.4),arrow(830,250,560,280,{color:C.hi,w:4,head:14})+label('水面で 折れて 見える',850,240,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.6,.75),label('光の 進み方が 変わる',850,320,{size:28,color:LIGHT,weight:700}));
  return s;
 },
 [K+'pred']:(p,ctx)=>{
  let s=fade(.35,cup(450,250,{}));
  s+=card(200,20,800,90,label('ガラスや 水の 中で 変わるのは？',600,80,{size:34,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=three(p);
  return s;
 },
 // ================= S2 光の速さ =================
 [K+'c']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=card(200,60,800,150,F(`${ct}\\approx 3.0${E8}${MS}`,600,150,56,{auto:false}),seg(p,.05,.2),VCOL);
  s+=tag('測定値',1080,90,{color:C.dim,g:seg(p,.55,.7)});
  s+=fade(seg(p,.1,.25),label('真空中の 光の 速さ',600,40,{size:26,color:C.dim,anchor:'middle'}));
  const x=((t*700)%1300)-100;s+=fade(seg(p,.2,.3),line(Math.max(0,x-200),330,x,330,{color:LIGHT,w:8})+dot(x,330,10,'#fff7c2'));
  return s;
 },
 [K+'c2']:(p,ctx)=>{
  let s=card(160,40,880,110,F('10^{8}=100\\,000\\,000',600,108,46,{auto:false}),seg(p,0,.15),C.dim);
  s+=fade(seg(p,.2,.35),label('（1億）',1010,108,{size:28,color:C.dim,anchor:'end'}));
  s+=card(160,210,880,110,F(`3.0${E8}\\ \\mathrm{m}=300\\,000\\,000\\ \\mathrm{m}`,600,278,44,{auto:false}),seg(p,.45,.6),VCOL);
  s+=fade(seg(p,.7,.85),label('＝ 30万 km（1秒あたり）',600,400,{size:34,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c3']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'c3');
  let s=earth(420,280,140,seg(p,0,.15));
  s+=fade(seg(p,.05,.2),label('1周 約4万 km',420,500,{size:28,color:C.ink,anchor:'middle',weight:700}));
  const laps=Math.min(7.5,7.5*lin(p,.25,.85)),a=laps*2*PI;
  const pts=[];const n=Math.round(laps*60);for(let i=0;i<=n;i++){const b=a*i/Math.max(1,n);pts.push([420+170*Math.sin(b),280-170*Math.cos(b)]);}
  if(laps>0)s+=draw(pts.slice(-30),1,{color:LIGHT,w:5})+dot(420+170*Math.sin(a),280-170*Math.cos(a),10,'#fff7c2');
  s+=card(720,140,400,150,label('1秒で',920,195,{size:28,color:C.dim,anchor:'middle'})+label(`約 ${(Math.floor(laps*2)/2).toFixed(1)} 周`,920,258,{size:44,color:LIGHT,anchor:'middle',weight:700}),seg(p,.2,.35),LIGHT);
  s+=fade(seg(p,.85,.95),label('30万 ÷ 4万 ＝ 7.5',920,350,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'time']:(p,ctx)=>{
  let s=card(240,50,720,120,label('時間 ＝ 距離 ÷ 速さ',600,128,{size:44,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),TCOL);
  s+=bolt(180,240,seg(p,.5,.65))+fade(seg(p,.55,.7),label('音波の 回：雷まで 1020 m、音は 3.0 秒',260,330,{size:30,color:C.dim}));
  return s;
 },
 [K+'thun']:(p,ctx)=>{
  let s=bolt(100,60,1)+fade(1,label('1020 m',230,110,{size:30,color:C.ink,weight:700}));
  s+=card(220,190,760,150,F('\\dfrac{1020}{3.0\\times10^{8}}',420,268,46,{auto:false}),seg(p,.1,.25),VCOL);
  s+=fade(seg(p,.55,.7),F(`\\approx 3.4\\times10^{-6}${SS}`,730,282,46,{auto:false}));
  return s;
 },
 [K+'thun2']:(p,ctx)=>{
  let s=card(80,40,1040,110,F(`3.4\\times10^{-6}${SS}=\\dfrac{3.4}{1\\,000\\,000}${SS}`,600,100,40,{auto:false}),1,VCOL);
  const X0=240,k=240; // 1 s = 240 px
  s+=fade(seg(p,.35,.5),label('光',X0-20,262,{size:30,color:LIGHT,anchor:'end',weight:700})+line(X0,250,X0+2,250,{color:LIGHT,w:22})+label('ほぼ 0',X0+20,262,{size:28,color:LIGHT,weight:700}));
  s+=fade(seg(p,.35,.5),label('音',X0-20,362,{size:30,color:VCOL,anchor:'end',weight:700}))+fade(seg(p,.35,.5),rect(X0,336,k*3.0*lin(p,.35,.7),30,{fill:VCOL,fo:.6,stroke:'none'}));
  s+=fade(seg(p,.65,.75),label('3.0 秒',X0+k*3+15,362,{size:28,color:VCOL,weight:700}));
  s+=fade(seg(p,.35,.5),line(X0,410,X0+k*3,410,{color:C.dim,w:2})+[0,1,2,3].map(i=>line(X0+k*i,402,X0+k*i,418,{color:C.dim,w:2})+label(`${i} s`,X0+k*i,450,{size:22,color:C.dim,anchor:'middle'})).join(''));
  return s;
 },
 [K+'moon']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'moon');
  let s=earth(140,190,70)+moon(1060,190,28);
  s+=fade(seg(p,.05,.2),line(210,300,1032,300,{color:C.x,w:3})+line(210,288,210,312,{color:C.x,w:3})+line(1032,288,1032,312,{color:C.x,w:3})+tex(`3.8${E8}\\ \\mathrm{m}`,620,345,{size:34,color:C.x,auto:false}));
  const u=((t/1.3)%1.6)/1.0,x=210+822*Math.min(1,u);if(u<=1)s+=fade(seg(p,.1,.2),line(Math.max(210,x-120),190,x,190,{color:LIGHT,w:6})+dot(x,190,8,'#fff7c2'));
  s+=card(260,390,680,110,F(`\\dfrac{3.8${E8}}{3.0${E8}}\\approx 1.3${SS}`,600,452,40,{auto:false}),seg(p,.45,.6),VCOL);
  return s;
 },
 [K+'sun']:(p,ctx)=>{
  let s=sun(1040,200,80)+earth(140,200,40);
  s+=fade(seg(p,.05,.2),line(190,300,950,300,{color:C.x,w:3})+line(190,288,190,312,{color:C.x,w:3})+line(950,288,950,312,{color:C.x,w:3})+tex(`1.5\\times10^{11}\\ \\mathrm{m}`,570,345,{size:34,color:C.x,auto:false}));
  s+=card(260,390,680,110,F(`\\dfrac{1.5\\times10^{11}}{3.0${E8}}`,600,452,40,{auto:false}),seg(p,.5,.65),VCOL);
  return s;
 },
 [K+'sun2']:(p,ctx)=>{
  let s=card(260,30,680,130,F(`\\dfrac{1.5\\times10^{11}}{3.0${E8}}`,600,105,46,{auto:false}),1,VCOL);
  s+=card(120,210,440,120,F('\\dfrac{1.5}{3.0}=0.50',340,280,40,{auto:false}),seg(p,.05,.2),C.ink);
  s+=fade(seg(p,.05,.2),label('数の 部分',340,370,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(640,210,440,120,F('\\dfrac{10^{11}}{10^{8}}=10^{3}',860,280,40,{auto:false}),seg(p,.5,.65),C.ink);
  s+=fade(seg(p,.5,.65),label('10 の 部分（11 − 8 ＝ 3）',860,370,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sun3']:(p,ctx)=>{
  let s=card(120,30,440,100,F('0.50',340,92,40,{auto:false}),1,C.ink)+card(640,30,440,100,F('10^{3}',860,92,40,{auto:false}),1,C.ink);
  s+=card(240,190,720,120,F(`0.50\\times10^{3}=500${SS}`,600,262,48,{auto:false}),seg(p,.05,.2),VCOL);
  s+=card(340,360,520,110,label('＝ 8分20秒',600,430,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'past']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sun(1040,200,80)+earth(140,200,40);
  s+=fade(seg(p,.05,.2),label('8分20秒前に 出た 光',600,120,{size:32,color:LIGHT,anchor:'middle',weight:700}));
  const x=950-((t*120)%760);s+=line(x,200,Math.min(950,x+120),200,{color:LIGHT,w:6})+dot(x,200,8,'#fff7c2');
  s+=card(200,330,800,120,label('遠くを 見る ＝ 過去に 出た 光を 見る',600,402,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ================= S3 屈折率 =================
 [K+'slow']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'slow');
  let s=lane(150,300,t,{name:'真空',g:seg(p,0,.1)});
  s+=lane(290,300/1.33,t,{name:'水',g:seg(p,.1,.2),fill:GLASS});
  s+=lane(430,200,t,{name:'ガラス',g:seg(p,.2,.3),fill:GLASS});
  s+=tag('測定',1080,60,{color:C.dim,g:seg(p,.6,.75)});
  return s;
 },
 [K+'ndef']:(p,ctx)=>{
  let s=card(220,50,460,190,F(`n=\\dfrac{${ct}}{${vt}}`,450,160,64,{auto:false}),seg(p,.05,.2),C.ink);
  s+=tag('定義',620,30,{color:C.hi,g:seg(p,.2,.35)});
  s+=fade(seg(p,.1,.25),label('屈折率',120,165,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.62),arrow(740,118,560,118,{color:VCOL,w:3,head:12})+label('真空の 速さ',755,128,{size:30,color:VCOL,weight:700}));
  s+=fade(seg(p,.65,.78),arrow(740,200,560,200,{color:VCOL,w:3,head:12})+label('物質の 中の 速さ',755,210,{size:30,color:VCOL,weight:700}));
  return s;
 },
 [K+'nmean']:(p,ctx)=>{
  let s=card(300,50,600,190,F(`n=\\dfrac{${ct}}{${vt}}`,600,160,64,{auto:false}),1,C.ink);
  s+=fade(seg(p,.1,.25),label('c は v の n 倍',600,320,{size:36,color:C.ink,anchor:'middle',weight:700}));
  s+=card(250,370,700,100,F('\\dfrac{\\mathrm{m/s}}{\\mathrm{m/s}}\\ \\to\\ \\text{単位なし}',600,430,34,{auto:false}),seg(p,.6,.75),C.dim);
  return s;
 },
 [K+'solve1']:(p,ctx)=>{
  let s=card(140,40,420,150,F(`n=\\dfrac{${ct}}{${vt}}`,350,128,52,{auto:false}),1,C.ink);
  s+=fade(seg(p,.25,.4),label('求めたいのは v',350,240,{size:28,color:VCOL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.65),label('両辺 × v',740,80,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(600,110,420,120,F(`n${vt}=${ct}`,810,182,52,{auto:false}),seg(p,.6,.75),C.ink);
  return s;
 },
 [K+'solve2']:(p,ctx)=>{
  let s=card(140,40,420,150,F(`n=\\dfrac{${ct}}{${vt}}`,350,128,52,{auto:false}),1,C.ink)+card(600,40,420,150,F(`n${vt}=${ct}`,810,128,52,{auto:false}),1,C.ink);
  s+=fade(seg(p,.05,.2),label('両辺 ÷ n',810,240,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(380,280,440,150,F(`${vt}=\\dfrac{${ct}}{n}`,600,368,60,{auto:false}),seg(p,.15,.3),VCOL);
  s+=tag('n 分の1',920,355,{color:VCOL,g:seg(p,.6,.75)});
  return s;
 },
 [K+'glass']:(p,ctx)=>{
  let s=card(80,40,1040,120,F(`${vt}=\\dfrac{3.0${E8}}{1.5}=2.0${E8}${MS}`,600,112,44,{auto:false}),seg(p,.15,.3),VCOL);
  s+=fade(seg(p,.05,.15),label('ガラス n ＝ 1.5',600,220,{size:30,color:GLINE,anchor:'middle',weight:700}));
  const X=250,k=240;
  s+=fade(seg(p,.55,.7),label('真空',X-20,300,{size:28,color:C.ink,anchor:'end',weight:700})+rect(X,280,k*3,30,{fill:VCOL,fo:.55,stroke:'none'})+label('3.0',X+k*3+14,304,{size:28,color:VCOL,weight:700}));
  s+=fade(seg(p,.6,.75),label('ガラス',X-20,370,{size:28,color:GLINE,anchor:'end',weight:700})+rect(X,350,k*2,30,{fill:VCOL,fo:.55,stroke:'none'})+label('2.0（3分の2）',X+k*2+14,374,{size:28,color:VCOL,weight:700}));
  s+=fade(seg(p,.6,.75),label('× 10⁸ m/s',X+k*3+14,440,{size:24,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'water']:(p,ctx)=>{
  let s=card(80,40,1040,120,F(`${vt}=\\dfrac{3.0${E8}}{1.33}\\approx 2.3${E8}${MS}`,600,112,44,{auto:false}),seg(p,.15,.3),VCOL);
  s+=fade(seg(p,.05,.15),label('水 n ＝ 1.33',600,220,{size:30,color:GLINE,anchor:'middle',weight:700}));
  const X=250,k=240;
  s+=label('真空',X-20,300,{size:28,color:C.ink,anchor:'end',weight:700})+rect(X,280,k*3,30,{fill:VCOL,fo:.55,stroke:'none'})+label('3.0',X+k*3+14,304,{size:28,color:VCOL,weight:700});
  s+=fade(seg(p,.55,.7),label('水',X-20,370,{size:28,color:GLINE,anchor:'end',weight:700})+rect(X,350,k*3/1.33,30,{fill:VCOL,fo:.55,stroke:'none'})+label('約2.3',X+k*3/1.33+14,374,{size:28,color:VCOL,weight:700}));
  s+=label('× 10⁸ m/s',X+k*3+14,440,{size:24,color:C.dim,anchor:'end'});
  return s;
 },
 [K+'nmis']:(p,ctx)=>{
  const rows=[['真空','1','3.0'],['水','1.33','約2.3'],['ガラス','1.5','2.0']];
  let s=card(200,40,800,280,'',1,C.dim);
  s+=label('屈折率 n',600,95,{size:28,color:C.ink,anchor:'middle',weight:700})+label('速さ（× 10⁸ m/s）',860,95,{size:28,color:VCOL,anchor:'middle',weight:700});
  rows.forEach(([a,b,c],i)=>{const y=160+i*60,o=seg(p,.05+i*.1,.15+i*.1);s+=fade(o,label(a,330,y,{size:30,color:i?GLINE:C.ink,anchor:'middle',weight:700})+label(b,600,y,{size:30,color:C.ink,anchor:'middle',weight:700})+label(c,860,y,{size:30,color:VCOL,anchor:'middle',weight:700}));});
  s+=card(200,360,800,100,label('n が 大きい ほど 遅い',600,425,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'air']:(p,ctx)=>{
  let s=card(240,60,720,130,label('空気：n ≈ 1',600,140,{size:42,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(240,260,720,130,F(`\\text{空気中の 速さ}\\approx ${ct}`,600,338,42,{auto:false}),seg(p,.5,.65),VCOL);
  return s;
 },
 // ================= S4 変わらないのは振動数 =================
 [K+'bnd']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'bnd');
  let s=hWave(t,{g:seg(p,0,.15)});
  s+=fade(seg(p,.1,.25),arrow(280,90,420,90,{color:LIGHT,w:4,head:14})+label('光の 進む 向き',350,70,{size:24,color:LIGHT,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bnd2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'bnd');
  let s=hWave(t);const o=HW,yb=o.y+o.A+40;
  // λ braces measured at a fixed spot
  const lam2=o.lam/o.n;
  s+=fade(seg(p,.1,.25),line(170,yb,170+o.lam,yb,{color:LC,w:3})+line(170,yb-10,170,yb+10,{color:LC,w:3})+line(170+o.lam,yb-10,170+o.lam,yb+10,{color:LC,w:3})+tex('\\lambda',170+o.lam/2,yb+40,{size:34,color:LC,auto:false}));
  s+=fade(seg(p,.3,.45),line(800,yb,800+lam2,yb,{color:LC,w:3})+line(800,yb-10,800,yb+10,{color:LC,w:3})+line(800+lam2,yb-10,800+lam2,yb+10,{color:LC,w:3})+tex('\\lambda',800+lam2/2,yb+40,{size:34,color:LC,auto:false}));
  s+=fade(seg(p,.55,.7),label('波長が 短い',800+lam2/2,o.y-108,{size:28,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gate']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'bnd'),T0=countStart(p,ctx);
  let s=hWave(t);const gl=420,gr=760;
  s+=hCrests(t).map(x=>crestTri(x,HW.y-HW.A-12)).join('');
  const st=sceneT(p,ctx),t0=t-st+T0;
  s+=gate(gl,HW.y,st>T0?passed(gl,t0,t):0,{g:seg(p,.4,.5)})+gate(gr,HW.y,st>T0?passed(gr,t0,t):0,{g:seg(p,.4,.5)});
  return s;
 },
 [K+'same']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'bnd'),T0=countStart(p,ctx),st=sceneT(p,ctx),t0=t-st+T0;
  let s=hWave(t);const gl=420,gr=760;
  s+=hCrests(t).map(x=>crestTri(x,HW.y-HW.A-12)).join('');
  s+=gate(gl,HW.y,passed(gl,t0,t))+gate(gr,HW.y,passed(gr,t0,t));
  s+=card(330,440,540,64,label('1秒に 通る 数は 同じ',600,484,{size:30,color:FC,anchor:'middle',weight:700}),seg(p,.55,.7),FC);
  return s;
 },
 [K+'why']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'bnd');
  let s=hWave(t);const xl=HW.xb-6,xr=HW.xb+6;
  const yl=HW.y-hDisp(xl,t),yr=HW.y-hDisp(xr,t);
  s+=fade(seg(p,.1,.25),dot(xl-12,yl,11,C.hi)+dot(xr+12,yr,11,C.hi));
  s+=fade(seg(p,.1,.25),line(HW.xb-20,HW.y-HW.A-40,HW.xb-20,HW.y+HW.A+40,{color:C.hi,w:2,dash:'4 6'})+line(HW.xb+20,HW.y-HW.A-40,HW.xb+20,HW.y+HW.A+40,{color:C.hi,w:2,dash:'4 6'}));
  s+=fade(seg(p,.35,.5),label('すぐ左',HW.xb-30,HW.y+HW.A+80,{size:26,color:C.hi,anchor:'end',weight:700})+label('すぐ右',HW.xb+30,HW.y+HW.A+80,{size:26,color:C.hi,weight:700}));
  s+=card(330,30,540,70,label('同じ リズムで 揺れる',600,78,{size:32,color:FC,anchor:'middle',weight:700}),seg(p,.6,.75),FC);
  return s;
 },
 [K+'why2']:(p,ctx)=>{
  let s=card(80,40,500,250,label('もし 数が 違えば',330,100,{size:30,color:C.a,anchor:'middle',weight:700})+label('境界で 山が',330,170,{size:30,color:C.ink,anchor:'middle'})+label('たまる・消える',330,225,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.2,.35)*.6,line(110,60,550,270,{color:C.a,w:4})+line(550,60,110,270,{color:C.a,w:4}));
  s+=card(640,90,480,150,F(`${ft}\\ \\text{は 変わらない}`,880,180,46,{auto:false}),seg(p,.55,.7),FC);
  s+=tag('結果',880,300,{color:C.hi,g:seg(p,.7,.85)});
  return s;
 },
 [K+'queue']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'queue');
  let s=queue(t,{g:seg(p,0,.15)});
  s+=fade(seg(p,.5,.65),label('間隔が 詰まる',870,420,{size:28,color:SAND,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),line(420,210,420,390,{color:FC,w:3,dash:'3 6'})+line(830,210,830,390,{color:FC,w:3,dash:'3 6'})+label('門',420,200,{size:26,color:FC,anchor:'middle',weight:700})+label('門',830,200,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('どちらも 1.2 秒に 1人',600,470,{size:28,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'queue2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'queue');
  let s=fade(.45,queue(t,{}));
  s+=card(250,120,700,170,label('人 → 山',600,185,{size:36,color:C.ink,anchor:'middle',weight:700})+label('歩きにくい 道 → ガラス',600,250,{size:36,color:GLINE,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.55,.7),label('違い：光の 山は 自分で 歩かない',600,440,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'vfl']:(p,ctx)=>{
  let s=card(330,30,540,130,F(`${vt}=${ft}${Lt}`,600,112,60,{auto:false}),1,VCOL);
  s+=card(80,220,320,120,F(`${ft}\\ \\text{同じ}`,240,292,42,{auto:false}),seg(p,.2,.35),FC);
  s+=card(440,220,320,120,F(`${vt}\\ \\downarrow`,600,292,48,{auto:false}),seg(p,.4,.55),VCOL);
  s+=card(800,220,320,120,F(`${Lt}\\ \\downarrow`,960,292,48,{auto:false}),seg(p,.6,.75),LC);
  s+=fade(seg(p,.75,.9),label('同じ 割合で 小さく',780,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num']:(p,ctx)=>{
  let s=card(240,40,720,120,F(`${Lt}=600\\ \\mathrm{nm}`,600,112,52,{auto:false}),seg(p,.05,.2),LC);
  s+=fade(seg(p,.05,.2),label('真空で',600,200,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(240,260,720,120,F('\\text{ナノ}=10^{-9}',600,332,46,{auto:false}),seg(p,.5,.65),C.dim);
  s+=fade(seg(p,.7,.85),label('10億分の1',600,440,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num1']:(p,ctx)=>{
  let s=card(240,40,720,120,F(`${Lt}=600\\ \\mathrm{nm}`,600,112,52,{auto:false}),1,LC);
  s+=card(140,230,920,120,F('600\\times10^{-9}\\ \\mathrm{m}=6.0\\times10^{-7}\\ \\mathrm{m}',600,302,46,{auto:false}),seg(p,.1,.25),LC);
  return s;
 },
 [K+'num2']:(p,ctx)=>{
  let s=card(60,30,1080,160,F(`${ft}=\\dfrac{${ct}}{${Lt}}=\\dfrac{3.0${E8}}{6.0\\times10^{-7}}`,600,122,46,{auto:false}),seg(p,0,.15),FC);
  s+=card(240,240,720,120,F(`${ft}=5.0\\times10^{14}${HZ}`,600,312,50,{auto:false}),seg(p,.45,.6),FC);
  s+=fade(seg(p,.7,.85),label('1秒に 500兆回',600,430,{size:34,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num3']:(p,ctx)=>{
  let s=medium({y:220,upper:'',lower:'',fo:.0,g:0});
  s+=card(80,40,480,120,F(`${ft}=5.0\\times10^{14}${HZ}`,320,112,40,{auto:false}),seg(p,.05,.2),FC);
  s+=fade(seg(p,.05,.2),label('ガラスの 中でも そのまま',320,200,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=card(640,40,480,120,F(`${vt}=2.0${E8}${MS}`,880,112,40,{auto:false}),seg(p,.55,.7),VCOL);
  s+=fade(seg(p,.55,.7),label('ガラスの 中の 速さ',880,200,{size:26,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num4']:(p,ctx)=>{
  let s=card(80,40,480,100,F(`${ft}=5.0\\times10^{14}${HZ}`,320,100,36,{auto:false}),1,FC)+card(640,40,480,100,F(`${vt}=2.0${E8}${MS}`,880,100,36,{auto:false}),1,VCOL);
  s+=card(80,190,1040,140,F(`${Lt}=\\dfrac{${vt}}{${ft}}=\\dfrac{2.0${E8}}{5.0\\times10^{14}}=4.0\\times10^{-7}${MM}`,600,272,42,{auto:false}),seg(p,.05,.2),LC);
  s+=card(400,380,400,100,label('＝ 400 nm',600,445,{size:40,color:LC,anchor:'middle',weight:700}),seg(p,.65,.8),LC);
  return s;
 },
 [K+'num5']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'num5');
  let s=hWave(t,{o:{...HW,y:330,A:50,lam:240},labels:0});
  s+=card(220,30,760,110,F('\\dfrac{600\\ \\mathrm{nm}}{1.5}=400\\ \\mathrm{nm}',600,95,42,{auto:false}),seg(p,.05,.2),LC);
  s+=fade(seg(p,.4,.55),label('600 nm',330,450,{size:30,color:LC,anchor:'middle',weight:700})+label('400 nm',870,450,{size:30,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const rows=[['速さ',`${vt}`,'変わる',VCOL],['波長',`${Lt}`,'変わる',LC],['振動数',`${ft}`,'変わらない',FC]];
  let s=card(180,40,840,300,'',1,C.dim);
  rows.forEach(([a,b,c,col],i)=>{const y=110+i*85,o=seg(p,.15+i*.2,.28+i*.2);
   s+=fade(o,label(a,330,y+12,{size:34,color:col,anchor:'middle',weight:700})+tex(b,480,y+14,{size:44,auto:false})+label(c,760,y+12,{size:34,color:i===2?C.hi:C.ink,anchor:'middle',weight:700}));});
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const rows=[['速さ',`${vt}`,'n 分の1',VCOL],['波長',`${Lt}`,'n 分の1',LC],['振動数',`${ft}`,'変わらない',FC]];
  let s=card(180,40,840,300,'',1,C.dim);
  rows.forEach(([a,b,c,col],i)=>{const y=110+i*85;
   s+=label(a,330,y+12,{size:34,color:col,anchor:'middle',weight:700})+tex(b,480,y+14,{size:44,auto:false})+label(c,760,y+12,{size:34,color:i===2?C.hi:C.ink,anchor:'middle',weight:700});});
  s+=fade(seg(p,.5,.65),label('ガラス（n ＝ 1.5）：3.0 → 2.0（× 10⁸ m/s）、600 → 400 nm',600,410,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'mis']:(p,ctx)=>{
  let s=card(150,50,900,130,label('ガラスの 中で 色（振動数）が 変わる',600,130,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.2,.35),line(170,60,1030,170,{color:C.a,w:5}));
  s+=card(250,260,700,120,F(`\\text{光の 色}\\ \\leftrightarrow\\ ${ft}`,600,335,44,{auto:false}),seg(p,.6,.75),FC);
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=medium({y:270,g:seg(p,0,.15)});
  s+=beam({O:[560,270],th1:40,w:130,la:330,lb:250,t,g:seg(p,.05,.25)});
  s+=fade(seg(p,.4,.55),label('折れ曲がる',760,420,{size:30,color:C.hi,weight:700}));
  s+=card(760,40,400,80,label('なぜ 向きまで？',960,93,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'next2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=medium({y:270})+beam({O:[560,270],th1:40,w:130,la:330,lb:250,t});
  s+=card(760,40,400,80,label('なぜ 向きまで？',960,93,{size:34,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=card(760,140,400,80,label('どれだけ 曲がる？',960,193,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'bye']:(p,ctx)=>{
  let s=card(300,170,600,140,label('深く学ぶ 2/3 へ',600,258,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
