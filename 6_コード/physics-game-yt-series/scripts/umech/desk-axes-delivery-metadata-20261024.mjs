// Add-only publication metadata: no source script/data builder is imported.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const W=process.cwd();
assert(W.endsWith('/work/physics-game-yt-series'));
const out=path.join(W,'outputs/axes-20261023/delivery-metadata-20261024');
assert(!fs.existsSync(out),'Keep all previous evidence');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,1)+'\n',{flag:'wx'});

// Execute only the exact existing pure-math block; none of the builder's
// cache/docs/texture writes or its module imports may run.
const dataSource=path.join(W,'scripts/umech/desk-d1v1-data.mjs');
const source=fs.readFileSync(dataSource,'utf8');
const start='const numbers={', end='const P=(x,y,z,d,az,el,lens=40)=>';
assert.equal(source.split(start).length,2);
assert.equal(source.split(end).length,2);
const block=source.slice(source.indexOf(start),source.indexOf(end));
assert(!/readFile|writeFile|mkdir|sharp|process\.|import\s|require\s*\(/.test(block));
const values=Function('assert',block+'\nreturn {numbers,palmPositions,layerCounts,fujiCounts};')(assert);
const frozenDataPath='/private/tmp/ys/ys-chain-d1v1-render/blender/data.json';
const frozenData=JSON.parse(fs.readFileSync(frozenDataPath));
for(const [k,v] of Object.entries(values))assert.deepEqual(v,frozenData[k],k);

// Restrict B's problem JSON to its exact canonical body, not the next heading.
const canonicalPath=path.join(W,'docs/video-revision-20260924/deep/技術の疑問の鎖_B-1_第1版_ナレーション.md');
const canonical=fs.readFileSync(canonicalPath,'utf8');
const heading='## 問題編への接続（いまは作らない。入れるときのため）';
assert.equal(canonical.split(heading).length,2);
const section=canonical.split(heading)[1].split('\n## ')[0].trim();
const old='/private/tmp/ys/ys-chain-b1v1-final3-20261024/problem';
const previous=JSON.parse(fs.readFileSync(old+'/problem.json'));
assert(previous.canonical.includes(section));
const protectedPaths=[dataSource,frozenDataPath,canonicalPath,old+'/problem.json',old+'/挑戦.png',old+'/答え.png'];
const before=Object.fromEntries(protectedPaths.map(p=>[p,hash(p)]));
fs.mkdirSync(out);
write(out+'/D-1-read-only-math-proof.json',{
  source:dataSource,sourceSha256:before[dataSource],
  method:'Exact existing pure calculation/assert block only; original builder never imported or run',
  exactComputedValuesEqualFrozenData:true,originalDataSha256:before[frozenDataPath],
  assertions:'PASS',values,sourceOrOriginalCacheWritten:false,finalVideoAcceptance:false
});
const problem=out+'/B-1-problem';fs.mkdirSync(problem);
write(problem+'/problem.json',{...previous,canonical:section});
for(const name of ['挑戦.png','答え.png'])fs.copyFileSync(old+'/'+name,problem+'/'+name,fs.constants.COPYFILE_EXCL);
assert.equal(JSON.parse(fs.readFileSync(problem+'/problem.json')).canonical,section);
assert(!JSON.parse(fs.readFileSync(problem+'/problem.json')).canonical.includes('## 点検で直した所'));
for(const [p,h] of Object.entries(before))assert.equal(hash(p),h,p);
write(out+'/metadata-provenance.json',{
  date:new Date().toISOString(),protectedSha256:before,allProtectedUnchanged:true,
  problemCanonicalBodyExact:true,problemCanonicalSource:canonicalPath,
  problemSectionHeading:heading,problemImagesCopiedByteIdentically:true,
  files:Object.fromEntries(['D-1-read-only-math-proof.json','B-1-problem/problem.json','B-1-problem/挑戦.png','B-1-problem/答え.png'].map(f=>[f,hash(out+'/'+f)])),
  oldProblemJsonPreserved:true,existingVideoInputsChanged:false,finalVideoAcceptance:false
});
console.log(JSON.stringify({out,mathAssertions:'PASS',problemCanonicalBodyExact:true,originalFilesUnchanged:true}));
