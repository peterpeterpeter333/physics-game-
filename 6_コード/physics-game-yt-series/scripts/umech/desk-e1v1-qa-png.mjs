// Preserve the unexpected r3 PNG originals; only a new QA cache gets JPEGs.
import fs from 'node:fs';
import sharp from 'sharp';
const base='/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r3',src=base+'/frames',out=base+'/frames-jpg';
fs.mkdirSync(out,{recursive:true});
let count=0;
for(const f of fs.readdirSync(src).filter(f=>/^\d+\.png$/.test(f)).sort()){
 const to=out+'/'+f.replace('.png','.jpg');if(fs.existsSync(to))throw Error('Existing E1 QA image: '+to);
 const meta=await sharp(src+'/'+f).metadata();if(meta.width!==1080||meta.height!==1920)throw Error('Wrong E1 size '+f);
 await sharp(src+'/'+f).jpeg({quality:95}).toFile(to);count++;
}
const anchor=out+'/anchors.json';if(fs.existsSync(anchor))throw Error('Existing E1 QA anchors');fs.copyFileSync(src+'/anchors.json',anchor);
console.log(JSON.stringify({source:src,out,count,sourceUnchanged:true}));
