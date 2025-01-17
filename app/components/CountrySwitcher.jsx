import { Form, useMatches, useLocation, useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';

export function CountrySwitcher() {
  const [root] = useMatches();
  const selectedLocale = root?.data?.selectedLocale; // Optional chaining for safe access
  const { pathname, search } = useLocation();

  const [countries, setCountries] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Get available countries list using fetcher
  const fetcher = useFetcher();
  useEffect(() => {
    // Only load data if it's not already loaded
    if (!fetcher.data && isLoading) {
      fetcher.load('/api/countries');
      setIsLoading(false);
    }

    // Set countries data once it is fetched
    if (fetcher.data && typeof fetcher.data === 'object') {
      setCountries(fetcher.data);
    }
  }, [fetcher.data, isLoading]); // Dependency on fetcher.data and isLoading

  const strippedPathname = pathname ? pathname.replace(selectedLocale?.pathPrefix || '', '') : ''; // Use optional chaining
  return (
    <details className="w-full relative">
      <summary className="text-right">{selectedLocale?.label || 'Select Locale'}</summary> {/* Fallback for undefined selectedLocale */}
      <div className="absolute top-0 bg-white overflow-auto border-t py-2 px-2 bg-contrast w-full max-h-36 text-right">
        {isLoading ? (
          <p>Loading countries...</p> // Loading state
        ) : Object.keys(countries).length > 0 ? (
          Object.keys(countries).map((countryKey) => {
            const locale = countries[countryKey];
            const hreflang = `${locale.language}-${locale.country}`;

            return (
              <Form method="post" action="/" key={hreflang}>
                <input type="hidden" name="language" value={locale.language} />
                <input type="hidden" name="country" value={locale.country} />
                <input
                  type="hidden"
                  name="path"
                  value={`${strippedPathname}${search}`}
                />
                <button type="submit">{locale.label}</button>
              </Form>
            );
          })
        ) : (
          <p>No countries available</p> // Fallback message if countries is empty
        )}
      </div>
    </details>
  );
}