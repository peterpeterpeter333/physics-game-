// Root-authorized cache-path-only derivative of the frozen B6 actual-MP4 review.
// No timing, extraction, pixels, test thresholds, or review decisions change.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {registerHooks} from 'node:module';

const original=new URL('./review-desk-b1v1-delivery-b6-20261024.mjs',import.meta.url);
const originalPin='20f2056524b1c80e61e6372fcc42308f3c53eb04a1e411a45d286c16dd127f5b';
const shaBuffer=value=>createHash('sha256').update(value).digest('hex');
const shaFile=file=>shaBuffer(fs.readFileSync(file));
const source=fs.readFileSync(original,'utf8');
assert.equal(shaBuffer(source),originalPin,'Frozen original review changed');
const before="const cache='/private/tmp/ys/ys-chain-b1v1-final4-20261024',fps=30,nf=10700;";
const after="const cache='/private/tmp/ys/ys-chain-b1v1-final4-owned-resume-20261025',fps=30,nf=10700;";
assert.equal(source.split(before).length,2,'Exactly one original cache declaration required');
assert.equal(source.split(after).length,1,'New declaration must not already exist');
const adapted=source.replace(before,after);
assert.equal(adapted.split(after).length,2,'Exactly one new cache declaration required');
assert.equal(adapted.replace(after,before),source,'Only the cache pathname may differ');
const args=process.argv.slice(2),plain=args.filter(a=>!a.startsWith('--'));
assert(args.includes('--authorized')&&plain.length===2,'Require --authorized <actualMP4> <newReviewFolder>');
registerHooks({load(url,context,nextLoad){
 if(url!==original.href)return nextLoad(url,context);
 assert.equal(shaFile(original),originalPin,'Original changed before import');
 return{format:'module',source:adapted,shortCircuit:true};
}});
await import(original.href);
assert.equal(shaFile(original),originalPin,'Original changed during review');
const out=path.resolve(plain[1]),manifest=path.join(out,'manifest.json');
const receipt={
 purpose:'Cache-path-only derivative; original actual-MP4 review and every extraction/timing/test instruction retained',
 original:fileURLToPath(original),originalSha256:originalPin,
 privateWrapper:fileURLToPath(import.meta.url),privateWrapperSha256:shaFile(fileURLToPath(import.meta.url)),
 adaptedInMemorySourceSha256:shaBuffer(adapted),
 onlyDeclaredChange:{before,after},inverseIsByteExactOriginal:true,
 outputManifest:manifest,outputManifestSha256:shaFile(manifest),
 actualEyeReviewPerformedByThisWrapper:false,earsVerified:false,finalAcceptance:false
};
fs.writeFileSync(path.join(out,'owned-cache-review-derivative.json'),JSON.stringify(receipt,null,1)+'\n',{flag:'wx'});
