import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
const b=await build({entryPoints:['src/game/manual-video-playlist.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {manualVideoPlaylist}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
const boundaryBundle=await build({entryPoints:['src/game/video-page-boundary.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {holdVideoPage}=await import('data:text/javascript;base64,'+Buffer.from(boundaryBundle.outputFiles[0].text).toString('base64'));
for(const [start,end]of [[0,10],[10,20],[2,2.01]]){
 for(const offset of [0,.02,.3,2]){
  let pauses=0;const video={currentTime:end+offset,pause:()=>pauses++};
  assert.equal(holdVideoPage(video,start,end),true);
  assert.equal(pauses,1);assert.ok(video.currentTime>=start&&video.currentTime<end);
  assert.equal(holdVideoPage(video,start,end),false,'Hold must not loop through repeated seeks');
 }
 const video={currentTime:start,pause:()=>{throw Error('Premature pause');}};
 assert.equal(holdVideoPage(video,start,end),false);
}
const read=name=>JSON.parse(readFileSync('src/content/'+name+'.generated.json'));
const replacements=read('revised-video-catalog'),inserts=read('insert-video-catalog'),routes=read('insert-routes');
const movies=[...read('em-video-catalog'),...read('lesson-video-catalog'),...read('prerequisite-video-catalog')].map(m=>replacements.find(r=>r.id===m.id)??m);
let count=0;
for(const m of movies){
 const quick=manualVideoPlaylist([m],'quick',routes,inserts),deep=manualVideoPlaylist([m],'thorough',routes,inserts);
 assert.equal(quick.length,(m.navigationBreaks?.length??0)+1);assert.equal(quick[0].id,m.id);
 assert.ok(quick.every(p=>p.media.id===m.id),'Quick mode excludes supplements but retains authored chapter breaks');
 assert.ok(Math.abs(quick.reduce((sum,p)=>sum+p.end-p.start,0)-m.duration)<1e-6);
 assert.equal(new Set(deep.map(p=>p.id)).size,deep.length);
 const main=deep.filter(p=>p.media.id===m.id);
 assert.equal(main[0].id,m.id,'Old saved IDs still select the main video');
 let position=0;
 for(const p of main){assert.equal(p.start,position);assert.ok(p.end>p.start);position=p.end;}
 assert.equal(position,m.duration,'Every main second appears exactly once, without gaps');
 // Source files may append a new insert at an earlier boundary. Playback order
 // follows the chapter timeline, not the order requirements were imported.
 const expected=[...(routes[m.id]??[])].sort((a,b)=>a.afterScene-b.afterScene).flatMap(r=>r.inserts);
 assert.deepEqual(deep.filter(p=>p.media.id!==m.id).map(p=>p.media.id),expected);
 count+=deep.length;
}
const circular=movies.find(m=>m.id==='m-circular-intro');
const uniform=movies.find(m=>m.id==='m1-uniform-accel-advanced');
if(routes[uniform.id]?.some(r=>r.inserts.includes('hm-why-24'))){
 const pages=manualVideoPlaylist([uniform],'thorough',routes,inserts);
 const average=pages.findIndex(p=>p.media.id==='hm-why-24'),braking=pages.findIndex(p=>p.media.id==='hm-why-07');
 assert.ok(average>0&&braking>average);
 assert.equal(pages[average-1].end,uniform.scenes[0].end);
 assert.equal(pages[braking-1].end,uniform.duration);
}
for(const [id,insert,afterScene]of [['m1-velocity-intro','hm-why-01',2],['m1-velocity-middle','hm-why-02',2],['m1-velocity-advanced','hm-why-03',2],['m1-acceleration-advanced','hm-why-04',3]]){
 const main=movies.find(m=>m.id===id),pages=manualVideoPlaylist([main],'thorough',routes,inserts);
 const i=pages.findIndex(p=>p.media.id===insert);assert.ok(i>0,id+' insert reachable');
 assert.equal(pages[i-1].end,main.scenes[afterScene-1].end);
 if(afterScene<main.scenes.length)assert.equal(pages[i+1].start,main.scenes[afterScene-1].end);
 assert.equal(pages.filter(p=>p.media.id===insert).length,1);
 assert.ok(!manualVideoPlaylist([main],'quick',routes,inserts).some(p=>p.media.id===insert));
}
assert.deepEqual(manualVideoPlaylist([circular],'thorough',routes,inserts).map(p=>p.media.id),['m-circular-intro','hm-why-18','m-circular-intro']);
const player=readFileSync('src/components/SegmentedLessonVideo.tsx','utf8');
assert.doesNotMatch(player,/advance|setCursor|autoPlay|videoSegments/,'Player must not own source navigation');
assert.match(player,/onEnded=\{\(\)=>setPlaying\(false\)\}/);
assert.match(player,/v\.pause\(\)/);
assert.ok((player.match(/holdVideoPage\(/g)??[]).length>=3,'Guard animation frames, time updates and manual seeks');
const ui=readFileSync('src/components/EMVideoLesson.tsx','utf8');
assert.match(ui,/list\.map/);assert.match(ui,/selectPage\(page\+1\)/);assert.match(ui,/selectPage\(page-1\)/);
console.log('PASS: '+movies.length+' movies, '+count+' manual pages; coverage, ordering, stable IDs, no autoplay transitions, dots/previous/next');
