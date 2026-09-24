/** Publish only a complete, explicitly selected unit into the local app catalog. */
import {readFileSync,writeFileSync,existsSync,renameSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const read=f=>JSON.parse(readFileSync(f));
const root='docs/video-revision-20260924';
const plan=read(`${root}/full-plan.generated.json`),routes=read(`${root}/full-routes.generated.json`);
const selected=process.argv.slice(2);assert.ok(selected.length,'Specify the reviewed stage IDs');
const original=[...read('src/content/lesson-video-catalog.generated.json'),...read('src/content/em-video-catalog.generated.json')];
const oldPrepRoutes=read('src/content/prerequisite-routes.generated.json');
const oldPreps=read('src/content/prerequisite-video-catalog.generated.json');
const required=new Set();
for(const stageId of selected){
 const main=original.filter(c=>c.stageId===stageId);assert.ok(main.length,`Unknown stage ${stageId}`);
 for(const c of main){
  required.add(c.id);
  // New prerequisite assignments are not silently discarded by this registrar.
  assert.deepEqual(routes.prerequisites[c.id],oldPrepRoutes[c.id],`Implement changed prerequisite routing before registering ${c.id}`);
  for(const prep of routes.prerequisites[c.id]?.required??[]){
   assert.ok(oldPreps.some(c=>c.id===prep),`New prerequisite requires catalog support: ${prep}`);
   if(plan.some(c=>c.id===prep))required.add(prep);
  }
  for(const route of routes.inserts[c.id]??[])for(const id of route.inserts)required.add(id);
 }
}
const ready=[];
for(const id of required){
 const source=plan.find(c=>c.id===id);assert.ok(source,`Missing plan ${id}`);
 const base=`public/media/${source.mediaDirectory}/${id}`;
 for(const ext of ['mp4','jpg','json'])assert.ok(existsSync(`${base}.${ext}`),`Incomplete media ${base}.${ext}`);
 const c=read(`${base}.json`);
 assert.equal(c.title,source.title);
 assert.equal(c.scenes.length,source.scenes.length);
 assert.equal(c.scenes.at(-1).end,c.duration);
 for(const [i,s]of c.scenes.entries()){
  assert.deepEqual([s.narration,s.utterances],[source.scenes[i].narration,source.scenes[i].utterances],`Outdated narration ${id}/${i}`);
  assert.equal(s.captions.map(cap=>cap.text).join(''),s.narration);
  assert.ok(s.end>s.start&&s.captions.every(cap=>cap.end>cap.start&&cap.start>=s.start&&cap.end<=s.end));
 }
 assert.ok(process.env.FFMPEG,'Set FFMPEG for actual media verification');
 const probe=spawnSync(process.env.FFMPEG,['-hide_banner','-i',`${base}.mp4`],{encoding:'utf8'});
 assert.match(probe.stderr,/Video: h264/);assert.match(probe.stderr,/Audio: aac/);
 const m=probe.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);assert.ok(m);
 assert.ok(Math.abs(+m[1]*3600+ +m[2]*60+ +m[3]-c.duration)<.15,`Encoded duration ${id}`);
 const decode=spawnSync(process.env.FFMPEG,['-v','error','-i',`${base}.mp4`,'-f','null','-'],{encoding:'utf8'});
 assert.equal(decode.status,0,decode.stderr);
 ready.push(c);
}
// All validation completes before any app data is replaced.
const merge=(file,added)=>[...new Map([...read(file),...added].map(c=>[c.id,c])).values()];
const mainFile='src/content/revised-video-catalog.generated.json',insertFile='src/content/insert-video-catalog.generated.json',routeFile='src/content/insert-routes.generated.json';
const inserts=merge(insertFile,ready.filter(c=>c.kind==='insert'));
const main=merge(mainFile,ready.filter(c=>c.kind!=='insert'));
const nextRoutes=read(routeFile);
for(const c of ready.filter(c=>!c.id.startsWith('prep-')&&c.kind!=='insert'))nextRoutes[c.id]=routes.inserts[c.id]??[];
for(const [file,data]of [[mainFile,main],[insertFile,inserts],[routeFile,nextRoutes]]){
 writeFileSync(file+'.pending',JSON.stringify(data));renameSync(file+'.pending',file);
}
console.log(`Registered ${ready.length} verified media for ${selected.join(', ')}. Other units remain unchanged. No push.`);
