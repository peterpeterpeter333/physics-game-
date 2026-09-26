// Animation kit for the university-mechanics films (3Blue1Brown-style):
// objects persist, lines are drawn on, formulas grow out of the picture.
// Every function is a pure function of progress, so frames are deterministic.
import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js';
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';

// One colour per physical quantity, identical in every film.
export const C={bg:'#0b1122',ink:'#edf4ff',dim:'#9aabc7',faint:'#3a4a66',grid:'#1c2a44',
 x:'#6adfff',v:'#b49bff',a:'#ff8f9b',F:'#83ecc0',t:'#ffcf67',m:'#edf4ff',E:'#ffb36b',p:'#ff9ce6',hi:'#ffe28a'};
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const mix=(a,b,u)=>a+(b-a)*u;
export const smooth=p=>{p=clamp(p);return p*p*(3-2*p);};
// Sub-progress of p inside the window [a,b], eased.
export const seg=(p,a,b)=>smooth((p-a)/Math.max(1e-6,b-a));
export const lin=(p,a,b)=>clamp((p-a)/Math.max(1e-6,b-a));
export const fmt=(v,n=1)=>{const r=Number(v.toFixed(n));return Math.abs(r)<1e-9?'0':String(r);};
export const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const n=v=>Number(v.toFixed(2));

export const fade=(a,svg)=>a<=0.001?'':a>=.999?svg:`<g opacity="${n(a)}">${svg}</g>`;
export const move=(dx,dy,svg)=>`<g transform="translate(${n(dx)} ${n(dy)})">${svg}</g>`;
export const scaleAt=(x,y,s,svg)=>`<g transform="translate(${n(x)} ${n(y)}) scale(${n(s)}) translate(${n(-x)} ${n(-y)})">${svg}</g>`;
export function label(s,x,y,{size=26,color=C.ink,anchor='start',weight=400,opacity=1}={}){
 return `<text x="${n(x)}" y="${n(y)}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-weight="${weight}"${opacity<1?` opacity="${n(opacity)}"`:''}>${esc(s)}</text>`;
}
export const line=(x,y,X,Y,{color=C.dim,w=2,dash='',opacity=1,cap='round'}={})=>`<line x1="${n(x)}" y1="${n(y)}" x2="${n(X)}" y2="${n(Y)}" stroke="${color}" stroke-width="${w}" stroke-linecap="${cap}"${dash?` stroke-dasharray="${dash}"`:''}${opacity<1?` opacity="${n(opacity)}"`:''}/>`;
export const rect=(x,y,w,h,{fill=C.x,fo=.25,stroke,sw=2,rx=6,opacity=1}={})=>`<rect x="${n(x)}" y="${n(y)}" width="${n(Math.max(0,w))}" height="${n(Math.max(0,h))}" rx="${rx}" fill="${fill}" fill-opacity="${fo}" stroke="${stroke??fill}" stroke-width="${sw}"${opacity<1?` opacity="${n(opacity)}"`:''}/>`;
export const dot=(x,y,r=8,color=C.hi,opacity=1)=>`<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${color}"${opacity<1?` fill-opacity="${n(opacity)}"`:''}/>`;
export const ring=(x,y,r,{color=C.dim,w=2,dash='',fill='none'}={})=>`<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${fill}" stroke="${color}" stroke-width="${w}"${dash?` stroke-dasharray="${dash}"`:''}/>`;

// A polyline drawn on progressively (p=0 nothing, p=1 complete).
export function draw(pts,p=1,{color=C.x,w=4,fill='none',dash='',opacity=1}={}){
 if(pts.length<2||p<=0)return '';
 let L=0;const seglen=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seglen.push(d);L+=d;}
 let want=L*clamp(p),out=[pts[0]];
 for(let i=1;i<pts.length&&want>0;i++){const d=seglen[i-1];if(d<=want){out.push(pts[i]);want-=d;}else{const u=want/d;out.push([mix(pts[i-1][0],pts[i][0],u),mix(pts[i-1][1],pts[i][1],u)]);want=0;}}
 return `<polyline points="${out.map(q=>`${n(q[0])},${n(q[1])}`).join(' ')}" fill="${fill}" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}${opacity<1?` opacity="${n(opacity)}"`:''}/>`;
}
export const poly=(pts,{fill=C.x,fo=.25,stroke='none',sw=2}={})=>`<polygon points="${pts.map(q=>`${n(q[0])},${n(q[1])}`).join(' ')}" fill="${fill}" fill-opacity="${fo}" stroke="${stroke}" stroke-width="${sw}"/>`;

// Arrow with a filled head; grows from its tail with g in [0,1].
export function arrow(x,y,X,Y,{color=C.hi,w=5,g=1,head=18,text='',tsize=24,tdx=10,tdy=-10,opacity=1}={}){
 const XX=mix(x,X,g),YY=mix(y,Y,g),L=Math.hypot(XX-x,YY-y);if(L<1||g<=0)return '';
 const a=Math.atan2(YY-y,XX-x),h=Math.min(head,L*.6),bx=XX-h*Math.cos(a),by=YY-h*Math.sin(a);
 const s=`${line(x,y,bx,by,{color,w})}<polygon points="${n(XX)},${n(YY)} ${n(bx+h*.5*Math.sin(a))},${n(by-h*.5*Math.cos(a))} ${n(bx-h*.5*Math.sin(a))},${n(by+h*.5*Math.cos(a))}" fill="${color}"/>`+(text?label(text,XX+tdx,YY+tdy,{size:tsize,color}):'');
 return opacity<1?fade(opacity,s):s;
}
// Curly brace from (x1,y) to (x2,y), opening downward when dir=1.
export function brace(x1,x2,y,{dir=1,color=C.dim,text='',size=24,g=1}={}){
 const m=(x1+x2)/2,d=14*dir;
 return fade(g,`<path d="M${n(x1)} ${n(y)} q0 ${d} ${d*.9} ${d} L${n(m-10)} ${n(y+d)} q10 0 10 ${d} q0 ${-d} 10 ${-d} L${n(x2-d*.9)} ${n(y+d)} q${d*.9} 0 ${d*.9} ${-d}" fill="none" stroke="${color}" stroke-width="2.5"/>`+(text?label(text,m,y+d*3.2+(dir>0?6:0),{size,color,anchor:'middle'}):''));
}
export function highlight(x,y,w,h,g=1,color=C.hi){return fade(g*.9,`<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="10" fill="${color}" fill-opacity=".08" stroke="${color}" stroke-width="2.5"/>`);}

// A coordinate plane mapping data (u,v) to screen. Returns helpers and svg.
export function axes({x=110,y=420,w=820,h=320,xmax=1,ymax=1,xmin=0,ymin=0,xlabel='',ylabel='',xticks=[],yticks=[],g=1,grid=false,xcolor=C.dim,ycolor=C.dim}={}){
 const X=u=>x+w*(u-xmin)/(xmax-xmin),Y=v=>y-h*(v-ymin)/(ymax-ymin);
 const oy=Y(clamp(0,ymin,ymax)),ox=X(clamp(0,xmin,xmax));
 let s='';
 if(grid)s+=yticks.map(v=>line(x,Y(v),x+w,Y(v),{color:C.grid,w:1.5})).join('')+xticks.map(u=>line(X(u),y,X(u),y-h,{color:C.grid,w:1.5})).join('');
 s+=arrow(x-10,oy,x+w+30,oy,{color:C.dim,w:2.5,head:14,g})+arrow(ox,y+10,ox,y-h-30,{color:C.dim,w:2.5,head:14,g});
 s+=fade(g,xticks.map(u=>line(X(u),oy-6,X(u),oy+6,{color:C.dim})+label(String(u),X(u),oy+34,{size:21,color:C.dim,anchor:'middle'})).join('')+yticks.map(v=>line(ox-6,Y(v),ox+6,Y(v),{color:C.dim})+label(String(v),ox-14,Y(v)+8,{size:21,color:C.dim,anchor:'end'})).join(''));
 s+=fade(g,label(xlabel,x+w+36,oy+8,{size:24,color:xcolor})+label(ylabel,ox,y-h-44,{size:24,color:ycolor,anchor:'middle'}));
 const plot=(fn,{from=xmin,to=xmax,p=1,color=C.x,w=4,steps=160,dash=''}={})=>draw(Array.from({length:steps+1},(_,i)=>{const u=from+(to-from)*i/steps;return [X(u),Y(fn(u))];}),p,{color,w,dash});
 return {svg:s,X,Y,plot};
}

export function ground(x1,x2,y,color=C.faint){let s=line(x1,y,x2,y,{color:C.dim,w:3});for(let q=x1;q<x2;q+=26)s+=line(q,y+2,q-14,y+18,{color,w:2});return s;}
export function block(x,y,w,h,{color=C.x,text='',size=26,fo=.28}={}){return rect(x-w/2,y-h,w,h,{fill:color,fo,rx:8})+(text?label(text,x,y-h/2+size*.36,{size,color:C.ink,anchor:'middle'}):'');}
export function cart(x,y,{w=120,h=56,color=C.x,text='',size=24}={}){return rect(x-w/2,y-h-16,w,h,{fill:color,fo:.3,rx:8})+ring(x-w*.3,y-12,12,{color:C.dim,w:3,fill:C.bg})+ring(x+w*.3,y-12,12,{color:C.dim,w:3,fill:C.bg})+(text?label(text,x,y-h/2-8,{size,color:C.ink,anchor:'middle'}):'');}
export function spring(x1,x2,y,{coils=9,amp=16,color=C.dim,w=3}={}){const pts=[[x1,y],[x1+14,y]];const L=x2-x1-28;for(let i=0;i<=coils*2;i++)pts.push([x1+14+L*i/(coils*2),y+(i===0||i===coils*2?0:(i%2?amp:-amp))]);pts.push([x2,y]);return draw(pts,1,{color,w});}
export function wall(x,y1,y2){let s=line(x,y1,x,y2,{color:C.dim,w:4});for(let q=y1;q<y2;q+=24)s+=line(x,q,x-16,q+14,{color:C.faint,w:2});return s;}

// TeX rendered to paths. Letters for quantities are coloured consistently.
const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);
const doc=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const QUANTITY={x:C.x,v:C.v,a:C.a,F:C.F,t:C.t};
export function colorize(tex){
 // Names inside \text{}, \mathrm{}, \color{} and command words are never recoloured.
 return tex.replace(/\\(?:text|mathrm|operatorname|begin|end|color)\{[^{}]*\}|\\[a-zA-Z]+|\\.|[xvaFt]/g,v=>QUANTITY[v]?`{\\color{${QUANTITY[v]}}${v}}`:v);
}
const texCache=new Map();
function texRaw(src){
 if(texCache.has(src))return texCache.get(src);
 let svg=adaptor.outerHTML(adaptor.firstChild(doc.convert(src,{display:true})));
 if(/data-mjx-error|data-mml-node="merror"/.test(svg))throw Error(`Invalid TeX: ${src}`);
 const [vx,vy,vw,vh]=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
 const inner=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
 const r={inner,vx,vy,vw,vh};texCache.set(src,r);return r;
}
// Place TeX with its baseline-ish centre at (x,y). size = rendered height of an "x" row in px (~font size).
export function tex(src,x,y,{size=40,color=C.ink,anchor='middle',auto=true,opacity=1}={}){
 const {inner,vx,vy,vw,vh}=texRaw(`\\color{${color}}{${auto?colorize(src):src}}`);
 const k=size/1000,W=vw*k,H=vh*k,left=anchor==='middle'?x-W/2:anchor==='end'?x-W:x;
 return `<g transform="translate(${n(left-vx*k)} ${n(y-(vy+vh)*k+H*.3)}) scale(${k})" fill="${color}" stroke="${color}" stroke-width="0"${opacity<1?` opacity="${n(opacity)}"`:''}>${inner.replaceAll('currentColor',color)}</g>`;
}
export function texWidth(src,size=40,auto=true){const {vw}=texRaw(`\\color{${C.ink}}{${auto?colorize(src):src}}`);return vw*size/1000;}
