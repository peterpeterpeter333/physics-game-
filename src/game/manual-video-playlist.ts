import {videoSegments,type InsertRoute,type TimedMovie,type VideoMode} from './video-inserts';
export type VideoPage<T>={id:string;parentId:string;title:string;media:T;start:number;end:number};
/** Each segment is a user-selected page, never an automatic source change. */
export function manualVideoPlaylist<T extends TimedMovie&{title:string}>(movies:T[],mode:VideoMode,routes:Record<string,InsertRoute[]>,inserts:T[]):VideoPage<T>[] {
 return movies.flatMap(main=>{
  const segments=videoSegments(main,mode,routes[main.id]??[],inserts);
  const parts=segments.filter(s=>!s.insert).length;let part=0;
  return segments.map(s=>{
   const media=s.insert?inserts.find(m=>m.id===s.movieId)!:main;
   if(!s.insert)part++;
   return {id:s.insert?s.key:part===1?main.id:s.key,parentId:main.id,media,start:s.start,end:s.end,
    title:s.insert?'補足：'+media.title:parts>1?main.title+'（'+part+'/'+parts+'）':main.title};
  });
 });
}
