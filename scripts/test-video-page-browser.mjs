// Optional local integration check with a real browser and an actual MP4.
// Set PLAYWRIGHT_MODULE to the installed Playwright entry point if not local.
import {createServer} from 'node:http';
import {readFileSync,createReadStream,statSync,mkdirSync} from 'node:fs';
import {once} from 'node:events';
import {build} from 'esbuild';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE??'playwright');
const id='m1-velocity-middle',main=JSON.parse(readFileSync(`public/media/revisions/${id}.json`));
const start=main.scenes[0].end,end=main.scenes[1].end;
const bundle=await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {SegmentedLessonVideo} from './src/components/SegmentedLessonVideo';createRoot(document.getElementById('root')).render(<SegmentedLessonVideo main={${JSON.stringify(main)}} start={${start}} end={${end}} onError={()=>window.mediaFailed=true}/>);`,loader:'tsx',resolveDir:process.cwd()},bundle:true,write:false,outfile:'/private/tmp/physics-page-harness.js',jsx:'automatic',define:{'import.meta.env.BASE_URL':'"/"','process.env.NODE_ENV':'"production"'}});
const js=bundle.outputFiles.find(f=>f.path.endsWith('.js')).text;
const css=bundle.outputFiles.find(f=>f.path.endsWith('.css'))?.text??'';
const server=createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/'){res.setHeader('Content-Type','text/html');res.end(`<html><meta name="viewport" content="width=device-width"><style>body{background:#0b1122;color:white;font-family:sans-serif}video{width:100%;max-width:1000px}${css}</style><div id="root"></div><script src="/harness.js"></script></html>`);return;}
 if(url.pathname==='/harness.js'){res.setHeader('Content-Type','text/javascript');res.end(js);return;}
 if(![`/media/revisions/${id}.mp4`,`/media/revisions/${id}.jpg`].includes(url.pathname)){res.writeHead(404);res.end();return;}
 const file='public'+url.pathname,size=statSync(file).size,range=/bytes=(\d+)-(\d*)/.exec(req.headers.range??'');
 const from=range?Number(range[1]):0,to=range&&range[2]?Math.min(size-1,Number(range[2])):size-1;
 res.writeHead(range?206:200,{'Content-Type':file.endsWith('.mp4')?'video/mp4':'image/jpeg','Content-Length':to-from+1,'Accept-Ranges':'bytes',...(range?{'Content-Range':`bytes ${from}-${to}/${size}`}:{})});createReadStream(file,{start:from,end:to}).pipe(res);
});
server.listen(0,'127.0.0.1');await once(server,'listening');
let browser;
try{
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(`http://127.0.0.1:${server.address().port}`);
 await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
 assert.equal(await page.locator('video').evaluate(v=>v.playbackRate),.9);
 for(const rate of ['0.5','0.9','2']){
  await page.getByLabel('動画と音声の再生速度').selectOption(rate);
  await page.waitForFunction(r=>document.querySelector('video').playbackRate===r,Number(rate));
  // Seek beyond the page to simulate a late timeupdate / user scrub.
  await page.locator('video').evaluate((v,t)=>{v.currentTime=t;},end+.2);
  await page.waitForFunction(({start,end})=>{const v=document.querySelector('video');return v.paused&&v.currentTime>=start&&v.currentTime<end;},{start,end});
  const src=await page.locator('video').getAttribute('src');
  await page.getByRole('button',{name:'もう一度再生'}).click();
  await page.waitForFunction(t=>{const v=document.querySelector('video');return !v.paused&&v.currentTime<t;},start+2);
  await page.locator('video').evaluate((v,t)=>{v.currentTime=t;},end-.12);
  await page.waitForFunction(({start,end})=>{const v=document.querySelector('video');return v.paused&&v.currentTime>=start&&v.currentTime<end&&v.currentTime>end-.1;},{start,end});
  assert.equal(await page.locator('video').getAttribute('src'),src,'No source jump');
 }
 await page.locator('video').evaluate((v,t)=>{v.currentTime=t;},start+.05);
 await page.waitForFunction(t=>Math.abs(document.querySelector('video').currentTime-t)<.1,start+.05);
 const out=process.env.REVIEW_SCREENSHOT_DIR??'/private/tmp/physics-review-browser';mkdirSync(out,{recursive:true});
 await page.screenshot({path:out+'/mobile-player.png'});
 assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>Boolean(window.mediaFailed)),false);
 console.log('PASS: actual MP4 in Chromium, initial 0.9, speed 0.5/0.9/2, seek/end containment, replay, stable source. Not an audio-listening or iPhone Safari test.');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
