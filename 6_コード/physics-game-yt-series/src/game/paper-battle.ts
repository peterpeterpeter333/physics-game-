export type PaperBattleState = {solved:string[];combo:number;bestCombo:number;hp:number};
export function paperBattleAnswer(state:PaperBattleState,id:string,correct:boolean,maxHp:number,count:number):PaperBattleState {
  if(state.solved.includes(id))return state;
  if(!correct)return {...state,combo:0};
  const solved=[...state.solved,id],combo=state.combo+1;
  return {solved,combo,bestCombo:Math.max(state.bestCombo,combo),hp:Math.max(0,Math.round(maxHp*(1-solved.length/count)))};
}
