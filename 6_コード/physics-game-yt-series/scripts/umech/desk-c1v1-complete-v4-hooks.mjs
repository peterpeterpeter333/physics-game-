// One C-only import hook for the unchanged encoder and original seven inspectors.
// No shared source or threshold is edited; only the final compositor import changes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
assert(process.argv.includes('ys-chain-c1v1')||process.argv.includes('c1'),'C-only v4 hook');
const encoder=new URL('../render-all-films-gptv2.mjs',import.meta.url),gate=new URL('./desk-quality-gate.mjs',import.meta.url),launcher=new URL('./desk-axes-final-checks.mjs',import.meta.url),wrapper=new URL('./desk-c1v1-complete-frame-v4.mjs',import.meta.url);
registerHooks({
 resolve(specifier,context,nextResolve){
  if(context.parentURL===encoder.href&&specifier==='./umech/frame-vert.mjs'||context.parentURL===gate.href&&(specifier==='./frame-vert.mjs'||specifier===new URL('./frame-vert.mjs',gate).href))return {url:wrapper.href,shortCircuit:true};
  return nextResolve(specifier,context);
 },
 load(url,context,nextLoad){
  if(url!==launcher.href)return nextLoad(url,context);
  const source=fs.readFileSync(launcher,'utf8'),needle="['--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs'";
  assert.equal(source.split(needle).length,2);
  return {format:'module',source:source.replace(needle,"['--import','./scripts/umech/desk-c1v1-complete-v4-hooks.mjs','--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs'"),shortCircuit:true};
 }
});
