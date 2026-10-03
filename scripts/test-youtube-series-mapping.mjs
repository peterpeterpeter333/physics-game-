import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=file=>JSON.parse(readFileSync(file,'utf8'));
const series=read('src/content/b2-series.generated.json');
const manifest=read('src/content/video-delivery.json').videos;
const old=[...read('src/content/em-video-catalog.generated.json'),...read('src/content/lesson-video-catalog.generated.json')];
const key=item=>`b2-series/${item.id}`;

// The first ten and the next hundred public videos were verified in Studio.
// The eleventh film is still a draft; the remaining 68 have not been uploaded.
const published=[...series.slice(0,10),...series.slice(11,111)];
assert.equal(Object.keys(manifest).length,110);
assert.deepEqual(new Set(Object.keys(manifest)),new Set(published.map(key)));
assert.equal(new Set(Object.values(manifest)).size,110);
for(const item of published)assert.match(manifest[key(item)],/^[A-Za-z0-9_-]{11}$/);
assert.equal(manifest[key(series[10])],undefined,'Do not embed the unpublished draft');

// Units without a published replacement must retain their old local videos.
const hostedPairs=new Set(published.map(item=>`${item.stageId}:${item.level}`));
assert.ok(old.some(item=>!hostedPairs.has(`${item.stageId}:${item.level}`)),'Expected local fallback lessons');
console.log(`PASS: 110 published uploads mapped to their exact units; draft excluded; other levels retain local media.`);
