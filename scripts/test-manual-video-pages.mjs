import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
const b=await build({entryPoints:['src/game/manual-video-playlist.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {manualVideoPlaylist}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
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
 const expected=(routes[m.id]??[]).flatMap(r=>r.inserts);
 assert.deepEqual(deep.filter(p=>p.media.id!==m.id).map(p=>p.media.id),expected);
 count+=deep.length;
}
const circular=movies.find(m=>m.id==='m-circular-intro');
assert.deepEqual(manualVideoPlaylist([circular],'thorough',routes,inserts).map(p=>p.media.id),['m-circular-intro','hm-why-18','m-circular-intro']);
const player=readFileSync('src/components/SegmentedLessonVideo.tsx','utf8');
assert.doesNotMatch(player,/advance|setCursor|autoPlay|videoSegments/,'Player must not own source navigation');
assert.match(player,/onEnded=\{\(\)=>setPlaying\(false\)\}/);
assert.match(player,/v\.pause\(\)/);
const ui=readFileSync('src/components/EMVideoLesson.tsx','utf8');
assert.match(ui,/list\.map/);assert.match(ui,/selectPage\(page\+1\)/);assert.match(ui,/selectPage\(page-1\)/);
console.log('PASS: '+movies.length+' movies, '+count+' manual pages; coverage, ordering, stable IDs, no autoplay transitions, dots/previous/next');
