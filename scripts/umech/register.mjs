// Publish verified university-mechanics films into the app's revised catalog.
// Every film is checked against its current manuscript and fully decoded first;
// nothing is written unless all selected films pass.
// Usage: FFMPEG=... node scripts/umech/register.mjs <ids...>   (or --all)
import {readFileSync,writeFileSync,renameSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {buildPlan} from './build-plan.mjs';
const read=f=>JSON.parse(readFileSync(f));
const args=process.argv.slice(2);assert.ok(args.length,'Specify ids or --all');
const plan=await buildPlan(args.includes('--all')?[]:args);
assert.ok(plan.length,'No matching films');
assert.ok(process.env.FFMPEG,'Set FFMPEG for media verification');
const ready=[];
for(const source of plan){
 const base=`public/media/revisions/${source.id}`;
 for(const ext of ['mp4','jpg','json'])assert.ok(existsSync(`${base}.${ext}`),`Missing ${base}.${ext}`);
 const c=read(`${base}.json`);
 assert.equal(c.visualPilot,'umech-v1');assert.equal(c.animationFPS,30);assert.equal(c.title,source.title);
 assert.equal(c.stageId,source.stageId);assert.equal(c.scenes.length,source.scenes.length);
 assert.equal(c.spacingVersion,'20260924-furigana-spacing-v2');
 for(const [i,s] of c.scenes.entries()){
  assert.deepEqual([s.narration,s.utterances,s.cues],[source.scenes[i].narration,source.scenes[i].utterances,source.scenes[i].cues],`Outdated film ${source.id} scene ${i}`);
  assert.equal(s.captions.map(x=>x.text).join(''),s.narration);
  assert.ok(s.end>s.start&&s.captions.every(x=>x.end>x.start&&x.start>=s.start-1e-6));
 }
 assert.ok(Math.abs(c.scenes.at(-1).end-c.duration)<.01);
 const probe=spawnSync(process.env.FFMPEG,['-hide_banner','-i',`${base}.mp4`],{encoding:'utf8'});
 assert.match(probe.stderr,/Video: h264/);assert.match(probe.stderr,/Audio: aac/);
 const m=probe.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);
 assert.ok(Math.abs(+m[1]*3600+ +m[2]*60+ +m[3]-c.duration)<.15,`Encoded duration ${source.id}`);
 const decode=spawnSync(process.env.FFMPEG,['-v','error','-i',`${base}.mp4`,'-f','null','-'],{encoding:'utf8'});
 assert.equal(decode.status,0,decode.stderr);
 ready.push(c);console.log(`verified ${source.id} (${c.duration.toFixed(1)} s)`);
}
const file='src/content/revised-video-catalog.generated.json';
const merged=[...new Map([...read(file),...ready].map(c=>[c.id,c])).values()];
writeFileSync(file+'.pending',JSON.stringify(merged));renameSync(file+'.pending',file);
console.log(`Registered ${ready.length} university-mechanics films. Other catalog entries unchanged.`);
