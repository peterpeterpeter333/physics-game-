// New S3 hooks only. Existing registered hooks and files remain untouched.
import {registerHooks} from 'node:module';
const here=new URL('./',import.meta.url).href;
registerHooks({resolve(specifier,context,next){
 if(context.parentURL===here+'frame-vert.mjs'&&specifier==='./desk-frame.mjs')return {url:here+'desk-d1b-deskframe_s3_20261026.mjs',shortCircuit:true};
 if(context.parentURL===here+'desk-frame.mjs?d1b-s3-real'&&specifier==='./desk-d1v1-overlay.mjs')return {url:here+'desk-d1b-overlay-dispatch_s3_20261026.mjs',shortCircuit:true};
 return next(specifier,context);
},load(url,context,next){
 const loaded=next(url,context);if(url!==here+'desk-frame.mjs?d1b-s3-real')return loaded;
 let source=Buffer.from(loaded.source).toString('utf8');
 const replace=(a,b)=>{if(source.split(a).length!==2)throw Error('Original frame loader changed: '+a);source=source.replace(a,b);};
 // Only path/MIME selection is adapted in RAM. Original composition stays on disk unchanged.
 replace("dir=root()+'/desk'","dir=(process.env.D1B_S3_RAW_DIR??root()+'/desk')");
 replace("const f=root()+'/desk/anchors.json'","const f=(process.env.D1B_S3_ANCHORS_FILE??root()+'/desk/anchors.json')");
 replace("padStart(5,'0')}.jpg","padStart(5,'0')}.${process.env.D1B_S3_RAW_EXT??'jpg'}");
 replace('href="data:image/jpeg;base64,','href="data:image/${process.env.D1B_S3_RAW_EXT==="png"?"png":"jpeg"};base64,');
 return {...loaded,source};
}});
