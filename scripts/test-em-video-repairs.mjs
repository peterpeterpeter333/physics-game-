import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadSource} from './build-em-film-plan.mjs';
import {spokenEquation} from './em-film-equations.mjs';
import {repairedDiagram,diagramClock} from './em-film-visuals.mjs';

const read=p=>JSON.parse(readFileSync(p));
const revisions=read('scripts/em-narration-revisions.json');
const scope=read('scripts/em-video-repair-scope.json');
const {stages,diagram}=await loadSource();
const movies=read('src/content/em-video-catalog.generated.json');
let edited=0,checked=0;
for(const [id,entries] of Object.entries(revisions)){
 const stage=stages.find(s=>s.id===id);assert.ok(stage,id);
 for(const [number,text] of Object.entries(entries)){
  assert.equal(stage.steps[+number-1].narration,text,`${id}:${number} revision not applied`);
  assert.ok(scope[id].includes(+number));edited++;
 }
}
// Every item in the original 184-row speech review must have an authored revision.
let id,issues=0;
for(const line of readFileSync('docs/em-japanese-review.md','utf8').split('\n')){
 const heading=line.match(/^### .*`([^`]+)`/);if(heading)id=heading[1];
 const row=line.match(/^\| (\d+) \|/);if(!row)continue;
 assert.ok(revisions[id]?.[row[1]],`Unaddressed speech finding: ${id}:${row[1]}`);issues++;
}
assert.equal(issues,184);assert.equal(edited,182);
for(const clip of movies){
 assert.match(clip.renderKey??'',/^[a-f0-9]{64}$/,`${clip.id}: not rendered with the repaired pipeline`);
 const stage=stages.find(s=>s.id===clip.stageId);
 for(const scene of clip.scenes){
  assert.equal(scene.narration,stage.steps[scene.index].narration,`${clip.id}: stale speech`);
  if(!scope[clip.stageId]?.includes(scene.index+1))continue;
  const step=stage.steps[scene.index];
  for(const [i,c] of scene.captions.entries()){
   const local=(c.start+c.end)/2-scene.start;
   const svg=repairedDiagram(clip,scene,local,i)??diagram(step,diagramClock(step,local,i)).svg;
   assert.ok(svg.includes('<svg'));assert.ok(!/NaN|undefined/.test(svg),`${clip.id}: invalid figure`);
   assert.equal(typeof spokenEquation(clip,scene,i),'string');
  }
  checked++;
 }
}
assert.equal(checked,239);
const eq=(id,index,caption=0)=>spokenEquation({stageId:id},{index:index-1,equations:[]},caption);
assert.ok(eq('ue-integrals',3,2).includes("r'(u)"));
assert.ok(eq('ue-gauss',12,2).includes('G((R+d)^2)=G((R-d)^2)'));
assert.ok(eq('ue-maxwell',6,2).includes('partial_x^2E_y'));
assert.ok(eq('um-circuit-time',2,1).includes('dq'));
assert.equal(diagramClock({figure:'uie-tile-slider'},50,1),4.5);
assert.equal(diagramClock({figure:'ume-loop-zero'},50,1),4.1);
const G=(u,R,d)=>Math.sqrt(u)-(R*R-d*d)/Math.sqrt(u);
for(const [R,d] of [[2,1],[2,.3],[2,3]]){
 const delta=G((R+d)**2,R,d)-G((R-d)**2,R,d);
 assert.ok(Math.abs(delta-(d<R?4*d:0))<1e-10,'offset sphere endpoints');
}
const player=readFileSync('src/components/EMVideoLesson.tsx','utf8');
assert.ok(!player.includes('threadText'));
assert.ok(player.includes('onComplete(!alreadyFinished)'),'battle remains available');
assert.ok(!player.includes('autoPlay'));
console.log(JSON.stringify({result:'PASS',speechFindings:issues,rewrittenScenes:edited,repairedScenes:checked,movies:movies.length,limitations:'Structural and regression checks; not a claim that every narration was listened to or every pedagogical issue is impossible.'},null,2));
