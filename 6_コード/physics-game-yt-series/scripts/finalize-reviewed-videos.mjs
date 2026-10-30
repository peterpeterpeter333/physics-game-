import {readFileSync,writeFileSync,renameSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const sha=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const {changes}=JSON.parse(readFileSync('docs/video-scripts/reviewed-narration-20260923.json'));
const publications=[],media=[];
for(const [group,family,dir,count]of [['all','lesson','lessons',156],['prerequisite','prerequisite','lessons',76],['em','em','em',100]]){
 const plan=JSON.parse(readFileSync(`/private/tmp/physics-${group}-films/plan.json`));assert.equal(plan.length,count);
 const clips=plan.map(p=>{
  const base=`public/media/${dir}/${p.id}`,clip=JSON.parse(readFileSync(`${base}.json`));
  assert.deepEqual(clip.scenes.map(s=>[s.index,s.narration]),p.scenes.map(s=>[s.index,s.narration]),`${p.id}: stale render`);
  for(const s of clip.scenes){
   assert.equal(s.narration,changes.find(c=>c.id===p.id&&c.index===s.index)?.after);
   assert.equal(s.narration,s.captions.map(c=>c.text).join(''));
   if(s.narration.includes('電気束'))assert.equal(clip.pronunciationOverrides?.['電気束'],'でんきそく');
  }
  assert.match(clip.renderKey,/^[a-f0-9]{64}$/);assert.ok(statSync(`${base}.jpg`).size>1000);
  media.push({id:p.id,file:`${base}.mp4`,sha256:sha(`${base}.mp4`),bytes:statSync(`${base}.mp4`).size,duration:clip.duration,renderKey:clip.renderKey});
  return clip;
 });
 publications.push([`src/content/${family}-video-catalog.generated.json`,JSON.stringify(clips)]);
}
assert.equal(new Set(media.map(m=>m.id)).size,332);
// Validate every file before replacing any catalog.
for(const [file,data]of publications)writeFileSync(`${file}.tmp`,data);
for(const [file]of publications)renameSync(`${file}.tmp`,file);
writeFileSync('docs/video-scripts/reviewed-media-20260923.json',JSON.stringify({videos:media.length,media},null,2)+'\n');
console.log(JSON.stringify({videos:media.length,minutes:media.reduce((n,m)=>n+m.duration,0)/60,MiB:media.reduce((n,m)=>n+m.bytes,0)/2**20},null,2));
