import {Image} from '@shopify/hydrogen';
import {useTranslation} from '~/hooks/useTranslation';
import inHouseDesigns from '../../assets/about-us/IN-HOUSE-DESIGNS.png';
import premiumMaterials from '../../assets/about-us/PREMIUM-MATERIALS.png';
import comfortableFit from '../../assets/about-us/COMFORTABLE-FIT.png';

export function FeaturesSection() {
  const {t} = useTranslation();

  const features = [
    {
      key: 'inHouseDesigns',
      image: inHouseDesigns
    },
    {
      key: 'premiumMaterials',
      image: premiumMaterials
    },
    {
      key: 'comfortableFit',
      image: comfortableFit
    }
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div key={feature.key} className="text-center">
              <div className="mb-6 aspect-square overflow-hidden">
                <Image
                  src={feature.image}
                  className="w-full h-full object-cover"
                  alt={t(`about.features.${feature.key}.title`)}
                />
              </div>
              <div className='flex flex-col gap-4 justify-start text-left'>
                <span className="text-2xl font-bold">{t(`about.features.${feature.key}.title`)}</span>
                <p className="text-gray-600 text-sm">{t(`about.features.${feature.key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
