import { computeTax, netTaxFromChargeable, round2 } from './compute';
import type { TaxInput, YearRules } from './types';

/**
 * A realistic year-end move: `cap` is the part of the relief people can sensibly
 * act on before 31 Dec (e.g. medical → check-up + vaccination + dental sub-limits).
 */
export interface QuickMove {
  id: string;
  cap: number;
  needsChildren?: boolean;
}

export const QUICK_MOVES: QuickMove[] = [
  { id: 'lifestyle', cap: 2_500 },
  { id: 'sports', cap: 1_000 },
  { id: 'prs', cap: 3_000 },
  { id: 'medical', cap: 3_000 },
  { id: 'tourism', cap: 1_000 },
  { id: 'parents', cap: 1_000 },
  { id: 'sspn', cap: 8_000, needsChildren: true },
];

export interface PlanRow {
  id: string;
  remaining: number;
  saving: number;
}

export interface YearEndPlan {
  currentTax: number;
  marginalRate: number;
  quick: PlanRow[];
  /** Saving if every quick move is done together (not the sum of rows: bands change). */
  quickTotal: number;
  others: PlanRow[];
}

/**
 * `spent` holds what the user already spent per relief id (already folded into `input.claims`).
 * `candidates` = relief ids the user could still act on (from metadata).
 */
export function planYearEnd(rules: YearRules, input: TaxInput, spent: Record<string, number>, candidates: string[], hasChildren: boolean): YearEndPlan {
  const base = computeTax(rules, input);
  const allowed = new Map(base.reliefs.map((r) => [r.id, r.allowed]));
  const limitOf = new Map(rules.reliefs.map((r) => [r.id, r.limit]));
  const spouseRebate = Boolean(input.claims.spouse);
  const savingFor = (amount: number) =>
    round2(base.netTax - netTaxFromChargeable(rules, Math.max(0, base.chargeable - amount), { spouseRebate, zakat: input.zakat }).netTax);

  const quickIds = new Set<string>();
  const quick: PlanRow[] = [];
  for (const q of QUICK_MOVES) {
    if (!limitOf.has(q.id) || !candidates.includes(q.id)) continue;
    if (q.needsChildren && !hasChildren) continue;
    quickIds.add(q.id);
    const room = (limitOf.get(q.id) ?? 0) - (allowed.get(q.id) ?? 0);
    const usedOfCap = Math.min(q.cap, spent[q.id] ?? 0);
    const remaining = Math.max(0, Math.min(room, q.cap - usedOfCap));
    if (remaining > 0) quick.push({ id: q.id, remaining, saving: savingFor(remaining) });
  }
  quick.sort((a, b) => b.saving - a.saving || b.remaining - a.remaining);
  const quickTotal = savingFor(quick.reduce((s, r) => s + r.remaining, 0));

  const others: PlanRow[] = [];
  for (const id of candidates) {
    if (quickIds.has(id) || !limitOf.has(id)) continue;
    const remaining = Math.max(0, (limitOf.get(id) ?? 0) - (allowed.get(id) ?? 0));
    if (remaining > 0) others.push({ id, remaining, saving: savingFor(remaining) });
  }
  others.sort((a, b) => b.saving - a.saving);

  return { currentTax: base.netTax, marginalRate: base.marginalRate, quick, quickTotal, others };
}
