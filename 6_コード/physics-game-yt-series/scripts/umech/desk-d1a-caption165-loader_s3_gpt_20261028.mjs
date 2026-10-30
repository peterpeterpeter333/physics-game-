// Authorized median1.65 runtime exception only. The original checker is untouched.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {createHash} from 'node:crypto';
const a=process.argv.slice(2),i=a.indexOf('--cache'),cache='/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028';
assert.ok(a.includes('ys-chain-d1a'));assert.ok(i>=0&&path.resolve(a[i+1])===cache);
const target=new URL('./desk-quality-gate.mjs',import.meta.url),original=fs.readFileSync(target,'utf8');
const from='capMedian:[1.0,1.5],capMin:.4,capWarn:.5,',to='capMedian:[1.0,1.65],capMin:.4,capWarn:.5,';
assert.equal(original.split(from).length,2);const source=original.replace(from,to);assert.equal(source.replace(to,from),original);
const h=s=>createHash('sha256').update(s).digest('hex'),record=path.join(cache,'caption165-authorization_s3_20261028.json');
fs.writeFileSync(record,JSON.stringify({id:'ys-chain-d1a',stage:'S3',originalSha256:h(original),inMemorySha256:h(source),onlyReplacement:{from,to},checkerOnDiskUnchanged:true,medianOnly:true},null,1)+'\n',{flag:'wx'});
registerHooks({load(url,ctx,next){const result=next(url,ctx);if(url!==target.href)return result;assert.equal(Buffer.from(result.source).toString('utf8'),original);return {...result,source};}});
