# Physics Quest — コード引き継ぎファイル

**コミット e5fe38b** ／ 作成 2026-09-18

リポジトリ: https://github.com/peterpeterpeter333/physics-game-
公開URL: https://peterpeterpeter333.github.io/physics-game-/

---

## このファイルの読み方（最初に読むAIへ）

ソース全体は **145ファイル・2.77MB** あり、1つの会話には入らない。
このファイルには次を入れてある。

- **全文**: 骨格・状態管理・画面・図の共通部品・監査スクリプト1本（下の「第2部」）
- **抜粋**: コンテンツと図の書き方サンプル（「第3部」）
- **一覧のみ**: 残り全ファイルの名前・サイズ・役割（「第1部」）

コンテンツ本体（`src/content/levels/*.ts` など）と図の本体
（`src/components/figures/levels/*.tsx`）は量が多いので入っていない。
**それらを編集する作業では、該当ファイルをリポジトリから直接開くこと。**
このファイルだけで分かるのは「どう書くか」であって「何が書いてあるか」ではない。

---

# 第1部 — 全ファイル一覧

`●`=このファイルに全文あり　`◐`=抜粋あり　`○`=名前のみ（リポジトリを見ること）

### public/

```
●    1.5 KB  sw.js
```

### scripts/

```
○    3.9 KB  audit-calculations.mjs
○    1.4 KB  audit-em3d.mjs
○    2.0 KB  audit-explanation-quality.mjs
○    4.4 KB  audit-guided.mjs
○    6.3 KB  audit-lessons.mjs
○    4.3 KB  audit-math.mjs
○    2.2 KB  audit-micro.mjs
○    2.1 KB  audit-offline.mjs
○    1.3 KB  audit-questions.mjs
○    3.7 KB  audit-spiral.mjs
○    3.1 KB  audit-study-flow.mjs
○    5.4 KB  audit-university-curriculum.mjs
●   13.0 KB  audit-university-levels.mjs
○    2.4 KB  build-em-film-plan.mjs
○    4.3 KB  build-equations.mjs
○    1.2 KB  check-em-video-media.py
○    2.6 KB  em-film-source.tsx
○    2.5 KB  render-em-film-audio.py
○    6.5 KB  render-em-films.mjs
○    1.3 KB  render-em-pilot-equations.mjs
○   11.3 KB  render-em-pilot.py
○    2.4 KB  test-em-videos.mjs
○    1.8 KB  test-narration.mjs
○    1.6 KB  test-potential-context.mjs
○    3.6 KB  test-remediation.mjs
○   10.5 KB  test-ten-principles.mjs
```

### scripts/audit/

```
○    2.6 KB  defeat.mjs
○    9.9 KB  play.mjs
○    3.2 KB  shots.mjs
```

### src/

```
●    8.0 KB  App.tsx
●    2.7 KB  analytics.ts
●    0.8 KB  config.ts
●    0.6 KB  main.tsx
●    1.7 KB  native.ts
○   29.8 KB  styles.css
●    2.9 KB  types.ts
○    0.0 KB  vite-env.d.ts
```

### src/ai/

```
○    2.8 KB  tutor.ts
```

### src/components/

```
○    3.7 KB  AIChat.tsx
●   13.9 KB  BattleView.tsx
●    4.0 KB  CalculationBoard.tsx
○    0.9 KB  ChapterFoundation.tsx
○   18.5 KB  EMScene3D.tsx
●    7.2 KB  EMVideoLesson.tsx
●    2.2 KB  EMVideoPilot.tsx
○    1.7 KB  EquationMeaning.tsx
○   14.3 KB  FaqAnimation.tsx
○    1.9 KB  FormulaBook.tsx
●    6.9 KB  GuidedLesson.tsx
○   12.5 KB  GuidedScene.tsx
●    5.6 KB  LessonNarration.tsx
○    1.0 KB  LessonOrientation.tsx
●    8.2 KB  LessonView.tsx
●    3.2 KB  LevelBridge.tsx
○    2.7 KB  MathText.tsx
○    4.7 KB  MicroLesson.tsx
○    2.5 KB  MovedMaterial.tsx
○    4.9 KB  PathMeaning.tsx
○    0.9 KB  ProblemMeaning.tsx
○    1.7 KB  QuantityGlossary.tsx
●   12.4 KB  QuestMap.tsx
○    3.5 KB  QuestionLesson.tsx
○    2.9 KB  ReviewView.tsx
○   15.9 KB  RigorousScene.tsx
○    2.6 KB  SettingsView.tsx
●    9.2 KB  SpiralLesson.tsx
○    1.5 KB  StudyAid.tsx
○    7.3 KB  StudyExperiments.tsx
○    0.9 KB  TopicRoute.tsx
○    1.1 KB  em-scene-3d.css
○    1.8 KB  em-video-lesson.css
○    0.4 KB  em-video-pilot.css
○    2.5 KB  em3d-model.ts
○    5.2 KB  guided-lesson.css
○    1.0 KB  lesson-narration.css
○    2.1 KB  micro-lesson.css
○    1.6 KB  question-lesson.css
○    0.7 KB  rigorous-models.ts
○    3.1 KB  spiral-lesson.css
○    2.0 KB  study-flow.css
```

### src/components/figures/

```
○    1.4 KB  Diffraction.tsx
○    2.5 KB  HeatEngine.tsx
○    2.9 KB  PotentialGradient.tsx
○    3.2 KB  anim.ts
○   32.7 KB  em2.tsx
○   15.8 KB  fields.tsx
○    5.6 KB  foundations.tsx
●    8.7 KB  index.tsx
○   20.9 KB  math2.tsx
○   24.8 KB  mech2.tsx
○   13.1 KB  mechanics.tsx
○    6.6 KB  spatial.tsx
○   25.1 KB  univ.tsx
○   19.8 KB  univ2.tsx
○   10.8 KB  univ3.tsx
```

### src/components/figures/levels/

```
●    7.5 KB  base.tsx
○    0.9 KB  index.ts
○  105.2 KB  intro-em.tsx
○   91.2 KB  intro-math.tsx
◐   89.7 KB  intro-mechanics.tsx
○  123.8 KB  middle-em.tsx
○   92.3 KB  middle-math.tsx
○  107.5 KB  middle-mechanics.tsx
```

### src/components/figures/unique/

```
○    7.5 KB  gauss.tsx
○    2.8 KB  index.tsx
○    9.7 KB  integrals.tsx
○    2.4 KB  primitives.tsx
○   16.1 KB  review-electromagnetism.tsx
○   14.1 KB  review-mechanics.tsx
```

### src/content/

```
○   20.5 KB  atomic.ts
○   28.7 KB  chapter-foundations-base.ts
○    0.3 KB  chapter-foundations.ts
○   11.3 KB  clarity-revisions.ts
○   30.3 KB  electromagnetism.ts
○   18.3 KB  em-equation-guides.ts
○   11.4 KB  em-faq.ts
○   28.1 KB  em-learning-flow.ts
○   11.8 KB  em-questions.ts
○   23.3 KB  em-spiral.ts
○   57.3 KB  em-video-narration.ts
○   21.5 KB  figure-readings.ts
○   25.0 KB  formulas.ts
○    4.6 KB  gauss-equation-guides.ts
○   22.7 KB  guided-em.ts
○   33.8 KB  high-school-review.ts
●    1.9 KB  index.ts
○   32.5 KB  learning-paths.ts
○   12.3 KB  lesson-orientation.ts
○    0.5 KB  lesson-text.ts
◐   66.3 KB  mechanics.ts
○    1.8 KB  micro-slides.ts
○   14.6 KB  quantity-glossary.ts
○   45.8 KB  rigorous-em.ts
○   33.3 KB  slide-summaries.ts
○   43.6 KB  study-support.ts
○   26.0 KB  thermo.ts
○   79.7 KB  univ-em.ts
○   70.5 KB  univ-math.ts
○   73.7 KB  univ-mechanics.ts
●   12.5 KB  university-curriculum.ts
●    5.3 KB  university-levels.ts
○    0.4 KB  university-source.ts
○   30.0 KB  waves.ts
```

### src/content/calculations/

```
○   13.6 KB  electromagnetism.ts
○   11.0 KB  fields.ts
○    1.3 KB  index.ts
○    7.9 KB  math.ts
○    7.9 KB  mechanics.ts
○    1.4 KB  schema.ts
○   10.3 KB  university.ts
```

### src/content/explanations/

```
○   16.4 KB  corrections.ts
○   16.3 KB  em-atomic.ts
○    2.7 KB  index.ts
○    5.7 KB  intros.ts
○   17.2 KB  math.ts
○   19.6 KB  mechanics.ts
○    0.5 KB  schema.ts
○   18.0 KB  thermal-waves.ts
○   22.5 KB  univ-em.ts
○   19.9 KB  univ-mechanics.ts
```

### src/content/levels/

```
○   12.3 KB  completion-checks.ts
○    3.6 KB  completion-hints.ts
○    3.8 KB  completion.ts
○   83.1 KB  intro-em.ts
○   67.0 KB  intro-math.ts
◐   72.4 KB  intro-mechanics.ts
○   85.1 KB  middle-em.ts
○   72.4 KB  middle-math.ts
○   87.4 KB  middle-mechanics.ts
●    5.6 KB  schema.ts
```

### src/game/

```
●    1.7 KB  narration.ts
●    1.7 KB  state.ts
●    0.5 KB  study-progress.ts
●    0.6 KB  useLessonPosition.ts
```

---

# 第2部 — 全文

## ビルド設定

### `package.json`

```json
{
  "name": "physics-quest",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "test:em-videos": "node scripts/test-em-videos.mjs",
    "test:remediation": "node scripts/test-remediation.mjs",
    "test:curriculum": "node scripts/audit-university-curriculum.mjs",
    "test:ten-principles": "npm run equations && node scripts/test-ten-principles.mjs",
    "test:micro": "node scripts/audit-micro.mjs",
    "test:levels": "npm run equations && node scripts/audit-university-levels.mjs",
    "test:guided": "npm run equations && node scripts/audit-guided.mjs && node scripts/audit-micro.mjs && node scripts/audit-questions.mjs && node scripts/audit-spiral.mjs && node scripts/audit-em3d.mjs",
    "test:math": "node scripts/audit-math.mjs",
    "test:lessons": "node scripts/audit-lessons.mjs",
    "test:calculations": "npm run equations && node scripts/audit-calculations.mjs",
    "dev": "npm run equations && vite",
    "equations": "node scripts/build-equations.mjs",
    "build": "npm run equations && tsc -b && vite build",
    "preview": "vite preview",
    "sync": "npm run build && npx cap sync",
    "open:android": "npx cap open android",
    "open:ios": "npx cap open ios"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.110.0",
    "@capacitor/android": "^8.5.0",
    "@capacitor/app": "^8.1.1",
    "@capacitor/cli": "^8.5.0",
    "@capacitor/core": "^8.5.0",
    "@capacitor/haptics": "^8.0.2",
    "@capacitor/ios": "^8.5.0",
    "@capacitor/status-bar": "^8.0.3",
    "katex": "^0.16.11",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@capacitor/assets": "^3.0.5",
    "@types/katex": "^0.16.7",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "mathjax-full": "^3.2.2",
    "playwright-core": "^1.63.0",
    "sharp": "^0.35.3",
    "typescript": "^5.6.3",
    "vite": "^5.4.11",
    "vite-plugin-singlefile": "^2.3.3"
  }
}
```

### `vite.config.ts`

```tsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
});
```

### `vite.artifact.config.ts`

```tsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Artifact(単一HTMLファイル)向けビルド設定。
// フォント等の全アセットをdata URIでインライン化し、JS/CSSもHTMLに埋め込む。
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: "./",
  build: {
    outDir: "dist-artifact",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000,
  },
});
```

### `capacitor.config.ts`

```tsx
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // ストアでの識別子。一度公開すると変更できないので注意。
  appId: "app.physicsquest.game",
  appName: "Physics Quest",
  // Viteのビルド成果物をアプリに同梱する (URLを開くだけのラッパーではない)
  webDir: "dist",
  backgroundColor: "#0b1026",
  android: {
    backgroundColor: "#0b1026",
  },
  ios: {
    backgroundColor: "#0b1026",
    // ノッチ/ホームバーを避ける
    contentInset: "always",
  },
};

export default config;
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Audit lessons and animation coverage
        run: npm run test:lessons

      - name: Check whole-curriculum study support and retry behavior
        run: npm run test:remediation

      - name: Verify all electromagnetic movies and source coverage
        run: npm run test:em-videos

      - name: Audit inline math and formula rendering
        run: npm run test:math

      - name: Audit equation images and original storyboards
        run: npm run test:calculations

      - name: Audit offline image handling
        run: node scripts/audit-offline.mjs

      - name: Audit university intro and middle levels
        run: node scripts/audit-university-levels.mjs

      - name: Audit all 29 topics and lossless level relocation
        run: node scripts/audit-university-curriculum.mjs

      - name: Audit chapter-wide learning progression
        run: node scripts/audit-study-flow.mjs

      - name: Check potential and field explanation regressions
        run: node scripts/test-potential-context.mjs

      - name: Audit synchronized electromagnetic lessons
        run: npm run test:guided

      - name: Check all ten teaching principles (regression checks)
        run: npm run test:ten-principles

      - name: Deploy to gh-pages branch
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          # Open tabs can still reference a previous build's hashed equation images.
          keep_files: true
```

### `public/sw.js`

```
// シンプルなオフライン対応: 同一オリジンのGETをキャッシュ(network-first, cache-fallback)
const CACHE = "physics-quest-v2";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith("physics-quest-") && k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // Native video seeking uses 206 responses, which Cache.put cannot store.
  // Do not fill the web offline cache with the entire movie library either.
  if (e.request.headers.has("range") || url.pathname.endsWith(".mp4")) return;
  e.respondWith(
    fetch(e.request)
      .then(async (res) => {
        if (!res.ok) return (await caches.match(e.request)) || res;
        const copy = res.clone();
        e.waitUntil(caches.open(CACHE).then((c) => c.put(e.request, copy)));
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(e.request);
        if (hit) return hit;
        // Never return HTML for a missing image or JavaScript file.
        if (e.request.mode === "navigate") {
          const page = await caches.match(new URL("./index.html", self.registration.scope).href);
          if (page) return page;
        }
        return Response.error();
      })
  );
});
```

### `public/manifest.webmanifest`

```
{
  "name": "Physics Quest — 高校物理RPG",
  "short_name": "PhysicsQuest",
  "description": "高校物理を理解して楽しく攻略するRPG風学習ゲーム",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#0b1026",
  "theme_color": "#0b1026",
  "icons": [
    {
      "src": "./icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
```

## アプリの骨格

### `src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initAnalytics } from "./analytics";
import { initNative } from "./native";
import "./styles.css";

initAnalytics();
initNative();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA: Service Worker 登録 (本番ビルドのみ)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
```

### `src/App.tsx`

```tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { chapters } from "./content";
import { formulas } from "./content/formulas";
import type { Stage } from "./types";
import {
  loadProgress,
  saveProgress,
  type Progress,
} from "./game/state";
import { QuestMap } from "./components/QuestMap";
import { LessonView } from "./components/LessonView";
import { BattleView } from "./components/BattleView";
import { FormulaBook } from "./components/FormulaBook";
import { ReviewView } from "./components/ReviewView";
import { SettingsView } from "./components/SettingsView";
import { AIChat } from "./components/AIChat";
import { FigureGallery } from "./components/figures";
import { analytics } from "./analytics";
import { SHOW_AI_CHAT } from "./config";

type View =
  | { type: "map" }
  | { type: "lesson"; stageId: string }
  | { type: "battle"; stageId: string }
  | { type: "formulas" }
  | { type: "review" }
  | { type: "settings" };

function findStage(stageId: string): Stage {
  for (const c of chapters) {
    const s = c.stages.find((s) => s.id === stageId);
    if (s) return s;
  }
  throw new Error(`unknown stage: ${stageId}`);
}
function nextStage(stageId:string){
 const chapter=chapters.find(c=>c.stages.some(s=>s.id===stageId));
 if(!chapter)return undefined;
 return chapter.stages[chapter.stages.findIndex(s=>s.id===stageId)+1];
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const isGallery = typeof window !== "undefined" && window.location.hash.startsWith("#figs");
  const [view, setView] = useState<View>({ type: "map" });
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => saveProgress(progress), [progress]);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((p) => fn(p));
  }, []);

  const chatContext = useMemo(() => {
    if (view.type === "lesson") {
      const s = findStage(view.stageId);
      return `レッスン「${s.lesson.title}」(${s.title})を学習中。レッスン内容の要約: ${s.lesson.intro}`;
    }
    if (view.type === "battle") {
      const s = findStage(view.stageId);
      return `ステージ「${s.title}」の問題演習中。出題範囲: ${s.subtitle}`;
    }
    if (view.type === "formulas") return "公式集を閲覧中。";
    return "クエストマップ(単元選択画面)を閲覧中。";
  }, [view]);

  if (isGallery) {
    return (
      <div className="app">
        <div className="app-inner">
          <FigureGallery />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-inner">
        {view.type === "map" && (
          <QuestMap
            chapters={chapters}
            progress={progress}
            onOpenLesson={(id) => {
              analytics.lessonStart(id);
              setView({ type: "lesson", stageId: id });
            }}
            onOpenBattle={(id) => {
              analytics.battleStart(id);
              setView({ type: "battle", stageId: id });
            }}
          />
        )}
        {view.type === "lesson" && (
          <LessonView
            key={view.stageId}
            stage={findStage(view.stageId)}
            onOpenStage={(id) => setView({ type: "lesson", stageId: id })}
            onExit={() => setView({ type: "map" })}
            onComplete={(firstTime) => {
              const stage = findStage(view.stageId);
              analytics.lessonComplete(view.stageId);
              analytics.battleStart(view.stageId);
              update((p) => ({
                ...p,
                xp: p.xp + (firstTime ? 20 : 0),
                finishedLessons: p.finishedLessons.includes(stage.lesson.id)
                  ? p.finishedLessons
                  : [...p.finishedLessons, stage.lesson.id],
              }));
              setView({ type: "battle", stageId: view.stageId });
            }}
            alreadyFinished={progress.finishedLessons.includes(findStage(view.stageId).lesson.id)}
          />
        )}
        {view.type === "battle" && (
          <BattleView
            key={view.stageId}
            nextStageTitle={nextStage(view.stageId)?.title}
            stage={findStage(view.stageId)}
            starred={progress.starred}
            onToggleStar={(pid) =>
              update((p) => ({
                ...p,
                starred: p.starred.includes(pid)
                  ? p.starred.filter((x) => x !== pid)
                  : [...p.starred, pid],
              }))
            }
            onAnswer={(correct) =>
              update((p) => ({
                ...p,
                totalAnswered: p.totalAnswered + 1,
                totalCorrect: p.totalCorrect + (correct ? 1 : 0),
              }))
            }
            firstClear={!progress.clearedStages.includes(view.stageId)}
            onFinish={(xp, cleared, bestCombo, continueNext) => {
              if (cleared) analytics.battleVictory(view.stageId);
              else analytics.battleDefeat(view.stageId);
              update((p) => ({
                ...p,
                xp: p.xp + xp,
                bestCombo: Math.max(p.bestCombo, bestCombo),
                clearedStages:
                  cleared && !p.clearedStages.includes(view.stageId)
                    ? [...p.clearedStages, view.stageId]
                    : p.clearedStages,
              }));
              const next=continueNext&&cleared?nextStage(view.stageId):undefined;
              setView(next?{type:'lesson',stageId:next.id}:{ type: "map" });
            }}
            onExit={() => setView({ type: "map" })}
          />
        )}
        {view.type === "formulas" && (
          <FormulaBook
            formulas={formulas}
            onOpenLesson={(stageId) => setView({ type: "lesson", stageId })}
          />
        )}
        {view.type === "review" && (
          <ReviewView
            chapters={chapters}
            starred={progress.starred}
            onToggleStar={(pid) =>
              update((p) => ({
                ...p,
                starred: p.starred.filter((x) => x !== pid),
              }))
            }
          />
        )}
        {view.type === "settings" && (
          <SettingsView
            onResetProgress={() => {
              if (confirm("学習の進行状況をすべてリセットします。よろしいですか?")) {
                localStorage.removeItem("physics-quest-progress-v1");
                setProgress(loadProgress());
              }
            }}
          />
        )}
      </div>

      {view.type !== "battle" && (
        <nav className="bottom-nav">
          <button
            className={view.type === "map" ? "active" : ""}
            onClick={() => setView({ type: "map" })}
          >
            <span className="nav-icon">🗺️</span>クエスト
          </button>
          <button
            className={view.type === "formulas" ? "active" : ""}
            onClick={() => {
              analytics.formulaBookOpen();
              setView({ type: "formulas" });
            }}
          >
            <span className="nav-icon">📖</span>公式集
          </button>
          <button
            className={view.type === "review" ? "active" : ""}
            onClick={() => {
              analytics.reviewOpen();
              setView({ type: "review" });
            }}
          >
            <span className="nav-icon">⭐</span>復習
          </button>
          <button
            className={view.type === "settings" ? "active" : ""}
            onClick={() => setView({ type: "settings" })}
          >
            <span className="nav-icon">⚙️</span>設定
          </button>
        </nav>
      )}

      {SHOW_AI_CHAT && (
        <button
          className="chat-fab"
          onClick={() => {
            analytics.chatOpen();
            setChatOpen(true);
          }}
          title="AI先生に質問"
        >
          🤖
        </button>
      )}
      {SHOW_AI_CHAT && chatOpen && (
        <AIChat context={chatContext} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}
```

### `src/types.ts`

```tsx
// コンテンツのデータ型。数式は文字列中に $...$ (インライン) / $$...$$ (ブロック) で埋め込む。

export type LessonStep = {
  /** Stable provenance: filtering/reordering must never change which summary is shown. */
  sourceStageId?: string;
  sourceSlideIndex?: number;
  summary?: string;
  /** A synchronized, learner-controlled visual explanation. */
  story?: {
    scene: string;
    goal?: string;
    basis?: string;
    result?: string;
    goalTex?: string;
    notes?: { title:string; text:string; tex:string }[];
    beats: { action: string; text: string; focus: string; tex?: string }[];
    check?: { question: string; choices: { text: string; feedback: string }[]; answer: number };
  };
  /** University prerequisites, explained in place instead of requiring an earlier stage. */
  review?: boolean;
  /** 初級・中級の一段を構成する四拍子。画面に札として出す。 */
  beat?: '基本事項' | '疑問' | '解決' | '新しい基本事項';
  /** この1枚が担う役割。1枚につき1つだけ。 */
  role?: '観察' | '問い' | '操作' | '解釈' | '固定';
  heading: string;
  body: string;
  /** アニメーション図解のID (src/components/figures 参照) */
  figure?: string;
  /** 強調表示する公式 (KaTeX、$は不要) */
  formula?: string;
  /** 公式の意味の一言メモ */
  formulaNote?: string;
};

export type Lesson = {
  id: string;
  title: string;
  intro: string;
  steps: LessonStep[];
  /** Material relocated from advanced lessons; optional, not repeated in the main flow. */
  supplements?: LessonStep[];
  /** レッスンの締め: 何が理解できたか */
  outro: string;
};

export type Problem = {
  id: string;
  difficulty: 1 | 2 | 3;
  question: string;
  choices: string[];
  answerIndex: number;
  /** 理解重視: 解法の筋道の解説 */
  explanation: string;
  hint: string;
};

export type Stage = {
  id: string;
  title: string;
  subtitle: string;
  lesson: Lesson;
  problems: Problem[];
  enemy: {
    name: string;
    emoji: string;
    maxHp: number;
  };
};

/** 大学編は同じ主題を初級・中級・上級の三段階で扱う。既存章は level を持たず上級として表示する。 */
export type ChapterLevel = 'intro' | 'middle' | 'advanced';

export type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  stages: Stage[];
  /** 大学編の三段階。省略した既存章は上級として扱う。 */
  level?: ChapterLevel;
  /** 同じ主題の初級・中級・上級を束ねる識別子。 */
  familyId?: string;
  /** 先に見ておくと楽な章（ロックはしない）。 */
  recommendedPrevious?: string[];
};

export type Formula = {
  id: string;
  name: string;
  tex: string;
  meaning: string;
  /** 分野名 (公式集のグループ表示に使う) */
  category: string;
  /** 導出があるレッスンのステージID */
  stageId?: string;
};
```

### `src/config.ts`

```tsx
// 機能フラグ。ビルド先によって出し分ける。

import { Capacitor } from "@capacitor/core";

/**
 * AI先生(Claudeチャット)を表示するか。
 *
 * ストア審査では「利用者が自分でAPIキーを用意しないと動かない機能」が
 * 審査員に検証できず、リジェクト理由になり得る(App Store ガイドライン 2.1)。
 * そのため**ネイティブアプリ版では既定でオフ**にし、Web版でのみ有効にする。
 *
 * ネイティブでもAI先生を出したくなったら、
 * サーバー側プロキシ(キーをサーバーに置く)を用意してから true にすること。
 */
export const SHOW_AI_CHAT = !Capacitor.isNativePlatform();

/** ストア表示用のアプリ名 */
export const APP_NAME = "Physics Quest";
```

### `src/native.ts`

```tsx
// ネイティブ機能(iOS/Android)。Webで開いたときは何もしない。
// Capacitor の各プラグインは Web でも安全に呼べるが、明示的に分岐しておく。

import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";

export const isNative = Capacitor.isNativePlatform();

/** アプリ起動時の初期化(ステータスバーの色など) */
export async function initNative() {
  if (!isNative) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#0b1026" });
    }
  } catch {
    /* 端末によっては未対応。無視してよい */
  }
}

/** Androidの戻るボタン。呼び出し側で「戻る先」を返す */
export function onBackButton(handler: () => boolean) {
  if (!isNative) return () => {};
  const p = App.addListener("backButton", () => {
    // handler が true を返したらアプリ内で戻る。false なら何もしない。
    handler();
  });
  return () => {
    p.then((h) => h.remove());
  };
}

/** 正解時の軽い振動 */
export function hapticSuccess() {
  if (!isNative) return;
  Haptics.notification({ type: NotificationType.Success }).catch(() => {});
}

/** 不正解時の振動 */
export function hapticError() {
  if (!isNative) return;
  Haptics.notification({ type: NotificationType.Error }).catch(() => {});
}

/** ボタンを押した感触 */
export function hapticTap() {
  if (!isNative) return;
  Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
}
```

### `src/analytics.ts`

```tsx
// 利用状況の計測。
//
// 方針:
// - 個人を特定する情報は一切送らない (Cookieなし・IDなし・入力内容も送らない)
// - 送るのは「どのステージで何が起きたか」という匿名の行動イベントだけ
// - 未設定(siteId が空)のときは完全に無効。通信も一切しない
//
// 設定方法は README の「利用状況の計測」を参照。

type Provider = "umami" | "goatcounter" | "none";

// ▼ ここを書き換えるだけで有効になる ▼
const PROVIDER: Provider = "none";
const SITE_ID = ""; // umami: Website ID / goatcounter: サブドメイン名
// ▲▲▲

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
    goatcounter?: { count: (opts: { path: string; title?: string; event: boolean }) => void };
  }
}

let ready = false;

/** 計測スクリプトを読み込む (アプリ起動時に1回だけ呼ぶ) */
export function initAnalytics() {
  if (PROVIDER === "none" || !SITE_ID || import.meta.env.DEV) return;

  const s = document.createElement("script");
  s.defer = true;

  if (PROVIDER === "umami") {
    s.src = "https://cloud.umami.is/script.js";
    s.setAttribute("data-website-id", SITE_ID);
  } else {
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", `https://${SITE_ID}.goatcounter.com/count`);
  }

  s.onload = () => {
    ready = true;
  };
  document.head.appendChild(s);
}

/** 行動イベントを送る。失敗してもアプリの動作には一切影響させない */
export function track(event: string, data?: Record<string, string | number>) {
  if (PROVIDER === "none" || !ready) return;
  try {
    if (PROVIDER === "umami") {
      window.umami?.track(event, data);
    } else {
      // GoatCounter は path をイベント名として扱う
      const suffix = data?.stage ? `/${data.stage}` : "";
      window.goatcounter?.count({ path: `${event}${suffix}`, event: true });
    }
  } catch {
    /* 計測の失敗でユーザー体験を壊さない */
  }
}

// ---- アプリ内で使うイベント定義 (名前をここに集約して表記ゆれを防ぐ) ----

export const analytics = {
  lessonStart: (stage: string) => track("lesson-start", { stage }),
  lessonComplete: (stage: string) => track("lesson-complete", { stage }),
  battleStart: (stage: string) => track("battle-start", { stage }),
  battleVictory: (stage: string) => track("battle-victory", { stage }),
  battleDefeat: (stage: string) => track("battle-defeat", { stage }),
  chatOpen: () => track("chat-open"),
  formulaBookOpen: () => track("formulas-open"),
  reviewOpen: () => track("review-open"),
};
```

## 状態管理（src/game 全部）

### `src/game/state.ts`

```tsx
// 進行状況。サーバー不要、すべて localStorage に保存する。

export type Progress = {
  xp: number;
  clearedStages: string[];
  finishedLessons: string[];
  starred: string[]; // あとで復習したい問題ID
  bestCombo: number;
  totalCorrect: number;
  totalAnswered: number;
};

const KEY = "physics-quest-progress-v1";

export const emptyProgress: Progress = {
  xp: 0,
  clearedStages: [],
  finishedLessons: [],
  starred: [],
  bestCombo: 0,
  totalCorrect: 0,
  totalAnswered: 0,
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...emptyProgress };
    return { ...emptyProgress, ...JSON.parse(raw) };
  } catch {
    return { ...emptyProgress };
  }
}

export function saveProgress(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

// レベル曲線: level n に必要な累計XP = 60 * (n-1)^2
export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 60)) + 1;
}

export function xpForLevel(level: number): number {
  return 60 * (level - 1) * (level - 1);
}

export function levelProgress(xp: number): { level: number; ratio: number; into: number; needed: number } {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const into = xp - base;
  const needed = next - base;
  return { level, ratio: Math.min(1, into / needed), into, needed };
}

// APIキー (AIチャット用・端末内にのみ保存)
const API_KEY_KEY = "physics-quest-api-key";
export function loadApiKey(): string {
  return localStorage.getItem(API_KEY_KEY) ?? "";
}
export function saveApiKey(key: string) {
  if (key) localStorage.setItem(API_KEY_KEY, key);
  else localStorage.removeItem(API_KEY_KEY);
}
```

### `src/game/study-progress.ts`

```tsx
import type {Problem} from '../types';

export function restoredPage(saved:string|null,count:number){
 const page=Number(saved);
 return Number.isInteger(page)?Math.max(0,Math.min(Math.max(0,count-1),page)):0;
}
export function allQuestionsSolved(problems:Problem[],solved:ReadonlySet<string>){
 return problems.length>0&&problems.every(p=>solved.has(p.id));
}
export function questionsToRetry(problems:Problem[],solved:ReadonlySet<string>){
 const remaining=problems.filter(p=>!solved.has(p.id));
 return remaining.length?remaining:problems;
}
```

### `src/game/useLessonPosition.ts`

```tsx
import { useEffect, useState } from 'react';
import {restoredPage} from './study-progress';

/** Storage failure (private mode or full storage) must not prevent learning. */
export function useLessonPosition(id: string, count: number) {
  const key = `physics-quest:lesson-position:${id}`;
  const [page, setPage] = useState(() => {
    try {
      return restoredPage(localStorage.getItem(key),count);
    } catch { return 0; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, String(page)); } catch { /* Nonessential storage. */ }
  }, [key, page]);
  return [page, setPage] as const;
}
```

### `src/game/narration.ts`

```tsx
/** Do not feed raw TeX commands to a device voice. Complex displayed formulae
 * remain on screen; their explanatory prose is narrated instead. */
export function speechText(text: string): string {
  return text.replace(/\$[^$]+\$/g, '（画面の式）').replace(/\*\*/g, '')
    .replace(/ε₀/g, '真空の誘電率').replace(/θ/g, 'シータ').replace(/φ/g, 'ファイ')
    .replace(/Δ/g, 'デルタ').replace(/∇/g, 'ナブラ').replace(/∂/g, '偏微分')
    .replace(/²/g, 'の二乗').replace(/³/g, 'の三乗').replace(/·|×/g, 'かける')
    .replace(/−/g, 'マイナス').replace(/=/g, 'イコール').replace(/→/g, '、次に、');
}
export function sentences(text: string): string[] {
  return (text.match(/[^。！？\n]+[。！？]?/g) ?? []).map(s=>s.trim()).filter(Boolean);
}

/** A single owner across the page, including embedded supplemental lessons. */
let owner: (()=>void) | undefined;
export function claimNarration(stop: ()=>void) {
  owner?.(); owner=stop;
  return ()=>{if(owner===stop) owner=undefined;};
}

let activeSession: NarrationSession | undefined;
export class NarrationSession {
  private generation=0;
  constructor(private synth: Pick<SpeechSynthesis,'speak'|'cancel'>) {}
  stop() {this.generation++; if(activeSession===this){activeSession=undefined;this.synth.cancel();}}
  speak(utterance: SpeechSynthesisUtterance, done: ()=>void, error: (message:string)=>void) {
    activeSession?.stop(); this.stop(); activeSession=this; const token=this.generation;
    utterance.onend=()=>{if(token===this.generation) done();};
    utterance.onerror=e=>{if(token===this.generation) error(e.error);};
    this.synth.speak(utterance);
  }
}
```

## コンテンツ組み立ての背骨

### `src/content/index.ts`

```tsx
import type { Chapter } from "../types";
import { mechanics } from "./mechanics";
import { thermo } from "./thermo";
import { waves } from "./waves";
import { electromagnetism } from "./electromagnetism";
import { atomic } from "./atomic";
import { universitySource } from './university-source';
import { removedIndices, topicById } from './university-curriculum';
import { enrichChapters } from './explanations';
import { levelChapters } from './university-levels';
import { studySupport } from './study-support';

// 高校物理の5分野 + 大学編3分野。分野間は独立(学校の進度に合わせてどこからでも始められる)。
// 全ステージを自由に選べる。説明は主題ごとの手書きの補足を組み込む。
// 大学編は「数学の武器庫」→「力学」→「電磁気」の順に進むのを推奨(内容が積み上がる)。
export const chapters: Chapter[] = enrichChapters([
  mechanics,
  thermo,
  waves,
  electromagnetism,
  atomic,
]).concat(universitySource.map(chapter=>({...chapter,level:'advanced' as const,
 stages:chapter.stages.map(stage=>stage.lesson.steps[0]?.story?stage:{...stage,
  subtitle:topicById[stage.id].advanced,
  lesson:{...stage.lesson,intro:topicById[stage.id].advanced,
   steps:stage.lesson.steps.map((step,i)=>({...step,sourceStageId:stage.id,sourceSlideIndex:i}))
    .filter(step=>!removedIndices(stage.id).has(step.sourceSlideIndex)),
  },
 }),
}))).concat(levelChapters).map(chapter=>({...chapter,stages:chapter.stages.map(stage=>{
 const aid=studySupport[stage.id];
 if(!aid)throw new Error(`Missing reviewed study support: ${stage.id}`);
 const swap=stage.id.length%2===1;
 return {...stage,problems:[...stage.problems,{
  id:`review-${stage.id}`,difficulty:1 as const,question:aid.question,
  choices:swap?[aid.choices[1],aid.choices[0]]:[...aid.choices],answerIndex:swap?1:0,
  hint:aid.focus,explanation:`${aid.focus} ${aid.why}`,
 }]};
})}));
```

### `src/content/levels/schema.ts`

```tsx
import type { Chapter, LessonStep, Problem, Stage } from '../../types';
import type { LearningUnit } from '../learning-paths';
import type { LessonOrientation } from '../lesson-orientation';
import type { CalculationRule } from '../calculations/schema';
import type { Foundation } from '../chapter-foundations';

/** 初級・中級ステージの執筆形式。
 * 既存の上級編（univ-math / univ-mechanics / univ-em）は一切変更しない。
 * ここで書いたものは builder が Stage・学習経路・記号表・計算行へ展開する。 */

export const r = String.raw;

/** 一段の四拍子。画面に札として出るので、必ずこの順で並べる。 */
export type Beat = '基本事項' | '疑問' | '解決' | '新しい基本事項';

/** 1枚のスライドが担う役割。1枚に1つだけ持たせる。
 * 観察=図が主役 / 問い=具体的な疑問を一文 / 操作=式変形を一手 / 解釈=式と図を対応づける / 固定=新しい基本事項を言い切る */
export type SlideRole = '観察' | '問い' | '操作' | '解釈' | '固定';

export type LevelSlide = {
  /** 疑問形を基本とする見出し。計算行の対応キーにもなるので全教材で一意にする。 */
  heading: string;
  /** 画面前面の説明。150字以内（audit-study-flow が上限を検査する）。 */
  body: string;
  /** REGISTRY に登録した図解ID。全スライド必須。 */
  figure: string;
  beat: Beat;
  /** この1枚の役割。本文は最大5行、式変形は一手まで。 */
  role?: SlideRole;
  /** 強調表示する式（KaTeX、$ は不要）。 */
  formula?: string;
  formulaNote?: string;
  /** 「式を一段ずつ追う」に出す変形。note に変形の理由を書く。 */
  calculation?: { note: string; tex: string }[];
};

/** 上級編の到達点を予告するカード。分からなくてよい、で終わらせないための対応表。 */
export type AdvancedPreview = {
  /** 上級編での到達点（KaTeX、$ は不要）。 */
  goal: string;
  /** 今できればよいこと。 */
  now: string;
  /** 後で増えるもの。 */
  later: string;
};

export type LevelStage = {
  id: string;
  title: string;
  subtitle: string;
  enemy: { name: string; emoji: string; maxHp: number };
  /** 章のテーマ（LessonOrientation の theme）。 */
  theme: string;
  /** 目標の式・性質（LessonOrientation の goal）。26字以上。 */
  goal: string;
  intro: string;
  outro: string;
  /** 学習の段。end は排他的で、最後の end はスライド総数に一致させる。1段は2枚以上。 */
  units: LearningUnit[];
  /** 出発点・使える条件・数値例。「基本事項」を畳んで置く欄。 */
  foundation: Foundation;
  /** この章での記号の意味。base 分と合わせて8件以上になるようにする。 */
  glossary: Record<string, string>;
  slides: LevelSlide[];
  problems: Problem[];
  preview?: AdvancedPreview;
  /** 対応する上級ステージID。上級の入口に復習リンクとして出る。 */
  leadsTo?: string[];
};

export type LevelChapter = {
  id: string;
  title: string;
  subtitle: string;
  familyId: 'umath' | 'umech' | 'uem';
  level: 'intro' | 'middle';
  stages: LevelStage[];
};

export type BuiltLevelChapter = {
  chapter: Chapter;
  orientations: Record<string, LessonOrientation>;
  paths: Record<string, LearningUnit[]>;
  glossaries: Record<string, Record<string, string>>;
  foundations: Record<string, Foundation>;
  calculations: CalculationRule[];
  previews: Record<string, AdvancedPreview>;
};

function toStep(slide: LevelSlide): LessonStep {
  return {
    heading: slide.heading,
    body: slide.body,
    figure: slide.figure,
    beat: slide.beat,
    ...(slide.role ? { role: slide.role } : {}),
    ...(slide.formula ? { formula: slide.formula } : {}),
    ...(slide.formulaNote ? { formulaNote: slide.formulaNote } : {}),
  };
}

function toStage(stage: LevelStage): Stage {
  return {
    id: stage.id,
    title: stage.title,
    subtitle: stage.subtitle,
    enemy: stage.enemy,
    lesson: {
      id: `lesson-${stage.id}`,
      title: stage.theme,
      intro: stage.intro,
      outro: stage.outro,
      steps: stage.slides.map(toStep),
    },
    problems: stage.problems,
  };
}

/** 執筆形式を、アプリ側の各レジストリが読める形へ展開する。 */
export function buildLevelChapter(source: LevelChapter): BuiltLevelChapter {
  const orientations: Record<string, LessonOrientation> = {};
  const paths: Record<string, LearningUnit[]> = {};
  const glossaries: Record<string, Record<string, string>> = {};
  const foundations: Record<string, Foundation> = {};
  const previews: Record<string, AdvancedPreview> = {};
  const calculations: CalculationRule[] = [];
  for (const stage of source.stages) {
    orientations[stage.id] = { theme: stage.theme, goal: stage.goal };
    paths[stage.id] = stage.units;
    glossaries[stage.id] = stage.glossary;
    foundations[stage.id] = stage.foundation;
    if (stage.preview) previews[stage.id] = stage.preview;
    for (const slide of stage.slides) {
      if (!slide.calculation?.length) continue;
      calculations.push({
        headings: [slide.heading],
        calculation: { title: '式を一段ずつ追う', lines: slide.calculation },
      });
    }
  }
  return {
    chapter: {
      id: source.id,
      title: source.title,
      subtitle: source.subtitle,
      familyId: source.familyId,
      level: source.level,
      stages: source.stages.map(toStage),
    },
    orientations,
    paths,
    glossaries,
    foundations,
    calculations,
    previews,
  };
}
```

### `src/content/university-levels.ts`

```tsx
import type { Chapter } from '../types';
import { buildLevelChapter, type AdvancedPreview, type BuiltLevelChapter } from './levels/schema';
import { ui_math } from './levels/intro-math';
import { um_math } from './levels/middle-math';
import { ui_mech } from './levels/intro-mechanics';
import { um_mech } from './levels/middle-mechanics';
import { ui_em } from './levels/intro-em';
import { um_em } from './levels/middle-em';
import { completeUniversityLevels } from './levels/completion';
import { universityCurriculum } from './university-curriculum';

/** 大学編の三段階。既存の三章は上級として保存し、初級・中級を足す。
 * 上級をロックする仕組みは作らない。初級を終えていなくても上級を開ける。 */

export type LevelKey = 'intro' | 'middle' | 'advanced';

export const levelLabels: Record<LevelKey, string> = {
  intro: '初級',
  middle: '中級',
  advanced: '上級',
};

export type UniversityFamily = {
  id: 'umath' | 'umech' | 'uem';
  title: string;
  icon: string;
  /** 三段階それぞれの章IDと、一行の案内。 */
  levels: { level: LevelKey; chapterId: string; tagline: string }[];
};

export const universityFamilies: UniversityFamily[] = [
  {
    id: 'umath',
    title: '数学の武器庫',
    icon: '📐',
    levels: [
      { level: 'intro', chapterId: 'ui-math', tagline: '図と小さな計算で、変化を読む' },
      { level: 'middle', chapterId: 'um-math', tagline: '記号とグラフで、変化を式にする' },
      { level: 'advanced', chapterId: 'umath', tagline: '微分・積分・ベクトル・微分方程式' },
    ],
  },
  {
    id: 'umech',
    title: '力学',
    icon: '🚀',
    levels: [
      { level: 'intro', chapterId: 'ui-mech', tagline: '動き・力・仕事を小さく追う' },
      { level: 'middle', chapterId: 'um-mech', tagline: '変化する運動を式で追う' },
      { level: 'advanced', chapterId: 'umech', tagline: '運動方程式から回転・振動へ' },
    ],
  },
  {
    id: 'uem',
    title: '電磁気学',
    icon: '🧲',
    levels: [
      { level: 'intro', chapterId: 'ui-em', tagline: '矢印の地図と、道・面の小片' },
      { level: 'middle', chapterId: 'um-em', tagline: '電場・磁場を足し合わせる' },
      { level: 'advanced', chapterId: 'uem', tagline: '線積分・面積分からマクスウェル方程式へ' },
    ],
  },
];

/** 既存の上級章ID → 所属する系列。既存データは書き換えず、表示だけを束ねる。 */
export const advancedFamilyOf: Record<string, UniversityFamily['id']> = {
  umath: 'umath',
  umech: 'umech',
  uem: 'uem',
};

const built: BuiltLevelChapter[] = completeUniversityLevels([ui_math, um_math, ui_mech, um_mech, ui_em, um_em]
  .filter(source => source.stages.length > 0)
  .map(buildLevelChapter));

const merge = <T,>(pick: (b: BuiltLevelChapter) => Record<string, T>): Record<string, T> =>
  Object.assign({}, ...built.map(pick));

/** 初級・中級の章。既存 chapters の後ろに連結する。 */
export const levelChapters: Chapter[] = built.map(b => b.chapter);
export const levelOrientations = merge(b => b.orientations);
export const levelPaths = merge(b => b.paths);
export const levelGlossaries = merge(b => b.glossaries);
export const levelFoundations = merge(b => b.foundations);
export const levelPreviews: Record<string, AdvancedPreview> = merge(b => b.previews);
export const levelCalculations = built.flatMap(b => b.calculations);

/** 初級・中級ステージID → 所属系列。記号表の基本セットを選ぶのに使う。 */
export const levelFamilyOfStage: Record<string, UniversityFamily['id']> = {};
for (const source of levelChapters) {
  for (const stage of source.stages) levelFamilyOfStage[stage.id] = source.familyId as UniversityFamily['id'];
}

/** 初級・中級ステージのID集合。監査スクリプトが既存56ステージと区別するために使う。 */
export const levelStageIds = new Set(levelChapters.flatMap(c => c.stages.map(s => s.id)));

/** 上級ステージ → その準備になる初級・中級ステージ。上級の入口に復習リンクとして出す。 */
export const preparationFor: Record<string, { id: string; title: string; level: LevelKey }[]> = {};
for(const topic of universityCurriculum){
 preparationFor[topic.id]=(['intro','middle'] as const).map(level=>{
  const stage=levelChapters.flatMap(c=>c.stages).find(s=>s.id===topic[level].id)!;
  return {id:stage.id,title:stage.title,level};
 });
}
for (const source of [ui_math, um_math, ui_mech, um_mech, ui_em, um_em]) {
  for (const stage of source.stages) {
    for (const advanced of stage.leadsTo ?? []) {
      if(!preparationFor[advanced]?.some(s=>s.id===stage.id))
       (preparationFor[advanced] ??= []).push({ id: stage.id, title: stage.title, level: source.level });
    }
  }
}

/** 上級の入口に置く共通の部品リスト。初級・中級で身につけた読み方を一枚にまとめたもの。 */
export const advancedToolkit = [
  '変わる量は、小さい区間の「値×幅」を足す',
  '内積は、進む向き／面を貫く向きの成分だけを取る',
  'Σは有限個の和、∫は分割を限りなく細かくした極限',
  '式を使う前に、対象・座標・向き・初期条件・適用範囲を決める',
];
```

### `src/content/university-curriculum.ts`

```tsx
/** Reviewed destinations for every university topic. Indices refer to the immutable,
 * enriched source lesson, never to the already filtered advanced lesson. */
export type Placement = { id:string; slides:number[]; goal:string };
export type UniversityTopic = { id:string; family:'umath'|'umech'|'uem'; intro:Placement; middle:Placement; advanced:string };
const p=(id:string,slides:number[],goal:string):Placement=>({id,slides,goal});
export const universityCurriculum:UniversityTopic[]=[
 {id:'um-derivative',family:'umath',intro:p('ui-average-to-now',[0,1],'位置の記録から平均速度を求め、区間を短くする意味を図で読む。'),middle:p('um-average-rate',[2,3,4,5,7],'差商を展開して極限をとり、微分係数を数値と式で求める。'),advanced:'べき関数・三角関数の微分を導き、微分できない点も判別する。'},
 {id:'um-integral',family:'umath',intro:p('ui-area-is-distance',[0,1],'速度と時間の積を足し、変位と道のりを区別して求める。'),middle:p('um-sum-to-integral',[2,3,4,5,7,8],'有限和の極限を定積分と結び、積分定数と上下限を区別する。'),advanced:'微積分の基本定理から定積分を計算し、初期条件付きの位置を求める。'},
 {id:'um-rules',family:'umath',intro:p('ui-function-rules',[0,3,7],'二段の関数と積の変化を具体例で読み、何を微分するかを決める。'),middle:p('um-function-rules',[1,4,5,8,9],'連鎖律・積の微分・偏微分を使い、内側の変化と固定する変数を明示する。'),advanced:'差の比の極限から微分法則を証明し、複数変数が同時に変わる場合へ進む。'},
 {id:'um-taylor',family:'umath',intro:p('ui-approximation',[0,1,2],'ラジアンと小角近似の意味を確かめ、近似と等式を区別する。'),middle:p('um-approximation',[3,4,5,8],'接線と二次式で関数を近似し、捨てる項から使える範囲を見積もる。'),advanced:'テイラー係数を導き、安定点近傍の力をばねの形へ一般化する。'},
 {id:'um-vector',family:'umath',intro:p('ui-vector-map',[0,1,2,4,5,6],'矢印を成分で表し、向き・長さ・足し算を座標と結び付ける。'),middle:p('um-vector-components',[3,7,8],'三次元の長さと単位ベクトルを計算し、ベクトルの式を成分へ分ける。'),advanced:'位置ベクトルを時間微分し、三次元の速度と加速度を計算する。'},
 {id:'um-dot',family:'umath',intro:p('ui-effective-component',[0,1,2,3],'移動に平行な力だけが仕事をすることを角度と具体例で読む。'),middle:p('um-inner-product',[6,7,8],'内積を成分で計算し、長さ・直交・仕事の符号を判定する。'),advanced:'内積の成分式を展開して導き、変化する場の仕事と束へ応用する。'},
 {id:'um-cross',family:'umath',intro:p('ui-cross-product',[0,1,2,3],'回転の効き方を面積で測り、半径方向と直角方向の違いを読む。'),middle:p('um-cross-product',[4,5,6,8],'右手系で外積の向きを決め、順序と電荷の符号を区別する。'),advanced:'外積の成分式を導き、トルクと負電荷に働く力を計算する。'},
 {id:'um-ode',family:'umath',intro:p('ui-rate-equation',[0,1,6,10],'変化率の規則と出発点を区別し、答えが時間の関数になると理解する。'),middle:p('um-simple-derivative-equation',[7],'減衰を短い時間刻みで追い、指数関数の解と初期値を対応させる。'),advanced:'変数分離を根拠から実行し、零解・積分定数・半減期まで確かめる。'},
 {id:'um-shm-ode',family:'umath',intro:p('ui-oscillation-equation',[0,1,2,6,7],'復元力の向きと周期を読み、位置を二回微分する意味をつかむ。'),middle:p('um-oscillation-equation',[3,4,5],'sinとcosを二回微分して方程式へ代入し、振動の解を確かめる。'),advanced:'安定点での線形化とエネルギー保存から、単振動が成り立つ範囲を論じる。'},
 {id:'uc-newton',family:'umech',intro:p('ui-newton-small-step',[0,1,2,3],'物体と正方向を指定し、合力から加速度と短時間後の速度を出す。'),middle:p('um-constant-force-derive',[4,5,6,7,8,9,10,11,12,13],'成分ごとの運動方程式を二回積分し、初期位置と初速度を入れる。'),advanced:'放物運動を成分で解き、解の検算と力が変わる場合のモデル選択を行う。'},
 {id:'uc-drag',family:'umech',intro:p('ui-drag',[0,1,4,5,6],'重力と抵抗を描き、力のつり合いが静止を意味しないと確かめる。'),middle:p('um-drag',[2,3,7,11],'速度比例抵抗の運動方程式を立て、終端速度との差と時定数を求める。'),advanced:'抵抗下の速度を初期条件付きで積分し、二乗抵抗モデルとの差を調べる。'},
 {id:'uc-work',family:'umech',intro:p('ui-work-constant',[0,1,4],'力・移動・仕事を区別し、正負と単位を具体例で確かめる。'),middle:p('um-work-energy',[2,3],'内積の仕事と運動方程式を結び、仕事が運動エネルギーを変えると示す。'),advanced:'曲線を時間で表し、ベクトルの微分から仕事・エネルギー・仕事率を導く。'},
 {id:'uc-potential',family:'umech',intro:p('ui-potential',[0,1,2,3],'高さで蓄えるエネルギーと基準の選び方を、保存力の仕事と結ぶ。'),middle:p('um-potential-slope',[4,5,6,7],'保存力の仕事から位置エネルギーを定義し、微分で力へ戻す。'),advanced:'万有引力のポテンシャル・折り返し点・安定性を計算し、保存則を検算する。'},
 {id:'uc-momentum',family:'umech',intro:p('ui-momentum',[0,3,6],'質量と速度から運動量を求め、力積と系の境界を区別する。'),middle:p('um-momentum-change',[1,2,4,5,7],'力を時間で積分し、運動量変化と力積のグラフを対応させる。'),advanced:'内部の力の相殺から保存則を導き、反発係数と連立して衝突後を求める。'},
 {id:'uc-angular',family:'umech',intro:p('ui-angular',[0,1,3],'ドアとてこで、力の大きさ・作用点・向きが回転にどう効くか読む。'),middle:p('um-angular',[2,4,5,6,7],'基準点を決め、トルクと角運動量を外積で表して計算する。'),advanced:'角運動量を時間微分してトルクと結び、中心力の面積速度一定を導く。'},
 {id:'uc-shm',family:'umech',intro:p('ui-pendulum',[0,1,6],'振り子の戻る向きと周期を、位置・運動エネルギーの交換で読む。'),middle:p('um-pendulum',[2,3,4,5],'接線方向の方程式を立て、小角近似の条件付きで振り子の周期を導く。'),advanced:'振動のエネルギーを検算し、減衰と強制振動の解から共振を求める。'},
 {id:'uc-rigid1',family:'umech',intro:p('ui-inertia',[0,1,3],'重心のつり合いと回転時の速さを、質量と軸からの距離で読む。'),middle:p('um-inertia',[2,4,5,6],'小さな質量のエネルギーを足して慣性モーメントを作り、積分へ直す。'),advanced:'棒・円板・球の慣性モーメントを積分し、平行軸の定理を証明する。'},
 {id:'uc-rigid2',family:'umech',intro:p('ui-rotation',[0,3,4],'角速度と滑らない車輪の速さを結び、並進と回転のエネルギーを分ける。'),middle:p('um-rotation',[1,2,5,6,7],'固定軸の回転方程式と滑らない条件を使い、車輪の各点の速度を出す。'),advanced:'転がる物体の速さを求め、角運動量保存と回転エネルギーの違いを説明する。'},
 {id:'uc-frontier',family:'umech',intro:p('ui-reference-frame',[0,3,6],'観測者による見え方、円運動の加速度、距離で変わる重力を区別する。'),middle:p('um-reference-frame',[1,2,4,5,8,9],'座標変換を二回微分して慣性力を求め、円軌道の力の式を立てる。'),advanced:'回転座標の追加項を区別し、中心力から円軌道と楕円軌道の性質を導く。'},
 {id:'ue-integrals',family:'uem',intro:p('ui-electric-work-path',[],'電場から力を求め、曲がった道を小区間に分けて仕事を足す。'),middle:p('um-line-integral-entry',[],'小区間の内積の和の極限から線積分を定義し、道の向きを区別する。'),advanced:'曲線のパラメータ表示と面の座標を使い、線積分と二重積分を実際に計算する。'},
 {id:'ue-gauss',family:'uem',intro:p('ui-closed-bag',[],'閉曲面の外向きを正とし、電気束の合計と各点の電場を区別する。'),middle:p('um-gauss-sphere-preview',[],'対称性で球面の電気束を簡単にし、法則の証明と計算の簡略化を区別する。'),advanced:'偏心球をそのまま積分し、立体角と重ね合わせで任意の閉曲面へ一般化する。'},
 {id:'ue-potential',family:'uem',intro:p('ui-electric-potential',[0,1,4],'電位と電位差を区別し、電場がする仕事と位置エネルギーの符号を読む。'),middle:p('um-electrostatic-potential-path',[2,3,8,10],'静電場の仕事を単位電荷あたりで数え、道によらない電位差を定義する。'),advanced:'電位から勾配で電場を求め、点電荷の積分と等電位面の性質を確かめる。'},
 {id:'ue-capacitor',family:'uem',intro:p('ui-capacitance',[0,1,6],'二枚の板に正負の電荷を分けて蓄え、容量と充電中の電圧を読む。'),middle:p('um-capacitance',[2,3,4,5,7],'面密度から板間の電場と電圧を求め、平行板の容量を導く。'),advanced:'充電仕事を積分してエネルギー密度を導き、誘電体と固定条件の違いを調べる。'},
 {id:'ue-current',family:'uem',intro:p('ui-conduction',[0,1,4],'断面を通る電荷で電流を測り、電子の移動と電流の向きを区別する。'),middle:p('um-conduction',[2,3,5,10,11],'断面を通る粒子の数から電流を求め、電荷保存から分岐点の収支を立てる。'),advanced:'衝突モデルから導電率とオームの法則を導き、送電の損失を計算する。'},
 {id:'ue-lorentz',family:'uem',intro:p('ui-magnetic-force',[0,1,4],'速度・磁場・力を三本の矢印で区別し、磁気力が速さを変えない理由を読む。'),middle:p('um-magnetic-force',[2,3,5,6,7],'ローレンツ力を出発点に、電荷の符号と円運動が成り立つ条件を判断する。'),advanced:'半径・周期・らせんの間隔を導き、粒子の力を足して導線の力を求める。'},
 {id:'ue-ampere',family:'uem',intro:p('ui-current-field',[0,1,8],'電流の周りの磁場の向きを読み、巻数と単位長さあたりの巻数を区別する。'),middle:p('um-current-field',[5,6,7,9,10],'定常電流の周回積分と対称性を使い、直線電流の磁場を求める。'),advanced:'ビオ・サバール則で円形電流を積分し、長いコイルの磁場を四辺から導く。'},
 {id:'ue-faraday',family:'uem',intro:p('ui-induction',[0,1,2],'磁束の変化と起電力を区別し、閉回路の有無と誘導の向きを読む。'),middle:p('um-induction',[3,4,5,6,7,8],'ファラデーの法則から回転コイルと動く導線の起電力を計算する。'),advanced:'自己・相互インダクタンスからコイルのエネルギーと変圧器の関係を導く。'},
 {id:'ue-transient',family:'uem',intro:p('ui-circuit-time',[0,1,7],'抵抗・コンデンサ・コイルの電圧を区別し、電荷と電流の変化を読む。'),middle:p('um-circuit-time',[2,3,4,6,8,9],'回路の収支を微分方程式に直し、RCの時定数と充放電の行き先を求める。'),advanced:'指数関数の解を確かめ、RLの過渡応答とLCの振動を同じ方法で導く。'},
 {id:'ue-maxwell',family:'uem',intro:p('ui-ac-waves',[0,1,7],'交流の周期・位相と波の伝わる速さを区別して図で読む。'),middle:p('um-ac-maxwell',[2,3,4,5,6,8],'交流での微分積分から素子の応答を出し、四つの場の法則を整理する。'),advanced:'変位電流で電荷保存を確かめ、真空の波動方程式と光速を導く。'},
];
export const topicById=Object.fromEntries(universityCurriculum.map(t=>[t.id,t]));
export const removedIndices=(id:string)=>new Set([...(topicById[id]?.intro.slides??[]),...(topicById[id]?.middle.slides??[])]);
export const movedCycles:Record<string,Record<string,string>>={
 'ue-integrals':{work:'ui-work-constant',linear:'ui-work-changing',projection:'ui-electric-work-path',surface:'um-surface-integral-entry'},
 'ue-gauss':{'sphere-flux':'um-gauss-sphere-preview'},
};
```

## 画面（パターンを決めている物）

### `src/components/QuestMap.tsx`

```tsx
import { useEffect, useState } from "react";
import { universityCurriculum } from '../content/university-curriculum';
import type { Chapter } from "../types";
import { levelProgress, type Progress } from "../game/state";
import { advancedFamilyOf, levelLabels, universityFamilies, type LevelKey, type UniversityFamily } from "../content/university-levels";

const CHAPTER_ICONS: Record<string, string> = {
  mechanics: "🏃",
  thermo: "🔥",
  waves: "🌊",
  em: "⚡",
  atomic: "⚛️",
  umath: "📐",
  umech: "🚀",
  uem: "🧲",
};

type Block =
  | { kind: "chapter"; chapter: Chapter }
  | { kind: "family"; family: UniversityFamily; levels: { level: LevelKey; tagline: string; chapter: Chapter }[] };

/** 大学編の三章は、同じ主題の初級・中級・上級を一つのカードに束ねて表示する。
 * 段階は自由に選べる。初級・中級を終えていなくても上級を開ける。 */
function toBlocks(chapters: Chapter[]): Block[] {
  const byId = new Map(chapters.map(c => [c.id, c]));
  const claimed = new Set<string>();
  for (const family of universityFamilies) {
    for (const entry of family.levels) if (byId.has(entry.chapterId)) claimed.add(entry.chapterId);
  }
  const emitted = new Set<string>();
  const blocks: Block[] = [];
  for (const chapter of chapters) {
    if (!claimed.has(chapter.id)) { blocks.push({ kind: "chapter", chapter }); continue; }
    const familyId = chapter.familyId ?? advancedFamilyOf[chapter.id];
    if (!familyId || emitted.has(familyId)) continue;
    emitted.add(familyId);
    const family = universityFamilies.find(f => f.id === familyId)!;
    const levels = family.levels
      .map(entry => ({ level: entry.level, tagline: entry.tagline, chapter: byId.get(entry.chapterId) }))
      .filter((entry): entry is { level: LevelKey; tagline: string; chapter: Chapter } => !!entry.chapter);
    blocks.push({ kind: "family", family, levels });
  }
  return blocks;
}

export function QuestMap({
  chapters,
  progress,
  onOpenLesson,
  onOpenBattle,
}: {
  chapters: Chapter[];
  progress: Progress;
  onOpenLesson: (stageId: string) => void;
  onOpenBattle: (stageId: string) => void;
}) {
  const lp = levelProgress(progress.xp);
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : null;
  const blocks = toBlocks(chapters);
  // 未クリアの分野があれば最初のそれを開いておく
  const [openId, setOpenId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('physics-quest:map-open');
      if (saved !== null && (saved === '' || blocks.some(b => (b.kind === 'family' ? b.family.id : b.chapter.id) === saved))) return saved;
    } catch { /* Storage is optional. */ }
    const firstUnfinished = chapters.find((c) =>
      c.stages.some((s) => !progress.clearedStages.includes(s.id))
    );
    const target = (firstUnfinished ?? chapters[0]).id;
    return advancedFamilyOf[target] ?? (firstUnfinished?.familyId ?? target);
  });
  // 系列ごとに、いま見ている段階。進めた段階があればそこを開く。
  const [levelOf, setLevelOf] = useState<Record<string, LevelKey>>(() => {
    const initial: Record<string, LevelKey> = {};
    for (const block of blocks) {
      if (block.kind !== "family") continue;
      const started = block.levels.find(entry => entry.chapter.stages.some(s => progress.clearedStages.includes(s.id)));
      initial[block.family.id] = (started ?? block.levels[0])?.level ?? "intro";
    }
    try {
      const saved = JSON.parse(localStorage.getItem('physics-quest:map-levels') ?? '{}');
      for (const id of Object.keys(initial)) {
        if (['intro', 'middle', 'advanced'].includes(saved?.[id])) initial[id] = saved[id];
      }
    } catch { /* Ignore malformed or unavailable storage. */ }
    return initial;
  });
  useEffect(() => {
    try {
      localStorage.setItem('physics-quest:map-open', openId);
      localStorage.setItem('physics-quest:map-levels', JSON.stringify(levelOf));
    } catch { /* Learning must remain available without storage. */ }
  }, [openId, levelOf]);

  const stageList = (chapter: Chapter) => (
    <div className="stage-path pop-in">
      {chapter.stages.map((stage, i) => {
        const cleared = progress.clearedStages.includes(stage.id);
        const lessonDone = progress.finishedLessons.includes(stage.lesson.id);
        return (
          <div key={stage.id} className={`stage-node ${cleared ? "cleared" : ""}`}>
            {i > 0 && <div className="stage-connector" />}
            <div className="stage-card">
              <div className="stage-enemy">{stage.enemy.emoji}</div>
              <div className="stage-info">
                <div className="stage-title">
                  {stage.title}
                  {cleared && <span className="stage-star">⭐</span>}
                </div>
                <div className="stage-subtitle">{stage.subtitle}</div>
                <div className="stage-actions">
                  <button className="btn btn-ghost" onClick={() => onOpenLesson(stage.id)}>
                    📖 {lessonDone ? "レッスンを見返す" : "レッスンで学ぶ"}
                  </button>
                  <button className="btn btn-primary" onClick={() => onOpenBattle(stage.id)}>
                    ⚔️ バトルに挑む
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const progressBar = (chapter: Chapter) => {
    const done = chapter.stages.filter(s => progress.clearedStages.includes(s.id)).length;
    return (
      <span className="chapter-progress">
        <span className="chapter-progress-bar">
          <span className="chapter-progress-fill" style={{ width: `${(done / chapter.stages.length) * 100}%` }} />
        </span>
        <span className="chapter-progress-label">{done}/{chapter.stages.length}</span>
      </span>
    );
  };

  return (
    <div className="screen quest-map">
      <details className="study-aid"><summary>どこから始める？</summary><p>大学の数式に不安があれば数学の初級から。高校の授業の復習なら対応する高校単元へ。既習の説明は飛ばして確認問題から試せます。練習は時間無制限で、全単元を自由に開けます。</p><button className="btn btn-ghost" onClick={()=>onOpenLesson('ui-average-to-now')}>大学数学の初級から始める</button><p>「前提を確認・一問試す」はAPIキーも料金も不要です。AIへの自由質問は別機能で、設定が必要です。</p></details>
      <header className="hud">
        <div className="hud-level">
          <div className="level-badge">
            Lv.<span>{lp.level}</span>
          </div>
          <div className="level-bar-wrap">
            <div className="level-bar">
              <div className="level-bar-fill" style={{ width: `${lp.ratio * 100}%` }} />
            </div>
            <div className="level-bar-label">
              XP {lp.into} / {lp.needed}
            </div>
          </div>
        </div>
        <div className="hud-stats">
          {accuracy !== null && <span className="hud-stat">正答率 {accuracy}%</span>}
          {progress.bestCombo > 1 && <span className="hud-stat">最大コンボ {progress.bestCombo}</span>}
          <span className="hud-stat">
            ⭐ {progress.clearedStages.length} / {chapters.reduce((n, c) => n + c.stages.length, 0)}
          </span>
        </div>
      </header>

      <div className="chapter-list">
        {blocks.map((block) => {
          if (block.kind === "chapter") {
            const chapter = block.chapter;
            const clearedCount = chapter.stages.filter((s) => progress.clearedStages.includes(s.id)).length;
            const isOpen = openId === chapter.id;
            const complete = clearedCount === chapter.stages.length;
            return (
              <div key={chapter.id} className={`chapter-block ${complete ? "complete" : ""}`}>
                <button className="chapter-card chapter-toggle" onClick={() => setOpenId(isOpen ? "" : chapter.id)}>
                  <span className="chapter-icon">{CHAPTER_ICONS[chapter.id] ?? "📘"}</span>
                  <span className="chapter-toggle-info">
                    <span className="chapter-toggle-title">
                      {chapter.title}
                      {complete && " 👑"}
                    </span>
                    <span className="chapter-toggle-sub">{chapter.subtitle}</span>
                    {progressBar(chapter)}
                  </span>
                  <span className={`chapter-chevron ${isOpen ? "open" : ""}`}>▾</span>
                </button>
                {isOpen && stageList(chapter)}
              </div>
            );
          }

          const family = block.family;
          const active = block.levels.find(entry => entry.level === levelOf[family.id]) ?? block.levels[0];
          const isOpen = openId === family.id;
          const total = block.levels.reduce((n, entry) => n + entry.chapter.stages.length, 0);
          const done = block.levels.reduce(
            (n, entry) => n + entry.chapter.stages.filter(s => progress.clearedStages.includes(s.id)).length, 0);
          return (
            <div key={family.id} className={`chapter-block ${done === total ? "complete" : ""}`}>
              <button className="chapter-card chapter-toggle" onClick={() => setOpenId(isOpen ? "" : family.id)}>
                <span className="chapter-icon">{family.icon}</span>
                <span className="chapter-toggle-info">
                  <span className="chapter-toggle-title">
                    大学編 · {family.title}
                    {done === total && " 👑"}
                  </span>
                  <span className="chapter-toggle-sub">
                    {block.levels.map(entry => levelLabels[entry.level]).join(" / ")} — どの段階からでも開けます
                  </span>
                  <span className="chapter-progress">
                    <span className="chapter-progress-bar">
                      <span className="chapter-progress-fill" style={{ width: `${(done / total) * 100}%` }} />
                    </span>
                    <span className="chapter-progress-label">{done}/{total}</span>
                  </span>
                </span>
                <span className={`chapter-chevron ${isOpen ? "open" : ""}`}>▾</span>
              </button>
              {isOpen && (
                <div className="level-picker pop-in">
                  <div className="level-tabs" role="tablist" aria-label={`${family.title}の段階`}>
                    {block.levels.map(entry => (
                      <button
                        key={entry.level}
                        role="tab"
                        aria-selected={entry.level === active.level}
                        className={`level-tab ${entry.level === active.level ? "current" : ""}`}
                        onClick={() => setLevelOf(state => ({ ...state, [family.id]: entry.level }))}
                      >
                        <span className="level-tab-name">{levelLabels[entry.level]}</span>
                        <span className="level-tab-count">
                          {entry.chapter.stages.filter(s => progress.clearedStages.includes(s.id)).length}
                          /{entry.chapter.stages.length}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="level-tagline">{active.tagline}</p>
                  <details className="study-overview curriculum-map"><summary>全単元の初級・中級・上級から選ぶ</summary>
                    <p>同じ行が同じ単元です。どの段階からでも開けます。</p>
                    {universityCurriculum.filter(t=>t.family===family.id).map(topic=><section key={topic.id}>
                      <h3>{chapters.flatMap(c=>c.stages).find(s=>s.id===topic.id)?.title}</h3>
                      <div className="level-tabs">{(['intro','middle','advanced'] as const).map(level=><button className="btn btn-ghost" key={level} onClick={()=>onOpenLesson(level==='advanced'?topic.id:topic[level].id)}>{levelLabels[level]}</button>)}</div>
                    </section>)}
                  </details>
                  {stageList(active.chapter)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### `src/components/LessonView.tsx`

```tsx
import { useEffect, useRef, useState } from "react";
import {EMVideoLesson,hasEMMovies} from './EMVideoLesson';
import { LessonNarration } from './LessonNarration';
import { EMVideoPilot } from './EMVideoPilot';
import { useLessonPosition } from '../game/useLessonPosition';
import { StudyAid } from './StudyAid';
import type { Stage } from "../types";
import { MathText } from "./MathText";
import { Figure } from "./figures";
import { CalculationBoard, EquationImage } from './CalculationBoard';
import { getCalculation } from '../content/calculations';
import { UniqueFigure, getUniqueShot } from './figures/unique';
import { LessonOrientation } from './LessonOrientation';
import { GuidedLesson } from './GuidedLesson';
import { learningPaths, unitAt, phaseLabel } from '../content/learning-paths';
import { foregroundText } from '../content/lesson-text';
import { QuantityGlossary } from './QuantityGlossary';
import { ChapterFoundation } from './ChapterFoundation';
import { AdvancedEntry, AdvancedPreviewCard, LevelSlideHeader } from './LevelBridge';
import { levelStageIds } from '../content/university-levels';
import { MovedMaterial } from './MovedMaterial';
import { TopicRoute } from './TopicRoute';
import './spiral-lesson.css';
import './study-flow.css';

export function LessonView(props: {stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void;onOpenStage?:(id:string)=>void}) {
  const [original,setOriginal]=useState<string|null>(null);
  if(original!==props.stage.id&&hasEMMovies(props.stage))return <EMVideoLesson key={props.stage.id} {...props} onOriginal={()=>setOriginal(props.stage.id)}/>;
  const originalView=props.stage.lesson.steps[0]?.story ? <GuidedLesson {...props}/> : <StandardLessonView {...props}/>;
  return <>{hasEMMovies(props.stage)&&<button className="btn btn-ghost" onClick={()=>setOriginal(null)}>← 音声付き動画へ戻る</button>}{originalView}</>;
}
function StandardLessonView({
  stage,
  alreadyFinished,
  onComplete,
  onExit,
  onOpenStage,
}: {
  stage: Stage;
  alreadyFinished: boolean;
  onComplete: (firstTime: boolean) => void;
  onExit: () => void;
  onOpenStage?: (id: string) => void;
}) {
  const lesson = stage.lesson;
  const slides = lesson.steps;
  const [page, setPage] = useLessonPosition(stage.id, slides.length);
  const allRevealed = page === slides.length - 1;
  const step = slides[page];
  const calculation = getCalculation(step);
  const shot = getUniqueShot(stage.id, step);
  const units=learningPaths[stage.id];
  const {unit,index:unitIndex,start,offset,count}=unitAt(units,page);
  const summary=foregroundText(stage.id,step,page);
  const expressions=[...(calculation?.lines.map(line=>line.tex)??[]),...(step.formula?[step.formula]:[]),...Array.from(step.body.matchAll(/\$([^$]+)\$/g),m=>m[1])];
  const isLevel = levelStageIds.has(stage.id);
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (page === 0) window.scrollTo({top:0});
    else card.current?.scrollIntoView({block:'start'});
  }, [page]);

  return (
    <div className="screen lesson" data-stage-id={stage.id}>
      <header className="screen-header">
        <button className="btn-back" onClick={onExit}>
          ←
        </button>
        <div>
          <div className="screen-header-tag">📖 レッスン ─ {stage.title}</div>
          <h1>{lesson.title}</h1>
        </div>
      </header>

      <details className="study-overview"><summary>この章の出発点と学習のつながり</summary><p><MathText text={lesson.intro}/></p>
       <ol>{units.map((item,i)=><li key={item.end}><button onClick={()=>setPage(i===0?0:units[i-1].end)} aria-current={i===unitIndex?'step':undefined}>{item.goal}</button></li>)}</ol>
      </details>

      <ChapterFoundation stageId={stage.id}/>
      {stage.id==='um-line-integral-entry'&&<EMVideoPilot/>}
      <AdvancedEntry stageId={stage.id} onOpenStage={onOpenStage}/>
      <TopicRoute stageId={stage.id} onOpenStage={onOpenStage}/>

      <div className="lesson-steps">
          <div className="lesson-step pop-in" key={page} ref={card}>
            {isLevel
              ? <LevelSlideHeader page={page} total={slides.length} heading={step.heading} beat={step.beat} role={step.role} />
              : <LessonOrientation stageId={stage.id} heading={step.heading} page={page} total={slides.length} review={step.review} />}
            {!isLevel&&step.beat&&<p className="lesson-beat"><span className={`lesson-beat-tag beat-${['基本事項','疑問','解決','新しい基本事項'].indexOf(step.beat)}`}>{step.beat}</span></p>}
            {!isLevel&&<section className="spiral-context" aria-label="今の段で求めること">
             <p className="spiral-goal">第{unitIndex+1}段：{unit.goal}</p>
             {unitIndex>0&&<details><summary>前の段から使うこと</summary><p>{units[unitIndex-1].gain}</p></details>}
             <nav aria-label="この段の学び方">{Array.from({length:count},(_,i)=><button key={i} aria-current={offset===i?'step':undefined} onClick={()=>setPage(start+i)}>{phaseLabel(i,count)}</button>)}</nav>
            </section>}
            {summary.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}><MathText text={paragraph} /></p>
            ))}
            <LessonNarration key={`${stage.id}:${page}`} text={`${step.heading}。${summary}`}/>
            {summary!==step.body&&<details className="study-original"><summary>補足・元の詳しい説明</summary>{step.body.split(/\n\s*\n/).map((p,i)=><p key={i}><MathText text={p}/></p>)}</details>}
            {shot ? <UniqueFigure shot={shot} id={`${stage.id}/${page}`} /> : step.figure && <Figure id={step.figure} />}
            <StudyAid stage={stage} onPractice={()=>onComplete(!alreadyFinished)}/>
            {expressions.length>0&&(isLevel
              ? <details className="level-symbols"><summary>この式の記号を確認</summary><QuantityGlossary key={`symbols-${page}`} stageId={stage.id} expressions={expressions}/></details>
              : <QuantityGlossary key={`symbols-${page}`} stageId={stage.id} expressions={expressions}/>)}
            {calculation && <CalculationBoard key={`calculation-${page}`} calculation={calculation} purpose={step.heading==='微小移動なら掛け算1回に戻る'?'静電場の電位分布Vから、観測点の電場成分Eₓを求める':unit.goal} />}
            {step.formula && !calculation?.lines.some(line => line.tex === step.formula) && <div className="formula-card"><EquationImage tex={step.formula}/></div>}
            {step.formulaNote && <div className="formula-note">💡 <MathText text={step.formulaNote} /></div>}
            {allRevealed&&<AdvancedPreviewCard stageId={stage.id}/>}
            {offset===count-1&&<p className={isLevel?"spiral-gain level-gain":"spiral-gain"}>つながったこと：{unit.gain}</p>}
            {offset===count-1&&unitIndex<units.length-1&&<p className="study-next">次は：{units[unitIndex+1].goal}</p>}
          </div>
      </div>

      <MovedMaterial stage={stage}/>
      {allRevealed && (
        <div className="lesson-outro pop-in">
          <p>
            <MathText text={lesson.outro} />
          </p>
        </div>
      )}

      <div className="lesson-controls">
        <div className="lesson-navigation">
          <button className="btn btn-ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← 前へ</button>
          <nav className="lesson-dots" aria-label="スライドを選ぶ">
            {slides.map((s, i) => <button key={i} className={`lesson-dot ${i === page ? 'active' : ''}`}
              aria-label={`スライド ${i + 1}: ${s.heading}`} aria-current={i === page ? 'step' : undefined}
              title={`${i + 1}. ${s.heading}`} onClick={() => setPage(i)}><span /></button>)}
          </nav>
        </div>
        {!allRevealed ? (
          <button className="btn btn-primary btn-big" onClick={() => setPage(p => p + 1)}>
            {offset===count-1?'次の基本事項へ →':`${phaseLabel(offset+1,count)}へ →`}
          </button>
        ) : (
          <button className="btn btn-battle btn-big glow-pulse" onClick={() => onComplete(!alreadyFinished)}>
            ⚔️ {stage.enemy.name}に挑む!
            {!alreadyFinished && <span className="xp-tag">+20 XP</span>}
          </button>
        )}
      </div>
    </div>
  );
}
```

### `src/components/BattleView.tsx`

```tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { Problem, Stage } from "../types";
import { MathText } from "./MathText";
import { ProblemMeaning } from './ProblemMeaning';
import { StudyAid } from './StudyAid';
import { LessonView } from './LessonView';
import {allQuestionsSolved,questionsToRetry} from '../game/study-progress';
import { hapticSuccess, hapticError } from "../native";

const QUESTION_TIME = 30; // 秒
const MAX_HEARTS = 3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "question" | "feedback" | "victory" | "defeat";

export function BattleView({
  stage,
  starred,
  firstClear,
  onToggleStar,
  onAnswer,
  onFinish,
  onExit,
  nextStageTitle,
}: {
  stage: Stage;
  starred: string[];
  firstClear: boolean;
  onToggleStar: (problemId: string) => void;
  onAnswer: (correct: boolean) => void;
  onFinish: (xp: number, cleared: boolean, bestCombo: number, continueNext?: boolean) => void;
  onExit: () => void;
  nextStageTitle?:string;
}) {
  const [queue, setQueue] = useState<Problem[]>(() => shuffle(stage.problems));
  const [qIndex, setQIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(stage.enemy.maxHp);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [selected, setSelected] = useState<number | null>(null);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [showHint, setShowHint] = useState(false);
  const [damageFloat, setDamageFloat] = useState<{ value: number; key: number } | null>(null);
  const [enemyHit, setEnemyHit] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const answeredRef = useRef(false);
  const [timed, setTimed] = useState(false);
  const [solved, setSolved] = useState<Set<string>>(() => new Set());
  const remainingRef = useRef(QUESTION_TIME);
  const [reviewing,setReviewing]=useState(false);
  const [hasAnswered,setHasAnswered]=useState(false);

  const problem = queue[qIndex % queue.length];
  const isStarred = starred.includes(problem.id);

  // Answer guard resets per question, independently of the optional timer.
  useEffect(() => {
    if (phase !== "question") return;
    answeredRef.current = false;
    remainingRef.current = QUESTION_TIME;
    setTimeLeft(QUESTION_TIME);
  }, [phase, qIndex]);

  // Reading a hint pauses the remaining time; it does not refill it.
  useEffect(() => {
    if (phase !== 'question' || !timed || showHint || reviewing) return;
    const started = Date.now();
    const remaining = remainingRef.current;
    const iv = setInterval(() => {
      const remain = Math.max(0, remaining - (Date.now() - started) / 1000);
      remainingRef.current = remain;
      if (remain <= 0) {
        clearInterval(iv);
        if (!answeredRef.current) handleAnswer(-1);
      } else {
        setTimeLeft(remain);
      }
    }, 100);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, qIndex, timed, showHint, reviewing]);

  function handleAnswer(choiceIdx: number) {
    if (answeredRef.current || phase !== "question") return;
    answeredRef.current = true;
    setHasAnswered(true);
    const correct = choiceIdx === problem.answerIndex;
    setSelected(choiceIdx);
    setWasCorrect(correct);
    onAnswer(correct);

    if (correct) {
      setSolved(previous => new Set([...previous, problem.id]));
      const newCombo = combo + 1;
      const timeBonus = timed ? (timeLeft > 20 ? 6 : timeLeft > 10 ? 3 : 0) : 0;
      const damage =
        16 + 8 * problem.difficulty + Math.min(newCombo - 1, 5) * 4 + timeBonus;
      setCombo(newCombo);
      setBestCombo((b) => Math.max(b, newCombo));
      setCorrectCount((c) => c + 1);
      setEnemyHp((hp) => Math.max(0, hp - damage));
      setDamageFloat({ value: damage, key: Date.now() });
      setEnemyHit(true);
      hapticSuccess();
      setTimeout(() => setEnemyHit(false), 500);
    } else {
      setCombo(0);
      if (timed) setHearts((h) => h - 1);
      setPlayerHit(true);
      hapticError();
      setTimeout(() => setPlayerHit(false), 500);
    }
    setPhase("feedback");
  }

  function next() {
    setSelected(null);
    setShowHint(false);
    if (allQuestionsSolved(stage.problems,solved) && (!timed || enemyHp <= 0)) {
      setPhase("victory");
      return;
    }
    if (timed && hearts <= 0) {
      setPhase("defeat");
      return;
    }
    if (qIndex + 1 === queue.length) {
      setQueue(shuffle(questionsToRetry(stage.problems,solved)));
      setQIndex(0);
    } else setQIndex(i=>i+1);
    setPhase("question");
  }

  const victoryXp = useMemo(
    () => 40 + correctCount * 8 + hearts * 10 + bestCombo * 4 + (firstClear ? 30 : 0),
    [correctCount, hearts, bestCombo, firstClear]
  );
  const defeatXp = correctCount * 4;

  const hpRatio = timed ? enemyHp / stage.enemy.maxHp : solved.size / stage.problems.length;
  const timeRatio = timeLeft / QUESTION_TIME;

  if(reviewing)return <div><button className="btn btn-primary" onClick={()=>setReviewing(false)}>確認中の問題に戻る（回答を保持）</button><LessonView stage={stage} alreadyFinished onExit={()=>setReviewing(false)} onComplete={()=>setReviewing(false)}/></div>;

  if (phase === "victory") {
    return (
      <div className="screen battle result-screen">
        <Confetti />
        <div className="result-card pop-in">
          <div className="result-emoji">🏆</div>
          <h1 className="result-title victory-title">VICTORY!</h1>
          <p className="result-sub">
            {timed?`${stage.enemy.name}を倒した!`:'全問題で正解を確認しました。'} 「{stage.title}」クリア!
          </p>
          <div className="result-stats">
            <div className="result-stat">
              <span>正解数</span>
              <b>{correctCount}</b>
            </div>
            <div className="result-stat">
              <span>最大コンボ</span>
              <b>{bestCombo}</b>
            </div>
            <div className="result-stat">
              <span>残りHP</span>
              <b>{"❤️".repeat(hearts) || "0"}</b>
            </div>
          </div>
          <div className="result-xp glow-pulse">+{victoryXp} XP</div>
          {firstClear && <div className="first-clear-tag">✨ 初クリアボーナス +30XP を含む</div>}
          <button className="btn btn-primary btn-big" onClick={() => onFinish(victoryXp, true, bestCombo)}>
            マップへ戻る
          </button>
          {nextStageTitle&&<button className="btn btn-primary btn-big" onClick={()=>onFinish(victoryXp,true,bestCombo,true)}>次の単元「{nextStageTitle}」へ</button>}
        </div>
      </div>
    );
  }

  if (phase === "defeat") {
    return (
      <div className="screen battle result-screen">
        <div className="result-card pop-in">
          <div className="result-emoji">💫</div>
          <h1 className="result-title defeat-title">力尽きた…</h1>
          <p className="result-sub">
            大丈夫、間違えた問題こそ伸びしろ。解説を読んだ今のきみはさっきより強い。
            レッスンを見返してもう一度挑もう。
          </p>
          <div className="result-stats">
            <div className="result-stat">
              <span>正解数</span>
              <b>{correctCount}</b>
            </div>
            <div className="result-stat">
              <span>与ダメージ</span>
              <b>{stage.enemy.maxHp - enemyHp}</b>
            </div>
          </div>
          {defeatXp > 0 && <div className="result-xp">+{defeatXp} XP</div>}
          <button className="btn btn-primary btn-big" onClick={() => onFinish(defeatXp, false, bestCombo)}>
            マップへ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`screen battle ${playerHit ? "player-hit" : ""}`}>
      <header className="battle-header">
        <button
          className="btn-back"
          onClick={() => {
            if (confirm("バトルを中断してマップに戻りますか?")) onExit();
          }}
        >
          ←
        </button>
        <div className="battle-stage-name">{stage.title}</div>
        <div className="hearts">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <span key={i} className={i < hearts ? "" : "heart-empty"}>
              {i < hearts ? "❤️" : "🖤"}
            </span>
          ))}
        </div>
      </header>

      <section className="study-mode" aria-label="練習モード">
        <p>{timed ? '時間つきバトル' : 'じっくり練習：時間制限・失敗回数の制限なし'}</p>
        <p>正解を確認した問題：{solved.size} / {stage.problems.length}。全問で一度正解してから完了します。</p>
        {!hasAnswered && phase === 'question' && <label><input type="checkbox" checked={timed} onChange={e => setTimed(e.target.checked)}/>30秒のバトルに挑戦する（任意）</label>}
      </section>

      <div className="enemy-area">
        <div className={`enemy ${enemyHit ? "enemy-shake" : ""}`}>
          <span className="enemy-emoji">{stage.enemy.emoji}</span>
          {timed && damageFloat && (
            <span key={damageFloat.key} className="damage-float">
              -{damageFloat.value}
            </span>
          )}
        </div>
        <div className="enemy-name">{stage.enemy.name}</div>
        <div className="hp-bar">
          <div
            className={`hp-bar-fill ${timed && hpRatio < 0.3 ? "hp-low" : ""}`}
            style={{ width: `${hpRatio * 100}%` }}
          />
        </div>
        <div className="hp-label">
          {timed?`HP ${enemyHp} / ${stage.enemy.maxHp}`:`理解の確認 ${solved.size} / ${stage.problems.length}`}
        </div>
        {combo > 1 && <div className="combo-badge pop-in">🔥 {combo} COMBO!</div>}
      </div>

      {phase === "question" && timed && (
        <div className="timer-bar">
          <div
            className={`timer-bar-fill ${timeRatio < 0.3 ? "timer-low" : ""}`}
            style={{ width: `${timeRatio * 100}%` }}
          />
        </div>
      )}

      <div className="question-card" data-problem-id={problem.id} data-answer-index={problem.answerIndex}>
        <div className="question-meta">
          <span className="difficulty">{"★".repeat(problem.difficulty)}</span>
          <button
            className={`star-btn ${isStarred ? "starred" : ""}`}
            onClick={() => onToggleStar(problem.id)}
            title="あとで復習する"
          >
            {isStarred ? "⭐" : "☆"}
          </button>
        </div>
        <div className="question-text">
          <MathText text={problem.question} />
        </div>

        <div className="choices">
          {problem.choices.map((choice, i) => {
            let cls = "choice";
            if (phase === "feedback") {
              if (i === problem.answerIndex) cls += " choice-correct";
              else if (i === selected) cls += " choice-wrong";
              else cls += " choice-dim";
            }
            return (
              <button key={i} className={cls} disabled={phase !== "question"} onClick={() => handleAnswer(i)}>
                <span className="choice-label">{"ABCD"[i]}</span>
                <MathText text={choice} />
              </button>
            );
          })}
        </div>

        {phase === "question" && (
          <div className="hint-row">
            {!showHint ? (
              <button className="btn btn-ghost btn-sm" onClick={() => setShowHint(true)}>
                💡 ヒントを見る
              </button>
            ) : (
              <div className="hint-box pop-in">
                💡 <MathText text={problem.hint} />
                {timed && <button className="btn btn-ghost btn-sm" onClick={() => setShowHint(false)}>ヒントを閉じて計時を再開</button>}
              </div>
            )}
          </div>
        )}

        {phase === "feedback" && (
          <div className="feedback pop-in">
            <div className={`feedback-head ${wasCorrect ? "ok" : "ng"}`}>
              {selected === -1 ? "⏰ 時間切れ…" : wasCorrect ? "🎯 正解! ナイス理解!" : "💥 おしい!"}
            </div>
            <div className="explanation">
              <div className="explanation-tag">なぜそうなるか</div>
              <MathText text={problem.explanation} />
              <ProblemMeaning problem={problem} stageId={stage.id}/>
              {!wasCorrect&&<StudyAid stage={stage}/>}
              <button className="btn btn-ghost" onClick={()=>setReviewing(true)}>この単元の説明を見返す（回答を保持）</button>
            </div>
            <button className="btn btn-primary btn-big" onClick={next}>
              {solved.size === stage.problems.length && (!timed || enemyHp <= 0) ? "🏆 確認を完了" : timed && hearts <= 0 ? "結果へ" : "次の問題へ →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2 + Math.random() * 2,
        color: ["#4ee1ff", "#c86bff", "#ffd166", "#7bffb2", "#ff6b9d"][i % 5],
        size: 6 + Math.random() * 8,
      })),
    []
  );
  return (
    <div className="confetti">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: p.color,
            width: p.size,
            height: p.size * 0.6,
          }}
        />
      ))}
    </div>
  );
}
```

### `src/components/SpiralLesson.tsx`

```tsx
import {useEffect,useRef,useState} from 'react';
import {LessonNarration} from './LessonNarration';
import {useLessonPosition} from '../game/useLessonPosition';
import {StudyAid} from './StudyAid';
import type {Stage} from '../types';
import {spiralLessons,type SpiralCycle} from '../content/em-spiral';
import {movedCycles} from '../content/university-curriculum';
import {AdvancedEntry} from './LevelBridge';
import {TopicRoute} from './TopicRoute';
import {Figure} from './figures';
import {GuidedScene} from './GuidedScene';
import {EquationImage} from './CalculationBoard';
import {PathMeaning} from './PathMeaning';
import {EquationMeaning} from './EquationMeaning';
import {integralEquationGuides} from '../content/em-equation-guides';
import {gaussEquationGuide} from '../content/gauss-equation-guides';
import {EMScene3D} from './EMScene3D';
import {scene3DFor} from './em3d-model';
import {phaseLabel} from '../content/learning-paths';
import {ChapterFoundation} from './ChapterFoundation';
import './question-lesson.css';
import './spiral-lesson.css';

export function workSum(kind:'constant'|'linear',n:number,L:number){return kind==='constant'?2*L:L*L*(n-1)/n;}
function WorkPlot({kind,phase}:{kind:'constant'|'linear';phase:number}){
 const [n,setN]=useState(4),[L,setL]=useState(3),[selected,setSelected]=useState(1);
 const i=Math.min(selected,n-1),width=L/n,pos=i*width,force=kind==='constant'?2:2*pos;
 const x=(v:number)=>55+95*v,y=(f:number)=>225-27*f;
 const sum=workSum(kind,n,L),exact=kind==='constant'?2*L:L*L;
 return <div className="work-plot"><svg viewBox="0 0 390 290" role="img" aria-label={kind==='constant'?'一定の力の長方形を分割する図':'直線的に増える力の仕事を近似する図'}>
  <line x1="55" y1="225" x2="355" y2="225" stroke="#9eadc9"/><line x1="55" y1="30" x2="55" y2="225" stroke="#9eadc9"/>
  {Array.from({length:n},(_,j)=>{const a=j*L/n,F=kind==='constant'?2:2*a;return <rect key={j} x={x(a)} y={y(F)} width={95*L/n} height={225-y(F)} fill={j===i?'#ffd36a80':'#57dff835'} stroke={j===i?'#ffd36a':'#57dff8'}/>;})}
  <line x1="55" y1={y(kind==='constant'?2:0)} x2={x(L)} y2={y(kind==='constant'?2:2*L)} stroke="#ffd36a" strokeWidth="3"/>
  <text x="70" y="24" fill="#eef4ff" fontSize="15">{kind==='constant'?'F = 2 N':'F = kx、k = 2 N/m'}</text>
  <text x="16" y="65" fill="#b4c5df" fontSize="13">力[N]</text><text x="280" y="251" fill="#b4c5df" fontSize="13">距離 x [m]</text>
  <text x="55" y="245" fill="#b4c5df" fontSize="13">0</text><text x={x(L)} y="242" fill="#ffd36a" fontSize="13">{L.toFixed(1)}</text>
  <text x="195" y="280" textAnchor="middle" fill="#92e5bd" fontSize="16">{phase===2?`小区間の和 ${sum.toFixed(3)} J ／ 積分 ${exact.toFixed(3)} J`:`小区間の仕事の和：${sum.toFixed(3)} J`}</text>
 </svg><label>分割数 N = {n}<input aria-label="仕事の分割数" type="range" min="1" max="40" step="1" value={n} onChange={e=>setN(Number(e.target.value))}/></label><label>移動距離 L = {L.toFixed(1)} m<input aria-label="仕事の移動距離" type="range" min=".5" max="3" step=".5" value={L} onChange={e=>setL(Number(e.target.value))}/></label>
 {kind==='linear'&&phase===0&&<div className="meaning-panel"><label>見る区間 i = {i}<input aria-label="見る区間" type="range" min="0" max={n-1} value={i} onChange={e=>setSelected(Number(e.target.value))}/></label><p className="meaning-caption">金色の長方形一つを見る（番号は0から）。</p><div className="meaning-values"><span>幅 L/N<br/>{width.toFixed(3)} m</span><span>左端 iL/N<br/>{pos.toFixed(3)} m</span><span>高さ k×左端<br/>{force.toFixed(3)} N</span></div><p className="meaning-caption">一つの仕事 ≈ 高さ×幅 = {(force*width).toFixed(3)} J</p><p className="meaning-caption">Σは全区間を足す記号。WₙはN分割での近似値。kは力の増え方（図では2 N/m）。</p></div>}
 </div>;
}
export function SpiralLesson({stage,alreadyFinished,onComplete,onExit,onOpenStage,cyclesOverride,embedded}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void;onOpenStage?:(id:string)=>void;cyclesOverride?:SpiralCycle[];embedded?:boolean}){
 const [diagram,setDiagram]=useState(0);
 const cycles=cyclesOverride??spiralLessons[stage.id].filter(c=>!movedCycles[stage.id]?.[c.id]);
 const pages=cycles.flatMap((cycle,level)=>cycle.cards.map((card,phase)=>({cycle,level,card,phase})));
 const [page,setPage]=useLessonPosition(`${stage.id}:${embedded?'supplement':'spiral'}`,pages.length);
 const {level,phase,cycle,card}=pages[page];
 const start=cycles.slice(0,level).reduce((n,c)=>n+c.cards.length,0),last=phase===cycle.cards.length-1;
 const phases=cycle.cards.map((_,i)=>phaseLabel(i,cycle.cards.length));
 const equationGuide=stage.id==='ue-integrals'?integralEquationGuides[cycle.id]?.[card.guideIndex??phase]:gaussEquationGuide(stage,cycle,phase);
 const scene3D=scene3DFor(cycle.id,phase);
 const anchor=useRef<HTMLDivElement>(null),total=pages.length;
 const source=stage.lesson.steps.find(s=>s.story?.scene===card.scene)?.story;
 useEffect(()=>{setDiagram(card.beat??phase);anchor.current?.scrollIntoView({block:'start'});},[page,card]);
 return <div className="screen lesson guided-lesson question-lesson spiral-lesson" ref={anchor} data-spiral-lesson data-stage-id={stage.id}>
  <header className="screen-header">{!embedded&&<button className="btn-back" aria-label="章一覧へ戻る" onClick={onExit}>←</button>}<div><div className="screen-header-tag">{embedded?'移した補足':stage.title} · {cycle.title}</div><h1>{card.title}</h1></div></header>
  {!embedded&&<><AdvancedEntry stageId={stage.id} onOpenStage={onOpenStage}/><TopicRoute stageId={stage.id} onOpenStage={onOpenStage}/></>}
  <div className="spiral-context"><p className="spiral-goal">この段で求めること：{cycle.goal}</p><span>{cycle.uses}</span><nav aria-label="この段の学び方">{phases.map((p,i)=><button key={p} aria-current={phase===i?'step':undefined} onClick={()=>setPage(start+i)}>{p}</button>)}</nav></div>
  <p className="question-progress">第{level+1}段 / {cycles.length} · {page+1}/{total}</p>
  {level>0&&<p className="study-next">ここまでで確認したこと：{cycles[level-1].gain}</p>}
  <ChapterFoundation stageId={stage.id}/>
  <p className="question-answer">{card.text}</p>
  <LessonNarration key={`${stage.id}:${page}`} text={`${card.title}。今回求めることは、${cycle.goal}。${card.text}`}/>
  <section className="question-picture" aria-label="図で確かめる" key={`${cycle.id}/${phase}`}>
   {scene3D?<><EMScene3D scene={scene3D} phase={phase}/><details className="em3d-original"><summary>元の平面図と比較する</summary>{card.figure?<Figure id={card.figure}/>:card.scene?<GuidedScene scene={card.scene} beat={Math.min(diagram,(source?.beats.length??3)-1)}/>:null}</details></>:card.pathPart!==undefined?<PathMeaning initialPart={card.pathPart}/>:card.lab?<WorkPlot kind={card.lab} phase={card.beat??phase}/>:card.figure?<Figure id={card.figure}/>:card.scene?<><GuidedScene scene={card.scene} beat={Math.min(diagram,(source?.beats.length??3)-1)}/>{!['r-path','r-calculate','r-compare'].includes(card.scene)&&<label className="guided-camera">図を比較<input aria-label="図の段階を比較" type="range" min="0" max={(source?.beats.length??3)-1} step="1" value={diagram} onChange={e=>setDiagram(Number(e.target.value))}/></label>}</>:null}
  </section>
  {!embedded&&<StudyAid stage={stage} onPractice={()=>onComplete(!alreadyFinished)}/>}
  {equationGuide?<EquationMeaning key={page} guide={equationGuide} tex={card.tex} openDerivation={cycle.id==='sphere-area'&&phase===0}/>:card.tex&&<div className="guided-equation"><EquationImage tex={card.tex}/></div>}
  {last&&<p className="spiral-gain">次に使えること：{cycle.gain}</p>}
  <nav className="question-navigation" aria-label="スライドを移動"><button className="btn btn-ghost" disabled={page===0} onClick={()=>setPage(p=>p-1)}>← 前へ</button><button className="btn btn-primary" onClick={()=>page===total-1?(embedded?setPage(0):onComplete(!alreadyFinished)):setPage(p=>p+1)}>{page===total-1?(embedded?'補足の先頭へ':'バトルへ'):last?'次の基本事項へ →':`${phaseLabel(phase+1,cycle.cards.length)}へ →`}</button></nav>
  <nav className="lesson-dots" aria-label="学びの段を選ぶ">{cycles.map((s,i)=><button className={`lesson-dot ${level===i?'active':''}`} key={s.id} aria-label={`${i+1}. ${s.title}`} aria-current={level===i?'step':undefined} onClick={()=>setPage(cycles.slice(0,i).reduce((n,c)=>n+c.cards.length,0))}><span/></button>)}</nav>
  <details className="question-detail" key={`detail-${page}`}><summary>計算の詳細・前提を確認する</summary>{stage.lesson.steps.filter(s=>cycle.references.includes(s.story!.scene)).map(s=><section key={s.heading}><h2>{s.heading}</h2><p>前提：{s.story!.basis}</p>{s.story!.beats.map(b=><div key={b.action}><h3>{b.action}</h3><p>{b.text}</p>{b.tex&&<EquationImage tex={b.tex}/>}</div>)}{s.story!.notes?.map(n=><div key={n.title}><h3>{n.title}</h3><p>{n.text}</p><EquationImage tex={n.tex}/></div>)}</section>)}</details>
  <details className="question-detail"><summary>学習のつながり</summary>{cycles.map((s,i)=><button className="question-index" key={s.id} onClick={()=>setPage(cycles.slice(0,i).reduce((n,c)=>n+c.cards.length,0))}>{i+1}. {s.title} → {s.gain}</button>)}</details>
 </div>;
}
```

### `src/components/GuidedLesson.tsx`

```tsx
import { useEffect, useRef, useState } from 'react';
import {LessonNarration} from './LessonNarration';
import { useLessonPosition } from '../game/useLessonPosition';
import type { LessonStep, Stage } from '../types';
import { MathText } from './MathText';
import { EquationImage } from './CalculationBoard';
import { GuidedScene } from './GuidedScene';
import './guided-lesson.css';
import {SpiralLesson} from './SpiralLesson';

function Story({step,onNext,last}:{step:LessonStep;onNext:()=>void;last:boolean}) {
 const story=step.story!;
 const [beat,setBeat]=useState(0),[choice,setChoice]=useState<number|null>(null),[yaw,setYaw]=useState(.55);
 const focus=useRef<HTMLDivElement>(null);
 const initial=useRef(true);
 useEffect(()=>{if(initial.current){initial.current=false;return;}focus.current?.scrollIntoView({block:'start',behavior:'auto'});},[beat]);
 const current=story.beats[beat];
 return <>
  {!story.goal&&<p className="guided-context"><MathText text={step.body}/></p>}
  <div className="guided-board" ref={focus}>
   <p className="guided-current-question">{step.heading}</p>
   {story.goal&&<div className="rigorous-purpose"><strong>今回、何を求めるか</strong><p>{story.goal}</p>{story.goalTex&&<div className="guided-equation"><EquationImage tex={story.goalTex}/></div>}<p className="rigorous-basis"><strong>出発点・使う前提</strong>{story.basis}</p></div>}
   <div className="guided-beat-head"><span>図と一緒に考える</span><span>{beat+1} / {story.beats.length}</span></div>
   <h3>{current.action}</h3>
   <LessonNarration key={`${step.heading}:${beat}`} text={`${current.action}。見るところは、${current.focus}。${current.text}`}/>
   <GuidedScene scene={story.scene} beat={beat} yaw={yaw}/>
   <p className="guided-look"><span>見るところ</span><MathText text={current.focus}/></p>
   {story.scene==='tilt'&&<label className="guided-camera">視点を変える（面の角度・磁束は変わりません）<input aria-label="面を見る視点" type="range" min="-1.3" max="1.3" step=".05" value={yaw} onChange={e=>setYaw(Number(e.target.value))}/></label>}
   <div className="guided-explanation" aria-live="polite" aria-atomic="true" key={beat}>
    <p><MathText text={current.text}/></p>
    {current.tex&&<div className="guided-equation"><EquationImage tex={current.tex}/></div>}
   </div>
   <div className="guided-beat-actions">
    <button className="btn btn-ghost" disabled={beat===0} onClick={()=>setBeat(n=>n-1)} aria-label="図の説明を一段戻る">← 戻る</button>
    {beat<story.beats.length-1?<button className="btn btn-primary" onClick={()=>setBeat(n=>n+1)}>{story.beats[beat+1].action} →</button>:<span className="guided-complete">この問いの説明はここまで</span>}
   </div>
   {beat===story.beats.length-1&&story.result&&<section className="rigorous-result" aria-label="ここまでで分かったこと"><strong>ここまでで分かったこと</strong><p>{story.result}</p></section>}
   <details className="guided-recap"><summary>この問いの導出をまとめて見返す</summary><ol>{story.beats.map((s,i)=><li key={s.action}><button onClick={()=>setBeat(i)}>{s.action}の図へ戻る</button><p>{s.text}</p>{s.tex&&<EquationImage tex={s.tex}/>}</li>)}</ol></details>
   {story.notes&&<details className="guided-recap rigorous-notes"><summary>補足：ここで使った数学の根拠</summary>{story.notes.map(n=><section key={n.title}><h4>{n.title}</h4><p>{n.text}</p><EquationImage tex={n.tex}/></section>)}</details>}
  </div>
  {story.check&&<section className="guided-check" aria-label="小さな確認">
   <span className="guided-eyebrow">小さな確認 · 答えずに進んでもOK</span><h3>{story.check.question}</h3>
   <div className="guided-choices">{story.check.choices.map((option,i)=><button key={i} aria-pressed={choice===i} onClick={()=>setChoice(i)}><MathText text={option.text}/></button>)}</div>
   {choice!==null&&<p className="guided-feedback" role="status"><strong>{choice===story.check.answer?'そうです。':'図で確かめましょう。'}</strong><MathText text={story.check.choices[choice].feedback}/></p>}
  </section>}
  <button className="btn btn-primary btn-big guided-next" onClick={onNext}>{last?'⚔️ 理解をバトルで確かめる':'次の問いへ →'}</button>
 </>;
}

function LegacyGuidedLesson({stage,alreadyFinished,onComplete,onExit}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void}) {
 const [page,setPage]=useLessonPosition(stage.id,stage.lesson.steps.length);
 const top=useRef<HTMLElement>(null);
 const first=useRef(true);
 const steps=stage.lesson.steps,step=steps[page];
 useEffect(()=>{if(first.current){first.current=false;window.scrollTo({top:0});}else top.current?.scrollIntoView({block:'start'});},[page]);
 const destination=stage.id==='ue-integrals'?'ベクトル場と曲線から電子の仕事を積分し、面の座標から電気束の二重積分を組み立てて計算する。':'クーロンの法則と重ね合わせから、偏心球・任意の閉曲面のガウスの法則を証明し、証明と応用を区別する。';
 const next=()=>page===steps.length-1?onComplete(!alreadyFinished):setPage(n=>n+1);
 return <div className="screen lesson guided-lesson" data-stage-id={stage.id} data-guided-lesson>
  <header className="screen-header"><button className="btn-back" onClick={onExit} aria-label="章一覧へ戻る">←</button><div><div className="screen-header-tag">大学電磁気 · {stage.title}</div><h1>{stage.lesson.title}</h1></div></header>
  <p className="guided-intro">{stage.lesson.intro}</p>
  <section className="guided-destination" ref={top} aria-label="この章と今の問い"><span className="guided-eyebrow">この章の到達点</span><p>{destination}</p><div className="guided-topic-count">今の問い · {page+1} / {steps.length}</div><h2>{step.heading}</h2></section>
  <Story key={step.story!.scene} step={step} onNext={next} last={page===steps.length-1}/>
  <div className="guided-page-navigation"><button className="btn btn-ghost" disabled={page===0} onClick={()=>setPage(n=>n-1)}>← 前の問い</button><nav className="lesson-dots" aria-label="問いを選ぶ">{steps.map((s,i)=><button key={s.heading} className={`lesson-dot ${i===page?'active':''}`} title={`${i+1}. ${s.heading}`} aria-label={`問い ${i+1}: ${s.heading}`} aria-current={i===page?'step':undefined} onClick={()=>setPage(i)}><span/></button>)}</nav></div>
  <details className="guided-contents"><summary>問いの一覧から選ぶ</summary><ol>{steps.map((s,i)=><li key={s.heading}><button onClick={()=>setPage(i)} aria-current={page===i?'step':undefined}>{s.heading}</button></li>)}</ol></details>
  {page===steps.length-1&&<p className="guided-outro">{stage.lesson.outro}</p>}
 </div>;
}

export function GuidedLesson(props:Parameters<typeof LegacyGuidedLesson>[0]){
 return ['ue-integrals','ue-gauss'].includes(props.stage.id)?<SpiralLesson {...props}/>:<LegacyGuidedLesson {...props}/>;
}
```

### `src/components/LevelBridge.tsx`

```tsx
import { levelLabels, levelPreviews, preparationFor } from '../content/university-levels';
import { topicById } from '../content/university-curriculum';
import { EquationImage } from './CalculationBoard';
import { MathText } from './MathText';

/** 上級ステージの入口。初級・中級で身につけた読み方と、対応するステージへのリンクを置く。
 * 初級・中級を終えていなくても上級は開ける。ここは案内であって条件ではない。 */
export function AdvancedEntry({ stageId, onOpenStage }: { stageId: string; onOpenStage?: (id: string) => void }) {
  const all = preparationFor[stageId] ?? [];
  if (!all.length) return null;
  // 3分で見返せる量に絞る。初級を先に、各段階から最大4件まで。
  const pick = (level: string) => all.filter(entry => entry.level === level).slice(0, 4);
  const preparation = [...pick('intro'), ...pick('middle')];
  return (
    <details className="study-overview level-bridge">
      <summary>この上級単元の前提を確認・復習へ戻る</summary>
      <ul className="level-bridge-toolkit">
        {[topicById[stageId]?.intro.goal,topicById[stageId]?.middle.goal].filter(Boolean).map(item => <li key={item}>{item}</li>)}
      </ul>
      <p className="level-bridge-note">先に見ておくと読みやすい段です。飛ばしてこのまま進んでも構いません。</p>
      <ul className="level-bridge-links">
        {preparation.map(entry => (
          <li key={entry.id}>
            <button onClick={() => onOpenStage?.(entry.id)}>
              {levelLabels[entry.level]}・{entry.title}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** 初級・中級の到達点と、上級編の式の対応表。「分からなくてよい」で終わらせないための札。 */
export function AdvancedPreviewCard({ stageId }: { stageId: string }) {
  const preview = levelPreviews[stageId];
  if (!preview) return null;
  return (
    <section className="advanced-preview" aria-label="上級編での到達点">
      <h3>上級編での到達点</h3>
      <EquationImage tex={preview.goal} />
      <dl>
        <div><dt>今できればよいこと</dt><dd><MathText text={preview.now}/></dd></div>
        <div><dt>後で増えるもの</dt><dd><MathText text={preview.later}/></dd></div>
      </dl>
    </section>
  );
}

/** 初級・中級のスライド見出し。
 * 章テーマ・目標・段の説明を同じ強さで並べず、現在地は小さく一行だけ出す。 */
export function LevelSlideHeader({ page, total, heading, beat, role }: {
  page: number; total: number; heading: string; beat?: string; role?: string;
}) {
  return (
    <section className="level-slide-head" aria-label="今やっていること">
      <p className="level-now">
        <span className="level-now-phase">{beat ?? 'いまの話'}</span>
        {role && <span className={`level-role role-${['観察', '問い', '操作', '解釈', '固定'].indexOf(role)}`}>{role}</span>}
        <span className="level-now-count" aria-live="polite">{page + 1} / {total}</span>
      </p>
      <h2><MathText text={heading.replace(/^(復習|橋渡し)：/,'')}/></h2>
    </section>
  );
}
```

### `src/components/CalculationBoard.tsx`

```tsx
import { useEffect, useState, useRef } from 'react';
import type { Calculation } from '../content/calculations/schema';
import equations from '../content/calculations/equations.generated.json';
import { MathBlock } from './MathText';

const images: Record<string, { src: string; width: number; height: number }> = equations;
/** 生成した画像の中で日本語は <text> になり、表示が端末のフォント任せになる。
 * 日本語を含む式だけは、アプリと同じフォントで描ける KaTeX に回す。 */
const hasJapanese = (tex: string) => /[\u3040-\u30ff\u4e00-\u9fff]/.test(tex);
export function EquationImage({tex}: {tex:string}) {
  const [failedTex, setFailedTex] = useState<string | null>(null);
  const asset = images[tex];
  if (!asset || failedTex === tex || hasJapanese(tex)) return <div className="equation-image-scroll" data-equation-fallback><MathBlock tex={tex}/></div>;
  return <div className="equation-image-scroll"><img className="equation-image" src={`${import.meta.env.BASE_URL}${asset.src}`}
    onError={() => setFailedTex(tex)}
    alt={`数式: ${tex}`} width={asset.width} height={asset.height} draggable={false} /></div>;
}

export function CalculationBoard({calculation,purpose}: {calculation:Calculation;purpose?:string}) {
  const {lines} = calculation;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (playing) list.current?.firstElementChild?.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }, [active,playing]);
  useEffect(() => {
    if (!playing) return;
    if (active >= lines.length - 1) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setActive(n => n + 1), 2800);
    return () => window.clearTimeout(timer);
  }, [playing, active, lines.length]);
  return <section className={`calculation-board ${calculation.reference?'is-reference':''}`} aria-label={calculation.title}>
    <header className="calculation-header"><h3>{calculation.title}</h3>
      {lines.length > 1 && <span>{active + 1} / {lines.length}</span>}</header>
    {purpose&&<p className="figure-note">この計算の目的：{purpose}</p>}
    {calculation.reference&&<p className="figure-note">ここは本文の式の確認欄です。途中式を示す導出ではありません。</p>}
    <ol className="calculation-lines" ref={list}>
      {lines.map((line, i) => i===active?<li key={i} className="calculation-line is-active">
        <button className="calculation-line-select" onClick={() => {setPlaying(false);setActive(i);}}
          aria-label={`途中式 ${i+1}: ${line.note}`} aria-current={i === active ? 'step' : undefined}>
          <span className="calculation-number">{i + 1}</span><span>{line.note}</span>
        </button>
        {i>0&&!calculation.reference&&<div className="calculation-history"><p>一つ前の式</p><EquationImage tex={lines[i-1].tex}/><p>↓ {line.note}</p></div>}
        <EquationImage tex={line.tex} />
      </li>:null)}
    </ol>
    {lines.length > 1 && <div className="calculation-controls">
      <button className="btn btn-ghost" onClick={() => { if (active === lines.length-1) setActive(0); setPlaying(p => !p); }}
        aria-label={playing ? '式変形を一時停止' : '式変形を再生'}>{playing ? '⏸ 停止' : '▶ 式を追う'}</button>
      <button className="btn btn-ghost" disabled={active === 0} onClick={() => {setPlaying(false);setActive(n => n-1);}}>一段戻る</button>
      <button className="btn btn-ghost" disabled={active === lines.length-1} onClick={() => {setPlaying(false);setActive(n => n+1);}}>次の式 ↓</button>
    </div>}
    {lines.length>1&&<details className="calculation-all"><summary>{calculation.reference?'このスライドの式を一覧で確認':'導出全体を一覧で確認'}</summary>{lines.map((line,i)=><div key={i}><p>{i+1}. {line.note}</p><EquationImage tex={line.tex}/></div>)}</details>}
  </section>;
}
```

### `src/components/EMVideoLesson.tsx`

```tsx
import {useEffect,useRef,useState} from 'react';
import type {Stage} from '../types';
import catalog from '../content/em-video-catalog.generated.json';
import {claimNarration} from '../game/narration';
import {useLessonPosition} from '../game/useLessonPosition';
import {EquationImage} from './CalculationBoard';
import {QuantityGlossary} from './QuantityGlossary';
import type {EquationGuide} from '../content/em-equation-guides';
import {spiralLessons} from '../content/em-spiral';
import {movedCycles} from '../content/university-curriculum';
import {Figure} from './figures';
import {UniqueFigure,getUniqueShot} from './figures/unique';
import {EMScene3D} from './EMScene3D';
import {scene3DFor} from './em3d-model';
import {PathMeaning} from './PathMeaning';
import {GuidedScene} from './GuidedScene';
import {TopicRoute} from './TopicRoute';
import './em-video-lesson.css';

type MovieScene={index:number;heading:string;narration:string;equations:string[];guide?:EquationGuide;start:number;end:number;captions:{start:number;end:number;text:string}[]};
type Movie={id:string;stageId:string;stageTitle:string;level:string;title:string;duration:number;sourceIndices:number[];scenes:MovieScene[]};
const movies=catalog as unknown as Movie[];
export function hasEMMovies(stage:Stage){
 const count=spiralLessons[stage.id]?.filter(c=>!movedCycles[stage.id]?.[c.id]).reduce((n,c)=>n+c.cards.length,0)??stage.lesson.steps.length;
 const indices=movies.filter(m=>m.stageId===stage.id).flatMap(m=>m.sourceIndices);
 return indices.length===count&&new Set(indices).size===count&&indices.every(i=>i>=0&&i<count);
}
function InteractiveDiagram({stage,index}:{stage:Stage;index:number}){
 const cards=spiralLessons[stage.id]?.filter(c=>!movedCycles[stage.id]?.[c.id]).flatMap(cycle=>cycle.cards.map((card,phase)=>({cycle,card,phase})));
 if(cards){const {cycle,card,phase}=cards[index],scene=scene3DFor(cycle.id,phase);
  if(scene)return <EMScene3D scene={scene} phase={phase}/>;
  if(card.pathPart!==undefined)return <PathMeaning initialPart={card.pathPart}/>;
  if(card.figure)return <Figure id={card.figure}/>;
  if(card.scene)return <GuidedScene scene={card.scene} beat={card.beat??Math.min(phase,2)}/>;
 }
 const step=stage.lesson.steps[index];if(!step)return null;
 const shot=getUniqueShot(stage.id,step);
 return shot?<UniqueFigure shot={shot} id={`film-${stage.id}-${index}`}/>:step.figure?<Figure id={step.figure}/>:null;
}
export function EMVideoLesson({stage,alreadyFinished,onComplete,onExit,onOpenStage,onOriginal}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void;onOpenStage?:(id:string)=>void;onOriginal:()=>void}){
 const list=movies.filter(m=>m.stageId===stage.id);
 const [page,setPage]=useLessonPosition(`${stage.id}:nemo-movies-v1`,list.length);
 const movie=list[Math.min(page,list.length-1)];
 const player=useRef<HTMLVideoElement>(null),release=useRef<()=>void>(),top=useRef<HTMLDivElement>(null);
 const [failed,setFailed]=useState(false),[active,setActive]=useState(0);
 const base=`${import.meta.env.BASE_URL}media/em/${movie.id}`;
 const scene=movie.scenes[active]??movie.scenes[0];
 useEffect(()=>{setFailed(false);setActive(0);top.current?.scrollIntoView({block:'start'});return()=>{release.current?.();};},[movie.id]);
 function jump(index:number){const video=player.current;if(video)video.currentTime=movie.scenes[index].start;setActive(index);}
 return <div ref={top} className="screen lesson em-movie-lesson" data-stage-id={stage.id}>
  <header className="screen-header"><button className="btn-back" aria-label="章一覧へ戻る" onClick={onExit}>←</button><div><div className="screen-header-tag">大学電磁気・{{intro:'初級',middle:'中級',advanced:'上級'}[movie.level]} ／ 動画 {page+1} / {list.length}</div><h1>{stage.title}</h1></div></header>
  <TopicRoute stageId={stage.id} onOpenStage={onOpenStage}/>
  <section className="em-movie-main" aria-label="図と音声で学ぶ">
   <h2>この動画が求めること：{movie.title}</h2>
   <video key={movie.id} ref={player} controls playsInline preload="metadata" poster={`${base}.jpg`} aria-label={`${movie.title}の音声・字幕付き動画`}
    onError={()=>setFailed(true)} onPlay={()=>{release.current?.();release.current=claimNarration(()=>player.current?.pause());}}
    onTimeUpdate={()=>{const t=player.current?.currentTime??0;const i=movie.scenes.findIndex(s=>t>=s.start&&t<s.end);if(i>=0)setActive(i);}}>
    <source src={`${base}.mp4`} type="video/mp4" onError={()=>setFailed(true)}/>
   </video>
   {failed&&<p role="alert">この端末では動画を読み込めませんでした。<a href={`${base}.mp4`} target="_blank" rel="noreferrer">動画を直接開く</a>か、<button onClick={onOriginal}>元の図と解説を開く</button>をお試しください。</p>}
   <div className="em-movie-meta"><span>約{Math.round(movie.duration)}秒・音声：VOICEVOX Nemo 男声1</span><a href={`${base}.mp4`} target="_blank" rel="noreferrer">動画だけを開く</a><span>図と式は、動画の全画面ボタンと端末の横向き表示で大きく確認できます。</span></div>
   <nav className="em-movie-scenes" aria-label="動画の説明位置へ移動">{movie.scenes.map((s,i)=><button key={s.index} aria-current={active===i?'step':undefined} onClick={()=>jump(i)}>{i+1}. {s.heading}</button>)}</nav>
  </section>
  <section className="em-movie-notes" aria-label="今の場面の補足">
   <h3>この場面でつながること</h3><p>{scene.narration.split('。').filter(Boolean).slice(-1)[0]}。</p>
   <details key={`${movie.id}-${active}`} onToggle={e=>{if(e.currentTarget.open)player.current?.pause();}}><summary>この場面の式・記号・図を自分のペースで確認する</summary>
    <p>この場面の説明：{scene.narration}</p>
    {scene.guide&&<dl className="equation-symbols">{scene.guide.symbols.map(([symbol,meaning])=><div key={symbol}><dt>{symbol}</dt><dd>{meaning}</dd></div>)}</dl>}
    {scene.equations.length>0&&<><p>この計算が確認する内容：{scene.heading}</p>{scene.equations.map((tex,i)=><div key={tex} className="em-movie-equation"><span>式 {i+1}</span><EquationImage tex={tex}/></div>)}{!scene.guide&&<QuantityGlossary stageId={stage.id} expressions={scene.equations}/>}</>}
    <InteractiveDiagram key={`${stage.id}-${scene.index}`} stage={stage} index={scene.index}/>
   </details>
   <details><summary>動画全体の文章を読む</summary>{movie.scenes.map((s,i)=><section key={s.index}><h4>{i+1}. {s.heading}</h4><p>{s.narration}</p></section>)}</details>
  </section>
  <div className="lesson-controls"><div className="lesson-navigation"><button className="btn btn-ghost" disabled={page===0} onClick={()=>setPage(p=>p-1)}>← 前へ</button><nav className="lesson-dots" aria-label="解説動画を選ぶ">{list.map((m,i)=><button key={m.id} className={`lesson-dot ${i===page?'active':''}`} aria-label={`動画${i+1}: ${m.title}`} aria-current={page===i?'step':undefined} onClick={()=>setPage(i)}><span/></button>)}</nav></div>{page<list.length-1&&<button className="btn btn-primary" onClick={()=>setPage(p=>p+1)}>次へ →</button>}<button className="btn btn-battle" onClick={()=>onComplete(!alreadyFinished)}>⚔️ {stage.enemy.name}に挑む</button></div>
  <button className="btn btn-ghost" onClick={onOriginal}>元のスライドで詳しく確認する</button>
 </div>;
}
```

### `src/components/EMVideoPilot.tsx`

```tsx
import {useEffect,useRef} from 'react';
import {claimNarration} from '../game/narration';
import './em-video-pilot.css';

/** Pre-rendered narration: the diagram and voice share one media timeline. */
export function EMVideoPilot(){
 const base=import.meta.env.BASE_URL;
 const player=useRef<HTMLVideoElement>(null),release=useRef<()=>void>();
 useEffect(()=>()=>{release.current?.();},[]);
 return <section className="em-video-pilot" aria-label="線積分の60秒解説動画">
  <h2>この動画の目標：電気力が曲がった道でする仕事</h2>
  <p>中級「有限和から線積分へ」／ 力と移動の内積 → 小区間の和 → 線積分</p>
  <video ref={player} onPlay={()=>{release.current?.();release.current=claimNarration(()=>player.current?.pause());}} controls playsInline preload="metadata" poster={`${base}media/em-line-integral-nemo.jpg`} aria-label="Nemo音声付き・線積分の解説動画">
   <source src={`${base}media/em-line-integral-nemo.mp4`} type="video/mp4"/>
   下の解説スライドも、この動画と同じ題材を説明しています。
  </video>
  <a href={`${base}media/em-line-integral-nemo.mp4`} target="_blank" rel="noreferrer">動画だけを開く（MP4）</a>
  <p className="video-credit">音声：VOICEVOX Nemo 男声1。この動画は字幕付きで、自動再生しません。図と音声は、同じ動画に収録されています。</p>
  <details><summary>この動画の前提と補足</summary>
   <p>外からの操作が、正の電荷を指定した道に沿って動かします。描いた曲線は、電場だけで電荷が自由に動く場合の軌道ではありません。この動画が求める量は、電気力のする仕事です。</p>
   <p>数値例の条件は q = 1 C、Eₓ = kx/q、Eᵧ = 0、k = 1 N/mです。電荷のx座標は、0 mから2 mまで増えます。この数値例はxの範囲を等分し、各区間の力を左端の値で近似します。N分割の仕事の近似値は Wₙ = 2(1 − 1/N) Jとなり、その極限は2 Jです。</p>
   <p>この動画は全導出を代替するものではありません。続くスライドは、記号の定義と途中式を一つずつ説明します。</p>
  </details>
 </section>;
}
```

### `src/components/LessonNarration.tsx`

```tsx
import {useEffect,useMemo,useRef,useState} from 'react';
import {claimNarration,NarrationSession,sentences,speechText} from '../game/narration';
import {MathText} from './MathText';
import './lesson-narration.css';
function saved(key:string,fallback:string){try{return localStorage.getItem(key)??fallback;}catch{return fallback;}}
function save(key:string,value:string){try{localStorage.setItem(key,value);}catch{/* Playback also works without storage. */}}

export function LessonNarration({text}:{text:string}) {
  const lines=useMemo(()=>sentences(text),[text]);
  const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
  const [voice,setVoice]=useState(()=>saved('narration-voice',''));
  const [rate,setRate]=useState(()=>{const n=Number(saved('narration-rate','1'));return [.75,1,1.25,1.5].includes(n)?n:1;});
  const [index,setIndex]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [message,setMessage]=useState('再生すると、この説明を一文ずつ読み上げます。');
  const session=useRef<NarrationSession>();
  const release=useRef<()=>void>();
  const supported=typeof window!=='undefined'&&'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
  const stop=()=>{session.current?.stop();setPlaying(false);};
  useEffect(()=>{save('narration-voice',voice);save('narration-rate',String(rate));},[voice,rate]);

  useEffect(()=>{
    if(!supported) return;
    const synth=window.speechSynthesis;
    session.current=new NarrationSession(synth);
    const update=()=>setVoices(synth.getVoices().filter(v=>/^ja(?:-|_|$)/i.test(v.lang)));
    update();synth.addEventListener('voiceschanged',update);
    const hide=()=>{if(document.hidden){stop();setMessage('画面を離れたため停止しました。再開すると今の文を読み直します。');}};
    document.addEventListener('visibilitychange',hide);
    return ()=>{session.current?.stop();release.current?.();synth.removeEventListener('voiceschanged',update);document.removeEventListener('visibilitychange',hide);};
  },[supported]);
  useEffect(()=>{stop();setIndex(0);setMessage('再生すると、この説明を一文ずつ読み上げます。');},[text]);

  useEffect(()=>{
    if(!playing||!session.current||!lines[index]) return;
    const utterance=new SpeechSynthesisUtterance(speechText(lines[index]));
    utterance.lang='ja-JP';utterance.rate=rate;
    const selected=voices.find(v=>v.voiceURI===voice)??voices.find(v=>v.default)??voices[0];
    if(selected) utterance.voice=selected;
    let timer=window.setTimeout(()=>{session.current?.stop();setPlaying(false);setMessage('音声を開始できませんでした。端末の音声設定を確認して再生し直してください。');},15000);
    utterance.onstart=()=>{clearTimeout(timer);setMessage('読み上げ中');};
    session.current.speak(utterance,()=>{
      clearTimeout(timer);
      if(index+1<lines.length) setIndex(n=>n+1);
      else {setPlaying(false);setMessage('読み上げが終わりました。次へは自分のペースで進めます。');}
    },()=>{clearTimeout(timer);setPlaying(false);setMessage('読み上げを開始・継続できませんでした。声を変更するか、端末の音声設定を確認してください。');});
    return ()=>{clearTimeout(timer);session.current?.stop();};
  },[playing,index,rate,voice,lines]);

  function play(){
    release.current?.();
    release.current=claimNarration(()=>{stop();setMessage('別の説明を再生したため停止しました。');});
    setMessage('音声を準備中');setPlaying(true);
  }
  return <section className="lesson-narration" aria-label="端末の音声ガイド">
    <div className="narration-controls">
      <button className="btn btn-ghost" disabled={!supported||!lines.length} onClick={()=>{if(playing){stop();setMessage('停止中。再開すると今の文の先頭から読み直します。');}else play();}}>{playing?'⏸ 読み上げを停止':'▶ 音声で聞く'}</button>
      <button className="btn btn-ghost" disabled={index===0} onClick={()=>{stop();setIndex(n=>n-1);}}>一文戻る</button>
      <button className="btn btn-ghost" disabled={index>=lines.length-1} onClick={()=>{stop();setIndex(n=>n+1);}}>次の文</button>
      <button className="btn btn-ghost" onClick={()=>{stop();setIndex(0);setMessage('先頭に戻しました。');}}>最初へ</button>
    </div>
    {supported?<>
      <div className="narration-settings"><label>声 <select value={voice} onChange={e=>{stop();setVoice(e.target.value);}}><option value="">端末の日本語音声（自動）</option>{voices.map(v=><option key={v.voiceURI} value={v.voiceURI}>{v.name}{v.localService?'（端末内）':''}</option>)}</select></label>
      <label>速さ <select value={rate} onChange={e=>{stop();setRate(Number(e.target.value));}}>{[.75,1,1.25,1.5].map(n=><option key={n} value={n}>{n}倍</option>)}</select></label></div>
      <p className="narration-status" role="status">{message}</p>
      <p className="narration-caption" aria-label="読み上げる文"><span>{index+1}/{lines.length}</span> <MathText text={lines[index]??''}/></p>
      <details><summary>音声について</summary><p>端末の読み上げを使用します。声質・利用できる声は端末によって異なります。自動再生はせず、画面移動時は停止します。複雑な数式は画面で確認し、その説明を音声で聞く方式です。図の動きと音声の厳密な同期には未対応です。音声によって通信が必要な場合があります。</p></details>
    </>:<p role="status">この環境では端末の読み上げを利用できません。本文と図で学習できます。</p>}
  </section>;
}
```

## 図の共通部品

### `src/components/figures/index.tsx`

```tsx
import { useState } from 'react';
import { Diffraction } from './Diffraction';
import { figureReadings } from '../../content/figure-readings';
import { levelFigures } from './levels';
import { PotentialGradient } from './PotentialGradient';
import { HeatEngine } from './HeatEngine';
import { MotionContext } from './anim';
import { Flux3D, Cross3D, Helix3D, EmWave3D } from './spatial';
import { Longitudinal, StandingWave, YoungSlits, ChargeWork, Nuclide, MassEnergy } from './foundations';
import {
  XtSlope,
  StrobeAccel,
  VtArea,
  FreeFall,
  NewtonCarts,
  EnergySlide,
  Projectile,
  Collision,
  Circular,
  Spring,
} from "./mechanics";
import {
  HeatFlow,
  GasBox,
  WaveTravel,
  Beats,
  Refraction,
  Doppler,
  Interference,
  Circuit,
  Induction,
  Coulomb,
  Capacitor,
  Photoelectric,
  HalfLife,
  Bohr,
} from "./fields";
import {
  DerivSlope,
  IntegralSum,
  SmallAngle,
  DotProduct,
  CrossProduct,
  ShmCircle,
  TerminalV,
  PotentialSlope,
  MomentInertia,
  Rolling,
  Skater,
  GaussSphere,
  FluxTilt,
  AmpereWire,
  LorentzCircle,
  RcCharge,
} from "./univ";
import {
  PowerRule,
  SlopeTrace,
  DxAnatomy,
  ChainGears,
  ProductRect,
  VectorComponents,
  Ftc,
  EulerE,
  LineIntegral,
  SurfaceTiles,
  XvaChain,
  TorqueDoor,
  ComSeesaw,
} from "./univ2";
import {
  PredictMachine,
  SolveRecipe,
  FieldMap,
  TwoWords,
  LoopIntegral,
  ParallelMiss,
  AreaVector,
} from "./univ3";
import {
  AvgVsInstant,
  DeltaToD,
  AntiderivativeFamily,
  PartialHill,
  TaylorApprox,
  VectorBundle,
  PythagorasVec,
  DotComponents,
  DotProjection,
  Wrench,
  RightHand,
  DecaySlope,
  InitFamily,
  PeriodMass,
  ValleyParabola,
} from "./math2";
import {
  DragForces,
  DragModels,
  KeBank,
  PowerFlow,
  PathIndependent,
  EnergyLandscape,
  ImpulseArea,
  Restitution,
  AngularMomentum,
  TorqueSpinup,
  KeplerSweep,
  PendulumForce,
  PendulumSync,
  DampedResonance,
  InertiaShapes,
  ParallelAxis,
  TranslateRotate,
  TrainInertia,
  MoonFall,
} from "./mech2";
import {
  GaussRecipe,
  GaussCylPlane,
  ShellZero,
  ContourMap,
  ConductorPlateau,
  CapDerivation,
  FieldEnergy,
  Dielectric,
  Drift,
  DriftCollisions,
  Transmission,
  MotorForce,
  Helix,
  BiotSavart,
  AmpereCircle,
  Solenoid,
  Generator,
  InductorInertia,
  Transformer,
  TimeConstant,
  RlRise,
  LcOscillation,
  Impedance,
  MaxwellFour,
  EmWave,
  JourneyMap,
} from "./em2";

const ADVANCED_REGISTRY: Record<string, () => JSX.Element> = {
  'heat-engine': HeatEngine,
  'potential-gradient': PotentialGradient,
  'flux-3d': Flux3D, 'cross-3d': Cross3D, 'helix-3d': Helix3D, 'em-wave-3d': EmWave3D,
  'longitudinal': Longitudinal, 'standing-wave': StandingWave, 'young-slits': YoungSlits, 'single-slit': Diffraction,
  'charge-work': ChargeWork, 'nuclide': Nuclide, 'mass-energy': MassEnergy,
  "xt-slope": XtSlope,
  "strobe-accel": StrobeAccel,
  "vt-area": VtArea,
  freefall: FreeFall,
  newton: NewtonCarts,
  "energy-slide": EnergySlide,
  projectile: Projectile,
  collision: Collision,
  circular: Circular,
  spring: Spring,
  "heat-flow": HeatFlow,
  "gas-box": GasBox,
  "wave-travel": WaveTravel,
  beats: Beats,
  refraction: Refraction,
  doppler: Doppler,
  interference: Interference,
  circuit: Circuit,
  induction: Induction,
  coulomb: Coulomb,
  capacitor: Capacitor,
  photoelectric: Photoelectric,
  halflife: HalfLife,
  bohr: Bohr,
  "deriv-slope": DerivSlope,
  "integral-sum": IntegralSum,
  "small-angle": SmallAngle,
  "dot-product": DotProduct,
  "cross-product": CrossProduct,
  "shm-circle": ShmCircle,
  "terminal-v": TerminalV,
  "potential-slope": PotentialSlope,
  "moment-inertia": MomentInertia,
  rolling: Rolling,
  skater: Skater,
  "gauss-sphere": GaussSphere,
  "flux-tilt": FluxTilt,
  "ampere-wire": AmpereWire,
  "lorentz-circle": LorentzCircle,
  "rc-charge": RcCharge,
  "power-rule": PowerRule,
  "slope-trace": SlopeTrace,
  "dx-anatomy": DxAnatomy,
  "chain-gears": ChainGears,
  "product-rect": ProductRect,
  "vector-components": VectorComponents,
  ftc: Ftc,
  "euler-e": EulerE,
  "line-integral": LineIntegral,
  "surface-tiles": SurfaceTiles,
  "xva-chain": XvaChain,
  "torque-door": TorqueDoor,
  "com-seesaw": ComSeesaw,
  "predict-machine": PredictMachine,
  "solve-recipe": SolveRecipe,
  "field-map": FieldMap,
  "two-words": TwoWords,
  "loop-integral": LoopIntegral,
  "parallel-miss": ParallelMiss,
  "area-vector": AreaVector,
  "avg-vs-instant": AvgVsInstant,
  "delta-to-d": DeltaToD,
  "antiderivative-family": AntiderivativeFamily,
  "partial-hill": PartialHill,
  "taylor-approx": TaylorApprox,
  "vector-bundle": VectorBundle,
  "pythagoras-vec": PythagorasVec,
  "dot-components": DotComponents,
  "dot-projection": DotProjection,
  "wrench": Wrench,
  "right-hand": RightHand,
  "decay-slope": DecaySlope,
  "init-family": InitFamily,
  "period-mass": PeriodMass,
  "valley-parabola": ValleyParabola,
  "drag-forces": DragForces,
  "drag-models": DragModels,
  "ke-bank": KeBank,
  "power-flow": PowerFlow,
  "path-independent": PathIndependent,
  "energy-landscape": EnergyLandscape,
  "impulse-area": ImpulseArea,
  "restitution": Restitution,
  "angular-momentum": AngularMomentum,
  "torque-spinup": TorqueSpinup,
  "kepler-sweep": KeplerSweep,
  "pendulum-force": PendulumForce,
  "pendulum-sync": PendulumSync,
  "damped-resonance": DampedResonance,
  "inertia-shapes": InertiaShapes,
  "parallel-axis": ParallelAxis,
  "translate-rotate": TranslateRotate,
  "train-inertia": TrainInertia,
  "moon-fall": MoonFall,
  "gauss-recipe": GaussRecipe,
  "gauss-cyl-plane": GaussCylPlane,
  "shell-zero": ShellZero,
  "contour-map": ContourMap,
  "conductor-plateau": ConductorPlateau,
  "cap-derivation": CapDerivation,
  "field-energy": FieldEnergy,
  "dielectric": Dielectric,
  "drift": Drift,
  "drift-collisions": DriftCollisions,
  "transmission": Transmission,
  "motor-force": MotorForce,
  "helix": Helix,
  "biot-savart": BiotSavart,
  "ampere-circle": AmpereCircle,
  "solenoid": Solenoid,
  "generator": Generator,
  "inductor-inertia": InductorInertia,
  "transformer": Transformer,
  "time-constant": TimeConstant,
  "rl-rise": RlRise,
  "lc-oscillation": LcOscillation,
  "impedance": Impedance,
  "maxwell-four": MaxwellFour,
  "em-wave": EmWave,
  "journey-map": JourneyMap,
};

export const REGISTRY: Record<string, () => JSX.Element> = { ...ADVANCED_REGISTRY, ...levelFigures };

export function Figure({ id }: { id: string }) {
  const [paused, setPaused] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [speed, setSpeed] = useState(1);
  const [replay, setReplay] = useState(0);
  const Comp = REGISTRY[id];
  if (!Comp) return <p role="alert">図を読み込めませんでした。</p>;
  return (
    <div className="fig-wrap" data-figure-id={id}>
      <p className="figure-reading"><strong>この図で見ること：</strong>{figureReadings[id]}</p>
      <MotionContext.Provider value={{paused, speed}}><Comp key={`${id}-${replay}`} /></MotionContext.Provider>
      {id!=='potential-gradient'&&<div className="figure-controls">
        <button className="btn btn-ghost" aria-label={paused?'アニメーションを再生':'アニメーションを一時停止'} onClick={()=>setPaused(p=>!p)}>{paused?'▶ 再生':'Ⅱ 一時停止'}</button>
        <button className="btn btn-ghost" onClick={()=>{setReplay(n=>n+1);setPaused(false);}}>↻ 最初から</button>
        <label>速度 <select aria-label="アニメーション速度" value={speed} onChange={e=>setSpeed(+e.target.value)}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label>
      </div>}
      <details className="figure-reading-details"><summary>図の動きと尺度について</summary><p>「速度」は再生の速さです。物理量を変える操作は、角度・距離など名前を付けたスライダーで行います。視点を変えても物理量は変わりません。数値のない絵は模式図で、画面上の長さから物理量を測らないでください。</p></details>
    </div>
  );
}

/** 開発用: 全図解の一覧 (URLに #figs を付けると表示) */
export function FigureGallery() {
  // #figs=id1,id2 で絞り込み (全部同時に動かすと重いため)
  const only = typeof window !== "undefined" ? window.location.hash.split("=")[1] : "";
  const ids = only ? only.split(",").filter((k) => REGISTRY[k]) : Object.keys(REGISTRY);
  return (
    <div className="screen">
      <h1>図解ギャラリー (dev)</h1>
      {ids.map((id) => (
        <div key={id} style={{ marginBottom: 20 }}>
          <div style={{ color: "#9aa3c7", fontSize: 12, marginBottom: 4 }}>{id}</div>
          <Figure id={id} />
        </div>
      ))}
    </div>
  );
}
```

### `src/components/figures/levels/base.tsx`

```tsx
import { useState } from 'react';
import { useT, C } from '../anim';

/** 初級・中級の図解で使う共通部品。
 * 視覚語彙は仕様で固定されている。同じ概念を別の色・別の比喩に変えない。 */

export const W = 320;
export const H = 190;

/** 固定の色の約束。 */
export const L = {
  /** 経路・道 */
  path: '#e6c84a',
  /** 力・電場・磁場の矢印 */
  field: C.cyan,
  /** いま選んでいる小区間・小面 */
  focus: C.gold,
  /** 正の寄与 */
  plus: C.green,
  /** 負の寄与 */
  minus: C.purple,
  /** 法線 */
  normal: '#dbe6ff',
  /** 補助線・軸 */
  dim: C.dim,
  text: '#ffffff',
};

export { useT, C };

export function LevelFig({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <svg className="fig" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function width(s: string, size: number): number {
  let w = 0;
  for (const ch of s) w += ch.charCodeAt(0) > 0x2e7f ? size * 1.08 : size * 0.6;
  return w;
}

/** 図の下の一文。長ければ縮小し、それでも入らなければ2行に折り返す。 */
export function Cap({ text }: { text: string }) {
  const max = W - 16;
  let size = 11;
  while (size > 9.5 && width(text, size) > max) size -= 0.5;
  if (width(text, size) <= max) {
    return <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={size} fill={L.dim}>{text}</text>;
  }
  const chars = [...text];
  const middle = Math.floor(chars.length / 2);
  const stop = /[、。，,;；:：—→=)）」]/;
  let cut = middle;
  for (let d = 0; d < middle; d++) {
    if (stop.test(chars[middle + d] ?? '')) { cut = middle + d + 1; break; }
    if (stop.test(chars[middle - d] ?? '')) { cut = middle - d + 1; break; }
  }
  return (
    <g fontSize={9.5} fill={L.dim} textAnchor="middle">
      <text x={W / 2} y={H - 18}>{chars.slice(0, cut).join('')}</text>
      <text x={W / 2} y={H - 6}>{chars.slice(cut).join('')}</text>
    </g>
  );
}

/** 図の中の短いラベル。
 * 置き場所の約束: y は 164 以下（Cap の領域と重ねない）。
 * Axes を使う図で上部に文を置くときは x >= 64 にする（左上の縦軸ラベルと重なるため）。 */
export function Lbl({ x, y, text, color = L.text, size = 11, anchor = 'start', bold = false }: {
  x: number; y: number; text: string; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; bold?: boolean;
}) {
  return <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} fontWeight={bold ? 700 : 400}>{text}</text>;
}

/** 矢印（始点 + 変位）。 */
export function Arw({ x, y, dx, dy, color, w = 2.5, head = 8 }: {
  x: number; y: number; dx: number; dy: number; color: string; w?: number; head?: number;
}) {
  const len = Math.hypot(dx, dy);
  if (!(len > 0.4)) return null;
  const ux = dx / len, uy = dy / len;
  const ex = x + dx, ey = y + dy;
  const bx = ex - ux * head, by = ey - uy * head;
  const px = -uy * head * 0.5, py = ux * head * 0.5;
  return (
    <g>
      <line x1={x} y1={y} x2={bx} y2={by} stroke={color} strokeWidth={w} />
      <polygon points={`${ex},${ey} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
    </g>
  );
}

export type Mapper = {
  x: (v: number) => number; y: (v: number) => number;
  x0: number; y0: number; x1: number; y1: number;
  xr: [number, number]; yr: [number, number];
};

/** 数学座標 → 画面座標。y は上が大きい値になる。 */
export function mapper(xr: [number, number], yr: [number, number],
  box: { x0?: number; y0?: number; x1?: number; y1?: number } = {}): Mapper {
  const x0 = box.x0 ?? 44, y0 = box.y0 ?? 28, x1 = box.x1 ?? 296, y1 = box.y1 ?? 152;
  return {
    x: v => x0 + ((v - xr[0]) / (xr[1] - xr[0])) * (x1 - x0),
    y: v => y1 - ((v - yr[0]) / (yr[1] - yr[0])) * (y1 - y0),
    x0, y0, x1, y1, xr, yr,
  };
}

export function Axes({ m, xLabel, yLabel }: { m: Mapper; xLabel: string; yLabel: string }) {
  const ox = m.xr[0] <= 0 && m.xr[1] >= 0 ? m.x(0) : m.x0;
  const oy = m.yr[0] <= 0 && m.yr[1] >= 0 ? m.y(0) : m.y1;
  return (
    <g>
      <line x1={m.x0 - 4} y1={oy} x2={m.x1 + 8} y2={oy} stroke={L.dim} strokeWidth={1.4} />
      <line x1={ox} y1={m.y1 + 4} x2={ox} y2={m.y0 - 8} stroke={L.dim} strokeWidth={1.4} />
      <text x={m.x1 + 2} y={oy + 14} fontSize={10.5} fill={L.dim}>{xLabel}</text>
      <text x={ox - 34} y={m.y0 - 1} fontSize={10.5} fill={L.dim}>{yLabel}</text>
    </g>
  );
}

/** y = f(x) の折れ線。範囲外・NaN は描かない。 */
export function Curve({ m, f, color, w = 2.5, xa, xb, dash, n = 120 }: {
  m: Mapper; f: (x: number) => number; color: string; w?: number; xa?: number; xb?: number; dash?: string; n?: number;
}) {
  const a = xa ?? m.xr[0], b = xb ?? m.xr[1];
  const segments: string[] = [];
  let run: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    const y = f(x);
    if (!Number.isFinite(y) || y < m.yr[0] - (m.yr[1] - m.yr[0]) || y > m.yr[1] + (m.yr[1] - m.yr[0])) {
      if (run.length > 1) segments.push(run.join(' '));
      run = [];
      continue;
    }
    run.push(`${m.x(x).toFixed(1)},${m.y(y).toFixed(1)}`);
  }
  if (run.length > 1) segments.push(run.join(' '));
  return <g>{segments.map((pts, i) => (
    <polyline key={i} points={pts} fill="none" stroke={color} strokeWidth={w} strokeDasharray={dash} strokeLinejoin="round" />
  ))}</g>;
}

/** 階段状・曲線状の量を短冊で近似したときの1本。選択中は focus 色で塗る。 */
export function Bar({ m, x0, x1, height, active, color = L.field }: {
  m: Mapper; x0: number; x1: number; height: number; active?: boolean; color?: string;
}) {
  const top = m.y(Math.max(height, 0));
  const base = m.y(0);
  const y = Math.min(top, base), h = Math.abs(base - top);
  return (
    <rect x={m.x(x0)} y={y} width={Math.max(m.x(x1) - m.x(x0) - 1, 1)} height={h}
      fill={active ? L.focus : color} opacity={active ? 0.85 : 0.4}
      stroke={active ? L.focus : 'none'} strokeWidth={active ? 1.5 : 0} />
  );
}

/** 経過時間から、0,1,2,…,n-1 を一定間隔で巡回させる。小片を1つずつ数える演出に使う。 */
export function step(t: number, n: number, seconds = 1.1): number {
  return Math.floor((t % (n * seconds)) / seconds);
}

/** 0→1→0 を往復する係数。 */
export function pingPong(t: number, period = 5): number {
  const u = (t % period) / period;
  const v = u < 0.5 ? u * 2 : 2 - u * 2;
  return v * v * (3 - 2 * v);
}

/** 図の下に置く操作スライダー。物理量を変えるときだけ使い、名前と単位を付ける。 */
export function FigSlider({ label, value, min, max, step: s = 0.01, onChange, display }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; display?: string;
}) {
  return (
    <label className="figure-range">
      {label}{display ? ` = ${display}` : ''}
      <input type="range" aria-label={label} min={min} max={max} step={s} value={value}
        onChange={e => onChange(Number(e.target.value))} />
    </label>
  );
}

/** 自動で動かしつつ、学習者がスライダーを触ったらその値を保つ。 */
export function useManual(auto: (t: number) => number): [number, (v: number) => void] {
  const t = useT();
  const [manual, setManual] = useState<number | null>(null);
  return [manual ?? auto(t), setManual];
}

/** 数値を短く表示する。 */
export function fmt(v: number, digits = 1): string {
  return v.toFixed(digits).replace(/\.0+$/, '').replace('-', '−');
}
```

## 監査スクリプトの実例（この形を真似る）

### `scripts/audit-university-levels.mjs`

```javascript
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import Module from 'node:module';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import katex from 'katex';

/** 大学編の初級・中級だけを検査する。既存56ステージは audit-lessons.mjs が担当する。 */

const imports = `
 export { chapters } from './src/content';
 export { newLevelStageIds } from './src/content/levels/completion';
 export { foregroundText } from './src/content/lesson-text';
 export { getUniqueShot } from './src/components/figures/unique';
 export { figureReadings } from './src/content/figure-readings';
 export { levelStageIds, levelPreviews, preparationFor, universityFamilies, levelChapters } from './src/content/university-levels';
 export { REGISTRY, Figure } from './src/components/figures';
 export { levelReadings } from './src/components/figures/levels';
 export { lessonOrientations } from './src/content/lesson-orientation';
 export { learningPaths, unitAt, phaseLabel } from './src/content/learning-paths';
 export { quantityGlossary } from './src/content/quantity-glossary';
 export { chapterFoundations } from './src/content/chapter-foundations';
 export { getCalculation, calculationRules } from './src/content/calculations';
`;
const bundle = await build({
  stdin: { contents: imports, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic',
  plugins: [{ name: 'omit-styles', setup(b) {
    b.onResolve({ filter: /\.css$/ }, args => ({ path: args.path, namespace: 'styles' }));
    b.onLoad({ filter: /.*/, namespace: 'styles' }, () => ({ contents: '', loader: 'js' }));
  } }],
});
const mod = new Module(`${process.cwd()}/.level-audit.cjs`);
mod.paths = Module._nodeModulePaths(process.cwd());
mod._compile(bundle.outputFiles[0].text, mod.id);
const {
  chapters, newLevelStageIds, foregroundText, getUniqueShot, figureReadings, levelStageIds, levelPreviews, preparationFor, universityFamilies, levelChapters,
  REGISTRY, Figure, levelReadings, lessonOrientations, learningPaths, unitAt, phaseLabel,
  quantityGlossary, chapterFoundations, getCalculation, calculationRules,
} = mod.exports;

const images = existsSync('src/content/calculations/equations.generated.json')
  ? JSON.parse(readFileSync('src/content/calculations/equations.generated.json', 'utf8')) : {};
const all = chapters.flatMap(c => c.stages);
const advanced = chapters.filter(c => !c.level || c.level === 'advanced').flatMap(c => c.stages);
const levels = chapters.filter(c => c.level === 'intro' || c.level === 'middle');
const stages = levels.flatMap(c => c.stages);

// 既存データを壊していないこと
assert.equal(advanced.length, 56, '既存の上級56ステージが変わっている');
assert.equal(new Set(all.map(s => s.id)).size, all.length, 'ステージIDが重複している');
assert.equal(new Set(all.flatMap(s => s.problems.map(p => p.id))).size,
  all.reduce((n, s) => n + s.problems.length, 0), '問題IDが重複している');
assert.equal(new Set(all.map(s => s.lesson.id)).size, all.length, 'レッスンIDが重複している');

// 章の構成
for (const family of universityFamilies) {
  const present = family.levels.filter(entry => chapters.some(c => c.id === entry.chapterId));
  assert(present.some(entry => entry.level === 'advanced'), `上級が見つからない: ${family.id}`);
  for (const entry of present) {
    const chapter = chapters.find(c => c.id === entry.chapterId);
    assert(chapter.stages.length > 0, `空の章: ${entry.chapterId}`);
    assert(entry.tagline.length >= 6, `段階の案内が短い: ${entry.chapterId}`);
  }
}
const questMap = readFileSync('src/components/QuestMap.tsx', 'utf8');
assert(!/locked|prevCleared|disabled=/.test(questMap), '段階や単元を開けなくする仕組みが入っている');

const beats = ['基本事項', '疑問', '解決', '新しい基本事項'];
const prose = (text, where) => {
  assert.equal((text.match(/\$/g) || []).length % 2, 0, `$ が閉じていない: ${where}`);
  for (const m of text.matchAll(/\$([^$]+)\$/g)) katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' });
  const plain = text.replace(/\$[^$]+\$/g, '');
  assert(!/[\\_^]/.test(plain), `$ の外に TeX 記法が出ている: ${where}: ${plain}`);
  assert(!/undefined|NaN|\[object/.test(text), `未定義の値が混入: ${where}`);
};
const tex = (value, where) => {
  katex.renderToString(value, { throwOnError: true, strict: 'ignore' });
  assert(!/[぀-ヿ一-鿿]/.test(value.replace(/\\(?:text|mathrm)\{[^}]*\}|\\rm\s+[^}]*/g, '')),
    `数式の中の日本語は \\text{} で包む: ${where}: ${value}`);
};

let slideCount = 0, figureIds = new Set(), unitCount = 0, problemCount = 0;
for (const stage of stages) {
  const where = stage.id;
  assert(/^u[im]-/.test(stage.id), `初級は ui-、中級は um- で始める: ${stage.id}`);
  assert(levelStageIds.has(stage.id), `レベル一覧に載っていない: ${stage.id}`);
  assert(stage.enemy?.name && stage.enemy?.emoji && stage.enemy.maxHp > 0, `敵の設定がない: ${where}`);

  // 出発点・目的地
  const orientation = lessonOrientations[stage.id];
  assert(orientation, `この章のテーマがない: ${where}`);
  assert(orientation.theme.length > 8 && orientation.goal.length > 25, `テーマか目標が短い: ${where}`);
  prose(orientation.goal, `${where}/goal`);
  const foundation = chapterFoundations[stage.id];
  assert(foundation, `出発点（基本事項）がない: ${where}`);
  assert(foundation.known.length > 15 && foundation.startingPoint.length > 10 && foundation.conditions.length > 10,
    `出発点の記述が短い: ${where}`);
  tex(foundation.example.tex, `${where}/foundation`);

  // 段（学習経路）
  const path = learningPaths[stage.id];
  assert(path, `学習の段がない: ${where}`);
  assert.equal(path.at(-1).end, stage.lesson.steps.length, `段の終わりがスライド数と合わない: ${where}`);
  let start = 0;
  for (const unit of path) {
    assert(unit.end - start >= 2, `1段が短すぎる: ${where}`);
    assert(unit.goal && unit.gain, `段の目的か成果がない: ${where}`);
    for (let page = start; page < unit.end; page++) {
      const at = unitAt(path, page);
      assert.equal(at.start, start);
      assert(phaseLabel(at.offset, at.count));
    }
    start = unit.end;
    unitCount++;
  }

  // スライド
  assert(stage.lesson.steps.length >= (newLevelStageIds.has(stage.id)?3:6), `スライドが少ない: ${where}`);
  prose(stage.lesson.intro, `${where}/intro`);
  prose(stage.lesson.outro, `${where}/outro`);
  const seen = new Set();
  for (const [i, step] of stage.lesson.steps.entries()) {
    const at = `${where}/${i}`;
    prose(step.heading, `${at}/heading`);
    prose(step.body, `${at}/body`);
    assert([...foregroundText(stage.id,step,i)].length <= 150, `本文が150字を超えている: ${at}`);
    assert(!seen.has(step.body), `本文が重複している: ${at}`);
    seen.add(step.body);
    assert(step.figure, `図解のないスライドがある: ${at}`);
    assert(REGISTRY[step.figure]||getUniqueShot(stage.id,step), `図解IDが見つからない: ${at}: ${step.figure}`);
    assert(levelReadings[step.figure]||figureReadings[step.figure]||getUniqueShot(stage.id,step)?.observe, `「この図で見ること」がない: ${step.figure}`);
    if(REGISTRY[step.figure])figureIds.add(step.figure);
    assert(beats.includes(step.beat), `四拍子の札がない: ${at}`);
    assert(['観察', '問い', '操作', '解釈', '固定'].includes(step.role), `スライドの役割がない: ${at}`);
    // 本文は最大5行。1行はモバイル幅で折り返さない全角34字までとする。
    assert(Math.ceil([...foregroundText(stage.id,step,i)].length / 34) <= 5, `本文が5行を超えている: ${at}`);
    if (step.formula) tex(step.formula, `${at}/formula`);
    if (step.formulaNote) prose(step.formulaNote, `${at}/formulaNote`);
    const calculation = getCalculation(step);
    if (calculation) for (const line of calculation.lines) {
      tex(line.tex, `${at}/calculation`);
      assert(line.note, `変形の理由が書かれていない: ${at}`);
      if (Object.keys(images).length) assert(images[line.tex], `数式画像が生成されていない: ${at}: ${line.tex}`);
    }
    slideCount++;
  }
  // 四拍子: 基本事項で始まり、疑問と解決を経て、新しい基本事項で終わる
  const order = stage.lesson.steps.map(s => s.beat);
  assert.equal(order[0], '基本事項', `最初のスライドは基本事項から: ${where}`);
  assert.equal(order.at(-1), '新しい基本事項', `最後のスライドは新しい基本事項で締める: ${where}`);
  if(!newLevelStageIds.has(stage.id))assert(order.includes('疑問'), `疑問のスライドがない: ${where}`);
  assert(order.includes('解決'), `解決のスライドがない: ${where}`);

  // 記号表
  const glossary = quantityGlossary(stage.id);
  assert(glossary.length >= 8, `記号の説明が8件未満: ${where}`);
  assert.equal(new Set(glossary.map(d => d.key)).size, glossary.length, `記号が重複: ${where}`);
  for (const entry of glossary) assert(entry.label && entry.meaning, `記号の説明が空: ${where}`);

  // 上級編の予告
  const preview = levelPreviews[stage.id];
  if (preview) {
    tex(preview.goal, `${where}/preview`);
    assert(preview.now.length > 8 && preview.later.length > 8, `予告の対応付けが短い: ${where}`);
  }

  // 問題
  // Migrated compact lessons have one authored application; no duplicate padding questions.
  assert(stage.problems.length >= (newLevelStageIds.has(stage.id)?2:4), `確認問題が不足: ${where}`);
  for (const problem of stage.problems) {
    const at = `${where}/${problem.id}`;
    assert(/^p-u[im]/.test(problem.id)||problem.id===`review-${stage.id}`, `問題IDの接頭辞: ${at}`);
    assert.equal(problem.choices.length, problem.id.startsWith('review-')?2:4, `通常は四択、前提の確認は二択: ${at}`);
    assert.equal(new Set(problem.choices).size, problem.choices.length, `選択肢が重複: ${at}`);
    assert(problem.answerIndex >= 0 && problem.answerIndex < problem.choices.length, `正解番号が範囲外: ${at}`);
    assert([1, 2, 3].includes(problem.difficulty), `難易度は1〜3: ${at}`);
    assert(problem.hint && problem.explanation.length >= 40, `解説が短い: ${at}`);
    assert(!/上の図|図のように|先ほどの図/.test(problem.question), `問題文が図を参照している: ${at}`);
    prose(problem.question, `${at}/question`);
    problem.choices.forEach((c, k) => prose(c, `${at}/choice${k}`));
    prose(problem.hint, `${at}/hint`);
    prose(problem.explanation, `${at}/explanation`);
    problemCount++;
  }
}

// 図解が実際に描けること
for (const id of figureIds) {
  const html = renderToStaticMarkup(React.createElement(Figure, { id }));
  assert(html.includes('<svg'), `SVGが出ない: ${id}`);
  assert(!/NaN|Infinity/.test(html), `座標の計算が壊れている: ${id}`);
  assert(html.includes('アニメーションを一時停止'), `再生の操作がない: ${id}`);
  assert(html.includes('この図で見ること'), `図の読み方がない: ${id}`);
  for (const m of html.matchAll(/(?:width|height|r)="(-[\d.]+)"/g)) assert(false, `負の寸法: ${id}: ${m[0]}`);
}

// 上級への案内が、実在するステージを指していること
for (const [advancedId, list] of Object.entries(preparationFor)) {
  assert(all.some(s => s.id === advancedId), `案内先の上級ステージがない: ${advancedId}`);
  for (const entry of list) assert(levelStageIds.has(entry.id), `案内元が初級・中級でない: ${entry.id}`);
}

// 計算行の見出しは、実在するスライドと一対一で対応していること
const headings = new Set(all.flatMap(s => [...s.lesson.steps,...(s.lesson.supplements??[])].map(step => step.heading)));
for (const rule of calculationRules) {
  for (const heading of rule.headings) assert(headings.has(heading), `対応するスライドがない計算行: ${heading}`);
}

// 単位の整合が画面に出ていること（その系列の章がある場合のみ）
const text = levelChapters.flatMap(c => c.stages).flatMap(s => [
  s.lesson.intro, s.lesson.outro, ...s.lesson.steps.flatMap(step => [step.body, step.formulaNote ?? '']),
  chapterFoundations[s.id].example.tex, chapterFoundations[s.id].example.read,
]).join(' ');
const families = new Set(levels.map(c => c.familyId));
if (families.has('umech')) assert(/N·m|\\mathrm\{N\\cdot m\}|N\\cdot m/.test(text), 'N·m = J の単位整合が画面に出ていない');
if (families.has('uem')) assert(/N\/C|\\mathrm\{N\/C\}/.test(text) && /Wb|\\mathrm\{Wb\}/.test(text), 'N/C や Wb の単位整合が画面に出ていない');

console.log(JSON.stringify({
  result: 'PASS',
  levelChapters: levels.length,
  levelStages: stages.length,
  slides: slideCount,
  learningUnits: unitCount,
  figures: figureIds.size,
  problems: problemCount,
  previews: Object.keys(levelPreviews).length,
  advancedStagesUnchanged: advanced.length,
}, null, 2));
```

---

# 第3部 — 書き方サンプル（抜粋）

### `src/content/levels/intro-mechanics.ts`（全1148行のうち先頭240行）

レベル別ステージの書き方。1ステージ分だけ抜粋。

```tsx
import type { LevelChapter } from './schema';
import { r } from './schema';

/** 大学力学・初級 — 動きを小さく追う。
 * 「一定の力の仕事」と「変化する力の仕事」を別々のステージに分け、
 * 後者で「その場所の値 × 小さな幅」を足すという読み方を作る。 */
export const ui_mech: LevelChapter = {
  id: 'ui-mech',
  title: '力学',
  subtitle: '動き・力・仕事を小さく追う',
  familyId: 'umech',
  level: 'intro',
  stages: [
    // ================= 位置の記録から速度へ =================
    {
      id: 'ui-motion-record',
      title: '位置の記録から速度へ',
      subtitle: '差を取って、速さを出す',
      enemy: { name: 'キロクトカゲ', emoji: '🦎', maxHp: 105 },
      theme: '位置の記録から、平均の速度を読み取る',
      goal: r`原点と正の向きを決めて位置を記録し、$v=\Delta x/\Delta t$ で区間の平均の速度を符号込みで求められる。`,
      intro: '走っている物体の「速さ」は、そのままでは測れない。測れるのは、ある時刻にどこにいたかという位置だけだ。記録した位置の差から速度を作る手順を、ここで固める。',
      outro: '速度は、位置の差を時間の差で割った量。原点と正の向きを先に決めれば、符号が進む向きを表してくれる。区間を短くするほど、その時刻の速度に近づく。次は、力の矢印を描く。',
      foundation: {
        known: '引き算と割り算ができること。数直線の上で、正と負が逆向きを表すこと。',
        startingPoint: '位置を時刻ごとに表へ記録し、その差を時間の差で割るところから出発する。',
        conditions: 'この段では、まっすぐな線の上の運動だけを扱う。原点と正の向きは先に決め、途中で変えない。',
        example: {
          given: '時刻1.0 sで位置1.2 m、時刻1.5 sで位置2.1 m。',
          tex: r`v=\frac{2.1-1.2}{1.5-1.0}=\frac{0.9}{0.5}=1.8\,\mathrm{m/s}`,
          read: '割り算で出るのは、この0.5 sの間の平均。各瞬間の速度が1.8 m/sとは限らない。',
        },
      },
      glossary: {
        x: '選んだ軸の上の位置 [m]。原点と正の向きを決めてから測る',
        t: '記録を始めてからの時刻 [s]',
        v: 'この段では区間の平均の速度 [m/s]。変位÷かかった時間',
      },
      units: [
        { end: 3, goal: '原点と正の向きを決めて、位置を表に記録する', gain: '位置は、原点と正の向きを決めて初めて数になる。表の一行が「その時刻にどこにいたか」を表す。' },
        { end: 6, goal: '位置の差を時間で割り、符号付きの速度を出す', gain: '速度は変位÷かかった時間。負の値は、決めた正の向きと逆に動いたことを表す。' },
        { end: 10, goal: '位置のグラフの傾きとして速度を読む', gain: '位置-時間グラフの傾きが速度。区間を短くするほど、その時刻の速度に近づく。' },
      ],
      slides: [
        {
          heading: '位置を測る前に、何を決めておくのだろう?',
          beat: '基本事項',
          role: '観察',
          figure: 'uim2-axis-origin',
          body: '「3 mの地点」と言えるのは、原点と正の向きを決めたからだ。右を正と決めれば、原点の左側は−2 mになる。',
          formulaNote: '位置は、原点と正の向きを決めてから測る',
        },
        {
          heading: '時刻ごとの位置を並べると、何が見えるだろう?',
          beat: '基本事項',
          role: '観察',
          figure: 'uim2-position-table',
          body: '台車の位置を0.5 sごとに記録した表だ。0 sで0 m、0.5 sで0.5 m、1.0 sで1.2 m、1.5 sで2.1 m、2.0 sで3.0 m。',
        },
        {
          heading: '同じ0.5秒でも、進み方が違うのはなぜだろう?',
          beat: '疑問',
          role: '問い',
          figure: 'uim2-position-gaps',
          body: '隣り合う行の差は、0.5 m、0.7 m、0.9 m、0.9 mと変わる。同じ0.5 sでも進む距離が違う。',
        },
        {
          heading: '位置の差を時間で割ると、何が出るのだろう?',
          beat: '解決',
          role: '操作',
          figure: 'uim2-average-speed',
          body: '1.0 sから1.5 sの間に、位置は1.2 mから2.1 mへ0.9 m増えた。これを0.5 sで割った1.8が、この区間の平均の速度1.8 m/sだ。',
          formula: r`v=\frac{\Delta x}{\Delta t}`,
          formulaNote: '区間の平均の速度。Δは「後の値 − 前の値」',
          calculation: [
            { note: '区間の変位を、後の位置から前の位置を引いて求める', tex: r`\Delta x=2.1-1.2=0.9\,\mathrm{m}` },
            { note: 'かかった時間で割り、1秒あたりに直す', tex: r`v=\frac{0.9\,\mathrm{m}}{0.5\,\mathrm{s}}=1.8\,\mathrm{m/s}` },
          ],
        },
        {
          heading: '引き返した区間は、表のどこに現れるのだろう?',
          beat: '解決',
          role: '操作',
          figure: 'uim2-back-step',
          body: '2.0 sで3.0 m、2.5 sで2.6 m。差は−0.4 mで、0.5 sで割ると−0.8 m/s。負号は、正の向きと逆に動いた印だ。',
          calculation: [
            { note: '後の位置から前の位置を引くと、負になる', tex: r`\Delta x=2.6-3.0=-0.4\,\mathrm{m}` },
            { note: '時間で割ると、速度も負になる', tex: r`v=\frac{-0.4}{0.5}=-0.8\,\mathrm{m/s}` },
          ],
        },
        {
          heading: '向きを逆に決め直すと、値はどう変わるのだろう?',
          beat: '解決',
          role: '解釈',
          figure: 'uim2-flip-direction',
          body: '左を正と決め直すと、同じ運動の1.8 m/sは−1.8 m/sになる。速さの大きさは同じで、符号だけが入れ替わる。だから向きを先に決め、途中で変えない。',
        },
        {
          heading: '表の数字の並びを、一目で見る方法はないだろうか?',
          beat: '疑問',
          role: '問い',
          figure: 'uim2-xt-graph',
          body: '横軸に時刻、縦軸に位置を取って点を打つ。表の数字の列が、一本の折れ線になった。',
        },
        {
          heading: '位置のグラフの傾きは、何を表すのだろう?',
          beat: '解決',
          role: '解釈',
          figure: 'uim2-slope-read',
          body: '折れ線の急な区間ほど、同じ0.5 sで多く進んでいる。傾きの急さが速度の大きさ、下り坂が負の速度だ。水平なら位置が変わらず、速度は0になる。',
          formulaNote: '傾きの急さ = 速度の大きさ、下り = 負',
        },
        {
          heading: '区間を短くすると、平均の速度は何に近づくのだろう?',
          beat: '解決',
          role: '解釈',
          figure: 'uim2-shrink-interval',
          body: '0 sから2.0 sまでの平均は3.0÷2.0=1.5 m/s。同じ運動でも1.0〜1.5 sだけなら1.8 m/s。短くするほど、その時刻の速度に近づく。',
        },
        {
          heading: '速度を読むとき、何を決めてから測るのだろう?',
          beat: '新しい基本事項',
          role: '固定',
          figure: 'uim2-record-summary',
          body: '原点と正の向きを決める、時刻ごとの位置を記録する、差を取って時間で割る。この三手順で速度が出る。向きを決めずに測った値は、符号の意味を失う。',
          formulaNote: '向きを決める → 記録する → 差を取って割る',
        },
      ],
      preview: {
        goal: r`v(t)=\lim_{\Delta t\to0}\frac{\Delta x}{\Delta t}=\frac{dx}{dt}`,
        now: '区間の平均の速度を、表の差から求めること',
        later: '区間を限りなく短くすること、瞬間の速度を微分で定義すること',
      },
      leadsTo: ['uc-newton', 'um-derivative'],
      problems: [
        {
          id: 'p-uimr-1',
          difficulty: 1,
          question: '右を正とする。時刻1.0 sで位置1.2 m、時刻1.5 sで位置2.1 mだった。この区間の平均の速度は?',
          choices: ['1.8 m/s', '0.9 m/s', '3.3 m/s', '0.45 m/s'],
          answerIndex: 0,
          hint: '位置の差を、かかった時間で割る。',
          explanation: '変位は $2.1-1.2=0.9$ mで、かかった時間は0.5 s。$0.9\\div0.5=1.8$ だから**1.8 m/s**。0.9 m/sは割り算を忘れた値、3.3 m/sは位置を足してしまった値である。',
        },
        {
          id: 'p-uimr-2',
          difficulty: 2,
          question: '右を正とする。時刻2.0 sで位置3.0 m、時刻2.5 sで位置2.6 mだった。この区間の平均の速度は?',
          choices: ['0.8 m/s', '−0.8 m/s', '−0.4 m/s', '0 m/s'],
          answerIndex: 1,
          hint: '後の位置から前の位置を引くと、符号はどうなるか。',
          explanation: '変位は $2.6-3.0=-0.4$ mで、$-0.4\\div0.5=-0.8$ だから**−0.8 m/s**。負号は正の向きと逆に動いたという情報で、これを落とすと向きが分からなくなる。−0.4は時間で割っていない値である。',
        },
        {
          id: 'p-uimr-3',
          difficulty: 2,
          question: '時刻を横軸、位置を縦軸に取ったグラフで、ある区間だけが水平になっていた。この区間の運動として正しいのは?',
          choices: ['その場に止まっている', '一定の速さで進んでいる', '速度が最大になっている', '位置が0になっている'],
          answerIndex: 0,
          hint: '水平ということは、位置の差がいくらということか。',
          explanation: '水平な区間では位置が変わらないので変位は0、割っても速度は0になる。つまり**その場に止まっている**。位置が0であることとは無関係で、高い位置で水平なら、その高さで静止している。',
        },
        {
          id: 'p-uimr-4',
          difficulty: 3,
          question: '同じ運動について、正の向きを右から左へ決め直した。速度の値はどうなる?',
          choices: ['符号が入れ替わる', '大きさが半分になる', 'まったく変わらない', 'どの区間も正になる'],
          answerIndex: 0,
          hint: '変位の符号がどうなるかを、まず考える。',
          explanation: '向きを逆に決めると、同じ移動の変位が符号だけ反転する。時間で割っても符号はそのままなので、速度は**符号が入れ替わる**。大きさ（速さ）は同じで、変わるのは向きの表し方だけである。',
        },
      ],
    },

    // ================= 力の地図を描く =================
    {
      id: 'ui-force-map',
      title: '力の地図を描く',
      subtitle: 'その物体に働く力だけ',
      enemy: { name: 'フォースミミック', emoji: '🧭', maxHp: 115 },
      theme: '一つの物体を囲み、それに働く力だけを矢印にする',
      goal: r`一つの物体を囲んで、その物体に働く力だけを矢印で描き、縦と横に分けて合力 $F_{\text{合}}$ を求められる。`,
      intro: '力の計算でつまずくのは、どの力を足すのかが曖昧なまま始めるときだ。まず一つの物体を囲む。囲んだ中に入る矢印だけを足す。この線引きを最初に固める。',
      outro: '力を足す前に、対象を一つ決めて囲む。囲んだ物体に外から働く力だけを描き、縦と横に分けて足す。作用反作用の二力は別々の物体に働くので、同じ図の中で打ち消さない。',
      foundation: {
        known: '矢印の向きと長さで力を表せること。同じ向きの力なら足し合わせられること。',
        startingPoint: '物体を一つ選んで囲み、その物体に外から働く力だけを矢印にするところから出発する。',
        conditions: 'この段では物体を一点とみなし、回転は考えない。力の向きは水平と垂直の2方向に限る。',
        example: {
          given: '2 kgの箱に、重力20 N下向き、垂直抗力20 N上向き、押す力6 N右向き、摩擦2 N左向き。',
          tex: r`F_{\text{縦}}=20-20=0\,\mathrm{N},\quad F_{\text{横}}=6-2=4\,\mathrm{N}`,
          read: '縦は相殺して0 N。横に4 Nだけ残り、この分が箱の速度を変える。',
        },
      },
      glossary: {
        F: 'この段では、囲んだ物体に外から働く力 [N]',
        N: '面が物体を垂直に押し返す力、垂直抗力 [N]',
        f: 'この段では、面が滑りを妨げる摩擦力 [N]',
      },
      units: [
        { end: 3, goal: '対象を一つ囲み、その物体に働く力だけを描く', gain: '力の図は物体ごとに描く。囲みの中に入るのは、外から押す・引く・支える力だけ。' },
        { end: 6, goal: '縦と横に分けて、残る合力を求める', gain: '向かい合う同じ大きさの力は相殺する。残った分が合力で、速度を変えるのはこれだけ。' },
        { end: 9, goal: 'つり合いと作用反作用を、図の上で区別する', gain: '作用反作用は必ず別々の物体に働く。同じ物体の図の中で、この二力を打ち消してはいけない。' },
      ],
      slides: [
        {
          heading: '力を足す前に、まず何を囲むのだろう?',
          beat: '基本事項',
          role: '観察',
          figure: 'uim2-isolate-ring',
          body: '床の上の箱を、手が押している。まず箱だけを丸で囲むと、その中身がこれから力を数える対象になる。',
          formulaNote: '対象を一つに決めてから、力を数え始める',
        },
        {
          heading: '輪の中に描いてよいのは、どの矢印だろう?',
          beat: '基本事項',
          role: '観察',
          figure: 'uim2-forces-on-box',
          body: '描くのは、箱に外から働く力だけだ。重力20 N下向き、垂直抗力20 N上向き、押す力6 N右向き、摩擦2 N左向きの4本になる。',
        },
        {
          heading: '4本の矢印のうち、動きを変えるのはどれだろう?',
          beat: '疑問',
          role: '問い',
          figure: 'uim2-which-matters',
          body: '同じ箱に働く力の合計が0なら、速度は変わらない。静止中なら静止を続け、動いていれば等速直線運動を続ける。箱が右へ加速するなら、その箱に働く合力は右向きだ。',
        },
        {
          heading: '向かい合う二つの力は、どう足せばよいのだろう?',
          beat: '解決',
          role: '操作',
          figure: 'uim2-balance-pair',
          body: '重力20 Nは下向き、垂直抗力20 Nは上向き。上向きを正とすると20−20=0で、縦には何も残らない。だから箱は床へ沈みもせず、浮き上がりもしない。',
          calculation: [
            { note: '上向きを正と決めて、縦向きの力を並べる', tex: r`F_{\text{縦}}=20-20` },
            { note: '同じ大きさで逆向きなので相殺する', tex: r`F_{\text{縦}}=0\,\mathrm{N}` },
          ],
        },
        {
          heading: '横向きの矢印を足すと、何が残るのだろう?',

// …以下 908 行省略。全文はリポジトリを見ること。
```

### `src/components/figures/levels/intro-mechanics.tsx`（全1747行のうち先頭150行）

図の書き方。先頭の数個だけ抜粋。

```tsx
import { Arw, Axes, Bar, Cap, Curve, FigSlider, L, Lbl, LevelFig, mapper, pingPong, step, useManual, useT, fmt } from './base';

/** 大学力学・初級の図解。
 * 一定力の仕事（長方形）から、変化する力の仕事（小区間の和）まで、同じ縦軸・横軸で通す。
 * 縦軸は力 [N]、横軸は位置 [m]。面積が仕事 [J]。 */

const F_X = mapper([0, 4], [0, 4], { x0: 48, y0: 30, x1: 288, y1: 146 });

/** 床の上の箱。x は箱の左端の画面座標。 */
function Box({ x, y = 96, w = 34, h = 26 }: { x: number; y?: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={5} fill={L.field} opacity={0.9} />;
}

function Floor({ y = 122 }: { y?: number }) {
  return <line x1={16} y1={y} x2={304} y2={y} stroke={L.dim} strokeWidth={2} />;
}

/** 一定の力で箱を押し、同じ向きに動かす。 */
export function PushBox() {
  const t = useT();
  const u = pingPong(t, 6);
  const x = 60 + 150 * u;
  return (
    <LevelFig label="一定の力で箱を押して動かす">
      <Floor />
      <Box x={x} />
      <Arw x={x - 36} y={109} dx={30} dy={0} color={L.plus} w={3} />
      <Lbl x={x - 40} y={100} text="F = 2 N" color={L.plus} size={11} />
      <line x1={60} y1={140} x2={210} y2={140} stroke={L.path} strokeWidth={2} />
      <line x1={60} y1={134} x2={60} y2={146} stroke={L.path} strokeWidth={2} />
      <line x1={210} y1={134} x2={210} y2={146} stroke={L.path} strokeWidth={2} />
      <Lbl x={135} y={158} text="L = 3 m" color={L.path} size={11} anchor="middle" />
      <Lbl x={20} y={40} text="力の向きと移動の向きが同じ" color={L.text} size={11.5} />
      <Lbl x={20} y={58} text={`W = F × L = 2 × ${fmt(3 * u, 1)} = ${fmt(6 * u, 1)} J`} color={L.focus} size={12} />
      <Cap text="同じ向きに押して動かした分だけ、仕事が増える" />
    </LevelFig>
  );
}

/** 力-位置グラフの長方形の面積が仕事。 */
export function WorkRect() {
  const t = useT();
  const u = pingPong(t, 6);
  const right = F_X.x(3 * u);
  return (
    <LevelFig label="力と位置のグラフの長方形の面積が仕事">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      <rect x={F_X.x(0)} y={F_X.y(2)} width={Math.max(right - F_X.x(0), 0)} height={F_X.y(0) - F_X.y(2)}
        fill={L.focus} opacity={0.35} />
      <line x1={F_X.x(0)} y1={F_X.y(2)} x2={F_X.x(3)} y2={F_X.y(2)} stroke={L.field} strokeWidth={2.5} />
      <Lbl x={F_X.x(3) + 4} y={F_X.y(2) - 4} text="F = 2 N" color={L.field} size={10.5} />
      <Lbl x={F_X.x(1.5)} y={F_X.y(1) + 4} text={`面積 = ${fmt(6 * u, 1)} J`} color={L.focus} size={12} anchor="middle" />
      <Lbl x={66} y={22} text="縦 = 力、横 = 位置。囲む面積が仕事" color={L.text} size={11} />
      <Cap text="高さ2 N・幅3 mの長方形。面積2×3=6が仕事6 J" />
    </LevelFig>
  );
}

/** 単位の掛け算: N×m=J。 */
export function WorkUnits() {
  const t = useT();
  const phase = step(t, 3, 1.4);
  const rows = [
    { left: '力 F', right: '2 N', color: L.plus },
    { left: '移動距離 L', right: '3 m', color: L.path },
    { left: '仕事 W = F×L', right: '6 N·m = 6 J', color: L.focus },
  ];
  return (
    <LevelFig label="単位の掛け算でジュールになる">
      {rows.map((row, i) => (
        <g key={row.left} opacity={i <= phase ? 1 : 0.2}>
          <rect x={40} y={36 + i * 34} width={240} height={26} rx={6} fill={row.color} opacity={i === phase ? 0.22 : 0.1} />
          <Lbl x={52} y={54 + i * 34} text={row.left} color={L.text} size={12} />
          <Lbl x={268} y={54 + i * 34} text={row.right} color={row.color} size={12} anchor="end" bold={i === 2} />
        </g>
      ))}
      <Lbl x={160} y={156} text="N × m = J（ニュートン・メートルがジュール）" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="数だけでなく単位も掛ける。答えの単位がJなら仕事" />
    </LevelFig>
  );
}

/** 動かなければ仕事は0。 */
export function NoMoveNoWork() {
  const t = useT();
  const shake = 1.2 * Math.sin(8 * t);
  return (
    <LevelFig label="壁を押しても動かなければ仕事はゼロ">
      <Floor />
      <rect x={196} y={40} width={26} height={82} fill={L.dim} opacity={0.5} />
      <Box x={160 + shake} />
      <Arw x={128} y={109} dx={28} dy={0} color={L.plus} w={3} />
      <Lbl x={110} y={98} text="F = 200 N" color={L.plus} size={11} />
      <Lbl x={20} y={40} text="いくら押しても、壁は動かない" color={L.text} size={11.5} />
      <Lbl x={20} y={58} text="移動距離 L = 0 m" color={L.path} size={11.5} />
      <Lbl x={20} y={76} text="W = 200 × 0 = 0 J" color={L.minus} size={12} />
      <Cap text="物理の仕事は「力 × その向きに動いた距離」。動かなければ0" />
    </LevelFig>
  );
}

/** 力2倍・距離2倍で仕事はそれぞれ2倍。 */
export function WorkCompare() {
  const t = useT();
  const which = step(t, 3, 1.8);
  const cases = [
    { f: 2, l: 3, tag: '元の場合' },
    { f: 4, l: 3, tag: '力だけ2倍' },
    { f: 2, l: 6, tag: '距離だけ2倍' },
  ];
  const m = mapper([0, 7], [0, 5], { x0: 48, y0: 34, x1: 286, y1: 132 });
  const c = cases[which];
  return (
    <LevelFig label="力や距離を2倍にすると仕事も2倍">
      <Axes m={m} xLabel="位置 x [m]" yLabel="力 F [N]" />
      <rect x={m.x(0)} y={m.y(c.f)} width={m.x(c.l) - m.x(0)} height={m.y(0) - m.y(c.f)} fill={L.focus} opacity={0.35} />
      <line x1={m.x(0)} y1={m.y(c.f)} x2={m.x(c.l)} y2={m.y(c.f)} stroke={L.field} strokeWidth={2.5} />
      <Lbl x={66} y={24} text={`${c.tag}: F = ${c.f} N、L = ${c.l} m`} color={L.text} size={11.5} />
      <Lbl x={m.x(c.l / 2)} y={m.y(c.f / 2)} text={`W = ${c.f * c.l} J`} color={L.focus} size={13} anchor="middle" bold />
      <Cap text="面積が2倍になるのは、縦を2倍にしても横を2倍にしても同じ" />
    </LevelFig>
  );
}

/** 進む向きと逆の力は負の仕事。 */
export function WorkNegative() {
  const t = useT();
  const u = pingPong(t, 6);
  const x = 70 + 120 * u;
  return (
    <LevelFig label="進む向きと逆向きの力は負の仕事">
      <Floor />
      <Box x={x} />
      <Arw x={x + 44} y={82} dx={28} dy={0} color={L.path} w={3} />
      <Lbl x={x + 40} y={74} text="進む向き" color={L.path} size={10.5} />
      <Arw x={x} y={109} dx={-28} dy={0} color={L.minus} w={3} />
      <Lbl x={x - 34} y={100} text="摩擦 1 N" color={L.minus} size={10.5} anchor="end" />
      <Lbl x={20} y={34} text="力が逆向きなら、仕事は負になる" color={L.text} size={11.5} />
      <Lbl x={20} y={52} text="W = −1 N × 2 m = −2 J" color={L.minus} size={12} />
      <Lbl x={20} y={70} text="運動エネルギーはその分だけ減る" color={L.dim} size={10.5} />
      <Cap text="符号は向きの情報。負の仕事は、取り出された分を表す" />
    </LevelFig>
  );
}

/** 斜めの力は、進む向きの成分だけが効く。 */
export function WorkAngle() {
  const [deg, setDeg] = useManual(time => 30 + 30 * pingPong(time, 8));
  const th = (deg * Math.PI) / 180;
  const ox = 92, oy = 134, len = 68;

// …以下 1597 行省略。全文はリポジトリを見ること。
```

### `src/content/mechanics.ts`（全1044行のうち先頭120行）

高校ステージの書き方（旧形式）。先頭だけ抜粋。

```tsx
import type { Chapter } from "../types";

// 力学。方針: 暗記させない。すべての公式に「なぜそうなるか」の導出ステップを付ける。

export const mechanics: Chapter = {
  id: "mechanics",
  title: "力学",
  subtitle: "運動・力・エネルギー",
  stages: [
    // ================= STAGE 1 =================
    {
      id: "m1-velocity",
      title: "速度",
      subtitle: "「速さ」を数式で言えるようになる",
      enemy: { name: "イナーシャスライム", emoji: "🟢", maxHp: 100 },
      lesson: {
        id: "lesson-velocity",
        title: "速度とは何か",
        intro:
          "「新幹線は速い」「カタツムリは遅い」— 誰でも知っている感覚を、数字で比べられる形にするのがこのステージのゴール。ここが力学のすべての出発点になる。",
        steps: [
          {
            heading: "① 速さ = 1秒あたりに進む距離",
            body:
              "100mを20秒で走る人と、80mを20秒で走る人、速いのは前者。では100mを20秒の人と、60mを10秒の人は? 時間が違うと直接比べられない。そこで**「もし1秒だったら何m進むか」に揃えて比べる**。これが速さの正体。100m÷20s = 1秒あたり5m。60m÷10s = 1秒あたり6m。後者が速い。",
            formula: "v = \\dfrac{x}{t}",
            formulaNote: "速さ = 距離 ÷ 時間 は「1秒あたりに直す」操作",
          },
          {
            heading: "② 単位 m/s の読み方",
            body:
              "$5\\,\\mathrm{m/s}$ は「メートル毎秒」。読んで字のごとく **1秒(per second)あたり5m** という意味。単位そのものが $\\frac{\\mathrm{m}}{\\mathrm{s}}$ という分数になっていて、距離÷時間という計算の由来をそのまま表している。単位を見れば公式を思い出せる — これは物理全体で使える裏ワザ。",
          },
          {
            heading: "③ 「速度」は向きを持つ",
            body:
              "物理では「速さ」と「速度」を区別する。**速度 = 速さ + 向き**。直線上の運動なら、右向きを正と決めて、右へ$5\\,\\mathrm{m/s}$なら $v = +5$、左へ$5\\,\\mathrm{m/s}$なら $v = -5$ と書く。マイナスは「遅い」ではなく**「逆向き」**という意味。この約束のおかげで、向きの情報を計算に乗せられる。",
          },
          {
            heading: "④ 等速直線運動と x-t グラフ",
            figure: "xt-slope",
            body:
              "速度が一定の運動を**等速直線運動**という。$v = \\frac{x}{t}$ を変形すると移動距離が出せる。横軸に時間、縦軸に位置をとった **x-t グラフ**では、等速直線運動はまっすぐな直線になり、**傾きがそのまま速度**。傾きが急なほど速い。グラフの傾きを見る、という見方はこの先ずっと使う。",
            formula: "x = vt",
            formulaNote: "1秒あたりv進むなら、t秒でその t 倍進む",
          },
        ],
        outro:
          "覚えることは実は1つもない。「1秒あたりに直す」という考え方だけが本体で、$v=x/t$ も $x=vt$ もその言い換えにすぎない。それを確かめにバトルへ。",
      },
      problems: [
        {
          id: "p-v-1",
          difficulty: 1,
          question: "100mを20秒で走った。平均の速さは?",
          choices: ["$2\\,\\mathrm{m/s}$", "$5\\,\\mathrm{m/s}$", "$20\\,\\mathrm{m/s}$", "$2000\\,\\mathrm{m/s}$"],
          answerIndex: 1,
          hint: "「1秒あたり何m?」に直す。距離 ÷ 時間。",
          explanation:
            "速さは「1秒あたりに進む距離」。$v = \\frac{x}{t} = \\frac{100}{20} = 5\\,\\mathrm{m/s}$。20分の1にするのは「20秒ぶんを1秒ぶんに直す」操作そのもの。",
        },
        {
          id: "p-v-2",
          difficulty: 2,
          question: "時速72km ($72\\,\\mathrm{km/h}$) は何 m/s?",
          choices: ["$7.2\\,\\mathrm{m/s}$", "$12\\,\\mathrm{m/s}$", "$20\\,\\mathrm{m/s}$", "$36\\,\\mathrm{m/s}$"],
          answerIndex: 2,
          hint: "72km = 72000m、1時間 = 3600秒。単位の意味どおりに割り算。",
          explanation:
            "$\\mathrm{km/h}$ も「1時間あたりに進むkm」という分数。だから中身をそのまま入れ替えればいい: $\\frac{72000\\,\\mathrm{m}}{3600\\,\\mathrm{s}} = 20\\,\\mathrm{m/s}$。「km/h ÷ 3.6 = m/s」と丸暗記しなくても、単位の意味から毎回作れる。",
        },
        {
          id: "p-v-3",
          difficulty: 1,
          question: "$15\\,\\mathrm{m/s}$ で走る車は、8秒間で何m進む?",
          choices: ["$23\\,\\mathrm{m}$", "$60\\,\\mathrm{m}$", "$120\\,\\mathrm{m}$", "$150\\,\\mathrm{m}$"],
          answerIndex: 2,
          hint: "1秒あたり15m進む。それが8回ぶん。",
          explanation:
            "$x = vt = 15 \\times 8 = 120\\,\\mathrm{m}$。公式というより「1秒で15m、なら8秒でその8倍」という当たり前の話を式にしただけ。",
        },
        {
          id: "p-v-4",
          difficulty: 2,
          question: "x-tグラフ(横軸: 時間、縦軸: 位置)で、直線の傾きが表すものは?",
          choices: ["加速度", "移動距離", "速度", "経過時間"],
          answerIndex: 2,
          hint: "傾き = 縦の変化 ÷ 横の変化。縦は位置、横は時間。",
          explanation:
            "傾きの定義は $\\frac{\\text{縦の変化}}{\\text{横の変化}} = \\frac{\\Delta x}{\\Delta t}$。これは「位置の変化 ÷ 時間」つまり速度の定義そのもの。グラフの傾きが物理量になる、という見方はこの先何度も出てくる。",
        },
        {
          id: "p-v-5",
          difficulty: 2,
          question:
            "稲光が見えてから3秒後に雷鳴が聞こえた。音速を $340\\,\\mathrm{m/s}$ とすると、雷までの距離はおよそ?",
          choices: ["約$110\\,\\mathrm{m}$", "約$340\\,\\mathrm{m}$", "約$1000\\,\\mathrm{m}$", "約$3400\\,\\mathrm{m}$"],
          answerIndex: 2,
          hint: "音が3秒かけて進んだ距離を求める。光は一瞬で届くとしてよい。",
          explanation:
            "光はほぼ一瞬で届くので、3秒は音が旅した時間。$x = vt = 340 \\times 3 = 1020 \\approx 1000\\,\\mathrm{m}$。「稲光から音まで3秒なら雷は約1km先」— 物理は日常の距離感にも使える。",
        },
        {
          id: "p-v-6",
          difficulty: 3,
          question:
            "行きは $60\\,\\mathrm{km/h}$、帰りは同じ道を $40\\,\\mathrm{km/h}$ で往復した。全体の平均の速さは?",
          choices: ["$48\\,\\mathrm{km/h}$", "$50\\,\\mathrm{km/h}$", "$52\\,\\mathrm{km/h}$", "$100\\,\\mathrm{km/h}$"],
          answerIndex: 0,
          hint: "平均の速さ = 総距離 ÷ 総時間。「足して2で割る」は使えない。道のりを120kmと置いて総時間を計算してみる。",
          explanation:
            "平均の速さの定義は常に $\\frac{\\text{総距離}}{\\text{総時間}}$。片道120kmとすると、行き $\\frac{120}{60}=2$ 時間、帰り $\\frac{120}{40}=3$ 時間。合計240kmを5時間だから $\\frac{240}{5} = 48\\,\\mathrm{km/h}$。50にならないのは、**遅い区間ほど長い時間を過ごす**から。定義に戻れば引っかからない。",
        },
      ],
    },
    // ================= STAGE 2 =================
    {
      id: "m1-acceleration",
      title: "加速度",
      subtitle: "「速度の変わり方」を数にする",

// …以下 924 行省略。全文はリポジトリを見ること。
```

