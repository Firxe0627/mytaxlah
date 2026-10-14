import { useMemo } from 'preact/hooks';
import { YA2026 } from '../../data/ya2026';
import { rm } from '../../lib/format';
import { planYearEnd, QUICK_MOVES, type PlanRow } from '../../lib/tax/planner';
import { eisEmployee, epfEmployee, socsoEmployee } from '../../lib/tax/salary';
import type { Claims, Lang, ReliefRule } from '../../lib/tax/types';
import { t } from '../../i18n/ui';
import type { MetaLite } from './TaxCalc';
import { Checkbox, MoneyInput, Stepper, usePersisted } from './ui';

interface Props {
  lang: Lang;
  /** Only reliefs that can still be acted on before 31 Dec. */
  meta: MetaLite[];
  reliefsBase: string;
  toolkitUrl?: string;
  toolkitPrice?: string;
}

interface State {
  monthly: number;
  bonusMonths: number;
  otherIncome: number;
  spouse: boolean;
  children: number;
  spent: Record<string, number>;
}

const rules = YA2026;
const CHILD_ONLY = new Set(['sspn', 'childcare', 'breastfeeding']);

/** Planner takes one total per relief; put it in the part without its own sub-limit. */
function claimKey(rule: ReliefRule): string {
  const open = rule.parts?.find((p) => p.limit === null);
  return open ? `${rule.id}.${open.id}` : rule.id;
}

function daysLeft(): number {
  const now = new Date();
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
}

const HOW: Record<string, { zh: string; en: string }> = {
  lifestyle: { zh: '换手机/电脑、付网络费、买书', en: 'New phone or laptop, internet bills, books' },
  sports: { zh: '运动器材、健身房、场地费', en: 'Sports gear, gym, court fees' },
  prs: { zh: '投入私人退休计划（钱还是你的）', en: 'Top up a PRS (the money stays yours)' },
  medical: { zh: '体检、打疫苗、看牙医（各 RM1,000）', en: 'Check-up, vaccines, dentist (RM1,000 each)' },
  tourism: { zh: '景点、主题乐园、表演门票', en: 'Attraction, theme park and show tickets' },
  parents: { zh: '带父母做全身体检', en: 'Full check-up for your parents' },
  sspn: { zh: '存进孩子的 SSPN', en: 'Deposit into your child’s SSPN' },
};

export default function YearEndPlanner({ lang, meta, reliefsBase, toolkitUrl, toolkitPrice }: Props) {
  const zh = lang === 'zh';
  const [s, setS] = usePersisted<State>('mtl.planner', { monthly: 6_000, bonusMonths: 1, otherIncome: 0, spouse: false, children: 0, spent: {} });
  const metaById = useMemo(() => new Map(meta.map((m) => [m.id, m])), [meta]);
  const quickIds = QUICK_MOVES.map((q) => q.id);
  const plannerRules = rules.reliefs
    .filter((r) => metaById.has(r.id) && r.kind === 'amount' && r.id !== 'epf' && r.id !== 'socso')
    .filter((r) => s.children > 0 || !CHILD_ONLY.has(r.id))
    .sort((a, b) => {
      const ia = quickIds.indexOf(a.id);
      const ib = quickIds.indexOf(b.id);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

  const income = s.monthly * (12 + s.bonusMonths) + s.otherIncome;
  const claims: Claims = {
    epf: epfEmployee(s.monthly) * 12 + Math.ceil(s.monthly * s.bonusMonths * 0.11),
    socso: (socsoEmployee(s.monthly) + eisEmployee(s.monthly)) * 12,
    spouse: s.spouse ? 1 : 0,
    childUnder18: s.children,
  };
  for (const r of plannerRules) claims[claimKey(r)] = s.spent[r.id] ?? 0;

  const plan = planYearEnd(
    rules,
    { income, claims },
    s.spent,
    plannerRules.map((r) => r.id),
    s.children > 0,
  );
  const days = daysLeft();

  const row = (h: PlanRow, i: number, quick: boolean) => {
    const m = metaById.get(h.id)!;
    const per100 = h.remaining > 0 ? (h.saving / h.remaining) * 100 : 0;
    return (
      <li key={h.id} class="bg-white rounded-2xl border border-slate-200 p-4 list-none">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-slate-900">
              {quick && <span class="text-emerald-600 mr-1.5">{i + 1}</span>}
              <a href={`${reliefsBase}${m.slug}/`} class="hover:underline">
                {m.name}
              </a>
            </p>
            <p class="text-sm text-slate-600 mt-1">{HOW[h.id]?.[lang] ?? m.short}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-lg font-bold text-emerald-700 num">{rm(h.saving)}</p>
            <p class="text-xs text-slate-500">{zh ? '可省' : 'saving'}</p>
          </div>
        </div>
        <p class="text-xs text-slate-500 mt-2 num">
          {zh ? `还可以用 ${rm(h.remaining)} · 每花 RM100 省 RM${per100.toFixed(0)}` : `${rm(h.remaining)} left · saves RM${per100.toFixed(0)} per RM100`}
        </p>
      </li>
    );
  };

  return (
    <div class="grid gap-6 lg:grid-cols-5 items-start">
      <div class="lg:col-span-2 lg:col-start-1 lg:row-start-1 space-y-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <p class="font-semibold text-slate-900">{zh ? '① 你的收入' : '① Your income'}</p>
          <MoneyInput id="ye-monthly" label={t(lang, 'calc.monthlySalary')} value={s.monthly} onChange={(v) => setS((p) => ({ ...p, monthly: v }))} />
          <Stepper id="ye-bonus" label={t(lang, 'calc.bonusMonths')} value={s.bonusMonths} onChange={(v) => setS((p) => ({ ...p, bonusMonths: v }))} step={0.5} max={12} />
          <MoneyInput
            id="ye-other"
            label={zh ? '其他应课税收入（每年）' : 'Other taxable income (per year)'}
            value={s.otherIncome}
            onChange={(v) => setS((p) => ({ ...p, otherIncome: v }))}
          />
          <Checkbox id="ye-spouse" label={t(lang, 'calc.spouseNoIncome')} checked={s.spouse} onChange={(v) => setS((p) => ({ ...p, spouse: v }))} />
          <Stepper id="ye-children" label={t(lang, 'calc.children')} value={s.children} onChange={(v) => setS((p) => ({ ...p, children: Math.floor(v) }))} max={15} />
        </div>
      </div>

      <div class="lg:col-span-2 lg:col-start-1 lg:row-start-2 order-last lg:order-none space-y-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <p class="font-semibold text-slate-900">{zh ? '② 今年已经花了 / 缴了多少？' : '② What have you already spent or paid this year?'}</p>
          <p class="text-xs text-slate-500 -mt-2">
            {zh ? '填了会更准；不确定就留 0，之后再回来改（会自动保存在你的浏览器）。' : 'More accurate if you fill it in. Not sure? Leave 0 and come back — it’s saved in your browser.'}
          </p>
          {plannerRules.map((r) => (
            <MoneyInput
              key={r.id}
              id={`ye-${r.id}`}
              label={metaById.get(r.id)!.name}
              value={s.spent[r.id] ?? 0}
              onChange={(v) => setS((p) => ({ ...p, spent: { ...p.spent, [r.id]: v } }))}
              hint={`${t(lang, 'common.limit')} ${rm(r.limit)}`}
            />
          ))}
        </div>
      </div>

      <div class="lg:col-span-3 lg:col-start-3 lg:row-start-1 lg:row-span-2 space-y-4" aria-live="polite">
        <div class="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-500 text-white p-5">
          <p class="text-sm text-emerald-100">
            {zh ? `距离 12 月 31 日还有 ${days} 天。做完下面这些常见操作，YA2026 可以少交` : `${days} days to 31 Dec. Do the common moves below and your YA2026 tax drops by`}
          </p>
          <p class="text-5xl font-extrabold mt-1 text-yellow-300 num">{rm(plan.quickTotal)}</p>
          <p class="text-sm text-emerald-50 mt-2">
            {zh ? '目前预计 YA2026 税额' : 'Current estimated YA2026 tax'} <b class="num">{rm(plan.currentTax, true)}</b> · {t(lang, 'calc.marginalRate')}{' '}
            <b>{plan.marginalRate}%</b>
          </p>
        </div>

        {plan.currentTax === 0 ? (
          <div class="bg-white rounded-2xl border border-slate-200 p-5 text-slate-700">
            {zh ? '你目前预计不用交税，不需要为了减免额外花钱。' : 'You are not expected to pay tax this year — no need to spend for reliefs.'}
          </div>
        ) : (
          <>
            <ol class="space-y-3 p-0 m-0">{plan.quick.map((h, i) => row(h, i, true))}</ol>
            {plan.others.length > 0 && (
              <details class="bg-white rounded-2xl border border-slate-200 p-4">
                <summary class="cursor-pointer font-semibold text-slate-900">
                  {zh ? `其他还有额度的减免（视你的情况，${plan.others.length} 项）` : `Other reliefs with room left (depends on your situation, ${plan.others.length})`}
                </summary>
                <ul class="space-y-3 mt-3 p-0">{plan.others.map((h, i) => row(h, i, false))}</ul>
              </details>
            )}
          </>
        )}

        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
          {zh
            ? '提醒：只为本来就需要的东西花钱。减免只是让你少交一部分税——花 RM100 最多省 RM30，不是白拿。PRS 和 SSPN 是储蓄，钱仍然是你的。'
            : 'Only spend on things you actually need. A relief only cuts part of the tax — spending RM100 saves at most RM30. PRS and SSPN are savings: the money stays yours.'}
        </div>

        {toolkitUrl && (
          <div class="bg-white rounded-2xl border-2 border-emerald-600 p-5">
            <p class="font-semibold text-slate-900">{zh ? '想把每一项都用好？' : 'Want a checklist for every relief?'}</p>
            <p class="text-sm text-slate-600 mt-1">
              {zh
                ? '「YA2026 报税 + 省税工具包」：Excel 规划表自动算、每项减免要留的收据清单、e-Filing 中文步骤。'
                : 'The YA2026 Tax Toolkit: an auto-calculating Excel planner, receipts checklist for every relief, and step-by-step e-Filing guide.'}
            </p>
            <a href={toolkitUrl} class="inline-block mt-3 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700" rel="noopener" target="_blank">
              {zh ? `获取工具包 ${toolkitPrice}` : `Get the toolkit ${toolkitPrice}`}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
