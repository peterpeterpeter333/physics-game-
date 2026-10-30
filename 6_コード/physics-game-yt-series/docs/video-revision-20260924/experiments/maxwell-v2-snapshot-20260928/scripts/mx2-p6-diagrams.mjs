// Diagrams for the v2 Maxwell film, part p6 (chapter 6). Keys: 'mx6-n-<name>'.
// Base picture: the charging parallel-plate capacitor circuit of the original chapter 6
// (mxC-diagrams.mjs), with an Ampère loop on the top-left wire. Current dots never cross
// the gap; the number of E arrows in the gap always equals the number of charges on a plate
// (Q = ε0 Φ_E). The left plate is joined to the battery's + terminal, so it charges +, the
// current in the top-left wire flows to the right, and B around it points down on the
// front half of the loop. Cues 12–17 zoom onto the plates (view u=1) with an equation panel.
import {MX,clamp,mix,smooth,fade,label,line,dot,ring,draw,arrow,tex,texWidth,word,callout,causal,fit,stage} from './mx-common.mjs';

// ---- timing: narration-locked -------------------------------------------------------------
const VE=ctx=>Math.max(.5,ctx.dur-(ctx.cue.pause??0)-.12);
function at(ctx,s){const sub=ctx.cue.subtitle,i=sub.indexOf(s);if(i<0)throw Error(`mx6n: "${s}" not in "${sub}"`);return VE(ctx)*i/sub.length;}
const on=(ctx,s,d=.45,dt=0)=>clamp((ctx.t-at(ctx,s)-dt)/d);
const t0=(ctx,d=.5)=>clamp(ctx.t/d);
const sceneT=ctx=>(ctx.scene?.captions?.[ctx.k]?.start??0)+ctx.t;
const Qr=(ctx,a,b)=>mix(a,b,smooth(ctx.t/VE(ctx)));
function kf(t,keys){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){const [a,va]=keys[i-1],[b,vb]=keys[i];if(t<=b)return mix(va,vb,smooth((t-a)/Math.max(1e-6,b-a)));}return keys.at(-1)[1];}
const cE=v=>`{\\color{${MX.E}}${v}}`,cB=v=>`{\\color{${MX.B}}${v}}`,cI=v=>`{\\color{${MX.I}}${v}}`,cH=v=>`{\\color{${MX.hi}}${v}}`;
const T=(src,x,y,size,o={})=>tex(src,x,y,{size,auto:false,color:MX.ink,...o});
const Tw=(src,size)=>texWidth(src,size,false);
const box=(x,y,w,h,g=1,col=MX.hi)=>fade(g,`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${col}" fill-opacity=".10" stroke="${col}" stroke-width="2.5"/>`);
const tick=(x,y,g,r=17)=>fade(g,ring(x,y,r,{color:MX.good,w:3,fill:MX.bg})+draw([[x-8,y],[x-2,y+7],[x+9,y-7]],clamp(g*1.4),{color:MX.good,w:4}));

// ---- circuit ------------------------------------------------------------------------------
const WY=300,PL=560,PR=640,PT=205,PB=395;
const SLOTS=[5,6,4,7,3,8,2,9,1,10,0,11].map(j=>211+j*16.4);
const PATH=[[PR+6,WY],[1110,WY],[1110,470],[622,470],[578,470],[90,470],[90,WY],[PL-6,WY]];
function pathPt(d){let acc=0;for(let i=1;i<PATH.length;i++){const [a,b]=[PATH[i-1],PATH[i]],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(d<=acc+L){const u=(d-acc)/L;return [mix(a[0],b[0],u),mix(a[1],b[1],u)];}acc+=L;}return PATH.at(-1);}
const PLEN=PATH.slice(1).reduce((a,b,i)=>a+Math.hypot(b[0]-PATH[i][0],b[1]-PATH[i][1]),0);
// Moving dots along the wires: yellow = current (along PATH), blue = electrons (opposite).
function flowDots(ctx,g=1,elec=0){if(g<=0)return '';const T0=sceneT(ctx)*70,m=a=>((a%48)+48)%48;
 const one=(off,col,a)=>{if(a<=0)return '';let s='';for(let d=off;d<PLEN;d+=48){const [x,y]=pathPt(d);if(y>460&&x>574&&x<626)continue;const e=Math.min(d,PLEN-d);s+=dot(x,y,6,col,clamp(e/40));}return fade(a,s);};
 return fade(g,one(m(T0),MX.I,1-elec)+one(m(-T0),MX.minus,elec));}
function battery(g=1){return fade(g,line(578,470,586,470,{color:'#c9d3e6',w:4})+line(586,440,586,500,{color:'#eef3fb',w:4})+line(614,456,614,484,{color:'#eef3fb',w:9})+line(614,470,622,470,{color:'#c9d3e6',w:4})
 +label('+',570,448,{size:24,color:MX.plus,anchor:'middle',weight:700})+label('−',632,448,{size:24,color:MX.minus,anchor:'middle',weight:700}));}
function plates(Q,{E=0,g=1}={}){let s='';const n=Math.floor(Q+1e-6),fr=Q-n;
 if(E>0)SLOTS.forEach((y,j)=>{const a=j<n?1:j===n?fr:0;if(a>0)s+=fade(a*E,arrow(PL+18,y,PR-17,y,{color:MX.E,w:3,head:9}));});
 s+=`<polygon points="${PL-9},${PT+10} ${PL+1},${PT-4} ${PL+1},${PB-10} ${PL-9},${PB+4}" fill="#9aa9c4" stroke="#dfe6f2" stroke-width="1.5"/>`;
 s+=`<polygon points="${PR-1},${PT+10} ${PR+9},${PT-4} ${PR+9},${PB-10} ${PR-1},${PB+4}" fill="#9aa9c4" stroke="#dfe6f2" stroke-width="1.5"/>`;
 SLOTS.forEach((y,j)=>{const a=j<n?1:j===n?fr:0;if(a<=0)return;
  const xp=PL+9,xm=PR-9;
  s+=fade(a,`<circle cx="${xp}" cy="${y}" r="7" fill="${MX.plus}"/>`+line(xp-4,y,xp+4,y,{color:'#fff',w:2})+line(xp,y-4,xp,y+4,{color:'#fff',w:2})
   +`<circle cx="${xm}" cy="${y}" r="7" fill="${MX.minus}"/>`+line(xm-4,y,xm+4,y,{color:'#fff',w:2}));});
 return fade(g,s);}
const WL=[[PL-9,WY],[90,WY],[90,470],[578,470]],WR=[[PR+9,WY],[1110,WY],[1110,470],[622,470]];
function circuit(ctx,{Q=0,E=0,flow=1,elec=0,wires=1,bat=1}={}){const w={color:'#c9d3e6',w:4};
 return draw(WL,wires,w)+draw(WR,wires,w)+battery(clamp(wires*1.5-.5)*bat)+plates(Q,{E})+flowDots(ctx,flow*clamp(wires*2-1),elec);}

// ---- Ampère loop and membranes ------------------------------------------------------------
const LX=300,LRX=24,LRY=75;
const arc=(cx,cy,rx,ry,front)=>`M${cx} ${cy-ry} A${rx} ${ry} 0 0 ${front?1:0} ${cx} ${cy+ry}`;
function chevrons(cx,cy,rx,ry,phase,{n=10,color=MX.B,size=11,g=1,front=true,back=true,dir=1}={}){let s='';
 for(let j=0;j<n;j++){const th=2*Math.PI*j/n+phase,cs=Math.cos(th);if(cs>0&&!front||cs<=0&&!back)continue;
  const x=cx+rx*cs,y=cy-ry*Math.sin(th),tx=-rx*Math.sin(th)*dir,ty=-ry*cs*dir,L=Math.hypot(tx,ty)||1,ux=tx/L,uy=ty/L,op=cs>0?1:.35;
  s+=`<polygon points="${(x+ux*size).toFixed(1)},${(y+uy*size).toFixed(1)} ${(x-ux*size*.6+uy*size*.7).toFixed(1)},${(y-uy*size*.6-ux*size*.7).toFixed(1)} ${(x-ux*size*.6-uy*size*.7).toFixed(1)},${(y-uy*size*.6+ux*size*.7).toFixed(1)}" fill="${color}" fill-opacity="${op}"/>`;}
 return fade(g,s);}
function loopBack(g=1){return fade(g,`<path d="${arc(LX,WY,LRX,LRY,false)}" fill="none" stroke="${MX.ink}" stroke-width="3" stroke-dasharray="7 6" stroke-opacity=".7"/>`);}
function loopFront(g=1,{col=MX.ink,w=4}={}){if(g<=0)return '';return g>=1?`<path d="${arc(LX,WY,LRX,LRY,true)}" fill="none" stroke="${col}" stroke-width="${w}"/>`:draw(Array.from({length:41},(_,i)=>{const th=-Math.PI/2+Math.PI*i/40;return [LX+LRX*Math.cos(th),WY+LRY*Math.sin(th)];}),g,{color:col,w});}
// B around the current (to the right): front half points down.
const bAround=(ctx,g)=>chevrons(LX,WY,LRX,LRY+18,-sceneT(ctx)*.9,{n:8,color:MX.B,size:12,g,dir:-1});
// A membrane whose edge is the loop. b=0 flat; b>0 bulges right (b=1: its far end is in the
// gap); b<0 bulges left. The wire pierces it at its far end x=apex(b) unless that is in the gap.
const apex=b=>b>=0?LX+300*b:LX+190*b;
function membrane(b,g=1,{col=MX.hi,fo=.14}={}){if(g<=0)return '';
 if(Math.abs(b)<.02)return fade(g,`<ellipse cx="${LX}" cy="${WY}" rx="${LRX}" ry="${LRY}" fill="${col}" fill-opacity="${fo+.08}"/>`);
 const xc=apex(b),R=LRY+65*Math.abs(b),m=(LX+xc)/2,sw=b>0?1:0;
 const d=`M${LX} ${WY-LRY} C${m} ${WY-LRY} ${m} ${WY-R} ${xc} ${WY-R} A24 ${R} 0 0 ${sw} ${xc} ${WY+R} C${m} ${WY+R} ${m} ${WY+LRY} ${LX} ${WY+LRY} A${LRX} ${LRY} 0 0 ${1-sw} ${LX} ${WY-LRY} Z`;
 return fade(g,`<path d="${d}" fill="${col}" fill-opacity="${fo}" stroke="${col}" stroke-opacity=".75" stroke-width="2.5" stroke-dasharray="10 6"/>`
  +`<ellipse cx="${xc}" cy="${WY}" rx="24" ry="${R}" fill="${col}" fill-opacity="${fo*.8}" stroke="${col}" stroke-opacity=".8" stroke-width="2.5"/>`);}
const pierce=(b,g=1)=>apex(b)<PL-14?fade(g,ring(apex(b),WY,15,{color:MX.I,w:4})):'';
function capPierce(Q,g){let s='';const n=Math.floor(Q+1e-6);SLOTS.forEach((y,j)=>{if(j<n)s+=dot(600,y,5,MX.E);});return fade(g,s);}
// The loop scene: membranes behind the wire, loop front and B chevrons in front.
function loopScene(ctx,{Q,E=0,flow=1,loop=1,bAg=0,mem=[]}){
 return loopBack(loop>=1?1:0)+mem.map(([b,g,o])=>membrane(b,g,o)).join('')+circuit(ctx,{Q,E,flow})+loopFront(loop)+bAround(ctx,bAg);}

// ---- Ampère equation (left side / right side can be dimmed or boxed) ----------------------
// Rendered as ONE TeX string (so all parts share a baseline); dimming = colour mixed toward the bg.
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),mixC=(a,b,u)=>'#'+hx(a).map((v,i)=>Math.round(mix(v,hx(b)[i],u)).toString(16).padStart(2,'0')).join('');
const dimC=(c,o)=>mixC(MX.bg2,c,clamp(o));
const LHS=`\\oint ${cB('\\vec B')}\\cdot d\\vec r`;
const lhsO=o=>`{\\color{${dimC(MX.ink,o)}}\\oint {\\color{${dimC(MX.B,o)}}\\vec B}\\cdot d\\vec r}`;
function ampere(x,y,{size=40,L=1,R=1,rhs=`\\mu_0 ${cI('I')}`,rhs2=null,mix2=0,hiL=0,hiR=0,rcol=MX.ink}={}){
 const rr=(r)=>`{\\color{${dimC(rcol,R)}}${r.replace(/\\color\{[^}]*\}/g,m=>R<.99?`\\color{${dimC(MX.I,R)}}`:m)}}`;
 const src=r=>`${lhsO(L)}\\mathrel{\\color{${dimC(MX.ink,Math.max(L,R))}}{=}}${rr(r)}`;
 const wl=Tw(LHS,size),we=Tw('=',size),xr=x+wl+we+size*.55,wr=Math.max(Tw(rhs,size),rhs2?Tw(rhs2,size):0);
 return box(x-10,y-size*1.0,wl+20,size*1.45,hiL)+box(xr-10,y-size*1.0,wr+20,size*1.45,hiR)
  +fade(1-mix2,T(src(rhs),x,y,size,{anchor:'start'}))+(rhs2?fade(mix2,T(src(rhs2),x,y,size,{anchor:'start'})):'');}
const ampBox=(inner,g=1)=>callout(40,84,520,110,inner,g);

// ---- zoom onto the plates (cues 12–17) ----------------------------------------------------
const view=(u,svg)=>{if(u<=.001)return svg;const s=mix(1,1.45,u),X=mix(600,330,u);return `<g transform="translate(${X.toFixed(1)} 300) scale(${s.toFixed(4)}) translate(-600 -300)">${svg}</g>`;};
const Pv=(u,x,y)=>{const s=mix(1,1.45,u),X=mix(600,330,u);return [X+(x-600)*s,300+(y-300)*s];};
// Closed box around the left plate (Gauss surface): front face + back face (perspective).
const GB={x0:522,x1:582,y0:177,y1:423,dx:16,dy:-22};
function gaussBox(g=1,{faces=0,gap=0}={}){if(g<=0)return '';const {x0,x1,y0,y1,dx,dy}=GB;
 const P=[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]],dim=mix(MX.hi,MX.dim,0);
 const back=`<path d="M${x0+dx} ${y0+dy} L${x1+dx} ${y0+dy} L${x1+dx} ${y1+dy} M${x0+dx} ${y0+dy} L${x0+dx} ${y1+dy} L${x1+dx} ${y1+dy} M${x0} ${y0} L${x0+dx} ${y0+dy} M${x1} ${y0} L${x1+dx} ${y0+dy} M${x1} ${y1} L${x1+dx} ${y1+dy} M${x0} ${y1} L${x0+dx} ${y1+dy}" fill="none" stroke="${MX.hi}" stroke-opacity="${.55*(1-.5*faces)}" stroke-width="2" stroke-dasharray="6 5"/>`;
 const front=draw(P,g,{color:faces>0?MX.dim:MX.hi,w:3,dash:'10 6'});
 const gf=fade(gap,`<polygon points="${x1},${y0} ${x1+dx},${y0+dy} ${x1+dx},${y1+dy} ${x1},${y1}" fill="${MX.E}" fill-opacity=".16" stroke="${MX.E}" stroke-width="4"/>`);
 return fade(clamp(g*2),`<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" fill="${MX.hi}" fill-opacity="${.06*(1-faces)}"/>`)+(g>=1?back:'')+front+gf;}
const GSRC=`\\oint ${cE('\\vec E')}\\cdot d\\vec A=\\dfrac{Q}{\\varepsilon_0}`,GL=`\\oint ${cE('\\vec E')}\\cdot d\\vec A`;
const gaussEq=(x,y,size,hi=0)=>{const W=Tw(GSRC,size),wl=Tw(GL,size),l=x-W/2;return box(l-18,y-size*1.05,wl+30,size*1.5,hi)+T(GSRC,x,y,size);};
const panel=(inner,g=1)=>callout(610,88,570,420,inner,g);

const ch6=(ctx,p,inner)=>stage(ctx,p,inner,{glow:[600,300,260,MX.E]});
const overlay=(g,inner='')=>fade(g,`<rect x="140" y="92" width="920" height="415" rx="18" fill="${MX.bg}" fill-opacity=".88" stroke="${MX.faint}" stroke-width="2"/>`)+fade(g,inner);

export const mx2p6Diagrams={
 // 0 two plates, then the wires and the battery
 'mx6-n-plates':(p,ctx)=>{
  const gP=t0(ctx,.6),gW=on(ctx,'電源に',1.4),gM=on(ctx,'金属の板'),gG=on(ctx,'すき間を');
  const glow=fade(gM*(1-gG*.6),`<rect x="${PL-14}" y="${PT-10}" width="20" height="${PB-PT+20}" rx="6" fill="none" stroke="${MX.hi}" stroke-width="2.5"/><rect x="${PR-6}" y="${PT-10}" width="20" height="${PB-PT+20}" rx="6" fill="none" stroke="${MX.hi}" stroke-width="2.5"/>`);
  return ch6(ctx,p,circuit(ctx,{Q:0,wires:gW,flow:0})+fade(gP,plates(0))+glow
   +word('金属の板',520,250,{anchor:'end',size:28,g:gM})+fade(gM,arrow(524,250,548,250,{color:MX.hi,w:3,head:10}))
   +word('すき間',600,150,{anchor:'middle',size:28,color:MX.hi,g:gG})+fade(gG,arrow(600,170,600,222,{color:MX.hi,w:3,head:10}))
   +word('電源',560,436,{anchor:'end',size:26,g:on(ctx,'電源に')}));
 },
 // 1 name it; electrons are pumped onto the right plate and pulled off the left plate
 'mx6-n-electrons':(p,ctx)=>{
  const gF=on(ctx,'電源は',.8),Q=2*smooth(clamp((ctx.t-at(ctx,'送り込み'))/(VE(ctx)-at(ctx,'送り込み'))));
  return ch6(ctx,p,circuit(ctx,{Q,flow:gF,elec:1})
   +word('コンデンサ',600,150,{anchor:'middle',size:30,color:MX.hi,g:on(ctx,'コンデンサ')})
   +word('電子',880,255,{size:26,color:MX.minus,g:on(ctx,'右の板へ')})+fade(on(ctx,'右の板へ'),arrow(870,275,780,275,{color:MX.minus,w:3,head:10}))
   +word('電子',160,255,{size:26,color:MX.minus,g:on(ctx,'左の板から')})+fade(on(ctx,'左の板から'),arrow(250,275,160,275,{color:MX.minus,w:3,head:10})));
 },
 // 2 the plates charge; the wire carries a current, but no charge crosses the gap
 'mx6-n-charge':(p,ctx)=>{
  const Q=Qr(ctx,2,5),gI=on(ctx,'電線には',.8),gG=on(ctx,'すき間を渡らず');
  return ch6(ctx,p,circuit(ctx,{Q,elec:1-gI})
   +word('コンデンサ',600,150,{anchor:'middle',size:30,color:MX.hi,g:1-t0(ctx,.5)})
   +word('マイナス',670,250,{size:26,color:MX.minus,g:on(ctx,'マイナス')})+word('プラス',530,250,{anchor:'end',size:26,color:MX.plus,g:on(ctx,'プラスに')})
   +word('電流',150,255,{size:26,color:MX.I,g:gI})+fade(gI,arrow(236,275,320,275,{color:MX.I,w:3,head:10}))
   +fade(gG,`<rect x="${PL+4}" y="${PT-12}" width="${PR-PL-8}" height="${PB-PT+24}" rx="6" fill="${MX.hi}" fill-opacity=".10" stroke="${MX.hi}" stroke-width="2" stroke-dasharray="6 5"/>`)
   +word('すき間：電流 0',600,150,{anchor:'middle',size:28,color:MX.hi,g:gG}));
 },
 // 3 time-lapse: the current flows only while charge piles up, then stops
 'mx6-n-stop':(p,ctx)=>{
  const tS=at(ctx,'止まります'),Q=mix(5,12,smooth(clamp(ctx.t/(tS+.2)))),gS=on(ctx,'止まります',.8);
  return ch6(ctx,p,circuit(ctx,{Q,flow:1-gS})
   +word('電流',150,255,{size:26,color:MX.I,g:1-gS})+fade(1-gS,arrow(236,275,320,275,{color:MX.I,w:3,head:10}))
   +word('たまっていく間だけ',600,150,{anchor:'middle',size:28,color:MX.I,g:on(ctx,'たまっていく')*(1-gS)})
   +word('電流 0',150,255,{size:26,color:MX.hi,g:gS})+word('たまりきった',600,150,{anchor:'middle',size:28,color:MX.hi,g:gS}));
 },
 // 4 back to the middle of the charging; loop around the wire, its left side
 'mx6-n-loop':(p,ctx)=>{
  const gl=on(ctx,'輪を描き',1.2),gB=on(ctx,'磁場を一周'),gA=on(ctx,'アンペール'),hL=on(ctx,'左辺');
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,3,3.5),loop:gl,bAg:gB})
   +word('充電の途中',900,150,{anchor:'middle',size:28,color:MX.I,g:1-on(ctx,'アンペール',.6)})
   +ampBox(ampere(70,154,{L:1,R:mix(1,.35,hL),hiL:hL}),gA));
 },
 // 5 the right side counts the current through a membrane on the loop; bag vs membrane (47)
 'mx6-n-membrane':(p,ctx)=>{
  const gm=on(ctx,'輪に張った膜',.6),gp=on(ctx,'つき抜ける'),gC=on(ctx,'ガウスの法則',.6),gR=on(ctx,'縁が輪に');
  const pulse=gR>0?.5+.5*Math.sin(ctx.t*6):0;
  const cmp=`<ellipse cx="662" cy="140" rx="40" ry="40" fill="${MX.hi}" fill-opacity=".12" stroke="${MX.hi}" stroke-width="2.5" stroke-dasharray="8 5"/>`
   +`<circle cx="662" cy="140" r="11" fill="${MX.plus}"/>`+line(656,140,668,140,{color:'#fff',w:2})+line(662,134,662,146,{color:'#fff',w:2})
   +label('①② 閉じた袋',714,149,{size:24,color:MX.ink,weight:700})
   +line(890,140,960,140,{color:'#c9d3e6',w:4})+`<ellipse cx="925" cy="140" rx="14" ry="40" fill="${MX.hi}" fill-opacity=".2"/>`
   +`<ellipse cx="925" cy="140" rx="14" ry="40" fill="none" stroke="${gR>0?MX.hi:MX.ink}" stroke-width="${4+2*pulse}"/>`
   +label('③④ 輪に張った膜',972,149,{size:24,color:MX.ink,weight:700});
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,3.5,4),bAg:1,mem:[[0,gm,{col:MX.hi}]]})+pierce(0,gp)
   +fade(gR,`<path d="${arc(LX,WY,LRX,LRY,true)}" fill="none" stroke="${MX.hi}" stroke-width="${3+3*pulse}"/>`)
   +ampBox(ampere(70,154,{L:.35,R:1,hiR:t0(ctx,.5)}))
   +callout(600,88,580,108,cmp,gC));
 },
 // 6 any membrane on the same loop: same left side, so the same answer is expected (⑦)
 'mx6-n-expect':(p,ctx)=>{
  const a1=at(ctx,'どうふくらませ'),a2=at(ctx,'構いません'),a3=at(ctx,'左辺は');
  const b=kf(ctx.t,[[0,0],[a1,0],[a1+1,-.55],[a2+.8,.55],[a3+.6,.35]]);
  const hL=on(ctx,'左辺は輪だけ'),hR=on(ctx,'右辺は同じ');
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,4,4.5),bAg:1,mem:[[b,1,{col:MX.hi}]]})+pierce(b)
   +ampBox(ampere(70,154,{L:mix(.35,1,hL),R:mix(1,.6,hL*(1-hR)),hiL:hL*(1-hR),hiR:hR}))
   +word('左辺：輪だけで決まる',680,130,{size:24,g:hL})+word('右辺：同じ答えのはず',680,180,{size:24,color:MX.I,g:hR}));
 },
 // 7 prediction: push the membrane through the gap
 'mx6-n-predict':(p,ctx)=>{
  const b=mix(.35,1,smooth(clamp((ctx.t-at(ctx,'大きく'))/(at(ctx,'右辺は')-at(ctx,'大きく')+.2)))),gq=on(ctx,'どうなる');
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,4.5,5),bAg:1,mem:[[b,1,{col:MX.hi}]]})+pierce(b)
   +ampBox(ampere(70,154,{L:.35,R:1,rhs:`\\mu_0 ${cI('I')}`,rhs2:'?',mix2:gq,hiR:gq,rcol:MX.ink}))
   +label('？',900,190,{size:80,color:MX.hi,anchor:'middle',weight:700,opacity:gq}));
 },
 // 8 no wire through that membrane: the right side is 0
 'mx6-n-zero':(p,ctx)=>{
  const g0=on(ctx,'ありません'),gz=on(ctx,'ゼロです');
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,5,5.3),bAg:1,mem:[[1,1,{col:MX.hi}]]})
   +fade(t0(ctx,.5),`<ellipse cx="600" cy="${WY}" rx="24" ry="140" fill="none" stroke="${MX.hi}" stroke-width="4"/>`)
   +word('すき間：電流 0',700,150,{size:26,color:MX.hi,g:g0})+fade(g0,arrow(700,165,622,190,{color:MX.hi,w:3,head:10}))
   +ampBox(ampere(70,154,{L:.35,R:1,rhs:'?',rhs2:'0',mix2:gz,hiR:1})));
 },
 // 9 same loop, same left side, two different right sides (thump)
 'mx6-n-paradox':(p,ctx)=>{
  const hL=on(ctx,'左辺は同じ'),g1=on(ctx,'平らな膜では'),g2=on(ctx,'すき間の膜では'),gX=on(ctx,'食い違って'),sh=gX>0&&gX<1?6*Math.sin(ctx.t*40)*(1-gX):0;
  const tbl=label('平らな膜',630,130,{size:26,color:MX.I,weight:700})+fade(g1,T(`\\mu_0 ${cI('I')}`,840,132,34,{anchor:'start'}))
   +fade(g2,label('すき間の膜',630,180,{size:26,color:MX.hi,weight:700})+T('0',840,182,34,{anchor:'start'}))
   +fade(gX,label('食い違い',1080+sh,166,{size:30,color:MX.plus,anchor:'middle',weight:700})+label('≠',930+sh,168,{size:44,color:MX.plus,anchor:'middle',weight:700}));
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,5.3,5.6),bAg:1,mem:[[0,g1,{col:MX.I,fo:.18}],[1,1,{col:MX.hi}]]})+pierce(0,g1)
   +ampBox(ampere(70,154,{L:1,R:.5,rhs:'?',rcol:MX.plus,hiL:hL}))
   +callout(600,88,580,108,tbl,g1));
 },
 // 10 the law was checked for steady currents: no charge piles up anywhere (49)
 'mx6-n-steady':(p,ctx)=>{
  const g=t0(ctx,.6),T0=sceneT(ctx);let ringDots='';
  for(let j=0;j<12;j++){const a=-T0*.8+2*Math.PI*j/12;ringDots+=dot(380+160*Math.cos(a),310+110*Math.sin(a),6,MX.I);}
  const inner=`<ellipse cx="380" cy="310" rx="160" ry="110" fill="none" stroke="#c9d3e6" stroke-width="4"/>`+fade(on(ctx,'一定の電流'),ringDots)
   +word('まちがい？',600,160,{size:28,color:MX.plus,g:1-.6*on(ctx,'第4章')})
   +word('第4章の 条件',600,230,{size:28,g:on(ctx,'第4章')})
   +word('一定の電流',600,310,{size:30,color:MX.I,g:on(ctx,'一定の電流')})
   +word('電荷が どこにも たまらない',600,395,{size:28,g:on(ctx,'どこにも')});
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,5.6,5.9),bAg:1,mem:[[0,.5,{col:MX.I,fo:.18}],[1,.5,{col:MX.hi}]]})+overlay(g,inner));
 },
 // 11 here the current piles charge on the plates: the condition is broken; E in the gap grows
 'mx6-n-broken':(p,ctx)=>{
  const g=1-t0(ctx,.6),gC=on(ctx,'電荷をためて'),gX=on(ctx,'条件が外れ'),gE=on(ctx,'強くなって',.8),Q=Qr(ctx,5.9,8.5);
  const hl=fade(gC*(1-gE*.7),`<rect x="${PL-2}" y="${PT-12}" width="24" height="${PB-PT+24}" rx="8" fill="none" stroke="${MX.plus}" stroke-width="3"/><rect x="${PR-22}" y="${PT-12}" width="24" height="${PB-PT+24}" rx="8" fill="none" stroke="${MX.minus}" stroke-width="3"/>`);
  return ch6(ctx,p,fade(mix(1,.3,t0(ctx,1)),loopBack()+membrane(0,.5,{col:MX.I,fo:.18})+membrane(1,.5))+circuit(ctx,{Q,E:gE})+fade(mix(1,.3,t0(ctx,1)),loopFront()+bAround(ctx,1))+hl
   +overlay(g)
   +word('板に 電荷が たまる',60,130,{size:26,g:gC})+word('一定の電流の 条件が 外れる',60,180,{size:26,color:MX.plus,g:gX})
   +word('すき間の電場 E が 強くなる',680,150,{size:26,color:MX.E,g:gE})+fade(gE,arrow(760,168,625,215,{color:MX.E,w:3,head:10})));
 },
 // 12 zoom onto the plates; Gauss's law with a closed bag around the left plate (50)
 'mx6-n-gauss':(p,ctx)=>{
  const u=smooth(clamp(ctx.t/1.3)),Q=Qr(ctx,8.5,8.7),gP=on(ctx,'一つ目の式'),gB=on(ctx,'閉じた袋',1.2);
  const pic=fade(1-u,loopBack()+membrane(0,.5,{col:MX.I,fo:.18})+membrane(1,.5))+circuit(ctx,{Q,E:1,bat:1-u})+fade(1-u,loopFront()+bAround(ctx,1))+gaussBox(gB);
  return ch6(ctx,p,view(u,pic)
   +word('閉じた袋',195,200,{anchor:'end',size:26,color:MX.hi,g:gB})
   +panel(label('① ガウスの法則',640,140,{size:26,color:MX.dim})+T(`\\oint ${cE('\\vec E')}\\cdot d\\vec A=\\dfrac{Q}{\\varepsilon_0}`,895,235,46),gP));
 },
 // 13 idealization: only the gap face counts
 'mx6-n-faces':(p,ctx)=>{
  const Q=Qr(ctx,8.7,8.9),gI=on(ctx,'板が広く'),gF=on(ctx,'外側や側面'),gG=on(ctx,'残るのは');
  const [lx,ly]=Pv(1,GB.x0,300),[tx,ty]=Pv(1,552,GB.y0),[bx,by]=Pv(1,552,GB.y1);
  const zeros=fade(gF,[[lx-28,ly-40],[tx-62,ty+6],[bx-62,by+6]].map(([x,y])=>label('≈0',x,y,{size:28,color:MX.dim,anchor:'middle',weight:700})).join(''));
  return ch6(ctx,p,view(1,circuit(ctx,{Q,E:1,bat:0})+gaussBox(1,{faces:gF,gap:gG}))+zeros
   +word('閉じた袋',195,200,{anchor:'end',size:26,color:MX.hi,g:1-gF})
   +panel(label('① ガウスの法則',640,140,{size:26,color:MX.dim})+gaussEq(895,235,46,gF)
    +label('板が広く、すき間が狭いとき',640,320,{size:24,color:MX.dim,opacity:gI})
    +label('外側・側面：ほぼ 0',640,380,{size:26,color:MX.ink,opacity:gF})
    +label('すき間側の面だけ が残る',640,440,{size:26,color:MX.E,opacity:gG})));
 },
 // 14 that face gives E·A = Φ_E, so Q = ε0 Φ_E
 'mx6-n-q':(p,ctx)=>{
  const Q=Qr(ctx,8.9,9),gE=on(ctx,'電場 E'),gA=on(ctx,'面積 A'),gPhi=on(ctx,'電気束です'),gG=on(ctx,'ガウスの法則から'),gQ=on(ctx,'イプシロンゼロかける'),mv=t0(ctx,.6);
  const [ex,ey]=Pv(1,600,PT-4),[ax,ay]=Pv(1,GB.x1+8,GB.y1);
  const r2a=`\\Phi_E=${cE('E')}\\,A`,w2a=Tw(r2a,40),x2=680;
  const rows=fade(mix(1,.4,gPhi),T(GSRC,mix(895,960,mv),mix(235,165,mv),mix(46,34,mv)))
   +fade(gPhi,T(r2a,x2,280,40,{anchor:'start',opacity:mix(1,.45,gQ)}))+fade(gG,T('=\\dfrac{Q}{\\varepsilon_0}',x2+w2a+10,280,40,{anchor:'start',opacity:mix(1,.45,gQ)}))
   +box(760,378,250,80,gQ)+fade(gQ,T(`Q=\\varepsilon_0\\,${cE('\\Phi_E')}`,885,430,46));
  return ch6(ctx,p,view(1,circuit(ctx,{Q,E:1,bat:0})+gaussBox(1,{faces:1,gap:1}))
   +fade(gE,T(cE('E'),ex,ey-10,40))+fade(gA,T('A',ax+22,ay+20,38,{color:MX.E}))
   +panel(label('① ガウスの法則',640,125,{size:24,color:MX.dim})+rows));
 },
 // 15 current into this plate = charge added per second; before/after difference over Δt (51, 52)
 'mx6-n-rate':(p,ctx)=>{
  const Q=Qr(ctx,9,9.4),gI=on(ctx,'流れ込む電流'),g1=on(ctx,'一秒あたり'),gD=on(ctx,'前と後'),gT=on(ctx,'時間で割り');
  const s=36,num1='Q(t+\\Delta t)',num2='Q(t)',w1=Tw(num1,s),wm=Tw('-',s),w2=Tw(num2,s),W=w1+wm+w2+20,xs=770;
  const frac=T('I=',xs-8,320,40,{anchor:'end'})+T(num1,xs+6,292,s,{anchor:'start'})+T('-',xs+6+w1+10,292,s,{anchor:'start'})+T(num2,xs+6+w1+wm+20,292,s,{anchor:'start'})
   +fade(gT,line(xs,310,xs+W+12,310,{color:MX.ink,w:2.5})+T('\\Delta t',xs+(W+12)/2,358,s));
  const [ix,iy]=Pv(1,PL-60,WY);
  return ch6(ctx,p,view(1,circuit(ctx,{Q,E:1,bat:0})+fade(.4,gaussBox(1,{faces:1})))
   +fade(gI,arrow(ix-120,iy-34,ix+10,iy-34,{color:MX.I,w:5,head:16})+T(cI('I'),ix-60,iy-52,38))
   +panel(T(`Q=\\varepsilon_0\\,${cE('\\Phi_E')}`,895,150,34,{opacity:.45})
    +label('電荷の 1秒あたりの 増え方',640,205,{size:24,color:MX.I,opacity:g1})
    +fade(gD,frac+label('後',xs+6+w1/2,256,{size:24,color:MX.hi,anchor:'middle',weight:700})+label('前',xs+6+w1+wm+20+w2/2,256,{size:24,color:MX.hi,anchor:'middle',weight:700}))));
 },
 // 16 Q = ε0 Φ_E before and after: the constant ε0 stays in front; then shrink Δt: I = ε0 dΦ_E/dt (52)
 'mx6-n-dt':(p,ctx)=>{
  const Q=Qr(ctx,9.4,10),g5=on(ctx,'差をとっても'),gK=on(ctx,'一定の'),mv=on(ctx,'Δt を短く',.8,.35),gO=on(ctx,'Δt を短く',.35),gR=on(ctx,'等しく');
  const s=36,num1='Q(t+\\Delta t)',num2='Q(t)',w1=Tw(num1,s),wm=Tw('-',s),w2=Tw(num2,s),W=w1+wm+w2+20,xs=770;
  const frac=T('I=',xs-8,320,40,{anchor:'end'})+T(num1,xs+6,292,s,{anchor:'start'})+T('-',xs+6+w1+10,292,s,{anchor:'start'})+T(num2,xs+6+w1+wm+20,292,s,{anchor:'start'})
   +line(xs,310,xs+W+12,310,{color:MX.ink,w:2.5})+T('\\Delta t',xs+(W+12)/2,358,s);
  const fr2=`\\dfrac{${cE('\\Phi_E')}(t+\\Delta t)-${cE('\\Phi_E')}(t)}{\\Delta t}`,we=Tw('\\varepsilon_0',40),y5=mix(440,190,mv);
  const r5=T('=',xs-8,y5,40,{anchor:'end'})+box(xs-4,y5-38,we+16,56,gK)+T(cH('\\varepsilon_0'),xs+4,y5,40,{anchor:'start'})+T(fr2,xs+we+14,y5,34,{anchor:'start'});
  return ch6(ctx,p,view(1,circuit(ctx,{Q,E:1,bat:0})+fade(.4,gaussBox(1,{faces:1})))
   +panel(fade(1-gO,fade(mix(1,.45,g5),frac)+T(`Q=${cH('\\varepsilon_0')}\\,${cE('\\Phi_E')}`,895,150,34,{opacity:mix(.45,1,gK)}))
    +fade(g5,fade(mix(1,.45,Math.min(on(ctx,'電流 I',.5,.6),mv)),r5))+label('一定の数は そのまま',640,495,{size:24,color:MX.hi,opacity:gK*(1-gO)})
    +label('Δt を短く',640,340,{size:24,color:MX.hi,opacity:clamp(mv*2-1)})+label('その瞬間',640,420,{size:24,color:MX.dim,opacity:Math.min(on(ctx,'電流 I',.5,.6),mv)})
    +box(800,355,230,100,gR)+fade(Math.min(on(ctx,'電流 I',.5,.6),mv),T(`${cI('I')}=\\varepsilon_0\\dfrac{d${cE('\\Phi_E')}}{dt}`,915,412,40))));
 },
 // 18 back to the loop: through the wire I, through the gap ε0 dΦ_E/dt — equal (ding)
 'mx6-n-equal':(p,ctx)=>{
  const u=1-smooth(clamp(ctx.t/1.1)),Q=Qr(ctx,10,10.5),gA=on(ctx,'電線を通る膜'),gB=on(ctx,'すき間を通る膜'),gC=on(ctx,'ぴったり'),L=220;
  const bars=label('電線の膜',680,120,{size:24,color:MX.I,weight:700})+`<rect x="810" y="100" width="${(L*gA).toFixed(1)}" height="28" rx="6" fill="${MX.I}"/>`+fade(gA,T(cI('I'),1040,124,32,{anchor:'start'}))
   +fade(gB,label('すき間の膜',680,170,{size:24,color:MX.hi,weight:700}))+`<rect x="810" y="150" width="${(L*gB).toFixed(1)}" height="28" rx="6" fill="${MX.E}"/>`
   +fade(gB,T(`\\varepsilon_0\\,d${cE('\\Phi_E')}/dt`,1040,174,26,{anchor:'start'}))
   +fade(gC,line(810+L,92,810+L,186,{color:MX.hi,w:3,dash:'6 5'}))+tick(1150,140,gC);
  const pic=fade(1-u,loopBack()+membrane(0,.4+.6*gA*(1-gB*.6),{col:MX.I,fo:.2})+membrane(1,.4+.6*gB,{col:MX.hi}))+circuit(ctx,{Q,E:1,bat:1-u})
   +fade(1-u,loopFront()+bAround(ctx,1)+pierce(0,gA)+capPierce(Q,gB));
  return ch6(ctx,p,view(u,pic)+panel('',u)
   +ampBox(T(`${cI('I')}=\\varepsilon_0\\dfrac{d${cE('\\Phi_E')}}{dt}`,300,146,38),1-u)
   +callout(660,88,520,108,bars,gA));
 },
 // 19 Maxwell adds the term: both membranes now give the same right side
 'mx6-n-complete':(p,ctx)=>{
  const Q=Qr(ctx,10.5,11),gT=on(ctx,'この電場の変化の項',.6),gK=on(ctx,'どちらの膜');
  const s=36,x0=62,y=154,lhs=LHS,w1=Tw(lhs,s),rI=`=\\mu_0 ${cI('I')}+`,w2=Tw(rI,s),term=`\\mu_0\\varepsilon_0\\dfrac{d${cE('\\Phi_E')}}{dt}`,w3=Tw(term,s);
  const eq=T(lhs,x0,y,s,{anchor:'start'})+T(rI,x0+w1+8,y,s,{anchor:'start'})
   +fade(1-gT,T('?',x0+w1+w2+22,y,s,{anchor:'start',color:MX.dim}))+box(x0+w1+w2+10,y-60,w3+20,92,gT)+fade(gT,T(term,x0+w1+w2+20,y,s,{anchor:'start'}));
  const rows=label('平らな膜',785,128,{size:22,color:MX.I,weight:700})+T(`\\mu_0 ${cI('I')}+0`,915,130,26,{anchor:'start'})+tick(1150,120,gK)
   +label('すき間の膜',785,178,{size:22,color:MX.hi,weight:700})+T(`0+\\mu_0\\varepsilon_0\\,d${cE('\\Phi_E')}/dt`,915,180,26,{anchor:'start'})+tick(1150,170,gK);
  return ch6(ctx,p,loopScene(ctx,{Q,E:1,bAg:1,mem:[[0,.7,{col:MX.I,fo:.2}],[1,.7,{col:MX.hi}]]})+pierce(0)+capPierce(Q,1)
   +callout(40,84,720,110,eq)+callout(770,88,410,108,rows,gK));
 },
 // 20 a consistency argument, later confirmed by experiment (53)
 'mx6-n-check':(p,ctx)=>{
  const g=t0(ctx,.6),Q=Qr(ctx,11,11.3);
  const inner=T(`\\mu_0\\varepsilon_0\\dfrac{d${cE('\\Phi_E')}}{dt}`,600,175,44)
   +causal('理屈からの予想','実験で確認',600,285,{ca:MX.hi,cb:MX.good,size:32,g:on(ctx,'理屈')})
   +word('ヘルツ（1888年）',600,375,{anchor:'middle',size:28,g:on(ctx,'ヘルツ')})
   +word('予言された 波を とらえた',600,455,{anchor:'middle',size:28,color:MX.good,g:on(ctx,'波を')});
  return ch6(ctx,p,loopScene(ctx,{Q,E:1,bAg:1,mem:[[0,.5,{col:MX.I,fo:.18}],[1,.5,{col:MX.hi}]]})+overlay(g,inner));
 },
 // 21 a changing E makes B too: B circles the gap like it circles the wire
 'mx6-n-four':(p,ctx)=>{
  const g=1-t0(ctx,.6),gB=on(ctx,'磁場を作る',.6,-.3),Q=Qr(ctx,11.3,11.6),ph=-sceneT(ctx)*.9;
  return ch6(ctx,p,chevrons(600,WY,34,135,ph,{n:12,size:13,g:gB,front:false,dir:-1})+fade(gB*.6,`<path d="${arc(600,WY,34,135,false)}" fill="none" stroke="${MX.B}" stroke-width="2" stroke-dasharray="6 6"/>`)
   +loopBack()+circuit(ctx,{Q,E:1})+loopFront()+bAround(ctx,1)
   +fade(gB,`<path d="${arc(600,WY,34,135,true)}" fill="none" stroke="${MX.B}" stroke-width="3"/>`)+chevrons(600,WY,34,135,ph,{n:12,size:13,g:gB,back:false,dir:-1})
   +overlay(g)
   +causal('電場の変化','磁場',900,170,{ca:MX.E,cb:MX.B,size:34,g:clamp(ctx.t/.5)})+word('4つの式が そろった',900,440,{size:30,color:MX.hi,anchor:'middle',g:on(ctx,'四つの式')}));
 },
 // 22 the two changes feed each other: what happens?
 'mx6-n-to-wave':(p,ctx)=>{
  const T1=sceneT(ctx),g1=clamp(ctx.t/.5),g2=on(ctx,'電場の変化は'),g3=on(ctx,'何が');
  const s=fade(.35,circuit(ctx,{Q:12,E:1}));
  const top=draw(Array.from({length:31},(_,i)=>{const a=Math.PI*(1-i/30);return [600+220*Math.cos(a),320-110*Math.sin(a)];}),g1,{color:MX.E,w:5});
  const bot=draw(Array.from({length:31},(_,i)=>{const a=-Math.PI*i/30;return [600-220*Math.cos(a),320-110*Math.sin(a)];}).map(([x,y])=>[1200-x,y]),g2,{color:MX.B,w:5});
  const run=g2>=1?(()=>{const a=(T1*1.4)%(2*Math.PI);return dot(600-220*Math.cos(a),320-110*Math.sin(a),10,MX.hi);})():'';
  return ch6(ctx,p,s+`<rect x="160" y="140" width="880" height="360" rx="18" fill="${MX.bg}" fill-opacity=".8"/>`+top+bot+fade(g1,arrow(585,210,615,210,{color:MX.E,w:5,head:22}))+fade(g2,arrow(615,430,585,430,{color:MX.B,w:5,head:22}))
   +word('磁場の変化',380,330,{size:32,color:MX.B,anchor:'middle'})+word('電場の変化',820,330,{size:32,color:MX.E,anchor:'middle',g:g1})+run
   +label('？',600,340,{size:80,color:MX.hi,anchor:'middle',weight:700,opacity:g3}));
 },
};
