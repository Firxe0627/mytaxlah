import { useState } from 'preact/hooks';
import { YA2026 } from '../../data/ya2026';
import { YA2027 } from '../../data/ya2027';
import { rm } from '../../lib/format';
import { partnerPlan } from '../../lib/tax/partner';
import type { Lang } from '../../lib/tax/types';
import { t } from '../../i18n/ui';
import { MoneyInput, Stepper, usePersisted } from './ui';

interface FocusMeta {
  id: string;
  name: string;
  short: string;
}

interface Props {
  lang: Lang;
  slug: string;
  partnerName: string;
  whatsapp?: string;
  demo?: boolean;
  color: string;
  focus: FocusMeta[];
  /** Where the demo button sends agents who want their own page. */
  offerHref: string;
}

interface State {
  monthly: number;
  bonusMonths: number;
  paid: Record<string, number>;
}

export default function PartnerCalc({ lang, slug, partnerName, whatsapp, demo, color, focus, offerHref }: Props) {
  const zh = lang === 'zh';
  const [s, setS] = usePersisted<State>(`mtl.partner.${slug}`, { monthly: 6_000, bonusMonths: 1, paid: {} });
  const [showDemoNote, setShowDemoNote] = useState(false);
  const plan = partnerPlan(
    YA2026,
    YA2027,
    s,
    focus.map((f) => f.id),
  );
  const nameOf = new Map(focus.map((f) => [f.id, f]));

  const message = zh
    ? `你好${partnerName}，我用了你的省税计算器：月薪 ${rm(s.monthly)}，保险/PRS 减免还能帮我省约 ${rm(plan.totalSaving)} 税。想了解怎么在年底前用满。`
    : `Hi ${partnerName}, I used your tax calculator: salary ${rm(s.monthly)} a month, and my insurance/PRS reliefs could still save me about ${rm(plan.totalSaving)} in tax. I'd like to know how to use them before year-end.`;
  const waHref = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}` : undefined;

  return (
    <div class="space-y-5">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <MoneyInput id={`pc-monthly`} label={t(lang, 'calc.monthlySalary')} value={s.monthly} onChange={(v) => setS((p) => ({ ...p, monthly: v }))} />
          <Stepper id="pc-bonus" label={t(lang, 'calc.bonusMonths')} value={s.bonusMonths} onChange={(v) => setS((p) => ({ ...p, bonusMonths: v }))} step={0.5} max={12} />
        </div>
        <p class="text-sm font-medium text-slate-700">{zh ? '今年已经缴了多少？（不确定就填 0）' : 'Paid so far this year? (0 if unsure)'}</p>
        <div class="grid sm:grid-cols-3 gap-4">
          {focus.map((f) => (
            <MoneyInput
              key={f.id}
              id={`pc-${f.id}`}
              label={<span class="font-normal">{f.name}</span>}
              value={s.paid[f.id] ?? 0}
              onChange={(v) => setS((p) => ({ ...p, paid: { ...p.paid, [f.id]: v } }))}
            />
          ))}
        </div>
      </div>

      <div class="rounded-2xl text-white p-5" style={{ background: `linear-gradient(135deg, ${color}, #10b981)` }} aria-live="polite">
        {plan.tax === 0 ? (
          <>
            <p class="text-lg font-semibold">{zh ? '你目前预计不用交税' : 'You’re not expected to pay tax this year'}</p>
            <p class="text-sm text-white/85 mt-1">{zh ? '减免对你暂时没有省税效果，但保障本身仍然重要。' : 'Reliefs won’t cut your tax right now, but protection itself still matters.'}</p>
          </>
        ) : (
          <>
            <p class="text-sm text-white/85">{zh ? '用满这些减免，YA2026 还能少交' : 'Use these reliefs in full and your YA2026 tax drops by'}</p>
            <p class="text-5xl font-extrabold mt-1 text-yellow-300 num">{rm(plan.totalSaving)}</p>
            <p class="text-sm text-white/90 mt-2">
              {zh ? '目前预计税额' : 'Current estimated tax'} <b class="num">{rm(plan.tax, true)}</b> · {t(lang, 'calc.marginalRate')} <b>{plan.marginalRate}%</b>
            </p>
          </>
        )}
      </div>

      {plan.tax > 0 && (
        <div class="space-y-3">
          {plan.rows.map((r) => (
            <div key={r.id} class="bg-white rounded-2xl border border-slate-200 p-4 flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-slate-900">{nameOf.get(r.id)?.name}</p>
                <p class="text-sm text-slate-600 mt-0.5">{nameOf.get(r.id)?.short}</p>
                <p class="text-xs text-slate-500 mt-1 num">
                  {zh ? `上限 ${rm(r.limit)} · 已用 ${rm(r.used)} · 还剩 ${rm(r.remaining)}` : `Limit ${rm(r.limit)} · used ${rm(r.used)} · left ${rm(r.remaining)}`}
                </p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-lg font-bold num" style={{ color }}>
                  {rm(r.saving)}
                </p>
                <p class="text-xs text-slate-500">{zh ? '可省' : 'saving'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {plan.budget2027Saving > 0 && (
        <p class="text-sm rounded-xl bg-amber-50 border border-amber-200 text-amber-900 p-3">
          {zh
            ? `另外，2027 年预算案通过后，你从 YA2027 起每年还会再少交约 ${rm(plan.budget2027Saving)}。`
            : `On top of that, if Budget 2027 passes you’ll pay about ${rm(plan.budget2027Saving)} less a year from YA2027.`}
        </p>
      )}

      <div class="sticky bottom-3">
        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            class="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#25D366] text-white text-lg font-bold shadow-lg hover:brightness-95"
          >
            {zh ? `WhatsApp ${partnerName}，帮我用满减免` : `WhatsApp ${partnerName} to use these reliefs`}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setShowDemoNote(true)}
            class="w-full py-4 rounded-2xl bg-[#25D366] text-white text-lg font-bold shadow-lg hover:brightness-95"
          >
            {zh ? `WhatsApp ${partnerName}，帮我用满减免` : `WhatsApp ${partnerName} to use these reliefs`}
          </button>
        )}
      </div>
      {demo && showDemoNote && (
        <div class="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-4 text-sm text-slate-700">
          <p class="font-semibold text-slate-900">{zh ? '这是示范页面' : 'This is a demo page'}</p>
          <p class="mt-1">
            {zh
              ? '正式版会直接打开你的 WhatsApp，并自动带上客户算出来的省税金额，例如：'
              : 'The real version opens your WhatsApp with the client’s saving already filled in, for example:'}
          </p>
          <p class="mt-2 italic text-slate-600">“{message}”</p>
          <a href={offerHref} class="inline-block mt-3 font-semibold underline" style={{ color }}>
            {zh ? '我也要一个专属计算器 →' : 'Get your own calculator →'}
          </a>
        </div>
      )}
    </div>
  );
}
