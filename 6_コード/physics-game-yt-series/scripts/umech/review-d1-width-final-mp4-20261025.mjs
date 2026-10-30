// Extract actual encoded frames only. Nothing here records an eye-review pass.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
const [mp4,renderPath,out]=process.argv.slice(2);
assert(mp4&&renderPath&&out&&!fs.existsSync(out));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const source='/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025';
const data=JSON.parse(fs.readFileSync(source+'/blender/data.json'));
const render=JSON.parse(fs.readFileSync(renderPath));
assert(render.renders===149&&render.mode==='render'&&render.allAffectedAndBoundaryPhysicalPass);
const total=12162, requested=new Map(),endpointMaps=[];
function add(j,reason){
 assert(Number.isInteger(j)&&j>=0&&j<=total);
 if(j===total){endpointMaps.push({requestedFrame:j,actualFrame:total-1,reason:'Exact source endpoint is beyond encoded CFR samples; inspect encoded last frame instead',origin:reason});j=total-1;}
 if(!requested.has(j))requested.set(j,[]);requested.get(j).push(reason);
}
for(let t=0;t<=405;t++)add(t*30,'integer-second');
for(const q of data.cues)add(Math.ceil(q.end*30-1e-7)-1,'exact-cue-last:'+q.key);
for(const r of render.rows)add(r.frame,'changed-30fps-frame');
for(const j of render.boundaryFrames)for(let d=-2;d<=2;d++)if(j+d>=0&&j+d<total)add(j+d,'patch-boundary');
for(const t of data.landmarks)add(Math.round(t*30),'main12');
add(0,'first');add(total-1,'last');
const indices=[...requested.keys()].sort((a,b)=>a-b);
fs.mkdirSync(out);fs.mkdirSync(out+'/frames');fs.mkdirSync(out+'/pages');
const pins={mp4:sha(mp4),renderReport:sha(renderPath)};
const ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const run=spawnSync(ff,['-nostdin','-v','error','-xerror','-i',mp4,'-vf','select='+indices.map(j=>`eq(n\\,${j})`).join('+'),'-fps_mode','passthrough','-q:v','2',out+'/frames/%04d.jpg'],{encoding:'utf8',maxBuffer:1<<24});
fs.writeFileSync(out+'/decode.log',run.stderr??'',{flag:'wx'});assert.equal(run.status,0,run.stderr);
const files=fs.readdirSync(out+'/frames').filter(f=>f.endsWith('.jpg')).sort();assert.equal(files.length,indices.length);
const rows=indices.map((j,i)=>({frame:j,time:j/30,reasons:requested.get(j),file:out+'/frames/'+files[i],sha256:sha(out+'/frames/'+files[i])}));
const pages=[];
for(let at=0;at<rows.length;at+=10){
 const layers=[];
 for(let i=0;i<10&&at+i<rows.length;i++){
  const r=rows[at+i],x=(i%5)*360,y=Math.floor(i/5)*662;
  const label=`D-1 ${r.time.toFixed(3)} s / frame ${r.frame}${r.reasons.includes('changed-30fps-frame')?' PATCH':''}`;
  const head=Buffer.from(`<svg width="360" height="22"><rect width="360" height="22" fill="white"/><text x="5" y="17" font-family="Hiragino Sans" font-size="14" fill="#241c15">${label}</text></svg>`);
  layers.push({input:head,left:x,top:y},{input:await sharp(r.file).resize(360,640).toBuffer(),left:x,top:y+22});
 }
 const p=out+'/pages/page-'+String(pages.length+1).padStart(3,'0')+'.jpg';
 await sharp({create:{width:1800,height:1324,channels:3,background:'#fff'}}).composite(layers).jpeg({quality:94}).toFile(p);
 pages.push({page:pages.length+1,file:p,sha256:sha(p),frames:rows.slice(at,at+10).map(r=>r.frame)});
}
assert.equal(sha(mp4),pins.mp4);assert.equal(sha(renderPath),pins.renderReport);
fs.writeFileSync(out+'/manifest.json',JSON.stringify({episode:'D-1',mp4,mp4Sha256:pins.mp4,renderReport:renderPath,renderReportSha256:pins.renderReport,actualEncodedSource:true,frameCount:rows.length,integerSeconds:406,changedFrames:149,exactCueEnds:57,endpointMaps,rows,pages,allImagesPersonallyViewed:false,earListeningPerformed:false},null,1),{flag:'wx'});
console.log(JSON.stringify({out,frames:rows.length,pages:pages.length}));
