// Diagrams for the v2 Maxwell film, part p6 (chapter 6). Keys: 'mx6-n-<name>'.
// Base picture: the charging parallel-plate capacitor circuit of the original chapter 6
// (mxC-diagrams.mjs), with an Ampère loop on the top-left wire. Current dots never cross
// the gap; the number of E arrows in the gap always equals the number of charges on a plate
// (Q = ε0 Φ_E). The left plate is joined to the battery's + terminal, so it charges +, the
// current in the top-left wire flows to the right, and B around it points down on the
// front half of the loop. Cues 16–25 zoom onto the plates (view u=1) with an equation panel;
// cues 20–24 put a Q–t graph card over the picture while the algebra runs (v3, items 50–51).
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


// ---- v3 additions ---------------------------------------------------------------------------
// Q–t graph (51): the plate's charge while charging. Secant slope = average current over Δt,
// tangent slope = the current at that instant. Drawn on its own card so the plates step back.
const GX=100,GY=455,GW=430,GH=285,TAU=.38,QN=1-Math.exp(-1/TAU);
const gq=t=>(1-Math.exp(-t/TAU))/QN,gP=t=>[GX+GW*t,GY-GH*gq(t)];
function graphQ({g=1,t1=.26,dt=.3,sec=1,br=1,qt=0,ylab=null,slope='平均の電流',sg=1}={}){
 if(g<=0)return '';
 let s=`<rect x="40" y="88" width="560" height="420" rx="16" fill="${MX.bg2}" fill-opacity=".97" stroke="${MX.faint}" stroke-width="2"/>`;
 s+=arrow(GX,GY,GX+GW+30,GY,{color:MX.dim,w:2.5,head:10})+arrow(GX,GY,GX,GY-GH-40,{color:MX.dim,w:2.5,head:10});
 s+=label('時刻',GX+GW+28,GY+36,{size:22,color:MX.ink,anchor:'end'})+(ylab??T('Q',GX-30,GY-GH-18,30));
 s+=draw(Array.from({length:61},(_,i)=>gP(i/60)),1,{color:MX.I,w:4});
 const [x1,y1]=gP(t1),[x2,y2]=gP(t1+dt),m=(y2-y1)/(x2-x1),e1=50,e2=70;
 s+=fade(sec,line(x1-e1,y1-m*e1,x2+e2,y2+m*e2,{color:MX.hi,w:3}));
 s+=fade(br*sec,line(x1,y1,x2,y1,{color:MX.ink,w:2,dash:'6 5'})+line(x2,y1,x2,y2,{color:MX.ink,w:2,dash:'6 5'})
  +T('\\Delta t',(x1+x2)/2,y1+34,26)+label('増え方',x2+10,(y1+y2)/2+8,{size:22,color:MX.ink}));
 s+=fade(qt,line(x1,GY,x1,y1,{color:MX.hi,w:3,dash:'7 5'})+T('t',x1,GY+34,28,{color:MX.hi})+T('Q(t)',x1-12,(GY+y1)/2+10,28,{anchor:'end',color:MX.hi}));
 s+=dot(x1,y1,7,MX.hi)+fade(sec,dot(x2,y2,7,MX.hi));
 s+=word(`傾き ＝ ${slope}`,GX+GW+10,GY-GH-12,{anchor:'end',size:24,color:MX.hi,g:sg*sec});
 return fade(g,s);}
const zoomed=(ctx,Q,{box=.4}={})=>view(1,circuit(ctx,{Q,E:1,bat:0})+fade(box,gaussBox(1,{faces:1})));
const cF=v=>cE(`\\Phi_E${v}`);

// Two large plates seen edge-on (49): + plate alone, − plate alone, and their superposition.
const SP=560,SM=700,SY0=140,SY1=440,RA=195,RB=275,RC=375;
function sheetPlates({gp=1,gm=1}={}){let s='';const ys=[160,197,234,271,308,345,382,419];
 const chg=(x,y,sg)=>`<circle cx="${x}" cy="${y}" r="7" fill="${sg>0?MX.plus:MX.minus}"/>`+line(x-4,y,x+4,y,{color:'#fff',w:2})+(sg>0?line(x,y-4,x,y+4,{color:'#fff',w:2}):'');
 s+=fade(gp,`<rect x="${SP-12}" y="${SY0}" width="12" height="${SY1-SY0}" rx="3" fill="#9aa9c4" stroke="#dfe6f2" stroke-width="1.5"/>`+ys.map(y=>chg(SP+8,y,1)).join(''));
 s+=fade(gm,`<rect x="${SM}" y="${SY0}" width="12" height="${SY1-SY0}" rx="3" fill="#9aa9c4" stroke="#dfe6f2" stroke-width="1.5"/>`+ys.map(y=>chg(SM-8,y,-1)).join(''));
 return s;}
const fa=(x,y,X,col,g,w=4)=>fade(g,arrow(x,y,X,y,{color:col,w,head:13}));
function rowPlus(g){return fa(535,RA,395,MX.plus,g)+fa(582,RA,682,MX.plus,g)+fa(725,RA,855,MX.plus,g);}
function rowMinus(g){return fa(395,RB,535,MX.minus,g)+fa(582,RB,682,MX.minus,g)+fa(855,RB,725,MX.minus,g);}
function rowSum(g){return fade(g,label('0',465,RC+14,{size:40,color:MX.E,anchor:'middle',weight:700})+label('0',790,RC+14,{size:40,color:MX.E,anchor:'middle',weight:700}))+fa(582,RC,684,MX.E,g,8);}
function sheetScene(ctx,{gp=1,gm=1,rA=0,rB=0,rC=0,dimAB=0}={}){
 return label('外側',465,118,{size:22,color:MX.dim,anchor:'middle'})+label('間',632,118,{size:22,color:MX.dim,anchor:'middle'})+label('外側',790,118,{size:22,color:MX.dim,anchor:'middle'})
  +sheetPlates({gp,gm})+fade(1-.7*dimAB,rowPlus(rA)+rowMinus(rB))+rowSum(rC)
  +word('＋の板だけ',30,RA+8,{size:24,color:MX.plus,g:rA*(1-.6*dimAB)})+word('−の板だけ',30,RB+8,{size:24,color:MX.minus,g:rB*(1-.6*dimAB)})+word('重ね合わせ',30,RC+8,{size:24,color:MX.E,g:rC});}

// The complete-law picture with its table (53): rows can mark the idealized zeros.
function completeScene(ctx,{Q,gT=1,gK=1,gZ=0,gG=0,tag=1}){
 const s=36,x0=62,y=154,lhs=LHS,w1=Tw(lhs,s),rI=`=\\mu_0 ${cI('I')}+`,w2=Tw(rI,s),term=`\\mu_0\\varepsilon_0\\dfrac{d${cE('\\Phi_E')}}{dt}`,w3=Tw(term,s);
 const eq=T(lhs,x0,y,s,{anchor:'start'})+T(rI,x0+w1+8,y,s,{anchor:'start'})
  +fade(1-gT,T('?',x0+w1+w2+22,y,s,{anchor:'start',color:MX.dim}))+box(x0+w1+w2+10,y-60,w3+20,92,Math.max(gT*(1-gK),gG))+fade(gT,T(term,x0+w1+w2+20,y,s,{anchor:'start'}));
 const r1=`\\mu_0 ${cI('I')}+`,z1=915+Tw(r1,26)+Tw('0',26)/2,z2=915+Tw('0',26)/2;
 const rows=label('平らな膜',785,128,{size:22,color:MX.I,weight:700})+T(`${r1}0`,915,130,26,{anchor:'start'})+tick(1150,120,gK)
  +label('すき間の膜',785,178,{size:22,color:MX.hi,weight:700})+T(`0+\\mu_0\\varepsilon_0\\,d${cE('\\Phi_E')}/dt`,915,180,26,{anchor:'start'})+tick(1150,170,gK)
  +fade(gZ,ring(z1,121,17,{color:MX.plus,w:3})+ring(z2,171,17,{color:MX.plus,w:3}))
  +label('理想化した回路での値',975,226,{size:22,color:MX.ink,anchor:'middle',opacity:tag*(1-gG)})
  +label('一般には 両方の項を足す',975,226,{size:22,color:MX.hi,anchor:'middle',weight:700,opacity:gG});
 return loopScene(ctx,{Q,E:1,bAg:1,mem:[[0,.7,{col:MX.I,fo:.2}],[1,.7,{col:MX.hi}]]})+pierce(0)+capPierce(Q,1)
  +callout(40,84,720,110,eq)+callout(770,88,410,156,rows,gK);}

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
 // 3 (46) the source pushes charge on; the charge already there pushes back
 'mx6-n-push':(p,ctx)=>{
  const Q=Qr(ctx,5,6.9),gS=on(ctx,'送り込もう'),gB=on(ctx,'押し返す');
  return ch6(ctx,p,circuit(ctx,{Q})
   +word('電源：送り込む',110,232,{size:26,color:MX.I,g:gS})+fade(gS,arrow(236,275,330,275,{color:MX.I,w:4,head:12}))
   +fade(gB,`<rect x="${PL+2}" y="${PT-12}" width="22" height="${PB-PT+24}" rx="8" fill="none" stroke="${MX.plus}" stroke-width="3"/>`+arrow(546,335,430,335,{color:MX.plus,w:5,head:14}))
   +word('たまった電荷：押し返す',180,398,{size:26,color:MX.plus,g:gB}));
 },
 // 4 (46) plate voltage → source voltage, current → almost 0; not "full": a higher voltage stores more
 'mx6-n-stop':(p,ctx)=>{
  const tS=at(ctx,'ほとんど'),s=mix(.85,4,smooth(clamp(ctx.t/(tS+.4)))),gU=on(ctx,'上げれば',1.2),vr=1-Math.exp(-s),ir=Math.exp(-s);
  const up=gU*smooth(clamp((ctx.t-at(ctx,'上げれば'))/1.5)),Q=10*vr+2*up,bw=250,bx=860,src=bw*(1+.2*gU),cur=ir/.43+.45*gU*Math.sin(Math.PI*up);
  const bars=label('電源の電圧',680,130,{size:22,color:MX.ink})+`<rect x="${bx}" y="112" width="${src.toFixed(1)}" height="22" rx="5" fill="#c9d3e6" fill-opacity=".85"/>`
   +label('板の間の電圧',680,172,{size:22,color:MX.hi})+`<rect x="${bx}" y="154" width="${(bw*(vr+.2*up)).toFixed(1)}" height="22" rx="5" fill="${MX.hi}"/>`
   +label('電流',680,214,{size:22,color:MX.I})+`<rect x="${bx}" y="196" width="${(bw*cur).toFixed(1)}" height="22" rx="5" fill="${MX.I}"/>`
   +line(bx+src,104,bx+src,226,{color:MX.ink,w:2,dash:'5 4'});
  return ch6(ctx,p,circuit(ctx,{Q,flow:clamp(cur*1.3)})
   +callout(660,88,525,150,bars,t0(ctx,.5))
   +word('近づく',1040,262,{size:22,color:MX.hi,g:on(ctx,'近づき')*(1-gU)})
   +word('満杯ではない',120,372,{size:24,color:MX.plus,g:on(ctx,'満杯')})
   +word('電圧を上げれば さらにたまる',120,432,{size:24,color:MX.ink,g:gU}));
 },
 // 5 one instant during the charging; loop around the wire, its left side
 'mx6-n-loop':(p,ctx)=>{
  const gl=on(ctx,'輪を描き',1.2),gB=on(ctx,'磁場を一周'),gA=on(ctx,'アンペール'),hL=on(ctx,'左辺');
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,3,3.5),loop:gl,bAg:gB})
   +word('充電の途中の 一瞬',900,150,{anchor:'middle',size:28,color:MX.I,g:1-on(ctx,'アンペール',.6)})
   +ampBox(ampere(70,154,{L:1,R:mix(1,.35,hL),hiL:hL}),gA));
 },
 // 6 (47) right side = μ0 × the current through a membrane, counted positive one way; bag vs membrane
 'mx6-n-membrane':(p,ctx)=>{
  const gm=on(ctx,'輪に張った膜',.6),gp=on(ctx,'つき抜ける'),gD=on(ctx,'正の向き'),gM=on(ctx,'ミューゼロ倍'),gC=on(ctx,'ガウスの法則',.6),gR=on(ctx,'縁が輪に');
  const pulse=gR>0?.5+.5*Math.sin(ctx.t*6):0;
  const cmp=`<ellipse cx="662" cy="140" rx="40" ry="40" fill="${MX.hi}" fill-opacity=".12" stroke="${MX.hi}" stroke-width="2.5" stroke-dasharray="8 5"/>`
   +`<circle cx="662" cy="140" r="11" fill="${MX.plus}"/>`+line(656,140,668,140,{color:'#fff',w:2})+line(662,134,662,146,{color:'#fff',w:2})
   +label('①② 閉じた袋',714,149,{size:24,color:MX.ink,weight:700})
   +line(890,140,960,140,{color:'#c9d3e6',w:4})+`<ellipse cx="925" cy="140" rx="14" ry="40" fill="${MX.hi}" fill-opacity=".2"/>`
   +`<ellipse cx="925" cy="140" rx="14" ry="40" fill="none" stroke="${gR>0?MX.hi:MX.ink}" stroke-width="${4+2*pulse}"/>`
   +label('③④ 輪に張った膜',972,149,{size:24,color:MX.ink,weight:700});
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,3.5,4),bAg:1,mem:[[0,gm,{col:MX.hi}]]})+pierce(0,gp)
   +fade(gD,arrow(262,408,352,408,{color:MX.hi,w:4,head:13}))+word('正の向き',307,450,{anchor:'middle',size:24,color:MX.hi,g:gD})
   +fade(gR,`<path d="${arc(LX,WY,LRX,LRY,true)}" fill="none" stroke="${MX.hi}" stroke-width="${3+3*pulse}"/>`)
   +ampBox(ampere(70,154,{L:.35,R:1,hiR:Math.max(t0(ctx,.5)*(1-gD),gM*(1-gC))}))
   +callout(600,88,580,108,cmp,gC));
 },
 // 7 any membrane on the same loop: same left side, so the same answer is expected (⑦)
 'mx6-n-expect':(p,ctx)=>{
  const a1=at(ctx,'どうふくらませ'),a2=at(ctx,'構いません'),a3=at(ctx,'左辺は');
  const b=kf(ctx.t,[[0,0],[a1,0],[a1+1,-.55],[a2+.8,.55],[a3+.6,.35]]);
  const hL=on(ctx,'左辺は輪だけ'),hR=on(ctx,'右辺は同じ');
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,4,4.5),bAg:1,mem:[[b,1,{col:MX.hi}]]})+pierce(b)
   +ampBox(ampere(70,154,{L:mix(.35,1,hL),R:mix(1,.6,hL*(1-hR)),hiL:hL*(1-hR),hiR:hR}))
   +word('左辺：輪だけで決まる',680,130,{size:24,g:hL})+word('右辺：同じ答えのはず',680,180,{size:24,color:MX.I,g:hR}));
 },
 // 8 (48) prediction: same loop, instant and field; only the counting membrane is pushed into the gap
 'mx6-n-predict':(p,ctx)=>{
  const b=mix(.35,1,smooth(clamp((ctx.t-at(ctx,'大きく'))/(at(ctx,'右辺は')-at(ctx,'大きく')+.2)))),gq=on(ctx,'どうなる'),gF=on(ctx,'輪も'),gO=on(ctx,'膜だけ');
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,4.5,5),bAg:1,mem:[[b,1,{col:MX.hi}]]})+pierce(b)
   +ampBox(ampere(70,154,{L:.35,R:1,rhs:`\\mu_0 ${cI('I')}`,rhs2:'?',mix2:gq,hiR:gq,rcol:MX.ink}))
   +word('輪・時刻・磁場：そのまま',660,130,{size:24,g:gF})+word('変えるのは 数える膜だけ',660,182,{size:24,color:MX.hi,g:gO})
   +label('？',1100,262,{size:72,color:MX.hi,anchor:'middle',weight:700,opacity:gq}));
 },
 // 9 no wire through that membrane: the right side is 0
 'mx6-n-zero':(p,ctx)=>{
  const g0=on(ctx,'ありません'),gz=on(ctx,'ゼロです');
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,5,5.3),bAg:1,mem:[[1,1,{col:MX.hi}]]})
   +fade(t0(ctx,.5),`<ellipse cx="600" cy="${WY}" rx="24" ry="140" fill="none" stroke="${MX.hi}" stroke-width="4"/>`)
   +word('すき間：電流 0',700,150,{size:26,color:MX.hi,g:g0})+fade(g0,arrow(700,165,622,190,{color:MX.hi,w:3,head:10}))
   +ampBox(ampere(70,154,{L:.35,R:1,rhs:'?',rhs2:'0',mix2:gz,hiR:1})));
 },
 // 10 same loop, same left side, two different right sides (thump)
 'mx6-n-paradox':(p,ctx)=>{
  const hL=on(ctx,'左辺は同じ'),g1=on(ctx,'平らな膜では'),g2=on(ctx,'すき間の膜では'),gX=on(ctx,'食い違って'),sh=gX>0&&gX<1?6*Math.sin(ctx.t*40)*(1-gX):0;
  const tbl=label('平らな膜',630,130,{size:26,color:MX.I,weight:700})+fade(g1,T(`\\mu_0 ${cI('I')}`,840,132,34,{anchor:'start'}))
   +fade(g2,label('すき間の膜',630,180,{size:26,color:MX.hi,weight:700})+T('0',840,182,34,{anchor:'start'}))
   +fade(gX,label('食い違い',1080+sh,166,{size:30,color:MX.plus,anchor:'middle',weight:700})+label('≠',930+sh,168,{size:44,color:MX.plus,anchor:'middle',weight:700}));
  return ch6(ctx,p,loopScene(ctx,{Q:Qr(ctx,5.3,5.6),bAg:1,mem:[[0,g1,{col:MX.I,fo:.18}],[1,1,{col:MX.hi}]]})+pierce(0,g1)
   +ampBox(ampere(70,154,{L:1,R:.5,rhs:'?',rcol:MX.plus,hiL:hL}))
   +callout(600,88,580,108,tbl,g1));
 },
 // 11 the law was checked for steady currents: no charge piles up anywhere
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
 // 12 (48) here the current piles charge on the plates: the condition is broken, not the logic
 'mx6-n-broken':(p,ctx)=>{
  const g=1-t0(ctx,.6),gC=on(ctx,'電荷をためて'),gX=on(ctx,'条件が外れ'),gL=on(ctx,'論理が'),gR=on(ctx,'範囲の外'),Q=Qr(ctx,5.9,7.5);
  const hl=fade(gC,`<rect x="${PL-2}" y="${PT-12}" width="24" height="${PB-PT+24}" rx="8" fill="none" stroke="${MX.plus}" stroke-width="3"/><rect x="${PR-22}" y="${PT-12}" width="24" height="${PB-PT+24}" rx="8" fill="none" stroke="${MX.minus}" stroke-width="3"/>`);
  return ch6(ctx,p,fade(mix(1,.3,t0(ctx,1)),loopBack()+membrane(0,.5,{col:MX.I,fo:.18})+membrane(1,.5))+circuit(ctx,{Q})+fade(mix(1,.3,t0(ctx,1)),loopFront()+bAround(ctx,1))+hl
   +overlay(g)
   +word('板に 電荷が たまる',60,130,{size:26,g:gC})+word('一定の電流の 条件が 外れる',60,180,{size:26,color:MX.plus,g:gX})
   +word('論理は 壊れていない',690,130,{size:26,color:MX.good,g:gL})+word('確かめた範囲の 外で使った',690,180,{size:26,color:MX.hi,g:gR}));
 },
 // 13 (49) one large + plate alone: field on both sides, pointing away
 'mx6-n-sheet':(p,ctx)=>{
  const gE=on(ctx,'電場を作ります'),gA=on(ctx,'プラスの広い板'),gB=on(ctx,'離れる向き',.8);
  return ch6(ctx,p,sheetScene(ctx,{gp:1,gm:mix(1,.25,gA),rA:gB})
   +word('たまった電荷 → すき間に電場',870,470,{anchor:'middle',size:24,color:MX.E,g:gE*(1-gA)})
   +word('広い板：両側に 離れる向き',950,300,{anchor:'middle',size:24,color:MX.plus,g:gB}));
 },
 // 14 (49) − plate alone: toward it on both sides; superposition: reinforce inside, cancel outside
 'mx6-n-super':(p,ctx)=>{
  const gM=on(ctx,'両側から'),gS=on(ctx,'重ね合わせると'),gI=on(ctx,'間では'),gO=on(ctx,'外側では');
  return ch6(ctx,p,sheetScene(ctx,{gp:1,gm:mix(.25,1,t0(ctx,.6)),rA:1,rB:gM,rC:gS,dimAB:gS*.6})
   +word('打ち消す',465,470,{anchor:'middle',size:22,color:MX.E,g:gO})+word('強め合う',632,470,{anchor:'middle',size:22,color:MX.E,g:gI})+word('打ち消す',790,470,{anchor:'middle',size:22,color:MX.E,g:gO})
   +word('同じ強さ・逆向き',1030,300,{anchor:'middle',size:24,color:MX.ink,g:gO}));
 },
 // 15 (49) the idealization: a little field remains at the edges; each instant = static shape
 'mx6-n-ideal':(p,ctx)=>{
  const gF=on(ctx,'端'),gZ=on(ctx,'理想化です'),gQ=on(ctx,'変化も'),gS=on(ctx,'止まった電荷');
  const fr=(y0,dy)=>`<path d="M${SP+2} ${y0} Q ${(SP+SM)/2} ${y0+dy} ${SM-2} ${y0}" fill="none" stroke="${MX.E}" stroke-width="3" stroke-dasharray="6 5"/>`
   +`<path d="M${SP-12} ${y0} Q ${SP-60} ${y0+dy*.8} ${SP-110} ${y0+dy*.9}" fill="none" stroke="${MX.E}" stroke-width="2.5" stroke-dasharray="4 5" stroke-opacity=".8"/>`
   +`<path d="M${SM+12} ${y0} Q ${SM+60} ${y0+dy*.8} ${SM+110} ${y0+dy*.9}" fill="none" stroke="${MX.E}" stroke-width="2.5" stroke-dasharray="4 5" stroke-opacity=".8"/>`;
  return ch6(ctx,p,sheetScene(ctx,{rA:1,rB:1,rC:1,dimAB:.6})+fade(gF,fr(SY0+4,-26)+fr(SY1-4,30))
   +word('端・電線の近く：少し残る',870,160,{size:22,color:MX.E,g:gF})
   +word('外側 ≈ 0 は 理想化',870,248,{size:22,color:MX.hi,g:gZ})
   +word('変化は ゆっくり',870,336,{size:22,color:MX.ink,g:gQ})
   +word('各瞬間の形は',870,404,{size:22,color:MX.ink,g:gS})+word('止まった電荷と同じ',870,456,{size:22,color:MX.ink,g:gS}));
 },
 // 16 zoom onto the plates; Gauss's law with a closed bag around the left plate
 'mx6-n-gauss':(p,ctx)=>{
  const u=smooth(clamp(ctx.t/1.3)),Q=Qr(ctx,7.5,8),gP=on(ctx,'一つ目の式'),gB=on(ctx,'閉じた袋',1.2);
  const pic=fade(1-u,loopBack()+membrane(0,.5,{col:MX.I,fo:.18})+membrane(1,.5))+circuit(ctx,{Q,E:1,bat:1-u})+fade(1-u,loopFront()+bAround(ctx,1))+gaussBox(gB);
  return ch6(ctx,p,view(u,pic)
   +word('閉じた袋',195,200,{anchor:'end',size:26,color:MX.hi,g:gB})
   +panel(label('① ガウスの法則',640,140,{size:26,color:MX.ink})+T(GSRC,895,235,46),gP));
 },
 // 17 (49) in the idealization only the gap face counts, crossed outward
 'mx6-n-faces':(p,ctx)=>{
  const Q=Qr(ctx,8,8.3),gF=on(ctx,'外側や側面'),gG=on(ctx,'残るのは'),gO=on(ctx,'外向き');
  const [lx,ly]=Pv(1,GB.x0,300),[tx,ty]=Pv(1,552,GB.y0),[bx,by]=Pv(1,552,GB.y1),[gx,gy]=Pv(1,GB.x1+8,215);
  const zeros=fade(gF,[[lx-28,ly-40],[tx-62,ty+6],[bx-62,by+6]].map(([x,y])=>label('≈0',x,y,{size:28,color:MX.ink,anchor:'middle',weight:700})).join(''));
  return ch6(ctx,p,view(1,circuit(ctx,{Q,E:1,bat:0})+gaussBox(1,{faces:gF,gap:gG}))+zeros
   +fade(gO,arrow(gx-10,gy-40,gx+80,gy-40,{color:MX.E,w:4,head:12}))+word('外向き',gx+90,gy-32,{size:22,color:MX.E,g:gO})
   +word('閉じた袋',195,200,{anchor:'end',size:26,color:MX.hi,g:1-gF})
   +panel(label('① ガウスの法則',640,140,{size:26,color:MX.ink})+gaussEq(895,235,46,gF)
    +label('理想化：外側・側面 ≈ 0',640,340,{size:26,color:MX.ink,opacity:gF})
    +label('すき間側の面だけ が残る',640,420,{size:26,color:MX.E,opacity:gG})));
 },
 // 18 (50) that face gives E·A = Φ_E; multiply both sides by ε0: ε0 Φ_E = Q
 'mx6-n-q':(p,ctx)=>{
  const Q=Qr(ctx,8.3,8.5),gE=on(ctx,'電場 E'),gA=on(ctx,'面積 A'),gPhi=on(ctx,'電気束です'),gX=on(ctx,'両辺に'),gQ=on(ctx,'等しく',.45,-.8),mv=t0(ctx,.6);
  const [ex,ey]=Pv(1,600,PT-4),[ax,ay]=Pv(1,GB.x1+8,GB.y1);
  const r2=`${cE('\\Phi_E')}=${cE('E')}\\,A=\\dfrac{Q}{\\varepsilon_0}`;
  const rows=fade(mix(1,.45,gPhi),T(GSRC,mix(895,960,mv),mix(235,165,mv),mix(46,34,mv)))
   +fade(gPhi,T(r2,895,280,40,{opacity:mix(1,.5,gQ)}))
   +label('両辺 × ε₀',640,365,{size:26,color:MX.hi,weight:700,opacity:gX})
   +box(770,380,250,80,gQ)+fade(gQ,T(`\\varepsilon_0\\,${cE('\\Phi_E')}=Q`,895,432,46));
  return ch6(ctx,p,view(1,circuit(ctx,{Q,E:1,bat:0})+gaussBox(1,{faces:1,gap:1}))
   +fade(gE,T(cE('E'),ex,ey-10,40))+fade(gA,T('A',ax+22,ay+20,38,{color:MX.E}))
   +panel(label('① ガウスの法則',640,125,{size:24,color:MX.ink})+rows));
 },
 // 19 (50) the sign conventions: signed Q of the left plate, I positive into it, Φ_E positive to the right
 'mx6-n-sign':(p,ctx)=>{
  const Q=Qr(ctx,8.5,8.7),gQ=on(ctx,'Q は'),gPM=on(ctx,'プラスにも'),gI=on(ctx,'電流 I'),gF=on(ctx,'電気束も');
  const [ix,iy]=Pv(1,PL-60,WY),[qx,qy]=Pv(1,PL-4,PB);
  return ch6(ctx,p,zoomed(ctx,Q,{box:.35})
   +fade(gQ,`<rect x="${qx-18}" y="${Pv(1,0,PT-12)[1]}" width="34" height="${(PB-PT+24)*1.45}" rx="8" fill="none" stroke="${MX.hi}" stroke-width="3"/>`)+fade(gQ,T('Q',qx-40,qy+50,36,{color:MX.hi}))
   +fade(gI,arrow(ix-120,iy-34,ix+10,iy-34,{color:MX.I,w:5,head:16})+T(cI('I'),ix-60,iy-52,38))
   +fade(gF,arrow(282,104,392,104,{color:MX.E,w:5,head:14})+T(cE('\\Phi_E'),262,112,32,{anchor:'end'}))
   +panel(T(`\\varepsilon_0\\,${cE('\\Phi_E')}=Q`,895,160,40)
    +label('Q：左の板の電荷',640,245,{size:26,color:MX.hi,weight:700,opacity:gQ})
    +label('＋にも −にもなれる',670,285,{size:24,color:MX.ink,opacity:gPM})
    +label('I：板へ流れ込む右向きが 正',640,365,{size:26,color:MX.I,weight:700,opacity:gI})
    +label('電気束：右へ抜ける向きが 正',640,440,{size:26,color:MX.E,weight:700,opacity:gF})));
 },
 // 20 (51) charge conservation → the plate's charge grows only by what flows in; average current
 'mx6-n-rate':(p,ctx)=>{
  const Q=Qr(ctx,8.7,9),gC=on(ctx,'生まれも'),gD=on(ctx,'Δt の間'),gT=on(ctx,'割ると'),gA=on(ctx,'平均の電流');
  const s=36,num1='Q(t+\\Delta t)',num2='Q(t)',w1=Tw(num1,s),wm=Tw('-',s),w2=Tw(num2,s),W=w1+wm+w2+20,xs=790;
  const frac=T('\\bar I=',xs-8,350,40,{anchor:'end'})+T(num1,xs+6,322,s,{anchor:'start'})+T('-',xs+6+w1+10,322,s,{anchor:'start'})+T(num2,xs+6+w1+wm+20,322,s,{anchor:'start'})
   +fade(gT,line(xs,340,xs+W+12,340,{color:MX.ink,w:2.5})+T('\\Delta t',xs+(W+12)/2,388,s));
  return ch6(ctx,p,zoomed(ctx,Q)+graphQ({g:t0(ctx,.6),sec:gD,sg:gA})
   +panel(T(`\\varepsilon_0\\,${cE('\\Phi_E')}=Q`,895,140,32,{opacity:.6})
    +label('電荷の保存（実験で確かめられた法則）',640,195,{size:22,color:MX.ink,opacity:gC})
    +label('増えるのは 流れ込んだ分だけ',640,232,{size:24,color:MX.I,weight:700,opacity:gC})
    +fade(gD,frac+label('後',xs+6+w1/2,284,{size:24,color:MX.hi,anchor:'middle',weight:700})+label('前',xs+6+w1+wm+20+w2/2,284,{size:24,color:MX.hi,anchor:'middle',weight:700}))
    +label('Ī：Δt の間の 平均の電流',640,462,{size:24,color:MX.hi,weight:700,opacity:gA})));
 },
 // 21 (51) Q(t) means "the charge at time t", not Q × t: the height of the graph at t
 'mx6-n-qt':(p,ctx)=>{
  const gB=on(ctx,'Q かっこ t'),gX=on(ctx,'Q かける t'),gG=on(ctx,'グラフでは');
  const s=36,num1='Q(t+\\Delta t)',num2='Q(t)',w1=Tw(num1,s),wm=Tw('-',s),w2=Tw(num2,s),W=w1+wm+w2+20,xs=790,xq=xs+6+w1+wm+20;
  const frac=T('\\bar I=',xs-8,350,40,{anchor:'end'})+T(num1,xs+6,322,s,{anchor:'start'})+T('-',xs+6+w1+10,322,s,{anchor:'start'})+T(num2,xq,322,s,{anchor:'start'})
   +line(xs,340,xs+W+12,340,{color:MX.ink,w:2.5})+T('\\Delta t',xs+(W+12)/2,388,s);
  return ch6(ctx,p,zoomed(ctx,9)+graphQ({sec:1-gG*.7,br:1-gG,qt:gG,sg:1-gB})
   +panel(T(`\\varepsilon_0\\,${cE('\\Phi_E')}=Q`,895,140,32,{opacity:.6})+fade(mix(1,.6,gB),frac)+box(xq-8,322-40,w2+16,56,gB)
    +label('Q(t)：時刻 t での電荷',640,200,{size:26,color:MX.hi,weight:700,opacity:gB})
    +label('Q × t ではない',640,462,{size:26,color:MX.plus,weight:700,opacity:gX})));
 },
 // 22 (50) write ε0 Φ_E = Q at two times: after (t+Δt) and before (t)
 'mx6-n-two':(p,ctx)=>{
  const g1=on(ctx,'時刻 t と'),g2=on(ctx,'少し後'),gL=on(ctx,'ガウスの法則');
  const yl=T(`Q=\\varepsilon_0${cE('\\Phi_E')}`,GX+14,GY-GH-20,28,{anchor:'start'});
  const row=(l,r,y,g,tag)=>fade(g,T(l,900,y,34,{anchor:'end'})+T(`=${r}`,906,y,34,{anchor:'start'})+label(tag,630,y+2,{size:24,color:MX.hi,weight:700}));
  return ch6(ctx,p,zoomed(ctx,9)+graphQ({ylab:fade(gL,yl)+fade(1-gL,T('Q',GX-30,GY-GH-18,30)),br:0,sg:0})
   +panel(fade(1-gL,T(`\\varepsilon_0\\,${cE('\\Phi_E')}=Q`,895,140,32,{opacity:.6}))
    +fade(gL,label('ガウスの法則 × ε₀ を 二つの時刻で',640,140,{size:24,color:MX.ink}))
    +row(`\\varepsilon_0\\,${cF('(t+\\Delta t)')}`,'Q(t+\\Delta t)',230,g2,'後')
    +row(`\\varepsilon_0\\,${cF('(t)')}`,'Q(t)',320,g1,'前')));
 },
 // 23 (50) subtract, factor ε0 out, divide by Δt: the right side is the average current
 'mx6-n-sub':(p,ctx)=>{
  const gS=on(ctx,'引き'),gK=on(ctx,'くくります'),gD=on(ctx,'割ると'),gA=on(ctx,'平均の電流');
  const e0=gK>0?cH('\\varepsilon_0'):'\\varepsilon_0';
  const r3=`${e0}\\left[${cF('(t+\\Delta t)')}-${cF('(t)')}\\right]=Q(t+\\Delta t)-Q(t)`;
  const r4=`\\varepsilon_0\\dfrac{${cF('(t+\\Delta t)')}-${cF('(t)')}}{\\Delta t}=${gA>0?cH('\\bar I'):'\\bar I'}`;
  const row=(l,r,y)=>T(l,900,y,28,{anchor:'end'})+T(`=${r}`,906,y,28,{anchor:'start'});
  return ch6(ctx,p,zoomed(ctx,9)+graphQ({ylab:T(`Q=\\varepsilon_0${cE('\\Phi_E')}`,GX+14,GY-GH-20,28,{anchor:'start'}),sg:gA})
   +panel(fade(mix(1,.5,gS),row(`\\varepsilon_0\\,${cF('(t+\\Delta t)')}`,'Q(t+\\Delta t)',135)+row(`\\varepsilon_0\\,${cF('(t)')}`,'Q(t)',185))
    +label('上 − 下',640,240,{size:24,color:MX.hi,weight:700,opacity:gS})
    +fade(gS,fit(r3,895,290,540,30))
    +label('両辺 ÷ Δt',640,365,{size:24,color:MX.hi,weight:700,opacity:gD})
    +fade(gD,fit(r4,895,430,540,34))));
 },
 // 24 (50, 51) Δt → 0: left → rate of change of Φ_E, right → the current at that instant
 'mx6-n-dt':(p,ctx)=>{
  const gS=on(ctx,'Δt を短く'),dtv=mix(.3,.012,smooth(clamp((ctx.t-at(ctx,'Δt を短く'))/Math.max(.6,at(ctx,'右側は')-at(ctx,'Δt を短く'))))),gL=on(ctx,'左側は'),gR=on(ctx,'右側は'),gF=on(ctx,'電流 I は');
  const r4=`\\varepsilon_0\\dfrac{${cF('(t+\\Delta t)')}-${cF('(t)')}}{\\Delta t}=\\bar I`;
  const r5l=`\\varepsilon_0\\dfrac{d${cE('\\Phi_E')}}{dt}`;
  return ch6(ctx,p,zoomed(ctx,9.2)+graphQ({dt:dtv,br:clamp(1-2*gS),ylab:T(`Q=\\varepsilon_0${cE('\\Phi_E')}`,GX+14,GY-GH-20,28,{anchor:'start'}),slope:gR>.5?'その瞬間の電流':'平均の電流'})
   +panel(fade(mix(1,.45,gL),fit(r4,895,150,540,34))
    +label('Δt → 0',640,245,{size:26,color:MX.hi,weight:700,opacity:gS})
    +fade(gL,T(r5l,890,300,36,{anchor:'end'}))+fade(gR,T('=I(t)',896,300,36,{anchor:'start'}))
    +label('その瞬間の 変化の速さ',640,365,{size:22,color:MX.E,opacity:gL*(1-gF)})+label('その瞬間の 電流',900,365,{size:22,color:MX.I,opacity:gR*(1-gF)})
    +box(770,392,250,90,gF)+fade(gF,T(`${cI('I')}=\\varepsilon_0\\dfrac{d${cE('\\Phi_E')}}{dt}`,895,450,38))));
 },
 // 25 back to the loop: through the wire I, through the gap ε0 dΦ_E/dt — equal (ding)
 'mx6-n-equal':(p,ctx)=>{
  const u=1-smooth(clamp(ctx.t/1.1)),Q=Qr(ctx,9.2,10),gA=on(ctx,'電線を通る膜'),gB=on(ctx,'すき間を通る膜'),gC=on(ctx,'ぴったり'),L=220;
  const bars=label('電線の膜',680,120,{size:24,color:MX.I,weight:700})+`<rect x="810" y="100" width="${(L*gA).toFixed(1)}" height="28" rx="6" fill="${MX.I}"/>`+fade(gA,T(cI('I'),1040,124,32,{anchor:'start'}))
   +fade(gB,label('すき間の膜',680,170,{size:24,color:MX.hi,weight:700}))+`<rect x="810" y="150" width="${(L*gB).toFixed(1)}" height="28" rx="6" fill="${MX.E}"/>`
   +fade(gB,T(`\\varepsilon_0\\,d${cE('\\Phi_E')}/dt`,1040,174,26,{anchor:'start'}))
   +fade(gC,line(810+L,92,810+L,186,{color:MX.hi,w:3,dash:'6 5'}))+tick(1150,140,gC);
  const pic=fade(1-u,loopBack()+membrane(0,.4+.6*gA*(1-gB*.6),{col:MX.I,fo:.2})+membrane(1,.4+.6*gB,{col:MX.hi}))+circuit(ctx,{Q,E:1,bat:1-u})
   +fade(1-u,loopFront()+bAround(ctx,1)+pierce(0,gA)+capPierce(Q,gB));
  return ch6(ctx,p,view(u,pic)+graphQ({g:1-t0(ctx,.5),dt:.012,br:0,sg:0})+panel('',u)
   +ampBox(T(`${cI('I')}=\\varepsilon_0\\dfrac{d${cE('\\Phi_E')}}{dt}`,300,146,38),1-u)
   +callout(660,88,520,108,bars,gA));
 },
 // 26 (52) replacing the current by the new term fails on the flat membrane
 'mx6-n-replace':(p,ctx)=>{
  const Q=Qr(ctx,10,10.3),gR=on(ctx,'置きかえ'),g1=on(ctx,'平らな膜'),gZ=on(ctx,'ほぼゼロ');
  const tbl=label('平らな膜',630,130,{size:26,color:MX.I,weight:700})+T('\\approx 0',790,132,32,{anchor:'start'})+fade(gZ,T(`\\ne\\mu_0 ${cI('I')}`,880,132,32,{anchor:'start',color:MX.plus}))
   +label('すき間の膜',630,180,{size:26,color:MX.hi,weight:700})+T(`\\mu_0\\varepsilon_0\\,d${cE('\\Phi_E')}/dt`,790,182,26,{anchor:'start'})+tick(1150,172,g1);
  return ch6(ctx,p,loopScene(ctx,{Q,E:1,bAg:1,mem:[[0,.4+.5*g1,{col:MX.I,fo:.2}],[1,.6,{col:MX.hi}]]})+pierce(0,g1)
   +ampBox(ampere(70,154,{size:36,L:.35,R:1,rhs:`\\mu_0 ${cI('I')}`,rhs2:`\\mu_0\\varepsilon_0\\,d${cE('\\Phi_E')}/dt`,mix2:gR,hiR:gR}))
   +word('置きかえ？',400,236,{size:24,color:MX.hi,g:gR*(1-g1)})
   +callout(600,88,580,108,tbl,g1)+label('✕',1150,142,{size:38,color:MX.plus,anchor:'middle',weight:700,opacity:gZ}));
 },
 // 27 (52) a membrane can carry both; test whether the SUM is membrane-independent
 'mx6-n-sum':(p,ctx)=>{
  const Q=Qr(ctx,10.3,10.6),gB=on(ctx,'両方が'),gS=on(ctx,'足した合計');
  const rhs=`\\mu_0 ${cI('I')}+\\mu_0\\varepsilon_0\\,d${cE('\\Phi_E')}/dt`;
  const lines=label('どの膜でも、両方を数える',630,130,{size:26,color:MX.ink,weight:700})
   +fade(gB,label('電流',630,178,{size:24,color:MX.I,weight:700})+label('＋',700,178,{size:24,color:MX.ink})+label('電場の変化',740,178,{size:24,color:MX.E,weight:700}));
  return ch6(ctx,p,loopScene(ctx,{Q,E:1,bAg:1,mem:[[0,.6,{col:MX.I,fo:.2}],[1,.6,{col:MX.hi}]]})+pierce(0)+capPierce(Q,1)
   +ampBox(ampere(70,154,{size:32,L:.35,R:1,rhs,hiR:gS}))
   +callout(600,88,580,108,lines,gB)
   +word('合計は 膜によらない？',900,258,{anchor:'middle',size:26,color:MX.hi,g:gS}));
 },
 // 28 (52) the two membranes form a bag around the left plate: conservation + Gauss
 'mx6-n-cons':(p,ctx)=>{
  const Q=Qr(ctx,10.6,10.9),gBag=on(ctx,'閉じた袋',.8),gIn=on(ctx,'流れ込んだ電流'),gG=on(ctx,'ガウスの法則で');
  const rows=T(`${cI('I_1')}-${cI('I_2')}=\\dfrac{dQ}{dt}`,665,150,30,{anchor:'start'})+label('電荷の保存',1165,150,{size:22,color:MX.I,anchor:'end',weight:700});
  const rows2=T(`\\varepsilon_0\\left(${cE('\\Phi_2')}-${cE('\\Phi_1')}\\right)=Q`,665,240,30,{anchor:'start'})+label('ガウスの法則',1165,240,{size:22,color:MX.E,anchor:'end',weight:700});
  const col=MX.good;
  return ch6(ctx,p,loopBack()+membrane(0,1,{col:mix(0,1,gBag)>.5?col:MX.I,fo:.22})+membrane(1,1,{col:gBag>.5?col:MX.hi,fo:.16})+circuit(ctx,{Q,E:1})+loopFront()+bAround(ctx,.5)+pierce(0)
   +word('膜1',300,440,{anchor:'middle',size:24,color:MX.I})+word('膜2',630,140,{anchor:'end',size:24,color:MX.hi})
   +fade(gBag,arrow(290,258,215,258,{color:col,w:4,head:12})+label('外向き（正と逆）',205,266,{size:22,color:col,anchor:'end'})
    +arrow(606,418,682,418,{color:col,w:4,head:12})+label('外向き',690,426,{size:22,color:col}))
   +word('閉じた袋',200,160,{size:26,color:col,g:gBag})
   +callout(640,88,540,210,fade(gIn,rows)+fade(gG,rows2),gIn));
 },
 // 29 (52) subtract: the sum I + ε0 dΦ/dt is the same for both membranes
 'mx6-n-cancel':(p,ctx)=>{
  const Q=Qr(ctx,10.9,11),g=t0(ctx,.6),g2=t0(ctx,1.2),g3=on(ctx,'ちょうど補い'),gB=on(ctx,'合計は'),gU=on(ctx,'使ったのは');
  const r1=`${cI('I_1')}-${cI('I_2')}=\\dfrac{dQ}{dt}`;
  const r2=`\\varepsilon_0\\dfrac{d${cE('\\Phi_2')}}{dt}-\\varepsilon_0\\dfrac{d${cE('\\Phi_1')}}{dt}=\\dfrac{dQ}{dt}`;
  const L3=`${cI('I_1')}+\\varepsilon_0\\dfrac{d${cE('\\Phi_1')}}{dt}`,R3=`${cI('I_2')}+\\varepsilon_0\\dfrac{d${cE('\\Phi_2')}}{dt}`,s=34,wl=Tw(L3,s),we=Tw('=',s)+16,wr=Tw(R3,s),x0=700-(wl+we+wr)/2;
  const inner=label('電荷の保存',170,172,{size:24,color:gU>0?MX.hi:MX.I,weight:700})+T(r1,700,172,32)
   +fade(g2,label('ガウスの式の',170,262,{size:24,color:gU>0?MX.hi:MX.E,weight:700})+label('変化の速さ',170,294,{size:24,color:gU>0?MX.hi:MX.E,weight:700})+T(r2,700,275,32))
   +fade(g3,label('並べかえ',170,400,{size:24,color:MX.ink,weight:700})+T(L3,x0,400,s,{anchor:'start'})+T('=',x0+wl+8,400,s,{anchor:'start'})+T(R3,x0+wl+we,400,s,{anchor:'start'}))
   +box(x0-12,350,wl+we+wr+24,84,gB)
   +label('膜1の合計',x0+wl/2,478,{size:24,color:MX.I,anchor:'middle',weight:700,opacity:gB})+label('膜2の合計',x0+wl+we+wr/2,478,{size:24,color:MX.hi,anchor:'middle',weight:700,opacity:gB});
  return ch6(ctx,p,loopBack()+membrane(0,1,{col:MX.good,fo:.22})+membrane(1,1,{col:MX.good,fo:.16})+circuit(ctx,{Q,E:1})+loopFront()+pierce(0)+overlay(g,inner));
 },
 // 30 Maxwell adds μ0 × this term; the table (idealized circuit) shows both membranes agree
 'mx6-n-complete':(p,ctx)=>{
  const Q=Qr(ctx,11,11.3),gT=on(ctx,'この項',.6),gK=on(ctx,'どの膜');
  return ch6(ctx,p,completeScene(ctx,{Q,gT,gK}));
 },
 // 31 (53) the two zeros belong to the idealized circuit; in general both terms are added
 'mx6-n-general':(p,ctx)=>{
  const Q=Qr(ctx,11.3,11.5),gZ=on(ctx,'二つのゼロ'),gG=on(ctx,'一般には');
  return ch6(ctx,p,completeScene(ctx,{Q,gZ,gG}));
 },
 // 32 a consistency argument, later confirmed by experiment
 'mx6-n-check':(p,ctx)=>{
  const g=t0(ctx,.6),Q=Qr(ctx,11.5,11.7);
  const inner=T(`\\mu_0\\varepsilon_0\\dfrac{d${cE('\\Phi_E')}}{dt}`,600,175,44)
   +causal('理屈からの予想','実験で確認',600,285,{ca:MX.hi,cb:MX.good,size:32,g:on(ctx,'理屈')})
   +word('ヘルツ（1888年）',600,375,{anchor:'middle',size:28,g:on(ctx,'ヘルツ')})
   +word('予言された 波を とらえた',600,455,{anchor:'middle',size:28,color:MX.good,g:on(ctx,'波を')});
  return ch6(ctx,p,loopScene(ctx,{Q,E:1,bAg:1,mem:[[0,.5,{col:MX.I,fo:.18}],[1,.5,{col:MX.hi}]]})+overlay(g,inner));
 },
 // 33 (54) "displacement current" is the name of the term; no electron crosses the gap
 'mx6-n-name':(p,ctx)=>{
  const g=1-t0(ctx,.6),gN=on(ctx,'変位電流'),gR=on(ctx,'同じ役割'),gX=on(ctx,'電子が渡る'),gE=on(ctx,'変化する電場'),Q=Qr(ctx,11.7,11.9);
  const u=clamp((sceneT(ctx)*.6)%1),ex=mix(PL+16,PR-16,u);
  const inner=T(`\\varepsilon_0\\dfrac{d${cE('\\Phi_E')}}{dt}`,700,152,36)+label('＝ 変位電流',780,162,{size:30,color:MX.hi,weight:700,opacity:gN})
   +label('この式で 電流と同じ役割をする項の 名前',630,222,{size:22,color:MX.ink,opacity:gR});
  const glowE=fade(gE*(.5+.5*Math.sin(ctx.t*5)),`<rect x="${PL+12}" y="${PT}" width="${PR-PL-24}" height="${PB-PT}" rx="6" fill="${MX.E}" fill-opacity=".16" stroke="${MX.E}" stroke-width="3"/>`);
  const elec=fade(gX*(1-gE*.5),`<circle cx="${ex}" cy="300" r="10" fill="${MX.minus}"/>`+line(ex-5,300,ex+5,300,{color:'#fff',w:2})
   +line(PL+10,272,PR-10,328,{color:MX.plus,w:6})+line(PL+10,328,PR-10,272,{color:MX.plus,w:6}));
  return ch6(ctx,p,fade(mix(1,.45,1-g),loopBack()+membrane(0,.5,{col:MX.I,fo:.18})+membrane(1,.5))+circuit(ctx,{Q,E:1})+fade(mix(1,.45,1-g),loopFront()+bAround(ctx,1))
   +glowE+elec+callout(600,88,580,160,inner,1-g)
   +word('電子は すき間を渡らない',668,372,{size:24,color:MX.plus,g:gX})
   +word('あるのは 変化する電場',668,432,{size:24,color:MX.E,g:gE}));
 },
 // 34 a changing E makes B too: B circles the gap like it circles the wire
 'mx6-n-four':(p,ctx)=>{
  const g=1-t0(ctx,.6),gB=on(ctx,'磁場を作る',.6,-.3),Q=Qr(ctx,11.9,12),ph=-sceneT(ctx)*.9;
  return ch6(ctx,p,chevrons(600,WY,34,135,ph,{n:12,size:13,g:gB,front:false,dir:-1})+fade(gB*.6,`<path d="${arc(600,WY,34,135,false)}" fill="none" stroke="${MX.B}" stroke-width="2" stroke-dasharray="6 6"/>`)
   +loopBack()+circuit(ctx,{Q,E:1})+loopFront()+bAround(ctx,1)
   +fade(gB,`<path d="${arc(600,WY,34,135,true)}" fill="none" stroke="${MX.B}" stroke-width="3"/>`)+chevrons(600,WY,34,135,ph,{n:12,size:13,g:gB,back:false,dir:-1})
   +overlay(g)
   +causal('電場の変化','磁場',900,170,{ca:MX.E,cb:MX.B,size:34,g:clamp(ctx.t/.5)})+word('4つの式が そろった',900,440,{size:30,color:MX.hi,anchor:'middle',g:on(ctx,'四つの式')}));
 },
 // 35 the two changes feed each other: what happens?
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
