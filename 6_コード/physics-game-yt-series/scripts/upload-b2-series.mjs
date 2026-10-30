import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const root = new URL('../',import.meta.url);
const series = JSON.parse(await readFile(new URL('docs/b2-series-upload-manifest.json',root),'utf8'));
const legacy = JSON.parse(await readFile(new URL('docs/b2-legacy-upload-manifest.json',root),'utf8'));
const seriesOnly = process.argv.includes('--series-only');
const privateStage = process.argv.includes('--private-stage');
const manifest = [...series.map(item=>({...item,sourceGroup:'series'})),...(!seriesOnly?legacy.map(item=>({...item,sourceGroup:'legacy'})):[])];
const source = process.env.PHYSICS_QUEST_SERIES_DIR ?? '/Users/ken/Downloads/physics-quest-youtube';
const upload = process.argv.includes('--upload');
const keyId = process.env.B2_KEY_ID;
const key = process.env.B2_APPLICATION_KEY;
const bucketId = process.env.B2_BUCKET_ID;
const bucketName = process.env.B2_BUCKET_NAME;
if (series.length!==179 || legacy.length<500 || new Set(manifest.map(item=>item.objectKey)).size!==manifest.length) throw Error('Invalid B2 upload manifests');
if (privateStage && !seriesOnly) throw Error('--private-stage requires --series-only');
if (!upload) {
  console.log(`Dry run: ${manifest.length} MP4 files, ${(manifest.reduce((sum,item)=>sum+item.size,0)/1024**3).toFixed(2)} GiB. Add --upload and B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_ID, B2_BUCKET_NAME after reviewing the bucket.`);
  process.exit(0);
}
if (![keyId,key,bucketId,bucketName].every(Boolean)) throw Error('Missing B2 credentials or bucket settings in environment');
if (!/^[a-zA-Z0-9-]+$/.test(bucketName)) throw Error('Invalid bucket name');

async function json(url,options={}) {
  const response=await fetch(url,options);
  const body=await response.json().catch(()=>({}));
  if (!response.ok) throw Error(`${new URL(url).pathname}: HTTP ${response.status} ${body.code??''} ${body.message??''}`);
  return body;
}
const auth=await json('https://api.backblazeb2.com/b2api/v4/b2_authorize_account',{
  headers:{Authorization:`Basic ${Buffer.from(`${keyId}:${key}`).toString('base64')}`},
});
const storage=auth.apiInfo?.storageApi;
if (!storage?.apiUrl || !storage?.downloadUrl || !auth.authorizationToken) throw Error('Incomplete B2 authorization response');
const api=storage.apiUrl,token=auth.authorizationToken;
const allowedBuckets=storage.allowed?.buckets;
if (allowedBuckets?.length && !allowedBuckets.some(item=>item.id===bucketId)) throw Error('Application key is not scoped to the target bucket');
const existing=new Map();
for(const prefix of seriesOnly?['series/2026-10/']:['series/2026-10/','media/2026-10/']){
  let startFileName;
  do {
    const params=new URLSearchParams({bucketId,fileNamePrefix:prefix,maxFileCount:'1000'});
    if(startFileName)params.set('startFileName',startFileName);
    const page=await json(`${api}/b2api/v4/b2_list_file_names?${params}`,{headers:{Authorization:token}});
    for(const file of page.files??[])existing.set(file.fileName,file);
    startFileName=page.nextFileName;
  } while(startFileName);
}

const pending=[];
for(const item of manifest){
  const old=existing.get(item.objectKey);
  if (old?.contentSha1===item.sha1 && Number(old.contentLength)===item.size) continue;
  if (old) throw Error(`Different object already exists: ${item.objectKey}. Refusing to overwrite.`);
  pending.push(item);
}
console.log(`${existing.size} objects found; ${pending.length} to upload.`);
let completed=0;
async function worker(){
  while(pending.length){
    const item=pending.shift();
    const bytes=await readFile(item.sourceGroup==='series'?join(source,item.filename):new URL(`public/media/${item.filename}`,root));
    if (bytes.length!==item.size) throw Error(`Source changed: ${item.filename}`);
    let success=false;
    for(let attempt=1;attempt<=5&&!success;attempt++){
      const endpoint=await json(`${api}/b2api/v4/b2_get_upload_url`,{
        method:'POST',headers:{Authorization:token,'Content-Type':'application/json'},body:JSON.stringify({bucketId}),
      });
      const response=await fetch(endpoint.uploadUrl,{
        method:'POST',headers:{
          Authorization:endpoint.authorizationToken,
          'X-Bz-File-Name':encodeURIComponent(item.objectKey).replace(/%2F/g,'/'),
          'X-Bz-Content-Sha1':item.sha1,
          'Content-Type':'video/mp4',
          'Content-Length':String(bytes.length),
          'X-Bz-Info-b2-cache-control':'public, max-age=31536000, immutable',
        },body:bytes,
      });
      const result=await response.json().catch(()=>({}));
      if(response.ok){
        if(result.fileName!==item.objectKey || result.contentSha1!==item.sha1 || Number(result.contentLength)!==item.size)throw Error(`B2 verification mismatch: ${item.objectKey}`);
        success=true;
      }else if(response.status<500 && response.status!==408 && response.status!==429){
        throw Error(`Upload rejected: ${item.objectKey} HTTP ${response.status} ${result.code??''} ${result.message??''}`);
      }
    }
    if(!success)throw Error(`Upload failed after five attempts: ${item.objectKey}`);
    completed++;
    console.log(`${completed}/${manifest.length} uploaded: ${item.objectKey}`);
  }
}
await Promise.all(Array.from({length:3},worker));
if(privateStage){
  console.log(`Uploaded ${completed}; private staging mode left public playback and app configuration unchanged.`);
  process.exit(0);
}
let verified=0;
const checks=[...manifest];
async function verifyWorker(){
  while(checks.length){
    const item=checks.shift();
    const url=`${storage.downloadUrl}/file/${bucketName}/${item.objectKey}`;
    const response=await fetch(url,{headers:{Range:'bytes=0-1',Origin:'https://peterpeterpeter333.github.io'}});
    if(response.status!==206 || !response.headers.get('content-type')?.startsWith('video/mp4')) throw Error(`Public range playback failed: ${item.objectKey} HTTP ${response.status}`);
    const cors=response.headers.get('access-control-allow-origin');
    if(cors!=='*'&&cors!=='https://peterpeterpeter333.github.io') throw Error(`CORS not configured: ${item.objectKey}`);
    await response.arrayBuffer();
    verified++;
    if(verified%25===0||verified===manifest.length)console.log(`Range/CORS verified: ${verified}/${manifest.length}`);
  }
}
await Promise.all(Array.from({length:6},verifyWorker));
const configPath=new URL('src/content/video-delivery.json',root);
const config=JSON.parse(await readFile(configPath,'utf8'));
config.b2BaseUrl=`${storage.downloadUrl}/file/${bucketName}/`;
await writeFile(configPath,JSON.stringify(config,null,2)+'\n');
console.log(`Uploaded ${completed}; all ${verified} public MP4 URLs verified. B2 playback is now enabled in the local app config.`);
