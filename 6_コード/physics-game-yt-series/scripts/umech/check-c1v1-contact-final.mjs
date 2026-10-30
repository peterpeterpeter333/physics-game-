// Exact evidence for C1 r10. This does not substitute for any original gate.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const cache='/private/tmp/ys/ys-chain-c1v1',file=cache+'/blender/trial-r10/meta.json',m=JSON.parse(fs.readFileSync(file));
const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
assert.equal(m.revision,'r10');assert.equal(m.stateChecks,318);assert.equal(m.width,1080);assert.equal(m.height,1920);assert.equal(m.samples,16);
assert.equal(m.contacts.length,11);
for(const x of m.contacts){assert.equal(x.phaseDegrees,-36);assert.ok(x.neighborToothVerticesInsidePeg.length>0);assert.ok(x.ownToothVerticesInsideCarrier.length>0);}
for(const [f,h] of Object.entries(m.sourceSha256))assert.equal(hash(f),h,f+' changed after real trial');
const bounds=JSON.parse(fs.readFileSync(cache+'/c1-physical-subject-bounds-final.json'));
assert.equal(bounds.frames.length,53);assert.ok(bounds.frames.every(x=>x.within40to70&&!x.clipped));assert.deepEqual(bounds.sources,m.sourceSha256);
const files=[],inspect=async f=>{const i=await sharp(f).metadata();assert.equal(i.width,1080);assert.equal(i.height,1920);files.push({file:f,sha256:hash(f),width:i.width,height:i.height});};
for(const t of m.times)await inspect(cache+'/blender/trial-r10/'+String(Math.round(t*30)).padStart(5,'0')+'.jpg');
for(const part of ['m1','m2','bump','arm','meter','shishi','domino','proto','paper','pascal'])for(const view of ['oblique','top'])await inspect(cache+'/blender/catalog-r10/c1v1_'+part+'_'+view+'.jpg');
for(const name of ['挑戦','答え'])await inspect(cache+'/problem/'+name+'.png');
const out={pass:true,notOriginalGate:true,date:new Date().toISOString(),metadata:file,sourceSha256:m.sourceSha256,actualTrialTimes:m.times,states:318,realRigidContacts:11,physicalSubjectBounds:{cues:53,outside40to70:0,clipped:0,notGate7b:true},files};
fs.writeFileSync(cache+'/c1-r10-contact-source-audit.json',JSON.stringify(out,null,1));console.log('PASS / exact r10 sources / 318 cue states / 11 rigid contacts / 53 physical subject widths / 3 actual contact + 20 catalog + 2 problem images');
