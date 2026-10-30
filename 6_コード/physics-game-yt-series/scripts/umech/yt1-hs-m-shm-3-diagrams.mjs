// 高校編「単振動・深く学ぶ 3/3」(ys-hs-m-shm-3) — 図。Stage 1200×515.
// 振り子：支点 (PX,PY)、糸の長さ L px。角 θ は真下から測り、右に振れると正。重力 mg（緑）を糸の方向と円弧の方向に分ける。
// 色：x 水色、a 赤、F・mg 緑、ω 桃、角 θ 橙、t・T 金、エネルギー 橙、強調 黄。g＝9.8。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,ground,wall,spring,axes} from './anim.mjs';
import {card,table,tag,T2,FA} from './yt1-hs-m-shm-1-diagrams.mjs';
import {ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {arcPts} from './yt1-hs-m-circular-1-diagrams.mjs';

const K='hs-m-shm-3:';
const PI=Math.PI, D2R=PI/180;
const TT=`{\\color{${C.t}}T}`, W=`{\\color{${C.p}}\\omega}`, TH=`{\\color{${C.E}}\\theta}`;
export const PP={x:330,y:46,L:330};
const bob=(th,o=PP)=>[o.x+o.L*Math.sin(th),o.y+o.L*Math.cos(th)];
// arc of angles a1..a2 (from vertical) around the pivot at radius r
const varc=(r,a1,a2,o=PP,n=24)=>Array.from({length:n+1},(_,i)=>{const a=a1+(a2-a1)*i/n;return [o.x+r*Math.sin(a),o.y+r*Math.cos(a)];});
export function pend({th=0,g=1,o=PP,vert=1,ang=0,mg=0,split=0,comps=0,tension=0,arcPath=0,xarc=0,m='',r=22}={}){
 const [bx,by]=bob(th,o);
 let s=fade(g,line(o.x-130,o.y,o.x+130,o.y,{color:C.dim,w:4}));
 for(let q=o.x-120;q<o.x+130;q+=22)s+=fade(g,line(q,o.y,q+12,o.y-12,{color:C.faint,w:2}));
 if(vert)s+=fade(g*vert,line(o.x,o.y,o.x,o.y+o.L+40,{color:C.faint,w:1.5,dash:'5 6'}));
 if(arcPath)s+=fade(g*arcPath,draw(varc(o.L,-.5,.5,o,40),1,{color:C.faint,w:2,dash:'6 6'}));
 if(xarc&&Math.abs(th)>.01)s+=fade(g*xarc,draw(varc(o.L,0,th,o,30),1,{color:C.x,w:5}));
 if(ang&&Math.abs(th)>.01)s+=fade(g*ang,draw(varc(60,0,th,o,16),1,{color:C.E,w:3})+label('θ',o.x+80*Math.sin(th/2),o.y+80*Math.cos(th/2)+8,{size:26,color:C.E,anchor:'middle',weight:700}));
 s+=fade(g,line(o.x,o.y,bx,by,{color:C.ink,w:2.5}));
 if(tension)s+=arrow(bx,by,bx-(bx-o.x)*.33,by-(by-o.y)*.33,{color:C.F,w:6,head:16,g:g*tension});
 const G=150; // mg arrow length
 if(mg)s+=FA(bx,by,bx,by+G,{g:g*mg,w:7,head:20});
 if(mg)s+=fade(g*mg,label('mg',bx+14,by+G-6,{size:26,color:C.F,weight:700}));
 if(split){
  const ux=Math.sin(th),uy=Math.cos(th);           // along string, outward
  const tx=-Math.cos(th),ty=Math.sin(th);          // along arc, toward the bottom
  const c=G*Math.cos(th),sn=G*Math.sin(th);
  s+=fade(g*split,line(bx-110*Math.cos(th),by+110*Math.sin(th),bx+110*Math.cos(th),by-110*Math.sin(th),{color:C.faint,w:2,dash:'4 6'})+line(bx,by,bx+ux*190,by+uy*190,{color:C.faint,w:2,dash:'4 6'}));
  if(comps){
   s+=arrow(bx,by,bx+ux*c,by+uy*c,{color:'#b9f5dc',w:5,head:15,g:g*comps});
   s+=arrow(bx,by,bx+tx*sn,by+ty*sn,{color:C.hi,w:6,head:16,g:g*comps});
   s+=fade(g*comps*.8,line(bx+ux*c,by+uy*c,bx,by+G,{color:C.dim,w:1.5,dash:'4 5'})+line(bx+tx*sn,by+ty*sn,bx,by+G,{color:C.dim,w:1.5,dash:'4 5'}));
  }
 }
 s+=fade(g,ball(bx,by,{r}));
 if(m)s+=fade(g,label(m,bx,by+8,{size:20,color:C.bg,anchor:'middle',weight:700}));
 return s;
}
const swing=(p,amp=.35,turns=1)=>amp*Math.cos(p*2*PI*turns);

export const hsShm3Diagrams={
 // ================= S1 =================
 [K+'q']:(p)=>{
  let s=pend({th:swing(p,.35,1.2),o:{...PP,x:400}});
  s+=card(720,120,440,170,label('振り子にも',940,180,{size:28,color:C.ink,anchor:'middle'})+label('ずれに 比例して 戻す 力？',940,245,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'q2']:(p)=>{
  let s=pend({th:swing(p,.3,1),o:{...PP,x:400}});
  s+=card(720,100,440,220,label('あれば',940,155,{size:26,color:C.dim,anchor:'middle'})+label('振り子も 単振動',940,215,{size:34,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.4,.55),T2(TT+'=\\dfrac{2\\pi}{'+W+'}',940,285,{size:40})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'q3']:(p)=>{
  const th=swing(p,.3,1.3);
  let s=pend({th,o:{...PP,x:260,L:280},r:16,m:''})+pend({th,o:{...PP,x:640,L:280},r:30,m:''});
  s+=fade(seg(p,.05,.2),label('軽い',260,420,{size:28,color:C.ink,anchor:'middle',weight:700})+label('重い',640,420,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(860,150,300,110,label('重いほど 速い？',1010,218,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ================= S2 戻す力 =================
 [K+'setup']:(p)=>{
  let s=pend({th:0});
  s+=fade(seg(p,.1,.25),label('長さ l',PP.x+16,PP.y+PP.L/2,{size:28,color:C.ink,weight:700}));
  s+=fade(seg(p,.3,.45),label('質量 m',PP.x+40,PP.y+PP.L+8,{size:28,color:C.ink,weight:700}));
  s+=fade(seg(p,.6,.75),label('糸の 重さ・空気の 抵抗：無視',900,200,{size:26,color:C.dim,anchor:'middle'}));
  s+=tag('仮定',900,270,{color:C.dim,g:seg(p,.65,.8)});
  return s;
 },
 [K+'angle']:(p)=>{
  const th=25*D2R*seg(p,.05,.4);
  let s=pend({th,ang:seg(p,.3,.45)});
  s+=fade(seg(p,.55,.7),card(760,140,380,110,label('θ は ラジアン',950,208,{size:32,color:C.E,anchor:'middle',weight:700}),1,C.E));
  return s;
 },
 [K+'forces']:(p)=>{
  const th=25*D2R;
  let s=pend({th,ang:1,mg:seg(p,.1,.25),tension:seg(p,.45,.6)});
  const [bx,by]=bob(th);
  s+=fade(seg(p,.5,.65),label('糸が 引く 力',bx-80,by-140,{size:24,color:C.F,anchor:'end',weight:700}));
  s+=fade(seg(p,.15,.3),label('重力',bx+60,by+90,{size:24,color:C.F,weight:700}));
  return s;
 },
 [K+'split']:(p)=>{
  const th=25*D2R;
  let s=pend({th,ang:1,mg:1,split:seg(p,.1,.3),comps:seg(p,.3,.5)});
  s+=card(760,90,400,170,label('糸の 方向',960,150,{size:28,color:'#b9f5dc',anchor:'middle',weight:700})+label('円弧の 方向',960,210,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.3));
  s+=fade(seg(p,.6,.75),label('矢印を 2つに 分ける',960,320,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'angle2']:(p)=>{
  const th=25*D2R,[bx,by]=bob(th);
  let s=pend({th,ang:1,mg:1,split:1,comps:.4});
  // angle between mg (down) and string direction (outward) at the bob
  s+=fade(seg(p,.2,.4),draw(Array.from({length:13},(_,i)=>{const a=th*i/12;return [bx+52*Math.sin(a),by+52*Math.cos(a)];}),1,{color:C.E,w:3})+label('θ',bx+28,by+80,{size:26,color:C.E,weight:700}));
  s+=card(760,120,400,130,label('重力と 糸の 間の 角',960,170,{size:26,color:C.ink,anchor:'middle'})+label('＝ 振れの 角 θ',960,220,{size:32,color:C.E,anchor:'middle',weight:700}),seg(p,.45,.6),C.E);
  return s;
 },
 [K+'comp']:(p)=>{
  const th=25*D2R;
  let s=pend({th,ang:1,mg:1,split:1,comps:1});
  s+=card(740,50,430,300,label('円弧の 方向',955,100,{size:26,color:C.hi,anchor:'middle',weight:700})+T2('mg\\sin\\theta',955,160,{size:42,auto:false,color:C.hi})+fade(seg(p,.45,.6),label('糸の 方向',955,235,{size:26,color:'#b9f5dc',anchor:'middle',weight:700})+T2('mg\\cos\\theta',955,295,{size:42,auto:false,color:'#b9f5dc'})),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'string']:(p)=>{
  const th=25*D2R;
  let s=pend({th,mg:.5,split:1,comps:1,tension:1,arcPath:seg(p,.3,.5)});
  s+=card(740,100,430,170,label('糸の 方向',955,155,{size:26,color:'#b9f5dc',anchor:'middle',weight:700})+label('おもりを 円の 上に とどめる',955,215,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'restore']:(p)=>{
  const th=25*D2R;
  let s=pend({th,mg:.4,split:.5,comps:1,arcPath:1});
  s+=card(740,80,430,230,label('揺れを 戻す 力',955,135,{size:28,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.5,.65),T2('-mg\\sin\\theta',955,215,{size:48,auto:false,color:C.hi})),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.3,.45),label('真下へ 戻す 向き',955,370,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S3 小さい振れ =================
 [K+'sin']:(p)=>{
  const A=axes({x:110,y:450,w:520,h:330,xmax:1.7,ymax:1.7,xlabel:'θ [rad]',ylabel:'',xticks:[.5,1,1.5],yticks:[.5,1,1.5],grid:true,g:seg(p,0,.12),xcolor:C.E});
  let s=A.svg;
  s+=A.plot(t=>t,{from:0,to:1.6,p:seg(p,.1,.35),color:C.E,w:3,dash:'8 6'});
  s+=A.plot(t=>Math.sin(t),{from:0,to:1.6,p:seg(p,.25,.5),color:C.hi,w:4});
  s+=fade(seg(p,.3,.45),label('θ',A.X(1.5)+8,A.Y(1.5)+4,{size:26,color:C.E,weight:700})+label('sin θ',A.X(1.6)+10,A.Y(1)+8,{size:26,color:C.hi,weight:700}));
  s+=card(740,120,420,140,label('sin θ は',950,175,{size:28,color:C.hi,anchor:'middle'})+label('θ に 比例 しない',950,230,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 ...Object.fromEntries([['small',0],['t10',1],['t30',2],['approx',3]].map(([k,st])=>[K+k,(p)=>{
  const A=axes({x:110,y:450,w:520,h:330,xmax:1.7,ymax:1.7,xlabel:'θ [rad]',ylabel:'',xticks:[.5,1,1.5],yticks:[.5,1,1.5],grid:true,xcolor:C.E});
  let s=A.svg+A.plot(t=>t,{from:0,to:1.6,color:C.E,w:3,dash:'8 6'})+A.plot(t=>Math.sin(t),{from:0,to:1.6,color:C.hi,w:4});
  s+=label('θ',A.X(1.5)+8,A.Y(1.5)+4,{size:26,color:C.E,weight:700})+label('sin θ',A.X(1.6)+10,A.Y(1)+8,{size:26,color:C.hi,weight:700});
  s+=fade(st===0?seg(p,.3,.45):1,rect(A.X(0),A.Y(.4),A.X(.4)-A.X(0),A.Y(0)-A.Y(.4),{fill:C.hi,fo:.12,stroke:C.hi,sw:2,rx:4})+label('小さい 角：ほぼ 重なる',A.X(.45),A.Y(.12),{size:22,color:C.hi,weight:700}));
  if(st>=1){
   const rows=[['10°','0.175','0.174'],['30°','0.524','0.500']];
   s+=table({x:700,y:90,cols:[{h:'角',color:C.ink,w:120},{h:'θ [rad]',color:C.E,w:150},{h:'sin θ',color:C.hi,w:150}],rows,reveal:[st===1?seg(p,.05,.25):1,st===2?seg(p,.05,.25):st>2?1:0],hl:st===1?[0]:st===2?[1]:[],rh:66,size:30});
  }
  if(st===2)s+=fade(seg(p,.6,.75),label('差が 広がる',925,330,{size:28,color:C.a,anchor:'middle',weight:700}));
  if(st===3){s+=card(700,300,460,120,T2('\\sin\\theta\\approx\\theta',930,355,{size:48,auto:false,color:C.hi})+label('小さい 振れ だけ',930,400,{size:22,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
   s+=tag('近似',930,470,{color:C.hi,g:seg(p,.6,.75)});}
  return s;
 }])),
 [K+'arc']:(p)=>{
  const th=25*D2R;
  let s=pend({th,ang:1,xarc:seg(p,.1,.35),arcPath:1,vert:1});
  const [bx,by]=bob(th/2,{...PP,L:PP.L+26});
  s+=fade(seg(p,.25,.4),label('x',bx,by+12,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=card(740,100,420,200,label('弧の 長さ ＝ 半径 × 角',950,160,{size:26,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.65),T2('x=l\\theta',950,240,{size:52,auto:true})),seg(p,.3,.45),C.x);
  return s;
 },
 [K+'force']:(p)=>{
  let s=T2('-mg\\sin\\theta',230,90,{size:42,auto:false});
  s+=fade(seg(p,.05,.2),T2('\\approx -mg\\theta',560,90,{size:42,auto:false}));
  s+=fade(seg(p,.35,.5),label('θ ＝ x / l を 入れる',600,200,{size:28,color:C.hi,anchor:'middle'}));
  s+=card(330,250,540,150,T2('\\approx -\\dfrac{mg}{l}\\,x',600,325,{size:56}),seg(p,.55,.7),C.F);
  return s;
 },
 [K+'prop']:(p)=>{
  let s=card(80,90,480,200,label('ばね',320,140,{size:28,color:C.F,anchor:'middle',weight:700})+T2('F=-kx',320,220,{size:46}),seg(p,0,.15),C.F);
  s+=card(640,90,480,200,label('振り子（小さい 振れ）',880,140,{size:28,color:C.hi,anchor:'middle',weight:700})+T2('F\\approx -\\dfrac{mg}{l}\\,x',880,225,{size:44}),seg(p,.1,.25),C.hi);
  s+=fade(seg(p,.4,.55),label('ずれに 比例して 戻す 力',600,380,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chk']:(p)=>{
  const th=.1;
  let s=pend({th:th*seg(p,.05,.4),ang:1,o:{...PP,x:330},m:''});
  s+=table({x:700,y:110,cols:[{h:'量',color:C.ink,w:160},{h:'値',color:C.hi,w:200}],rows:[['m','0.20 kg'],['l','1.0 m'],['θ','0.10 rad']],reveal:[seg(p,.1,.25),seg(p,.3,.45),seg(p,.5,.65)],rh:64,size:30});
  return s;
 },
 [K+'chk2']:(p)=>{
  let s=card(120,70,960,120,T2('mg\\sin\\theta=0.20\\times 9.8\\times\\sin 0.10\\approx 0.196\\ \\mathrm{N}',600,130,{size:36,auto:false}),seg(p,0,.15),C.F);
  s+=card(120,230,960,120,T2('\\dfrac{mg}{l}\\,x=\\dfrac{0.20\\times 9.8}{1.0}\\times 0.10=0.196\\ \\mathrm{N}',600,290,{size:36,auto:false}),seg(p,.4,.55),C.F);
  s+=fade(seg(p,.7,.85),label('ほとんど 一致',600,430,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 周期 =================
 [K+'a']:(p)=>{
  let s=T2('ma\\approx -\\dfrac{mg}{l}\\,x',600,90,{size:46});
  s+=fade(seg(p,.15,.3),label('両辺を m で 割る',920,95,{size:26,color:C.hi}));
  s+=card(380,190,440,140,T2('a\\approx -\\dfrac{g}{l}\\,x',600,260,{size:54}),seg(p,.35,.5),C.a);
  s+=fade(seg(p,.65,.8),label('質量 m が 消えた',600,420,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'a2']:(p)=>{
  const th=swing(p,.3,1.3);
  let s=pend({th,o:{...PP,x:260,L:280},r:16})+pend({th,o:{...PP,x:640,L:280},r:30});
  s+=fade(seg(p,.05,.2),label('軽い',260,420,{size:28,color:C.ink,anchor:'middle',weight:700})+label('重い',640,420,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(860,130,300,150,label('そろって 揺れる',1010,190,{size:30,color:C.hi,anchor:'middle',weight:700})+label('落体：同じ g',1010,240,{size:24,color:C.dim,anchor:'middle'}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'cmp']:(p)=>{
  let s=fade(.7,T2('a=-\\omega^2 x',320,90,{size:42})+T2('a\\approx -\\dfrac{g}{l}\\,x',880,90,{size:42}));
  s+=card(380,180,440,110,T2(W+'^2=\\dfrac{g}{l}',600,238,{size:48}),seg(p,.1,.25),C.p);
  s+=card(380,330,440,130,T2(W+'=\\sqrt{\\dfrac{g}{l}}',600,395,{size:48}),seg(p,.55,.7),C.p);
  return s;
 },
 [K+'T']:(p)=>{
  let s=T2(TT+'=\\dfrac{2\\pi}{'+W+'}',600,90,{size:44});
  s+=card(330,180,540,160,T2(TT+'\\approx 2\\pi\\sqrt{\\dfrac{l}{g}}',600,262,{size:58}),seg(p,.2,.35),C.t);
  s+=tag('小さい 振れの 近似で 導いた 結果',600,410,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'ex']:(p)=>{
  let s=pend({th:swing(p,.15,1.0),o:{...PP,x:230,L:330}});
  s+=card(480,60,680,120,T2(TT+'\\approx 2\\pi\\sqrt{\\dfrac{1.0}{9.8}}',820,120,{size:44}),seg(p,.1,.25),C.t);
  s+=card(620,240,400,110,T2('\\approx 2.0\\ \\mathrm{s}',820,298,{size:52,auto:false,color:C.t}),seg(p,.6,.75),C.t);
  return s;
 },
 [K+'mass']:(p)=>{
  let s=card(330,40,540,150,T2(TT+'\\approx 2\\pi\\sqrt{\\dfrac{l}{g}}',600,118,{size:50}),1,C.t);
  s+=fade(seg(p,.05,.2),label('m が ない',600,240,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=card(120,290,440,150,label('重い → 重力 mg が 大きい',340,350,{size:26,color:C.F,anchor:'middle',weight:700})+label('（引く 力 m 倍）',340,400,{size:22,color:C.dim,anchor:'middle'}),seg(p,.3,.45),C.F);
  s+=card(640,290,440,150,label('重い → 動かしにくい',860,350,{size:26,color:C.a,anchor:'middle',weight:700})+label('（ma の m 倍）',860,400,{size:22,color:C.dim,anchor:'middle'}),seg(p,.5,.65),C.a);
  s+=fade(seg(p,.7,.85),label('打ち消し合う',600,480,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'len']:(p)=>{
  const ph=p*1.0;
  let s=pend({th:.25*Math.cos(ph*2*PI*2),o:{x:230,y:46,L:100},r:16});
  s+=pend({th:.25*Math.cos(ph*2*PI),o:{x:520,y:46,L:400},r:16});
  s+=fade(seg(p,.05,.2),label('1.0 m：2.0 s',230,220,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=card(760,140,400,140,label('長さ 4倍',960,195,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 周期 2倍（約 4.0 s）',960,245,{size:28,color:C.t,anchor:'middle',weight:700}),seg(p,.3,.45),C.t);
  return s;
 },
 [K+'moon']:(p)=>{
  let s=card(120,70,960,120,label('月面：g が 約 1/6 → T は √6 ≈ 2.4 倍',600,140,{size:34,color:C.t,anchor:'middle',weight:700}),seg(p,0,.15),C.t);
  s+=card(300,260,600,120,T2('2.0\\times 2.4\\approx 4.9\\ \\mathrm{s}',600,320,{size:46,auto:false,color:C.t}),seg(p,.55,.7),C.t);
  return s;
 },
 // ================= S5 近似の限り =================
 [K+'iso']:(p)=>{
  const th=swing(p,.18,1.4);
  let s=pend({th,o:{...PP,x:260,L:300},r:18})+pend({th:th*.45,o:{...PP,x:600,L:300},r:18});
  s+=card(800,90,360,150,label('等時性',980,150,{size:38,color:C.hi,anchor:'middle',weight:700})+label('小さい 振れ だけ',980,210,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'big']:(p)=>{
  const A=axes({x:110,y:450,w:520,h:330,xmax:1.7,ymax:1.7,xlabel:'θ [rad]',ylabel:'',xticks:[.5,1,1.5],yticks:[.5,1,1.5],grid:true,xcolor:C.E});
  let s=A.svg+A.plot(t=>t,{from:0,to:1.6,color:C.E,w:3,dash:'8 6'})+A.plot(t=>Math.sin(t),{from:0,to:1.6,color:C.hi,w:4});
  s+=label('θ',A.X(1.5)+8,A.Y(1.5)+4,{size:26,color:C.E,weight:700})+label('sin θ',A.X(1.6)+10,A.Y(1)+8,{size:26,color:C.hi,weight:700});
  s+=fade(seg(p,.1,.25),line(A.X(1.3),A.Y(Math.sin(1.3)),A.X(1.3),A.Y(1.3),{color:C.a,w:4})+label('差の 分だけ 戻す 力が 弱い',A.X(1.0),A.Y(.3),{size:22,color:C.a,anchor:'middle',weight:700}));
  s+=card(740,140,420,130,label('大きく 振ると',950,195,{size:28,color:C.ink,anchor:'middle'})+label('周期は 長く なる',950,245,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.6,.75),C.t);
  return s;
 },
 [K+'bignum']:(p)=>{
  const rows=[['10°','＋0.2%'],['30°','＋1.7%'],['90°','＋18%']];
  let s=table({x:300,y:80,cols:[{h:'振れ幅',color:C.E,w:220},{h:'周期の 伸び',color:C.t,w:260}],rows,reveal:[seg(p,.05,.2),seg(p,.25,.4),seg(p,.55,.7)],hl:[1,2],rh:76,size:34});
  s+=fade(seg(p,.75,.9),label('小さい 振れの 式 T ≈ 2π√(l/g) と 比べた 値',600,430,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'clock']:(p)=>{
  const th=swing(p,.15,1.5),cx=420;
  let s=rect(cx-110,30,220,440,{fill:'#5b3a22',fo:.5,stroke:'#c9a46a',sw:3,rx:20});
  s+=ring(cx,120,70,{color:C.ink,w:3,fill:'#f4ead2'})+line(cx,120,cx,75,{color:'#222',w:4})+line(cx,120,cx+40,120,{color:'#222',w:4});
  s+=pend({th,o:{x:cx,y:200,L:200},vert:0,r:24});
  s+=card(720,120,440,170,label('長さを 調節して',940,180,{size:28,color:C.ink,anchor:'middle'})+label('時刻を 合わせる',940,240,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=card(140,70,920,330,label('よくある 間違い',600,125,{size:30,color:C.a,anchor:'middle',weight:700})+label('重い おもりほど 速く 揺れる',600,205,{size:32,color:C.ink,anchor:'middle',weight:700})+label('大きく 振っても 周期は 同じ',600,290,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.3,.4),line(360,198,840,214,{color:C.a,w:4}));
  s+=fade(seg(p,.6,.7),line(360,283,840,299,{color:C.a,w:4}));
  return s;
 },
 // ================= S6 =================
 [K+'ans']:(p)=>{
  let s=pend({th:swing(p,.2,1),o:{...PP,x:330}});
  s+=card(700,100,460,170,label('小さい 振れ なら',930,160,{size:28,color:C.ink,anchor:'middle'})+T2('F\\approx -\\dfrac{mg}{l}\\,x',930,225,{size:40}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=card(280,50,640,170,T2(TT+'\\approx 2\\pi\\sqrt{\\dfrac{l}{g}}',600,135,{size:56}),seg(p,0,.15),C.t);
  s+=fade(seg(p,.3,.45),label('糸の 長さ と g で 決まる',600,290,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('質量に よらない',600,360,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'end']:(p)=>{
  const items=['速度','加速度','等加速度','落体','放物運動','運動方程式','エネルギー','運動量','円運動','単振動'];
  let s='';
  items.forEach((t,i)=>{const x=110+(i%5)*245,y=150+Math.floor(i/5)*150,o=seg(p,.05+i*.06,.12+i*.06);
   s+=fade(o,rect(x-100,y-40,200,70,{fill:i===9?C.hi:'#131f38',fo:i===9?.15:.96,stroke:i===9?C.hi:C.faint,sw:2,rx:12})+label(t,x,y+8,{size:26,color:i===9?C.hi:C.ink,anchor:'middle',weight:700}));
   if(i%5<4)s+=fade(o,arrow(x+104,y-5,x+138,y-5,{color:C.dim,w:2,head:10}));});
  s+=fade(seg(p,.75,.9),label('力学',600,450,{size:34,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'h1']:(p)=>{
  const amp=.4*Math.exp(-2.2*p),th=amp*Math.cos(p*2*PI*4);
  let s=pend({th,o:{...PP,x:330}});
  const A=axes({x:680,y:300,w:460,h:200,xmax:1,ymax:1,ymin:-1,xlabel:'t',ylabel:'振れ',xticks:[],yticks:[],xcolor:C.t,ycolor:C.E});
  s+=A.svg+A.plot(t=>Math.exp(-2.2*t)*Math.cos(t*2*PI*4),{from:0,to:Math.max(.01,p),color:C.E,w:3,steps:200});
  return s;
 },
 [K+'h2']:(p)=>{
  const th=.03*Math.cos(p*2*PI*2);
  let s=pend({th,o:{...PP,x:330}});
  s+=card(700,70,460,200,label('減った 力学的エネルギー',930,125,{size:26,color:C.E,anchor:'middle',weight:700})+arrow(930,145,930,180,{color:C.dim,w:3,head:12})+label('空気・ばねの 温度が 少し 上がる',930,225,{size:26,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.25),C.a);
  for(let i=0;i<14;i++){const x=640+((i*97)%520),y=330+((i*53)%150),o=seg(p,.4,.6);s+=fade(o*.8,dot(x+8*Math.sin(p*40+i),y+8*Math.cos(p*37+i*2),5,'#ff9c7a'));}
  return s;
 },
 [K+'h3']:(p)=>{
  let s=card(180,90,840,240,label('温度が 高い とは',600,170,{size:34,color:C.ink,anchor:'middle'})+label('物の 中で 何が 起きている？',600,260,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の 分野',600,175,{size:28,color:C.dim,anchor:'middle'})+label('熱',600,270,{size:56,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('高校編・熱 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
