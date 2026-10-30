// Diagrams for the v3 (deep mode) Maxwell film, part p01 (chapter 0 "今日の謎" and chapter 1 "電気の力").
// Keys: 'mx0-n-*' / 'mx1-n-*'. Stage 1200×515; the compact progress bar uses y 0–72.
// Timing: an element appears when the narration reaches the phrase that names it (T/G below,
// same convention as mxA-diagrams.mjs: phrase position in the subtitle → voiced time).
import {MX,C,clamp,mix,smooth,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,bg,word,callout,causal,EQ,fit,stage,charge,evidenceCard} from './mx-common.mjs';

// ---- timing ---------------------------------------------------------------------------------
const VE=ctx=>Math.max(.6,(ctx?.dur??4)-(ctx?.cue?.pause??0)-.12);
function T(ctx,s,k=0){const sub=ctx?.cue?.subtitle??'';let i=-1;for(let j=0,f=0;j<=k;j++){i=sub.indexOf(s,f);if(i<0)break;f=i+1;}
 if(i<0)throw Error(`mx2-p01: phrase "${s}" not in subtitle: ${sub}`);return VE(ctx)*i/sub.length;}
const G=(ctx,s,{d=.45,k=0,off=-.15}={})=>smooth((ctx.t-T(ctx,s,k)-off)/d);
const since=(ctx,s,k=0)=>ctx.t-T(ctx,s,k);
const pulse=(t,k=0)=>.5+.5*Math.sin(t*5+k);

// ---- small pieces ---------------------------------------------------------------------------
const FORCE=C.F,RC='#c3a8ff',HAIR='#5a3e2b',SKIN='#c9a88a',SHEET='#b9c7e0';
const tx=(src,x,y,size,color=MX.ink,opacity=1)=>tex(src,x,y,{size,color,anchor:'middle',auto:false,opacity});
function sine(x0,x1,y,amp,lam,phase,{color=MX.hi,w=4,front=x1,opacity=1}={}){const xe=Math.min(x1,front);if(xe<=x0+2)return '';const pts=[];for(let x=x0;x<=xe;x+=3)pts.push([x,y-amp*Math.sin(2*Math.PI*(x-x0)/lam-phase)]);return draw(pts,1,{color,w,opacity});}
function along(pts,u){let L=0;const d=[];for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(s);L+=s;}
 let want=L*u;for(let i=1;i<pts.length;i++){if(d[i-1]>=want||i===pts.length-1){const k=d[i-1]?clamp(want/d[i-1]):0;return {x:mix(pts[i-1][0],pts[i][0],k),y:mix(pts[i-1][1],pts[i][1],k)};}want-=d[i-1];}
 return {x:pts[0][0],y:pts[0][1]};}
function phone(x,y){return rect(x-34,y-56,68,112,{fill:'#1a2540',fo:1,stroke:'#c9d3e6',sw:3,rx:12})+rect(x-26,y-44,52,80,{fill:MX.E,fo:.25,stroke:'none',sw:0,rx:4})+dot(x,y+46,4,'#c9d3e6');}
function oven(x,y){return rect(x-62,y-44,124,88,{fill:'#1a2540',fo:1,stroke:'#c9d3e6',sw:3,rx:8})+rect(x-52,y-34,76,68,{fill:'#2a3854',fo:1,stroke:'#8d9cb8',sw:2,rx:4})+ring(x+42,y-16,7,{color:'#c9d3e6',w:2})+ring(x+42,y+12,7,{color:'#c9d3e6',w:2});}
function lamp(x,y){let s=dot(x,y,24,MX.hi);for(let k=0;k<8;k++){const a=k*Math.PI/4;s+=line(x+32*Math.cos(a),y+32*Math.sin(a),x+44*Math.cos(a),y+44*Math.sin(a),{color:MX.hi,w:4});}return s;}
function eye(x,y){return `<path d="M${x-40} ${y} Q${x} ${y-32} ${x+40} ${y} Q${x} ${y+32} ${x-40} ${y} Z" fill="#eef3fb" stroke="#c9d3e6" stroke-width="3"/>`+dot(x,y,13,'#5b8cff')+dot(x,y,6,'#0d1526');}
// Hidden constant badge (the ε₀ / μ₀ slot of evidenceCard, name not yet told).
function hiddenBadge(side,x0,y0,{g=1,glow=0}={}){const col=side?MX.B:MX.E,cx=x0+235,cy=y0+252;
 return fade(g,(glow>0?`<circle cx="${cx}" cy="${cy}" r="${44+6*glow}" fill="${col}" fill-opacity="${.12*glow}"/>`:'')+ring(cx,cy,34,{color:col,w:4,fill:'#0d1526'})+label('？',cx,cy+13,{size:36,color:col,anchor:'middle',weight:700}));}
const bracketDown=(x1,x2,y,g=1,color=MX.hi)=>fade(g,`<path d="M${x1} ${y-20} Q${x1} ${y} ${x1+30} ${y} L${(x1+x2)/2-30} ${y} Q${(x1+x2)/2} ${y} ${(x1+x2)/2} ${y+22} Q${(x1+x2)/2} ${y} ${(x1+x2)/2+30} ${y} L${x2-30} ${y} Q${x2} ${y} ${x2} ${y-20}" fill="none" stroke="${color}" stroke-width="4"/>`);
// The compact progress bar alone (what stage() adds on top for compactBar cues).
const barOnly=(ctx,p)=>stage(ctx,p,'').slice(bg().length);

// ---- chapter 0: the four equations in a 2×2 grid ----------------------------------------------
const EQPOS=[[315,245],[885,245],[315,385],[885,385]];
const plainEq=i=>EQ[i+1].tex.replace(/\\color\{[^}]*\}/g,'');

// ---- chapter 1: the rubbed hair and the sheet -------------------------------------------------
const HX=330,HY=430,HR=85;
// lift: sheet height 0..1; rise: hair tips 0..1; rub: sideways offset of the sheet.
function hairScene({lift=0,rise=0,rub=0,signs=0,g=1}={}){
 const sy=mix(HY-HR-12,HY-HR-150,lift),sx=HX+rub;
 let s=`<circle cx="${HX}" cy="${HY}" r="${HR}" fill="${SKIN}"/>`;
 for(let k=0;k<17;k++){const th=(-72+9*k)*Math.PI/180,bx=HX+HR*Math.sin(th),by=HY-HR*Math.cos(th),sg=Math.sign(th)||1;
  const rest=[bx+36*Math.sin(th+.9*sg),by-36*Math.cos(th+.9*sg)],up=[mix(bx,sx+(bx-HX)*.6,.55),sy+14+Math.abs(bx-HX)*.3];
  const tip=[mix(rest[0],up[0],rise),mix(rest[1],up[1],rise)],mid=[mix(bx,tip[0],.5)+(1-rise)*6*Math.sin(th),mix(by,tip[1],.5)];
  s+=`<path d="M${bx.toFixed(1)} ${by.toFixed(1)} Q${mid[0].toFixed(1)} ${mid[1].toFixed(1)} ${tip[0].toFixed(1)} ${tip[1].toFixed(1)}" fill="none" stroke="${HAIR}" stroke-width="5" stroke-linecap="round"/>`;
  if(k%4===1)s+=fade(signs,label('+',bx+(tip[0]-bx)*.45,by+(tip[1]-by)*.45+9,{size:28,color:MX.plus,anchor:'middle',weight:700}));}
 s+=rect(sx-150,sy-26,300,26,{fill:SHEET,fo:.5,stroke:'#dfe6f2',sw:2,rx:5});
 s+=fade(signs,[-110,-55,0,55,110].map(d=>label('−',sx+d,sy-4,{size:30,color:MX.minus,anchor:'middle',weight:700})).join(''));
 return fade(g,s);
}
// The magnified view: sheet block (top) and hair block (bottom) with + and − charges.
const BK={x0:790,x1:1130,sy:165,hy:425},PX=[830,910,990,1070];
function blocks(u,{g=1,hiE=0,hiP=0,t=0}={}){
 let s=callout(650,92,520,414,'',g);
 const blk=(y,name)=>rect(BK.x0,y-45,BK.x1-BK.x0,90,{fill:name==='下敷き'?SHEET:SKIN,fo:.22,stroke:name==='下敷き'?'#dfe6f2':'#d9b89a',sw:2,rx:10})+label(name,720,y+9,{size:26,color:MX.ink,anchor:'middle',weight:700});
 s+=fade(g,blk(BK.sy,'下敷き')+blk(BK.hy,'髪'));
 const pl=y=>PX.map(x=>charge(x,y-20,1,{r:14,g})).join('');
 s+=pl(BK.sy)+pl(BK.hy);
 if(hiP>0)s+=PX.map(x=>fade(hiP*g*pulse(t),ring(x,BK.hy-20,20,{color:MX.hi,w:3}))).join('');
 const el=(x,y)=>charge(x,y,-1,{r:14,g})+(hiE>0?fade(hiE*g*pulse(t),ring(x,y,20,{color:MX.hi,w:3})):'');
 PX.forEach(x=>{s+=el(x,BK.sy+22);});
 PX.forEach((x,i)=>{if(i===1||i===3){const to=[i===1?870:1030,BK.sy+22],from=[x,BK.hy+22];const e=smooth(u);s+=el(mix(from[0],to[0],e),mix(from[1],to[1],e));}else s+=el(x,BK.hy+22);});
 return s;
}

// ---- chapter 1: two charges on a line --------------------------------------------------------
const PY=230;
// Force length ∝ q1·q2/r²; F0 is the length for q1=q2=1 at distance `unit`.
function pair({x1=380,x2=680,q1=1,q2=1,unit=300,F0=80,g=1,g1=1,g2=1,ga=1,amt=0,amtHi1=0,amtHi2=0,dimR=0,t=0}={}){
 const r=x2-x1,L=F0*q1*q2*(unit/r)**2,r1=24+8*(q1-1),r2=24+8*(q2-1);
 let s='';
 const one=(x,q,rr,gg)=>fade(gg,charge(x,PY,1,{r:rr}));
 s+=one(x1,q1,r1,g1)+one(x2,q2,r2,g2*(1-.5*dimR));
 if(L>3){const h=Math.min(20,L*.7);s+=fade(ga,arrow(x1-r1-4,PY,x1-r1-4-L,PY,{color:FORCE,w:7,head:h})+fade(1-.5*dimR,arrow(x2+r2+4,PY,x2+r2+4+L,PY,{color:FORCE,w:7,head:h})));}
 if(amt>0){const b=(x,q,hi,gg)=>{const n=q>1.5?'2':'1';return fade(amt*gg,(hi>0?`<rect x="${x-34}" y="${PY+44}" width="68" height="46" rx="10" fill="${MX.hi}" fill-opacity="${.12*hi}" stroke="${MX.hi}" stroke-opacity="${hi}" stroke-width="2"/>`:'')+label(n,x,PY+79,{size:34,color:MX.plus,anchor:'middle',weight:700}));};
  s+=b(x1,q1,amtHi1,g1)+b(x2,q2,amtHi2,g2*(1-.5*dimR));}
 return fade(g,s);
}
const ruler=(x1,x2,y,g=1,text='距離',color=RC)=>fade(g,line(x1,y,x2,y,{color:MX.dim,w:3})+line(x1,y-12,x1,y+12,{color:MX.dim,w:3})+line(x2,y-12,x2,y+12,{color:MX.dim,w:3})+(text?label(text,(x1+x2)/2,y+40,{size:26,color,anchor:'middle',weight:700}):''));

// Coulomb's law laid out piece by piece (so each symbol can fly in from the picture).
function coulombLayout(cx,y,size){
 const wA=texWidth('F=',size,false),wK=texWidth('k',size,false),wN=texWidth('qQ',size,false),wD=texWidth('r^2',size,false),fw=Math.max(wN,wD)+size*.3,gap=size*.18,W=wA+gap+wK+gap+fw,x0=cx-W/2;
 const xk=x0+wA+gap+wK/2,xf=x0+wA+gap*2+wK+fw/2;
 return {size,y,xF:x0+wA*.25,xEq:x0+wA*.72,xk,xf,fw,xq:xf-wN*.22,xQ:xf+wN*.22,yN:y-size*.62,yD:y+size*.5,left:x0,right:x0+W};
}
// u*: 0 = symbol still at its place in the picture, 1 = in the formula. from*: picture positions.
function coulombFly(L,{uq=1,uQ=1,ur=1,gk=1,uF=1,gEq=1,from={},dim=0}={}){
 const {size,y}=L,o=1-.6*dim;
 const fly=(src,u,pos,x,yy,color,fs=36)=>{if(u>=1||!pos)return tx(src,x,yy,size,color);if(u<=0)return '';const e=smooth(u),[fx,fy]=pos;return fade(clamp(u*5),tx(src,mix(fx,x,e),mix(fy,yy,e),mix(fs,size,e),color));};
 const wR=texWidth('r',size,false),wD=texWidth('r^2',size,false),xr=L.xf-wD/2+wR/2,gsq=smooth((ur-.8)/.2);
 let s='';
 s+=fly('q',uq,from.q,L.xq,L.yN,MX.plus)+fly('Q',uQ,from.Q,L.xQ,L.yN,MX.plus);
 s+=fade(Math.max(uq,uQ)>0?smooth(Math.min(uq,uQ)):0,line(L.xf-L.fw/2,y-size*.25,L.xf+L.fw/2,y-size*.25,{color:MX.ink,w:Math.max(2.5,size*.06)}));
 s+=fade(1-gsq,fly('r',ur,from.r,xr,L.yD,RC))+fade(gsq,tx('r^2',L.xf,L.yD,size,RC));
 s+=fade(gk,tx('k',L.xk,y,size,MX.hi));
 s+=fade(gEq,tx('=',L.xEq,y,size,MX.ink))+fly('F',uF,from.F,L.xF,y,FORCE);
 return fade(o,s);
}

// ---- v3 helpers -------------------------------------------------------------------------------
const cross=(x,y,s,g,color=MX.plus)=>fade(g,line(x-s,y-s,x+s,y+s,{color,w:9})+line(x-s,y+s,x+s,y-s,{color,w:9}));
function sun(x,y){let s=dot(x,y,24,MX.hi);for(let k=0;k<8;k++){const a=k*Math.PI/4;s+=line(x+32*Math.cos(a),y+32*Math.sin(a),x+42*Math.cos(a),y+42*Math.sin(a),{color:MX.hi,w:4});}return s;}
// Maxwell's portrait (same drawing as mx0-maxwell), scaled around (x,y).
function portrait(x,y,sc,g){const X=280,Y=290;
 return fade(g,`<g transform="translate(${x} ${y}) scale(${sc}) translate(${-X} ${-Y})"><defs><clipPath id="mxpc3"><ellipse cx="${X}" cy="${Y}" rx="150" ry="195"/></clipPath></defs><ellipse cx="${X}" cy="${Y}" rx="150" ry="195" fill="#d9ceb4"/>`
  +`<g clip-path="url(#mxpc3)" fill="#2b2f3a"><ellipse cx="${X}" cy="${Y+205}" rx="150" ry="110"/><ellipse cx="${X}" cy="${Y-70}" rx="66" ry="74"/><path d="M${X-62} ${Y-60} Q${X-78} ${Y+60} ${X} ${Y+92} Q${X+78} ${Y+60} ${X+62} ${Y-60} Z"/><ellipse cx="${X}" cy="${Y-118}" rx="74" ry="40"/></g>`
  +`<ellipse cx="${X}" cy="${Y}" rx="150" ry="195" fill="none" stroke="#b9a98a" stroke-width="6"/></g>`);}
// Chapter 0: the two kinds of statements (laws taken from experiment / results calculated).
function kindsScene(ctx,{gl=1,gr=1,dimL=0,glowA=0,hiLight=0}={}){
 const t=ctx.t;let s='';
 s+=fade(gl*(1-.3*dimL),callout(70,110,500,330,'',1,{stroke:MX.E})+label('実験を出発点にする法則',320,162,{size:28,color:MX.E,anchor:'middle',weight:700})
  +charge(250,245,1,{r:22})+charge(390,245,1,{r:22})+arrow(224,245,176,245,{color:FORCE,w:5,head:14})+arrow(416,245,464,245,{color:FORCE,w:5,head:14})
  +label('例：クーロンの法則（1章）',320,335,{size:26,color:MX.ink,anchor:'middle'})+label('例：電磁誘導の法則（5章）',320,390,{size:26,color:MX.ink,anchor:'middle'}));
 s+=fade(gr,arrow(574,275,626,275,{color:MX.hi,w:5,head:14})+(glowA>0?fade(glowA*pulse(t),ring(600,275,26,{color:MX.hi,w:3})):'')+label('計算',600,320,{size:24,color:MX.hi,anchor:'middle',weight:700}));
 s+=fade(gr,callout(630,110,500,330,'',1,{stroke:MX.hi})+label('そこから計算で導く結果',880,162,{size:28,color:MX.hi,anchor:'middle',weight:700})
  +tx('\\Longrightarrow',880,255,52,MX.hi)
  +label('例：電荷のまわりの電場（2章）',880,335,{size:26,color:MX.ink,anchor:'middle'}));
 s+=fade(gr,(hiLight>0?`<rect x="720" y="358" width="320" height="50" rx="12" fill="${MX.hi}" fill-opacity="${.10+.08*hiLight*pulse(t)}" stroke="${MX.hi}" stroke-opacity="${hiLight}" stroke-width="3"/>`:'')
  +label('例：光の速さ（7章）',880,390,{size:hiLight>0?mix(26,30,hiLight):26,color:hiLight>0?MX.hi:MX.ink,anchor:'middle',weight:hiLight>.5?700:400}));
 return s;
}
// Chapter 1: F against qQ/r² (arbitrary units, same scale on both axes: slope = k).
const OURS=[[1,1],[2,2],[4,4],[.5,.5],[.25,.25],[1/9,1/9]];
const MANY=[.45,.7,1.25,1.55,1.8,2.35,2.6,2.95,3.25,3.55,3.8,4.25].map((x,i)=>[x,x*(1+.035*Math.sin(i*2.3))]);
function graph({ox,oy,w,h,g=1,gOurs=1,gMany=1,gLine=1,gLeg=0,dimPts=0}={}){
 const sx=w/4.5,sy=h/4.5,P=(u,v)=>[ox+u*sx,oy-v*sy];
 let s=arrow(ox,oy,ox+w+22,oy,{color:MX.dim,w:3,head:12})+arrow(ox,oy,ox,oy-h-22,{color:MX.dim,w:3,head:12});
 s+=label('力 F',ox,oy-h-40,{size:26,color:FORCE,anchor:'middle',weight:700});
 s+=tx('\\dfrac{qQ}{r^2}',ox+w+72,oy+12,34,MX.ink);
 if(gLine>0){const [x2,y2]=P(4.4,4.4);s+=draw([[ox,oy],[x2,y2]],clamp(gLine),{color:MX.hi,w:3,opacity:.8});}
 s+=fade(gMany*(1-.4*dimPts),MANY.map(([u,v])=>{const [x,y]=P(u,v);return dot(x,y,7,'#b8c4da');}).join(''));
 s+=fade(gOurs*(1-.4*dimPts),OURS.map(([u,v])=>{const [x,y]=P(u,v);return dot(x,y,9,MX.hi)+ring(x,y,13,{color:MX.hi,w:2});}).join(''));
 s+=fade(gLeg,dot(730,340,9,MX.hi)+label('いま調べた例',750,349,{size:26,color:MX.ink})+dot(730,392,7,'#b8c4da')+label('ほかの多くの測定',750,401,{size:26,color:MX.ink}));
 return fade(g,s);
}
const GBIG={ox:170,oy:455,w:760,h:300},GSMALL={ox:70,oy:470,w:380,h:280},GMID={ox:90,oy:460,w:560,h:300};
const gmix=(a,b,e)=>({ox:mix(a.ox,b.ox,e),oy:mix(a.oy,b.oy,e),w:mix(a.w,b.w,e),h:mix(a.h,b.h,e)});
// Chapter 1: counting charges that cross a section of the wire (row A: − to the left, row B: + to the right).
function sectionScene(ctx,{uA=0,uB=0,gA=1,gB=1,gSec=1,gSame=0,gI=0,gNot=0}){
 const t=ctx.t,x0=110,x1=1090,rows=[[190,-1,uA,gA],[370,1,uB,gB]];let s='';
 rows.forEach(([y,sg,u,g])=>{
  const cnt=smooth((u-.52)/.15);
  s+=fade(g,rect(x0,y-32,x1-x0,64,{fill:'#c07a3a',fo:.18,stroke:'#c07a3a',sw:3,rx:32})+rect(600,y-30,x1-600-4,60,{fill:MX.plus,fo:.13*cnt,stroke:'none',sw:0,rx:28}));
  for(let k=0;k<9;k++){const xx=x0+50+k*112;if(Math.abs(xx-mix(sg<0?760:440,sg<0?440:760,u))<40)continue;s+=fade(.5*g,charge(xx,y+(k%2?12:-12),sg,{r:12}));}
  const xm=mix(sg<0?760:440,sg<0?440:760,u);
  s+=fade(g,charge(xm,y,sg,{r:17})+ring(xm,y,24,{color:MX.hi,w:3}));
  s+=fade(g,label(sg<0?'マイナス（電子）が 左へ':'プラスが 右へ',x0,y-46,{size:24,color:sg<0?MX.minus:MX.plus,weight:700}));
  s+=fade(g*cnt,word('右側：＋1',960,y-52,{size:26,color:MX.plus,border:MX.plus,anchor:'middle'})+(gSame>0?fade(gSame*pulse(t),`<rect x="${880}" y="${y-84}" width="160" height="48" rx="12" fill="none" stroke="${MX.hi}" stroke-width="3"/>`):''));
  s+=fade(gI,arrow(700,y+62,1000,y+62,{color:MX.I,w:7,head:20})+label('電流',1012,y+71,{size:26,color:MX.I,weight:700}));
 });
 s+=fade(gSec,line(600,122,600,444,{color:MX.ink,w:3,dash:'10 8'})+label('断面',600,112,{size:26,color:MX.ink,anchor:'middle',weight:700}));
 s+=word('電流としては 同じ',600,305,{size:28,color:MX.hi,anchor:'middle',g:gSame});
 s+=word('動く粒は 別もの',260,488,{size:26,color:MX.dim,anchor:'middle',g:gNot});
 return s;
}

export const mx2p01Diagrams={
 // ===================== chapter 0 =====================
 'mx0-n-waves':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,rows=[[165,'電波','電波',150],[300,'マイクロ波','マイクロ波',80],[435,'光','光',26]],X0=230,X1=830,V=320;
  let s='';
  rows.forEach(([y,name,key,lam],i)=>{
   const td=T(ctx,i===0?'スマホ':i===1?'電子レンジ':'目に見える')-.15,tw=T(ctx,key)-.1;
   const gd=smooth((t-td)/.4),gw=smooth((t-tw)/.4);if(gd<=0)return;
   s+=fade(gd*(1-.55*gw),i===0?phone(110,y):i===1?oven(110,y):lamp(110,y));
   s+=word(name,X0+8,y-46,{size:26,color:MX.hi,g:gw});
   if(gw>0)s+=sine(X0,X1,y,22,lam,2*Math.PI*V*(t-tw)/lam,{front:X0+V*(t-tw),color:MX.hi,w:4});
   if(i===2)s+=fade(gw,eye(880,y));});
  s+=word('真空中では',1070,170,{size:28,color:MX.ink,anchor:'middle',g:G(ctx,'真空中')});
  const ts=T(ctx,'秒速'),gs=smooth((t-ts+.15)/.4);
  if(gs>0){const u=((t-ts)*V/(X1-X0))%1,x=X0+(X1-X0)*u;
   s+=fade(gs,line(x,120,x,470,{color:MX.hi,w:2,dash:'6 6',opacity:.7})+rows.map(([y])=>dot(x,y,10,'#ffffff')).join(''));
   s+=fade(gs,line(945,215,945,455,{color:MX.dim,w:3})+line(945,215,930,215,{color:MX.dim,w:3})+line(945,455,930,455,{color:MX.dim,w:3})+label('どれも',1070,285,{size:28,color:MX.dim,anchor:'middle'})+word('秒速30万km',1070,350,{size:34,color:MX.hi,anchor:'middle'}));}
  return s;})()),

 // 01–02: two separate measurements, one calculated value that nearly agrees.
 'mx0-n-maxwell':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,g0=smooth(t/.5),gL=G(ctx,'光の速さの測定'),gE=G(ctx,'電気と磁気の測定'),gM=G(ctx,'ほぼ一致'),gC=G(ctx,'計算');
  let s=portrait(200,300,.82,g0);
  s+=fade(g0,label('マクスウェル',400,165,{size:40,color:MX.ink,weight:700}))+word('1860年代',700,158,{size:28,color:MX.hi,g:g0});
  // row L: measuring light itself (a different experiment)
  s+=fade(gL,sun(440,420)+label('光の速さの測定',498,429,{size:26,color:MX.hi,weight:700})+arrow(700,420,808,420,{color:MX.dim,w:4,head:14}))+word('秒速 約30万km',830,420,{size:30,color:MX.ink,g:gL});
  s+=fade(gL,line(410,352,690,352,{color:MX.dim,w:2,dash:'6 6'})+label('別々の測定',550,342,{size:24,color:MX.dim,anchor:'middle'}));
  // row E: electric and magnetic measurements → calculation
  s+=word('電気と磁気の測定',410,285,{size:28,color:MX.E,g:gE});
  s+=fade(gM,arrow(690,280,808,280,{color:MX.hi,w:5,head:16})+label('計算',749,262,{size:24,color:MX.hi,anchor:'middle',weight:700}))+word('秒速 約30万km',830,285,{size:30,color:MX.hi,g:gM});
  s+=fade(gM,label('≈ ほぼ一致',958,362,{size:30,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(gC*pulse(t),ring(749,255,26,{color:MX.hi,w:2}));
  return s;})()),

 // 01: laws + two constants (the constants are measured by the two experiments).
 'mx0-n-evidence':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,gc=smooth(t/.4),gL=G(ctx,'電磁気の法則'),g2=G(ctx,'二つの定数'),g0=G(ctx,'電荷どうし'),g1=G(ctx,'電流のまわり');
  const on0=g0*(1-smooth((t-T(ctx,'電流のまわり'))/.6)),on1=g1;
  let s=fade(gc*(.5+.5*g2),evidenceCard(0,90,95,{glow:on0*pulse(t)*.8})+evidenceCard(1,640,95,{glow:on1*pulse(t,1)*.8}));
  s+=hiddenBadge(0,90,95,{g:gc,glow:g2*(1-g0)*pulse(t)})+hiddenBadge(1,640,95,{g:gc,glow:g2*(1-g0)*pulse(t,1)});
  s+=word('電磁気の法則',170,485,{size:28,color:MX.ink,anchor:'middle',g:gL});
  s+=fade(g2,label('＋',345,494,{size:34,color:MX.dim,anchor:'middle',weight:700}));
  s+=bracketDown(325,875,420,g2)+word('2つの定数',600,485,{size:28,color:MX.hi,anchor:'middle',g:g2});
  return s;})()),

 'mx0-n-mystery':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,ge=G(ctx,'電気'),gm=G(ctx,'磁気');
  let s=evidenceCard(0,90,95,{glow:ge*pulse(t)*.8})+evidenceCard(1,640,95,{glow:gm*pulse(t,1)*.8});
  s+=hiddenBadge(0,90,95)+hiddenBadge(1,640,95);
  const ga=G(ctx,'光の速さ',{d:.6});
  s+=arrow(350,385,470,440,{color:MX.E,w:5,g:ga})+arrow(850,385,730,440,{color:MX.B,w:5,g:ga});
  s+=fade(ga,`<circle cx="600" cy="462" r="${58+5*Math.sin(t*3)}" fill="${MX.hi}" fill-opacity=".08"/>`)+word('光の速さ？',600,472,{size:38,color:MX.hi,anchor:'middle',g:ga});
  s+=word('今日の謎',1000,480,{size:30,color:MX.plus,anchor:'middle',g:G(ctx,'今日の謎')});
  return s;})()),

 // 02 補足: then (two measurements agree) vs. now (c is a fixed, defined value).
 'mx0-n-si':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,g0=smooth(t/.4),gN=G(ctx,'今の単位'),gM=G(ctx,'測る値'),gD=G(ctx,'決めた値'),gW=G(ctx,'なぜ');
  let s=word('補足',60,122,{size:26,color:MX.hi,g:g0});
  s+=fade(g0*(1-.2*gN),callout(60,150,520,290,'')+label('マクスウェルの時代',320,196,{size:26,color:MX.dim,anchor:'middle',weight:700})
   +label('電気・磁気の測定 → 計算',320,262,{size:26,color:MX.E,anchor:'middle'})+label('光の速さの測定',320,322,{size:26,color:MX.ink,anchor:'middle'})
   +label('≈ ほぼ一致',320,392,{size:30,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(gN,callout(620,150,520,290,'',1,{stroke:MX.hi})+label('今の単位の決まり',880,196,{size:26,color:MX.dim,anchor:'middle',weight:700}));
  s+=fade(gM,label('測り直す値ではない',880,262,{size:26,color:MX.ink,anchor:'middle'}));
  s+=fade(gD,label('光の速さ ＝ 決めた値',880,330,{size:32,color:MX.hi,anchor:'middle',weight:700})+tx('c=299\\,792\\,458\\ \\mathrm{m/s}',880,400,34,MX.ink));
  s+=word('この動画：法則から、なぜこの速さが出るか',600,490,{size:28,color:MX.hi,anchor:'middle',g:gW});
  return s;})()),

 // fullBar cue: the four equations themselves are the picture (no bar on top in this cue).
 'mx0-n-four':(p,ctx)=>stage(ctx,p,(()=>{
  let s=word('今日たどり着く、4つの式',600,112,{size:30,color:MX.hi,anchor:'middle',g:smooth(ctx.t/.4)});
  const t0=T(ctx,'この四つ'),tq=T(ctx,'今は');
  EQPOS.forEach(([x,y],i)=>{const g=smooth((ctx.t-t0+.2-i*.35)/.5);
   s+=fade(g,label('①②③④'[i],x-262,y+10,{size:30,color:MX.dim,anchor:'middle',weight:700})+fit(plainEq(i),x,y,460,46,{color:'#c9d3e6'}));
   const gq=smooth((ctx.t-tq+.1-i*.12)/.35);s+=fade(gq,label('？',x+250,y+12+5*Math.sin(ctx.t*4+i),{size:36,color:MX.plus,anchor:'middle',weight:700}));});
  s+=word('今は 読めなくていい',600,482,{size:28,color:MX.ink,anchor:'middle',g:smooth((ctx.t-tq-.4)/.4)});
  return s;})()),

 // The four equations shrink into the four short marks of the progress bar; then the road.
 'mx0-n-road':(p,ctx)=>{
  const t=ctx.t,arr=smooth(t/1.1),gb=smooth((t-.6)/.6);
  let s='';
  EQPOS.forEach(([x,y],i)=>{const tx0=150+i*292,ty0=40,sc=mix(1,.22,arr),X=mix(x,tx0,arr),Y=mix(y,ty0,arr);
   if(arr<1)s+=fade(1-smooth((t-.5)/.6),`<g transform="translate(${X.toFixed(1)} ${Y.toFixed(1)}) scale(${sc.toFixed(3)}) translate(${-x} ${-y})">`+fit(plainEq(i),x,y,460,46,{color:'#c9d3e6'})+'</g>');});
  const st=[['静電気',130,215],['電場',390,215],['磁石',640,215],['電流と磁場',920,215],['電磁誘導',920,410],['変位電流',580,410],['光',240,410]];
  const badge={1:'①',2:'②',4:'③',5:'④'};
  const path=[[130,215],[1080,215],[1110,230],[1120,260],[1120,365],[1110,395],[1080,410],[240,410]];
  const gr=smooth((t-1)/.5);
  s+=fade(gr,draw(path,1,{color:MX.faint,w:10}));
  const t0=Math.max(1,T(ctx,'静電気')),t1=Math.max(1.4,T(ctx,'一つずつ')),t2=T(ctx,'たどり着きます'),sp=.18;
  const u=smooth((t-t1)/Math.max(.8,t2-t1+.8));
  if(u>0)s+=draw(path,u,{color:MX.hi,w:6});
  if(u>0&&u<1){const q=along(path,u);s+=dot(q.x,q.y,11,'#ffffff');}
  st.forEach(([n,x,y],i)=>{const g=smooth((t-t0+.2-i*sp)/.4),last=i===st.length-1;
   s+=word(n,x,y+10,{size:last?36:28,color:last?MX.hi:MX.ink,anchor:'middle',g});
   if(badge[i])s+=fade(g,label(badge[i],x,y-36,{size:28,color:MX.hi,anchor:'middle',weight:700}));});
  const noBar={...ctx,cue:{...ctx.cue,compactBar:false,eqs:undefined}};
  return stage(noBar,p,s)+fade(gb,barOnly(ctx,p));},

 // 03: two kinds of statements on the road.
 'mx0-n-kinds':(p,ctx)=>stage(ctx,p,kindsScene(ctx,{gl:G(ctx,'実験を出発点'),gr:G(ctx,'計算で導く')})+word('道の途中に出てくる、2種類',600,490,{size:28,color:MX.ink,anchor:'middle',g:smooth(ctx.t/.4)})),
 'mx0-n-goal':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,gh=G(ctx,'光の速さ'),gk=G(ctx,'組み合わせ');
  let s=kindsScene(ctx,{dimL:1-gk*(1-smooth((t-T(ctx,'結果の方'))/.5)),glowA:gk,hiLight:gh});
  s+=word('最後に、この計算を一段ずつ',600,490,{size:30,color:MX.hi,anchor:'middle',g:G(ctx,'一段ずつ')});
  return s;})()),

 // ===================== chapter 1 =====================
 'mx1-n-hair':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,tr=T(ctx,'こすって'),tl=T(ctx,'持ち上げ'),th=T(ctx,'引き寄せ');
  const rub=t>tr-.2&&t<tl-.3?60*Math.sin((t-tr)*9)*smooth((t-tr+.2)/.3):0;
  const lift=smooth((t-tl+.1)/1.1),rise=Math.min(lift,smooth((t-tl-.15)/1.2))*mix(.55,1,smooth((t-th)/.8));
  let s=hairScene({lift,rise,rub});
  s+=word('下敷き',HX+175,mix(HY-HR-24,HY-HR-162,lift),{size:26,color:MX.ink});
  s+=word('こする',760,190,{size:32,color:MX.ink,g:G(ctx,'こすって')});
  s+=word('ゆっくり持ち上げる',760,290,{size:32,color:MX.ink,g:G(ctx,'持ち上げ')});
  s+=word('髪が立ち上がる',760,390,{size:32,color:MX.hi,g:G(ctx,'立ち上がり')});
  return s;})()),

 // 05: before rubbing, both objects already hold + and − in equal amounts.
 'mx1-n-before':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,gb=smooth((t-.2)/.6),gE=G(ctx,'電子が'),gP=G(ctx,'プラスの電荷'),gB=G(ctx,'同じ量'),gZ=G(ctx,'つり合って');
  let s=fade(.7,hairScene({}))+word('こする前',60,128,{size:30,color:MX.ink,g:smooth(t/.4)});
  s+=fade(gb,line(HX+150,HY-HR-26,650,110,{color:MX.dim,w:2,dash:'6 6'})+line(HX+80,HY-40,650,500,{color:MX.dim,w:2,dash:'6 6'}));
  s+=blocks(0,{g:gb,t,hiE:gE*(1-gB),hiP:gP*(1-gE)});
  s+=word('電子 ＝ マイナスの電荷',60,200,{size:26,color:MX.minus,g:gE});
  const tally=y=>fade(gB,label('＋4',860,y,{size:28,color:MX.plus,anchor:'middle',weight:700})+label('−4',940,y,{size:28,color:MX.minus,anchor:'middle',weight:700}))
   +fade(gZ,label('→',1000,y,{size:28,color:MX.dim,anchor:'middle'})+label('帯電なし',1090,y,{size:26,color:MX.ink,anchor:'middle',weight:700}));
  s+=tally(258)+tally(353);
  return s;})()),

 // 04: in this example electrons go hair → sheet; the pair of materials decides the direction.
 'mx1-n-transfer':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,tr=T(ctx,'こすると'),tm=T(ctx,'電子が移り'),u=smooth((t-tm+.1)/1.1);
  const rub=t<tm+.6?50*Math.sin((t-tr)*9)*smooth((t-tr)/.3)*(1-smooth((t-tm)/.6)):0;
  let s=fade(.7,hairScene({rub}));
  s+=line(HX+150,HY-HR-26,650,110,{color:MX.dim,w:2,dash:'6 6'})+line(HX+80,HY-40,650,500,{color:MX.dim,w:2,dash:'6 6'});
  s+=blocks(u,{t});
  s+=fade(G(ctx,'電子が移り')*(1-smooth((t-T(ctx,'どちらへ'))/.5)),arrow(745,380,745,225,{color:MX.minus,w:5,head:16})+label('電子',733,315,{size:24,color:MX.minus,anchor:'end',weight:700}));
  s+=word('この例では：髪 → 下敷き',60,128,{size:26,color:MX.hi,g:G(ctx,'この例では')});
  s+=word('物の組み合わせで、向きは変わる',60,200,{size:24,color:MX.ink,g:G(ctx,'組み合わせ')});
  return s;})()),

 // 05: nothing is created; the sheet has extra −, the hair's own + is left over.
 'mx1-n-balance':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,gN=G(ctx,'新しく'),gS=G(ctx,'増えた'),gH=G(ctx,'少なく'),gP=G(ctx,'もとからある'),gC=G(ctx,'プラスに帯電');
  let s=fade(.7+.3*gS,hairScene({signs:Math.max(gS,gH)}));
  s+=line(HX+150,HY-HR-26,650,110,{color:MX.dim,w:2,dash:'6 6'})+line(HX+80,HY-40,650,500,{color:MX.dim,w:2,dash:'6 6'});
  s+=blocks(1,{t,hiP:gP*(1-gC)});
  s+=word('電荷は 新しく生まれない（偏るだけ）',60,128,{size:24,color:MX.ink,g:gN});
  const tally=(y,a,b,res,col,g1,g2)=>fade(g1,label(a,860,y,{size:28,color:MX.plus,anchor:'middle',weight:700})+label(b,940,y,{size:28,color:MX.minus,anchor:'middle',weight:700}))
   +fade(g2,label('→',1000,y,{size:28,color:MX.dim,anchor:'middle'})+label(res,1090,y,{size:26,color:col,anchor:'middle',weight:700}));
  s+=tally(258,'＋4','−6','−に帯電',MX.minus,gS,G(ctx,'マイナスに'))+tally(353,'＋4','−2','＋に帯電',MX.plus,gH,gC);
  return s;})()),

 'mx1-n-attract':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,out=smooth(t/.5),gd=G(ctx,'違う種類'),gs=G(ctx,'同じ種類'),lift=smooth((t-.2)/1.1);
  let s=hairScene({lift,rise:lift,signs:1});
  s+=fade(1-out,blocks(1,{t})+line(HX+150,HY-HR-26,650,110,{color:MX.dim,w:2,dash:'6 6'})+line(HX+80,HY-40,650,500,{color:MX.dim,w:2,dash:'6 6'}));
  s+=word('髪 ＋',HX-260,HY-40,{size:28,color:MX.plus,g:G(ctx,'髪は')})+word('下敷き −',HX+175,mix(HY-HR-24,HY-HR-162,lift),{size:26,color:MX.minus,g:G(ctx,'下敷き')});
  s+=fade(G(ctx,'引き寄せ')*lift,arrow(HX,HY-HR-60,HX,HY-HR-110,{color:FORCE,w:6,head:16}));
  const dd=18*smooth((t-T(ctx,'引き合い'))/.8),ds=30*smooth((t-T(ctx,'押し合い'))/.8),ya=200,yb=380;
  s+=charge(680+dd,ya,1,{g:gd})+charge(870-dd,ya,-1,{g:gd})+fade(gd,arrow(710+dd,ya,755+dd,ya,{color:FORCE,w:6,head:16})+arrow(840-dd,ya,795-dd,ya,{color:FORCE,w:6,head:16}));
  s+=charge(700-ds,yb,1,{g:gs})+charge(850+ds,yb,1,{g:gs})+fade(gs,arrow(670-ds,yb,610-ds,yb,{color:FORCE,w:6,head:16})+arrow(880+ds,yb,940+ds,yb,{color:FORCE,w:6,head:16}));
  s+=word('違う → 引き合う',775,ya+80,{size:28,color:MX.ink,anchor:'middle',g:gd})+word('同じ → 押し合う',775,yb+80,{size:28,color:MX.ink,anchor:'middle',g:gs});
  return s;})()),

 'mx1-n-current':(p,ctx)=>stage(ctx,p,(()=>wireA(ctx,{dim:0,gI:G(ctx,'電流になり'),gDef:G(ctx,'プラスの電荷が動く')}))()),
 // the real wire: electrons move left, opposite to the current arrow.
 'mx1-n-electron':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,gB=G(ctx,'電線の中'),gL=G(ctx,'左へ');
  let s=wireA(ctx,{dim:gB,gI:1,gDef:1-smooth(t/.4)});
  const y=365,x0=110,x1=1090,W=x1-x0-60;
  s+=fade(gB,rect(x0,y-32,x1-x0,64,{fill:'#c07a3a',fo:.18,stroke:'#c07a3a',sw:3,rx:32})+label('実際の電線',x0,y-50,{size:24,color:'#e0a36a'}));
  for(let k=0;k<11;k++){const yy=y+(k%2?12:-12),xm=x0+30+((k/11*W-80*t)%W+W)%W;s+=charge(xm,yy,-1,{r:13,g:gB});}
  s+=fade(gL,arrow(700,y+68,480,y+68,{color:MX.minus,w:6,head:18})+label('電子は左へ（電流と逆）',720,y+77,{size:26,color:MX.minus,weight:700}));
  return s;})()),
 // 06: count at a cross-section.
 'mx1-n-section':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,gSec=G(ctx,'断面'),tA=T(ctx,'マイナスが一つ'),tB=T(ctx,'プラスが一つ');
  const uA=smooth((t-tA+.1)/1.4),uB=smooth((t-tB+.1)/1.4);
  return sectionScene(ctx,{uA,uB,gA:smooth(t/.5),gB:G(ctx,'プラスが一つ',{off:-.4}),gSec,gSame:G(ctx,'同じだけ')});})()),
 'mx1-n-same':(p,ctx)=>stage(ctx,p,sectionScene(ctx,{uA:1,uB:1,gSame:G(ctx,'電流としては'),gI:G(ctx,'右向き'),gNot:G(ctx,'粒が同じ')})),

 // 07 (model) + v4-01: two small + charges q and Q held still; q, Q, r are varied one at a time.
 'mx1-n-question':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,gl=G(ctx,'q と Q'),ga=G(ctx,'電荷の量'),gr=G(ctx,'距離 r'),gs=G(ctx,'止めて'),g1=G(ctx,'一つずつ');
  let s=pair({amt:ga,amtHi1:ga*(1-gr)*pulse(t),amtHi2:ga*(1-gr)*pulse(t)});
  s+=word('力の強さは、何で決まる？',530,118,{size:30,color:MX.ink,anchor:'middle',g:smooth(t/.4)});
  s+=qQletters(gl);
  s+=fade(ga,label('電荷の量',230,PY+79,{size:24,color:MX.dim,anchor:'middle'}));
  s+=ruler(380,680,355,gr,'')+fade(gr,tx('r',530,405,36,RC));
  s+=word('小さな電荷を 止めて置く',900,400,{size:26,color:MX.ink,anchor:'middle',g:gs});
  s+=word('一つずつ 変える',900,470,{size:28,color:MX.hi,anchor:'middle',g:g1});
  return s;})()),

 // v4-01: only q changes; Q and r are marked 固定.
 'mx1-n-double':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,gk=G(ctx,'固定'),gq=G(ctx,'左の電荷'),q1=1+smooth((t-T(ctx,'二倍にします')-.1)/.6),f=smooth((t-T(ctx,'力も')+.1)/.6);
  let s=pair({q1,F0:80*(1+f)/q1,amt:1,amtHi1:gq,dimR:gk});
  s+=qQletters(1);
  s+=fade(1-.5*gk,ruler(380,680,355,1,'')+tx('r',530,405,36,RC));
  s+=knobs({q:'×2',Q:'固定',r:'固定'},{g:gk,hot:gq});
  s+=fade(G(ctx,'二倍にします'),label('1 → 2',380,122,{size:30,color:MX.plus,anchor:'middle',weight:700}));
  s+=causal('電荷 ×2','力 ×2',930,470,{g:G(ctx,'力も'),ca:MX.plus,cb:FORCE,size:30});
  return s;})()),

 'mx1-n-predict':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,q2=1+smooth((t-T(ctx,'相手の電荷')-.1)/.6),gQ=G(ctx,'相手の電荷'),gq=G(ctx,'何倍');
  let s=pair({q1:2,q2,F0:80/q2,amt:1,amtHi2:gQ});
  s+=qQletters(1)+fade(.5,ruler(380,680,355,1,'')+tx('r',530,405,36,RC));
  s+=knobs({q:'×2',Q:'×2',r:'固定'},{hot:gQ});
  s+=fade(gQ,label('1 → 2',680,122,{size:30,color:MX.plus,anchor:'middle',weight:700}));
  s+=fade(gq,label('？',230,PY-30+5*Math.sin(t*4),{size:48,color:MX.hi,anchor:'middle',weight:700})+label('？',830,PY-30+5*Math.sin(t*4+1),{size:48,color:MX.hi,anchor:'middle',weight:700}));
  s+=causal('両方 ×2','力 ×？',930,470,{g:gq,ca:MX.plus,cb:MX.hi,size:30});
  return s;})()),

 'mx1-n-both':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,g1=G(ctx,'こちらで'),g2=G(ctx,'さらに'),f=smooth((t-T(ctx,'さらに')+.1)/.7),gm=G(ctx,'二かける二'),g4=G(ctx,'四倍');
  let s=pair({q1:2,q2:2,F0:80*(2+2*f)/4,amt:1});
  s+=qQletters(1)+fade(.5,ruler(380,680,355,1,'')+tx('r',530,405,36,RC));
  s+=knobs({q:'×2',Q:'×2',r:'固定'});
  s+=word('×2',380,118,{size:28,color:MX.plus,anchor:'middle',g:g1})+word('さらに ×2',680,118,{size:28,color:MX.plus,anchor:'middle',g:g2});
  s+=fade(gm,tx('2\\times 2=4',930,480,48,MX.ink));
  s+=fade(g4,`<rect x="820" y="425" width="220" height="76" rx="14" fill="none" stroke="${FORCE}" stroke-width="3"/>`)+word('力 ×4',930,380,{size:30,color:FORCE,anchor:'middle',g:g4});
  return s;})()),

 // v4-01: only r changes (q, Q 固定).
 'mx1-n-distance':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,back=smooth((t-T(ctx,'元に戻し')+.1)/.7),q=mix(2,1,back);
  const x1=mix(380,200,back),s2=smooth((t-T(ctx,'二倍')-.1)/.7),s3=smooth((t-T(ctx,'三倍')-.1)/.7);
  const x2=mix(680,480,back)+280*s2+280*s3;
  let s=distTable(ctx,{g2:s2,g3:s3,gf1:back,gf2:G(ctx,'四分の一'),gf3:G(ctx,'九分の一')});
  s+=pair({x1,x2,q1:q,q2:q,unit:mix(300,280,back),F0:80,amt:1-smooth(back*2)});
  s+=ruler(x1,x2,300,back,'');
  s+=knobs({q:'固定',Q:'固定',r:'×2, ×3'},{y:118,g:G(ctx,'固定し'),hot:G(ctx,'距離 r')});
  return s;})()),
 // v4-01: the "divide-by" box r² grows 1 → 4 → 9 while the force bar shrinks to 1/4, 1/9.
 'mx1-n-inverse':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,g0=smooth(t/.5),g2=G(ctx,'二倍なら'),b2=smooth((t-T(ctx,'二かける二')+.1)/.8),g3=G(ctx,'三倍なら'),b3=smooth((t-T(ctx,'九倍')+.1)/.8),
   gF=G(ctx,'力はこの数'),uF=smooth((t-T(ctx,'割られる')+.1)/.9),gn=G(ctx,'距離の二乗に反比例');
  let s=knobs({q:'固定',Q:'固定',r:'×2, ×3'},{y:118});
  const xs=[430,690,950],gc=[g0,g2,g3],bb=[1,b2,b3];
  s+=fade(g0,label('距離 r',150,210,{size:26,color:RC,anchor:'middle',weight:700})+label('距離の二乗',150,325,{size:26,color:RC,anchor:'middle',weight:700})+label('＝ 割る数',150,362,{size:26,color:MX.ink,anchor:'middle'}));
  s+=fade(gF,label('力 F',150,450,{size:26,color:FORCE,anchor:'middle',weight:700}));
  xs.forEach((x,i)=>{const n=i+1,e=bb[i],u=i?uF:0,f=mix(1,1/(n*n),u);
   s+=fade(gc[i],tx(String(n),x,212,36,RC));
   s+=fade(gc[i],tiles(x,360,n,e));
   s+=fade(gc[i]*(i?smooth((e-.6)/.4):1),tx(String(n*n),x,404,32,RC));
   s+=fade(gF*gc[i],arrow(x-100,440,x-100+200*f,440,{color:FORCE,w:7,head:Math.min(18,200*f*.6)}));
   s+=fade(gF*(i?uF:1),tx(i?`\\times\\tfrac{1}{${n*n}}`:'\\times 1',x,494,30,FORCE));});
  s+=fade(gn,callout(640,88,530,76,'')+tx('F\\propto\\dfrac{1}{r^2}',720,138,32,MX.ink)+label('距離の二乗に反比例',960,138,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  return s;})()),
 // v4-01 check: q only ×2, r only ×2, both → ?
 'mx1-n-check':(p,ctx)=>stage(ctx,p,(()=>{
  const g1=G(ctx,'q だけ'),g2=G(ctx,'r だけ'),g3=G(ctx,'両方同時');
  return quizRows(ctx,{g1,g2,g3})+quizPair(ctx,g3,0)+knobs({q:'×2',Q:'固定',r:'×2'},{g:g3});})()),
 'mx1-n-half':(p,ctx)=>stage(ctx,p,(()=>{
  const a1=G(ctx,'電荷で二倍'),a2=G(ctx,'四で割る'),a3=G(ctx,'二分の一倍');
  return quizRows(ctx,{a1,a2,a3})+quizPair(ctx,1,a3)+knobs({q:'×2',Q:'固定',r:'×2'});})()),

 // v4-02: the horizontal axis is not distance — one experiment's q, Q, r go into a calculation box.
 'mx1-n-graphx':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,g0=smooth(t/.5),gH=G(ctx,'横軸は'),gN=G(ctx,'距離ではなく'),gE=G(ctx,'一回の実験'),gv=G(ctx,'q、Q、r'),gr=G(ctx,'割る r');
  let s=graph({...GCALC,g:g0,gOurs:0,gMany:0,gLine:0});
  s+=fade(gH*(1-gr)*pulse(t),ring(GCALC.ox+GCALC.w+72,GCALC.oy,44,{color:MX.hi,w:3}));
  s+=word('横軸は 距離ではない',420,170,{size:28,color:MX.hi,anchor:'middle',g:gN});
  s+=calcBox({g:gE,gv,gres:gr});
  return s;})()),
 'mx1-n-graphpt':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,{ox,oy,w,h}=GCALC,sx=w/4.5,sy=h/4.5,P=(u,v)=>[ox+u*sx,oy-v*sy];
  const uX=smooth((t-T(ctx,'横に')+.1)/.8),gF=G(ctx,'測った力'),uF=smooth((t-T(ctx,'縦に')+.1)/.8),gP=G(ctx,'点を一つ'),
   r2=smooth((t-T(ctx,'距離だけ')-.1)/.7),uM=smooth((t-T(ctx,'左下へ')+.3)/.9);
  const X=mix(2,.5,uM),[px,py]=P(X,X);
  let s=graph({...GCALC,gOurs:0,gMany:0,gLine:0});
  s+=calcBox({gF,r2,hiX:uX*(1-uX),hiF:uF*(1-uF)});
  // the value X travels from the box to the horizontal axis
  const [tx0]=P(2,0),xl=uM>0?px:mix(1110,tx0,uX),yl=mix(330,oy+36,uX);
  s+=fade(uX*(1-uM),tx('2',xl,yl,mix(36,30,uX),MX.hi))+fade(uM,tx('\\tfrac{1}{2}',px,oy+38,30,MX.hi));
  s+=fade(uX,line(px,oy-8,px,oy+8,{color:MX.hi,w:3}));
  // the measured force becomes the vertical coordinate
  if(uF>0)s+=line(ox-12,oy,ox-12,oy-(py<oy?(oy-py):0)*uF,{color:FORCE,w:8});
  s+=fade(gP,line(px,oy,px,py,{color:MX.dim,w:2,dash:'6 6'})+line(ox,py,px,py,{color:MX.dim,w:2,dash:'6 6'})+dot(px,py,10,MX.hi)+ring(px,py,15,{color:MX.hi,w:2}));
  s+=fade(uM*.45,dot(...P(2,2),9,MX.hi));
  s+=word('距離 ×2 → 点は左下へ',560,200,{size:26,color:MX.hi,anchor:'middle',g:G(ctx,'距離だけ')});
  return s;})()),
 // 09: the examples are a few points of a law checked by many measurements.
 'mx1-n-law':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,e=smooth(t/.8),go=G(ctx,'二倍や三倍'),gm=G(ctx,'多くの'),gl=G(ctx,'比例する',{d:.8}),gw=G(ctx,'確かめ');
  let s=graph({...gmix(GCALC,GBIG,e),gOurs:go,gMany:gm,gLine:gl,gLeg:gm});
  s+=word('多くの実験で確かめられた比例',500,140,{size:26,color:MX.hi,anchor:'middle',g:gw});
  return s;})()),
 // Coulomb's law: the graph moves aside, the symbols come from its axes.
 'mx1-n-coulomb':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,e=smooth(t/.9),Gp=gmix(GBIG,GSMALL,e);
  const L=coulombLayout(870,345,64),xl=[Gp.ox+Gp.w+72,Gp.oy],yl=[Gp.ox,Gp.oy-Gp.h-40];
  const from={q:xl,Q:xl,r:[xl[0],xl[1]+30],F:yl};
  const uq=smooth((t-T(ctx,'q と Q')+.1)/.7),ur=smooth((t-T(ctx,'r の二乗')+.1)/.7),gk=G(ctx,'倍率 k'),uF=smooth((t-T(ctx,'力 F')+.1)/.7);
  let s=graph({...Gp,g:1-.35*smooth((t-T(ctx,'q と Q'))/.6),gLeg:1-e});
  s+=word('実験を出発点にする法則',870,128,{size:26,color:MX.E,anchor:'middle',g:G(ctx,'実験を出発点')});
  s+=fade(G(ctx,'クーロンの法則'),label('クーロンの法則',870,210,{size:36,color:MX.hi,anchor:'middle',weight:700}));
  s+=coulombFly(L,{uq,uQ:uq,ur,gk,uF,gEq:uF,from});
  s+=fade(gk*(1-uF),label('比例の倍率',L.xk,L.y+90,{size:24,color:MX.hi,anchor:'middle'}));
  return s;})()),

 // v4-03 時給: hours × hourly wage = pay  ↔  X × k = F (same numbers ①②③, same colours).
 'mx1-n-k':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,gT=smooth(t/.4),g1=G(ctx,'働いた時間'),g2=G(ctx,'時給です'),g3=G(ctx,'給料は'),gS=G(ctx,'同じように'),
   gF=G(ctx,'力は'),gX=G(ctx,'横の値かける'),gK=G(ctx,'k で'),gA=G(ctx,'一あたり'),gG=G(ctx,'傾き');
  const XS=[250,530,810],YT=185,YR=385;
  let s=callout(60,96,1080,170,'',gT*(1-.35*gS),{stroke:MX.dim});
  s+=word('たとえ',1128,130,{size:24,color:MX.dim,anchor:'end',g:gT*(1-gS)});
  s+=fade((1-.35*gS),fade(g1,clock(XS[0],YT)+label('働いた時間',XS[0],YT+62,{size:24,color:MX.ink,anchor:'middle'}))
   +fade(g1,label('×',390,YT+14,{size:40,color:MX.dim,anchor:'middle'}))
   +fade(g2,coin(XS[1],YT)+label('時給',XS[1],YT+62,{size:24,color:MX.hi,anchor:'middle',weight:700}))
   +fade(g3,label('＝',670,YT+14,{size:40,color:MX.dim,anchor:'middle'})+bills(XS[2],YT)+label('給料',XS[2],YT+62,{size:24,color:FORCE,anchor:'middle',weight:700})));
  const gi=[g1,g2,g3],gr=[gX,gK,gF];
  XS.forEach((x,i)=>{s+=fade(gi[i]*(1-.35*gS),badge(x-62,YT-38,i+1))+fade(gr[i],badge(x-62,YR-44,i+1)+line(x,YT+80,x,YR-58,{color:MX.dim,w:2,dash:'6 6'}));});
  s+=fade(gX,tx('X',XS[0],YR,58,MX.ink)+label('×',390,YR+14,{size:40,color:MX.dim,anchor:'middle'})+label('横の値',XS[0],YR+60,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(gK,tx('k',XS[1],YR,58,MX.hi))+fade(gA,label('横の値 1 あたりの力',XS[1],YR+60,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(gF,label('＝',670,YR+14,{size:40,color:MX.dim,anchor:'middle'})+tx('F',XS[2],YR,58,FORCE)+label('力',XS[2],YR+60,{size:24,color:FORCE,anchor:'middle'}));
  // a small graph: k is its slope
  const o=[935,475];
  s+=fade(gG,arrow(o[0],o[1],o[0]+210,o[1],{color:MX.dim,w:2.5,head:10})+arrow(o[0],o[1],o[0],o[1]-165,{color:MX.dim,w:2.5,head:10})
   +line(o[0],o[1],o[0]+190,o[1]-150,{color:MX.hi,w:3})+line(o[0]+95,o[1]-75,o[0]+160,o[1]-75,{color:MX.ink,w:2,dash:'5 5'})+line(o[0]+160,o[1]-75,o[0]+160,o[1]-126,{color:MX.ink,w:2,dash:'5 5'})
   +label('傾き ＝ k',o[0]+105,o[1]-178,{size:24,color:MX.hi,anchor:'middle',weight:700})+tx('X',o[0]+215,o[1]+30,24,MX.ink)+tx('F',o[0]-20,o[1]-150,24,FORCE));
  return s;})()),
 // v4-03: the right triangle's height ÷ width is k; F/X = k → F = kX. X is a temporary name.
 'mx1-n-k2':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,{ox,oy,w,h}=GMID,sx=w/4.5,sy=h/4.5,P=(u,v)=>[ox+u*sx,oy-v*sy];
  const gT=G(ctx,'直角三角形',{d:.6}),gF=G(ctx,'縦の力'),gX=G(ctx,'横の値で割る'),uD=smooth((t-T(ctx,'割る')+.1)/.8),gK=G(ctx,'k になります'),
   gE=G(ctx,'どの実験'),gS=G(ctx,'同じ傾き'),go=G(ctx,'一度測れば');
  let s=graph({...GMID,gLeg:0});
  const [ax,ay]=P(3,0),[,by]=P(3,3);
  s+=fade(gT,`<polygon points="${ox},${oy} ${ax},${ay} ${ax},${by}" fill="${MX.hi}" fill-opacity=".10" stroke="none"/>`);
  s+=fade(Math.max(gT*.6,gX),line(ox,oy-3,ax,oy-3,{color:MX.ink,w:6}))+fade(gX,tx('X',(ox+ax)/2,oy+40,30,MX.ink));
  s+=fade(Math.max(gT*.6,gF),line(ax,oy,ax,by,{color:FORCE,w:6}))+fade(gF,tx('F',ax+26,(oy+by)/2+10,30,FORCE));
  // F and X travel into the fraction
  const fx=[ax+26,(oy+by)/2+10],xx=[(ox+ax)/2,oy+40],KX=920,KY=190;
  if(uD>0&&uD<1){s+=tx('F',mix(fx[0],KX+62,uD),mix(fx[1],KY-26,uD),30,FORCE)+tx('X',mix(xx[0],KX+62,uD),mix(xx[1],KY+40,uD),30,MX.ink);}
  s+=fade(smooth((uD-.9)/.1),tex(`{\\color{${MX.hi}}k}=\\dfrac{\\color{${FORCE}}F}{X}`,KX,KY,{size:52,color:MX.ink,auto:false}));
  s+=fade(gK,arrow(KX,KY+58,KX,KY+100,{color:MX.dim,w:3,head:12})+tex(`{\\color{${FORCE}}F}={\\color{${MX.hi}}k}\\,X`,KX,KY+150,{size:52,color:MX.ink,auto:false})
   +label('X ＝ 横の値につけた仮の名前',KX,KY+205,{size:24,color:MX.ink,anchor:'middle'}));
  const tri=(u,g)=>{const [a,b]=P(0,0),[c]=P(u,0),[,d]=P(u,u);return fade(g,line(a,b-1,c,b-1,{color:MX.ink,w:3,dash:'8 6'})+line(c,b,c,d,{color:FORCE,w:3,dash:'8 6'}));};
  s+=tri(1.2,gE)+fade(gS,label('同じ傾き',P(1.2,.5)[0]+14,P(1.2,.5)[1],{size:24,color:MX.ink}));
  s+=word('一度測れば、どこでも使える',KX+40,462,{size:26,color:MX.ink,anchor:'middle',g:go});
  return s;})()),

 // 08: magnitude with |q|, |Q|; direction from like/unlike.
 'mx1-n-sign':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,out=smooth(t/.6),e=smooth((t-.3)/.8),gP=G(ctx,'プラスどうし'),gA=G(ctx,'符号を除いた'),gD=G(ctx,'向きは'),g1=G(ctx,'押し合うか'),g2=G(ctx,'引き合うか');
  let s=fade(1-out,graph({...GSMALL,gLeg:0}));
  const L=coulombLayout(mix(870,820,e),mix(345,150,e),mix(64,40,e));
  s+=coulombFly(L,{});
  s+=fade(gP*e,label('プラスどうし',1060,158,{size:24,color:MX.dim,anchor:'middle'}));
  s+=fade(gA,tx('F=k\\dfrac{|q|\\,|Q|}{r^2}',870,318,60,MX.ink)+label('力の大きさ',610,322,{size:26,color:MX.hi,anchor:'middle',weight:700})+label('|q|, |Q| ＝ 符号を除いた電荷の大きさ',870,420,{size:26,color:MX.ink,anchor:'middle'}));
  s+=fade(gD,label('向き',270,140,{size:28,color:FORCE,anchor:'middle',weight:700}));
  s+=fade(g1,charge(190,220,1,{r:22})+charge(350,220,1,{r:22})+arrow(164,220,110,220,{color:FORCE,w:5,head:14})+arrow(376,220,430,220,{color:FORCE,w:5,head:14})+label('同じ種類 → 押し合う',270,290,{size:26,color:MX.ink,anchor:'middle'}));
  s+=fade(g2,charge(190,380,1,{r:22})+charge(350,380,-1,{r:22})+arrow(216,380,262,380,{color:FORCE,w:5,head:14})+arrow(324,380,278,380,{color:FORCE,w:5,head:14})+label('違う種類 → 引き合う',270,450,{size:26,color:MX.ink,anchor:'middle'}));
  return s;})()),
 // 07: the model (point charges, at rest, vacuum); big objects need to be split — next chapter.
 'mx1-n-model':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,g0=smooth(t/.5),g1=G(ctx,'大きさを無視'),g2=G(ctx,'止まって'),g3=G(ctx,'真空中'),gO=G(ctx,'髪と下敷き'),gS=G(ctx,'小さな部分'),gA=G(ctx,'足し方'),gN=G(ctx,'次の章');
  let s=fade(g0,tx('F=k\\dfrac{qQ}{r^2}',310,150,40,MX.ink)+charge(200,255,1,{r:16})+charge(420,255,1,{r:16})+ruler(200,420,300,.8,''));
  s+=fade(g1,label('点電荷',310,225,{size:24,color:MX.dim,anchor:'middle'}));
  const item=(txt,y,g)=>fade(g,label('✓',90,y,{size:28,color:MX.good,weight:700})+label(txt,130,y,{size:26,color:MX.ink}));
  s+=item('大きさを無視できる',370,g1)+item('止まっている',420,g2)+item('まわりは真空',470,g3);
  s+=fade(gO,callout(640,100,520,400,'')+label('大きな物',900,142,{size:26,color:MX.dim,anchor:'middle',weight:700})
   +rect(700,170,400,60,{fill:SHEET,fo:.3,stroke:'#dfe6f2',sw:2,rx:8})+label('下敷き',690,210,{size:24,color:MX.ink,anchor:'end'})
   +rect(700,300,400,60,{fill:SKIN,fo:.3,stroke:'#d9b89a',sw:2,rx:8})+label('髪',690,340,{size:24,color:MX.ink,anchor:'end'}));
  if(gS>0){let c='';for(let k=1;k<8;k++){c+=line(700+50*k,170,700+50*k,230,{color:'#dfe6f2',w:1.5,opacity:.8})+line(700+50*k,300,700+50*k,360,{color:'#d9b89a',w:1.5,opacity:.8});}
   for(let k=0;k<8;k++){c+=label('−',725+50*k,209,{size:24,color:MX.minus,anchor:'middle',weight:700})+label('+',725+50*k,339,{size:24,color:MX.plus,anchor:'middle',weight:700});}
   s+=fade(gS,c);}
  s+=fade(gA,[[725,875],[875,875],[1025,775],[775,1025]].map(([a,b])=>line(a,232,b,298,{color:FORCE,w:2.5,opacity:.85})).join(''));
  s+=word('足し方は 次の章',900,452,{size:28,color:MX.hi,anchor:'middle',g:gN});
  return s;})()),

 // 09 + 時給: units tie k to N, m, C; k = F ÷ X like wage = pay ÷ hours; the value is measured.
 'mx1-n-kunit':(p,ctx)=>stage(ctx,p,(()=>{
  const gF=G(ctx,'力をニュートン'),gR=G(ctx,'距離をメートル'),gQ=G(ctx,'電荷をクーロン'),gW=G(ctx,'時給を'),gD=G(ctx,'k を力'),gV=G(ctx,'約九');
  let s=unitsRow({gF,gR,gQ});
  s+=fade(gW*(1-gD),word('たとえ',300,222,{size:22,color:MX.dim})+label('時給 ＝ 給料 ÷ 時間',640,230,{size:28,color:MX.ink,anchor:'middle',weight:700}));
  s+=kFormula(gD);
  s+=fade(gV,tx('k\\approx 9\\times 10^{9}\\ \\mathrm{N\\,m^2/C^2}',600,455,46,MX.hi));
  return s;})()),
 // v4-04 両替: ε₀ is k said in other units of expression — one measured fact.
 'mx1-n-eps':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,e=smooth(t/.8),out=smooth(t/.35),gU=G(ctx,'イプシロンゼロ'),gT=G(ctx,'円をドル'),gM=G(ctx,'金額'),gR=G(ctx,'測った情報');
  let s=fade(1-out,unitsRow({})+kFormula(1));
  s+=tx('k\\approx 9\\times 10^{9}\\ \\mathrm{N\\,m^2/C^2}',600,mix(455,128,e),mix(46,36,e),MX.hi);
  s+=fade(e,label('測った値',930,136,{size:24,color:MX.dim,anchor:'middle'}));
  // たとえ: yen ⇄ dollars, the same amount of money
  s+=callout(140,180,920,150,'',gT*(1-.5*gR),{stroke:MX.dim});
  s+=word('たとえ',158,212,{size:22,color:MX.dim,g:gT*(1-gR)});
  s+=fade(gT*(1-.5*gR),bills(380,262,'円')+swap(600,262)+label('両替',600,232,{size:24,color:MX.ink,anchor:'middle',weight:700})+bills(820,262,'$'));
  s+=fade(gM*(1-.5*gR),label('同じ金額',600,312,{size:24,color:MX.ink,anchor:'middle'}));
  // the real thing: k ⇄ ε₀
  s+=fade(gU,tx('k',380,425,60,MX.hi)+swap(600,418)+label('言い換え',600,388,{size:24,color:MX.ink,anchor:'middle',weight:700})+tex(`{\\color{${MX.E}}\\varepsilon_0}`,820,425,{size:60,color:MX.E,auto:false}));
  s+=word('測った情報は 一つのまま',600,488,{size:26,color:MX.hi,anchor:'middle',g:gR});
  return s;})()),
 // v4-04: step 1 — define ε₀ = 1/(4πk), and put in the measured k.
 'mx1-n-epsdef':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,go=smooth(t/.4),g1=G(ctx,'四パイ k 分の一'),gd=G(ctx,'決めます'),gk=G(ctx,'測った k'),gv=G(ctx,'約八点八五');
  let s=fade(1-go,callout(140,180,920,150,'',.5,{stroke:MX.dim})+fade(.5,bills(380,262,'円')+swap(600,262)+bills(820,262,'$'))+tx('k',380,425,60,MX.hi)+swap(600,418)+tex(`{\\color{${MX.E}}\\varepsilon_0}`,820,425,{size:60,color:MX.E,auto:false}));
  s+=tx('k\\approx 9\\times 10^{9}\\ \\mathrm{N\\,m^2/C^2}',600,128,36,MX.hi);
  s+=fade(gk*pulse(t)*.8,`<rect x="380" y="96" width="440" height="52" rx="12" fill="none" stroke="${MX.hi}" stroke-width="3"/>`);
  s+=epsSteps({g1,gd,gv});
  return s;})()),
 // v4-04: step 2 ×4πk → 4πkε₀ = 1; step 3 ÷4πε₀ → k = 1/(4πε₀) (boxed).
 'mx1-n-epsk':(p,ctx)=>stage(ctx,p,(()=>{
  const g2=G(ctx,'両辺に'),g2e=G(ctx,'イコール 一'),g3=G(ctx,'割ると'),g3e=G(ctx,'k は'),dim=G(ctx,'両辺に');
  let s=fade(1-.5*dim,tx('k\\approx 9\\times 10^{9}\\ \\mathrm{N\\,m^2/C^2}',600,128,36,MX.hi));
  s+=epsSteps({g1:1,gd:1,gv:1,dim1:dim,g2a:g2,g2:g2e,g3a:g3,g3:g3e,box:g3e});
  return s;})()),
 // v4-04: only the last box is put into k; the law is the same, written with ε₀.
 'mx1-n-fourpi':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,g0=smooth(t/.4),uK=smooth((t-T(ctx,'差し込み')+.2)/.9),gn=G(ctx,'両替しただけ'),gw=G(ctx,'こう書くと'),gs=G(ctx,'球の面積'),gy=G(ctx,'約分');
  const L=coulombLayout(250,190,52),done=smooth((uK-.85)/.15);
  // leftover steps from the previous cue fade away; step ③ stays and its fraction travels into k
  let s=fade(1-g0,epsSteps({g1:1,gd:1,gv:1,dim1:1,g2a:1,g2:1,g3a:1,g3:0,box:0}));
  s+=fade(g0*(1-done),coulombFly(L,{gk:1-smooth((uK-.6)/.3)}));
  const W3=texWidth('k=\\dfrac{1}{4\\pi\\varepsilon_0}',46,false),wk=texWidth('k=',46,false),wf=texWidth('\\dfrac{1}{4\\pi\\varepsilon_0}',46,false);
  const full=`F=\\dfrac{1}{4\\pi{\\color{${MX.E}}\\varepsilon_0}}\\,\\dfrac{qQ}{r^2}`,WF=texWidth(full,52,false),wF=texWidth('F=',52,false);
  const f0=[S3.x-W3/2+wk+wf/2,S3.y],f1=[250-WF/2+wF+texWidth('\\dfrac{1}{4\\pi\\varepsilon_0}',52,false)/2,190];
  s+=fade(1-smooth(uK/.3),tx('k=',S3.x-W3/2+wk/2,S3.y,46,MX.hi))+fade(1-smooth((uK-.1)/.2),epsSteps({box:1}));
  s+=fade(1-done,tex(`\\dfrac{1}{4\\pi{\\color{${MX.E}}\\varepsilon_0}}`,mix(f0[0],f1[0],uK),mix(f0[1],f1[1],uK)-40*Math.sin(Math.PI*uK),{size:mix(46,52,uK),color:MX.hi,auto:false}));
  s+=fade(done,tex(full,250,190,{size:52,color:MX.ink,auto:false}));
  s+=fade(gw,label('＝',250,272,{size:40,color:MX.dim,anchor:'middle'}))+fade(gw*(1-gs),tex(`F=\\dfrac{qQ}{4\\pi{\\color{${MX.E}}\\varepsilon_0} r^2}`,250,362,{size:52,color:MX.ink,auto:false}));
  s+=fade(gs,tex(`F=\\dfrac{qQ}{{\\color{${MX.hi}}4\\pi}{\\color{${MX.E}}\\varepsilon_0} {\\color{${MX.hi}}r^2}}`,250,362,{size:52,color:MX.ink,auto:false}));
  s+=word('両替しただけ：新しい法則ではない',250,475,{size:24,color:MX.ink,anchor:'middle',g:gn});
  const R=105,cx=880,cy=250;
  s+=fade(gs,`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${MX.E}" fill-opacity=".12" stroke="${MX.E}" stroke-width="3"/><ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R*.28}" fill="none" stroke="${MX.E}" stroke-opacity=".45" stroke-width="2" stroke-dasharray="6 6"/>`+line(cx,cy,cx+R*.72,cy-R*.69,{color:RC,w:3})+label('r',cx+42,cy-22,{size:26,color:RC,weight:700})
   +label('球の面積',cx,cy+R+42,{size:26,color:MX.dim,anchor:'middle'})+tx(`{\\color{${MX.hi}}4\\pi r^2}`,cx,cy+R+100,44,MX.hi));
  s+=fade(gy,arrow(720,410,480,380,{color:MX.hi,w:4,head:14})+label('後で約分できる',600,450,{size:24,color:MX.hi,anchor:'middle'}));
  return s;})()),
 // ⑨ the first constant card receives its name: ε₀.
 'mx1-n-card':(p,ctx)=>stage(ctx,p,(()=>{
  const t=ctx.t,u=smooth((t-T(ctx,'冒頭')+.1)/.9),gb=smooth((t-T(ctx,'冒頭')-.7)/.4),gh=G(ctx,'手がかり');
  let s=fade(1-.5*u,tex(`k=1/(4\\pi{\\color{${MX.E}}\\varepsilon_0})`,600,122,{size:36,color:MX.ink,auto:false}));
  s+=evidenceCard(0,90,165,{g:smooth(t/.4),gn:gb,glow:G(ctx,'冒頭')*pulse(t)*.8})+hiddenBadge(0,90,165,{g:1-gb});
  s+=fade(.45,evidenceCard(1,640,165))+hiddenBadge(1,640,165,{g:.6});
  if(u>0&&u<1){const x=mix(668,325,u),y=mix(122,425,u)-50*Math.sin(Math.PI*u);s+=tx('\\varepsilon_0',x,y,mix(34,44,u),MX.E);}
  s+=word('一つ目の手がかり',325,497,{size:26,color:MX.E,anchor:'middle',g:gh})+word('二つ目は まだ ？',875,497,{size:26,color:MX.dim,anchor:'middle',g:gh});
  return s;})()),

 'mx1-n-gap':(p,ctx)=>stage(ctx,p,(()=>{
  let s=pair({x1:380,x2:700,unit:320});
  const gg=G(ctx,'間に'),gq=G(ctx,'どうやって');
  s+=fade(gg,`<rect x="420" y="170" width="240" height="120" rx="14" fill="none" stroke="${MX.dim}" stroke-width="3" stroke-dasharray="10 8"/>`)+word('何もない',540,355,{size:32,color:MX.dim,anchor:'middle',g:gg});
  s+=fade(gq,label('？',540,255+6*Math.sin(ctx.t*4),{size:84,color:MX.hi,anchor:'middle',weight:700}));
  s+=word('どうやって押す？',540,460,{size:34,color:MX.hi,anchor:'middle',g:gq});
  return s;})()),
};

// Wire with + charges moving right (the convention that defines the current's direction).
function wireA(ctx,{dim=0,gI=1,gDef=1}){
 const t=ctx.t,y=175,x0=110,x1=1090,W=x1-x0-60,gw=smooth(t/.4);
 let s=rect(x0,y-32,x1-x0,64,{fill:'#c07a3a',fo:.18,stroke:'#c07a3a',sw:3,rx:32});
 for(let k=0;k<11;k++){const yy=y+(k%2?12:-12),xp=x0+30+((k/11*W+80*t)%W+W)%W;s+=charge(xp,yy,1,{r:13,g:gw});}
 s+=fade(gI,arrow(420,y-62,780,y-62,{color:MX.I,w:7,head:22})+label('電流',800,y-53,{size:28,color:MX.I,weight:700}));
 s+=word('プラスが動く向き ＝ 電流の向き',600,y+85,{size:28,color:MX.ink,anchor:'middle',g:gDef});
 return fade(1-.55*dim,s);
}
// Distances 1, 2, 3 (positions 480, 760, 1040 from the charge at 200) and the forces 1, 1/4, 1/9.
function distTable(ctx,{g2=0,g3=0,gf1=0,gf2=0,gf3=0,sq2=0,sq3=0}={}){
 const xs=[480,760,1040],yd=375,yf=455;
 let s=fade(gf1,label('距離',90,yd+10,{size:26,color:RC,anchor:'middle',weight:700})+label('力',90,yf+10,{size:26,color:FORCE,anchor:'middle',weight:700}));
 const gd=[gf1,g2,g3],gf=[gf1,gf2,gf3];
 ['1','2','3'].forEach((d,i)=>{s+=fade(gd[i],tx(d,xs[i],yd+12,36,RC));});
 s+=fade(gf[0],tx('1',xs[0],yf+12,36,FORCE));
 s+=fade(gf[1]*(1-sq2),tx('\\tfrac{1}{4}',xs[1],yf+12,40,FORCE))+fade(sq2,tx('\\dfrac{1}{2^2}',xs[1],yf+14,34,FORCE));
 s+=fade(gf[2]*(1-sq3),tx('\\tfrac{1}{9}',xs[2],yf+12,40,FORCE))+fade(sq3,tx('\\dfrac{1}{3^2}',xs[2],yf+14,34,FORCE));
 // ghost charges left at the earlier positions, so the three forces can be compared
 const ghost=(x,L,g)=>fade(.35*g,charge(x,PY,1,{r:24,label:true})+(L>3?arrow(x+28,PY,x+28+L,PY,{color:FORCE,w:6,head:Math.min(18,L*.7)}):''));
 s+=ghost(480,80,g2)+ghost(760,20,g3);
 return s;
}

// ---- v4 補助線 helpers ---------------------------------------------------------------------------
const qQletters=(g,{x1=380,x2=680}={})=>fade(g,tx('q',x1,172,36,MX.plus)+tx('Q',x2,172,36,MX.plus));
// q / Q / r chips: the one being changed is lit (with its factor), the others read 固定.
function knobs(st,{x=60,y=470,g=1,hot=1}={}){
 let s='';
 [['q',MX.plus],['Q',MX.plus],['r',RC]].forEach(([k,col],i)=>{const v=st[k]??'固定',x0=x+i*176,on=v!=='固定'?.35+.65*hot:0,lit=on>.5;
  s+=rect(x0,y-30,160,60,{fill:MX.bg2,fo:.95,stroke:lit?MX.hi:'#4a5a7a',sw:lit?3:2,rx:14})+(on>0?rect(x0,y-30,160,60,{fill:MX.hi,fo:.14*on,stroke:'none',sw:0,rx:14}):'');
  s+=tx(k,x0+32,y+8,34,lit?col:'#b8c4da')+label(v,x0+62,y+10,{size:26,color:lit?MX.hi:'#b8c4da',weight:700});});
 return fade(g,s);
}
// n×n unit tiles (the "divide-by" box r²), spreading out from one tile as e goes 0 → 1.
function tiles(x,yb,n,e,u=30){let s='';const tot=u*mix(1,n,e),left=x-tot/2;
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){if(e<=0&&(i||j))continue;s+=fade((i||j)?clamp(e*2):1,rect(left+j*u*e,yb-u-i*u*e,u,u,{fill:RC,fo:.3,stroke:RC,sw:2,rx:3}));}
 return s;}
// The quick check: q only ×2, r only ×2, both ×2.
function quizRows(ctx,{g1=1,g2=1,g3=1,a1=0,a2=0,a3=0}={}){
 const t=ctx.t,row=(y,left,g)=>fade(g,label(left,390,y,{size:28,color:MX.ink,anchor:'end',weight:700})+label('→',425,y,{size:28,color:MX.dim,anchor:'middle'})+label('力',470,y,{size:28,color:FORCE,anchor:'middle',weight:700}));
 const TT=(src,x,y,g,color=FORCE)=>fade(g,tex(src,x,y-8,{size:34,color,anchor:'start',auto:false}));
 let s=row(180,'q だけ ×2',g1)+TT('\\times 2',495,180,g1);
 s+=row(270,'r だけ ×2',g2)+TT('\\times\\tfrac{1}{4}',495,270,g2);
 s+=row(360,'q と r を ×2',g3);
 const x2=495+texWidth('\\times 2',34,false)+18,x3=x2+texWidth('\\div 4',34,false)+26,x4=x3+texWidth('=\\times\\tfrac{1}{2}',34,false);
 s+=fade(g3*(1-a1),label('？',525,360+4*Math.sin(t*4),{size:40,color:MX.hi,anchor:'middle',weight:700}));
 s+=TT('\\times 2',495,360,a1,MX.plus)+TT('\\div 4',x2,360,a2,RC)+TT('=\\times\\tfrac{1}{2}',x3,360,a3,FORCE);
 s+=fade(a3,rect(x3-10,318,x4-x3+22,64,{fill:FORCE,fo:.08,stroke:FORCE,sw:2.5,rx:12}));
 return s;
}
function quizPair(ctx,g,a){
 let s=pair({x1:720,x2:1120,q1:2,q2:1,unit:200,F0:60,ga:a,g});
 s+=fade(g,tx('q',720,172,36,MX.plus)+tx('Q',1120,172,36,MX.plus)+ruler(720,1120,300,1,'')+tx('2r',920,345,32,RC));
 s+=fade(g*(1-a),label('？',920,245+5*Math.sin(ctx.t*4),{size:48,color:MX.hi,anchor:'middle',weight:700}));
 s+=word('力 ×1/2',920,450,{size:28,color:FORCE,anchor:'middle',g:a});
 return s;
}
// One experiment's q, Q, r → X = qQ/r² (the horizontal value), and its measured force (a bar).
const GCALC={ox:110,oy:455,w:600,h:300};
function calcBox({g=1,gv=1,gres=1,gF=0,r2=0,hiX=0,hiF=0}={}){
 let s=callout(850,96,320,410,'',g,{stroke:MX.hi});
 s+=fade(g,label('一回の実験',1010,140,{size:26,color:MX.hi,anchor:'middle',weight:700}));
 s+=fade(gv,tx('q=2',935,196,32,MX.plus)+tx('Q=1',1085,196,32,MX.plus)+fade(1-r2,tx('r=1',1010,248,32,RC))+fade(r2,tx('r=2',1010,248,32,RC)));
 if(r2>0&&r2<1)s+=fade(Math.sin(Math.PI*r2),ring(1010,238,40,{color:MX.hi,w:3}));
 s+=fade(gres,line(880,274,1140,274,{color:MX.faint,w:2})+tx('X=\\dfrac{qQ}{r^2}=',972,338,30,MX.ink)+fade(1-r2,tx('2',1112,338,36,MX.hi))+fade(r2,tx('\\tfrac{1}{2}',1112,338,34,MX.hi))+label('横の値',1010,394,{size:24,color:MX.ink,anchor:'middle',weight:700}));
 if(hiX>0)s+=fade(hiX*4,ring(1112,328,30,{color:MX.hi,w:3}));
 const L=mix(120,30,r2);
 s+=fade(gF,line(880,414,1140,414,{color:MX.faint,w:2})+label('測った力',945,462,{size:24,color:FORCE,anchor:'middle',weight:700})+line(1010,454,1010+L,454,{color:FORCE,w:10}));
 if(hiF>0)s+=fade(hiF*4,`<rect x="998" y="436" width="${L+24}" height="36" rx="8" fill="none" stroke="${FORCE}" stroke-width="2.5"/>`);
 return s;
}
// Pictograms for the たとえ panels.
function clock(x,y){let s=ring(x,y,34,{color:MX.ink,w:3,fill:MX.bg});for(let k=0;k<12;k++){const a=k*Math.PI/6;s+=line(x+28*Math.cos(a),y+28*Math.sin(a),x+32*Math.cos(a),y+32*Math.sin(a),{color:MX.ink,w:2});}
 return s+line(x,y,x,y-22,{color:MX.ink,w:3})+line(x,y,x+16,y+6,{color:MX.ink,w:3})+dot(x,y,3,MX.ink);}
const coin=(x,y)=>ring(x,y,32,{color:MX.hi,w:3,fill:'#3a3220'})+label('円',x,y+11,{size:30,color:MX.hi,anchor:'middle',weight:700});
const bills=(x,y,sym='円',col='#d9c38a')=>rect(x-52,y-24,120,60,{fill:col,fo:.12,stroke:col,sw:2,rx:6})+rect(x-60,y-32,120,60,{fill:MX.bg2,fo:1,stroke:col,sw:3,rx:6})+label(sym,x,y+10,{size:30,color:col,anchor:'middle',weight:700});
const badge=(x,y,n)=>ring(x,y,17,{color:MX.hi,w:2.5,fill:MX.bg})+label(String(n),x,y+8,{size:22,color:MX.hi,anchor:'middle',weight:700});
const swap=(x,y)=>arrow(x-62,y-10,x+62,y-10,{color:MX.dim,w:3,head:12})+arrow(x+62,y+10,x-62,y+10,{color:MX.dim,w:3,head:12});
// Units and the formula for k (shared by mx1-n-kunit and the start of mx1-n-eps).
const unitsRow=({gF=1,gR=1,gQ=1}={})=>word('F：ニュートン N',230,150,{size:26,color:FORCE,anchor:'middle',g:gF})+word('r：メートル m',600,150,{size:26,color:RC,anchor:'middle',g:gR})+word('q, Q：クーロン C',960,150,{size:26,color:MX.plus,anchor:'middle',g:gQ});
const kFormula=g=>fade(g,tex(`{\\color{${MX.hi}}k}=\\dfrac{F}{X}=\\dfrac{F\\,r^2}{qQ}`,360,350,{size:52,color:MX.ink,auto:false})+arrow(565,345,675,345,{color:MX.dim,w:4,head:14})+label('単位',620,325,{size:24,color:MX.dim,anchor:'middle'})
 +tx('\\dfrac{\\mathrm{N}\\cdot\\mathrm{m}^2}{\\mathrm{C}^2}',810,350,52,MX.ink));
// k → ε₀ in three steps; only the current step is bright.
const S3={x:480,y:470};
const stepNo=(n,y)=>ring(150,y-9,21,{color:MX.hi,w:3})+label(String(n),150,y+1,{size:26,color:MX.hi,anchor:'middle',weight:700});
function epsSteps({g1=0,gd=0,gv=0,dim1=0,g2a=0,g2=0,g3a=0,g3=0,box=0}={}){
 const E0=`{\\color{${MX.E}}\\varepsilon_0}`,d1=1-.4*dim1,d2=1-.4*g3a;let s='';
 s+=fade(g1*d1,stepNo(1,228)+tex(`${E0}=\\dfrac{1}{4\\pi k}`,S3.x,228,{size:46,color:MX.ink,auto:false}));
 s+=fade(gd*d1,label('こう決める（定義）',870,235,{size:26,color:MX.hi,anchor:'middle',weight:700}));
 s+=fade(gv*d1,tx('\\varepsilon_0\\approx 8.85\\times 10^{-12}\\ \\mathrm{C^2/(N\\,m^2)}',560,302,30,MX.E));
 s+=fade(g2a*d2,label('両辺に',830,372,{size:26,color:MX.ink,anchor:'end'})+tx('\\times 4\\pi k',900,370,32,MX.hi));
 s+=fade(g2*d2,stepNo(2,365)+tex(`4\\pi k\\,${E0}=1`,S3.x,365,{size:46,color:MX.ink,auto:false}));
 s+=fade(g3a,label('両辺を',830,476,{size:26,color:MX.ink,anchor:'end'})+tex(`\\div 4\\pi${E0}`,900,474,{size:32,color:MX.hi,auto:false}));
 s+=fade(g3,stepNo(3,S3.y)+tex(`{\\color{${MX.hi}}k}=\\dfrac{1}{4\\pi${E0}}`,S3.x,S3.y,{size:46,color:MX.ink,auto:false}));
 const W3=texWidth('k=\\dfrac{1}{4\\pi\\varepsilon_0}',46,false);
 s+=fade(box,`<rect x="${S3.x-W3/2-24}" y="${S3.y-76}" width="${W3+48}" height="114" rx="14" fill="${MX.hi}" fill-opacity=".06" stroke="${MX.hi}" stroke-width="3"/>`);
 return s;
}
