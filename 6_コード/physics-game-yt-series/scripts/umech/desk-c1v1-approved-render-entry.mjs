// Route only this explicitly requested C-1 encode through the private approved
// face timing wrapper. Original encoder and four-episode wrapper are unchanged.
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
assert.deepEqual(process.argv.slice(2),['ys-chain-c1v1']);
const encoder=new URL('../render-all-films-gptv2.mjs',import.meta.url),wrapper=new URL('./desk-c1v1-approved-frame.mjs',import.meta.url);
registerHooks({resolve(specifier,context,nextResolve){
 if(context.parentURL===encoder.href&&specifier==='./umech/frame-vert.mjs')return {url:wrapper.href,shortCircuit:true};
 return nextResolve(specifier,context);
}});
await import(encoder.href);
