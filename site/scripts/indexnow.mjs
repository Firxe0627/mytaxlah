// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver…) about every URL in the live sitemap.
// Usage: node scripts/indexnow.mjs <site-root-url>
// e.g.   node scripts/indexnow.mjs https://firxe0627.github.io/mytaxlah/
const KEY = '58773ea08239019a9270690e39bc9949';

const root = (process.argv[2] || 'https://firxe0627.github.io/mytaxlah/').replace(/\/?$/, '/');
const sitemap = await fetch(`${root}sitemap.xml`).then((r) => {
  if (!r.ok) throw new Error(`sitemap ${r.status}`);
  return r.text();
});
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const host = new URL(root).host;

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${root}${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs for ${host} → HTTP ${res.status}`);
if (res.status >= 400) {
  console.log(await res.text());
  process.exit(1);
}
