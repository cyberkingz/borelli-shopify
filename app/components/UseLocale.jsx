import { useMatches } from '@remix-run/react';

export function useLocale() {
  const matches = useMatches();
  const localeData = matches.find((match) => match.data?.selectedLocale);
  const selectedLocale = localeData?.data?.selectedLocale;

  return selectedLocale;
}
