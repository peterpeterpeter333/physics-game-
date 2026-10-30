// New B3-only import hook; the existing CRF18 encoder is not edited.
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
assert.deepEqual(process.argv.slice(2),['ys-chain-b1v1']);
const encoder=new URL('../render-all-films-gptv2.mjs',import.meta.url);
const wrapper=new URL('./desk-b1v1-final3-frame.mjs',import.meta.url);
registerHooks({resolve(specifier,context,nextResolve){
 if(context.parentURL===encoder.href&&specifier==='./umech/frame-vert.mjs')return {url:wrapper.href,shortCircuit:true};
 return nextResolve(specifier,context);
}});
await import(encoder.href);
