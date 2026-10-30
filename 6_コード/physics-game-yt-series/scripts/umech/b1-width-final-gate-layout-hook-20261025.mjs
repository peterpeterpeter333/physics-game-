// Route only this new private B movie's original checker to its actual frame
// renderer. Does not change the checker or any existing shared module.
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
const gate=new URL('./desk-quality-gate.mjs',import.meta.url);
const frame=new URL('./desk-b1v1-final3-frame.mjs',import.meta.url);
assert.equal(process.env.B1_WIDTH_FINAL_GATE,'1');
registerHooks({resolve(specifier,context,next){
 if(context.parentURL===gate.href&&(specifier==='./frame-vert.mjs'||specifier===new URL('./frame-vert.mjs',gate).href))
  return {url:frame.href,shortCircuit:true};
 return next(specifier,context);
}});
