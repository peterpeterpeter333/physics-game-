// Cue helpers for the university-mechanics films (visualPilot 'umech-v1').
// D: picture only. E: equation (optionally morphing from prev). Readings are kana with
// spaces between phrases so Nemo segments words correctly; spaces are not spoken as pauses.
// Optional extras on D: {pause, sfx, speed, kana}. kana = phrasing/accent in Nemo's accent-kana
// notation (phrases '/', accent ', pause '、'); its sounds must equal the reading's. speed = Nemo speedScale for that sentence (default .90). pause = seconds of silence after the sentence
// (the picture keeps moving); sfx = [[name, at]] where at is seconds from the sentence
// start, or 'e+1.2' = seconds after the voice ends.
export const D=(subtitle,reading,diagram,extra={})=>({subtitle,reading,display:'diagram',diagram,formula:[],operation:'',...extra});
export const E=(subtitle,reading,formula,{prev=[],op='',note='',size,...extra}={})=>({subtitle,reading,display:'equation',formula,previousFormula:prev,operation:op,note,...(size?{size}:{}),...extra});
export const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading,pause,speed,kana})=>({subtitle,reading,...(pause?{pause}:{}),...(speed?{speed}:{}),...(kana?{kana}:{})})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'umech'});
