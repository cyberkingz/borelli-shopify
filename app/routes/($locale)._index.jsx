import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Hero} from '~/components/Hero';
import {ProductSlider} from '~/components/ProductSlider';
import {CategorySection} from '~/components/CategorySection';
import {BundleSection} from '~/components/BundleSection';
import {BestsellerSection} from '~/components/BestsellerSection';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  
  // Get all collections and their products
  const {collections} = await storefront.query(COLLECTIONS_QUERY);

  const categoryTitles = [
    'Polos & T-Shirts',
    'Denim Jeans',
    'Layering',
    'Trousers'
  ];

  const categories = collections.nodes
    .filter(collection => categoryTitles.includes(collection.title))
    .sort((a, b) => {
      return categoryTitles.indexOf(a.title) - categoryTitles.indexOf(b.title);
    })
    .map(collection => ({
      handle: collection.handle,
      title: collection.title.toUpperCase(),
      image: collection.image
    }));

  const bundleCollection = collections.nodes.find(
    collection => collection.handle === 'bundles'
  );

  const bestsellerCollection = collections.nodes.find(
    collection => collection.handle === 'best-selling'
  );

  // Get all products
  const {products} = await storefront.query(PRODUCTS_QUERY);
  
  // Filter products to only show those from new-arrivals collection
  const newArrivalsProducts = products.nodes.filter(product => 
    product.collections.nodes.some(collection => collection.handle === 'new-arrivals')
  );

  return defer({
    newArrivalsProducts,
    categories,
    bundleCollection,
    bestsellerCollection
  });
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  return (
    <div className="home">
      <Hero />
      <ProductSlider 
        title="NEW: AUTUMN-WINTER COLLECTION"
        subtitle="The latest and greatest. See our new arrivals."
        products={data.newArrivalsProducts}
      />
      <CategorySection categories={data.categories} />
      {data.bundleCollection && (
        <BundleSection collection={data.bundleCollection} />
      )}
      {data.bestsellerCollection && (
        <BestsellerSection collection={data.bestsellerCollection} />
      )}
    </div>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 25) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;

const PRODUCTS_QUERY = `#graphql
  fragment ProductFields on Product {
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
      }
    }
    collections(first: 5) {
      nodes {
        handle
      }
    }
    tags
    updatedAt
  }
  
  query AllProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...ProductFields
      }
    }
  }
`;
