import { netTaxFromChargeable, round2 } from './compute';
import { eisEmployee, epfEmployee, socsoEmployee } from './salary';
import type { YearRules } from './types';

export interface QuickInput {
  monthly: number;
  bonusMonths: number;
  /** Any other reliefs the user claims (insurance, medical, lifestyle…), same amount both years. */
  otherReliefs: number;
}

export interface QuickYear {
  ya: number;
  income: number;
  relief: number;
  chargeable: number;
  tax: number;
  marginalRate: number;
}

/** Salaried person: self + EPF (11%, capped) + SOCSO/EIS (capped) + other reliefs. */
export function quickTax(rules: YearRules, input: QuickInput): QuickYear {
  const monthly = Math.max(0, input.monthly || 0);
  const bonusMonths = Math.max(0, input.bonusMonths || 0);
  const income = round2(monthly * (12 + bonusMonths));
  const limit = (id: string) => rules.reliefs.find((r) => r.id === id)?.limit ?? 0;
  const epfPaid = epfEmployee(monthly) * 12 + Math.ceil(monthly * bonusMonths * 0.11);
  const socsoPaid = (socsoEmployee(monthly) + eisEmployee(monthly)) * 12;
  const relief =
    limit('self') + Math.min(epfPaid, limit('epf')) + Math.min(socsoPaid, limit('socso')) + Math.max(0, input.otherReliefs || 0);
  const chargeable = Math.max(0, Math.floor(income - relief));
  const t = netTaxFromChargeable(rules, chargeable);
  return { ya: rules.ya, income, relief: round2(relief), chargeable, tax: t.netTax, marginalRate: chargeable > 0 ? t.marginalRate : 0 };
}

export function compareYears(before: YearRules, after: YearRules, input: QuickInput) {
  const a = quickTax(before, input);
  const b = quickTax(after, input);
  const saving = round2(a.tax - b.tax);
  return { before: a, after: b, saving, monthlySaving: round2(saving / 12) };
}
