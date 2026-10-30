// Part A S2 only: exact half-size raw frames and sparse logical1080px anchors.
// Original frame/overlay sources remain unchanged on disk. No render/export here.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {registerHooks} from 'node:module';
const here=new URL('./',import.meta.url).href;
const cache='/private/tmp/ys/ys-chain-d1a_s2_gpt_20261028';
registerHooks({resolve(specifier,context,next){
 if(context.parentURL===here+'frame-vert.mjs'&&specifier==='./desk-frame.mjs')return {url:here+'desk-d1a-deskframe_s2_gpt_20261028.mjs',shortCircuit:true};
 if(context.parentURL===here+'desk-frame.mjs?d1a-s2-real'&&specifier==='./desk-d1v1-overlay.mjs')return {url:here+'desk-d1a-overlay-dispatch_s2_gpt_20261028.mjs',shortCircuit:true};
 return next(specifier,context);
},load(url,context,next){
 const loaded=next(url,context);if(url!==here+'desk-frame.mjs?d1a-s2-real')return loaded;
 assert.equal(process.env.EM_FILM_CACHE,cache,'Use only the new A S2 cache');
 assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','No nearby-frame substitution');
 for(const file of [process.env.D1A_S2_RAW_DIR,process.env.D1A_S2_ANCHORS_FILE]){
  assert.ok(file&&path.resolve(file).startsWith(cache+'/storyboard/'),'Only new A S2 storyboard inputs are allowed');
  assert.equal(fs.realpathSync(file),path.resolve(file),'No symlinked S2 raw or anchors');
  for(let p=path.resolve(file);p!==cache;p=path.dirname(p))assert.equal(fs.lstatSync(p).isSymbolicLink(),false,'No symlink in S2 input path');
 }
 let source=Buffer.from(loaded.source).toString('utf8');
 const replace=(a,b)=>{assert.equal(source.split(a).length,2,'Shared frame loader changed: '+a);source=source.replace(a,b);};
 replace("dir=root()+'/desk'","dir=process.env.D1A_S2_RAW_DIR");
 const old="if(ANC===null){const f=root()+'/desk/anchors.json';ANC=existsSync(f)?JSON.parse(readFileSync(f,'utf8')).anchors:{};}\n const a=ANC[name];if(!a)return null;const j=Math.max(0,Math.min(a.length-1,Math.round(t*DFPS)));return a[j];";
 const fresh="if(ANC===null)ANC=JSON.parse(readFileSync(process.env.D1A_S2_ANCHORS_FILE,'utf8'));\n const j=Math.round(t*DFPS),points=ANC[String(j)];if(!points)throw Error('A S2 exact anchors missing at frame '+j);return points[name]??null;";
 replace(old,fresh);
 return {...loaded,source};
}});
