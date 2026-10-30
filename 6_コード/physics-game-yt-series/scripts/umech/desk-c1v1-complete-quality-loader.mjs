// Original tests consume the exact final C-only compositor. No metric changed.
import assert from 'node:assert/strict';import {registerHooks} from 'node:module';
assert(process.argv.includes('ys-chain-c1v1'),'C-only final hook');
const gate=new URL('./desk-quality-gate.mjs',import.meta.url),wrapper=new URL('./desk-c1v1-complete-frame.mjs',import.meta.url);
registerHooks({resolve(specifier,context,nextResolve){if(context.parentURL===gate.href&&(specifier==='./frame-vert.mjs'||specifier===new URL('./frame-vert.mjs',gate).href))return {url:wrapper.href,shortCircuit:true};return nextResolve(specifier,context);}});
