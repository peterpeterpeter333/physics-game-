import {readFileSync,existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const cache=process.env.EM_FILM_CACHE;assert.ok(cache);
const plan=JSON.parse(readFileSync(`${cache}/plan.json`));
const signature=c=>JSON.stringify(c.scenes.map(s=>[s.narration,s.utterances]));
const done=new Set(),running=new Set();let failure;
while(done.size<plan.length){
 if(failure){if(!running.size)throw failure;}
 else for(const c of plan){
  if(running.size>=2)break;
  if(done.has(c.id)||running.has(c.id))continue;
  const f=`${cache}/${c.id}.json`;if(!existsSync(f))continue;
  let a;try{a=JSON.parse(readFileSync(f));}catch{continue;}
  if(a.spacingVersion!=='20260924-furigana-spacing-v2'||signature(a)!==signature(c))continue;
  running.add(c.id);
  const child=spawn(process.execPath,['scripts/render-all-films.mjs',c.id],{stdio:'inherit',env:{...process.env,FILM_OUTPUT:`public/media/${c.mediaDirectory}`}});
  child.on('exit',code=>{running.delete(c.id);if(code!==0)failure=new Error(`Failed: ${c.id}`);else done.add(c.id);});
 }
 await new Promise(r=>setTimeout(r,1000));
}
console.log(`Rendered ${done.size} movies. Catalog registration is separate.`);
