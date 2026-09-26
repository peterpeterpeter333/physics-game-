// Enumerate the ACTUAL local app playlists, not the unrendered manuscript plan.
// This is a review queue, not an automated claim of pedagogical quality.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {build} from 'esbuild';
import assert from 'node:assert/strict';
const read=n=>JSON.parse(readFileSync(`src/content/${n}.generated.json`));
async function load(file){const b=await build({entryPoints:[file],bundle:true,write:false,platform:'node',format:'esm'});return import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));}
const {prerequisitePlaylist,thoroughPrerequisitePlaylist}=await load('src/game/prerequisite-playlist.ts');
const {manualVideoPlaylist}=await load('src/game/manual-video-playlist.ts');
const replacements=new Map(read('revised-video-catalog').map(c=>[c.id,c]));
const mains=read('lesson-video-catalog').filter(c=>/^(m1-|m-|t-|w-|e-|a-)/.test(c.id)).map(c=>replacements.get(c.id)??c);
const prep=read('prerequisite-video-catalog').map(c=>replacements.get(c.id)??c),inserts=read('insert-video-catalog'),routes=read('insert-routes');
const checks=['learningOrder','prerequisiteCoverage','narrationAndSymbols','algebraSteps','encodedVisualSequence','readingAndThinkingTime','mobileLegibility','manualNavigation','audioListening'];
const units=mains.map(main=>{
 const assigned=prerequisitePlaylist([main],prep),modes={};
 for(const mode of ['quick','thorough']){
  const queue=thoroughPrerequisitePlaylist(assigned,prep,mode),pages=manualVideoPlaylist(queue,mode,routes,inserts);
  modes[mode]=pages.map(p=>({pageId:p.id,filmId:p.media.id,title:p.media.title,start:p.start,end:p.end,secondsAtDefaultSpeed:(p.end-p.start)/.9,media:`public/media/${p.media.mediaDirectory??'lessons'}/${p.media.id}.mp4`,renderKey:p.media.renderKey??null}));
  for(const p of modes[mode])assert.ok(existsSync(p.media),`Missing local playback media: ${p.media}`);
 }
 return {id:main.id,stage:main.stageId,level:main.level,title:main.title,authoredAnimation:Boolean(main.visualPilot),checks:Object.fromEntries(checks.map(k=>[k,'not-yet-reviewed-in-this-audit'])),modes};
});
assert.equal(units.length,81,'Update scope deliberately if the high-school curriculum changes');
const unique=new Map(units.flatMap(u=>u.modes.thorough).map(p=>[p.filmId,p.media]));
const result={scope:'高校の力学→熱→波→電磁気→原子。大学編は対象外。',warning:'点検対象の一覧であり、合格・全編視聴・聴取の記録ではない。個別の点検結果は総合点検_20260926.mdを参照。',mainFilms:units.length,uniquePlaybackFilms:unique.size,units};
const file='docs/video-revision-20260924/high-school-review-queue.generated.json',data=JSON.stringify(result,null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(readFileSync(file,'utf8'),data,'Stale high-school review queue');else writeFileSync(file,data);
console.log(`Review queue only: ${units.length} high-school mains, ${unique.size} unique playback films including prerequisites/inserts. No quality pass inferred.`);
