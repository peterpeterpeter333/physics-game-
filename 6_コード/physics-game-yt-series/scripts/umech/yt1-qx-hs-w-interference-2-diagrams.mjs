// 問題編 解説「縞の間隔を測る」(ys-qx-hs-w-interference-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/305_干渉と回折.md の q-hs-w-interference-2（解説 19 行）。
// 装置：左に光源（500 nm、淡い黄）、中にスリット板（S₁ 水色系・S₂ 桃系）、右にスクリーン。d と θ は大きく描く（注記を出す）。
// 色（正本の指定）：λ・経路差・d・L・y 水色、θ 橙、S₁ の波 水色系 W1、S₂ の波 桃系 W2、明るい縞 黄、強調 黄。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {W1,W2} from './yt1-hs-w-sound-2-diagrams.mjs';
import {arc} from './yt1-hs-m-energy-1-diagrams.mjs';
import {lamp,LIGHT,ANG} from './yt1-hs-w-light-1-diagrams.mjs';
import {card,textW,goalTag,answerTag,answerTagW,wrongCard,wrongSeq,kindTag,note,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-w-interference-2:';
const PI=Math.PI;
const LC=C.x,STR=C.hi,DARK='#8d9ab3';
const n2=v=>Number(v.toFixed(2));
const G1='明るい縞の間隔 Δy',G2='d＝0.20 mm のときの Δy',G3='≈ で書く理由';
const A1=g=>answerTag(1,'B','2.5 mm',{g}),A2=g=>answerTag(2,'D','5.0 mm',{g}),A3=g=>answerTag(3,'A','平行とみなし、sinθ≈tanθ',{g});
// TeX の記号（色つき）
const c=(col,s)=>`{\\color{${col}}${s}}`;
const lam=c(LC,'\\lambda'),dd=c(LC,'d'),LL=c(LC,'L'),yy=c(LC,'y'),th=c(ANG,'\\theta'),Dy=c(LC,'\\Delta y');
const T=(src,x,y,size=40,o={})=>tex(src,x,y,{size,auto:false,...o});
const sT=ctx=>(ctx?.scene?.captions?.[ctx.k]?.start??0)+(ctx?.t??0);
const s2=(ctx,d=.5)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
let CL=0;
// 文字の後ろに暗い下地
function tl(t,x,y,{size=24,color=C.ink,anchor='start',weight=700}={}){const w=textW(t,size)+12,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w+6:x-6;
 return rect(x0,y-size*.95,w,size*1.32,{fill:C.bg,fo:.85,stroke:'none',rx:6})+label(t,x,y,{size,color,anchor,weight});}

// ---- 装置 -------------------------------------------------------------------------------------------
const AP={lx:80,px:400,scr:980,cy:300,gap:100,top:96,bot:505,lam:40,Td:1.2,sp:60};
// 明るい縞（スクリーンの右の帯）。reveal：中央から外へ現れる割合。sp：縞の間隔 px
function fringes({g=1,x=AP.scr+10,w=46,sp=AP.sp,reveal=1,cy=AP.cy,y0=AP.top,y1=AP.bot}={}){
 if(g<=0)return '';let s='';const R=reveal*(y1-y0)/2+2;
 if(reveal>0)for(let y=y0;y<y1;y+=4){if(Math.abs(y+2-cy)>R)continue;const I=Math.cos(PI*(y+2-cy)/sp)**2;s+=rect(x,y,w,4.4,{fill:'#fff3b0',fo:.06+.88*I,stroke:'none',rx:0});}
 return fade(g,rect(x,y0,w,y1-y0,{fill:'#1a2234',fo:1,stroke:'#3a4a66',sw:1.5,rx:3})+s);
}
// スリット板・スクリーン・光源・波
function app(t,{g=1,gap=AP.gap,dTxt='0.40',dFlash=0,inc=1,waves=1,front=null,screen=1,labs=1,noteG=1,lampG=1}={}){
 const id='qxi2c'+(++CL),s1=AP.cy-gap/2,s2y=AP.cy+gap/2;let s='';
 s+=lamp(AP.lx,AP.cy,{g:lampG});
 if(labs)s+=fade(lampG,label('500 nm',AP.lx,AP.cy+76,{size:26,color:LIGHT,anchor:'middle',weight:700})+label('光源',AP.lx,AP.cy-58,{size:24,color:C.dim,anchor:'middle'}));
 // 入ってくる平らな波面
 if(inc>0){const ph=((t/AP.Td)%1)*AP.lam;let w='';for(let k=0;k<12;k++){const x=AP.lx+44+ph+k*AP.lam;if(x>AP.px-6)break;w+=line(x,AP.cy-70,x,AP.cy+70,{color:LIGHT,w:2.5,opacity:.7});}s+=fade(inc,w);}
 // スリットのあとの円い波（front：先頭の半径 px）
 if(waves>0){const ph=((t/AP.Td)%1)*AP.lam,R=front??2000;let w='';
  for(let k=0;k<30;k++){const r=ph+k*AP.lam;if(r>Math.min(R,AP.scr-AP.px+40))break;if(r<3)continue;
   w+=`<path d="M ${n2(AP.px)} ${n2(s1-r)} A ${n2(r)} ${n2(r)} 0 0 1 ${n2(AP.px)} ${n2(s1+r)}" fill="none" stroke="${W1}" stroke-width="2.5" opacity=".75"/>`;
   w+=`<path d="M ${n2(AP.px)} ${n2(s2y-r)} A ${n2(r)} ${n2(r)} 0 0 1 ${n2(AP.px)} ${n2(s2y+r)}" fill="none" stroke="${W2}" stroke-width="2.5" opacity=".75"/>`;}
  s+=fade(waves,`<clipPath id="${id}"><rect x="${AP.px}" y="${AP.top}" width="${AP.scr-AP.px}" height="${AP.bot-AP.top}"/></clipPath><g clip-path="url(#${id})">${w}</g>`);}
 // 板
 const pl=(a,b)=>rect(AP.px-6,a,12,b-a,{fill:'#56627a',fo:1,stroke:C.dim,rx:2});
 s+=pl(AP.top,s1-7)+pl(s1+7,s2y-7)+pl(s2y+7,AP.bot);
 s+=tl('S₁',AP.px+14,s1-12,{size:24,color:W1})+tl('S₂',AP.px+14,s2y+30,{size:24,color:W2});
 if(screen)s+=rect(AP.scr-4,AP.top,8,AP.bot-AP.top,{fill:'#c8d2e4',fo:.9,stroke:'none',rx:2});
 s+=fringes({g:screen,reveal:0});   // 縞の帯（空）。縞そのものは fringes() を上に重ねて描く
 if(labs){
  s+=line(AP.px-24,s1,AP.px-24,s2y,{color:LC,w:2.5})+line(AP.px-32,s1,AP.px-16,s1,{color:LC,w:2.5})+line(AP.px-32,s2y,AP.px-16,s2y,{color:LC,w:2.5});
  const dl=`d ＝ ${dTxt} mm`;
  const dy0=AP.cy-gap/2-34;
  s+=tl(dl,AP.px-20,dy0,{size:26,color:LC,anchor:'end'});
  s+=fade(dFlash,rect(AP.px-20-textW(dl,26)-12,dy0-30,textW(dl,26)+20,42,{fill:C.hi,fo:.22,stroke:C.hi,sw:3,rx:8}));
  s+=arrow(AP.px+4,AP.bot-16,AP.scr-4,AP.bot-16,{color:LC,w:2.5,head:12})+arrow(AP.scr-4,AP.bot-16,AP.px+4,AP.bot-16,{color:LC,w:2.5,head:12});
  s+=tl('L ＝ 2.0 m',(AP.px+AP.scr)/2,AP.bot-28,{size:26,color:LC,anchor:'middle'});
  s+=label('スクリーン',AP.scr+33,AP.top-4+0,{size:22,color:C.dim,anchor:'middle'});
  s+=fade(noteG,label('d は 大きく 描いています',40,AP.bot-6,{size:22,color:C.dim}));
 }
 return fade(g,s);
}

// ---- スリットのそばの拡大図（角も間隔も大きく描く）。基準：A＝(330,140)、B＝(330,400)、θ＝25° ------------
const ZM={A:[330,140],B:[330,400],deg:25};
function zoomFig({g=1,rays=1,perp=0,ext=0,hyp=0,ang=0,lab=1,len=760,noteG=1,clipY=92}={}){
 const [ax,ay]=ZM.A,[bx,by]=ZM.B,a=ZM.deg*PI/180,u=[Math.cos(a),-Math.sin(a)];
 const dp=(ax-bx)*u[0]+(ay-by)*u[1],F=[bx+dp*u[0],by+dp*u[1]];
 const pl=(y0,y1)=>rect(ax-6,y0,12,y1-y0,{fill:'#56627a',fo:1,stroke:C.dim,rx:2});
 let s=pl(96,ay-10)+pl(ay+10,by-10)+pl(by+10,505);
 s+=tl('S₁',ax-44,ay+8,{size:26,color:W1})+tl('S₂',bx-44,by+8,{size:26,color:W2});
 if(rays)s+=fade(rays,line(ax,ay,ax+len*u[0],ay+len*u[1],{color:W1,w:4})+line(bx,by,bx+len*u[0],by+len*u[1],{color:W2,w:4})+(lab?tl('P へ（ほぼ 平行）',ax+330*u[0]+30,ay+330*u[1]-14,{size:24}):''));
 if(hyp)s+=fade(hyp,line(ax,ay,bx,by,{color:STR,w:4})+T('d',ax-30,(ay+by)/2+10,34,{color:LC}));
 if(perp){s+=fade(perp,line(ax,ay,F[0],F[1],{color:STR,w:3,dash:'8 6'}));
  const v=[-u[0],-u[1]],w=[ax-F[0],ay-F[1]],wl=Math.hypot(...w),q=16;const p1=[F[0]+v[0]*q,F[1]+v[1]*q],p2=[F[0]+w[0]/wl*q,F[1]+w[1]/wl*q],p3=[p1[0]+w[0]/wl*q,p1[1]+w[1]/wl*q];
  s+=fade(perp,draw([p1,p3,p2],1,{color:STR,w:2}));}
 if(ext)s+=fade(ext,line(bx,by,F[0],F[1],{color:LC,w:10})+tl('経路差',(bx+F[0])/2+30,(by+F[1])/2+36,{size:26,color:LC}));
 if(ang){const a2=Math.atan2(-(F[1]-ay),F[0]-ax)*180/PI;s+=fade(ang,arc(ax,ay,64,-90,a2,{color:ANG,w:3})+T('\\theta',ax+28,ay+92,30,{color:ANG}));}
 const id='qxi2z'+(++CL);
 s=`<clipPath id="${id}"><rect x="0" y="${clipY}" width="1200" height="${515-clipY}"/></clipPath><g clip-path="url(#${id})">${s}</g>`;
 s+=fade(noteG,label('角も 間隔も 大きく 描いています',1180,505,{size:22,color:C.dim,anchor:'end'}));
 return fade(g,s);
}
// 拡大図を小さく置く（x,y：左上、k：倍率）
const zoomAt=(x,y,k,o={})=>`<g transform="translate(${x} ${y}) scale(${k})">${zoomFig({noteG:0,lab:0,len:560,...o})}</g>`;

// ---- 縞を横に並べた帯（誤答 C：明るい→暗い と 明るい→明るい） ------------------------------------------------
function bandH({x0=150,x1=1050,y=150,h=80,sp=200,g=1}={}){
 let s=rect(x0,y,x1-x0,h,{fill:'#1a2234',fo:1,stroke:'#3a4a66',sw:1.5,rx:4});const cx=(x0+x1)/2;
 for(let x=x0;x<x1;x+=4){const I=Math.cos(PI*(x+2-cx)/sp)**2;s+=rect(x,y,4.4,h,{fill:'#fff3b0',fo:.06+.88*I,stroke:'none',rx:0});}
 return fade(g,s);
}
// 引き伸ばし：500 nm の小さな物差し → 2.5 mm の物差し
function stretchFig(u,{g=1,x0=170,y=300,x1=560,L=500}={}){
 let s=rect(x0,y-10,10,20,{fill:LC,fo:.9,stroke:LC,rx:2})+tl('500 nm',x0+5,y+48,{size:24,color:LC,anchor:'middle'})+label('（経路差）',x0+5,y+80,{size:22,color:C.dim,anchor:'middle'});
 const w=mix(10,L,u),xx=mix(x0,x1,u);
 if(u>0)s+=rect(xx,y-10,w,20,{fill:LC,fo:.35+.5*u,stroke:LC,rx:2});
 s+=fade(seg(u,.9,1),tl('2.5 mm',x1+L/2,y+48,{size:26,color:LC,anchor:'middle'})+label('（縞の 間隔）',x1+L/2,y+80,{size:22,color:C.dim,anchor:'middle'}));
 s+=fade(seg(u,.2,.5),arrow(x0+40,y-40,x1-20,y-40,{color:C.hi,w:3,head:12})+tl('× 5000',(x0+x1)/2+10,y-54,{size:28,color:C.hi,anchor:'middle'}));
 return fade(g,s);
}
// 縞の帯に、番号と物差し（縦）
function rulerV(x,ya,yb,text,{g=1,color=LC,side=1,size=24}={}){
 return fade(g,line(x,ya,x,yb,{color,w:4})+line(x-8,ya,x+8,ya,{color,w:3})+line(x-8,yb,x+8,yb,{color,w:3})+tl(text,x+side*14,(ya+yb)/2+8,{size,color,anchor:side>0?'start':'end'}));
}

export const qxHsWInterference2Diagrams={
 // ================= 問題アニメ：出題（小問1、5 秒＋静止） =================
 // 光が板に届き、スリットから広がり、スクリーンに明るい縞が中央から外へ順に現れる。縞の間隔の数値は見せない。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx);
  return app(t,{inc:seg(t,.1,.6),waves:seg(t,1.2,1.6),front:Math.max(0,(t-1.2)*420),labs:1})
   +fringes({g:seg(t,3,3.3),reveal:lin(t,3,4.6)});
 },
 // ================= 問題アニメ：小問2（3 秒＋静止） =================
 // 縞と波を消し、スクリーンは何も映らない灰色の板。d の表示だけが 0.40 mm → 0.20 mm に替わり、一度光る。スリットの絵は変えない。
 [K+'q2']:(p,ctx)=>{
  const t=cueT(ctx),sw=t>1.3;
  let s=app(5,{inc:1-seg(t,0,.6),waves:1-seg(t,0,.6),dTxt:sw?'0.20':'0.40',dFlash:t<1.3?0:Math.sin(PI*clamp((t-1.3)/1.2))});
  s+=fringes({g:1-seg(t,0,.7)});
  return s;
 },
 // ================= 問題アニメ：小問3（小問1 の静止画） =================
 [K+'q3']:(p,ctx)=>app(5,{inc:1,waves:1})+fringes({}),

 // ================= S1 小問1 =================
 // 1. 出題中の図
 [K+'setup']:(p,ctx)=>{
  const t=sT(ctx)+5;
  return app(t)+fringes({});
 },
 // 2. 求めるもの。スクリーン上の点 y と、S₁・S₂ からの2本の線
 [K+'goal1']:(p,ctx)=>{
  const t=sT(ctx)+5,b=s2(ctx),Yp=AP.cy-110,g2=seg(p,b,b+.1);
  let s=app(t,{waves:1-.7*g2,inc:1-.7*g2})+fringes({g:1-.6*g2});
  s+=fade(g2,line(AP.px,AP.cy-AP.gap/2,AP.scr,Yp,{color:W1,w:3.5})+line(AP.px,AP.cy+AP.gap/2,AP.scr,Yp,{color:W2,w:3.5}));
  s+=fade(g2,line(AP.px,AP.cy,AP.scr,AP.cy,{color:C.dim,w:2,dash:'8 8'})+dot(AP.scr,Yp,9,C.ink));
  s+=fade(seg(p,b+.15,b+.25),arrow(AP.scr+70,AP.cy,AP.scr+70,Yp+4,{color:LC,w:3,head:12})+T('y',AP.scr+96,(AP.cy+Yp)/2+10,32,{color:LC}));
  s+=goalTag(G1,{g:seg(p,.03,.12)});
  return s;
 },
 // 3. 拡大：ほぼ平行の2本の線、垂線、斜辺 d、角 θ、経路差 ＝ d sinθ。「近似」のタグと ≈ を黄で
 [K+'zoom']:(p,ctx)=>{
  const b=s2(ctx);
  let s=zoomFig({rays:seg(p,.03,.15),perp:seg(p,b,b+.08),hyp:seg(p,b+.05,b+.13),ang:seg(p,b+.12,b+.2),ext:seg(p,b+.2,b+.3)});
  const hi=seg(p,b+.4,b+.48);
  s+=card(740,300,440,90,label('経路差',800,357,{size:30,color:LC,weight:700})+T(`${c(hi>.5?STR:C.ink,'\\approx')}\\ ${dd}\\sin${th}`,1010,345,40),seg(p,b+.32,b+.4),C.dim);
  s+=kindTag('近似',960,430,{g:seg(p,b+.42,b+.5)});
  s+=goalTag(G1);
  return s;
 },
 // 4. 大きな三角形：底辺 L、高さ y、角 θ。tanθ＝y/L、θ が小さい → sinθ≈tanθ、経路差 ≈ dy/L
 [K+'tan']:(p,ctx)=>{
  const b=s2(ctx),Yp=AP.cy-110,M=[AP.px,AP.cy];
  let s=fade(.6,app(5,{waves:0,inc:0,labs:0,lampG:0}));
  s+=fade(seg(p,.03,.12),poly([M,[AP.scr,AP.cy],[AP.scr,Yp]],{fill:STR,fo:.1,stroke:STR,sw:3})+rect(AP.scr-20,AP.cy-20,20,20,{fill:'none',fo:0,stroke:STR,sw:2,rx:0}));
  s+=fade(seg(p,.05,.15),T('L',(AP.px+AP.scr)/2,AP.cy+40,34,{color:LC})+T('y',AP.scr+28,(AP.cy+Yp)/2+10,34,{color:LC}));
  const a2=Math.atan2(AP.cy-Yp,AP.scr-AP.px)*180/PI;
  s+=fade(seg(p,.08,.18),arc(AP.px,AP.cy,150,0,a2,{color:ANG,w:3})+T('\\theta',AP.px+175,AP.cy-12,30,{color:ANG}));
  s+=card(20,96,360,74,T(`\\tan${th}=\\dfrac{${yy}}{${LL}}`,200,138,34),seg(p,.12,.22),C.dim);
  s+=card(20,184,360,74,T(`\\sin${th}\\approx\\tan${th}`,200,224,34),seg(p,.3,.4),C.E);
  s+=fade(seg(p,.3,.4),label('θ が 小さい',200,282,{size:24,color:ANG,anchor:'middle',weight:700}));
  s+=kindTag('近似',200,322,{g:seg(p,.34,.42)});
  s+=card(20,356,360,84,label('経路差',60,408,{size:28,color:LC,weight:700})+T(`\\approx\\dfrac{${dd}${yy}}{${LL}}`,250,398,36),seg(p,b+.05,b+.15),STR);
  s+=goalTag(G1);
  return s;
 },
 // 5. 明るい縞：dy/L＝mλ → 両辺に L/d を掛ける（L と d に打ち消し線）→ y＝mλL/d
 [K+'bright']:(p,ctx)=>{
  const b=s2(ctx);
  let s=card(200,96,800,96,label('明るい 縞：経路差 ＝',560,156,{size:28,color:STR,anchor:'end',weight:700})+T(`m${lam}`,610,144,40),seg(p,.04,.14),STR);
  const k1=seg(p,b+.02,b+.1),k2=seg(p,b+.2,b+.3),k3=seg(p,b+.45,b+.55);
  s+=card(200,212,800,130,fade(1-k2,T(`\\dfrac{${dd}${yy}}{${LL}}=m${lam}`,600,284,44)),k1*(1-k3),C.dim);
  s+=fade(k2*(1-k3),T(`\\dfrac{${LL}}{${dd}}\\times\\dfrac{\\cancel{${dd}}\\,${yy}}{\\cancel{${LL}}}=m${lam}\\times\\dfrac{${LL}}{${dd}}`,600,290,40));
  s+=fade(k2*(1-k3),label('両辺に L/d を 掛ける',600,380,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(300,212,600,130,T(`${yy}=\\dfrac{m${lam}${LL}}{${dd}}`,600,284,48),k3,STR);
  s+=goalTag(G1);
  return s;
 },
 // 6. y(m＋1) − y(m) → Δy＝λL/d。スクリーンの縞に m＝0、1、2 と、同じ長さの物差し
 [K+'diff']:(p,ctx)=>{
  const b=s2(ctx);
  let s=card(30,92,700,120,T(`${yy}=\\dfrac{m${lam}${LL}}{${dd}}`,380,160,40),1,C.dim);
  s+=card(30,222,700,120,T(`\\dfrac{(m+1)${lam}${LL}}{${dd}}-\\dfrac{m${lam}${LL}}{${dd}}`,380,290,36),seg(p,.05,.15),C.dim);
  s+=card(30,352,700,130,T(`${Dy}=\\dfrac{${lam}${LL}}{${dd}}`,380,424,44),seg(p,.3,.4),STR);
  // 縞の帯（縦）
  const x=900,cy=300,sp=80;
  s+=fade(seg(p,b-.05,b+.05),fringes({x,w:70,sp,cy,y0:96,y1:505}));
  s+=fade(seg(p,b,b+.1),[0,1,2].map(m=>tl(`m＝${m}`,x-14,cy-m*sp+8,{size:22,color:STR,anchor:'end'})).join(''));
  s+=rulerV(x+100,cy,cy-sp,'Δy',{g:seg(p,b+.15,b+.25)})+rulerV(x+100,cy-sp,cy-2*sp,'Δy',{g:seg(p,b+.25,b+.35)});
  s+=fade(seg(p,b+.35,b+.45),label('等間隔',x+170,320,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 7. 単位をメートルに：500 nm → 5.0×10⁻⁷ m、0.40 mm → 4.0×10⁻⁴ m
 [K+'unit']:(p,ctx)=>{
  const b=s2(ctx);
  let s=card(150,120,900,110,T(`500\\ \\mathrm{nm}=500\\times10^{-9}\\ \\mathrm{m}=5.0\\times10^{-7}\\ \\mathrm{m}`,600,178,40,{color:LC}),seg(p,b+.02,b+.12),LC);
  s+=card(150,270,900,110,T(`0.40\\ \\mathrm{mm}=0.40\\times10^{-3}\\ \\mathrm{m}=4.0\\times10^{-4}\\ \\mathrm{m}`,600,328,40,{color:LC}),seg(p,b+.4,b+.5),LC);
  s+=fade(seg(p,.04,.14),label('メートルに そろえる',600,104,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 8. 代入 → 数の部分と 10 の部分 → 2.5×10⁻³ m＝2.5 mm。縞の間に物差し。答え B
 [K+'num']:(p,ctx)=>{
  const b=s2(ctx,.8);
  let s=card(20,90,800,116,T(`${Dy}=\\dfrac{5.0\\times10^{-7}\\times2.0}{4.0\\times10^{-4}}`,420,156,38),seg(p,.03,.12),C.dim);
  s+=card(20,216,800,108,T(`=\\dfrac{5.0\\times2.0}{4.0}\\times10^{-7+4}`,420,278,38),seg(p,.25,.35),C.dim);
  s+=fade(seg(p,.3,.4),label('数の 部分',300,352,{size:22,color:C.dim,anchor:'middle'})+label('10 の 部分',580,352,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(20,366,800,90,T(`=2.5\\times10^{-3}\\ \\mathrm{m}=${c(LC,'2.5\\ \\mathrm{mm}')}`,420,416,40),seg(p,.5,.6),STR);
  const x=930,cy=300,sp=AP.sp;
  s+=fade(seg(p,.55,.65),fringes({x,w:60,sp,cy,y0:96,y1:505}));
  s+=rulerV(x+80,cy,cy-sp,'2.5 mm',{g:seg(p,.65,.75)});
  s+=goalTag(G1)+A1(seg(p,b+.03,b+.1));
  return s;
 },
 // 9. L/d＝5000。500 nm の経路差が 5000倍に引き伸ばされて 2.5 mm
 [K+'stretch']:(p,ctx)=>{
  let s=card(250,96,700,100,T(`\\dfrac{${LL}}{${dd}}=\\dfrac{2.0}{4.0\\times10^{-4}}=5000`,600,140,38),seg(p,.03,.12),C.dim);
  s+=stretchFig(seg(p,.35,.75),{y:320});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 10. 誤答 A・D を1枚ずつ。換算を点滅
 [K+'wrongAD']:(p,ctx,)=>{
  const b=s2(ctx),bl=seg(p,b,b+.03)*(.55+.45*Math.cos(cueT(ctx)*6));
  let s=card(150,96,900,70,T(`500\\ \\mathrm{nm}=5.0\\times10^{-7}\\ \\mathrm{m}`,600,134,32,{color:LC}),1,C.dim);
  s+=card(150,180,900,70,T(`0.40\\ \\mathrm{mm}=4.0\\times10^{-4}\\ \\mathrm{m}`,600,218,32,{color:LC}),1,C.dim);
  s+=fade(bl,rect(150,96,900,154,{fill:C.hi,fo:.12,stroke:C.hi,sw:3,rx:14}));
  s+=goalTag(G1)+A1(1);
  s+=wrongSeq(p,ctx,[['A','0.0025 mm','d＝0.40 mm を 0.40 m と した'],['D','2.5 m','1 nm を 10⁻⁶ m と した']],{win:[[0,.45],[.45,1]],opts:{y:300}});
  return s;
 },
 // 11. 誤答 C：明るい→暗い（灰）と 明るい→明るい（黄）の物差し
 [K+'wrongC']:(p,ctx)=>{
  const x0=150,x1=1050,cx=600,sp=200;
  let s=bandH({x0,x1,y:100,h:80,sp});
  s+=fade(seg(p,.05,.15),line(cx,196,cx+sp/2,196,{color:DARK,w:5})+tl('明るい → 暗い　1.25 mm',cx+sp/2+14,204,{size:24,color:DARK}));
  s+=fade(seg(p,.3,.4),line(cx,236,cx+sp,236,{color:STR,w:5})+tl('明るい → 明るい　2.5 mm',cx+sp+14,244,{size:24,color:STR}));
  s+=fade(seg(p,.05,.15),line(cx,182,cx,250,{color:C.dim,w:1.5,dash:'4 4'}));
  s+=goalTag(G1)+A1(1);
  s+=wrongCard('C','1.25 mm','明るい 縞から 暗い 縞までを 測った',{g:seg(p,.04,.1),y:300});
  return s;
 },
 // ================= S2 小問2 =================
 // 12. 縞と物差しを消し、小問2 の画面（d＝0.20 mm、縞のないスクリーン）。Δy＝λL/d の分母の d を光らせる
 [K+'goal2']:(p,ctx)=>{
  const b=s2(ctx),hi=seg(p,b+.3,b+.4);
  let s=app(5,{inc:0,waves:0,dTxt:'0.20',dFlash:seg(p,.05,.15)*(1-seg(p,.25,.35))});
  s+=fringes({g:0});
  s+=card(460,110,460,140,T(`${Dy}=\\dfrac{${lam}${LL}}{${hi>.5?c(STR,'\\boxed{d}'):dd}}`,680,186,44),seg(p,b,b+.1),C.dim);
  s+=fade(hi,label('分母',850,214,{size:26,color:STR,weight:700}));
  s+=goalTag(G2,{g:seg(p,.03,.12)});
  return s;
 },
 // 13. Δy＝2.5×0.40÷0.20＝5.0 mm。答え D。札のあとで、スリットを狭めて描き、2倍の間隔の縞を中央から
 [K+'ans2']:(p,ctx)=>{
  const b=s2(ctx),ve=voiceEnd(ctx),r=seg(p,ve+.01,ve+.06),gap=mix(AP.gap,AP.gap/2,r),fr=lin(p,ve+.05,ve+.18);
  let s=app(5,{inc:0,waves:0,dTxt:'0.20',gap});
  s+=fringes({sp:2*AP.sp,reveal:fr,g:fr>0?1:0});
  s+=card(440,104,440,116,T(`${Dy}=2.5\\times\\dfrac{0.40}{0.20}=${c(LC,'5.0\\ \\mathrm{mm}')}`,660,170,34),seg(p,.03,.13),STR);
  s+=rulerV(AP.scr+70,AP.cy,AP.cy-2*AP.sp,'5.0 mm',{g:seg(p,ve+.18,ve+.24)});
  // 前の縞（2.5 mm 間隔）を灰色の細い線で
  let old='';for(let k=-2;k<=2;k++)old+=line(930,AP.cy+k*AP.sp,970,AP.cy+k*AP.sp,{color:DARK,w:2});
  s+=fade(seg(p,ve+.22,ve+.3),old+label('前の 縞',965,AP.cy+144,{size:22,color:DARK,anchor:'end'})+label('（2.5 mm）',965,AP.cy+170,{size:22,color:DARK,anchor:'end'}));
  s+=goalTag(G2)+A2(seg(p,b+.03,b+.1));
  return s;
 },
 // 14. 誤答 A・B・C を1枚ずつ。d は分母に1回だけ
 [K+'wrong2']:(p,ctx)=>{
  const b=s2(ctx);
  let s=card(380,96,440,130,T(`${Dy}=\\dfrac{${lam}${LL}}{${c(STR,'d')}}`,600,166,44),1,C.dim);
  s+=fade(seg(p,b,b+.08),label('d は 分母に 1回だけ',600,266,{size:28,color:STR,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(1);
  s+=wrongSeq(p,ctx,[['A','1.25 mm','d に 比例すると した'],['B','2.5 mm','d に よらないと した'],['C','10 mm','d の 2乗に 反比例すると した']],{win:[[0,.17],[.17,.33],[.33,1]],opts:{y:300}});
  return s;
 },
 // ================= S3 小問3 =================
 // 15. 小問1 の図に戻す → 拡大図（ほぼ平行）と sinθ≈tanθ を左右に並べ、二つの「近似」と ≈ を光らせる
 [K+'goal3']:(p,ctx)=>{
  const b=s2(ctx),sw=seg(p,b-.03,b+.04),t=sT(ctx)+5;
  let s=fade(1-sw,app(t)+fringes({}));
  s+=fade(sw,pair(p,b));
  s+=goalTag(G3,{g:seg(p,.03,.12)});
  return s;
 },
 // 16. 答え A。誤答 B
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx,.35);
  let s=pair(0,1)+goalTag(G3)+A3(seg(p,b*.6,b*.6+.06));
  s+=wrongCard('B','光の 速さが 丸めた 値','式に 光の 速さは 入っていない',{g:seg(p,b+.02,b+.07),y:345});
  return s;
 },
 // 17. 誤答 C。番号9 の伸びる物差しを小さく
 [K+'wrongC3']:(p,ctx)=>{
  let s=`<g transform="translate(120 40) scale(.8)">${stretchFig(seg(p,.3,.75),{y:200})}</g>`;
  s+=goalTag(G3)+A3(1);
  s+=wrongCard('C','経路差を 無視した','経路差を L/d 倍に 引き伸ばして 見ている',{g:seg(p,.03,.09),y:345});
  return s;
 },
 // 18. 誤答 D
 [K+'wrongD3']:(p,ctx)=>{
  let s=fade(.6,pair(0,1));
  s+=goalTag(G3)+A3(1);
  s+=wrongCard('D','縞が ぼやけて 測れない','測定の 精度 ではなく、式の 近似',{g:seg(p,.03,.09),y:345});
  return s;
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p,ctx)=>{
  let s=card(20,112,370,300,'',seg(p,.03,.12),C.E);
  s+=fade(seg(p,.03,.12),zoomAt(60,70,.4,{rays:1,perp:1,ext:1,hyp:1,ang:0,clipY:112})+label('経路差',150,372,{size:26,color:LC,anchor:'middle',weight:700})+T(`\\approx\\dfrac{${dd}${yy}}{${LL}}`,270,362,34));
  s+=card(410,112,380,300,'',seg(p,.2,.3),STR);
  s+=fade(seg(p,.2,.3),T(`${Dy}=\\dfrac{${lam}${LL}}{${dd}}`,600,190,44)+label('＝ 2.5 mm',600,280,{size:32,color:LC,anchor:'middle',weight:700})+label('（d＝0.20 mm なら 5.0 mm）',600,330,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(810,112,370,300,'',seg(p,.4,.5),C.hi);
  s+=fade(seg(p,.4,.5),T(`\\dfrac{${LL}}{${dd}}=5000`,995,190,40)+label('倍の 引き伸ばし',995,270,{size:28,color:C.hi,anchor:'middle',weight:700})+label('500 nm → 2.5 mm',995,330,{size:26,color:LC,anchor:'middle',weight:700}));
  s+=ansRow([[1,'B','2.5 mm'],[2,'D','5.0 mm'],[3,'A','平行とみなし、sinθ≈tanθ']],{g:seg(p,.6,.7)});
  return s;
 },
};
// 小問3：拡大図（左）と sinθ≈tanθ（右）を並べる。p,b は光らせる時刻
function pair(p,b){
 let s=card(20,96,560,236,'',1,C.dim)+zoomAt(110,52,.45,{rays:1,perp:1,ext:1,hyp:1,ang:0,clipY:105});
 s+=label('二本の 線を 平行と みなす',300,318,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=card(620,96,560,236,'',1,C.dim);
 const hi=seg(p,b+.1,b+.2)*(.6+.4*Math.sin(p*40));
 s+=T(`\\sin${th}\\ ${c(hi>.3?STR:C.ink,'\\approx')}\\ \\tan${th}`,900,206,46);
 s+=label('θ が 小さい',900,280,{size:26,color:ANG,anchor:'middle',weight:700});
 s+=kindTag('近似',520,130,{g:1})+kindTag('近似',900,130,{g:1});
 s+=fade(hi,rect(22,98,556,232,{fill:'none',fo:0,stroke:STR,sw:3,rx:14})+rect(622,98,556,232,{fill:'none',fo:0,stroke:STR,sw:3,rx:14}));
 return s;
}
// 答えの札を右上に横一列（長い値は2行の札）
function ansRow(items,{g=1,size=22,gap=10,maxW=330}={}){let x=1190,s='';for(const it of [...items].reverse()){s+=answerTag(...it,{g,right:x,size,maxW});x-=answerTagW(...it,{size,maxW})+gap;}return s;}
