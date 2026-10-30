import assert from 'node:assert/strict';import {registerHooks} from 'node:module';
assert.deepEqual(process.argv.slice(2),['ys-chain-c1v1']);
const encoder=new URL('../render-all-films-gptv2.mjs',import.meta.url),wrapper=new URL('./desk-c1v1-complete-frame-v3.mjs',import.meta.url);
registerHooks({resolve(specifier,context,nextResolve){if(context.parentURL===encoder.href&&specifier==='./umech/frame-vert.mjs')return {url:wrapper.href,shortCircuit:true};return nextResolve(specifier,context);}});await import(encoder.href);
