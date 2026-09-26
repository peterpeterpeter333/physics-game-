// Playback routing only: no narration, audio, or video is regenerated.
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {lessons} from '../docs/video-scripts/prerequisite-lessons.mjs';
import '../docs/video-scripts/prerequisite-math.mjs';
import '../docs/video-scripts/prerequisite-high-school.mjs';
import '../docs/video-scripts/prerequisite-mechanics.mjs';
import '../docs/video-scripts/prerequisite-advanced.mjs';
import '../docs/video-scripts/prerequisite-bridges.mjs';
import '../docs/video-scripts/prerequisite-calculations.mjs';
import {applyAdditionPrerequisiteRoutes} from '../docs/video-revision-20260924/addition-theorem.mjs';

// Remove tangential sections of multi-topic prerequisites from the main sequence.
const overrides={
 // 2026-09-26: these authored main films teach the prerequisite themselves.
 // Position/change/elapsed time are also introduced by the first two films.
 // Do not precede velocity with acceleration or reveal limits before deriving.
 'm1-velocity-intro':[],
 'm1-velocity-middle':[],
 'm1-velocity-advanced':[],
 'm1-acceleration-intro':[],
 'm1-acceleration-middle':[],
 'm1-acceleration-advanced':[],
 // These films introduce initial speed, graph area, and time elimination
 // in sequence. The old mixed-topic prelude reveals projectile results early.
 'm1-uniform-accel-intro':[],
 'm1-uniform-accel-middle':[],
 'm1-uniform-accel-advanced':[],
 // The revised middle film defines v₀, g, signs, and the apex condition itself.
 // The old initial-values prelude gives this same example's answer in advance.
 'm-freefall-middle':[],
 // The intro itself defines heat versus temperature. Its old prelude teaches
 // the middle-level heat formula and worked answer before the initial question.
 't-heat-intro':[],
 // The circular-algebra pilot teaches these foundations inside its main films.
 'm-circular-intro':[],
 'm-circular-middle':[],
 'm-circular-advanced':[],
 'ui-through-a-surface-bridges-2':[],
 'ui-turning-motion-bridges-9':['circular'],
 'um-newton-components-bridges-10':['trig'],
 't-gas-advanced':['pressure'],
 'w-sound-advanced':['superposition'],
 'e-current-advanced':['circuit-power'],
 'e-power-middle':['circuit-power'],
 'e-power-advanced':['circuit-power'],
 'a-nucleus-middle':['exponential','nucleus'],
 'a-nucleus-advanced':['nucleus','nuclear-energy'],
 'um-derivative-advanced':['absolute'],
 'uc-newton-advanced':['integral-compute','initial-values'],
 'uc-potential-advanced':['inverse-potential'],
 'uc-angular-intro':['torque'],
 'uc-rigid2-advanced-followups-6':['rotation-inertia'],
 // These mixed-topic introductions add another unit's material. The main
 // films already explain the relevant concept; do not attach the whole intro.
 'e-field-intro':[],
 'e-field-middle':[],
 'e-field-advanced':[],
 'a-bohr-advanced':['bohr-energy','inverse-potential'],
 'w-light-middle':['refraction'],
 'w-interference-middle':['superposition'],
 'w-interference-advanced':['superposition'],
 'ui-work-changing-bridges-7':[],
 'uc-work-advanced':['energy-chain'],
};
const catalog=['em','lesson'].flatMap(f=>JSON.parse(readFileSync(`src/content/${f}-video-catalog.generated.json`)));
const prep=JSON.parse(readFileSync('src/content/prerequisite-video-catalog.generated.json'));
const prepIds=new Set(prep.map(p=>p.id));
for(const id of Object.keys(overrides))assert.ok(catalog.some(c=>c.id===id),id);
const routes={};
for(const c of catalog){
 const direct=Object.hasOwn(overrides,c.id)?overrides[c.id].map(id=>`prep-${id}`):lessons.filter(p=>p.before.includes(c.id)).map(p=>p.id);
 for(const id of direct)assert.ok(prepIds.has(id),id);
 const scoped=prep.filter(p=>direct.includes(p.id)).map(p=>p.id);
 // Review cannot broaden a unit's scope either. No dependency traversal.
 routes[c.id]={required:scoped,review:[...scoped]};
 assert.equal(routes[c.id].required.length,direct.length,c.id);
}
// A new prerequisite becomes active only after its verified media is registered.
if(prepIds.has('prep-addition-theorem'))applyAdditionPrerequisiteRoutes(routes);
// Manuscript 04's electric-field-only prerequisite replaces the removed
// mixed circuit compilation, but only after its verified media is registered.
if(prepIds.has('prep-coulomb-field'))routes['e-field-middle']={required:['prep-coulomb-field'],review:['prep-coulomb-field']};
const file='src/content/prerequisite-routes.generated.json',data=JSON.stringify(routes,null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(readFileSync(file,'utf8'),data,'Stale prerequisite routes');
else writeFileSync(file,data);
console.log(`Prerequisite routes: ${catalog.length} main videos, ${Object.values(routes).reduce((n,r)=>n+r.required.length,0)} direct placements; no ancestor expansion anywhere.`);
