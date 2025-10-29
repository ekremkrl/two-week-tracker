"use client";
import { useEffect, useMemo, useState } from 'react';
import PeriodCard from '@/components/PeriodCard';
import Settings from '@/components/Settings';
import { ToastProvider, useToast } from '@/components/Toast';
import { generatePeriodsForYear, createDemoPeriods, type Period } from '@/lib/periods';
import { loadData, saveData, loadSettings } from '@/lib/storage';
import { fetchPeriodsFromSupabase, upsertPeriodsToSupabase, getSupabaseEnv } from '@/lib/supabase';

function HomeInner() {
  const now = new Date();
  const thisYear = now.getFullYear();
  const [year, setYear] = useState<number>(thisYear);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    const s = loadSettings();
    document.documentElement.classList.add(`accent-${s.accent}`);
    if (s.theme === 'dark') document.documentElement.classList.add('dark');
    if (s.theme === 'light') document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    const store = loadData();
    let y = store.years[String(year)];
    if (!y) {
      y = generatePeriodsForYear(year);
      store.years[String(year)] = y;
      saveData(store);
    }
    setPeriods(y);
  }, [year]);

  function updatePeriod(updated: Period) {
    setPeriods((prev) => {
      const list = prev.map((p) => (p.id === updated.id ? updated : p));
      const store = loadData();
      store.years[String(year)] = list;
      saveData(store);
      return list;
    });
  }

  async function exportJson() {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'two-week-goal-tracker.json';
    a.click();
    URL.revokeObjectURL(url);
    show('success', 'Exported data as JSON');
  }

  async function importJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result));
          saveData(data);
          const y = (data?.years?.[String(year)] ?? generatePeriodsForYear(year)) as Period[];
          setPeriods(y);
          show('success', 'Imported JSON');
        } catch (e: any) {
          show('error', 'Invalid JSON');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function resetAll() {
    if (!confirm('Reset all data for this year?')) return;
    const store = loadData();
    store.years[String(year)] = generatePeriodsForYear(year);
    saveData(store);
    setPeriods(store.years[String(year)]);
    show('success', 'Reset done');
  }

  async function pullFromSupabase() {
    const env = getSupabaseEnv();
    if (!env.url || !env.anon) {
      show('error', 'Supabase env missing');
      return;
    }
    const rows = await fetchPeriodsFromSupabase(year);
    if (!rows) {
      show('error', 'Failed to fetch from Supabase');
      return;
    }
    const store = loadData();
    store.years[String(year)] = rows.length ? rows : generatePeriodsForYear(year);
    saveData(store);
    setPeriods(store.years[String(year)]);
    show('success', 'Pulled from Supabase');
  }

  async function pushToSupabase() {
    const env = getSupabaseEnv();
    if (!env.url || !env.anon) {
      show('error', 'Supabase env missing');
      return;
    }
    const res = await upsertPeriodsToSupabase(periods);
    if (!res.ok) {
      show('error', res.error ?? 'Failed to push to Supabase');
      return;
    }
    show('success', 'Pushed to Supabase');
  }

  function seedDemo() {
    const store = loadData();
    const demo = createDemoPeriods(year);
    store.years[String(year)] = demo;
    saveData(store);
    setPeriods(demo);
    show('success', 'Seeded demo goals');
  }

  const hasSupabase = useMemo(() => {
    const env = getSupabaseEnv();
    return Boolean(env.url && env.anon);
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Two Week Goal Tracker</h1>
          <p className="text-sm opacity-70">Track goals in 26 two-week periods per year</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="input w-28" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 11 }).map((_, i) => {
              const y = thisYear - 5 + i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
          <button className="btn btn-secondary" onClick={seedDemo}>Seed Demo</button>
          <button className="btn btn-secondary" onClick={resetAll}>Reset</button>
          <button className="btn btn-secondary" onClick={importJson}>Import</button>
          <button className="btn btn-secondary" onClick={exportJson}>Export</button>
          <button className="btn btn-secondary" onClick={() => setSettingsOpen(true)}>Settings</button>
          {hasSupabase && (
            <>
              <button className="btn btn-secondary" onClick={pullFromSupabase}>Pull</button>
              <button className="btn btn-primary" onClick={pushToSupabase}>Push</button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {periods.map((p) => (
          <PeriodCard key={p.id} period={p} onChange={updatePeriod} />
        ))}
      </div>

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <HomeInner />
    </ToastProvider>
  );
}

