import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {makePlan,sourceInventory} from './build-all-video-scripts.mjs';
import {equationAt} from './all-film-equations.mjs';
const catalog=JSON.parse(readFileSync('src/content/lesson-video-catalog.generated.json'));
const em=JSON.parse(readFileSync('src/content/em-video-catalog.generated.json'));
const draft=await makePlan(),{chapters}=await sourceInventory();
assert.equal(catalog.length,156);
assert.equal(new Set(catalog.map(c=>c.id)).size,156);
assert.equal(new Set(catalog.map(c=>c.stageId)).size,96);
assert.equal(new Set([...catalog,...em].map(c=>c.stageId)).size,136);
let bytes=0,seconds=0;
for(const c of catalog){
 const source=draft.records.find(r=>r.id===c.sourceScript);assert.ok(source,c.id);
 assert.equal(c.title,source.question);assert.equal(c.level,source.level);
 assert.deepEqual(c.scenes.map(s=>s.narration),source.beats.map(b=>b.speech));
 assert.equal(c.mediaDirectory,'lessons');assert.equal(c.scenes.length,3);
 const base=`public/media/lessons/${c.id}`;
 assert.deepEqual(JSON.parse(readFileSync(`${base}.json`)),c);
 const size=statSync(`${base}.mp4`).size;assert.ok(size>10000&&size<100*1024*1024);
 assert.ok(statSync(`${base}.jpg`).size>1000);bytes+=size;seconds+=c.duration;
 let end=0;
 for(const s of c.scenes){
  assert.equal(s.start,end);assert.ok(s.end>s.start);end=s.end;
  assert.equal(s.captions.map(cap=>cap.text).join(''),s.narration);
  assert.ok(s.captions.every(cap=>cap.start>=s.start&&cap.end<=s.end));
  for(const p of [0,.2,.5,.8,1])assert.equal(typeof equationAt(c,s,p),'string');
 }
 assert.equal(end,c.duration);assert.ok(c.duration>15&&c.duration<180);
}
for(const ch of chapters)for(const stage of ch.stages){
 const clips=[...catalog,...em].filter(c=>c.stageId===stage.id);assert.ok(clips.length,stage.id);
 if(!ch.level)assert.deepEqual([...new Set(clips.map(c=>c.level))],['intro','middle','advanced']);
 assert.ok(stage.enemy,`Battle remains available: ${stage.id}`);
}
console.log(JSON.stringify({result:'PASS',newVideos:catalog.length,preservedEMVideos:em.length,totalStages:136,newVideoMiB:+(bytes/2**20).toFixed(1),newMinutes:+(seconds/60).toFixed(1),checks:['all draft recordings included','three difficulty levels','all chapter routes covered','original battle data retained','caption/audio timelines','media files and posters'],limits:'Not a learner test or a claim that every animation is pedagogically optimal.'},null,2));
