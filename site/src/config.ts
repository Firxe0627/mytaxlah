/**
 * Everything you may need to change after launch lives here.
 * Empty strings switch the related feature off.
 */
export const CONFIG = {
  brand: { zh: '省税啦', en: 'MyTaxLah' },
  /** Payhip (or other) checkout link for the paid toolkit. Empty = toolkit CTA hidden. */
  toolkitUrl: '',
  toolkitPrice: 'RM19.90',
  /** Google AdSense publisher id, e.g. "ca-pub-1234567890123456". Empty = no ads. */
  adsenseClient: '',
  /** Cloudflare Web Analytics token. Empty = no analytics. */
  cfAnalyticsToken: '',
  /** Public contact address shown on the About page. Empty = hidden. */
  contactEmail: '',
  /** Shown as "last updated" on calculators and guides. */
  updated: '2026-10-14',
} as const;
