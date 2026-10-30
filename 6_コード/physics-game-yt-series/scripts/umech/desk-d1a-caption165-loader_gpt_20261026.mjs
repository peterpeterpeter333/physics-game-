// Copy for D-1 前編 (ys-chain-d1a), Claude 2026-10-26: the same 1.65 s median limit the user authorized for the other four, applied as the caller instructed.
// The existing inspection file on disk remains byte-identical. No other limit changes.
import {registerHooks} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const allowed=new Set(['ys-chain-d1a']);
const args=process.argv.slice(2),valued=new Set(['--mp4','--cache','--ref','--md','--script']);
const id=args.find((a,i)=>!a.startsWith('--')&&!(i&&valued.has(args[i-1])));
if(!allowed.has(id))throw Error('1.65-second exception copy is only for ys-chain-d1a');
const target=new URL('./desk-quality-gate.mjs',import.meta.url),original=fs.readFileSync(target,'utf8');
const marker='capMedian:[1.0,1.5],capMin:.4,capWarn:.5,';
const replacement='capMedian:[1.0,1.65],capMin:.4,capWarn:.5,';
assert.equal(original.split(marker).length,2,'Original inspection threshold changed; manual review required');
const transformed=original.replace(marker,replacement);
assert.equal(transformed.replace(replacement,marker),original);
const hash=s=>createHash('sha256').update(s).digest('hex');
const i=args.indexOf('--cache'),cache=i>=0?path.resolve(args[i+1]):'/private/tmp/ys/'+id+'_gpt_20261026';
fs.mkdirSync(cache,{recursive:true});
fs.writeFileSync(path.join(cache,'caption165-authorization.json'),JSON.stringify({id,authorizedBy:'caller instruction 2026-10-26 (same limit as the user-authorized B-1/C-1/D-1/E-1)',date:'2026-10-26',originalSource:fileURLToPath(target),originalSha256:hash(original),inMemorySha256:hash(transformed),onlyReplacement:{from:marker,to:replacement},originalFileUnchanged:true},null,2));
registerHooks({load(url,context,nextLoad){
 const loaded=nextLoad(url,context);
 if(url!==target.href)return loaded;
 const source=Buffer.isBuffer(loaded.source)||loaded.source instanceof Uint8Array?Buffer.from(loaded.source).toString('utf8'):String(loaded.source);
 assert.equal(source,original,'Unexpected loader input');
 console.log('Authorized caption median upper limit: 1.65 s for '+id+'; existing file unchanged.');
 return {...loaded,source:transformed};
}});


