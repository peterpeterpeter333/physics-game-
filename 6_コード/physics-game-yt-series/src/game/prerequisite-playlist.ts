import routes from '../content/prerequisite-routes.generated.json';
const routing=routes as Record<string,{required:string[];review:string[]}>;

/** Unit membership is editorial, never determined by viewing history. */
export function prerequisitePlaylist<T extends {id:string}, P extends T>(original:T[], prerequisites:P[]):T[] {
 const seen=new Set<string>();
 return original.flatMap(movie=>{
  const direct=routing[movie.id]?.required??[];
  // The editorial dependency order, not catalog insertion order, is the lesson.
  const introductions=direct.flatMap(id=>{const p=prerequisites.find(p=>p.id===id);return p&&!seen.has(id)?[p]:[];});
  introductions.forEach(p=>seen.add(p.id));
  return [...introductions,movie];
 });
}

/** Only this unit's direct introductions; never their prerequisite ancestors. */
export function prerequisiteReview<T extends {id:string}>(original:T[],prerequisites:T[]):T[]{
 const ids=[...new Set(original.flatMap(c=>routing[c.id]?.review??[]))];
 return ids.flatMap(id=>{const p=prerequisites.find(p=>p.id===id);return p?[p]:[];});
}

// Manuscript 04 explicitly requests these two proofs before sine motion only
// in thorough mode. This is not recursive prerequisite expansion.
const thoroughBefore:Record<string,string[]>={
 'prep-sin-motion':['prep-addition-theorem','prep-sin-derivative'],
};
export function thoroughPrerequisitePlaylist<T extends {id:string}>(assigned:T[], prerequisites:T[],mode:'quick'|'thorough'):T[]{
 if(mode==='quick')return assigned;
 const seen=new Set<string>();
 return assigned.flatMap(movie=>{
  const additions=(thoroughBefore[movie.id]??[]).flatMap(id=>{
   const p=prerequisites.find(p=>p.id===id);
   if(!p||seen.has(id))return [];
   seen.add(id);return [p];
  });
  if(seen.has(movie.id))return additions;
  seen.add(movie.id);return [...additions,movie];
 });
}

/** Switching to quick mode stays at the topic whose proof was being read. */
export function prerequisiteSelectionParent(selectedId:string,assigned:{id:string}[]):string|undefined{
 const direct=assigned.find(m=>selectedId===m.id||selectedId.startsWith(m.id+':'));
 if(direct)return direct.id;
 return Object.entries(thoroughBefore).find(([target,proofs])=>assigned.some(m=>m.id===target)&&proofs.some(id=>selectedId===id||selectedId.startsWith(id+':')))?.[0];
}
