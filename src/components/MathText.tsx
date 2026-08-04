import { useMemo } from "react";
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

function renderSegment(text: string, keyBase: number): JSX.Element[] {
  // **bold** を処理
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyBase}-${i}`}>{part}</strong>
    ) : (
      <span key={`${keyBase}-${i}`}>{part}</span>
    )
  );
}

export function MathText({ text, className }: { text: string; className?: string }) {
  const nodes = useMemo(() => {
    const out: JSX.Element[] = [];
    // $...$ で分割 (エスケープなしの単純規則)
    const parts = text.split(/\$(.+?)\$/g);
    parts.forEach((part, i) => {
      if (i % 2 === 1) {
        out.push(
          <span
            key={`m-${i}`}
            className="math-inline"
            dangerouslySetInnerHTML={{ __html: renderMath(part, false) }}
          />
        );
      } else if (part) {
        out.push(...renderSegment(part, i));
      }
    });
    return out;
  }, [text]);

  return <span className={className}>{nodes}</span>;
}

export function MathBlock({ tex }: { tex: string }) {
  const html = useMemo(() => renderMath(tex, true), [tex]);
  return <div className="math-block" dangerouslySetInnerHTML={{ __html: html }} />;
}
