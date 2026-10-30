import {createHash} from 'node:crypto';
import {readFile, readdir, writeFile} from 'node:fs/promises';
import {basename, join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {build} from 'esbuild';

const root = new URL('../', import.meta.url);
const source = process.env.PHYSICS_QUEST_SERIES_DIR ?? '/Users/ken/Downloads/physics-quest-youtube';
const ffmpeg = process.env.FFMPEG ?? '/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const bundle = await build({entryPoints:[new URL('src/content/university-curriculum.ts', root).pathname],bundle:true,write:false,platform:'node',format:'esm'});
const {universityCurriculum} = await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
if (universityCurriculum.length !== 29) throw Error('Expected 29 university topics');

const names = (await readdir(source)).filter(name=>/^[123]_.+\.mp4$/.test(name)).sort((a,b)=>a.localeCompare(b,'ja'));
if (names.length !== 179) throw Error(`Expected 179 top-level MP4 files, found ${names.length}`);
const entries = [];
for (const filename of names) {
  const match = filename.match(/^([123])_[^_]+_(\d{2})_([^_]+)_(\d+)_(.+)\.mp4$/);
  if (!match) throw Error(`Unrecognized filename: ${filename}`);
  const [,number,indexString,,partString,title] = match;
  const index = Number(indexString)-1, part = Number(partString);
  const topic = universityCurriculum[index];
  if (!topic || !Number.isInteger(part) || part < 1) throw Error(`Invalid topic or part: ${filename}`);
  const level = {1:'intro',2:'middle',3:'advanced'}[number];
  const stageId = level==='advanced' ? topic.id : topic[level].id;
  const objectKey = `series/2026-10/${level}/${stageId}/${String(part).padStart(2,'0')}.mp4`;
  const bytes = await readFile(join(source,filename));
  const sha1 = createHash('sha1').update(bytes).digest('hex');
  const probe = spawnSync(ffmpeg,['-hide_banner','-i',join(source,filename)],{encoding:'utf8',maxBuffer:1024*1024});
  const duration = probe.stderr?.match(/Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!duration) throw Error(`Could not read duration: ${filename}`);
  entries.push({id:`b2-${level}-${stageId}-${part}`,stageId,level,title,part,duration:Number(duration[1])*3600+Number(duration[2])*60+Number(duration[3]),objectKey,filename,sha1,size:bytes.length});
}
const keys = entries.map(entry=>entry.objectKey);
if (new Set(keys).size !== keys.length) throw Error('Duplicate B2 object keys');
for (const level of ['intro','middle','advanced']) {
  const count = entries.filter(entry=>entry.level===level).length;
  const expected = {intro:49,middle:61,advanced:69}[level];
  if (count !== expected) throw Error(`${level}: expected ${expected}, found ${count}`);
  for (const topic of universityCurriculum) {
    const stageId = level==='advanced' ? topic.id : topic[level].id;
    const parts = entries.filter(entry=>entry.stageId===stageId && entry.level===level).map(entry=>entry.part).sort((a,b)=>a-b);
    if (!parts.length || parts.some((part,index)=>part!==index+1)) throw Error(`${stageId}: missing or duplicate parts`);
  }
}
const app = entries.map(({id,stageId,level,title,part,duration,objectKey})=>({id,stageId,level,title,part,duration,objectKey}));
await writeFile(new URL('src/content/b2-series.generated.json',root),JSON.stringify(app,null,2)+'\n');
await writeFile(new URL('docs/b2-series-upload-manifest.json',root),JSON.stringify(entries,null,2)+'\n');
console.log(`Prepared ${entries.length} videos (${(entries.reduce((sum,item)=>sum+item.size,0)/1024**3).toFixed(2)} GiB) from ${basename(source)}.`);
