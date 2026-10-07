import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const catalog=JSON.parse(readFileSync('src/content/high-school-series.generated.json','utf8'));
const youtube=JSON.parse(readFileSync('src/content/high-school-youtube.generated.json','utf8'));
const pending=JSON.parse(readFileSync('src/content/high-school-youtube-pending.json','utf8'));
assert.equal(catalog.length,100);
assert.equal(new Set(catalog.map(item=>item.id)).size,100);
assert.equal(Object.keys(youtube).length,catalog.length-pending.length,'only publicly available videos have YouTube mappings');
assert.equal(new Set(Object.values(youtube)).size,Object.keys(youtube).length,'no two lessons share a YouTube upload');
assert.equal(new Set(pending).size,pending.length,'pending review IDs are unique');
assert.ok(pending.every(id=>!youtube[`hs-series/${id}`]),'pending review videos are not linked before publication');
assert.equal(catalog.length-pending.length,96,'only publicly available high-school videos replace local lessons');
const groups=Map.groupBy(catalog,item=>item.stageId);
assert.equal(groups.size,27);
for(const [stageId,items] of groups){
 const summaries=items.filter(item=>item.kind==='summary');
 const deep=items.filter(item=>item.kind==='deep').sort((a,b)=>a.part-b.part);
 assert.equal(summaries.length,1,`${stageId}: one summary`);
 assert.ok(deep.length>=2&&deep.length<=4,`${stageId}: two to four deep videos`);
 assert.deepEqual(deep.map(item=>item.part),Array.from({length:deep.length},(_,i)=>i+1),`${stageId}: ordered parts`);
 const middleCount=Math.floor(deep.length/2);
 assert.ok(middleCount>=1&&deep.length-middleCount>=1,`${stageId}: middle and advanced are populated`);
 const levels={intro:summaries,middle:deep.slice(0,middleCount),advanced:deep.slice(middleCount)};
 assert.equal(Object.values(levels).flat().length,items.length,`${stageId}: every video is assigned exactly once`);
 for(const item of items){
  assert.ok(item.duration>=100&&item.duration<=370,`${item.id}: plausible duration`);
  assert.match(item.sourceFile,/^0_高校_\d{3}_.+\.mp4$/);
  if(!pending.includes(item.id))assert.match(youtube[`hs-series/${item.id}`]??'',/^[A-Za-z0-9_-]{11}$/,`${item.id}: valid YouTube ID`);
 }
}
console.log(`PASS: ${youtube&&Object.keys(youtube).length} public YouTube videos in ${groups.size} high-school stages; ${pending.length} remain on local lessons`);
