/** Deterministic SVG lessons -> H.264/AAC movies; no browser capture or remote service. */
import {loadSource} from './build-em-film-plan.mjs';
import {readFileSync,existsSync,mkdirSync,writeFileSync,renameSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import path from 'node:path';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {spokenEquation} from './em-film-equations.mjs';
import {repairedDiagram,diagramClock} from './em-film-visuals.mjs';
import {pilotDiagram,pilotEquation} from './video-mode-pilot-visuals.mjs';
import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js';
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/physics-em-films';
const out=path.resolve(process.env.EM_FILM_OUTPUT??'public/media/em');mkdirSync(out,{recursive:true});
const ffmpeg=process.env.FFMPEG;if(!ffmpeg)throw Error('Set FFMPEG to an ffmpeg executable');
const {stages,diagram}=await loadSource();
const plan=JSON.parse(readFileSync(path.join(cache,'plan.json')));
const repairScope=JSON.parse(readFileSync('scripts/em-video-repair-scope.json'));
const selected=process.argv.slice(2);const fps=12;
const shard=(process.env.EM_FILM_SHARD??'0/1').split('/').map(Number);
if(shard.length!==2||!shard.every(Number.isInteger)||shard[1]<1||shard[0]<0||shard[0]>=shard[1])throw Error('Invalid EM_FILM_SHARD');
const a=liteAdaptor();RegisterHTMLHandler(a);
const math=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function lines(s,max){const output=[];let row='',width=0;for(const ch of s){const n=/[\u0020-\u007e]/.test(ch)?.58:1;if(width+n>max&&!/[。、，）」』]/.test(ch)){output.push(row);row='';width=0;}row+=ch;width+=n;}if(row)output.push(row);return output;}
const text=(s,x,y,size=26,color='#eef4ff')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}">${esc(s)}</text>`;
const texCache=new Map();
function equation(tex){
 if(texCache.has(tex))return texCache.get(tex);
 let svg=a.outerHTML(a.firstChild(math.convert(tex.replaceAll('\\oiint',String.raw`\mathop{\unicode{x222F}}`),{display:true})));
 if(/data-mjx-error|data-mml-node="merror"|fill="red"/.test(svg))throw Error(`Invalid TeX: ${tex}`);
 const view=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
 const height=Math.min(62,1150*view[3]/view[2]),width=height*view[2]/view[3];
 svg=svg.replace(/width="[^"]+"/,`width="${width}"`).replace(/height="[^"]+"/,`height="${height}"`).replaceAll('currentColor','#8aebc1').replace('<svg ',`<svg x="${(1280-width)/2}" y="${550+(62-height)/2}" `);
 texCache.set(tex,svg);return svg;
}
function frame(clip,scene,step,t){
 const local=t-scene.start;
 // During the short inter-sentence gap retain the sentence just spoken, not the last one.
 const captionIndex=Math.max(0,scene.captions.findLastIndex(c=>c.start<=t));
 const active=scene.captions[captionIndex];
 let {svg}=diagram(step,diagramClock(step,local,captionIndex));
 svg=repairedDiagram(clip,scene,local,captionIndex)??svg;
 if(clip.revision){svg=pilotDiagram(clip,scene,local,captionIndex)??svg;svg=svg.replaceAll('>小片<','>小さな面<');}
 // Preserve the entire diagram and its axis/quantity labels, including non-square 3D frames.
 svg=svg.replace(/<svg\b[^>]*>/,tag=>tag.replace(/\s(?:width|height|x|y)="[^"]*"/g,'').replace('<svg ', '<svg x="40" y="108" width="1200" height="430" '));
 const repair=repairScope[clip.stageId]?.includes(scene.index+1);
 const oldFormulae=scene.equations.length<=3?scene.equations:[scene.equations[0],scene.equations[Math.floor((scene.equations.length-1)/2)],scene.equations.at(-1)];
 const formula=pilotEquation(clip,scene,captionIndex)??(clip.id.startsWith('ue-why-')?scene.equations[0]:repair?spokenEquation(clip,scene,captionIndex):oldFormulae[Math.min(oldFormulae.length-1,Math.floor(local/(scene.end-scene.start)*oldFormulae.length))]);
 const eq=formula?equation(formula):'';
 const captionLines=lines(active.text,clip.revision?38:44);
 if(captionLines.length>3)throw Error(`Caption would be truncated: ${clip.id}/${scene.index}: ${active.text}`);
 const caption=captionLines.map((s,i)=>text(s,48,648+i*29,27)).join('');
 const level={intro:'初級',middle:'中級',advanced:'上級'}[clip.level];
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="760" viewBox="0 0 1280 760"><style>text{font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN',sans-serif} .field-arrow{opacity:1}</style><rect width="1280" height="760" fill="#0b1122"/>${text(`PHYSICS QUEST ／ 大学電磁気・${level}`,40,30,18,'#a7b7d3')}${lines(clip.title,47).slice(0,2).map((s,i)=>text(s,40,65+i*30,28)).join('')}${svg}${eq}<line x1="40" y1="626" x2="1240" y2="626" stroke="#2a3850"/>${caption}${text('音声：VOICEVOX Nemo 男声1',40,746,15,'#a7b7d3')}${text(`${clip.scenes.indexOf(scene)+1} / ${clip.scenes.length}`,1170,746,17,'#a7b7d3')}<rect x="0" y="755" height="5" width="${1280*t/clip.duration}" fill="#62d7ff"/></svg>`;
}
for(const entry of plan){
 if(plan.indexOf(entry)%shard[1]!==shard[0])continue;
 if(selected.length&&!selected.includes(entry.id))continue;
 const json=path.join(cache,`${entry.id}.json`);
 if(!existsSync(json))throw Error(`Audio not ready: ${entry.id}`);
 const clip=JSON.parse(readFileSync(json));
 const scriptKey=c=>JSON.stringify(c.scenes.map(s=>[s.narration,s.utterances]));
 if(scriptKey(clip)!==scriptKey(entry))throw Error(`Updated audio not ready: ${entry.id}`);
 clip.title=entry.title;
 const file=path.join(out,`${clip.id}.mp4`);
 const saved=path.join(out,`${clip.id}.json`);
 const stage=stages.find(s=>s.id===clip.stageId);
 // Fingerprint actual output samples, including diagram text, equations and timing.
 const hash=createHash('sha256').update(JSON.stringify(clip));
 for(const s of clip.scenes)for(const c of s.captions)hash.update(frame(clip,s,stage.steps[s.index],(c.start+c.end)/2));
 clip.renderKey=hash.digest('hex');
 if(process.env.EM_FILM_PREFLIGHT){console.log(`Checked ${clip.id}`);continue;}
 if(existsSync(file)&&existsSync(saved)&&JSON.parse(readFileSync(saved)).renderKey===clip.renderKey&&!process.env.EM_FILM_FORCE){console.log(`Existing: ${clip.id}`);continue;}
 const partial=path.join(cache,`${clip.id}.rendering.mp4`);
 const child=spawn(ffmpeg,['-y','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size','1280x760','-framerate',String(fps),'-i','pipe:0','-i',path.join(cache,`${clip.id}.wav`),'-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-r','24','-c:a','aac','-b:a','96k','-t',String(clip.duration),'-movflags','+faststart',partial],{stdio:['pipe','inherit','inherit']});
 const completed=once(child,'close');let count=0;
 for(let i=0;i<Math.ceil(clip.duration*fps);i++){
  const t=i/fps,scene=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1);
  const svg=frame(clip,scene,stage.steps[scene.index],t);
  const raw=await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).removeAlpha().raw().toBuffer();
  if(i===12)await sharp(raw,{raw:{width:1280,height:760,channels:3}}).jpeg({quality:85}).toFile(path.join(out,`${clip.id}.jpg`));
  if(!child.stdin.write(raw))await once(child.stdin,'drain');count++;
 }
 child.stdin.end();const [code]=await completed;if(code!==0)throw Error(`ffmpeg failed: ${clip.id}`);
 renameSync(partial,file);
 writeFileSync(path.join(out,`${clip.id}.json`),JSON.stringify(clip,null,2));
 console.log(`Rendered ${clip.id}: ${clip.duration.toFixed(1)}s, ${count} frames`);
}
// The app only references successfully encoded movies. Unfinished units retain their original lesson.
const catalog=plan.filter(c=>existsSync(path.join(out,`${c.id}.mp4`))).map(c=>JSON.parse(readFileSync(path.join(out,`${c.id}.json`))));
if(!process.env.EM_FILM_PREFLIGHT&&!process.env.EM_FILM_NO_FINALIZE&&!selected.length)writeFileSync('src/content/em-video-catalog.generated.json',JSON.stringify(catalog));
console.log(`Catalog: ${catalog.length}/${plan.length} movies`);
