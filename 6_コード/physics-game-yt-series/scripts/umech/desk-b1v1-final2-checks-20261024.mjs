// The existing launcher's tests are not altered. Add only the B-only compositor
// import so the original SVG checks see precisely the delivered visual layer.
import fs from 'node:fs';
import {registerHooks} from 'node:module';
import assert from 'node:assert/strict';
const launcher=new URL('./desk-axes-final-checks.mjs',import.meta.url);
assert.equal(process.argv[2],'b1');
registerHooks({load(url,context,nextLoad){
 if(url!==launcher.href)return nextLoad(url,context);
 const old=fs.readFileSync(launcher,'utf8');
 const needle="['--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs'";
 assert.equal(old.split(needle).length,2,'Exact existing original test invocation must occur once');
 return {format:'module',source:old.replace(needle,"['--import','./scripts/umech/desk-b1v1-review-quality-loader.mjs','--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs'"),shortCircuit:true};
}});
await import(launcher.href);
