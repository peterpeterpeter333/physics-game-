// 正本の枝番号 40a〜40k / 43a〜43c も読む、この試作専用の追加照合。
// 既存 chain-desk-lint は番号が数字だけの行を読むため、そのままにして補う。
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {clips} from '../../docs/video-revision-20260924/ytseries/chain-1-1gpt.mjs';
const path='/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/正本/技術の疑問の鎖_1-1_第6版_完成形_ナレーション.md';
const rows=readFileSync(path,'utf8').split('\n').filter(s=>/^\|\s*\d+(?:[a-z]\d*)?\s*\|/.test(s)).map(s=>{
  const p=s.split('|').map(x=>x.trim());
  return {number:p[1],heading:p[2],who:p[3],text:p[4]};
});
const scenes=clips[0].scenes;
const cues=scenes.flatMap(s=>s.cues.map(q=>({heading:s.heading,who:q.speaker,text:q.subtitle})));
let j=0;
const who={'カイ':'kai','ミオ':'mio'};
for(const row of rows){
  let acc='',n=0;
  while(j<cues.length&&acc.length<row.text.length){
    const cue=cues[j++];
    assert.equal(cue.heading,row.heading,`行${row.number} scene`);
    assert.equal(cue.who,who[row.who],`行${row.number} speaker`);
    if(n)assert.match(acc,/[。？！]$/,`行${row.number} 文の途中で分割`);
    acc+=cue.text;n++;
  }
  assert.equal(acc,row.text,`行${row.number} text`);
  if(n>1)assert.ok((row.text.match(/[。？！]/g)??[]).length>=3,`行${row.number} を不要に分割`);
}
assert.equal(j,cues.length);
console.log(`正本照合 OK: ${rows.length}行、${cues.length}cue、枝番号を含む全行`);
