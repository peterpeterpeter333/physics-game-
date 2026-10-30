// 特別編 v3「疑問20連発」担当A（Q1〜Q6）の共通部品。v2 パート1（yt1-sp-gps2-1-diagrams.mjs）の部品を写して、上の Q 点列・Q カード・橋の札を足したもの。
// 図のキーは持たない（ファイル名が -diagrams で終わらないので自動読み込みされない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,clamp,mix,poly,scaleAt,brace} from './anim.mjs';

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
 // v3: the Q dot row sits at the top right, so the card starts lower (y=36)
 let s=rect(80,36,1040,470,{fill:'#131f38',fo:.97,stroke:HC,sw:3,rx:18});
 s+=dot(155,110,38,HC)+label('Q.',155,124,{size:38,color:'#0b1122',anchor:'middle',weight:700});
 s+=label(q,215,124,{size:38,color:C.ink,weight:700});
 opts.forEach((o,i)=>{const x=130+i*320,y=215,w=300,h=210,gi=appear?seg(p,.12+i*.1,.2+i*.1):1;
  const right=i===ans&&reveal>0,dim=reveal>0&&i!==ans;
  let b=rect(x,y,w,h,{fill:right?HC:'#1b2a4a',fo:right?.2:1,stroke:right?HC:'#5a6b8c',sw:right?6:2,rx:16});
  b+=label(LET[i],x+32,y+48,{size:32,color:right?HC:C.dim,anchor:'middle',weight:700});
  b+=label(o,x+w/2,y+138,{size:48,color:right?HC:C.ink,anchor:'middle',weight:700});
  if(right)b+=label('正解',x+w-50,y+48,{size:26,color:HC,anchor:'middle',weight:700});
  s+=fade(gi*(dim?1-.6*reveal:1),scaleAt(x+w/2,y+h/2,.85+.15*gi,b));
 });
 s+=countdown(1050,110,38,t,ctx,{g:ans<0?1:0});
 return fade(g,s);
}
function quizStrip(opts,ans,t,{g=1}={}){
 // v3: one row under the Q dot row (y 34–92)
 let s=dot(420,63,26,HC)+label('Q.',420,73,{size:26,color:'#0b1122',anchor:'middle',weight:700});
 opts.forEach((o,i)=>{const x=470+i*230,right=i===ans,pulse=.5+.5*Math.sin(t*5);
  s+=rect(x,34,215,58,{fill:right?HC:'#1b2a4a',fo:right?.16+.1*pulse:1,stroke:right?HC:'#3d4d6c',sw:right?4:2,rx:12});
  s+=label(`${LET[i]}　${o}`,x+107,73,{size:28,color:right?HC:C.dim,anchor:'middle',weight:700});});
 return fade(g,s);
}
// answer cue: the full card shows the right answer, then folds into the strip at the top
function answer(p,t,ctx,Q,body){
 const full=1-seg(p,.16,.26),strip=seg(p,.2,.3);
 return body+quizStrip(Q.opts,Q.ans,t,{g:strip})+fade(full,quizFull(p,t,ctx,{...Q,reveal:seg(p,.02,.08),appear:false}));
}
const QT={q:'雷までは、どれくらい？',opts:['100 m','1 km','10 km'],ans:1};
const QL={q:'光は 1秒で、地球を 何周 できる？',opts:['1 周','7 周半','100 周'],ans:1};

// ---------- thunder: strike at X0, listener at XL; 1020 m between ----------
const X0=145,XL=1080,GY=440,SC=(1075-X0)/1020; // px per metre
function thunder(t,{flash=0,ws=-1,marks=0,g=1,id='a',listener=1}={}){
 let s=rect(40,GY,1120,65,{fill:'#132a1f',fo:1,stroke:'#1d3b2b',sw:2,rx:0});
 s+=line(40,GY,1160,GY,{color:'#3b6b4f',w:3});
 // sound fronts (upper half-circles, clipped above the ground)
 if(ws>0){let w='';for(let k=0;k<3;k++){const r=(ws-k*.1)*340*SC;if(r>6)w+=`<path d="M${(X0-r).toFixed(1)} ${GY} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(X0+r).toFixed(1)} ${GY}" fill="none" stroke="${C.ink}" stroke-width="${4-k}" opacity="${(.75-.22*k)*clamp(1.25-ws/4)}"/>`;}
  s+=clip('gpsTh'+id,40,40,1120,GY-40,w);}
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


// ---------- v3 parts: Q dot row, Q card, bridge tag ----------
// Q dot row (same look for all v3 films): top right, 20 dots of 12 px diameter, 22 px apart.
// solved = cyan fill, current = glowing yellow ring, future = grey ring. Stars to the left.
export const QN=20, QD=22, QXR=1182, QY=16;
export const starsOf=n=>n<=6?1:n<=10?2:n<=15?3:4;
export function qbar(n,t=0,{solve=0}={}){
 const x0=QXR-(QN-1)*QD;
 let s=label('★'.repeat(starsOf(n)),x0-16,QY+8,{size:22,color:HC,anchor:'end',weight:700});
 for(let i=1;i<=QN;i++){const x=x0+(i-1)*QD;
  if(i<n)s+=dot(x,QY,6,XC);
  else if(i===n){const pulse=.5+.5*Math.sin(t*4);
   s+=dot(x,QY,11+2*pulse,HC,.16+.12*pulse);
   if(solve>0){const pop=1+.6*Math.exp(-solve*6)*(solve<1?1:0);s+=fade(solve,dot(x,QY,6*Math.min(pop,1.4),XC));}
   s+=ring(x,QY,5,{color:HC,w:2.5});}
  else s+=ring(x,QY,5,{color:'#5a6b8c',w:2});
 }
 return s;
}
// Q card (first cue of each film): big yellow "Q.n", the question in white below
export function qcard(n,lines,p,t,{y0=210,extra=''}={}){
 const pop=seg(p,0,.12),sc=.7+.3*pop+.04*Math.exp(-Math.max(0,p-.12)*12);
 let s=fade(.07,label('？',1010,420,{size:300,color:HC,anchor:'middle',weight:700})+label('？',190,330,{size:200,color:C.x,anchor:'middle',weight:700}));
 s+=fade(pop,scaleAt(600,y0-40,sc,label(`Q.${n}`,600,y0,{size:120,color:HC,anchor:'middle',weight:700})));
 lines.forEach((L,i)=>{s+=fade(seg(p,.08+i*.06,.2+i*.06),label(L,600,y0+100+i*62,{size:46,color:C.ink,anchor:'middle',weight:700}));});
 return s+extra;
}
// bridge: "次の疑問 →" at the bottom right
export function nextTag(p,t,{g=1}={}){
 const gi=seg(p,.25,.45)*g,dx=6*Math.sin(t*4);
 let s=rect(912,446,256,60,{fill:'#131f38',fo:.96,stroke:HC,sw:3,rx:30});
 s+=label('次の疑問',1012,486,{size:30,color:HC,anchor:'middle',weight:700})+arrow(1088+dx*.3,476,1136+dx,476,{color:HC,w:5,head:16});
 return fade(gi,s);
}
// map pin (tip at x,y)
export function pin(x,y,r=34,{g=1,col='#4c8dff'}={}){
 const cy=y-1.75*r,a=.55;
 let s=poly([[x,y],[x-r*Math.cos(a),cy+r*Math.sin(a)],[x+r*Math.cos(a),cy+r*Math.sin(a)]],{fill:col,fo:1,stroke:col});
 s+=dot(x,cy,r,col)+dot(x,cy,r*.4,'#fff');
 return fade(g,s);
}

// wrap a picture: own fade-in (so the Q dot row never blinks), the Q dot row, and the bridge tag
export function qwrap(n,fn,{bridge=false,fadeIn=true}={}){
 return (p,ctx)=>{
  const t=cueT(p,ctx),fi=fadeIn?clamp(t/.35):1,f=fi*fi*(3-2*fi);
  let s=fade(f,fn(p,ctx));
  s+=qbar(n,t,{solve:bridge?seg(p,.12,.3):0});
  if(bridge)s+=nextTag(p,t);
  return s;
 };
}
// shrink a reused v1/v2 picture a little toward the bottom so the top band (Q dot row) stays free
export const fit=(fn,k=.95,cx=600,cy=515)=>(p,ctx)=>scaleAt(cx,cy,k,fn(p,ctx));
// sub-range of a cue: run fn as if the cue were [p0,p1]
export const sub=(fn,p0,p1)=>(p,ctx)=>{const d=durOf(ctx),q=clamp((p-p0)/(p1-p0));return fn(q,{...ctx,t:(ctx&&typeof ctx.t==='number'?ctx.t:p*8)-p0*d,dur:(p1-p0)*d});};

export {PI,HC,TC,XC,BAD,OK,FAST,RADIO,EARTH,GOLD,PANEL,card,tag,cueT,sceneT,durOf,voiceEnd,cross,okMark,circPts,clip,plus,
 earth,sat,clock,phone,person,countdown,quizFull,quizStrip,answer,QT,QL,X0,XL,GY,SC,thunder,flashAt,TW,P0,Q0,dist,land,tower,circle,glowPt,
 RX0,RW,RY,soccer,ruler300,fields};
