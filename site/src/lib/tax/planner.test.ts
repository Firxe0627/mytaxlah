import { describe, expect, it } from 'vitest';
import { YA2026 } from '../../data/ya2026';
import { planYearEnd } from './planner';

const candidates = ['lifestyle', 'sports', 'prs', 'medical', 'tourism', 'parents', 'sspn', 'education', 'childcare'];

describe('planYearEnd', () => {
  it('quick moves use realistic caps and a joint total', () => {
    // income 100,000, self relief only → CI 91,000 at 19%
    const plan = planYearEnd(YA2026, { income: 100_000, claims: {} }, {}, candidates, false);
    const ids = plan.quick.map((r) => r.id);
    expect(ids).toEqual(['prs', 'medical', 'lifestyle', 'sports', 'tourism', 'parents']);
    expect(plan.quick.find((r) => r.id === 'medical')!.remaining).toBe(3_000);
    // 11,500 of moves from CI 91,000 → 79,500, all inside the 19% band
    expect(plan.quickTotal).toBe(2_185);
    expect(plan.others.map((r) => r.id)).toContain('sspn');
  });

  it('SSPN is a quick move only with children', () => {
    const plan = planYearEnd(YA2026, { income: 100_000, claims: {} }, {}, candidates, true);
    expect(plan.quick.map((r) => r.id)).toContain('sspn');
  });

  it('already-spent amounts reduce the remaining room', () => {
    const plan = planYearEnd(YA2026, { income: 100_000, claims: { lifestyle: 2_000 } }, { lifestyle: 2_000 }, candidates, false);
    expect(plan.quick.find((r) => r.id === 'lifestyle')!.remaining).toBe(500);
  });

  it('nothing to save when no tax is due', () => {
    const plan = planYearEnd(YA2026, { income: 20_000, claims: {} }, {}, candidates, false);
    expect(plan.currentTax).toBe(0);
    expect(plan.quickTotal).toBe(0);
  });
});
