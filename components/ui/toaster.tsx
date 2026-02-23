"use client";

import { useToast } from "../../hooks/use-toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:top-6 sm:right-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-lg border px-4 py-3 shadow-lg transition-all ${
            t.variant === "destructive"
              ? "border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/70 dark:text-red-100"
              : "border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          } ${t.open ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              {t.title ? <p className="text-sm font-semibold">{t.title}</p> : null}
              {t.description ? <p className="text-sm opacity-90">{t.description}</p> : null}
            </div>
            <button
              type="button"
              aria-label="Close"
              className="rounded px-2 py-1 text-xs opacity-70 hover:opacity-100"
              onClick={() => dismiss(t.id)}
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
