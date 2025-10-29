export type Goal = {
  id: string;
  title: string;
  progress: number; // 0..100
  notes?: string;
};

export type Period = {
  id: string; // `${year}-${index}` 1..26
  year: number;
  index: number; // 1..26
  goals: Goal[];
  updatedAt: string; // ISO
};

export function generatePeriodsForYear(year: number): Period[] {
  const periods: Period[] = [];
  for (let i = 1; i <= 26; i++) {
    periods.push({
      id: `${year}-${i}`,
      year,
      index: i,
      goals: [],
      updatedAt: new Date().toISOString(),
    });
  }
  return periods;
}

export function createDemoPeriods(year: number): Period[] {
  const demo = generatePeriodsForYear(year);
  if (demo[0]) {
    demo[0].goals = [
      { id: cryptoRandomId(), title: 'Exercise 3x/week', progress: 60, notes: 'Morning runs' },
      { id: cryptoRandomId(), title: 'Read 100 pages', progress: 30 },
    ];
  }
  if (demo[1]) {
    demo[1].goals = [
      { id: cryptoRandomId(), title: 'Ship side project MVP', progress: 20 },
    ];
  }
  return demo;
}

export function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

