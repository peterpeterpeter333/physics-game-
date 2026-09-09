# Physics Quest 引き継ぎドキュメント(完全版)

**最終更新: 2026年9月5日**

このファイルは、これまでの開発の経緯・現在の状況・残りの作業をすべてまとめた引き継ぎ資料です。
新しいAIアシスタント(Claude等)やコラボレーターにこのファイルを渡せば、続きから作業できます。

---

## 0. まずこれを読むAIへ:ユーザーの状況とサポート方針

- ユーザーは**プログラミング・Mac操作の初心者**。日本語話者。
- **コマンドは1行ずつ、コピペできる形で**提示すること。複数コマンドを `&&` で繋げない
  (以前Windowsで `&&` が使えず詰まった。現在はMacのzshだが、1行ずつの方針は継続)。
- 専門用語は必ず短い説明を添える。「メニューバー」「ターミナル」レベルから説明が必要な場合がある。
- エラーが出たらスクリーンショットや貼り付けで共有してもらい、それに基づいて次の一手を出す進め方が定着している。
- ユーザーの方針: 「ユーザー数が集まらないと成立しない企画」ではなく、
  **自分の努力だけで確実に積み上がる成果**を重視する。このアプリはその方針で設計されている
  (コンテンツアプリなので利用者が自分1人でも価値が100%成立する)。

---

## 1. プロジェクト概要

**Physics Quest** — 高校物理を RPG のように攻略しながら学ぶ学習アプリ。

- コンセプト: **「暗記は絶対ダメ。理解できる喜びを、ゲームの気持ちよさで。」**
- すべての公式に導出レッスンがある。丸暗記を求める説明は書かない(絶対ルール)。
- 問題はすべてオリジナル。過去問・市販問題集のコピーは著作権上禁止(参考にしたのは「高校数学の解法」というPlay Storeアプリの**形式**のみ)。
- ゲーム要素: 敵HPバトル、30秒制限、コンボ、ハート3つ、XP/レベル、ステージ順次解放。
- 対象: 高校生(物理基礎〜大学受験の基礎レベル)。

### 収録コンテンツ(現在)

| 項目 | 数 |
|---|---|
| 分野(章) | 5(力学・熱力学・波動・電磁気・原子) |
| ステージ | 27 |
| 演習問題 | 142問(4択、難易度1〜3、全問ヒント+解説付き) |
| 公式 | 48本(全て導出レッスンにリンク) |
| アニメーション図解 | 24種(SVG+requestAnimationFrame、一部スライダー操作可) |

---

## 2. リポジトリとURL

| 何 | URL / 場所 |
|---|---|
| メインリポジトリ(公開) | https://github.com/peterpeterpeter333/physics-game- |
| 開発ブランチ | `main` に直接push |
| Web公開URL(GitHub Pages) | https://peterpeterpeter333.github.io/physics-game-/ |
| プライバシーポリシー | https://peterpeterpeter333.github.io/physics-game-/privacy.html |
| App Store提出ガイド | リポジトリ内 `docs/APP-STORE-GUIDE.md`(**提出に必要な文言は全部ここにコピペ用で用意済み**) |
| 関連リポジトリ | `peterpeterpeter333/memo-app` の `docs/` に不登校Q&AサイトのロードマップとこのアプリのPLANがある(別プロジェクト) |

> **注意**: リポジトリ名は `physics-game-`(末尾にハイフン)。リネームするとPages URLとプライバシーポリシーURLが変わるので**リネーム禁止**。公開設定は本人の意思で public のまま。

---

## 3. 技術構成

- **Vite + React 18 + TypeScript** のSPA。サーバーなし・アカウントなし。進捗は localStorage のみ。
- **KaTeX** で数式表示(フォント同梱・オフライン動作)。
- **PWA**: `public/manifest.webmanifest` + 手書きの `public/sw.js`(network-first)。
- **Capacitor 8** でネイティブ化。`android/` はコミット済み。`ios/` は**ユーザーのMac上でのみ生成済み**(リポジトリ未コミット。`npx cap add ios` でいつでも再生成可)。
- **AIチャット(AI先生)**: Anthropic SDK直叩き(ユーザー自身のAPIキーをlocalStorageに保存)。
  `src/config.ts` の `SHOW_AI_CHAT = !Capacitor.isNativePlatform()` により**ネイティブ版では非表示**
  (審査員が検証できない機能はApp Storeガイドライン2.1に抵触する恐れがあるため)。
- **計測**: `src/analytics.ts`。Umami/GoatCounter対応のカスタムイベント(ステージID付き)。
  **現在は `PROVIDER: "none"`, `SITE_ID: ""` で完全無効**。

### 主要ファイル

```
src/
  App.tsx                 画面遷移(map/lesson/battle/formulas/review/settings)
  config.ts               機能フラグ (SHOW_AI_CHAT)
  analytics.ts            計測(現在オフ。有効化方法は下記§6)
  native.ts               Capacitor: ハプティクス/StatusBar(Webではno-op)
  types.ts                Chapter/Stage/Lesson/Problem/Formula 型定義
  content/                ★教材データ本体(mechanics/thermo/waves/electromagnetism/atomic/formulas)
  components/             QuestMap/LessonView/BattleView/FormulaBook/ReviewView/SettingsView/AIChat/MathText
  components/figures/     図解エンジン(anim.ts=rAFフック、24図をREGISTRYに登録、URL末尾#figsで一覧)
  ai/tutor.ts             Claude API呼び出し(claude-opus-5、ストリーミング、日本語家庭教師プロンプト)
  game/state.ts           localStorage進捗管理
capacitor.config.ts       appId: app.physicsquest.game / appName: Physics Quest / webDir: dist
.github/workflows/deploy.yml  mainへのpushで自動ビルド→gh-pagesブランチへ(peaceiris/actions-gh-pages@v4)
docs/APP-STORE-GUIDE.md   App Store提出の全手順+コピペ用文言(説明文/キーワード/プライバシー回答/審査コメント)
public/privacy.html       プライバシーポリシー(日本語、個人情報ゼロ設計)
```

### コマンド(ユーザーのMac: ~/physics-game-)

```
npm run dev          開発サーバー
npm run build        ビルド(tsc -b && vite build)
npm run sync         ビルド + ネイティブへ反映(cap sync)
npm run open:ios     Xcodeで開く
npm run open:android Android Studioで開く
```

更新の反映手順: コードを直したら `git add -A` → `git commit -m "..."` → `git push` でWeb版は自動デプロイ。
iOSは加えてMacで `git pull` → `npm install`(依存が変わった時)→ `npm run sync` → Xcodeでビルド。

---

## 4. これまでの経緯(時系列)

1. LINE風BLEチャット・不登校Q&Aサイトを作ったが「大規模化はムリ」と感じ、確実に積み上がる方針へ転換。
2. Play Storeアプリ「高校数学の解法」に感銘 → **高校物理版を自作**する企画が始動。
3. ゲーミフィケーション仕様(パズドラ風RPG・制限時間・導出重視・AIチャット)でWeb版を構築。
4. 5分野へ網羅性拡大 → 図解エンジン24種追加・文字削減 → 27ステージ142問48公式に。
5. GitHub Pagesで公開(workflow はgh-pagesブランチ方式。Pages本体の有効化はSettings→Pagesでの手動保存が必要)。
6. Umami Cloud(US region)にサインアップ済み、**Website ID取得済み(ただしまだコードに未設定)**。
7. App Store / Google Play 両対応のためCapacitor導入。Android側は準備完了(未提出)。
8. **ユーザーがMacを購入** → iOS提出作業を開始(§5参照)。

---

## 5. ★現在地: iOS(App Store)提出作業の途中★

### 完了済み(ユーザーのMac上)

- [x] Command Line Tools インストール(git 2.50.1)
- [x] Node.js v24.19.0 インストール
- [x] `git clone` → `npm install` → `npx cap add ios` → `npm run sync` すべて成功
- [x] アイコン/スプラッシュ生成(`npx @capacitor/assets generate --ios ...`)成功
- [x] Xcode 26.6 インストール、ライセンス同意済み
- [x] `npm run open:ios` でプロジェクトが開ける(App.xcworkspace)
- [x] General タブで Bundle Identifier = `app.physicsquest.game` を確認

### 進行中 / 未完了

- [ ] **iOS 26.5 シミュレータランタイムのダウンロード**(Xcode上部の「Get」ボタン。数GB)
- [ ] General タブ: Display Name に `Physics Quest`、App Category に `Education` を設定
- [ ] Signing & Capabilities: Team選択(下記の問題が解決するまで暫定で「Personal Team」)
- [ ] シミュレータで起動確認
- [ ] スクリーンショット撮影(6.7インチ、⌘S。撮る画面リストは APP-STORE-GUIDE.md §4)
- [ ] Archive → App Store Connect へアップロード
- [ ] App Store Connect でアプリ情報入力(**文言はすべて APP-STORE-GUIDE.md にコピペ用で用意済み**)
- [ ] 審査提出

### ⚠️ 最重要の未解決問題: Apple Developer Program が「保留中」

- **2026年9月2日**にWebのApple Store経由で購入済み:
  **Apple Developer Program 1年メンバーシップ 12,980円 / 注文ステータス「登録完了」**
  (注文番号は本人の注文確認メールに記載。問い合わせ時に手元に用意する)
- 使用したApple ID: **開発者登録用のID(outlook.jpのアドレス。本人が把握している)**
  ※Macの普段用ID(icloud.com)は**開発者登録に使っていない**。2つのIDを混同しないこと
- しかし developer.apple.com のアカウントは「**(保留中)**」のまま。
  「メンバーシップを購入してください / 購入手続きには最長48時間かかります」と表示され続けている。
- 購入から**48時間を大幅超過**しており、Apple内部の紐付け処理が止まっている可能性が高い。
- **次のアクション: Appleサポートへ問い合わせ**
  - https://developer.apple.com/jp/contact/ (「Apple Developer Programの登録」→ 電話 or メール、日本語可)
  - または Apple Online Store カスタマーサービス **0120-993-993**(平日9-20時/土日祝9-18時)
  - 伝える内容: 「9/2に注文番号◯◯でDeveloper Programを購入し注文は完了になっているが、アカウントが保留中のままメンバーシップが有効化されない」
- **絶対にやってはいけないこと: 「今すぐ登録」「購入手続きを完了」からもう一度支払いに進む(二重払いの危険)**
- 解決したら: Xcode → Settings → Apple Accounts の**開発者登録用ID**のアカウントに「(登録名) (Individual)」のようなチームが出現する。
  Signing & Capabilities の Team をそれに切り替えれば Archive → 提出が可能になる。
- App Store Connect (https://appstoreconnect.apple.com/) へのログインも**開発者登録用ID(outlook.jp)**を使う。

### シミュレータ確認・スクショ撮影は保留中でも可能

Personal Team のままでもシミュレータ起動とスクリーンショット撮影はできるので、サポート回答待ちの間に進めてよい。

---

## 6. その他の未完了タスク

1. **GitHub Pages の有効化確認**(Web版が実際に見られる状態か)
   - リポジトリの Settings → Pages → 「Deploy from a branch」→ Branch: `gh-pages` / `(root)` → Save
   - ユーザーは一度「保存した」と言っているが、その後の確認では Pages のビルド実行記録が見当たらなかった。
   - 確認方法: ブラウザで https://peterpeterpeter333.github.io/physics-game-/ を開いてアプリが表示されるか。
     表示されなければ上記設定をやり直す。**プライバシーポリシーURLが審査で必要なので、提出前に必ず生きていること。**
2. **Umami計測の有効化**
   - ユーザーはUmami Cloud(https://cloud.umami.is 、USリージョン)のアカウントとWebsite IDを持っている。
   - `src/analytics.ts` の `PROVIDER` を `"umami"` に、`SITE_ID` にそのWebsite IDを入れて commit & push すれば有効化。
   - 見る場所: cloud.umami.is にログイン → ダッシュボード(リアルタイム訪問者・ステージ別イベント)。
3. **Google Play 提出**(準備は完了、着手はまだ)
   - `android/` コミット済み。$25買い切り登録 + **新規個人アカウントは12人×14日間のクローズドテスト義務**あり。
   - AAB作成・keystore厳重保管などは APP-STORE-GUIDE.md の姉妹情報として README に記載。
4. **将来の拡張(ユーザーが明言済みの構想)**
   - 入試レベル問題の追加(現在は基礎のみ。「試験本番レベルはまだ良い」)
   - AIチャットを公開キーなしで使えるようにするサーバープロキシ(その際Vercel移行も検討)
   - 対人戦(PvP)モード — ユーザーが集まった場合のみ
   - 不登校Q&Aサイト(memo-appのdocs/QA-SITE-ROADMAP.md)の再開

---

## 7. 設計上の絶対ルール(変更しないこと)

1. **導出のない公式を追加しない**。「覚えましょう」という説明文を書かない。
2. 問題は**必ずオリジナル**で作る。過去問・市販問題集の転載禁止。
3. `appId: app.physicsquest.game` は**公開後は変更不可**。
4. 個人情報を集めない設計を守る(アカウント不要・localStorage・匿名計測のみ)。プライバシーポリシーと矛盾する機能を入れない。
5. ネイティブ版でBYOキーのAIチャットを出さない(審査リスク)。出すならサーバープロキシを作ってから。
6. リポジトリ名の変更・privateへの変更をしない(Pages URLが死ぬ)。

---

## 8. 新しいアシスタントへの最初の一手の提案

1. ユーザーに「Appleサポートへの問い合わせは済んだか / メンバーシップは有効になったか」を確認
2. 並行して Xcode の iOS ランタイムDL → シミュレータ起動 → スクショ撮影を進める
3. Pages の生存確認と Umami ID の設定(§6の1と2)は早めに片付ける
4. メンバーシップ有効化後: Team切替 → Archive → App Store Connect 入力(APP-STORE-GUIDE.mdを開きながら)→ 審査提出
