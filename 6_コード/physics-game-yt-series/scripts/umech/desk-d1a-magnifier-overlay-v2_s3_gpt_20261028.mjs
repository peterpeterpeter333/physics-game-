// V2: fractional checker times use the same round(t*30) stored frame; labels/fades keep t.
// True separately rendered macro only; immutable original labels are returned verbatim above it.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {overlayD1a as original} from './desk-d1a-overlay_s3_gpt_20261028.mjs';
const CACHE='/private/tmp/ys/ys-chain-d1a_s3_magnifier_gpt_20261028';
const KEY='f19573c5b0db3fdeb437',R=150,RING=8;
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const n=x=>Number(x.toFixed(2));
let state=null,timing=null;
function real(p){assert.ok(p.startsWith(CACHE+path.sep));assert.equal(fs.realpathSync(p),p);assert.equal(fs.lstatSync(p).isSymbolicLink(),false);return p;}
function inputs(){
 if(state)return state;
 assert.equal(process.env.EM_FILM_CACHE,CACHE);
 const dir=path.resolve(process.env.D1A_MAGNIFIER_DIR??path.join(CACHE,'magnifier/frames'));
 real(dir);assert.ok(dir===path.join(CACHE,'magnifier/frames')||dir.startsWith(path.join(CACHE,'magnifier/preview')+path.sep),'Only production or explicit true-macro preview assets');
 const manifest=JSON.parse(fs.readFileSync(real(path.join(dir,'manifest.json')),'utf8')),d=manifest.definition;
 assert.equal(manifest.rawSourceKey,KEY);assert.equal(d.rawSourceKey,KEY);assert.equal(d.originalSceneKey,'8eb303df05bafa5a3d96');
 assert.equal(d.stage,'S3');assert.equal(d.fps,30);assert.deepEqual(d.resolution,[480,480]);assert.equal(d.samples,4);assert.equal(d.mainRawChanged,false);assert.equal(d.scriptVoiceCaptionsChanged,false);
 assert.ok(Number.isFinite(d.start)&&Number.isFinite(d.endExclusive)&&d.start<d.endExclusive);
 if(dir===path.join(CACHE,'magnifier/frames'))assert.equal(manifest.productionMacroComplete,true,'Do not export a sparse macro preview as a complete lesson');
 state={dir,d};return state;
}
function magnifier(ctx){
 const {t}=ctx;
 // The actual timing map is immutable and lets unrelated frames avoid loading
 // macro assets. A missing exact macro frame inside the interval is an error.
 timing??=JSON.parse(fs.readFileSync(real(path.join(CACHE,'word-events-actual_s3_20261028.json')),'utf8'))['air:1kg'];
 const start=timing['1平方センチメートル'].time,end=timing['手のひら'].time;
 if(t<start||t>=end)return '';
 const {dir,d}=inputs();assert.equal(d.start,start);assert.equal(d.endExclusive,end);
 // Shared raw/anchors round arbitrary check times to their exact stored frame.
 const requestedFrame=Math.round(t*30),j=Math.max(d.first,Math.min(d.last,requestedFrame));
 assert.ok(j>=d.first&&j<=d.last,'Exact stored macro frame required');
 const op=sm((t-start)/d.fadeInSeconds)*sm((end-t)/d.fadeOutSeconds);
 if(op<=0)return '';
 const ex=JSON.parse(fs.readFileSync(real(path.join(dir,`extra-${String(j).padStart(5,'0')}.json`)),'utf8'));
 assert.equal(ex.frame,j);assert.equal(ex.rawSourceKey,KEY);assert.ok(Math.abs(ex.t-j/30)<1e-7);assert.equal(ex.magT,start);assert.equal(ex.magEnd,end);
 const image=fs.readFileSync(real(path.join(dir,`mag-${String(j).padStart(5,'0')}.jpg`)));
 assert.equal(image[0],0xff);assert.equal(image[1],0xd8,'Actual JPEG macro required');
 const [sx,sy,vis]=ex.sq,edge=ex.sq_edge;assert.ok(vis&&edge[2]&&[sx,sy,...edge].every(Number.isFinite));
 const half=Math.max(30,Math.abs(edge[0]-sx))*1.5,ringR=half+6;
 const cx=Math.round(Math.min(1040-R,Math.max(40+R,sx-40)));
 // Same 330px-above design as the supplied Claude magnifier. The safe top
 // bound leaves the existing y330 card untouched; original cards render last.
 const cy=Math.round(Math.max(550,Math.min(900,sy-330)));
 const a=Math.atan2(sy-cy,sx-cx),x0=cx+(R+RING)*Math.cos(a),y0=cy+(R+RING)*Math.sin(a),x1=sx-ringR*Math.cos(a),y1=sy-ringR*Math.sin(a);
 return `<g data-d1a-true-magnifier="${j}" opacity="${n(op)}"><defs><clipPath id="d1a-true-macro-clip"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs><path d="M${n(x0)} ${n(y0)} L${n(x1)} ${n(y1)}" stroke="#3a2a1a" stroke-width="9" stroke-linecap="round"/><path d="M${n(x0)} ${n(y0)} L${n(x1)} ${n(y1)}" stroke="#fff7e6" stroke-width="5" stroke-linecap="round"/><circle cx="${sx}" cy="${sy}" r="${n(ringR)}" fill="none" stroke="#3a2a1a" stroke-width="9"/><circle cx="${sx}" cy="${sy}" r="${n(ringR)}" fill="none" stroke="#fff7e6" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff7e6"/><image x="${cx-R}" y="${cy-R}" width="${2*R}" height="${2*R}" href="data:image/jpeg;base64,${image.toString('base64')}" clip-path="url(#d1a-true-macro-clip)"/><circle cx="${cx}" cy="${cy}" r="${R+RING/2}" fill="none" stroke="#3a2a1a" stroke-width="${RING+6}"/><circle cx="${cx}" cy="${cy}" r="${R+RING/2}" fill="none" stroke="#fff7e6" stroke-width="${RING}"/></g>`;
}
export function overlayD1a(ctx){
 const labels=original(ctx);
 if(ctx.clip.id!=='ys-chain-d1a')return labels;
 return magnifier(ctx)+labels;
}
