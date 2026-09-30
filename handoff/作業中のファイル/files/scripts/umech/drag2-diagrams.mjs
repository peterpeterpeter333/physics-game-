// 空気抵抗・上級（2026-09-27 作り直し）— concrete, Lesics/Sabin-style pictures.
// A skydiver opens a parachute: falling, yet slowing down. Stage is 1200×515.
// Physics: freefall terminal 55.6 m/s (200 km/h); with canopy drag ×~100 → 5.5 m/s (20 km/h).
// Quadratic drag: dv/dt = g(1 − v²/vT²); for v > vT, v(t) = vT / tanh(g t / vT + atanh(vT/v0)).
import {C,clamp,mix,smooth,seg,lin,fmt,fade,label,line,rect,dot,ring,draw,poly,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';

const G=9.8,V0=55.6,VT=5.5,INFLATE=.8,DRAG=C.E;
// Speed after the canopy starts opening at t=0 (s → m/s).
export function chuteSpeed(t){if(t<=INFLATE)return V0-1.5*t;const b=Math.atanh(VT/(V0-1.5*INFLATE));return VT/Math.tanh(G*(t-INFLATE)/VT+b);}
function fallen(t,steps=80){let s=0;for(let i=0;i<steps;i++){const a=t*i/steps,b=t*(i+1)/steps;s+=(chuteSpeed(a)+chuteSpeed(b))/2*(b-a);}return s;}
const kmh=v=>v*3.6;
// Absolute time within the scene, so clouds keep moving smoothly across sentences.
const sceneT=ctx=>(ctx.scene?.captions?.[ctx.k]?.start??0)+ctx.t;

export function sky(){return `<defs><linearGradient id="dxsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#153a66"/><stop offset="1" stop-color="#2d6aa3"/></linearGradient></defs><rect x="0" y="0" width="1200" height="515" rx="18" fill="url(#dxsky)"/>`;}
const CLOUDS=[[120,80,1],[520,210,1.3],[860,40,.9],[300,390,1.1],[980,300,1.2],[640,520,1],[80,610,1.2],[760,700,.9]];
export function clouds(offset){
 return CLOUDS.map(([x,y,s])=>{const Y=((y-offset)%760+760)%760-120;return `<g opacity=".22" transform="translate(${x} ${Y.toFixed(1)}) scale(${s})"><circle cx="0" cy="0" r="34" fill="#fff"/><circle cx="36" cy="-12" r="42" fill="#fff"/><circle cx="78" cy="2" r="30" fill="#fff"/><rect x="0" y="0" width="80" height="30" fill="#fff"/></g>`;}).join('');
}
// Belly-down freefall pose, seen from the side.
export function diver(x,y,s=1){
 const L=(a,b,c,d)=>line(x+a*s,y+b*s,x+c*s,y+d*s,{color:'#ffcf9e',w:9*s});
 return L(24,-2,44,-30)+L(18,-2,2,-32)+L(-30,-2,-54,-24)+L(-24,-2,-40,-32)
  +`<ellipse cx="${x}" cy="${y}" rx="${42*s}" ry="${15*s}" fill="#ff8a3d" stroke="#ffd1a8" stroke-width="2"/>`
  +`<circle cx="${x+50*s}" cy="${y-2*s}" r="${13*s}" fill="#ffe0bf"/><path d="M${x+38*s} ${y-6*s} a${13*s} ${13*s} 0 0 1 ${25*s} 0" fill="#3a6ea8"/>`;
}
// Upright under an opening canopy (inflate 0..1).
export function hanger(x,y,inflate=1,s=1){
 const w=(60+170*smooth(inflate))*s,h=(20+70*smooth(inflate))*s,top=y-(150+40*inflate)*s;
 const canopy=`<path d="M${x-w} ${top+h} Q${x-w} ${top-h*.6} ${x} ${top-h*.7} Q${x+w} ${top-h*.6} ${x+w} ${top+h} Q${x} ${top+h*.55} ${x-w} ${top+h} Z" fill="#ff6b6b" stroke="#ffd0d0" stroke-width="2"/>`
  +[-1,-.5,0,.5,1].map(k=>line(x+k*w,top+h+(Math.abs(k)<1?-h*.1:0),x+k*6*s,y-40*s,{color:'#e8eef8',w:1.5,opacity:.8})).join('');
 const body=`<ellipse cx="${x}" cy="${y}" rx="${14*s}" ry="${34*s}" fill="#ff8a3d" stroke="#ffd1a8" stroke-width="2"/><circle cx="${x}" cy="${y-46*s}" r="${13*s}" fill="#ffe0bf"/>`+line(x-8*s,y+30*s,x-12*s,y+62*s,{color:'#ffcf9e',w:8*s})+line(x+8*s,y+30*s,x+12*s,y+62*s,{color:'#ffcf9e',w:8*s})+line(x-12*s,y-24*s,x-8*s,y-60*s,{color:'#ffcf9e',w:7*s})+line(x+12*s,y-24*s,x+8*s,y-60*s,{color:'#ffcf9e',w:7*s});
 return canopy+body;
}
// Speedometer in km/h (0–220).
export function gauge(x,y,v,{r=92,title='落ちる速さ'}={}){
 const a=Math.PI*(1-clamp(v/220)),nx=x+(r-14)*Math.cos(a),ny=y-(r-14)*Math.sin(a);
 let s=`<path d="M${x-r} ${y} A${r} ${r} 0 0 1 ${x+r} ${y}" fill="#0b1122" fill-opacity=".75" stroke="${C.dim}" stroke-width="3"/>`;
 for(let k=0;k<=220;k+=20){const b=Math.PI*(1-k/220),long=k%100===0;s+=line(x+(r-(long?18:10))*Math.cos(b),y-(r-(long?18:10))*Math.sin(b),x+r*Math.cos(b),y-r*Math.sin(b),{color:C.dim,w:long?3:1.5});}
 s+=line(x,y,nx,ny,{color:C.hi,w:5})+dot(x,y,8,C.hi);
 return s+label(title,x,y-r-16,{size:24,color:C.ink,anchor:'middle'})+label(`時速 ${Math.round(v)} km`,x,y+42,{size:32,color:C.hi,anchor:'middle',weight:700});
}
export function forceArrows(x,y,dragRatio,{g=120,labels=true}={}){
 const d=Math.min(dragRatio,2.3)*g;
 return arrow(x-34,y,x-34,y+g,{color:C.F,w:8,head:22})+arrow(x+34,y,x+34,y-d,{color:DRAG,w:8,head:22})
  +(labels?label('重力',x-50,y+g+10,{size:28,color:C.F,anchor:'end'})+rect(x+44,y-Math.min(d,110)-8,150,38,{fill:'#0b1122',fo:.75,sw:0,rx:8})+label('空気の抵抗',x+52,y-Math.min(d,110)+20,{size:28,color:DRAG}):'');
}
export function card(x,y,w,h,text,{color=C.dim,fill='#0b1122',fo=.85,size=30,hi=0}={}){
 return rect(x,y,w,h,{fill:hi?C.hi:fill,fo:hi?.18:fo,stroke:hi?C.hi:color,sw:hi?4:2,rx:16})+label(text,x+26,y+h/2+size*.36,{size,color:hi?C.hi:C.ink,weight:hi?700:400});
}

export const drag2Diagrams={
 'dx-dive':(p,ctx)=>{const T=sceneT(ctx);return sky()+clouds(T*260)+diver(430,250+6*Math.sin(T*3),1.5)+gauge(1000,300,200+2*Math.sin(T*7))+label(`高さ ${Math.round(3000-55.6*T)} m`,70,70,{size:30,color:C.ink});},
 'dx-dive:steady':(p,ctx)=>{const T=sceneT(ctx);return sky()+clouds(T*260)+diver(430,250+6*Math.sin(T*3),1.5)+gauge(1000,300,200+2*Math.sin(T*7))+label(`高さ ${Math.round(3000-55.6*T)} m`,70,70,{size:30,color:C.ink})
  +fade(seg(p,.05,.3),forceArrows(430,250,1))+fade(seg(p,.4,.65),card(640,40,300,70,'同じ大きさ',{size:30})+label('→ もう速くならない',790,150,{size:28,color:C.hi,anchor:'middle'}));},
 'dx-quiz':(p,ctx)=>{
  const T=sceneT(ctx),q=ctx.cue,se=clamp((ctx.dur-(q.pause??0)-.12)/ctx.dur),inCount=p>se;
  let s=sky()+clouds(T*260)+fade(.55,diver(300,260,1.4))+label('パラシュートを開くと…？',300,110,{size:34,color:C.hi,anchor:'middle',weight:700});
  ['A　速さは そのまま','B　もっと 速くなる','C　落ちながら 遅くなる'].forEach((t,i)=>{const g=seg(p,.15+i*.12,.3+i*.12);s+=fade(g,card(640+40*(1-g),90+i*120,500,90,t,{size:32}));});
  if(inCount){const u=(p-se)/Math.max(.01,1-se),n=3-Math.floor(u*3);if(n>=1){const f=(u*3)%1;s+=`<circle cx="300" cy="400" r="${60+10*(1-f)}" fill="#0b1122" fill-opacity=".7" stroke="${C.hi}" stroke-width="4"/>`+label(String(n),300,425,{size:70,color:C.hi,anchor:'middle',weight:700});}}
  return s;
 },
 'dx-open':(p,ctx)=>{
  const t=Math.min(ctx.t,5.5),v=kmh(chuteSpeed(t)),inflate=clamp(t/INFLATE),off=fallen(t)*18+sceneT(ctx)*0;
  let s=sky()+clouds(off*5+400)+hanger(320,330,inflate,1.1)+gauge(1000,300,v);
  s+=fade(1-seg(ctx.t,1.8,2.4),card(640,40,500,90,'C　落ちながら 遅くなる',{hi:1,size:32})+label('正解！',1150,40,{size:30,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(ctx.t,2.2,2.8),label('高さは 下がり続けているのに…',700,90,{size:28,color:C.ink})+label('速さは どんどん下がる',700,135,{size:30,color:C.hi,weight:700}));
  return s;
 },
 'dx-car':(p,ctx)=>{
  const v=20+80*smooth(clamp(ctx.t/Math.max(1,ctx.dur-2))),T=sceneT(ctx),F=(v/100)**2;
  let s=`<rect x="0" y="0" width="1200" height="515" rx="18" fill="#12203a"/>`+rect(0,400,1200,115,{fill:'#2a2f3a',fo:1,sw:0,rx:0});
  for(let k=0;k<8;k++){const X=((k*190-T*v*9)%1330+1330)%1330-130;s+=rect(X,452,90,10,{fill:'#e8eef8',fo:.7,sw:0,rx:3});}
  // car body
  s+=`<path d="M260 390 L300 300 L560 290 L660 330 L760 340 L780 390 Z" fill="#3b82c4" stroke="#bfe0ff" stroke-width="3"/>`+rect(330,305,190,45,{fill:'#bfe8ff',fo:.35,rx:8})+ring(340,395,34,{color:'#dfe7f2',w:6,fill:'#1a1f29'})+ring(700,395,34,{color:'#dfe7f2',w:6,fill:'#1a1f29'});
  // hand out of the window, pushed back by the air
  s+=line(470,318,560,258,{color:'#ffcf9e',w:14})+`<ellipse cx="575" cy="248" rx="22" ry="12" fill="#ffe0bf" transform="rotate(-30 575 248)"/>`;
  s+=arrow(760,248,760-260*Math.min(1.1,F)-8,248,{color:DRAG,w:9,head:24})+label('手を押す 空気の力',900,200,{size:28,color:DRAG,anchor:'middle'});
  return s+label(`時速 ${Math.round(v)} km`,90,80,{size:40,color:C.hi,weight:700})+fade(seg(p,.55,.8),label('速いほど、強く押される',90,140,{size:30,color:C.ink}));
 },
 'dx-tug:before':(p,ctx)=>tug(p,ctx,'before'),
 'dx-tug:open':(p,ctx)=>tug(p,ctx,'open'),
 'dx-tug:settle':(p,ctx)=>tug(p,ctx,'settle'),
 'dx-graph:down':p=>vgraph(p,1),'dx-graph:up':p=>vgraph(p,2),'dx-graph:gap':p=>vgraph(p,3),
 'dx-formula':(p)=>{
  const parts=['v','=','v_\\infty','+','(v_0-v_\\infty)','\\,e^{-t/\\tau}'],size=62,gap=20;
  const w=parts.map(t=>texWidth(t,size));let x=600-(w.reduce((a,b)=>a+b,0)+gap*(parts.length-1))/2;const X=w.map(ww=>{const c=x+ww/2;x+=ww+gap;return c;});
  let s=label('抵抗が速さに比例する、簡単なモデル',600,60,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,0,.12),parts.map((t,i)=>tex(t,X[i],220,{size})).join(''));
  const marks=[[2,'ゴールの速さ',C.hi,.15],[4,'最初のずれ',C.x,.35],[5,'だんだん消える',DRAG,.55]];
  for(const [i,txt,col,a] of marks){const g=seg(p,a,a+.15);s+=fade(g,brace(X[i]-w[i]/2,X[i]+w[i]/2,265,{color:col,text:txt,size:30}))+fade(g*.9,highlight(X[i]-w[i]/2-8,150,w[i]+16,100,1,col));}
  // tiny picture of the meaning: goal line + shrinking gap
  const g2=seg(p,.72,.95);if(g2>0){const A=axes({x:380,y:500,w:440,h:120,xmax:5,ymax:10,g:g2});s+=A.svg+fade(g2,line(A.X(0),A.Y(3),A.X(5),A.Y(3),{color:C.hi,w:3,dash:'9 7'}))+A.plot(t=>3+6*Math.exp(-t),{p:g2,color:C.v,w:4});}
  return s;
 },
 'dx-v2:curve':(p)=>{
  const A=axes({x:170,y:450,w:720,h:340,xmax:2.4,ymax:5,xlabel:'速さ',ylabel:'空気の抵抗',xticks:[],yticks:[],grid:false,g:seg(p,0,.2)});
  let s=A.svg+A.plot(v=>v*v,{from:0,to:2.2,p:seg(p,.15,.45),color:DRAG,w:5});
  const g1=seg(p,.45,.6),g2=seg(p,.62,.8);
  s+=fade(g1,line(A.X(1),A.Y(0),A.X(1),A.Y(1),{color:C.v,w:3,dash:'6 6'})+dot(A.X(1),A.Y(1),10,C.hi)+label('1倍',A.X(1),A.Y(0)+36,{size:28,color:C.v,anchor:'middle'})+label('1',A.X(1)-20,A.Y(1)-14,{size:28,color:DRAG,anchor:'end'}));
  s+=fade(g2,line(A.X(2),A.Y(0),A.X(2),A.Y(4),{color:C.v,w:3,dash:'6 6'})+dot(A.X(2),A.Y(4),10,C.hi)+label('2倍',A.X(2),A.Y(0)+36,{size:28,color:C.v,anchor:'middle'})+label('4',A.X(2)-20,A.Y(4)-14,{size:28,color:DRAG,anchor:'end'}));
  return s+fade(seg(p,.8,.95),card(900,90,260,100,'速さ2倍',{size:30})+label('→ 抵抗 4倍',1030,240,{size:32,color:C.hi,anchor:'middle',weight:700}));
 },
 'dx-v2:chute':(p)=>{
  const A=axes({x:150,y:450,w:760,h:330,xmax:230,ymax:2.2,xlabel:'時速 km',ylabel:'抵抗（重力を1とする）',xticks:[20,100,200],yticks:[1,2],grid:true});
  let s=A.svg+line(A.X(0),A.Y(1),A.X(225),A.Y(1),{color:C.F,w:3,dash:'10 7'})+label('重力',A.X(225)+8,A.Y(1)+8,{size:28,color:C.F});
  s+=A.plot(v=>(v/200)**2,{from:0,to:225,color:DRAG,w:5});
  s+=fade(1,dot(A.X(200),A.Y(1),10,C.hi)+label('パラシュートなし',A.X(150),A.Y(1.55),{size:26,color:DRAG,anchor:'middle'}));
  const g=seg(p,.1,.45);
  s+=A.plot(v=>(v/20)**2,{from:0,to:Math.min(30,20*Math.sqrt(2.2)),p:g,color:'#ff6b6b',w:5});
  s+=fade(seg(p,.35,.55),dot(A.X(20),A.Y(1),10,C.hi)+label('あり（抵抗 約100倍）',A.X(40),A.Y(1.9),{size:26,color:'#ff6b6b'}));
  s+=fade(seg(p,.55,.75),arrow(A.X(190),A.Y(.55),A.X(32),A.Y(.55),{color:C.hi,w:5,head:18})+label('つり合う速さ',A.X(110),A.Y(.55)-14,{size:26,color:C.hi,anchor:'middle'}));
  return s+fade(seg(p,.7,.9),card(940,70,240,150,'',{})+tex('\\sqrt{100}=10',1060,125,{size:38})+label('速さは 10分の1',1060,195,{size:28,color:C.hi,anchor:'middle',weight:700}));
 },
 'dx-land':(p,ctx)=>{
  const y=150+220*smooth(clamp(ctx.t/Math.max(1,ctx.dur-1.2)));
  let s=sky()+rect(0,440,1200,75,{fill:'#3f7d4a',fo:1,sw:0,rx:0})+hanger(430,Math.min(y,378),1,1)+gauge(1000,300,20);
  return s+fade(seg(p,.1,.4),label('時速 200 km',700,110,{size:34,color:C.dim})+arrow(915,100,990,100,{color:C.hi,w:5,head:16})+label('20 km',1005,110,{size:40,color:C.hi,weight:700}))+fade(seg(p,.55,.8),label('安全に 着地できる',700,180,{size:32,color:C.ink}));
 },
 'dx-end':(p)=>{
  let s=`<rect x="0" y="0" width="1200" height="515" rx="18" fill="#101c35" stroke="${C.hi}" stroke-opacity=".35" stroke-width="2"/>`;
  const A=axes({x:760,y:440,w:360,h:170,xmax:5,ymax:10,g:0});
  s+=line(A.X(0),A.Y(4),A.X(5),A.Y(4),{color:C.hi,w:3,dash:'9 7'})+A.plot(t=>4+5.5*Math.exp(-1.2*t),{p:seg(p,.1,.5),color:C.v,w:5})+A.plot(t=>4*(1-Math.exp(-1.2*t)),{p:seg(p,.1,.5),color:C.x,w:5});
  s+=fade(seg(p,0,.15),label('今日のひとこと',80,110,{size:28,color:C.dim}));
  s+=fade(seg(p,.05,.25),label('終端速度は「ゴールの速さ」',80,220,{size:52,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.5),label('速すぎても、遅すぎても、',80,310,{size:36,color:C.ink})+label('そこへ近づいていく',80,365,{size:36,color:C.ink}));
  [[700,80],[1130,150],[640,420],[1150,430]].forEach(([x,y],i)=>{const g=seg(p,.2+i*.1,.35+i*.1);s+=fade(g*(1-seg(p,.6+i*.08,.8+i*.08)),`<path d="M${x} ${y-14} L${x+4} ${y-4} L${x+14} ${y} L${x+4} ${y+4} L${x} ${y+14} L${x-4} ${y+4} L${x-14} ${y} L${x-4} ${y-4} Z" fill="${C.hi}"/>`);});
  return s;
 },
};

function tug(p,ctx,stage){
 // Before: no canopy, drag = gravity. Open: canopy, drag ≈ 100×. Settle: drag falls back to gravity.
 const t=stage==='before'?0:stage==='open'?Math.min(ctx.t*.35,.9):.9+4.2*smooth(clamp(ctx.t/Math.max(1,ctx.dur-2.2)));
 const v=stage==='before'?V0:chuteSpeed(t),ratio=stage==='before'?1:(v/VT)**2*(t<INFLATE?smooth(t/INFLATE):1)+(t<INFLATE?1-smooth(t/INFLATE):0);
 let s=sky()+clouds(sceneT(ctx)*v*4.5);
 s+=stage==='before'?diver(330,300,1.4):hanger(330,330,clamp(t/INFLATE),1);
 s+=forceArrows(stage==='before'?330:330,stage==='before'?300:300,ratio,{g:110});
 // Tug-of-war meter on the right: green = gravity, orange = drag.
 const bx=720,by=120,W=150;
 s+=rect(bx-10,by-60,470,300,{fill:'#0b1122',fo:.8,stroke:C.dim,rx:16})+label('力くらべ',bx+10,by-22,{size:28,color:C.ink});
 s+=label('重力',bx+10,by+36,{size:28,color:C.F})+rect(bx+100,by+10,W,34,{fill:C.F,fo:.8,sw:0,rx:6});
 const dw=Math.min(ratio,2.1)*W;
 s+=label('抵抗',bx+10,by+96,{size:28,color:DRAG})+rect(bx+100,by+70,dw,34,{fill:DRAG,fo:.8,sw:0,rx:6})+(ratio>2.1?label(`重力の約${Math.round(ratio/5)*5}倍`,bx+100,by+134,{size:24,color:DRAG}):'');
 const net=ratio-1,netTxt=Math.abs(net)<.06?'つり合い：速さは一定':net>0?'上向きの力 → ブレーキ':'下向きの力 → 加速';
 s+=label(netTxt,bx+10,by+184,{size:30,color:Math.abs(net)<.06?C.hi:C.ink,weight:700});
 s+=label(`時速 ${Math.round(kmh(v))} km`,bx+10,by+226,{size:30,color:C.hi});
 if(stage==='settle')s+=fade(seg(p,.72,.9),label('新しい終端速度',330,60,{size:34,color:C.hi,anchor:'middle',weight:700}));
 return s;
}
function vgraph(p,stage){
 const A=axes({x:150,y:455,w:760,h:360,xmax:5,ymax:10,xlabel:'時間',ylabel:'落ちる速さ',g:stage===1?seg(p,0,.2):1});
 let s=A.svg+fade(stage===1?seg(p,.1,.3):1,line(A.X(0),A.Y(3),A.X(5),A.Y(3),{color:C.hi,w:4,dash:'12 8'})+label('ゴール（終端速度）',A.X(5)+10,A.Y(3)+8,{size:28,color:C.hi}));
 const up=t=>3+6.5*Math.exp(-1.1*t),lo=t=>3*(1-Math.exp(-1.1*t));
 const pu=stage===1?seg(p,.25,.85):1;
 s+=A.plot(up,{to:5*pu,color:C.v,w:5})+label('パラシュートを開く',A.X(0)+14,A.Y(9.5)+8,{size:26,color:C.v});
 if(stage===1)s+=dot(A.X(5*pu),A.Y(up(5*pu)),11,C.hi);
 if(stage>=2){const pl=stage===2?seg(p,.1,.7):1;s+=A.plot(lo,{to:5*pl,color:C.x,w:5})+fade(stage===2?seg(p,.05,.2):1,label('止まった状態から',A.X(.3),A.Y(.4)-16,{size:26,color:C.x}));if(stage===2)s+=dot(A.X(5*pl),A.Y(lo(5*pl)),11,C.hi)+fade(seg(p,.7,.9),label('雨粒も同じ',A.X(3.2),A.Y(1.6),{size:28,color:C.x}));}
 if(stage===3){
  [0,1,2,3].forEach((t,i)=>{const g=seg(p,.05+i*.15,.2+i*.15);s+=fade(g,line(A.X(t),A.Y(3),A.X(t),A.Y(up(t)),{color:DRAG,w:8})+label(`差`,A.X(t)+10,(A.Y(3)+A.Y(up(t)))/2+8,{size:24,color:DRAG}));});
  s+=fade(seg(p,.7,.9),card(620,40,420,80,'近づくほど、ゆっくり',{size:32,color:C.hi}));
 }
 return s;
}
