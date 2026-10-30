// Existing inspector launcher, unchanged tests, only the actual B3 frame import.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
assert.equal(process.argv[2],'b1');
const launcher=new URL('./desk-axes-final-checks.mjs',import.meta.url);
registerHooks({load(url,context,nextLoad){
 if(url!==launcher.href)return nextLoad(url,context);
 const original=fs.readFileSync(launcher,'utf8');
 const needle="['--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs'";
 assert.equal(original.split(needle).length,2);
 return {format:'module',source:original.replace(needle,"['--import','./scripts/umech/desk-b1v1-final3-quality-loader.mjs','--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs'"),shortCircuit:true};
}});
await import(launcher.href);
