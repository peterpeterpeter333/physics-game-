import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const W=process.cwd();
assert(W.endsWith('/work/physics-game-yt-series'));
const O=W+'/outputs/axes-20261023';
const original=O+'/d1-final-exact-case-visual-closure-v2-20261025.json';
const delivery=O+'/d1-final-delivery-copy-20261025.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(sha(original),'0d7578b870f07ff98f61ec7c0f5375a548f8bd09fb3660d23ef7d2eedb8476d2');
const old=JSON.parse(fs.readFileSync(original)),copy=JSON.parse(fs.readFileSync(delivery));
assert.equal(copy.sha256,old.mp4Sha256);
assert.equal(copy.qualityApprovalInferred,false);
for(const p of [copy.source,copy.destination])assert.equal(sha(p),old.mp4Sha256);
assert.equal(copy.sourceAndDestinationSha256Match,true);
assert.equal(copy.existingOutputOverwritten,false);
const out=O+'/d1-final-exact-case-visual-and-delivery-closure-v3-20261025.json';
assert(!fs.existsSync(out));
const result={...old,
 previousSnapshot:{path:original,sha256:sha(original)},
 newRecordPurpose:'Attach already-proven exact Downloads delivery; retain all numerical NG, case decisions and viewing limits from v2. The earlier finalDeliveryCopied=false was not a checked current delivery result.',
 deliveryReceipt:{path:delivery,sha256:sha(delivery)},
 deliveryDestination:copy.destination,
 deliveryDestinationSha256:sha(copy.destination),
 finalDeliveryCopied:true,
 sourceAndDownloadsSha256Match:true,
 existingDownloadsFileOverwritten:false,
 newMediaOrVisualReviewPerformed:false,
 existingEvidenceEdited:false,
 commitOrPushPerformed:false,
};
fs.writeFileSync(out,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
assert.equal(sha(original),result.previousSnapshot.sha256);
console.log(JSON.stringify({out,sha256:sha(out),mp4Sha256:old.mp4Sha256,previousFileUnchanged:true}));
