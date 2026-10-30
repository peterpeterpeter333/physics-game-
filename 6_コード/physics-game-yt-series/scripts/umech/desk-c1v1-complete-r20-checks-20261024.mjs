// Run the original complete inspector set against the exact final C compositor.
// No gate implementation or individual metric is changed by this adapter.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
assert.equal(process.argv[2], 'c1');
const launcher = new URL('./desk-axes-final-checks.mjs', import.meta.url);
registerHooks({load(url, context, nextLoad) {
  if (url !== launcher.href) return nextLoad(url, context);
  const source = fs.readFileSync(launcher, 'utf8');
  const needle = "['--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs'";
  assert.equal(source.split(needle).length, 2);
  return {format:'module', source:source.replace(needle,
    "['--import','./scripts/umech/desk-c1v1-complete-v2-quality-loader.mjs','--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs'"), shortCircuit:true};
}});
await import(launcher.href);
