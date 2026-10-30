export type VideoMode='quick'|'thorough';
export type InsertRoute={afterScene:number;inserts:string[]};
export type TimedMovie={id:string;duration:number;scenes:{start:number;end:number}[]};
export type VideoSegment={movieId:string;start:number;end:number;mainTime:number;insert:boolean;key:string};
/** afterScene is one-based; zero means before the first scene. Never duplicate main media. */
export function videoSegments(main:TimedMovie,mode:VideoMode,routes:InsertRoute[],inserts:TimedMovie[]):VideoSegment[]{
 if(mode==='quick')return [{movieId:main.id,start:0,end:main.duration,mainTime:0,insert:false,key:main.id}];
 const result:VideoSegment[]=[];let start=0;
 for(const route of [...routes].sort((a,b)=>a.afterScene-b.afterScene)){
  if(!Number.isInteger(route.afterScene)||route.afterScene<0||route.afterScene>main.scenes.length)throw Error('Invalid insert scene');
  const end=route.afterScene===0?0:main.scenes[route.afterScene-1].end;
  if(end>start)result.push({movieId:main.id,start,end,mainTime:start,insert:false,key:`${main.id}:${start}`});
  for(const id of route.inserts){const clip=inserts.find(c=>c.id===id);if(!clip)throw Error(`Unrendered insert: ${id}`);
   result.push({movieId:id,start:0,end:clip.duration,mainTime:end,insert:true,key:`${main.id}:${end}:${id}`});}
  start=end;
 }
 if(start<main.duration)result.push({movieId:main.id,start,end:main.duration,mainTime:start,insert:false,key:`${main.id}:${start}`});
 return result;
}
/** Switching modes skips earlier supplements and preserves the main video's clock. */
export function resumeSegment(segments:VideoSegment[],time:number){
 const index=segments.findIndex(s=>!s.insert&&time>=s.start&&time<s.end);
 if(index>=0)return index;
 for(let i=segments.length-1;i>=0;i--)if(!segments[i].insert)return i;
 return 0;
}
