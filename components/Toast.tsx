"use client";
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ToastItem = {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
};

type ToastContextType = {
  show: (type: ToastItem['type'], message: string, timeoutMs?: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('ToastProvider missing');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((type: ToastItem['type'], message: string, timeoutMs = 2800) => {
    const id = Math.random().toString(36).slice(2);
    const item: ToastItem = { id, type, message };
    setItems((prev) => [...prev, item]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, timeoutMs);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-[92vw] max-w-sm">
        {items.map((t) => (
          <div key={t.id} className="card px-4 py-3 text-sm flex items-center gap-3">
            <span className={
              t.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
              t.type === 'error' ? 'text-rose-600 dark:text-rose-400' :
              'text-sky-600 dark:text-sky-400'
            }>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '⚠' : 'ℹ'}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}




