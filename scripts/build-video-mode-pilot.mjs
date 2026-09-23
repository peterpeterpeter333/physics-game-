import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const ledger=JSON.parse(readFileSync('docs/video-revision-20260924/import-ledger.generated.json'));
const document=ledger.documents.find(d=>d.file.startsWith('差し替え台本_08_'));
const old=JSON.parse(readFileSync('src/content/em-video-catalog.generated.json'));
const clip=structuredClone(old.find(c=>c.id==='ue-gauss-01'));
const titleRow=document.sections.flatMap(s=>s.directions).find(d=>d.startsWith('| ue-gauss-01 |'));
clip.title=titleRow.split('|')[2].trim();
const sentences=text=>text.split('。').filter(Boolean).map(s=>s+'。');
function utterances(pairs){return pairs.flatMap(p=>{
 const captions=sentences(p.subtitle),readings=sentences(p.reading);
 if(captions.length!==readings.length)throw Error(`Unapproved alignment at ${document.file}:${p.line}`);
 return captions.map((subtitle,i)=>({subtitle,reading:readings[i],sourceLine:p.line}));
});}
clip.mediaDirectory='revisions';clip.revision='20260924-pilot';
for(let i=0;i<clip.scenes.length;i++){
 const section=document.sections.find(s=>s.headings.some(h=>h==='ue-gauss-01')&&s.headings.at(-1).startsWith(`場面${i+1} `)&&s.pairs.length);
 const scene=clip.scenes[i];
 if(section){scene.utterances=utterances(section.pairs);scene.narration=scene.utterances.map(p=>p.subtitle).join('');}
 scene.sceneId=`${clip.id}-s${i+1}`;scene.mode='common';
 // Only the offset variable is changed. Differential d remains d.
 scene.equations=scene.equations.map(eq=>eq.replace(/\bd(?=[+^])/g,'a').replaceAll('Rd','Ra').replaceAll('+d\\cos','+a\\cos'));
}
const ids=['ue-why-08','ue-why-09','ue-why-10'];
const inserts=ids.map(id=>{
 const section=document.sections.find(s=>s.headings.at(-1).startsWith(`【差し込み】${id} `));
 const title=section.headings.at(-1).replace(`【差し込み】${id} `,'').replace(/\([^)]*\)$/,'');
 const pairs=utterances(section.pairs),equations=section.directions.flatMap(d=>d.startsWith('式:')?[...d.matchAll(/`([^`]+)`/g)].map(m=>m[1]):[]);
 return {id,stageId:'ue-gauss',stageTitle:clip.stageTitle,level:'advanced',title,mediaDirectory:'inserts',revision:'20260924-pilot',scenes:[{index:0,sceneId:id,mode:'thorough',heading:title,narration:pairs.map(p=>p.subtitle).join(''),utterances:pairs,equations,screen:section.directions.filter(d=>d.startsWith('画面:')).join('\n')}]};
});
const dir='/private/tmp/physics-video-mode-pilot';mkdirSync(dir,{recursive:true});
writeFileSync(`${dir}/plan.json`,JSON.stringify([clip,...inserts],null,2));
writeFileSync('docs/video-revision-20260924/pilot-plan.json',JSON.stringify([clip,...inserts],null,2));
console.log('Pilot: 1 revised main + 3 supplements. Original production media is preserved until review.');
