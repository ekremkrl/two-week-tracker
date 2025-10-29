"use client";
import { useState } from 'react';
import type { Goal, Period } from '@/lib/periods';
import { cryptoRandomId } from '@/lib/periods';

type Props = {
  period: Period;
  onChange: (updated: Period) => void;
};

export default function PeriodCard({ period, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  function updateGoal(goalId: string, patch: Partial<Goal>) {
    const goals = period.goals.map((g) => (g.id === goalId ? { ...g, ...patch } : g));
    onChange({ ...period, goals, updatedAt: new Date().toISOString() });
  }

  function addGoal() {
    const title = prompt('Goal title');
    if (!title) return;
    const goals: Goal[] = [
      ...period.goals,
      { id: cryptoRandomId(), title, progress: 0 },
    ];
    onChange({ ...period, goals, updatedAt: new Date().toISOString() });
  }

  function removeGoal(goalId: string) {
    const goals = period.goals.filter((g) => g.id !== goalId);
    onChange({ ...period, goals, updatedAt: new Date().toISOString() });
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs opacity-70">Period {period.index} — {period.year}</div>
          <div className="font-semibold">Goals ({period.goals.length})</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Hide' : 'Edit'}
          </button>
          <button className="btn btn-primary" onClick={addGoal}>Add</button>
        </div>
      </div>
      <div className="mt-3 grid gap-3">
        {period.goals.map((g) => (
          <div key={g.id} className="rounded-xl p-3 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <input
                className="input"
                value={g.title}
                onChange={(e) => updateGoal(g.id, { title: e.target.value })}
              />
              <button className="btn btn-secondary" onClick={() => removeGoal(g.id)}>Remove</button>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <input
                className="slider flex-1"
                type="range" min={0} max={100} step={1}
                value={g.progress}
                onChange={(e) => updateGoal(g.id, { progress: Number(e.target.value) })}
              />
              <span className="w-12 text-right tabular-nums">{g.progress}%</span>
            </div>
            {expanded && (
              <textarea
                placeholder="Notes"
                className="input mt-2 min-h-[80px]"
                value={g.notes ?? ''}
                onChange={(e) => updateGoal(g.id, { notes: e.target.value })}
              />
            )}
          </div>
        ))}
        {period.goals.length === 0 && (
          <div className="text-sm opacity-60">No goals yet. Click Add to create one.</div>
        )}
      </div>
    </div>
  );
}




