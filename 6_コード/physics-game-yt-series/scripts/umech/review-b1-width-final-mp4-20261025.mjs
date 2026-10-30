// Actual encoded frames; extraction never claims that anyone viewed them.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
import {containerVideoSamples} from './d1-physical-supplemental-checker-20261025.mjs';
const [mp4,renderPath,out]=process.argv.slice(2);
assert(mp4&&renderPath&&out&&!fs.existsSync(out));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const source='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025';
const data=read(source+'/blender/data.json').b1,render=read(renderPath);
assert.equal(data.cues.length,50);assert.equal(data.preview.length,12);
assert(render.mode==='render'&&render.actualRenderCount===262&&render.allGuardedStatesPass);
assert(!render.error&&!render.cleanupError&&Object.values(render.protectionChecks).every(Boolean));
assert.equal(containerVideoSamples(mp4),10700);
const requested=new Map(),endpointMaps=[];
function add(j,reason){
 assert(Number.isInteger(j)&&j>=0&&j<=10700);
 if(j===10700){endpointMaps.push({requested:j,actual:10699,reason});j=10699;}
 if(!requested.has(j))requested.set(j,[]);
 requested.get(j).push(reason);
}
for(let s=0;s<=356;s++)add(s*30,'integer-second');
for(const q of data.cues)add(Math.ceil(q.end*30-1e-7)-1,'cue-last:'+q.key);
for(const j of render.changedOutputFrames)add(j,'changed-30fps-frame');
for(const j of [3168,3169,3440,3441,4824,4825,4916,4917,4939,4940,4941,8952,8953,8957,8958,8975,8976])
 for(let k=-2;k<=2;k++)add(j+k,'boundary');
for(const t of data.preview)add(Math.round(t*30),'main12');
add(0,'first');add(10699,'last');
const indices=[...requested.keys()].sort((a,b)=>a-b),pins={movie:sha(mp4),render:sha(renderPath)};
fs.mkdirSync(out);fs.mkdirSync(out+'/frames');fs.mkdirSync(out+'/pages');
const ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const run=spawnSync(ff,['-nostdin','-v','error','-xerror','-i',mp4,'-vf','select='+indices.map(j=>`eq(n\\,${j})`).join('+'),'-fps_mode','passthrough','-q:v','2',out+'/frames/%04d.jpg'],{encoding:'utf8',maxBuffer:1<<24});
fs.writeFileSync(out+'/decode.log',run.stderr??'',{flag:'wx'});assert.equal(run.status,0,run.stderr);
const files=fs.readdirSync(out+'/frames').filter(f=>f.endsWith('.jpg')).sort();
assert.equal(files.length,indices.length);
const rows=indices.map((j,i)=>({frame:j,time:j/30,reasons:requested.get(j),file:out+'/frames/'+files[i],sha256:sha(out+'/frames/'+files[i])}));
const pages=[];
for(let at=0;at<rows.length;at+=20){
 const layers=[];
 for(let i=0;i<20&&at+i<rows.length;i++){
  const r=rows[at+i],x=(i%5)*216,y=Math.floor(i/5)*406;
  const label=`B-1 ${r.time.toFixed(3)}s #${r.frame}${r.reasons.includes('changed-30fps-frame')?' PATCH':''}`;
  layers.push({input:Buffer.from(`<svg width="216" height="22"><rect width="216" height="22" fill="white"/><text x="4" y="16" font-family="Hiragino Sans" font-size="11" fill="#241c15">${label}</text></svg>`),left:x,top:y},
   {input:await sharp(r.file).resize(216,384).toBuffer(),left:x,top:y+22});
 }
 const file=out+'/pages/page-'+String(pages.length+1).padStart(3,'0')+'.jpg';
 await sharp({create:{width:1080,height:1624,channels:3,background:'#fff'}}).composite(layers).jpeg({quality:96}).toFile(file);
 pages.push({page:pages.length+1,file,sha256:sha(file),frames:rows.slice(at,at+20).map(r=>r.frame)});
}
assert.equal(sha(mp4),pins.movie);assert.equal(sha(renderPath),pins.render);
fs.writeFileSync(out+'/manifest.json',JSON.stringify({episode:'B-1',mp4,mp4Sha256:pins.movie,renderReport:renderPath,renderReportSha256:pins.render,
 actualEncodedSource:true,encodedFrames:10700,frameCount:rows.length,integerSeconds:357,changedFrames:410,exactCueEnds:50,endpointMaps,rows,pages,
 allImagesPersonallyViewed:false,continuousPlaybackPerformed:false,earListeningPerformed:false},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,frames:rows.length,pages:pages.length}));
