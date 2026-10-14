import type { L10n } from '../lib/tax/types';

export type ReliefGroup = 'personal' | 'family' | 'parents' | 'health' | 'education' | 'lifestyle' | 'savings' | 'home';

export type L10nList = { zh: string[]; en: string[]; ms: string[] };

export interface ReliefMeta {
  id: string;
  group: ReliefGroup;
  name: L10n;
  /** One line: what it covers. */
  short: L10n;
  /** Detail page slug; reliefs sharing a slug are shown on one page. */
  slug: string;
  /** Money can still be spent before 31 Dec to use this relief. */
  yearEnd?: boolean;
  /** Who / what qualifies. */
  covers: L10nList;
  /** Practical tips and gotchas. */
  tips: L10nList;
  /** Records to keep (LHDN can ask for them for 7 years). */
  docs: L10n;
}

export const GROUP_NAMES: Record<ReliefGroup, L10n> = {
  personal: { zh: '个人', en: 'Personal', ms: 'Individu' },
  family: { zh: '配偶与孩子', en: 'Spouse & children', ms: 'Pasangan & anak' },
  parents: { zh: '父母', en: 'Parents', ms: 'Ibu bapa' },
  health: { zh: '医药与健康', en: 'Medical & health', ms: 'Perubatan & kesihatan' },
  education: { zh: '教育', en: 'Education', ms: 'Pendidikan' },
  lifestyle: { zh: '生活与消费', en: 'Lifestyle & spending', ms: 'Gaya hidup & perbelanjaan' },
  savings: { zh: '储蓄、公积金与保险', en: 'Savings, EPF & insurance', ms: 'Simpanan, KWSP & insurans' },
  home: { zh: '首购房贷', en: 'First home loan', ms: 'Pinjaman rumah pertama' },
};

export const RELIEF_META: ReliefMeta[] = [
  {
    id: 'self',
    group: 'personal',
    slug: 'individual',
    name: { zh: '个人减免', en: 'Individual relief', ms: 'Pelepasan individu' },
    short: { zh: '每个税务居民自动享有，不需要任何单据。', en: 'Automatic for every tax resident — no receipts needed.', ms: 'Automatik untuk setiap pemastautin cukai — tiada resit diperlukan.' },
    covers: {
      zh: [
        '所有马来西亚税务居民（一年在马来西亚住满 182 天）。',
        'YA2026 为 RM9,000；2027 年预算案提议从 YA2027 起提高到 RM12,000。',
      ],
      en: [
        'Every Malaysian tax resident (in Malaysia 182 days or more in the year).',
        'RM9,000 for YA2026; Budget 2027 proposes RM12,000 from YA2027.',
      ],
      ms: [
        'Setiap pemastautin cukai Malaysia (berada di Malaysia 182 hari atau lebih dalam setahun).',
        'RM9,000 untuk YA2026; Bajet 2027 mencadangkan RM12,000 mulai YA2027.',
      ],
    },
    tips: {
      zh: [
        '报税时系统会自动帮你填上，不需要另外申请。',
        '非税务居民不享有任何减免，并按 30% 固定税率计税。',
      ],
      en: [
        'e-Filing fills it in for you — nothing to apply for.',
        'Non-residents get no reliefs and pay a flat 30%.',
      ],
      ms: [
        'e-Filing mengisinya secara automatik — tiada apa-apa perlu dimohon.',
        'Bukan pemastautin tidak mendapat sebarang pelepasan dan dikenakan kadar rata 30%.',
      ],
    },
    docs: { zh: '不需要。', en: 'None.', ms: 'Tiada.' },
  },
  {
    id: 'disabledSelf',
    group: 'personal',
    slug: 'disabled',
    name: { zh: '残障人士额外减免', en: 'Disabled individual', ms: 'Individu kurang upaya (OKU)' },
    short: { zh: '本人已在社会福利局（JKM）登记为 OKU，额外 RM7,000。', en: 'Extra RM7,000 if you are registered as OKU with JKM.', ms: 'Tambahan RM7,000 jika anda berdaftar sebagai OKU dengan JKM.' },
    covers: {
      zh: [
        '持有社会福利局（JKM）OKU 卡的纳税人。',
      ],
      en: [
        'Taxpayers certified as disabled (OKU card) by the Department of Social Welfare (JKM).',
      ],
      ms: [
        'Pembayar cukai yang disahkan OKU (kad OKU) oleh Jabatan Kebajikan Masyarakat (JKM).',
      ],
    },
    tips: {
      zh: [
        '和个人减免叠加：YA2026 合计 RM16,000。',
      ],
      en: [
        'Stacks on top of the individual relief: RM16,000 in total for YA2026.',
      ],
      ms: [
        'Ditambah di atas pelepasan individu: jumlah RM16,000 untuk YA2026.',
      ],
    },
    docs: { zh: 'JKM 发出的 OKU 卡或证明。', en: 'OKU card or JKM certification.', ms: 'Kad OKU atau pengesahan JKM.' },
  },
  {
    id: 'disabledEquipment',
    group: 'health',
    slug: 'disabled',
    yearEnd: true,
    name: { zh: '残障辅助器材', en: 'Supporting equipment for the disabled', ms: 'Peralatan sokongan OKU' },
    short: { zh: '为残障的本人、配偶、孩子或父母购买辅助器材，最高 RM6,000。', en: 'Up to RM6,000 for equipment for a disabled self, spouse, child or parent.', ms: 'Sehingga RM6,000 untuk peralatan bagi diri, pasangan, anak atau ibu bapa yang OKU.' },
    covers: {
      zh: [
        '轮椅、助听器、人工义肢、血液透析机、拐杖等基本辅助器材。',
        '使用者可以是本人、配偶、孩子或父母。',
      ],
      en: [
        'Wheelchairs, hearing aids, artificial limbs, haemodialysis machines, crutches and other basic supporting equipment.',
        'For yourself, your spouse, child or parent.',
      ],
      ms: [
        'Kerusi roda, alat bantuan pendengaran, anggota palsu, mesin hemodialisis, tongkat dan peralatan sokongan asas lain.',
        'Untuk diri sendiri, pasangan, anak atau ibu bapa.',
      ],
    },
    tips: {
      zh: [
        '眼镜和隐形眼镜不算。',
      ],
      en: [
        'Spectacles and contact lenses do not count.',
      ],
      ms: [
        'Cermin mata dan kanta lekap tidak termasuk.',
      ],
    },
    docs: { zh: '收据、使用者的 OKU 证明。', en: 'Receipts and the user’s OKU certification.', ms: 'Resit dan pengesahan OKU pengguna.' },
  },
  {
    id: 'spouse',
    group: 'family',
    slug: 'spouse',
    name: { zh: '配偶减免 / 赡养费', en: 'Spouse relief / alimony', ms: 'Pelepasan pasangan / alimoni' },
    short: { zh: '配偶没有收入或选择联合报税，或付给前妻的赡养费，最高 RM4,000。', en: 'Up to RM4,000 if your spouse has no income or elects joint assessment, or for alimony to a former wife.', ms: 'Sehingga RM4,000 jika pasangan tiada pendapatan atau memilih taksiran bersama, atau untuk bayaran alimoni kepada bekas isteri.' },
    covers: {
      zh: [
        '配偶全年没有收入，或选择与你联合报税（joint assessment）。',
        '付给前妻的赡养费（按正式协议或法庭判令），与配偶减免合计最高 RM4,000。',
      ],
      en: [
        'Your spouse had no income for the year, or elected joint assessment with you.',
        'Alimony paid to a former wife under a formal agreement or court order — combined cap RM4,000.',
      ],
      ms: [
        'Pasangan anda tiada pendapatan sepanjang tahun, atau memilih taksiran bersama dengan anda.',
        'Bayaran alimoni kepada bekas isteri mengikut perjanjian rasmi atau perintah mahkamah — had gabungan RM4,000.',
      ],
    },
    tips: {
      zh: [
        '配偶没有收入时，如果你的应课税收入不超过 RM35,000，还可以多拿一份 RM400 回扣。',
        '配偶收入很低时，可以比较「分开报税」和「联合报税」哪个更省。',
      ],
      en: [
        'With a non-earning spouse and chargeable income of RM35,000 or less, you also get a second RM400 rebate.',
        'If your spouse earns a little, compare separate vs joint assessment.',
      ],
      ms: [
        'Jika pasangan tiada pendapatan dan pendapatan bercukai anda RM35,000 atau kurang, anda juga mendapat rebat RM400 kedua.',
        'Jika pasangan berpendapatan sedikit, bandingkan taksiran berasingan dengan taksiran bersama.',
      ],
    },
    docs: { zh: '结婚证书；赡养费需要协议或法庭判令和付款记录。', en: 'Marriage certificate; for alimony, the agreement or court order and payment proof.', ms: 'Sijil nikah; untuk alimoni, perjanjian atau perintah mahkamah dan bukti bayaran.' },
  },
  {
    id: 'disabledSpouse',
    group: 'family',
    slug: 'disabled',
    name: { zh: '残障配偶额外减免', en: 'Disabled spouse', ms: 'Pasangan OKU' },
    short: { zh: '配偶是 OKU，在配偶减免之外再加 RM6,000。', en: 'Extra RM6,000 on top of spouse relief if your spouse is OKU.', ms: 'Tambahan RM6,000 di atas pelepasan pasangan jika pasangan anda OKU.' },
    covers: {
      zh: [
        '配偶持有 JKM 的 OKU 证明。',
      ],
      en: [
        'Spouse certified as disabled by JKM.',
      ],
      ms: [
        'Pasangan yang disahkan OKU oleh JKM.',
      ],
    },
    tips: {
      zh: [
        '需要同时符合配偶减免的条件。',
      ],
      en: [
        'You must also qualify for the spouse relief.',
      ],
      ms: [
        'Anda juga mesti layak untuk pelepasan pasangan.',
      ],
    },
    docs: { zh: '配偶的 OKU 证明、结婚证书。', en: 'Spouse’s OKU card, marriage certificate.', ms: 'Kad OKU pasangan, sijil nikah.' },
  },
  {
    id: 'childUnder18',
    group: 'family',
    slug: 'children',
    name: { zh: '18 岁以下孩子', en: 'Child under 18', ms: 'Anak bawah 18 tahun' },
    short: { zh: '每个未婚、18 岁以下的孩子 RM2,000。', en: 'RM2,000 for each unmarried child under 18.', ms: 'RM2,000 bagi setiap anak belum berkahwin di bawah 18 tahun.' },
    covers: {
      zh: [
        '亲生、继子女或合法领养的未婚孩子。',
      ],
      en: [
        'Unmarried biological, step or legally adopted children.',
      ],
      ms: [
        'Anak kandung, anak tiri atau anak angkat sah yang belum berkahwin.',
      ],
    },
    tips: {
      zh: [
        '离婚或分开报税时，同一个孩子只能由一方申报（或各报一半）。',
      ],
      en: [
        'When parents are separated or file separately, each child is claimed by one parent (or split).',
      ],
      ms: [
        'Jika ibu bapa berpisah atau difailkan berasingan, setiap anak dituntut oleh seorang sahaja (atau dibahagi dua).',
      ],
    },
    docs: { zh: '孩子的出生证明。', en: 'Child’s birth certificate.', ms: 'Sijil kelahiran anak.' },
  },
  {
    id: 'childPreU',
    group: 'family',
    slug: 'children',
    name: { zh: '18 岁以上孩子（预科 / A-Level）', en: 'Child 18+ in pre-university', ms: 'Anak 18 tahun ke atas (pra-universiti)' },
    short: { zh: '在国内读 A-Level、预科、matriculation 等的未婚孩子 RM2,000。', en: 'RM2,000 per unmarried child 18+ studying A-Level, foundation, matriculation etc.', ms: 'RM2,000 bagi setiap anak belum berkahwin 18 tahun ke atas yang belajar A-Level, asasi, matrikulasi dan seumpamanya.' },
    covers: {
      zh: [
        '18 岁及以上、未婚、全日制就读 A-Level、证书、预科、matriculation 等课程。',
      ],
      en: [
        'Unmarried children aged 18+ in full-time A-Level, certificate, foundation or matriculation courses.',
      ],
      ms: [
        'Anak belum berkahwin berumur 18 tahun ke atas yang belajar sepenuh masa di peringkat A-Level, sijil, asasi atau matrikulasi.',
      ],
    },
    tips: {
      zh: [
        '升读文凭或学位后改报 RM8,000 那一项。',
      ],
      en: [
        'Once they move on to a diploma or degree, claim the RM8,000 relief instead.',
      ],
      ms: [
        'Apabila mereka meneruskan ke diploma atau ijazah, tuntut pelepasan RM8,000 pula.',
      ],
    },
    docs: { zh: '学校的在学证明。', en: 'Proof of enrolment.', ms: 'Surat pengesahan belajar.' },
  },
  {
    id: 'childHigherEd',
    group: 'family',
    slug: 'children',
    name: { zh: '18 岁以上孩子（大专 / 大学）', en: 'Child 18+ in higher education', ms: 'Anak 18 tahun ke atas (pengajian tinggi)' },
    short: { zh: '在国内读文凭以上、或在海外读学士以上的未婚孩子 RM8,000。', en: 'RM8,000 per unmarried child 18+ in a diploma+ in Malaysia or a degree+ overseas.', ms: 'RM8,000 bagi setiap anak belum berkahwin 18 tahun ke atas yang belajar diploma ke atas di Malaysia atau ijazah ke atas di luar negara.' },
    covers: {
      zh: [
        '国内：文凭（diploma）或以上（不含预科）。',
        '海外：学士学位或以上。',
        '课程和学校需获政府认可。',
      ],
      en: [
        'In Malaysia: diploma level or higher (not foundation).',
        'Overseas: bachelor’s degree or higher.',
        'Course and institution must be government-recognised.',
      ],
      ms: [
        'Di Malaysia: peringkat diploma atau lebih tinggi (bukan asasi).',
        'Di luar negara: ijazah sarjana muda atau lebih tinggi.',
        'Kursus dan institusi mesti diiktiraf kerajaan.',
      ],
    },
    tips: {
      zh: [
        '这是金额最大的孩子减免，记得每年都报。',
      ],
      en: [
        'The biggest child relief — remember to claim it every year they study.',
      ],
      ms: [
        'Ini pelepasan anak yang paling besar — jangan lupa tuntut setiap tahun mereka belajar.',
      ],
    },
    docs: { zh: '在学证明、学费单据。', en: 'Proof of enrolment and fee statements.', ms: 'Surat pengesahan belajar dan penyata yuran.' },
  },
  {
    id: 'childDisabled',
    group: 'family',
    slug: 'children',
    name: { zh: '残障孩子', en: 'Disabled child', ms: 'Anak OKU' },
    short: { zh: '每个残障孩子 RM8,000。', en: 'RM8,000 per disabled child.', ms: 'RM8,000 bagi setiap anak OKU.' },
    covers: {
      zh: [
        '持有 JKM OKU 证明的未婚孩子，不限年龄。',
      ],
      en: [
        'Unmarried children of any age certified as disabled by JKM.',
      ],
      ms: [
        'Anak belum berkahwin pada sebarang umur yang disahkan OKU oleh JKM.',
      ],
    },
    tips: {
      zh: [
        '如果残障孩子 18 岁以上并就读大专/大学，可报 RM16,000（见下一项）。',
      ],
      en: [
        'If the child is 18+ and in higher education, claim RM16,000 instead (next item).',
      ],
      ms: [
        'Jika anak berumur 18 tahun ke atas dan di pengajian tinggi, tuntut RM16,000 (item seterusnya).',
      ],
    },
    docs: { zh: '孩子的 OKU 证明。', en: 'Child’s OKU certification.', ms: 'Pengesahan OKU anak.' },
  },
  {
    id: 'childDisabledHigherEd',
    group: 'family',
    slug: 'children',
    name: { zh: '残障孩子就读大专 / 大学', en: 'Disabled child in higher education', ms: 'Anak OKU di pengajian tinggi' },
    short: { zh: '18 岁以上、就读文凭或学位的残障孩子 RM16,000。', en: 'RM16,000 for a disabled child 18+ in a diploma or degree.', ms: 'RM16,000 bagi anak OKU 18 tahun ke atas yang belajar diploma atau ijazah.' },
    covers: {
      zh: [
        'RM8,000 残障孩子减免 + RM8,000 高等教育减免。',
      ],
      en: [
        'RM8,000 disabled child relief plus RM8,000 higher-education relief.',
      ],
      ms: [
        'Pelepasan anak OKU RM8,000 ditambah pelepasan pengajian tinggi RM8,000.',
      ],
    },
    tips: {
      zh: [
        '选这一项就不要再重复报上面两项。',
      ],
      en: [
        'Do not also claim the two separate items above for the same child.',
      ],
      ms: [
        'Jangan tuntut dua item berasingan di atas untuk anak yang sama.',
      ],
    },
    docs: { zh: 'OKU 证明、在学证明。', en: 'OKU certification and proof of enrolment.', ms: 'Pengesahan OKU dan surat pengesahan belajar.' },
  },
  {
    id: 'childcare',
    group: 'family',
    slug: 'childcare',
    yearEnd: true,
    name: { zh: '托儿所 / 幼儿园学费', en: 'Childcare & kindergarten fees', ms: 'Yuran taska & tadika' },
    short: { zh: '孩子在注册托儿所、幼儿园或课后托管中心的费用，最高 RM3,000。', en: 'Up to RM3,000 for registered childcare, kindergarten or after-school centres.', ms: 'Sehingga RM3,000 untuk taska, tadika atau pusat jagaan selepas sekolah yang berdaftar.' },
    covers: {
      zh: [
        '6 岁及以下孩子：JKM 注册的托儿所（TASKA）或教育部注册的幼儿园（TADIKA）。',
        'YA2026 起：JKM 注册的日托或课后托管中心（12 岁及以下）。',
      ],
      en: [
        'Children 6 and below: TASKA registered with JKM or TADIKA registered with MOE.',
        'From YA2026: day-care or after-school transit centres registered with JKM (children up to 12).',
      ],
      ms: [
        'Anak 6 tahun ke bawah: TASKA berdaftar dengan JKM atau TADIKA berdaftar dengan KPM.',
        'Mulai YA2026: pusat jagaan harian atau pusat transit selepas sekolah berdaftar dengan JKM (anak sehingga 12 tahun).',
      ],
    },
    tips: {
      zh: [
        '父母只能其中一方申报。',
        '先确认中心有 JKM / 教育部注册号码，没注册的不能扣。',
      ],
      en: [
        'Only one parent can claim.',
        'Check the centre’s JKM / MOE registration number — unregistered centres don’t qualify.',
      ],
      ms: [
        'Hanya seorang ibu atau bapa boleh menuntut.',
        'Semak nombor pendaftaran JKM / KPM pusat tersebut — pusat tidak berdaftar tidak layak.',
      ],
    },
    docs: { zh: '收据（列明中心注册号码）。', en: 'Receipts showing the centre’s registration number.', ms: 'Resit yang menunjukkan nombor pendaftaran pusat.' },
  },
  {
    id: 'sspn',
    group: 'family',
    slug: 'sspn',
    yearEnd: true,
    name: { zh: 'SSPN 教育储蓄', en: 'SSPN education savings', ms: 'Simpanan pendidikan SSPN' },
    short: { zh: '一年内存入 SSPN 的净额（存款减提款），最高 RM8,000，至 YA2027。', en: 'Net deposits into SSPN in the year (deposits minus withdrawals), up to RM8,000, until YA2027.', ms: 'Simpanan bersih ke dalam SSPN dalam tahun tersebut (simpanan tolak pengeluaran), sehingga RM8,000, hingga YA2027.' },
    covers: {
      zh: [
        '存入 PTPTN 国家教育储蓄计划（SSPN Prime / SSPN Plus）的净额。',
      ],
      en: [
        'Net deposits into PTPTN’s national education savings scheme (SSPN Prime / SSPN Plus).',
      ],
      ms: [
        'Simpanan bersih ke dalam Skim Simpanan Pendidikan Nasional PTPTN (SSPN Prime / SSPN Plus).',
      ],
    },
    tips: {
      zh: [
        '12 月底前存入就算今年的减免，钱还是你的，只是存起来给孩子读书。',
        '同一年先存后提，只能报净额。',
        'SSPN Plus 的保费部分不算储蓄。',
      ],
      en: [
        'Deposits made by 31 Dec count for this year — the money stays yours, saved for your child’s education.',
        'If you withdraw in the same year, only the net amount counts.',
        'The takaful portion of SSPN Plus is not a deposit.',
      ],
      ms: [
        'Simpanan sebelum 31 Disember dikira untuk tahun ini — wang tetap milik anda, disimpan untuk pendidikan anak.',
        'Jika anda mengeluarkan wang dalam tahun yang sama, hanya jumlah bersih dikira.',
        'Bahagian takaful SSPN Plus bukan simpanan.',
      ],
    },
    docs: { zh: 'SSPN 年度结单。', en: 'SSPN annual statement.', ms: 'Penyata tahunan SSPN.' },
  },
  {
    id: 'breastfeeding',
    group: 'family',
    slug: 'breastfeeding',
    yearEnd: true,
    name: { zh: '哺乳设备', en: 'Breastfeeding equipment', ms: 'Peralatan penyusuan susu ibu' },
    short: { zh: '购买哺乳设备（孩子 2 岁以下），最高 RM1,000，每两年一次。', en: 'Up to RM1,000 for breastfeeding equipment (child 2 and below), once every 2 years.', ms: 'Sehingga RM1,000 untuk peralatan penyusuan (anak 2 tahun ke bawah), sekali setiap 2 tahun.' },
    covers: {
      zh: [
        '吸奶器、冰袋、储奶袋、冷藏袋等。',
      ],
      en: [
        'Breast pumps, ice packs, milk storage bags, cooler bags and similar.',
      ],
      ms: [
        'Pam susu, pek ais, beg simpanan susu, beg penyejuk dan seumpamanya.',
      ],
    },
    tips: {
      zh: [
        'YA2026：只有女性纳税人可以报。',
        'YA2027 起提议并入「健康与福祉」减免，本人或配偶付款都可以。',
      ],
      en: [
        'YA2026: only women taxpayers can claim.',
        'From YA2027 it is proposed to merge into the Health & Well-being relief, claimable by either spouse.',
      ],
      ms: [
        'YA2026: hanya pembayar cukai wanita boleh menuntut.',
        'Mulai YA2027 dicadangkan digabungkan ke dalam pelepasan Kesihatan & Kesejahteraan, boleh dituntut oleh suami atau isteri.',
      ],
    },
    docs: { zh: '收据。', en: 'Receipts.', ms: 'Resit.' },
  },
  {
    id: 'parents',
    group: 'parents',
    slug: 'parents',
    yearEnd: true,
    name: { zh: '父母 / 祖父母医药与护理', en: 'Parents & grandparents: medical and care', ms: 'Ibu bapa & datuk nenek: perubatan dan penjagaan' },
    short: { zh: '为父母或祖父母支付的医药、牙科、护理费用，最高 RM8,000。', en: 'Up to RM8,000 for medical, dental and care expenses for parents or grandparents.', ms: 'Sehingga RM8,000 untuk perbelanjaan perubatan, pergigian dan penjagaan ibu bapa atau datuk nenek.' },
    covers: {
      zh: [
        '在诊所和医院的治疗费。',
        '居家、日间护理中心、养老院的护理费。',
        '牙科治疗（不含美容）。',
        '全身体检和疫苗：子项上限 RM1,000。',
        'YA2027 起提议：护理费扩大到所有护理开支，不再需要医生证明。',
      ],
      en: [
        'Treatment at clinics and hospitals.',
        'Care at home, at day-care centres or residential care homes.',
        'Dental treatment (not cosmetic).',
        'Full medical check-ups and vaccinations: sub-limit RM1,000.',
        'Proposed from YA2027: care expenses cover all types of care, no doctor certification needed.',
      ],
      ms: [
        'Rawatan di klinik dan hospital.',
        'Penjagaan di rumah, pusat jagaan harian atau pusat jagaan kediaman.',
        'Rawatan pergigian (bukan kosmetik).',
        'Pemeriksaan perubatan penuh dan vaksinasi: had kecil RM1,000.',
        'Dicadangkan mulai YA2027: perbelanjaan penjagaan merangkumi semua jenis penjagaan, tanpa pengesahan doktor.',
      ],
    },
    tips: {
      zh: [
        '兄弟姐妹可以分摊，但每人只能报自己实际付的部分。',
        '年底前带父母做一次全身体检，最多可以扣 RM1,000。',
        '请看护时（不是你本人、配偶或孩子）要保留看护的书面声明或工作准证。',
      ],
      en: [
        'Siblings can share, but each claims only what they actually paid.',
        'A year-end full check-up for your parents uses up to RM1,000 of this relief.',
        'For a paid carer (not you, your spouse or child), keep the carer’s written declaration or work permit.',
      ],
      ms: [
        'Adik-beradik boleh berkongsi, tetapi setiap orang hanya menuntut apa yang dibayar sendiri.',
        'Pemeriksaan kesihatan penuh untuk ibu bapa sebelum hujung tahun boleh menggunakan sehingga RM1,000 daripada pelepasan ini.',
        'Untuk penjaga berbayar (bukan anda, pasangan atau anak), simpan akuan bertulis atau permit kerja penjaga.',
      ],
    },
    docs: { zh: '收据、医生证明（YA2026）、看护声明。', en: 'Receipts, doctor’s certification (YA2026), carer declaration.', ms: 'Resit, pengesahan doktor (YA2026), akuan penjaga.' },
  },
  {
    id: 'medical',
    group: 'health',
    slug: 'medical',
    yearEnd: true,
    name: { zh: '本人 / 配偶 / 孩子医药费', en: 'Medical expenses: self, spouse, child', ms: 'Perbelanjaan perubatan: diri, pasangan, anak' },
    short: { zh: '严重疾病、生育、疫苗、牙科、体检、学习障碍治疗等，最高 RM10,000。', en: 'Serious illness, fertility, vaccines, dental, check-ups, learning-disability care — up to RM10,000.', ms: 'Penyakit serius, kesuburan, vaksin, pergigian, pemeriksaan kesihatan, rawatan masalah pembelajaran — sehingga RM10,000.' },
    covers: {
      zh: [
        '严重疾病治疗（癌症、心脏病、肾衰竭、中风、帕金森、慢性肝病等）。',
        '本人或配偶的生育治疗。',
        '疫苗：子项上限 RM1,000（YA2026 起所有 NPRA 注册疫苗都算）。',
        '牙科检查与治疗：子项上限 RM1,000。',
        '全身体检、心理健康检查/咨询、疾病检测、自我健康监测设备：子项上限 RM1,000。',
        '18 岁以下学习障碍孩子（自闭症、ADHD、发育迟缓等）的诊断、早期干预与康复：YA2026 起上限 RM10,000。',
      ],
      en: [
        'Treatment of serious illnesses (cancer, heart disease, kidney failure, stroke, Parkinson’s, chronic liver disease, etc.).',
        'Fertility treatment for you or your spouse.',
        'Vaccinations: sub-limit RM1,000 (from YA2026 all NPRA-registered vaccines).',
        'Dental examination and treatment: sub-limit RM1,000.',
        'Full check-ups, mental-health checks/consultations, diagnostic tests and self-monitoring devices: sub-limit RM1,000.',
        'Diagnosis, early intervention and rehab for children ≤18 with learning disabilities (autism, ADHD, GDD…): up to RM10,000 from YA2026.',
      ],
      ms: [
        'Rawatan penyakit serius (kanser, sakit jantung, kegagalan buah pinggang, strok, Parkinson, penyakit hati kronik dan lain-lain).',
        'Rawatan kesuburan untuk anda atau pasangan.',
        'Vaksinasi: had kecil RM1,000 (mulai YA2026 semua vaksin berdaftar NPRA).',
        'Pemeriksaan dan rawatan pergigian: had kecil RM1,000.',
        'Pemeriksaan kesihatan penuh, pemeriksaan/konsultasi kesihatan mental, ujian diagnostik dan alat pemantauan kesihatan kendiri: had kecil RM1,000.',
        'Diagnosis, intervensi awal dan pemulihan untuk anak ≤18 tahun dengan masalah pembelajaran (autisme, ADHD, GDD…): sehingga RM10,000 mulai YA2026.',
      ],
    },
    tips: {
      zh: [
        '年底前一家人去打流感疫苗、洗牙、做体检，三个子项各 RM1,000，加起来可扣 RM3,000。',
        '血压计、血糖仪、体温计这类自我监测设备也算进体检子项。',
        'YA2027 起提议新增月子/产后护理（RM3,000），哺乳设备并入。',
      ],
      en: [
        'Before year-end: flu jabs, dental scaling and check-ups for the family — three RM1,000 sub-limits, RM3,000 in total.',
        'Blood-pressure monitors, glucose meters and thermometers count under the check-up sub-limit.',
        'Proposed from YA2027: adds postnatal / confinement care (RM3,000) and absorbs breastfeeding equipment.',
      ],
      ms: [
        'Sebelum hujung tahun: suntikan selesema, cuci gigi dan pemeriksaan kesihatan untuk keluarga — tiga had kecil RM1,000, jumlah RM3,000.',
        'Alat pengukur tekanan darah, glukometer dan termometer dikira di bawah had kecil pemeriksaan kesihatan.',
        'Dicadangkan mulai YA2027: ditambah penjagaan berpantang / selepas bersalin (RM3,000) dan peralatan penyusuan digabungkan.',
      ],
    },
    docs: { zh: '收据、医生证明（严重疾病）。', en: 'Receipts; doctor’s certification for serious illness.', ms: 'Resit; pengesahan doktor untuk penyakit serius.' },
  },
  {
    id: 'education',
    group: 'education',
    slug: 'education',
    yearEnd: true,
    name: { zh: '本人教育费', en: 'Education fees (self)', ms: 'Yuran pendidikan (diri sendiri)' },
    short: { zh: '本人修读认可课程或技能提升课程的学费，最高 RM7,000。', en: 'Up to RM7,000 for your own recognised courses or upskilling.', ms: 'Sehingga RM7,000 untuk kursus diiktiraf atau kursus peningkatan kemahiran anda sendiri.' },
    covers: {
      zh: [
        '硕士以下：在国内认可机构修读法律、会计、伊斯兰金融、技术、职业、工业、科学或科技领域的课程。',
        '硕士或博士：任何领域。',
        '技能提升课程（技能发展局 JPK 认可）：子项上限 RM2,000，至 YA2026。',
        'YA2027 起提议：任何领域的证书至博士都可扣；TVET 课程（本人或配偶）RM3,000；兴趣课和孩子的 STEM/艺术/语言/宗教补习 RM2,000。',
      ],
      en: [
        'Below Masters: courses in law, accounting, Islamic finance, technical, vocational, industrial, scientific or technology fields at recognised local institutions.',
        'Masters or PhD: any field.',
        'Upskilling courses recognised by the Department of Skills Development (JPK): sub-limit RM2,000, until YA2026.',
        'Proposed from YA2027: any field from certificate to PhD; TVET courses for self or spouse RM3,000; hobby classes and children’s STEM/arts/language/religion tuition RM2,000.',
      ],
      ms: [
        'Bawah peringkat Sarjana: kursus dalam bidang undang-undang, perakaunan, kewangan Islam, teknikal, vokasional, industri, saintifik atau teknologi di institusi tempatan yang diiktiraf.',
        'Sarjana atau PhD: apa-apa bidang.',
        'Kursus peningkatan kemahiran yang diiktiraf Jabatan Pembangunan Kemahiran (JPK): had kecil RM2,000, hingga YA2026.',
        'Dicadangkan mulai YA2027: apa-apa bidang dari sijil hingga PhD; kursus TVET untuk diri atau pasangan RM3,000; kelas hobi dan tuisyen STEM/seni/bahasa/agama untuk anak RM2,000.',
      ],
    },
    tips: {
      zh: [
        '只算本人的学费；孩子的大学学费不能报（孩子另有 RM8,000 孩子减免）。',
        '网上课程要确认是否为认可机构/JPK 认可。',
      ],
      en: [
        'Only your own fees count — your child’s university fees don’t (claim the RM8,000 child relief instead).',
        'For online courses, check they are from a recognised institution or JPK-recognised.',
      ],
      ms: [
        'Hanya yuran anda sendiri dikira — yuran universiti anak tidak termasuk (tuntut pelepasan anak RM8,000).',
        'Untuk kursus dalam talian, pastikan ia daripada institusi diiktiraf atau diiktiraf JPK.',
      ],
    },
    docs: { zh: '学费收据、录取或在学证明。', en: 'Fee receipts, offer letter or proof of enrolment.', ms: 'Resit yuran, surat tawaran atau surat pengesahan belajar.' },
  },
  {
    id: 'lifestyle',
    group: 'lifestyle',
    slug: 'lifestyle',
    yearEnd: true,
    name: { zh: '生活方式减免', en: 'Lifestyle relief', ms: 'Pelepasan gaya hidup' },
    short: { zh: '书、电脑、手机、平板、网络费、兴趣课程，最高 RM2,500。', en: 'Books, computers, phones, tablets, internet bills and hobby courses — up to RM2,500.', ms: 'Buku, komputer, telefon pintar, tablet, bil internet dan kursus hobi — sehingga RM2,500.' },
    covers: {
      zh: [
        '书籍、杂志、报纸（含电子书和电子报）。',
        '个人电脑、笔记本电脑、智能手机、平板电脑（非业务用途）。',
        '以本人名义付的网络费（手机数据和家里宽频都算）。',
        '技能提升或自我增值课程（兴趣、语言、宗教等，与工作无关）。',
        '可以是为本人、配偶或孩子购买。',
        'YA2027 起提议新增：AI 软件订阅、在注册收容所领养宠物、兽医疫苗与绝育；课程费改到教育减免。',
      ],
      en: [
        'Books, magazines and newspapers, including e-books and e-papers.',
        'Personal computers, laptops, smartphones and tablets (not for business).',
        'Internet subscriptions in your own name (mobile data and home broadband).',
        'Upskilling or self-enhancement courses unrelated to work (hobbies, languages, religion).',
        'Purchases for yourself, your spouse or children.',
        'Proposed from YA2027: AI software subscriptions, pet adoption from registered shelters, vet vaccination and neutering; course fees move to the education relief.',
      ],
      ms: [
        'Buku, majalah dan surat khabar, termasuk e-buku dan akhbar elektronik.',
        'Komputer peribadi, komputer riba, telefon pintar dan tablet (bukan untuk perniagaan).',
        'Langganan internet atas nama sendiri (data mudah alih dan jalur lebar rumah).',
        'Kursus peningkatan kemahiran atau pembangunan diri yang tiada kaitan dengan kerja (hobi, bahasa, agama).',
        'Pembelian untuk diri sendiri, pasangan atau anak.',
        'Dicadangkan mulai YA2027: langganan perisian AI, pengambilan haiwan peliharaan dari pusat perlindungan berdaftar, vaksinasi dan pemandulan oleh doktor haiwan; yuran kursus dipindahkan ke pelepasan pendidikan.',
      ],
    },
    tips: {
      zh: [
        '这是最容易用满的减免：一年的手机配套 + 宽频通常就有 RM1,000 以上。',
        '想换手机或电脑？在 12 月 31 日前买，今年就能扣。',
        '买东西时向商家要 e-Invoice（提供身份证号码），LHDN 正在试行用 e-Invoice 自动预填减免。',
      ],
      en: [
        'The easiest relief to max out: a year of phone plan plus broadband is often RM1,000+.',
        'Planning to upgrade your phone or laptop? Buy before 31 Dec to claim it this year.',
        'Ask for an e-Invoice (give your IC number) — LHDN is piloting pre-filled reliefs from e-Invoice data.',
      ],
      ms: [
        'Pelepasan paling mudah untuk digunakan sepenuhnya: pelan telefon dan jalur lebar setahun selalunya lebih RM1,000.',
        'Bercadang menukar telefon atau komputer riba? Beli sebelum 31 Disember untuk menuntutnya tahun ini.',
        'Minta e-Invois (berikan nombor kad pengenalan) — LHDN sedang merintis pengisian automatik pelepasan menggunakan data e-Invois.',
      ],
    },
    docs: { zh: '收据或 e-Invoice、网络账单。', en: 'Receipts or e-Invoices, internet bills.', ms: 'Resit atau e-Invois, bil internet.' },
  },
  {
    id: 'sports',
    group: 'lifestyle',
    slug: 'sports',
    yearEnd: true,
    name: { zh: '运动减免', en: 'Sports relief', ms: 'Pelepasan sukan' },
    short: { zh: '运动器材、场地费、健身房会员、比赛报名费，最高 RM1,000。', en: 'Sports equipment, facility fees, gym memberships, race entries — up to RM1,000.', ms: 'Peralatan sukan, sewa kemudahan sukan, keahlian gim, yuran pertandingan — sehingga RM1,000.' },
    covers: {
      zh: [
        '1997 年体育发展法令列出的运动所用的器材（不含电动/机动两轮车）。',
        '运动场地的租金或入场费（羽毛球场、游泳池等）。',
        '经体育委员会批准的比赛报名费（如马拉松）。',
        '健身房会员费、注册运动俱乐部的训练费。',
        '可以是为本人、配偶、孩子或父母支付。',
        'YA2027 起提议新增运动鞋（上限 RM300）。',
      ],
      en: [
        'Equipment for sports listed under the Sports Development Act 1997 (not motorised two-wheelers).',
        'Rental or entrance fees for sports facilities (badminton courts, pools…).',
        'Entry fees for competitions approved by the Commissioner of Sports (e.g. marathons).',
        'Gym memberships and training fees at registered sports clubs.',
        'For yourself, your spouse, children or parents.',
        'Proposed from YA2027: sports shoes (up to RM300).',
      ],
      ms: [
        'Peralatan untuk sukan yang disenaraikan di bawah Akta Pembangunan Sukan 1997 (bukan motosikal).',
        'Sewa atau yuran masuk kemudahan sukan (gelanggang badminton, kolam renang…).',
        'Yuran penyertaan pertandingan yang diluluskan Pesuruhjaya Sukan (contohnya maraton).',
        'Keahlian gim dan yuran latihan di kelab sukan berdaftar.',
        'Untuk diri sendiri, pasangan, anak atau ibu bapa.',
        'Dicadangkan mulai YA2027: kasut sukan (sehingga RM300).',
      ],
    },
    tips: {
      zh: [
        '和生活方式减免是分开的两个额度，可以同时用满。',
        '订场 App 记得保存收据。',
      ],
      en: [
        'Separate from the lifestyle relief — you can max out both.',
        'Keep receipts from court-booking apps.',
      ],
      ms: [
        'Berasingan daripada pelepasan gaya hidup — anda boleh gunakan kedua-duanya sepenuhnya.',
        'Simpan resit daripada aplikasi tempahan gelanggang.',
      ],
    },
    docs: { zh: '收据、会员合约。', en: 'Receipts, membership agreements.', ms: 'Resit, perjanjian keahlian.' },
  },
  {
    id: 'tourism',
    group: 'lifestyle',
    slug: 'tourism',
    yearEnd: true,
    name: { zh: '国内旅游景点门票', en: 'Domestic tourism entrance fees', ms: 'Yuran masuk tempat pelancongan domestik' },
    short: { zh: '博物馆、动物园、主题乐园、国家公园、文化艺术节目的门票，最高 RM1,000。', en: 'Tickets to museums, zoos, theme parks, national parks and cultural shows — up to RM1,000.', ms: 'Tiket ke muzium, zoo, taman tema, taman negara dan persembahan budaya — sehingga RM1,000.' },
    covers: {
      zh: [
        '旅游景点门票：博物馆、动物园、主题乐园、国家公园、海洋公园、地质公园等。',
        '文化与艺术节目门票。',
        'YA2026 新增；2027 年预算案提议延长到 YA2027。',
      ],
      en: [
        'Entrance fees to tourist attractions: museums, zoos, theme parks, national parks, marine parks, geoparks.',
        'Tickets to cultural and arts programmes.',
        'New for YA2026; Budget 2027 proposes extending it to YA2027.',
      ],
      ms: [
        'Yuran masuk tempat tarikan pelancongan: muzium, zoo, taman tema, taman negara, taman laut, geopark.',
        'Tiket program kebudayaan dan kesenian.',
        'Baharu untuk YA2026; Bajet 2027 mencadangkan ia dilanjutkan ke YA2027.',
      ],
    },
    tips: {
      zh: [
        '年底假期去一趟主题乐园或看场表演，门票就能扣税。',
        '只算门票，不含住宿和交通。',
      ],
      en: [
        'A year-end theme-park trip or show can be claimed.',
        'Entrance fees only — not hotels or transport.',
      ],
      ms: [
        'Lawatan ke taman tema atau persembahan pada cuti hujung tahun boleh dituntut.',
        'Hanya yuran masuk — bukan hotel atau pengangkutan.',
      ],
    },
    docs: { zh: '门票收据或电子票。', en: 'Ticket receipts or e-tickets.', ms: 'Resit tiket atau e-tiket.' },
  },
  {
    id: 'evCharging',
    group: 'lifestyle',
    slug: 'ev-charging',
    yearEnd: true,
    name: { zh: '环保与居家安全', en: 'EV charging, composting & home CCTV', ms: 'Pengecas EV, pengkomposan & CCTV rumah' },
    short: { zh: '电动车充电设备、厨余堆肥机、厨余粉碎机、家用 CCTV，最高 RM2,500。', en: 'EV chargers, food composters, food waste grinders and home CCTV — up to RM2,500.', ms: 'Pengecas kenderaan elektrik, mesin kompos sisa makanan, pengisar sisa makanan dan CCTV rumah — sehingga RM2,500.' },
    covers: {
      zh: [
        '电动车充电设备的购买、租用、安装或订阅费（非业务用途），至 YA2027。',
        '家用厨余堆肥机（三年内限报一次）。',
        'YA2026–2027：厨余粉碎机、家用 CCTV（两年内限报一次）。',
      ],
      en: [
        'Purchase, rental, installation or subscription of EV charging facilities (not for business), until YA2027.',
        'Household food composting machines (once every 3 years).',
        'YA2026–2027: food waste grinders and home CCTV (once every 2 years).',
      ],
      ms: [
        'Pembelian, sewaan, pemasangan atau langganan kemudahan pengecasan EV (bukan untuk perniagaan), hingga YA2027.',
        'Mesin pengkomposan sisa makanan isi rumah (sekali dalam 3 tahun).',
        'YA2026–2027: pengisar sisa makanan dan CCTV rumah (sekali dalam 2 tahun).',
      ],
    },
    tips: {
      zh: [
        '想装家用 CCTV 的话，YA2026 和 YA2027 是可以扣税的窗口。',
      ],
      en: [
        'YA2026–2027 is the window to claim a home CCTV setup.',
      ],
      ms: [
        'YA2026–2027 ialah peluang untuk menuntut pemasangan CCTV rumah.',
      ],
    },
    docs: { zh: '收据、安装单据。', en: 'Receipts and installation invoices.', ms: 'Resit dan invois pemasangan.' },
  },
  {
    id: 'epf',
    group: 'savings',
    slug: 'epf',
    yearEnd: true,
    name: { zh: 'EPF 公积金', en: 'EPF contributions', ms: 'Caruman KWSP' },
    short: { zh: '强制或自愿缴纳的 EPF，最高 RM4,000。', en: 'Mandatory or voluntary EPF contributions — up to RM4,000.', ms: 'Caruman KWSP wajib atau sukarela — sehingga RM4,000.' },
    covers: {
      zh: [
        '员工 EPF 缴款（强制或自愿），或其他认可的退休基金。',
      ],
      en: [
        'Employee EPF contributions (mandatory or voluntary) or other approved schemes.',
      ],
      ms: [
        'Caruman pekerja kepada KWSP (wajib atau sukarela) atau skim lain yang diluluskan.',
      ],
    },
    tips: {
      zh: [
        '月薪约 RM3,000 以上的人，一年的强制 EPF 已经超过 RM4,000，这一项通常已经用满。',
        '自愿多存的 EPF 还可以放进人寿保险那一项（RM3,000 共用额度）。',
        '自雇或自由职业者可以通过 i-Saraan 自愿缴款来使用这项减免。',
      ],
      en: [
        'Earning above roughly RM3,000 a month? Your mandatory EPF already exceeds RM4,000 — this relief is usually full.',
        'Extra voluntary EPF can also go under the RM3,000 life-insurance relief.',
        'Self-employed or freelancers can use it through i-Saraan voluntary contributions.',
      ],
      ms: [
        'Gaji melebihi kira-kira RM3,000 sebulan? Caruman KWSP wajib anda sudah melebihi RM4,000 — pelepasan ini biasanya sudah penuh.',
        'Caruman KWSP sukarela tambahan juga boleh dimasukkan di bawah pelepasan insurans hayat RM3,000.',
        'Pekerja sendiri atau pekerja bebas boleh menggunakannya melalui caruman sukarela i-Saraan.',
      ],
    },
    docs: { zh: 'EPF 年度结单或薪资单。', en: 'EPF statement or payslips.', ms: 'Penyata KWSP atau slip gaji.' },
  },
  {
    id: 'lifeInsurance',
    group: 'savings',
    slug: 'life-insurance',
    yearEnd: true,
    name: { zh: '人寿保险 / 家庭回教保险', en: 'Life insurance / family takaful', ms: 'Insurans hayat / takaful keluarga' },
    short: { zh: '人寿保险保费或家庭回教保险供款，最高 RM3,000（可与自愿 EPF 共用）。', en: 'Life insurance premiums or family takaful contributions — up to RM3,000 (shared with voluntary EPF).', ms: 'Premium insurans hayat atau caruman takaful keluarga — sehingga RM3,000 (dikongsi dengan KWSP sukarela).' },
    covers: {
      zh: [
        '本人和配偶的人寿保险/家庭回教保险。',
        'YA2026 起：孩子的保单也可以扣（18 岁以下未婚、18 岁以上未婚且在读大专/大学、或残障孩子）。',
        '自愿额外缴纳的 EPF。',
      ],
      en: [
        'Life insurance / family takaful for yourself and your spouse.',
        'From YA2026: policies for children too (unmarried under 18; unmarried 18+ in tertiary education; or disabled).',
        'Voluntary EPF top-ups.',
      ],
      ms: [
        'Insurans hayat / takaful keluarga untuk diri sendiri dan pasangan.',
        'Mulai YA2026: polisi untuk anak juga (belum berkahwin bawah 18 tahun; belum berkahwin 18 tahun ke atas di pengajian tinggi; atau OKU).',
        'Caruman tambahan KWSP secara sukarela.',
      ],
    },
    tips: {
      zh: [
        '投资型保单只算保障部分的保费，看保险公司发的税务证明。',
      ],
      en: [
        'For investment-linked policies only the protection portion counts — check the insurer’s tax certificate.',
      ],
      ms: [
        'Untuk polisi berkaitan pelaburan, hanya bahagian perlindungan dikira — semak sijil cukai daripada syarikat insurans.',
      ],
    },
    docs: { zh: '保险公司发的年度保费证明。', en: 'Annual premium statement from the insurer.', ms: 'Penyata premium tahunan daripada syarikat insurans.' },
  },
  {
    id: 'prs',
    group: 'savings',
    slug: 'prs',
    yearEnd: true,
    name: { zh: 'PRS 私人退休计划', en: 'Private Retirement Scheme (PRS)', ms: 'Skim Persaraan Swasta (PRS)' },
    short: { zh: '投入 PRS 或递延年金，最高 RM3,000，至 YA2030。', en: 'Contributions to PRS or deferred annuities — up to RM3,000, until YA2030.', ms: 'Caruman PRS atau anuiti tertunda — sehingga RM3,000, hingga YA2030.' },
    covers: {
      zh: [
        '向证监会批准的 PRS 基金供款。',
        '递延年金保费。',
      ],
      en: [
        'Contributions to SC-approved PRS funds.',
        'Deferred annuity premiums.',
      ],
      ms: [
        'Caruman kepada dana PRS yang diluluskan Suruhanjaya Sekuriti.',
        'Premium anuiti tertunda.',
      ],
    },
    tips: {
      zh: [
        '年底省税最常用的一招：12 月 31 日前投入，按你的税率立刻省税（19% 税率省 RM570）。',
        '钱要到 55 岁才能完整提出（提早提取会被扣 8% 税），只放你确定长期不用的钱。',
        '很多 PRS 供应商每年会给首次开户的年轻人奖励金，记得比较。',
      ],
      en: [
        'The classic year-end move: contribute before 31 Dec and save at your marginal rate (RM570 at the 19% band).',
        'Money is locked until 55 (early withdrawal is taxed 8%) — only put in money you won’t need.',
        'Many PRS providers run sign-up incentives — compare before you pick.',
      ],
      ms: [
        'Cara klasik hujung tahun: carum sebelum 31 Disember dan jimat mengikut kadar marginal anda (RM570 pada kadar 19%).',
        'Wang dikunci hingga umur 55 tahun (pengeluaran awal dikenakan cukai 8%) — hanya gunakan wang yang anda tidak perlukan.',
        'Banyak penyedia PRS menawarkan insentif pendaftaran — bandingkan sebelum memilih.',
      ],
    },
    docs: { zh: 'PRS 供应商发的供款证明。', en: 'Contribution statement from the PRS provider.', ms: 'Penyata caruman daripada penyedia PRS.' },
  },
  {
    id: 'eduMedInsurance',
    group: 'savings',
    slug: 'education-medical-insurance',
    yearEnd: true,
    name: { zh: '教育与医药保险', en: 'Education & medical insurance', ms: 'Insurans pendidikan & perubatan' },
    short: { zh: '本人、配偶、孩子的医药卡/教育保险保费，最高 RM4,000。', en: 'Medical card and education insurance premiums for self, spouse and children — up to RM4,000.', ms: 'Premium kad perubatan dan insurans pendidikan untuk diri, pasangan dan anak — sehingga RM4,000.' },
    covers: {
      zh: [
        '医药保险（medical card）、教育保险。',
        '为本人、配偶或孩子投保。',
      ],
      en: [
        'Medical insurance (medical cards) and education insurance.',
        'For yourself, your spouse or children.',
      ],
      ms: [
        'Insurans perubatan (kad perubatan) dan insurans pendidikan.',
        'Untuk diri sendiri, pasangan atau anak.',
      ],
    },
    tips: {
      zh: [
        '和人寿保险是两个独立额度：人寿 RM3,000 + 医药/教育 RM4,000。',
      ],
      en: [
        'Separate from life insurance: RM3,000 life + RM4,000 medical/education.',
      ],
      ms: [
        'Berasingan daripada insurans hayat: RM3,000 hayat + RM4,000 perubatan/pendidikan.',
      ],
    },
    docs: { zh: '保险公司的年度保费证明。', en: 'Annual premium statement from the insurer.', ms: 'Penyata premium tahunan daripada syarikat insurans.' },
  },
  {
    id: 'socso',
    group: 'savings',
    slug: 'socso',
    name: { zh: 'SOCSO 与 EIS', en: 'SOCSO & EIS', ms: 'PERKESO & SIP' },
    short: { zh: '员工缴纳的 SOCSO（PERKESO）和 EIS，最高 RM350。', en: 'Employee SOCSO (PERKESO) and EIS contributions — up to RM350.', ms: 'Caruman pekerja PERKESO (SOCSO) dan SIP (EIS) — sehingga RM350.' },
    covers: {
      zh: [
        '薪资中扣的 SOCSO 和 EIS 员工部分。',
        'YA2027 起提议：涵盖强制性的 LINDUNG KENDIRI；自愿缴纳 LINDUNG 24 等再额外 RM150。',
      ],
      en: [
        'The employee share of SOCSO and EIS deducted from your salary.',
        'Proposed from YA2027: covers mandatory LINDUNG KENDIRI; an extra RM150 for voluntary LINDUNG 24 and similar.',
      ],
      ms: [
        'Bahagian pekerja bagi caruman PERKESO dan SIP yang dipotong daripada gaji.',
        'Dicadangkan mulai YA2027: merangkumi LINDUNG KENDIRI wajib; tambahan RM150 bagi LINDUNG 24 sukarela dan seumpamanya.',
      ],
    },
    tips: {
      zh: [
        '月薪 RM6,000 以上一年约扣 RM499，所以这项通常自动用满。',
      ],
      en: [
        'At RM6,000+ a month you pay about RM499 a year, so this is usually full automatically.',
      ],
      ms: [
        'Dengan gaji RM6,000 ke atas sebulan, anda membayar kira-kira RM499 setahun, jadi pelepasan ini biasanya penuh secara automatik.',
      ],
    },
    docs: { zh: '薪资单或 EA 表格。', en: 'Payslips or EA form.', ms: 'Slip gaji atau Borang EA.' },
  },
  {
    id: 'socsoVoluntary',
    group: 'savings',
    slug: 'socso',
    name: { zh: '自愿 SOCSO 计划（YA2027）', en: 'Voluntary SOCSO schemes (YA2027)', ms: 'Skim PERKESO sukarela (YA2027)' },
    short: { zh: '自愿缴纳 LINDUNG 24 或非强制 LINDUNG KENDIRI，额外 RM150。', en: 'Extra RM150 for voluntary LINDUNG 24 or non-mandatory LINDUNG KENDIRI.', ms: 'Tambahan RM150 bagi caruman sukarela LINDUNG 24 atau LINDUNG KENDIRI bukan wajib.' },
    covers: {
      zh: [
        '2027 年预算案提议的新减免。',
      ],
      en: [
        'New relief proposed in Budget 2027.',
      ],
      ms: [
        'Pelepasan baharu yang dicadangkan dalam Bajet 2027.',
      ],
    },
    tips: {
      zh: [
        '适合 Grab/外送骑士等零工工作者。',
      ],
      en: [
        'Aimed at gig workers such as e-hailing and delivery riders.',
      ],
      ms: [
        'Untuk pekerja gig seperti pemandu e-hailing dan penghantar makanan.',
      ],
    },
    docs: { zh: 'PERKESO 缴款记录。', en: 'PERKESO contribution records.', ms: 'Rekod caruman PERKESO.' },
  },
  {
    id: 'homeLoan500',
    group: 'home',
    slug: 'first-home-loan',
    name: { zh: '首购屋房贷利息（RM50 万以下）', en: 'First home loan interest (≤ RM500k)', ms: 'Faedah pinjaman rumah pertama (≤ RM500k)' },
    short: { zh: '首间住宅房价 RM50 万以下，房贷利息每年最高 RM7,000，连续 3 年。', en: 'First home priced up to RM500k: loan interest up to RM7,000 a year for 3 years.', ms: 'Rumah pertama berharga sehingga RM500k: faedah pinjaman sehingga RM7,000 setahun selama 3 tahun.' },
    covers: {
      zh: [
        '马来西亚公民购买第一间住宅。',
        '买卖合约（SPA）在 2025 年 1 月 1 日至 2027 年 12 月 31 日之间签署。',
        '从开始付利息的那一年起，连续 3 个课税年。',
      ],
      en: [
        'Malaysian citizens buying their first residential home.',
        'Sale & Purchase Agreement signed between 1 Jan 2025 and 31 Dec 2027.',
        'Three consecutive years of assessment from the first year interest is paid.',
      ],
      ms: [
        'Warganegara Malaysia yang membeli rumah kediaman pertama.',
        'Perjanjian Jual Beli (SPA) ditandatangani antara 1 Jan 2025 dan 31 Dis 2027.',
        'Tiga tahun taksiran berturut-turut bermula tahun pertama faedah dibayar.',
      ],
    },
    tips: {
      zh: [
        '夫妻联名的话，按各自承担的比例分摊。',
        '房子必须自住，不能出租。',
      ],
      en: [
        'Joint borrowers split it by their share.',
        'The home must not be rented out.',
      ],
      ms: [
        'Peminjam bersama membahagikannya mengikut bahagian masing-masing.',
        'Rumah tidak boleh disewakan.',
      ],
    },
    docs: { zh: 'SPA、贷款合约、银行的年度利息结单。', en: 'SPA, loan agreement, bank’s annual interest statement.', ms: 'SPA, perjanjian pinjaman, penyata faedah tahunan bank.' },
  },
  {
    id: 'homeLoan750',
    group: 'home',
    slug: 'first-home-loan',
    name: { zh: '首购屋房贷利息（RM50–75 万）', en: 'First home loan interest (RM500k–750k)', ms: 'Faedah pinjaman rumah pertama (RM500k–750k)' },
    short: { zh: '首间住宅房价 RM500,001–750,000，房贷利息每年最高 RM5,000，连续 3 年。', en: 'First home priced RM500,001–750,000: loan interest up to RM5,000 a year for 3 years.', ms: 'Rumah pertama berharga RM500,001–750,000: faedah pinjaman sehingga RM5,000 setahun selama 3 tahun.' },
    covers: {
      zh: [
        '条件同上，只是房价区间不同。',
      ],
      en: [
        'Same conditions as above, different price range.',
      ],
      ms: [
        'Syarat sama seperti di atas, cuma julat harga berbeza.',
      ],
    },
    tips: {
      zh: [
        '两档只能选一档。',
      ],
      en: [
        'You can only claim one of the two tiers.',
      ],
      ms: [
        'Anda hanya boleh menuntut satu daripada dua peringkat ini.',
      ],
    },
    docs: { zh: 'SPA、贷款合约、银行的年度利息结单。', en: 'SPA, loan agreement, bank’s annual interest statement.', ms: 'SPA, perjanjian pinjaman, penyata faedah tahunan bank.' },
  },
];

export const META_BY_ID = new Map(RELIEF_META.map((m) => [m.id, m]));

export function metaFor(id: string): ReliefMeta {
  const m = META_BY_ID.get(id);
  if (!m) throw new Error(`No meta for relief ${id}`);
  return m;
}

/** Unique detail-page slugs, in display order. */
export const RELIEF_SLUGS = [...new Set(RELIEF_META.map((m) => m.slug))];
