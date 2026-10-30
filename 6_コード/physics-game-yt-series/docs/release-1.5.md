# iOS 1.5 (8) — release checklist

## Scope
- Includes narrated lessons/prerequisites, pronunciation/playlist repairs, and the nine-question video battle pilot (18 MP4s).
- Native iOS launch checks Apple iTunes Lookup for app ID 6811033480 / bundle app.physicsquest.game. Only a strictly newer numeric release triggers a dismissible inline notice; no forced update and no push permission request.
- Same/older versions, missing products, malformed responses, timeouts and offline failures do not block learning. Installed version is read from the native bundle rather than the npm package.
- Notice links only to this app's fixed App Store URL. No progress, answers or user identifiers are sent. Privacy policy describes Apple update-check traffic.
- Notice becomes available after installing 1.5; existing 1.4 installations cannot retroactively show it.
- Top safe-area padding / scroll padding prevents video difficulty tabs hiding under the iPhone status bar.

## Checks
- `node scripts/test-app-update.mjs`: numeric comparisons (including 1.10 vs 1.9), app identity, missing/malformed responses.
- `npm run build`, `npm run test:remediation`.
- `npx cap sync ios` bundles current assets; Xcode UI builds and archives the local iOS project.
- iPhone 17 Pro Max simulator: native App.getInfo returns 1.5 (8); CapacitorHttp reaches Apple; video playback works.

## Store
- Create 1.5, preserve existing first two screenshots, add a third titled「分かりやすい動画解説」.
- Refresh description/release notes/review notes to reflect bundled videos and optional update-check network access.
- Keep existing pricing, release policy, privacy declarations and ratings unless a verified required change is identified.
- Do not mark submitted until App Store Connect shows the review submission state.
