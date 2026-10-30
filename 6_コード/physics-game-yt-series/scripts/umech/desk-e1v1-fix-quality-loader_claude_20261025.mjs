// E-1 fix by Claude (2026-10-25). Copy of desk-e1v1-exact-final-quality-loader-20261025.mjs:
// routes only the gate's drawing import to the compositor that drew the fixed movie
// (desk-e1v1-fix-frame_claude_20261025.mjs, which wraps the unchanged desk-axes-frame.mjs).
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
assert(process.argv.includes('ys-chain-e1v1'));
const gate = new URL('./desk-quality-gate.mjs', import.meta.url);
const frame = new URL('./frame-vert.mjs', import.meta.url);
const fixed = new URL('./desk-e1v1-fix-frame_claude_20261025.mjs', import.meta.url);
assert.equal(sha(gate), '34bf299c1f3b53be622b79d01e19284023cc6f64b14c9d5ec88ead5829748308');
registerHooks({resolve(specifier, context, nextResolve) {
  if (context.parentURL === gate.href && (specifier === './frame-vert.mjs' || specifier === frame.href)) {
    return {url: fixed.href, shortCircuit: true};
  }
  return nextResolve(specifier, context);
}});
