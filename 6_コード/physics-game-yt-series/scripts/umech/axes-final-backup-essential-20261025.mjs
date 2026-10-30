import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const W=process.cwd();assert(W.endsWith('/work/physics-game-yt-series'));
const O=W+'/outputs/axes-20261023';
const config=JSON.parse(fs.readFileSync(O+'/snapshot-config-final-bcde-20261025.json'));
const out=O+'/checkpoint-final-bcde-20261025-essential';
assert(!fs.existsSync(out));
const entries=new Map();
const evidence=(p)=>/\.(?:json|log|md|npz|svg|txt|csv)$/.test(p)||
 (/\.(?:png|jpe?g)$/.test(p)&&(!/^\d{5}\.(?:png|jpe?g)$/.test(path.basename(p))||/(?:review|probe|catalog|compare|landmark|gate|problem|critical|bookend)/i.test(path.dirname(p))));
function stage(p,relative){
 assert(path.isAbsolute(p)&&!relative.split('/').includes('..')&&!relative.startsWith('/'));
 const stat=fs.statSync(p);assert(stat.isFile());
 const existing=entries.get(p);if(existing)return;
 entries.set(p,{source:p,file:relative,bytes:stat.size,real:fs.realpathSync(p)});
}
function walk(dir,relative,predicate=evidence,visited=new Set()){
 const real=fs.realpathSync(dir);if(visited.has(real))return;visited.add(real);
 for(const item of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
  const p=path.join(dir,item.name),rel=relative+'/'+item.name;
  if(item.isSymbolicLink()){
   // Never recursively follow an alias into an old production cache.
   if(fs.statSync(p).isFile()&&predicate(p))stage(p,rel);
  }else if(item.isDirectory())walk(p,rel,predicate,visited);
  else if(item.isFile()&&predicate(p))stage(p,rel);
 }
}
for(const film of config.films){
 walk(film.cache,'cache/'+path.basename(film.cache));
 for(const p of [film.video,film.cache+'/'+film.id+'.voice.wav',film.cache+'/'+film.id+'.wav'])
  stage(p,'films/'+film.id+'/'+path.basename(p));
}
for(const name of [
 'ys-chain-b1v1-final5-pending-eye-contacts-20261025',
 'ys-chain-c1v1-final-v4-middle019-036-personal-contacts-20261025',
 'ys-chain-d1v1-final-union-eye-review-20261025',
 'ys-chain-d1v1-final-physical-original-case-contacts-20261025',
])walk('/private/tmp/ys/'+name,'cache/'+name);
walk('/private/tmp/ys/axes-active-queue','render-queue');
for(const [dir,re] of [
 ['scripts/blender',/^(?:desk_[bcde]1v1|desk_lib_[bcde]1|desk_lib_axes|desk_axes|desk_render_axes).*\.py$/],
 ['scripts/umech',/^(?:desk-(?:[bcde]1v1|axes-)|mix-chain-desk-audio-[bcde]1v1|review-desk-[bcde]1v1|axes-|[bcde]1-final-|save-d1-).*\.(?:mjs|py|sh)$/],
])for(const name of fs.readdirSync(W+'/'+dir).filter(n=>re.test(n)))stage(W+'/'+dir+'/'+name,'source/'+dir+'/'+name);
for(const name of ['desk_lib.py'])stage(W+'/scripts/blender/'+name,'source/scripts/blender/'+name);
for(const name of ['desk-overlay-lib.mjs','desk_audio_lib.py','desk-frame.mjs','desk-faces.mjs','frame-vert.mjs','desk-quality-gate.mjs','desk-quality-gate-frames.py'])stage(W+'/scripts/umech/'+name,'source/scripts/umech/'+name);
const deep=W+'/docs/video-revision-20260924/deep';
for(const name of fs.readdirSync(deep).filter(n=>/^(?:[BCDE]-1_|技術の疑問の鎖_[BCDE]-1_|机の部品カタログ_B-1からE-1_)/.test(n)&&/\.(?:md|json)$/.test(n)))stage(deep+'/'+name,'documents/'+name);
walk(deep+'/部品カタログ画像/軸の1本目_20261024','catalog');
for(const name of fs.readdirSync(W+'/deep').filter(n=>/^[BCDE]-1_.*\.(?:md|json)$/.test(n)))stage(W+'/deep/'+name,'private-documents/'+name);
for(const name of fs.readdirSync(O).filter(n=>/\.(?:md|json)$/.test(n)))stage(O+'/'+name,'root-reports/'+name);
const handover='/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22';
for(const ep of ['B-1','C-1','D-1','E-1'])stage(handover+'/'+ep+'/'+ep+'_制作指示書.md','instructions/'+ep+'_制作指示書.md');
stage(handover+'/07_軸の1本目_共通の制作指示.md','instructions/07_軸の1本目_共通の制作指示.md');
const reals=new Map();let uniqueBytes=0;
for(const item of entries.values()){
 if(reals.has(item.real)){item.aliasOf=reals.get(item.real).source;item.file=reals.get(item.real).file;}
 else{reals.set(item.real,item);uniqueBytes+=item.bytes;}
}
assert(uniqueBytes<4*2**30,'Essential backup exceeded its explicit 4GiB safety cap: '+uniqueBytes);
console.log(JSON.stringify({preflightFiles:entries.size,uniqueFiles:reals.size,uniqueBytes}));
const hash=async p=>{const h=createHash('sha256');for await(const b of fs.createReadStream(p))h.update(b);return h.digest('hex');};
fs.mkdirSync(out);
const rows=[];
for(const item of entries.values()){
 const saved=out+'/'+item.file;let digest;
 if(item.aliasOf){digest=await hash(item.source);assert.equal(digest,await hash(saved));}
 else{
  fs.mkdirSync(path.dirname(saved),{recursive:true});
  digest=await hash(item.source);fs.copyFileSync(item.source,saved,fs.constants.COPYFILE_EXCL);
  assert.equal(await hash(saved),digest);assert.equal(await hash(item.source),digest);
 }
 const {real,...record}=item;rows.push({...record,sha256:digest});
}
const manifest={date:new Date().toISOString(),files:rows.length,uniqueCopiedFiles:reals.size,bytes:uniqueBytes,
 allCopiesByteIdentical:true,sourceFilesWritten:false,rawProductionSequencesCopied:false,
 scope:'Current four final caches, selected current review/contact evidence, source, catalogues, instructions, root records and final four movies/audio. Old cache aliases are not recursively followed. This is not a complete archive of every abandoned experiment; original paths inside JSON remain unchanged.',
 filesManifest:rows};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,files:rows.length,uniqueFiles:reals.size,bytes:uniqueBytes,allCopiesByteIdentical:true}));
