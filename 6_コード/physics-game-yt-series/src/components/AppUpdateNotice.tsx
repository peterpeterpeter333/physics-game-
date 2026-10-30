import { useEffect, useState } from 'react';
import { App as NativeApp } from '@capacitor/app';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { availableStoreVersion, STORE_APP_ID, STORE_URL } from '../game/app-update';
import './app-update-notice.css';

/** Non-blocking, once per launch. Store lookup failures never interrupt lessons. */
export function AppUpdateNotice() {
  const [version, setVersion] = useState<string | null>(null);
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'ios') return;
    let cancelled = false;
    void (async () => {
      try {
        const installed = await NativeApp.getInfo();
        if (cancelled) return;
        const response = await CapacitorHttp.get({
          url: `https://itunes.apple.com/lookup?id=${STORE_APP_ID}&country=jp`,
          responseType: 'json', connectTimeout: 8000, readTimeout: 8000,
        });
        if (!cancelled && response.status === 200) setVersion(availableStoreVersion(response.data, installed.version));
      } catch { /* Offline, rate limits, and unavailable storefront: keep learning. */ }
    })();
    return () => { cancelled = true; };
  }, []);
  if (!version) return null;
  return <aside className="app-update-notice" role="status" aria-label="アプリの更新のお知らせ">
    <div><strong>新しいバージョンがあります</strong><p>バージョン {version} をApp Storeで更新できます。</p></div>
    <div className="app-update-actions">
      <a href={STORE_URL} target="_blank" rel="noopener noreferrer">App Storeで確認</a>
      <button type="button" onClick={() => setVersion(null)}>あとで</button>
    </div>
  </aside>;
}
