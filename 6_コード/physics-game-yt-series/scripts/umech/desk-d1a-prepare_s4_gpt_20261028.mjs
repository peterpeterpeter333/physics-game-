// Fresh native S4 workspace only. No original/source/old-cache writes.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const W=path.resolve(new URL('../..',import.meta.url).pathname);
const BASE=path.join(W,'outputs/ys-chain-d1a-backup/S3_20261028/magnifier/cache');
const C='/private/tmp/ys/ys-chain-d1a_s4_gpt_20261028';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.ok(!fs.existsSync(C),'Preserve an existing S4 cache');
const files=['plan.json','ys-chain-d1a.json','phrase-times.json','timed-selection.json','prosody.txt','ys-chain-d1a.wav','ys-chain-d1a.voice.wav','word-events-actual_s3_20261028.json','blender/data.json'];
fs.mkdirSync(C,{recursive:true});const hashes={};
for(const rel of files){const a=path.join(BASE,rel),b=path.join(C,rel);assert.equal(fs.realpathSync(a),a);fs.mkdirSync(path.dirname(b),{recursive:true});fs.copyFileSync(a,b,fs.constants.COPYFILE_EXCL);assert.equal(hash(a),hash(b));hashes[rel]=hash(b);}
const source=path.join(BASE,'blender/tex'),target=path.join(C,'blender/tex');
if(fs.existsSync(source))fs.cpSync(source,target,{recursive:true,errorOnExist:true,force:false,dereference:false});
for(const rel of ['blender/desk','blender/preview','macro','qa','out'])fs.mkdirSync(path.join(C,rel),{recursive:true});
fs.writeFileSync(path.join(C,'s4-preparation.json'),JSON.stringify({stage:'S4',base:BASE,cache:C,inputs:hashes,resolution:[1080,1920],samples:16,productionStarted:false,voiceChanged:false,scriptChanged:false},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({cache:C,inputs:files.length,rawCopied:false,upscaledFrames:false}));
