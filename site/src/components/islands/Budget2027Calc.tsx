import { useMemo, useState } from 'preact/hooks';
import { YA2026 } from '../../data/ya2026';
import { YA2027 } from '../../data/ya2027';
import { rm } from '../../lib/format';
import { compareYears } from '../../lib/tax/compare';
import type { Lang } from '../../lib/tax/types';
import { t } from '../../i18n/ui';
import { tri } from '../../i18n/tri';
import { renderShareCard, shareOrDownload } from './shareImage';
import { MoneyInput, Row, Stepper, usePersisted } from './ui';

interface Props {
  lang: Lang;
  host: string;
  brand: string;
  fullCalcHref: string;
  plannerHref: string;
}

export default function Budget2027Calc({ lang, host, brand, fullCalcHref, plannerHref }: Props) {
  const L = tri(lang);
  const [s, setS] = usePersisted('mtl.budget2027', { monthly: 5_000, bonusMonths: 1, otherReliefs: 0 });
  const [busy, setBusy] = useState(false);
  const r = useMemo(() => compareYears(YA2026, YA2027, s), [s.monthly, s.bonusMonths, s.otherReliefs]);
  const maxTax = Math.max(r.before.tax, 1);

  async function share() {
    setBusy(true);
    try {
      const blob = await renderShareCard({
        brand,
        kicker: L('2027 年财政预算案', 'Malaysia Budget 2027', 'Bajet 2027 Malaysia'),
        headline: L('我每年可以少交', 'My income tax goes down by', 'Cukai pendapatan saya turun'),
        big: rm(r.saving),
        sub: L(`相当于每月多 ${rm(r.monthlySaving)} · YA2027 起生效`, `That’s ${rm(r.monthlySaving)} a month · from YA2027`, `Bersamaan ${rm(r.monthlySaving)} sebulan · mulai YA2027`),
        footer: L(`算算你能省多少 → ${host}`, `Check yours → ${host}`, `Kira jimat anda → ${host}`),
      });
      if (blob) await shareOrDownload(blob, 'budget-2027-tax-saving.png', L('2027 预算案省税', 'Budget 2027 tax saving', 'Penjimatan cukai Bajet 2027'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div class="grid gap-6 md:grid-cols-5">
      <div class="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
        <MoneyInput id="b27-monthly" label={t(lang, 'calc.monthlySalary')} value={s.monthly} onChange={(v) => setS((p) => ({ ...p, monthly: v }))} />
        <Stepper
          id="b27-bonus"
          label={t(lang, 'calc.bonusMonths')}
          value={s.bonusMonths}
          onChange={(v) => setS((p) => ({ ...p, bonusMonths: v }))}
          step={0.5}
          max={12}
        />
        <MoneyInput
          id="b27-other"
          label={t(lang, 'calc.otherReliefs')}
          value={s.otherReliefs}
          onChange={(v) => setS((p) => ({ ...p, otherReliefs: v }))}
          hint={t(lang, 'calc.otherReliefsHint')}
        />
        <p class="text-xs text-slate-500 leading-relaxed">
          {L(
            '已自动计入：个人减免、EPF（11%，上限 RM4,000）、SOCSO + EIS（上限 RM350）。',
            'Already included: individual relief, EPF (11%, capped at RM4,000), SOCSO + EIS (capped at RM350).',
            'Sudah dikira: pelepasan individu, KWSP (11%, had RM4,000), PERKESO + SIP (had RM350).',
          )}
        </p>
      </div>

      <div class="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-5" aria-live="polite">
        {r.before.tax === 0 ? (
          <div class="rounded-xl bg-slate-50 p-5">
            <p class="text-lg font-semibold text-slate-900">{t(lang, 'calc.alreadyZero')}</p>
            <p class="text-sm text-slate-600 mt-1">
              {L('扣除减免和 RM400 回扣后，你的 YA2026 税额已经是 0。', 'After reliefs and the RM400 rebate your YA2026 tax is already zero.', 'Selepas pelepasan dan rebat RM400, cukai YA2026 anda sudah sifar.')}
            </p>
          </div>
        ) : (
          <div class="rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-500 text-white p-5">
            <p class="text-sm text-emerald-100">{L('2027 预算案后，你每年少交', 'After Budget 2027 you pay less by', 'Selepas Bajet 2027, cukai anda berkurang')}</p>
            <p class="text-5xl font-extrabold tracking-tight mt-1 num text-yellow-300">{rm(r.saving)}</p>
            <p class="text-sm text-emerald-50 mt-2">
              {t(lang, 'calc.youSaveMonthly')} <span class="font-semibold num">{rm(r.monthlySaving)}</span>
              {r.before.tax > 0 && (
                <span>
                  {' · '}
                  {L('税额减少', 'tax down', 'cukai turun')} {((r.saving / r.before.tax) * 100).toFixed(1)}%
                </span>
              )}
            </p>
          </div>
        )}

        <div class="mt-5 space-y-3">
          {[
            { label: t(lang, 'calc.taxYA2026'), v: r.before.tax, color: 'bg-slate-400' },
            { label: `${t(lang, 'calc.taxYA2027')} (${t(lang, 'common.proposed')})`, v: r.after.tax, color: 'bg-emerald-500' },
          ].map((b) => (
            <div key={b.label}>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-slate-600">{b.label}</span>
                <span class="font-semibold num">{rm(b.v, true)}</span>
              </div>
              <div class="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div class={`h-full ${b.color} rounded-full transition-all`} style={{ width: `${(b.v / maxTax) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div class="mt-5 text-sm border-t border-slate-100 pt-3">
          <Row label={t(lang, 'calc.annualIncome')} value={rm(r.before.income)} />
          <Row label={`${t(lang, 'calc.chargeable')} YA2026 → YA2027`} value={`${rm(r.before.chargeable)} → ${rm(r.after.chargeable)}`} />
          <Row label={`${t(lang, 'calc.marginalRate')} YA2026 → YA2027`} value={`${r.before.marginalRate}% → ${r.after.marginalRate}%`} />
        </div>

        <div class="mt-5 flex flex-wrap gap-3">
          {r.saving > 0 && (
            <button
              type="button"
              onClick={share}
              disabled={busy}
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
            >
              {busy ? '…' : t(lang, 'calc.share')}
            </button>
          )}
          <a href={fullCalcHref} class="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50">
            {L('用完整计算器算', 'Use the full calculator', 'Guna kalkulator penuh')}
          </a>
          <a href={plannerHref} class="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50">
            {L('今年还能怎么省？', 'Save more this year', 'Jimat lagi tahun ini')}
          </a>
        </div>
        <p class="text-xs text-slate-500 mt-4">
          {L(
            'YA2027 税率与 RM12,000 个人减免为 2027 年预算案提议，须待国会通过《2026 年财政法案》后才生效。',
            'YA2027 rates and the RM12,000 relief are Budget 2027 proposals and take effect only once the Finance Bill is passed.',
            'Kadar YA2027 dan pelepasan RM12,000 ialah cadangan Bajet 2027 dan hanya berkuat kuasa selepas Rang Undang-Undang Kewangan diluluskan.',
          )}
        </p>
      </div>
    </div>
  );
}
