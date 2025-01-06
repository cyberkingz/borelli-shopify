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
import { useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: data?.product?.title ? `Barker London | ${data.product.title}` : 'Barker London'},
    {description: data?.product?.description ?? 'Barker London product page'}
  ];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader({params, context, request}) {
  const {handle} = params;
  const {storefront} = context;

  // Get selected options from the URL
  const selectedOptions = getSelectedProductOptions(request) || [];
  
  // If we have a color but no size, we still want to show that color's images
  const url = new URL(request.url);
  const colorParam = url.searchParams.get('Color');
  if (colorParam && !url.searchParams.get('Size') && !url.searchParams.get('Shoe Size')) {
    selectedOptions.push({ name: 'Color', value: colorParam });
  }

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
      selectedOptions,
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
  const [douSelected, setDouSelected] = useState('single');
  const [firstSelectedVariant, setFirstSelectedVariant] = useState(null);
  const [secondSelectedVariant, setSecondSelectedVariant] = useState(null);
  const [firstSelectedOptions, setFirstSelectedOptions] = useState([]);
  const [secondSelectedOptions, setSecondSelectedOptions] = useState([]);
  const [percentageSaved, setPercentageSaved] = useState(0);
  const [douTotalPrice, setDouTotalPrice] = useState(0);
  // Get the current URL parameters
  const [searchParams] = useSearchParams();
  const colorOption = searchParams.get('Color');
  
  // Find the variant that matches the selected color
  let initialVariant = product.selectedOrFirstAvailableVariant;
  if (colorOption) {
    const colorVariant = product.variants?.nodes?.find(variant => 
      variant.selectedOptions.some(opt => 
        opt.name === 'Color' && opt.value === colorOption
      )
    );
    if (colorVariant) {
      initialVariant = colorVariant;
    }
  }

  const selectedVariant = useOptimisticVariant(
    initialVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });
  
  useEffect(() => {
    
    setFirstSelectedVariant(initialVariant);
    setSecondSelectedVariant(initialVariant);
    setFirstSelectedOptions(initialVariant?.selectedOptions);
    setSecondSelectedOptions(initialVariant?.selectedOptions);
    const discountAmount = parseFloat(initialVariant?.compareAtPrice?.amount) - parseFloat(initialVariant?.price?.amount);
    const discountPercentage = (discountAmount / 100) * 100;
    setPercentageSaved(parseInt(discountPercentage));
    const totalAmount = parseFloat(initialVariant?.price?.amount) + parseFloat(initialVariant?.price?.amount);
    setDouTotalPrice({amount: totalAmount.toLocaleString(), currencyCode: initialVariant?.price?.currencyCode });

  },[initialVariant])
  
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12">
        {/* Left Column - Gallery */}
        <div>
          <ProductGallery 
            images={product.images.nodes} 
            title={product.title} 
            selectedVariant={selectedVariant}
          />
        </div>

        {/* Right Column - Product Info */}
        <div>
          <div className="grid gap-8 lg:gap-12">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
              firstSelectedVariant={firstSelectedVariant}
              setFirstSelectedVariant={setFirstSelectedVariant}
              secondSelectedVariant={secondSelectedVariant}
              setSecondSelectedVariant={setSecondSelectedVariant}
              title={product.title}
              vendor={product.vendor}
              product={product}
              douSelected={douSelected}
              setDouSelected={setDouSelected}
              firstSelectedOptions={firstSelectedOptions}
              setFirstSelectedOptions={setFirstSelectedOptions}
              secondSelectedOptions={secondSelectedOptions}
              setSecondSelectedOptions={setSecondSelectedOptions}
              douTotalPrice={douTotalPrice}
              setDouTotalPrice={setDouTotalPrice}
              percentageSaved={percentageSaved}
              setPercentageSaved={setPercentageSaved}
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
    variants(first: 50) {
      nodes {
        ...ProductVariant
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
      metafields(
        identifiers: [
          {namespace: "custom", key: "fog-blue"},
          {namespace: "custom", key: "marine-blue"}
        ]
      ) {
        key
        value
        namespace
      }
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
    collection(handle: "Bottoms") {
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
