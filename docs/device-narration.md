# Device narration trial

Standard, spiral, and guided lessons use the device Web Speech API. No paid API,
API key, cloned voice, or audio upload was added. Japanese voices are populated
on load and voiceschanged; choice and rate are saved locally. Playback begins
only after a click. A sentence advances only on speech end, not a fixed timer.
Stop resumes from the beginning of the current sentence. Page changes, hidden
documents, unmount, and another player cancel the current session. Stale speech
events are ignored. Missing API and errors leave the readable lesson available.

This is narration of existing explanatory prose, not the completed synchronized
EM film pilot. Animations retain their existing controls. Inline TeX is referred
to as the on-screen formula instead of reading raw TeX; mathematical pronunciation
still needs editorial review. The unused em-films.ts draft is not part of this
release. No MP4 export or App Store binary submission is included.

Verification: node scripts/test-narration.mjs; npm run build;
npm run test:remediation; browser playback with a Japanese device voice.
An iPhone/WKWebView and the user's subjective voice preference still need testing.
