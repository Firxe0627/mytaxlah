import { netTaxFromChargeable, round2 } from './compute';
import type { YearRules } from './types';

/**
 * Monthly statutory deductions for a Malaysian employee below 60.
 * These follow the published contribution schedules closely but are estimates:
 * always check your payslip / KWSP / PERKESO tables.
 */

/** EPF Third Schedule: contribution is based on the top of the wage band, rounded up to the next ringgit. */
function epfWageBase(wage: number): number {
  if (wage <= 10) return 0;
  if (wage <= 5_000) return Math.ceil(wage / 20) * 20;
  if (wage <= 20_000) return Math.ceil(wage / 100) * 100;
  return wage;
}

export function epfEmployee(wage: number, ratePercent = 11): number {
  return Math.ceil(round2((epfWageBase(wage) * ratePercent) / 100));
}

export function epfEmployer(wage: number): number {
  const rate = wage <= 5_000 ? 13 : 12;
  return Math.ceil(round2((epfWageBase(wage) * rate) / 100));
}

/** SOCSO/EIS insured-wage ceiling (RM6,000 since 1 Oct 2024); bands of RM100, contribution on the mid-point. */
export const SOCSO_CEILING = 6_000;

function socsoAssumedWage(wage: number): number {
  if (wage <= 0) return 0;
  if (wage > SOCSO_CEILING - 100) return SOCSO_CEILING - 50;
  return Math.max(50, Math.ceil(wage / 100) * 100 - 50);
}

/** Category 1 (employment injury + invalidity): employee 0.5%, employer 1.75%. */
export function socsoEmployee(wage: number): number {
  return round2(socsoAssumedWage(wage) * 0.005);
}
export function socsoEmployer(wage: number): number {
  return Math.round(socsoAssumedWage(wage) * 0.0175 * 20) / 20;
}

/** EIS: 0.2% each for employee and employer. */
export function eisEmployee(wage: number): number {
  return round2(socsoAssumedWage(wage) * 0.002);
}

export interface PcbOptions {
  /** Spouse has no income (MTD category 2). */
  spouseNoIncome?: boolean;
  children?: number;
}

/**
 * Monthly tax deduction (PCB/MTD) estimate for a steady monthly salary:
 * annualised tax after self/EPF/spouse/child reliefs and rebate, divided by 12,
 * rounded up to 5 sen; amounts under RM10 are not deducted.
 */
export function pcbEstimate(rules: YearRules, monthlyWage: number, monthlyEpf: number, opts: PcbOptions = {}): number {
  const self = rules.reliefs.find((r) => r.id === 'self')?.limit ?? 9_000;
  const epfCap = rules.reliefs.find((r) => r.id === 'epf')?.limit ?? 4_000;
  const childRelief = rules.reliefs.find((r) => r.id === 'childUnder18')?.limit ?? 2_000;
  const spouseRelief = rules.reliefs.find((r) => r.id === 'spouse')?.limit ?? 4_000;
  const annual = monthlyWage * 12;
  const ci =
    annual -
    self -
    Math.min(monthlyEpf * 12, epfCap) -
    (opts.spouseNoIncome ? spouseRelief : 0) -
    (opts.children ?? 0) * childRelief;
  const { netTax } = netTaxFromChargeable(rules, Math.max(0, Math.floor(ci)), { spouseRebate: opts.spouseNoIncome });
  const monthly = Math.ceil((netTax / 12) * 20 - 1e-9) / 20;
  return monthly < 10 ? 0 : round2(monthly);
}

export interface SalaryBreakdown {
  gross: number;
  epf: number;
  socso: number;
  eis: number;
  pcb: number;
  net: number;
  employerEpf: number;
  employerSocso: number;
  employerEis: number;
  employerCost: number;
}

export function salaryBreakdown(rules: YearRules, gross: number, opts: PcbOptions & { epfRate?: number } = {}): SalaryBreakdown {
  const epf = epfEmployee(gross, opts.epfRate ?? 11);
  const socso = socsoEmployee(gross);
  const eis = eisEmployee(gross);
  const pcb = pcbEstimate(rules, gross, epf, opts);
  const employerEpf = epfEmployer(gross);
  const employerSocso = socsoEmployer(gross);
  const employerEis = eis;
  return {
    gross,
    epf,
    socso,
    eis,
    pcb,
    net: round2(gross - epf - socso - eis - pcb),
    employerEpf,
    employerSocso,
    employerEis,
    employerCost: round2(gross + employerEpf + employerSocso + employerEis),
  };
}

/**
 * Annual tax for a salaried single person with only the automatic reliefs
 * (self, EPF up to cap, SOCSO+EIS up to RM350). Used for the salary pages.
 */
export function annualTaxForSalary(rules: YearRules, monthlyGross: number, bonusMonths = 0) {
  const b = salaryBreakdown(rules, monthlyGross);
  const income = monthlyGross * (12 + bonusMonths);
  const epfYear = b.epf * 12 + epfEmployee(monthlyGross) * bonusMonths;
  const socsoCap = rules.reliefs.find((r) => r.id === 'socso')?.limit ?? 350;
  const self = rules.reliefs.find((r) => r.id === 'self')?.limit ?? 9_000;
  const epfCap = rules.reliefs.find((r) => r.id === 'epf')?.limit ?? 4_000;
  const relief = self + Math.min(epfYear, epfCap) + Math.min((b.socso + b.eis) * 12, socsoCap);
  const chargeable = Math.max(0, Math.floor(income - relief));
  const t = netTaxFromChargeable(rules, chargeable);
  return { income, relief, chargeable, tax: t.netTax, marginalRate: chargeable > 0 ? t.marginalRate : 0 };
}
