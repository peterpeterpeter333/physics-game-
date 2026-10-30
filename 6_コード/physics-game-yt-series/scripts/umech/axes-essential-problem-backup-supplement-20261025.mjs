import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const W=process.cwd();assert(W.endsWith('/work/physics-game-yt-series'));
const O=W+'/outputs/axes-20261023';
const config=JSON.parse(fs.readFileSync(O+'/snapshot-config-final-bcde-20261025.json'));
const root=O+'/checkpoint-final-bcde-20261025-essential';
const original=root+'/manifest.json',out=root+'/manifest-with-problem-preparation-v2.json';
assert(!fs.existsSync(out));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const originalSha=sha(original),base=JSON.parse(fs.readFileSync(original));
assert.equal(base.allCopiesByteIdentical,true);
const rows=[...base.filesManifest],bySource=new Map(rows.map(r=>[r.source,r]));
const added=[];
for(const film of config.films)for(const name of ['挑戦.png','答え.png','problem.json']){
 const source=film.cache+'/problem/'+name;
 assert(fs.statSync(source).isFile());
 const hash=sha(source);
 if(bySource.has(source)){
  const r=bySource.get(source);assert.equal(hash,r.sha256);assert.equal(sha(root+'/'+r.file),hash);continue;
 }
 const file='problem-preparation-supplement/'+film.id+'/'+name,dest=root+'/'+file;
 fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(source,dest,fs.constants.COPYFILE_EXCL);
 assert.equal(sha(dest),hash);assert.equal(sha(source),hash);
 const r={source,file,bytes:fs.statSync(dest).size,sha256:hash,explicitSourceThroughProblemDirectoryAlias:true};
 rows.push(r);added.push(r);
}
const result={...base,date:new Date().toISOString(),previousManifest:{path:original,sha256:originalSha},
 files:rows.length,uniqueCopiedFiles:base.uniqueCopiedFiles+added.length,
 bytes:base.bytes+added.reduce((sum,r)=>sum+r.bytes,0),
 filesManifest:rows,explicitProblemPreparationSupplement:added,
 supplementReason:'The conservative directory walker did not follow symbolic-link directories. Add only the explicitly required problem files, without traversing other old caches.',
 originalManifestEdited:false,sourceFilesWritten:false};
fs.writeFileSync(out,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
assert.equal(sha(original),originalSha);
console.log(JSON.stringify({out,sha256:sha(out),added:added.length,bytes:result.bytes,allCopiesByteIdentical:true}));
