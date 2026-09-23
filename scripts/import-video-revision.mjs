/** Preserve reviewed subtitle/reading pairs, their context, and source lines.
 * This is an import ledger, NOT an assertion that a direction has been rendered.
 */
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root='docs/video-revision-20260924';
const sources=readdirSync(`${root}/sources`).filter(f=>f.startsWith('差し替え台本_')).sort();
const documents=sources.map(file=>{
 const raw=readFileSync(`${root}/sources/${file}`,'utf8'),lines=raw.split('\n');
 const sections=[];let headings=[],current=null,inPairs=false;
 for(let i=0;i<lines.length;i++){
  const line=lines[i],heading=line.match(/^(#{1,6})\s+(.+)$/);
  if(heading){
   const depth=heading[1].length;headings=headings.filter(h=>h.depth<depth);headings.push({depth,title:heading[2]});
   current={line:i+1,headings:headings.map(h=>h.title),directions:[],pairs:[]};sections.push(current);inPairs=false;continue;
  }
  if(!current)continue;
  if(/^\|\s*字幕\s*\|\s*読み\s*\|/.test(line)){inPairs=true;continue;}
  if(inPairs&&/^\|[\s:|\-]+\|$/.test(line))continue;
  if(inPairs&&line.startsWith('|')){
   const cells=line.split(/(?<!\\)\|/).slice(1,-1).map(s=>s.trim());
   if(cells.length!==2)throw Error(`${file}:${i+1}: expected subtitle/reading pair`);
   current.pairs.push({subtitle:cells[0],reading:cells[1],line:i+1});continue;
  }
  inPairs=false;if(line.trim())current.directions.push(line);
 }
 return {file,sha256:createHash('sha256').update(raw).digest('hex'),sections};
});
const sections=documents.flatMap(d=>d.sections),pairs=sections.flatMap(s=>s.pairs);
const report={missingSources:['差し替え台本_02_高校熱力学・波動.md'],documentCount:documents.length,subtitleReadingPairs:pairs.length,
 sentenceAlignmentWarnings:documents.flatMap(d=>d.sections.flatMap(s=>s.pairs.filter(p=>p.subtitle.split('。').filter(Boolean).length!==p.reading.split('。').filter(Boolean).length).map(p=>({file:d.file,...p})))),
 documents};
writeFileSync(`${root}/import-ledger.generated.json`,JSON.stringify(report,null,2)+'\n');
console.log(`${documents.length} documents, ${pairs.length} exact subtitle/reading rows, ${report.sentenceAlignmentWarnings.length} alignment warnings. Missing: ${report.missingSources.join(', ')}`);
