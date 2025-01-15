import { countries } from '~/data/countries';

export function getLocaleFromRequest(request) {

  const url = new URL(request.url);

  switch (url.host) {
    case 'localhost:3000': {
      // Handle localhost environment
      if (/^\/fr-fr($|\/)/.test(url.pathname)) {
        return countries['fr-fr'];
      } else if(/^\/de-de($|\/)/.test(url.pathname)) {
        return countries['de-de'];
      } else {
        return countries['default'] || null; // Ensure a default locale exists
      }
    }
    case 'barkerlondon.com': {
      // Handle production environment
      if (/^\/fr-fr($|\/)/.test(url.pathname)) {
        return countries['fr-fr'];
      } else if(/^\/de-de($|\/)/.test(url.pathname)) {
        return countries['de-de'];
      } else {
        return countries['default'] || null; // Ensure a default locale exists
      }     
    }
    default: {
      // Fallback for unrecognized hosts
      return countries['default'] || null; // Ensure a default locale exists
    }
  }
}
