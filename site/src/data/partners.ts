import type { L10n } from '../lib/tax/types';

/**
 * Agent edition: one branded calculator page per partner at /p/<slug>/ (and /en/p/<slug>/).
 * Pages are noindex and not in the sitemap — partners share the link themselves.
 */
export interface Partner {
  slug: string;
  /** Demo page: WhatsApp button explains the offer instead of opening a chat. */
  demo?: boolean;
  name: L10n;
  title: L10n;
  company?: string;
  /** Image under public/partners/, e.g. "partners/jane.jpg". Initials are shown when empty. */
  photo?: string;
  /** WhatsApp number with country code, digits only, e.g. "60123456789". */
  whatsapp?: string;
  /** Relief ids the partner helps with, in display order. */
  focus: string[];
  intro?: L10n;
  /** Brand colour for buttons/header (hex). */
  color?: string;
  /** Paid until (YYYY-MM-DD). Informational; renew or remove the entry after this date. */
  paidUntil?: string;
}

export const PARTNERS: Partner[] = [
  {
    slug: 'demo',
    demo: true,
    name: { zh: '示范顾问', en: 'Demo Advisor', ms: 'Penasihat Demo' },
    title: { zh: '保险与 PRS 顾问（示范页面）', en: 'Insurance & PRS advisor (demo page)', ms: 'Penasihat insurans & PRS (halaman demo)' },
    focus: ['lifeInsurance', 'eduMedInsurance', 'prs'],
    intro: {
      zh: '输入你的月薪，看看今年保险和 PRS 减免还能帮你省多少税。12 月 31 日前缴的保费和供款才算 YA2026。',
      en: 'Enter your salary to see how much tax your insurance and PRS reliefs can still save you. Only premiums and contributions paid by 31 December count for YA2026.',
      ms: 'Masukkan gaji anda untuk melihat berapa banyak cukai yang masih boleh dijimatkan melalui pelepasan insurans dan PRS. Hanya premium dan caruman yang dibayar sebelum 31 Disember dikira untuk YA2026.',
    },
    color: '#0f766e',
  },
];
