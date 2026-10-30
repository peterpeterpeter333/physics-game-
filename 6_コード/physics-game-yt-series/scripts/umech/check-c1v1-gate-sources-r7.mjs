// C-1 専用。共有検査を変更せず、関門B/Cの実写が現行の凍結ソースか確かめる。
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const W=fileURLToPath(new URL('../../',import.meta.url));
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1';
const read=f=>JSON.parse(fs.readFileSync(f));
const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const metaFile=cache+'/blender/gate-c1v1-run.json',m=read(metaFile),d=read(cache+'/blender/data.json');
assert.equal(m.width,1080);assert.equal(m.height,1920);assert.equal(m.samples,16);assert.equal(m.stateChecks,318);
assert.equal(m.revision,'r7');assert.deepEqual(m.times,[...new Set([...d.previews,...(d.extraPreviews??[]),0,1,2,358,359,360,214,215,216,331,332,333])]);assert.equal(m.times.length,39);
const covered=[...new Set(m.times.map(t=>d.cues.findLast(c=>c.start<=t).camera))].sort();assert.deepEqual(covered,Object.keys(d.cameras).sort(),'Not all camera kinds sampled');
assert.equal(m.treeCache.descendantsEqual,true);assert.ok(m.visibility.flushes>=318);assert.ok(m.visibility.objectsVerified>0);
assert.equal(m.armContact.length,4);for(const p of m.armContact){assert.ok(p.horizontalError<1e-8);assert.ok(p.verticalOverlap>=0&&p.verticalOverlap<=.002);assert.ok(p.depthOverlap>0);}
for(const rel of ['scripts/blender/desk_c1v1.py','scripts/blender/desk_lib_c1.py']){const f=path.join(W,rel);assert.equal(m.sourceSha256[f],hash(f),rel+' changed after the trial');}
assert.equal(m.sourceSha256[cache+'/blender/data.json'],hash(cache+'/blender/data.json'));
const earliest=fs.statSync(metaFile).mtimeMs-m.seconds*1000-2000;
const files=[],inspect=async f=>{assert.ok(fs.existsSync(f),'Missing '+f);const s=fs.statSync(f);assert.ok(s.mtimeMs>=earliest,'Old trial image '+f);const i=await sharp(f).metadata();assert.equal(i.width,1080,f);assert.equal(i.height,1920,f);files.push({file:f,sha256:hash(f),width:i.width,height:i.height});};
for(const k of ['m1','m2','bump','arm','meter','shishi','domino','proto','paper','pascal'])for(const view of ['oblique','top'])await inspect(cache+'/blender/catalog/c1v1_'+k+'_'+view+'.jpg');
for(const t of m.times)await inspect(cache+'/blender/preview/'+String(Math.round(t*30)).padStart(5,'0')+'.jpg');
for(const name of ['挑戦','答え'])await inspect(cache+'/problem/'+name+'.png');
const a=read(cache+'/blender/preview/anchors.json');assert.equal(a.frames,Math.ceil(d.duration*30));assert.equal(a.fps,30);
for(const t of m.times){const j=Math.round(t*30);for(const k of ['paper','price','score','crack',...Array.from({length:5},(_,i)=>'m1.digit.'+i),...Array.from({length:5},(_,i)=>'m2.digit.'+i)]){assert.ok(a.anchors[k]?.[j],'Missing anchor '+k+' '+t);assert.ok(a.anchors[k][j].every(Number.isFinite));}}
const out={pass:true,date:new Date().toISOString(),metadata:metaFile,sourceSha256:m.sourceSha256,times:m.times,cameraCoverage:covered,width:m.width,height:m.height,samples:m.samples,stateChecks:m.stateChecks,files};
fs.writeFileSync(cache+'/c1-gate-source-audit-r7.json',JSON.stringify(out,null,1));
console.log('C-1 frozen-source audit: PASS / 20 catalog + 39 previews + 2 problem images / 1080×1920 / 16 samples / cached visibility + arm contact');

