# One question per slide

This supersedes the main-flow design in `em-micro-slides.md`.

The first two university electromagnetism lessons now have 12 and 15 main slides respectively, replacing the 385 mechanically paginated screens. Each title poses a distinct question; its answer is one authored short paragraph (80–180 Japanese characters), not the first four lines of a longer passage. There is no fixed four-line clipping or automatic paragraph pagination. Repeated FAQ panels are removed from the main flow. Detailed premises, derivations and mathematics notes remain in an optional disclosure on the relevant slide.

The original `Figure` components are used unchanged for `field-map`, `dot-product`, `line-integral`, `surface-tiles`, `area-vector`, and `flux-tilt`. Their existing playback and interactive controls are retained. The magnetic-field diagrams are explicitly described as B/flux examples, before transferring the same surface-integration concept to electric fields; the original images have not been relabeled as electric fields. The more recent variable-field electron-work laboratory is retained where a numerical line-integral calculation is discussed.

The first chapter progresses from fields vs motion, through local work and line integration, to a concrete calculation, path independence, potential, and surface integration. The second distinguishes the claim, off-center geometry, integrand, substitution, evaluation, and general closed-surface proof, then applications. Auxiliary derivative proofs no longer occupy mandatory slides. All legacy source content remains available in the repository; the two chapters' battle questions and other chapters are unchanged.

`audit-questions.mjs` checks unique question titles, answer-length bounds, valid story references and use of the original line/surface diagrams. It runs in the existing guided-lesson deployment audit.
