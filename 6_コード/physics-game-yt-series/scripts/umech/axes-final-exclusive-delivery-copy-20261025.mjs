import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';
// Exact, non-overwriting local delivery only. It does not certify quality or human viewing.
const[id,source,destination,expected,receipt]=process.argv.slice(2);
assert(['B-1','D-1','E-1'].includes(id));assert(source&&destination&&expected&&receipt);
assert(source.startsWith('/private/tmp/ys/ys-chain-')&&source.endsWith('.mp4'));
assert(destination.startsWith('/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/'+id+'_')&&destination.endsWith('.mp4'));
assert(path.basename(receipt).startsWith(id.toLowerCase().replace('-','')+'-final-delivery-copy-'));
assert(!fs.existsSync(receipt)&&!fs.existsSync(destination),'Never overwrite an existing output or receipt');
const sha=async p=>{const h=createHash('sha256');for await(const b of fs.createReadStream(p))h.update(b);return h.digest('hex');};
assert.equal(await sha(source),expected);const before=fs.statSync(source);assert(before.isFile()&&before.size>1000000);
fs.copyFileSync(source,destination,fs.constants.COPYFILE_EXCL);
const copied=await sha(destination);assert.equal(copied,expected);assert.equal(fs.statSync(destination).size,before.size);
assert.equal(await sha(source),expected);
fs.writeFileSync(receipt,JSON.stringify({episode:id,createdAt:new Date().toISOString(),source,destination,sha256:expected,bytes:before.size,copyMode:'COPYFILE_EXCL',existingOutputOverwritten:false,sourceAndDestinationSha256Match:true,sourceUnchanged:true,mediaContentEdited:false,qualityApprovalInferred:false,earListeningPerformed:false,continuousPlaybackPerformed:false,commitOrPushPerformed:false},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({id,destination,bytes:before.size,sha256:copied,receipt}));
