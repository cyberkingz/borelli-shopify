import {useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 9,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const {collections} = useLoaderData();

  return (
    <div className="collections">
      <div className="bg-gray-100 py-8 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Collections</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Browse our curated collections of premium clothing
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {collections.nodes.length > 0 ? (
          <PaginatedResourceSection
            connection={collections}
            resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
          >
            {({node: collection, index}) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                index={index}
              />
            )}
          </PaginatedResourceSection>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium mb-6">No collections available</h2>
            <Link 
              to="/" 
              className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   collection: CollectionFragment;
 *   index: number;
 * }}
 */
function CollectionItem({collection, index}) {
  const collectionImage = collection.image || 
    (collection.products.nodes[0]?.featuredImage);

  const imageUrl = collectionImage?.originalSrc || collectionImage?.url;

  return (
    <Link
      className="group block"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        {imageUrl ? (
          <>
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={imageUrl}
                alt={collectionImage.altText || collection.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            </div>
            <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white px-4 drop-shadow-lg">
                  {collection.title}
                </h2>
                {collection.description && (
                  <p className="mt-2 text-sm text-white px-4 drop-shadow max-w-xs opacity-90">
                    {collection.description}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
      originalSrc
    }
    description
    products(first: 1) {
      nodes {
        featuredImage {
          id
          url
          altText
          width
          height
          originalSrc
        }
      }
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
