// Run the original seven inspectors against E's ACTUAL final drawing hook.
// Only its compositor import is adapted; the existing approved caption exception
// is still loaded separately. Every original NG is retained by the old launcher.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
assert.equal(process.argv[2], 'e1');
const cache = process.env.AXES_FINAL_SOURCE;
assert(cache && path.isAbsolute(cache), 'Explicit completed E final cache required');
assert(!fs.existsSync(path.join(cache, 'validation-final-v1')), 'Keep all prior validation evidence');
const video = process.argv[3], exp = JSON.parse(fs.readFileSync(path.join(cache, 'export.json')));
assert.equal(path.resolve(video), path.resolve(exp.video));
assert.equal(sha(video), exp.sha256, 'Inspect the actually encoded final MP4');
const launcher = new URL('./desk-axes-final-checks.mjs', import.meta.url);
const original = fs.readFileSync(launcher, 'utf8');
assert.equal(sha(launcher), '4eb235cdc0dea4f1691a87090522807acd903a74ce0c5b6736c21cf3807d783a');
const needle = "['--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs'";
const replacement = "['--import','./scripts/umech/desk-e1v1-exact-final-quality-loader-20261025.mjs','--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs'";
assert.equal(original.split(needle).length, 2);
const transformed = original.replace(needle, replacement);
assert.equal(transformed.replace(replacement, needle), original, 'No other launcher edits');
fs.writeFileSync(path.join(cache, 'e1-exact-compositor-validation-loader-20261025.json'), JSON.stringify({
  episode: 'E-1', video, videoSha256: sha(video), exportSha256: sha(path.join(cache, 'export.json')),
  originalLauncherSha256: sha(launcher),
  originalGateSha256: sha(new URL('./desk-quality-gate.mjs', import.meta.url)),
  actualDrawingHook: 'desk-axes-frame.mjs',
  actualDrawingHookSha256: sha(new URL('./desk-axes-frame.mjs', import.meta.url)),
  change: 'Route only the original gate drawing import to the exact final encoder compositor',
  originalNumericThresholdsUnchanged: true, originalSourcesUnchanged: true,
  existingFourEpisodeCaption165ExceptionRetainedSeparately: true,
  automaticApproval: false, finalAcceptance: false,
}, null, 1) + '\n', {flag: 'wx'});
registerHooks({load(url, context, nextLoad) {
  if (url !== launcher.href) return nextLoad(url, context);
  assert.equal(fs.readFileSync(launcher, 'utf8'), original);
  return {format: 'module', source: transformed, shortCircuit: true};
}});
await import(launcher.href);
assert.equal(fs.readFileSync(launcher, 'utf8'), original);
