// 問題編の準備画像。独立配置した3Dに、同じ桁の札と答えの番号を36px以上で付ける。
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {esc} from './anim.mjs';
import {NUM} from './desk-c1v1-data.mjs';
const FONT='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const hash=b=>createHash('sha256').update(b).digest('hex');
async function card(s,x,y,size=48){const {info}=await sharp(Buffer.from(`<svg width="1800" height="120"><text x="20" y="90" ${FONT} font-size="${size}" font-weight="800">${esc(s)}</text></svg>`)).trim().toBuffer({resolveWithObject:true});const w=info.width+40,h=size+28;return `<g><rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="8" fill="#f4e8cc" stroke="#b8925a" stroke-width="3"/><text x="${x}" y="${y+size*.36}" text-anchor="middle" ${FONT} font-size="${size}" font-weight="800" fill="#3b2412">${esc(s)}</text></g>`;}
export async function buildProblem(source){
 const dir=source+'/problem',projection=JSON.parse(fs.readFileSync(dir+'/anchors-c1v1.json'));if(!projection.independentOfVoice)throw Error('Problem projection must be independent of voice');
 const memo=dir+'/composition-c1v1.json',old=fs.existsSync(memo)?JSON.parse(fs.readFileSync(memo)):{};const record={};
 for(const [name,ds]of [['挑戦',[0,0,9,9,9]],['答え',[0,1,0,0,0]]]){
  const f=dir+'/'+name+'.png';if(!fs.existsSync(f))throw Error('Missing problem '+f);let raw=fs.readFileSync(f);const backup=dir+'/'+name+'_3D.png';
  if(old[name]?.composedSha256===hash(raw))raw=fs.readFileSync(backup);else fs.writeFileSync(backup,raw);
  const a=projection.states[name];let s=await card(name==='挑戦'?'999＋1':'999＋1＝1000',540,350);
  if(name==='挑戦')s+=await card('腕は 何回 落ちる？',540,450,44);
  if(name==='答え')for(let i=0;i<3;i++){const p=a['m2.arm.'+(4-i)];if(!p?.[2])throw Error('Missing actual weight projection '+i);s+=`<path d="M${p[0]} 680V${p[1]}" fill="none" stroke="#7a5b39" stroke-width="3"/>`+await card(String(i+1),p[0],650,48);}
  for(let i=0;i<5;i++){const p=a['m2.digit.'+i];if(!p?.[2])throw Error('Missing problem projection '+i);s+=await card(NUM.places[i],p[0],770,36);s+=await card(String(ds[i]),p[0],850,48);}
  const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">${s}</svg>`),composed=await sharp(raw).composite([{input:svg}]).png().toBuffer();fs.writeFileSync(f,composed);record[name]={rawSha256:hash(raw),composedSha256:hash(composed),digits:ds};
 }
 fs.writeFileSync(memo,JSON.stringify(record,null,1));return record;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])console.log(JSON.stringify(await buildProblem(process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1'),null,1));
