// 空気抵抗・上級（作り直し2）— concrete ⇄ abstract. The phenomenon stays on the left
// while the formula is placed on the right, joined by dashed links; every formula is
// then checked against the meter. Linear model: m=80 kg, g≈10, k=16 → 50 m/s (180 km/h);
// parachute k=160 → 5 m/s (18 km/h), τ=m/k=0.5 s. Quadratic model: c×100 → speed ÷10.
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,axes,tex,texWidth} from './anim.mjs';
import {sky,clouds,diver,hanger,gauge,forceArrows,card,drag2Diagrams} from './drag2-diagrams.mjs';

const DRAG=C.E,kmh=v=>v*3.6;
const freefall=t=>50*(1-Math.exp(-t/5));          // from rest, linear drag, τ = 5 s
const opened=t=>5+45*Math.exp(-2*t);              // after the canopy opens, τ = 0.5 s
const sceneT=ctx=>(ctx.scene?.captions?.[ctx.k]?.start??0)+ctx.t;
const voiceEnd=ctx=>ctx.dur-(ctx.cue.pause??0)-.12;  // seconds from cue start

// Left half: the phenomenon, clipped to its own window.
function left(inner,{dim=0}={}){return `<clipPath id="dyL"><rect x="0" y="0" width="600" height="515" rx="18"/></clipPath><g clip-path="url(#dyL)">${sky()}${inner}${dim?`<rect x="0" y="0" width="600" height="515" fill="#0b1122" fill-opacity="${dim}"/>`:''}</g>`;}
// Right half: the "式に置く" panel.
function panel(title,body){return rect(620,0,580,515,{fill:'#0f1a31',fo:1,stroke:'#2b3d5e',rx:18})+label(title,650,48,{size:26,color:C.dim})+body;}
const row=(g,y,parts)=>fade(g,parts.map(([kind,v,x,opt={}])=>kind==='t'?tex(v,x,y,{size:44,anchor:'start',...opt}):label(v,x,y+12,{size:30,color:C.ink,...opt})).join(''));
const check=(x,y,g)=>fade(g,ring(x,y,34,{color:C.F,w:4,fill:'#0b1122'})+draw([[x-15,y],[x-4,y+12],[x+17,y-12]],clamp(g*1.4),{color:C.F,w:6}));
function link(x1,y1,x2,y2,g,color=C.hi){return fade(g*.8,line(x1,y1,mix(x1,x2,g),mix(y1,y2,g),{color,w:2.5,dash:'7 7'}));}

export const drag3Diagrams={
 'dy-dive':(p,ctx)=>{const ts=22*smooth(clamp(p/.85)),v=freefall(ts),T=sceneT(ctx);
  return sky()+clouds(T*40+ts*120)+diver(430,250+6*Math.sin(T*3),1.5)+gauge(1000,300,kmh(v))+label('早送り ▶▶',70,70,{size:26,color:C.dim})
   +fade(seg(p,.8,.95),card(780,40,390,70,'それ以上 速くならない',{size:28,hi:1}));},

 'dy-model':(p,ctx)=>{const T=sceneT(ctx),g1=seg(p,.12,.3),g2=seg(p,.35,.55);
  const pic=left(clouds(T*140)+diver(300,250,1.4)+forceArrows(300,250,1,{g:120}));
  return pic+panel('式に置く',
   row(g1,270,[['l','重力',660,{color:C.F}],['l','＝',760],['t','mg',820]])+link(250,360,660,270,g1,C.F)
   +row(g2,150,[['l','空気の抵抗',660,{color:DRAG}],['l','＝',820],['t','kv',880]])+link(350,150,660,150,g2,DRAG)
   +fade(seg(p,.6,.8),label('k：抵抗の強さ',660,370,{size:26,color:C.dim})+label('速さに比例する、と考える',660,410,{size:26,color:C.dim})));},

 'dy-balance':(p,ctx)=>{const T=sceneT(ctx);
  const pic=left(clouds(T*140)+diver(300,250,1.4)+forceArrows(300,250,1,{g:120})+fade(seg(p,0,.2),card(160,410,280,64,'つり合い',{size:30,hi:1})));
  return pic+panel('つり合いの式',
   row(seg(p,.05,.25),150,[['t','mg=kv',680,{size:52}]])
   +fade(seg(p,.35,.5),arrow(760,195,760,240,{color:C.hi,w:4,head:14})+label('k で割る',790,228,{size:24,color:C.t}))
   +row(seg(p,.45,.65),350,[['t','v=\\dfrac{mg}{k}',680,{size:56}]])
   +fade(seg(p,.7,.85),label('速さが一定 ＝ 力がつり合う',660,450,{size:28,color:C.hi})));},

 'dy-check':(p,ctx)=>{
  const pic=left(diver(300,200,1.3)+gauge(300,420,180,{r:80}));
  return pic+panel('数を入れる',
   row(seg(p,.05,.2),130,[['l','重力',660],['t','mg\\approx800\\ \\mathrm{N}',740]])
   +row(seg(p,.3,.45),210,[['l','k ＝',660],['t','16',740]])
   +row(seg(p,.55,.75),330,[['t','v=\\dfrac{800}{16}=50\\ \\mathrm{m/s}',660,{size:50}]]));},
 'dy-check:match':(p)=>{
  const pic=left(diver(300,200,1.3)+gauge(300,420,180,{r:80})+`<circle cx="300" cy="420" r="${100+8*Math.sin(p*12)}" fill="none" stroke="${C.F}" stroke-width="4" opacity="${seg(p,.2,.4)}"/>`);
  return pic+panel('答え合わせ',
   row(1,130,[['t','v=50\\ \\mathrm{m/s}',660,{size:52}]])
   +fade(seg(p,.05,.25),arrow(700,180,700,250,{color:C.hi,w:4,head:14}))
   +row(seg(p,.1,.3),310,[['l','時速',660,{size:36}],['l','180 km',760,{size:44,color:C.hi,weight:700}]])
   +check(1090,300,seg(p,.3,.5))+fade(seg(p,.45,.65),label('メーターと ぴったり！',660,420,{size:32,color:C.F,weight:700})));},

 'dy-quiz':(p,ctx)=>drag2Diagrams['dx-quiz'](p,ctx),
 'dy-open':(p,ctx)=>{
  const t=Math.min(ctx.t,4),v=kmh(opened(Math.max(0,t-.4))),inflate=clamp(t/.8),T=sceneT(ctx);
  let s=sky()+clouds(T*40+t*60)+hanger(320,330,inflate,1.1)+gauge(1000,300,v);
  s+=fade(1-seg(ctx.t,1.8,2.4),card(640,40,500,90,'C　落ちながら 遅くなる',{hi:1,size:32})+label('正解！',1150,40,{size:30,color:C.hi,anchor:'end',weight:700}));
  return s+fade(seg(ctx.t,2.2,2.8),label('高さは 下がり続けているのに…',650,90,{size:28,color:C.ink})+label('速さは どんどん下がる',650,135,{size:30,color:C.hi,weight:700}));
 },
 'dy-model2':(p,ctx)=>{const T=sceneT(ctx);
  const pic=left(clouds(T*60)+hanger(300,330,1,1)+forceArrows(300,300,2.3,{g:95}));
  return pic+panel('式で見る',
   row(seg(p,.05,.2),120,[['l','k ：',660],['t','16',740],['l','→',820],['t','160',870,{color:C.hi}],['l','（10倍）',980,{size:26,color:C.dim}]])
   +row(seg(p,.35,.55),240,[['l','抵抗',660,{color:DRAG}],['t','kv=160\\times50',760]])
   +row(seg(p,.5,.7),320,[['t','=8000\\ \\mathrm{N}',760,{size:48}]])
   +fade(seg(p,.72,.88),label('重力 800 N の 10倍！',660,430,{size:32,color:C.hi,weight:700})));},
 'dy-net':(p,ctx)=>{const t=.4+3*smooth(clamp(ctx.t/Math.max(1,voiceEnd(ctx)))),v=kmh(opened(t)),T=sceneT(ctx);
  return sky()+clouds(T*50)+hanger(330,330,1,1.05)+forceArrows(330,300,Math.max(1,(opened(t)/5)),{g:95})
   +arrow(520,360,520,200,{color:C.hi,w:9,head:26,g:seg(p,.1,.35)})+fade(seg(p,.2,.4),label('合わせた力：上向き',550,260,{size:30,color:C.hi,weight:700})+label('→ ブレーキ',550,305,{size:30,color:C.hi}))
   +gauge(1030,330,v);},
 'dy-newgoal':(p)=>{
  const pic=left(hanger(300,330,1,1)+gauge(470,440,18,{r:70,title:''}));
  return pic+panel('新しいゴール',
   row(seg(p,.05,.25),150,[['t','v=\\dfrac{800}{160}=5\\ \\mathrm{m/s}',660,{size:50}]])
   +fade(seg(p,.35,.5),arrow(700,210,700,270,{color:C.hi,w:4,head:14}))
   +row(seg(p,.4,.6),320,[['l','時速',660,{size:36}],['l','18 km',760,{size:44,color:C.hi,weight:700}]])
   +check(1060,310,seg(p,.6,.8))+fade(seg(p,.65,.85),label('メーターが落ち着いた値',660,430,{size:30,color:C.F})));},

 'dy-table':(p,ctx)=>{
  const rows=[[0,50,45],[.5,22,17],[1,11,6],[1.5,7,2]],x0=90,y0=110;
  let s=rect(40,20,1120,470,{fill:'#0f1a31',fo:1,stroke:'#2b3d5e',rx:18});
  s+=label('時間',x0,y0,{size:28,color:C.t})+label('速さ（秒速）',x0+170,y0,{size:28,color:C.v})+label('ゴール（5）との差',x0+420,y0,{size:28,color:DRAG});
  rows.forEach(([t,v,g],i)=>{const at=2.2+i,gi=clamp((ctx.t-at)/.35),y=y0+70+i*80;
   s+=fade(gi,label(`${t} 秒`,x0,y,{size:34})+label(String(v),x0+220,y,{size:40,color:C.v,weight:700})+label(String(g),x0+440,y,{size:40,color:DRAG,weight:700})+rect(x0+540,y-30,8*g*gi,34,{fill:DRAG,fo:.7,sw:0,rx:6}));
   if(i>0)s+=fade(gi,label('×約⅓',x0+880,y-40,{size:26,color:C.hi}));});
  return s+fade(clamp((ctx.t-6.6)/.5),card(700,410,420,64,'毎回、同じ割合で縮む',{size:28,hi:1}));
 },
 'dy-coffee':(p)=>{
  const A=axes({x:640,y:430,w:470,h:300,xmax:5,ymax:100,xlabel:'時間',ylabel:'温度',g:seg(p,0,.2)});
  const temp=t=>25+60*Math.exp(-.8*t),tt=5*seg(p,.15,.85);
  let s=A.svg+line(A.X(0),A.Y(25),A.X(5),A.Y(25),{color:C.hi,w:3,dash:'10 7'})+label('部屋の温度',A.X(5)-10,A.Y(25)-14,{size:24,color:C.hi,anchor:'end'});
  s+=A.plot(temp,{to:tt,color:DRAG,w:5})+dot(A.X(tt),A.Y(temp(tt)),10,C.hi);
  // cup with steam that fades as it cools
  s+=`<path d="M170 250 L200 430 L360 430 L390 250 Z" fill="#e8eef8" fill-opacity=".9"/><path d="M390 290 q60 10 40 70 q-10 30 -45 35" fill="none" stroke="#e8eef8" stroke-width="12"/>`+rect(180,250,200,18,{fill:'#6b4226',fo:1,sw:0,rx:4});
  const steam=1-tt/5;[0,1,2].forEach(i=>{s+=fade(steam*.8,draw(Array.from({length:20},(_,k)=>[230+60*i+12*Math.sin(k/3+p*8+i),230-k*6]),1,{color:'#dfe7f2',w:5}));});
  return s+label(`${Math.round(temp(tt))}℃`,280,480,{size:36,color:DRAG,anchor:'middle',weight:700})+fade(seg(p,.6,.8),label('同じ縮み方',880,90,{size:32,color:C.hi,anchor:'middle',weight:700}));
 },
 'dy-words':(p,ctx)=>{
  const chips=[['速さ',C.v],['＝',C.ink],['ゴール',C.hi],['＋',C.ink],['最初の差',C.x],['×',C.ink],['縮む割合',DRAG]];
  let x=90,s='';const t0=[0,.3,.6,1.0,1.4,2.0,2.4];
  chips.forEach(([w,col],i)=>{const op=w.length===1,W=op?50:w.length*44+40,g=clamp((ctx.t-t0[i])/.35);
   s+=fade(g,op?label(w,x+W/2,215,{size:48,color:col,anchor:'middle'}):rect(x,160,W,84,{fill:col,fo:.14,stroke:col,rx:16})+label(w,x+W/2,216,{size:40,color:col,anchor:'middle',weight:700}));x+=W+14;});
  // the same parts on a tiny graph below
  const g=seg(p,.55,.8);if(g>0){const A=axes({x:260,y:480,w:640,h:160,xmax:5,ymax:10,g});const up=t=>3+6*Math.exp(-1.2*t);
   s+=A.svg+line(A.X(0),A.Y(3),A.X(5),A.Y(3),{color:C.hi,w:3,dash:'9 7'})+A.plot(up,{p:g,color:C.v,w:4})+fade(g,line(A.X(0),A.Y(3),A.X(0),A.Y(9),{color:C.x,w:8})+line(A.X(1.5),A.Y(3),A.X(1.5),A.Y(up(1.5)),{color:DRAG,w:8}));}
  return s;
 },
 'dy-symbols':(p)=>{
  const cols=[[140,'速さ','v',C.v],[370,'ゴール','v_\\infty',C.hi],[680,'最初の差','(v_0-v_\\infty)',C.x],[1010,'縮む割合','e^{-t/\\tau}',DRAG]];
  let s='';cols.forEach(([x,w,sym,col],i)=>{s+=label(w,x,120,{size:34,color:col,anchor:'middle',weight:700});
   const g=seg(p,.1+i*.12,.25+i*.12);s+=fade(g,arrow(x,145,x,215,{color:col,w:4,head:14})+tex(sym,x,290,{size:56}));});
  s+=fade(seg(p,.1,.6),label('＝',255,300,{size:48,anchor:'middle'})+label('＋',500,300,{size:48,anchor:'middle'})+label('×',860,300,{size:48,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('0.5秒ごとに ×0.37',1010,370,{size:26,color:DRAG,anchor:'middle'}));
  return s+fade(seg(p,.65,.85),card(380,410,440,72,'覚えなくて 大丈夫',{size:32,hi:1}));
 },
 'dy-check2':(p)=>{
  const pic=left(hanger(300,330,1,1)+label('1秒後',300,470,{size:34,color:C.t,anchor:'middle',weight:700}));
  return pic+panel('式で計算',
   row(seg(p,.05,.25),140,[['l','差：',660],['t','45\\times0.37\\times0.37',740]])+row(seg(p,.3,.45),220,[['t','\\approx 6',740,{size:48}]])
   +row(seg(p,.55,.75),340,[['l','速さ：',660],['t','5+6=11\\ \\mathrm{m/s}',760,{size:50}]]));},
 'dy-check2:match':(p)=>{
  const pic=left(hanger(300,300,1,1)+gauge(300,440,40,{r:70,title:''})+`<circle cx="300" cy="440" r="${88+6*Math.sin(p*12)}" fill="none" stroke="${C.F}" stroke-width="4" opacity="${seg(p,.2,.4)}"/>`);
  return pic+panel('答え合わせ',row(1,140,[['t','11\\ \\mathrm{m/s}',660,{size:52}]])+fade(seg(p,.05,.25),arrow(700,190,700,250,{color:C.hi,w:4,head:14}))
   +row(seg(p,.1,.3),310,[['l','時速 約',660,{size:36}],['l','40 km',800,{size:44,color:C.hi,weight:700}]])+check(1090,300,seg(p,.3,.5))+fade(seg(p,.45,.65),label('1秒後のメーターと 合う！',660,420,{size:30,color:C.F,weight:700})));},

 'dy-square':(p,ctx)=>{
  const rows=[[1,1],[2,4],[3,9]];let s=rect(40,20,1120,470,{fill:'#0f1a31',fo:1,stroke:'#2b3d5e',rx:18});
  s+=label('速さ',120,90,{size:30,color:C.v})+label('抵抗',330,90,{size:30,color:DRAG});
  rows.forEach(([v,f],i)=>{const g=seg(p,.12+i*.14,.24+i*.14),y=170+i*100;
   s+=fade(g,label(`${v}倍`,120,y,{size:40,color:C.v,weight:700})+label('→',250,y,{size:36})+label(`${f}倍`,330,y,{size:40,color:DRAG,weight:700}));
   // a hand pushed by an arrow whose length is the force
   s+=fade(g,`<ellipse cx="560" cy="${y-12}" rx="26" ry="14" fill="#ffe0bf"/>`+line(470,y-12,536,y-12,{color:'#ffcf9e',w:14})+arrow(600+30*f+40,y-12,592,y-12,{color:DRAG,w:8,head:20,g}));});
  return s+fade(seg(p,.6,.8),card(640,400,480,70,'速さの 二乗 で効く',{size:32,hi:1}));
 },
 'dy-sqrt':(p)=>{
  const pic=left(diver(300,250,1.4)+forceArrows(300,250,1,{g:120}));
  return pic+panel('置き直す',
   row(seg(p,.05,.2),120,[['l','抵抗',660,{color:DRAG}],['l','＝',760],['t','cv^2',820]])+link(350,150,660,120,seg(p,.05,.25),DRAG)
   +row(seg(p,.45,.6),250,[['t','mg=cv^2',680,{size:52}]])+fade(seg(p,.6,.72),arrow(760,300,760,350,{color:C.hi,w:4,head:14}))
   +row(seg(p,.65,.85),420,[['t','v=\\sqrt{\\dfrac{mg}{c}}',680,{size:52}]]));},
 'dy-sqrt:land':(p,ctx)=>{
  const y=180+180*smooth(clamp(ctx.t/Math.max(1,voiceEnd(ctx))));
  const pic=left(rect(0,450,600,65,{fill:'#3f7d4a',fo:1,sw:0,rx:0})+hanger(300,Math.min(y,388),1,.95));
  const meter=gauge(1100,300,mix(180,18,smooth(clamp(ctx.t/Math.max(1,voiceEnd(ctx))))),{r:58,title:''});
  return pic+panel('パラシュートで c が100倍',
   row(seg(p,.05,.2),140,[['t','c\\times100',680],['l','→',880],['l','速さ',940]])+row(seg(p,.25,.45),250,[['t','\\sqrt{100}=10',680,{size:52}]])
   +row(seg(p,.45,.65),350,[['l','速さは',660,{size:32}],['l','10分の1',790,{size:40,color:C.hi,weight:700}]])+fade(seg(p,.65,.85),label('時速 180 km → 18 km',660,450,{size:32,color:C.F,weight:700}))+meter);},

 'dy-end':(p)=>{
  let s=`<rect x="0" y="0" width="1200" height="515" rx="18" fill="#101c35" stroke="${C.hi}" stroke-opacity=".35" stroke-width="2"/>`;
  s+=fade(seg(p,0,.15),label('今日のひとこと',80,90,{size:28,color:C.dim}))+fade(seg(p,.05,.25),label('終端速度は「ゴールの速さ」',80,180,{size:52,color:C.hi,weight:700}));
  const steps=[['現象を見る',C.x],['式に置く',C.v],['現象で確かめる',C.F]];
  steps.forEach(([w,col],i)=>{const g=seg(p,.25+i*.12,.37+i*.12),x=80+i*360;s+=fade(g,rect(x,270,300,90,{fill:col,fo:.14,stroke:col,rx:16})+label(w,x+150,327,{size:34,color:col,anchor:'middle',weight:700}));if(i<2)s+=fade(g,arrow(x+305,315,x+355,315,{color:C.dim,w:4,head:14}));});
  s+=fade(seg(p,.62,.8),`<path d="M950 370 Q 640 470 230 370" fill="none" stroke="${C.dim}" stroke-width="3" stroke-dasharray="8 8"/>`+label('くり返す',590,470,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ---- why the gap shrinks by the same ratio -----------------------------------
 'dy-why':(p,ctx)=>{const T=sceneT(ctx);
  const pic=left(clouds(T*50)+hanger(300,330,1,1)+forceArrows(300,300,2,{g:95}));
  return pic+panel('合わせた力（上向きを＋）',
   row(seg(p,.1,.3),150,[['l','ブレーキの力',660,{color:C.hi}],['l','＝',870]])
   +row(seg(p,.3,.55),250,[['t','kv-mg',700,{size:52}]])+link(360,120,700,250,seg(p,.3,.55),DRAG)+link(250,420,760,250,seg(p,.35,.6),C.F)
   +fade(seg(p,.6,.8),label('抵抗 − 重力',700,330,{size:28,color:C.dim})));},
 'dy-why:gap':(p,ctx)=>{const T=sceneT(ctx);
  const pic=left(clouds(T*50)+hanger(300,330,1,1)+forceArrows(300,300,2,{g:95}));
  return pic+panel('ゴールとの差で書く',
   row(1,110,[['t','kv-mg',680,{size:44,opacity:.45}]])
   +row(seg(p,.05,.25),200,[['l','ゴール：',660,{size:28,color:C.hi}],['t','mg=kv_\\infty',790,{size:44}]])
   +row(seg(p,.35,.6),300,[['t','=k\\,(v-v_\\infty)',680,{size:52}]])
   +fade(seg(p,.55,.7),brace(740,1010,345,{color:C.x,text:'ゴールとの差',size:28}))
   +fade(seg(p,.75,.9),card(650,430,520,64,'ブレーキ ＝ k × 差',{size:30,hi:1})));},
 'dy-rate':(p)=>{
  const A=axes({x:90,y:450,w:420,h:330,xmax:2,ymax:50,xlabel:'時間',ylabel:'差',xticks:[0.5,1,1.5],yticks:[45,6],grid:true});
  const gap=t=>45*Math.exp(-2*t);let s=rect(0,0,600,515,{fill:'#0f1a31',fo:1,stroke:'#2b3d5e',rx:18})+A.svg+A.plot(gap,{color:C.x,w:5});
  const tan=(t0,g)=>{const y0=gap(t0),m=-2*y0,d=t0<.1?.07:.22;return fade(g,line(A.X(t0-d),A.Y(y0-m*d),A.X(t0+d),A.Y(y0+m*d),{color:C.hi,w:4})+dot(A.X(t0),A.Y(y0),9,C.hi));};
  s+=tan(0,seg(p,.3,.45))+tan(1.03,seg(p,.6,.75));
  return s+panel('差が縮む速さ',
   row(seg(p,.05,.25),150,[['t','\\dfrac{k}{m}',680,{size:44}],['l','× 差',760,{size:34,color:C.x}]])
   +row(seg(p,.15,.3),255,[['t','\\dfrac{k}{m}=\\dfrac{160}{80}=2',680,{size:44}]])
   +row(seg(p,.35,.5),335,[['l','差 45 →',660,{size:32,color:C.x}],['l','毎秒 90 縮む',800,{size:32,color:C.hi,weight:700}]])
   +row(seg(p,.65,.8),400,[['l','差  6 →',660,{size:32,color:C.x}],['l','毎秒 12 だけ',800,{size:32,color:C.hi,weight:700}]])
   +fade(seg(p,.85,.95),label('差が大きいほど、速く縮む',660,478,{size:28,color:C.F})));},
 'dy-e':(p)=>{
  let s=rect(0,0,600,515,{fill:'#0f1a31',fo:1,stroke:'#2b3d5e',rx:18})+label('タウごとの差',40,50,{size:26,color:C.dim});
  [45,16.6,6.1,2.2,0.8].forEach((g,i)=>{const gi=seg(p,.35+i*.1,.45+i*.1),y=100+i*80;s+=fade(gi,label(i?`${i}τ 後`:'はじめ',40,y+30,{size:28,color:C.t})+rect(170,y,7.5*g,44,{fill:C.x,fo:.6,sw:0,rx:6})+label(fmt(g,1),180+7.5*g,y+32,{size:28,color:C.x}));if(i)s+=fade(gi,label('×0.37',540,y-2,{size:22,color:C.hi,anchor:'end'}));});
  return s+panel('e のマイナス t 割るタウ乗',
   row(seg(p,.02,.2),130,[['t','e^{-t/\\tau}',660,{size:60}]])
   +row(seg(p,.15,.3),230,[['t','e\\approx2.72',660,{size:44}],['l','（決まった数）',880,{size:26,color:C.dim}]])
   +row(seg(p,.3,.45),320,[['l','t＝τ のとき',660,{size:30}],['t','e^{-1}\\approx0.37',860,{size:40}]])
   +fade(seg(p,.6,.8),label('タウたつごとに ×0.37',660,430,{size:32,color:C.hi,weight:700})));},
 'dy-tau':(p)=>{
  const A=axes({x:90,y:450,w:420,h:320,xmax:2,ymax:50,xlabel:'時間',ylabel:'差',g:1});
  let s=rect(0,0,600,515,{fill:'#0f1a31',fo:1,stroke:'#2b3d5e',rx:18})+A.svg;
  s+=A.plot(t=>45*Math.exp(-t/1),{p:seg(p,.15,.4),color:C.dim,w:4})+fade(seg(p,.25,.4),line(A.X(.75),A.Y(47),A.X(.9),A.Y(47),{color:C.dim,w:4})+label('重い・抵抗が弱い（τ 大）',A.X(.95),A.Y(46),{size:24,color:C.dim}));
  s+=A.plot(t=>45*Math.exp(-t/.25),{p:seg(p,.3,.55),color:C.E,w:4})+fade(seg(p,.4,.55),line(A.X(.75),A.Y(40),A.X(.9),A.Y(40),{color:C.E,w:4})+label('軽い・抵抗が強い（τ 小）',A.X(.95),A.Y(39),{size:24,color:C.E}));
  return s+panel('タウ ＝ ゆっくりさ',
   row(seg(p,.02,.2),170,[['t','\\tau=\\dfrac{m}{k}',680,{size:56}]])
   +row(seg(p,.6,.8),290,[['t','=\\dfrac{80}{160}=0.5',680,{size:48}],['l','秒',960,{size:32}]])
   +fade(seg(p,.8,.95),label('表の「0.5秒ごと」と同じ',660,420,{size:30,color:C.F,weight:700})));},
 'dy-full':(p)=>{
  const parts=[['v',C.v,''],['=',C.ink,''],['v_\\infty',C.hi,'ゴール'],['+',C.ink,''],['(v_0-v_\\infty)',C.x,'最初の差'],['\\,e^{-t/\\tau}',C.E,'τごとに×0.37']],size=62,gap=24;
  const w=parts.map(([t])=>texWidth(t,size));let x=600-(w.reduce((a,b)=>a+b,0)+gap*(parts.length-1))/2;const X=w.map(ww=>{const c=x+ww/2;x+=ww+gap;return c;});
  let s=parts.map(([t],i)=>fade(seg(p,.02+i*.03,.12+i*.03),tex(t,X[i],200,{size}))).join('');
  parts.forEach(([t,col,lab],i)=>{if(!lab)return;const g=seg(p,.2+i*.07,.35+i*.07);s+=fade(g,brace(X[i]-w[i]/2,X[i]+w[i]/2,245,{color:col,text:lab,size:28}));});
  const g2=seg(p,.6,.85);if(g2>0){const A=axes({x:330,y:490,w:540,h:130,xmax:2,ymax:50,g:g2});s+=A.svg+fade(g2,line(A.X(0),A.Y(5),A.X(2),A.Y(5),{color:C.hi,w:3,dash:'9 7'})+line(A.X(0),A.Y(5),A.X(0),A.Y(50),{color:C.x,w:8}))+A.plot(t=>5+45*Math.exp(-2*t),{p:g2,color:C.v,w:4});}
  return s;
 },
};
