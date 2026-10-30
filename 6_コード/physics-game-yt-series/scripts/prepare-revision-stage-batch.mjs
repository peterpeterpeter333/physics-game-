import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const cache=process.env.EM_FILM_CACHE;assert.ok(cache,'Set EM_FILM_CACHE');
const stages=process.argv.slice(2);assert.ok(stages.length);
const root='docs/video-revision-20260924';
const plan=JSON.parse(readFileSync(`${root}/full-plan.generated.json`));
const routes=JSON.parse(readFileSync(`${root}/full-routes.generated.json`));
const ids=new Set();
for(const stage of stages)for(const level of ['intro','middle','advanced']){
 const id=`${stage}-${level}`;assert.ok(plan.some(c=>c.id===id),`Missing plan ${id}`);ids.add(id);
 for(const prep of routes.prerequisites[id]?.required??[])if(plan.some(c=>c.id===prep))ids.add(prep);
 for(const r of routes.inserts[id]??[])for(const insert of r.inserts)ids.add(insert);
}
for(const id of ids)assert.ok(plan.some(c=>c.id===id),id);
mkdirSync(cache,{recursive:true});writeFileSync(`${cache}/plan.json`,JSON.stringify(plan.filter(c=>ids.has(c.id)),null,2));
console.log(`Prepared ${ids.size} movies for ${stages.join(', ')}: ${[...ids].join(', ')}`);
