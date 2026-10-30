import assert from 'node:assert/strict';
import {build} from 'esbuild';
const b=await build({entryPoints:['src/game/video-inserts.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {videoSegments,resumeSegment}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
const main={id:'main',duration:40,scenes:[{start:0,end:10},{start:10,end:25},{start:25,end:40}]};
const inserts=[{id:'why1',duration:12,scenes:[]},{id:'why2',duration:20,scenes:[]}];
const routes=[{afterScene:0,inserts:['why1']},{afterScene:1,inserts:['why2']},{afterScene:3,inserts:['why1']}];
const quick=videoSegments(main,'quick',routes,inserts),deep=videoSegments(main,'thorough',routes,inserts);
assert.deepEqual(quick.map(s=>[s.movieId,s.start,s.end]),[['main',0,40]]);
assert.deepEqual(deep.map(s=>[s.movieId,s.start,s.end]),[['why1',0,12],['main',0,10],['why2',0,20],['main',10,40],['why1',0,12]]);
assert.equal(deep.filter(s=>!s.insert).reduce((n,s)=>n+s.end-s.start,0),40);
for(const t of [0,5,10,24,25,39]){const s=deep[resumeSegment(deep,t)];assert.equal(s.insert,false);assert.ok(t>=s.start&&t<s.end);}
assert.equal(quick[resumeSegment(quick,deep[2].mainTime)].movieId,'main');
assert.equal(deep[resumeSegment(deep,40)].insert,false);
assert.throws(()=>videoSegments(main,'thorough',[{afterScene:4,inserts:['why1']}],inserts));
assert.throws(()=>videoSegments(main,'thorough',[{afterScene:1,inserts:['missing']}],inserts));
assert.deepEqual(videoSegments(main,'thorough',[],[]).map(s=>[s.start,s.end]),[[0,40]]);
console.log('Video insert tests: boundaries, both modes, pause/resume coordinates, missing media, and full main coverage passed.');
