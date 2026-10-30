import {readFileSync,existsSync,writeFileSync,renameSync} from 'node:fs';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/physics-prerequisite-films';
const plan=JSON.parse(readFileSync(`${cache}/plan.json`));
const all=plan.map(p=>{
 const base=`public/media/lessons/${p.id}`;
 for(const ext of ['mp4','json','jpg'])if(!existsSync(`${base}.${ext}`))throw Error(`Incomplete: ${base}.${ext}`);
 const clip=JSON.parse(readFileSync(`${base}.json`));
 if(JSON.stringify(clip.before)!==JSON.stringify(p.before)||JSON.stringify(clip.scenes.map(s=>[s.narration,s.equation,s.diagram]))!==JSON.stringify(p.scenes.map(s=>[s.narration,s.equation,s.diagram])))throw Error(`Stale: ${p.id}`);
 return clip;
});
const target='src/content/prerequisite-video-catalog.generated.json';
writeFileSync(`${target}.tmp`,JSON.stringify(all));renameSync(`${target}.tmp`,target);
console.log(`Published ${all.length} local prerequisite films; original catalogs unchanged`);
