// C5 private cache + one exact overlay import substitution; shared files stay untouched.
// Preload BEFORE the unchanged S3 hooks/export/caption loader.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
const BASE='/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028';
const CACHE='/private/tmp/ys/ys-chain-d1a_s3_magnifier_gpt_20261028';
assert.equal(process.env.EM_FILM_CACHE,CACHE,'Explicit C5 cache is required');
assert.equal(fs.realpathSync(CACHE),CACHE);assert.equal(fs.lstatSync(CACHE).isSymbolicLink(),false);
const here=new URL('./',import.meta.url).href;
const names=['stage','caption165-loader','cue-review','postrender'];
registerHooks({resolve(specifier,context,next){
 if(context.parentURL===here+'desk-d1a-overlay-dispatch_s3_gpt_20261028.mjs'&&specifier==='./desk-d1a-overlay_s3_gpt_20261028.mjs')return {url:here+'desk-d1a-magnifier-overlay_s3_gpt_20261028.mjs',shortCircuit:true};
 return next(specifier,context);
},load(url,context,next){
 const loaded=next(url,context),name=names.find(n=>url===here+'desk-d1a-'+n+'_s3_gpt_20261028.mjs');if(!name)return loaded;
 const original=Buffer.from(loaded.source).toString('utf8');let source=original;
 const changes=[[BASE,CACHE]];
 if(name==='postrender')changes.push(['outputs/ys-chain-d1a-backup/S3_20261028/cache','outputs/ys-chain-d1a-backup/S3_20261028/magnifier/cache'],["'outputs/ys-chain-d1a-backup/S3_20261028'","'outputs/ys-chain-d1a-backup/S3_20261028/magnifier'"]);
 for(const [from,to] of changes){assert.equal(source.split(from).length,2,'Private S3 helper declaration changed: '+name+' '+from);source=source.replace(from,to);}
 let restored=source;for(const [from,to] of [...changes].reverse())restored=restored.replace(to,from);assert.equal(restored,original,'Only private cache/output path substitutions are permitted');
 return {...loaded,source};
}});
