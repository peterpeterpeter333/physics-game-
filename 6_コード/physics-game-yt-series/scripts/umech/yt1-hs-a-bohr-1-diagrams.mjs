// 高校編「物質波とボーア模型・深く学ぶ 1/3」(ys-hs-a-bohr-1) — 図。Stage 1200×515.
// 色：波長 λ 水色、速さ v 紫、運動量 p 桃、エネルギー（K・E・準位）橙、電子 青、陽子（原子核）赤、整数 n 黄、半径 r 白。
// 2/3・3/3・要点でも使う部品は export する（カード・タグ・T2 は力学の部品、電子の印は電流の部品を読み込む）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {tag,T2} from './yt1-hs-m-energy-1-diagrams.mjs';
import {electron} from './yt1-hs-e-current-1-diagrams.mjs';
export {card,tag,T2,electron};

const K='hs-a-bohr-1:';
const PI=Math.PI;
export const LC=C.x, VC=C.v, PC=C.p, EC=C.E, NEG='#7fb3ff', POS=C.a, NC=C.hi, RC=C.ink, BAD=C.a, OK=C.F;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const lam=cs(LC,'\\lambda'), pt=cs(PC,'p'), vt=cs(VC,'v'), Kt=cs(EC,'K'), Et=cs(EC,'E'), rt=cs(RC,'r'), nt=cs(NC,'n');
export const U=s=>`\\,\\mathrm{${s}}`;
export const TX=(src,x,y,o={})=>tex(src,x,y,{size:46,auto:false,...o});
export const fcard=(x,y,w,h,src,{g=1,size=48,col=C.hi,dy=0}={})=>card(x,y,w,h,TX(src,x+w/2,y+h/2+size*.3+dy,{size}),g,col);
// Japanese label + TeX (powers of ten in TeX: the label font has no superscript minus). x = junction point.
export const jt=(jp,src,x,y,{size=28,color=C.ink,weight=700,gap=8}={})=>label(jp,x-gap/2,y,{size,color,anchor:'end',weight})+tex(src,x+gap/2,y-size*.32,{size:size*1.15,color,anchor:'start',auto:false});
export const LAMDEF=`${lam}=\\dfrac{h}{${pt}}`, LAMMV=`${lam}=\\dfrac{h}{m${vt}}`;
// ---- small marks ----------------------------------------------------------------------------------
export const cross=(x,y,r=22,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:BAD,w:5})+line(x-r,y+r,x+r,y-r,{color:BAD,w:5}));
export const okMark=(x,y,g=1)=>fade(g,draw([[x-18,y],[x-4,y+14],[x+20,y-16]],1,{color:OK,w:5}));
export const nucleus=(x,y,{r=16,g=1}={})=>fade(g,ring(x,y,r,{color:POS,w:3,fill:'#3a1d2a'})+label('＋',x,y+8,{size:22,color:POS,anchor:'middle',weight:700}));
export function photon(x,y,{g=1,r=9}={}){return fade(g,dot(x,y,r+6,C.hi,.18)+dot(x,y,r,C.hi));}
// sinusoid from x0 to x1 around y. lam, A in px; ph in cycles.
export function wave(x0,x1,y,lamPx,A,{ph=0,color=LC,w=4,g=1,dash=''}={}){
 const pts=[];for(let x=x0;x<=x1+.1;x+=3)pts.push([x,y-A*Math.sin(2*PI*((x-x0)/lamPx-ph))]);
 return fade(g,draw(pts,1,{color,w,dash}));
}
export function span(x1,x2,y,{text='',src='',color=LC,g=1,size=30,dy=-16}={}){
 let s=fade(g,line(x1,y-12,x1,y+12,{color,w:2})+line(x2,y-12,x2,y+12,{color,w:2}))+arrow(x1,y,x2,y,{color,w:3,head:12,g})+arrow(x2,y,x1,y,{color,w:3,head:12,g});
 if(text)s+=fade(g,label(text,(x1+x2)/2,y+dy,{size,color,anchor:'middle',weight:700}));
 if(src)s+=fade(g,TX(src,(x1+x2)/2,y+dy-4,{size,color}));
 return s;
}
// ---- energy ladder: levels [{E, text}] between Emax (top) and Emin (bottom) ------------------------
export function ladder(levels,{x=160,w=360,ytop=70,ybot=450,Emax=0,Emin=-4,g=1,lab=1,color=EC,hl=-1,size=28}={}){
 const Y=E=>ytop+(Emax-E)/(Emax-Emin)*(ybot-ytop);let s='';
 levels.forEach((L,i)=>{const y=Y(L.E),o=g*(L.g??1),c=i===hl?C.hi:(L.color||color);
  s+=fade(o,line(x,y,x+w,y,{color:c,w:i===hl?6:4}));
  if(lab&&L.text)s+=fade(o,label(L.text,x+w+16,y+9,{size,color:c,weight:700}));
  if(L.left)s+=fade(o,label(L.left,x-14,y+9,{size:size-2,color:C.dim,anchor:'end'}));});
 return s;
}
export const ladderY=(E,{ytop=70,ybot=450,Emax=0,Emin=-4}={})=>ytop+(Emax-E)/(Emax-Emin)*(ybot-ytop);
// ---- deterministic random -----------------------------------------------------------------------
export function rng(seed){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
// ---- double slit (light or electrons) -------------------------------------------------------------
export const DS={sx:110,bx:470,sc:900,cy:262,d:46,top:52,bot:472,D:58};
export const fringeI=(y,o=DS)=>{const u=(y-o.cy);return Math.cos(PI*u/o.D)**2*Math.exp(-((u/190)**2));};
const DOTS=(()=>{const R=rng(7),out=[];while(out.length<3200){const y=DS.top+R()*(DS.bot-DS.top);if(R()<fringeI(y))out.push([DS.sc+4+R()*34,y]);}return out;})();
function arcPath(cx,cy,r,a0,a1){const P=a=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];const [x0,y0]=P(a0),[x1,y1]=P(a1);return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;}
export function slitBase({g=1,o=DS,src='light'}={}){
 let s=fade(g,rect(o.bx-8,o.top-10,16,o.cy-o.d/2-12-o.top+10,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})
  +rect(o.bx-8,o.cy-o.d/2+12,16,o.d-24,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})
  +rect(o.bx-8,o.cy+o.d/2+12,16,o.bot+10-(o.cy+o.d/2+12),{fill:'#56627a',fo:1,stroke:C.dim,rx:3})
  +rect(o.sc,o.top-10,40,o.bot-o.top+20,{fill:'#0f1a30',fo:1,stroke:C.dim,sw:2,rx:4})
  +label('スクリーン',o.sc+20,o.bot+40,{size:24,color:C.dim,anchor:'middle'}));
 if(src==='light')s+=fade(g,rect(o.sx-40,o.cy-40,60,80,{fill:'#3a4a66',fo:1,stroke:C.dim,rx:8})+label('光',o.sx-10,o.cy+90,{size:26,color:C.hi,anchor:'middle',weight:700}));
 else s+=fade(g,rect(o.sx-60,o.cy-34,90,68,{fill:'#26324a',fo:1,stroke:C.dim,rx:8})+rect(o.sx+30,o.cy-12,26,24,{fill:'#3a4a66',fo:1,stroke:C.dim,rx:3})+label('電子線',o.sx,o.cy+80,{size:26,color:NEG,anchor:'middle',weight:700}));
 return s;
}
export function lightWaves(t,{g=1,o=DS}={}){
 let s='';const L=44,ph=(t*60)%L;
 for(let x=o.sx+30+ph;x<o.bx-6;x+=L)s+=line(x,o.cy-70,x,o.cy+70,{color:C.hi,w:3,opacity:.55});
 for(const yy of [o.cy-o.d/2,o.cy+o.d/2])for(let r=ph+6;r<o.sc-o.bx-8;r+=L)s+=`<path d="${arcPath(o.bx+8,yy,r,-1.0,1.0)}" fill="none" stroke="${C.hi}" stroke-width="2.5" stroke-opacity="${(.5*(1-r/(o.sc-o.bx))).toFixed(2)}"/>`;
 return fade(g,s);
}
export function fringeBands({g=1,o=DS,profile=0}={}){
 let s='';for(let y=o.top;y<o.bot;y+=4){const I=fringeI(y+2,o);s+=rect(o.sc+2,y,36,4.5,{fill:C.hi,fo:I*.95,stroke:'none',rx:0});}
 if(profile){const pts=[];for(let y=o.top;y<=o.bot;y+=3)pts.push([o.sc+60+150*fringeI(y,o),y]);s+=fade(profile,draw(pts,1,{color:C.hi,w:3}));}
 return fade(g,s);
}
export function eDots(n,{g=1,o=DS,color=NEG,r=2.6,dx=0,dy=0,sx=1}={}){let s='';const k=Math.min(DOTS.length,Math.floor(n));for(let i=0;i<k;i++){const [x,y]=DOTS[i];s+=dot(o.sc+dx+(x-o.sc)*sx,y+dy,r,color);}return fade(g,s);}
// one electron flying from the gun to the screen, landing at DOTS[i]
export function flyer(u,i,{o=DS}={}){
 const [X,Y]=DOTS[i%DOTS.length];if(u<0||u>1)return '';
 const x=mix(o.sx+60,X,u),y=u<.55?o.cy+(i%2?-1:1)*o.d/2*(u/.55):mix(o.cy+(i%2?-1:1)*o.d/2,Y,(u-.55)/.45);
 return dot(x,y,6,NEG)+dot(x,y,11,NEG,.25);
}
// ---- log ruler 10^lo .. 10^hi ---------------------------------------------------------------------
export const LR={x0:90,x1:1110,lo:-36,hi:-4,y:300};
export const lrX=(e,o=LR)=>o.x0+(e-o.lo)/(o.hi-o.lo)*(o.x1-o.x0);
const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
export const pow10=e=>'10'+String(e).split('').map(c=>SUP[c]).join('');
export function logRuler({g=1,o=LR}={}){
 let s=line(o.x0,o.y,o.x1,o.y,{color:C.dim,w:3});
 for(let e=o.lo;e<=o.hi;e++)s+=line(lrX(e),o.y-(e%5===0?14:6),lrX(e),o.y+(e%5===0?14:6),{color:C.dim,w:2});
 for(let e=-35;e<=-5;e+=5)s+=tex(`10^{${e}}`,lrX(e),o.y+48,{size:28,color:C.dim,auto:false});
 s+=label('m',o.x1+10,o.y+48,{size:24,color:C.dim});
 return fade(g,s);
}
// ---- atom with circular orbit ----------------------------------------------------------------------
export function atomOrbit(cx,cy,R,{g=1,ang=.6,el=1,orb=1,nuc=1,dash='6 7',ocol=C.faint}={}){
 let s='';
 if(orb)s+=fade(g*orb,ring(cx,cy,R,{color:ocol,w:2,dash}));
 if(nuc)s+=nucleus(cx,cy,{g:g*nuc});
 if(el)s+=electron(cx+R*Math.cos(ang),cy-R*Math.sin(ang),{r:13,op:g*el});
 return s;
}
// wave wrapped on a circle: k wavelengths per turn, drawn over `turns` turns (radial displacement)
export function ringWave(cx,cy,R,k,{A=16,turns=1,ph=0,g=1,color=LC,w=4,from=0}={}){
 const pts=[];const N=Math.ceil(240*turns);for(let i=0;i<=N;i++){const a=from+2*PI*turns*i/N,rr=R+A*Math.sin(k*a-2*PI*ph);pts.push([cx+rr*Math.cos(a),cy-rr*Math.sin(a)]);}
 return fade(g,draw(pts,1,{color,w}));
}

// ---- scene parts for this video ---------------------------------------------------------------------
const LV=[{E:0,text:'0 eV',color:C.dim},{E:-1.51,text:'−1.51 eV'},{E:-3.40,text:'−3.40 eV'}];
function plates(t,{g=1,u=1}={}){
 const xL=260,xR=860,yT=140,yB=380;
 let s=fade(g,rect(xL-16,yT,16,yB-yT,{fill:'#4f7fe0',fo:.9,stroke:C.dim,rx:3})+rect(xR,yT,16,yB-yT,{fill:'#e05252',fo:.9,stroke:C.dim,rx:3})
  +label('−',xL-8,yT-16,{size:30,color:NEG,anchor:'middle',weight:700})+label('＋',xR+8,yT-16,{size:30,color:POS,anchor:'middle',weight:700})
  +line(xL-8,yB,xL-8,450,{color:C.dim,w:3})+line(xR+8,yB,xR+8,450,{color:C.dim,w:3})+line(xL-8,450,520,450,{color:C.dim,w:3})+line(600,450,xR+8,450,{color:C.dim,w:3})
  +line(520,425,520,475,{color:C.ink,w:4})+line(600,437,600,463,{color:C.ink,w:7})+label('100 V',560,415,{size:28,color:VC,anchor:'middle',weight:700}));
 const f=(t%2.2)/2.2,x=xL+20+(xR-xL-50)*f*f;
 s+=electron(x,260,{r:14,op:g*u});
 s+=arrow(x+20,226,x+20+30+120*f,226,{color:VC,w:4,head:12,g:g*u*clamp(f*4)});
 return s;
}
function ball(x,y,r=26,g=1){return fade(g,dot(x,y,r,'#f2f2f2')+`<path d="M${x-r*.7} ${y-r*.6} Q ${x} ${y} ${x-r*.7} ${y+r*.6}" fill="none" stroke="#e05252" stroke-width="2.5"/>`+`<path d="M${x+r*.7} ${y-r*.6} Q ${x} ${y} ${x+r*.7} ${y+r*.6}" fill="none" stroke="#e05252" stroke-width="2.5"/>`);}
function blobs(cx,cy,sep,rad,{g=1,color=C.hi}={}){let s='';for(const dx of [-sep/2,sep/2])for(let k=5;k>=1;k--)s+=dot(cx+dx,cy,rad*k/5,color,.12);return fade(g,s);}
const sceneT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
const lambdaRow=(y,lamPx,{g=1,vlen=80,txt='',ph=0}={})=>{
 let s=electron(150,y,{r:14,op:g})+arrow(172,y,172+vlen,y,{color:VC,w:5,head:14,g});
 s+=wave(300,1000,y,lamPx,22,{ph,g});
 s+=span(300,300+lamPx,y+46,{src:lam,g,size:30,dy:34});
 if(txt)s+=fade(g,label(txt,150,y-40,{size:26,color:C.ink,anchor:'middle',weight:700}));
 return s;
};

export const hsABohr1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=ladder(LV,{x:200,w:360,ytop:90,ybot:440,Emax:0,Emin:-4,g:seg(p,.05,.25)});
  s+=fade(seg(p,.05,.25),label('水素の 準位',380,60,{size:30,color:EC,anchor:'middle',weight:700}));
  s+=card(730,150,420,210,label('なぜ',940,225,{size:30,color:C.ink,anchor:'middle'})+label('飛び飛び？',940,300,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=card(60,60,500,380,label('光',310,120,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=wave(100,520,220,90,26,{ph:t*.8,color:C.hi,w:3});
  for(let i=0;i<4;i++)s+=photon(130+i*110,330);
  s+=label('波 でもあり、粒 でもある',310,410,{size:26,color:C.ink,anchor:'middle'});
  s+=card(640,60,500,380,label('電子',890,120,{size:32,color:NEG,anchor:'middle',weight:700}),seg(p,.2,.35),NEG);
  s+=electron(890,250,{r:20,op:seg(p,.2,.35)});
  s+=fade(seg(p,.5,.65),wave(700,1080,330,90,18,{ph:t*.8,color:LC,w:3,dash:'8 8'})+label('波の 顔も ある？',890,410,{size:28,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'plan']:(p)=>card(150,80,900,150,label('今回',600,130,{size:28,color:C.dim,anchor:'middle'})+label('電子にも 波長が ある？',600,195,{size:42,color:LC,anchor:'middle',weight:700}),seg(p,.05,.2),LC)
  +card(250,290,700,120,label('準位が 飛び飛びの 理由 → 3本目で 計算',600,362,{size:30,color:EC,anchor:'middle',weight:700}),seg(p,.5,.65),EC),
 // ================= S2 ド・ブロイの考え =================
 [K+'d1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=card(60,60,520,380,label('干渉する 波',320,120,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=wave(100,540,260,90,30,{ph:t*.8,color:C.hi,w:3,g:seg(p,.02,.15)});
  s+=card(620,60,520,380,label('電子と やりとり',880,120,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  const u=(t*.5)%1;
  s+=fade(seg(p,.4,.55),photon(680+300*u,260)+electron(1040,260,{r:16})+TX('h\\nu',680+300*u,225,{size:34,color:C.hi}));
  s+=fade(seg(p,.6,.75),label('1個 ずつ の 粒',880,400,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('ド・ブロイ の 考え',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=card(150,110,900,120,label('光（波） → 粒の 性質も ある',600,185,{size:36,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=card(150,270,900,190,label('粒（電子） → 波の 性質も ある？',600,340,{size:36,color:LC,anchor:'middle',weight:700}),seg(p,.15,.3),LC);
  s+=fade(seg(p,.35,.5),electron(260,410,{r:16})+wave(310,940,410,110,16,{ph:t*.7,color:LC,w:3}));
  return s;
 },
 [K+'d3']:(p)=>{
  let s=fcard(330,60,540,190,LAMDEF,{size:70,col:LC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.35,.5),arrow(560,262,420,330,{color:C.ink,w:3,head:12})+label('h：プランク定数',380,370,{size:28,color:C.ink,anchor:'middle',weight:700})+TX('6.6\\times10^{-34}'+U('J\\cdot s'),380,425,{size:30,color:C.dim}));
  s+=fade(seg(p,.6,.75),arrow(640,262,800,330,{color:PC,w:3,head:12})+label('p：運動量',840,370,{size:28,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d4']:(p)=>{
  let s=fcard(160,60,380,150,LAMDEF,{size:56,col:LC});
  s+=fcard(660,60,380,150,`${pt}=m${vt}`,{size:56,col:PC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.1,.25),label('光より ずっと 遅い 粒',850,250,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.6),arrow(600,280,600,320,{color:C.hi,w:4,head:14}));
  s+=fcard(330,330,540,150,LAMMV,{size:60,col:LC,g:seg(p,.55,.7)});
  return s;
 },
 [K+'d5']:(p)=>{
  let s=fade(.5,TX(LAMDEF,600,110,{size:56}));
  s+=tag('仮説',600,200,{color:C.hi,size:30,g:seg(p,.05,.2)});
  s+=card(200,260,800,170,label('ほかの 式から 導いた のではない',600,325,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 実験で 確かめる 必要が ある',600,390,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'d6']:(p)=>{
  let s=label('単位を 確かめる',600,60,{size:30,color:C.dim,anchor:'middle'});
  s+=fcard(250,90,700,120,`1${U('J')}=1${U('kg\\cdot m^2/s^2')}`,{size:46,col:EC,g:seg(p,.05,.2)});
  s+=card(150,250,900,120,label('h の 単位',290,322,{size:30,color:C.ink,anchor:'middle',weight:700})+TX(`${U('J\\cdot s')}=${U('kg\\cdot m^2/s')}`,700,330,{size:46}),seg(p,.5,.65),C.ink);
  return s;
 },
 [K+'d7']:(p)=>{
  let s=fade(.55,label('h の 単位',420,78,{size:26,color:C.ink,anchor:'end'})+TX(U('kg\\cdot m^2/s'),440,70,{size:38,anchor:'start'}));
  s+=fade(.55,label('p の 単位',420,138,{size:26,color:PC,anchor:'end'})+TX(U('kg\\cdot m/s'),440,130,{size:38,anchor:'start'}));
  const c=seg(p,.4,.55);
  const src=c>.5?`\\dfrac{\\cancel{\\mathrm{kg}}\\cdot\\mathrm{m}^{\\cancel{2}}/\\cancel{\\mathrm{s}}}{\\cancel{\\mathrm{kg}}\\cdot\\cancel{\\mathrm{m}}/\\cancel{\\mathrm{s}}}=\\mathrm{m}`:`\\dfrac{\\mathrm{kg\\cdot m^2/s}}{\\mathrm{kg\\cdot m/s}}`;
  s+=fcard(300,180,600,190,src,{size:56,col:LC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.7,.85),label('長さの 単位',600,430,{size:32,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d8']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.6,TX(LAMMV,1080,90,{size:40}));
  s+=lambdaRow(140,220,{vlen:60,txt:'遅い',ph:t*.4});
  s+=lambdaRow(340,90,{vlen:150,txt:'速い',ph:t*.9,g:seg(p,.25,.4)});
  s+=fade(seg(p,.6,.75),label('速い・重い → p が 大きい → λ が 短い',600,480,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d9']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=card(60,60,520,380,label('✕ 粒が 波の 形に 進む',320,120,{size:30,color:BAD,anchor:'middle',weight:700}),seg(p,.02,.15),BAD);
  const pts=[];for(let x=100;x<=540;x+=4)pts.push([x,280-40*Math.sin((x-100)/40)]);
  s+=fade(seg(p,.02,.15),draw(pts,1,{color:NEG,w:3,dash:'6 6'})+electron(100+(t*90)%440,280-40*Math.sin(((t*90)%440)/40),{r:12}));
  s+=cross(320,280,60,seg(p,.2,.3));
  s+=card(620,60,520,380,label('○ 干渉を 起こす 波の 波長',880,120,{size:30,color:OK,anchor:'middle',weight:700}),seg(p,.5,.65),OK);
  s+=fade(seg(p,.5,.65),wave(660,1100,280,110,34,{ph:t*.6,color:LC,w:3})+span(660,770,360,{src:lam,size:30,dy:36}));
  return s;
 },
 // ================= S3 実験で確かめる =================
 [K+'x1']:(p,ctx)=>slitBase({src:'light'})+lightWaves(sceneT(p,ctx))+fade(seg(p,.5,.65),label('ヤングの 実験（波の 単元）',600,30,{size:28,color:C.hi,anchor:'middle',weight:700})),
 [K+'x2']:(p,ctx)=>slitBase({src:'light'})+lightWaves(sceneT(p,ctx))+fringeBands({g:seg(p,.1,.3),profile:seg(p,.3,.45)})+fade(seg(p,.6,.75),label('縞 ＝ 干渉の 証拠',1100,30,{size:28,color:C.hi,anchor:'end',weight:700})),
 [K+'x3']:(p,ctx)=>{
  const t=sceneT(p,ctx),T0=ctx&&ctx.scene&&ctx.scene.captions?ctx.scene.captions[ctx.k].start:0;
  const n=60+2400*seg(p,.1,.9);
  let s=slitBase({src:'e'})+eDots(n);
  for(let i=0;i<5;i++)s+=flyer(((t-T0)*1.3+i/5)%1,(i*37+Math.floor((t-T0)*1.3+i/5)*11)%3000);
  s+=fade(seg(p,.6,.75),label('電子でも 縞が できる',1100,30,{size:28,color:NEG,anchor:'end',weight:700}));
  return s;
 },
 [K+'x4']:(p)=>{
  const cols=[[180,12,'10個'],[600,200,'200個'],[1020,3000,'3000個']];let s='';
  cols.forEach(([x,n,txt],i)=>{const g=seg(p,.05+i*.25,.2+i*.25);
   s+=fade(g,rect(x-60,60,120,400,{fill:'#0f1a30',fo:1,stroke:C.dim,sw:2,rx:6})+label(txt,x,500,{size:28,color:NEG,anchor:'middle',weight:700}));
   s+=eDots(n,{g,dx:x-60-DS.sc,sx:3,dy:0,r:i?2.4:5});});
  s+=fade(seg(p,.1,.2),label('1個ずつ 点',180,40,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.65,.75),label('集まると 縞',1020,40,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'x5']:(p)=>{
  let s='';for(let i=0;i<6;i++)for(let j=0;j<5;j++)s+=dot(640+i*60,170+j*60,9,'#c9d3e6');
  s=fade(seg(p,.02,.15),s+label('結晶（原子が 並ぶ）',790,480,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.05,.2),rect(80,60,110,60,{fill:'#26324a',fo:1,stroke:C.dim,rx:8})+label('電子線',135,150,{size:24,color:NEG,anchor:'middle',weight:700}));
  s+=arrow(190,100,620,240,{color:NEG,w:6,head:18,g:seg(p,.1,.3)});
  s+=arrow(640,250,1060,80,{color:C.hi,w:6,head:18,g:seg(p,.4,.55)})+arrow(640,250,1100,200,{color:C.hi,w:2,head:10,g:seg(p,.4,.55)*.35})+arrow(640,250,1080,140,{color:C.hi,w:2,head:10,g:seg(p,.4,.55)*.35});
  s+=fade(seg(p,.55,.7),label('特定の 向きだけ 強い ＝ 干渉',1150,50,{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.7,.85),label('デビッソンと ジャーマー',320,460,{size:26,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'x6']:(p)=>{
  let s=fade(.35,fringeBands({profile:1}));
  s+=card(80,90,700,140,label('縞の 間隔 → 波長を 求める',430,175,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(80,260,700,140,TX(`${lam}=\\dfrac{h}{${pt}}`,350,345,{size:52})+okMark(560,330,seg(p,.3,.45))+label('一致',640,340,{size:32,color:OK,anchor:'middle',weight:700}),seg(p,.25,.4),OK);
  s+=tag('仮説 → 実験で 確認',430,460,{color:C.hi,g:seg(p,.6,.75),size:28});
  return s;
 },
 // ================= S4 電子の波長を計算する =================
 [K+'n1']:(p,ctx)=>plates(sceneT(p,ctx),{g:seg(p,.02,.15)})+fade(seg(p,.5,.65),label('100 V で 加速した 電子',560,70,{size:32,color:C.ink,anchor:'middle',weight:700})),
 [K+'n2']:(p,ctx)=>fade(.4,plates(sceneT(p,ctx)))+card(250,110,700,250,label('1 V で 1 eV（前回）',600,180,{size:32,color:C.ink,anchor:'middle'})+TX(`${Kt}=100${U('eV')}`,600,295,{size:62}),seg(p,.05,.2),EC),
 [K+'n3']:(p)=>fade(.6,TX(`${Kt}=100${U('eV')}`,600,80,{size:44}))+fcard(130,170,940,170,`100\\times1.6\\times10^{-19}=1.6\\times10^{-17}${U('J')}`,{size:52,col:EC,g:seg(p,.05,.2)}),
 [K+'n4']:(p)=>{
  let s=fcard(330,40,540,130,`\\tfrac{1}{2}m${vt}^2=${Kt}`,{size:54,col:EC});
  s+=fade(seg(p,.25,.4),label('両辺を 2倍 して、m で 割る',600,225,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(600,240,600,282,{color:C.hi,w:4,head:14}));
  s+=fcard(330,300,540,160,`${vt}^2=\\dfrac{2${Kt}}{m}`,{size:58,col:VC,g:seg(p,.45,.6)});
  return s;
 },
 [K+'n5']:(p)=>{
  let s=fade(.6,TX(`${vt}^2=\\dfrac{2${Kt}}{m}`,600,80,{size:42}));
  s+=fcard(330,150,540,150,`${vt}=\\sqrt{\\dfrac{2${Kt}}{m}}`,{size:58,col:VC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.55,.7),TX(`m=9.1\\times10^{-31}${U('kg')}`,600,390,{size:42}));
  return s;
 },
 [K+'n6']:(p)=>{
  let s=fade(.6,TX(`${vt}=\\sqrt{\\dfrac{2\\times1.6\\times10^{-17}}{9.1\\times10^{-31}}}`,600,100,{size:42}));
  s+=fcard(300,210,600,130,`${vt}\\approx5.9\\times10^{6}${U('m/s')}`,{size:52,col:VC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.55,.7),label('光の 速さ 3.0×10⁸ m/s の 約 1/50',600,410,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n7']:(p)=>fade(.6,TX(`${pt}=m${vt}`,600,80,{size:44}))+fcard(60,170,1080,170,`m${vt}\\approx9.1\\times10^{-31}\\times5.9\\times10^{6}\\approx5.4\\times10^{-24}${U('kg\\cdot m/s')}`,{size:44,col:PC,g:seg(p,.05,.2)}),
 [K+'n8']:(p)=>fade(.6,TX(LAMDEF,600,80,{size:44}))+fcard(110,170,980,170,`${lam}=\\dfrac{6.6\\times10^{-34}}{5.4\\times10^{-24}}\\approx1.2\\times10^{-10}${U('m')}`,{size:50,col:LC,g:seg(p,.05,.2)}),
 [K+'n9']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s='';for(let k=6;k>=1;k--)s+=dot(330,260,100*k/6+10,'#8fa3c4',.1);
  s=fade(seg(p,.02,.15),s+nucleus(330,260,{r:10})+span(220,440,410,{color:C.ink})+jt('原子 約',`10^{-10}${U('m')}`,350,454));
  s+=fade(seg(p,.35,.5),wave(620,1120,260,240,40,{ph:t*.4})+span(620,860,370,{color:LC})+TX(`${lam}\\approx1.2\\times10^{-10}${U('m')}`,740,410,{size:32}));
  s+=fade(seg(p,.35,.5),label('同じ 縮尺',870,110,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S5 ボールの波長と電子顕微鏡 =================
 [K+'b1']:(p,ctx)=>{
  const t=sceneT(p,ctx),x=150+((t*260)%900);
  return ball(x,220-60*Math.sin(PI*((x-150)/900)))+card(330,330,540,120,label('ボールの 波長は？',600,405,{size:36,color:LC,anchor:'middle',weight:700}),seg(p,.3,.45),LC);
 },
 [K+'b2']:(p)=>ball(150,110,30)+fade(seg(p,.02,.15),label('0.15 kg、40 m/s',230,120,{size:30,color:C.ink,weight:700}))+fcard(210,200,780,150,`${pt}=0.15\\times40=6.0${U('kg\\cdot m/s')}`,{size:48,col:PC,g:seg(p,.3,.45)}),
 [K+'b3']:(p)=>fade(.6,TX(`${pt}=6.0${U('kg\\cdot m/s')}`,600,80,{size:40}))+fcard(170,170,860,170,`${lam}=\\dfrac{6.6\\times10^{-34}}{6.0}\\approx1.1\\times10^{-34}${U('m')}`,{size:50,col:LC,g:seg(p,.05,.2)}),
 [K+'b4']:(p)=>{
  let s=logRuler({g:seg(p,.02,.15)});
  s+=fade(seg(p,.02,.15),label('目盛り 1つで 10倍',600,60,{size:28,color:C.dim,anchor:'middle'}));
  const xb=lrX(Math.log10(1.1e-34)),xe=lrX(Math.log10(1.2e-10)),xa=lrX(-10),xl=lrX(Math.log10(5e-7));
  s+=fade(seg(p,.15,.3),dot(xb,LR.y,10,PC)+label('ボール',xb,LR.y-70,{size:26,color:PC,anchor:'middle',weight:700})+tex('1.1\\times10^{-34}',xb+20,LR.y-36,{size:26,color:PC,auto:false}));
  s+=fade(seg(p,.3,.45),dot(xe,LR.y,10,LC)+label('100 V の 電子',xe,LR.y+100,{size:26,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('原子',xa,LR.y-36,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.55),rect(lrX(Math.log10(4e-7)),LR.y-12,lrX(Math.log10(7e-7))-lrX(Math.log10(4e-7))+2,24,{fill:C.hi,fo:.7,stroke:C.hi,rx:4})+label('可視光',xl,LR.y-36,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=span(xb,xe,LR.y-130,{text:'約 24 桁',color:C.hi,g:seg(p,.6,.75),size:30,dy:-18});
  return s;
 },
 [K+'b5']:(p)=>{
  let s=fade(.35,logRuler());
  s+=card(200,120,800,230,label('ボール：縞の 間隔も 小さすぎて 見えない',600,200,{size:30,color:PC,anchor:'middle',weight:700})+label('波が 目立つのは ミクロの 粒',600,285,{size:34,color:LC,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'b6']:(p)=>{
  let s=fade(seg(p,.02,.15),rect(520,90,160,60,{fill:'#3a4a66',fo:1,stroke:C.dim,rx:10})+rect(560,150,80,170,{fill:'#56627a',fo:1,stroke:C.dim,rx:8})+rect(470,340,260,30,{fill:'#3a4a66',fo:1,stroke:C.dim,rx:6})+rect(450,370,300,40,{fill:'#26324a',fo:1,stroke:C.dim,rx:6}));
  s+=fade(seg(p,.3,.45),label('電子顕微鏡',600,470,{size:34,color:NEG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'b7']:(p)=>{
  let s=card(60,60,520,400,label('光：波長 数百 nm',320,115,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=blobs(320,280,46,120,{g:seg(p,.05,.2)});
  s+=fade(seg(p,.4,.55),label('2つの 点が くっついて 見える',320,430,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('波長より 細かい 形は 見分けられない',600,500,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'b8']:(p)=>{
  let s=card(60,60,520,400,label('光：波長 数百 nm',320,115,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi)+blobs(320,280,46,120);
  s+=card(620,60,520,400,label('電子：その 数千分の1',880,115,{size:30,color:NEG,anchor:'middle',weight:700}),seg(p,.05,.2),NEG);
  s+=fade(seg(p,.2,.35),blobs(880,280,46,16,{color:NEG})+label('はっきり 2つ',880,430,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'b9']:(p)=>{
  let s=fcard(250,50,700,150,LAMMV,{size:56,col:LC});
  s+=card(150,250,420,180,label('質量の ある 粒',360,320,{size:30,color:C.ink,anchor:'middle',weight:700})+okMark(360,385,1),seg(p,.15,.3),OK);
  s+=card(630,250,420,180,label('光子（質量 なし）',840,320,{size:30,color:C.hi,anchor:'middle',weight:700})+label('この 形では 使わない',840,390,{size:26,color:BAD,anchor:'middle',weight:700}),seg(p,.5,.65),BAD);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'a1']:(p)=>fcard(300,60,600,180,LAMDEF,{size:70,col:LC,g:seg(p,.05,.2)})+fade(seg(p,.4,.55),label('電子も 波の 性質を 持つ',600,300,{size:34,color:C.ink,anchor:'middle',weight:700})),
 [K+'a2']:(p)=>fade(.6,TX(LAMDEF,600,90,{size:50}))+tag('仮説 → 実験で 確認',600,200,{color:C.hi,size:28})+card(200,270,800,140,label('100 V の 電子',370,352,{size:30,color:C.ink,anchor:'middle',weight:700})+TX(`${lam}\\approx1.2\\times10^{-10}${U('m')}`,720,355,{size:42}),seg(p,.4,.55),LC),
 [K+'x']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=atomOrbit(330,262,170,{ang:t*.6});
  s+=ringWave(330,262,170,5.5,{A:16,turns:seg(p,.2,.6),g:seg(p,.2,.3),from:0});
  s+=card(640,150,500,210,label('電子の 波が 安定する',890,225,{size:30,color:C.ink,anchor:'middle'})+label('条件は？',890,305,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'bye']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  return atomOrbit(330,262,170,{ang:t*.6})+ringWave(330,262,170,5.5,{A:16})+card(640,150,500,210,label('電子の 波が 安定する',890,225,{size:30,color:C.ink,anchor:'middle'})+label('条件は？',890,305,{size:44,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
 },
};
