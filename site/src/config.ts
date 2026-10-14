/**
 * Everything you may need to change after launch lives here.
 * Empty strings switch the related feature off.
 */
export const CONFIG = {
  brand: { zh: '省税啦', en: 'MyTaxLah' },
  /** Payhip (or other) checkout link for the paid toolkit. Empty = toolkit CTA hidden. */
  toolkitUrl: 'https://payhip.com/b/4Wxh0',
  toolkitPrice: 'US$4.49 (≈RM19)',
  /** Agent edition: order link (e.g. a Payhip product) and price label. Empty URL = no order button. */
  agentOrderUrl: '',
  agentPrice: { zh: 'RM99 / 年', en: 'RM99 / year' },
  /** Google AdSense publisher id, e.g. "ca-pub-1234567890123456". Empty = no ads. */
  adsenseClient: '',
  /** Cloudflare Web Analytics token. Empty = no analytics. */
  cfAnalyticsToken: '',
  /** Google Search Console HTML-tag verification code (the content="..." value). */
  googleSiteVerification: '',
  /** Bing Webmaster Tools verification code (msvalidate.01). */
  bingSiteVerification: '',
  /** Public contact address shown on the About page. Empty = hidden. */
  contactEmail: '',
  /** Shown as "last updated" on calculators and guides. */
  updated: '2026-10-14',
} as const;
