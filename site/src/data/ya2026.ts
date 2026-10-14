import type { YearRules } from '../lib/tax/types';

/**
 * YA2026 = income earned 1 Jan – 31 Dec 2026, filed Mar–May 2027.
 * Rates: Schedule 1 ITA 1967 (unchanged since YA2023), confirmed as the "current position"
 * in the Budget 2027 tax measures (Appendix 1).
 * Reliefs: YA2025 list + Budget 2026 changes (vaccines, childcare RM3,000, learning
 * disability RM10,000, life insurance incl. children, food waste grinder & CCTV, tourism).
 */
export const YA2026: YearRules = {
  ya: 2026,
  status: 'law',
  brackets: [
    { from: 0, to: 5_000, rate: 0 },
    { from: 5_000, to: 20_000, rate: 1 },
    { from: 20_000, to: 35_000, rate: 3 },
    { from: 35_000, to: 50_000, rate: 6 },
    { from: 50_000, to: 70_000, rate: 11 },
    { from: 70_000, to: 100_000, rate: 19 },
    { from: 100_000, to: 400_000, rate: 25 },
    { from: 400_000, to: 600_000, rate: 26 },
    { from: 600_000, to: 2_000_000, rate: 28 },
    { from: 2_000_000, to: null, rate: 30 },
  ],
  rebate: { threshold: 35_000, amount: 400 },
  reliefs: [
    { id: 'self', kind: 'flag', limit: 9_000 },
    { id: 'disabledSelf', kind: 'flag', limit: 7_000 },
    { id: 'spouse', kind: 'flag', limit: 4_000 },
    { id: 'disabledSpouse', kind: 'flag', limit: 6_000 },
    { id: 'childUnder18', kind: 'count', limit: 2_000 },
    { id: 'childPreU', kind: 'count', limit: 2_000 },
    { id: 'childHigherEd', kind: 'count', limit: 8_000 },
    { id: 'childDisabled', kind: 'count', limit: 8_000 },
    { id: 'childDisabledHigherEd', kind: 'count', limit: 16_000 },
    {
      id: 'parents',
      kind: 'amount',
      limit: 8_000,
      parts: [
        { id: 'care', limit: null, label: { zh: '医药、牙科、居家/日间/养老院护理', en: 'Medical, dental, home/day/residential care' } },
        { id: 'checkup', limit: 1_000, label: { zh: '全身体检、疫苗', en: 'Full medical check-up, vaccination' } },
      ],
    },
    { id: 'disabledEquipment', kind: 'amount', limit: 6_000 },
    {
      id: 'education',
      kind: 'amount',
      limit: 7_000,
      parts: [
        { id: 'degree', limit: null, label: { zh: '认可课程（法律、会计、技术、理工等）/ 硕士博士', en: 'Recognised courses (law, accounting, technical, science…) / Masters & PhD' } },
        { id: 'upskilling', limit: 2_000, label: { zh: '技能提升课程（JPK 认可）', en: 'Upskilling courses (recognised by JPK)' } },
      ],
    },
    {
      id: 'medical',
      kind: 'amount',
      limit: 10_000,
      parts: [
        { id: 'serious', limit: null, label: { zh: '严重疾病、生育治疗', en: 'Serious illness, fertility treatment' } },
        { id: 'learningDisability', limit: 10_000, label: { zh: '学习障碍儿童（18 岁及以下）诊断与康复', en: 'Learning disability (child ≤18): diagnosis & rehab' } },
        { id: 'vaccination', limit: 1_000, label: { zh: '疫苗（所有 NPRA 注册疫苗）', en: 'Vaccination (all NPRA-registered vaccines)' } },
        { id: 'dental', limit: 1_000, label: { zh: '牙科检查与治疗', en: 'Dental examination & treatment' } },
        { id: 'checkup', limit: 1_000, label: { zh: '体检、心理健康、检测、自我监测设备', en: 'Check-up, mental health, tests, self-monitoring devices' } },
      ],
      note: { zh: 'YA2026 起：疫苗涵盖所有 NPRA 注册疫苗；学习障碍上限从 RM6,000 提高到 RM10,000。', en: 'From YA2026: all NPRA-registered vaccines qualify; learning-disability cap raised from RM6,000 to RM10,000.' },
    },
    { id: 'lifestyle', kind: 'amount', limit: 2_500 },
    { id: 'sports', kind: 'amount', limit: 1_000 },
    { id: 'breastfeeding', kind: 'amount', limit: 1_000 },
    {
      id: 'childcare',
      kind: 'amount',
      limit: 3_000,
      note: { zh: 'YA2026 起：上限 RM3,000 永久化，并涵盖 12 岁以下的日托/课后托管中心。', en: 'From YA2026: RM3,000 made permanent and extended to day-care / after-school centres for children up to 12.' },
    },
    { id: 'sspn', kind: 'amount', limit: 8_000 },
    { id: 'epf', kind: 'amount', limit: 4_000 },
    {
      id: 'lifeInsurance',
      kind: 'amount',
      limit: 3_000,
      note: { zh: 'YA2026 起：孩子的人寿保险/家庭回教保险也能扣。', en: 'From YA2026: life insurance / family takaful for children also qualifies.' },
    },
    { id: 'prs', kind: 'amount', limit: 3_000 },
    { id: 'eduMedInsurance', kind: 'amount', limit: 4_000 },
    { id: 'socso', kind: 'amount', limit: 350 },
    {
      id: 'evCharging',
      kind: 'amount',
      limit: 2_500,
      note: { zh: 'YA2026 起：新增厨余粉碎机、家用 CCTV（两年内限报一次）。', en: 'From YA2026: adds food waste grinders and home CCTV (once every 2 years).' },
    },
    { id: 'homeLoan500', kind: 'amount', limit: 7_000, exclusiveGroup: 'homeLoan' },
    { id: 'homeLoan750', kind: 'amount', limit: 5_000, exclusiveGroup: 'homeLoan' },
    {
      id: 'tourism',
      kind: 'amount',
      limit: 1_000,
      note: { zh: 'YA2026 新增（配合 2026 大马旅游年）。', en: 'New for YA2026 (Visit Malaysia Year 2026).' },
    },
  ],
  sources: [
    { title: 'Budget 2026 Tax Measures (MOF)', url: 'https://belanjawan.mof.gov.my/pdf/belanjawan2026/ucapan/tax-measures.pdf' },
    { title: 'Budget 2027 Tax Measures — current positions (MOF)', url: 'https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/tax-measures.pdf' },
    { title: 'LHDN — Tax rates & reliefs', url: 'https://www.hasil.gov.my/' },
  ],
};
