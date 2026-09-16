import { univMath } from './univ-math';
import { univMechanics } from './univ-mechanics';
import { univEm } from './univ-em';
import { enrichChapters } from './explanations';
/** Retain authored material before level placement. No source lesson is discarded. */
export const universitySource=enrichChapters([univMath,univMechanics,univEm]);
export const universitySourceStages=Object.fromEntries(universitySource.flatMap(c=>c.stages.map(s=>[s.id,s])));
