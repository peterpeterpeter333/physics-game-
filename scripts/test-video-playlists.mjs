import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
async function load(file){
 const bundle=await build({entryPoints:[file],bundle:true,write:false,platform:'node',format:'esm'});
 return import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
}
const {prerequisitePlaylist:playlist,prerequisiteReview:review,thoroughPrerequisitePlaylist:thorough,prerequisiteSelectionParent:selectionParent}=await load('src/game/prerequisite-playlist.ts');
const {restoredVideoId,legacyVideoId}=await load('src/game/video-progress.ts');
const read=f=>JSON.parse(readFileSync(f,'utf8'));
const originals=['em','lesson'].flatMap(f=>read(`src/content/${f}-video-catalog.generated.json`));
const prep=read('src/content/prerequisite-video-catalog.generated.json');
const routes=read('src/content/prerequisite-routes.generated.json');
assert.deepEqual(routes['m-freefall-middle'].required,[]);
assert.deepEqual(routes['t-heat-intro'].required,[],'Do not teach the middle-level calculation before the heat introduction');
assert.deepEqual(routes['t-heat-middle'].required,['prep-heat-units'],'Keep the unit and temperature-difference introduction before calculations');
assert.deepEqual(routes['t-ideal-middle'].required,[],'Mole counting is introduced in the preceding main; do not preteach particle-form state equations here');
assert.deepEqual(routes['t-ideal-advanced'].required,['prep-mole','prep-gas-particles'],'Keep particle-count and collision derivations before microscopic energy');
for(const id of ['t-firstlaw-intro','t-firstlaw-middle'])assert.deepEqual(routes[id].required,[],'Do not preteach the complete work derivation before the main introduction');
assert.deepEqual(routes['t-firstlaw-advanced'].required,['prep-gas-work','prep-heat-cycle']);
assert.equal(read('src/content/insert-routes.generated.json')['t-firstlaw-advanced'].find(r=>r.inserts.includes('ht-why-09')).afterScene,2,'Efficiency example must follow its definition');
for(const id of ['w-basics-intro','w-basics-middle'])assert.deepEqual(routes[id].required,[],'Main films now introduce wave quantities before deriving speed');
assert.deepEqual(routes['m-freefall-advanced'].required,['prep-work-energy','prep-potential-conservation'],'Keep the actual energy introductions before the comparison');
// A prerequisite is removed only where its foundations are taught in the main.
// Other courses retain their prerequisites; remove no source assets.
for(const id of ['m1-velocity-intro','m1-velocity-middle','m1-velocity-advanced','m1-acceleration-intro','m1-acceleration-middle','m1-acceleration-advanced','m1-uniform-accel-intro','m1-uniform-accel-middle','m1-uniform-accel-advanced']){
 assert.deepEqual(routes[id].required,[],`${id}: avoid duplicated or premature prerequisite conclusions`);
 assert.deepEqual(playlist(originals.filter(c=>c.id===id),prep).map(c=>c.id),[id]);
}
const courses=[...new Set(originals.map(c=>c.stageId+'|'+c.level))].map(key=>originals.filter(c=>c.stageId+'|'+c.level===key));
assert.equal(courses.length,190);assert.equal(Object.keys(routes).length,256);
const reviewable=new Set();let before=0,after=0;
for(const main of courses){
 const list=playlist(main,prep),ids=list.map(c=>c.id),completed=playlist(main,prep,new Set(prep.map(p=>p.id)));
 assert.equal(ids.length,new Set(ids).size);
 assert.deepEqual(list.filter(c=>!c.id.startsWith('prep-')),main);
 assert.deepEqual(completed,list,'Unit membership must be independent of viewing history');
 const expected=[...new Set(main.flatMap(c=>routes[c.id].required))];
 assert.deepEqual(new Set(list.filter(c=>c.id.startsWith('prep-')).map(c=>c.id)),new Set(expected));
 const refs=review(main,prep);refs.forEach(p=>reviewable.add(p.id));
 assert.deepEqual(new Set(refs.map(c=>c.id)),new Set(expected),'Review must not expand unit scope');
 const old=new Set(prep.filter(p=>main.some(c=>p.before.includes(c.id))).map(p=>p.id));
 before+=old.size;after+=expected.length;
 // Every existing numeric position is migrated via the OLD IDs, not the shorter array.
 const oldSeen=new Set(),oldList=main.flatMap(c=>{const p=prep.filter(p=>!p.legacyPositionExcluded&&p.before.includes(c.id)&&!oldSeen.has(p.id));p.forEach(p=>oldSeen.add(p.id));return [...p,c];});
 oldList.forEach((c,i)=>{
  assert.equal(legacyVideoId(String(i),main,prep),c.id);
  const id=restoredVideoId(c.id,completed,main,prep);
  assert.ok(list.some(c=>c.id===id));
  if(!c.id.startsWith('prep-'))assert.equal(id,c.id,'Resume must preserve the selected main video');
 });
}
// Keeping an asset is not a reason to insert it into an unrelated unit.
assert.ok(prep.length>=76,'Original media assets are preserved; reviewed new prerequisites may be added');
if(prep.some(p=>p.id==='prep-addition-theorem')){
 const main=originals.filter(c=>c.id==='m-projectile-advanced');
 assert.deepEqual(playlist(main,[...prep].reverse()).map(p=>p.id),['prep-addition-theorem','prep-algebra-projectile','m-projectile-advanced']);
 assert.deepEqual(review(main,[...prep].reverse()).map(p=>p.id),['prep-addition-theorem','prep-algebra-projectile']);
 const oldPrep=prep.filter(p=>!p.legacyPositionExcluded),oldCount=oldPrep.filter(p=>p.before.includes(main[0].id)).length;
 for(let i=0;i<=oldCount;i++)assert.equal(legacyVideoId(String(i),main,prep),legacyVideoId(String(i),main,oldPrep),'New prerequisite must not change any old saved numeric index');
 assert.equal(legacyVideoId(String(oldCount),main,prep),'m-projectile-advanced');
}
const surface=originals.filter(c=>c.stageId==='ui-through-a-surface');
assert.deepEqual(playlist(surface,prep),surface);
assert.deepEqual(review(surface,prep),[],'Surface unit must not contain motion, force, or vector review');
for(const id of ['e-field-intro','e-field-advanced'])assert.deepEqual(routes[id].required,[],'Do not attach circuit/magnetic-flux compilation videos to electric-field units');
assert.deepEqual(routes['e-field-middle'].required,['prep-coulomb-field'],'Only the dedicated electric-field prerequisite belongs to this unit');
assert.equal(prep.find(p=>p.id==='prep-coulomb-field')?.legacyPositionExcluded,true,'A new prerequisite must not shift legacy saved indices');
assert.deepEqual(playlist(originals.filter(c=>c.id==='e-field-middle'),prep).map(c=>c.id),['prep-coulomb-field','e-field-middle']);
for(const route of Object.values(routes))assert.deepEqual(route.review,route.required);
assert.equal(legacyVideoId(null,surface,prep),null);assert.equal(legacyVideoId('NaN',surface,prep),null);
assert.equal(restoredVideoId(null,surface,surface),surface[0].id);
const component=readFileSync('src/components/EMVideoLesson.tsx','utf8');
const sine=[{id:'prep-sin-motion'},{id:'m-shm-advanced'}];
assert.deepEqual(thorough(sine,prep,'quick'),sine);
assert.deepEqual(thorough(sine,prep,'thorough').map(c=>c.id),['prep-addition-theorem','prep-sin-derivative','prep-sin-motion','m-shm-advanced']);
assert.deepEqual(thorough([{id:'prep-addition-theorem'},...sine,{id:'prep-sin-derivative'}],prep,'thorough').map(c=>c.id),['prep-addition-theorem','prep-sin-derivative','prep-sin-motion','m-shm-advanced']);
assert.deepEqual(thorough(surface,prep,'thorough'),surface,'Explicit sine proofs must not leak into unrelated units');
assert.equal(selectionParent('prep-sin-derivative:main:2',sine),'prep-sin-motion');
assert.equal(selectionParent('prep-addition-theorem',sine),'prep-sin-motion');
assert.equal(selectionParent('m-shm-advanced:main:1',sine),'m-shm-advanced');
assert.ok(component.includes('{reviewing?<button'),'A proof removed by a mode change must not hide normal page navigation');
assert.ok(component.includes('const [assigned]=useState('),'Freeze unit assignments until chapter/level changes; mode may expose supplement pages');
assert.ok(!/readWatchedVideos|markVideoWatched/.test(component),'Viewing history must not control video membership');
assert.ok(component.includes('必要なときだけ復習')&&component.includes('学習に戻る')&&component.includes('btn-battle'));
console.log(JSON.stringify({result:'PASS',courses:courses.length,stages:new Set(originals.map(c=>c.stageId)).size,oldPlacements:before,newPlacements:after,reviewable:reviewable.size,surfaceMainSeconds:surface[0].duration,checks:['direct unit assignments only','viewing-history independent','no ancestor expansion in review','legacy ID migration','main films preserved']},null,2));
