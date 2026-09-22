import {chromium} from 'playwright-core';
import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
const dir=process.argv[2]??'/private/tmp/physics-all-storyboard-latest';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:760}}),issues=[];
try{for(const file of readdirSync(dir).filter(f=>f.endsWith('.svg'))){
 await page.setContent(`<style>body{margin:0}</style>${readFileSync(`${dir}/${file}`,'utf8')}`);
 const errors=await page.evaluate(()=>[...document.querySelectorAll('text')].filter(t=>t.textContent.trim()).flatMap(t=>{const box=t.getBoundingClientRect(),svg=t.closest('svg').getBoundingClientRect();return box.x<svg.x-2||box.right>svg.right+2||box.y<svg.y-2||box.bottom>svg.bottom+2?[{text:t.textContent,box:{x:box.x,y:box.y,right:box.right,bottom:box.bottom},viewport:{x:svg.x,y:svg.y,right:svg.right,bottom:svg.bottom}}]:[];}));
 for(const error of errors)issues.push({file,...error});
}
writeFileSync(`${dir}/layout.json`,JSON.stringify(issues,null,2));console.log(JSON.stringify({frames:readdirSync(dir).filter(f=>f.endsWith('.svg')).length,overflow:issues.length,examples:issues.slice(0,25)},null,2));
}finally{await browser.close();}
if(issues.length)process.exitCode=1;
