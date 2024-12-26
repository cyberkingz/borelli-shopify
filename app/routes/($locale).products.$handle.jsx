import {defer, json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductGallery} from '~/components/ProductGallery';
import {ProductForm} from '~/components/ProductForm';
import {ProductDetails} from '~/components/ProductDetails';
import {ProductFeatures} from '~/components/ProductFeatures';
import {ProductSlider} from '~/components/ProductSlider';
import {RecommendedProducts} from '~/components/RecommendedProducts';
import {InsuranceFeatures} from '~/components/InsuranceFeatures';
import {ImageSlider} from '~/components/ImageSlider';
import { ProductPageProductSlider } from '~/components/ProductPageProductSlider';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: data?.product?.title ? `Borelli | ${data.product.title}` : 'Borelli'},
    {description: data?.product?.description ?? 'Borelli product page'}
  ];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader({params, context, request}) {
  const {handle} = params;
  const {storefront} = context;

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
      selectedOptions: getSelectedProductOptions(request),
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // Get recommended products
  const {collection} = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {
      handle: 'recommended',
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  try {
    // Fetch the collection first
    const {collection: poloCollection} = await storefront.query(COLLECTION_QUERY);
    
    let poloProducts = [];
    if (poloCollection) {
      poloProducts = poloCollection.products.nodes;
    }

    return json({
      product,
      newArrivals: collection?.products?.nodes || [],
      poloProducts,
    });
  } catch (error) {
    console.error('Error fetching collection products:', error);
    return json({
      product,
      newArrivals: collection?.products?.nodes || [],
      poloProducts: [],
    });
  }
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context, params}) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product, newArrivals, poloProducts} = useLoaderData();
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12">
        {/* Left Column - Gallery */}
        <div>
          <ProductGallery 
            images={product.images.nodes} 
            title={product.title} 
          />
        </div>

        {/* Right Column - Product Info */}
        <div>
          <div className="grid gap-8 lg:gap-12">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
              title={product.title}
              vendor={product.vendor}
            />
          </div>

         

          {/* Recommended Products */}
          <ProductDetails description={product.description} />
        </div>

        

      </div>

    
    

      {/* Products Slider */}
      <ProductPageProductSlider products={poloProducts} />

      {/* Product Features Section */}
      <ProductFeatures />


      <RecommendedProducts products={newArrivals} />
      
      {/* Insurance Features Section */}
      <InsuranceFeatures />

      <ImageSlider />
      
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProducts(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 8) {
        nodes {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            nodes {
              id
              url
              altText
              width
              height
              src
            }
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `#graphql
  query Collections {
    collections(first: 100) {
      nodes {
        id
        handle
      }
    }
  }
`;

const COLLECTION_PRODUCTS_QUERY = `#graphql
  query CollectionProducts($handle: String!) {
    collection(handle: $handle) {
      products(first: 8) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  query CollectionWithProducts {
    collection(handle: "polos-t-shirts") {
      products(first: 8) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
