import {getAllowedMarkets, isDefaultMarket} from '~/config/markets';
import {redirectToLocale} from '~/lib/market';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context, request}) {
  const {language, country} = context.storefront.i18n;
  const allowedMarkets = getAllowedMarkets();
  const currentLocale = params.locale || '';
  
  // Handle default market (UK)
  if (isDefaultMarket(currentLocale)) {
    return null; // Allow access to root without locale
  }

  // For non-default markets, validate the locale
  if (!allowedMarkets.includes(currentLocale)) {
    // If invalid locale, redirect to default market (UK)
    return redirectToLocale(request, '');
  }

  // If the locale doesn't match the storefront settings, redirect
  const expectedLocale = `${language}-${country}`.toLowerCase();
  if (currentLocale !== expectedLocale && !isDefaultMarket(expectedLocale)) {
    return redirectToLocale(request, expectedLocale);
  }

  return null;
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
