import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
async function load(file){
 const bundle=await build({entryPoints:[file],bundle:true,write:false,platform:'node',format:'esm'});
 return import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
}
const {prerequisitePlaylist:playlist,prerequisiteReview:review}=await load('src/game/prerequisite-playlist.ts');
const {restoredVideoId,legacyVideoId}=await load('src/game/video-progress.ts');
const read=f=>JSON.parse(readFileSync(f,'utf8'));
const originals=['em','lesson'].flatMap(f=>read(`src/content/${f}-video-catalog.generated.json`));
const prep=read('src/content/prerequisite-video-catalog.generated.json');
const routes=read('src/content/prerequisite-routes.generated.json');
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
 const oldSeen=new Set(),oldList=main.flatMap(c=>{const p=prep.filter(p=>p.before.includes(c.id)&&!oldSeen.has(p.id));p.forEach(p=>oldSeen.add(p.id));return [...p,c];});
 oldList.forEach((c,i)=>{
  assert.equal(legacyVideoId(String(i),main,prep),c.id);
  const id=restoredVideoId(c.id,completed,main,prep);
  assert.ok(list.some(c=>c.id===id));
  if(!c.id.startsWith('prep-'))assert.equal(id,c.id,'Resume must preserve the selected main video');
 });
}
// Keeping an asset is not a reason to insert it into an unrelated unit.
assert.equal(prep.length,76,'Media assets themselves are preserved');
const surface=originals.filter(c=>c.stageId==='ui-through-a-surface');
assert.deepEqual(playlist(surface,prep),surface);
assert.deepEqual(review(surface,prep),[],'Surface unit must not contain motion, force, or vector review');
for(const id of ['e-field-intro','e-field-middle','e-field-advanced'])assert.deepEqual(routes[id].required,[],'Do not attach circuit/magnetic-flux compilation videos to electric-field units');
for(const route of Object.values(routes))assert.deepEqual(route.review,route.required);
assert.equal(legacyVideoId(null,surface,prep),null);assert.equal(legacyVideoId('NaN',surface,prep),null);
assert.equal(restoredVideoId(null,surface,surface),surface[0].id);
const component=readFileSync('src/components/EMVideoLesson.tsx','utf8');
assert.ok(component.includes('const [assigned]=useState('),'Freeze unit assignments until chapter/level changes; mode may expose supplement pages');
assert.ok(!/readWatchedVideos|markVideoWatched/.test(component),'Viewing history must not control video membership');
assert.ok(component.includes('必要なときだけ復習')&&component.includes('学習に戻る')&&component.includes('btn-battle'));
console.log(JSON.stringify({result:'PASS',courses:courses.length,stages:new Set(originals.map(c=>c.stageId)).size,oldPlacements:before,newPlacements:after,reviewable:reviewable.size,surfaceMainSeconds:surface[0].duration,checks:['direct unit assignments only','viewing-history independent','no ancestor expansion in review','legacy ID migration','main films preserved']},null,2));
