// NEW E-only adapter: inspect the same compositor as the immutable final encoder.
// No inspector, test threshold, scene, caption, or original file is changed.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
assert(process.argv.includes('ys-chain-e1v1'));
const gate = new URL('./desk-quality-gate.mjs', import.meta.url);
const frame = new URL('./frame-vert.mjs', import.meta.url);
const delivered = new URL('./desk-axes-frame.mjs', import.meta.url);
assert.equal(sha(gate), '34bf299c1f3b53be622b79d01e19284023cc6f64b14c9d5ec88ead5829748308');
assert.equal(sha(delivered), '83ecc4aea70b71b21b42af52a7020c5a7cb448c32b7eab3becb06380d7f29edb');
registerHooks({resolve(specifier, context, nextResolve) {
  if (context.parentURL === gate.href && (specifier === './frame-vert.mjs' || specifier === frame.href)) {
    return {url: delivered.href, shortCircuit: true};
  }
  return nextResolve(specifier, context);
}});
