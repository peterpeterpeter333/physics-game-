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
  for(const [j,p]of (s.utterances??[]).entries()){
   const sentences=p.subtitle.split('。').filter(Boolean).length;
   if(['motion-foundations-v1','motion-inserts-v1','uniform-acceleration-v1','uniform-continuation-v1','freefall-v1','projectile-foundations-v1','projectile-middle-v1','addition-theorem-v1','projectile-advanced-v1','force-storyboards-v1','work-foundations-v1','work-components-v1','potential-energy-v1','spring-energy-v1','momentum-foundations-v1','momentum-middle-v1','momentum-advanced-v1','radian-foundations-v1','circular-foundations-v1','shm-foundations-v1','shm-middle-v1','sine-derivative-v1','sine-motion-v1','shm-advanced-v1','heat-foundations-v1','foundation-appendices-v1','heat-melting-v1','gas-foundations-v1','gas-temperature-v1','gas-states-v1','ideal-gas-foundations-v1','mole-foundations-v1','gas-particles-v1','ideal-gas-advanced-v1','gas-work-v1','firstlaw-foundations-v1','heat-cycle-v1','wave-foundations-v1','wave-speed-v1','traveling-wave-v1','wave-superposition-v1','sound-foundations-v1','sound-boundaries-v1','sound-beats-v1','doppler-source-v1','doppler-observer-v1','light-foundations-v1'].includes(clip.visualPilot)){
    // A deliberate visual cue may contain two short sentences with one focus.
    // Keep it synchronized as one synthesized utterance, never split by timer.
    assert.ok(sentences>=1&&sentences<=2);
    assert.equal(s.cues[j].subtitle,p.subtitle);assert.equal(s.cues[j].reading,p.reading);
    assert.ok(['diagram','equation'].includes(s.cues[j].display));
   }else assert.equal(sentences,1);
   if(p.reading!=null){assert.equal(p.reading.split('。').filter(Boolean).length,sentences);assert.ok(!/電場|磁場|電気束|磁束|上向き|下向き|法線|一様|時定数|数密度/.test(p.reading),p.reading);}
  }
  // An unbraced math font command consumes one token, not everything up to
  // the next closing brace (which may belong to a valid Japanese \\text).
  for(const eq of s.equations??[]){assert.ok(!/\\(?:rm|mathrm)\s*(?:\{[^}]*[一-龠ぁ-んァ-ヶ]|[一-龠ぁ-んァ-ヶ])/.test(eq),eq);}
 }
}
for(const [id,entries]of Object.entries(routes)){const clip=main.find(c=>c.id===id);assert.ok(clip);for(const route of entries){assert.ok(route.afterScene>=0&&route.afterScene<=clip.scenes.length);for(const insert of route.inserts)assert.ok(inserts.some(c=>c.id===insert));}}
console.log(`PASS: ${main.length} revised main + ${inserts.length} inserts; exact scripts, paired readings, captions, files, and route references.`);
