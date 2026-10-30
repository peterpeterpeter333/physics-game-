import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const W=process.cwd();assert(W.endsWith('/work/physics-game-yt-series'));
const O=W+'/outputs/axes-20261023';
// This exact directory was created exclusively by the interrupted task-owned
// snapshot process (session 85125, exited 130). It was absent beforehand.
const target=O+'/checkpoint-final-bcde-20261025-complete';
assert.equal(path.dirname(target),O);
assert.equal(fs.realpathSync(target),target);
assert(!fs.existsSync(target+'/manifest.json'),'Do not remove a completed archive');
assert.equal(fs.statSync(target+'/cache').isDirectory(),true);
let files=0,bytes=0;
function inspect(dir){for(const name of fs.readdirSync(dir)){
 const p=path.join(dir,name),stat=fs.lstatSync(p);assert(!stat.isSymbolicLink());
 if(stat.isDirectory())inspect(p);else{assert(stat.isFile());files++;bytes+=stat.size;}
}}
inspect(target);
const receipt=O+'/interrupted-task-backup-cleanup-20261025.json';
assert(!fs.existsSync(receipt));
const record={date:new Date().toISOString(),target,files,bytes,
 owner:'Only regular copies created by this task after the exclusive destination-absent check',
 completedManifestAbsent:true,renderAndCopyJobStopped:true,
 reason:'Recursive traversal of old cache aliases produced redundant copies. Replace with a bounded final-evidence-only backup.',
 sourceFilesRemoved:false,finalDownloadsVideosRemoved:false,
 originalUserFilesRemoved:false,partialDuplicateCopiesRecoverableFromSources:true};
fs.writeFileSync(receipt,JSON.stringify(record,null,1)+'\n',{flag:'wx'});
fs.rmSync(target,{recursive:true,force:false});
assert(!fs.existsSync(target));
console.log(JSON.stringify({...record,cleanupReceipt:receipt}));
