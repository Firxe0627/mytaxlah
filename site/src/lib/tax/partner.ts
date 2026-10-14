import { compareYears } from './compare';
import { computeTax, netTaxFromChargeable, round2 } from './compute';
import { eisEmployee, epfEmployee, socsoEmployee } from './salary';
import type { Claims, YearRules } from './types';

export interface PartnerInput {
  monthly: number;
  bonusMonths: number;
  /** Already paid this year, per focus relief id. */
  paid: Record<string, number>;
}

export interface PartnerRow {
  id: string;
  limit: number;
  used: number;
  remaining: number;
  saving: number;
}

export interface PartnerPlan {
  income: number;
  tax: number;
  marginalRate: number;
  rows: PartnerRow[];
  /** Tax saved if every focus relief is filled together. */
  totalSaving: number;
  /** Extra yearly saving from Budget 2027 (YA2027 vs YA2026) with the same claims. */
  budget2027Saving: number;
}

/** Plan for a salaried person around the reliefs a partner (insurance / PRS agent) focuses on. */
export function partnerPlan(current: YearRules, next: YearRules, input: PartnerInput, focus: string[]): PartnerPlan {
  const monthly = Math.max(0, input.monthly || 0);
  const bonusMonths = Math.max(0, input.bonusMonths || 0);
  const income = monthly * (12 + bonusMonths);
  const claims: Claims = {
    epf: epfEmployee(monthly) * 12 + Math.ceil(monthly * bonusMonths * 0.11),
    socso: (socsoEmployee(monthly) + eisEmployee(monthly)) * 12,
  };
  for (const id of focus) claims[id] = Math.max(0, input.paid[id] ?? 0);

  const base = computeTax(current, { income, claims });
  const allowed = new Map(base.reliefs.map((r) => [r.id, r.allowed]));
  const taxAfter = (reduce: number) => netTaxFromChargeable(current, Math.max(0, base.chargeable - reduce)).netTax;

  const rows: PartnerRow[] = [];
  for (const id of focus) {
    const rule = current.reliefs.find((r) => r.id === id);
    if (!rule) continue;
    const used = allowed.get(id) ?? 0;
    const remaining = Math.max(0, rule.limit - used);
    rows.push({ id, limit: rule.limit, used, remaining, saving: round2(base.netTax - taxAfter(remaining)) });
  }
  const totalSaving = round2(base.netTax - taxAfter(rows.reduce((s, r) => s + r.remaining, 0)));
  const usedFocus = rows.reduce((s, r) => s + r.used, 0);
  const budget2027Saving = compareYears(current, next, { monthly, bonusMonths, otherReliefs: usedFocus }).saving;

  return { income, tax: base.netTax, marginalRate: base.marginalRate, rows, totalSaving, budget2027Saving };
}
