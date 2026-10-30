// Editorial source only. This module is not imported by the app or video renderer.
export const B = (speech, visual, equation = '', symbols = '') => ({speech, visual, equation, symbols});
export const V = (question, ...beats) => ({question, beats});
export const T = (id, title, condition, ...levels) => ({id, title, condition, levels});
