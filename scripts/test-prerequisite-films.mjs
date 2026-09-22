import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {build} from 'esbuild';
import {prerequisites} from '../docs/video-scripts/prerequisite-order.mjs';
import {prerequisiteDiagram} from './prerequisite-diagrams.mjs';
const read=p=>JSON.parse(readFileSync(p));
const prep=read('src/content/prerequisite-video-catalog.generated.json');
const original=read('src/content/lesson-video-catalog.generated.json'),em=read('src/content/em-video-catalog.generated.json');
const bundle=await build({entryPoints:['src/game/prerequisite-playlist.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {prerequisitePlaylist,prerequisiteReview}=await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const routes=read('src/content/prerequisite-routes.generated.json');
assert.equal(prep.length,76);assert.equal(new Set(prep.map(p=>p.id)).size,prep.length);
let bytes=0,seconds=0,scenes=0;
for(const p of prep){
 assert.ok(p.before.length);assert.ok(p.before.every(id=>original.some(m=>m.id===id)),p.id);
 assert.ok(p.scenes.length>=3&&p.scenes.length<=6);
 assert.deepEqual(read(`public/media/lessons/${p.id}.json`),p);
 bytes+=statSync(`public/media/lessons/${p.id}.mp4`).size;seconds+=p.duration;
 assert.ok(statSync(`public/media/lessons/${p.id}.jpg`).size>1000);
 let end=0;
 for(const s of p.scenes){
  scenes++;assert.equal(s.start,end);assert.ok(s.end>s.start);end=s.end;
  assert.equal(s.narration,s.captions.map(c=>c.text).join(''));
  assert.ok(s.captions.every(c=>c.start>=s.start&&c.end<=s.end));
  const first=prerequisiteDiagram(p,s,0),last=prerequisiteDiagram(p,s,1);
  assert.notEqual(first,last,`No changing diagram ${p.id}/${s.index}`);
  assert.ok(!/NaN|undefined/.test(first+last),`${p.id}/${s.index}`);
 }
 assert.equal(end,p.duration);
}
for(const target of original){
 const list=prerequisitePlaylist([target],prep),ids=list.map(m=>m.id);
 assert.equal(ids.at(-1),target.id);
 assert.deepEqual(ids.slice(0,-1),routes[target.id].required);
 assert.equal(new Set(ids).size,ids.length);
 const reviewIds=prerequisiteReview([target],prep).map(p=>p.id);
 for(const id of reviewIds){
  for(const dep of prerequisites[id.replace(/^prep-/,'')]??[])assert.ok(reviewIds.indexOf(`prep-${dep}`)>=0&&reviewIds.indexOf(`prep-${dep}`)<reviewIds.indexOf(id),`${target.id}: ${dep} available in optional review before ${id}`);
 }
}
assert.deepEqual(prerequisitePlaylist(em,prep),em,'Do not insert non-EM prerequisites into university EM playlists');
for(const stage of new Set(original.map(m=>m.stageId)))for(const level of ['intro','middle','advanced']){
 const list=prerequisitePlaylist(original.filter(m=>m.stageId===stage&&m.level===level),prep);
 assert.equal(new Set(list.map(m=>m.id)).size,list.length,`${stage}/${level} duplicated media`);
 assert.deepEqual(list.filter(m=>!m.id.startsWith('prep-')),original.filter(m=>m.stageId===stage&&m.level===level));
}
console.log(JSON.stringify({result:'PASS',prerequisiteVideos:prep.length,scenes,existingVideosCovered:original.length,stages:96,universityEMPlaylistUnchanged:true,minutes:+(seconds/60).toFixed(1),MiB:+(bytes/2**20).toFixed(1),limits:'Technical coverage and ordering, not a learner-comprehension certification.'},null,2));
