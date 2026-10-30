// Exact, local memoization of sharp's real glyph measurements for these four films.
// No estimates, alternate fonts, layout changes, network, or shared-module edits.
import fs from 'node:fs';
import os from 'node:os';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const root='/private/tmp/ys/axes-sharp-ink-width-v1';
fs.mkdirSync(root,{recursive:true});
const runtime=JSON.stringify({platform:os.platform(),release:os.release(),versions:sharp.versions});
const memory=new Map();let active=0;const waiting=[];
async function slot(){if(active>=4)await new Promise(resolve=>waiting.push(resolve));active++;}
function release(){active--;waiting.shift()?.();}
export async function measuredInkWidth(svg,{trim=null,png=true}={}){
 const bytes=Buffer.isBuffer(svg)?svg:Buffer.from(svg);
 const key=createHash('sha256').update(runtime).update(JSON.stringify({trim,png})).update(bytes).digest('hex');
 if(memory.has(key))return memory.get(key);
 const promise=(async()=>{
  const file=root+'/'+key+'.json';
  if(fs.existsSync(file)){const value=JSON.parse(fs.readFileSync(file));if(value.key===key&&Number.isInteger(value.width)&&value.width>0)return value.width;throw Error('Invalid exact metric cache '+file);}
  await slot();let info;
  try{let pipeline=sharp(bytes);pipeline=trim===null?pipeline.trim():pipeline.trim(trim);if(png)pipeline=pipeline.png();({info}=await pipeline.toBuffer({resolveWithObject:true}));}finally{release();}
  if(!Number.isInteger(info.width)||info.width<=0)throw Error('Invalid measured ink width');
  try{fs.writeFileSync(file,JSON.stringify({key,width:info.width}),{flag:'wx'});}catch(error){if(error.code!=='EEXIST')throw error;}
  return info.width;
 })();memory.set(key,promise);return promise;
}
