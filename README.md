# MyTaxLah 省税啦

Free, bilingual (中文 / English) Malaysian personal income tax tools:

- Budget 2027 savings calculator (YA2026 vs YA2027)
- YA2026 income tax calculator with every LHDN relief
- Year-end tax planner
- Take-home salary calculator (EPF, SOCSO, EIS, PCB)
- Relief guides and programmatic salary pages

Built with Astro + Preact + Tailwind. All calculations run in the browser.

```bash
cd site
npm install
npm test        # tax engine unit tests
npm run dev     # local dev server
npm run build   # static site in site/dist
```

Tax data lives in `site/src/data/ya2026.ts` and `site/src/data/ya2027.ts`, each with its official source.
Results are estimates, not tax advice.
