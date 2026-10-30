// Reuse the unchanged existing encoder, routing its compositor import to our
// new private four-episode extension. No shared source/test is modified.
import {registerHooks} from 'node:module';
// The completed series reference uses this existing CRF18 encoder.
const encoder=new URL('../render-all-films-gptv2.mjs',import.meta.url);
const wrapper=new URL('./desk-axes-frame.mjs',import.meta.url);
registerHooks({resolve(specifier,context,nextResolve){
 if(context.parentURL===encoder.href&&specifier==='./umech/frame-vert.mjs')return {url:wrapper.href,shortCircuit:true};
 return nextResolve(specifier,context);
}});
await import(encoder.href);
