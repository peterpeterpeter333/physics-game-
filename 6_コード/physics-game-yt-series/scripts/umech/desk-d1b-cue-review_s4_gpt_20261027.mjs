// Relocate ONLY mxr-review's output in memory. Preserve CACHE/review trial images.
// Original shared checker/compositor files stay byte-identical on disk.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import './desk-d1b-hooks_s4_gpt_20261027.mjs';
const CACHE='/private/tmp/ys/ys-chain-d1b_s4_gpt_20261027';
assert.equal(process.env.EM_FILM_CACHE,CACHE,'Use only the isolated S4 cache');
assert.equal(fs.realpathSync(CACHE),CACHE);
assert.equal(fs.existsSync(CACHE+'/cue-review'),false,'Preserve any earlier cue-review result');
const target=new URL('./mxr-review.mjs',import.meta.url),original=fs.readFileSync(target,'utf8');
const before="const out=cache+'/review';",after="const out=cache+'/cue-review';";
assert.equal(original.split(before).length,2,'Shared mxr-review output declaration changed; inspect manually');
const changed=original.replace(before,after);assert.equal(changed.replace(after,before),original);
registerHooks({load(url,context,next){const value=next(url,context);if(url!==target.href)return value;const source=Buffer.from(value.source).toString('utf8');assert.equal(source,original,'Unexpected mxr-review loader input');return {...value,source:changed};}});
console.log('S4 mxr output relocated in memory to '+CACHE+'/cue-review; existing '+CACHE+'/review is not an output target.');
await import('./mxr-review.mjs');
