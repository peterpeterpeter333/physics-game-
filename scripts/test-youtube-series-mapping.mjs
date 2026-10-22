import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=file=>JSON.parse(readFileSync(file,'utf8'));
const series=read('src/content/b2-series.generated.json');
const manifest=read('src/content/video-delivery.json').videos;
const old=[...read('src/content/em-video-catalog.generated.json'),...read('src/content/lesson-video-catalog.generated.json')];
const key=item=>`b2-series/${item.id}`;

// Complete university curriculum: 49 introductory, 61 intermediate and 69 advanced.
assert.equal(series.length,179);
assert.equal(Object.keys(manifest).length,series.length);
assert.deepEqual(new Set(Object.keys(manifest)),new Set(series.map(key)));
assert.equal(new Set(Object.values(manifest)).size,series.length);
for(const item of series)assert.match(manifest[key(item)],/^[A-Za-z0-9_-]{11}$/);
for(const [level,count]of [['intro',49],['middle',61],['advanced',69]]){
 assert.equal(series.filter(item=>item.level===level).length,count);
}

// Independent Studio ledger for the 69 previously unpublished replacements.
const ledger=read('docs/university-youtube-published-20261022.json');
assert.equal(ledger.videos.length,69);
assert.equal(new Set(ledger.videos.map(item=>item.youtubeId)).size,69);
for(const item of ledger.videos){
 const entry=series.find(candidate=>key(candidate)===item.mediaId);
 assert.ok(entry,`Unknown media ID: ${item.mediaId}`);
 assert.equal(entry.stageId,item.stageId);
 assert.equal(entry.level,item.level);
 assert.equal(entry.part,item.part);
 assert.equal(entry.title,item.title);
 assert.equal(manifest[item.mediaId],item.youtubeId);
 const label={intro:'初級',middle:'中級',advanced:'上級'}[item.level];
 const numeric={intro:1,middle:2,advanced:3}[item.level];
 const normalized=item.youtubeTitle.normalize('NFKC').split(' ');
 assert.equal(Number(normalized[0]),numeric);
 assert.equal(normalized[1],label);
 assert.equal(Number(normalized[2]),item.unitNumber);
 assert.ok(item.youtubeTitle.endsWith(` ${item.part} ${item.title}`));
}
const allIds=[...Object.values(manifest),...Object.values(read('src/content/high-school-youtube.generated.json')),...Object.values(read('src/content/problem-youtube-ids.json'))];
assert.equal(allIds.length,439);
assert.equal(new Set(allIds).size,allIds.length,'One YouTube upload must not serve unrelated slots');
for(const id of ledger.excludedDuplicateYoutubeIds)assert.ok(!allIds.includes(id),`Duplicate upload must stay unused: ${id}`);

// Units without a published replacement must retain their old local videos.
const hostedPairs=new Set(series.map(item=>`${item.stageId}:${item.level}`));
assert.ok(old.some(item=>!hostedPairs.has(`${item.stageId}:${item.level}`)),'Expected local fallback lessons');
console.log(`PASS: all 179 university videos mapped; 69 newly published replacements match their Studio ledger; 439 total YouTube IDs are unique; duplicate excluded.`);
