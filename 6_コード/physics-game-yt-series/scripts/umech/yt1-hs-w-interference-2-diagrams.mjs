// 高校編「干渉と回折・深く学ぶ 2/2」(ys-hs-w-interference-2) — 図。Stage 1200×515.
// 色は 1/2 と同じ（λ・y 水色、S₁ の波 W1、S₂ の波 W2、明るい縞・強め合い 黄、経路差 水色）。θ は橙（光波の回と同じ）。d・L は白。
// 図は d を大きく、θ を大きく描く（実際は L/d＝2000、θ≈0.07°）。そのことを画面と語りで言う。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,clamp} from './anim.mjs';
import {card,tag,T2,sceneT,LC,TCOL,VCOL,ROPE,Lt} from './yt1-hs-w-basics-1-diagrams.mjs';
import {W1,W2} from './yt1-hs-w-sound-2-diagrams.mjs';
import {table,arc} from './yt1-hs-m-energy-1-diagrams.mjs';
import {lamp,LIGHT,ANG} from './yt1-hs-w-light-1-diagrams.mjs';

const K='hs-w-interference-2:';
const PI=Math.PI, STR=C.hi, WEAK='#8d9ab3';
const n=v=>Number(v.toFixed(2));
const th=`{\\color{${ANG}}\\theta}`, yv=`{\\color{${LC}}y}`;
const MMs='\\ \\mathrm{mm}', Ms='\\ \\mathrm{m}', NMs='\\ \\mathrm{nm}';
let CLIP=0;
// ---- single slit: plane waves from the left, spreading after the gap --------------------------------
function slitWaves({x0=40,x1=1160,y0=20,y1=495,wx=600,cy=257,w=200,lam=50,t=0,T=1.6,spread=null,g=1,col='#7fb6ff',labelW=''}={}){
 const id='cl'+(++CLIP);const sp=spread??(w<=lam*1.3?84:28);
 let s=`<clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}"/></clipPath><g clip-path="url(#${id})">`;
 s+=rect(x0,y0,x1-x0,y1-y0,{fill:'#0f2846',fo:.5,stroke:'none',rx:0});
 const ph=((t/T)%1)*lam;
 for(let k=-1;k<60;k++){const xx=wx-(k*lam)+ph-lam;if(xx<x0-lam)break;if(xx<=wx)s+=line(xx,y0,xx,y1,{color:col,w:3});}
 for(let k=0;k<60;k++){const r=ph+k*lam;if(wx+r>x1+lam)break;if(r<2)continue;
  s+=line(wx+r,cy-w/2,wx+r,cy+w/2,{color:col,w:3});
  const a=sp*PI/180,op=w<=lam*1.3?1:.6;
  const top=`M ${n(wx+r)} ${n(cy-w/2)} A ${n(r)} ${n(r)} 0 0 0 ${n(wx+r*Math.cos(a))} ${n(cy-w/2-r*Math.sin(a))}`;
  const bot=`M ${n(wx+r)} ${n(cy+w/2)} A ${n(r)} ${n(r)} 0 0 1 ${n(wx+r*Math.cos(a))} ${n(cy+w/2+r*Math.sin(a))}`;
  s+=`<path d="${top} ${bot}" fill="none" stroke="${col}" stroke-width="3" opacity="${op}"/>`;}
 s+=rect(wx-8,y0,16,cy-w/2-y0,{fill:'#56627a',fo:1,stroke:C.dim,rx:2})+rect(wx-8,cy+w/2,16,y1-cy-w/2,{fill:'#56627a',fo:1,stroke:C.dim,rx:2});
 s+='</g>';
 if(labelW)s+=label(labelW,wx+18,cy+6,{size:22,color:C.ink,weight:700});
 return fade(g,s);
}
// ---- Young's apparatus -----------------------------------------------------------------------------
const YG={lx:90,sx:220,dx:440,s1:207,s2:307,cy:257,scr:1090,lam:44,T:1.6,fr:72};
const inten=y=>Math.cos(PI*(y-YG.cy)/YG.fr)**2;
function fringes({g=1,x=YG.scr+8,w=60,y0=40,y1=475,fr=YG.fr,cy=YG.cy}={}){
 let s='';for(let y=y0;y<y1;y+=4){const I=Math.cos(PI*(y-cy)/fr)**2;s+=rect(x,y,w,4.5,{fill:'#fff3b0',fo:.08+.85*I,stroke:'none',rx:0});}
 return fade(g,s);
}
function semiR(cx,cy,r,col,op,id){return `<path d="M ${n(cx)} ${n(cy-r)} A ${n(r)} ${n(r)} 0 0 1 ${n(cx)} ${n(cy+r)}" fill="none" stroke="${col}" stroke-width="2.5" opacity="${op}"/>`;}
function young(t,{g=1,lampG=1,single=1,dbl=1,waves=1,screen=1,fr=0,lines=0,wLab=0}={}){
 const id='cy'+(++CLIP);let s='';
 const ph=((t/YG.T)%1)*YG.lam;
 s+=lamp(YG.lx,YG.cy,{g:g*lampG});
 // single slit wall
 if(single)s+=fade(g*single,rect(YG.sx-6,40,12,YG.cy-12-40,{fill:'#56627a',fo:1,stroke:C.dim,rx:2})+rect(YG.sx-6,YG.cy+12,12,475-YG.cy-12,{fill:'#56627a',fo:1,stroke:C.dim,rx:2}));
 // waves between single and double slit
 if(waves&&single){let w='';for(let k=0;k<8;k++){const r=ph+k*YG.lam;if(r>YG.dx-YG.sx)break;if(r>3)w+=semiR(YG.sx,YG.cy,r,LIGHT,.7);}s+=fade(g*waves*single,`<clipPath id="${id}a"><rect x="${YG.sx}" y="40" width="${YG.dx-YG.sx}" height="435"/></clipPath><g clip-path="url(#${id}a)">${w}</g>`);}
 if(dbl)s+=fade(g*dbl,rect(YG.dx-6,40,12,YG.s1-8-40,{fill:'#56627a',fo:1,stroke:C.dim,rx:2})+rect(YG.dx-6,YG.s1+8,12,YG.s2-YG.s1-16,{fill:'#56627a',fo:1,stroke:C.dim,rx:2})+rect(YG.dx-6,YG.s2+8,12,475-YG.s2-8,{fill:'#56627a',fo:1,stroke:C.dim,rx:2}));
 if(waves&&dbl){let w='';const ph2=((t/YG.T)%1)*YG.lam;for(let k=0;k<20;k++){const r=ph2+k*YG.lam;if(r>YG.scr-YG.dx+40)break;if(r>3)w+=semiR(YG.dx,YG.s1,r,W1,.8)+semiR(YG.dx,YG.s2,r,W2,.8);}
  s+=fade(g*waves*dbl,`<clipPath id="${id}b"><rect x="${YG.dx}" y="40" width="${YG.scr-YG.dx}" height="435"/></clipPath><g clip-path="url(#${id}b)">${w}</g>`);}
 if(screen)s+=fade(g*screen,rect(YG.scr-4,40,8,435,{fill:'#c8d2e4',fo:.9,stroke:'none',rx:2}));
 if(fr)s+=fringes({g:g*fr});
 if(lines){for(let m=-2;m<=2;m++){s+=fade(g*lines,line(YG.dx,YG.cy,YG.scr,YG.cy+m*YG.fr,{color:STR,w:2.5,dash:'2 8'}));}}
 if(wLab)s+=fade(g*wLab,label('スクリーン',YG.scr-10,30,{size:24,color:C.ink,anchor:'end',weight:700}));
 return s;
}
// ---- geometry ------------------------------------------------------------------------------------
const GE={x:190,s1:215,s2:305,cy:260,scr:1080,P:110};
function geo({g=1,sym=1,P=1,th1=0,big=0,thick=0,center=1,ld=1}={}){
 let s='';const M=[GE.x,GE.cy];
 s+=fade(g,rect(GE.x-6,30,12,GE.s1-8-30,{fill:'#56627a',fo:1,stroke:C.dim,rx:2})+rect(GE.x-6,GE.s1+8,12,GE.s2-GE.s1-16,{fill:'#56627a',fo:1,stroke:C.dim,rx:2})+rect(GE.x-6,GE.s2+8,12,490-GE.s2-8,{fill:'#56627a',fo:1,stroke:C.dim,rx:2}));
 s+=fade(g,rect(GE.scr-4,30,8,460,{fill:'#c8d2e4',fo:.9,stroke:'none',rx:2}));
 if(center)s+=fade(g,line(GE.x,GE.cy,GE.scr,GE.cy,{color:C.dim,w:2,dash:'8 8'})+label('O',GE.scr+14,GE.cy+10,{size:26,color:C.dim,weight:700}));
 if(P){s+=fade(g*P,line(GE.x,GE.s1,GE.scr,GE.P,{color:W1,w:3.5})+line(GE.x,GE.s2,GE.scr,GE.P,{color:W2,w:3.5})+dot(GE.scr,GE.P,9,C.ink)+label('P',GE.scr+14,GE.P+10,{size:28,color:C.ink,weight:700}));}
 if(sym){
  s+=fade(g*sym,line(GE.x-40,GE.s1,GE.x-40,GE.s2,{color:C.ink,w:2})+line(GE.x-48,GE.s1,GE.x-32,GE.s1,{color:C.ink,w:2})+line(GE.x-48,GE.s2,GE.x-32,GE.s2,{color:C.ink,w:2})+tex('d',GE.x-62,GE.cy+10,{size:32,color:C.ink,auto:false}));
  if(ld)s+=fade(g*sym,arrow(GE.x,470,GE.scr,470,{color:C.ink,w:2.5,head:12})+arrow(GE.scr,470,GE.x,470,{color:C.ink,w:2.5,head:12})+tex('L',(GE.x+GE.scr)/2,455,{size:32,color:C.ink,auto:false}));
  s+=fade(g*sym,arrow(GE.scr+45,GE.cy,GE.scr+45,GE.P,{color:LC,w:3,head:12})+tex('y',GE.scr+70,(GE.cy+GE.P)/2+10,{size:32,color:LC,auto:false}));
  s+=fade(g*sym,tex('S_1',GE.x-34,GE.s1-14,{size:26,color:W1,auto:false})+tex('S_2',GE.x-34,GE.s2+30,{size:26,color:W2,auto:false}));
 }
 if(th1){const a=Math.atan2(GE.cy-GE.P,GE.scr-GE.x)*180/PI;s+=fade(g*th1,line(GE.x,GE.cy,GE.scr,GE.P,{color:ANG,w:2,dash:'6 6'})+arc(GE.x,GE.cy,150,0,a,{color:ANG,w:3})+tex('\\theta',GE.x+175,GE.cy-12,{size:32,color:ANG,auto:false}));}
 if(big)s+=fade(g*big,poly([[GE.x,GE.cy],[GE.scr,GE.cy],[GE.scr,GE.P]],{fill:STR,fo:.12,stroke:STR,sw:3})+rect(GE.scr-22,GE.cy-22,22,22,{fill:'none',fo:0,stroke:STR,sw:2,rx:0}));
 return s;
}
// ---- zoom near the slits (θ drawn large) -----------------------------------------------------------
const ZM={A:[330,120],B:[330,400],deg:25};
function zoom({g=1,rays=1,tri=0,perp=0,ext=0,angA=0,angR=0,hyp=0}={}){
 const [ax,ay]=ZM.A,[bx,by]=ZM.B,a=ZM.deg*PI/180,u=[Math.cos(a),-Math.sin(a)];
 const dp=(ax-bx)*u[0]+(ay-by)*u[1],F=[bx+dp*u[0],by+dp*u[1]];
 let s=fade(g,rect(ax-6,30,12,ay-10-30,{fill:'#56627a',fo:1,stroke:C.dim,rx:2})+rect(ax-6,ay+10,12,by-ay-20,{fill:'#56627a',fo:1,stroke:C.dim,rx:2})+rect(ax-6,by+10,12,500-by-10,{fill:'#56627a',fo:1,stroke:C.dim,rx:2}));
 s+=fade(g,tex('S_1',ax-36,ay+8,{size:30,color:W1,auto:false})+tex('S_2',bx-36,by+8,{size:30,color:W2,auto:false}));
 if(rays){const L=820;s+=fade(g*rays,line(ax,ay,ax+L*u[0],ay+L*u[1],{color:W1,w:4})+line(bx,by,bx+L*u[0],by+L*u[1],{color:W2,w:4})+label('P へ',ax+330*u[0]+40,ay+330*u[1]-6,{size:24,color:C.ink,weight:700}));}
 if(tri)s+=fade(g*tri,poly([[ax,ay],[bx,by],F],{fill:STR,fo:.14,stroke:'none'}));
 if(hyp)s+=fade(g*hyp,line(ax,ay,bx,by,{color:STR,w:4})+tex('d',ax-28,(ay+by)/2+10,{size:34,color:C.ink,auto:false}));
 if(perp){s+=fade(g*perp,line(ax,ay,F[0],F[1],{color:STR,w:3,dash:'8 6'}));
  const v=[-u[0],-u[1]],w=[ax-F[0],ay-F[1]],wl=Math.hypot(...w),q=16;const p1=[F[0]+v[0]*q,F[1]+v[1]*q],p2=[F[0]+w[0]/wl*q,F[1]+w[1]/wl*q],p3=[p1[0]+w[0]/wl*q,p1[1]+w[1]/wl*q];
  s+=fade(g*perp,draw([p1,p3,p2],1,{color:STR,w:2}));}
 if(ext)s+=fade(g*ext,line(bx,by,F[0],F[1],{color:LC,w:9})+label('余分な 道のり',(bx+F[0])/2+24,(by+F[1])/2+34,{size:26,color:LC,weight:700}));
 if(angA){const a2=Math.atan2(-(F[1]-ay),F[0]-ax)*180/PI;s+=fade(g*angA,arc(ax,ay,64,-90,a2,{color:ANG,w:3})+tex('\\theta',ax+30,ay+90,{size:30,color:ANG,auto:false}));}
 if(angR)s+=fade(g*angR,line(bx,by,bx+200,by,{color:C.dim,w:2,dash:'6 6'})+arc(bx,by,120,0,ZM.deg,{color:ANG,w:3})+tex('\\theta',bx+140,by-20,{size:30,color:ANG,auto:false}));
 s+=fade(g,label('角も 間隔も 大きく 描いています',1180,500,{size:22,color:C.dim,anchor:'end'}));
 return s;
}
const eq=(src,x,y,size=46)=>T2(src,x,y,{size});

export const hsWInterference2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=card(130,50,940,190,label('1 mm の 千分の一 より 短い 波長',600,120,{size:34,color:LC,anchor:'middle',weight:700})+label('模様を どうすれば 目で 見られる？',600,190,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.4,.55),label('600 nm ＝ 0.0006 mm',600,330,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'key']:(p)=>{
  let s=card(100,80,460,200,label('鍵 1',330,140,{size:28,color:C.dim,anchor:'middle'})+label('回折で 広げる',330,210,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(640,80,460,200,label('鍵 2',870,140,{size:28,color:C.dim,anchor:'middle'})+label('経路差を 引き伸ばす',870,210,{size:36,color:LC,anchor:'middle',weight:700}),seg(p,.45,.6),LC);
  return s;
 },
 [K+'pred']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=young(t,{fr:1,lampG:1});
  s+=card(470,30,560,140,label('スリットの 間隔を 広げると',750,85,{size:28,color:C.ink,anchor:'middle',weight:700})+label('縞の 間隔は？',750,140,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ================= S2 回折 =================
 [K+'def']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=slitWaves({t,w:60,lam:50,g:seg(p,.05,.2)});
  s+=fade(seg(p,.4,.55),label('陰にも 回り込む',900,110,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(60,40,300,90,label('回折',210,100,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.7,.85),C.hi);
  s+=tag('定義',210,180,{color:C.hi,g:seg(p,.8,.92)});
  return s;
 },
 [K+'wide']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=slitWaves({t,w:300,lam:50});
  s+=card(40,30,330,120,label('隙間：広い',205,82,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（波長の 6倍）',205,124,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.5,.65),label('ほぼ まっすぐ',900,70,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'narrow']:(p,ctx)=>{
  const t=sceneT(p,ctx);const w=300-250*seg(p,.05,.35);let s=slitWaves({t,w,lam:50});
  s+=card(40,30,330,120,label(w<60?'隙間：狭い':'隙間を 狭く…',205,82,{size:30,color:C.ink,anchor:'middle',weight:700})+(w<60?label('（波長 くらい）',205,124,{size:24,color:C.dim,anchor:'middle'}):''),1,C.dim);
  s+=fade(seg(p,.5,.65),label('半円の 形に 広がる',900,70,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sound']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=slitWaves({t,x0:40,x1:1160,w:60,lam:110,T:2.4,col:'#9fd0ff',wx:420});
  s+=card(700,30,450,120,label('音 170 Hz：λ ＝ 2.0 m',925,82,{size:28,color:LC,anchor:'middle',weight:700})+label('戸口の 幅 1 m ほど より 長い',925,126,{size:24,color:C.ink,anchor:'middle'}),seg(p,.25,.4),LC);
  s+=fade(seg(p,.05,.2),label('戸口',438,264,{size:24,color:C.ink,weight:700}));
  s+=fade(seg(p,.6,.75),label('塀の 向こうまで 回り込む',925,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lightd']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=slitWaves({t,x0:40,x1:1160,w:300,lam:12,T:1.2,col:LIGHT,wx:420,spread:4});
  s+=card(700,30,450,120,label('光：λ ＝ 600 nm ほど',925,82,{size:28,color:LC,anchor:'middle',weight:700})+label('戸口より はるかに 短い',925,126,{size:24,color:C.ink,anchor:'middle'}),seg(p,.05,.2),LC);
  s+=fade(seg(p,.55,.7),label('影が はっきり',925,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),rect(44,462,340,40,{fill:C.bg,fo:.92,stroke:'none',rx:8})+label('（波長は 大きく 描いています）',56,490,{size:22,color:C.dim}));
  return s;
 },
 [K+'ratio']:(p)=>{
  let s=card(200,60,800,130,label('広がり方 ← 波長 と 隙間の 幅 の 比',600,138,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(200,260,800,130,label('光を 広げる → とても 細い 隙間',600,338,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ================= S3 ヤングの実験 =================
 [K+'young']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=young(t,{dbl:seg(p,.2,.35),screen:seg(p,.2,.35),waves:seg(p,.2,.35)});
  s+=fade(seg(p,.6,.75),label('スリット',YG.dx,32,{size:26,color:C.hi,anchor:'middle',weight:700})+arrow(YG.dx-60,YG.s1-30,YG.dx-10,YG.s1-6,{color:C.hi,w:3,head:10})+arrow(YG.dx-60,YG.s2+30,YG.dx-10,YG.s2+6,{color:C.hi,w:3,head:10}));
  return s;
 },
 [K+'coh']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=young(t,{});
  s+=fade(seg(p,.1,.25),dot(YG.dx,YG.s1,10,W1)+dot(YG.dx,YG.s2,10,W2)+label('同時に 届く',YG.dx+20,YG.cy+8,{size:26,color:C.ink,weight:700}));
  s+=card(760,40,320,90,label('同位相の 波源',920,98,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'spread']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=young(t,{wLab:seg(p,.3,.45)});
  s+=fade(seg(p,.05,.2),label('重なる',800,257,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fringe']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=young(t,{fr:seg(p,.05,.3),wLab:1,lines:seg(p,.55,.7)});
  s+=fade(seg(p,.55,.7),label('明：強め合い',1080,500,{size:24,color:STR,anchor:'end',weight:700}));
  return s;
 },
 [K+'evidence']:(p)=>{
  let s=card(80,40,480,440,'',seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.05,.2),label('粒の 流れ なら',320,95,{size:30,color:C.ink,anchor:'middle',weight:700})+rect(290,130,60,320,{fill:'#1a2438',fo:1,stroke:C.dim,rx:4})+rect(290,240,60,18,{fill:'#fff3b0',fo:.9,stroke:'none',rx:2})+rect(290,322,60,18,{fill:'#fff3b0',fo:.9,stroke:'none',rx:2})+label('明るい 線 2本',320,475,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(640,40,480,440,'',seg(p,.35,.5),C.hi);
  s+=fade(seg(p,.35,.5),label('実際（ヤング）',880,95,{size:30,color:C.hi,anchor:'middle',weight:700})+rect(850,130,60,320,{fill:'#1a2438',fo:1,stroke:C.dim,rx:4})+fringes({x:850,w:60,y0:130,y1:450,fr:40,cy:290})+label('縞',880,475,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('→ 光は 波',960,475,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'center']:(p)=>{
  let s=geo({sym:0,P:0});
  s+=fade(seg(p,.05,.2),line(GE.x,GE.s1,GE.scr,GE.cy,{color:W1,w:3.5})+line(GE.x,GE.s2,GE.scr,GE.cy,{color:W2,w:3.5}));
  s+=fade(seg(p,.05,.2),fringes({x:GE.scr+8,w:50,y0:30,y1:490,fr:150,cy:GE.cy}));
  s+=card(420,40,520,120,label('同じ 距離 → 経路差 0',680,95,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 明るい',680,140,{size:30,color:STR,anchor:'middle',weight:700}),seg(p,.35,.5),STR);
  return s;
 },
 // ================= S4 経路差を図形から =================
 [K+'sym']:(p)=>{
  let s=geo({sym:seg(p,.1,.3),P:seg(p,.05,.15)});
  return s;
 },
 [K+'scale']:(p)=>{
  let s=geo({});
  s+=card(380,40,600,150,label('実際：d ＝ 0.50 mm、L ＝ 1.0 m',680,100,{size:30,color:C.ink,anchor:'middle',weight:700})+label('L は d の 2000倍',680,155,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.05,.2),label('d を 大きく 描いています',200,505,{size:22,color:C.dim}));
  return s;
 },
 [K+'lines']:(p)=>{
  let s=geo({th1:seg(p,.55,.7)});
  s+=fade(seg(p,.15,.3),label('ほぼ 平行',640,170,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zoom']:(p)=>{
  let s=zoom({ext:seg(p,.45,.6)});
  s+=card(760,30,400,90,label('スリットの そばを 拡大',960,88,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  return s;
 },
 [K+'tri']:(p)=>{
  let s=zoom({ext:1,tri:seg(p,.05,.2),hyp:seg(p,.05,.2),perp:seg(p,.35,.5),angR:seg(p,.4,.55),angA:seg(p,.65,.8)});
  s+=card(760,30,400,90,label('斜辺 d、角 θ',960,88,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'dsin']:(p)=>{
  let s=zoom({ext:1,tri:1,hyp:1,perp:1,angA:1});
  s+=card(700,30,460,120,T2(`\\text{}\\approx d\\sin${th}`,930,95,{size:48,auto:false}),seg(p,.1,.25),LC);
  s+=fade(seg(p,.1,.25),label('経路差',740,100,{size:30,color:LC,weight:700}));
  s+=card(700,180,460,90,label('≈：ほぼ 等しい',930,238,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.6,.75),C.dim);
  s+=tag('L ≫ d の 仮定',930,330,{color:C.dim,g:seg(p,.6,.75)});
  return s;
 },
 [K+'tan']:(p)=>{
  let s=geo({big:seg(p,.05,.2),th1:1});
  s+=card(400,320,440,110,T2(`\\tan${th}=\\dfrac{${yv}}{L}`,620,380,{size:46,auto:false}),seg(p,.5,.65),STR);
  return s;
 },
 [K+'approx']:(p)=>{
  let s=card(200,60,800,150,T2(`\\sin${th}\\ \\approx\\ \\tan${th}`,600,150,{size:56,auto:false}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.05,.2),label('角が 小さい とき',600,260,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('→ 数で 確かめる',600,330,{size:30,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'table']:(p)=>{
  const cols=[{h:'角 θ',color:ANG,w:260},{h:'sin θ',color:C.ink,w:260},{h:'tan θ',color:C.ink,w:260}];
  const rows=[['5°','0.0872','0.0875'],['1°','0.01745','0.01746'],['約 0.07°','0.00120','0.00120']];
  let s=table({x:210,y:50,cols,rows,reveal:[seg(p,.05,.2),seg(p,.3,.42),seg(p,.5,.65)],rh:76,size:34,hl:p>.6?[2]:[]});
  s+=fade(seg(p,.7,.82),label('縞の できる 角では 差が 見えない',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pd']:(p)=>{
  let s=card(140,40,920,130,T2(`\\text{}\\approx d\\sin${th}`,640,110,{size:48,auto:false})+label('経路差',200,118,{size:32,color:LC,weight:700}),1,LC);
  s+=card(140,210,920,140,T2(`\\approx d\\times\\dfrac{${yv}}{L}=\\dfrac{d${yv}}{L}`,640,285,{size:50,auto:false})+label('経路差',200,293,{size:32,color:LC,weight:700}),seg(p,.15,.3),LC);
  s+=fade(seg(p,.05,.15),label('sin θ → y/L に 置き換え',600,200,{size:24,color:C.dim,anchor:'middle'}));
  s+=tag('近似：＝ ではなく ≈',600,430,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 // ================= S5 縞の間隔 =================
 [K+'bright']:(p)=>{
  let s=card(160,40,880,110,label('明るい：経路差 ＝ mλ',600,108,{size:34,color:STR,anchor:'middle',weight:700}),seg(p,.05,.2),STR);
  s+=card(160,210,880,150,T2(`\\dfrac{d${yv}}{L}=m${Lt}`,600,290,{size:58,auto:false}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'solve']:(p)=>{
  const c=seg(p,.05,.25);
  let s=card(140,15,920,165,T2(`\\dfrac{d${yv}}{L}${c>.5?'\\times\\dfrac{L}{d}':''}=m${Lt}${c>.5?'\\times\\dfrac{L}{d}':''}`,600,105,{size:48,auto:false}),1,C.dim);
  s+=fade(seg(p,.05,.25),label('両辺に L/d を 掛ける',600,200,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(240,240,720,140,T2(`${yv}=\\dfrac{m${Lt}L}{d}`,600,315,{size:58,auto:false}),seg(p,.35,.5),C.hi);
  s+=fade(seg(p,.7,.85),label('m 番目の 明るい 縞の 位置',600,440,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'list']:(p)=>{
  const sc={x:600,cy:300,fr:120};let s=fade(1,rect(sc.x-40,40,80,470,{fill:'#1a2438',fo:1,stroke:C.dim,rx:4}))+fringes({x:sc.x-40,w:80,y0:42,y1:508,fr:sc.fr,cy:sc.cy});
  const labs=['0',`\\dfrac{${Lt}L}{d}`,`\\dfrac{2${Lt}L}{d}`];
  labs.forEach((L,i)=>{const y=sc.cy-i*sc.fr,g=seg(p,.1+i*.2,.25+i*.2);s+=fade(g,line(sc.x+44,y,sc.x+110,y,{color:STR,w:3})+T2(`${yv}=${L}`,sc.x+120,y+8,{size:38,anchor:'start',auto:false})+label(`m ＝ ${i}`,sc.x-60,y+10,{size:28,color:C.ink,anchor:'end',weight:700}));});
  s+=fade(seg(p,.8,.92),label('同じ 幅ずつ 増える',1150,500,{size:26,color:C.hi,anchor:'end',weight:700}));
  return s;
 },
 [K+'diff']:(p)=>{
  let s=card(80,60,1040,150,T2(`\\dfrac{(m+1)${Lt}L}{d}-\\dfrac{m${Lt}L}{d}`,600,145,{size:52,auto:false}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.05,.2),label('隣どうしの 差：(m＋1)番目 − m番目',600,280,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cancel']:(p)=>{
  const c=seg(p,.05,.2);const can=`{\\color{#ff8f9b}\\cancel{\\color{${C.ink}}\\dfrac{m${Lt}L}{d}}}`;
  let s=card(80,30,1040,150,T2(c>.5?`${can}+\\dfrac{${Lt}L}{d}-${can}`:`\\dfrac{(m+1)${Lt}L}{d}-\\dfrac{m${Lt}L}{d}`,600,115,{size:48,auto:false}),1,C.hi);
  s+=card(250,220,700,150,T2(`\\Delta ${yv}=\\dfrac{${Lt}L}{d}`,600,305,{size:60,auto:false}),seg(p,.3,.45),STR);
  s+=fade(seg(p,.65,.8),label('m に よらない → 等間隔',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  if(c>.5&&c<1)s+='';
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(80,20,1040,90,label('λ ＝ 600 nm、L ＝ 1.0 m、d ＝ 0.50 mm',600,78,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(80,140,1040,150,T2(`\\Delta ${yv}=\\dfrac{600\\times10^{-9}\\times 1.0}{0.50\\times10^{-3}}`,600,225,{size:48,auto:false}),seg(p,.3,.45),LC);
  s+=card(80,320,1040,130,T2(`=1.2\\times10^{-3}${Ms}=1.2${MMs}`,600,395,{size:50,auto:false}),seg(p,.6,.75),STR);
  return s;
 },
 [K+'check']:(p)=>{
  let s=card(80,30,1040,150,T2(`\\dfrac{d${yv}}{L}=\\dfrac{0.50\\times10^{-3}\\times1.2\\times10^{-3}}{1.0}`,600,115,{size:46,auto:false}),seg(p,.05,.2),LC);
  s+=card(80,220,1040,120,T2(`=6.0\\times10^{-7}${Ms}=600${NMs}`,600,290,{size:50,auto:false}),seg(p,.4,.55),LC);
  s+=tag('ちょうど 1波長 → 明るい',600,420,{color:STR,g:seg(p,.7,.85),size:28});
  return s;
 },
 [K+'magnify']:(p)=>{
  let s=card(120,30,960,120,T2(`\\dfrac{L}{d}=\\dfrac{1.0${Ms}}{0.50${MMs}}=2000`,600,95,{size:46,auto:false}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.35,.5),label('経路差 600 nm',300,290,{size:32,color:LC,anchor:'middle',weight:700})+rect(296,320,8,20,{fill:LC,fo:1,stroke:'none',rx:1}));
  s+=arrow(430,320,760,320,{color:C.hi,w:5,head:18,g:seg(p,.45,.6)})+fade(seg(p,.45,.6),label('× 2000',595,300,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('縞の 間隔 1.2 mm',920,290,{size:32,color:STR,anchor:'middle',weight:700})+fringes({x:880,w:80,y0:310,y1:500,fr:60,cy:400}));
  return s;
 },
 [K+'predans']:(p)=>{
  let s=card(80,30,500,460,'',1,C.dim)+card(620,30,500,460,'',seg(p,.3,.45),C.hi);
  s+=label('d ＝ 0.50 mm',330,90,{size:30,color:C.ink,anchor:'middle',weight:700})+rect(290,120,80,300,{fill:'#1a2438',fo:1,stroke:C.dim,rx:4})+fringes({x:290,w:80,y0:122,y1:418,fr:60,cy:270})+label('Δy ＝ 1.2 mm',330,465,{size:28,color:LC,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.45),label('d ＝ 1.0 mm（2倍）',870,90,{size:30,color:C.hi,anchor:'middle',weight:700})+rect(830,120,80,300,{fill:'#1a2438',fo:1,stroke:C.dim,rx:4})+fringes({x:830,w:80,y0:122,y1:418,fr:30,cy:270})+label('Δy ＝ 0.60 mm',870,465,{size:28,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の分野 =================
 [K+'ans']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=young(t,{fr:1});
  s+=card(500,30,560,140,label('① 細い スリットの 回折で 広げる',780,85,{size:26,color:C.hi,anchor:'middle',weight:700})+label('② 経路差を L/d 倍に 引き伸ばす',780,135,{size:26,color:LC,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=card(80,40,500,430,'',seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.05,.2),label('屈折',330,95,{size:34,color:C.ink,anchor:'middle',weight:700})+rect(100,270,460,180,{fill:'#4a90d9',fo:.22,stroke:'none',rx:0})+line(100,270,560,270,{color:'#8fc3ff',w:2})+arrow(180,130,330,270,{color:LIGHT,w:5,head:16})+arrow(330,270,400,430,{color:LIGHT,w:5,head:16})+label('速さが 変わって 曲がる',330,500,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(620,40,500,430,'',seg(p,.4,.55),C.hi);
  s+=fade(seg(p,.4,.55),label('回折',870,95,{size:34,color:C.hi,anchor:'middle',weight:700}))+slitWaves({x0:640,x1:1100,y0:120,y1:450,wx:760,cy:285,w:30,lam:34,t:sceneT(p,null)*0,g:seg(p,.4,.55)})+fade(seg(p,.4,.55),label('隙間で 広がる',870,500,{size:24,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'univ']:(p)=>{
  return card(160,110,880,230,label('大学編では',600,175,{size:28,color:C.dim,anchor:'middle'})+label('光 ＝ 電場と 磁場の 波',600,245,{size:40,color:C.hi,anchor:'middle',weight:700})+label('マクスウェル方程式 から 導く',600,305,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
 },
 [K+'field']:(p)=>{
  let s=card(160,140,380,160,label('波',350,240,{size:50,color:C.dim,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=arrow(560,220,640,220,{color:C.hi,w:6,head:20,g:seg(p,.4,.55)});
  s+=card(660,140,380,160,label('電磁気',850,240,{size:50,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'last']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  const pts=[];for(let x=80;x<=520;x+=5)pts.push([x,150-28*Math.sin(2*PI*((x-80)/150-t/1.6))]);
  s+=fade(seg(p,.02,.15),draw(pts,1,{color:'#7fb6ff',w:4})+label('波：水や 空気が 揺れて 伝わる',300,240,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),rect(620,110,520,80,{fill:'#b87333',fo:.35,stroke:'#d89a5a',sw:3,rx:40})+label('電線',880,90,{size:26,color:'#d89a5a',anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),[0,1,2,3].map(i=>label('？',670+((i*110+t*40)%440),165,{size:36,color:C.hi,anchor:'middle',weight:700})).join(''));
  s+=card(150,300,900,170,label('何が 動いている？',600,365,{size:36,color:C.hi,anchor:'middle',weight:700})+label('何が それを 押している？',600,430,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
};
