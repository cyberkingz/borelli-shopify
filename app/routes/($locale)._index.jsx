import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Hero} from '~/components/Hero';
import {ProductSlider} from '~/components/ProductSlider';
import {CategorySection} from '~/components/CategorySection';
import {BundleSection} from '~/components/BundleSection';
import {BestsellerSection} from '~/components/BestsellerSection';
import {VideoSlider} from '~/components/VideoSlider';
import {useTranslation} from '~/hooks/useTranslation';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Barker London | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  
  // Get all collections and their products
  const {collections} = await storefront.query(COLLECTIONS_QUERY);

  const categoryHandles = [
    'polos-t-shirts',
    'shoes',
    'wool',
    'bottoms'
  ];

  const categories = collections.nodes
    .filter(collection => categoryHandles.includes(collection.handle))
    .sort((a, b) => {
      return categoryHandles.indexOf(a.handle) - categoryHandles.indexOf(b.handle);
    })
    .map(collection => ({
      handle: collection.handle,
      title: collection.title,
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
  const {t} = useTranslation();

  return (
    <div className="home">
      <Hero />
      {newArrivalsCollection && (
        <ProductSlider
          title={t('newArrivals.title')}
          subtitle={t('newArrivals.subtitle')}
          products={newArrivalsCollection.products.nodes}
        />
      )}
      {categories?.length > 0 && <CategorySection categories={categories} />}
      {bundleCollection && <BundleSection collection={bundleCollection} />}
      {bestsellerCollection && (
        <BestsellerSection collection={bestsellerCollection} />
      )}
      <VideoSlider />
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
