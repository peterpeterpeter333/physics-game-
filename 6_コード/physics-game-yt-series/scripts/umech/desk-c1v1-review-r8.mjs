// C1 critical eight-frame check, actual 3D JPEG + canonical complete overlay.
import fs from 'node:fs';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const rev=process.env.C1_TRIAL_REV??'r8';if(!/^r(?:[89]|10)$/.test(rev))throw Error('Unknown critical revision');
const source='/private/tmp/ys/ys-chain-c1v1',raw=source+'/blender/trial-'+rev,cache=source+'/'+rev+'-preflight',out=cache+'/review';
const meta=JSON.parse(fs.readFileSync(raw+'/meta.json'));
for(const [f,h] of Object.entries(meta.sourceSha256))if(createHash('sha256').update(fs.readFileSync(f)).digest('hex')!==h)throw Error('Source changed '+f);
fs.mkdirSync(cache+'/blender',{recursive:true});fs.mkdirSync(out,{recursive:true});
function link(s,t){if(fs.existsSync(t)){if(fs.realpathSync(t)!==fs.realpathSync(s))throw Error('Unexpected link '+t);}else fs.symlinkSync(s,t);}
for(const f of ['plan.json','ys-chain-c1v1.json','phrase-times.json'])link(source+'/'+f,cache+'/'+f);
link(source+'/blender/data.json',cache+'/blender/data.json');link(raw,cache+'/blender/desk');process.env.EM_FILM_CACHE=cache;
const {vertFrame}=await import('./desk-axes-frame.mjs');
const base=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(cache+'/ys-chain-c1v1.json'));
const clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const thumbs=[];
for(const [i,t] of meta.times.entries()){
 const scene=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),file=out+'/'+t+'.png',svg=vertFrame(clip,scene,t);
 if(/NaN|Infinity|undefined/.test(svg))throw Error('Invalid frame '+t);
 await sharp(Buffer.from(svg)).png().toFile(file);
 thumbs.push({input:await sharp({create:{width:270,height:504,channels:3,background:'#f4e8cc'}}).composite([{input:await sharp(file).resize(270,480).toBuffer(),left:0,top:24},{input:Buffer.from(`<svg width="270" height="24"><text x="5" y="18" font-family="Arial" font-size="16">C1 ${rev} ${t}s</text></svg>`),left:0,top:0}]).jpeg({quality:95}).toBuffer(),left:i%4*270,top:Math.floor(i/4)*504});
}
await sharp({create:{width:1080,height:Math.ceil(meta.times.length/4)*504,channels:3,background:'#f4e8cc'}}).composite(thumbs).jpeg({quality:95}).toFile(out+'/all'+meta.times.length+'.jpg');
fs.writeFileSync(out+'/manifest.json',JSON.stringify({...meta,raw,review:out},null,1));console.log('C1 '+rev+' actual '+meta.times.length+' composites: '+out);
