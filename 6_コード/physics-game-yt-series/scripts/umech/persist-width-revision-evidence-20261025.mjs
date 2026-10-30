// Bounded add-only evidence backup. Explicit roots only, never follows aliases.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const [destination,...sources]=process.argv.slice(2);
const O=process.cwd()+'/outputs/axes-20261023/';
assert(destination&&destination.startsWith(O+'checkpoint-width-')&&!fs.existsSync(destination)&&sources.length);
const allowed='/private/tmp/ys/',selected=[],skipped=[];
function walk(p){
 assert(p.startsWith(allowed)&&!p.includes('/../'));
 const s=fs.lstatSync(p);
 if(s.isSymbolicLink()){skipped.push({path:p,reason:'Symbolic links are never followed'});return;}
 if(s.isDirectory()){for(const n of fs.readdirSync(p).sort())walk(path.join(p,n));return;}
 assert(s.isFile());
 if(!/\.(?:json|jpg|jpeg|png|log|txt|npz)$/.test(p)){skipped.push({path:p,reason:'Not a selected evidence format'});return;}
 selected.push({source:p,bytes:s.size});
}
for(const p of sources)walk(path.resolve(p));
const unique=[...new Map(selected.map(r=>[r.source,r])).values()];
const bytes=unique.reduce((n,r)=>n+r.bytes,0);
assert(unique.length>0&&bytes<=750*1024*1024,'Bounded backup would exceed750MiB; review its explicit sources');
const sha=p=>{const h=createHash('sha256'),fd=fs.openSync(p,'r'),buffer=Buffer.alloc(1048576);let n;try{while((n=fs.readSync(fd,buffer,0,buffer.length,null))>0)h.update(buffer.subarray(0,n));}finally{fs.closeSync(fd);}return h.digest('hex');};
fs.mkdirSync(destination);
const rows=[];
for(const r of unique){
 const file=r.source.slice(allowed.length),to=path.join(destination,file),before=sha(r.source);
 assert(to.startsWith(destination+'/'));
 fs.mkdirSync(path.dirname(to),{recursive:true});
 fs.copyFileSync(r.source,to,fs.constants.COPYFILE_EXCL);
 assert.equal(sha(to),before);assert.equal(sha(r.source),before);
 rows.push({...r,file,sha256:before});
}
fs.writeFileSync(destination+'/manifest.json',JSON.stringify({createdAt:new Date().toISOString(),explicitSources:sources,
 files:rows.length,bytes,symlinkTraversal:false,allCopiesByteIdentical:true,filesManifest:rows,skipped,
 sourceMediaModified:false,qualityApproval:false},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({destination,files:rows.length,bytes,manifestSha256:sha(destination+'/manifest.json')}));
