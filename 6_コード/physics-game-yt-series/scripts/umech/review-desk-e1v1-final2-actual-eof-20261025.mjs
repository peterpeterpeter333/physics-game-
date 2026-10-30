// NEW cache-only review adapter. Original decoder/EOF proof/inspectors remain untouched.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';
import{createHash}from'node:crypto';import{registerHooks}from'node:module';import{fileURLToPath}from'node:url';
const self=fileURLToPath(import.meta.url),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const old=new URL('./review-desk-e1v1-actual-eof-20261025.mjs',import.meta.url);
const oldPin='8a3691ad19335809cee9e5b36dfa6ce8d28d5a03457de4450a482c572cbf8f4e';
const rawReviewer=new URL('./review-desk-e1v1-delivery-20261024.mjs',import.meta.url);
assert.equal(sha(old),oldPin);assert.equal(sha(rawReviewer),'0c0340bb966b398e14caecdd8be9b20648a0871b13941ab72e813763e211dcdc');
const source=fs.readFileSync(old,'utf8');let derived=source;const boundaries=[];
const change=(a,b)=>{assert.equal(derived.split(a).length,2,a);derived=derived.replace(a,b);boundaries.push([a,b]);};
const beforeCache="const cache='/private/tmp/ys/ys-chain-e1v1-final-20261024',nf=11606,fps=30;";
const afterCache="const cache='/private/tmp/ys/ys-chain-e1v1-final2-meaningful-motion-20261025',nf=11606,fps=30;";
change(beforeCache,afterCache);
const originalRead="const originalSource=fs.readFileSync(original,'utf8');";
const rawOld="cache='/private/tmp/ys/ys-chain-e1v1-final-20261024'";
const rawNew="cache='/private/tmp/ys/ys-chain-e1v1-final2-meaningful-motion-20261025'";
const checkpointOld='.map(frame).concat(runs.flatMap(([a,b])=>[a,Math.round((a+b)/2),b])));';
const checkpointNew='.map(frame).concat([12.9,13.47,13.9,14.5,308.4,309.1,310.2,311.4,314.2,317.2,317.5,317.8].map(frame),runs.flatMap(([a,b])=>[a,Math.round((a+b)/2),b])));';
const newRead=`const immutableOriginalSource=fs.readFileSync(original,'utf8');
assert.equal(immutableOriginalSource.split(${JSON.stringify(rawOld)}).length,2);
assert.equal(immutableOriginalSource.split(${JSON.stringify(checkpointOld)}).length,2);
const originalSource=immutableOriginalSource.replace(${JSON.stringify(rawOld)},${JSON.stringify(rawNew)}).replace(${JSON.stringify(checkpointOld)},${JSON.stringify(checkpointNew)});
assert.equal(originalSource.replace(${JSON.stringify(checkpointNew)},${JSON.stringify(checkpointOld)}).replace(${JSON.stringify(rawNew)},${JSON.stringify(rawOld)}),immutableOriginalSource);`;
change(originalRead,newRead);
change(' fileURLToPath(original),fileURLToPath(import.meta.url),video,',
 ' fileURLToPath(original),fileURLToPath(import.meta.url),fileURLToPath(new URL(\'./review-desk-e1v1-final2-actual-eof-20261025.mjs\',import.meta.url)),video,');
let inverse=derived;for(const[a,b]of [...boundaries].reverse()){assert.equal(inverse.split(b).length,2);inverse=inverse.replace(b,a);}assert.equal(inverse,source);
const args=process.argv.slice(2),plain=args.filter(a=>!a.startsWith('--'));assert(args.includes('--authorized')&&plain.length===2);
const cache='/private/tmp/ys/ys-chain-e1v1-final2-meaningful-motion-20261025',out=path.resolve(plain[1]);assert.equal(path.dirname(out),cache);
const proof={episode:'E-1',scope:'Exact actual final2 MP4 decoder review; no frame substitution or automatic eyes',
 wrapper:self,wrapperSha256:sha(self),originalEofReviewer:fileURLToPath(old),originalEofReviewerSha256:oldPin,
 outerBoundaries:boundaries.map(([a,b])=>({before:a,after:b})),inverseByteExact:true,
 innerDeclaredChanges:[{before:rawOld,after:rawNew},{before:checkpointOld,after:checkpointNew}],
 addedRequiredMotionProbeTimes:[12.9,13.47,13.9,14.5,308.4,309.1,310.2,311.4,314.2,317.2,317.5,317.8],
 allOriginalHalfIntegerCueEndCameraReferenceAndBookendScopesRetained:true,originalEofContainerAndFullDecodeProofUnchanged:true,
 sourceFilesUnchanged:true,earListeningPerformed:false,allActuallyViewed:false,finalAcceptance:false};
const proofFile=out+'-cache-derivative.json';assert(!fs.existsSync(proofFile));fs.writeFileSync(proofFile,JSON.stringify(proof,null,1)+'\n',{flag:'wx'});
registerHooks({load(url,context,nextLoad){if(url!==old.href)return nextLoad(url,context);assert.equal(sha(old),oldPin);return{format:'module',source:derived,shortCircuit:true};}});
await import(old.href);assert.equal(sha(old),oldPin);assert.equal(sha(self),proof.wrapperSha256);
