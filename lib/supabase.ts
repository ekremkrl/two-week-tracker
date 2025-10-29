import { createClient } from '@supabase/supabase-js';
import type { Period } from '@/lib/periods';

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anon };
}

export function getSupabaseClient() {
  const { url, anon } = getSupabaseEnv();
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

// Table: twgt_periods
// Columns: id text pk, year int, index int, goals jsonb, updated_at timestamptz
export async function fetchPeriodsFromSupabase(year: number): Promise<Period[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client
    .from('twgt_periods')
    .select('*')
    .eq('year', year)
    .order('index', { ascending: true });
  if (error) return null;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    year: row.year,
    index: row.index,
    goals: (row.goals ?? []) as Period['goals'],
    updatedAt: row.updated_at ?? new Date().toISOString(),
  }));
}

export async function upsertPeriodsToSupabase(periods: Period[]): Promise<{ ok: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { ok: false, error: 'No Supabase' };
  const payload = periods.map((p) => ({
    id: p.id,
    year: p.year,
    index: p.index,
    goals: p.goals,
    updated_at: p.updatedAt ?? new Date().toISOString(),
  }));
  const { error } = await client.from('twgt_periods').upsert(payload, { onConflict: 'id' });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}




