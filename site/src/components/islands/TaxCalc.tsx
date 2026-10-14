import { useMemo } from 'preact/hooks';
import { YA2026 } from '../../data/ya2026';
import { YA2027 } from '../../data/ya2027';
import { pct, rm } from '../../lib/format';
import { computeTax } from '../../lib/tax/compute';
import { eisEmployee, epfEmployee, socsoEmployee } from '../../lib/tax/salary';
import type { Claims, Lang, ReliefRule } from '../../lib/tax/types';
import { t } from '../../i18n/ui';
import { tri } from '../../i18n/tri';
import { Checkbox, MoneyInput, Row, Stepper, usePersisted } from './ui';

export interface MetaLite {
  id: string;
  group: string;
  name: string;
  short: string;
  slug: string;
}

interface Props {
  lang: Lang;
  meta: MetaLite[];
  groups: { id: string; name: string }[];
  reliefsBase: string;
  defaultYa?: 2026 | 2027;
}

interface State {
  ya: 2026 | 2027;
  monthly: number;
  bonusMonths: number;
  otherIncome: number;
  auto: boolean;
  claims: Claims;
  zakat: number;
  pcbPaid: number;
}

const RULES = { 2026: YA2026, 2027: YA2027 } as const;

export default function TaxCalc({ lang, meta, groups, reliefsBase, defaultYa = 2026 }: Props) {
  const L = tri(lang);
  const [s, setS] = usePersisted<State>('mtl.taxcalc', {
    ya: defaultYa,
    monthly: 5_000,
    bonusMonths: 1,
    otherIncome: 0,
    auto: true,
    claims: {},
    zakat: 0,
    pcbPaid: 0,
  });
  const rules = RULES[s.ya];
  const metaById = useMemo(() => new Map(meta.map((m) => [m.id, m])), [meta]);

  const income = s.monthly * (12 + s.bonusMonths) + s.otherIncome;
  const epfPaid = epfEmployee(s.monthly) * 12 + Math.ceil(s.monthly * s.bonusMonths * 0.11);
  const socsoPaid = Math.round((socsoEmployee(s.monthly) + eisEmployee(s.monthly)) * 12 * 100) / 100;
  const claims: Claims = s.auto ? { ...s.claims, epf: epfPaid, socso: socsoPaid } : s.claims;
  const result = useMemo(() => computeTax(rules, { income, claims, zakat: s.zakat }), [rules, income, JSON.stringify(claims), s.zakat]);
  const allowed = new Map(result.reliefs.map((r) => [r.id, r.allowed]));

  const setClaim = (key: string, v: number) => setS((p) => ({ ...p, claims: { ...p.claims, [key]: v } }));
  const diff = s.pcbPaid > 0 ? Math.round((s.pcbPaid - result.netTax) * 100) / 100 : null;

  function reliefField(rule: ReliefRule) {
    const m = metaById.get(rule.id);
    if (!m) return null;
    const name = (
      <a href={`${reliefsBase}${m.slug}/`} class="hover:text-emerald-700 hover:underline">
        {m.name}
      </a>
    );
    const used = allowed.get(rule.id) ?? 0;
    const status = (
      <>
        {t(lang, 'common.limit')} {rm(rule.limit)}
        {rule.kind === 'count' ? L(' / 人', ' each', ' seorang') : ''} · {L('已计', 'counted', 'dikira')} <b class="text-slate-700">{rm(used)}</b>
      </>
    );

    if (rule.id === 'self') {
      return <Row label={<span class="font-medium text-slate-800">{m.name}</span>} value={<span class="font-semibold">{rm(rule.limit)}</span>} />;
    }
    if (rule.kind === 'flag') {
      return <Checkbox id={`r-${rule.id}`} label={name} checked={Boolean(s.claims[rule.id])} onChange={(v) => setClaim(rule.id, v ? 1 : 0)} hint={`${m.short} ${rm(rule.limit)}`} />;
    }
    if (rule.kind === 'count') {
      return <Stepper id={`r-${rule.id}`} label={name} value={s.claims[rule.id] ?? 0} onChange={(v) => setClaim(rule.id, Math.floor(v))} hint={status} max={15} />;
    }
    if ((rule.id === 'epf' || rule.id === 'socso') && s.auto) {
      return <Row label={<span class="text-sm">{name}</span>} value={<span class="text-sm">{rm(used, true)} <span class="text-slate-400">({L('自动', 'auto', 'auto')})</span></span>} />;
    }
    if (rule.parts) {
      return (
        <details class="rounded-lg border border-slate-200 p-3 group">
          <summary class="cursor-pointer list-none flex justify-between gap-2">
            <span class="text-sm font-medium text-slate-800">{name}</span>
            <span class="text-xs text-slate-500 num shrink-0">
              {rm(used)} / {rm(rule.limit)} ▾
            </span>
          </summary>
          <div class="mt-3 space-y-3">
            {rule.parts.map((p) => (
              <MoneyInput
                key={p.id}
                id={`r-${rule.id}-${p.id}`}
                label={<span class="font-normal">{p.label[lang]}</span>}
                value={s.claims[`${rule.id}.${p.id}`] ?? 0}
                onChange={(v) => setClaim(`${rule.id}.${p.id}`, v)}
                hint={p.limit !== null ? `${t(lang, 'common.limit')} ${rm(p.limit)}` : undefined}
              />
            ))}
          </div>
        </details>
      );
    }
    return <MoneyInput id={`r-${rule.id}`} label={name} value={s.claims[rule.id] ?? 0} onChange={(v) => setClaim(rule.id, v)} hint={status} />;
  }

  return (
    <div class="grid gap-6 lg:grid-cols-5 items-start">
      <div class="lg:col-span-3 space-y-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div>
            <span class="block text-sm font-medium text-slate-700 mb-1">{t(lang, 'calc.year')}</span>
            <div class="inline-flex rounded-lg border border-slate-300 p-1 bg-slate-50">
              {([2026, 2027] as const).map((y) => (
                <button
                  type="button"
                  key={y}
                  onClick={() => setS((p) => ({ ...p, ya: y }))}
                  class={`px-4 py-1.5 rounded-md text-sm font-semibold ${s.ya === y ? 'bg-white shadow text-emerald-700' : 'text-slate-600'}`}
                >
                  YA{y}
                  {y === 2027 && <span class="ml-1 text-xs font-normal">({t(lang, 'common.proposed')})</span>}
                </button>
              ))}
            </div>
            <p class="text-xs text-slate-500 mt-1">
              {s.ya === 2026
                ? L('YA2026 = 2026 年的收入，2027 年 3–5 月报税。', 'YA2026 = income earned in 2026, filed Mar–May 2027.', 'YA2026 = pendapatan tahun 2026, difailkan Mac–Mei 2027.')
                : L(
                    'YA2027 = 2027 年的收入，2028 年报税（按 2027 年预算案提议计算）。',
                    'YA2027 = income earned in 2027, filed in 2028 (Budget 2027 proposals).',
                    'YA2027 = pendapatan tahun 2027, difailkan pada 2028 (cadangan Bajet 2027).',
                  )}
            </p>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <MoneyInput id="tc-monthly" label={t(lang, 'calc.monthlySalary')} value={s.monthly} onChange={(v) => setS((p) => ({ ...p, monthly: v }))} />
            <Stepper id="tc-bonus" label={t(lang, 'calc.bonusMonths')} value={s.bonusMonths} onChange={(v) => setS((p) => ({ ...p, bonusMonths: v }))} step={0.5} max={12} />
          </div>
          <MoneyInput
            id="tc-other"
            label={L('其他应课税收入（每年）', 'Other taxable income (per year)', 'Pendapatan bercukai lain (setahun)')}
            value={s.otherIncome}
            onChange={(v) => setS((p) => ({ ...p, otherIncome: v }))}
            hint={L('租金、兼职、佣金等。', 'Rental, side income, commissions, etc.', 'Sewa, pendapatan sampingan, komisen dan lain-lain.')}
          />
          <Checkbox
            id="tc-auto"
            label={L('按月薪自动计算 EPF 与 SOCSO/EIS 减免', 'Auto-calculate EPF and SOCSO/EIS from salary', 'Kira KWSP dan PERKESO/SIP secara automatik daripada gaji')}
            checked={s.auto}
            onChange={(v) => setS((p) => ({ ...p, auto: v }))}
            hint={L(`EPF ${rm(epfPaid)}、SOCSO+EIS ${rm(socsoPaid, true)}（每年）`, `EPF ${rm(epfPaid)}, SOCSO+EIS ${rm(socsoPaid, true)} a year`, `KWSP ${rm(epfPaid)}, PERKESO+SIP ${rm(socsoPaid, true)} setahun`)}
          />
        </div>

        {groups.map((g, gi) => {
          const groupRules = rules.reliefs.filter((r) => metaById.get(r.id)?.group === g.id);
          if (!groupRules.length) return null;
          const groupTotal = groupRules.reduce((sum, r) => sum + (allowed.get(r.id) ?? 0), 0);
          return (
            <details key={g.id} open={gi < 2} class="bg-white rounded-2xl border border-slate-200 p-5">
              <summary class="cursor-pointer list-none flex items-center justify-between">
                <span class="font-semibold text-slate-900">{g.name}</span>
                <span class="text-sm text-emerald-700 num">{rm(groupTotal)} ▾</span>
              </summary>
              <div class="mt-4 space-y-4">
                {groupRules.map((r) => (
                  <div key={r.id}>
                    {reliefField(r)}
                    {r.note && <p class="text-xs text-amber-700 mt-1">★ {r.note[lang]}</p>}
                  </div>
                ))}
              </div>
            </details>
          );
        })}

        <div class="bg-white rounded-2xl border border-slate-200 p-5 grid sm:grid-cols-2 gap-4">
          <MoneyInput id="tc-zakat" label={t(lang, 'calc.zakat')} value={s.zakat} onChange={(v) => setS((p) => ({ ...p, zakat: v }))} />
          <MoneyInput
            id="tc-pcb"
            label={L('今年已扣的 PCB（可选）', 'PCB already deducted (optional)', 'PCB yang sudah dipotong (pilihan)')}
            value={s.pcbPaid}
            onChange={(v) => setS((p) => ({ ...p, pcbPaid: v }))}
            hint={L('看 EA 表格或薪资单，算出会退税还是补税。', 'From your EA form or payslips — shows refund or balance.', 'Daripada Borang EA atau slip gaji — menunjukkan bayaran balik atau baki cukai.')}
          />
        </div>
        <button
          type="button"
          class="text-sm text-slate-500 underline"
          onClick={() => setS({ ...s, claims: {}, zakat: 0, pcbPaid: 0, otherIncome: 0 })}
        >
          {t(lang, 'calc.reset')}
        </button>
      </div>

      <aside id="tax-result" class="lg:col-span-2 lg:sticky lg:top-20 space-y-4 scroll-mt-20" aria-live="polite">
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <p class="text-sm text-slate-500">
            {t(lang, 'calc.netTax')} · YA{s.ya}
          </p>
          <p class="text-4xl font-extrabold text-slate-900 num mt-1">{rm(result.netTax, true)}</p>
          {diff !== null && (
            <p class={`mt-2 text-sm font-semibold ${diff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {diff >= 0
                ? L(`预计退税 ${rm(diff, true)}`, `Expected refund ${rm(diff, true)}`, `Jangkaan bayaran balik ${rm(diff, true)}`)
                : L(`预计要补税 ${rm(-diff, true)}`, `Expected balance to pay ${rm(-diff, true)}`, `Jangkaan baki cukai perlu dibayar ${rm(-diff, true)}`)}
            </p>
          )}
          <div class="mt-4 text-sm border-t border-slate-100 pt-3">
            <Row label={L('总收入', 'Total income', 'Jumlah pendapatan')} value={rm(result.income)} />
            <Row label={t(lang, 'calc.totalRelief')} value={`− ${rm(result.totalRelief)}`} />
            <Row label={t(lang, 'calc.chargeable')} value={rm(result.chargeable)} strong />
            <Row label={t(lang, 'calc.grossTax')} value={rm(result.grossTax, true)} />
            {result.rebate > 0 && <Row label={t(lang, 'calc.rebate')} value={`− ${rm(result.rebate, true)}`} />}
            {result.zakatRebate > 0 && <Row label={t(lang, 'calc.zakat')} value={`− ${rm(result.zakatRebate, true)}`} />}
            <Row label={t(lang, 'calc.netTax')} value={rm(result.netTax, true)} strong />
            <Row label={t(lang, 'calc.effectiveRate')} value={pct(result.effectiveRate, 2)} muted />
            <Row label={t(lang, 'calc.marginalRate')} value={`${result.marginalRate}%`} muted />
          </div>
          {result.bands.length > 0 && (
            <details class="mt-3">
              <summary class="cursor-pointer text-sm text-emerald-700">{t(lang, 'calc.bandBreakdown')}</summary>
              <table class="w-full text-xs mt-2 num">
                <thead>
                  <tr class="text-slate-500">
                    <th class="text-left font-medium py-1">{t(lang, 'calc.band')}</th>
                    <th class="text-right font-medium">{t(lang, 'calc.rate')}</th>
                    <th class="text-right font-medium">{t(lang, 'calc.tax')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.bands.map((b) => (
                    <tr key={b.from} class="border-t border-slate-100">
                      <td class="py-1">
                        {rm(b.from)} – {b.to === null ? '∞' : rm(b.to)}
                      </td>
                      <td class="text-right">{b.rate}%</td>
                      <td class="text-right">{rm(b.tax, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </div>
        <p class="text-xs text-slate-500 px-1">
          {L(
            '假设你是马来西亚税务居民、个人分开报税。结果为估算，实际以 LHDN 评估为准。',
            'Assumes a Malaysian tax resident filing separately. Estimate only — LHDN’s assessment is final.',
            'Andaian: pemastautin cukai Malaysia, taksiran berasingan. Anggaran sahaja — taksiran LHDN adalah muktamad.',
          )}
        </p>
      </aside>

      <a
        href="#tax-result"
        class="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.15)]"
      >
        <span class="text-sm text-slate-300">
          {t(lang, 'calc.netTax')} · YA{s.ya}
        </span>
        <span class="font-bold num">
          {rm(result.netTax, true)} <span class="text-emerald-400 text-sm font-normal">{L('明细 ↓', 'details ↓', 'butiran ↓')}</span>
        </span>
      </a>
    </div>
  );
}
