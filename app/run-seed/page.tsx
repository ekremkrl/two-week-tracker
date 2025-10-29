"use client";
import { useState } from 'react';

export default function RunSeedPage() {
  const [status, setStatus] = useState<string>('');

  async function run() {
    setStatus('Seeding...');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      setStatus(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setStatus('Error: ' + e.message);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-3">Manual Seeding</h1>
      <p className="opacity-70 mb-4">Call /api/seed to insert demo data into Supabase.</p>
      <button className="btn btn-primary" onClick={run}>Run Seed</button>
      <pre className="mt-4 p-3 card overflow-auto text-xs whitespace-pre-wrap">{status}</pre>
    </div>
  );
}

