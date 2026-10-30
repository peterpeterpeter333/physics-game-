// The authorized 1.65-second MEDIAN upper bound only; not an individual cap.
import assert from 'node:assert/strict';
const a=process.argv.slice(2),i=a.indexOf('--cache');
assert.ok(a.includes('ys-chain-d1b'));
assert.ok(i>=0&&a[i+1]==='/private/tmp/ys/ys-chain-d1b_s4_gpt_20261027','Use isolated S4 cache');
await import('./desk-d1b-caption165-loader_gpt_20261026.mjs');
