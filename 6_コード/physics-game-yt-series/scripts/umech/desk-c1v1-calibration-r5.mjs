// C1 camera calibration previews only. The actual candidate JPEG replaces the
// raw desk image; canonical captions, faces and C1 labels remain unchanged.
// These four candidate scenes have no geometry-anchored 2D labels.
import fs from 'node:fs';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const source=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1';
const rev=process.env.C1_CAL_REV??'r5';if(!/^r[56]$/.test(rev))throw Error('Unknown calibration revision');
const dir=source+'/blender/calibration-c1v1-'+rev,manifest=JSON.parse(fs.readFileSync(dir+'/manifest.json'));
const cache=source+'/probe1s-cache',out=source+'/calibration-review-c1v1-'+rev;fs.mkdirSync(out,{recursive:true});
process.env.EM_FILM_CACHE=cache;
process.env.DESK_ALLOW_MISSING='1';
const {vertFrame}=await import('./frame-vert.mjs');
const base=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(cache+'/ys-chain-c1v1.json'));
const clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const records=[];let thumbs=[];
for(const c of manifest.records){
 const t=c.time,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1);
 if(!/^(crowd-|pascal-|meter-focus-|end-|desk-|shishi-|score-)/.test(c.tag))throw Error('Anchored candidate not supported '+c.tag);
 const raw=fs.readFileSync(c.file),encoded=raw.toString('base64').replace(/[NIu]/g,ch=>ch==='N'?'%4E':ch==='I'?'%49':'%75');
 let svg=vertFrame(clip,s,t),count=0;
 svg=svg.replace(/<image x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" href="data:image\/jpeg;base64,[^"]*"\/>/g,()=>{count++;return `<image x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" href="data:image/jpeg;base64,${encoded}"/>`;});
 if(count!==1)throw Error('Expected one raw background, got '+count);
 const file=out+'/'+c.tag+'.jpg';await sharp(Buffer.from(svg)).jpeg({quality:93}).toFile(file);
 records.push({...c,composite:file,rawSha256:createHash('sha256').update(raw).digest('hex')});
 thumbs.push({input:await sharp({create:{width:270,height:504,channels:3,background:'#f4e8cc'}}).composite([{input:await sharp(file).resize(270,480).toBuffer(),left:0,top:24},{input:Buffer.from(`<svg width="270" height="24"><text x="4" y="18" font-family="Arial" font-size="15">${c.tag}</text></svg>`),left:0,top:0}]).jpeg({quality:94}).toBuffer(),left:(records.length-1)%4*270,top:Math.floor((records.length-1)/4)*504});
}
await sharp({create:{width:1080,height:Math.ceil(thumbs.length/4)*504,channels:3,background:'#f4e8cc'}}).composite(thumbs).jpeg({quality:94}).toFile(out+'/all-candidates.jpg');
fs.writeFileSync(out+'/manifest.json',JSON.stringify({...manifest,records,isCalibration:true,notFinalVideo:true},null,1));
console.log(JSON.stringify({out,count:records.length},null,1));
