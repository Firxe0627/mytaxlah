import { describe, expect, it } from 'vitest';
import { YA2026 } from '../../data/ya2026';
import { YA2027 } from '../../data/ya2027';
import { partnerPlan } from './partner';

const focus = ['lifeInsurance', 'eduMedInsurance', 'prs'];

describe('partnerPlan', () => {
  it('RM8,000 + 1 month bonus, nothing paid yet: every focus relief saves 19%', () => {
    // income 104,000; reliefs 9,000 + 4,000 + 350 → CI 90,650 (19% band)
    const p = partnerPlan(YA2026, YA2027, { monthly: 8_000, bonusMonths: 1, paid: {} }, focus);
    expect(p.income).toBe(104_000);
    expect(p.marginalRate).toBe(19);
    expect(p.rows.map((r) => [r.id, r.remaining, r.saving])).toEqual([
      ['lifeInsurance', 3_000, 570],
      ['eduMedInsurance', 4_000, 760],
      ['prs', 3_000, 570],
    ]);
    // 10,000 together: CI 90,650 → 80,650, still in the 19% band
    expect(p.totalSaving).toBe(1_900);
  });

  it('premiums already paid reduce the room left', () => {
    const p = partnerPlan(YA2026, YA2027, { monthly: 8_000, bonusMonths: 1, paid: { lifeInsurance: 3_500, prs: 1_000 } }, focus);
    expect(p.rows.find((r) => r.id === 'lifeInsurance')).toMatchObject({ used: 3_000, remaining: 0, saving: 0 });
    expect(p.rows.find((r) => r.id === 'prs')).toMatchObject({ used: 1_000, remaining: 2_000 });
  });

  it('includes the Budget 2027 saving with the same claims', () => {
    const p = partnerPlan(YA2026, YA2027, { monthly: 5_000, bonusMonths: 0, paid: {} }, focus);
    expect(p.budget2027Saving).toBe(180);
  });

  it('no saving when no tax is due', () => {
    const p = partnerPlan(YA2026, YA2027, { monthly: 3_000, bonusMonths: 0, paid: {} }, focus);
    expect(p.tax).toBe(0);
    expect(p.totalSaving).toBe(0);
  });

  it('ignores unknown relief ids', () => {
    const p = partnerPlan(YA2026, YA2027, { monthly: 8_000, bonusMonths: 0, paid: {} }, ['prs', 'nope']);
    expect(p.rows.map((r) => r.id)).toEqual(['prs']);
  });
});
