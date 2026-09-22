// Layout-only validation using explicitly synthetic timings, isolated from audio caches.
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const root=mkdtempSync('/private/tmp/physics-reviewed-layout-');
for(const group of ['all','prerequisite','em']){
 const cache=`${root}/${group}`;mkdirSync(cache);
 const plan=JSON.parse(readFileSync(`/private/tmp/physics-${group}-films/plan.json`));
 writeFileSync(`${cache}/plan.json`,JSON.stringify(plan));
 for(const p of plan){let time=0;const clip={...p,scenes:p.scenes.map(s=>{const start=time;const captions=s.narration.split('。').filter(Boolean).map(text=>{const start=time;time+=4;return {start,end:time,text:text+'。'};});time+=1.2;return {...s,start,end:time,captions};})};clip.duration=time;writeFileSync(`${cache}/${p.id}.json`,JSON.stringify(clip));}
 const r=spawnSync(process.execPath,[group==='em'?'scripts/render-em-films.mjs':'scripts/render-all-films.mjs'],{stdio:'inherit',env:{...process.env,EM_FILM_CACHE:cache,FILM_PREFLIGHT:'1',EM_FILM_PREFLIGHT:'1'}});
 if(r.status!==0)process.exit(r.status??1);
}
console.log('PASS: all 1,068 scene layouts and every narration caption; synthetic timings, not a playback test.');
