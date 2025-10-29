import './globals.css';
import type { Metadata } from 'next';
import { ReactNode, useEffect } from 'react';

export const metadata: Metadata = {
  title: 'Two Week Goal Tracker',
  description: 'Track goals in two-week periods, with local + Supabase sync.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh transition-colors">
        {children}
      </body>
    </html>
  );
}

