"use client";
import { useEffect, useState } from 'react';
import type { Settings } from '@/lib/storage';
import { loadSettings, saveSettings } from '@/lib/storage';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Settings({ open, onClose }: Props) {
  const [settings, setSettings] = useState<Settings>({ theme: 'auto', accent: 'emerald' });

  useEffect(() => {
    if (!open) return;
    setSettings(loadSettings());
  }, [open]);

  useEffect(() => {
    applyTheme(settings.theme);
    applyAccent(settings.accent);
  }, [settings]);

  function applyTheme(theme: Settings['theme']) {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.remove('dark');
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }

  function applyAccent(accent: Settings['accent']) {
    const root = document.documentElement;
    root.classList.remove('accent-emerald', 'accent-teal', 'accent-indigo');
    root.classList.add(`accent-${accent}`);
  }

  function onSave() {
    saveSettings(settings);
    onClose();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/40">
      <div className="card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
        <div className="grid gap-6">
          <div>
            <label className="block text-sm mb-2">Theme</label>
            <div className="flex gap-3">
              {(['auto','light','dark'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSettings((s) => ({ ...s, theme: t }))}
                  className={`btn ${settings.theme === t ? 'btn-primary' : 'btn-secondary'}`}
                >{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Accent Color</label>
            <div className="flex gap-3">
              {(['emerald','teal','indigo'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setSettings((s) => ({ ...s, accent: a }))}
                  className={`btn ${settings.accent === a ? 'btn-primary' : 'btn-secondary'}`}
                >{a}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={onSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}




