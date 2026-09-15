import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const handlers={},stored=new Map(),deleted=[];
let network, writes=0;
const scope='https://example.test/physics-game-/';
vm.runInNewContext(readFileSync('public/sw.js','utf8'),{
 URL,Response,location:{origin:'https://example.test'},
 self:{registration:{scope},clients:{claim(){}},skipWaiting(){},addEventListener:(name,fn)=>handlers[name]=fn},
 caches:{keys:async()=>['physics-quest-v1','another-app'],delete:async key=>deleted.push(key),
  match:async request=>stored.get(typeof request==='string'?request:request.url),
  open:async()=>({put:async(request,response)=>{writes++;stored.set(request.url,response);}})},
 fetch:async()=>{if(network instanceof Error)throw network;return network;},
});
async function get(path,mode='cors'){
 const pending=[];let result;
 handlers.fetch({request:{url:scope+path,method:'GET',mode},respondWith:p=>result=p,waitUntil:p=>pending.push(p)});
 const response=await result;await Promise.all(pending);return response;
}
network=new Response('<svg/>',{headers:{'Content-Type':'image/svg+xml'}});
assert.equal(await (await get('formula.svg')).text(),'<svg/>');assert.equal(writes,1);
network=new Response('not found',{status:404});
assert.equal((await get('formula.svg')).status,200);assert.equal(writes,1);
assert.equal((await get('missing.svg')).status,404);assert.equal(writes,1);
stored.set(scope+'index.html',new Response('<html/>'));
network=new Error('offline');
assert.equal((await get('missing.svg')).type,'error');
assert.equal(await (await get('lesson','navigate')).text(),'<html/>');
let activation;handlers.activate({waitUntil:p=>activation=p});await activation;
assert.deepEqual(deleted,['physics-quest-v1']);
console.log('PASS: SVG caching, 404 preservation, offline image failure, navigation fallback, scoped cache cleanup');
