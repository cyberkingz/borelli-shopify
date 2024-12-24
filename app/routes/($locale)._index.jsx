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

  const newArrivalsCollection = collections.nodes.find(
    collection => collection.handle === 'new-arrivals'
  );

  return defer({
    categories,
    bundleCollection,
    bestsellerCollection,
    newArrivalsCollection,
  });
}

export default function Homepage() {
  const {
    categories,
    bundleCollection,
    bestsellerCollection,
    newArrivalsCollection,
  } = useLoaderData();

  return (
    <div className="home">
      <Hero />
      {newArrivalsCollection && (
        <ProductSlider
          title="NEW ARRIVALS"
          subtitle="Discover our latest additions"
          products={newArrivalsCollection.products.nodes}
        />
      )}
      <CategorySection categories={categories} />
      {bundleCollection && <BundleSection collection={bundleCollection} />}
      {bestsellerCollection && (
        <BestsellerSection collection={bestsellerCollection} />
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
          url
          altText
          width
          height
        }
        products(first: 8) {
          nodes {
            id
            title
            handle
            variants(first: 1) {
              nodes {
                id
                image {
                  url
                  altText
                  width
                  height
                }
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;
