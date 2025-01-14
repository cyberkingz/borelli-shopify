import {defer} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {useTranslation} from '~/hooks/useTranslation';
import collectionCover from '../assets/collection/collection-cover.png';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = () => {
  return [{title: `Barker London | Collections`}];
};

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
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
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

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();
  const {t} = useTranslation();

  return (
    <div className="collection">
      <div 
        className="relative py-20 mb-8 bg-cover bg-center bg-no-repeat min-h-[300px] flex items-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${collectionCover})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold text-center mb-4 text-white">{t('collection.allProducts')}</h1>
          <p className="text-center text-white text-opacity-90 max-w-2xl mx-auto">
            {t('collection.description')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {products.nodes.length > 0 ? (
          <PaginatedResourceSection
            connection={products}
            resourcesClassName="products-grid"
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium mb-6">{t('collection.noProducts')}</h2>
            <Link 
              to="/" 
              className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              {t('collection.backToHome')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  return (
    <Link
      className="group block"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        {product.featuredImage && (
          <div className="aspect-[1/1.3] overflow-hidden">
            <Image
              alt={product.featuredImage.altText || product.title}
              data={product.featuredImage}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <h4 className="text-base uppercase tracking-wide font-medium text-gray-900 group-hover:text-black transition-colors">{product.title}</h4>
        <div className="mt-1">
          <Money 
            data={product.priceRange.minVariantPrice} 
            className="text-sm font-semibold text-gray-800" 
          />
        </div>
      </div>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2024-01/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
