import {build} from 'esbuild';
import Module from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export async function loadSource(){
 const b=await build({entryPoints:['scripts/em-film-source.tsx'],bundle:true,write:false,platform:'node',format:'cjs',packages:'external',loader:{'.css':'empty'}});
 const m=new Module(path.resolve('.em-film-source.cjs'));m.paths=Module._nodeModulePaths(process.cwd());m._compile(b.outputFiles[0].text,m.id);return m.exports;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
const {stages,diagram}=await loadSource();
const clips=[];
for(const stage of stages){
 let groups=[];
 if(stage.steps[0].cycle){for(let i=0;i<stage.steps.length;i++){if(i===0||stage.steps[i].cycle!==stage.steps[i-1].cycle)groups.push([]);groups.at(-1).push(i);}}
 else {let start=0;for(const unit of stage.units??[{end:stage.steps.length,goal:stage.title}]){const end=Math.min(stage.steps.length,unit.end);if(end>start)groups.push(Array.from({length:end-start},(_,i)=>i+start));start=end;}if(start<stage.steps.length)groups.push(Array.from({length:stage.steps.length-start},(_,i)=>i+start));}
 const chunks=[];
 for(const group of groups){let rest=[...group];while(rest.length>4){const n=rest.length===5?2:3;chunks.push(rest.splice(0,n));}if(rest.length)chunks.push(rest);}
 for(const indices of chunks){
  const i=clips.filter(c=>c.stageId===stage.id).length;
  const first=stage.steps[indices[0]],unit=stage.units?.find(u=>u.end>indices[0]);
  const clip={id:`${stage.id}-${String(i+1).padStart(2,'0')}`,stageId:stage.id,stageTitle:stage.title,level:stage.level,title:first.goal??unit?.goal??stage.title,sourceIndices:indices,scenes:indices.map(index=>{
   const s=stage.steps[index],art=diagram(s,0);
   const equations=[...new Set([s.formula,s.tex,...(s.calculation?.lines.map(l=>l.tex)??[]),...(s.guide?.steps.map(l=>l.tex)??[])].filter(Boolean))];
   return {index,heading:s.heading,narration:s.narration,equations,guide:s.guide,spatial:art.spatial};
  })};clips.push(clip);
 }
}
const cache=process.env.EM_FILM_CACHE??'/private/tmp/physics-em-films';mkdirSync(cache,{recursive:true});
writeFileSync(path.join(cache,'plan.json'),JSON.stringify(clips,null,2));
console.log(`${stages.length} units, ${clips.length} movies, ${clips.flatMap(c=>c.scenes).length} source slides`);
}
