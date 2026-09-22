import routes from '../content/prerequisite-routes.generated.json';
const routing=routes as Record<string,{required:string[];review:string[]}>;

/** Only direct, unseen introductions. Never expand their ancestors here. */
export function prerequisitePlaylist<T extends {id:string}, P extends T>(original:T[], prerequisites:P[],completed:ReadonlySet<string>=new Set()):T[] {
 const seen=new Set<string>();
 return original.flatMap(movie=>{
  const direct=routing[movie.id]?.required??[];
  const introductions=prerequisites.filter(p=>direct.includes(p.id)&&!completed.has(p.id)&&!seen.has(p.id));
  introductions.forEach(p=>seen.add(p.id));
  return [...introductions,movie];
 });
}

/** Includes seen introductions and their ancestors, but only on user request. */
export function prerequisiteReview<T extends {id:string}>(original:T[],prerequisites:T[]):T[]{
 const ids=new Set(original.flatMap(c=>routing[c.id]?.review??[]));
 return prerequisites.filter(p=>ids.has(p.id));
}
