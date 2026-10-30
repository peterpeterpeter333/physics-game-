// Claude 2026-10-25: B-1 overlay for the locally re-rendered scenes. New file; every existing module stays unchanged.
// - All frames: the delivered final3 frame (desk-b1v1-final3-frame.mjs) is the base.
// - Rows 22-23 (iron powder, close camera): the N / S pole labels sit next to the poles (not at the left edge).
// - Earth cross-section frames (rows 26, 28, the fade into row 29, rows 36-37): the old free-floating prediction cards,
//   ellipse and crosses are replaced by 2D labels anchored to the new 3D section (北・南・ロンドン・水平, angle arcs and
//   numbers, the three prediction labels at the line tips, and the ○ / × stamps of row 28). Times follow the cue table.
// Custom 3D anchor projections come from <EM_FILM_CACHE>/claude-anchors.json ({frame:{name:[x,y,visible]}}).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {vertFrame as final3} from './desk-b1v1-final3-frame.mjs';
import {vertFrame as axesFrame} from './desk-axes-frame.mjs';
import {anchor} from './desk-frame.mjs';
import {overlayB1v1 as originalOverlay} from './desk-b1v1-overlay.mjs';
import {topGroups} from './desk-b1v1-review-overlay.mjs';
import {measuredInkWidth} from './desk-axes-text-metrics.mjs';
export * from './desk-b1v1-final3-frame.mjs';

const F='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sm=x=>{x=clamp(x,0,1);return x*x*(3-2*x);},n=x=>Math.round(x*10)/10;
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const LABELS=['北','南','ロンドン','水平','51°','19°','68°','星なら：上','島なら：約20度 下','地球が 磁石なら：約70度 下','N','S'];
const widths=new Map();
for(const label of LABELS)for(const size of [36,40]){
 widths.set(label+'|'+size,await measuredInkWidth(`<svg xmlns="http://www.w3.org/2000/svg" width="2600" height="160"><text x="20" y="110" ${F} font-size="${size}" font-weight="800">${esc(label)}</text></svg>`));
}
const width=(s,size)=>widths.get(s+'|'+size);
// Paper card in the same style as the episode's own cards (desk-b1v1-overlay.mjs card()).
function card(s,cx,cy,{size=36,op=1,bg='#f4e8cc',color='#3b2412',stroke='#b8925a'}={}){
 if(op<.003)return {svg:'',box:null};
 const w=width(s,size)+40,h=size+26,x0=clamp(cx-w/2,40,1040-w),y0=cy-h/2;
 return {box:[x0,y0,x0+w,y0+h],svg:`<g opacity="${n(op)}"><rect x="${n(x0+4)}" y="${n(y0+5)}" width="${n(w)}" height="${h}" rx="8" fill="#2a1406" opacity=".35"/><rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${h}" rx="8" fill="${bg}" stroke="${stroke}" stroke-width="3"/><text x="${n(x0+w/2)}" y="${n(cy+size*.36)}" ${F} font-size="${size}" font-weight="800" text-anchor="middle" fill="${color}">${esc(s)}</text></g>`};
}
let CA=null;
const custom=()=>CA??=JSON.parse(fs.readFileSync((process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-b1v1')+'/claude-anchors.json','utf8'));
const keyOf=(s,t)=>{const k=Math.max(0,s.captions.findLastIndex(x=>x.start<=t));return {k,key:s.cues[k].diagram.replace('cb1v1-',''),q:s.cues[k]};};
const IMG=/<image x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" href="data:image\/jpeg;base64,[^"]*"\/>/g;
function afterImage(svg,add){const m=[...svg.matchAll(IMG)];assert.equal(m.length,1);return svg.replace(m[0][0],m[0][0]+add);}

// ---------- rows 22-23: pole labels next to the poles ----------
const POWDER=['lines:iron','lines:follow','lines:dip'];
function powderFrame(c,s,t){
 const {k,key,q}=keyOf(s,t),svg=axesFrame(c,s,t);
 const ctx={t,clip:c,scene:s,cue:q,cap:s.captions[k],k,anchor:name=>anchor(name,t)};
 const N=ctx.anchor('poleN'),S=ctx.anchor('poleS');
 const place={N:N?.[2]?[N[0]+92,N[1]+34]:null,S:S?.[2]?[S[0]+92,S[1]-34]:null};
 // The original card helper puts the N card at anchor+35 and the S card at anchor-75; feed it the wanted centres.
 const shifted={...ctx,anchor:name=>{const p=ctx.anchor(name);if(!p?.[2])return p;
  if(name==='poleN'&&place.N)return [place.N[0],place.N[1]-35,p[2]];
  if(name==='poleS'&&place.S)return [place.S[0],place.S[1]+75,p[2]];return p;}};
 const before=originalOverlay(ctx);let after=originalOverlay(shifted);
 const label=(fragment,txt)=>{const f=topGroups(fragment).filter(g=>new RegExp('>'+txt+'</text>').test(g));assert.equal(f.length,1);return f[0];};
 if(key!=='lines:iron'){const proto=originalOverlay({...shifted,cue:{...q,diagram:'cb1v1-lines:iron'}});after+=label(proto,'N')+label(proto,'S');}
 let leaders='',dots='';
 for(const [nm,a,color,p] of [['N',166.91,'#b32d25',N],['S',170.13,'#245fbe',S]]){
  if(t<a||!p?.[2])continue;const op=sm((t-a)/.22),cc=place[nm];
  leaders+=`<path d="M${n(cc[0]-30)} ${n(cc[1])} L${n(p[0])} ${n(p[1])}" fill="none" stroke="${color}" stroke-width="3" opacity="${n(op)}"/>`;
  dots+=`<circle cx="${n(p[0])}" cy="${n(p[1])}" r="8" fill="${nm==='N'?'#d6453d':'#3a6fd8'}" stroke="#372f2a" stroke-width="1.4" opacity="${op.toFixed(3)}"/>`;
 }
 if(!before){assert(!q.face,'Do not place a new overlay over a face');return afterImage(svg,dots+leaders+after);}
 assert(svg.split(before).length===2,'Exact original B overlay must occur once');
 return afterImage(svg.replace(before,leaders+after),dots);
}

// ---------- earth cross-section ----------
const SECTION_KEYS=['test:others','test:island','test:judge','test:mio','next:mio','next:later'];
const ARC=[{i:0,r:62,nr:130,fr:.25,txt:'51°',col:'#9b771a',stroke:'#e0b21c',at:222.13},
           {i:1,r:122,nr:230,fr:.5,txt:'19°',col:'#6b4426',stroke:'#8e5a2e',at:229.27},
           {i:2,r:92,nr:175,fr:.75,txt:'68°',col:'#303947',stroke:'#3b3b3b',at:234.40}];
function angleOf(a,b){return Math.atan2(b[1]-a[1],b[0]-a[0]);}
function sectionLayer(t,key,P){
 const on=a=>sm((t-a)/.25);let s='';const predict=['test:others','test:island','test:judge','test:mio'].includes(key);
 const C=P.c_secCenter,Nn=P.c_secNorth,Ss=P.c_secSouth;
 // 北 above the north pole, 南 inside the disc above the south pole (the caption band starts below it)
 {const nb=card('北',Nn[0]+75,Nn[1]-108,{size:40});if(nb.box)s+=`<path d="M${n(nb.box[0]+14)} ${n(nb.box[3])} L${n(Nn[0])} ${n(Nn[1]-8)}" stroke="#7a5a35" stroke-width="3"/>`;s+=nb.svg;}
 s+=card('南',Ss[0],Ss[1]-(Ss[1]-C[1])*.55,{size:40}).svg;
 if(!predict)return s;
 const L=P.c_london,HA=P.c_horizonA;
 s+=card('ロンドン',L[0]+128,L[1]-44,{size:36}).svg;
 s+=card('水平',HA[0]+62,HA[1]+40,{size:36,bg:'#ffffff',stroke:'#9a9a9a'}).svg;
 // angle arcs + numbers, measured from the local horizontal (toward north) at London
 const a0=angleOf(L,P.c_tan);
 for(const r of ARC){
  if(t<r.at)continue;const a1=angleOf(L,P['c_dir'+r.i]),op=on(r.at);
  let d=a1-a0;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
  const p0=[L[0]+r.r*Math.cos(a0),L[1]+r.r*Math.sin(a0)],p1=[L[0]+r.r*Math.cos(a1),L[1]+r.r*Math.sin(a1)];
  s+=`<path d="M${n(p0[0])} ${n(p0[1])} A${r.r} ${r.r} 0 0 ${d>0?1:0} ${n(p1[0])} ${n(p1[1])}" fill="none" stroke="${r.stroke}" stroke-width="5" opacity="${n(op)}"/>`;
  const am=a0+d*r.fr;s+=card(r.txt,L[0]+r.nr*Math.cos(am),L[1]+r.nr*Math.sin(am),{size:36,color:r.col,op}).svg;
 }
 // prediction labels at the tips of the three lines
 const SE=P.c_starEnd,IE=P.c_islandEnd,ME=P.c_magEnd;
 const star=card('星なら：上',SE[0]+45,SE[1]-52,{size:36,color:'#7d5f10',op:on(222.13)});
 const isl=card('島なら：約20度 下',IE[0]-110,IE[1]+165,{size:36,color:'#6b4426',op:on(232.30)});
 const mag=card('地球が 磁石なら：約70度 下',ME[0],ME[1]+78,{size:36,color:'#303947',op:on(234.40+.3)});
 s+=star.svg+isl.svg+mag.svg;
 // row 28: ○ for the earth-magnet prediction, × for the star and the island
 if(key==='test:judge'||key==='test:mio'){
  if(t>=253.85&&mag.box){const b=mag.box,u=sm((t-253.85)/.2);s+=`<ellipse cx="${n((b[0]+b[2])/2)}" cy="${n((b[1]+b[3])/2)}" rx="${n((b[2]-b[0])/2+26)}" ry="${n((b[3]-b[1])/2+22)}" fill="none" stroke="#3f9a55" stroke-width="8" opacity="${n(u)}"/>`;}
  for(const [c,a] of [[star,255.98],[isl,257.13]])if(t>=a&&c.box){const b=c.box,u=sm((t-a)/.2),cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2,hw=(b[2]-b[0])/2+8,hh=(b[3]-b[1])/2+10;
   s+=`<path d="M${n(cx-hw)} ${n(cy-hh)} L${n(cx+hw)} ${n(cy+hh)} M${n(cx-hw)} ${n(cy+hh)} L${n(cx+hw)} ${n(cy-hh)}" fill="none" stroke="#d6453d" stroke-width="8" stroke-linecap="round" opacity="${n(u)}"/>`;}
 }
 return s;
}
function sectionFrame(c,s,t,P){
 const {key}=keyOf(s,t);let svg=final3(c,s,t);
 // remove the old free-floating judge marks (fixed positions in desk-b1v1-overlay.mjs)
 svg=svg.replace(/<ellipse cx="805" cy="970" rx="210" ry="64" fill="none" stroke="#5aa469" stroke-width="7"\/>/g,'');
 svg=svg.replace(/<path d="M630 \d+l350 70m-350 0l350 -70" fill="none" stroke="#d6453d" stroke-width="8"\/>/g,'');
 return afterImage(svg,sectionLayer(t,key,P));
}

export function vertFrame(c,s,t){
 if(!c||c.id!=='ys-chain-b1v1'||s.deskFrame!=='b1v1')return final3(c,s,t);
 const j=Math.round(t*30),{key}=keyOf(s,t),P=custom()[String(j)];
 if(P&&P.mode==='section'&&SECTION_KEYS.includes(key))return sectionFrame(c,s,t,P);
 if(P&&P.mode==='powder'&&POWDER.includes(key))return powderFrame(c,s,t);
 return final3(c,s,t);
}
