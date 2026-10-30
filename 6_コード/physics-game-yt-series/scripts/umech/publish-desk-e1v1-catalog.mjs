// Copy only the new, reviewed E-1 images; never replace an existing catalog image.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const ROOT=fileURLToPath(new URL('../../',import.meta.url));
const src=process.env.E1_CATALOG_DIR??'/private/tmp/ys/ys-chain-e1v1/blender/catalog-e1v1';
const dst=ROOT+'docs/video-revision-20260924/deep/部品カタログ画像';
const names=['chart','fleet','ship','observer','southern','dial','torch','arc','log','pendulum','prize'].flatMap(n=>['oblique','top'].map(v=>'e1v1_'+n+'_'+v+'.jpg'));
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const name of names){
 if(!fs.existsSync(src+'/'+name))throw Error('Missing E-1 catalog render: '+name);
 if(fs.existsSync(dst+'/'+name)&&sha(dst+'/'+name)!==sha(src+'/'+name))throw Error('Refuse to replace existing image: '+dst+'/'+name);
}
for(const name of names)if(!fs.existsSync(dst+'/'+name))fs.copyFileSync(src+'/'+name,dst+'/'+name,fs.constants.COPYFILE_EXCL);
console.log(JSON.stringify({images:names.length,destination:dst},null,2));
