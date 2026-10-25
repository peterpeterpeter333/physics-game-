import { readFile, readdir, unlink } from 'node:fs/promises';
import { join, parse } from 'node:path';

// Only generated dist assets are pruned. Source videos in public/media remain untouched.
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('src/content/video-delivery.json', root), 'utf8'));
const legacyYouTube=JSON.parse(await readFile(new URL('src/content/legacy-youtube.generated.json',root),'utf8'));
const series=JSON.parse(await readFile(new URL('src/content/b2-series.generated.json',root),'utf8'));
const em=JSON.parse(await readFile(new URL('src/content/em-video-catalog.generated.json',root),'utf8'));
const lessons=JSON.parse(await readFile(new URL('src/content/lesson-video-catalog.generated.json',root),'utf8'));
const revised=JSON.parse(await readFile(new URL('src/content/revised-video-catalog.generated.json',root),'utf8'));
const legacy=JSON.parse(await readFile(new URL('docs/b2-legacy-upload-manifest.json',root),'utf8'));
const hosted=new Set(legacy.map(item=>item.filename));
if (manifest.schema !== 1 || !manifest.videos || Array.isArray(manifest.videos)) throw Error('Invalid video-delivery manifest');
if(!legacyYouTube||typeof legacyYouTube!=='object'||Array.isArray(legacyYouTube))throw Error('Invalid legacy YouTube manifest');
const b2Active=typeof manifest.b2BaseUrl==='string'&&/^https:\/\/[^\s]+\/$/.test(manifest.b2BaseUrl);
if(manifest.b2BaseUrl&&!b2Active)throw Error('Invalid B2 base URL; refusing to prune media');
const ids = [...Object.entries(manifest.videos),...Object.entries(legacyYouTube)];
for (const [mediaId, youtubeId] of ids) {
  if (!/^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+$/.test(mediaId) || typeof youtubeId!=='string' || !/^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) throw Error(`Invalid video mapping: ${mediaId}`);
}
for(const [mediaId,youtubeId] of Object.entries(legacyYouTube)){
  if(Object.hasOwn(manifest.videos,mediaId)&&manifest.videos[mediaId]!==youtubeId)throw Error(`Conflicting video mapping: ${mediaId}`);
}
const youtubeMappings={...manifest.videos,...legacyYouTube};
// A hosted series replaces the old main film only at the same stage and difficulty.
// Keep prerequisites, inserts, and difficulties unless their own mapping (or
// an exact stage/difficulty replacement for main films) has been verified.
const hostedLevels=new Set(series.filter(item=>b2Active||Object.hasOwn(youtubeMappings,`b2-series/${item.id}`)).map(item=>`${item.stageId}:${item.level}`));
const revisions=new Map(revised.map(item=>[item.id,item]));
const replacedMainFiles=new Set([...em,...lessons].filter(item=>hostedLevels.has(`${item.stageId}:${item.level}`)).flatMap(item=>{
  const current=revisions.get(item.id)??item;
  const stem=`${current.mediaDirectory??'em'}/${current.id}`;
  return [`${stem}.mp4`,`${stem}.jpg`];
}));
const mediaRoot = new URL('dist/media/', root);
let removed = 0;
async function visit(directory, relative = '') {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return; throw error; }
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await visit(path, `${relative}${entry.name}/`);
    else if (entry.isFile() && (b2Active&&hosted.has(`${relative}${entry.name}`) || replacedMainFiles.has(`${relative}${entry.name}`) || ['.mp4', '.jpg'].includes(parse(entry.name).ext) && Object.hasOwn(youtubeMappings, `${relative}${parse(entry.name).name}`))) {
      await unlink(path);
      removed++;
    }
  }
}
await visit(mediaRoot.pathname);
console.log(`${b2Active?'B2配信済みのMP4とYouTube配信済みの動画・ポスター':'YouTube配信済みの動画・ポスター'}をdistから${removed}ファイル除外しました。`);
