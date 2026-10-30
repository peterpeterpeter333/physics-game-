// 1-2 第2版：指定した時刻のコマ（3D＋2D＋字幕）を PNG にする（書き出し前の確認用）。
// 使い方：EM_FILM_CACHE=/private/tmp/ys/ys-chain-1-2v2 node scripts/umech/desk-1-2v2-preview.mjs <出力フォルダ> 17 30.5 …
import {readFileSync,mkdirSync} from 'node:fs';
import sharp from 'sharp';
import {deskFrame} from './desk-frame.mjs';
const C=process.env.EM_FILM_CACHE,[out,...ts]=process.argv.slice(2);mkdirSync(out,{recursive:true});
const entry=JSON.parse(readFileSync(C+'/plan.json'))[0],a=JSON.parse(readFileSync(C+'/'+entry.id+'.json'));
const clip={...a,...entry,duration:a.duration,scenes:entry.scenes.map((s,j)=>({...s,start:a.scenes[j].start,end:a.scenes[j].end,captions:a.scenes[j].captions}))};
for(const x of ts){const t=+x,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1);
 await sharp(Buffer.from(deskFrame(clip,s,t))).png().toFile(`${out}/${x}.png`);}
console.log('ok',ts.length);
