// Shared look for the long Maxwell film (experiments/maxwell-journey.mjs).
// Documentary tone: muted dark stage, 2–3 accent colours, one persistent element (the
// "four equations" bar at the top) that lights up chapter by chapter.
// Stage 1200×515. The bar occupies y 0–112; put the picture in y 120–515.
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth} from './anim.mjs';

export const MX={bg:'#0d1526',bg2:'#131f38',ink:'#eef3fb',dim:'#8d9cb8',faint:'#2a3854',
 E:'#7fd4ff',B:'#ffb347',plus:'#ff6b6b',minus:'#5b8cff',I:'#ffe066',good:'#6fe3a8',hi:'#ffd166',paper:'#f4efe4',paperInk:'#2a2a2a'};
export {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth};

// Background with a soft vignette. `glow` adds a faint light behind the centre of interest.
export function bg({glow=null}={}){
 return `<defs><radialGradient id="mxvig" cx="50%" cy="55%" r="75%"><stop offset="0" stop-color="${MX.bg2}"/><stop offset="1" stop-color="${MX.bg}"/></radialGradient></defs><rect x="0" y="0" width="1200" height="515" rx="18" fill="url(#mxvig)"/>`
  +(glow?`<circle cx="${glow[0]}" cy="${glow[1]}" r="${glow[2]??220}" fill="${glow[3]??MX.E}" fill-opacity=".06"/>`:'');
}
// Slow Ken-Burns style zoom around (cx,cy): s grows from 1 to 1+amt over the sentence.
export const zoom=(p,cx,cy,amt,svg)=>{const s=1+amt*smooth(p);return `<g transform="translate(${cx} ${cy}) scale(${s.toFixed(4)}) translate(${-cx} ${-cy})">${svg}</g>`;};

const wlen=(s,size)=>[...s].reduce((a,ch)=>a+(/[\x20-\x7e]/.test(ch)?.6:1)*size,0);
// Short words or phrases only.
export function word(s,x,y,{size=32,color=MX.ink,anchor='start',bg=MX.bg,g=1,border=null}={}){
 const w=wlen(s,size)+34,h=size*1.55,left=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return fade(g,`<rect x="${left}" y="${y-h*.72}" width="${w}" height="${h}" rx="12" fill="${bg}" fill-opacity=".92" stroke="${border??color}" stroke-opacity=".6" stroke-width="2"/>`+label(s,left+17,y+size*.1,{size,color,weight:700}));
}
export function callout(x,y,w,h,inner,g=1,{fill=MX.bg2,stroke=MX.faint}={}){return fade(g,`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" fill-opacity=".96" stroke="${stroke}" stroke-width="2"/>`+inner);}
// "A → B" two-word causal card.
export function causal(a,b,x,y,{g=1,ca=MX.ink,cb=MX.hi,size=34}={}){const wa=wlen(a,size),wb=wlen(b,size),tot=wa+wb+80,l=x-tot/2;return fade(g,label(a,l,y,{size,color:ca,weight:700})+label('→',l+wa+40,y,{size,color:MX.dim,anchor:'middle'})+label(b,l+wa+80,y,{size,color:cb,weight:700}));}
// Primary-source quote card (serif, attribution).
export function quote(lines,who,{g=1,y=170}={}){
 return fade(g,`<rect x="140" y="${y-40}" width="920" height="${lines.length*50+120}" rx="10" fill="${MX.paper}" fill-opacity=".97"/>`+label('“',175,y+30,{size:80,color:'#b9a98a'})
  +lines.map((l,i)=>`<text x="230" y="${y+40+i*50}" font-size="34" fill="${MX.paperInk}" font-family="'Hiragino Mincho ProN','Yu Mincho',serif">${l.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>`).join('')
  +`<text x="1030" y="${y+lines.length*50+55}" font-size="24" fill="#6b6152" text-anchor="end" font-family="'Hiragino Mincho ProN','Yu Mincho',serif">${who}</text>`);
}
export const check=(x,y,g)=>fade(g,ring(x,y,26,{color:MX.good,w:4,fill:MX.bg})+draw([[x-12,y],[x-3,y+10],[x+14,y-10]],clamp(g*1.4),{color:MX.good,w:5}));

// ---- the four Maxwell equations -------------------------------------------------------
const cE=v=>`{\\color{${MX.E}}${v}}`,cB=v=>`{\\color{${MX.B}}${v}}`;
export const EQ={
 1:{name:'ガウスの法則',tex:`\\oint ${cE('\\vec E')}\\cdot d\\vec A=\\dfrac{Q}{\\varepsilon_0}`},
 2:{name:'磁場のガウスの法則',tex:`\\oint ${cB('\\vec B')}\\cdot d\\vec A=0`},
 3:{name:'ファラデーの法則',tex:`\\oint ${cE('\\vec E')}\\cdot d\\vec r=-\\dfrac{d\\Phi_B}{dt}`},
 4:{name:'アンペール・マクスウェル',tex:`\\oint ${cB('\\vec B')}\\cdot d\\vec r=\\mu_0 I+\\mu_0\\varepsilon_0\\dfrac{d\\Phi_E}{dt}`},
 '4a':{name:'アンペールの法則',tex:`\\oint ${cB('\\vec B')}\\cdot d\\vec r=\\mu_0 I\\;{\\color{#5a6680}+\\;?}`},
};
// Place a TeX string scaled to fit width w (centre x, baseline-ish y).
export function fit(src,x,y,w,size=40,opts={}){const tw=texWidth(src,size,false);const s=Math.min(size,size*w/tw);return tex(src,x,y,{size:s,auto:false,...opts});}
const slotX=[150,450,750,1050];
// state: array like [1,2,'4a'] ; focus: 1..4 ; p for the pulse.
export function eqBar(state=[],focus=null,p=0){
 let s=`<rect x="0" y="0" width="1200" height="112" rx="18" fill="#0a111f" fill-opacity=".97"/>`+line(20,112,1180,112,{color:MX.faint,w:2});
 for(let i=1;i<=4;i++){
  const x=slotX[i-1],on=state.includes(i),half=i===4&&state.includes('4a')&&!on,foc=focus===i,pulse=foc?.5+.5*Math.sin(p*16):0;
  s+=`<rect x="${x-142}" y="8" width="284" height="96" rx="12" fill="${on||half?'#16223d':'#0f1829'}" stroke="${foc?MX.hi:on||half?'#33476e':'#1d2a44'}" stroke-width="${foc?3+2*pulse:2}"/>`;
  s+=label(`${'①②③④'[i-1]} ${on||half?EQ[half?'4a':i].name:'？'}`,x-130,26,{size:17,color:on||half?MX.dim:'#3d4b66'});
  const src=on?EQ[i].tex:half?EQ['4a'].tex:EQ[i].tex.replace(/\\color\{[^}]*\}/g,'');
  s+=on||half?fit(src,x,82,258,30,{color:MX.ink}):fit(src,x,82,258,30,{color:'#2e3b57'});
 }
 return s;
}
// Stage wrapper used by every diagram: background + picture + the bar on top.
export function stage(ctx,p,inner,{glow=null}={}){const q=ctx?.cue??{};
 const labels=q.barLabels??['電荷','磁石','磁束の変化','電流と電場の変化'];
 const compact=q.compactBar?labels.map((s,i)=>{
  const on=(q.eqs??[]).includes(i+1)||(i===3&&(q.eqs??[]).includes('4a')),foc=q.eqFocus===i+1,pulse=foc?.5+.5*Math.sin(p*16):0;
  return (foc?`<rect x="${52+i*292}" y="18" width="262" height="44" rx="10" fill="${MX.hi}" fill-opacity="${.08+.06*pulse}" stroke="${MX.hi}" stroke-width="2"/>`:'')
   +dot(72+i*292,40,7,on?MX.hi:MX.faint)+label(`${'①②③④'[i]} ${s}`,86+i*292,48,{size:22,color:foc?MX.hi:on?MX.ink:MX.dim});
 }).join('')+line(30,72,1170,72,{color:MX.faint,w:2}):'';
 return bg({glow})+inner+(q.compactBar?compact:q.eqs?eqBar(q.eqs,q.eqFocus??null,p):'');}

// The two starting experiments (v2 film): side 0 = force between charges (→ ε₀),
// side 1 = magnetic field around a current, read with compasses (→ μ₀). 470×300 at (x0,y0).
// gn: the constant badge; glow: highlight the border; t: seconds (animates the compasses/current).
export function evidenceCard(side,x0,y0,{g=1,gn=0,glow=0,t=0,title=true}={}){
 const col=side?MX.B:MX.E,cx=x0+235;
 let s=`<rect x="${x0}" y="${y0}" width="470" height="300" rx="18" fill="${MX.bg2}" fill-opacity=".96" stroke="${col}" stroke-opacity="${.45+.55*glow}" stroke-width="${3+3*glow}"/>`;
 if(title)s+=label(side?'電流のまわりの磁場を測る':'電荷どうしの力を測る',cx,y0+48,{size:28,color:MX.ink,anchor:'middle',weight:700});
 if(!side){
  s+=charge(x0+150,y0+145,1,{r:26})+charge(x0+320,y0+145,1,{r:26})
   +arrow(x0+118,y0+145,x0+58,y0+145,{color:C.F,w:6,head:16})+arrow(x0+352,y0+145,x0+412,y0+145,{color:C.F,w:6,head:16});
 }else{
  const wx=cx,wy=y0+145;
  s+=line(wx,y0+72,wx,y0+228,{color:'#c9d3e6',w:6})+arrow(wx+22,y0+200,wx+22,y0+100,{color:MX.I,w:4,head:12});
  s+=`<ellipse cx="${wx}" cy="${wy}" rx="120" ry="34" fill="none" stroke="${MX.B}" stroke-width="3" stroke-dasharray="10 8" stroke-opacity=".8"/>`;
  for(const [dx,dy,a] of [[-120,0,-90],[120,0,90],[0,34,0],[0,-34,180]])s+=compass(wx+dx,wy+dy,a,{r:18});
 }
 s+=fade(gn,ring(cx,y0+252,34,{color:col,w:4,fill:'#0d1526'})+tex(side?'\\mu_0':'\\varepsilon_0',cx,y0+260,{size:44,color:col,auto:false}));
 return fade(g,s);
}

// ---- common physical objects -------------------------------------------------------------
export function charge(x,y,sign,{r=26,g=1,label:lab=true}={}){const col=sign>0?MX.plus:MX.minus;return fade(g,`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" fill-opacity=".9" stroke="#ffffff" stroke-opacity=".5" stroke-width="2"/>`+(lab?label(sign>0?'+':'−',x,y+r*.42,{size:r*1.2,color:'#ffffff',anchor:'middle',weight:700}):''));}
export function magnet(x,y,{w=260,h=70,angle=0,g=1}={}){return fade(g,`<g transform="rotate(${angle} ${x} ${y})"><rect x="${x-w/2}" y="${y-h/2}" width="${w/2}" height="${h}" fill="${MX.minus}" rx="6"/><rect x="${x}" y="${y-h/2}" width="${w/2}" height="${h}" fill="${MX.plus}" rx="6"/>`+label('S',x-w/4,y+12,{size:34,color:'#fff',anchor:'middle',weight:700})+label('N',x+w/4,y+12,{size:34,color:'#fff',anchor:'middle',weight:700})+'</g>');}
export function compass(x,y,angle,{r=22,g=1}={}){const a=angle*Math.PI/180,dx=Math.cos(a)*r*.85,dy=-Math.sin(a)*r*.85;return fade(g,ring(x,y,r,{color:'#c9d3e6',w:2,fill:'#1a2540'})+`<polygon points="${x+dx},${y+dy} ${x-dy*.25},${y+dx*.25} ${x+dy*.25},${y-dx*.25}" fill="${MX.plus}"/><polygon points="${x-dx},${y-dy} ${x-dy*.25},${y+dx*.25} ${x+dy*.25},${y-dx*.25}" fill="#dfe6f2"/>`);}
// Electric field of point charges [{x,y,q}] (screen units). Returns field line polylines
// traced from `n` seeds around each positive charge (or negative if none positive).
export function fieldLines(charges,{n=12,step=4,maxSteps=500,bounds=[0,120,1200,515]}={}){
 const E=(x,y)=>{let ex=0,ey=0;for(const c of charges){const dx=x-c.x,dy=y-c.y,r2=dx*dx+dy*dy+1e-6,r3=r2*Math.sqrt(r2);ex+=c.q*dx/r3;ey+=c.q*dy/r3;}return [ex,ey];};
 const src=charges.filter(c=>c.q>0),dir=src.length?1:-1,from=src.length?src:charges.filter(c=>c.q<0),lines=[];
 for(const c of from){for(let k=0;k<n;k++){const a=2*Math.PI*(k+.5)/n;let x=c.x+18*Math.cos(a),y=c.y+18*Math.sin(a);const pts=[[x,y]];
  for(let i=0;i<maxSteps;i++){const [ex,ey]=E(x,y),m=Math.hypot(ex,ey);if(m<1e-12)break;x+=dir*step*ex/m;y+=dir*step*ey/m;pts.push([x,y]);
   if(x<bounds[0]||y<bounds[1]||x>bounds[2]||y>bounds[3])break;if(charges.some(o=>o!==c&&Math.hypot(x-o.x,y-o.y)<16))break;}
  lines.push(pts);}}
 return lines;
}
