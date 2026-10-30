// E-1 fix by Claude (2026-10-25). New wrapper; shared compositor/overlay unchanged.
// Rows 15-16 only: town labels and 2D noon suns follow the actual projected
// dolls ($EM_FILM_CACHE/claude-fix-towns.json, written by the Blender fix);
// the two row-16 cards move next to their own doll. Every other frame is the
// unchanged desk-axes-frame output.
import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {vertFrame as baseVertFrame} from './desk-axes-frame.mjs';
import {paper} from './desk-overlay-lib.mjs';
export * from './desk-axes-frame.mjs';

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const sm=x=>{x=clamp(x);return x*x*(3-2*x);};
const n=x=>+x.toFixed(1);
const jw=s=>[...s].reduce((a,c)=>a+(/[ -~]/.test(c)?.62:1),0);
let FIX=null;
function fix(){
 if(FIX===null){const f=(process.env.EM_FILM_CACHE??'')+'/claude-fix-towns.json';FIX=existsSync(f)?JSON.parse(readFileSync(f,'utf8')):{frames:{}};}
 return FIX;
}
function card(text,x,y,op=1,size=40){
 const w=jw(text)*size+44;x=clamp(x,40+w/2,1040-w/2);
 return paper([[text,'#3b2412']],x,y,{size,op,anchor:'middle',mark:null});
}
function sun(x,y,s,op){
 let r='';for(let k=0;k<8;k++){const a=k*Math.PI/4;r+=`<line x1="${n(x+24*s*Math.cos(a))}" y1="${n(y+24*s*Math.sin(a))}" x2="${n(x+36*s*Math.cos(a))}" y2="${n(y+36*s*Math.sin(a))}" stroke="#ffd23f" stroke-width="${n(6*s)}" stroke-linecap="round"/>`;}
 return `<g opacity="${n(op)}"><circle cx="${n(x)}" cy="${n(y)}" r="${n(19*s)}" fill="#ffd23f" stroke="#b07b10" stroke-width="${n(3*s)}"/>${r}</g>`;
}
export function vertFrame(c,s,t){
 const svg=baseVertFrame(c,s,t);
 const j=Math.round(t*30),F=fix(),row=F.frames[String(j)];
 if(!row||!svg)return svg;
 let out=svg;
 const at=F.times;
 // Remove the original row-16 cards stacked at the centre (exact strings).
 for(const [text,a,y] of [['東 → 先に 昼',at.east16,460],['西 → 遅れて 昼',at.west16,560]]){
  const old=paper([[text,'#3b2412']],540,y,{size:40,op:sm((t-a)/.22),anchor:'middle',mark:null});
  if(old){assert.equal(out.split(old).length,2,'original row16 card must occur once');out=out.replace(old,'');}
 }
 // Lift the noon card above the town labels (same card, y 360 -> 296).
 {const txt='光の 真ん中 ＝ 昼の 12時',old=paper([[txt,'#3b2412']],540,360,{size:40,op:1,anchor:'middle',mark:null});
  if(out.includes(old)){assert.equal(out.split(old).length,2);out=out.replace(old,paper([[txt,'#3b2412']],540,296,{size:40,op:1,anchor:'middle',mark:null}));}}
 let layer='';
 for(const [key,name,label,a16] of [['east','東の 町','東 → 先に 昼',at.east16],['west','西の 町','西 → 遅れて 昼',at.west16]]){
  const d=row[key];if(!d||!d.vis)continue;
  const [x,y]=d.top;const op=sm((t-at.labels)/.3)*d.fade;
  if(op<=.003)continue;
  if(d.noon){const age=t-d.cross;const pop=1+.45*Math.sin(Math.PI*clamp(age/.5))*(age<.5?1:0);layer+=sun(x,y-34,pop,op*sm(age/.12));}
  // Row 16: the town name card turns into its own conclusion card, in place.
  const u=t>=a16?sm((t-a16)/.22):0;
  if(u<1)layer+=card(name,x,y-104,op*(1-u),40);
  if(u>0)layer+=card(label,x+(key==='east'?F.dx16.east:F.dx16.west),y-104,op*u,40);
 }
 if(!layer)return out;
 const i=out.indexOf('<image ');assert(i>=0);const k=out.indexOf('"/>',i);assert(k>i);
 return out.slice(0,k+3)+layer+out.slice(k+3);
}
