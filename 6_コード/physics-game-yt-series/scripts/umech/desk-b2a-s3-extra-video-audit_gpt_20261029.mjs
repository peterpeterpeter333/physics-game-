// Additional read-only actual-MP4 audit: field packet direction and dry-paper transition.
// Never reads Blender frames/anchors, never changes the MP4 or previous audits.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
import {normKana} from './yt1-chain-00bx-common.mjs';
const W=path.resolve(import.meta.dirname,'../..'),C='/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029';
const O=path.join(W,'outputs/ys-chain-b2a-backup/S3_20261029/実MP4追加確認');
const M=path.join(C,'draft/ys-chain-b2a_gpt_20261029_s3_draft.mp4');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const D=read(path.join(C,'blender/b2a-scene-data.json')),P=read(path.join(C,'phrase-times.json'));
const E=read(M.replace(/\.mp4$/,'.export.json')),h=sha(M);assert.equal(h,E.videoSha256);assert.equal(E.allFrameDecode,true);
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function word(row,w){
 for(const q of D.cues.filter(q=>q.row===row)){
  const p=P[q.subtitle],re=new RegExp(esc(normKana(w)).replace(/[ウオ]/g,'[ウオ]'),'g'),m=re.exec(p.s);
  if(m)return {row,word:w,cue:q.key,start:q.start+p.t[m.index],end:q.start+(p.t[m.index+m[0].length]??p.end)};
 }
 throw Error('Word missing '+w);
}
const triggers=['エヌキョクカラデテ','エスキョクエハイリマス','ミナミカラデテ','キタエハイリマス'].map(w=>word(5,w));
triggers.push(word(42,'カワイタアツガミオハサム'));
const r5=D.rows.find(r=>r.row===5),field=[];
for(let j=Math.ceil(r5.start*30);j<r5.end*30;j+=3)field.push(j);
for(const w of triggers.filter(w=>w.row===5))for(const t of [w.start,w.end])for(let n=-2;n<=2;n++)field.push(Math.round(t*30)+n);
const dry=[];for(let j=14205;j<=14265;j++)dry.push(j);
const groups=[{id:'21-field-packets',indices:[...new Set(field)].filter(j=>j/30>=r5.start&&j/30<r5.end).sort((a,b)=>a-b)},{id:'22-dry-transition',indices:dry}];
const indices=[...new Set(groups.flatMap(g=>g.indices))].sort((a,b)=>a-b);
assert.ok(!fs.existsSync(O),'Preserve old audits');fs.mkdirSync(O,{recursive:true});const native=path.join(O,'decoded-actual-png');fs.mkdirSync(native);
const ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const select=indices.map(j=>`eq(n\\,${j})`).join('+');
const r=spawnSync(ff,['-n','-hide_banner','-loglevel','info','-i',M,'-an','-vf',`select=${select},showinfo`,'-fps_mode','passthrough','-start_number','0',path.join(native,'seq-%05d.png')],{encoding:'utf8',maxBuffer:32*1024*1024});
fs.writeFileSync(path.join(O,'decode.log'),r.stderr,{flag:'wx'});assert.equal(r.status,0);
const tb=/config in time_base:\s*(\d+)\/(\d+)/.exec(r.stderr),times=[...r.stderr.matchAll(/\bn:\s*(\d+)\s+pts:\s*(-?\d+)/g)];assert.equal(times.length,indices.length);
for(let i=0;i<indices.length;i++){assert.equal(+times[i][2]*(+tb[1])*30,indices[i]*(+tb[2]));fs.renameSync(path.join(native,`seq-${String(i).padStart(5,'0')}.png`),path.join(native,`${String(indices[i]).padStart(5,'0')}.png`));}
for(const g of groups){
 const dir=path.join(O,g.id);fs.mkdirSync(dir);g.pages=[];
 for(let from=0;from<g.indices.length;from+=15){
  const list=g.indices.slice(from,from+15),layers=[],width=1152,height=1343;
  layers.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1152" height="38"><rect width="100%" height="100%" fill="#17202e"/><text x="12" y="26" font-family="Arial" font-size="18" fill="white">${g.id} | actual MP4 | ${from+1}-${from+list.length}</text></svg>`),left:0,top:0});
  for(let k=0;k<list.length;k++){
   const j=list[k],x=12+(k%5)*228,y=50+Math.floor(k/5)*431;
   layers.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="216" height="35"><rect width="100%" height="100%" fill="#f8f6f0"/><text x="7" y="24" font-family="Arial" font-size="17">${(j/30).toFixed(3)} s | #${j}</text></svg>`),left:x,top:y},{input:await sharp(path.join(native,`${String(j).padStart(5,'0')}.png`)).resize(216,384).png().toBuffer(),left:x,top:y+35});
  }
  const f=path.join(dir,`page-${String(g.pages.length+1).padStart(3,'0')}.jpg`);await sharp({create:{width,height,channels:3,background:'#ded8ce'}}).composite(layers).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toFile(f);g.pages.push({image:f,frames:list,viewed:false});
 }
}
assert.equal(sha(M),h);fs.writeFileSync(path.join(O,'actual-video-extra-manifest.json'),JSON.stringify({source:M,sha256:h,fromActualEncodedVideo:true,sourceRawOrAnchorsRead:false,exactGlobalPTSValidated:true,triggers,uniqueDecodedFrames:indices.length,groups,allVisualsReviewed:false,audioEarReviewPerformed:false},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output:O,uniqueDecodedFrames:indices.length,groups:groups.map(g=>({id:g.id,frames:g.indices.length,pages:g.pages.length})),triggers},null,2));
