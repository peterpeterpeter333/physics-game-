// Storyboard sheets: every cue at three moments (early, middle, late), one PNG per film.
// Usage: EM_FILM_CACHE=/private/tmp/X node scripts/umech/storyboard.mjs outDir [ids]
import {readFileSync,mkdirSync,existsSync} from 'node:fs';
import sharp from 'sharp';
import {umechFrame} from './frame.mjs';
const cache=process.env.EM_FILM_CACHE,[out,...ids]=process.argv.slice(2);mkdirSync(out,{recursive:true});
const plan=JSON.parse(readFileSync(`${cache}/plan.json`));
for(const entry of plan){
 if(ids.length&&!ids.includes(entry.id))continue;
 // Real timing if audio exists, else 5 s per sentence.
 let clip;const timed=`${cache}/${entry.id}.json`;
 if(existsSync(timed)){const a=JSON.parse(readFileSync(timed));clip={...entry,duration:a.duration,scenes:entry.scenes.map((s,j)=>({...s,start:a.scenes[j].start,end:a.scenes[j].end,captions:a.scenes[j].captions}))};}
 else{let t=0;clip={...entry,scenes:entry.scenes.map(s=>{const captions=s.utterances.map(u=>{const c={text:u.subtitle,start:t,end:t+5};t+=5;return c;});return {...s,start:captions[0].start,end:t,captions};})};clip.duration=t;}
 const tiles=[];
 for(const s of clip.scenes)for(const cap of s.captions)for(const u of [.12,.5,.92]){const svg=umechFrame(clip,s,cap.start+(cap.end-cap.start)*u);tiles.push(await sharp(Buffer.from(svg)).resize(640,380).png().toBuffer());}
 const cols=3,rows=Math.ceil(tiles.length/cols);
 await sharp({create:{width:640*cols,height:380*rows,channels:3,background:'#000'}}).composite(tiles.map((b,i)=>({input:b,left:(i%cols)*640,top:Math.floor(i/cols)*380}))).jpeg({quality:80}).toFile(`${out}/${entry.id}.jpg`);
 console.log(`${entry.id}: ${tiles.length} frames`);
}
