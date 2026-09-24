import {readFileSync,writeFileSync,existsSync,mkdirSync,renameSync} from 'node:fs';
import {build} from 'esbuild';
import Module from 'node:module';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {customDiagram,C,text,esc} from './all-film-visuals.mjs';
import {fieldDiagram} from './all-film-fields.mjs';
import {collegeDiagram} from './all-film-college.mjs';
import {equationAt} from './all-film-equations.mjs';
import {detailDiagram} from './all-film-details.mjs';
import {prerequisiteDiagram} from './prerequisite-diagrams.mjs';
import {figureFor,forceExisting} from './all-film-scenes.mjs';
import {revisionSceneDiagram,revisionSceneEquation} from './revision-scene-visuals.mjs';
import {thermalInsertVisual} from './thermal-insert-visuals.mjs';
import {waveInsertVisual} from './wave-insert-visuals.mjs';
import {waveRevisionDiagram} from './wave-revision-visuals.mjs';
import {texBox} from './revision-tex.mjs';
import {circularPilotFrame} from './circular-pilot-visuals.mjs';
import {motionFoundationFrame} from './motion-foundation-visuals.mjs';
import {motionInsertFrame} from './motion-insert-visuals.mjs';
import {uniformAccelerationFrame} from './uniform-acceleration-visuals.mjs';
import {uniformContinuationFrame} from './uniform-continuation-visuals.mjs';
import {freefallFrame} from './freefall-visuals.mjs';
import {projectileFoundationFrame} from './projectile-foundation-visuals.mjs';
import {projectileMiddleFrame} from './projectile-middle-visuals.mjs';
import {additionTheoremFrame} from './addition-theorem-visuals.mjs';
import {projectileAdvancedFrame} from './projectile-advanced-visuals.mjs';
import {forceFrame} from './force-visuals.mjs';
import {workFoundationFrame} from './work-foundation-visuals.mjs';
import {workComponentFrame} from './work-component-visuals.mjs';
import {potentialEnergyFrame} from './potential-energy-visuals.mjs';
import {springEnergyFrame} from './spring-energy-visuals.mjs';
import {momentumFoundationFrame} from './momentum-foundation-visuals.mjs';
import {momentumMiddleFrame} from './momentum-middle-visuals.mjs';
import {momentumAdvancedFrame} from './momentum-advanced-visuals.mjs';
import {radianFoundationFrame} from './radian-foundation-visuals.mjs';
import {circularFoundationFrame} from './circular-foundation-visuals.mjs';
import {shmFoundationFrame} from './shm-foundation-visuals.mjs';
import {shmMiddleFrame} from './shm-middle-visuals.mjs';
import {sineDerivativeFrame} from './sine-derivative-visuals.mjs';
import {foundationAppendixFrame} from './foundation-appendix-visuals.mjs';
import {firstlawFoundationFrame} from './firstlaw-foundation-visuals.mjs';
import {gasWorkFrame} from './gas-work-visuals.mjs';
import {idealGasAdvancedFrame} from './ideal-gas-advanced-visuals.mjs';
import {gasParticleFrame} from './gas-particle-visuals.mjs';
import {moleFoundationFrame} from './mole-foundation-visuals.mjs';
import {idealGasFoundationFrame} from './ideal-gas-foundation-visuals.mjs';
import {gasStateFrame} from './gas-state-visuals.mjs';
import {gasTemperatureFrame} from './gas-temperature-visuals.mjs';
import {gasFoundationFrame} from './gas-foundation-visuals.mjs';
import {heatMeltingFrame} from './heat-melting-visuals.mjs';
import {heatFoundationFrame} from './heat-foundation-visuals.mjs';
import {shmAdvancedFrame} from './shm-advanced-visuals.mjs';
import {sineMotionFrame} from './sine-motion-visuals.mjs';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/physics-all-films',out=process.env.FILM_OUTPUT??'public/media/lessons';
mkdirSync(out,{recursive:true});
const b=await build({entryPoints:['scripts/all-film-source.tsx'],bundle:true,write:false,platform:'node',format:'cjs',packages:'external',loader:{'.css':'empty'}});
const m=new Module(path.resolve('.all-film-source.cjs'));m.paths=Module._nodeModulePaths(process.cwd());m._compile(b.outputFiles[0].text,m.id);
const {figure}=m.exports;
const plan=JSON.parse(readFileSync(`${cache}/plan.json`));
const selected=process.argv.slice(2),[shard,shards]=(process.env.FILM_SHARD??'0/1').split('/').map(Number);
if(!Number.isInteger(shard)||!Number.isInteger(shards)||shard<0||shard>=shards)throw Error('Invalid FILM_SHARD');
const defaultFPS=12;
export function wrap(s,max){const rows=[];let line='',width=0;for(const ch of s){let w=/[\u0020-\u007e]/.test(ch)?.58:1;if(width+w>max&&!/[。、）」]/.test(ch)){rows.push(line);line='';width=0;}line+=ch;width+=w;}if(line)rows.push(line);return rows;}
function formulaText(s,x,y){const parts=s.split(/(_[A-Za-z0-9])/g);return `<text x="${x}" y="${y}" font-size="29" fill="${C.green}">${parts.map(part=>part.startsWith('_')?`<tspan baseline-shift="sub" font-size="20">${esc(part.slice(1))}</tspan>`:esc(part)).join('')}</text>`;}
function frame(c,s,t){
 const work=firstlawFoundationFrame(c,s,t)??gasWorkFrame(c,s,t)??idealGasAdvancedFrame(c,s,t)??gasParticleFrame(c,s,t)??moleFoundationFrame(c,s,t)??idealGasFoundationFrame(c,s,t)??gasStateFrame(c,s,t)??gasTemperatureFrame(c,s,t)??gasFoundationFrame(c,s,t)??heatMeltingFrame(c,s,t)??foundationAppendixFrame(c,s,t)??heatFoundationFrame(c,s,t)??shmAdvancedFrame(c,s,t)??sineMotionFrame(c,s,t)??sineDerivativeFrame(c,s,t)??shmMiddleFrame(c,s,t)??shmFoundationFrame(c,s,t)??circularFoundationFrame(c,s,t)??radianFoundationFrame(c,s,t)??momentumAdvancedFrame(c,s,t)??momentumMiddleFrame(c,s,t)??momentumFoundationFrame(c,s,t)??springEnergyFrame(c,s,t)??potentialEnergyFrame(c,s,t)??workComponentFrame(c,s,t)??workFoundationFrame(c,s,t);if(work)return work;
 const pilot=forceFrame(c,s,t)??projectileAdvancedFrame(c,s,t)??additionTheoremFrame(c,s,t)??projectileMiddleFrame(c,s,t)??projectileFoundationFrame(c,s,t)??freefallFrame(c,s,t)??uniformContinuationFrame(c,s,t)??uniformAccelerationFrame(c,s,t)??motionInsertFrame(c,s,t)??motionFoundationFrame(c,s,t)??circularPilotFrame(c,s,t);if(pilot)return pilot;
 if(c.visualPilot)throw Error(`Unknown authored visual renderer: ${c.visualPilot}`);
 const local=Math.max(0,t-s.start),p=Math.min(1,local/Math.max(1,s.end-s.start-1.2));
 // The two first-law examples follow the spoken sentence, not an arbitrary
 // half-duration boundary (the spoken sentences need not have equal lengths).
 const captionIndex=Math.max(0,s.captions.findLastIndex(x=>x.start<=t));
 const revisionProgress=c.id==='t-firstlaw-intro'&&s.index===3?(captionIndex===0?Math.min(.49,p):Math.max(.5,p)):p;
 const insert=thermalInsertVisual(c,s,t)??waveInsertVisual(c,s,t);
 if(c.renderer==='insert'&&!insert)throw Error(`Insert needs a dedicated storyboard: ${c.id}`);
 const custom=insert?.diagram??waveRevisionDiagram(c,s,p)??revisionSceneDiagram(c,s,revisionProgress)??prerequisiteDiagram(c,s,p)??detailDiagram(c,s,p)??collegeDiagram(c,s,p)??(forceExisting(c)?null:fieldDiagram(c,s,p)??customDiagram(c,s,p));
 let diagram;if(custom)diagram=`<svg x="40" y="100" width="1200" height="440" viewBox="0 0 1000 ${insert?460:400}">${custom}</svg>`;
 else {const id=figureFor(c,s);if(!id)throw Error(`Missing storyboard ${c.id}/${s.index}`);diagram=figure(id,local).replace(/<svg\b[^>]*>/,tag=>tag.replace(/\s(?:width|height|x|y)="[^"]*"/g,'').replace('<svg ','<svg x="40" y="100" width="1200" height="440" '));}
 const caption=s.captions.findLast(x=>x.start<=t)??s.captions[0];
 const captionLines=wrap(caption.text,44);if(captionLines.length>3)throw Error(`Caption overflow ${c.id}/${s.index}`);
 // Unicode equations are rendered into the video, never sent as malformed LaTeX to a remote image service.
 const eqRows=insert?[]:wrap(revisionSceneEquation(c,s,revisionProgress,captionIndex)??equationAt(c,s,p),55);if(eqRows.length>2)throw Error(`Equation overflow ${c.id}/${s.index}`);
 const alpha=Math.min(1,local/1.2);
 const equation=insert?texBox(insert.equation,55,542,1170,70):eqRows.map((row,i)=>formulaText(row,55,570+i*34)).join('');
 const title=wrap(c.title,44);if(title.length>2)throw Error(`Title overflow: ${c.id}`);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="760"><style>text{font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN',sans-serif}</style><rect width="1280" height="760" fill="#0b1122"/>${title.map((v,i)=>text(v,40,38+34*i,29)).join('')}${diagram}<g opacity="${alpha}">${equation}</g><line x1="40" y1="626" x2="1240" y2="626" stroke="#2a3850"/>${captionLines.map((v,i)=>text(v,48,656+29*i,27)).join('')}${text('音声：VOICEVOX Nemo 男声1',40,746,15,C.dim)}${text(`${{intro:'初級',middle:'中級',advanced:'上級'}[c.level]} ${s.index+1}/${c.scenes.length}`,1130,746,17,C.dim)}<rect x="0" y="755" width="${1280*t/c.duration}" height="5" fill="${C.cyan}"/></svg>`;
}
for(const [i,entry] of plan.entries()){
 if(i%shards!==shard||selected.length&&!selected.includes(entry.id))continue;
 const audioJSON=`${cache}/${entry.id}.json`;
 let clip;
 if(existsSync(audioJSON))clip=JSON.parse(readFileSync(audioJSON));
 else if(process.env.FILM_PREFLIGHT){let start=0;const scenes=entry.scenes.map(s=>{const captions=(s.utterances??s.narration.split('。').filter(Boolean).map(v=>({subtitle:v+'。'}))).map((u,k)=>({text:u.subtitle,start:start+k*5,end:start+k*5+5}));const result={...s,start,end:start+captions.length*5,captions};start=result.end;return result;});clip={...entry,duration:start,scenes};}
 else throw Error(`Audio not ready: ${entry.id}`);
 if(!process.env.FILM_PREFLIGHT&&clip.fluencyVersion!=='20260924-fluent-v1')throw Error(`Regenerate audio with the fluency policy before rendering: ${entry.id}`);
 if(!process.env.FILM_PREFLIGHT&&!clip.comparisonMode&&clip.spacingVersion!=='20260924-furigana-spacing-v2')throw Error(`Regenerate normalized-furigana audio: ${entry.id}`);
 const scriptKey=c=>JSON.stringify(c.scenes.map(s=>[s.narration,s.utterances]));
 if(scriptKey(clip)!==scriptKey(entry))throw Error(`Stale audio: ${clip.id}`);
 if(Math.abs(clip.duration-clip.scenes.at(-1).end)>.01)throw Error(`Audio duration mismatch: ${clip.id}`);
 // Current manuscript metadata may change without altering an audio track.
 clip={...clip,...entry,duration:clip.duration,scenes:entry.scenes.map((s,j)=>({...s,start:clip.scenes[j].start,end:clip.scenes[j].end,captions:clip.scenes[j].captions}))};
 clip.mediaDirectory=entry.mediaDirectory??'lessons';
 const fps=clip.visualPilot?30:defaultFPS;
 if(clip.visualPilot)clip.animationFPS=fps;
 const hash=createHash('sha256').update(JSON.stringify(clip));
 // Mid-sentence samples alone cannot detect a changed transition occurring
 // near the start of speech. Include the pilot animator's actual source.
 if(clip.visualPilot==='circular-algebra-v1'){hash.update(readFileSync(new URL('./circular-pilot-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./circular-clarity-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='motion-foundations-v1')hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));
 if(clip.visualPilot==='uniform-acceleration-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./uniform-acceleration-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='uniform-continuation-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./uniform-continuation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='freefall-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./freefall-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='projectile-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./projectile-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='projectile-middle-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./projectile-middle-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='addition-theorem-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./addition-theorem-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='projectile-advanced-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./projectile-advanced-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='force-storyboards-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./force-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='work-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./work-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='work-components-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./work-component-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='potential-energy-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./potential-energy-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='spring-energy-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./spring-energy-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='momentum-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./momentum-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='momentum-middle-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./momentum-middle-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='momentum-advanced-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./momentum-advanced-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='radian-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./radian-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='circular-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./circular-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='shm-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./shm-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='shm-middle-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./shm-middle-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='sine-derivative-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./sine-derivative-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='foundation-appendices-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./foundation-appendix-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='firstlaw-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./firstlaw-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='gas-work-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./gas-work-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='ideal-gas-advanced-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./ideal-gas-advanced-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='gas-particles-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./gas-particle-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='mole-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./mole-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='ideal-gas-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./ideal-gas-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='gas-states-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./gas-state-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='gas-temperature-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./gas-temperature-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='gas-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./gas-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='heat-melting-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./heat-melting-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='heat-foundations-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./heat-foundation-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='shm-advanced-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./shm-advanced-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='sine-motion-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./sine-motion-visuals.mjs',import.meta.url)));}
 if(clip.visualPilot==='motion-inserts-v1'){hash.update(readFileSync(new URL('./motion-foundation-visuals.mjs',import.meta.url)));hash.update(readFileSync(new URL('./motion-insert-visuals.mjs',import.meta.url)));}
 for(const s of clip.scenes)for(const cap of s.captions)hash.update(frame(clip,s,(cap.start+cap.end)/2));
 clip.renderKey=hash.digest('hex');
 if(process.env.FILM_STORYBOARD){
  const dir=process.env.FILM_STORYBOARD;mkdirSync(dir,{recursive:true});
  for(const s of clip.scenes){const svg=frame(clip,s,(s.start+s.end)/2);writeFileSync(`${dir}/${clip.id}-${s.index}.svg`,svg);await sharp(Buffer.from(svg)).png().toFile(`${dir}/${clip.id}-${s.index}.png`);}
 }
 if(process.env.FILM_PREFLIGHT){console.log(`Checked ${clip.id}`);continue;}
 const file=`${out}/${clip.id}.mp4`,meta=`${out}/${clip.id}.json`;
 if(existsSync(file)&&existsSync(meta)&&JSON.parse(readFileSync(meta)).renderKey===clip.renderKey){console.log(`Cached ${clip.id}`);continue;}
 if(!process.env.FFMPEG)throw Error('Set FFMPEG');
 const partial=`${cache}/${clip.id}.rendering.mp4`;
 const child=spawn(process.env.FFMPEG,['-y','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size','1280x760','-framerate',String(fps),'-i','pipe:0','-i',`${cache}/${clip.id}.wav`,'-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-r',String(clip.visualPilot?fps:24),'-c:a','aac','-b:a','96k','-t',String(clip.duration),'-movflags','+faststart',partial],{stdio:['pipe','inherit','inherit']});
 const finished=once(child,'close');child.stdin.on('error',e=>{console.error(e);});
 for(let j=0;j<Math.ceil(clip.duration*fps);j++){
  const t=j/fps,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),svg=frame(clip,s,t);
  const raw=await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).removeAlpha().raw().toBuffer();
  if(j===18)await sharp(raw,{raw:{width:1280,height:760,channels:3}}).jpeg({quality:85}).toFile(`${out}/${clip.id}.jpg`);
  if(!child.stdin.write(raw))await once(child.stdin,'drain');
 }
 child.stdin.end();const [code]=await finished;if(code!==0)throw Error(`Encoding failed ${clip.id}`);
 renameSync(partial,file);writeFileSync(meta,JSON.stringify(clip,null,2));
 console.log(`Rendered ${i+1}/${plan.length} ${clip.id}: ${clip.duration.toFixed(1)}s`);
}
// A separate atomic finalization step avoids racing catalogs when render shards finish.
