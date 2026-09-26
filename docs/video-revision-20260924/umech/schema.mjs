// Cue helpers for the university-mechanics films (visualPilot 'umech-v1').
// D: picture only. E: equation (optionally morphing from prev). Readings are kana with
// spaces between phrases so Nemo segments words correctly; spaces are not spoken as pauses.
export const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,formula:[],operation:''});
export const E=(subtitle,reading,formula,{prev=[],op='',note='',size}={})=>({subtitle,reading,display:'equation',formula,previousFormula:prev,operation:op,note,...(size?{size}:{})});
export const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'umech'});
