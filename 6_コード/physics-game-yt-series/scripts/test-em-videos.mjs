import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {loadSource} from './build-em-film-plan.mjs';
const {stages,diagram}=await loadSource();
const movies=JSON.parse(readFileSync('src/content/em-video-catalog.generated.json'));
assert.equal(stages.length,40);assert.equal(movies.length,100);
assert.equal(new Set(movies.map(m=>m.id)).size,movies.length);
let slides=0,bytes=0,seconds=0;
for(const stage of stages){
 const clips=movies.filter(m=>m.stageId===stage.id);
 assert.ok(clips.length,stage.id);
 assert.deepEqual(clips.flatMap(m=>m.sourceIndices),stage.steps.map((_,i)=>i),`${stage.id}: exact, ordered, nonduplicated coverage`);
 for(const clip of clips){
  assert.ok(clip.duration>15&&clip.duration<180,clip.id);
  assert.ok(clip.title&&clip.scenes.length>=2&&clip.scenes.length<=4);
  const file=`public/media/em/${clip.id}`;
  assert.deepEqual(JSON.parse(readFileSync(`${file}.json`)),clip);
  assert.ok(statSync(`${file}.jpg`).size>1000);
  const size=statSync(`${file}.mp4`).size;assert.ok(size>10000&&size<100*1024*1024);
  bytes+=size;seconds+=clip.duration;
  let end=0;
  for(const scene of clip.scenes){
   const source=stage.steps[scene.index];
   assert.equal(scene.narration,source.narration,`${clip.id}: stale speech`);
   assert.equal(scene.start,end);assert.ok(scene.end>scene.start);end=scene.end;
   assert.equal(scene.captions.map(c=>c.text).join(''),scene.narration);
   assert.ok(scene.captions.every(c=>c.start>=scene.start&&c.end<=scene.end&&c.text.length<120));
   assert.ok(!/[\\$]/.test(scene.narration),'No unspoken TeX in speech');
   const required=[source.formula,source.tex,...(source.calculation?.lines.map(l=>l.tex)??[]),...(source.guide?.steps.map(l=>l.tex)??[])].filter(Boolean);
   assert.ok(required.every(t=>scene.equations.includes(t)),`${clip.id}: lost derivation`);
   for(const t of [0,.37,7.3])assert.ok(diagram(source,t).svg.includes('<svg'));
   slides++;
  }
  assert.equal(end,clip.duration);
 }
}
assert.equal(slides,315);
console.log(JSON.stringify({result:'PASS',units:stages.length,movies:movies.length,slides,minutes:+(seconds/60).toFixed(1),megabytes:+(bytes/1024/1024).toFixed(1),checks:['ordered coverage','current narration and captions','media and posters','duration and scene bounds','full equations preserved','all figure renderers'],limitations:'These are structural checks, not proof of pedagogical quality or a substitute for listening to the videos.'},null,2));
