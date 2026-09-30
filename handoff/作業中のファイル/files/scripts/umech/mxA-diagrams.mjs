// Diagrams for the Maxwell film, group A: chapters 0–2 (the mystery, Coulomb's law, the field
// and Gauss's law). Every picture is wrapped in stage() so the four-equation bar stays on top.
// Timing: elements appear when the narration reaches the phrase that names them. The phrase's
// position inside the subtitle is mapped linearly onto the voiced part of the sentence.
import {MX,C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,stage,word,callout,causal,check,charge,magnet,fieldLines,fit,EQ} from './mx-common.mjs';
import {poly} from './anim.mjs';

// ---- timing ---------------------------------------------------------------------------------
const VE=ctx=>Math.max(.6,(ctx?.dur??4)-(ctx?.cue?.pause??0)-.12);
function T(ctx,s,k=0){const sub=ctx?.cue?.subtitle??'';let i=-1;for(let j=0,f=0;j<=k;j++){i=sub.indexOf(s,f);if(i<0)break;f=i+1;}
 if(i<0)throw Error(`mxA: phrase "${s}" not in subtitle: ${sub}`);return VE(ctx)*i/sub.length;}
// 0→1 fade that starts slightly before the phrase is spoken.
const G=(ctx,s,{d=.45,k=0,off=-.15}={})=>smooth((ctx.t-T(ctx,s,k)-off)/d);
const since=(ctx,s,k=0)=>ctx.t-T(ctx,s,k);

// ---- small pieces ---------------------------------------------------------------------------
const FORCE=C.F,RC='#c3a8ff';
const tx=(src,x,y,size,color=MX.ink,anchor='middle',opacity=1)=>tex(src,x,y,{size,color,anchor,auto:false,opacity});
const dash=(x,y,X,Y,g=1,color=MX.dim)=>fade(g,line(x,y,X,Y,{color,w:2.5,dash:'8 7'}));
function sine(x0,x1,y,amp,lam,phase,{color=MX.hi,w=4,front=x1}={}){const xe=Math.min(x1,front);if(xe<=x0+2)return '';const pts=[];for(let x=x0;x<=xe;x+=3)pts.push([x,y-amp*Math.sin(2*Math.PI*(x-x0)/lam-phase)]);return draw(pts,1,{color,w});}
// Point and direction at fraction u along a polyline.
function along(pts,u){let L=0;const d=[];for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(s);L+=s;}
 let want=L*u;for(let i=1;i<pts.length;i++){if(d[i-1]>=want||i===pts.length-1){const k=d[i-1]?clamp(want/d[i-1]):0;return {x:mix(pts[i-1][0],pts[i][0],k),y:mix(pts[i-1][1],pts[i][1],k),a:Math.atan2(pts[i][1]-pts[i-1][1],pts[i][0]-pts[i-1][0]),L};}want-=d[i-1];}
 return {x:pts[0][0],y:pts[0][1],a:0,L:0};}
const head=(x,y,a,color=MX.E,h=13)=>`<polygon points="${x+h*Math.cos(a)},${y+h*Math.sin(a)} ${x-h*.6*Math.cos(a)+h*.55*Math.sin(a)},${y-h*.6*Math.sin(a)-h*.55*Math.cos(a)} ${x-h*.6*Math.cos(a)-h*.55*Math.sin(a)},${y-h*.6*Math.sin(a)+h*.55*Math.cos(a)}" fill="${color}"/>`;
// Field line with an arrowhead, drawn on with p.
function fline(pts,p=1,{color=MX.E,w=3,opacity=1,at=.5}={}){let s=draw(pts,p,{color,w,opacity});if(p>=at+.05&&pts.length>2){const q=along(pts,at);if(q.L>60)s+=fade(opacity,head(q.x,q.y,q.a,color));}return s;}
const rays=(x,y,n,off=.5)=>fieldLines([{x,y,q:1}],{n});
function star(x,y,g){return fade(g,`<path d="M${x} ${y-14} L${x+4} ${y-4} L${x+14} ${y} L${x+4} ${y+4} L${x} ${y+14} L${x-4} ${y+4} L${x-14} ${y} L${x-4} ${y-4} Z" fill="${MX.hi}"/>`);}
const cross=(x,y,s,g,color=MX.plus)=>fade(g,line(x-s,y-s,x+s,y+s,{color,w:9})+line(x-s,y+s,x+s,y-s,{color,w:9}));

// ---- chapter 0 --------------------------------------------------------------------------------
function phone(x,y){return rect(x-34,y-56,68,112,{fill:'#1a2540',fo:1,stroke:'#c9d3e6',sw:3,rx:12})+rect(x-26,y-44,52,80,{fill:MX.E,fo:.25,stroke:'none',sw:0,rx:4})+dot(x,y+46,4,'#c9d3e6');}
function oven(x,y){return rect(x-62,y-44,124,88,{fill:'#1a2540',fo:1,stroke:'#c9d3e6',sw:3,rx:8})+rect(x-52,y-34,76,68,{fill:'#2a3854',fo:1,stroke:'#8d9cb8',sw:2,rx:4})+ring(x+42,y-16,7,{color:'#c9d3e6',w:2})+ring(x+42,y+12,7,{color:'#c9d3e6',w:2});}
function sun(x,y){let s=dot(x,y,26,MX.hi);for(let k=0;k<8;k++){const a=k*Math.PI/4;s+=line(x+34*Math.cos(a),y+34*Math.sin(a),x+46*Math.cos(a),y+46*Math.sin(a),{color:MX.hi,w:4});}return s;}
function eye(x,y){return `<path d="M${x-44} ${y} Q${x} ${y-36} ${x+44} ${y} Q${x} ${y+36} ${x-44} ${y} Z" fill="#eef3fb" stroke="#c9d3e6" stroke-width="3"/>`+dot(x,y,15,'#5b8cff')+dot(x,y,7,'#0d1526');}
// An "experiment card" (ch0 and ch1 share it): electric (side 0) or magnetic (side 1).
function expCard(side,x0,y0,{g=1,gn=1,glow=0}={}){
 const col=side?MX.B:MX.E,cx=x0+235;
 let s=`<rect x="${x0}" y="${y0}" width="470" height="300" rx="18" fill="${MX.bg2}" fill-opacity=".96" stroke="${col}" stroke-opacity="${.45+.55*glow}" stroke-width="${3+3*glow}"/>`;
 s+=label(side?'磁石の実験':'電気の実験',cx,y0+50,{size:32,color:MX.ink,anchor:'middle',weight:700});
 if(!side)s+=charge(x0+150,y0+140,1,{r:26})+charge(x0+320,y0+140,1,{r:26})+arrow(x0+118,y0+140,x0+58,y0+140,{color:FORCE,w:6,head:16})+arrow(x0+352,y0+140,x0+412,y0+140,{color:FORCE,w:6,head:16});
 else s+=magnet(x0+140,y0+140,{w:150,h:48})+magnet(x0+330,y0+140,{w:150,h:48,angle:180})+arrow(x0+62,y0+140,x0+14,y0+140,{color:FORCE,w:6,head:14})+arrow(x0+408,y0+140,x0+456,y0+140,{color:FORCE,w:6,head:14});
 s+=fade(gn,ring(cx,y0+245,40,{color:col,w:4,fill:'#0d1526'})+tx(side?'\\mu_0':'\\varepsilon_0',cx,y0+252,50,col));
 return fade(g,s);
}

// ---- chapter 1: two charges on a line --------------------------------------------------------
const PY=220,QX=380,RX=700,F0=100;
// q at QX, Q at xQ, both +. Force arrows are equal and opposite; length ∝ qQ/r².
function pair(xQ,{qs=1,fs=1,g=1,br=1,rlab='r',arrows=1}={}){
 const r=xQ-QX,L=F0*fs*(320/r)**2,rq=26+10*(qs-1);
 let s=charge(QX,PY,1,{r:rq})+charge(xQ,PY,1,{r:26});
 s+=fade(arrows,arrow(QX-rq-4,PY,QX-rq-4-L,PY,{color:FORCE,w:7,head:Math.min(20,L*.7)})+arrow(xQ+30,PY,xQ+30+L,PY,{color:FORCE,w:7,head:Math.min(20,L*.7)}));
 s+=fade(br,line(QX,292,xQ,292,{color:MX.dim,w:3})+line(QX,280,QX,304,{color:MX.dim,w:3})+line(xQ,280,xQ,304,{color:MX.dim,w:3})+tx(rlab,(QX+xQ)/2,330,36,RC));
 return fade(g,s);
}
// Coulomb's law laid out by hand so each piece can appear on its own.
function coulomb(cx,y,size,{gF=1,gN=1,gD=1,gk=1,kHi=0}={}){
 const wA=texWidth('F=',size,false),wK=texWidth('k',size,false),wN=texWidth('qQ',size,false),wD=texWidth('r^2',size,false),fw=Math.max(wN,wD)+size*.3,gap=size*.18,W=wA+gap+wK+gap+fw,x0=cx-W/2;
 const xk=x0+wA+gap+wK/2,xf=x0+wA+gap*2+wK+fw/2;
 let s=fade(gF,tx('F',x0+wA*.25,y,size,FORCE)+tx('=',x0+wA*.72,y,size,MX.ink));
 if(kHi>0)s+=fade(kHi,ring(xk,y-size*.2,size*.62,{color:MX.hi,w:4}));
 s+=fade(gk,tx('k',xk,y,size,MX.hi));
 s+=fade(gN,tx('q',xf-wN*.22,y-size*.62,size,MX.plus)+tx('Q',xf+wN*.22,y-size*.62,size,MX.plus));
 s+=fade(gD,line(xf-fw/2,y-size*.25,xf+fw/2,y-size*.25,{color:MX.ink,w:Math.max(2.5,size*.06)})+tx('r^2',xf,y+size*.5,size,RC));
 return {svg:s,xq:xf-wN*.22,xQ:xf+wN*.22,xf,xk,yN:y-size*1.2,yD:y+size*.1,right:x0+W,left:x0};
}

// ---- chapter 2 ------------------------------------------------------------------------------
const SX=600,SY=320; // the lone charge of mx2-space / field-arrows
const Ef=(r)=>Math.min(70,70*(170/r)**2);
function gridDots(cx,cy,glow){let s='';for(let x=90;x<=1110;x+=68)for(let y=160;y<=500;y+=58){const r=Math.hypot(x-cx,y-cy);if(r<44)continue;
 const I=clamp((150/r)**2)*clamp((glow-r)/60);s+=dot(x,y,3+3*I,I>0.02?MX.E:MX.faint,I>0.02?.35+.65*I:1);}return s;}
function gridArrows(cx,cy,g){if(g<=0)return '';let s='';for(let x=100;x<=1100;x+=100)for(let y=170;y<=490;y+=80){const dx=x-cx,dy=y-cy,r=Math.hypot(dx,dy);if(r<80)continue;const L=Ef(r);
 s+=arrow(x-dx/r*L/2,y-dy/r*L/2,x+dx/r*L/2,y+dy/r*L/2,{color:MX.E,w:4,head:12,g});}return fade(g,s);}
// Dipole shared by mx2-lines (+ at 450, − at 750).
const DP={x:450,y:320},DM={x:750,y:320};
let dipCache=null;const dipole=()=>dipCache??=fieldLines([{...DP,q:1},{...DM,q:-1}],{n:24,step:3,maxSteps:900});
// The bag: star-shaped around its charge so every ray leaves exactly once.
const BX=820,BY=330;
const bagR=(th,w,ph)=>140+w*(22*Math.sin(3*th+ph)+13*Math.sin(5*th-1.3*ph)+8*Math.cos(2*th+.7*ph));
const bagPts=(w,ph,n=180)=>Array.from({length:n},(_,i)=>{const th=2*Math.PI*i/n,R=bagR(th,w,ph);return [BX+R*Math.cos(th),BY+R*Math.sin(th)];});
function bagSvg(w,ph,{g=1,glow=0}={}){const P=bagPts(w,ph);return fade(g,`<path d="M${P.map(q=>q.map(v=>v.toFixed(1)).join(' ')).join(' L')} Z" fill="#9fb3d6" fill-opacity="${.10+.08*glow}" stroke="#c9d3e6" stroke-width="${3+2*glow}"/>`);}
const bagRays=12,rayA=k=>2*Math.PI*(k+.5)/bagRays;
function bagLines(w,ph,{p=1,dots=1,opacity=1}={}){let s='';for(let k=0;k<bagRays;k++){const a=rayA(k),R=bagR(a,w,ph),far=Math.min(...[ (Math.cos(a)>0?(1190-BX)/Math.cos(a):(10-BX)/Math.cos(a)), (Math.sin(a)>0?(510-BY)/Math.sin(a):(125-BY)/Math.sin(a))].map(Math.abs));
 const pts=[[BX+22*Math.cos(a),BY+22*Math.sin(a)],[BX+far*Math.cos(a),BY+far*Math.sin(a)]];s+=fline(pts,p,{opacity,at:.62});
 s+=fade(dots*clamp(p*3-1),dot(BX+R*Math.cos(a),BY+R*Math.sin(a),7,MX.hi));}return s;}
// Crossings of straight rays from an outside charge with the bag outline: [{x,y,out}] per ray.
function crossings(ox,oy,a,w,ph){const P=bagPts(w,ph,240),dx=Math.cos(a),dy=Math.sin(a),res=[];
 for(let i=0;i<P.length;i++){const [x1,y1]=P[i],[x2,y2]=P[(i+1)%P.length],ex=x2-x1,ey=y2-y1,den=dx*ey-dy*ex;if(Math.abs(den)<1e-9)continue;
  const t=((x1-ox)*ey-(y1-oy)*ex)/den,u=((x1-ox)*dy-(y1-oy)*dx)/den;if(t>0&&u>=0&&u<1){const X=ox+dx*t,Y=oy+dy*t,out=((X-BX)*dx+(Y-BY)*dy)>0;res.push({x:X,y:Y,t,out});}}
 return res.sort((p,q)=>p.t-q.t);}
// Sphere (seen from the front) of radius R with pierce points of evenly spread lines.
const SPX=400,SPY=320,DEL=.25;
function spherePts(R){const out=[];for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++){const a=i*DEL,b=j*DEL,z=Math.cos(a)*Math.cos(b);if(z<.08)continue;out.push({x:SPX+R*Math.sin(a)*Math.cos(b),y:SPY-R*Math.sin(b),z});}return out;}
function sphere(R,{g=1,dots=1}={}){
 let s=`<defs><radialGradient id="mxsph" cx="42%" cy="38%" r="65%"><stop offset="0" stop-color="${MX.E}" stop-opacity=".22"/><stop offset="1" stop-color="${MX.E}" stop-opacity=".06"/></radialGradient></defs>`;
 s+=`<circle cx="${SPX}" cy="${SPY}" r="${R}" fill="url(#mxsph)" stroke="${MX.E}" stroke-opacity=".8" stroke-width="3"/>`+`<ellipse cx="${SPX}" cy="${SPY}" rx="${R}" ry="${R*.28}" fill="none" stroke="${MX.E}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="6 6"/>`;
 if(dots>0)s+=fade(dots,spherePts(R).map(q=>dot(q.x,q.y,3.5+1.5*q.z,MX.E,.35+.65*q.z)).join(''));
 return fade(g,s);
}
const WIN={x0:SPX+32,x1:SPX+66,y0:SPY-50,y1:SPY-15}; // the fixed "same-size window"

export const mxADiagrams={
 // ===================== chapter 0 =====================
 'mx0-waves':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,rows=[[140,'電波','電波',150],[285,'電子レンジ','電子レンジ',80],[425,'光','目に届く',26]],X0=230,X1=820,V=320;
  let s='';
  rows.forEach(([y,name,key,lam],i)=>{const t0=T(ctx,key)-.15,g=smooth((t-t0)/.4);if(g<=0)return;
   s+=fade(g,(i===0?phone(110,y):i===1?oven(110,y):sun(110,y))+word(name,X0,y-50,{size:26,color:MX.ink}));
   s+=sine(X0,X1,y,22,lam,2*Math.PI*V*(t-t0)/lam,{front:X0+V*(t-t0),color:MX.hi,w:4});
   if(i===2)s+=fade(g,eye(870,y));});
  const ts=T(ctx,'秒速'),gs=smooth((t-ts+.15)/.4);
  if(gs>0){const u=((t-ts)*V/(X1-X0))%1,x=X0+(X1-X0)*u;
   s+=fade(gs,line(x,105,x,455,{color:MX.hi,w:2,dash:'6 6',opacity:.7})+rows.map(([y])=>dot(x,y,10,'#ffffff')).join(''));
   s+=fade(gs,line(945,110,945,450,{color:MX.dim,w:3})+line(945,110,930,110,{color:MX.dim,w:3})+line(945,450,930,450,{color:MX.dim,w:3})+label('どれも',1070,230,{size:28,color:MX.dim,anchor:'middle'})+word('秒速30万km',1070,295,{size:34,color:MX.hi,anchor:'middle'}));}
  return s;})()),

 'mx0-maxwell':(p,ctx)=>stage(ctx,p,(()=>{
  const x=280,y=290;let s='';
  const gp=G(ctx,'マクスウェル');
  s+=fade(gp,`<defs><clipPath id="mxpc"><ellipse cx="${x}" cy="${y}" rx="150" ry="195"/></clipPath></defs><ellipse cx="${x}" cy="${y}" rx="150" ry="195" fill="#d9ceb4"/>`
   +`<g clip-path="url(#mxpc)" fill="#2b2f3a"><ellipse cx="${x}" cy="${y+205}" rx="150" ry="110"/><ellipse cx="${x}" cy="${y-70}" rx="66" ry="74"/><path d="M${x-62} ${y-60} Q${x-78} ${y+60} ${x} ${y+92} Q${x+78} ${y+60} ${x+62} ${y-60} Z"/><ellipse cx="${x}" cy="${y-118}" rx="74" ry="40"/></g>`
   +`<ellipse cx="${x}" cy="${y}" rx="150" ry="195" fill="none" stroke="#b9a98a" stroke-width="6"/>`);
  s+=fade(gp,label('マクスウェル',500,170,{size:52,color:MX.ink,weight:700}));
  s+=word('1860年代',500,250,{size:32,color:MX.hi,g:smooth(ctx.t/.4)})+fade(smooth(ctx.t/.4),label('150年以上前',700,258,{size:28,color:MX.dim}));
  const gl=G(ctx,'光を一度も');
  s+=fade(gl,sun(540,390)+arrow(585,390,780,390,{color:MX.hi,w:6,head:18})+label('光',680,450,{size:28,color:MX.hi,anchor:'middle'}))+cross(680,390,28,G(ctx,'測らず'));
  const gc=G(ctx,'計算');
  s+=callout(830,320,340,160,label('計算だけで',1000,365,{size:26,color:'#6b6152',anchor:'middle'})+fade(seg(ctx.t-T(ctx,'計算'),.4,1.2),label('秒速30万km',1000,435,{size:36,color:MX.paperInk,anchor:'middle',weight:700})),gc,{fill:MX.paper,stroke:'#b9a98a'});
  return s;})()),

 'mx0-two-numbers':(p,ctx)=>stage(ctx,p,(()=>{
  let s=expCard(0,90,70,{g:G(ctx,'電気の実験'),gn:G(ctx,'測った数と')})+expCard(1,640,70,{g:G(ctx,'磁石の実験'),gn:G(ctx,'測った数',{k:1})});
  const gt=G(ctx,'たった');
  s+=fade(gt,`<path d="M110 400 Q110 425 140 425 L570 425 Q600 425 600 450 Q600 425 630 425 L1060 425 Q1090 425 1090 400" fill="none" stroke="${MX.hi}" stroke-width="4"/>`)+word('たった2つ',600,488,{size:34,color:MX.hi,anchor:'middle',g:gt});
  return s;})()),

 'mx0-mystery':(p,ctx)=>stage(ctx,p,(()=>{
  const ge=G(ctx,'電気'),gm=G(ctx,'磁石'),pul=k=>.5+.5*Math.sin(ctx.t*5+k);
  let s=expCard(0,90,70,{glow:ge*pul(0)*.8})+expCard(1,640,70,{glow:gm*pul(1)*.8});
  const ga=G(ctx,'光の速さ',{d:.6});
  s+=arrow(325,392,470,452,{color:MX.E,w:5,g:ga})+arrow(875,392,730,452,{color:MX.B,w:5,g:ga});
  s+=fade(ga,`<circle cx="600" cy="470" r="${120+8*Math.sin(ctx.t*3)}" fill="${MX.hi}" fill-opacity=".07"/>`)+word('光の速さ？',600,478,{size:40,color:MX.hi,anchor:'middle',g:ga});
  s+=word('今日の謎',960,478,{size:32,color:MX.plus,anchor:'middle',g:G(ctx,'今日の謎')});
  return s;})()),

 'mx0-four':(p,ctx)=>stage(ctx,p,(()=>{
  let s=word('今日たどり着く式',600,165,{size:30,color:MX.hi,anchor:'middle',g:smooth(ctx.t/.4)});
  const pos=[[315,262],[885,262],[315,402],[885,402]],t0=T(ctx,'この四つ');
  pos.forEach(([x,y],i)=>{const g=smooth((ctx.t-t0+.2-i*.35)/.5);s+=fade(g,fit(EQ[i+1].tex.replace(/\\color\{[^}]*\}/g,''),x,y,480,46,{color:'#b8c4d8'}));});
  const tq=T(ctx,'今は');
  pos.forEach(([x,y],i)=>{const g=smooth((ctx.t-tq+.1-i*.12)/.35);s+=fade(g,label('？',x-265,y+14+5*Math.sin(ctx.t*4+i),{size:40,color:MX.plus,anchor:'middle',weight:700}));});
  s+=word('今は 読めなくていい',600,488,{size:28,color:MX.ink,anchor:'middle',g:smooth((ctx.t-tq-.4)/.4)});
  return s;})()),

 'mx0-road':(p,ctx)=>stage(ctx,p,(()=>{
  const st=[['静電気',130,215],['電場',390,215],['磁石',640,215],['電流と磁場',920,215],['電磁誘導',920,410],['変位電流',580,410],['光',240,410]];
  const badge={1:'①',2:'②',4:'③',5:'④'};
  const path=[[130,215],[1080,215],[1110,230],[1120,260],[1120,365],[1110,395],[1080,410],[240,410]];
  let s=draw(path,1,{color:MX.faint,w:10});
  const t0=T(ctx,'静電気'),t1=T(ctx,'一つずつ'),t2=T(ctx,'たどり着きます'),tl=T(ctx,'最後'),sp=(t1+.4-t0)/st.length;
  // traveller moves from the first station to the last while "一つずつ…たどり着きます" is said
  const u=smooth((ctx.t-t1)/Math.max(.8,t2-t1+.8));
  if(u>0)s+=draw(path,u,{color:MX.hi,w:6});
  if(u>0&&u<1){const q=along(path,u);s+=dot(q.x,q.y,11,'#ffffff');}
  st.forEach(([n,x,y],i)=>{const g=smooth((ctx.t-t0+.2-i*sp)/.4),last=i===st.length-1,lit=last?G(ctx,'最後'):0;
   if(last)s+=fade(lit,`<circle cx="${x}" cy="${y}" r="${70+6*Math.sin(ctx.t*4)}" fill="${MX.hi}" fill-opacity=".14"/>`);
   s+=word(n,x,y+10,{size:last?36:28,color:last?MX.hi:MX.ink,anchor:'middle',g});
   if(badge[i])s+=fade(g,label(badge[i],x,y-36,{size:28,color:MX.hi,anchor:'middle',weight:700}));});
  s+=word('自分で計算',240,488,{size:30,color:MX.hi,anchor:'middle',g:G(ctx,'自分の手')});
  return s;})()),

 // ===================== chapter 1 =====================
 'mx1-hair':(p,ctx)=>stage(ctx,p,(()=>{
  const hx=400,hy=410,HR=80,tr=T(ctx,'こすると'),ta=T(ctx,'引き寄せ'),tc=T(ctx,'電気がたまる');
  const rub=ctx.t>tr-.2&&ctx.t<ta-.2?Math.sin((ctx.t-tr)*9):0,lift=smooth((ctx.t-ta+.3)/.6);
  const sy=mix(hy-HR-14,hy-HR-110,lift),sx=hx+60*rub;
  let s=`<circle cx="${hx}" cy="${hy}" r="${HR}" fill="#c9a88a"/>`;
  for(let k=0;k<17;k++){const th=(-72+9*k)*Math.PI/180,bx=hx+HR*Math.sin(th),by=hy-HR*Math.cos(th);
   const rest=[bx+34*Math.sin(th+.9*Math.sign(th||1)),by-34*Math.cos(th+.9*Math.sign(th||1))],up=[mix(bx,sx+(bx-hx)*.6,.55),sy+16+Math.abs(bx-hx)*.25];
   const tip=[mix(rest[0],up[0],lift),mix(rest[1],up[1],lift)],mid=[mix(bx,tip[0],.5)+(1-lift)*6*Math.sin(th),mix(by,tip[1],.5)];
   s+=`<path d="M${bx.toFixed(1)} ${by.toFixed(1)} Q${mid[0].toFixed(1)} ${mid[1].toFixed(1)} ${tip[0].toFixed(1)} ${tip[1].toFixed(1)}" fill="none" stroke="#5a3e2b" stroke-width="5" stroke-linecap="round"/>`;
   if(k%4===1)s+=fade(G(ctx,'電気がたまる'),label('+',bx+(tip[0]-bx)*.4,by+(tip[1]-by)*.4+8,{size:26,color:MX.plus,anchor:'middle',weight:700}));}
  s+=rect(sx-150,sy-26,300,26,{fill:'#b9c7e0',fo:.45,stroke:'#dfe6f2',sw:2,rx:5});
  s+=fade(G(ctx,'電気がたまる'),[-110,-55,0,55,110].map(d=>label('−',sx+d,sy-3,{size:28,color:MX.minus,anchor:'middle',weight:700})).join(''));
  s+=word('下敷き',sx+170,sy-10,{size:26,color:MX.ink});
  s+=word('こする',780,220,{size:32,color:MX.ink,g:G(ctx,'こすると')});
  s+=word('引き寄せられる',780,320,{size:32,color:MX.hi,g:G(ctx,'引き寄せ')});
  s+=word('電気がたまる',780,420,{size:32,color:MX.E,g:G(ctx,'電気がたまる')});
  return s;})()),

 'mx1-charges':(p,ctx)=>stage(ctx,p,(()=>{
  const ya=235,yb=410,g1=G(ctx,'電荷と'),g2=G(ctx,'マイナスが'),gs=G(ctx,'同じ種類'),gd=G(ctx,'違う種類');
  const ds=45*smooth((ctx.t-T(ctx,'押し合い')+.1)/.8),dd=20*smooth((ctx.t-T(ctx,'引き合い')+.1)/.8);
  let s=word('電荷',140,322,{size:34,color:MX.ink,g:g1});
  s+=charge(340-ds,ya,1,{g:g1})+charge(560+ds,ya,1,{g:gs});
  s+=charge(340+dd,yb,1,{g:gd})+charge(560-dd,yb,-1,{g:g2});
  s+=fade(g1*(1-gs),label('プラス',340,ya+62,{size:24,color:MX.plus,anchor:'middle'}))+fade(g2*(1-gd),label('マイナス',560,yb+62,{size:24,color:MX.minus,anchor:'middle'}));
  s+=fade(gs,arrow(340-ds-30,ya,340-ds-110,ya,{color:FORCE,w:7,head:20})+arrow(560+ds+30,ya,560+ds+110,ya,{color:FORCE,w:7,head:20}));
  s+=fade(gd,arrow(340+dd+30,yb,340+dd+75,yb,{color:FORCE,w:7,head:20})+arrow(560-dd-30,yb,560-dd-75,yb,{color:FORCE,w:7,head:20}));
  s+=word('同じ → 押し合う',800,ya+10,{size:32,g:gs})+word('違う → 引き合う',800,yb+10,{size:32,g:gd});
  return s;})()),

 'mx1-current':(p,ctx)=>stage(ctx,p,(()=>{
  const y=330,x0=110,x1=1090,t=ctx.t,ge=G(ctx,'電線の中'),gE=G(ctx,'電子が');
  let s=rect(x0,y-40,x1-x0,80,{fill:'#c07a3a',fo:.18,stroke:'#c07a3a',sw:3,rx:40});
  s+=fade(G(ctx,'電流です'),arrow(420,y-85,780,y-85,{color:MX.I,w:8,head:24})+word('電流',820,y-78,{size:32,color:MX.I}));
  const W=x1-x0-60;
  for(let k=0;k<11;k++){const yy=y+(k%2?14:-14);
   const xp=x0+30+((k/11*W+90*t)%W+W)%W,xm=x0+30+((k/11*W-90*t)%W+W)%W;
   s+=charge(xp,yy,1,{r:14,g:G(ctx,'動くと')*(1-ge)})+charge(xm,yy,-1,{r:14,g:ge});}
  s+=word('電線',x0+10,y+95,{size:28,color:'#e0a36a',g:ge});
  s+=fade(gE,arrow(780,y+80,560,y+80,{color:MX.minus,w:6,head:18})+word('電子',800,y+92,{size:30,color:MX.minus})+label('向きは逆',930,y+92,{size:26,color:MX.dim}));
  return s;})()),

 'mx1-double':(p,ctx)=>stage(ctx,p,(()=>{
  const qs=1+smooth((ctx.t-T(ctx,'片方')-.3)/.6),fs=1+smooth((ctx.t-T(ctx,'力も')+.1)/.6);
  let s=pair(RX,{qs,fs});
  s+=word('力の強さは？',590,158,{size:30,color:MX.ink,anchor:'middle',g:smooth(ctx.t/.4)*(1-.6*G(ctx,'片方'))});
  s+=word('×2',QX,158,{size:30,color:MX.plus,anchor:'middle',g:G(ctx,'二倍に')});
  s+=causal('電荷 ×2','力 ×2',600,440,{g:G(ctx,'力も'),ca:MX.plus,cb:FORCE});
  return s;})()),

 'mx1-distance':(p,ctx)=>stage(ctx,p,(()=>{
  const u=smooth((ctx.t-T(ctx,'距離を')-.2)/.8),xQ=mix(RX,RX+320,u);
  let s=pair(xQ,{rlab:u>.97?'2r':'r'});
  s+=causal('距離 ×2','力 ×¼',600,440,{g:G(ctx,'四分の一'),ca:MX.ink,cb:FORCE});
  const gi=G(ctx,'二乗に');
  s+=fade(gi,tx('F\\propto\\dfrac{1}{r^2}',560,168,34,MX.ink))+word('距離の二乗に反比例',650,160,{size:26,color:MX.ink,g:gi});
  return s;})()),

 'mx1-coulomb':(p,ctx)=>stage(ctx,p,(()=>{
  let s=pair(RX)+word('クーロンの法則',540,158,{size:32,color:MX.hi,anchor:'middle',g:G(ctx,'クーロン')});
  const gN=G(ctx,'二つの電荷'),gD=G(ctx,'二乗で割り'),gk=G(ctx,'定数');
  const c=coulomb(600,440,62,{gF:G(ctx,'力は'),gN,gD,gk});
  s+=dash(c.xq,c.yN,QX,PY+30,gN,MX.plus)+dash(c.xQ,c.yN,RX,PY+30,gN,MX.plus)+fade(gD*(.5+.5*Math.sin(ctx.t*5)),ring((QX+RX)/2,318,30,{color:RC,w:3}));
  s+=c.svg+word('定数',c.xk-70,500,{size:26,color:MX.hi,anchor:'middle',g:gk});
  return s;})()),

 'mx1-eps0':(p,ctx)=>stage(ctx,p,(()=>{
  const g1=G(ctx,'約九'),g2=G(ctx,'大学');
  let s=pair(RX,{g:.55});
  const c=coulomb(230,440,50,{kHi:smooth(ctx.t/.5)});
  s+=c.svg;
  s+=dash(c.xk+30,420,610,388,g1,MX.hi);
  s+=fade(g1,label('実験で測ると',840,350,{size:26,color:MX.dim,anchor:'middle'})+tx('k\\approx 9\\times10^{9}\\ \\mathrm{N\\,m^2/C^2}',840,398,38,MX.hi));
  s+=fade(g2,label('大学では',690,478,{size:26,color:MX.dim,anchor:'end'})+tex(`k=\\dfrac{1}{4\\pi{\\color{${MX.E}}\\varepsilon_0}}`,850,472,{size:40,color:MX.hi,auto:false}));
  s+=fade(g2*smooth((ctx.t-T(ctx,'イプシロンゼロ')-.2)/.4),ring(898,478,26,{color:MX.E,w:3}));
  return s;})()),

 'mx1-card-eps':(p,ctx)=>stage(ctx,p,(()=>{
  let s=expCard(0,80,140);
  const gb=smooth(ctx.t/.4);
  s+=callout(640,140,480,300,label('光の速さの計算',880,190,{size:30,color:MX.hi,anchor:'middle',weight:700})
   +rect(690,230,160,160,{fill:'#0d1526',fo:1,stroke:MX.E,sw:3,rx:14})+label('①',705,262,{size:26,color:MX.dim})
   +rect(910,230,160,160,{fill:'#0d1526',fo:1,stroke:'#33476e',sw:3,rx:14})+label('②',925,262,{size:26,color:MX.dim})+label('？',990,335,{size:56,color:'#3d4b66',anchor:'middle',weight:700}),gb);
  const u=smooth((ctx.t-T(ctx,'一つ目'))/.8);
  if(u>0){const x=mix(315,770,u),y=mix(385,315,u)-60*Math.sin(Math.PI*u);s+=tx('\\varepsilon_0',x,y+8,mix(50,64,u),MX.E);}
  if(u>=1)s+=fade(clamp((ctx.t-T(ctx,'一つ目')-.8)/.3),`<rect x="690" y="230" width="160" height="160" rx="14" fill="${MX.E}" fill-opacity=".12"/>`);
  s+=word('電気の力の強さ',80,488,{size:28,color:MX.E,g:G(ctx,'電気の力')})+word('実験で測った',365,488,{size:28,color:MX.ink,g:G(ctx,'実験で')});
  return s;})()),

 'mx1-gap':(p,ctx)=>stage(ctx,p,(()=>{
  let s=pair(RX,{br:0});
  const gg=G(ctx,'間に'),gq=G(ctx,'どうやって');
  s+=fade(gg,`<rect x="420" y="160" width="240" height="120" rx="14" fill="none" stroke="${MX.dim}" stroke-width="3" stroke-dasharray="10 8"/>`)+word('何もない',540,345,{size:32,color:MX.dim,anchor:'middle',g:gg});
  s+=fade(gq,label('？',540,245+6*Math.sin(ctx.t*4),{size:84,color:MX.hi,anchor:'middle',weight:700}));
  s+=word('どうやって押す？',540,450,{size:34,color:MX.hi,anchor:'middle',g:gq});
  return s;})()),

 // ===================== chapter 2 =====================
 'mx2-space':(p,ctx)=>stage(ctx,p,(()=>{
  const t0=T(ctx,'まわりの空間'),glow=Math.max(0,(ctx.t-t0)*450);
  let s=gridDots(SX,SY,glow);
  s+=fade(clamp(glow/300),`<circle cx="${SX}" cy="${SY}" r="${Math.min(260,glow)}" fill="${MX.E}" fill-opacity=".07"/>`);
  s+=charge(SX,SY,1,{r:28});
  s+=word('力が働く状態',960,470,{size:32,color:MX.E,anchor:'middle',g:G(ctx,'力が働く')});
  return s;})()),

 'mx2-field-arrows':(p,ctx)=>stage(ctx,p,(()=>{
  let s=gridDots(SX,SY,2000)+charge(SX,SY,1,{r:28});
  s+=word('電場',SX,SY+95,{size:34,color:MX.E,anchor:'middle',g:G(ctx,'電場といいます')});
  const u=smooth((ctx.t-T(ctx,'一クーロン')+.1)/.7),px=mix(1120,850,u),py=mix(190,235,u);
  const ga=G(ctx,'受ける力'),dx=px-SX,dy=py-SY,r=Math.hypot(dx,dy),L=Ef(r)*1.6;
  s+=fade(G(ctx,'表します'),gridArrows(SX,SY,1));
  if(u>0)s+=arrow(px+dx/r*16,py+dy/r*16,px+dx/r*(16+L),py+dy/r*(16+L),{color:MX.E,w:7,head:20,g:ga})+charge(px,py,1,{r:15,g:u})+fade(u,label('1 C',px,py+46,{size:28,color:MX.ink,anchor:'middle',weight:700}));
  return s;})()),

 'mx2-lines':(p,ctx)=>stage(ctx,p,(()=>{
  const tj=T(ctx,'つなげて'),tp=T(ctx,'プラスから');
  const gl=smooth((ctx.t-tj)/1.2),mv=smooth((ctx.t-tp+.1)/.6),gd=smooth((ctx.t-tp-.5)/1.4);
  let s=fade(1-gl,gridArrows(SX,SY,1));
  const R=rays(SX,SY,12);
  s+=fade(1-mv,`<g transform="translate(${(DP.x-SX)*mv} 0)">`+R.map(l=>fline(l,gl)).join('')+'</g>');
  if(gd>0)s+=dipole().map(l=>fline(l,gd)).join('');
  s+=charge(mix(SX,DP.x,mv),SY,1,{r:28})+charge(mix(1000,DM.x,mv),DM.y,-1,{r:28,g:mv});
  s+=word('電気力線',600,488,{size:34,color:MX.E,anchor:'middle',g:G(ctx,'電気力線')});
  return s;})()),

 'mx2-lines:density':(p,ctx)=>stage(ctx,p,(()=>{
  let s=dipole().map(l=>fline(l,1)).join('')+charge(DP.x,DP.y,1,{r:28})+charge(DM.x,DM.y,-1,{r:28});
  const gs=G(ctx,'線が混んで'),gn=G(ctx,'近くは'),gf=G(ctx,'遠くは');
  const lens=(x,y,g,col)=>fade(g,`<circle cx="${x}" cy="${y}" r="40" fill="${col}" fill-opacity=".10" stroke="${col}" stroke-width="4"/>`);
  s+=lens(372,320,gn,MX.hi)+lens(130,320,gf,MX.dim);
  s+=word('密 → 強い',372,240,{size:28,color:MX.hi,anchor:'middle',g:gn})+word('まばら → 弱い',140,410,{size:28,color:MX.ink,anchor:'middle',g:gf});
  s+=fade(gn,arrow(360,380,300,380,{color:MX.E,w:7,head:18}))+fade(gf,arrow(150,470,128,470,{color:MX.E,w:5,head:12}));
  s+=word('混んでいる ＝ 強い',930,160,{size:28,color:MX.ink,anchor:'middle',g:gs});
  return s;})()),

 // sphere group: + at (SPX,SPY), 16 rays; right panel for words
 'mx2-sphere':(p,ctx)=>stage(ctx,p,(()=>{
  let s=rays(SPX,SPY,16).map(l=>fline(l,smooth(ctx.t/1.2),{at:.72})).join('')+charge(SPX,SPY,1,{r:24});
  const gq=smooth(ctx.t/.5);
  s+=callout(700,140,470,150,tx('F\\propto\\dfrac{1}{r^2}',850,225,46,MX.ink)+label('なぜ？',1020,238,{size:40,color:MX.hi,anchor:'middle',weight:700}),gq);
  s+=word('線の混み具合で',935,400,{size:32,color:MX.E,anchor:'middle',g:G(ctx,'線の混み')});
  return s;})()),

 'mx2-sphere:area':(p,ctx)=>stage(ctx,p,(()=>{
  const R=90,gs=G(ctx,'半径'),gd=G(ctx,'均等に'),ga=G(ctx,'球の面積');
  let s=rays(SPX,SPY,16).map(l=>fline(l,1,{at:.72,opacity:1-.65*gs})).join('');
  s+=sphere(R,{g:gs,dots:gd})+charge(SPX,SPY,1,{r:20});
  s+=fade(gs,line(SPX,SPY,SPX-R,SPY,{color:'#ffffff',w:4})+tx('r',SPX-R-24,SPY+12,36,'#ffffff'));
  s+=callout(700,140,470,150,tx('F\\propto\\dfrac{1}{r^2}',850,225,46,MX.ink)+label('なぜ？',1020,238,{size:40,color:MX.hi,anchor:'middle',weight:700}),1-ga);
  s+=word('均等に広がる',935,190,{size:30,color:MX.E,anchor:'middle',g:gd*(1)});
  s+=fade(ga,label('球の面積',935,315,{size:30,color:MX.ink,anchor:'middle',weight:700})+tx('4\\pi r^2',935,400,64,MX.hi))+dash(SPX+R+6,SPY+20,860,390,ga,MX.hi);
  return s;})()),

 'mx2-sphere:grow':(p,ctx)=>stage(ctx,p,(()=>{
  const t2=T(ctx,'になると'),u=smooth((ctx.t-t2)/1.6),R=90*(1+u);
  let s=rays(SPX,SPY,16).map(l=>fline(l,1,{at:.8,opacity:.4})).join('');
  s+=sphere(R)+charge(SPX,SPY,1,{r:20});
  s+=line(SPX,SPY,SPX-R,SPY,{color:'#ffffff',w:4})+tx(u>.97?'2r':'r',SPX-R-(u>.97?36:24),SPY+12,36,'#ffffff');
  // fixed window on the sphere and its magnified inset
  const inWin=spherePts(R).filter(q=>q.x>=WIN.x0&&q.x<=WIN.x1&&q.y>=WIN.y0&&q.y<=WIN.y1);
  const gw=smooth(ctx.t/.5),IX=650,IY=165,IS=200,k=IS/(WIN.x1-WIN.x0);
  s+=fade(gw,rect(WIN.x0,WIN.y0,WIN.x1-WIN.x0,WIN.y1-WIN.y0,{fill:MX.hi,fo:.12,stroke:MX.hi,sw:3,rx:2})
   +dash(WIN.x1,WIN.y0,IX,IY,1,MX.hi)+dash(WIN.x1,WIN.y1,IX,IY+IS*(WIN.y1-WIN.y0)/(WIN.x1-WIN.x0),1,MX.hi)
   +rect(IX,IY,IS,IS*(WIN.y1-WIN.y0)/(WIN.x1-WIN.x0),{fill:'#0d1526',fo:1,stroke:MX.hi,sw:3,rx:6})
   +inWin.map(q=>dot(IX+(q.x-WIN.x0)*k,IY+(q.y-WIN.y0)*k,12,MX.E)).join('')
   +label('同じ広さの窓',IX+IS/2,IY-12,{size:24,color:MX.hi,anchor:'middle'})
   +label(`線 ${inWin.length}本`,IX+IS/2,IY+IS+62,{size:36,color:MX.E,anchor:'middle',weight:700}));
  s+=word('半径 ×2',1010,200,{size:30,color:MX.ink,anchor:'middle',g:G(ctx,'半径が二倍')});
  s+=word('面積 ×4',1010,300,{size:30,color:MX.hi,anchor:'middle',g:G(ctx,'面積は四倍')});
  s+=word('混み具合 ¼',1010,400,{size:30,color:MX.E,anchor:'middle',g:G(ctx,'混み具合は')});
  return s;})()),

 'mx2-bag':(p,ctx)=>stage(ctx,p,(()=>{
  const w=smooth((ctx.t-T(ctx,'でこぼこ')+.2)/.8),ph=ctx.t*.9;
  let s=bagSvg(w,ph,{g:w})+bagLines(w,ph,{dots:w})+charge(BX,BY,1,{r:24});
  s+=word('でこぼこの袋',240,220,{size:32,color:'#c9d3e6',anchor:'middle',g:G(ctx,'でこぼこ')});
  const gn=G(ctx,'線の本数');
  s+=word('出ていく線 12本',240,340,{size:32,color:MX.hi,anchor:'middle',g:gn});
  s+=word('形を変えても 同じ',240,450,{size:28,color:MX.ink,anchor:'middle',g:G(ctx,'変わりません')});
  return s;})()),

 'mx2-bag:outside':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=ctx.t*.6+2,OX=500,OY=190,go=smooth(ctx.t/.6);
  let s=bagSvg(w,ph)+bagLines(w,ph,{opacity:.8});
  let nin=0,nout=0,marks='';
  for(let k=0;k<16;k++){const a=2*Math.PI*(k+.5)/16,dx=Math.cos(a),dy=Math.sin(a);
   const far=Math.min(...[(dx>0?(1190-OX)/dx:(10-OX)/dx),(dy>0?(510-OY)/dy:(125-OY)/dy)].map(Math.abs));
   s+=fline([[OX+20*dx,OY+20*dy],[OX+far*dx,OY+far*dy]],go,{color:'#b9e6ff',w:3,opacity:.8,at:.25});
   for(const c of crossings(OX,OY,a,w,ph)){if(c.out)nout++;else nin++;
    marks+=c.out?dot(c.x,c.y,8,'#ffffff'):ring(c.x,c.y,8,{color:'#ffffff',w:3,fill:MX.bg});}}
  s+=fade(G(ctx,'入った分'),marks)+charge(BX,BY,1,{r:24})+charge(OX,OY,1,{r:24,g:go});
  s+=word('外の電荷',OX,OY-44,{size:26,color:MX.ink,anchor:'middle',g:go});
  const gi=G(ctx,'入った分'),gz=G(ctx,'差し引き'),gc=G(ctx,'中に包んだ');
  s+=callout(40,300,400,205,'',gi);
  s+=fade(gi,ring(80,345,9,{color:'#ffffff',w:3})+label(`入る ${nin}本`,100,356,{size:30,color:MX.ink,weight:700})+dot(270,345,9,'#ffffff')+label(`出る ${nout}本`,290,356,{size:30,color:MX.ink,weight:700}));
  s+=fade(gz,label('差し引き 0',240,420,{size:36,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(gc,label('効くのは 中の電荷だけ',240,480,{size:28,color:MX.plus,anchor:'middle',weight:700})+`<circle cx="${BX}" cy="${BY}" r="${40+4*Math.sin(ctx.t*5)}" fill="none" stroke="${MX.plus}" stroke-width="4"/>`);
  return s;})()),

 'mx2-gauss':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,gE=G(ctx,'つき抜ける'),gS=G(ctx,'全部足す'),gQ=G(ctx,'中の電荷'),gL=G(ctx,'ガウスの法則');
  let s=bagSvg(w,ph)+charge(BX,BY,1,{r:24})+fade(smooth(ctx.t/.4),label('Q',BX+30,BY-26,{size:30,color:MX.plus,weight:700}));
  const N=18,sweep=(ctx.t-T(ctx,'全部足す'))/1.6;
  for(let k=0;k<N;k++){const a=2*Math.PI*(k+.5)/N,R=bagR(a,w,ph),x=BX+R*Math.cos(a),y=BY+R*Math.sin(a),L=34*(150/R)**2+14,on=sweep>k/N&&sweep<k/N+.25;
   s+=arrow(x,y,x+L*Math.cos(a),y+L*Math.sin(a),{color:on?'#ffffff':MX.E,w:on?7:5,head:14,g:gE});}
  // one surface patch dA with its outward normal
  const a0=2*Math.PI*(.5)/N,R0=bagR(a0,w,ph),gp=smooth(ctx.t/.5);
  s+=fade(gp,`<circle cx="${BX+R0*Math.cos(a0)}" cy="${BY+R0*Math.sin(a0)}" r="16" fill="${MX.hi}" fill-opacity=".35" stroke="${MX.hi}" stroke-width="3"/>`+tx('d\\vec A',BX+R0*Math.cos(a0)+50,BY+R0*Math.sin(a0)+48,30,MX.hi));
  // formula at left, built in two halves
  const y=300,sz=56,wl=texWidth(`\\oint \\vec E\\cdot d\\vec A\\,`,sz,false),wr=texWidth(`=\\dfrac{Q}{\\varepsilon_0}`,sz,false),x0=320-(wl+wr)/2;
  s+=fade(gS,tex(`\\oint {\\color{${MX.E}}\\vec E}\\cdot d\\vec A\\,`,x0,y,{size:sz,anchor:'start',color:MX.ink,auto:false}));
  s+=fade(gQ,tex(`=\\dfrac{{\\color{${MX.plus}}Q}}{\\varepsilon_0}`,x0+wl,y,{size:sz,anchor:'start',color:MX.ink,auto:false}));
  s+=dash(x0+wl*.45,y+30,BX-150,BY+60,gS,MX.E)+dash(x0+wl+wr*.6,y-40,BX-10,BY-30,gQ,MX.plus);
  s+=word('ガウスの法則',320,440,{size:34,color:MX.hi,anchor:'middle',g:gL});
  s+=fade(gL,line(x0+20,y-60,150,114,{color:MX.hi,w:3,dash:'9 7'})+dot(150,114,6,MX.hi));
  return s;})()),

 'mx2-gauss:read':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4;
  let s=bagSvg(w,ph)+bagLines(w,ph,{dots:0,opacity:.85})+charge(BX,BY,1,{r:24})+label('Q',BX+30,BY-26,{size:30,color:MX.plus,weight:700});
  // a tracer runs once around the surface; exit points light up and are counted
  const t0=T(ctx,'包んだ面'),u=clamp((ctx.t-t0)/2.6),thr=2*Math.PI*u;let n=0;
  for(let k=0;k<bagRays;k++){const a=rayA(k),R=bagR(a,w,ph),lit=a<=thr&&u>0;if(lit)n++;s+=dot(BX+R*Math.cos(a),BY+R*Math.sin(a),lit?9:6,lit?MX.hi:'#56657f');}
  if(u>0&&u<1){const R=bagR(thr,w,ph);s+=draw(Array.from({length:Math.max(2,Math.round(90*u))},(_,i)=>{const a=thr*i/Math.max(1,Math.round(90*u)-1),r=bagR(a,w,ph);return [BX+r*Math.cos(a),BY+r*Math.sin(a)];}),1,{color:MX.hi,w:6})+dot(BX+R*Math.cos(thr),BY+R*Math.sin(thr),11,'#ffffff');}
  const y=300,sz=56,wl=texWidth(`\\oint \\vec E\\cdot d\\vec A\\,`,sz,false),wr=texWidth(`=\\dfrac{Q}{\\varepsilon_0}`,sz,false),x0=320-(wl+wr)/2;
  const gi=G(ctx,'丸の付いた');
  s+=fade(gi,`<rect x="${x0-8}" y="${y-62}" width="${texWidth('\\oint',sz,false)+44}" height="100" rx="10" fill="${MX.hi}" fill-opacity=".15" stroke="${MX.hi}" stroke-width="3"/>`);
  s+=tex(`\\oint {\\color{${MX.E}}\\vec E}\\cdot d\\vec A\\,`,x0,y,{size:sz,anchor:'start',color:MX.ink,auto:false})+tex(`=\\dfrac{{\\color{${MX.plus}}Q}}{\\varepsilon_0}`,x0+wl,y,{size:sz,anchor:'start',color:MX.ink,auto:false});
  s+=word('面全体で足す',x0+10,180,{size:28,color:MX.hi,g:gi});
  const gc=G(ctx,'線の数え方');
  s+=fade(u>0?1:0,label(`${n}本`,500,432,{size:36,color:MX.hi,weight:700}));
  s+=word('＝ 出ていく線の数',300,420,{size:32,color:MX.E,anchor:'middle',g:gc})+dash(x0+wl*.5,y+40,x0+wl*.5,392,gc,MX.E);
  s+=fade(gi,line(x0+20,y-62,150,114,{color:MX.hi,w:3,dash:'9 7'})+dot(150,114,6,MX.hi));
  return s;})()),

 'mx2-to-magnet':(p,ctx)=>stage(ctx,p,(()=>{
  const L=fieldLines([{x:200,y:320,q:1},{x:470,y:320,q:-1}],{n:14,step:3,maxSteps:700,bounds:[30,125,625,510]});
  let s=L.map(l=>fline(l,smooth(ctx.t/1.2))).join('')+charge(200,320,1,{r:26})+charge(470,320,-1,{r:26});
  s+=word('出発点',200,470,{size:30,color:MX.plus,anchor:'middle',g:G(ctx,'出発点')})+word('終点',470,470,{size:30,color:MX.minus,anchor:'middle',g:G(ctx,'終点')});
  s+=line(650,150,650,500,{color:MX.faint,w:2});
  const gm=G(ctx,'磁石の線');
  s+=magnet(920,310,{w:280,h:76,g:gm});
  s+=fade(gm,[[-1,1],[1,1],[-1,-1],[1,-1]].map(([sx,sy],i)=>`<path d="M${920+sx*120} ${310+sy*40} C${920+sx*190} ${310+sy*150} ${920-sx*10} ${310+sy*170} ${920} ${310+sy*150}" fill="none" stroke="${MX.B}" stroke-width="3" stroke-dasharray="8 8" opacity=".6"/>`).join('')
   +[[790,190],[1050,190],[790,430],[1050,430]].map(([x,y],i)=>label('？',x,y+10+5*Math.sin(ctx.t*4+i),{size:40,color:MX.B,anchor:'middle',weight:700})).join(''));
  s+=word('磁石の線は？',920,488,{size:30,color:MX.B,anchor:'middle',g:gm});
  return s;})()),
};
