import wrinkleFreeGif from '../assets/Wrinkle-free.gif';
import noOdorGif from '../assets/no-odor.gif';
import flexibilityImg from '../assets/Maximum-flexibility.webp';
import breathableImg from '../assets/Breathable-and-fast-drying.webp';
import {useTranslation} from '~/hooks/useTranslation';

export function ProductFeatures() {
  const {t} = useTranslation();

  const features = [
    {
      image: wrinkleFreeGif,
      titleKey: 'product.features.wrinkleFree.title',
      descriptionKey: 'product.features.wrinkleFree.description'
    },
    {
      image: noOdorGif,
      titleKey: 'product.features.noOdor.title',
      descriptionKey: 'product.features.noOdor.description'
    },
    {
      image: flexibilityImg,
      titleKey: 'product.features.flexibility.title',
      descriptionKey: 'product.features.flexibility.description'
    },
    {
      image: breathableImg,
      titleKey: 'product.features.breathable.title',
      descriptionKey: 'product.features.breathable.description'
    }
  ];

  return (
    <div className="py-16 bg-white flex flex-col gap-8 items-center">
      <span className="text-3xl font-bold uppercase mb-4 text-center">{t('product.features.title')}</span>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative w-24 h-24 mb-6">
                <img
                  src={feature.image}
                  alt={t(feature.titleKey)}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium mb-2">{t(feature.titleKey)}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
