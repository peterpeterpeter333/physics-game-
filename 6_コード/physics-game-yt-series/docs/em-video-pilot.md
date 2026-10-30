# 60-second electromagnetism pilot

- Location: university EM → intermediate → 有限和から線積分へ (um-line-integral-entry).
- Delivered file: public/media/em-line-integral-nemo.mp4, 1280×720, 24fps, 60 seconds, H.264 / AAC, faststart. Captions burned in.
- Narration: VOICEVOX Nemo 男声1, speaker 10001, official Nemo Engine 0.24.0, speedScale 0.90. Generated locally; no cloud voice API or runtime speech synthesis.
- Credit appears throughout the movie and in the player. Terms: https://voicevox.hiroshiba.jp/nemo/term/
- Original drawings and script. No 3Blue1Brown assets or voice imitation. Educational reference: visual attention, decomposition, geometric meaning before integral notation.
- This is one introductory film for the intermediate unit, not a rewrite of all intermediate chapters or a complete derivation in 60 seconds. Existing slides remain.

## Physics

Prescribed curve r(u) = (2u, a sin πu); y-scale schematic. q = 1 C, E = (kx/q, 0), k = 1 N/m, x from 0 to 2 m. Work is that done by the electric force, not necessarily total work; the path is not asserted to be a free trajectory.

With x equally partitioned into N intervals and left endpoint force,
W_N = Σ [k·2(i−1)/N]·(2/N) = 2(1−1/N) J.
Thus N=4,8,16,32 gives 1.5,1.75,1.875,1.9375 J; limit 2 J.
The projection sketch is magnified and retains the local tangent direction.

## Rebuild

Requires local official Nemo engine at 127.0.0.1:50123, Python with Pillow, numpy,
imageio-ffmpeg, macOS Hiragino/Arial Unicode fonts, and repository Node dependencies.
Run `node scripts/render-em-pilot-equations.mjs`, then
`python scripts/render-em-pilot.py`. The engine and packages are NOT shipped in the app.
The draft em-films.ts is not involved. Generated narration and formula cache lives in
/private/tmp/physics-nemo-pilot/render. Speech cache keys include the spoken text,
speaker and speed, so edited narration cannot silently reuse old audio.

## Subject clarity review

Every sentence in all seven narration scenes was reviewed for an explicit subject
or topic; captions use the same authored text. Headlines, diagram annotations and
player explanatory paragraphs were also reviewed. Short symbol labels name their
referents (for example, dr = the charge's infinitesimal displacement). Pronouns and
unnamed actions such as 「短い区間なら、ほぼ直線」「力を戻せば、この式」
were replaced with named paths, charges, forces and work. This review applies to
this pilot and its player, not to all existing lessons in the application.
「電場」 remains in display text but is supplied to Nemo as 「でんば」.
Future explanations should identify what changes, what is calculated, and whose
quantity each symbol denotes, without padding the text with meaningless subjects.

## Verification

- Build, TypeScript, narration tests and 136-stage remediation tests pass.
- All encoded video/audio decoded without ffmpeg errors; representative frames visually inspected; missing subscript glyphs corrected with MathJax-rendered equations.
- App player placement confirmed. The Codex in-app browser crashed at MP4 playback in this environment; Safari opened the same MP4 and played with a one-minute duration.
- iPhone App Store binary is not rebuilt/submitted. Voice preference and educational pacing require user feedback.
