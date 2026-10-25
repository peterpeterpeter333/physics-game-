const CONSENT_KEY = 'physics-quest:youtube-consent:v1';
const GRANTED = 'granted';
const listeners = new Set<() => void>();
let current: boolean | undefined;

function storage(): Storage | undefined {
  try { return typeof window === 'undefined' ? undefined : window.localStorage; }
  catch { return undefined; }
}

/** A read never grants permission or writes storage. Unknown values fail closed. */
export function hasYouTubeConsent(): boolean {
  if (current === undefined) {
    try { current = storage()?.getItem(CONSENT_KEY) === GRANTED; }
    catch { current = false; }
  }
  return current;
}

function update(allowed: boolean) {
  const changed = current !== allowed;
  current = allowed;
  if (changed) for (const listener of [...listeners]) listener();
}

/** Call with true only after the user explicitly accepts the communication notice. */
export function setYouTubeConsent(allowed: boolean): void {
  const next = allowed === true;
  try {
    const saved = storage();
    if (next) saved?.setItem(CONSENT_KEY, GRANTED);
    else saved?.removeItem(CONSENT_KEY);
  } catch { /* This explicit choice still applies in memory for this app session. */ }
  update(next);
}

export function subscribeYouTubeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

// Keep the snapshot current even while no player is mounted. Subscribe/unsubscribe
// cycles (including StrictMode) therefore do not accumulate window listeners.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key !== CONSENT_KEY && event.key !== null) return;
    const saved = storage();
    if (event.storageArea && saved && event.storageArea !== saved) return;
    update(event.key !== null && event.newValue === GRANTED);
  });
}
