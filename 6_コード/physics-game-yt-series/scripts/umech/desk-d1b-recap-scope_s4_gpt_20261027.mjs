// Authorized display-scope correction only. Japanese/source files stay unchanged.
// Preload this for every S4 SVG-producing Node process: node --import THIS ...
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import './desk-d1b-hooks_s4_gpt_20261027.mjs';
assert.equal(process.env.EM_FILM_CACHE,'/private/tmp/ys/ys-chain-d1b_s4_gpt_20261027','S4 scope correction only');
const target=new URL('./desk-d1b-overlay_s4_gpt_20261027.mjs',import.meta.url),original=fs.readFileSync(target,'utf8');
const before="  s+=stepsRow([['蒸気を 冷やす',W('recap:can','蒸気を冷やす')],['水に 戻る',W('recap:can','水に戻って')],['空っぽ',W('recap:can','空っぽ')]],t,1470,{size:42});";
const after=before.replace('s+=stepsRow(',"if(k==='recap:can')s+=stepsRow(");
assert.equal(original.split(before).length,2,'The exact recap stepsRow must occur once; inspect changed source manually');
const transformed=original.replace(before,after);assert.equal(transformed.replace(after,before),original,'Only the ASCII can-cue guard may change');
registerHooks({load(url,context,next){const value=next(url,context);if(url!==target.href)return value;const source=Buffer.from(value.source).toString('utf8');assert.equal(source,original,'Unexpected S4 overlay loader input');return {...value,source:transformed};}});
console.log('S4 recap scope: condensation stepsRow only on recap:can; Japanese, shared card, captions, raw and disk overlay unchanged.');
