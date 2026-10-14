import type { Lang } from '../lib/tax/types';

/** Picks the string (or JSX) for the current language: L('中文', 'English', 'Bahasa Melayu'). */
export const tri =
  (lang: Lang) =>
  <T,>(zh: T, en: T, ms: T): T =>
    lang === 'zh' ? zh : lang === 'ms' ? ms : en;
