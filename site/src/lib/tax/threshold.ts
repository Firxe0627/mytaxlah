import { quickTax } from './compare';
import type { YearRules } from './types';

/** Lowest monthly salary (in RM50 steps) at which a single salaried person starts paying tax. */
export function zeroTaxThreshold(rules: YearRules): number {
  for (let m = 1_000; m <= 20_000; m += 50) {
    if (quickTax(rules, { monthly: m, bonusMonths: 0, otherReliefs: 0 }).tax > 0) return m;
  }
  return 20_000;
}
