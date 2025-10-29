import type { Period } from '@/lib/periods';

const STORAGE_KEY = 'twgt:data:v1';
const SETTINGS_KEY = 'twgt:settings:v1';

export type Settings = {
  theme: 'light' | 'dark' | 'auto';
  accent: 'emerald' | 'teal' | 'indigo';
};

export type StoredData = {
  years: Record<string, Period[]>; // key = year string
};

export function loadData(): StoredData {
  if (typeof window === 'undefined') return { years: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { years: {} };
    const parsed = JSON.parse(raw) as StoredData;
    return parsed?.years ? parsed : { years: {} };
  } catch {
    return { years: {} };
  }
}

export function saveData(data: StoredData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return { theme: 'auto', accent: 'emerald' };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { theme: 'auto', accent: 'emerald' };
    const parsed = JSON.parse(raw) as Settings;
    return parsed ?? { theme: 'auto', accent: 'emerald' };
  } catch {
    return { theme: 'auto', accent: 'emerald' };
  }
}

export function saveSettings(settings: Settings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}



