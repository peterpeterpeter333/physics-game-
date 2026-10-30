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
