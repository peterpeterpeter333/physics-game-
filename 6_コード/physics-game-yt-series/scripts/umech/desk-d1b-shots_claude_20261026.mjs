// D-1 後編の完成画（3D＋札＋字幕＋顔）を、指定の秒で書き出す（Claude 2026-10-26）。下見用。
// node --import ./scripts/umech/desk-d1b-hooks_claude_20261026.mjs scripts/umech/desk-d1b-shots_claude_20261026.mjs <out> <秒,秒,…>
//   EM_FILM_CACHE＝/private/tmp/ys/ys-chain-d1b。3D のコマが無い秒は DESK_ALLOW_MISSING=1 で近い下見のコマを使う。
import {readFileSync,mkdirSync} from 'node:fs';
import sharp from 'sharp';
import {vertFrame} from './frame-vert.mjs';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1b';
const clip=JSON.parse(readFileSync(cache+'/ys-chain-d1b.json'));
const [out,list]=process.argv.slice(2);mkdirSync(out,{recursive:true});
for(const x of list.split(',').map(Number)){
 const s=clip.scenes.find(s=>x>=s.start&&x<s.end)??clip.scenes.at(-1);
 const svg=vertFrame(clip,s,x);
 await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).jpeg({quality:88}).toFile(`${out}/${String(Math.round(x*30)).padStart(5,'0')}.jpg`);
}
console.log('shots',list.split(',').length);
