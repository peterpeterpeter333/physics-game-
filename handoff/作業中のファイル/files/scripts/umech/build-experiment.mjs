// Render plan for an experimental film that is not (yet) part of the app catalog.
// Usage: EM_FILM_CACHE=/private/tmp/X node scripts/umech/build-experiment.mjs docs/video-revision-20260924/experiments/<file>.mjs
import {writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {PILOT} from './frame.mjs';
const cache=process.env.EM_FILM_CACHE;assert.ok(cache,'Set EM_FILM_CACHE');
const file=process.argv[2];assert.ok(file,'Give the manuscript file');
const {clips}=await import(path.resolve(file));
const plan=clips.map(c=>{
 const scenes=c.scenes.map((s,i)=>({...structuredClone(s),index:i,sceneId:`${c.id}-s${i+1}`,mode:'common'}));
 for(const s of scenes)for(const q of s.cues){
  assert.ok(q.subtitle&&q.reading,`Missing reading in ${c.id}`);
  assert.equal((q.subtitle.match(/。/g)??[]).length,(q.reading.match(/。/g)??[]).length,`Sentence count differs: ${q.subtitle}`);
  assert.ok(!/[一-龠]/.test(q.reading),`Kanji left in reading: ${q.reading}`);
  const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>=1&&n<=2,`At most two sentences per cue (${n}): ${q.subtitle}`);
 }
 return {id:c.id,stageId:'experiment',stageTitle:c.title,topicId:'experiment',level:'experiment',family:'experiment',title:c.title,condition:c.condition??'',scenes,mediaDirectory:'experiments',renderer:'lesson',revision:'experiment',visualPilot:PILOT,navigationBreaks:scenes.slice(1).map((_,i)=>i+1),manuscriptSource:file};
});
mkdirSync(cache,{recursive:true});writeFileSync(`${cache}/plan.json`,JSON.stringify(plan,null,2));
console.log(`Planned ${plan.length} experimental film(s): ${plan.map(c=>`${c.id} (${c.scenes.reduce((a,s)=>a+s.cues.length,0)} sentences)`).join(', ')}`);
