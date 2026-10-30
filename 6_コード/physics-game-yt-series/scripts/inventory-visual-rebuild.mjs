// Inventory does not certify educational quality. Pending, rendered and reviewed
// are intentionally different states, with no blanket 'done' based on styling.
import {readFileSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
const read=f=>JSON.parse(readFileSync(f)),root='docs/video-revision-20260924';
const original=['lesson','em','prerequisite'].flatMap(kind=>read(`src/content/${kind}-video-catalog.generated.json`).map(c=>({...c,inventoryKind:kind})));
const revisions=new Map(read('src/content/revised-video-catalog.generated.json').map(c=>[c.id,c]));
const inserts=read('src/content/insert-video-catalog.generated.json');
const active=[...original.map(c=>({...c,...revisions.get(c.id)})),...inserts];
const plans=read(`${root}/full-plan.generated.json`),ids=new Set(active.map(c=>c.id));
const items=[...active.map(c=>({c,active:true})),...plans.filter(c=>!ids.has(c.id)).map(c=>({c,active:false}))].map(({c,active})=>{
 const media=`public/media/${c.mediaDirectory??'em'}/${c.id}.mp4`;
 return {id:c.id,title:c.title,stageId:c.stageId,level:c.level,family:c.family,active,media:existsSync(media)?media:null,storyboard:c.visualPilot??null,status:active&&c.visualPilot?'registered-authored-render':'pending-individual-rebuild',review:'Requires individual content/encoded-video QA; automated inventory is not certification'};
});
const counts={activeTeachingFilms:active.length,pendingNotYetActive:items.filter(c=>!c.active).length,registeredAuthoredRenders:items.filter(c=>c.status==='registered-authored-render').length,totalTracked:items.length};
const paper=readdirSync('public/media/paper-battles').filter(f=>f.endsWith('.json')).sort().map(f=>{const c=read(`public/media/paper-battles/${f}`);return{id:c.id,title:c.title,kind:c.kind,problemId:c.problemId,active:true,media:`public/media/paper-battles/${c.id}.mp4`,status:'pending-individual-rebuild'};});
const legacy=[{id:'em-line-integral-nemo',media:'public/media/em-line-integral-nemo.mp4',consumer:'src/components/EMVideoPilot.tsx',status:'pending-usage-and-content-audit'}];
Object.assign(counts,{paperBattleFilms:paper.length,legacyFilms:legacy.length,totalTracked:items.length+paper.length+legacy.length});
writeFileSync(`${root}/visual-rebuild-inventory.generated.json`,JSON.stringify({counts,scopeNote:'Active teaching films, unimplemented manuscript additions, paper battles, and legacy video are tracked separately. Registration alone is not educational quality certification.',items,paper,legacy},null,2));
console.log(counts);
