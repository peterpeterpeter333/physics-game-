// Diagrams for the Maxwell film (v3 deep mode), part p5 (chapter 5, Faraday). Keys: 'mx5-n-<name>'.
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
// A path through the whole circuit (meter → lead → every coil turn → lead → meter), for tracing.
const CIRCUIT=(()=>{const pts=[[965,392],[965,452],[590,452],[590,CY+CRY]];
 COILX.forEach(x=>{for(let i=0;i<=12;i++){const f=Math.PI*i/12;pts.push([x-CRX*Math.sin(f),CY+CRY*Math.cos(f)]);}for(let i=0;i<=12;i++){const f=Math.PI+Math.PI*i/12;pts.push([x-CRX*Math.sin(f),CY+CRY*Math.cos(f)]);}});
 pts.push([710,432],[1055,432],[1055,392],[1010,392],[965,392]);return pts;})();

// ---- uniform-field loop (tilt / widen) ------------------------------------------------------
const TCX=450,TCY=310,TLINES=Array.from({length:10},(_,i)=>130+40*i);
function tiltLoop(R,th,g=1,leads=true){const deg=th*180/Math.PI,bx=TCX-R*Math.sin(th),by=TCY+R*Math.cos(th),ly=Math.max(462,by+10);
 return fade(g,(leads?draw([[bx-5,by],[bx-5,ly],[965,ly],[965,392]],1,{color:COPPER,w:4})+draw([[bx+5,by],[bx+5,ly+14],[1055,ly+14],[1055,392]],1,{color:COPPER,w:4}):'')
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


// ---- v3 additions ----------------------------------------------------------------------------
const dimAll=(o=.92)=>`<rect x="0" y="80" width="1200" height="435" fill="${MX.bg}" fill-opacity="${o.toFixed(2)}"/>`;
const hosoku=(g=1)=>word('補足',40,122,{size:26,color:MX.hi,g});
// One turn seen edge-on (sign / Lenz). Front half = right half of the ellipse.
const LX=650,LRX=16,LRY=100;
const loopBack=(g=1)=>fade(g,`<path d="${arc(LX,CY,LRX,LRY,false)}" fill="none" stroke="${COPPER2}" stroke-width="5"/>`);
const loopFront=(g=1)=>fade(g,`<path d="${arc(LX,CY,LRX,LRY,true)}" fill="none" stroke="${COPPER}" stroke-width="7" stroke-linecap="round"/>`);
const membrane=(g=1)=>fade(g,`<ellipse cx="${LX}" cy="${CY}" rx="${LRX}" ry="${LRY}" fill="${MX.hi}" fill-opacity=".16"/>`);
function one(ctx,p,{xN=REST,lines=1,magG=1,extra='',over='',under=''}={}){
 return stage(ctx,p,bench()+under+loopBack()+fLines(xN,lines*magG)+magnetAt(xN,magG)+loopFront()+extra+over,{glow:[650,330,260,MX.B]});}
// The chosen positive direction: front half runs DOWN ⇔ membrane normal points RIGHT (right-hand rule).
const posDir=(g=1)=>fade(g,arrow(LX+40,CY-48,LX+40,CY+48,{color:MX.ink,w:4,head:14})+label('回る 正の向き',LX+58,CY+80,{size:24,color:MX.ink}));
// Face-on single loop (work per 1 C). B out of the screen, growing → E clockwise on screen.
const FX=300,FY=305,FR=150;
const fpt=a=>[FX+FR*Math.cos(a),FY+FR*Math.sin(a)];
function faceLoop({g=1,bG=1,bs=1,eG=0,ph=0,trace=0}={}){
 let s=`<circle cx="${FX}" cy="${FY}" r="${FR}" fill="none" stroke="${COPPER}" stroke-width="8"/>`;
 for(const [dx,dy] of [[-70,-60],[0,-60],[70,-60],[-100,0],[-35,0],[35,0],[100,0],[-70,60],[0,60],[70,60]]){const r=7+4*bs;
  s+=fade(bG,ring(FX+dx,FY+dy,r,{color:MX.B,w:2.5})+dot(FX+dx,FY+dy,2.5+1.2*bs,MX.B));}
 for(let k=0;k<8;k++){const a=2*Math.PI*k/8+ph,[x,y]=fpt(a),tx=-Math.sin(a),ty=Math.cos(a);
  s+=fade(eG,arrow(x-tx*24,y-ty*24,x+tx*24,y+ty*24,{color:MX.E,w:5,head:14}));}
 if(trace>0){const pts=Array.from({length:97},(_,i)=>fpt(-Math.PI/2+2*Math.PI*i/96));s+=draw(pts,trace,{color:MX.hi,w:6,opacity:.9});
  if(trace<1){const q=pts[Math.round(trace*96)];s+=dot(q[0],q[1],9,MX.hi);}}
 return fade(g,s);}
// ⊙ legend for the face-on loop
const outLegend=(x,y,g=1)=>fade(g,ring(x,y,11,{color:MX.B,w:2.5})+dot(x,y,3.5,MX.B)+label('磁場（手前向き）が増える',x+22,y+8,{size:22,color:MX.B}));
// A small general step: step Δr (horizontal) and a slanted force, with the along-path component.
function stepInset(g=1,{gF=1,gC=1,e=false}={}){const x0=690,y0=215,L=150,ang=-.62,fx=x0+L*Math.cos(ang),fy=y0+L*Math.sin(ang),px=fx;
 return callout(620,95,540,170,
  arrow(x0,y0,x0+200,y0,{color:MX.hi,w:5,head:16})+label('短い一歩',x0+210,y0+8,{size:24,color:MX.hi})
  +fade(gF,arrow(x0,y0,fx,fy,{color:e?MX.E:C.F,w:5,head:16})+label(e?'E':'qE',fx+10,fy+4,{size:26,color:e?MX.E:C.F,weight:700}))
  +fade(gC,line(fx,fy,px,y0,{color:e?MX.E:C.F,w:2,dash:'5 5'})+line(x0,y0+14,px,y0+14,{color:e?MX.E:C.F,w:6})+label('沿う成分',x0+4,y0+40,{size:22,color:e?MX.E:C.F}))
  +dot(x0,y0,7,MX.ink),g,{stroke:'#3a4a6a'});}
// Φ–t graph frame
function axes(xl='時間',yl='磁束'){return line(GX(0),GY(0),GX(1)+10,GY(0),{color:MX.dim,w:3})+line(GX(0),GY(0),GX(0),GY(10)-15,{color:MX.dim,w:3})
 +label(xl,GX(1)-10,GY(0)+36,{size:24,color:MX.dim,anchor:'end'})+label(yl,GX(0)-12,GY(10)-20,{size:24,color:MX.B,anchor:'end'});}
const curve=()=>draw(Array.from({length:61},(_,i)=>[GX(i/60),GY(Gf(i/60))]),1,{color:MX.B,w:4});
// secant/triangle over [u0,u0+d]
function secant(u0,d,{gS=1,gT=1,gP=1,lab=1}={}){const u1=u0+d,f0=Gf(u0),f1=Gf(u1),sl=(f1-f0)/d,ext=.12;
 return fade(gS,line(GX(u0-ext),GY(f0-sl*ext),GX(u1+ext),GY(f1+sl*ext),{color:MX.hi,w:3}))
  +fade(gT,line(GX(u0),GY(f0),GX(u1),GY(f0),{color:MX.ink,w:3,dash:'6 5'})+fade(lab*clamp((d-.1)/.1),label('Δt',GX((u0+u1)/2),GY(f0)+32,{size:26,color:MX.ink,anchor:'middle',weight:700})))
  +fade(gP,line(GX(u1),GY(f0),GX(u1),GY(f1),{color:MX.B,w:3,dash:'6 5'})+fade(lab*clamp((d-.1)/.1),label('ΔΦ',GX(u1)+10,GY((f0+f1)/2)+8,{size:26,color:MX.B,weight:700})))
  +dot(GX(u0),GY(f0),8,MX.hi)+fade(Math.max(gT,gP),dot(GX(u1),GY(f1),7,MX.hi));}
const U0=.3;
// Current dots moving around the rectangular circuit (ohm cue).
const RECT=[[110,160],[500,160],[500,450],[110,450],[110,160]];
function alongRect(f){const seg=[390,290,390,290],tot=1360;let d=((f%1)+1)%1*tot;for(let i=0;i<4;i++){if(d<=seg[i]){const u=d/seg[i];return [mix(RECT[i][0],RECT[i+1][0],u),mix(RECT[i][1],RECT[i+1][1],u)];}d-=seg[i];}return RECT[0];}

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
  const gFix=clamp(ctx.t/.4)*(1-on(ctx,'効いて',.4));
  const over=word('コイルは 固定',650,150,{size:28,anchor:'middle',color:COPPER,g:gFix})+word('動かすのは 磁石',300,150,{size:28,anchor:'middle',g:on(ctx,'磁石だけ')*(1-on(ctx,'効いて',.4))})
   +word('強さ ではなく',300,150,{size:28,anchor:'middle',g:on(ctx,'磁場の強さ')*(1-on(ctx,'面を'))})
   +word('面をつき抜ける 磁束',650,150,{size:30,color:MX.B,anchor:'middle',g:gc})
   +word('変わる時だけ 振れる',1010,190,{size:26,anchor:'middle',color:MX.hi,g:on(ctx,'変わる')});
  return ch5(ctx,p,{xN,lines:1,count:gc>.5,defl,under:face,over});
 },
 'mx5-n-fluxdef':(p,ctx)=>{
  const gS=on(ctx,'細かく分け',.6),gP=on(ctx,'垂直な'),gT=on(ctx,'全体で'),gU=on(ctx,'単位は');
  // the coil face split into thin strips, each a small area
  let strips='';for(let k=0;k<8;k++){const y0=CY-CRY+k*2*CRY/8,h=2*CRY/8-3;strips+=`<rect x="${650-CRX-3}" y="${y0.toFixed(1)}" width="${2*CRX+6}" height="${h.toFixed(1)}" rx="3" fill="${MX.hi}" fill-opacity="${k===3?.55:.18}"/>`;}
  const under=fade(gS,strips);
  const P=[cB('\\Phi_B'),'=','\\sum',cB('B_{\\perp}'),'\\Delta A'],SZ=52,gp=18,W=P.map(q=>texWidth(q,SZ,false)),TT=W.reduce((a,b)=>a+b,0)+gp*4;let xx=320-TT/2;const X=[];W.forEach(w=>{X.push(xx+w/2);xx+=w+gp;});
  const eq=callout(40,92,560,175,P.map((q,i)=>tex(q,X[i],168,{size:SZ,auto:false,color:MX.ink})).join('')
   +fade(gT,label('全体で合計',X[2],222,{size:22,color:MX.hi,anchor:'middle'}))+fade(gP,label('面に垂直な成分',X[3],252,{size:22,color:MX.B,anchor:'middle'}))+fade(gS,label('小さな面積',X[4]+10,222,{size:22,color:MX.ink,anchor:'middle'})),clamp(ctx.t/.5));
  const over=fade(gP,arrow(718,CY-CRY+3.5*2*CRY/8,810,CY-CRY+3.5*2*CRY/8,{color:MX.B,w:5,head:14})+label('B⊥',820,CY-CRY+3.5*2*CRY/8+8,{size:24,color:MX.B,weight:700}))
   +word('単位 Wb（ウェーバ）',1010,170,{size:28,anchor:'middle',color:MX.hi,g:gU});
  return ch5(ctx,p,{xN:IN,lines:.35,defl:0,under,over:eq+over});
 },
 'mx5-n-model':(p,ctx)=>{
  const g1=on(ctx,'1本が'),g2=on(ctx,'本数で');
  const over=word('線 1本 ＝ 同じ量の磁束（約束した目印）',600,140,{size:28,anchor:'middle',color:MX.B,g:g1})
   +word(`面をつき抜ける線：${nThrough(IN)}本`,650,505,{size:26,anchor:'middle',color:MX.hi,g:g2})
   +word('本数 → 磁束の大きさ',1010,190,{size:26,anchor:'middle',g:on(ctx,'磁束の大きさ')});
  const face=fade(g2,`<ellipse cx="650" cy="${CY}" rx="${CRX+4}" ry="${CRY}" fill="${MX.hi}" fill-opacity=".22"/>`);
  return ch5(ctx,p,{xN:IN,lines:1,count:g2>.5,defl:0,under:face,over});
 },
 'mx5-n-surface':(p,ctx)=>{
  const gA=on(ctx,'縁が同じ'),gB=on(ctx,'膜をどう',.8),gBag=on(ctx,'二つの膜'),gZ=on(ctx,'出る磁束');
  const x0=520,ry=130,cy=310,bul=mix(0,260,gB);
  let s='';
  for(const dy of [-90,-45,0,45,90])s+=arrow(150,cy+dy,860,cy+dy,{color:MX.B,w:3,head:12,opacity:.75});
  const dome=`M${x0} ${cy-ry} C ${x0+bul*1.3} ${cy-ry}, ${x0+bul*1.3} ${cy+ry}, ${x0} ${cy+ry}`;
  s+=fade(gA,`<ellipse cx="${x0}" cy="${cy}" rx="22" ry="${ry}" fill="${MX.hi}" fill-opacity=".22" stroke="none"/>`)
   +fade(gB,`<path d="${dome}" fill="${MX.E}" fill-opacity="${(.14+.1*gBag).toFixed(2)}" stroke="${MX.E}" stroke-width="3"/>`)
   +`<ellipse cx="${x0}" cy="${cy}" rx="22" ry="${ry}" fill="none" stroke="${COPPER}" stroke-width="7"/>`;
  // crossings of each line with the flat membrane and the dome
  for(const dy of [-90,-45,0,45,90]){const yy=cy+dy;s+=fade(gA,dot(x0,yy,6,MX.hi));
   // dome x at height yy: cubic with control x0+1.3bul → max ≈ x0+.975bul at centre; approximate shape
   const tt=(yy-(cy-ry))/(2*ry),bx=x0+bul*1.3*3*tt*(1-tt);s+=fade(gB*clamp(bul/60),dot(bx,yy,6,MX.E));}
  s+=word('膜A（平ら）',x0,120,{size:26,anchor:'middle',color:MX.hi,g:gA})+word('膜B（ふくらませた）',x0+260,120,{size:26,anchor:'middle',color:MX.E,g:gB})
   +word('縁は 同じ輪',x0,490,{size:24,anchor:'middle',color:COPPER,g:gA})
   +word('A と B で 閉じた袋',1030,200,{size:26,anchor:'middle',g:gBag})
   +word('出る − 入る ＝ 0',1030,290,{size:26,anchor:'middle',color:MX.B,g:gZ})
   +word('A の磁束 ＝ B の磁束',1020,380,{size:28,anchor:'middle',color:MX.hi,g:on(ctx,'出る磁束',.45,.8)});
  return stage(ctx,p,s+hosoku(),{glow:[600,310,260,MX.B]});
 },
 'mx5-n-tilt':(p,ctx)=>{
  const v=VE(ctx),t1=at(ctx,'傾ける'),t2=at(ctx,'広げる');
  const thF=t=>kf(t,[[t1,0],[t1+.12*v,Math.PI/3],[t2,Math.PI/3],[t2+.05*v,0]]);
  const RF=t=>kf(t,[[t2+.06*v,110],[t2+.2*v,170]]);
  const H=RF(ctx.t)*Math.cos(thF(ctx.t));let n=0,s='';
  for(const y of TLINES){const inn=Math.abs(y-TCY)<H;if(inn)n++;
   s+=line(40,y,850,y,{color:MX.B,w:inn?3.5:2,opacity:inn?.95:.3})+`<polygon points="850,${y} 836,${y-7} 836,${y+7}" fill="${MX.B}" fill-opacity="${inn?.95:.3}"/>`;}
  const R=RF(ctx.t),th=thF(ctx.t);
  // normal of the loop and the field's component along it
  const gN=on(ctx,'垂直な成分')*(1-on(ctx,'広げる',.3)),nx=Math.cos(th),ny=Math.sin(th);
  const nrm=fade(gN,arrow(TCX,TCY,TCX+150*nx,TCY+150*ny,{color:MX.ink,w:4,head:14})+label('面に垂直',TCX+150*nx+10,TCY+150*ny+26,{size:22,color:MX.ink}))
   +word(`垂直な成分 ＝ ${Math.cos(th).toFixed(1)} 倍`,1010,360,{size:26,anchor:'middle',color:MX.B,g:gN});
  const over=word('同じ磁場',60,110,{size:28,color:MX.B,g:clamp(ctx.t/.4)})
   +word(`磁束：線 ${n}本分`,1010,160,{size:30,color:MX.B,anchor:'middle'})
   +word('傾ける → 減る',1010,260,{size:28,anchor:'middle',g:on(ctx,'傾ける')*(1-on(ctx,'広げる',.3))})
   +word('広げる → 増える',1010,260,{size:28,anchor:'middle',color:MX.hi,g:on(ctx,'広げる',.3)});
  return stage(ctx,p,s+tiltLoop(R,th,1,false)+nrm+over,{glow:[450,310,240,MX.B]});
 },
 'mx5-n-moving':(p,ctx)=>{
  const v=VE(ctx),t0=at(ctx,'輪そのもの'),tFix=at(ctx,'この章では');
  // the loop is turned back and forth (motion) until "この章では", then it is held fixed
  const th=t=>t<t0?0:t<tFix?(Math.PI/3)*Math.sin(2*Math.PI*(t-t0)/(v*.28)):kf(t,[[tFix,(Math.PI/3)*Math.sin(2*Math.PI*(tFix-t0)/(v*.28))],[tFix+.4,0]]);
  const flux=t=>2*170*Math.cos(th(t))/40,h=.03,defl=clamp((flux(ctx.t+h)-flux(ctx.t-h))/(2*h)*v/60,-1,1);
  let s='';for(const y of TLINES)s+=line(40,y,850,y,{color:MX.B,w:2.5,opacity:.55})+`<polygon points="850,${y} 836,${y-7} 836,${y+7}" fill="${MX.B}" fill-opacity=".55"/>`;
  const gM=on(ctx,'電線と一緒'),gF=on(ctx,'この章では');
  const over=word('輪を 動かす → 振れる',1010,160,{size:26,anchor:'middle',g:on(ctx,'輪そのもの')*(1-gF)})
   +callout(150,96,620,70,label('動く電線の中の電荷 → 磁場からも力',460,141,{size:26,color:MX.ink,anchor:'middle'}),gM*(1-gF))
   +callout(150,96,620,70,label('この章：輪は 固定、変わるのは 磁場',460,141,{size:28,color:MX.hi,anchor:'middle',weight:700}),gF,{stroke:MX.hi});
  return stage(ctx,p,s+tiltLoop(170,th(ctx.t))+meter(defl)+over+hosoku(),{glow:[450,310,240,MX.B]});
 },
 'mx5-n-speed':(p,ctx)=>{
  const v=VE(ctx),ts=at(ctx,'ゆっくり'),tf=at(ctx,'速く');
  const S0=440,slowEnd=Math.min(tf-.1*v,ts+.4*v);
  const pos=t=>t<tf-.06*v?kf(t,[[ts,S0],[slowEnd,IN]]):kf(t,[[tf,S0],[tf+.08*v,IN]]);
  const reset=ctx.t>slowEnd&&ctx.t<tf;
  const magG=ctx.t<tf-.08*v?1:ctx.t<tf-.03*v?1-clamp((ctx.t-(tf-.08*v))/(.03*v)):clamp((ctx.t-(tf-.03*v))/(.03*v));
  const xN=pos(ctx.t),defl=reset?0:needle(ctx,pos,160);
  const slowPeak=(()=>{let m=0;for(let i=1;i<40;i++){const t=mix(ts,slowEnd,i/40),h=.03;m=Math.max(m,(PHI(pos(t+h))-PHI(pos(t-h)))/(2*h)*v/160);}return m;})();
  const over=word(`磁束：線 ${nThrough(xN)}本分`,650,150,{size:28,color:MX.B,anchor:'middle',g:magG})
   +word('ゆっくり → 小さく',1010,190,{size:28,anchor:'middle',g:on(ctx,'ゆっくり')*(1-on(ctx,'速く',.3))})
   +word('速く → 大きく',1010,190,{size:30,anchor:'middle',color:MX.hi,g:on(ctx,'速く',.3)})
   +word('同じ 10本分 増える',270,150,{size:28,anchor:'middle',g:clamp(ctx.t/.4)});
  return ch5(ctx,p,{xN,lines:1,magG,defl,ghost:ctx.t>tf?slowPeak:null,over});
 },
 'mx5-n-meter':(p,ctx)=>{
  const pos=swing(ctx),xN=pos(ctx.t),defl=needle(ctx,pos);
  const gA=on(ctx,'電流計が'),gC=on(ctx,'同じ回路'),gB=on(ctx,'振れの');
  const over=fade(gA,ring(1010,318,112,{color:MX.hi,w:4}))+word('電流計 → 測るのは 電流',1010,190,{size:26,anchor:'middle',color:MX.I,g:gA})
   +word('回路は そのまま',300,140,{size:26,anchor:'middle',g:gC})
   +fade(on(ctx,'押し回す'),callout(40,420,560,80,causal('押し回す働き 強い','電流 大きい',320,470,{ca:MX.hi,cb:MX.I,size:28}),1))
   +word('振れ で 比べられる',1010,505,{size:24,anchor:'middle',color:MX.hi,g:gB});
  return ch5(ctx,p,{xN,lines:1,defl,over});
 },
 'mx5-n-rate':(p,ctx)=>{
  const g1=on(ctx,'5秒'),g2=on(ctx,'1秒なら'),gT=clamp(ctx.t/.5);
  const row=(y,a,b,c,g,col)=>fade(g,label(a,190,y,{size:34,color:MX.dim})+label(b,420,y,{size:36,color:MX.ink,weight:700})+label(c,690,y,{size:36,color:col,weight:700}));
  const inner=word('変化の速さ ＝ 1秒あたりの 磁束の増え方',600,160,{size:32,anchor:'middle',color:MX.hi,g:on(ctx,'1秒あたり')})
   +row(275,'ゆっくり','10本 ÷ 5秒','＝ 1秒あたり 2本',g1,MX.ink)
   +row(365,'速く','10本 ÷ 1秒','＝ 1秒あたり 10本',g2,MX.hi)
   +fade(g2,line(180,315,1030,315,{color:MX.faint,w:2}))
   +word('短い時間で変わるほど 大きい',600,455,{size:28,anchor:'middle',g:on(ctx,'1秒なら',.45,.8)});
  return ch5(ctx,p,{xN:IN,lines:1,over:dimAll(.92*gT)+inner});
 },
 'mx5-n-check':(p,ctx)=>{
  const gF=clamp(ctx.t/.5),gQ=on(ctx,'3秒'),pulse=.5+.5*Math.sin(ctx.t*5);
  const frac=tex(`\\dfrac{\\Delta ${cB('\\Phi')}}{\\Delta t}`,250,300,{size:84,auto:false,color:MX.ink});
  const inner=fade(gF,frac+label('増えた磁束',340,240,{size:28,color:MX.B})+label('かかった時間',340,345,{size:28,color:MX.ink})
    +label('Δ ＝ 変化した量',130,450,{size:26,color:MX.dim}))
   +callout(640,170,500,240,label('確認',665,215,{size:26,color:MX.hi,weight:700})
    +label('3秒で 6本 増えた',890,285,{size:36,color:MX.ink,anchor:'middle',weight:700})
    +label('1秒あたり',850,365,{size:36,color:MX.ink,anchor:'middle'})+fade(.6+.4*pulse,label('？本',1010,368,{size:44,color:MX.hi,anchor:'middle',weight:700})),gQ,{stroke:MX.hi});
  return ch5(ctx,p,{xN:IN,lines:1,over:dimAll()+inner});
 },
 'mx5-n-average':(p,ctx)=>{
  const gA=clamp(ctx.t/.4),gG=on(ctx,'区間をならした',.6),gL=on(ctx,'平均の');
  // a wavy real history from (0 s, 0) to (3 s, 6) and the straight "levelled" line
  const fw=u=>6*u+.9*Math.sin(2*Math.PI*u);
  const g=axes('')+label('0',GX(0),GY(0)+34,{size:24,color:MX.dim,anchor:'middle'})+label('3秒（時間）',GX(1),GY(0)+34,{size:24,color:MX.dim,anchor:'middle'})
   +label('6本',GX(0)-10,GY(6)+8,{size:24,color:MX.B,anchor:'end'})+line(GX(0),GY(6),GX(1),GY(6),{color:MX.faint,w:2,dash:'4 6'})
   +draw(Array.from({length:61},(_,i)=>[GX(i/60),GY(fw(i/60))]),1,{color:MX.B,w:4})
   +fade(gL,line(GX(0),GY(0),GX(1),GY(6),{color:MX.hi,w:4}))+dot(GX(0),GY(0),7,MX.hi)+dot(GX(1),GY(6),7,MX.hi);
  const over=dimAll(.95)+word('6本 ÷ 3秒 ＝ 1秒あたり 2本',870,150,{size:30,anchor:'middle',color:MX.hi,g:gA})+check(1110,145,gA*clamp((ctx.t-.3)/.4))
   +fade(gG,g)+fade(gG,label('途中の増え方は まちまち',700,280,{size:26,color:MX.B}))
   +fade(gL,label('ならした直線の傾き',700,350,{size:26,color:MX.hi,weight:700})+label('＝ 区間の平均の 変化の速さ',700,392,{size:26,color:MX.hi,weight:700}));
  return ch5(ctx,p,{xN:IN,lines:1,over});
 },
 'mx5-n-graph':(p,ctx)=>{
  const gG=clamp(ctx.t/.5),gT=on(ctx,'時間の差'),gP=on(ctx,'磁束の差');
  const g=axes()+curve()+secant(U0,.45,{gS:0,gT,gP});
  const right=fade(gT,label('横：時間の差 Δt',700,250,{size:28,color:MX.ink,weight:700}))+fade(gP,label('縦：磁束の差 ΔΦ',700,320,{size:28,color:MX.B,weight:700}))
   +fade(gG*(1-gT),label('増え方が 途中で変わる',700,250,{size:28,color:MX.dim}));
  return ch5(ctx,p,{xN:IN,lines:1,over:dimAll(.95)+fade(gG,g)+right});
 },
 'mx5-n-secant':(p,ctx)=>{
  const gS=on(ctx,'割ると'),gL=on(ctx,'直線の傾き'),gA=on(ctx,'平均の');
  const g=axes()+curve()+secant(U0,.45,{gS:gL});
  const right=label('横：時間の差 Δt',700,190,{size:24,color:MX.dim})+label('縦：磁束の差 ΔΦ',700,228,{size:24,color:MX.dim})
   +fade(gS,tex(`\\dfrac{\\Delta ${cB('\\Phi')}}{\\Delta t}`,770,320,{size:60,auto:false,color:MX.ink})+label('（縦 ÷ 横）',850,312,{size:24,color:MX.dim}))
   +fade(gL,label('＝ 2点を結ぶ直線の傾き',850,350,{size:26,color:MX.hi,weight:700}))
   +fade(gA,label('＝ 区間の平均の 変化の速さ',700,440,{size:28,color:MX.hi,weight:700}));
  return ch5(ctx,p,{xN:IN,lines:1,over:dimAll(.95)+g+right});
 },
 'mx5-n-shrink':(p,ctx)=>{
  const tk=at(ctx,'区間を短く'),te=at(ctx,'ある一つ')+.6;
  const d=kf(ctx.t,[[tk+.2,.45],[te+.6,.03]]),gZ=on(ctx,'0で割る'),gN=on(ctx,'近づく先');
  const u1=U0+d,sl=(Gf(u1)-Gf(U0))/d;
  const g=axes()+curve()+secant(U0,d);
  const right=tex(`\\dfrac{\\Delta ${cB('\\Phi')}}{\\Delta t}`,770,210,{size:54,auto:false,color:MX.ink})
   +label('区間の幅',860,195,{size:24,color:MX.ink})+line(970,188,970+d*400,188,{color:MX.ink,w:6})+label(`傾き ＝ ${sl.toFixed(1)}`,860,236,{size:24,color:MX.hi,weight:700})
   +fade(on(ctx,'ある一つ'),label('→ ある一つの値に 近づく',700,300,{size:26,color:MX.hi,weight:700}))
   +fade(gZ,callout(690,340,460,140,label('Δt に 0 を入れる',720,388,{size:26,color:MX.plus})+label('✕',1110,392,{size:34,color:MX.plus,weight:700,anchor:'middle'})
     +label('（0 では 割れない）',720,425,{size:22,color:MX.dim})+fade(gN,label('近づく先の値を 使う',720,462,{size:26,color:MX.good,weight:700})),1,{stroke:'#3a4a6a'}));
  return ch5(ctx,p,{xN:IN,lines:1,over:dimAll(.95)+g+right});
 },
 'mx5-n-instant':(p,ctx)=>{
  const gTan=on(ctx,'接線',.5),gD=on(ctx,'d ファイ'),gI=clamp(ctx.t/.4);
  const f0=Gf(U0),tsl=6*U0*(1-U0)*10;
  let g=axes()+curve()+fade(1-gTan*.7,secant(U0,.03,{lab:0}));
  g+=fade(gTan,line(GX(U0-.2),GY(f0-tsl*.2),GX(U0+.2),GY(f0+tsl*.2),{color:MX.good,w:5})+label('接線',GX(U0+.2)+8,GY(f0+tsl*.2)+6,{size:24,color:MX.good,weight:700}));
  g+=dot(GX(U0),GY(f0),8,MX.hi)+fade(gI,label('この瞬間',GX(U0)+14,GY(f0)+34,{size:24,color:MX.good}));
  const right=fade(.45,tex(`\\dfrac{\\Delta ${cB('\\Phi')}}{\\Delta t}`,760,210,{size:46,auto:false,color:MX.ink})+label('区間の平均',830,205,{size:24,color:MX.dim}))
   +fade(gI,arrow(760,245,760,300,{color:MX.dim,w:3,head:12})+label('区間を短くした先',785,280,{size:22,color:MX.dim}))
   +fade(gD,tex(`\\dfrac{d${cB('\\Phi')}}{dt}`,760,375,{size:60,auto:false,color:MX.good})+label('その瞬間の 変化の速さ',830,368,{size:28,color:MX.good,weight:700}))
   +fade(gTan,label('＝ その点での 接線の傾き',830,410,{size:26,color:MX.good}));
  return ch5(ctx,p,{xN:IN,lines:1,over:dimAll(.95)+g+right});
 },
 'mx5-n-why-e':(p,ctx)=>{
  const pos=swing(ctx),xN=pos(ctx.t),d=needle(ctx,pos),gQ=on(ctx,'止まっていた'),gE=on(ctx,'止まった電荷に');
  const tm=at(ctx,'動かした'),moving=ctx.t>tm;
  // charges drawn as small dots on the front of the middle turn; they drift only after "動かした"
  const ph=moving?PHI(xN)*.35:0;let q='';
  for(let j=0;j<6;j++){const th=-1.2+((.4*j+ph)%2.4),y=CY-CRY*Math.sin(th),x=650+CRX*Math.cos(th);if(Math.cos(th)>0)q+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${MX.I}" stroke="#fff" stroke-width="1.5"/>`;}
  const over=fade(gQ,q)+word(moving?'止まっていた電荷 → 動いた':'止まっていた電荷',300,150,{size:26,anchor:'middle',color:MX.I,g:gQ})
   +word('何が 押した？',650,150,{size:30,anchor:'middle',color:MX.hi,g:gQ*(1-gE)})
   +fade(gE,callout(40,400,640,100,label('止まった電荷に 力 → 電場',360,440,{size:28,color:MX.E,anchor:'middle',weight:700})+label('（第2章：1 C あたりの力）',360,480,{size:22,color:MX.dim,anchor:'middle'}),1));
  return ch5(ctx,p,{xN,lines:1,defl:d,over});
 },
 'mx5-n-loop':(p,ctx)=>{
  const gL=clamp(ctx.t/.5),gE=on(ctx,'ぐるりと',.6),g1=on(ctx,'一巻き'),gW=on(ctx,'仕事');
  const s=faceLoop({g:gL,bs:.5+.5*Math.sin(ctx.t*1.5)**2,eG:gE})+outLegend(120,500,gL)
   +word('電線に沿って 回る電場',790,170,{size:28,color:MX.E,anchor:'middle',g:gE})
   +word('一巻きの輪',790,270,{size:28,color:COPPER,anchor:'middle',g:g1})
   +word('電場が 電荷にする仕事 を数える',790,370,{size:28,anchor:'middle',color:MX.hi,g:gW});
  return stage(ctx,p,s,{glow:[FX,FY,220,MX.E]});
 },
 'mx5-n-work':(p,ctx)=>{
  const gQ=on(ctx,'電荷 q'),gF=on(ctx,'q かける E'),gS=on(ctx,'短い一歩'),gC=on(ctx,'沿う力の成分');
  const a=-Math.PI/4,[x,y]=fpt(a),tx=-Math.sin(a),ty=Math.cos(a);
  const pic=faceLoop({eG:1,bs:.8})+fade(gQ,charge(x,y,1,{r:14})+label('q',x-34,y-4,{size:28,color:MX.ink,weight:700}))
   +fade(gF,arrow(x+tx*16,y+ty*16,x+tx*90,y+ty*90,{color:C.F,w:6,head:16})+label('力 qE',x+tx*90+10,y+ty*90+8,{size:26,color:C.F,weight:700}))
   +fade(gS,ring(x,y,34,{color:MX.hi,w:3}));
  const right=stepInset(gS,{gF:1,gC})
   +fade(gF,tex(`\\vec F=q${cE('\\vec E')}`,890,330,{size:46,auto:false,color:MX.ink}))
   +fade(gC,tex(`W=F_{\\parallel}\\,\\Delta r`,890,420,{size:50,auto:false,color:MX.ink})+label('一歩の仕事',1040,470,{size:24,color:MX.dim,anchor:'middle'}));
  return stage(ctx,p,pic+right,{glow:[FX,FY,220,MX.E]});
 },
 'mx5-n-per1c':(p,ctx)=>{
  const gD=on(ctx,'q で割る'),gR=on(ctx,'電荷の大きさ');
  const pic=fade(.45,faceLoop({eG:1,bs:.8}));
  const right=stepInset(1,{e:gD>.5})
   +fade(.4,tex(`W=F_{\\parallel}\\,\\Delta r`,890,320,{size:40,auto:false,color:MX.ink}))
   +fade(gD,arrow(890,340,890,368,{color:MX.dim,w:3,head:10})+label('÷ q',910,362,{size:24,color:MX.dim})+tex(`\\dfrac{W}{q}=${cE('E_{\\parallel}')}\\,\\Delta r`,890,430,{size:52,auto:false,color:MX.ink}))
   +fade(gD,label('1 C あたりの仕事',620,500,{size:24,color:MX.hi,weight:700}))
   +fade(gR,label('q によらない',1160,500,{size:24,color:MX.E,anchor:'end',weight:700}));
  return stage(ctx,p,pic+right,{glow:[FX,FY,220,MX.E]});
 },
 'mx5-n-emf':(p,ctx)=>{
  const t1=at(ctx,'一周足し'),t2=at(ctx,'つまり'),tr=clamp((ctx.t-t1)/Math.max(.5,t2-t1)),gE=on(ctx,'起電力'),gS=on(ctx,'式では');
  const pic=fade(gS>0?1-.4*gS:1,faceLoop({eG:1,bs:.8,trace:tr}));
  const right=fade(.4,tex(`\\dfrac{W}{q}=${cE('E_{\\parallel}')}\\,\\Delta r`,890,150,{size:38,auto:false,color:MX.ink}))
   +fade(clamp(ctx.t/.4),tex(`V=\\sum ${cE('E_{\\parallel}')}\\,\\Delta r`,890,260,{size:52,auto:false,color:MX.ink})+label('一周分',760,315,{size:22,color:MX.hi}))
   +fade(gE,label('V ＝ 起電力 ＝ 1 C を一周運ぶ仕事',890,350,{size:26,color:MX.hi,anchor:'middle',weight:700}))
   +fade(gS,tex(`V=\\oint ${cE('\\vec E')}\\cdot d\\vec r`,890,445,{size:54,auto:false,color:MX.ink})+label('電場の 一周の足し算',890,500,{size:24,color:MX.E,anchor:'middle'}));
  return stage(ctx,p,pic+right,{glow:[FX,FY,220,MX.E]});
 },
 'mx5-n-unit':(p,ctx)=>{
  const gU=on(ctx,'ジュール'),gV=on(ctx,'ボルト'),gB=on(ctx,'さっき');
  const pic=fade(.45,faceLoop({eG:1,bs:.8,trace:1}));
  const right=fade(.5,tex(`V=\\oint ${cE('\\vec E')}\\cdot d\\vec r`,890,160,{size:44,auto:false,color:MX.ink}))
   +fade(gU,label('仕事 ÷ 電荷',890,245,{size:28,color:MX.dim,anchor:'middle'})+tex(`\\mathrm{J}\\,/\\,\\mathrm{C}`,890,310,{size:54,auto:false,color:MX.ink}))
   +fade(gV,tex(`=\\mathrm{V}`,1010,310,{size:54,auto:false,color:MX.hi})+label('ボルト',1010,355,{size:26,color:MX.hi,weight:700,anchor:'middle'}))
   +fade(gB,callout(640,380,520,100,causal('押し回す働きの強さ','起電力',900,440,{ca:MX.ink,cb:MX.hi,size:28}),1));
  return stage(ctx,p,pic+right,{glow:[FX,FY,220,MX.E]});
 },
 'mx5-n-notpd':(p,ctx)=>{
  const gL=clamp(ctx.t/.5),gZ=on(ctx,'差はゼロ'),gR=on(ctx,'一周しても'),gX=on(ctx,'別の量'),T=sceneT(ctx);
  // left: a hill (potential as height). A marker goes up and back down to the start.
  const hill=u=>[90+440*u,440-200*Math.sin(Math.PI*u)**2];
  const hp=Array.from({length:61},(_,i)=>hill(i/60));
  const m=(Math.sin(T*1.3)*.5+.5),[mx_,my_]=hill(m*.5);
  const left=callout(40,95,540,410,label('電荷が作る電場：電位差',310,140,{size:28,color:MX.ink,anchor:'middle',weight:700})
   +draw(hp,1,{color:MX.plus,w:4,opacity:.8})+line(60,440,560,440,{color:MX.faint,w:2})+dot(mx_,my_,10,MX.hi)
   +label('高さの差のようなもの',310,195,{size:24,color:MX.dim,anchor:'middle'})
   +fade(gZ,label('同じ点に戻る → 差 0',310,485,{size:26,color:MX.plus,anchor:'middle',weight:700})),gL);
  // right: the circulating field, a marker going round and work piling up
  const a=T*1.6,cx=870,cy=300,r=110,pts=[cx+r*Math.cos(a),cy+r*Math.sin(a)];
  let rr=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${COPPER}" stroke-width="6" opacity=".7"/>`;
  for(let k=0;k<8;k++){const b=2*Math.PI*k/8,x=cx+r*Math.cos(b),y=cy+r*Math.sin(b),tx=-Math.sin(b),ty=Math.cos(b);rr+=arrow(x-tx*18,y-ty*18,x+tx*18,y+ty*18,{color:MX.E,w:4,head:12});}
  const right=callout(620,95,540,410,label('回る電場：起電力',890,140,{size:28,color:MX.ink,anchor:'middle',weight:700})+rr+dot(pts[0],pts[1],10,MX.hi)
   +fade(gR,label('一周しても 仕事が残る',890,485,{size:26,color:MX.E,anchor:'middle',weight:700})),gL);
  const neq=fade(gX,label('≠',600,310,{size:60,color:MX.hi,anchor:'middle',weight:700}));
  return stage(ctx,p,left+right+neq);
 },
 'mx5-n-ohm':(p,ctx)=>{
  const gI=on(ctx,'押されて'),gR=on(ctx,'抵抗が主'),gF=on(ctx,'割った'),gB=on(ctx,'大きいほど'),T=sceneT(ctx);
  let s=draw([[110,160],[230,160]],1,{color:COPPER,w:5})+draw([[370,160],[500,160],[500,260]],1,{color:COPPER,w:5})+draw([[500,350],[500,450],[110,450],[110,160]],1,{color:COPPER,w:5});
  const zz=[[230,160]];for(let k=0;k<8;k++)zz.push([247.5+k*17.5,k%2?172:148]);zz.push([370,160]);
  s+=draw(zz,1,{color:MX.ink,w:4})+label('抵抗 R',300,128,{size:24,color:MX.ink,anchor:'middle'});
  s+=ring(500,305,42,{color:'#c9d3e6',w:3,fill:'#1a2540'})+label('A',500,316,{size:30,color:MX.ink,anchor:'middle',weight:700})+label('電流計',560,312,{size:22,color:MX.dim});
  for(const [dx,dy] of [[-60,-50],[40,-50],[-60,50],[40,50]])s+=ring(305+dx,305+dy,10,{color:MX.B,w:2.5})+dot(305+dx,305+dy,3.5,MX.B);
  let cur='';for(let k=0;k<10;k++){const [x,y]=alongRect(k/10+T*.12);cur+=dot(x,y,6,MX.I);}
  const right=fade(gF,tex('I=\\dfrac{V}{R}',870,260,{size:64,auto:false,color:MX.ink}))
   +fade(gF,label('電流',800,360,{size:24,color:MX.I,anchor:'middle'})+label('← 起電力 V',950,228,{size:24,color:MX.hi})+label('← 抵抗',950,300,{size:24,color:MX.ink}))
   +word('起電力 → 押す原因、電流 → 結果',870,125,{size:24,anchor:'middle',g:gI})
   +word('抵抗が主な 簡単な回路',870,420,{size:24,anchor:'middle',color:MX.dim,g:gR})
   +word('起電力 大 → 電流 大',870,490,{size:28,anchor:'middle',color:MX.hi,g:gB});
  return stage(ctx,p,s+fade(gI,cur)+right);
 },
 'mx5-n-law':(p,ctx)=>{
  const gM=on(ctx,'マイナス'),gN=on(ctx,'これが'),gX=on(ctx,'実験で確かめ');
  const row1=fade(.5,tex(`V=\\oint ${cE('\\vec E')}\\cdot d\\vec r`,600,165,{size:40,auto:false,color:MX.ink})+label('起電力の定義',800,160,{size:22,color:MX.dim}));
  const parts=['V','=','-',`\\dfrac{d${cB('\\Phi_B')}}{dt}`],S=74,gap=24,ws=parts.map(q=>texWidth(q,S,false)),tot=ws.reduce((a,b)=>a+b,0)+gap*3;let x=600-tot/2;const cx=[];ws.forEach(w=>{cx.push(x+w/2);x+=w+gap;});
  const op=[1,1,.3+.7*gM,1];
  const eq=parts.map((q,i)=>fade(op[i],tex(q,cx[i],315,{size:S,auto:false,color:i===2&&gM>.5?MX.hi:MX.ink}))).join('');
  const labs=label('起電力',cx[0],395,{size:24,color:MX.hi,anchor:'middle'})+label('（固定した輪）',cx[0],425,{size:22,color:MX.dim,anchor:'middle'})
   +fade(on(ctx,'磁束の変化'),label('磁束の変化の速さ',cx[3]+20,405,{size:24,color:MX.B,anchor:'middle'}));
  const over=word('ファラデーの電磁誘導の法則',600,480,{size:28,anchor:'middle',color:MX.hi,g:gN})
   +word('実験で確かめられた 出発点',1010,250,{size:24,anchor:'middle',g:gX});
  return stage(ctx,p,row1+eq+labs+over,{glow:[600,300,300,MX.hi]});
 },
 'mx5-n-avg':(p,ctx)=>{
  const g1=clamp(ctx.t/.4),g2=on(ctx,'区間を短く'),gO=on(ctx,'一定の速さ');
  const r1=fade(g1,tex(`\\overline{V}=-\\dfrac{\\Delta ${cB('\\Phi_B')}}{\\Delta t}`,360,220,{size:60,auto:false,color:MX.ink})+label('区間の 平均の起電力',640,212,{size:28,color:MX.ink,weight:700}));
  const r2=fade(g2,tex(`V=-\\dfrac{d${cB('\\Phi_B')}}{dt}`,360,370,{size:60,auto:false,color:MX.good})+label('その瞬間の 起電力',640,362,{size:28,color:MX.good,weight:700}))
   +fade(g2,arrow(360,262,360,315,{color:MX.dim,w:3,head:12}));
  const over=word('一定の速さで 変わるときだけ 一致',600,480,{size:28,anchor:'middle',color:MX.hi,g:gO});
  return stage(ctx,p,r1+r2+over,{glow:[600,300,300,MX.hi]});
 },
 'mx5-n-nturn':(p,ctx)=>{
  const t0=at(ctx,'道が輪を'),t1=at(ctx,'どの巻き'),tr=clamp((ctx.t-t0)/Math.max(.5,t1-t0)),gN=on(ctx,'N倍');
  const idx=Math.floor(tr*(CIRCUIT.length-1)),turn=clamp(Math.floor((idx-4)/25)+1,1,7);
  const trace=fade(tr>0?1:0,draw(CIRCUIT,tr,{color:MX.hi,w:5,opacity:.85}))+(tr>0&&tr<1?dot(CIRCUIT[idx][0],CIRCUIT[idx][1],9,MX.hi):'');
  const over=word('N回 巻いたコイル',300,150,{size:28,anchor:'middle',color:COPPER,g:clamp(ctx.t/.4)})
   +word(`${turn}巻き目 ＋`,650,150,{size:28,anchor:'middle',color:MX.hi,g:tr>0&&idx>=4?1:0})
   +callout(40,390,520,110,tex('V_N=N\\,V_1',180,455,{size:52,auto:false,color:MX.ink})+label('同じ磁束なら',320,455,{size:26,color:MX.hi}),gN);
  return ch5(ctx,p,{xN:IN,lines:.5,defl:0,over:trace+over});
 },
 'mx5-n-sign':(p,ctx)=>{
  const gV=clamp(ctx.t/.4),gD=on(ctx,'正の向きを決め'),gR=on(ctx,'右手'),gN=on(ctx,'膜をつき抜ける');
  const eq=callout(40,92,300,120,fit(`V=-\\dfrac{d${cB('\\Phi_B')}}{dt}`,190,160,260,46,{color:MX.ink})+fade(1-gD,ring(128,152,20,{color:MX.hi,w:4})),gV);
  const nrm=fade(gN,arrow(LX,CY,LX+260,CY,{color:MX.hi,w:6,head:18})+label('膜の 正の向き',LX+270,CY+8,{size:26,color:MX.hi,weight:700}));
  const hand=word('右手：4本の指 ＝ 回る向き → 親指 ＝ 膜の正の向き',600,500,{size:24,anchor:'middle',g:gR});
  return stage(ctx,p,bench()+loopBack()+membrane(gN)+loopFront()+posDir(gD)+nrm+eq+hand,{glow:[650,330,260,MX.hi]});
 },
 'mx5-n-sign-up':(p,ctx)=>{
  const v=VE(ctx),pos=t=>mix(400,560,clamp((t-.04*v)/(.9*v))),xN=pos(ctx.t),T=sceneT(ctx);
  const gU=clamp(ctx.t/.4),gC=on(ctx,'正の向きと逆'),gB=on(ctx,'その電流');
  const small=arrow(LX-40,CY-LRY-40,LX+60,CY-LRY-40,{color:MX.hi,w:4,head:12})+label('正の向き',LX+70,CY-LRY-32,{size:22,color:MX.hi});
  const cur=chevrons(LX,CY,LRX+4,LRY+4,T*1.4,{n:12,size:15,g:gC,back:false,dir:1});
  const ind=fade(gB,arrow(LX+90,CY,LX-80,CY,{color:MX.B,w:7,head:20})+label('電流が作る磁場',880,230,{size:24,color:MX.B})+label('増加を 打ち消す向き',880,265,{size:26,color:MX.B,weight:700}));
  const over=word('磁束が 正の向きに 増える',300,140,{size:26,anchor:'middle',color:MX.B,g:gU})
   +word('V < 0 → 正の向きと 逆に回す',950,140,{size:26,anchor:'middle',color:MX.I,g:on(ctx,'起電力はマイナス')});
  return one(ctx,p,{xN,extra:small+cur+ind,over});
 },
 'mx5-n-lenz':(p,ctx)=>{
  const v=VE(ctx),pos=t=>mix(560,400,clamp((t-.04*v)/(.7*v))),xN=pos(ctx.t),T=sceneT(ctx);
  const gC=clamp(ctx.t/.5),gB=on(ctx,'補う'),gS=on(ctx,'いつも'),gL=on(ctx,'レンツ');
  const small=arrow(LX-40,CY-LRY-40,LX+60,CY-LRY-40,{color:MX.hi,w:4,head:12})+label('正の向き',LX+70,CY-LRY-32,{size:22,color:MX.hi});
  const cur=chevrons(LX,CY,LRX+4,LRY+4,-T*1.4,{n:12,size:15,g:gC,back:false,dir:-1});
  const ind=fade(gB,arrow(LX-80,CY,LX+90,CY,{color:MX.B,w:7,head:20})+label('電流が作る磁場',880,230,{size:24,color:MX.B})+label('減った分を 補う向き',880,265,{size:26,color:MX.B,weight:700}));
  const over=word('磁束が 減る',300,140,{size:26,anchor:'middle',color:MX.B,g:gC*(1-gS)})
   +fade(gS,callout(40,95,470,120,label('増える → 打ち消す向き',60,145,{size:26,color:MX.ink})+label('減る → 補う向き',60,195,{size:26,color:MX.ink})))
   +word('変化を 妨げる ＝ レンツの法則',900,140,{size:28,anchor:'middle',color:MX.hi,g:gL});
  return one(ctx,p,{xN,extra:small+cur+ind,over});
 },
 'mx5-n-lenz-in':(p,ctx)=>{
  const v=VE(ctx),pos=t=>mix(420,600,clamp((t-.04*v)/(.9*v)));
  const xN=pos(ctx.t),defl=needle(ctx,pos),rate=Math.max(0,defl);
  const gC=on(ctx,'流れた電流'),gP=on(ctx,'端がN極'),gF=on(ctx,'押し返'),ph=PHI(xN)*.8;
  const extra=chevrons(650,CY,CRX+4,CRY+4,ph,{n:12,size:15,g:gC*clamp(rate*6+.3),back:false})
   +fade(gP,word('N',548,CY-100,{size:34,color:MX.plus,anchor:'middle'})+arrow(740,CY,575,CY,{color:MX.B,w:6,head:20}))
   +fade(gF,arrow(xN-150,CY-62,xN-260,CY-62,{color:C.F,w:7,head:20})+label('押し返す',xN-205,CY-80,{size:26,color:C.F,anchor:'middle',weight:700}));
  const chain=word('① 電流',140,140,{size:26,color:MX.I,g:gC})+word('② 左端が N極',330,140,{size:26,color:MX.plus,g:gP})+word('③ N と N で 押し返す',600,140,{size:26,color:C.F,g:gF});
  return ch5(ctx,p,{xN,lines:1,defl,extra,over:chain});
 },
 'mx5-n-lenz-out':(p,ctx)=>{
  const v=VE(ctx),pos=t=>mix(600,420,clamp((t-.02*v)/(.75*v)));
  const xN=pos(ctx.t),defl=needle(ctx,pos),rate=Math.max(0,-defl),ph=PHI(xN)*.8;
  const gCur=clamp(rate*6+.3)*clamp(ctx.t/.4),gP=on(ctx,'S極'),gF=on(ctx,'引き戻');
  const extra=chevrons(650,CY,CRX+4,CRY+4,ph,{n:12,size:15,g:gCur,back:false,dir:-1})
   +fade(gP,word('S',548,CY-100,{size:34,color:MX.minus,anchor:'middle'})+arrow(560,CY,725,CY,{color:MX.B,w:6,head:20}))
   +fade(gF,arrow(xN-40,CY+62,xN+70,CY+62,{color:C.F,w:7,head:20})+label('引き戻す',xN+15,CY+100,{size:26,color:C.F,anchor:'middle',weight:700}));
  const chain=word('① 電流は 逆向き',140,140,{size:26,color:MX.I,g:clamp(ctx.t/.4)})+word('② 左端が S極',400,140,{size:26,color:MX.minus,g:gP})+word('③ N と S で 引き戻す',660,140,{size:26,color:C.F,g:gF});
  return ch5(ctx,p,{xN,lines:1,defl,extra,over:chain});
 },
 'mx5-n-pipe':(p,ctx)=>{
  const t0=at(ctx,'落として'),tt=Math.max(0,ctx.t-t0),T=Math.max(1,VE(ctx)-t0+.5);
  const fall=tt%1.2,yo=ctx.t<t0?140:140+Math.min(310,.5*1500*fall*fall),yi=ctx.t<t0?140:140+300*clamp(tt/T);
  const L=330,Rx=780;let s=bench();
  s+=vMagnet(L,yo,clamp(ctx.t/.4));
  for(let k=1;k<=3;k++){const tp=tt-k*.5;if(tp>0)s+=fade(.14,vMagnet(Rx,140+300*clamp(tp/T)));}
  s+=vMagnet(Rx,yi)+pipe(Rx);
  s+=word('パイプなし：すとん',L,140,{size:26,anchor:'middle',g:on(ctx,'落として',.45,.6)})
   +word('銅のパイプ',Rx+80,140,{size:28,color:COPPER,g:clamp(ctx.t/.5)})
   +word('銅は 磁石に つかない',Rx+80,250,{size:26,g:on(ctx,'くっつかない')})
   +word('ふわり… ゆっくり',Rx+80,360,{size:30,color:MX.hi,g:on(ctx,'ふわりと')});
  return stage(ctx,p,s,{glow:[Rx,300,220,COPPER]});
 },
 'mx5-n-pipe-cond':(p,ctx)=>{
  const px=600,gC=on(ctx,'導体'),gR=on(ctx,'ぐるりと',.8),T=sceneT(ctx);
  let s=bench()+pipe(px,{g:1,stripes:false});
  for(let y=130;y<470;y+=34){s+=fade(gR*.8,`<ellipse cx="${px}" cy="${y}" rx="43" ry="9" fill="none" stroke="${MX.I}" stroke-width="2" stroke-opacity=".7"/>`);}
  for(const y of [198,300,402])s+=fade(gR,arrow(px-18,y+10,px+18,y+10,{color:MX.I,w:3,head:10}));
  s+=word('銅 ＝ 磁石ではない',px+90,170,{size:26,color:COPPER,g:clamp(ctx.t/.4)})
   +word('電気をよく通す 導体',px+90,260,{size:28,color:MX.I,g:gC})
   +word('壁をぐるりと回る 電流の道',px+90,350,{size:26,color:MX.I,g:gR})
   +word('上から下まで つながっている',px+90,440,{size:24,color:MX.dim,g:on(ctx,'上から下')});
  return stage(ctx,p,s,{glow:[px,300,220,COPPER]});
 },
 'mx5-n-pipe-why':(p,ctx)=>{
  const v=VE(ctx),px=600,yi=mix(230,290,clamp(ctx.t/v)),yLo=410,yHi=150;
  const gLc=on(ctx,'下の輪'),gLb=on(ctx,'近づく'),gLf=on(ctx,'押し返'),gUc=on(ctx,'上の輪'),gUb=on(ctx,'遠ざかる'),gUf=on(ctx,'引き戻'),gAll=on(ctx,'どちらも');
  let s=bench()+pipe(px,{g:.8})+vMagnet(px,yi);
  s+=pipeRing(px,yLo,1,gLc)+fade(gLb,arrow(px,yLo+30,px,yLo-40,{color:MX.B,w:5,head:14})+word('N',px+95,yLo-20,{size:26,color:MX.plus,anchor:'middle'}));
  s+=pipeRing(px,yHi,-1,gUc)+fade(gUb,arrow(px,yHi-30,px,yHi+40,{color:MX.B,w:5,head:14})+word('N',px+95,yHi+22,{size:26,color:MX.plus,anchor:'middle'}));
  s+=fade(gLf,arrow(px-75,yi+40,px-75,yi-30,{color:C.F,w:6,head:16}))+word('下の輪：押し返す',px-120,yLo+8,{size:26,anchor:'end',color:MX.I,g:gLc})
   +fade(gUf,arrow(px+75,yi+40,px+75,yi-30,{color:C.F,w:6,head:16}))+word('上の輪：引き戻す',px-120,yHi+8,{size:26,anchor:'end',color:MX.I,g:gUc})
   +word('どちらも 上向きの力',px+130,yi+10,{size:30,color:C.F,g:gAll})
   +word('模式図',1160,122,{size:24,anchor:'end',color:MX.dim,g:clamp(ctx.t/.4)});
  return stage(ctx,p,s,{glow:[px,300,220,COPPER]});
 },
 'mx5-n-pipe-energy':(p,ctx)=>{
  const px=420,v=VE(ctx),yi=mix(150,430,clamp(ctx.t/(v+.5))),gP=clamp(ctx.t/.4),gH=on(ctx,'減った分'),gHeat=on(ctx,'熱');
  const heat=clamp((ctx.t-at(ctx,'減った分'))/(v-at(ctx,'減った分')+.5));
  let s=bench()+fade(heat*.9,`<rect x="${px-45}" y="${Math.max(100,yi-120)}" width="90" height="${Math.min(240,478-Math.max(100,yi-120))}" rx="8" fill="#ff7a3c" fill-opacity=".28"/>`)+pipe(px)+vMagnet(px,yi);
  // three bars: potential energy (falls), kinetic energy (stays small), heat (grows)
  const bx=[700,850,1000],H=250,base=460,pe=1-clamp(ctx.t/(v+.5))*.8,ke=.08,he=.8*clamp(ctx.t/(v+.5));
  const bar=(x,f,col,name,g)=>fade(g,`<rect x="${x-40}" y="${base-H*f}" width="80" height="${H*f}" rx="6" fill="${col}" fill-opacity=".8"/>`+label(name,x,base+34,{size:24,color:col,anchor:'middle'}));
  s+=line(640,base,1080,base,{color:MX.faint,w:2})
   +bar(bx[0],pe,MX.E,'位置',gP)+bar(bx[1],ke,MX.ink,'速さ',gH)+bar(bx[2],he,'#ff9a5c','熱',gHeat)
   +word('一定のゆっくりした速さ',px,122,{size:24,anchor:'middle',g:gP})
   +word('エネルギーの行き先',850,150,{size:26,anchor:'middle',color:MX.hi,g:gH});
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
  const pos=swing(ctx),xN=pos(ctx.t),gE=on(ctx,'ぐるりと',.6),gO=on(ctx,'外側',.6),gq=on(ctx,'小さな'),gF=on(ctx,'力を受け');
  const {under,top,sd,eg}=eRing(ctx,pos,650,{g:gE});
  const ph=PHI(xN)*.5;
  const outer=fade(gO*.8,`<path d="${arc(650,CY,30,170,false)}" fill="none" stroke="${MX.E}" stroke-width="2" stroke-dasharray="6 6"/>`)
   +fade(gO,`<path d="${arc(650,CY,30,170,true)}" fill="none" stroke="${MX.E}" stroke-width="3" stroke-dasharray="10 6"/>`)+chevrons(650,CY,30,170,ph,{n:14,color:MX.E,size:11,dir:sd,g:gO*eg,back:false});
  const qx=650+18*Math.cos(-Math.PI/6),qy=CY+108*Math.sin(Math.PI/6),fl=30+45*eg;
  const extra=top+outer+fade(gq,charge(qx,qy,1,{r:15}))+fade(gF,arrow(qx+26,qy,qx+26,qy-sd*fl,{color:C.F,w:6,head:16}));
  const over=word('回る電場',860,200,{size:32,color:MX.E,g:gE})+word('電線なし',650,125,{size:28,anchor:'middle'})
   +word('外側を回る道にも',870,480,{size:26,color:MX.E,g:gO})
   +word('小さなプラスの電荷 → 力',300,480,{size:26,color:C.F,g:gq});
  return ch5(ctx,p,{xN,lines:1,coil:0,meterG:0,under,extra,over});
 },
 'mx5-n-aha':(p,ctx)=>{
  const pos=swing(ctx),xN=pos(ctx.t),g2=on(ctx,'電線にたまる'),gZ=on(ctx,'一周の足し算'),gK=on(ctx,'起電力は'),gW=clamp(ctx.t/.6);
  const {under,top}=eRing(ctx,pos,650);
  const wire=fade(gW*.55,`<ellipse cx="650" cy="${CY}" rx="18" ry="108" fill="none" stroke="${COPPER}" stroke-width="9"/>`);
  let qs='';for(const [th,sg] of [[.9,1],[1.25,1],[-.9,-1],[-1.25,-1]]){const x=650+18*Math.cos(th),y=CY-108*Math.sin(th);qs+=charge(x+14,y,sg,{r:12});}
  const over=word('電線 ＝ 電場を 電流で知らせる役',600,140,{size:28,anchor:'middle',color:MX.hi,g:clamp(ctx.t/.4)})
   +word('電線にたまる電荷 も 電場を作る',300,480,{size:24,anchor:'middle',g:g2})
   +word('その電場の 一周の足し算 ＝ 0',900,420,{size:24,anchor:'middle',color:MX.plus,g:gZ})
   +word('起電力は そのまま',900,490,{size:26,anchor:'middle',color:MX.hi,g:gK})
   +word('電場',860,230,{size:30,color:MX.E});
  return ch5(ctx,p,{xN,lines:1,coil:0,meterG:0,under:wire+under,extra:top+fade(g2,qs),over});
 },
 'mx5-n-general':(p,ctx)=>{
  const pos=swing(ctx),xN=pos(ctx.t),gP=on(ctx,'空間に'),gS=on(ctx,'同じ関係'),gX=on(ctx,'のちに');
  const {under,top}=eRing(ctx,pos,650,{g:gP});
  const path=fade(gP,`<ellipse cx="650" cy="${CY}" rx="18" ry="108" fill="none" stroke="#dfe6f2" stroke-width="3" stroke-dasharray="4 8"/>`);
  const over=word('空間に固定した道（電線なし）',650,125,{size:26,anchor:'middle',g:gP})
   +callout(640,400,520,100,label('同じ関係が 成り立つと考える',900,440,{size:26,color:MX.hi,anchor:'middle',weight:700})
    +fade(gX,label('→ のちに 電磁波の実験で確認',900,480,{size:24,color:MX.dim,anchor:'middle'})),gS);
  return ch5(ctx,p,{xN,lines:1,coil:0,meterG:0,under:under+path,extra:top,over});
 },
 'mx5-n-faraday':(p,ctx)=>{
  const tR=on(ctx,'磁束の'),tM=on(ctx,'マイナス'),gAll=on(ctx,'これが'),tw=at(ctx,'一周'),tw2=at(ctx,'その道に');
  const w=clamp((ctx.t-tw)/Math.max(.3,tw2-tw)),gMb=on(ctx,'膜を');
  const S=62,parts=[`\\oint ${cE('\\vec E')}\\cdot d\\vec r`,'=','-',`\\dfrac{d${cB('\\Phi_B')}}{dt}`],gap=22;
  const ws=parts.map(q=>texWidth(q,S,false)),tot=ws.reduce((a,b)=>a+b,0)+gap*3;let x=720-tot/2;const cx=[];
  ws.forEach(wd=>{cx.push(x+wd/2);x+=wd+gap;});
  const op=[1-.7*tR*(1-gAll),.3+.7*Math.max(tR,gAll),.3+.7*Math.max(tM,gAll),.3+.7*Math.max(tR,gAll)];
  const eq=parts.map((q,i)=>fade(op[i],tex(q,cx[i],285,{size:S,auto:false,color:MX.ink}))).join('');
  const labs=fade(clamp(ctx.t/.4),label('一周の足し算 ＝ 起電力',cx[0],385,{size:26,color:MX.E,anchor:'middle',weight:700})+label('固定した道に沿って',cx[0],420,{size:22,color:MX.dim,anchor:'middle'}))
   +fade(tR,label('膜をつき抜ける 磁束の',cx[3]+20,385,{size:24,color:MX.B,anchor:'middle',weight:700})+label('変化の速さ',cx[3]+20,418,{size:24,color:MX.B,anchor:'middle',weight:700}))
   +fade(tM,label('変化を妨げる向き',cx[2]+14,198,{size:24,color:MX.hi,anchor:'end'})+arrow(cx[2],206,cx[2],248,{color:MX.hi,w:3,head:10}));
  const ring_=Array.from({length:81},(_,i)=>{const th=-Math.PI/2+2*Math.PI*i/80;return [150+16*Math.cos(th),300-100*Math.sin(th)];});
  const walk=ring_[Math.min(80,Math.round(w*80))],ph=sceneT(ctx)*.8;
  let pic=fade(gMb,`<ellipse cx="150" cy="300" rx="16" ry="100" fill="${MX.hi}" fill-opacity=".18"/>`);for(const dy of [-50,-15,15,50])pic+=arrow(60,300+dy,250,300+dy,{color:MX.B,w:3,head:12,opacity:.8});
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
