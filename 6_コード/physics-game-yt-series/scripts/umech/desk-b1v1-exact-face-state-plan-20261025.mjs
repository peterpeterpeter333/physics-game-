// Read-only CPU plan: execute the original faceLayer and full-suppression
// expression in an isolated VM, with an empty face drawing only.  No renderer,
// image, encoder, cache-writing import, or existing source is changed.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const W=fileURLToPath(new URL('../../',import.meta.url));
const C='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025';
const pins={
 [W+'scripts/umech/desk-frame.mjs']:'1174d49f123e2dcf614143f617c2483d3086be4b38ff51bfe8d0be721447022f',
 [W+'scripts/umech/anim.mjs']:'a752ea218d13d2871702549842d0c67a5851571f490d6dbf40ea0f0efb1b1031',
 [C+'/plan.json']:'8ece4dc22111ad27b24bb4af2ae4f0b4ad33dad0e60b82ac3ddadcb38fffacfe',
 [C+'/ys-chain-b1v1.json']:'4c88f446227ea645d2f4e871177b1e5a2d23244ea1c3e9e958ca30015fd35271',
};
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const[p,h]of Object.entries(pins))if(sha(p)!==h)throw Error('Protected input differs: '+p);
const source=fs.readFileSync(W+'scripts/umech/desk-frame.mjs','utf8');
const anim=fs.readFileSync(W+'scripts/umech/anim.mjs','utf8');
const face=source.slice(source.indexOf('export function faceLayer('),source.indexOf('export const faceDefs='));
if(!face.startsWith('export function faceLayer('))throw Error('Exact faceLayer boundary missing');
const line=(s,prefix)=>{const all=s.split('\n').filter(x=>x.startsWith(prefix));if(all.length!==1)throw Error('Non-unique original line '+prefix);return all[0];};
const full=line(source,' const full=fc&&!fc.small');
const body=[line(anim,'export const clamp=').replace('export ',''),line(source,'const n='),line(source,'const sm='),
 'const DW=1080,DH=1920,FACE_COL={kai:{bg1:"",bg2:""},mio:{bg1:"",bg2:""}};const face=()=>"";',
 face.replace('export function ','function '),
 'globalThis.classify=(q,cap,t)=>{const fc=q.face?{...q.face}:null;if(fc?.at||fc?.then)throw Error("B1 requires native at/then routing if metadata changes");'+full+
 'const svg=faceLayer(fc,t,cap.start,cap.end,q);const match=svg.match(/^<g opacity="([0-9.]+)">/);const op=match?Number(match[1]):0;return {kind:!fc?"no_face":fc.small?(op>0?"small_face":"small_face_zero_opacity"):op===0?"full_face_zero_opacity_edge":op===1?"full_face_opaque":"full_face_transition",svgOpacity:op,originalOverlaySuppressed:Boolean(full),faceMetadata:fc};};'
].join('\n');
const sandbox={};vm.createContext(sandbox);vm.runInContext(body,sandbox,{timeout:1000});
const entry=JSON.parse(fs.readFileSync(C+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(C+'/ys-chain-b1v1.json'));
const scenes=entry.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}));
const runs=[];let last=null;
for(let j=0;j<10700;j++){
 const t=j/30,s=scenes.find(s=>t>=s.start&&t<s.end)??scenes.at(-1);
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),q=s.cues[k],cap=s.captions[k];
 const state={cue:q.diagram.replace('cb1v1-',''),capStart:cap.start,capEnd:cap.end,...sandbox.classify(q,cap,t)};
 const signature=JSON.stringify(state);
 if(last?.signature===signature)last.lastFrame=j;else{last={firstFrame:j,lastFrame:j,...state,signature};runs.push(last);}
}
for(const r of runs)delete r.signature;
const counts={};for(const r of runs)counts[r.kind]=(counts[r.kind]??0)+r.lastFrame-r.firstFrame+1;
const result={episode:'B-1',frames:10700,fps:30,method:'Original pinned faceLayer and original full-suppression expression executed unchanged; only face drawing stubbed because classification uses outer SVG opacity and full-screen background',inputSha256:pins,faceFunctionSourceSha256:createHash('sha256').update(face).digest('hex'),noImageRenderingOrCacheImports:true,existingFilesModified:false,counts,runs};
for(const[p,h]of Object.entries(pins))if(sha(p)!==h)throw Error('Protected input changed: '+p);
process.stdout.write(JSON.stringify(result,null,1)+'\n');
