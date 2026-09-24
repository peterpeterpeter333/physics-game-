// Register exactly the reviewed main films. Preserve existing prerequisites and
// supplements; pending manuscript inserts are not mistaken for finished media.
import {readFileSync,writeFileSync,renameSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {motionFoundationIds} from '../docs/video-revision-20260924/motion-foundations.mjs';
import {uniformAccelerationIds} from '../docs/video-revision-20260924/uniform-acceleration.mjs';
import {uniformContinuationIds} from '../docs/video-revision-20260924/uniform-continuation.mjs';
import {freefallIds} from '../docs/video-revision-20260924/freefall-storyboards.mjs';
import {projectileFoundationIds} from '../docs/video-revision-20260924/projectile-foundations.mjs';
import {projectileMiddleIds} from '../docs/video-revision-20260924/projectile-middle.mjs';
const read=f=>JSON.parse(readFileSync(f));
const plan=read('docs/video-revision-20260924/full-plan.generated.json');
const routes=read('src/content/insert-routes.generated.json'),ready=[];
assert.ok(process.env.FFMPEG,'Set FFMPEG');
const ids=process.argv.length>2?process.argv.slice(2):motionFoundationIds;
assert.ok(ids.every(id=>[...motionFoundationIds,...uniformAccelerationIds,...projectileMiddleIds,...[...uniformContinuationIds,...freefallIds,...projectileFoundationIds].filter(id=>!id.startsWith('hm-'))].includes(id)),'Only authored films can be registered');
for(const id of ids){
 const source=plan.find(c=>c.id===id),base=`public/media/revisions/${id}`;
 for(const ext of ['mp4','jpg','json'])assert.ok(existsSync(`${base}.${ext}`));
 const c=read(`${base}.json`);
 for(const key of ['title','visualPilot','condition','navigationBreaks'])assert.deepEqual(c[key],source[key],`${id}/${key}`);
 assert.equal(c.animationFPS,30);assert.equal(c.spacingVersion,'20260924-furigana-spacing-v2');
 assert.equal(c.scenes.length,source.scenes.length);
 for(const [i,s]of c.scenes.entries()){
  for(const key of ['cues','utterances','narration'])assert.deepEqual(s[key],source.scenes[i][key]);
  assert.equal(s.captions.map(cap=>cap.text).join(''),s.narration);
  assert.ok(s.captions.every(cap=>cap.end>cap.start&&cap.start>=s.start&&cap.end<=s.end));
 }
 for(const r of routes[id]??[])assert.ok(r.afterScene<=c.scenes.length,'Existing supplement boundary must remain valid');
 const probe=spawnSync(process.env.FFMPEG,['-hide_banner','-i',base+'.mp4'],{encoding:'utf8'});
 assert.match(probe.stderr,/Video: h264/);assert.match(probe.stderr,/Audio: aac/);assert.match(probe.stderr,/30 fps/);
 const match=probe.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);assert.ok(match);
 assert.ok(Math.abs(+match[1]*3600+ +match[2]*60+ +match[3]-c.duration)<.15);
 const decode=spawnSync(process.env.FFMPEG,['-v','error','-i',base+'.mp4','-f','null','-'],{encoding:'utf8'});assert.equal(decode.status,0,decode.stderr);
 ready.push(c);
}
const file='src/content/revised-video-catalog.generated.json';
const result=[...new Map([...read(file),...ready].map(c=>[c.id,c])).values()];
writeFileSync(file+'.pending',JSON.stringify(result));renameSync(file+'.pending',file);
console.log(`Registered ${ready.length} decoded, verified films. Prerequisite and insert routes preserved. No push.`);
