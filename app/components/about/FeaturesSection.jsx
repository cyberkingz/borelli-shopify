import {Image} from '@shopify/hydrogen';
import inHouseDesigns from '../../assets/about-us/IN-HOUSE-DESIGNS.png';
import premiumMaterials from '../../assets/about-us/PREMIUM-MATERIALS.png';
import comfortableFit from '../../assets/about-us/COMFORTABLE-FIT.png';

const features = [
  {
    title: 'IN-HOUSE DESIGNS',
    description: 'Each development is analyzed carefully by our team to ensure that it not only meets BORELLI\'s standards but also embodies exactly what customers from all over the world.',
    image: inHouseDesigns
  },
  {
    title: 'PREMIUM MATERIALS',
    description: 'Every design is perfected so that it offers adaptability and comfort with affordability. Countless samples have been re-measured and re-configured until we have finally achieved the ultimate material blend of premium fit and quality.',
    image: premiumMaterials
  },
  {
    title: 'COMFORTABLE FIT',
    description: 'Crafted from premium fabrication with a luxurious feel, whilst prioritizing durability. Our products are wearable year round, suitable for both casual & smart occasions. Giving you the best of both worlds.',
    image: comfortableFit
  }
];

export function FeaturesSection() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mb-6 aspect-square overflow-hidden">
                <Image
                  src={feature.image}
                  className="w-full h-full object-cover"
                  alt={feature.title}
                />
              </div>
              <div className='flex flex-col gap-4 justify-start text-left'>
              <span className="text-2xl font-bold">{feature.title}</span>
              <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
