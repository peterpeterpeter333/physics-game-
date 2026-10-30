// Low-CPU deterministic tests of the actual candidate loop. No Blender,
// libvips rendering, ffmpeg, supplied media or existing caches are touched.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {EventEmitter,once} from 'node:events';
const original=fs.readFileSync(new URL('../render-all-films-gptv2.mjs',import.meta.url),'utf8');
const candidate=fs.readFileSync(new URL('../render-all-films-d1ab-parallel_gpt_20261026.mjs',import.meta.url),'utf8');
const tail='\n child.stdin.end();const [code]=await finished;',lo=original.indexOf(' for(let j=0;j<Math.ceil(clip.duration*fps);j++){'),ln=candidate.indexOf(' // D-1 isolated export candidate: only rasterization is prefetched.'),eo=original.indexOf(tail,lo),en=candidate.indexOf(tail,ln);
assert.ok(lo>0&&ln>0&&eo>lo&&en>ln);assert.equal(original.slice(0,lo),candidate.slice(0,ln));assert.equal(original.slice(eo),candidate.slice(en));
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const fn=new AsyncFunction('clip','fps','frame','sharp','out','FW','FH','child','once','process',candidate.slice(ln,en));
const unhandled=[];process.on('unhandledRejection',error=>unhandled.push(String(error)));
async function test(depth,{rejectFrame=null}={}){
 const calls=[],written=[],thumbnail=[],stdin=new EventEmitter();let active=0,maxActive=0,draining=false;
 const frame=(_c,_s,t)=>{const j=Math.round(t*30);calls.push(j);return String(j);};
 const sharp=(input,options)=>{
  if(options)return {jpeg:()=>({async toFile(file){thumbnail.push({j:Number(input.toString()),file});}})};
  const j=Number(input.toString()),chain={flatten(){return chain;},removeAlpha(){return chain;},raw(){return chain;},toBuffer(){active++;maxActive=Math.max(maxActive,active);return new Promise((resolve,reject)=>setTimeout(()=>{active--;if(j===rejectFrame)reject(Error('synthetic-native-failure-'+j));else resolve(Buffer.from(String(j)));},j%3===0?9:1));}};
  return chain;
 };
 stdin.write=raw=>{assert.equal(draining,false,'No writing before drain');const j=Number(raw.toString());written.push(j);if(j%3===0){draining=true;setTimeout(()=>{draining=false;stdin.emit('drain');},2);return false;}return true;};
 const task=fn({id:'test',duration:37/30,scenes:[{start:0,end:37/30}]},30,frame,sharp,'/not-written',1080,1920,{stdin},once,{env:{D1AB_FRAME_LOOKAHEAD:String(depth)}});
 if(rejectFrame!==null)await assert.rejects(task,new RegExp('synthetic-native-failure-'+rejectFrame));else await task;
 await new Promise(r=>setTimeout(r,15));
 assert.ok(maxActive<=depth);assert.deepEqual(calls,[...calls.keys()]);assert.deepEqual(written,[...written.keys()]);
 if(rejectFrame===null){assert.equal(written.length,37);assert.equal(thumbnail.length,1);assert.equal(thumbnail[0].j,18);}
 else assert.equal(written.length,rejectFrame,'Error propagates at the original frame index.');
 return {depth,rejectFrame,maxActive,svgCalls:calls.length,orderedWrites:written.length,backpressureHandled:true};
}
const results=[];for(const depth of [2,3,4])results.push(await test(depth));results.push(await test(2,{rejectFrame:4}));
assert.deepEqual(unhandled,[]);console.log(JSON.stringify({pass:true,outsideLoopBytesUnchanged:true,ffmpegArgsFpsCrfAudioUnchanged:true,unhandledRejections:0,results},null,2));
