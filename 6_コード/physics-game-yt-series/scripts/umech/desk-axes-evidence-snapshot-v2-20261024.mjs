// Add-only persistence of this task's evidence. It is not a quality waiver or
// a delivery operation. Actual Blender production JPEG sequences are excluded;
// review pictures, original failures, source, final MP4s and exact inputs stay.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const W=process.cwd();assert(W.endsWith('/work/physics-game-yt-series'));
const configFile=path.resolve(process.argv[2]??'');
assert(configFile.startsWith(W+'/outputs/axes-20261023/')&&fs.statSync(configFile).isFile(),'Explicit task-local config required');
const config=JSON.parse(fs.readFileSync(configFile));
assert(/^checkpoint-final-[a-zA-Z0-9-]+$/.test(config.directory));
assert(Array.isArray(config.films)&&config.films.length===4);
const out=W+'/outputs/axes-20261023/'+config.directory;assert(!fs.existsSync(out));
const entries=new Map(),skipped=[];
function stage(src,relative) {
 const file=path.resolve(src);assert(!relative.startsWith('/')&&!relative.split('/').includes('..'));
 const st=fs.statSync(file);assert(st.isFile(),file);
 if(entries.has(relative)){assert.equal(entries.get(relative).source,file);return;}
 entries.set(relative,{source:file,file:relative,bytes:st.size});
}
function walk(folder,rootRel,predicate=()=>true,seen=new Set()) {
 const real=fs.realpathSync(folder);if(seen.has(real))return;const nextSeen=new Set(seen);nextSeen.add(real);
 for(const entry of fs.readdirSync(folder,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
  const p=folder+'/'+entry.name,rel=rootRel+'/'+entry.name,st=fs.statSync(p);
  if(st.isDirectory())walk(p,rel,predicate,nextSeen);
  else if(st.isFile()&&predicate(p,rel))stage(p,rel);
 }
}
const evidence=(p,rel)=>{
 if(/\.(?:json|log|md|npz|svg|txt|csv)$/.test(p))return true;
 if(/\.(?:png|jpg|jpeg)$/.test(p)) {
  const number=/^\d{5}\.(?:png|jpe?g)$/.test(path.basename(p));
  const review=/(?:review|probe|catalog|compare|landmark|gate|problem|critical|bookend)/i.test(path.dirname(p));
  return !number||review;
 }
 return false;
};
for(const folder of fs.readdirSync('/private/tmp/ys').filter(n=>/^ys-chain-[bcde]1v1(?:-|$)/.test(n))) {
 const p='/private/tmp/ys/'+folder;if(fs.statSync(p).isDirectory())walk(p,'cache/'+folder,evidence);
}
for(const file of fs.readdirSync('/private/tmp/ys').filter(n=>/^ys-chain-[bcde]1v1.*\.(?:json|log)$/.test(n)))stage('/private/tmp/ys/'+file,'cache-root/'+file);
walk('/private/tmp/ys/axes-active-queue','render-queue',evidence);
for(const [dir,re]of [
 ['scripts/blender',/^(?:desk_[bcde]1v1|desk_lib_[bcde]1|desk_lib_axes|desk_axes|desk_render_axes).*\.py$/],
 ['scripts/umech',/^(?:desk-(?:[bcde]1v1|axes-)|mix-chain-desk-audio-[bcde]1v1|audit-(?:desk-e1v1|c1v1)|review-desk-e1v1).*\.(?:mjs|py|sh)$/]
])for(const f of fs.readdirSync(W+'/'+dir).filter(n=>re.test(n)))stage(W+'/'+dir+'/'+f,'source/'+dir+'/'+f);
for(const file of ['scripts/blender/desk_lib.py','scripts/umech/desk-overlay-lib.mjs','scripts/umech/desk_audio_lib.py',
 'scripts/umech/desk-frame.mjs','scripts/umech/desk-faces.mjs','scripts/umech/frame-vert.mjs',
 'scripts/umech/desk-quality-gate.mjs','scripts/umech/desk-quality-gate-frames.py',
 'scripts/render-all-films-gptv2.mjs'])stage(W+'/'+file,'source/'+file);
const handover='/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22';
stage(handover+'/07_軸の1本目_共通の制作指示.md','instructions/07_軸の1本目_共通の制作指示.md');
for(const ep of ['B-1','C-1','D-1','E-1'])stage(handover+'/'+ep+'/'+ep+'_制作指示書.md','instructions/'+ep+'_制作指示書.md');
const deep=W+'/docs/video-revision-20260924/deep';
for(const f of fs.readdirSync(deep).filter(n=>/^(?:[BCDE]-1_|技術の疑問の鎖_[BCDE]-1_|机の部品カタログ_B-1からE-1_)/.test(n)&&/\.(?:md|json)$/.test(n)))stage(deep+'/'+f,'documents/'+f);
walk(deep+'/部品カタログ画像/軸の1本目_20261024','catalog',evidence);
const existingReports=W+'/outputs/axes-20261023';
for(const f of fs.readdirSync(existingReports).filter(n=>/\.(?:json|md)$/.test(n)))stage(existingReports+'/'+f,'root-reports/'+f);
for(const film of config.films) {
 assert(/^ys-chain-[bcde]1v1$/.test(film.id));
 const cache=path.resolve(film.cache);assert(cache.startsWith('/private/tmp/ys/'+film.id));
 for(const [kind,p]of Object.entries({video:film.video,voice:cache+'/'+film.id+'.voice.wav',mixed:cache+'/'+film.id+'.wav'})) {
  assert(p&&fs.statSync(p).isFile(),kind+' '+film.id);stage(p,'films/'+film.id+'/'+path.basename(p));
 }
}
stage(configFile,'snapshot-config.json');fs.mkdirSync(out);
async function hash(file){const h=crypto.createHash('sha256');for await(const b of fs.createReadStream(file))h.update(b);return h.digest('hex');}
const manifest=[];
for(const item of entries.values()) {
 const file=out+'/'+item.file;fs.mkdirSync(path.dirname(file),{recursive:true});
 const before=await hash(item.source);fs.copyFileSync(item.source,file,fs.constants.COPYFILE_EXCL);
 assert.equal(await hash(file),before,'Copied bytes differ: '+file);
 assert.equal(await hash(item.source),before,'Evidence changed during copy: '+item.source);
 manifest.push({...item,sha256:before});
}
fs.writeFileSync(out+'/manifest.json',JSON.stringify({date:new Date().toISOString(),files:manifest.length,
 bytes:manifest.reduce((s,x)=>s+x.bytes,0),allCopiesByteIdentical:true,sourceFilesWritten:false,
 scope:'Persistent evidence only. A snapshot does not imply all original gates passed or audible playback was performed.',
 rawProductionSequencesCopied:false,filesManifest:manifest,skipped},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,files:manifest.length,bytes:manifest.reduce((s,x)=>s+x.bytes,0),allCopiesByteIdentical:true}));
