// Mechanical verbatim extraction only. No Japanese rewriting or PNG rendering.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const W=path.resolve(fileURLToPath(new URL('../..',import.meta.url)));
const MASTER=path.join(W,'docs/video-revision-20260924/deep/技術の疑問の鎖_B-2_前編_第1版_ナレーション.md');
const MASTER_SHA='a9900445f07735abeb46f39618f5878a161ddb8e3ecc4ad3d7c231e1b322437e';
const CACHE='/private/tmp/ys/ys-chain-b2a_s4final_gpt_20261030';
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
assert.equal(hash(MASTER),MASTER_SHA,'Frozen master has changed');
const source=fs.readFileSync(MASTER,'utf8'),heading='## 問題編への接続（いまは作らない。入れるときのため）';
const start=source.indexOf(heading);assert.ok(start>=0);assert.equal(source.indexOf(heading,start+1),-1,'Ambiguous source section');
const rest=source.slice(start),next=/\n## /g.exec(rest.slice(heading.length));
const section=next?rest.slice(0,heading.length+next.index+1):rest;
const field=label=>{
 const prefix='- **'+label+'**：',line=section.split('\n').find(line=>line.startsWith(prefix));
 assert.ok(line,'Missing exact source field: '+label);return line.slice(prefix.length);
};
const question=field('挑戦の問題'),answer=field('答え');
const steps=[...section.matchAll(/^  (\d+)\. (.+)$/gm)];assert.deepEqual(steps.map(match=>+match[1]),[1,2,3,4]);
const spareQuestions=[...section.matchAll(/^  - (.+)$/gm)].map(match=>match[1]);assert.equal(spareQuestions.length,3);
assert.ok(spareQuestions[0].startsWith('やさしい：')&&spareQuestions[1].startsWith('ふつう：')&&spareQuestions[2].startsWith('むずかしい：'));
for(const text of [question,answer,...steps.map(match=>match[2]),...spareQuestions])assert.ok(section.includes(text),'Extracted text differs from source');
const result={episode:'b2a',id:'ys-chain-b2a_gpt_20261029',source:MASTER,masterSha256:MASTER_SHA,sourceSectionVerbatim:section,
 question,answer,steps:steps.map(match=>match[2]),spareQuestions,
 usedParts:['volta_pile','wetpaper','drypaper'],
 images:{challenge:'挑戦.png',answer:'答え.png'},resolution:[1080,1920],
 wordingEdited:false,timeIndependent:true,pngsGeneratedByThisHelper:false,
 scope:'Verbatim source-section extraction only. Root creates time-independent challenge_setup()/answer_state() and the two native PNGs separately.'};
assert.equal(hash(MASTER),MASTER_SHA,'Source changed during extraction');
const output=path.join(CACHE,'problem/problem.json');fs.mkdirSync(path.dirname(output),{recursive:true});
assert.ok(!fs.existsSync(output),'Preserve existing problem JSON; no overwrite');
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
const saved=JSON.parse(fs.readFileSync(output,'utf8'));assert.equal(saved.sourceSectionVerbatim,section);assert.equal(hash(MASTER),MASTER_SHA);
console.log(JSON.stringify({output,masterSha256:MASTER_SHA,steps:saved.steps.length,spareQuestions:saved.spareQuestions.length,usedParts:saved.usedParts,sourceSectionVerbatim:true,pngsRendered:false},null,2));
