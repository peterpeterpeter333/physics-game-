import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const OUT=path.dirname(fileURLToPath(import.meta.url));
const W=path.resolve(OUT,'../../..');
const C='/private/tmp/ys/ys-chain-b2a_gpt_20261029';
process.env.EM_FILM_CACHE=C;
const {chunkTimes}=await import(path.join(W,'scripts/umech/desk-frame.mjs'));
const c=JSON.parse(fs.readFileSync(C+'/'+path.basename(C)+'.json'));
const durations=[],short=[],long=[],cues=[];let inexact=0;
for(const s of c.scenes)for(let i=0;i<s.cues.length;i++){
 const q=s.cues[i],cap=s.captions[i],z=chunkTimes(q,cap);
 if(!z.exact)inexact++;
 const d=z.starts.map((a,k)=>(z.starts[k+1]??cap.end)-a);
 durations.push(...d);
 d.forEach((v,k)=>{const f={key:q.diagram,row:q.masterRow,chunk:k,caption:q.cap[k],duration:v,start:z.starts[k]};if(v<.5)short.push(f);if(v>2)long.push(f);});
 cues.push({key:q.diagram,row:q.masterRow,part:q.part,start:cap.start,end:cap.end,voiceEnd:cap.end-.12-(q.pause??0),speaker:q.speaker,text:q.subtitle,kana:q.kana});
}
durations.sort((a,b)=>a-b);
const result={id:c.id,duration:c.duration,silentIntroSeconds:c.silentIntroSeconds,voicedCues:cues.length,captionChunks:durations.length,median:durations[Math.floor(durations.length/2)],min:durations[0],max:durations.at(-1),short,long,inexact,cues,earListeningPerformed:false};
fs.writeFileSync(path.join(OUT,'final-caption-and-cue-times.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,cues:undefined,long:long.length}));
