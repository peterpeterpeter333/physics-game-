// Scoped publication: only these four supplements and their explicit parent routes.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,renameSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {motionInsertIds as defaultIds,motionInsertRoutes as defaultRoutes} from '../docs/video-revision-20260924/motion-inserts.mjs';
import {uniformContinuationIds} from '../docs/video-revision-20260924/uniform-continuation.mjs';
import {freefallIds} from '../docs/video-revision-20260924/freefall-storyboards.mjs';
import {projectileFoundationIds} from '../docs/video-revision-20260924/projectile-foundations.mjs';
import {forceIds} from '../docs/video-revision-20260924/force-storyboards.mjs';
import {workFoundationIds} from '../docs/video-revision-20260924/work-foundations.mjs';
const read=f=>JSON.parse(readFileSync(f));
const root='docs/video-revision-20260924',plan=read(root+'/full-plan.generated.json');
const mains=read('src/content/revised-video-catalog.generated.json');
const file='src/content/insert-video-catalog.generated.json',routeFile='src/content/insert-routes.generated.json';
const routes=read(routeFile),fullRoutes=read(root+'/full-routes.generated.json'),ready=[];
assert.ok(process.argv.slice(2).length<=1&&process.argv.slice(2).every(a=>['--uniform','--freefall','--projectile-foundations','--force','--work-foundations'].includes(a)),'Unknown publication scope');
const uniform=process.argv.includes('--uniform');
const freefall=process.argv.includes('--freefall');
const projectile=process.argv.includes('--projectile-foundations');
const force=process.argv.includes('--force');
const work=process.argv.includes('--work-foundations');
const motionInsertIds=(work?workFoundationIds:force?forceIds:projectile?projectileFoundationIds:freefall?freefallIds:uniform?uniformContinuationIds:defaultIds).filter(id=>id.startsWith('hm-'));
const parents=work?['m-energy-intro']:force?['m-force-advanced']:projectile?['m-projectile-intro']:freefall?['m-freefall-intro','m-freefall-advanced']:['m1-uniform-accel-intro','m1-uniform-accel-middle','m1-uniform-accel-advanced'];
const motionInsertRoutes=uniform||freefall||projectile||force||work?Object.fromEntries(parents.map(id=>[id,fullRoutes.inserts[id]])):defaultRoutes;
assert.ok(process.env.FFMPEG,'Set FFMPEG');
for(const id of motionInsertIds){
 const source=plan.find(c=>c.id===id),base='public/media/inserts/'+id;
 for(const ext of ['mp4','jpg','json'])assert.ok(existsSync(base+'.'+ext),base+'.'+ext);
 const clip=read(base+'.json');
 for(const key of ['title','visualPilot','scenes','manuscriptScenes']){
  if(key==='scenes'){
   assert.equal(clip.scenes.length,source.scenes.length);
   clip.scenes.forEach((s,i)=>{
    for(const k of ['cues','utterances','narration'])assert.deepEqual(s[k],source.scenes[i][k],id+'/'+k);
    assert.equal(s.captions.map(c=>c.text).join(''),s.narration);
    assert.ok(s.captions.every(c=>c.end>c.start&&c.start>=s.start&&c.end<=s.end));
   });
  }else assert.deepEqual(clip[key],source[key],id+'/'+key);
 }
 assert.equal(clip.animationFPS,30);assert.equal(clip.spacingVersion,'20260924-furigana-spacing-v2');
 assert.equal(clip.scenes.at(-1).end,clip.duration);
 const probe=spawnSync(process.env.FFMPEG,['-hide_banner','-i',base+'.mp4'],{encoding:'utf8'});
 assert.match(probe.stderr,/Video: h264/);assert.match(probe.stderr,/Audio: aac/);assert.match(probe.stderr,/30 fps/);
 const d=probe.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);assert.ok(d);
 assert.ok(Math.abs(+d[1]*3600+ +d[2]*60+ +d[3]-clip.duration)<.15);
 const decode=spawnSync(process.env.FFMPEG,['-v','error','-i',base+'.mp4','-f','null','-'],{encoding:'utf8'});
 assert.equal(decode.status,0,decode.stderr);ready.push(clip);
}
for(const [parent,entries]of Object.entries(motionInsertRoutes)){
 const main=mains.find(c=>c.id===parent),source=plan.find(c=>c.id===parent);assert.ok(main&&source);
 assert.deepEqual(main.scenes.map(s=>s.narration),source.scenes.map(s=>s.narration),'Parent not current '+parent);
 assert.deepEqual(entries,fullRoutes.inserts[parent],'Manuscript route mismatch '+parent);
 const unrelated=(routes[parent]??[]).flatMap(r=>r.inserts).filter(id=>!motionInsertIds.includes(id));
 assert.equal(unrelated.length,0,'Do not discard unrelated inserts '+parent);
 for(const r of entries){assert.ok(r.afterScene>=0&&r.afterScene<=main.scenes.length);for(const id of r.inserts)assert.ok(ready.some(c=>c.id===id));}
 routes[parent]=entries;
}
const catalog=[...new Map([...read(file),...ready].map(c=>[c.id,c])).values()];
// Validation finishes before either generated app file is changed.
for(const [f,data]of [[file,catalog],[routeFile,routes]])writeFileSync(f+'.pending',JSON.stringify(data));
for(const f of [file,routeFile])renameSync(f+'.pending',f);
console.log(`Registered ${ready.length} decoded supplements and ${Object.keys(motionInsertRoutes).length} parent routes; prerequisites and other units unchanged.`);
