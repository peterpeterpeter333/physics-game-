// Inspect the exact delivered B3 compositor, without changing any original test.
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
assert(process.argv.includes('ys-chain-b1v1'));
const gate=new URL('./desk-quality-gate.mjs',import.meta.url);
const wrapper=new URL('./desk-b1v1-final3-frame.mjs',import.meta.url);
registerHooks({resolve(specifier,context,nextResolve){
 if(context.parentURL===gate.href&&(specifier==='./frame-vert.mjs'||specifier===new URL('./frame-vert.mjs',gate).href))return {url:wrapper.href,shortCircuit:true};
 return nextResolve(specifier,context);
}});
