import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,renameSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
assert.ok(process.env.FFMPEG,'Set FFMPEG');
const child=spawnSync(process.execPath,['scripts/register-motion-foundations.mjs','prep-coulomb-field'],{stdio:'inherit'});assert.equal(child.status,0,'Decode and manuscript validation must pass before activation');
const read=f=>JSON.parse(readFileSync(f));
const film=read('public/media/revisions/prep-coulomb-field.json');
assert.deepEqual(film.before,['e-field-middle']);assert.equal(film.legacyPositionExcluded,true);
const root='src/content/',catalogFile=root+'prerequisite-video-catalog.generated.json',routesFile=root+'prerequisite-routes.generated.json';
const catalog=read(catalogFile),routes=read(routesFile),before=structuredClone(routes);
routes['e-field-middle']={required:['prep-coulomb-field'],review:['prep-coulomb-field']};
assert.deepEqual(routes['e-field-middle'],read('docs/video-revision-20260924/full-routes.generated.json').prerequisites['e-field-middle']);
for(const id of Object.keys(before))if(id!=='e-field-middle')assert.deepEqual(routes[id],before[id]);
const merged=[...new Map([...catalog,film].map(c=>[c.id,c])).values()];
for(const [f,data]of [[catalogFile,merged],[routesFile,routes]]){writeFileSync(f+'.pending',f===routesFile?JSON.stringify(data,null,2)+'\n':JSON.stringify(data));renameSync(f+'.pending',f);}
console.log('Activated the decoded electric-field-only prerequisite for e-field-middle; unrelated unit assignments unchanged.');
