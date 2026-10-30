// E-1 future-problem stills only. The answer is never inserted into the film.
import fs from 'node:fs';
import sharp from 'sharp';
import {paper,pill} from './desk-overlay-lib.mjs';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-e1v1',dir=cache+'/problem';
for(const name of ['挑戦','答え']){
 const raw=(process.env.E1_PROBLEM_RAW??dir+'/raw-e1v1')+'/'+name+'.png';
 if(!fs.existsSync(raw))throw Error('Missing final-quality 3D problem still: '+raw);
 const label=paper([['船の 昼の 12時','#3b2412']],540,350,{size:42,anchor:'middle'})
  +paper([['ロンドン 10時','#3b2412']],540,770,{size:42,anchor:'middle'})
  +paper([[name==='答え'?'2時間 早い → 東へ 30度':'東？ 西？ 何度？',name==='答え'?'#9a6500':'#3b2412']],540,1460,{size:44,anchor:'middle'})
  +pill('E 時間と位置 1',40,150,{size:36});
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">${label}</svg>`;
 fs.writeFileSync(dir+'/problem-label-'+(name==='答え'?'answer':'challenge')+'-e1v1.svg',svg);
 await sharp(raw).composite([{input:Buffer.from(svg)}]).png().toFile(dir+'/'+name+'.png');
}
console.log(JSON.stringify({size:[1080,1920],challenge:dir+'/挑戦.png',answer:dir+'/答え.png'}));
