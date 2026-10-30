// 特別編 v2「GPS と相対性理論」パート1/4 (ys-sp-gps2-1) — 図。Stage 1200×515。難しさ★1：式なし、動く絵で驚かせる。
// 色：電波・光 紫（C.v）、時間 金（C.t）、場所 水色（C.x）、差・強調 黄（C.hi）。
// 衛星の時計が「進む」＝赤の上向き矢印と「＋」。地球は青い円、衛星は金色の本体に青い太陽電池板、時計はアナログの顔に札。
// v1 パート1の図（yt1-sp-gps-1-diagrams.mjs）は import して一部の cue でそのまま使う（v1 は編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,clamp,mix,poly,scaleAt,brace} from './anim.mjs';
import {spGps1Diagrams as V1} from './yt1-sp-gps-1-diagrams.mjs';

const K='sp-gps2-1:';
const PI=Math.PI;
const HC=C.hi, TC=C.t, XC=C.x, BAD=C.a, OK=C.F, FAST=C.a, RADIO=C.v;
const EARTH='#2f6fd6', GOLD='#e3b341', PANEL='#3f78e0';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
function tag(s,x,y,{color=C.hi,g=1,size=24}={}){
 const w=[...s].length*size+30;
 return fade(g,rect(x-w/2,y-size*.85-8,w,size+18,{fill:color,fo:.14,stroke:color,sw:2,rx:16})+label(s,x,y+2,{size,color,anchor:'middle',weight:700}));
}
const cueT=(p,ctx)=>ctx&&typeof ctx.t==='number'?ctx.t:p*8;
const sceneT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
const durOf=ctx=>ctx&&ctx.dur?ctx.dur:8;
const voiceEnd=ctx=>durOf(ctx)-.12-((ctx&&ctx.cue&&ctx.cue.pause)||0);
const cross=(x,y,r=22,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:BAD,w:6})+line(x-r,y+r,x+r,y-r,{color:BAD,w:6}));
const okMark=(x,y,g=1)=>fade(g,draw([[x-18,y],[x-4,y+14],[x+20,y-16]],1,{color:OK,w:6}));
const circPts=(cx,cy,r,a0=-PI/2,a1=3*PI/2,n=120)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
const clip=(id,x,y,w,h,inner)=>`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
const plus=(x,y,{g=1,len=80,size=40}={})=>fade(g,arrow(x,y+len/2,x,y-len/2,{color:FAST,w:6,head:18})+label('＋',x+34,y+14,{size,color:FAST,anchor:'middle',weight:700}));

// ---------- common parts (same look as v1) ----------
function earth(cx,cy,R,{g=1}={}){
 let s=`<defs><radialGradient id="gps2E" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#4f8ef0"/><stop offset=".7" stop-color="${EARTH}"/><stop offset="1" stop-color="#1d4594"/></radialGradient></defs>`;
 s+=ring(cx,cy,R+Math.min(10,R*.08),{color:'#7fb2ff',w:Math.min(8,R*.06)})+`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#gps2E)"/>`;
 return fade(g,s);
}
function sat(x,y,k=1,{g=1,glow=0}={}){
 const b=13*k,pw=34*k,ph=13*k;
 let s='';
 if(glow)s+=dot(x,y,30*k,GOLD,.18*glow);
 s+=line(x-b-pw-2,y,x+b+pw+2,y,{color:'#c9d3e6',w:2*k});
 for(const sgn of[-1,1]){const px=sgn<0?x-b-4*k-pw:x+b+4*k;
  s+=rect(px,y-ph/2,pw,ph,{fill:PANEL,fo:1,stroke:'#9cc0ff',sw:1.5,rx:2});
  for(let i=1;i<3;i++)s+=line(px+pw*i/3,y-ph/2,px+pw*i/3,y+ph/2,{color:'#9cc0ff',w:1});}
 s+=rect(x-b,y-b,2*b,2*b,{fill:GOLD,fo:1,stroke:'#fff0b8',sw:1.5,rx:3});
 s+=line(x,y+b,x,y+b+8*k,{color:'#c9d3e6',w:2*k})+dot(x,y+b+9*k,3*k,'#c9d3e6');
 return fade(g,s);
}
function clock(x,y,R,{t=0,name='',g=1,col=C.ink,rate=1,off=0,tagCol=C.dim,ghost=false}={}){
 let s=dot(x,y,R+6,'#0e1830')+ring(x,y,R,{color:col,w:R>50?4:3,fill:'#1a2745'});
 for(let i=0;i<12;i++){const a=i*PI/6;s+=line(x+R*.82*Math.cos(a),y+R*.82*Math.sin(a),x+R*.95*Math.cos(a),y+R*.95*Math.sin(a),{color:C.ink,w:i%3?2:4});}
 const ts=t*rate+off,am=ts/60*2*PI-PI/2,ah=ts/720*2*PI-PI/2-.9,as=ts*2*PI/6-PI/2;
 if(ghost){const ag=t*2*PI/6-PI/2;s+=line(x,y,x+R*.86*Math.cos(ag),y+R*.86*Math.sin(ag),{color:C.dim,w:3,dash:'5 5'});}
 s+=line(x,y,x+R*.5*Math.cos(ah),y+R*.5*Math.sin(ah),{color:C.ink,w:R>50?6:4});
 s+=line(x,y,x+R*.74*Math.cos(am),y+R*.74*Math.sin(am),{color:C.ink,w:R>50?4:3});
 s+=line(x,y,x+R*.86*Math.cos(as),y+R*.86*Math.sin(as),{color:TC,w:2.5})+dot(x,y,R>50?5:4,TC);
 if(name)s+=tag(name,x,y+R+38,{color:tagCol,size:24});
 return fade(g,s);
}
function phone(x,y,h=110,{g=1,dotOn=1}={}){
 const w=h*.52;
 let s=rect(x-w/2,y-h/2,w,h,{fill:'#20283a',fo:1,stroke:'#c9d3e6',sw:3,rx:h*.1});
 s+=rect(x-w/2+5,y-h/2+10,w-10,h-22,{fill:'#0f2244',fo:1,stroke:'#0f2244',sw:1,rx:3});
 if(dotOn)s+=dot(x,y,h*.07,'#4c8dff')+ring(x,y,h*.07+2,{color:'#fff',w:1.5});
 return fade(g,s);
}
// standing person (silhouette); yF = feet
function person(x,yF,h,{col='#8fa3c7',g=1}={}){
 const hr=h*.1,hy=yF-h+hr;
 let s=dot(x,hy,hr,col);
 s+=rect(x-h*.13,yF-h*.78,h*.26,h*.4,{fill:col,fo:1,stroke:col,sw:1,rx:h*.08});
 for(const sg of[-1,1]){s+=line(x+sg*h*.06,yF-h*.42,x+sg*h*.08,yF-h*.02,{color:col,w:h*.08});s+=line(x+sg*h*.12,yF-h*.72,x+sg*h*.2,yF-h*.45,{color:col,w:h*.055});}
 return fade(g,s);
}
// Tokyo Skytree (schematic); yB = base
function skytree(x,yB,h,{g=1}={}){
 const yT=yB-h,col='#c9d3e6';
 let s=poly([[x-.11*h,yB],[x+.11*h,yB],[x+.014*h,yT+.12*h],[x-.014*h,yT+.12*h]],{fill:col,fo:.25,stroke:col,sw:2});
 for(let i=1;i<10;i++){const y=yB-i*.088*h,hw=mix(.11*h,.014*h,(yB-y)/(.88*h));s+=line(x-hw,y,x+hw,y,{color:col,w:1.2,opacity:.6});}
 s+=line(x,yT+.12*h,x,yT,{color:col,w:3});
 s+=rect(x-.06*h,yB-.56*h,.12*h,.035*h,{fill:col,fo:.9,stroke:col,rx:3});   // 展望台（下）
 s+=rect(x-.04*h,yB-.72*h,.08*h,.025*h,{fill:col,fo:.9,stroke:col,rx:3});   // 展望台（上）
 return fade(g,s);
}
// ★ stairs: cur = the step that glows
function stairs({x0=80,yB=480,w=140,h=85,cur=1,t=0,g=1,sub=true}={}){
 let s='';
 for(let i=0;i<4;i++){const top=yB-(i+1)*h,x=x0+i*w,n=i+1,on=n===cur,done=n<cur;
  const pulse=on?.5+.5*Math.sin(t*4):0;
  if(on)s+=rect(x-6,top-6,w+6,yB-top+6,{fill:HC,fo:.08+.08*pulse,stroke:'none',rx:10});
  s+=rect(x,top,w-6,yB-top,{fill:on?HC:done?'#2a3a5a':'#18233d',fo:on?.22:1,stroke:on?HC:done?C.dim:C.faint,sw:on?4:2,rx:6});
  s+=label('★'.repeat(n),x+(w-6)/2,top+34,{size:24,color:on?HC:done?C.ink:C.dim,anchor:'middle',weight:700});
  if(sub&&h>=70)s+=label(`パート${n}`,x+(w-6)/2,top+66,{size:22,color:on?HC:C.dim,anchor:'middle'});
  if(done)s+=okMark(x+(w-6)/2,top+(sub&&h>=70?100:62),1);
 }
 return fade(g,s);
}
// ---------- quiz ----------
function countdown(cx,cy,r,t,ctx,{g=1}={}){
 const pause=(ctx&&ctx.cue&&ctx.cue.pause)||3,ve=voiceEnd(ctx),u=clamp((t-ve)/pause);
 const L=2*PI*r,rem=1-u,n=Math.max(1,3-Math.floor(u*3));
 let s=dot(cx,cy,r+10,'#0e1830')+ring(cx,cy,r,{color:C.faint,w:8});
 s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${HC}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(L*rem).toFixed(1)} ${L.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
 s+=label(u>=1?'！':String(n),cx,cy+15,{size:44,color:HC,anchor:'middle',weight:700});
 return fade(g*seg(t,ve-.4,ve),s);
}
const LET='ABC';
function quizFull(p,t,ctx,{q,opts,ans=-1,reveal=0,g=1,appear=true}){
 let s=rect(80,15,1040,485,{fill:'#131f38',fo:.97,stroke:HC,sw:3,rx:18});
 s+=dot(155,95,40,HC)+label('Q.',155,110,{size:40,color:'#0b1122',anchor:'middle',weight:700});
 s+=label(q,215,110,{size:38,color:C.ink,weight:700});
 opts.forEach((o,i)=>{const x=130+i*320,y=210,w=300,h=210,gi=appear?seg(p,.12+i*.1,.2+i*.1):1;
  const right=i===ans&&reveal>0,dim=reveal>0&&i!==ans;
  let b=rect(x,y,w,h,{fill:right?HC:'#1b2a4a',fo:right?.2:1,stroke:right?HC:'#5a6b8c',sw:right?6:2,rx:16});
  b+=label(LET[i],x+32,y+48,{size:32,color:right?HC:C.dim,anchor:'middle',weight:700});
  b+=label(o,x+w/2,y+138,{size:48,color:right?HC:C.ink,anchor:'middle',weight:700});
  if(right)b+=label('正解',x+w-50,y+48,{size:26,color:HC,anchor:'middle',weight:700});
  s+=fade(gi*(dim?1-.6*reveal:1),scaleAt(x+w/2,y+h/2,.85+.15*gi,b));
 });
 s+=countdown(1040,95,40,t,ctx,{g:ans<0?1:0});
 return fade(g,s);
}
function quizStrip(opts,ans,t,{g=1}={}){
 let s=dot(420,43,28,HC)+label('Q.',420,54,{size:28,color:'#0b1122',anchor:'middle',weight:700});
 opts.forEach((o,i)=>{const x=470+i*230,right=i===ans,pulse=.5+.5*Math.sin(t*5);
  s+=rect(x,10,215,66,{fill:right?HC:'#1b2a4a',fo:right?.16+.1*pulse:1,stroke:right?HC:'#3d4d6c',sw:right?4:2,rx:12});
  s+=label(`${LET[i]}　${o}`,x+107,54,{size:28,color:right?HC:C.dim,anchor:'middle',weight:700});});
 return fade(g,s);
}
// answer cue: the full card shows the right answer, then folds into the strip at the top
function answer(p,t,ctx,Q,body){
 const full=1-seg(p,.16,.26),strip=seg(p,.2,.3);
 return body+quizStrip(Q.opts,Q.ans,t,{g:strip})+fade(full,quizFull(p,t,ctx,{...Q,reveal:seg(p,.02,.08),appear:false}));
}
const QT={q:'雷は、どれくらい 遠くに 落ちた？',opts:['100 m','1 km','10 km'],ans:1};
const QL={q:'光は 1秒で、地球を 何周 できる？',opts:['1 周','7 周半','100 周'],ans:1};

// ---------- thunder: strike at X0, listener at XL; 1020 m between ----------
const X0=145,XL=1080,GY=440,SC=(1075-X0)/1020; // px per metre
function thunder(t,{flash=0,ws=-1,marks=0,g=1,id='a',listener=1}={}){
 let s=rect(40,GY,1120,65,{fill:'#132a1f',fo:1,stroke:'#1d3b2b',sw:2,rx:0});
 s+=line(40,GY,1160,GY,{color:'#3b6b4f',w:3});
 // sound fronts (upper half-circles, clipped above the ground)
 if(ws>0){let w='';for(let k=0;k<3;k++){const r=(ws-k*.1)*340*SC;if(r>6)w+=`<path d="M${(X0-r).toFixed(1)} ${GY} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(X0+r).toFixed(1)} ${GY}" fill="none" stroke="${C.ink}" stroke-width="${4-k}" opacity="${(.75-.22*k)*clamp(1.25-ws/4)}"/>`;}
  s+=clip('gpsTh'+id,40,10,1120,GY-10,w);}
 const cl='#3d4a66',cl2=flash>0?'#9aa8c6':cl,cf=flash>0?flash:0;
 for(const [x,y,r] of [[80,62,38],[140,46,48],[215,52,46],[285,68,36],[170,82,44],[100,90,30]])s+=dot(x,y,r,cf>0?cl2:cl,1);
 if(flash>.02)s+=fade(flash,poly([[175,100],[128,250],[165,250],[132,GY],[212,230],[170,230],[210,100]],{fill:'#fff6b0',fo:1,stroke:'#ffe66a',sw:3})+dot(X0,GY,40,'#fff6b0',.35));
 if(listener){s+=person(XL,GY,120);
  if(ws>=3)s+=fade(clamp((ws-3)*4),ring(XL,GY-108,24,{color:HC,w:4})+label('ゴロゴロ',XL-60,GY-160,{size:32,color:HC,anchor:'middle',weight:700}));}
 for(let m=1;m<=3;m++){const x=X0+340*m*SC;if(marks&&ws>=m)s+=fade(clamp((ws-m)*5),line(x,GY-14,x,GY+14,{color:HC,w:4})+label(`${m}秒 ${m*340} m`,x,GY+48,{size:24,color:HC,anchor:m===3?'end':'middle',weight:700}));}
 if(flash>0)s+=rect(0,0,1200,515,{fill:'#fff',fo:.22*flash,stroke:'none',rx:0});
 return fade(g,s);
}
const flashAt=(t,t0)=>t<t0?0:Math.exp(-(t-t0)*3.5)*(t-t0<.08||(t-t0>.16&&t-t0<.26)?1:.55);

// ---------- towers (three circles meet at P0) ----------
const TW=[[330,250,C.x],[900,250,C.E],[760,470,C.F]];
const P0=[620,350],Q0=[620,150];
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function land({g=1}={}){
 let s=rect(40,10,1120,495,{fill:'#0d1a2b',fo:1,stroke:C.faint,sw:2,rx:14});
 for(let y=60;y<500;y+=55)s+=line(50,y,1150,y,{color:'#16283f',w:1.5});
 for(let x=90;x<1160;x+=55)s+=line(x,15,x,500,{color:'#16283f',w:1.5});
 return fade(g,s);
}
function tower(x,y,n,col,{g=1,t=0}={}){
 const c='#d6deec';
 let s=line(x-16,y+20,x,y-32,{color:c,w:4})+line(x+16,y+20,x,y-32,{color:c,w:4});
 for(const f of[.35,.65])s+=line(x-16*(1-f)-0,y+20-52*f,x+16*(1-f),y+20-52*f,{color:c,w:2.5});
 s+=line(x-12,y+10,x+9,y-8,{color:c,w:1.5})+line(x+12,y+10,x-9,y-8,{color:c,w:1.5});
 s+=dot(x,y-34,5,'#ff6b6b',.6+.4*Math.sin(t*4+n));
 s+=label(String(n),x-34,y-20,{size:30,color:col,anchor:'middle',weight:700});
 return fade(g,s);
}
function circle(i,u){const [x,y,col]=TW[i],r=dist([x,y],P0);return clip('gpsT'+i,40,10,1120,495,draw(circPts(x,y,r),u,{color:col,w:4})+fade(u,`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" fill-opacity=".05"/>`));}
const glowPt=(x,y,t,col=HC,g=1)=>fade(g,dot(x,y,16+4*Math.sin(t*5),col,.3)+dot(x,y,9,col));

// ---------- light ruler ----------
const RX0=150,RW=900,RY=200;
function soccer(x,y,w,h,{g=1}={}){
 let s=rect(x,y,w,h,{fill:'#1f6b3a',fo:.85,stroke:'#e8f5ea',sw:2,rx:2});
 s+=line(x+w/2,y,x+w/2,y+h,{color:'#e8f5ea',w:2})+ring(x+w/2,y+h/2,h*.18,{color:'#e8f5ea',w:2});
 s+=rect(x,y+h*.3,w*.1,h*.4,{fill:'none',fo:0,stroke:'#e8f5ea',sw:2,rx:0})+rect(x+w*.9,y+h*.3,w*.1,h*.4,{fill:'none',fo:0,stroke:'#e8f5ea',sw:2,rx:0});
 return fade(g,s);
}
function ruler300({g=1}={}){
 let s=line(RX0,RY,RX0+RW,RY,{color:C.ink,w:3});
 for(let v=0;v<=300;v+=50){const x=RX0+RW*v/300;s+=line(x,RY-12,x,RY+12,{color:C.ink,w:v%100?1.5:3});if(v%100===0)s+=label(`${v} m`,x,RY+44,{size:24,color:C.dim,anchor:'middle'});}
 return fade(g,s);
}
const fields=(g=1)=>fade(g,[0,1,2].map(i=>soccer(RX0+i*305,280,290,120)).join('')+label('サッカー場 約3つ分',600,450,{size:30,color:'#7fe09a',anchor:'middle',weight:700}));

export const spGps2_1Diagrams={
 // ================= S1 時間は、場所によって違う =================
 [K+'p1']:(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=person(330,495,440,{g:seg(p,0,.12)});
  const g=seg(p,.35,.5);
  s+=fade(g,line(372,95,560,110,{color:C.dim,w:2,dash:'6 6'})+line(380,470,560,410,{color:C.dim,w:2,dash:'6 6'}));
  s+=clock(630,110,70,{t,rate:1.35,g})+clock(630,405,70,{t,g});
  s+=fade(g,label('頭',735,100,{size:34,color:C.ink,weight:700})+label('足',735,395,{size:34,color:C.ink,weight:700}));
  s+=plus(830,100,{g:seg(p,.6,.72)})+fade(seg(p,.6,.72),label('少し 速く 年をとる',900,112,{size:28,color:FAST,weight:700}));
  s+=tag('大きく 誇張',960,460,{color:C.dim,g:seg(p,.6,.72)});
  return s;
 },
 [K+'p2']:(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=skytree(300,495,470)+line(40,495,1160,495,{color:C.dim,w:3});
  s+=fade(seg(p,.08,.2),label('東京スカイツリー',140,60,{size:26,color:C.dim,anchor:'middle'})+line(330,232,550,215,{color:C.dim,w:2,dash:'6 6'})+line(340,480,550,420,{color:C.dim,w:2,dash:'6 6'}));
  s+=clock(620,215,72,{t,rate:1.18,g:seg(p,.1,.25)})+clock(620,410,72,{t,g:seg(p,.3,.45)});
  s+=fade(seg(p,.1,.25),label('展望台',725,225,{size:32,color:C.ink,weight:700}));
  s+=fade(seg(p,.3,.45),label('地上',725,420,{size:32,color:C.ink,weight:700}));
  s+=plus(880,210,{g:seg(p,.6,.72)})+card(930,170,240,90,label('毎日 少しずつ',1050,208,{size:26,color:FAST,anchor:'middle',weight:700})+label('先に 進む',1050,244,{size:26,color:FAST,anchor:'middle',weight:700}),seg(p,.6,.72),FAST);
  s+=tag('大きく 誇張',1030,410,{color:C.dim,g:seg(p,.6,.72)});
  return s;
 },
 [K+'p3']:(p,ctx)=>{
  const t=cueT(p,ctx),u=seg(p,.45,.9);
  let s=clock(300,200,110,{t,name:'地上'});
  s+=clock(880,200,110,{t,rate:1.1,name:'衛星',g:seg(p,.05,.2)})+sat(880,40,1,{g:seg(p,.05,.2)});
  s+=plus(1060,200,{g:seg(p,.4,.5),len:100});
  s+=card(380,370,440,130,label(`1日に ＋${Math.round(38*u)} μs`,600,423,{size:40,color:HC,anchor:'middle',weight:700})+label('（100万分の38 秒）',600,475,{size:26,color:C.dim,anchor:'middle'}),seg(p,.4,.5),HC);
  s+=fade(seg(p,.4,.5),rect(400,486,400*u,6,{fill:HC,fo:.9,stroke:HC,rx:3}));
  s+=tag('針の ずれは 誇張',600,40,{color:C.dim,g:seg(p,.1,.2)});
  return s;
 },
 [K+'p4']:(p,ctx)=>{
  const t=cueT(p,ctx);
  const P1=card(60,20,330,320,person(170,300,240)+clock(300,90,36,{t,rate:1.3})+label('頭 と 足',225,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,0,.1));
  const P2=card(435,20,330,320,skytree(560,300,250)+clock(690,110,36,{t,rate:1.2})+label('スカイツリー',600,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,.03,.13));
  const P3=card(810,20,330,320,clip('gpsP4E',812,22,326,316,earth(975,690,400))+sat(915,110,.9)+clock(1065,110,36,{t,rate:1.1})+label('GPS 衛星',975,330,{size:24,color:C.ink,anchor:'middle'}),seg(p,.06,.16));
  let s=P1+P2+P3;
  s+=plus(345,170,{g:seg(p,.06,.16),len:56,size:30})+plus(720,170,{g:seg(p,.09,.19),len:56,size:30})+plus(1095,170,{g:seg(p,.12,.22),len:56,size:30});
  s+=card(60,375,330,115,label('故障',150,445,{size:36,color:C.ink,anchor:'middle',weight:700})+cross(150,432,28,seg(p,.2,.3))+label('では ない',300,445,{size:30,color:C.ink,anchor:'middle'}),seg(p,.1,.2));
  s+=card(420,375,720,115,label('時間の 進み方 そのものが',780,420,{size:30,color:C.ink,anchor:'middle',weight:700})+label('場所によって 違う',780,470,{size:36,color:HC,anchor:'middle',weight:700}),seg(p,.48,.6),HC);
  return s;
 },
 [K+'p5']:(p,ctx)=>V1['sp-gps-1:a8'](p,ctx),
 [K+'p6']:(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=stairs({x0:70,yB:490,w:140,h:88,cur:1,t,g:seg(p,.2,.4)});
  s+=phone(105,330,70,{g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('ポケットの スマホ',140,250,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),label('アインシュタインの',560,80,{size:26,color:C.ink,anchor:'middle'})+label('時間の 謎',560,125,{size:36,color:HC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),arrow(120,215,500,150,{color:HC,w:3,head:14,g:seg(p,.4,.6)}));
  s+=card(680,170,480,200,label('あなたのスマホは、',920,230,{size:32,color:C.ink,anchor:'middle',weight:700})+label('毎日 アインシュタインを',920,290,{size:34,color:HC,anchor:'middle',weight:700})+label('使っている',920,340,{size:34,color:HC,anchor:'middle',weight:700}),seg(p,.6,.75),HC);
  return s;
 },
 // ================= S2 スマホは、聞いているだけ（v1 の図） =================
 [K+'p7']:(p,ctx)=>V1['sp-gps-1:a1'](p,ctx),
 [K+'p8']:(p,ctx)=>V1['sp-gps-1:a2'](p,ctx),
 [K+'p9']:(p,ctx)=>V1['sp-gps-1:a3'](p,ctx),
 // ================= S3 雷で、距離を測る =================
 [K+'p10']:(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=thunder(t,{flash:flashAt(t,.9),id:'10'});
  s+=card(760,90,360,110,label('ヒント：',860,160,{size:32,color:C.dim,anchor:'middle',weight:700})+label('雷',1010,165,{size:56,color:HC,anchor:'middle',weight:700}),seg(p,.3,.5),HC);
  return s;
 },
 [K+'p11']:(p,ctx)=>{
  const t=cueT(p,ctx),ve=voiceEnd(ctx),t0=.4,ws=Math.max(0,(t-t0)/Math.max(.5,(ve-t0-.2))*3);
  const n=Math.min(3,Math.floor(ws));
  let s=thunder(t,{flash:flashAt(t,t0),ws,id:'11'});
  s+=fade(seg(t,t0+.2,t0+.5),label('ピカッ',250,170,{size:34,color:'#fff6b0',weight:700}));
  let c=label('光ってから',770,140,{size:26,color:C.dim,anchor:'middle'});
  for(let i=1;i<=3;i++){const on=n>=i,pop=on?1+.35*Math.exp(-(ws-i)*6):1;c+=scaleAt(660+i*110-110,205,pop,label(String(i),660+i*110-110,222,{size:52,color:on?TC:C.faint,anchor:'middle',weight:700}));}
  c+=label('秒',1010,220,{size:34,color:TC,anchor:'middle',weight:700});
  s+=card(620,90,440,160,c,seg(t,t0,t0+.3),TC);
  return s;
 },
 [K+'p12']:(p,ctx)=>{
  const t=cueT(p,ctx);
  return fade(.5,thunder(t,{ws:3.3,id:'12'}))+quizFull(p,t,ctx,{...QT,ans:-1,g:seg(p,0,.08)});
 },
 [K+'p13']:(p,ctx)=>{
  const t=cueT(p,ctx),ws=3.15*lin(p,.3,.8);
  let body=thunder(t,{flash:p>.3?flashAt(p*durOf(ctx),.3*durOf(ctx)):0,ws,marks:1,id:'13'});
  body+=card(700,110,440,84,label('340 m × 3 ≈ 1 km',920,166,{size:38,color:HC,anchor:'middle',weight:700}),seg(p,.8,.9),HC);
  body+=fade(seg(p,.3,.4),label('1秒に 約340 m',440,180,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return answer(p,t,ctx,QT,body);
 },
 [K+'p14']:(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=fade(.35,thunder(t,{ws:3.3,marks:1,id:'14'}));
  s+=card(120,90,960,150,label('届くまでに かかった 時間',420,180,{size:38,color:TC,anchor:'middle',weight:700})+arrow(700,168,800,168,{color:C.ink,w:5,head:18})+label('距離',920,185,{size:52,color:HC,anchor:'middle',weight:700}),seg(p,.02,.15),HC);
  s+=card(330,290,540,120,sat(430,350,1.1)+label('GPS も 同じ',680,365,{size:40,color:HC,anchor:'middle',weight:700}),seg(p,.55,.68),HC);
  return s;
 },
 // ================= S4 距離が3つで、場所が決まる =================
 [K+'p15']:(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=land()+tower(...TW[0].slice(0,2),1,TW[0][2],{t,g:seg(p,.1,.3)});
  s+=fade(seg(p,.25,.4),dot(P0[0],P0[1],10,'#4c8dff')+label('？',P0[0]+24,P0[1]-14,{size:44,color:C.dim,weight:700}));
  s+=card(720,40,400,80,label('距離 → 場所 ？',920,95,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.45),C.faint);
  return s;
 },
 [K+'p16']:(p,ctx)=>{
  const t=cueT(p,ctx),u=seg(p,.12,.4);
  let s=land()+circle(0,u)+tower(...TW[0].slice(0,2),1,TW[0][2],{t});
  const [ax,ay]=TW[0],r=dist(TW[0],P0),ar=-2.5;
  s+=fade(seg(p,.15,.3),line(ax,ay,ax+r*Math.cos(ar),ay+r*Math.sin(ar),{color:C.x,w:3,dash:'8 6'})+label('3 km',ax+r*.5*Math.cos(ar)-50,ay+r*.5*Math.sin(ar)-6,{size:30,color:C.x,weight:700}));
  const b=seg(p,.5,.62),am=.15+(t-.5*durOf(ctx))*.55,mx=ax+r*Math.cos(am),my=ay+r*Math.sin(am);
  s+=fade(b,clip('gpsW2',40,10,1120,495,dot(mx,my,11,'#4c8dff')+ring(mx,my,19,{color:C.ink,w:2})+label('ここかも？',mx+26,my-18,{size:28,color:C.ink,weight:700})));
  s+=card(840,420,300,70,label('円の 上の どこか',990,466,{size:28,color:C.x,anchor:'middle',weight:700}),b,C.x);
  return s;
 },
 [K+'p17']:(p,ctx)=>{
  const t=cueT(p,ctx),u=seg(p,.25,.55);
  let s=land()+circle(0,1)+circle(1,u)+tower(...TW[0].slice(0,2),1,TW[0][2],{t})+tower(...TW[1].slice(0,2),2,TW[1][2],{t,g:seg(p,.05,.2)});
  const g=seg(p,.55,.7);
  s+=glowPt(...P0,t,HC,g)+glowPt(...Q0,t,HC,g);
  s+=card(840,420,300,70,label('2つの 点に しぼれた',990,466,{size:28,color:HC,anchor:'middle',weight:700}),g,HC);
  return s;
 },
 [K+'p18']:(p,ctx)=>{
  const t=cueT(p,ctx),u=seg(p,.15,.45);
  let s=land()+circle(0,1)+circle(1,1)+circle(2,u)+tower(...TW[0].slice(0,2),1,TW[0][2],{t})+tower(...TW[1].slice(0,2),2,TW[1][2],{t})+tower(...TW[2].slice(0,2),3,TW[2][2],{t,g:seg(p,.03,.15)});
  const k=seg(p,.45,.58);
  s+=glowPt(...Q0,t,HC,1-k)+fade(k,dot(...Q0,6,C.dim));
  s+=glowPt(...P0,t,HC,1)+fade(seg(p,.5,.62),ring(P0[0],P0[1],30,{color:HC,w:4})+label('ここ！',P0[0]+40,P0[1]-30,{size:38,color:HC,weight:700}));
  return s;
 },
 [K+'p19']:(p,ctx)=>{
  const t=cueT(p,ctx),u=seg(p,.15,.5);
  let s=land()+circle(0,1)+circle(1,1)+circle(2,1);
  TW.forEach(([x,y,col],i)=>{s+=tower(x,y,i+1,col,{t,g:1-u})+sat(x,y-18*u,1.1,{g:u,glow:u*(.5+.5*Math.sin(t*3+i))});});
  s+=glowPt(...P0,t,HC,1-seg(p,.5,.62))+phone(P0[0],P0[1],56,{g:seg(p,.5,.62)});
  s+=card(60,30,360,80,label('塔 → 宇宙の 衛星',240,82,{size:32,color:HC,anchor:'middle',weight:700}),seg(p,.3,.45),HC);
  return s;
 },
 // ================= S5 光は、速すぎる =================
 [K+'p20']:(p,ctx)=>{
  const t=cueT(p,ctx);
  let A=label('音',310,120,{size:48,color:C.ink,anchor:'middle',weight:700});
  for(let k=0;k<4;k++){const r=20+((t*30+k*30)%120);A+=fade(1-r/150,`<path d="M${200+r*.7} ${250-r*.7} A${r} ${r} 0 0 1 ${200+r*.7} ${250+r*.7}" fill="none" stroke="${C.ink}" stroke-width="4"/>`);}
  A+=dot(200,250,14,C.ink)+label('1秒に 約340 m',310,410,{size:30,color:C.dim,anchor:'middle'});
  let s=card(60,40,500,410,fade(1-.55*seg(p,.2,.35),A),1,C.faint)+cross(310,250,60,seg(p,.2,.35));
  let B=label('電波',890,120,{size:48,color:RADIO,anchor:'middle',weight:700});
  for(let k=0;k<5;k++){const r=24+((t*260+k*45)%220);B+=fade(1-r/250,`<path d="M${780+r*.7} ${250-r*.7} A${r} ${r} 0 0 1 ${780+r*.7} ${250+r*.7}" fill="none" stroke="${RADIO}" stroke-width="4"/>`);}
  B=clip('gpsP20',642,42,496,406,B)+sat(760,250,1.2);
  B+=fade(seg(p,.55,.7),label('光と 同じ 速さ',890,410,{size:34,color:RADIO,anchor:'middle',weight:700}));
  s+=card(640,40,500,410,B,seg(p,.15,.3),RADIO);
  return s;
 },
 [K+'p21']:(p,ctx)=>{
  const t=cueT(p,ctx);
  return fade(.4,earth(600,700,400))+quizFull(p,t,ctx,{...QL,ans:-1,g:seg(p,0,.08)});
 },
 [K+'p22']:(p,ctx)=>{
  const t=cueT(p,ctx),laps=7.5*lin(p,.28,.74),cx=330,cy=300,R=165;
  let body=earth(cx,cy,118)+ring(cx,cy,R,{color:C.faint,w:2,dash:'4 8'});
  const a=-PI/2+2*PI*laps;
  if(laps>0){for(let i=14;i>=0;i--){const b=a-i*.07;body+=dot(cx+R*Math.cos(b),cy+R*Math.sin(b),9-i*.5,RADIO,1-i/15);}
   body+=dot(cx+R*Math.cos(a),cy+R*Math.sin(a),16,'#fff',.35);}
  body+=label('地球 1周 ＝ 約4万 km',cx,505,{size:24,color:C.dim,anchor:'middle'});
  body+=card(640,120,500,170,label(`${laps.toFixed(1)} 周`,890,210,{size:60,color:HC,anchor:'middle',weight:700})+label(`経過 ${(laps/7.5).toFixed(2)} 秒`,890,262,{size:28,color:TC,anchor:'middle',weight:700}),seg(p,.22,.3),C.faint);
  body+=card(640,320,500,110,label('1秒に 約30万 km',890,390,{size:40,color:HC,anchor:'middle',weight:700}),seg(p,.76,.86),HC);
  return answer(p,t,ctx,QL,body);
 },
 [K+'p23']:(p,ctx)=>{
  const u=seg(p,.45,.85),X=v=>RX0+RW*v/300;
  let s=card(200,20,800,100,label('100万分の1 秒',430,86,{size:36,color:TC,anchor:'middle',weight:700})+arrow(600,74,690,74,{color:C.ink,w:5,head:16})+label('300 m',830,90,{size:44,color:HC,anchor:'middle',weight:700}),seg(p,.4,.5),HC);
  s+=fade(1-seg(p,.4,.5),card(200,20,800,100,label('少し まちがえる → 大きく ずれる',600,86,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.1)));
  s+=ruler300({g:seg(p,.1,.25)});
  const xp=X(300*u);
  s+=fade(seg(p,.4,.45),line(X(0),RY,xp,RY,{color:RADIO,w:7})+dot(xp,RY,22,RADIO,.25)+dot(xp,RY,10,RADIO));
  s+=fields(seg(p,.25,.4));
  return s;
 },
 [K+'p24']:(p,ctx)=>{
  const t=cueT(p,ctx),z=seg(p,.15,.5),m=300*10**(-3*z),L=RW*m/300;
  let s=fade(1-seg(p,.12,.25),ruler300())+fields(1-seg(p,.12,.25));
  s+=line(RX0,RY,RX0+Math.max(L,1.5),RY,{color:RADIO,w:7})+dot(RX0+L,RY,10,RADIO);
  const txt=m>=1?`${m.toFixed(m>=10?0:1)} m`:`${(m*100).toFixed(0)} cm`;
  s+=fade(seg(p,.12,.2)*(1-seg(p,.52,.6)),label(txt,RX0+Math.max(L,0)+20,RY-24,{size:34,color:HC,weight:700}));
  s+=fade(1-seg(p,.12,.2),label('100万分の1 秒 → 300 m',600,60,{size:32,color:C.dim,anchor:'middle'}));
  s+=card(200,20,800,100,label('10億分の1 秒',430,86,{size:36,color:TC,anchor:'middle',weight:700})+arrow(600,74,690,74,{color:C.ink,w:5,head:16})+label('30 cm',830,90,{size:44,color:HC,anchor:'middle',weight:700}),seg(p,.12,.22),TC);
  s+=tag('1000分の1 に 縮む',300,280,{color:HC,g:seg(p,.3,.4)*(1-seg(p,.55,.62))});
  // zoom inset: 30 cm next to smartphones
  const gi=seg(p,.55,.68);
  s+=fade(gi,ring(RX0,RY,26,{color:HC,w:3})+line(RX0+20,RY+18,420,250,{color:HC,w:2,dash:'6 6'}));
  let ins=rect(420,150,720,345,{fill:'#131f38',fo:.97,stroke:HC,sw:2,rx:14});
  for(let i=0;i<2;i++)ins+=rect(480+i*300,205,292,110,{fill:'#20283a',fo:1,stroke:'#c9d3e6',sw:3,rx:14})+rect(492+i*300,214,268,92,{fill:'#0f2244',fo:1,stroke:'#0f2244',rx:4})+label('スマホ',626+i*300,272,{size:26,color:C.dim,anchor:'middle'});
  ins+=line(480,360,1080,360,{color:RADIO,w:7});
  for(let v=0;v<=30;v+=5){const x=480+600*v/30;ins+=line(x,348,x,372,{color:C.ink,w:v%10?1.5:3});if(v%10===0)ins+=label(v?`${v} cm`:'0',x,405,{size:24,color:C.dim,anchor:'middle'});}
  ins+=label('スマホ 2台分 ほど',780,460,{size:30,color:HC,anchor:'middle',weight:700});
  s+=fade(gi,ins);
  return s;
 },
 // ================= S6 4機目の衛星の役目 =================
 [K+'p25']:(p,ctx)=>{
  const t=cueT(p,ctx),off=.6+.35*t+.25*Math.sin(t*1.7);
  let s=phone(230,255,400,{dotOn:0});
  s+=clock(230,235,80,{t,off,ghost:true,g:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('水晶の 時計',230,380,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.4),label('点線 ＝ 正しい 時刻',230,505,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(480,60,660,120,label('スマホの 時計 ＝ 安い 時計',810,135,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),C.faint);
  s+=card(480,240,660,190,label('10億分の1 秒の 精度',810,320,{size:38,color:TC,anchor:'middle',weight:700})+label('とても ない',810,390,{size:36,color:BAD,anchor:'middle',weight:700})+cross(1080,300,26,seg(p,.65,.75)),seg(p,.55,.65),BAD);
  return s;
 },
 [K+'p26']:(p,ctx)=>V1['sp-gps-1:e31'](p,ctx),
 [K+'p27']:(p,ctx)=>{
  const t=cueT(p,ctx),u=seg(p,.5,.78);
  let s=clock(220,235,100,{t,off:.6+.35*t,name:'スマホの 時計'});
  s+=fade(seg(p,.05,.18),label('ずれている',190,90,{size:30,color:BAD,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.28),okMark(310,80,1)+label('認める',380,92,{size:28,color:OK,anchor:'middle',weight:700}));
  s+=card(520,50,620,420,label('解く 謎',830,110,{size:34,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.4,.5),label('場所 ＋ …',690,290,{size:32,color:XC,anchor:'middle',weight:700})),seg(p,.35,.45),C.faint);
  const bx=mix(220,950,u),by=mix(235,270,u),sc=mix(.6,1,u);
  s+=fade(seg(p,.45,.52),scaleAt(bx,by,sc,rect(bx-75,by-85,150,170,{fill:TC,fo:.15,stroke:TC,sw:4,rx:14})+label('？',bx,by+38,{size:100,color:TC,anchor:'middle',weight:700})));
  s+=fade(seg(p,.78,.88),label('時計の ずれ',950,410,{size:30,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p28']:(p,ctx)=>{
  const items=[['東西',XC],['南北',XC],['高さ',XC],['時計の ずれ',TC]],xs=[200,420,640,950];
  let s='';
  items.forEach(([n,col],i)=>{const x=xs[i],g=seg(p,.1+i*.13,.2+i*.13);
   s+=fade(g,scaleAt(x,220,.7+.3*g,rect(x-85,130,170,180,{fill:col,fo:.12,stroke:col,sw:4,rx:16})+label('？',x,262,{size:110,color:col,anchor:'middle',weight:700})))+fade(g,label(n,x,360,{size:32,color:col,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.3,.45),brace(115,725,110,{dir:-1,color:XC})+label('場所',420,60,{size:32,color:XC,anchor:'middle',weight:700}));
  s+=card(390,410,420,80,label('全部で 4つ',600,465,{size:40,color:HC,anchor:'middle',weight:700}),seg(p,.75,.88),HC);
  return s;
 },
 [K+'p29']:(p,ctx)=>{
  const t=cueT(p,ctx),SX=[170,450,750,1030],SY=[70,48,48,70],CX=[200,420,640,950],cols=[XC,XC,XC,TC],names=['東西','南北','高さ','時計の ずれ'];
  const PX=600,PY=235;
  let s=phone(PX,PY,80);
  SX.forEach((x,i)=>{const g=seg(p,.35+i*.08,.42+i*.08);
   s+=sat(x,SY[i],1);
   s+=draw([[x,SY[i]+18],[PX,PY-42]],g,{color:RADIO,w:3});
   if(g>.99){const q=(t*.6+i*.25)%1;s+=fade(Math.sin(PI*q),dot(mix(x,PX,q),mix(SY[i]+18,PY-42,q),6,RADIO));}
   s+=fade(g,label(`ヒント${i+1}`,x+(i===0?-6:i===3?6:0),SY[i]-24,{size:24,color:RADIO,anchor:'middle',weight:700}));});
  CX.forEach((x,i)=>{const f=seg(p,.4+i*.08,.48+i*.08),sx=Math.abs(Math.cos(PI*f)),done=f>=.5,col=done?HC:cols[i];
   const cardSvg=rect(x-75,330,150,120,{fill:col,fo:.12,stroke:col,sw:4,rx:14})+label(done?'！':'？',x,425,{size:80,color:col,anchor:'middle',weight:700});
   s+=`<g transform="translate(${x} 0) scale(${Math.max(.02,sx).toFixed(3)} 1) translate(${-x} 0)">${cardSvg}</g>`;
   s+=label(names[i],x,490,{size:26,color:cols[i],anchor:'middle',weight:700});});
  s+=fade(seg(p,.05,.15),label('4つの 謎 → 4つの ヒント',PX,PY+90,{size:26,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p30']:(p,ctx)=>V1['sp-gps-1:e38'](p,ctx),
 // ================= S7 すべては、衛星の時計しだい =================
 [K+'p31']:(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=fade(.5,earth(600,1500,1100));
  s+=sat(300,55,1.3,{glow:.5+.5*Math.sin(t*2)})+clock(300,250,120,{t,name:'衛星'});
  s+=card(540,120,600,230,label('すべては',840,195,{size:34,color:C.ink,anchor:'middle',weight:700})+label('衛星の 時計 しだい',840,280,{size:46,color:HC,anchor:'middle',weight:700}),seg(p,.1,.25),HC);
  return s;
 },
 [K+'p32']:(p,ctx)=>{
  const t=cueT(p,ctx),d=3*seg(p,.25,.92);
  let s=clock(300,200,110,{t,name:'地上'});
  s+=clock(880,200,110,{t,rate:1.1,name:'衛星'})+sat(880,40,1);
  s+=plus(1060,200,{g:seg(p,.1,.2),len:100});
  s+=card(380,370,440,130,label(`${Math.min(3,1+Math.floor(d))}日`,600,420,{size:30,color:C.ink,anchor:'middle',weight:700})+label(`＋${38*Math.min(3,1+Math.floor(d))} μs（約）`,600,475,{size:40,color:HC,anchor:'middle',weight:700}),seg(p,.2,.3),HC);
  s+=fade(seg(p,.2,.3),label('毎日 少しずつ 先に',600,40,{size:30,color:FAST,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p33']:(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=card(140,15,920,200,label('宇宙では、時計に',600,85,{size:34,color:C.ink,anchor:'middle',weight:700})+label('いったい 何が 起きている？',600,165,{size:46,color:HC,anchor:'middle',weight:700}),seg(p,.02,.15),HC);
  s+=sat(1050,300,1.1,{glow:.5+.5*Math.sin(t*2)})+clock(1050,410,60,{t,rate:1.1});
  s+=stairs({x0:300,yB:505,w:140,h:66,cur:2,t,sub:false,g:seg(p,.3,.45)});
  s+=fade(seg(p,.5,.62),label('次は ★2',190,440,{size:30,color:HC,anchor:'middle',weight:700}));
  return s;
 },
};
