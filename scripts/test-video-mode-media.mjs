import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=f=>JSON.parse(readFileSync(f));
const main=read('src/content/revised-video-catalog.generated.json');
const inserts=read('src/content/insert-video-catalog.generated.json');
const routes=read('src/content/insert-routes.generated.json');
const pilot=read('docs/video-revision-20260924/pilot-plan.json');
const full=read('docs/video-revision-20260924/full-plan.generated.json');
for(const clip of [...main,...inserts]){
 const expected=clip.revision==='20260924-pilot'?pilot:full;
 const source=expected.find(c=>c.id===clip.id);assert.ok(source);
 assert.equal(clip.title,source.title);
 for(const ext of ['jpg','mp4','json'])assert.ok(existsSync(`public/media/${clip.mediaDirectory}/${clip.id}.${ext}`));
 for(let i=0;i<clip.scenes.length;i++){
  const s=clip.scenes[i];assert.equal(s.narration,source.scenes[i].narration);
  assert.equal(s.captions.map(c=>c.text).join(''),s.narration);
  if(s.utterances){assert.equal(s.utterances.map(p=>p.subtitle).join(''),s.narration);assert.equal(s.utterances.length,s.captions.length);}
  for(const p of s.utterances??[]){assert.equal(p.subtitle.split('。').filter(Boolean).length,1);if(p.reading!=null){assert.equal(p.reading.split('。').filter(Boolean).length,1);assert.ok(!/電場|磁場|電気束|磁束|上向き|下向き|法線|一様|時定数|数密度/.test(p.reading),p.reading);}}
  // An unbraced math font command consumes one token, not everything up to
  // the next closing brace (which may belong to a valid Japanese \\text).
  for(const eq of s.equations??[]){assert.ok(!/\\(?:rm|mathrm)\s*(?:\{[^}]*[一-龠ぁ-んァ-ヶ]|[一-龠ぁ-んァ-ヶ])/.test(eq),eq);}
 }
}
for(const [id,entries]of Object.entries(routes)){const clip=main.find(c=>c.id===id);assert.ok(clip);for(const route of entries){assert.ok(route.afterScene>=0&&route.afterScene<=clip.scenes.length);for(const insert of route.inserts)assert.ok(inserts.some(c=>c.id===insert));}}
console.log(`PASS: ${main.length} revised main + ${inserts.length} inserts; exact scripts, paired readings, captions, files, and route references.`);
