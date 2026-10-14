import { YA2026 } from '../../data/ya2026';
import { YA2027 } from '../../data/ya2027';
import { rm } from '../../lib/format';
import { salaryBreakdown } from '../../lib/tax/salary';
import type { Lang } from '../../lib/tax/types';
import { t } from '../../i18n/ui';
import { tri } from '../../i18n/tri';
import { Checkbox, MoneyInput, Row, Stepper, usePersisted } from './ui';

interface Props {
  lang: Lang;
  salaryPagesBase: string;
  initialMonthly?: number;
}

export default function SalaryCalc({ lang, salaryPagesBase, initialMonthly = 5_000 }: Props) {
  const L = tri(lang);
  const [s, setS] = usePersisted('mtl.salary', { monthly: initialMonthly, spouse: false, children: 0 });
  const opts = { spouseNoIncome: s.spouse, children: s.children };
  const b = salaryBreakdown(YA2026, s.monthly, opts);
  const b27 = salaryBreakdown(YA2027, s.monthly, opts);
  const nearest = Math.min(30_000, Math.max(1_500, Math.round(s.monthly / 500) * 500));

  return (
    <div class="grid gap-6 md:grid-cols-5 items-start">
      <div class="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <MoneyInput id="sc-monthly" label={L('月薪（税前）', 'Monthly salary (gross)', 'Gaji bulanan (kasar)')} value={s.monthly} onChange={(v) => setS((p) => ({ ...p, monthly: v }))} />
        <Checkbox id="sc-spouse" label={t(lang, 'calc.spouseNoIncome')} checked={s.spouse} onChange={(v) => setS((p) => ({ ...p, spouse: v }))} />
        <Stepper id="sc-children" label={t(lang, 'calc.children')} value={s.children} onChange={(v) => setS((p) => ({ ...p, children: Math.floor(v) }))} max={15} />
        <p class="text-xs text-slate-500">
          {L('按 60 岁以下马来西亚公民、EPF 11% 计算。', 'Malaysian citizen under 60, EPF at 11%.', 'Warganegara Malaysia bawah 60 tahun, KWSP 11%.')}
        </p>
      </div>
      <div class="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-5" aria-live="polite">
        <p class="text-sm text-slate-500">{t(lang, 'calc.netPay')}</p>
        <p class="text-4xl font-extrabold text-slate-900 num">{rm(b.net, true)}</p>
        <div class="mt-4 text-sm border-t border-slate-100 pt-3">
          <Row label={L('月薪', 'Gross salary', 'Gaji kasar')} value={rm(b.gross, true)} />
          <Row label={`${t(lang, 'calc.epf')} (11%)`} value={`− ${rm(b.epf, true)}`} />
          <Row label={t(lang, 'calc.socso')} value={`− ${rm(b.socso, true)}`} />
          <Row label={t(lang, 'calc.eis')} value={`− ${rm(b.eis, true)}`} />
          <Row label={t(lang, 'calc.pcb')} value={`− ${rm(b.pcb, true)}`} />
          <Row label={t(lang, 'calc.netPay')} value={rm(b.net, true)} strong />
        </div>
        <div class="mt-4 text-sm border-t border-slate-100 pt-3">
          <Row label={t(lang, 'calc.employerEpf')} value={rm(b.employerEpf, true)} muted />
          <Row label={t(lang, 'calc.employerSocso')} value={rm(b.employerSocso, true)} muted />
          <Row label={t(lang, 'calc.employerEis')} value={rm(b.employerEis, true)} muted />
          <Row label={t(lang, 'calc.employerCost')} value={rm(b.employerCost, true)} />
        </div>
        {b27.pcb < b.pcb && (
          <p class="mt-4 text-sm rounded-lg bg-emerald-50 text-emerald-800 p-3">
            {L(
              `2027 年预算案通过后，PCB 预计每月减少 ${rm(b.pcb - b27.pcb, true)}，到手变成 ${rm(b27.net, true)}。`,
              `If Budget 2027 passes, PCB should drop by about ${rm(b.pcb - b27.pcb, true)} a month — take-home ${rm(b27.net, true)}.`,
              `Jika Bajet 2027 diluluskan, PCB dijangka turun kira-kira ${rm(b.pcb - b27.pcb, true)} sebulan — gaji bersih ${rm(b27.net, true)}.`,
            )}
          </p>
        )}
        <a href={`${salaryPagesBase}rm${nearest}/`} class="inline-block mt-4 text-sm text-emerald-700 underline">
          {L(
            `看月薪 RM${nearest.toLocaleString('en-MY')} 的完整分析 →`,
            `Full breakdown for RM${nearest.toLocaleString('en-MY')} a month →`,
            `Butiran penuh untuk gaji RM${nearest.toLocaleString('en-MY')} sebulan →`,
          )}
        </a>
      </div>
    </div>
  );
}
