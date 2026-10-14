import type { YearRules } from '../lib/tax/types';
import { YA2026 } from './ya2026';

const keep = (id: string) => {
  const rule = YA2026.reliefs.find((r) => r.id === id);
  if (!rule) throw new Error(`Unknown relief ${id}`);
  const { note: _note, ...rest } = rule;
  return rest;
};

/**
 * YA2027 = income earned in 2027, filed in 2028.
 * Source: Budget 2027 Tax Measures (tabled 9 Oct 2026), Appendices 1–9.
 * Still a PROPOSAL until the Finance Bill 2026 is passed and gazetted.
 */
export const YA2027: YearRules = {
  ya: 2027,
  status: 'proposed',
  brackets: [
    { from: 0, to: 5_000, rate: 0 },
    { from: 5_000, to: 20_000, rate: 1 },
    { from: 20_000, to: 35_000, rate: 3 },
    { from: 35_000, to: 50_000, rate: 6 },
    { from: 50_000, to: 70_000, rate: 11 },
    { from: 70_000, to: 100_000, rate: 18 },
    { from: 100_000, to: 150_000, rate: 24 },
    { from: 150_000, to: 400_000, rate: 25 },
    { from: 400_000, to: 600_000, rate: 26 },
    { from: 600_000, to: 1_000_000, rate: 28 },
    { from: 1_000_000, to: null, rate: 30 },
  ],
  rebate: { threshold: 35_000, amount: 400 },
  reliefs: [
    {
      id: 'self',
      kind: 'flag',
      limit: 12_000,
      note: { zh: '从 RM9,000 提高到 RM12,000（2010 年以来首次调整）。', en: 'Raised from RM9,000 to RM12,000 — the first increase since 2010.', ms: 'Dinaikkan daripada RM9,000 kepada RM12,000 — kenaikan pertama sejak 2010.' },
    },
    keep('disabledSelf'),
    keep('spouse'),
    keep('disabledSpouse'),
    keep('childUnder18'),
    keep('childPreU'),
    keep('childHigherEd'),
    keep('childDisabled'),
    keep('childDisabledHigherEd'),
    {
      id: 'parents',
      kind: 'amount',
      limit: 8_000,
      parts: [
        { id: 'care', limit: null, label: { zh: '医药、牙科、所有护理开支（不再限医疗）', en: 'Medical, dental, all care expenses (no longer medical-only)', ms: 'Perubatan, pergigian, semua perbelanjaan penjagaan (bukan lagi perubatan sahaja)' } },
        { id: 'checkup', limit: 1_000, label: { zh: '全身体检、疫苗', en: 'Full medical check-up, vaccination', ms: 'Pemeriksaan perubatan penuh, vaksinasi' } },
      ],
      note: { zh: '居家/日间/养老院护理扩大到所有护理开支，不再需要医生证明。', en: 'Home/day/residential care expanded to all care expenses; no doctor certification needed.', ms: 'Penjagaan di rumah / jagaan harian / pusat jagaan diperluas kepada semua perbelanjaan penjagaan; tidak perlu pengesahan doktor.' },
    },
    keep('disabledEquipment'),
    {
      id: 'education',
      kind: 'amount',
      limit: 7_000,
      parts: [
        { id: 'tertiary', limit: null, label: { zh: '证书/文凭/学士/硕士/博士（任何领域）', en: 'Certificate / Diploma / Degree / Masters / PhD (any field)', ms: 'Sijil / Diploma / Ijazah / Sarjana / PhD (apa-apa bidang)' } },
        { id: 'tvet', limit: 3_000, label: { zh: '本人或配偶的 TVET 技能课程', en: 'TVET upskilling for self or spouse', ms: 'Kursus TVET untuk diri sendiri atau pasangan' } },
        { id: 'hobby', limit: 2_000, label: { zh: '兴趣课程；孩子的 STEM/艺术/语言/宗教补习', en: 'Hobby classes; children’s STEM / arts / language / religion tuition', ms: 'Kelas hobi; tuisyen STEM / seni / bahasa / agama untuk anak' } },
      ],
      note: { zh: '改名为「教育与技能培训费」：任何领域的学位都可扣，孩子补习费也纳入。', en: 'Renamed "Education & Skills Training Fees": any field of study qualifies, children’s tuition included.', ms: 'Dinamakan semula "Yuran Pendidikan & Latihan Kemahiran": apa-apa bidang pengajian layak, termasuk tuisyen anak.' },
    },
    {
      id: 'medical',
      kind: 'amount',
      limit: 10_000,
      parts: [
        { id: 'serious', limit: null, label: { zh: '严重疾病、生育治疗', en: 'Serious illness, fertility treatment', ms: 'Penyakit serius, rawatan kesuburan' } },
        { id: 'learningDisability', limit: 10_000, label: { zh: '学习障碍儿童（18 岁及以下）诊断与康复', en: 'Learning disability (child ≤18): diagnosis & rehab', ms: 'Masalah pembelajaran (anak ≤18 tahun): diagnosis & pemulihan' } },
        { id: 'vaccination', limit: 1_000, label: { zh: '疫苗', en: 'Vaccination', ms: 'Vaksinasi' } },
        { id: 'dental', limit: 1_000, label: { zh: '牙科检查与治疗', en: 'Dental examination & treatment', ms: 'Pemeriksaan dan rawatan pergigian' } },
        { id: 'checkup', limit: 1_000, label: { zh: '体检、心理健康、检测、自我监测设备', en: 'Check-up, mental health, tests, self-monitoring devices', ms: 'Pemeriksaan kesihatan, kesihatan mental, ujian, alat pemantauan kendiri' } },
        { id: 'postnatal', limit: 3_000, label: { zh: '月子中心 / 产后护理', en: 'Confinement centre / postnatal care', ms: 'Pusat berpantang / penjagaan selepas bersalin' } },
        { id: 'breastfeeding', limit: 1_000, label: { zh: '哺乳设备（2 岁以下孩子）', en: 'Breastfeeding equipment (child ≤2)', ms: 'Peralatan penyusuan susu ibu (anak ≤2 tahun)' } },
      ],
      note: { zh: '改名为「健康与福祉」：新增月子/产后护理（RM3,000），哺乳设备并入。', en: 'Renamed "Health & Well-being": adds postnatal care (RM3,000); breastfeeding equipment merged in.', ms: 'Dinamakan semula "Kesihatan & Kesejahteraan": ditambah penjagaan selepas bersalin (RM3,000); peralatan penyusuan digabungkan.' },
    },
    {
      id: 'lifestyle',
      kind: 'amount',
      limit: 2_500,
      note: { zh: '新增 AI 软件订阅、领养宠物、兽医疫苗与绝育；课程费移到教育减免。', en: 'Adds AI subscriptions, pet adoption, vet vaccination & neutering; course fees move to education relief.', ms: 'Ditambah langganan AI, pengambilan haiwan peliharaan, vaksinasi dan pemandulan oleh doktor haiwan; yuran kursus dipindahkan ke pelepasan pendidikan.' },
    },
    {
      id: 'sports',
      kind: 'amount',
      limit: 1_000,
      note: { zh: '新增运动鞋（上限 RM300）。', en: 'Adds sports shoes (up to RM300).', ms: 'Ditambah kasut sukan (sehingga RM300).' },
    },
    keep('childcare'),
    keep('sspn'),
    keep('epf'),
    keep('lifeInsurance'),
    keep('prs'),
    keep('eduMedInsurance'),
    keep('socso'),
    {
      id: 'socsoVoluntary',
      kind: 'amount',
      limit: 150,
      note: { zh: '新增：自愿缴纳 LINDUNG 24 / 非强制 LINDUNG KENDIRI 额外 RM150。', en: 'New: extra RM150 for voluntary LINDUNG 24 / non-mandatory LINDUNG KENDIRI.', ms: 'Baharu: tambahan RM150 bagi caruman sukarela LINDUNG 24 / LINDUNG KENDIRI bukan wajib.' },
    },
    keep('evCharging'),
    keep('homeLoan500'),
    keep('homeLoan750'),
    {
      id: 'tourism',
      kind: 'amount',
      limit: 1_000,
      note: { zh: '延长一年至 YA2027。', en: 'Extended for one more year to YA2027.', ms: 'Dilanjutkan setahun lagi hingga YA2027.' },
    },
  ],
  sources: [
    { title: 'Budget 2027 Tax Measures (MOF), Appendices 1–9', url: 'https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/tax-measures.pdf' },
  ],
};
