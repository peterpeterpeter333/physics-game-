// 1-2 第2版：書き直しの区間の外で JPEG のバイトだけ変わったコマ（写しの元を書き直した複製）を確かめ、
// 画素が第1版と全く同じなら、第1版のバイトに戻す。1画素でも違えば止める。
import {readFileSync,copyFileSync,writeFileSync} from 'node:fs';
import sharp from 'sharp';
const C='/private/tmp/ys/ys-chain-1-2v2/blender',V1='/private/tmp/ys/ys-chain-1-2v1-render/blender/desk';
const list=JSON.parse(readFileSync(C+'/retouch-outside-changed.json'));const bad=[];
for(const j of list){const f=String(j).padStart(5,'0')+'.jpg';
 const a=await sharp(V1+'/'+f).raw().toBuffer(),b=await sharp(C+'/desk/'+f).raw().toBuffer();
 if(!a.equals(b)){bad.push(j);continue;}copyFileSync(V1+'/'+f,C+'/desk/'+f);}
if(bad.length)throw Error('pixels differ outside the ranges: '+bad.slice(0,20));
writeFileSync(C+'/retouch-restore.json',JSON.stringify({restored_pixel_identical:list.length}));console.log('restored',list.length);
