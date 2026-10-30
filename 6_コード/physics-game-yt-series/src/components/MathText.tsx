import { useLayoutEffect, useMemo, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// "$...$" のインライン数式と "**...**" の強調を含むテキストを描画する。

function renderMath(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, { displayMode, throwOnError: false });
  } catch {
    return tex;
  }
}

function renderMathSegments(text: string, keyBase: string): JSX.Element[] {
  // $...$ のインライン数式を処理 (エスケープなしの単純規則)
  const parts = text.split(/\$(.+?)\$/g);
  const out: JSX.Element[] = [];
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      out.push(
        <span
          key={`${keyBase}-m${i}`}
          className="math-inline"
          dangerouslySetInnerHTML={{ __html: renderMath(part, false) }}
        />
      );
    } else if (part) {
      out.push(<span key={`${keyBase}-t${i}`}>{part}</span>);
    }
  });
  return out;
}

export function MathText({ text, className }: { text: string; className?: string }) {
  const nodes = useMemo(() => {
    // 先に **bold** で分割してから、各断片の中の $...$ を処理する。
    // (逆順だと「太字の中に数式」が分断されて ** が生のまま表示される)
    const parts = text.split(/\*\*(.+?)\*\*/g);
    const out: JSX.Element[] = [];
    parts.forEach((part, i) => {
      if (!part) return;
      if (i % 2 === 1) {
        out.push(<strong key={`b-${i}`}>{renderMathSegments(part, `b${i}`)}</strong>);
      } else {
        out.push(...renderMathSegments(part, `p${i}`));
      }
    });
    return out;
  }, [text]);

  return <span className={className}>{nodes}</span>;
}

const BLOCK_BASE_PX = 20;

export function MathBlock({ tex }: { tex: string }) {
  const html = useMemo(() => renderMath(tex, true), [tex]);
  const ref = useRef<HTMLDivElement>(null);

  // 長い式が右端で切れないように、幅に収まるまで文字サイズを縮める
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = `${BLOCK_BASE_PX}px`;
      const inner = el.querySelector<HTMLElement>(".katex-display > .katex");
      const need = inner ? inner.scrollWidth : el.scrollWidth;
      const have = el.clientWidth;
      if (need > have && have > 0) {
        const px = Math.max(12, Math.floor(BLOCK_BASE_PX * (have / need) * 0.96));
        el.style.fontSize = `${px}px`;
      }
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [html]);

  return <div ref={ref} className="math-block" dangerouslySetInnerHTML={{ __html: html }} />;
}
