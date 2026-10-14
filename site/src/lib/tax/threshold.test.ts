import { expect, it } from 'vitest';
import { YA2026 } from '../../data/ya2026';
import { YA2027 } from '../../data/ya2027';
import { zeroTaxThreshold } from './threshold';

it('single salaried person starts paying tax at RM3,500 (YA2026) and RM3,750 (YA2027)', () => {
  expect(zeroTaxThreshold(YA2026)).toBe(3_500);
  expect(zeroTaxThreshold(YA2027)).toBe(3_750);
});
