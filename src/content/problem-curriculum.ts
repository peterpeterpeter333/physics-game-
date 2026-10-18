import catalog from './problem-curriculum.generated.json';
import youtubeIds from './problem-youtube-ids.json';

export type CurriculumSubquestion = {
  number: number;
  prompt: string;
  choices: [string, string, string, string];
  answerIndex: number;
  figure: string;
};
export type CurriculumProblem = {
  id: string;
  stageId: string;
  title: string;
  context: string;
  subquestions: CurriculumSubquestion[];
  solutionFilename: string;
  solutionYoutubeId: string | null;
};

const uploaded = youtubeIds as Record<string, string>;
export const problemCurriculum = (catalog as CurriculumProblem[]).map(problem => ({
  ...problem,
  solutionYoutubeId: uploaded[problem.solutionFilename] ?? null,
}));
export const problemsByStage: Record<string, CurriculumProblem[] | undefined> = {};
for (const problem of problemCurriculum) (problemsByStage[problem.stageId] ??= []).push(problem);
