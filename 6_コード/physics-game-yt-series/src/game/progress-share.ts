import type { Chapter } from '../types';
import type { Progress } from './state';
import { discoveryCounts } from './study-dex';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/** Rendered locally; no account name or learning history is sent to a server. */
export async function makeProgressImage(chapters: Chapter[], progress: Progress): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('画像を作成できませんでした。');
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#091b37');
  gradient.addColorStop(1, '#25174a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = '#62dbf1';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText('PHYSICS QUEST', 78, 84);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillText('私の学習のあゆみ', 78, 164);
  const counts = discoveryCounts(chapters, progress);
  const cards = [
    { x: 78, value: String(counts.studied), label: `学習済み / ${counts.total} 単元` },
    { x: 434, value: String(counts.mastered), label: `理解を確認 / ${counts.total} 単元` },
    { x: 790, value: String(progress.xp), label: '学習 XP' },
  ];
  cards.forEach(card => {
    ctx.fillStyle = 'rgba(255,255,255,.09)';
    ctx.fillRect(card.x, 224, 332, 194);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 78px system-ui, sans-serif';
    ctx.fillText(card.value, card.x + 30, 324);
    ctx.fillStyle = '#b9c5db';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText(card.label, card.x + 30, 378);
  });
  ctx.fillStyle = '#a6f1d3';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText('今日も一歩、理解を深めた。', 78, 504);
  ctx.fillStyle = '#b9c5db';
  ctx.font = '19px system-ui, sans-serif';
  ctx.fillText('数字はこの端末の学習記録から作成', 78, 554);
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('画像を保存できませんでした。')), 'image/png'));
}

export async function shareProgressImage(chapters: Chapter[], progress: Progress): Promise<'shared' | 'saved' | 'cancelled'> {
  const blob = await makeProgressImage(chapters, progress);
  const file = new File([blob], 'physics-quest-progress.png', { type: 'image/png' });
  if (Capacitor.isNativePlatform()) {
    try {
      if (!(await Share.canShare()).value) throw new Error('Native sharing unavailable');
      const base64 = await blobBase64(blob);
      const { uri } = await Filesystem.writeFile({ path: file.name, data: base64, directory: Directory.Cache });
      await Share.share({ files: [uri], title: 'Physics Quest の学習進捗' });
      return 'shared';
    } catch (error) {
      if (/cancel/i.test(String(error))) return 'cancelled';
      // The web pathway remains usable if a native plugin is not registered yet.
    }
  }
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Physics Quest の学習進捗' });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
      // Native sharing may be unavailable on some devices. Save the image instead.
    }
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = file.name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  return 'saved';
}

function blobBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('画像を読み込めませんでした。'));
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.readAsDataURL(blob);
  });
}
