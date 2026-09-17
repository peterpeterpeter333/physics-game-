/** Deterministic SVG lessons -> H.264/AAC movies; no browser capture or remote service. */
import {loadSource} from './build-em-film-plan.mjs';
import {readFileSync,existsSync,mkdirSync,writeFileSync,renameSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import path from 'node:path';
import sharp from 'sharp';
import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js';
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/physics-em-films';
const out=path.resolve('public/media/em');mkdirSync(out,{recursive:true});
const ffmpeg=process.env.FFMPEG;if(!ffmpeg)throw Error('Set FFMPEG to an ffmpeg executable');
const {stages,diagram}=await loadSource();
const plan=JSON.parse(readFileSync(path.join(cache,'plan.json')));
const selected=process.argv.slice(2);const fps=12;
const a=liteAdaptor();RegisterHTMLHandler(a);
const math=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function lines(s,max){const output=[];let row='',width=0;for(const ch of s){const n=/[\u0020-\u007e]/.test(ch)?.58:1;if(width+n>max){output.push(row);row='';width=0;}row+=ch;width+=n;}if(row)output.push(row);return output;}
const text=(s,x,y,size=26,color='#eef4ff')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}">${esc(s)}</text>`;
const texCache=new Map();
function equation(tex){
 if(texCache.has(tex))return texCache.get(tex);
 let svg=a.outerHTML(a.firstChild(math.convert(tex,{display:true})));
 if(svg.includes('data-mjx-error'))throw Error(`Invalid TeX: ${tex}`);
 const view=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
 const height=Math.min(62,1150*view[3]/view[2]),width=height*view[2]/view[3];
 svg=svg.replace(/width="[^"]+"/,`width="${width}"`).replace(/height="[^"]+"/,`height="${height}"`).replaceAll('currentColor','#8aebc1').replace('<svg ',`<svg x="${(1280-width)/2}" y="${550+(62-height)/2}" `);
 texCache.set(tex,svg);return svg;
}
function frame(clip,scene,step,t){
 const local=t-scene.start,span=scene.end-scene.start;
 let {svg,spatial}=diagram(step,Math.min(16,local));
 // Preserve the entire diagram and its axis/quantity labels, including non-square 3D frames.
 svg=svg.replace(/<svg\b[^>]*>/,tag=>tag.replace(/\s(?:width|height|x|y)="[^"]*"/g,'').replace('<svg ', '<svg x="40" y="108" width="1200" height="430" '));
 const active=scene.captions.find(c=>t>=c.start&&t<c.end)??scene.captions.at(-1);
 const formulas=scene.equations;
 // Long derivations stay in the expandable calculation panel; the film shows at most three steps.
 const shown=formulas.length<=3?formulas:[formulas[0],formulas[Math.floor((formulas.length-1)/2)],formulas.at(-1)];
 const eq=shown.length?equation(shown[Math.min(shown.length-1,Math.floor(local/span*shown.length))]):'';
 const caption=lines(active.text,44).slice(0,3).map((s,i)=>text(s,48,648+i*29,27)).join('');
 const level={intro:'初級',middle:'中級',advanced:'上級'}[clip.level];
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="760" viewBox="0 0 1280 760"><style>text{font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN',sans-serif} .field-arrow{opacity:1}</style><rect width="1280" height="760" fill="#0b1122"/>${text(`PHYSICS QUEST ／ 大学電磁気・${level}`,40,30,18,'#a7b7d3')}${lines(clip.title,47).slice(0,2).map((s,i)=>text(s,40,65+i*30,28)).join('')}${svg}${spatial?text('視点だけが動きます。電荷と面の配置は同じです。',48,539,17,'#a7b7d3'):''}${eq}<line x1="40" y1="626" x2="1240" y2="626" stroke="#2a3850"/>${caption}${text('音声：VOICEVOX Nemo 男声1',40,746,15,'#a7b7d3')}${text(`${clip.scenes.indexOf(scene)+1} / ${clip.scenes.length}`,1170,746,17,'#a7b7d3')}<rect x="0" y="755" height="5" width="${1280*t/clip.duration}" fill="#62d7ff"/></svg>`;
}
for(const entry of plan){
 if(selected.length&&!selected.includes(entry.id))continue;
 const json=path.join(cache,`${entry.id}.json`);
 if(!existsSync(json)){console.log(`Audio not ready: ${entry.id}`);continue;}
 const clip=JSON.parse(readFileSync(json));
 const scriptKey=c=>c.scenes.map(s=>s.narration).join('\n');
 if(scriptKey(clip)!==scriptKey(entry)){console.log(`Updated audio not ready: ${entry.id}`);continue;}
 const file=path.join(out,`${clip.id}.mp4`);
 const saved=path.join(out,`${clip.id}.json`);
 if(existsSync(file)&&existsSync(saved)&&scriptKey(JSON.parse(readFileSync(saved)))===scriptKey(clip)&&!process.env.EM_FILM_FORCE){console.log(`Existing: ${clip.id}`);continue;}
 const stage=stages.find(s=>s.id===clip.stageId);
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
writeFileSync('src/content/em-video-catalog.generated.json',JSON.stringify(catalog));
console.log(`Catalog: ${catalog.length}/${plan.length} movies`);
