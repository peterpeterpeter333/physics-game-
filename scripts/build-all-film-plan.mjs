import {makePlan} from './build-all-video-scripts.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
const draft=await makePlan();
const cache=process.env.EM_FILM_CACHE??'/private/tmp/physics-all-films';
mkdirSync(cache,{recursive:true});
const plan=draft.records.map(r=>({id:r.id.replace(/-draft$/,''),stageId:r.stageId,stageTitle:r.title,topicId:r.topicId,level:r.level,family:r.family,title:r.question,condition:r.condition,sourceScript:r.id,scenes:r.beats.map((b,index)=>({index,heading:b.speech.split('。')[0]+'。',narration:b.speech,visual:b.visual,equation:b.equation,symbols:b.symbols}))}));
writeFileSync(`${cache}/plan.json`,JSON.stringify(plan,null,2));
console.log(`${plan.length} movies, ${plan.reduce((n,c)=>n+c.scenes.length,0)} scenes`);
