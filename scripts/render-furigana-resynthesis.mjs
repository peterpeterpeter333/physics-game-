// Render only current manuscript-reading movies, into staging, never live media.
import {readFileSync,existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
const cache='/private/tmp/physics-furigana-resynthesis';
const plan=JSON.parse(readFileSync(`${cache}/plan.json`));
const done=new Set(),running=new Map();let failure;
const signature=c=>JSON.stringify(c.scenes.map(s=>[s.narration,s.utterances]));
while(done.size<plan.length){
 if(failure){if(!running.size)throw failure;}
 else for(const c of plan){
  if(running.size>=2)break;
  if(done.has(c.id)||running.has(c.id))continue;
  const file=`${cache}/${c.id}.json`;
  if(!existsSync(file))continue;
  let audio;try{audio=JSON.parse(readFileSync(file));}catch{continue;}
  if(audio.spacingVersion!=='20260924-furigana-spacing-v2'||signature(audio)!==signature(c))continue;
  const em=c.id.startsWith('ue-');
  const output=`${cache}/rendered/${c.mediaDirectory}`;
  const child=spawn(process.execPath,[em?'scripts/render-em-films.mjs':'scripts/render-all-films.mjs',c.id],{stdio:'inherit',env:{...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:output,EM_FILM_OUTPUT:output,EM_FILM_NO_FINALIZE:'1'}});
  running.set(c.id,child);
  child.on('exit',code=>{running.delete(c.id);if(code!==0)failure=new Error(`Render failed ${c.id}`);else done.add(c.id);});
 }
 await new Promise(r=>setTimeout(r,1000));
}
console.log(`All ${done.size} resynthesized movies staged. Validation/publication still required.`);
