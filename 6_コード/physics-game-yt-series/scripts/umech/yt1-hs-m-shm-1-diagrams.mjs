// 高校編「単振動・深く学ぶ 1/3」(ys-hs-m-shm-1) — 図。Stage 1200×515.
// 水平なばね（壁は左、自然長の位置 x＝0、右が正）。k＝100 N/m、m＝1.0 kg、振幅 A＝0.10 m、ω＝10 rad/s。
// 色：位置 x 水色、力 F 緑（太い矢印）、速度 v 紫、加速度 a 赤、エネルギー 橙（K 濃い・U 薄い）、強調 黄。
// 2/3・3/3・要点でも使う部品は export する（diagrams.mjs は object だけを読み込む）。
import {C,seg,fade,label,line,rect,ring,draw,arrow,tex,ground,wall,spring,axes} from './anim.mjs';
import {card,table,tag,FA,VA,KC,UC,Kt,Ut,T2} from './yt1-hs-m-energy-1-diagrams.mjs';
export {card,table,tag,FA,VA,KC,UC,Kt,Ut,T2};

const K='hs-m-shm-1:';
const PI=Math.PI;
// ---- big horizontal spring -----------------------------------------------------------------------
// x in metres (A＝0.10 m ↔ 200 px). F arrow (green) above the block, v arrow (purple) above that.
export const SB={wall:170,X0:640,y:250,px:2000,bw:90,bh:80,fpx:13,vpx:150};
export const sbX=(x,o=SB)=>o.X0+x*o.px;
export function springBig({o=SB,x=0,g=1,axis=1,F=null,Fg=0,Ftext=null,v=0,Vg=0,Vtext='',hand=0,center=1,floorTo=1100,ghost=null,mass=''}={}){
 const bx=sbX(x,o),top=o.y-o.bh/2,bot=o.y+o.bh/2;
 let s=fade(g,wall(o.wall,o.y-90,bot)+ground(o.wall,floorTo,bot));
 if(center)s+=fade(g*.8,line(o.X0,o.y-70,o.X0,bot,{color:C.faint,w:2,dash:'6 6'}));
 if(ghost!==null)s+=fade(g*.35,rect(sbX(ghost,o)-o.bw/2,top,o.bw,o.bh,{fill:'#c9a46a',fo:.3,stroke:'#c9a46a',rx:8}));
 s+=fade(g,spring(o.wall,bx-o.bw/2,o.y,{coils:10,amp:16,color:C.dim,w:3}));
 s+=fade(g,rect(bx-o.bw/2,top,o.bw,o.bh,{fill:'#c9a46a',fo:.6,stroke:'#c9a46a',rx:8}));
 if(mass)s+=fade(g,label(mass,bx,o.y+9,{size:24,color:C.ink,anchor:'middle',weight:700}));
 if(axis){
  const ay=bot+44;
  s+=fade(g*axis,arrow(o.X0-260,ay,o.X0+290,ay,{color:C.x,w:2.5,head:14})+label('x',o.X0+300,ay+8,{size:26,color:C.x,weight:700}));
  s+=fade(g*axis,[[-0.1,'−0.10'],[0,'0'],[0.1,'0.10']].map(([u,t])=>line(sbX(u,o),ay-8,sbX(u,o),ay+8,{color:C.x,w:2.5})+label(t,sbX(u,o),ay+34,{size:22,color:C.x,anchor:'middle'})).join('')+label('[m]',o.X0+300,ay+36,{size:22,color:C.x}));
 }
 const f=F===null?-100*x:F;
 if(Fg&&Math.abs(f)>.4){const L=f*o.fpx,yy=top-28;s+=FA(bx,yy,bx+L,yy,{g:g*Fg,w:8,head:Math.min(22,Math.abs(L)*.6)});
  const t=Ftext===null?`${Math.abs(f).toFixed(0)} N`:Ftext;if(t)s+=fade(g*Fg,label(t,bx+L+(L<0?-12:12),yy+9,{size:24,color:C.F,anchor:L<0?'end':'start',weight:700}));}
 if(Vg&&Math.abs(v)>.03){const L=v*o.vpx,yy=top-74;s+=fade(g*Vg,arrow(bx,yy,bx+L,yy,{color:C.v,w:6,head:Math.min(18,Math.abs(L)*.6)}));
  if(Vtext)s+=fade(g*Vg,label(Vtext,bx+L+(L<0?-12:12),yy+9,{size:24,color:C.v,anchor:L<0?'end':'start',weight:700}));}
 if(hand)s+=fade(g*hand,rect(bx+o.bw/2,o.y-14,90,28,{fill:'#e9c7a6',fo:.9,stroke:'none',rx:10})+rect(bx+o.bw/2-4,o.y-26,40,52,{fill:'#e9c7a6',fo:1,stroke:'none',rx:14}));
 return s;
}
// phase φ: x＝A cosφ, v＝−Aω sinφ (A＝0.10 m, ω＝10 → |v| ≤ 1.0 m/s)
export const xs=ph=>0.1*Math.cos(ph), vs=ph=>-1.0*Math.sin(ph);
export const osc=(ph,o={})=>springBig({x:xs(ph),v:vs(ph),Ftext:'',...o});
// small legend card: F green, v purple
const legend=(x,y,g=1,{a=0}={})=>fade(g,arrow(x,y,x+60,y,{color:C.F,w:7,head:16})+label('力 F',x+74,y+8,{size:24,color:C.F,weight:700})+arrow(x,y+40,x+60,y+40,{color:C.v,w:5,head:14})+label('速度 v',x+74,y+48,{size:24,color:C.v,weight:700}));

// ---- five snapshots --------------------------------------------------------------------------------
const FIVE=[{n:'右端',x:.1,v:0},{n:'右の途中',x:.05,v:-.866},{n:'中心',x:0,v:-1},{n:'左の途中',x:-.05,v:-.866},{n:'左端',x:-.1,v:0}];
const R5={wall:90,X0:380,px:1300,bw:54,bh:40,fpx:9,vpx:110};
export function five({g=1,upto=5,hlEnd=0,hlMid=0,acc=0,tableG=1}={}){
 let s='';
 const ys=[88,180,272,364,456];
 FIVE.forEach((r,i)=>{
  const o=i<upto?1:0;if(o<=0)return;const y=ys[i],bx=R5.X0+r.x*R5.px;
  s+=fade(g,line(R5.wall,y+R5.bh/2,R5.X0+200,y+R5.bh/2,{color:C.faint,w:2})+wall(R5.wall,y-30,y+R5.bh/2));
  s+=fade(g*.7,line(R5.X0,y-30,R5.X0,y+R5.bh/2,{color:C.faint,w:1.5,dash:'5 5'}));
  s+=fade(g,spring(R5.wall,bx-R5.bw/2,y,{coils:7,amp:9,color:C.dim,w:2}));
  s+=fade(g,rect(bx-R5.bw/2,y-R5.bh/2,R5.bw,R5.bh,{fill:'#c9a46a',fo:.6,stroke:'#c9a46a',rx:6}));
  const f=-100*r.x;
  if(Math.abs(f)>.1){const L=f*R5.fpx*(acc?1:1);s+=arrow(bx,y-34,bx+L,y-34,{color:acc?C.a:C.F,w:6,head:14,g});}
  else s+=fade(g,label(acc?'a ＝ 0':'F ＝ 0',bx,y-28,{size:22,color:acc?C.a:C.F,anchor:'middle',weight:700}));
  if(Math.abs(r.v)>.01)s+=arrow(bx,y+34,bx+r.v*R5.vpx,y+34,{color:C.v,w:5,head:13,g});
  else s+=fade(g,label('v ＝ 0',bx+44,y+42,{size:22,color:C.v,weight:700}));
  if(tableG){
   s+=fade(g*tableG,label(r.n,720,y+8,{size:26,color:C.ink,anchor:'middle',weight:700}));
   s+=fade(g*tableG,label(['最大','中','0','中','最大'][i],880,y+8,{size:26,color:acc?C.a:C.F,anchor:'middle',weight:700}));
   s+=fade(g*tableG,label(['0','中','最大','中','0'][i],1040,y+8,{size:26,color:C.v,anchor:'middle',weight:700}));
  }
  if((hlEnd&&(i===0||i===4))||(hlMid&&i===2))s+=fade(g*Math.max(hlEnd,hlMid),rect(640,y-30,520,60,{fill:C.hi,fo:.1,stroke:C.hi,sw:2,rx:10}));
 });
 if(tableG)s+=fade(g*tableG,label(acc?'加速度 a':'力 F',880,42,{size:24,color:acc?C.a:C.F,anchor:'middle',weight:700})+label('速さ',1040,42,{size:24,color:C.v,anchor:'middle',weight:700}));
 return s;
}
// ---- energy stack: U (light, bottom) + K (dark, top); total 0.50 J ----------------------------------
export function ustack(x,base,U,Kv,{k=560,w=120,g=1,title='',lab=1}={}){
 let s=fade(g,rect(x-w/2,base-U*k,w,U*k,{fill:UC,fo:.6,stroke:UC,sw:2,rx:4})+rect(x-w/2,base-(U+Kv)*k,w,Kv*k,{fill:KC,fo:.7,stroke:KC,sw:2,rx:4}));
 if(lab){
  if(U>.06)s+=fade(g,label(`U ${U.toFixed(U<.2&&U>.1?3:2)}`,x,base-U*k/2+8,{size:22,color:C.bg,anchor:'middle',weight:700}));
  if(Kv>.06)s+=fade(g,label(`K ${Kv.toFixed(Kv<.4&&Kv>.3?3:2)}`,x,base-U*k-Kv*k/2+8,{size:22,color:C.bg,anchor:'middle',weight:700}));
 }
 s+=fade(g,line(x-w/2-16,base-.5*k,x+w/2+16,base-.5*k,{color:C.hi,w:2,dash:'6 6'}));
 if(title)s+=fade(g,label(title,x,base+32,{size:22,color:C.ink,anchor:'middle'}));
 return s;
}
// ---- Hooke graph ---------------------------------------------------------------------------------------
const hAxes=(g=1)=>axes({x:110,y:440,w:500,h:320,xmax:.25,ymax:25,xlabel:'伸び [m]',ylabel:'力の 大きさ [N]',xticks:[.05,.1,.15,.2],yticks:[5,10,15,20],grid:true,g,xcolor:C.x,ycolor:C.F});

export const hsShm1Diagrams={
 // ================= S1 前の単元の問い =================
 [K+'q']:(p)=>{
  const u=seg(p,.05,.3);let ph=0,hand=1-seg(p,.45,.55),x=.1*u;
  if(p>.55){ph=(p-.55)/.45*1.6*PI;x=xs(ph);}
  let s=springBig({x,axis:0,hand,center:1});
  s+=fade(seg(p,.6,.75),label('中心',SB.X0,SB.y-110,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=fade(.3,osc(1.6*PI+p*2*PI,{axis:0}));
  s+=card(250,70,700,200,label('なぜ 中心で 止まらず',600,145,{size:34,color:C.ink,anchor:'middle'})+label('行き過ぎて 戻る？',600,225,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'q3']:(p)=>{
  let s=springBig({x:0,axis:0});
  s+=fade(seg(p,.1,.25),label('自然の 長さ',SB.X0-230,SB.y-110,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(760,60,400,110,label('力 ＝ 0',960,128,{size:40,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 [K+'q4']:(p)=>{
  const ph=PI/2-.5+seg(p,0,.6)*1.0;
  let s=osc(ph,{axis:0,Fg:seg(p,.55,.7),Vg:seg(p,.55,.7)});
  s+=fade(seg(p,.05,.2),label('止まらない',SB.X0,SB.y+110,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=legend(900,90,seg(p,.6,.75));
  return s;
 },
 // ================= S2 ばねの力 =================
 [K+'setup']:(p)=>{
  let s=springBig({x:0,axis:0,g:seg(p,0,.15)});
  s+=fade(seg(p,.2,.35),label('壁に 固定',SB.wall+20,SB.y-110,{size:24,color:C.dim,anchor:'middle'})+label('おもり',SB.X0,SB.y-60,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.72),label('摩擦 なし',900,SB.y+80,{size:26,color:C.dim,anchor:'middle'}));
  s+=tag('仮定',900,SB.y-90,{color:C.dim,g:seg(p,.65,.8)});
  return s;
 },
 [K+'axis']:(p)=>{
  let s=springBig({x:0,axis:seg(p,.1,.35)});
  s+=fade(seg(p,.3,.45),label('x ＝ 0',SB.X0,SB.y-60,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),arrow(SB.X0+120,SB.y-110,SB.X0+260,SB.y-110,{color:C.x,w:4,head:16})+label('正の 向き',SB.X0+280,SB.y-102,{size:26,color:C.x,weight:700}));
  return s;
 },
 [K+'xsign']:(p)=>{
  const x=p<.45?.1*seg(p,.03,.25):.1-.2*seg(p,.45,.7);
  let s=springBig({x,ghost:0});
  const bx=sbX(x),yy=SB.y-70;
  if(Math.abs(x)>.005)s+=line(SB.X0,yy,bx,yy,{color:C.x,w:4})+line(SB.X0,yy-10,SB.X0,yy+10,{color:C.x,w:3});
  s+=fade(seg(p,.15,.3)*(1-seg(p,.42,.5)),label('伸ばす：x ＞ 0',900,110,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('縮める：x ＜ 0',900,110,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.92),label('x ＝ 中心からの ずれ',900,170,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'hooke']:(p)=>{
  let s=springBig({x:.1*seg(p,.05,.4),axis:0,Fg:seg(p,.3,.45),Ftext:''});
  s+=card(760,330,400,130,label('フックの 法則',960,385,{size:34,color:C.F,anchor:'middle',weight:700})+label('力は 伸びに 比例',960,430,{size:26,color:C.ink,anchor:'middle'}),seg(p,.6,.75),C.F);
  return s;
 },
 [K+'hooke2']:(p)=>{
  const A=hAxes(seg(p,0,.12));let s=A.svg;
  const pts=[[.05,5],[.1,10],[.2,20]];
  pts.forEach(([x,f],i)=>{const o=seg(p,.12+i*.13,.22+i*.13);s+=fade(o,ring(A.X(x),A.Y(f),9,{color:C.F,w:3,fill:C.bg}));});
  s+=A.plot(x=>100*x,{from:0,to:.22,p:seg(p,.5,.7),color:C.F,w:4,steps:2});
  s+=table({x:700,y:80,cols:[{h:'伸び [m]',color:C.x,w:200},{h:'力 [N]',color:C.F,w:200}],rows:[['0.05','5'],['0.10','10'],['0.20','20']],reveal:[seg(p,.12,.22),seg(p,.25,.35),seg(p,.38,.48)],rh:62,size:30,g:seg(p,.05,.15)});
  s+=tag('実験で 確かめた 法則',900,420,{color:C.F,g:seg(p,.75,.88)});
  return s;
 },
 [K+'unit']:(p)=>{
  const A=hAxes(1);let s=A.svg+A.plot(x=>100*x,{from:0,to:.22,color:C.F,w:4,steps:2});
  s+=fade(seg(p,.1,.25),line(A.X(.1),A.Y(10),A.X(.2),A.Y(10),{color:C.x,w:3})+line(A.X(.2),A.Y(10),A.X(.2),A.Y(20),{color:C.F,w:3})+label('0.10 m',A.X(.15),A.Y(10)+28,{size:22,color:C.x,anchor:'middle'})+label('10 N',A.X(.2)+12,A.Y(15)+8,{size:22,color:C.F}));
  s+=card(700,90,450,200,T2('k=100\\ \\mathrm{N/m}',925,160,{size:44,auto:false})+label('1 m あたり 100 N',925,240,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.45),C.F);
  s+=fade(seg(p,.6,.75),label('k：ばね定数',925,360,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'range']:(p)=>{
  const A=hAxes(1);let s=A.svg;
  s+=A.plot(x=>100*x,{from:0,to:.15,color:C.F,w:4,steps:2});
  s+=fade(seg(p,.1,.3),A.plot(x=>x<.15?100*x:15+60*(x-.15)-180*(x-.15)**2,{from:.15,to:.24,color:C.a,w:4,dash:'8 7',steps:30}));
  s+=fade(seg(p,.2,.35),rect(A.X(.15),A.Y(25),A.X(.25)-A.X(.15),A.Y(0)-A.Y(25),{fill:C.a,fo:.1,stroke:'none',rx:0})+label('使えない',A.X(.2),A.Y(22),{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=card(700,110,450,170,label('伸びすぎると',925,170,{size:28,color:C.ink,anchor:'middle'})+label('元に 戻らない',925,230,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.25,.4),C.a);
  s+=tag('適度な 伸びでの 近似',925,370,{color:C.hi,g:seg(p,.65,.8)});
  return s;
 },
 [K+'dir']:(p)=>{
  const o1={...SB,y:150},o2={...SB,y:380};
  let s=springBig({o:o1,x:.1*seg(p,.05,.3),axis:0,Fg:seg(p,.25,.4),Ftext:'左へ 引く'});
  s+=fade(seg(p,.45,.55),springBig({o:o2,x:-.1*seg(p,.5,.75),axis:0,Fg:seg(p,.7,.85),Ftext:'右へ 押す'}));
  s+=fade(seg(p,.05,.2),label('伸ばす',1000,150,{size:28,color:C.x,weight:700}));
  s+=fade(seg(p,.5,.65),label('縮める',1000,380,{size:28,color:C.x,weight:700}));
  return s;
 },
 [K+'sign']:(p)=>{
  const o1={...SB,y:150,X0:540,wall:120},o2={...SB,y:380,X0:540,wall:120};
  let s=fade(.6,springBig({o:o1,x:.1,axis:0,Fg:1,Ftext:''})+springBig({o:o2,x:-.1,axis:0,Fg:1,Ftext:'',floorTo:800}));
  s+=fade(seg(p,.05,.2),label('ずれ → 右',300,70,{size:24,color:C.x,anchor:'middle'})+label('力 → 左',300,100,{size:24,color:C.F,anchor:'middle'}));
  s+=card(820,120,340,240,T2('F=-kx',990,230,{size:60})+label('− ＝ ずれと 逆向き',990,310,{size:24,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'ex1']:(p)=>{
  let s=springBig({x:.1*seg(p,.03,.25),Fg:seg(p,.45,.6),Ftext:'10 N'});
  s+=fade(seg(p,.1,.25),label('k ＝ 100 N/m',300,80,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=card(740,60,430,100,T2('F=-100\\times 0.10=-10\\ \\mathrm{N}',955,112,{size:32,auto:false}),seg(p,.3,.45),C.F);
  s+=fade(seg(p,.75,.9),label('→ 左向き',955,215,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2']:(p)=>{
  const x=.1-.2*seg(p,.03,.3);
  let s=springBig({x,Fg:seg(p,.3,.45),Ftext:x<0?'10 N':''});
  s+=card(740,60,430,100,T2('F=-100\\times(-0.10)=+10\\ \\mathrm{N}',955,112,{size:30,auto:false}),seg(p,.25,.4),C.F);
  s+=fade(seg(p,.4,.55),label('→ 右向き',955,205,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('− が 向きを 逆に する',955,410,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'name']:(p)=>{
  let s=springBig({x:.1,Fg:1,Ftext:''});
  s+=fade(seg(p,.1,.3),arrow(sbX(.1),SB.y+12,SB.X0+12,SB.y+12,{color:C.hi,w:3,head:12}));
  s+=card(700,380,460,120,label('復元力',930,432,{size:40,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('中心へ 戻す 向きの 力',930,478,{size:24,color:C.ink,anchor:'middle'})),seg(p,.4,.55),C.F);
  return s;
 },
 // ================= S3 力と速度を並べる =================
 [K+'pull']:(p)=>{
  const x=.1*seg(p,.05,.35);
  let s=springBig({x,hand:1-seg(p,.55,.7),Fg:0});
  s+=fade(seg(p,.6,.75),label('v ＝ 0',sbX(.1),SB.y-100,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=legend(900,60,seg(p,.75,.9));
  return s;
 },
 [K+'end']:(p)=>{
  const ph=seg(p,.55,1)*.5;
  let s=osc(ph,{Fg:seg(p,.05,.2),Vg:1,Vtext:''});
  s+=legend(900,60,1);
  s+=fade(seg(p,.2,.35),label('ずれ 最大 → 力 最大',300,90,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mid']:(p)=>{
  const ph=.5+seg(p,0,.9)*(PI/2-.62);
  let s=osc(ph,{Fg:1,Vg:1});
  s+=legend(900,60,1);
  s+=fade(seg(p,.1,.25),label('力：小さく なる',300,80,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('速さ：増え 続ける',300,120,{size:26,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'center']:(p)=>{
  const ph=PI/2-.12+seg(p,0,.25)*.12;
  let s=osc(ph,{Fg:1,Vg:1,Vtext:p>.5?'最大':''});
  s+=legend(900,60,1);
  s+=fade(seg(p,.1,.25),label('F ＝ 0',SB.X0+60,SB.y+8,{size:28,color:C.F,weight:700}));
  s+=card(80,390,400,90,label('中心：速さ 最大',280,447,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.55,.7),C.v);
  return s;
 },
 [K+'inertia']:(p)=>{
  const ph=PI/2+seg(p,.05,.9)*.35;
  let s=osc(ph,{Fg:1,Vg:1,Vtext:''});
  s+=card(80,385,420,115,label('慣性',290,430,{size:34,color:C.hi,anchor:'middle',weight:700})+label('力が なくても 速度は 続く',290,475,{size:24,color:C.ink,anchor:'middle'}),seg(p,.2,.35),C.hi);
  s+=legend(900,60,1);
  return s;
 },
 [K+'past']:(p)=>{
  const ph=PI/2+.35+seg(p,0,.9)*(PI/2-.5);
  let s=osc(ph,{Fg:1,Vg:1});
  s+=legend(900,60,1);
  s+=fade(seg(p,.1,.25),label('力：右向きに 変わる',300,80,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('速さ：減る',300,120,{size:26,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lend']:(p)=>{
  const ph=PI-.15+seg(p,0,.25)*.15+seg(p,.55,1)*.5;
  let s=osc(ph,{Fg:1,Vg:1});
  s+=legend(900,60,1);
  s+=fade(seg(p,.15,.3),label('速度：一瞬 0',300,120,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('力 最大・右向き',300,80,{size:26,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'five']:(p)=>{
  let s=five({upto:5,g:seg(p,0,.15),tableG:seg(p,.15,.3)});
  s+=fade(seg(p,.05,.2),label('単振動',600,42,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6)*(1-seg(p,.75,.82)),rect(640,272-30,520,60,{fill:C.hi,fo:.1,stroke:C.hi,sw:2,rx:10}));
  s+=fade(seg(p,.8,.9),rect(640,88-30,520,60,{fill:C.hi,fo:.1,stroke:C.hi,sw:2,rx:10})+rect(640,456-30,520,60,{fill:C.hi,fo:.1,stroke:C.hi,sw:2,rx:10}));
  return s;
 },
 [K+'acc']:(p)=>{
  const u=seg(p,.3,.45);
  let s=five({g:1,acc:u>.5?1:0,hlEnd:seg(p,.6,.72),hlMid:seg(p,.6,.72)});
  s+=fade(seg(p,.05,.2)*(1-seg(p,.3,.4)),card(420,200,360,100,T2('a=F\\div m',600,255,{size:46}),1,C.a));
  return s;
 },
 // ================= S4 エネルギーで確かめる =================
 [K+'e1']:(p)=>{
  let s=springBig({x:.1,axis:1});
  s+=card(760,60,400,150,label('ばねの 位置エネルギー',960,110,{size:26,color:UC,anchor:'middle',weight:700})+T2(Ut+'=\\tfrac12 kx^2',960,175,{size:44}),seg(p,.4,.55),UC);
  s+=fade(seg(p,.05,.2),label('中心での 速さ は？',300,80,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e2']:(p)=>{
  let s=springBig({x:.1,axis:1,mass:'1.0 kg'});
  s+=fade(seg(p,.05,.2),label('k ＝ 100 N/m',300,80,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),line(SB.X0,SB.y-70,sbX(.1),SB.y-70,{color:C.x,w:4})+label('振幅 A ＝ 0.10 m',sbX(.05),SB.y-86,{size:26,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e3']:(p)=>{
  let s=fade(.45,springBig({x:.1,axis:0,o:{...SB,y:150,X0:520,wall:80},floorTo:760}));
  s+=card(80,260,650,110,T2(Ut+'=\\tfrac12\\times 100\\times 0.10^2=0.50\\ \\mathrm{J}',405,316,{size:36,auto:false}),seg(p,.4,.55),UC);
  s+=fade(seg(p,.1,.25),label('端：K ＝ 0',405,420,{size:28,color:KC,anchor:'middle',weight:700}));
  s+=ustack(960,440,.5*seg(p,.5,.7),0,{title:'右端',g:seg(p,.45,.55)});
  s+=fade(seg(p,.45,.55),label('0.50 J',1060,440-.5*560+8,{size:22,color:C.hi,weight:700}));
  return s;
 },
 [K+'e4']:(p)=>{
  let s=ustack(760,440,.5,0,{title:'右端'})+fade(.999,label('0.50 J',660,440-.5*560+8,{size:22,color:C.hi,anchor:'end',weight:700}));
  s+=ustack(1000,440,0,.5*seg(p,.45,.65),{title:'中心',g:seg(p,.4,.5)});
  s+=card(40,90,540,130,label('K ＋ U ＝ 一定',310,150,{size:38,color:C.hi,anchor:'middle',weight:700})+label('（摩擦が ない とき）',310,195,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.5,.65),label('中心：U ＝ 0 → K ＝ 0.50 J',310,300,{size:28,color:KC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e5']:(p)=>{
  let s=T2('\\tfrac12\\times 1.0\\times v^2=0.50',600,90,{size:46,auto:true});
  s+=fade(seg(p,.25,.4),T2('v^2=1.0',600,210,{size:48}));
  s+=card(400,280,400,110,T2('v=1.0\\ \\mathrm{m/s}',600,340,{size:48}),seg(p,.5,.65),C.v);
  s+=fade(seg(p,.75,.9),label('中心の 速さ',600,450,{size:28,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e6']:(p)=>{
  let s=springBig({x:.05,o:{...SB,y:150},axis:0,ghost:null});
  s+=fade(1,line(SB.X0,90,sbX(.05),90,{color:C.x,w:4})+label('x ＝ 0.050 m',sbX(.025),76,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=table({x:90,y:260,cols:[{h:'x [m]',color:C.x,w:150},{h:'U [J]',color:UC,w:150},{h:'K [J]',color:KC,w:150},{h:'合計 [J]',color:C.hi,w:150}],rows:[['0.10','0.50','0','0.50'],['0.050','0.125','0.375','0.50'],['0','0','0.50','0.50']],reveal:[1,seg(p,.1,.3),seg(p,.6,.75)],hl:[1],rh:52,size:28});
  s+=ustack(1000,450,.125,.375*seg(p,.3,.5),{title:'x ＝ 0.050 m',k:440});
  return s;
 },
 [K+'e7']:(p)=>{
  const ph=seg(p,0,.95)*PI,x=xs(ph),v=vs(ph),U=50*x*x,Kv=.5*v*v;
  let s=springBig({x,v,o:{...SB,y:150,X0:520,wall:80},axis:0,Vg:1,floorTo:800});
  s+=ustack(1000,450,U,Kv,{k:440,lab:0});
  s+=label('合計 0.50 J',1000,450-.5*440-24,{size:24,color:C.hi,anchor:'middle',weight:700});
  s+=card(80,300,700,130,label('U が K に 変わり、',430,355,{size:30,color:C.ink,anchor:'middle'})+label('速さを 持って 行き過ぎる',430,405,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 // ================= S5 よくある間違い =================
 [K+'m1']:(p)=>{
  let s=fade(.35,five({tableG:0}));
  s+=card(640,90,520,200,label('よくある 間違い ①',900,145,{size:28,color:C.a,anchor:'middle',weight:700})+label('力が 0 の 中心で 止まる',900,225,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.6,.75),line(700,215,1100,240,{color:C.a,w:4}));
  return s;
 },
 [K+'m1b']:(p)=>{
  let s=fade(.35,five({tableG:0}));
  s+=card(640,90,520,280,label('力 ＝ 0',900,150,{size:32,color:C.F,anchor:'middle',weight:700})+label('→ 速度が 変わらない',900,205,{size:30,color:C.v,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('速度 ＝ 0 では ない',900,300,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'m2']:(p)=>{
  let s=fade(.35,five({tableG:0,acc:1}));
  s+=card(640,90,520,200,label('よくある 間違い ②',900,145,{size:28,color:C.a,anchor:'middle',weight:700})+label('端では 加速度も 0',900,225,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.6,.75),line(700,215,1100,240,{color:C.a,w:4}));
  return s;
 },
 [K+'m2b']:(p)=>{
  let s=five({tableG:seg(p,.1,.25),acc:1,hlEnd:seg(p,.45,.6)});
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  const ph=PI/2-.3+seg(p,0,.9)*.6;
  let s=osc(ph,{Fg:1,Vg:1,o:{...SB,y:300}});
  s+=card(140,30,920,110,label('中心：力 0、速さ 最大 → 慣性で 行き過ぎる',600,98,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'ans2']:(p)=>{
  const ph=p*2*PI+.3;
  let s=osc(ph,{Fg:1,Vg:1,o:{...SB,y:300}});
  s+=card(140,30,920,110,label('復元力 ＋ 慣性 → 往復（単振動）',600,98,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  const ph=p*2.2*PI;
  let s=osc(ph,{axis:0,o:{...SB,y:300}});
  s+=card(250,40,700,140,label('1往復の 時間は 何で 決まる？',600,125,{size:40,color:C.t,anchor:'middle',weight:700}),seg(p,.2,.35),C.t);
  return s;
 },
 [K+'next2']:(p)=>{
  const ph=p*2.6*PI;
  let s=springBig({x:.1*Math.cos(ph),axis:0,o:{...SB,y:170,X0:560,wall:120},floorTo:900});
  s+=springBig({x:.04*Math.cos(ph),axis:0,o:{...SB,y:400,X0:560,wall:120},floorTo:900});
  s+=fade(seg(p,.05,.2),label('大きく',1000,175,{size:30,color:C.x,weight:700})+label('小さく',1000,405,{size:30,color:C.x,weight:700}));
  s+=card(880,250,300,90,label('長く なる？',1030,308,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('1往復の 時間（周期）を 求める',600,265,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('単振動・深く学ぶ 2/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
