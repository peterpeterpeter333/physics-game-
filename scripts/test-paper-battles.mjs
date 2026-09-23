import assert from 'node:assert/strict';
import {build} from 'esbuild';
import Module from 'node:module';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import katex from 'katex';
import {battles} from './paper-battle-storyboard.mjs';
const result=await build({stdin:{contents:"export {paperBattleAnswer} from './src/game/paper-battle';export {emPaperProblems} from './src/content/em-paper-problems';",resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m=new Module(`${process.cwd()}/.paper-battle-test.cjs`);m._compile(result.outputFiles[0].text,m.id);
const {paperBattleAnswer,emPaperProblems}=m.exports;
const catalog=JSON.parse(readFileSync('src/content/paper-battle-videos.generated.json'));
const ids=Object.values(emPaperProblems).flat().map(p=>p.id);
assert.equal(ids.length,9);assert.deepEqual(catalog.map(c=>c.id),ids);
for(const entry of catalog){
 assert.equal(entry.choices.length,4);assert.equal(new Set(entry.choices).size,4);
 assert(entry.answerIndex>=0&&entry.answerIndex<4);
 const authored=battles.find(b=>b.id===entry.id);assert.deepEqual(entry.choices,authored.choices);assert.equal(entry.answerIndex,authored.answerIndex);
 for(const choice of entry.choices)for(const tex of choice.matchAll(/\$([^$]+)\$/g))katex.renderToString(tex[1],{throwOnError:true});
 for(const kind of ['question','solution']){
  const movie=entry[kind],base=`public/media/paper-battles/${movie.id}`;
  assert(existsSync(`${base}.jpg`));assert(statSync(`${base}.mp4`).size>10000);assert(movie.duration>10);
  const metadata=JSON.parse(readFileSync(`${base}.json`));assert.equal(movie.renderKey,metadata.renderKey);
  assert.deepEqual(metadata.scenes.map(s=>s.narration),authored[kind].map(s=>s.narration));
  for(const scene of metadata.scenes){assert(scene.end>scene.start);assert(scene.captions.every(c=>c.end>c.start));}
  if(process.env.FFMPEG){
   const decode=spawnSync(process.env.FFMPEG,['-v','info','-i',`${base}.mp4`,'-f','null','-'],{encoding:'utf8'});
   assert.equal(decode.status,0,`${movie.id}: ${decode.stderr}`);
   assert(/Audio: aac/.test(decode.stderr),`${movie.id}: missing audio`);assert(/Video: h264/.test(decode.stderr));
  }
 }
}
for(const maxHp of [110,118,130]){
 let state={solved:[],combo:0,bestCombo:0,hp:maxHp};
 const wrong=paperBattleAnswer(state,'one',false,maxHp,3);assert.equal(wrong.hp,maxHp);assert.equal(wrong.solved.length,0);
 state=paperBattleAnswer(wrong,'one',true,maxHp,3);assert(state.hp<maxHp);assert.equal(state.combo,1);
 assert.deepEqual(paperBattleAnswer(state,'one',true,maxHp,3),state,'Duplicate answer must not deal damage');
 state=paperBattleAnswer(state,'two',false,maxHp,3);assert.equal(state.combo,0);
 state=paperBattleAnswer(state,'two',true,maxHp,3);assert(state.hp>0);
 state=paperBattleAnswer(state,'three',true,maxHp,3);assert.equal(state.hp,0);assert.equal(state.solved.length,3);assert.equal(state.bestCombo,2);
}
console.log(`PASS: 9 questions, 18 narrated movies, 4 choices each, retry/damage/combo/victory${process.env.FFMPEG?', all media decoded':''}`);
