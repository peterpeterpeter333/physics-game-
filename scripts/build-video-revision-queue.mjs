/** Resolve reviewed changes against actual media IDs. Never mark a visual direction as done automatically. */
import {readFileSync,writeFileSync} from 'node:fs';
const root='docs/video-revision-20260924';
const ledger=JSON.parse(readFileSync(`${root}/import-ledger.generated.json`));
const catalog=['em','lesson','prerequisite'].flatMap(name=>JSON.parse(readFileSync(`src/content/${name}-video-catalog.generated.json`)));
const known=new Map(catalog.map(c=>[c.id,c]));
const modifications=[],newClips=[],unresolved=[];
for(const document of ledger.documents){
 for(const section of document.sections){
  if(!section.pairs.length)continue;
  const context=section.headings.join('\n'),last=section.headings.at(-1);
  const source={file:document.file,line:section.line};
  const newHeading=[...section.headings].reverse().find(h=>/【(?:差し込み|新規動画|新規)】/.test(h));
  if(newHeading){
   const id=newHeading.match(/【(?:差し込み|新規動画|新規)】\s*([a-z][a-z0-9-]+)/)?.[1];
   if(id){newClips.push({id,kind:id.startsWith('prep-')?'prerequisite':'insert',context,source,directions:section.directions,pairs:section.pairs,status:'pending-visual-review'});continue;}
  }
  const id=[...section.headings].reverse().flatMap(h=>[...h.matchAll(/\b([a-z][a-z0-9]*(?:-[a-z0-9]+)+)\b/g)].map(m=>m[1]))[0];
  const scene=last.match(/場面(\d+)(?:[〜～-](\d+))?/);
  if(!id||!known.has(id)||!scene||scene[2]){unresolved.push({source,context,reason:'Requires manual target or multi-scene assignment',pairs:section.pairs});continue;}
  const index=Number(scene[1])-1,clip=known.get(id);
  const operation=last.includes('場面追加')?'append':last.includes('追加行')?'append-sentences':'replace';
  if(index>=clip.scenes.length&&!(operation==='append'&&index===clip.scenes.length)){unresolved.push({source,context,reason:`Scene ${index+1} exceeds actual ${clip.scenes.length}`});continue;}
  const alignment=section.pairs.every(p=>p.subtitle.split('。').filter(Boolean).length===p.reading.split('。').filter(Boolean).length);
  modifications.push({id,scene:index+1,operation,source,pairs:section.pairs,directions:section.directions,heading:last,status:alignment?'pending-visual-review':'awaiting-reading-approval'});
 }
}
const duplicates=modifications.filter((m,i)=>modifications.findIndex(n=>n.id===m.id&&n.scene===m.scene)!==i).map(m=>({id:m.id,scene:m.scene,source:m.source}));
const result={summary:{modifiedMovies:new Set(modifications.map(m=>m.id)).size,modifiedScenes:modifications.length,newClipIDs:new Set(newClips.map(c=>c.id)).size,unresolved:unresolved.length},modifications,newClips,duplicates,unresolved};
writeFileSync(`${root}/revision-queue.generated.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.summary));
