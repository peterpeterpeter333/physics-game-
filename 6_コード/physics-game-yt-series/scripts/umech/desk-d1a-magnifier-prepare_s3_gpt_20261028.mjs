// Real-copy C4 inputs and Blender-only assets/raw into a FRESH C5. No execution on import.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const BASE='/private/tmp/ys/ys-chain-d1a_s3_framing_gpt_20261028';
const CACHE='/private/tmp/ys/ys-chain-d1a_s3_magnifier_gpt_20261028';
const KEY='f19573c5b0db3fdeb437',NF=11618;
const INPUTS=['plan.json','ys-chain-d1a.json','phrase-times.json','timed-selection.json','prosody.txt',
 'ys-chain-d1a.wav','ys-chain-d1a.voice.wav','ys-chain-d1a.s3c.mixed.wav',
 'ys-chain-d1a.s3c.bgm.wav','ys-chain-d1a.s3c.mix.json','ys-chain-d1a.s3c.levels.json',
 'ys-chain-d1a.s3c.voice-bgm.json','word-events-actual_s3_20261028.json','blender/data.json','shot-plan.json'];
const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
function real(f){assert.equal(fs.realpathSync(f),f);assert.equal(fs.lstatSync(f).isSymbolicLink(),false);return f;}
function copyFile(src,dst){real(src);assert.equal(fs.existsSync(dst),false);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(src,dst,fs.constants.COPYFILE_EXCL);assert.equal(fs.statSync(src).size,fs.statSync(dst).size);}
function copyTree(src,dst){real(src);assert.ok(fs.statSync(src).isDirectory());fs.mkdirSync(dst,{recursive:true});for(const item of fs.readdirSync(src,{withFileTypes:true})){assert.equal(item.isSymbolicLink(),false);const a=path.join(src,item.name),b=path.join(dst,item.name);if(item.isDirectory())copyTree(a,b);else{assert.ok(item.isFile());copyFile(a,b);}}}
export function prepare(){
 real(BASE);assert.equal(fs.existsSync(CACHE),false,'Preserve any existing C5; inspect it rather than overwriting');
 const meta=JSON.parse(fs.readFileSync(real(BASE+'/blender/desk/meta.json'),'utf8'));
 assert.equal(meta.key,KEY);assert.equal(meta.frames,NF);assert.equal(meta.stage,'S3');assert.equal(meta.fps,30);assert.ok(typeof meta.finished==='string'&&!meta.previewOnly&&!meta.sampleOnly);
 const raw=fs.readdirSync(real(BASE+'/blender/desk')).filter(n=>/^\d{5}\.jpg$/.test(n)).sort();assert.equal(raw.length,NF);for(let j=0;j<NF;j++)assert.equal(raw[j],String(j).padStart(5,'0')+'.jpg');
 // Freeze the 15 supplied input digests before copying; no per-frame hash table.
 const hashes=Object.fromEntries(INPUTS.map(r=>[r,hash(real(BASE+'/'+r))]));
 fs.mkdirSync(CACHE);copyTree(BASE+'/blender',CACHE+'/blender');
 for(const rel of INPUTS){const dst=CACHE+'/'+rel;if(!fs.existsSync(dst))copyFile(BASE+'/'+rel,dst);assert.equal(hash(real(dst)),hashes[rel]);assert.equal(hash(BASE+'/'+rel),hashes[rel]);}
 const copied=fs.readdirSync(CACHE+'/blender/desk').filter(n=>/^\d{5}\.jpg$/.test(n));assert.equal(copied.length,NF);
 const receipt={stage:'S3',base:BASE,cache:CACHE,rawSourceKey:KEY,rawFrames:NF,
  inputHashes:hashes,blenderTreeRealCopied:true,symlinks:false,mainRawChanged:false,
  excluded:['draft','quality','review','S3-review','macro outputs'],wholeMoviePass:false};
 fs.writeFileSync(CACHE+'/magnifier-prepare.json',JSON.stringify(receipt,null,1)+'\n',{flag:'wx'});
 console.log(JSON.stringify({cache:CACHE,rawFrames:NF,receipt:CACHE+'/magnifier-prepare.json'}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===new URL(import.meta.url).pathname)prepare();
