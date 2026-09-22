// Render ready audio without waiting for the full library. Never publish a partial catalog.
import {readFileSync,existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
const groups=[['all','lessons'],['prerequisite','lessons'],['em','em']];
const jobs=groups.flatMap(([name,dir])=>{
 const cache=`/private/tmp/physics-${name}-films`;
 return JSON.parse(readFileSync(`${cache}/plan.json`)).map(clip=>({clip,cache,dir}));
});
const key=c=>JSON.stringify(c.scenes.map(s=>s.narration));
const done=new Set(),running=new Set();let failed=false;
function start(job){
 const {clip,cache,dir}=job;running.add(clip.id);
 const child=spawn(process.execPath,[dir==='em'?'scripts/render-em-films.mjs':'scripts/render-all-films.mjs',clip.id],{stdio:'inherit',env:{...process.env,EM_FILM_CACHE:cache,EM_FILM_NO_FINALIZE:'1'}});
 child.on('exit',code=>{running.delete(clip.id);if(code!==0){failed=true;console.error(`FAILED ${clip.id}`);}else{done.add(clip.id);console.log(`Completed ${done.size}/${jobs.length}`);}});
}
while(done.size<jobs.length){
 if(failed){if(!running.size)process.exit(1);await new Promise(r=>setTimeout(r,1000));continue;}
 for(const job of jobs){
  if(running.size>=3)break;
  const {clip,cache}=job;if(done.has(clip.id)||running.has(clip.id))continue;
  const file=`${cache}/${clip.id}.json`;if(!existsSync(file))continue;
  let audio;try{audio=JSON.parse(readFileSync(file));}catch{continue;}
  if(key(audio)!==key(clip))continue;
  if(clip.scenes.some(s=>s.narration.includes('電気束'))&&audio.pronunciationOverrides?.['電気束']!=='でんきそく')continue;
  start(job);
 }
 await new Promise(r=>setTimeout(r,1000));
}
console.log('All 332 video renders ready for finalization.');
