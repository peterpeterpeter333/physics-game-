// Publish only the completed projectile advanced package, including its new
// prerequisite. Existing films and unrelated prerequisite assignments survive.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,renameSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {projectileAdvancedIds} from '../docs/video-revision-20260924/projectile-advanced.mjs';
import {applyAdditionPrerequisiteRoutes} from '../docs/video-revision-20260924/addition-theorem.mjs';
const read=f=>JSON.parse(readFileSync(f)),root='docs/video-revision-20260924';
const plan=read(root+'/full-plan.generated.json'),fullRoutes=read(root+'/full-routes.generated.json'),ready=[];
assert.ok(process.env.FFMPEG,'Set FFMPEG');
for(const id of ['prep-addition-theorem',...projectileAdvancedIds]){
 const source=plan.find(c=>c.id===id),base=`public/media/${source.mediaDirectory}/${id}`;
 for(const ext of ['mp4','jpg','json'])assert.ok(existsSync(base+'.'+ext));
 const c=read(base+'.json');
 for(const k of ['title','visualPilot','before','legacyPositionExcluded','navigationBreaks','manuscriptScenes'])assert.deepEqual(c[k],source[k],id+'/'+k);
 assert.equal(c.animationFPS,30);assert.equal(c.spacingVersion,'20260924-furigana-spacing-v2');assert.equal(c.scenes.length,source.scenes.length);assert.equal(c.scenes.at(-1).end,c.duration);
 for(const [i,s]of c.scenes.entries()){
  for(const k of ['cues','utterances','narration'])assert.deepEqual(s[k],source.scenes[i][k],id+'/'+i+'/'+k);
  assert.equal(s.captions.map(x=>x.text).join(''),s.narration);assert.ok(s.captions.every(x=>x.end>x.start&&x.start>=s.start&&x.end<=s.end));
 }
 const probe=spawnSync(process.env.FFMPEG,['-hide_banner','-i',base+'.mp4'],{encoding:'utf8'});assert.match(probe.stderr,/Video: h264/);assert.match(probe.stderr,/Audio: aac/);assert.match(probe.stderr,/30 fps/);
 const d=probe.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);assert.ok(d);assert.ok(Math.abs(+d[1]*3600+ +d[2]*60+ +d[3]-c.duration)<.15);
 const decode=spawnSync(process.env.FFMPEG,['-v','error','-i',base+'.mp4','-f','null','-'],{encoding:'utf8'});assert.equal(decode.status,0,decode.stderr);ready.push(c);
}
const prefix='src/content/',mainFile=prefix+'revised-video-catalog.generated.json',insertFile=prefix+'insert-video-catalog.generated.json',prepFile=prefix+'prerequisite-video-catalog.generated.json',routeFile=prefix+'prerequisite-routes.generated.json',insertRouteFile=prefix+'insert-routes.generated.json';
const merge=(file,items)=>[...new Map([...read(file),...items].map(c=>[c.id,c])).values()];
const routes=read(routeFile),oldRoutes=structuredClone(routes);applyAdditionPrerequisiteRoutes(routes);
const original=[...read(prefix+'lesson-video-catalog.generated.json'),...read(prefix+'em-video-catalog.generated.json')];
for(const [id,r]of Object.entries(routes))if(JSON.stringify(r)!==JSON.stringify(oldRoutes[id])){
 assert.ok(original.some(c=>c.id===id));assert.deepEqual(r,fullRoutes.prerequisites[id],'Manuscript prerequisite order '+id);
}
const newPrep=ready.find(c=>c.id==='prep-addition-theorem');
assert.deepEqual(newPrep.before,Object.keys(routes).filter(id=>routes[id].required.includes(newPrep.id)));
const inserts=read(insertRouteFile);inserts['m-projectile-advanced']=fullRoutes.inserts['m-projectile-advanced'];
assert.deepEqual(inserts['m-projectile-advanced'],[{afterScene:3,inserts:['hm-why-11']}]);
const changes=[[mainFile,merge(mainFile,ready.filter(c=>c.kind!=='insert'))],[insertFile,merge(insertFile,ready.filter(c=>c.kind==='insert'))],[prepFile,merge(prepFile,[newPrep])],[routeFile,routes],[insertRouteFile,inserts]];
for(const [f,data]of changes)writeFileSync(f+'.pending',f===routeFile?JSON.stringify(data,null,2)+'\n':JSON.stringify(data));
for(const [f]of changes)renameSync(f+'.pending',f);
console.log('Registered 4 decoded films, the new prerequisite and its explicit manuscript destinations; other catalog entries preserved.');
