// Existing GPTv2 CRF18 encoder with only the private B review frame substituted.
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
assert.deepEqual(process.argv.slice(2),['ys-chain-b1v1'],'B-only review encode scope');
const encoder=new URL('../render-all-films-gptv2.mjs',import.meta.url),wrapper=new URL('./desk-b1v1-review-frame.mjs',import.meta.url);
registerHooks({resolve(specifier,context,nextResolve){
 if(context.parentURL===encoder.href&&specifier==='./umech/frame-vert.mjs')return {url:wrapper.href,shortCircuit:true};
 return nextResolve(specifier,context);
}});
await import(encoder.href);
