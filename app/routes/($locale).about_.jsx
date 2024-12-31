import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {HeroSection} from '~/components/about/HeroSection';
import {ConceptSection} from '~/components/about/ConceptSection';
import {FeaturesSection} from '~/components/about/FeaturesSection';
import {VisionSection} from '~/components/about/VisionSection';
import {CommitmentSection} from '~/components/about/CommitmentSection';
import {CTASection} from '~/components/about/CTASection';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'About Us | Barker London'},
    {
      description:
        'Discover the story behind Barker London - crafting the perfect fit for men since 2018. Learn about our commitment to quality, innovation, and style.',
    },
  ];
};

export function shouldRevalidate() {
  return false;
}

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  return json({
    isLoaded: true
  });
}

export default function About() {
  const {isLoaded} = useLoaderData();
  
  return (
    <div className="about-page">
      <HeroSection />
      <ConceptSection />
      <FeaturesSection />
      <VisionSection />
      <CommitmentSection />
      <CTASection />
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
