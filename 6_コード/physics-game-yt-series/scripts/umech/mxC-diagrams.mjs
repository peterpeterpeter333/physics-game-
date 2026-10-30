// Diagrams for the Maxwell film, group C: chapter 5 (Faraday) and chapter 6 (Maxwell's term).
// Chapter 5 base: coil + galvanometer + bar magnet on a bench. The needle is driven by the
// actual rate of change of the flux (lines counted through the coil), so it swings only
// while the magnet moves. Chapter 6 base: a charging parallel-plate capacitor circuit; the
// number of E lines between the plates always equals the number of charges on a plate
// (Q = ε0 Φ_E), and current dots never cross the gap.
import {MX,stage,word,callout,causal,check,magnet,fit,clamp,mix,smooth,seg,fade,label,line,dot,ring,draw,arrow} from './mx-common.mjs';

// ---- timing: narration-locked -------------------------------------------------------------
const VE=ctx=>Math.max(.5,ctx.dur-(ctx.cue.pause??0)-.12);
// Seconds at which the substring `s` of the subtitle is (approximately) spoken.
function at(ctx,s){const sub=ctx.cue.subtitle,i=sub.indexOf(s);if(i<0)throw Error(`mxC: "${s}" not in "${sub}"`);return VE(ctx)*i/sub.length;}
const on=(ctx,s,d=.45,dt=0)=>clamp((ctx.t-at(ctx,s)-dt)/d);
const after=(ctx,s,d=.45)=>on(ctx,s,d);
// Piecewise eased interpolation through keyframes [[time,value],...].
function kf(t,keys){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){const [t0,v0]=keys[i-1],[t1,v1]=keys[i];if(t<=t1)return mix(v0,v1,smooth((t-t0)/Math.max(1e-6,t1-t0)));}return keys.at(-1)[1];}
const sceneT=ctx=>(ctx.scene?.captions?.[ctx.k]?.start??0)+ctx.t;
const slotX=[150,450,750,1050];
const slotLink=(i,x,y,g)=>fade(g,draw([[slotX[i-1],114],[mix(slotX[i-1],x,.5),mix(114,y,.35)],[x,y]],g,{color:MX.hi,w:3,dash:'9 7'}));
const COPPER='#d08a4a',COPPER2='#8a5a33';

// ---- chapter 5 objects ---------------------------------------------------------------------
const CY=330,COILX=[590,610,630,650,670,690,710],CRX=13,CRY=72;
const arc=(cx,cy,rx,ry,front)=>`M${cx} ${cy-ry} A${rx} ${ry} 0 0 ${front?1:0} ${cx} ${cy+ry}`;
function coilBack(g=1){return fade(g,COILX.map(x=>`<path d="${arc(x,CY,CRX,CRY,false)}" fill="none" stroke="${COPPER2}" stroke-width="4"/>`).join(''));}
function coilFront(g=1){return fade(g,COILX.map(x=>`<path d="${arc(x,CY,CRX,CRY,true)}" fill="none" stroke="${COPPER}" stroke-width="6" stroke-linecap="round"/>`).join('')
 +draw([[590,CY+CRY],[590,452],[965,452],[965,392]],1,{color:COPPER,w:4})+draw([[710,CY+CRY],[710,432],[1055,432],[1055,392]],1,{color:COPPER,w:4}));}
function coilGhost(g){return fade(g,`<rect x="${COILX[0]-CRX}" y="${CY-CRY}" width="${COILX.at(-1)-COILX[0]+2*CRX}" height="${2*CRY}" rx="14" fill="none" stroke="${MX.dim}" stroke-width="2" stroke-dasharray="8 8"/>`);}
// Galvanometer: defl in [-1,1] (+1 = full right).
function meter(defl,g=1){const x=1010,y=345,r=88;
 let s=`<rect x="${x-120}" y="228" width="240" height="165" rx="18" fill="#1a2540" stroke="#c9d3e6" stroke-opacity=".6" stroke-width="2"/>`;
 s+=`<path d="M${x-r*Math.sin(1)} ${y-r*Math.cos(1)} A${r} ${r} 0 0 1 ${x+r*Math.sin(1)} ${y-r*Math.cos(1)}" fill="none" stroke="#c9d3e6" stroke-width="2"/>`;
 for(let k=-4;k<=4;k++){const a=k/4,sn=Math.sin(a),cs=Math.cos(a);s+=line(x+(r-(k?8:14))*sn,y-(r-(k?8:14))*cs,x+r*sn,y-r*cs,{color:k?'#8d9cb8':MX.ink,w:k?2:3});}
 s+=label('0',x,y-r-10,{size:24,color:MX.ink,anchor:'middle',weight:700});
 const a=clamp(defl,-1,1)*.95;s+=line(x,y,x+(r-6)*Math.sin(a),y-(r-6)*Math.cos(a),{color:MX.plus,w:5})+dot(x,y,9,'#dfe6f2');
 return fade(g,s+label('電流計',x,y+38,{size:24,color:MX.dim,anchor:'middle'}));}
// Flux through the coil as a function of the N-face position (lines, 0..10).
const PHI=xN=>10*smooth((xN-440)/200);
// Orange field lines leaving the N face; line pair k passes through the coil once Φ > 2k.
function fieldLines(xN,g=1,{count=false}={}){const phi=PHI(xN);let s='';
 for(let i=0;i<10;i++){const sg=i<5?-1:1,k=Math.round(Math.abs(i-4.5)-.5),u=clamp(phi/2-k),y0=CY+(i-4.5)*5.5;
  const yin=sg*(6+k*12),yout=sg*(88+k*13),yc=mix(yout,yin,smooth(u)),mx=mix(xN,650,.5);
  const d=`M${xN.toFixed(1)} ${y0.toFixed(1)} Q${mx.toFixed(1)} ${(CY+yc).toFixed(1)} 650 ${(CY+yc).toFixed(1)} T 850 ${(CY+yc*1.35).toFixed(1)}`;
  s+=`<path d="${d}" fill="none" stroke="${MX.B}" stroke-width="${count&&u>.5?4:2.5}" stroke-opacity="${(count?(u>.5?.95:.3):.55+.3*u).toFixed(2)}"/>`;}
 return fade(g,s);}
const nThrough=xN=>{const phi=PHI(xN);let n=0;for(let k=0;k<5;k++)if(phi/2-k>.5)n+=2;return n;};
// Needle from the flux rate (per unit narration time), so it moves only while flux changes.
function needle(ctx,pos){const h=.03,ve=VE(ctx),d=(PHI(pos(ctx.t+h))-PHI(pos(ctx.t-h)))/(2*h)*ve;return clamp(d/55,-1,1);}
// Yellow current chevrons (or cyan E chevrons) circulating on a loop seen edge-on.
// phase increases → front half moves upward (induced current when flux to the right grows).
function chevrons(cx,cy,rx,ry,phase,{n=10,color=MX.I,size=11,g=1,front=true,back=true,dir=1}={}){let s='';
 for(let j=0;j<n;j++){const th=2*Math.PI*j/n+phase,cs=Math.cos(th);if(cs>0&&!front||cs<=0&&!back)continue;
  const x=cx+rx*cs,y=cy-ry*Math.sin(th),tx=-rx*Math.sin(th)*dir,ty=-ry*cs*dir,L=Math.hypot(tx,ty)||1,ux=tx/L,uy=ty/L,op=cs>0?1:.35;
  s+=`<polygon points="${(x+ux*size).toFixed(1)},${(y+uy*size).toFixed(1)} ${(x-ux*size*.6+uy*size*.7).toFixed(1)},${(y-uy*size*.6-ux*size*.7).toFixed(1)} ${(x-ux*size*.6-uy*size*.7).toFixed(1)},${(y-uy*size*.6+ux*size*.7).toFixed(1)}" fill="${color}" fill-opacity="${op}"/>`;}
 return fade(g,s);}
function bench(){return line(40,480,1160,480,{color:'#3a4a66',w:3});}
function magnetAt(xN,g=1){return magnet(xN-110,CY,{w:220,h:60,g});}
// Standard chapter-5 composition.
function ch5(ctx,p,{xN,lines=0,count=false,coil=1,meterG=1,defl=0,extra='',over='',under=''}){
 const s=bench()+under+coilBack(coil)+fieldLines(xN,lines,{count})+magnetAt(xN)+coilFront(coil)+meter(defl,meterG)+extra;
 return stage(ctx,p,s+over,{glow:[650,330,260,MX.B]});}
const REST=500,IN=640;

// ---- chapter 6 objects ---------------------------------------------------------------------
const WY=300,PL=560,PR=640,PT=205,PB=395;
const SLOTS=[5,6,4,7,3,8,2,9,1,10,0,11].map(j=>211+j*16.4);
// Charge on a plate for cue k of chapter 6 (monotonic across the chapter).
const QK=[[0,1.5],[1.5,5],[5,5.4],[5.4,5.8],[5.8,6],[6,10],[10,10.5],[10.5,11],[11,11.3],[11.3,11.6],[11.6,11.8],[11.8,12]];
const Qof=ctx=>{const [a,b]=QK[ctx.k]??[12,12];return mix(a,b,smooth(ctx.t/VE(ctx)));};
const PATH=[[PR+6,WY],[1110,WY],[1110,470],[622,470],[578,470],[90,470],[90,WY],[PL-6,WY]];
function pathPt(d){let acc=0;for(let i=1;i<PATH.length;i++){const [a,b]=[PATH[i-1],PATH[i]],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(d<=acc+L){const u=(d-acc)/L;return [mix(a[0],b[0],u),mix(a[1],b[1],u)];}acc+=L;}return PATH.at(-1);}
const PLEN=PATH.slice(1).reduce((a,b,i)=>a+Math.hypot(b[0]-PATH[i][0],b[1]-PATH[i][1]),0);
function currentDots(ctx,g=1){let s='';const off=(sceneT(ctx)*70)%48;
 for(let d=off;d<PLEN;d+=48){const [x,y]=pathPt(d);if(y>460&&x>574&&x<626)continue;const e=Math.min(d,PLEN-d);s+=dot(x,y,6,MX.I,clamp(e/40));}
 return fade(g,s);}
function battery(){return line(578,470,586,470,{color:'#c9d3e6',w:4})+line(586,440,586,500,{color:'#eef3fb',w:4})+line(614,456,614,484,{color:'#eef3fb',w:9})+line(614,470,622,470,{color:'#c9d3e6',w:4})
 +label('+',570,448,{size:24,color:MX.plus,anchor:'middle',weight:700})+label('−',632,448,{size:24,color:MX.minus,anchor:'middle',weight:700});}
function plates(Q,{E=0}={}){let s='';const n=Math.floor(Q),fr=Q-n;
 if(E>0)SLOTS.forEach((y,j)=>{const a=j<n?1:j===n?fr:0;if(a>0)s+=fade(a*E,arrow(PL+10,y,PR-8,y,{color:MX.E,w:3,head:10}));});
 s+=`<polygon points="${PL-9},${PT+10} ${PL+1},${PT-4} ${PL+1},${PB-10} ${PL-9},${PB+4}" fill="#9aa9c4" stroke="#dfe6f2" stroke-width="1.5"/>`;
 s+=`<polygon points="${PR-1},${PT+10} ${PR+9},${PT-4} ${PR+9},${PB-10} ${PR-1},${PB+4}" fill="#9aa9c4" stroke="#dfe6f2" stroke-width="1.5"/>`;
 SLOTS.forEach((y,j)=>{const a=j<n?1:j===n?fr:0;if(a<=0)return;
  s+=fade(a,`<circle cx="${PL-16}" cy="${y}" r="7.5" fill="${MX.plus}"/>`+line(PL-20,y,PL-12,y,{color:'#fff',w:2})+line(PL-16,y-4,PL-16,y+4,{color:'#fff',w:2})
   +`<circle cx="${PR+16}" cy="${y}" r="7.5" fill="${MX.minus}"/>`+line(PR+12,y,PR+20,y,{color:'#fff',w:2}));});
 return s;}
function circuit(ctx,{flow=1,E=0,Q=Qof(ctx),top=''}={}){
 const w={color:'#c9d3e6',w:4};
 return line(90,WY,PL-9,WY,w)+line(PR+9,WY,1110,WY,w)+line(1110,WY,1110,470,w)+line(1110,470,622,470,w)+line(578,470,90,470,w)+line(90,470,90,WY,w)
  +battery()+plates(Q,{E})+currentDots(ctx,flow)+top;}
// Ampère loop around the top wire at x=300 (right half = front).
const LX=300,LRX=24,LRY=75;
function loopBack(g=1){return fade(g,`<path d="${arc(LX,WY,LRX,LRY,false)}" fill="none" stroke="${MX.ink}" stroke-width="3" stroke-dasharray="7 6" stroke-opacity=".7"/>`);}
function loopFront(g=1){return g>=1?`<path d="${arc(LX,WY,LRX,LRY,true)}" fill="none" stroke="${MX.ink}" stroke-width="4"/>`:draw(Array.from({length:41},(_,i)=>{const th=-Math.PI/2+Math.PI*i/40;return [LX+LRX*Math.cos(th),WY+LRY*Math.sin(th)];}),g,{color:MX.ink,w:4});}
// B around a current to the right: front half points DOWN → phase decreasing in chevrons().
const bAround=(ctx,g,{cx=LX,rx=LRX,ry=LRY+18,n=8}={})=>chevrons(cx,WY,rx,ry,-sceneT(ctx)*.9,{n,color:MX.B,size:12,g,dir:-1});
function flatSurface(g){return fade(g,`<ellipse cx="${LX}" cy="${WY}" rx="${LRX}" ry="${LRY}" fill="${MX.hi}" fill-opacity=".16"/>`);}
// Bag surface from the loop to a cap in the gap; b=0 flat, b=1 full bag.
function bag(b,g=1,{cap=MX.hi}={}){if(b<=0.01||g<=0)return '';const xc=LX+300*b,R=LRY+65*b,m=LX+(xc-LX)*.5;
 const d=`M${LX} ${WY-LRY} C${m} ${WY-LRY} ${m} ${WY-R} ${xc} ${WY-R} A24 ${R} 0 0 1 ${xc} ${WY+R} C${m} ${WY+R} ${m} ${WY+LRY} ${LX} ${WY+LRY} A${LRX} ${LRY} 0 0 0 ${LX} ${WY-LRY} Z`;
 return fade(g,`<path d="${d}" fill="${MX.hi}" fill-opacity=".10" stroke="${MX.hi}" stroke-opacity=".75" stroke-width="2.5" stroke-dasharray="10 6"/>`+`<ellipse cx="${xc}" cy="${WY}" rx="24" ry="${R}" fill="${cap}" fill-opacity=".10" stroke="${cap}" stroke-opacity=".8" stroke-width="2.5"/>`);}
// Cyan dots where the E lines pierce the bag's cap (in the gap).
function capPierce(Q,g){let s='';const n=Math.floor(Q);SLOTS.forEach((y,j)=>{if(j<n)s+=dot(600,y,5,MX.E);});return fade(g,s);}
const ch6=(ctx,p,inner)=>stage(ctx,p,inner,{glow:[600,300,260,MX.E]});
const texE=v=>`{\\color{${MX.E}}${v}}`,texB=v=>`{\\color{${MX.B}}${v}}`,texI=v=>`{\\color{${MX.I}}${v}}`;

export const mxCDiagrams={
 // ===================== chapter 5 =====================
 'mx5-still':(p,ctx)=>{
  const g=on(ctx,'磁石を置いて',.5);
  const over=word('1831年',60,175,{size:30,color:MX.hi,g:clamp(ctx.t/.5)})+word('ファラデー',200,175,{size:30,g:on(ctx,'ファラデー')})
   +word('針は 0 のまま',1010,190,{size:28,anchor:'middle',color:MX.plus,g:on(ctx,'電流計')});
  return stage(ctx,p,bench()+coilBack()+fieldLines(REST,0)+magnetAt(REST,g)+coilFront()+meter(0)+over,{glow:[650,330,260,MX.B]});
 },
 'mx5-move':(p,ctx)=>{
  const v=VE(ctx),t1=at(ctx,'動かした'),t2=at(ctx,'入れると'),t3=at(ctx,'抜くと'),t4=at(ctx,'止めると');
  const pos=t=>kf(t,[[t1,REST],[t1+.09*v,IN],[t1+.15*v,IN],[t1+.24*v,REST],[t2,REST],[t2+.1*v,IN],[t3,IN],[t3+.1*v,REST]]);
  const xN=pos(ctx.t),defl=needle(ctx,pos);
  const cur=ctx.t<t2?null:ctx.t<t3?['入れる → 右',MX.hi]:ctx.t<t4?['抜く → 左',MX.hi]:['止める → 0',MX.plus];
  const over=cur?word(cur[0],1010,190,{size:30,anchor:'middle',color:cur[1],g:clamp((ctx.t-(ctx.t<t3?t2:ctx.t<t4?t3:t4))/.3)}):'';
  return ch5(ctx,p,{xN,defl,over:over+word('動かした時だけ',300,190,{size:28,color:MX.hi,anchor:'middle',g:on(ctx,'針が振れ')*(1-on(ctx,'入れると'))})});
 },
 'mx5-flux':(p,ctx)=>{
  const gl=clamp(ctx.t/.6),gc=on(ctx,'コイルを貫く'),n=nThrough(REST);
  const over=word('強さ ではなく',300,190,{size:28,anchor:'middle',g:on(ctx,'磁場の強さ')})+word('変化！',485,190,{size:30,color:MX.hi,anchor:'middle',g:on(ctx,'磁場の変化')})
   +word(`磁束 ＝ ${n}本`,650,190,{size:30,color:MX.B,anchor:'middle',g:on(ctx,'磁束')});
  return ch5(ctx,p,{xN:REST,lines:gl,count:gc>.5,over});
 },
 'mx5-formula':(p,ctx)=>{
  const v=VE(ctx),tf=at(ctx,'高校では');
  const pos=t=>kf(t,[[.02*v,REST],[.26*v,IN],[.3*v,IN],[.33*v,REST],[.36*v,REST],[.39*v,IN]]);
  const xN=pos(ctx.t),defl=needle(ctx,pos);
  const lbl=ctx.t<.28*v?word('ゆっくり → 小さく',1010,190,{size:28,anchor:'middle',g:clamp(ctx.t/.3)}):word('速く → 大きく',1010,190,{size:30,anchor:'middle',color:MX.hi,g:clamp((ctx.t-.28*v)/.2)});
  const gF=on(ctx,'高校では');
  const over=lbl+word(`磁束 ${nThrough(xN)}本`,650,190,{size:28,color:MX.B,anchor:'middle'})
   +callout(40,140,330,120,fit(`V=-\\dfrac{\\Delta ${texB('\\Phi')}}{\\Delta t}`,205,210,290,50,{color:MX.ink}),gF);
  return ch5(ctx,p,{xN,lines:1,defl,over});
 },
 'mx5-lenz':(p,ctx)=>{
  const v=VE(ctx),t0=at(ctx,'邪魔する'),pos=t=>mix(REST,IN,clamp((t-.04*v)/(.81*v)));
  const xN=pos(ctx.t),defl=needle(ctx,pos),rate=Math.max(0,defl),gC=on(ctx,'邪魔する')*clamp(rate*5);
  const ph=PHI(xN)*.55;
  const extra=chevrons(650,CY,CRX+4,CRY+4,ph,{n:12,size:15,g:gC,back:false});
  const over=callout(40,140,330,120,fit(`V=-\\dfrac{\\Delta ${texB('\\Phi')}}{\\Delta t}`,205,210,290,50,{color:MX.ink}))
   +fade(clamp(ctx.t/.4),ring(206,204,22,{color:MX.hi,w:4}))
   +fade(gC,arrow(760,CY,560,CY,{color:MX.B,w:6,head:20,opacity:.95}))
   +word('変化を 邪魔する',650,200,{size:30,anchor:'middle',color:MX.hi,g:on(ctx,'邪魔する')})
   +word('電流',820,390,{size:28,color:MX.I,g:on(ctx,'電流が')})
   +word('レンツの法則',1010,190,{size:30,anchor:'middle',g:on(ctx,'レンツ')});
  return ch5(ctx,p,{xN,lines:1,defl,extra,over});
 },
 'mx5-pipe':(p,ctx)=>{
  const t0=at(ctx,'落とすと'),v=VE(ctx),tt=Math.max(0,ctx.t-t0),T=Math.max(1,ctx.dur-t0);
  // Outside: free fall, repeated. Inside the copper pipe: slow, steady fall.
  const fall=tt%1.3,yo=ctx.t<t0?160:160+Math.min(270,.5*520*fall*fall*1.8),yi=ctx.t<t0?160:160+270*clamp(tt/T);
  const px=430,pw=86;let s=bench()+fade(.25,coilBack()+coilFront()+meter(0));
  s+=`<rect x="${px-pw/2}" y="135" width="${pw}" height="340" rx="8" fill="${COPPER}" fill-opacity=".18" stroke="${COPPER}" stroke-width="3"/>`;
  s+=magnet(px,yi,{w:84,h:44,angle:90})+magnet(260,yo,{w:84,h:44,angle:90,g:ctx.t<t0?clamp(ctx.t/.4):1});
  for(let k=0;k<6;k++)s+=line(px-pw/2+6,150+k*56,px+pw/2-6,165+k*56,{color:COPPER,w:2,opacity:.35});
  const gE=on(ctx,'パイプに流れる');
  // Eddy rings: below the falling N pole flux grows, above it shrinks → opposite circulation.
  s+=`<ellipse cx="${px}" cy="${yi+62}" rx="${pw/2+10}" ry="12" fill="none" stroke="${MX.I}" stroke-width="3" opacity="${gE.toFixed(2)}"/>`+`<ellipse cx="${px}" cy="${yi-62}" rx="${pw/2+10}" ry="12" fill="none" stroke="${MX.I}" stroke-width="3" opacity="${gE.toFixed(2)}"/>`;
  s+=fade(gE,arrow(px-10,yi+74,px+18,yi+74,{color:MX.I,w:3,head:10})+arrow(px+10,yi-50,px-18,yi-50,{color:MX.I,w:3,head:10}));
  s+=word('銅のパイプ',px+70,165,{size:28,color:COPPER,g:clamp(ctx.t/.5)})
   +word('外：すとん',30,300,{size:26,g:on(ctx,'落とすと')})+word('電流が 邪魔',px+70,300,{size:28,color:MX.I,g:gE})
   +word('ふわり… ゆっくり',px+70,390,{size:30,color:MX.hi,g:on(ctx,'ふわりと')});
  return stage(ctx,p,s,{glow:[430,300,220,COPPER]});
 },
 'mx5-no-wire':(p,ctx)=>{
  const v=VE(ctx),gone=on(ctx,'取り去ったら',.8),gE=on(ctx,'ぐるりと回る',.6);
  const pos=t=>REST+70+70*Math.sin(2*Math.PI*t/(v/2.2));const xN=pos(ctx.t),ph=PHI(xN)*.5,sd=PHI(pos(ctx.t+.02))>=PHI(pos(ctx.t-.02))?1:-1,eg=.2+.8*Math.abs(needle(ctx,pos));
  const under=chevrons(650,CY,18,108,ph,{n:12,color:MX.E,size:13,dir:sd,g:gE*eg,front:false})+fade(gE*.6,`<path d="${arc(650,CY,18,108,false)}" fill="none" stroke="${MX.E}" stroke-width="2" stroke-dasharray="6 6"/>`);
  const extra=fade(gE,`<path d="${arc(650,CY,18,108,true)}" fill="none" stroke="${MX.E}" stroke-width="3"/>`)+chevrons(650,CY,18,108,ph,{n:12,color:MX.E,size:13,dir:sd,g:gE*eg,back:false});
  const over=coilGhost(gone*(1-gE*.6))+word('電線なし',650,190,{size:30,anchor:'middle',g:gone})+word('回る電場',860,200,{size:32,color:MX.E,g:gE});
  return ch5(ctx,p,{xN,lines:1,coil:1-gone,meterG:1-gone,under,extra,over});
 },
 'mx5-no-wire:electrons':(p,ctx)=>{
  const v=VE(ctx),T=ctx.t+(ctx.scene?.captions?.[ctx.k]?.start??0);
  const pos=t=>REST+70+70*Math.sin(2*Math.PI*t/(v/2.2));const xN=pos(ctx.t),ph=PHI(xN)*.5,sd=PHI(pos(ctx.t+.02))>=PHI(pos(ctx.t-.02))?1:-1,eg=.2+.8*Math.abs(needle(ctx,pos));
  const gW=clamp(ctx.t/.6),gEl=on(ctx,'電子');
  const under=chevrons(610,CY,18,108,ph,{n:12,color:MX.E,size:13,dir:sd,g:eg,front:false})+`<path d="${arc(610,CY,18,108,false)}" fill="none" stroke="${MX.E}" stroke-width="2" stroke-dasharray="6 6" opacity=".6"/>`
   +fade(gW,`<path d="${arc(720,CY,20,100,false)}" fill="none" stroke="${COPPER2}" stroke-width="5"/>`);
  // Electrons (negative) move opposite to E.
  let el='';for(let j=0;j<8;j++){const th=2*Math.PI*j/8-ph*1.4,x=720+20*Math.cos(th),y=CY-100*Math.sin(th);el+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${MX.minus}" stroke="#fff" stroke-width="1.5" opacity="${Math.cos(th)>0?1:.45}"/>`;}
  const extra=`<path d="${arc(610,CY,18,108,true)}" fill="none" stroke="${MX.E}" stroke-width="3"/>`+chevrons(610,CY,18,108,ph,{n:12,color:MX.E,size:13,dir:sd,g:eg,back:false})
   +fade(gW,`<path d="${arc(720,CY,20,100,true)}" fill="none" stroke="${COPPER}" stroke-width="6"/>`)+fade(gEl,el);
  const over=word('回る電場',470,190,{size:32,color:MX.E})+word('電線',760,455,{size:28,color:COPPER,g:gW})+word('電子 −',740,190,{size:30,color:MX.minus,anchor:'middle',g:gEl})
   +word('電場に 押される',880,300,{size:28,g:on(ctx,'押されて')});
  return ch5(ctx,p,{xN,lines:1,coil:0,meterG:0,under,extra,over});
 },
 'mx5-faraday':(p,ctx)=>{
  const v=VE(ctx),pos=t=>REST+70+70*Math.sin(2*Math.PI*t/(v/2.2));const xN=pos(ctx.t),ph=PHI(xN)*.5,sd=PHI(pos(ctx.t+.02))>=PHI(pos(ctx.t-.02))?1:-1,eg=.2+.8*Math.abs(needle(ctx,pos));
  const tw=at(ctx,'一周'),tw2=at(ctx,'磁束の'),w=clamp((ctx.t-tw)/Math.max(.3,tw2-tw));
  const ring_=Array.from({length:81},(_,i)=>{const th=-Math.PI/2+2*Math.PI*i/80;return [650+18*Math.cos(th),CY-108*Math.sin(th)];});
  const under=`<ellipse cx="650" cy="${CY}" rx="18" ry="108" fill="${MX.B}" fill-opacity="${(.06+.1*on(ctx,'磁束の')).toFixed(2)}"/>`+`<path d="${arc(650,CY,18,108,false)}" fill="none" stroke="${MX.E}" stroke-width="2" stroke-dasharray="6 6" opacity=".6"/>`;
  const walk=ring_[Math.min(80,Math.round(w*80))];
  const extra=`<path d="${arc(650,CY,18,108,true)}" fill="none" stroke="${MX.E}" stroke-width="3"/>`+chevrons(650,CY,18,108,ph,{n:12,color:MX.E,size:13,dir:sd,g:eg,back:false})
   +(w>0?draw(ring_,w,{color:MX.hi,w:6,opacity:.9})+(w<1?dot(walk[0],walk[1],10,MX.hi):''):'');
  const gF=on(ctx,'これが');
  const over=word('一周 足す',470,190,{size:30,color:MX.hi,anchor:'middle',g:on(ctx,'一周')})
   +word('磁束の変化',650,460,{size:28,color:MX.B,anchor:'middle',g:on(ctx,'磁束の')})
   +callout(780,135,400,125,fit(`\\oint ${texE('\\vec E')}\\cdot d\\vec r=-\\dfrac{d${texB('\\Phi_B')}}{dt}`,980,205,360,46,{color:MX.ink}),gF)
   +slotLink(3,900,135,gF);
  return ch5(ctx,p,{xN,lines:1,coil:0,meterG:0,under,extra,over});
 },
 'mx5-to-maxwell':(p,ctx)=>{
  const v=VE(ctx),pos=t=>REST+70+70*Math.sin(2*Math.PI*t/(v/2.2));const xN=pos(ctx.t),ph=PHI(xN)*.5,sd=PHI(pos(ctx.t+.02))>=PHI(pos(ctx.t-.02))?1:-1,eg=.2+.8*Math.abs(needle(ctx,pos));
  const extra=`<path d="${arc(650,CY,18,108,true)}" fill="none" stroke="${MX.E}" stroke-width="3"/>`+chevrons(650,CY,18,108,ph,{n:12,color:MX.E,size:13,dir:sd,g:eg,back:false});
  const g2=on(ctx,'では逆に');
  const over=`<rect x="0" y="120" width="1200" height="395" fill="${MX.bg}" fill-opacity=".8"/>`
   +callout(200,190,800,240,causal('磁場の変化','電場',560,270,{ca:MX.B,cb:MX.E,size:40})+check(900,258,on(ctx,'電場を作る'))
   +fade(g2,causal('電場の変化','磁場',560,370,{ca:MX.E,cb:MX.B,size:40})+label('？',905,382,{size:56,color:MX.hi,anchor:'middle',weight:700})),clamp(ctx.t/.4));
  return ch5(ctx,p,{xN,lines:1,coil:0,meterG:0,extra,over});
 },

 // ===================== chapter 6 =====================
 'mx6-capacitor':(p,ctx)=>{
  const g=on(ctx,'充電中');
  const top=word('マクスウェル',60,175,{size:30,color:MX.hi,g:on(ctx,'マクスウェル')})
   +fade(g,word('充電中の コンデンサ',760,180,{size:30})+arrow(760,195,650,225,{color:MX.dim,w:3,head:12}));
  return ch6(ctx,p,circuit(ctx,{top}));
 },
 'mx6-charging':(p,ctx)=>{
  const gGap=on(ctx,'すき間');
  const top=word('電荷が たまる',150,185,{size:30,g:on(ctx,'プラスとマイナス')})
   +fade(gGap,`<rect x="${PL+4}" y="${PT-12}" width="${PR-PL-8}" height="${PB-PT+24}" rx="6" fill="${MX.hi}" fill-opacity=".10" stroke="${MX.hi}" stroke-width="2" stroke-dasharray="6 5"/>`)
   +word('すき間：電流 0',600,170,{size:30,anchor:'middle',color:MX.hi,g:on(ctx,'電流は流れて')});
  return ch6(ctx,p,circuit(ctx,{top}));
 },
 'mx6-loop':(p,ctx)=>{
  const gl=on(ctx,'輪を描き',1.2),gB=on(ctx,'アンペール'),gs=on(ctx,'輪に張る面');
  const wob=gs>0?.35*(1-Math.cos(2*Math.PI*clamp((ctx.t-at(ctx,'どんな形'))/1.6)))/2*2:0;
  const s=circuit(ctx,{top:''});
  return ch6(ctx,p,loopBack(gl>=1?1:0)+s+flatSurface(gs*.8)+bag(wob,gs*.9)+loopFront(gl)+bAround(ctx,gB)
   +callout(150,125,300,70,fit(`\\oint ${texB('\\vec B')}\\cdot d\\vec r=\\mu_0 ${texI('I')}`,300,165,270,36,{color:MX.ink}),gB)
   +word('どんな形でも？',760,440,{size:28,g:on(ctx,'どんな形')}));
 },
 'mx6-surfaces':(p,ctx)=>{
  const gI=on(ctx,'電流 I'),b=seg(ctx.t,at(ctx,'袋のように'),at(ctx,'板の間を通る')+.5),g0=on(ctx,'ゼロです');
  const s=circuit(ctx);
  return ch6(ctx,p,loopBack()+s+flatSurface(.9-.5*b)+bag(b)+loopFront()+bAround(ctx,1)
   +fade(gI,ring(LX,WY,16,{color:MX.I,w:4}))+word('平らな面：I',140,190,{size:28,color:MX.I,g:gI})
   +word('袋の面：0',720,180,{size:30,color:MX.hi,g:g0})+fade(g0,arrow(720,195,625,240,{color:MX.hi,w:3,head:12})));
 },
 'mx6-paradox':(p,ctx)=>{
  const g=on(ctx,'答えが'),sh=g>0&&g<1?6*Math.sin(ctx.t*40)*(1-g):0;
  const s=circuit(ctx);
  return ch6(ctx,p,loopBack()+s+flatSurface(.5)+bag(1)+loopFront()+bAround(ctx,1)
   +word('平らな面：I',140,190,{size:28,color:MX.I})+word('袋の面：0',720,180,{size:30,color:MX.hi})
   +fade(g,label('？！',990+sh,215,{size:72,color:MX.plus,anchor:'middle',weight:700}))
   +word('矛盾',1120,200,{size:34,color:MX.plus,anchor:'middle',g:on(ctx,'矛盾')}));
 },
 'mx6-efield':(p,ctx)=>{
  const gE=on(ctx,'電場が',.6,-.2),Q=Qof(ctx);
  const s=circuit(ctx,{E:Math.max(gE,on(ctx,'変化して')*.6),Q});
  return ch6(ctx,p,loopBack(.5)+s+bag(1,.45)+loopFront(.5)+capPierce(Q,gE)
   +word('変化しているもの',760,180,{size:28,g:on(ctx,'変化して')})+word('電場 E が 強くなる',760,470-10,{size:30,color:MX.E,g:gE}));
 },
 'mx6-derive':(p,ctx)=>{
  const Q=Qof(ctx),n=Math.floor(Q+1e-6),g1=clamp(ctx.t/.5),g2=on(ctx,'イプシロンゼロ'),g3=on(ctx,'つまり');
  const s=circuit(ctx,{E:1,Q});
  return ch6(ctx,p,s+capPierce(Q,.0)
   +callout(700,128,480,160,fit(`${texE('E')}=\\dfrac{Q}{\\varepsilon_0 S}`,800,210,170,34,{color:MX.dim})+fade(g2,fit(`Q=\\varepsilon_0\\,${texE('\\Phi_E')}`,1030,210,230,46,{color:MX.ink})),g1)
   +slotLink(1,760,128,g1)
   +word(`電気束 ＝ ${n}本`,560,165,{size:28,color:MX.E,anchor:'middle',g:g3})+word('面積 S',250,190,{size:26,color:MX.dim,g:g1}));
 },
 'mx6-derive:rate':(p,ctx)=>{
  const Q=Qof(ctx),g2=on(ctx,'だから');
  const s=circuit(ctx,{E:1,Q});
  return ch6(ctx,p,s
   +callout(700,128,480,160,fit(`Q=\\varepsilon_0\\,${texE('\\Phi_E')}`,940,175,230,36,{color:MX.dim})
    +fade(on(ctx,'電流は'),fit(`${texI('I')}=\\dfrac{dQ}{dt}`,800,248,150,38,{color:MX.ink}))
    +fade(g2,fit(`=\\varepsilon_0\\dfrac{d${texE('\\Phi_E')}}{dt}`,985,248,220,38,{color:MX.ink})))
   +word('1秒あたり',260,190,{size:28,color:MX.I,g:on(ctx,'一秒あたりに')}));
 },
 'mx6-equal':(p,ctx)=>{
  const gA=on(ctx,'電線では'),gB=on(ctx,'すき間では'),gC=on(ctx,'ぴったり'),L=220;
  const s=circuit(ctx,{E:1});
  const bars=label('電線',720,180,{size:26,color:MX.dim})+`<rect x="810" y="158" width="${(L*gA).toFixed(1)}" height="30" rx="6" fill="${MX.I}"/>`+fade(gA,fit(texI('I'),1100,182,40,36,{color:MX.I}))
   +fade(gB,label('すき間',720,250,{size:26,color:MX.dim}))+`<rect x="810" y="228" width="${(L*gB).toFixed(1)}" height="30" rx="6" fill="${MX.E}"/>`+fade(gB,fit(`\\varepsilon_0\\dfrac{d${texE('\\Phi_E')}}{dt}`,1110,248,110,32,{color:MX.E}))
   +fade(gC,line(810+L,150,810+L,268,{color:MX.hi,w:3,dash:'6 5'})+label('＝',795,225,{size:34,color:MX.hi,anchor:'end',weight:700}));
  return ch6(ctx,p,s+fade(gA,ring(LX,WY,18,{color:MX.I,w:4}))+fade(gB,`<rect x="${PL+6}" y="${PT-8}" width="${PR-PL-12}" height="${PB-PT+16}" rx="6" fill="none" stroke="${MX.E}" stroke-width="3"/>`)
   +callout(700,128,480,160,bars)+check(1150,445,gC)+word('同じ大きさ',950,445,{size:30,color:MX.hi,anchor:'middle',g:gC}));
 },
 'mx6-complete':(p,ctx)=>{
  const gT=on(ctx,'この電場の変化の項',.6),gK=on(ctx,'どちらの面');
  const s=circuit(ctx,{E:1});
  const eq=fit(`\\oint ${texB('\\vec B')}\\cdot d\\vec r=\\mu_0 ${texI('I')}+`,860,215,280,40,{color:MX.ink})
   +fade(1-gT,label('？',1080,228,{size:44,color:MX.dim,anchor:'middle',weight:700}))
   +fade(gT,`<rect x="1012" y="160" width="158" height="104" rx="10" fill="${MX.hi}" fill-opacity=".10" stroke="${MX.hi}" stroke-width="3"/>`+fit(`\\mu_0\\varepsilon_0\\dfrac{d${texE('\\Phi_E')}}{dt}`,1091,215,140,40,{color:MX.ink}));
  return ch6(ctx,p,loopBack()+s+flatSurface(.6)+bag(1,.8,{cap:MX.E})+loopFront()+bAround(ctx,1)
   +callout(700,128,480,160,eq)+word('マクスウェルの 一手',1091,315,{size:26,color:MX.hi,anchor:'middle',g:gT*(1-gK)})
   +slotLink(4,1091,128,gT)
   +word('平らな面：I',60,455,{size:26,color:MX.I,g:gK})+check(262,448,gK)+word('袋の面：電場の変化',320,455,{size:26,color:MX.E,g:gK})+check(632,448,gK)
   +word('一致！',680,455,{size:28,color:MX.good,g:gK}));
 },
 'mx6-four':(p,ctx)=>{
  const gB=on(ctx,'磁場を作る',.6,-.3);
  const s=circuit(ctx,{E:1});
  return ch6(ctx,p,chevrons(600,WY,34,135,-sceneT(ctx)*.9,{n:12,color:MX.B,size:13,g:gB,front:false,dir:-1})+fade(gB*.6,`<path d="${arc(600,WY,34,135,false)}" fill="none" stroke="${MX.B}" stroke-width="2" stroke-dasharray="6 6"/>`)
   +s+fade(gB,`<path d="${arc(600,WY,34,135,true)}" fill="none" stroke="${MX.B}" stroke-width="3"/>`)+chevrons(600,WY,34,135,-sceneT(ctx)*.9,{n:12,color:MX.B,size:13,g:gB,back:false,dir:-1})
   +causal('電場の変化','磁場',900,190,{ca:MX.E,cb:MX.B,size:34,g:clamp(ctx.t/.5)})+word('4つの式が そろった',900,440,{size:30,color:MX.hi,anchor:'middle',g:on(ctx,'四つの式')}));
 },
 'mx6-to-wave':(p,ctx)=>{
  const T=sceneT(ctx),g1=clamp(ctx.t/.5),g2=on(ctx,'電場の変化は'),g3=on(ctx,'何が');
  const s=fade(.35,circuit(ctx,{E:1}));
  const A=[380,320],B=[820,320];
  const top=draw(Array.from({length:31},(_,i)=>{const a=Math.PI*(1-i/30);return [600+220*Math.cos(a),320-110*Math.sin(a)];}),g1,{color:MX.E,w:5});
  const bot=draw(Array.from({length:31},(_,i)=>{const a=-Math.PI*i/30;return [600-220*Math.cos(a),320-110*Math.sin(a)];}).map(([x,y])=>[1200-x,y]),g2,{color:MX.B,w:5});
  const run=g2>=1?(()=>{const a=(T*1.4)%(2*Math.PI);return dot(600-220*Math.cos(a),320-110*Math.sin(a),10,MX.hi);})():'';
  return ch6(ctx,p,s+`<rect x="160" y="140" width="880" height="360" rx="18" fill="${MX.bg}" fill-opacity=".8"/>`+top+bot+fade(g1,arrow(585,210,615,210,{color:MX.E,w:5,head:22}))+fade(g2,arrow(615,430,585,430,{color:MX.B,w:5,head:22}))
   +word('磁場の変化',A[0],A[1]+10,{size:32,color:MX.B,anchor:'middle'})+word('電場の変化',B[0],B[1]+10,{size:32,color:MX.E,anchor:'middle',g:g1})+run
   +label('？',600,340,{size:80,color:MX.hi,anchor:'middle',weight:700,opacity:g3}));
 },
};
