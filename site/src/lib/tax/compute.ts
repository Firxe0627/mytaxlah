import type { BandTax, Bracket, Claims, ReliefRule, ReliefResult, TaxInput, TaxResult, YearRules } from './types';

const round2 = (n: number) => Math.round(n * 100) / 100;
const nonNeg = (n: number | undefined) => (n && Number.isFinite(n) && n > 0 ? n : 0);

export function taxOnChargeable(brackets: Bracket[], chargeable: number) {
  const ci = Math.max(0, chargeable);
  const bands: BandTax[] = [];
  let tax = 0;
  let marginalRate = brackets[0]?.rate ?? 0;
  for (const b of brackets) {
    if (ci <= b.from) break;
    const top = b.to === null ? ci : Math.min(ci, b.to);
    const taxable = top - b.from;
    const bandTax = (taxable * b.rate) / 100;
    tax += bandTax;
    marginalRate = b.rate;
    bands.push({ from: b.from, to: b.to, rate: b.rate, taxable, tax: round2(bandTax) });
  }
  return { tax: round2(tax), bands, marginalRate };
}

export function reliefAllowed(rule: ReliefRule, claims: Claims): number {
  if (rule.id === 'self') return rule.limit;
  switch (rule.kind) {
    case 'flag':
      return claims[rule.id] ? rule.limit : 0;
    case 'count':
      return Math.floor(nonNeg(claims[rule.id])) * rule.limit;
    case 'amount': {
      if (!rule.parts) return Math.min(nonNeg(claims[rule.id]), rule.limit);
      let sum = 0;
      for (const p of rule.parts) {
        const v = nonNeg(claims[`${rule.id}.${p.id}`]);
        sum += p.limit === null ? v : Math.min(v, p.limit);
      }
      return Math.min(sum, rule.limit);
    }
  }
}

export function computeReliefs(rules: YearRules, claims: Claims): ReliefResult[] {
  const results = rules.reliefs.map((r) => ({ id: r.id, allowed: reliefAllowed(r, claims), limit: r.limit }));
  // Within an exclusive group only the largest claim counts.
  const groups = new Map<string, ReliefResult[]>();
  rules.reliefs.forEach((r, i) => {
    if (!r.exclusiveGroup) return;
    const list = groups.get(r.exclusiveGroup) ?? [];
    list.push(results[i]);
    groups.set(r.exclusiveGroup, list);
  });
  for (const list of groups.values()) {
    const best = list.reduce((a, b) => (b.allowed > a.allowed ? b : a));
    for (const r of list) if (r !== best) r.allowed = 0;
  }
  return results;
}

/** Rebate (self + spouse with no income) and zakat, applied to tax on chargeable income. */
export function netTaxFromChargeable(rules: YearRules, chargeable: number, opts: { spouseRebate?: boolean; zakat?: number } = {}) {
  const { tax: grossTax, bands, marginalRate } = taxOnChargeable(rules.brackets, chargeable);
  const eligible = chargeable <= rules.rebate.threshold;
  const rebateTotal = eligible ? rules.rebate.amount * (opts.spouseRebate ? 2 : 1) : 0;
  const rebate = Math.min(rebateTotal, grossTax);
  const afterRebate = grossTax - rebate;
  const zakatRebate = Math.min(nonNeg(opts.zakat), afterRebate);
  const netTax = round2(afterRebate - zakatRebate);
  return { grossTax, bands, marginalRate, rebate: round2(rebate), zakatRebate: round2(zakatRebate), netTax };
}

export function computeTax(rules: YearRules, input: TaxInput): TaxResult {
  const income = nonNeg(input.income);
  const reliefs = computeReliefs(rules, input.claims);
  const totalRelief = reliefs.reduce((s, r) => s + r.allowed, 0);
  const chargeable = Math.max(0, Math.floor(income - totalRelief));
  const spouseRebate = Boolean(input.claims.spouse);
  const t = netTaxFromChargeable(rules, chargeable, { spouseRebate, zakat: input.zakat });
  return {
    ya: rules.ya,
    income,
    totalRelief,
    chargeable,
    grossTax: t.grossTax,
    rebate: t.rebate,
    zakatRebate: t.zakatRebate,
    netTax: t.netTax,
    effectiveRate: income > 0 ? t.netTax / income : 0,
    marginalRate: chargeable > 0 ? t.marginalRate : 0,
    bands: t.bands,
    reliefs,
  };
}

export interface Headroom {
  id: string;
  limit: number;
  used: number;
  remaining: number;
  /** Tax saved if the remaining headroom is fully used (all other claims unchanged). */
  saving: number;
}

/** For each `amount` relief: how much limit is left and how much tax filling it would save. */
export function reliefHeadroom(rules: YearRules, input: TaxInput): Headroom[] {
  const base = computeTax(rules, input);
  const spouseRebate = Boolean(input.claims.spouse);
  const byId = new Map(base.reliefs.map((r) => [r.id, r]));
  const out: Headroom[] = [];
  for (const rule of rules.reliefs) {
    if (rule.kind !== 'amount') continue;
    const used = byId.get(rule.id)?.allowed ?? 0;
    // For exclusive groups, headroom is measured against whichever tier is in use.
    if (rule.exclusiveGroup) {
      const siblings = rules.reliefs.filter((r) => r.exclusiveGroup === rule.exclusiveGroup);
      const groupUsed = siblings.reduce((s, r) => s + (byId.get(r.id)?.allowed ?? 0), 0);
      if (groupUsed > 0 && used === 0) continue;
    }
    const remaining = Math.max(0, rule.limit - used);
    const after = netTaxFromChargeable(rules, Math.max(0, base.chargeable - remaining), { spouseRebate, zakat: input.zakat });
    out.push({ id: rule.id, limit: rule.limit, used, remaining, saving: round2(base.netTax - after.netTax) });
  }
  return out;
}

export { round2 };
