export const MARKETS = {
  default: {
    label: 'United Kingdom',
    language: 'EN',
    currency: 'GBP',
    domain: import.meta.env.PUBLIC_STORE_DOMAIN,
    storeDomain: import.meta.env.PUBLIC_STORE_DOMAIN,
    countryCode: 'GB',
    defaultLocale: 'en-gb',
    isDefault: true,
    pathPrefix: '', // No prefix for UK
  },
  'de-de': {
    label: 'Deutschland',
    language: 'DE',
    currency: 'EUR',
    domain: import.meta.env.PUBLIC_STORE_DOMAIN,
    storeDomain: import.meta.env.PUBLIC_STORE_DOMAIN,
    countryCode: 'DE',
    defaultLocale: 'de-de',
    isDefault: false,
    pathPrefix: 'de-de', // German prefix
  },
};

export const DEFAULT_MARKET = 'default';

export function getMarketByLocale(locale) {
  if (!locale) return MARKETS[DEFAULT_MARKET];
  return Object.values(MARKETS).find(
    (market) => market.pathPrefix === locale
  ) || MARKETS[DEFAULT_MARKET];
}

export function getMarketByDomain(domain) {
  return Object.values(MARKETS).find(
    (market) => market.domain === domain
  ) || MARKETS[DEFAULT_MARKET];
}

export function getAllowedMarkets() {
  return Object.values(MARKETS)
    .filter(market => !market.isDefault)
    .map(market => market.pathPrefix);
}

export function isDefaultMarket(locale) {
  return !locale || locale === '';
}
