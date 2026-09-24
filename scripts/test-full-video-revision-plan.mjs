import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {revisionSceneDiagram,revisionSceneEquation} from './revision-scene-visuals.mjs';
const root='docs/video-revision-20260924';
const read=name=>JSON.parse(readFileSync(`${root}/${name}.generated.json`));
const plan=read('full-plan'),routes=read('full-routes'),report=read('compile-report');
const originals=['em','lesson','prerequisite'].flatMap(k=>JSON.parse(readFileSync(`src/content/${k}-video-catalog.generated.json`)));
const clips=new Map([...originals,...plan].map(c=>[c.id,c]));
assert.equal(new Set(plan.map(c=>c.id)).size,plan.length,'Duplicate media IDs');
assert.deepEqual(report.issues,[],'Unresolved compilation targets');
assert.equal(report.publicationReady,false,'Compilation alone must not approve publication');
assert.equal(read('import-ledger').documents.length,9,'All nine script documents are required');
for(const clip of plan){
 assert.ok(clip.scenes.length,`Empty video: ${clip.id}`);
 for(const [i,scene]of clip.scenes.entries()){
  // Legacy EM chunks retain indices into their parent stage's full storyboard.
  // Their local playlist order is represented by sceneId, not that legacy index.
  assert.equal(scene.sceneId,`${clip.id}-s${i+1}`,`${clip.id}: scene order`);
  if(scene.utterances)assert.equal(scene.utterances.map(u=>u.subtitle).join(''),scene.narration);
 }
}
const referenced=new Set();
for(const [id,entries]of Object.entries(routes.inserts)){
 const main=clips.get(id);assert.ok(main,`Missing main ${id}`);
 const scenes=new Set();
 for(const entry of entries){
  assert.ok(Number.isInteger(entry.afterScene)&&entry.afterScene>=0&&entry.afterScene<=main.scenes.length,`Invalid boundary ${id}`);
  assert.ok(!scenes.has(entry.afterScene),`Duplicate boundary ${id}`);scenes.add(entry.afterScene);
  assert.equal(new Set(entry.inserts).size,entry.inserts.length);
  for(const insert of entry.inserts){assert.equal(clips.get(insert)?.kind,'insert',`Missing insert ${insert}`);referenced.add(insert);}
 }
}
for(const c of plan.filter(c=>c.kind==='insert'))assert.ok(referenced.has(c.id),`Unreachable insert ${c.id}`);
for(const [id,r]of Object.entries(routes.prerequisites)){
 assert.ok(clips.has(id),`Missing prerequisite target ${id}`);
 for(const prep of [...r.required,...r.review])assert.ok(clips.has(prep),`Missing prerequisite ${prep}`);
}
// File 02's supplied eighteen inserts and its shared numeric scene are mandatory.
for(const prefix of ['ht','hw'])for(let n=1;n<=9;n++)assert.ok(referenced.has(`${prefix}-why-${String(n).padStart(2,'0')}`));
assert.equal(clips.get('t-firstlaw-intro').scenes.length,4);
assert.equal(clips.get('t-firstlaw-intro').scenes[3].mode,'common');
assert.ok(clips.get('t-firstlaw-intro').scenes[3].revisionEquations[0].includes('100-40=60'));
assert.deepEqual(routes.inserts['t-ideal-advanced'].find(r=>r.afterScene===2).inserts,['ht-why-06','ht-why-07']);
assert.ok(report.visualTasks.some(t=>t.id==='t-heat-advanced'&&t.scene===2),'Visual-only g/J-per-g correction must not disappear');
assert.ok(clips.get('t-heat-intro').title.endsWith('?'),'Unchanged narration still receives the supplied question title');
for(const id of ['t-firstlaw-intro','m-projectile-middle','m-momentum-middle']){
 const clip=clips.get(id),scene=clip.scenes[3];
 for(const p of [0,.25,.5,.75,1]){
  const svg=revisionSceneDiagram(clip,scene,p);
  assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg),`${id}: invalid diagram`);
  assert.ok(revisionSceneEquation(clip,scene,p),`${id}: missing calculation`);
 }
 assert.notEqual(revisionSceneDiagram(clip,scene,0),revisionSceneDiagram(clip,scene,.75),`${id}: static diagram`);
}
console.log(`Full manuscript plan: ${plan.length} videos; routes, 02 additions, and numerical-scene checks passed. This does not certify rendered media.`);
