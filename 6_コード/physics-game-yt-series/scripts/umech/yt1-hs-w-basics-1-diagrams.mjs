// 高校編「波の基本・深く学ぶ 1/2」(ys-hs-w-basics-1) — 図。Stage 1200×515.
// 色（構成表の案）：場所 x・波長 λ 水色（長さ）、時刻 t・周期 T 金、振動数 f 桃（ω の仲間）、波の速さ v 紫、
// 振幅 A とずれは白、エネルギー 橙、印（媒質の1点）黄、山の目印 紫（波の模様の動き）。
// 2/2・要点でも使う部品は export する（カード・タグ・T2 は力学・熱の部品を読み込む）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,axes,brace,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,molBox} from './yt1-hs-t-heat-1-diagrams.mjs';
export {card,tag,T2,sceneT};

const K='hs-w-basics-1:';
const PI=Math.PI;
export const LC=C.x, TCOL=C.t, FC=C.p, VCOL=C.v, EC=C.E, ROPE='#d6deec', MK=C.hi, WATER='#4a90d9';
export const Lt=`{\\color{${LC}}\\lambda}`, Tt=`{\\color{${TCOL}}T}`, ft=`{\\color{${FC}}f}`;
export const HZ='\\ \\mathrm{Hz}', MS='\\ \\mathrm{m/s}', MM='\\ \\mathrm{m}', SS='\\ \\mathrm{s}';
// time (s) since the cue with diagram key `key` started (same scene); falls back to the scene clock
export function tSince(p,ctx,key){
 if(!ctx||!ctx.scene||!ctx.scene.captions)return p*8;
 const i=ctx.scene.cues.findIndex(c=>c.diagram===key),caps=ctx.scene.captions;
 if(i<0)return sceneT(p,ctx);
 return ctx.t+(caps[ctx.k]?.start||0)-(caps[i]?.start||0);
}
// ---- the rope ----------------------------------------------------------------------------------
// o: x0..x1 pixels, centre line y, amplitude A px, wavelength lam px, display period T s.
// displacement (px, up +) at pixel x, time t. Left end moves as A sin(2πt/T) (starts upward).
// front=true: the wave has only reached x0 + v t.
export const RP={x0:110,x1:1090,y:280,A:60,lam:320,T:1.6};
export function disp(x,t,o=RP,front=false){const d=x-o.x0,v=o.lam/o.T;if(front&&(d>v*t||t<0))return 0;return o.A*Math.sin(2*PI*(t/o.T-d/o.lam));}
export function rope({t=0,o=RP,front=false,g=1,color=ROPE,w=5,center=1}={}){
 let s='';
 if(center)s+=fade(g*.7,line(o.x0,o.y,o.x1,o.y,{color:C.faint,w:2,dash:'6 8'}));
 const pts=[];for(let x=o.x0;x<=o.x1+.1;x+=5)pts.push([x,o.y-disp(x,t,o,front)]);
 return s+fade(g,draw(pts,1,{color,w}));
}
export function hand(t,o=RP,front=false,g=1){const y=o.y-disp(o.x0,t,o,front);return fade(g,rect(o.x0-50,y-24,44,48,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:14})+rect(o.x0-10,y-8,14,16,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:4}));}
export function mark(xp,t,o=RP,front=false,{g=1,track=0,color=MK,r=11}={}){
 const y=o.y-disp(xp,t,o,front);let s='';
 if(track)s+=fade(g*track,line(xp,o.y-o.A-26,xp,o.y+o.A+26,{color,w:2,dash:'5 6'}));
 return s+fade(g,dot(xp,y,r,color)+ring(xp,y,r,{color:C.bg,w:2}));
}
export function crestsAt(t,o=RP,front=false){const out=[],v=o.lam/o.T;for(let n=-40;n<40;n++){const d=o.lam*(t/o.T-.25-n);if(d>=-1&&d<=o.x1-o.x0+1&&(!front||d<=v*t+1))out.push(o.x0+d);}return out;}
export function crestMark(x,o=RP,{g=1,text='山',color=VCOL}={}){
 const y=o.y-o.A-20;
 return fade(g,poly([[x-14,y-22],[x+14,y-22],[x,y-2]],{fill:color,fo:1})+(text?label(text,x,y-32,{size:24,color,anchor:'middle',weight:700}):''));
}
// a crest tracked from the moment tStart: the first crest at or right of x0+from
export function trackedCrest(t,tStart,o=RP,{from=40}={}){
 const v=o.lam/o.T;const c0=crestsAt(tStart,o).filter(x=>x>=o.x0+from).sort((a,b)=>a-b)[0]??o.x0+from;
 let x=c0+v*(t-tStart);while(x>o.x1)x-=o.lam;return x;
}
// ---- a row of beads (the medium as separate pieces) ------------------------------------------
export function beads(t,o=RP,{n=29,front=false,g=1,hl=[],r=9,links=1}={}){
 let s='';const xs=Array.from({length:n},(_,i)=>o.x0+(o.x1-o.x0)*i/(n-1)),ys=xs.map(x=>o.y-disp(x,t,o,front));
 if(links)for(let i=1;i<n;i++)s+=line(xs[i-1],ys[i-1],xs[i],ys[i],{color:C.faint,w:2});
 xs.forEach((x,i)=>{const h=hl.includes(i);s+=dot(x,ys[i],h?r+3:r,h?MK:'#a9d8ff');});
 return fade(g,s);
}
// ---- the sea with a floating ball --------------------------------------------------------------
export function sea(t,{y=300,A=34,lam=380,T=2.2,g=1,ball=1,bx=600,drift=0,track=0}={}){
 const o={x0:60,x1:1140,y,A,lam,T};const pts=[];for(let x=60;x<=1140;x+=6)pts.push([x,y-disp(x,t,o)]);
 let s=fade(g,poly([...pts,[1140,515],[60,515]],{fill:WATER,fo:.28})+draw(pts,1,{color:'#7fb6ff',w:4}));
 if(ball){const X=bx+drift,by=y-disp(X,t,o)-20;
  if(track)s+=fade(g*track,line(X,y-A-60,X,y+A+10,{color:MK,w:2,dash:'5 6'}));
  s+=fade(g,dot(X,by,22,'#ff9a7a')+ring(X,by,22,{color:C.bg,w:2})+line(X-10,by-8,X+6,by-14,{color:'#ffd0c0',w:3}));}
 s+=fade(g,label('岸',70,y-90,{size:26,color:C.dim})+label('沖 →',1130,y-90,{size:26,color:C.dim,anchor:'end'}));
 return s;
}
// ---- stadium wave: a row of spectators; a pulse of standing people runs to the right ----------
export function stadium(t,{g=1,hl=8,n=22,x0=130,x1=1070,y=400,speed=230}={}){
 const L=x1-x0+360,c=x0-180+((t*speed)%L+L)%L;let s=fade(g,line(x0-40,y,x1+40,y,{color:C.dim,w:3}));
 for(let i=0;i<n;i++){const x=x0+(x1-x0)*i/(n-1),h=Math.exp(-(((x-c)/75)**2)),H=46+74*h,col=i===hl?MK:'#8fa3c4';
  s+=fade(g,rect(x-15,y-H,30,H,{fill:col,fo:.55,stroke:col,sw:2,rx:8})+dot(x,y-H-16,14,col));}
 return s;
}
const ROW={x:150,w:900};
// ---- photo / clock panels ----------------------------------------------------------------------
const PH={x:70,y:440,w:440,h:300}, CK={x:700,y:440,w:440,h:300};
const phAxes=g=>axes({...PH,xmin:0,xmax:2.5,ymin:-1.3,ymax:1.3,xlabel:'',ylabel:'',g});
const ckAxes=g=>axes({...CK,xmin:0,xmax:2.5,ymin:-1.3,ymax:1.3,xlabel:'',ylabel:'',g});
const shape=u=>Math.cos(2*PI*(u-.3)); // photo: crests at x＝0.3, 1.3, 2.3
const XP=1.0, ck=u=>shape(XP-u); // the marked point x＝1.0 seen on the clock (right-moving wave): crests at t＝0.7, 1.7
function photo({g=1,draw:dp=1,lam=0,lam2=0,pt=1,dim=0}={}){
 const A=phAxes(g);let s=A.svg+fade(g,label('場所 x',PH.x+PH.w+20,A.Y(0)+40,{size:24,color:LC,anchor:'end',weight:700})+label('ずれ',PH.x,PH.y-PH.h-38,{size:24,color:C.ink,anchor:'middle'}));
 s+=fade(g,label('写真：時刻を 止める',PH.x+PH.w/2,48,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g*(1-dim*.6),A.plot(shape,{from:0,to:2.45,p:dp,color:ROPE,w:4}));
 if(pt)s+=fade(g*pt,dot(A.X(XP),A.Y(shape(XP)),10,MK));
 if(lam){const y=A.Y(1.3)+4;s+=fade(lam,line(A.X(.3),A.Y(1),A.X(.3),y,{color:LC,w:2,dash:'4 5'})+line(A.X(1.3),A.Y(1),A.X(1.3),y,{color:LC,w:2,dash:'4 5'}))+arrow(A.X(.3),y,A.X(1.3),y,{color:LC,w:3,head:12,g:lam})+arrow(A.X(1.3),y,A.X(.3),y,{color:LC,w:3,head:12,g:lam})+fade(lam,tex('\\lambda',A.X(.8),y-18,{size:34,color:LC}));}
 if(lam2){const y=A.Y(-1.3)-4;s+=fade(lam2,line(A.X(.8),A.Y(-1),A.X(.8),y,{color:LC,w:2,dash:'4 5'})+line(A.X(1.8),A.Y(-1),A.X(1.8),y,{color:LC,w:2,dash:'4 5'}))+arrow(A.X(.8),y,A.X(1.8),y,{color:LC,w:3,head:12,g:lam2})+arrow(A.X(1.8),y,A.X(.8),y,{color:LC,w:3,head:12,g:lam2})+fade(lam2,tex('\\lambda',A.X(1.3),y+30,{size:34,color:LC}));}
 return s;
}
function clock({g=1,u=1,per=0,bob=1}={}){
 const A=ckAxes(g);let s=A.svg+fade(g,label('時刻 t',CK.x+CK.w+20,A.Y(0)+40,{size:24,color:TCOL,anchor:'end',weight:700})+label('ずれ',CK.x,CK.y-CK.h-38,{size:24,color:C.ink,anchor:'middle'}));
 s+=fade(g,label('時計：1か所で 見る',CK.x+CK.w/2,48,{size:26,color:C.ink,anchor:'middle',weight:700}));
 const T=2.3*u;s+=A.plot(ck,{from:0,to:Math.max(.001,T),color:MK,w:4,steps:Math.max(2,Math.round(160*u))});
 if(bob&&u>0)s+=fade(g,dot(A.X(T),A.Y(ck(T)),10,MK));
 if(per){const y=A.Y(1.3)+4;s+=fade(per,line(A.X(.7),A.Y(1),A.X(.7),y,{color:TCOL,w:2,dash:'4 5'})+line(A.X(1.7),A.Y(1),A.X(1.7),y,{color:TCOL,w:2,dash:'4 5'}))+arrow(A.X(.7),y,A.X(1.7),y,{color:TCOL,w:3,head:12,g:per})+arrow(A.X(1.7),y,A.X(.7),y,{color:TCOL,w:3,head:12,g:per})+fade(per,tex('T',A.X(1.2),y-18,{size:34,color:TCOL,auto:false}));}
 return s;
}
// ---- 1 second split into 0.20 s pieces ---------------------------------------------------------
const TL={x:120,y:330,w:900,h:150};
function timeline({g=1,n=1,count=0,hl1=1}={}){
 const A=axes({x:TL.x,y:TL.y+TL.h/2+10,w:TL.w,h:TL.h+20,xmin:0,xmax:1.05,ymin:-1,ymax:1,xticks:[],g});
 let s0=fade(g,[.4,.6,.8,1].map(u=>line(A.X(u),A.Y(0)-6,A.X(u),A.Y(0)+6,{color:C.dim})+label(u===1?'1.0':String(u),A.X(u),A.Y(-1)+34,{size:22,color:C.dim,anchor:'middle'})).join('')+line(A.X(.2),A.Y(0)-6,A.X(.2),A.Y(0)+6,{color:C.dim}));
 let s=A.svg+s0+fade(g,label('t [s]',TL.x+TL.w+50,A.Y(0)+8,{size:24,color:TCOL,weight:700}));
 const f=u=>Math.sin(2*PI*u/.2);
 for(let i=0;i<5;i++){const o=clamp(n-i);if(o<=0)continue;s+=A.plot(f,{from:i*.2,to:i*.2+.2*o,color:i===0&&hl1?MK:ROPE,w:4,steps:40});
  if(count>i)s+=fade(clamp(count-i),label(String(i+1),A.X(i*.2+.1),A.Y(1)-22,{size:30,color:FC,anchor:'middle',weight:700}));}
 if(hl1)s+=fade(g*hl1,brace(A.X(0),A.X(.2),A.Y(-1)+8,{dir:1,color:TCOL,text:'0.20 s',size:24}));
 return s;
}
const fCard=(x,y,g=1)=>card(x,y,330,130,T2(`${ft}=\\dfrac{1}{${Tt}}`,x+165,y+80,{size:50}),g,FC);
const legend=(g=1)=>fade(g,dot(880,60,10,MK)+label('印（媒質の 1点）',900,68,{size:24,color:MK,weight:700})+poly([[868,92],[892,92],[880,110]],{fill:VCOL,fo:1})+label('山の 位置',900,108,{size:24,color:VCOL,weight:700}));

export const hsWBasics1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:150,y:90,w:380,h:300,n:18,dist:t*220,speed:30,seed:3,color:'#ff9a7a',g:seg(p,0,.15)});
  s+=fade(seg(p,.2,.35),label('熱：分子は ばらばらな 向き',340,450,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('そろって 揺れたら？',880,250,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:300};
  let s=beads(t,o,{g:seg(p,0,.2)});
  s+=card(250,40,700,120,label('進んで いくのは 何？',600,118,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'ball']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sea(t,{track:seg(p,.55,.7)});
  s+=fade(seg(p,.6,.75),label('上下するだけ',680,120,{size:30,color:MK,weight:700}));
  return s;
 },
 [K+'pred']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.5,sea(t,{track:1}));
  s+=card(300,40,600,130,label('水も 沖へ 進んで いる？',600,122,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 // ================= S2 1つの点を見続ける =================
 [K+'rope']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'rope');
  let s=rope({t,front:true})+hand(t,RP,true);
  s+=fade(seg(p,.05,.15),label('ロープ',RP.x1-60,RP.y+60,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.1,.2),label('手で 上下に 振る',RP.x0-20,RP.y+130,{size:24,color:C.dim}));
  s+=fade(seg(p,.55,.7),arrow(700,110,880,110,{color:VCOL,w:5,head:16})+label('右へ 進む',790,90,{size:26,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mark']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'rope');
  let s=rope({t,front:true})+hand(t,RP,true);
  s+=mark(590,t,RP,true,{g:seg(p,.1,.25)});
  s+=fade(seg(p,.15,.3),label('印',590,RP.y+RP.A+60,{size:28,color:MK,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mk2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'rope');
  let s=rope({t,front:true})+hand(t,RP,true)+mark(590,t,RP,true,{track:seg(p,.1,.3)});
  s+=fade(seg(p,.2,.35),arrow(640,RP.y-30,640,RP.y-80,{color:MK,w:4,head:14})+arrow(640,RP.y+30,640,RP.y+80,{color:MK,w:4,head:14})+label('上下に 往復',660,RP.y-90,{size:26,color:MK,weight:700}));
  s+=fade(seg(p,.6,.75),label('右へは 進まない',590,RP.y+RP.A+80,{size:28,color:MK,anchor:'middle',weight:700}));
  return s;
 },
 [K+'crest']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'rope'),t0=t-(ctx?ctx.t:p*8);
  let s=rope({t,front:true})+hand(t,RP,true)+mark(590,t,RP,true,{track:1});
  const x=trackedCrest(t,t0,RP,{from:30});
  s+=crestMark(x,RP,{g:seg(p,.1,.25)});
  return s;
 },
 [K+'cmp']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'rope'),t0=t-(ctx?ctx.t:p*8);
  let s=rope({t,front:true})+hand(t,RP,true)+mark(590,t,RP,true,{track:1});
  s+=crestMark(trackedCrest(t,t0,RP,{from:30}),RP);
  s+=legend(seg(p,.05,.2));
  s+=card(150,410,420,90,label('印：上下',360,467,{size:32,color:MK,anchor:'middle',weight:700}),seg(p,.15,.3),MK);
  s+=card(630,410,420,90,label('山：右へ',840,467,{size:32,color:VCOL,anchor:'middle',weight:700}),seg(p,.4,.55),VCOL);
  return s;
 },
 [K+'far']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'far')-.4;
  let s=rope({t,front:true})+hand(t,RP,true)+mark(980,t,RP,true,{g:seg(p,0,.1)});
  const reach=(980-RP.x0)/(RP.lam/RP.T),on=clamp((t-reach)/.4);
  s+=fade(seg(p,.05,.2)*(1-on),label('まだ 静か',980,RP.y+70,{size:26,color:MK,anchor:'middle',weight:700}));
  s+=fade(on,label('揺れ始めた',980,RP.y+RP.A+60,{size:26,color:MK,anchor:'middle',weight:700}));
  return s;
 },
 [K+'energy']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'far')-.4;
  let s=rope({t,front:true})+hand(t,RP,true)+mark(980,t,RP,true);
  s+=fade(seg(p,.1,.25),label('揺れの エネルギー',600,90,{size:30,color:EC,anchor:'middle',weight:700}));
  s+=arrow(160,130,1040,130,{color:EC,w:7,head:22,g:seg(p,.3,.75)});
  s+=fade(seg(p,.35,.5),label('手',RP.x0-28,RP.y+90,{size:26,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 振動のリレー =================
 [K+'def']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=rope({t,o:{...RP,y:330}})+hand(t,{...RP,y:330});
  s+=card(200,40,800,150,label('波',600,98,{size:40,color:C.hi,anchor:'middle',weight:700})+label('ある場所の 振動が 隣へ 伝わる 現象',600,158,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  s+=tag('定義',1060,70,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'med']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:330};
  let s=rope({t,o})+hand(t,o)+mark(590,t,o,false,{track:seg(p,.55,.7)});
  s+=card(200,40,800,150,label('媒質',600,104,{size:40,color:MK,anchor:'middle',weight:700})+label('波を 伝える 物質（ここでは ロープ）',600,160,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.2),MK);
  s+=fade(seg(p,.6,.75),label('その場で 揺れる',700,o.y+o.A+70,{size:26,color:MK,weight:700}));
  return s;
 },
 [K+'relay']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:300,T:2.4};
  let s=beads(t,o,{hl:[9,10,11]});
  s+=fade(seg(p,.2,.35),label('隣に 引っ張られる',600,110,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('少し 遅れて 同じ 動き',600,470,{size:30,color:MK,anchor:'middle',weight:700}));
  return s;
 },
 [K+'stad']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=stadium(t,{g:seg(p,0,.15)});
  s+=fade(seg(p,.35,.5),label('観客は 立ち座り だけ',600,90,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('ウェーブは 右へ 回る →',600,140,{size:30,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'stad2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.6,stadium(t,{y:470}));
  const rows=[['観客','媒質',C.dim],['立ち座り','振動',MK],['ウェーブの 位置','波',VCOL]];
  rows.forEach(([a,b,c],i)=>{const o=seg(p,.05+i*.25,.2+i*.25),y=90+i*72;s+=fade(o,label(a,520,y,{size:30,color:c,anchor:'end',weight:700})+label('→',600,y,{size:30,color:C.dim,anchor:'middle'})+label(b,680,y,{size:30,color:c,weight:700}));});
  return s;
 },
 [K+'stad3']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.35,stadium(t,{y:470}));
  s+=card(80,60,480,170,label('観客',320,115,{size:30,color:C.dim,anchor:'middle',weight:700})+label('合図を 見て 動く',320,180,{size:30,color:C.ink,anchor:'middle'}),seg(p,.1,.25),C.dim);
  s+=card(640,60,480,170,label('ロープ',880,115,{size:30,color:MK,anchor:'middle',weight:700})+label('隣に 引っ張られて 動く',880,180,{size:30,color:C.ink,anchor:'middle'}),seg(p,.5,.65),MK);
  s+=fade(seg(p,.3,.45),label('違う 点',600,290,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'assume']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:330,A:36};
  let s=rope({t,o})+hand(t,o);
  s+=card(200,40,800,150,label('揺れの 小さい 波',600,100,{size:34,color:C.ink,anchor:'middle',weight:700})+label('媒質に 正味の 流れが ない',600,158,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.dim);
  s+=tag('仮定',1060,70,{color:C.dim,g:seg(p,.5,.65)});
  return s;
 },
 [K+'real']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sea(t,{y:320,drift:22*seg(p,.15,.9),track:0});
  s+=fade(seg(p,.2,.35),arrow(590,420,640,420,{color:WATER,w:5,head:14})+label('わずかに 流される',660,428,{size:24,color:'#7fb6ff',weight:700}));
  s+=fade(seg(p,.55,.7),arrow(300,120,900,120,{color:VCOL,w:6,head:20})+label('波の 速さ',600,100,{size:26,color:VCOL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('ずっと 遅い',660,470,{size:24,color:'#7fb6ff',weight:700}));
  return s;
 },
 // ================= S4 波を測る量 =================
 [K+'amp']:(p)=>{
  const o={...RP,y:290,A:90,x1:970};let s=rope({t:.75*o.T,o});
  const xc=o.x0+o.lam*.5;
  s+=fade(seg(p,.15,.3),label('中心の 線',o.x1+12,o.y+8,{size:24,color:C.dim}));
  s+=arrow(xc,o.y,xc,o.y-o.A,{color:C.ink,w:4,head:14,g:seg(p,.45,.6)})+arrow(xc,o.y-o.A,xc,o.y,{color:C.ink,w:4,head:14,g:seg(p,.45,.6)});
  s+=fade(seg(p,.5,.65),label('振幅 A',xc,o.y-o.A-24,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'amp2']:(p)=>{
  const o={...RP,y:290,A:90,x1:970};let s=rope({t:.75*o.T,o});
  const xc=o.x0+o.lam*.5,xt=xc+o.lam/2;
  s+=arrow(xc,o.y,xc,o.y-o.A,{color:C.ink,w:4,head:14})+arrow(xc,o.y-o.A,xc,o.y,{color:C.ink,w:4,head:14})+label('A',xc,o.y-o.A-24,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),line(xc+20,o.y-o.A,1050,o.y-o.A,{color:C.a,w:2,dash:'5 6'})+line(xt+20,o.y+o.A,1050,o.y+o.A,{color:C.a,w:2,dash:'5 6'}));
  s+=arrow(1030,o.y-o.A,1030,o.y+o.A,{color:C.a,w:4,head:14,g:seg(p,.1,.3)})+arrow(1030,o.y+o.A,1030,o.y-o.A,{color:C.a,w:4,head:14,g:seg(p,.1,.3)});
  s+=fade(seg(p,.25,.4),label('2A',1050,o.y+10,{size:30,color:C.a,weight:700}));
  s+=card(800,60,340,100,label('振幅 ＝ その 半分',970,122,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.55,.7),C.ink);
  return s;
 },
 [K+'photo']:(p,ctx)=>{
  const t=sceneT(p,ctx),fr=seg(p,.45,.5);
  const o={x0:70,x1:510,y:290,A:100,lam:176,T:1.6};
  let s='';
  if(p<.5)s+=rope({t,o,center:0});
  s+=fade(fr*(1-seg(p,.5,.6))*.8,rect(60,90,470,390,{fill:'#ffffff',fo:.35,stroke:'none',rx:10}));
  s+=fade(seg(p,.5,.6),photo({pt:0}));
  s+=fade(seg(p,.1,.25)*(1-seg(p,.45,.5)),label('時刻を 止めて 撮る',600,70,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lam']:(p)=>{
  let s=photo({pt:0,lam:seg(p,.45,.65)});
  s+=fade(seg(p,.1,.25),label('横軸 ＝ 場所',PH.x+PH.w/2,PH.y+50,{size:26,color:LC,anchor:'middle',weight:700}));
  s+=card(700,150,420,150,label('波長 λ',910,205,{size:36,color:LC,anchor:'middle',weight:700})+label('山から 次の 山まで',910,265,{size:28,color:C.ink,anchor:'middle'}),seg(p,.6,.75),LC);
  return s;
 },
 [K+'lam2']:(p)=>{
  let s=photo({pt:0,lam:1,lam2:seg(p,.1,.35)});
  s+=card(700,150,420,150,label('谷から 次の 谷 でも 同じ',910,215,{size:28,color:C.ink,anchor:'middle',weight:700})+label('単位：m',910,270,{size:28,color:LC,anchor:'middle',weight:700}),seg(p,.3,.45),LC);
  return s;
 },
 [K+'clock']:(p)=>{
  let s=fade(.45,photo({pt:1,lam:1}));
  s+=fade(seg(p,.05,.2),label('この 点',PH.x+PH.w*XP/2.5+18,PH.y-PH.h*((shape(XP)+1.3)/2.6)+30,{size:24,color:MK,weight:700}));
  s+=clock({g:seg(p,.1,.25),u:lin(p,.3,.95)});
  return s;
 },
 [K+'per']:(p)=>{
  let s=fade(.45,photo({pt:1,lam:1}));
  s+=clock({u:1,per:seg(p,.3,.5)});
  s+=fade(seg(p,.55,.7),label('周期 T：山から 次の 山 まで',CK.x+CK.w/2,CK.y+50,{size:26,color:TCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'per2']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,x0:150,x1:560,y:280,A:90,lam:240,T:1.6};
  let s=fade(.5,clock({u:1,per:1}));
  s+=rope({t,o,center:1})+mark(150+120,t,o,false,{track:1});
  s+=fade(seg(p,.2,.35),label('1回 振動する 時間 ＝ T',360,450,{size:28,color:TCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'diff']:(p)=>{
  let s=photo({pt:1,lam:1})+clock({u:1,per:1});
  s+=fade(seg(p,.05,.2),rect(PH.x+PH.w-82,PH.y-PH.h/2+10,110,46,{fill:LC,fo:.12,stroke:LC,rx:10}));
  s+=fade(seg(p,.25,.4),rect(CK.x+CK.w-82,CK.y-CK.h/2+10,110,46,{fill:TCOL,fo:.12,stroke:TCOL,rx:10}));
  s+=fade(seg(p,.55,.7),label('横軸が 違う',600,500,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'diffq']:(p)=>{
  let s=photo({pt:0,lam:0});
  s+=card(680,150,460,170,label('写真 1枚で 測れるのは？',910,215,{size:30,color:C.ink,anchor:'middle',weight:700})+label('λ　か　T　か',910,280,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'diffa']:(p)=>{
  let s=photo({pt:0,lam:1});
  s+=card(680,120,460,120,label('答え：λ',910,195,{size:38,color:LC,anchor:'middle',weight:700}),1,LC);
  s+=card(680,280,460,120,label('T は 時間の 流れが 必要',910,352,{size:28,color:TCOL,anchor:'middle',weight:700}),seg(p,.4,.55),TCOL);
  return s;
 },
 // ================= S5 振動数 =================
 [K+'fdef']:(p)=>{
  let s=card(240,60,720,170,label('振動数 f',600,125,{size:40,color:FC,anchor:'middle',weight:700})+label('1秒 あたりに 振動する 回数',600,190,{size:32,color:C.ink,anchor:'middle'}),seg(p,.05,.2),FC);
  s+=card(390,300,420,110,label('単位：Hz（ヘルツ）',600,368,{size:34,color:FC,anchor:'middle',weight:700}),seg(p,.55,.7),FC);
  return s;
 },
 [K+'fq']:(p)=>{
  let s=timeline({n:1,count:0,g:seg(p,0,.2)});
  s+=card(330,40,540,110,label('1秒には 何回？',600,112,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'fa']:(p)=>{
  const u=lin(p,.05,.6);
  let s=timeline({n:1+4*u,count:5*u+.5*(u>.99)});
  s+=card(170,40,860,110,T2(`1\\div 0.20=5.0\\quad\\Rightarrow\\quad ${ft}=5.0${HZ}`,600,100,{size:42}),seg(p,.62,.75),FC);
  return s;
 },
 [K+'fpt']:(p)=>{
  const tau=lin(p,.1,.85),o={...RP,y:300},xm=600;
  // a crest reaches the mark at tau = 0.10, 0.30, …, 0.90 s → 5 crests by 1.00 s (0.20 s each)
  const dsp=x=>o.A*Math.sin(2*PI*((tau-.1)/.2+.25-(x-xm)/o.lam));
  const pts=[];for(let x=o.x0;x<=o.x1;x+=5)pts.push([x,o.y-dsp(x)]);
  let s=fade(.7,line(o.x0,o.y,o.x1,o.y,{color:C.faint,w:2,dash:'6 8'}))+draw(pts,1,{color:ROPE,w:5});
  s+=dot(xm,o.y-dsp(xm),11,MK)+line(xm,o.y-o.A-26,xm,o.y+o.A+26,{color:MK,w:2,dash:'5 6'});
  const cnt=tau<.1?0:Math.min(5,Math.floor((tau-.1)/.2+1e-9)+1);
  s+=card(80,40,360,110,label(`時間 ${tau.toFixed(2)} s`,260,108,{size:34,color:TCOL,anchor:'middle',weight:700}),1,TCOL);
  s+=card(760,40,360,110,label(`山が 通過：${cnt} 個`,940,108,{size:34,color:FC,anchor:'middle',weight:700}),1,FC);
  s+=fade(seg(p,.05,.15),label('（ゆっくり 見せて います）',600,480,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'fgen']:(p)=>{
  let s=card(150,60,900,120,label('1回に T 秒 → 1秒には 1 ÷ T 回',600,135,{size:38,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),TCOL);
  s+=fCard(435,250,seg(p,.5,.65));
  s+=tag('導いた 結果',600,440,{color:C.hi,g:seg(p,.7,.82)});
  return s;
 },
 [K+'finv']:(p)=>{
  let s=fCard(80,60,1);
  s+=card(480,60,640,130,T2(`${Tt}=\\dfrac{1}{${ft}}`,800,140,{size:50}),seg(p,.05,.2),TCOL);
  s+=card(300,270,600,130,T2(`${Tt}=\\dfrac{1}{5.0}=0.20${SS}`,600,350,{size:46}),seg(p,.45,.6),TCOL);
  return s;
 },
 [K+'f2']:(p)=>{
  let s=fCard(80,60,1);
  s+=card(300,270,600,130,T2(`${ft}=\\dfrac{1}{0.10}=10${HZ}`,600,350,{size:46}),seg(p,.05,.2),FC);
  return s;
 },
 [K+'funit']:(p)=>{
  let s=card(120,80,440,200,label('Hz',340,160,{size:48,color:FC,anchor:'middle',weight:700})+label('1秒 あたり 何回',340,235,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.2),FC);
  s+=card(640,80,440,200,label('m/s',860,160,{size:48,color:VCOL,anchor:'middle',weight:700})+label('1秒 あたり 何 m（速さ）',860,235,{size:30,color:C.ink,anchor:'middle'}),seg(p,.5,.65),VCOL);
  s+=fade(seg(p,.6,.75),label('≠',600,200,{size:54,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:330},t0=t-(ctx?ctx.t:p*8);
  let s=rope({t,o})+hand(t,o)+mark(590,t,o,false,{track:1})+crestMark(trackedCrest(t,t0,o,{from:30}),o);
  s+=card(150,30,900,120,label('進むのは 振動の 模様 と エネルギー',600,104,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sea(t,{track:1});
  s+=card(300,40,600,110,label('ボールは その場で 上下',600,110,{size:36,color:MK,anchor:'middle',weight:700}),seg(p,.3,.45),MK);
  return s;
 },
 [K+'sum']:(p)=>{
  const rows=[['振幅 A','揺れの 大きさ','（m）',C.ink],['波長 λ','場所の 1回分','（m）',LC],['周期 T','時間の 1回分','（s）',TCOL],['振動数 f','1秒 あたりの 回数','（Hz）',FC]];
  let s=card(170,40,860,440,'',1,C.dim);
  rows.forEach(([a,b,u,c],i)=>{const y=125+i*95;s+=fade(seg(p,.05+i*.18,.18+i*.18),label(a,320,y,{size:34,color:c,anchor:'middle',weight:700})+label(b,640,y,{size:32,color:C.ink,anchor:'middle'})+label(u,900,y,{size:28,color:c,anchor:'middle'}));});
  return s;
 },
 [K+'mis']:(p)=>{
  const o={...RP,y:330,A:80};let s=fade(.45,rope({t:.4*o.T,o}));
  s+=card(80,40,500,150,label('× 水も 一緒に 進む',330,105,{size:30,color:C.a,anchor:'middle',weight:700})+label('進むのは 模様',330,160,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.a);
  s+=card(620,40,500,150,label('× 振幅 ＝ 山から 谷まで',870,105,{size:30,color:C.a,anchor:'middle',weight:700})+label('それは 2A',870,160,{size:28,color:C.ink,anchor:'middle'}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:340},t0=t-(ctx?ctx.t:p*8);
  let s=rope({t,o})+hand(t,o)+crestMark(trackedCrest(t,t0,o,{from:30}),o);
  s+=card(170,30,860,130,label('1回 振動する あいだに、山は どれだけ 進む？',600,110,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.55,.7),label('→ 波の 速さ は？',600,480,{size:30,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('1周期で 波は どれだけ 進む？',600,265,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('波の基本・深く学ぶ 2/2 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
