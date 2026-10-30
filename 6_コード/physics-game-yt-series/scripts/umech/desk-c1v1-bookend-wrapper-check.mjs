// Reviewed r9 physical bookends; only the 0–2s private opening-title timing changes.
import fs from 'node:fs';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const cache='/private/tmp/ys/ys-chain-c1v1',raw=cache+'/blender/trial-r9',privateCache=cache+'/r9-private-title-check',out=privateCache+'/review';
const originalMeta=JSON.parse(fs.readFileSync(raw+'/meta.json'));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(hash(cache+'/blender/data.json')!==originalMeta.sourceSha256[cache+'/blender/data.json'])throw Error('Bookend data changed');
fs.mkdirSync(privateCache+'/blender',{recursive:true});fs.mkdirSync(out,{recursive:true});
function link(s,t){if(fs.existsSync(t)){if(fs.realpathSync(s)!==fs.realpathSync(t))throw Error('Unexpected target '+t);}else fs.symlinkSync(s,t);}
for(const f of ['plan.json','ys-chain-c1v1.json','phrase-times.json'])link(cache+'/'+f,privateCache+'/'+f);
link(cache+'/blender/data.json',privateCache+'/blender/data.json');link(raw,privateCache+'/blender/desk');
const imageHashes=Object.fromEntries(originalMeta.times.map(t=>{const f=raw+'/'+String(Math.round(t*30)).padStart(5,'0')+'.jpg';return [f,hash(f)];}));
process.env.EM_FILM_CACHE=privateCache;
const {vertFrame}=await import('./desk-axes-frame.mjs');
const base=JSON.parse(fs.readFileSync(privateCache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(privateCache+'/ys-chain-c1v1.json'));
const clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const thumbnails=[];
for(const [i,t] of originalMeta.times.entries()){
 const scene=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),file=out+'/'+t+'.png';
 await sharp(Buffer.from(vertFrame(clip,scene,t))).png().toFile(file);
 thumbnails.push({input:await sharp(file).resize(270,480).toBuffer(),left:i%3*270,top:Math.floor(i/3)*480});
}
await sharp({create:{width:810,height:960,channels:3,background:'#f4e8cc'}}).composite(thumbnails).jpeg({quality:95}).toFile(out+'/all6.jpg');
for(const [f,h] of Object.entries(imageHashes))if(hash(f)!==h)throw Error('Raw bookend overwritten '+f);
fs.writeFileSync(out+'/manifest.json',JSON.stringify({...originalMeta,raw,review:out,retainedHistorical3dSources:originalMeta.sourceSha256,privateTitleWrapperSha256:hash(new URL('./desk-axes-frame.mjs',import.meta.url)),rawSha256:imageHashes,currentChange:'private opening title fades 1.5–2.0; r9 3D untouched'},null,1));
console.log(out);
