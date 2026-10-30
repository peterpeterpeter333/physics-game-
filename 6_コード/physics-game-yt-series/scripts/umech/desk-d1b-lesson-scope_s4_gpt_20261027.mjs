// Authorized display-scope corrections only. No disk-overlay/Japanese changes.
// Preload this (not recap-scope) for every S4 SVG-producing Node process.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import './desk-d1b-hooks_s4_gpt_20261027.mjs';
assert.equal(process.env.EM_FILM_CACHE,'/private/tmp/ys/ys-chain-d1b_s4_gpt_20261027','S4 lesson scope only');
const target=new URL('./desk-d1b-overlay_s4_gpt_20261027.mjs',import.meta.url),original=fs.readFileSync(target,'utf8');
const changes=[
 {before:"  s+=stepsRow([['蒸気を 冷やす',W('recap:can','蒸気を冷やす')],['水に 戻る',W('recap:can','水に戻って')],['空っぽ',W('recap:can','空っぽ')]],t,1470,{size:42});",guard:"if(k==='recap:can')"},
 {before:"  s+=stepsRow([['空気が 押す',W('run:down','外の空気')],['ピストン 下',W('run:down','押し下げます')],['棒 上',W('run:down','引き上げられます')]],t,1490,{size:42});",guard:"if(k!=='run:back'||t<W('run:back','\\u306f\\u3058\\u3081\\u306b\\u623b\\u308a\\u307e\\u3059'))"}
].map(change=>({...change,after:change.before.replace('s+=stepsRow(',change.guard+'s+=stepsRow(')}));
let transformed=original;
for(const {before,after,guard} of changes){
 assert.match(guard,/^[\x20-\x7e]+$/,'Inserted guards must contain ASCII only');
 assert.equal(original.split(before).length,2,'Each exact authorized stepsRow must occur once');
 assert.equal(original.includes(after),false,'An authorized guard already exists; inspect manually');
 transformed=transformed.replace(before,after);
}
let reversed=transformed;
for(const {before,after} of [...changes].reverse()){
 assert.equal(reversed.split(after).length,2,'Each transformed guard must occur once');
 reversed=reversed.replace(after,before);
}
assert.equal(reversed,original,'Only the two display guards may change; labels/captions stay unchanged');
registerHooks({load(url,context,next){
 const value=next(url,context);if(url!==target.href)return value;
 assert.equal(Buffer.from(value.source).toString('utf8'),original,'Unexpected S4 overlay loader input; do not combine with recap-scope');
 return {...value,source:transformed};
}});
console.log('S4 lesson scope: can condensation only on recap:can; downward steps stop at the supplied run:back return phrase. Labels, captions, raw and disk overlay unchanged.');
