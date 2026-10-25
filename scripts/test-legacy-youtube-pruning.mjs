import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

// The production pruner runs only against this disposable fixture, never the
// app's real dist or public directories. Video IDs below are test data only.
const productionSource=await readFile(new URL('./prune-youtube-media.mjs',import.meta.url),'utf8');
const workspace=await mkdtemp(join(tmpdir(),'physics-quest-youtube-pruning-'));
const existing={'em/existing':'aaaaaaaaaaa'};
const additions={
 'prerequisites/prep-test':'bbbbbbbbbbb',
 'paper-battles/paper-test-question':'ccccccccccc',
 'em-line-integral-nemo':'ddddddddddd',
};
async function fixture(name,legacy,{videos=existing}={}){
 const root=join(workspace,name);
 for(const directory of ['scripts','src/content','docs','dist/media','public/media'])await mkdir(join(root,directory),{recursive:true});
 await writeFile(join(root,'scripts/prune-youtube-media.mjs'),productionSource);
 const inputs={
  'src/content/video-delivery.json':{schema:1,b2BaseUrl:'',videos},
  'src/content/legacy-youtube.generated.json':legacy,
  'src/content/b2-series.generated.json':[],
  'src/content/em-video-catalog.generated.json':[],
  'src/content/lesson-video-catalog.generated.json':[],
  'src/content/revised-video-catalog.generated.json':[],
  'docs/b2-legacy-upload-manifest.json':[],
 };
 for(const [path,value] of Object.entries(inputs))await writeFile(join(root,path),JSON.stringify(value));
 const assets=[...Object.keys({...existing,...additions}).flatMap(key=>[`${key}.mp4`,`${key}.jpg`,`${key}.json`]),'unmapped.mp4','unmapped.jpg','other.svg'];
 for(const prefix of ['dist/media','public/media'])for(const asset of assets){
  const path=join(root,prefix,asset);await mkdir(join(path,'..'),{recursive:true});await writeFile(path,`fixture:${asset}`);
 }
 return {root,assets};
}
const run=root=>spawnSync(process.execPath,[join(root,'scripts/prune-youtube-media.mjs')],{cwd:root,encoding:'utf8'});
async function files(root,prefix){return (await readdir(join(root,prefix),{recursive:true,withFileTypes:true})).filter(entry=>entry.isFile()).map(entry=>join(entry.parentPath??entry.path,entry.name).slice(join(root,prefix).length+1)).sort();}
try{
 const valid=await fixture('valid',additions),before=await files(valid.root,'public/media');
 const success=run(valid.root);assert.equal(success.status,0,success.stderr);
 assert.match(success.stdout,/8ファイル/);
 assert.deepEqual(await files(valid.root,'public/media'),before,'Original source media must not be pruned');
 for(const asset of valid.assets){
  const mapped=Object.hasOwn({...existing,...additions},asset.replace(/\.(mp4|jpg)$/,''));
  const expected=!(mapped&&/\.(mp4|jpg)$/.test(asset));
  assert.equal((await files(valid.root,'dist/media')).includes(asset),expected,asset);
 }
 const badInputs=[
  ['numeric-id',{'em/numeric':12345678901},'Invalid video mapping'],
  ['invalid-id',{'em/bad':'bad'},'Invalid video mapping'],
  ['unsafe-path',{'../escape':'eeeeeeeeeee'},'Invalid video mapping'],
  ['array-map',[],'Invalid legacy YouTube manifest'],
  ['conflicting-map',{'em/existing':'fffffffffff'},'Conflicting video mapping'],
 ];
 for(const [name,mapping,message] of badInputs){
  const current=await fixture(name,mapping),beforeDist=await files(current.root,'dist/media');
  const result=run(current.root);assert.notEqual(result.status,0,name);assert.ok(result.stderr.includes(message),result.stderr);
  assert.deepEqual(await files(current.root,'dist/media'),beforeDist,`${name}: Invalid manifests must fail before deleting any asset`);
 }
 console.log('PASS: verified legacy mappings prune only matching dist MP4/JPG; source videos, metadata and unrelated assets stay; five invalid/conflicting manifests fail before deletion.');
}finally{await rm(workspace,{recursive:true,force:true});}
