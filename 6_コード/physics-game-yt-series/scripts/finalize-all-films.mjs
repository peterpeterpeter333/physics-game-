import {readFileSync,existsSync,writeFileSync} from 'node:fs';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/physics-all-films';
const plan=JSON.parse(readFileSync(`${cache}/plan.json`));
const movies=plan.map(p=>{
 const base=`public/media/lessons/${p.id}`;
 for(const ext of ['json','mp4','jpg'])if(!existsSync(`${base}.${ext}`))throw Error(`Incomplete film: ${base}.${ext}`);
 const c=JSON.parse(readFileSync(`${base}.json`));
 if(c.scenes.map(s=>s.narration).join()!==p.scenes.map(s=>s.narration).join())throw Error(`Stale film ${p.id}`);
 return c;
});
writeFileSync('src/content/lesson-video-catalog.generated.json',JSON.stringify(movies));
console.log(`Finalized ${movies.length} films`);
