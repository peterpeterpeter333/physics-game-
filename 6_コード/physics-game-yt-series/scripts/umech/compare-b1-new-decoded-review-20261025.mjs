import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

// Read-only identity comparison. This script never creates human review or approval.
const [aggregatePath, newManifestPath] = process.argv.slice(2);
if (!aggregatePath || !newManifestPath) throw new Error('Usage: node compare-b1-new-decoded-review-20261025.mjs AGGREGATE_JSON NEW_ACTUAL_DECODE_MANIFEST_JSON');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const a=read(aggregatePath), m=read(newManifestPath);
if(a.semanticLimits?.finalAcceptance!==false)throw new Error('Expected explicitly non-final aggregate');
const old = new Map(a.frameRecords.map(f=>[f.frame,f]));
if(old.size!==1162)throw new Error('Expected original1162 attribution records');
const videoFile = typeof m.video==='string'?m.video:m.video?.file||m.video?.path;
const videoHash = m.videoSha256||m.video?.sha256;
if(!videoFile||!videoHash||hash(videoFile)!==videoHash)throw new Error('New manifest MP4 binding does not match actual file');
const incoming=new Map();
function add(f,group){
 if(!Number.isInteger(f?.frame)||!f.sha256||!f.file)return;
 if(incoming.has(f.frame)){
  const x=incoming.get(f.frame);
  if(x.sha256!==f.sha256||x.file!==f.file)throw new Error('Conflicting incoming frame '+f.frame);
  x.groups.push(group);return;
 }
 incoming.set(f.frame,{frame:f.frame,file:f.file,sha256:f.sha256,groups:[group]});
}
if(Array.isArray(m.frames))for(const f of m.frames)add(f,'frames');
for(const[k,v]of Object.entries(m))if(v&&Array.isArray(v.frames))for(const f of v.frames)add(f,k);
if(incoming.size===0)throw new Error('No actual decoded frame records in new manifest');
const knownBad=new Set(a.outstanding.requiredRepairPending.flatMap(x=>x.knownAffectedReviewedFrames||[]));
const exact=[],unapproved=[];
for(const f of [...incoming.values()].sort((x,y)=>x.frame-y.frame)){
 const actualSha=hash(f.file);
 if(actualSha!==f.sha256)throw new Error('Incoming decoded JPEG differs from its manifest: '+f.frame);
 const prev=old.get(f.frame);
 const same=!!prev&&prev.sha256===actualSha;
 const item={frame:f.frame,file:f.file,sha256:actualSha,groups:f.groups,oldSha256:prev?.sha256??null,oldWitnesses:prev?.witnesses??[],sameFileRealpathAsOld:prev?fs.realpathSync(f.file)===fs.realpathSync(prev.jpegFile):false};
 if(knownBad.has(f.frame)){
  unapproved.push({...item,reason:same?'KNOWN_BAD_OLD_STATE_STILL_BYTE_IDENTICAL':'KNOWN_REPAIR_FRAME_CHANGED_REQUIRES_NEW_PERSONAL_EYES',status:'UNAPPROVED'});
 }else if(!prev){
  unapproved.push({...item,reason:'FRAME_NOT_IN_ORIGINAL_REVIEWED1162',status:'UNAPPROVED'});
 }else if(!same){
  unapproved.push({...item,reason:'ACTUAL_DECODED_JPEG_SHA_CHANGED_REQUIRES_NEW_PERSONAL_EYES',status:'UNAPPROVED'});
 }else{
  exact.push({...item,mechanicalIdentityEligibleForExistingAttributionOnly:true,provenanceAndReviewScopeStillNeedHumanCheck:true});
 }
}
const byViewer={};
for(const f of exact)for(const w of f.oldWitnesses)byViewer[w.actualViewer]=(byViewer[w.actualViewer]||0)+1;
console.log(JSON.stringify({
 schemaVersion:1,id:'B-1-new-decoded-JPEG-identity-comparison-only',createdAt:new Date().toISOString(),
 utility:{file:fs.realpathSync(new URL(import.meta.url)),sha256:hash(fs.realpathSync(new URL(import.meta.url)))},
 aggregate:{file:path.resolve(aggregatePath),sha256:hash(aggregatePath)},
 incomingManifest:{file:path.resolve(newManifestPath),sha256:hash(newManifestPath)},
 incomingVideo:{file:videoFile,sha256:videoHash,actualShaVerified:true,sameEncodedMovieAsOriginal:videoHash===a.video.sha256},
 counts:{incomingUniqueFrames:incoming.size,mechanicallyExactNotKnownBad:exact.length,unapprovedUnknownChangedOrKnownBad:unapproved.length,original1162NotPresentInIncoming:[...old.keys()].filter(f=>!incoming.has(f)).length},
 priorAttributionCounts:byViewer,
 exactMatches:exact,
 unapproved,
 originalFramesMissingFromNewManifest:[...old.keys()].filter(f=>!incoming.has(f)),
 knownRepairStatusCopiedUnchanged:a.outstanding.requiredRepairPending,
 claims:{newPersonalEyesPerformed:false,newEarListeningPerformed:false,newDecodePerformed:false,newRenderingPerformed:false,sourceEdits:false,finalAcceptance:false},
 caveats:[
  'Byte equality can reuse only the specifically attributed old visual sample review; it is not new personal viewing.',
  'This utility independently hashes the supplied MP4 and JPEGs but cannot prove their decoding provenance from filenames or copied manifests. Establish actual new decoding separately.',
  'Known bad B7 old frames are never approved by identity. Changed or previously unseen frames remain explicitly unapproved.',
  'Exact matches, including zero unknown differences, do not automatically satisfy canonical timing, audio, whole-film motion, or final acceptance.'
 ]
},null,2));

