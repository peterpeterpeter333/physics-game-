// Same authorized1.65s threshold in memory; the existing checker is not edited.
import assert from 'node:assert/strict';
const a=process.argv.slice(2),i=a.indexOf('--cache');
assert.ok(a.includes('ys-chain-d1b'));
assert.ok(i>=0&&a[i+1]==='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026','Use the isolated S3 cache');
await import('./desk-d1b-caption165-loader_gpt_20261026.mjs');
