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
