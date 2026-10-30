// New A S3 hooks only. Shared frame/overlays remain unchanged on disk.
import {registerHooks} from 'node:module';
import assert from 'node:assert/strict';
import {CACHE,realInput} from './desk-d1a-stage_s3_gpt_20261028.mjs';
const here=new URL('./',import.meta.url).href;
registerHooks({resolve(specifier,context,next){
 if(context.parentURL===here+'frame-vert.mjs'&&specifier==='./desk-frame.mjs')return {url:here+'desk-d1a-deskframe_s3_gpt_20261028.mjs',shortCircuit:true};
 if(context.parentURL===here+'desk-frame.mjs?d1a-s3-real'&&specifier==='./desk-d1v1-overlay.mjs')return {url:here+'desk-d1a-overlay-dispatch_s3_gpt_20261028.mjs',shortCircuit:true};
 return next(specifier,context);
},load(url,context,next){
 const loaded=next(url,context);if(url!==here+'desk-frame.mjs?d1a-s3-real')return loaded;
 assert.equal(process.env.EM_FILM_CACHE,CACHE);assert.notEqual(process.env.DESK_ALLOW_MISSING,'1');
 realInput(process.env.D1A_S3_RAW_DIR??CACHE+'/blender/desk');realInput(process.env.D1A_S3_ANCHORS_FILE??CACHE+'/blender/desk/anchors.json');
 let s=Buffer.from(loaded.source).toString('utf8');
 const replace=(a,b)=>{assert.equal(s.split(a).length,2,'Shared frame source changed: '+a);s=s.replace(a,b);};
 replace("dir=root()+'/desk'","dir=(process.env.D1A_S3_RAW_DIR??root()+'/desk')");
 replace("const f=root()+'/desk/anchors.json'","const f=(process.env.D1A_S3_ANCHORS_FILE??root()+'/desk/anchors.json')");
 replace("ANC=existsSync(f)?JSON.parse(readFileSync(f,'utf8')).anchors:{};","ANC=JSON.parse(readFileSync(f,'utf8'));");
 replace("const a=ANC[name];if(!a)return null;const j=Math.max(0,Math.min(a.length-1,Math.round(t*DFPS)));return a[j];","const j=Math.round(t*DFPS);const points=ANC.anchors?null:ANC[String(j)];if(!ANC.anchors&&!points)throw Error('Missing exact S3 anchor frame '+j);return ANC.anchors?.[name]?.[j]??points?.[name]??null;");
 replace("padStart(5,'0')}.jpg","padStart(5,'0')}.${process.env.D1A_S3_RAW_EXT??'jpg'}");
 replace('href="data:image/jpeg;base64,','href="data:image/${process.env.D1A_S3_RAW_EXT==="png"?"png":"jpeg"};base64,');
 return {...loaded,source:s};
}});
