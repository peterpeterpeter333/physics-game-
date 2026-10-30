// Preparation only: exact-voice reuse candidates. Does not create or render part A.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url));
const read=f=>JSON.parse(fs.readFileSync(f));
const assets=e=>path.join(root,'scripts/blender/desk_assets',e);
const a=read(assets('d1a')+'/ys-chain-d1a.json'),old=read(assets('d1v1')+'/ys-chain-d1v1.json');
const ap=read(assets('d1a')+'/phrase-times.json'),op=read(assets('d1v1')+'/phrase-times.json');
const cues=c=>c.scenes.flatMap(s=>s.cues.map((q,i)=>({key:q.diagram.replace(/^cd1(?:a|v1)-/,''),start:s.captions[i].start,end:s.captions[i].end,q})));
const bySubtitle=new Map(cues(old).map(c=>[c.q.subtitle,c]));
const allowed=new Set(['mine:open','mine:water','shrink:mio','shrink:spoon','shrink:1700','shrink:back','can:crush','can:mio','straw:drink','straw:push','air:weight','air:1kg','air:mio','air:inside','why:mio','why:air','why:steam','size:wide','size:53','size:area','size:2t','size:mio','size:guericke','size:pull']);
const rows=cues(a).map(c=>{
 const o=bySubtitle.get(c.q.subtitle),sameVoice=!!o&&JSON.stringify(ap[c.q.subtitle])===JSON.stringify(op[o.q.subtitle]);
 const permit=allowed.has(c.key)&&sameVoice;
 return {key:c.key,start:c.start,end:c.end,reuseEligible:permit,oldKey:o?.key??null,oldStart:o?.start??null,offset:o?c.start-o.start:null,sameSubtitle:!!o,sameVoice,reason:permit?'No old machine shown; exact subtitle and phrase timing match':'Render fresh / stage continuity or mechanism new; do not infer permission from wording alone'};
});
assert.equal(rows.length,54);
const result={episode:'d1a',duration:a.duration,frames:Math.ceil(a.duration*30),source3D:path.join(root,'outputs/axes-20261023/d1v1-3d-frames-backup-20261026/desk'),reuseCueCount:rows.filter(r=>r.reuseEligible).length,rows};
const out=process.argv[2];if(out){assert.ok(out.endsWith('_gpt_20261026.json'));fs.writeFileSync(out,JSON.stringify(result,null,2));}else console.log(JSON.stringify(result,null,2));
