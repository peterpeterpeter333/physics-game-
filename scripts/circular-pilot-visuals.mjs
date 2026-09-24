import {text,line,circle,arrow,path,C,clamp,esc,rect} from './all-film-visuals.mjs';
import {texBox} from './revision-tex.mjs';
const smooth=p=>{p=clamp(p);return p*p*(3-2*p);};
const mix=(a,b,p)=>a+(b-a)*p;
const ring=(x,y,r,color=C.dim)=>`<circle cx="${x}" cy="${y}" r="${r}" stroke="${color}" stroke-width="2" fill="none"/>`;
const wrap=(s,n=41)=>{const rows=[];let row='',w=0;for(const c of s){const k=/[\x20-\x7e]/.test(c)?.55:1;if(w+k>n){rows.push(row);row='';w=0;}row+=c;w+=k;}if(row)rows.push(row);return rows;};
const colors={v:C.cyan,r:C.gold,m:C.purple,M:C.red,G:C.red,T:C.green,a:C.red,F:C.red};
function colored(tex){
 // Commands must remain intact; only variable letters outside commands acquire
 // the same semantic colour as their corresponding geometry.
 return tex.replace(/\\Delta v|\\ell|\\[a-zA-Z]+|[vrmMGTaF]/g,t=>t==='\\Delta v'?`{\\color{${C.red}}${t}}`:t==='\\ell'?`{\\color{${C.green}}${t}}`:t.startsWith('\\')?t:`{\\color{${colors[t]}}${t}}`);
}
const atoms=new Map();
function atom(tex){
 if(atoms.has(tex))return atoms.get(tex);
 let svg=texBox(`\\color{${C.ink}}{${colored(tex)}}`,0,0,1800,90);
 const [vx,vy,vw,vh]=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
 // One mathematical font size and one baseline, including fractions. Giving
 // every token the same bounding-box height makes '=' huge and fractions tiny.
 const unit=.034,w=vw*unit;
 svg=svg.replace(/width="[^"]*"/,`width="${w}"`).replace(/height="[^"]*"/,`height="${vh*unit}"`).replace(/ x="[^"]*"/,' x="0"').replace(/ y="[^"]*"/,` y="${46+vy*unit}"`);
 const a={svg,w};atoms.set(tex,a);return a;
}
function layout(formula){
 const seen={};const raw=formula.map(tex=>({...atom(tex),tex,key:`${tex}:${seen[tex]=(seen[tex]??0)+1}`}));
 const total=raw.reduce((n,t)=>n+t.w+13,0)-13,scale=Math.min(1,650/Math.max(1,total));let x=570+(650-total*scale)/2;
 return raw.map(t=>{const a={...t,x,scale};x+=(t.w+13)*scale;return a;});
}
const token=(a,x,y,opacity=1)=>`<g opacity="${opacity}" transform="translate(${x} ${y}) scale(${a.scale})">${a.svg}</g>`;
function equation(previous,current,p){
 const before=layout(previous),after=layout(current),u=smooth(p/.32);
 const old=before.map(a=>{
  const cancelled=a.tex==='\\frac{m}{m}'&&!current.includes(a.tex);
  return token(cancelled?{...a,svg:atom('\\frac{\\cancel{m}}{\\cancel{m}}').svg}:a,a.x,220,.45);
 }).join('');
 const reciprocalFrom=before.find(a=>a.tex==='\\frac{GM}{r}'||a.tex==='\\frac{3}{2}');
 const reciprocalTo=after.find(a=>a.tex===(reciprocalFrom?.tex==='\\frac{GM}{r}'?'\\frac{r}{GM}':'\\frac{2}{3}'));
 const moving=after.map(a=>{
  if(a===reciprocalTo&&reciprocalFrom&&u<1){
   const [n,d]=reciprocalFrom.tex==='\\frac{GM}{r}'?['GM','r']:['3','2'];
   const cx0=reciprocalFrom.x+reciprocalFrom.w*reciprocalFrom.scale/2,cx1=a.x+a.w*a.scale/2;
   const numerator=atom(n),denominator=atom(d),arc=Math.sin(Math.PI*u)*35;
   const piece=(v,x,y)=>token({...v,scale:a.scale},x-v.w*a.scale/2,y);
   return piece(numerator,mix(cx0,cx1,u)+arc,mix(200,381,u))
    +piece(denominator,mix(cx0,cx1,u)-arc,mix(246,335,u))
    +line(a.x,389,a.x+a.w*a.scale,389,C.ink,2);
  }
  const from=before.find(b=>b.key===a.key);return token(a,mix(from?.x??a.x,a.x,u),mix(from?220:370,355,u),from?1:u);
 }).join('');
 const changed=after.filter(a=>!before.some(b=>b.key===a.key)).map(a=>`<rect x="${a.x-4}" y="338" width="${a.w*a.scale+8}" height="86" rx="7" fill="none" stroke="${C.gold}" opacity="${.65*u}"/>`).join('');
 return (before.length?text('直前の式',570,190,21,C.dim)+old:'')+text('今の操作',570,310,21,C.ink)+changed+moving;
}
function orbit(t,kind,radialLabel='F'){
 const theta=t*.52,R=128,cx=250,cy=320;
 const x=cx+R*Math.cos(theta),y=cy-R*Math.sin(theta);
 if(kind==='release'){
  const p=smooth((t%9)/9),a=.55,X=cx+R*Math.cos(a)-p*200*Math.sin(a),Y=cy-R*Math.sin(a)-p*200*Math.cos(a);
  return ring(cx,cy,R)+line(cx+R*Math.cos(a),cy-R*Math.sin(a),cx+R*Math.cos(a)-210*Math.sin(a),cy-R*Math.sin(a)-210*Math.cos(a),C.cyan,2,'7 5')+circle(X,Y,12)+arrow(X,Y,X-65*Math.sin(a),Y-65*Math.cos(a),C.cyan,'v')+text('ひもなし・水平な合力 0',60,525,24);
 }
 const gravity=['gravity','circumference','compare'].includes(kind);
 let s=ring(cx,cy,R)+circle(cx,cy,gravity?36:7,gravity?'#315c9d':C.dim)+line(cx,cy,x,y,C.gold,2,gravity?'6 5':'')+text('r',cx+R/2*Math.cos(theta)+20*Math.sin(theta),cy-R/2*Math.sin(theta)+20*Math.cos(theta),24,C.gold)+circle(x,y,11,C.purple)+arrow(x,y,x-74*Math.sin(theta),y-74*Math.cos(theta),C.cyan,'v')+arrow(x,y,x-74*Math.cos(theta),y+74*Math.sin(theta),C.red);
 s+=text(`${radialLabel}：中心向きの${radialLabel==='a'?'加速度':'力'}`,55,kind==='circumference'?600:560,24,C.red);
 s+=text(gravity?'地球 M':'固定した中心',80,155,25,gravity?C.red:C.ink)+text(gravity?'衛星 m':'球 m',340,510,25,C.purple);
 if(kind==='reaction')s+=arrow(cx,cy,cx+70*Math.cos(theta),cy-70*Math.sin(theta),C.purple,'手への力');
 if(kind==='circumference'){
  const p=(t%10)/10;
  s+=path(Array.from({length:61},(_,i)=>{const a=2*Math.PI*p*i/60;return[cx+R*Math.cos(a),cy-R*Math.sin(a)];}),C.gold,5)+text('一周の道のり：2πr',85,560,26,C.gold);
 }
 return s;
}
function triangles(t,kind,phase){
 const h=kind==='limit'?mix(.95,.055,smooth(phase)):.75;
 const R=110,V=105,cx=185,cy=240,d=R*Math.sin(h/2),x=cx+R*Math.cos(h/2);
 let s=ring(cx,cy,R)+arrow(cx,cy,x,cy+d,C.gold)+arrow(cx,cy,x,cy-d,C.gold)+line(x,cy+d,x,cy-d,C.green,4)+text('ℓ',x+15,cy+6,24,C.green)+text('二つの位置',55,110,23)+text('r：どちらの半径も同じ長さ',45,365,20,C.gold)+text('青い速度を同じ始点へ移す',55,395,22,C.cyan);
 s+=path(Array.from({length:20},(_,i)=>{const a=-h/2+h*i/19;return[cx+38*Math.cos(a),cy+38*Math.sin(a)];}),C.gold)+text('θ',cx+40,cy-25,20,C.gold);
 const p=kind==='limit'?1:smooth(phase*2);
 const origin1=[mix(x,185,p),mix(cy+d,525,p)],origin2=[mix(x,185,p),mix(cy-d,525,p)];
 const dx=V*Math.sin(h/2),dy=-V*Math.cos(h/2);
 s+=arrow(...origin1,origin1[0]+dx,origin1[1]+dy,C.cyan)+arrow(...origin2,origin2[0]-dx,origin2[1]+dy,C.cyan);
 if(p>.99)s+=arrow(185+dx,525+dy,185-dx,525+dy,C.red)+text('v',135,477,23,C.cyan)+text('v',225,477,23,C.cyan)+line(185,525+dy,325,435,C.red,1)+text('Δv',335,442,24,C.red);
 if(p>.99)s+=path(Array.from({length:20},(_,i)=>{const a=-h/2+h*i/19;return[185+38*Math.sin(a),525-38*Math.cos(a)];}),C.gold)+text('θ',180,475,20,C.gold);
 s+=text('同じ角度・それぞれ二辺が同じ長さ',40,590,22,C.dim);
 return s;
}
function compare(t,double=false){
 let s='';for(let j=0;j<2;j++){
  const cx=250,cy=235+j*240,R=double?75:(j?90:45),w=double?(j?1.1:.55):(j?.2:1.6),a=t*w;
  const x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);
  s+=ring(cx,cy,R)+circle(cx,cy,double?4:12,double?C.dim:C.red)+circle(x,y,8,C.purple)+arrow(x,y,x-(double?(j?64:32):(j?24:48))*Math.sin(a),y-(double?(j?64:32):(j?24:48))*Math.cos(a),C.cyan,'v');
  if(double)s+=arrow(x,y,x-(j?80:20)*Math.cos(a),y+(j?80:20)*Math.sin(a),C.red,'F');
  s+=text(double?(j?'速さ2倍・力4倍':'元の速さ・元の力'):(j?'半径4倍・周期8倍':'基準の円軌道'),45,cy-110,23);
 }
 if(!double)s+=text('半径は見やすく圧縮／周期比は8倍',40,605,20,C.dim);
 return s;
}
function division(t){
 const p=clamp(t/4);let s=text('長さ 6 の棒',60,200,26)+rect(60,235,420,65,C.cyan,.2);
 for(let i=0;i<4;i++)s+=`<g opacity="${clamp(p*4-i)}">${rect(60+i*105,235,105,65,i%2?C.gold:C.cyan,.4)}${text('1.5',85+i*105,278,23)}</g>`;
 return s+text('1.5 が 4 個入る',90,370,29,C.gold);
}
// D = geometry only, F = algebra only. Match the spoken sentence rather than
// flipping repeatedly on a timer; no frame may contain both presentations.
const focus={
 'm-circular-intro':['DDD','DD','FDD'],
 'm-circular-middle':['DDDF','FFF','DFF','FFD'],
 'm-circular-advanced':['DFDF','FFFF','DFF','FFF','DF'],
 'hm-why-18':['DD'],'hm-why-19':['FFF'],'hm-why-20':['DFFF']
};
export function circularFocus(c,s,k){const f=focus[c.id]?.[s.index]?.[k];if(!f)throw Error(`Missing visual focus ${c.id}/${s.index}/${k}`);return f==='D'?'diagram':'equation';}
export function circularPilotFrame(c,s,t){
 if(c.visualPilot!=='circular-algebra-v1')return null;
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),cap=s.captions[k],cue=s.cues[k];
 const phase=clamp((t-cap.start)/Math.max(.1,cap.end-cap.start));
 const prior=k?s.cues[k-1]:c.scenes[s.index-1]?.cues.at(-1);
 const kind=cue.diagram;
 const geometryPhase=kind==='limit'?clamp((t-s.start)/(s.captions[0].end-s.start)):s.index===0?clamp((t-s.start)/Math.max(1,s.captions[1]?.end-s.start)):1;
 const diagram=['triangles','limit'].includes(kind)?triangles(t-s.start,kind,geometryPhase):kind==='compare'||kind==='double'?compare(t,kind==='double'):kind==='division'?division(t-s.start):orbit(t,kind,cue.formula[0]==='a'?'a':'F');
 const captions=wrap(cap.text,43);if(captions.length>3)throw Error(`Pilot caption overflow ${c.id}/${s.index}/${k}`);
 const mode=circularFocus(c,s,k);
 const ops=wrap(cue.operation,45);if(ops.length>2)throw Error('Pilot operation overflow');
 const content=mode==='diagram'?`<svg data-presentation="diagram" x="150" y="110" width="980" height="510" viewBox="0 90 525 525">${diagram}</svg>`:
 `<g data-presentation="equation">${ops.map((v,i)=>text(v,50,130+i*30,25,C.gold)).join('')}<g transform="translate(-735 -65) scale(1.55)">${equation(prior?.formula??[],cue.formula,phase)}</g></g>`;
 const title=mode==='diagram'&&c.id==='m-circular-middle'?'円運動の加速度を求める':c.title;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="760"><style>text{font-family:'Hiragino Sans',sans-serif}</style><rect width="1280" height="760" fill="#0b1122"/>${text(title,38,40,29)}${text(s.heading,38,80,23,C.dim)}${content}${line(35,626,1245,626,'#28364e')}${captions.map((v,i)=>text(v,40,659+i*29,27)).join('')}${text('音声：VOICEVOX Nemo 男声1',38,745,15,C.dim)}${text(`${s.index+1} / ${c.scenes.length}`,1165,745,18,C.dim)}<rect x="0" y="755" width="${1280*t/c.duration}" height="5" fill="${C.cyan}"/></svg>`;
}
