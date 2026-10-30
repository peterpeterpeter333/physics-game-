// Copy only this task's evidence into a new persistent directory; preserve all sources.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),out=path.join(root,'outputs/axes-20261023/checkpoint-20261024');
if(fs.existsSync(out))throw Error('Preserve existing checkpoint: '+out);
const entries=[];
function stage(src,dst){
 if(!fs.existsSync(src))throw Error('Missing checkpoint source: '+src);
 const s=fs.statSync(src);
 if(s.isDirectory()){for(const f of fs.readdirSync(src).sort())stage(path.join(src,f),path.join(dst,f));return;}
 if(!s.isFile())throw Error('Unsupported checkpoint source: '+src);
 entries.push({src,dst,size:s.size});
}
for(const [ep,raw] of [
 ['b1','/private/tmp/ys/ys-chain-b1v1/blender/probe1s-b1v1-r8'],
 ['c1','/private/tmp/ys/ys-chain-c1v1/r12-probe-preflight/blender/probe1s'],
 ['e1','/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r9/frames']
])stage(raw,ep+'/raw-current-preflight');
for(const ep of ['b1','c1','d1','e1']){
 const c='/private/tmp/ys/ys-chain-'+ep+'v1'+(ep==='d1'?'-render':'');
 for(const f of ['plan.json','ys-chain-'+ep+'v1.json','phrase-times.json','blender/data.json'])stage(c+'/'+f,ep+'/'+f);
 for(const f of fs.readdirSync(c+'/blender').filter(f=>f.endsWith('.json')&&f!=='data.json'))stage(c+'/blender/'+f,ep+'/blender/'+f);
 for(const f of ['tex','blender/tex'])if(fs.existsSync(c+'/'+f))stage(c+'/'+f,ep+'/'+f);
 for(const f of fs.readdirSync(c).filter(f=>/\.json$/.test(f)&&!['plan.json','phrase-times.json','ys-chain-'+ep+'v1.json'].includes(f)))stage(c+'/'+f,ep+'/audit/'+f);
 if(fs.existsSync(c+'/problem'))stage(c+'/problem',ep+'/problem');
}
const bBlender='/private/tmp/ys/ys-chain-b1v1/blender';
for(const f of fs.readdirSync(bBlender).filter(f=>f.startsWith('catalog')&&fs.statSync(bBlender+'/'+f).isDirectory()))stage(bBlender+'/'+f,'b1/catalog-history/'+f);
stage('/private/tmp/ys/ys-chain-c1v1/blender/catalog-r10','c1/catalog-current');
stage('/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r5/catalog','e1/catalog-current');
for(const [src,dst] of [
 ['/private/tmp/ys/ys-chain-b1v1/review-probe1s-b1v1-r8/sheets','b1/review-sheets'],
 ['/private/tmp/ys/ys-chain-b1v1/review-probe1s-b1v1-r8/delta-sheets','b1/delta-sheets'],
 ['/private/tmp/ys/ys-chain-b1v1/review-probe1s-b1v1-r8/actual-svg-inspection.json','b1/svg-inspection.json'],
 ['/private/tmp/ys/ys-chain-b1v1/blender/b1-r8-probe-complete.json','b1/probe-complete.json'],
 ['/private/tmp/ys/ys-chain-b1v1/blender/b1-r8-probe-audit.json','b1/world-audit.json'],
 ['/private/tmp/ys/ys-chain-b1v1/blender/b1-actual-width-r8.json','b1/physical-widths.json'],
 ['/private/tmp/ys/ys-chain-b1v1/blender/context-proof-b1v1-r8','b1/physical-width-image-proof'],
 ['/private/tmp/ys/ys-chain-c1v1/r12-probe-preflight/r12-per-frame-provenance.json','c1/per-frame-provenance.json'],
 ['/private/tmp/ys/ys-chain-c1v1/r12-probe-preflight/preflight-r12-stage.json','c1/preflight-stage.json'],
 ['/private/tmp/ys/ys-chain-c1v1/r12-probe-preflight/trial-review','c1/current-delta-review'],
 ['/private/tmp/ys/ys-chain-c1v1/r12-probe-preflight/c1-probe1s-world-audit.json','c1/world-audit.json'],
 ['/private/tmp/ys/ys-chain-e1v1/review-e1v1-r9-allcue/sheets','e1/review-sheets']
])if(fs.existsSync(src))stage(src,dst);
// C's old complete 49 sheets are exact images for the unchanged433 current frames.
const cReview='/private/tmp/ys/ys-chain-c1v1/r11-probe-preflight/probe1s-review-c1v1';
for(const f of fs.readdirSync(cReview).filter(f=>/^compare1s-.*\.jpg$/.test(f)))stage(cReview+'/'+f,'c1/prior-whole-review/'+f);
for(const f of ['283.jpg','284.jpg','285.jpg'])stage(cReview+'/'+f,'c1/fixed-face-image-proof/'+f);
const eReview='/private/tmp/ys/ys-chain-e1v1/review-e1v1-r9-allcue';
for(const f of fs.readdirSync(eReview).filter(f=>/^e1v1-sheet-.*\.jpg$/.test(f)||f.endsWith('.json')))stage(eReview+'/'+f,'e1/review/'+f);
const dCache='/private/tmp/ys/ys-chain-d1v1-render';
stage(dCache+'/blender/probe1s-d1v1-r8','d1/older-full-probe-r8');
for(const f of fs.readdirSync(dCache+'/blender').filter(f=>/^landmarks-d1v1-r1[2345]$/.test(f)))stage(dCache+'/blender/'+f,'d1/'+f);
for(const f of ['blender/catalog-d1v1-final-r15','problem-final-d1v1','probe-review-d1v1-r8','gate-c-d1v1-r15-viewfix-final'])if(fs.existsSync(dCache+'/'+f))stage(dCache+'/'+f,'d1/'+f);
const sourceFilters=[['scripts/blender',/^(?:desk_[bcde]1v1|desk_lib_[bcde]1|desk_axes|desk_render_axes).*\.py$/],['scripts/umech',/^(?:desk-(?:[bcde]1v1|axes-)|mix-chain-desk-audio-[bcde]1v1|audit-(?:desk-e1v1|c1v1)|review-desk-e1v1).*\.(?:mjs|py|sh)$/]];
for(const [dir,re] of sourceFilters)for(const f of fs.readdirSync(dir).filter(f=>re.test(f)))stage(path.resolve(dir,f),'source/'+dir+'/'+f);
for(const f of fs.readdirSync('docs/video-revision-20260924/deep').filter(f=>/^[BCDE]-1_.*ChatGPT\.md$/.test(f)))stage(path.resolve('docs/video-revision-20260924/deep',f),'reports/'+f);
fs.mkdirSync(out);
const manifest=[];
for(const e of entries){
 const dst=path.join(out,e.dst);fs.mkdirSync(path.dirname(dst),{recursive:true});
 fs.copyFileSync(e.src,dst,fs.constants.COPYFILE_EXCL);
 const a=fs.readFileSync(e.src),b=fs.readFileSync(dst);if(!a.equals(b))throw Error('Checkpoint copy mismatch '+dst);
 manifest.push({source:e.src,file:e.dst,bytes:e.size,sha256:createHash('sha256').update(b).digest('hex')});
}
fs.writeFileSync(out+'/manifest.json',JSON.stringify({date:new Date().toISOString(),status:'unfinished pre-production evidence; no completed MP4',allCopiesByteIdentical:true,files:manifest},null,1),{flag:'wx'});
console.log(JSON.stringify({out,files:manifest.length,bytes:manifest.reduce((a,b)=>a+b.bytes,0),allCopiesByteIdentical:true}));
