import {MARKETS, DEFAULT_MARKET, getMarketByLocale, isDefaultMarket} from '~/config/markets';

export function getLocaleFromRequest(request) {
  const url = new URL(request.url);
  const [, pathPrefix] = url.pathname.split('/');
  return pathPrefix || '';
}

export function redirectToLocale(request, locale) {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  
  // Handle default market (UK)
  if (isDefaultMarket(locale)) {
    // If we're already at root or only have locale, just go to root
    if (segments.length <= 2) {
      url.pathname = '/';
    } else {
      // Remove the locale segment if it exists
      segments.splice(1, 1);
      url.pathname = segments.join('/');
    }
  } else {
    // Handle non-default markets
    if (segments[1] && segments[1] !== locale) {
      segments[1] = locale;
    } else if (!segments[1]) {
      segments.splice(1, 0, locale);
    }
    url.pathname = segments.join('/');
  }

  return new Response(null, {
    status: 302,
    headers: {Location: url.toString()},
  });
}

export function getMarketVariables(locale) {
  const market = getMarketByLocale(locale);
  return {
    language: market.language,
    country: market.countryCode,
    currency: market.currency,
  };
}

export function formatPrice(amount, locale) {
  const market = getMarketByLocale(locale);
  return new Intl.NumberFormat(market.defaultLocale, {
    style: 'currency',
    currency: market.currency,
  }).format(amount);
}
