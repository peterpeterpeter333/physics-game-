# Four-line electromagnetic lessons

Scope: university electromagnetism `ue-integrals` and `ue-gauss` only.

The 31 topic groups now contain 385 small explanation slides. Each has at most four authored display lines, one phenomenon diagram and optionally one equation image. A separate FAQ below it has four lines and one interactive SVG. The same topic-specific FAQ remains available throughout that topic; these are 31 distinct FAQs, not 385 different questions.

The original goal, assumptions, beat explanations, diagram-reading instructions, conclusions, mathematics notes and their equation images are retained, in that order. `audit-micro.mjs` checks exact text preservation, equation coverage, line limits, complete FAQ coverage and finite animated geometry. No CSS truncation is used. Long equations scroll horizontally instead of shrinking to illegible sizes. Japanese word segmentation has a character fallback for older browsers and avoids orphaned punctuation where possible.

Main diagrams retain their previously authored stages and electronic-work laboratory. The comparison control replays only the diagram, not the explanatory text or lesson progress; a restore button returns to the text's diagram. FAQ diagrams use separate explanatory models, sliders and opt-in playback. Light markers in flux diagrams indicate direction or intersections, not physical charge flow. Playback is off initially and is cleaned up when changing a slide. Every slide can be selected directly by dots without a completion lock.

## Research and editorial method

Search date: 2026-09-16. Collected questions about line integrals, displacement vs field vectors, potential signs, normals, area elements, offset Gaussian surfaces, symmetry, external charges and conductor cavities. This is a curated collection for these two chapters, not an exhaustive survey or a claim about relative question frequency. Questions and answers are newly written Japanese explanations; community answers are not copied or used as authoritative physics.

Sources are linked under each FAQ in the game:

- [Student understanding of symmetry and Gauss's law of electricity](https://arxiv.org/abs/1602.07376): primary education research identifying difficulties distinguishing field, flux and the symmetry needed to infer a field.
- [OpenStax conceptual questions](https://openstax.org/books/university-physics-volume-2/pages/6-conceptual-questions): prompts about zero flux, external charges, surface size, normal orientation, symmetry and conductors.
- [OpenStax line integrals](https://openstax.org/books/calculus-volume-3/pages/6-2-line-integrals): definitions, parametrization, work and sums.
- [OpenStax surface integrals](https://openstax.org/books/calculus-volume-3/pages/6-6-surface-integrals): orientation, surface coordinates and flux.
- [OpenStax potential difference](https://openstax.org/books/university-physics-volume-2/pages/7-2-electric-potential-and-potential-difference): work, potential and the charge sign.
- [Feynman Lectures II, chapter 4](https://www.feynmanlectures.caltech.edu/II_04.html): Coulomb law, superposition and general flux proof. Historical numerical definitions of SI constants are not adopted.
- [Learner question: off-center charge](https://physics.stackexchange.com/questions/108511/why-does-gausss-law-work-for-a-charge-off-center-in-a-spherical-surface).
- [Learner question: line-integral sign](https://physics.stackexchange.com/questions/436432/potential-difference-from-electric-field-and-line-integral).
- [Learner question: area vector](https://physics.stackexchange.com/questions/14165/how-can-area-be-a-vector).
- [Learner question: conductor cavity](https://physics.stackexchange.com/questions/758903/electric-field-inside-conductor-with-a-cavity).

## Validation

- `npm run test:micro`, `test:math`, `test:lessons`, `test:guided`, `test:calculations`, and production build.
- 385 slide states inspected through the running app at 390px width: body and FAQ line limits, no horizontal document overflow, equation-image loading; no console errors.
- Additional 320px checks and manual verification of FAQ slider/play/pause. Source text/equation preservation is tested independently of the browser.
- General non-guided lessons and battle question data are unchanged.
