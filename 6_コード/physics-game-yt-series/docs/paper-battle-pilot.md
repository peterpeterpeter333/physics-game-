# Narrated four-choice battle pilot

Scope: university electromagnetism `ui-field-map`, `um-line-element`, and `ue-integrals` only. Each has three paper-first questions. Each question has a separate original problem film and worked-solution film: 18 H.264/AAC movies, 960×640, 24 fps output, Japanese captions, VOICEVOX Nemo 男声1 narration.

The player keeps four answer choices below the movie. A correct answer strikes the enemy, displays damage, reduces HP, and increases the combo. An incorrect answer opens the solution without damaging the enemy; the learner can retry. Each question can damage the enemy only once. Three solved questions bring HP to zero and unlock victory. No answer deadline or accuracy percentage is shown. Both movie types have playback controls and can be viewed fullscreen. The written problem remains available in a collapsed disclosure.

Scripts and diagrams: `scripts/paper-battle-storyboard.mjs` and `scripts/render-paper-battles.mjs`. Narration uses the existing local Nemo engine (speaker 10001, speed 0.90); displayed 「電場」 is explicitly sent as 「でんば」, and 「電気束」 as 「でんきそく」. Nineteen exact-sentence pronunciation overrides also correct 「負」(ふ), 「上向き」(うえむき), 「毎」(まい), and 「積の和」(せきのわ), with expected kana verified against Nemo. No runtime speech synthesis or engine is shipped. VOICEVOX Nemo credit is burned into every film, including standalone copies.

Rebuild from the repository root with the existing Nemo engine on port 50123:

```
node scripts/render-paper-battles.mjs --plan
EM_FILM_CACHE=/private/tmp/physics-paper-films python scripts/render-em-film-audio.py
FFMPEG=/path/to/ffmpeg node scripts/render-paper-battles.mjs
FFMPEG=/path/to/ffmpeg node scripts/test-paper-battles.mjs
npm run build
npm run test:remediation
```

The complete catalog is published only after every movie is generated. Content hashes in playback URLs prevent stale media after replacement. `--stills` produces scene review images without encoding.

Verification: all 18 files decoded with H.264 video and AAC audio; mathematical markup parsed; all nine choices reviewed against the worked solutions; damage/retry/duplicate-answer/combo/zero-HP logic tested. Representative frames across all nine questions visually reviewed. Safari playback verified for a problem and solution; the introductory battle was manually completed through wrong answer, retry, three correct answers, and victory. The Codex in-app browser crashed on MP4 playback, as previously documented for lesson films; standalone automated Chromium launch was blocked by the host sandbox. These browser limitations are not reported as passing playback tests. No new iOS/App Store binary is submitted by this web update.
