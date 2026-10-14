const whole = new Intl.NumberFormat('en-MY', { maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** RM1,234 (whole) or RM1,234.50 (when `withCents` or the value has cents). */
export function rm(n: number, withCents = false): string {
  const v = Math.round(n * 100) / 100;
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(v);
  const body = withCents || abs % 1 !== 0 ? cents.format(abs) : whole.format(abs);
  return `${sign}RM${body}`;
}

export const pct = (fraction: number, digits = 1) => `${(fraction * 100).toFixed(digits)}%`;

export const num = (n: number) => whole.format(n);
