const STORAGE_NAMESPACE = process.env.REACT_APP_STORAGE_NAMESPACE || 'netflix-lite';
export const STORAGE_VERSION_KEY = `${STORAGE_NAMESPACE}:version`;

export const STORAGE_KEYS = {
  genres: `${STORAGE_NAMESPACE}:genres`,
  searchHistory: `${STORAGE_NAMESPACE}:search-history`,
  watchHistory: `${STORAGE_NAMESPACE}:watch-history`,
  preferences: `${STORAGE_NAMESPACE}:preferences`,
};

const CURRENT_VERSION = '1';

export function ensureStorageVersion() {
  if (typeof localStorage === 'undefined') return;
  try {
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    if (version === CURRENT_VERSION) return;
    // 버전이 없거나 다르면 일부 캐시/기록만 초기화
    localStorage.removeItem(STORAGE_KEYS.genres);
    localStorage.removeItem(STORAGE_KEYS.searchHistory);
    localStorage.removeItem(STORAGE_KEYS.watchHistory);
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
  } catch {
    // ignore
  }
}

export function persistJSON(key: string, value: unknown) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
