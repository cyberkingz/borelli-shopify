/**
 * Builds a URL with the shop's domain and locale
 * @param {string} path
 * @param {string} locale
 * @returns {string}
 */
export function buildShopUrl(path, locale = 'en') {
  const publicDomain = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.PUBLIC_STORE_DOMAIN;
    
  return `${publicDomain}/${locale}${path}`;
}
