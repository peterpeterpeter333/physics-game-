import {readFileSync,writeFileSync,existsSync} from 'node:fs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/pilot-plan.json'));
const ready=plan.map(clip=>{
 const base=`public/media/${clip.mediaDirectory}/${clip.id}`;
 for(const ext of ['json','jpg','mp4'])if(!existsSync(`${base}.${ext}`))throw Error(`Missing ${base}.${ext}`);
 const media=JSON.parse(readFileSync(`${base}.json`));
 if(media.title!==clip.title||JSON.stringify(media.scenes.map(s=>[s.narration,s.utterances]))!==JSON.stringify(clip.scenes.map(s=>[s.narration,s.utterances])))throw Error(`Stale media: ${clip.id}`);
 return media;
});
writeFileSync('src/content/revised-video-catalog.generated.json',JSON.stringify(ready.filter(c=>!c.id.startsWith('ue-why-'))));
writeFileSync('src/content/insert-video-catalog.generated.json',JSON.stringify(ready.filter(c=>c.id.startsWith('ue-why-'))));
writeFileSync('src/content/insert-routes.generated.json',JSON.stringify({'ue-gauss-01':[{afterScene:0,inserts:['ue-why-08','ue-why-09','ue-why-10']}]}));
console.log('Registered 1 revised main and 3 rendered inserts. Other revisions remain pending.');
