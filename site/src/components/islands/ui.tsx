import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export function parseMoney(raw: string): number {
  const n = Number(String(raw).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

interface MoneyInputProps {
  id: string;
  label: ComponentChildren;
  value: number;
  onChange: (v: number) => void;
  hint?: ComponentChildren;
  prefix?: string;
  suffix?: string;
  step?: number;
}

/** Text input that keeps what the user typed but reports a clean number. */
export function MoneyInput({ id, label, value, onChange, hint, prefix = 'RM', suffix, step }: MoneyInputProps) {
  const [text, setText] = useState(value ? String(value) : '');
  useEffect(() => {
    if (parseMoney(text) !== value) setText(value ? String(value) : '');
  }, [value]);
  return (
    <label for={id} class="block">
      <span class="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      <span class="flex items-stretch rounded-lg border border-slate-300 bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 overflow-hidden">
        {prefix && <span class="px-3 flex items-center bg-slate-50 text-slate-500 text-sm border-r border-slate-200">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          class="w-full px-3 py-2.5 text-base outline-none num"
          value={text}
          placeholder="0"
          step={step}
          onInput={(e) => {
            const v = (e.target as HTMLInputElement).value;
            setText(v);
            onChange(parseMoney(v));
          }}
        />
        {suffix && <span class="px-3 flex items-center text-slate-500 text-sm">{suffix}</span>}
      </span>
      {hint && <span class="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}

interface StepperProps {
  id: string;
  label: ComponentChildren;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: ComponentChildren;
}

export function Stepper({ id, label, value, onChange, min = 0, max = 20, step = 1, hint }: StepperProps) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, Math.round(v * 10) / 10)));
  return (
    <div>
      <label for={id} class="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div class="flex items-center gap-2">
        <button type="button" class="w-10 h-10 rounded-lg border border-slate-300 bg-white text-lg hover:bg-slate-50" onClick={() => set(value - step)} aria-label="-">
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          class="w-16 h-10 text-center rounded-lg border border-slate-300 num"
          value={value}
          min={min}
          max={max}
          step={step}
          onInput={(e) => set(Number((e.target as HTMLInputElement).value) || 0)}
        />
        <button type="button" class="w-10 h-10 rounded-lg border border-slate-300 bg-white text-lg hover:bg-slate-50" onClick={() => set(value + step)} aria-label="+">
          +
        </button>
      </div>
      {hint && <span class="block text-xs text-slate-500 mt-1">{hint}</span>}
    </div>
  );
}

export function Checkbox({ id, label, checked, onChange, hint }: { id: string; label: ComponentChildren; checked: boolean; onChange: (v: boolean) => void; hint?: ComponentChildren }) {
  return (
    <label for={id} class="flex items-start gap-3 cursor-pointer">
      <input id={id} type="checkbox" class="mt-1 w-4 h-4 accent-emerald-600" checked={checked} onChange={(e) => onChange((e.target as HTMLInputElement).checked)} />
      <span>
        <span class="block text-sm font-medium text-slate-800">{label}</span>
        {hint && <span class="block text-xs text-slate-500">{hint}</span>}
      </span>
    </label>
  );
}

export function Row({ label, value, strong, muted }: { label: ComponentChildren; value: ComponentChildren; strong?: boolean; muted?: boolean }) {
  return (
    <div class={`flex justify-between gap-4 py-1.5 ${strong ? 'font-semibold text-slate-900' : muted ? 'text-slate-500' : 'text-slate-700'}`}>
      <span>{label}</span>
      <span class="num text-right">{value}</span>
    </div>
  );
}

/** Persist simple state in localStorage; silently falls back to memory. */
export function usePersisted<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* storage unavailable */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, loaded]);
  return [state, setState];
}
