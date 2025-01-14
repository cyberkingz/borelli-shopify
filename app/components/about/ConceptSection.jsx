import {Image} from '@shopify/hydrogen';
import {useTranslation} from '~/hooks/useTranslation';
import conceptImage from '../../assets/about-us/FROM-CONCEPT-TO-CREATION.jpg';

export function ConceptSection() {
  const {t} = useTranslation();

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          {/* Introduction text */}
          <p className="text-center text-gray-600 mb-20 max-w-3xl mx-auto">
            {t('about.concept.introduction')}
          </p>

          {/* Main content */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Image
                src={conceptImage}
                className="w-full rounded-lg"
                alt="Borelli design process"
              />
            </div>
            <div>
              <span className="text-4xl font-bold mb-8 flex flex-col gap-4">{t('about.concept.title')}</span>
              <p className="text-gray-600 mb-6">
                {t('about.concept.description1')}
              </p>
              <p className="text-gray-600">
                {t('about.concept.description2')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
