// Diagrams for the v2 Maxwell film, part p5 (chapter 5, Faraday). Keys: 'mx5-n-<name>'.
// Base picture (from mxC): coil + galvanometer + bar magnet on a bench. The needle is driven by
// the rate of change of the counted flux, so it moves only while the flux changes.
// Direction conventions (checked): magnet N face points right, into the coil. Flux to the right
// growing → induced field inside the coil points left → the coil's left face is an N pole, and
// the current on the front half of each turn runs upward (chevron phase increasing).
import {MX,C,clamp,mix,smooth,fade,label,line,dot,ring,draw,arrow,tex,texWidth,word,callout,causal,check,fit,stage,charge,magnet} from './mx-common.mjs';

// ---- timing: narration-locked -------------------------------------------------------------
const VE=ctx=>Math.max(.5,ctx.dur-(ctx.cue.pause??0)-.12);
function at(ctx,s){const sub=ctx.cue.subtitle,i=sub.indexOf(s);if(i<0)throw Error(`mx2-p5: "${s}" not in "${sub}"`);return VE(ctx)*i/sub.length;}
const on=(ctx,s,d=.45,dt=0)=>clamp((ctx.t-at(ctx,s)-dt)/d);
function kf(t,keys){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){const [t0,v0]=keys[i-1],[t1,v1]=keys[i];if(t<=t1)return mix(v0,v1,smooth((t-t0)/Math.max(1e-6,t1-t0)));}return keys.at(-1)[1];}
const sceneT=ctx=>(ctx.scene?.captions?.[ctx.k]?.start??0)+ctx.t;
const COPPER='#d08a4a',COPPER2='#8a5a33';
const cB=v=>`{\\color{${MX.B}}${v}}`,cE=v=>`{\\color{${MX.E}}${v}}`;

// ---- chapter 5 objects (copied from mxC and extended) ---------------------------------------
const CY=330,COILX=[590,610,630,650,670,690,710],CRX=13,CRY=72;
const arc=(cx,cy,rx,ry,front)=>`M${cx} ${cy-ry} A${rx} ${ry} 0 0 ${front?1:0} ${cx} ${cy+ry}`;
function coilBack(g=1){return fade(g,COILX.map(x=>`<path d="${arc(x,CY,CRX,CRY,false)}" fill="none" stroke="${COPPER2}" stroke-width="4"/>`).join(''));}
// gap in [0,1]: opens a break in the lower lead (circuit not closed).
function coilFront(g=1,{gap=0}={}){
 const gx=780,gw=26*gap;
 const lower=gap>0.01?draw([[590,CY+CRY],[590,452],[gx-gw,452]],1,{color:COPPER,w:4})+draw([[gx+gw,452],[965,452],[965,392]],1,{color:COPPER,w:4})+dot(gx-gw,452,5,COPPER)+dot(gx+gw,452,5,COPPER)
  :draw([[590,CY+CRY],[590,452],[965,452],[965,392]],1,{color:COPPER,w:4});
 return fade(g,COILX.map(x=>`<path d="${arc(x,CY,CRX,CRY,true)}" fill="none" stroke="${COPPER}" stroke-width="6" stroke-linecap="round"/>`).join('')
 +lower+draw([[710,CY+CRY],[710,432],[1055,432],[1055,392]],1,{color:COPPER,w:4}));}
function coilGhost(g){return fade(g,`<rect x="${COILX[0]-CRX}" y="${CY-CRY}" width="${COILX.at(-1)-COILX[0]+2*CRX}" height="${2*CRY}" rx="14" fill="none" stroke="${MX.dim}" stroke-width="2" stroke-dasharray="8 8"/>`);}
// Galvanometer: defl in [-1,1] (+1 = full right). ghost: a faint mark at an earlier reading.
function meter(defl,g=1,{ghost=null}={}){const x=1010,y=345,r=88;
 let s=`<rect x="${x-120}" y="228" width="240" height="165" rx="18" fill="#1a2540" stroke="#c9d3e6" stroke-opacity=".6" stroke-width="2"/>`;
 s+=`<path d="M${x-r*Math.sin(1)} ${y-r*Math.cos(1)} A${r} ${r} 0 0 1 ${x+r*Math.sin(1)} ${y-r*Math.cos(1)}" fill="none" stroke="#c9d3e6" stroke-width="2"/>`;
 for(let k=-4;k<=4;k++){const a=k/4,sn=Math.sin(a),cs=Math.cos(a);s+=line(x+(r-(k?8:14))*sn,y-(r-(k?8:14))*cs,x+r*sn,y-r*cs,{color:k?'#8d9cb8':MX.ink,w:k?2:3});}
 s+=label('0',x,y-r-10,{size:24,color:MX.ink,anchor:'middle',weight:700});
 if(ghost!=null){const a=clamp(ghost,-1,1)*.95;s+=line(x,y,x+(r-6)*Math.sin(a),y-(r-6)*Math.cos(a),{color:MX.hi,w:4,opacity:.45,dash:'6 5'});}
 const a=clamp(defl,-1,1)*.95;s+=line(x,y,x+(r-6)*Math.sin(a),y-(r-6)*Math.cos(a),{color:MX.plus,w:5})+dot(x,y,9,'#dfe6f2');
 return fade(g,s+label('電流計',x,y+38,{size:24,color:MX.dim,anchor:'middle'}));}
// Flux through the coil as a function of the N-face position (lines, 0..10).
const PHI=xN=>10*smooth((xN-440)/200);
function fLines(xN,g=1,{count=false}={}){const phi=PHI(xN);let s='';
 for(let i=0;i<10;i++){const sg=i<5?-1:1,k=Math.round(Math.abs(i-4.5)-.5),u=clamp(phi/2-k),y0=CY+(i-4.5)*5.5;
  const yin=sg*(6+k*12),yout=sg*(88+k*13),yc=mix(yout,yin,smooth(u)),mx=mix(xN,650,.5);
  const d=`M${xN.toFixed(1)} ${y0.toFixed(1)} Q${mx.toFixed(1)} ${(CY+yc).toFixed(1)} 650 ${(CY+yc).toFixed(1)} T 850 ${(CY+yc*1.35).toFixed(1)}`;
  s+=`<path d="${d}" fill="none" stroke="${MX.B}" stroke-width="${count&&u>.5?4:2.5}" stroke-opacity="${(count?(u>.5?.95:.3):.55+.3*u).toFixed(2)}"/>`;}
 return fade(g,s);}
const nThrough=xN=>{const phi=PHI(xN);let n=0;for(let k=0;k<5;k++)if(phi/2-k>.5)n+=2;return n;};
// Flux rate in lines per sentence-length (so the swing does not depend on the voice length).
const rateN=(ctx,pos)=>{const h=.03;return (PHI(pos(ctx.t+h))-PHI(pos(ctx.t-h)))/(2*h)*VE(ctx);};
const needle=(ctx,pos,K=55)=>clamp(rateN(ctx,pos)/K,-1,1);
// Chevrons circulating on a loop seen edge-on; phase increasing → front half moves upward.
function chevrons(cx,cy,rx,ry,phase,{n=10,color=MX.I,size=11,g=1,front=true,back=true,dir=1}={}){let s='';
 for(let j=0;j<n;j++){const th=2*Math.PI*j/n+phase,cs=Math.cos(th);if(cs>0&&!front||cs<=0&&!back)continue;
  const x=cx+rx*cs,y=cy-ry*Math.sin(th),tx=-rx*Math.sin(th)*dir,ty=-ry*cs*dir,L=Math.hypot(tx,ty)||1,ux=tx/L,uy=ty/L,op=cs>0?1:.35;
  s+=`<polygon points="${(x+ux*size).toFixed(1)},${(y+uy*size).toFixed(1)} ${(x-ux*size*.6+uy*size*.7).toFixed(1)},${(y-uy*size*.6-ux*size*.7).toFixed(1)} ${(x-ux*size*.6-uy*size*.7).toFixed(1)},${(y-uy*size*.6+ux*size*.7).toFixed(1)}" fill="${color}" fill-opacity="${op}"/>`;}
 return fade(g,s);}
const bench=()=>line(40,480,1160,480,{color:'#3a4a66',w:3});
const magnetAt=(xN,g=1)=>magnet(xN-110,CY,{w:220,h:60,g});
function ch5(ctx,p,{xN,lines=0,count=false,coil=1,meterG=1,defl=0,ghost=null,gap=0,magG=1,extra='',over='',under=''}){
 const s=bench()+under+coilBack(coil)+fLines(xN,lines*magG,{count})+magnetAt(xN,magG)+coilFront(coil,{gap})+meter(defl,meterG,{ghost})+extra;
 return stage(ctx,p,s+over,{glow:[650,330,260,MX.B]});}
const REST=500,IN=640;
// Magnet swinging in and out (used from the wire-removal prediction on).
const swing=ctx=>{const v=VE(ctx);return t=>REST+70+70*Math.sin(2*Math.PI*t/(v/2.2));};
// Circulating electric field on a ring around the flux (cx, rx 18, ry 108).
function eRing(ctx,pos,cx=650,{g=1}={}){
 const xN=pos(ctx.t),ph=PHI(xN)*.5,sd=rateN(ctx,pos)>=0?1:-1,eg=.25+.75*Math.abs(needle(ctx,pos));
 const under=chevrons(cx,CY,18,108,ph,{n:12,color:MX.E,size:13,dir:sd,g:g*eg,front:false})+fade(g*.6,`<path d="${arc(cx,CY,18,108,false)}" fill="none" stroke="${MX.E}" stroke-width="2" stroke-dasharray="6 6"/>`);
 const top=fade(g,`<path d="${arc(cx,CY,18,108,true)}" fill="none" stroke="${MX.E}" stroke-width="3"/>`)+chevrons(cx,CY,18,108,ph,{n:12,color:MX.E,size:13,dir:sd,g:g*eg,back:false});
 return {under,top,sd,eg,ph};
}
const minusFormula=(g=1)=>callout(40,92,330,122,fit(`V=-\\dfrac{\\Delta ${cB('\\Phi')}}{\\Delta t}`,205,160,290,50,{color:MX.ink}),g);
// A path through the whole circuit (meter → lead → every coil turn → lead → meter), for tracing.
const CIRCUIT=(()=>{const pts=[[965,392],[965,452],[590,452],[590,CY+CRY]];
 COILX.forEach(x=>{for(let i=0;i<=12;i++){const f=Math.PI*i/12;pts.push([x-CRX*Math.sin(f),CY+CRY*Math.cos(f)]);}for(let i=0;i<=12;i++){const f=Math.PI+Math.PI*i/12;pts.push([x-CRX*Math.sin(f),CY+CRY*Math.cos(f)]);}});
 pts.push([710,432],[1055,432],[1055,392],[1010,392],[965,392]);return pts;})();

// ---- uniform-field loop (tilt / widen) ------------------------------------------------------
const TCX=450,TCY=310,TLINES=Array.from({length:10},(_,i)=>130+40*i);
function tiltLoop(R,th,g=1){const deg=th*180/Math.PI,bx=TCX-R*Math.sin(th),by=TCY+R*Math.cos(th),ly=Math.max(462,by+10);
 return fade(g,draw([[bx-5,by],[bx-5,ly],[965,ly],[965,392]],1,{color:COPPER,w:4})+draw([[bx+5,by],[bx+5,ly+14],[1055,ly+14],[1055,392]],1,{color:COPPER,w:4})
  +`<ellipse cx="${TCX}" cy="${TCY}" rx="${(R*.24).toFixed(1)}" ry="${R.toFixed(1)}" transform="rotate(${deg.toFixed(2)} ${TCX} ${TCY})" fill="${MX.hi}" fill-opacity=".12" stroke="${COPPER}" stroke-width="6"/>`);}

// ---- pipe ------------------------------------------------------------------------------------
function pipe(px,{pw=90,top=100,bot=478,g=1,stripes=true}={}){let s=`<rect x="${px-pw/2}" y="${top}" width="${pw}" height="${bot-top}" rx="8" fill="${COPPER}" fill-opacity=".2" stroke="${COPPER}" stroke-width="3"/>`;
 if(stripes)for(let y=top+30;y<bot-10;y+=46)s+=`<ellipse cx="${px}" cy="${y}" rx="${pw/2-3}" ry="9" fill="none" stroke="${COPPER}" stroke-width="1.5" opacity=".35"/>`;
 return fade(g,s);}
const vMagnet=(x,y,g=1)=>magnet(x,y,{w:84,h:44,angle:90,g}); // N at the bottom
// A horizontal ring of the pipe carrying current; dir=+1 → front (lower arc) runs to the right.
function pipeRing(px,y,dir,g){if(g<=0)return '';const rx=58,ry=13;let s=`<ellipse cx="${px}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${MX.I}" stroke-width="4"/>`;
 s+=arrow(px-dir*22,y+ry+1,px+dir*22,y+ry+1,{color:MX.I,w:4,head:13});return fade(g,s);}

// ---- Φ–t graph -------------------------------------------------------------------------------
const GX=u=>130+470*u,GY=f=>455-290*f/10,Gf=u=>10*u*u*(3-2*u);

export const mx2p5Diagrams={
 'mx5-n-circuit':(p,ctx)=>{
  const gQ=clamp(ctx.t/.4)*(1-on(ctx,'1831年',.4)),gF=on(ctx,'1831年'),gCoil=on(ctx,'コイル',.5),gM=on(ctx,'電流計',.5),tr=on(ctx,'ひと続き',1.4);
  const lead=tr>0&&tr<1?(()=>{const q=Math.floor(tr*(CIRCUIT.length-1));return dot(CIRCUIT[q][0],CIRCUIT[q][1],9,MX.hi);})():'';
  const over=causal('磁場','電流？',600,230,{ca:MX.B,cb:MX.I,size:46,g:gQ})
   +word('1831年 ファラデー',50,140,{size:28,color:MX.hi,g:gF})
   +word('コイル ＝ 何回も巻いた電線',650,190,{size:28,anchor:'middle',color:COPPER,g:gCoil})
   +fade(tr,draw(CIRCUIT,tr,{color:MX.hi,w:5,opacity:.85}))+lead
   +word('ひと続きの輪（回路）',780,500,{size:26,anchor:'middle',color:MX.hi,g:tr});
  return stage(ctx,p,bench()+coilBack(gCoil)+coilFront(gCoil)+meter(0,gM)+over,{glow:[650,330,260,MX.B]});
 },
 'mx5-n-still':(p,ctx)=>{
  const ts=at(ctx,'そこで'),tr=at(ctx,'向きが逆');
  const defl=ctx.t<tr?0:kf(ctx.t,[[tr,0],[tr+.35,.6],[tr+.9,.6],[tr+1.3,-.6],[tr+1.8,-.6],[Math.max(tr+2.1,ts-.2),0]]);
  const gMag=on(ctx,'磁石を置き',.5);
  const over=word('電流なし → 0',1010,190,{size:28,anchor:'middle',g:clamp(ctx.t/.4)*(1-on(ctx,'向きが逆',.3))})
   +word('向きが逆 → 反対へ',1010,190,{size:28,anchor:'middle',color:MX.I,g:on(ctx,'向きが逆',.3)*(1-on(ctx,'そこで',.3))})
   +word('針は 0 のまま',1010,190,{size:28,anchor:'middle',color:MX.plus,g:on(ctx,'針は0',.3)});
  return ch5(ctx,p,{xN:REST,lines:gMag,magG:gMag,defl,over});
 },
 'mx5-n-move':(p,ctx)=>{
  const v=VE(ctx),t1=at(ctx,'入れる'),t2=at(ctx,'抜く');
  const pos=t=>kf(t,[[t1,REST],[t1+.16*v,IN],[t2,IN],[t2+.16*v,REST]]);
  const xN=pos(ctx.t),defl=needle(ctx,pos),moving=Math.abs(defl)>.05;
  const cur=ctx.t<t1?null:ctx.t<t2?['入れる → 右',t1]:['抜く → 左',t2];
  const over=(cur?word(cur[0],1010,190,{size:30,anchor:'middle',color:MX.hi,g:clamp((ctx.t-cur[1])/.3)}):'')
   +fade(moving?1:0,arrow(xN-110-(defl>0?40:-40),250,xN-110+(defl>0?40:-40),250,{color:MX.dim,w:4,head:14}))
   +word('動かした瞬間だけ',300,160,{size:28,anchor:'middle',g:on(ctx,'瞬間')});
  return ch5(ctx,p,{xN,lines:1,defl,over});
 },
 'mx5-n-predict-stop':(p,ctx)=>{
  const v=VE(ctx),ts=at(ctx,'止めたら');
  const pos=t=>kf(t,[[.02*v,REST],[ts+.1,IN]]);
  const xN=pos(ctx.t),defl=needle(ctx,pos,40);
  const gC=clamp((ctx.t-(ts-.35))/.3),pulse=.5+.5*Math.sin(ctx.t*5);
  const card=callout(890,226,240,170,label('？',1010,340,{size:96,color:MX.hi,anchor:'middle',weight:700}),gC,{stroke:MX.hi});
  const over=card+word('入れたまま 止める',xN-110,222,{size:28,anchor:'middle',color:MX.plus,g:on(ctx,'止めたら')})
   +word('右に振れたまま？',470,150,{size:28,anchor:'middle',g:on(ctx,'針は')})+word('0 に戻る？',800,150,{size:28,anchor:'middle',g:on(ctx,'針は',.45,.4)})
   +fade(on(ctx,'針は')*(.5+.5*pulse),ring(1010,310,95,{color:MX.hi,w:3}));
  return ch5(ctx,p,{xN,lines:1,defl,over});
 },
 'mx5-n-stopped':(p,ctx)=>{
  const gC=1-clamp(ctx.t/.35);
  const card=callout(890,226,240,170,label('？',1010,340,{size:96,color:MX.hi,anchor:'middle',weight:700}),gC,{stroke:MX.hi});
  const g2=on(ctx,'磁石が中');
  const over=card+check(1010,190,clamp((ctx.t-.9)/.4))+word('止める → 0',1010,140,{size:28,anchor:'middle',color:MX.good,g:clamp((ctx.t-.9)/.4)})
   +word('磁石は 中にある',530,245,{size:28,anchor:'middle',g:g2})
   +word('動かす → 振れる',60,140,{size:28,g:on(ctx,'止まって')})+word('止める → 0',60,200,{size:28,color:MX.good,g:on(ctx,'止まって',.45,.4)});
  return ch5(ctx,p,{xN:IN,lines:1,defl:0,over});
 },
 'mx5-n-flux':(p,ctx)=>{
  const v=VE(ctx),tm=at(ctx,'コイルの面');
  const pos=t=>kf(t,[[tm,IN],[tm+.15*v,REST-40],[tm+.32*v,IN]]);
  const xN=pos(ctx.t),defl=needle(ctx,pos),gc=on(ctx,'面を');
  const face=fade(gc,`<ellipse cx="650" cy="${CY}" rx="${CRX+4}" ry="${CRY}" fill="${MX.hi}" fill-opacity=".22"/>`);
  const over=word('強さ ではなく',300,150,{size:28,anchor:'middle',g:on(ctx,'磁場の強さ')*(1-on(ctx,'面を'))})
   +word(`磁束 ＝ ${nThrough(xN)}本`,650,150,{size:30,color:MX.B,anchor:'middle',g:gc})
   +word('変わる時だけ 振れる',1010,190,{size:26,anchor:'middle',color:MX.hi,g:on(ctx,'変わる')});
  return ch5(ctx,p,{xN,lines:1,count:gc>.5,defl,under:face,over});
 },
 'mx5-n-tilt':(p,ctx)=>{
  const v=VE(ctx),t1=at(ctx,'傾ける'),t2=at(ctx,'広げる');
  const thF=t=>kf(t,[[t1,0],[t1+.1*v,Math.PI/3],[t2,Math.PI/3],[t2+.05*v,0]]);
  const RF=t=>kf(t,[[t2+.06*v,110],[t2+.2*v,170]]);
  const half=t=>RF(t)*Math.cos(thF(t)),flux=t=>2*half(t)/40;
  const h=.03,defl=clamp((flux(ctx.t+h)-flux(ctx.t-h))/(2*h)*v/45,-1,1);
  const H=half(ctx.t);let n=0,s='';
  for(const y of TLINES){const inn=Math.abs(y-TCY)<H;if(inn)n++;
   s+=line(40,y,850,y,{color:MX.B,w:inn?3.5:2,opacity:inn?.95:.3})+`<polygon points="850,${y} 836,${y-7} 836,${y+7}" fill="${MX.B}" fill-opacity="${inn?.95:.3}"/>`;}
  const R=RF(ctx.t),th=thF(ctx.t);
  const over=word('同じ磁場',60,110,{size:28,color:MX.B,g:clamp(ctx.t/.4)})
   +word(`磁束 ${n}本`,720,110,{size:30,color:MX.B,anchor:'middle'})
   +word('傾ける → 減る',1010,190,{size:28,anchor:'middle',g:on(ctx,'傾ける')*(1-on(ctx,'広げる',.3))})
   +word('広げる → 増える',1010,190,{size:28,anchor:'middle',color:MX.hi,g:on(ctx,'広げる',.3)});
  return stage(ctx,p,s+tiltLoop(R,th)+meter(defl)+over,{glow:[450,310,240,MX.B]});
 },
 'mx5-n-speed':(p,ctx)=>{
  const v=VE(ctx),ts=at(ctx,'ゆっくり'),tf=at(ctx,'速く');
  const S0=440,slowEnd=Math.min(tf-.1*v,ts+.4*v);
  const pos=t=>t<tf-.06*v?kf(t,[[ts,S0],[slowEnd,IN]]):kf(t,[[tf,S0],[tf+.08*v,IN]]);
  const reset=ctx.t>slowEnd&&ctx.t<tf;
  const magG=ctx.t<tf-.08*v?1:ctx.t<tf-.03*v?1-clamp((ctx.t-(tf-.08*v))/(.03*v)):clamp((ctx.t-(tf-.03*v))/(.03*v));
  const xN=pos(ctx.t),defl=reset?0:needle(ctx,pos,160);
  // the largest slow reading, kept as a faint mark for the comparison
  const slowPeak=(()=>{let m=0;for(let i=1;i<40;i++){const t=mix(ts,slowEnd,i/40),h=.03;m=Math.max(m,(PHI(pos(t+h))-PHI(pos(t-h)))/(2*h)*v/160);}return m;})();
  const over=word(`磁束 ${nThrough(xN)}本`,650,150,{size:28,color:MX.B,anchor:'middle',g:magG})
   +word('ゆっくり → 小さく',1010,190,{size:28,anchor:'middle',g:on(ctx,'ゆっくり')*(1-on(ctx,'速く',.3))})
   +word('速く → 大きく',1010,190,{size:30,anchor:'middle',color:MX.hi,g:on(ctx,'速く',.3)})
   +word('同じ 10本 増える',300,150,{size:28,anchor:'middle',g:clamp(ctx.t/.4)});
  return ch5(ctx,p,{xN,lines:1,magG,defl,ghost:ctx.t>tf?slowPeak:null,over});
 },
 'mx5-n-rate':(p,ctx)=>{
  const g1=on(ctx,'5秒'),g2=on(ctx,'1秒なら'),gT=clamp(ctx.t/.5);
  const dim=`<rect x="0" y="80" width="1200" height="435" fill="${MX.bg}" fill-opacity="${(.92*gT).toFixed(2)}"/>`;
  const row=(y,a,b,c,g,col)=>fade(g,label(a,190,y,{size:34,color:MX.dim})+label(b,420,y,{size:36,color:MX.ink,weight:700})+label(c,690,y,{size:36,color:col,weight:700}));
  const inner=word('変化の速さ ＝ 1秒あたりの 磁束の増え方',600,160,{size:32,anchor:'middle',color:MX.hi,g:on(ctx,'1秒あたり')})
   +row(275,'ゆっくり','10本 ÷ 5秒','＝ 1秒あたり 2本',g1,MX.ink)
   +row(365,'速く','10本 ÷ 1秒','＝ 1秒あたり 10本',g2,MX.hi)
   +fade(g2,line(180,315,1030,315,{color:MX.faint,w:2}))
   +word('短い時間で変わるほど 大きい',600,455,{size:28,anchor:'middle',g:on(ctx,'1秒なら',.45,.8)});
  return ch5(ctx,p,{xN:IN,lines:1,over:dim+inner});
 },
 'mx5-n-check':(p,ctx)=>{
  const dim=`<rect x="0" y="80" width="1200" height="435" fill="${MX.bg}" fill-opacity=".92"/>`;
  const gF=clamp(ctx.t/.5),gQ=on(ctx,'3秒'),pulse=.5+.5*Math.sin(ctx.t*5);
  const frac=tex(`\\dfrac{\\Delta ${cB('\\Phi')}}{\\Delta t}`,250,300,{size:84,auto:false,color:MX.ink});
  const inner=fade(gF,frac+label('増えた磁束',340,240,{size:28,color:MX.B})+label('かかった時間',340,345,{size:28,color:MX.ink})
    +label('Δ ＝ 変化した量',130,450,{size:26,color:MX.dim}))
   +callout(640,170,500,240,label('確認',665,215,{size:26,color:MX.hi,weight:700})
    +label('3秒で 6本 増えた',890,285,{size:36,color:MX.ink,anchor:'middle',weight:700})
    +label('1秒あたり',850,365,{size:36,color:MX.ink,anchor:'middle'})+fade(.6+.4*pulse,label('？本',1010,368,{size:44,color:MX.hi,anchor:'middle',weight:700})),gQ,{stroke:MX.hi});
  return ch5(ctx,p,{xN:IN,lines:1,over:dim+inner});
 },
 'mx5-n-instant':(p,ctx)=>{
  const dim=`<rect x="0" y="80" width="1200" height="435" fill="${MX.bg}" fill-opacity=".95"/>`;
  const gA=clamp(ctx.t/.4)*(1-on(ctx,'増え方が',.4)),gG=on(ctx,'増え方が',.5),tk=at(ctx,'区間を'),ti=at(ctx,'その瞬間');
  const d=kf(ctx.t,[[tk,.45],[ti,.03]]),u0=.3,u1=u0+d,f0=Gf(u0),f1=Gf(u1),gTan=on(ctx,'その瞬間',.5);
  let g='';
  g+=line(GX(0),GY(0),GX(1)+10,GY(0),{color:MX.dim,w:3})+line(GX(0),GY(0),GX(0),GY(10)-15,{color:MX.dim,w:3})
   +label('時間',GX(1)-10,GY(0)+36,{size:24,color:MX.dim,anchor:'end'})+label('磁束',GX(0)-12,GY(10)-20,{size:24,color:MX.B,anchor:'end'});
  g+=draw(Array.from({length:61},(_,i)=>[GX(i/60),GY(Gf(i/60))]),1,{color:MX.B,w:4});
  // secant over [u0,u1]: its slope is the average rate ΔΦ/Δt
  const sl=(f1-f0)/d,ext=.12,sx0=u0-ext,sx1=u1+ext;
  g+=fade(on(ctx,'区間を')*(1-gTan*.7),line(GX(sx0),GY(f0-sl*ext),GX(sx1),GY(f1+sl*ext),{color:MX.hi,w:3})
   +line(GX(u0),GY(f0),GX(u1),GY(f0),{color:MX.ink,w:2,dash:'6 5'})+line(GX(u1),GY(f0),GX(u1),GY(f1),{color:MX.B,w:2,dash:'6 5'})
   +fade(clamp((d-.1)/.1),label('Δt',GX((u0+u1)/2),GY(f0)+30,{size:24,color:MX.ink,anchor:'middle'})+label('ΔΦ',GX(u1)+10,GY((f0+f1)/2)+8,{size:24,color:MX.B}))
   +dot(GX(u1),GY(f1),7,MX.hi));
  const tsl=6*u0*(1-u0)*10;
  g+=fade(gTan,line(GX(u0-.2),GY(f0-tsl*.2),GX(u0+.2),GY(f0+tsl*.2),{color:MX.good,w:5}));
  g+=dot(GX(u0),GY(f0),8,MX.hi)+fade(gTan,label('この瞬間',GX(u0)+14,GY(f0)+34,{size:24,color:MX.good}));
  const right=fade(on(ctx,'区間を'),tex(`\\dfrac{\\Delta ${cB('\\Phi')}}{\\Delta t}`,760,245,{size:58,auto:false,color:MX.ink})+label('区間の平均の増え方',830,238,{size:26,color:MX.dim}))
   +fade(gTan,arrow(760,275,760,330,{color:MX.dim,w:3,head:12})+tex(`\\dfrac{d${cB('\\Phi')}}{dt}`,760,410,{size:58,auto:false,color:MX.good})+label('その瞬間の 変化の速さ',830,403,{size:26,color:MX.good,weight:700}));
  const over=dim+word('6本 ÷ 3秒 ＝ 1秒あたり 2本',600,200,{size:34,anchor:'middle',color:MX.hi,g:gA})+check(890,195,gA*clamp((ctx.t-.3)/.4))
   +fade(gG,g+right);
  return ch5(ctx,p,{xN:IN,lines:1,over});
 },
 'mx5-n-emf':(p,ctx)=>{
  const pos=swing(ctx),xN=pos(ctx.t),tc=at(ctx,'電流が流れる'),tz=at(ctx,'閉じている');
  const gap=ctx.t<tc?0:ctx.t<tz?clamp((ctx.t-tc)/.3):1-clamp((ctx.t-tz-.2)/.3),closed=gap<.05;
  const d=needle(ctx,pos),defl=closed?d:0,rate=Math.abs(d);
  const ph=PHI(xN)*.55,sd=rateN(ctx,pos)>=0?1:-1;
  const extra=chevrons(650,CY,CRX+4,CRY+4,ph,{n:12,size:14,g:(closed?1:0)*clamp(rate*4),back:false,dir:sd});
  const over=minusFormula(1)+fade(on(ctx,'V は'),ring(103,148,22,{color:MX.hi,w:4}))
   +word('起電力：電荷を回路に沿って動かす働き',720,150,{size:26,anchor:'middle',color:MX.hi,g:on(ctx,'電荷を')})
   +word('切れている → 電流 0',780,505,{size:24,anchor:'middle',color:MX.plus,g:gap>.5?1:0})
   +word('閉じた回路 → 電流',780,505,{size:24,anchor:'middle',color:MX.I,g:ctx.t>tz+.3?1:0});
  return ch5(ctx,p,{xN,lines:1,defl,gap,extra,over});
 },
 'mx5-n-lenz-in':(p,ctx)=>{
  const v=VE(ctx),pos=t=>mix(420,600,clamp((t-.04*v)/(.9*v)));
  const xN=pos(ctx.t),defl=needle(ctx,pos),rate=Math.max(0,defl);
  const gC=on(ctx,'電流が流れる'),gB=on(ctx,'近づく'),gF=on(ctx,'押し返'),ph=PHI(xN)*.8;
  const extra=chevrons(650,CY,CRX+4,CRY+4,ph,{n:12,size:15,g:gC*clamp(rate*6+.3),back:false})
   +fade(gB,arrow(740,CY,575,CY,{color:MX.B,w:6,head:20})+word('N',560,CY-110,{size:30,color:MX.plus,anchor:'middle'})+word('コイルの磁場',770,200,{size:22,color:MX.B}))
   +fade(gF,arrow(xN-150,CY-62,xN-260,CY-62,{color:C.F,w:7,head:20})+label('押し返す',xN-205,CY-80,{size:26,color:C.F,anchor:'middle',weight:700}));
  const over=minusFormula(1)+fade(clamp(ctx.t/.4),ring(197,150,18,{color:MX.hi,w:4}))
   +word('変化を 邪魔する向き',720,150,{size:28,anchor:'middle',color:MX.hi,g:on(ctx,'邪魔する')});
  return ch5(ctx,p,{xN,lines:1,defl,extra,over});
 },
 'mx5-n-lenz-out':(p,ctx)=>{
  const v=VE(ctx),pos=t=>mix(600,420,clamp((t-.02*v)/(.75*v)));
  const xN=pos(ctx.t),defl=needle(ctx,pos),rate=Math.max(0,-defl),ph=PHI(xN)*.8;
  const gCur=clamp(rate*6+.3),gF=on(ctx,'引き戻');
  const extra=chevrons(650,CY,CRX+4,CRY+4,ph,{n:12,size:15,g:gCur,back:false,dir:-1})
   +fade(gCur,arrow(560,CY,725,CY,{color:MX.B,w:6,head:20})+word('S',560,CY-110,{size:30,color:MX.minus,anchor:'middle'}))
   +fade(gF*clamp(rate*6+.3),arrow(xN-40,CY+62,xN+70,CY+62,{color:C.F,w:7,head:20})+label('引き戻す',xN+15,CY+100,{size:26,color:C.F,anchor:'middle',weight:700}));
  const over=minusFormula(1-on(ctx,'いつも',.4))
   +fade(on(ctx,'いつも'),callout(40,95,420,130,label('近づく → 押し返す',60,145,{size:28,color:MX.ink})+label('遠ざかる → 引き戻す',60,200,{size:28,color:MX.ink})))
   +word('変化を 邪魔する ＝ レンツの法則',760,150,{size:28,anchor:'middle',color:MX.hi,g:on(ctx,'変化を')});
  return ch5(ctx,p,{xN,lines:1,defl,extra,over});
 },
 'mx5-n-pipe':(p,ctx)=>{
  const t0=at(ctx,'落として'),tt=Math.max(0,ctx.t-t0),T=Math.max(1,VE(ctx)-t0+.5);
  const fall=tt%1.2,yo=ctx.t<t0?140:140+Math.min(310,.5*1500*fall*fall),yi=ctx.t<t0?140:140+300*clamp(tt/T);
  const L=330,Rx=780;let s=bench();
  s+=vMagnet(L,yo,clamp(ctx.t/.4));
  // the slow magnet leaves faint marks of where it was, a moment ago
  for(let k=1;k<=3;k++){const tp=tt-k*.5;if(tp>0)s+=fade(.14,vMagnet(Rx,140+300*clamp(tp/T)));}
  s+=vMagnet(Rx,yi)+pipe(Rx);
  s+=word('パイプなし：すとん',L,140,{size:26,anchor:'middle',g:on(ctx,'落として',.45,.6)})
   +word('銅のパイプ',Rx+80,140,{size:28,color:COPPER,g:clamp(ctx.t/.5)})
   +word('銅は 磁石に つかない',Rx+80,250,{size:26,g:on(ctx,'くっつかない')})
   +word('ふわり… ゆっくり',Rx+80,360,{size:30,color:MX.hi,g:on(ctx,'ふわりと')});
  return stage(ctx,p,s,{glow:[Rx,300,220,COPPER]});
 },
 'mx5-n-pipe-why':(p,ctx)=>{
  const v=VE(ctx),px=600,yi=mix(230,290,clamp(ctx.t/v)),yLo=410,yHi=150;
  const gLc=on(ctx,'下の輪'),gLb=on(ctx,'近づく'),gLf=on(ctx,'押し返'),gUc=on(ctx,'上の輪'),gUb=on(ctx,'遠ざかる'),gUf=on(ctx,'引き戻'),gAll=on(ctx,'どちらも');
  let s=bench()+pipe(px,{g:.8})+vMagnet(px,yi);
  s+=pipeRing(px,yLo,1,gLc)+fade(gLb,arrow(px,yLo+30,px,yLo-40,{color:MX.B,w:5,head:14})+word('N',px+95,yLo-20,{size:26,color:MX.plus,anchor:'middle'}));
  s+=pipeRing(px,yHi,-1,gUc)+fade(gUb,arrow(px,yHi-30,px,yHi+40,{color:MX.B,w:5,head:14})+word('N',px+95,yHi+22,{size:26,color:MX.plus,anchor:'middle'}));
  s+=fade(gLf,arrow(px-75,yi+40,px-75,yi-30,{color:C.F,w:6,head:16}))+word('下の輪：押し返す',px-120,yLo+8,{size:26,anchor:'end',color:MX.I,g:gLc})
   +fade(gUf,arrow(px+75,yi+40,px+75,yi-30,{color:C.F,w:6,head:16}))+word('上の輪：引き戻す',px-120,yHi+8,{size:26,anchor:'end',color:MX.I,g:gUc})
   +word('どちらも 上向きの力',px+130,yi+10,{size:30,color:C.F,g:gAll});
  return stage(ctx,p,s,{glow:[px,300,220,COPPER]});
 },
 'mx5-n-predict-wire':(p,ctx)=>{
  const pos=swing(ctx),xN=pos(ctx.t),gone=on(ctx,'取り去',.8),gQ=on(ctx,'何か'),pulse=.5+.5*Math.sin(ctx.t*5);
  const over=coilGhost(gone)+word('電線なし',650,150,{size:30,anchor:'middle',g:gone})
   +fade(gQ*(.6+.4*pulse),label('？',650,CY+30,{size:110,color:MX.hi,anchor:'middle',weight:700}))
   +word('磁石は 動かし続ける',300,150,{size:26,anchor:'middle',g:on(ctx,'磁石だけ')});
  return ch5(ctx,p,{xN,lines:1,coil:1-gone,meterG:1-gone,defl:needle(ctx,pos),over});
 },
 'mx5-n-efield':(p,ctx)=>{
  const pos=swing(ctx),xN=pos(ctx.t),gE=on(ctx,'ぐるりと',.6),gq=on(ctx,'小さな'),gF=on(ctx,'力を受け');
  const {under,top,sd,eg}=eRing(ctx,pos,650,{g:gE});
  const qx=650+18*Math.cos(-Math.PI/6),qy=CY+108*Math.sin(Math.PI/6),fl=30+45*eg;
  const extra=top+fade(gq,charge(qx,qy,1,{r:15}))+fade(gF,arrow(qx+26,qy,qx+26,qy-sd*fl,{color:C.F,w:6,head:16}));
  const over=word('回る電場',860,200,{size:32,color:MX.E,g:gE})+word('電線なし',650,150,{size:28,anchor:'middle'})
   +word('小さなプラスの電荷 → 力',760,440,{size:26,color:C.F,g:gq})
   +fade(on(ctx,'生まれて'),label('電場は まわりの空間全体にできる（代表の一周だけを描いています）',600,508,{size:22,color:MX.dim,anchor:'middle'}));
  return ch5(ctx,p,{xN,lines:1,coil:0,meterG:0,under,extra,over});
 },
 'mx5-n-aha':(p,ctx)=>{
  const pos=swing(ctx),xN=pos(ctx.t),g2=on(ctx,'電線の中'),gW=clamp(ctx.t/.6);
  const {under,top,ph}=eRing(ctx,pos,650);
  // electrons (−) in a faint wire ring move against the field
  let el='';for(let j=0;j<8;j++){const th=2*Math.PI*j/8-ph*1.4,x=650+18*Math.cos(th),y=CY-108*Math.sin(th);el+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${MX.minus}" stroke="#fff" stroke-width="1.5" opacity="${Math.cos(th)>0?1:.45}"/>`;}
  const wire=fade(gW*.55,`<ellipse cx="650" cy="${CY}" rx="18" ry="108" fill="none" stroke="${COPPER}" stroke-width="9"/>`);
  const g1=clamp(ctx.t/.4)*(1-g2);
  const over=fade(g1,word('電線 が 電場を作る？',600,150,{size:30,anchor:'middle'})+line(420,145,780,145,{color:MX.plus,w:5})+label('✕',820,162,{size:44,color:MX.plus,anchor:'middle',weight:700}))
   +word('電線の中の電荷 が 電場を知らせる',600,150,{size:30,anchor:'middle',color:MX.hi,g:g2})
   +word('電場',860,230,{size:30,color:MX.E})+word('電荷 −',860,420,{size:28,color:MX.minus,g:g2});
  return ch5(ctx,p,{xN,lines:1,coil:0,meterG:0,under:wire+under,extra:top+fade(g2,el),over});
 },
 'mx5-n-faraday':(p,ctx)=>{
  const tR=on(ctx,'磁束の'),tM=on(ctx,'マイナス'),gAll=on(ctx,'これが'),tw=at(ctx,'一周'),tw2=at(ctx,'磁束の');
  const w=clamp((ctx.t-tw)/Math.max(.3,tw2-tw));
  const S=62,parts=[`\\oint ${cE('\\vec E')}\\cdot d\\vec r`,'=','-',`\\dfrac{d${cB('\\Phi_B')}}{dt}`],gap=22;
  const ws=parts.map(q=>texWidth(q,S,false)),tot=ws.reduce((a,b)=>a+b,0)+gap*3;let x=720-tot/2;const cx=[];
  ws.forEach(wd=>{cx.push(x+wd/2);x+=wd+gap;});
  const op=[1-.7*tR*(1-gAll),.3+.7*Math.max(tR,gAll),.3+.7*Math.max(tM,gAll),.3+.7*Math.max(tR,gAll)];
  const eq=parts.map((q,i)=>fade(op[i],tex(q,cx[i],285,{size:S,auto:false,color:MX.ink}))).join('');
  const labs=fade(clamp(ctx.t/.4),label('一周の足し算',cx[0],385,{size:26,color:MX.E,anchor:'middle',weight:700})+label('道に沿う成分 × 短い長さ',cx[0],420,{size:22,color:MX.dim,anchor:'middle'}))
   +fade(tR,label('磁束の変化の速さ',cx[3]+20,385,{size:26,color:MX.B,anchor:'middle',weight:700}))
   +fade(tM,label('変化を邪魔する向き',cx[2]+14,198,{size:24,color:MX.hi,anchor:'end'})+arrow(cx[2],206,cx[2],248,{color:MX.hi,w:3,head:10}));
  // small picture on the left: flux through a ring and the field walked around it
  const ring_=Array.from({length:81},(_,i)=>{const th=-Math.PI/2+2*Math.PI*i/80;return [150+16*Math.cos(th),300-100*Math.sin(th)];});
  const walk=ring_[Math.min(80,Math.round(w*80))],ph=sceneT(ctx)*.8;
  let pic='';for(const dy of [-50,-15,15,50])pic+=arrow(60,300+dy,250,300+dy,{color:MX.B,w:3,head:12,opacity:.8});
  pic+=`<path d="${arc(150,300,16,100,false)}" fill="none" stroke="${MX.E}" stroke-width="2" stroke-dasharray="6 6" opacity=".6"/>`+`<path d="${arc(150,300,16,100,true)}" fill="none" stroke="${MX.E}" stroke-width="3"/>`
   +chevrons(150,300,16,100,ph,{n:10,color:MX.E,size:12,back:false})+(w>0?draw(ring_,w,{color:MX.hi,w:5,opacity:.9})+(w<1?dot(walk[0],walk[1],9,MX.hi):''):'');
  const over=word('ファラデーの法則',720,140,{size:32,anchor:'middle',color:MX.hi,g:gAll});
  return stage(ctx,p,pic+eq+labs+over,{glow:[700,290,300,MX.E]});
 },
 'mx5-n-end':(p,ctx)=>{
  const g2=on(ctx,'では逆に');
  const inner=fade(.18,tex(`\\oint ${cE('\\vec E')}\\cdot d\\vec r=-\\dfrac{d${cB('\\Phi_B')}}{dt}`,600,285,{size:62,auto:false,color:MX.ink}))
   +callout(200,150,800,270,causal('磁場の変化','電場',560,245,{ca:MX.B,cb:MX.E,size:40})+check(900,233,on(ctx,'電場を作る'))
   +fade(g2,causal('電場の変化','磁場',560,355,{ca:MX.E,cb:MX.B,size:40})+label('？',905,367,{size:56,color:MX.hi,anchor:'middle',weight:700})),clamp(ctx.t/.4));
  return stage(ctx,p,inner,{glow:[600,290,300,MX.E]});
 },
};
