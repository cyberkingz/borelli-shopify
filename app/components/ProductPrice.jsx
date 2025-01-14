import {Money} from '@shopify/hydrogen';
import {useLocation} from '@remix-run/react';
import {getMarketByLocale} from '~/config/markets';

/**
 * A component that displays the product price with market-specific currency
 * @param {{price: MoneyV2}}
 */
export function ProductPrice({price}) {
  if (!price?.amount || !price?.currencyCode) return null;

  const location = useLocation();
  const [, locale] = location.pathname.split('/');
  const market = getMarketByLocale(locale);

  // Adjust the money data to use market currency
  const moneyData = {
    ...price,
    currencyCode: market.currency,
  };

  return <Money data={moneyData} />;
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
