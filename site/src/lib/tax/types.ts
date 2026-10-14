export type Lang = 'zh' | 'en';
export type L10n = { zh: string; en: string };

/** One marginal-rate band. `to: null` means no upper limit. Rate is in percent. */
export interface Bracket {
  from: number;
  to: number | null;
  rate: number;
}

/**
 * - `flag`: fixed amount when claimed (e.g. spouse relief)
 * - `count`: `limit` per unit (e.g. per child)
 * - `amount`: claim what you spent, capped at `limit` (and optional sub-limits)
 */
export type ReliefKind = 'flag' | 'count' | 'amount';

/** A sub-item inside an `amount` relief. `limit: null` = only the parent cap applies. */
export interface ReliefPart {
  id: string;
  limit: number | null;
  label: L10n;
}

export interface ReliefRule {
  id: string;
  kind: ReliefKind;
  limit: number;
  parts?: ReliefPart[];
  /** Only the largest relief in the same group counts (e.g. two home-loan tiers). */
  exclusiveGroup?: string;
  /** Year-specific note, e.g. what changed this year. */
  note?: L10n;
}

export interface YearRules {
  ya: number;
  status: 'law' | 'proposed';
  brackets: Bracket[];
  /** Rebate when chargeable income <= threshold (self; same again for a spouse with no income). */
  rebate: { threshold: number; amount: number };
  reliefs: ReliefRule[];
  sources: { title: string; url: string }[];
}

/**
 * Claims keyed by relief id, or `${reliefId}.${partId}` for reliefs with parts.
 * flag: 1 = claimed. count: number of units. amount: RM spent.
 */
export type Claims = Record<string, number | undefined>;

export interface TaxInput {
  /** Total annual income before reliefs (employment incl. bonus + other taxable income). */
  income: number;
  claims: Claims;
  /** Zakat / fitrah paid — rebated against tax payable. */
  zakat?: number;
}

export interface BandTax {
  from: number;
  to: number | null;
  rate: number;
  taxable: number;
  tax: number;
}

export interface ReliefResult {
  id: string;
  allowed: number;
  limit: number;
}

export interface TaxResult {
  ya: number;
  income: number;
  totalRelief: number;
  chargeable: number;
  grossTax: number;
  rebate: number;
  zakatRebate: number;
  netTax: number;
  /** netTax / income, as a fraction. */
  effectiveRate: number;
  /** Marginal rate (percent) on the last ringgit of chargeable income. */
  marginalRate: number;
  bands: BandTax[];
  reliefs: ReliefResult[];
}
