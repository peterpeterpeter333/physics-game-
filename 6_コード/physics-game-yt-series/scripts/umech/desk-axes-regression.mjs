// Read-only byte regression for every original 30fps SVG plus rendered cue samples.
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const [id,phase='before']=process.argv.slice(2);if(!['ys-chain-1-1v6','ys-chain-1-2v2'].includes(id))throw Error('reference only');
const cache='/private/tmp/ys/'+id;process.env.EM_FILM_CACHE=cache;
const out='/private/tmp/ys/axes-regression/'+id+'/'+phase;mkdirSync(out,{recursive:true});
const plan=JSON.parse(readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(readFileSync(cache+'/'+id+'.json'));
const clip={...plan,duration:timed.duration,scenes:plan.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))};
const {vertFrame}=await import('./frame-vert.mjs');
const hashes=[];let si=0;const samples=new Set(clip.scenes.flatMap(s=>s.captions.map(c=>Math.round((c.start+c.end)/2*30))));
for(let j=0;j<Math.ceil(clip.duration*30);j++){
 const t=j/30;while(si<clip.scenes.length-1&&t>=clip.scenes[si].end)si++;
 const svg=vertFrame(clip,clip.scenes[si],t);hashes.push(createHash('sha256').update(svg).digest('hex'));
 if(samples.has(j))await sharp(Buffer.from(svg)).png().toFile(out+'/'+String(j).padStart(5,'0')+'.png');
}
writeFileSync(out+'/every-frame-sha256.txt',hashes.join('\n'));console.log(JSON.stringify({id,phase,frames:hashes.length,pngs:samples.size,dir:out}));
