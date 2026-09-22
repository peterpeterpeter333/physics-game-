import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {makePlan,levels} from './build-all-video-scripts.mjs';
import reviews from '../docs/video-scripts/review-notes.mjs';
const plan=await makePlan(),ids=new Set(),stages=new Set(plan.sourceStages.map(s=>s.id));
const old=JSON.parse(readFileSync('docs/video-scripts/editorial-revisions.json'));
const round2=JSON.parse(readFileSync('docs/video-scripts/editorial-revisions-round2.json'));
let sentences=0,formulas=0;
const allSentences=new Set();
for(const v of plan.records){
 assert.ok(!ids.has(v.id),`Duplicate ${v.id}`);ids.add(v.id);
 assert.ok(stages.has(v.stageId),`Unknown stage ${v.stageId}`);
 assert.ok(levels.includes(v.level));assert.ok(v.question.endsWith('？'),v.id);
 assert.ok(v.condition.length>8,v.id);assert.equal(v.beats.length,3);
 assert.ok(reviews[v.topicId],`Missing editorial note: ${v.topicId}`);
 for(const b of v.beats){
  assert.ok(b.visual.length>8,`${v.id}: missing storyboard`);
  assert.ok(b.speech.length>25,`${v.id}: missing script`);
  for(const s of b.speech.split('。').filter(Boolean)){
   sentences++;
   allSentences.add(s);
   // Screening only: particles do not prove grammatical subjects or pedagogical clarity.
   assert.ok(/[はがも]/.test(s),`${v.id}: subject review flag: ${s}`);
  }
  if(b.equation){formulas++;assert.ok(b.symbols.trim().length>0,`${v.id}: missing definitions`);}
  assert.ok(!b.speech.includes('短い区間ならほぼ直線です'));
 }
}
for(const v of plan.records){
 for(const ref of [v.next,v.sameLevelNext,v.previousVideo])if(ref)assert.ok(ids.has(ref.id),`${v.id}: broken connection`);
 for(const pre of v.prerequisiteTopics)assert.ok(plan.prerequisites[pre],`${v.id}: unknown prerequisite ${pre}`);
 if(v.existingEMConnection)assert.ok(plan.preservedStages.some(s=>s.id===v.existingEMConnection.stageId));
}
for(const [before,after] of old){
 assert.ok(!plan.records.some(v=>v.question===before),`Unrepaired question: ${before}`);
 assert.ok(!allSentences.has(before),`Unrepaired: ${before}`);
 assert.ok(plan.records.some(v=>v.question===after)||[...allSentences].some(s=>s.includes(after.split('。')[0])),`Revision missing: ${after}`);
}
for(const [before,after] of round2){
 assert.ok(!plan.records.some(v=>v.question===before),`Unrepaired question: ${before}`);
 assert.ok(![...allSentences].some(s=>s.includes(before)),`Unrepaired: ${before}`);
 assert.ok(plan.records.some(v=>v.question===after)||[...allSentences].some(s=>s.includes(after.split('。')[0])),`Revision missing: ${after}`);
}
for(const stage of plan.sourceStages)assert.ok(plan.records.some(v=>v.stageId===stage.id),`Unmapped ${stage.id}`);
const core=plan.records.filter(v=>!['bridges','advanced-followups'].includes(v.family));
for(const topic of new Set(core.map(v=>v.topicId))){
 const list=core.filter(v=>v.topicId===topic);
 assert.deepEqual(list.map(v=>v.level),levels,topic);
 assert.equal(new Set(list.map(v=>v.question)).size,3,`${topic}: repeated levels`);
 assert.equal(new Set(list.map(v=>v.beats.map(b=>b.speech).join(''))).size,3,topic);
}
const done=new Set(),active=new Set();
function visit(id){assert.ok(plan.prerequisites[id],`Unknown prerequisite ${id}`);assert.ok(!active.has(id),`Cycle ${id}`);if(done.has(id))return;active.add(id);plan.prerequisites[id].forEach(visit);active.delete(id);done.add(id);}
Object.keys(plan.prerequisites).forEach(visit);
assert.deepEqual(JSON.parse(readFileSync('docs/video-scripts/plan.generated.json')),plan,'Generated plan is stale');
for(const family of new Set(plan.records.map(v=>v.family))){
 const md=readFileSync(`docs/video-scripts/${family}.md`,'utf8');
 for(const v of plan.records.filter(v=>v.family===family)){assert.ok(md.includes(`id="${v.id}"`));for(const b of v.beats)assert.ok(md.includes(b.speech));}
}
assert.ok(existsSync('docs/video-scripts/review.md'));
assert.equal(plan.sourceStages.length,96);assert.equal(plan.preservedStages.length,40);assert.equal(plan.records.length,156);
assert.equal(old.length,60);assert.equal(round2.length,58);
console.log(JSON.stringify({result:'PASS',sourceUnits:stages.size,videos:ids.size,levels:Object.fromEntries(levels.map(l=>[l,plan.records.filter(v=>v.level===l).length])),sentences,formulaBeats:formulas,editorialRevisionEntries:old.length+round2.length,limits:'Structure and editorial flags only; no learner test, speech production, mathematical typesetting or app changes.'},null,2));
