// 高校編「放物運動・深く学ぶ 2/3」(ys-hs-m-projectile-2) — 図。Stage 1200×515.
// 斜方投射：v₀＝25 m/s、cosθ＝0.8、sinθ＝0.6 → vₓ＝20、vᵧ＝15 m/s。上向き正、g＝10。
// x＝20t、y＝15t−5t²（0,10,10,0 m at 0..3 s、最高点 1.5 s で 11.25 m）、vᵧ＝15−10t。
// 色：位置 水色、速度 紫（横の成分 濃い紫、縦の成分 薄い紫）、g 赤、t 金、θ 橙、強調 黄。
import {C,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,ground} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {Gt,Yt,ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {VXC,VYC,T1,cliff,cliffPath,CL} from './yt1-hs-m-projectile-1-diagrams.mjs';

const K='hs-m-projectile-2:';
export const VX=`{\\color{${VXC}}v_x}`, VY=`{\\color{${VYC}}v_y}`, V0=`{\\color{${C.v}}v_0}`, BV0=`{\\color{${C.v}}\\boldsymbol{v}_0}`,
 TH=`{\\color{${C.E}}\\theta}`, Xt=`{\\color{${C.x}}x}`, Tt=`{\\color{${C.t}}t}`;
const TF=(src,x,y,o={})=>tex(src,x,y,{size:46,auto:false,...o});
export const yS=t=>15*t-5*t*t, vyS=t=>15-10*t;

// ---- slanted throw scene: ground at y0, 1 m = k px ---------------------------------------------
export const SL={x0:130,y0:420,k:10,s:3};
export function slant({x0=SL.x0,y0=SL.y0,k=SL.k,s=SL.s,ts=[0,1,2,3],g=1,path=1,va=0,vxa=1,vya=1,vl=0,tl=1,hl=-1,ghost=1,ballAt=null,top=0}={}){
 const X=t=>x0+k*20*t,Y=t=>y0-16-k*yS(t);
 let st=fade(g,ground(x0-60,X(3)+80,y0));
 if(path)st+=draw(Array.from({length:61},(_,i)=>{const t=3*i/60;return [X(t),Y(t)];}),path,{color:C.hi,w:2.5,dash:'7 8'});
 if(top)st+=fade(g*top,line(X(1.5)-120,Y(1.5),X(1.5)+120,Y(1.5),{color:C.faint,w:2,dash:'6 8'})+label('最高点',X(1.5),Y(1.5)-60,{size:24,color:C.hi,anchor:'middle',weight:700}));
 ts.forEach((t,j)=>{
  const a=typeof ghost==='number'?ghost:ghost(j),x=X(t),y=Y(t),vy=vyS(t);
  st+=fade(g*a,ball(x,y));
  if(t===hl)st+=fade(g,ring(x,y,26,{color:C.hi,w:3}));
  if(tl)st+=fade(g*tl*a,va?label(`${t} s`,x-14,y+40,{size:22,color:C.t,anchor:'end'}):label(`${t} s`,x,y+48,{size:22,color:C.t,anchor:'middle'}));
  if(va){
   st+=arrow(x,y,x+s*20,y,{color:VXC,w:4,head:12,g:g*va*vxa*a});
   if(Math.abs(vy)>1e-9)st+=arrow(x,y,x,y-s*vy,{color:VYC,w:4,head:12,g:g*va*vya*a});
   if(vl){st+=fade(g*vl*vxa*a,label('20',x+s*20+8,y+8,{size:22,color:VXC,weight:700}));
    if(Math.abs(vy)>1e-9)st+=fade(g*vl*vya*a,(vy>0?label(String(vy),x-10,y-s*vy-6,{size:22,color:VYC,anchor:'end',weight:700}):label(String(vy).replace('-','−'),x+14,y-s*vy+22,{size:22,color:VYC,weight:700})));
    else st+=fade(g*vl*vya*a,label('0',x-30,y-22,{size:22,color:VYC,anchor:'end',weight:700}));}
  }
 });
 if(ballAt!==null)st+=ball(X(ballAt),Y(ballAt));
 return st;
}

// ---- the velocity triangle: origin (ox,oy), 1 m/s = sc px ----------------------------------------
export function vtri({ox=200,oy=400,sc=14,g=1,v0=1,vx=0,vy=0,ang=0,lab=0,num=0,side=0,hyp=0,box=0}={}){
 const X=ox+20*sc,Y=oy-15*sc;
 let s='';
 if(box)s+=fade(g*box,line(ox,oy,X,oy,{color:C.faint,w:2,dash:'4 6'})+line(X,oy,X,Y,{color:C.faint,w:2,dash:'4 6'})+rect(X-18,oy-18,18,18,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:0}));
 s+=arrow(ox,oy,X,Y,{color:C.v,w:6,head:18,g:g*v0});
 s+=arrow(ox,oy,X,oy,{color:VXC,w:5,head:16,g:g*vx});
 s+=arrow(X,oy,X,Y,{color:VYC,w:5,head:16,g:g*vy});
 if(ang){const r=70,a1=Math.atan2(15,20);const pts=Array.from({length:21},(_,i)=>{const a=-a1*i/20;return [ox+r*Math.cos(a),oy+r*Math.sin(a)];});
  s+=fade(g*ang,draw(pts,1,{color:C.E,w:3})+tex('\\theta',ox+r+22,oy-14,{size:34,color:C.E,auto:false}));}
 if(lab){
  s+=fade(g*lab*v0,tex(num?'25':BV0,(ox+X)/2-30,(oy+Y)/2-26,{size:40,auto:false,color:C.v}));
  s+=fade(g*lab*vx,tex(num?'20':VX,(ox+X)/2,oy+44,{size:40,auto:false,color:VXC}));
  s+=fade(g*lab*vy,tex(num?'15':VY,X+40,(oy+Y)/2+10,{size:40,auto:false,color:VYC}));
 }
 if(side){
  s+=fade(g*side,label('横の辺',(ox+X)/2,oy+90,{size:24,color:C.dim,anchor:'middle'})+label('縦の辺',X+44,(oy+Y)/2+50,{size:24,color:C.dim})+label('斜辺',(ox+X)/2+30,(oy+Y)/2+40,{size:24,color:C.dim}));
 }
 if(hyp)s+=fade(g*hyp,line(ox,oy,X,Y,{color:C.hi,w:10,opacity:.35}));
 return s;
}
const TRI={ox:150,oy:400,sc:14};
const frac=(x,y,top,bot,color)=>label(top,x,y-14,{size:28,color,anchor:'middle',weight:700})+line(x-60,y,x+60,y,{color:C.ink,w:2})+label(bot,x,y+34,{size:28,color:C.ink,anchor:'middle'});

export const hsProjectile2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  const u=seg(p,.1,.85);
  let s=slant({ts:[],path:u,ballAt:3*u});
  s+=fade(seg(p,.02,.15),arrow(SL.x0,SL.y0-16,SL.x0+80,SL.y0-76,{color:C.v,w:5,head:14})+label('斜め上に 投げる',60,260,{size:26,color:C.v}));
  s+=card(760,100,400,150,label('横と 縦に',960,155,{size:28,color:C.ink,anchor:'middle'})+label('どう 分ける？',960,215,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=rect(60,126,140,170,{fill:'#4a5570',fo:.85,stroke:'none',rx:4})+ground(200,520,296);
  s+=arrow(216,110,296,110,{color:VXC,w:5,head:14})+label('v₀',256,90,{size:26,color:VXC,anchor:'middle',weight:700})+ball(200,110);
  s+=fade(seg(p,.05,.2),label('水平投射：縦は 0 から',290,350,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),slant({x0:680,y0:420,ts:[0],tl:0,va:1,path:.4}));
  s+=fade(seg(p,.55,.7),label('斜め：はじめから 横にも 縦にも',860,240,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:seg(p,.3,.5),vy:seg(p,.45,.65),box:1});
  s+=card(680,120,460,230,label('斜めの 初速度',910,180,{size:28,color:C.ink,anchor:'middle'})+label('横 ＋ 縦 に 分ける',910,245,{size:36,color:C.hi,anchor:'middle',weight:700})+label('道具：三角比',910,305,{size:28,color:C.E,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'cond']:(p)=>{
  let s=card(150,60,900,170,label('仮定',600,110,{size:26,color:C.dim,anchor:'middle'})+label('空気抵抗なし',600,180,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(250,270,700,190,label('計算を 見やすく するため',600,330,{size:28,color:C.ink,anchor:'middle'})+tex(Gt+'=10\\ \\mathrm{m/s^2}',600,410,{size:54,auto:false}),seg(p,.4,.55),C.a);
  return s;
 },
 // ================= S2 速度の矢印を分ける =================
 [K+'arrow']:(p)=>{
  let s=ball(TRI.ox,TRI.oy)+vtri({...TRI,v0:seg(p,.05,.3),lab:seg(p,.6,.75)});
  s+=card(680,110,460,230,label('向き ＝ 投げる 向き',910,175,{size:28,color:C.ink,anchor:'middle'})+label('長さ ＝ 速さ',910,235,{size:28,color:C.ink,anchor:'middle'})+label('太字で',880,312,{size:28,color:C.ink,anchor:'end'})+tex(BV0,930,300,{size:44,auto:false}),seg(p,.3,.45),C.v);
  return s;
 },
 [K+'split']:(p)=>{
  let s=vtri({...TRI,v0:1,lab:1,vx:seg(p,.1,.3),vy:seg(p,.3,.5),box:seg(p,.05,.2)});
  s+=card(680,140,460,180,label('横向き ＋ 縦向き',910,205,{size:30,color:C.ink,anchor:'middle',weight:700})+label('つなぐと 元の 矢印',910,265,{size:28,color:C.hi,anchor:'middle'}),seg(p,.6,.75));
  return s;
 },
 [K+'comp']:(p)=>{
  let s=vtri({...TRI,v0:.5,vx:1,vy:1,lab:1,box:1});
  s+=card(680,100,460,250,label('速度の 成分（定義）',910,160,{size:28,color:C.dim,anchor:'middle'})+tex(VX,760,222,{size:40,auto:false})+label('：横向きの 長さ',800,232,{size:30,color:C.ink})+tex(VY,760,292,{size:40,auto:false})+label('：縦向きの 長さ',800,302,{size:30,color:C.ink}),seg(p,.1,.3),C.v);
  return s;
 },
 [K+'tri']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:1,vy:1,lab:1,box:1,side:seg(p,.1,.3),hyp:seg(p,.35,.5)});
  s+=card(680,120,460,200,label('直角三角形',910,180,{size:32,color:C.ink,anchor:'middle',weight:700})+label('斜辺 ＝',900,262,{size:32,color:C.ink,anchor:'end'})+tex(V0,945,252,{size:42,auto:false}),seg(p,.4,.55));
  return s;
 },
 [K+'angle']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:.4,vy:.4,lab:1,box:1,ang:seg(p,.2,.45)});
  s+=fade(seg(p,.05,.2),line(TRI.ox-40,TRI.oy,TRI.ox+340,TRI.oy,{color:C.dim,w:2,dash:'8 6'})+label('水平',TRI.ox+350,TRI.oy+8,{size:24,color:C.dim}));
  s+=card(680,140,460,180,label('投げる 角度',910,200,{size:28,color:C.dim,anchor:'middle'})+label('初速度 と 水平 の 間',910,265,{size:30,color:C.E,anchor:'middle',weight:700}),seg(p,.5,.65),C.E);
  return s;
 },
 // ================= S3 sin と cos =================
 [K+'def']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:1,vy:1,box:1,ang:1,side:1});
  s+=card(640,70,520,170,label('定義（数学）',900,115,{size:24,color:C.dim,anchor:'middle'})+tex('\\cos'+TH+'=',830,190,{size:42,auto:false})+frac(950,190,'横の辺','斜辺',VXC),seg(p,.2,.35),VXC);
  s+=card(640,270,520,170,tex('\\sin'+TH+'=',830,355,{size:42,auto:false})+frac(950,355,'縦の辺','斜辺',VYC),seg(p,.5,.65),VYC);
  return s;
 },
 [K+'cosmul']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:1,vy:.4,box:1,ang:1,lab:1});
  s+=TF('\\cos'+TH+'=\\dfrac{'+VX+'}{'+V0+'}',900,110,{size:44});
  s+=fade(seg(p,.3,.45),label('両辺に v₀ を 掛ける',900,215,{size:26,color:C.hi,anchor:'middle'}));
  s+=card(680,260,440,130,TF(VX+'='+V0+'\\cos'+TH,900,330,{size:48}),seg(p,.55,.7),VXC);
  return s;
 },
 [K+'sinmul']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:.4,vy:1,box:1,ang:1,lab:1});
  s+=TF('\\sin'+TH+'=\\dfrac{'+VY+'}{'+V0+'}',900,110,{size:44});
  s+=fade(seg(p,.2,.35),label('両辺に v₀ を 掛ける',900,215,{size:26,color:C.hi,anchor:'middle'}));
  s+=card(680,260,440,130,TF(VY+'='+V0+'\\sin'+TH,900,330,{size:48}),seg(p,.45,.6),VYC);
  return s;
 },
 [K+'which']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:1,vy:1,box:1,ang:1});
  const X=TRI.ox+20*TRI.sc,Y=TRI.oy-15*TRI.sc;
  s+=fade(seg(p,.4,.55),line(TRI.ox,TRI.oy,X,TRI.oy,{color:VXC,w:12,opacity:.45})+label('θ に 接する 辺 → cos',(TRI.ox+X)/2,TRI.oy+50,{size:26,color:VXC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),line(X,TRI.oy,X,Y,{color:VYC,w:12,opacity:.45})+label('向かいの 辺',X+24,(TRI.oy+Y)/2,{size:26,color:VYC,weight:700})+label('→ sin',X+24,(TRI.oy+Y)/2+34,{size:26,color:VYC,weight:700}));
  s+=card(720,330,420,110,label('どの角が θ か、毎回 確かめる',930,395,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'num']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:.4,vy:.4,box:1,ang:1,lab:1,num:1});
  s+=card(680,90,460,270,label('例',910,140,{size:26,color:C.dim,anchor:'middle'})+tex(V0+'=25\\ \\mathrm{m/s}',910,200,{size:40,auto:false})+tex('\\cos'+TH+'=0.8',910,265,{size:40,auto:false})+tex('\\sin'+TH+'=0.6',910,325,{size:40,auto:false}),seg(p,.1,.3),C.v);
  return s;
 },
 [K+'calc']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:1,vy:1,box:1,ang:1,lab:1,num:1});
  s+=card(680,100,460,130,TF(VX+'=25\\times 0.8=20',910,170,{size:42}),seg(p,.05,.2),VXC);
  s+=card(680,270,460,130,TF(VY+'=25\\times 0.6=15',910,340,{size:42}),seg(p,.45,.6),VYC);
  return s;
 },
 [K+'pyth']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:1,vy:1,box:1,lab:1,num:1});
  s+=card(680,90,460,130,label('15 ： 20 ： 25 ＝ 3 ： 4 ： 5',910,165,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(680,260,460,170,label('三平方の 定理',910,305,{size:24,color:C.dim,anchor:'middle'})+TF('15^2+20^2=25^2',910,360,{size:40})+label('225 ＋ 400 ＝ 625',910,410,{size:24,color:C.dim,anchor:'middle'}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'deg']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:1,vy:1,box:1,ang:1,lab:1,num:1});
  s+=card(680,150,460,150,tex(TH+'\\approx 37^\\circ',910,240,{size:56,auto:false}),seg(p,.1,.3),C.E);
  return s;
 },
 // ================= S4 横は等速、縦は投げ上げ =================
 [K+'after']:(p)=>{
  let s=slant({va:1,ghost:j=>seg(p,.05+j*.15,.15+j*.15)});
  s+=card(780,110,380,170,label('横の 成分',970,165,{size:28,color:VXC,anchor:'middle',weight:700})+label('縦の 成分',970,220,{size:28,color:VYC,anchor:'middle',weight:700})+label('別々に 変わる',970,265,{size:24,color:C.dim,anchor:'middle'}),seg(p,.6,.75));
  return s;
 },
 [K+'xeq']:(p)=>{
  let s=slant({va:1,vya:0,vl:seg(p,.1,.25),vxa:1});
  s+=card(780,90,380,150,label('横：力なし → 等速',970,140,{size:26,color:C.dim,anchor:'middle'})+label('vₓ ＝ 20 のまま',970,200,{size:30,color:VXC,anchor:'middle',weight:700}),seg(p,.05,.2),VXC);
  s+=card(780,270,380,110,TF(Xt+'=20'+Tt,970,335,{size:46}),seg(p,.55,.7),C.x);
  return s;
 },
 [K+'up']:(p)=>{
  let s=slant({va:1,vxa:.25});
  s+=arrow(1100,420,1100,300,{color:C.x,w:4,head:14,g:seg(p,.35,.5)})+fade(seg(p,.4,.55),label('正',1080,330,{size:30,color:C.x,anchor:'end',weight:700})+label('上向き',1080,370,{size:24,color:C.dim,anchor:'end'}));
  s+=card(780,90,380,150,label('縦',970,140,{size:26,color:C.dim,anchor:'middle'})+label('投げ上げ と 同じ',970,200,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'vy']:(p)=>{
  let s=TF(VY+'='+V0+'\\sin'+TH+'-'+Gt+Tt,600,110,{size:52});
  s+=fade(seg(p,.25,.4),label('v₀ sinθ ＝ 15、g ＝ 10',600,200,{size:28,color:C.hi,anchor:'middle'}));
  s+=card(380,250,440,130,TF(VY+'=15-10'+Tt,600,320,{size:54}),seg(p,.45,.6),VYC);
  return s;
 },
 [K+'yeq']:(p)=>{
  let s=TF(Yt+'=v_0'+Tt+'-\\tfrac12'+Gt+Tt+'^2',600,80,{size:44});
  s+=label('投げ上げの 式（上向きが 正）',600,150,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.35,.5),label('初めの 速度 15、加速度 −10',600,215,{size:28,color:C.hi,anchor:'middle'}));
  s+=card(380,260,440,130,TF(Yt+'=15'+Tt+'-5'+Tt+'^2',600,330,{size:54}),seg(p,.05,.2),C.x);
  return s;
 },
 [K+'warn']:(p)=>{
  let s=card(110,90,460,250,label('水平投射',340,145,{size:28,color:C.dim,anchor:'middle'})+label('下向きが 正',340,200,{size:30,color:C.ink,anchor:'middle',weight:700})+TF(Yt+'=\\tfrac12'+Gt+Tt+'^2',340,280,{size:46}),seg(p,.02,.2));
  s+=card(630,90,460,250,label('斜めに 投げる',860,145,{size:28,color:C.dim,anchor:'middle'})+label('上向きが 正',860,200,{size:30,color:C.ink,anchor:'middle',weight:700})+TF(Yt+'=15'+Tt+'-5'+Tt+'^2',860,280,{size:46}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.6,.75),label('2つの 式を 混ぜない',600,410,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 最高点 =================
 [K+'table']:(p)=>{
  let s=slant({va:1,vxa:.25,vl:1,vya:1,ghost:j=>seg(p,.05+j*.18,.15+j*.18)});
  const xs=[830,900,970,1040];
  s+=card(760,100,400,170,label('t [s]',770,150,{size:22,color:C.t})+label('vᵧ',770,220,{size:24,color:VYC,weight:700}),1);
  ['15','5','−5','−15'].forEach((v,i)=>{s+=fade(seg(p,.05+i*.18,.15+i*.18),label(String(i),xs[i]+30,150,{size:26,color:C.t,anchor:'middle',weight:700})+label(v,xs[i]+30,220,{size:28,color:VYC,anchor:'middle',weight:700}));});
  return s;
 },
 [K+'arrows']:(p)=>{
  let s=slant({va:1,vl:1});
  s+=card(780,110,380,190,label('横の 成分',970,165,{size:26,color:C.dim,anchor:'middle'})+label('いつも 20',970,215,{size:32,color:VXC,anchor:'middle',weight:700})+label('縦の 成分 だけ 変わる',970,270,{size:26,color:VYC,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'guess']:(p)=>{
  let s=fade(.4,slant({ts:[],top:1}));
  s+=card(300,130,600,200,label('最高点で',600,195,{size:30,color:C.ink,anchor:'middle'})+label('速度は 0 になる？',600,265,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'top']:(p)=>{
  let s=slant({ts:[0,1,1.5,2,3],tl:1,top:1,ghost:j=>j===2?1:.4});
  s+=card(780,90,380,130,label('最高点：vᵧ ＝ 0',970,170,{size:30,color:VYC,anchor:'middle',weight:700}),seg(p,.05,.2),VYC);
  s+=card(780,250,380,160,TF('15-10'+Tt+'=0',970,310,{size:42})+TF(Tt+'=1.5\\ \\mathrm{s}',970,375,{size:42}),seg(p,.35,.5),C.t);
  return s;
 },
 [K+'notzero']:(p)=>{
  let s=slant({ts:[1.5],tl:1,top:1,va:1,vl:1,hl:1.5});
  s+=fade(.35,slant({ts:[0,1,2,3],path:0,tl:0}));
  s+=card(780,110,380,200,label('横の 20 m/s は 残る',970,175,{size:28,color:VXC,anchor:'middle',weight:700})+label('→ 速度は 0 ではない',970,250,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'accel']:(p)=>{
  let s=slant({ts:[0,1,1.5,2,3],tl:0,top:1});
  const X=t=>SL.x0+SL.k*20*t,Y=t=>SL.y0-16-SL.k*yS(t);
  [0,1,1.5,2,3].forEach((t,i)=>{s+=arrow(X(t)+22,Y(t)-10,X(t)+22,Y(t)+40,{color:C.a,w:4,head:12,g:seg(p,.05+i*.06,.2+i*.06)});});
  s+=card(780,90,380,130,label('加速度',970,140,{size:26,color:C.dim,anchor:'middle'})+label('ずっと 下向きに g',970,195,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.3,.45),C.a);
  s+=card(780,250,380,130,label('0 になるのは',970,300,{size:26,color:C.dim,anchor:'middle'})+label('縦の 速度 だけ',970,355,{size:30,color:VYC,anchor:'middle',weight:700}),seg(p,.6,.75),VYC);
  return s;
 },
 [K+'height']:(p)=>{
  let s=TF(Yt+'=15'+Tt+'-5'+Tt+'^2',600,80,{size:48});
  s+=fade(seg(p,.1,.25),label('t ＝ 1.5 を 入れる',900,90,{size:26,color:C.hi}));
  s+=fade(seg(p,.3,.45),TF('15\\times 1.5-5\\times 1.5^2',600,190,{size:46}));
  s+=fade(seg(p,.5,.6),TF('=22.5-11.25',600,270,{size:46}));
  s+=card(400,320,400,120,TF('=11.25\\ \\mathrm{m}',600,385,{size:50,color:C.x}),seg(p,.65,.8),C.x);
  return s;
 },
 [K+'land']:(p)=>{
  let s=slant({ts:[0,1.5,3],tl:1,top:1});
  const X=t=>SL.x0+SL.k*20*t;
  s+=fade(seg(p,.2,.35),rect(X(0),SL.y0+50,X(1.5)-X(0),30,{fill:C.v,fo:.3,stroke:C.v,rx:6})+label('上り 1.5 s',(X(0)+X(1.5))/2,SL.y0+72,{size:22,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),rect(X(1.5),SL.y0+50,X(3)-X(1.5),30,{fill:'#7f8fd8',fo:.3,stroke:'#7f8fd8',rx:6})+label('下り 1.5 s',(X(1.5)+X(3))/2,SL.y0+72,{size:22,color:C.ink,anchor:'middle',weight:700}));
  s+=card(780,140,380,150,label('同じ 高さに 戻る',970,195,{size:28,color:C.dim,anchor:'middle'})+label('3 s 後（2倍）',970,255,{size:34,color:C.t,anchor:'middle',weight:700}),seg(p,.6,.75),C.t);
  return s;
 },
 [K+'range']:(p)=>{
  let s=slant({ts:[0,3],tl:1,top:.5});
  const X=t=>SL.x0+SL.k*20*t,y=SL.y0+40;
  s+=fade(seg(p,.2,.4),line(X(0),y,X(3),y,{color:C.x,w:3})+line(X(0),y-10,X(0),y+10,{color:C.x,w:3})+line(X(3),y-10,X(3),y+10,{color:C.x,w:3})+label('60 m',(X(0)+X(3))/2,y+34,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=card(780,120,380,170,TF(Xt+'=20\\times 3',970,180,{size:44})+TF('=60\\ \\mathrm{m}',970,245,{size:44,color:C.x}),seg(p,.05,.2),C.x);
  s+=fade(seg(p,.6,.75),label('飛距離',970,340,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=slant({ts:[3],tl:1});
  s+=card(790,90,370,300,label('確かめ：t ＝ 3',975,140,{size:26,color:C.dim,anchor:'middle'})+TF(Xt+'=20\\times 3=60',975,205,{size:36})+TF(Yt+'=15\\times 3-5\\times 3^2',975,275,{size:36})+TF('=45-45=0',975,340,{size:36}),seg(p,.05,.2),C.x);
  s+=fade(seg(p,.7,.85),label('地面の 高さ',975,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=vtri({...TRI,v0:1,vx:1,vy:1,box:1,ang:1,lab:1});
  s+=card(680,100,460,130,TF(VX+'='+V0+'\\cos'+TH,910,170,{size:48}),seg(p,.3,.45),VXC);
  s+=card(680,270,460,130,TF(VY+'='+V0+'\\sin'+TH,910,340,{size:48}),seg(p,.5,.65),VYC);
  return s;
 },
 [K+'known']:(p)=>{
  let s=card(110,110,460,200,label('横',340,165,{size:28,color:C.dim,anchor:'middle'})+label('等速',340,245,{size:44,color:VXC,anchor:'middle',weight:700}),seg(p,.05,.2),VXC);
  s+=card(630,110,460,200,label('縦',860,165,{size:28,color:C.dim,anchor:'middle'})+label('投げ上げ',860,245,{size:44,color:VYC,anchor:'middle',weight:700}),seg(p,.25,.4),VYC);
  s+=fade(seg(p,.55,.7),label('どちらも 知っている 運動',600,400,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis']:(p)=>{
  let s=slant({ts:[1.5],tl:1,top:1,va:1,vl:1,hl:1.5});
  s+=card(780,110,380,200,label('最高点で 0 なのは',970,175,{size:28,color:C.dim,anchor:'middle'})+label('縦の 成分 だけ',970,245,{size:34,color:VYC,anchor:'middle',weight:700}),seg(p,.05,.2),VYC);
  return s;
 },
 [K+'next']:(p)=>{
  let s=slant({ts:[],path:seg(p,.05,.5)});
  s+=card(760,110,400,170,label('この 通り道は',960,170,{size:28,color:C.ink,anchor:'middle'})+label('本当に 放物線？',960,235,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=slant({ts:[],path:1});
  const X0=SL.x0,Y0=SL.y0-16;
  [[0.6,0.8,'#a9b6f0'],[Math.SQRT1_2,Math.SQRT1_2,C.dim]].forEach(([c,sn,col],i)=>{
   const pts=Array.from({length:61},(_,j)=>{const T=2*25*sn/10,t=T*j/60;return [X0+SL.k*25*c*t,Y0-SL.k*(25*sn*t-5*t*t)];});
   s+=draw(pts,seg(p,.1+i*.25,.4+i*.25),{color:col,w:2.5,dash:'5 7'});});
  s+=card(760,110,400,170,label('どの 角度で 投げると',960,170,{size:28,color:C.ink,anchor:'middle'})+label('いちばん 遠く？',960,235,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('t を 消して、通り道と 飛距離',600,255,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('放物運動・深く学ぶ 3/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
