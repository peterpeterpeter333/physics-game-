import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {build} from 'esbuild';
import {join} from 'node:path';

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const source=process.env.PHYSICS_QUEST_SERIES_DIR??'/Users/ken/Downloads/physics-quest-youtube';
const series=read('src/content/b2-series.generated.json');
const uploads=read('docs/b2-series-upload-manifest.json');
const legacy=read('docs/b2-legacy-upload-manifest.json');
const legacyIds=read('src/content/b2-legacy.generated.json');
assert.equal(series.length,179);
assert.equal(uploads.length,179);
assert.equal(legacy.length,578);
assert.equal(legacyIds.length,legacy.length);
assert.equal(new Set([...uploads,...legacy].map(item=>item.objectKey)).size,757);
assert.equal(new Set(series.map(item=>item.stageId)).size,87);
for(const level of ['intro','middle','advanced']){
  assert.equal(series.filter(item=>item.level===level).length,{intro:49,middle:61,advanced:69}[level]);
}
for(const entry of uploads){
  const item=series.find(item=>item.id===entry.id);
  assert.ok(item);
  assert.equal(item.objectKey,entry.objectKey);
  assert.equal(statSync(join(source,entry.filename)).size,entry.size);
}
for(const item of legacy){
  assert.equal(statSync(`public/media/${item.filename}`).size,item.size);
  assert.ok(legacyIds.includes(item.filename.slice(0,-4)));
}
const bundle=await build({entryPoints:['src/game/video-delivery.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const delivery=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
assert.equal(delivery.b2SeriesEnabled(),false,'B2 cannot activate before URL verification');
assert.equal(delivery.b2LegacyVideoUrlFor('paper-battles/does-not-exist'),null);
assert.equal(delivery.b2VideoUrlFor('../private.mp4'),null);
assert.equal(delivery.publicB2VideoUrl('https://f001.backblazeb2.com/file/physics-quest/','series/2026-10/intro/ui-average-to-now/01.mp4'),'https://f001.backblazeb2.com/file/physics-quest/series/2026-10/intro/ui-average-to-now/01.mp4');
assert.equal(delivery.publicB2VideoUrl('http://example.com/','media/2026-10/em/test.mp4'),null);
assert.equal(delivery.publicB2VideoUrl('https://example.com/','media/../private.mp4'),null);
console.log('PASS: 179 new university films + 578 existing MP4, exact sizes, unique paths, B2 safely disabled until verified.');
