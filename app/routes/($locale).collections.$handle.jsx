import {defer, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {useTranslation} from '~/hooks/useTranslation';
import collectionCover from '../assets/collection/collection-cover.png';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Barker London | ${data?.collection.title ?? ''} Collection`}];
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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
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
  const {collection} = useLoaderData();
  const {t} = useTranslation();
  const handle = collection.handle;

  // Get category translations based on handle
  const categoryKey = handle.replace('-t-shirts', '').replace('-', '');
  const title = t(`collection.categories.${categoryKey}.title`);
  const description = t(`collection.categories.${categoryKey}.description`);

  return (
    <div className="collection">
      <div 
        className="relative py-20 mb-8 bg-cover bg-center bg-no-repeat max-h-[200px] lg:min-h-[350px] flex items-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${collectionCover})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold text-center mb-4 text-white">{title}</h1>
          {description && (
            <p className="text-center text-white text-opacity-90 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4">
        {collection.products.nodes.length > 0 ? (
          <PaginatedResourceSection
            connection={collection.products}
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
            <h2 className="text-2xl font-medium mb-6">No products in this collection</h2>
            <Link 
              to="/" 
              className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
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
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
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

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
