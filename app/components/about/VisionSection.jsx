import {Image} from '@shopify/hydrogen';
import {useTranslation} from '~/hooks/useTranslation';
import visionImage from '../../assets/about-us/OUR-VISION.jpg';

export function VisionSection() {
  const {t} = useTranslation();

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Image
                src={visionImage}
                className="w-full rounded-lg"
                alt="Man wearing Borelli clothing"
              />
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-4xl font-bold">{t('about.vision.title')}</span>
              <p className="text-gray-600">
                {t('about.vision.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
