import type { Lang } from '../lib/tax/types';

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

export const LANGS: Lang[] = ['zh', 'en', 'ms'];
const PREFIX: Record<Lang, string> = { zh: '', en: 'en/', ms: 'ms/' };

/** `path` is relative to the language root, e.g. "" or "budget-2027/". */
export function href(lang: Lang, path = ''): string {
  const clean = path.replace(/^\//, '');
  return `${BASE}${PREFIX[lang]}${clean}`;
}

export function asset(path: string): string {
  return `${BASE}${path.replace(/^\//, '')}`;
}

export function absolute(pathname: string, site: URL | undefined): string {
  return new URL(pathname, site ?? 'https://mytaxlah.com').toString();
}

export const otherLangs = (lang: Lang): Lang[] => LANGS.filter((l) => l !== lang);

export const htmlLang = (lang: Lang) => ({ zh: 'zh-Hans-MY', en: 'en-MY', ms: 'ms-MY' })[lang];

export const hreflang = (lang: Lang) => ({ zh: 'zh-MY', en: 'en-MY', ms: 'ms-MY' })[lang];

export const LANG_LABEL: Record<Lang, string> = { zh: '中文', en: 'English', ms: 'BM' };
