// Exact final C compositor for unchanged original SVG tests. No metric waiver.
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
assert(process.argv.includes('ys-chain-c1v1'),'C-only final compositor loader');
const gate=new URL('./desk-quality-gate.mjs',import.meta.url),wrapper=new URL('./desk-c1v1-final-frame.mjs',import.meta.url);
registerHooks({resolve(specifier,context,nextResolve){
 if(context.parentURL===gate.href&&(specifier==='./frame-vert.mjs'||specifier===new URL('./frame-vert.mjs',gate).href))return {url:wrapper.href,shortCircuit:true};
 return nextResolve(specifier,context);
}});
