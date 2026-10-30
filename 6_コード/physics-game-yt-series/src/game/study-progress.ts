import type {Problem} from '../types';

export function restoredPage(saved:string|null,count:number){
 const page=Number(saved);
 return Number.isInteger(page)?Math.max(0,Math.min(Math.max(0,count-1),page)):0;
}
export function allQuestionsSolved(problems:Problem[],solved:ReadonlySet<string>){
 return problems.length>0&&problems.every(p=>solved.has(p.id));
}
export function questionsToRetry(problems:Problem[],solved:ReadonlySet<string>){
 const remaining=problems.filter(p=>!solved.has(p.id));
 return remaining.length?remaining:problems;
}
