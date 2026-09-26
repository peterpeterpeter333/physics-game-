// Recover the already-published AAC track losslessly for a VISUAL-only repair.
// Refuse changed narration/readings/caption timing; those need new synthesis.
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const cache=process.env.EM_FILM_CACHE;
assert.ok(cache&&process.env.FFMPEG,'Set EM_FILM_CACHE and FFMPEG');
const ids=process.argv.slice(2);assert.ok(ids.length,'Explicit video IDs required');
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));
mkdirSync(cache,{recursive:true});
const selected=[];
for(const id of ids){
 assert.match(id,/^[a-z0-9-]+$/);
 const next=plan.find(c=>c.id===id);assert.ok(next,id);
 const base=`public/media/${next.mediaDirectory??'revisions'}/${id}`;
 assert.ok(existsSync(base+'.mp4'),base);
 const old=JSON.parse(readFileSync(base+'.json'));
 assert.equal(old.scenes.length,next.scenes.length);
 for(const [i,s]of old.scenes.entries()){
  for(const key of ['narration','utterances'])assert.deepEqual(s[key],next.scenes[i][key],`${id}/${i}: audio text changed`);
  assert.equal(s.captions.map(c=>c.text).join(''),s.narration);
 }
 const audio=`${cache}/${id}.m4a`;
 execFileSync(process.env.FFMPEG,['-y','-v','error','-i',base+'.mp4','-map','0:a:0','-vn','-c:a','copy',audio]);
 const recovered={...old,...next,duration:old.duration,scenes:next.scenes.map((s,i)=>({...s,start:old.scenes[i].start,end:old.scenes[i].end,captions:old.scenes[i].captions}))};
 writeFileSync(`${cache}/${id}.json`,JSON.stringify(recovered,null,2));
 writeFileSync(`${cache}/${id}.audio-source.json`,JSON.stringify({source:base+'.mp4',sourceSha256:createHash('sha256').update(readFileSync(base+'.mp4')).digest('hex'),audioSha256:createHash('sha256').update(readFileSync(audio)).digest('hex'),method:'AAC stream copy; narration and captions unchanged'},null,2));
 selected.push(next);
}
writeFileSync(`${cache}/plan.json`,JSON.stringify(selected,null,2));
console.log(`Prepared ${selected.length} visual-only repairs; no TTS or audio re-encoding.`);
