// Mechanical import of the user's six reviewed manuscripts. Editorial corrections
// live separately so that the input, corrections and final speech remain auditable.
import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import ts from 'typescript';
import {corrections} from './reviewed-narration-corrections.mjs';
const root=process.argv[2];
if(!root)throw Error('Usage: node scripts/import-reviewed-narration.mjs /directory/with/manuscripts');
const names=['完成版_01_高校力学.md','完成版_02_高校_熱波動電磁気原子.md','完成版_03_前提解説76本.md','完成版_04_大学数学27本.md','完成版_05_大学力学30本.md','完成版_06_大学電磁気100本.md'];
const clips=['lesson','prerequisite','em'].flatMap(f=>JSON.parse(readFileSync(`src/content/${f}-video-catalog.generated.json`)));
const byId=new Map(clips.map(c=>[c.id,c])),incoming=new Map(),sources=[];
const report='docs/video-scripts/reviewed-narration-20260923.json';
const prior=new Map((existsSync(report)?JSON.parse(readFileSync(report)).changes:[]).map(c=>[`${c.id}:${c.index+1}`,c]));
for(const name of names){
 const raw=readFileSync(path.join(root,name),'utf8');sources.push({name,sha256:createHash('sha256').update(raw).digest('hex')});let id;
 for(const line of raw.split('\n')){
  const h=line.match(/^## ([\w-]+)\s+[—–-]/);if(h){id=h[1];if(!byId.has(id)||incoming.has(id))throw Error(`Unknown/duplicate ${id}`);incoming.set(id,[]);continue;}
  const s=line.match(/^(\d+)\([^)]*s\)\s*(.*)$/);if(!s)continue;
  if(!id)throw Error('Scene without clip');
  incoming.get(id).push({index:Number(s[1])-1,narration:s[2].replace(/\s*★尺注意.*$/,'').replace(/\(場面を二つに分ける方がよい\)/g,'').trim()});
 }
}
if(incoming.size!==314)throw Error(`Expected 314 clips, got ${incoming.size}`);
const changes=[],replacements=new Map();
for(const clip of clips){
 const rows=incoming.get(clip.id)??clip.scenes;
 if(rows.length!==clip.scenes.length)throw Error(`Scene count: ${clip.id}`);
 for(const [j,scene] of clip.scenes.entries()){
  const row=rows[j];if(row.index!==scene.index)throw Error(`Scene index: ${clip.id}/${row.index}/${scene.index}`);
  const key=`${clip.id}:${scene.index+1}`,text=corrections[key]??row.narration;
  if(!text||!text.endsWith('。')||/★|修正案:/.test(text))throw Error(`Invalid speech ${key}`);
  const previous=prior.get(key),current=previous?.after??scene.narration;
  changes.push({id:clip.id,stageId:clip.stageId,index:scene.index,source:incoming.has(clip.id)?'user-manuscript':'existing-script',before:previous?.before??scene.narration,manuscript:row.narration,after:text});
  if(text===current)continue;
  if(replacements.has(current)&&replacements.get(current)!==text)throw Error(`Conflicting literal: ${key}`);
  replacements.set(current,text);
 }
}
for(const key of Object.keys(corrections))if(!changes.some(c=>`${c.id}:${c.index+1}`===key))throw Error(`Unused correction ${key}`);
const files=readdirSync('docs/video-scripts').filter(f=>f.endsWith('.mjs')).map(f=>`docs/video-scripts/${f}`);
files.push('src/content/em-video-narration.ts');
const found=new Set(),edits=[];
for(const file of files){
 const old=readFileSync(file,'utf8'),ast=ts.createSourceFile(file,old,ts.ScriptTarget.Latest,true),spans=[];
 function visit(n){if(ts.isStringLiteral(n)&&replacements.has(n.text)){spans.push([n.getStart(ast),n.end,JSON.stringify(replacements.get(n.text))]);found.add(n.text);}ts.forEachChild(n,visit);}visit(ast);
 if(!spans.length)continue;let next=old;
 for(const [a,b,text]of spans.sort((a,b)=>b[0]-a[0]))next=next.slice(0,a)+text+next.slice(b);
 edits.push([file,next]);
}
for(const old of replacements.keys())if(!found.has(old))throw Error(`Source literal not found: ${old}`);
if(process.env.REVIEW_DRY_RUN){console.log(JSON.stringify({sources,clips:clips.length,scenes:changes.length,changed:changes.filter(c=>c.before!==c.after).length,files:edits.map(([f])=>f)},null,2));}
else{
 for(const [file,text]of edits)writeFileSync(file,text);
 writeFileSync('docs/video-scripts/reviewed-narration-20260923.json',JSON.stringify({sources,changes},null,2)+'\n');
 console.log(`Applied ${replacements.size} changed speech literals in ${edits.length} source files`);
}
