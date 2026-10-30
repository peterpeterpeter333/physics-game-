import { useState } from 'react';
import type { Chapter } from '../types';
import type { Progress } from '../game/state';
import { shareProgressImage } from '../game/progress-share';

export function ProgressShareButton({ chapters, progress }: { chapters: Chapter[]; progress: Progress }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  return <div className="progress-share">
    <button className="btn btn-ghost" disabled={busy} onClick={async () => {
      setBusy(true);
      setMessage('');
      try {
        const result = await shareProgressImage(chapters, progress);
        if (result === 'saved') setMessage('進捗画像を保存しました。共有先を選んで投稿できます。');
      } catch { setMessage('画像を作れませんでした。もう一度お試しください。'); }
      finally { setBusy(false); }
    }}>↗ 学習の進捗を画像で共有</button>
    {message && <p className="screen-note small" role="status">{message}</p>}
  </div>;
}
