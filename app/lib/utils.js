import {countries} from '~/data/countries';

export function getLocaleFromRequest(request) {
  const url = new URL(request.url);
  console.log(url);
  switch (url.host) {
    case 'ca.hydrogen.shop':
      if (/^\/fr($|\/)/.test(url.pathname)) {
        return countries['fr-ca'];
      } else {
        return countries['en-ca'];
      }
      break;
    case 'hydrogen.au':
      return countries['en-au'];
      break;
    default:
      return countries['default'];
  }
}