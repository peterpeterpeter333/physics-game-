import {battles} from './paper-battle-storyboard.mjs';
import {readFileSync,writeFileSync,mkdirSync,existsSync,renameSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js';
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
const cache='/private/tmp/physics-paper-films',out='public/media/paper-battles';
mkdirSync(cache,{recursive:true});mkdirSync(out,{recursive:true});
const plan=battles.flatMap(b=>['question','solution'].map(kind=>({id:`${b.id}-${kind}`,problemId:b.id,kind,title:b.title,scenes:b[kind].map((s,index)=>({...s,index}))})));
if(process.argv.includes('--plan')){writeFileSync(`${cache}/plan.json`,JSON.stringify(plan,null,2));console.log(`Prepared ${plan.length} films`);process.exit(0);}
const a=liteAdaptor();RegisterHTMLHandler(a);
const math=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text=(s,x,y,size=25,color='#edf2ff')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}">${esc(s)}</text>`;
const line=(x,y,X,Y,color='#69dfff',label='')=>`<path d="M${x} ${y}L${X} ${Y}" stroke="${color}" stroke-width="5" fill="none" marker-end="url(#${color==='#ffd36b'?'gold':'blue'})"/>${label?text(label,(x+X)/2,(y+Y)/2-12,24,color):''}`;
const dot=(x,y,label,color='#ffd36b')=>`<circle cx="${x}" cy="${y}" r="11" fill="${color}"/>${text(label,x-16,y+36,24)}`;
const wrap=(s,max=34)=>{let rows=[],row='',w=0;for(const c of s){const n=/[ -~]/.test(c)?.55:1;if(w+n>max&&!/[。、）]/.test(c)){rows.push(row);row='';w=0;}row+=c;w+=n;}if(row)rows.push(row);return rows;};
const eqs=new Map();
function equation(tex){
 if(!tex)return '';if(eqs.has(tex))return eqs.get(tex);
 let svg=a.outerHTML(a.firstChild(math.convert(tex,{display:true})));
 if(/data-mjx-error|data-mml-node="merror"/.test(svg))throw Error(tex);
 const v=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number),h=Math.min(/\\(?:int|oint|frac)/.test(tex)?86:52,875*v[3]/v[2]),w=h*v[2]/v[3];
 svg=svg.replace(/width="[^"]+"/,`width="${w}"`).replace(/height="[^"]+"/,`height="${h}"`).replaceAll('currentColor','#97eaca').replace('<svg ',`<svg x="${(960-w)/2}" y="${416+(86-h)/2}" `);eqs.set(tex,svg);return svg;
}
function diagram(id,solution,step,t){
 const reveal=Math.min(1,(t+0.2)/1.1);
 const arrow=(x,y,X,Y,color='#69dfff',label='')=>line(x,y,x+(X-x)*reveal,y+(Y-y)*reveal,color,label);
 const gold='#ffd36b';
 if(id==='paper-ui-field-1')return [150,400,650].map(x=>arrow(x,180,x+150,180,'#69dfff','E：右向き')).join('')+dot(480,285,'q = −2 C')+text('電場の強さ：3 N/C',70,350)+(solution?arrow(465,285,295,285,gold,step>0?'F：6 N':'力は？'):text('力の向きと大きさを求めよう',560,290,24));
 if(id==='paper-ui-field-2')return dot(220,300,'A')+dot(640,300,'B')+arrow(230,280,365,280,'#69dfff','E：2 N/C')+arrow(640,280,640,140,'#69dfff','E：4 N/C')+text('置く電荷：+2 C',65,380)+(solution&&step>0?arrow(240,330,375,330,gold,'F：4 N'):'')+(solution&&step>1?arrow(800,290,800,145,gold,'F：8 N'):'');
 if(id==='paper-ui-field-3')return dot(480,270,'+Q')+dot(160,270,'L')+dot(800,270,'R')+text('中心の電荷は正',370,160)+(solution&&step>0?arrow(380,245,220,245,'#69dfff','E')+arrow(580,245,740,245,'#69dfff','E'):'')+(solution&&step>1?arrow(220,325,380,325,gold,'F')+arrow(740,325,580,325,gold,'F'):'');
 if(id==='paper-um-line-2')return `<path d="M580 360V160H370" stroke="#516584" fill="none" stroke-dasharray="8 8"/>`+arrow(580,360,580,160,gold,'① 0.40 m')+arrow(580,160,370,160,gold,'② 0.20 m')+arrow(580,360,795,360,'#69dfff','F：5 N')+dot(580,360,'始点')+(solution?text(step===0?'① 力と移動は直角':'② 力と移動は逆向き',80,225):'');
 if(id==='paper-um-line-1'||id==='paper-um-line-3'){
  const one=id.endsWith('-1'),x=350,y=310;
  return `<path d="M150 310H750M350 420V150" stroke="#40516e" fill="none"/>`+text('x',770,320)+text('y',320,160)+dot(x,y,'始点')+arrow(x,y,x+90,y-(one?120:180),'#69dfff')+text(one?(solution?'F = (6, 8) N':'E = (3, 4) N/C'):'E = (1, 2) N/C',85,225,25,'#69dfff')+arrow(x,y,one?530:485,one?400:130,gold)+text('Δr',one?555:510,one?395:180,25,gold)+text(one?'右へ 0.20 m、下へ 0.10 m':'右へ 0.30 m、上へ 0.40 m',520,270,23)+(solution?text(one?'横：正の仕事／縦：負の仕事':'同じ方向の成分どうしを掛けて足す',80,120,23):'');
 }
 if(id==='paper-ue-integrals-1'){
  const u=(t%6)/6,x=180+550*u,y=380-180*u*u;
  return `<path d="M180 380H810M180 380V120" stroke="#40516e" fill="none"/>`+text('x [m]',820,390)+text('y [m]',110,130)+`<path d="M180 380Q455 380 730 200" fill="none" stroke="#ffd36b" stroke-width="4"/>`+dot(180,380,'u=0')+dot(730,200,'u=1')+dot(x,y,'')+text('r(u) = (2u, u²) m',365,125)+(solution?arrow(x,y,x+70,y-(360/550)*70*u,gold)+arrow(x,y,x+60*u*u,y-(360/275)*60*u,'#69dfff')+text('E：電場',770,280,23,'#69dfff')+text('dr：移動',770,320,23,gold):text('動く点：電荷',600,165,23));
 }
 if(id==='paper-ue-integrals-2')return `<polygon points="550,160 650,215 650,365 550,310" fill="${solution?'#6a5427':'#1b3147'}"/><path d="M310 160H550L650 215H410ZM310 160V310L410 365V215M410 365H650V215M550 160V310L650 365M310 310H550" stroke="#69dfff" stroke-width="3" fill="none"/>`+text('x=0',300,250)+text('x=1 m',565,280,23)+arrow(630,315,840,315,'#69dfff','E')+text('各辺：1 m',85,370)+(solution?text(step===0?'右の面：電場と法線が同じ向き':step===1?'左の面：E=0／他の四面：E ⟂ n':'外へ出る量 − 入る量 = 2',85,125,25):'');
 return `<path d="M190 370H825" stroke="#40516e" stroke-width="2"/>`+dot(220,370,'A：0 m')+dot(760,370,'B：2 m')+[0,1,2,3].map(i=>arrow(260+i*120,290,270+i*120+15*(i+1)**2,290,'#69dfff')).join('')+text('電場：右へ進むほど強い',245,170)+arrow(250,380,720,380,gold,'電荷の移動')+(solution?text(step===2?'電場の仕事が正 → 電位は下がる':'微小な移動ごとの仕事を足す',200,230):'');
}
export function frame(clip,scene,t){
 const caption=scene.captions[Math.max(0,scene.captions.findLastIndex(c=>c.start<=t))]?.text??scene.narration;
 const rows=wrap(caption);if(rows.length>4)throw Error(`Caption too long: ${clip.id}: ${caption}`);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640"><style>text{font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN',sans-serif}</style><defs><marker id="blue" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0L0 6L6 3Z" fill="#69dfff"/></marker><marker id="gold" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0L0 6L6 3Z" fill="#ffd36b"/></marker></defs><rect width="960" height="640" fill="#0b1122"/>${text(clip.kind==='question'?'問題：紙で考えてから4択で回答':'解説：図と式で確かめよう',35,35,21,'#adbed8')}${text(clip.title,35,79,32)}${diagram(clip.problemId,clip.kind==='solution',scene.index,t-scene.start)}${equation(scene.equation)}<path d="M35 503H925" stroke="#314361"/>${rows.map((r,i)=>text(r,40,535+i*25,23)).join('')}${text('音声：VOICEVOX Nemo 男声1',35,625,16,'#adbed8')}<rect y="636" width="${960*t/clip.duration}" height="4" fill="#69dfff"/></svg>`;
}
const stills=process.argv.includes('--stills'),selected=process.argv.slice(2).filter(s=>s!=='--stills'),fps=12;
for(const entry of plan){
 if(selected.length&&!selected.includes(entry.id))continue;
 const clip=JSON.parse(readFileSync(`${cache}/${entry.id}.json`));
 if(clip.scenes.map(s=>s.narration).join()!==entry.scenes.map(s=>s.narration).join())throw Error(`Stale audio ${clip.id}`);
 if(stills){for(const scene of clip.scenes)await sharp(Buffer.from(frame(clip,scene,(scene.start+scene.end)/2))).png().toFile(`${cache}/${clip.id}-${scene.index}.png`);console.log(`Checked ${clip.id}`);continue;}
 const hash=createHash('sha256').update(readFileSync(import.meta.filename)).update(JSON.stringify(clip)).digest('hex');clip.renderKey=hash;
 if(existsSync(`${out}/${clip.id}.json`)&&JSON.parse(readFileSync(`${out}/${clip.id}.json`)).renderKey===hash&&existsSync(`${out}/${clip.id}.mp4`)){console.log(`Cached ${clip.id}`);continue;}
 const target=`${cache}/${clip.id}.rendering.mp4`,ff=process.env.FFMPEG;if(!ff)throw Error('Set FFMPEG');
 const child=spawn(ff,['-y','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size','960x640','-framerate',String(fps),'-i','pipe:0','-i',`${cache}/${clip.id}.wav`,'-c:v','libx264','-preset','veryfast','-crf','25','-pix_fmt','yuv420p','-r','24','-c:a','aac','-b:a','96k','-t',String(clip.duration),'-movflags','+faststart',target],{stdio:['pipe','inherit','inherit']});
 const completed=once(child,'close');
 for(let i=0;i<Math.ceil(clip.duration*fps);i++){
  const t=i/fps,scene=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1);
  const raw=await sharp(Buffer.from(frame(clip,scene,t))).flatten({background:'#0b1122'}).removeAlpha().raw().toBuffer();
  if(i===0)await sharp(raw,{raw:{width:960,height:640,channels:3}}).jpeg({quality:85}).toFile(`${out}/${clip.id}.jpg`);
  if(!child.stdin.write(raw))await once(child.stdin,'drain');
 }
 child.stdin.end();const [code]=await completed;if(code!==0)throw Error(`Encoding failed ${clip.id}`);
 renameSync(target,`${out}/${clip.id}.mp4`);writeFileSync(`${out}/${clip.id}.json`,JSON.stringify(clip,null,2));console.log(`Rendered ${clip.id} (${clip.duration.toFixed(1)}s)`);
}
if(!selected.length&&!stills){
 const catalog=battles.map(b=>({id:b.id,choices:b.choices,answerIndex:b.answerIndex,...Object.fromEntries(['question','solution'].map(kind=>{const c=JSON.parse(readFileSync(`${out}/${b.id}-${kind}.json`));return[kind,{id:c.id,duration:c.duration,renderKey:c.renderKey}];}))}));
 writeFileSync('src/content/paper-battle-videos.generated.json',JSON.stringify(catalog,null,2));console.log('Published complete 9-question catalog');
}
