import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';

const bundle=await build({entryPoints:['src/game/high-school-video-mode.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {highSchoolVideoPlaylist}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));

const catalog=JSON.parse(readFileSync('src/content/high-school-series.generated.json','utf8'));
const youtube=JSON.parse(readFileSync('src/content/high-school-youtube.generated.json','utf8'));
const pending=JSON.parse(readFileSync('src/content/high-school-youtube-pending.json','utf8'));
const oldMovies=[
 ...JSON.parse(readFileSync('src/content/em-video-catalog.generated.json','utf8')),
 ...JSON.parse(readFileSync('src/content/lesson-video-catalog.generated.json','utf8')),
];
assert.equal(catalog.length,100);
assert.equal(new Set(catalog.map(item=>item.id)).size,100);
assert.equal(Object.keys(youtube).length,catalog.length-pending.length,'only publicly available videos have YouTube mappings');
assert.equal(new Set(Object.values(youtube)).size,Object.keys(youtube).length,'no two lessons share a YouTube upload');
assert.equal(new Set(pending).size,pending.length,'pending review IDs are unique');
assert.ok(pending.every(id=>!youtube[`hs-series/${id}`]),'pending review videos are not linked before publication');
assert.equal(pending.length,0,'all high-school lessons must have public YouTube videos');
const groups=Map.groupBy(catalog,item=>item.stageId);
assert.equal(groups.size,27);
for(const [stageId,items] of groups){
 const summaries=items.filter(item=>item.kind==='summary');
 const deep=items.filter(item=>item.kind==='deep').sort((a,b)=>a.part-b.part);
 assert.equal(summaries.length,1,`${stageId}: one summary`);
 assert.ok(deep.length>=2&&deep.length<=4,`${stageId}: two to four deep videos`);
 assert.deepEqual(deep.map(item=>item.part),Array.from({length:deep.length},(_,i)=>i+1),`${stageId}: ordered parts`);
 const quick=highSchoolVideoPlaylist(items,'quick');
 const thorough=highSchoolVideoPlaylist(items,'thorough');
 assert.equal(quick.length,1,`${stageId}: quick mode has only the summary`);
 assert.deepEqual(quick.map(item=>item.id),summaries.map(item=>item.id));
 assert.deepEqual(thorough.map(item=>item.id),deep.map(item=>item.id),`${stageId}: thorough mode has only deep videos in order`);
 assert.ok(thorough.every(item=>item.kind==='deep'),`${stageId}: no summary in thorough mode`);
 assert.ok(!thorough.some(item=>quick.some(summary=>summary.id===item.id)),`${stageId}: modes are disjoint`);
 const middleCount=Math.floor(deep.length/2);
 assert.equal(thorough.length,deep.length,`${stageId}: every deep video has one dot in thorough mode`);
 for(const item of items){
  assert.ok(item.duration>=100&&item.duration<=370,`${item.id}: plausible duration`);
  assert.match(item.sourceFile,/^0_高校_\d{3}_.+\.mp4$/);
  if(pending.includes(item.id)){
   const fallbackLevel=item.kind==='summary'?'intro':item.part<=middleCount?'middle':'advanced';
   assert.ok(oldMovies.some(movie=>movie.stageId===stageId&&movie.level===fallbackLevel),`${item.id}: local fallback exists while YouTube checks run`);
  }else assert.match(youtube[`hs-series/${item.id}`]??'',/^[A-Za-z0-9_-]{11}$/,`${item.id}: valid YouTube ID`);
 }
}
const component=readFileSync('src/components/EMVideoLesson.tsx','utf8');
assert.match(component,/highSchoolVideoPlaylist\(all,mode\)/,'Player uses the tested mode selector');
assert.match(component,/\.\.\.fallback,level:'intro',part:index\+1,kind:m\.kind/,'Local replacements keep their intended kind');
const replacements=[{id:'local-intro',kind:'summary',part:1},{id:'local-middle',kind:'deep',part:2},{id:'local-advanced',kind:'deep',part:3}];
assert.deepEqual(highSchoolVideoPlaylist(replacements,'thorough').map(m=>m.id),['local-middle','local-advanced']);
assert.deepEqual(highSchoolVideoPlaylist(replacements,'quick').map(m=>m.id),['local-intro']);
assert.deepEqual(highSchoolVideoPlaylist(replacements.slice(0,1),'thorough'),[],'Missing deep videos must not fall back to a summary');
console.log(`PASS: ${Object.keys(youtube).length} public YouTube videos in ${groups.size} high-school stages; quick=summary only, thorough=deep only; ${pending.length} local fallbacks`);
