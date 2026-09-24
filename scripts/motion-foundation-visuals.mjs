// Original diagrams: every dispatcher branch has a specific physical claim.
import {C,text,line,circle,arrow,path,clamp,fmt} from './all-film-visuals.mjs';
import {texBox} from './revision-tex.mjs';
const ease=p=>{p=clamp(p/.7);return p*p*(3-2*p);};
const mix=(a,b,p)=>a+(b-a)*p;
const ring=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.dim}" stroke-width="2"/>`;
const words=(s,n=43)=>{const rows=[];let row='',w=0;for(const ch of s){const k=/[\x20-\x7e]/.test(ch)?.55:1;if(w+k>n&&!/[。、）」]/.test(ch)){rows.push(row);row='';w=0;}row+=ch;w+=k;}if(row)rows.push(row);return rows;};
const axes=(ylabel,xlabel='時刻 t [s]')=>line(120,365,960,365)+line(120,365,120,35)+text(ylabel,125,25,25)+text(xlabel,860,411,23);
const person=(x,y,c=C.cyan)=>circle(x,y-44,13,c)+line(x,y-30,x,y,c,5)+line(x,y-20,x-19,y-6,c,4)+line(x,y-20,x+19,y-6,c,4)+line(x,y,x-16,y+25,c,4)+line(x,y,x+16,y+25,c,4);
const road=(y=200)=>line(150,y,1050,y)+[0,1,2,3].map(i=>line(170+i*270,y-5,170+i*270,y+7)+text(`${i} m`,150+i*270,y+38,23)).join('')+text('右を正にする →',825,y+85,24,C.dim);
function trip(kind,p){
 const u=ease(p),t=6*u,x=t<=3?t:6-t,px=170+x*270;
 if(kind==='compare-rest')return text('どちらも、出発点へ戻った後の位置は同じ',130,40,29)+[0,1].map(i=>{const y=135+i*215,pos=i?px:170;return line(150,y+35,1050,y+35)+person(pos,y)+text(i?'往復した人':'止まった人',150,y+88,25,i?C.cyan:C.dim);}).join('');
 let out=road()+person(kind==='distance'||kind==='displacement'?170:px,174)+text(`時刻 ${fmt(kind==='distance'||kind==='displacement'?6:t)} s`,150,62,27);
 if(kind==='distance')out+=arrow(170,315,mix(170,980,clamp(u*2)),315,C.gold)+text('行き 3 m',480,300,26,C.gold)+arrow(980,400,mix(980,170,clamp(u*2-1)),400,C.purple)+text('帰り 3 m',480,440,26,C.purple);
 else if(kind==='displacement')out+=circle(170,200,20,C.gold,.2)+text('最初の位置：0 m',150,315,27,C.gold)+text('最後の位置：0 m',640,315,27,C.cyan)+text('位置の変化：0 m',380,420,32);
 else out+=path([[170,310],[170+270*Math.min(3,t),310]],C.gold,7)+path([[980,395],[980-270*Math.max(0,t-3),395]],C.purple,7)+text('行きの道のり',160,287,24,C.gold)+text('帰りの道のり',800,440,24,C.purple);
 return out;
}
const gx=t=>120+t*160,gy=x=>365-x*32;
function positionGraph(kind,p){
 const u=ease(p);
 if(kind==='trip-graph'){
  const t=6*u,x=t<=3?t:6-t;
  return axes('位置 x [m]')+path(Array.from({length:61},(_,i)=>{const q=t*i/60;return[120+q*130,365-(q<=3?q:6-q)*90];}),C.cyan,4)+circle(120+t*130,365-x*90,9,C.gold)+text('往復した人：上がってから、元の位置へ戻る',150,455,26);
 }
 if(kind==='slope-signs')return [1,-1,0].map((v,i)=>{const ox=75+i*365,oy=290,w=260,h=140;return line(ox,oy,ox+w,oy)+line(ox,oy,ox,oy-180)+text('時刻',ox+205,oy+35,22)+text('位置',ox-20,oy-200,22)+path([[ox,oy-80+v*55],[ox+w,oy-80-v*55]],C.cyan,4)+circle(ox+w*u,oy-80+v*55-v*110*u,8,C.gold)+arrow(ox+130,410,ox+130+v*85,410,C.cyan)+text(['右へ進む','左へ進む','止まる'][i],ox+60,460,26);}).join('');
 const t=mix(2,4,u),x=1+3*(t-2);
 let out=axes('位置 x [m]')+path([[gx(2),gy(1)],[gx(4),gy(7)]],C.cyan,4)+circle(gx(2),gy(1),8,C.cyan)+circle(gx(4),gy(7),8,C.gold)+text('(2 s, 1 m)',gx(2)-160,gy(1)-20,23,C.cyan)+text('(4 s, 7 m)',gx(4)-20,gy(7)-25,23,C.gold);
 if(kind==='slope-triangle')out+=arrow(gx(2),gy(1),mix(gx(2),gx(4),u),gy(1),C.gold)+arrow(gx(4),gy(1),gx(4),mix(gy(1),gy(7),u),C.purple)+text('時間の差 2 s',gx(2)+45,gy(1)+67,25,C.gold)+text('位置の差 6 m',gx(4)+20,gy(4),25,C.purple);
 else out+=circle(gx(t),gy(x),10,C.purple)+line(160,455,1000,455)+person(170+x*85,430)+text('実際の道は水平',140,495,23,C.dim);
 return out;
}
const cx=t=>140+230*t,cy=x=>375-27*x;
function derivative(kind,p){
 const u=ease(p),base=axes('位置 x [m]')+path(Array.from({length:101},(_,i)=>{const t=3.2*i/100;return[cx(t),cy(t*t)];}),C.cyan,4);
 if(kind==='square-record')return base+[1,2,3].map(t=>circle(cx(t),cy(t*t),9,t===2?C.cyan:C.gold)+text(`${t} s → ${t*t} m`,cx(t)-45,cy(t*t)-25,24)).join('')+text('時間を同じ 1 s ずつ進めても、位置の増え方は違う',120,460,26);
 if(kind==='derivative-graph'){
  // A matched pair of graphs is geometry, not a simultaneous algebra panel.
  return [0,1].map(i=>{const ox=95+i*570,oy=350;let s=line(ox,oy,ox+410,oy)+line(ox,oy,ox,70)+text(i?'速度 v [m/s]':'位置 x [m]',ox,40,25)+text('時刻 t [s]',ox+290,oy+40,23);s+=path(Array.from({length:81},(_,j)=>{const t=3*j/80;return[ox+t*125,oy-(i?2*t*40:t*t*27)];}),i?C.purple:C.cyan,4);const t=3*u,yy=i?2*t*40:t*t*27;s+=circle(ox+t*125,oy-yy,9,C.gold);if(!i)s+=line(ox+t*125-40,oy-yy+40*(2*t*27/125),ox+t*125+40,oy-yy-40*(2*t*27/125),C.gold,3);return s;}).join('')+text('左の傾きの値を、右の高さとして記録する',270,460,28);
 }
 const dt=kind==='secant-shrink'?mix(1,.03,u):1,t0=2,x0=4,slope=4+dt;
 let out=base+circle(cx(t0),cy(x0),10,C.cyan)+circle(cx(t0+dt),cy((t0+dt)**2),9,C.gold)+line(cx(1),cy(4-slope),cx(3.2),cy(4+1.2*slope),C.gold,3)+line(cx(2),cy(4),cx(2+dt),cy(4),C.purple,3)+line(cx(2+dt),cy(4),cx(2+dt),cy((2+dt)**2),C.purple,3);
 out+=text('青：2秒の位置',140,420,24,C.cyan)+text('黄：少し後の位置',520,420,24,C.gold)+text(`時間の幅 ${fmt(dt,2)} s　平均速度 ${fmt(slope,2)} m/s`,170,465,28);
 return out;
}
function car(x,y,color){return `<rect x="${x-40}" y="${y-25}" width="80" height="35" rx="8" fill="${color}"/>`+circle(x-25,y+15,10,C.dim)+circle(x+25,y+15,10,C.dim);}
function signed(kind,p){
 const u=ease(p),rows=kind==='slow-right'?[0]:kind==='fast-left'?[1]:[0,1];
 return text('右が正 →　矢印の長さ：速さ／矢印の向き：進む方向',110,35,27)+rows.map((i,j)=>{
  const y=140+j*225,v=i?-2-2*u:4-2*u,c=i?C.purple:C.cyan;
  // Integrated linear v(u); animation displacement and arrow length agree.
  const x=i?850+70*(-2*u-u*u):350+70*(4*u-u*u);
  return line(120,y+30,1080,y+30)+car(x,y,c)+arrow(x,y-55,x+v*45,y-55,c)+text(`速度 ${fmt(v)} m/s`,120,y+85,27,c)+text(i?'左へ進み、速くなる':'右へ進み、遅くなる',690,y+85,25,c)+(kind==='same-change'?arrow(530,y+100,440,y+100,C.red,'変化：左向き'):'');
 }).join('');
}
const vx=t=>160+t*370,vy=v=>360-v*34;
function accelerationGraph(kind,p){
 const u=ease(p),t=2*u,base=axes('速度 v [m/s]');
 if(kind==='velocity-record')return text('二つの時刻で測った速度',340,35,29)+[0,1].map(i=>{const x=290+i*540,y=180,v=i?8:2;return car(x,y,C.cyan)+arrow(x-85,270,x-85+v*25,270,C.cyan)+text(`時刻 ${i*2} s`,x-65,95,28,C.gold)+text(`速度 ${v} m/s`,x-85,345,29,C.cyan);}).join('')+text('途中の増え方は、まだ決めていない',320,460,27,C.dim);
 if(kind==='constant-velocity')return base+line(vx(0),vy(4),vx(2),vy(4),C.cyan,4)+circle(vx(t),vy(4),9,C.gold)+text('速度は、ずっと 4 m/s',400,160,30,C.cyan)+text('縦の差 0 → 加速度 0',370,460,28);
 let out=base+path([[vx(0),vy(2)],[vx(2),vy(8)]],C.cyan,4)+circle(vx(0),vy(2),8,C.cyan)+circle(vx(2),vy(8),8,C.gold);
 if(kind!=='constant-acceleration')out+=text('(0 s, 2 m/s)',125,330,24,C.cyan)+text('(2 s, 8 m/s)',875,66,24,C.gold);
 if(kind==='average-not-constant')out+=path(Array.from({length:81},(_,i)=>{const q=2*i/80;return[vx(q),vy(2+1.5*q*q)];}),C.purple,4)+circle(vx(t),vy(2+1.5*t*t),9,C.purple)+text('同じ両端でも、途中の増え方は違う',300,460,28,C.purple);
 else if(kind==='constant-acceleration')out+=[0,1,2].map(q=>circle(vx(q),vy(2+3*q),9,C.gold)+text(`${q} s：${2+3*q} m/s`,vx(q)-35,vy(2+3*q)-25,23,C.gold)).join('')+circle(vx(t),vy(2+3*t),10,C.purple)+text('加速度が一定のときだけ、毎秒同じ量ずつ増える',190,460,27);
 else out+=arrow(vx(0),vy(2),vx(2),vy(2),C.gold)+arrow(vx(2),vy(2),vx(2),vy(8),C.purple)+text('時間の差 2 s',410,340,25,C.gold)+text('速度の差 6 m/s',910,215,23,C.purple);
 return out;
}
function vector(kind,p){
 const u=ease(p),h=kind==='vector-limit'?mix(.9,.025,u):.9,R=kind==='orbit-velocity'||kind==='orbit-inward'?180:135,V=110,ox=280,oy=255;
 if(kind==='orbit-velocity'||kind==='orbit-inward'){
  const a=2*Math.PI*u,x=ox+R*Math.cos(a),y=oy-R*Math.sin(a);
  return ring(ox,oy,R)+circle(ox,oy,6,C.dim)+circle(x,y,12,C.purple)+arrow(x,y,x-V*Math.sin(a),y-V*Math.cos(a),C.cyan)+(kind==='orbit-inward'?arrow(x,y,x-80*Math.cos(a),y+80*Math.sin(a),C.red):'')+text('速さ：一定',620,150,32,C.cyan)+text('速度の向き：変わる',620,215,32,C.cyan)+text(kind==='orbit-inward'?'赤：瞬間の加速度':'青：その瞬間の速度',620,305,28,kind==='orbit-inward'?C.red:C.cyan);
 }
 const A=[ox+R,oy],B=[ox+R*Math.cos(h),oy-R*Math.sin(h)],v0=[0,-V],v1=[-V*Math.sin(h),-V*Math.cos(h)];
 let out=ring(ox,oy,R)+circle(...A,9,C.cyan)+circle(...B,9,C.gold)+line(ox,oy,...A)+line(ox,oy,...B)+arrow(...A,A[0]+v0[0],A[1]+v0[1],C.cyan)+arrow(...B,B[0]+v1[0],B[1]+v1[1],C.gold)+text('円周上の二つの位置',130,450,26);
 if(kind==='orbit-two')return out+text('青：前の速度',660,170,29,C.cyan)+text('黄：後の速度',660,245,29,C.gold)+text('二本の長さは同じ、向きは違う',615,335,26);
 const target=[890,300],a=kind==='vector-align'?u:1,P=A.map((x,i)=>mix(x,target[i],a)),Q=B.map((x,i)=>mix(x,target[i],a));
 out+=arrow(...P,P[0]+v0[0],P[1]+v0[1],C.cyan)+arrow(...Q,Q[0]+v1[0],Q[1]+v1[1],C.gold);
 if(kind!=='vector-align'){
  out+=arrow(target[0],target[1]-V,target[0]+v1[0],target[1]+v1[1],C.red)+text('赤：前に足すと、後になる矢印',620,410,26,C.red);
  if(kind==='vector-limit'){
   const dx=v1[0]-v0[0],dy=v1[1]-v0[1],length=Math.hypot(dx,dy);
   out+=arrow(...A,A[0]+dx/length*100,A[1]+dy/length*100,C.red)+text('向きの比較用：赤の長さを拡大',130,495,23,C.red);
  }
 }
 return out+text('同じ根元で比べる',755,80,27);
}
export const motionDiagramKinds=['round-trip','distance','displacement','compare-rest','trip-graph','position-graph','slope-triangle','slope-signs','square-record','secant','secant-shrink','derivative-graph','signed-velocity','slow-right','fast-left','same-change','velocity-record','acceleration-slope','average-not-constant','constant-acceleration','constant-velocity','orbit-velocity','orbit-two','vector-align','vector-add','vector-limit','orbit-inward'];
export function motionDiagram(kind,p){
 if(['round-trip','distance','displacement','compare-rest'].includes(kind))return trip(kind,p);
 if(['trip-graph','position-graph','slope-triangle','slope-signs'].includes(kind))return positionGraph(kind,p);
 if(['square-record','secant','secant-shrink','derivative-graph'].includes(kind))return derivative(kind,p);
 if(['signed-velocity','slow-right','fast-left','same-change'].includes(kind))return signed(kind,p);
 if(['velocity-record','acceleration-slope','average-not-constant','constant-acceleration','constant-velocity'].includes(kind))return accelerationGraph(kind,p);
 if(['orbit-velocity','orbit-two','vector-align','vector-add','vector-limit','orbit-inward'].includes(kind))return vector(kind,p);
 throw Error(`No authored motion diagram: ${kind}`);
}
// Common baseline and actual glyph widths preserve legibility of fractions.
const atoms=new Map();
function atom(tex){
 if(atoms.has(tex))return atoms.get(tex);
 const colors={x:C.cyan,t:C.gold,v:C.purple,a:C.red,k:C.dim};
 // Preserve LaTeX environment names and upright text. A variable colour must
 // never turn \begin{aligned} into an invalid environment name.
 const colored=tex.replace(/\\(?:begin|end|text|mathrm|operatorname)\{[^{}]*\}|\\[a-zA-Z]+|[xtvak]/g,v=>v.startsWith('\\')?v:`{\\color{${colors[v]}}${v}}`);
 let svg=texBox(`\\color{${C.ink}}{${colored}}`,0,0,1800,90);
 if(svg.includes('data-mjx-error'))throw Error(`Invalid formula ${tex}`);
 const [,vy,w,h]=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number),unit=.065;
 svg=svg.replace(/width="[^"]*"/,`width="${w*unit}"`).replace(/height="[^"]*"/,`height="${h*unit}"`).replace(/ x="[^"]*"/,' x="0"').replace(/ y="[^"]*"/,` y="${50+vy*unit}"`);
 const result={svg,w:w*unit,top:50+vy*unit,bottom:50+(vy+h)*unit};atoms.set(tex,result);return result;
}
function layout(tokens,maxHeight=190){
 const occurrences={},items=tokens.map(tex=>({...atom(tex),tex,key:`${tex}:${occurrences[tex]=(occurrences[tex]??0)+1}`}));
 const width=items.reduce((n,t)=>n+t.w+18,0)-18;
 const height=items.length?Math.max(...items.map(a=>a.bottom))-Math.min(...items.map(a=>a.top)):1;
 const scale=Math.min(1,1130/Math.max(1,width),maxHeight/height);let x=640-width*scale/2;
 return items.map(item=>{const result={...item,x,scale};x+=(item.w+18)*scale;return result;});
}
function formula(q,p){
 const before=layout(q.previousFormula??[],135),after=layout(q.formula),u=ease(p),hasBefore=before.length>0;
 const top=items=>items.length?Math.min(...items.map(a=>a.top*a.scale)):0;
 const bottom=items=>items.length?Math.max(...items.map(a=>a.bottom*a.scale)):0;
 const oldY=195-top(before),newY=(hasBefore?Math.max(365,oldY+bottom(before)+45):300)-top(after);
 const token=(a,x,y,alpha)=>`<g opacity="${alpha}" transform="translate(${x} ${y}) scale(${a.scale})">${a.svg}</g>`;
 const old=before.map(a=>token(a,a.x,oldY,.38)).join('');
 const next=after.map(a=>{const from=before.find(b=>b.key===a.key);return token(a,mix(from?.x??a.x,a.x,u),mix(from?oldY:newY,newY,u),from?1:u);}).join('');
 const y=newY+bottom(after)+20;
 if(y>603)throw Error('Equation stack overlaps subtitles');
 const highlights=after.filter(a=>!before.some(b=>b.key===a.key)).map(a=>`<g opacity="${.6*u}">${line(a.x,y,a.x+a.w*a.scale,y,C.gold,2)}</g>`).join('');
 return (hasBefore?text('直前の式',60,208,22,C.dim):'')+old+highlights+next;
}
export function motionFoundationFrame(c,s,t){
 if(c.visualPilot!=='motion-foundations-v1')return null;
 return authoredMotionFrame(c,s,t,motionDiagram);
}
export function authoredMotionFrame(c,s,t,motionDiagram){
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),cap=s.captions[k],q=s.cues[k];
 if(!q||!['diagram','equation'].includes(q.display))throw Error(`Missing display ${c.id}/${s.index}/${k}`);
 const p=clamp((t-cap.start)/Math.max(.05,cap.end-cap.start));
 const lines=words(cap.text);if(lines.length>3)throw Error(`Caption overflow ${c.id}/${s.index}/${k}`);
 const op=words(q.operation,46);if(op.length>2)throw Error(`Operation overflow ${c.id}/${s.index}/${k}`);
 const content=q.display==='diagram'?`<svg data-presentation="diagram" x="40" y="114" width="1200" height="500" viewBox="0 0 1200 510">${motionDiagram(q.diagram,p)}</svg>`:`<g data-presentation="equation">${op.map((v,i)=>text(v,50,130+i*31,25,C.gold)).join('')}${formula(q,p)}</g>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="760"><style>text{font-family:'Hiragino Sans',sans-serif}</style><rect width="1280" height="760" fill="#0b1122"/>${text(c.title,38,39,29)}${text(s.heading,38,80,23,C.dim)}${content}${line(35,626,1245,626,'#28364e')}${lines.map((v,i)=>text(v,40,659+i*29,27)).join('')}${text('音声：VOICEVOX Nemo 男声1',38,745,15,C.dim)}${text(`${s.index+1} / ${c.scenes.length}`,1165,745,18,C.dim)}<rect x="0" y="755" width="${1280*t/c.duration}" height="5" fill="${C.cyan}"/></svg>`;
}
