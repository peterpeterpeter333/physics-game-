// Immutable input and registry regression audit; never edits a supplied source.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url).pathname;
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const out=root+'outputs/axes-20261023';fs.mkdirSync(out,{recursive:true});
const evidence={created:new Date().toISOString(),episodes:[],regression:[]};
for(const ep of ['b1','c1','d1','e1']){
 const id='ys-chain-'+ep+'v1',cache='/private/tmp/ys/'+id,backup=root+'scripts/blender/desk_assets/'+ep+'v1';
 const preserved=['plan.json',id+'.json','phrase-times.json',id+'.wav'];
 const files=preserved.map(name=>({name,cache:cache+'/'+name,backup:backup+'/'+name,sha256:sha(cache+'/'+name),backupSha256:sha(backup+'/'+name)}));
 for(const f of files)assert.equal(f.sha256,f.backupSha256,id+' '+f.name+' changed');
 const timed=JSON.parse(fs.readFileSync(cache+'/'+id+'.json'));
 evidence.episodes.push({episode:ep,id,seconds:timed.duration,cues:timed.scenes.reduce((n,s)=>n+s.cues.length,0),files,script:{path:root+'docs/video-revision-20260924/ytseries/chain-'+ep[0]+'-1.mjs',sha256:sha(root+'docs/video-revision-20260924/ytseries/chain-'+ep[0]+'-1.mjs')}});
}
for(const id of ['ys-chain-1-1v6','ys-chain-1-2v2']){
 const dir='/private/tmp/ys/axes-regression/'+id;
 assert.equal(sha(dir+'/before/every-frame-sha256.txt'),sha(dir+'/after/every-frame-sha256.txt'));
 const names=fs.readdirSync(dir+'/before').filter(n=>n.endsWith('.png'));
 for(const n of names)assert.equal(sha(dir+'/before/'+n),sha(dir+'/after/'+n),id+' '+n+' differs');
 const frames=fs.readFileSync(dir+'/before/every-frame-sha256.txt','utf8').trim().split('\n').length;
 const matching=dir+'/mp4-after-matching-encoder/cmp-report.json';
 const mp4Report=fs.existsSync(matching)?matching:dir+'/mp4-after/cmp-report.json';let mp4=null;
 if(fs.existsSync(mp4Report)){
  mp4=JSON.parse(fs.readFileSync(mp4Report));assert(mp4.cmpOriginal);assert.equal(sha(mp4.original),sha(mp4.video));
 }
 evidence.regression.push({id,frames,renderedPng:names.length,allSvgFrameHashesIdentical:true,allPngByteIdentical:true,mp4ByteComparison:!!mp4,mp4Report:mp4?mp4Report:null,note:mp4?'再書き出ししたMP4も元とバイト単位で一致。':'SVG全コマ/PNG一致。MP4再書き出し比較は進行中。'});
}
fs.writeFileSync(out+'/immutable-inputs-and-regression.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
