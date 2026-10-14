import { describe, expect, it } from 'vitest';
import { YA2026 } from '../../data/ya2026';
import { YA2027 } from '../../data/ya2027';
import { computeTax, reliefHeadroom, taxOnChargeable } from './compute';
import { annualTaxForSalary, eisEmployee, epfEmployee, epfEmployer, pcbEstimate, salaryBreakdown, socsoEmployee } from './salary';

describe('taxOnChargeable — YA2026 schedule (cumulative tax at band edges)', () => {
  it.each([
    [0, 0],
    [5_000, 0],
    [20_000, 150],
    [35_000, 600],
    [50_000, 1_500],
    [70_000, 3_700],
    [100_000, 9_400],
    [400_000, 84_400],
    [600_000, 136_400],
    [2_000_000, 528_400],
    [2_500_000, 678_400],
  ])('CI %i → RM%i', (ci, expected) => {
    expect(taxOnChargeable(YA2026.brackets, ci).tax).toBe(expected);
  });
});

describe('taxOnChargeable — YA2027 proposed schedule', () => {
  it.each([
    [70_000, 3_700],
    [100_000, 9_100],
    [150_000, 21_100],
    [400_000, 83_600],
    [600_000, 135_600],
    [1_000_000, 247_600],
    [2_000_000, 547_600],
  ])('CI %i → RM%i', (ci, expected) => {
    expect(taxOnChargeable(YA2027.brackets, ci).tax).toBe(expected);
  });

  it('marginal rate follows the band', () => {
    expect(taxOnChargeable(YA2027.brackets, 80_000).marginalRate).toBe(18);
    expect(taxOnChargeable(YA2027.brackets, 120_000).marginalRate).toBe(24);
    expect(taxOnChargeable(YA2026.brackets, 120_000).marginalRate).toBe(25);
  });
});

describe('Budget 2027 savings match Deloitte’s published examples', () => {
  // Deloitte: RM100,000 chargeable income saves ~RM840; RM150,000 saves ~RM1,520.
  it.each([
    [109_000, 840],
    [159_000, 1_520],
  ])('income %i (self relief only) saves RM%i', (income, saving) => {
    const a = computeTax(YA2026, { income, claims: {} });
    const b = computeTax(YA2027, { income, claims: {} });
    expect(a.netTax - b.netTax).toBe(saving);
  });
});

describe('rebates and zakat', () => {
  it('RM400 rebate at CI exactly RM35,000', () => {
    const r = computeTax(YA2026, { income: 44_000, claims: {} });
    expect(r.chargeable).toBe(35_000);
    expect(r.grossTax).toBe(600);
    expect(r.rebate).toBe(400);
    expect(r.netTax).toBe(200);
  });

  it('no rebate above RM35,000', () => {
    const r = computeTax(YA2026, { income: 44_001, claims: {} });
    expect(r.rebate).toBe(0);
    expect(r.netTax).toBe(600.06);
  });

  it('rebate never makes tax negative', () => {
    const r = computeTax(YA2026, { income: 29_000, claims: {} });
    expect(r.grossTax).toBe(150);
    expect(r.netTax).toBe(0);
  });

  it('spouse with no income adds a second RM400 rebate', () => {
    const r = computeTax(YA2026, { income: 43_000, claims: { spouse: 1 } });
    expect(r.chargeable).toBe(30_000);
    expect(r.grossTax).toBe(450);
    expect(r.rebate).toBe(450);
    expect(r.netTax).toBe(0);
  });

  it('zakat is rebated against tax', () => {
    const r = computeTax(YA2026, { income: 69_000, claims: {}, zakat: 1_000 });
    expect(r.chargeable).toBe(60_000);
    expect(r.grossTax).toBe(2_600);
    expect(r.netTax).toBe(1_600);
  });

  it('zakat cannot exceed tax payable', () => {
    const r = computeTax(YA2026, { income: 69_000, claims: {}, zakat: 9_999 });
    expect(r.zakatRebate).toBe(2_600);
    expect(r.netTax).toBe(0);
  });
});

describe('relief limits', () => {
  const allowed = (claims: Record<string, number>, rules = YA2026) =>
    Object.fromEntries(computeTax(rules, { income: 200_000, claims }).reliefs.map((r) => [r.id, r.allowed]));

  it('self relief is automatic', () => {
    expect(allowed({}).self).toBe(9_000);
    expect(allowed({}, YA2027).self).toBe(12_000);
  });

  it('amount reliefs are capped', () => {
    expect(allowed({ lifestyle: 3_000 }).lifestyle).toBe(2_500);
    expect(allowed({ epf: 6_600 }).epf).toBe(4_000);
    expect(allowed({ prs: 1_200 }).prs).toBe(1_200);
  });

  it('sub-limits apply inside a relief, then the overall cap', () => {
    expect(allowed({ 'medical.vaccination': 1_500 }).medical).toBe(1_000);
    expect(allowed({ 'medical.serious': 9_500, 'medical.vaccination': 1_000 }).medical).toBe(10_000);
    expect(allowed({ 'education.upskilling': 3_000, 'education.degree': 1_000 }).education).toBe(3_000);
  });

  it('per-child reliefs multiply', () => {
    expect(allowed({ childUnder18: 2, childHigherEd: 1 })).toMatchObject({ childUnder18: 4_000, childHigherEd: 8_000 });
  });

  it('only one first-home loan tier counts', () => {
    const r = allowed({ homeLoan500: 6_000, homeLoan750: 5_000 });
    expect(r.homeLoan500).toBe(6_000);
    expect(r.homeLoan750).toBe(0);
  });

  it('negative or junk claims are ignored', () => {
    expect(allowed({ lifestyle: -500, prs: Number.NaN }).lifestyle).toBe(0);
  });

  it('chargeable income never goes below zero', () => {
    const r = computeTax(YA2026, { income: 5_000, claims: { lifestyle: 2_500 } });
    expect(r.chargeable).toBe(0);
    expect(r.netTax).toBe(0);
  });
});

describe('reliefHeadroom', () => {
  it('unused lifestyle relief at the 19% band saves 19%', () => {
    const rows = reliefHeadroom(YA2026, { income: 100_000, claims: {} });
    const lifestyle = rows.find((r) => r.id === 'lifestyle')!;
    expect(lifestyle.remaining).toBe(2_500);
    expect(lifestyle.saving).toBe(475);
  });

  it('a fully used relief has no headroom', () => {
    const rows = reliefHeadroom(YA2026, { income: 100_000, claims: { prs: 3_000 } });
    expect(rows.find((r) => r.id === 'prs')).toMatchObject({ remaining: 0, saving: 0 });
  });

  it('saving crosses band boundaries correctly', () => {
    // CI 71,000 → filling RM3,000 PRS drops CI to 68,000: 1,000 @19% + 2,000 @11%
    const rows = reliefHeadroom(YA2026, { income: 80_000, claims: {} });
    expect(rows.find((r) => r.id === 'prs')!.saving).toBe(410);
  });
});

describe('salary deductions', () => {
  it.each([
    [3_000, 330],
    [3_500, 385],
    [4_010, 443],
    [5_000, 550],
    [8_050, 891],
  ])('EPF employee on RM%i = RM%i', (wage, epf) => {
    expect(epfEmployee(wage)).toBe(epf);
  });

  it('EPF employer is 13% up to RM5,000 and 12% above', () => {
    expect(epfEmployer(5_000)).toBe(650);
    expect(epfEmployer(6_000)).toBe(720);
  });

  it('SOCSO and EIS use the band mid-point and the RM6,000 ceiling', () => {
    expect(socsoEmployee(3_000)).toBe(14.75);
    expect(socsoEmployee(6_000)).toBe(29.75);
    expect(socsoEmployee(15_000)).toBe(29.75);
    expect(eisEmployee(3_000)).toBe(5.9);
    expect(eisEmployee(15_000)).toBe(11.9);
  });

  it('PCB for RM5,000 single matches the MTD formula (RM110)', () => {
    expect(pcbEstimate(YA2026, 5_000, 550)).toBe(110);
  });

  it('PCB is zero when the rebate covers the tax', () => {
    expect(pcbEstimate(YA2026, 3_000, 330)).toBe(0);
  });

  it('net pay adds up', () => {
    const b = salaryBreakdown(YA2026, 5_000);
    expect(b.net).toBeCloseTo(5_000 - 550 - 24.75 - 9.9 - 110, 2);
  });

  it('annual tax for a salary uses self + EPF + SOCSO reliefs', () => {
    const r = annualTaxForSalary(YA2026, 5_000);
    expect(r.income).toBe(60_000);
    expect(r.relief).toBe(9_000 + 4_000 + 350);
    expect(r.chargeable).toBe(46_650);
    expect(r.tax).toBe(1_299);
  });
});
