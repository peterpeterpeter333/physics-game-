import { ui_mathFigures, ui_mathReadings } from './intro-math';
import { um_mathFigures, um_mathReadings } from './middle-math';
import { ui_mechFigures, ui_mechReadings } from './intro-mechanics';
import { um_mechFigures, um_mechReadings } from './middle-mechanics';
import { ui_emFigures, ui_emReadings } from './intro-em';
import { um_emFigures, um_emReadings } from './middle-em';

/** 初級・中級の図解。IDは ui- / um- で始める。 */
export const levelFigures: Record<string, () => JSX.Element> = {
  ...ui_mathFigures, ...um_mathFigures,
  ...ui_mechFigures, ...um_mechFigures,
  ...ui_emFigures, ...um_emFigures,
};

/** 「この図で見ること」。全図解に必須。 */
export const levelReadings: Record<string, string> = {
  ...ui_mathReadings, ...um_mathReadings,
  ...ui_mechReadings, ...um_mechReadings,
  ...ui_emReadings, ...um_emReadings,
};
