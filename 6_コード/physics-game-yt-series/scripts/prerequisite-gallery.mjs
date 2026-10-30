import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
const dir='/private/tmp/physics-prerequisite-review';
const files=readdirSync(dir).filter(f=>f.endsWith('.svg')).sort();
writeFileSync(`${dir}/index.html`,`<!doctype html><meta charset="utf-8"><title>前提動画の全場面確認</title><style>body{margin:0;background:#101628;color:white}section{width:1280px}h2{font:16px sans-serif;padding:8px}</style>${files.map(f=>`<section data-frame="${f}"><h2>${f}</h2>${readFileSync(`${dir}/${f}`,'utf8')}</section>`).join('')}`);
console.log(`Gallery: ${files.length} representative frames`);
