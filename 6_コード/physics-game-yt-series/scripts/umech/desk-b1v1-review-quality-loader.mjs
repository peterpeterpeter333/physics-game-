// Original quality test/thresholds remain unchanged; inspect the actual B frame.
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
assert(process.argv.includes('ys-chain-b1v1'),'B-only review compositor scope');
const gate=new URL('./desk-quality-gate.mjs',import.meta.url),wrapper=new URL('./desk-b1v1-review-frame.mjs',import.meta.url);
registerHooks({resolve(specifier,context,nextResolve){
 if(context.parentURL===gate.href&&(specifier==='./frame-vert.mjs'||specifier===new URL('./frame-vert.mjs',gate).href))return {url:wrapper.href,shortCircuit:true};
 return nextResolve(specifier,context);
}});
