// Final MP4 only: every cue's last actual 30fps frame, independently reviewable.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1',id='ys-chain-c1v1';
const video=cache+'/out/'+id+'.mp4',data=JSON.parse(fs.readFileSync(cache+'/blender/data.json'));
if(!fs.existsSync(video))throw Error('Final C1 MP4 is required');
const out=cache+'/review-final-cue-ends-c1v1';fs.mkdirSync(out+'/frames',{recursive:true});
const cues=data.cues.map(c=>({...c,frame:Math.ceil(c.end*30)-1}));
const unique=[...new Set(cues.map(c=>c.frame))].sort((a,b)=>a-b);
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const filter='select='+unique.map(j=>`eq(n\\,${j})`).join('+')+',scale=540:960:flags=area';
const r=spawnSync(ff,['-y','-v','error','-i',video,'-vf',filter,'-fps_mode','passthrough','-start_number','0','-q:v','2',out+'/frames/%03d.jpg'],{encoding:'utf8',maxBuffer:1e7});
if(r.status)throw Error(r.stderr);
const files=fs.readdirSync(out+'/frames').filter(f=>f.endsWith('.jpg'));
if(files.length!==unique.length)throw Error('Missing final cue-end frames');
const frames=cues.map(c=>({key:c.key,row:c.row,frame:c.frame,time:c.frame/30,file:out+'/frames/'+String(unique.indexOf(c.frame)).padStart(3,'0')+'.jpg'}));
const sheets=[];
for(let start=0;start<frames.length;start+=6){
 const cards=[];
 for(const [i,f]of frames.slice(start,start+6).entries()){
  const title=Buffer.from(`<svg width="360" height="32"><rect width="360" height="32" fill="#fff"/><text x="8" y="22" font-size="16" font-family="Arial">${f.time.toFixed(3)}s / row ${f.row} / ${f.key}</text></svg>`);
  cards.push({input:await sharp({create:{width:360,height:672,channels:3,background:'#fff'}}).composite([{input:title,left:0,top:0},{input:await sharp(f.file).resize(360,640).toBuffer(),left:0,top:32}]).jpeg({quality:95}).toBuffer(),left:i%3*360,top:Math.floor(i/3)*672});
 }
 const file=out+'/cue-ends-'+String(sheets.length+1).padStart(2,'0')+'.jpg';await sharp({create:{width:1080,height:1344,channels:3,background:'#fff'}}).composite(cards).jpeg({quality:95}).toFile(file);sheets.push(file);
}
const result={video,videoSha256:createHash('sha256').update(fs.readFileSync(video)).digest('hex'),frames,sheets,review:'not yet visually reviewed'};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(result,null,1));console.log(JSON.stringify({out,frames:frames.length,sheets:sheets.length},null,1));
