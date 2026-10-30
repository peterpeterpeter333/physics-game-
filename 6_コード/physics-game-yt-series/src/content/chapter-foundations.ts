import { levelFoundations } from './university-levels';
import { advancedFoundations, type Foundation } from './chapter-foundations-base';
export type { Foundation } from './chapter-foundations-base';
export const chapterFoundations:Record<string,Foundation>={...advancedFoundations,...levelFoundations};
