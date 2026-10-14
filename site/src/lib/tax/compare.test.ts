import { describe, expect, it } from 'vitest';
import { YA2026 } from '../../data/ya2026';
import { YA2027 } from '../../data/ya2027';
import { compareYears, quickTax } from './compare';

describe('quickTax', () => {
  it('RM5,000 a month, no bonus: matches the annual salary calculation', () => {
    const r = quickTax(YA2026, { monthly: 5_000, bonusMonths: 0, otherReliefs: 0 });
    expect(r.income).toBe(60_000);
    expect(r.chargeable).toBe(46_650);
    expect(r.tax).toBe(1_299);
  });

  it('other reliefs reduce chargeable income', () => {
    const r = quickTax(YA2026, { monthly: 5_000, bonusMonths: 0, otherReliefs: 2_500 });
    expect(r.chargeable).toBe(44_150);
  });

  it('zero income is zero tax', () => {
    expect(quickTax(YA2026, { monthly: 0, bonusMonths: 0, otherReliefs: 0 }).tax).toBe(0);
  });
});

describe('compareYears (Budget 2027)', () => {
  it('RM5,000 a month saves 6% of RM3,000 = RM180', () => {
    const r = compareYears(YA2026, YA2027, { monthly: 5_000, bonusMonths: 0, otherReliefs: 0 });
    expect(r.saving).toBe(180);
    expect(r.monthlySaving).toBe(15);
  });

  it('RM10,000 a month + 1 month bonus lands in the 18%/19% band', () => {
    const r = compareYears(YA2026, YA2027, { monthly: 10_000, bonusMonths: 1, otherReliefs: 0 });
    // income 130,000; relief 9,000+4,000+350 = 13,350 → CI 116,650 (YA2026); 113,650 (YA2027)
    expect(r.before.chargeable).toBe(116_650);
    expect(r.after.chargeable).toBe(113_650);
    // YA2026: 9,400 + 16,650×25% = 13,562.50 ; YA2027: 9,100 + 13,650×24% = 12,376
    expect(r.before.tax).toBe(13_562.5);
    expect(r.after.tax).toBe(12_376);
    expect(r.saving).toBe(1_186.5);
  });

  it('low earners who already pay nothing save nothing', () => {
    const r = compareYears(YA2026, YA2027, { monthly: 2_500, bonusMonths: 0, otherReliefs: 0 });
    expect(r.before.tax).toBe(0);
    expect(r.saving).toBe(0);
  });
});
