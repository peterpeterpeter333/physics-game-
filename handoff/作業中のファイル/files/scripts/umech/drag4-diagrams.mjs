// 空気抵抗・上級（作り直し3）— decode one "unreadable" formula piece by piece.
// v = v∞ + (v0 − v∞) e^(−t/τ) stays at the top ("今日解読する式"); every answered
// question lights its part. Lesics-style: bright sky, labels and formulas placed ON the
// scene as white call-outs. Numbers: m=80 kg, k=160 → v∞=5 m/s, v0=50 m/s, gap 45, τ=0.5 s.
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,axes,tex,texWidth} from './anim.mjs';
import {hanger,diver,gauge} from './drag2-diagrams.mjs';
import {drag3Diagrams as drag3} from './drag3-diagrams.mjs';

const INK='#10203a',DRAG=C.E,sceneT=ctx=>(ctx.scene?.captions?.[ctx.k]?.start??0)+ctx.t;
const voiceEnd=ctx=>ctx.dur-(ctx.cue.pause??0)-.12;
const opened=t=>5+45*Math.exp(-2*t);

// ---- scene pieces -------------------------------------------------------------------
function sky(){return `<defs><linearGradient id="dzsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f86cf"/><stop offset="1" stop-color="#b3dbf7"/></linearGradient></defs><rect x="0" y="0" width="1200" height="515" rx="18" fill="url(#dzsky)"/>`;}
const CL=[[140,120,1],[520,260,1.3],[900,90,1],[300,430,1.1],[1020,360,1.2],[700,600,1],[60,700,1.2]];
function clouds(off){return CL.map(([x,y,s])=>{const Y=((y-off)%780+780)%780-130;return `<g opacity=".55" transform="translate(${x} ${Y.toFixed(1)}) scale(${s})"><circle cx="0" cy="0" r="34" fill="#fff"/><circle cx="36" cy="-12" r="42" fill="#fff"/><circle cx="78" cy="2" r="30" fill="#fff"/><rect x="0" y="0" width="80" height="30" fill="#fff"/></g>`;}).join('');}
const wlen=(s,size)=>[...s].reduce((a,ch)=>a+(/[\x20-\x7e]/.test(ch)?.6:1)*size,0);
// A white word box on the scene (single words / short phrases only).
export function word(s,x,y,{size=32,color=INK,anchor='start',bg='#ffffff',g=1}={}){
 const w=wlen(s,size)+36,h=size*1.6,left=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return fade(g,`<rect x="${left}" y="${y-h*.72}" width="${w}" height="${h}" rx="12" fill="${bg}" fill-opacity=".94" stroke="${color}" stroke-opacity=".35" stroke-width="2"/>`+label(s,left+18,y+size*.1,{size,color,weight:700}));
}
function callout(x,y,w,h,inner,g=1){return fade(g,`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#ffffff" fill-opacity=".95" stroke="#2b3d5e" stroke-opacity=".25" stroke-width="2"/>`+inner);}
const ink=(src,x,y,size=40,anchor='start')=>tex(src,x,y,{size,anchor,color:INK});
const check=(x,y,g)=>fade(g,ring(x,y,26,{color:'#1c9c6b',w:4,fill:'#ffffff'})+draw([[x-12,y],[x-3,y+10],[x+14,y-10]],clamp(g*1.4),{color:'#1c9c6b',w:5}));

// Speedometer in m/s with the goal mark and the gap band between needle and goal.
function msGauge(x,y,v,{r=120,goal=5,band=false,title='落ちる速さ（秒速）',max=60}={}){
 const ang=u=>Math.PI*(1-clamp(u/max)),pt=(u,R)=>[x+R*Math.cos(ang(u)),y-R*Math.sin(ang(u))];
 let s=`<path d="M${x-r} ${y} A${r} ${r} 0 0 1 ${x+r} ${y}" fill="#0b1122" fill-opacity=".85" stroke="#ffffff" stroke-width="3"/>`;
 if(band&&v>goal+.2){const a=pt(goal,r-10),b=pt(v,r-10);s+=`<path d="M${pt(goal,r-30).join(' ')} L${a.join(' ')} A${r-10} ${r-10} 0 0 1 ${b.join(' ')} L${pt(v,r-30).join(' ')} A${r-30} ${r-30} 0 0 0 ${pt(goal,r-30).join(' ')} Z" fill="${C.x}" fill-opacity=".85"/>`;}
 for(let k=0;k<=max;k+=10){const [a,b]=[pt(k,r-16),pt(k,r)];s+=line(a[0],a[1],b[0],b[1],{color:'#c9d6ea',w:2})+label(String(k),...pt(k,r-40).map((q,i)=>i?q+8:q),{size:18,color:'#c9d6ea',anchor:'middle'});}
 const g=pt(goal,r+6);s+=line(...pt(goal,r-34),...g,{color:C.hi,w:5})+label('ゴール',g[0]-6,g[1]-10,{size:22,color:C.hi,anchor:'end',weight:700});
 const n=pt(v,r-24);s+=line(x,y,n[0],n[1],{color:'#ff5f6d',w:5})+dot(x,y,8,'#ff5f6d');
 return s+label(title,x,y+36,{size:22,color:'#ffffff',anchor:'middle'})+label(`${fmt(v,v<10?1:0)} m/s`,x,y+74,{size:32,color:'#ffffff',anchor:'middle',weight:700});
}

// ---- the formula being decoded ---------------------------------------------------------
const PARTS=[['v',null],['=',null],['v_\\infty','goal'],['+',null],['(v_0-v_\\infty)','gap'],['\\,e^{-t/\\tau}','decay']];
const META={goal:[C.hi,'ゴール'],gap:[C.x,'最初の差'],decay:[C.E,'縮む割合']};
export function formulaLayout(size,cx=600){const gap=size*.35,w=PARTS.map(([t])=>texWidth(t,size));let x=cx-(w.reduce((a,b)=>a+b,0)+gap*(w.length-1))/2;return PARTS.map(([t,key],i)=>{const r={t,key,x,w:w[i],c:x+w[i]/2};x+=w[i]+gap;return r;});}
function formula(lit,{y=52,size=40,focus=null,pulse=0,labels=true,dimAll=false,glow=null}={}){
 const L=formulaLayout(size);let s='';
 for(const q of L){const on=!dimAll&&(!q.key||lit.includes(q.key)),col=q.key?META[q.key][0]:C.ink;
  if(q.key&&(focus===q.key||glow===q.key))s+=`<rect x="${q.x-10}" y="${y-size*.9}" width="${q.w+20}" height="${size*1.5}" rx="10" fill="${col}" fill-opacity="${.18+.18*pulse}" stroke="${col}" stroke-width="3"/>`;
  s+=on?tex(q.t,q.c,y,{size}):tex(q.t,q.c,y,{size,color:'#5f6f8c',auto:false});
  if(labels&&q.key&&lit.includes(q.key))s+=label(META[q.key][1],q.c,y+size*1.2,{size:Math.max(22,size*.52),color:col,anchor:'middle',weight:700});}
 return s;
}
function decoder(ctx,p){const q=ctx.cue,lit=q.decode??[],focus=q.focus??null;
 return `<rect x="150" y="4" width="900" height="122" rx="14" fill="#0b1122" fill-opacity=".97"/>`+label('今日 解読する式',168,32,{size:20,color:C.dim})+formula(lit,{y:62,size:44,focus,pulse:focus?.5+.5*Math.sin(p*18):0});}
const partX=(key,size=44)=>formulaLayout(size).find(q=>q.key===key).c;

// A second jumper (tandem) hanging in front of the first.
function body(x,y,k){return `<ellipse cx="${x}" cy="${y}" rx="${14*k}" ry="${34*k}" fill="#4aa3df" stroke="#d7ecfa" stroke-width="2"/><circle cx="${x}" cy="${y-46*k}" r="${13*k}" fill="#ffe0bf"/>`+line(x-8*k,y+30*k,x-12*k,y+62*k,{color:'#ffcf9e',w:8*k})+line(x+8*k,y+30*k,x+12*k,y+62*k,{color:'#ffcf9e',w:8*k});}
// Speedometer on a dark card so it reads on the bright sky.
const gaugeCard=(x,y,v)=>`<rect x="${x-125}" y="${y-140}" width="250" height="200" rx="16" fill="#0b1122" fill-opacity=".85"/>`+gauge(x,y,v);
function qcard(n,text,p){return sky()+clouds(40)+`<rect x="0" y="0" width="1200" height="515" fill="#0b1122" fill-opacity=".25"/>`+callout(250,170,700,250,label(`問い${n}`,600,245,{size:34,color:C.x,anchor:'middle',weight:700})+text.map((t,i)=>label(t,600,315+i*52,{size:38,color:INK,anchor:'middle',weight:700})).join(''),seg(p,0,.25));}

export const drag4Diagrams={
 'dz-open':(p,ctx)=>{
  const t=ctx.t,open=3.0,v=t<open?50:opened(Math.max(0,t-open-.2)),T=sceneT(ctx);
  let s=sky()+clouds(T*40+Math.min(t,open)*260+Math.max(0,t-open)*60);
  s+=t<open?diver(420,260+6*Math.sin(t*3),1.5):hanger(400,340,clamp((t-open)/.8),1.05);
  s+=gaugeCard(1000,300,v*3.6);
  s+=word('落ちているのに',620,120,{size:32,g:clamp((t-5)/.4)})+word('遅くなる！',680,190,{size:36,color:'#c0392b',g:clamp((t-6)/.4)});
  return s+word('時速18kmで 落ち着く',620,440,{size:30,g:clamp((t-8.5)/.4)});
 },
 'dz-reveal':(p)=>{const g=smooth(clamp(p/.35));
  return `<rect x="0" y="0" width="1200" height="515" rx="18" fill="#0b1122"/>`+`<g opacity="${g}" transform="translate(600 260) scale(${.85+.15*g}) translate(-600 -260)">${formula([],{y:260,size:66,labels:false})}</g>`
   +[[220,150],[980,140],[300,390],[930,380]].map(([x,y],i)=>fade(seg(p,.2+i*.1,.35+i*.1)*(1-seg(p,.7,.9)),`<path d="M${x} ${y-14} L${x+4} ${y-4} L${x+14} ${y} L${x+4} ${y+4} L${x} ${y+14} L${x-4} ${y+4} L${x-14} ${y} L${x-4} ${y-4} Z" fill="${C.hi}"/>`)).join('');},
 'dz-mystery':(p)=>{let s=`<rect x="0" y="0" width="1200" height="515" rx="18" fill="#0b1122"/>`+formula([],{y:260,size:66,labels:false,dimAll:true});
  formulaLayout(66).filter(q=>q.t!=='='&&q.t!=='+').forEach((q,i)=>{const g=seg(p,.05+i*.12,.2+i*.12),b=6*Math.sin(p*14+i);s+=fade(g,label('？',q.c,170+b,{size:56,color:'#ff8f9b',anchor:'middle',weight:700}));});
  return s+fade(seg(p,.55,.75),label('今は 読めなくて 当然',600,420,{size:34,color:C.dim,anchor:'middle'}));},
 'dz-mystery:goal':(p)=>{const u=smooth(seg(p,0,.45)),y=mix(260,62,u),size=mix(66,44,u);
  let s=`<rect x="0" y="0" width="1200" height="515" rx="18" fill="#0b1122"/>`+fade(u,`<rect x="150" y="4" width="900" height="122" rx="14" fill="#16223d"/>`+label('今日 解読する式',168,32,{size:20,color:C.dim}));
  s+=formula([],{y,size,labels:false,dimAll:true});
  return s+fade(seg(p,.45,.65),callout(270,200,660,200,label('この動画のゴール',600,265,{size:28,color:C.dim,anchor:'middle'})+label('この式を、自分の言葉で読む',600,335,{size:40,color:INK,anchor:'middle',weight:700})));},

 'dz-q1':(p,ctx)=>qcard(1,['最後に落ち着く速さは、','何で決まる？'],p)+decoder(ctx,p),
 'dz-q2':(p,ctx)=>qcard(2,['開いた瞬間、ゴールと','どれだけずれている？'],p)+decoder(ctx,p),
 'dz-q3':(p,ctx)=>qcard(3,['このずれは、','どんなふうに縮む？'],p)+decoder(ctx,p),
 'dz-forces':(p,ctx)=>{const T=sceneT(ctx);
  let s=sky()+clouds(T*50)+hanger(380,360,1,1)+arrow(350,330,350,450,{color:'#1c9c6b',w:9,head:24,g:seg(p,.05,.25)})+arrow(410,330,410,210,{color:'#e8742a',w:9,head:24,g:seg(p,.3,.5)});
  s+=fade(seg(p,.1,.3),word('重力',150,440,{size:32,color:'#1c9c6b'})+callout(240,410,90,56,ink('mg',285,448,38,'middle')));
  s+=fade(seg(p,.35,.55),word('空気の抵抗',440,200,{size:32,color:'#c25a14'}));
  s+=fade(seg(p,.7,.9),callout(700,160,420,140,label('速さに比例',910,210,{size:30,color:INK,anchor:'middle',weight:700})+ink('kv',910,265,48,'middle'))+line(700,230,450,200,{color:'#ffffff',w:3,dash:'8 8'}));
  return s+decoder(ctx,p);
 },
 'dz-balance':(p,ctx)=>{const T=sceneT(ctx);
  let s=sky()+clouds(T*50)+hanger(330,360,1,1)+arrow(300,330,300,450,{color:'#1c9c6b',w:9,head:24})+arrow(360,330,360,210,{color:'#e8742a',w:9,head:24});
  s+=word('つり合い',230,500,{size:32,g:seg(p,.05,.2)});
  s+=callout(620,130,540,350,ink('mg=kv_\\infty',890,210,48,'middle')+fade(seg(p,.35,.5),arrow(890,250,890,300,{color:INK,w:4,head:14}))+fade(seg(p,.45,.65),ink('v_\\infty=\\dfrac{mg}{k}',890,390,54,'middle')),seg(p,.1,.3));
  return s+fade(seg(p,.1,.3),label('∞：ゴールでの速さ',640,470,{size:22,color:'#3a4a66'}))+decoder(ctx,p);
 },
 'dz-goal':(p,ctx)=>{
  let s=sky()+clouds(80)+msGauge(300,370,5,{r:130})+callout(560,140,600,300,ink('v_\\infty=\\dfrac{800}{160}=5\\ \\mathrm{m/s}',860,240,48,'middle')+label('時速 18 km',860,340,{size:40,color:INK,anchor:'middle',weight:700})+check(1080,330,seg(p,.4,.55)),seg(p,.05,.25));
  const g=seg(p,.55,.8);s+=fade(g,line(300,230,partX('goal'),126,{color:C.hi,w:4,dash:'9 7'}));
  return s+decoder(ctx,p);
 },
 'dz-gap':(p,ctx)=>{
  const g=seg(p,.2,.5);let s=sky()+clouds(80)+msGauge(420,380,50,{r:170,band:g>0});
  s+=fade(g,word('差 45',640,300,{size:40,color:'#0b6f8f'}));
  s+=callout(800,160,360,160,ink('50-5=45',980,245,48,'middle'),seg(p,.05,.25));
  s+=fade(seg(p,.6,.85),line(560,230,partX('gap'),126,{color:C.x,w:4,dash:'9 7'}));
  return s+decoder(ctx,p);
 },
 'dz-table':(p,ctx)=>{
  const rows=[[0,50,45],[.5,22,17],[1,11,6],[1.5,7,2]],x0=250,y0=190;
  let s=sky()+clouds(60)+callout(200,140,800,368,label('時間',x0,y0,{size:26,color:C.t})+label('速さ',x0+160,y0,{size:26,color:'#6c4fd8'})+label('ゴールとの差',x0+320,y0,{size:26,color:'#0b6f8f'}));
  rows.forEach(([t,v,g],i)=>{const at=2.6+[0,.8,1.5,2.1][i],gi=clamp((ctx.t-at)/.3),y=y0+66+i*68;
   s+=fade(gi,label(`${t} 秒`,x0,y,{size:32,color:INK})+label(String(v),x0+170,y,{size:36,color:'#6c4fd8',weight:700})+label(String(g),x0+330,y,{size:36,color:'#0b6f8f',weight:700})+rect(x0+400,y-28,7*g*gi,32,{fill:C.x,fo:.8,sw:0,rx:6}));
   if(i)s+=fade(gi,label('×約⅓',x0+700,y-30,{size:24,color:'#c0392b',weight:700}));});
  return s+decoder(ctx,p);
 },
 'dz-brake':(p,ctx)=>{
  // Gap and brake shrink together: the brake is k × gap.
  const u=smooth(clamp(ctx.t/Math.max(1,voiceEnd(ctx)))),t=2.2*u,v=opened(t),gap=v-5,T=sceneT(ctx);
  let s=sky()+clouds(T*40)+hanger(200,370,1,.92);
  const bx=540,by=470,H=5.4;s+=callout(450,145,290,360,'');
  s+=line(bx,by,bx,by-60*H,{color:'#8898b3',w:6})+label('速さ',bx,by+24,{size:22,color:INK,anchor:'middle'});
  s+=rect(bx-18,by-v*H,36,gap*H,{fill:C.x,fo:.85,sw:0,rx:4})+line(bx-30,by-5*H,bx+30,by-5*H,{color:'#d4a017',w:5})+label('ゴール',bx+36,by-5*H+8,{size:22,color:'#b7860b'});
  s+=label('差',bx-60,by-(v+5)/2*H+8,{size:28,color:'#0b6f8f',anchor:'end',weight:700});
  s+=arrow(660,by-10,660,by-10-gap*H,{color:'#d4a017',w:10,head:24})+label('ブレーキ',600,by-26-gap*H,{size:24,color:'#b7860b',weight:700});
  s+=callout(790,150,380,220,label('ブレーキ ＝ k × 差',980,210,{size:30,color:INK,anchor:'middle',weight:700})+ink('kv-mg=k\\,(v-v_\\infty)',980,300,34,'middle'),seg(p,.3,.5));
  return s+decoder(ctx,p);
 },
 'dz-rate':(p,ctx)=>{
  let s=sky()+clouds(60)+callout(40,140,540,365,'');
  const A=axes({x:100,y:470,w:400,h:270,xmax:2,ymax:50,xlabel:'時間',ylabel:'差',yticks:[45,6],g:1});
  const gap=t=>45*Math.exp(-2*t);s+=A.svg.replaceAll(C.dim,'#3a4a66')+A.plot(gap,{color:'#0b8fb5',w:5});
  const tan=(t0,g)=>{const y0=gap(t0),m=-2*y0,d=t0<.1?.07:.22;return fade(g,line(A.X(t0-d),A.Y(y0-m*d),A.X(t0+d),A.Y(y0+m*d),{color:'#c0392b',w:5})+dot(A.X(t0),A.Y(y0),9,'#c0392b'));};
  s+=tan(0,seg(p,.35,.5))+tan(1.03,seg(p,.6,.75));
  s+=callout(620,140,540,365,label('差が縮む速さ',890,190,{size:28,color:'#3a4a66',anchor:'middle'})+ink('\\dfrac{k}{m}=\\dfrac{160}{80}=2',890,260,36,'middle')+label('縮む速さ ＝ 2 × 差',890,330,{size:34,color:'#0b6f8f',anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('差 45 → 毎秒 90',890,385,{size:32,color:INK,anchor:'middle',weight:700}))+fade(seg(p,.6,.75),label('差 6 → 毎秒 12',890,435,{size:32,color:INK,anchor:'middle',weight:700}))+fade(seg(p,.8,.95),label('いつも 同じ割合',890,485,{size:30,color:'#c0392b',anchor:'middle',weight:700})),seg(p,.05,.25));
  return s+decoder(ctx,p);
 },
 'dz-coffee':(p,ctx)=>drag3['dy-coffee'](p,ctx),
 'dz-e':(p,ctx)=>{
  let s=sky()+clouds(60)+callout(40,140,560,365,label('タウごとの差',70,180,{size:24,color:'#3a4a66'}));
  [45,16.6,6.1,2.2].forEach((g,i)=>{const gi=seg(p,.35+i*.1,.45+i*.1),y=215+i*70;s+=fade(gi,label(i?`${i}τ後`:'はじめ',70,y+30,{size:26,color:C.t})+rect(180,y,7.5*g,40,{fill:C.x,fo:.85,sw:0,rx:6})+label(fmt(g,1),190+7.5*g,y+30,{size:26,color:'#0b6f8f',weight:700}));if(i)s+=fade(gi,label('×0.37',580,y-2,{size:22,color:'#c0392b',anchor:'end',weight:700}));});
  s+=callout(630,140,530,365,ink('e^{-t/\\tau}',895,220,60,'middle')+fade(seg(p,.1,.25),ink('e\\approx2.72',895,305,40,'middle'))+fade(seg(p,.25,.4),label('t＝τ のとき',700,390,{size:28,color:INK})+ink('e^{-1}\\approx0.37',960,385,38))+fade(seg(p,.6,.8),label('τ たつごとに ×0.37',895,470,{size:32,color:'#c0392b',anchor:'middle',weight:700})),seg(p,0,.15));
  return s+decoder(ctx,p);
 },
 'dz-tau':(p,ctx)=>{
  let s=sky()+clouds(60)+callout(240,140,720,300,ink('\\tau=\\dfrac{m}{k}=\\dfrac{80}{160}=0.5\\ \\mathrm{s}',600,250,50,'middle')+fade(seg(p,.4,.6),label('表の「0.5秒ごと」と同じ！',600,380,{size:34,color:'#1c7a52',anchor:'middle',weight:700}))+check(900,370,seg(p,.55,.7)),seg(p,.05,.25));
  s+=fade(seg(p,.7,.9),line(600,140,partX('decay'),126,{color:C.E,w:4,dash:'9 7'}));
  return s+decoder(ctx,p);
 },
 'dz-read':(p,ctx)=>{
  const hi=p<.12?null:p<.36?'goal':p<.6?'gap':'decay';
  let s=`<rect x="0" y="0" width="1200" height="515" rx="18" fill="#0b1122"/>`+formula(['goal','gap','decay'],{y:110,size:56,glow:hi});
  const A=axes({x:260,y:480,w:680,h:230,xmax:2,ymax:50,xlabel:'時間',ylabel:'速さ',g:1});
  const v=t=>5+45*Math.exp(-2*t),tt=hi==='decay'?2*seg(p,.62,.95):0;
  s+=A.svg+line(A.X(0),A.Y(5),A.X(2),A.Y(5),{color:C.hi,w:hi==='goal'?7:3,dash:'12 8'});
  s+=A.plot(v,{to:hi==='decay'?Math.max(.02,tt):2,color:C.v,w:4});
  s+=(hi==='gap'||hi==='decay')?line(A.X(tt),A.Y(5),A.X(tt),A.Y(v(tt)),{color:C.x,w:hi==='gap'?12:9}):'';
  return s+(hi==='goal'?label('ゴール 5',A.X(2)+10,A.Y(5)+8,{size:26,color:C.hi,weight:700}):'')+(hi==='gap'?label('最初の差 45',A.X(0)+20,A.Y(28),{size:26,color:C.x,weight:700}):'')+(hi==='decay'?label('0.5秒ごとに ×0.37',A.X(1),A.Y(30),{size:26,color:C.E,weight:700}):'');
 },
 'dz-check':(p,ctx)=>{
  let s=sky()+clouds(60)+gaugeCard(260,380,40)+callout(470,150,690,280,ink('5+45\\times0.37^2\\approx11\\ \\mathrm{m/s}',815,240,44,'middle')+fade(seg(p,.45,.65),label('時速 約40 km',815,340,{size:40,color:INK,anchor:'middle',weight:700}))+check(1060,330,seg(p,.6,.75)),seg(p,.05,.25));
  return s+decoder(ctx,p);
 },
 'dz-predict':(p,ctx)=>{
  const se=clamp(voiceEnd(ctx)/ctx.dur),T=sceneT(ctx);
  let s=sky()+clouds(T*40)+hanger(250,360,1,1)+body(282,372,.9);
  s+=word('二人乗り 160 kg',100,190,{size:30,g:seg(p,.05,.2)});
  s+=word('ゴールは？',640,220,{size:40,g:seg(p,.4,.55)})+word('縮み方は？',640,320,{size:40,g:seg(p,.55,.7)});
  if(p>se){const u=(p-se)/Math.max(.01,1-se),n=3-Math.floor(u*3);if(n>=1)s+=`<circle cx="1000" cy="420" r="52" fill="#0b1122" fill-opacity=".8" stroke="${C.hi}" stroke-width="4"/>`+label(String(n),1000,444,{size:62,color:C.hi,anchor:'middle',weight:700});}
  return s+decoder(ctx,p);
 },
 'dz-answer':(p,ctx)=>{
  let s=sky()+clouds(60)+callout(40,140,640,365,'');
  const A=axes({x:100,y:470,w:520,h:270,xmax:3,ymax:50,xlabel:'時間',ylabel:'速さ',yticks:[5,10],g:1});
  s+=A.svg.replaceAll(C.dim,'#3a4a66')+line(A.X(0),A.Y(5),A.X(3),A.Y(5),{color:'#b7860b',w:3,dash:'10 7'})+line(A.X(0),A.Y(10),A.X(3),A.Y(10),{color:'#c0392b',w:3,dash:'10 7'});
  s+=A.plot(t=>5+45*Math.exp(-2*t),{color:'#6c4fd8',w:4})+A.plot(t=>10+40*Math.exp(-t),{p:seg(p,.3,.8),color:'#c0392b',w:5});
  s+=label('一人',A.X(.35),A.Y(14),{size:24,color:'#6c4fd8',weight:700})+fade(seg(p,.5,.7),label('二人乗り',A.X(1.2),A.Y(24),{size:24,color:'#c0392b',weight:700}));
  s+=word('ゴール 2倍（10 m/s）',720,230,{size:30,g:seg(p,.1,.3)})+word('τ 2倍 → ゆっくり',720,330,{size:30,g:seg(p,.5,.7)})+check(1120,420,seg(p,.8,.95));
  return s+decoder(ctx,p);
 },
 'dz-end':(p)=>{
  let s=`<rect x="0" y="0" width="1200" height="515" rx="18" fill="#101c35" stroke="${C.hi}" stroke-opacity=".35" stroke-width="2"/>`;
  s+=formula(['goal','gap','decay'],{y:210,size:60});
  s+=fade(seg(p,.35,.55),label('読めた！',600,420,{size:64,color:C.hi,anchor:'middle',weight:700}));
  return s+[[180,120],[1030,110],[160,430],[1050,440],[600,480]].map(([x,y],i)=>fade(seg(p,.4+i*.07,.55+i*.07),`<path d="M${x} ${y-16} L${x+5} ${y-5} L${x+16} ${y} L${x+5} ${y+5} L${x} ${y+16} L${x-5} ${y+5} L${x-16} ${y} L${x-5} ${y-5} Z" fill="${C.hi}"/>`)).join('');
 },
};
