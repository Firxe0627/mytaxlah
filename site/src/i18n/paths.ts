import type { Lang } from '../lib/tax/types';

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

/** `path` is relative to the language root, e.g. "" or "budget-2027/". */
export function href(lang: Lang, path = ''): string {
  const clean = path.replace(/^\//, '');
  return `${BASE}${lang === 'en' ? 'en/' : ''}${clean}`;
}

export function asset(path: string): string {
  return `${BASE}${path.replace(/^\//, '')}`;
}

export function absolute(pathname: string, site: URL | undefined): string {
  return new URL(pathname, site ?? 'https://mytaxlah.com').toString();
}

export const otherLang = (lang: Lang): Lang => (lang === 'zh' ? 'en' : 'zh');

export const htmlLang = (lang: Lang) => (lang === 'zh' ? 'zh-Hans-MY' : 'en-MY');
