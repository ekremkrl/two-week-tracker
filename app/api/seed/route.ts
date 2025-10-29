import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { createDemoPeriods } from '@/lib/periods';

export async function POST() {
  const client = getSupabaseClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 400 });
  }
  try {
    const year = new Date().getFullYear();
    const { data: existing, error: selErr } = await client
      .from('twgt_periods')
      .select('id')
      .eq('year', year)
      .limit(1);
    if (selErr) throw selErr;
    if (existing && existing.length > 0) {
      return NextResponse.json({ ok: true, message: 'Already seeded for this year' });
    }
    const demo = createDemoPeriods(year).map((p) => ({
      id: p.id,
      year: p.year,
      index: p.index,
      goals: p.goals,
      updated_at: p.updatedAt,
    }));
    const { error: upErr } = await client.from('twgt_periods').upsert(demo, { onConflict: 'id' });
    if (upErr) throw upErr;
    return NextResponse.json({ ok: true, inserted: demo.length });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

