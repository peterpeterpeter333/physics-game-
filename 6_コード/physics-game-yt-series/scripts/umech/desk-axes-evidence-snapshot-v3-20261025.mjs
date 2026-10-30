// Add-only persistence extension: include the new private D records and all
// four episode review wrappers. It is not an inspection or quality waiver.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
const original = new URL('./desk-axes-evidence-snapshot-v2-20261024.mjs', import.meta.url);
const source = fs.readFileSync(original, 'utf8');
assert.equal(createHash('sha256').update(source).digest('hex'),
  'fe3a05317e9e5116113e13d8acd2945da4d48599589eee94d057a3f18ce0670c');
const oldReview = '|review-desk-e1v1)', newReview = '|review-desk-[bcde]1v1)';
assert.equal(source.split(oldReview).length, 2);
const insertionPoint = "const existingReports=W+'/outputs/axes-20261023';";
assert.equal(source.split(insertionPoint).length, 2);
const extra = `// NEW task-private D reports were intentionally not placed in canonical docs.
const privateDeep=W+'/deep';
if(fs.existsSync(privateDeep))for(const f of fs.readdirSync(privateDeep).filter(n=>/^[BCDE]-1_/.test(n)&&/\\.(?:md|json)$/.test(n)))stage(privateDeep+'/'+f,'private-documents/'+f);
`;
const adapted = source.replace(oldReview, newReview).replace(insertionPoint, extra + insertionPoint);
assert.equal(adapted.replace(extra + insertionPoint, insertionPoint).replace(newReview, oldReview), source);
registerHooks({load(url, context, nextLoad) {
  if (url !== original.href) return nextLoad(url, context);
  assert.equal(fs.readFileSync(original, 'utf8'), source);
  return {format: 'module', source: adapted, shortCircuit: true};
}});
await import(original.href);
assert.equal(fs.readFileSync(original, 'utf8'), source);
