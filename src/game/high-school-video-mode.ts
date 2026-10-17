import type {VideoMode} from './video-inserts';

/** Keep summaries out of the deep playlist, including temporary local replacements. */
export function highSchoolVideoPlaylist<T extends {kind?:string;part?:number}>(movies:T[],mode:VideoMode):T[] {
 const kind=mode==='quick'?'summary':'deep';
 return movies.filter(movie=>movie.kind===kind).sort((a,b)=>(a.part??0)-(b.part??0));
}
