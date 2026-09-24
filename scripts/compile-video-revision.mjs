/** Compile reviewed manuscripts without modifying their originals. No media is published here. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {applyCircularPilot} from '../docs/video-revision-20260924/circular-pilot.mjs';
import {applyMotionFoundations} from '../docs/video-revision-20260924/motion-foundations.mjs';
import {applyMotionInserts} from '../docs/video-revision-20260924/motion-inserts.mjs';
import {applyUniformAcceleration} from '../docs/video-revision-20260924/uniform-acceleration.mjs';
import {applyUniformContinuation} from '../docs/video-revision-20260924/uniform-continuation.mjs';
import {applyFreefall} from '../docs/video-revision-20260924/freefall-storyboards.mjs';
import {applyProjectileFoundations} from '../docs/video-revision-20260924/projectile-foundations.mjs';
import {applyProjectileMiddle} from '../docs/video-revision-20260924/projectile-middle.mjs';
import {applyAdditionTheorem,applyAdditionPrerequisiteRoutes} from '../docs/video-revision-20260924/addition-theorem.mjs';
import {applyProjectileAdvanced} from '../docs/video-revision-20260924/projectile-advanced.mjs';
import {applyForceStoryboards} from '../docs/video-revision-20260924/force-storyboards.mjs';
import {applyWorkFoundations} from '../docs/video-revision-20260924/work-foundations.mjs';
import {applyWorkComponents} from '../docs/video-revision-20260924/work-components.mjs';
import {applyPotentialEnergy} from '../docs/video-revision-20260924/potential-energy.mjs';
import {applySpringEnergy} from '../docs/video-revision-20260924/spring-energy.mjs';
import {applyMomentumFoundations} from '../docs/video-revision-20260924/momentum-foundations.mjs';
import {applyMomentumMiddle} from '../docs/video-revision-20260924/momentum-middle.mjs';
import {applyMomentumAdvanced} from '../docs/video-revision-20260924/momentum-advanced.mjs';
import {applyRadianFoundations} from '../docs/video-revision-20260924/radian-foundations.mjs';
import {applyCircularFoundations} from '../docs/video-revision-20260924/circular-foundations.mjs';
import {applyShmFoundations} from '../docs/video-revision-20260924/shm-foundations.mjs';
import {applyShmMiddle} from '../docs/video-revision-20260924/shm-middle.mjs';
import {applySineDerivative} from '../docs/video-revision-20260924/sine-derivative.mjs';
import {applyFoundationAppendices} from '../docs/video-revision-20260924/foundation-appendices.mjs';
import {applyCurrentFoundations} from '../docs/video-revision-20260924/current-foundations.mjs';
import {applySingleSlit} from '../docs/video-revision-20260924/single-slit.mjs';
import {applyDoubleSlit} from '../docs/video-revision-20260924/double-slit.mjs';
import {applyLightInterference} from '../docs/video-revision-20260924/light-interference.mjs';
import {applyTotalReflection} from '../docs/video-revision-20260924/total-reflection.mjs';
import {applyLightRefraction} from '../docs/video-revision-20260924/light-refraction.mjs';
import {applyLightFoundations} from '../docs/video-revision-20260924/light-foundations.mjs';
import {applyDopplerObserver} from '../docs/video-revision-20260924/doppler-observer.mjs';
import {applyDopplerSource} from '../docs/video-revision-20260924/doppler-source.mjs';
import {applySoundBeats} from '../docs/video-revision-20260924/sound-beats.mjs';
import {applySoundBoundaries} from '../docs/video-revision-20260924/sound-boundaries.mjs';
import {applySoundFoundations} from '../docs/video-revision-20260924/sound-foundations.mjs';
import {applyWaveSuperposition} from '../docs/video-revision-20260924/wave-superposition.mjs';
import {applyTravelingWave} from '../docs/video-revision-20260924/traveling-wave.mjs';
import {applyWaveSpeed} from '../docs/video-revision-20260924/wave-speed.mjs';
import {applyWaveFoundations} from '../docs/video-revision-20260924/wave-foundations.mjs';
import {applyHeatCycle} from '../docs/video-revision-20260924/heat-cycle.mjs';
import {applyFirstlawFoundations} from '../docs/video-revision-20260924/firstlaw-foundations.mjs';
import {applyGasWork} from '../docs/video-revision-20260924/gas-work.mjs';
import {applyIdealGasAdvanced} from '../docs/video-revision-20260924/ideal-gas-advanced.mjs';
import {applyGasParticles} from '../docs/video-revision-20260924/gas-particles.mjs';
import {applyMoleFoundations} from '../docs/video-revision-20260924/mole-foundations.mjs';
import {applyIdealGasFoundations} from '../docs/video-revision-20260924/ideal-gas-foundations.mjs';
import {applyGasStates} from '../docs/video-revision-20260924/gas-states.mjs';
import {applyGasTemperature} from '../docs/video-revision-20260924/gas-temperature.mjs';
import {applyGasFoundations} from '../docs/video-revision-20260924/gas-foundations.mjs';
import {applyHeatMelting} from '../docs/video-revision-20260924/heat-melting.mjs';
import {applyHeatFoundations} from '../docs/video-revision-20260924/heat-foundations.mjs';
import {applyShmAdvanced} from '../docs/video-revision-20260924/shm-advanced.mjs';
import {applySineMotion} from '../docs/video-revision-20260924/sine-motion.mjs';
const root='docs/video-revision-20260924';
const ledger=JSON.parse(readFileSync(`${root}/import-ledger.generated.json`));
const queue=JSON.parse(readFileSync(`${root}/revision-queue.generated.json`));
const catalog=['em','lesson','prerequisite'].flatMap(kind=>JSON.parse(readFileSync(`src/content/${kind}-video-catalog.generated.json`)).map(c=>({...c,renderer:kind==='em'?'em':'lesson'})));
const originals=new Map(catalog.map(c=>[c.id,c])),changed=new Map(),fresh=new Map(),issues=[],editorial=[];
const visualTasks=[];
const split=s=>s.split('。').filter(Boolean).map(x=>x+'。');
function pairs(rows,source){return rows.flatMap(row=>{
 let reading=row.reading,subtitle=row.subtitle;
 if(source.file.startsWith('差し替え台本_03_')&&row.line===173)reading='がめんの イプシロンと よむ きごうは、きでんりょくです。ディーファイ ディーティーと よむ ものは、いちびょう あたりの じそくの へんかです。';
 if(source.file.startsWith('差し替え台本_03_')&&row.line===362)reading='がめんの ニューと よむ きごうは、しんどうすうです。エイチは プランクていすう、ダブリューは ひきはがすのに いる さいしょうの エネルギーで、しごとかんすう と いいます。';
 if(subtitle.includes('前の差し込みの二つの微分')){subtitle=subtitle.replace('前の差し込みの二つの微分','二つのべき乗の微分');reading=reading.replace('まえの さしこみの ふたつの びぶん','ふたつの べきじょうの びぶん');}
 if(reading!==row.reading||subtitle!==row.subtitle)editorial.push({source,line:row.line,before:row,after:{subtitle,reading}});
 const a=split(subtitle),b=split(reading);if(a.length!==b.length)throw Error(`Reading alignment: ${source.file}:${row.line}`);
 return a.map((subtitle,i)=>({subtitle,reading:b[i],source:{...source,line:row.line}}));
});}
function edit(id){if(!changed.has(id)){if(!originals.has(id))throw Error(`Unknown video ${id}`);const c=structuredClone(originals.get(id));c.sourceMediaDirectory=c.mediaDirectory??'em';c.mediaDirectory='revisions';c.revision='20260924-full';changed.set(id,c);}return changed.get(id);}
function assign(scene,utterances){scene.utterances=utterances;scene.narration=utterances.map(p=>p.subtitle).join('');}
// Separate unrelated electric and circuit content before assigning prerequisites.
const coulomb=structuredClone(originals.get('prep-charge-calculation'));
Object.assign(coulomb,{id:'prep-coulomb-field',title:'クーロンの法則から電場を求める',renderer:'lesson',visualSourceId:'prep-charge-calculation',mediaDirectory:'revisions',revision:'20260924-full'});
coulomb.scenes=coulomb.scenes.slice(0,2);fresh.set(coulomb.id,coulomb);
for(const modification of queue.modifications){
 const clip=edit(modification.id),index=modification.scene-1;
 if(modification.operation==='append'){clip.scenes.push({index,heading:'数値で確かめる',visual:'',equation:'',symbols:[],narration:''});}
 const scene=clip.scenes[index];
 const utterances=pairs(modification.pairs,modification.source);
 if(modification.operation==='append-sentences'){
  const earlier=scene.utterances??split(scene.narration).map(subtitle=>({subtitle,reading:null}));assign(scene,[...earlier,...utterances]);
 }else assign(scene,utterances);
 scene.revisionDirections=[...(scene.revisionDirections??[]),modification.heading,...modification.directions];
 scene.revisionSource=modification.source;
 scene.revisionEquations=modification.directions.flatMap(d=>d.startsWith('式:')?[...d.matchAll(/`([^`]+)`/g)].map(m=>m[1]):[]);
}
// A manuscript may change only a title, diagram, unit, or condition. Such changes
// have no subtitle table and must not disappear from the production checklist.
for(const doc of ledger.documents)for(const section of doc.sections){
 const heading=section.headings.at(-1)??'';
 const title=heading.match(/^([a-z][a-z0-9-]+)\s+—\s+(.+)$/);
 if(title&&originals.has(title[1]))edit(title[1]).title=title[2];
 if(!/【映像修正】|【データ修正】/.test(heading))continue;
 const explicit=[...heading.matchAll(/\b[a-z][a-z0-9]*(?:-[a-z0-9]+)+\b/g)].map(m=>m[0]).filter(id=>originals.has(id));
 const inherited=section.headings.flatMap(h=>[...h.matchAll(/\b[a-z][a-z0-9]*(?:-[a-z0-9]+)+\b/g)].map(m=>m[0])).findLast(id=>originals.has(id));
 const ids=explicit.length?explicit:inherited?[inherited]:[];
 const sceneNumber=Number(heading.match(/場面(\d+)/)?.[1]);
 for(const id of ids){
  const clip=edit(id),task={id,scene:Number.isInteger(sceneNumber)?sceneNumber:null,source:{file:doc.file,line:section.line},directions:section.directions,status:'pending-visual-verification'};
  visualTasks.push(task);
  clip.visualRevisionTasks=[...(clip.visualRevisionTasks??[]),task];
 }
 if(!ids.length)issues.push({type:'unresolved-visual-target',file:doc.file,line:section.line,heading});
}
for(const unresolved of queue.unresolved){
 if(unresolved.context.includes('prep-coulomb-field 場面1'))assign(coulomb.scenes[0],pairs(unresolved.pairs,unresolved.source));
 else issues.push({type:'unresolved-content',...unresolved});
}
// Group multi-scene new prerequisites, then append addenda after the base text.
const additions=[...queue.newClips].sort((a,b)=>Number(a.source.file.includes('追補'))-Number(b.source.file.includes('追補')));
const definitions=new Map();
for(const item of additions){
 const lines=item.context.split('\n'),heading=lines.findLast(h=>h.includes(`】${item.id} `))??lines.findLast(h=>h.includes(item.id));
 const append=/に1行追加/.test(heading);
 if(!fresh.has(item.id)){
  const parent=[...lines].reverse().flatMap(h=>[...h.matchAll(/\b[a-z][a-z0-9]*(?:-[a-z0-9]+)+\b/g)].map(m=>m[0])).find(id=>originals.has(id));
  const model=originals.get(parent);
  fresh.set(item.id,{id:item.id,title:heading.slice(heading.indexOf(item.id)+item.id.length).trim().replace(/^—\s*/,''),stageId:model?.stageId??item.id,level:model?.level??'advanced',renderer:'insert',family:model?.family,mediaDirectory:item.kind==='insert'?'inserts':'revisions',revision:'20260924-full',scenes:[],kind:item.kind});
  definitions.set(item.id,{heading,context:item.context,source:item.source,parent});
 }
 const clip=fresh.get(item.id),utterances=pairs(item.pairs,item.source);
 const equations=item.directions.filter(d=>d.startsWith('式:')).flatMap(d=>[...d.matchAll(/`([^`]+)`/g)].map(m=>m[1]));
 if(append){assign(clip.scenes.at(-1),[...clip.scenes.at(-1).utterances,...utterances]);continue;}
 clip.scenes.push({index:clip.scenes.length,heading:clip.title,screen:item.directions.filter(d=>d.startsWith('画面:')).join('\n'),equations,revisionDirections:item.directions,revisionSource:item.source,utterances,narration:utterances.map(p=>p.subtitle).join('')});
}
const all=new Map([...originals,...changed,...fresh]);
const routes={},placements=new Map();
function locate(id,stack=[]){
 if(placements.has(id))return placements.get(id);
 if(stack.includes(id))throw Error(`Insert cycle ${[...stack,id]}`);
 const definition=definitions.get(id);if(!definition)return [];
 const {heading,context,parent}=definition;
 const chain=heading.match(/\(([a-z]+-(?:why|link)-\d+)\s*の後\)/);
 if(chain){const result=locate(chain[1],[...stack,id]).map(p=>({...p,afterInsert:chain[1]}));placements.set(id,result);return result;}
 const scene=heading.match(/場面(\d+)の後/),first=heading.match(/\(([a-z][a-z0-9-]+)\s*の最初\)/);
 let targets=parent?[parent]:[];
 if(id==='me-why-02')targets=['ui-charge-and-flux-preview-02'];
 if(first)targets=[first[1]];
 if(/3段階すべて|全動画/.test(heading)){
  const unit=context.split('\n').find(l=>l.startsWith('単元'))?.match(/\b(?:uc|ue)-[a-z0-9-]+\b/)?.[0];
  targets=catalog.filter(c=>c.stageId===unit||c.id.startsWith(`${unit}-`)).map(c=>c.id);
 }
 const result=targets.map(mainId=>({mainId,afterScene:first?0:Number(scene?.[1])}));
 if(!result.length||result.some(p=>!Number.isInteger(p.afterScene)))issues.push({type:'unresolved-insert-route',id,...definition});
 placements.set(id,result);return result;
}
for(const [id,clip]of fresh){if(clip.kind!=='insert')continue;
 const definition=definitions.get(id);clip.title=clip.title.replace(/\([^)]*(?:後|最初)\)$/,'').trim();
 const positions=locate(id);
 for(const p of positions){
  const main=all.get(p.mainId);if(!main||p.afterScene>main.scenes.length){issues.push({type:'invalid-insert-scene',id,...p});continue;}
  const entries=routes[p.mainId]??=[];let entry=entries.find(e=>e.afterScene===p.afterScene);if(!entry){entry={afterScene:p.afterScene,inserts:[]};entries.push(entry);}
  const at=p.afterInsert?entry.inserts.indexOf(p.afterInsert)+1:entry.inserts.length;
  if(!entry.inserts.includes(id))entry.inserts.splice(at,0,id);
  clip.stageId=main.stageId;clip.level=main.level;
 }
 clip.sourceDefinition=definition;
}
// Titles and direct prerequisite assignments come from the manuscript tables.
const prerequisiteRoutes=JSON.parse(readFileSync('src/content/prerequisite-routes.generated.json'));
for(const doc of ledger.documents){for(const section of doc.sections){
 const titleTable=section.directions.some(d=>/\|\s*動画\s*\|\s*新しいタイトル/.test(d));
 const prepTable=section.directions.some(d=>/\|.*\|\s*(?:挟む前提動画|前提動画)/.test(d));
 for(const row of section.directions){
  if(!row.startsWith('|'))continue;const cells=row.split('|').slice(1,-1).map(c=>c.trim());
  if(titleTable&&originals.has(cells[0]))edit(cells[0]).title=cells[1];
  if(prepTable){const ids=[...cells.slice(1).join(' ').matchAll(/prep-[a-z0-9-]+/g)].map(m=>m[0]);if(!ids.length)continue;
   const targets=catalog.filter(c=>c.id===cells[0]||c.stageId===cells[0]);
   for(const target of targets){for(const id of ids)if(!all.has(id))issues.push({type:'missing-prerequisite',main:target.id,id});prerequisiteRoutes[target.id]={required:[...new Set(ids)],review:[...new Set(ids)]};}
  }
 }
}}
prerequisiteRoutes['e-field-middle']={required:['prep-coulomb-field'],review:['prep-coulomb-field']};
// Addendum explicitly reuses existing why clips, not duplicate recordings.
for(const [mainId,afterScene,id] of [['w-doppler-intro',2,'hw-why-05'],['w-light-intro',3,'hw-why-07']]){
 const entries=routes[mainId]??=[];let entry=entries.find(e=>e.afterScene===afterScene);if(!entry){entry={afterScene,inserts:[]};entries.push(entry);}if(!entry.inserts.includes(id))entry.inserts.push(id);
}
for(const clip of [...changed.values(),...fresh.values()])for(const [i,scene]of clip.scenes.entries()){scene.sceneId=`${clip.id}-s${i+1}`;scene.mode=clip.kind==='insert'?'thorough':'common';}
const plan=[...changed.values(),...fresh.values()];
// Exact, visual-only wording supplied in files 02, 04, and the addendum.
edit('t-heat-advanced').scenes[1].symbols='mは融ける質量[g]、Lは一グラムあたりの融解熱[J/g]。';
edit('t-firstlaw-middle').scenes[1].symbols=edit('t-firstlaw-middle').scenes[1].symbols.replace('準静的な変化を扱う','ゆっくり動かして、気体の圧力がいつもそろっている変化を扱う');
const cycle=edit('prep-heat-cycle');
for(const scene of cycle.scenes){
 if(scene.diagram)scene.diagram=JSON.parse(JSON.stringify(scene.diagram).replaceAll('W正味','W差し引き'));
 if(scene.equation)scene.equation=scene.equation.replaceAll('W正味','W差し引き');
}
const cache='/private/tmp/physics-video-full-revision';mkdirSync(cache,{recursive:true});
applyCircularPilot(plan,{inserts:routes,prerequisites:prerequisiteRoutes});
applyMotionFoundations(plan);
applyMotionInserts(plan);
applyUniformAcceleration(plan);
applyUniformContinuation(plan);
applyFreefall(plan);
applyProjectileFoundations(plan);
applyProjectileMiddle(plan);
applyAdditionTheorem(plan);
applyAdditionPrerequisiteRoutes(prerequisiteRoutes);
applyProjectileAdvanced(plan,routes);
applyForceStoryboards(plan);
applyWorkFoundations(plan);
applyWorkComponents(plan);
applyPotentialEnergy(plan);
applySpringEnergy(plan);
applyMomentumFoundations(plan);
applyMomentumMiddle(plan);
applyMomentumAdvanced(plan);
applyRadianFoundations(plan);
applyCircularFoundations(plan);
applyShmFoundations(plan);
applyShmMiddle(plan);
applySineDerivative(plan);
applySineMotion(plan);
applyShmAdvanced(plan);
applyHeatFoundations(plan);
applyFoundationAppendices(plan);
applyHeatMelting(plan);
applyGasFoundations(plan);
applyGasTemperature(plan);
applyGasStates(plan);
applyIdealGasFoundations(plan);
applyMoleFoundations(plan);
applyGasParticles(plan);
applyIdealGasAdvanced(plan);
applyGasWork(plan);
applyFirstlawFoundations(plan);
applyHeatCycle(plan);
applyWaveFoundations(plan);
applyWaveSpeed(plan);
applyTravelingWave(plan);
applyWaveSuperposition(plan);
applySoundFoundations(plan);
applySoundBoundaries(plan);
applySoundBeats(plan);
applyDopplerSource(plan);
applyDopplerObserver(plan);
applyLightFoundations(plan);
applyLightRefraction(plan);
applyTotalReflection(plan);
applyLightInterference(plan);
applyDoubleSlit(plan);
applySingleSlit(plan);
applyCurrentFoundations(plan);
writeFileSync(`${cache}/plan.json`,JSON.stringify(plan,null,2));
writeFileSync(`${root}/full-plan.generated.json`,JSON.stringify(plan,null,2));
writeFileSync(`${root}/full-routes.generated.json`,JSON.stringify({inserts:routes,prerequisites:prerequisiteRoutes},null,2));
writeFileSync(`${root}/compile-report.generated.json`,JSON.stringify({revised:changed.size,added:fresh.size,issues,editorial,visualTasks,publicationReady:false,note:'Compilation validates mappings, not rendered diagrams, playback, or pronunciation.'},null,2));
console.log(JSON.stringify({revised:changed.size,added:fresh.size,insertTargets:Object.keys(routes).length,issues:issues.length}));
