import type { APIRoute } from 'astro';
import { CONFIG } from '../config';
import { RELIEF_SLUGS } from '../data/reliefMeta';
import { SALARY_STEPS } from '../data/salaries';
import { absolute, href } from '../i18n/paths';

const PATHS = [
  '',
  'budget-2027/',
  'tax-calculator/',
  'year-end-planner/',
  'salary/',
  'reliefs/',
  'guides/',
  'guides/year-end-tax-tips/',
  'guides/e-filing/',
  'about/',
  'privacy/',
  ...RELIEF_SLUGS.map((s) => `reliefs/${s}/`),
  ...SALARY_STEPS.map((m) => `salary/rm${m}/`),
];

const priority = (p: string) => (p === '' || p === 'budget-2027/' ? '1.0' : p.split('/').length <= 2 ? '0.8' : '0.6');

export const GET: APIRoute = ({ site }) => {
  const urls = PATHS.flatMap((p) =>
    (['zh', 'en'] as const).map((lang) => {
      const loc = absolute(href(lang, p), site);
      const zh = absolute(href('zh', p), site);
      const en = absolute(href('en', p), site);
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${CONFIG.updated}</lastmod>
    <priority>${priority(p)}</priority>
    <xhtml:link rel="alternate" hreflang="zh-MY" href="${zh}"/>
    <xhtml:link rel="alternate" hreflang="en-MY" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
  </url>`;
    }),
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
