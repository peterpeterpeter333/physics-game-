import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makePlan} from './build-all-video-scripts.mjs';
import {loadSource} from './build-em-film-plan.mjs';
import {lessons} from '../docs/video-scripts/prerequisite-lessons.mjs';
import '../docs/video-scripts/prerequisite-math.mjs';
import '../docs/video-scripts/prerequisite-high-school.mjs';
import '../docs/video-scripts/prerequisite-mechanics.mjs';
import '../docs/video-scripts/prerequisite-advanced.mjs';
import '../docs/video-scripts/prerequisite-bridges.mjs';
import '../docs/video-scripts/prerequisite-calculations.mjs';
import {corrections} from './reviewed-narration-corrections.mjs';
const {changes,sources}=JSON.parse(readFileSync('docs/video-scripts/reviewed-narration-20260923.json'));
const records=(await makePlan()).records,{stages}=await loadSource();
assert.equal(sources.length,6);assert.equal(changes.length,1068);assert.equal(new Set(changes.map(c=>c.id)).size,332);
assert.equal(new Set(changes.filter(c=>c.source==='user-manuscript').map(c=>c.id)).size,314);
const catalogs=['lesson','prerequisite','em'].flatMap(f=>JSON.parse(readFileSync(`src/content/${f}-video-catalog.generated.json`)));
for(const c of changes){
 const record=records.find(r=>r.id.replace(/-draft$/,'')===c.id),prep=lessons.find(l=>l.id===c.id),em=stages.find(s=>s.id===c.stageId);
 const narration=record?.beats[c.index]?.speech??prep?.scenes[c.index]?.narration??em?.steps[c.index]?.narration;
 assert.equal(narration,c.after,`${c.id}/${c.index}: authored source`);
 assert.ok(!/★|修正案:|場面を二つに分ける方/.test(narration));
 if(process.argv.includes('--source-only'))continue;
 const clip=catalogs.find(v=>v.id===c.id),scene=clip?.scenes.find(s=>s.index===c.index);
 if(c.after.includes('電気束'))assert.equal(clip.pronunciationOverrides?.['電気束'],'でんきそく',`${c.id}: flux pronunciation`);
 assert.equal(scene?.narration,c.after,`${c.id}/${c.index}: rendered speech`);
 assert.equal(scene.captions.map(s=>s.text).join(''),c.after,`${c.id}/${c.index}: subtitles`);
}
for(const [key,text]of Object.entries(corrections))assert.equal(changes.find(c=>`${c.id}:${c.index+1}`===key)?.after,text);
const speech=changes.map(c=>c.after).join('\n');
for(const bad of ['静電場、つまり時間で変わらない電場','動いた距離もマイナス','電気一つあたり','地面に触れる条件','一次の変化、つまりごく小さい変化','一割る、ルート、真空'])assert.ok(!speech.includes(bad),bad);
const player=readFileSync('src/components/EMVideoLesson.tsx','utf8');
assert.ok(player.includes('${base}.mp4${revision}'));assert.ok(player.includes('btn-battle'));
const audio=readFileSync('scripts/render-em-film-audio.py','utf8');
assert.ok(audio.includes("replace('電場','でんば')"));
assert.ok(audio.includes("replace('電気束','でんきそく')"));
if(!process.argv.includes('--source-only')){
 const {media}=JSON.parse(readFileSync('docs/video-scripts/reviewed-media-20260923.json'));
 assert.equal(media.length,332);assert.equal(new Set(media.map(m=>m.id)).size,332);
 for(const m of media){
  const clip=catalogs.find(c=>c.id===m.id),data=readFileSync(m.file);
  assert.equal(data.length,m.bytes,`${m.id}: video bytes`);
  assert.equal(createHash('sha256').update(data).digest('hex'),m.sha256,`${m.id}: video checksum`);
  assert.equal(clip?.renderKey,m.renderKey,`${m.id}: catalog revision`);
 }
}
console.log(`PASS: ${changes.length} reviewed scenes, 332 clips, ${Object.keys(corrections).length} explicit corrections; ${process.argv.includes('--source-only')?'source only':'source/caption/media consistency'}.`);
