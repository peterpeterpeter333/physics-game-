import {spawnSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const files=['test-app-update','audit-lessons','test-remediation','test-em-videos','test-all-video-scripts','test-all-films','test-reviewed-narration','test-prerequisite-films','test-em-video-repairs','test-video-playlists','audit-math','audit-calculations','audit-offline','audit-university-levels','audit-university-curriculum','audit-study-flow','test-potential-context','audit-guided','audit-micro','audit-questions','audit-spiral','audit-em3d','test-ten-principles','test-video-inserts','test-video-mode-media'];
const results=files.map(name=>{const p=spawnSync(process.execPath,[`scripts/${name}.mjs`],{encoding:'utf8'});const result={name,status:p.status,output:p.stdout+p.stderr};console.log(`${p.status===0?'PASS':'FAIL'} ${name}`);return result;});
writeFileSync('docs/video-revision-20260924/test-results.generated.json',JSON.stringify(results,null,2));
process.exitCode=results.some(r=>r.status!==0)?1:0;
