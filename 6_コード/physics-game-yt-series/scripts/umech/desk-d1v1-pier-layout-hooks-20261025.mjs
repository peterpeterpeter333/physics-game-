// Private final-D import routing only. Original compositor/encoder/inspectors
// are never edited, nor are their rules or thresholds replaced.
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
const root='/private/tmp/ys/ys-chain-d1v1-final-pier-layout-20261025';
assert.equal(process.env.D1_LAYOUT_SCOPE,'D1-pier-layout-20261025');
assert(process.env.EM_FILM_CACHE===root||process.env.EM_FILM_CACHE?.startsWith(root+'/'));
const encoder=new URL('../render-all-films-gptv2.mjs',import.meta.url),gate=new URL('./desk-quality-gate.mjs',import.meta.url),wrapper=new URL('./desk-d1v1-final-layout-frame-20261025.mjs',import.meta.url);
registerHooks({resolve(specifier,context,nextResolve){
 if(context.parentURL===encoder.href&&specifier==='./umech/frame-vert.mjs'||context.parentURL===gate.href&&(specifier==='./frame-vert.mjs'||specifier===new URL('./frame-vert.mjs',gate).href))return{url:wrapper.href,shortCircuit:true};
 return nextResolve(specifier,context);
}});
