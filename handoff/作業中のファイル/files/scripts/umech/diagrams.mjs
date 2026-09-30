// Registry of every picture used by the university-mechanics films.
// Each topic owns its own module and a unique key prefix; keys must not collide.
import {newtonDiagrams} from './newton-diagrams.mjs';
import {newtonbDiagrams} from './newtonb-diagrams.mjs';
import {dragDiagrams} from './drag-diagrams.mjs';
import {drag2Diagrams} from './drag2-diagrams.mjs';
import {drag3Diagrams} from './drag3-diagrams.mjs';
import {drag4Diagrams} from './drag4-diagrams.mjs';
import {mxADiagrams} from './mxA-diagrams.mjs';
import {mxBDiagrams} from './mxB-diagrams.mjs';
import {mxCDiagrams} from './mxC-diagrams.mjs';
import {mxDDiagrams} from './mxD-diagrams.mjs';
import {mxrDiagrams} from './mxr-diagrams.mjs';
import {mx2p01Diagrams} from './mx2-p01-diagrams.mjs';
import {mx2p2Diagrams} from './mx2-p2-diagrams.mjs';
import {mx2p34Diagrams} from './mx2-p34-diagrams.mjs';
import {mx2p5Diagrams} from './mx2-p5-diagrams.mjs';
import {mx2p6Diagrams} from './mx2-p6-diagrams.mjs';
import {mx2p78Diagrams} from './mx2-p78-diagrams.mjs';
import {ytDerivDiagrams} from './yt-deriv-diagrams.mjs';
import {workDiagrams} from './work-diagrams.mjs';
import {potentialDiagrams} from './potential-diagrams.mjs';
import {momentumDiagrams} from './momentum-diagrams.mjs';
import {angularDiagrams} from './angular-diagrams.mjs';
import {shmDiagrams} from './shm-diagrams.mjs';
import {rigid1Diagrams} from './rigid1-diagrams.mjs';
import {rigid2Diagrams} from './rigid2-diagrams.mjs';
import {frontierDiagrams} from './frontier-diagrams.mjs';
const all=[newtonDiagrams,newtonbDiagrams,dragDiagrams,drag2Diagrams,drag3Diagrams,drag4Diagrams,mxADiagrams,mxBDiagrams,mxCDiagrams,mxDDiagrams,mxrDiagrams,mx2p01Diagrams,mx2p2Diagrams,mx2p34Diagrams,mx2p5Diagrams,mx2p6Diagrams,mx2p78Diagrams,ytDerivDiagrams,workDiagrams,potentialDiagrams,momentumDiagrams,angularDiagrams,shmDiagrams,rigid1Diagrams,rigid2Diagrams,frontierDiagrams];
export const diagrams={};
for(const m of all)for(const [k,f] of Object.entries(m)){if(diagrams[k])throw Error(`Duplicate diagram key ${k}`);diagrams[k]=f;}
// yt5-auto: every scripts/umech/yt1-*-diagrams.mjs (YouTube 1-minute series) is loaded automatically,
// so parallel authors never edit this registry. Each module may export any number of key→fn objects.
{
 const {readdirSync}=await import('node:fs');const {fileURLToPath,pathToFileURL}=await import('node:url');const path=await import('node:path');
 const dir=path.dirname(fileURLToPath(import.meta.url));
 for(const f of readdirSync(dir).filter(f=>/^yt1-.*-diagrams\.mjs$/.test(f)).sort()){
  const mod=await import(pathToFileURL(path.join(dir,f)).href);
  for(const m of Object.values(mod))if(m&&typeof m==='object')for(const [k,fn] of Object.entries(m)){if(typeof fn!=='function')continue;if(diagrams[k])throw Error(`Duplicate diagram key ${k} (${f})`);diagrams[k]=fn;}
 }
}
