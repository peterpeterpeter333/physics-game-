import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
async function load(file){
 const bundle=await build({entryPoints:[file],bundle:true,write:false,platform:'node',format:'esm'});
 return import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
}
const {prerequisitePlaylist:playlist,prerequisiteReview:review}=await load('src/game/prerequisite-playlist.ts');
const {readWatchedVideos,markVideoWatched,restoredVideoId,legacyVideoId}=await load('src/game/video-progress.ts');
const read=f=>JSON.parse(readFileSync(f,'utf8'));
const originals=['em','lesson'].flatMap(f=>read(`src/content/${f}-video-catalog.generated.json`));
const prep=read('src/content/prerequisite-video-catalog.generated.json');
const routes=read('src/content/prerequisite-routes.generated.json');
const courses=[...new Set(originals.map(c=>c.stageId+'|'+c.level))].map(key=>originals.filter(c=>c.stageId+'|'+c.level===key));
assert.equal(courses.length,190);assert.equal(Object.keys(routes).length,256);
const visited=new Set(),reviewable=new Set();let before=0,after=0;
for(const main of courses){
 const list=playlist(main,prep),ids=list.map(c=>c.id),completed=playlist(main,prep,new Set(prep.map(p=>p.id)));
 assert.equal(ids.length,new Set(ids).size);
 assert.deepEqual(list.filter(c=>!c.id.startsWith('prep-')),main);
 assert.deepEqual(completed,main,'Seen introductions must not reappear across chapters or levels');
 const expected=[...new Set(main.flatMap(c=>routes[c.id].required))];
 assert.deepEqual(new Set(list.filter(c=>c.id.startsWith('prep-')).map(c=>c.id)),new Set(expected));
 const refs=review(main,prep);refs.forEach(p=>reviewable.add(p.id));
 for(const id of expected)assert.ok(refs.some(c=>c.id===id),'Watched introductions remain replayable');
 for(const c of playlist(main,prep,visited).filter(c=>c.id.startsWith('prep-'))){assert.ok(!visited.has(c.id));visited.add(c.id);}
 const old=new Set(prep.filter(p=>main.some(c=>p.before.includes(c.id))).map(p=>p.id));
 before+=old.size;after+=expected.length;
 // Every existing numeric position is migrated via the OLD IDs, not the shorter array.
 const oldSeen=new Set(),oldList=main.flatMap(c=>{const p=prep.filter(p=>p.before.includes(c.id)&&!oldSeen.has(p.id));p.forEach(p=>oldSeen.add(p.id));return [...p,c];});
 oldList.forEach((c,i)=>{
  assert.equal(legacyVideoId(String(i),main,prep),c.id);
  const id=restoredVideoId(c.id,completed,main,prep);
  assert.ok(main.some(c=>c.id===id));
  if(!c.id.startsWith('prep-'))assert.equal(id,c.id,'Resume must preserve the selected main video');
 });
}
assert.equal(reviewable.size,76,'Do not lose access to any prerequisite film');
const surface=originals.filter(c=>c.stageId==='ui-through-a-surface');
assert.deepEqual(playlist(surface,prep),surface);
assert.ok(!review(surface,prep).some(c=>['prep-force','prep-acceleration','prep-work-path'].includes(c.id)));
const memoryStorage=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),data};};
const storage=memoryStorage();assert.equal(readWatchedVideos(storage).size,0);
markVideoWatched('prep-position',storage);markVideoWatched('prep-position',storage);
assert.deepEqual([...readWatchedVideos(storage)],['prep-position']);
const fresh=await load('src/game/video-progress.ts'); // same storage contract across component entries
assert.ok(fresh.readWatchedVideos(storage).has('prep-position'));
const fail={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};
markVideoWatched('prep-graph-slope',fail);assert.ok(readWatchedVideos(fail).has('prep-graph-slope'));
for(const raw of ['not json','{}','null','[null,8,"prep-trig"]']){
 const corrupt={getItem:()=>raw,setItem(){}};assert.doesNotThrow(()=>readWatchedVideos(corrupt));
}
assert.equal(legacyVideoId(null,surface,prep),null);assert.equal(legacyVideoId('NaN',surface,prep),null);
assert.equal(restoredVideoId(null,surface,surface),surface[0].id);
const component=readFileSync('src/components/EMVideoLesson.tsx','utf8');
assert.ok(component.includes('const [list]=useState('),'Freeze the queue until chapter/level changes');
assert.ok(component.includes('onEnded={()=>markVideoWatched(movie.id)}'));
assert.ok(component.includes('必要なときだけ復習')&&component.includes('学習に戻る')&&component.includes('btn-battle'));
console.log(JSON.stringify({result:'PASS',courses:courses.length,stages:new Set(originals.map(c=>c.stageId)).size,oldPlacements:before,newPlacements:after,reviewable:reviewable.size,surfaceMainSeconds:surface[0].duration,checks:['direct-only','cross-chapter completion','cross-level completion','optional review','legacy ID migration','blocked storage','main films preserved']},null,2));
