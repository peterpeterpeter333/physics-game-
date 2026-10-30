import {createHash} from 'node:crypto';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {join,relative,sep} from 'node:path';

const root=new URL('../',import.meta.url);
const source=new URL('public/media/',root).pathname;
const files=[];
async function walk(dir){
  for(const item of await readdir(dir,{withFileTypes:true})){
    const path=join(dir,item.name);
    if(item.isDirectory())await walk(path);
    else if(item.isFile()&&item.name.endsWith('.mp4'))files.push(path);
  }
}
await walk(source);
files.sort();
const entries=[];
for(const path of files){
  const filename=relative(source,path).split(sep).join('/');
  const bytes=await readFile(path);
  entries.push({filename,objectKey:`media/2026-10/${filename}`,sha1:createHash('sha1').update(bytes).digest('hex'),size:bytes.length});
}
if(new Set(entries.map(item=>item.objectKey)).size!==entries.length)throw Error('Duplicate legacy object keys');
await writeFile(new URL('docs/b2-legacy-upload-manifest.json',root),JSON.stringify(entries,null,2)+'\n');
await writeFile(new URL('src/content/b2-legacy.generated.json',root),JSON.stringify(entries.map(item=>item.filename.slice(0,-4)),null,2)+'\n');
console.log(`Prepared ${entries.length} legacy videos (${(entries.reduce((sum,item)=>sum+item.size,0)/1024**3).toFixed(2)} GiB).`);
