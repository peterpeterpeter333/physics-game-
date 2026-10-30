import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
const dir=process.argv[2]??'/private/tmp/physics-all-storyboard-latest';
const files=readdirSync(dir).filter(f=>f.endsWith('.svg')).sort();
writeFileSync(`${dir}/index.html`,`<!doctype html><html lang="ja"><meta charset="utf-8"><title>Physics Quest video frame audit</title><style>body{margin:0;background:#101726;color:white}section{width:1280px}h2{font:20px sans-serif;margin:15px}</style>${files.map(f=>`<section data-file="${f}"><h2>${f}</h2>${readFileSync(`${dir}/${f}`,'utf8')}</section>`).join('')}</html>`);
console.log(`Review gallery: ${files.length} frames`);
