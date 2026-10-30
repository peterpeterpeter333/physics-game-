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
