export function restoredVideoId(saved:string|null,list:readonly {id:string}[],original:readonly {id:string}[],prep:readonly {id:string;before:string[]}[]=[]):string{
 if(saved&&list.some(c=>c.id===saved))return saved;
 // A previously selected introduction may no longer belong to this unit.
 if(saved&&original.length){
  const before=prep.find(p=>p.id===saved)?.before??[];
  return original.find(c=>before.includes(c.id))?.id??original[0].id;
 }
 return list[0]?.id??'';
}
/** Convert the previous numeric position once; never interpret it in the shorter list. */
export function legacyVideoId(saved:string|null,original:readonly {id:string}[],prep:readonly {id:string;before:string[]}[]):string|null{
 if(saved===null)return null;
 const index=Number(saved);
 if(!Number.isInteger(index)||index<0)return null;
 const seen=new Set<string>();
 const ids=original.flatMap(c=>{
  const introductions=prep.filter(p=>p.before.includes(c.id)&&!seen.has(p.id));
  introductions.forEach(p=>seen.add(p.id));
  return [...introductions.map(p=>p.id),c.id];
 });
 return ids[index]??null;
}
