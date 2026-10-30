import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
const gate=new URL('./desk-quality-gate.mjs',import.meta.url);
const wrapper=new URL('./desk-d1v1-final-layout-frame-20261025.mjs',import.meta.url);
assert(process.env.D1_WIDTH_FINAL_GATE==='1');
registerHooks({resolve(specifier,context,next){
 if(context.parentURL===gate.href&&(specifier==='./frame-vert.mjs'||specifier===new URL('./frame-vert.mjs',gate).href))return{url:wrapper.href,shortCircuit:true};
 return next(specifier,context);
}});
