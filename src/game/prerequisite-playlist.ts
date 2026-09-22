/** Insert completed prerequisite media only; never reorder or remove the original films. */
export function prerequisitePlaylist<T extends {id:string}, P extends T & {before:string[]}>(original:T[], prerequisites:P[]):T[] {
 const seen=new Set<string>();
 return original.flatMap(movie=>{
  const introductions=prerequisites.filter(p=>p.before.includes(movie.id)&&!seen.has(p.id));
  introductions.forEach(p=>seen.add(p.id));
  return [...introductions,movie];
 });
}
