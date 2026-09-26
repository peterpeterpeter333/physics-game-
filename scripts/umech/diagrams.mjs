// Registry of every picture used by the university-mechanics films.
// Each topic owns its own module and a unique key prefix; keys must not collide.
import {newtonDiagrams} from './newton-diagrams.mjs';
import {newtonbDiagrams} from './newtonb-diagrams.mjs';
import {dragDiagrams} from './drag-diagrams.mjs';
import {workDiagrams} from './work-diagrams.mjs';
import {potentialDiagrams} from './potential-diagrams.mjs';
import {momentumDiagrams} from './momentum-diagrams.mjs';
import {angularDiagrams} from './angular-diagrams.mjs';
import {shmDiagrams} from './shm-diagrams.mjs';
import {rigid1Diagrams} from './rigid1-diagrams.mjs';
import {rigid2Diagrams} from './rigid2-diagrams.mjs';
import {frontierDiagrams} from './frontier-diagrams.mjs';
const all=[newtonDiagrams,newtonbDiagrams,dragDiagrams,workDiagrams,potentialDiagrams,momentumDiagrams,angularDiagrams,shmDiagrams,rigid1Diagrams,rigid2Diagrams,frontierDiagrams];
export const diagrams={};
for(const m of all)for(const [k,f] of Object.entries(m)){if(diagrams[k])throw Error(`Duplicate diagram key ${k}`);diagrams[k]=f;}
