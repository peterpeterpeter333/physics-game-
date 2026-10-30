// D-1 answer paper on a fresh output; time-independent 3D is preserved separately.
import fs from 'node:fs';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1v1-render';
const raw=process.env.D1_PROBLEM_SOURCE??cache+'/problem-r4',out=process.env.D1_PROBLEM_OUT??cache+'/problem-final-d1v1';
const hash=b=>createHash('sha256').update(b).digest('hex');
if(fs.existsSync(out))throw Error('Existing D1 problem output preserved; choose a new D1_PROBLEM_OUT');
const d=JSON.parse(fs.readFileSync(cache+'/blender/data.json')),problem=JSON.parse(fs.readFileSync(cache+'/problem/problem.json'));
if(problem.pressureRatio!==d.numbers.fujiRatio||d.numbers.fujiRatio!==.63)throw Error('D1 pressure ratio differs');
const inputs=Object.fromEntries(['挑戦','答え'].map(k=>[k,fs.readFileSync(raw+'/'+k+'.png')]));
for(const [name,b]of Object.entries(inputs)){const m=await sharp(b).metadata();if(m.width!==1080||m.height!==1920)throw Error('D1 problem dimensions '+name);}
fs.mkdirSync(out,{recursive:true});
const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><rect x="40" y="310" width="430" height="86" rx="8" fill="#f4e8cc" stroke="#b8925a" stroke-width="3"/><text x="255" y="368" font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif" font-size="44" font-weight="800" text-anchor="middle" fill="#3b2412">約${d.numbers.fujiRatio}倍</text></svg>`);
const record={episode:'D-1',source:raw,output:out,pressureRatio:d.numbers.fujiRatio,parts:problem.parts,images:{}};
for(const [name,b]of Object.entries(inputs)){
 fs.writeFileSync(out+'/'+name+'-3D-d1v1.png',b);
 const result=name==='答え'?await sharp(b).composite([{input:svg}]).png().toBuffer():b;
 fs.writeFileSync(out+'/'+name+'.png',result);record.images[name]={sourceSha256:hash(b),outputSha256:hash(result)};
}
fs.writeFileSync(out+'/problem.json',JSON.stringify(problem,null,1));
fs.writeFileSync(out+'/composition-d1v1.json',JSON.stringify(record,null,1));console.log(JSON.stringify(record,null,1));
