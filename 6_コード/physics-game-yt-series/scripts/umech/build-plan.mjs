// Build the render plan for the rewritten university-mechanics films.
// Usage: EM_FILM_CACHE=/private/tmp/X node scripts/umech/build-plan.mjs [ids...]
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import {PILOT} from './frame.mjs';
const root='docs/video-revision-20260924/umech';
export async function loadClips(){
 const out=[];
 for(const f of readdirSync(root).filter(f=>f.endsWith('.mjs')&&f!=='schema.mjs').sort()){
  const m=await import(`../../${root}/${f}`);out.push(...m.clips.map(c=>({...c,sourceFile:`${root}/${f}`})));
 }
 return out;
}
export async function buildPlan(selected=[]){
 const lesson=JSON.parse(readFileSync('src/content/lesson-video-catalog.generated.json'));
 const plan=[];
 for(const c of await loadClips()){
  if(selected.length&&!selected.includes(c.id))continue;
  const base=lesson.find(x=>x.id===c.id);assert.ok(base,`Not an existing lesson film: ${c.id}`);
  const {scenes:_s,renderKey:_r,fluencyRepair:_f,fluencyRepairVersion:_v,pronunciationFingerprint:_p,duration:_d,...keep}=base;
  const scenes=c.scenes.map((s,i)=>({...structuredClone(s),index:i,sceneId:`${c.id}-s${i+1}`,mode:'common'}));
  for(const s of scenes)for(const q of s.cues){
   assert.ok(q.subtitle&&q.reading,`Missing reading in ${c.id}`);
   assert.equal((q.subtitle.match(/。/g)??[]).length,(q.reading.match(/。/g)??[]).length,`Sentence count differs: ${q.subtitle}`);
   assert.ok(!/[一-龠]/.test(q.reading),`Kanji left in reading: ${q.reading}`);
   const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>=1&&n<=2,`At most two sentences per cue (${n}): ${q.subtitle}`);
  }
  plan.push({...keep,title:c.title,condition:c.condition??base.condition,scenes,mediaDirectory:'revisions',sourceMediaDirectory:'lessons',renderer:'lesson',revision:'20260926-umech',visualPilot:PILOT,navigationBreaks:scenes.slice(1).map((_,i)=>i+1),manuscriptSource:c.sourceFile});
 }
 return plan;
}
if(import.meta.url===`file://${process.argv[1]}`){
 const cache=process.env.EM_FILM_CACHE;assert.ok(cache,'Set EM_FILM_CACHE');
 const plan=await buildPlan(process.argv.slice(2));
 mkdirSync(cache,{recursive:true});writeFileSync(`${cache}/plan.json`,JSON.stringify(plan,null,2));
 console.log(`Planned ${plan.length} films: ${plan.map(c=>c.id).join(', ')}`);
}
